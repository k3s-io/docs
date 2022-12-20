---
title: K3s Binary Tools
weight: 1
---

The K3s binary contains a number of additional tools the help you manage your cluster.

Command | Description
--------|------------------
`k3s server`| Run the K3s management server, which will also launch Kubernetes control plane components such as the API server, controller-manager, and scheduler.
`k3s agent`|  Run the K3s node agent. This will cause K3s to run as a worker node, launching the Kubernetes node services `kubelet` and `kube-proxy`.
`k3s kubectl`| Run an embedded [kubectl](https://kubernetes.io/docs/reference/kubectl) CLI. If the `KUBECONFIG` environment variable is not set, this will automatically attempt to use the config file that is created at `/etc/rancher/k3s/k3s.yaml` when launching a K3s server node.
`k3s crictl`| Run an embedded [crictl](https://github.com/kubernetes-sigs/cri-tools/blob/master/docs/crictl.md). This is a CLI for interacting with Kubernetes's container runtime interface (CRI). Useful for debugging.
`k3s ctr`| Run an embedded [ctr](https://github.com/projectatomic/containerd/blob/master/docs/cli.md). This is a CLI for containerd, the container daemon used by K3s. Useful for debugging.
`k3s etcd-snapshot` | Perform on demand backups of the K3s cluster data and upload to S3. See [Backup and Restore](../backup-restore/backup-restore.md#backup-and-restore-with-embedded-etcd-datastore) for more information.
`k3s secrets-encrypt` | Configure K3s to encrypt secrets when storing them in the cluster. See [Secrets Encryption](../security/secrets-encryption.md) for more information.
`k3s certificate` | Certificates management. See [Certificate Rotation](../advanced/advanced.md#certificate-rotation) for more information.
`k3s completion` | Generate shell completion scripts for k3s
`k3s help`| Shows a list of commands or help for one command
