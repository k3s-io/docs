---
title: "网络服务"
---

本文主要介绍CoreDNS、Traefik Ingress控制器、网络策略控制器和ServiceLB负载均衡控制器在K3s中的工作方式。

有关Flannel配置选项、后端选择以及如何设置自己的CNI，请参考[基本网络选项](./basic-network-options.md) 

有关K3s需要开放哪些端口，请参考[网络需求](../installation/requirements.md#networking)

## CoreDNS

CoreDNS在服务器启动时就会自动部署。如需要禁用CoreDNS，请为集群中所有服务器配置`--disable=coredns`选项。

如果不安装CoreDNS，则需要自行安装集群DNS提供应用。

## Traefik Ingress控制器

[Traefik](https://traefik.io/)是一个现代HTTP反向代理和负载均衡器，旨在简化微服务的部署，其简化程序设计、部署及运行时的网络复杂度。

Traefik Ingress控制器部署了一个负载均衡服务，该服务需要80和443端口。默认情况下，ServiceLB会在集群中的所有成员节点上公开这些端口，这也意味着其他使用HostPort和NodePort的Pod将无法使用这些端口。

服务器启动时，K3s会默认部署Traefik，更多有关信息请参考[Managing Packaged Components](../installation/packaged-components.md)。默认的配置文件在`/var/lib/rancher/k3s/server/manifests/traefik.yaml`。

不要手动编辑traefik.yaml文件，因为K3s会在启动时使用默认内容替换该文件。如果需要自定义Traefik，应在`/var/lib/rancher/k3s/server/manifests`中额外创建一个`HelmChartConfig`清单。有关详细信息和示例，请参阅[使用 HelmChartConfig 自定义打包组件](../add-ons/helm.md#使用-helmchartconfig-自定义打包组件)。有关可用配置项的更多信息，请参阅官方的 [Traefik Helm 配置参数](https://github.com/traefik/traefik-helm-chart/tree/master/traefik)。

如果需要再集群中移除Traefik，请使用`--disable=traefik`参数启动所有服务器。

K3s 1.20及更早版本使用Traefik v1。K3s 1.21及更高版本默认安装Traefik v2；但是，如果检测到已经安装Traefik v1，则不会将其升级到v2。有关特定K3s版本所包含的Traefik版本，请查阅相应版本的发行说明。

如需要从旧版Traefik v1迁移，请参阅[Traefik文档](https://doc.traefik.io/traefik/migrate/v1-to-v2/)和[迁移工具](https://github.com/traefik/traefik-migration-tool)。

## 网络策略控制器

K3s内置了网络策略控制器，其底层采用[kube-router](https://github.com/cloudnativelabs/kube-router)的netpol控制器库，但不包含kube-router的其他功能，相关代码可以在[此处查看](https://github.com/k3s-io/k3s/tree/main/pkg/agent/netpol)。

如果需要禁用网络控制器，使用`--disable-network-policy`参数启动每台服务器。

:::note
如果通过修改K3s配置来禁用网络策略控制器，已有的iptable规则不会被自动删除。在禁用网络控制器后，如需清除已配置的kube-router网络策略，可以使用`k3s-killall.sh`脚本，或者通过`iptables-save`和`iptables-restore`命令，需要手动在集群中的所有节点上执行以下操作：
```
iptables-save | grep -v KUBE-ROUTER | iptables-restore
ip6tables-save | grep -v KUBE-ROUTER | ip6tables-restore
```
:::

## Service负载均衡器

K3s集群中可以部署任意的负载均衡控制器，K3s默认使用[ServiceLB](https://github.com/k3s-io/klipper-lb)（之前为Klipper LoadBalancer）作为负载均衡器，其会使用宿主机上的可用端口。

上游Kubernetes会允许创建LoadBalancer类型的服务，但是其并未包含默认的负载均衡的具体实现，因此在安装负载均衡控制器之前，这些Service会一直保持`Pending`状态。许多托管服务需要像Amazon EC2或Microsoft Azure等云服务商来实现外部的负载均衡。相比之下，K3s ServiceLB则无需云服务商或其他额外的配置。

### ServiceLB的运行原理

ServiceLB会监视`spec.type`字段为`LoadBalancer`的Kubernetes [Services](https://kubernetes.io/docs/concepts/services-networking/service/)。

对于每个LoadBalance Service，ServiceLB会在命名空间`kube-system`中创建一个[DaemonSet](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/)，DaemonSet随后会在每个节点上创建以名称以`svc-`开头的Pod。这些Pod使用iptables将来自该Pod的NodePort的流量转发到Service的ClusterIP的地址和端口。 

如果SerivceLB所在的Pod配置了外部IP，则该节点的外部IP会被写入Service的`status.loadbalancer.ingress`的地址列表，否则就使用节点的内部IP。

如果创建了多个LoadBalancer Services，则每个Service都会单独创建一个DaemonSet。

如果需要在一个节点上暴露多个Service，则需要让Serivce使用不同的端口。

如果尝试创建一个监听80端口的LoadBalancer Service，ServiceLB会在集群中尝试寻找一个80端口尚未被占用的节点。如果没有找到，则负载均衡器会保持Pending状态。

### 使用方式

在K3s中创建一个[LoadBalancer类型的Service](https://kubernetes.io/docs/concepts/services-networking/service/#loadbalancer)。

### 控制ServiceLB的节点选择

在一个或多个节点上添加`svccontroller.k3s.cattle.io/enablelb=true`标签后，ServiceLB控制器会切换到白名单模式，只有添加了该标签的节点才可以托管LoadBalancer Pod，其余的节点将不会被ServiceLB采用。

:::note
默认情况下，节点都不会带有此标签，只有当所有节点都没有此标签时，ServiceLB才会使用所有具有可用端口的节点。
:::

### 创建ServiceLB节点池

如果需要选择一组特定的节点去托管LoadBalancer的Pod，请为组内所有节点添加`enablelb`标签，并且在节点和Service设置相互匹配的`lbpool`标签值，例如：

1. 将节点A和节点B添加`svccontroller.k3s.cattle.io/lbpool=pool1`和`svccontroller.k3s.cattle.io/enablelb=true`标签； 
2. 将节点C和节点D添加`svccontroller.k3s.cattle.io/lbpool=pool2`和`svccontroller.k3s.cattle.io/enablelb=true`标签； 
3. 在443端口上创建一个LoadBalancer Serivce并添加`svccontroller.k3s.cattle.io/lbpool=pool1`标签，则该Service创建的Daemonset只会将Pod部署到节点A和B
4. 在443端口上创建一个LoadBalancer Serivce并添加`svccontroller.k3s.cattle.io/lbpool=pool2`标签，则该Service创建的Daemonset只会将Pod部署到节点C和D

### 禁用ServiceLB

如果需要禁用ServiceLB，可以在集群所有服务器上使用`--disable=servicelb`参数。

如果需要运行其他负载均衡控制器如MetalLB，则必须禁用ServiceLB。

## 部署外部云控制器管理器

K3s为了减少应用体积，移除了所有内置的云服务供应商。作为替代，K3s提供了一个内置的云控制管理器（CCM）stub，负责执行以下操作：
- 根据`node-ip`和`node-external-ip`来设置节点的InternalIP地址和ExternalIP地址字段
- 托管ServiceLB的LoadBalancer控制器
- 清除云服务商设置为`external`时出现的`node.cloudprovider.kubernetes.io/uninitialized`污点

> 这里的stub没有翻译，实在是找不到合适的词语，可以简单理解为一个替代品或者一个临时的替补

如果部署外部CCM，则需要使用`--disable-cloud-controller`参数启动所有K3s服务器来禁用内置的CCM。

:::note
如果禁用了内置的CCM，却没有部署并且正确配置外部替代方案，节点会一直带有污点，并且无法调度工作负载。
:::


