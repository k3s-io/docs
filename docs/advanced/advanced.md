---
title: "Advanced Options / Configuration"
weight: 45
aliases:
  - /k3s/latest/en/running/
  - /k3s/latest/en/configuration/
---

This section contains advanced information describing the different ways you can run and manage K3s, as well as steps necessary to prepare the host OS for K3s use.

## Certificate Management

### Certificate Authority Certificates

K3s generates self-signed Certificate Authority (CA) Certificates during startup of the first server node. These CA certificates are valid for 10 years, and are not automatically renewed.

For information on using custom CA certificates, or renewing the self-signed CA certificates, see the [`k3s certificate rotate-ca` command documentation](../cli/certificate.md#certificate-authority-ca-certificates).

### Client and Server certificates

K3s client and server certificates are valid for 365 days from their date of issuance. Any certificates that are expired, or within 90 days of expiring, are automatically renewed every time K3s starts.

For information on manually rotating client and server certificates, see the [`k3s certificate rotate` command documentation](../cli/certificate.md#client-and-server-certificates).

## Token Management

By default, K3s uses a single static token for both servers and agents. This token cannot be changed once the cluster has been created.
It is possible to enable a second static token that can only be used to join agents, or to create temporary `kubeadm` style join tokens that expire automatically.
For more information, see the [`k3s token` command documentation](../cli/token.md).

## Configuring an HTTP proxy

If you are running K3s in an environment, which only has external connectivity through an HTTP proxy, you can configure your proxy settings on the K3s systemd service. These proxy settings will then be used in K3s and passed down to the embedded containerd and kubelet.

The K3s installation script will automatically take the `HTTP_PROXY`, `HTTPS_PROXY` and `NO_PROXY`, as well as the `CONTAINERD_HTTP_PROXY`, `CONTAINERD_HTTPS_PROXY` and `CONTAINERD_NO_PROXY` variables from the current shell, if they are present, and write them to the environment file of your systemd service, usually:

- `/etc/systemd/system/k3s.service.env`
- `/etc/systemd/system/k3s-agent.service.env`

Of course, you can also configure the proxy by editing these files.

K3s will automatically add the cluster internal Pod and Service IP ranges and cluster DNS domain to the list of `NO_PROXY` entries. You should ensure that the IP address ranges used by the Kubernetes nodes themselves (i.e. the public and private IPs of the nodes) are included in the `NO_PROXY` list, or that the nodes can be reached through the proxy.

```
HTTP_PROXY=http://your-proxy.example.com:8888
HTTPS_PROXY=http://your-proxy.example.com:8888
NO_PROXY=127.0.0.0/8,10.0.0.0/8,172.16.0.0/12,192.168.0.0/16
```

If you want to configure the proxy settings for containerd without affecting K3s and the Kubelet, you can prefix the variables with `CONTAINERD_`:

```
CONTAINERD_HTTP_PROXY=http://your-proxy.example.com:8888
CONTAINERD_HTTPS_PROXY=http://your-proxy.example.com:8888
CONTAINERD_NO_PROXY=127.0.0.0/8,10.0.0.0/8,172.16.0.0/12,192.168.0.0/16
```

## Using Docker as the Container Runtime

K3s includes and defaults to [containerd](https://containerd.io/), an industry-standard container runtime.
As of Kubernetes 1.24, the Kubelet no longer includes dockershim, the component that allows the kubelet to communicate with dockerd.
K3s 1.24 and higher include [cri-dockerd](https://github.com/Mirantis/cri-dockerd), which allows seamless upgrade from prior releases of K3s while continuing to use the Docker container runtime.

To use Docker instead of containerd:

1. Install Docker on the K3s node. One of Rancher's [Docker installation scripts](https://github.com/rancher/install-docker) can be used to install Docker:

    ```bash
    curl https://releases.rancher.com/install-docker/20.10.sh | sh
    ```

2. Install K3s using the `--docker` option:

    ```bash
    curl -sfL https://get.k3s.io | sh -s - --docker
    ```

3. Confirm that the cluster is available:

    ```bash
    $ sudo k3s kubectl get pods --all-namespaces
    NAMESPACE     NAME                                     READY   STATUS      RESTARTS   AGE
    kube-system   local-path-provisioner-6d59f47c7-lncxn   1/1     Running     0          51s
    kube-system   metrics-server-7566d596c8-9tnck          1/1     Running     0          51s
    kube-system   helm-install-traefik-mbkn9               0/1     Completed   1          51s
    kube-system   coredns-8655855d6-rtbnb                  1/1     Running     0          51s
    kube-system   svclb-traefik-jbmvl                      2/2     Running     0          43s
    kube-system   traefik-758cd5fc85-2wz97                 1/1     Running     0          43s
    ```

4. Confirm that the Docker containers are running:

    ```bash
    $ sudo docker ps
    CONTAINER ID        IMAGE                     COMMAND                  CREATED              STATUS              PORTS               NAMES
    3e4d34729602        897ce3c5fc8f              "entry"                  About a minute ago   Up About a minute                       k8s_lb-port-443_svclb-traefik-jbmvl_kube-system_d46f10c6-073f-4c7e-8d7a-8e7ac18f9cb0_0
    bffdc9d7a65f        rancher/klipper-lb        "entry"                  About a minute ago   Up About a minute                       k8s_lb-port-80_svclb-traefik-jbmvl_kube-system_d46f10c6-073f-4c7e-8d7a-8e7ac18f9cb0_0
    436b85c5e38d        rancher/library-traefik   "/traefik --configfi…"   About a minute ago   Up About a minute                       k8s_traefik_traefik-758cd5fc85-2wz97_kube-system_07abe831-ffd6-4206-bfa1-7c9ca4fb39e7_0
    de8fded06188        rancher/pause:3.1         "/pause"                 About a minute ago   Up About a minute                       k8s_POD_svclb-traefik-jbmvl_kube-system_d46f10c6-073f-4c7e-8d7a-8e7ac18f9cb0_0
    7c6a30aeeb2f        rancher/pause:3.1         "/pause"                 About a minute ago   Up About a minute                       k8s_POD_traefik-758cd5fc85-2wz97_kube-system_07abe831-ffd6-4206-bfa1-7c9ca4fb39e7_0
    ae6c58cab4a7        9d12f9848b99              "local-path-provisio…"   About a minute ago   Up About a minute                       k8s_local-path-provisioner_local-path-provisioner-6d59f47c7-lncxn_kube-system_2dbd22bf-6ad9-4bea-a73d-620c90a6c1c1_0
    be1450e1a11e        9dd718864ce6              "/metrics-server"        About a minute ago   Up About a minute                       k8s_metrics-server_metrics-server-7566d596c8-9tnck_kube-system_031e74b5-e9ef-47ef-a88d-fbf3f726cbc6_0
    4454d14e4d3f        c4d3d16fe508              "/coredns -conf /etc…"   About a minute ago   Up About a minute                       k8s_coredns_coredns-8655855d6-rtbnb_kube-system_d05725df-4fb1-410a-8e82-2b1c8278a6a1_0
    c3675b87f96c        rancher/pause:3.1         "/pause"                 About a minute ago   Up About a minute                       k8s_POD_coredns-8655855d6-rtbnb_kube-system_d05725df-4fb1-410a-8e82-2b1c8278a6a1_0
    4b1fddbe6ca6        rancher/pause:3.1         "/pause"                 About a minute ago   Up About a minute                       k8s_POD_local-path-provisioner-6d59f47c7-lncxn_kube-system_2dbd22bf-6ad9-4bea-a73d-620c90a6c1c1_0
    64d3517d4a95        rancher/pause:3.1         "/pause"
    ```

## Using etcdctl

etcdctl provides a CLI for interacting with etcd servers. K3s does not bundle etcdctl.

If you would like to use etcdctl to interact with K3s's embedded etcd, install etcdctl using the [official documentation](https://etcd.io/docs/latest/install/).

```bash
ETCD_VERSION="v3.5.5"
ETCD_URL="https://github.com/etcd-io/etcd/releases/download/${ETCD_VERSION}/etcd-${ETCD_VERSION}-linux-amd64.tar.gz"
curl -sL ${ETCD_URL} | sudo tar -zxv --strip-components=1 -C /usr/local/bin
```

You may then use etcdctl by configuring it to use the K3s-managed certificates and keys for authentication:

```bash
sudo etcdctl version \
  --cacert=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt \
  --cert=/var/lib/rancher/k3s/server/tls/etcd/client.crt \
  --key=/var/lib/rancher/k3s/server/tls/etcd/client.key
```

## Configuring containerd

K3s will generate config.toml for containerd in `/var/lib/rancher/k3s/agent/etc/containerd/config.toml`.

For advanced customization for this file you can create another file called `config.toml.tmpl` in the same directory, and it will be used instead.

The `config.toml.tmpl` will be treated as a Go template file, and the `config.Node` structure is being passed to the template. See [this folder](https://github.com/k3s-io/k3s/blob/master/pkg/agent/templates) for Linux and Windows examples on how to use the structure to customize the configuration file.
The config.Node golang struct is defined [here](https://github.com/k3s-io/k3s/blob/master/pkg/daemons/config/types.go#L37)

### Base template

:::info Version Gate
Available as of September 2023 releases: v1.24.17+k3s1, v1.25.13+k3s1, v1.26.8+k3s1, v1.27.5+k3s1, v1.28.1+k3s1
:::

You can extend the K3s base template instead of copy-pasting the complete stock template out of the K3s source code. This is useful if you need to build on the existing configuration, and add a few extra lines at the end.

```toml
#/var/lib/rancher/k3s/agent/etc/containerd/config.toml.tmpl

{{ template "base" . }}

[plugins."io.containerd.grpc.v1.cri".containerd.runtimes."custom"]
  runtime_type = "io.containerd.runc.v2"
[plugins."io.containerd.grpc.v1.cri".containerd.runtimes."custom".options]
  BinaryName = "/usr/bin/custom-container-runtime"

```
## NVIDIA Container Runtime Support

K3s will automatically detect and configure the NVIDIA container runtime if it is present when K3s starts.

1. Install the nvidia-container package repository on the node by following the instructions at:
    https://nvidia.github.io/libnvidia-container/
1. Install the nvidia container runtime packages. For example:
   `apt install -y nvidia-container-runtime cuda-drivers-fabricmanager-515 nvidia-headless-515-server`
1. Install K3s, or restart it if already installed:
    `curl -ksL get.k3s.io | sh -`
1. Confirm that the nvidia container runtime has been found by k3s:
    `grep nvidia /var/lib/rancher/k3s/agent/etc/containerd/config.toml`

This will automatically add `nvidia` and/or `nvidia-experimental` runtimes to the containerd configuration, depending on what runtime executables are found.
You must still add a RuntimeClass definition to your cluster, and deploy Pods that explicitly request the appropriate runtime by setting `runtimeClassName: nvidia` in the Pod spec:
```yaml
apiVersion: node.k8s.io/v1
kind: RuntimeClass
metadata:
  name: nvidia
handler: nvidia
---
apiVersion: v1
kind: Pod
metadata:
  name: nbody-gpu-benchmark
  namespace: default
spec:
  restartPolicy: OnFailure
  runtimeClassName: nvidia
  containers:
  - name: cuda-container
    image: nvcr.io/nvidia/k8s/cuda-sample:nbody
    args: ["nbody", "-gpu", "-benchmark"]
    resources:
      limits:
        nvidia.com/gpu: 1
    env:
    - name: NVIDIA_VISIBLE_DEVICES
      value: all
    - name: NVIDIA_DRIVER_CAPABILITIES
      value: all
```

Note that the NVIDIA Container Runtime is also frequently used with the [NVIDIA Device Plugin](https://github.com/NVIDIA/k8s-device-plugin/) and [GPU Feature Discovery](https://github.com/NVIDIA/gpu-feature-discovery/), which must be installed separately, with modifications to ensure that pod specs include `runtimeClassName: nvidia`, as mentioned above.

## Running Agentless Servers (Experimental)
> **Warning:** This feature is experimental.

When started with the `--disable-agent` flag, servers do not run the kubelet, container runtime, or CNI. They do not register a Node resource in the cluster, and will not appear in `kubectl get nodes` output.
Because they do not host a kubelet, they cannot run pods or be managed by operators that rely on enumerating cluster nodes, including the embedded etcd controller and the system upgrade controller.

Running agentless servers may be advantageous if you want to obscure your control-plane nodes from discovery by agents and workloads, at the cost of increased administrative overhead caused by lack of cluster operator support.

By default, the apiserver on agentless servers will not be able to make outgoing connections to admission webhooks or aggregated apiservices running within the cluster. To remedy this, set the `--egress-selector-mode` server flag to either `pod` or `cluster`. If you are changing this flag on an existing cluster, you'll need to restart all nodes in the cluster for the option to take effect.

## Running Rootless Servers (Experimental)
> **Warning:** This feature is experimental.

Rootless mode allows running K3s servers as an unprivileged user, so as to protect the real root on the host from potential container-breakout attacks.

See https://rootlesscontaine.rs/ to learn more about Rootless Kubernetes.

### Known Issues with Rootless mode

* **Ports**

  When running rootless a new network namespace is created.  This means that K3s instance is running with networking fairly detached from the host.
  The only way to access Services run in K3s from the host is to set up port forwards to the K3s network namespace.
  Rootless K3s includes controller that will automatically bind 6443 and service ports below 1024 to the host with an offset of 10000.

  For example, a Service on port 80 will become 10080 on the host, but 8080 will become 8080 without any offset. Currently, only LoadBalancer Services are automatically bound.

* **Cgroups**

  Cgroup v1 and Hybrid v1/v2 are not supported; only pure Cgroup v2 is supported. If K3s fails to start due to missing cgroups when running rootless, it is likely that your node is in Hybrid mode, and the "missing" cgroups are still bound to a v1 controller.

* **Multi-node/multi-process cluster**

  Multi-node rootless clusters, or multiple rootless k3s processes on the same node, are not currently supported. See [#6488](https://github.com/k3s-io/k3s/issues/6488#issuecomment-1314998091) for more details.

### Starting Rootless Servers
* Enable cgroup v2 delegation, see https://rootlesscontaine.rs/getting-started/common/cgroup2/ .
  This step is required; the rootless kubelet will fail to start without the proper cgroups delegated.

* Download `k3s-rootless.service` from [`https://github.com/k3s-io/k3s/blob/<VERSION>/k3s-rootless.service`](https://github.com/k3s-io/k3s/blob/master/k3s-rootless.service).
  Make sure to use the same version of `k3s-rootless.service` and `k3s`.

* Install `k3s-rootless.service` to `~/.config/systemd/user/k3s-rootless.service`.
  Installing this file as a system-wide service (`/etc/systemd/...`) is not supported.
  Depending on the path of `k3s` binary, you might need to modify the `ExecStart=/usr/local/bin/k3s ...` line of the file.

* Run `systemctl --user daemon-reload`

* Run `systemctl --user enable --now k3s-rootless`

* Run `KUBECONFIG=~/.kube/k3s.yaml kubectl get pods -A`, and make sure the pods are running.

> **Note:** Don't try to run `k3s server --rootless` on a terminal, as terminal sessions do not allow cgroup v2 delegation.
> If you really need to try it on a terminal, use `systemd-run --user -p Delegate=yes --tty k3s server --rooless` to wrap it in a systemd scope.

### Advanced Rootless Configuration

Rootless K3s uses [rootlesskit](https://github.com/rootless-containers/rootlesskit) and [slirp4netns](https://github.com/rootless-containers/slirp4netns) to communicate between host and user network namespaces.
Some of the configuration used by rootlesskit and slirp4nets can be set by environment variables. The best way to set these is to add them to the `Environment` field of the k3s-rootless systemd unit.

| Variable                             | Default      | Description
|--------------------------------------|--------------|------------
| `K3S_ROOTLESS_MTU`                   | 1500         | Sets the MTU for the slirp4netns virtual interfaces.
| `K3S_ROOTLESS_CIDR`                  | 10.41.0.0/16 | Sets the CIDR used by slirp4netns virtual interfaces.
| `K3S_ROOTLESS_ENABLE_IPV6`           | autotedected | Enables slirp4netns IPv6 support. If not specified, it is automatically enabled if K3s is configured for dual-stack operation.
| `K3S_ROOTLESS_PORT_DRIVER`           | builtin      | Selects the rootless port driver; either `builtin` or `slirp4netns`. Builtin is faster, but masquerades the original source address of inbound packets.
| `K3S_ROOTLESS_DISABLE_HOST_LOOPBACK` | true         | Controls whether or not access to the hosts's loopback address via the gateway interface is enabled. It is recommended that this not be changed, for security reasons.

### Troubleshooting Rootless

* Run `systemctl --user status k3s-rootless` to check the daemon status
* Run `journalctl --user -f -u k3s-rootless` to see the daemon log
* See also https://rootlesscontaine.rs/

## Node Labels and Taints

K3s agents can be configured with the options `--node-label` and `--node-taint` which adds a label and taint to the kubelet. The two options only add labels and/or taints [at registration time](../cli/agent.md#node-labels-and-taints-for-agents), so they can only be set when the node is first joined to the cluster.

All current versions of Kubernetes restrict nodes from registering with most labels with `kubernetes.io` and `k8s.io` prefixes, specifically including the `kubernetes.io/role` label. If you attempt to start a node with a disallowed label, K3s will fail to start. As stated by the Kubernetes authors:

> Nodes are not permitted to assert their own role labels. Node roles are typically used to identify privileged or control plane types of nodes, and allowing nodes to label themselves into that pool allows a compromised node to trivially attract workloads (like control plane daemonsets) that confer access to higher privilege credentials.

See [SIG-Auth KEP 279](https://github.com/kubernetes/enhancements/blob/master/keps/sig-auth/279-limit-node-access/README.md#proposal) for more information.

If you want to change node labels and taints after node registration, or add reserved labels, you should use `kubectl`. Refer to the official Kubernetes documentation for details on how to add [taints](https://kubernetes.io/docs/concepts/configuration/taint-and-toleration/) and [node labels.](https://kubernetes.io/docs/tasks/configure-pod-container/assign-pods-nodes/#add-a-label-to-a-node)

## Starting the Service with the Installation Script

The installation script will auto-detect if your OS is using systemd or openrc and enable and start the service as part of the installation process.
* When running with openrc, logs will be created at `/var/log/k3s.log`. 
* When running with systemd, logs will be created in `/var/log/syslog` and viewed using `journalctl -u k3s` (or `journalctl -u k3s-agent` on agents).

An example of disabling auto-starting and service enablement with the install script:

```bash
curl -sfL https://get.k3s.io | INSTALL_K3S_SKIP_START=true INSTALL_K3S_SKIP_ENABLE=true sh -
```

## Running K3s in Docker

There are several ways to run K3s in Docker:

<Tabs>
<TabItem value='K3d' default>

[k3d](https://github.com/k3d-io/k3d) is a utility designed to easily run multi-node K3s clusters in Docker.

k3d makes it very easy to create single- and multi-node k3s clusters in docker, e.g. for local development on Kubernetes.

See the [Installation](https://k3d.io/#installation) documentation for more information on how to install and use k3d.

</TabItem>
<TabItem value="Docker">

To use Docker, `rancher/k3s` images are also available to run the K3s server and agent.
Using the `docker run` command:

```bash
sudo docker run \
  --privileged \
  --name k3s-server-1 \
  --hostname k3s-server-1 \
  -p 6443:6443 \
  -d rancher/k3s:v1.24.10-k3s1 \
  server
```
:::note
You must specify a valid K3s version as the tag; the `latest` tag is not maintained.  
Docker images do not allow a `+` sign in tags, use a `-` in the tag instead.
:::

Once K3s is up and running, you can copy the admin kubeconfig out of the Docker container for use:
```bash
sudo docker cp k3s-server-1:/etc/rancher/k3s/k3s.yaml ~/.kube/config
```

</TabItem>
</Tabs>

## SELinux Support

:::info Version Gate

Available as of v1.19.4+k3s1

:::

If you are installing K3s on a system where SELinux is enabled by default (such as CentOS), you must ensure the proper SELinux policies have been installed. 

<Tabs>
<TabItem value="Automatic Installation" default>

The [install script](../installation/configuration.md#configuration-with-install-script) will automatically install the SELinux RPM from the Rancher RPM repository if on a compatible system if not performing an air-gapped install. Automatic installation can be skipped by setting `INSTALL_K3S_SKIP_SELINUX_RPM=true`.

</TabItem>

<TabItem value="Manual Installation" default>

The necessary policies can be installed with the following commands:
```bash
yum install -y container-selinux selinux-policy-base
yum install -y https://rpm.rancher.io/k3s/latest/common/centos/7/noarch/k3s-selinux-1.4-1.el7.noarch.rpm
```

To force the install script to log a warning rather than fail, you can set the following environment variable: `INSTALL_K3S_SELINUX_WARN=true`.
</TabItem>
</Tabs>

### Enabling SELinux Enforcement

To leverage SELinux, specify the `--selinux` flag when starting K3s servers and agents.
  
This option can also be specified in the K3s [configuration file](../installation/configuration.md#configuration-file).

```
selinux: true
```

Using a custom `--data-dir` under SELinux is not supported. To customize it, you would most likely need to write your own custom policy. For guidance, you could refer to the [containers/container-selinux](https://github.com/containers/container-selinux) repository, which contains the SELinux policy files for Container Runtimes, and the [k3s-io/k3s-selinux](https://github.com/k3s-io/k3s-selinux) repository, which contains the SELinux policy for K3s.

## Enabling Lazy Pulling of eStargz (Experimental)

### What's lazy pulling and eStargz?

Pulling images is known as one of the time-consuming steps in the container lifecycle.
According to [Harter, et al.](https://www.usenix.org/conference/fast16/technical-sessions/presentation/harter),

> pulling packages accounts for 76% of container start time, but only 6.4% of that data is read

To address this issue, k3s experimentally supports *lazy pulling* of image contents.
This allows k3s to start a container before the entire image has been pulled.
Instead, the necessary chunks of contents (e.g. individual files) are fetched on-demand. 
Especially for large images, this technique can shorten the container startup latency.

To enable lazy pulling, the target image needs to be formatted as [*eStargz*](https://github.com/containerd/stargz-snapshotter/blob/main/docs/stargz-estargz.md).
This is an OCI-alternative but 100% OCI-compatible image format for lazy pulling.
Because of the compatibility, eStargz can be pushed to standard container registries (e.g. ghcr.io) as well as this is *still runnable* even on eStargz-agnostic runtimes.

eStargz is developed based on the [stargz format proposed by Google CRFS project](https://github.com/google/crfs) but comes with practical features including content verification and performance optimization.
For more details about lazy pulling and eStargz, please refer to [Stargz Snapshotter project repository](https://github.com/containerd/stargz-snapshotter).

### Configure k3s for lazy pulling of eStargz

As shown in the following, `--snapshotter=stargz` option is needed for k3s server and agent.

```bash
k3s server --snapshotter=stargz
```

With this configuration, you can perform lazy pulling for eStargz-formatted images.
The following example Pod manifest uses eStargz-formatted `node:13.13.0` image (`ghcr.io/stargz-containers/node:13.13.0-esgz`).
When the stargz snapshotter is enabled, K3s performs lazy pulling for this image.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nodejs
spec:
  containers:
  - name: nodejs-estargz
    image: ghcr.io/stargz-containers/node:13.13.0-esgz
    command: ["node"]
    args:
    - -e
    - var http = require('http');
      http.createServer(function(req, res) {
        res.writeHead(200);
        res.end('Hello World!\n');
      }).listen(80);
    ports:
    - containerPort: 80
```

## Additional Logging Sources

[Rancher logging](https://rancher.com/docs/rancher/v2.6/en/logging/helm-chart-options/) for K3s can be installed without using Rancher. The following instructions should be executed to do so:

```bash
helm repo add rancher-charts https://charts.rancher.io
helm repo update
helm install --create-namespace -n cattle-logging-system rancher-logging-crd rancher-charts/rancher-logging-crd
helm install --create-namespace -n cattle-logging-system rancher-logging --set additionalLoggingSources.k3s.enabled=true rancher-charts/rancher-logging
```

## Additional Network Policy Logging

Packets dropped by network policies can be logged. The packet is sent to the iptables NFLOG action, which shows the packet details, including the network policy that blocked it.

If there is a lot of traffic, the number of log messages could be very high. To control the log rate on a per-policy basis, set the `limit` and `limit-burst` iptables parameters by adding the following annotations to the network policy in question:
* `kube-router.io/netpol-nflog-limit=<LIMIT-VALUE>`
* `kube-router.io/netpol-nflog-limit-burst=<LIMIT-BURST-VALUE>`

Default values are `limit=10/minute` and `limit-burst=10`. Check the [iptables manual](https://www.netfilter.org/documentation/HOWTO/packet-filtering-HOWTO-7.html#:~:text=restrict%20the%20rate%20of%20matches) for more information on the format and possible values for these fields.

To convert NFLOG packets to log entries, install ulogd2 and configure `[log1]` to read on `group=100`. Then, restart the ulogd2 service for the new config to be committed.
When a packet is blocked by network policy rules, a log message will appear in `/var/log/ulog/syslogemu.log`.

Packets sent to the NFLOG netlink socket can also be read by using command-line tools like tcpdump or tshark:
```bash
tcpdump -ni nflog:100
```
While more readily available, tcpdump will not show the name of the network policy that blocked the packet. Use wireshark's tshark command instead to display the full NFLOG packet header, including the `nflog.prefix` field that contains the policy name.
