---
title: "网络选项"
weight: 25
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

本文介绍了以下网络选项：

- [Flannel 选项](#flannel-选项)
- [自定义 CNI](#自定义-cni)
- [双栈安装](#双栈安装)
- [只安装 IPv6](#只安装-ipv6)
- [分布式混合或多云集群](#分布式混合或多云集群)

> **注意**：有关 CoreDNS、Traefik 和 Service LB 的信息，请参阅[网络](networking/networking.md)页面。

## Flannel 选项

Flannel 的默认后端是 VXLAN。要启用加密，请传递下面的 IPSec（Internet 协议安全）或 WireGuard 选项。

如果你想使用 WireGuard 作为 Flannel 后端，可能需要额外的内核模块。详情请参阅 [WireGuard 安装指南](https://www.wireguard.com/install/)。WireGuard 的安装步骤将确保为你的操作系统安装适当的内核模块。在尝试使用 WireGuard Flannel 后端选项之前，你需要在每个 Server 和 Agent 节点上安装 WireGuard。
v1.26 开始移除了 `wireguard` 后端，从而支持 Flannel 原生的 `wireguard-native` 后端。

我们建议用户尽快迁移到新的后端。节点有了新配置后，迁移不会花费很长的停机时间。你可以遵循以下两个步骤进行操作：

1 - 更新所有 control plane 节点中的 K3s 配置。配置文件 `/etc/rancher/k3s/config.yaml` 应该包含 `flannel-backend:wireguard-native` 而不是 `flannel-backend:wireguard`。

2 - 重新启动所有节点。

| CLI 标志和值 | 描述 |
-------------------|------------
| `--flannel-backend=vxlan` | （默认）使用 VXLAN 后端。 |
| `--flannel-backend=ipsec` | 使用加密网络流量的 IPSEC 后端。 |
| `--flannel-backend=host-gw` | 使用 host-gw 后端。 |
| `--flannel-backend=wireguard` | 使用加密网络流量的 WireGuard 后端。可能需要额外的内核模块和配置。（已弃用，将从 v1.26 中删除） |
| `--flannel-backend=wireguard-native` | 使用加密网络流量的 WireGuard 后端。可能需要额外的内核模块和配置。 |
| `--flannel-ipv6-masq` | 将伪装规则应用于 IPv6 流量（默认为 IPv4）。仅适用于双栈或仅使用 IPv6 的集群。 |

## 自定义 CNI

使用 `--flannel-backend=none` 运行 K3s 并安装你选择的 CNI。大多数 CNI 插件都有自己的网络策略引擎，因此建议同时设置 `--disable-network-policy` 以避免冲突。应该为 Canal 和 Calico 启用 IP 转发。请参考以下步骤。

<Tabs>
<TabItem value="Canal" default>

访问 [Project Calico 文档](https://docs.projectcalico.org/)网站。按照步骤安装 Canal。修改 Canal YAML 以便在 container_settings 中允许 IP 转发，例如：

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

遵循 [Calico CNI 插件指南](https://docs.projectcalico.org/master/docs/reference/cni-plugin/configuration)。修改 Calico YAML 以便在 container_settings 中允许 IP 转发，例如：

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

首次创建集群时必须配置双栈组网。它不能在现有的单栈集群上启用。

k3s v1.21 或更高版本支持双栈。

要在 K3s 中启用双栈，你必须在所有 server 节点上提供有效的双栈 `cluster-cidr` 和 `service-cidr`。server 和 agent 都必须提供有效的双栈 `node-ip` 设置。双栈集群不支持节点地址自动检测，因为 kubelet 只获取它找到的第一个 IP 地址。此外，目前仅支持 vxlan 后端。以下是一个有效配置的示例：

```bash
k3s server --node-ip 10.0.10.7,2a05:d012:c6f:4611:5c2:5602:eed2:898c --cluster-cidr 10.42.0.0/16,2001:cafe:42:0::/56 --service-cidr 10.43.0.0/16,2001:cafe:42:1::/112
```

请注意，你可以选择任何 `cluster-cidr` 和 `service-cidr` 值，但是 `node-ip` 值必须与你主接口的 IP 地址相对应。如果你在公共云中部署，请记住允许 ipv6 流量。

如果你使用的是自定义 CNI 插件，即与 Flannel 不同的 CNI 插件，前面的配置可能不足以在 CNI 插件中启用双栈。请在其文档中查看如何启用双栈，并验证是否可以启用网络策略。

> **警告**：Kubernetes 1.24 和 1.25 中存在一个错误。如果你有一个双栈环境而且你没有为集群流量使用默认网卡 (NIC)，则会忽略节点 IPv6 地址。为避免此错误，请将以下标志添加到 K3s Server 和 Agent ：

```bash
--kubelet-arg "--node-ip=0.0.0.0" # If you want to prioritize IPv6 traffic, use "--node-ip=::" instead of "--node-ip=0.0.0.0".
```

## 只安装 IPv6

K3s v1.22 及更高版本支持只安装 IPv6 的设置。

> **警告**：如果你的 IPv6 默认路由是由路由器公告（RA）设置的，你需要设置 `net.ipv6.conf.all.accept_ra = 2`。否则，一旦默认路由过期，节点将放弃该路由。请注意，接受 RA 可能会增加[中间人攻击](https://github.com/kubernetes/kubernetes/issues/91507)的风险。

## 分布式混合或多云集群

K3s 集群仍然可以部署在使用不同私有网络且不直接连接的节点上（例如不同公共云中的节点）。为了实现这一点，K3s 设置了一个作为 VPN 网格的隧道网格。这些节点必须具有分配的 IP，通过该 IP 可以访问这些节点（例如公共 IP）。Server 流量将使用 WebSocket 隧道，数据平面流量将使用 Wireguard 隧道。

要启用这种类型的部署，你必须在 Server 中添加以下参数：
```bash
--node-external-ip <SERVER_EXTERNAL_IP> --flannel-backend wireguard-native --flannel-external-ip
```
在 Agent/Worker 中：
```bash
--node-external-ip <AGENT_EXTERNAL_IP>
```

其中 `SERVER_EXTERNAL_IP` 是访问 Server 节点的 IP，`AGENT_EXTERNAL_IP` 是访问 Agent/Worker 节点的 IP。请注意，Agent/Worker 中的 `K3S_URL` 配置参数需要使用 `SERVER_EXTERNAL_IP` 才能连接。记住在运行的 K3s 端口（例如 server 节点的 tcp/6443）上允许外部 ips 上的入口流量。

`SERVER_EXTERNAL_IP` 和 `AGENT_EXTERNAL_IP` 之间需要保持连接，并且通常使用公共 IP。

> **警告**：如果连接需要更多的跃点，那么节点之间的延迟会变高。延迟太高会降低网络性能，还可能影响集群的运行。
