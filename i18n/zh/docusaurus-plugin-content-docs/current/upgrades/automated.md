---
title: "自动升级"
weight: 20
---

### Overview

你可以使用 Rancher 的 system-upgrade-controller 管理 K3s 集群升级。这是一种 Kubernetes 原生的集群升级方法。它利用[自定义资源定义（custom resource definition，CRD）](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/#custom-resources)、`计划`和[控制器](https://kubernetes.io/docs/concepts/architecture/controller/)，根据配置的计划安排升级。

计划定义了升级的策略和要求。本文档将提供适用于升级 K3s 集群的默认计划。有关更高级的计划配置选项，请参阅 [CRD](https://github.com/rancher/system-upgrade-controller/blob/master/pkg/apis/upgrade.cattle.io/v1/types.go)。

控制器通过监控计划和选择要运行升级 [job](https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/) 的节点来安排升级。计划通过[标签选择器](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/)定义应该升级哪些节点。job 成功运行完成时，控制器将相应地标记它运行的节点。

> **注意**：启动的升级 job 必须具有高权限。它配置了以下内容：
>
- 主机 `IPC`、`NET` 和 `PID` 命名空间
- `CAP_SYS_BOOT` 能力
- 挂载在 `/host` 的主机根目录，具有读写权限

有关 system-upgrade-controller 的设计和架构，以及它与 K3s 集成的更多详细信息，请参阅以下 Git 仓库：

- [system-upgrade-controller](https://github.com/rancher/system-upgrade-controller)
- [k3s-upgrade](https://github.com/rancher/k3s-upgrade)

要以这种方式自动升级，你必须执行以下操作：

1. 将 system-upgrade-controller 安装到集群中
1. 配置计划

> **注意**：如果 Rancher 正在管理它，用户应该使用 Rancher 来升级 K3s 集群。
>
> * 如果你使用 Rancher 进行升级，则不需要执行下面的步骤。
> * 如果你不使用 Rancher 进行升级，则必须执行以下步骤进行升级。


### 安装 system-upgrade-controller
system-upgrade-controller 可以作为 Deployment 安装到你的集群中。Deployment 需要 ServiceAccount、clusterRoleBinding 和 configmap。要安装这些组件，请运行以下命令：
```bash
kubectl apply -f https://github.com/rancher/system-upgrade-controller/releases/latest/download/system-upgrade-controller.yaml
```
控制器可以通过前面提到的 configmap 进行配置和自定义，但控制器必须重新部署才能应用更改。


### 配置计划
建议你至少创建两个计划：升级 server（master）节点的计划和升级 agent（worker）节点的计划。根据需要，你可以创建其他计划来控制跨节点的升级回滚。以下两个示例计划会将你的集群升级到 K3s v1.24.6+k3s1。创建计划后，控制器将选择它们并开始升级你的集群。
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
    - key: node-role.kubernetes.io/master
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
    - key: node-role.kubernetes.io/master
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

首先，必须在部署控制器的同一命名空间中创建计划。

其次，`concurrency` 字段表示可以同时升级多少个节点。

第三，`server-plan` 通过指定一个标签选择器来选择带有 `node-role.kubernetes.io/master` 标签的节点，从而锁定 server 节点。`agent-plan` 通过指定一个标签选择器来选择没有该标签的节点，从而锁定 agent 节点。

第四，`agent-plan` 中的 `prepare` 步骤会使该计划等待 `server-plan` 完成后再执行升级 job。

第五，两个计划都将 `version` 字段设置为 v1.24.6+k3s1。或者，你可以省略 `version` 字段并将 `channel` 字段设置为解析到 K3s 版本的 URL。这将导致控制器监控该 URL，并在它解析到新版本时随时升级集群。这适用于[版本 channels](manual.md#版本-channels)。因此，你可以用下面的 channel 配置计划，从而确保你的集群总是自动升级到 K3s 的最新稳定版本。
```yaml
apiVersion: upgrade.cattle.io/v1
kind: Plan
...
spec:
  ...
  channel: https://update.k3s.io/v1-release/channels/stable

```

如前所述，一旦控制器检测到已创建计划，升级就会立即开始。更新计划将导致控制器重新评估计划并确定是否需要再次升级。

你可以通过 kubectl 查看计划和 job 来监控升级进度：
```bash
kubectl -n system-upgrade get plans -o yaml
kubectl -n system-upgrade get jobs -o yaml
```

