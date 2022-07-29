---
title: "Configuration Options"
weight: 20
---

This page focuses on the options that can be used when you set up K3s for the first time:

- [K3s Install Script](#configuration-with-install-script)
- [K3s Binary](#configuration-with-binary)
- [Configuration File](#configuration-file)

For more advanced options, refer to [this page](/docs/advanced).

## Configuration with install script

As mentioned in the [Quick-Start Guide](/docs/quick-start), you can use the installation script available at https://get.k3s.io to install K3s as a service on systemd and openrc based systems.

You can use a combination of `INSTALL_K3S_EXEC`, `K3S_` environment variables, and command flags to configure the installation.

To illustrate this, the following commands all result in the same behavior of registering a server without flannel and with a token:

```bash
curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="--flannel-backend none --token 12345" sh -s -
curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="server --flannel-backend none" K3S_TOKEN=12345 sh -s -
curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="server" sh -s - --flannel-backend none
curl -sfL https://get.k3s.io | K3S_TOKEN=12345 sh -s - server --flannel-backend none
curl -sfL https://get.k3s.io | sh -s - --flannel-backend none --token 12345
```

For details on all environment variables, see [Environment Variables.](/docs/reference/env-variables)

## Configuration with binary

As stated, the installation script is primarily concerned with configuring K3s to run as a service.  
If you choose to not use the script, you can run K3s simply by downloading the binary from our [release page](https://github.com/rancher/k3s/releases/latest), placing it on your path, and executing it. Or you can install K3s without enabling it as a service:
```bash
curl -sfL https://get.k3s.io | INSTALL_K3S_SKIP_ENABLE=true sh -
```

You can configure K3s in this manner through `K3S_` environment variables:
```bash
K3S_KUBECONFIG_MODE="644" k3s server
```
Or command flags:
```bash
k3s server --write-kubeconfig-mode 644
```

The k3s agent can also be configured this way:

```bash
k3s agent --server https://k3s.example.com --token mypassword
```

For details on configuring the K3s server, see [Server Configuration.](/docs/reference/server-config)  
For details on configuring the K3s agent, see [Agent Configuration.](/docs/reference/agent-config)  
You can also use the `--help` flag to see a list of all available options.

## Configuration File

:::info Version Gate

Available as of [v1.19.1+k3s1](https://github.com/k3s-io/k3s/releases/tag/v1.19.1%2Bk3s1)

:::

In addition to configuring K3s with environment variables and CLI arguments, K3s can also use a config file.

By default, values present in a YAML file located at `/etc/rancher/k3s/config.yaml` will be used on install.

An example of a basic `server` config file is below:

```yaml
write-kubeconfig-mode: "0644"
tls-san:
  - "foo.local"
node-label:
  - "foo=bar"
  - "something=amazing"
```

In general, CLI arguments map to their respective YAML key, with repeatable CLI arguments being represented as YAML lists.

An identical configuration using only CLI arguments is shown below to demonstrate this:

```bash
k3s server \
  --write-kubeconfig-mode "0644"    \
  --tls-san "foo.local"             \
  --node-label "foo=bar"            \
  --node-label "something=amazing"
```

It is also possible to use both a configuration file and CLI arguments. In these situations, values will be loaded from both sources, but CLI arguments will take precedence. For repeatable arguments such as `--node-label`, the CLI arguments will overwrite all values in the list.

Finally, the location of the config file can be changed either through the CLI argument `--config FILE, -c FILE`, or the environment variable `$K3S_CONFIG_FILE`.

## Putting it all together

All of the above options can be combined into a single example.

A `config.yaml` file is created at `/etc/rancher/k3s/config.yaml`:

```yaml
token: "secret"
debug: true
```

Then the installation script is run with a combination of environment variables and flags:

```bash
curl -sfL https://get.k3s.io | K3S_KUBECONFIG_MODE="644" INSTALL_K3S_EXEC="server" sh -s - --flannel-backend none
```

Or if you have already installed the K3s Binary:
```bash
K3S_KUBECONFIG_MODE="644" k3s server --flannel-backend none
```