---
title: CIS 1.7 セルフアセスメントガイド
---

## 概要

このドキュメントは [K3s セキュリティ強化ガイド](hardening-guide.md) の補足資料です。強化ガイドは K3s の本番環境インストールを強化するための具体的なガイダンスを提供し、このベンチマークガイドは、CIS Kubernetes ベンチマークの各コントロールに対して強化されたクラスターのセキュリティレベルを評価するのに役立ちます。これは K3s オペレーター、セキュリティチーム、監査人、および意思決定者によって使用されることを意図しています。

このガイドは K3s の **v1.25-v1.26** リリースラインおよび CIS Kubernetes ベンチマークの **v1.7.1** リリースに特化しています。

各コントロールに関する詳細な説明やテスト失敗時の修正方法については、CIS Kubernetes ベンチマーク v1.7.1 の該当セクションを参照してください。ベンチマークは、無料アカウントを作成した後に [Center for Internet Security (CIS)](https://www.cisecurity.org/benchmark/kubernetes/) からダウンロードできます。

### コントロールテストの方法論

CIS Kubernetes ベンチマークの各コントロールは、付随する強化ガイドに従って設定された K3s クラスターに対して評価されました。

コントロール監査が元の CIS ベンチマークと異なる場合、K3s に特化した監査コマンドがテスト用に提供されます。

各コントロールの結果は以下の通りです：

- **合格** - テスト対象の K3s クラスターがベンチマークに記載された監査に合格しました。
- **該当なし** - コントロールは K3s の設計上適用されません。修正セクションでその理由を説明します。
- **警告** - コントロールは CIS ベンチマークで手動とされており、クラスターの使用ケースやその他の要因に依存します。これらのコントロールは K3s がその実装を妨げないことを確認するために評価されていますが、テスト対象のクラスターのさらなる設定や監査は行われていません。

このガイドは、K3s が Systemd ユニットとして実行されていることを前提としています。インストール方法が異なる場合は、シナリオに合わせて「監査」コマンドを調整する必要があります。

:::note

このガイドでは、`scored` テスト、つまり `自動化` テストのみを対象としています。
:::

## 1.1 コントロールプレーンノードの設定ファイル

### 1.1.1 API サーバーポッド仕様ファイルの権限が 600 以上の制限に設定されていることを確認する（自動化）

**結果:** 該当なし

**修正方法:**
コントロールプレーンノードで以下のコマンドを実行します（システム上のファイルの場所に基づく）。
例: chmod 600 /etc/kubernetes/manifests/kube-apiserver.yaml
該当なし。

### 1.1.2 API サーバーポッド仕様ファイルの所有者が root:root に設定されていることを確認する（自動化）

**結果:** 該当なし

**修正方法:**
コントロールプレーンノードで以下のコマンドを実行します（システム上のファイルの場所に基づく）。
例: chown root:root /etc/kubernetes/manifests/kube-apiserver.yaml
該当なし。

### 1.1.3 コントローラーマネージャーポッド仕様ファイルの権限が 600 以上の制限に設定されていることを確認する（自動化）

**結果:** 該当なし

**修正方法:**
コントロールプレーンノードで以下のコマンドを実行します（システム上のファイルの場所に基づく）。
例: chmod 600 /etc/kubernetes/manifests/kube-controller-manager.yaml
該当なし。

### 1.1.4 コントローラーマネージャーポッド仕様ファイルの所有者が root:root に設定されていることを確認する（自動化）

**結果:** 該当なし

**修正方法:**
コントロールプレーンノードで以下のコマンドを実行します（システム上のファイルの場所に基づく）。
例: chown root:root /etc/kubernetes/manifests/kube-controller-manager.yaml
該当なし。

### 1.1.5 スケジューラーポッド仕様ファイルの権限が 600 以上の制限に設定されていることを確認する（自動化）

**結果:** 該当なし

**修正方法:**
コントロールプレーンノードで以下のコマンドを実行します（システム上のファイルの場所に基づく）。
例: chmod 600 /etc/kubernetes/manifests/kube-scheduler.yaml
該当なし。

### 1.1.6 スケジューラーポッド仕様ファイルの所有者が root:root に設定されていることを確認する（自動化）

**結果:** 該当なし

**修正方法:**
コントロールプレーンノードで以下のコマンドを実行します（システム上のファイルの場所に基づく）。
例: chown root:root /etc/kubernetes/manifests/kube-scheduler.yaml
該当なし。

### 1.1.7 etcd ポッド仕様ファイルの権限が 600 以上の制限に設定されていることを確認する（自動化）

**結果:** 該当なし

**修正方法:**
コントロールプレーンノードで以下のコマンドを実行します（システム上のファイルの場所に基づく）。
例: chmod 600 /var/lib/rancher/k3s/server/db/etcd/config
該当なし。

### 1.1.8 etcd ポッド仕様ファイルの所有者が root:root に設定されていることを確認する（自動化）

**結果:** 該当なし

**修正方法:**
コントロールプレーンノードで以下のコマンドを実行します（システム上のファイルの場所に基づく）。
例: chown root:root /var/lib/rancher/k3s/server/db/etcd/config
該当なし。

### 1.1.9 コンテナネットワークインターフェイスファイルの権限が 600 以上の制限に設定されていることを確認する（自動化）

**結果:** 該当なし

**修正方法:**
コントロールプレーンノードで以下のコマンドを実行します（システム上のファイルの場所に基づく）。
例: chmod 600 &lt;path/to/cni/files&gt;
該当なし。

### 1.1.10 コンテナネットワークインターフェイスファイルの所有者が root:root に設定されていることを確認する（手動）

**結果:** 該当なし

**修正方法:**
コントロールプレーンノードで以下のコマンドを実行します（システム上のファイルの場所に基づく）。
例: chown root:root &lt;path/to/cni/files&gt;
該当なし。

### 1.1.11 etcd データディレクトリの権限が 700 以上の制限に設定されていることを確認する（自動化）

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

### 1.1.12 etcd データディレクトリの所有者が etcd:etcd に設定されていることを確認する（自動化）

**結果:** 該当なし

**修正方法:**
etcd サーバーノードで、コマンド 'ps -ef | grep etcd' から引数 --data-dir として渡される etcd データディレクトリを取得します。
上記で見つかった etcd データディレクトリに基づいて以下のコマンドを実行します。
例: chown etcd:etcd /var/lib/etcd
該当なし。

### 1.1.13 admin.conf ファイルの権限が 600 以上の制限に設定されていることを確認する（自動化）

**結果:** 該当なし

**修正方法:**
コントロールプレーンノードで以下のコマンドを実行します（システム上のファイルの場所に基づく）。
例: chmod 600 /var/lib/rancher/k3s/server/cred/admin.kubeconfig

### 1.1.14 admin.conf ファイルの所有者が root:root に設定されていることを確認する（自動化）

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

### 1.1.15 scheduler.conf ファイルの権限が 600 以上の制限に設定されていることを確認する（自動化）

**結果:** 合格

**監査:**
```bash
/bin/sh -c 'if test -e /var/lib/rancher/k3s/server/cred/scheduler.kubeconfig; then stat -c permissions=%a /var/lib/rancher/k3s/server/cred/scheduler.kubeconfig; fi'
```

**期待される結果:** permissions が 600 であり、600 以上の制限が期待される

<details>
<summary><b>返された値:</b></summary>

```console
permissions=600
```
</details>

### 1.1.16 scheduler.conf ファイルの所有者が root:root に設定されていることを確認する（自動化）

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

### 1.1.17 controller-manager.conf ファイルの権限が 600 以上の制限に設定されていることを確認する（自動化）

**結果:** 合格

**監査:**
```bash
/bin/sh -c 'if test -e /var/lib/rancher/k3s/server/cred/controller.kubeconfig; then stat -c permissions=%a /var/lib/rancher/k3s/server/cred/controller.kubeconfig; fi'
```

**期待される結果:** permissions が 600 であり、600 以上の制限が期待される

<details>
<summary><b>返された値:</b></summary>

```console
permissions=600
```
</details>

### 1.1.18 controller-manager.conf ファイルの所有者が root:root に設定されていることを確認する（自動化）

**結果:** 合格

**監査:**
```bash
stat -c %U:%G /var/lib/rancher/k3s/server/cred/controller.kubeconfig
```

**期待される結果:** 'root:root' が 'root:root' と等しい

<details>
<summary><b>返された値:</b></summary>

```console
root:root
```
</details>

### 1.1.19 Kubernetes PKI ディレクトリおよびファイルの所有者が root:root に設定されていることを確認する（自動化）

**結果:** 合格

**監査:**
```bash
stat -c %U:%G /var/lib/rancher/k3s/server/tls
```

**期待される結果:** 'root:root' が存在する

<details>
<summary><b>返された値:</b></summary>

```console
root:root
```
</details>

### 1.1.20 Kubernetes PKI 証明書ファイルの権限が 600 以上の制限に設定されていることを確認する（手動）

**結果:** 警告

**修正方法:**
コントロールプレーンノードで以下のコマンドを実行します（システム上のファイルの場所に基づく）。
例: chmod -R 600 /etc/kubernetes/pki/*.crt

### 1.1.21 Kubernetes PKI キーファイルの権限が 600 に設定されていることを確認する（手動）

**結果:** 警告

**修正方法:**
コントロールプレーンノードで以下のコマンドを実行します（システム上のファイルの場所に基づく）。
例: chmod -R 600 /etc/kubernetes/pki/*.key

## 1.2 API サーバー

### 1.2.1 --anonymous-auth 引数が false に設定されていることを確認する（手動）

**結果:** 合格

**監査:**
```bash
journalctl -D /var/log/journal  -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep 'anonymous-auth'
```

**期待される結果:** '--anonymous-auth' が 'false' と等しい

<details>
<summary><b>返された値:</b></summary>

```console
2024年5月15日 17:22:25 server-0 k3s[2317]: time="2024-05-15T17:22:25Z" level=info msg="Running kube-apiserver --admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-lookup=true --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

### 1.2.2 `--token-auth-file`パラメータが設定されていないことを確認する（自動化）

**結果:** 合格

**監査:**
```bash
/bin/ps -ef | grep containerd | grep -v grep
```

**期待される結果:** '--token-auth-file'が存在しない

<details>
<summary><b>返された値:</b></summary>

```console
root        2335    2317  0 17:22 ?        00:00:08 containerd 
root        3156       1  0 17:22 ?        00:00:00 /var/lib/rancher/k3s/data/19eadf174fb6dfb5a92b12cd3045d81e09a334ba9af3c2afa5382675f3f6c918/bin/containerd-shim-runc-v2 -namespace k8s.io -id 0eff118b8646895c6dc4bd530114d320ccef7d44c9ffe7e90bd79fb484244b84 -address /run/k3s/containerd/containerd.sock
root        3179       1  0 17:22 ?        00:00:00 /var/lib/rancher/k3s/data/19eadf174fb6dfb5a92b12cd3045d81e09a334ba9af3c2afa5382675f3f6c918/bin/containerd-shim-runc-v2 -namespace k8s.io -id ec6b2ac160de7aadf2c1b9e7e58c7413533f71764e58bf8ac79aef2c4c0bb914 -address /run/k3s/containerd/containerd.sock
root        3254       1  0 17:22 ?        00:00:00 /var/lib/rancher/k3s/data/19eadf174fb6dfb5a92b12cd3045d81e09a334ba9af3c2afa5382675f3f6c918/bin/containerd-shim-runc-v2 -namespace k8s.io -id 0499640f2232b224f1ff1ffba2a5787f1d31956d9ffa22e2b6f3b424f22afbbd -address /run/k3s/containerd/containerd.sock
root        4425       1  0 17:23 ?        00:00:00 /var/lib/rancher/k3s/data/19eadf174fb6dfb5a92b12cd3045d81e09a334ba9af3c2afa5382675f3f6c918/bin/containerd-shim-runc-v2 -namespace k8s.io -id 1fb515723128cd4294015fec56cb07c994ded503dcd8fd36b179dcb58f77a2be -address /run/k3s/containerd/containerd.sock
root        4512       1  0 17:23 ?        00:00:00 /var/lib/rancher/k3s/data/19eadf174fb6dfb5a92b12cd3045d81e09a334ba9af3c2afa5382675f3f6c918/bin/containerd-shim-runc-v2 -namespace k8s.io -id b39e79cf734d3c5d0f1f7e502c46a45d78668bdc07a2fdda5a100a6fd9c100db -address /run/k3s/containerd/containerd.sock
```
</details>

### 1.2.3 `--DenyServiceExternalIPs`が設定されていないことを確認する（自動化）

**結果:** 合格

**監査:**
```bash
/bin/ps -ef | grep containerd | grep -v grep
```

**期待される結果:** '--enable-admission-plugins'が存在するか、存在しない

<details>
<summary><b>返された値:</b></summary>

```console
root        2335    2317  0 17:22 ?        00:00:08 containerd 
root        3156       1  0 17:22 ?        00:00:00 /var/lib/rancher/k3s/data/19eadf174fb6dfb5a92b12cd3045d81e09a334ba9af3c2afa5382675f3f6c918/bin/containerd-shim-runc-v2 -namespace k8s.io -id 0eff118b8646895c6dc4bd530114d320ccef7d44c9ffe7e90bd79fb484244b84 -address /run/k3s/containerd/containerd.sock
root        3179       1  0 17:22 ?        00:00:00 /var/lib/rancher/k3s/data/19eadf174fb6dfb5a92b12cd3045d81e09a334ba9af3c2afa5382675f3f6c918/bin/containerd-shim-runc-v2 -namespace k8s.io -id ec6b2ac160de7aadf2c1b9e7e58c7413533f71764e58bf8ac79aef2c4c0bb914 -address /run/k3s/containerd/containerd.sock
root        3254       1  0 17:22 ?        00:00:00 /var/lib/rancher/k3s/data/19eadf174fb6dfb5a92b12cd3045d81e09a334ba9af3c2afa5382675f3f6c918/bin/containerd-shim-runc-v2 -namespace k8s.io -id 0499640f2232b224f1ff1ffba2a5787f1d31956d9ffa22e2b6f3b424f22afbbd -address /run/k3s/containerd/containerd.sock
root        4425       1  0 17:23 ?        00:00:00 /var/lib/rancher/k3s/data/19eadf174fb6dfb5a92b12cd3045d81e09a334ba9af3c2afa5382675f3f6c918/bin/containerd-shim-runc-v2 -namespace k8s.io -id 1fb515723128cd4294015fec56cb07c994ded503dcd8fd36b179dcb58f77a2be -address /run/k3s/containerd/containerd.sock
root        4512       1  0 17:23 ?        00:00:00 /var/lib/rancher/k3s/data/19eadf174fb6dfb5a92b12cd3045d81e09a334ba9af3c2afa5382675f3f6c918/bin/containerd-shim-runc-v2 -namespace k8s.io -id b39e79cf734d3c5d0f1f7e502c46a45d78668bdc07a2fdda5a100a6fd9c100db -address /run/k3s/containerd/containerd.sock
```
</details>

### 1.2.4 `--kubelet-client-certificate`および`--kubelet-client-key`引数が適切に設定されていることを確認する（自動化）

**結果:** 合格

**監査:**
```bash
journalctl -D /var/log/journal  -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep 'kubelet-certificate-authority'
```

**期待される結果:** '--kubelet-client-certificate'が存在し、'--kubelet-client-key'が存在する

<details>
<summary><b>返された値:</b></summary>

```console
2024年5月15日 17:22:25 server-0 k3s[2317]: time="2024-05-15T17:22:25Z" level=info msg="Running kube-apiserver --admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-lookup=true --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

### 1.2.5 `--kubelet-certificate-authority`引数が適切に設定されていることを確認する（自動化）

**結果:** 該当なし

**修正:**
Kubernetesのドキュメントに従い、apiserverとkubelet間のTLS接続を設定します。その後、コントロールプレーンノードのAPIサーバーポッド仕様ファイル
/etc/kubernetes/manifests/kube-apiserver.yamlを編集し、設定します。
```
--kubelet-certificate-authority パラメータを証明書認証局の証明書ファイルのパスに設定します。
--kubelet-certificate-authority=&lt;ca-string&gt;
許容 - サービング証明書を生成する際、特定のクラウドプロバイダーに必要なホスト名のオーバーライドと組み合わせると機能が壊れる可能性があります。

### 1.2.6 --authorization-mode 引数が AlwaysAllow に設定されていないことを確認する (自動化)

**結果:** 合格

**監査:**
```bash
journalctl -D /var/log/journal  -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep 'authorization-mode'
```

**期待される結果:** '--authorization-mode' に 'AlwaysAllow' が含まれていない

<details>
<summary><b>返された値:</b></summary>

```console
May 15 17:22:25 server-0 k3s[2317]: time="2024-05-15T17:22:25Z" level=info msg="Running kube-apiserver --admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-lookup=true --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

### 1.2.7 --authorization-mode 引数に Node が含まれていることを確認する (自動化)

**結果:** 合格

**監査:**
```bash
journalctl -D /var/log/journal  -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep 'authorization-mode'
```

**期待される結果:** '--authorization-mode' に 'Node' が含まれている

<details>
<summary><b>返された値:</b></summary>

```console
May 15 17:22:25 server-0 k3s[2317]: time="2024-05-15T17:22:25Z" level=info msg="Running kube-apiserver --admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-lookup=true --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

### 1.2.8 --authorization-mode 引数に RBAC が含まれていることを確認する (自動化)

**結果:** 合格

**監査:**
```bash
journalctl -D /var/log/journal  -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep 'authorization-mode'
```

**期待される結果:** '--authorization-mode' に 'RBAC' が含まれている

<details>
<summary><b>返された値:</b></summary>

```console
May 15 17:22:25 server-0 k3s[2317]: time="2024-05-15T17:22:25Z" level=info msg="Running kube-apiserver --admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-lookup=true --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

### 1.2.9 admission control プラグイン EventRateLimit が設定されていることを確認する (手動)

**結果:** 警告

**修正方法:**
Kubernetes のドキュメントに従い、設定ファイルに希望する制限を設定します。
次に、API サーバーのポッド仕様ファイル /etc/kubernetes/manifests/kube-apiserver.yaml を編集し、以下のパラメータを設定します。
--enable-admission-plugins=...,EventRateLimit,...
--admission-control-config-file=&lt;path/to/configuration/file&gt;
### 1.2.10 常に許可するアドミッションコントロールプラグインが設定されていないことを確認する (自動化)

**結果:** 合格

**監査:**
```bash
journalctl -D /var/log/journal  -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep 'enable-admission-plugins'
```

**期待される結果:** '--enable-admission-plugins' に 'AlwaysAdmit' が含まれていない、または '--enable-admission-plugins' が存在しない

<details>
<summary><b>返された値:</b></summary>

```console
May 15 17:22:25 server-0 k3s[2317]: time="2024-05-15T17:22:25Z" level=info msg="Running kube-apiserver --admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-lookup=true --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

### 1.2.11 常にイメージをプルするアドミッションコントロールプラグインが設定されていることを確認する (手動)

**結果:** 警告

**修正方法:**
コントロールプレーンノードの API サーバーポッド仕様ファイル /etc/kubernetes/manifests/kube-apiserver.yaml を編集し、--enable-admission-plugins パラメータに AlwaysPullImages を含めます。
--enable-admission-plugins=...,AlwaysPullImages,...

### 1.2.12 PodSecurityPolicy が使用されていない場合、SecurityContextDeny アドミッションコントロールプラグインが設定されていることを確認する (手動)

**結果:** 該当なし

**修正方法:**
コントロールプレーンノードの API サーバーポッド仕様ファイル /etc/kubernetes/manifests/kube-apiserver.yaml を編集し、--enable-admission-plugins パラメータに SecurityContextDeny を含めます。ただし、PodSecurityPolicy が既に存在する場合は除きます。
--enable-admission-plugins=...,SecurityContextDeny,...
許容 - Pod Security Policy を有効にすると、アプリケーションが予期せず失敗する可能性があります。

### 1.2.13 ServiceAccount アドミッションコントロールプラグインが設定されていることを確認する (自動化)

**結果:** 合格

**監査:**
```bash
journalctl -D /var/log/journal  -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep -v grep
```

**期待される結果:** '--disable-admission-plugins' が存在する、または '--disable-admission-plugins' が存在しない

<details>
<summary><b>返された値:</b></summary>

```console
May 15 17:22:25 server-0 k3s[2317]: time="2024-05-15T17:22:25Z" level=info msg="Running kube-apiserver --admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-lookup=true --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

### 1.2.14 NamespaceLifecycle アドミッションコントロールプラグインが設定されていることを確認する (自動化)

**結果:** 合格

**監査:**
```bash
journalctl -D /var/log/journal  -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep -v grep
```

**期待される結果:** '--disable-admission-plugins' が存在する、または '--disable-admission-plugins' が存在しない

<details>
<summary><b>返された値:</b></summary>

```console
2024年5月15日 17:22:25 server-0 k3s[2317]: time="2024-05-15T17:22:25Z" level=info msg="Running kube-apiserver --admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-lookup=true --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

### 1.2.15 ノード制限アドミッションコントロールプラグインが設定されていることを確認する (自動化)

**結果:** 合格

**監査:**
```bash
journalctl -D /var/log/journal  -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep 'enable-admission-plugins'
```

**期待される結果:** '--enable-admission-plugins' に 'NodeRestriction' が含まれている

<details>
<summary><b>返された値:</b></summary>

```console
2024年5月15日 17:22:25 server-0 k3s[2317]: time="2024-05-15T17:22:25Z" level=info msg="Running kube-apiserver --admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-lookup=true --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

### 1.2.16 --secure-port 引数が 0 に設定されていないことを確認する - この推奨事項は時代遅れであり、合意プロセスに従って削除されます (自動化)

**結果:** 合格

**監査:**
```bash
journalctl -D /var/log/journal  -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep 'secure-port'
```

**期待される結果:** '--secure-port' が 0 より大きいか、または '--secure-port' が存在しない

<details>
<summary><b>返された値:</b></summary>

```console
2024年5月15日 17:22:25 server-0 k3s[2317]: time="2024-05-15T17:22:25Z" level=info msg="Running kube-apiserver --admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-lookup=true --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

### 1.2.17 --profiling 引数が false に設定されていることを確認する (自動化)

**結果:** 合格

**監査:**
```bash
journalctl -D /var/log/journal  -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep 'profiling'
```

**期待される結果:** '--profiling' が 'false' に等しい

<details>
<summary><b>返された値:</b></summary>

```console
2024年5月15日 17:22:25 server-0 k3s[2317]: time="2024-05-15T17:22:25Z" level=info msg="Running kube-apiserver --admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-lookup=true --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

### 1.2.18 --audit-log-path 引数が設定されていることを確認する (自動化)

**結果:** 該当なし

**修正方法:**
コントロールプレーンノードの API サーバーポッド仕様ファイル /etc/kubernetes/manifests/kube-apiserver.yaml を編集し、--audit-log-path パラメータを適切なパスとファイルに設定します。例えば、
--audit-log-path=/var/log/apiserver/audit.log
許容。

### 1.2.19 --audit-log-maxage 引数が30または適切な値に設定されていることを確認する (自動化)

**結果:** 該当なし

**修正方法:**
コントロールプレーンノードの API サーバーポッド仕様ファイル /etc/kubernetes/manifests/kube-apiserver.yaml を編集し、--audit-log-maxage パラメータを30または適切な日数に設定します。例えば、
--audit-log-maxage=30
許容。

### 1.2.20 --audit-log-maxbackup 引数が10または適切な値に設定されていることを確認する (自動化)

**結果:** 該当なし

**修正方法:**
コントロールプレーンノードの API サーバーポッド仕様ファイル /etc/kubernetes/manifests/kube-apiserver.yaml を編集し、--audit-log-maxbackup パラメータを10または適切な値に設定します。例えば、
--audit-log-maxbackup=10
許容。

### 1.2.21 --audit-log-maxsize 引数が100または適切な値に設定されていることを確認する (自動化)

**結果:** 該当なし

**修正方法:**
コントロールプレーンノードの API サーバーポッド仕様ファイル /etc/kubernetes/manifests/kube-apiserver.yaml を編集し、--audit-log-maxsize パラメータを適切なサイズ（MB単位）に設定します。例えば、100 MBに設定するには、--audit-log-maxsize=100
許容。

### 1.2.22 --request-timeout 引数が適切に設定されていることを確認する (手動)

**結果:** 該当なし

**修正方法:**
API サーバーポッド仕様ファイル /etc/kubernetes/manifests/kube-apiserver.yaml を編集し、必要に応じて以下のパラメータを適切に設定します。例えば、--request-timeout=300s
許容。

### 1.2.23 --service-account-lookup 引数が true に設定されていることを確認する (自動化)

**結果:** 合格

**監査:**
```bash
journalctl -D /var/log/journal  -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep -v grep
```

**期待される結果:** '--service-account-lookup' が存在しないか、'--service-account-lookup' が 'true' に等しい

<details>
<summary><b>返された値:</b></summary>

```console
2024年5月15日 17:22:25 server-0 k3s[2317]: time="2024-05-15T17:22:25Z" level=info msg="Running kube-apiserver --admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-lookup=true --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

### 1.2.24 --service-account-key-file 引数が適切に設定されていることを確認する (自動化)

**結果:** 該当なし

**修正方法:**
コントロールプレーンノードの API サーバーポッド仕様ファイル /etc/kubernetes/manifests/kube-apiserver.yaml を編集し、--service-account-key-file パラメータをサービスアカウントの公開鍵ファイルに設定します。例えば、
--service-account-key-file=&lt;filename&gt;

### 1.2.25 --etcd-certfile および --etcd-keyfile 引数が適切に設定されていることを確認する (自動化)

**結果:** 合格

**監査:**
```bash
journalctl -D /var/log/journal -u k3s | grep 'Running kube-apiserver' | tail -n1
```

**期待される結果:** '--etcd-certfile' が存在し、'--etcd-keyfile' が存在する

<details>
<summary><b>返された値:</b></summary>

```console
2024年5月15日 17:22:25 server-0 k3s[2317]: time="2024-05-15T17:22:25Z" level=info msg="Running kube-apiserver --admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-lookup=true --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

### 1.2.26 --tls-cert-file および --tls-private-key-file 引数が適切に設定されていることを確認する (自動化)

**結果:** 合格

**監査:**
```bash
journalctl -D /var/log/journal -u k3s | grep -A1 'Running kube-apiserver' | tail -n2
```

**期待される結果:** '--tls-cert-file' が存在し、かつ '--tls-private-key-file' が存在する

<details>
<summary><b>返された値:</b></summary>

```console
2024年5月15日 17:22:25 server-0 k3s[2317]: time="2024-05-15T17:22:25Z" level=info msg="Running kube-apiserver --admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-lookup=true --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
2024年5月15日 17:22:25 server-0 k3s[2317]: time="2024-05-15T17:22:25Z" level=info msg="Running kube-scheduler --authentication-kubeconfig=/var/lib/rancher/k3s/server/cred/scheduler.kubeconfig --authorization-kubeconfig=/var/lib/rancher/k3s/server/cred/scheduler.kubeconfig --bind-address=127.0.0.1 --kubeconfig=/var/lib/rancher/k3s/server/cred/scheduler.kubeconfig --profiling=false --secure-port=10259"
```
</details>

### 1.2.27 --client-ca-file 引数が適切に設定されていることを確認する (自動化)

**結果:** 合格

**監査:**
```bash
journalctl -D /var/log/journal  -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep 'client-ca-file'
```

**期待される結果:** '--client-ca-file' が存在する

<details>
<summary><b>返された値:</b></summary>

```console
2024年5月15日 17:22:25 server-0 k3s[2317]: time="2024-05-15T17:22:25Z" level=info msg="Running kube-apiserver --admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-lookup=true --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

### 1.2.28 --etcd-cafile 引数が適切に設定されていることを確認する (自動化)

**結果:** 合格

**監査:**
```bash
journalctl -D /var/log/journal  -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep 'etcd-cafile'
```

**期待される結果:** '--etcd-cafile' が存在する

<details>
<summary><b>返された値:</b></summary>

```console
2024年5月15日 17:22:25 server-0 k3s[2317]: time="2024-05-15T17:22:25Z" level=info msg="Running kube-apiserver --admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-lookup=true --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

### 1.2.29 適切に --encryption-provider-config 引数が設定されていることを確認する (手動)

**結果:** 該当なし

**修正方法:**
Kubernetesのドキュメントに従い、EncryptionConfigファイルを設定します。
次に、コントロールプレーンノードのAPIサーバーポッド仕様ファイル /etc/kubernetes/manifests/kube-apiserver.yaml を編集し、--encryption-provider-config パラメータをそのファイルのパスに設定します。
例: --encryption-provider-config=&lt;/path/to/EncryptionConfig/File&gt;
許容 - 暗号化を有効にすると、データが暗号化されるため、データの復旧方法が変更されます。

### 1.2.30 適切に暗号化プロバイダーが設定されていることを確認する (手動)

**結果:** 該当なし

**修正方法:**
Kubernetesのドキュメントに従い、EncryptionConfigファイルを設定します。
このファイルで、暗号化プロバイダーとしてaescbc、kms、またはsecretboxを選択します。
許容 - 暗号化を有効にすると、データが暗号化されるため、データの復旧方法が変更されます。

### 1.2.32 APIサーバーが強力な暗号スイートのみを使用していることを確認する (手動)

**結果:** 合格

**監査:**
```bash
journalctl -D /var/log/journal  -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep 'tls-cipher-suites'
```

**期待される結果:** '--tls-cipher-suites' が 'TLS_AES_128_GCM_SHA256,TLS_AES_256_GCM_SHA384,TLS_CHACHA20_POLY1305_SHA256,TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA,TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256,TLS_ECDHE_RSA_WITH_3DES_EDE_CBC_SHA,TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256,TLS_RSA_WITH_3DES_EDE_CBC_SHA,TLS_RSA_WITH_AES_128_CBC_SHA,TLS_RSA_WITH_AES_128_GCM_SHA256,TLS_RSA_WITH_AES_256_CBC_SHA,TLS_RSA_WITH_AES_256_GCM_SHA384' の有効な要素を含む

<details>
<summary><b>返された値:</b></summary>

```console
2024年5月15日 17:22:25 server-0 k3s[2317]: time="2024-05-15T17:22:25Z" level=info msg="Running kube-apiserver --admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-lookup=true --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

## 1.3 コントローラーマネージャー

### 1.3.1 --terminated-pod-gc-threshold 引数が適切に設定されていることを確認する (手動)

**結果:** 合格

**監査:**
```bash
journalctl -D /var/log/journal  -u k3s | grep 'Running kube-controller-manager' | tail -n1 | grep 'terminated-pod-gc-threshold'
```

**期待される結果:** '--terminated-pod-gc-threshold' が存在する

<details>
<summary><b>返された値:</b></summary>

```console
2024年5月15日 17:22:25 server-0 k3s[2317]: time="2024-05-15T17:22:25Z" level=info msg="Running kube-controller-manager --allocate-node-cidrs=true --authentication-kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --authorization-kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --bind-address=127.0.0.1 --cluster-cidr=10.42.0.0/16 --cluster-signing-kube-apiserver-client-cert-file=/var/lib/rancher/k3s/server/tls/client-ca.nochain.crt --cluster-signing-kube-apiserver-client-key-file=/var/lib/rancher/k3s/server/tls/client-ca.key --cluster-signing-kubelet-client-cert-file=/var/lib/rancher/k3s/server/tls/client-ca.nochain.crt --cluster-signing-kubelet-client-key-file=/var/lib/rancher/k3s/server/tls/client-ca.key --cluster-signing-kubelet-serving-cert-file=/var/lib/rancher/k3s/server/tls/server-ca.nochain.crt --cluster-signing-kubelet-serving-key-file=/var/lib/rancher/k3s/server/tls/server-ca.key --cluster-signing-legacy-unknown-cert-file=/var/lib/rancher/k3s/server/tls/server-ca.nochain.crt --cluster-signing-legacy-unknown-key-file=/var/lib/rancher/k3s/server/tls/server-ca.key --configure-cloud-routes=false --controllers=*,tokencleaner,-service,-route,-cloud-node-lifecycle --kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --profiling=false --root-ca-file=/var/lib/rancher/k3s/server/tls/server-ca.crt --secure-port=10257 --service-account-private-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --terminated-pod-gc-threshold=10 --use-service-account-credentials=true"
```
</details>

### 1.3.2 --profiling 引数が false に設定されていることを確認する (自動)

**結果:** 合格

**監査:**
```bash
journalctl -D /var/log/journal  -u k3s | grep 'Running kube-controller-manager' | tail -n1 | grep 'profiling'
```

**期待される結果:** '--profiling' が 'false' に等しい

<details>
<summary><b>返された値:</b></summary>

```console
2024年5月15日 17:22:25 server-0 k3s[2317]: time="2024-05-15T17:22:25Z" level=info msg="Running kube-controller-manager --allocate-node-cidrs=true --authentication-kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --authorization-kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --bind-address=127.0.0.1 --cluster-cidr=10.42.0.0/16 --cluster-signing-kube-apiserver-client-cert-file=/var/lib/rancher/k3s/server/tls/client-ca.nochain.crt --cluster-signing-kube-apiserver-client-key-file=/var/lib/rancher/k3s/server/tls/client-ca.key --cluster-signing-kubelet-client-cert-file=/var/lib/rancher/k3s/server/tls/client-ca.nochain.crt --cluster-signing-kubelet-client-key-file=/var/lib/rancher/k3s/server/tls/client-ca.key --cluster-signing-kubelet-serving-cert-file=/var/lib/rancher/k3s/server/tls/server-ca.nochain.crt --cluster-signing-kubelet-serving-key-file=/var/lib/rancher/k3s/server/tls/server-ca.key --cluster-signing-legacy-unknown-cert-file=/var/lib/rancher/k3s/server/tls/server-ca.nochain.crt --cluster-signing-legacy-unknown-key-file=/var/lib/rancher/k3s/server/tls/server-ca.key --configure-cloud-routes=false --controllers=*,tokencleaner,-service,-route,-cloud-node-lifecycle --kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --profiling=false --root-ca-file=/var/lib/rancher/k3s/server/tls/server-ca.crt --secure-port=10257 --service-account-private-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --terminated-pod-gc-threshold=10 --use-service-account-credentials=true"
```
</details>

### 1.3.3 --use-service-account-credentials 引数が true に設定されていることを確認する (自動化)

**結果:** 合格

**監査:**
```bash
journalctl -D /var/log/journal  -u k3s | grep 'Running kube-controller-manager' | tail -n1 | grep 'use-service-account-credentials'
```

**期待される結果:** '--use-service-account-credentials' が 'false' ではない

<details>
<summary><b>返された値:</b></summary>

```console
2024年5月15日 17:22:25 server-0 k3s[2317]: time="2024-05-15T17:22:25Z" level=info msg="Running kube-controller-manager --allocate-node-cidrs=true --authentication-kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --authorization-kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --bind-address=127.0.0.1 --cluster-cidr=10.42.0.0/16 --cluster-signing-kube-apiserver-client-cert-file=/var/lib/rancher/k3s/server/tls/client-ca.nochain.crt --cluster-signing-kube-apiserver-client-key-file=/var/lib/rancher/k3s/server/tls/client-ca.key --cluster-signing-kubelet-client-cert-file=/var/lib/rancher/k3s/server/tls/client-ca.nochain.crt --cluster-signing-kubelet-client-key-file=/var/lib/rancher/k3s/server/tls/client-ca.key --cluster-signing-kubelet-serving-cert-file=/var/lib/rancher/k3s/server/tls/server-ca.nochain.crt --cluster-signing-kubelet-serving-key-file=/var/lib/rancher/k3s/server/tls/server-ca.key --cluster-signing-legacy-unknown-cert-file=/var/lib/rancher/k3s/server/tls/server-ca.nochain.crt --cluster-signing-legacy-unknown-key-file=/var/lib/rancher/k3s/server/tls/server-ca.key --configure-cloud-routes=false --controllers=*,tokencleaner,-service,-route,-cloud-node-lifecycle --kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --profiling=false --root-ca-file=/var/lib/rancher/k3s/server/tls/server-ca.crt --secure-port=10257 --service-account-private-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --terminated-pod-gc-threshold=10 --use-service-account-credentials=true"
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
2024年5月15日 17:22:25 server-0 k3s[2317]: time="2024-05-15T17:22:25Z" level=info msg="Running kube-controller-manager --allocate-node-cidrs=true --authentication-kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --authorization-kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --bind-address=127.0.0.1 --cluster-cidr=10.42.0.0/16 --cluster-signing-kube-apiserver-client-cert-file=/var/lib/rancher/k3s/server/tls/client-ca.nochain.crt --cluster-signing-kube-apiserver-client-key-file=/var/lib/rancher/k3s/server/tls/client-ca.key --cluster-signing-kubelet-client-cert-file=/var/lib/rancher/k3s/server/tls/client-ca.nochain.crt --cluster-signing-kubelet-client-key-file=/var/lib/rancher/k3s/server/tls/client-ca.key --cluster-signing-kubelet-serving-cert-file=/var/lib/rancher/k3s/server/tls/server-ca.nochain.crt --cluster-signing-kubelet-serving-key-file=/var/lib/rancher/k3s/server/tls/server-ca.key --cluster-signing-legacy-unknown-cert-file=/var/lib/rancher/k3s/server/tls/server-ca.nochain.crt --cluster-signing-legacy-unknown-key-file=/var/lib/rancher/k3s/server/tls/server-ca.key --configure-cloud-routes=false --controllers=*,tokencleaner,-service,-route,-cloud-node-lifecycle --kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --profiling=false --root-ca-file=/var/lib/rancher/k3s/server/tls/server-ca.crt --secure-port=10257 --service-account-private-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --terminated-pod-gc-threshold=10 --use-service-account-credentials=true"
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
2024年5月15日 17:22:25 server-0 k3s[2317]: time="2024-05-15T17:22:25Z" level=info msg="Running kube-controller-manager --allocate-node-cidrs=true --authentication-kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --authorization-kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --bind-address=127.0.0.1 --cluster-cidr=10.42.0.0/16 --cluster-signing-kube-apiserver-client-cert-file=/var/lib/rancher/k3s/server/tls/client-ca.nochain.crt --cluster-signing-kube-apiserver-client-key-file=/var/lib/rancher/k3s/server/tls/client-ca.key --cluster-signing-kubelet-client-cert-file=/var/lib/rancher/k3s/server/tls/client-ca.nochain.crt --cluster-signing-kubelet-client-key-file=/var/lib/rancher/k3s/server/tls/client-ca.key --cluster-signing-kubelet-serving-cert-file=/var/lib/rancher/k3s/server/tls/server-ca.nochain.crt --cluster-signing-kubelet-serving-key-file=/var/lib/rancher/k3s/server/tls/server-ca.key --cluster-signing-legacy-unknown-cert-file=/var/lib/rancher/k3s/server/tls/server-ca.nochain.crt --cluster-signing-legacy-unknown-key-file=/var/lib/rancher/k3s/server/tls/server-ca.key --configure-cloud-routes=false --controllers=*,tokencleaner,-service,-route,-cloud-node-lifecycle --kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --profiling=false --root-ca-file=/var/lib/rancher/k3s/server/tls/server-ca.crt --secure-port=10257 --service-account-private-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --terminated-pod-gc-threshold=10 --use-service-account-credentials=true"
```
</details>

### 1.3.6 RotateKubeletServerCertificate 引数が true に設定されていることを確認する (自動化)

**結果:** 該当なし

**修正方法:**
コントロールプレーンノードの Controller Manager ポッド仕様ファイル /etc/kubernetes/manifests/kube-controller-manager.yaml を編集し、--feature-gates パラメータに RotateKubeletServerCertificate=true を含めます。
--feature-gates=RotateKubeletServerCertificate=true
該当なし。

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
root        2335    2317  0 17:22 ?        00:00:08 containerd 
root        3156       1  0 17:22 ?        00:00:00 /var/lib/rancher/k3s/data/19eadf174fb6dfb5a92b12cd3045d81e09a334ba9af3c2afa5382675f3f6c918/bin/containerd-shim-runc-v2 -namespace k8s.io -id 0eff118b8646895c6dc4bd530114d320ccef7d44c9ffe7e90bd79fb484244b84 -address /run/k3s/containerd/containerd.sock
root        3179       1  0 17:22 ?        00:00:00 /var/lib/rancher/k3s/data/19eadf174fb6dfb5a92b12cd3045d81e09a334ba9af3c2afa5382675f3f6c918/bin/containerd-shim-runc-v2 -namespace k8s.io -id ec6b2ac160de7aadf2c1b9e7e58c7413533f71764e58bf8ac79aef2c4c0bb914 -address /run/k3s/containerd/containerd.sock
root        3254       1  0 17:22 ?        00:00:00 /var/lib/rancher/k3s/data/19eadf174fb6dfb5a92b12cd3045d81e09a334ba9af3c2afa5382675f3f6c918/bin/containerd-shim-runc-v2 -namespace k8s.io -id 0499640f2232b224f1ff1ffba2a5787f1d31956d9ffa22e2b6f3b424f22afbbd -address /run/k3s/containerd/containerd.sock
root        4425       1  0 17:23 ?        00:00:00 /var/lib/rancher/k3s/data/19eadf174fb6dfb5a92b12cd3045d81e09a334ba9af3c2afa5382675f3f6c918/bin/containerd-shim-runc-v2 -namespace k8s.io -id 1fb515723128cd4294015fec56cb07c994ded503dcd8fd36b179dcb58f77a2be -address /run/k3s/containerd/containerd.sock
root        4512       1  0 17:23 ?        00:00:00 /var/lib/rancher/k3s/data/19eadf174fb6dfb5a92b12cd3045d81e09a334ba9af3c2afa5382675f3f6c918/bin/containerd-shim-runc-v2 -namespace k8s.io -id b39e79cf734d3c5d0f1f7e502c46a45d78668bdc07a2fdda5a100a6fd9c100db -address /run/k3s/containerd/containerd.sock
```
</details>

## 1.4 スケジューラー

### 1.4.1 --profiling 引数が false に設定されていることを確認する (自動化)

**結果:** 合格

**監査:**
```bash
journalctl -D /var/log/journal -u k3s | grep 'Running kube-scheduler' | tail -n1
```

**期待される結果:** '--profiling' が 'false' である

<details>
<summary><b>返された値:</b></summary>

```console
May 15 17:22:25 server-0 k3s[2317]: time="2024-05-15T17:22:25Z" level=info msg="Running kube-scheduler --authentication-kubeconfig=/var/lib/rancher/k3s/server/cred/scheduler.kubeconfig --authorization-kubeconfig=/var/lib/rancher/k3s/server/cred/scheduler.kubeconfig --bind-address=127.0.0.1 --kubeconfig=/var/lib/rancher/k3s/server/cred/scheduler.kubeconfig --profiling=false --secure-port=10259"
```
</details>

### 1.4.2 --bind-address 引数が 127.0.0.1 に設定されていることを確認する (自動化)

**結果:** 合格

**監査:**
```bash
journalctl -D /var/log/journal  -u k3s | grep 'Running kube-scheduler' | tail -n1 | grep 'bind-address'
```

**期待される結果:** '--bind-address' が '127.0.0.1' に等しい、または '--bind-address' が存在しない

<details>
<summary><b>返された値:</b></summary>

```console
May 15 17:22:25 server-0 k3s[2317]: time="2024-05-15T17:22:25Z" level=info msg="Running kube-scheduler --authentication-kubeconfig=/var/lib/rancher/k3s/server/cred/scheduler.kubeconfig --authorization-kubeconfig=/var/lib/rancher/k3s/server/cred/scheduler.kubeconfig --bind-address=127.0.0.1 --kubeconfig=/var/lib/rancher/k3s/server/cred/scheduler.kubeconfig --profiling=false --secure-port=10259"
```
</details>

## 2 Etcd ノード構成

### 2.1 --cert-file および --key-file 引数が適切に設定されていることを確認する (自動化)

**結果:** 合格

**監査:**
```bash
grep -A 4 'client-transport-security' /var/lib/rancher/k3s/server/db/etcd/config | grep -E 'cert-file|key-file'
```

**期待される結果:** 'cert-file' が存在し、'key-file' が存在する

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

**期待される結果:** '--client-cert-auth' が存在する、または 'client-cert-auth' が 'true' に等しい

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

**期待される結果:** '--auto-tls' が存在しない、または '--auto-tls' が存在する

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

**期待される結果:** 'cert-file' が存在し、'key-file' が存在する

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

**期待される結果:** '--client-cert-auth' が存在する、または 'client-cert-auth' が 'true' に等しい

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

**期待される結果:** '--peer-auto-tls' が存在しない、または '--peer-auto-tls' が存在する

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

### 4.1.1 kubelet サービスファイルのパーミッションが 600 以上の制限に設定されていることを確認する (自動化)

**結果:** 該当なし

**修正:**
各ワーカーノードで以下のコマンドを実行します（システム上のファイルの場所に基づく）。
例: chmod 600 /etc/systemd/system/kubelet.service.d/10-kubeadm.conf
該当なし - すべての構成はコンテナ実行時の引数として渡されます。

### 4.1.2 kubelet サービスファイルの所有者が root:root に設定されていることを確認する (自動化)

**結果:** 該当なし

**修正:**
各ワーカーノードで以下のコマンドを実行します（システム上のファイルの場所に基づく）。
例:
chown root:root /etc/systemd/system/kubelet.service.d/10-kubeadm.conf
該当なし。
すべての構成はコンテナ実行時の引数として渡されます。

### 4.1.3 プロキシ kubeconfig ファイルが存在する場合、パーミッションが 600 以上の制限に設定されていることを確認する (手動)

**結果:** 警告

**修正:**
各ワーカーノードで以下のコマンドを実行します（システム上のファイルの場所に基づく）。
例:
chmod 600 /var/lib/rancher/k3s/agent/kubeproxy.kubeconfig

### 4.1.4 プロキシ kubeconfig ファイルが存在する場合、所有者が root:root に設定されていることを確認する (手動)

**結果:** 合格

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

### 4.1.5 --kubeconfig kubelet.conf ファイルのパーミッションが 600 以上の制限に設定されていることを確認する (自動化)

**結果:** 合格

**監査:**
```bash
/bin/sh -c 'if test -e /var/lib/rancher/k3s/server/cred/admin.kubeconfig; then stat -c permissions=%a /var/lib/rancher/k3s/server/cred/admin.kubeconfig; fi' 
```

**期待される結果:** パーミッションが 600 であり、600 以上の制限が期待される

<details>
<summary><b>返された値:</b></summary>

```console
permissions=600
```
</details>

### 4.1.6 --kubeconfig kubelet.conf ファイルの所有者が root:root に設定されていることを確認する (自動化)

**結果:** 合格

**監査:**
```bash
stat -c %U:%G /var/lib/rancher/k3s/agent/kubelet.kubeconfig
```

**期待される結果:** 'root:root' が存在する

<details>
<summary><b>返された値:</b></summary>

```console
root:root
```
</details>

### 4.1.7 証明書認証局ファイルのパーミッションが 600 以上の制限に設定されていることを確認する (手動)

**結果:** 警告

**修正:**
--client-ca-file のファイルパーミッションを変更するために以下のコマンドを実行します
chmod 600 &lt;filename&gt;

### 4.1.8 クライアント証明書認証局ファイルの所有者が root:root に設定されていることを確認する (手動)

**結果:** 合格

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

### 4.1.9 kubelet --config 構成ファイルのパーミッションが 600 以上の制限に設定されていることを確認する (自動化)

**結果:** 該当なし

**修正:**
監査ステップで特定された構成ファイルの場所を使用して以下のコマンドを実行します
chmod 600 /var/lib/kubelet/config.yaml

### 4.1.10 kubelet --config 構成ファイルの所有者が root:root に設定されていることを確認する (自動化)

**結果:** 該当なし

**修正:**
監査ステップで特定された構成ファイルの場所を使用して以下のコマンドを実行します
chown root:root /var/lib/kubelet/config.yaml
該当なし。
すべての構成はコンテナ実行時の引数として渡されます。

## 4.2 Kubelet

### 4.2.1 --anonymous-auth 引数が false に設定されていることを確認する (自動化)

**結果:** 合格

**監査:**
```bash
/bin/sh -c 'if test $(journalctl -D /var/log/journal -u k3s | grep "Running kube-apiserver" | wc -l) -gt 0; then journalctl -D /var/log/journal -u k3s | grep "Running kube-apiserver" | tail -n1 | grep "anonymous-auth" | grep -v grep; else echo "--anonymous-auth=false"; fi' 
```

**期待される結果:** '--anonymous-auth' が 'false' に等しい

<details>
<summary><b>返された値:</b></summary>

```console
2024年5月15日 17:22:25 server-0 k3s[2317]: time="2024-05-15T17:22:25Z" level=info msg="Running kube-apiserver --admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-lookup=true --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

### 4.2.2 --authorization-mode 引数が AlwaysAllow に設定されていないことを確認する (自動化)

**結果:** 合格

**監査:**
```bash
/bin/sh -c 'if test $(journalctl -D /var/log/journal -u k3s | grep "Running kube-apiserver" | wc -l) -gt 0; then journalctl -D /var/log/journal -u k3s | grep "Running kube-apiserver" | tail -n1 | grep "authorization-mode" | grep -v grep; else echo "--authorization-mode=Webhook"; fi' 
```

**期待される結果:** '--authorization-mode' に 'AlwaysAllow' が含まれていない

<details>
<summary><b>返された値:</b></summary>

```console
2024年5月15日 17:22:25 server-0 k3s[2317]: time="2024-05-15T17:22:25Z" level=info msg="Running kube-apiserver --admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-lookup=true --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

### 4.2.3 --client-ca-file 引数が適切に設定されていることを確認する (自動化)

**結果:** 合格

**監査:**
```bash
/bin/sh -c 'if test $(journalctl -D /var/log/journal -u k3s | grep "Running kube-apiserver" | wc -l) -gt 0; then journalctl -D /var/log/journal -u k3s | grep "Running kube-apiserver" | tail -n1 | grep "client-ca-file" | grep -v grep; else echo "--client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt"; fi' 
```

**期待される結果:** '--client-ca-file' が存在する

<details>
<summary><b>返された値:</b></summary>

```console
2024年5月15日 17:22:25 server-0 k3s[2317]: time="2024-05-15T17:22:25Z" level=info msg="Running kube-apiserver --admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-lookup=true --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

### 4.2.4 --read-only-port 引数が 0 に設定されていることを確認する (手動)

**結果:** 合格

**監査:**
```bash
journalctl -D /var/log/journal -u k3s | grep 'Running kubelet' | tail -n1 | grep 'read-only-port' 
```

**期待される結果:** '--read-only-port' が '0' に等しい、または '--read-only-port' が存在しない

<details>
<summary><b>返された値:</b></summary>

```console
2024年5月15日 17:22:27 server-0 k3s[2317]: time="2024-05-15T17:22:27Z" level=info msg="Running kubelet --address=0.0.0.0 --allowed-unsafe-sysctls=net.ipv4.ip_forward,net.ipv6.conf.all.forwarding --anonymous-auth=false --authentication-token-webhook=true --authorization-mode=Webhook --cgroup-driver=systemd --client-ca-file=/var/lib/rancher/k3s/agent/client-ca.crt --cloud-provider=external --cluster-dns=10.43.0.10 --cluster-domain=cluster.local --container-runtime-endpoint=unix:///run/k3s/containerd/containerd.sock --containerd=/run/k3s/containerd/containerd.sock --event-qps=0 --eviction-hard=imagefs.available<5%,nodefs.available<5% --eviction-minimum-reclaim=imagefs.available=10%,nodefs.available=10% --fail-swap-on=false --healthz-bind-address=127.0.0.1 --hostname-override=server-0 --kubeconfig=/var/lib/rancher/k3s/agent/kubelet.kubeconfig --make-iptables-util-chains=true --node-ip=10.10.10.100 --node-labels= --pod-infra-container-image=rancher/mirrored-pause:3.6 --pod-manifest-path=/var/lib/rancher/k3s/agent/pod-manifests --protect-kernel-defaults=true --read-only-port=0 --resolv-conf=/run/systemd/resolve/resolv.conf --serialize-image-pulls=false --streaming-connection-idle-timeout=5m --tls-cert-file=/var/lib/rancher/k3s/agent/serving-kubelet.crt --tls-private-key-file=/var/lib/rancher/k3s/agent/serving-kubelet.key"
```
</details>

### 4.2.5 `--streaming-connection-idle-timeout` 引数が 0 に設定されていないことを確認する (手動)

**結果:** 合格

**監査:**
```bash
journalctl -D /var/log/journal -u k3s | grep 'Running kubelet' | tail -n1 | grep 'streaming-connection-idle-timeout'
```

**期待される結果:** '--streaming-connection-idle-timeout' が '0' でない、または '--streaming-connection-idle-timeout' が存在しない

<details>
<summary><b>返された値:</b></summary>

```console
2024年5月15日 17:22:27 server-0 k3s[2317]: time="2024-05-15T17:22:27Z" level=info msg="Running kubelet --address=0.0.0.0 --allowed-unsafe-sysctls=net.ipv4.ip_forward,net.ipv6.conf.all.forwarding --anonymous-auth=false --authentication-token-webhook=true --authorization-mode=Webhook --cgroup-driver=systemd --client-ca-file=/var/lib/rancher/k3s/agent/client-ca.crt --cloud-provider=external --cluster-dns=10.43.0.10 --cluster-domain=cluster.local --container-runtime-endpoint=unix:///run/k3s/containerd/containerd.sock --containerd=/run/k3s/containerd/containerd.sock --event-qps=0 --eviction-hard=imagefs.available<5%,nodefs.available<5% --eviction-minimum-reclaim=imagefs.available=10%,nodefs.available=10% --fail-swap-on=false --healthz-bind-address=127.0.0.1 --hostname-override=server-0 --kubeconfig=/var/lib/rancher/k3s/agent/kubelet.kubeconfig --make-iptables-util-chains=true --node-ip=10.10.10.100 --node-labels= --pod-infra-container-image=rancher/mirrored-pause:3.6 --pod-manifest-path=/var/lib/rancher/k3s/agent/pod-manifests --protect-kernel-defaults=true --read-only-port=0 --resolv-conf=/run/systemd/resolve/resolv.conf --serialize-image-pulls=false --streaming-connection-idle-timeout=5m --tls-cert-file=/var/lib/rancher/k3s/agent/serving-kubelet.crt --tls-private-key-file=/var/lib/rancher/k3s/agent/serving-kubelet.key"
```
</details>

### 4.2.6 `--make-iptables-util-chains` 引数が true に設定されていることを確認する (自動化)

**結果:** 該当なし

**修正方法:**
Kubelet 設定ファイルを使用している場合は、ファイルを編集して `makeIPTablesUtilChains` を `true` に設定します。
コマンドライン引数を使用している場合は、各ワーカーノードの kubelet サービスファイル
/etc/systemd/system/kubelet.service.d/10-kubeadm.conf を編集し、
KUBELET_SYSTEM_PODS_ARGS 変数から --make-iptables-util-chains 引数を削除します。
システムに基づいて、kubelet サービスを再起動します。例えば:
systemctl daemon-reload
systemctl restart kubelet.service
許容。

### 4.2.7 `--hostname-override` 引数が設定されていないことを確認する (手動)

**結果:** 該当なし

**修正方法:**
各ワーカーノードの kubelet サービスファイル /etc/systemd/system/kubelet.service.d/10-kubeadm.conf を編集し、
KUBELET_SYSTEM_PODS_ARGS 変数から --hostname-override 引数を削除します。
システムに基づいて、kubelet サービスを再起動します。例えば、
systemctl daemon-reload
systemctl restart kubelet.service
該当なし。

### 4.2.8 eventRecordQPS 引数が適切なイベントキャプチャを確保するレベルに設定されていることを確認する (手動)

**結果:** 警告

**修正方法:**
Kubelet 設定ファイルを使用している場合は、ファイルを編集して `eventRecordQPS` を適切なレベルに設定します。
コマンドライン引数を使用している場合は、各ワーカーノードの kubelet サービスファイル
/etc/systemd/system/kubelet.service.d/10-kubeadm.conf を編集し、
KUBELET_SYSTEM_PODS_ARGS 変数に以下のパラメータを設定します。
システムに基づいて、kubelet サービスを再起動します。例えば、
systemctl daemon-reload
systemctl restart kubelet.service

### 4.2.9 `--tls-cert-file` および `--tls-private-key-file` 引数が適切に設定されていることを確認する (手動)

**結果:** 該当なし

**修正方法:**
Kubelet 設定ファイルを使用している場合は、ファイルを編集して `tlsCertFile` をこの Kubelet を識別するための証明書ファイルの場所に設定し、
`tlsPrivateKeyFile` を対応する秘密鍵ファイルの場所に設定します。
コマンドライン引数を使用している場合は、各ワーカーノードの kubelet サービスファイル
/etc/systemd/system/kubelet.service.d/10-kubeadm.conf を編集し、
KUBELET_CERTIFICATE_ARGS 変数に以下のパラメータを設定します。
--tls-cert-file=&lt;path/to/tls-certificate-file&gt;
--tls-private-key-file=&lt;path/to/tls-key-file&gt;
システムに基づいて、kubelet サービスを再起動します。例えば、
systemctl daemon-reload
systemctl restart kubelet.service
許容 - サービング証明書を生成する際、特定のクラウドプロバイダーに必要なホスト名オーバーライドと組み合わせて機能が壊れる可能性があります。

### 4.2.10 `--rotate-certificates` 引数が false に設定されていないことを確認する (手動)

**結果:** 警告

**修正方法:**
Kubelet 設定ファイルを使用している場合は、ファイルを編集して `rotateCertificates` を `true` に設定するか、
デフォルト値を使用するために削除します。
コマンドライン引数を使用している場合は、各ワーカーノードの kubelet サービスファイル
/etc/systemd/system/kubelet.service.d/10-kubeadm.conf を編集し、
KUBELET_CERTIFICATE_ARGS 変数から --rotate-certificates=false 引数を削除します。
システムに基づいて、kubelet サービスを再起動します。例えば、
systemctl daemon-reload
systemctl restart kubelet.service

### 4.2.11 RotateKubeletServerCertificate 引数が true に設定されていることを確認する (手動)

**結果:** 警告

**修正方法:**
各ワーカーノードの kubelet サービスファイル /etc/systemd/system/kubelet.service.d/10-kubeadm.conf を編集し、
KUBELET_CERTIFICATE_ARGS 変数に以下のパラメータを設定します。
--feature-gates=RotateKubeletServerCertificate=true
システムに基づいて、kubelet サービスを再起動します。例えば:
systemctl daemon-reload
systemctl restart kubelet.service
該当なし。

### 4.2.12 Kubelet が強力な暗号化スイートのみを使用していることを確認する (手動)

**結果:** 警告

**修正方法:**
Kubelet 設定ファイルを使用している場合は、ファイルを編集して `TLSCipherSuites` を
TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_AES_128_GCM_SHA256
またはこれらの値のサブセットに設定します。
実行可能な引数を使用している場合は、各ワーカーノードの kubelet サービスファイル
/etc/systemd/system/kubelet.service.d/10-kubeadm.conf を編集し、
--tls-cipher-suites パラメータを以下のように設定します。またはこれらの値のサブセットに設定します。
--tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_AES_128_GCM_SHA256
システムに基づいて、kubelet サービスを再起動します。例えば:
systemctl daemon-reload
systemctl restart kubelet.service

### 4.2.13 ポッドの PID に制限が設定されていることを確認する (手動)

**結果:** 警告

**修正方法:**
このパラメータの適切なレベルを決定し、
--pod-max-pids コマンドラインパラメータまたは PodPidsLimit 設定ファイル設定を使用して設定します。

## 5.1 RBAC とサービスアカウント

### 5.1.1 cluster-admin ロールが必要な場合にのみ使用されていることを確認する (手動)

**結果:** 警告

**修正方法:**
cluster-admin ロールへのすべての clusterrolebinding を特定します。それらが使用されているかどうか、
およびこのロールが必要かどうか、またはより少ない権限のロールを使用できるかどうかを確認します。
可能な場合は、最初にユーザーを低権限のロールにバインドし、その後 cluster-admin ロールへの
clusterrolebinding を削除します:
kubectl delete clusterrolebinding [name]

### 5.1.2 シークレットへのアクセスを最小限に抑える (手動)

**結果:** 警告

**修正方法:**
可能な場合は、クラスター内の Secret オブジェクトへの get、list、および watch アクセスを削除します。

### 5.1.3 ロールおよび ClusterRoles でのワイルドカードの使用を最小限に抑える (手動)

**結果:** 警告

**修正方法:**
可能な場合は、clusterroles および roles でのワイルドカードの使用を特定のオブジェクトまたはアクションに置き換えます。

### 5.1.4 ポッドの作成アクセスを最小限に抑える (手動)

**結果:** 警告

**修正方法:**
可能な場合は、クラスター内のポッドオブジェクトへの作成アクセスを削除します。

### 5.1.5 デフォルトのサービスアカウントが積極的に使用されていないことを確認する (手動)

**結果:** 該当なし

**修正方法:**
Kubernetes ワークロードが Kubernetes API サーバーへの特定のアクセスを必要とする場合は、明示的なサービスアカウントを作成します。
各デフォルトのサービスアカウントの設定を変更して、この値を含めます
automountServiceAccountToken: false
許容 - Kubernetes はデフォルトのサービスアカウントを提供します。

### 5.1.6 サービスアカウントトークンが必要な場合にのみマウントされることを確認する (手動)

**結果:** 警告

**修正方法:**
サービスアカウントトークンをマウントする必要がないポッドおよびサービスアカウントの定義を変更して無効にします。

### 5.1.7 system:masters グループの使用を避ける (手動)

**結果:** 警告

**修正方法:**
クラスター内のすべてのユーザーから system:masters グループを削除します。

### 5.1.8 Kubernetes クラスター内での Bind、Impersonate、および Escalate 権限の使用を制限する (手動)
```
**結果:** WARN

**修正方法:**
可能な限り、サブジェクトから偽装、バインド、およびエスカレート権限を削除します。

### 5.1.9 永続ボリュームの作成アクセスを最小限に抑える（手動）

**結果:** WARN

**修正方法:**
可能な限り、クラスター内のPersistentVolumeオブジェクトへの作成アクセスを削除します。

### 5.1.10 ノードのプロキシサブリソースへのアクセスを最小限に抑える（手動）

**結果:** WARN

**修正方法:**
可能な限り、ノードオブジェクトのプロキシサブリソースへのアクセスを削除します。

### 5.1.11 証明書署名要求オブジェクトの承認サブリソースへのアクセスを最小限に抑える（手動）

**結果:** WARN

**修正方法:**
可能な限り、証明書署名要求オブジェクトの承認サブリソースへのアクセスを削除します。

### 5.1.12 Webhook構成オブジェクトへのアクセスを最小限に抑える（手動）

**結果:** WARN

**修正方法:**
可能な限り、validatingwebhookconfigurationsまたはmutatingwebhookconfigurationsオブジェクトへのアクセスを削除します。

### 5.1.13 サービスアカウントトークンの作成アクセスを最小限に抑える（手動）

**結果:** WARN

**修正方法:**
可能な限り、serviceaccountオブジェクトのトークンサブリソースへのアクセスを削除します。

## 5.2 ポッドセキュリティ基準

### 5.2.1 クラスターに少なくとも1つのアクティブなポリシー制御メカニズムが存在することを確認する（手動）

**結果:** WARN

**修正方法:**
Pod Security Admissionまたは外部ポリシー制御システムが、ユーザーのワークロードを含むすべてのネームスペースに存在することを確認します。

### 5.2.2 特権コンテナの受け入れを最小限に抑える（手動）

**結果:** WARN

**修正方法:**
クラスター内のユーザーワークロードを持つ各ネームスペースにポリシーを追加し、特権コンテナの受け入れを制限します。

### 5.2.3 ホストプロセスIDネームスペースを共有するコンテナの受け入れを最小限に抑える（自動）

**結果:** 該当なし

**修正方法:**
クラスター内のユーザーワークロードを持つ各ネームスペースにポリシーを追加し、`hostPID`コンテナの受け入れを制限します。
許容 - Pod Security Policyを有効にすると、アプリケーションが予期せず失敗する可能性があります。

### 5.2.4 ホストIPCネームスペースを共有するコンテナの受け入れを最小限に抑える（自動）

**結果:** 該当なし

**修正方法:**
クラスター内のユーザーワークロードを持つ各ネームスペースにポリシーを追加し、`hostIPC`コンテナの受け入れを制限します。
許容 - Pod Security Policyを有効にすると、アプリケーションが予期せず失敗する可能性があります。

### 5.2.5 ホストネットワークネームスペースを共有するコンテナの受け入れを最小限に抑える（自動）

**結果:** 該当なし

**修正方法:**
クラスター内のユーザーワークロードを持つ各ネームスペースにポリシーを追加し、`hostNetwork`コンテナの受け入れを制限します。
許容 - Pod Security Policyを有効にすると、アプリケーションが予期せず失敗する可能性があります。

### 5.2.6 allowPrivilegeEscalationを持つコンテナの受け入れを最小限に抑える（自動）

**結果:** WARN

**修正方法:**
クラスター内のユーザーワークロードを持つ各ネームスペースにポリシーを追加し、`.spec.allowPrivilegeEscalation`が`true`に設定されているコンテナの受け入れを制限します。

### 5.2.7 ルートコンテナの受け入れを最小限に抑える（自動）

**結果:** WARN

**修正方法:**
クラスター内の各ネームスペースにポリシーを作成し、`MustRunAsNonRoot`またはUIDの範囲に0を含まない`MustRunAs`が設定されていることを確認します。

### 5.2.8 NET_RAW機能を持つコンテナの受け入れを最小限に抑える（自動）

**結果:** WARN

**修正方法:**
クラスター内のユーザーワークロードを持つ各ネームスペースにポリシーを追加し、`NET_RAW`機能を持つコンテナの受け入れを制限します。

### 5.2.9 追加機能を持つコンテナの受け入れを最小限に抑える（自動）

**結果:** WARN

**修正方法:**
`allowedCapabilities`が空の配列に設定されていない限り、クラスターのポリシーに`allowedCapabilities`が存在しないことを確認します。

### 5.2.10 機能が割り当てられたコンテナの受け入れを最小限に抑える（手動）

**結果:** WARN

**修正方法:**
クラスターで実行されているアプリケーションの機能の使用を確認します。ネームスペースにLinux機能を必要としないアプリケーションが含まれている場合、すべての機能を削除しないコンテナの受け入れを禁止するPSPを追加することを検討します。

### 5.2.11 Windows HostProcessコンテナの受け入れを最小限に抑える（手動）

**結果:** WARN

**修正方法:**
クラスター内のユーザーワークロードを持つ各ネームスペースにポリシーを追加し、`.securityContext.windowsOptions.hostProcess`が`true`に設定されているコンテナの受け入れを制限します。

### 5.2.12 HostPathボリュームの受け入れを最小限に抑える（手動）

**結果:** WARN

**修正方法:**
クラスター内のユーザーワークロードを持つ各ネームスペースにポリシーを追加し、`hostPath`ボリュームを持つコンテナの受け入れを制限します。

### 5.2.13 HostPortsを使用するコンテナの受け入れを最小限に抑える（手動）

**結果:** WARN

**修正方法:**
クラスター内のユーザーワークロードを持つ各ネームスペースにポリシーを追加し、`hostPort`セクションを使用するコンテナの受け入れを制限します。

## 5.3 ネットワークポリシーとCNI

### 5.3.1 使用中のCNIがネットワークポリシーをサポートしていることを確認する（手動）

**結果:** WARN

**修正方法:**
使用中のCNIプラグインがネットワークポリシーをサポートしていない場合、別のプラグインを使用するか、Kubernetesクラスター内のトラフィックを制限するための代替メカニズムを検討します。

### 5.3.2 すべてのネームスペースにネットワークポリシーが定義されていることを確認する（手動）

**結果:** 該当なし

**修正方法:**
ドキュメントに従い、必要に応じてNetworkPolicyオブジェクトを作成します。
許容 - ネットワークポリシーを有効にすると、特定のアプリケーションが互いに通信できなくなる可能性があります。

## 5.4 シークレット管理

### 5.4.1 環境変数としてのシークレットよりもファイルとしてのシークレットを使用することを推奨（手動）

**結果:** WARN

**修正方法:**
可能であれば、アプリケーションコードを再記述し、環境変数ではなくマウントされたシークレットファイルからシークレットを読み取るようにします。

### 5.4.2 外部シークレットストレージを検討する（手動）

**結果:** WARN

**修正方法:**
クラウドプロバイダーやサードパーティのシークレット管理ソリューションが提供するシークレット管理オプションを参照します。

## 5.5 拡張可能なアドミッションコントロール

### 5.5.1 ImagePolicyWebhookアドミッションコントローラーを使用してイメージの出所を設定する（手動）

**結果:** WARN

**修正方法:**
Kubernetesのドキュメントに従い、イメージの出所を設定します。

## 5.7 一般的なポリシー

### 5.7.1 ネームスペースを使用してリソース間に管理境界を作成する（手動）

**結果:** WARN

**修正方法:**
ドキュメントに従い、必要に応じてデプロイメント内のオブジェクトのためにネームスペースを作成します。

### 5.7.2 Pod定義でseccompプロファイルがdocker/defaultに設定されていることを確認する（手動）

**結果:** WARN

**修正方法:**
`securityContext`を使用して、Pod定義でdocker/default seccompプロファイルを有効にします。以下はその例です：
  securityContext:
    seccompProfile:
      type: RuntimeDefault

### 5.7.3 PodおよびコンテナにSecurityContextを適用する（手動）

**結果:** WARN

**修正方法:**
Kubernetesのドキュメントに従い、PodにSecurityContextを適用します。推奨されるSecurityContextのリストについては、CIS Security Benchmark for Docker Containersを参照してください。

### 5.7.4 デフォルトのネームスペースは使用しない（手動）

**結果:** 該当なし

**修正方法:**
Kubernetesリソースの適切な分離を可能にするためにネームスペースを作成し、すべての新しいリソースが特定のネームスペースに作成されることを確認します。
許容 - Kubernetesはデフォルトのネームスペースを提供します。