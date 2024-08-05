---
title: エージェント
---

# k3s エージェント

このセクションでは、K3sエージェントの設定方法を学びます。

サーバーもエージェントを実行するため、このページに記載されているすべてのフラグはサーバーでも使用可能です。

オプションはCLIフラグとしてこのページに記載されていますが、設定ファイルオプションとしても渡すことができます。YAML設定ファイルの使用方法については、[設定ファイル](../installation/configuration.md#configuration-file)のドキュメントを参照してください。

### ロギング

| フラグ                    | デフォルト | 説明                                                          |
| ----------------------- | ------- | -------------------------------------------------------------------- |
| `-v` 値              | 0       | ログレベルの冗長度の数値                                   |
| `--vmodule` 値       | N/A     | ファイルフィルタリングされたログのためのFILE_PATTERN=LOG_LEVEL設定のカンマ区切りリスト |
| `--log 値, -l` 値 | N/A     | ファイルにログを記録                                                          |
| `--alsologtostderr`     | N/A     | ファイルに設定されている場合、標準エラーにもログを記録                       |

### クラスターオプション

| フラグ                       | 環境変数 | 説明                          |
| -------------------------- | -------------------- | ------------------------------------ |
| `--token 値, -t` 値  | `K3S_TOKEN`          | 認証に使用するトークン      |
| `--token-file` 値       | `K3S_TOKEN_FILE`     | 認証に使用するトークンファイル |
| `--server 値, -s` 値 | `K3S_URL`            | 接続するサーバー                 |

### データ

| フラグ                         | デフォルト                | 説明          |
| ---------------------------- | ---------------------- | -------------------- |
| `--data-dir 値, -d` 値 | "/var/lib/rancher/k3s" | 状態を保持するフォルダー |

### ノード

| フラグ                        | 環境変数 | 説明                                                                                   |
| --------------------------- | -------------------- | --------------------------------------------------------------------------------------------- |
| `--node-name` 値         | `K3S_NODE_NAME`      | ノード名                                                                                     |
| `--with-node-id`            | N/A                  | ノード名にIDを追加                                                                        |
| `--node-label` 値        | N/A                  | ラベルのセットでkubeletを登録および開始                                           |
| `--node-taint` 値        | N/A                  | taintsのセットでkubeletを登録                                                        |
| `--protect-kernel-defaults` | N/A                  | カーネルのチューニング動作。設定されている場合、カーネルのチューナブルがkubeletのデフォルトと異なる場合にエラーを発生させます。 |
|   `--selinux` | `K3S_SELINUX` | containerdでSELinuxを有効にする |
|   `--lb-server-port` 値 | `K3S_LB_SERVER_PORT` | スーパーバイザークライアントのロードバランサーのローカルポート。スーパーバイザーとapiserverが同じ場所にない場合、このポートの1つ少ない追加ポートもapiserverクライアントのロードバランサーに使用されます。（デフォルト: 6444） |

### ランタイム

| フラグ                                 | デフォルト                            | 説明                                                        |
| ------------------------------------ | ---------------------------------- | ------------------------------------------------------------------ |
| `--container-runtime-endpoint` 値 | N/A                                | 組み込みのcontainerdを無効にし、指定されたパスのCRIソケットを使用します。--dockerと一緒に使用する場合、cri-dockerソケットパスを設定します |
| `--pause-image` 値                | "docker.io/rancher/pause:3.1"      | containerdまたはdockerサンドボックス用のカスタマイズされたpauseイメージ            |
| `--private-registry` 値           | "/etc/rancher/k3s/registries.yaml" | プライベートレジストリの設定ファイル                                |

### ネットワーキング

| フラグ                        | 環境変数 | 説明                               |
| --------------------------- | -------------------- | ----------------------------------------- |
| `--node-ip 値, -i` 値 | N/A                  | ノードの広告用IPアドレス          |
| `--node-external-ip` 値  | N/A                  | ノードの広告用外部IPアドレス |
| `--resolv-conf` 値       | `K3S_RESOLV_CONF`    | Kubeletのresolv.confファイル                  |
| `--flannel-iface` 値     | N/A                  | デフォルトのflannelインターフェースを上書き        |
| `--flannel-conf` 値      | N/A                  | デフォルトのflannel設定ファイルを上書き      |
| `--flannel-cni-conf` 値  | N/A                  | デフォルトのflannel cni設定ファイルを上書き  |

### カスタマイズされたフラグ

| フラグ                     | 説明                            |
| ------------------------ | -------------------------------------- |
| `--kubelet-arg` 値    | kubeletプロセス用のカスタマイズされたフラグ    |
| `--kube-proxy-arg` 値 | kube-proxyプロセス用のカスタマイズされたフラグ |

### 実験的

| フラグ         | 説明                           |
| ------------ | ------------------------------------- |
| `--rootless` | ルートレスで実行                          |
| `--docker`   | containerdの代わりにcri-dockerdを使用 |
| `--prefer-bundled-bin` | ホストバイナリよりもバンドルされたユーザースペースバイナリを優先 |
| `--disable-default-registry-endpoint` | "[デフォルトエンドポイントフォールバック](../installation/private-registry.md#default-endpoint-fallback)"を参照 |

### 廃止予定

| フラグ                     | 環境変数 | 説明                  |
| ------------------------ | -------------------- | ---------------------------- |
| `--no-flannel`           | N/A                  | `--flannel-backend=none`を使用 |
| `--cluster-secret` 値 | `K3S_CLUSTER_SECRET` | `--token`を使用                |

### エージェントのノードラベルとtaints

K3sエージェントは、`--node-label`および`--node-taint`オプションを使用して設定でき、これによりkubeletにラベルとtaintが追加されます。これらのオプションは登録時にのみラベルおよび/またはtaintを追加するため、一度だけ追加され、その後K3sコマンドを実行しても変更できません。

以下は、ラベルとtaintを追加する方法を示す例です：

```bash
     --node-label foo=bar \
     --node-label hello=world \
     --node-taint key1=value1:NoExecute
```

ノード登録後にノードラベルとtaintを変更したい場合は、`kubectl`を使用する必要があります。taintsの追加方法については公式のKubernetesドキュメントを参照してください。[taints](https://kubernetes.io/docs/concepts/configuration/taint-and-toleration/)および[ノードラベル](https://kubernetes.io/docs/tasks/configure-pod-container/assign-pods-nodes/#add-a-label-to-a-node)の追加方法についての詳細を参照してください。

### K3sエージェントCLIヘルプ

> 以下にオプションが角括弧で表示されている場合、例えば`[$K3S_URL]`、そのオプションはその名前の環境変数として渡すことができることを意味します。

```bash
NAME:
   k3s agent - ノードエージェントを実行

USAGE:
   k3s agent [OPTIONS]

OPTIONS:
   --config FILE, -c FILE                     (config) FILEから設定を読み込む (デフォルト: "/etc/rancher/k3s/config.yaml") [$K3S_CONFIG_FILE]
   --debug                                    (logging) デバッグログを有効にする [$K3S_DEBUG]
   -v 値                                   (logging) ログレベルの冗長度の数値 (デフォルト: 0)
   --vmodule 値                            (logging) ファイルフィルタリングされたログのためのFILE_PATTERN=LOG_LEVEL設定のカンマ区切りリスト
   --log 値, -l 値                      (logging) ファイルにログを記録
   --alsologtostderr                          (logging) ファイルに設定されている場合、標準エラーにもログを記録
   --token 値, -t 値                    (cluster) 認証に使用するトークン [$K3S_TOKEN]
   --token-file 値                         (cluster) 認証に使用するトークンファイル [$K3S_TOKEN_FILE]
   --server 値, -s 値                   (cluster) 接続するサーバー [$K3S_URL]
   --data-dir 値, -d 値                 (agent/data) 状態を保持するフォルダー (デフォルト: "/var/lib/rancher/k3s")
   --node-name 値                          (agent/node) ノード名 [$K3S_NODE_NAME]
   --with-node-id                             (agent/node) ノード名にIDを追加
   --node-label 値                         (agent/node) ラベルのセットでkubeletを登録および開始
   --node-taint 値                         (agent/node) taintsのセットでkubeletを登録
   --image-credential-provider-bin-dir 値  (agent/node) クレデンシャルプロバイダープラグインバイナリが配置されているディレクトリのパス (デフォルト: "/var/lib/rancher/credentialprovider/bin")
   --image-credential-provider-config 値   (agent/node) クレデンシャルプロバイダープラグイン設定ファイルのパス (デフォルト: "/var/lib/rancher/credentialprovider/config.yaml")
   --selinux                                  (agent/node) containerdでSELinuxを有効にする [$K3S_SELINUX]
   --lb-server-port 値                     (agent/node) スーパーバイザークライアントのロードバランサーのローカルポート。スーパーバイザーとapiserverが同じ場所にない場合、このポートの1つ少ない追加ポートもapiserverクライアントのロードバランサーに使用されます。（デフォルト: 6444） [$K3S_LB_SERVER_PORT]
   --protect-kernel-defaults                  (agent/node) カーネルのチューニング動作。設定されている場合、カーネルのチューナブルがkubeletのデフォルトと異なる場合にエラーを発生させます。
   --container-runtime-endpoint 値         (agent/runtime) 組み込みのcontainerdを無効にし、指定されたパスのCRIソケットを使用します。--dockerと一緒に使用する場合、dockerソケットパスを設定します
   --pause-image 値                        (agent/runtime) containerdまたはdockerサンドボックス用のカスタマイズされたpauseイメージ (デフォルト: "rancher/mirrored-pause:3.6")
   --snapshotter 値                        (agent/runtime) デフォルトのcontainerdスナップショッターを上書き (デフォルト: "overlayfs")
   --private-registry 値                   (agent/runtime) プライベートレジストリの設定ファイル (デフォルト: "/etc/rancher/k3s/registries.yaml")
   --node-ip 値, -i 値                  (agent/networking) ノードの広告用IPv4/IPv6アドレス
```
```markdown
   --node-external-ip value                   (agent/networking) ノードの広告用IPv4/IPv6外部IPアドレス
   --resolv-conf value                        (agent/networking) Kubeletのresolv.confファイル [$K3S_RESOLV_CONF]
   --flannel-iface value                      (agent/networking) デフォルトのflannelインターフェースを上書き
   --flannel-conf value                       (agent/networking) デフォルトのflannel設定ファイルを上書き
   --flannel-cni-conf value                   (agent/networking) デフォルトのflannel cni設定ファイルを上書き
   --kubelet-arg value                        (agent/flags) kubeletプロセスのカスタマイズフラグ
   --kube-proxy-arg value                     (agent/flags) kube-proxyプロセスのカスタマイズフラグ
   --rootless                                 (experimental) ルートレスで実行
   --prefer-bundled-bin                       (experimental) ホストのバイナリよりもバンドルされたユーザースペースバイナリを優先
   --docker                                   (agent/runtime) (experimental) containerdの代わりにcri-dockerdを使用
```