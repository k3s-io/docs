---
title: Cluster Access
---

The admin kubeconfig file stored at `/etc/rancher/k3s/k3s.yaml` can be used to provide access to the Kubernetes cluster.
This file grants access as the `system:admin` user and `system:masters` group, which are hardcoded by Kubernetes to have unrestricted access to all resources within the cluster.

The `kubectl` command that comes with K3s has been configured to load configuration from this path by default.
If you have installed upstream Kubernetes command line tools such as kubectl or helm you will need to configure them with the correct kubeconfig path.
This can be done by either exporting the `KUBECONFIG` environment variable or by invoking the `--kubeconfig` command line flag.
Refer to the examples below for details.

* Export the KUBECONFIG environment variable:
  ```bash
  export KUBECONFIG=/etc/rancher/k3s/k3s.yaml
  kubectl get pods --all-namespaces
  helm ls --all-namespaces
  ```
* Specify the location of the kubeconfig file in the command:
  ```bash
  kubectl --kubeconfig /etc/rancher/k3s/k3s.yaml get pods --all-namespaces
  helm --kubeconfig /etc/rancher/k3s/k3s.yaml ls --all-namespaces
  ```

### Accessing the Cluster from Outside with kubectl

Copy `/etc/rancher/k3s/k3s.yaml` on your machine located outside the cluster as `~/.kube/config`.
Then replace the value of the `server` field with the IP or name of your K3s server. 
`kubectl` can now manage your K3s cluster.

:::info
K3s will automatically update the certificates within the admin kubeconfig every time it starts.
If you make a copy of this file, you will need to manually update those copies to ensure that the inline certificates do not expire.
:::
