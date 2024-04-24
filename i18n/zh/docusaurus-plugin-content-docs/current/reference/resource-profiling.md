---
title: 资源分析
---

本文介绍了测试结果，用于确定 K3s 的最低资源要求。

结果总结如下：

| 组件 | 处理器 | 最小 CPU | Kine/SQLite 的最小 RAM | 嵌入式 etcd 的最小 RAM |
|------------|-----|----------|-------------------------|---------------------------|
| 具有工作负载的 K3s Server | Intel 8375C CPU, 2.90 GHz | 核的 6% | 1596M | 1606M |
| 具有单个 Agent 的 K3s 集群 | Intel 8375C CPU, 2.90 GHz | 核的 5% | 1428M | 1450M |
| K3s agent | Intel 8375C CPU, 2.90 GHz | 核的 3% | 275M | 275M |
| 具有工作负载的 K3s Server | Pi4B BCM2711, 1.50 GHz | 核的 30% | 1588M | 1613M |
| 具有单个 Agent 的 K3s 集群 | Pi4B BCM2711, 1.50 GHz | 核的 25% | 1215M | 1413M |
| K3s agent | Pi4B BCM2711, 1.50 GHz | 核的 10% | 268M | 268M |

- [资源测试范围](#资源测试范围)
- [用于基线测量的组件](#用于基线测量的组件)
- [方法](#方法)
- [环境](#环境)
- [基准资源要求](#基准资源要求)
   - [具有工作负载的 K3s Server](#具有工作负载的-k3s-server)
   - [具有单个 Agent 的 K3s 集群](#具有单个-agent-的-k3s-集群)
   - [K3s Agent](#k3s-agent)
- [分析](#分析)
   - [主要资源使用率决定因素](#主要资源使用率决定因素)
   - [防止 Agent 和工作负载干扰集群数据存储](#防止-agent-和工作负载干扰集群数据存储)

## 资源测试范围

资源测试旨在解决以下问题：

- 在单节点集群上，确定要为整个 K3s 服务器堆栈预留的最小 CPU、内存和 IOP 数量（假设集群上将部署真实的工作负载）。
- 在 Agent（Worker）节点上，确定要为 Kubernetes 和 K3s control plane 组件（kubelet 和 k3s agent）预留的最小 CPU、内存和 IOP 数量。

## 用于基线测量的组件

测试的组件包括：

* 启用所有打包组件的 K3s 1.26.5
* Prometheus + Grafana 监控栈
* [Kubernetes 示例 Nginx 部署](https://kubernetes.io/docs/tasks/run-application/run-stateless-application-deployment/)

这些是一个稳定系统的基线数据，只使用 K3s 打包的组件（Traefik Ingress、Klipper lb、本地路径存储），运行标准的监控堆栈（Prometheus 和 Grafana）和 Guestbook 示例应用程序。

包括 IOPS 在内的资源数据仅用于 Kubernetes 数据存储和 control plane，不包括系统级 management agent 或 logging、容器镜像管理或任何工作负载要求的开销。

## 方法

Prometheus v2.43.0 的独立实例可以通过 apt 安装的 `prometheus-node-exporter` 收集主机 CPU、内存和磁盘 IO 统计信息。

`systemd-cgtop` 用于抽查 systemd cgroup 级别的 CPU 和内存利用率。`system.slice/k3s.service` 跟踪 K3s 和 containerd 的资源利用率，而单个 pod 位于 `kubepods` 层级下。

其他详细的 K3s 内存利用率数据是使用 server 和 agent 进程的集成 metrics-server 从 `kubectl top node` 收集的。

利用率数据来自于运行所述工作负载的节点上稳态运行的第 95 个百分位读数。

## 环境

| Arch | OS | System | CPU | RAM | Disk |
|------|----|--------|--|----|------|
| x86_64 | Ubuntu 22.04 | AWS c6id.xlarge | Intel Xeon Platinum 8375C CPU, 4 Core 2.90 GHz | 8 GB | NVME SSD |
| aarch64 | Raspberry Pi OS 11 | Raspberry Pi 4 Model B | BCM2711, 4 Core 1.50 GHz | 8 GB | UHS-III SDXC |


## 基准资源要求

本文介绍了测试结果，用于确定基本 K3s 操作的最低资源要求。

### 具有工作负载的 K3s Server

这些是单节点集群的要求，其中 K3s Server 与[简单工作负载](https://kubernetes.io/docs/tasks/run-application/run-stateless-application-deployment/)共享资源。

CPU 要求：

| 系统 | CPU 核用量 |
|--------|----------------|
| Intel 8375C | 核的 6% |
| Pi4B | 核的 30% |

内存要求：

| 测试的数据存储 | 系统 | 内存 |
|-----------|---------|------|
| Kine/SQLite | Intel 8375C | 1596M |
|             | Pi4B | 1588M |
| 嵌入式 etcd | Intel 8375C | 1606M |
|               | Pi4B | 1613M |

磁盘要求：

| 测试的数据存储 | IOPS | KiB/sec | 延迟 |
|-----------|------|---------|---------|
| Kine/SQLite | 10 | 500 | < 10 ms |
| 嵌入式 etcd | 50 | 250 | < 5 ms |

### 具有单个 Agent 的 K3s 集群

以下介绍具有 K3s Server 节点和 K3s Agent，但没有工作负载的 K3s 集群的基线要求。

#### K3s Server
CPU 要求：

| 系统 | CPU 核用量 |
|--------|----------------|
| Intel 8375C | 核的 5% |
| Pi4B | 核的 25% |

内存要求：

| 测试的数据存储 | 系统 | 内存 |
|-----------|---------|------|
| Kine/SQLite | Intel 8375C | 1428M |
|             | Pi4B | 1215M |
| 嵌入式 etcd | Intel 8375C | 1450M |
|               | Pi4B | 1413M |

### K3s Agent

要求：

| 系统 | CPU 核用量 | RAM |
|--------|----------------|-----|
| Intel 8375C | 核的 3% | 275M |
| Pi4B | 核的 5% | 268M |




## 分析

本节包括了对 K3s Server 和 Agent 利用率产生最大影响的分析，以及如何保护集群数据存储免受 Agent 和工作负载的干扰。

### 主要资源使用率决定因素

K3s Server 利用率数据主要取决于 Kubernetes 数据存储（kine 或 etcd）、API Server、Controller-Manager 和 Scheduler 控制循环的支持，以及影响系统状态更改的任何管理任务。如果对 Kubernetes control plane 添加额外负载（例如创建/修改/删除资源），利用率会出现临时峰值。如果使用大量使用 Kubernetes 数据存储的 Operator 或应用程序（例如 Rancher 或其他 Operator 类型的应用程序），server 的资源需求将增加。如果通过添加额外的节点或创建大量集群资源来扩展集群，server 的资源需求将增加。

K3s Agent 利用率数据主要取决于容器生命周期管理控制循环的支持。如果存在涉及管理镜像、配置存储或创建/销毁容器的操作，利用率会出现临时峰值。尤其是镜像拉取（通常与 CPU 和 IO 高度绑定），因为涉及将镜像内容解压缩到磁盘。如果可能，你可以将工作负载存储（pod 临时存储和卷）与 Agent 组件（/var/lib/rancher/k3s/agent）隔离，从而确保没有资源冲突。

### 防止 Agent 和工作负载干扰集群数据存储

如果在 server 还托管了工作负载 pod 的环境中运行，你需要确保 agent 和工作负载 IOPS 不会干扰数据存储。

你可以将 server 组件 (/var/lib/rancher/k3s/server) 放置在与 agent 组件 (/var/lib/rancher/k3s/agent) 不同的存储介质，其中包括 containerd 镜像存储区。

工作负载存储（pod 临时存储和卷）也应该与数据存储区隔离。

如果未能满足数据存储吞吐量和延迟要求，control plane 的响应可能会延迟，control plane 也可能无法维持系统状态。
