---
title: "Networking"
weight: 35
---

This page explains how CoreDNS, the Traefik Ingress controller, and Klipper service load balancer work within K3s.

Refer to the [Installation Network Options](../installation/network-options.md) page for details on Flannel configuration options and backend selection, or how to set up your own CNI.

For information on which ports need to be opened for K3s, refer to the [Networking Requirements](../installation/requirements.md#networking).

## CoreDNS

CoreDNS is deployed automatically on server startup. To disable it, configure all servers in the cluster with the `--disable=coredns` option.

If you don't install CoreDNS, you will need to install a cluster DNS provider yourself.

## Traefik Ingress Controller

[Traefik](https://traefik.io/) is a modern HTTP reverse proxy and load balancer made to deploy microservices with ease. It simplifies networking complexity while designing, deploying, and running applications.

Traefik is deployed by default when starting the server. For more information see [Auto Deploying Manifests](../advanced/advanced.md#auto-deploying-manifests). The default config file is found in `/var/lib/rancher/k3s/server/manifests/traefik.yaml`.

The Traefik ingress controller will use ports 80 and 443 on the host (i.e. these will not be usable for HostPort or NodePort).

The `traefik.yaml` file should not be edited manually, because k3s would overwrite it again once it is restarted. Instead you can customize Traefik by creating an additional `HelmChartConfig` manifest in `/var/lib/rancher/k3s/server/manifests`. For more details and an example see [Customizing Packaged Components with HelmChartConfig](../helm/helm.md#customizing-packaged-components-with-helmchartconfig). For more information on the possible configuration values, refer to the official [Traefik Helm Configuration Parameters.](https://github.com/traefik/traefik-helm-chart/tree/master/traefik).

To disable it, start each server with the `--disable traefik` flag.

If Traefik is not disabled K3s versions 1.20 and earlier will install Traefik v1, while K3s versions 1.21 and later will install Traefik v2 if v1 is not already present.

To migrate from an older Traefik v1 instance please refer to the [Traefik documentation](https://doc.traefik.io/traefik/migration/v1-to-v2/) and [migration tool](https://github.com/traefik/traefik-migration-tool).


## Network Policy Controller

K3s includes an embedded network policy controller. The underlying implementation is [kube-router's](https://github.com/cloudnativelabs/kube-router) netpol controller library (no other kube-router functionality is present) and can be found [here](https://github.com/k3s-io/k3s/tree/master/pkg/agent/netpol). 

To disable it, start each server with the `--disable-network-policy` flag.

## Service Load Balancer

Any service load balancer (LB) can be used in your K3s cluster. By default, K3s provides a load balancer known as [ServiceLB](https://github.com/k3s-io/klipper-lb) (formerly Klipper Load Balancer) that uses available host ports.

Upstream Kubernetes allows Services of type LoadBalancer to be created, but doesn't include a default load balancer implementation, so these services will remain `pending` until one is installed. Many hosted services require a cloud provider such as Amazon EC2 or Microsoft Azure to offer an external load balancer implementation. By contrast, the K3s ServiceLB makes it possible to use LoadBalancer Services without a cloud provider or any additional configuration.

### How the Service LB Works

The ServiceLB controller watches Kubernetes [Services](https://kubernetes.io/docs/concepts/services-networking/service/) with the `spec.type` field set to `LoadBalancer`.

For each LoadBalancer Service, a [DaemonSet](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/) is created in the `kube-system` namespace. This DaemonSet in turn creates Pods with a `svc-` prefix, on each node. These Pods use iptables to forward traffic from the Pod's NodePort, to the Service's ClusterIP address and port.

If the ServiceLB Pod runs on a node that has an external IP configured, the node's external IP is populated into the Service's `status.loadBalancer.ingress` address list. Otherwise, the node's internal IP is used.

If multiple LoadBalancer Services are created, a separate DaemonSet is created for each Service.

It is possible to expose multiple Services on the same node, as long as they use different ports.

If you try to create a LoadBalancer Service that listens on port 80, the ServiceLB will try to find a free host in the cluster for port 80. If no host with that port is available, the LB will remain Pending.

### Usage

Create a [Service of type LoadBalancer](https://kubernetes.io/docs/concepts/services-networking/service/#loadbalancer) in K3s.

### Controlling ServiceLB Node Selection

To exclude nodes from being used by ServiceLB, add the following label to the nodes that should host ServiceLB Pods. All unlabeled nodes will not be used for ServiceLB.

```
svccontroller.k3s.cattle.io/enablelb
```

To select a particular subset of nodes to host pods for a LoadBalancer, set matching annotation values on the Nodes and Service. For example:

1. Label Node A and Node B with `svccontroller.k3s.cattle.io/lbpool=pool1`
2. Label Node C and Node D with `svccontroller.k3s.cattle.io/lbpool=pool2`
3. Create one LoadBalancer Service on port 443 with label `svccontroller.k3s.cattle.io/lbpool=pool1`. The DaemonSet for this service only deploy Pods to Node A and Node B.
4. Create another LoadBalancer Service on port 443 with label `svccontroller.k3s.cattle.io/lbpool=pool2`. The DaemonSet will only deploy Pods to Node C and Node D.

### Disabling the Service LB

To disable the embedded LB, configure all servers in the cluster with the `--disable=servicelb` flag.

This is necessary if you wish to run a different LB, such as MetalLB.

## External Cloud Controller Manager

K3s does not ship with any "in-tree" cloud providers. Instead, K3s ships with a Cloud Controller Manager (CCM) stub that does the following:
- Sets node InternalIP and ExternalIP address fields based on the `--node-ip` and `--node-external-ip` flags.
- Hosts the ServiceLB LoadBalancer controller.
- Clears the `node.cloudprovider.kubernetes.io/uninitialized` taint that is present when the cloud-provider is set to `external` 

In order to use an external CCM, you must start K3s with the `--disable-cloud-controller` flag. Additionally, if you disable the built-in CCM and do not provide an external CCM, nodes will remain tainted and unschedulable.


## Nodes Without a Hostname

Some cloud providers, such as Linode, will create machines with "localhost" as the hostname and others may not have a hostname set at all. This can cause problems with domain name resolution. You can run K3s with the `--node-name` flag or `K3S_NODE_NAME` environment variable and this will pass the node name to resolve this issue.
