---
title: "高可用性組み込みetcd"
---

:::warning
組み込みetcd（HA）は、Raspberry PiのようなSDカードを使用する遅いディスク上でパフォーマンスの問題が発生する可能性があります。
:::

<details>
<summary>なぜサーバーノードの数は奇数なのか？</summary>

HA組み込みetcdクラスターは、etcdがクォーラムを維持するために奇数のサーバーノードで構成されている必要があります。n台のサーバーを持つクラスターの場合、クォーラムは(n/2)+1です。奇数サイズのクラスターにノードを追加すると、クォーラムに必要なノードの数が常に増加します。奇数サイズのクラスターにノードを追加することは、マシンの数が増えるため一見良さそうに見えますが、クォーラムを失わずに故障できるノードの数は同じであるため、故障耐性は悪化します。
</details>

組み込みetcdを使用したHA K3sクラスターは以下で構成されます：

- Kubernetes APIを提供し、他のコントロールプレーンサービスを実行し、組み込みetcdデータストアをホストする**サーバーノード**が3つ以上
- オプション：アプリケーションやサービスを実行するために指定された**エージェントノード**が0個以上
- オプション：エージェントノードがクラスターに登録するための**固定登録アドレス**

:::note
大規模なHAクラスターを迅速にデプロイするには、[関連プロジェクト](../related-projects.md)を参照してください。
:::

まず、クラスタリングを有効にするために`cluster-init`フラグと、追加のサーバーをクラスターに参加させるための共有シークレットとして使用されるトークンを使用してサーバーノードを起動します。

```bash
curl -sfL https://get.k3s.io | K3S_TOKEN=SECRET sh -s - server \
    --cluster-init \
    --tls-san=<FIXED_IP> # オプション、固定登録アドレスを使用する場合に必要
```

最初のサーバーを起動した後、共有シークレットを使用して2番目と3番目のサーバーをクラスターに参加させます：

```bash
curl -sfL https://get.k3s.io | K3S_TOKEN=SECRET sh -s - server \
    --server https://<サーバー1のIPまたはホスト名>:6443 \
    --tls-san=<FIXED_IP> # オプション、固定登録アドレスを使用する場合に必要
```

2番目と3番目のサーバーがクラスターの一部になっていることを確認します：

```bash
$ kubectl get nodes
NAME        STATUS   ROLES                       AGE   VERSION
server1     Ready    control-plane,etcd,master   28m   vX.Y.Z
server2     Ready    control-plane,etcd,master   13m   vX.Y.Z
server3     Ready    control-plane,etcd,master   10m   vX.Y.Z
```

これで高可用性のコントロールプレーンが完成しました。クラスター化に成功したサーバーは、追加のサーバーやエージェントノードを参加させるために`--server`引数で使用できます。追加のエージェントノードをクラスターに参加させる手順はサーバーと同じです：

```bash
curl -sfL https://get.k3s.io | K3S_TOKEN=SECRET sh -s - agent --server https://<サーバーのIPまたはホスト名>:6443
```

すべてのサーバーノードで同じでなければならないいくつかの設定フラグがあります：

- ネットワーク関連のフラグ：`--cluster-dns`、`--cluster-domain`、`--cluster-cidr`、`--service-cidr`
- 特定のコンポーネントのデプロイを制御するフラグ：`--disable-helm-controller`、`--disable-kube-proxy`、`--disable-network-policy`および`--disable`に渡される任意のコンポーネント
- 機能関連のフラグ：`--secrets-encryption`

## 既存のシングルノードクラスター

:::info バージョンゲート
[v1.22.2+k3s1](https://github.com/k3s-io/k3s/releases/tag/v1.22.2%2Bk3s1)から利用可能
:::

デフォルトの組み込みSQLiteデータベースを使用している既存のクラスターがある場合、K3sサーバーを`--cluster-init`フラグで再起動するだけでetcdに変換できます。それが完了すると、上記の手順で追加のインスタンスを追加できるようになります。

そのノードがすでにクラスターを初期化または参加したためにディスク上にetcdデータストアが見つかった場合、データストアの引数（`--cluster-init`、`--server`、`--datastore-endpoint`など）は無視されます。