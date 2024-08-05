---
title: server
---

# k3s サーバー

このセクションでは、K3s サーバーの設定方法を学びます。

サーバーはエージェントも実行するため、[`k3s エージェント` ドキュメント](agent.md)に記載されているすべての設定オプションはサーバーでもサポートされています。

オプションは CLI フラグとしてこのページに記載されていますが、設定ファイルオプションとしても渡すことができます。YAML 設定ファイルの使用については、[設定ファイル](../installation/configuration.md#configuration-file)のドキュメントを参照してください。

## 重要な設定値

以下のオプションは、クラスタ内のすべてのサーバーで同じ値に設定する必要があります。これを行わないと、埋め込み etcd を使用している場合は新しいサーバーがクラスタに参加できなくなり、外部データストアを使用している場合はクラスタの動作が不正確になります。

* `--agent-token`
* `--cluster-cidr`
* `--cluster-dns`
* `--cluster-domain`
* `--disable-cloud-controller`
* `--disable-helm-controller`
* `--disable-network-policy`
* `--disable=servicelb` *注: 他のパッケージ化されたコンポーネントはサーバーごとに無効にすることができます*
* `--egress-selector-mode`
* `--embedded-registry`
* `--flannel-backend`
* `--flannel-external-ip`
* `--flannel-ipv6-masq`
* `--secrets-encryption`
* `--service-cidr`

## よく使用されるオプション

### データベース

| フラグ                                  | 環境変数                     | デフォルト                            | 説明                                                                           |
|---------------------------------------|--------------------------|------------------------------------|-------------------------------------------------------------------------------|
| `--datastore-endpoint` 値             | `K3S_DATASTORE_ENDPOINT` |                                    | etcd、Mysql、Postgres、または Sqlite のデータソース名を指定                     |
| `--datastore-cafile` 値               | `K3S_DATASTORE_CAFILE`   |                                    | データストアバックエンド通信を保護するために使用される TLS 証明書ファイル       |
| `--datastore-certfile` 値             | `K3S_DATASTORE_CERTFILE` |                                    | データストアバックエンド通信を保護するために使用される TLS 認証ファイル         |
| `--datastore-keyfile` 値              | `K3S_DATASTORE_KEYFILE`  |                                    | データストアバックエンド通信を保護するために使用される TLS キーファイル         |
| `--etcd-expose-metrics`               |                          | false                              | クライアントインターフェースに etcd メトリクスを公開                           |
| `--etcd-disable-snapshots`            |                          | false                              | 自動 etcd スナップショットを無効にする                                         |
| `--etcd-snapshot-name` 値             |                          | "etcd-snapshot-&lt;unix-timestamp&gt;" | etcd スナップショットのベース名を設定                                          |
| `--etcd-snapshot-schedule-cron` 値    |                          | "0 */12 \* \* \*"                  | cron 仕様でのスナップショット間隔時間。例: 5 時間ごと '0 */5 _ \* _'         |
| `--etcd-snapshot-retention` 値        |                          | 5                                  | 保持するスナップショットの数                                                   |
| `--etcd-snapshot-dir` 値              |                          | $\{data-dir\}/db/snapshots         | DB スナップショットを保存するディレクトリ                                      |
| `--etcd-s3`                           |                          |                                    | S3 へのバックアップを有効にする                                               |
| `--etcd-s3-endpoint` 値               |                          | "s3.amazonaws.com"                 | S3 エンドポイント URL                                                         |
| `--etcd-s3-endpoint-ca` 値            |                          |                                    | S3 エンドポイントに接続するためのカスタム CA 証明書                            |
| `--etcd-s3-skip-ssl-verify`           |                          |                                    | S3 SSL 証明書の検証を無効にする                                               |
| `--etcd-s3-access-key` 値             | `AWS_ACCESS_KEY_ID`      |                                    | S3 アクセスキー                                                               |
| `--etcd-s3-secret-key` 値             | `AWS_SECRET_ACCESS_KEY`  |                                    | S3 シークレットキー                                                           |
| `--etcd-s3-bucket` 値                 |                          |                                    | S3 バケット名                                                                 |
| `--etcd-s3-region` 値                 |                          | "us-east-1"                        | S3 リージョン / バケットの場所 (オプション)                                    |
| `--etcd-s3-folder` 値                 |                          |                                    | S3 フォルダー                                                                 |
| `--etcd-s3-insecure`                  |                          |                                    | HTTPS 経由の S3 を無効にする                                                  |
| `--etcd-s3-timeout` 値                |                          | 5m0s                               | S3 タイムアウト (デフォルト: 5m0s)                                             |

### クラスタオプション

| フラグ                      | 環境変数 | 説明                                               |
| ------------------------- | -------------------- | --------------------------------------------------------- |
| `--token` 値, `-t` 値 | `K3S_TOKEN`          | サーバーまたはエージェントをクラスタに参加させるために使用される共有シークレット |
| `--token-file` 値      | `K3S_TOKEN_FILE`     | クラスタシークレット/トークンを含むファイル                  |
| `--agent-token` 値        |`K3S_AGENT_TOKEN` |           エージェントをクラスタに参加させるために使用される共有シークレット (サーバーには使用されません)
| `--agent-token-file` 値   |`K3S_AGENT_TOKEN_FILE` |           エージェントシークレットを含むファイル
| `--server` 値             | `K3S_URL` | クラスタに参加するために接続するサーバー
| `--cluster-init`             | `K3S_CLUSTER_INIT` |           埋め込み Etcd を使用して新しいクラスタを初期化
| `--cluster-reset`            |  `K3S_CLUSTER_RESET` |           すべてのピアを忘れて新しいクラスタの唯一のメンバーになる

### 管理用 Kubeconfig オプション

| フラグ | 環境変数 | 説明 |
|------|----------------------|-------------|
|  `--write-kubeconfig` 値, `-o` 値  | `K3S_KUBECONFIG_OUTPUT` | 管理クライアントの kubeconfig をこのファイルに書き込む |
|  `--write-kubeconfig-mode` 値       | `K3S_KUBECONFIG_MODE`   | この[モード](https://en.wikipedia.org/wiki/Chmod)で kubeconfig を書き込む。kubeconfig ファイルは root によって所有され、デフォルトモード 600 で書き込まれます。モードを 644 に変更すると、ホスト上の他の特権のないユーザーが読み取れるようになります。 |

## 高度なオプション

### ロギング

| フラグ                    | デフォルト | 説明                                                                       |
| ----------------------- | ------- | --------------------------------------------------------------------------------- |
| `--debug`               | N/A     | デバッグログをオンにする                                                                |
| `-v` 値              | 0       | ログレベルの詳細度の数値                                                |
| `--vmodule` 値       | N/A     | ファイルフィルタリングログの FILE_PATTERN=LOG_LEVEL 設定のカンマ区切りリスト |
| `--log` 値, `-l` 値 | N/A     | ファイルにログを記録                                                                       |
| `--alsologtostderr`     | N/A     | ファイル (設定されている場合) と標準エラーにログを記録                                    |

### リスナー

| フラグ                        | デフォルト                  | 説明                                                                                  |
| --------------------------- | ------------------------ | -------------------------------------------------------------------------------------------- |
| `--bind-address` 値      | 0.0.0.0                  | k3s バインドアドレス                                                                             |
| `--https-listen-port` 値 | 6443                     | HTTPS リッスンポート                                                                            |
| `--advertise-address` 値 | node-external-ip/node-ip | apiserver がサービスエンドポイントとして広告する IPv4/IPv6 アドレス<br/>注: プライマリ `service-cidr` IP 範囲は広告されるアドレスと同じアドレスファミリである必要があります |
| `--advertise-port` 値    | listen-port/0            | apiserver がクラスタのメンバーに広告するために使用するポート                              |
| `--tls-san` 値           | N/A                      | TLS 証明書のサブジェクト代替名として追加のホスト名または IPv4/IPv6 アドレスを追加 |

### データ

| フラグ                         | デフォルト                                                      | 説明          |
| ---------------------------- | ------------------------------------------------------------ | -------------------- |
| `--data-dir` 値, `-d` 値 | `/var/lib/rancher/k3s` または root でない場合は `${HOME}/.rancher/k3s` | 状態を保持するフォルダー |

### シークレット暗号化

| フラグ                   | デフォルト | 説明                      |
| ---------------------- | ------- | -------------------------------- |
| `--secrets-encryption` | false   | シークレットの静止時の暗号化を有効にする |


### ネットワーキング

| フラグ                              | デフォルト         | 説明                                                                                |
| --------------------------------- | --------------- | ------------------------------------------------------------------------------------------ |
| `--cluster-cidr` value            | "10.42.0.0/16"  | Pod IPに使用するIPv4/IPv6ネットワークCIDR                                                 |
| `--service-cidr` value            | "10.43.0.0/16"  | サービスIPに使用するIPv4/IPv6ネットワークCIDR                                             |
| `--service-node-port-range` value | "30000-32767"   | NodePort可視性を持つサービスのために予約するポート範囲                                |
| `--cluster-dns` value             | "10.43.0.10"    | corednsサービスのためのIPv4クラスターIP。service-cidr範囲内である必要があります                  |
| `--cluster-domain` value          | "cluster.local" | クラスタードメイン                                                                             |
| `--flannel-backend` value         | "vxlan"         | 'none', 'vxlan', 'ipsec'(非推奨), 'host-gw', 'wireguard-native', または 'wireguard'(非推奨) のいずれか |
| `--flannel-ipv6-masq`             | "N/A"           | PodのためのIPv6マスカレードを有効にする                                                           |
| `--flannel-external-ip`           | "N/A"           | Flannelトラフィックのためにノードの外部IPアドレスを使用                                         |
| `--servicelb-namespace` value     | "kube-system"   | servicelbコンポーネントのPodのネームスペース                                          |
| `--egress-selector-mode` value    | "agent"         | 次のいずれかでなければなりません: <ul><li>disabled: apiserverはノードと通信するためにエージェントトンネルを使用しません。サーバーがエージェントを実行し、kubeletに直接接続できる必要があります。そうでないと、apiserverはサービスエンドポイントにアクセスしたり、kubectl execやkubectl logsを実行できません。</li><li>agent: apiserverはノードと通信するためにエージェントトンネルを使用します。ノードはループバックアドレスからのトンネル接続を許可します。サーバーもエージェントを実行する必要があります。そうでないと、apiserverはサービスエンドポイントにアクセスできません。k3sの歴史的なデフォルトです。</li><li> pod: apiserverはノードとサービスエンドポイントと通信するためにエージェントトンネルを使用し、ノードを監視して正しいエージェントにエンドポイント接続をルーティングします。ノードはループバックアドレスまたはノードに割り当てられたCIDRからのトンネル接続を許可します。</li><li>  cluster: apiserverはノードとサービスエンドポイントと通信するためにエージェントトンネルを使用し、エンドポイントを監視して正しいエージェントにエンドポイント接続をルーティングします。ノードはループバックアドレスまたは設定されたクラスタCIDR範囲からのトンネル接続を許可します。</li></ul> |


### ストレージクラス

| フラグ                                 | 説明                                                    |
| ------------------------------------ | -------------------------------------------------------------- |
| `--default-local-storage-path` value | ローカルプロビジョナーストレージクラスのデフォルトローカルストレージパス |

### Kubernetesコンポーネント

| フラグ                         | 説明                                                                                                                                   |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `--disable` value            | "[`--disable`フラグの使用](../installation/packaged-components.md#using-the---disable-flag)" を参照 |
| `--disable-scheduler`        | Kubernetesデフォルトスケジューラを無効にする              |
| `--disable-cloud-controller` | k3sデフォルトクラウドコントローラーマネージャーを無効にする      |
| `--disable-kube-proxy`       | kube-proxyの実行を無効にする                        |
| `--disable-network-policy`   | k3sデフォルトネットワークポリシーコントローラーを無効にする     |
| `--disable-helm-controller` | Helmコントローラーを無効にする |


### Kubernetesプロセスのカスタマイズフラグ

| フラグ                                        | 説明                                               |
| ------------------------------------------- | --------------------------------------------------------- |
| `--etcd-arg` value                          | etcdプロセスのカスタマイズフラグ                          |
| `--kube-apiserver-arg` value                | kube-apiserverプロセスのカスタマイズフラグ                |
| `--kube-scheduler-arg` value                | kube-schedulerプロセスのカスタマイズフラグ                |
| `--kube-controller-manager-arg` value       | kube-controller-managerプロセスのカスタマイズフラグ       |
| `--kube-cloud-controller-manager-arg` value | kube-cloud-controller-managerプロセスのカスタマイズフラグ |
| `--kubelet-arg` value    | kubeletプロセスのカスタマイズフラグ    |
| `--kube-proxy-arg` value | kube-proxyプロセスのカスタマイズフラグ |

### 実験的オプション

| フラグ                   | 説明                              |
| ---------------------- | ---------------------------------------- |
| `--rootless`           | ルートレスで実行                             |
| `--enable-pprof`       | スーパーバイザーポートでpprofエンドポイントを有効にする |
| `--docker`             | containerdの代わりにcri-dockerdを使用    |
| `--prefer-bundled-bin` | ホストバイナリよりもバンドルされたユーザースペースバイナリを優先 |
| `--disable-agent`      | "[エージェントレスサーバーの実行（実験的）](../advanced.md#running-agentless-servers-experimental)" を参照 |
| `--embedded-registry`  | "[埋め込みレジストリミラー](../installation/registry-mirror.md)" を参照 |


### 非推奨オプション

| フラグ                                    | 環境変数 | 説明                                                                                                 |
| --------------------------------------- | -------------------- | ----------------------------------------------------------------------------------------------------------- |
| `--no-flannel`                          | N/A                  | `--flannel-backend=none` を使用                                                                                  |
| `--no-deploy` value                     | N/A                  | `--disable` を使用 |
| `--cluster-secret` value                | `K3S_CLUSTER_SECRET` | `--token` を使用                                                                                                 |
| `--flannel-backend` wireguard           | N/A                  | `--flannel-backend=wireguard-native` を使用                                                                      |
| `--flannel-backend` value=option1=value | N/A                  | バックエンド構成でflannel構成ファイルを指定するには `--flannel-conf` を使用                               |


## K3sサーバーCLIヘルプ

> 以下に角括弧で表示されるオプション（例：`[$K3S_TOKEN]`）は、その名前の環境変数として渡すことができることを意味します。

```bash
NAME:
   k3s server - 管理サーバーを実行

USAGE:
   k3s server [OPTIONS]

OPTIONS:
   --config FILE, -c FILE                     (config) FILEから設定を読み込む（デフォルト: "/etc/rancher/k3s/config.yaml") [$K3S_CONFIG_FILE]
   --debug                                    (logging) デバッグログを有効にする [$K3S_DEBUG]
   -v value                                   (logging) ログレベルの詳細度の数値（デフォルト: 0）
   --vmodule value                            (logging) ファイルフィルタリングログのためのFILE_PATTERN=LOG_LEVEL設定のカンマ区切りリスト
   --log value, -l value                      (logging) ファイルにログを記録
   --alsologtostderr                          (logging) ファイルに加えて標準エラーにもログを記録（設定されている場合）
   --bind-address value                       (listener) k3sバインドアドレス（デフォルト: 0.0.0.0）
   --https-listen-port value                  (listener) HTTPSリッスンポート（デフォルト: 6443）
   --advertise-address value                  (listener) クラスターのメンバーに広告するためにapiserverが使用するIPv4アドレス（デフォルト: node-external-ip/node-ip）
   --advertise-port value                     (listener) クラスターのメンバーに広告するためにapiserverが使用するポート（デフォルト: listen-port） (デフォルト: 0)
   --tls-san value                            (listener) サーバーTLS証明書のサブジェクト代替名として追加のホスト名またはIPv4/IPv6アドレスを追加
   --data-dir value, -d value                 (data) 状態を保持するフォルダー（デフォルト: /var/lib/rancher/k3s または ルートでない場合は ${HOME}/.rancher/k3s）
   --cluster-cidr value                       (networking) Pod IPに使用するIPv4/IPv6ネットワークCIDR（デフォルト: 10.42.0.0/16）
   --service-cidr value                       (networking) サービスIPに使用するIPv4/IPv6ネットワークCIDR（デフォルト: 10.43.0.0/16）
   --service-node-port-range value            (networking) NodePort可視性を持つサービスのために予約するポート範囲（デフォルト: "30000-32767")
   --cluster-dns value                        (networking) corednsサービスのためのIPv4クラスターIP。service-cidr範囲内である必要があります（デフォルト: 10.43.0.10）
   --cluster-domain value                     (networking) クラスタードメイン（デフォルト: "cluster.local")
   --flannel-backend value                    (networking) backend<=option1=val1,option2=val2> ここでbackendは 'none', 'vxlan', 'ipsec' (非推奨), 'host-gw', 'wireguard-native', 'wireguard' (非推奨) のいずれか（デフォルト: "vxlan")
   --flannel-ipv6-masq                        (networking) PodのためのIPv6マスカレードを有効にする
   --flannel-external-ip                      (networking) Flannelトラフィックのためにノードの外部IPアドレスを使用
   --egress-selector-mode value               (networking) 'agent', 'cluster', 'pod', 'disabled' のいずれか（デフォルト: "agent")
   --servicelb-namespace value                (networking) servicelbコンポーネントのPodのネームスペース（デフォルト: "kube-system")
   --write-kubeconfig value, -o value         (client) 管理クライアントのためのkubeconfigを書き込むファイル [$K3S_KUBECONFIG_OUTPUT]
   --write-kubeconfig-mode value              (client) このモードでkubeconfigを書き込む [$K3S_KUBECONFIG_MODE]
   --token value, -t value                    (cluster) サーバーまたはエージェントをクラスターに参加させるために使用される共有シークレット [$K3S_TOKEN]
   --token-file value                         (cluster) トークンを含むファイル [$K3S_TOKEN_FILE]
```
```markdown
   --agent-token value                        (cluster) エージェントをクラスターに参加させるための共有シークレット。ただしサーバーには使用しない [$K3S_AGENT_TOKEN]
   --agent-token-file value                   (cluster) エージェントシークレットを含むファイル [$K3S_AGENT_TOKEN_FILE]
   --server value, -s value                   (cluster) クラスターに参加するために接続するサーバー [$K3S_URL]
   --cluster-init                             (cluster) 組み込みのEtcdを使用して新しいクラスターを初期化する [$K3S_CLUSTER_INIT]
   --cluster-reset                            (cluster) すべてのピアを忘れ、新しいクラスターの唯一のメンバーになる [$K3S_CLUSTER_RESET]
   --cluster-reset-restore-path value         (db) 復元するスナップショットファイルのパス
   --kube-apiserver-arg value                 (flags) kube-apiserverプロセスのカスタマイズフラグ
   --etcd-arg value                           (flags) etcdプロセスのカスタマイズフラグ
   --kube-controller-manager-arg value        (flags) kube-controller-managerプロセスのカスタマイズフラグ
   --kube-scheduler-arg value                 (flags) kube-schedulerプロセスのカスタマイズフラグ
   --kube-cloud-controller-manager-arg value  (flags) kube-cloud-controller-managerプロセスのカスタマイズフラグ
   --datastore-endpoint value                 (db) etcd、Mysql、Postgres、またはSqlite（デフォルト）のデータソース名を指定する [$K3S_DATASTORE_ENDPOINT]
   --datastore-cafile value                   (db) データストアバックエンド通信を保護するために使用されるTLS認証局ファイル [$K3S_DATASTORE_CAFILE]
   --datastore-certfile value                 (db) データストアバックエンド通信を保護するために使用されるTLS認証ファイル [$K3S_DATASTORE_CERTFILE]
   --datastore-keyfile value                  (db) データストアバックエンド通信を保護するために使用されるTLSキー ファイル [$K3S_DATASTORE_KEYFILE]
   --etcd-expose-metrics                      (db) クライアントインターフェースにetcdメトリクスを公開する (デフォルト: false)
   --etcd-disable-snapshots                   (db) 自動etcdスナップショットを無効にする
   --etcd-snapshot-name value                 (db) etcdスナップショットの基本名を設定する (デフォルト: etcd-snapshot-<unix-timestamp>) (デフォルト: "etcd-snapshot")
   --etcd-snapshot-schedule-cron value        (db) cron仕様でのスナップショット間隔時間。例: 5時間ごと '* */5 * * *' (デフォルト: "0 */12 * * *")
   --etcd-snapshot-retention value            (db) 保持するスナップショットの数 (デフォルト: 5)
   --etcd-snapshot-dir value                  (db) データベーススナップショットを保存するディレクトリ (デフォルト: ${data-dir}/db/snapshots)
   --etcd-snapshot-compress                   (db) etcdスナップショットを圧縮する
   --etcd-s3                                  (db) S3へのバックアップを有効にする
   --etcd-s3-endpoint value                   (db) S3エンドポイントURL (デフォルト: "s3.amazonaws.com")
   --etcd-s3-endpoint-ca value                (db) S3エンドポイントに接続するためのカスタムCA証明書
   --etcd-s3-skip-ssl-verify                  (db) S3 SSL証明書の検証を無効にする
   --etcd-s3-access-key value                 (db) S3アクセスキー [$AWS_ACCESS_KEY_ID]
   --etcd-s3-secret-key value                 (db) S3シークレットキー [$AWS_SECRET_ACCESS_KEY]
   --etcd-s3-bucket value                     (db) S3バケット名
   --etcd-s3-region value                     (db) S3リージョン/バケットの場所 (オプション) (デフォルト: "us-east-1")
   --etcd-s3-folder value                     (db) S3フォルダー
   --etcd-s3-insecure                         (db) HTTPSを使用しないS3を無効にする
   --etcd-s3-timeout value                    (db) S3タイムアウト (デフォルト: 5m0s)
   --default-local-storage-path value         (storage) ローカルプロビジョナーストレージクラスのデフォルトローカルストレージパス
   --disable value                            (components) パッケージ化されたコンポーネントをデプロイせず、デプロイされたコンポーネントを削除する (有効な項目: coredns, servicelb, traefik, local-storage, metrics-server)
   --disable-scheduler                        (components) Kubernetesのデフォルトスケジューラーを無効にする
   --disable-cloud-controller                 (components) k3sのデフォルトクラウドコントローラーマネージャーを無効にする
   --disable-kube-proxy                       (components) kube-proxyの実行を無効にする
   --disable-network-policy                   (components) k3sのデフォルトネットワークポリシーコントローラーを無効にする
   --disable-helm-controller                  (components) Helmコントローラーを無効にする
   --node-name value                          (agent/node) ノード名 [$K3S_NODE_NAME]
   --with-node-id                             (agent/node) ノード名にIDを追加する
   --node-label value                         (agent/node) ラベルのセットでkubeletを登録および開始する
   --node-taint value                         (agent/node) taintsのセットでkubeletを登録する
   --image-credential-provider-bin-dir value  (agent/node) クレデンシャルプロバイダープラグインバイナリが配置されているディレクトリのパス (デフォルト: "/var/lib/rancher/credentialprovider/bin")
   --image-credential-provider-config value   (agent/node) クレデンシャルプロバイダープラグインの設定ファイルのパス (デフォルト: "/var/lib/rancher/credentialprovider/config.yaml")
   --docker                                   (agent/runtime) (実験的) containerdの代わりにcri-dockerdを使用する
   --container-runtime-endpoint value         (agent/runtime) 組み込みのcontainerdを無効にし、指定されたパスのCRIソケットを使用する; --dockerと一緒に使用する場合、これはdockerソケットパスを設定する
   --pause-image value                        (agent/runtime) containerdまたはdockerサンドボックス用のカスタマイズされたpauseイメージ (デフォルト: "rancher/mirrored-pause:3.6")
   --snapshotter value                        (agent/runtime) デフォルトのcontainerdスナップショッターを上書きする (デフォルト: "overlayfs")
   --private-registry value                   (agent/runtime) プライベートレジストリ設定ファイル (デフォルト: "/etc/rancher/k3s/registries.yaml")
   --system-default-registry value            (agent/runtime) すべてのシステムイメージに使用されるプライベートレジストリ [$K3S_SYSTEM_DEFAULT_REGISTRY]
   --node-ip value, -i value                  (agent/networking) ノードの広告用IPv4/IPv6アドレス
   --node-external-ip value                   (agent/networking) ノードの広告用外部IPv4/IPv6アドレス
   --resolv-conf value                        (agent/networking) Kubeletのresolv.confファイル [$K3S_RESOLV_CONF]
   --flannel-iface value                      (agent/networking) デフォルトのflannelインターフェースを上書きする
   --flannel-conf value                       (agent/networking) デフォルトのflannel設定ファイルを上書きする
   --flannel-cni-conf value                   (agent/networking) デフォルトのflannel cni設定ファイルを上書きする
   --kubelet-arg value                        (agent/flags) kubeletプロセスのカスタマイズフラグ
   --kube-proxy-arg value                     (agent/flags) kube-proxyプロセスのカスタマイズフラグ
   --protect-kernel-defaults                  (agent/node) カーネルのチューニング動作。設定されている場合、カーネルのチューナブルがkubeletのデフォルトと異なる場合にエラーを発生させる。
   --secrets-encryption                       保存時のシークレット暗号化を有効にする
   --enable-pprof                             (実験的) スーパーバイザーポートでpprofエンドポイントを有効にする
   --rootless                                 (実験的) ルートレスで実行する
   --prefer-bundled-bin                       (実験的) ホストバイナリよりもバンドルされたユーザースペースバイナリを優先する
   --selinux                                  (agent/node) containerdでSELinuxを有効にする [$K3S_SELINUX]
   --lb-server-port value                     (agent/node) スーパーバイザークライアントロードバランサーのローカルポート。スーパーバイザーとapiserverが同じ場所にない場合、このポートより1つ少ない追加ポートもapiserverクライアントロードバランサーに使用される (デフォルト: 6444) [$K3S_LB_SERVER_PORT]
```