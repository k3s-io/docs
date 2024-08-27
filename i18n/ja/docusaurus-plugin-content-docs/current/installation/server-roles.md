---
title: "サーバーロールの管理"
---

`--cluster-init` オプションを使用して K3s サーバーを起動すると、apiserver、controller-manager、scheduler、および etcd を含むすべてのコントロールプレーンコンポーネントが実行されます。特定のコンポーネントを無効にして、コントロールプレーンと etcd のロールを別々のノードに分割することが可能です。

:::info
このドキュメントは、埋め込み etcd を使用している場合にのみ関連します。埋め込み etcd を使用していない場合、すべてのサーバーはコントロールプレーンロールを持ち、コントロールプレーンコンポーネントを実行します。
:::

## 専用の `etcd` ノード
`etcd` ロールのみを持つサーバーを作成するには、すべてのコントロールプレーンコンポーネントを無効にして K3s を起動します:
```
curl -fL https://get.k3s.io | sh -s - server --cluster-init --disable-apiserver --disable-controller-manager --disable-scheduler
```

この最初のノードは etcd を起動し、追加の `etcd` および/または `control-plane` ノードが参加するのを待ちます。クラスターは、`control-plane` コンポーネントが有効な追加のサーバーが参加するまで使用できません。

## 専用の `control-plane` ノード
:::note
専用の `control-plane` ノードはクラスターの最初のサーバーにはなれません。専用の `control-plane` ノードが参加する前に、`etcd` ロールを持つ既存のノードが必要です。
:::

`control-plane` ロールのみを持つサーバーを作成するには、etcd を無効にして k3s を起動します:
```bash
curl -fL https://get.k3s.io | sh -s - server --token <token> --disable-etcd --server https://<etcd-only-node>:6443 
```

専用のサーバーノードを作成した後、選択したロールは `kubectl get node` で確認できます:
```bash
$ kubectl get nodes
NAME           STATUS   ROLES                       AGE     VERSION
k3s-server-1   Ready    etcd                        5h39m   v1.20.4+k3s1
k3s-server-2   Ready    control-plane,master        5h39m   v1.20.4+k3s1
```

## 既存のサーバーへのロールの追加

ロールは、無効化フラグを削除して K3s を再起動することで、既存の専用ノードに追加できます。例えば、専用の `etcd` ノードに `control-plane` ロールを追加したい場合、systemd ユニットまたは設定ファイルから `--disable-apiserver --disable-controller-manager --disable-scheduler` フラグを削除し、サービスを再起動します。

## 設定ファイルの構文

他のすべての CLI フラグと同様に、[設定ファイル](configuration.md#configuration-file) を使用してコンポーネントを無効にすることができます。例えば、専用の `etcd` ノードを作成するには、次の値を `/etc/rancher/k3s/config.yaml` に配置します:

```yaml
cluster-init: true
disable-apiserver: true
disable-controller-manager: true
disable-scheduler: true
```