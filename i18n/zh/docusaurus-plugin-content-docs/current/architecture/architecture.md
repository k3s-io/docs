---
title: 架构
weight: 1
---

import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';

本文介绍了高可用（HA）K3s 服务器集群的架构，以及 K3s 与单节点服务器集群的区别。

本文还描述了 Agent 节点是如何注册到 K3s Server 的。

Server 节点指的是运行 `k3s server` 命令的主机（裸机或虚拟机）。Worker 节点指的是运行 `k3s agent` 命令的主机。

本文涵盖以下主题：

- [带有嵌入式数据库的单服务器设置](#带有嵌入式数据库的单服务器设置)
- [具有外部数据库的高可用 K3s Server](#具有外部数据库的高可用-k3s-server)
   - [Agent 节点的固定注册地址](#agent-节点的固定注册地址)
- [Agent 节点注册的工作原理](#agent-节点注册的工作原理)
- [自动部署的清单](#自动部署的清单)

### 带有嵌入式数据库的单服务器设置

下图显示了具有嵌入式 SQLite 数据库的单节点 K3s Server 集群示例。

在此配置中，每个 Agent 节点都注册到同一个 Server 节点。K3s 用户可以通过调用 Server 节点上的 K3s API 来操作 Kubernetes 资源。

<ThemedImage
alt="K3s Architecture with a Single Server"
sources={{
light: useBaseUrl('/img/k3s-architecture-single-server.svg'),
dark: useBaseUrl('/img/k3s-architecture-single-server-dark.svg'),
}}
/>


### 具有外部数据库的高可用 K3s Server

单服务器集群可以满足各种用例，但如果你的环境对 Kubernetes control plane 的正常运行时间有要求，你可以在 HA 配置中运行 K3s。一个 HA K3s 集群包括：

* 两个或多个 **Server 节点**为 Kubernetes API 提供服务并运行其他 control plane 服务
* **外部数据存储**（与单节点设置中使用的嵌入式 SQLite 数据存储相反）

<ThemedImage
alt="K3s Architecture with High-availability Servers"
sources={{
light: useBaseUrl('/img/k3s-architecture-ha-server.svg'),
dark: useBaseUrl('/img/k3s-architecture-ha-server-dark.svg'),
}}
/>

### Agent 节点的固定注册地址

在 HA 服务器配置中，每个节点还必须使用固定的注册地址向 Kubernetes API 注册，如下图所示。

注册后，Agent 节点直接与其中一个 Server 节点建立连接。

<ThemedImage
alt="Agent Registration HA"
sources={{
light: useBaseUrl('/img/k3s-production-setup.svg'),
dark: useBaseUrl('/img/k3s-production-setup-dark.svg'),
}}
/>

### Agent 节点注册的工作原理

Agent 节点通过 `k3s agent` 进程发起的 WebSocket 连接进行注册，连接由作为 agent 进程一部分运行的客户端负载均衡器维护。

Agent 将使用节点集群 Secret 以及随机生成的节点密码注册到 Server，密码存储在 `/etc/rancher/node/password` 中。Server 会将各个节点的密码存储为 Kubernetes Secret，后续的任何尝试都必须使用相同的密码。节点密码 Secret 存储在 `kube-system` 命名空间中，名称使用 `<host>.node-password.k3s` 模板。

注意：在 K3s v1.20.2 之前，Server 将密码存储在磁盘上的 `/var/lib/rancher/k3s/server/cred/node-passwd` 中。

如果 Agent 的 `/etc/rancher/node` 目录被删除，你需要为 Agent 重新创建密码文件，或者从 Server 中删除该条目。

通过使用 `--with-node-id` 标志启动 K3s Server 或 Agent，可以将唯一节点 ID 附加到主机名。

### 自动部署的清单

位于 `/var/lib/rancher/k3s/server/manifests` 路径下的[清单](https://github.com/rancher/k3s/tree/master/manifests)在构建时被捆绑到 K3s 二进制文件中，将由 [rancher/helm-controller](https://github.com/rancher/helm-controller#helm-controller) 在运行时安装。