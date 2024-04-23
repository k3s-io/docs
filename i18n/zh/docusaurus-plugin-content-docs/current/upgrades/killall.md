---
title: 停止 K3s
---


为了在升级期间实现高可用性，K3s 容器在 K3s 服务停止时会继续运行。

要停止所有 K3s 容器并重置容器状态，你可以使用 `k3s-killall.sh` 脚本。

killall 脚本能清理容器、K3s 目录和网络组件，同时还能删除 iptables 链以及所有相关规则。集群数据不会被删除。

要在 Server 节点中运行 killall 脚本，请运行：

```bash
/usr/local/bin/k3s-killall.sh
```
