---
title: "高可用嵌入式 etcd"
weight: 40
---

:::caution
嵌入式 etcd (HA) 在速度较慢的磁盘（例如使用 SD 卡运行的 Raspberry Pi）上可能会出现性能问题。
:::

## 新集群
要在这种模式下运行 K3s，你必须拥有奇数个 Server 节点。我们建议从三个节点开始。

首先，启动一个带有 `cluster-init` 标志的 Server 节点来启用集群和一个令牌，该令牌将作为共享 secret，用于将其他 Server 加入集群。
```bash
curl -sfL https://get.k3s.io | K3S_TOKEN=SECRET sh -s - server --cluster-init
```

:::note
中国用户，可以使用以下方法加速安装：
```
curl -sfL https://rancher-mirror.rancher.cn/k3s/k3s-install.sh | INSTALL_K3S_MIRROR=cn K3S_TOKEN=SECRET sh -s - server --cluster-init
```
:::

启动第一台服务器后，使用共享 secret  将第二台和第三台服务器加入集群：
```bash
curl -sfL https://get.k3s.io | K3S_TOKEN=SECRET sh -s - server --server https://<ip or hostname of server1>:6443
```

:::note
中国用户，可以使用以下方法加速安装：
```
curl -sfL https://rancher-mirror.rancher.cn/k3s/k3s-install.sh | INSTALL_K3S_MIRROR=cn K3S_TOKEN=SECRET sh -s - server --server https://<ip or hostname of server1>:6443
```
:::

检查第二个和第三个服务器是否已加入集群：

```bash
$ kubectl get nodes
NAME        STATUS   ROLES                       AGE   VERSION
server1     Ready    control-plane,etcd,master   28m   vX.Y.Z
server2     Ready    control-plane,etcd,master   13m   vX.Y.Z
server3     Ready    control-plane,etcd,master   10m   vX.Y.Z
```

现在你有了一个高可用的 control plane。你可以在 `--server` 参数中使用任何集群 server，从而加入其他 server 和 agent 节点。将其他 agent 节点加入到集群中，步骤与单个 server 集群相同。

有几个配置标志在所有 Server 节点中必须是相同的:

* 网络相关标志：`--cluster-dns`、`--cluster-domain`、`--cluster-cidr`、`--service- cidr`
* 控制某些组件部署的标志：`--disable-helm-controller`、`--disable-kube-proxy`、`--disable-network-policy` 和任何传递给 `--disable` 的组件
* 功能相关标志：`--secrets-encryption`

## 现有集群
如果你有一个使用默认嵌入式 SQLite 数据库的现有集群，你可以通过使用 `--cluster-init` 标志重新启动你的 K3s server，从而将其转换为 etcd。完成此操作后，你将能够如上所述添加其他实例。

如果由于节点已经初始化或加入了一个集群，导致在磁盘上发现一个 etcd 数据存储，那么数据存储参数（`--cluster-init`、`--server`、`--datastore-endpoint` 等）将被忽略。

> **重要提示**：K3s v1.22.2 及更高版本支持将 SQLite 迁移到 etcd。如果你将 `--cluster-init` 添加到现有 server，旧版本将创建一个新的空数据存储。

