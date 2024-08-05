---
title: CIS 1.8 セルフアセスメントガイド
---

## 概要

このドキュメントは[K3sセキュリティ強化ガイド](hardening-guide.md)の補足資料です。強化ガイドはK3sの本番インストールを強化するための具体的なガイダンスを提供し、このベンチマークガイドはCIS Kubernetesベンチマークの各コントロールに対して強化されたクラスターのセキュリティレベルを評価するのに役立ちます。K3sのオペレーター、セキュリティチーム、監査人、意思決定者が使用することを目的としています。

このガイドはK3sの**v1.27-v1.29**リリースラインおよびCIS Kubernetesベンチマークの**v1.8**リリースに特化しています。

各コントロールの詳細な説明やテスト失敗時の修正方法については、CIS Kubernetesベンチマークv1.8の該当セクションを参照してください。ベンチマークは、無料アカウントを作成後に[Center for Internet Security (CIS)](https://www.cisecurity.org/benchmark/kubernetes/)からダウンロードできます。

### コントロールテストの方法論

CIS Kubernetesベンチマークの各コントロールは、付随する強化ガイドに従って設定されたK3sクラスターに対して評価されました。

コントロール監査が元のCISベンチマークと異なる場合、K3sに特化した監査コマンドがテスト用に提供されています。

各コントロールの結果は以下の通りです：

- **合格** - テスト対象のK3sクラスターがベンチマークに記載された監査に合格しました。
- **該当なし** - コントロールはK3sの設計上適用されません。修正セクションでその理由を説明します。
- **警告** - コントロールはCISベンチマークで手動とされており、クラスターの使用ケースやその他の要因に依存します。これらのコントロールはK3sがその実装を妨げないことを確認するために評価されていますが、テスト対象のクラスターのさらなる設定や監査は行われていません。

このガイドは、K3sがSystemdユニットとして実行されていることを前提としています。インストール方法が異なる場合は、「監査」コマンドをシナリオに合わせて調整する必要があります。

:::note

このガイドでは、`scored`テスト、つまり`自動化`テストのみを対象としています。
:::

## 1.1 コントロールプレーンノードの設定ファイル

### 1.1.1 APIサーバーポッド仕様ファイルの権限が600以上の制限に設定されていることを確認する（自動化）

**結果:** 該当なし

**修正方法:**
コントロールプレーンノードで以下のコマンドを実行します（システム上のファイルの場所に基づく）。
例: chmod 600 /etc/kubernetes/manifests/kube-apiserver.yaml
該当なし。

### 1.1.2 APIサーバーポッド仕様ファイルの所有者がroot:rootに設定されていることを確認する（自動化）

**結果:** 該当なし

**修正方法:**
コントロールプレーンノードで以下のコマンドを実行します（システム上のファイルの場所に基づく）。
例: chown root:root /etc/kubernetes/manifests/kube-apiserver.yaml
該当なし。

### 1.1.3 コントローラーマネージャーポッド仕様ファイルの権限が600以上の制限に設定されていることを確認する（自動化）

**結果:** 該当なし

**修正方法:**
コントロールプレーンノードで以下のコマンドを実行します（システム上のファイルの場所に基づく）。
例: chmod 600 /etc/kubernetes/manifests/kube-controller-manager.yaml
該当なし。

### 1.1.4 コントローラーマネージャーポッド仕様ファイルの所有者がroot:rootに設定されていることを確認する（自動化）

**結果:** 該当なし

**修正方法:**
コントロールプレーンノードで以下のコマンドを実行します（システム上のファイルの場所に基づく）。
例: chown root:root /etc/kubernetes/manifests/kube-controller-manager.yaml
該当なし。

### 1.1.5 スケジューラーポッド仕様ファイルの権限が600以上の制限に設定されていることを確認する（自動化）

**結果:** 該当なし

**修正方法:**
コントロールプレーンノードで以下のコマンドを実行します（システム上のファイルの場所に基づく）。
例: chmod 600 /etc/kubernetes/manifests/kube-scheduler.yaml
該当なし。

### 1.1.6 スケジューラーポッド仕様ファイルの所有者がroot:rootに設定されていることを確認する（自動化）

**結果:** 該当なし

**修正方法:**
コントロールプレーンノードで以下のコマンドを実行します（システム上のファイルの場所に基づく）。
例: chown root:root /etc/kubernetes/manifests/kube-scheduler.yaml
該当なし。

### 1.1.7 etcdポッド仕様ファイルの権限が600以上の制限に設定されていることを確認する（自動化）

**結果:** 該当なし

**修正方法:**
コントロールプレーンノードで以下のコマンドを実行します（システム上のファイルの場所に基づく）。
例: chmod 600 /etc/kubernetes/manifests/etcd.yaml
該当なし。

### 1.1.8 etcdポッド仕様ファイルの所有者がroot:rootに設定されていることを確認する（自動化）

**結果:** 該当なし

**修正方法:**
コントロールプレーンノードで以下のコマンドを実行します（システム上のファイルの場所に基づく）。
例: chown root:root /etc/kubernetes/manifests/etcd.yaml
該当なし。

### 1.1.9 コンテナネットワークインターフェイスファイルの権限が600以上の制限に設定されていることを確認する（自動化）

**結果:** 該当なし

**修正方法:**
コントロールプレーンノードで以下のコマンドを実行します（システム上のファイルの場所に基づく）。
例: chmod 600 &lt;path/to/cni/files&gt;
該当なし。

### 1.1.10 コンテナネットワークインターフェイスファイルの所有者がroot:rootに設定されていることを確認する（手動）

**結果:** 該当なし

**修正方法:**
コントロールプレーンノードで以下のコマンドを実行します（システム上のファイルの場所に基づく）。
例: chown root:root &lt;path/to/cni/files&gt;
該当なし。

### 1.1.11 etcdデータディレクトリの権限が700以上の制限に設定されていることを確認する（自動化）

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
etcdサーバーノードで、コマンド 'ps -ef | grep etcd' から引数 --data-dir として渡されるetcdデータディレクトリを取得します。
上記で見つかったetcdデータディレクトリに基づいて以下のコマンドを実行します。
例: chown etcd:etcd /var/lib/etcd
該当なし。

### 1.1.13 admin.confファイルの権限が600以上の制限に設定されていることを確認する（自動化）

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

### 1.1.15 scheduler.confファイルの権限が600以上の制限に設定されていることを確認する（自動化）

**結果:** 合格

**監査:**
```bash
/bin/sh -c 'if test -e /var/lib/rancher/k3s/server/cred/scheduler.kubeconfig; then stat -c permissions=%a /var/lib/rancher/k3s/server/cred/scheduler.kubeconfig; fi'
```

**期待される結果:** permissionsが600であり、600以上の制限が期待される

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

### 1.1.17 controller-manager.confファイルの権限が600以上の制限に設定されていることを確認する（自動化）

**結果:** 合格

**監査:**
```bash
/bin/sh -c 'if test -e /var/lib/rancher/k3s/server/cred/controller.kubeconfig; then stat -c permissions=%a /var/lib/rancher/k3s/server/cred/controller.kubeconfig; fi'
```

**期待される結果:** permissionsが600であり、600以上の制限が期待される

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
stat -c %U:%G /var/lib/rancher/k3s/server/cred/controller.kubeconfig
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
stat -c %U:%G /var/lib/rancher/k3s/server/tls
```

**期待される結果:** 'root:root' が存在する

<details>
<summary><b>返された値:</b></summary>

```console
root:root
```
</details>

### 1.1.20 Kubernetes PKI証明書ファイルの権限が600以上の制限に設定されていることを確認する（手動）

**結果:** 警告

**修正方法:**
マスターノードで以下のコマンドを実行します（システム上のファイルの場所に基づく）。
例: find /var/lib/rancher/k3s/server/tls/ -type f -name '*.crt' -exec chmod -v 600 {} +

### 1.1.21 Kubernetes PKIキーのファイル権限が600に設定されていることを確認する（手動）

**結果:** 合格

**監査:**
```bash
find /var/lib/rancher/k3s/server/tls/ -type f -name '*.key' | xargs stat -c permissions=%a
```

**期待される結果:** permissionsが600であり、600以上の制限が期待される

<details>
<summary><b>返された値:</b></summary>

```console
permissions=600
permissions=600
permissions=600
permissions=600
permissions=600
permissions=600
permissions=600
permissions=600
permissions=600
permissions=600
permissions=600
permissions=600
permissions=600
permissions=600
permissions=600
permissions=600
permissions=600
permissions=600
permissions=600
permissions=600
permissions=600
permissions=600
permissions=600
```
</details>

## 1.2 APIサーバー


### 1.2.1 --anonymous-auth 引数が false に設定されていることを確認する（手動）

**結果:** 合格

**監査:**
```bash
journalctl -D /var/log/journal  -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep 'anonymous-auth'
```

**期待される結果:** '--anonymous-auth' が 'false' に等しい

<details>
<summary><b>返された値:</b></summary>

```console
Apr 22 20:12:19 server-0 k3s[2397]: time="2024-04-22T20:12:19Z" level=info msg="Running kube-apiserver --admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --encryption-provider-config-automatic-reload=true --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-lookup=true --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

### 1.2.2 --token-auth-file パラメータが設定されていないことを確認する（自動）

**結果:** 合格

**監査:**
```bash
/bin/ps -ef | grep containerd | grep -v grep
```

**期待される結果:** '--token-auth-file' が存在しない

<details>
<summary><b>返された値:</b></summary>

```console
root        2415    2397  0 Apr22 ?        00:06:36 containerd 
root        3162       1  0 Apr22 ?        00:00:30 /var/lib/rancher/k3s/data/124f36823e5696ab11a8a042537e1edbc6d69919dc7579be22caccc18ccc083f/bin/containerd-shim-runc-v2 -namespace k8s.io -id d540dd74296e1dc069f7c25dc9e76690d9afb22b404cd87c7f6217889da7aa7e -address /run/k3s/containerd/containerd.sock
root        3215       1  0 Apr22 ?        00:00:29 /var/lib/rancher/k3s/data/124f36823e5696ab11a8a042537e1edbc6d69919dc7579be22caccc18ccc083f/bin/containerd-shim-runc-v2 -namespace k8s.io -id 551b739eb5a7f61465027aaf2848954a29639e8ddf4f78a89fc9f881eb6b1378 -address /run/k3s/containerd/containerd.sock
root        3318       1  0 Apr22 ?        00:00:31 /var/lib/rancher/k3s/data/124f36823e5696ab11a8a042537e1edbc6d69919dc7579be22caccc18ccc083f/bin/containerd-shim-runc-v2 -namespace k8s.io -id dbf0b3aadcbf40fd7dc27f340051fc58979d46c2174963967ae01170c7d88f2d -address /run/k3s/containerd/containerd.sock
root        4135       1  0 Apr22 ?        00:00:41 /var/lib/rancher/k3s/data/124f36823e5696ab11a8a042537e1edbc6d69919dc7579be22caccc18ccc083f/bin/containerd-shim-runc-v2 -namespace k8s.io -id 21e58656877367076224111e51be5d30e8d316dbcb8c05a36a8432eda2d16ccb -address /run/k3s/containerd/containerd.sock
root        4300       1  0 Apr22 ?        00:00:30 /var/lib/rancher/k3s/data/124f36823e5696ab11a8a042537e1edbc6d69919dc7579be22caccc18ccc083f/bin/containerd-shim-runc-v2 -namespace k8s.io -id c1db1ac0969a14f1addcc0295ec09fa9fa4c55edac1acc4701ac18326dcb8a51 -address /run/k3s/containerd/containerd.sock
```
</details>

### 1.2.3 --DenyServiceExternalIPs が設定されていないことを確認する（自動）

**結果:** 合格

**監査:**
```bash
/bin/ps -ef | grep containerd | grep -v grep
```

**期待される結果:** '--enable-admission-plugins' が存在するか、存在しない

<details>
<summary><b>返された値:</b></summary>

```console
root        2415    2397  0 Apr22 ?        00:06:36 containerd 
root        3162       1  0 Apr22 ?        00:00:30 /var/lib/rancher/k3s/data/124f36823e5696ab11a8a042537e1edbc6d69919dc7579be22caccc18ccc083f/bin/containerd-shim-runc-v2 -namespace k8s.io -id d540dd74296e1dc069f7c25dc9e76690d9afb22b404cd87c7f6217889da7aa7e -address /run/k3s/containerd/containerd.sock
root        3215       1  0 Apr22 ?        00:00:29 /var/lib/rancher/k3s/data/124f36823e5696ab11a8a042537e1edbc6d69919dc7579be22caccc18ccc083f/bin/containerd-shim-runc-v2 -namespace k8s.io -id 551b739eb5a7f61465027aaf2848954a29639e8ddf4f78a89fc9f881eb6b1378 -address /run/k3s/containerd/containerd.sock
root        3318       1  0 Apr22 ?        00:00:31 /var/lib/rancher/k3s/data/124f36823e5696ab11a8a042537e1edbc6d69919dc7579be22caccc18ccc083f/bin/containerd-shim-runc-v2 -namespace k8s.io -id dbf0b3aadcbf40fd7dc27f340051fc58979d46c2174963967ae01170c7d88f2d -address /run/k3s/containerd/containerd.sock
root        4135       1  0 Apr22 ?        00:00:41 /var/lib/rancher/k3s/data/124f36823e5696ab11a8a042537e1edbc6d69919dc7579be22caccc18ccc083f/bin/containerd-shim-runc-v2 -namespace k8s.io -id 21e58656877367076224111e51be5d30e8d316dbcb8c05a36a8432eda2d16ccb -address /run/k3s/containerd/containerd.sock
root        4300       1  0 Apr22 ?        00:00:30 /var/lib/rancher/k3s/data/124f36823e5696ab11a8a042537e1edbc6d69919dc7579be22caccc18ccc083f/bin/containerd-shim-runc-v2 -namespace k8s.io -id c1db1ac0969a14f1addcc0295ec09fa9fa4c55edac1acc4701ac18326dcb8a51 -address /run/k3s/containerd/containerd.sock
```
</details>

### 1.2.4 --kubelet-client-certificate および --kubelet-client-key 引数が適切に設定されていることを確認する（自動）

**結果:** 合格

**監査:**
```bash
journalctl -D /var/log/journal  -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep 'kubelet-certificate-authority'
```

**期待される結果:** '--kubelet-client-certificate' が存在し、かつ '--kubelet-client-key' が存在する

<details>
<summary><b>返された値:</b></summary>

```console
2024-04-22 20:12:19 server-0 k3s[2397]: time="2024-04-22T20:12:19Z" level=info msg="Running kube-apiserver --admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --encryption-provider-config-automatic-reload=true --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-lookup=true --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

### 1.2.5 --kubelet-certificate-authority 引数が適切に設定されていることを確認する（自動化）

**結果:** 該当なし

**修正方法:**
Kubernetesのドキュメントに従って、apiserverとkubelet間のTLS接続を設定してください。その後、コントロールプレーンノード上のAPIサーバーポッド仕様ファイル
/etc/kubernetes/manifests/kube-apiserver.yamlを編集し、
--kubelet-certificate-authorityパラメータを認証局の証明書ファイルへのパスに設定してください。
--kubelet-certificate-authority=&lt;ca-string&gt;
寛容 - 提供証明書を生成する際、特定のクラウドプロバイダーに必要なホスト名の上書きと併せて機能が破損する可能性があります。

### 1.2.6 --authorization-mode 引数が AlwaysAllow に設定されていないことを確認する（自動化）

**結果:** 合格

**監査:**
```bash
journalctl -D /var/log/journal  -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep 'authorization-mode'
```

**期待される結果:** '--authorization-mode' に 'AlwaysAllow' が含まれていない

<details>
<summary><b>返された値:</b></summary>

```console
2024-04-22 20:12:19 server-0 k3s[2397]: time="2024-04-22T20:12:19Z" level=info msg="Running kube-apiserver --admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --encryption-provider-config-automatic-reload=true --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-lookup=true --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

### 1.2.7 --authorization-mode 引数に Node が含まれていることを確認する（自動化）

**結果:** 合格

**監査:**
```bash
journalctl -D /var/log/journal  -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep 'authorization-mode'
```

**期待される結果:** '--authorization-mode' に 'Node' が含まれている

<details>
<summary><b>返された値:</b></summary>

```console
2024-04-22 20:12:19 server-0 k3s[2397]: time="2024-04-22T20:12:19Z" level=info msg="Running kube-apiserver --admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --encryption-provider-config-automatic-reload=true --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-lookup=true --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

### 1.2.8 --authorization-mode 引数に RBAC が含まれていることを確認する（自動化）

**結果:** 合格

**監査:**
```bash
journalctl -D /var/log/journal  -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep 'authorization-mode'
```

**期待される結果:** '--authorization-mode' に 'RBAC' が設定されている

<details>
<summary><b>返された値:</b></summary>

```console
Apr 22 20:12:19 server-0 k3s[2397]: time="2024-04-22T20:12:19Z" level=info msg="Running kube-apiserver --admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --encryption-provider-config-automatic-reload=true --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-lookup=true --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

### 1.2.9 入場制御プラグイン EventRateLimit が設定されていることを確認する (手動)

**結果:** WARN

**修正方法:**
Kubernetes のドキュメントに従い、設定ファイルに希望する制限を設定します。
次に、API サーバーのポッド仕様ファイル /etc/kubernetes/manifests/kube-apiserver.yaml を編集し、以下のパラメーターを設定します。
--enable-admission-plugins=...,EventRateLimit,...
--admission-control-config-file=&lt;path/to/configuration/file&gt;

### 1.2.10 入場制御プラグイン AlwaysAdmit が設定されていないことを確認する (自動)

**結果:** PASS

**監査:**
```bash
journalctl -D /var/log/journal  -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep 'enable-admission-plugins'
```

**期待される結果:** '--enable-admission-plugins' に 'AlwaysAdmit' が含まれていない、または '--enable-admission-plugins' が存在しない

<details>
<summary><b>返された値:</b></summary>

```console
Apr 22 20:12:19 server-0 k3s[2397]: time="2024-04-22T20:12:19Z" level=info msg="Running kube-apiserver --admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --encryption-provider-config-automatic-reload=true --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-lookup=true --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

### 1.2.11 入場制御プラグイン AlwaysPullImages が設定されていることを確認する (手動)

**結果:** WARN

**修正方法:**
コントロールプレーンノードの API サーバーポッド仕様ファイル /etc/kubernetes/manifests/kube-apiserver.yaml を編集し、--enable-admission-plugins パラメーターに AlwaysPullImages を含めるように設定します。
--enable-admission-plugins=...,AlwaysPullImages,...

### 1.2.12 PodSecurityPolicy が使用されていない場合、入場制御プラグイン SecurityContextDeny が設定されていることを確認する (手動)

**結果:** 該当なし

**修正方法:**
コントロールプレーンノードの API サーバーポッド仕様ファイル /etc/kubernetes/manifests/kube-apiserver.yaml を編集し、--enable-admission-plugins パラメーターに SecurityContextDeny を含めるように設定します。ただし、PodSecurityPolicy が既に存在する場合は除きます。
--enable-admission-plugins=...,SecurityContextDeny,...
許容 - Pod Security Policy を有効にすると、アプリケーションが予期せず失敗する可能性があります。

### 1.2.13 入場制御プラグイン ServiceAccount が設定されていることを確認する (自動)

**結果:** PASS

**監査:**
```bash
journalctl -D /var/log/journal  -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep -v grep
```

**期待される結果:** '--disable-admission-plugins' が存在する、または '--disable-admission-plugins' が存在しない

<details>
<summary><b>返された値:</b></summary>

```console
Apr 22 20:12:19 server-0 k3s[2397]: time="2024-04-22T20:12:19Z" level=info msg="Running kube-apiserver --admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --encryption-provider-config-automatic-reload=true --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-lookup=true --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

### 1.2.14 NamespaceLifecycleアドミッションコントロールプラグインが設定されていることを確認する (自動化)

**結果:** 合格

**監査:**
```bash
journalctl -D /var/log/journal  -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep -v grep
```

**期待される結果:** '--disable-admission-plugins'が存在するか、'--disable-admission-plugins'が存在しない

<details>
<summary><b>返された値:</b></summary>

```console
Apr 22 20:12:19 server-0 k3s[2397]: time="2024-04-22T20:12:19Z" level=info msg="Running kube-apiserver --admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --encryption-provider-config-automatic-reload=true --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-lookup=true --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

### 1.2.15 NodeRestrictionアドミッションコントロールプラグインが設定されていることを確認する (自動化)

**結果:** 合格

**監査:**
```bash
journalctl -D /var/log/journal  -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep 'enable-admission-plugins'
```

**期待される結果:** '--enable-admission-plugins'に'NodeRestriction'が含まれている

<details>
<summary><b>返された値:</b></summary>

```console
Apr 22 20:12:19 server-0 k3s[2397]: time="2024-04-22T20:12:19Z" level=info msg="Running kube-apiserver --admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --encryption-provider-config-automatic-reload=true --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-lookup=true --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

### 1.2.16 --profiling引数がfalseに設定されていることを確認する (自動化)

**結果:** 合格

**監査:**
```bash
journalctl -D /var/log/journal  -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep 'profiling'
```

**期待される結果:** '--profiling'が'false'に設定されている

<details>
<summary><b>返された値:</b></summary>

```console
Apr 22 20:12:19 server-0 k3s[2397]: time="2024-04-22T20:12:19Z" level=info msg="Running kube-apiserver --admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --encryption-provider-config-automatic-reload=true --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-lookup=true --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

### 1.2.17 Ensure that the --audit-log-path argument is set (Automated)

**Result:** Not Applicable

**Remediation:**
APIサーバーポッド仕様ファイル /etc/kubernetes/manifests/kube-apiserver.yaml を編集し、--audit-log-path パラメータを適切なパスとファイルに設定します。例えば、
--audit-log-path=/var/log/apiserver/audit.log
許容。

### 1.2.18 Ensure that the --audit-log-maxage argument is set to 30 or as appropriate (Automated)

**Result:** Not Applicable

**Remediation:**
APIサーバーポッド仕様ファイル /etc/kubernetes/manifests/kube-apiserver.yaml を編集し、--audit-log-maxage パラメータを30または適切な日数に設定します。例えば、
--audit-log-maxage=30
許容。

### 1.2.19 Ensure that the --audit-log-maxbackup argument is set to 10 or as appropriate (Automated)

**Result:** Not Applicable

**Remediation:**
APIサーバーポッド仕様ファイル /etc/kubernetes/manifests/kube-apiserver.yaml を編集し、--audit-log-maxbackup パラメータを10または適切な値に設定します。例えば、
--audit-log-maxbackup=10
許容。

### 1.2.20 Ensure that the --audit-log-maxsize argument is set to 100 or as appropriate (Automated)

**Result:** Not Applicable

**Remediation:**
APIサーバーポッド仕様ファイル /etc/kubernetes/manifests/kube-apiserver.yaml を編集し、--audit-log-maxsize パラメータを適切なサイズ（MB単位）に設定します。例えば、100 MBに設定するには、--audit-log-maxsize=100
許容。

### 1.2.21 Ensure that the --request-timeout argument is set as appropriate (Manual)

**Result:** Not Applicable

**Remediation:**
APIサーバーポッド仕様ファイル /etc/kubernetes/manifests/kube-apiserver.yaml を編集し、必要に応じて以下のパラメータを適切に設定します。例えば、--request-timeout=300s
許容。

### 1.2.22 Ensure that the --service-account-lookup argument is set to true (Automated)

**Result:** PASS

**Audit:**
```bash
journalctl -D /var/log/journal  -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep -v grep
```

**Expected Result:** '--service-account-lookup' が存在しないか、'--service-account-lookup' が 'true' に等しい

<details>
<summary><b>Returned Value:</b></summary>

```console
Apr 22 20:12:19 server-0 k3s[2397]: time="2024-04-22T20:12:19Z" level=info msg="Running kube-apiserver --admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --encryption-provider-config-automatic-reload=true --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-lookup=true --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

### 1.2.23 --service-account-key-file 引数が適切に設定されていることを確認する(自動化)

**結果:** 該当なし

**Remediation:**
APIサーバーポッド仕様ファイル /etc/kubernetes/manifests/kube-apiserver.yaml を編集し、--service-account-key-file パラメータをサービスアカウントの公開鍵ファイルに設定します。例えば、
--service-account-key-file=&lt;filename&gt;

### 1.2.24 --etcd-certfileと--etcd-keyfile引数が適切に設定されていることを確認する(自動化)

**結果:** 合格

**監査:**
```bash
journalctl -D /var/log/journal -u k3s | grep 'Running kube-apiserver' | tail -n1
```

**期待される結果:** '--etcd-certfile' が存在し、'--etcd-keyfile' が存在する

<details>
<summary><b>返された値:</b></summary>

```
Apr 22 20:12:19 server-0 k3s[2397]: time="2024-04-22T20:12:19Z" level=info msg="Running kube-apiserver


--admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --encryption-provider-config-automatic-reload=true --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-lookup=true --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

### 1.2.25 --tls-cert-fileと--tls-private-key-file引数が適切に設定されていることを確認する（自動化）

**結果:** 合格

**監査:**
```bash
journalctl -D /var/log/journal -u k3s | grep -A1 'Running kube-apiserver' | tail -n2
```

**期待される結果:** '--tls-cert-file'が存在し、かつ'--tls-private-key-file'が存在する

<details>
<summary><b>返された値:</b></summary>

```console
Apr 22 20:12:19 server-0 k3s[2397]: time="2024-04-22T20:12:19Z" level=info msg="Running kube-apiserver --admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --encryption-provider-config-automatic-reload=true --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-lookup=true --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
Apr 22 20:12:19 server-0 k3s[2397]: time="2024-04-22T20:12:19Z" level=info msg="Running kube-scheduler --authentication-kubeconfig=/var/lib/rancher/k3s/server/cred/scheduler.kubeconfig --authorization-kubeconfig=/var/lib/rancher/k3s/server/cred/scheduler.kubeconfig --bind-address=127.0.0.1 --kubeconfig=/var/lib/rancher/k3s/server/cred/scheduler.kubeconfig --profiling=false --secure-port=10259"
```
</details>

### 1.2.26 --client-ca-file 引数が適切に設定されていることを確認する（自動化）

**結果:** 合格

**監査:**
```bash
journalctl -D /var/log/journal  -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep 'client-ca-file'
```

**期待される結果:** '--client-ca-file' が存在する

<details>
<summary><b>返された値:</b></summary>

```console
Apr 22 20:12:19 server-0 k3s[2397]: time="2024-04-22T20:12:19Z" level=info msg="Running kube-apiserver --admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --encryption-provider-config-automatic-reload=true --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-lookup=true --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

### 1.2.27 --etcd-cafile 引数が適切に設定されていることを確認する（自動化）

**結果:** 合格

**監査:**
```bash
journalctl -D /var/log/journal  -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep 'etcd-cafile'
```

**期待される結果:** '--etcd-cafile' が存在すること

<details>
<summary><b>返された値:</b></summary>

```console
Apr 22 20:12:19 server-0 k3s[2397]: time="2024-04-22T20:12:19Z" level=info msg="Running kube-apiserver --admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --encryption-provider-config-automatic-reload=true --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-lookup=true --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

### 1.2.28 --encryption-provider-config 引数が適切に設定されていることを確認する（手動）

**結果:** 適用外

**修正方法:**
Kubernetes のドキュメントに従って EncryptionConfig ファイルを設定してください。
その後、コントロールプレーンノード上の API サーバーポッド仕様ファイル /etc/kubernetes/manifests/kube-apiserver.yaml を編集し、
--encryption-provider-config パラメータをそのファイルのパスに設定してください。
例: --encryption-provider-config=&lt;/path/to/EncryptionConfig/File&gt;
許容 - 暗号化を有効にすると、データが暗号化されるためデータの復旧方法が変更されます。

### 1.2.29 暗号化プロバイダーが適切に設定されていることを確認する（手動）

**結果:** 適用外

**修正方法:**
Kubernetes のドキュメントに従って EncryptionConfig ファイルを設定してください。
このファイルで、aescbc、kms、または secretbox を暗号化プロバイダーとして選択してください。
許容 - 暗号化を有効にすると、データが暗号化されるためデータの復旧方法が変更されます。

### 1.2.30 API サーバーが強力な暗号化暗号スイートのみを使用していることを確認する（手動）

**結果:** 合格

**監査:**
```bash
journalctl -D /var/log/journal  -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep 'tls-cipher-suites'
```

**期待される結果:** '--tls-cipher-suites' に 'TLS_AES_128_GCM_SHA256,TLS_AES_256_GCM_SHA384,TLS_CHACHA20_POLY1305_SHA256,TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA,TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256,TLS_ECDHE_RSA_WITH_3DES_EDE_CBC_SHA,TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256,TLS_RSA_WITH_3DES_EDE_CBC_SHA,TLS_RSA_WITH_AES_128_CBC_SHA,TLS_RSA_WITH_AES_128_GCM_SHA256,TLS_RSA_WITH_AES_256_CBC_SHA,TLS_RSA_WITH_AES_256_GCM_SHA384' からの有効な要素が含まれています

<details>
<summary><b>返された値:</b></summary>

```console
Apr 22 20:12:19 server-0 k3s[2397]: time="2024-04-22T20:12:19Z" level=info msg="Running kube-apiserver --admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --encryption-provider-config-automatic-reload=true --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-lookup=true --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
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
Apr 22 20:12:19 server-0 k3s[2397]: time="2024-04-22T20:12:19Z" level=info msg="Running kube-controller-manager --allocate-node-cidrs=true --authentication-kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --authorization-kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --bind-address=127.0.0.1 --cluster-cidr=10.42.0.0/16 --cluster-signing-kube-apiserver-client-cert-file=/var/lib/rancher/k3s/server/tls/client-ca.nochain.crt --cluster-signing-kube-apiserver-client-key-file=/var/lib/rancher/k3s/server/tls/client-ca.key --cluster-signing-kubelet-client-cert-file=/var/lib/rancher/k3s/server/tls/client-ca.nochain.crt --cluster-signing-kubelet-client-key-file=/var/lib/rancher/k3s/server/tls/client-ca.key --cluster-signing-kubelet-serving-cert-file=/var/lib/rancher/k3s/server/tls/server-ca.nochain.crt --cluster-signing-kubelet-serving-key-file=/var/lib/rancher/k3s/server/tls/server-ca.key --cluster-signing-legacy-unknown-cert-file=/var/lib/rancher/k3s/server/tls/server-ca.nochain.crt --cluster-signing-legacy-unknown-key-file=/var/lib/rancher/k3s/server/tls/server-ca.key --configure-cloud-routes=false --controllers=*,tokencleaner,-service,-route,-cloud-node-lifecycle --kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --profiling=false --root-ca-file=/var/lib/rancher/k3s/server/tls/server-ca.crt --secure-port=10257 --service-account-private-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --terminated-pod-gc-threshold=10 --use-service-account-credentials=true"
```
</details>

### 1.3.2 --profiling 引数が false に設定されていることを確認する (自動)

**結果:** 合格

**監査:**
```bash
journalctl -D /var/log/journal  -u k3s | grep 'Running kube-controller-manager' | tail -n1 | grep 'profiling'
```

**期待される結果:** '--profiling' が 'false' である

<details>
<summary><b>返された値:</b></summary>

```console
Apr 22 20:12:19 server-0 k3s[2397]: time="2024-04-22T20:12:19Z" level=info msg="Running kube-controller-manager --allocate-node-cidrs=true --authentication-kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --authorization-kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --bind-address=127.0.0.1 --cluster-cidr=10.42.0.0/16 --cluster-signing-kube-apiserver-client-cert-file=/var/lib/rancher/k3s/server/tls/client-ca.nochain.crt --cluster-signing-kube-apiserver-client-key-file=/var/lib/rancher/k3s/server/tls/client-ca.key --cluster-signing-kubelet-client-cert-file=/var/lib/rancher/k3s/server/tls/client-ca.nochain.crt --cluster-signing-kubelet-client-key-file=/var/lib/rancher/k3s/server/tls/client-ca.key --cluster-signing-kubelet-serving-cert-file=/var/lib/rancher/k3s/server/tls/server-ca.nochain.crt --cluster-signing-kubelet-serving-key-file=/var/lib/rancher/k3s/server/tls/server-ca.key --cluster-signing-legacy-unknown-cert-file=/var/lib/rancher/k3s/server/tls/server-ca.nochain.crt --cluster-signing-legacy-unknown-key-file=/var/lib/rancher/k3s/server/tls/server-ca.key --configure-cloud-routes=false --controllers=*,tokencleaner,-service,-route,-cloud-node-lifecycle --kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --profiling=false --root-ca-file=/var/lib/rancher/k3s/server/tls/server-ca.crt --secure-port=10257 --service-account-private-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --terminated-pod-gc-threshold=10 --use-service-account-credentials=true"
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
Apr 22 20:12:19 server-0 k3s[2397]: time="2024-04-22T20:12:19Z" level=info msg="Running kube-controller-manager --allocate-node-cidrs=true --authentication-kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --authorization-kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --bind-address=127.0.0.1 --cluster-cidr=10.42.0.0/16 --cluster-signing-kube-apiserver-client-cert-file=/var/lib/rancher/k3s/server/tls/client-ca.nochain.crt --cluster-signing-kube-apiserver-client-key-file=/var/lib/rancher/k3s/server/tls/client-ca.key --cluster-signing-kubelet-client-cert-file=/var/lib/rancher/k3s/server/tls/client-ca.nochain.crt --cluster-signing-kubelet-client-key-file=/var/lib/rancher/k3s/server/tls/client-ca.key --cluster-signing-kubelet-serving-cert-file=/var/lib/rancher/k3s/server/tls/server-ca.nochain.crt --cluster-signing-kubelet-serving-key-file=/var/lib/rancher/k3s/server/tls/server-ca.key --cluster-signing-legacy-unknown-cert-file=/var/lib/rancher/k3s/server/tls/server-ca.nochain.crt --cluster-signing-legacy-unknown-key-file=/var/lib/rancher/k3s/server/tls/server-ca.key --configure-cloud-routes=false --controllers=*,tokencleaner,-service,-route,-cloud-node-lifecycle --kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --profiling=false --root-ca-file=/var/lib/rancher/k3s/server/tls/server-ca.crt --secure-port=10257 --service-account-private-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --terminated-pod-gc-threshold=10 --use-service-account-credentials=true"
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
Apr 22 20:12:19 server-0 k3s[2397]: time="2024-04-22T20:12:19Z" level=info msg="Running kube-controller-manager --allocate-node-cidrs=true --authentication-kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --authorization-kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --bind-address=127.0.0.1 --cluster-cidr=10.42.0.0/16 --cluster-signing-kube-apiserver-client-cert-file=/var/lib/rancher/k3s/server/tls/client-ca.nochain.crt --cluster-signing-kube-apiserver-client-key-file=/var/lib/rancher/k3s/server/tls/client-ca.key --cluster-signing-kubelet-client-cert-file=/var/lib/rancher/k3s/server/tls/client-ca.nochain.crt --cluster-signing-kubelet-client-key-file=/var/lib/rancher/k3s/server/tls/client-ca.key --cluster-signing-kubelet-serving-cert-file=/var/lib/rancher/k3s/server/tls/server-ca.nochain.crt --cluster-signing-kubelet-serving-key-file=/var/lib/rancher/k3s/server/tls/server-ca.key --cluster-signing-legacy-unknown-cert-file=/var/lib/rancher/k3s/server/tls/server-ca.nochain.crt --cluster-signing-legacy-unknown-key-file=/var/lib/rancher/k3s/server/tls/server-ca.key --configure-cloud-routes=false --controllers=*,tokencleaner,-service,-route,-cloud-node-lifecycle --kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --profiling=false --root-ca-file=/var/lib/rancher/k3s/server/tls/server-ca.crt --secure-port=10257 --service-account-private-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --terminated-pod-gc-threshold=10 --use-service-account-credentials=true"
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
Apr 22 20:12:19 server-0 k3s[2397]: time="2024-04-22T20:12:19Z" level=info msg="Running kube-controller-manager --allocate-node-cidrs=true --authentication-kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --authorization-kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --bind-address=127.0.0.1 --cluster-cidr=10.42.0.0/16 --cluster-signing-kube-apiserver-client-cert-file=/var/lib/rancher/k3s/server/tls/client-ca.nochain.crt --cluster-signing-kube-apiserver-client-key-file=/var/lib/rancher/k3s/server/tls/client-ca.key --cluster-signing-kubelet-client-cert-file=/var/lib/rancher/k3s/server/tls/client-ca.nochain.crt --cluster-signing-kubelet-client-key-file=/var/lib/rancher/k3s/server/tls/client-ca.key --cluster-signing-kubelet-serving-cert-file=/var/lib/rancher/k3s/server/tls/server-ca.nochain.crt --cluster-signing-kubelet-serving-key-file=/var/lib/rancher/k3s/server/tls/server-ca.key --cluster-signing-legacy-unknown-cert-file=/var/lib/rancher/k3s/server/tls/server-ca.nochain.crt --cluster-signing-legacy-unknown-key-file=/var/lib/rancher/k3s/server/tls/server-ca.key --configure-cloud-routes=false --controllers=*,tokencleaner,-service,-route,-cloud-node-lifecycle --kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --profiling=false --root-ca-file=/var/lib/rancher/k3s/server/tls/server-ca.crt --secure-port=10257 --service-account-private-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --terminated-pod-gc-threshold=10 --use-service-account-credentials=true"
```
</details>

### 1.3.6 RotateKubeletServerCertificate 引数が true に設定されていることを確認する (自動化)

**結果:** 該当なし

**修正:**
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
root        2415    2397  0 Apr22 ?        00:06:36 containerd 
root        3162       1  0 Apr22 ?        00:00:30 /var/lib/rancher/k3s/data/124f36823e5696ab11a8a042537e1edbc6d69919dc7579be22caccc18ccc083f/bin/containerd-shim-runc-v2 -namespace k8s.io -id d540dd74296e1dc069f7c25dc9e76690d9afb22b404cd87c7f6217889da7aa7e -address /run/k3s/containerd/containerd.sock
root        3215       1  0 Apr22 ?        00:00:29 /var/lib/rancher/k3s/data/124f36823e5696ab11a8a042537e1edbc6d69919dc7579be22caccc18ccc083f/bin/containerd-shim-runc-v2 -namespace k8s.io -id 551b739eb5a7f61465027aaf2848954a29639e8ddf4f78a89fc9f881eb6b1378 -address /run/k3s/containerd/containerd.sock
root        3318       1  0 Apr22 ?        00:00:31 /var/lib/rancher/k3s/data/124f36823e5696ab11a8a042537e1edbc6d69919dc7579be22caccc18ccc083f/bin/containerd-shim-runc-v2 -namespace k8s.io -id dbf0b3aadcbf40fd7dc27f340051fc58979d46c2174963967ae01170c7d88f2d -address /run/k3s/containerd/containerd.sock
root        4135       1  0 Apr22 ?        00:00:41 /var/lib/rancher/k3s/data/124f36823e5696ab11a8a042537e1edbc6d69919dc7579be22caccc18ccc083f/bin/containerd-shim-runc-v2 -namespace k8s.io -id 21e58656877367076224111e51be5d30e8d316dbcb8c05a36a8432eda2d16ccb -address /run/k3s/containerd/containerd.sock
root        4300       1  0 Apr22 ?        00:00:30 /var/lib/rancher/k3s/data/124f36823e5696ab11a8a042537e1edbc6d69919dc7579be22caccc18ccc083f/bin/containerd-shim-runc-v2 -namespace k8s.io -id c1db1ac0969a14f1addcc0295ec09fa9fa4c55edac1acc4701ac18326dcb8a51 -address /run/k3s/containerd/containerd.sock
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
```
</details>
Apr 22 20:12:19 server-0 k3s[2397]: time="2024-04-22T20:12:19Z" level=info msg="Running kube-scheduler --authentication-kubeconfig=/var/lib/rancher/k3s/server/cred/scheduler.kubeconfig --authorization-kubeconfig=/var/lib/rancher/k3s/server/cred/scheduler.kubeconfig --bind-address=127.0.0.1 --kubeconfig=/var/lib/rancher/k3s/server/cred/scheduler.kubeconfig --profiling=false --secure-port=10259"
```
</details>

### 1.4.2 --bind-addressの引数が127.0.0.1に設定されていることを確認する（自動化）

**結果:** 合格

**監査:**
```bash
journalctl -D /var/log/journal  -u k3s | grep 'Running kube-scheduler' | tail -n1 | grep 'bind-address'
```

**期待される結果:** '--bind-address'が'127.0.0.1'に等しい、または'--bind-address'が存在しない

<details>
<summary><b>返された値：</b></summary>

```console
Apr 22 20:12:19 server-0 k3s[2397]: time="2024-04-22T20:12:19Z" level=info msg="Running kube-scheduler --authentication-kubeconfig=/var/lib/rancher/k3s/server/cred/scheduler.kubeconfig --authorization-kubeconfig=/var/lib/rancher/k3s/server/cred/scheduler.kubeconfig --bind-address=127.0.0.1 --kubeconfig=/var/lib/rancher/k3s/server/cred/scheduler.kubeconfig --profiling=false --secure-port=10259"
```
</details>


## 2 Etcdノードの設定

### 2.1 --cert-fileと--key-file引数が適切に設定されていることを確認する（自動化）

**結果:** 合格

**監査:**
```bash
grep -A 5 'client-transport-security' /var/lib/rancher/k3s/server/db/etcd/config | grep -E 'cert-file|key-file'
```

**期待される結果:** 'cert-file'が存在し、かつ'key-file'が存在する

<details>
<summary><b>返された値:</b></summary>

```console
  cert-file: /var/lib/rancher/k3s/server/tls/etcd/server-client.crt
  key-file: /var/lib/rancher/k3s/server/tls/etcd/server-client.key
```
</details>

### 2.2 --client-cert-auth引数がtrueに設定されていることを確認する（自動化）

**結果:** 合格

**監査:**
```bash
grep -A 5 'client-transport-security' /var/lib/rancher/k3s/server/db/etcd/config | grep 'client-cert-auth'
```

**期待される結果:** '--client-cert-auth'が存在する、もしくは'client-cert-auth'が'true'に等しい

<details>
<summary><b>返された値:</b></summary>

```console
  client-cert-auth: true
```
</details>

### 2.3 --auto-tls引数がtrueに設定されていないことを確認する（自動化）

**結果:** 合格

**監査:**
```bash
grep 'auto-tls' /var/lib/rancher/k3s/server/db/etcd/config | true
```

**期待される結果:** 'ETCD_AUTO_TLS'が存在しない、もしくは'ETCD_AUTO_TLS'が存在する

<details>
<summary><b>返された値:</b></summary>

```console
error: process ID list syntax error

Usage:
 ps [options]

 Try 'ps --help <simple|list|output|threads|misc|all>'
  or 'ps --help <s|l|o|t|m|a>'
 for additional help text.

For more details see ps(1).
cat: /proc//environ: No such file or directory
```
</details>

### 2.4 --peer-cert-fileと--peer-key-file引数が適切に設定されていることを確認する（自動化）

**結果:** 合格

**監査:**
```bash
grep -A 5 'peer-transport-security' /var/lib/rancher/k3s/server/db/etcd/config | grep -E 'cert-file|key-file'
```

**期待される結果:** 'cert-file'が存在し、かつ'key-file'が存在する

<details>
<summary><b>返された値:</b></summary>

```console
  cert-file: /var/lib/rancher/k3s/server/tls/etcd/peer-server-client.crt
  key-file: /var/lib/rancher/k3s/server/tls/etcd/peer-server-client.key
```
</details>

### 2.5 --peer-client-cert-auth引数がtrueに設定されていることを確認する（自動化）

**結果:** 合格

**監査:**
```bash
grep -A 5 'peer-transport-security' /var/lib/rancher/k3s/server/db/etcd/config | grep 'client-cert-auth'
```

**期待される結果:** '--client-cert-auth'が存在する、もしくは'client-cert-auth'が'true'に等しい

<details>
<summary><b>返された値:</b></summary>

```console
  client-cert-auth: true
```
</details>

### 2.6 --peer-auto-tls引数がtrueに設定されていないことを確認する（自動化）

**結果:** 合格

**監査:**
```bash
grep 'peer-auto-tls' /var/lib/rancher/k3s/server/db/etcd/config | true
```

**期待される結果:** 'ETCD_PEER_AUTO_TLS'が存在しない、もしくは'ETCD_PEER_AUTO_TLS'が存在する

<details>
<summary><b>返された値:</b></summary>

```console
error: process ID list syntax error

Usage:
 ps [options]

 Try 'ps --help <simple|list|output|threads|misc|all>'
  or 'ps --help <s|l|o|t|m|a>'
 for additional help text.

For more details see ps(1).
cat: /proc//environ: No such file or directory
```
</details>

### 2.7 etcdに対して一意の認証局が使用されていることを確認する（自動化）

**結果:** 合格

**監査:**
```bash
grep 'trusted-ca-file' /var/lib/rancher/k3s/server/db/etcd/config
```

**期待される結果:** 'trusted-ca-file'が存在する

<details>
<summary><b>返された値:</b></summary>

```console
  trusted-ca-file: /var/lib/rancher/k3s/server/tls/etcd/server-ca.crt
  trusted-ca-file: /var/lib/rancher/k3s/server/tls/etcd/peer-ca.crt
```
</details>

## 4.1 ワーカーノード設定ファイル

### 4.1.1 kubeletサービスファイルのパーミッションが600以上の制限に設定されていることを確認する（自動化）

**結果:** 該当なし

**改善策:**
各ワーカーノードで以下のコマンドを実行してください（システムのファイル位置に基づいて）。
例：chmod 600 /etc/systemd/system/kubelet.service.d/10-kubeadm.conf
該当なし - すべての設定はコンテナ実行時に引数として渡されます。

### 4.1.2 kubeletサービスファイルの所有権がroot:rootに設定されていることを確認する（自動化）

**結果:** 該当なし

**改善策:**
各ワーカーノードで以下のコマンドを実行してください（システムのファイル位置に基づいて）。
例：
chown root:root /etc/systemd/system/kubelet.service.d/10-kubeadm.conf
該当なし。
すべての設定はコンテナ実行時に引数として渡されます。

### 4.1.3 プロキシkubeconfigファイルが存在する場合、パーミッションが600以上の制限に設定されていることを確認する（手動）

**結果:** 警告

**改善策:**
各ワーカーノードで以下のコマンドを実行してください（システムのファイル位置に基づいて）。
例：
chmod 600 /var/lib/rancher/k3s/agent/kubeproxy.kubeconfig

### 4.1.4 プロキシkubeconfigファイルが存在する場合、所有権がroot:rootに設定されていることを確認する（手動）

**結果:** パス

**監査:**
```bash
/bin/sh -c 'if test -e /var/lib/rancher/k3s/agent/kubeproxy.kubeconfig; then stat -c %U:%G /var/lib/rancher/k3s/agent/kubeproxy.kubeconfig; fi' 
```

**期待される結果:** 'root:root'が存在する

<details>
<summary><b>返された値:</b></summary>

```console
root:root
```
</details>

### 4.1.5 --kubeconfig kubelet.confファイルのパーミッションが600以上の制限に設定されていることを確認する（自動化）

**結果:** パス

**監査:**
```bash
/bin/sh -c 'if test -e /var/lib/rancher/k3s/server/cred/admin.kubeconfig; then stat -c permissions=%a /var/lib/rancher/k3s/server/cred/admin.kubeconfig; fi' 
```

**期待される結果:** permissionsが600のパーミッションを持つ、期待される値は600以上の制限

<details>
<summary><b>返された値:</b></summary>

```console
permissions=600
```
</details>

### 4.1.6 --kubeconfig kubelet.confファイルの所有権がroot:rootに設定されていることを確認する（自動化）

**結果:** パス

**監査:**
```bash
stat -c %U:%G /var/lib/rancher/k3s/agent/kubelet.kubeconfig
```

**期待される結果:** 'root:root'が存在する

<details>
<summary><b>返された値:</b></summary>

```console
root:root
```
</details>

### 4.1.7 認証局ファイルのパーミッションが600以上の制限に設定されていることを確認する（手動）

**結果:** パス

**監査:**
```bash
stat -c permissions=%a /var/lib/rancher/k3s/agent/client-ca.crt
```

**期待される結果:** permissionsが600のパーミッションを持つ、期待される値は600以上の制限

<details>
<summary><b>返された値:</b></summary>

```console
permissions=600
```
</details>

### 4.1.8 クライアント認証局ファイルの所有権がroot:rootに設定されていることを確認する（手動）

**結果:** パス

**監査:**
```bash
stat -c %U:%G /var/lib/rancher/k3s/agent/client-ca.crt
```

**期待される結果:** 'root:root'が'root:root'と等しい

<details>
<summary><b>返された値:</b></summary>

```console
root:root
```
</details>

### 4.1.9 kubelet --config設定ファイルのパーミッションが600以上の制限に設定されていることを確認する（自動化）

**結果:** パス

**監査:**
```bash
/bin/sh -c 'if test -e /var/lib/rancher/k3s/agent/kubelet.kubeconfig; then stat -c permissions=%a /var/lib/rancher/k3s/agent/kubelet.kubeconfig; fi' 
```

**期待される結果:** permissionsが600のパーミッションを持つ、期待される値は600以上の制限

<details>
<summary><b>返された値:</b></summary>

```console
permissions=600
```
</details>

### 4.1.10 kubelet --config設定ファイルの所有権がroot:rootに設定されていることを確認する（自動化）

**結果:** パス

**監査:**
```bash
/bin/sh -c 'if test -e /var/lib/rancher/k3s/agent/kubelet.kubeconfig; then stat -c %U:%G /var/lib/rancher/k3s/agent/kubelet.kubeconfig; fi' 
```

**期待される結果:** 'root:root'が存在する

<details>
<summary><b>返された値:</b></summary>

```console
root:root
```
</details>

## 4.2 Kubelet

### 4.2.1 --anonymous-auth 引数が false に設定されていることを確認する（自動化）

**結果:** 合格

**監査:**
```bash
/bin/sh -c 'if test $(journalctl -D /var/log/journal -u k3s | grep "Running kube-apiserver" | wc -l) -gt 0; then journalctl -D /var/log/journal -u k3s | grep "Running kube-apiserver" | tail -n1 | grep "anonymous-auth" | grep -v grep; else echo "--anonymous-auth=false"; fi' 
```

**期待される結果:** '--anonymous-auth' が 'false' に等しい

<details>
<summary><b>返された値:</b></summary>

```console
Apr 22 20:12:19 server-0 k3s[2397]: time="2024-04-22T20:12:19Z" level=info msg="Running kube-apiserver --admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --encryption-provider-config-automatic-reload=true --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-lookup=true --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

### 4.2.2 --authorization-modeの引数がAlwaysAllowに設定されていないことを確認する（自動化）

**結果:** 合格

**監査:**
```bash
/bin/sh -c 'if test $(journalctl -D /var/log/journal -u k3s | grep "Running kube-apiserver" | wc -l) -gt 0; then journalctl -D /var/log/journal -u k3s | grep "Running kube-apiserver" | tail -n1 | grep "authorization-mode" | grep -v grep; else echo "--authorization-mode=Webhook"; fi' 
```

**期待される結果:** '--authorization-mode'に'AlwaysAllow'が含まれていない

<details>
<summary><b>返された値:</b></summary>

```console
Apr 22 20:12:19 server-0 k3s[2397]: time="2024-04-22T20:12:19Z" level=info msg="Running kube-apiserver --admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --encryption-provider-config-automatic-reload=true --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-lookup=true --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

### 4.2.3 --client-ca-file 引数が適切に設定されていることを確認する（自動化）

**結果:** 合格

**監査:**
```bash
/bin/sh -c 'if test $(journalctl -D /var/log/journal -u k3s | grep "Running kube-apiserver" | wc -l) -gt 0; then journalctl -D /var/log/journal -u k3s | grep "Running kube-apiserver" | tail -n1 | grep "client-ca-file" | grep -v grep; else echo "--client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt"; fi' 
```

**期待される結果:** '--client-ca-file' が存在する

<details>
<summary><b>返された値:</b></summary>
```console
Apr 22 20:12:19 server-0 k3s[2397]: time="2024-04-22T20:12:19Z" level=info msg="Running kube-apiserver --admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --encryption-provider-config-automatic-reload=true --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-lookup=true --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

### 4.2.4 --read-only-portの引数が0に設定されていることを確認する（手動）

**結果:** 合格

**監査:**
```bash
journalctl -D /var/log/journal -u k3s -u k3s-agent | grep 'Running kubelet' | tail -n1 | grep 'read-only-port' 
```

**期待される結果:** '--read-only-port'が'0'に等しい、または'--read-only-port'が存在しない

<details>
<summary><b>返された値:</b></summary>

```console
Apr 22 20:12:21 server-0 k3s[2397]: time="2024-04-22T20:12:21Z" level=info msg="Running kubelet --address=0.0.0.0 --allowed-unsafe-sysctls=net.ipv4.ip_forward,net.ipv6.conf.all.forwarding --anonymous-auth=false --authentication-token-webhook=true --authorization-mode=Webhook --cgroup-driver=systemd --client-ca-file=/var/lib/rancher/k3s/agent/client-ca.crt --cloud-provider=external --cluster-dns=10.43.0.10 --cluster-domain=cluster.local --container-runtime-endpoint=unix:///run/k3s/containerd/containerd.sock --containerd=/run/k3s/containerd/containerd.sock --event-qps=0 --eviction-hard=imagefs.available<5%,nodefs.available<5% --eviction-minimum-reclaim=imagefs.available=10%,nodefs.available=10% --fail-swap-on=false --feature-gates=CloudDualStackNodeIPs=true --healthz-bind-address=127.0.0.1 --hostname-override=server-0 --kubeconfig=/var/lib/rancher/k3s/agent/kubelet.kubeconfig --make-iptables-util-chains=true --node-ip=10.10.10.100 --node-labels= --pod-infra-container-image=rancher/mirrored-pause:3.6 --pod-manifest-path=/var/lib/rancher/k3s/agent/pod-manifests --protect-kernel-defaults=true --read-only-port=0 --resolv-conf=/run/systemd/resolve/resolv.conf --serialize-image-pulls=false --streaming-connection-idle-timeout=5m --tls-cert-file=/var/lib/rancher/k3s/agent/serving-kubelet.crt --tls-private-key-file=/var/lib/rancher/k3s/agent/serving-kubelet.key"
```
</details>

### 4.2.5 --streaming-connection-idle-timeout 引数が0に設定されていないことを確認する（手動）

**結果:** 合格

**監査:**
```bash
journalctl -D /var/log/journal -u k3s -u k3s-agent | grep 'Running kubelet' | tail -n1 | grep 'streaming-connection-idle-timeout'
```

**期待される結果:** '--streaming-connection-idle-timeout' が '0' に等しくない、または '--streaming-connection-idle-timeout' が存在しない

<details>
<summary><b>返された値:</b></summary>

```console
Apr 22 20:12:21 server-0 k3s[2397]: time="2024-04-22T20:12:21Z" level=info msg="Running kubelet --address=0.0.0.0 --allowed-unsafe-sysctls=net.ipv4.ip_forward,net.ipv6.conf.all.forwarding --anonymous-auth=false --authentication-token-webhook=true --authorization-mode=Webhook --cgroup-driver=systemd --client-ca-file=/var/lib/rancher/k3s/agent/client-ca.crt --cloud-provider=external --cluster-dns=10.43.0.10 --cluster-domain=cluster.local --container-runtime-endpoint=unix:///run/k3s/containerd/containerd.sock --containerd=/run/k3s/containerd/containerd.sock --event-qps=0 --eviction-hard=imagefs.available<5%,nodefs.available<5% --eviction-minimum-reclaim=imagefs.available=10%,nodefs.available=10% --fail-swap-on=false --feature-gates=CloudDualStackNodeIPs=true --healthz-bind-address=127.0.0.1 --hostname-override=server-0 --kubeconfig=/var/lib/rancher/k3s/agent/kubelet.kubeconfig --make-iptables-util-chains=true --node-ip=10.10.10.100 --node-labels= --pod-infra-container-image=rancher/mirrored-pause:3.6 --pod-manifest-path=/var/lib/rancher/k3s/agent/pod-manifests --protect-kernel-defaults=true --read-only-port=0 --resolv-conf=/run/systemd/resolve/resolv.conf --serialize-image-pulls=false --streaming-connection-idle-timeout=5m --tls-cert-file=/var/lib/rancher/k3s/agent/serving-kubelet.crt --tls-private-key-file=/var/lib/rancher/k3s/agent/serving-kubelet.key"
```
</details>

### 4.2.6 --make-iptables-util-chains 引数が true に設定されていることを確認する（自動化）

**結果:** 合格

**監査:**
```bash
journalctl -D /var/log/journal -u k3s -u k3s-agent | grep 'Running kubelet' | tail -n1 | grep 'make-iptables-util-chains'
```

**期待される結果:** '--make-iptables-util-chains' が 'true' に等しい、または '--make-iptables-util-chains' が存在しない

<details>
<summary><b>返された値:</b></summary>

```console
Apr 22 20:12:21 server-0 k3s[2397]: time="2024-04-22T20:12:21Z" level=info msg="Running kubelet --address=0.0.0.0 --allowed-unsafe-sysctls=net.ipv4.ip_forward,net.ipv6.conf.all.forwarding --anonymous-auth=false --authentication-token-webhook=true --authorization-mode=Webhook --cgroup-driver=systemd --client-ca-file=/var/lib/rancher/k3s/agent/client-ca.crt --cloud-provider=external --cluster-dns=10.43.0.10 --cluster-domain=cluster.local --container-runtime-endpoint=unix:///run/k3s/containerd/containerd.sock --containerd=/run/k3s/containerd/containerd.sock --event-qps=0 --eviction-hard=imagefs.available<5%,nodefs.available<5% --eviction-minimum-reclaim=imagefs.available=10%,nodefs.available=10% --fail-swap-on=false --feature-gates=CloudDualStackNodeIPs=true --healthz-bind-address=127.0.0.1 --hostname-override=server-0 --kubeconfig=/var/lib/rancher/k3s/agent/kubelet.kubeconfig --make-iptables-util-chains=true --node-ip=10.10.10.100 --node-labels= --pod-infra-container-image=rancher/mirrored-pause:3.6 --pod-manifest-path=/var/lib/rancher/k3s/agent/pod-manifests --protect-kernel-defaults=true --read-only-port=0 --resolv-conf=/run/systemd/resolve/resolv.conf --serialize-image-pulls=false --streaming-connection-idle-timeout=5m --tls-cert-file=/var/lib/rancher/k3s/agent/serving-kubelet.crt --tls-private-key-file=/var/lib/rancher/k3s/agent/serving-kubelet.key"
```
</details>

### 4.2.7 --hostname-override 引数が設定されていないことを確認する（手動）

**結果:** 適用外

**改善策:**
各ワーカーノードの kubelet サービスファイル /etc/systemd/system/kubelet.service.d/10-kubeadm.conf を編集し、
KUBELET_SYSTEM_PODS_ARGS 変数から --hostname-override 引数を削除してください。
システムに応じて、kubelet サービスを再起動します。例えば、
systemctl daemon-reload
systemctl restart kubelet.service
適用外。

### 4.2.8 適切なイベントキャプチャを確保するレベルに eventRecordQPS 引数が設定されていることを確認する（手動）

**結果:** 合格

**監査:**
```bash
/bin/ps -fC containerd
```

**期待される結果:** 'eventRecordQPS' が存在する、または 'eventRecordQPS' が存在しない

<details>
<summary><b>返された値:</b></summary>

```console
apiVersion: v1
clusters:
- cluster:
    server: https://127.0.0.1:6443
    certificate-authority: /var/lib/rancher/k3s/agent/server-ca.crt
  name: local
contexts:
- context:
    cluster: local
    namespace: default
    user: user
  name: Default
current-context: Default
kind: Config
preferences: {}
users:
- name: user
  user:
    client-certificate: /var/lib/rancher/k3s/agent/client-kubelet.crt
    client-key: /var/lib/rancher/k3s/agent/client-kubelet.key
```
</details>

### 4.2.9 --tls-cert-fileと--tls-private-key-file引数が適切に設定されていることを確認する（手動）

**結果:** 該当なし

**修正方法:**
Kubelet設定ファイルを使用している場合、ファイルを編集して`tlsCertFile`をこのKubeletを識別するために使用する証明書ファイルの場所に、`tlsPrivateKeyFile`を対応する秘密鍵ファイルの場所に設定します。
コマンドライン引数を使用している場合、各ワーカーノードの/etc/systemd/system/kubelet.service.d/10-kubeadm.confにあるkubeletサービスファイルを編集し、KUBELET_CERTIFICATE_ARGS変数に以下のパラメータを設定します。
--tls-cert-file=&lt;path/to/tls-certificate-file&gt;
--tls-private-key-file=&lt;path/to/tls-key-file&gt;
システムに応じて、kubeletサービスを再起動します。例えば、
systemctl daemon-reload
systemctl restart kubelet.service
許容 - サービス証明書を生成する際、特定のクラウドプロバイダーに必要なホスト名オーバーライドと併用すると機能が破壊される可能性があります。

### 4.2.10 --rotate-certificates引数がfalseに設定されていないことを確認する（手動）

**結果:** 合格

**監査:**
```bash
/bin/ps -fC containerd
```

**期待される結果:** 'rotateCertificates'が存在する または 'rotateCertificates'が存在しない

<details>
<summary><b>返された値：</b></summary>

```console
apiVersion: v1
clusters:
- cluster:
    server: https://127.0.0.1:6443
    certificate-authority: /var/lib/rancher/k3s/agent/server-ca.crt
  name: local
contexts:
- context:
    cluster: local
    namespace: default
    user: user
  name: Default
current-context: Default
kind: Config
preferences: {}
users:
- name: user
  user:
    client-certificate: /var/lib/rancher/k3s/agent/client-kubelet.crt
    client-key: /var/lib/rancher/k3s/agent/client-kubelet.key
```
</details>

### 4.2.11 RotateKubeletServerCertificate 引数が true に設定されていることを確認する（手動）

**結果:** 合格

**監査:**
```bash
/bin/ps -fC containerd
```

**期待される結果:** 'featureGates.RotateKubeletServerCertificate' が存在する、または 'featureGates.RotateKubeletServerCertificate' が存在しない

<details>
<summary><b>返された値:</b></summary>

```console
apiVersion: v1
clusters:
- cluster:
    server: https://127.0.0.1:6443
    certificate-authority: /var/lib/rancher/k3s/agent/server-ca.crt
  name: local
contexts:
- context:
    cluster: local
    namespace: default
    user: user
  name: Default
current-context: Default
kind: Config
preferences: {}
users:
- name: user
  user:
    client-certificate: /var/lib/rancher/k3s/agent/client-kubelet.crt
    client-key: /var/lib/rancher/k3s/agent/client-kubelet.key
```
</details>

### 4.2.12 Kubeletが強力な暗号化暗号のみを使用することを確認する（手動）

**結果:** 警告

**修正方法:**
Kubelet設定ファイルを使用している場合、ファイルを編集して`TLSCipherSuites`を
TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_AES_128_GCM_SHA256
または、これらの値のサブセットに設定します。
実行可能引数を使用している場合、各ワーカーノードの/etc/systemd/system/kubelet.service.d/10-kubeadm.confにあるkubeletサービスファイルを編集し、
--tls-cipher-suites パラメータを以下のように、または、これらの値のサブセットに設定します。
--tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_AES_128_GCM_SHA256
システムに応じて、kubeletサービスを再起動します。例：
systemctl daemon-reload
systemctl restart kubelet.service

### 4.2.13 ポッドのPIDに制限が設定されていることを確認する（手動）

**Result:** 警告

**Remediation:**
このパラメータの適切なレベルを決定し、--pod-max-pids コマンドラインパラメータまたは PodPidsLimit 設定ファイル設定を介して設定します。

## 5.1 RBAC とサービスアカウント

### 5.1.1 クラスター管理者ロールが必要な場合にのみ使用されていることを確認する (手動)

**結果:** 警告

**修正方法:**
クラスター管理者ロールへのすべてのクラスター役割バインディングを特定します。それらが使用されているかどうか、またはこのロールが必要かどうか、またはより少ない特権のロールを使用できるかどうかを確認します。可能な場合は、最初にユーザーを低特権のロールにバインドし、その後クラスター管理者ロールへのクラスター役割バインディングを削除します：
kubectl delete clusterrolebinding [name]

### 5.1.2 シークレットへのアクセスを最小限に抑える (手動)

**結果:** 警告

**修正方法:**
可能な場合は、クラスター内のシークレットオブジェクトへの get、list、および watch アクセスを削除します。

### 5.1.3 ロールおよびクラスター役割でのワイルドカードの使用を最小限に抑える (手動)

**結果:** 警告

**修正方法:**
可能な場合は、クラスター役割およびロールでのワイルドカードの使用を特定のオブジェクトまたはアクションに置き換えます。

### 5.1.4 ポッドの作成アクセスを最小限に抑える (手動)

**結果:** 警告

**修正方法:**
可能な場合は、クラスター内のポッドオブジェクトへの作成アクセスを削除します。

### 5.1.5 デフォルトのサービスアカウントが積極的に使用されていないことを確認する (手動)

**結果:** WARN

**修正方法:**
Kubernetes ワークロードが Kubernetes API サーバーへの特定のアクセスを必要とする場合は、明示的なサービスアカウントを作成します。各デフォルトのサービスアカウントの設定を変更して、この値を含めます：
automountServiceAccountToken: false

### 5.1.6 サービスアカウントトークンが必要な場合にのみマウントされることを確認する (手動)

**結果:** WARN

**修正方法:**
サービスアカウントトークンをマウントする必要のないポッドおよびサービスアカウントの定義を変更して無効にします。

### 5.1.7 system:masters グループの使用を避ける (手動)

**結果:** WARN

**修正方法:**
クラスター内のすべてのユーザーから system:masters グループを削除します。

### 5.1.8 Kubernetes クラスターでの Bind、Impersonate、および Escalate 権限の使用を制限する (手動)

**結果:** WARN

**修正方法:**
可能な場合は、サブジェクトから impersonate、bind、および escalate 権限を削除します。

### 5.1.9 永続ボリュームの作成アクセスを最小限に抑える (手動)

**結果:** WARN

**修正方法:**
可能な場合は、クラスター内の PersistentVolume オブジェクトへの作成アクセスを削除します。

### 5.1.10 ノードのプロキシサブリソースへのアクセスを最小限に抑える (手動)

**結果:** WARN

**修正方法:**
可能な場合は、ノードオブジェクトのプロキシサブリソースへのアクセスを削除します。

### 5.1.11 証明書署名要求オブジェクトの承認サブリソースへのアクセスを最小限に抑える (手動)

**結果:** WARN

**修正方法:**
可能な場合は、証明書署名要求オブジェクトの承認サブリソースへのアクセスを削除します。

### 5.1.12 Webhook 設定オブジェクトへのアクセスを最小限に抑える (手動)

**結果:** WARN

**修正方法:**
可能な場合は、validatingwebhookconfigurations または mutatingwebhookconfigurations オブジェクトへのアクセスを削除します。

### 5.1.13 サービスアカウントトークンの作成アクセスを最小限に抑える (手動)

**結果:** WARN

**修正方法:**
可能な場合は、サービスアカウントオブジェクトのトークンサブリソースへのアクセスを削除します。

## 5.2 ポッドセキュリティ基準

### 5.2.1 クラスターに少なくとも1つのアクティブなポリシー制御メカニズムが存在することを確認する (手動)

**結果:** WARN

**修正方法:**
ユーザーワークロードを含むすべてのネームスペースに対して、Pod Security Admission または外部ポリシー制御システムが存在することを確認します。

### 5.2.2 特権コンテナの許可を最小限に抑える (手動)

**結果:** WARN

**修正方法:**
ユーザーワークロードを持つクラスター内の各ネームスペースにポリシーを追加して、特権コンテナの許可を制限します。

### 5.2.3 ホストプロセスIDネームスペースを共有するコンテナの許可を最小限に抑える (自動)

**結果:** WARN

**修正方法:**
ユーザーワークロードを持つクラスター内の各ネームスペースにポリシーを追加して、`hostPID` コンテナの許可を制限します。

### 5.2.4 ホストIPCネームスペースを共有するコンテナの許可を最小限に抑える (自動)

**結果:** WARN

**修正方法:**
ユーザーワークロードを持つクラスター内の各ネームスペースにポリシーを追加して、`hostIPC` コンテナの許可を制限します。

### 5.2.5 ホストネットワークネームスペースを共有するコンテナの許可を最小限に抑える (自動)

**結果:** WARN

**修正方法:**
ユーザーワークロードを持つクラスター内の各ネームスペースにポリシーを追加して、`hostNetwork` コンテナの許可を制限します。

### 5.2.6 allowPrivilegeEscalation を持つコンテナの許可を最小限に抑える (自動)

**結果:** WARN

**修正方法:**
ユーザーワークロードを持つクラスター内の各ネームスペースにポリシーを追加して、`.spec.allowPrivilegeEscalation` が `true` に設定されているコンテナの許可を制限します。

### 5.2.7 ルートコンテナの許可を最小限に抑える (自動)

**結果:** WARN

**修正方法:**
クラスター内の各ネームスペースにポリシーを作成し、`MustRunAsNonRoot` または UID の範囲に 0 を含まない `MustRunAs` が設定されていることを確認します。

### 5.2.8 NET_RAW 権限を持つコンテナの許可を最小限に抑える (自動)

**結果:** WARN

**修正方法:**
ユーザーワークロードを持つクラスター内の各ネームスペースにポリシーを追加して、`NET_RAW` 権限を持つコンテナの許可を制限します。

### 5.2.9 追加の権限を持つコンテナの許可を最小限に抑える (自動)

**結果:** WARN

**修正方法:**
クラスターのポリシーに `allowedCapabilities` が存在しないことを確認するか、空の配列に設定されていることを確認します。

### 5.2.10 権限が割り当てられたコンテナの許可を最小限に抑える (手動)

**結果:** WARN

**修正方法:**
クラスター上で実行されているアプリケーションの権限の使用を確認します。ネームスペースに Linux 権限を必要としないアプリケーションが含まれている場合、すべての権限を削除しないコンテナの許可を禁止する PSP を追加することを検討します。

### 5.2.11 Windows HostProcess コンテナの許可を最小限に抑える (手動)

**結果:** WARN

**修正方法:**
ユーザーワークロードを持つクラスター内の各ネームスペースにポリシーを追加して、`.securityContext.windowsOptions.hostProcess` が `true` に設定されているコンテナの許可を制限します。

### 5.2.12 HostPath ボリュームの許可を最小限に抑える (手動)

**結果:** WARN

**修正方法:**
ユーザーワークロードを持つクラスター内の各ネームスペースにポリシーを追加して、`hostPath` ボリュームを持つコンテナの許可を制限します。

### 5.2.13 HostPorts を使用するコンテナの許可を最小限に抑える (手動)

**結果:** WARN

**修正方法:**
ユーザーワークロードを持つクラスター内の各ネームスペースにポリシーを追加して、`hostPort` セクションを使用するコンテナの許可を制限します。

## 5.3 ネットワークポリシーと CNI

### 5.3.1 使用中の CNI がネットワークポリシーをサポートしていることを確認する (手動)

**結果:** WARN

**修正方法:**
使用中の CNI プラグインがネットワークポリシーをサポートしていない場合は、別のプラグインの使用を検討するか、Kubernetes クラスター内のトラフィックを制限するための代替メカニズムを見つけることを検討します。

### 5.3.2 すべてのネームスペースにネットワークポリシーが定義されていることを確認する (手動)

**結果:** WARN

**修正方法:**
ドキュメントに従い、必要に応じて NetworkPolicy オブジェクトを作成します。

## 5.4 シークレット管理

### 5.4.1 環境変数としてのシークレットよりもファイルとしてのシークレットを使用することを推奨する (手動)

**結果:** WARN

**修正方法:**
可能であれば、アプリケーションコードを再記述して、環境変数ではなくマウントされたシークレットファイルからシークレットを読み取るようにします。

### 5.4.2 外部シークレットストレージを検討する (手動)

**結果:** WARN

**修正方法:**
クラウドプロバイダーまたはサードパーティのシークレット管理ソリューションが提供するシークレット管理オプションを参照します。

## 5.5 拡張可能なアドミッションコントロール

### 5.5.1 ImagePolicyWebhook アドミッションコントローラーを使用してイメージの出所を設定する (手動)

**結果:** WARN

**修正方法:**
Kubernetes のドキュメントに従い、イメージの出所を設定します。

## 5.7 一般的なポリシー

### 5.7.1 ネームスペースを使用してリソース間に管理境界を作成する (手動)

**結果:** WARN

**修正方法:**
ドキュメントに従い、必要に応じてデプロイメント内のオブジェクトのためにネームスペースを作成します。

### 5.7.2 Pod 定義で seccomp プロファイルが docker/default に設定されていることを確認する (手動)

**結果:** WARN

**修正方法:**
Pod 定義で docker/default seccomp プロファイルを有効にするために `securityContext` を使用します。以下はその例です：
  securityContext:
    seccompProfile:
      type: RuntimeDefault

### 5.7.3 Pod およびコンテナに SecurityContext を適用する (手動)

**結果:** WARN

**修正方法:**
Kubernetes のドキュメントに従い、Pod に SecurityContext を適用します。推奨される SecurityContext のリストについては、CIS Security Benchmark for Docker Containers を参照してください。

### 5.7.4 デフォルトのネームスペースを使用しない (手動)

**結果:** WARN

**修正方法:**
Kubernetes リソースの適切な分離を可能にするためにネームスペースを作成し、すべての新しいリソースが特定のネームスペースに作成されることを確認します。