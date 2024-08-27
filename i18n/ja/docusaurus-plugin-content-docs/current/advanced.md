---
title: "高度なオプション / 設定"
---

このセクションには、K3sを実行および管理するさまざまな方法や、K3sの使用に向けてホストOSを準備するために必要な手順についての高度な情報が含まれています。

## 証明書管理

### 証明書認証局 (CA) 証明書

K3sは、最初のサーバーノードの起動時に自己署名の証明書認証局 (CA) 証明書を生成します。これらのCA証明書は10年間有効であり、自動的に更新されません。

カスタムCA証明書の使用や自己署名CA証明書の更新についての情報は、[`k3s certificate rotate-ca` コマンドのドキュメント](./cli/certificate.md#certificate-authority-ca-certificates)を参照してください。

### クライアントおよびサーバー証明書

K3sのクライアントおよびサーバー証明書は、発行日から365日間有効です。期限が切れているか、期限が切れるまで90日以内の証明書は、K3sが起動するたびに自動的に更新されます。

クライアントおよびサーバー証明書を手動で回転させる方法については、[`k3s certificate rotate` コマンドのドキュメント](./cli/certificate.md#client-and-server-certificates)を参照してください。

## トークン管理

デフォルトでは、K3sはサーバーとエージェントの両方に対して単一の静的トークンを使用します。このトークンはクラスターが作成された後に変更することはできません。
エージェントの参加にのみ使用できる2番目の静的トークンを有効にするか、自動的に期限切れになる一時的な `kubeadm` スタイルの参加トークンを作成することが可能です。
詳細については、[`k3s token` コマンドのドキュメント](./cli/token.md)を参照してください。

## HTTPプロキシの設定

K3sをHTTPプロキシを介してのみ外部接続が可能な環境で実行している場合、K3sのsystemdサービスでプロキシ設定を構成できます。これらのプロキシ設定はK3sで使用され、埋め込まれたcontainerdおよびkubeletに渡されます。

K3sのインストールスクリプトは、現在のシェルに存在する場合、`HTTP_PROXY`、`HTTPS_PROXY`、`NO_PROXY`、および `CONTAINERD_HTTP_PROXY`、`CONTAINERD_HTTPS_PROXY`、`CONTAINERD_NO_PROXY` 変数を自動的に取得し、通常は次の環境ファイルに書き込みます：

- `/etc/systemd/system/k3s.service.env`
- `/etc/systemd/system/k3s-agent.service.env`

もちろん、これらのファイルを編集してプロキシを設定することもできます。

K3sはクラスター内部のPodおよびサービスIP範囲とクラスターDNSドメインを `NO_PROXY` エントリのリストに自動的に追加します。Kubernetesノード自体が使用するIPアドレス範囲（つまり、ノードのパブリックおよびプライベートIP）が `NO_PROXY` リストに含まれているか、ノードがプロキシを介して到達可能であることを確認する必要があります。

```
HTTP_PROXY=http://your-proxy.example.com:8888
HTTPS_PROXY=http://your-proxy.example.com:8888
NO_PROXY=127.0.0.0/8,10.0.0.0/8,172.16.0.0/12,192.168.0.0/16
```

containerdのプロキシ設定をK3sおよびKubeletに影響を与えずに構成したい場合は、変数に `CONTAINERD_` をプレフィックスとして付けることができます：

```
CONTAINERD_HTTP_PROXY=http://your-proxy.example.com:8888
CONTAINERD_HTTPS_PROXY=http://your-proxy.example.com:8888
CONTAINERD_NO_PROXY=127.0.0.0/8,10.0.0.0/8,172.16.0.0/12,192.168.0.0/16
```

## Dockerをコンテナランタイムとして使用する

K3sには業界標準のコンテナランタイムである[containerd](https://containerd.io/)が含まれており、デフォルトで使用されます。
Kubernetes 1.24以降、Kubeletにはdockershimが含まれておらず、Kubeletがdockerdと通信するためのコンポーネントがありません。
K3s 1.24以降には[cri-dockerd](https://github.com/Mirantis/cri-dockerd)が含まれており、Dockerコンテナランタイムを引き続き使用しながら、以前のリリースからシームレスにアップグレードできます。

Dockerをcontainerdの代わりに使用するには：

1. K3sノードにDockerをインストールします。Rancherの[Dockerインストールスクリプト](https://github.com/rancher/install-docker)の1つを使用してDockerをインストールできます：

    ```bash
    curl https://releases.rancher.com/install-docker/20.10.sh | sh
    ```

2. `--docker` オプションを使用してK3sをインストールします：

    ```bash
    curl -sfL https://get.k3s.io | sh -s - --docker
    ```

3. クラスターが利用可能であることを確認します：

    ```bash
    $ sudo k3s kubectl get pods --all-namespaces
    NAMESPACE     NAME                                     READY   STATUS      RESTARTS   AGE
    kube-system   local-path-provisioner-6d59f47c7-lncxn   1/1     Running     0          51s
    kube-system   metrics-server-7566d596c8-9tnck          1/1     Running     0          51s
    kube-system   helm-install-traefik-mbkn9               0/1     Completed   1          51s
    kube-system   coredns-8655855d6-rtbnb                  1/1     Running     0          51s
    kube-system   svclb-traefik-jbmvl                      2/2     Running     0          43s
    kube-system   traefik-758cd5fc85-2wz97                 1/1     Running     0          43s
    ```

4. Dockerコンテナが実行中であることを確認します：

    ```bash
    $ sudo docker ps
    CONTAINER ID        IMAGE                     COMMAND                  CREATED              STATUS              PORTS               NAMES
    3e4d34729602        897ce3c5fc8f              "entry"                  About a minute ago   Up About a minute                       k8s_lb-port-443_svclb-traefik-jbmvl_kube-system_d46f10c6-073f-4c7e-8d7a-8e7ac18f9cb0_0
    bffdc9d7a65f        rancher/klipper-lb        "entry"                  About a minute ago   Up About a minute                       k8s_lb-port-80_svclb-traefik-jbmvl_kube-system_d46f10c6-073f-4c7e-8d7a-8e7ac18f9cb0_0
    436b85c5e38d        rancher/library-traefik   "/traefik --configfi…"   About a minute ago   Up About a minute                       k8s_traefik_traefik-758cd5fc85-2wz97_kube-system_07abe831-ffd6-4206-bfa1-7c9ca4fb39e7_0
    de8fded06188        rancher/pause:3.1         "/pause"                 About a minute ago   Up About a minute                       k8s_POD_svclb-traefik-jbmvl_kube-system_d46f10c6-073f-4c7e-8d7a-8e7ac18f9cb0_0
    7c6a30aeeb2f        rancher/pause:3.1         "/pause"                 About a minute ago   Up About a minute                       k8s_POD_traefik-758cd5fc85-2wz97_kube-system_07abe831-ffd6-4206-bfa1-7c9ca4fb39e7_0
    ae6c58cab4a7        9d12f9848b99              "local-path-provisio…"   About a minute ago   Up About a minute                       k8s_local-path-provisioner_local-path-provisioner-6d59f47c7-lncxn_kube-system_2dbd22bf-6ad9-4bea-a73d-620c90a6c1c1_0
    be1450e1a11e        9dd718864ce6              "/metrics-server"        About a minute ago   Up About a minute                       k8s_metrics-server_metrics-server-7566d596c8-9tnck_kube-system_031e74b5-e9ef-47ef-a88d-fbf3f726cbc6_0
    4454d14e4d3f        c4d3d16fe508              "/coredns -conf /etc…"   About a minute ago   Up About a minute                       k8s_coredns_coredns-8655855d6-rtbnb_kube-system_d05725df-4fb1-410a-8e82-2b1c8278a6a1_0
    c3675b87f96c        rancher/pause:3.1         "/pause"                 About a minute ago   Up About a minute                       k8s_POD_coredns-8655855d6-rtbnb_kube-system_d05725df-4fb1-410a-8e82-2b1c8278a6a1_0
    4b1fddbe6ca6        rancher/pause:3.1         "/pause"                 About a minute ago   Up About a minute                       k8s_POD_local-path-provisioner-6d59f47c7-lncxn_kube-system_2dbd22bf-6ad9-4bea-a73d-620c90a6c1c1_0
    64d3517d4a95        rancher/pause:3.1         "/pause"
    ```

## etcdctlの使用

etcdctlは、etcdサーバーと対話するためのCLIを提供します。K3sにはetcdctlはバンドルされていません。

K3sの埋め込みetcdと対話するためにetcdctlを使用したい場合は、[公式ドキュメント](https://etcd.io/docs/latest/install/)を使用してetcdctlをインストールしてください。

```bash
ETCD_VERSION="v3.5.5"
ETCD_URL="https://github.com/etcd-io/etcd/releases/download/${ETCD_VERSION}/etcd-${ETCD_VERSION}-linux-amd64.tar.gz"
curl -sL ${ETCD_URL} | sudo tar -zxv --strip-components=1 -C /usr/local/bin
```

次に、K3s管理の証明書とキーを認証に使用するようにetcdctlを構成して使用できます：

```bash
sudo etcdctl version \
  --cacert=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt \
  --cert=/var/lib/rancher/k3s/server/tls/etcd/client.crt \
  --key=/var/lib/rancher/k3s/server/tls/etcd/client.key
```

## containerdの設定

K3sは、containerdのconfig.tomlを `/var/lib/rancher/k3s/agent/etc/containerd/config.toml` に生成します。

このファイルの高度なカスタマイズを行うには、同じディレクトリに `config.toml.tmpl` という別のファイルを作成し、それが代わりに使用されます。

`config.toml.tmpl` はGoテンプレートファイルとして扱われ、`config.Node` 構造体がテンプレートに渡されます。この構造体を使用して設定ファイルをカスタマイズする方法については、[このフォルダ](https://github.com/k3s-io/k3s/blob/master/pkg/agent/templates)のLinuxおよびWindowsの例を参照してください。
config.Node golang構造体は[こちら](https://github.com/k3s-io/k3s/blob/master/pkg/daemons/config/types.go#L37)で定義されています。

### ベーステンプレート

:::info バージョンゲート
2023年9月のリリースから利用可能：v1.24.17+k3s1、v1.25.13+k3s1、v1.26.8+k3s1、v1.27.5+k3s1、v1.28.1+k3s1
:::

K3sのベーステンプレートを拡張して、K3sのソースコードから完全な標準テンプレートをコピー＆ペーストする代わりに使用できます。これは、既存の設定に基づいて構築し、最後にいくつかの行を追加する必要がある場合に便利です。

```toml
#/var/lib/rancher/k3s/agent/etc/containerd/config.toml.tmpl

{{ template "base" . }}

[plugins."io.containerd.grpc.v1.cri".containerd.runtimes."custom"]
  runtime_type = "io.containerd.runc.v2"
[plugins."io.containerd.grpc.v1.cri".containerd.runtimes."custom".options]
  BinaryName = "/usr/bin/custom-container-runtime"

```
## NVIDIAコンテナランタイムのサポート

K3sは、起動時にNVIDIAコンテナランタイムが存在する場合、自動的に検出して構成します。

1. ノードにnvidia-containerパッケージリポジトリをインストールします。手順は以下を参照してください：
    https://nvidia.github.io/libnvidia-container/
1. nvidiaコンテナランタイムパッケージをインストールします。例えば：
   `apt install -y nvidia-container-runtime cuda-drivers-fabricmanager-515 nvidia-headless-515-server`
1. K3sをインストールするか、既にインストールされている場合は再起動します：
    `curl -ksL get.k3s.io | sh -`
1. K3sがnvidiaコンテナランタイムを検出したことを確認します：

    `grep nvidia /var/lib/rancher/k3s/agent/etc/containerd/config.toml`

これにより、見つかったランタイム実行ファイルに応じて、`nvidia` および/または `nvidia-experimental` ランタイムが自動的に containerd の設定に追加されます。
クラスターに RuntimeClass 定義を追加し、Pod スペックで `runtimeClassName: nvidia` を設定して適切なランタイムを明示的に要求する Pod をデプロイする必要があります:
```yaml
apiVersion: node.k8s.io/v1
kind: RuntimeClass
metadata:
  name: nvidia
handler: nvidia
---
apiVersion: v1
kind: Pod
metadata:
  name: nbody-gpu-benchmark
  namespace: default
spec:
  restartPolicy: OnFailure
  runtimeClassName: nvidia
  containers:
  - name: cuda-container
    image: nvcr.io/nvidia/k8s/cuda-sample:nbody
    args: ["nbody", "-gpu", "-benchmark"]
    resources:
      limits:
        nvidia.com/gpu: 1
    env:
    - name: NVIDIA_VISIBLE_DEVICES
      value: all
    - name: NVIDIA_DRIVER_CAPABILITIES
      value: all
```

NVIDIA Container Runtime は [NVIDIA Device Plugin](https://github.com/NVIDIA/k8s-device-plugin/) と頻繁に使用され、上記のように pod スペックに `runtimeClassName: nvidia` を含めるように変更されることが多いことに注意してください。

## エージェントレスサーバーの実行 (実験的機能)
> **警告:** この機能は実験的です。

`--disable-agent` フラグを使用して開始すると、サーバーは kubelet、コンテナランタイム、または CNI を実行しません。クラスターに Node リソースを登録せず、`kubectl get nodes` の出力には表示されません。
kubelet をホストしないため、Pod を実行したり、クラスターのノードを列挙するオペレーター（埋め込みの etcd コントローラーやシステムアップグレードコントローラーを含む）によって管理されたりすることはできません。

エージェントレスサーバーを実行することは、エージェントやワークロードからコントロールプレーンノードを発見されないようにする場合に有利ですが、クラスターオペレーターのサポートがないため管理の負担が増加します。

デフォルトでは、エージェントレスサーバーの apiserver はクラスター内で実行されているアドミッションウェブフックや集約 API サービスへの外向き接続を行うことができません。これを解決するには、`--egress-selector-mode` サーバーフラグを `pod` または `cluster` に設定します。既存のクラスターでこのフラグを変更する場合、オプションが有効になるためにはクラスター内のすべてのノードを再起動する必要があります。

## ルートレスサーバーの実行 (実験的機能)
> **警告:** この機能は実験的です。

ルートレスモードでは、K3s サーバーを特権のないユーザーとして実行できるため、ホストの実際の root を潜在的なコンテナブレークアウト攻撃から保護できます。

ルートレス Kubernetes について詳しくは https://rootlesscontaine.rs/ を参照してください。

### ルートレスモードの既知の問題

* **ポート**

  ルートレスで実行すると、新しいネットワーク名前空間が作成されます。これは、K3s インスタンスがホストからかなり分離されたネットワークで実行されることを意味します。
  ホストから K3s で実行されているサービスにアクセスする唯一の方法は、K3s ネットワーク名前空間へのポートフォワードを設定することです。
  ルートレス K3s には、6443 および 1024 未満のサービスポートをホストにオフセット 10000 で自動的にバインドするコントローラーが含まれています。

  例えば、ポート 80 のサービスはホスト上で 10080 になりますが、8080 はオフセットなしで 8080 になります。現在、自動的にバインドされるのは LoadBalancer サービスのみです。

* **Cgroups**

  Cgroup v1 およびハイブリッド v1/v2 はサポートされていません。純粋な Cgroup v2 のみがサポートされています。ルートレスで実行中に K3s が cgroups の欠如により起動に失敗する場合、ノードがハイブリッドモードになっており、「欠落している」cgroups が v1 コントローラーにまだバインドされている可能性があります。

* **マルチノード/マルチプロセスクラスター**

  マルチノードのルートレスクラスターや同じノード上での複数のルートレス k3s プロセスは現在サポートされていません。詳細については [#6488](https://github.com/k3s-io/k3s/issues/6488#issuecomment-1314998091) を参照してください。

### ルートレスサーバーの開始
* cgroup v2 デリゲーションを有効にします。詳細は https://rootlesscontaine.rs/getting-started/common/cgroup2/ を参照してください。
  このステップは必須です。適切な cgroups がデリゲートされていないと、ルートレス kubelet は起動に失敗します。

* [`https://github.com/k3s-io/k3s/blob/<VERSION>/k3s-rootless.service`](https://github.com/k3s-io/k3s/blob/master/k3s-rootless.service) から `k3s-rootless.service` をダウンロードします。
  `k3s-rootless.service` と `k3s` のバージョンが同じであることを確認してください。

* `k3s-rootless.service` を `~/.config/systemd/user/k3s-rootless.service` にインストールします。
  このファイルをシステム全体のサービス (`/etc/systemd/...`) としてインストールすることはサポートされていません。
  `k3s` バイナリのパスに応じて、ファイルの `ExecStart=/usr/local/bin/k3s ...` 行を変更する必要があるかもしれません。

* `systemctl --user daemon-reload` を実行します。

* `systemctl --user enable --now k3s-rootless` を実行します。

* `KUBECONFIG=~/.kube/k3s.yaml kubectl get pods -A` を実行し、Pod が実行されていることを確認します。

> **注意:** ターミナルで `k3s server --rootless` を実行しようとしないでください。ターミナルセッションでは cgroup v2 デリゲーションが許可されていません。
> どうしてもターミナルで試す必要がある場合は、`systemd-run --user -p Delegate=yes --tty k3s server --rootless` を使用して systemd スコープでラップしてください。

### 高度なルートレス設定

ルートレス K3s は、ホストとユーザーネットワーク名前空間間の通信に [rootlesskit](https://github.com/rootless-containers/rootlesskit) と [slirp4netns](https://github.com/rootless-containers/slirp4netns) を使用します。
rootlesskit と slirp4netns によって使用される一部の設定は環境変数で設定できます。これらを設定する最良の方法は、k3s-rootless systemd ユニットの `Environment` フィールドに追加することです。

| 変数名                              | デフォルト値 | 説明
|--------------------------------------|--------------|------------
| `K3S_ROOTLESS_MTU`                   | 1500         | slirp4netns 仮想インターフェースの MTU を設定します。
| `K3S_ROOTLESS_CIDR`                  | 10.41.0.0/16 | slirp4netns 仮想インターフェースで使用される CIDR を設定します。
| `K3S_ROOTLESS_ENABLE_IPV6`           | 自動検出     | slirp4netns の IPv6 サポートを有効にします。指定されていない場合、K3s がデュアルスタック操作に設定されている場合に自動的に有効になります。
| `K3S_ROOTLESS_PORT_DRIVER`           | builtin      | ルートレスポートドライバーを選択します。`builtin` または `slirp4netns` のいずれかです。builtin は高速ですが、受信パケットの元の送信元アドレスを偽装します。
| `K3S_ROOTLESS_DISABLE_HOST_LOOPBACK` | true         | ゲートウェイインターフェースを介してホストのループバックアドレスへのアクセスを有効にするかどうかを制御します。セキュリティ上の理由から、これを変更しないことをお勧めします。

### ルートレスのトラブルシューティング

* `systemctl --user status k3s-rootless` を実行してデーモンのステータスを確認します。
* `journalctl --user -f -u k3s-rootless` を実行してデーモンログを確認します。
* 詳細は https://rootlesscontaine.rs/ を参照してください。

## ノードラベルとテイント

K3s エージェントは、kubelet にラベルとテイントを追加するオプション `--node-label` および `--node-taint` で構成できます。これらのオプションは [登録時](./cli/agent.md#node-labels-and-taints-for-agents) にのみラベルおよび/またはテイントを追加するため、ノードがクラスターに最初に参加する際にのみ設定できます。

現在のすべての Kubernetes バージョンでは、`kubernetes.io` および `k8s.io` プレフィックスを持つほとんどのラベルでノードの登録が制限されています。特に `kubernetes.io/role` ラベルが含まれます。許可されていないラベルでノードを起動しようとすると、K3s は起動に失敗します。Kubernetes の著者によると:

> ノードは自分自身の役割ラベルを主張することは許可されていません。ノードの役割は通常、特権またはコントロールプレーンタイプのノードを識別するために使用され、ノードが自分自身をそのプールにラベル付けすることを許可すると、侵害されたノードが高い特権の資格情報にアクセスするワークロード（コントロールプレーンデーモンセットなど）を簡単に引き付けることができます。

詳細については [SIG-Auth KEP 279](https://github.com/kubernetes/enhancements/blob/master/keps/sig-auth/279-limit-node-access/README.md#proposal) を参照してください。

ノードの登録後にノードラベルとテイントを変更したり、予約済みラベルを追加したりする場合は、`kubectl` を使用する必要があります。テイントの追加方法については公式の Kubernetes ドキュメントを参照してください。[テイント](https://kubernetes.io/docs/concepts/configuration/taint-and-toleration/) および [ノードラベル](https://kubernetes.io/docs/tasks/configure-pod-container/assign-pods-nodes/#add-a-label-to-a-node) の詳細を参照してください。

## インストールスクリプトでサービスを開始する

インストールスクリプトは、OS が systemd または openrc を使用しているかを自動検出し、インストールプロセスの一環としてサービスを有効化および開始します。
* openrc で実行する場合、ログは `/var/log/k3s.log` に作成されます。
* systemd で実行する場合、ログは `/var/log/syslog` に作成され、`journalctl -u k3s`（エージェントの場合は `journalctl -u k3s-agent`）を使用して表示されます。

インストールスクリプトで自動起動およびサービスの有効化を無効にする例:

```bash
curl -sfL https://get.k3s.io | INSTALL_K3S_SKIP_START=true INSTALL_K3S_SKIP_ENABLE=true sh -
```

## Docker で K3s を実行する

Docker で K3s を実行する方法はいくつかあります:

<Tabs>
<TabItem value='K3d' default>

[k3d](https://github.com/k3d-io/k3d) は、Docker でマルチノード K3s クラスターを簡単に実行するために設計されたユーティリティです。

k3d を使用すると、ローカルでの Kubernetes 開発のために、Docker でシングルノードおよびマルチノードの k3s クラスターを非常に簡単に作成できます。

インストール方法や k3d の使用方法については、[インストール](https://k3d.io/#installation) ドキュメントを参照してください。

</TabItem>
<TabItem value="Docker">

Docker を使用するには、K3s サーバーおよびエージェントを実行するための `rancher/k3s` イメージも利用可能です。
`docker run` コマンドを使用して:

```bash
sudo docker run \
  --privileged \
  --name k3s-server-1 \
  --hostname k3s-server-1 \
  -p 6443:6443 \
  -d rancher/k3s:v1.24.10-k3s1 \
  server
```
:::note
有効な K3s バージョンをタグとして指定する必要があります。`latest` タグは維持されていません。
Docker イメージではタグに `+` 記号を使用できないため、代わりに `-` を使用してください。
:::

K3s が起動して実行されると、管理用 kubeconfig を Docker コンテナからコピーして使用できます:
```bash
sudo docker cp k3s-server-1:/etc/rancher/k3s/k3s.yaml ~/.kube/config
```

</TabItem>
</Tabs>

## SELinux サポート

:::info バージョンゲート

v1.19.4+k3s1 から利用可能

:::

SELinux がデフォルトで有効になっているシステム（CentOS など）に K3s をインストールする場合、適切な SELinux ポリシーがインストールされていることを確認する必要があります。

<Tabs>

<TabItem value="Automatic Installation" default>

[インストールスクリプト](./installation/configuration.md#configuration-with-install-script)は、エアギャップインストールを行わない限り、互換性のあるシステムであればRancher RPMリポジトリからSELinux RPMを自動的にインストールします。自動インストールをスキップするには、`INSTALL_K3S_SKIP_SELINUX_RPM=true`を設定します。

</TabItem>

<TabItem value="Manual Installation" default>

必要なポリシーは以下のコマンドでインストールできます:
```bash
yum install -y container-selinux selinux-policy-base
yum install -y https://rpm.rancher.io/k3s/latest/common/centos/7/noarch/k3s-selinux-1.4-1.el7.noarch.rpm
```

インストールスクリプトが失敗するのではなく警告をログに記録するように強制するには、以下の環境変数を設定します: `INSTALL_K3S_SELINUX_WARN=true`。
</TabItem>
</Tabs>

### SELinuxの強制モードを有効にする

SELinuxを活用するには、K3sサーバーおよびエージェントを起動する際に`--selinux`フラグを指定します。

このオプションはK3sの[設定ファイル](./installation/configuration.md#configuration-file)にも指定できます。

```
selinux: true
```

SELinuxの下でカスタムの`--data-dir`を使用することはサポートされていません。カスタマイズするには、おそらく独自のカスタムポリシーを書く必要があります。ガイダンスについては、コンテナランタイムのSELinuxポリシーファイルを含む[containers/container-selinux](https://github.com/containers/container-selinux)リポジトリおよびK3sのSELinuxポリシーを含む[k3s-io/k3s-selinux](https://github.com/k3s-io/k3s-selinux)リポジトリを参照してください。

## eStargzのレイジープルを有効にする（実験的機能）

### レイジープルとeStargzとは？

イメージのプルはコンテナライフサイクルの中で時間のかかるステップの一つとして知られています。
[Harter, et al.](https://www.usenix.org/conference/fast16/technical-sessions/presentation/harter)によると、

> パッケージのプルはコンテナ起動時間の76%を占めるが、そのデータのうち読み取られるのはわずか6.4%である

この問題に対処するために、k3sはイメージコンテンツの*レイジープル*を実験的にサポートしています。
これにより、k3sはイメージ全体がプルされる前にコンテナを起動することができます。
代わりに、必要なコンテンツのチャンク（例：個々のファイル）がオンデマンドで取得されます。
特に大きなイメージの場合、この技術はコンテナの起動遅延を短縮することができます。

レイジープルを有効にするには、ターゲットイメージを[*eStargz*](https://github.com/containerd/stargz-snapshotter/blob/main/docs/stargz-estargz.md)としてフォーマットする必要があります。
これはOCIの代替ですが、100% OCI互換のイメージフォーマットで、レイジープルに対応しています。
互換性があるため、eStargzは標準のコンテナレジストリ（例：ghcr.io）にプッシュでき、eStargz非対応のランタイムでも*実行可能*です。

eStargzは[Google CRFSプロジェクトによって提案されたstargzフォーマット](https://github.com/google/crfs)に基づいて開発されましたが、コンテンツの検証やパフォーマンスの最適化などの実用的な機能が追加されています。
レイジープルとeStargzの詳細については、[Stargz Snapshotterプロジェクトリポジトリ](https://github.com/containerd/stargz-snapshotter)を参照してください。

### eStargzのレイジープルのためのk3sの設定

以下のように、k3sサーバーおよびエージェントに`--snapshotter=stargz`オプションが必要です。

```bash
k3s server --snapshotter=stargz
```

この設定により、eStargz形式のイメージのレイジープルを実行できます。
以下の例のPodマニフェストは、eStargz形式の`node:13.13.0`イメージ（`ghcr.io/stargz-containers/node:13.13.0-esgz`）を使用しています。
stargzスナップショッタが有効になっている場合、K3sはこのイメージのレイジープルを実行します。

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nodejs
spec:
  containers:
  - name: nodejs-estargz
    image: ghcr.io/stargz-containers/node:13.13.0-esgz
    command: ["node"]
    args:
    - -e
    - var http = require('http');
      http.createServer(function(req, res) {
        res.writeHead(200);
        res.end('Hello World!\n');
      }).listen(80);
    ports:
    - containerPort: 80
```

## 追加のログソース

K3s用の[Rancherロギング](https://rancher.com/docs/rancher/v2.6/en/logging/helm-chart-options/)は、Rancherを使用せずにインストールできます。以下の手順を実行してください:

```bash
helm repo add rancher-charts https://charts.rancher.io
helm repo update
helm install --create-namespace -n cattle-logging-system rancher-logging-crd rancher-charts/rancher-logging-crd
helm install --create-namespace -n cattle-logging-system rancher-logging --set additionalLoggingSources.k3s.enabled=true rancher-charts/rancher-logging
```

## 追加のネットワークポリシーロギング

ネットワークポリシーによってドロップされたパケットをログに記録できます。パケットはiptablesのNFLOGアクションに送信され、パケットの詳細（ネットワークポリシーを含む）が表示されます。

トラフィックが多い場合、ログメッセージの数が非常に多くなる可能性があります。ポリシーごとにログのレートを制御するには、対象のネットワークポリシーに以下のアノテーションを追加して、`limit`および`limit-burst`のiptablesパラメータを設定します:
* `kube-router.io/netpol-nflog-limit=<LIMIT-VALUE>`
* `kube-router.io/netpol-nflog-limit-burst=<LIMIT-BURST-VALUE>`

デフォルト値は`limit=10/minute`および`limit-burst=10`です。これらのフィールドの形式および可能な値については、[iptablesマニュアル](https://www.netfilter.org/documentation/HOWTO/packet-filtering-HOWTO-7.html#:~:text=restrict%20the%20rate%20of%20matches)を参照してください。

NFLOGパケットをログエントリに変換するには、ulogd2をインストールし、`[log1]`を`group=100`で読み取るように設定します。その後、ulogd2サービスを再起動して新しい設定を反映させます。
ネットワークポリシールールによってパケットがブロックされると、`/var/log/ulog/syslogemu.log`にログメッセージが表示されます。

NFLOGネットリンクソケットに送信されたパケットは、tcpdumpやtsharkなどのコマンドラインツールを使用して読み取ることもできます:
```bash
tcpdump -ni nflog:100
```
tcpdumpはより手軽に利用できますが、パケットをブロックしたネットワークポリシーの名前は表示されません。ネットワークポリシー名を含む完全なNFLOGパケットヘッダーを表示するには、wiresharkのtsharkコマンドを使用してください。