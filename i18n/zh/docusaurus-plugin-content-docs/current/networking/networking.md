---
title: "网络"
weight: 35
---

本文介绍了 CoreDNS、Traefik Ingress controller 和 Klipper service load balancer 是如何在 K3s 中工作的。

有关 Flannel 配置选项和后端选择，以及如何设置自己的 CNI，请参阅[安装网络选项](../installation/network-options.md)页面。

有关 K3s 需要开放哪些端口，请参考[网络要求](../installation/requirements.md#网络)。

## CoreDNS

CoreDNS 在 Server 启动时自动部署。要禁用它，请使用 `--disable=coredns` 选项来配置集群中的所有 Server。

如果你不安装 CoreDNS，则需要自己安装集群 DNS 提供程序。

## Traefik Ingress Controller

[Traefik](https://traefik.io/) 是一种现代的 HTTP 反向代理和负载均衡器，可以轻松部署微服务。它在设计、部署和运行应用程序方面简化了网络复杂性。

Traefik 在启动服务器时默认部署。有关详细信息，请参阅[自动部署清单](../advanced/advanced.md#自动部署清单)。默认配置文件位于 `/var/lib/rancher/k3s/server/manifests/traefik.yaml`。

Traefik Ingress Controller 将使用主机上的端口 80 和 443（即这些端口不可用于 HostPort 或 NodePort）。

不要手动编辑 `traefik.yaml` 文件，因为 K3s 重新启动后会再次覆盖它。相反，你可以通过在 `/var/lib/rancher/k3s/server/manifests` 中创建其他 `HelmChartConfig` 清单来自定义 Traefik。有关更多详细信息和示例，请参阅[使用 HelmChartConfig 自定义打包组件](../helm/helm.md#使用-helmchartconfig-自定义打包组件)。有关配置值的更多信息，请参阅[官方 Traefik Helm 配置参数](https://github.com/traefik/traefik-helm-chart/tree/master/traefik)。

要禁用它，请使用 `--disable traefik` 选项来启动每个 server。

如果没有禁用 Traefik，K3s 1.20 及以前的版本将安装 Traefik v1，而 K3s 1.21 及以后的版本将安装 Traefik v2。

要从较旧的 Traefik v1 实例迁移，请参阅 [Traefik 文档](https://doc.traefik.io/traefik/migration/v1-to-v2/)和[迁移工具](https://github.com/traefik/traefik-migration-tool)。

## Service Load Balancer

任何 Service Load Balancer (LB) 都可以在你的 K3s 集群中使用。默认情况下，K3s 提供一个称为 [ServiceLB](https://github.com/k3s-io/klipper-lb)（以前称为 Klipper Load Balancer）的负载均衡器，它会使用可用的主机端口。

上游 Kubernetes 允许创建 LoadBalancer 类型的 Service，但不包括默认的负载均衡器实现，因此这些 Service 在安装之前会保持 `pending` 状态。许多托管服务需要 Amazon EC2 或 Microsoft Azure 等云厂商来提供外部负载均衡器实现。相比之下，K3s ServiceLB 可以在没有云厂商或任何额外配置的情况下使用 LoadBalancer Service。

### Service LB 的工作原理

ServiceLB 控制器会监视 Kubernetes [Service](https://kubernetes.io/docs/concepts/services-networking/service/)，其中 `spec.type` 字段设置为 `LoadBalancer`。

对于每个 LoadBalancer Service，在 `kube-system` 命名空间中会创建一个 [DaemonSet](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/)。这个 DaemonSet 依次在每个节点上创建带有 `svc-` 前缀的 Pod。这些 Pod 使用 iptables 将流量从 Pod 的 NodePort 转发到 Service 的 ClusterIP 地址和端口。

如果 ServiceLB Pod 在配置了外部 IP 的节点上运行，则该节点的外部 IP 将填充到 Service 的 `status.loadBalancer.ingress` 地址列表中。否则将使用节点的内部 IP。

如果创建了多个 LoadBalancer Service，则会为每个 Service 创建一个单独的 DaemonSet。

只要它们使用不同的端口，就可以在同一个节点上公开多个 Service。

如果你创建一个侦听端口 80 的 LoadBalancer Service，ServiceLB 将尝试在集群中为端口 80 寻找空闲主机。如果没有该端口可用的主机，则 LB 将停留在 Pending 状态。

### 用法

在 K3s 中创建一个 [LoadBalancer 类型的 Service](https://kubernetes.io/docs/concepts/services-networking/service/#loadbalancer)。

### 控制 ServiceLB 节点选择

要排除 ServiceLB 使用的节点，请将以下标签添加到托管 ServiceLB Pod 的节点。所有未标记的节点都不会用于 ServiceLB。

```
svccontroller.k3s.cattle.io/enablelb
```

要选择特定的节点子集来托管 LoadBalancer 的 pod，请在节点和 Service 上设置匹配的注释值。例如：

1. 使用 `svccontroller.k3s.cattle.io/lbpool=pool1` 标记节点 A 和节点 B
2. 使用 `svccontroller.k3s.cattle.io/lbpool=pool2` 标记节点 C 和节点 D
3. 使用标签 `svccontroller.k3s.cattle.io/lbpool=pool1` 在端口 443 上创建一个 LoadBalancer Service。该 Service 的 DaemonSet 仅将 Pod 部署到节点 A 和节点 B。
4. 使用标签 `svccontroller.k3s.cattle.io/lbpool=pool2` 在端口 443 上创建另一个 LoadBalancer Service。DaemonSet 只会将 Pod 部署到节点 C 和节点 D。

### 禁用 Service LB

要禁用嵌入式 LB，请使用 `--disable=servicelb` 选项来配置集群中的所有 Server。

如果你希望运行不同的 LB，例如 MetalLB，这是必要的。

## 没有主机名的节点

一些云提供商（例如 Linode）将创建以 “localhost” 作为主机名的主机，而其他云提供商可能根本没有设置主机名。这可能会导致域名解析出现问题。你可以使用 `--node-name` 标志或 `K3S_NODE_NAME` 环境变量运行 K3s，这会通过传递节点名称来解决此问题。
