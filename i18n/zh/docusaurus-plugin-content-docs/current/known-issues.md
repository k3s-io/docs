---
title: 已知问题
---
我们会定期更新已知问题文档，说明下一个即将发布的版本中可能无法立即解决的问题。

### Snap Docker

如果你计划同时使用 K3s 与 Docker，则不建议通过 snap 包安装 Docker，因为它会导致运行 K3s 时出现问题。

### Iptables

如果你使用 nftables 模式而不是传统模式来运行 iptables，则可能会遇到问题。我们建议使用较新的 iptables（例如 1.6.1+）来避免出现问题。

此外，版本 1.8.0-1.8.4 存在可能导致 K3s 失败的问题。有关解决方法，请参阅[其他操作系统准备](./advanced.md#旧的-iptables-版本)。

### Rootless 模式

使用 Rootless 模式运行 K3s 是实验性的，存在几个[已知问题](./advanced.md#rootless-模式的已知问题)。

### 将强化集群从 v1.24.x 升级到 v1.25.x {#hardened-125}

Kubernetes v1.25 删除了 PodSecurityPolicy，支持 Pod Security Standard（PSS）。你可以在[上游文档](https://kubernetes.io/docs/concepts/security/pod-security-standards/)中阅读有关 PSS 的更多信息。对于 K3s，如果在节点上配置了任何 `PodSecurityPolicy`，则必须执行一些手动步骤。

1. 在所有节点上，更新 `kube-apiserver-arg` 值以删除 `PodSecurityPolicy` admission-plugin。添加以下参数值：`'admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml'`，但不要重启或升级 K3s。以下是节点加固更新后配置文件的示例：
```yaml
protect-kernel-defaults: true
secrets-encryption: true
kube-apiserver-arg:
  - 'admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml'
  - 'audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log'
  - 'audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml'
  - 'audit-log-maxage=30'
  - 'audit-log-maxbackup=10'
  - 'audit-log-maxsize=100'
kube-controller-manager-arg:
  - 'terminated-pod-gc-threshold=10'
  - 'use-service-account-credentials=true'
kubelet-arg:
  - 'streaming-connection-idle-timeout=5m'
  - 'make-iptables-util-chains=true'
```
2. 使用以下内容创建 `/var/lib/rancher/k3s/server/psa.yaml` 文件。你可能还想豁免更多命名空间。下面的示例豁免了 `kube-system`（必需）、`cis-operator-system`（可选，但在通过 Rancher 运行安全扫描时很有用）和 `system- upgrade`（如果执行[自动升级](./upgrades/automated.md)则需要）。
```yaml
apiVersion: apiserver.config.k8s.io/v1
kind: AdmissionConfiguration
plugins:
- name: PodSecurity
  configuration:
    apiVersion: pod-security.admission.config.k8s.io/v1beta1
    kind: PodSecurityConfiguration
    defaults:
      enforce: "restricted"
      enforce-version: "latest"
      audit: "restricted"
      audit-version: "latest"
      warn: "restricted"
      warn-version: "latest"
    exemptions:
      usernames: []
      runtimeClasses: []
      namespaces: [kube-system, cis-operator-system, system-upgrade]
```
3. 正常执行升级。如果使用[自动升级](./upgrades/automated.md)，请确保运行 `system-upgrade-controller` pod 的命名空间按照 [Pod 安全级别](https://kubernetes.io/docs/concepts/security/pod-security-admission/#pod-security-levels)的要求设置为 privileged。
```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: system-upgrade
  labels:
    # This value must be privileged for the controller to run successfully.
    pod-security.kubernetes.io/enforce: privileged
    pod-security.kubernetes.io/enforce-version: v1.25
    # We are setting these to our _desired_ `enforce` level, but note that these below values can be any of the available options.
    pod-security.kubernetes.io/audit: privileged
    pod-security.kubernetes.io/audit-version: v1.25
    pod-security.kubernetes.io/warn: privileged
    pod-security.kubernetes.io/warn-version: v1.25
```
4. 升级完成后，从集群中移除剩余的 PSP 资源。在许多情况下，在 `/var/lib/rancher/k3s/server/manifests/` 中用于加固的自定义文件中可能存在 PodSecurityPolicies 和关联的 RBAC 资源。删除这些资源，然后 K3s 将自动更新。由于时间原因，一些资源可能会留在集群中，在这种情况下，你需要手动删除它们。如果之前遵循了[强化指南](./security/hardening-guide.md)，你应该能够通过以下方式删除它们：
```sh
# 获取与 PSP 关联的资源
$ kubectl get roles,clusterroles,rolebindings,clusterrolebindings -A | grep -i psp

# 删除这些资源
$ kubectl delete clusterrole.rbac.authorization.k8s.io/psp:restricted-psp clusterrole.rbac.authorization.k8s.io/psp:svclb-psp clusterrole.rbac.authorization.k8s.io/psp:system-unrestricted-psp clusterrolebinding.rbac.authorization.k8s.io/default:restricted-psp clusterrolebinding.rbac.authorization.k8s.io/system-unrestricted-node-psp-rolebinding && kubectl delete -n kube-system rolebinding.rbac.authorization.k8s.io/svclb-psp-rolebinding rolebinding.rbac.authorization.k8s.io/system-unrestricted-svc-acct-psp-rolebinding
```
