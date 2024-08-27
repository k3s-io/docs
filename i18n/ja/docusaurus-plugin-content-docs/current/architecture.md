---
title: アーキテクチャ
---

import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';

### サーバーとエージェント

* サーバーノードは、`k3s server` コマンドを実行しているホストとして定義され、K3sによって管理されるコントロールプレーンとデータストアコンポーネントを持ちます。
* エージェントノードは、`k3s agent` コマンドを実行しているホストとして定義され、データストアやコントロールプレーンコンポーネントは持ちません。
* サーバーとエージェントの両方がkubelet、コンテナランタイム、およびCNIを実行します。エージェントレスサーバーの実行に関する詳細は、[高度なオプション](./advanced.md#running-agentless-servers-experimental)のドキュメントを参照してください。

![](/img/how-it-works-k3s-revised.svg)

### 埋め込みDBを使用したシングルサーバーセットアップ

以下の図は、埋め込みSQLiteデータベースを持つシングルノードK3sサーバーを含むクラスターの例を示しています。

この構成では、各エージェントノードは同じサーバーノードに登録されます。K3sユーザーは、サーバーノード上のK3s APIを呼び出すことでKubernetesリソースを操作できます。

<ThemedImage
  alt="シングルサーバーを持つK3sアーキテクチャ"
  sources={{
    light: useBaseUrl('/img/k3s-architecture-single-server.svg'),
    dark: useBaseUrl('/img/k3s-architecture-single-server-dark.svg'),
  }}
/>

### 高可用性K3s

シングルサーバークラスターはさまざまなユースケースに対応できますが、Kubernetesコントロールプレーンの稼働時間が重要な環境では、K3sをHA構成で実行できます。HA K3sクラスターは以下を含みます：

<Tabs>
<TabItem value="埋め込みDB">

* Kubernetes APIを提供し、他のコントロールプレーンサービスを実行する**3つ以上のサーバーノード**
* シングルサーバーセットアップで使用される埋め込みSQLiteデータストアとは対照的に、**埋め込みetcdデータストア**

<ThemedImage
  alt="高可用性サーバーを持つK3sアーキテクチャ"
  sources={{
    light: useBaseUrl('/img/k3s-architecture-ha-embedded.svg'),
    dark: useBaseUrl('/img/k3s-architecture-ha-embedded-dark.svg'),
}} />

</TabItem>
<TabItem value="外部DB">

* Kubernetes APIを提供し、他のコントロールプレーンサービスを実行する**2つ以上のサーバーノード**
* **外部データストア**（MySQL、PostgreSQL、またはetcdなど）

<ThemedImage
  alt="高可用性サーバーと外部DBを持つK3sアーキテクチャ"
  sources={{
    light: useBaseUrl('/img/k3s-architecture-ha-external.svg'),
    dark: useBaseUrl('/img/k3s-architecture-ha-external-dark.svg'),
}} />

</TabItem>
</Tabs>

### エージェントノードの固定登録アドレス

高可用性サーバー構成では、各ノードは以下の図に示すように、固定登録アドレスを使用してKubernetes APIに登録することもできます。

登録後、エージェントノードはサーバーノードの1つに直接接続を確立します。

<ThemedImage
  alt="エージェント登録HA"
  sources={{
    light: useBaseUrl('/img/k3s-production-setup.svg'),
    dark: useBaseUrl('/img/k3s-production-setup-dark.svg'),
  }}
/>

### エージェントノードの登録方法

エージェントノードは、`k3s agent` プロセスによって開始されるWebSocket接続で登録され、その接続はエージェントプロセスの一部として実行されるクライアントサイドのロードバランサーによって維持されます。最初に、エージェントはポート6443のローカルロードバランサーを介してスーパーバイザー（およびkube-apiserver）に接続します。ロードバランサーは接続可能なエンドポイントのリストを維持します。デフォルト（および最初の）エンドポイントは、`--server` アドレスからのホスト名によってシードされます。クラスターに接続すると、エージェントはデフォルトのネームスペース内のKubernetesサービスエンドポイントリストからkube-apiserverアドレスのリストを取得します。これらのエンドポイントはロードバランサーに追加され、クラスター内のすべてのサーバーに安定した接続を維持し、個々のサーバーの停止に耐えるkube-apiserverへの接続を提供します。

エージェントは、ノードクラスターシークレットと、`/etc/rancher/node/password` に保存されるランダムに生成されたパスワードを使用してサーバーに登録されます。サーバーは個々のノードのパスワードをKubernetesシークレットとして保存し、後続の試行では同じパスワードを使用する必要があります。ノードパスワードシークレットは、`<host>.node-password.k3s` テンプレートを使用した名前で`kube-system`ネームスペースに保存されます。これはノードIDの整合性を保護するために行われます。

エージェントの`/etc/rancher/node`ディレクトリが削除された場合、または既存の名前を使用してノードを再参加させたい場合は、クラスターからノードを削除する必要があります。これにより、古いノードエントリとノードパスワードシークレットの両方がクリーンアップされ、ノードがクラスターに再参加できるようになります。

ホスト名を頻繁に再利用するが、ノードパスワードシークレットを削除できない場合は、`--with-node-id` フラグを使用してK3sサーバーまたはエージェントを起動することで、ホスト名に一意のノードIDを自動的に追加できます。有効にすると、ノードIDも`/etc/rancher/node/`に保存されます。