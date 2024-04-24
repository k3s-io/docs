---
title: Helm
---

Helm 是 Kubernetes 的包管理工具。Helm Chart 为 Kubernetes YAML 清单文件提供了模板语法。借助 Helm，开发人员或集群管理员可以创建称为 Chart 的可配置模板，而不仅仅是使用静态清单。如果你需要创建自己的 Chart catalog，请参阅 [https://helm.sh/docs/intro/quickstart/](https://helm.sh/docs/intro/quickstart/)。

K3s 不需要使用任何特殊配置来支持 Helm。请确保你已根据[集群访问](./cluster-access.md)文档正确设置了 kubeconfig 路径。

K3s 包含一个 [Helm Controller](https://github.com/k3s-io/helm-controller/)，它使用 HelmChart 自定义资源定义 (CRD) 来管理 Helm Chart 的安装、升级、重新配置和卸载。与[自动部署 AddOn 清单](./installation/packaged-components.md)配合使用后，它可以在磁盘上创建单个文件，自动在集群上安装 Helm Chart。

### 使用 Helm Controller

[HelmChart Custom Resource](https://github.com/k3s-io/helm-controller#helm-controller) 捕获了你通常传递给 `helm` 命令行工具的大部分选项。以下示例说明了如何从 Bitnami Chart 仓库部署 Apache，并覆盖某些默认的 Chart 值。请注意，HelmChart 资源本身位于 `kube-system` 命名空间中，但 Chart 的资源将部署到在同一清单中创建的 `web` 命名空间。如果你希望将 HelmChart 资源与其部署的资源分开，这将很有用。

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

#### HelmChart 字段定义

| 字段 | 默认 | 描述 | Helm 参数/标志等效项 |
|-------|---------|-------------|-------------------------------|
| metadata.name |   | Helm Chart 名称 | NAME |
| spec.chart |   | 仓库中的 Helm Chart 名称，或 chart archive (.tgz) 的完整 HTTPS URL | CHART |
| spec.targetNamespace | default | Helm Chart 目标命名空间 | `--namespace` |
| spec.version |   | Helm Chart 版本（通过仓库安装时） | `--version` |
| spec.repo |   | Helm Chart 仓库 URL | `--repo` |
| spec.repoCA | | 指定启用 HTTPS 的 Server 的证书 | `--ca-file` |
| spec.helmVersion | v3 | 要使用的 Helm 版本（`v2` 或 `v3`） |  |
| spec.bootstrap | False | 如果需要此 Chart 来引导集群（Cloud Controller Manager 等），请设置为 `True` |  |
| spec.set |   | 覆盖简单的默认 Chart 值。优先于通过 valuesContent 设置的选项。 | `--set` / `--set-string` |
| spec.jobImage |   | 指定安装 helm chart 时要使用的镜像。例如：rancher/klipper-helm:v0.3.0 | |
| spec.timeout | 300s | Helm 操作的超时，作为 [duration string](https://pkg.go.dev/time#ParseDuration)（`300s`、`10m`、`1h` 等） | `--timeout` |
| spec.failurePolicy | reinstall | 如果设置为 `abort`，Helm 操作会被中止，等待操作人员的手动干预。 | |
| spec.valuesContent |   | 通过 YAML 文件内容覆盖复杂的默认 Chart 值 | `--values` |
| spec.chartContent |   | Base64 编码的 chart archive .tgz，覆盖 spec.chart | CHART |

你可以通过集群内的 Kubernetes APIServer 匿名访问 `/var/lib/rancher/k3s/server/static/` 中的内容。此 URL 可以使用 `spec.chart` 字段中的特殊变量 `%{KUBERNETES_API}%` 进行模板化。例如，打包的 Traefik 组件通过 `https://%{KUBERNETES_API}%/static/charts/traefik-12.0.000.tgz` 加载 Chart。

:::note
`name` 字段需要遵循 Helm Chart 命名约定。有关更多信息，请参阅 [Helm 最佳实践文档](https://helm.sh/docs/chart_best_practices/conventions/#chart-names)。
:::

### 使用 HelmChartConfig 自定义打包组件

:::info 版本

从 [v1.19.1+k3s1](https://github.com/k3s-io/k3s/releases/tag/v1.19.1%2Bk3s1) 起可用

:::

为了允许覆盖部署为 HelmCharts（例如 Traefik）的打包组件的值，K3s 支持通过 HelmChartConfig 资源进行自定义部署。HelmChartConfig 资源必须与对应的 HelmChart 名称和命名空间匹配，并且支持提供额外的 `valuesContent`，它作为附加值文件传递给 `helm` 命令。

:::note
HelmChart `spec.set` 值会覆盖 HelmChart 和 HelmChartConfig `spec.valuesContent` 设置。
:::

例如，要自定义打包的 Traefik ingress 配置，你可以创建一个名为 `/var/lib/rancher/k3s/server/manifests/traefik-config.yaml` 的文件并使用以下内容填充它：

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
      tag: v2.8.5
    forwardedHeaders:
      enabled: true
      trustedIPs:
        - 10.0.0.0/8
    ssl:
      enabled: true
      permanentRedirect: false
```

### 从 Helm v2 迁移

:::info 版本
[v1.17.0+k3s.1](https://github.com/k3s-io/k3s/releases/tag/v1.17.0%2Bk3s.1) 开始支持 Helm v3 并默认使用它。
:::

K3s 可以处理 Helm v2 或 Helm v3。如果你想迁移到 Helm v3，Helm 的[这篇博客文章](https://helm.sh/blog/migrate-from-helm-v2-to-helm-v3/)解释了如何使用插件进行迁移。有关更多信息，请参阅[官方 Helm 3 文档](https://helm.sh/docs/)。请确保你已按照[集群访问](./cluster-access.md)部分正确设置了 kubeconfig。

:::note
Helm 3 不再需要 Tiller 和 `helm init` 命令。详情请参阅官方文档。
:::
