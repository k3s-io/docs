---
title: server
---

# k3s server

In this section, you'll learn how to configure the K3s server.

Note that servers also run an agent, so all of the configuration options listed in the [`k3s agent` documentation](agent.md) are also supported on servers.

Options are documented on this page as CLI flags, but can also be passed as configuration file options. See the [Configuration File](../installation/configuration.md#configuration-file) documentation for more information on using YAML configuration files.

## Critical Configuration Values

The following options must be set to the same value on all servers in the cluster. Failure to do so will cause new servers to fail to join the cluster when using embedded etcd, or incorrect operation of the cluster when using an external datastore.

* `--agent-token`
* `--cluster-cidr`
* `--cluster-dns`
* `--cluster-domain`
* `--disable-cloud-controller`
* `--disable-helm-controller`
* `--disable-network-policy`
* `--disable-servicelb`
* `--egress-selector-mode`
* `--flannel-backend`
* `--flannel-external-ip`
* `--flannel-ipv6-masq`
* `--secrets-encryption`
* `--service-cidr`

## Commonly Used Options

### Database

| Flag                                  | Environment Variable       | Description                                                                                              |
| ------------------------------------- | -------------------------- | -------------------------------------------------------------------------------------------------------- |
| `--datastore-endpoint` value          | `K3S_DATASTORE_ENDPOINT`   | Specify etcd, Mysql, Postgres, or Sqlite (default) data source name                                      |
| `--datastore-cafile` value            | `K3S_DATASTORE_CAFILE`     | TLS Certificate Authority file used to secure datastore backend communication                            |
| `--datastore-certfile` value          | `K3S_DATASTORE_CERTFILE`   | TLS certification file used to secure datastore backend communication                                    |
| `--datastore-keyfile` value           | `K3S_DATASTORE_KEYFILE`    | TLS key file used to secure datastore backend communication                                              |
| `--etcd-expose-metrics`               | N/A                        | Expose etcd metrics to client interface (default: false)                                                 |
| `--etcd-disable-snapshots`            | N/A                        | Disable automatic etcd snapshots                                                                         |
| `--etcd-snapshot-name` value          | N/A                        | Set the base name of etcd snapshots. Default: etcd-snapshot-\<unix-timestamp\> (default:"etcd-snapshot") |
| `--etcd-snapshot-schedule-cron` value | N/A                        | Snapshot interval time in cron spec. eg. every 5 hours '0 */5 _ \* _' (default: "0 */12 \* \* \*")      |
| `--etcd-snapshot-retention` value     | N/A                        | Number of snapshots to retain (default: 5)                                                               |
| `--etcd-snapshot-dir` value           | N/A                        | Directory to save db snapshots (default: $\{data-dir\}/db/snapshots)                                       |
| `--etcd-s3`                           | N/A                        | Enable backup to S3                                                                                      |
| `--etcd-s3-endpoint` value            | N/A                        | S3 endpoint url (default: "s3.amazonaws.com")                                                            |
| `--etcd-s3-endpoint-ca` value         | N/A                        | S3 custom CA cert to connect to S3 endpoint                                                              |
| `--etcd-s3-skip-ssl-verify`           | N/A                        | Disables S3 SSL certificate validation                                                                   |
| `--etcd-s3-access-key` value          | `AWS_ACCESS_KEY_ID`        | S3 access key                                                                                            |
| `--etcd-s3-secret-key` value          | `AWS_SECRET_ACCESS_KEY`    | S3 secret key                                                                                            |
| `--etcd-s3-bucket` value              | N/A                        | S3 bucket name                                                                                           |
| `--etcd-s3-region` value              | N/A                        | S3 region / bucket location (optional) (default: "us-east-1")                                            |
| `--etcd-s3-folder` value              | N/A                        | S3 folder                                                                                                |
| `--etcd-s3-insecure`                  | Disables S3 over HTTPS     |
| `--etcd-s3-timeout` value             | S3 timeout (default: 5m0s) |


### Cluster Options

| Flag                      | Environment Variable | Description                                               |
| ------------------------- | -------------------- | --------------------------------------------------------- |
| `--token` value, `-t` value | `K3S_TOKEN`          | Shared secret used to join a server or agent to a cluster |
| `--token-file` value      | `K3S_TOKEN_FILE`     | File containing the cluster-secret/token                  |
| `--agent-token` value        |`K3S_AGENT_TOKEN` |           Shared secret used to join agents to the cluster, but not servers
| `--agent-token-file` value   |`K3S_AGENT_TOKEN_FILE` |           File containing the agent secret
| `--server` value             | `K3S_URL` | Server to connect to, used to join a cluster
| `--cluster-init`             | `K3S_CLUSTER_INIT` |           Initialize a new cluster using embedded Etcd
| `--cluster-reset`            |  `K3S_CLUSTER_RESET` |           Forget all peers and become sole member of a new cluster

### Admin Kubeconfig Options

| Flag | Environment Variable | Description |
|------|----------------------|-------------|
|  `--write-kubeconfig value, -o` value  | `K3S_KUBECONFIG_OUTPUT` | Write kubeconfig for admin client to this file |
|  `--write-kubeconfig-mode` value       | `K3S_KUBECONFIG_MODE`   | Write kubeconfig with this [mode.](https://en.wikipedia.org/wiki/Chmod) The kubeconfig file is owned by root, and written with a default mode of 600. Changing the mode to 644 will allow it to be read by other unprivileged users on the host. |

## Advanced Options

### Logging

| Flag                    | Default | Description                                                                       |
| ----------------------- | ------- | --------------------------------------------------------------------------------- |
| `--debug`               | N/A     | Turn on debug logs                                                                |
| `-v` value              | 0       | Number for the log level verbosity                                                |
| `--vmodule` value       | N/A     | Comma-separated list of FILE_PATTERN=LOG_LEVEL settings for file-filtered logging |
| `--log value, -l` value | N/A     | Log to file                                                                       |
| `--alsologtostderr`     | N/A     | Log to standard error as well as file (if set)                                    |

### Listeners

| Flag                        | Default                  | Description                                                                                  |
| --------------------------- | ------------------------ | -------------------------------------------------------------------------------------------- |
| `--bind-address` value      | 0.0.0.0                  | k3s bind address                                                                             |
| `--https-listen-port` value | 6443                     | HTTPS listen port                                                                            |
| `--advertise-address` value | node-external-ip/node-ip | IPv4 address that apiserver uses to advertise to members of the cluster                      |
| `--advertise-port` value    | listen-port/0            | Port that apiserver uses to advertise to members of the cluster                              |
| `--tls-san` value           | N/A                      | Add additional hostnames or IPv4/IPv6 addresses as Subject Alternative Names on the TLS cert |

### Data

| Flag                         | Default                                                      | Description          |
| ---------------------------- | ------------------------------------------------------------ | -------------------- |
| `--data-dir value, -d` value | `/var/lib/rancher/k3s` or `${HOME}/.rancher/k3s` if not root | Folder to hold state |

### Secrets Encryption

| Flag                   | Default | Description                      |
| ---------------------- | ------- | -------------------------------- |
| `--secrets-encryption` | false   | Enable Secret encryption at rest |


### Networking

| Flag                              | Default         | Description                                                                                |
| --------------------------------- | --------------- | ------------------------------------------------------------------------------------------ |
| `--cluster-cidr` value            | "10.42.0.0/16"  | IPv4/IPv6 network CIDRs to use for pod IPs                                                 |
| `--service-cidr` value            | "10.43.0.0/16"  | IPv4/IPv6 network CIDRs to use for service IPs                                             |
| `--service-node-port-range` value | "30000-32767"   | Port range to reserve for services with NodePort visibility                                |
| `--cluster-dns` value             | "10.43.0.10"    | IPv4 Cluster IP for coredns service. Should be in your service-cidr range                  |
| `--cluster-domain` value          | "cluster.local" | Cluster Domain                                                                             |
| `--flannel-backend` value         | "vxlan"         | One of 'none', 'vxlan', 'ipsec'(deprecated), 'host-gw', 'wireguard-native', or 'wireguard'(deprecated) |
| `--flannel-ipv6-masq`             | "N/A"           | Enable IPv6 masquerading for pod                                                           |
| `--flannel-external-ip`           | "N/A"           | Use node external IP addresses for Flannel traffic                                         |
| `--servicelb-namespace` value     | "kube-system"   | Namespace of the pods for the servicelb component                                          |
| `--egress-selector-mode` value    | "agent"         | Must be one of the following: <ul><li>disabled: The apiserver does not use agent tunnels to communicate with nodes. Requires that servers run agents, and have direct connectivity to the kubelet on agents, or the apiserver will not be able to function access service endpoints or perform kubectl exec and kubectl logs.</li><li>agent: The apiserver uses agent tunnels to communicate with nodes. Nodes allow the tunnel connection from loopback addresses. Requires that servers also run agents, or the apiserver will not be able to access service endpoints. The historical default for k3s.</li><li> pod: The apiserver uses agent tunnels to communicate with nodes and service endpoints, routing endpoint connections to the correct agent by watching Nodes. Nodes allow the tunnel connection from loopback addresses, or a CIDR assigned to their node.</li><li>  cluster: The apiserver uses agent tunnels to communicate with nodes and service endpoints, routing endpoint connections to the correct agent by watching Endpoints. Nodes allow the tunnel connection from loopback addresses, or the configured cluster CIDR range.</li></ul> |


### Storage Class

| Flag                                 | Description                                                    |
| ------------------------------------ | -------------------------------------------------------------- |
| `--default-local-storage-path` value | Default local storage path for local provisioner storage class |

### Kubernetes Components

| Flag                         | Description                                                                                                                                   |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `--disable` value            | See "[Using the `--disable` flag](../installation/packaged-components.md#using-the---disable-flag)" |
| `--disable-scheduler`        | Disable Kubernetes default scheduler              |
| `--disable-cloud-controller` | Disable k3s default cloud controller manager      |
| `--disable-kube-proxy`       | Disable running kube-proxy                        |
| `--disable-network-policy`   | Disable k3s default network policy controller     |
| `--disable-helm-controller` | Disable Helm controller |


### Customized Flags for Kubernetes Processes

| Flag                                        | Description                                               |
| ------------------------------------------- | --------------------------------------------------------- |
| `--etcd-arg` value                          | Customized flag for etcd process                          |
| `--kube-apiserver-arg` value                | Customized flag for kube-apiserver process                |
| `--kube-scheduler-arg` value                | Customized flag for kube-scheduler process                |
| `--kube-controller-manager-arg` value       | Customized flag for kube-controller-manager process       |
| `--kube-cloud-controller-manager-arg` value | Customized flag for kube-cloud-controller-manager process |
| `--kubelet-arg` value    | Customized flag for kubelet process    |
| `--kube-proxy-arg` value | Customized flag for kube-proxy process |

### Experimental Options

| Flag                   | Description                              |
| ---------------------- | ---------------------------------------- |
| `--rootless`           | Run rootless                             |
| `--enable-pprof`       | Enable pprof endpoint on supervisor port |
| `--docker`             | Use cri-dockerd instead of containerd    |
| `--prefer-bundled-bin` | Prefer bundled userspace binaries over host binaries |
| `--disable-agent`      | See "[Running Agentless Servers (Experimental)](../advanced.md#에이전트-없는-서버-실행하기실험적)" |


### Deprecated Options

| Flag                                    | Environment Variable | Description                                                                                                 |
| --------------------------------------- | -------------------- | ----------------------------------------------------------------------------------------------------------- |
| `--no-flannel`                          | N/A                  | Use `--flannel-backend=none`                                                                                  |
| `--no-deploy` value                     | N/A                  | Use `--disable` |
| `--cluster-secret` value                | `K3S_CLUSTER_SECRET` | Use `--token`                                                                                                 |
| `--flannel-backend` wireguard           | N/A                  | Use `--flannel-backend=wireguard-native`                                                                      |
| `--flannel-backend` value=option1=value | N/A                  | Use `--flannel-conf` to specify the flannel config file with the backend config                               |

# K3s Server CLI Help

> If an option appears in brackets below, for example `[$K3S_TOKEN]`, it means that the option can be passed in as an environment variable of that name.

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
   --lb-server-port value                     (agent/node) Local port for supervisor client load-balancer. If the supervisor and apiserver are not colocated an additional port 1 less than this port will also be used for the apiserver client load-balancer. (default: 6444) [$K3S_LB_SERVER_PORT]
```
