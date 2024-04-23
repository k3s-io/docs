---
title: CLI 工具
---

K3s 二进制文件包含了很多工具，可帮助你管理集群。

| 命令 | 描述 |
--------|------------------
| `k3s server` | 运行 K3s Server 节点，这将启动 Kubernetes `apiserver`、`scheduler`、`controller-manager` 和 `cloud-controller-manager` 组件，以及数据存储和 Agent 组件。有关详细信息，请参阅 [`k3s server` 命令文档](server.md)。 |
| `k3s agent` | 运行 K3s Agent 节点，这将启动 `containerd`、`flannel`、`kube-router` 网络策略控制器和 Kubernetes `kubelet` 和 `kube-proxy` 组件。有关详细信息，请参阅 [`k3s agent` 命令文档](agent.md)。 |
| `k3s kubectl` | 运行嵌入式 [`kubectl` 命令](https://kubernetes.io/docs/reference/kubectl)。这是用于与 Kubernetes apiserver 交互的 CLI。如果未设置 `KUBECONFIG` 环境变量，将自动尝试使用 `/etc/rancher/k3s/k3s.yaml` 中的 kubeconfig。 |
| `k3s crictl` | 运行嵌入式 [`crictl` 命令](https://github.com/kubernetes-sigs/cri-tools/blob/master/docs/crictl.md)。这是一个 CLI，用于与 Kubernetes 的容器运行时接口 (CRI) 交互。对调试很有用。 |
| `k3s ctr` | 运行嵌入式 [`ctr` 命令](https://github.com/projectatomic/containerd/blob/master/docs/cli.md)。这是一个用于 containerd 的 CLI，containerd 是 K3s 使用的容器 daemon。对调试很有用。 |
| `k3s token` | 管理引导 Token。有关详细信息，请参阅 [`k3s token` 命令文档](token.md)。 |
| `k3s etcd-snapshot` | 对 K3s 集群数据进行按需备份并上传到 S3。有关详细信息，请参阅 [`k3s etcd-snapshot` 命令文档](etcd-snapshot.md)。 |
| `k3s secrets-encrypt` | 在将 Secret 存储到集群中时加密 Secret。有关详细信息，请参阅 [`k3s secrets-encrypt` 命令文档](secrets-encrypt.md)。 |
| `k3s certificate` | 管理 K3s 证书。有关详细信息，请参阅 [`k3s certificate` 命令文档](certificate.md)。 |
| `k3s completion` | 为 K3s 生成 shell 补全脚本 |
| `k3s help` | 显示命令列表或某个命令的帮助 |
