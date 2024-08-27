---
title: "設定オプション"
---

このページでは、K3sを初めてセットアップする際によく使用されるオプションに焦点を当てます。詳細については、[高度なオプションと設定](../advanced.md)および[サーバー](../cli/server.md)と[エージェント](../cli/agent.md)のコマンドドキュメントを参照してください。

## インストールスクリプトによる設定

[クイックスタートガイド](../quick-start.md)で述べたように、https://get.k3s.io で利用可能なインストールスクリプトを使用して、systemdおよびopenrcベースのシステムにK3sをサービスとしてインストールできます。

`INSTALL_K3S_EXEC`、`K3S_`環境変数、およびコマンドフラグの組み合わせを使用して、サービス設定に設定を渡すことができます。
プレフィックス付きの環境変数、`INSTALL_K3S_EXEC`の値、およびトレイリングシェル引数はすべてサービス設定に保存されます。
インストール後、環境ファイルを編集するか、サービス設定を編集するか、または新しいオプションでインストーラーを再実行することで設定を変更できます。

これを示すために、以下のコマンドはすべて、Flannelなしでトークンを使用してサーバーを登録する同じ動作をもたらします：

```bash
curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="server" sh -s - --flannel-backend none --token 12345
curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="server --flannel-backend none" K3S_TOKEN=12345 sh -s -
curl -sfL https://get.k3s.io | K3S_TOKEN=12345 sh -s - server --flannel-backend none
# K3S_URLがないため、以下ではサーバーが想定されます
curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="--flannel-backend none --token 12345" sh -s - 
curl -sfL https://get.k3s.io | sh -s - --flannel-backend none --token 12345
```

エージェントを登録する場合、以下のコマンドはすべて同じ動作をもたらします：

```bash
curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="agent --server https://k3s.example.com --token mypassword" sh -s -
curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="agent" K3S_TOKEN="mypassword" sh -s - --server https://k3s.example.com
curl -sfL https://get.k3s.io | K3S_URL=https://k3s.example.com sh -s - agent --token mypassword
curl -sfL https://get.k3s.io | K3S_URL=https://k3s.example.com K3S_TOKEN=mypassword sh -s - # K3S_URLがあるためエージェントが想定されます
```

すべての環境変数の詳細については、[環境変数](../reference/env-variables.md)を参照してください。

:::info 注意
インストールスクリプトを実行する際に設定を行ったが、再実行する際に設定を再度行わない場合、元の値は失われます。

[設定ファイル](#configuration-file)の内容はインストールスクリプトによって管理されません。
設定をインストールスクリプトから独立させたい場合は、環境変数や引数をインストールスクリプトに渡すのではなく、設定ファイルを使用するべきです。
:::

## バイナリによる設定

前述のように、インストールスクリプトは主にK3sをサービスとして実行するための設定に関心があります。
スクリプトを使用しない場合は、[リリースページ](https://github.com/k3s-io/k3s/releases/latest)からバイナリをダウンロードし、パスに配置して実行するだけでK3sを実行できます。これは恒久的なインストールには特に役立ちませんが、K3sをシステムサービスとして管理する価値がない迅速なテストを行う場合には役立つかもしれません。
```bash
curl -Lo /usr/local/bin/k3s https://github.com/k3s-io/k3s/releases/download/v1.26.5+k3s1/k3s; chmod a+x /usr/local/bin/k3s
```

`K3S_`環境変数を設定して設定を渡すことができます：
```bash
K3S_KUBECONFIG_MODE="644" k3s server
```

またはコマンドフラグ：
```bash
k3s server --write-kubeconfig-mode=644
```

k3sエージェントもこの方法で設定できます：

```bash
k3s agent --server https://k3s.example.com --token mypassword
```

K3sサーバーの設定の詳細については、[`k3s server`ドキュメント](../cli/server.md)を参照してください。
K3sエージェントの設定の詳細については、[`k3s agent`ドキュメント](../cli/agent.md)を参照してください。
また、`--help`フラグを使用して、利用可能なすべてのオプションとそれに対応する環境変数のリストを表示することもできます。

:::info フラグの一致
サーバーノードで重要なフラグを一致させることが重要です。たとえば、マスターノードで`--disable servicelb`や`--cluster-cidr=10.200.0.0/16`フラグを使用し、他のサーバーノードで設定しない場合、ノードは参加に失敗します。エラーとして次のようなメッセージが表示されます：
`failed to validate server configuration: critical configuration value mismatch.`
サーバー設定の詳細については、上記のリンクを参照してください。
:::
## 設定ファイル

:::info バージョンゲート

[v1.19.1+k3s1](https://github.com/k3s-io/k3s/releases/tag/v1.19.1%2Bk3s1)以降で利用可能

:::

K3sは環境変数やCLI引数で設定するだけでなく、設定ファイルも使用できます。

デフォルトでは、`/etc/rancher/k3s/config.yaml`にあるYAMLファイルの値がインストール時に使用されます。

以下は基本的な`server`設定ファイルの例です：

```yaml
write-kubeconfig-mode: "0644"
tls-san:
  - "foo.local"
node-label:
  - "foo=bar"
  - "something=amazing"
cluster-init: true
```

これは次のCLI引数に相当します：

```bash
k3s server \
  --write-kubeconfig-mode "0644"    \
  --tls-san "foo.local"             \
  --node-label "foo=bar"            \
  --node-label "something=amazing"  \
  --cluster-init
```

一般的に、CLI引数はそれぞれのYAMLキーにマップされ、繰り返し可能なCLI引数はYAMLリストとして表されます。ブールフラグはYAMLファイルでは`true`または`false`として表されます。

設定ファイルとCLI引数の両方を使用することも可能です。この場合、値は両方のソースから読み込まれますが、CLI引数が優先されます。`--node-label`のような繰り返し可能な引数の場合、CLI引数はリスト内のすべての値を上書きします。

最後に、設定ファイルの場所はCLI引数`--config FILE, -c FILE`または環境変数`$K3S_CONFIG_FILE`を使用して変更できます。

### 複数の設定ファイル
:::info バージョンゲート
[v1.21.0+k3s1](https://github.com/k3s-io/k3s/releases/tag/v1.21.0%2Bk3s1)以降で利用可能
:::

複数の設定ファイルがサポートされています。デフォルトでは、設定ファイルは`/etc/rancher/k3s/config.yaml`および`/etc/rancher/k3s/config.yaml.d/*.yaml`からアルファベット順に読み込まれます。

デフォルトでは、特定のキーに対して最後に見つかった値が使用されます。キーに`+`を追加すると、既存の文字列やスライスに値を追加することができます。以降のファイルでもこのキーに`+`を追加しないと、累積された値が上書きされます。

以下は複数の設定ファイルの例です：

```yaml
# config.yaml
token: boop
node-label:
  - foo=bar
  - bar=baz


# config.yaml.d/test1.yaml
write-kubeconfig-mode: 600
node-taint:
  - alice=bob:NoExecute

# config.yaml.d/test2.yaml
write-kubeconfig-mode: 777
node-label:
  - other=what
  - foo=three
node-taint+:
  - charlie=delta:NoSchedule

```

これにより、最終的な設定は次のようになります：

```yaml
write-kubeconfig-mode: 777
token: boop
node-label:
  - other=what
  - foo=three
node-taint:
  - alice=bob:NoExecute
  - charlie=delta:NoSchedule
```

## すべてをまとめる

上記のすべてのオプションを組み合わせて、単一の例にすることができます。

`/etc/rancher/k3s/config.yaml`に`config.yaml`ファイルを作成します：

```yaml
token: "secret"
debug: true
```

次に、環境変数とフラグの組み合わせでインストールスクリプトを実行します：

```bash
curl -sfL https://get.k3s.io | K3S_KUBECONFIG_MODE="644" INSTALL_K3S_EXEC="server" sh -s - --flannel-backend none
```

または、すでにK3sバイナリをインストールしている場合：
```bash
K3S_KUBECONFIG_MODE="644" k3s server --flannel-backend none
```

これにより、次の設定を持つサーバーが作成されます：
- パーミッション`644`のkubeconfigファイル
- フランネルバックエンドが`none`に設定
- トークンが`secret`に設定
- デバッグログが有効