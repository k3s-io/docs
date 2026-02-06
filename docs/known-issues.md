---
title: Known Issues
---
The Known Issues are updated periodically and designed to inform you about any issues that may not be immediately addressed in the next upcoming release.
For the most up-to-date information, check open and pinned issues on the [K3s Project Issue Tracker](https://github.com/k3s-io/k3s/issues).
If you are not running the most recent release of K3s, make sure to also search closed issues and release notes to ensure that your issue has not already been resolved.

### Kine/SQL 2147483647 (MAX INT) Revision Limit
When using K3s with an [external SQL database](datastore/ha.md) that was created on a release of K3s prior to May 2024, you must apply schema migrations to your database to allow for more than 2.1 million revisions to be stored within the database.
Databases without updated schema will become read-only when the current datastore revision reaches 2147483647.

You can check the current revision of your datastore by examining the `resourceVersion` field of the response to a list call made against the Kubernetes API.
For example, in the following output, the current revision is 12345:
```bash
$ kubectl get --raw /api/v1/namespaces?labelSelector=none
{"kind":"NamespaceList","apiVersion":"v1","metadata":{"resourceVersion":"12345"},"items":[]}
```

You can update the datastore schema by setting the `KINE_SCHEMA_MIGRATION` environment variable to 1 or higher in the K3s service's env file, and restarting the service.
This change should be made on all servers within the cluster.

### Docker Snap

If you plan to use K3s with the Docker container runtime, the Docker snap package is not recommended as it has been known to cause issues running K3s. Install Docker using the native package management system provided by your operating system.

### iptables

If your node uses iptables v1.6.1 or older in nftables mode you might encounter issues. We recommend utilizing newer iptables (such as 1.6.1+), or running iptables legacy mode, to avoid issues.

```bash
update-alternatives --set iptables /usr/sbin/iptables-legacy
update-alternatives --set ip6tables /usr/sbin/ip6tables-legacy
```

Iptables versions 1.8.0-1.8.4 also have known issues that can cause K3s to fail. Several popular Linux distributions ship with these versions by default. One bug causes the accumulation of duplicate rules, which negatively affects the performance and stability of the node. See [Issue #3117](https://github.com/k3s-io/k3s/issues/3117) for information on how to determine if you are affected by this problem.

K3s includes a known-good version of iptables (v1.8.8) which has been tested to function properly. You can tell K3s to use its bundled version of iptables by starting K3s with the `--prefer-bundled-bin` option, or by uninstalling the iptables/nftables packages from your operating system.

### Rootless Mode

Running K3s with Rootless mode is experimental and has several [known issues.](./advanced.md#known-issues-with-rootless-mode)
