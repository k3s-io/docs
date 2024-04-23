---
title: "Automated Upgrades"
---

### Overview

You can manage K3s cluster upgrades using Rancher's system-upgrade-controller. This is a Kubernetes-native approach to cluster upgrades. It leverages a [custom resource definition (CRD)](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/#custom-resources), a `plan`, and a [controller](https://kubernetes.io/docs/concepts/architecture/controller/).

The plan defines upgrade policies and requirements. It also defines which nodes should be upgraded through a [label selector](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/). See below for plans with defaults appropriate for upgrading a K3s cluster. For more advanced plan configuration options, please review the [CRD](https://github.com/rancher/system-upgrade-controller/blob/master/pkg/apis/upgrade.cattle.io/v1/types.go).

The controller schedules upgrades by monitoring plans and selecting nodes to run upgrade [jobs](https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/) on. When a job has run to completion successfully, the controller will label the node on which it ran accordingly.

:::note 
The upgrade job that is launched must be highly privileged. It is configured with the following:
- Host `IPC`, `NET`, and `PID` namespaces
- The `CAP_SYS_BOOT` capability
- Host root mounted at `/host` with read and write permissions
:::


To automate upgrades in this manner, you must do the following:

1. Install the system-upgrade-controller into your cluster
1. Configure plans

:::warning
If the K3s cluster is managed by Rancher, you should use the Rancher UI to manage upgrades.
- If the K3s cluster was imported into Rancher, Rancher will manage the system-upgrade-controller deployment and plans. Do not follow the steps on this page.
- If the K3s cluster was provisioned by Rancher, Rancher will use system agent to manage version upgrades. Do not follow the steps on this page.
- If the K3s cluster is *not* managed Rancher, you may follow the steps below.
:::

For more details on the design and architecture of the system-upgrade-controller or its integration with K3s, see the following Git repositories:

- [system-upgrade-controller](https://github.com/rancher/system-upgrade-controller)
- [k3s-upgrade](https://github.com/k3s-io/k3s-upgrade)

:::tip
When attempting to upgrade to a new version of K3s, the [Kubernetes version skew policy](https://kubernetes.io/docs/setup/release/version-skew-policy/) applies. Ensure that your plan does not skip intermediate minor versions when upgrading. The system-upgrade-controller itself will not protect against unsupported changes to the Kubernetes version.
:::

### Install the system-upgrade-controller
 The system-upgrade-controller can be installed as a deployment into your cluster. The deployment requires a service-account, clusterRoleBinding, and a configmap. To install these components, run the following command:
```bash
kubectl apply -f https://github.com/rancher/system-upgrade-controller/releases/latest/download/system-upgrade-controller.yaml
```
The controller can be configured and customized via the previously mentioned configmap, but the controller must be redeployed for the changes to be applied.


### Configure plans
It is recommended you create at least two plans: a plan for upgrading server (control-plane) nodes and a plan for upgrading agent nodes. You can create additional plans as needed to control the rollout of the upgrade across nodes. Once the plans are created, the controller will pick them up and begin to upgrade your cluster.  

The following two example plans will upgrade your cluster to K3s v1.24.6+k3s1:

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

There are a few important things to call out regarding these plans:

1) The plans must be created in the same namespace where the controller was deployed.

2) The `concurrency` field indicates how many nodes can be upgraded at the same time. 

3) The server-plan targets server nodes by specifying a label selector that selects nodes with the `node-role.kubernetes.io/control-plane` label. The agent-plan targets agent nodes by specifying a label selector that select nodes without that label.

4) The `prepare` step in the agent-plan will cause upgrade jobs for that plan to wait for the server-plan to complete before they execute.

5) Both plans have the `version` field set to v1.24.6+k3s1. Alternatively, you can omit the `version` field and set the `channel` field to a URL that resolves to a release of K3s. This will cause the controller to monitor that URL and upgrade the cluster any time it resolves to a new release. This works well with the [release channels](manual.md#release-channels). Thus, you can configure your plans with the following channel to ensure your cluster is always automatically upgraded to the newest stable release of K3s:
```yaml
apiVersion: upgrade.cattle.io/v1
kind: Plan
...
spec:
  ...
  channel: https://update.k3s.io/v1-release/channels/stable

```

As stated, the upgrade will begin as soon as the controller detects that a plan was created. Updating a plan will cause the controller to re-evaluate the plan and determine if another upgrade is needed.

You can monitor the progress of an upgrade by viewing the plan and jobs via kubectl:
```bash
kubectl -n system-upgrade get plans -o yaml
kubectl -n system-upgrade get jobs -o yaml
```

