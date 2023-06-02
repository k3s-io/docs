---
title: "管理 Server 角色"
weight: 60
---

使用 `--cluster-init` 启动 K3s Server 将运行所有 control-plane 组件，包括 apiserver、controller-manager、scheduler 和 etcd。你可以通过禁用特定组件来将 control-plane 和 etcd 角色拆分到单独的节点上。

:::info
本文档仅适用于使用嵌入式 etcd 的情况。如果没有使用嵌入式 etcd，所有 Server 都将具有 control-plane 角色并运行 control-plane 组件。
:::

## 专用 `etcd` 节点
要创建仅具有 `etcd` 角色的 server，请在禁用所有 control plane 组件的情况下启动 K3s：
```
curl -fL https://get.k3s.io | sh -s - server --cluster-init --disable-apiserver --disable-controller-manager --disable-scheduler
```

第一个节点将启动 etcd，然后等待其他 `etcd` 和/或 `control-plane` 节点加入。在加入启用了 `control-plane` 组件的其他 server 之前，集群将无法使用。

## 专用 `control-plane` 节点
:::note
专用 `control-plane` 节点不能是集群中的第一个 server。在加入专用 `control-plane` 节点之前，必须有一个具有 `etcd` 角色的现有节点。
:::

要创建仅具有 `control-plane` 角色的 server，请在 `--disable-etcd` 的情况下启动 K3s：
```bash
curl -fL https://get.k3s.io | sh -s - server --token <token> --disable-etcd --server https://<etcd-only-node>:6443
```

创建专用 Server 节点后，所选角色将在 `kubectl get node` 中可见：
```bash
$ kubectl get nodes
NAME           STATUS   ROLES                       AGE     VERSION
k3s-server-1   Ready    etcd                        5h39m   v1.20.4+k3s1
k3s-server-2   Ready    control-plane,master        5h39m   v1.20.4+k3s1
```

## 将角色添加到现有 server

如果在删除了 disable 标志的情况下重启 K3s，你可以将角色添加到现有的专用节点。例如，要将 `control-plane` 角色添加到专用的 `etcd` 节点，你可以从 systemd 单元或配置文件中删除 `--disable-apiserver --disable-controller -manager --disable-scheduler` 标记，并重启服务。

## 配置文件语法

与所有其他 CLI 标志一样，你可以使用[配置文件](configuration.md#配置文件)来禁用组件，而不是将选项作为 CLI 标志传递。例如，要创建专用的 `etcd` 节点，你可以将以下值放在 `/etc/rancher/k3s/config.yaml` 中：

```yaml
cluster-init: true
disable-apiserver: true
disable-controller-manager: true
disable-scheduler: true
```
