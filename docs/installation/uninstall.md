---
title: 卸载 K3s
---

:::warning
卸载 K3s 可能导致数据丢失！
:::

如果你安装 K3s 时使用了安装脚本，那么卸载脚本在安装时即已被生成。

运行卸载脚本将停止（运行中的）K3s 以及工作中的 pods，并删除本地集群存储集、[本地储存](../storage.md#setting-up-the-local-storage-provider)持久化卷数据，以及所有脚本和命令行工具。
任何外部存储中，或使用外部 K8s 持久化卷的 pods 创建的数据都不会被删除。

如果你打算在卸载&重装 K3s 后重新将节点加入到一个已有集群，需确保从集群中将该节点删除以确保节点的密码密钥被移除。[节点注册](../architecture.md#how-agent-node-registration-works)文档中有更多信息可供参考。

### 卸载 Server 节点
如需从 server 节点卸载 K3s ，可运行：

```bash
/usr/local/bin/k3s-uninstall.sh
```

### 卸载 Agent 节点
如需从 agent 节点卸载 K3s ，可运行：

```bash
/usr/local/bin/k3s-agent-uninstall.sh
```
