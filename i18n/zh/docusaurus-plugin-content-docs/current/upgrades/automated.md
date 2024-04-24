---
title: "自动升级"
---

### Overview

你可以使用 Rancher 的 system-upgrade-controller 管理 K3s 集群升级。这是一种 Kubernetes 原生的集群升级方法。它使用了[自定义资源定义 (CRD)](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/#custom-resources)、`计划`和[控制器](https://kubernetes.io/docs/concepts/architecture/controller/)。

计划定义了升级的策略和要求。它还通过[标签选择器](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/)来定义应该升级的节点。请参阅下文，了解适用于升级 K3s 集群的默认计划。有关更高级的计划配置选项，请参阅 [CRD](https://github.com/rancher/system-upgrade-controller/blob/master/pkg/apis/upgrade.cattle.io/v1/types.go)。

控制器通过监控计划和选择要运行升级 [job](https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/) 的节点来安排升级。job 成功运行完成时，控制器将相应地标记它运行的节点。

:::note
启动的升级 job 必须具有高权限。它配置了以下内容：
- 主机 `IPC`、`NET` 和 `PID` 命名空间
- `CAP_SYS_BOOT` 能力
- 挂载在 `/host` 的主机根目录，具有读写权限

:::


要以这种方式自动升级，你必须执行以下操作：

1. 将 system-upgrade-controller 安装到集群中
1. 配置计划

:::warning
如果 K3s 集群由 Rancher 管理，你需要使用 Rancher UI 来管理升级。
- 如果 K3s 集群是导入到 Rancher 的，Rancher 将管理 system-upgrade-controller 部署和计划。不要按照此页面上的步骤操作。
- 如果 K3s 集群是由 Rancher 预配的，Rancher 将使用系统 Agent 来管理版本升级。不要按照此页面上的步骤操作。
- 如果 K3s 集群*不是*由 Rancher 管理的，你可以按照以下步骤操作。

:::

有关 system-upgrade-controller 的设计和架构，以及它与 K3s 集成的更多详细信息，请参阅以下 Git 仓库：

- [system-upgrade-controller](https://github.com/rancher/system-upgrade-controller)
- [k3s-upgrade](https://github.com/k3s-io/k3s-upgrade)

:::tip
尝试升级到 K3s 新版本时，[Kubernetes 版本倾斜策略](https://kubernetes.io/docs/setup/release/version-skew-policy/)适用。确保你的计划在升级时不会跳过中间次要版本。system-upgrade-controller 本身不会防止更改到不支持的 Kubernetes 版本。
:::

### 安装 system-upgrade-controller
system-upgrade-controller 可以作为 Deployment 安装到你的集群中。Deployment 需要 ServiceAccount、clusterRoleBinding 和 configmap。要安装这些组件，请运行以下命令：
```bash
kubectl apply -f https://github.com/rancher/system-upgrade-controller/releases/latest/download/system-upgrade-controller.yaml
```
控制器可以通过前面提到的 configmap 进行配置和自定义，但控制器必须重新部署才能应用更改。


### 配置计划
建议你至少创建两个计划：升级 server（control-plane）节点的计划和升级 agent 节点的计划。你可以根据需要创建其他计划来控制跨节点的升级。创建计划后，控制器将选择它们并开始升级你的集群。

以下两个示例计划会将你的集群升级到 K3s v1.24.6+k3s1：

```yaml
# Server plan
apiVersion: upgrade.cattle.io/v1
kind: Plan
metadata:
  name: server-plan
  namespace: system-upgrade
spec:
  concurrency: 1
  cordon: true
  nodeSelector:
    matchExpressions:
    - key: node-role.kubernetes.io/control-plane
      operator: In
      values:
      - "true"
  serviceAccountName: system-upgrade
  upgrade:
    image: rancher/k3s-upgrade
  version: v1.24.6+k3s1
---
# Agent plan
apiVersion: upgrade.cattle.io/v1
kind: Plan
metadata:
  name: agent-plan
  namespace: system-upgrade
spec:
  concurrency: 1
  cordon: true
  nodeSelector:
    matchExpressions:
    - key: node-role.kubernetes.io/control-plane
      operator: DoesNotExist
  prepare:
    args:
    - prepare
    - server-plan
    image: rancher/k3s-upgrade
  serviceAccountName: system-upgrade
  upgrade:
    image: rancher/k3s-upgrade
  version: v1.24.6+k3s1
```

关于这些计划，有几个重要的事情需要注意：

1) 计划必须在部署控制器的同一命名空间中创建。

2) `concurrency` 字段表示可以同时升级多少个节点。

3) `server-plan` 通过指定一个标签选择器来选择带有 `node-role.kubernetes.io/control-plane` 标签的节点，从而锁定 server 节点。`agent-plan` 通过指定一个标签选择器来选择没有该标签的节点，从而锁定 agent 节点。

4) `agent-plan` 中的 `prepare` 步骤会使该计划等待 `server-plan` 完成后再执行升级 job。

5) 两个计划都将 `version` 字段设置为 v1.24.6+k3s1。或者，你可以省略 `version` 字段并将 `channel` 字段设置为解析到 K3s 版本的 URL。这将导致控制器监控该 URL，并在它解析到新版本时随时升级集群。这适用于[版本 channels](manual.md#版本-channels)。因此，你可以用下面的 channel 配置计划，从而确保你的集群总是自动升级到 K3s 的最新稳定版本。
```yaml
apiVersion: upgrade.cattle.io/v1
kind: Plan
...
spec:
  ...
  channel: https://update.k3s.io/v1-release/channels/stable

```

如前所述，一旦控制器检测到已创建计划，升级就会立即开始。更新计划将导致控制器重新评估计划并确定是否需要再次升级。

要监控升级进度，你可以使用 kubectl 来查看 plan 和 job：
```bash
kubectl -n system-upgrade get plans -o yaml
kubectl -n system-upgrade get jobs -o yaml
```


## 降级预防

:::info 版本
从 2023-07 版本（[v1.27.4+k3s1](https://github.com/k3s-io/k3s-upgrade/releases/tag/v1.27.4%2Bk3s1)、[v1.26.7+k3s1](https://github.com/k3s-io/k3s-upgrade/releases/tag/v1.26.7%2Bk3s1)、[v1.25.12+k3s1](https://github.com/k3s-io/k3s-upgrade/releases/tag/v1.25.12%2Bk3s1)、[v1.24.16+k3s1](https://github.com/k3s-io/k3s-upgrade/releases/tag/v1.24.16%2Bk3s1)）开始。
:::

Kubernetes 不支持 Control Plane 组件的降级。升级计划使用的 k3s-upgrade 镜像将拒绝降级 K3s，从而导致计划失败并让你的节点处于封锁状态。

以下是一个示例集群，显示了失败的升级 Pod 和封锁的节点：

```console
ubuntu@user:~$ kubectl get pods -n system-upgrade
NAME                                                              READY   STATUS    RESTARTS   AGE
apply-k3s-server-on-ip-172-31-0-16-with-7af95590a5af8e8c3-2cdc6   0/1     Error     0          9m25s
apply-k3s-server-on-ip-172-31-10-23-with-7af95590a5af8e8c-9xvwg   0/1     Error     0          14m
apply-k3s-server-on-ip-172-31-13-213-with-7af95590a5af8e8-8j72v   0/1     Error     0          18m
system-upgrade-controller-7c4b84d5d9-kkzr6                        1/1     Running   0          20m
ubuntu@user:~$ kubectl get nodes
NAME               STATUS                     ROLES                       AGE   VERSION
ip-172-31-0-16     Ready,SchedulingDisabled   control-plane,etcd,master   19h   v1.27.4+k3s1
ip-172-31-10-23    Ready,SchedulingDisabled   control-plane,etcd,master   19h   v1.27.4+k3s1
ip-172-31-13-213   Ready,SchedulingDisabled   control-plane,etcd,master   19h   v1.27.4+k3s1
ip-172-31-2-13     Ready                      <none>                      19h   v1.27.4+k3s1
```
你可以通过以下任一方法让封锁的节点恢复服务：
* 更改计划中的版本或通道来定位与集群上当前运行的版本相同或更新的版本，以便计划成功。
* 删除计划并手动取消节点封锁。
   使用 `kubectl get plan -n system-upgrade` 查找计划名称，然后使用 `kubectl delete plan -n system-upgrade PLAN_NAME` 将其删除。删除计划后，使用 `kubectl uncordon NODE_NAME` 取消对每个节点的封锁。
