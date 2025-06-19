---
title: "How to import images"
---

A container image represents binary data that encapsulates an application and all its software dependencies. Container images are executable software bundles that can run standalone and that make very well-defined assumptions about their runtime environment. Container images of an application are typically created and then pushed to a registry. K3s, as a CNCF-certified Kubernetes distribution, relies on containerd to pull the required images for the pods to run correctly.

There are two ways to pull the images so that pods can utilize them, either pulling them on-demand or pre-importing them.


## On-demand image pulling

Kubernetes by default pulls images automatically when a pod requires it if the image is not present. This behavior can be changed by using the [image pull policy](https://kubernetes.io/docs/concepts/containers/images/#image-pull-policy) field of the pod. When using the default `IfNotPresent`, the image will get pulled from either the upstream or the [private registry](./private-registry.md) by containerd and store in its containerd image store. The user does not need to apply any additional configuration for on-demand image pulling to work.


## Pre-import images
:::info Version Gate
The pre-importing of images while K3s is running feature is available as of January 2025 releases: v1.32.0+k3s1, v1.31.5+k3s1, v1.30.9+k3s1, v1.29.13+k3s1. Before that, K3s pre-imported the images only when booting.
:::

Pre-importing images in the node is essential if you configure the `imagePullPolicy` of Kubernetes as `Never`, for example for security reasons. Another reason to do this is to reduce the time it takes for your K3s nodes to spin up.

K3s includes two mechanisms to pre-import images into the containerd image store:

<Tabs groupId = "import images" queryString>
<TabItem value="Online image importing" default>

Users can trigger the pull of images to containerd image store by adding a txt file containing the images path in the directory `/var/lib/rancher/k3s/agent/images` while K3s is running. A K3s controller will detect the file and trigger the pull of the images from an upstream (default) or [private registry](private-registry.md).

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
<TabItem value="Offline image importing" default>

Users can import images offline to containerd by adding image tarballs in the directory `/var/lib/rancher/k3s/agent/images` while K3s is running. A K3s controller will detect the image tarball, extract the images and store them in the containerd image store.

For example:

```bash
mkdir /var/lib/rancher/k3s/agent/images
curl  https://github.com/k3s-io/k3s/releases/download/v1.33.1%2Bk3s1/k3s-airgap-images-amd64.tar.zst -O  /var/lib/rancher/k3s/agent/images/k3s-airgap-images-amd64.tar.zst
```

After a few seconds, the images included in the image tarball will be available in the containerd image store of the node. 

Use `sudo k3s ctr images list` to query the containerd image store.

:::warning
When using the offline image importing for Airgap, tarballs should be present before K3s starts. Please follow the [airgap install documentation](../airgap.md) for detailed information
:::

</TabItem>
</Tabs>