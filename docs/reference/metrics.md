---
title: Metrics
---

import Label from '@site/src/components/Label';

K3s provides metrics for monitoring the health and performance of the cluster.

Most metrics are provided by individual components. See the following component-specific documentation for more information:
* [coredns metrics](https://coredns.io/plugins/metrics/)
* [etcd metrics](https://etcd.io/docs/v3.5/metrics/)

Additional metrics may be provided by other components. Consult the upstream project documentation for any components not listed above.

## Supervisor Metrics

When K3s is started with `supervisor-metrics: true`, metrics are exposed by the K3s process and can be accessed via the `/metrics` endpoint on each node at port `6443`:

```sh
kubectl get --server https://NODENAME:6443 --raw /metrics
```

Metrics exposed by the K3s supervisor process include:
* K3s Cluster Management Metrics
* [Lasso controller metrics](https://github.com/rancher/lasso/blob/main/README.md#lasso-controller)
* [Kubernetes client and workqueue metrics](https://github.com/kubernetes/client-go/blob/master/README.md)
* [Kubernetes Node Metrics](https://kubernetes.io/docs/reference/instrumentation/node-metrics/)
* [Kubernetes Component Metrics](https://kubernetes.io/docs/reference/instrumentation/metrics/)
* [Go runtime metrics](https://pkg.go.dev/runtime/metrics#hdr-Supported_metrics)
* If the K3s embedded registry is enabled, [Spegel metrics](https://spegel.dev/docs/metrics/) and [libp2p metrics](https://github.com/libp2p/go-libp2p/blob/master/README.md)

K3s runs all Kubernetes components in the main K3s process.
Since Kubernetes uses a single Prometheus metric registry per process, metrics for all components are available via all exposed metrics endpoints.
If you scrape all the individual metrics endpoints, you may find that you are collecting duplicate metrics.
It is only necessary to scrape a single K3s metric endpoint in order to get metrics for all embedded Kubernetes components.

## K3s Cluster Management Metrics

### k3s_certificate_expiration_seconds

Remaining lifetime in seconds of the certificate, labeled by certificate subject and usages.
- Type: Gauge
- Labels: <Label>subject</Label> <Label>usage</Label>

### k3s_loadbalancer_server_connections

Count of current connections to loadbalancer server, labeled by loadbalancer name and server address.
- Type: Gauge
- Labels: <Label>name</Label> <Label>server</Label>

### k3s_loadbalancer_server_health

Current health state of loadbalancer backend servers, labeled by loadbalancer name and server address.  
State is enum of 0=INVALID, 1=FAILED, 2=STANDBY, 3=UNCHECKED, 4=RECOVERING, 5=HEALTHY, 6=PREFERRED, 7=ACTIVE.
- Type: Gauge
- Labels: <Label>name</Label> <Label>server</Label>

### k3s_loadbalancer_dial_duration_seconds

Time in seconds taken to dial a connection to a backend server, labeled by loadbalancer name and success/failure status.
- Type: Histogram
- Labels: <Label>name</Label> <Label>status</Label>

### k3s_etcd_snapshot_save_duration_seconds

Total time in seconds taken to complete the etcd snapshot process, labeled by success/failure status.
- Type: Histrogram
- Labels: <Label>status</Label>

### k3s_etcd_snapshot_save_local_duration_seconds

Total time in seconds taken to save a local snapshot file, labeled by success/failure status.
- Type: Histrogram
- Labels: <Label>status</Label>

### k3s_etcd_snapshot_save_s3_duration_seconds

Total time in seconds taken to upload a snapshot file to S3, labeled by success/failure status.
- Type: Histrogram
- Labels: <Label>status</Label>

### k3s_etcd_snapshot_reconcile_duration_seconds

Total time in seconds taken to sync the list of etcd snapshots, labeled by success/failure status.
- Type: Histrogram
- Labels: <Label>status</Label>

### k3s_etcd_snapshot_reconcile_local_duration_seconds

Total time in seconds taken to list local snapshot files, labeled by success/failure status.
- Type: Histrogram
- Labels: <Label>status</Label>

### k3s_etcd_snapshot_reconcile_s3_duration_seconds

Total time in seconds taken to list S3 snapshot files, labeled by success/failure status.
- Type: Histrogram
- Labels: <Label>status</Label>
