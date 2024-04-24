---
title: "Multus and IPAM plugins"
---

[Multus CNI](https://github.com/k8snetworkplumbingwg/multus-cni) is a CNI plugin that enables attaching multiple network interfaces to pods. Multus does not replace CNI plugins, instead it acts as a CNI plugin multiplexer. Multus is useful in certain use cases, especially when pods are network intensive and require extra network interfaces that support dataplane acceleration techniques such as SR-IOV.

Multus can not be deployed standalone. It always requires at least one conventional CNI plugin that fulfills the Kubernetes cluster network requirements. That CNI plugin becomes the default for Multus, and will be used to provide the primary interface for all pods. When deploying K3s with default options, that CNI plugin is Flannel.

To deploy Multus, we recommend using the following helm repo:
```
helm repo add rke2-charts https://rke2-charts.rancher.io
helm repo update
```

Then, to set the necessary configuration for it to work, a correct config file must be created. The configuration will depend on the IPAM plugin to be used, i.e. how your pods using Multus extra interfaces will configure the IPs for those extra interfaces. There are three options: host-local, DHCP Daemon and whereabouts:

<Tabs groupId = "MultusIPAMplugins">
<TabItem value="host-local" default>
The host-local IPAM plugin allocates ip addresses out of a set of address ranges. It stores the state locally on the host filesystem, hence ensuring uniqueness of IP addresses on a single host. Therefore, we don't recommend it for multi-node clusters. This IPAM plugin does not require any extra deployment. For more information: https://www.cni.dev/plugins/current/ipam/host-local/.

To use the host-local plugin, please create a file called `multus-values.yaml` with the following content:
```
config:
  cni_conf:
    confDir: /var/lib/rancher/k3s/agent/etc/cni/net.d
    binDir: /var/lib/rancher/k3s/data/current/bin/
    kubeconfig: /var/lib/rancher/k3s/agent/etc/cni/net.d/multus.d/multus.kubeconfig
```

</TabItem>
<TabItem value="Whereabouts" default>
[Whereabouts](https://github.com/k8snetworkplumbingwg/whereabouts) is an IP Address Management (IPAM) CNI plugin that assigns IP addresses cluster-wide.

To use the Whereabouts IPAM plugin, please create a file called multus-values.yaml with the following content:
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
The dhcp IPAM plugin can be deployed when there is already a DHCP server running on the network. This daemonset takes care of periodically renewing the DHCP lease. For more information please check the official docs of [DHCP IPAM plugin](https://www.cni.dev/plugins/current/ipam/dhcp/).

To use this DHCP plugin, please create a file called multus-values.yaml with the following content:
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

After creating the `multus-values.yaml` file, everything is ready to install Multus:
```
helm install multus rke2-charts/rke2-multus -n kube-system --kubeconfig /etc/rancher/k3s/k3s.yaml --values multus-values.yaml
```

That will create a daemonset called multus which will deploy multus and all regular cni binaries in /var/lib/rancher/k3s/data/current/ (e.g. macvlan) and the correct Multus config in /var/lib/rancher/k3s/agent/etc/cni/net.d

For more information about Multus, refer to the [multus-cni](https://github.com/k8snetworkplumbingwg/multus-cni/tree/master/docs) documentation.
