---
title: "クイックスタートガイド"
---

このガイドは、デフォルトオプションでクラスターを迅速に起動するのに役立ちます。[インストールセクション](./installation/installation.md)では、K3sのセットアップ方法について詳しく説明しています。

進める前に、ノードが[要件](./installation/requirements.md)を満たしていることを確認してください。

K3sコンポーネントがどのように連携するかについては、[アーキテクチャセクション](./architecture.md)を参照してください。

:::info
Kubernetesに初めて触れる方へ：公式のKubernetesドキュメントには、基本を説明する素晴らしいチュートリアルが[こちら](https://kubernetes.io/docs/tutorials/kubernetes-basics/)にあります。
:::

## インストールスクリプト

K3sは、systemdまたはopenrcベースのシステムにサービスとしてインストールするための便利なインストールスクリプトを提供しています。このスクリプトは https://get.k3s.io で利用可能です。この方法でK3sをインストールするには、次のコマンドを実行します：

```bash
curl -sfL https://get.k3s.io | sh -
```

このインストールを実行すると：

- K3sサービスは、ノードの再起動後やプロセスがクラッシュまたは終了した場合に自動的に再起動するように設定されます
- `kubectl`、`crictl`、`ctr`、`k3s-killall.sh`、`k3s-uninstall.sh`などの追加ユーティリティがインストールされます
- [kubeconfig](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/)ファイルが`/etc/rancher/k3s/k3s.yaml`に書き込まれ、K3sによってインストールされたkubectlが自動的にそれを使用します

単一ノードのサーバーインストールは、ワークロードポッドをホストするために必要なすべてのデータストア、コントロールプレーン、kubelet、およびコンテナランタイムコンポーネントを含む完全に機能するKubernetesクラスターです。追加のサーバーやエージェントノードを追加する必要はありませんが、クラスターの容量や冗長性を追加するために追加することを検討するかもしれません。

追加のエージェントノードをインストールしてクラスターに追加するには、`K3S_URL`および`K3S_TOKEN`環境変数を使用してインストールスクリプトを実行します。エージェントを参加させる方法の例は次の通りです：

```bash
curl -sfL https://get.k3s.io | K3S_URL=https://myserver:6443 K3S_TOKEN=mynodetoken sh -
```

`K3S_URL`パラメータを設定すると、インストーラーはK3sをサーバーではなくエージェントとして構成します。K3sエージェントは、指定されたURLでリッスンしているK3sサーバーに登録されます。`K3S_TOKEN`に使用する値は、サーバーノードの`/var/lib/rancher/k3s/server/node-token`に保存されています。

:::note
各マシンには一意のホスト名が必要です。マシンに一意のホスト名がない場合は、`K3S_NODE_NAME`環境変数を渡し、各ノードに対して有効で一意のホスト名を指定してください。
:::

追加のサーバーノードに興味がある場合は、[高可用性埋め込みetcd](./datastore/ha-embedded.md)および[高可用性外部DB](./datastore/ha.md)ページを参照してください。