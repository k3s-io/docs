---
title: K3s System Images Are Moving to GHCR
description: Starting with v1.40, K3s system images will be pulled from ghcr.io/k3s-io. Here is what you need to know to prepare.
authors: [vitorsavian]
hide_table_of_contents: true
---

Starting with **K3s v1.40**, the system images that K3s deploys will come from the GitHub Container Registry (`ghcr.io/k3s-io`) instead of Docker Hub. If you run K3s with the default settings and your nodes have internet access, you don't have to do anything. If you use a private registry, `--system-default-registry` or air-gapped installs you will need to setup/mirror from ghcr.

We're announcing this now so you have a few releases to get ready.

<!-- truncate -->

## What's changing

The packaged components (CoreDNS, Traefik, local-path-provisioner, metrics-server, klipper-helm, klipper-lb and the pause image) are currently pulled from `docker.io/rancher/...`. From v1.40 on, they'll be pulled from:

* `ghcr.io/k3s-io/<image>` for most of them
* `ghcr.io/rancher/local-path-provisioner` for local-path-provisioner

Only the images K3s deploys itself are affected. Your own workloads keep pulling from wherever they pull today.

Releases before v1.40 keep using the images they shipped with, so nothing changes on a cluster until you upgrade it to v1.40.

### Why

The `rancher` images on Docker Hub haven't been subject to pull rate limits because of an agreement between SUSE and Docker. That agreement is ending, so without this change you'd start hitting Docker Hub's rate limits when bringing up clusters (and so would our CI). See [k3s-io/k3s#14561](https://github.com/k3s-io/k3s/issues/14561) for the details.

K3s already publishes some images to GHCR, and public images there don't have that kind of limit, so it was the obvious place to go. We're moving all of them, pause included, since leaving even one behind on Docker Hub would still leave you exposed to the limits.

We'll keep publishing the images to Docker Hub under `rancher/<image>`, but K3s won't pull from there by default anymore.

:::warning Before upgrading to v1.40
If you mirror K3s system images, use `--system-default-registry`, run air-gapped clusters, or restrict outbound traffic from your nodes, you need to update your setup first.

`--system-default-registry` now defaults to `ghcr.io`, and **an empty value makes the server fail at startup**. If you have `system-default-registry: ""` in your `config.yaml`, or automation that always passes the flag, remove it before upgrading to `v1.40`.
:::

## Am I affected?

| Your setup | What to do |
| :--- | :--- |
| Nodes pull straight from the internet, no mirrors or private registry | Nothing. K3s pulls from the new location after the upgrade. |
| You use `--system-default-registry` | Mirror the images from their new location into your registry. |
| You set `--system-default-registry` to an empty value (`""`) | Remove it. An empty value will be rejected at startup. |
| You mirror or proxy `docker.io` in `registries.yaml` (pull-through cache, Harbor, Artifactory, etc.) | Add a mirror entry for `ghcr.io`. |
| You use the embedded registry mirror (`--embedded-registry`) | Add `ghcr.io` to `mirrors` in `registries.yaml`. |
| You run air-gapped clusters | Use the v1.40 airgap artifacts and update any tooling that mirrors or retags images. |

## If you use `--system-default-registry`

K3s swaps the registry host for yours and keeps the repository path. So with:

```bash
k3s server --system-default-registry registry.example.com:5000
```

v1.40 will pull:

```text
registry.example.com:5000/k3s-io/<image>:<tag>
registry.example.com:5000/rancher/local-path-provisioner:<tag>
```

Your registry needs to have the images under `k3s-io/` and `rancher/` **before** you upgrade. The process is the same one described in [Adding Images to the Private Registry](/installation/private-registry#adding-images-to-the-private-registry), just with the new names: grab `k3s-images.txt` for v1.40 from the [GitHub releases](https://github.com/k3s-io/k3s/releases) page, then pull, retag and push each image.

If you don't set a registry, K3s now uses `ghcr.io` as the default. Setting the flag to an empty string used to mean "use the default", but now it makes the server fail at startup, so drop it from your config instead.

## If you use `registries.yaml`

If you only mirror `docker.io` today:

```yaml
mirrors:
  docker.io:
    endpoint:
      - "https://registry.example.com:5000"
```

add the same thing for `ghcr.io`:

```yaml
mirrors:
  docker.io:
    endpoint:
      - "https://registry.example.com:5000"
  ghcr.io:
    endpoint:
      - "https://registry.example.com:5000"
```

Now `ghcr.io/k3s-io/<image>:<tag>` gets pulled as `registry.example.com:5000/k3s-io/<image>:<tag>`.

If you use the [embedded registry mirror](/installation/registry-mirror), add `ghcr.io` to `mirrors` (no endpoint needed) so nodes share those images with each other:

```yaml
mirrors:
  docker.io:
  registry.k8s.io:
  ghcr.io:
```

Don't forget a `configs` entry if your registry needs auth or custom TLS. The file has to be updated on **every node**, and K3s restarted on each one. See [Private Registry Configuration](/installation/private-registry) for all the options.

## If you run air-gapped

The v1.40 airgap tarballs (`k3s-airgap-images-<arch>.tar.zst`) and `k3s-images.txt` reference the new `ghcr.io` images. Tarballs from older releases still carry the old `rancher/...` names and **won't work with v1.40**: if you load one into a private registry, the images end up as `<registry>/rancher/<image>`, while K3s asks for `<registry>/k3s-io/<image>`. Always use the tarball that matches your K3s version.

* If you [deploy images manually](/installation/airgap), drop the v1.40 tarball into `/var/lib/rancher/k3s/agent/images/` on each node **before** upgrading the binary.
* If you load the tarball into a private registry, push the images with the new `k3s-io/` and `rancher/` paths.
* Update any scripts or pipelines that mirror, scan or retag images using the old `docker.io/rancher/...` names.

## Join our Adopters list

If K3s is making your life easier, the best way to say "thanks" is to add your company to our official Adopters list. It’s a tiny gesture that carries a lot of weight for the project's health and visibility within the CNCF ecosystem. We are currently working hard to get our 'status' inside the CNCF to progress and showing a large list of Adopters would help tremendously.

The task is easy: create a PR that adds your name in https://github.com/k3s-io/k3s/blob/main/ADOPTERS.md.

Thanks a lot!