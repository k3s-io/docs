---
title: "プライベートレジストリの設定"
---

Containerdはプライベートレジストリに接続し、kubeletが必要とするイメージをプルするために使用するように設定できます。

起動時に、K3sは`/etc/rancher/k3s/registries.yaml`が存在するかどうかを確認します。存在する場合、このファイルに含まれるレジストリ設定がcontainerd設定の生成時に使用されます。
* docker.ioのようなパブリックレジストリのミラーとしてプライベートレジストリを使用したい場合、そのミラーを使用する各ノードに`registries.yaml`を設定する必要があります。
* プライベートレジストリが認証を必要とする場合、カスタムTLS証明書を使用する場合、またはTLSを使用しない場合、イメージをプルする各ノードに`registries.yaml`を設定する必要があります。

サーバーノードはデフォルトでスケジュール可能であることに注意してください。サーバーノードに汚染を設定しておらず、ワークロードを実行する場合は、各サーバーにも`registries.yaml`ファイルを作成することを確認してください。

## デフォルトエンドポイントのフォールバック

Containerdにはすべてのレジストリに対して暗黙の「デフォルトエンドポイント」があります。
デフォルトエンドポイントは、`registries.yaml`にそのレジストリの他のエンドポイントがリストされている場合でも、最後の手段として常に試されます。
例えば、`registry.example.com:5000/rancher/mirrored-pause:3.6`をプルする場合、containerdは`https://registry.example.com:5000/v2`のデフォルトエンドポイントを使用します。
* `docker.io`のデフォルトエンドポイントは`https://index.docker.io/v2`です。
* 他のすべてのレジストリのデフォルトエンドポイントは`https://<REGISTRY>/v2`です。`<REGISTRY>`はレジストリのホスト名とオプションのポートです。

レジストリとして認識されるためには、イメージ名の最初のコンポーネントに少なくとも1つのピリオドまたはコロンが含まれている必要があります。
歴史的な理由から、名前にレジストリが指定されていないイメージは暗黙的に`docker.io`からのものと見なされます。

:::info バージョンゲート
`--disable-default-registry-endpoint`オプションは2024年1月のリリースから実験的機能として利用可能です：v1.26.13+k3s1、v1.27.10+k3s1、v1.28.6+k3s1、v1.29.1+k3s1
:::

ノードは`--disable-default-registry-endpoint`オプションを設定して起動できます。
このオプションが設定されている場合、containerdはデフォルトのレジストリエンドポイントにフォールバックせず、設定されたミラーエンドポイントと、分散レジストリが有効になっている場合はそれを使用してのみプルします。

これは、クラスターが上流のレジストリが利用できない真のエアギャップ環境にある場合や、一部のノードのみが上流のレジストリからプルすることを希望する場合に望ましいかもしれません。

デフォルトのレジストリエンドポイントの無効化は、`registries.yaml`を介して設定されたレジストリにのみ適用されます。
レジストリが`registries.yaml`のミラーエントリを介して明示的に設定されていない場合、デフォルトのフォールバック動作は引き続き使用されます。

## レジストリ設定ファイル

ファイルは2つのトップレベルキーで構成され、それぞれのレジストリに対してサブキーがあります：

```yaml
mirrors:
  <REGISTRY>:
    endpoint:
      - https://<REGISTRY>/v2
configs:
  <REGISTRY>:
    auth:
      username: <BASIC AUTH USERNAME>
      password: <BASIC AUTH PASSWORD>
      token: <BEARER TOKEN>
    tls:
      ca_file: <PATH TO SERVER CA>
      cert_file: <PATH TO CLIENT CERT>
      key_file: <PATH TO CLIENT KEY>
      insecure_skip_verify: <SKIP TLS CERT VERIFICATION BOOLEAN>
```

### ミラー

ミラーセクションはレジストリの名前とエンドポイントを定義します。例えば：

```
mirrors:
  registry.example.com:
    endpoint:
      - "https://registry.example.com:5000"
```

各ミラーには名前とエンドポイントのセットが必要です。レジストリからイメージをプルする際、containerdはこれらのエンドポイントURLとデフォルトエンドポイントを試し、最初に動作するものを使用します。

#### リダイレクト

プライベートレジストリが他のレジストリのミラーとして使用される場合、例えば[プルスルーキャッシュ](https://docs.docker.com/registry/recipes/mirror/)を設定する場合、
イメージプルはリストされたエンドポイントに透過的にリダイレクトされます。元のレジストリ名は`ns`クエリパラメータを介してミラーエンドポイントに渡されます。

例えば、`docker.io`のミラーを設定している場合：

```yaml
mirrors:
  docker.io:
    endpoint:
      - "https://registry.example.com:5000"
```

この場合、`docker.io/rancher/mirrored-pause:3.6`をプルすると、透過的に`registry.example.com:5000/rancher/mirrored-pause:3.6`としてイメージがプルされます。

#### リライト

各ミラーにはリライトのセットを持つことができます。リライトは正規表現に基づいてイメージの名前を変更できます。
これは、プライベートレジストリの組織/プロジェクト構造がミラーリングしているレジストリと異なる場合に便利です。

例えば、次の設定は、`docker.io/rancher/mirrored-pause:3.6`のイメージを透過的に`registry.example.com:5000/mirrorproject/rancher-images/mirrored-pause:3.6`としてプルします：

```
mirrors:
  docker.io:
    endpoint:
      - "https://registry.example.com:5000"
    rewrite:
      "^rancher/(.*)": "mirrorproject/rancher-images/$1"
```

リダイレクトとリライトを使用する場合でも、イメージは元の名前の下に保存されます。
例えば、`crictl image ls`は、ノード上で`docker.io/rancher/mirrored-pause:3.6`が利用可能であることを示しますが、イメージは異なる名前でミラーリングされたレジストリからプルされました。

### 設定

`configs`セクションは各ミラーのTLSおよび認証設定を定義します。各ミラーに対して`auth`および/または`tls`を定義できます。

`tls`部分は以下のように構成されます：

| ディレクティブ              | 説明                                                                          |
|------------------------|--------------------------------------------------------------------------------------|
| `cert_file`            | レジストリと認証するために使用されるクライアント証明書のパス      |
| `key_file`             | レジストリと認証するために使用されるクライアントキーのパス              |
| `ca_file`              | レジストリのサーバー証明書ファイルを検証するために使用されるCA証明書のパス |
| `insecure_skip_verify` | レジストリのTLS検証をスキップするかどうかを定義するブール値          |

`auth`部分はユーザー名/パスワードまたは認証トークンのいずれかで構成されます：

| ディレクティブ  | 説明                                             |
|------------|---------------------------------------------------------|
| `username` | プライベートレジストリの基本認証のユーザー名            |
| `password` | プライベートレジストリの基本認証のユーザーパスワード        |
| `auth`     | プライベートレジストリの基本認証の認証トークン |

以下は、異なるモードでプライベートレジストリを使用する基本的な例です：

### ワイルドカードサポート

:::info バージョンゲート
ワイルドカードサポートは2024年3月のリリースから利用可能です：v1.26.15+k3s1、v1.27.12+k3s1、v1.28.8+k3s1、v1.29.3+k3s1
:::

`mirrors`および`configs`セクションで`"*"`ワイルドカードエントリを使用して、すべてのレジストリに対するデフォルト設定を提供できます。
デフォルト設定は、そのレジストリに特定のエントリがない場合にのみ使用されます。アスタリスクは必ず引用符で囲む必要があります。

以下の例では、すべてのレジストリに対してローカルレジストリミラーが使用されます。`docker.io`を除くすべてのレジストリに対してTLS検証が無効になります。
```yaml
mirrors:
  "*":
    endpoint:
      - "https://registry.example.com:5000"
configs:
  "docker.io":
  "*":
    tls:
      insecure_skip_verify: true
```

### TLSを使用する場合

以下は、TLSを使用する場合に各ノードで`/etc/rancher/k3s/registries.yaml`を設定する方法を示す例です。

<Tabs>
<TabItem value="認証あり">

```yaml
mirrors:
  docker.io:
    endpoint:
      - "https://registry.example.com:5000"
configs:
  "registry.example.com:5000":
    auth:
      username: xxxxxx # これはレジストリのユーザー名です
      password: xxxxxx # これはレジストリのパスワードです
    tls:
      cert_file: # レジストリで使用される証明書ファイルのパス
      key_file:  # レジストリで使用されるキーのパス
      ca_file:   # レジストリで使用されるCAファイルのパス
```

</TabItem>
<TabItem value="認証なし">

```yaml
mirrors:
  docker.io:
    endpoint:
      - "https://registry.example.com:5000"
configs:
  "registry.example.com:5000":
    tls:
      cert_file: # レジストリで使用される証明書ファイルのパス
      key_file:  # レジストリで使用されるキーのパス
      ca_file:   # レジストリで使用されるCAファイルのパス
```
</TabItem>
</Tabs>

### TLSを使用しない場合

以下は、TLSを使用しない場合に各ノードで`/etc/rancher/k3s/registries.yaml`を設定する方法を示す例です。

<Tabs>
<TabItem value="認証あり">

```yaml
mirrors:
  docker.io:
    endpoint:
      - "http://registry.example.com:5000"
configs:
  "registry.example.com:5000":
    auth:
      username: xxxxxx # これはレジストリのユーザー名です
      password: xxxxxx # これはレジストリのパスワードです
```

</TabItem>
<TabItem value="認証なし">

```yaml
mirrors:
  docker.io:
    endpoint:
      - "http://registry.example.com:5000"
```
</TabItem>
</Tabs>

> TLS通信がない場合、エンドポイントに`http://`を指定する必要があります。そうしないと、デフォルトでhttpsになります。
 
レジストリの変更を有効にするためには、各ノードでK3sを再起動する必要があります。

## イメージプルのトラブルシューティング

Kubernetesがイメージのプルに問題を抱えている場合、kubeletによって表示されるエラーは、デフォルトエンドポイントに対して行われたプル試行から返された最終エラーのみを反映することがあり、設定されたエンドポイントが使用されていないように見えることがあります。

ノードの`/var/lib/rancher/k3s/agent/containerd/containerd.log`にあるcontainerdログを確認して、失敗の根本原因に関する詳細情報を確認してください。

## プライベートレジストリへのイメージの追加

プライベートレジストリにイメージをミラーリングするには、イメージをプルおよびプッシュできるDockerまたは他のサードパーティツールを備えたホストが必要です。
以下の手順は、dockerdとdocker CLIツール、およびdocker.ioとプライベートレジストリの両方にアクセスできるホストがあることを前提としています。

1. 作業しているリリースのGitHubから`k3s-images.txt`ファイルを取得します。
2. `k3s-images.txt`ファイルにリストされている各K3sイメージをdocker.ioからプルします。  
   例：`docker pull docker.io/rancher/mirrored-pause:3.6`
3. イメージをプライベートレジストリに再タグ付けします。  

   例: `docker tag docker.io/rancher/mirrored-pause:3.6 registry.example.com:5000/rancher/mirrored-pause:3.6`
4. イメージをプライベートレジストリにプッシュします。  
   例: `docker push registry.example.com:5000/rancher/mirrored-pause:3.6`