---
title: "Networking Services"
---

This page explains how CoreDNS, Traefik Ingress controller, Network Policy controller, and ServiceLB load balancer controller work within K3s.

Refer to the [Installation Network Options](./basic-network-options.md) page for details on Flannel configuration options and backend selection, or how to set up your own CNI.

For information on which ports need to be opened for K3s, refer to the [Networking Requirements](../installation/requirements.md#networking).

## CoreDNS

CoreDNS is deployed automatically on server startup. To disable it, configure all servers in the cluster with the `--disable=coredns` option.

If you don't install CoreDNS, you will need to install a cluster DNS provider yourself.

## Traefik Ingress Controller

[Traefik](https://traefik.io/) is a modern HTTP reverse proxy and load balancer made to deploy microservices with ease. It simplifies networking complexity while designing, deploying, and running applications.

The Traefik ingress controller deploys a LoadBalancer Service that uses ports 80 and 443. By default, ServiceLB will expose these ports on all cluster members, meaning these ports will not be usable for other HostPort or NodePort pods.

Traefik is deployed by default when starting the server. For more information see [Managing Packaged Components](../installation/packaged-components.md). The default config file is found in `/var/lib/rancher/k3s/server/manifests/traefik.yaml`.

The `traefik.yaml` file should not be edited manually, as K3s will replace the file with defaults at startup. Instead, you should customize Traefik by creating an additional `HelmChartConfig` manifest in `/var/lib/rancher/k3s/server/manifests`. For more details and an example see [Customizing Packaged Components with HelmChartConfig](../helm.md#customizing-packaged-components-with-helmchartconfig). For more information on the possible configuration values, refer to the official [Traefik Helm Configuration Parameters.](https://github.com/traefik/traefik-helm-chart/tree/master/traefik).

To remove Traefik from your cluster, start all servers with the `--disable=traefik` flag.

K3s versions 1.20 and earlier include Traefik v1. K3s versions 1.21 and later install Traefik v2, unless an existing installation of Traefik v1 is found, in which case Traefik is not upgraded to v2. For more information on the specific version of Traefik included with K3s, consult the Release Notes for your version.

To migrate from an older Traefik v1 instance please refer to the [Traefik documentation](https://doc.traefik.io/traefik/migration/v1-to-v2/) and [migration tool](https://github.com/traefik/traefik-migration-tool).

## Network Policy Controller

K3s includes an embedded network policy controller. The underlying implementation is [kube-router's](https://github.com/cloudnativelabs/kube-router) netpol controller library (no other kube-router functionality is present) and can be found [here](https://github.com/k3s-io/k3s/tree/master/pkg/agent/netpol). 

To disable it, start each server with the `--disable-network-policy` flag.

:::note
Network policy iptables rules are not removed if the K3s configuration is changed to disable the network policy controller. To clean up the configured kube-router network policy rules after disabling the network policy controller, use the `k3s-killall.sh` script, or clean them using `iptables-save` and `iptables-restore`. These steps must be run manually on all nodes in the cluster.
```
iptables-save | grep -v KUBE-ROUTER | iptables-restore
ip6tables-save | grep -v KUBE-ROUTER | ip6tables-restore
```
:::

## Service Load Balancer

Any LoadBalancer controller can be deployed to your K3s cluster. By default, K3s provides a load balancer known as [ServiceLB](https://github.com/k3s-io/klipper-lb) (formerly Klipper LoadBalancer) that uses available host ports.

Upstream Kubernetes allows Services of type LoadBalancer to be created, but doesn't include a default load balancer implementation, so these services will remain `pending` until one is installed. Many hosted services require a cloud provider such as Amazon EC2 or Microsoft Azure to offer an external load balancer implementation. By contrast, the K3s ServiceLB makes it possible to use LoadBalancer Services without a cloud provider or any additional configuration.

### How ServiceLB Works

The ServiceLB controller watches Kubernetes [Services](https://kubernetes.io/docs/concepts/services-networking/service/) with the `spec.type` field set to `LoadBalancer`.

For each LoadBalancer Service, a [DaemonSet](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/) is created in the `kube-system` namespace. This DaemonSet in turn creates Pods with a `svc-` prefix, on each node. These Pods use iptables to forward traffic from the Pod's NodePort, to the Service's ClusterIP address and port.

If the ServiceLB Pod runs on a node that has an external IP configured, the node's external IP is populated into the Service's `status.loadBalancer.ingress` address list. Otherwise, the node's internal IP is used.

If multiple LoadBalancer Services are created, a separate DaemonSet is created for each Service.

It is possible to expose multiple Services on the same node, as long as they use different ports.

If you try to create a LoadBalancer Service that listens on port 80, the ServiceLB will try to find a free host in the cluster for port 80. If no host with that port is available, the LB will remain Pending.

### Usage

Create a [Service of type LoadBalancer](https://kubernetes.io/docs/concepts/services-networking/service/#loadbalancer) in K3s.

### Controlling ServiceLB Node Selection

Adding the `svccontroller.k3s.cattle.io/enablelb=true` label to one or more nodes switches the ServiceLB controller into allow-list mode, where only nodes with the label are eligible to host LoadBalancer pods. Nodes that remain unlabeled will be excluded from use by ServiceLB.

:::note
By default, nodes are not labeled. As long as all nodes remain unlabeled, all nodes with ports available will be used by ServiceLB.
:::

### Creating ServiceLB Node Pools
To select a particular subset of nodes to host pods for a LoadBalancer, add the `enablelb` label to the desired nodes, and set matching `lbpool` label values on the Nodes and Services. For example:

1. Label Node A and Node B with `svccontroller.k3s.cattle.io/lbpool=pool1` and `svccontroller.k3s.cattle.io/enablelb=true`
2. Label Node C and Node D with `svccontroller.k3s.cattle.io/lbpool=pool2` and `svccontroller.k3s.cattle.io/enablelb=true`
3. Create one LoadBalancer Service on port 443 with label `svccontroller.k3s.cattle.io/lbpool=pool1`. The DaemonSet for this service only deploy Pods to Node A and Node B.
4. Create another LoadBalancer Service on port 443 with label `svccontroller.k3s.cattle.io/lbpool=pool2`. The DaemonSet will only deploy Pods to Node C and Node D.

### Disabling ServiceLB

To disable ServiceLB, configure all servers in the cluster with the `--disable=servicelb` flag.

This is necessary if you wish to run a different LB, such as MetalLB.

## Deploying an External Cloud Controller Manager

In order to reduce binary size, K3s removes all "in-tree" (built-in) cloud providers. Instead, K3s provides an embedded Cloud Controller Manager (CCM) stub that does the following:
- Sets node InternalIP and ExternalIP address fields based on the `--node-ip` and `--node-external-ip` flags.
- Hosts the ServiceLB LoadBalancer controller.
- Clears the `node.cloudprovider.kubernetes.io/uninitialized` taint that is present when the cloud-provider is set to `external` 

Before deploying an external CCM, you must start all K3s servers with the `--disable-cloud-controller` flag to disable to embedded CCM. 

:::note
If you disable the built-in CCM and do not deploy and properly configure an external substitute, nodes will remain tainted and unschedulable.
:::


