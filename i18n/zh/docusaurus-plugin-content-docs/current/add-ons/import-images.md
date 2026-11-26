---
title: "导入镜像"
---

容器镜像由 containerd 镜像存储缓存在每个节点本地。镜像可以根据 Pod 的需要从镜像仓库拉取，也可以通过镜像拉取预先加载，或从镜像 tar 包导入。

## 按需拉取镜像 {#on-demand-image-pulling}

默认情况下，当 Pod 需要某个镜像且节点上尚不存在该镜像时，Kubernetes 会自动拉取该镜像。可以通过 Pod 的[镜像拉取策略](https://kubernetes.io/docs/concepts/containers/images/#image-pull-policy)字段更改此行为。使用默认的 `IfNotPresent` 策略时，containerd 会从上游（默认）或你的[私有镜像仓库](../installation/private-registry.md)拉取镜像并将其存储到镜像存储中。用户无需进行任何额外配置即可使用按需拉取镜像。

## 预导入镜像 {#pre-import-images}

如果将 Kubernetes 的 `imagePullPolicy` 配置为 `Never`，则必须预先将镜像导入节点。你可能是出于安全原因，或为了缩短 K3s 节点启动时间而这样做。

### 有条件的镜像导入 {#conditional-image-imports}

默认情况下，每次启动 K3s 时都会导入镜像归档包。这样做的目的是确保所有镜像始终可用，即使自上次启动以来某些镜像已被删除或清理。但是，这会延迟启动，因为在处理完所有归档包之前 kubelet 不会启动。为缓解这一延迟，可以选择仅在 tar 包自上次导入后发生变化时才导入，即使跨越重启也是如此。

要启用此功能，请在镜像目录中创建一个 `.cache.json` 文件：
```bash
touch /var/lib/rancher/k3s/agent/images/.cache.json
```
缓存文件会在处理文件时存储归档元数据。只要归档包的大小和修改时间保持不变，后续重启 K3s 时将不会导入这些镜像。

:::warning
启用此功能后，将无法保证每次启动 K3s 时所有镜像都可用。如果某个镜像自上次启动以来被删除或清理，请手动重新导入该镜像，可选择以下任一方式：
* 使用 `ctr image import` 手动导入归档包。
* 使用 `touch` 修改包含该镜像的归档包的时间戳。
* 清空 `.cache.json` 文件的内容，然后重启 K3s。
:::

### 导入机制 {#import-mechanisms}

K3s 提供两种将镜像预导入 containerd 镜像存储的机制：

<Tabs groupId="import-images" queryString>
<TabItem value="Online image importing" label="在线导入镜像" default>

用户可以将一个包含镜像名称（每行一个）的文本文件放入 `/var/lib/rancher/k3s/agent/images` 目录，从而触发将镜像拉取到 containerd 镜像存储中。该文本文件可以在启动 K3s 之前放入，也可以在 K3s 运行期间创建或修改。K3s 将通过 CRI API 按顺序拉取镜像，并可选择使用 [registries.yaml](../installation/private-registry.md) 配置。

例如：

```bash
mkdir /var/lib/rancher/k3s/agent/images
cp example.txt /var/lib/rancher/k3s/agent/images
```

其中 `example.txt` 包含：

```
docker.io/library/redis:latest
docker.io/library/mysql:latest
```

几秒钟后，`redis` 和 `mysql` 镜像将出现在该节点的 containerd 镜像存储中。

使用 `sudo k3s ctr images list` 查询 containerd 镜像存储。

</TabItem>
<TabItem value="Offline image importing" label="离线导入镜像">

用户可以将镜像 tar 包放入 `/var/lib/rancher/k3s/agent/images` 目录，直接将镜像导入 containerd 镜像存储。该 tar 包可以在启动 K3s 之前放入，也可以在 K3s 运行期间创建或修改。K3s 会在必要时解压镜像 tar 包，提取镜像并将其加载到 containerd 镜像存储中。

例如：

```bash
sudo mkdir -p /var/lib/rancher/k3s/agent/images
sudo curl -L -o /var/lib/rancher/k3s/agent/images/k3s-airgap-images-amd64.tar.zst https://github.com/k3s-io/k3s/releases/download/v1.33.1%2Bk3s1/k3s-airgap-images-amd64.tar.zst
```

几秒钟后，镜像 tar 包中包含的镜像将出现在该节点的 containerd 镜像存储中。

使用 `sudo k3s ctr images list` 查询 containerd 镜像存储。

这是离线（Airgap）安装所使用的方法。详细信息请参阅[离线安装文档](../installation/airgap.md)。

</TabItem>
</Tabs>

## 设置镜像仓库 {#set-up-an-image-registry}

K3s 支持两种镜像仓库方案：

* [私有镜像仓库配置](../installation/private-registry.md)介绍了如何使用 `registries.yaml` 配置容器镜像仓库的身份验证和镜像加速。

* [内嵌镜像加速器](../installation/registry-mirror.md)介绍了如何启用内嵌的分布式镜像加速器，以便在节点之间以对等方式共享镜像。
