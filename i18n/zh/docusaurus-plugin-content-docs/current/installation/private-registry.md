---
title: "私有镜像仓库配置"
---

Containerd 可以配置为连接私有镜像仓库，并根据 kubelet 的需要从这些仓库拉取镜像。

K3s 启动时会检查 `/etc/rancher/k3s/registries.yaml` 是否存在。如果存在，生成 containerd 配置时会使用该文件中的镜像仓库配置。
* 如果你想将私有镜像仓库用作 docker.io 等公共镜像仓库的镜像加速器，则需要在每个要使用该加速器的节点上配置 `registries.yaml`。
* 如果你的私有镜像仓库需要身份验证、使用自定义 TLS 证书或不使用 TLS，则需要在每个将从该仓库拉取镜像的节点上配置 `registries.yaml`。

请注意，server 节点默认可以调度工作负载（workload）。如果你没有给 server 节点打污点，并且将在其上运行工作负载，
请确保也在每台 server 上创建 `registries.yaml` 文件。

## 默认端点回退 {#default-endpoint-fallback}

Containerd 为所有镜像仓库隐含一个“默认端点”。
即使 `registries.yaml` 中为该镜像仓库列出了其他端点，也始终会最后尝试默认端点。
对默认端点的拉取不会应用重写。
例如，拉取 `registry.example.com:5000/rancher/mirrored-pause:3.6` 时，containerd 将使用默认端点 `https://registry.example.com:5000/v2`。
* `docker.io` 的默认端点是 `https://index.docker.io/v2`。
* 所有其他镜像仓库的默认端点是 `https://<REGISTRY>/v2`，其中 `<REGISTRY>` 是镜像仓库主机名和可选端口。

要被识别为镜像仓库，镜像名称的第一部分必须至少包含一个句点或冒号。
出于历史原因，名称中未指定镜像仓库的镜像会被隐式认定为来自 `docker.io`。

节点可以使用 `--disable-default-registry-endpoint` 选项启动。
设置该选项后，containerd 不会回退到默认镜像仓库端点，只会从已配置的镜像加速器端点以及已启用的分布式镜像仓库拉取镜像。

如果你的集群处于真正的离线环境，无法访问上游镜像仓库，或者你希望仅让部分节点从上游镜像仓库拉取，则可能需要这样做。

禁用默认镜像仓库端点仅适用于通过 `registries.yaml` 配置的镜像仓库。
如果镜像仓库未通过 `registries.yaml` 中的镜像加速器条目显式配置，仍将使用默认回退行为。

## 镜像仓库配置文件 {#registries-configuration-file}

该文件包含两个顶层键，每个镜像仓库都有对应的子键：

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
      auth: <BASE64 USERNAME:PASSWORD>
    tls:
      ca_file: <PATH TO SERVER CA>
      cert_file: <PATH TO CLIENT CERT>
      key_file: <PATH TO CLIENT KEY>
      insecure_skip_verify: <SKIP TLS CERT VERIFICATION BOOLEAN>
```

### Mirrors {#mirrors}

mirrors 部分定义镜像仓库的名称和端点，例如：

```
mirrors:
  registry.example.com:
    endpoint:
      - "https://registry.example.com:5000"
```

每个镜像加速器都必须有一个名称和一组端点。从镜像仓库拉取镜像时，containerd 会尝试这些端点 URL 以及默认端点，并使用第一个可用的端点。

#### 重定向 {#redirects}

如果私有镜像仓库用作另一个镜像仓库的加速器，例如配置[拉取缓存（pull through cache）](https://docs.docker.com/registry/recipes/mirror/)时，
镜像拉取会被透明地重定向到列出的端点。原始镜像仓库名称通过 `ns` 查询参数传递给镜像加速器端点。

例如，如果你为 `docker.io` 配置了镜像加速器：

```yaml
mirrors:
  docker.io:
    endpoint:
      - "https://registry.example.com:5000"
```

那么拉取 `docker.io/rancher/mirrored-pause:3.6` 时，将透明地从 `registry.example.com:5000/rancher/mirrored-pause:3.6` 拉取镜像。

#### 重写 {#rewrites}

每个镜像加速器都可以有一组重写规则，使用正则表达式匹配并转换从镜像加速器拉取时的镜像名称。
如果私有镜像仓库中的组织/项目结构与所加速的镜像仓库不同，这会很有用。
重写仅匹配和转换镜像名称，**不**转换标签。

例如，以下配置会将镜像 `docker.io/rancher/mirrored-pause:3.6` 透明地拉取为 `registry.example.com:5000/mirrorproject/rancher-images/mirrored-pause:3.6`：

```yaml
mirrors:
  docker.io:
    endpoint:
      - "https://registry.example.com:5000"
    rewrite:
      "^rancher/(.*)": "mirrorproject/rancher-images/$1"
```

如果要在直接从镜像仓库拉取时（即该仓库并未用作其他上游镜像仓库的加速器）应用重写，必须提供一个与默认端点不匹配的镜像加速器端点。
`registries.yaml` 中与默认端点匹配的镜像加速器端点会被忽略；如果未禁用回退，默认端点始终最后尝试且不应用重写。

例如，如果你有一个位于 `https://registry.example.com/` 的镜像仓库，并希望在显式拉取 `registry.example.com/rancher/mirrored-pause:3.6` 时应用重写，可以添加一个带端口的镜像加速器端点。
由于该镜像加速器端点与默认端点不匹配——**`"https://registry.example.com:443/v2" != "https://registry.example.com/v2"`**——该端点会被接受为镜像加速器并应用重写，尽管它实际上与默认端点相同。

```yaml
mirrors:
  registry.example.com:
    endpoint:
      - "https://registry.example.com:443"
    rewrite:
      "^rancher/(.*)": "mirrorproject/rancher-images/$1"
```


请注意，使用镜像加速和重写时，镜像仍会以原始名称存储。
例如，即使镜像是从名称不同的加速器拉取的，`crictl image ls` 仍会显示 `docker.io/rancher/mirrored-pause:3.6` 在节点上可用。

### Configs {#configs}

`configs` 部分为每个镜像加速器定义 TLS 和凭据配置。对于每个镜像加速器，你可以定义 `auth` 和/或 `tls`。

`tls` 部分包括：

| 指令                   | 描述                                                     |
|------------------------|----------------------------------------------------------|
| `cert_file`            | 用于向镜像仓库进行身份验证的客户端证书路径               |
| `key_file`             | 用于向镜像仓库进行身份验证的客户端密钥路径               |
| `ca_file`              | 用于验证镜像仓库服务器证书文件的 CA 证书路径             |
| `insecure_skip_verify` | 布尔值，定义是否跳过该镜像仓库的 TLS 验证                |

`auth` 部分包含用户名/密码或认证令牌：

| 指令       | 描述                                   |
|------------|----------------------------------------|
| `username` | 私有镜像仓库基本身份验证的用户名       |
| `password` | 私有镜像仓库基本身份验证的用户密码     |
| `auth`     | `username:password` 的 base64 编码     |

以下是不同模式下使用私有镜像仓库的基本示例：

### 通配符支持 {#wildcard-support}

`"*"` 通配符条目可用于 `mirrors` 和 `configs` 部分，为所有镜像仓库提供默认配置。
仅当没有针对该镜像仓库的特定条目时，才会使用默认配置。注意，星号必须加引号。

在以下示例中，所有镜像仓库都将使用本地镜像加速器。除 `docker.io` 外，所有镜像仓库都将禁用 TLS 验证。
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

### 使用 TLS {#with-tls}

以下是使用 TLS 时，可以在每个节点上配置 `/etc/rancher/k3s/registries.yaml` 的示例。

<Tabs>
<TabItem value="With Authentication" label="使用身份验证">

```yaml
mirrors:
  docker.io:
    endpoint:
      - "https://registry.example.com:5000"
configs:
  "registry.example.com:5000":
    auth:
      username: xxxxxx # this is the registry username
      password: xxxxxx # this is the registry password
    tls:
      cert_file: # path to the cert file used in the registry
      key_file:  # path to the key file used in the registry
      ca_file:   # path to the ca file used in the registry
```

</TabItem>
<TabItem value="Without Authentication" label="不使用身份验证">

```yaml
mirrors:
  docker.io:
    endpoint:
      - "https://registry.example.com:5000"
configs:
  "registry.example.com:5000":
    tls:
      cert_file: # path to the cert file used in the registry
      key_file:  # path to the key file used in the registry
      ca_file:   # path to the ca file used in the registry
```
</TabItem>
</Tabs>

### 不使用 TLS {#without-tls}

以下是**不**使用 TLS 时，可以在每个节点上配置 `/etc/rancher/k3s/registries.yaml` 的示例。

<Tabs>
<TabItem value="Private Registry With Authentication" label="使用身份验证的私有镜像仓库">

```yaml
mirrors:
  docker.io:
    endpoint:
      - "http://registry.example.com:5000"
configs:
  "registry.example.com:5000":
    auth:
      username: xxxxxx # this is the registry username
      password: xxxxxx # this is the registry password
```

</TabItem>
<TabItem value="Docker Hub With Authentication" label="使用身份验证的 Docker Hub">

```yaml
mirrors:
  docker.io:
    endpoint:
      - "https://index.docker.io/v2"
configs:
  "https://index.docker.io/v2":
    auth:
      username: xxxxxx # Docker Hub username
      password: xxxxxx # Docker Hub password or PAT (Personal Access Token)
```
</TabItem>
<TabItem value="Without Authentication" label="不使用身份验证">

```yaml
mirrors:
  docker.io:
    endpoint:
      - "http://registry.example.com:5000"
```
</TabItem>
</Tabs>

> 如果通信不使用 TLS，需要为端点指定 `http://`，否则将默认使用 https。

为使镜像仓库更改生效，你需要在每个节点上重启 K3s。

## 镜像拉取故障排查 {#troubleshooting-image-pulls}

当 Kubernetes 拉取镜像遇到问题时，kubelet 显示的错误可能仅反映针对默认端点执行拉取所返回的最终错误，
从而看起来像是没有使用已配置的端点。

请检查节点上的 containerd 日志 `/var/lib/rancher/k3s/agent/containerd/containerd.log`，以获取故障根本原因的详细信息。注意，必须查看 Pod 被调度到的节点上的日志。你可以通过执行 `kubectl get pod -o wide -n NAMESPACE POD` 并检查 NODE 列，来查看 Pod 被调度到了哪个节点。

## 将镜像添加到私有镜像仓库 {#adding-images-to-the-private-registry}

复制镜像到私有镜像仓库需要一台安装了 Docker 或其他能够拉取和推送镜像的第三方工具的主机。
以下步骤假设你有一台装有 dockerd 和 docker CLI 工具的主机，并且可以访问 docker.io 和你的私有镜像仓库。

1. 从 GitHub 获取你所使用版本的 `k3s-images.txt` 文件。
2. 从 docker.io 拉取 k3s-images.txt 文件中列出的每个 K3s 镜像。
   示例：`docker pull docker.io/rancher/mirrored-pause:3.6`
3. 将镜像重新标记为私有镜像仓库的地址。
   示例：`docker tag docker.io/rancher/mirrored-pause:3.6 registry.example.com:5000/rancher/mirrored-pause:3.6`
4. 将镜像推送到私有镜像仓库。
   示例：`docker push registry.example.com:5000/rancher/mirrored-pause:3.6`
