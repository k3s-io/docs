---
title: K3s strategies for image consumption
description: Master online and offline image loading techniques in K3s for ultra-fast application startup, even with multi-gigabyte containers.
authors: manuelbuil
hide_table_of_contents: true
---

Slow image pulls can be annoying and may increase Kubernetes startup times over a healthy threshold, particularly in resource-constrained or air-gapped environments. The situation is exacerbated by new AI-driven apps, which often rely on astronomically large images, frequently tens or hundreds of gigabytes. This post dives into mechanisms that K3s makes available to improve the user's experience when handling large images.

<!-- truncate -->


## Online & Offline Strategies: The Power of Local Import 📦 ##

K3s provides mechanisms for ensuring large images are available quickly, that address two common scenarios:
- Online Clusters: To avoid slow image pulls from an external registry when a pod starts, K3s can `pre-pull` images from a manifest file.
- Offline (Air-Gapped) Clusters: Where no external registry is available, K3s can `import` images directly from local tarball archives.

1. Pre-Pulling Images via a Manifest File (Online)
In scenarios with internet connectivity, the goal is to initiate image pulls as early and efficiently as possible. K3s can be instructed to sequentially pull a set of images into the embedded containerd store during startup or while K3s is running. This is ideal for ensuring base images are ready the moment the cluster starts or the moment the application is deployed. However, if this process is done before the cluster is started, K3s won't successfully start until all images have been pulled, which could make K3s fail to start if it takes more than 15 minutes. If you suspect this is happening to you, you'd better do the pre-pulling while K3s is running. 

Users can trigger a pull of images into the containerd image store by placing a simple text file containing the image names, one per line, in the `/var/lib/rancher/k3s/agent/images` directory. As we have just explained, this can be done before K3s starts or while K3s is running. For example, you can execute the following in one of the nodes:

```bash
mkdir -p /var/lib/rancher/k3s/agent/images && echo docker.io/pytorch/pytorch:2.9.0-cuda12.6-cudnn9-runtime > /var/lib/rancher/k3s/agent/images/pytorch.txt
```
In the previous command, we have created the images directory on the node and dropped a file names `pytorch.txt` that contains the image: `docker.io/pytorch/pytorch:2.9.0-cuda12.6-cudnn9-runtime`.

The K3s process will then pull these images via the CRI API. You should see the following two logs:
```log
# When the k3s controller detects the file
level=info msg="Pulling images from /var/lib/rancher/k3s/agent/images/example.txt"
level=info msg="Pulling image docker.io/pytorch/pytorch:2.9.0-cuda12.6-cudnn9-runtime"

# When the import is ready. It specifies how much time it took in ms:
level=info msg="Imported docker.io/pytorch/pytorch:2.9.0-cuda12.6-cudnn9-runtime"
level=info msg="Imported images from /var/lib/rancher/k3s/agent/images/example.txt in 6m1.178972902s"
```

2. Importing Images from Tarballs (Offline & Ultra-Fast)

For the absolute fastest startup—critical or when being in an air-gapped environment, the images should be available locally as tarballs. K3s will load these images directly into the containerd image store, bypassing any network traffic entirely.

Place the image tarballs (created using docker save or ctr save) in the same /var/lib/rancher/k3s/agent/images directory. K3s will decompress the tarball, extract the image layers, and load them.

For example, I have created an image tarball with all the images required to deploy the popular [microservices-demo](https://github.com/GoogleCloudPlatform/microservices-demo) with the name `microservices-demo.tar.gz`.

```bash
# Example: Save the image and place the tarball
mkdir -p /var/lib/rancher/k3s/agent/images
cp microservices-demo.tar.gz /var/lib/rancher/k3s/agent/images/
```

The K3s process will load those images and you should see the following two logs:
```log
level=info msg="Importing images from /var/lib/rancher/k3s/agent/images/microservices-demo.tar.gz"
level=info msg="Imported images from /var/lib/rancher/k3s/agent/images/microservices-demo.tar.gz in 1m39.8610592s
```

You can verify the successfully imported images at any time using the bundled client: `k3s ctr images list`

### Optimizing booting times with tarballs ###

By default, image archives are imported every time K3s starts to ensure consistency. However, this delay can be significant when dealing with many large archives, for example, `microservices-demo.tar.gz` took 1m39s to import. To alleviate this, K3s offers a feature to only import tarballs that have changed since they were last processed. To enable this feature, create an empty `.cache.json` file in the images directory:

```bash
touch /var/lib/rancher/k3s/agent/images/.cache.json
```

The cache file will store archive metadata (size and modification time). Subsequent restarts of K3s will check this file and skip the import process for any large tarballs that haven't changed, dramatically speeding up cluster boot time. Therefore, to check that this is working, check `.cache.json` is not empty and, after restarting, that the two log lines do not appear anymore.

Note that the caching mechanism needs to be enabled carefully. If an image was removed or pruned since last startup, take manual action to reimport the image. Check our [docs](https://docs.k3s.io/installation/airgap?_highlight=.cache.json&airgap-load-images=Manually+Deploy+Images#enable-conditional-image-imports) for more information.


## Embedded Registry Mirror 🕸️ ##

K3s offers an in-cluster container image registry mirror by embedding [Spegel](https://spegel.dev/). Its primary use case is to accelerate image pulling and reduce external network dependency in Kubernetes clusters by allowing nodes to pull cached image content directly from other nodes whenever possible, instead of requiring each node to reach out to a central registry. To enable this feature, server nodes must be started with the `--embedded-registry` flag, or with `embedded-registry: true` in the configuration file. When enabled, every node in your cluster instantly becomes a stateless, local image mirror listening on port 6443. Nodes share a constantly updated list of available images over a peer-to-peer network on port 5001.

```bash
# Enable the embedded registry mirror
embedded-registry: true
# To enable metrics that can help with the embedded registry mirror
supervisor-metrics: true 
```

And then, on all nodes, you must add a `registries.yaml` where we specified what registries to allow a node to both push and pull images with other nodes. If a registry is enabled for mirroring on some nodes, but not on others, only the nodes with the registry enabled will exchange images. For example:

```yaml
mirrors:
  docker.io:
  registry.k8s.io:
```

If everything boots up correctly, you should see in the logs:
```log
level=info msg="Starting distributed registry mirror at https://10.11.0.11:6443/v2 for registries [docker.io registry.k8s.io]"
level=info msg="Starting distributed registry P2P node at 10.11.0.11:5001"
```

And you should be able to see metrics of Spegel by querying the supervisor metrics server:
```bash
kubectl get --server https://10.11.0.11:6443 --raw /metrics  | grep spegel
```

For more information check the [docs](https://docs.k3s.io/installation/registry-mirror)

## Bonus: eStargz images ⚡ ##

A different solution to speed up the creation of pods is by using a special image format called eStargz. This enables lazy pulling, which means that the application can start almost instantly while the rest of the image is pulled in the background. This strategy requires both the image to be specifically built in the eStargz format and the K3s agent to be configured to use the stargz snapshotter: `--snapshotter=estargz` flag, or with `snapshotter: estargz` in the configuration file.

This is currently an experimental feature in K3s and we have more information in the [advanced section of our docs](https://docs.k3s.io/advanced#enabling-lazy-pulling-of-estargz-experimental). We would love to hear your feedback if you are using it.

## Conclusion 🏁 ##

K3s provides robust, flexible tools to tackle slow image pulls, a problem magnified by today's multi-gigabyte cloud-native and AI images. By leveraging pre-pulling manifest strategies, tarball loading or optimizing image distribution with the embedded [Spegel](https://spegel.dev/) registry mirror, you can shift slow network operations into quick local operations. These mechanisms ensure your resource-constrained and air-gapped clusters achieve rapid, predictable startup times, delivering a consistently better user experience.