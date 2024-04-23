---
title: 集群访问
---

`/etc/rancher/k3s/k3s.yaml` 中存储的 kubeconfig 文件用于配置对 Kubernetes 集群的访问。如果你已经安装了上游的 Kubernetes 命令行工具（如 kubectl 或 helm)，你需要用正确的 kubeconfig 路径配置它们。这可以通过导出 `KUBECONFIG` 环境变量或调用 `--kubeconfig` 命令行标志来完成。有关详细信息，请参阅以下示例。

使用 KUBECONFIG 环境变量：

```bash
export KUBECONFIG=/etc/rancher/k3s/k3s.yaml
kubectl get pods --all-namespaces
helm ls --all-namespaces
```

或者在命令中指定 kubeconfig 文件的位置：

```bash
kubectl --kubeconfig /etc/rancher/k3s/k3s.yaml get pods --all-namespaces
helm --kubeconfig /etc/rancher/k3s/k3s.yaml ls --all-namespaces
```

### 使用 kubectl 从外部访问集群

将 `/etc/rancher/k3s/k3s.yaml` 复制到位于集群外部的主机上的 `~/.kube/config`。然后，将 `server` 字段的值替换为你 K3s Server 的 IP 或名称。现在，你可以使用 `kubectl` 来管理 K3s 集群。
