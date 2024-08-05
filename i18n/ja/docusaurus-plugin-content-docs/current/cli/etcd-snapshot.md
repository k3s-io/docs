---
title: etcd-snapshot
---

# k3s etcd-snapshot

:::info Version Gate

[v1.19.1+k3s1](https://github.com/k3s-io/k3s/releases/tag/v1.19.1%2Bk3s1)から利用可能

:::

このセクションでは、K3sの組み込みetcdデータストアのバックアップを作成し、バックアップからクラスターを復元する方法を学びます。

#### スナップショットの作成

スナップショットはデフォルトで有効になっており、システム時間の00:00と12:00に実行され、5つのスナップショットが保持されます。スナップショットの間隔や保持するスナップショットの数を設定するには、[オプション](#options)を参照してください。

スナップショットディレクトリのデフォルトは`${data-dir}/server/db/snapshots`です。data-dirの値はデフォルトで`/var/lib/rancher/k3s`に設定されており、`--data-dir`フラグを設定することで変更できます。

#### スナップショットからクラスターを復元する

K3sがバックアップから復元されると、古いデータディレクトリは`${data-dir}/server/db/etcd-old/`に移動されます。その後、K3sは新しいデータディレクトリを作成し、新しいK3sクラスターを1つのetcdメンバーで開始してスナップショットを復元しようとします。

バックアップからクラスターを復元するには：

<Tabs>
<TabItem value="シングルサーバー">

`--cluster-reset`オプションと`--cluster-reset-restore-path`を指定してK3sを実行します：

```bash
k3s server \
  --cluster-reset \
  --cluster-reset-restore-path=<PATH-TO-SNAPSHOT>
```

**結果:** ログにK3sをフラグなしで再起動できるというメッセージが表示されます。再度k3sを開始すると、指定されたスナップショットから正常に実行され、復元されます。

</TabItem>

<TabItem value="高可用性">

この例では、3つのサーバー`S1`、`S2`、および`S3`があります。スナップショットは`S1`にあります。

1. `S1`で、`--cluster-reset`オプションと`--cluster-reset-restore-path`を指定してK3sを開始します：

    ```bash
    k3s server \
      --cluster-reset \
      --cluster-reset-restore-path=<PATH-TO-SNAPSHOT>
    ```

    **結果:** ログにK3sをフラグなしで再起動できるというメッセージが表示されます。

2. `S2`と`S3`で、K3sを停止します。その後、データディレクトリ`/var/lib/rancher/k3s/server/db/`を削除します：

    ```bash
    systemctl stop k3s
    rm -rf /var/lib/rancher/k3s/server/db/
    ```

3. `S1`で、再度K3sを開始します：

    ```bash
    systemctl start k3s
    ```

4. `S2`と`S3`で、再度K3sを開始して復元されたクラスターに参加します：

    ```bash
    systemctl start k3s
    ```

</TabItem>
</Tabs>

#### オプション

これらのオプションはコマンドラインで渡すことも、[設定ファイル](../installation/configuration.md#configuration-file)で使用することもできます。

| オプション | 説明 |
| ----------- | --------------- |
| `--etcd-disable-snapshots` | 自動etcdスナップショットを無効にする |
| `--etcd-snapshot-schedule-cron` 値  |  スナップショット間隔のcron形式。例：5時間ごと `0 */5 * * *`（デフォルト：`0 */12 * * *`） |
| `--etcd-snapshot-retention` 値  | 保持するスナップショットの数（デフォルト：5） |
| `--etcd-snapshot-dir` 値  | DBスナップショットを保存するディレクトリ。（デフォルトの場所：`${data-dir}/db/snapshots`） |
| `--cluster-reset`  | すべてのピアを忘れて新しいクラスターの唯一のメンバーになる。環境変数`[$K3S_CLUSTER_RESET]`でも設定可能。 |
| `--cluster-reset-restore-path` 値 | 復元するスナップショットファイルのパス |

#### S3互換APIサポート

K3sは、S3互換APIを持つシステムにetcdスナップショットを保存および復元することをサポートしています。S3サポートは、オンデマンドおよびスケジュールされたスナップショットの両方で利用可能です。

以下の引数は`server`サブコマンドに追加されています。これらのフラグは`etcd-snapshot`サブコマンドにも存在しますが、冗長性を避けるために`--etcd-s3`部分は削除されています。

| オプション | 説明 |
| ----------- | --------------- |
| `--etcd-s3` | S3へのバックアップを有効にする |
| `--etcd-s3-endpoint` | S3エンドポイントURL |
| `--etcd-s3-endpoint-ca` | S3エンドポイントに接続するためのカスタムCA証明書 |
| `--etcd-s3-skip-ssl-verify` | S3 SSL証明書の検証を無効にする |
| `--etcd-s3-access-key` | S3アクセスキー |
| `--etcd-s3-secret-key` | S3シークレットキー |
| `--etcd-s3-bucket` | S3バケット名 |
| `--etcd-s3-region` | S3リージョン/バケットの場所（オプション）。デフォルトはus-east-1 |
| `--etcd-s3-folder` | S3フォルダー |

オンデマンドでetcdスナップショットを作成し、S3に保存するには：

```bash
k3s etcd-snapshot save \
  --s3 \
  --s3-bucket=<S3-BUCKET-NAME> \
  --s3-access-key=<S3-ACCESS-KEY> \
  --s3-secret-key=<S3-SECRET-KEY>
```

オンデマンドでS3からetcdスナップショットを復元するには、まずK3sが実行されていないことを確認します。その後、以下のコマンドを実行します：

```bash
k3s server \
  --cluster-init \
  --cluster-reset \
  --etcd-s3 \
  --cluster-reset-restore-path=<SNAPSHOT-NAME> \
  --etcd-s3-bucket=<S3-BUCKET-NAME> \
  --etcd-s3-access-key=<S3-ACCESS-KEY> \
  --etcd-s3-secret-key=<S3-SECRET-KEY>
```

#### Etcdスナップショットと復元のサブコマンド

k3sは、etcdスナップショットを操作するための一連のサブコマンドをサポートしています。

| サブコマンド | 説明 |
| ----------- | --------------- |
| delete      |  指定されたスナップショットを削除 |
| ls, list, l |  スナップショットの一覧表示 |
| prune       |  設定された保持数を超えるスナップショットを削除 |
| save        |  即時のetcdスナップショットをトリガー |

:::note
`save`サブコマンドは`k3s etcd-snapshot`と同じです。後者は最終的に前者に置き換えられる予定です。
:::

これらのコマンドは、etcdスナップショットがローカルに保存されている場合でも、S3互換のオブジェクトストアに保存されている場合でも、期待通りに動作します。

etcdスナップショットのサブコマンドに関する追加情報は、`k3s etcd-snapshot`を実行して確認してください。

S3からスナップショットを削除します。

```bash
k3s etcd-snapshot delete          \
  --s3                            \
  --s3-bucket=<S3-BUCKET-NAME>    \
  --s3-access-key=<S3-ACCESS-KEY> \
  --s3-secret-key=<S3-SECRET-KEY> \
  <SNAPSHOT-NAME>
```

デフォルトの保持ポリシー（5）でローカルスナップショットを削除します。`prune`サブコマンドには、デフォルトの保持ポリシーを上書きするための追加フラグ`--snapshot-retention`があります。

```bash
k3s etcd-snapshot prune
```

```bash
k3s etcd-snapshot prune --snapshot-retention 10
```