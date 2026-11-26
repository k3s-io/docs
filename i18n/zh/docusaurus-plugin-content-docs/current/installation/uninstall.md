---
title: "卸载 K3s"
---

:::warning
卸载 K3s 可能导致数据丢失！
:::

如果你使用安装脚本安装了 K3s，安装期间会生成一个用于卸载 K3s 的脚本。

运行卸载脚本会停止 K3s 和所有正在运行的 Pod，并删除本地集群数据存储、[本地存储](../add-ons/storage.md#setting-up-the-local-storage-provider)的持久卷数据、节点配置，以及所有脚本和 CLI 工具。
它不会删除外部数据存储中的任何数据，也不会删除使用外部 Kubernetes 持久卷的 Pod 所创建的数据。

如果你计划在卸载并重新安装后将节点重新加入现有集群，请务必先从集群中删除该节点，以确保节点密码 Secret 被移除。更多信息请参阅[节点注册](../architecture.md#how-agent-node-registration-works)文档。

### 卸载 Server 节点 {#uninstalling-servers}
如需从 server 节点卸载 K3s，请运行：

```bash
/usr/local/bin/k3s-uninstall.sh
```

### 卸载 Agent 节点 {#uninstalling-agents}
如需从 agent 节点卸载 K3s，请运行：

```bash
/usr/local/bin/k3s-agent-uninstall.sh
```
