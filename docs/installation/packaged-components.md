---
title: "Managing Packaged Components"
---

## Auto-Deploying Manifests (AddOns)

On server nodes, any file found in `/var/lib/rancher/k3s/server/manifests` will automatically be deployed to Kubernetes in a manner similar to `kubectl apply`, both on startup and when the file is changed on disk. Deleting files out of this directory will not delete the corresponding resources from the cluster.

Manifests are tracked as `AddOn` custom resources in the `kube-system` namespace. Any errors or warnings encountered when applying the manifest file may seen by using `kubectl describe` on the corresponding `AddOn`, or by using `kubectl get event -n kube-system` to view all events for that namespace, including those from the deploy controller.

### Packaged Components

K3s comes with a number of packaged components that are deployed as AddOns via the manifests directory: `coredns`, `traefik`, `local-storage`, and `metrics-server`. The embedded `servicelb` LoadBalancer controller does not have a manifest file, but can be disabled as if it were an `AddOn` for historical reasons.

Manifests for packaged components are managed by K3s, and should not be altered. The files are re-written to disk whenever K3s is started, in order to ensure their integrity.

### User AddOns

You may place additional files in the manifests directory for deployment as an `AddOn`. Each file may contain multiple Kubernetes resources, delmited by the `---` YAML document separator. For more information on organizing resources in manifests, see the [Managing Resources](https://kubernetes.io/docs/concepts/cluster-administration/manage-deployment/) section of the Kubernetes documentation.

#### File Naming Requirements

The `AddOn` name for each file in the manifest directory is derived from the file basename. 
Ensure that all files within the manifests directory (or within any subdirectories) have names that are unique, and adhere to Kubernetes [object naming restrictions](https://kubernetes.io/docs/concepts/overview/working-with-objects/names/).
Care should also be taken not to conflict with names in use by the default K3s packaged components, even if those components are disabled.

Here is en example of an error that would be reported if the file name contains underscores:
> `Failed to process config: failed to process /var/lib/rancher/k3s/server/manifests/example_manifest.yaml:
   Addon.k3s.cattle.io "example_manifest" is invalid: metadata.name: Invalid value: "example_manifest": 
   a lowercase RFC 1123 subdomain must consist of lower case alphanumeric characters, '-' or '.', and must start and end with an alphanumeric character
   (e.g. 'example.com', regex used for validation is '[a-z0-9]([-a-z0-9]*[a-z0-9])?(\\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*')`

:::danger
If you have multiple server nodes, and place additional AddOn manifests on more than one server, it is your responsibility to ensure that files stay in sync across those nodes. K3s does not sync AddOn content between nodes, and cannot guarantee correct behavior if different servers attempt to deploy conflicting manifests.
:::

## Disabling Manifests

There are two ways to disable deployment of specific content from the manifests directory.

### Using the `--disable` flag

The AddOns for packaged components listed above, in addition to AddOns for any additional manifests placed in the `manifests` directory, can be disabled with the `--disable` flag. Disabled AddOns are actively uninstalled from the cluster, and the source files deleted from the `manifests` directory.

For example, to disable traefik from being installed on a new cluster, or to uninstall it and remove the manifest from an existing cluster, you can start K3s with `--disable=traefik`. Multiple items can be disabled by separating their names with commas, or by repeating the flag.

### Using .skip files

For any file under `/var/lib/rancher/k3s/server/manifests`, you can create a `.skip` file which will cause K3s to ignore the corresponding manifest. The contents of the `.skip` file do not matter, only its existence is checked. Note that creating a `.skip` file after an AddOn has already been created will not remove or otherwise modify it or the resources it created; the file is simply treated as if it did not exist.

For example, creating an empty `traefik.yaml.skip` file in the manifests directory before K3s is started the first time, will cause K3s to skip deploying `traefik.yaml`:
```bash
$ ls /var/lib/rancher/k3s/server/manifests
ccm.yaml      local-storage.yaml  rolebindings.yaml  traefik.yaml.skip
coredns.yaml  traefik.yaml

$ kubectl get pods -A
NAMESPACE     NAME                                     READY   STATUS    RESTARTS   AGE
kube-system   local-path-provisioner-64ffb68fd-xx98j   1/1     Running   0          74s
kube-system   metrics-server-5489f84d5d-7zwkt          1/1     Running   0          74s
kube-system   coredns-85cb69466-vcq7j                  1/1     Running   0          74s
```

If Traefik had already been deployed prior to creating the `traefik.skip` file, Traefik would stay as-is, and would not be affected by future updates when K3s is upgraded.

## Helm AddOns

For information about managing Helm charts via auto-deploying manifests, refer to the section about [Helm.](../helm.md)



