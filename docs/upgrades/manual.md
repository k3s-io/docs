---
title: "Manual Upgrades"
weight: 10
---

You can upgrade K3s by using the installation script, or by manually installing the binary of the desired version.

:::note
When upgrading, upgrade server nodes first one at a time, then any agent nodes.
:::

### Release Channels

Upgrades performed via the installation script or using our [automated upgrades](automated.md) feature can be tied to different release channels. The following channels are available:

| Channel        |   Description  |
|----------------|---------|
| stable         | (Default) Stable is recommended for production environments. These releases have been through a period of community hardening. |
| latest         | Latest is recommended for trying out the latest features.  These releases have not yet been through a period of community hardening. |
| v1.26 (example)| There is a release channel tied to each Kubernetes minor version, including versions that are end-of-life. These channels will select the latest patch available, not necessarily a stable release. |

For an exhaustive and up-to-date list of channels, you can visit the [k3s channel service API](https://update.k3s.io/v1-release/channels). For more technical details on how channels work, you see the [channelserver project](https://github.com/rancher/channelserver).

:::tip
When attempting to upgrade to a new version of K3s, the [Kubernetes version skew policy](https://kubernetes.io/docs/setup/release/version-skew-policy/) applies. Ensure that your plan does not skip intermediate minor versions when upgrading. The system-upgrade-controller itself will not protect against unsupported changes to the Kubernetes version.
:::

### Upgrade K3s Using the Installation Script

To upgrade K3s from an older version you can re-run the installation script using the same configuration options you originally used when running the install script.

:::info Note
The `INSTALL_K3S_EXEC` variable, `K3S_` variables, and trailing shell arguments are all used by the install script to generate the systemd unit and environment file.
If you set configuration when originally running the install script, but do not set it again when re-running the install script, the original values will be lost.

The contents of the [configuration file](../installation/configuration.md#configuration-file) are not managed by the install script.
If you want your configuration to be independent from the install script, you should use a configuration file instead of passing environment variables or arguments to the install script.
:::

For example, to upgrade to the current stable release:

```sh
curl -sfL https://get.k3s.io | <EXISTING_K3S_ENV> sh -s - <EXISTING_K3S_ARGS>
```

If you want to upgrade to a newer version in a specific channel (such as latest) you can specify the channel:
```sh
curl -sfL https://get.k3s.io | INSTALL_K3S_CHANNEL=latest <EXISTING_K3S_ENV> sh -s - <EXISTING_K3S_ARGS>
```

If you want to upgrade to a specific version you can run the following command:

```sh
curl -sfL https://get.k3s.io | INSTALL_K3S_VERSION=vX.Y.Z-rc1 <EXISTING_K3S_ENV> sh -s - <EXISTING_K3S_ARGS>
```

### Manually Upgrade K3s Using the Binary

Or to manually upgrade K3s:

1. Download the desired version of the K3s binary from [releases](https://github.com/k3s-io/k3s/releases)
2. Copy the downloaded binary to `/usr/local/bin/k3s` (or your desired location)
3. Stop the old k3s binary
4. Launch the new k3s binary

### Restarting K3s

Restarting K3s is supported by the installation script for systemd and OpenRC.

**systemd**

To restart servers manually:
```sh
sudo systemctl restart k3s
```

To restart agents manually:
```sh
sudo systemctl restart k3s-agent
```

**OpenRC**

To restart servers manually:
```sh
sudo service k3s restart
```

To restart agents manually:
```sh
sudo service k3s-agent restart
```
