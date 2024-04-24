---
title: server
---

# k3s server

在本节中，你将学习如何配置 K3s Server。

请注意，Server 也运行 Agent，因此 Server 也支持 [`k3s agent` 文档](agent.md)中列出的所有配置选项。

在本文中，选项作为 CLI 标志传递，但是也可以作为配置文件选项传递。有关使用 YAML 配置文件的更多信息，请参阅[配置文件](../installation/configuration.md#配置文件)文档。

## 关键配置值

以下选项必须在集群中的所有 Server 上设置为相同的值。如果不这样做，新 Server 将无法加入集群（使用嵌入式 etcd 时），或集群将无法正确运行（使用外部数据存储时）。

* `--agent-token`
* `--cluster-cidr`
* `--cluster-dns`
* `--cluster-domain`
* `--disable-cloud-controller`
* `--disable-helm-controller`
* `--disable-network-policy`
* `--disable=servicelb` *注意：其他打包组件可能会在单独服务器上禁用*
* `--egress-selector-mode`
* `--flannel-backend`
* `--flannel-external-ip`
* `--flannel-ipv6-masq`
* `--secrets-encryption`
* `--service-cidr`

## 常用选项

### 数据库

| 标志 | 环境变量 | 描述 |
| ------------------------------------- | -------------------------- | -------------------------------------------------------------------------------------------------------- |
| `--datastore-endpoint` value | `K3S_DATASTORE_ENDPOINT` | 指定 etcd、Mysql、Postgres 或 Sqlite（默认）数据源名称 |
| `--datastore-cafile` value | `K3S_DATASTORE_CAFILE` | 用于保护数据存储后端通信的 TLS CA 文件 |
| `--datastore-certfile` value | `K3S_DATASTORE_CERTFILE` | 用于保护数据存储后端通信的 TLS 证书文件 |
| `--datastore-keyfile` value | `K3S_DATASTORE_KEYFILE` | 用于保护数据存储后端通信的 TLS 密钥文件 |
| `--etcd-expose-metrics` | N/A | 向客户端接口公开 etcd 指标（默认值：false） |
| `--etcd-disable-snapshots` | N/A | 禁用自动 etcd 快照 |
| `--etcd-snapshot-name` value | N/A | 设置 etcd 快照的基本名称。默认值：etcd-snapshot-\<unix-timestamp\>（默认值：“etcd-snapshot”） |
| `--etcd-snapshot-schedule-cron` value | N/A | cron 规范中的快照间隔时间。eg. 每 5 小时 '0 */5 _ \* _'（默认值："0 */12 \* \* \*"） |
| `--etcd-snapshot-retention` value | N/A | 要保留的快照数量（默认值：5） |
| `--etcd-snapshot-dir` value | N/A | 保存数据库快照的目录（默认值：$\{data-dir\}/db/snapshots） |
| `--etcd-s3` | N/A | 启用备份到 S3 |
| `--etcd-s3-endpoint` value | N/A | S3 端点 URL（默认值：“s3.amazonaws.com”） |
| `--etcd-s3-endpoint-ca` value | N/A | S3 自定义 CA 证书，用于连接到 S3 端点 |
| `--etcd-s3-skip-ssl-verify` | N/A | 禁用 S3 SSL 证书验证 |
| `--etcd-s3-access-key` value | `AWS_ACCESS_KEY_ID` | S3 access key |
| `--etcd-s3-secret-key` value | `AWS_SECRET_ACCESS_KEY` | S3 secret key |
| `--etcd-s3-bucket` value | N/A | S3 存储桶名称 |
| `--etcd-s3-region` value | N/A | S3 区域/存储桶位置（可选）（默认值：“us-east-1”） |
| `--etcd-s3-folder` value | N/A | S3 文件夹 |
| `--etcd-s3-insecure` | 通过 HTTPS 禁用 S3 |
| `--etcd-s3-timeout` value | S3 超时（默认值：5m0s） |


### 集群选项

| 标志 | 环境变量 | 描述 |
| ------------------------- | -------------------- | --------------------------------------------------------- |
| `--token` value, `-t` value | `K3S_TOKEN` | 共享密钥，用于将 server 或 agent 加入集群 |
| `--token-file` value | `K3S_TOKEN_FILE` | 包含 cluster-secret/token 的文件 |
| `--agent-token` value | `K3S_AGENT_TOKEN` | 共享密钥，用于将 agent 加入集群，但不能用于 server |
| `--agent-token-file` value | `K3S_AGENT_TOKEN_FILE` | 包含 agent secret 的文件 |
| `--server` value | `K3S_URL` | 要连接的 server，用于加入集群 |
| `--cluster-init` | `K3S_CLUSTER_INIT` | 使用嵌入式 Etcd 初始化新集群 |
| `--cluster-reset` | `K3S_CLUSTER_RESET` | 忘记所有对等点，成为新集群的唯一成员 |

### 管理 Kubeconfig 选项

| 标志 | 环境变量 | 描述 |
|------|----------------------|-------------|
| `--write-kubeconfig value, -o` value | `K3S_KUBECONFIG_OUTPUT` | 将 admin 客户端的 kubeconfig 写入此文件 |
| `--write-kubeconfig-mode` value | `K3S_KUBECONFIG_MODE` | 使用此[模式](https://en.wikipedia.org/wiki/Chmod)写入 kubeconfig。kubeconfig 文件归 root 所有，并默认使用 600 模式写入。如果将模式改为 644，主机上的其他非特权用户将能读取它。 |

## 高级选项

### Logging

| 标志 | 默认 | 描述 |
| ----------------------- | ------- | --------------------------------------------------------------------------------- |
| `--debug` | N/A | 打开 debug 日志 |
| `-v` value | 0 | 表示日志级别详细程度的数字 |
| `--vmodule` value | N/A | FILE_PATTERN=LOG_LEVEL 格式，用逗号分隔的列表，用于文件过滤日志 |
| `--log value, -l` value | N/A | 记录到文件 |
| `--alsologtostderr` | N/A | 记录到标准错误以及文件（如果设置） |

### Listeners

| 标志 | 默认 | 描述 |
| --------------------------- | ------------------------ | -------------------------------------------------------------------------------------------- |
| `--bind-address` value | 0.0.0.0 | K3s 绑定地址 |
| `--https-listen-port` value | 6443 | HTTPS 监听端口 |
| `--advertise-address` value | node-external-ip/node-ip | IPv4 地址，apiserver 使用该地址向集群成员通告 |
| `--advertise-port` value | listen-port/0 | apiserver 用于向集群成员通告的端口 |
| `--tls-san` value | N/A | 在 TLS 证书上添加其他主机名或 IPv4/IPv6 地址作为 Subject Alternative Name |

### 数据

| 标志 | 默认 | 描述 |
| ---------------------------- | ------------------------------------------------------------ | -------------------- |
| `--data-dir value, -d` value | `/var/lib/rancher/k3s`，如果不是 root，则为 `${HOME}/.rancher/k3s` | 保存状态的文件夹 |

### Secret 加密

| 标志 | 默认 | 描述 |
| ---------------------- | ------- | -------------------------------- |
| `--secrets-encryption` | false | 启用 secret 静态加密 |


### 网络

| 标志 | 默认 | 描述 |
| --------------------------------- | --------------- | ------------------------------------------------------------------------------------------ |
| `--cluster-cidr` value | "10.42.0.0/16" | 用于 pod IP 的 IPv4/IPv6 网络 CIDR |
| `--service-cidr` value | "10.43.0.0/16" | 用于服务 IP 的 IPv4/IPv6 网络 CIDR |
| `--service-node-port-range` value | "30000-32767" | 为具有 NodePort 可见性的服务保留的端口范围 |
| `--cluster-dns` value | "10.43.0.10" | 用于 coredns 服务的 IPv4 集群 IP。需要在 service-cidr 范围内 |
| `--cluster-domain` value | "cluster.local" | 集群域名 |
| `--flannel-backend` value | "vxlan" | “none”、“vxlan”、“ipsec”（已弃用）、“host-gw”、“wireguard-native” 或 “wireguard”（已弃用）中的其中一个 |
| `--flannel-ipv6-masq` | "N/A" | 为 pod 启用 IPv6 伪装 |
| `--flannel-external-ip` | "N/A" | 将节点外部 IP 地址用于 Flannel 流量 |
| `--servicelb-namespace` value | "kube-system" | servicelb 组件的 pod 命名空间 |
| `--egress-selector-mode` value | "agent" | 仅支持： <ul><li>disabled：apiserver 不使用 agent 隧道与节点通信。要求 server 运行 agent，并直接连接到 agent 上的 kubelet，否则 apiserver 将无法访问 service 端点或执行 kubectl exec 和 kubectl 日志。</li><li>agent：apiserver 使用 agent 隧道与节点通信。节点允许环回地址的隧道连接。要求 server 也运行 agent，否则 apiserver 将无法访问 service 端点。K3s 的历史默认值。</li><li> pod：apiserver 使用 agent 隧道与节点和 service 端点通信，通过监视节点将端点连接路由到正确的 agent。节点允许环回地址或分配给节点的 CIDR 的隧道连接。</li><li>  cluster：apiserver 使用 agent 隧道与节点和 service 端点通信，通过监视端点将端点连接路由到正确的 agent。节点允许环回地址或配置的集群 CIDR 范围的隧道连接。</li></ul> |


### 存储类

| 标志 | 描述 |
| ------------------------------------ | -------------------------------------------------------------- |
| `--default-local-storage-path` value | 本地制备器存储类的默认本地存储路径 |

### Kubernetes 组件

| 标志 | 描述 |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `--disable` value | 请参阅[使用 `--disable` 标志](../installation/packaged-components.md#使用---disable-标志)。 |
| `--disable-scheduler` | 禁用 Kubernetes 默认调度程序 |
| `--disable-cloud-controller` | 禁用 k3s 默认云 Controller Manager |
| `--disable-kube-proxy` | 禁用运行 kube-proxy |
| `--disable-network-policy` | 禁用 K3s 默认网络策略控制器 |
| `--disable-helm-controller` | 禁用 Helm 控制器 |


### Kubernetes 进程的自定义标志

| 标志 | 描述 |
| ------------------------------------------- | --------------------------------------------------------- |
| `--etcd-arg` value | etcd 进程的自定义标志 |
| `--kube-apiserver-arg` value | kube-apiserver 进程的自定义标志 |
| `--kube-scheduler-arg` value | kube-scheduler 进程的自定义标志 |
| `--kube-controller-manager-arg` value | kube-controller-manager 进程的自定义标志 |
| `--kube-cloud-controller-manager-arg` value | kube-cloud-controller-manager 进程的自定义标志 |
| `--kubelet-arg` value | kubelet 进程的自定义标志 |
| `--kube-proxy-arg` value | kube-proxy 进程的自定义标志 |

### 实验选项

| 标志 | 描述 |
| ---------------------- | ---------------------------------------- |
| `--rootless` | 无根运行 |
| `--enable-pprof` | 在 supervisor 端口上启用 pprof 端点 |
| `--docker` | 使用 cri-dockerd 而不是 containerd |
| `--prefer-bundled-bin` | 偏向打包的用户空间二进制文件，而不是主机二进制文件 |
| `--disable-agent` | 请参阅[运行无 Agent 的 Server（实验性）](../advanced.md#运行无-agent-的-server实验性) |


### 已弃用选项

| 标志 | 环境变量 | 描述 |
| --------------------------------------- | -------------------- | ----------------------------------------------------------------------------------------------------------- |
| `--no-flannel` | N/A | 使用 `--flannel-backend=none` |
| `--no-deploy` value | N/A | 使用 `--disable` |
| `--cluster-secret` value | `K3S_CLUSTER_SECRET` | 使用 `--token` |
| `--flannel-backend` wireguard | N/A | 使用 `--flannel-backend=wireguard-native` |
| `--flannel-backend` value=option1=value | N/A | 使用 `--flannel-conf` 指定带有后端配置的 Flannel 配置文件 |

## K3s Server CLI 帮助

> 如果某个选项出现在括号中（例如 `[$K3S_TOKEN]`），该选项可以作为该名称的环境变量传入。

```bash
NAME:
   k3s server - Run management server

USAGE:
   k3s server [OPTIONS]

OPTIONS:
   --config FILE, -c FILE                     (config) Load configuration from FILE (default: "/etc/rancher/k3s/config.yaml") [$K3S_CONFIG_FILE]
   --debug                                    (logging) Turn on debug logs [$K3S_DEBUG]
   -v value                                   (logging) Number for the log level verbosity (default: 0)
   --vmodule value                            (logging) Comma-separated list of FILE_PATTERN=LOG_LEVEL settings for file-filtered logging
   --log value, -l value                      (logging) Log to file
   --alsologtostderr                          (logging) Log to standard error as well as file (if set)
   --bind-address value                       (listener) k3s bind address (default: 0.0.0.0)
   --https-listen-port value                  (listener) HTTPS listen port (default: 6443)
   --advertise-address value                  (listener) IPv4 address that apiserver uses to advertise to members of the cluster (default: node-external-ip/node-ip)
   --advertise-port value                     (listener) Port that apiserver uses to advertise to members of the cluster (default: listen-port) (default: 0)
   --tls-san value                            (listener) Add additional hostnames or IPv4/IPv6 addresses as Subject Alternative Names on the server TLS cert
   --data-dir value, -d value                 (data) Folder to hold state (default: /var/lib/rancher/k3s or $\{HOME\}/.rancher/k3s if not root)
   --cluster-cidr value                       (networking) IPv4/IPv6 network CIDRs to use for pod IPs (default: 10.42.0.0/16)
   --service-cidr value                       (networking) IPv4/IPv6 network CIDRs to use for service IPs (default: 10.43.0.0/16)
   --service-node-port-range value            (networking) Port range to reserve for services with NodePort visibility (default: "30000-32767")
   --cluster-dns value                        (networking) IPv4 Cluster IP for coredns service. Should be in your service-cidr range (default: 10.43.0.10)
   --cluster-domain value                     (networking) Cluster Domain (default: "cluster.local")
   --flannel-backend value                    (networking) backend<=option1=val1,option2=val2> where backend is one of 'none', 'vxlan', 'ipsec' (deprecated), 'host-gw', 'wireguard-native', 'wireguard' (deprecated) (default: "vxlan")
   --flannel-ipv6-masq                        (networking) Enable IPv6 masquerading for pod
   --flannel-external-ip                      (networking) Use node external IP addresses for Flannel traffic
   --egress-selector-mode value               (networking) One of 'agent', 'cluster', 'pod', 'disabled' (default: "agent")
   --servicelb-namespace value                (networking) Namespace of the pods for the servicelb component (default: "kube-system")
   --write-kubeconfig value, -o value         (client) Write kubeconfig for admin client to this file [$K3S_KUBECONFIG_OUTPUT]
   --write-kubeconfig-mode value              (client) Write kubeconfig with this mode [$K3S_KUBECONFIG_MODE]
   --token value, -t value                    (cluster) Shared secret used to join a server or agent to a cluster [$K3S_TOKEN]
   --token-file value                         (cluster) File containing the token [$K3S_TOKEN_FILE]
   --agent-token value                        (cluster) Shared secret used to join agents to the cluster, but not servers [$K3S_AGENT_TOKEN]
   --agent-token-file value                   (cluster) File containing the agent secret [$K3S_AGENT_TOKEN_FILE]
   --server value, -s value                   (cluster) Server to connect to, used to join a cluster [$K3S_URL]
   --cluster-init                             (cluster) Initialize a new cluster using embedded Etcd [$K3S_CLUSTER_INIT]
   --cluster-reset                            (cluster) Forget all peers and become sole member of a new cluster [$K3S_CLUSTER_RESET]
   --cluster-reset-restore-path value         (db) Path to snapshot file to be restored
   --kube-apiserver-arg value                 (flags) Customized flag for kube-apiserver process
   --etcd-arg value                           (flags) Customized flag for etcd process
   --kube-controller-manager-arg value        (flags) Customized flag for kube-controller-manager process
   --kube-scheduler-arg value                 (flags) Customized flag for kube-scheduler process
   --kube-cloud-controller-manager-arg value  (flags) Customized flag for kube-cloud-controller-manager process
   --datastore-endpoint value                 (db) Specify etcd, Mysql, Postgres, or Sqlite (default) data source name [$K3S_DATASTORE_ENDPOINT]
   --datastore-cafile value                   (db) TLS Certificate Authority file used to secure datastore backend communication [$K3S_DATASTORE_CAFILE]
   --datastore-certfile value                 (db) TLS certification file used to secure datastore backend communication [$K3S_DATASTORE_CERTFILE]
   --datastore-keyfile value                  (db) TLS key file used to secure datastore backend communication [$K3S_DATASTORE_KEYFILE]
   --etcd-expose-metrics                      (db) Expose etcd metrics to client interface. (default: false)
   --etcd-disable-snapshots                   (db) Disable automatic etcd snapshots
   --etcd-snapshot-name value                 (db) Set the base name of etcd snapshots (default: etcd-snapshot-<unix-timestamp>) (default: "etcd-snapshot")
   --etcd-snapshot-schedule-cron value        (db) Snapshot interval time in cron spec. eg. every 5 hours '* */5 * * *' (default: "0 */12 * * *")
   --etcd-snapshot-retention value            (db) Number of snapshots to retain (default: 5)
   --etcd-snapshot-dir value                  (db) Directory to save db snapshots. (default: $\{data-dir\}/db/snapshots)
   --etcd-snapshot-compress                   (db) Compress etcd snapshot
   --etcd-s3                                  (db) Enable backup to S3
   --etcd-s3-endpoint value                   (db) S3 endpoint url (default: "s3.amazonaws.com")
   --etcd-s3-endpoint-ca value                (db) S3 custom CA cert to connect to S3 endpoint
   --etcd-s3-skip-ssl-verify                  (db) Disables S3 SSL certificate validation
   --etcd-s3-access-key value                 (db) S3 access key [$AWS_ACCESS_KEY_ID]
   --etcd-s3-secret-key value                 (db) S3 secret key [$AWS_SECRET_ACCESS_KEY]
   --etcd-s3-bucket value                     (db) S3 bucket name
   --etcd-s3-region value                     (db) S3 region / bucket location (optional) (default: "us-east-1")
   --etcd-s3-folder value                     (db) S3 folder
   --etcd-s3-insecure                         (db) Disables S3 over HTTPS
   --etcd-s3-timeout value                    (db) S3 timeout (default: 5m0s)
   --default-local-storage-path value         (storage) Default local storage path for local provisioner storage class
   --disable value                            (components) Do not deploy packaged components and delete any deployed components (valid items: coredns, servicelb, traefik, local-storage, metrics-server)
   --disable-scheduler                        (components) Disable Kubernetes default scheduler
   --disable-cloud-controller                 (components) Disable k3s default cloud controller manager
   --disable-kube-proxy                       (components) Disable running kube-proxy
   --disable-network-policy                   (components) Disable k3s default network policy controller
   --disable-helm-controller                  (components) Disable Helm controller
   --node-name value                          (agent/node) Node name [$K3S_NODE_NAME]
   --with-node-id                             (agent/node) Append id to node name
   --node-label value                         (agent/node) Registering and starting kubelet with set of labels
   --node-taint value                         (agent/node) Registering kubelet with set of taints
   --image-credential-provider-bin-dir value  (agent/node) The path to the directory where credential provider plugin binaries are located (default: "/var/lib/rancher/credentialprovider/bin")
   --image-credential-provider-config value   (agent/node) The path to the credential provider plugin config file (default: "/var/lib/rancher/credentialprovider/config.yaml")
   --docker                                   (agent/runtime) (experimental) Use cri-dockerd instead of containerd
   --container-runtime-endpoint value         (agent/runtime) Disable embedded containerd and use the CRI socket at the given path; when used with --docker this sets the docker socket path
   --pause-image value                        (agent/runtime) Customized pause image for containerd or docker sandbox (default: "rancher/mirrored-pause:3.6")
   --snapshotter value                        (agent/runtime) Override default containerd snapshotter (default: "overlayfs")
   --private-registry value                   (agent/runtime) Private registry configuration file (default: "/etc/rancher/k3s/registries.yaml")
   --system-default-registry value            (agent/runtime) Private registry to be used for all system images [$K3S_SYSTEM_DEFAULT_REGISTRY]
   --node-ip value, -i value                  (agent/networking) IPv4/IPv6 addresses to advertise for node
   --node-external-ip value                   (agent/networking) IPv4/IPv6 external IP addresses to advertise for node
   --resolv-conf value                        (agent/networking) Kubelet resolv.conf file [$K3S_RESOLV_CONF]
   --flannel-iface value                      (agent/networking) Override default flannel interface
   --flannel-conf value                       (agent/networking) Override default flannel config file
   --flannel-cni-conf value                   (agent/networking) Override default flannel cni config file
   --kubelet-arg value                        (agent/flags) Customized flag for kubelet process
   --kube-proxy-arg value                     (agent/flags) Customized flag for kube-proxy process
   --protect-kernel-defaults                  (agent/node) Kernel tuning behavior. If set, error if kernel tunables are different than kubelet defaults.
   --secrets-encryption                       Enable secret encryption at rest
   --enable-pprof                             (experimental) Enable pprof endpoint on supervisor port
   --rootless                                 (experimental) Run rootless
   --prefer-bundled-bin                       (experimental) Prefer bundled userspace binaries over host binaries
   --selinux                                  (agent/node) Enable SELinux in containerd [$K3S_SELINUX]
   --lb-server-port value                     (agent/node) Local port for supervisor client load-balancer. If the supervisor and apiserver are not colocated an additional port 1 less than this port will also be used for the apiserver client load-balancer.(default: 6444) [$K3S_LB_SERVER_PORT]
```
