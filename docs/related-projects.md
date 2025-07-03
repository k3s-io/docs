---
title: Related Projects
---

Projects implementing the K3s distribution are welcome additions to help expand the community. These projects help to:

- Explore K3s capabilities and potential applications.
- Extend K3s functionality across different platforms and environments.
- Simplify the process of creating large High Availability (HA) K3s clusters.

## k3s-ansible

For users seeking to bootstrap a multi-node K3s cluster and familiar with ansible, take a look at [k3s-io/k3s-ansible](https://github.com/k3s-io/k3s-ansible) repository. This set of ansible playbooks provides a convenient way to install K3s on your nodes, allowing you to focus on the configuration of your cluster rather than the installation process.

## k3sup

Another project that simplifies the process of setting up a K3s cluster is [k3sup](https://github.com/alexellis/k3sup). This project, written in golang, only requires ssh access to your nodes. It also provides a convenient way to deploy K3s with external datastores, not just the embedded etcd.

## autok3s

Another provisioning tool, [autok3s](https://github.com/cnrancher/autok3s), provides a GUI for provising k3s cluster across a range of cloud providers, VMs, and local machines. This tool is useful for users who prefer a graphical interface for provising K3s clusters. 

## hetzner-k3s

For users who deploy on Hetzner Cloud, take a look at [hetzner-k3s](https://github.com/vitobotta/hetzner-k3s). This CLI tool, written in Crystal, handles the additional steps required to set up a K3s cluster on Hetzner Cloud.
