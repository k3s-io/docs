---
title: "手动升级"
weight: 10
---

你可以使用安装脚本升级 K3s，也可以手动安装所需版本的二进制文件。

> **注意**：升级时会先升级 Server 节点，然后再升级 Worker 节点。

### 版本 Channels

通过安装脚本或使用我们的[自动升级](automated.md)功能执行的升级可以绑定到不同的版本 channels。以下是可用的 channels：

| Channel | 描述 |
|---------------|---------|
| stable | （默认）生产环境建议使用稳定版。这些版本已经过一段时间的社区强化。 |
| latest | 建议使用最新版本来试用最新功能。这些版本已经过一段时间的社区强化。 |
| v1.22（示例） | 每个受支持的 Kubernetes 次要版本都有一个发布 channel。目前它们是 `v1.22`、`v1.23` 和 `v1.24`。这些 channel 会选择可用的最新补丁，不一定是稳定版本。 |

有关详细的最新 channel 列表，你可以访问 [k3s channel 服务 API](https://update.k3s.io/v1-release/channels)。有关 channel 如何工作的更多信息，请参阅 [channelserver 项目](https://github.com/rancher/channelserver)。

### 使用安装脚本升级 K3s

要升级旧版本的 K3s，你可以使用相同的标志重新运行安装脚本，例如：

```sh
curl -sfL https://get.k3s.io | sh -
```

:::note
中国用户，可以使用以下方法加速升级：
```
curl -sfL https://rancher-mirror.rancher.cn/k3s/k3s-install.sh | INSTALL_K3S_MIRROR=cn sh -
```
:::
默认情况下将升级到 stable channel 中的较新版本。

如果想升级到特定 channel（如 latest）中的更新版本，你可以指定 channel：
```sh
curl -sfL https://get.k3s.io | INSTALL_K3S_CHANNEL=latest sh -
```

如果要升级到特定版本，可以运行以下命令：

```sh
curl -sfL https://get.k3s.io | INSTALL_K3S_VERSION=vX.Y.Z-rc1 sh -
```

### 使用二进制文件手动升级 K3s

或者手动升级 K3s：

1. 从 [releases](https://github.com/rancher/k3s/releases) 页面下载所需版本的 K3s 二进制文件
2. 将下载的二进制文件复制到 `/usr/local/bin/k3s`（或你想要的位置）
3. 停止旧的 K3s 二进制文件
4. 启动新的 K3s 二进制文件

### 重启 K3s

systemd 和 OpenRC 的安装脚本支持重启 K3s。

**systemd**

手动重启 Server：
```sh
sudo systemctl restart k3s
```

手动重启 Agent：
```sh
sudo systemctl restart k3s-agent
```

**OpenRC**

手动重启 Server：
```sh
sudo service k3s restart
```

手动重启 Agent：
```sh
sudo service k3s-agent restart
```
