---
title: FAQ
weight: 60
---

The FAQ is updated periodically and designed to answer the questions our users most frequently ask about K3s.

### Is K3s a suitable replacement for Kubernetes?

K3s is a CNCF-certified Kubernetes distribution, and can do everything required of a standard Kubernetes cluster. It is just a more lightweight version. See the [main](../introduction.md) docs page for more details.

### How can I use my own Ingress instead of Traefik?

Simply start K3s server with `--disable=traefik` and deploy your ingress.

### Does K3s support Windows?

At this time K3s does not natively support Windows, however we are open to the idea in the future.

### What exactly are Servers and Agents?

For a breakdown on the components that make up a server and agent, see the [Architecture page](../architecture/architecture.md).

### How can I build from source?

Please reference the K3s [BUILDING.md](https://github.com/k3s-io/k3s/blob/master/BUILDING.md) with instructions.

### Where are the K3s logs?

The location of K3s logs will vary depending on how you run K3s and the node's OS.

* When run from the command line, logs are sent to stdout and stderr.
* When running under openrc, logs will be created at `/var/log/k3s.log`.
* When running under Systemd, logs will be sent to Journald and can be viewed using `journalctl -u k3s`.
* Pod logs can be found at `/var/log/pods`.
* Containerd logs can be found at `/var/lib/rancher/k3s/agent/containerd/containerd.log`.

You can generate more detailed logs by using the `--debug` flag when starting K3s (or `debug: true` in the configuration file).

Kubernetes uses a logging framework known as `klog`, which uses a single logging configuration for all components within a process.
Since K3s runs all Kubernetes components within a single process, it is not possible to configure different log levels or destinations for individual Kubernetes components.
Use of the `-v=<level>` or `--vmodule=<module>=<level>` component args will likely not have the desired effect. 

See [Additional Logging Sources](../advanced/advanced.md#additional-logging-sources) for even more log options.

### Can I run K3s in Docker?

Yes, there are multiple ways to run K3s in Docker. See [Advanced Options](../advanced/advanced.md#running-k3s-in-docker) for more details.

### What is the difference between K3s Server and Agent Tokens?

For more information on managing K3s join tokens, see the [`k3s token` command documentation](../cli/token.md).

### How compatible are different versions of K3s?

In general, the [Kubernetes version skew policy](https://kubernetes.io/docs/setup/release/version-skew-policy/) applies.

In short, servers can be newer than agents, but agents cannot be newer than servers.

### I'm having an issue, where can I get help?
 
If you are having an issue with deploying K3s, you should:

1) Check the [Known Issues](../known-issues/known-issues.md) page.

2) Check that you have resolved any [Additional OS Preparation](../installation/requirements.md#operating-systems). Run `k3s check-config` and ensure that it passes.

3) Search the K3s [Issues](https://github.com/k3s-io/k3s/issues) and [Discussions](https://github.com/k3s-io/k3s/discussions) for one that matches your problem.

4) Join the [Rancher Slack](https://slack.rancher.io/) K3s channel to get help.

5) Submit a [New Issue](https://github.com/k3s-io/k3s/issues/new/choose) on the K3s Github describing your setup and the issue you are experiencing.
