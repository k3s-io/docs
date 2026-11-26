---
title: "系统要求"
---

K3s 非常轻量，但仍有以下最低要求。

无论你将 K3s 配置为在容器中运行，还是作为原生 Linux 服务运行，每个运行 K3s 的节点都应满足以下最低要求。这些要求是 K3s 及其打包组件的基线，不包含工作负载本身消耗的资源。

## 前提条件 {#prerequisites}

两个节点不能具有相同的主机名。

如果多个节点将具有相同的主机名，或者主机名可能会被自动化配置系统重复使用，请使用 `--with-node-id` 选项为每个节点附加随机后缀，或者在向集群添加每个节点时，通过 `--node-name` 或 `$K3S_NODE_NAME` 为其指定一个唯一名称。

## 架构 {#architecture}

K3s 适用于以下架构：
- x86_64
- armhf
- arm64/aarch64

## 操作系统 {#operating-systems}

K3s 可在大多数现代 Linux 系统上运行。

某些操作系统有额外的设置要求：
<Tabs queryString="os">
<TabItem value="suse" label="SUSE Linux Enterprise / openSUSE">

#### Firewalld {#firewalld}

建议关闭 firewalld：
```bash
systemctl disable firewalld --now
```

如果希望保持 firewalld 启用，默认情况下需要以下规则：
```bash
firewall-cmd --permanent --add-port=6443/tcp #apiserver
firewall-cmd --permanent --zone=trusted --add-source=10.42.0.0/16 #pods
firewall-cmd --permanent --zone=trusted --add-source=10.43.0.0/16 #services
firewall-cmd --reload
```

根据你的设置，可能还需要开放其他端口。更多信息请参阅 [K3s 节点的入站规则](#inbound-rules-for-k3s-nodes)。如果更改了 Pod 或 Service 的默认 CIDR，则需要相应更新防火墙规则。

</TabItem>
<TabItem value="rhel" label="Red Hat Enterprise Linux / CentOS / Fedora">

#### RHEL 10 {#rhel-10}
在 RHEL 10 上，需要额外安装一个软件包：
```bash
sudo dnf install -y kernel-modules-extra
```

#### Firewalld {#firewalld-1}

建议关闭 firewalld：
```bash
systemctl disable firewalld --now
```

如果希望保持 firewalld 启用，默认情况下需要以下规则：
```bash
firewall-cmd --permanent --add-port=6443/tcp #apiserver
firewall-cmd --permanent --zone=trusted --add-source=10.42.0.0/16 #pods
firewall-cmd --permanent --zone=trusted --add-source=10.43.0.0/16 #services
firewall-cmd --reload
```

根据你的设置，可能还需要开放其他端口。更多信息请参阅 [K3s 节点的入站规则](#inbound-rules-for-k3s-nodes)。如果更改了 Pod 或 Service 的默认 CIDR，则需要相应更新防火墙规则。

:::warning 较旧的 RHEL/CentOS 版本

RHEL 8.4 之前的操作系统版本中的 NetworkManager 存在一个已知 Bug，会干扰 K3s 网络。如果使用较旧版本，必须禁用 nm-cloud-setup 并重启节点：
```bash
systemctl disable nm-cloud-setup.service nm-cloud-setup.timer
reboot
```
:::

</TabItem>
<TabItem value="debian" label="Ubuntu / Debian">

较旧的 Debian 版本可能存在已知的 iptables Bug。请参阅[已知问题](../known-issues.md#iptables)。

#### UFW {#ufw}

建议关闭 ufw（uncomplicated firewall，简单防火墙）：
```bash
ufw disable
```

如果希望保持 ufw 启用，默认情况下需要以下规则：
```bash
ufw allow 6443/tcp #apiserver
ufw allow from 10.42.0.0/16 to any #pods
ufw allow from 10.43.0.0/16 to any #services
```

根据你的设置，可能还需要开放其他端口。更多信息请参阅 [K3s 节点的入站规则](#inbound-rules-for-k3s-nodes)。如果更改了 Pod 或 Service 的默认 CIDR，则需要相应更新防火墙规则。
</TabItem>
<TabItem value="pi" label="Raspberry Pi">

Raspberry Pi OS 基于 Debian，可能存在已知的 iptables Bug。请参阅[已知问题](../known-issues.md#iptables)。

#### Cgroups {#cgroups}

标准 Raspberry Pi OS 安装默认未启用 `cgroups`。**K3S** 需要 `cgroups` 才能启动 systemd 服务。可以通过将 `cgroup_memory=1 cgroup_enable=memory` 追加到 `/boot/firmware/cmdline.txt` 来启用 `cgroups`。\
**注意：** 在 Debian 11 及更早的 Pi OS 版本中，cmdline.txt 位于 `/boot/cmdline.txt`。

cmdline.txt 示例：
```
console=serial0,115200 console=tty1 root=PARTUUID=58b06195-02 rootfstype=ext4 elevator=deadline fsck.repair=yes rootwait cgroup_memory=1 cgroup_enable=memory
```

#### Ubuntu Vxlan 模块 {#ubuntu-vxlan-module}
在 Ubuntu 21.10 到 Ubuntu 23.10 中，Raspberry Pi 上的 vxlan 支持被移到了一个单独的内核模块中。Ubuntu 24.04 及更高版本不需要此步骤。
```bash
sudo apt install linux-modules-extra-raspi
```
</TabItem>
</Tabs>

有关哪些操作系统已通过 Rancher 管理的 K3s 集群测试的更多信息，请参阅 [Rancher 支持与维护条款](https://rancher.com/support-maintenance-terms/)。

## 硬件 {#hardware}

硬件要求取决于部署规模。最低要求如下：

| 节点   |  CPU    |  内存  |
|--------|---------|--------|
| Server | 2 核    | 2 GB   |
| Agent  | 1 核    | 512 MB |

[资源分析](../reference/resource-profiling.md)记录了测试和分析的结果，用于确定 K3s agent、带工作负载的 K3s server 以及带一个 agent 的 K3s server 的最低资源要求。

### 磁盘 {#disks}

K3s 性能取决于数据库性能。为确保最佳速度，我们建议尽可能使用 SSD。

如果要在 Raspberry Pi 或其他 ARM 设备上部署 K3s，建议使用外接 SSD。etcd 是写入密集型应用；SD 卡和 eMMC 无法承受这种 IO 负载。

### Server 规模指南 {#server-sizing-guide}

当 server（control-plane + etcd）节点的 CPU 和内存有限时，在标准工作负载条件下，可加入的 agent 节点数量是有限的。

| Server CPU | Server 内存 | Agent 数量 |
| ---------- | ----------- | ---------- |
| 2          | 4 GB        | 0-350      |
| 4          | 8 GB        | 351-900    |
| 8          | 16 GB       | 901-1800   |
| 16+        | 32 GB       | 1800+      |

:::tip 高可用规模建议
使用 3 个 server 节点的高可用配置时，agent 数量可以比上表大约多出 ~50%。\
例如：3 台 4 vCPU/8 GB 的 server 可以扩展到约 1200 个 agent。
:::

建议以每批不超过 50 个的方式加入 agent 节点，以便 CPU 有足够空间应对节点加入时的峰值。如果希望节点数量超过 255 个，请记得修改默认的 `cluster-cidr`！

[资源分析](../reference/resource-profiling.md#server-sizing-requirements-for-k3s)包含有关这些建议来源的更多信息。


## 网络 {#networking}

所有节点都必须能够访问 K3s server 的 6443 端口。

使用 Flannel VXLAN 后端时，节点需要能够通过 UDP 端口 8472 访问其他节点；使用 Flannel WireGuard 后端时，需要通过 UDP 端口 51820（如果使用 IPv6，还包括 51821）访问其他节点。节点不应监听任何其他端口。K3s 使用反向隧道，节点向 server 建立出站连接，所有 kubelet 流量都通过该隧道传输。但是，如果你不使用 Flannel 并提供自己的自定义 CNI，则 K3s 不需要 Flannel 所需的端口。

如果你想使用 metrics server，所有节点必须在 10250 端口上相互可访问。

如果你计划使用内嵌 etcd 实现高可用，server 节点必须在 2379 和 2380 端口上相互可访问。

根据所使用的操作系统，可能需要对防火墙进行其他更改。

:::tip 重要
节点上的 VXLAN 端口不应暴露给公网，因为这会开放你的集群网络，使任何人都能访问。请将节点置于禁止访问 8472 端口的防火墙/安全组之后运行。
:::

:::danger
Flannel 依赖 [Bridge CNI 插件](https://www.cni.dev/plugins/current/main/bridge/)创建用于交换流量的 L2 网络。具有 `NET_RAW` 能力的恶意 Pod 可以利用该 L2 网络发起 ARP 欺骗等攻击。因此，如 [Kubernetes 文档](https://kubernetes.io/docs/concepts/security/pod-security-standards/)所述，请设置受限的 Pod 安全配置，禁止不可信 Pod 使用 `NET_RAW`。
:::

### K3s 节点的入站规则 {#inbound-rules-for-k3s-nodes}

| 协议 | 端口      | 源         | 目标       | 描述
|------|-----------|------------|------------|----------
| TCP  | 2379-2380 | Servers    | Servers    | 仅在使用内嵌 etcd 的高可用配置时需要
| TCP  | 6443      | Agents     | Servers    | K3s supervisor 和 Kubernetes API Server
| UDP  | 8472      | 所有节点   | 所有节点   | 仅在 Flannel VXLAN 时需要
| TCP  | 10250     | 所有节点   | 所有节点   | Kubelet 指标和 API
| UDP  | 51820     | 所有节点   | 所有节点   | 仅在 Flannel WireGuard（IPv4）时需要
| UDP  | 51821     | 所有节点   | 所有节点   | 仅在 Flannel WireGuard（IPv6）时需要
| TCP  | 5001      | 所有节点   | 所有节点   | 仅在启用内嵌分布式镜像仓库（Spegel）时需要
| TCP  | 6443      | 所有节点   | 所有节点   | 仅在启用内嵌分布式镜像仓库（Spegel）时需要

### K3s 节点的出站规则 {#outbound-rules-for-k3s-nodes}

通常允许所有出站流量。

### 本地端口 {#local-ports}

Kubernetes 和容器运行时会监听回环接口，用于监控和组件之间的通信。请避免部署使用这些端口的其他工作负载，也不要将这些端口用作 Pod 或 Service 的 NodePort。

| 协议 | 端口      | 描述
|------|-----------|----------
| TCP  | 2381      | etcd 指标
| TCP  | 2382      | etcd 旧版 HTTP API
| TCP  | 6444      | kube-apiserver 本地访问
| TCP  | 10010     | containerd 和 cri-dockerd CRI 服务的 exec/日志流
| TCP  | 10248     | kubelet 健康检查
| TCP  | 10249     | kube-proxy 指标
| TCP  | 10250     | kubelet 指标和 API
| TCP  | 10256     | kube-proxy 健康检查
| TCP  | 10257     | kube-controller-manager 指标
| TCP  | 10258     | cloud-controller-manager 指标
| TCP  | 10259     | kube-scheduler 指标

## 大型集群 {#large-clusters}

硬件要求取决于 K3s 集群的规模。对于生产环境和大规模集群，我们建议使用带外部数据库的高可用配置。生产环境中，外部数据库推荐使用以下选项：

- MySQL
- PostgreSQL
- etcd

有关 control-plane 节点相对于 agent 数量的 CPU 和内存规模建议，请参阅上文的 [Server 规模指南](#server-sizing-guide)。

### 磁盘 {#disks-1}

集群性能取决于数据库性能。为确保最佳速度，我们建议始终使用 SSD 磁盘作为 K3s 集群的存储后端。在云服务商上，你还需要选择能够提供最大 IOPS 的最小磁盘规格。

### 网络 {#network}

你应该考虑增大集群 CIDR 的子网大小，以免 Pod 的 IP 耗尽。可以在启动时向 K3s server 传递 `--cluster-cidr` 选项来实现。

### 数据库 {#database}

K3s 支持多种数据库，包括 MySQL、PostgreSQL、MariaDB 和 etcd。更多信息请参阅[集群数据存储](../datastore/datastore.md)。

以下是运行大型集群时所需数据库资源的规模指南：

| 部署规模 |  节点数   | vCPU |  内存  |
|:--------:|:---------:|:----:|:------:|
|   小型   |  最多 10  |   1  |  2 GB  |
|   中型   |  最多 100 |   2  |  8 GB  |
|   大型   |  最多 250 |   4  | 16 GB  |
|  超大型  |  最多 500 |   8  | 32 GB  |
|  特大型  |   500+    |  16  | 64 GB  |
