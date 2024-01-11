---
slug: /
title: "K3s - Lightweight Kubernetes"
---

Lightweight Kubernetes. Easy to install, half the memory, all in a binary of less than 100 MB.

Great for:

* Edge
* Homelab
* Internet of Things (IoT)
* Continuous Integration (CI)
* Development
* Single board computers (ARM)
* Air-gapped environments
* Embedded K8s
* Situations where a PhD in K8s clusterology is infeasible

# What is K3s?

K3s is a fully compliant Kubernetes distribution with the following enhancements:

* Distributed as a single binary or minimal container image.
* Lightweight datastore based on sqlite3 as the default storage backend. etcd3, MySQL, and Postgres are also available.
* Wrapped in simple launcher that handles a lot of the complexity of TLS and options.
* Secure by default with reasonable defaults for lightweight environments.
* Operation of all Kubernetes control plane components is encapsulated in a single binary and process, allowing K3s to automate and manage complex cluster operations like distributing certificates.
* External dependencies have been minimized; the only requirements are a modern kernel and cgroup mounts.
* Packages the required dependencies for easy "batteries-included" cluster creation:
    * containerd / cri-dockerd container runtime (CRI)
    * Flannel Container Network Interface (CNI)
    * CoreDNS Cluster DNS
    * Traefik Ingress controller
    * ServiceLB Load-Balancer controller
    * Kube-router Network Policy controller
    * Local-path-provisioner Persistent Volume controller
    * Spegel distributed container image registry mirror
    * Host utilities (iptables, socat, etc)

# What's with the name?

We wanted an installation of Kubernetes that was half the size in terms of memory footprint. Kubernetes is a 10-letter word stylized as K8s. So something half as big as Kubernetes would be a 5-letter word stylized as K3s. There is no long form of K3s and no official pronunciation.
