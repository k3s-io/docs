---
title: "管理封装的组件"
weight: 60
---

## 自动部署清单（AddOn）

在 server 节点上，`/var/lib/rancher/k3s/server/manifests` 中的任何文件都会以类似 `kubectl apply` 的方式自动部署到 Kubernetes，这会在启动和更改磁盘文件时进行。如果你删除该目录的文件，集群中相应的资源不会被删除。

清单在 `kube-system` 命名空间中作为 `AddOn` 自定义资源进行跟踪。你可以在相应的 `AddOn` 上使用 `kubectl describe` 来查看应用清单文件时遇到的任何错误或警告，也可以使用 `kubectl get event -n kube-system` 来查看该命名空间的所有事件，包括部署控制器的事件。

### 封装的组件

K3s 封装了很多组件，这些组件通过 `manifests` 目录部署为 AddOn，包括 `coredns`、`traefik`、`local-storage` 和 `metrics-server`。嵌入式 `servicelb` LoadBalancer controller 没有清单文件，但由于历史原因，它可以像 `AddOn` 一样被禁用。

封装组件的清单由 K3s 管理，请不要更改。K3s 启动时，这些文件都会重新写入磁盘来确保文件的完整性。

### 用户 AddOn

你可以将其他文件放在 `manifests` 目录中，将它们作为 `AddOn` 部署。每个文件可能包含多个 Kubernetes 资源，它们由 `---` YAML 分隔符分隔。有关在清单中组织资源的更多信息，请参阅 Kubernetes 文档的[管理资源](https://kubernetes.io/docs/concepts/cluster-administration/manage-deployment/)章节。

#### 文件命名要求

清单目录中每个文件的 `AddOn` 名称均派生自文件的基本名称。
请确保清单目录（或任何子目录）中的所有文件名称都是唯一的，并遵守 Kubernetes [对象命名限制](https://kubernetes.io/docs/concepts/overview/working-with-objects/names/)。
此外，即使 K3s 封装组件已禁用，也不要与默认 K3s 封装组件的名称冲突。

如果文件名包含下划线将报告以下示例错误：
> `Failed to process config: failed to process /var/lib/rancher/k3s/server/manifests/example_manifest.yaml:
>    Addon.k3s.cattle.io "example_manifest" is invalid: metadata.name: Invalid value: "example_manifest":
>    a lowercase RFC 1123 subdomain must consist of lower case alphanumeric characters, '-' or '.', and must start and end with an alphanumeric character
>    (e.g. 'example.com', regex used for validation is '[a-z0-9]([-a-z0-9]*[a-z0-9])?(\\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*')`

:::warning
如果你有多个 Server 节点，并在多个 Server 上放置了额外的 AddOn 清单，那么你需要确保文件在节点之间保持同步。K3s 不会在节点之间同步 AddOn 的内容。如果不同的 Server 尝试部署冲突的清单，那么可能会出现问题。
:::

## 禁用清单

有两种方法可以禁用清单目录中特定内容的部署。

### 使用 `--disable` 标志

除了 `manifests` 目录中的其他清单的 AddOn 之外，你可以使用 `--disable` 标志来禁用上面列出的封装组件的 AddOn。已禁用的 AddOn 会从集群中卸载，并从 `manifests` 目录中删除源文件。

例如，要禁止在新集群上安装 Traefik，或者要卸载 Traefik 并删除现有集群中的清单，你可以使用 `--disable=traefik` 来启动 K3s。要禁用多个条目，你可以使用逗号来分隔它们的名称或多次使用标志。

### 使用 .skip 文件

对于 `/var/lib/rancher/k3s/server/manifests` 下的任何文件，你可以创建一个 `.skip` 文件，然后 K3s 会忽略相应的清单。`.skip` 文件的内容不重要，因为只会检查文件是否存在。请注意，如果你在创建 AddOn 之后再创建 `.skip` 文件，则不会删除或修改 AddOn 以及 AddOn 创建的资源，只会认为该文件不存在。

例如，如果在第一次启动 K3s 之前在 `manifests` 目录中创建一个空的 `traefik.yaml.skip` 文件，那么 K3s 会跳过 `traefik.yaml` 的部署：
```bash
$ ls /var/lib/rancher/k3s/server/manifests
ccm.yaml      local-storage.yaml  rolebindings.yaml  traefik.yaml.skip
coredns.yaml  traefik.yaml

$ kubectl get pods -A
NAMESPACE     NAME                                     READY   STATUS    RESTARTS   AGE
kube-system   local-path-provisioner-64ffb68fd-xx98j   1/1     Running   0          74s
kube-system   metrics-server-5489f84d5d-7zwkt          1/1     Running   0          74s
kube-system   coredns-85cb69466-vcq7j                  1/1     Running   0          74s
```

如果在创建 `traefik.skip` 文件之前已经部署了 Traefik，Traefik 将保持原样，并且升级 K3s 时的后续更新不会影响 Traefik。

## Helm AddOn

有关通过自动部署清单来管理 Helm Chart 的更多信息，请参阅 [Helm](../helm/helm.md)。



