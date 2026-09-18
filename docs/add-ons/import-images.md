---
title: Import Images
---

Container images are cached locally on each node by the containerd image store. Images can be pulled from the registry as needed by pods, preloaded via image pull, or imported from an image tarball.

## On-demand image pulling

Kubernetes, by default, automatically pulls images when a Pod requires them if the image is not already present on the node. This behavior can be changed by using the [image pull policy](https://kubernetes.io/docs/concepts/containers/images/#image-pull-policy) field of the Pod. When using the default `IfNotPresent` policy, containerd will pull the image from either upstream (default) or your [private registry](../installation/private-registry.md) and store it in its image store. Users do not need to apply any additional configuration for on-demand image pulling to work.

## Pre-import images

Pre-importing images onto the node is essential if you configure Kubernetes' `imagePullPolicy` as `Never`. You might do this for security reasons or to reduce the time it takes for your K3s nodes to spin up.

### Conditional Image Imports

By default, image archives are imported every time k3s starts. This is done to ensure that all the images are consistently available, even if some images have been removed or pruned since last startup. However, this delays startup as the kubelet is not started until after all archives have been processed. To alleviate this delay there is an option to only import tarballs that have changed since they were last imported, even across restarts.

To enable this feature, create a `.cache.json` file in the images directory:
```bash
touch /var/lib/rancher/k3s/agent/images/.cache.json
```
The cache file will store archive metadata as files are processed. Subsequent restarts of K3s will not import the images, as long as the size and modification time of the archive remains the same.

:::warning
When this feature is enabled, it will not be possible to ensure that all images are available every time k3s starts. If an image was removed or pruned since last startup, take manual action to reimport the image. Either:
* Manually import the archive with `ctr image import`.
* Use `touch` to modify the timestamp of the archive containing the image.
* Clear the contents of the `.cache.json` file, and restart k3s.
:::

### Import Mechanisms

K3s includes two mechanisms to pre-import images into the containerd image store:

<Tabs groupId="import-images" queryString>
<TabItem value="Online image importing" default>

Users can trigger a pull of images into the containerd image store by placing a text file containing the image names, one per line, in the `/var/lib/rancher/k3s/agent/images` directory. The text file can be placed before K3s is started, or created/modified while K3s is running. K3s will sequentially pull the images via the CRI API, optionally using the [registries.yaml](../installation/private-registry.md) configuration.

For example:

```bash
mkdir /var/lib/rancher/k3s/agent/images
cp example.txt /var/lib/rancher/k3s/agent/images
```

Where `example.txt` contains:

```
docker.io/library/redis:latest
docker.io/library/mysql:latest
```

After a few seconds, the `redis` and the `mysql` images will be available in the containerd image store of the node. 

Use `sudo k3s ctr images list` to query the containerd image store.

</TabItem>
<TabItem value="Offline image importing">

Users can import images directly into the containerd image store by placing image tarballs in the `/var/lib/rancher/k3s/agent/images` directory. The tarball can be placed before K3s is started, or created/modified while K3s is running. K3s will decompress the image tarball if necessary, extract the images, and load them into the containerd image store.

For example:

```bash
mkdir /var/lib/rancher/k3s/agent/images
curl  https://github.com/k3s-io/k3s/releases/download/v1.33.1%2Bk3s1/k3s-airgap-images-amd64.tar.zst -O  /var/lib/rancher/k3s/agent/images/k3s-airgap-images-amd64.tar.zst
```

After a few seconds, the images included in the image tarball will be available in the containerd image store of the node. 

Use `sudo k3s ctr images list` to query the containerd image store.

This is the method used in Airgap. Please follow the [Airgap install documentation](../installation/airgap.md) for detailed information.

</TabItem>
</Tabs>

## Set up an image registry

K3s supports two alternatives for image registries:

* [Private Registry Configuration](../installation/private-registry.md) covers use of `registries.yaml` to configure container image registry authentication and mirroring.

* [Embedded Registry Mirror](../installation/registry-mirror.md) shows how to enable the embedded distributed image registry mirror, for peer-to-peer sharing of images between nodes.
