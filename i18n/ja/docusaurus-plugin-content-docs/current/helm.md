---
title: Helm
---

HelmはKubernetesのためのパッケージ管理ツールです。HelmチャートはKubernetes YAMLマニフェストドキュメントのためのテンプレート構文を提供します。Helmを使用すると、開発者やクラスター管理者は静的なマニフェストを使用する代わりに、チャートとして知られる設定可能なテンプレートを作成できます。独自のチャートカタログを作成する方法については、[https://helm.sh/docs/intro/quickstart/](https://helm.sh/docs/intro/quickstart/)のドキュメントを参照してください。

K3sはHelmをサポートするために特別な設定を必要としません。[クラスターアクセス](./cluster-access.md)のドキュメントに従って、kubeconfigパスを正しく設定していることを確認してください。

K3sには、HelmChartカスタムリソース定義（CRD）を使用してHelmチャートのインストール、アップグレード/再構成、およびアンインストールを管理する[Helmコントローラー](https://github.com/k3s-io/helm-controller/)が含まれています。[自動デプロイAddOnマニフェスト](./installation/packaged-components.md)と組み合わせることで、ディスク上に1つのファイルを作成するだけでクラスターにHelmチャートを自動的にインストールできます。

### Helmコントローラーの使用

[HelmChartカスタムリソース](https://github.com/k3s-io/helm-controller#helm-controller)は、通常`helm`コマンドラインツールに渡すほとんどのオプションをキャプチャします。以下は、BitnamiチャートリポジトリからApacheをデプロイし、いくつかのデフォルトチャート値を上書きする例です。HelmChartリソース自体は`kube-system`ネームスペースにありますが、チャートのリソースは同じマニフェストで作成される`web`ネームスペースにデプロイされます。これは、HelmChartリソースをデプロイするリソースから分離して保持したい場合に便利です。

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: web
---
apiVersion: helm.cattle.io/v1
kind: HelmChart
metadata:
  name: apache
  namespace: kube-system
spec:
  repo: https://charts.bitnami.com/bitnami
  chart: apache
  targetNamespace: web
  valuesContent: |-
    service:
      type: ClusterIP
    ingress:
      enabled: true
      hostname: www.example.com
    metrics:
      enabled: true
```

認証付きのプライベートリポジトリからHelmチャートをデプロイする例：

```yaml
apiVersion: helm.cattle.io/v1
kind: HelmChart
metadata:
  namespace: kube-system
  name: example-app
spec:
  targetNamespace: example-space
  createNamespace: true
  version: v1.2.3
  chart: example-app
  repo: https://secure-repo.example.com
  authSecret:
    name: example-repo-auth
  repoCAConfigMap:
    name: example-repo-ca
  valuesContent: |-
    image:
      tag: v1.2.2
---
apiVersion: v1
kind: Secret
metadata:
  namespace: kube-system
  name: example-repo-auth
type: kubernetes.io/basic-auth
stringData:
  username: user
  password: pass
---
apiVersion: v1
kind: ConfigMap
metadata:
  namespace: kube-system
  name: example-repo-ca
data:
  ca.crt: |-
    -----BEGIN CERTIFICATE-----
    <YOUR CERTIFICATE>
    -----END CERTIFICATE-----
```

#### HelmChartフィールド定義

| フィールド | デフォルト | 説明 | Helm引数/フラグの同等 |
|------------|------------|------|-----------------------|
| metadata.name |   | Helmチャート名 | NAME |
| spec.chart |   | リポジトリ内のHelmチャート名、またはチャートアーカイブ（.tgz）への完全なHTTPS URL | CHART |
| spec.targetNamespace | default | Helmチャートのターゲットネームスペース | `--namespace` |
| spec.createNamespace | false | ターゲットネームスペースが存在しない場合に作成 | `--create-namespace` |
| spec.version |   | リポジトリからインストールする場合のHelmチャートバージョン | `--version` |
| spec.repo |   | HelmチャートリポジトリURL | `--repo` |
| spec.repoCA | | HTTPS対応サーバーの証明書をこのCAバンドルを使用して検証します。1つ以上のPEMエンコードされたCA証明書を含む文字列である必要があります。 | `--ca-file` |
| spec.repoCAConfigMap | | Helmが信頼するCA証明書を含むConfigMapへの参照。`repoCA`と一緒に、または代わりに使用できます。 | `--ca-file` |
| spec.helmVersion | v3 | 使用するHelmバージョン（`v2`または`v3`） |  |
| spec.bootstrap | False | このチャートがクラスターをブートストラップするために必要な場合（クラウドコントローラーマネージャーなど）にTrueに設定 |  |
| spec.set |   | シンプルなデフォルトチャート値を上書きします。これらはvaluesContent経由で設定されたオプションよりも優先されます。 | `--set` / `--set-string` |
| spec.jobImage |   | Helmチャートをインストールする際に使用するイメージを指定します。例：rancher/klipper-helm:v0.3.0。 | |
| spec.backOffLimit | 1000 | ジョブが失敗と見なされる前に再試行する回数を指定します。 | |
| spec.timeout | 300s | Helm操作のタイムアウト、[duration string](https://pkg.go.dev/time#ParseDuration)（`300s`、`10m`、`1h`など）として指定 | `--timeout` |
| spec.failurePolicy | reinstall | Helm操作が中止され、オペレーターによる手動介入が必要な場合に`abort`に設定 | |
| spec.authSecret | | チャートリポジトリの基本認証資格情報を保持する`kubernetes.io/basic-auth`タイプのSecretへの参照。 | |
| spec.authPassCredentials | false | すべてのドメインに基本認証資格情報を渡します。 | `--pass-credentials` |
| spec.dockerRegistrySecret | | チャートリポジトリとして機能するOCIベースのレジストリのDocker認証資格情報を保持する`kubernetes.io/dockerconfigjson`タイプのSecretへの参照。 | |
| spec.valuesContent |   | YAMLファイルの内容を介して複雑なデフォルトチャート値を上書き | `--values` |
| spec.chartContent |   | Base64エンコードされたチャートアーカイブ.tgz - spec.chartを上書き | CHART |

`/var/lib/rancher/k3s/server/static/`に配置されたコンテンツは、クラスター内からKubernetes APIServerを介して匿名でアクセスできます。このURLは、`spec.chart`フィールドで特別な変数`%{KUBERNETES_API}%`を使用してテンプレート化できます。例えば、パッケージ化されたTraefikコンポーネントは、`https://%{KUBERNETES_API}%/static/charts/traefik-12.0.000.tgz`からチャートをロードします。

:::note
`name`フィールドはHelmチャートの命名規則に従う必要があります。詳細については、[Helmベストプラクティスドキュメント](https://helm.sh/docs/chart_best_practices/conventions/#chart-names)を参照してください。
:::

### HelmChartConfigでパッケージ化されたコンポーネントをカスタマイズする

HelmChartsとしてデプロイされるパッケージ化されたコンポーネント（例えばTraefik）の値を上書きするために、K3sはHelmChartConfigリソースを介してデプロイのカスタマイズをサポートします。HelmChartConfigリソースは対応するHelmChartの名前とネームスペースに一致する必要があり、追加の`valuesContent`を提供することができ、これは追加の値ファイルとして`helm`コマンドに渡されます。

:::note
HelmChartの`spec.set`値は、HelmChartおよびHelmChartConfigの`spec.valuesContent`設定を上書きします。
:::

例えば、パッケージ化されたTraefikのインバウンド設定をカスタマイズするには、`/var/lib/rancher/k3s/server/manifests/traefik-config.yaml`という名前のファイルを作成し、以下の内容を入力します：

```yaml
apiVersion: helm.cattle.io/v1
kind: HelmChartConfig
metadata:
  name: traefik
  namespace: kube-system
spec:
  valuesContent: |-
    image:
      name: traefik
      tag: 2.9.10
    ports:
      web:
        forwardedHeaders:
          trustedIPs:
            - 10.0.0.0/8
```

### Helm v2からの移行

K3sはHelm v2またはHelm v3のいずれかを処理できます。Helm v3に移行したい場合は、Helmの[この](https://helm.sh/blog/migrate-from-helm-v2-to-helm-v3/)ブログ投稿でプラグインを使用して成功裏に移行する方法を説明しています。詳細については、公式のHelm 3ドキュメント[こちら](https://helm.sh/docs/)を参照してください。[クラスターアクセス](./cluster-access.md)のセクションに従ってkubeconfigを正しく設定していることを確認してください。

:::note
Helm 3はもはやTillerと`helm init`コマンドを必要としません。詳細については公式ドキュメントを参照してください。
:::
