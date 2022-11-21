---
title: "快速入门指南"
weight: 10
---

本指南帮助你使用默认选项快速启动集群。[安装部分](installation/installation.md)更详细地介绍了如何设置 K3s。

有关 K3s 组件如何协同工作的信息，请参阅[架构](architecture/architecture.md#具有外部数据库的高可用-k3s-server)。

:::note
Kubernetes 新手？Kubernetes 官方文档介绍了一些很好的[基础知识教程](https://kubernetes.io/docs/tutorials/kubernetes-basics/)。
:::

安装脚本
--------------
K3s 提供了一个安装脚本，可以方便地将其作为服务安装在基于 systemd 或 openrc 的系统上。该脚本可在 https://get.k3s.io 获得。要使用这种方法安装 K3s，只需运行：
```bash
curl -sfL https://get.k3s.io | sh -
```

运行此安装后：

* K3s 服务将被配置为在节点重启后或进程崩溃或被杀死时自动重启。
* 将安装其他实用程序，包括 `kubectl`、`crictl`、`ctr`、`k3s-killall.sh` 和 `k3s-uninstall.sh`。
* [kubeconfig](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/) 文件将写入到 `/etc/rancher/k3s/k3s.yaml`，由 K3s 安装的 kubectl 将自动使用该文件。

要在 Worker 节点上安装并将它们添加到集群，请使用 `K3S_URL` 和 `K3S_TOKEN` 环境变量运行安装脚本。以下示例演示了如何加入 Worker 节点：

```bash
curl -sfL https://get.k3s.io | K3S_URL=https://myserver:6443 K3S_TOKEN=mynodetoken sh -
```
设置 `K3S_URL` 参数会使 K3s 以 Worker 模式运行。K3s Agent 将注册到在 URL 上监听的 K3s Server。`K3S_TOKEN` 使用的值存储在 Server 节点上的 `/var/lib/rancher/k3s/server/node-token` 中。

注意：每台主机必须具有唯一的主机名。如果你的计算机没有唯一的主机名，请传递 `K3S_NODE_NAME` 环境变量，并为每个节点提供一个有效且唯一的主机名。
