---
title: "Managing Server Roles"
---

Starting the K3s server with `--cluster-init` will run all control-plane components, including the apiserver, controller-manager, scheduler, and etcd. It is possible to disable specific components in order to split the control-plane and etcd roles on to separate nodes.

:::info
This document is only relevant when using embedded etcd. When not using embedded etcd, all servers will have the control-plane role and run control-plane components.
:::

## Dedicated `etcd` Nodes
To create a server with only the `etcd` role, start K3s with all the control-plane components disabled:
```
curl -fL https://get.k3s.io | sh -s - server --cluster-init --disable-apiserver --disable-controller-manager --disable-scheduler
```

This first node will start etcd, and wait for additional `etcd` and/or `control-plane` nodes to join. The cluster will not be usable until you join an additional server with the `control-plane` components enabled.

## Dedicated `control-plane` Nodes
:::note
A dedicated `control-plane` node cannot be the first server in the cluster; there must be an existing node with the `etcd` role before joining dedicated `control-plane` nodes.
:::

To create a server with only the `control-plane` role, start k3s with etcd disabled:
```bash
curl -fL https://get.k3s.io | sh -s - server --token <token> --disable-etcd --server https://<etcd-only-node>:6443 
```

After creating dedicated server nodes, the selected roles will be visible in `kubectl get node`:
```bash
$ kubectl get nodes
NAME           STATUS   ROLES                       AGE     VERSION
k3s-server-1   Ready    etcd                        5h39m   v1.20.4+k3s1
k3s-server-2   Ready    control-plane,master        5h39m   v1.20.4+k3s1
```

## Adding Roles To Existing Servers

Roles can be added to existing dedicated nodes by restarting K3s with the disable flags removed. For example ,if you want to add the `control-plane` role to a dedicated `etcd` node, you can remove the `--disable-apiserver --disable-controller-manager --disable-scheduler` flags from the systemd unit or config file, and restart the service.

## Configuration File Syntax

As with all other CLI flags, you can use the  [Configuration File](configuration.md#configuration-file) to disable components, instead of passing the options as CLI flags. For example, to create a dedicated `etcd` node, you can place the following values in `/etc/rancher/k3s/config.yaml`:

```yaml
cluster-init: true
disable-apiserver: true
disable-controller-manager: true
disable-scheduler: true
```
