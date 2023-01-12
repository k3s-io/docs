---
title: "网络选项"
weight: 25
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

本文介绍了 K3s 网络配置选项，包括配置或替换 Flannel，以及配置 IPv6。

> **注意**：有关 CoreDNS、Traefik 和 Service LB 的信息，请参阅[网络](../networking/networking.md)页面。

## Flannel 选项

[Flannel](https://github.com/flannel-io/flannel/blob/master/README.md) 是第 3 层网络结构的轻量级提供程序，它实现了 Kubernetes 容器网络接口 (CNI)。它就是通常所说的 CNI 插件。

* Flannel 只能在 Server 节点上设置选项，并且集群中的所有 Server 上都必须相同。
* Flannel 的默认后端是 `vxlan`。要启用加密，请使用 `wireguard-native` 后端。
* 在 Rasperry Pi 上使用 `vxlan` 和最新版本的 Ubuntu 需要[额外的准备工作](../advanced/advanced.md#raspberry-pi)。
* 在某些 Linux 发行版上使用 `wireguard-native` 作为 Flannel 后端可能需要额外的模块。有关详细信息，请参阅 [WireGuard 安装指南](https://www.wireguard.com/install/)。
   WireGuard 的安装步骤将确保为你的操作系统安装适当的内核模块。
   在尝试使用 WireGuard Flannel 后端之前，你必须确保 WireGuard 内核模块在每个节点（包括 Server 和 Agent）上都可用。


   | CLI 标志和值 | 描述 |
   -------------------|------------
   | `--flannel-ipv6-masq` | 将伪装规则应用于 IPv6 流量（默认为 IPv4）。仅适用于双栈或仅使用 IPv6 的集群。与 `none` 以外的任何 Flannel 后端兼容。 |
   | `--flannel-external-ip` | 使用节点外部 IP 地址作为 Flannel 流量的目的地，而不是使用内部 IP。仅当节点上设置了 `--node-external-ip` 时适用。 |
   | `--flannel-backend=vxlan` | 使用 VXLAN 封装数据包。在 Raspberry Pi 上可能需要额外的内核模块。 |
   | `--flannel-backend=host-gw` | 通过节点 IP 使用 IP 路由到 pod 子网。集群中所有节点之间都需要直接的第 2 层连接。 |
   | `--flannel-backend=wireguard-native` | 使用 WireGuard 封装和加密网络流量。可能需要额外的内核模块。 |
   | `--flannel-backend=ipsec` | 通过 `swanctl` 二进制文件使用 strongSwan IPSec 来加密网络流量。（已弃用；将在 v1.27.0 中删除） |
   | `--flannel-backend=wireguard` | 通过 `wg` 二进制文件使用 WireGuard 来加密网络流量。可能需要额外的内核模块和配置。（已弃用；将在 v1.26.0 中删除） |
   | `--flannel-backend=none` | 完全禁用 Flannel。 |

:::info 版本

从 2022-12 版本（v1.26.0+k3s1, v1.25.5+k3s1, v1.24.9+k3s1, v1.23.15+k3s1）开始，K3s 不再包含 strongSwan `swanctl` 和 `charon` 二进制文件。如果你想使用 `ipsec` 后端，请在升级或安装这些版本之前在节点上安装正确的包。

:::

### 从 `wireguard` 或 `ipsec` 迁移到 `wireguard-native`

旧版 `wireguard` 后端需要在主机上安装 `wg` 工具。该后端将在 K3s v1.26 中删除，取而代之的是直接与内核交互的 `wireguard-native` 后端。

旧版 `ipsec` 后端需要在主机上安装 `swanctl` 和 `charon` 二进制文件。该后端将在 K3s v1.27 中删除，以支持 `wireguard-native` 后端。

我们建议用户尽快迁移到新的后端。节点有了新配置后，迁移不会花费很长的停机时间。你可以遵循以下两个步骤进行操作：

1. 更新所有 Server 节点上的 K3s 配置。如果使用配置文件，`/etc/rancher/k3s/config.yaml` 应该包括 `flannel-backend: wireguard-native` 而不是 `flannel-backend: wireguard` 或 `flannel-backend: ipsec`。如果你在 systemd 单元中通过 CLI 标志配置 K3s，则应更改对应的标志。
2. 从 Server 节点开始重新启动所有节点。

## 自定义 CNI

使用 `--flannel-backend=none` 启动 K3s 并安装你选择的 CNI。大多数 CNI 插件都有自己的网络策略引擎，因此建议同时设置 `--disable-network-policy` 以避免冲突。你需要为 Canal 和 Calico 启用 IP 转发，请参考以下步骤。

<Tabs>
<TabItem value="Canal" default>

访问 [Project Calico 文档](https://docs.projectcalico.org/)网站。按照步骤安装 Canal。修改 Canal YAML 以便在 `container_settings` 中允许 IP 转发，例如：

```yaml
"container_settings": {
  "allow_ip_forwarding": true
}
```

应用 Canal YAML。

通过在主机上运行以下命令，确保设置已被应用：

```bash
cat /etc/cni/net.d/10-canal.conflist
```

你应该看到 IP 转发被设置为 true。

</TabItem>
<TabItem value="Calico" default>

遵循 [Calico CNI 插件指南](https://projectcalico.docs.tigera.io/reference/cni-plugin/configuration)。修改 Calico YAML 以便在 `container_settings` 中允许 IP 转发，例如：

```yaml
"container_settings": {
  "allow_ip_forwarding": true
}
```

应用 Calico YAML。

通过在主机上运行以下命令，确保设置已被应用：

```bash
cat /etc/cni/net.d/10-calico.conflist
```

你应该看到 IP 转发被设置为 true。


</TabItem>
</Tabs>

## 双栈安装

:::info 版本

K3s v1.21 及更高版本支持双栈网络。

:::

首次创建集群时必须配置双栈组网。一旦作为仅使用 IPv4 启动，就无法在现有集群上启用它。

要在 K3s 中启用双栈，你必须在所有 server 节点上提供有效的双栈 `cluster-cidr` 和 `service-cidr`。以下是一个有效配置的示例：

```
--cluster-cidr=10.42.0.0/16,2001:cafe:42:0::/56 --service-cidr=10.43.0.0/16,2001:cafe:42:1::/112
```

请注意，你可以配置任何有效的 `cluster-cidr` 和 `service-cidr` 值，但建议使用上述掩码。如果更改 `cluster-cidr` 掩码，则还应更改 `node-cidr-mask-size-ipv4` 和 `node-cidr-mask-size-ipv6` 值以匹配每个节点的计划 pod 和节点总数。对于 IPv4，支持的最大 `service-cidr` 掩码是 /12，而 IPv6 的是 /112。如果你在公共云中部署，请记住允许 ipv6 流量。

如果你使用的是自定义 CNI 插件，即 Flannel 以外的 CNI 插件，则可能需要额外的配置。请参阅你使用的插件的双栈文档，并验证是否可以启用网络策略。

> **警告**：Kubernetes 1.24 和 1.25 中存在一个错误。如果你有一个双栈环境而且你没有为集群流量使用主要网卡，则会忽略节点 IPv6 地址。为避免此错误，请将以下标志添加到 K3s Server 和 Agent ：

```
--kubelet-arg=node-ip=0.0.0.0"  # If you want to prioritize IPv6 traffic, use "::" instead of "0.0.0.0".
```

## 单栈 IPv6 安装

:::info 版本

K3s v1.22 及更高版本支持单栈 IPv6 集群（没有 IPv4 的集群）。

:::

> **警告**：如果你的 IPv6 默认路由是由路由器公告（RA）设置的，你需要设置 sysctl `net.ipv6.conf.all.accept_ra=2`。否则，一旦默认路由过期，节点将放弃该路由。请注意，接受 RA 可能会增加[中间人攻击](https://github.com/kubernetes/kubernetes/issues/91507)的风险。

## 分布式混合或多云集群

K3s 集群仍然可以部署在使用不同私有网络且不直接连接的节点上（例如不同公共云中的节点）。为了实现这一点，K3s 设置了一个作为 VPN 网格的隧道网格。这些节点必须具有分配的 IP，通过该 IP 可以访问这些节点（例如公共 IP）。Server 流量将使用 WebSocket 隧道，数据平面流量将使用 Wireguard 隧道。

要启用这种类型的部署，你必须在 Server 中添加以下参数：
```bash
--node-external-ip=<SERVER_EXTERNAL_IP> --flannel-backend=wireguard-native --flannel-external-ip
```
在 Agent 上：
```bash
--node-external-ip=<AGENT_EXTERNAL_IP>
```

其中 `SERVER_EXTERNAL_IP` 是访问 Server 节点的 IP，`AGENT_EXTERNAL_IP` 是访问 Agent/Worker 节点的 IP。请注意，Agent/Worker 中的 `K3S_URL` 配置参数需要使用 `SERVER_EXTERNAL_IP` 才能连接。请记住检查[网络要求](../installation/requirements.md#网络)，并允许访问内部和外部地址上列出的端口。

`SERVER_EXTERNAL_IP` 和 `AGENT_EXTERNAL_IP` 之间需要保持连接，并且通常使用公共 IP。

> **警告**：如果外部连接需要更多的跃点，那么节点之间的延迟会变高。延迟太高会降低网络性能，还可能影响集群的运行。

> **警告**：嵌入式 etcd 不会使用外部 IP 进行通信。如果使用嵌入式 etcd，所有 Server 节点必须可以通过其私有 IP 相互访问。
