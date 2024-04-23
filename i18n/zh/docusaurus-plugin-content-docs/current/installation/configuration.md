---
title: "Configuration Options"
---

This page focuses on the options that are commonly used when setting up K3s for the first time. Refer to the documentation on [Advanced Options and Configuration](../advanced.md) and the [server](../cli/server.md) and [agent](../cli/agent.md) command documentation for more in-depth coverage.

## Configuration with install script

As mentioned in the [Quick-Start Guide](../quick-start.md), you can use the installation script available at https://get.k3s.io to install K3s as a service on systemd and openrc based systems.

You can use a combination of `INSTALL_K3S_EXEC`, `K3S_` environment variables, and command flags to pass configuration to the service configuration.
The prefixed environment variables, `INSTALL_K3S_EXEC` value, and trailing shell arguments are all persisted into the service configuration.
After installation, configuration may be altered by editing the environment file, editing the service configuration, or simply re-running the installer with new options.

To illustrate this, the following commands all result in the same behavior of registering a server without flannel and with a token:

```bash
curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="server" sh -s - --flannel-backend none --token 12345
curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="server --flannel-backend none" K3S_TOKEN=12345 sh -s -
curl -sfL https://get.k3s.io | K3S_TOKEN=12345 sh -s - server --flannel-backend none
# server is assumed below because there is no K3S_URL
curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="--flannel-backend none --token 12345" sh -s - 
curl -sfL https://get.k3s.io | sh -s - --flannel-backend none --token 12345
```

When registering an agent, the following commands all result in the same behavior:

```bash
curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="agent --server https://k3s.example.com --token mypassword" sh -s -
curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="agent" K3S_TOKEN="mypassword" sh -s - --server https://k3s.example.com
curl -sfL https://get.k3s.io | K3S_URL=https://k3s.example.com sh -s - agent --token mypassword
curl -sfL https://get.k3s.io | K3S_URL=https://k3s.example.com K3S_TOKEN=mypassword sh -s - # agent is assumed because of K3S_URL
```

For details on all environment variables, see [Environment Variables.](../reference/env-variables.md)

:::info Note
If you set configuration when running the install script, but do not set it again when re-running the install script, the original values will be lost.

The contents of the [configuration file](#configuration-file) are not managed by the install script.
If you want your configuration to be independent from the install script, you should use a configuration file instead of passing environment variables or arguments to the install script.
:::

## Configuration with binary

As stated, the installation script is primarily concerned with configuring K3s to run as a service.  
If you choose to not use the script, you can run K3s simply by downloading the binary from our [release page](https://github.com/k3s-io/k3s/releases/latest), placing it on your path, and executing it. This is not particularly useful for permanent installations, but may be useful when performing quick tests that do not merit managing K3s as a system service.
```bash
curl -Lo /usr/local/bin/k3s https://github.com/k3s-io/k3s/releases/download/v1.26.5+k3s1/k3s; chmod a+x /usr/local/bin/k3s
```

You can pass configuration by setting `K3S_` environment variables:
```bash
K3S_KUBECONFIG_MODE="644" k3s server
```

Or command flags:
```bash
k3s server --write-kubeconfig-mode=644
```

The k3s agent can also be configured this way:

```bash
k3s agent --server https://k3s.example.com --token mypassword
```

For details on configuring the K3s server, see the [`k3s server` documentation](../cli/server.md).  
For details on configuring the K3s agent, see the [`k3s agent` documentation](../cli/agent.md).  
You can also use the `--help` flag to see a list of all available options, and their corresponding environment variables.

:::info Matching Flags
It is important to match critical flags on your server nodes. For example, if you use the flag
`--disable servicelb` or `--cluster-cidr=10.200.0.0/16` on your master node, but don't set it on other server nodes, the nodes will fail to join. They will print errors such as:
`failed to validate server configuration: critical configuration value mismatch.`
See the Server Configuration documentation (linked above) for more information on which flags must be set identically on server nodes.
:::
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
cluster-init: true
```

This is equivalent to the following CLI arguments:

```bash
k3s server \
  --write-kubeconfig-mode "0644"    \
  --tls-san "foo.local"             \
  --node-label "foo=bar"            \
  --node-label "something=amazing"  \
  --cluster-init
```

In general, CLI arguments map to their respective YAML key, with repeatable CLI arguments being represented as YAML lists. Boolean flags are represented as `true` or `false` in the YAML file.

It is also possible to use both a configuration file and CLI arguments. In these situations, values will be loaded from both sources, but CLI arguments will take precedence. For repeatable arguments such as `--node-label`, the CLI arguments will overwrite all values in the list.

Finally, the location of the config file can be changed either through the CLI argument `--config FILE, -c FILE`, or the environment variable `$K3S_CONFIG_FILE`.

### Multiple Config Files
:::info Version Gate
Available as of [v1.21.0+k3s1](https://github.com/k3s-io/k3s/releases/tag/v1.21.0%2Bk3s1)
:::

Multiple configuration files are supported. By default, configuration files are read from `/etc/rancher/k3s/config.yaml` and `/etc/rancher/k3s/config.yaml.d/*.yaml` in alphabetical order. 

By default, the last value found for a given key will be used. A `+` can be appended to the key to append the value to the existing string or slice, instead of replacing it. All occurrences of this key in subsequent files will also require a `+` to prevent overwriting the accumulated value.

An example of multiple config files is below:

```yaml
# config.yaml
token: boop
node-label:
  - foo=bar
  - bar=baz


# config.yaml.d/test1.yaml
write-kubeconfig-mode: 600
node-taint:
  - alice=bob:NoExecute

# config.yaml.d/test2.yaml
write-kubeconfig-mode: 777
node-label:
  - other=what
  - foo=three
node-taint+:
  - charlie=delta:NoSchedule

```

This results in a final configuration of:

```yaml
write-kubeconfig-mode: 777
token: boop
node-label:
  - other=what
  - foo=three
node-taint:
  - alice=bob:NoExecute
  - charlie=delta:NoSchedule
```

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

This results in a server with:
- A kubeconfig file with permissions `644`
- Flannel backend set to `none`
- The token set to `secret`
- Debug logging enabled
