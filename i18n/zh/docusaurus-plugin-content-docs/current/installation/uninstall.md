---
title: 卸载 K3s
weight: 61
---

:::warning
卸载 K3s 会删除 local 集群数据、配置以及所有脚本和 CLI 工具。  
不会删除外部数据存储中的任何数据，也不会删除使用外部 Kubernetes 存储卷的 Pod 创建的数据。
:::

如果你使用安装脚本安装了 K3s，安装过程中会生成一个卸载 K3s 的脚本。

如果你想在卸载和重新安装后将节点重新加入现有集群，请务必从集群中删除节点，确保删除了节点密码 Secret。有关详细信息，请参阅[节点注册](../architecture/architecture.md#how-agent-node-registration-works)文档。

### 卸载 Server
要从 Server 节点卸载 K3s，请运行：

```bash
/usr/local/bin/k3s-uninstall.sh
```

### 卸载 Agent
要从 Agent 节点卸载 K3s，请运行：

```bash
/usr/local/bin/k3s-agent-uninstall.sh
```
