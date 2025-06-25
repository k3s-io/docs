---
title: "Installation"
---

This section contains instructions for installing K3s in various environments. Please ensure you have met the [Requirements](requirements.md) before you begin installing K3s.

[Configuration Options](configuration.md) provides guidance on the options available to you when installing K3s.

[Private Registry Configuration](private-registry.md) covers use of `registries.yaml` to configure container image registry authentication and mirroring.

[Embedded Registry Mirror](registry-mirror.md) shows how to enable the embedded distributed image registry mirror, for peer-to-peer sharing of images between nodes.

[Air-Gap Install](airgap.md) details how to set up K3s in environments that do not have direct access to the Internet.

[Managing Server Roles](server-roles.md) details how to set up K3s with dedicated `control-plane` or `etcd` servers.

[Managing Packaged Components](packaged-components.md) details how to disable packaged components, or install your own using auto-deploying manifests.

[Uninstalling K3s](uninstall.md) details how to remove K3s from a host.
