---
title: "エアギャップインストール"
---

K3sをエアギャップ環境でインストールするには、2つの方法があります。エアギャップ環境とは、インターネットに直接接続されていない環境のことです。プライベートレジストリをデプロイしてdocker.ioをミラーリングするか、小規模クラスター用のイメージを手動でデプロイすることができます。

## イメージのロード

### プライベートレジストリ方式

これらの手順は、エアギャップ環境でノードを既に作成し、コンテナランタイムとしてバンドルされたcontainerdを使用し、環境内にOCI準拠のプライベートレジストリが利用可能であることを前提としています。

まだプライベートDockerレジストリを設定していない場合は、[公式レジストリドキュメント](https://docs.docker.com/registry/deploying/#run-an-externally-accessible-registry)を参照してください。

#### レジストリYAMLの作成とイメージのプッシュ

1. 実行するK3sのバージョンに対応するアーキテクチャ用のイメージアーカイブを[リリース](https://github.com/k3s-io/k3s/releases)ページから取得します。
2. `docker image load k3s-airgap-images-amd64.tar.zst`を使用して、tarファイルからDockerにイメージをインポートします。
3. `docker tag`と`docker push`を使用して、ロードしたイメージを再タグ付けし、プライベートレジストリにプッシュします。
4. [プライベートレジストリの設定](private-registry.md)ガイドに従って、`registries.yaml`ファイルを作成および設定します。
5. 以下の[Install K3s](#install-k3s)セクションに進みます。

### 手動デプロイ方式

これらの手順は、エアギャップ環境でノードを既に作成し、コンテナランタイムとしてバンドルされたcontainerdを使用し、プライベートレジストリを使用できない、または使用したくない場合を前提としています。

この方法では、必要なイメージを各ノードに手動でデプロイする必要があり、プライベートレジストリを実行するのが現実的でないエッジデプロイメントに適しています。

#### イメージディレクトリとエアギャップイメージtarballの準備

1. 実行するK3sのバージョンに対応するアーキテクチャ用のイメージアーカイブを[リリース](https://github.com/k3s-io/k3s/releases)ページから取得します。
2. エージェントのイメージディレクトリにイメージアーカイブをダウンロードします。例：
  ```bash
  sudo mkdir -p /var/lib/rancher/k3s/agent/images/
  sudo curl -L -o /var/lib/rancher/k3s/agent/images/k3s-airgap-images-amd64.tar.zst "https://github.com/k3s-io/k3s/releases/download/v1.29.1-rc2%2Bk3s1/k3s-airgap-images-amd64.tar.zst"
  ```
3. 以下の[Install K3s](#install-k3s)セクションに進みます。

### 埋め込みレジストリミラー

:::info バージョンゲート
埋め込みレジストリミラーは、2024年1月のリリースから実験的機能として利用可能です：v1.26.13+k3s1、v1.27.10+k3s1、v1.28.6+k3s1、v1.29.1+k3s1
:::

K3sには、埋め込みの分散型OCI準拠のレジストリミラーが含まれています。
有効化して適切に設定すると、任意のノードのcontainerdイメージストアにあるイメージを、
外部イメージレジストリにアクセスせずに他のクラスターのメンバーがプルできます。

ミラーリングされたイメージは、上流のレジストリ、レジストリミラー、またはエアギャップイメージtarballから取得できます。
埋め込み分散レジストリミラーの有効化に関する詳細は、[埋め込みレジストリミラー](./registry-mirror.md)ドキュメントを参照してください。

## K3sのインストール

### 前提条件

K3sをインストールする前に、上記の[プライベートレジストリ方式](#private-registry-method)または[手動デプロイ方式](#manually-deploy-images-method)を完了して、K3sのインストールに必要なイメージを事前に準備してください。

#### バイナリ
- [リリース](https://github.com/k3s-io/k3s/releases)ページからK3sバイナリをダウンロードし、エアギャップノードごとに同じバージョンのバイナリを取得します。バイナリを`/usr/local/bin`に配置し、実行可能にします。
- [get.k3s.io](https://get.k3s.io)からK3sインストールスクリプトをダウンロードします。インストールスクリプトをエアギャップノードの任意の場所に配置し、`install.sh`と名付けます。

#### デフォルトネットワークルート
ノードにデフォルトルートを持つインターフェースがない場合は、デフォルトルートを設定する必要があります。ダミーインターフェースを介したブラックホールルートでも構いません。K3sはデフォルトルートを必要とし、ノードのプライマリIPを自動検出し、kube-proxyのClusterIPルーティングが正常に機能するためです。ダミールートを追加するには、以下を実行します：
  ```
  ip link add dummy0 type dummy
  ip link set dummy0 up
  ip addr add 203.0.113.254/31 dev dummy0
  ip route add default via 203.0.113.255 dev dummy0 metric 1000
  ```

`INSTALL_K3S_SKIP_DOWNLOAD`環境変数を使用してK3sスクリプトを実行すると、K3sはローカルバージョンのスクリプトとバイナリを使用します。

#### SELinux RPM

SELinuxを有効にしてK3sをデプロイする場合は、適切なk3s-selinux RPMをすべてのノードにインストールする必要があります。最新バージョンのRPMは[こちら](https://github.com/k3s-io/k3s-selinux/releases/latest)で見つけることができます。例えば、CentOS 8の場合：

```bash
インターネットにアクセス可能なマシンで：
curl -LO https://github.com/k3s-io/k3s-selinux/releases/download/v1.4.stable.1/k3s-selinux-1.4-1.el8.noarch.rpm

# RPMをエアギャップマシンに転送
エアギャップマシンで：
sudo yum install ./k3s-selinux-1.4-1.el8.noarch.rpm
```

詳細は[SELinux](../advanced.md#selinux-support)セクションを参照してください。

### エアギャップ環境でのK3sのインストール

以下の手順に従って、1台以上のサーバーにK3sをインストールできます。

<Tabs>
<TabItem value="シングルサーバー構成" default>

シングルサーバーにK3sをインストールするには、サーバーノードで以下を実行します：

```bash
INSTALL_K3S_SKIP_DOWNLOAD=true ./install.sh
```

追加のエージェントを追加するには、各エージェントノードで以下を実行します：

```bash
INSTALL_K3S_SKIP_DOWNLOAD=true K3S_URL=https://<SERVER_IP>:6443 K3S_TOKEN=<YOUR_TOKEN> ./install.sh
```

:::note
サーバーのトークンは通常、`/var/lib/rancher/k3s/server/token`にあります。
:::

</TabItem>
<TabItem value="高可用性構成" default>

[外部DBを使用した高可用性](../datastore/ha.md)または[埋め込みDBを使用した高可用性](../datastore/ha-embedded.md)ガイドを参照してください。インストールコマンドを調整して`INSTALL_K3S_SKIP_DOWNLOAD=true`を指定し、インストールスクリプトをcurlではなくローカルで実行します。また、`INSTALL_K3S_EXEC='args'`を使用してk3sに引数を渡します。

例えば、外部DBを使用した高可用性ガイドのステップ2では、以下のように記載されています：

```bash
curl -sfL https://get.k3s.io | sh -s - server \
  --token=SECRET \
  --datastore-endpoint="mysql://username:password@tcp(hostname:3306)/database-name"
```

これを以下のように変更します：

```bash
INSTALL_K3S_SKIP_DOWNLOAD=true INSTALL_K3S_EXEC='server --token=SECRET' \
K3S_DATASTORE_ENDPOINT='mysql://username:password@tcp(hostname:3306)/database-name' \
./install.sh
```

</TabItem>
</Tabs>

:::note
K3sの`--resolv-conf`フラグはkubeletに渡され、ホストに上流のネームサーバーが設定されていないエアギャップネットワークでのポッドDNS解決の設定に役立つ場合があります。
:::

## アップグレード

### インストールスクリプト方式

エアギャップ環境のアップグレードは、以下の方法で行うことができます：

1. アップグレードするK3sのバージョンに対応する新しいエアギャップイメージ（tarファイル）を[リリース](https://github.com/k3s-io/k3s/releases)ページからダウンロードします。各ノードの`/var/lib/rancher/k3s/agent/images/`ディレクトリにtarファイルを配置し、古いtarファイルを削除します。
2. 各ノードの`/usr/local/bin`にある古いK3sバイナリを新しいものに置き換えます。https://get.k3s.ioからインストールスクリプトをコピーし、前回のリリース以降に変更があった可能性があるため、再度スクリプトを実行します。同じ環境変数を使用してスクリプトを実行します。
3. K3sサービスを再起動します（インストーラーによって自動的に再起動されない場合）。

### 自動アップグレード方式

K3sは[自動アップグレード](../upgrades/automated.md)をサポートしています。エアギャップ環境でこれを有効にするには、必要なイメージがプライベートレジストリにあることを確認する必要があります。

アップグレードするK3sのバージョンに対応するrancher/k3s-upgradeのバージョンが必要です。注意点として、K3sリリースの`+`はDockerイメージではサポートされていないため、イメージタグでは`-`に置き換えられます。

また、system-upgrade-controllerマニフェストYAMLに指定されているsystem-upgrade-controllerとkubectlのバージョンも必要です。最新のsystem-upgrade-controllerリリースは[こちら](https://github.com/rancher/system-upgrade-controller/releases/latest)で確認し、必要なバージョンをプライベートレジストリにプッシュします。例えば、system-upgrade-controllerのv0.4.0リリースでは、以下のイメージがマニフェストYAMLに指定されています：

```
rancher/system-upgrade-controller:v0.4.0
rancher/kubectl:v0.17.0
```

必要なrancher/k3s-upgrade、rancher/system-upgrade-controller、およびrancher/kubectlイメージをプライベートレジストリに追加したら、[自動アップグレード](../upgrades/automated.md)ガイドに従ってください。