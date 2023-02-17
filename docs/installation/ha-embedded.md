---
title: "High Availability with Embedded DB"
weight: 40
---

:::info Version Gate
Full support as of [v1.19.5+k3s1](https://github.com/k3s-io/k3s/releases/tag/v1.19.5%2Bk3s1)  
Experimental support as of [v1.19.1+k3s1](https://github.com/k3s-io/k3s/releases/tag/v1.19.1%2Bk3s1)
:::

:::note Notice: Deprecated Dqlite
Embedded etcd replaced experimental Dqlite in the K3s v1.19.1 release. This is a breaking change. Please note that upgrades from experimental Dqlite to embedded etcd are not supported. If you attempt an upgrade it will not succeed and data will be lost.
:::

:::caution
Embedded etcd (HA) may have performance issues on slower disks such as Raspberry Pis running with SD cards.
:::

## New cluster
To run K3s in this mode, you must have an odd number of server nodes. We recommend starting with three nodes. An HA K3s cluster(with Embedded etcd) is comprised of:

* An odd number (at least three) of **server nodes** that will run etcd, the Kubernetes API, and other control plane services
* Zero or more **agent nodes** that are designated to run your apps and services
* A **fixed registration address** that is placed in front of the server nodes to allow agent nodes to register with the cluster

To get started, first launch a server node with the `cluster-init` flag to enable clustering and a token that will be used as a shared secret to join additional servers to the cluster.
```bash
curl -sfL https://get.k3s.io | K3S_TOKEN=SECRET sh -s - server --cluster-init
```

After launching the first server, join the second and third servers to the cluster using the shared secret:
```bash
curl -sfL https://get.k3s.io | K3S_TOKEN=SECRET sh -s - server --server https://<ip or hostname of server1>:6443
```

Check to see that the second and third servers are now part of the cluster:

```bash
$ kubectl get nodes
NAME        STATUS   ROLES                       AGE   VERSION
server1     Ready    control-plane,etcd,master   28m   vX.Y.Z
server2     Ready    control-plane,etcd,master   13m   vX.Y.Z
```

Now you have a highly available control plane. Any successfully clustered servers can be used in the `--server` argument to join additional server and worker nodes. Joining additional worker nodes to the cluster follows the same procedure as a single server cluster.

There are a few config flags that must be the same in all server nodes:         

* Network related flags: `--cluster-dns`, `--cluster-domain`, `--cluster-cidr`, `--service-cidr`
* Flags controlling the deployment of certain components: `--disable-helm-controller`, `--disable-kube-proxy`, `--disable-network-policy` and any component passed to `--disable`
* Feature related flags: `--secrets-encryption`

## Existing clusters
If you have an existing cluster using the default embedded SQLite database, you can convert it to etcd by simply restarting your K3s server with the `--cluster-init` flag. Once you've done that, you'll be able to add additional instances as described above.

If an etcd datastore is found on disk either because that node has either initialized or joined a cluster already, the datastore arguments (`--cluster-init`, `--server`, `--datastore-endpoint`, etc) are ignored.

>**Important:** K3s v1.22.2 and newer support migration from SQLite to etcd. Older versions will create a new empty datastore if you add `--cluster-init` to an existing server.

