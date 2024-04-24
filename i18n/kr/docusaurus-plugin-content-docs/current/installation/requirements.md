---
title: Requirements
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

:::warning ARM64 Page Size

Prior to May 2023 releases (v1.24.14+k3s1, v1.25.10+k3s1, v1.26.5+k3s1, v1.27.2+k3s1), on `aarch64/arm64` systems, the kernel must use 4k pages. **RHEL9**, **Ubuntu**, **Raspberry PI OS**, and **SLES** all meet this requirement.

:::

## Operating Systems

K3s is expected to work on most modern Linux systems.

Some OSs have additional setup requirements:
<Tabs queryString="os">
<TabItem value="rhel" label="Red Hat Enterprise Linux / CentOS / Fedora">

It is recommended to turn off firewalld:
```bash
systemctl disable firewalld --now
```

If you wish to keep firewalld enabled, by default, the following rules are required:
```bash
firewall-cmd --permanent --add-port=6443/tcp #apiserver
firewall-cmd --permanent --zone=trusted --add-source=10.42.0.0/16 #pods
firewall-cmd --permanent --zone=trusted --add-source=10.43.0.0/16 #services
firewall-cmd --reload
```

Additional ports may need to be opened depending on your setup. See [Inbound Rules](#inbound-rules-for-k3s-nodes) for more information. If you change the default CIDR for pods or services, you will need to update the firewall rules accordingly.

If enabled, it is required to disable nm-cloud-setup and reboot the node:
```bash
systemctl disable nm-cloud-setup.service nm-cloud-setup.timer
reboot
```
</TabItem>
<TabItem value="debian" label="Ubuntu / Debian">

Older Debian release may suffer from a known iptables bug. See [Known Issues](../known-issues.md#iptables).

It is recommended to turn off ufw (uncomplicated firewall):
```bash
ufw disable
```

If you wish to keep ufw enabled, by default, the following rules are required:
```bash
ufw allow 6443/tcp #apiserver
ufw allow from 10.42.0.0/16 to any #pods
ufw allow from 10.43.0.0/16 to any #services
```

Additional ports may need to be opened depending on your setup. See [Inbound Rules](#inbound-rules-for-k3s-nodes) for more information. If you change the default CIDR for pods or services, you will need to update the firewall rules accordingly.
</TabItem>
<TabItem value="pi" label="Raspberry Pi">

Raspberry Pi OS is Debian based, and may suffer from a known iptables bug. See [Known Issues](../known-issues.md#iptables).

Standard Raspberry Pi OS installations do not start with `cgroups` enabled. **K3S** needs `cgroups` to start the systemd service. `cgroups`can be enabled by appending `cgroup_memory=1 cgroup_enable=memory` to `/boot/cmdline.txt`.

Example cmdline.txt:
```
console=serial0,115200 console=tty1 root=PARTUUID=58b06195-02 rootfstype=ext4 elevator=deadline fsck.repair=yes rootwait cgroup_memory=1 cgroup_enable=memory
```

Starting with Ubuntu 21.10, vxlan support on Raspberry Pi has been moved into a separate kernel module. 
```bash
sudo apt install linux-modules-extra-raspi
```
</TabItem>
</Tabs>

For more information on which OSs were tested with Rancher managed K3s clusters, refer to the [Rancher support and maintenance terms.](https://rancher.com/support-maintenance-terms/)

## Hardware

Hardware requirements scale based on the size of your deployments. Minimum recommendations are outlined here.

| Spec | Minimum | Recommended |
|------|---------|-------------|
| CPU  | 1 core      | 2 cores          |
| RAM  | 512 MB  | 1 GB        |

[Resource Profiling](../reference/resource-profiling.md) captures the results of tests to determine minimum resource requirements for the K3s agent, the K3s server with a workload, and the K3s server with one agent. It also contains analysis about what has the biggest impact on K3s server and agent utilization, and how the cluster datastore can be protected from interference from agents and workloads.

:::info Raspberry Pi and embedded etcd
If deploying K3s with embedded etcd on a Raspberry Pi, it is recommended that you use an external SSD. etcd is write intensive, and SD cards cannot handle the IO load.
:::

#### Disks

K3s performance depends on the performance of the database. To ensure optimal speed, we recommend using an SSD when possible. Disk performance will vary on ARM devices utilizing an SD card or eMMC.

## Networking

The K3s server needs port 6443 to be accessible by all nodes.

The nodes need to be able to reach other nodes over UDP port 8472 when using the Flannel VXLAN backend, or over UDP port 51820 (and 51821 if IPv6 is used) when using the Flannel WireGuard backend. The node should not listen on any other port. K3s uses reverse tunneling such that the nodes make outbound connections to the server and all kubelet traffic runs through that tunnel. However, if you do not use Flannel and provide your own custom CNI, then the ports needed by Flannel are not needed by K3s.

If you wish to utilize the metrics server, all nodes must be accessible to each other on port 10250.

If you plan on achieving high availability with embedded etcd, server nodes must be accessible to each other on ports 2379 and 2380.

:::tip Important
The VXLAN port on nodes should not be exposed to the world as it opens up your cluster network to be accessed by anyone. Run your nodes behind a firewall/security group that disables access to port 8472.
:::

:::danger
Flannel relies on the [Bridge CNI plugin](https://www.cni.dev/plugins/current/main/bridge/) to create a L2 network that switches traffic. Rogue pods with `NET_RAW` capabilities can abuse that L2 network to launch attacks such as [ARP spoofing](https://static.sched.com/hosted_files/kccncna19/72/ARP%20DNS%20spoof.pdf). Therefore, as documented in the [Kubernetes docs](https://kubernetes.io/docs/concepts/security/pod-security-standards/), please set a restricted profile that disables `NET_RAW` on non-trustable pods.
:::

### Inbound Rules for K3s Nodes

| Protocol | Port      | Source    | Destination | Description
|----------|-----------|-----------|-------------|------------
| TCP      | 2379-2380 | Servers   | Servers     | Required only for HA with embedded etcd
| TCP      | 6443      | Agents    | Servers     | K3s supervisor and Kubernetes API Server
| UDP      | 8472      | All nodes | All nodes   | Required only for Flannel VXLAN
| TCP      | 10250     | All nodes | All nodes   | Kubelet metrics
| UDP      | 51820     | All nodes | All nodes   | Required only for Flannel Wireguard with IPv4
| UDP      | 51821     | All nodes | All nodes   | Required only for Flannel Wireguard with IPv6
| TCP      | 5001      | All nodes | All nodes   | Required only for embedded distributed registry (Spegel)
| TCP      | 6443      | All nodes | All nodes   | Required only for embedded distributed registry (Spegel)

Typically, all outbound traffic is allowed.

Additional changes to the firewall may be required depending on the OS used.

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

K3s supports different databases including MySQL, PostgreSQL, MariaDB, and etcd.  See [Cluster Datastore](../datastore/datastore.md) for more info.

The following is a sizing guide for the database resources you need to run large clusters:

| Deployment Size |   Nodes   | VCPUS |  RAM  |
|:---------------:|:---------:|:-----:|:-----:|
|      Small      |  Up to 10 |   1   |  2 GB |
|      Medium     | Up to 100 |   2   |  8 GB |
|      Large      | Up to 250 |   4   | 16 GB |
|     X-Large     | Up to 500 |   8   | 32 GB |
|     XX-Large    |   500+    |   16  | 64 GB |
