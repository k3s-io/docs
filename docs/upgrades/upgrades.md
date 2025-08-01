---
title: Upgrades
---

### Upgrading your K3s cluster

[Manual Upgrades](manual.md) describes several techniques for upgrading your cluster manually. It can also be used as a basis for upgrading through third-party Infrastructure-as-Code tools like [Terraform](https://www.terraform.io/).

[Automated Upgrades](automated.md) describes how to perform Kubernetes-native automated upgrades using Rancher's [system-upgrade-controller](https://github.com/rancher/system-upgrade-controller).

### Version-specific caveats

- **Traefik:** If Traefik is not disabled, K3s versions v1.31 and earlier will install Traefik v2, while K3s versions v1.32 and later will install Traefik v3. To upgrade from the older Traefik v2 to Traefik v3, please refer to the [Traefik documentation](https://doc.traefik.io/traefik/migrate/v2-to-v3/).

- **K3s bootstrap data:** If you are using K3s in an HA configuration with an external SQL datastore, and your server (control-plane) nodes were not started with the `--token` CLI flag, you will no longer be able to add additional K3s servers to the cluster without specifying the token. Ensure that you retain a copy of this token, as it is required when restoring from backup. Previously, K3s did not enforce the use of a token when using external SQL datastores. 
    - The affected versions are &lt;= v1.19.12+k3s1, v1.20.8+k3s1, v1.21.2+k3s1; the patched versions are v1.19.13+k3s1, v1.20.9+k3s1, v1.21.3+k3s1.

    - You may retrieve the token value from any server already joined to the cluster as follows:
```bash
cat /var/lib/rancher/k3s/server/token
```
