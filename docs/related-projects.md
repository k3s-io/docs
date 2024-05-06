---
title: "Related Projects"
---

Projects implementing the K3s distribution are welcome additions to help expand the community. This page will introduce you to a range of projects that are related to K3s and can help you further explore its capabilities and potential applications.

These projects showcase the versatility and adaptability of K3s in various environments, as well as extensions of K3s. All of these these projects are useful in creating large scale High Avaliability (HA) Kubernetes clusters.

## k3s-ansible

For users seeking to bootstrap a multi-node K3s cluster and familiar with ansible, take a look at [k3s-io/k3s-ansible](https://github.com/k3s-io/k3s-ansible) repository. This set of ansible playbooks provides a convenient way to install K3s on your nodes, allowing you to focus on the configuration of your cluster rather than the installation process.

## k3sup

Another project that simplifies the process of setting up a K3s cluster is [k3sup](https://github.com/alexellis/k3sup). This project,written in golang, only requires ssh access to your nodes. It also provides a convenient way to deploy K3s with external datastores, not just the embedded etcd.

## autok3s

Another provisioning tool, [autok3s](https://github.com/cnrancher/autok3s), provides a GUI for provising k3s cluster across a range of cloud providers, VMs, and local machines. This tool is useful for users who prefer a graphical interface for provising K3s clusters. 