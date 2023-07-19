---
title: "私有镜像仓库配置"
weight: 55
---

你可以将 Containerd 配置为连接到私有镜像仓库，并在节点上使用私有镜像仓库拉取私有镜像。

启动时，K3s 会检查 `/etc/rancher/k3s/` 中是否存在 `registries.yaml` 文件，并指示 containerd 使用该文件中定义的镜像仓库。如果你想使用私有的镜像仓库，你需要在每个使用镜像仓库的节点上以 root 身份创建这个文件。

请注意，server 节点默认是可以调度的。如果你没有在 server 节点上设置污点，而且希望在 server 节点上运行工作负载，请确保在每个 server 节点上创建 `registries.yaml` 文件。

Containerd 中的配置可以用于通过 TLS 连接到私有镜像仓库，也可以与启用验证的镜像仓库连接。下一节将解释 `registries.yaml` 文件，并给出在 K3s 中使用私有镜像仓库配置的不同例子。

## 镜像仓库配置文件

该文件由两个主要部分组成：

- mirrors
- configs

### Mirrors

Mirrors 是用于定义私有镜像仓库名称和端点的指令，例如：

```
mirrors:
  mycustomreg.com:
    endpoint:
      - "https://mycustomreg.com:5000"
```

每个 mirror 都必须有一个名称和一组端点。从镜像仓库中拉取镜像时，containerd 会逐个尝试这些端点 URL，并使用第一个有效的 URL。

#### 重定向

如果将公共镜像仓库用作 Mirror，例如在配置[通过缓存拉取](https://docs.docker.com/registry/recipes/mirror/)时，镜像拉取将被透明地重定向。

例如，如果你为 `docker.io` 配置了一个 Mirror：

```yaml
mirrors:
  docker.io:
    endpoint:
      - "https://mycustomreg.com:5000"
```

然后，拉取 `docker.io/rancher/coredns-coredns:1.6.3` 将透明地从 `https://mycustomreg.com:5000/rancher/coredns-coredns:1.6.3` 拉取镜像。

#### Rewrites

每个 Mirror 都可以有一组 rewrites。Rewrites 可以根据正则表达式来改变镜像的标签。如果 mirror 仓库中的组织/项目结构与上游不同，这将很有用。

例如，以下配置将透明地从 `registry.example.com:5000/mirrorproject/rancher-images/coredns-coredns:1.6.3` 中拉取镜像 `docker.io/rancher/coredns-coredns:1.6.3`：

```
mirrors:
  docker.io:
    endpoint:
      - "https://registry.example.com:5000"
    rewrite:
      "^rancher/(.*)": "mirrorproject/rancher-images/$1"
```

镜像仍将以原始名称存储，因此，即使镜像以不同的名字从镜像仓库中拉取，`crictl image ls` 也将显示 `docker.io/rancher/coredns-coredns:1.6.3` 在节点上是可用的。

### Configs

`configs` 部分定义了每个 mirror 的 TLS 和凭证配置。对于每个 mirror，你可以定义 `auth` 和/或 `tls`。

`tls` 部分包括：

| 指令 | 描述 |
|------------------------|--------------------------------------------------------------------------------------|
| `cert_file` | 客户端证书路径，用于向镜像仓库进行身份验证 |
| `key_file` | 客户端密钥路径，用于向镜像仓库进行身份验证 |
| `ca_file` | 定义用于验证镜像仓库服务器证书文件的 CA 证书路径 |
| `insecure_skip_verify` | 定义是否应跳过镜像仓库的 TLS 验证的布尔值 |

`auth` 部分由用户名/密码或身份验证令牌组成：

| 指令 | 描述 |
|------------|---------------------------------------------------------|
| `username` | 私有镜像仓库基本身份验证的用户名 |
| `password` | 私有镜像仓库基本身份验证的用户密码 |
| `auth` | 私有镜像仓库基本身份验证的身份验证令牌 |

以下是在不同模式下使用私有镜像仓库的基本例子：

### 使用 TLS

下面的例子展示了使用 TLS 时，如何在每个节点上配置 `/etc/rancher/k3s/registries.yaml`。

<Tabs>
<TabItem value="有认证">

```yaml
mirrors:
  docker.io:
    endpoint:
      - "https://mycustomreg.com:5000"
configs:
  "mycustomreg:5000":
    auth:
      username: xxxxxx # this is the registry username
      password: xxxxxx # this is the registry password
    tls:
      cert_file: # path to the cert file used in the registry
      key_file:  # path to the key file used in the registry
      ca_file:   # path to the ca file used in the registry
```

</TabItem>
<TabItem value="无认证">

```yaml
mirrors:
  docker.io:
    endpoint:
      - "https://mycustomreg.com:5000"
configs:
  "mycustomreg:5000":
    tls:
      cert_file: # path to the cert file used in the registry
      key_file:  # path to the key file used in the registry
      ca_file:   # path to the ca file used in the registry
```
</TabItem>
</Tabs>

### 没有 TLS

以下示例展示了_不_使用 TLS 时，如何在每个节点上配置 `/etc/rancher/k3s/registries.yaml`。

<Tabs>
<TabItem value="有认证">

```yaml
mirrors:
  docker.io:
    endpoint:
      - "http://mycustomreg.com:5000"
configs:
  "mycustomreg:5000":
    auth:
      username: xxxxxx # this is the registry username
      password: xxxxxx # this is the registry password
```

</TabItem>
<TabItem value="无认证">

```yaml
mirrors:
  docker.io:
    endpoint:
      - "http://mycustomreg.com:5000"
```
</TabItem>
</Tabs>

> 如果没有 TLS 通信，你需要为端点指定 `http://`，否则将默认为 https。

为了使镜像仓库更改生效，你需要重新启动每个节点上的 K3s。

## 将镜像添加到私有镜像仓库

首先，从 GitHub 上获取你正在使用的版本的 `k3s-images.txt` 文件。
从 docker.io 拉取 `k3s-images.txt` 文件中列出的 K3s 镜像

示例：`docker pull docker.io/rancher/coredns-coredns:1.6.3`

然后，将镜像重新标记到私有镜像仓库。

示例：`docker tag rancher/coredns-coredns:1.6.3 mycustomreg.com:5000/coredns-coredns`

最后，将镜像推送到私有镜像仓库。

示例：`docker push mycustomreg.com:5000/coredns-coredns`
