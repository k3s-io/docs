---
title: Requirements
weight: 1
---

K3s is very lightweight, but has some minimum requirements as outlined below.

Whether you're configuring K3s to run in a container or as a native Linux service, each node running K3s should meet the following minimum requirements. These requirements are baseline for K3s and its packaged components, and do not include resources consumed by the workload itself.

## Prerequisites

Two nodes cannot have the same hostname.

If multiple nodes will have the same hostname, or if hostnames may be reused by an automated provisioning system, use the `--with-node-id` option to append a random suffix for each node, or devise a unique name to pass with `--node-name` or `$K3S_NODE_NAME` for each node you add to the cluster.

## Architecture

K3s is available for the following architectures:
- x86_64
- armhf
- arm64/aarch64
- s390x

On `aarch64/arm64` systems, the OS must use a 4k page size. **RHEL9**, **Ubuntu**, and **SLES** all meet this requirement.


## Operating Systems

K3s is expected to work on most modern Linux systems.

Some OSs have specific requirements:

- If you are using **(Red Hat/CentOS) Enterprise Linux**, follow [these steps](../advanced/advanced.md#red-hat-enterprise-linux--centos) for additional setup.
- If you are using **Raspberry Pi OS**, follow [these steps](../advanced/advanced.md#raspberry-pi) to switch to legacy iptables.

For more information on which OSs were tested with Rancher managed K3s clusters, refer to the [Rancher support and maintenance terms.](https://rancher.com/support-maintenance-terms/)

## Hardware

Hardware requirements scale based on the size of your deployments. Minimum recommendations are outlined here.

| Spec | Minimum | Recommended |
|------|---------|-------------|
| CPU  | 1 core      | 2 cores          |
| RAM  | 512 MB  | 1 GB        |

[Resource Profiling](../reference/resource-profiling.md) captures the results of tests to determine minimum resource requirements for the K3s agent, the K3s server with a workload, and the K3s server with one agent. It also contains analysis about what has the biggest impact on K3s server and agent utilization, and how the cluster datastore can be protected from interference from agents and workloads.

#### Disks

K3s performance depends on the performance of the database. To ensure optimal speed, we recommend using an SSD when possible. Disk performance will vary on ARM devices utilizing an SD card or eMMC.

## Networking

The K3s server needs port 6443 to be accessible by all nodes.

The nodes need to be able to reach other nodes over UDP port 8472 when Flannel VXLAN is used or over UDP ports 51820 and 51821 (when using IPv6) when Flannel Wireguard backend is used. The node should not listen on any other port. K3s uses reverse tunneling such that the nodes make outbound connections to the server and all kubelet traffic runs through that tunnel. However, if you do not use Flannel and provide your own custom CNI, then the ports needed by Flannel are not needed by K3s.

If you wish to utilize the metrics server, all nodes must be accessible to each other on port 10250.

If you plan on achieving high availability with embedded etcd, server nodes must be accessible to each other on ports 2379 and 2380.

:::tip Important
The VXLAN port on nodes should not be exposed to the world as it opens up your cluster network to be accessed by anyone. Run your nodes behind a firewall/security group that disables access to port 8472.
:::

:::danger
Flannel relies on the [Bridge CNI plugin](https://www.cni.dev/plugins/current/main/bridge/) to create a L2 network that switches traffic. Rogue pods with `NET_RAW` capabilities can abuse that L2 network to launch attacks such as [ARP spoofing](https://static.sched.com/hosted_files/kccncna19/72/ARP%20DNS%20spoof.pdf). Therefore, as documented in the [Kubernetes docs](https://kubernetes.io/docs/concepts/security/pod-security-standards/), please set a restricted profile that disables `NET_RAW` on non-trustable pods.
:::

### Inbound Rules for K3s Server Nodes

| Protocol | Port      | Source    | Destination | Description
|----------|-----------|-----------|-------------|------------
| TCP      | 2379-2380 | Servers   | Servers     | Required only for HA with embedded etcd
| TCP      | 6443      | Agents    | Servers     | K3s supervisor and Kubernetes API Server
| UDP      | 8472      | All nodes | All nodes   | Required only for Flannel VXLAN
| TCP      | 10250     | All nodes | All nodes   | Kubelet metrics
| UDP      | 51820     | All nodes | All nodes   | Required only for Flannel Wireguard with IPv4
| UDP      | 51821     | All nodes | All nodes   | Required only for Flannel Wireguard with IPv6

Typically, all outbound traffic is allowed.

Additional changes to the firewall may be required depending on the OS used. See [Additional OS Preparations](../advanced/advanced.md#additional-os-preparations).

## Large Clusters

Hardware requirements are based on the size of your K3s cluster. For production and large clusters, we recommend using a high-availability setup with an external database. The following options are recommended for the external database in production:

- MySQL
- PostgreSQL
- etcd

### CPU and Memory

The following are the minimum CPU and memory requirements for nodes in a high-availability K3s server:

| Deployment Size |   Nodes   | VCPUS |  RAM  |
|:---------------:|:---------:|:-----:|:-----:|
|      Small      |  Up to 10 |   2   |  4 GB |
|      Medium     | Up to 100 |   4   |  8 GB |
|      Large      | Up to 250 |   8   | 16 GB |
|     X-Large     | Up to 500 |   16  | 32 GB |
|     XX-Large    |   500+    |   32  | 64 GB |

### Disks

The cluster performance depends on database performance. To ensure optimal speed, we recommend always using SSD disks to back your K3s cluster. On cloud providers, you will also want to use the minimum size that allows the maximum IOPS.

### Network

You should consider increasing the subnet size for the cluster CIDR so that you don't run out of IPs for the pods. You can do that by passing the `--cluster-cidr` option to K3s server upon starting.

### Database

K3s supports different databases including MySQL, PostgreSQL, MariaDB, and etcd, the following is a sizing guide for the database resources you need to run large clusters:

| Deployment Size |   Nodes   | VCPUS |  RAM  |
|:---------------:|:---------:|:-----:|:-----:|
|      Small      |  Up to 10 |   1   |  2 GB |
|      Medium     | Up to 100 |   2   |  8 GB |
|      Large      | Up to 250 |   4   | 16 GB |
|     X-Large     | Up to 500 |   8   | 32 GB |
|     XX-Large    |   500+    |   16  | 64 GB |

