---
title: CLI Tools
weight: 1
---

The K3s binary contains a number of additional tools the help you manage your cluster.

Command | Description
--------|------------------
`k3s server`| Run a K3s server node, which launches the Kubernetes `apiserver`, `scheduler`, `controller-manager`, and `cloud-controller-manager` components, in addition a datastore and the agent components. See the [`k3s server` command documentation](server.md) for more information.
`k3s agent`|  Run the K3s agent node, which launches `containerd`, `flannel`, `kube-router` network policy controller, and the Kubernetes `kubelet` and `kube-proxy` components. See the [`k3s agent` command documentation](agent.md) for more information.
`k3s kubectl`| Run the embedded [`kubectl` command](https://kubernetes.io/docs/reference/kubectl). This is a CLI for interacting with the Kubernetes apiserver.  If the `KUBECONFIG` environment variable is not set, this will automatically attempt to use the kubeconfig at `/etc/rancher/k3s/k3s.yaml`.
`k3s crictl`| Run the embedded [`crictl` command](https://github.com/kubernetes-sigs/cri-tools/blob/master/docs/crictl.md). This is a CLI for interacting with Kubernetes's container runtime interface (CRI). Useful for debugging.
`k3s ctr`| Run the embedded [`ctr` command](https://github.com/projectatomic/containerd/blob/master/docs/cli.md). This is a CLI for containerd, the container daemon used by K3s. Useful for debugging.
`k3s token` | Manage bootstrap tokens. See the [`k3s token` command documentation](token.md) for more information.
`k3s etcd-snapshot` | Perform on demand backups of the K3s cluster data and upload to S3. See the [`k3s etcd-snapshot` command documentation](etcd-snapshot.md) for more information.
`k3s secrets-encrypt` | Configure K3s to encrypt secrets when storing them in the cluster. See the [`k3s secrets-encrypt` command documentation](secrets-encrypt.md) for more information.
`k3s certificate` | Manage K3s certificates. See the [`k3s certificate` command documentation](certificate.md) for more information.
`k3s completion` | Generate shell completion scripts for k3s
`k3s help`| Shows a list of commands or help for one command
