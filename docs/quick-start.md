---
title: Quick-Start Guide
---

This guide will help you quickly launch a cluster with default options. Make sure your nodes meet the [requirements](./installation/requirements.md) before proceeding.

* Consult the [Installation](./installation/installation.md) page for greater detail on installing and configuring K3s.
* For information on how K3s components work together, refer to the [Architecture](./architecture.md) page.
* If you are new to Kubernetes, the [official Kubernetes docs](https://kubernetes.io/docs/tutorials/kubernetes-basics/) have great tutorials covering basics that all cluster administrators should be familiar with.

## Install Script

K3s provides an installation script that is a convenient way to install it as a service on systemd or openrc based systems. This script is available at https://get.k3s.io. To install K3s using this method, just run:

```bash
curl -sfL https://get.k3s.io | sh -
```

After running this installation:

- The K3s service will be configured to automatically restart after node reboots or if the process crashes or is killed
- Additional utilities will be installed, including `kubectl`, `crictl`, `ctr`, `k3s-killall.sh`, and `k3s-uninstall.sh`
- A [kubeconfig](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/) file will be written to `/etc/rancher/k3s/k3s.yaml` and the kubectl installed by K3s will automatically use it

A single-node server installation is a fully-functional Kubernetes cluster, including all the datastore, control-plane, kubelet, and container runtime components necessary to host workload pods. It is not necessary to add additional server or agents nodes, but you may want to do so to add additional capacity or redundancy to your cluster.

To install additional agent nodes and add them to the cluster, run the installation script with the `K3S_URL` and `K3S_TOKEN` environment variables. Here is an example showing how to join an agent:

```bash
curl -sfL https://get.k3s.io | K3S_URL=https://myserver:6443 K3S_TOKEN=mynodetoken sh -
```

Setting the `K3S_URL` parameter causes the installer to configure K3s as an agent, instead of a server. The K3s agent will register with the K3s server listening at the supplied URL. The value to use for `K3S_TOKEN` is stored at `/var/lib/rancher/k3s/server/node-token` on your server node.

:::note
Each machine must have a unique hostname. If your machines do not have unique hostnames, pass the `K3S_NODE_NAME` environment variable and provide a value with a valid and unique hostname for each node.
:::

If you are interested in having more server nodes, see the [High Availability Embedded etcd](./datastore/ha-embedded.md) and [High Availability External DB](./datastore/ha.md) pages for more information.
