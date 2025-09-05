---
title: Automated Upgrades
---

## Overview

You can manage K3s cluster upgrades using Rancher's system-upgrade-controller. This is a Kubernetes-native approach to cluster upgrades. It leverages a [`Plan`](https://github.com/rancher/system-upgrade-controller/blob/master/doc/plan.md#planspec) Custom Resource to declaratively describe what nodes to upgrade, and to what version.

The plan defines upgrade policies and requirements. It also defines which nodes should be upgraded through a [label selector](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/). See below for plans with defaults appropriate for upgrading a K3s cluster. For more advanced plan configuration options, see the Plan documentation linked above.

The System Upgrade controller schedules upgrades by monitoring plans and selecting nodes to run upgrade [Jobs](https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/) on. When a Job has run to completion successfully, the controller will label the node on which it ran accordingly.

:::warning
If the K3s cluster is managed by Rancher, you should use the Rancher UI to manage upgrades.
- If the K3s cluster was imported (registered) into Rancher, Rancher will by default manage the system-upgrade-controller deployment and plans. Do not follow the steps on this page unless you have disabled version management in Rancher.  
  See [Configuring Version Management for RKE2 and K3s Clusters](https://ranchermanager.docs.rancher.com/how-to-guides/new-user-guides/kubernetes-clusters-in-rancher-setup/register-existing-clusters#configuring-version-management-for-rke2-and-k3s-clusters) for more information.
- If the K3s cluster was provisioned by Rancher, Rancher will use system agent to manage version upgrades. Do not follow the steps on this page.
- If the K3s cluster is *not* managed by Rancher, you may follow the steps below.
:::

## Using the System Upgrade Controller

To automate upgrades , you must do the following:

1. Install the system-upgrade-controller into your cluster
1. Create plans describing which groups of nodes to upgrade, and how.

For more details on the design and architecture of the system-upgrade-controller or its integration with K3s, see the following Git repositories:

- [system-upgrade-controller](https://github.com/rancher/system-upgrade-controller)
- [k3s-upgrade](https://github.com/k3s-io/k3s-upgrade)

:::tip
When attempting to upgrade to a new version of K3s, the [Kubernetes version skew policy](https://kubernetes.io/releases/version-skew-policy/) applies. Ensure that your plan does not skip intermediate minor versions when upgrading. The system-upgrade-controller itself will not protect against unsupported changes to the Kubernetes version.
:::

### Installation

 The system-upgrade-controller manifest installs a custom resource definition, deployment, service account, cluster role binding, and configmap. To install these components, run the following command:

```bash
kubectl apply -f https://github.com/rancher/system-upgrade-controller/releases/latest/download/crd.yaml -f https://github.com/rancher/system-upgrade-controller/releases/latest/download/system-upgrade-controller.yaml
```
The controller can be configured and customized via the previously mentioned configmap, but the controller pod must be deleted for the changes to be applied.

### Configuration
Server nodes should always be upgraded before agent nodes.
For this reason, it is recommended you create at least two plans: a plan for upgrading server (control-plane) nodes, and a plan for upgrading agent nodes.
You can create additional plans as needed to control the rollout of the upgrade across nodes.
Once the plans are created, the controller will pick them up and begin to upgrade your cluster.  

The following two example plans will continuously keep your your cluster upgraded to the current stable release, by targeting the stable [release channel](manual.md#release-channels):

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
  channel: https://update.k3s.io/v1-release/channels/stable
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
  channel: https://update.k3s.io/v1-release/channels/stable
```

There are a few important things to call out regarding these plans:

1. The plans must be created in the same namespace where the controller was deployed.
2. The `concurrency` field indicates how many nodes can be upgraded at the same time. 
3. The server-plan targets server nodes by specifying a label selector that selects nodes with the `node-role.kubernetes.io/control-plane` label. The agent-plan targets agent nodes by specifying a label selector that select nodes without that label.
4. The `prepare` step in the agent-plan will cause upgrade jobs for that plan to wait for the server-plan to complete before they execute. This logic is built into the image used for the prepare step, and is not part of system-upgrade-controller itself.
5. Both plans have the `channel` field set to the stable release channel URL. This will cause the controller to monitor that URL and upgrade the cluster any time it resolves to a new release. This works well with the [release channels](manual.md#release-channels). Thus, you can configure your plans with the following channel to ensure your cluster is always automatically upgraded to the newest stable release of K3s. Alternatively, you can omit the `channel` field and set the `version` field to a specific release of K3s:
   ```yaml
   apiVersion: upgrade.cattle.io/v1
   kind: Plan
   # ...
   spec:
     # ...
     version: v1.33.4+k3s1
   ```

The upgrade will begin as soon as the controller detects the target version for a plan has been resolved, either from the version field, or by polling the channel server.
Modifying a plan will cause the controller to re-evaluate the plan and determine if another upgrade is needed.
If a channel has been configured, the URL is also polled periodically to check for new versions.

You can monitor the progress of an upgrade by viewing the plan and jobs via kubectl:
```bash
kubectl -n system-upgrade get plans -o wide
kubectl -n system-upgrade get jobs
```

### Scheduling Upgrades

Plans can be restricted to occurring within a specific time window by setting the `window` field within the plan spec.
The time window fields are compatible with and take the same format as [kured schedule options](https://kured.dev/docs/configuration/#setting-a-schedule).
For example:
```yaml
apiVersion: upgrade.cattle.io/v1
kind: Plan
# ...
spec:
  # ...
  window:
    days:
      - monday
      - tuesday
      - wednesday
      - thursday
      - friday
    startTime: 19:00
    endTime: 21:00
    timeZone: UTC
```

Jobs to execute upgrades for a plan will not be created outside the time window. Once jobs are created, may continue running once the window has closed.

## Downgrade Prevention

:::info Version Gate
Starting with the 2023-07 releases ([v1.27.4+k3s1](https://github.com/k3s-io/k3s-upgrade/releases/tag/v1.27.4%2Bk3s1), [v1.26.7+k3s1](https://github.com/k3s-io/k3s-upgrade/releases/tag/v1.26.7%2Bk3s1), [v1.25.12+k3s1](https://github.com/k3s-io/k3s-upgrade/releases/tag/v1.25.12%2Bk3s1), [v1.24.16+k3s1](https://github.com/k3s-io/k3s-upgrade/releases/tag/v1.24.16%2Bk3s1))
:::

Kubernetes does not support downgrades of control-plane components. The k3s-upgrade image used by upgrade plans will refuse to downgrade K3s, failing the plan. Nodes with `cordon: true` configured in their plan will stay cordoned following the failure.

Here is an example cluster, showing failed upgrade pods and cordoned nodes:

```shell-session
$ kubectl get pods -n system-upgrade
NAME                                                              READY   STATUS    RESTARTS   AGE
apply-k3s-server-on-ip-172-31-0-16-with-7af95590a5af8e8c3-2cdc6   0/1     Error     0          9m25s
apply-k3s-server-on-ip-172-31-10-23-with-7af95590a5af8e8c-9xvwg   0/1     Error     0          14m
apply-k3s-server-on-ip-172-31-13-213-with-7af95590a5af8e8-8j72v   0/1     Error     0          18m
system-upgrade-controller-7c4b84d5d9-kkzr6                        1/1     Running   0          20m
$ kubectl get nodes
NAME               STATUS                     ROLES                       AGE   VERSION
ip-172-31-0-16     Ready,SchedulingDisabled   control-plane,etcd,master   19h   v1.27.4+k3s1
ip-172-31-10-23    Ready,SchedulingDisabled   control-plane,etcd,master   19h   v1.27.4+k3s1
ip-172-31-13-213   Ready,SchedulingDisabled   control-plane,etcd,master   19h   v1.27.4+k3s1
ip-172-31-2-13     Ready                      <none>                      19h   v1.27.4+k3s1
```

You can return your cordoned nodes to service by either of the following methods:
* Change the version or channel on your plan to target a release that is the same or newer than what is currently running on the cluster, so that the plan succeeds.
* Delete the plan and manually uncordon the nodes.
  Use `kubectl get plan -n system-upgrade` to find the plan name, then `kubectl delete plan -n system-upgrade PLAN_NAME` to delete it. Once the plan has been deleted, use `kubectl uncordon NODE_NAME` to uncordon each of the nodes.

## Security
The upgrade job that is launched must be highly privileged in order to effect change to the underlying nodes. By default, it is configured with the following:
- Host `IPC`, `NET`, and `PID` namespaces
- The `CAP_SYS_BOOT` capability
- Host root mounted at `/host` with read and write permissions

