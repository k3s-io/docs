---
title: "高可用嵌入式 etcd"
---

:::warning
嵌入式 etcd (HA) 在速度较慢的磁盘（例如使用 SD 卡运行的 Raspberry Pi）上可能会出现性能问题。
:::

:::info
HA 嵌入式 etcd 集群必须由奇数个 Server 节点组成，以便 etcd 维持 quorum。对于有 n 个 server 的集群，quorum 是 (n/2)+1。如果集群节点数量是奇数，每新增一个节点，都会增加 quorum 所需节点数。虽然将节点添加到奇数节点数量的集群增加了机器，看起来更好，但其实集群的容错性会变差，这是因为完全相同数量的节点可能失败而不丢失 quorum，但有更多的节点可能失败。
:::

具有嵌入式 etcd 的 HA K3s 集群由以下部分组成：

* 三个或多个 **Server 节点**为 Kubernetes API 提供服务并运行其他 control plane 服务，以及托管嵌入式 etcd 数据存储。
* 可选：零个或多个 **Agent 节点**，用于运行你的应用和服务
* 可选：**固定注册地址**，供 Agent 节点注册到集群

首先，启动一个带有 `cluster-init` 标志的 Server 节点来启用集群和一个令牌，该令牌将作为共享 secret，用于将其他 Server 加入集群。

```bash
curl -sfL https://get.k3s.io | K3S_TOKEN=SECRET sh -s - server \
    --cluster-init \
    --tls-san=<FIXED_IP> # Optional, needed if using a fixed registration address
```

启动第一台服务器后，使用共享 secret  将第二台和第三台服务器加入集群：
```bash
curl -sfL https://get.k3s.io | K3S_TOKEN=SECRET sh -s - server \
    --server https://<ip or hostname of server1>:6443 \
    --tls-san=<FIXED_IP> # Optional, needed if using a fixed registration address
```

检查第二个和第三个服务器是否已加入集群：

```bash
$ kubectl get nodes
NAME        STATUS   ROLES                       AGE   VERSION
server1     Ready    control-plane,etcd,master   28m   vX.Y.Z
server2     Ready    control-plane,etcd,master   13m   vX.Y.Z
server3     Ready    control-plane,etcd,master   10m   vX.Y.Z
```

现在你有了一个高可用的 control plane。你可以在 `--server` 参数中使用任何集群 server，从而加入其他 server 和 agent 节点。将其他 agent 节点加入到集群中，步骤与 server 相同。

```bash
curl -sfL https://get.k3s.io | K3S_TOKEN=SECRET sh -s - agent --server https://<ip or hostname of server>:6443
```

有几个配置标志在所有 Server 节点中必须是相同的:

* 网络相关标志：`--cluster-dns`、`--cluster-domain`、`--cluster-cidr`、`--service- cidr`
* 控制某些组件部署的标志：`--disable-helm-controller`、`--disable-kube-proxy`、`--disable-network-policy` 和任何传递给 `--disable` 的组件
* 功能相关标志：`--secrets-encryption`

## 现有的单节点集群

:::info 版本
从 [v1.22.2+k3s1](https://github.com/k3s-io/k3s/releases/tag/v1.22.2%2Bk3s1) 起可用
:::

如果你有一个使用默认嵌入式 SQLite 数据库的现有集群，你可以通过使用 `--cluster-init` 标志重新启动你的 K3s server，从而将其转换为 etcd。完成此操作后，你将能够如上所述添加其他实例。

如果由于节点已经初始化或加入了一个集群，导致在磁盘上发现一个 etcd 数据存储，那么数据存储参数（`--cluster-init`、`--server`、`--datastore-endpoint` 等）将被忽略。

