---
title: 環境変数
---

[クイックスタートガイド](../quick-start.md)で述べたように、https://get.k3s.io で利用可能なインストールスクリプトを使用して、systemdおよびopenrcベースのシステムにK3sをサービスとしてインストールできます。

このコマンドの最も簡単な形式は次のとおりです：

```bash
curl -sfL https://get.k3s.io | sh -
```

この方法を使用してK3sをインストールする場合、次の環境変数を使用してインストールを構成できます：

| 環境変数 | 説明 |
|-----------------------------|---------------------------------------------|
| `INSTALL_K3S_SKIP_DOWNLOAD` | trueに設定すると、K3sのハッシュまたはバイナリをダウンロードしません。 |
| `INSTALL_K3S_SYMLINK` | デフォルトでは、パスにコマンドが存在しない場合、kubectl、crictl、およびctrバイナリのシンボリックリンクを作成します。'skip'に設定するとシンボリックリンクを作成せず、'force'に設定すると上書きします。 |
| `INSTALL_K3S_SKIP_ENABLE` | trueに設定すると、K3sサービスを有効化または開始しません。 |
| `INSTALL_K3S_SKIP_START` | trueに設定すると、K3sサービスを開始しません。 |
| `INSTALL_K3S_VERSION` | GithubからダウンロードするK3sのバージョン。指定しない場合は安定版チャネルからダウンロードを試みます。 |
| `INSTALL_K3S_BIN_DIR` | K3sバイナリ、リンク、およびアンインストールスクリプトをインストールするディレクトリ。デフォルトは`/usr/local/bin`です。 |
| `INSTALL_K3S_BIN_DIR_READ_ONLY` | trueに設定すると、`INSTALL_K3S_BIN_DIR`にファイルを書き込みません。`INSTALL_K3S_SKIP_DOWNLOAD=true`を強制設定します。 |
| `INSTALL_K3S_SYSTEMD_DIR` | systemdサービスおよび環境ファイルをインストールするディレクトリ。デフォルトは`/etc/systemd/system`です。 |
| `INSTALL_K3S_EXEC` | サービスでK3sを起動するためのフラグ付きコマンド。コマンドが指定されておらず、`K3S_URL`が設定されている場合、デフォルトは「agent」です。`K3S_URL`が設定されていない場合、デフォルトは「server」です。詳細は[この例](../installation/configuration.md#configuration-with-install-script)を参照してください。 |
| `INSTALL_K3S_NAME` | 作成するsystemdサービスの名前。k3sをサーバーとして実行する場合はデフォルトで「k3s」、エージェントとして実行する場合は「k3s-agent」になります。指定された場合、名前の前に「k3s-」が付加されます。 |
| `INSTALL_K3S_TYPE` | 作成するsystemdサービスのタイプ。指定されていない場合、K3sの実行コマンドからデフォルトが設定されます。 |
| `INSTALL_K3S_SELINUX_WARN` | trueに設定すると、k3s-selinuxポリシーが見つからない場合でも続行します。 |
| `INSTALL_K3S_SKIP_SELINUX_RPM` | trueに設定すると、k3s RPMの自動インストールをスキップします。 |
| `INSTALL_K3S_CHANNEL_URL` | K3sダウンロードURLを取得するためのチャネルURL。デフォルトはhttps://update.k3s.io/v1-release/channelsです。 |
| `INSTALL_K3S_CHANNEL` | K3sダウンロードURLを取得するためのチャネル。デフォルトは「stable」です。オプションには`stable`、`latest`、`testing`があります。 |

次の例は、前述の環境変数をオプションとして（パイプの後に）配置する方法を示しています：

```bash
curl -sfL https://get.k3s.io | INSTALL_K3S_CHANNEL=latest sh -
```

`K3S_`で始まる環境変数は、systemdおよびopenrcサービスで使用するために保持されます。

`K3S_URL`を設定し、明示的に実行コマンドを設定しない場合、コマンドはデフォルトで「agent」になります。

エージェントを実行する場合、`K3S_TOKEN`も設定する必要があります。