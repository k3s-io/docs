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

### How can I build from source?

Please reference the K3s [BUILDING.md](https://github.com/k3s-io/k3s/blob/master/BUILDING.md) with instructions.

### Where are the K3s logs?

The installation script will auto-detect if your OS is using systemd or openrc and start the service.

* When run from the command line, logs are sent to stdout and stderr.
* When running under openrc, logs will be created at `/var/log/k3s.log`.
* When running under Systemd, logs will be sent to Journald and can be viewed using `journalctl -u k3s`.

### Can I run K3s in Docker?

Yes, there are multiple ways to run K3s in Docker. See [Advanced Options](../advanced/advanced.md#running-k3s-in-docker) for more details.

### What is the difference between K3s Server and Agent Tokens?

In K3s, there are two types of tokens: `K3S_TOKEN` and `K3S_AGENT_TOKEN`.

`K3S_TOKEN`: Defines the key required by the server to offer the HTTP config resources. These resources are requested by the other servers before joining the K3s HA cluster. If the `K3S_AGENT_TOKEN` is not defined, the agents use this token as well to access the required HTTP resources to join the cluster. Note that this token is also used to generate the encryption key for important content in the database (e.g., bootstrap data).

`K3S_AGENT_TOKEN`: Optional. Defines the key required by the server to offer HTTP config resources to the agents. If not defined, agents will require `K3S_TOKEN`. Defining `K3S_AGENT_TOKEN` is encouraged to avoid agents having to know `K3S_TOKEN`, which is also used to encrypt data.

If no `K3S_TOKEN` is defined, the first K3s server will generate a random token during initial startup. The result is part of the content in `/var/lib/rancher/k3s/server/token`. For example, `K1070878408e06a827960208f84ed18b65fa10f27864e71a57d9e053c4caff8504b::server:df54383b5659b9280aa1e73e60ef78fc`. The token in this example is `df54383b5659b9280aa1e73e60ef78fc`. The full format with the `K10` prefix includes a hash of the cluster's CA certificate, which can be used to ensure that nodes are joining the correct cluster and are not subject to a man-in-the-middle attack during the join process. This full token cannot be generated prior to initial cluster startup, before the cluster CA has been generated.

### I'm having an issue, where can I get help?
 
If you are having an issue with deploying K3s, you should:

1) Check the [Known Issues](../known-issues/known-issues.md) page.

2) Check that you have resolved any [Additional OS Preparation](../advanced/advanced.md#additional-os-preparations). Run `k3s check-config` and ensure that it passes.

3) Search the [K3s GitHub existing issues](https://github.com/k3s-io/k3s/issues) for one that matches your problem.

4) Join the [Rancher Slack](https://rancher-users.slack.com/) K3s channel to get help. 

5) Submit a [New Issue](https://github.com/k3s-io/k3s/issues/new/choose) on the K3s Github describing your setup and the issue you are experiencing.
