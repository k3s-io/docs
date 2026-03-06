---
title: "基本网络选项"
---

本文介绍 K3s 的网络配置选项，包括 Flannel 的配置或替换（例如换成 Calico 等），以及 IPv6（单栈）或双栈的配置

## Flannel选项

[Flannel](https://github.com/flannel-io/flannel/blob/master/README.md) 是一个轻量级的三层网络解决方案。它实现了 Kubernetes 的容器网络接口（CNI），这类实现通常被称为 CNI 插件。

* Flannel 选项只能在 Server 节点设置，并且集群中所有 Server 节点的设置必须完全相同。
* Flannel 的默认后端模式（backend）是 vxlan。如需启用网络加密，可使用 wireguard-native 后端模式（基于 WireGuard 的加密隧道方案）
* 在运行较新版本 Ubuntu 的树莓派上使用 vxlan 后端模式，需要 [额外准备](../installation/requirements.md?os=pi#operating-systems)。
* 在某些 Linux 发行版上，使用 wireguard-native 作为 Flannel 后端模式，可能需要额外的模块。详情请参阅 [WireGuard 安装指南](https://www.wireguard.com/install/)。
  WireGuard 的安装步骤将确保为你的操作系统安装合适的内核模块。
  使用 WireGuard Flannel 后端模式之前，你必须确保每个节点（包括 Server 和 Agent）上都有可用的 WireGuard 内核模块。


| CLI 选项和值 | 描述 |
|--------------------|-------------|
| `--flannel-ipv6-masq` | IPv4 流量默认开启伪装规则（伪装规则：把 Pod 发出的数据包的源 IP 地址，改成宿主机的网络接口 IP 地址），IPv6 流量开启伪装规则，需要加上 --flannel-ipv6-masq 参数。--flannel-ipv6-masq 选项，仅适用于双栈或 IPv6-only 集群，并且只在 Flannel 启用（none未启用）时才生效，与任何 Flannel 后端模式兼容。 |
| `--flannel-external-ip` | 使用节点的外部 IP 地址（而非内部 IP）作为 Flannel 流量的目标地址。仅在节点上设置了 --node-external-ip 时适用。|
| `--flannel-backend=vxlan` | 使用 VXLAN 封装数据包（原始的 Pod 数据包再包上一层新的、带有节点 IP 的数据包）。在树莓派上可能需要额外的内核模块。 |
| `--flannel-backend=host-gw` | 对于要访问[pod subnets]（比如 10.42.2.0/24）的数据包，请通过[node IPs]（比如 192.168.1.11）这条路走，以上这些信息，都配置在节点的路由表[IP routes]。配置要求集群中所有节点必须在同一个广播域（二层连通性）。|
| `--flannel-backend=wireguard-native` | 使用 WireGuard 封装和加密网络流量。可能需要额外的内核模块。 |
| `--flannel-backend=ipsec` | 使用 swanctl 这个命令行工具来调用 strongSwan 的 IPSec 功能，从而对 Flannel 的网络流量进行加密。建议迁移到 wireguard-native。（已弃用；将在 v1.27.0 中移除） |
| `--flannel-backend=none` | 完全禁用 Flannel。当你想要安装其他 CNI 插件（如 Calico）时使用 |

:::info 版本提示

从 2022 年 12 月发布的版本（v1.26.0+k3s1、v1.25.5+k3s1、v1.24.9+k3s1、v1.23.15+k3s1）开始，K3s 不再包含 strongSwan 的 swanctl 和 charon 二进制文件。如果你想使用 ipsec 后端，请在升级到或安装这些版本之前，先在节点上安装相应的软件包。

:::

### 从 wireguard 或 ipsec 迁移至 wireguard-native

传统的 wireguard 后端模式需要在主机上安装 wg 工具。该后端模式在 K3s v1.26 及更高版本中已不可用，取而代之的是 wireguard-native，后者通过 Netlink 直接与内核中的 WireGuard 模块通信，不再经过 wg 这个用户空间的“二传手”。

传统的 ipsec 后端模式需要在主机上安装 swanctl（strongSwan 的命令行工具 ） 和 charon（strongSwan 的守护进程）。该后端模式在 K3s v1.27 及更高版本中已不可用，取而代之的是 wireguard-native。

我们建议用户尽快迁移至新的后端模式。在节点启动并应用新配置期间，迁移过程将需要一段短暂的停机时间。请按照以下两个步骤操作：

1. 修改所有 Server 节点的 K3s 配置。
   方式一（配置文件）：编辑 /etc/rancher/k3s/config.yaml，将 flannel-backend 的值从 wireguard 或 ipsec 改为 wireguard-native。
   方式二（命令行参数）：K3s 安装后会创建 systemd unit 文件（位于 /etc/systemd/system/k3s.service）。请修改该文件中的启动参数，将 --flannel-backend= 的值改为 wireguard-native。
   备注：K3s 安装后，会在 /etc/systemd/system/ 目录创建一个 k3s.service 文件（如果是 Server 节点）或 k3s-agent.service 文件（如果是 Agent 节点）。这个文件就是 K3s 的 systemd unit。
2. 从 server 节点开始重启所有节点，systemctl daemon-reload && systemctl restart k3s。
   对于使用 etcd 的集群：先重启超过半数的 Server 节点（通常为 N/2+1 个），待 etcd 集群恢复健康后，再重启剩余的 Server 节点和所有 Agent 节点。
   对于使用外部数据库的集群：逐一重启 Server 节点，待当前节点恢复且集群正常后，再重启下一个。所有 Server 节点恢复后，最后重启 Agent 节点。

## 自定义 CNI

K3s 默认集成 Flannel 作为 CNI 网络插件，并自带 Kube-router 网络策略引擎。当以默认参数（--flannel-backend=vxlan）启动时，安装脚本会自动检查并开启主机的 `net.ipv4.ip_forward` 内核参数，确保容器流量正常转发。

如需替换 CNI 插件，可以通过 --flannel-backend=none 参数启动 K3s，然后安装自己选择的 CNI 插件。由于大多数第三方 CNI 插件都自带独立的网络策略引擎，建议同时设置 --disable-network-policy 参数以避免策略冲突。

需要注意的区别是：与 K3s 默认的 Flannel 不同，当你切换为其他 CNI 插件时，通常需要手动在 CNI 的容器网络配置层面启用 IP 转发（allow_ip_forwarding）。以下是几种主流 CNI 插件的配置说明：

<Tabs>
<TabItem value="Canal" default>

访问 [Canal Docs](https://docs.tigera.io/calico/latest/getting-started/kubernetes/flannel/install-for-flannel#installing-calico-for-policy-and-flannel-aka-canal-for-networking) 网站，按照步骤安装 Canal。安装前，需修改 Canal 的 YAML 配置，在 container_settings 部分显式启用 IP 转发，示例如下:

```yaml
"container_settings": {
  "allow_ip_forwarding": true
}
```

应用配置后，可在主机上执行以下命令确认生效：

```bash
cat /etc/cni/net.d/10-canal.conflist
```

确保输出中 IP 转发已设置为 true。

</TabItem>
<TabItem value="Calico" default>

访问 [Calico CNI Plugins Guide](https://docs.tigera.io/calico/latest/reference/configure-cni-plugins)网站，按照步骤安装 Calico。安装前，需修改 Calico 的 YAML 配置，在 container_settings 部分显式启用 IP 转发，示例如下：

```yaml
"container_settings": {
  "allow_ip_forwarding": true
}
```

应用配置后，可在主机上执行以下命令确认生效：

```bash
cat /etc/cni/net.d/10-calico.conflist
```

确保输出中 IP 转发已设置为 true。


</TabItem>
<TabItem value="Cilium" default>

访问 [Cilium 官方文档](https://docs.cilium.io) ，按照步骤安装 Cilium。与上述插件不同，Cilium 基于 eBPF 技术，其 CNI 配置中不包含 `allow_ip_forwarding` 字段。Cilium 会在运行时通过 eBPF 程序直接处理网络转发，不再依赖传统的内核 IP 转发参数。

需要注意的是，Cilium 对系统的侵入性较强。在实际操作中，卸载环节是最容易出错且后果最严重的地方。因此，这里重点介绍如何安全地清理 Cilium 组件：

在运行 k3s-killall.sh 或 k3s-uninstall.sh 脚本之前，必须手动删除 Cilium 创建的网络接口cilium_host、cilium_net 和 cilium_vxlan。如果不执行此操作，当 K3s 停止时，残留的虚拟网卡可能导致主机网络连接中断。删除后可通过 `ip link show` 确认接口已消失。

```bash
ip link delete cilium_host
ip link delete cilium_net
ip link delete cilium_vxlan
```

此外，还应清除 Cilium 相关的 iptables 规则：

```bash
iptables-save | grep -iv cilium | iptables-restore
ip6tables-save | grep -iv cilium | ip6tables-restore
```

</TabItem>
</Tabs>

## 控制平面出口选择器配置

在传统 Kubernetes 架构中，apiserver 和 kubelet 通常可以直接通过网络连通。但在边缘计算等场景下，工作节点可能位于防火墙之后，导致 apiserver 无法直接访问节点上的 kubelet。为了解决这个问题，K3s 引入了反向隧道机制：Agent 主动向 Server 发起 WebSocket 连接并维持一条隧道，用于封装控制平面（apiserver）和 Agent 组件（kubelet 和容器运行时）之间的双向通信。
这一机制实现了两个关键能力：
1、提升安全性：允许 Agent 在不暴露 kubelet 及容器运行时流式端口的情况下正常工作，从而避免将服务端口暴露给入站连接；
2、支持无 Agent 模式：使得控制平面在禁用 Agent（即该节点不运行 kubelet、CNI、kube-proxy））运行时，依然能够连接到集群服务。
此功能等同于其他 Kubernetes 发行版中常用的 [Konnectivity](https://kubernetes.io/docs/tasks/extend-kubernetes/setup-konnectivity/) 服务，并通过 apiserver 的出口选择器配置进行管理。
默认模式为 agent。当运行[无 Agent 的 Server](../advanced.md#运行无-agent-的-server实验性)时，建议使用 pod 或 cluster 模式，以确保在没有 flannel 和 kube-proxy 的情况下，让 apiserver 能够访问集群服务。

可以通过 Server 的 `--egress-selector-mode` 标志配置出口选择器模式，共有以下四种模式，决定了 apiserver 如何与 kubelet 和 Service 通信：是通过隧道还是直接连接。
* `disabled`: 禁用隧道，所有通信均采用直接连接（适用于所有节点网络互通的传统集群，所有节点都在同一机房，或者有公网 IP）。
  此模式要求 Server 必须运行 kubelet、CNI 和 kube-proxy，且能够直接连通 Agent，否则 apiserver 将无法访问服务端点或执行 `kubectl exec` 和 `kubectl logs` 操作。
* `agent` (默认): apiserver 使用 Agent 隧道与 kubelet 通信，但访问服务端点（如 Service Cluster IP）仍走常规网络。
  此模式同样要求 Server 必须运行 kubelet、CNI 和 kube-proxy，否则 apiserver 将无法访问服务端点。
* `pod`: 所有流量走隧道。通过监听 Nodes 和 Endpoints 资源，将指向端点的连接路由到正确的 Agent（根据节点与 PodCIDR 的对应关系确定目标）。
  **注意**: 如果使用的 CNI 采用自有 IPAM 机制且不遵循节点的 PodCIDR 分配，此模式将无法正常工作。此时应改用 `cluster` 或 `agent` 模式。
* `cluster`: 所有流量走隧道。通过监听 Pods 和 Endpoints 资源，将指向端点的连接路由到正确的 Agent（根据 Pod 的实际运行位置确定目标）。此模式在不同集群配置中具有最高的可移植性，但代价是增加了额外开销。

## 双栈 (IPv4 + IPv6) 网络

:::info 版本提示

从 [v1.21.0+k3s1](https://github.com/k3s-io/k3s/releases/tag/v1.21.0%2Bk3s1) 版本开始提供实验性支持。
从 [v1.23.7+k3s1](https://github.com/k3s-io/k3s/releases/tag/v1.23.7%2Bk3s1) 版本开始提供稳定支持。

:::

:::warning 已知问题

在 1.27 版本之前，如果你使用的是双栈环境，并且没有使用主网络接口进行集群流量通信，Kubernetes [Issue #111695](https://github.com/kubernetes/kubernetes/issues/111695) 会导致 Kubelet 忽略节点的 IPv6 地址。为避免此问题，请使用 1.27 或更高版本或者在 K3s 的 Server 和 Agent 节点上添加以下参数：

```
--kubelet-arg="node-ip=0.0.0.0" # To proritize IPv4 traffic
# 或
--kubelet-arg="node-ip=::" # To proritize IPv6 traffic
```

:::

双栈网络必须在集群首次创建时进行配置。一旦集群以 IPv4-only 模式启动，就无法在现有集群上启用双栈功能。

要在 K3s 中启用双栈，必须在所有 Server 节点上提供有效的双栈 `cluster-cidr` 和 `service-cidr` 配置。以下是一个有效配置的示例：

```
--cluster-cidr=10.42.0.0/16,2001:cafe:42::/56 --service-cidr=10.43.0.0/16,2001:cafe:43::/112
```

请注意，你可以配置任何有效的 `cluster-cidr` 和 `service-cidr` 值，但推荐使用上述掩码。如果你更改了 `cluster-cidr` 的掩码，也应该相应地调整  `node-cidr-mask-size-ipv4` 和 `node-cidr-mask-size-ipv6` 的值，以匹配计划中的每个节点 Pod 数量和总节点数。`service-cidr` 支持的最大掩码 IPv4 为 /12，IPv6 为 /112。如果你在公有云中部署，请记得允许 IPv6 流量。

如果你使用的是自定义 CNI 插件（即非 Flannel 的 CNI 插件），则可能需要进行额外配置。请查阅你所用插件的双栈文档，并验证是否可以启用网络策略。

:::warning 已知问题
当使用 IPv6 作为主协议族来定义 cluster-cidr 和 service-cidr 时，应明确设置所有集群成员的 node-ip，并将节点期望的 IPv6 地址放在首位。默认情况下，kubelet 总是使用 IPv4 作为主地址族。
译者注：这意味着 kubelet 默认会优先上报节点的 IPv4 地址。在构建 IPv6 优先的双栈集群时，必须通过上述配置，手动指定 IPv6 地址作为节点的第一标识，以覆盖 kubelet 的默认行为。
:::

## 单栈 IPv6 网络

:::info版本提示
从 [v1.22.9+k3s1](https://github.com/k3s-io/k3s/releases/tag/v1.22.9%2Bk3s1) 版本开始提供此功能
:::

:::warning 已知问题
K3s 节点开启 IPv6 转发（net.ipv6.conf.all.forwarding=1）后，内核角色即被定义为“路由器”。根据 Linux 的默认逻辑，路由器应发送 RA 来宣告自己，而不应接收 RA 来听从其他路由器。然而，K3s 节点同时需要作为普通主机访问外部网络，必须通过接收 RA 来获取并维护默认路由。
因此，如果您的 IPv6 默认路由是由 RA 设置的，您需要设置 sysctl 参数`net.ipv6.conf.all.accept_ra=2`，强制内核在“路由器模式”下仍接收 RA，以同时满足“转发数据”和“自身上网”的双重需求。否则，节点会在路由过期后丢弃默认路由（设成 0 或 1 均无法解决此问题）。请注意，接受 RA 可能会增加[中间人攻击风险](https://github.com/kubernetes/kubernetes/issues/91507)。
:::

K3s 支持通过 `--cluster-cidr` 和 `--service-cidr` 参数（CIDR：Classless Inter-Domain Routing‌，无类别域间路由，不分 ABC 类）创建单栈 IPv6 集群（即不包含 IPv4 的集群）。以下是一个有效的配置示例：

```bash
--cluster-cidr=2001:cafe:42::/56 --service-cidr=2001:cafe:43::/112
```
## 无主机名的节点

部分云服务提供商（如 Linode）创建的机器默认主机名为 localhost，另有一些提供商则完全未设置主机名，这可能导致集群内域名解析出现问题。针对此问题，K3s 提供了以下两种指定节点名称的方式：
1、命令行参数：启动 K3s 时添加 --node-name 标志。
2、环境变量：在 systemd 服务或自动化脚本中配置 K3S_NODE_NAME 环境变量。




