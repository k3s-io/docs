---
title: Helm
weight: 42
---

Helm is the package management tool of choice for Kubernetes. Helm charts provide templating syntax for Kubernetes YAML manifest documents. With Helm, developers or cluster administrators can create configurable templates known as Charts, instead of just using static manifests. For more information about creating your own Chart catalog, check out the docs at [https://helm.sh/docs/intro/quickstart/](https://helm.sh/docs/intro/quickstart/).

K3s does not require any special configuration to support Helm. Just be sure you have properly set the kubeconfig path as per the [cluster access](../cluster-access/cluster-access.md) documentation. 

K3s includes a [Helm Controller](https://github.com/k3s-io/helm-controller/) that manages installing, upgrading/reconfiguring, and uninstalling Helm charts using a HelmChart Custom Resource Definition (CRD). Paired with [auto-deploying AddOn manifests](../installation/packaged-components.md), installing a Helm chart on your cluster can be automated by creating a single file on disk.

### Using the Helm Controller

The [HelmChart Custom Resource](https://github.com/k3s-io/helm-controller#helm-controller) captures most of the options you would normally pass to the `helm` command-line tool. Here's an example of how you might deploy Apache from the Bitnami chart repository, overriding some of the default chart values. Note that the HelmChart resource itself is in the `kube-system` namespace, but the chart's resources will be deployed to the `web` namespace, which is created in the same manifest. This can be useful if you want to keep your HelmChart resources separated from the the resources they deploy.

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

An example of deploying a helm chart from a private repo with authentication:

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

#### HelmChart Field Definitions

| Field | Default | Description | Helm Argument / Flag Equivalent |
|-------|---------|-------------|-------------------------------|
| metadata.name |   | Helm Chart name | NAME |
| spec.chart |   | Helm Chart name in repository, or complete HTTPS URL to chart archive (.tgz) | CHART |
| spec.targetNamespace | default | Helm Chart target namespace | `--namespace` |
| spec.createNamespace | false | Create target namespace if not present | `--create-namespace` |
| spec.version |   | Helm Chart version (when installing from repository) | `--version` |
| spec.repo |   | Helm Chart repository URL | `--repo` |
| spec.repoCA | | Verify certificates of HTTPS-enabled servers using this CA bundle. Should be a string containing one or more PEM-encoded CA Certificates. | `--ca-file` |
| spec.repoCAConfigMap | | Reference to a ConfigMap containing CA Certificates to be be trusted by Helm. Can be used along with or instead of `repoCA` | `--ca-file` |
| spec.helmVersion | v3 | Helm version to use (`v2` or `v3`) |  |
| spec.bootstrap | False | Set to True if this chart is needed to bootstrap the cluster (Cloud Controller Manager, etc) |  |
| spec.set |   | Override simple default Chart values. These take precedence over options set via valuesContent. | `--set` / `--set-string` |
| spec.jobImage |   | Specify the image to use when installing the helm chart. E.g. rancher/klipper-helm:v0.3.0 . | |
| spec.backOffLimit | 1000 | Specify the number of retries before considering a job failed. | |
| spec.timeout | 300s | Timeout for Helm operations, as a [duration string](https://pkg.go.dev/time#ParseDuration) (`300s`, `10m`, `1h`, etc) | `--timeout` |
| spec.failurePolicy | reinstall | Set to `abort` which case the Helm operation is aborted, pending manual intervention by the operator. | |
| spec.authSecret | | Reference to Secret of type `kubernetes.io/basic-auth` holding Basic auth credentials for the Chart repo. | |
| spec.authPassCredentials | false | Pass Basic auth credentials to all domains. | `--pass-credentials` |
| spec.dockerRegistrySecret | | Reference to Secret of type `kubernetes.io/dockerconfigjson` holding Docker auth credentials for the OCI-based registry acting as the Chart repo. | |
| spec.valuesContent |   | Override complex default Chart values via YAML file content | `--values` |
| spec.chartContent |   | Base64-encoded chart archive .tgz - overrides spec.chart | CHART |

Content placed in `/var/lib/rancher/k3s/server/static/` can be accessed anonymously via the Kubernetes APIServer from within the cluster. This URL can be templated using the special variable `%{KUBERNETES_API}%` in the `spec.chart` field. For example, the packaged Traefik component loads its chart from `https://%{KUBERNETES_API}%/static/charts/traefik-12.0.000.tgz`.

:::note
The `name` field should follow the Helm chart naming conventions. Refer to the [Helm Best Practices documentation](https://helm.sh/docs/chart_best_practices/conventions/#chart-names) to learn more.
:::

### Customizing Packaged Components with HelmChartConfig

To allow overriding values for packaged components that are deployed as HelmCharts (such as Traefik), K3s supports customizing deployments via a HelmChartConfig resources. The HelmChartConfig resource must match the name and namespace of its corresponding HelmChart, and it supports providing additional `valuesContent`, which is passed to the `helm` command as an additional value file.

:::note
HelmChart `spec.set` values override HelmChart and HelmChartConfig `spec.valuesContent` settings.
:::

For example, to customize the packaged Traefik ingress configuration, you can create a file named `/var/lib/rancher/k3s/server/manifests/traefik-config.yaml` and populate it with the following content:

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

### Migrating from Helm v2

K3s can handle either Helm v2 or Helm v3. If you wish to migrate to Helm v3, [this](https://helm.sh/blog/migrate-from-helm-v2-to-helm-v3/) blog post by Helm explains how to use a plugin to successfully migrate. Refer to the official Helm 3 documentation [here](https://helm.sh/docs/) for more information. Just be sure you have properly set your kubeconfig as per the section about [cluster access.](../cluster-access/cluster-access.md)

:::note
Helm 3 no longer requires Tiller and the `helm init` command. Refer to the official documentation for details.
:::
