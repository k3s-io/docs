```markdown
---
title: CIS 1.23 自己評価ガイド
---

## 概要

このドキュメントは[K3sセキュリティ強化ガイド](hardening-guide.md)の補足資料です。強化ガイドはK3sの本番インストールを強化するための具体的な指針を提供し、このベンチマークガイドはCIS Kubernetesベンチマークの各コントロールに対して強化されたクラスターのセキュリティレベルを評価するのに役立ちます。K3sのオペレーター、セキュリティチーム、監査人、意思決定者が使用することを目的としています。

このガイドはK3sの**v1.22-v1.23**リリースラインおよびCIS Kubernetesベンチマークの**v1.23**リリースに特化しています。

各コントロールに関する詳細な説明やテスト失敗時の修正方法については、CIS Kubernetesベンチマークv1.6の該当セクションを参照してください。ベンチマークは[Center for Internet Security (CIS)](https://www.cisecurity.org/benchmark/kubernetes/)で無料アカウントを作成後にダウンロードできます。

### コントロールテストの方法論

CIS Kubernetesベンチマークの各コントロールは、付随する強化ガイドに従って設定されたK3sクラスターに対して評価されました。

コントロール監査が元のCISベンチマークと異なる場合、K3sに特化した監査コマンドがテスト用に提供されます。

各コントロールの結果は以下の通りです：

- **合格** - テスト対象のK3sクラスターがベンチマークに記載された監査に合格しました。
- **該当なし** - コントロールはK3sの設計上適用されません。修正セクションでその理由を説明します。
- **警告** - コントロールはCISベンチマークで手動とされており、クラスターの使用ケースやその他の要因に依存します。これらのコントロールはK3sがその実装を妨げないことを確認するために評価されていますが、テスト対象のクラスターのさらなる設定や監査は行われていません。

このガイドは、K3sがSystemdユニットとして実行されていることを前提としています。インストール方法が異なる場合は、「監査」コマンドをシナリオに合わせて調整する必要があります。

> 注意: このガイドでは`自動化された`テスト（以前は`スコア付き`と呼ばれていたもの）のみを対象としています。

## 1.1 コントロールプレーンノードの設定ファイル
### 1.1.1 APIサーバーポッド仕様ファイルの権限が644以上に設定されていることを確認する（自動化）

**結果:** 該当なし

**修正方法:**
コントロールプレーンノードで以下のコマンドを実行します（システム上のファイルの場所に基づく）。
例：`chmod 644 /etc/kubernetes/manifests/kube-apiserver.yaml`

### 1.1.2 APIサーバーポッド仕様ファイルの所有者がroot:rootに設定されていることを確認する（自動化）

**結果:** 該当なし

**修正方法:**
コントロールプレーンノードで以下のコマンドを実行します（システム上のファイルの場所に基づく）。
例：`chown root:root /etc/kubernetes/manifests/kube-apiserver.yaml`

### 1.1.3 コントローラーマネージャーポッド仕様ファイルの権限が644以上に設定されていることを確認する（自動化）

**結果:** 該当なし

**修正方法:**
コントロールプレーンノードで以下のコマンドを実行します（システム上のファイルの場所に基づく）。
例：`chmod 644 /etc/kubernetes/manifests/kube-controller-manager.yaml`

### 1.1.4 コントローラーマネージャーポッド仕様ファイルの所有者がroot:rootに設定されていることを確認する（自動化）

**結果:** 該当なし

**修正方法:**
コントロールプレーンノードで以下のコマンドを実行します（システム上のファイルの場所に基づく）。
例：`chown root:root /etc/kubernetes/manifests/kube-controller-manager.yaml`

### 1.1.5 スケジューラーポッド仕様ファイルの権限が644以上に設定されていることを確認する（自動化）

**結果:** 該当なし

**修正方法:**
コントロールプレーンノードで以下のコマンドを実行します（システム上のファイルの場所に基づく）。
例：`chmod 644 /etc/kubernetes/manifests/kube-scheduler.yaml`

### 1.1.6 スケジューラーポッド仕様ファイルの所有者がroot:rootに設定されていることを確認する（自動化）

**結果:** 該当なし

**修正方法:**
コントロールプレーンノードで以下のコマンドを実行します（システム上のファイルの場所に基づく）。
例：`chown root:root /etc/kubernetes/manifests/kube-scheduler.yaml`

### 1.1.7 etcdポッド仕様ファイルの権限が644以上に設定されていることを確認する（自動化）

**結果:** 該当なし

**修正方法:**
コントロールプレーンノードで以下のコマンドを実行します（システム上のファイルの場所に基づく）。
例：`chmod 644 /etc/kubernetes/manifests/etcd.yaml`

### 1.1.8 etcdポッド仕様ファイルの所有者がroot:rootに設定されていることを確認する（自動化）

**結果:** 該当なし

**修正方法:**
コントロールプレーンノードで以下のコマンドを実行します（システム上のファイルの場所に基づく）。
例：`chown root:root /etc/kubernetes/manifests/etcd.yaml`

### 1.1.9 コンテナネットワークインターフェースファイルの権限が644以上に設定されていることを確認する（手動）

**結果:** 該当なし

**修正方法:**
コントロールプレーンノードで以下のコマンドを実行します（システム上のファイルの場所に基づく）。
例：`chmod 644 <path/to/cni/files>`

### 1.1.10 コンテナネットワークインターフェースファイルの所有者がroot:rootに設定されていることを確認する（手動）

**結果:** 該当なし

**修正方法:**
コントロールプレーンノードで以下のコマンドを実行します（システム上のファイルの場所に基づく）。
例：`chown root:root <path/to/cni/files>`

### 1.1.11 etcdデータディレクトリの権限が700以上に設定されていることを確認する（自動化）

**結果:** 合格

**修正方法:**
etcdサーバーノードで、コマンド'ps -ef | grep etcd'から引数--data-dirとして渡されるetcdデータディレクトリを取得します。
以下のコマンドを実行します（上記で見つかったetcdデータディレクトリに基づく）。例：chmod 700 /var/lib/etcd

**監査スクリプト:** `check_for_k3s_etcd.sh`

```bash
#!/bin/bash

# このスクリプトは、k3sが実際にetcdを実行していること（sqlite3などの他のデータベースではないこと）を確認してから要件をチェックします
set -eE

handle_error() {
    echo "false"
}

trap 'handle_error' ERR

if [[ "$(journalctl -D /var/log/journal -u k3s | grep 'Managed etcd cluster initializing' | grep -v grep | wc -l)" -gt 0 ]]; then
    case $1 in 
        "1.1.11")
            echo $(stat -c %a /var/lib/rancher/k3s/server/db/etcd);;
        "1.2.29")
            echo $(journalctl -D /var/log/journal -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep 'etcd-');;
        "2.1")
            echo $(grep -A 5 'client-transport-security' /var/lib/rancher/k3s/server/db/etcd/config | grep -E 'cert-file|key-file');;
        "2.2")
            echo $(grep -A 5 'client-transport-security' /var/lib/rancher/k3s/server/db/etcd/config | grep 'client-cert-auth');;
        "2.3")
            echo $(grep 'auto-tls' /var/lib/rancher/k3s/server/db/etcd/config);;
        "2.4")
            echo $(grep -A 5 'peer-transport-security' /var/lib/rancher/k3s/server/db/etcd/config | grep -E 'cert-file|key-file');;
        "2.5")
            echo $(grep -A 5 'peer-transport-security' /var/lib/rancher/k3s/server/db/etcd/config | grep 'client-cert-auth');;
        "2.6")
            echo $(grep 'peer-auto-tls' /var/lib/rancher/k3s/server/db/etcd/config);;
        "2.7")
            echo $(grep 'trusted-ca-file' /var/lib/rancher/k3s/server/db/etcd/config);;
    esac
else
# 別のデータベースが実行されている場合、スキャンに合格するために必要なものを返します
    case $1 in
        "1.1.11")
            echo "700";;
        "1.2.29")
            echo "--etcd-certfile AND --etcd-keyfile";;
        "2.1")
            echo "cert-file AND key-file";;
        "2.2")
            echo "--client-cert-auth=true";;
        "2.3")
            echo "false";;
        "2.4")
            echo "peer-cert-file AND peer-key-file";;
        "2.5")
            echo "--client-cert-auth=true";;
        "2.6")
            echo "--peer-auto-tls=false";;
        "2.7")
            echo "--trusted-ca-file";;
    esac
fi
```

**監査実行:**

```bash
./check_for_k3s_etcd.sh 1.1.11
```

**期待される結果**:

```console
'700' は '700' と等しい
```

**返された値**:

```console
700
```

### 1.1.12 etcdデータディレクトリの所有者がetcd:etcdに設定されていることを確認する（自動化）

**結果:** 該当なし

**修正方法:**
etcdサーバーノードで、コマンド'ps -ef | grep etcd'から引数--data-dirとして渡されるetcdデータディレクトリを取得します。
以下のコマンドを実行します（上記で見つかったetcdデータディレクトリに基づく）。
例：chown etcd:etcd /var/lib/etcd

### 1.1.13 admin.confファイルの権限が600以上に設定されていることを確認する（自動化）

**結果:** 該当なし

**修正方法:**
コントロールプレーンノードで以下のコマンドを実行します（システム上のファイルの場所に基づく）。
例：chmod 600 /var/lib/rancher/k3s/server/cred/admin.kubeconfig

### 1.1.14 admin.confファイルの所有者がroot:rootに設定されていることを確認する（自動化）

**結果:** 合格

**修正方法:**
コントロールプレーンノードで以下のコマンドを実行します（システム上のファイルの場所に基づく）。
例：chown root:root /etc/kubernetes/admin.conf

**監査:**

```bash
/bin/sh -c 'if test -e /var/lib/rancher/k3s/server/cred/admin.kubeconfig; then stat -c %U:%G /var/lib/rancher/k3s/server/cred/admin.kubeconfig; fi'
```

**期待される結果**:

```console
'root:root' は 'root:root' と等しい
```

**返された値**:

```console
root:root
```

### 1.1.15 scheduler.confファイルの権限が644以上に設定されていることを確認する（自動化）

**結果:** 合格

**修正方法:**
コントロールプレーンノードで以下のコマンドを実行します（システム上のファイルの場所に基づく）。
例：chmod 644 scheduler

**監査:**

```bash
/bin/sh -c 'if test -e /var/lib/rancher/k3s/server/cred/scheduler.kubeconfig; then stat -c permissions=%a /var/lib/rancher/k3s/server/cred/scheduler.kubeconfig; fi'
```

**期待される結果**:

```console
permissionsは644の権限を持ち、期待される権限は644以上
```

**返された値**:

```console
permissions=644
```

### 1.1.16 scheduler.confファイルの所有者がroot:rootに設定されていることを確認する（自動化）

**結果:** 合格

**修正方法:**
コントロールプレーンノードで以下のコマンドを実行します（システム上のファイルの場所に基づく）。
```
例えば、`chown root:root scheduler`

**監査:**

```bash
/bin/sh -c 'if test -e /var/lib/rancher/k3s/server/cred/scheduler.kubeconfig; then stat -c %U:%G /var/lib/rancher/k3s/server/cred/scheduler.kubeconfig; fi'
```

**期待される結果**:

```console
'root:root' が存在する
```

**返された値**:

```console
root:root
```

### 1.1.17 コントローラーマネージャー.confファイルのパーミッションが644またはそれ以上に制限されていることを確認する（自動化）


**結果:** 合格

**修正方法:**
コントロールプレーンノードで以下のコマンドを実行します（システム上のファイルの場所に基づく）。
例えば、
chmod 644 controllermanager

**監査:**

```bash
/bin/sh -c 'if test -e /var/lib/rancher/k3s/server/cred/controller.kubeconfig; then stat -c permissions=%a /var/lib/rancher/k3s/server/cred/controller.kubeconfig; fi'
```

**期待される結果**:

```console
permissions が644のパーミッションを持ち、期待されるパーミッションは644またはそれ以上に制限されている
```

**返された値**:

```console
permissions=644
```

### 1.1.18 コントローラーマネージャー.confファイルの所有者がroot:rootに設定されていることを確認する（自動化）


**結果:** 合格

**修正方法:**
コントロールプレーンノードで以下のコマンドを実行します（システム上のファイルの場所に基づく）。
例えば、
chown root:root controllermanager

**監査:**

```bash
stat -c %U:%G /var/lib/rancher/k3s/server/tls
```

**期待される結果**:

```console
'root:root' が 'root:root' と等しい
```

**返された値**:

```console
root:root
```

### 1.1.19 Kubernetes PKIディレクトリおよびファイルの所有者がroot:rootに設定されていることを確認する（自動化）


**結果:** 合格

**修正方法:**
コントロールプレーンノードで以下のコマンドを実行します（システム上のファイルの場所に基づく）。
例えば、
chown -R root:root /etc/kubernetes/pki/

**監査:**

```bash
find /var/lib/rancher/k3s/server/tls | xargs stat -c %U:%G
```

**期待される結果**:

```console
'root:root' が存在する
```

**返された値**:

```console
root:root root:root root:root root:root root:root root:root root:root root:root root:root root:root root:root root:root root:root root:root root:root root:root root:root root:root root:root root:root root:root root:root root:root root:root root:root root:root root:root root:root root:root root:root root:root root:root root:root root:root root:root root:root root:root root:root root:root root:root root:root root:root root:root root:root root:root root:root root:root root:root root:root root:root root:root root:root root:root
```

### 1.1.20 Kubernetes PKI証明書ファイルのパーミッションが644またはそれ以上に制限されていることを確認する（手動）


**結果:** 警告

**修正方法:**
コントロールプレーンノードで以下のコマンドを実行します（システム上のファイルの場所に基づく）。
例えば、
chmod -R 644 /etc/kubernetes/pki/*.crt

**監査:**

```bash
stat -c %n %a /var/lib/rancher/k3s/server/tls/*.crt
```

### 1.1.21 Kubernetes PKIキーのファイルパーミッションが600に設定されていることを確認する（手動）


**結果:** 警告

**修正方法:**
コントロールプレーンノードで以下のコマンドを実行します（システム上のファイルの場所に基づく）。
例えば、
chmod -R 600 /etc/kubernetes/pki/*.key

**監査:**

```bash
stat -c %n %a /var/lib/rancher/k3s/server/tls/*.key
```

## 1.2 APIサーバー
### 1.2.1 --anonymous-auth引数がfalseに設定されていることを確認する（手動）


**結果:** 警告

**修正方法:**
コントロールプレーンノードのAPIサーバーポッド仕様ファイル /etc/kubernetes/manifests/kube-apiserver.yaml を編集し、以下のパラメータを設定します。
--anonymous-auth=false

**監査:**

```bash
journalctl -D /var/log/journal -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep 'anonymous-auth'
```

### 1.2.2 --token-auth-fileパラメータが設定されていないことを確認する（自動化）


**結果:** 合格

**修正方法:**
ドキュメントに従って認証のための代替メカニズムを構成します。その後、コントロールプレーンノードのAPIサーバーポッド仕様ファイル /etc/kubernetes/manifests/kube-apiserver.yaml を編集し、`--token-auth-file=<filename>` パラメータを削除します。

**監査:**

```bash
/bin/ps -ef | grep containerd | grep -v grep
```

**期待される結果**:

```console
'--token-auth-file' が存在しない
```

**返された値**:

```console
root 1616 1600 6 13:26 ? 00:01:28 containerd -c /var/lib/rancher/k3s/agent/etc/containerd/config.toml -a /run/k3s/containerd/containerd.sock --state /run/k3s/containerd --root /var/lib/rancher/k3s/agent/containerd root 2318 1 0 13:27 ? 00:00:00 /var/lib/rancher/k3s/data/577968fa3d58539cc4265245941b7be688833e6bf5ad7869fa2afe02f15f1cd2/bin/containerd-shim-runc-v2 -namespace k8s.io -id b41ec3297be4625c2406ad8b7b4f8b91cddd60850c420050c4c3273f809b3e7e -address /run/k3s/containerd/containerd.sock root 2341 1 0 13:27 ? 00:00:00 /var/lib/rancher/k3s/data/577968fa3d58539cc4265245941b7be688833e6bf5ad7869fa2afe02f15f1cd2/bin/containerd-shim-runc-v2 -namespace k8s.io -id e7999a65ae0a4e9969f32317ec48ae4f7071b62f92e5236696737973be77c2e1 -address /run/k3s/containerd/containerd.sock root 3199 1 0 13:27 ? 00:00:00 /var/lib/rancher/k3s/data/577968fa3d58539cc4265245941b7be688833e6bf5ad7869fa2afe02f15f1cd2/bin/containerd-shim-runc-v2 -namespace k8s.io -id 90c4e63d6ee29d40a48c2fdaf2738c2472cba1139dde8a550466c452184f8528 -address /run/k3s/containerd/containerd.sock root 3923 1 0 13:27 ? 00:00:00 /var/lib/rancher/k3s/data/577968fa3d58539cc4265245941b7be688833e6bf5ad7869fa2afe02f15f1cd2/bin/containerd-shim-runc-v2 -namespace k8s.io -id be5f4b9bd1ed9239362b7000b47f353acb8bc8ca52a9c9145cba0e902ec1c4b9 -address /run/k3s/containerd/containerd.sock root 4559 1 0 13:28 ? 00:00:00 /var/lib/rancher/k3s/data/577968fa3d58539cc4265245941b7be688833e6bf5ad7869fa2afe02f15f1cd2/bin/containerd-shim-runc-v2 -namespace k8s.io -id 04cd40ea6b6078797f177c902c89412c70e523ad2a687a62829bf1d16ff0e19c -address /run/k3s/containerd/containerd.sock root 4647 1 0 13:28 ? 00:00:00 /var/lib/rancher/k3s/data/577968fa3d58539cc4265245941b7be688833e6bf5ad7869fa2afe02f15f1cd2/bin/containerd-shim-runc-v2 -namespace k8s.io -id 48f37a480315b6adce2d2a5c5d67a85412dd0ba7a2e82816434e0deb9fa75de9 -address /run/k3s/containerd/containerd.sock root 6610 1 0 13:47 ? 00:00:00 /var/lib/rancher/k3s/data/577968fa3d58539cc4265245941b7be688833e6bf5ad7869fa2afe02f15f1cd2/bin/containerd-shim-runc-v2 -namespace k8s.io -id 1cf71c22f568468055e517ab363437c0e54e45274c64024d337cc5bcce66341d -address /run/k3s/containerd/containerd.sock
```

### 1.2.3 --DenyServiceExternalIPsが設定されていないことを確認する（自動化）


**結果:** 合格

**修正方法:**
コントロールプレーンノードのAPIサーバーポッド仕様ファイル /etc/kubernetes/manifests/kube-apiserver.yaml を編集し、`DenyServiceExternalIPs` を有効なアドミッションプラグインから削除します。

**監査:**

```bash
/bin/ps -ef | grep containerd | grep -v grep
```

**期待される結果**:

```console
'--enable-admission-plugins' が存在する または '--enable-admission-plugins' が存在しない
```

**返された値**:

```console
root 1616 1600 6 13:26 ? 00:01:28 containerd -c /var/lib/rancher/k3s/agent/etc/containerd/config.toml -a /run/k3s/containerd/containerd.sock --state /run/k3s/containerd --root /var/lib/rancher/k3s/agent/containerd root 2318 1 0 13:27 ? 00:00:00 /var/lib/rancher/k3s/data/577968fa3d58539cc4265245941b7be688833e6bf5ad7869fa2afe02f15f1cd2/bin/containerd-shim-runc-v2 -namespace k8s.io -id b41ec3297be4625c2406ad8b7b4f8b91cddd60850c420050c4c3273f809b3e7e -address /run/k3s/containerd/containerd.sock root 2341 1 0 13:27 ? 00:00:00 /var/lib/rancher/k3s/data/577968fa3d58539cc4265245941b7be688833e6bf5ad7869fa2afe02f15f1cd2/bin/containerd-shim-runc-v2 -namespace k8s.io -id e7999a65ae0a4e9969f32317ec48ae4f7071b62f92e5236696737973be77c2e1 -address /run/k3s/containerd/containerd.sock root 3199 1 0 13:27 ? 00:00:00 /var/lib/rancher/k3s/data/577968fa3d58539cc4265245941b7be688833e6bf5ad7869fa2afe02f15f1cd2/bin/containerd-shim-runc-v2 -namespace k8s.io -id 90c4e63d6ee29d40a48c2fdaf2738c2472cba1139dde8a550466c452184f8528 -address /run/k3s/containerd/containerd.sock root 3923 1 0 13:27 ? 00:00:00 /var/lib/rancher/k3s/data/577968fa3d58539cc4265245941b7be688833e6bf5ad7869fa2afe02f15f1cd2/bin/containerd-shim-runc-v2 -namespace k8s.io -id be5f4b9bd1ed9239362b7000b47f353acb8bc8ca52a9c9145cba0e902ec1c4b9 -address /run/k3s/containerd/containerd.sock root 4559 1 0 13:28 ? 00:00:00 /var/lib/rancher/k3s/data/577968fa3d58539cc4265245941b7be688833e6bf5ad7869fa2afe02f15f1cd2/bin/containerd-shim-runc-v2 -namespace k8s.io -id 04cd40ea6b6078797f177c902c89412c70e523ad2a687a62829bf1d16ff0e19c -address /run/k3s/containerd/containerd.sock root 4647 1 0 13:28 ? 00:00:00 /var/lib/rancher/k3s/data/577968fa3d58539cc4265245941b7be688833e6bf5ad7869fa2afe02f15f1cd2/bin/containerd-shim-runc-v2 -namespace k8s.io -id 48f37a480315b6adce2d2a5c5d67a85412dd0ba7a2e82816434e0deb9fa75de9 -address /run/k3s/containerd/containerd.sock root 6610 1 0 13:47 ? 00:00:00 /var/lib/rancher/k3s/data/577968fa3d58539cc4265245941b7be688833e6bf5ad7869fa2afe02f15f1cd2/bin/containerd-shim-runc-v2 -namespace k8s.io -id 1cf71c22f568468055e517ab363437c0e54e45274c64024d337cc5bcce66341d -address /run/k3s/containerd/containerd.sock
```

### 1.2.4 --kubelet-https引数がtrueに設定されていることを確認する（自動化）


**結果:** 該当なし

**修正方法:**
コントロールプレーンノードのAPIサーバーポッド仕様ファイル /etc/kubernetes/manifests/kube-apiserver.yaml を編集し、--kubelet-httpsパラメータを削除します。

### 1.2.5 --kubelet-client-certificateおよび--kubelet-client-key引数が適切に設定されていることを確認する（自動化）


**結果:** 合格

**修正方法:**
Kubernetesのドキュメントに従って、apiserverとkubelets間のTLS接続を設定します。その後、コントロールプレーンノードのAPIサーバーポッド仕様ファイル /etc/kubernetes/manifests/kube-apiserver.yaml を編集し、以下のようにkubeletクライアント証明書とキーのパラメータを設定します。
```
--kubelet-client-certificate=<path/to/client-certificate-file>
--kubelet-client-key=<path/to/client-key-file>
```

**監査:**

```bash
journalctl -D /var/log/journal -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep 'kubelet-certificate-authority'
```

**期待される結果**:

```console
'--kubelet-client-certificate' が存在し、'--kubelet-client-key' が存在する
```

**返された値**:

```console
```
```markdown
Sep 13 13:26:40 k3s-123-cis-pool3-b403f678-bzdg5 k3s[1600]: time="2022-09-13T13:26:40Z" level=info msg="Running kube-apiserver --advertise-address=172.31.0.140 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --feature-gates=JobTrackingWithFinalizers=true --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```

### 1.2.6 Ensure that the --kubelet-certificate-authority argument is set as appropriate (Automated)

**Result:** pass

**Remediation:**
Follow the Kubernetes documentation and setup the TLS connection between
the apiserver and kubelets. Then, edit the API server pod specification file
/etc/kubernetes/manifests/kube-apiserver.yaml on the control plane node and set the
--kubelet-certificate-authority parameter to the path to the cert file for the certificate authority
`--kubelet-certificate-authority=<ca-string>`.

**Audit:**

```bash
journalctl -D /var/log/journal -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep 'kubelet-certificate-authority'
```

**Expected Result**:

```console
'--kubelet-certificate-authority' is present
```

**Returned Value**:

```console
Sep 13 13:26:40 k3s-123-cis-pool3-b403f678-bzdg5 k3s[1600]: time="2022-09-13T13:26:40Z" level=info msg="Running kube-apiserver --advertise-address=172.31.0.140 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --feature-gates=JobTrackingWithFinalizers=true --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```

### 1.2.7 Ensure that the --authorization-mode argument is not set to AlwaysAllow (Automated)

**Result:** pass

**Remediation:**
Edit the API server pod specification file /etc/kubernetes/manifests/kube-apiserver.yaml
on the control plane node and set the --authorization-mode parameter to values other than AlwaysAllow.
One such example could be as below.
--authorization-mode=RBAC

**Audit:**

```bash
journalctl -D /var/log/journal -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep 'authorization-mode'
```

**Expected Result**:

```console
'--authorization-mode' does not have 'AlwaysAllow'
```

**Returned Value**:

```console
Sep 13 13:26:40 k3s-123-cis-pool3-b403f678-bzdg5 k3s[1600]: time="2022-09-13T13:26:40Z" level=info msg="Running kube-apiserver --advertise-address=172.31.0.140 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --feature-gates=JobTrackingWithFinalizers=true --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```

### 1.2.8 Ensure that the --authorization-mode argument includes Node (Automated)

**Result:** pass

**Remediation:**
Edit the API server pod specification file /etc/kubernetes/manifests/kube-apiserver.yaml
on the control plane node and set the --authorization-mode parameter to a value that includes Node.
--authorization-mode=Node,RBAC

**Audit:**

```bash
journalctl -D /var/log/journal -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep 'authorization-mode'
```

**Expected Result**:

```console
'--authorization-mode' has 'Node'
```

**Returned Value**:

```console
```
```markdown
Sep 13 13:26:40 k3s-123-cis-pool3-b403f678-bzdg5 k3s[1600]: time="2022-09-13T13:26:40Z" level=info msg="Running kube-apiserver --advertise-address=172.31.0.140 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --feature-gates=JobTrackingWithFinalizers=true --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```

### 1.2.6 Ensure that the --kubelet-certificate-authority argument is set as appropriate (Automated)

**Result:** pass

**Remediation:**
Follow the Kubernetes documentation and setup the TLS connection between
the apiserver and kubelets. Then, edit the API server pod specification file
/etc/kubernetes/manifests/kube-apiserver.yaml on the control plane node and set the
--kubelet-certificate-authority parameter to the path to the cert file for the certificate authority
`--kubelet-certificate-authority=<ca-string>`.

**Audit:**

```bash
journalctl -D /var/log/journal -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep 'kubelet-certificate-authority'
```

**Expected Result**:

```console
'--kubelet-certificate-authority' is present
```

**Returned Value**:

```console
Sep 13 13:26:40 k3s-123-cis-pool3-b403f678-bzdg5 k3s[1600]: time="2022-09-13T13:26:40Z" level=info msg="Running kube-apiserver --advertise-address=172.31.0.140 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --feature-gates=JobTrackingWithFinalizers=true --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```

### 1.2.7 Ensure that the --authorization-mode argument is not set to AlwaysAllow (Automated)

**Result:** pass

**Remediation:**
Edit the API server pod specification file /etc/kubernetes/manifests/kube-apiserver.yaml
on the control plane node and set the --authorization-mode
```markdown
Sep 13 13:26:40 k3s-123-cis-pool3-b403f678-bzdg5 k3s[1600]: time="2022-09-13T13:26:40Z" level=info msg="Running kube-apiserver --advertise-address=172.31.0.140 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --feature-gates=JobTrackingWithFinalizers=true --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```

### 1.2.9 Ensure that the --authorization-mode argument includes RBAC (Automated)

**結果:** 合格

**修正方法:**
コントロールプレーンノードのAPIサーバーポッド仕様ファイル /etc/kubernetes/manifests/kube-apiserver.yaml を編集し、--authorization-mode パラメータをRBACを含む値に設定します。例えば `--authorization-mode=Node,RBAC`。

**監査:**

```bash
journalctl -D /var/log/journal -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep 'authorization-mode'
```

**期待される結果**:

```console
'--authorization-mode' に 'RBAC' が含まれている
```

**返された値**:

```console
Sep 13 13:26:40 k3s-123-cis-pool3-b403f678-bzdg5 k3s[1600]: time="2022-09-13T13:26:40Z" level=info msg="Running kube-apiserver --advertise-address=172.31.0.140 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --feature-gates=JobTrackingWithFinalizers=true --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```

### 1.2.10 Ensure that the admission control plugin EventRateLimit is set (Manual)

**結果:** 警告

**修正方法:**
Kubernetesのドキュメントに従い、設定ファイルに希望する制限を設定します。その後、APIサーバーポッド仕様ファイル /etc/kubernetes/manifests/kube-apiserver.yaml を編集し、以下のパラメータを設定します。
```
--enable-admission-plugins=...,EventRateLimit,...
--admission-control-config-file=<path/to/configuration/file>
```

**監査:**

```bash
journalctl -D /var/log/journal -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep 'enable-admission-plugins'
```

**期待される結果**:

```console
'--enable-admission-plugins' に 'EventRateLimit' が含まれている
```

**返された値**:

```console
Sep 13 13:26:40 k3s-123-cis-pool3-b403f678-bzdg5 k3s[1600]: time="2022-09-13T13:26:40Z" level=info msg="Running kube-apiserver --advertise-address=172.31.0.140 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --feature-gates=JobTrackingWithFinalizers=true --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```

### 1.2.11 Ensure that the admission control plugin AlwaysAdmit is not set (Automated)

**結果:** 合格

**修正方法:**
コントロールプレーンノードのAPIサーバーポッド仕様ファイル /etc/kubernetes/manifests/kube-apiserver.yaml を編集し、--enable-admission-plugins パラメータを削除するか、AlwaysAdmitを含まない値に設定します。

**監査:**

```bash
journalctl -D /var/log/journal -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep 'enable-admission-plugins'
```

**期待される結果**:

```console
'--enable-admission-plugins' に 'AlwaysAdmit' が含まれていない または '--enable-admission-plugins' が存在しない
```

**返された値**:

```console
```
```
```markdown
Sep 13 13:26:40 k3s-123-cis-pool3-b403f678-bzdg5 k3s[1600]: time="2022-09-13T13:26:40Z" level=info msg="Running kube-apiserver --advertise-address=172.31.0.140 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --feature-gates=JobTrackingWithFinalizers=true --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```

### 1.2.12 Ensure that the admission control plugin AlwaysPullImages is set (Manual)

**Result:** warn

**Remediation:**
APIサーバーポッドの仕様ファイル /etc/kubernetes/manifests/kube-apiserver.yaml をコントロールプレーンノードで編集し、--enable-admission-plugins パラメータに AlwaysPullImages を含めるように設定します。
--enable-admission-plugins=...,AlwaysPullImages,...

**Audit:**

```bash
/bin/ps -ef | grep containerd | grep -v grep
```

**Expected Result**:

```console
'--enable-admission-plugins' is present
```

**Returned Value**:

```console
root 1616 1600 6 13:26 ? 00:01:28 containerd -c /var/lib/rancher/k3s/agent/etc/containerd/config.toml -a /run/k3s/containerd/containerd.sock --state /run/k3s/containerd --root /var/lib/rancher/k3s/agent/containerd root 2318 1 0 13:27 ? 00:00:00 /var/lib/rancher/k3s/data/577968fa3d58539cc4265245941b7be688833e6bf5ad7869fa2afe02f15f1cd2/bin/containerd-shim-runc-v2 -namespace k8s.io -id b41ec3297be4625c2406ad8b7b4f8b91cddd60850c420050c4c3273f809b3e7e -address /run/k3s/containerd/containerd.sock root 2341 1 0 13:27 ? 00:00:00 /var/lib/rancher/k3s/data/577968fa3d58539cc4265245941b7be688833e6bf5ad7869fa2afe02f15f1cd2/bin/containerd-shim-runc-v2 -namespace k8s.io -id e7999a65ae0a4e9969f32317ec48ae4f7071b62f92e5236696737973be77c2e1 -address /run/k3s/containerd/containerd.sock root 3199 1 0 13:27 ? 00:00:00 /var/lib/rancher/k3s/data/577968fa3d58539cc4265245941b7be688833e6bf5ad7869fa2afe02f15f1cd2/bin/containerd-shim-runc-v2 -namespace k8s.io -id 90c4e63d6ee29d40a48c2fdaf2738c2472cba1139dde8a550466c452184f8528 -address /run/k3s/containerd/containerd.sock root 3923 1 0 13:27 ? 00:00:00 /var/lib/rancher/k3s/data/577968fa3d58539cc4265245941b7be688833e6bf5ad7869fa2afe02f15f1cd2/bin/containerd-shim-runc-v2 -namespace k8s.io -id be5f4b9bd1ed9239362b7000b47f353acb8bc8ca52a9c9145cba0e902ec1c4b9 -address /run/k3s/containerd/containerd.sock root 4559 1 0 13:28 ? 00:00:00 /var/lib/rancher/k3s/data/577968fa3d58539cc4265245941b7be688833e6bf5ad7869fa2afe02f15f1cd2/bin/containerd-shim-runc-v2 -namespace k8s.io -id 04cd40ea6b6078797f177c902c89412c70e523ad2a687a62829bf1d16ff0e19c -address /run/k3s/containerd/containerd.sock root 4647 1 0 13:28 ? 00:00:00 /var/lib/rancher/k3s/data/577968fa3d58539cc4265245941b7be688833e6bf5ad7869fa2afe02f15f1cd2/bin/containerd-shim-runc-v2 -namespace k8s.io -id 48f37a480315b6adce2d2a5c5d67a85412dd0ba7a2e82816434e0deb9fa75de9 -address /run/k3s/containerd/containerd.sock root 6610 1 0 13:47 ? 00:00:00 /var/lib/rancher/k3s/data/577968fa3d58539cc4265245941b7be688833e6bf5ad7869fa2afe02f15f1cd2/bin/containerd-shim-runc-v2 -namespace k8s.io -id 1cf71c22f568468055e517ab363437c0e54e45274c64024d337cc5bcce66341d -address /run/k3s/containerd/containerd.sock
```

### 1.2.13 Ensure that the admission control plugin SecurityContextDeny is set if PodSecurityPolicy is not used (Manual)

**Result:** warn

**Remediation:**
APIサーバーポッドの仕様ファイル /etc/kubernetes/manifests/kube-apiserver.yaml をコントロールプレーンノードで編集し、--enable-admission-plugins パラメータに SecurityContextDeny を含めるように設定します。ただし、PodSecurityPolicy が既に設定されている場合は除きます。
--enable-admission-plugins=...,SecurityContextDeny,...

**Audit:**

```bash
journalctl -D /var/log/journal -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep 'enable-admission-plugins'
```

**Expected Result**:

```console
'--enable-admission-plugins' has 'SecurityContextDeny' OR '--enable-admission-plugins' has 'PodSecurityPolicy'
```

**Returned Value**:

```console
Sep 13 13:26:40 k3s-123-cis-pool3-b403f678-bzdg5 k3s[1600]: time="2022-09-13T13:26:40Z" level=info msg="Running kube-apiserver --advertise-address=172.31.0.140 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --feature-gates=JobTrackingWithFinalizers=true --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```

### 1.2.14 Ensure that the admission control plugin ServiceAccount is set (Automated)

**Result:** pass

**Remediation:**
ドキュメントに従い、環境に応じて ServiceAccount オブジェクトを作成します。その後、APIサーバーポッドの仕様ファイル /etc/kubernetes/manifests/kube-apiserver.yaml をコントロールプレーンノードで編集し、--disable-admission-plugins パラメータが ServiceAccount を含まない値に設定されていることを確認します。

**Audit:**

```bash
journalctl -D /var/log/journal -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep -v grep
```

**Expected Result**:

```console
'--disable-admission-plugins' is present OR '--disable-admission-plugins' is not present
```

**Returned Value**:

```console
```
```
```markdown
Sep 13 13:26:40 k3s-123-cis-pool3-b403f678-bzdg5 k3s[1600]: time="2022-09-13T13:26:40Z" level=info msg="Running kube-apiserver --advertise-address=172.31.0.140 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --feature-gates=JobTrackingWithFinalizers=true --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```

### 1.2.15 NamespaceLifecycle アドミッションコントロールプラグインが設定されていることを確認する (自動化)


**結果:** 合格

**修正方法:**
コントロールプレーンノードの API サーバーポッド仕様ファイル /etc/kubernetes/manifests/kube-apiserver.yaml を編集し、--disable-admission-plugins パラメータを設定して NamespaceLifecycle が含まれていないことを確認します。

**監査:**

```bash
journalctl -D /var/log/journal -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep -v grep
```

**期待される結果**:

```console
'--disable-admission-plugins' が存在するか '--disable-admission-plugins' が存在しない
```

**返された値**:

```console
Sep 13 13:26:40 k3s-123-cis-pool3-b403f678-bzdg5 k3s[1600]: time="2022-09-13T13:26:40Z" level=info msg="Running kube-apiserver --advertise-address=172.31.0.140 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --feature-gates=JobTrackingWithFinalizers=true --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```

### 1.2.16 NodeRestriction アドミッションコントロールプラグインが設定されていることを確認する (自動化)


**結果:** 合格

**修正方法:**
Kubernetes のドキュメントに従い、kubelet に NodeRestriction プラグインを設定します。その後、コントロールプレーンノードの API サーバーポッド仕様ファイル /etc/kubernetes/manifests/kube-apiserver.yaml を編集し、--enable-admission-plugins パラメータに NodeRestriction を含む値を設定します。
--enable-admission-plugins=...,NodeRestriction,...

**監査:**

```bash
journalctl -D /var/log/journal -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep 'enable-admission-plugins'
```

**期待される結果**:

```console
'--enable-admission-plugins' に 'NodeRestriction' が含まれている
```

**返された値**:

```console
Sep 13 13:26:40 k3s-123-cis-pool3-b403f678-bzdg5 k3s[1600]: time="2022-09-13T13:26:40Z" level=info msg="Running kube-apiserver --advertise-address=172.31.0.140 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --feature-gates=JobTrackingWithFinalizers=true --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```

### 1.2.17 --secure-port 引数が 0 に設定されていないことを確認する (自動化)


**結果:** 合格

**修正方法:**
コントロールプレーンノードの API サーバーポッド仕様ファイル /etc/kubernetes/manifests/kube-apiserver.yaml を編集し、--secure-port パラメータを削除するか、0 以外の異なるポートに設定します。

**監査:**

```bash
journalctl -D /var/log/journal -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep 'secure-port'
```

**期待される結果**:

```console
'--secure-port' が 0 より大きいか '--secure-port' が存在しない
```

**返された値**:

```console
```
```
```markdown
Sep 13 13:26:40 k3s-123-cis-pool3-b403f678-bzdg5 k3s[1600]: time="2022-09-13T13:26:40Z" level=info msg="Running kube-apiserver --advertise-address=172.31.0.140 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --feature-gates=JobTrackingWithFinalizers=true --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```

### 1.2.18 --profiling 引数が false に設定されていることを確認する (自動化)

**結果:** 合格

**修正方法:**
コントロールプレーンノードの /etc/kubernetes/manifests/kube-apiserver.yaml ファイルを編集し、以下のパラメータを設定します。
--profiling=false

**監査:**

```bash
journalctl -D /var/log/journal -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep 'profiling'
```

**期待される結果**:

```console
'--profiling' が 'false' に等しい
```

**返された値**:

```console
Sep 13 13:26:40 k3s-123-cis-pool3-b403f678-bzdg5 k3s[1600]: time="2022-09-13T13:26:40Z" level=info msg="Running kube-apiserver --advertise-address=172.31.0.140 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --feature-gates=JobTrackingWithFinalizers=true --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```

### 1.2.19 --audit-log-path 引数が設定されていることを確認する (自動化)

**結果:** 該当なし

**修正方法:**
コントロールプレーンノードの /etc/kubernetes/manifests/kube-apiserver.yaml ファイルを編集し、--audit-log-path パラメータを適切なパスとファイルに設定します。例えば、
--audit-log-path=/var/log/apiserver/audit.log

### 1.2.20 --audit-log-maxage 引数が 30 または適切な値に設定されていることを確認する (自動化)

**結果:** 該当なし

**修正方法:**
コントロールプレーンノードの /etc/kubernetes/manifests/kube-apiserver.yaml ファイルを編集し、--audit-log-maxage パラメータを 30 または適切な日数に設定します。例えば、
--audit-log-maxage=30

### 1.2.21 --audit-log-maxbackup 引数が 10 または適切な値に設定されていることを確認する (自動化)

**結果:** 該当なし

**修正方法:**
コントロールプレーンノードの /etc/kubernetes/manifests/kube-apiserver.yaml ファイルを編集し、--audit-log-maxbackup パラメータを 10 または適切な値に設定します。例えば、
--audit-log-maxbackup=10

### 1.2.22 --audit-log-maxsize 引数が 100 または適切な値に設定されていることを確認する (自動化)

**結果:** 該当なし

**修正方法:**
コントロールプレーンノードの /etc/kubernetes/manifests/kube-apiserver.yaml ファイルを編集し、--audit-log-maxsize パラメータを適切なサイズ（MB単位）に設定します。例えば、100 MB に設定する場合、
--audit-log-maxsize=100

### 1.2.24 --service-account-lookup 引数が true に設定されていることを確認する (自動化)

**結果:** 合格

**修正方法:**
コントロールプレーンノードの /etc/kubernetes/manifests/kube-apiserver.yaml ファイルを編集し、以下のパラメータを設定します。
--service-account-lookup=true
または、このファイルから --service-account-lookup パラメータを削除してデフォルトを有効にします。

**監査:**

```bash
journalctl -D /var/log/journal -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep -v grep
```

**期待される結果**:

```console
'--service-account-lookup' が存在しない、または '--service-account-lookup' が存在する
```

**返された値**:

```console
Sep 13 13:26:40 k3s-123-cis-pool3-b403f678-bzdg5 k3s[1600]: time="2022-09-13T13:26:40Z" level=info msg="Running kube-apiserver --advertise-address=172.31.0.140 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --feature-gates=JobTrackingWithFinalizers=true --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```

### 1.2.25 --request-timeout 引数が適切に設定されていることを確認する (自動化)

**結果:** 該当なし

**修正方法:**
コントロールプレーンノードの /etc/kubernetes/manifests/kube-apiserver.yaml ファイルを編集し、--service-account-key-file パラメータをサービスアカウントの公開鍵ファイルに設定します。例えば、
`--service-account-key-file=<filename>`。

### 1.2.26 --etcd-certfile および --etcd-keyfile 引数が適切に設定されていることを確認する (自動化)

**結果:** 合格

**修正方法:**
Kubernetes のドキュメントに従って、apiserver と etcd 間の TLS 接続を設定します。その後、コントロールプレーンノードの /etc/kubernetes/manifests/kube-apiserver.yaml ファイルを編集し、etcd 証明書および鍵ファイルのパラメータを設定します。
```
--etcd-certfile=<path/to/client-certificate-file>
--etcd-keyfile=<path/to/client-key-file>
```
```
**監査スクリプト:** `check_for_k3s_etcd.sh`

```bash
#!/bin/bash

# このスクリプトは、k3sが実際にetcdを実行していること（sqlite3などの他のデータベースではないこと）を確認するために使用されます。
# 要件を確認する前に
set -eE

handle_error() {
    echo "false"
}

trap 'handle_error' ERR


if [[ "$(journalctl -D /var/log/journal -u k3s | grep 'Managed etcd cluster initializing' | grep -v grep | wc -l)" -gt 0 ]]; then
    case $1 in 
        "1.1.11")
            echo $(stat -c %a /var/lib/rancher/k3s/server/db/etcd);;
        "1.2.29")
            echo $(journalctl -D /var/log/journal -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep 'etcd-');;
        "2.1")
            echo $(grep -A 5 'client-transport-security' /var/lib/rancher/k3s/server/db/etcd/config | grep -E 'cert-file|key-file');;
        "2.2")
            echo $(grep -A 5 'client-transport-security' /var/lib/rancher/k3s/server/db/etcd/config | grep 'client-cert-auth');;
        "2.3")
            echo $(grep 'auto-tls' /var/lib/rancher/k3s/server/db/etcd/config);;
        "2.4")
            echo $(grep -A 5 'peer-transport-security' /var/lib/rancher/k3s/server/db/etcd/config | grep -E 'cert-file|key-file');;
        "2.5")
            echo $(grep -A 5 'peer-transport-security' /var/lib/rancher/k3s/server/db/etcd/config | grep 'client-cert-auth');;
        "2.6")
            echo $(grep 'peer-auto-tls' /var/lib/rancher/k3s/server/db/etcd/config);;
        "2.7")
            echo $(grep 'trusted-ca-file' /var/lib/rancher/k3s/server/db/etcd/config);;
    esac
else
# 別のデータベースが実行されている場合、スキャンを通過するために必要なものを返します
    case $1 in
        "1.1.11")
            echo "700";;
        "1.2.29")
            echo "--etcd-certfile AND --etcd-keyfile";;
        "2.1")
            echo "cert-file AND key-file";;
        "2.2")
            echo "--client-cert-auth=true";;
        "2.3")
            echo "false";;
        "2.4")
            echo "peer-cert-file AND peer-key-file";;
        "2.5")
            echo "--client-cert-auth=true";;
        "2.6")
            echo "--peer-auto-tls=false";;
        "2.7")
            echo "--trusted-ca-file";;
    esac
fi

```

**監査実行:**

```bash
./check_for_k3s_etcd.sh 1.2.29
```

**期待される結果**:

```console
'--etcd-certfile' が存在し、'--etcd-keyfile' が存在する
```

**返された値**:

```console
--etcd-certfile AND --etcd-keyfile
```

### 1.2.27 `--tls-cert-file` および `--tls-private-key-file` 引数が適切に設定されていることを確認する (自動化)


**結果:** 合格

**修正方法:**
Kubernetesのドキュメントに従い、apiserverでTLS接続を設定します。
次に、コントロールプレーンノードのAPIサーバーポッド仕様ファイル `/etc/kubernetes/manifests/kube-apiserver.yaml` を編集し、TLS証明書および秘密鍵ファイルのパラメータを設定します。
```
--tls-cert-file=<path/to/tls-certificate-file>
--tls-private-key-file=<path/to/tls-key-file>
```

**監査:**

```bash
journalctl -D /var/log/journal -u k3s | grep -A1 'Running kube-apiserver' | tail -n2
```

**期待される結果**:

```console
'--tls-cert-file' が存在し、'--tls-private-key-file' が存在する
```

**返された値**:

```console
Sep 13 13:26:40 k3s-123-cis-pool3-b403f678-bzdg5 k3s[1600]: time="2022-09-13T13:26:40Z" level=info msg="Running kube-apiserver --advertise-address=172.31.0.140 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --feature-gates=JobTrackingWithFinalizers=true --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key" Sep 13 13:26:40 k3s-123-cis-pool3-b403f678-bzdg5 k3s[1600]: time="2022-09-13T13:26:40Z" level=info msg="Running kube-scheduler --authentication-kubeconfig=/var/lib/rancher/k3s/server/cred/scheduler.kubeconfig --authorization-kubeconfig=/var/lib/rancher/k3s/server/cred/scheduler.kubeconfig --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/kube-scheduler --kubeconfig=/var/lib/rancher/k3s/server/cred/scheduler.kubeconfig --profiling=false --secure-port=10259"
```

### 1.2.28 `--client-ca-file` 引数が適切に設定されていることを確認する (自動化)


**結果:** 合格

**修正方法:**
Kubernetesのドキュメントに従い、apiserverでTLS接続を設定します。
次に、コントロールプレーンノードのAPIサーバーポッド仕様ファイル `/etc/kubernetes/manifests/kube-apiserver.yaml` を編集し、クライアント証明書認証局ファイルを設定します。
`--client-ca-file=<path/to/client-ca-file>`

**監査:**

```bash
journalctl -D /var/log/journal -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep 'client-ca-file'
```

**期待される結果**:

```console
'--client-ca-file' が存在する
```

**返された値**:

```console
Sep 13 13:26:40 k3s-123-cis-pool3-b403f678-bzdg5 k3s[1600]: time="2022-09-13T13:26:40Z" level=info msg="Running kube-apiserver --advertise-address=172.31.0.140 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --feature-gates=JobTrackingWithFinalizers=true --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```

### 1.2.29 `--etcd-cafile` 引数が適切に設定されていることを確認する (自動化)


**結果:** 合格

**修正方法:**
Kubernetesのドキュメントに従い、apiserverとetcd間のTLS接続を設定します。
次に、コントロールプレーンノードのAPIサーバーポッド仕様ファイル `/etc/kubernetes/manifests/kube-apiserver.yaml` を編集し、etcd証明書認証局ファイルのパラメータを設定します。
`--etcd-cafile=<path/to/ca-file>`

**監査:**

```bash
journalctl -D /var/log/journal -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep 'etcd-cafile'
```

**期待される結果**:

```console
'--etcd-cafile' が存在する
```

**返された値**:

```console
```
```markdown
Sep 13 13:26:40 k3s-123-cis-pool3-b403f678-bzdg5 k3s[1600]: time="2022-09-13T13:26:40Z" level=info msg="Running kube-apiserver --advertise-address=172.31.0.140 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --feature-gates=JobTrackingWithFinalizers=true --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```

### 1.2.30 Ensure that the --encryption-provider-config argument is set as appropriate (Manual)

**Result:** warn

**Remediation:**
Follow the Kubernetes documentation and configure a EncryptionConfig file.
Then, edit the API server pod specification file /etc/kubernetes/manifests/kube-apiserver.yaml
on the control plane node and set the --encryption-provider-config parameter to the path of that file.
For example, `--encryption-provider-config=</path/to/EncryptionConfig/File>`

**Audit:**

```bash
journalctl -D /var/log/journal -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep 'encryption-provider-config'
```

### 1.2.31 Ensure that encryption providers are appropriately configured (Manual)

**Result:** warn

**Remediation:**
Follow the Kubernetes documentation and configure a EncryptionConfig file.
In this file, choose aescbc, kms or secretbox as the encryption provider.

**Audit:**

```bash
grep aescbc /path/to/encryption-config.json
```

### 1.2.32 Ensure that the API Server only makes use of Strong Cryptographic Ciphers (Manual)

**Result:** warn

**Remediation:**
Edit the API server pod specification file /etc/kubernetes/manifests/kube-apiserver.yaml
on the control plane node and set the below parameter.
--tls-cipher-suites=TLS_AES_128_GCM_SHA256,TLS_AES_256_GCM_SHA384,TLS_CHACHA20_POLY1305_SHA256,
TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,
TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA,TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,
TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256,
TLS_ECDHE_RSA_WITH_3DES_EDE_CBC_SHA,TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,
TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305,
TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256,TLS_RSA_WITH_3DES_EDE_CBC_SHA,TLS_RSA_WITH_AES_128_CBC_SHA,
TLS_RSA_WITH_AES_128_GCM_SHA256,TLS_RSA_WITH_AES_256_CBC_SHA,TLS_RSA_WITH_AES_256_GCM_SHA384

**Audit:**

```bash
journalctl -D /var/log/journal -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep 'tls-cipher-suites'
```

## 1.3 Controller Manager
### 1.3.1 Ensure that the --terminated-pod-gc-threshold argument is set as appropriate (Manual)

**Result:** warn

**Remediation:**
Edit the Controller Manager pod specification file /etc/kubernetes/manifests/kube-controller-manager.yaml
on the control plane node and set the --terminated-pod-gc-threshold to an appropriate threshold,
for example, --terminated-pod-gc-threshold=10

**Audit:**

```bash
journalctl -D /var/log/journal -u k3s | grep 'Running kube-controller-manager' | tail -n1 | grep 'terminated-pod-gc-threshold'
```

### 1.3.2 Ensure that the --profiling argument is set to false (Automated)

**Result:** pass

**Remediation:**
Edit the Controller Manager pod specification file /etc/kubernetes/manifests/kube-controller-manager.yaml
on the control plane node and set the below parameter.
--profiling=false

**Audit:**

```bash
journalctl -D /var/log/journal -u k3s | grep 'Running kube-controller-manager' | tail -n1 | grep 'profiling'
```

**Expected Result**:

```console
'--profiling' is equal to 'false'
```

**Returned Value**:

```console
Sep 13 13:26:40 k3s-123-cis-pool3-b403f678-bzdg5 k3s[1600]: time="2022-09-13T13:26:40Z" level=info msg="Running kube-controller-manager --allocate-node-cidrs=true --authentication-kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --authorization-kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/kube-controller-manager --cluster-cidr=10.42.0.0/16 --cluster-signing-kube-apiserver-client-cert-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --cluster-signing-kube-apiserver-client-key-file=/var/lib/rancher/k3s/server/tls/client-ca.key --cluster-signing-kubelet-client-cert-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --cluster-signing-kubelet-client-key-file=/var/lib/rancher/k3s/server/tls/client-ca.key --cluster-signing-kubelet-serving-cert-file=/var/lib/rancher/k3s/server/tls/server-ca.crt --cluster-signing-kubelet-serving-key-file=/var/lib/rancher/k3s/server/tls/server-ca.key --cluster-signing-legacy-unknown-cert-file=/var/lib/rancher/k3s/server/tls/server-ca.crt --cluster-signing-legacy-unknown-key-file=/var/lib/rancher/k3s/server/tls/server-ca.key --configure-cloud-routes=false --controllers=*,-service,-route,-cloud-node-lifecycle --feature-gates=JobTrackingWithFinalizers=true --kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --profiling=false --root-ca-file=/var/lib/rancher/k3s/server/tls/server-ca.crt --secure-port=10257 --service-account-private-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-cluster-ip-range=10.43.0.0/16 --use-service-account-credentials=true"
```

### 1.3.3 Ensure that the --use-service-account-credentials argument is set to true (Automated)

**Result:** pass

**Remediation:**
Edit the Controller Manager pod specification file /etc/kubernetes/manifests/kube-controller-manager.yaml
on the control plane node to set the below parameter.
--use-service-account-credentials=true

**Audit:**

```bash
journalctl -D /var/log/journal -u k3s | grep 'Running kube-controller-manager' | tail -n1 | grep 'use-service-account-credentials'
```

**Expected Result**:

```console
'--use-service-account-credentials' is not equal to 'false'
```

**Returned Value**:

```console
Sep 13 13:26:40 k3s-123-cis-pool3-b403f678-bzdg5 k3s[1600]: time="2022-09-13T13:26:40Z" level=info msg="Running kube-controller-manager --allocate-node-cidrs=true --authentication-kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --authorization-kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/kube-controller-manager --cluster-cidr=10.42.0.0/16 --cluster-signing-kube-apiserver-client-cert-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --cluster-signing-kube-apiserver-client-key-file=/var/lib/rancher/k3s/server/tls/client-ca.key --cluster-signing-kubelet-client-cert-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --cluster-signing-kubelet-client-key-file=/var/lib/rancher/k3s/server/tls/client-ca.key --cluster-signing-kubelet-serving-cert-file=/var/lib/rancher/k3s/server/tls/server-ca.crt --cluster-signing-kubelet-serving-key-file=/var/lib/rancher/k3s/server/tls/server-ca.key --cluster-signing-legacy-unknown-cert-file=/var/lib/rancher/k3s/server/tls/server-ca.crt --cluster-signing-legacy-unknown-key-file=/var/lib/rancher/k3s/server/tls/server-ca.key --configure-cloud-routes=false --controllers=*,-service,-route,-cloud-node-lifecycle --feature-gates=JobTrackingWithFinalizers=true --kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --profiling=false --root-ca-file=/var/lib/rancher/k3s/server/tls/server-ca.crt --secure-port=10257 --service-account-private-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-cluster-ip-range=10.43.0.0/16 --use-service-account-credentials=true"
```

### 1.3.4 Ensure that the --service-account-private-key-file argument is set as appropriate (Automated)

**Result:** pass

**Remediation:**
Edit the Controller Manager pod specification file /etc/kubernetes/manifests/kube-controller-manager.yaml
on the control plane node and set the --service-account-private-key-file parameter
to the private key file for service accounts. For example,
`--service-account-private-key-file=<filename>`.

**Audit:**

```bash
journalctl -D /var/log/journal -u k3s | grep 'Running kube-controller-manager' | tail -n1 | grep 'service-account-private-key-file'
```

**Expected Result**:

```console
'--service-account-private-key-file' is present
```

**Returned Value**:

```console
```
```markdown

### 1.2.30 適切に設定された --encryption-provider-config 引数を確認する (手動)

**結果:** 警告

**修正方法:**
Kubernetesのドキュメントに従い、EncryptionConfigファイルを設定します。
次に、コントロールプレーンノードのAPIサーバーポッド仕様ファイル /etc/kubernetes/manifests/kube-apiserver.yaml を編集し、
--encryption-provider-config パラメータをそのファイルのパスに設定します。
例: `--encryption-provider-config=</path/to/EncryptionConfig/File>`

**監査:**

```bash
journalctl -D /var/log/journal -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep 'encryption-provider-config'
```

### 1.2.31 適切に設定された暗号化プロバイダーを確認する (手動)

**結果:** 警告

**修正方法:**
Kubernetesのドキュメントに従い、EncryptionConfigファイルを設定します。
このファイルで、暗号化プロバイダーとしてaescbc、kms、またはsecretboxを選択します。

**監査:**

```bash
grep aescbc /path/to/encryption-config.json
```

### 1.2.32 APIサーバーが強力な暗号化スイートのみを使用していることを確認する (手動)

**結果:** 警告

**修正方法:**
コントロールプレーンノードのAPIサーバーポッド仕様ファイル /etc/kubernetes/manifests/kube-apiserver.yaml を編集し、
以下のパラメータを設定します。
--tls-cipher-suites=TLS_AES_128_GCM_SHA256,TLS_AES_256_GCM_SHA384,TLS_CHACHA20_POLY1305_SHA256,
TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,
TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA,TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,
TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256,
TLS_ECDHE_RSA_WITH_3DES_EDE_CBC_SHA,TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,
TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305,
TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256,TLS_RSA_WITH_3DES_EDE_CBC_SHA,TLS_RSA_WITH_AES_128_CBC_SHA,
TLS_RSA_WITH_AES_128_GCM_SHA256,TLS_RSA_WITH_AES_256_CBC_SHA,TLS_RSA_WITH_AES_256_GCM_SHA384

**監査:**

```bash
journalctl -D /var/log/journal -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep 'tls-cipher-suites'
```

## 1.3 コントローラーマネージャー
### 1.3.1 適切に設定された --terminated-pod-gc-threshold 引数を確認する (手動)

**結果:** 警告

**修正方法:**
コントロールプレーンノードのコントローラーマネージャーポッド仕様ファイル /etc/kubernetes/manifests/kube-controller-manager.yaml を編集し、
--terminated-pod-gc-threshold を適切な閾値に設定します。
例: --terminated-pod-gc-threshold=10

**監査:**

```bash
journalctl -D /var/log/journal -u k3s | grep 'Running kube-controller-manager' | tail -n1 | grep 'terminated-pod-gc-threshold'
```

### 1.3.2 --profiling 引数が false に設定されていることを確認する (自動)

**結果:** 合格

**修正方法:**
コントロールプレーンノードのコントローラーマネージャーポッド仕様ファイル /etc/kubernetes/manifests/kube-controller-manager.yaml を編集し、
以下のパラメータを設定します。
--profiling=false

**監査:**

```bash
journalctl -D /var/log/journal -u k3s | grep 'Running kube-controller-manager' | tail -n1 | grep 'profiling'
```

**期待される結果**:

```console
'--profiling' が 'false' に等しい
```

**返された値**:

```console
Sep 13 13:26:40 k3s-123-cis-pool3-b403f678-bzdg5 k3s[1600]: time="2022-09-13T13:26:40Z" level=info msg="Running kube-controller-manager --allocate-node-cidrs=true --authentication-kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --authorization-kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/kube-controller-manager --cluster-cidr=10.42.0.0/16
```markdown
Sep 13 13:26:40 k3s-123-cis-pool3-b403f678-bzdg5 k3s[1600]: time="2022-09-13T13:26:40Z" level=info msg="Running kube-controller-manager --allocate-node-cidrs=true --authentication-kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --authorization-kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/kube-controller-manager --cluster-cidr=10.42.0.0/16 --cluster-signing-kube-apiserver-client-cert-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --cluster-signing-kube-apiserver-client-key-file=/var/lib/rancher/k3s/server/tls/client-ca.key --cluster-signing-kubelet-client-cert-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --cluster-signing-kubelet-client-key-file=/var/lib/rancher/k3s/server/tls/client-ca.key --cluster-signing-kubelet-serving-cert-file=/var/lib/rancher/k3s/server/tls/server-ca.crt --cluster-signing-kubelet-serving-key-file=/var/lib/rancher/k3s/server/tls/server-ca.key --cluster-signing-legacy-unknown-cert-file=/var/lib/rancher/k3s/server/tls/server-ca.crt --cluster-signing-legacy-unknown-key-file=/var/lib/rancher/k3s/server/tls/server-ca.key --configure-cloud-routes=false --controllers=*,-service,-route,-cloud-node-lifecycle --feature-gates=JobTrackingWithFinalizers=true --kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --profiling=false --root-ca-file=/var/lib/rancher/k3s/server/tls/server-ca.crt --secure-port=10257 --service-account-private-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-cluster-ip-range=10.43.0.0/16 --use-service-account-credentials=true"
```

### 1.3.5 Ensure that the --root-ca-file argument is set as appropriate (Automated)

**Result:** pass

**Remediation:**
Edit the Controller Manager pod specification file /etc/kubernetes/manifests/kube-controller-manager.yaml
on the control plane node and set the --root-ca-file parameter to the certificate bundle file.
`--root-ca-file=<path/to/file>`

**Audit:**

```bash
journalctl -D /var/log/journal -u k3s | grep 'Running kube-controller-manager' | tail -n1 | grep 'root-ca-file'
```

**Expected Result**:

```console
'--root-ca-file' is present
```

**Returned Value**:

```console
Sep 13 13:26:40 k3s-123-cis-pool3-b403f678-bzdg5 k3s[1600]: time="2022-09-13T13:26:40Z" level=info msg="Running kube-controller-manager --allocate-node-cidrs=true --authentication-kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --authorization-kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/kube-controller-manager --cluster-cidr=10.42.0.0/16 --cluster-signing-kube-apiserver-client-cert-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --cluster-signing-kube-apiserver-client-key-file=/var/lib/rancher/k3s/server/tls/client-ca.key --cluster-signing-kubelet-client-cert-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --cluster-signing-kubelet-client-key-file=/var/lib/rancher/k3s/server/tls/client-ca.key --cluster-signing-kubelet-serving-cert-file=/var/lib/rancher/k3s/server/tls/server-ca.crt --cluster-signing-kubelet-serving-key-file=/var/lib/rancher/k3s/server/tls/server-ca.key --cluster-signing-legacy-unknown-cert-file=/var/lib/rancher/k3s/server/tls/server-ca.crt --cluster-signing-legacy-unknown-key-file=/var/lib/rancher/k3s/server/tls/server-ca.key --configure-cloud-routes=false --controllers=*,-service,-route,-cloud-node-lifecycle --feature-gates=JobTrackingWithFinalizers=true --kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --profiling=false --root-ca-file=/var/lib/rancher/k3s/server/tls/server-ca.crt --secure-port=10257 --service-account-private-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-cluster-ip-range=10.43.0.0/16 --use-service-account-credentials=true"
```

### 1.3.6 Ensure that the RotateKubeletServerCertificate argument is set to true (Automated)

**Result:** Not Applicable

**Remediation:**
Edit the Controller Manager pod specification file /etc/kubernetes/manifests/kube-controller-manager.yaml
on the control plane node and set the --feature-gates parameter to include RotateKubeletServerCertificate=true.
--feature-gates=RotateKubeletServerCertificate=true

### 1.3.7 Ensure that the --bind-address argument is set to 127.0.0.1 (Automated)

**Result:** pass

**Remediation:**
Edit the Controller Manager pod specification file /etc/kubernetes/manifests/kube-controller-manager.yaml
on the control plane node and ensure the correct value for the --bind-address parameter

**Audit:**

```bash
/bin/ps -ef | grep containerd | grep -v grep
```

**Expected Result**:

```console
'--bind-address' is present OR '--bind-address' is not present
```

**Returned Value**:

```console
root 1616 1600 6 13:26 ? 00:01:28 containerd -c /var/lib/rancher/k3s/agent/etc/containerd/config.toml -a /run/k3s/containerd/containerd.sock --state /run/k3s/containerd --root /var/lib/rancher/k3s/agent/containerd root 2318 1 0 13:27 ? 00:00:00 /var/lib/rancher/k3s/data/577968fa3d58539cc4265245941b7be688833e6bf5ad7869fa2afe02f15f1cd2/bin/containerd-shim-runc-v2 -namespace k8s.io -id b41ec3297be4625c2406ad8b7b4f8b91cddd60850c420050c4c3273f809b3e7e -address /run/k3s/containerd/containerd.sock root 2341 1 0 13:27 ? 00:00:00 /var/lib/rancher/k3s/data/577968fa3d58539cc4265245941b7be688833e6bf5ad7869fa2afe02f15f1cd2/bin/containerd-shim-runc-v2 -namespace k8s.io -id e7999a65ae0a4e9969f32317ec48ae4f7071b62f92e5236696737973be77c2e1 -address /run/k3s/containerd/containerd.sock root 3199 1 0 13:27 ? 00:00:00 /var/lib/rancher/k3s/data/577968fa3d58539cc4265245941b7be688833e6bf5ad7869fa2afe02f15f1cd2/bin/containerd-shim-runc-v2 -namespace k8s.io -id 90c4e63d6ee29d40a48c2fdaf2738c2472cba1139dde8a550466c452184f8528 -address /run/k3s/containerd/containerd.sock root 3923 1 0 13:27 ? 00:00:00 /var/lib/rancher/k3s/data/577968fa3d58539cc4265245941b7be688833e6bf5ad7869fa2afe02f15f1cd2/bin/containerd-shim-runc-v2 -namespace k8s.io -id be5f4b9bd1ed9239362b7000b47f353acb8bc8ca52a9c9145cba0e902ec1c4b9 -address /run/k3s/containerd/containerd.sock root 4559 1 0 13:28 ? 00:00:00 /var/lib/rancher/k3s/data/577968fa3d58539cc4265245941b7be688833e6bf5ad7869fa2afe02f15f1cd2/bin/containerd-shim-runc-v2 -namespace k8s.io -id 04cd40ea6b6078797f177c902c89412c70e523ad2a687a62829bf1d16ff0e19c -address /run/k3s/containerd/containerd.sock root 4647 1 0 13:28 ? 00:00:00 /var/lib/rancher/k3s/data/577968fa3d58539cc4265245941b7be688833e6bf5ad7869fa2afe02f15f1cd2/bin/containerd-shim-runc-v2 -namespace k8s.io -id 48f37a480315b6adce2d2a5c5d67a85412dd0ba7a2e82816434e0deb9fa75de9 -address /run/k3s/containerd/containerd.sock root 6610 1 0 13:47 ? 00:00:00 /var/lib/rancher/k3s/data/577968fa3d58539cc4265245941b7be688833e6bf5ad7869fa2afe02f15f1cd2/bin/containerd-shim-runc-v2 -namespace k8s.io -id 1cf71c22f568468055e517ab363437c0e54e45274c64024d337cc5bcce66341d -address /run/k3s/containerd/containerd.sock
```

## 1.4 Scheduler
### 1.4.1 Ensure that the --profiling argument is set to false (Automated)

**Result:** pass

**Remediation:**
Edit the Scheduler pod specification file /etc/kubernetes/manifests/kube-scheduler.yaml file
on the control plane node and set the below parameter.
--profiling=false

**Audit:**

```bash
journalctl -D /var/log/journal -u k3s | grep 'Running kube-scheduler' | tail -n1
```

**Expected Result**:

```console
'--profiling' is equal to 'false'
```

**Returned Value**:

```console
Sep 13 13:26:40 k3s-123-cis-pool3-b403f678-bzdg5 k3s[1600]: time="2022-09-13T13:26:40Z" level=info msg="Running kube-scheduler --authentication-kubeconfig=/var/lib/rancher/k3s/server/cred/scheduler.kubeconfig --authorization-kubeconfig=/var/lib/rancher/k3s/server/cred/scheduler.kubeconfig --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/kube-scheduler --kubeconfig=/var/lib/rancher/k3s/server/cred/scheduler.kubeconfig --profiling=false --secure-port=10259"
```

### 1.4.2 Ensure that the --bind-address argument is set to 127.0.0.1 (Automated)

**Result:** pass

**Remediation:**
Edit the Scheduler pod specification file /etc/kubernetes/manifests/kube-scheduler.yaml
on the control plane node and ensure the correct value for the --bind-address parameter

**Audit:**

```bash
journalctl -D /var/log/journal -u k3s | grep 'Running kube-scheduler' | tail -n1 | grep 'bind-address'
```

**Expected Result**:

```console
'--bind-address' is equal to '127.0.0.1' OR '--bind-address' is not present
```

**Returned Value**:

```console
Sep 13 13:26:40 k3s-123-cis-pool3-b403f678-bzdg5 k3s[1600]: time="2022-09-13T13:26:40Z" level=info msg="Running kube-scheduler --authentication-kubeconfig=/var/lib/rancher/k3s/server/cred/scheduler.kubeconfig --authorization-kubeconfig=/var/lib/rancher/k3s/server/cred/scheduler.kubeconfig --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/kube-scheduler --kubeconfig=/var/lib/rancher/k3s/server/cred/scheduler.kubeconfig --profiling=false --secure-port=10259"
```

## 2 Etcd Node Configuration
### 2.1 Ensure that the --cert-file and --key-file arguments are set as appropriate (Automated)

**Result:** pass

**Remediation:**
Follow the etcd service documentation and configure TLS encryption.
Then, edit the etcd pod specification file /etc/kubernetes/manifests/etcd.yaml
on the master node and set the below parameters.
```
--cert-file=</path/to/ca-file>
--key-file=</path/to/key-file>
```

**Audit Script:** `check_for_k3s_etcd.sh`

```bash
#!/bin/bash

# This script is used to ensure that k3s is actually running etcd (and not other databases like sqlite3)
# before it checks the requirement
set -eE

handle_error() {
    echo "false"
}

trap 'handle_error' ERR


if [[ "$(journalctl -D /var/log/journal -u k3s | grep 'Managed etcd cluster initializing' | grep -v grep | wc -l)" -gt 0 ]]; then
    case $1 in 
        "1.1.11")
            echo $(stat -c %a /var/lib/rancher/k3s/server/db/etcd);;
        "1.2.29")
            echo $(journalctl -D /var/log/journal -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep 'etcd-');;
        "2.1")
```
```
```bash
            echo "cert-file AND key-file";;
        "2.2")
            echo "--client-cert-auth=true";;
        "2.3")
            echo "false";;
        "2.4")
            echo "peer-cert-file AND peer-key-file";;
        "2.5")
            echo "--client-cert-auth=true";;
        "2.6")
            echo "--peer-auto-tls=false";;
        "2.7")
            echo "--trusted-ca-file";;
    esac
fi

```

**監査実行:**

```bash
./check_for_k3s_etcd.sh 2.1
```

**期待される結果**:

```console
'cert-file' が存在し、かつ 'key-file' が存在する
```

**返される値**:

```console
cert-file AND key-file cert-file: /var/lib/rancher/k3s/server/tls/etcd/server-client.crt key-file: /var/lib/rancher/k3s/server/tls/etcd/server-client.key cert-file AND key-file
```

### 2.2 --client-cert-auth 引数が true に設定されていることを確認する (自動化)


**結果:** 合格

**修正方法:**
マスターノードの etcd ポッド仕様ファイル /etc/kubernetes/manifests/etcd.yaml を編集し、以下のパラメータを設定します。
--client-cert-auth="true"

**監査スクリプト:** `check_for_k3s_etcd.sh`

```bash
#!/bin/bash

# このスクリプトは、k3s が実際に etcd を実行していること（sqlite3 などの他のデータベースではないこと）を確認するために使用されます
# 要件を確認する前に
set -eE

handle_error() {
    echo "false"
}

trap 'handle_error' ERR


if [[ "$(journalctl -D /var/log/journal -u k3s | grep 'Managed etcd cluster initializing' | grep -v grep | wc -l)" -gt 0 ]]; then
    case $1 in 
        "1.1.11")
            echo $(stat -c %a /var/lib/rancher/k3s/server/db/etcd);;
        "1.2.29")
            echo $(journalctl -D /var/log/journal -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep 'etcd-');;
        "2.1")
            echo $(grep -A 5 'client-transport-security' /var/lib/rancher/k3s/server/db/etcd/config | grep -E 'cert-file|key-file');;
        "2.2")
            echo $(grep -A 5 'client-transport-security' /var/lib/rancher/k3s/server/db/etcd/config | grep 'client-cert-auth');;
        "2.3")
            echo $(grep 'auto-tls' /var/lib/rancher/k3s/server/db/etcd/config);;
        "2.4")
            echo $(grep -A 5 'peer-transport-security' /var/lib/rancher/k3s/server/db/etcd/config | grep -E 'cert-file|key-file');;
        "2.5")
            echo $(grep -A 5 'peer-transport-security' /var/lib/rancher/k3s/server/db/etcd/config | grep 'client-cert-auth');;
        "2.6")
            echo $(grep 'peer-auto-tls' /var/lib/rancher/k3s/server/db/etcd/config);;
        "2.7")
            echo $(grep 'trusted-ca-file' /var/lib/rancher/k3s/server/db/etcd/config);;
    esac
else
# 別のデータベースが実行されている場合、スキャンを通過するために必要なものを返します
    case $1 in
        "1.1.11")
            echo "700";;
        "1.2.29")
            echo "--etcd-certfile AND --etcd-keyfile";;
        "2.1")
            echo "cert-file AND key-file";;
        "2.2")
            echo "--client-cert-auth=true";;
        "2.3")
            echo "false";;
        "2.4")
            echo "peer-cert-file AND peer-key-file";;
        "2.5")
            echo "--client-cert-auth=true";;
        "2.6")
            echo "--peer-auto-tls=false";;
        "2.7")
            echo "--trusted-ca-file";;
    esac
fi

```

**監査実行:**

```bash
./check_for_k3s_etcd.sh 2.2
```

**期待される結果**:

```console
'--client-cert-auth' が存在する、または 'client-cert-auth' が 'true' に等しい
```

**返される値**:

```console
--client-cert-auth=true client-cert-auth: true --client-cert-auth=true
```

### 2.3 --auto-tls 引数が true に設定されていないことを確認する (自動化)


**結果:** 合格

**修正方法:**
マスターノードの etcd ポッド仕様ファイル /etc/kubernetes/manifests/etcd.yaml を編集し、--auto-tls パラメータを削除するか、false に設定します。
 --auto-tls=false

**監査スクリプト:** `check_for_k3s_etcd.sh`

```bash
#!/bin/bash

# このスクリプトは、k3s が実際に etcd を実行していること（sqlite3 などの他のデータベースではないこと）を確認するために使用されます
# 要件を確認する前に
set -eE

handle_error() {
    echo "false"
}

trap 'handle_error' ERR


if [[ "$(journalctl -D /var/log/journal -u k3s | grep 'Managed etcd cluster initializing' | grep -v grep | wc -l)" -gt 0 ]]; then
    case $1 in 
        "1.1.11")
            echo $(stat -c %a /var/lib/rancher/k3s/server/db/etcd);;
        "1.2.29")
            echo $(journalctl -D /var/log/journal -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep 'etcd-');;
        "2.1")
            echo $(grep -A 5 'client-transport-security' /var/lib/rancher/k3s/server/db/etcd/config | grep -E 'cert-file|key-file');;
        "2.2")
            echo $(grep -A 5 'client-transport-security' /var/lib/rancher/k3s/server/db/etcd/config | grep 'client-cert-auth');;
        "2.3")
            echo $(grep 'auto-tls' /var/lib/rancher/k3s/server/db/etcd/config);;
        "2.4")
            echo $(grep -A 5 'peer-transport-security' /var/lib/rancher/k3s/server/db/etcd/config | grep -E 'cert-file|key-file');;
        "2.5")
            echo $(grep -A 5 'peer-transport-security' /var/lib/rancher/k3s/server/db/etcd/config | grep 'client-cert-auth');;
        "2.6")
            echo $(grep 'peer-auto-tls' /var/lib/rancher/k3s/server/db/etcd/config);;
        "2.7")
            echo $(grep 'trusted-ca-file' /var/lib/rancher/k3s/server/db/etcd/config);;
    esac
else
# 別のデータベースが実行されている場合、スキャンを通過するために必要なものを返します
    case $1 in
        "1.1.11")
            echo "700";;
        "1.2.29")
            echo "--etcd-certfile AND --etcd-keyfile";;
        "2.1")
            echo "cert-file AND key-file";;
        "2.2")
            echo "--client-cert-auth=true";;
        "2.3")
            echo "false";;
        "2.4")
            echo "peer-cert-file AND peer-key-file";;
        "2.5")
            echo "--client-cert-auth=true";;
        "2.6")
            echo "--peer-auto-tls=false";;
        "2.7")
            echo "--trusted-ca-file";;
    esac
fi

```

**監査実行:**

```bash
./check_for_k3s_etcd.sh 2.3
```

**期待される結果**:

```console
'ETCD_AUTO_TLS' が存在しない、または 'ETCD_AUTO_TLS' が存在する
```

**返される値**:

```console
error: process ID list syntax error Usage: ps [options] Try 'ps --help <simple|list|output|threads|misc|all>' or 'ps --help <s|l|o|t|m|a>' for additional help text. For more details see ps(1). cat: /proc//environ: No such file or directory error: process ID list syntax error Usage: ps [options] Try 'ps --help <simple|list|output|threads|misc|all>' or 'ps --help <s|l|o|t|m|a>' for additional help text. For more details see ps(1). cat: /proc//environ: No such file or directory error: process ID list syntax error Usage: ps [options] Try 'ps --help <simple|list|output|threads|misc|all>' or 'ps --help <s|l|o|t|m|a>' for additional help text. For more details see ps(1). cat: /proc//environ: No such file or directory
```

### 2.4 --peer-cert-file および --peer-key-file 引数が適切に設定されていることを確認する (自動化)


**結果:** 合格

**修正方法:**
etcd サービスのドキュメントに従い、etcd クラスターに適したピア TLS 暗号化を構成します。
次に、マスターノードの etcd ポッド仕様ファイル /etc/kubernetes/manifests/etcd.yaml を編集し、以下のパラメータを設定します。
```
--peer-client-file=</path/to/peer-cert-file>
--peer-key-file=</path/to/peer-key-file>
```

**監査スクリプト:** `check_for_k3s_etcd.sh`

```bash
#!/bin/bash

# このスクリプトは、k3s が実際に etcd を実行していること（sqlite3 などの他のデータベースではないこと）を確認するために使用されます
# 要件を確認する前に
set -eE

handle_error() {
    echo "false"
}

trap 'handle_error' ERR


if [[ "$(journalctl -D /var/log/journal -u k3s | grep 'Managed etcd cluster initializing' | grep -v grep | wc -l)" -gt 0 ]]; then
    case $1 in 
        "1.1.11")
            echo $(stat -c %a /var/lib/rancher/k3s/server/db/etcd);;
        "1.2.29")
            echo $(journalctl -D /var/log/journal -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep 'etcd-');;
        "2.1")
            echo $(grep -A 5 'client-transport-security' /var/lib/rancher/k3s/server/db/etcd/config | grep -E 'cert-file|key-file');;
        "2.2")
            echo $(grep -A 5 'client-transport-security' /var/lib/rancher/k3s/server/db/etcd/config | grep 'client-cert-auth');;
        "2.3")
            echo $(grep 'auto-tls' /var/lib/rancher/k3s/server/db/etcd/config);;
        "2.4")
            echo $(grep -A 5 'peer-transport-security' /var/lib/rancher/k3s/server/db/etcd/config | grep -E 'cert-file|key-file');;
        "2.5")
            echo $(grep -A 5 'peer-transport-security' /var/lib/rancher/k3s/server/db/etcd/config | grep 'client-cert-auth');;
        "2.6")
            echo $(grep 'peer-auto-tls' /var/lib/rancher/k3s/server/db/etcd/config);;
        "2.7")
            echo $(grep 'trusted-ca-file' /var/lib/rancher/k3s/server/db/etcd/config);;
    esac
else
# 別のデータベースが実行されている場合、スキャンを通過するために必要なものを返します
    case $1 in
        "1.1.11")
            echo "700";;
        "1.2.29")
            echo "--etcd-certfile AND --etcd-keyfile";;
        "2.1")
            echo "cert-file AND key-file";;
        "2.2")
            echo "--client-cert-auth=true";;
        "2.3")
            echo "false";;
        "2.4")
            echo "peer-cert-file AND peer-key-file";;
        "2.5")
            echo "--client-cert-auth=true";;
        "2.6")
            echo "--peer-auto-tls=false";;
        "2.7")
            echo "--trusted-ca-file";;
    esac
fi

```

**監査実行:**

```bash
./check_for_k3s_etcd.sh 2.3
```

**期待される結果**:

```console
'ETCD_AUTO_TLS' が存在しない、または 'ETCD_AUTO_TLS' が存在する
```

**返される値**:

```console
error: process ID list syntax error Usage: ps [options] Try 'ps --help <simple|list|output|threads|misc|all>' or 'ps --help <s|l|o|t|m|a>' for additional help text. For more details see ps(1). cat: /proc//environ: No such file or directory error: process ID list syntax error Usage: ps [options] Try 'ps --help <simple|list|output|threads|misc|all>' or 'ps --help <s|l|o|t|m|a>' for additional help text. For more details see ps(1). cat: /proc//environ: No such file or directory error: process ID list syntax error Usage: ps [options] Try 'ps --help <simple|list|output|threads|misc|all>' or 'ps --help <s|l|o|t|m|a>' for additional help text. For more details see ps(1). cat: /proc//environ: No such file or directory
```
```bash
            echo "cert-file AND key-file";;
        "2.2")
            echo "--client-cert-auth=true";;
        "2.3")
            echo "false";;
        "2.4")
            echo "peer-cert-file AND peer-key-file";;
        "2.5")
            echo "--client-cert-auth=true";;
        "2.6")
            echo "--peer-auto-tls=false";;
        "2.7")
            echo "--trusted-ca-file";;
    esac
fi

```

**監査実行:**

```bash
./check_for_k3s_etcd.sh 2.4
```

**期待される結果**:

```console
'cert-file' が存在し、かつ 'key-file' が存在する
```

**返される値**:

```console
peer-cert-file AND peer-key-file cert-file: /var/lib/rancher/k3s/server/tls/etcd/peer-server-client.crt key-file: /var/lib/rancher/k3s/server/tls/etcd/peer-server-client.key peer-cert-file AND peer-key-file
```

### 2.5 --peer-client-cert-auth 引数が true に設定されていることを確認する (自動化)


**結果:** 合格

**修正方法:**
マスターノードの etcd ポッド仕様ファイル /etc/kubernetes/manifests/etcd.yaml を編集し、以下のパラメータを設定します。
--peer-client-cert-auth=true

**監査スクリプト:** `check_for_k3s_etcd.sh`

```bash
#!/bin/bash

# このスクリプトは、k3s が実際に etcd を実行していること（sqlite3 などの他のデータベースではないこと）を確認するために使用されます
# 要件を確認する前に
set -eE

handle_error() {
    echo "false"
}

trap 'handle_error' ERR


if [[ "$(journalctl -D /var/log/journal -u k3s | grep 'Managed etcd cluster initializing' | grep -v grep | wc -l)" -gt 0 ]]; then
    case $1 in 
        "1.1.11")
            echo $(stat -c %a /var/lib/rancher/k3s/server/db/etcd);;
        "1.2.29")
            echo $(journalctl -D /var/log/journal -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep 'etcd-');;
        "2.1")
            echo $(grep -A 5 'client-transport-security' /var/lib/rancher/k3s/server/db/etcd/config | grep -E 'cert-file|key-file');;
        "2.2")
            echo $(grep -A 5 'client-transport-security' /var/lib/rancher/k3s/server/db/etcd/config | grep 'client-cert-auth');;
        "2.3")
            echo $(grep 'auto-tls' /var/lib/rancher/k3s/server/db/etcd/config);;
        "2.4")
            echo $(grep -A 5 'peer-transport-security' /var/lib/rancher/k3s/server/db/etcd/config | grep -E 'cert-file|key-file');;
        "2.5")
            echo $(grep -A 5 'peer-transport-security' /var/lib/rancher/k3s/server/db/etcd/config | grep 'client-cert-auth');;
        "2.6")
            echo $(grep 'peer-auto-tls' /var/lib/rancher/k3s/server/db/etcd/config);;
        "2.7")
            echo $(grep 'trusted-ca-file' /var/lib/rancher/k3s/server/db/etcd/config);;
    esac
else
# 別のデータベースが実行されている場合、スキャンをパスするために必要なものを返します
    case $1 in
        "1.1.11")
            echo "700";;
        "1.2.29")
            echo "--etcd-certfile AND --etcd-keyfile";;
        "2.1")
            echo "cert-file AND key-file";;
        "2.2")
            echo "--client-cert-auth=true";;
        "2.3")
            echo "false";;
        "2.4")
            echo "peer-cert-file AND peer-key-file";;
        "2.5")
            echo "--client-cert-auth=true";;
        "2.6")
            echo "--peer-auto-tls=false";;
        "2.7")
            echo "--trusted-ca-file";;
    esac
fi

```

**監査実行:**

```bash
./check_for_k3s_etcd.sh 2.5
```

**期待される結果**:

```console
'--client-cert-auth' が存在する、または 'client-cert-auth' が 'true' と等しい
```

**返される値**:

```console
--client-cert-auth=true client-cert-auth: true --client-cert-auth=true
```

### 2.6 --peer-auto-tls 引数が true に設定されていないことを確認する (自動化)


**結果:** 合格

**修正方法:**
マスターノードの etcd ポッド仕様ファイル /etc/kubernetes/manifests/etcd.yaml を編集し、--peer-auto-tls パラメータを削除するか、false に設定します。
--peer-auto-tls=false

**監査スクリプト:** `check_for_k3s_etcd.sh`

```bash
#!/bin/bash

# このスクリプトは、k3s が実際に etcd を実行していること（sqlite3 などの他のデータベースではないこと）を確認するために使用されます
# 要件を確認する前に
set -eE

handle_error() {
    echo "false"
}

trap 'handle_error' ERR


if [[ "$(journalctl -D /var/log/journal -u k3s | grep 'Managed etcd cluster initializing' | grep -v grep | wc -l)" -gt 0 ]]; then
    case $1 in 
        "1.1.11")
            echo $(stat -c %a /var/lib/rancher/k3s/server/db/etcd);;
        "1.2.29")
            echo $(journalctl -D /var/log/journal -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep 'etcd-');;
        "2.1")
            echo $(grep -A 5 'client-transport-security' /var/lib/rancher/k3s/server/db/etcd/config | grep -E 'cert-file|key-file');;
        "2.2")
            echo $(grep -A 5 'client-transport-security' /var/lib/rancher/k3s/server/db/etcd/config | grep 'client-cert-auth');;
        "2.3")
            echo $(grep 'auto-tls' /var/lib/rancher/k3s/server/db/etcd/config);;
        "2.4")
            echo $(grep -A 5 'peer-transport-security' /var/lib/rancher/k3s/server/db/etcd/config | grep -E 'cert-file|key-file');;
        "2.5")
            echo $(grep -A 5 'peer-transport-security' /var/lib/rancher/k3s/server/db/etcd/config | grep 'client-cert-auth');;
        "2.6")
            echo $(grep 'peer-auto-tls' /var/lib/rancher/k3s/server/db/etcd/config);;
        "2.7")
            echo $(grep 'trusted-ca-file' /var/lib/rancher/k3s/server/db/etcd/config);;
    esac
else
# 別のデータベースが実行されている場合、スキャンをパスするために必要なものを返します
    case $1 in
        "1.1.11")
            echo "700";;
        "1.2.29")
            echo "--etcd-certfile AND --etcd-keyfile";;
        "2.1")
            echo "cert-file AND key-file";;
        "2.2")
            echo "--client-cert-auth=true";;
        "2.3")
            echo "false";;
        "2.4")
            echo "peer-cert-file AND peer-key-file";;
        "2.5")
            echo "--client-cert-auth=true";;
        "2.6")
            echo "--peer-auto-tls=false";;
        "2.7")
            echo "--trusted-ca-file";;
    esac
fi

```

**監査実行:**

```bash
./check_for_k3s_etcd.sh 2.6
```

**期待される結果**:

```console
'--peer-auto-tls' が存在しない、または '--peer-auto-tls' が 'false' と等しい
```

**返される値**:

```console
--peer-auto-tls=false error: process ID list syntax error Usage: ps [options] Try 'ps --help <simple|list|output|threads|misc|all>' or 'ps --help <s|l|o|t|m|a>' for additional help text. For more details see ps(1). cat: /proc//environ: No such file or directory --peer-auto-tls=false
```

### 2.7 etcd に対して一意の証明書認証局が使用されていることを確認する (手動)


**結果:** 合格

**修正方法:**
[手動テスト]
etcd のドキュメントに従い、etcd サービス用の専用証明書認証局セットアップを作成します。
その後、マスターノードの etcd ポッド仕様ファイル /etc/kubernetes/manifests/etcd.yaml を編集し、以下のパラメータを設定します。
`--trusted-ca-file=</path/to/ca-file>`

**監査スクリプト:** `check_for_k3s_etcd.sh`

```bash
#!/bin/bash

# このスクリプトは、k3s が実際に etcd を実行していること（sqlite3 などの他のデータベースではないこと）を確認するために使用されます
# 要件を確認する前に
set -eE

handle_error() {
    echo "false"
}

trap 'handle_error' ERR


if [[ "$(journalctl -D /var/log/journal -u k3s | grep 'Managed etcd cluster initializing' | grep -v grep | wc -l)" -gt 0 ]]; then
    case $1 in 
        "1.1.11")
            echo $(stat -c %a /var/lib/rancher/k3s/server/db/etcd);;
        "1.2.29")
            echo $(journalctl -D /var/log/journal -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep 'etcd-');;
        "2.1")
            echo $(grep -A 5 'client-transport-security' /var/lib/rancher/k3s/server/db/etcd/config | grep -E 'cert-file|key-file');;
        "2.2")
            echo $(grep -A 5 'client-transport-security' /var/lib/rancher/k3s/server/db/etcd/config | grep 'client-cert-auth');;
        "2.3")
            echo $(grep 'auto-tls' /var/lib/rancher/k3s/server/db/etcd/config);;
        "2.4")
            echo $(grep -A 5 'peer-transport-security' /var/lib/rancher/k3s/server/db/etcd/config | grep -E 'cert-file|key-file');;
        "2.5")
            echo $(grep -A 5 'peer-transport-security' /var/lib/rancher/k3s/server/db/etcd/config | grep 'client-cert-auth');;
        "2.6")
            echo $(grep 'peer-auto-tls' /var/lib/rancher/k3s/server/db/etcd/config);;
        "2.7")
            echo $(grep 'trusted-ca-file' /var/lib/rancher/k3s/server/db/etcd/config);;
    esac
else
# 別のデータベースが実行されている場合、スキャンをパスするために必要なものを返します
    case $1 in
        "1.1.11")
            echo "700";;
        "1.2.29")
            echo "--etcd-certfile AND --etcd-keyfile";;
        "2.1")
            echo "cert-file AND key-file";;
        "2.2")
            echo "--client-cert-auth=true";;
        "2.3")
            echo "false";;
        "2.4")
            echo "peer-cert-file AND peer-key-file";;
        "2.5")
            echo "--client-cert-auth=true";;
        "2.6")
            echo "--peer-auto-tls=false";;
        "2.7")
            echo "--trusted-ca-file";;
    esac
fi

```

**監査実行:**

```bash
./check_for_k3s_etcd.sh 2.7
```

**期待される結果**:

```console
'trusted-ca-file' が存在する
```

**返される値**:

```console
--trusted-ca-file trusted-ca-file: /var/lib/rancher/k3s/server/tls/etcd/server-ca.crt trusted-ca-file: /var/lib/rancher/k3s/server/tls/etcd/peer-ca.crt --trusted-ca-file
```

## 3.1 認証と認可
### 3.1.1 クライアント証明書認証はユーザーに対して使用されるべきではない (手動)


**結果:** 警告

**修正方法:**
クライアント証明書の代わりに、OIDC の使用など Kubernetes が提供する代替メカニズムを実装するべきです。

## 3.2 ロギング
### 3.2.1 最小限の監査ポリシーが作成されていることを確認する (手動)


**結果:** 警告

**修正方法:**
クラスター用の監査ポリシーファイルを作成します。

**監査:**

```bash
journalctl -D /var/log/journal -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep 'audit-policy-file'
```

### 3.2.2 監査ポリシーが主要なセキュリティ問題をカバーしていることを確認する (手動)


**結果:** 警告

**修正方法:**
クラスターに提供される監査ポリシーを確認し、少なくとも以下の領域をカバーしていることを確認します。
```
- クラスターによって管理されるSecretsへのアクセス。Secrets、ConfigMaps、およびTokenReviewsへのリクエストのメタデータのみをログに記録するように注意し、機密データのログ記録のリスクを避ける。
- PodおよびDeploymentオブジェクトの変更。
- `pods/exec`、`pods/portforward`、`pods/proxy`、および`services/proxy`の使用。
ほとんどのリクエストに対して、最低限メタデータレベルでのログ記録が推奨される（最も基本的なログ記録レベル）。

## 4.1 ワーカーノードの構成ファイル
### 4.1.1 kubeletサービスファイルのパーミッションが644またはそれ以上に制限されていることを確認する（自動化）


**結果:** 該当なし

**修正方法:**
各ワーカーノードで以下のコマンドを実行します（システム上のファイルの場所に基づく）。
例: chmod 644 /etc/systemd/system/kubelet.service.d/10-kubeadm.conf

### 4.1.2 kubeletサービスファイルの所有者がroot:rootに設定されていることを確認する（自動化）


**結果:** 該当なし

**修正方法:**
各ワーカーノードで以下のコマンドを実行します（システム上のファイルの場所に基づく）。
例:
chown root:root /etc/systemd/system/kubelet.service.d/10-kubeadm.conf

### 4.1.3 プロキシkubeconfigファイルが存在する場合、パーミッションが644またはそれ以上に制限されていることを確認する（手動）


**結果:** 合格

**修正方法:**
各ワーカーノードで以下のコマンドを実行します（システム上のファイルの場所に基づく）。
例:
chmod 644 /var/lib/rancher/k3s/agent/kubeproxy.kubeconfig

**監査:**

```bash
stat -c %a /var/lib/rancher/k3s/agent/kubeproxy.kubeconfig
```

**期待される結果**:

```console
'permissions'が存在する または '/var/lib/rancher/k3s/agent/kubeproxy.kubeconfig'が存在しない
```

**返される値**:

```console
644 644
```

### 4.1.4 プロキシkubeconfigファイルが存在する場合、所有者がroot:rootに設定されていることを確認する（手動）


**結果:** 合格

**修正方法:**
各ワーカーノードで以下のコマンドを実行します（システム上のファイルの場所に基づく）。
例: chown root:root /var/lib/rancher/k3s/agent/kubeproxy.kubeconfig

**監査:**

```bash
/bin/sh -c 'if test -e /var/lib/rancher/k3s/agent/kubeproxy.kubeconfig; then stat -c %U:%G /var/lib/rancher/k3s/agent/kubeproxy.kubeconfig; fi'
```

**期待される結果**:

```console
'root:root'が存在する または '/var/lib/rancher/k3s/agent/kubeproxy.kubeconfig'が存在しない
```

**返される値**:

```console
root:root root:root
```

### 4.1.5 --kubeconfig kubelet.confファイルのパーミッションが644またはそれ以上に制限されていることを確認する（自動化）


**結果:** 合格

**修正方法:**
各ワーカーノードで以下のコマンドを実行します（システム上のファイルの場所に基づく）。
例:
chmod 644 /var/lib/rancher/k3s/server/cred/admin.kubeconfig

**監査:**

```bash
stat -c %a /var/lib/rancher/k3s/agent/kubelet.kubeconfig
```

**期待される結果**:

```console
'644'が'644'と等しい
```

**返される値**:

```console
644 644
```

### 4.1.6 --kubeconfig kubelet.confファイルの所有者がroot:rootに設定されていることを確認する（自動化）


**結果:** 合格

**修正方法:**
各ワーカーノードで以下のコマンドを実行します（システム上のファイルの場所に基づく）。
例:
chown root:root /var/lib/rancher/k3s/server/cred/admin.kubeconfig

**監査:**

```bash
stat -c %U:%G /var/lib/rancher/k3s/agent/kubelet.kubeconfig
```

**期待される結果**:

```console
'root:root'が'root:root'と等しい
```

**返される値**:

```console
root:root root:root
```

### 4.1.7 証明書認証局ファイルのパーミッションが644またはそれ以上に制限されていることを確認する（手動）


**結果:** 合格

**修正方法:**
--client-ca-fileのファイルパーミッションを変更するために以下のコマンドを実行します: `chmod 644 <filename>`

**監査:**

```bash
stat -c %a /var/lib/rancher/k3s/server/tls/server-ca.crt
```

**期待される結果**:

```console
'644'が存在する または '640'が存在する または '600'が'600'と等しい または '444'が存在する または '440'が存在する または '400'が存在する または '000'が存在する
```

**返される値**:

```console
644 600
```

### 4.1.8 クライアント証明書認証局ファイルの所有者がroot:rootに設定されていることを確認する（手動）


**結果:** 合格

**修正方法:**
--client-ca-fileの所有者を変更するために以下のコマンドを実行します:
`chown root:root <filename>`.

**監査:**

```bash
stat -c %U:%G /var/lib/rancher/k3s/server/tls/client-ca.crt
```

**期待される結果**:

```console
'root:root'が'root:root'と等しい
```

**返される値**:

```console
root:root root:root
```

### 4.1.9 kubelet --config構成ファイルのパーミッションが644またはそれ以上に制限されていることを確認する（自動化）


**結果:** 該当なし

**修正方法:**
監査ステップで特定された構成ファイルの場所を使用して以下のコマンドを実行します
chmod 644 /var/lib/kubelet/config.yaml

### 4.1.10 kubelet --config構成ファイルの所有者がroot:rootに設定されていることを確認する（自動化）


**結果:** 該当なし

**修正方法:**
監査ステップで特定された構成ファイルの場所を使用して以下のコマンドを実行します
chown root:root /var/lib/kubelet/config.yaml

## 4.2 Kubelet
### 4.2.1 --anonymous-auth引数がfalseに設定されていることを確認する（自動化）


**結果:** 合格

**修正方法:**
Kubelet構成ファイルを使用している場合、ファイルを編集して`authentication: anonymous: enabled`を`false`に設定します。
実行可能な引数を使用している場合、各ワーカーノードのkubeletサービスファイル
/etc/systemd/system/kubelet.service.d/10-kubeadm.confを編集し、以下のパラメータをKUBELET_SYSTEM_PODS_ARGS変数に設定します。
`--anonymous-auth=false`
システムに基づいて、kubeletサービスを再起動します。例:
systemctl daemon-reload
systemctl restart kubelet.service

**監査:**

```bash
/bin/sh -c 'if test $(journalctl -D /var/log/journal -u k3s | grep "Running kube-apiserver" | wc -l) -gt 0; then journalctl -D /var/log/journal -u k3s | grep "Running kube-apiserver" | tail -n1 | grep "anonymous-auth" | grep -v grep; else echo "--anonymous-auth=false"; fi'
```

**期待される結果**:

```console
'--anonymous-auth'が'false'と等しい
```

**返される値**:

```console
--anonymous-auth=false Sep 13 13:26:40 k3s-123-cis-pool3-b403f678-bzdg5 k3s[1600]: time="2022-09-13T13:26:40Z" level=info msg="Running kube-apiserver --advertise-address=172.31.0.140 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --feature-gates=JobTrackingWithFinalizers=true --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```

### 4.2.2 --authorization-mode引数がAlwaysAllowに設定されていないことを確認する（自動化）


**結果:** 合格

**修正方法:**
Kubelet構成ファイルを使用している場合、ファイルを編集して`authorization.mode`をWebhookに設定します。実行可能な引数を使用している場合、各ワーカーノードのkubeletサービスファイル
/etc/systemd/system/kubelet.service.d/10-kubeadm.confを編集し、以下のパラメータをKUBELET_AUTHZ_ARGS変数に設定します。
--authorization-mode=Webhook
システムに基づいて、kubeletサービスを再起動します。例:
systemctl daemon-reload
systemctl restart kubelet.service

**監査:**

```bash
/bin/sh -c 'if test $(journalctl -D /var/log/journal -u k3s | grep "Running kube-apiserver" | wc -l) -gt 0; then journalctl -D /var/log/journal -u k3s | grep "Running kube-apiserver" | tail -n1 | grep "authorization-mode" | grep -v grep; else echo "--authorization-mode=Webhook"; fi'
```

**期待される結果**:

```console
'--authorization-mode'に'AlwaysAllow'が含まれていない
```

**返される値**:

```console

```markdown
--authorization-mode=Webhook Sep 13 13:26:40 k3s-123-cis-pool3-b403f678-bzdg5 k3s[1600]: time="2022-09-13T13:26:40Z" level=info msg="Running kube-apiserver --advertise-address=172.31.0.140 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --feature-gates=JobTrackingWithFinalizers=true --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```

### 4.2.3 Ensure that the --client-ca-file argument is set as appropriate (Automated)

**Result:** pass

**Remediation:**
If using a Kubelet config file, edit the file to set `authentication.x509.clientCAFile` to
the location of the client CA file.
If using command line arguments, edit the kubelet service file
/etc/systemd/system/kubelet.service.d/10-kubeadm.conf on each worker node and
set the below parameter in KUBELET_AUTHZ_ARGS variable.
`--client-ca-file=<path/to/client-ca-file>`
Based on your system, restart the kubelet service. For example,
systemctl daemon-reload
systemctl restart kubelet.service

**Audit:**

```bash
/bin/sh -c 'if test $(journalctl -D /var/log/journal -u k3s | grep "Running kube-apiserver" | wc -l) -gt 0; then journalctl -D /var/log/journal -u k3s | grep "Running kube-apiserver" | tail -n1 | grep "client-ca-file" | grep -v grep; else echo "--client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt"; fi'
```

**Expected Result**:

```console
'--client-ca-file' is present
```

**Returned Value**:

```console
--client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt Sep 13 13:26:40 k3s-123-cis-pool3-b403f678-bzdg5 k3s[1600]: time="2022-09-13T13:26:40Z" level=info msg="Running kube-apiserver --advertise-address=172.31.0.140 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --feature-gates=JobTrackingWithFinalizers=true --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```

### 4.2.4 Ensure that the --read-only-port argument is set to 0 (Manual)

**Result:** pass

**Remediation:**
If using a Kubelet config file, edit the file to set `readOnlyPort` to 0.
If using command line arguments, edit the kubelet service file
/etc/systemd/system/kubelet.service.d/10-kubeadm.conf on each worker node and
set the below parameter in KUBELET_SYSTEM_PODS_ARGS variable.
--read-only-port=0
Based on your system, restart the kubelet service. For example,
systemctl daemon-reload
systemctl restart kubelet.service

**Audit:**

```bash
journalctl -D /var/log/journal -u k3s | grep 'Running kubelet' | tail -n1 | grep 'read-only-port'
```

**Expected Result**:

```console
'--read-only-port' is equal to '0' OR '--read-only-port' is not present
```

**Returned Value**:

```console
Sep 13 13:26:50 k3s-123-cis-pool2-98604672-hr9p5 k3s[1592]: time="2022-09-13T13:26:50Z" level=info msg="Running kubelet --address=0.0.0.0 --anonymous-auth=false --authentication-token-webhook=true --authorization-mode=Webhook --cgroup-driver=systemd --client-ca-file=/var/lib/rancher/k3s/agent/client-ca.crt --cloud-provider=external --cluster-dns=10.43.0.10 --cluster-domain=cluster.local --container-runtime-endpoint=unix:///run/k3s/containerd/containerd.sock --containerd=/run/k3s/containerd/containerd.sock --eviction-hard=imagefs.available<5%,nodefs.available<5% --eviction-minimum-reclaim=imagefs.available=10%,nodefs.available=10% --fail-swap-on=false --healthz-bind-address=127.0.0.1 --hostname-override=k3s-123-cis-pool2-98604672-hr9p5 --kubeconfig=/var/lib/rancher/k3s/agent/kubelet.kubeconfig --node-labels=rke.cattle.io/machine=00c4e7a0-5497-4367-a70c-0b836757eae8 --pod-infra-container-image=rancher/mirrored-pause:3.6 --pod-manifest-path=/var/lib/rancher/k3s/agent/pod-manifests --read-only-port=0 --resolv-conf=/run/systemd/resolve/resolv.conf --serialize-image-pulls=false --tls-cert-file=/var/lib/rancher/k3s/agent/serving-kubelet.crt --tls-private-key-file=/var/lib/rancher/k3s/agent/serving-kubelet.key" Sep 13 13:26:44 k3s-123-cis-pool3-b403f678-bzdg5 k3s[1600]: time="2022-09-13T13:26:44Z" level=info msg="Running kubelet --address=0.0.0.0 --anonymous-auth=false --authentication-token-webhook=true --authorization-mode=Webhook --cgroup-driver=systemd --client-ca-file=/var/lib/rancher/k3s/agent/client-ca.crt --cloud-provider=external --cluster-dns=10.43.0.10 --cluster-domain=cluster.local --container-runtime-endpoint=unix:///run/k3s/containerd/containerd.sock --containerd=/run/k3s/containerd/containerd.sock --eviction-hard=imagefs.available<5%,nodefs.available<5% --eviction-minimum-reclaim=imagefs.available=10%,nodefs.available=10% --fail-swap-on=false --healthz-bind-address=127.0.0.1 --hostname-override=k3s-123-cis-pool3-b403f678-bzdg5 --kubeconfig=/var/lib/rancher/k3s/agent/kubelet.kubeconfig --node-labels=rke.cattle.io/machine=109d596c-89f5-4c10-8c7f-6b82a38edd8f --pod-infra-container-image=rancher/mirrored-pause:3.6 --pod-manifest-path=/var/lib/rancher/k3s/agent/pod-manifests --read-only-port=0 --resolv-conf=/run/systemd/resolve/resolv.conf --serialize-image-pulls=false --tls-cert-file=/var/lib/rancher/k3s/agent/serving-kubelet.crt --tls-private-key-file=/var/lib/rancher/k3s/agent/serving-kubelet.key"
```

### 4.2.5 Ensure that the --streaming-connection-idle-timeout argument is not set to 0 (Manual)

**Result:** warn

**Remediation:**
If using a Kubelet config file, edit the file to set `streamingConnectionIdleTimeout` to a
value other than 0.
If using command line arguments, edit the kubelet service file
/etc/systemd/system/kubelet.service.d/10-kubeadm.conf on each worker node and
set the below parameter in KUBELET_SYSTEM_PODS_ARGS variable.
--streaming-connection-idle-timeout=5m
Based on your system, restart the kubelet service. For example,
systemctl daemon-reload
systemctl restart kubelet.service

**Audit:**

```bash
journalctl -D /var/log/journal -u k3s | grep 'Running kubelet' | tail -n1 | grep 'streaming-connection-idle-timeout'
```

### 4.2.6 Ensure that the --protect-kernel-defaults argument is set to true (Automated)

**Result:** Not Applicable

**Remediation:**
If using a Kubelet config file, edit the file to set `protectKernelDefaults` to `true`.
If using command line arguments, edit the kubelet service file
/etc/systemd/system/kubelet.service.d/10-kubeadm.conf on each worker node and
set the below parameter in KUBELET_SYSTEM_PODS_ARGS variable.
--protect-kernel-defaults=true
Based on your system, restart the kubelet service. For example:
systemctl daemon-reload
systemctl restart kubelet.service

### 4.2.7 Ensure that the --make-iptables-util-chains argument is set to true (Automated)

**Result:** Not Applicable

**Remediation:**
```

もし Kubelet の設定ファイルを使用している場合は、ファイルを編集して `makeIPTablesUtilChains` を `true` に設定します。
コマンドライン引数を使用している場合は、各ワーカーノードの kubelet サービスファイル
`/etc/systemd/system/kubelet.service.d/10-kubeadm.conf` を編集し、
`KUBELET_SYSTEM_PODS_ARGS` 変数から `--make-iptables-util-chains` 引数を削除します。
システムに基づいて、kubelet サービスを再起動します。例えば：
```bash
systemctl daemon-reload
systemctl restart kubelet.service
```

### 4.2.8 `--hostname-override` 引数が設定されていないことを確認する（手動）

**結果:** 該当なし

**修正方法:**
各ワーカーノードの kubelet サービスファイル `/etc/systemd/system/kubelet.service.d/10-kubeadm.conf` を編集し、
`KUBELET_SYSTEM_PODS_ARGS` 変数から `--hostname-override` 引数を削除します。
システムに基づいて、kubelet サービスを再起動します。例えば：
```bash
systemctl daemon-reload
systemctl restart kubelet.service
```

### 4.2.9 `--event-qps` 引数が 0 または適切なイベントキャプチャを確保するレベルに設定されていることを確認する（手動）

**結果:** 警告

**修正方法:**
Kubelet の設定ファイルを使用している場合は、ファイルを編集して `eventRecordQPS` を適切なレベルに設定します。
コマンドライン引数を使用している場合は、各ワーカーノードの kubelet サービスファイル
`/etc/systemd/system/kubelet.service.d/10-kubeadm.conf` を編集し、
以下のパラメータを `KUBELET_SYSTEM_PODS_ARGS` 変数に設定します。
システムに基づいて、kubelet サービスを再起動します。例えば：
```bash
systemctl daemon-reload
systemctl restart kubelet.service
```

**監査:**

```bash
/bin/ps -fC containerd
```

### 4.2.10 `--tls-cert-file` および `--tls-private-key-file` 引数が適切に設定されていることを確認する（手動）

**結果:** 合格

**修正方法:**
Kubelet の設定ファイルを使用している場合は、ファイルを編集して `tlsCertFile` をこの Kubelet を識別するために使用する証明書ファイルの場所に設定し、
`tlsPrivateKeyFile` を対応する秘密鍵ファイルの場所に設定します。
コマンドライン引数を使用している場合は、各ワーカーノードの kubelet サービスファイル
`/etc/systemd/system/kubelet.service.d/10-kubeadm.conf` を編集し、
以下のパラメータを `KUBELET_CERTIFICATE_ARGS` 変数に設定します。
```
--tls-cert-file=<path/to/tls-certificate-file>
--tls-private-key-file=<path/to/tls-key-file>
```
システムに基づいて、kubelet サービスを再起動します。例えば：
```bash
systemctl daemon-reload
systemctl restart kubelet.service
```

**監査:**

```bash
journalctl -D /var/log/journal -u k3s | grep 'Running kubelet' | tail -n1
```

**期待される結果:**

```console
'--tls-cert-file' が存在し、'--tls-private-key-file' が存在する
```

**返された値:**

```console
Sep 13 13:26:50 k3s-123-cis-pool2-98604672-hr9p5 k3s[1592]: time="2022-09-13T13:26:50Z" level=info msg="Running kubelet --address=0.0.0.0 --anonymous-auth=false --authentication-token-webhook=true --authorization-mode=Webhook --cgroup-driver=systemd --client-ca-file=/var/lib/rancher/k3s/agent/client-ca.crt --cloud-provider=external --cluster-dns=10.43.0.10 --cluster-domain=cluster.local --container-runtime-endpoint=unix:///run/k3s/containerd/containerd.sock --containerd=/run/k3s/containerd/containerd.sock --eviction-hard=imagefs.available<5%,nodefs.available<5% --eviction-minimum-reclaim=imagefs.available=10%,nodefs.available=10% --fail-swap-on=false --healthz-bind-address=127.0.0.1 --hostname-override=k3s-123-cis-pool2-98604672-hr9p5 --kubeconfig=/var/lib/rancher/k3s/agent/kubelet.kubeconfig --node-labels=rke.cattle.io/machine=00c4e7a0-5497-4367-a70c-0b836757eae8 --pod-infra-container-image=rancher/mirrored-pause:3.6 --pod-manifest-path=/var/lib/rancher/k3s/agent/pod-manifests --read-only-port=0 --resolv-conf=/run/systemd/resolve/resolv.conf --serialize-image-pulls=false --tls-cert-file=/var/lib/rancher/k3s/agent/serving-kubelet.crt --tls-private-key-file=/var/lib/rancher/k3s/agent/serving-kubelet.key" Sep 13 13:26:44 k3s-123-cis-pool3-b403f678-bzdg5 k3s[1600]: time="2022-09-13T13:26:44Z" level=info msg="Running kubelet --address=0.0.0.0 --anonymous-auth=false --authentication-token-webhook=true --authorization-mode=Webhook --cgroup-driver=systemd --client-ca-file=/var/lib/rancher/k3s/agent/client-ca.crt --cloud-provider=external --cluster-dns=10.43.0.10 --cluster-domain=cluster.local --container-runtime-endpoint=unix:///run/k3s/containerd/containerd.sock --containerd=/run/k3s/containerd/containerd.sock --eviction-hard=imagefs.available<5%,nodefs.available<5% --eviction-minimum-reclaim=imagefs.available=10%,nodefs.available=10% --fail-swap-on=false --healthz-bind-address=127.0.0.1 --hostname-override=k3s-123-cis-pool3-b403f678-bzdg5 --kubeconfig=/var/lib/rancher/k3s/agent/kubelet.kubeconfig --node-labels=rke.cattle.io/machine=109d596c-89f5-4c10-8c7f-6b82a38edd8f --pod-infra-container-image=rancher/mirrored-pause:3.6 --pod-manifest-path=/var/lib/rancher/k3s/agent/pod-manifests --read-only-port=0 --resolv-conf=/run/systemd/resolve/resolv.conf --serialize-image-pulls=false --tls-cert-file=/var/lib/rancher/k3s/agent/serving-kubelet.crt --tls-private-key-file=/var/lib/rancher/k3s/agent/serving-kubelet.key"
```

### 4.2.11 `--rotate-certificates` 引数が `false` に設定されていないことを確認する（自動）

**結果:** 該当なし

**修正方法:**
Kubelet の設定ファイルを使用している場合は、ファイルを編集して `rotateCertificates` を `true` に設定するか、
デフォルト値を使用するために削除します。
コマンドライン引数を使用している場合は、各ワーカーノードの kubelet サービスファイル
`/etc/systemd/system/kubelet.service.d/10-kubeadm.conf` を編集し、
`KUBELET_CERTIFICATE_ARGS` 変数から `--rotate-certificates=false` 引数を削除します。
システムに基づいて、kubelet サービスを再起動します。例えば：
```bash
systemctl daemon-reload
systemctl restart kubelet.service
```

### 4.2.12 `RotateKubeletServerCertificate` 引数が `true` に設定されていることを確認する（手動）

**結果:** 該当なし

**修正方法:**
各ワーカーノードの kubelet サービスファイル `/etc/systemd/system/kubelet.service.d/10-kubeadm.conf` を編集し、
以下のパラメータを `KUBELET_CERTIFICATE_ARGS` 変数に設定します。
```
--feature-gates=RotateKubeletServerCertificate=true
```
システムに基づいて、kubelet サービスを再起動します。例えば：
```bash
systemctl daemon-reload
systemctl restart kubelet.service
```

### 4.2.13 Kubelet が強力な暗号化スイートのみを使用していることを確認する（手動）

**結果:** 警告

**修正方法:**
Kubelet の設定ファイルを使用している場合は、ファイルを編集して `TLSCipherSuites` を
`TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_AES_128_GCM_SHA256`
またはこれらの値のサブセットに設定します。
実行可能な引数を使用している場合は、各ワーカーノードの kubelet サービスファイル
`/etc/systemd/system/kubelet.service.d/10-kubeadm.conf` を編集し、
以下のように `--tls-cipher-suites` パラメータを設定します。またはこれらの値のサブセットに設定します。
```
--tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_AES_128_GCM_SHA256
```
システムに基づいて、kubelet サービスを再起動します。例えば：
```bash
systemctl daemon-reload
systemctl restart kubelet.service
```

**監査:**

```bash
/bin/ps -fC containerd
```

## 5.1 RBAC とサービスアカウント
### 5.1.1 `cluster-admin` ロールが必要な場合にのみ使用されていることを確認する（手動）

**結果:** 警告

**修正方法:**
`cluster-admin` ロールへのすべての `clusterrolebinding` を特定します。それらが使用されているかどうか、
このロールが必要かどうか、またはより少ない権限のロールを使用できるかどうかを確認します。
可能な場合は、まずユーザーを低権限のロールにバインドし、その後 `cluster-admin` ロールへの `clusterrolebinding` を削除します：
```bash
kubectl delete clusterrolebinding [name]
```

### 5.1.2 シークレットへのアクセスを最小限に抑える（手動）

**結果:** 警告

**修正方法:**
可能な場合は、クラスター内のシークレットオブジェクトへの `get`、`list`、および `watch` アクセスを削除します。

### 5.1.3 ロールおよびクラスターロールでワイルドカードの使用を最小限に抑える（手動）

**結果:** 警告

**修正方法:**
可能な場合は、クラスターロールおよびロールでのワイルドカードの使用を特定のオブジェクトまたはアクションに置き換えます。

### 5.1.4 ポッドの作成アクセスを最小限に抑える（手動）

**結果:** 警告

**修正方法:**
可能な場合は、クラスター内のポッドオブジェクトへの作成アクセスを削除します。

### 5.1.5 デフォルトのサービスアカウントが積極的に使用されていないことを確認する（手動）

**結果:** 警告

**修正方法:**
Kubernetes ワークロードが Kubernetes API サーバーへの特定のアクセスを必要とする場合は、明示的なサービスアカウントを作成します。
各デフォルトのサービスアカウントの設定を変更して、この値を含めます：
```yaml
automountServiceAccountToken: false
```

### 5.1.6 サービスアカウントトークンが必要な場合にのみマウントされることを確認する（手動）

**結果:** 警告

**修正方法:**
サービスアカウントトークンをマウントする必要がないポッドおよびサービスアカウントの定義を変更して無効にします。

### 5.1.7 `system:masters` グループの使用を避ける（手動）

**結果:** 警告

**修正方法:**
クラスター内のすべてのユーザーから `system:masters` グループを削除します。

### 5.1.8 Kubernetes クラスター内での `Bind`、`Impersonate`、および `Escalate` 権限の使用を制限する（手動）

**結果:** 警告

**修正方法:**
可能な場合は、`impersonate`、`bind`、および `escalate` 権限をサブジェクトから削除します。

## 5.2 ポッドセキュリティ基準
### 5.2.1 クラスターに少なくとも1つのアクティブなポリシー制御メカニズムが存在することを確認する（手動）

**結果:** 警告

**修正方法:**
ユーザーワークロードを含むすべてのネームスペースに対して、Pod Security Admission または外部ポリシー制御システムが存在することを確認します。

### 5.2.2 特権コンテナの許可を最小限に抑える（自動）

**結果:** 警告

**修正方法:**
ユーザーワークロードを含むクラスター内の各ネームスペースにポリシーを追加して、
特権コンテナの許可を制限します。

### 5.2.3 ホストプロセスIDネームスペースを共有しようとするコンテナの許可を最小限に抑える（自動）

**結果:** 警告

**修正方法:**
ユーザーワークロードを含むクラスター内の各ネームスペースにポリシーを追加して、
`hostPID` コンテナの許可を制限します。

### 5.2.4 ホストIPCネームスペースを共有しようとするコンテナの許可を最小限に抑える（自動）

**結果:** 警告

**修正方法:**
ユーザーワークロードを含むクラスター内の各ネームスペースにポリシーを追加して、
`hostIPC` コンテナの許可を制限します。
**結果:** 警告

**修正方法:**
ユーザーのワークロードがあるクラスター内の各ネームスペースにポリシーを追加し、`hostIPC`コンテナのアドミッションを制限します。

### 5.2.5 ホストネットワークネームスペースを共有しようとするコンテナのアドミッションを最小限に抑える (自動化)


**結果:** 警告

**修正方法:**
ユーザーのワークロードがあるクラスター内の各ネームスペースにポリシーを追加し、`hostNetwork`コンテナのアドミッションを制限します。

### 5.2.6 allowPrivilegeEscalationを持つコンテナのアドミッションを最小限に抑える (自動化)


**結果:** 警告

**修正方法:**
ユーザーのワークロードがあるクラスター内の各ネームスペースにポリシーを追加し、`.spec.allowPrivilegeEscalation`が`true`に設定されているコンテナのアドミッションを制限します。

### 5.2.7 ルートコンテナのアドミッションを最小限に抑える (自動化)


**結果:** 警告

**修正方法:**
クラスター内の各ネームスペースにポリシーを作成し、`MustRunAsNonRoot`またはUIDの範囲に0を含まない`MustRunAs`が設定されていることを確認します。

### 5.2.8 NET_RAW機能を持つコンテナのアドミッションを最小限に抑える (自動化)


**結果:** 警告

**修正方法:**
ユーザーのワークロードがあるクラスター内の各ネームスペースにポリシーを追加し、`NET_RAW`機能を持つコンテナのアドミッションを制限します。

### 5.2.9 追加された機能を持つコンテナのアドミッションを最小限に抑える (自動化)


**結果:** 警告

**修正方法:**
`allowedCapabilities`が空の配列に設定されていない限り、クラスターのポリシーに存在しないことを確認します。

### 5.2.10 機能が割り当てられたコンテナのアドミッションを最小限に抑える (手動)


**結果:** 警告

**修正方法:**
クラスター上で実行されているアプリケーションの機能の使用を確認します。ネームスペースにLinux機能を必要としないアプリケーションが含まれている場合、すべての機能を削除しないコンテナのアドミッションを禁止するPSPを追加することを検討します。

### 5.2.11 Windows HostProcessコンテナのアドミッションを最小限に抑える (手動)


**結果:** 警告

**修正方法:**
ユーザーのワークロードがあるクラスター内の各ネームスペースにポリシーを追加し、`.securityContext.windowsOptions.hostProcess`が`true`に設定されているコンテナのアドミッションを制限します。

### 5.2.12 HostPathボリュームのアドミッションを最小限に抑える (手動)


**結果:** 警告

**修正方法:**
ユーザーのワークロードがあるクラスター内の各ネームスペースにポリシーを追加し、`hostPath`ボリュームを持つコンテナのアドミッションを制限します。

### 5.2.13 HostPortsを使用するコンテナのアドミッションを最小限に抑える (手動)


**結果:** 警告

**修正方法:**
ユーザーのワークロードがあるクラスター内の各ネームスペースにポリシーを追加し、`hostPort`セクションを使用するコンテナのアドミッションを制限します。

## 5.3 ネットワークポリシーとCNI
### 5.3.1 使用中のCNIがネットワークポリシーをサポートしていることを確認する (手動)


**結果:** 警告

**修正方法:**
使用中のCNIプラグインがネットワークポリシーをサポートしていない場合、別のプラグインを使用するか、Kubernetesクラスター内のトラフィックを制限するための代替メカニズムを検討します。

### 5.3.2 すべてのネームスペースにネットワークポリシーが定義されていることを確認する (手動)


**結果:** 警告

**修正方法:**
ドキュメントに従い、必要に応じてNetworkPolicyオブジェクトを作成します。

## 5.4 シークレット管理
### 5.4.1 環境変数としてのシークレットよりもファイルとしてのシークレットを使用することを推奨する (手動)


**結果:** 警告

**修正方法:**
可能であれば、アプリケーションコードを変更して、環境変数ではなくマウントされたシークレットファイルからシークレットを読み取るようにします。

### 5.4.2 外部シークレットストレージを検討する (手動)


**結果:** 警告

**修正方法:**
クラウドプロバイダーやサードパーティのシークレット管理ソリューションが提供するシークレット管理オプションを参照します。

## 5.5 拡張可能なアドミッションコントロール
### 5.5.1 ImagePolicyWebhookアドミッションコントローラーを使用してイメージの出所を設定する (手動)


**結果:** 警告

**修正方法:**
Kubernetesのドキュメントに従い、イメージの出所を設定します。

## 5.7 一般的なポリシー
### 5.7.1 ネームスペースを使用してリソース間に管理境界を作成する (手動)


**結果:** 警告

**修正方法:**
ドキュメントに従い、デプロイメント内のオブジェクトに必要なネームスペースを作成します。

### 5.7.2 Pod定義でseccompプロファイルがdocker/defaultに設定されていることを確認する (手動)


**結果:** 警告

**修正方法:**
`securityContext`を使用して、Pod定義でdocker/default seccompプロファイルを有効にします。以下はその例です：
 securityContext:
 seccompProfile:
 type: RuntimeDefault

### 5.7.3 PodおよびコンテナにSecurityContextを適用する (手動)


**結果:** 警告

**修正方法:**
Kubernetesのドキュメントに従い、PodにSecurityContextを適用します。推奨されるSecurityContextのリストについては、CIS Security Benchmark for Docker Containersを参照してください。

### 5.7.4 デフォルトのネームスペースは使用しない (手動)


**結果:** 警告

**修正方法:**
Kubernetesリソースの適切な分離を可能にするためにネームスペースが作成されていることを確認し、すべての新しいリソースが特定のネームスペースに作成されるようにします。