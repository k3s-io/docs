---
title: "Multus and IPAM plugins"
---

[Multus CNI](https://github.com/k8snetworkplumbingwg/multus-cni) is a CNI plugin that enables attaching multiple network interfaces to pods. Multus does not replace CNI plugins, instead it acts as a CNI plugin multiplexer. Multus is useful in certain use cases, especially when pods are network intensive and require extra network interfaces that support dataplane acceleration techniques such as SR-IOV.

For more information about Multus, refer to the [multus-cni](https://github.com/k8snetworkplumbingwg/multus-cni/tree/master/docs) documentation.

Multus can not be deployed standalone. It always requires at least one conventional CNI plugin that fulfills the Kubernetes cluster network requirements. That CNI plugin becomes the default for Multus, and will be used to provide the primary interface for all pods. When deploying K3s with default options, that CNI plugin is Flannel.

:::info Version Gate
K3s uses a fixed CNI binary path as of the October 2024 releases: v1.28.15+k3s1, v1.29.10+k3s1, v1.30.6+k3s1, v1.31.2+k3s1.
:::

K3s looks at `$DATA_DIR/data/cni` for CNI plugin binaries. By default this is `/var/lib/rancher/k3s/data/cni`. Additional CNI plugins should be installed to this location.

Prior to the October 2024 releases, CNI binaries were part of the K3s userspace bundle at `$DATA_DIR/data/$HASH/bin`, where the hash is unique to each release of K3s.
This made it difficult to deploy additional CNI plugins, as the path would change every time K3s was upgraded.
If deploying Multus to an older release of K3s, you should use `/var/lib/rancher/k3s/data/current/bin/` as the CNI bin dir, but expect that the plugins will need to be re-deployed whenever K3s is upgraded.

### Deploy with an IPAM plugin

An IP Address Manager (IPAM) plugin is required to assign IP addresses on the extra interfaces created by Multus. One or more IPAMs can be installed; the examples below each show use of a single IPAM plugin but they may be combined as needed.

The helm deployment examples below will deploy a DaemonSet to create Multus pods to install the required CNI binaries in `/var/lib/rancher/k3s/data/cni/` and Multus CNI config in `/var/lib/rancher/k3s/agent/etc/cni/net.d`.

<Tabs groupId = "MultusIPAMplugins">
<TabItem value="host-local" default>
The host-local IPAM plugin allocates ip addresses out of a set of address ranges. It stores the state locally on the host filesystem, hence ensuring uniqueness of IP addresses on a single host. Therefore, we don't recommend it for multi-node clusters. This IPAM plugin does not require any extra deployment. For more information: https://www.cni.dev/plugins/current/ipam/host-local/.

To use the host-local plugin, deploy Multus with the following configuration:
```yaml
apiVersion: helm.cattle.io/v1
kind: HelmChart
metadata:
  name: multus
  namespace: kube-system
spec:
  repo: https://rke2-charts.rancher.io
  chart: rke2-multus
  targetNamespace: kube-system
  valuesContent: |-
    config:
      fullnameOverride: multus
      cni_conf:
        confDir: /var/lib/rancher/k3s/agent/etc/cni/net.d
        binDir: /var/lib/rancher/k3s/data/cni/
        kubeconfig: /var/lib/rancher/k3s/agent/etc/cni/net.d/multus.d/multus.kubeconfig
```

</TabItem>
<TabItem value="Whereabouts" default>
[Whereabouts](https://github.com/k8snetworkplumbingwg/whereabouts) is an IP Address Management (IPAM) CNI plugin that assigns IP addresses cluster-wide.

To use the Whereabouts IPAM plugin, deploy Multus with the following configuration:
```yaml
apiVersion: helm.cattle.io/v1
kind: HelmChart
metadata:
  name: multus
  namespace: kube-system
spec:
  repo: https://rke2-charts.rancher.io
  chart: rke2-multus
  targetNamespace: kube-system
  valuesContent: |-
    config:
      fullnameOverride: multus
      cni_conf:
        confDir: /var/lib/rancher/k3s/agent/etc/cni/net.d
        binDir: /var/lib/rancher/k3s/data/cni/
        kubeconfig: /var/lib/rancher/k3s/agent/etc/cni/net.d/multus.d/multus.kubeconfig
    rke2-whereabouts:
      fullnameOverride: whereabouts
      enabled: true
      cniConf:
        confDir: /var/lib/rancher/k3s/agent/etc/cni/net.d
        binDir: /var/lib/rancher/k3s/data/cni/
```

When using whereabouts on K3s, `configuration_path` must be set to `/var/lib/rancher/k3s/agent/etc/cni/net.d/whereabouts.d/whereabouts.conf` in the NetworkAttachmentDefinition's `ipam` configuration.
For example, when using whereabouts as the IPAM with the macvlan plugin:
```yaml
apiVersion: k8s.cni.cncf.io/v1
kind: NetworkAttachmentDefinition
metadata:
  name: macvlan-whereabouts
spec:
  config: |-
    {
      "cniVersion": "1.0.0",
      "type": "macvlan",
      "master": "eth0",
      "mode": "bridge",
      "ipam": {
        "type": "whereabouts",
        "range": "172.17.0.0/24",
        "gateway": "172.17.0.1",
        "configuration_path": "/var/lib/rancher/k3s/agent/etc/cni/net.d/whereabouts.d/whereabouts.conf"
      }
    }
```

</TabItem>
<TabItem value="Multus DHCP daemon" default>
The dhcp IPAM plugin can be deployed when there is already a DHCP server running on the network. This daemonset takes care of periodically renewing the DHCP lease. For more information please check the official docs of [DHCP IPAM plugin](https://www.cni.dev/plugins/current/ipam/dhcp/).

To use the DHCP plugin, deploy Multus with the following configuration:
```yaml
apiVersion: helm.cattle.io/v1
kind: HelmChart
metadata:
  name: multus
  namespace: kube-system
spec:
  repo: https://rke2-charts.rancher.io
  chart: rke2-multus
  targetNamespace: kube-system
  valuesContent: |-
    config:
      fullnameOverride: multus
      cni_conf:
        confDir: /var/lib/rancher/k3s/agent/etc/cni/net.d
        binDir: /var/lib/rancher/k3s/data/cni/
        kubeconfig: /var/lib/rancher/k3s/agent/etc/cni/net.d/multus.d/multus.kubeconfig
    manifests:
      dhcpDaemonSet: true
```

</TabItem>
</Tabs>

### Using Multus

Once Multus has been deployed, you can create NetworkAttachmentDefinition resources, and reference these in Pod specs to attach additional interfaces.
For example, using the whereabouts example above, you can create an `eth1` interface on a Pod using the `k8s.v1.cni.cncf.io/networks` annotation:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: multus-demo
  labels:
    app: multus-demo
spec:
  replicas: 1
  selector:
    matchLabels:
      app: multus-demo
  template:
    metadata:
      annotations:
        k8s.v1.cni.cncf.io/networks: macvlan-whereabouts@eth1
      labels:
        app: multus-demo
    spec:
      containers:
      - name: shell
        image: docker.io/rancher/mirrored-library-busybox:1.36.1
        imagePullPolicy: IfNotPresent
        command:
          - sleep
          - "3600"
```

See the upstream documentation for additional information and examples.
