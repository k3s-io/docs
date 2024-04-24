---
title: 高可用外部数据库
---

本文介绍了如何安装具有外部数据库的高可用 K3s 集群。

单服务器集群可以满足各种用例，但如果你的环境对 Kubernetes control plane 的正常运行时间有要求，你可以在 HA 配置中运行 K3s。一个 HA K3s 集群包括：

* 两个或多个 **Server 节点**为 Kubernetes API 提供服务并运行其他 control plane 服务
* **外部数据存储**（与单节点设置中使用的嵌入式 SQLite 数据存储相反）
* 可选：零个或多个 **Agent 节点**，用于运行你的应用和服务
* 可选：**固定注册地址**，供 Agent 节点注册到集群

有关这些组件如何协同工作的详细信息，请参阅[架构](../architecture.md#高可用-k3s)。

## 安装概要

设置 HA 集群需要以下步骤：

### 1. 创建外部数据存储
你首先需要为集群创建一个外部数据存储。有关更多详细信息，请参阅[集群数据存储选项](datastore.md)文档。

### 2. 启动 Server 节点
K3s 需要两个或更多的 Server 节点来实现 HA 配置。有关最低主机要求，请参阅[安装要求](../installation/requirements.md)。

在这些节点上运行 `k3s server` 命令时，你必须设置 `datastore-endpoint` 参数，以便 K3s 知道如何连接到外部数据存储。`token` 参数也可以用来在添加节点时设置一个固定的 token。当为空时，将自动生成 token。

例如，你可以使用如下命令安装 K3s Server，并使用 MySQL 数据库作为外部数据存储和[设置 token](../cli/server.md#集群选项)：

```bash
curl -sfL https://get.k3s.io | sh -s - server \
  --token=SECRET \
  --datastore-endpoint="mysql://username:password@tcp(hostname:3306)/database-name"
  --tls-san=<FIXED_IP> # Optional, needed if using a fixed registration address
```

根据数据库类型的不同，数据存储端点的格式也不同。有关详细信息，请参阅[数据存储端点格式](../datastore/datastore.md#数据存储端点格式和功能)。

要在启动 server 节点时配置 TLS 证书，请参阅[数据存储配置指南](../datastore/datastore.md#外部数据库配置参数)。

:::note
单台 Server 安装时可用的安装选项也适用于高可用安装。有关详细信息，请参阅[配置选项](../installation/configuration.md)文档。
:::

默认情况下，Server 节点是可调度的，因此你的工作负载可以在它们上启动。如果你希望拥有一个不会运行用户工作负载的专用 control plane，你可以使用污点（taint）。`node-taint` 参数将允许你配置带有污点的节点，例如 `--node-taint CriticalAddonsOnly=true:NoExecute`。

在所有 server 节点上启动 `k3s server` 进程后，请通过 `k3s kubectl get nodes` 确保集群已正确启动。你应该看到 server 节点处于 Ready 状态。

### 3. 可选：加入其它 Server 节点

步骤 2 中的相同示例命令可用于加入其他 Server 节点，其中需要使用第一个节点的 Token。

如果第一个 Server 节点是在没有 `--token` CLI 标志或 `K3S_TOKEN` 变量的情况下启动的，那么可以从任何已经加入集群的 Server 节点中检索到 Token：
```bash
cat /var/lib/rancher/k3s/server/token
```

然后可以[使用 Token](../cli/server.md#集群选项) 添加其他 Server 节点：

```bash
curl -sfL https://get.k3s.io | sh -s - server \
  --token=SECRET \
  --datastore-endpoint="mysql://username:password@tcp(hostname:3306)/database-name"
```

:::note
中国用户，可以使用以下方法加速安装：
```
curl -sfL https://rancher-mirror.rancher.cn/k3s/k3s-install.sh | INSTALL_K3S_MIRROR=cn sh -s - server \
  --token=SECRET \
  --datastore-endpoint="mysql://username:password@tcp(hostname:3306)/database-name"
```
:::

有几个配置标志在所有 Server 节点中必须是相同的:

* 网络相关标志：`--cluster-dns`、`--cluster-domain`、`--cluster-cidr`、`--service- cidr`
* 控制某些组件部署的标志：`--disable-helm-controller`、`--disable-kube-proxy`、`--disable-network-policy` 和任何传递给 `--disable` 的组件
* 功能相关标志：`--secrets-encryption`

:::note
你需要备份 token 的值，因为恢复备份和添加节点时都需要该 token。以前，K3s 在使用外部 SQL 数据存储时不强制使用 token。
:::


### 4. 可选：配置固定的注册地址

Agent 节点需要一个 URL 来注册。这可以是任何 server 节点的 IP 或主机名，但在许多情况下，这些节点可能会随着时间的推移而改变。例如，如果在支持扩展组的云上运行集群，则可能会随着时间的推移创建和销毁节点，从而更改为与初始 Server 节点集不同的 IP。最好在 Server 节点前面有一个不会随时间变化的稳定端点。你可以使用许多方法来设置此端点，例如：

* 4 层 (TCP) 负载均衡器
* 轮询 DNS
* 虚拟或弹性 IP 地址

有关示例配置，请参阅[集群负载均衡器](./cluster-loadbalancer.md)。

这个端点也可以用来访问 Kubernetes API。因此，你可以修改 [kubeconfig](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/) 文件来指向它，而不是特定的节点。

要避免此类配置中的证书错误，请使用 `--tls-san YOUR_IP_OR_HOSTNAME_HERE` 选项来配置 Server。这个选项在 TLS 证书中增加了一个额外的主机名或 IP 作为 Subject Alternative Name，如果你想通过 IP 和主机名访问，可以多次指定。

### 5. 可选：加入 Agent 节点

因为 K3s Server 节点默认是可调度的，所以 HA K3s 集群不需要 Agent 节点。但是，你可能希望使用专门的 Agent 节点来运行应用程序和服务。

在 HA 集群中加入 Agent 节点与在单个 Server 集群中加入 Agent 节点是一样的。你只需要指定 Agent 应该注册的 URL（server IP 之一或固定注册地址）和要使用的 Token 即可。

```bash
K3S_TOKEN=SECRET k3s agent --server https://server-or-fixed-registration-address:6443
```
