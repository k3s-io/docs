---
title: K3s 二进制工具
weight: 1
---

K3s 二进制文件包含了很多工具，可帮助你管理集群。

| 命令 | 描述 |
--------|------------------
| `k3s server` | 运行 K3s management server，它还将启动 Kubernetes control plane 组件，例如 API Server、controller-manager 和 scheduler。 |
| `k3s agent` | 运行 K3s node agent。这将使 K3s 作为 Worker 节点运行，同时启动 Kubernetes 节点服务 `kubelet` 和 `kube-proxy`。 |
| `k3s kubectl` | 运行嵌入式 [kubectl](https://kubernetes.io/docs/reference/kubectl) CLI。如果未设置 `KUBECONFIG` 环境变量，这将在启动 K3s Server 节点时自动尝试使用 `/etc/rancher/k3s/k3s.yaml` 配置文件。 |
| `k3s crictl` | 运行嵌入式 [crictl](https://github.com/kubernetes-sigs/cri-tools/blob/master/docs/crictl.md)。这是一个 CLI，用于与 Kubernetes 的容器运行时接口 (CRI) 交互。对调试很有用。 |
| `k3s ctr` | 运行嵌入式 [ctr](https://github.com/projectatomic/containerd/blob/master/docs/cli.md)。这是一个用于 containerd 的 CLI，containerd 是 K3s 使用的容器 daemon。对调试很有用。 |
| `k3s etcd-snapshot` | 对 K3s 集群数据进行按需备份并上传到 S3。有关详细信息，请参阅[备份和恢复](../backup-restore/backup-restore.md#使用嵌入式-etcd-数据存储进行备份和恢复)。 |
| `k3s secrets-encrypt` | 在将 Secret 存储到集群中时加密 Secret。有关详细信息，请参阅 [Secret 加密](../security/secrets-encryption.md)。 |
| `k3s certificate` | 证书管理。有关详细信息，请参阅[证书轮换](../advanced/advanced.md#证书轮换)。 |
| `k3s completion` | 为 K3s 生成 shell 补全脚本 |
| `k3s help` | 显示命令列表或某个命令的帮助 |
