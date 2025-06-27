---
title: "Embedded Registry Mirror"
---

:::info Version Gate
The Embedded Registry Mirror is available as an experimental feature as of January 2024 releases: v1.26.13+k3s1, v1.27.10+k3s1, v1.28.6+k3s1, v1.29.1+k3s1 and GA as of December 2024 releases: v1.29.12+k3s1, v1.30.8+k3s1, v1.31.4+k3s1
:::

K3s embeds [Spegel](https://github.com/spegel-org/spegel), a stateless distributed OCI registry mirror that allows peer-to-peer sharing of container images between nodes in a Kubernetes cluster. The distributed registry mirror is disabled by default. For K3s to leverage it, you must enable both the [Distributed OCI Registry Mirror](#enabling-the-distributed-oci-registry-mirror) and the [Registry mirroring](#enabling-registry-mirroring) as explained in the following subsections.

## Enabling The Distributed OCI Registry Mirror

In order to enable the embedded registry mirror, server nodes must be started with the `--embedded-registry` flag, or with `embedded-registry: true` in the configuration file.
This option enables the embedded mirror for use on all nodes in the cluster.

When enabled at a cluster level, all nodes will host a local OCI registry on port 6443,
and publish a list of available images via a peer to peer network on port 5001.
Any image available in the containerd image store on any node, can be pulled by other cluster members without access to an external registry.
Images imported via [air-gap image tar files](./airgap.md?airgap-load-images=Manually+Deploy+Images) or [pre-imported](../import-images.md#pre-import-images) are pinned in containerd to ensure that they remain available and are not pruned by Kubelet garbage collection.

The peer to peer port can changed from 5001 by setting the `K3S_P2P_PORT` environment variable for the K3s service. The port must be set to the same value on all nodes.
Changing the port is unsupported and not recommended.

### Requirements

When the embedded registry mirror is enabled, all nodes must be able to reach each other via their internal IP addresses, on TCP ports 5001 and 6443.
If nodes cannot reach each other, it may take longer for images to be pulled, as the distributed registry will be tried first by containerd, before it falls back to other endpoints.

## Enabling Registry Mirroring

Enabling mirroring for a registry allows a node to both pull images from that registry from other nodes, and share the registry's images with other nodes.
If a registry is enabled for mirroring on some nodes, but not on others, only the nodes with the registry enabled will exchange images from that registry.

In order to enable mirroring of images from an upstream container registry, nodes must have an entry in the `mirrors` section of `registries.yaml` for that registry.
The registry does not need to have any endpoints listed, it just needs to be present.
For example, to enable distributed mirroring of images from `docker.io` and `registry.k8s.io`, configure `registries.yaml` with the following content on all cluster nodes:

```yaml
mirrors:
  docker.io:
  registry.k8s.io:
```

Endpoints for registry mirrors may also be added as usual.
In the following configuration, images pull attempts will first try the embedded mirror, then `mirror.example.com`, then finally `docker.io`:
```yaml
mirrors:
  docker.io:
    endpoint:
      - https://mirror.example.com
```

If you are using a private registry directly, instead of as a mirror for an upstream registry, you may enable distributed mirroring in the same way public
registries are enabled - by listing it in the mirrors section: 
```yaml
mirrors:
  mirror.example.com:
```

:::info Version Gate
Wildcard support is available as of the March 2024 releases: v1.26.15+k3s1, v1.27.12+k3s1, v1.28.8+k3s1, v1.29.3+k3s1
:::

The `"*"` wildcard mirror entry can be used to enable distributed mirroring of all registries. Note that the asterisk MUST be quoted:
```yaml
mirrors:
  "*":
```

If no registries are enabled for mirroring on a node, that node does not participate in the distributed registry in any capacity.

For more information on the structure of the `registries.yaml` file, see [Private Registry Configuration](./private-registry.md).

### Default Endpoint Fallback

By default, containerd will fall back to the default endpoint when pulling from registries with mirror endpoints configured. If you want to disable this,
and only pull images from the configured mirrors and/or the embedded mirror, see the [Default Endpoint Fallback](./private-registry.md#default-endpoint-fallback)
section of the Private Registry Configuration documentation.

Note that if you are using the `--disable-default-endpoint` option and want to allow pulling directly from a particular registry, while disallowing the rest,
you can explicitly provide an endpoint in order to allow the image pull to fall back to the registry itself:
```yaml
mirrors:
  docker.io:           # no default endpoint, pulls will fail if not available on a node
  registry.k8s.io:     # no default endpoint, pulls will fail if not available on a node
  mirror.example.com:  # explicit default endpoint, can pull from upstream if not available on a node
    endpoint:
      - https://mirror.example.com
```

### Latest Tag

When no tag is specified for a container image, the implicit default tag is `latest`. This tag is frequently
updated to point at the most recent version of the image. Because this tag will point at a different revisions
of an image depending on when it is pulled, the distributed registry **will not** pull the `latest` tag from
other nodes. This forces containerd go out to an upstream registry or registry mirror to ensure a consistent
view of what the `latest` tag refers to.

This aligns with the [special `imagePullPolicy` defaulting](https://kubernetes.io/docs/concepts/containers/images/#imagepullpolicy-defaulting)
observed by Kubernetes when using the `latest` tag for a container image.

Mirroring the `latest` tag can be enabled by setting the `K3S_P2P_ENABLE_LATEST=true` environment variable for the K3s service.
This is unsupported and not recommended, for the reasons discussed above.

## Security

### Authentication

Access to the embedded mirror's registry API requires a valid client certificate, signed by the cluster's client certificate authority.

Access to the distributed hash table's peer-to-peer network requires a preshared key that is controlled by server nodes.
Nodes authenticate each other using both the preshared key, and a certificate signed by the cluster certificate authority.

### Potential Concerns

:::warning
The distributed registry is built on peer-to-peer principles, and assumes an equal level of privilege and trust between all cluster members.
If this does not match your cluster's security posture, you should not enable the embedded distributed registry.
:::

The embedded registry may make available images that a node may not otherwise have access to.
For example, if some of your images are pulled from a registry, project, or repository that requires authentication via Kubernetes Image Pull Secrets, or credentials in `registries.yaml`,
the distributed registry will allow other nodes to share those images without providing any credentials to the upstream registry.

Users with access to push images into the containerd image store on one node may be able to use this to 'poison' the image for other cluster nodes,
as other nodes will trust the tag advertised by the node, and use it without checking with the upstream registry.
If image integrity is important, you should use image digests instead of tags, as the digest cannot be poisoned in this manner.

## Sharing Air-gap or Manually Loaded Images

Image sharing is controlled based on the source registry.
Images loaded directly into containerd via [air-gap tarballs](./airgap.md?airgap-load-images=Manually+Deploy+Images), [pre-imported](../import-images.md#pre-import-images) or loaded directly into containerd's image store using the `ctr` command line tool, will be shared between nodes if they are tagged as being from a registry that is enabled for mirroring.

Note that the upstream registry that the images appear to come from does not actually have to exist or be reachable.
For example, you could tag images as being from a fictitious upstream registry, and import those images into containerd's image store.
You would then be able to pull those images from all cluster members, as long as that registry is listed in `registries.yaml`

## Pushing Images

The embedded registry is read-only, and cannot be pushed to directly using `docker push` or other common tools that interact with OCI registries.

Images can be manually made available via the embedded registry by running `ctr -n k8s.io image pull` to pull an image,
or by loading image archives created by `docker save` via the `ctr -n k8s.io image import` command or the [pre-import feature](../import-images.md#pre-import-images).
Note that the `k8s.io` namespace must be specified when managing images via `ctr` in order for them to be visible to the kubelet.
