---
title: Resource Profiling
weight: 1
---

This section captures the results of tests to determine minimum resource requirements for K3s.

The results are summarized as follows:

| Components |  Processor | Min CPU | Min RAM with Kine/SQLite | Min RAM with Embedded etcd |
|------------|-----|----------|-------------------------|---------------------------|
| K3s server with a workload  | Intel 8375C CPU, 2.90 GHz | 6% of a core | 1596 M | 1606 M |
| K3s cluster with a single agent  | Intel 8375C CPU, 2.90 GHz | 5% of a core | 1428 M | 1450 M |
| K3s agent | Intel 8375C CPU, 2.90 GHz | 3% of a core | 275 M | 275 M |
| K3s server with a workload  | Pi4B BCM2711, 1.50 GHz | 30% of a core | 1588 M | 1613 M |
| K3s cluster with a single agent | Pi4B BCM2711, 1.50 GHz | 25% of a core | 1215 M | 1413 M |
| K3s agent  | Pi4B BCM2711, 1.50 GHz | 10% of a core | 268 M | 268 M |

- [Scope of Resource Testing](#scope-of-resource-testing)
- [Components Included for Baseline Measurements](#components-included-for-baseline-measurements)
- [Methodology](#methodology)
- [Environment](#environment)
- [Baseline Resource Requirements](#baseline-resource-requirements)
  - [K3s Server with a Workload](#k3s-server-with-a-workload)
  - [K3s Cluster with a Single Agent](#k3s-cluster-with-a-single-agent)
  - [K3s Agent](#k3s-agent)
- [Analysis](#analysis)
  - [Primary Resource Utilization Drivers](#primary-resource-utilization-drivers)
  - [Preventing Agents and Workloads from Interfering with the Cluster Datastore](#preventing-agents-and-workloads-from-interfering-with-the-cluster-datastore)

## Scope of Resource Testing

The resource tests were intended to address the following problem statements:

- On a single-node cluster, determine the legitimate minimum amount of CPU, memory, and IOPs that should be set aside to run the entire K3s stack server stack, assuming that a real workload will be deployed on the cluster.
- On an agent (worker) node, determine the legitimate minimum amount of CPU, memory, and IOPs that should be set aside for the Kubernetes and K3s control plane components (the kubelet and k3s agent).

## Components Included for Baseline Measurements

The tested components are:

* K3s v1.26.5 with all packaged components enabled
* Prometheus + Grafana monitoring stack
* [Kubernetes Example Nginx Deployment](https://kubernetes.io/docs/tasks/run-application/run-stateless-application-deployment/)

These are baseline figures for a stable system using only K3s packaged components (Traefik Ingress, Klipper lb, local-path storage) running a standard monitoring stack (Prometheus and Grafana) and the Guestbook example app.

Resource figures including IOPS are for the Kubernetes datastore and control plane only, and do not include overhead for system-level management agents or logging, container image management, or any workload-specific requirements. 

## Methodology

A standalone instance of Prometheus v2.43.0 was used to collect host CPU, memory, and disk IO statistics using `prometheus-node-exporter` installed via apt.

`systemd-cgtop` was used to spot-check systemd cgroup-level CPU and memory utilization. `system.slice/k3s.service` tracks resource utilization for both K3s and containerd, while individual pods are under the `kubepods` hierarchy.

Additional detailed K3s memory utilization data was collected from `kubectl top node` using the integrated metrics-server for the server and agent processes.

Utilization figures were based on 95th percentile readings from steady state operation on nodes running the described workloads.

## Environment

| Arch | OS | System | CPU | RAM | Disk | 
|------|----|--------|--|----|------|
| x86_64 | Ubuntu 22.04 | AWS c6id.xlarge | Intel Xeon Platinum 8375C CPU, 4 Core 2.90 GHz | 8 GB | NVME SSD |
| aarch64 | Raspberry Pi OS 11 | Raspberry Pi 4 Model B | BCM2711, 4 Core 1.50 GHz | 8 GB | UHS-III SDXC |


## Baseline Resource Requirements

This section captures the results of tests to determine minimum resource requirements for basic K3s operation.

### K3s Server with a Workload

These are the requirements for a single-node cluster in which the K3s server shares resources with a [simple workload](https://kubernetes.io/docs/tasks/run-application/run-stateless-application-deployment/).

The CPU requirements are:

| System | CPU Core Usage |
|--------|----------------|
| Intel 8375C | 6% of a core |
| Pi4B | 30% of a core |

The Memory Requirements are:

| Tested Datastore | System | Memory |
|-----------|---------|------|
| Kine/SQLite | Intel 8375C | 1596 M | 
|             | Pi4B |  1588 M |
| Embedded etcd | Intel 8375C | 1606 M | 
|               | Pi4B |  1613 M |

The Disk requirements are:

| Tested Datastore | IOPS | KiB/sec | Latency |
|-----------|------|---------|---------|
| Kine/SQLite | 10 | 500     | < 10 ms |
| Embedded etcd | 50 |  250  | < 5 ms  |

### K3s Cluster with a Single Agent

These are the baseline requirements for a K3s cluster with a K3s server node and a K3s agent, but no workload.

#### K3s Server
The CPU requirements are:

| System | CPU Core Usage | 
|--------|----------------|
| Intel 8375C | 5% of a core |
| Pi4B | 25% of a core |

The Memory Requirements are:

| Tested Datastore | System | Memory |
|-----------|---------|------|
| Kine/SQLite | Intel 8375C | 1428 M |
|             | Pi4B |  1215 M |
| Embedded etcd | Intel 8375C | 1450 M |
|               | Pi4B |  1413 M |

### K3s Agent

The requirements are:

| System | CPU Core Usage | RAM |
|--------|----------------|-----|
| Intel 8375C | 3% of a core | 275 M |
| Pi4B | 5% of a core | 268 M |




## Analysis

This section captures what has the biggest impact on K3s server and agent utilization, and how the cluster datastore can be protected from interference from agents and workloads.

### Primary Resource Utilization Drivers

K3s server utilization figures are primarily driven by support of the Kubernetes datastore (kine or etcd), API Server, Controller-Manager, and Scheduler control loops, as well as any management tasks necessary to effect changes to the state of the system. Operations that place additional load on the Kubernetes control plane, such as creating/modifying/deleting resources, will cause temporary spikes in utilization. Using operators or apps that make extensive use of the Kubernetes datastore (such as Rancher or other Operator-type applications) will increase the server's resource requirements. Scaling up the cluster by adding additional nodes or creating many cluster resources will increase the server's resource requirements.

K3s agent utilization figures are primarily driven by support of container lifecycle management control loops. Operations that involve managing images, provisioning storage, or creating/destroying containers will cause temporary spikes in utilization. Image pulls in particular are typically highly CPU and IO bound, as they involve decompressing image content to disk. If possible, workload storage (pod ephemeral storage and volumes) should be isolated from the agent components (/var/lib/rancher/k3s/agent) to ensure that there are no resource conflicts.

### Preventing Agents and Workloads from Interfering with the Cluster Datastore

When running in an environment where the server is also hosting workload pods, care should be taken to ensure that agent and workload IOPS do not interfere with the datastore.

This can be best accomplished by placing the server components (/var/lib/rancher/k3s/server) on a different storage medium than the agent components (/var/lib/rancher/k3s/agent), which include the containerd image store.

Workload storage (pod ephemeral storage and volumes) should also be isolated from the datastore.

Failure to meet datastore throughput and latency requirements may result in delayed response from the control plane and/or failure of the control plane to maintain system state.
