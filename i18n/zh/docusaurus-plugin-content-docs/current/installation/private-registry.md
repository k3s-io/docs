---
title: "Private Registry Configuration"
---

Containerd can be configured to connect to private registries and use them to pull images as needed by the kubelet.

Upon startup, K3s will check to see if `/etc/rancher/k3s/registries.yaml` exists. If so, the registry configuration contained in this file is used when generating the containerd configuration.
* If you want to use a private registry as a mirror for a public registry such as docker.io, then you will need to configure `registries.yaml` on each node that you want to use the mirror.
* If your private registry requires authentication, uses custom TLS certificates, or does not use TLS, you will need to configure `registries.yaml` on each node that will pull images from your registry.

Note that server nodes are schedulable by default. If you have not tainted the server nodes and will be running workloads on them,
please ensure you also create the `registries.yaml` file on each server as well.

## Default Endpoint Fallback

Containerd has an implicit "default endpoint" for all registries.
The default endpoint is always tried as a last resort, even if there are other endpoints listed for that registry in `registries.yaml`.
For example, when pulling `registry.example.com:5000/rancher/mirrored-pause:3.6`, containerd will use a default endpoint of `https://registry.example.com:5000/v2`.
* The default endpoint for `docker.io` is `https://index.docker.io/v2`.  
* The default endpoint for all other registries is `https://<REGISTRY>/v2`, where `<REGISTRY>` is the registry hostname and optional port.  

In order to be recognized as a registry, the first component of the image name must contain at least one period or colon.
For historical reasons, images without a registry specified in their name are implicitly identified as being from `docker.io`.

:::info Version Gate
The `--disable-default-registry-endpoint` option is available as an experimental feature as of January 2024 releases: v1.26.13+k3s1, v1.27.10+k3s1, v1.28.6+k3s1, v1.29.1+k3s1
:::

Nodes may be started with the `--disable-default-registry-endpoint` option.
When this is set, containerd will not fall back to the default registry endpoint, and will only pull from configured mirror endpoints,
along with the distributed registry if it is enabled.

This may be desired if your cluster is in a true air-gapped environment where the upstream registry is not available,
or if you wish to have only some nodes pull from the upstream registry.

Disabling the default registry endpoint applies only to registries configured via `registries.yaml`.
If the registry is not explicitly configured via mirror entry in `registries.yaml`, the default fallback behavior will still be used.

## Registries Configuration File

The file consists of two top-level keys, with subkeys for each registry:

```yaml
mirrors:
  <REGISTRY>:
    endpoint:
      - https://<REGISTRY>/v2
configs:
  <REGISTRY>:
    auth:
      username: <BASIC AUTH USERNAME>
      password: <BASIC AUTH PASSWORD>
      token: <BEARER TOKEN>
    tls:
      ca_file: <PATH TO SERVER CA>
      cert_file: <PATH TO CLIENT CERT>
      key_file: <PATH TO CLIENT KEY>
      insecure_skip_verify: <SKIP TLS CERT VERIFICATION BOOLEAN>
```

### Mirrors

The mirrors section defines the names and endpoints of registries, for example:

```
mirrors:
  registry.example.com:
    endpoint:
      - "https://registry.example.com:5000"
```

Each mirror must have a name and set of endpoints. When pulling an image from a registry, containerd will try these endpoint URLs, plus the default endpoint, and use the first working one.

#### Redirects

If the private registry is used as a mirror for another registry, such as when configuring a [pull through cache](https://docs.docker.com/registry/recipes/mirror/),
images pulls are transparently redirected to the listed endpoints. The original registry name is passed to the mirror endpoint via the `ns` query parameter.

For example, if you have a mirror configured for `docker.io`:

```yaml
mirrors:
  docker.io:
    endpoint:
      - "https://registry.example.com:5000"
```

Then pulling `docker.io/rancher/mirrored-pause:3.6` will transparently pull the image as `registry.example.com:5000/rancher/mirrored-pause:3.6`.

#### Rewrites

Each mirror can have a set of rewrites. Rewrites can change the name of an image based on regular expressions.
This is useful if the organization/project structure in the private registry is different than the registry it is mirroring.

For example, the following configuration would transparently pull the image `docker.io/rancher/mirrored-pause:3.6` as `registry.example.com:5000/mirrorproject/rancher-images/mirrored-pause:3.6`:

```
mirrors:
  docker.io:
    endpoint:
      - "https://registry.example.com:5000"
    rewrite:
      "^rancher/(.*)": "mirrorproject/rancher-images/$1"
```

When using redirects and rewrites, images will still be stored under the original name.
For example, `crictl image ls` will show `docker.io/rancher/mirrored-pause:3.6` as available on the node, even though the image was pulled from the mirrored registry with a different name.

### Configs

The `configs` section defines the TLS and credential configuration for each mirror. For each mirror you can define `auth` and/or `tls`. 

The `tls` part consists of:

| Directive              | Description                                                                          |
|------------------------|--------------------------------------------------------------------------------------|
| `cert_file`            | The client certificate path that will be used to authenticate with the registry      |
| `key_file`             | The client key path that will be used to authenticate with the registry              |
| `ca_file`              | Defines the CA certificate path to be used to verify the registry's server cert file |
| `insecure_skip_verify` | Boolean that defines if TLS verification should be skipped for the registry          |

The `auth` part consists of either username/password or authentication token:

| Directive  | Description                                             |
|------------|---------------------------------------------------------|
| `username` | user name of the private registry basic auth            |
| `password` | user password of the private registry basic auth        |
| `auth`     | authentication token of the private registry basic auth |

Below are basic examples of using private registries in different modes:

### With TLS

Below are examples showing how you may configure `/etc/rancher/k3s/registries.yaml` on each node when using TLS.

<Tabs>
<TabItem value="With Authentication">

```yaml
mirrors:
  docker.io:
    endpoint:
      - "https://registry.example.com:5000"
configs:
  "registry.example.com:5000":
    auth:
      username: xxxxxx # this is the registry username
      password: xxxxxx # this is the registry password
    tls:
      cert_file: # path to the cert file used in the registry
      key_file:  # path to the key file used in the registry
      ca_file:   # path to the ca file used in the registry
```

</TabItem>
<TabItem value="Without Authentication">

```yaml
mirrors:
  docker.io:
    endpoint:
      - "https://registry.example.com:5000"
configs:
  "registry.example.com:5000":
    tls:
      cert_file: # path to the cert file used in the registry
      key_file:  # path to the key file used in the registry
      ca_file:   # path to the ca file used in the registry
```
</TabItem>
</Tabs>

### Without TLS

Below are examples showing how you may configure `/etc/rancher/k3s/registries.yaml` on each node when _not_ using TLS.

<Tabs>
<TabItem value="With Authentication">

```yaml
mirrors:
  docker.io:
    endpoint:
      - "http://registry.example.com:5000"
configs:
  "registry.example.com:5000":
    auth:
      username: xxxxxx # this is the registry username
      password: xxxxxx # this is the registry password
```

</TabItem>
<TabItem value="Without Authentication">

```yaml
mirrors:
  docker.io:
    endpoint:
      - "http://registry.example.com:5000"
```
</TabItem>
</Tabs>

> In case of no TLS communication, you need to specify `http://` for the endpoints, otherwise it will default to https.
 
In order for the registry changes to take effect, you need to restart K3s on each node.

## Troubleshooting Image Pulls

When Kubernetes experiences problems pulling an image, the error displayed by the kubelet may only reflect the terminal error returned
by the pull attempt made against the default endpoint, making it appear that the configured endpoints are not being used.

Check the containerd log on the node at `/var/lib/rancher/k3s/agent/containerd/containerd.log` for detailed information on the root cause of the failure.

## Adding Images to the Private Registry

Mirroring images to a private registry requires a host with Docker or other 3rd party tooling that is capable of pulling and pushing images.  
The steps below assume you have a host with dockerd and the docker CLI tools, and access to both docker.io and your private registry.

1. Obtain the `k3s-images.txt` file from GitHub for the release you are working with.
2. Pull each of the K3s images listed on the k3s-images.txt file from docker.io.  
   Example: `docker pull docker.io/rancher/mirrored-pause:3.6`
3. Retag the images to the private registry.  
   Example: `docker tag docker.io/rancher/mirrored-pause:3.6 registry.example.com:5000/rancher/mirrored-pause:3.6`
4. Push the images to the private registry.  
   Example: `docker push registry.example.com:5000/rancher/mirrored-pause:3.6`
