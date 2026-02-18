---
title: "分布式混合云或多云集群"
---

K3s 集群可以部署在没有共同私有网络、无法直连的节点上（例如，位于不同公有云中的节点）。实现这一部署有两种方案：使用嵌入式 K3s 多云解决方案，或者与 tailscale VPN 集成。

:::warning
因为外部连接需要更多的网络跳数（hop），节点之间的延迟会增加。如果延迟过高，还可能影响集群的健康状态。
:::

:::warning
该部署方案不支持嵌入式 etcd。嵌入式 etcd 方案要求所有 server 节点能通过各自的私有 IP 相互访问，即Agent 节点可以分布在多个网络，但所有 server 节点应位于同一位置。
:::

### 嵌入式 k3s 多云解决方案

K3s 通过 WireGuard 建立用于集群流量的 VPN 网格。每个节点必须拥有唯一的可访问 IP（通常为公网 IP）。K3s 管理流量将通过 WebSocket 隧道传输，而集群（CNI）流量则使用 WireGuard 隧道。

启用该部署模式，需要在 server 节点添加以下参数：
```bash
--node-external-ip=<SERVER_EXTERNAL_IP> --flannel-backend=wireguard-native --flannel-external-ip
```
在代理节点添加：
```bash
--node-external-ip=<AGENT_EXTERNAL_IP>
```

其中 `SERVER_EXTERNAL_IP` 是访问 server 节点的IP地址，`AGENT_EXTERNAL_IP` 是访问 agent 节点的IP地址。agent 节点的 `K3S_URL` 配置参数应该配置成 `SERVER_EXTERNAL_IP`。务必对照 [网络需求](../installation/requirements.md#networking) 并确保内外部地址均开放了所列端口。


`SERVER_EXTERNAL_IP` 和 `AGENT_EXTERNAL_IP` 必须相互连通，且通常为公网 IP。

:::info 动态 IP
若节点使用动态 IP 且地址发生变更（例如在 AWS 环境），您必须同步修改 `--node-external-ip` 参数为新的 IP。如果 K3s 以服务形式运行, 请修改 `/etc/systemd/system/k3s.service` 后执行:

```bash
systemctl daemon-reload
systemctl restart k3s
```
:::

### 与 Tailscale VPN 集成 (实验性功能)

适用于v1.27.3、v1.26.6、v1.25.11及更新版本

K3s 可以与 [Tailscale](https://tailscale.com/) 集成，节点通过 Tailscale VPN 服务在彼此之间构建网状网络。

部署 K3s 之前，需要在 Tailscale 中完成四个步骤：

1. 登录您的 Tailscale 账号

2. 在 `Settings > Keys` 中，生成认证密钥 ($AUTH-KEY), 该密钥可重复用于集群中的所有节点

3. 确认集群将要使用的 podCIDR  (默认值为 `10.42.0.0/16`). 在访问控制配置中添加该 CIDR (若使用双栈则需添加多个 CIDR) ，配置示例如下：
```yaml
"autoApprovers": {
        "routes": {
            "10.42.0.0/16":        ["your_account@xyz.com"],
            "2001:cafe:42::/56": ["your_account@xyz.com"],
        },
    },
```

4. 在节点上安装 Tailscale：
```bash
curl -fsSL https://tailscale.com/install.sh | sh
```

部署启用 Tailscale 功能的 K3s，您需要在每个节点上添加以下参数：
```bash
--vpn-auth="name=tailscale,joinKey=$AUTH-KEY
```
或者将这些信息保存在文件中，然后使用以下参数：
```bash
--vpn-auth-file=$PATH_TO_FILE
```

如果您使用自己的 Tailscale 服务器 (例如 headscale), 可以添加 `,controlServerURL=$URL` 到 vpn-auth 参数来连接到该服务器

:::warning

如果您计划在同一 Tailscale 网络中运行多个 K3s 集群，请配置适当的 [ACLs](https://tailscale.com/kb/1018/acls) 以避免IP冲突，或为每个集群使用不同的 podCIDR 子网。

:::
