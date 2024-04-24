---
title: Uninstalling K3s
---

:::warning
Uninstalling K3s deletes the local cluster data, configuration, and all of the scripts and CLI tools.  
It does not remove any data from external datastores, or created by pods using external Kubernetes storage volumes.
:::

If you installed K3s using the installation script, a script to uninstall K3s was generated during installation.

If you are planning on rejoining a node to an existing cluster after uninstalling and reinstalling, be sure to delete the node from the cluster to ensure that the node password secret is removed. See the [Node Registration](../architecture.md#how-agent-node-registration-works) documentation for more information.

### Uninstalling Servers
To uninstall K3s from a server node, run:

```bash
/usr/local/bin/k3s-uninstall.sh
```

### Uninstalling Agents
To uninstall K3s from an agent node, run:

```bash
/usr/local/bin/k3s-agent-uninstall.sh
```
