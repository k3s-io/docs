---
title: "Multus 和 IPAM插件"
---

[Multus CNI](https://github.com/k8snetworkplumbingwg/multus-cni) 是一种 CNI 插件，能够为 Pod 挂载多个网络接口。它并不会取代现有的CNI插件，而是充当一个CNI插件多路复用器。Multus在某些场景下十分有用，尤其是网络密集型Pod，这些Pod往往需要额外的网络接口去支持想SR-IOV等数据平面加速技术。

Multus并不能单独部署，它至少需要一个传统的CNI插件以满足Kubernetes集群网络要求，该CNI插件成为Multus的默认插件，并负责为所有Pod提供基础接口。当以默认配置部署k3s时，这个CNI插件就是Flannel。

为了部署Multus，推荐使用以下helm仓库：
```
helm repo add rke2-charts https://rke2-charts.rancher.io
helm repo update
```

接下来，需要创建一个配置文件让Multus正常工作，这个配置方式取决于使用的IPAM插件，换句话说，IPAM插件决定了使用Multus附加网络接口的 Pod 如何为这些额外的网络接口配置ip地址。目前有三种可选方案：host-local、DHCP Daemon 和 Whereabouts。

<Tabs groupId = "MultusIPAMplugins">
<TabItem value="host-local" default>
The host-local IPAM pluginhost-local IPAM插件从一组预设的范围内分配ip地址，该插件将ip分配状态存在宿主机本地文件系统中，进而确保同一宿主机上ip地址的唯一性。因此并不建议在多节点集群中使用该IPAM插件。该IPAM插件并不需要额外的部署操作，更多信息可以参考：https://www.cni.dev/plugins/current/ipam/host-local/ 。

为了使用host-local插件，需要创建`multus-values.yaml`文件并写入以下内容：
```
config:
  cni_conf:
    confDir: /var/lib/rancher/k3s/agent/etc/cni/net.d
    binDir: /var/lib/rancher/k3s/data/current/bin/
    kubeconfig: /var/lib/rancher/k3s/agent/etc/cni/net.d/multus.d/multus.kubeconfig
```

</TabItem>
<TabItem value="Whereabouts" default>
[Whereabouts](https://github.com/k8snetworkplumbingwg/whereabouts) 是一个用于IP地址管理（IPAM）的CNI插件，它可以在集群范围内分配ip地址。

为了使用Whereabouts插件，需要创建`multus-values.yaml`文件并写入以下内容：
```
config:
  cni_conf:
    confDir: /var/lib/rancher/k3s/agent/etc/cni/net.d
    binDir: /var/lib/rancher/k3s/data/current/bin/
    kubeconfig: /var/lib/rancher/k3s/agent/etc/cni/net.d/multus.d/multus.kubeconfig
rke2-whereabouts:
  fullnameOverride: whereabouts
  enabled: true
  cniConf:
    confDir: /var/lib/rancher/k3s/agent/etc/cni/net.d
    binDir: /var/lib/rancher/k3s/data/current/bin/
```

</TabItem>
<TabItem value="Multus DHCP daemon" default>
只有在网络中已经存在运行中的dhcp服务器时才可以使用dhcp插件。Daemonset则会定期负责续订DHCP租约，确保分配ip有效。更多信息可以参考[DHCP IPAM官方文档](https://www.cni.dev/plugins/current/ipam/dhcp/).

为了使用dhcp插件插件，需要创建`multus-values.yaml`文件并写入以下内容：
```
config:
  cni_conf:
    confDir: /var/lib/rancher/k3s/agent/etc/cni/net.d
    binDir: /var/lib/rancher/k3s/data/current/bin/
    kubeconfig: /var/lib/rancher/k3s/agent/etc/cni/net.d/multus.d/multus.kubeconfig
manifests:
  dhcpDaemonSet: true
```

</TabItem>
</Tabs>

在创建`multus-values.yaml`文件后，就可以进行安装Multus了：
```
helm install multus rke2-charts/rke2-multus -n kube-system --kubeconfig /etc/rancher/k3s/k3s.yaml --values multus-values.yaml
```

该命令会创建一个名为Multus的daemonset用于部署Multus以及所有普通CNI插件的二进制文件如macvlan，安装目录在`/var/lib/rancher/k3s/data/current`，同时还会在`/var/lib/rancher/k3s/agent/etc/cni/net.d`中创建正确的Multus配置

更多信息可以参考[multus-cni官方文档](https://github.com/k8snetworkplumbingwg/multus-cni/tree/master/docs)
