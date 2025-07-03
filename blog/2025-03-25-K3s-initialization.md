---
title: K3s initialization deep dive
description: Explain k3s initialization steps
authors: manuelbuil # Fill out your info in the authors.yml file
hide_table_of_contents: true
---
K3s is a lightweight Kubernetes distribution which excels in its deployment speed and minimal resource footprint. In fact, a lot of our users love K3s because it offers an unparalleled initialization speed.

<!-- truncate -->
This blog post delves into the heart of K3s's efficiency: its initialization process. We'll embark on a journey through the steps that enable K3s to materialize a fully functional Kubernetes cluster so quickly. By examining K3s’s own logs, we'll unravel the meaning behind each step, providing you with a practical understanding of how K3s achieves its remarkable speed. This exploration not only illuminates the inner workings of K3s but also equips you with the knowledge to troubleshoot your deployments.

## The Embedded Powerhouse ⚙️⚡
K3s leverages `go-bindata` to embed essential Linux userspace binaries and manifests directly into its executable. This eliminates external dependencies and streamlines the deployment process. Within the K3s binary, you'll find core components like `runc` and `containerd`, along with the k3s-root tarball (e.g. k3s-root-amd64.tar). This tarball contains all the userspace binaries necessary for K3s to function, reducing the reliance on the host OS. If you would like all the K3s embedded binaries to take preference over the host OS binaries, you should use the `--prefer-bundled-bin` flag.

The embedded binaries are always deployed in the same directory: `/var/lib/rancher/k3s/data`. If you inspect this folder, you will notice it contains at least three subdirectories: `cni`, `current` and a long string of characters (or SHA). That long string of characters is generated when building K3s and it is the result of a `sha256sum` operation made on the tarball with the embedded binaries. As these change in each release, you will see a different string of characters for each release. In fact, after an upgrade, there will be two directories with a long string of characters as their name.

`current` is just a symlink to the SHA directory and `cni` includes different cni plugins that are also symlinks to the cni binary in the SHA directory. This is because we are building all cni plugins in just one binary using multi-exec tooling. This is again a way to be more efficient and less resource consuming. If your current K3s deployment underwent an upgrade process, you will see one extra directory called `previous`, which is another symlink to the previous SHA directory. For clarification this example:

```
$> ls -ahltr /var/lib/rancher/k3s/data/
total 24K
-rw------- 1 root root    0 Mar 19 06:22 .lock
drwxr-xr-x 4 root root 4.0K Mar 19 06:22 ..
drwxr-xr-x 4 root root 4.0K Mar 19 06:28 82142f5157c67effc219aeefe0bc03e0460fc62b9fbae9e901270c86b5635d53
lrwxrwxrwx 1 root root   90 Mar 19 06:28 previous -> /var/lib/rancher/k3s/data/82142f5157c67effc219aeefe0bc03e0460fc62b9fbae9e901270c86b5635d53
drwxr-xr-x 4 root root 4.0K Mar 19 06:30 b13851fe661ab93938fc9a881cdce529da8c6b9b310b2440ef01a860f8b9c3a9
lrwxrwxrwx 1 root root   90 Mar 19 06:30 current -> /var/lib/rancher/k3s/data/b13851fe661ab93938fc9a881cdce529da8c6b9b310b2440ef01a860f8b9c3a9
drwxr-xr-x 2 root root 4.0K Mar 19 06:30 cni
drwxr-xr-x 4 root root 4.0K Mar 19 06:40 .
```

Additionally, K3s includes embedded Helm charts and manifests for deploying critical services such as CoreDNS, Traefik, and local storage. These embedded charts, formatted as yaml files, can be found in the control plane nodes in the directory: `/var/lib/rancher/k3s/server/manifests`.

For 67MB our K3s binary includes a lot of stuff!


## The Boot Sequence, Step-by-Step 👣
Now that we established how K3s is carrying its embedded tools, we can explore the boot up sequence. Let us look at the typical logs you can find in `journalctl` when deploying a control-plane or K3s server instance. It all starts with:

```
Starting Lightweight Kubernetes...
```

And then:

```
/usr/bin/systemctl is-enabled --quiet nm-cloud-setup.service
```

This part is checking for a network manager utility which must be disabled as described in the [docs](https://docs.k3s.io/installation/requirements?_highlight=nm&_highlight=cloud&_highlight=setup.service&os=rhel#operating-systems). It configures some parts of the network stack, specifically the routing tables, which conflict with Kubernetes networking, and that is why we verify if it was correctly disabled.

The next message should look familiar

```
Acquiring lock file /var/lib/rancher/k3s/data/.lock
Preparing data dir /var/lib/rancher/k3s/data/f8e9b5e7d85085972f4a9ddfd539d4dcf887be2e380a55f415c93cac5516dad5
```

When this message is shown, the directory where K3s deploys the embedded binaries has already been created. At this point, K3s will extract the binaries. We use the lock to avoid concurrent modifications, preventing K3s embedded commands like `kubectl` or `ctr` from executing and disturbing the K3s initialization.

The next block of logs point at the K3s version and the datastore. In this case, I am using the default datastore which means kine with sqlite. For more information on the different datastores available check this [link](https://docs.k3s.io/datastore)

```
Starting k3s v1.32.2+k3s1
Configuring sqlite3 database connection pooling: maxIdleConns=2, maxOpenConns=0, connMaxLifetime=0s
Configuring database table schema and indexes, this may take a moment...
Database tables and indexes are up to date
Kine available at unix://kine.sock
```

Once the datastore is available k3s locks the bootstrap key. This step is useful for HA mode and this this key is just a placeholder so that other control-plane nodes do not start generating new CA certs. As we are not using HA mode in this example, this is not relevant.

```
Bootstrap key locked for initial create
```

K3s then generates all the TLS certificates required for the internal communications:

```
generated self-signed CA certificate
certificate CN=system:admin,O=system:masters signed by CN=k3s-client-ca@1742309831
certificate CN=system:k3s-supervisor,O=system:masters signed by CN=k3s-client-ca@1742309831
certificate CN=system:kube-controller-manager signed by CN=k3s-client-ca@1742309831
certificate CN=system:kube-scheduler signed by CN=k3s-client-ca@1742309831
certificate CN=system:apiserver,O=system:masters signed by CN=k3s-client-ca@1742309831
certificate CN=k3s-cloud-controller-manager signed by CN=k3s-client-ca@1742309831
generated self-signed CA certificate CN=k3s-server-ca@1742309831
certificate CN=kube-apiserver signed by CN=k3s-server-ca@1742309831
generated self-signed CA certificate CN=k3s-request-header-ca@1742309831
certificate CN=system:auth-proxy signed by CN=k3s-request-header-ca@1742309831
generated self-signed CA certificate CN=etcd-server-ca@1742309831
certificate CN=etcd-client signed by CN=etcd-server-ca@1742309831
generated self-signed CA certificate CN=etcd-peer-ca@1742309831
certificate CN=etcd-peer signed by CN=etcd-peer-ca@1742309831
certificate CN=etcd-server signed by CN=etcd-server-ca@1742309831
certificate CN=k3s,O=k3s signed by CN=k3s-server-ca@1742309831
```

And then saves the bootstrap data in the bootstrap key. Again, this is not relevant for this example:

```
Saving cluster bootstrap data to datastore
```

After that, K3s starts the different Kubernetes components. These components are all run within the k3s process as goroutines, which are lightweight, concurrent functions in Go, allowing for efficient resource usage. This is another design decision taken to reduce boot time and reduce resource consumption.

```
Running kube-apiserver
Running kube-scheduler
Running kube-controller-manager
```

Manifests for packaged components are extracted to `/var/lib/rancher/k3s/server/manifests/`. When all the different Kubernetes components are running and K3s initialization is ready, the deploy controller begins watching this directory and applies all the manifests. This is how components like CoreDNS or Traefik eventually get installed.

And that’s it, in a short period of time, you end up with a fully deployed and running Kubernetes distribution. 🎉

## Conclusion 🏁

This exploration has hopefully demystified some of the initial steps that enable K3s to materialize a fully functional Kubernetes cluster. By examining the logs, we've shed some light on the meaning behind each step, providing you with a deeper understanding of how K3s deploys in such a fast manner. We hope you find this knowledge useful to troubleshoot or at least to understand a bit deeper how K3s works.
