---
title: "管理打包组件"
---

## 自动部署清单（AddOns） {#auto-deploying-manifests-addons}

在 server 节点上，`/var/lib/rancher/k3s/server/manifests` 中找到的任何文件都会以类似 `kubectl apply` 的方式自动部署到 Kubernetes，无论是启动时还是文件在磁盘上发生变化时都会如此。从该目录中删除文件不会从集群中删除相应的资源。

清单会作为 `AddOn` 自定义资源在 `kube-system` 命名空间中进行跟踪。应用清单文件时遇到的任何错误或警告，可以通过对相应的 `AddOn` 使用 `kubectl describe` 查看，或使用 `kubectl get event -n kube-system` 查看该命名空间的所有事件，包括来自部署控制器的事件。

### 打包组件 {#packaged-components}

K3s 自带若干通过 manifests 目录以 AddOn 形式部署的打包组件：`coredns`、`traefik`、`local-storage` 和 `metrics-server`。内嵌的 `servicelb` LoadBalancer 控制器没有清单文件，但出于历史原因，可以像 `AddOn` 一样禁用它。

打包组件的清单由 K3s 管理，不应修改。为确保其完整性，每次启动 K3s 时都会将这些文件重新写入磁盘。

### 用户 AddOns {#user-addons}

你可以在 manifests 目录中放置其他文件，作为 `AddOn` 部署。每个文件可以包含多个 Kubernetes 资源，使用 `---` YAML 文档分隔符分隔。有关在清单中组织资源的更多信息，请参阅 Kubernetes 文档的[管理资源](https://kubernetes.io/docs/concepts/cluster-administration/manage-deployment/)部分。

#### 文件命名要求 {#file-naming-requirements}

清单目录中每个文件的 `AddOn` 名称由文件的基本名称（basename）派生。
请确保 manifests 目录（或任何子目录）中的所有文件名称唯一，并遵守 Kubernetes 的[对象命名限制](https://kubernetes.io/docs/concepts/overview/working-with-objects/names/)。
还应注意不要与 K3s 默认打包组件使用的名称冲突，即使这些组件已被禁用。

以下是文件名包含下划线时将报告的错误示例：
> `Failed to process config: failed to process /var/lib/rancher/k3s/server/manifests/example_manifest.yaml:
   Addon.k3s.cattle.io "example_manifest" is invalid: metadata.name: Invalid value: "example_manifest": 
   a lowercase RFC 1123 subdomain must consist of lower case alphanumeric characters, '-' or '.', and must start and end with an alphanumeric character
   (e.g. 'example.com', regex used for validation is '[a-z0-9]([-a-z0-9]*[a-z0-9])?(\\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*')`

:::danger
如果你有多个 server 节点，并在多个 server 上放置了额外的 AddOn 清单，则你有责任确保这些文件在各节点之间保持同步。K3s 不会在节点之间同步 AddOn 内容，如果不同 server 尝试部署相互冲突的清单，K3s 无法保证行为正确。
:::

## 禁用清单 {#disabling-manifests}

有两种方法可以禁止部署 manifests 目录中的特定内容。

### 使用 `--disable` 标志 {#using-the-disable-flag}

上述打包组件的 AddOn，以及放置在 `manifests` 目录中的任何其他清单所对应的 AddOn，都可以通过 `--disable` 标志禁用。已禁用的 AddOn 会从集群中主动卸载，其源文件也会从 `manifests` 目录中删除。

例如，要在新集群中禁用 traefik 安装，或在现有集群中卸载 traefik 并删除其清单，可以使用 `--disable=traefik` 启动 K3s。可以用逗号分隔多个名称，或重复使用该标志来禁用多个项目。

### 使用 .skip 文件 {#using-skip-files}

对于 `/var/lib/rancher/k3s/server/manifests` 下的任何文件，都可以创建一个 `.skip` 文件，使 K3s 忽略相应的清单。`.skip` 文件的内容无关紧要，只检查其是否存在。请注意，如果在 AddOn 已创建后创建 `.skip` 文件，不会删除或以其他方式修改该 AddOn 或其创建的资源；该文件只是被视为不存在。

例如，在首次启动 K3s 之前，在 manifests 目录中创建一个空的 `traefik.yaml.skip` 文件，K3s 将跳过部署 `traefik.yaml`：
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

如果 Traefik 在创建 `traefik.skip` 文件之前已经部署，Traefik 将保持原样，并且不会在 K3s 升级时受到未来更新的影响。

## Helm AddOns {#helm-addons}

有关通过自动部署清单管理 Helm chart 的信息，请参阅 [Helm](../add-ons/helm.md) 部分。
