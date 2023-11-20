---
title: 要求
weight: 1
---

K3s 非常轻量，但也有一些最低要求，如下所述。

无论 K3s 在容器中运行还是作为原生 Linux 服务运行，每个运行 K3s 的节点都应满足以下最低要求。这些要求是 K3s 及其打包组件的基准，不包括工作负载本身消耗的资源。

## 先决条件

两个节点不能具有相同的主机名。

如果多个节点将具有相同的主机名，或者主机名可以被自动配置系统重复使用，请使用 `--with-node-id` 选项为每个节点附加一个随机后缀，或者使用 `--node-name` 或 `$K3S_NODE_NAME` 为添加到集群的每个节点设计一个独特的名称。

## 架构

K3s 适用于以下架构：
- x86_64
- armhf
- arm64/aarch64
- s390x

:::warning ARM64 页面大小

在 2023 年 5 月版本（v1.24.14+k3s1、v1.25.10+k3s1、v1.26.5+k3s1、v1.27.2+k3s1）前，在 `aarch64/arm64` 系统上，操作系统必须使用 4k 页面大小。**RHEL9**、**Ubuntu**、**Raspberry PI OS** 和 **SLES** 都满足这个要求。

:::

## 操作系统

K3s 有望在大多数现代 Linux 系统上运行。

一些操作系统有特定的要求：

- 如果你使用 **Red Hat/CentOS Enterprise Linux**，请按照[这些步骤](../advanced/advanced.md#red-hat-enterprise-linux--centos)进行其他设置。
- 如果你使用 **Raspberry Pi OS**，请按照[这些步骤](../advanced/advanced.md#raspberry-pi)切换到旧版 iptables。

关于 Rancher 管理的 K3s 集群测试了哪些操作系统，请参阅 [Rancher 支持和维护条款](https://rancher.com/support-maintenance-terms/)。

## 硬件

硬件要求根据你部署的规模而变化。此处概述了最低建议。

| Spec | 最低 | 推荐 |
|------|---------|-------------|
| CPU | 1 核 | 2 核 |
| RAM | 512MB | 1 GB |

[资源分析](../reference/resource-profiling.md)的测试结果用于确定 K3s Agent、具有工作负载的 K3s Server 和具有一个 Agent 的 K3s Server 的最低资源要求。它还包含了有关对 K3s Server 和 Agent 利用率产生最大影响的分析，以及如何保护集群数据存储免受 Agent 和工作负载的干扰。

:::info Raspberry Pi 和嵌入式 etcd
如果在 Raspberry Pi 上部署带有嵌入式 etcd 的 K3s，建议你使用外部 SSD。etcd 是写入密集型的，SD 卡无法处理 IO 负载。
:::

#### 磁盘

K3s 的性能取决于数据库的性能。为确保最佳速度，我们建议尽可能使用 SSD。在使用 SD 卡或 eMMC 的 ARM 设备上，磁盘性能会有所不同。

## 网络

K3s Server 需要 6443 端口才能被所有节点访问。

使用 Flannel VXLAN 时，节点需要能够通过 UDP 端口 8472 访问其他节点，使用 Flannel Wireguard 后端时，节点需要能够通过 UDP 端口 51820 和 51821（使用 IPv6 时）访问其他节点。该节点不应侦听任何其他端口。K3s 使用反向隧道建立节点与 Server 的出站连接，所有 kubelet 流量都通过该隧道进行。但是，如果你不使用 Flannel 并提供自己的自定义 CNI，那么 K3s 不需要 Flannel 所需的端口。

如果要使用 Metrics Server，所有节点必须可以在端口 10250 上相互访问。

如果你计划使用嵌入式 etcd 来实现高可用性，则 Server 节点必须可以在端口 2379 和 2380 上相互访问。

:::tip 重要提示
节点上的 VXLAN 端口会开放集群网络，让任何人均能访问集群。因此，不要将 VXLAN 端口暴露给外界。请使用禁用 8472 端口的防火墙/安全组来运行节点。
:::

:::danger
Flannel 依赖 [Bridge CNI 插件](https://www.cni.dev/plugins/current/main/bridge/)来创建交换流量的 L2 网络。具有 `NET_RAW` 功能的 Rogue pod 可以滥用该 L2 网络来发动攻击，如 [ARP 欺骗](https://static.sched.com/hosted_files/kccncna19/72/ARP%20DNS%20spoof.pdf)。因此，如 [Kubernetes 文档](https://kubernetes.io/docs/concepts/security/pod-security-standards/)所述，请设置一个受限配置文件，在不可信任的 Pod 上禁用 `NET_RAW`。
:::

### K3s Server 节点的入站规则

| 协议 | 端口 | 源 | 目标 | 描述 |
|----------|-----------|-----------|-------------|------------
| TCP | 2379-2380 | Servers | Servers | 只有具有嵌入式 etcd 的 HA 需要 |
| TCP | 6443 | Agents | Servers | K3s supervisor 和 Kubernetes API Server |
| UDP | 8472 | 所有节点 | 所有节点 | 只有 Flannel VXLAN 需要 |
| TCP | 10250 | 所有节点 | 所有节点 | Kubelet 指标 |
| UDP | 51820 | 所有节点 | 所有节点 | 只有使用 IPv4 的 Flannel Wireguard 才需要 |
| UDP | 51821 | 所有节点 | 所有节点 | 只有使用 IPv6 的 Flannel Wireguard 才需要 |

所有出站流量通常都是允许的。

你可能需要根据使用的操作系统对防火墙进行其他更改。有关更多信息，请参阅[其他操作系统准备](../advanced/advanced.md#其他操作系统准备)。

## 大型集群

硬件要求取决于 K3s 集群的大小。对于生产和大型集群，我们建议使用具有外部数据库的高可用性设置。对于生产环境中的外部数据库，建议使用以下选项：

- MySQL
- PostgreSQL
- etcd

### CPU 和内存

高可用 K3s Server 中节点的最低 CPU 和内存要求如下：

| 部署规模 | 节点 | VCPUS | RAM |
|:---------------:|:---------:|:-----:|:-----:|
| Small | Up to 10 | 2 | 4 GB |
| Medium | Up to 100 | 4 | 8 GB |
| Large | Up to 250 | 8 | 16GB |
| X-Large | Up to 500 | 16 | 32GB |
| XX-Large | 500+ | 32 | 64GB |

### 磁盘

集群性能取决于数据库性能。为确保最佳速度，我们建议为 K3s 集群使用 SSD 磁盘。在云提供商上，你还需使用能获得最大 IOPS 的最小大小。

### 网络

你应该考虑增加集群 CIDR 的子网大小，避免用尽 Pod 的 IP。你可以通过在启动时将 `--cluster-cidr` 选项传递给 K3s Server 来实现这一点。

### 数据库

K3s 支持不同的数据库，包括 MySQL、PostgreSQL、MariaDB 和 etcd。有关详细信息，请参阅[集群数据存储](../datastore/datastore.md)。

以下是运行大型集群所需的数据库资源的大小指南：

| 部署规模 | 节点 | VCPUS | RAM |
|:---------------:|:---------:|:-----:|:-----:|
| Small | Up to 10 | 1 | 2 GB |
| Medium | Up to 100 | 2 | 8 GB |
| Large | Up to 250 | 4 | 16GB |
| X-Large | Up to 500 | 8 | 32GB |
| XX-Large | 500+ | 16 | 64GB |
