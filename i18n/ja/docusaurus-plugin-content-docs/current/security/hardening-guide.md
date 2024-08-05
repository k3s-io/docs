---
title: "CIS ハードニングガイド"
---

このドキュメントは、K3s の本番インストールをハードニングするための指針を提供します。これは、Center for Internet Security (CIS) の Kubernetes ベンチマークコントロールに対応するために必要な設定とコントロールを概説しています。

K3s には多くのセキュリティ緩和策がデフォルトで適用されており、変更なしで多くの Kubernetes CIS コントロールに合格します。ただし、CIS ベンチマークに完全に準拠するためには手動での介入が必要な例外もいくつかあります。

1. K3s はホストオペレーティングシステムを変更しません。ホストレベルの変更は手動で行う必要があります。
2. `NetworkPolicies` および `PodSecurityStandards` (`v1.24` 以前では `PodSecurityPolicies`) に関する特定の CIS ポリシーコントロールは、クラスターの機能を制限します。これらを設定するには、コマンドラインフラグまたは設定ファイルに適切なオプション（アドミッションプラグインの有効化）を追加し、適切なポリシーを手動で適用する必要があります。詳細は以下のセクションに記載されています。

CIS ベンチマークの最初のセクション (1.1) は主にポッドマニフェストの権限と所有権に関するものです。K3s はコアコンポーネントにこれらを使用しません。すべてが単一のバイナリにパッケージ化されているためです。

## ホストレベルの要件

ホストレベルの要件には、カーネルパラメータと etcd プロセス/ディレクトリの設定の2つの領域があります。これらはこのセクションで概説されています。

### `protect-kernel-defaults` が設定されていることを確認する

これは、必要なカーネルパラメータが未設定または kubelet のデフォルト値と異なる値に設定されている場合に kubelet が終了するようにする kubelet フラグです。

> **注:** `protect-kernel-defaults` は K3s のトップレベルフラグとして公開されています。

#### カーネルパラメータを設定する

`/etc/sysctl.d/90-kubelet.conf` というファイルを作成し、以下のスニペットを追加します。その後、`sysctl -p /etc/sysctl.d/90-kubelet.conf` を実行します。

```bash
vm.panic_on_oom=0
vm.overcommit_memory=1
kernel.panic=10
kernel.panic_on_oops=1
```

## Kubernetes ランタイム要件

CIS ベンチマークに準拠するためのランタイム要件は、ポッドセキュリティ（PSP または PSA 経由）、ネットワークポリシー、および API サーバーの監査ログに集中しています。これらはこのセクションで概説されています。

デフォルトでは、K3s にはポッドセキュリティやネットワークポリシーは含まれていません。ただし、K3s にはネットワークポリシーを強制するコントローラーが付属しており、作成された場合に適用されます。K3s はデフォルトで監査を有効にしていないため、監査ログの設定と監査ポリシーを手動で作成する必要があります。デフォルトでは、K3s は `PodSecurity` および `NodeRestriction` アドミッションコントローラーを含む複数のアドミッションコントローラーを有効にして実行されます。

### ポッドセキュリティ

<Tabs>
<TabItem value="v1.25 and Newer" default>

K3s v1.25 以降は、ポッドセキュリティを制御するための [Pod Security Admissions (PSAs)](https://kubernetes.io/docs/concepts/security/pod-security-admission/) をサポートしています。PSA は以下のフラグを K3s サーバーに渡すことで有効になります。
```
--kube-apiserver-arg="admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml"
```

ポリシーは `/var/lib/rancher/k3s/server` ディレクトリに `psa.yaml` という名前のファイルに書き込む必要があります。

以下は準拠した PSA の例です。
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
      namespaces: [kube-system, cis-operator-system]
```
</TabItem>
<TabItem value="v1.24 and Older" default>

K3s v1.24 以前は、ポッドセキュリティを制御するための [Pod Security Policies (PSPs)](https://kubernetes.io/docs/concepts/security/pod-security-policy/) をサポートしています。PSP は以下のフラグを K3s サーバーに渡すことで有効になります。

```
--kube-apiserver-arg="enable-admission-plugins=NodeRestriction,PodSecurityPolicy"
```
これにより、`NodeRestriction` プラグインを維持しつつ、`PodSecurityPolicy` を有効にします。

PSP が有効になると、CIS ベンチマークのセクション 5.2 で説明されている必要なコントロールを満たすためのポリシーを適用できます。

以下は準拠した PSP の例です。

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

上記の PSP を有効にするためには、ClusterRole と ClusterRoleBinding を作成する必要があります。また、追加の特権を必要とするシステムレベルのポッドに必要な「システム無制限ポリシー」と、servicelb が正常に機能するために必要な sysctl を許可する追加のポリシーも含める必要があります。

上記の設定を次のセクションで説明する [ネットワークポリシー](#networkpolicies) と組み合わせて、単一のファイルを `/var/lib/rancher/k3s/server/manifests` ディレクトリに配置できます。以下は `policy.yaml` ファイルの例です。

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

</TabItem>
</Tabs>
> **注意:** Kubernetes の重要な追加機能である CNI、DNS、および Ingress は `kube-system` ネームスペースでポッドとして実行されます。したがって、これらのコンポーネントが適切に動作するために、このネームスペースには制限が少ないポリシーが適用されます。

### NetworkPolicies

CIS は、すべてのネームスペースに対して、ネームスペースおよびポッドへのトラフィックを合理的に制限するネットワークポリシーが適用されることを要求しています。

ネットワークポリシーは `/var/lib/rancher/k3s/server/manifests` ディレクトリに配置する必要があり、起動時に自動的にデプロイされます。

以下は、準拠したネットワークポリシーの例です。

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

適用された制限により、DNS は意図的に許可されない限りブロックされます。以下は、DNS のトラフィックを許可するネットワークポリシーです。

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

メトリクスサーバーおよび Traefik Ingress コントローラーは、アクセスを許可するネットワークポリシーが作成されない限り、デフォルトでブロックされます。K3s バージョン 1.20 およびそれ以前にパッケージ化された Traefik v1 は、Traefik v2 とは異なるラベルを使用します。クラスターに存在する Traefik のバージョンに関連するサンプル YAML のみを使用するようにしてください。

<Tabs>
<TabItem value="v1.21 and Newer" default>

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
---

```
</TabItem>

<TabItem value="v1.20 and Older" default>

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

```
</TabItem>
</Tabs>

:::info
オペレーターは、作成された追加のネームスペースに対して通常通りネットワークポリシーを管理する必要があります。
:::


### API サーバーの監査設定

CIS 要件 1.2.22 から 1.2.25 は、API サーバーの監査ログの設定に関連しています。K3s はデフォルトでログディレクトリと監査ポリシーを作成しません。監査要件は各ユーザーのポリシーと環境に依存するためです。

ログディレクトリは、理想的には K3s を開始する前に作成する必要があります。潜在的な機密情報の漏洩を防ぐために、制限されたアクセス権限を推奨します。

```bash
sudo mkdir -p -m 700 /var/lib/rancher/k3s/server/logs
```

リクエストメタデータをログに記録するための初期監査ポリシーを以下に示します。このポリシーは `/var/lib/rancher/k3s/server` ディレクトリに `audit.yaml` という名前のファイルに書き込む必要があります。API サーバーのポリシー設定に関する詳細情報は、Kubernetes の[ドキュメント](https://kubernetes.io/docs/tasks/debug-application-cluster/audit/)に記載されています。

```yaml
apiVersion: audit.k8s.io/v1
kind: Policy
rules:
- level: Metadata
```

両方の設定は、API サーバーへの引数として渡す必要があります。

```bash
--kube-apiserver-arg='audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log'
--kube-apiserver-arg='audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml'
```

設定が K3s インストール後に作成された場合、それらは `/etc/systemd/system/k3s.service` の K3s の systemd サービスに追加する必要があります。

```bash
ExecStart=/usr/local/bin/k3s \
    server \
	'--kube-apiserver-arg=audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log' \
	'--kube-apiserver-arg=audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml' \
```

新しい設定を読み込むために K3s を再起動する必要があります。

```bash
sudo systemctl daemon-reload
sudo systemctl restart k3s.service
```

## Kubernetes コンポーネントの設定

以下の設定は[設定ファイル](../installation/configuration.md#configuration-file)に配置する必要があり、Kubernetes コンポーネントを強化するために必要なすべての修正が含まれています。

<Tabs>
<TabItem value="v1.25 and Newer" default>

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
  - 'request-timeout=300s'
  - 'service-account-lookup=true'
kube-controller-manager-arg:
  - 'terminated-pod-gc-threshold=10'
  - 'use-service-account-credentials=true'
kubelet-arg:
  - 'streaming-connection-idle-timeout=5m'
  - 'make-iptables-util-chains=true'
```

</TabItem>

<TabItem value="v1.24 and Older" default>

```yaml
protect-kernel-defaults: true
secrets-encryption: true
kube-apiserver-arg:
  - 'enable-admission-plugins=NodeRestriction,PodSecurityPolicy,NamespaceLifecycle,ServiceAccount'
  - 'audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log'
  - 'audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml'
  - 'audit-log-maxage=30'
  - 'audit-log-maxbackup=10'
  - 'audit-log-maxsize=100'
  - 'request-timeout=300s'
  - 'service-account-lookup=true'
kube-controller-manager-arg:
  - 'terminated-pod-gc-threshold=10'
  - 'use-service-account-credentials=true'
kubelet-arg:
  - 'streaming-connection-idle-timeout=5m'
  - 'make-iptables-util-chains=true'
```

</TabItem>
</Tabs>

## コントロールプレーンの実行と引数

以下に、K3s コントロールプレーンコンポーネントと、デフォルトで開始時に与えられる引数を示します。右側にコメントとして、それらが満たす CIS 1.6 コントロールが記載されています。

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
    --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305
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
```
```markdown
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
CIS要件1.2.22から1.2.25に関する追加情報は以下に示されています。

## 既知の問題
以下は、K3sがデフォルトでは現在パスしないコントロールです。各ギャップについて説明し、それが手動のオペレーター介入によってパスできるか、または将来のK3sリリースで対処されるかどうかについての注釈を付けます。

### コントロール 1.2.15
`NamespaceLifecycle`アドミッションコントロールプラグインが設定されていることを確認します。
<details>
<summary>理由</summary>
アドミッションコントロールポリシーを`NamespaceLifecycle`に設定することで、存在しないネームスペースにオブジェクトが作成されないようにし、終了中のネームスペースが新しいオブジェクトの作成に使用されないようにします。これは、ネームスペース終了プロセスの整合性を確保し、新しいオブジェクトの可用性を確保するために推奨されます。

これは、`enable-admission-plugins=`の値としてこの引数を渡し、それを`--kube-apiserver-arg=`引数に渡して`k3s server`に渡すことで修正できます。以下に例を示します。
</details>

### コントロール 1.2.16
`PodSecurityPolicy`アドミッションコントロールプラグインが設定されていることを確認します。
<details>
<summary>理由</summary>
Pod Security Policyは、ポッドが実行できるアクションとアクセスできる内容を制御するクラスター レベルのリソースです。`PodSecurityPolicy`オブジェクトは、システムに受け入れられるためにポッドが従わなければならない条件のセットを定義します。Pod Security Policiesは、ポッドがアクセスできるセキュリティ機能を制御する設定と戦略で構成されているため、ポッドのアクセス許可を制御するために使用する必要があります。

これは、`enable-admission-plugins=`の値としてこの引数を渡し、それを`--kube-apiserver-arg=`引数に渡して`k3s server`に渡すことで修正できます。以下に例を示します。
</details>

### コントロール 1.2.22
`--audit-log-path`引数が設定されていることを確認します。
<details>
<summary>理由</summary>
Kubernetes APIサーバーの監査は、個々のユーザー、管理者、またはシステムの他のコンポーネントによってシステムに影響を与えたアクティビティの一連の記録を文書化するセキュリティ関連の時系列セットを提供します。現在、Kubernetesは基本的な監査機能しか提供していませんが、有効にする必要があります。適切な監査ログパスを設定することで有効にできます。

これは、`--kube-apiserver-arg=`引数にこの引数を値として渡すことで修正できます。以下に例を示します。
</details>

### コントロール 1.2.23
`--audit-log-maxage`引数が30または適切な値に設定されていることを確認します。
<details>
<summary>理由</summary>
ログを少なくとも30日間保持することで、過去に遡ってイベントを調査または関連付けることができます。監査ログの保持期間を30日またはビジネス要件に応じて設定します。

これは、`--kube-apiserver-arg=`引数にこの引数を値として渡すことで修正できます。以下に例を示します。
</details>

### コントロール 1.2.24
`--audit-log-maxbackup`引数が10または適切な値に設定されていることを確認します。
<details>
<summary>理由</summary>
Kubernetesはログファイルを自動的にローテーションします。古いログファイルを保持することで、調査や関連付けに十分なログデータを利用できるようになります。たとえば、ファイルサイズを100 MBに設定し、保持する古いログファイルの数を10に設定した場合、約1 GBのログデータを分析に使用できる可能性があります。

これは、`--kube-apiserver-arg=`引数にこの引数を値として渡すことで修正できます。以下に例を示します。
</details>

### コントロール 1.2.25
`--audit-log-maxsize`引数が100または適切な値に設定されていることを確認します。
<details>
<summary>理由</summary>
Kubernetesはログファイルを自動的にローテーションします。古いログファイルを保持することで、調査や関連付けに十分なログデータを利用できるようになります。ファイルサイズを100 MBに設定し、保持する古いログファイルの数を10に設定した場合、約1 GBのログデータを分析に使用できる可能性があります。

これは、`--kube-apiserver-arg=`引数にこの引数を値として渡すことで修正できます。以下に例を示します。
</details>

### コントロール 1.2.26
`--request-timeout`引数が適切に設定されていることを確認します。
<details>
<summary>理由</summary>
グローバルリクエストタイムアウトを設定することで、ユーザーの接続速度に応じてAPIサーバーのリクエストタイムアウト制限を延長できます。デフォルトでは60秒に設定されており、接続が遅い場合には問題が発生する可能性があります。リクエストのデータ量が60秒以内に送信できる量を超えると、クラスターリソースにアクセスできなくなる可能性があります。ただし、このタイムアウト制限を大きく設定しすぎると、APIサーバーのリソースが枯渇し、サービス拒否攻撃に対して脆弱になる可能性があります。したがって、この制限を適切に設定し、必要に応じてデフォルトの60秒の制限を変更することをお勧めします。

これは、`--kube-apiserver-arg=`引数にこの引数を値として渡すことで修正できます。以下に例を示します。
</details>

### コントロール 1.2.27
`--service-account-lookup`引数がtrueに設定されていることを確認します。
<details>
<summary>理由</summary>
`--service-account-lookup`が有効になっていない場合、apiserverは認証トークンが有効であることのみを確認し、リクエストに記載されているサービスアカウントトークンが実際にetcdに存在するかどうかを検証しません。これにより、対応するサービスアカウントが削除された後でもサービスアカウントトークンを使用できるようになります。これは、チェック時と使用時のセキュリティ問題の一例です。

これは、`--kube-apiserver-arg=`引数にこの引数を値として渡すことで修正できます。以下に例を示します。
</details>

### コントロール 1.2.33
`--encryption-provider-config`引数が適切に設定されていることを確認します。
<details>
<summary>理由</summary>
`etcd`は、KubernetesデプロイメントでそのすべてのREST APIオブジェクトの永続ストレージとして使用される高可用性のキー値ストアです。これらのオブジェクトは機密性が高いため、漏洩を防ぐために保存時に暗号化する必要があります。

K3sでシークレット暗号化を構成する方法の詳細な手順は[Secrets Encryption](secrets-encryption.md)にあります。
</details>

### コントロール 1.2.34
暗号化プロバイダーが適切に構成されていることを確認します。
<details>
<summary>理由</summary>
`etcd`暗号化が使用されている場合、適切な暗号化プロバイダーのセットが使用されていることを確認することが重要です。現在、`aescbc`、`kms`、および`secretbox`が適切なオプションである可能性が高いです。

これは、上記のように有効な構成を`k3s`に渡すことで修正できます。K3sでシークレット暗号化を構成する方法の詳細な手順は[Secrets Encryption](secrets-encryption.md)にあります。
</details>

### コントロール 1.3.1
`--terminated-pod-gc-threshold`引数が適切に設定されていることを確認します。
<details>
<summary>理由</summary>
ガベージコレクションは、十分なリソースの可用性を確保し、パフォーマンスと可用性の低下を防ぐために重要です。最悪の場合、システムがクラッシュするか、長時間使用できなくなる可能性があります。現在のガベージコレクションの設定は12,500個の終了したポッドであり、システムが維持するには多すぎる可能性があります。システムリソースとテストに基づいて、ガベージコレクションを有効にするための適切なしきい値を選択します。

これは、`--kube-apiserver-arg=`引数にこの引数を値として渡すことで修正できます。以下に例を示します。
</details>

### コントロール 3.2.1
最小限の監査ポリシーが作成されていることを確認します。
<details>
<summary>理由</summary>
ログ記録は、すべてのシステムにとって潜在的な不正アクセスを検出するための重要な探知コントロールです。

これは、コントロール1.2.22 - 1.2.25を渡し、その有効性を確認することで修正できます。
</details>

### コントロール 4.2.7
`--make-iptables-util-chains`引数がtrueに設定されていることを確認します。
<details>
<summary>根拠</summary>
Kubeletは、ポッドのネットワークオプションの選択に基づいて、iptablesの必要な変更を自動的に管理できます。iptablesの変更はkubeletに任せることを推奨します。これにより、iptablesの設定がポッドのネットワーク設定と同期した状態を保つことができます。動的なポッドネットワーク設定の変更に対して手動でiptablesを設定すると、ポッド/コンテナ間および外部との通信が妨げられる可能性があります。iptablesのルールが厳しすぎたり、逆に緩すぎたりすることがあります。

これを修正するには、この引数を `k3s server` の `--kube-apiserver-arg=` 引数に値として渡します。以下に例を示します。
</details>

### コントロール 5.1.5
デフォルトのサービスアカウントが積極的に使用されていないことを確認する
<details>
<summary>根拠</summary>
Kubernetesは、ポッドに特定のサービスアカウントが割り当てられていない場合に使用される `default` サービスアカウントを提供します。

ポッドからKubernetes APIへのアクセスが必要な場合、そのポッド用に特定のサービスアカウントを作成し、そのサービスアカウントに権限を付与する必要があります。

デフォルトのサービスアカウントは、サービスアカウントトークンを提供せず、明示的な権限の割り当てがないように構成する必要があります。

これは、各ネームスペースの `default` サービスアカウントの `automountServiceAccountToken` フィールドを `false` に更新することで修正できます。

組み込みのネームスペース（`kube-system`、`kube-public`、`kube-node-lease`、および `default`）の `default` サービスアカウントについては、K3sは自動的にこれを行いません。これらのサービスアカウントのフィールドを手動で更新して、コントロールをパスすることができます。
</details>

## 結論

このガイドに従った場合、K3sクラスターはCIS Kubernetesベンチマークに準拠するように構成されます。各ベンチマークのチェックの期待事項と、クラスターで同じことを行う方法を理解するために、[CIS 1.8 自己評価ガイド](self-assessment-1.8.md) を確認できます。