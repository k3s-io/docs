---
title: "Distributed hybrid or multicloud cluster"
---

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
