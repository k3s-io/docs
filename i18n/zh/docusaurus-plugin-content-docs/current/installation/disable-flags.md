---
title: "禁用组件标志"
weight: 60
---

使用 `--cluster-init` 参数启动 K3s Server 时，它会运行所有 control plane 组件，包括 API Server、controller manager、scheduler 和 etcd。但是，你可以只使用其中的一些组件来运行 Server 节点。本文将解释如何使用指定的组件运行 Server 节点。

## 仅使用 ETCD 的节点

本文档假设你通过将 `--cluster-init` 标志传递给 Server 进程来运行带有嵌入式 etcd 的 K3s Server。

要运行只包含 etcd 组件的 K3s Server，你可以将 `--disable-apiserver --disable-controller-manager --disable-scheduler` 标志传递给 K3s，这样就能运行只有 etcd 组件的 Server 节点。例如，使用以下标志运行 K3s Server：

```bash
curl -fL https://get.k3s.io | sh -s - server --cluster-init --disable-apiserver --disable-controller-manager --disable-scheduler
```

之后，你可以将其他节点正常加入集群。

## 禁用 ETCD

你也可以禁用 Server 节点中的 etcd，这将导致 K3s Server 运行除了 etcd 以外的控制组件，这可以通过运行 K3s Server 的标志 `--disable-etcd` 来实现。例如，将另一个只有控制组件的节点加入到上一节创建的 etcd 节点中：

```bash
curl -fL https://get.k3s.io | sh -s - server --token <token> --disable-etcd --server https://<etcd-only-node>:6443
```

最终的结果将是两个节点，其中一个是仅使用 etcd 的节点，另一个是仅使用 control plane 的节点。如果你检查节点列表，你应该看到类似下面的返回结果：

```bash
$ kubectl get nodes
NAME              STATUS   ROLES                       AGE     VERSION
ip-172-31-13-32   Ready    etcd                        5h39m   v1.20.4+k3s1
ip-172-31-14-69   Ready    control-plane,master        5h39m   v1.20.4+k3s1
```

注意，你只能在运行 API 的 K3s Server 上运行 `kubectl` 命令，而不能在仅使用 etcd 的节点上运行 `kubectl` 命令。


### 重新启用控制组件

在这两种情况下，你可以随时重新启用已经禁用的组件，只需删除相应的禁用标志，例如，如果你想把只有 etcd 的节点恢复到有所有组件的完整的 K3s Server，你只需删除以下 3 个标志 `--disable-apiserver --disable-controller-manager --disable-scheduler`。因此，在我们的示例中，要把节点 `ip-172-31-13-32` 恢复到完整的 k3s Server，你只需重新运行没有禁用标志的 curl 命令：
```bash
curl -fL https://get.k3s.io | sh -s - server --cluster-init
```

你会发现所有的组件都重新启动了，你可以再次运行 kubectl 命令：

```bash
$ kubectl get nodes
NAME              STATUS   ROLES                       AGE     VERSION
ip-172-31-13-32   Ready    control-plane,etcd,master   5h45m   v1.20.4+k3s1
ip-172-31-14-69   Ready    control-plane,master        5h45m   v1.20.4+k3s1
```

请注意，角色标签已使用正确的标签（control plane、etcd、master）重新添加到节点 `ip-172-31-13-32`。

## 使用配置文件添加禁用标志

在上述的任何一种情况下，你都可以使用配置文件来代替运行带有相关标志的 curl 命令，例如要运行只有 etcd 的节点，你可以在 `/etc/rancher/k3s/config.yaml` 文件中添加以下选项：

```yaml
---
disable-apiserver: true
disable-controller-manager: true
disable-scheduler: true
cluster-init: true
```
然后用 curl 命令启动 K3s，不需要任何参数：

```bash
curl -fL https://get.k3s.io | sh -
```
## 使用 .skip 文件禁用组件

对于 `/var/lib/rancher/k3s/server/manifests` 下的任何 YAML 文件（coredns、traefik、local-storeage 等），你可以添加一个 `.skip` 文件，这将导致 K3s 不应用相关的 YAML 文件。
例如，在 manifests 目录中添加 `traefik.yaml.skip` 会导致 K3s 跳过 `traefik.yaml`。
```bash
$ ls /var/lib/rancher/k3s/server/manifests
ccm.yaml      local-storage.yaml  rolebindings.yaml  traefik.yaml.skip
coredns.yaml  traefik.yaml

$ kubectl get pods -A
NAMESPACE     NAME                                     READY   STATUS    RESTARTS   AGE
kube-system   local-path-provisioner-64ffb68fd-xx98j   1/1     Running   0          74s
kube-system   metrics-server-5489f84d5d-7zwkt          1/1     Running   0          74s
kube-system   coredns-85cb69466-vcq7j                  1/1     Running   0          74s
```
