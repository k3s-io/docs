---
title: "配置选项"
weight: 20
---

本文重点介绍首次设置 K3s 时常用的选项。如需了解详情，请参阅有关[高级选项和配置](../advanced/advanced.md)以及 [server](../cli/server.md) 和 [agent](../cli/agent.md) 命令的文档。

## 使用安装脚本的选项

如[快速入门指南](../quick-start/quick-start.md)中所述，你可以使用 https://get.k3s.io 上提供的安装脚本在基于 systemd 和 openrc 的系统上将 K3s 安装为服务。

你可以结合使用 `INSTALL_K3S_EXEC`、`K3S_` 环境变量和命令标志将配置传递给服务配置。
带前缀的环境变量、`INSTALL_K3S_EXEC` 值和尾附的 shell 参数都保存在服务配置中。
安装后，如果需要更改配置，你可以编辑环境文件、编辑服务配置或简单使用新选项重新运行安装程序。

为了说明这一点，以下命令均同样地没有 Flannel 和使用令牌的情况下注册 Server：

```bash
curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="server" sh -s - --flannel-backend none --token 12345
curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="server --flannel-backend none" K3S_TOKEN=12345 sh -s -
curl -sfL https://get.k3s.io | K3S_TOKEN=12345 sh -s - server --flannel-backend none
# server is assumed below because there is no K3S_URL
curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="--flannel-backend none --token 12345" sh -s -
curl -sfL https://get.k3s.io | sh -s - --flannel-backend none --token 12345
```

注册 Agent 时，以下命令都会导致同样的行为：

```bash
curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="agent --server https://k3s.example.com --token mypassword" sh -s -
curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="agent" K3S_TOKEN="mypassword" sh -s - --server https://k3s.example.com
curl -sfL https://get.k3s.io | K3S_URL=https://k3s.example.com sh -s - agent --token mypassword
curl -sfL https://get.k3s.io | K3S_URL=https://k3s.example.com K3S_TOKEN=mypassword sh -s - # agent is assumed because of K3S_URL
```

有关所有环境变量的详细信息，请参阅[环境变量](../reference/env-variables.md)。

:::info
如果你在运行安装脚本时进行了配置，但在重新运行安装脚本时没有重新设置，则原始值将会丢失。

[配置文件](#配置文件) 的内容不受安装脚本管理。
要让你的配置独立于安装脚本，请使用配置文件而不是传递环境变量或使用安装脚本参数。
:::

## 二进制配置

如前所述，安装脚本主要是将 K3s 配置为服务来运行。  
如果你选择不使用该脚本，你可以通过我们的 [Releases 页面](https://github.com/k3s-io/k3s/releases/latest)下载二进制文件，将其放在你的路径上，然后执行它即可运行 K3s。对于永久安装而言这不是特别有用，但如果执行不需要将 K3s 作为系统服务管理的快速测试，这可能有用。
```bash
curl -Lo /usr/local/bin/k3s https://github.com/k3s-io/k3s/releases/download/v1.26.5+k3s1/k3s; chmod a+x /usr/local/bin/k3s
```

你可以通过设置 `K3S_` 环境变量来传递配置：
```bash
K3S_KUBECONFIG_MODE="644" k3s server
```

或使用命令标志：
```bash
k3s server --write-kubeconfig-mode=644
```

K3s Agent 也可以这样配置：

```bash
k3s agent --server https://k3s.example.com --token mypassword
```

关于配置 K3s Server 的详细信息，请参阅 [`K3s Server` 文档](../cli/server.md)。  
有关配置 K3s Agent 的详细信息，请参阅 [`K3s Agent` 文档](../cli/agent.md)。  
你还可以使用 `--help` 标志来查看所有可用选项及其对应的环境变量。

:::info 匹配标志
匹配 Server 节点上的关键标志是非常重要的。例如，如果你在 master 节点上使用了 `--disable servicelb` 或 `--cluster-cidr=10.200.0.0/16` 标志，但是没有在其他 Server 节点上进行相同的设置，节点将无法加入。它们会显示 `failed to validate server configuration: critical configuration value mismatch` 错误。
有关必须在 Server 节点上设置的标志的更多信息，请参阅 Server 配置文档（上方链接）。
:::
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
cluster-init: true
```

等效于以下 CLI 参数：

```bash
k3s server \
  --write-kubeconfig-mode "0644"    \
  --tls-san "foo.local"             \
  --node-label "foo=bar"            \
  --node-label "something=amazing"  \
  --cluster-init
```

一般来说，CLI 参数映射到各自的 YAML 键，可重复的 CLI 参数被表示为 YAML 列表。布尔标志在 YAML 文件中表示为 `true` 或 `false`。

也可以同时使用配置文件和 CLI 参数。 在这种情况下，值将从两个来源加载，但 CLI 参数将优先。 对于 `--node-label` 等可重复参数，CLI 参数将覆盖列表中的所有值。

最后，配置文件的位置可以通过 CLI 参数 `--config FILE, -c FILE` 或者环境变量 `$K3S_CONFIG_FILE` 来改变。

### 多个配置文件
:::info 版本
从 [v1.21.0+k3s1](https://github.com/k3s-io/k3s/releases/tag/v1.21.0%2Bk3s1) 起可用
:::

支持多个配置文件。默认从 `/etc/rancher/k3s/config.yaml` 和 `/etc/rancher/k3s/config.yaml.d/*.yaml` 中按字母顺序读取配置文件。

默认情况下，将使用给定键的最后一个值。可以将 `+` 附加到键，这样能将值附加到现有字符串或切片，而不是替换它。后续文件中的所有此键也需要使用 `+` 来防止覆盖累积值。

多个配置文件的示例如下：

```yaml
# config.yaml
token: boop
node-label:
  - foo=bar
  - bar=baz


# config.yaml.d/test1.yaml
write-kubeconfig-mode: 600
node-taint:
  - alice=bob:NoExecute

# config.yaml.d/test2.yaml
write-kubeconfig-mode: 777
node-label:
  - other=what
  - foo=three
node-taint+:
  - charlie=delta:NoSchedule

```

因此，最终配置如下：

```yaml
write-kubeconfig-mode: 777
token: boop
node-label:
  - other=what
  - foo=three
node-taint:
  - alice=bob:NoExecute
  - charlie=delta:NoSchedule
```

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

Server 情况如下：
- kubeconfig 文件权限为 `644`
- Flannel 后端设置为 `none`
- 令牌设置为 `secret`
- 启用调试日志记录
