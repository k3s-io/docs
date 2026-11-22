---
title: "内嵌镜像加速器"
---

K3s 内嵌了 [Spegel](https://github.com/spegel-org/spegel)，这是一个无状态的分布式 OCI 镜像加速器，允许 Kubernetes 集群中的节点之间以对等方式共享容器镜像。分布式镜像加速器默认禁用。要让 K3s 使用它，必须同时启用[分布式 OCI 镜像加速器](#enabling-the-distributed-oci-registry-mirror)和[镜像加速](#enabling-registry-mirroring)，具体说明见下文各小节。

## 启用分布式 OCI 镜像加速器 {#enabling-the-distributed-oci-registry-mirror}

要启用内嵌镜像加速器，server 节点必须使用 `--embedded-registry` 标志启动，或在配置文件中设置 `embedded-registry: true`。
此选项将在集群中的所有节点上启用内嵌镜像加速器。

在集群级别启用时，所有节点都会在 6443 端口上托管一个本地 OCI 镜像仓库，
并通过 5001 端口上的点对点网络发布可用镜像列表。
任何节点 containerd 镜像存储中可用的镜像，都可以被集群其他成员拉取，而无需访问外部镜像仓库。
通过[离线镜像 tar 文件](./airgap.md?airgap-load-images=Manually+Deploy+Images)或[预导入](../add-ons/import-images.md#pre-import-images)导入的镜像会在 containerd 中固定，以确保它们保持可用，不会被 kubelet 垃圾回收清理。

可以将 K3s 服务的 `K3S_P2P_PORT` 环境变量设置为其他值，从而更改点对点端口（默认 5001）。该端口必须在所有节点上设置为相同的值。
更改端口不受支持，也不推荐。

### 要求 {#requirements}

启用内嵌镜像加速器后，所有节点必须能够通过内部 IP 地址在 TCP 端口 5001 和 6443 上相互访问。
如果节点之间无法相互访问，拉取镜像可能需要更长时间，因为 containerd 会首先尝试分布式镜像仓库，然后再回退到其他端点。

## 启用镜像加速 {#enabling-registry-mirroring}

为某个镜像仓库启用镜像加速后，节点既可以从其他节点拉取该镜像仓库的镜像，也可以与其他节点共享该镜像仓库的镜像。
如果某个镜像仓库只在部分节点上启用了镜像加速，则只有启用了该功能的节点才会交换该镜像仓库的镜像。

要启用来自上游容器镜像仓库的镜像加速，节点必须在 `registries.yaml` 的 `mirrors` 部分中为该镜像仓库添加条目。
该镜像仓库不需要列出任何端点，只需存在即可。
例如，要启用来自 `docker.io` 和 `registry.k8s.io` 的镜像分布式加速，请在所有集群节点上配置 `registries.yaml`，内容如下：

```yaml
mirrors:
  docker.io:
  registry.k8s.io:
```

镜像加速器的端点也可以照常添加。
在以下配置中，镜像拉取会首先尝试内嵌镜像加速器，然后尝试 `mirror.example.com`，最后尝试 `docker.io`：
```yaml
mirrors:
  docker.io:
    endpoint:
      - https://mirror.example.com
```

如果你直接使用私有镜像仓库，而不是将其作为上游镜像仓库的加速器，也可以用与启用公共镜像仓库相同的方式启用分布式镜像加速——在 mirrors 部分中列出它：
```yaml
mirrors:
  mirror.example.com:
```

`"*"` 通配符镜像加速器条目可用于启用所有镜像仓库的分布式镜像加速。注意，星号必须加引号：
```yaml
mirrors:
  "*":
```

如果节点上没有启用任何镜像仓库的镜像加速，则该节点不会以任何方式参与分布式镜像仓库。

有关 `registries.yaml` 文件结构的更多信息，请参阅[私有镜像仓库配置](./private-registry.md)。

### 默认端点回退 {#default-endpoint-fallback}

默认情况下，从配置了镜像加速器端点的镜像仓库拉取镜像时，containerd 会回退到默认端点。如果你希望禁用此行为，
仅从已配置的镜像加速器和/或内嵌镜像加速器拉取镜像，请参阅私有镜像仓库配置文档中的[默认端点回退](./private-registry.md#default-endpoint-fallback)
部分。

请注意，如果你使用 `--disable-default-registry-endpoint` 选项，并希望允许从特定镜像仓库直接拉取，同时禁止从其他镜像仓库拉取，
可以显式提供一个端点，以允许镜像拉取回退到镜像仓库本身：
```yaml
mirrors:
  docker.io:           # no default endpoint, pulls will fail if not available on a node
  registry.k8s.io:     # no default endpoint, pulls will fail if not available on a node
  mirror.example.com:  # explicit default endpoint, can pull from upstream if not available on a node
    endpoint:
      - https://mirror.example.com
```

### latest 标签 {#latest-tag}

当未为容器镜像指定标签时，隐式默认标签为 `latest`。此标签会频繁
更新，指向镜像的最新版本。由于该标签指向的镜像修订版本取决于拉取时间，
分布式镜像仓库**不会**从其他节点拉取 `latest` 标签。这会强制 containerd 向上游镜像仓库或镜像加速器请求，以确保对 `latest` 标签所指内容有一致的视图。

这与 Kubernetes 在使用容器镜像的 `latest` 标签时遵循的[特殊 `imagePullPolicy` 默认行为](https://kubernetes.io/docs/concepts/containers/images/#imagepullpolicy-defaulting)一致。

可以通过为 K3s 服务设置 `K3S_P2P_ENABLE_LATEST=true` 环境变量来启用 `latest` 标签的镜像加速。
出于上述原因，此功能不受支持，也不推荐使用。

## 安全 {#security}

### 身份验证 {#authentication}

访问内嵌镜像加速器的镜像仓库 API 需要有效的客户端证书，并且该证书必须由集群的客户端证书颁发机构签名。

访问分布式哈希表的点对点网络需要由 server 节点控制的预共享密钥。
节点使用预共享密钥和由集群证书颁发机构签名的证书相互进行身份验证。

### 潜在风险 {#potential-concerns}

:::warning
分布式镜像仓库基于点对点原则构建，并假设所有集群成员之间具有同等的权限和信任级别。
如果这不符合你集群的安全态势，则不应启用内嵌分布式镜像仓库。
:::

内嵌镜像仓库可能会提供节点原本无法访问的镜像。
例如，如果你的某些镜像来自需要通过 Kubernetes 镜像拉取 Secret 或 `registries.yaml` 中的凭据进行身份验证的镜像仓库、项目或仓库，
分布式镜像仓库将允许其他节点在未向上游镜像仓库提供任何凭据的情况下共享这些镜像。

有权将镜像推送到某个节点 containerd 镜像存储的用户，可能会利用这一点“污染”其他集群节点的镜像，
因为其他节点会信任该节点通告的标签，并在不与上游镜像仓库核对的情况下使用它。
如果镜像完整性很重要，应使用镜像摘要而不是标签，因为摘要无法通过这种方式被污染。

## 共享离线或手动加载的镜像 {#sharing-air-gap-or-manually-loaded-images}

镜像共享由源镜像仓库控制。
通过[离线 tar 包](./airgap.md?airgap-load-images=Manually+Deploy+Images)、[预导入](../add-ons/import-images.md#pre-import-images)直接加载到 containerd 中的镜像，或使用 `ctr` 命令行工具直接加载到 containerd 镜像存储中的镜像，如果被标记为来自已启用镜像加速的镜像仓库，则会在节点之间共享。

请注意，镜像表面上来自的上游镜像仓库实际上不必存在或可访问。
例如，你可以将镜像标记为来自一个虚构的上游镜像仓库，并将这些镜像导入 containerd 的镜像存储。
只要该镜像仓库列在 `registries.yaml` 中，你就可以从所有集群成员拉取这些镜像。

## 推送镜像 {#pushing-images}

内嵌镜像仓库是只读的，不能使用 `docker push` 或其他与 OCI 镜像仓库交互的常用工具直接推送。

可以通过运行 `ctr -n k8s.io image pull` 拉取镜像，
或通过 `ctr -n k8s.io image import` 命令或[预导入功能](../add-ons/import-images.md#pre-import-images)加载由 `docker save` 创建的镜像归档，从而手动将镜像提供给内嵌镜像仓库。
请注意，通过 `ctr` 管理镜像时必须指定 `k8s.io` 命名空间，kubelet 才能看到这些镜像。
