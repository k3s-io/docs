---
title: "High Availability Embedded etcd"
weight: 40
---

:::warning
Embedded etcd (HA) may have performance issues on slower disks such as Raspberry Pis running with SD cards.
:::

:::info
HA embedded etcd cluster must be comprised of an odd number of server nodes for etcd to maintain quorum. For a cluster with n servers, quorum is (n/2)+1. For any odd-sized cluster, adding one node will always increase the number of nodes necessary for quorum. Although adding a node to an odd-sized cluster appears better since there are more machines, the fault tolerance is worse since exactly the same number of nodes may fail without losing quorum but there are more nodes that can fail.
:::

:::note
To rapidly deploy large HA clusters, see [Related Projects](/related-projects)
:::

An HA K3s cluster with embedded etcd is composed of:

- Three or more **server nodes** that will serve the Kubernetes API and run other control plane services, as well as host the embedded etcd datastore.
- Optional: Zero or more **agent nodes** that are designated to run your apps and services
- Optional: A **fixed registration address** for agent nodes to register with the cluster

To get started, first launch a server node with the `cluster-init` flag to enable clustering and a token that will be used as a shared secret to join additional servers to the cluster.

```bash
curl -sfL https://get.k3s.io | K3S_TOKEN=SECRET sh -s - server \
    --cluster-init \
    --tls-san=<FIXED_IP> # Optional, needed if using a fixed registration address
```

After launching the first server, join the second and third servers to the cluster using the shared secret:

```bash
curl -sfL https://get.k3s.io | K3S_TOKEN=SECRET sh -s - server \
    --server https://<ip or hostname of server1>:6443 \
    --tls-san=<FIXED_IP> # Optional, needed if using a fixed registration address
```

Check to see that the second and third servers are now part of the cluster:

```bash
$ kubectl get nodes
NAME        STATUS   ROLES                       AGE   VERSION
server1     Ready    control-plane,etcd,master   28m   vX.Y.Z
server2     Ready    control-plane,etcd,master   13m   vX.Y.Z
server3     Ready    control-plane,etcd,master   10m   vX.Y.Z
```

Now you have a highly available control plane. Any successfully clustered servers can be used in the `--server` argument to join additional server and agent nodes. Joining additional agent nodes to the cluster follows the same procedure as servers:

```bash
curl -sfL https://get.k3s.io | K3S_TOKEN=SECRET sh -s - agent --server https://<ip or hostname of server>:6443
```

There are a few config flags that must be the same in all server nodes:

- Network related flags: `--cluster-dns`, `--cluster-domain`, `--cluster-cidr`, `--service-cidr`
- Flags controlling the deployment of certain components: `--disable-helm-controller`, `--disable-kube-proxy`, `--disable-network-policy` and any component passed to `--disable`
- Feature related flags: `--secrets-encryption`

## Existing single-node clusters

:::info Version Gate
Available as of [v1.22.2+k3s1](https://github.com/k3s-io/k3s/releases/tag/v1.22.2%2Bk3s1)
:::

If you have an existing cluster using the default embedded SQLite database, you can convert it to etcd by simply restarting your K3s server with the `--cluster-init` flag. Once you've done that, you'll be able to add additional instances as described above.

If an etcd datastore is found on disk either because that node has either initialized or joined a cluster already, the datastore arguments (`--cluster-init`, `--server`, `--datastore-endpoint`, etc) are ignored.
