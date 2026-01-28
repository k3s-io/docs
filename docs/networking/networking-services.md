---
title: Networking Services
---

This page explains how CoreDNS, Traefik Ingress controller, Network Policy controller, and ServiceLB load balancer controller work within K3s.

Refer to the [Installation Network Options](./basic-network-options.md) page for details on Flannel configuration options and backend selection, or how to set up your own CNI.

For information on which ports need to be opened for K3s, refer to the [Networking Requirements](../installation/requirements.md#networking).

## CoreDNS

CoreDNS is deployed automatically on server startup. To disable it, configure all servers in the cluster with the `--disable=coredns` option.

If you don't install CoreDNS, you will need to install a cluster DNS provider yourself.

## Traefik Ingress Controller

[Traefik](https://traefik.io/) is a modern HTTP reverse proxy and load balancer made to deploy microservices with ease. It simplifies networking complexity while designing, deploying, and running applications.

The Traefik ingress controller deploys a LoadBalancer Service that uses ports 80 and 443, advertises the LoadBalancer Service's External IPs in the Status of Ingress resources it manages.

By default, ServiceLB will use all nodes in the cluster to host the Traefik LoadBalancer Service, meaning ports 80 and 443 will not be usable for other HostPort or NodePort pods, and Ingress resources' Status will show all cluster members' node IPs.

To restrict the nodes used by Traefik, and by extension the node IPs advertised in the Ingress Status, you can follow the instructions in the [Controlling ServiceLB Node Selection](#controlling-servicelb-node-selection) section below to limit what nodes ServiceLB runs on, or by adding some nodes to a LoadBalancer pool and restricting the Traefik Service to that pool by setting matching labels in the Traefik HelmChartConfig.

Traefik is deployed by default when starting the server. The default chart values can be found in `/var/lib/rancher/k3s/server/manifests/traefik.yaml`, but this file should not be edited manually, as K3s will replace the file with defaults at startup. 
Instead, you should customize Traefik by creating an additional `HelmChartConfig` manifest in `/var/lib/rancher/k3s/server/manifests`.
For more details and an example see [Customizing Packaged Components with HelmChartConfig](../add-ons/helm.md#customizing-packaged-components-with-helmchartconfig).
For more information on the possible configuration values, refer to `values.yaml` of the [Traefik Helm Chart](https://github.com/k3s-io/k3s-charts/tree/main/charts/traefik) included with your version of K3s.

To remove Traefik from your cluster, start all servers with the `--disable=traefik` flag.
For more information, see [Managing Packaged Components](../installation/packaged-components.md).

For details on the specific version of Traefik included with K3s, consult the Release Notes for your version.
* K3s versions starting with **1.32** include Traefik v3. Existing installations of Traefik v2 will be automatically upgraded to v3 when K3s is upgraded.
  Traefik v3 should be compatible with configuration from v2; consult the upstream [v2 to v3 migration](https://doc.traefik.io/traefik/migrate/v2-to-v3/) docs for more information.
* K3s versions **1.21** through **1.31** included Traefik v2, unless an existing installation of Traefik v1 was found, in which case Traefik was not upgraded to v2.
* K3s versions **1.20** and **earlier** included Traefik v1.

## Network Policy Controller

K3s includes an embedded network policy controller. The underlying implementation is [kube-router's](https://github.com/cloudnativelabs/kube-router) netpol controller library (no other kube-router functionality is present) and can be found [here](https://github.com/k3s-io/k3s/tree/main/pkg/agent/netpol). 

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

For each LoadBalancer Service, a [DaemonSet](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/) is created in the `kube-system` namespace. This DaemonSet in turn creates ServiceLB Pods with a `svc-` prefix, on each node. These pods leverage hostPort using the service port, hence they will only be deployed on nodes that have that port available. If there aren't any nodes with that port available, the LB will remain Pending. Note that it is possible to expose multiple Services on the same node, as long as they use different ports.

When the ServiceLB Pod runs on a node that has an external IP configured, the node's external IP is populated into the Service's `status.loadBalancer.ingress` address list with `ipMode: VIP`. Otherwise, the node's internal IP is used.

If the traffic to the external IP is subject to [Network Address Translation (NAT)](https://en.wikipedia.org/wiki/Network_address_translation) - for example in public clouds when using the public IP of the node as external IP - the traffic is routed into the ServiceLB pod via the hostPort. The pod then uses iptables to forward traffic to the Service's ClusterIP address and port. If the traffic is not subject to NAT and instead arrives with destination address matching the LoadBalancer address, traffic is intercepted (normally by kube-proxy iptables chains or ipvs) and forwarded to the Service's ClusterIP address and port.

### Usage

Create a [Service of type LoadBalancer](https://kubernetes.io/docs/concepts/services-networking/service/#loadbalancer) in K3s.

:::warning Known Issue
If external traffic reaches the node using a NAT (e.g. in public clouds) and you require `externalTrafficPolicy=local` for purposes such as client source IP preservation, please do not define the k3s config `node-external-ip` for any of the nodes, as that will not work correctly
:::

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

K3s provides an embedded Cloud Controller Manager (CCM) that does the following:
- Hosts the [ServiceLB](#service-load-balancer) LoadBalancer controller.
- Clears the `node.cloudprovider.kubernetes.io/uninitialized` taint.
- Sets node address fields based on the `--node-ip`, `--node-external-ip`, `--node-internal-dns`, and `--node-external-dns` flags.

Before deploying an external CCM, you must start all K3s servers with the `--disable-cloud-controller` flag to disable the embedded CCM. When using an external CCM, node addresses will be provided by cloud provider instance metadata APIs, instead of the K3s flag values.

:::note
If you disable the built-in CCM and set `--kubelet-arg=cloud-provider=external` without deploying and properly configuring an external substitute, nodes will remain tainted and unschedulable. By default, disabling the built-in CCM prevents K3s from setting the kubelet `cloud-provider` arg, which indicates that no cloud provider is in use. Without any cloud-provider, Node Provider-IDs and External Addresses will not be set.
:::


