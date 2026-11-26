---
title: "配置选项"
---

本页重点介绍首次设置 K3s 时常用的选项。更深入的说明请参阅[高级选项和配置](../advanced.md)以及 [server](../cli/server.md) 和 [agent](../cli/agent.md) 命令文档。

## 使用安装脚本进行配置 {#configuration-with-install-script}

如[快速入门指南](../quick-start.md)所述，你可以使用 https://get.k3s.io 上提供的安装脚本，在基于 systemd 和 openrc 的系统上将 K3s 安装为服务。

你可以组合使用 `INSTALL_K3S_EXEC`、`K3S_` 环境变量和命令行标志，将配置传递给服务配置。
带前缀的环境变量、`INSTALL_K3S_EXEC` 的值以及末尾的 shell 参数都会持久化到服务配置中。
安装完成后，可以通过编辑环境文件、编辑服务配置，或直接使用新选项重新运行安装程序来修改配置。

为说明这一点，以下命令都会以相同的行为注册一个未启用 flannel 且带有 token 的 server：

```bash
curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="server" sh -s - --flannel-backend none --token 12345
curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="server --flannel-backend none" K3S_TOKEN=12345 sh -s -
curl -sfL https://get.k3s.io | K3S_TOKEN=12345 sh -s - server --flannel-backend none
# server is assumed below because there is no K3S_URL
curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="--flannel-backend none --token 12345" sh -s - 
curl -sfL https://get.k3s.io | sh -s - --flannel-backend none --token 12345
```

注册 agent 时，以下命令的行为也完全相同：

```bash
curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="agent --server https://k3s.example.com --token mypassword" sh -s -
curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="agent" K3S_TOKEN="mypassword" sh -s - --server https://k3s.example.com
curl -sfL https://get.k3s.io | K3S_URL=https://k3s.example.com sh -s - agent --token mypassword
curl -sfL https://get.k3s.io | K3S_URL=https://k3s.example.com K3S_TOKEN=mypassword sh -s - # agent is assumed because of K3S_URL
```

有关所有环境变量的详细信息，请参阅[环境变量](../reference/env-variables.md)。

:::info 注意
如果在运行安装脚本时设置了配置，但在重新运行安装脚本时没有再次设置，则原始值将会丢失。

[配置文件](#configuration-file)的内容不受安装脚本管理。
如果你希望配置独立于安装脚本，应使用配置文件，而不是向安装脚本传递环境变量或参数。
:::

## 使用二进制文件进行配置 {#configuration-with-binary}

安装脚本主要负责将 K3s 配置为系统服务运行。
如果你选择不使用安装脚本，只需从 [GitHub releases 页面](https://github.com/k3s-io/k3s/releases/latest)下载二进制文件，将其放入 PATH，然后执行即可运行 K3s。对于永久安装来说，这种方式并不实用，但在进行无需将 K3s 作为系统服务管理的快速测试时可能很有用。
```bash
curl -Lo /usr/local/bin/k3s https://github.com/k3s-io/k3s/releases/download/v1.26.5+k3s1/k3s; chmod a+x /usr/local/bin/k3s
```

你可以通过设置 `K3S_` 环境变量来传递配置：
```bash
K3S_KUBECONFIG_MODE="644" k3s server
```

或者使用命令行标志：
```bash
k3s server --write-kubeconfig-mode=644
```

k3s agent 也可以通过这种方式配置：

```bash
k3s agent --server https://k3s.example.com --token mypassword
```

有关配置 K3s server 的详细信息，请参阅 [`k3s server` 文档](../cli/server.md)。
有关配置 K3s agent 的详细信息，请参阅 [`k3s agent` 文档](../cli/agent.md)。
你还可以使用 `--help` 标志查看所有可用选项及其对应的环境变量。

:::info 匹配标志
确保各 server 节点上的关键标志保持一致非常重要。例如，如果你在 master 节点上使用了
`--disable servicelb` 或 `--cluster-cidr=10.200.0.0/16`，却没有在其他 server 节点上做同样的设置，这些节点将无法加入集群，并会输出类似以下错误：
`failed to validate server configuration: critical configuration value mismatch.`
有关哪些标志必须在各 server 节点上完全一致的更多信息，请参阅上文链接的 Server 配置文档。
:::

## 使用容器镜像进行配置 {#configuration-with-container-image}

k3s 容器镜像（[`docker.io/rancher/k3s`](https://hub.docker.com/r/rancher/k3s)）支持与 GitHub release 页面上的二进制文件相同的配置方法。

## 配置文件 {#configuration-file}

除了使用环境变量和 CLI 参数配置 K3s 外，K3s 还可以使用配置文件。
无论 k3s 如何安装或执行，配置文件都会被加载。

默认情况下，配置从 `/etc/rancher/k3s/config.yaml` 加载，drop-in 文件按字母顺序从 `/etc/rancher/k3s/config.yaml.d/*.yaml` 加载。
该路径可通过 `--config` CLI 标志或 `K3S_CONFIG_FILE` 环境变量配置。
当覆盖默认配置文件名称时，drop-in 目录路径也会随之更改。

下面是一个基本的 `server` 配置文件示例：

```yaml title="/etc/rancher/k3s/config.yaml"
write-kubeconfig-mode: "0644"
tls-san:
  - "foo.local"
node-label:
  - "foo=bar"
  - "something=amazing"
cluster-init: true
```

这等效于以下 CLI 参数：

```bash
k3s server \
  --write-kubeconfig-mode "0644"    \
  --tls-san "foo.local"             \
  --node-label "foo=bar"            \
  --node-label "something=amazing"  \
  --cluster-init
```

通常，CLI 参数会映射到对应的 YAML 键，可重复的 CLI 参数表示为 YAML 列表。布尔标志在 YAML 文件中表示为 `true` 或 `false`。

也可以同时使用配置文件和 CLI 参数。在这种情况下，将从两个来源加载值，但 CLI 参数的优先级更高。对于 `--node-label`、`--disable` 等可重复参数，CLI 传入的值会追加到配置文件中的值之后。

### 值合并行为 {#value-merge-behavior}

如果同一个键出现在多个文件中，将使用最后找到的值。可以在键后追加 `+`，将值追加到现有字符串或切片中，而不是替换它。后续文件中该键的所有出现也都要带 `+`，以防止覆盖已累积的值。

下面是一个从多个配置文件合并值的示例：

```yaml title="/etc/rancher/k3s/config.yaml"
token: boop
node-label:
  - foo=bar
  - bar=baz
```

```yaml title="/etc/rancher/k3s/config.yaml.d/test1.yaml"
write-kubeconfig-mode: 600
node-taint:
  - alice=bob:NoExecute
```

```yaml title="/etc/rancher/k3s/config.yaml.d/test2.yaml"
write-kubeconfig-mode: 777
node-label:
  - other=what
  - foo=three
node-taint+:
  - charlie=delta:NoSchedule
```

最终配置为：

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

CLI 参数在所有配置文件之后应用。对于可重复参数，CLI 传入的值会追加到配置文件的值之后。例如，使用上述配置文件运行：

```bash
k3s server --node-label foo=four --node-label bar=baz
```

K3s 会将标签 `other=what,foo=three,foo=four,bar=baz` 传递给 kubelet。kubelet 按顺序应用这些键值对，因此重复键的最后一个值会生效，节点最终注册的标签为 `other=what`、`foo=four` 和 `bar=baz`。对于不是键值对的可重复参数，CLI 传入的值会直接追加。

## 综合示例 {#putting-it-all-together}

上述所有选项都可以组合到一个示例中。

在 `/etc/rancher/k3s/config.yaml` 中创建 `config.yaml` 文件：

```yaml
token: "secret"
debug: true
```

然后使用环境变量和标志的组合运行安装脚本：

```bash
curl -sfL https://get.k3s.io | K3S_KUBECONFIG_MODE="644" INSTALL_K3S_EXEC="server" sh -s - --flannel-backend none
```

或者，如果你已经安装了 K3s 二进制文件：
```bash
K3S_KUBECONFIG_MODE="644" k3s server --flannel-backend none
```

这将得到一个满足以下条件的 server：
- kubeconfig 文件权限为 `644`
- Flannel 后端设置为 `none`
- token 设置为 `secret`
- 启用调试日志

## Kubelet 配置文件 {#kubelet-configuration-files}

Kubernetes 支持通过 CLI 标志和配置文件两种方式配置 kubelet。
通过 CLI 标志配置 kubelet 早已被弃用，但仍然受支持，并且是设置基本选项的最简单方式。
某些高级 kubelet 配置只能通过配置文件设置。
更多信息请参阅 Kubernetes 文档中关于 [kubelet](https://kubernetes.io/docs/reference/command-line-tools-reference/kubelet/) 和[通过配置文件设置 kubelet 参数](https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/)的内容。

:::info 版本限制
对 kubelet drop-in 配置文件或配置文件的支持（下文的选项 1 和 2）仅适用于 v1.32 及以上版本。
对于更早的版本，应直接使用 kubelet 参数（下文的选项 3）。
:::

K3s 使用默认的 kubelet 配置，存储在 `/var/lib/rancher/k3s/agent/etc/kubelet.conf.d/00-k3s-defaults.conf` 下。如果你想更改默认配置参数，有以下三种方法：

1. 在 `/var/lib/rancher/k3s/agent/etc/kubelet.conf.d/` 中放置一个 drop-in 配置文件 *（推荐）*
2. 使用标志 `--kubelet-arg=config=$PATHTOFILE`，其中 `$PATHTOFILE` 是包含 kubelet 配置参数的文件路径（例如 `/etc/rancher/k3s/kubelet.conf`）；或使用标志 `--kubelet-arg=config-dir=$PATHTODIR`，其中 `$PATHTODIR` 是包含 kubelet 配置参数文件的目录路径（例如 `/etc/rancher/k3s/kubelet.conf.d`）
3. 使用标志 `--kubelet-arg=$FLAG`，其中 `$FLAG` 是 kubelet 配置参数（例如 `image-gc-high-threshold=100`）。

混合使用 kubelet CLI 标志和配置文件 drop-in 时，请注意[优先级顺序](https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/#kubelet-configuration-merging-order)。
