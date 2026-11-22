---
title: "管理 Server 角色"
---

使用 `--cluster-init` 启动 K3s server 时，将运行所有 control-plane 组件，包括 apiserver、controller-manager、scheduler 和 etcd。可以禁用特定组件，从而将 control-plane 和 etcd 角色拆分到不同节点上。

:::info
本文仅在使用内嵌 etcd 时适用。不使用内嵌 etcd 时，所有 server 都具有 control-plane 角色并运行 control-plane 组件。
:::

## 专用 `etcd` 节点 {#dedicated-etcd-nodes}
要创建仅具有 `etcd` 角色的 server，请在启动 K3s 时禁用所有 control-plane 组件：
```
curl -fL https://get.k3s.io | sh -s - server --cluster-init --disable-apiserver --disable-controller-manager --disable-scheduler
```

第一个节点将启动 etcd，并等待其他 `etcd` 和/或 `control-plane` 节点加入。在你加入一个启用了 `control-plane` 组件的 server 之前，集群将不可用。

## 专用 `control-plane` 节点 {#dedicated-control-plane-nodes}
:::note
专用 `control-plane` 节点不能是集群中的第一个 server；在加入专用 `control-plane` 节点之前，必须已有一个具有 `etcd` 角色的节点。
:::

要创建仅具有 `control-plane` 角色的 server，请在启动 k3s 时禁用 etcd：
```bash
curl -fL https://get.k3s.io | sh -s - server --token <token> --disable-etcd --server https://<etcd-only-node>:6443 
```

创建专用 server 节点后，所选角色将在 `kubectl get node` 中可见：
```bash
$ kubectl get nodes
NAME           STATUS   ROLES                       AGE     VERSION
k3s-server-1   Ready    etcd                        5h39m   v1.20.4+k3s1
k3s-server-2   Ready    control-plane,master        5h39m   v1.20.4+k3s1
```

## 向现有 Server 添加角色 {#adding-roles-to-existing-servers}

通过移除 disable 标志并重启 K3s，可以向现有专用节点添加角色。例如，如果要为专用 `etcd` 节点添加 `control-plane` 角色，可以从 systemd unit 或配置文件中移除 `--disable-apiserver --disable-controller-manager --disable-scheduler` 标志，然后重启服务。

## 配置文件语法 {#configuration-file-syntax}

与所有其他 CLI 标志一样，你可以使用[配置文件](configuration.md#configuration-file)禁用组件，而不必将选项作为 CLI 标志传递。例如，要创建专用 `etcd` 节点，可以在 `/etc/rancher/k3s/config.yaml` 中放置以下值：

```yaml
cluster-init: true
disable-apiserver: true
disable-controller-manager: true
disable-scheduler: true
```
