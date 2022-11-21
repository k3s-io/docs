---
title: "网络"
weight: 35
---

本文介绍了 CoreDNS、Traefik Ingress controller 和 Klipper service load balancer 是如何在 K3s 中工作的。

有关 Flannel 配置选项和后端选择，以及如何设置自己的 CNI，请参阅[安装网络选项](installation/network-options.md)页面。

有关 K3s 需要开放哪些端口，请参阅[要求](installation/requirements.md#网络)。

- [CoreDNS](#coredns)
- [Traefik Ingress Controller](#traefik-ingress-controller)
- [Service Load Balancer](#service-load-balancer)
   - [Service LB 工作原理](#service-lb-工作原理)
   - [用法](#用法)
   - [从节点中排除 Service LB](#从节点中排除-service-lb)
   - [禁用 Service LB](#禁用-service-lb)
- [没有主机名的节点](#没有主机名的节点)

## CoreDNS

CoreDNS 在 agent 启动时部署。要禁用它，请使用 `--disable coredns` 选项来运行每个 server。

如果你不安装 CoreDNS，则需要自己安装集群 DNS 提供程序。

## Traefik Ingress Controller

[Traefik](https://traefik.io/) 是一种现代的 HTTP 反向代理和负载均衡器，可以轻松部署微服务。它在设计、部署和运行应用程序方面简化了网络复杂性。

Traefik 在启动服务器时默认部署。有关详细信息，请参阅[自动部署清单](advanced/advanced.md#自动部署清单)。默认配置文件位于 `/var/lib/rancher/k3s/server/manifests/traefik.yaml`。

Traefik Ingress Controller 将使用主机上的端口 80 和 443（即这些端口不可用于 HostPort 或 NodePort）。

不要手动编辑 `traefik.yaml` 文件，因为 K3s 重新启动后会再次覆盖它。相反，你可以通过在 `/var/lib/rancher/k3s/server/manifests` 中创建其他 `HelmChartConfig` 清单来自定义 Traefik。有关更多详细信息和示例，请参阅[使用 HelmChartConfig 自定义打包组件](helm/helm.md#使用-helmchartconfig-自定义打包组件)。有关配置值的更多信息，请参阅[官方 Traefik Helm 配置参数](https://github.com/traefik/traefik-helm-chart/tree/master/traefik)。

要禁用它，请使用 `--disable traefik` 选项来启动每个 server。

如果没有禁用 Traefik，K3s 1.20 及以前的版本将安装 Traefik v1，而 K3s 1.21 及以后的版本将安装 Traefik v2。

要从较旧的 Traefik v1 实例迁移，请参阅 [Traefik 文档](https://doc.traefik.io/traefik/migration/v1-to-v2/)和[迁移工具](https://github.com/traefik/traefik-migration-tool)。

## Service Load Balancer

你可以在 Kubernetes 集群中使用任何 service load balancer (LB)。K3s 提供了一个 Load Balancer，称为 [Klipper Load Balancer](https://github.com/k3s-io/klipper-lb)，它使用可用的主机端口。

上游 Kubernetes 允许创建 LoadBalancer 类型的 Service，但不包括 LB 的实现。某些 LB Service 需要云提供商，例如 Amazon EC2 或 Microsoft Azure。相比之下，K3s service LB 使你可以在没有云提供商的情况下使用 LB service。

### Service LB 的工作原理

K3s 创建一个控制器，该控制器为 Service Load Balancer 创建一个 Pod，是一个 [Service](https://kubernetes.io/docs/concepts/services-networking/service/) 类型的 Kubernetes 对象。

对于每个 Service Load Balancer，都会创建一个 [DaemonSet](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/)。DaemonSet 在每个节点上创建一个带有 `svc` 前缀的 Pod。

Service LB 控制器会监听其他 Kubernetes 服务。找到 Service 后，它会在所有节点上使用 DaemonSet 为该 Service 创建一个代理 Pod。这个 Pod 成为另一个 Service 的代理，因此，举个例子，到达节点端口 8000 的请求可以路由到端口 8888 上的工作负载。

如果 Service LB 运行在具有外部 IP 的节点上，则使用外部 IP。

如果创建了多个 Service，则会为每个 Service 创建一个单独的 DaemonSet。

只要它们使用不同的端口，就可以在同一个节点上运行多个 Service。

如果你尝试创建一个监听 80 端口的 Service LB，Service LB 将尝试在集群中为 80 端口寻找空闲主机。如果没有该端口可用的主机，则 LB 将停留在 Pending 状态。

### 用法

在 K3s 中创建一个 [LoadBalancer 类型的 Service](https://kubernetes.io/docs/concepts/services-networking/service/#loadbalancer)。

### 从节点中排除 Service LB

要排除节点使用 Service LB，请在不应排除的节点上添加以下标签：

```
svccontroller.k3s.cattle.io/enablelb
```

如果使用了标签，则 Service Load Balancer 仅在有标签的节点上运行。

### 禁用 Service LB

要禁用嵌入式 LB，请使用 `--disable servicelb` 选项运行 Server。

如果你希望运行不同的 LB，例如 MetalLB，这是必要的。

## 没有主机名的节点

一些云提供商（例如 Linode）将创建以 “localhost” 作为主机名的主机，而其他云提供商可能根本没有设置主机名。这可能会导致域名解析出现问题。你可以使用 `--node-name` 标志或 `K3S_NODE_NAME` 环境变量运行 K3s，这会通过传递节点名称来解决此问题。
