---
title: agent
---

# k3s agent

In this section, you'll learn how to configure the K3s agent.

Note that servers also run an agent, so all flags listed on this page are also valid for use on servers.

Options are documented on this page as CLI flags, but can also be passed as configuration file options. See the [Configuration File](../installation/configuration.md#configuration-file) documentation for more information on using YAML configuration files.

### Logging

| Flag                    | Default | Description                                                          |
| ----------------------- | ------- | -------------------------------------------------------------------- |
| `-v` value              | 0       | Number for the log level verbosity                                   |
| `--vmodule` value       | N/A     | Comma-separated list of FILE_PATTERN=LOG_LEVEL settings for file-filtered logging |
| `--log value, -l` value | N/A     | Log to file                                                          |
| `--alsologtostderr`     | N/A     | Log to standard error as well as file (if set)                       |

### Cluster Options

| Flag                       | Environment Variable | Description                          |
| -------------------------- | -------------------- | ------------------------------------ |
| `--token value, -t` value  | `K3S_TOKEN`          | Token to use for authentication      |
| `--token-file` value       | `K3S_TOKEN_FILE`     | Token file to use for authentication |
| `--server value, -s` value | `K3S_URL`            | Server to connect to                 |

### Data

| Flag                         | Default                | Description          |
| ---------------------------- | ---------------------- | -------------------- |
| `--data-dir value, -d` value | "/var/lib/rancher/k3s" | Folder to hold state |

### Node

| Flag                        | Environment Variable | Description                                                                                   |
| --------------------------- | -------------------- | --------------------------------------------------------------------------------------------- |
| `--node-name` value         | `K3S_NODE_NAME`      | Node name                                                                                     |
| `--with-node-id`            | N/A                  | Append id to node name                                                                        |
| `--node-label` value        | N/A                  | Registering and starting kubelet with set of labels                                           |
| `--node-taint` value        | N/A                  | Registering kubelet with set of taints                                                        |
| `--protect-kernel-defaults` | N/A                  | Kernel tuning behavior. If set, error if kernel tunables are different from kubelet defaults. |
|   `--selinux` | `K3S_SELINUX` | Enable SELinux in containerd |
|   `--lb-server-port` value | `K3S_LB_SERVER_PORT` | Local port for supervisor client load-balancer. If the supervisor and apiserver are not colocated an additional port 1 less than this port will also be used for the apiserver client load-balancer. (default: 6444) |

### Runtime

| Flag                                 | Default                            | Description                                                        |
| ------------------------------------ | ---------------------------------- | ------------------------------------------------------------------ |
| `--container-runtime-endpoint` value | N/A                                | Disable embedded containerd and use the CRI socket at the given path; when used with --docker this sets the cri-docker socket path |
| `--pause-image` value                | "docker.io/rancher/pause:3.1"      | Customized pause image for containerd or docker sandbox            |
| `--private-registry` value           | "/etc/rancher/k3s/registries.yaml" | Private registry configuration file                                |

### Networking

| Flag                        | Environment Variable | Description                               |
| --------------------------- | -------------------- | ----------------------------------------- |
| `--node-ip value, -i` value | N/A                  | IP address to advertise for node          |
| `--node-external-ip` value  | N/A                  | External IP address to advertise for node |
| `--resolv-conf` value       | `K3S_RESOLV_CONF`    | Kubelet resolv.conf file                  |
| `--flannel-iface` value     | N/A                  | Override default flannel interface        |
| `--flannel-conf` value      | N/A                  | Override default flannel config file      |
| `--flannel-cni-conf` value  | N/A                  | Override default flannel cni config file  |

### Customized Flags

| Flag                     | Description                            |
| ------------------------ | -------------------------------------- |
| `--kubelet-arg` value    | Customized flag for kubelet process    |
| `--kube-proxy-arg` value | Customized flag for kube-proxy process |

### Experimental

| Flag         | Description                           |
| ------------ | ------------------------------------- |
| `--rootless` | Run rootless                          |
| `--docker`   | Use cri-dockerd instead of containerd |
| `--prefer-bundled-bin` | Prefer bundled userspace binaries over host binaries |

### Deprecated

| Flag                     | Environment Variable | Description                  |
| ------------------------ | -------------------- | ---------------------------- |
| `--no-flannel`           | N/A                  | Use `--flannel-backend=none` |
| `--cluster-secret` value | `K3S_CLUSTER_SECRET` | Use `--token`                |

### Node Labels and Taints for Agents

K3s agents can be configured with the options `--node-label` and `--node-taint` which adds a label and taint to the kubelet. The two options only add labels and/or taints at registration time, so they can only be added once and not changed after that again by running K3s commands.

Below is an example showing how to add labels and a taint:

```bash
     --node-label foo=bar \
     --node-label hello=world \
     --node-taint key1=value1:NoExecute
```

If you want to change node labels and taints after node registration you should use `kubectl`. Refer to the official Kubernetes documentation for details on how to add [taints](https://kubernetes.io/docs/concepts/configuration/taint-and-toleration/) and [node labels.](https://kubernetes.io/docs/tasks/configure-pod-container/assign-pods-nodes/#add-a-label-to-a-node)

### K3s Agent CLI Help

> If an option appears in brackets below, for example `[$K3S_URL]`, it means that the option can be passed in as an environment variable of that name.

```bash
NAME:
   k3s agent - Run node agent

USAGE:
   k3s agent [OPTIONS]

OPTIONS:
   --config FILE, -c FILE                     (config) Load configuration from FILE (default: "/etc/rancher/k3s/config.yaml") [$K3S_CONFIG_FILE]
   --debug                                    (logging) Turn on debug logs [$K3S_DEBUG]
   -v value                                   (logging) Number for the log level verbosity (default: 0)
   --vmodule value                            (logging) Comma-separated list of FILE_PATTERN=LOG_LEVEL settings for file-filtered logging
   --log value, -l value                      (logging) Log to file
   --alsologtostderr                          (logging) Log to standard error as well as file (if set)
   --token value, -t value                    (cluster) Token to use for authentication [$K3S_TOKEN]
   --token-file value                         (cluster) Token file to use for authentication [$K3S_TOKEN_FILE]
   --server value, -s value                   (cluster) Server to connect to [$K3S_URL]
   --data-dir value, -d value                 (agent/data) Folder to hold state (default: "/var/lib/rancher/k3s")
   --node-name value                          (agent/node) Node name [$K3S_NODE_NAME]
   --with-node-id                             (agent/node) Append id to node name
   --node-label value                         (agent/node) Registering and starting kubelet with set of labels
   --node-taint value                         (agent/node) Registering kubelet with set of taints
   --image-credential-provider-bin-dir value  (agent/node) The path to the directory where credential provider plugin binaries are located (default: "/var/lib/rancher/credentialprovider/bin")
   --image-credential-provider-config value   (agent/node) The path to the credential provider plugin config file (default: "/var/lib/rancher/credentialprovider/config.yaml")
   --selinux                                  (agent/node) Enable SELinux in containerd [$K3S_SELINUX]
   --lb-server-port value                     (agent/node) Local port for supervisor client load-balancer. If the supervisor and apiserver are not colocated an additional port 1 less than this port will also be used for the apiserver client load-balancer. (default: 6444) [$K3S_LB_SERVER_PORT]
   --protect-kernel-defaults                  (agent/node) Kernel tuning behavior. If set, error if kernel tunables are different than kubelet defaults.
   --container-runtime-endpoint value         (agent/runtime) Disable embedded containerd and use the CRI socket at the given path; when used with --docker this sets the docker socket path
   --pause-image value                        (agent/runtime) Customized pause image for containerd or docker sandbox (default: "rancher/mirrored-pause:3.6")
   --snapshotter value                        (agent/runtime) Override default containerd snapshotter (default: "overlayfs")
   --private-registry value                   (agent/runtime) Private registry configuration file (default: "/etc/rancher/k3s/registries.yaml")
   --node-ip value, -i value                  (agent/networking) IPv4/IPv6 addresses to advertise for node
   --node-external-ip value                   (agent/networking) IPv4/IPv6 external IP addresses to advertise for node
   --resolv-conf value                        (agent/networking) Kubelet resolv.conf file [$K3S_RESOLV_CONF]
   --flannel-iface value                      (agent/networking) Override default flannel interface
   --flannel-conf value                       (agent/networking) Override default flannel config file
   --flannel-cni-conf value                   (agent/networking) Override default flannel cni config file
   --kubelet-arg value                        (agent/flags) Customized flag for kubelet process
   --kube-proxy-arg value                     (agent/flags) Customized flag for kube-proxy process
   --rootless                                 (experimental) Run rootless
   --prefer-bundled-bin                       (experimental) Prefer bundled userspace binaries over host binaries
   --docker                                   (agent/runtime) (experimental) Use cri-dockerd instead of containerd
```
