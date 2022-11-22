---
title: "CIS 强化指南"
weight: 80
---

本文档提供了用于强化 K3s 集群生产安装的说明。此处概述了为解决 CIS Kubernetes Benchmark 管控所需的配置和控制。

K3s 默认应用并启用了许多安全缓解措施，无需修改即可通过许多 Kubernetes CIS 管控。但是也有一些例外情况是需要人工干预才能完全通过 CIS Benchmark：

1. K3s 不会修改主机操作系统。任何主机级别的修改都需要手动完成。
2. `PodSecurityPolicies` 和 `NetworkPolicies` 的某些 CIS 策略会限制集群功能。你必须在命令行标志或配置文件中添加适当的选项（启用准入插件）以及手动应用策略，K3s 才能配置这它们。以下各节将介绍更多详细的信息。

CIS Benchmark 的第一部分 (1.1) 主要关注 Pod 清单权限和所有权。K3s 没有将它们用于核心组件，因为所有内容都打包成了一个二进制文件。

## 主机级别要求

主机级别的要求有两个方面，分别是内核参数和 etcd 进程/目录配置。本节会概述这些内容。

### 确保设置了 `protect-kernel-defaults`

这是一个 kubelet 标志，如果所需的内核参数未设置或设置为与 kubelet 默认值不同的值，它会导致 kubelet 退出。

> **注意**：`protect-kernel-defaults` 作为 K3s 的顶层标志公开。

#### 设置内核参数

创建一个名为 `/etc/sysctl.d/90-kubelet.conf` 的文件并添加下面的代码片段。然后运行 `sysctl -p /etc/sysctl.d/90-kubelet.conf`。

```bash
vm.panic_on_oom=0
vm.overcommit_memory=1
kernel.panic=10
kernel.panic_on_oops=1
kernel.keys.root_maxbytes=25000000
```

## Kubernetes 运行时要求

要符合 CIS Benchmark 的运行时要求，则需要以 pod 安全性 (PSP)、网络策略和 ​​API Server 审计日志为中心。本节会概述这些内容。K3s 不会应用任何默认的 PSP 或网络策略。然而，K3s 附带了一个控制器，用于应用一组给定的网络策略。默认情况下，K3s 使用 `NodeRestriction` 准入控制器运行。要启用 PSP，请将以下内容添加到 K3s 启动命令：`--kube-apiserver-arg="enable-admission-plugins=NodeRestriction,PodSecurityPolicy,ServiceAccount"`。这将能维护 `NodeRestriction` 插件以及启用 `PodSecurityPolicy`。API Server 审计日志也是如此，K3s 默认不启用它们，因此你必须手动创建审计日志配置和审计策略。

### Pod 安全策略

启用 PSP 后可以应用策略，从而满足 CIS Benchmark 第 5.2 节中描述的必要管控。

以下是一个符合要求的 PSP 示例：

```yaml
apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  name: restricted-psp
spec:
  privileged: false                # CIS - 5.2.1
  allowPrivilegeEscalation: false  # CIS - 5.2.5
  requiredDropCapabilities:        # CIS - 5.2.7/8/9
    - ALL
  volumes:
    - 'configMap'
    - 'emptyDir'
    - 'projected'
    - 'secret'
    - 'downwardAPI'
    - 'csi'
    - 'persistentVolumeClaim'
    - 'ephemeral'
  hostNetwork: false               # CIS - 5.2.4
  hostIPC: false                   # CIS - 5.2.3
  hostPID: false                   # CIS - 5.2.2
  runAsUser:
    rule: 'MustRunAsNonRoot'       # CIS - 5.2.6
  seLinux:
    rule: 'RunAsAny'
  supplementalGroups:
    rule: 'MustRunAs'
    ranges:
      - min: 1
        max: 65535
  fsGroup:
    rule: 'MustRunAs'
    ranges:
      - min: 1
        max: 65535
  readOnlyRootFilesystem: false
```

要使上述 PSP 生效，我们需要创建一个 ClusterRole 和一个 ClusterRoleBinding。此外，还需要包括一个“不受系统限制的策略”（用于需要额外权限的系统级 pod）以及一个 servicelb 正常运行所需的 sysctls 策略。

上面的 PSP yaml 和下面的 NetworkPolicy yaml 可以组合成一个文件，放在 `/var/lib/rancher/k3s/server/manifests` 目录中。以下是 `policy.yaml` 文件的示例：

```yaml
apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  name: restricted-psp
spec:
  privileged: false
  allowPrivilegeEscalation: false
  requiredDropCapabilities:
    - ALL
  volumes:
    - 'configMap'
    - 'emptyDir'
    - 'projected'
    - 'secret'
    - 'downwardAPI'
    - 'csi'
    - 'persistentVolumeClaim'
    - 'ephemeral'
  hostNetwork: false
  hostIPC: false
  hostPID: false
  runAsUser:
    rule: 'MustRunAsNonRoot'
  seLinux:
    rule: 'RunAsAny'
  supplementalGroups:
    rule: 'MustRunAs'
    ranges:
      - min: 1
        max: 65535
  fsGroup:
    rule: 'MustRunAs'
    ranges:
      - min: 1
        max: 65535
  readOnlyRootFilesystem: false
---
apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  name: system-unrestricted-psp
  annotations:
    seccomp.security.alpha.kubernetes.io/allowedProfileNames: '*'
spec:
  allowPrivilegeEscalation: true
  allowedCapabilities:
  - '*'
  fsGroup:
    rule: RunAsAny
  hostIPC: true
  hostNetwork: true
  hostPID: true
  hostPorts:
  - max: 65535
    min: 0
  privileged: true
  runAsUser:
    rule: RunAsAny
  seLinux:
    rule: RunAsAny
  supplementalGroups:
    rule: RunAsAny
  volumes:
  - '*'
---
apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  name: svclb-psp
  annotations:
    seccomp.security.alpha.kubernetes.io/allowedProfileNames: '*'
spec:
  allowPrivilegeEscalation: false
  allowedCapabilities:
  - NET_ADMIN
  allowedUnsafeSysctls:
  - net.ipv4.ip_forward
  - net.ipv6.conf.all.forwarding
  fsGroup:
    rule: RunAsAny
  hostPorts:
  - max: 65535
    min: 0
  runAsUser:
    rule: RunAsAny
  seLinux:
    rule: RunAsAny
  supplementalGroups:
    rule: RunAsAny
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: psp:restricted-psp
rules:
- apiGroups:
  - policy
  resources:
  - podsecuritypolicies
  verbs:
  - use
  resourceNames:
  - restricted-psp
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: psp:system-unrestricted-psp
rules:
- apiGroups:
  - policy
  resources:
  - podsecuritypolicies
  resourceNames:
  - system-unrestricted-psp
  verbs:
  - use
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: psp:svclb-psp
rules:
- apiGroups:
  - policy
  resources:
  - podsecuritypolicies
  resourceNames:
  - svclb-psp
  verbs:
  - use
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: default:restricted-psp
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: psp:restricted-psp
subjects:
- kind: Group
  name: system:authenticated
  apiGroup: rbac.authorization.k8s.io
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: system-unrestricted-node-psp-rolebinding
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: psp:system-unrestricted-psp
subjects:
- apiGroup: rbac.authorization.k8s.io
  kind: Group
  name: system:nodes
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: system-unrestricted-svc-acct-psp-rolebinding
  namespace: kube-system
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: psp:system-unrestricted-psp
subjects:
- apiGroup: rbac.authorization.k8s.io
  kind: Group
  name: system:serviceaccounts
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: svclb-psp-rolebinding
  namespace: kube-system
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: psp:svclb-psp
subjects:
- kind: ServiceAccount
  name: svclb
---
kind: NetworkPolicy
apiVersion: networking.k8s.io/v1
metadata:
  name: intra-namespace
  namespace: kube-system
spec:
  podSelector: {}
  ingress:
    - from:
      - namespaceSelector:
          matchLabels:
            name: kube-system
---
kind: NetworkPolicy
apiVersion: networking.k8s.io/v1
metadata:
  name: intra-namespace
  namespace: default
spec:
  podSelector: {}
  ingress:
    - from:
      - namespaceSelector:
          matchLabels:
            name: default
---
kind: NetworkPolicy
apiVersion: networking.k8s.io/v1
metadata:
  name: intra-namespace
  namespace: kube-public
spec:
  podSelector: {}
  ingress:
    - from:
      - namespaceSelector:
          matchLabels:
            name: kube-public
```

> **注意**：CNI、DNS 和 Ingress 等 Kubernetes 关键添加项会在 `kube-system` 命名空间中作为 pod 运行。因此，此命名空间的策略限制会更低，以便这些组件可以正常运行。

### NetworkPolicies

CIS 要求所有命名空间都应用网络策略，从而合理限制进入命名空间和 pod 的流量。

以下是一个符合要求的网络策略示例：

```yaml
kind: NetworkPolicy
apiVersion: networking.k8s.io/v1
metadata:
  name: intra-namespace
  namespace: kube-system
spec:
  podSelector: {}
  ingress:
    - from:
      - namespaceSelector:
          matchLabels:
            name: kube-system
```

应用限制后，除非有额外允许，否则 DNS 将被阻止。以下是允许 DNS 流量存在的网络策略：

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-network-dns-policy
  namespace: <NAMESPACE>
spec:
  ingress:
  - ports:
    - port: 53
      protocol: TCP
    - port: 53
      protocol: UDP
  podSelector:
    matchLabels:
      k8s-app: kube-dns
  policyTypes:
  - Ingress
```

如果未创建允许访问的网络策略，metrics-server 和 Traefik ingress controller 将被默认阻止。K3s 1.20 及以下版本中打包的 Traefik v1 使用的标签与 Traefik v2 不同。请确保你只使用了与集群上的 Traefik 版本相关联的以下 YAML 示例。

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-all-metrics-server
  namespace: kube-system
spec:
  podSelector:
    matchLabels:
      k8s-app: metrics-server
  ingress:
  - {}
  policyTypes:
  - Ingress
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-all-svclbtraefik-ingress
  namespace: kube-system
spec:
  podSelector:
    matchLabels:
      svccontroller.k3s.cattle.io/svcname: traefik
  ingress:
  - {}
  policyTypes:
  - Ingress
---
# Below is for 1.20 ONLY -- remove if on 1.21 or above
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-all-traefik-v120-ingress
  namespace: kube-system
spec:
  podSelector:
    matchLabels:
      app: traefik
  ingress:
  - {}
  policyTypes:
  - Ingress
---
# Below is for 1.21 and above ONLY -- remove if on 1.20 or below
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-all-traefik-v121-ingress
  namespace: kube-system
spec:
  podSelector:
    matchLabels:
      app.kubernetes.io/name: traefik
  ingress:
  - {}
  policyTypes:
  - Ingress
```

> **注意**：操作人员需要照常管理其他命名空间的网络策略。

### API Server 审计配置

CIS 1.2.22 到 1.2.25 要求为 API Server 配置审计日志。默认情况下，K3s 不会创建日志目录和审计策略，因为审计要求是取决于每个用户的策略和环境的。

理想情况下，必须在启动 K3s 之前创建日志目录。建议使用限制性访问权限，避免泄露敏感信息。

```bash
sudo mkdir -p -m 700 /var/lib/rancher/k3s/server/logs
```

以下是用于记录请求元数据的初始审核策略。策略需要写入到 `/var/lib/rancher/k3s/server` 目录中名为 `audit.yaml` 的文件。有关 API Server 策略配置的详细信息，请参阅 [Kubernetes 文档](https://kubernetes.io/docs/tasks/debug-application-cluster/audit/)。

```yaml
apiVersion: audit.k8s.io/v1
kind: Policy
rules:
- level: Metadata
```

两种配置都必须作为参数传递给 API Server，如下所示：

```bash
--kube-apiserver-arg='audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log'
--kube-apiserver-arg='audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml'
```

如果配置是在安装 K3s 之后创建的，则必须将它们添加到 `/etc/systemd/system/k3s.service` 中的 K3s systemd 服务中。

```bash
ExecStart=/usr/local/bin/k3s \
    server \
	'--kube-apiserver-arg=audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log' \
	'--kube-apiserver-arg=audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml' \
```

必须重启 K3s 才能加载新配置。

```bash
sudo systemctl daemon-reload
sudo systemctl restart k3s.service
```

下面介绍了 CIS 1.2.22 到 1.2.25 要求的其他信息。

## 已知问题
以下是 K3s 目前默认没有通过的管控。此处将解释各个差距，以及这些差距是否可以通过手动干预或在未来的 K3s 版本中解决。

### 管控 1.2.15
确保准入控制插件 `NamespaceLifecycle` 已设置。
<details>
<summary>原理</summary>
将准入控制策略设置为 NamespaceLifecycle 可以确保无法在不存在的命名空间中创建对象，而且正在终止的命名空间不会用于创建新对象。这是我们建议的操作，能确保命名空间终止过程的完整性以及更新对象的可用性。

可以将此参数作为值传递给 `enable-admission-plugins=`，然后再将其传递给  `k3s server` 的 `--kube-apiserver-arg=` 参数来解决此问题。你可以在下方找到示例。
</details>

### 管控 1.2.16
确保准入控制插件 `PodSecurityPolicy` 已设置。
<details>
<summary>原理</summary>
Pod 安全策略是集群级资源，它控制 Pod 可以执行的操作以及它可以访问的内容。`PodSecurityPolicy` 对象定义了一组条件，一个 pod 必须满足这些条件才能被系统接受。Pod 安全策略由控制 Pod 有权访问的安全功能设置和策略组成，因此必须用来控制 Pod 访问权限。

可以将此参数作为值传递给 `enable-admission-plugins=`，然后再将其传递给  `k3s server` 的 `--kube-apiserver-arg=` 参数来解决此问题。你可以在下方找到示例。
</details>

### 管控 1.2.22
确保设置了 `--audit-log-path` 参数。
<details>
<summary>原理</summary>
审计 Kubernetes API Server 提供了一组与安全相关的，按时间顺序排列的记录，记录了单个用户、管理员或系统其他组件对系统造成影响的活动序列。虽然目前 Kubernetes 仅提供基本的审计功能，但你还是应该启用它。你可以通过设置适当的审计日志路径来启用它。

可以将此参数作为值传递给 `k3s server` 的 `--kube-apiserver-arg=` 参数来解决此问题。你可以在下方找到示例。
</details>

### 管控 1.2.23
确保将 `--audit-log-maxage` 参数设置为 30 或适当的值。
<details>
<summary>原理</summary>
将日志保留至少 30 天可以确保你能及时调查或关联任何事件。将审计日志保留期设置为 30 天，或根据你的业务要求进行设置。

可以将此参数作为值传递给 `k3s server` 的 `--kube-apiserver-arg=` 参数来解决此问题。你可以在下方找到示例。
</details>

### 管控 1.2.24
确保将 `--audit-log-maxbackup` 参数设置为 10 或适当的值。
<details>
<summary>原理</summary>
Kubernetes 会自动轮换日志文件。保留旧日志文件可以确保你有足够的日志数据来执行调查或关联。例如，如果你已将文件大小设置为 100 MB 并将要保留的旧日志文件数设置为 10，那么你将有大约 1 GB 的日志数据用于分析。

可以将此参数作为值传递给 `k3s server` 的 `--kube-apiserver-arg=` 参数来解决此问题。你可以在下方找到示例。
</details>

### 管控 1.2.25
确保将 `--audit-log-maxsize` 参数设置为 100 或适当的值。
<details>
<summary>原理</summary>
Kubernetes 会自动轮换日志文件。保留旧日志文件可以确保你有足够的日志数据来执行调查或关联。如果你已将文件大小设置为 100 MB 并将要保留的旧日志文件数设置为 10，那么你将有大约 1 GB 的日志数据用于分析。

可以将此参数作为值传递给 `k3s server` 的 `--kube-apiserver-arg=` 参数来解决此问题。你可以在下方找到示例。
</details>

### 管控 1.2.26
确保适当地设置了 `--request-timeout` 参数。
<details>
<summary>原理</summary>
设置全局请求超时可以将 API Server 的请求超时限制延长到与用户的连接速度相适应的时间。默认设置为 60 秒，这可能会在连接速度较慢时出现问题，一旦请求的数据量无法在 60 秒内完成传输，集群资源将无法访问。但是，如果将超时限制的值设置得太大，API Server 资源会耗尽，因此也容易受到拒绝服务攻击。因此，建议适当设置此限制，并仅在需要时更改默认的 60 秒限制。

可以将此参数作为值传递给 `k3s server` 的 `--kube-apiserver-arg=` 参数来解决此问题。你可以在下方找到示例。
</details>

### 管控 1.2.27
确保 `--service-account-lookup` 参数设置为 true。
<details>
<summary>原理</summary>
如果未启用 `--service-account-lookup`，则 apiserver 仅验证身份验证令牌是否有效，不会验证请求中提到的 ServiceAccount 令牌是否实际存在于 etcd 中。这使得相应的 ServiceAccount 被删除后也可以使用 ServiceAccount 令牌。这是一个从检查时间到使用时间的安全问题示例。

可以将此参数作为值传递给 `k3s server` 的 `--kube-apiserver-arg=` 参数来解决此问题。你可以在下方找到示例。
</details>

### 管控 1.2.33
确保适当地设置了 `--encryption-provider-config` 参数。
<details>
<summary>原理</summary>
etcd 是 Kubernetes deployment 使用的高可用键值存储，用于持久存储其所有 REST API 对象。这些对象本质上是敏感的，需要进行静态加密以避免泄露。

[Secret 加密](secrets-encryption.md)介绍了如何在 K3s 中配置 Secret 加密的详细步骤。
</details>

### 管控 1.2.34
确保正确配置了加密提供程序。
<details>
<summary>原理</summary>
在使用 etcd 加密的地方，使用适当的加密提供程序集是非常重要的。目前，`aescbc`、`kms` 和 `secretbox` 可能是合适的选项。

可以通过将有效配置传递给 `k3s` 来解决，如上所述。[Secret 加密](secrets-encryption.md)介绍了如何在 K3s 中配置 Secret 加密的详细步骤。
</details>

### 管控 1.3.1
确保适当地设置了 `--terminated-pod-gc-threshold` 参数。
<details>
<summary>原理</summary>
垃圾收集对于确保资源的可用性和避免性能下降非常重要。在最坏的情况下，系统可能会崩溃或长时间无法使用。垃圾收集的当前设置是 12,500 个终止的 pod，对于你的系统来说，这个值可能太高且无法维持。根据你的系统资源和测试，你可以选择合适的阈值来激活垃圾收集。

可以将此参数作为值传递给 `k3s server` 的 `--kube-apiserver-arg=` 参数来解决此问题。你可以在下方找到示例。
</details>

### 管控 3.2.1
确保创建最小审计策略
<details>
<summary>原理</summary>
Logging 是所有系统的重要检测控制，用于检测潜在的未经授权的访问。

可以通过传递管控 1.2.22 - 1.2.25 并验证其有效性来解决问题。
</details>

### 管控 4.2.7
确保 `--make-iptables-util-chains` 参数设置为 true。
<details>
<summary>原理</summary>
Kubelets 可以根据你为 Pod 选择的网络选项自动管理 iptables 的必要更改。建议让 kubelets 管理 iptables 的更改。这样能确保 iptables 的配置与 Pod 网络配置保持同步。使用动态 Pod 网络配置更改来手动配置 iptables 可能会妨碍 Pod/容器之间以及与外界的通信。你的 iptables 规则可能过于严格或过于宽松。

可以将此参数作为值传递给 `k3s server` 的 `--kube-apiserver-arg=` 参数来解决此问题。你可以在下方找到示例。
</details>

### 管控 5.1.5
确保未主动使用默认 ServiceAccount
<details>
<summary>原理</summary>
Kubernetes 为集群工作负载提供了一个 `default` ServiceAccount，但没有为 pod 分配特定 ServiceAccount。

如果需要从 pod 访问 Kubernetes API，则需要为该 pod 创建一个特定的 ServiceAccount 并授予权限。

你还需要配置 default  ServiceAccount，使其不提供 ServiceAccount 令牌并且没有任何显式的权限分配。

可以通过将每个命名空间中 `default` ServiceAccount 的 `automountServiceAccountToken` 字段更新为 `false` 来解决此问题。

对于内置命名空间（`kube-system`、`kube-public`、`kube-node-lease` 和 `default`）中的 `default` ServiceAccount，K3s 不会自动执行此操作。你可以通过在这些 ServiceAccount 上手动更新此字段来传递管控。
</details>

## Control Plane 执行和参数

下面列出了 K3s control plane 组件及其在启动时默认的参数。右边的注释是他们满足的 CIS 1.6 管控。

```bash
kube-apiserver
    --advertise-port=6443
    --allow-privileged=true
    --anonymous-auth=false                                                            # 1.2.1
    --api-audiences=unknown
    --authorization-mode=Node,RBAC
    --bind-address=127.0.0.1
    --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs
    --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt                    # 1.2.31
    --enable-admission-plugins=NodeRestriction,PodSecurityPolicy                      # 1.2.17
    --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt                  # 1.2.32
    --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt                   # 1.2.29
    --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key                    # 1.2.29
    --etcd-servers=https://127.0.0.1:2379
    --insecure-port=0                                                                 # 1.2.19
    --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt
    --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt
    --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key
    --profiling=false                                                                 # 1.2.21
    --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt
    --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key
    --requestheader-allowed-names=system:auth-proxy
    --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt
    --requestheader-extra-headers-prefix=X-Remote-Extra-
    --requestheader-group-headers=X-Remote-Group
    --requestheader-username-headers=X-Remote-User
    --secure-port=6444                                                                # 1.2.20
    --service-account-issuer=k3s
    --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key            # 1.2.28
    --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.key
    --service-cluster-ip-range=10.43.0.0/16
    --storage-backend=etcd3
    --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt        # 1.2.30
    --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key # 1.2.30
```

```bash
kube-controller-manager
    --address=127.0.0.1
    --allocate-node-cidrs=true
    --bind-address=127.0.0.1                                                       # 1.3.7
    --cluster-cidr=10.42.0.0/16
    --cluster-signing-cert-file=/var/lib/rancher/k3s/server/tls/client-ca.crt
    --cluster-signing-key-file=/var/lib/rancher/k3s/server/tls/client-ca.key
    --kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig
    --port=10252
    --profiling=false                                                              # 1.3.2
    --root-ca-file=/var/lib/rancher/k3s/server/tls/server-ca.crt                   # 1.3.5
    --secure-port=0
    --service-account-private-key-file=/var/lib/rancher/k3s/server/tls/service.key # 1.3.4
    --use-service-account-credentials=true                                         # 1.3.3
```

```bash
kube-scheduler
    --address=127.0.0.1
    --bind-address=127.0.0.1                                              # 1.4.2
    --kubeconfig=/var/lib/rancher/k3s/server/cred/scheduler.kubeconfig
    --port=10251
    --profiling=false                                                     # 1.4.1
    --secure-port=0
```

```bash
kubelet
    --address=0.0.0.0
    --anonymous-auth=false                                                # 4.2.1
    --authentication-token-webhook=true
    --authorization-mode=Webhook                                          # 4.2.2
    --cgroup-driver=cgroupfs
    --client-ca-file=/var/lib/rancher/k3s/agent/client-ca.crt             # 4.2.3
    --cloud-provider=external
    --cluster-dns=10.43.0.10
    --cluster-domain=cluster.local
    --cni-bin-dir=/var/lib/rancher/k3s/data/223e6420f8db0d8828a8f5ed3c44489bb8eb47aa71485404f8af8c462a29bea3/bin
    --cni-conf-dir=/var/lib/rancher/k3s/agent/etc/cni/net.d
    --container-runtime-endpoint=/run/k3s/containerd/containerd.sock
    --container-runtime=remote
    --containerd=/run/k3s/containerd/containerd.sock
    --eviction-hard=imagefs.available<5%,nodefs.available<5%
    --eviction-minimum-reclaim=imagefs.available=10%,nodefs.available=10%
    --fail-swap-on=false
    --healthz-bind-address=127.0.0.1
    --hostname-override=hostname01
    --kubeconfig=/var/lib/rancher/k3s/agent/kubelet.kubeconfig
    --kubelet-cgroups=/systemd/system.slice
    --node-labels=
    --pod-manifest-path=/var/lib/rancher/k3s/agent/pod-manifests
    --protect-kernel-defaults=true                                        # 4.2.6
    --read-only-port=0                                                    # 4.2.4
    --resolv-conf=/run/systemd/resolve/resolv.conf
    --runtime-cgroups=/systemd/system.slice
    --serialize-image-pulls=false
    --tls-cert-file=/var/lib/rancher/k3s/agent/serving-kubelet.crt        # 4.2.10
    --tls-private-key-file=/var/lib/rancher/k3s/agent/serving-kubelet.key # 4.2.10
```

下面命令示例展示了如何应用修正措施来强化 K3s：

```bash
k3s server \
    --protect-kernel-defaults=true \
    --secrets-encryption=true \
    --kube-apiserver-arg='audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log' \
    --kube-apiserver-arg='audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml' \
    --kube-apiserver-arg='audit-log-maxage=30' \
    --kube-apiserver-arg='audit-log-maxbackup=10' \
    --kube-apiserver-arg='audit-log-maxsize=100' \
    --kube-apiserver-arg='request-timeout=300s' \
    --kube-apiserver-arg='service-account-lookup=true' \
    --kube-apiserver-arg='enable-admission-plugins=NodeRestriction,PodSecurityPolicy,NamespaceLifecycle,ServiceAccount' \
    --kube-controller-manager-arg='terminated-pod-gc-threshold=10' \
    --kube-controller-manager-arg='use-service-account-credentials=true' \
    --kubelet-arg='streaming-connection-idle-timeout=5m' \
    --kubelet-arg='make-iptables-util-chains=true'
```

## 结论

如果遵循本指南，你的 K3s 集群将能符合 CIS Kubernetes Benchmark。你可以查看 [CIS Benchmark 自我评估指南](self-assessment.md)来了解每项 Benchmark 检查的期望结果，以及如何在你的集群上执行相同的操作。
