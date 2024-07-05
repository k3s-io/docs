---
title: "Air-Gap Install"
---

You can install K3s in an air-gapped environment using two different methods. An air-gapped environment is any environment that is not directly connected to the Internet. You can either deploy a private registry and mirror docker.io, or you can manually deploy images such as for small clusters.

## Load Images

### Private Registry Method

These steps assume you have already created nodes in your air-gap environment,
are using the bundled containerd as the container runtime,
and have a OCI-compliant private registry available in your environment.

If you have not yet set up a private Docker registry, refer to the [official Registry documentation](https://docs.docker.com/registry/deploying/#run-an-externally-accessible-registry).

#### Create the Registry YAML and Push Images

1. Obtain the images archive for your architecture from the [releases](https://github.com/k3s-io/k3s/releases) page for the version of K3s you will be running.
2. Use `docker image load k3s-airgap-images-amd64.tar.zst` to import images from the tar file into docker.
3. Use `docker tag` and `docker push` to retag and push the loaded images to your private registry.
4. Follow the [Private Registry Configuration](private-registry.md) guide to create and configure the `registries.yaml` file.
5. Proceed to the [Install K3s](#install-k3s) section below.

### Manually Deploy Images Method

These steps assume you have already created nodes in your air-gap environment,
are using the bundled containerd as the container runtime,
and cannot or do not want to use a private registry.

This method requires you to manually deploy the necessary images to each node, and is appropriate for edge deployments where running a private registry is not practical.

#### Prepare the Images Directory and Airgap Image Tarball

1. Obtain the images archive for your architecture from the [releases](https://github.com/k3s-io/k3s/releases) page for the version of K3s you will be running.
2. Download the images archive to the agent's images directory, for example:
  ```bash
  sudo mkdir -p /var/lib/rancher/k3s/agent/images/
  sudo curl -L -o /var/lib/rancher/k3s/agent/images/k3s-airgap-images-amd64.tar.zst "https://github.com/k3s-io/k3s/releases/download/v1.29.1-rc2%2Bk3s1/k3s-airgap-images-amd64.tar.zst"
  ```
3. Proceed to the [Install K3s](#install-k3s) section below.

### Embedded Registry Mirror

:::info Version Gate
The Embedded Registry Mirror is available as an experimental feature as of January 2024 releases: v1.26.13+k3s1, v1.27.10+k3s1, v1.28.6+k3s1, v1.29.1+k3s1
:::

K3s includes an embedded distributed OCI-compliant registry mirror.
When enabled and properly configured, images available in the containerd image store on any node
can be pulled by other cluster members without access to an external image registry.

The mirrored images may be sourced from an upstream registry, registry mirror, or airgap image tarball.
For more information on enabling the embedded distributed registry mirror, see the [Embedded Registry Mirror](./registry-mirror.md) documentation.

## Install K3s

### Prerequisites

Before installing K3s, complete the [Private Registry Method](#private-registry-method) or the [Manually Deploy Images Method](#manually-deploy-images-method) above to prepopulate the images that K3s needs to install.

#### Binaries
- Download the K3s binary from the [releases](https://github.com/k3s-io/k3s/releases) page, matching the same version used to get the airgap images. Place the binary in `/usr/local/bin` on each air-gapped node and ensure it is executable.
- Download the K3s install script at [get.k3s.io](https://get.k3s.io). Place the install script anywhere on each air-gapped node, and name it `install.sh`.

#### Default Network Route
If your nodes do not have an interface with a default route, a default route must be configured; even a black-hole route via a dummy interface will suffice. K3s requires a default route in order to auto-detect the node's primary IP, and for kube-proxy ClusterIP routing to function properly. To add a dummy route, do the following:
  ```
  ip link add dummy0 type dummy
  ip link set dummy0 up
  ip addr add 203.0.113.254/31 dev dummy0
  ip route add default via 203.0.113.255 dev dummy0 metric 1000
  ```

When running the K3s script with the `INSTALL_K3S_SKIP_DOWNLOAD` environment variable, K3s will use the local version of the script and binary.

#### SELinux RPM

If you intend to deploy K3s with SELinux enabled, you will need also install the appropriate k3s-selinux RPM on all nodes. The latest version of the RPM can be found [here](https://github.com/k3s-io/k3s-selinux/releases/latest). For example, on CentOS 8:

```bash
On internet accessible machine:
curl -LO https://github.com/k3s-io/k3s-selinux/releases/download/v1.4.stable.1/k3s-selinux-1.4-1.el8.noarch.rpm

# Transfer RPM to air-gapped machine
On air-gapped machine:
sudo yum install ./k3s-selinux-1.4-1.el8.noarch.rpm
```

See the [SELinux](../advanced.md#selinux-support) section for more information.

### Installing K3s in an Air-Gapped Environment

You can install K3s on one or more servers as described below.

<Tabs>
<TabItem value="Single Server Configuration" default>

To install K3s on a single server, simply do the following on the server node:

```bash
INSTALL_K3S_SKIP_DOWNLOAD=true ./install.sh
```

To add additional agents, do the following on each agent node: 

```bash
INSTALL_K3S_SKIP_DOWNLOAD=true K3S_URL=https://<SERVER_IP>:6443 K3S_TOKEN=<YOUR_TOKEN> ./install.sh
```

:::note
The token from the server is typically found at `/var/lib/rancher/k3s/server/token`.
:::

</TabItem>
<TabItem value="High Availability Configuration" default>

Reference the [High Availability with an External DB](../datastore/ha.md) or [High Availability with Embedded DB](../datastore/ha-embedded.md) guides. You will be tweaking install commands so you specify `INSTALL_K3S_SKIP_DOWNLOAD=true` and run your install script locally instead of via curl. You will also utilize `INSTALL_K3S_EXEC='args'` to supply any arguments to k3s.

For example, step two of the High Availability with an External DB guide mentions the following:

```bash
curl -sfL https://get.k3s.io | sh -s - server \
  --token=SECRET \
  --datastore-endpoint="mysql://username:password@tcp(hostname:3306)/database-name"
```

Instead, you would modify such examples like below:

```bash
INSTALL_K3S_SKIP_DOWNLOAD=true INSTALL_K3S_EXEC='server --token=SECRET' \
K3S_DATASTORE_ENDPOINT='mysql://username:password@tcp(hostname:3306)/database-name' \
./install.sh
```

</TabItem>
</Tabs>

:::note
K3s's `--resolv-conf` flag is passed through to the kubelet, which may help with configuring pod DNS resolution in air-gap networks where the host does not have upstream nameservers configured.
:::

## Upgrading

### Install Script Method

Upgrading an air-gap environment can be accomplished in the following manner:

1. Download the new air-gap images (tar file) from the [releases](https://github.com/k3s-io/k3s/releases) page for the version of K3s you will be upgrading to. Place the tar in the `/var/lib/rancher/k3s/agent/images/` directory on each
node. Delete the old tar file.
2. Copy and replace the old K3s binary in `/usr/local/bin` on each node. Copy over the install script at https://get.k3s.io (as it is possible it has changed since the last release). Run the script again just as you had done in the past
with the same environment variables.
3. Restart the K3s service (if not restarted automatically by installer).


### Automated Upgrades Method

K3s supports [automated upgrades](../upgrades/automated.md). To enable this in air-gapped environments, you must ensure the required images are available in your private registry.

You will need the version of rancher/k3s-upgrade that corresponds to the version of K3s you intend to upgrade to. Note, the image tag replaces the `+` in the K3s release with a `-` because Docker images do not support `+`.

You will also need the versions of system-upgrade-controller and kubectl that are specified in the system-upgrade-controller manifest YAML that you will deploy. Check for the latest release of the system-upgrade-controller [here](https://github.com/rancher/system-upgrade-controller/releases/latest) and download the system-upgrade-controller.yaml to determine the versions you need to push to your private registry. For example, in release v0.4.0 of the system-upgrade-controller, these images are specified in the manifest YAML:

```
rancher/system-upgrade-controller:v0.4.0
rancher/kubectl:v0.17.0
```

Once you have added the necessary rancher/k3s-upgrade, rancher/system-upgrade-controller, and rancher/kubectl images to your private registry, follow the [automated upgrades](../upgrades/automated.md) guide.
