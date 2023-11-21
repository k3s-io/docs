---
title: "网络选项"
weight: 25
---

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

使用 `--flannel-backend=none` 启动 K3s 并安装你选择的 CNI。大多数 CNI 插件都有自己的网络策略引擎，因此建议同时设置 `--disable-network-policy` 以避免冲突。需要考虑的重要信息：

<Tabs>
<TabItem value="Canal" default>

访问 [Canal Docs](https://docs.tigera.io/calico/latest/getting-started/kubernetes/flannel/install-for-flannel#installing-calico-for-policy-and-flannel-aka-canal-for-networking) 网站。按照步骤安装 Canal。修改 Canal YAML 以便在 `container_settings` 中允许 IP 转发，例如：

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

遵循 [Calico CNI 插件指南](https://docs.tigera.io/calico/latest/reference/configure-cni-plugins)。修改 Calico YAML 以便在 `container_settings` 中允许 IP 转发，例如：

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
<TabItem value="Cilium" default>

运行 `k3s-killall.sh` 或 `k3s-uninstall.sh`之前，你必须手动删除 `cilium_host`、`cilium_net` 和 `cilium_vxlan` 接口。如果不这样做，你可能会在 K3s 停止时丢失与主机的网络连接

```bash
ip link delete cilium_host
ip link delete cilium_net
ip link delete cilium_vxlan
```

此外，你需要删除 cilium 的 iptables 规则：

```bash
iptables-save | grep -iv cilium | iptables-restore
ip6tables-save | grep -iv cilium | ip6tables-restore
```

</TabItem>
</Tabs>

## Control Plane Egress 选择器配置

K3s Agent 和 Server 维护节点之间的 websocket 隧道，这些隧道用于封装 control plane（apiserver）和 Agent（kubelet 和 containerd）组件之间的双向通信。
这允许 Agent 在不将 kubelet 和容器运行时流端口暴露给传入连接的情况下运行，并允许 control plane 在禁用 Agent 的情况下连接到集群服务。
此功能等同于其他 Kubernetes 发行版上常用的 [Konnectivity](https://kubernetes.io/docs/tasks/extend-kubernetes/setup-konnectivity/) 服务，通过 apiserver 的 Egress 选择器配置进行管理。

你可以使用 `--egress-selector-mode` 标志在 Server 上配置 Egress 选择器模式，支持四种模式：
* `disabled`：apiserver 不使用 Agent 隧道与 kubelet 或集群端点通信。
   此模式要求 Server 运行 kubelet、CNI 和 kube-proxy，并与 Agent 直接连接，否则 apiserver 将无法访问 Service 端点或执行 `kubectl exec` 和 `kubectl logs`。
* `agent`（默认）：apiserver 使用 Agent 隧道与 kubelet 通信。
   这种模式要求 Server 也运行 kubelet、CNI 和 kube-proxy，否则 apiserver 将无法访问 Service 端点。
* `pod`：apiserver 使用 Agent 隧道与 kubelets 和 Service 端点通信，通过监视节点将端点连接路由到正确的 Agent。
   **注意**：如果 CNI 使用自己的 IPAM，而且不考虑节点的 PodCIDR 分配，这将不起作用。这些 CNI 需要使用 `cluster` 或 `agent`。
* `cluster`：apiserver 使用 Agent 隧道与 kubelets 和 Service 端点通信，通过监视端点将端点连接路由到正确的 Agent。

## 双栈 (IPv4 + IPv6) 网络

:::info 版本

从 [v1.21.0+k3s1](https://github.com/k3s-io/k3s/releases/tag/v1.21.0%2Bk3s1) 开始提供实验性支持。  
从 [v1.23.7+k3s1](https://github.com/k3s-io/k3s/releases/tag/v1.23.7%2Bk3s1) 开始提供稳定支持。

:::

:::warning 已知问题

Kubernetes [Issue #111695](https://github.com/kubernetes/kubernetes/issues/111695) 导致了一个问题。如果你有一个双栈环境而且你没有为集群流量使用主要网卡，那么 Kubelet 会忽略节点 IPv6 地址。为避免此错误，请将以下标志添加到 K3s Server 和 Agent ：

```
--kubelet-arg="node-ip=0.0.0.0" # To proritize IPv4 traffic
#OR
--kubelet-arg="node-ip=::" # To proritize IPv6 traffic
```

:::

首次创建集群时必须配置双栈组网。一旦仅使用 IPv4 启动，它就无法在现有集群上启用。

要在 K3s 中启用双栈，你必须在所有 server 节点上提供有效的双栈 `cluster-cidr` 和 `service-cidr`。以下是一个有效配置的示例：

```
--cluster-cidr=10.42.0.0/16,2001:cafe:42::/56 --service-cidr=10.43.0.0/16,2001:cafe:43::/112
```

请注意，你可以配置任何有效的 `cluster-cidr` 和 `service-cidr` 值，但建议使用上述掩码。如果更改 `cluster-cidr` 掩码，则还应更改 `node-cidr-mask-size-ipv4` 和 `node-cidr-mask-size-ipv6` 值以匹配每个节点的计划 pod 和节点总数。对于 IPv4，支持的最大 `service-cidr` 掩码是 /12，而 IPv6 的是 /112。如果你在公共云中部署，请记住允许 ipv6 流量。

如果你使用的是自定义 CNI 插件，即 Flannel 以外的 CNI 插件，则可能需要额外的配置。请参阅你使用的插件的双栈文档，并验证是否可以启用网络策略。

## 单栈 IPv6 网络

:::info 版本
从 [v1.22.9+k3s1](https://github.com/k3s-io/k3s/releases/tag/v1.22.9%2Bk3s1) 起可用
:::

:::warning 已知问题
如果你的 IPv6 默认路由是由路由器公告（RA）设置的，你需要设置 sysctl `net.ipv6.conf.all.accept_ra=2`。否则，一旦默认路由过期，节点将放弃该路由。请注意，接受 RA 可能会增加[中间人攻击](https://github.com/kubernetes/kubernetes/issues/91507)的风险。
:::

你可以使用 `--cluster-cidr` 和 `--service-cidr` 标志在 K3s 上使用单栈 IPv6 集群（没有 IPv4 的集群）。以下是一个有效配置的示例：

```bash
--cluster-cidr=2001:cafe:42::/56 --service-cidr=2001:cafe:43::/112
```

## 分布式混合或多云集群

K3s 集群仍然可以部署在不共享公共私有网络且不直接连接的节点上（例如不同公有云中的节点）。有两种选择可以实现这一点：嵌入式 k3s 多云解决方案和集成 `tailscale` VPN 提供程序。

:::warning 警告
如果外部连接需要更多的跃点，那么节点之间的延迟会变高。延迟太高会降低网络性能，还可能影响集群的运行。
:::

:::warning
此类部署不支持嵌入式 etcd。如果使用嵌入式 etcd，所有 Server 节点必须可以通过其私有 IP 相互访问。Agent 可能分布在多个网络上，但所有 server 都应该位于同一位置。
:::

### 嵌入式 k3s 多云解决方案

K3s 使用 wireguard 为集群流量建立 VPN 网格。每个节点都必须具有唯一的 IP，可以通过 IP 访问节点（通常是公共 IP）。K3s supervisor 流量将使用 websocket 隧道，集群 (CNI) 流量将使用 wireguard 隧道。

要启用这种类型的部署，你必须在 Server 中添加以下参数：
```bash
--node-external-ip=<SERVER_EXTERNAL_IP> --flannel-backend=wireguard-native --flannel-external-ip
```
在 Agent 上：
```bash
--node-external-ip=<AGENT_EXTERNAL_IP>
```

其中 `SERVER_EXTERNAL_IP` 是访问 Server 节点的 IP，`AGENT_EXTERNAL_IP` 是访问 Agent 节点的 IP。请注意，Agent 中的 `K3S_URL` 配置参数需要使用 `SERVER_EXTERNAL_IP` 才能连接。请记住检查[网络要求](../installation/requirements.md#网络)，并允许访问内部和外部地址上列出的端口。

`SERVER_EXTERNAL_IP` 和 `AGENT_EXTERNAL_IP` 之间需要保持连接，并且通常使用公共 IP。

:::info 动态 IP
如果为节点分配动态 IP 并且 IP 发生变化（例如在 AWS 中），则必须修改 `--node-external-ip` 参数来反映新 IP。如果将 K3s 作为 Service 运行，则必须修改 `/etc/systemd/system/k3s.service` 然后运行：

```bash
systemctl daemon-reload
systemctl restart k3s
```
:::

### 集成 Tailscale VPN 提供程序（实验性）

在 v1.27.3、v1.26.6、v1.25.11 和更新版本中可用。

K3s 可以与 [Tailscale](https://tailscale.com/) 集成，以便节点使用 Tailscale VPN 服务在节点之间构建网格。

在部署 K3s 之前，Tailscale 需要完成四个步骤：

1. 登录到你的 Tailscale 帐户

2. 在 `Settings > Keys` 中，生成一个授权密钥（$AUTH-KEY），它可以被集群中的所有节点重复使用

3. 决定集群将使用的 podCIDR（默认 `10.42.0.0/16`）。在 Access 控制中附加 CIDR（或双栈的 CIDR）：
```yaml
"autoApprovers": {
        "routes": {
            "10.42.0.0/16":        ["your_account@xyz.com"],
            "2001:cafe:42::/56": ["your_account@xyz.com"],
        },
    },
```

4. 在节点中安装 Tailscale：
```bash
curl -fsSL https://tailscale.com/install.sh | sh
```

要部署启用了 Tailscale 集成的 K3s，你必须在每个节点上添加以下参数：
```bash
--vpn-auth="name=tailscale,joinKey=$AUTH-KEY
```
或在文件中提供该信息并使用参数：
```bash
--vpn-auth-file=$PATH_TO_FILE
```

或者，如果你有自己的 Tailscale 服务器（例如 headscale），则可以通过将 `,controlServerURL=$URL` 附加到 vpn-auth 参数来连接它。

:::warning 警告

如果你计划使用同一个 tailscale 网络运行多个 K3s 集群，请创建适当的 [ACL](https://tailscale.com/kb/1018/acls/) 来避免 IP 冲突，或为每个集群使用不同的 podCIDR 子网。

:::
