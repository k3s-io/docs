---
title: K3s strategies for image consumption
description: Master online and offline image loading techniques in K3s for ultra-fast application startup, even with multi-gigabyte containers.
authors: manuelbuil
hide_table_of_contents: true
---

Slow image pulls can be annoying and could increase Kubernetes startup times over a healthy threshold, particularly in resource-constrained or air-gapped environments. The situation gets worsened by new AI cloud native apps, which often rely on astronomically large images (several gigabytes). This post dives into K3s mechanisms, like pre-pulling images and embedded registry mirror, that can effectively improve the user's experience ensuring your cluster is ready the moment you need the images, especially in environments where network bandwidth might be constrained.


## 📦 Online & Offline Strategies: The Power of Local Import ##

K3s provides two core mechanisms for ensuring large images are available quickly, whether you are connected to an external registry (online) or deploying in an isolated environment (offline). The goal is to shift the time spent waiting on a slow network pull into a fast local load during K3s startup.

1. Pre-Pulling Images via a Manifest File (Online)
In scenarios with internet connectivity, the goal is to initiate image pulls as early and efficiently as possible. K3s can be instructed to sequentially pull a set of images into the embedded containerd store during startup. This is ideal for ensuring base images are ready the moment the cluster starts.

Users can trigger a pull of images into the containerd image store by placing a simple text file containing the image names, one per line, in the /var/lib/rancher/k3s/agent/images directory. This can be done before K3s starts or while K3s is running.

Imagine the file `example.txt` which contains:

```yaml
docker.io/pytorch/pytorch:2.9.0-cuda12.6-cudnn9-runtime
```
Before starting the k3s service in the node, do the following:

```bash
# 1. Create the images directory on the node
mkdir -p /var/lib/rancher/k3s/agent/images

# 2. Copy the manifest file (example.txt)
cp example.txt /var/lib/rancher/k3s/agent/images
```
The K3s process will then pull these images via the CRI API. You should see the following two logs:
```yaml
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
```yaml
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


## 🕸️ Embedded Registry Mirror ##

K3s offers an in-cluster container image registry mirror by embedding Spegel. Its primary use case is to accelerate image pulling and reduce external network dependency in Kubernetes clusters by ensuring images are pulled within the cluster network rather than repeatedly from a central registry. To enable this feature, server nodes must be started with the --embedded-registry flag, or with embedded-registry: true in the configuration file. When enabled, every node in your cluster instantly becomes a stateless, local image mirror listening on port 6443. Nodes share a constantly updated list of available images over a peer-to-peer network on port 5001.

```bash
# Enable the embedded registry mirror
embedded-registry: true
# To enable metrics that can help with the embedded registry mirror
supervisor-metrics: true 
```

And then, in all nodes, you must add a `registries.yaml` where we specified what registry we allow a node to both pull images from other nodes, and share the registry's images with other nodes. If a registry is enabled for mirroring on some nodes, but not on others, only the nodes with the registry enabled will exchange images from that registrywhat registries are mirrored. For example:

```bash
mirrors:
  docker.io:
  registry.k8s.io:
```

If everything boots up correctly, you should see in the logs:
```yaml
level=info msg="Starting distributed registry mirror at https://10.11.0.11:6443/v2 for registries [docker.io registry.k8s.io]"
level=info msg="Starting distributed registry P2P node at 10.11.0.11:5001"
```

And you should be able to see metrics of Spegel by querying the supervisor metrics server:
```bash
kubectl get --server https://10.11.0.11:6443 --raw /metrics  | grep spegel
```


🏁 Conclusion


K3s provides robust, flexible tools to decisively tackle slow image pulls, a problem magnified by today's multi-gigabyte cloud-native and AI images. By leveraging pre-pulling manifest strategies, tarball loading or optimizing image distribution with the embedded Spegel registry mirror, you can shift network latency into quick, reliable local operations. These mechanisms ensure your resource-constrained and air-gapped clusters achieve rapid, predictable startup times, delivering a consistently better user experience.