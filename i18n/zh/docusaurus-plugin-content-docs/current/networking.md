---
title: "网络"
---

本文介绍了 CoreDNS、Traefik Ingress controller 和 Klipper service load balancer 是如何在 K3s 中工作的。

有关 Flannel 配置选项和后端选择，以及如何设置自己的 CNI，请参阅[安装网络选项](./installation/network-options/network-options.md)页面。

有关 K3s 需要开放哪些端口，请参考[网络要求](./installation/requirements.md#网络)。

## CoreDNS

CoreDNS 在 Server 启动时自动部署。要禁用它，请使用 `--disable=coredns` 选项来配置集群中的所有 Server。

如果你不安装 CoreDNS，则需要自己安装集群 DNS 提供程序。

## Traefik Ingress Controller

[Traefik](https://traefik.io/) 是一种现代的 HTTP 反向代理和负载均衡器，可以轻松部署微服务。它在设计、部署和运行应用程序方面简化了网络复杂性。

Traefik Ingress Controller 部署了一个使用端口 80 和 443 的 LoadBalancer Service。默认情况下，ServiceLB 将在所有集群成员上公开这些端口，换言之，这些端口无法用于其他 HostPort 或 NodePort pod。

Traefik 在启动服务器时默认部署。有关详细信息，请参阅[管理打包组件](./installation/packaged-components.md)。默认配置文件位于 `/var/lib/rancher/k3s/server/manifests/traefik.yaml`。

不要手动编辑 `traefik.yaml` 文件，因为 K3s 会在启动时使用默认值替换该文件。相反，你需要通过在 `/var/lib/rancher/k3s/server/manifests` 中创建其他 `HelmChartConfig` 清单来自定义 Traefik。有关更多详细信息和示例，请参阅[使用 HelmChartConfig 自定义打包组件](./helm.md#使用-helmchartconfig-自定义打包组件)。有关配置值的更多信息，请参阅[官方 Traefik Helm 配置参数](https://github.com/traefik/traefik-helm-chart/tree/master/traefik)。

要从集群中删除 Traefik，请使用 `--disable=traefik` 标志来启动所有 Server。

K3s 1.20 及更早版本包括了 Traefik v1。除非找到现有的 Traefik v1（在这种情况下，Traefik 不会升级到 v2），否则 K3s 1.21 及更高版本将安装 Traefik v2。有关 K3s 中包含的 Traefik 版本，请参阅版本的发行说明。

要从较旧的 Traefik v1 实例迁移，请参阅 [Traefik 文档](https://doc.traefik.io/traefik/migration/v1-to-v2/)和[迁移工具](https://github.com/traefik/traefik-migration-tool)。

## 网络策略控制器

K3s 包含一个嵌入式网络策略控制器。底层实现是 [kube-router](https://github.com/cloudnativelabs/kube-router) 的 netpol 控制器库（没有其他 kube-router 功能），你可以在[此处](https://github.com/k3s-io/k3s/tree/master/pkg/agent/netpol)找到 netpol。

要禁用它，使用 `--disable-network-policy` 标志来启动每个 server。

:::note
如果 K3s 配置为禁用网络策略控制器，则不会删除网络策略 iptables 规则。要在禁用网络策略控制器后清理配置的 kube-router 网络策略规则，请使用 `k3s-killall.sh` 脚本，或使用 `iptables-save` 和 `iptables-restore`。这些步骤必须在集群中的所有节点上手动执行。
```
iptables-save | grep -v KUBE-ROUTER | iptables-restore
ip6tables-save | grep -v KUBE-ROUTER | ip6tables-restore
```
:::

## Service Load Balancer

任何 LoadBalancer 控制器都可以部署到你的 K3s 集群。默认情况下，K3s 提供一个称为 [ServiceLB](https://github.com/k3s-io/klipper-lb)（以前称为 Klipper LoadBalancer）的负载均衡器，它会使用可用的主机端口。

上游 Kubernetes 允许创建 LoadBalancer 类型的 Service，但不包括默认的负载均衡器实现，因此这些 Service 在安装之前会保持 `pending` 状态。许多托管服务需要 Amazon EC2 或 Microsoft Azure 等云厂商来提供外部负载均衡器实现。相比之下，K3s ServiceLB 可以在没有云厂商或任何额外配置的情况下使用 LoadBalancer Service。

### ServiceLB 的工作原理

ServiceLB 控制器会监视 Kubernetes [Service](https://kubernetes.io/docs/concepts/services-networking/service/)，其中 `spec.type` 字段设置为 `LoadBalancer`。

对于每个 LoadBalancer Service，在 `kube-system` 命名空间中会创建一个 [DaemonSet](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/)。这个 DaemonSet 依次在每个节点上创建带有 `svc-` 前缀的 Pod。这些 Pod 使用 iptables 将流量从 Pod 的 NodePort 转发到 Service 的 ClusterIP 地址和端口。

如果 ServiceLB Pod 在配置了外部 IP 的节点上运行，则该节点的外部 IP 将填充到 Service 的 `status.loadBalancer.ingress` 地址列表中。否则将使用节点的内部 IP。

如果创建了多个 LoadBalancer Service，则会为每个 Service 创建一个单独的 DaemonSet。

只要它们使用不同的端口，就可以在同一个节点上公开多个 Service。

如果你创建一个侦听端口 80 的 LoadBalancer Service，ServiceLB 将尝试在集群中为端口 80 寻找空闲主机。如果没有该端口可用的主机，则 LB 将停留在 Pending 状态。

### 用法

在 K3s 中创建一个 [LoadBalancer 类型的 Service](https://kubernetes.io/docs/concepts/services-networking/service/#loadbalancer)。

### 控制 ServiceLB 节点选择

如果你将 `svccontroller.k3s.cattle.io/enablelb=true` 标签添加到一个或多个节点，ServiceLB 控制器会切换到 allow-list 模式，只有具有该标签的节点才有资格托管 LoadBalancer Pod。未标记的节点将被 ServiceLB 排除。

:::note
默认情况下，节点没有标签。只要所有节点保持未标记状态，所有具有可用端口的节点都将被 ServiceLB 使用。
:::

### 创建 ServiceLB 节点池
要选择特定的节点子集来托管 LoadBalancer 的 pod，请将 `enablelb` 标签添加到所需的节点，并在节点和服务上设置匹配的 `lbpool` 标签值。例如：

1. 使用 `svccontroller.k3s.cattle.io/lbpool=pool1` 和 `svccontroller.k3s.cattle.io/enablelb=true` 标记节点 A 和节点 B
2. 使用 `svccontroller.k3s.cattle.io/lbpool=pool2` 和 `svccontroller.k3s.cattle.io/enablelb=true` 标记节点 C 和节点 D
3. 使用标签 `svccontroller.k3s.cattle.io/lbpool=pool1` 在端口 443 上创建一个 LoadBalancer Service。该 Service 的 DaemonSet 仅将 Pod 部署到节点 A 和节点 B。
4. 使用标签 `svccontroller.k3s.cattle.io/lbpool=pool2` 在端口 443 上创建另一个 LoadBalancer Service。DaemonSet 只会将 Pod 部署到节点 C 和节点 D。

### 禁用 ServiceLB

要禁用 ServiceLB，请使用 `--disable=servicelb` 标记来配置集群中的所有 Server。

如果你希望运行不同的 LB，例如 MetalLB，这是必要的。

## 部署外部 Cloud Controller Manager

为了减少二进制文件的大小，K3s 删除了所有“树内”（内置）云提供程序。相反，K3s 提供了一个嵌入式 Cloud Controller Manager (CCM) 存根，它执行以下操作：
- 根据 `--node-ip` 和 `--node-external-ip` 标志设置节点 InternalIP 和 ExternalIP 地址字段。
- 托管 ServiceLB LoadBalancer 控制器。
- 清除云提供商设置为 `external` 时出现的 `node.cloudprovider.kubernetes.io/uninitialized` 污点。

在部署外部 CCM 之前，你必须使用 `--disable-cloud-controller` 标志启动所有 K3s Server 以禁用嵌入式 CCM。

:::note
如果你禁用了内置 CCM 并且没有正确部署和配置外部替代品，节点将仍然具有污点而且无法调度。
:::

## 没有主机名的节点

一些云提供商（例如 Linode）将创建以 “localhost” 作为主机名的主机，而其他云提供商可能根本没有设置主机名。这可能会导致域名解析出现问题。你可以使用 `--node-name` 标志或 `K3S_NODE_NAME` 环境变量运行 K3s，这会通过传递节点名称来解决此问题。

## 多集群 CIDR（实验性）

:::info 版本

从 v1.26.3+k3s1 开始作为实验功能

:::

:::warning 警告
启用此标志后，网络策略控制器将无法正常工作。
:::

从 `v1.26` 开始，Kubernetes 引入了多集群 CIDR 作为 alpha 功能。(https://github.com/kubernetes/enhancements/tree/master/keps/sig-network/2593-multiple-cluster-cidrs)

你可以使用 `--multi-cluster-cidr` 标志在 K3s Server 上启用此功能，它可用于定义多个集群 CIDR，为每个节点分配 podCIDR，你还可以在已运行的集群上进行扩展。
你可以使用 API 和 `kubectl` 查看 `clustercidr` 资源（使用 `--cluster-cidr` 配置的 CIDR 定义为默认值）。

新的 `clustercidr` 可以如下定义：

```
apiVersion: networking.k8s.io/v1alpha1
kind: ClusterCIDR
metadata:
  name: new-cidr
spec:
  nodeSelector:
    nodeSelectorTerms:
      - matchExpressions:
        - key: kubernetes.io/hostname
          operator: In
          values:
          -  "worker2"
  perNodeHostBits: 8
  ipv4: 10.247.0.0/16
```

与 `nodeSelector` 匹配的节点将使用新定义资源的 podCIDR。

:::note
已拥有 CIDR 的节点无法获得新的 CIDR。你必须移除或重启它。
:::
:::warning 警告
你可以使用 `ipv4` 和 `ipv6` 来定义双栈 CIDR，但 `perNodeHostBits` 是相同的。使用 `--cluster-cidr` 来定义双栈配置时，`kube-controller` 上的 `--node-cidr-mask-size-ipv6` 标志需要具有与 IPv4 相同的大小。
:::
