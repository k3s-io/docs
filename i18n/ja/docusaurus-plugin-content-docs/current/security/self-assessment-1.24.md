---
title: CIS 1.24 自己評価ガイド
---

## 概要

このドキュメントは[K3sセキュリティ強化ガイド](hardening-guide.md)の補足資料です。強化ガイドはK3sの本番環境インストールを強化するための具体的なガイダンスを提供し、このベンチマークガイドはCIS Kubernetesベンチマークの各コントロールに対して強化されたクラスターのセキュリティレベルを評価するのに役立ちます。K3sの運用者、セキュリティチーム、監査人、意思決定者が使用することを目的としています。

このガイドはK3sの**v1.24**リリースラインおよびCIS Kubernetesベンチマークの**v1.24**リリースに特化しています。

各コントロールの詳細な説明やテスト失敗時の修正方法については、CIS Kubernetesベンチマークv1.6の該当セクションを参照してください。ベンチマークは、無料アカウントを作成後に[Center for Internet Security (CIS)](https://www.cisecurity.org/benchmark/kubernetes/)からダウンロードできます。

### コントロールテストの方法論

CIS Kubernetesベンチマークの各コントロールは、付随する強化ガイドに従って設定されたK3sクラスターに対して評価されました。

コントロール監査が元のCISベンチマークと異なる場合、K3sに特化した監査コマンドがテスト用に提供されています。

各コントロールの結果は以下の通りです：

- **合格** - テスト対象のK3sクラスターがベンチマークに記載された監査に合格しました。
- **該当なし** - コントロールがK3sの設計上適用されない場合。この理由は修正セクションで説明されます。
- **警告** - コントロールがCISベンチマークで手動であり、クラスターの使用ケースやその他の要因に依存する場合。これらのコントロールはK3sがその実装を妨げないことを確認するために評価されていますが、テスト対象のクラスターのさらなる設定や監査は行われていません。

このガイドは、K3sがSystemdユニットとして実行されていることを前提としています。インストール方法が異なる場合は、「監査」コマンドをシナリオに合わせて調整する必要があります。

:::note

このガイドでは、`scored`テスト、つまり`自動化`テストのみを対象としています。
:::

## 1.1 コントロールプレーンノードの設定ファイル

### 1.1.1 APIサーバーポッド仕様ファイルの権限が644以上に設定されていることを確認する（自動化）

**結果:** 該当なし

**修正方法:**
コントロールプレーンノードで以下のコマンドを実行します（システム上のファイルの場所に基づく）。
例: chmod 644 /etc/kubernetes/manifests/kube-apiserver.yaml

### 1.1.2 APIサーバーポッド仕様ファイルの所有者がroot:rootに設定されていることを確認する（自動化）

**結果:** 該当なし

**修正方法:**
コントロールプレーンノードで以下のコマンドを実行します（システム上のファイルの場所に基づく）。
例: chown root:root /etc/kubernetes/manifests/kube-apiserver.yaml

### 1.1.3 コントローラーマネージャーポッド仕様ファイルの権限が600以上に設定されていることを確認する（自動化）

**結果:** 該当なし

**修正方法:**
コントロールプレーンノードで以下のコマンドを実行します（システム上のファイルの場所に基づく）。
例: chmod 600 /etc/kubernetes/manifests/kube-controller-manager.yaml

### 1.1.4 コントローラーマネージャーポッド仕様ファイルの所有者がroot:rootに設定されていることを確認する（自動化）

**結果:** 該当なし

**修正方法:**
コントロールプレーンノードで以下のコマンドを実行します（システム上のファイルの場所に基づく）。
例: chown root:root /etc/kubernetes/manifests/kube-controller-manager.yaml

### 1.1.5 スケジューラーポッド仕様ファイルの権限が600以上に設定されていることを確認する（自動化）

**結果:** 該当なし

**修正方法:**
コントロールプレーンノードで以下のコマンドを実行します（システム上のファイルの場所に基づく）。
例: chmod 600 /etc/kubernetes/manifests/kube-scheduler.yaml

### 1.1.6 スケジューラーポッド仕様ファイルの所有者がroot:rootに設定されていることを確認する（自動化）

**結果:** 該当なし

**修正方法:**
コントロールプレーンノードで以下のコマンドを実行します（システム上のファイルの場所に基づく）。
例: chown root:root /etc/kubernetes/manifests/kube-scheduler.yaml

### 1.1.7 etcdポッド仕様ファイルの権限が600以上に設定されていることを確認する（自動化）

**結果:** 該当なし

**修正方法:**
コントロールプレーンノードで以下のコマンドを実行します（システム上のファイルの場所に基づく）。
例: chmod 600 /var/lib/rancher/k3s/server/db/etcd/config

### 1.1.8 etcdポッド仕様ファイルの所有者がroot:rootに設定されていることを確認する（自動化）

**結果:** 該当なし

**修正方法:**
コントロールプレーンノードで以下のコマンドを実行します（システム上のファイルの場所に基づく）。
例: chown root:root /var/lib/rancher/k3s/server/db/etcd/config

### 1.1.9 コンテナネットワークインターフェイスファイルの権限が600以上に設定されていることを確認する（自動化）

**結果:** 該当なし

**修正方法:**
コントロールプレーンノードで以下のコマンドを実行します（システム上のファイルの場所に基づく）。
例: chmod 600 &lt;path/to/cni/files&gt;

### 1.1.10 コンテナネットワークインターフェイスファイルの所有者がroot:rootに設定されていることを確認する（自動化）

**結果:** 該当なし

**修正方法:**
コントロールプレーンノードで以下のコマンドを実行します（システム上のファイルの場所に基づく）。
例: chown root:root &lt;path/to/cni/files&gt;

### 1.1.11 etcdデータディレクトリの権限が700以上に設定されていることを確認する（自動化）

**結果:** 合格

**監査:**
```bash
stat -c %a /var/lib/rancher/k3s/server/db/etcd
```

**期待される結果:** '700' が '700' と等しい

<details>
<summary><b>返された値:</b></summary>

```console
700
```
</details>

### 1.1.12 etcdデータディレクトリの所有者がetcd:etcdに設定されていることを確認する（自動化）

**結果:** 該当なし

**修正方法:**
etcdサーバーノードで、コマンド 'ps -ef | grep etcd' から引数 --data-dir として渡されたetcdデータディレクトリを取得します。
上記で見つかったetcdデータディレクトリに基づいて以下のコマンドを実行します。
例: chown etcd:etcd /var/lib/etcd

### 1.1.13 admin.confファイルの権限が600以上に設定されていることを確認する（自動化）

**結果:** 該当なし

**修正方法:**
コントロールプレーンノードで以下のコマンドを実行します（システム上のファイルの場所に基づく）。
例: chmod 600 /var/lib/rancher/k3s/server/cred/admin.kubeconfig

### 1.1.14 admin.confファイルの所有者がroot:rootに設定されていることを確認する（自動化）

**結果:** 合格

**監査:**
```bash
/bin/sh -c 'if test -e /var/lib/rancher/k3s/server/cred/admin.kubeconfig; then stat -c %U:%G /var/lib/rancher/k3s/server/cred/admin.kubeconfig; fi'
```

**期待される結果:** 'root:root' が 'root:root' と等しい

<details>
<summary><b>返された値:</b></summary>

```console
root:root
```
</details>

### 1.1.15 scheduler.confファイルの権限が600以上に設定されていることを確認する（自動化）

**結果:** 合格

**監査:**
```bash
/bin/sh -c 'if test -e /var/lib/rancher/k3s/server/cred/scheduler.kubeconfig; then stat -c permissions=%a /var/lib/rancher/k3s/server/cred/scheduler.kubeconfig; fi'
```

**期待される結果:** permissions が 600 の権限を持ち、600以上の制限が期待される

<details>
<summary><b>返された値:</b></summary>

```console
permissions=600
```
</details>

### 1.1.16 scheduler.confファイルの所有者がroot:rootに設定されていることを確認する（自動化）

**結果:** 合格

**監査:**
```bash
/bin/sh -c 'if test -e /var/lib/rancher/k3s/server/cred/scheduler.kubeconfig; then stat -c %U:%G /var/lib/rancher/k3s/server/cred/scheduler.kubeconfig; fi'
```

**期待される結果:** 'root:root' が存在する

<details>
<summary><b>返された値:</b></summary>

```console
root:root
```
</details>

### 1.1.17 controller-manager.confファイルの権限が600以上に設定されていることを確認する（自動化）

**結果:** 合格

**監査:**
```bash
/bin/sh -c 'if test -e /var/lib/rancher/k3s/server/cred/controller.kubeconfig; then stat -c permissions=%a /var/lib/rancher/k3s/server/cred/controller.kubeconfig; fi'
```

**期待される結果:** permissions が 600 の権限を持ち、600以上の制限が期待される

<details>
<summary><b>返された値:</b></summary>

```console
permissions=600
```
</details>

### 1.1.18 controller-manager.confファイルの所有者がroot:rootに設定されていることを確認する（自動化）

**結果:** 合格

**監査:**
```bash
stat -c %U:%G /var/lib/rancher/k3s/server/tls
```

**期待される結果:** 'root:root' が 'root:root' と等しい

<details>
<summary><b>返された値:</b></summary>

```console
root:root
```
</details>

### 1.1.19 Kubernetes PKIディレクトリおよびファイルの所有者がroot:rootに設定されていることを確認する（自動化）

**結果:** 合格

**監査:**
```bash
find /var/lib/rancher/k3s/server/tls | xargs stat -c %U:%G
```

**期待される結果:** 'root:root' が存在する

<details>
<summary><b>返された値:</b></summary>

```console
root:root
```
</details>

### 1.1.20 Kubernetes PKI証明書ファイルの権限が600以上に設定されていることを確認する（自動化）

**結果:** 警告

**修正方法:**
コントロールプレーンノードで以下のコマンドを実行します（システム上のファイルの場所に基づく）。
例: chmod -R 600 /etc/kubernetes/pki/*.crt

### 1.1.21 Kubernetes PKIキーの権限が600に設定されていることを確認する（自動化）

**結果:** 警告

**修正方法:**
コントロールプレーンノードで以下のコマンドを実行します（システム上のファイルの場所に基づく）。
例: chmod -R 600 /etc/kubernetes/pki/*.key

## 1.2 APIサーバー

### 1.2.1 --anonymous-auth引数がfalseに設定されていることを確認する（自動化）

**結果:** 合格

**監査:**
```bash
journalctl -D /var/log/journal  -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep 'anonymous-auth'
```

**期待される結果:** '--anonymous-auth' が 'false' と等しい

<details>
<summary><b>返された値:</b></summary>

```console
2024年5月15日 18:38:23 server-0 k3s[2318]: time="2024-05-15T18:38:23Z" level=info msg="Running kube-apiserver --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction,NamespaceLifecycle,ServiceAccount,PodSecurityPolicy --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --feature-gates=JobTrackingWithFinalizers=true --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-lookup=true --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

### 1.2.2 --token-auth-fileパラメータが設定されていないことを確認する（自動化）

**結果:** パス

**監査:**
```bash
/bin/ps -ef | grep containerd | grep -v grep
```

**期待される結果:** '--token-auth-file'が存在しない

<details>
<summary><b>返された値:</b></summary>

```console
root        2335    2318  0 18:38 ?        00:00:00 containerd -c /var/lib/rancher/k3s/agent/etc/containerd/config.toml -a /run/k3s/containerd/containerd.sock --state /run/k3s/containerd --root /var/lib/rancher/k3s/agent/containerd
```
</details>

### 1.2.3 --DenyServiceExternalIPsが設定されていないことを確認する（自動化）

**結果:** パス

**監査:**
```bash
/bin/ps -ef | grep containerd | grep -v grep
```

**期待される結果:** '--enable-admission-plugins'が存在する または '--enable-admission-plugins'が存在しない

<details>
<summary><b>返された値:</b></summary>

```console
root        2335    2318  0 18:38 ?        00:00:00 containerd -c /var/lib/rancher/k3s/agent/etc/containerd/config.toml -a /run/k3s/containerd/containerd.sock --state /run/k3s/containerd --root /var/lib/rancher/k3s/agent/containerd
```
</details>

### 1.2.4 --kubelet-https引数がtrueに設定されていることを確認する（自動化）

**結果:** 適用外

**修正:**
コントロールプレーンノード上のAPIサーバーポッド仕様ファイル /etc/kubernetes/manifests/kube-apiserver.yamlを編集し、--kubelet-httpsパラメータを削除してください。

### 1.2.5 --kubelet-client-certificateと--kubelet-client-key引数が適切に設定されていることを確認する（自動化）

**結果:** 合格

**監査:**
```bash
journalctl -D /var/log/journal  -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep 'kubelet-certificate-authority'
```

**期待される結果:** '--kubelet-client-certificate'が存在し、かつ'--kubelet-client-key'が存在する

<details>
<summary><b>返された値:</b></summary>

```console
May 15 18:38:23 server-0 k3s[2318]: time="2024-05-15T18:38:23Z" level=info msg="Running kube-apiserver --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction,NamespaceLifecycle,ServiceAccount,PodSecurityPolicy --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --feature-gates=JobTrackingWithFinalizers=true --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-lookup=true --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

### 1.2.6 --kubelet-certificate-authority 引数が適切に設定されていることを確認する（自動化）

**結果:** 合格

**監査:**
```bash
journalctl -D /var/log/journal  -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep 'kubelet-certificate-authority'
```

**期待される結果:** '--kubelet-certificate-authority' が存在すること

<details>
<summary><b>返された値:</b></summary>

```console
May 15 18:38:23 server-0 k3s[2318]: time="2024-05-15T18:38:23Z" level=info msg="Running kube-apiserver --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction,NamespaceLifecycle,ServiceAccount,PodSecurityPolicy --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --feature-gates=JobTrackingWithFinalizers=true --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-lookup=true --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

### 1.2.7 --authorization-mode引数がAlwaysAllowに設定されていないことを確認する（自動化）

**結果:** 合格

**監査:**
```bash
journalctl -D /var/log/journal  -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep 'authorization-mode'
```

**期待される結果:** '--authorization-mode'に'AlwaysAllow'が含まれていない

<details>
<summary><b>返された値:</b></summary>

```console
2024年5月15日 18:38:23 server-0 k3s[2318]: time="2024-05-15T18:38:23Z" level=info msg="Running kube-apiserver --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction,NamespaceLifecycle,ServiceAccount,PodSecurityPolicy --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --feature-gates=JobTrackingWithFinalizers=true --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-lookup=true --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

### 1.2.8 --authorization-mode引数にNodeが含まれていることを確認する（自動化）

**結果:** 合格

**監査:**
```bash
journalctl -D /var/log/journal  -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep 'authorization-mode'
```

**期待される結果:** '--authorization-mode'に'Node'が含まれている

<details>
<summary><b>返された値:</b></summary>

```console
2024年5月15日 18:38:23 server-0 k3s[2318]: time="2024-05-15T18:38:23Z" level=info msg="Running kube-apiserver --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction,NamespaceLifecycle,ServiceAccount,PodSecurityPolicy --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --feature-gates=JobTrackingWithFinalizers=true --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-lookup=true --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

### 1.2.9 --authorization-mode引数にRBACが含まれていることを確認する（自動化）

**結果:** 合格

**監査:**
```bash
journalctl -D /var/log/journal  -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep 'authorization-mode'
```

**期待される結果:** '--authorization-mode'に'RBAC'が含まれている

<details>
<summary><b>返された値:</b></summary>

```console
2024年5月15日 18:38:23 server-0 k3s[2318]: time="2024-05-15T18:38:23Z" level=info msg="Running kube-apiserver --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction,NamespaceLifecycle,ServiceAccount,PodSecurityPolicy --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --feature-gates=JobTrackingWithFinalizers=true --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-lookup=true --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

### 1.2.10 イベントレート制限のアドミッションコントロールプラグインが設定されていることを確認する (自動化)

**結果:** WARN

**修正方法:**
Kubernetesのドキュメントに従い、設定ファイルに希望の制限を設定します。
次に、APIサーバーポッドの仕様ファイル /etc/kubernetes/manifests/kube-apiserver.yaml を編集し、以下のパラメータを設定します。
--enable-admission-plugins=...,EventRateLimit,...
--admission-control-config-file=&lt;path/to/configuration/file&gt;

### 1.2.11 AlwaysAdmitのアドミッションコントロールプラグインが設定されていないことを確認する (自動化)

**結果:** PASS

**監査:**
```bash
journalctl -D /var/log/journal  -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep 'enable-admission-plugins'
```

**期待される結果:** '--enable-admission-plugins' に 'AlwaysAdmit' が含まれていない、または '--enable-admission-plugins' が存在しない

<details>
<summary><b>返された値:</b></summary>

```console
2024年5月15日 18:38:23 server-0 k3s[2318]: time="2024-05-15T18:38:23Z" level=info msg="Running kube-apiserver --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction,NamespaceLifecycle,ServiceAccount,PodSecurityPolicy --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --feature-gates=JobTrackingWithFinalizers=true --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-lookup=true --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

### 1.2.12 AlwaysPullImagesのアドミッションコントロールプラグインが設定されていることを確認する (自動化)

**結果:** WARN

**修正方法:**
コントロールプレーンノードのAPIサーバーポッドの仕様ファイル /etc/kubernetes/manifests/kube-apiserver.yaml を編集し、--enable-admission-plugins パラメータに AlwaysPullImages を含めるように設定します。
--enable-admission-plugins=...,AlwaysPullImages,...

### 1.2.13 PodSecurityPolicyが使用されていない場合、SecurityContextDenyのアドミッションコントロールプラグインが設定されていることを確認する (自動化)

**結果:** PASS

**監査:**
```bash
journalctl -D /var/log/journal  -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep 'enable-admission-plugins'
```

**期待される結果:** '--enable-admission-plugins' に 'SecurityContextDeny' が含まれている、または '--enable-admission-plugins' に 'PodSecurityPolicy' が含まれている

<details>
<summary><b>返された値:</b></summary>

```console
2024年5月15日 18:38:23 server-0 k3s[2318]: time="2024-05-15T18:38:23Z" level=info msg="Running kube-apiserver --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction,NamespaceLifecycle,ServiceAccount,PodSecurityPolicy --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --feature-gates=JobTrackingWithFinalizers=true --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-lookup=true --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>
```
### 1.2.14 サービスアカウントのアドミッションコントロールプラグインが設定されていることを確認する（自動化）

**結果:** 合格

**監査:**
```bash
journalctl -D /var/log/journal  -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep -v grep
```

**期待される結果:** '--disable-admission-plugins' が存在するか、存在しない

<details>
<summary><b>返された値:</b></summary>

```console
May 15 18:38:23 server-0 k3s[2318]: time="2024-05-15T18:38:23Z" level=info msg="Running kube-apiserver --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction,NamespaceLifecycle,ServiceAccount,PodSecurityPolicy --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --feature-gates=JobTrackingWithFinalizers=true --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-lookup=true --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

### 1.2.15 NamespaceLifecycleのアドミッションコントロールプラグインが設定されていることを確認する（自動化）

**結果:** 合格

**監査:**
```bash
journalctl -D /var/log/journal  -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep -v grep
```

**期待される結果:** '--disable-admission-plugins' が存在するか、存在しない

<details>
<summary><b>返された値:</b></summary>

```console
May 15 18:38:23 server-0 k3s[2318]: time="2024-05-15T18:38:23Z" level=info msg="Running kube-apiserver --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction,NamespaceLifecycle,ServiceAccount,PodSecurityPolicy --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --feature-gates=JobTrackingWithFinalizers=true --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-lookup=true --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

### 1.2.16 NodeRestrictionのアドミッションコントロールプラグインが設定されていることを確認する（自動化）

**結果:** 合格

**監査:**
```bash
journalctl -D /var/log/journal  -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep 'enable-admission-plugins'
```

**期待される結果:** '--enable-admission-plugins' に 'NodeRestriction' が含まれている

<details>
<summary><b>返された値:</b></summary>

```console
May 15 18:38:23 server-0 k3s[2318]: time="2024-05-15T18:38:23Z" level=info msg="Running kube-apiserver --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction,NamespaceLifecycle,ServiceAccount,PodSecurityPolicy --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --feature-gates=JobTrackingWithFinalizers=true --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-lookup=true --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

### 1.2.17 --secure-port 引数が 0 に設定されていないことを確認する（自動化）

**結果:** 合格

**監査:**
```bash
journalctl -D /var/log/journal  -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep 'secure-port'
```

**期待される結果:** '--secure-port' が 0 より大きいか、存在しない

<details>
<summary><b>返された値:</b></summary>

```console
2024年5月15日 18:38:23 server-0 k3s[2318]: time="2024-05-15T18:38:23Z" level=info msg="Running kube-apiserver --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction,NamespaceLifecycle,ServiceAccount,PodSecurityPolicy --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --feature-gates=JobTrackingWithFinalizers=true --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-lookup=true --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

### 1.2.18 --profiling引数がfalseに設定されていることを確認する（自動化）

**結果:** 合格

**監査:**
```bash
journalctl -D /var/log/journal  -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep 'profiling'
```

**期待される結果:** '--profiling'が'false'である

<details>
<summary><b>返された値:</b></summary>

```console
2024年5月15日 18:38:23 server-0 k3s[2318]: time="2024-05-15T18:38:23Z" level=info msg="Running kube-apiserver --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction,NamespaceLifecycle,ServiceAccount,PodSecurityPolicy --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --feature-gates=JobTrackingWithFinalizers=true --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-lookup=true --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

### 1.2.19 --audit-log-path引数が設定されていることを確認する（自動化）

**結果:** 該当なし

**修正方法:**
コントロールプレーンノードのAPIサーバーポッド仕様ファイル /etc/kubernetes/manifests/kube-apiserver.yaml を編集し、--audit-log-pathパラメータを適切なパスとファイルに設定します。例えば、--audit-log-path=/var/log/apiserver/audit.log

### 1.2.20 --audit-log-maxage引数が30または適切な値に設定されていることを確認する（自動化）

**結果:** 該当なし

**修正方法:**
コントロールプレーンノードのAPIサーバーポッド仕様ファイル /etc/kubernetes/manifests/kube-apiserver.yaml を編集し、--audit-log-maxageパラメータを30または適切な日数に設定します。例えば、--audit-log-maxage=30

### 1.2.21 --audit-log-maxbackup引数が10または適切な値に設定されていることを確認する（自動化）

**結果:** 該当なし

**修正方法:**
コントロールプレーンノードのAPIサーバーポッド仕様ファイル /etc/kubernetes/manifests/kube-apiserver.yaml を編集し、--audit-log-maxbackupパラメータを10または適切な値に設定します。例えば、--audit-log-maxbackup=10

### 1.2.22 --audit-log-maxsize引数が100または適切な値に設定されていることを確認する（自動化）

**結果:** 該当なし

**修正方法:**
コントロールプレーンノードのAPIサーバーポッド仕様ファイル /etc/kubernetes/manifests/kube-apiserver.yaml を編集し、--audit-log-maxsizeパラメータを適切なサイズ（MB単位）に設定します。例えば、100 MBに設定する場合、--audit-log-maxsize=100

### 1.2.23 --request-timeout引数が適切に設定されていることを確認する（自動化）

**結果:** 該当なし

**修正方法:**
APIサーバーポッド仕様ファイル /etc/kubernetes/manifests/kube-apiserver.yaml を編集し、必要に応じて以下のパラメータを適切に設定します。例えば、--request-timeout=300s

### 1.2.24 --service-account-lookup引数がtrueに設定されていることを確認する（自動化）

**結果:** 合格

**監査:**
```bash
journalctl -D /var/log/journal  -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep -v grep
```

**期待される結果:** '--service-account-lookup'が存在しない、または'--service-account-lookup'が'true'である

<details>
<summary><b>返された値:</b></summary>

```console
2024年5月15日 18:38:23 server-0 k3s[2318]: time="2024-05-15T18:38:23Z" level=info msg="Running kube-apiserver --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction,NamespaceLifecycle,ServiceAccount,PodSecurityPolicy --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --feature-gates=JobTrackingWithFinalizers=true --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-lookup=true --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

### 1.2.25 --service-account-key-file引数が適切に設定されていることを確認する（自動化）

**結果:** 該当なし

**修正方法:**
コントロールプレーンノードのAPIサーバーポッド仕様ファイル /etc/kubernetes/manifests/kube-apiserver.yaml を編集し、--service-account-key-fileパラメータをサービスアカウントの公開鍵ファイルに設定します。例えば、
--service-account-key-file=&lt;filename&gt;

### 1.2.26 --etcd-certfileおよび--etcd-keyfile引数が適切に設定されていることを確認する（自動化）

**結果:** 合格

**監査:**
```bash
journalctl -D /var/log/journal -u k3s | grep -m1 'Running kube-apiserver'
```

**期待される結果:** '--etcd-certfile'が存在し、かつ'--etcd-keyfile'が存在する

<details>
<summary><b>返された値:</b></summary>

```console
2024年5月15日 18:38:23 server-0 k3s[2318]: time="2024-05-15T18:38:23Z" level=info msg="Running kube-apiserver --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction,NamespaceLifecycle,ServiceAccount,PodSecurityPolicy --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --feature-gates=JobTrackingWithFinalizers=true --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-lookup=true --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

### 1.2.27 --tls-cert-fileおよび--tls-private-key-file引数が適切に設定されていることを確認する（自動化）

**結果:** 合格

**監査:**
```bash
journalctl -D /var/log/journal -u k3s | grep -A1 'Running kube-apiserver' | tail -n2
```

**期待される結果:** '--tls-cert-file'が存在し、かつ'--tls-private-key-file'が存在する

<details>
<summary><b>返された値:</b></summary>

```console
2024年5月15日 18:38:23 server-0 k3s[2318]: time="2024-05-15T18:38:23Z" level=info msg="Running kube-apiserver --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction,NamespaceLifecycle,ServiceAccount,PodSecurityPolicy --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --feature-gates=JobTrackingWithFinalizers=true --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-lookup=true --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
2024年5月15日 18:38:23 server-0 k3s[2318]: time="2024-05-15T18:38:23Z" level=info msg="Running kube-scheduler --authentication-kubeconfig=/var/lib/rancher/k3s/server/cred/scheduler.kubeconfig --authorization-kubeconfig=/var/lib/rancher/k3s/server/cred/scheduler.kubeconfig --bind-address=127.0.0.1 --kubeconfig=/var/lib/rancher/k3s/server/cred/scheduler.kubeconfig --profiling=false --secure-port=10259"
```
</details>

### 1.2.28 --client-ca-file引数が適切に設定されていることを確認する（自動化）

**結果:** 合格

**監査:**
```bash
journalctl -D /var/log/journal  -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep 'client-ca-file'
```

**期待される結果:** '--client-ca-file' が存在する

<details>
<summary><b>返された値:</b></summary>

```console
May 15 18:38:23 server-0 k3s[2318]: time="2024-05-15T18:38:23Z" level=info msg="Running kube-apiserver --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction,NamespaceLifecycle,ServiceAccount,PodSecurityPolicy --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --feature-gates=JobTrackingWithFinalizers=true --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-lookup=true --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

### 1.2.29 --etcd-cafile 引数が適切に設定されていることを確認する (自動化)

**結果:** 合格

**監査:**
```bash
journalctl -D /var/log/journal  -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep 'etcd-cafile'
```

**期待される結果:** '--etcd-cafile' が存在する

<details>
<summary><b>返された値:</b></summary>

```console
May 15 18:38:23 server-0 k3s[2318]: time="2024-05-15T18:38:23Z" level=info msg="Running kube-apiserver --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction,NamespaceLifecycle,ServiceAccount,PodSecurityPolicy --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --feature-gates=JobTrackingWithFinalizers=true --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-lookup=true --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

### 1.2.30 --encryption-provider-config 引数が適切に設定されていることを確認する (自動化)

**結果:** 合格

**監査:**
```bash
journalctl -D /var/log/journal  -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep 'encryption-provider-config'
```

**期待される結果:** '--encryption-provider-config' が存在する

<details>
<summary><b>返された値:</b></summary>

```console
May 15 18:38:23 server-0 k3s[2318]: time="2024-05-15T18:38:23Z" level=info msg="Running kube-apiserver --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction,NamespaceLifecycle,ServiceAccount,PodSecurityPolicy --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --feature-gates=JobTrackingWithFinalizers=true --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-lookup=true --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

### 1.2.31 暗号化プロバイダーが適切に構成されていることを確認する (自動化)

**結果:** 警告

**修正:**
Kubernetesのドキュメントに従い、EncryptionConfigファイルを構成します。
このファイルで、aescbc、kms、またはsecretboxを暗号化プロバイダーとして選択します。

### 1.2.32 APIサーバーが強力な暗号化スイートのみを使用していることを確認する (自動化)

**結果:** 合格

**監査:**
```bash
journalctl -D /var/log/journal  -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep 'tls-cipher-suites'
```

**期待される結果:** '--tls-cipher-suites' は 'TLS_AES_128_GCM_SHA256,TLS_AES_256_GCM_SHA384,TLS_CHACHA20_POLY1305_SHA256,TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA,TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256,TLS_ECDHE_RSA_WITH_3DES_EDE_CBC_SHA,TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256,TLS_RSA_WITH_3DES_EDE_CBC_SHA,TLS_RSA_WITH_AES_128_CBC_SHA,TLS_RSA_WITH_AES_128_GCM_SHA256,TLS_RSA_WITH_AES_256_CBC_SHA,TLS_RSA_WITH_AES_256_GCM_SHA384' の有効な要素を含んでいる

<details>
<summary><b>返された値:</b></summary>

```console
May 15 18:38:23 server-0 k3s[2318]: time="2024-05-15T18:38:23Z" level=info msg="Running kube-apiserver --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction,NamespaceLifecycle,ServiceAccount,PodSecurityPolicy --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --feature-gates=JobTrackingWithFinalizers=true --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-lookup=true --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

## 1.3 コントローラーマネージャー

### 1.3.1 --terminated-pod-gc-threshold 引数が適切に設定されていることを確認する (自動化)

**結果:** 合格

**監査:**
```bash
journalctl -D /var/log/journal  -u k3s | grep 'Running kube-controller-manager' | tail -n1 | grep 'terminated-pod-gc-threshold'
```

**期待される結果:** '--terminated-pod-gc-threshold' が存在する

<details>
<summary><b>返された値:</b></summary>

```console
May 15 18:38:23 server-0 k3s[2318]: time="2024-05-15T18:38:23Z" level=info msg="Running kube-controller-manager --allocate-node-cidrs=true --authentication-kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --authorization-kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --bind-address=127.0.0.1 --cluster-cidr=10.42.0.0/16 --cluster-signing-kube-apiserver-client-cert-file=/var/lib/rancher/k3s/server/tls/client-ca.nochain.crt --cluster-signing-kube-apiserver-client-key-file=/var/lib/rancher/k3s/server/tls/client-ca.key --cluster-signing-kubelet-client-cert-file=/var/lib/rancher/k3s/server/tls/client-ca.nochain.crt --cluster-signing-kubelet-client-key-file=/var/lib/rancher/k3s/server/tls/client-ca.key --cluster-signing-kubelet-serving-cert-file=/var/lib/rancher/k3s/server/tls/server-ca.nochain.crt --cluster-signing-kubelet-serving-key-file=/var/lib/rancher/k3s/server/tls/server-ca.key --cluster-signing-legacy-unknown-cert-file=/var/lib/rancher/k3s/server/tls/server-ca.nochain.crt --cluster-signing-legacy-unknown-key-file=/var/lib/rancher/k3s/server/tls/server-ca.key --configure-cloud-routes=false --controllers=*,tokencleaner,-service,-route,-cloud-node-lifecycle --feature-gates=JobTrackingWithFinalizers=true --kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --profiling=false --root-ca-file=/var/lib/rancher/k3s/server/tls/server-ca.crt --secure-port=10257 --service-account-private-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --terminated-pod-gc-threshold=10 --use-service-account-credentials=true"
```
</details>

### 1.3.2 --profiling 引数が false に設定されていることを確認する (自動化)

**結果:** 合格

**監査:**
```bash
journalctl -D /var/log/journal  -u k3s | grep 'Running kube-controller-manager' | tail -n1 | grep 'profiling'
```

**期待される結果:** '--profiling' が 'false' に等しい

<details>
<summary><b>返された値:</b></summary>

```console
May 15 18:38:23 server-0 k3s[2318]: time="2024-05-15T18:38:23Z" level=info msg="Running kube-controller-manager --allocate-node-cidrs=true --authentication-kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --authorization-kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --bind-address=127.0.0.1 --cluster-cidr=10.42.0.0/16 --cluster-signing-kube-apiserver-client-cert-file=/var/lib/rancher/k3s/server/tls/client-ca.nochain.crt --cluster-signing-kube-apiserver-client-key-file=/var/lib/rancher/k3s/server/tls/client-ca.key --cluster-signing-kubelet-client-cert-file=/var/lib/rancher/k3s/server/tls/client-ca.nochain.crt --cluster-signing-kubelet-client-key-file=/var/lib/rancher/k3s/server/tls/client-ca.key --cluster-signing-kubelet-serving-cert-file=/var/lib/rancher/k3s/server/tls/server-ca.nochain.crt --cluster-signing-kubelet-serving-key-file=/var/lib/rancher/k3s/server/tls/server-ca.key --cluster-signing-legacy-unknown-cert-file=/var/lib/rancher/k3s/server/tls/server-ca.nochain.crt --cluster-signing-legacy-unknown-key-file=/var/lib/rancher/k3s/server/tls/server-ca.key --configure-cloud-routes=false --controllers=*,tokencleaner,-service,-route,-cloud-node-lifecycle --feature-gates=JobTrackingWithFinalizers=true --kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --profiling=false --root-ca-file=/var/lib/rancher/k3s/server/tls/server-ca.crt --secure-port=10257 --service-account-private-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --terminated-pod-gc-threshold=10 --use-service-account-credentials=true"
```
</details>

### 1.3.3 --use-service-account-credentials 引数が true に設定されていることを確認する (自動化)

**結果:** 合格

**監査:**
```bash
journalctl -D /var/log/journal  -u k3s | grep 'Running kube-controller-manager' | tail -n1 | grep 'use-service-account-credentials'
```

**期待される結果:** '--use-service-account-credentials' が 'false' に等しくない

<details>
<summary><b>返された値:</b></summary>

```console
May 15 18:38:23 server-0 k3s[2318]: time="2024-05-15T18:38:23Z" level=info msg="Running kube-controller-manager --allocate-node-cidrs=true --authentication-kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --authorization-kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --bind-address=127.0.0.1 --cluster-cidr=10.42.0.0/16 --cluster-signing-kube-apiserver-client-cert-file=/var/lib/rancher/k3s/server/tls/client-ca.nochain.crt --cluster-signing-kube-apiserver-client-key-file=/var/lib/rancher/k3s/server/tls/client-ca.key --cluster-signing-kubelet-client-cert-file=/var/lib/rancher/k3s/server/tls/client-ca.nochain.crt --cluster-signing-kubelet-client-key-file=/var/lib/rancher/k3s/server/tls/client-ca.key --cluster-signing-kubelet-serving-cert-file=/var/lib/rancher/k3s/server/tls/server-ca.nochain.crt --cluster-signing-kubelet-serving-key-file=/var/lib/rancher/k3s/server/tls/server-ca.key --cluster-signing-legacy-unknown-cert-file=/var/lib/rancher/k3s/server/tls/server-ca.nochain.crt --cluster-signing-legacy-unknown-key-file=/var/lib/rancher/k3s/server/tls/server-ca.key --configure-cloud-routes=false --controllers=*,tokencleaner,-service,-route,-cloud-node-lifecycle --feature-gates=JobTrackingWithFinalizers=true --kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --profiling=false --root-ca-file=/var/lib/rancher/k3s/server/tls/server-ca.crt --secure-port=10257 --service-account-private-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --terminated-pod-gc-threshold=10 --use-service-account-credentials=true"
```
</details>

### 1.3.4 --service-account-private-key-file 引数が適切に設定されていることを確認する (自動化)

**結果:** 合格

**監査:**
```bash
journalctl -D /var/log/journal  -u k3s | grep 'Running kube-controller-manager' | tail -n1 | grep 'service-account-private-key-file'
```

**期待される結果:** '--service-account-private-key-file' が存在する

<details>
<summary><b>返された値:</b></summary>

```console
2024年5月15日 18:38:23 server-0 k3s[2318]: time="2024-05-15T18:38:23Z" level=info msg="Running kube-controller-manager --allocate-node-cidrs=true --authentication-kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --authorization-kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --bind-address=127.0.0.1 --cluster-cidr=10.42.0.0/16 --cluster-signing-kube-apiserver-client-cert-file=/var/lib/rancher/k3s/server/tls/client-ca.nochain.crt --cluster-signing-kube-apiserver-client-key-file=/var/lib/rancher/k3s/server/tls/client-ca.key --cluster-signing-kubelet-client-cert-file=/var/lib/rancher/k3s/server/tls/client-ca.nochain.crt --cluster-signing-kubelet-client-key-file=/var/lib/rancher/k3s/server/tls/client-ca.key --cluster-signing-kubelet-serving-cert-file=/var/lib/rancher/k3s/server/tls/server-ca.nochain.crt --cluster-signing-kubelet-serving-key-file=/var/lib/rancher/k3s/server/tls/server-ca.key --cluster-signing-legacy-unknown-cert-file=/var/lib/rancher/k3s/server/tls/server-ca.nochain.crt --cluster-signing-legacy-unknown-key-file=/var/lib/rancher/k3s/server/tls/server-ca.key --configure-cloud-routes=false --controllers=*,tokencleaner,-service,-route,-cloud-node-lifecycle --feature-gates=JobTrackingWithFinalizers=true --kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --profiling=false --root-ca-file=/var/lib/rancher/k3s/server/tls/server-ca.crt --secure-port=10257 --service-account-private-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --terminated-pod-gc-threshold=10 --use-service-account-credentials=true"
```
</details>

### 1.3.5 --root-ca-file 引数が適切に設定されていることを確認する (自動化)

**結果:** 合格

**監査:**
```bash
journalctl -D /var/log/journal  -u k3s | grep 'Running kube-controller-manager' | tail -n1 | grep 'root-ca-file'
```

**期待される結果:** '--root-ca-file' が存在する

<details>
<summary><b>返された値:</b></summary>

```console
2024年5月15日 18:38:23 server-0 k3s[2318]: time="2024-05-15T18:38:23Z" level=info msg="Running kube-controller-manager --allocate-node-cidrs=true --authentication-kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --authorization-kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --bind-address=127.0.0.1 --cluster-cidr=10.42.0.0/16 --cluster-signing-kube-apiserver-client-cert-file=/var/lib/rancher/k3s/server/tls/client-ca.nochain.crt --cluster-signing-kube-apiserver-client-key-file=/var/lib/rancher/k3s/server/tls/client-ca.key --cluster-signing-kubelet-client-cert-file=/var/lib/rancher/k3s/server/tls/client-ca.nochain.crt --cluster-signing-kubelet-client-key-file=/var/lib/rancher/k3s/server/tls/client-ca.key --cluster-signing-kubelet-serving-cert-file=/var/lib/rancher/k3s/server/tls/server-ca.nochain.crt --cluster-signing-kubelet-serving-key-file=/var/lib/rancher/k3s/server/tls/server-ca.key --cluster-signing-legacy-unknown-cert-file=/var/lib/rancher/k3s/server/tls/server-ca.nochain.crt --cluster-signing-legacy-unknown-key-file=/var/lib/rancher/k3s/server/tls/server-ca.key --configure-cloud-routes=false --controllers=*,tokencleaner,-service,-route,-cloud-node-lifecycle --feature-gates=JobTrackingWithFinalizers=true --kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --profiling=false --root-ca-file=/var/lib/rancher/k3s/server/tls/server-ca.crt --secure-port=10257 --service-account-private-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --terminated-pod-gc-threshold=10 --use-service-account-credentials=true"
```
</details>

### 1.3.6 RotateKubeletServerCertificate 引数が true に設定されていることを確認する (自動化)

**結果:** 該当なし

**修正方法:**
コントロールプレーンノードの Controller Manager ポッド仕様ファイル /etc/kubernetes/manifests/kube-controller-manager.yaml を編集し、--feature-gates パラメータに RotateKubeletServerCertificate=true を含めます。
--feature-gates=RotateKubeletServerCertificate=true

### 1.3.7 --bind-address 引数が 127.0.0.1 に設定されていることを確認する (自動化)

**結果:** 合格

**監査:**
```bash
/bin/ps -ef | grep containerd | grep -v grep
```

**期待される結果:** '--bind-address' が存在する OR '--bind-address' が存在しない

<details>
<summary><b>返された値:</b></summary>

```console
root        2335    2318  0 18:38 ?        00:00:00 containerd -c /var/lib/rancher/k3s/agent/etc/containerd/config.toml -a /run/k3s/containerd/containerd.sock --state /run/k3s/containerd --root /var/lib/rancher/k3s/agent/containerd
```
</details>

## 1.4 スケジューラー

### 1.4.1 --profiling 引数が false に設定されていることを確認する (自動化)

**結果:** 合格

**監査:**
```bash
journalctl -D /var/log/journal -u k3s | grep 'Running kube-scheduler' | tail -n1
```

**期待される結果:** '--profiling' が 'false' に等しい

<details>
<summary><b>返された値:</b></summary>

```console
2024年5月15日 18:38:23 server-0 k3s[2318]: time="2024-05-15T18:38:23Z" level=info msg="Running kube-scheduler --authentication-kubeconfig=/var/lib/rancher/k3s/server/cred/scheduler.kubeconfig --authorization-kubeconfig=/var/lib/rancher/k3s/server/cred/scheduler.kubeconfig --bind-address=127.0.0.1 --kubeconfig=/var/lib/rancher/k3s/server/cred/scheduler.kubeconfig --profiling=false --secure-port=10259"
```
</details>

### 1.4.2 --bind-address 引数が 127.0.0.1 に設定されていることを確認する (自動化)

**結果:** 合格

**監査:**
```bash
journalctl -D /var/log/journal  -u k3s | grep 'Running kube-scheduler' | tail -n1 | grep 'bind-address'
```

**期待される結果:** '--bind-address' が '127.0.0.1' に等しい OR '--bind-address' が存在しない

<details>
<summary><b>返された値:</b></summary>

```console
2024年5月15日 18:38:23 server-0 k3s[2318]: time="2024-05-15T18:38:23Z" level=info msg="Running kube-scheduler --authentication-kubeconfig=/var/lib/rancher/k3s/server/cred/scheduler.kubeconfig --authorization-kubeconfig=/var/lib/rancher/k3s/server/cred/scheduler.kubeconfig --bind-address=127.0.0.1 --kubeconfig=/var/lib/rancher/k3s/server/cred/scheduler.kubeconfig --profiling=false --secure-port=10259"
```
</details>

## 2 Etcd ノード構成

### 2.1 --cert-file および --key-file 引数が適切に設定されていることを確認する (自動化)

**結果:** 合格

**監査:**
```bash
grep -A 4 'client-transport-security' /var/lib/rancher/k3s/server/db/etcd/config | grep -E 'cert-file|key-file'
```

**期待される結果:** 'cert-file' が存在する AND 'key-file' が存在する

<details>
<summary><b>返された値:</b></summary>

```console
  cert-file: /var/lib/rancher/k3s/server/tls/etcd/server-client.crt
  key-file: /var/lib/rancher/k3s/server/tls/etcd/server-client.key
```
</details>

### 2.2 --client-cert-auth 引数が true に設定されていることを確認する (自動化)

**結果:** 合格

**監査:**
```bash
grep -A 4 'client-transport-security' /var/lib/rancher/k3s/server/db/etcd/config | grep 'client-cert-auth'
```

**期待される結果:** '--client-cert-auth' が存在する OR 'client-cert-auth' が 'true' に等しい

<details>
<summary><b>返された値:</b></summary>

```console
  client-cert-auth: true
```
</details>

### 2.3 --auto-tls 引数が true に設定されていないことを確認する (自動化)

**結果:** 合格

**監査:**
```bash
if grep -q '^auto-tls' /var/lib/rancher/k3s/server/db/etcd/config;then grep '^auto-tls' /var/lib/rancher/k3s/server/db/etcd/config;else echo 'notset';fi
```

**期待される結果:** '--auto-tls' が存在しない OR '--auto-tls' が存在する

<details>
<summary><b>返された値:</b></summary>

```console
notset
```
</details>

### 2.4 --peer-cert-file および --peer-key-file 引数が適切に設定されていることを確認する (自動化)

**結果:** 合格

**監査:**
```bash
grep -A 4 'peer-transport-security' /var/lib/rancher/k3s/server/db/etcd/config | grep -E 'cert-file|key-file'
```

**期待される結果:** 'cert-file' が存在する AND 'key-file' が存在する

<details>
<summary><b>返された値:</b></summary>

```console
  cert-file: /var/lib/rancher/k3s/server/tls/etcd/peer-server-client.crt
  key-file: /var/lib/rancher/k3s/server/tls/etcd/peer-server-client.key
```
</details>

### 2.5 --peer-client-cert-auth 引数が true に設定されていることを確認する (自動化)

**結果:** 合格

**監査:**
```bash
grep -A 4 'peer-transport-security' /var/lib/rancher/k3s/server/db/etcd/config | grep 'client-cert-auth'
```

**期待される結果:** '--client-cert-auth' が存在する OR 'client-cert-auth' が 'true' に等しい

<details>
<summary><b>返された値:</b></summary>

```console
  client-cert-auth: true
```
</details>

### 2.6 --peer-auto-tls 引数が true に設定されていないことを確認する (自動化)

**結果:** 合格

**監査:**
```bash
if grep -q '^peer-auto-tls' /var/lib/rancher/k3s/server/db/etcd/config;then grep '^peer-auto-tls' /var/lib/rancher/k3s/server/db/etcd/config;else echo 'notset';fi
```

**期待される結果:** '--peer-auto-tls' が存在しない OR '--peer-auto-tls' が存在する

<details>
<summary><b>返された値:</b></summary>

```console
notset
```
</details>

### 2.7 Etcd に対して一意の証明書認証局が使用されていることを確認する (自動化)

**結果:** 合格

**監査:**
```bash
if grep -q 'trusted-ca-file' /var/lib/rancher/k3s/server/db/etcd/config;then grep 'trusted-ca-file' /var/lib/rancher/k3s/server/db/etcd/config;else echo 'notset';fi
```

**期待される結果:** 'trusted-ca-file' が存在する

<details>
<summary><b>返された値:</b></summary>

```console
  trusted-ca-file: /var/lib/rancher/k3s/server/tls/etcd/server-ca.crt
  trusted-ca-file: /var/lib/rancher/k3s/server/tls/etcd/peer-ca.crt
```
</details>

## 4.1 ワーカーノード構成ファイル

### 4.1.1 kubelet サービスファイルの権限が 600 またはそれ以上に制限されていることを確認する (自動化)

**結果:** 該当なし

**修正方法:**
各ワーカーノードで以下のコマンドを実行します（システム上のファイルの場所に基づく）。
例: chmod 600 /etc/systemd/system/kubelet.service.d/10-kubeadm.conf

### 4.1.2 kubelet サービスファイルの所有者が root:root に設定されていることを確認する (自動化)

**結果:** 該当なし

**修正方法:**
各ワーカーノードで以下のコマンドを実行します（システム上のファイルの場所に基づく）。
例:
chown root:root /etc/systemd/system/kubelet.service.d/10-kubeadm.conf

### 4.1.3 プロキシ kubeconfig ファイルが存在する場合、パーミッションが 600 またはそれより制限されていることを確認する (手動)

**結果:** WARN

**修正方法:**
各ワーカーノードで以下のコマンドを実行します（システム上のファイルの場所に基づく）。
例えば、
chmod 600 /var/lib/rancher/k3s/agent/kubeproxy.kubeconfig

### 4.1.4 プロキシ kubeconfig ファイルが存在する場合、所有者が root:root に設定されていることを確認する (手動)

**結果:** PASS

**監査:**
```bash
/bin/sh -c 'if test -e /var/lib/rancher/k3s/agent/kubeproxy.kubeconfig; then stat -c %U:%G /var/lib/rancher/k3s/agent/kubeproxy.kubeconfig; fi' 
```

**期待される結果:** 'root:root' が存在する

<details>
<summary><b>返された値:</b></summary>

```console
root:root
```
</details>

### 4.1.5 --kubeconfig kubelet.conf ファイルのパーミッションが 600 またはそれより制限されていることを確認する (自動)

**結果:** PASS

**監査:**
```bash
stat -c %a /var/lib/rancher/k3s/agent/kubelet.kubeconfig 
```

**期待される結果:** '600' が '600' と等しい

<details>
<summary><b>返された値:</b></summary>

```console
600
```
</details>

### 4.1.6 --kubeconfig kubelet.conf ファイルの所有者が root:root に設定されていることを確認する (自動)

**結果:** PASS

**監査:**
```bash
stat -c %U:%G /var/lib/rancher/k3s/agent/kubelet.kubeconfig
```

**期待される結果:** 'root:root' が 'root:root' と等しい

<details>
<summary><b>返された値:</b></summary>

```console
root:root
```
</details>

### 4.1.7 証明書認証局ファイルのパーミッションが 600 またはそれより制限されていることを確認する (手動)

**結果:** WARN

**修正方法:**
以下のコマンドを実行して、--client-ca-file のファイルパーミッションを変更します。
chmod 600 &lt;filename&gt;

### 4.1.8 クライアント証明書認証局ファイルの所有者が root:root に設定されていることを確認する (手動)

**結果:** PASS

**監査:**
```bash
stat -c %U:%G /var/lib/rancher/k3s/server/tls/client-ca.crt
```

**期待される結果:** 'root:root' が存在する

<details>
<summary><b>返された値:</b></summary>

```console
root:root
```
</details>

### 4.1.9 kubelet config.yaml 設定ファイルが使用されている場合、パーミッションが 600 またはそれより制限されていることを確認する (手動)

**結果:** 該当なし

**修正方法:**
以下のコマンドを実行します（監査ステップで特定された設定ファイルの場所を使用）。
chmod 600 /var/lib/kubelet/config.yaml

### 4.1.10 kubelet config.yaml 設定ファイルが使用されている場合、ファイルの所有者が root:root に設定されていることを確認する (手動)

**結果:** 該当なし

**修正方法:**
以下のコマンドを実行します（監査ステップで特定された設定ファイルの場所を使用）。
chown root:root /var/lib/kubelet/config.yaml

## 4.2 Kubelet

### 4.2.1 --anonymous-auth 引数が false に設定されていることを確認する (自動)

**結果:** PASS

**監査:**
```bash
/bin/sh -c 'if test $(journalctl -D /var/log/journal -u k3s | grep "Running kube-apiserver" | wc -l) -gt 0; then journalctl -D /var/log/journal -u k3s | grep "Running kube-apiserver" | tail -n1 | grep "anonymous-auth" | grep -v grep; else echo "--anonymous-auth=false"; fi' 
```

**期待される結果:** '--anonymous-auth' が 'false' と等しい

<details>
<summary><b>返された値:</b></summary>

```console
May 15 18:38:23 server-0 k3s[2318]: time="2024-05-15T18:38:23Z" level=info msg="Running kube-apiserver --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction,NamespaceLifecycle,ServiceAccount,PodSecurityPolicy --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --feature-gates=JobTrackingWithFinalizers=true --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-lookup=true --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

### 4.2.2 --authorization-mode 引数が AlwaysAllow に設定されていないことを確認する (自動)

**結果:** PASS

**監査:**
```bash
/bin/sh -c 'if test $(journalctl -D /var/log/journal -u k3s | grep "Running kube-apiserver" | wc -l) -gt 0; then journalctl -D /var/log/journal -u k3s | grep "Running kube-apiserver" | tail -n1 | grep "authorization-mode" | grep -v grep; else echo "--authorization-mode=Webhook"; fi' 
```

**期待される結果:** '--authorization-mode' に 'AlwaysAllow' が含まれていない

<details>
<summary><b>返された値:</b></summary>

```console
May 15 18:38:23 server-0 k3s[2318]: time="2024-05-15T18:38:23Z" level=info msg="Running kube-apiserver --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction,NamespaceLifecycle,ServiceAccount,PodSecurityPolicy --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --feature-gates=JobTrackingWithFinalizers=true --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-lookup=true --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

### 4.2.3 --client-ca-file 引数が適切に設定されていることを確認する (自動)

**結果:** PASS

**監査:**
```bash
/bin/sh -c 'if test $(journalctl -D /var/log/journal -u k3s | grep "Running kube-apiserver" | wc -l) -gt 0; then journalctl -D /var/log/journal -u k3s | grep "Running kube-apiserver" | tail -n1 | grep "client-ca-file" | grep -v grep; else echo "--client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt"; fi' 
```

**期待される結果:** '--client-ca-file' が存在する

<details>
<summary><b>返された値:</b></summary>

```console
May 15 18:38:23 server-0 k3s[2318]: time="2024-05-15T18:38:23Z" level=info msg="Running kube-apiserver --advertise-address=10.10.10.100 --advertise-port=
2024年5月15日 18:38:23 server-0 k3s[2318]: time="2024-05-15T18:38:23Z" level=info msg="Running kube-apiserver --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction,NamespaceLifecycle,ServiceAccount,PodSecurityPolicy --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --feature-gates=JobTrackingWithFinalizers=true --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-lookup=true --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

### 4.2.4 --read-only-port 引数が 0 に設定されていることを確認する (手動)

**結果:** PASS

**監査:**
```bash
journalctl -D /var/log/journal -u k3s | grep 'Running kubelet' | tail -n1 | grep 'read-only-port' 
```

**期待される結果:** '--read-only-port' が '0' に等しい、または '--read-only-port' が存在しない

<details>
<summary><b>返された値:</b></summary>

```console
2024年5月15日 18:38:24 server-0 k3s[2318]: time="2024-05-15T18:38:24Z" level=info msg="Running kubelet --address=0.0.0.0 --allowed-unsafe-sysctls=net.ipv4.ip_forward,net.ipv6.conf.all.forwarding --anonymous-auth=false --authentication-token-webhook=true --authorization-mode=Webhook --cgroup-driver=systemd --client-ca-file=/var/lib/rancher/k3s/agent/client-ca.crt --cloud-provider=external --cluster-dns=10.43.0.10 --cluster-domain=cluster.local --container-runtime-endpoint=unix:///run/k3s/containerd/containerd.sock --containerd=/run/k3s/containerd/containerd.sock --event-qps=0 --eviction-hard=imagefs.available<5%,nodefs.available<5% --eviction-minimum-reclaim=imagefs.available=10%,nodefs.available=10% --fail-swap-on=false --healthz-bind-address=127.0.0.1 --hostname-override=server-0 --kubeconfig=/var/lib/rancher/k3s/agent/kubelet.kubeconfig --make-iptables-util-chains=true --node-ip=10.10.10.100 --node-labels= --pod-infra-container-image=rancher/mirrored-pause:3.6 --pod-manifest-path=/var/lib/rancher/k3s/agent/pod-manifests --protect-kernel-defaults=true --read-only-port=0 --resolv-conf=/run/systemd/resolve/resolv.conf --serialize-image-pulls=false --streaming-connection-idle-timeout=5m --tls-cert-file=/var/lib/rancher/k3s/agent/serving-kubelet.crt --tls-private-key-file=/var/lib/rancher/k3s/agent/serving-kubelet.key"
```
</details>

### 4.2.5 --streaming-connection-idle-timeout 引数が 0 に設定されていないことを確認する (手動)

**結果:** PASS

**監査:**
```bash
journalctl -D /var/log/journal -u k3s | grep 'Running kubelet' | tail -n1 | grep 'streaming-connection-idle-timeout'
```

**期待される結果:** '--streaming-connection-idle-timeout' が '0' に等しくない、または '--streaming-connection-idle-timeout' が存在しない

<details>
<summary><b>返された値:</b></summary>

```console
2024年5月15日 18:38:24 server-0 k3s[2318]: time="2024-05-15T18:38:24Z" level=info msg="Running kubelet --address=0.0.0.0 --allowed-unsafe-sysctls=net.ipv4.ip_forward,net.ipv6.conf.all.forwarding --anonymous-auth=false --authentication-token-webhook=true --authorization-mode=Webhook --cgroup-driver=systemd --client-ca-file=/var/lib/rancher/k3s/agent/client-ca.crt --cloud-provider=external --cluster-dns=10.43.0.10 --cluster-domain=cluster.local --container-runtime-endpoint=unix:///run/k3s/containerd/containerd.sock --containerd=/run/k3s/containerd/containerd.sock --event-qps=0 --eviction-hard=imagefs.available<5%,nodefs.available<5% --eviction-minimum-reclaim=imagefs.available=10%,nodefs.available=10% --fail-swap-on=false --healthz-bind-address=127.0.0.1 --hostname-override=server-0 --kubeconfig=/var/lib/rancher/k3s/agent/kubelet.kubeconfig --make-iptables-util-chains=true --node-ip=10.10.10.100 --node-labels= --pod-infra-container-image=rancher/mirrored-pause:3.6 --pod-manifest-path=/var/lib/rancher/k3s/agent/pod-manifests --protect-kernel-defaults=true --read-only-port=0 --resolv-conf=/run/systemd/resolve/resolv.conf --serialize-image-pulls=false --streaming-connection-idle-timeout=5m --tls-cert-file=/var/lib/rancher/k3s/agent/serving-kubelet.crt --tls-private-key-file=/var/lib/rancher/k3s/agent/serving-kubelet.key"
```
</details>

### 4.2.6 --protect-kernel-defaults 引数が true に設定されていることを確認する (自動化)

**結果:** 該当なし

**修正方法:**
Kubelet 設定ファイルを使用している場合は、ファイルを編集して `protectKernelDefaults` を `true` に設定します。
コマンドライン引数を使用している場合は、各ワーカーノードの kubelet サービスファイル
/etc/systemd/system/kubelet.service.d/10-kubeadm.conf を編集し、KUBELET_SYSTEM_PODS_ARGS 変数に以下のパラメータを設定します。
--protect-kernel-defaults=true
システムに基づいて、kubelet サービスを再起動します。例えば:
systemctl daemon-reload
systemctl restart kubelet.service

### 4.2.7 --make-iptables-util-chains 引数が true に設定されていることを確認する (自動化)

**結果:** 該当なし

**修正方法:**
Kubelet 設定ファイルを使用している場合は、ファイルを編集して `makeIPTablesUtilChains` を `true` に設定します。
コマンドライン引数を使用している場合は、各ワーカーノードの kubelet サービスファイル
/etc/systemd/system/kubelet.service.d/10-kubeadm.conf を編集し、
KUBELET_SYSTEM_PODS_ARGS 変数から --make-iptables-util-chains 引数を削除します。
システムに基づいて、kubelet サービスを再起動します。例えば:
systemctl daemon-reload
systemctl restart kubelet.service

### 4.2.8 --hostname-override 引数が設定されていないことを確認する (手動)

**結果:** 該当なし

**修正方法:**
各ワーカーノードの kubelet サービスファイル /etc/systemd/system/kubelet.service.d/10-kubeadm.conf を編集し、
KUBELET_SYSTEM_PODS_ARGS 変数から --hostname-override 引数を削除します。
システムに基づいて、kubelet サービスを再起動します。例えば:
systemctl daemon-reload
systemctl restart kubelet.service

### 4.2.9 eventRecordQPS 引数が適切なイベントキャプチャを確保するレベルに設定されていることを確認する (手動)

**結果:** WARN

**修正方法:**
Kubelet 設定ファイルを使用している場合は、ファイルを編集して `eventRecordQPS` を適切なレベルに設定します。
コマンドライン引数を使用している場合は、各ワーカーノードの kubelet サービスファイル
/etc/systemd/system/kubelet.service.d/10-kubeadm.conf を編集し、
KUBELET_SYSTEM_PODS_ARGS 変数に以下のパラメータを設定します。
システムに基づいて、kubelet サービスを再起動します。例えば:
systemctl daemon-reload
systemctl restart kubelet.service

### 4.2.10 --tls-cert-file および --tls-private-key-file 引数が適切に設定されていることを確認する (手動)

**結果:** PASS

**監査:**
```bash
journalctl -D /var/log/journal -u k3s | grep 'Running kubelet' | tail -n1
```

**期待される結果:** '--tls-cert-file' が存在し、かつ '--tls-private-key-file' が存在する

<details>
<summary><b>返された値:</b></summary>

```console
2024年5月15日 18:38:24 server-0 k3s[2318]: time="2024-05-15T18:38:24Z" level=info msg="Running kubelet --address=0.0.0.0 --allowed-unsafe-sysctls=net.ipv4.ip_forward,net.ipv6.conf.all.forwarding --anonymous-auth=false --authentication-token-webhook=true --authorization-mode=Webhook --cgroup-driver=systemd --client-ca-file=/var/lib/rancher/k3s/agent/client-ca.crt --cloud-provider=external --cluster-dns=10.43.0.10 --cluster-domain=cluster.local --container-runtime-endpoint=unix:///run/k3s/containerd/containerd.sock --containerd=/run/k3s/containerd/containerd.sock --event-qps=0 --eviction-hard=imagefs.available<5%,nodefs.available<5% --eviction-minimum-reclaim=imagefs.available=10%,nodefs.available=10% --fail-swap-on=false --healthz-bind-address=127.0.0.1 --hostname-override=server-0 --kubeconfig=/var/lib/rancher/k3s/agent/kubelet.kubeconfig --make-iptables-util-chains=true --node-ip=10.10.10.100 --node-labels= --pod-infra-container-image=rancher/mirrored-pause:3.6 --pod-manifest-path=/var/lib/rancher/k3s/agent/pod-manifests --protect-kernel-defaults=true --read-only-port=0 --resolv-conf=/run/systemd/resolve/resolv.conf --serialize-image-pulls=false --streaming-connection-idle-timeout=5m --tls-cert-file=/var/lib/rancher/k3s/agent/serving-kubelet.crt --tls-private-key-file=/var/lib/rancher/k3s/agent/serving-kubelet.key"
```
</details>
```
</details>

### 4.2.11 --rotate-certificates 引数が false に設定されていないことを確認する (自動化)

**結果:** 合格

**監査:**
```bash
journalctl -D /var/log/journal -u k3s | grep 'Running kubelet' | tail -n1
```

**期待される結果:** '--rotate-certificates' が存在する、または '--rotate-certificates' が存在しない

<details>
<summary><b>返された値:</b></summary>

```console
May 15 18:38:24 server-0 k3s[2318]: time="2024-05-15T18:38:24Z" level=info msg="Running kubelet --address=0.0.0.0 --allowed-unsafe-sysctls=net.ipv4.ip_forward,net.ipv6.conf.all.forwarding --anonymous-auth=false --authentication-token-webhook=true --authorization-mode=Webhook --cgroup-driver=systemd --client-ca-file=/var/lib/rancher/k3s/agent/client-ca.crt --cloud-provider=external --cluster-dns=10.43.0.10 --cluster-domain=cluster.local --container-runtime-endpoint=unix:///run/k3s/containerd/containerd.sock --containerd=/run/k3s/containerd/containerd.sock --event-qps=0 --eviction-hard=imagefs.available<5%,nodefs.available<5% --eviction-minimum-reclaim=imagefs.available=10%,nodefs.available=10% --fail-swap-on=false --healthz-bind-address=127.0.0.1 --hostname-override=server-0 --kubeconfig=/var/lib/rancher/k3s/agent/kubelet.kubeconfig --make-iptables-util-chains=true --node-ip=10.10.10.100 --node-labels= --pod-infra-container-image=rancher/mirrored-pause:3.6 --pod-manifest-path=/var/lib/rancher/k3s/agent/pod-manifests --protect-kernel-defaults=true --read-only-port=0 --resolv-conf=/run/systemd/resolve/resolv.conf --serialize-image-pulls=false --streaming-connection-idle-timeout=5m --tls-cert-file=/var/lib/rancher/k3s/agent/serving-kubelet.crt --tls-private-key-file=/var/lib/rancher/k3s/agent/serving-kubelet.key"
```
</details>

### 4.2.12 RotateKubeletServerCertificate 引数が true に設定されていることを確認する (手動)

**結果:** 警告

**修正方法:**
各ワーカーノードの kubelet サービスファイル /etc/systemd/system/kubelet.service.d/10-kubeadm.conf を編集し、KUBELET_CERTIFICATE_ARGS 変数に以下のパラメータを設定します。
--feature-gates=RotateKubeletServerCertificate=true
システムに基づいて、kubelet サービスを再起動します。例:
systemctl daemon-reload
systemctl restart kubelet.service

### 4.2.13 Kubelet が強力な暗号化スイートのみを使用することを確認する (手動)

**結果:** 警告

**修正方法:**
Kubelet 設定ファイルを使用している場合、ファイルを編集して `TLSCipherSuites` を以下の値に設定します。
TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_AES_128_GCM_SHA256
またはこれらの値のサブセットに設定します。
実行可能な引数を使用している場合、各ワーカーノードの kubelet サービスファイル /etc/systemd/system/kubelet.service.d/10-kubeadm.conf を編集し、--tls-cipher-suites パラメータを以下のように設定します。またはこれらの値のサブセットに設定します。
--tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_AES_128_GCM_SHA256
システムに基づいて、kubelet サービスを再起動します。例:
systemctl daemon-reload
systemctl restart kubelet.service

## 5.1 RBAC とサービスアカウント

### 5.1.1 cluster-admin ロールが必要な場合にのみ使用されていることを確認する (手動)

**結果:** 警告

**修正方法:**
cluster-admin ロールへのすべての clusterrolebinding を特定します。それらが使用されているかどうか、またこのロールが必要かどうか、またはより少ない特権のロールを使用できるかどうかを確認します。
可能な場合は、まずユーザーを低特権のロールにバインドし、その後 cluster-admin ロールへの clusterrolebinding を削除します:
kubectl delete clusterrolebinding [name]

### 5.1.2 シークレットへのアクセスを最小限に抑える (手動)

**結果:** 警告

**修正方法:**
可能な場合は、クラスター内のシークレットオブジェクトへの get、list、および watch アクセスを削除します。

### 5.1.3 ロールおよびクラスターロールでのワイルドカードの使用を最小限に抑える (手動)

**結果:** 警告

**修正方法:**
可能な場合は、clusterroles および roles でのワイルドカードの使用を特定のオブジェクトまたはアクションに置き換えます。

### 5.1.4 ポッドの作成アクセスを最小限に抑える (手動)

**結果:** 警告

**修正方法:**
可能な場合は、クラスター内のポッドオブジェクトへの作成アクセスを削除します。

### 5.1.5 デフォルトのサービスアカウントが積極的に使用されていないことを確認する (手動)

**結果:** 警告

**修正方法:**
Kubernetes ワークロードが Kubernetes API サーバーへの特定のアクセスを必要とする場合は、明示的なサービスアカウントを作成します。
各デフォルトのサービスアカウントの設定を変更し、以下の値を含めます:
automountServiceAccountToken: false

### 5.1.6 サービスアカウントトークンが必要な場合にのみマウントされることを確認する (手動)

**結果:** 警告

**修正方法:**
サービスアカウントトークンをマウントする必要がないポッドおよびサービスアカウントの定義を変更して無効にします。

### 5.1.7 system:masters グループの使用を避ける (手動)

**結果:** 警告

**修正方法:**
クラスター内のすべてのユーザーから system:masters グループを削除します。

### 5.1.8 Kubernetes クラスターでの Bind、Impersonate、および Escalate 権限の使用を制限する (手動)

**結果:** 警告

**修正方法:**
可能な場合は、サブジェクトから impersonate、bind、および escalate 権限を削除します。

## 5.2 ポッドセキュリティ基準

### 5.2.1 クラスターに少なくとも1つのアクティブなポリシー制御メカニズムが存在することを確認する (手動)

**結果:** 警告

**修正方法:**
Pod Security Admission または外部ポリシー制御システムが、ユーザーワークロードを含むすべてのネームスペースに対して存在することを確認します。

### 5.2.2 特権コンテナの受け入れを最小限に抑える (手動)

**結果:** 警告

**修正方法:**
ユーザーワークロードを含むクラスター内の各ネームスペースにポリシーを追加し、特権コンテナの受け入れを制限します。

### 5.2.3 ホストプロセスIDネームスペースを共有しようとするコンテナの受け入れを最小限に抑える (自動化)

**結果:** 警告

**修正方法:**
ユーザーワークロードを含むクラスター内の各ネームスペースにポリシーを追加し、`hostPID` コンテナの受け入れを制限します。

### 5.2.4 ホストIPCネームスペースを共有しようとするコンテナの受け入れを最小限に抑える (自動化)

**結果:** 警告

**修正方法:**
ユーザーワークロードを含むクラスター内の各ネームスペースにポリシーを追加し、`hostIPC` コンテナの受け入れを制限します。

### 5.2.5 ホストネットワークネームスペースを共有しようとするコンテナの受け入れを最小限に抑える (自動化)

**結果:** 警告

**修正方法:**
ユーザーワークロードを含むクラスター内の各ネームスペースにポリシーを追加し、`hostNetwork` コンテナの受け入れを制限します。

### 5.2.6 allowPrivilegeEscalation を持つコンテナの受け入れを最小限に抑える (自動化)

**結果:** 警告

**修正方法:**
ユーザーワークロードを含むクラスター内の各ネームスペースにポリシーを追加し、`.spec.allowPrivilegeEscalation` が `true` に設定されているコンテナの受け入れを制限します。

### 5.2.7 ルートコンテナの受け入れを最小限に抑える (自動化)

**結果:** 警告

**修正方法:**
クラスター内の各ネームスペースにポリシーを作成し、`MustRunAsNonRoot` または UID の範囲に 0 を含まない `MustRunAs` が設定されていることを確認します。

### 5.2.8 NET_RAW 権限を持つコンテナの受け入れを最小限に抑える (自動化)

**結果:** 警告

**修正方法:**
ユーザーワークロードを含むクラスター内の各ネームスペースにポリシーを追加し、`NET_RAW` 権限を持つコンテナの受け入れを制限します。

### 5.2.9 追加の権限を持つコンテナの受け入れを最小限に抑える (自動化)

**結果:** 警告

**修正方法:**
`allowedCapabilities` が空の配列に設定されていない限り、クラスターのポリシーに `allowedCapabilities` が存在しないことを確認します。

### 5.2.10 割り当てられた権限を持つコンテナの受け入れを最小限に抑える (手動)

**結果:** 警告

**修正方法:**
クラスター上で実行されているアプリケーションの権限の使用を確認します。ネームスペースに Linux 権限を必要としないアプリケーションが含まれている場合、すべての権限を削除しないコンテナの受け入れを禁止する PSP を追加することを検討します。

### 5.2.11 Windows HostProcess コンテナの受け入れを最小限に抑える (手動)

**結果:** 警告

**修正方法:**
ユーザーワークロードを含むクラスター内の各ネームスペースにポリシーを追加し、`.securityContext.windowsOptions.hostProcess` が `true` に設定されているコンテナの受け入れを制限します。

### 5.2.12 HostPath ボリュームを使用するコンテナの受け入れを最小限に抑える (手動)

**結果:** 警告

**修正方法:**
ユーザーワークロードを含むクラスター内の各ネームスペースにポリシーを追加し、`hostPath` ボリュームを持つコンテナの受け入れを制限します。

### 5.2.13 HostPorts を使用するコンテナの受け入れを最小限に抑える (手動)

**結果:** 警告

**修正方法:**
ユーザーワークロードを含むクラスター内の各ネームスペースにポリシーを追加し、`hostPort` セクションを使用するコンテナの受け入れを制限します。

## 5.3 ネットワークポリシーと CNI

### 5.3.1 使用中の CNI がネットワークポリシーをサポートしていることを確認する (手動)

**結果:** 警告

**修正方法:**
使用中の CNI プラグインがネットワークポリシーをサポートしていない場合、別のプラグインを使用するか、Kubernetes クラスター内のトラフィックを制限するための代替メカニズムを見つけることを検討します。

### 5.3.2 すべてのネームスペースにネットワークポリシーが定義されていることを確認する (手動)

**結果:** 警告

**修正方法:**
ドキュメントに従い、必要に応じて NetworkPolicy オブジェクトを作成します。

## 5.4 シークレット管理

### 5.4.1 環境変数としてのシークレットよりもファイルとしてのシークレットを使用することを推奨する (手動)

**結果:** 警告

**修正方法:**
可能であれば、アプリケーションコードを再記述し、環境変数ではなくマウントされたシークレットファイルからシークレットを読み取るようにします。

### 5.4.2 外部シークレットストレージを検討する (手動)

**結果:** 警告

**修正方法:**
クラウドプロバイダーやサードパーティのシークレット管理ソリューションが提供するシークレット管理オプションを参照します。

## 5.5 拡張可能なアドミッションコントロール

### 5.5.1 ImagePolicyWebhook アドミッションコントローラーを使用してイメージの出所を設定する (手動)

**結果:** 警告

**修正方法:**
Kubernetes のドキュメントに従い、イメージの出所を設定します。

## 5.7 一般的なポリシー
### 5.7.1 リソース間に名前空間を使用して管理境界を作成する（手動）

**結果:** WARN

**修正方法:**
ドキュメントに従い、必要に応じてデプロイメント内のオブジェクトに対して名前空間を作成してください。

### 5.7.2 Pod定義においてseccompプロファイルがdocker/defaultに設定されていることを確認する（手動）

**結果:** WARN

**修正方法:**
`securityContext`を使用して、Pod定義にdocker/default seccompプロファイルを有効にしてください。
以下はその例です：
  securityContext:
    seccompProfile:
      type: RuntimeDefault

### 5.7.3 PodおよびコンテナにSecurityContextを適用する（手動）

**結果:** WARN

**修正方法:**
Kubernetesのドキュメントに従い、PodにSecurityContextを適用してください。推奨されるSecurityContextのリストについては、CIS Security Benchmark for Docker Containersを参照してください。

### 5.7.4 デフォルトの名前空間は使用しないこと（手動）

**結果:** WARN

**修正方法:**
Kubernetesリソースの適切な分離を可能にするために名前空間を作成し、すべての新しいリソースが特定の名前空間に作成されるようにしてください。