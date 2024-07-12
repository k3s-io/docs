---
title: Environment Variables
---

As mentioned in the [Quick-Start Guide](../quick-start.md), you can use the installation script available at https://get.k3s.io to install K3s as a service on systemd and openrc based systems.

The simplest form of this command is as follows:

```bash
curl -sfL https://get.k3s.io | sh -
```

When using this method to install K3s, the following environment variables can be used to configure the installation:

| Environment Variable | Description |
|-----------------------------|---------------------------------------------|
| `INSTALL_K3S_SKIP_DOWNLOAD` | If set to true will not download K3s hash or binary. |
| `INSTALL_K3S_SYMLINK` | By default will create symlinks for the kubectl, crictl, and ctr binaries if the commands do not already exist in path. If set to 'skip' will not create symlinks and 'force' will overwrite. |
| `INSTALL_K3S_SKIP_ENABLE` | If set to true will not enable or start K3s service. |
| `INSTALL_K3S_SKIP_START` | If set to true will not start K3s service. |
| `INSTALL_K3S_VERSION` | Version of K3s to download from Github. Will attempt to download from the stable channel if not specified. |
| `INSTALL_K3S_BIN_DIR` | Directory to install K3s binary, links, and uninstall script to, or use `/usr/local/bin` as the default. |
| `INSTALL_K3S_BIN_DIR_READ_ONLY` | If set to true will not write files to `INSTALL_K3S_BIN_DIR`, forces setting `INSTALL_K3S_SKIP_DOWNLOAD=true`. |
| `INSTALL_K3S_SYSTEMD_DIR` | Directory to install systemd service and environment files to, or use `/etc/systemd/system` as the default. |
| `INSTALL_K3S_EXEC` | Command with flags to use for launching K3s in the service. If the command is not specified, and the `K3S_URL` is set, it will default to "agent." If `K3S_URL` not set, it will default to "server." For help, refer to [this example.](../installation/configuration.md#configuration-with-install-script) |
| `INSTALL_K3S_NAME` | Name of systemd service to create, will default to 'k3s' if running k3s as a server and 'k3s-agent' if running k3s as an agent. If specified the name will be prefixed with 'k3s-'. |
| `INSTALL_K3S_TYPE` | Type of systemd service to create, will default from the K3s exec command if not specified. |
| `INSTALL_K3S_SELINUX_WARN` | If set to true will continue if k3s-selinux policy is not found. |
| `INSTALL_K3S_SKIP_SELINUX_RPM` | If set to true will skip automatic installation of the k3s RPM. |
| `INSTALL_K3S_CHANNEL_URL` | Channel URL for fetching K3s download URL. Defaults to https://update.k3s.io/v1-release/channels. |
| `INSTALL_K3S_CHANNEL` | Channel to use for fetching K3s download URL. Defaults to "stable". Options include: `stable`, `latest`, `testing`. |

This example shows where to place aforementioned environment variables as options (after the pipe):

```bash
curl -sfL https://get.k3s.io | INSTALL_K3S_CHANNEL=latest sh -
```

Environment variables which begin with `K3S_` will be preserved for the systemd and openrc services to use.

Setting `K3S_URL` without explicitly setting an exec command will default the command to "agent".

When running the agent, `K3S_TOKEN` must also be set.