---
title: 环境变量
---

如[快速入门指南](../quick-start.md)中所述，你可以使用 https://get.k3s.io 上提供的安装脚本在基于 systemd 和 openrc 的系统上将 K3s 安装为服务。

此命令的最简单形式如下：

```bash
curl -sfL https://get.k3s.io | sh -
```

:::note
中国用户，可以使用以下方法加速安装：
```
curl -sfL https://rancher-mirror.rancher.cn/k3s/k3s-install.sh | INSTALL_K3S_MIRROR=cn sh -
```
:::

使用该方法安装 K3s 时，你可以使用以下环境变量来配置安装：

| 环境变量 | 描述 |
|-----------------------------|---------------------------------------------|
| `INSTALL_K3S_SKIP_DOWNLOAD` | 如果设置为 `true` 将不会下载 K3s 哈希或二进制文件。 |
| `INSTALL_K3S_SYMLINK` | 默认情况下，如果命令不存在于路径中，将为 kubectl、crictl 和 ctr 二进制文件创建符号链接。如果设置为 `skip` 将不会创建符号链接，设置为 `force` 将会覆盖。 |
| `INSTALL_K3S_SKIP_ENABLE` | 如果设置为 `true` 将不会启用或启动 K3s 服务。 |
| `INSTALL_K3S_SKIP_START` | 如果设置为 `true` 将不会启动 K3s 服务。 |
| `INSTALL_K3S_VERSION` | 从 GitHub 下载的 K3s 版本。如果未指定，将尝试从 stable channel 下载。 |
| `INSTALL_K3S_BIN_DIR` | 安装 K3s 二进制文件、链接和卸载脚本的目录，或使用 `/usr/local/bin` 作为默认目录。 |
| `INSTALL_K3S_BIN_DIR_READ_ONLY` | 如果设置为 `true` 将不会将文件写入 `INSTALL_K3S_BIN_DIR`，强制设置为 `INSTALL_K3S_SKIP_DOWNLOAD=true`。 |
| `INSTALL_K3S_SYSTEMD_DIR` | 安装 systemd 服务和环境文件的目录，或使用 `/etc/systemd/system` 作为默认目录。 |
| `INSTALL_K3S_EXEC` | 带有标志的命令，用于在服务中启动 K3s。如果未指定命令并且设置了 `K3S_URL`，它将默认为 "agent"。如果未设置 `K3S_URL`，它将默认为 "server"。如需帮助，请参阅[此示例](../installation/configuration.md#使用安装脚本的选项)。 |
| `INSTALL_K3S_NAME` | 要创建的 systemd 服务的名称，如果将 K3s 作为 server 运行，则默认为 “k3s”，如果将 K3s 作为 agent 运行，则默认为 “k3s-agent”。如果指定，名称将以“k3s-”为前缀。 |
| `INSTALL_K3S_TYPE` | 要创建的 systemd 服务类型，如果未指定，将默认使用来自 K3s exec 命令的类型。 |
| `INSTALL_K3S_SELINUX_WARN` | 如果设置为 `true`，则在未找到 k3s-selinux 策略时会继续。 |
| `INSTALL_K3S_SKIP_SELINUX_RPM` | 如果设置为 `true` 将跳过 k3s RPM 的自动安装。 |
| `INSTALL_K3S_CHANNEL_URL` | 用于获取 K3s 下载 URL 的 Channel URL。默认为 https://update.k3s.io/v1-release/channels。 |
| `INSTALL_K3S_CHANNEL` | 用于获取 K3s 下载 URL 的 Channel。默认为 "stable"。可选项：`stable`、`latest`、`testing`。 |

以下示例显示了如何将上述环境变量作为选项设置（在管道符后）：

```bash
curl -sfL https://get.k3s.io | INSTALL_K3S_CHANNEL=latest sh -
```

以 `K3S_` 开头的环境变量将被保留，供 systemd 和 openrc 服务使用。

如果设置了 `K3S_URL` 但没有设置 exec 命令，将默认命令为“agent”。

运行 agent 时，还必须设置 `K3S_TOKEN`。