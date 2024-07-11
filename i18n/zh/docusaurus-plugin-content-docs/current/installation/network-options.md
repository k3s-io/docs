---
title: "Network Options"
---

This page describes K3s network configuration options, including configuration or replacement of Flannel, and configuring IPv6.

> **Note:** Please reference the [Networking](../networking.md) page for information about CoreDNS, Traefik, and the Service LB.

## Flannel Options

[Flannel](https://github.com/flannel-io/flannel/blob/master/README.md) is a lightweight provider of layer 3 network fabric that implements the Kubernetes Container Network Interface (CNI). It is what is commonly referred to as a CNI Plugin.

* Flannel options can only be set on server nodes, and must be identical on all servers in the cluster.
* The default backend for Flannel is `vxlan`. To enable encryption, use the `wireguard-native` backend.
* Using `vxlan` on Rasperry Pi with recent versions of Ubuntu requires [additional preparation](./requirements.md?os=pi#operating-systems).
* Using `wireguard-native` as the Flannel backend may require additional modules on some Linux distributions. Please see the [WireGuard Install Guide](https://www.wireguard.com/install/) for details.
  The WireGuard install steps will ensure the appropriate kernel modules are installed for your operating system.
  You must ensure that WireGuard kernel modules are available on every node, both servers and agents, before attempting to use the WireGuard Flannel backend.


| CLI Flag and Value | Description |
|--------------------|-------------|
| `--flannel-ipv6-masq` | Apply masquerading rules to IPv6 traffic (default for IPv4). Only applies on dual-stack or IPv6-only clusters. Compatible with any Flannel backend other than `none`. |
| `--flannel-external-ip` | Use node external IP addresses as the destination for Flannel traffic, instead of internal IPs. Only applies when --node-external-ip is set on a node. |
| `--flannel-backend=vxlan` | Use VXLAN to encapsulate the packets. May require additional kernel modules on Raspberry Pi. |
| `--flannel-backend=host-gw` | Use IP routes to pod subnets via node IPs. Requires direct layer 2 connectivity between all nodes in the cluster. |
| `--flannel-backend=wireguard-native` | Use WireGuard to encapsulate and encrypt network traffic. May require additional kernel modules. |
| `--flannel-backend=ipsec` | Use strongSwan IPSec via the `swanctl` binary to encrypt network traffic. (Deprecated; will be removed in v1.27.0) |
| `--flannel-backend=none` | Disable Flannel entirely. |

:::info Version Gate

K3s no longer includes strongSwan `swanctl` and `charon` binaries starting with the 2022-12 releases (v1.26.0+k3s1, v1.25.5+k3s1, v1.24.9+k3s1, v1.23.15+k3s1). Please install the correct packages on your node before upgrading to or installing these releases if you want to use the `ipsec` backend.

:::

### Migrating from `wireguard` or `ipsec` to `wireguard-native`

The legacy `wireguard` backend requires installation of the `wg` tool on the host. This backend is not available in K3s v1.26 and higher, in favor of `wireguard-native` backend, which directly interfaces with the kernel.

The legacy `ipsec` backend requires installation of the `swanctl` and `charon` binaries on the host. This backend is not available in K3s v1.27 and higher, in favor of the `wireguard-native` backend.

We recommend that users migrate to the new backend as soon as possible. The migration requires a short period of downtime while nodes come up with the new configuration. You should follow these two steps:

1. Update the K3s config on all server nodes. If using config files, the `/etc/rancher/k3s/config.yaml` should include `flannel-backend: wireguard-native` instead of `flannel-backend: wireguard` or `flannel-backend: ipsec`. If you are configuring K3s via CLI flags in the systemd unit, the equivalent flags should be changed.
2. Reboot all nodes, starting with the servers.

## Custom CNI

Start K3s with `--flannel-backend=none` and install your CNI of choice. Most CNI plugins come with their own network policy engine, so it is recommended to set `--disable-network-policy` as well to avoid conflicts. Some important information to take into consideration:

<Tabs>
<TabItem value="Canal" default>

Visit the [Canal Docs](https://docs.tigera.io/calico/latest/getting-started/kubernetes/flannel/install-for-flannel#installing-calico-for-policy-and-flannel-aka-canal-for-networking) website. Follow the steps to install Canal. Modify the Canal YAML so that IP forwarding is allowed in the `container_settings` section, for example:

```yaml
"container_settings": {
  "allow_ip_forwarding": true
}
```

Apply the Canal YAML.

Ensure the settings were applied by running the following command on the host:

```bash
cat /etc/cni/net.d/10-canal.conflist
```

You should see that IP forwarding is set to true.

</TabItem>
<TabItem value="Calico" default>

Follow the [Calico CNI Plugins Guide](https://docs.tigera.io/calico/latest/reference/configure-cni-plugins). Modify the Calico YAML so that IP forwarding is allowed in the `container_settings` section, for example:

```yaml
"container_settings": {
  "allow_ip_forwarding": true
}
```

Apply the Calico YAML.

Ensure the settings were applied by running the following command on the host:

```bash
cat /etc/cni/net.d/10-calico.conflist
```

You should see that IP forwarding is set to true.


</TabItem>
<TabItem value="Cilium" default>

Before running `k3s-killall.sh` or `k3s-uninstall.sh`, you must manually remove `cilium_host`, `cilium_net` and `cilium_vxlan` interfaces. If you fail to do this, you may lose network connectivity to the host when K3s is stopped

```bash
ip link delete cilium_host
ip link delete cilium_net
ip link delete cilium_vxlan
```

Additionally, iptables rules for cilium should be removed:

```bash
iptables-save | grep -iv cilium | iptables-restore
ip6tables-save | grep -iv cilium | ip6tables-restore
```

</TabItem>
</Tabs>

## Control-Plane Egress Selector configuration

K3s agents and servers maintain websocket tunnels between nodes that are used to encapsulate bidirectional communication between the control-plane (apiserver) and agent (kubelet and containerd) components.
This allows agents to operate without exposing the kubelet and container runtime streaming ports to incoming connections, and for the control-plane to connect to cluster services when operating with the agent disabled.
This functionality is equivalent to the [Konnectivity](https://kubernetes.io/docs/tasks/extend-kubernetes/setup-konnectivity/) service commonly used on other Kubernetes distributions, and is managed via the apiserver's egress selector configuration.

The default mode is `agent`. `pod` or `cluster` modes are recommended when running [agentless servers](../advanced.md#运行无-agent-的-server实验性), in order to provide the apiserver with access to cluster service endpoints in the absence of flannel and kube-proxy.

The egress selector mode may be configured on servers via the `--egress-selector-mode` flag, and offers four modes:
* `disabled`: The apiserver does not use agent tunnels to communicate with kubelets or cluster endpoints.
  This mode requires that servers run the kubelet, CNI, and kube-proxy, and have direct connectivity to agents, or the apiserver will not be able to access service endpoints or perform `kubectl exec` and `kubectl logs`.
* `agent` (default): The apiserver uses agent tunnels to communicate with kubelets.
  This mode requires that the servers also run the kubelet, CNI, and kube-proxy, or the apiserver will not be able to access service endpoints.
* `pod`: The apiserver uses agent tunnels to communicate with kubelets and service endpoints, routing endpoint connections to the correct agent by watching Nodes and Endpoints.  
  **NOTE**: This mode will not work when using a CNI that uses its own IPAM and does not respect the node's PodCIDR allocation. `cluster` or `agent` mode should be used with these CNIs instead.
* `cluster`: The apiserver uses agent tunnels to communicate with kubelets and service endpoints, routing endpoint connections to the correct agent by watching Pods and Endpoints. This mode has the highest portability across different cluster configurations, at the cost of increased overhead.

## Dual-stack (IPv4 + IPv6) Networking

:::info Version Gate

Experimental support is available as of [v1.21.0+k3s1](https://github.com/k3s-io/k3s/releases/tag/v1.21.0%2Bk3s1).  
Stable support is available as of [v1.23.7+k3s1](https://github.com/k3s-io/k3s/releases/tag/v1.23.7%2Bk3s1). 

:::

:::warning Known Issue 

Before 1.27, Kubernetes [Issue #111695](https://github.com/kubernetes/kubernetes/issues/111695) causes the Kubelet to ignore the node IPv6 addresses if you have a dual-stack environment and you are not using the primary network interface for cluster traffic. To avoid this bug, use 1.27 or newer or add the following flag to both K3s servers and agents:

```
--kubelet-arg="node-ip=0.0.0.0" # To proritize IPv4 traffic
#OR
--kubelet-arg="node-ip=::" # To proritize IPv6 traffic
```

:::

Dual-stack networking must be configured when the cluster is first created. It cannot be enabled on an existing cluster once it has been started as IPv4-only.

To enable dual-stack in K3s, you must provide valid dual-stack `cluster-cidr` and `service-cidr` on all server nodes. This is an example of a valid configuration:

```
--cluster-cidr=10.42.0.0/16,2001:cafe:42::/56 --service-cidr=10.43.0.0/16,2001:cafe:43::/112
```

Note that you may configure any valid `cluster-cidr` and `service-cidr` values, but the above masks are recommended. If you change the `cluster-cidr` mask, you should also change the `node-cidr-mask-size-ipv4` and `node-cidr-mask-size-ipv6` values to match the planned pods per node and total node count. The largest supported `service-cidr` mask is /12 for IPv4, and /112 for IPv6. Remember to allow ipv6 traffic if you are deploying in a public cloud.

If you are using a custom CNI plugin, i.e. a CNI plugin other than Flannel, the additional configuration may be required. Please consult your plugin's dual-stack documentation and verify if network policies can be enabled.

:::warning Known Issue
When defining cluster-cidr and service-cidr with IPv6 as the primary family, the node-ip of all cluster members should be explicitly set, placing node's desired IPv6 address as the first address. By default, the kubelet always uses IPv4 as the primary address family.
:::

## Single-stack IPv6 Networking

:::info Version Gate
Available as of [v1.22.9+k3s1](https://github.com/k3s-io/k3s/releases/tag/v1.22.9%2Bk3s1)
:::

:::warning Known Issue
If your IPv6 default route is set by a router advertisement (RA), you will need to set the sysctl `net.ipv6.conf.all.accept_ra=2`; otherwise, the node will drop the default route once it expires. Be aware that accepting RAs could increase the risk of [man-in-the-middle attacks](https://github.com/kubernetes/kubernetes/issues/91507).
:::

Single-stack IPv6 clusters (clusters without IPv4) are supported on K3s using the `--cluster-cidr` and `--service-cidr` flags. This is an example of a valid configuration:

```bash
--cluster-cidr=2001:cafe:42::/56 --service-cidr=2001:cafe:43::/112
```

## Distributed hybrid or multicloud cluster

A K3s cluster can still be deployed on nodes which do not share a common private network and are not directly connected (e.g. nodes in different public clouds). There are two options to achieve this: the embedded k3s multicloud solution and the integration with the `tailscale` VPN provider.

:::warning
The latency between nodes will increase as external connectivity requires more hops. This will reduce the network performance and could also impact the health of the cluster if latency is too high.
:::

:::warning
Embedded etcd is not supported in this type of deployment. If using embedded etcd, all server nodes must be reachable to each other via their private IPs. Agents may be distributed over multiple networks, but all servers should be in the same location.
:::

### Embedded k3s multicloud solution

K3s uses wireguard to establish a VPN mesh for cluster traffic. Nodes must each have a unique IP through which they can be reached (usually a public IP). K3s supervisor traffic will use a websocket tunnel, and cluster (CNI) traffic will use a wireguard tunnel.

To enable this type of deployment, you must add the following parameters on servers:
```bash
--node-external-ip=<SERVER_EXTERNAL_IP> --flannel-backend=wireguard-native --flannel-external-ip
```
and on agents:
```bash
--node-external-ip=<AGENT_EXTERNAL_IP>
```

where `SERVER_EXTERNAL_IP` is the IP through which we can reach the server node and `AGENT_EXTERNAL_IP` is the IP through which we can reach the agent node. Note that the `K3S_URL` config parameter in the agent should use the `SERVER_EXTERNAL_IP` to be able to connect to it. Remember to check the [Networking Requirements](../installation/requirements.md#networking) and allow access to the listed ports on both internal and external addresses.

Both `SERVER_EXTERNAL_IP` and `AGENT_EXTERNAL_IP` must have connectivity between them and are normally public IPs.

:::info Dynamic IPs
If nodes are assigned dynamic IPs and the IP changes (e.g. in AWS), you must modify the `--node-external-ip` parameter to reflect the new IP. If running K3s as a service, you must modify `/etc/systemd/system/k3s.service` then run:

```bash
systemctl daemon-reload
systemctl restart k3s
```
:::

### Integration with the Tailscale VPN provider (experimental)

Available in v1.27.3, v1.26.6, v1.25.11 and newer.

K3s can integrate with [Tailscale](https://tailscale.com/) so that nodes use the Tailscale VPN service to build a mesh between nodes.

There are four steps to be done with Tailscale before deploying K3s:

1. Log in to your Tailscale account

2. In `Settings > Keys`, generate an auth key ($AUTH-KEY), which may be reusable for all nodes in your cluster

3. Decide on the podCIDR the cluster will use (by default `10.42.0.0/16`). Append the CIDR (or CIDRs for dual-stack) in Access controls with the stanza:
```yaml
"autoApprovers": {
        "routes": {
            "10.42.0.0/16":        ["your_account@xyz.com"],
            "2001:cafe:42::/56": ["your_account@xyz.com"],
        },
    },
```

4. Install Tailscale in your nodes:
```bash
curl -fsSL https://tailscale.com/install.sh | sh
```

To deploy K3s with Tailscale integration enabled, you must add the following parameter on each of your nodes:
```bash
--vpn-auth="name=tailscale,joinKey=$AUTH-KEY
```
or provide that information in a file and use the parameter:
```bash
--vpn-auth-file=$PATH_TO_FILE
```

Optionally, if you have your own Tailscale server (e.g. headscale), you can connect to it by appending `,controlServerURL=$URL` to the vpn-auth parameters

:::warning

If you plan on running several K3s clusters using the same tailscale network, please create appropriate [ACLs](https://tailscale.com/kb/1018/acls/) to avoid IP conflicts or use different podCIDR subnets for each cluster.

:::
