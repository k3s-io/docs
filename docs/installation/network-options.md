---
title: "Network Options"
weight: 25
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

This page describes the following networking options:

- [Flannel options](#flannel-options)
- [Custom CNI](#custom-cni)
- [Dual-stack installation](#dual-stack-installation)
- [IPv6-only-installation](#ipv6-only-installation)
- [Distributed hybrid or multicloud cluster](#distributed-hybrid-or-multicloud-cluster)

> **Note:** Please reference the [Networking](networking/networking.md) page for information about CoreDNS, Traefik, and the Service LB.

## Flannel Options

The default backend for flannel is VXLAN. To enable encryption, pass the IPSec (Internet Protocol Security) or WireGuard options below.

If you wish to use WireGuard as your flannel backend it may require additional kernel modules. Please see the [WireGuard Install Guide](https://www.wireguard.com/install/) for details. The WireGuard install steps will ensure the appropriate kernel modules are installed for your operating system. You need to install WireGuard on every node, both server and agents before attempting to leverage the WireGuard flannel backend option.
The `wireguard` backend will be removed from v1.26 in favor of `wireguard-native` backend natively from Flannel.

We recommend that users migrate to the new backend as soon as possible. The migration requires a short period of downtime while nodes come up with the new configuration. You should follow these two steps:

1 - Update the K3s config in all control-plane nodes. The config file `/etc/rancher/k3s/config.yaml` should include `flannel-backend: wireguard-native` instead of `flannel-backend: wireguard`.

2 - Reboot all nodes.

  CLI Flag and Value | Description
  -------------------|------------
 `--flannel-backend=vxlan` | (Default) Uses the VXLAN backend. |
 `--flannel-backend=ipsec` | Uses the IPSEC backend which encrypts network traffic. |
 `--flannel-backend=host-gw` |  Uses the host-gw backend. |
 `--flannel-backend=wireguard` | Uses the WireGuard backend which encrypts network traffic. May require additional kernel modules and configuration. (Deprecated and will be removed from version 1.26) |
 `--flannel-backend=wireguard-native` | Uses the WireGuard backend which encrypts network traffic. May require additional kernel modules and configuration. |
 `--flannel-ipv6-masq` | Apply masquerading rules to IPv6 traffic (default for IPv4). Only applies on dual-stack or IPv6-only clusters |

## Custom CNI

Run K3s with `--flannel-backend=none` and install your CNI of choice. Most CNI plugins come with their own network policy engine, so it is recommended to set `--disable-network-policy` as well to avoid conflicts. IP Forwarding should be enabled for Canal and Calico. Please reference the steps below.

<Tabs>
<TabItem value="Canal" default>

Visit the [Project Calico Docs](https://docs.projectcalico.org/) website. Follow the steps to install Canal. Modify the Canal YAML so that IP forwarding is allowed in the container_settings section, for example:

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

Follow the [Calico CNI Plugins Guide](https://projectcalico.docs.tigera.io/master/reference/cni-plugin/configuration). Modify the Calico YAML so that IP forwarding is allowed in the container_settings section, for example:

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
</Tabs>

## Dual-stack installation

Dual-stack networking must be configured when the cluster is first created. It cannot be enabled on an existing single-stack cluster.

Dual-stack is supported on k3s v1.21 or above.

To enable dual-stack in K3s, you must provide valid dual-stack `cluster-cidr` and `service-cidr` on all server nodes. Both servers and agents must provide valid dual-stack `node-ip` settings. Node address auto-detection is not supported on dual-stack clusters, because kubelet fetches only the first IP address that it finds. Additionally, only vxlan backend is supported currently. This is an example of a valid configuration:

```bash
k3s server --node-ip 10.0.10.7,2a05:d012:c6f:4611:5c2:5602:eed2:898c --cluster-cidr 10.42.0.0/16,2001:cafe:42:0::/56 --service-cidr 10.43.0.0/16,2001:cafe:42:1::/112
```

Note that you can choose whatever `cluster-cidr` and `service-cidr` value, however the `node-ip` values must correspond to the ip addresses of your main interface. Remember to allow ipv6 traffic if you are deploying in a public cloud.

If you are using a custom cni plugin, i.e. a cni plugin different from flannel, the previous configuration might not be enough to enable dual-stack in the cni plugin. Please check how to enable dual-stack in its documentation and verify if network policies can be enabled.

> **Warning:** Kubernetes 1.24 and 1.25 include a bug that ignores the node IPv6 addresses if you have a dual-stack environment and you are not using the default network interface card (NIC) for the cluster traffic. To avoid this bug, add the following flag to both K3s servers and agents:

```bash
--kubelet-arg "--node-ip=0.0.0.0" # If you want to prioritize IPv6 traffic, use "--node-ip=::" instead of "--node-ip=0.0.0.0".
```

## IPv6 only installation

IPv6 only setup is supported on k3s v1.22 or above.

> **Warning:** If your IPv6 default route is set by a router advertisement (RA), you will need to set `net.ipv6.conf.all.accept_ra = 2`; otherwise, the node will drop the default route once it expires. Be aware that accepting RAs could increase the risk of [man-in-the-middle attacks](https://github.com/kubernetes/kubernetes/issues/91507).

## Distributed hybrid or multicloud cluster

A k3s cluster can still be deployed on nodes which use different private networks and are not directly connected (e.g. nodes in different public clouds). To achieve this, k3s sets a mesh of tunnels that become a vpn mesh. These nodes must have have an assigned IP through which they can be reached (e.g. a public IP). The server traffic will use a websocket tunnel and the data-plane traffic will use a wireguard tunnel.

To enable this type of deployment, you must add the following parameters in the server:
```bash
--node-external-ip <SERVER_EXTERNAL_IP> --flannel-backend wireguard-native --flannel-external-ip
```
and in the agents/workers:
```bash
--node-external-ip <AGENT_EXTERNAL_IP>
```

where `SERVER_EXTERNAL_IP` is the IP through which we can reach the server node and `AGENT_EXTERNAL_IP` is the IP through which we can reach the agent/worker node. Note that the `K3S_URL` config parameter in the agent/worker should use the `SERVER_EXTERNAL_IP` to be able to connect to it. Remember to allow ingress traffic on the external ips on the operated k3s ports (e.g. tcp/6443 for server nodes)

Both `SERVER_EXTERNAL_IP` and `AGENT_EXTERNAL_IP` must have connectivity between them and are normally public IPs.

> **Warning:** The latency between nodes will increase as the connectivity requires more hops. This will reduce the network performance and could also impact the health of the cluster if latency is too high
