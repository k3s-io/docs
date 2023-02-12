---
title: "配置选项"
weight: 20
---

本文重点介绍首次设置 K3s 时可以使用的选项：

- [K3s 脚本](#使用安装脚本的选项)
- [K3s 二进制](#二进制配置)
- [配置文件](#配置文件)

如需更多高级选项，请参阅[此页面](../advanced/advanced.md)。

## 使用安装脚本的选项

如[快速入门指南](../quick-start/quick-start.md)中所述，你可以使用 https://get.k3s.io 上提供的安装脚本在基于 systemd 和 openrc 的系统上将 K3s 安装为服务。

你可以结合使用 `INSTALL_K3S_EXEC`、`K3S_` 环境变量和命令标志来配置安装。

为了说明这一点，以下命令均同样地没有 Flannel 和使用令牌的情况下注册 Server：

```bash
curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="--flannel-backend none --token 12345" sh -s -
curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="server --flannel-backend none" K3S_TOKEN=12345 sh -s -
curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="server" sh -s - --flannel-backend none
curl -sfL https://get.k3s.io | K3S_TOKEN=12345 sh -s - server --flannel-backend none
curl -sfL https://get.k3s.io | sh -s - --flannel-backend none --token 12345
```

有关所有环境变量的详细信息，请参阅[环境变量](../reference/env-variables.md)。

## 二进制配置

如前所述，安装脚本主要是将 K3s 配置为服务来运行。  
如果你选择不使用该脚本，你可以通过我们的 [Releases 页面](https://github.com/k3s-io/k3s/releases/latest)下载二进制文件，将其放在你的路径上，然后执行它即可运行 K3s。或者你可以安装 K3s 而不将其作为服务启用：
```bash
curl -sfL https://get.k3s.io | INSTALL_K3S_SKIP_ENABLE=true sh -
```

你可以通过 `K3S_` 环境变量配置 K3s：
```bash
K3S_KUBECONFIG_MODE="644" k3s server
```
或使用命令标志：
```bash
k3s server --write-kubeconfig-mode 644
```

K3s Agent 也可以这样配置：

```bash
k3s agent --server https://k3s.example.com --token mypassword
```

有关配置 K3s Server 的详细信息，请参阅 [Server 配置](../reference/server-config.md)  
有关配置 K3s Agent 的详细信息，请参阅 [Agent 配置。](../reference/agent-config.md)  
你还可以使用 `--help` 标志查看所有可用的选项。

:::info 匹配标志
匹配 Server/Agent 上的关键标志是非常重要的。例如，如果你在 master 节点上使用了 `--disable servicelb` 或 `--cluster-cidr=10.42.0.0/16` 标志，但是没有在其他 Server 节点上进行相同的设置，节点将无法加入。它们会显示 `failed to validate server configuration: critical configuration value mismatch` 错误。
::::
## 配置文件

:::info 版本

从 [v1.19.1+k3s1](https://github.com/k3s-io/k3s/releases/tag/v1.19.1%2Bk3s1) 起可用

:::

除了使用环境变量和 CLI 参数之外，你还可以使用配置文件配置 K3s。

默认情况下，安装时将使用位于 `/etc/rancher/k3s/config.yaml` 的 YAML 文件中的值。

下面是一个 `server` 配置文件的基本示例：

```yaml
write-kubeconfig-mode: "0644"
tls-san:
  - "foo.local"
node-label:
  - "foo=bar"
  - "something=amazing"
```

一般来说，CLI 参数映射到各自的 YAML 键，可重复的 CLI 参数被表示为 YAML 列表。

下面展示了一个完全使用 CLI 参数的相同配置：

```bash
k3s server \
  --write-kubeconfig-mode "0644"    \
  --tls-san "foo.local"             \
  --node-label "foo=bar"            \
  --node-label "something=amazing"
```

也可以同时使用配置文件和 CLI 参数。 在这种情况下，值将从两个来源加载，但 CLI 参数将优先。 对于 `--node-label` 等可重复参数，CLI 参数将覆盖列表中的所有值。

最后，配置文件的位置可以通过 CLI 参数 `--config FILE, -c FILE` 或者环境变量 `$K3S_CONFIG_FILE` 来改变。

## 组合使用

你可以把上述所有选项组合成一个示例。

`config.yaml` 文件创建在 `/etc/rancher/k3s/config.yaml` 中：

```yaml
token: "secret"
debug: true
```

然后使用环境变量和标志组合来运行安装脚本：

```bash
curl -sfL https://get.k3s.io | K3S_KUBECONFIG_MODE="644" INSTALL_K3S_EXEC="server" sh -s - --flannel-backend none
```

或者，如果你已经安装了 K3s 二进制文件：
```bash
K3S_KUBECONFIG_MODE="644" k3s server --flannel-backend none
```
