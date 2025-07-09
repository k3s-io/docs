---
title: etcd-snapshot
---

# k3s etcd-snapshot

This page documents the management of etcd snapshots using the `k3s etcd-snapshot` CLI, as well as configuration of etcd scheduled snapshots for the `k3s server` process, and use of the `k3s server --cluster-reset` command to reset etcd cluster membership and optionally restore etcd snapshots.

## Creating Snapshots

Snapshots are saved to the path set by the server's `--etcd-snapshot-dir` value, which defaults to `${data-dir}/server/db/snapshots`. The data-dir value defaults to `/var/lib/rancher/k3s` and can be changed independently by setting the `--data-dir` flag.

### Scheduled Snapshots

Scheduled snapshots are enabled by default, at 00:00 and 12:00 system time, with 5 snapshots retained. To configure the snapshot interval or the number of retained snapshots, refer to the [snapshot configuration options](#snapshot-configuration-options).

Scheduled snapshots have a name that starts with `etcd-snapshot`, followed by the node name and timestamp. The base name can be changed with the `--etcd-snapshot-name` flag in the server configuration.

### On-demand Snapshots

Snapshots can be saved manually by running the `k3s etcd-snapshot save` command.

On-demand snapshots have a name that starts with `on-demand`, followed by the node name and timestamp. The base name can be changed with the `--name` flag when saving the snapshot.

### Snapshot Configuration Options

These flags can be passed to the `k3s server` command to reset the etcd cluster, and optionally restore from a snapshot.

| Flag | Description |
| ----------- | --------------- |
| `--cluster-reset`| Forget all peers and become sole member of a new cluster. This can also be set with the environment variable `[$K3S_CLUSTER_RESET]` |
| `--cluster-reset-restore-path` | Path to snapshot file to be restored |

These flags are valid for both `k3s server` and `k3s etcd-snapshot`, however when passed to `k3s etcd-snapshot` the `--etcd-` prefix can be omitted to avoid redundancy.
Flags can be passed in with the command line, or in the [configuration file,](../installation/configuration.md#configuration-file ) which may be easier to use.

| Flag | Description |
| ----------- | --------------- |
| `--etcd-disable-snapshots` | Disable scheduled snapshots |
| `--etcd-snapshot-compress` | Compress etcd snapshots |
| `--etcd-snapshot-dir` | Directory to save db snapshots. (Default location: `${data-dir}/db/snapshots`) |
| `--etcd-snapshot-retention` | Number of snapshots to retain (default: 5) |
| `--etcd-snapshot-schedule-cron` |  Snapshot interval time in cron spec. eg. every 5 hours `0 */5 * * *` (default: `0 */12 * * *`) |

### S3 Compatible Object Store Support

K3s supports writing etcd snapshots to and restoring etcd snapshots from S3-compatible object stores. S3 support is available for both on-demand and scheduled snapshots.

| Flag | Description |
| ----------- | --------------- |
| `--etcd-s3` | Enable backup to S3 |
| `--etcd-s3-endpoint` | S3 endpoint url |
| `--etcd-s3-endpoint-ca` | S3 custom CA cert to connect to S3 endpoint |
| `--etcd-s3-skip-ssl-verify` | Disables S3 SSL certificate validation |
| `--etcd-s3-access-key` |  S3 access key |
| `--etcd-s3-secret-key` | S3 secret key |
| `--etcd-s3-bucket` | S3 bucket name |
| `--etcd-s3-region` | S3 region / bucket location (optional). defaults to us-east-1 |
| `--etcd-s3-folder` | S3 folder |
| `--etcd-s3-proxy` | Proxy server to use when connecting to S3, overriding any proxy-releated environment variables |
| `--etcd-s3-insecure` | Disables S3 over HTTPS |
| `--etcd-s3-timeout` | S3 timeout (default: `5m0s`) |
| `--etcd-s3-config-secret` | Name of secret in the kube-system namespace used to configure S3, if etcd-s3 is enabled and no other etcd-s3 options are set |

To perform an on-demand etcd snapshot and save it to S3:

```bash
k3s etcd-snapshot save \
  --s3 \
  --s3-bucket=<S3-BUCKET-NAME> \
  --s3-access-key=<S3-ACCESS-KEY> \
  --s3-secret-key=<S3-SECRET-KEY>
```

To perform an on-demand etcd snapshot restore from S3, first make sure that K3s isn't running. Then run the following commands:

```bash
k3s server \
  --cluster-init \
  --cluster-reset \
  --etcd-s3 \
  --cluster-reset-restore-path=<SNAPSHOT-NAME> \
  --etcd-s3-bucket=<S3-BUCKET-NAME> \
  --etcd-s3-access-key=<S3-ACCESS-KEY> \
  --etcd-s3-secret-key=<S3-SECRET-KEY>
```

### S3 Configuration Secret Support

:::info Version Gate
S3 Configuration Secret support is available as of the August 2024 releases: v1.30.4+k3s1, v1.29.8+k3s1, v1.28.13+k3s1
:::

K3s supports reading etcd S3 snapshot configuration from a Kubernetes Secret.
This may be preferred to hardcoding credentials in K3s CLI flags or config files for security reasons, or if credentials need to be rotated without restarting K3s.
To pass S3 snapshot configuration via a Secret, start K3s with `--etcd-s3` and `--etcd-s3-config-secret=<SECRET-NAME>`.
The Secret does not need to exist when K3s is started, but it will be checked for every time a snapshot save/list/delete/prune operation is performed.

The S3 config Secret cannot be used when restoring a snapshot, as the apiserver is not available to provide the secret during a restore.
S3 configuration must be passed via the CLI when restoring a snapshot stored on S3.

:::note
Pass only the the `--etcd-s3` and `--etcd-s3-config-secret` flags to enable the Secret.  
If any other S3 configuration flags are set, the Secret will be ignored.
:::

Keys in the Secret correspond to the `--etcd-s3-*` CLI flags listed above.
The `etcd-s3-endpoint-ca` key accepts a PEM-encoded CA bundle, or the `etcd-s3-endpoint-ca-name` key may be used to specify the name of a ConfigMap in the `kube-system` namespace containing one or more PEM-encoded CA bundles.

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: k3s-etcd-snapshot-s3-config
  namespace: kube-system
type: etcd.k3s.cattle.io/s3-config-secret
stringData:
  etcd-s3-endpoint: ""
  etcd-s3-endpoint-ca: ""
  etcd-s3-endpoint-ca-name: ""
  etcd-s3-skip-ssl-verify: "false"
  etcd-s3-access-key: "AWS_ACCESS_KEY_ID"
  etcd-s3-secret-key: "AWS_SECRET_ACCESS_KEY"
  etcd-s3-bucket: "bucket"
  etcd-s3-folder: "folder"
  etcd-s3-region: "us-east-1"
  etcd-s3-insecure: "false"
  etcd-s3-timeout: "5m"
  etcd-s3-proxy: ""
```

## Managing Snapshots

k3s supports a set of subcommands for working with your etcd snapshots.

| Subcommand | Description |
| ----------- | --------------- |
| delete      |  Delete given snapshot(s) |
| ls, list, l |  List snapshots |
| prune       |  Remove snapshots that exceed the configured retention count |
| save        |  Trigger an immediate etcd snapshot |

These commands will perform as expected whether the etcd snapshots are stored locally or in an S3 compatible object store.

For additional information on the etcd snapshot subcommands, run `k3s etcd-snapshot --help`.

Delete a snapshot from S3.

```bash
k3s etcd-snapshot delete          \
  --s3                            \
  --s3-bucket=<S3-BUCKET-NAME>    \
  --s3-access-key=<S3-ACCESS-KEY> \
  --s3-secret-key=<S3-SECRET-KEY> \
  <SNAPSHOT-NAME>
```

Prune local snapshots with the default retention policy (5). The `prune` subcommand takes an additional flag `--snapshot-retention` that allows for overriding the default retention policy.

```bash
k3s etcd-snapshot prune
```

```bash
k3s etcd-snapshot prune --snapshot-retention 10
```

### ETCDSnapshotFile Custom Resources

:::info Version Gate
ETCDSnapshotFiles are available as of the November 2023 releases: v1.28.4+k3s2, v1.27.8+k3s2, v1.26.11+k3s2, v1.25.16+k3s4
:::

Snapshots can be viewed remotely using any Kubernetes client by listing or describing cluster-scoped `ETCDSnapshotFile` resources.
Unlike the `k3s etcd-snapshot list` command, which only shows snapshots visible to that node, `ETCDSnapshotFile` resources track all snapshots present on cluster members.

```shell-session
$ kubectl get etcdsnapshotfile
NAME                                             SNAPSHOTNAME                        NODE           LOCATION                                                                            SIZE      CREATIONTIME
local-on-demand-k3s-server-1-1730308816-3e9290   on-demand-k3s-server-1-1730308816   k3s-server-1   file:///var/lib/rancher/k3s/server/db/snapshots/on-demand-k3s-server-1-1730308816   2891808   2024-10-30T17:20:16Z
s3-on-demand-k3s-server-1-1730308816-79b15c      on-demand-k3s-server-1-1730308816   s3             s3://etcd/k3s-test/on-demand-k3s-server-1-1730308816                                2891808   2024-10-30T17:20:16Z
```

```shell-session
$ kubectl describe etcdsnapshotfile s3-on-demand-k3s-server-1-1730308816-79b15c
Name:         s3-on-demand-k3s-server-1-1730308816-79b15c
Namespace:
Labels:       etcd.k3s.cattle.io/snapshot-storage-node=s3
Annotations:  etcd.k3s.cattle.io/snapshot-token-hash: b4b83cda3099
API Version:  k3s.cattle.io/v1
Kind:         ETCDSnapshotFile
Metadata:
  Creation Timestamp:  2024-10-30T17:20:16Z
  Finalizers:
    wrangler.cattle.io/managed-etcd-snapshots-controller
  Generation:        1
  Resource Version:  790
  UID:               bec9a51c-dbbe-4746-922e-a5136bef53fc
Spec:
  Location:   s3://etcd/k3s-test/on-demand-k3s-server-1-1730308816
  Node Name:  s3
  s3:
    Bucket:           etcd
    Endpoint:         s3.example.com
    Prefix:           k3s-test
    Region:           us-east-1
    Skip SSL Verify:  true
  Snapshot Name:      on-demand-k3s-server-1-1730308816
Status:
  Creation Time:  2024-10-30T17:20:16Z
  Ready To Use:   true
  Size:           2891808
Events:
  Type    Reason               Age   From            Message
  ----    ------               ----  ----            -------
  Normal  ETCDSnapshotCreated  113s  k3s-supervisor  Snapshot on-demand-k3s-server-1-1730308816 saved on S3
```


## Restoring Snapshots

K3s runs through several steps when restoring a snapshot:
1. If the snapshot is stored on S3, the file is downloaded into the snapshot directory.
2. If the snapshot is compressed, it is decompressed.
3. If present, the current etcd database files are moved to `${data-dir}/server/db/etcd-old-$TIMESTAMP/`.
4. The snapshot's contents are extracted out to disk, and the checksum is verified.
5. Etcd is started, and all etcd cluster members except the current node are removed from the cluster.
6. CA Certificates and other confidential data are extracted from the datastore and written to disk, for later use.
7. The restore is complete, and K3s can be restarted and used normally on the server where the restore was performed.
8. (optional) Agents and control-plane servers can be started normally. 
8. (optional) Etcd servers can be restarted to rejoin to the cluster after removing old database files.

### Snapshot Restore Steps

Select the tab below that matches your cluster configuration.

<Tabs queryString="etcdsnap">
<TabItem value="Single Server">

1. Stop the K3s service:
    ```bash
    systemctl stop k3s
    ```

2. Run `k3s server` with the `--cluster-reset` flag, and `--cluster-reset-restore-path` indicating the path to the snapshot to restore.
   If the snapshot is stored on S3, provide S3 configuration flags (`--etcd-s3`, `--etcd-s3-bucket`, and so on), and give only the filename name of the snapshot as the restore path.

    :::note
    Using the `--cluster-reset` flag without specifying a snapshot to restore simply resets the etcd cluster to a single member without restoring a snapshot.
    :::

    ```bash
    k3s server \
      --cluster-reset \
      --cluster-reset-restore-path=<PATH-TO-SNAPSHOT>
    ```

    **Result:** K3s restores the snapshot and resets cluster membership, then prints a message indicating that it is ready to be restarted:  
    `Managed etcd cluster membership has been reset, restart without --cluster-reset flag now.`

3. Start K3s again:
    ```bash
    systemctl start k3s
    ```
</TabItem>
<TabItem value="Multiple Servers">

In this example there are 3 servers, `S1`, `S2`, and `S3`. The snapshot is located on `S1`.

1. Stop K3s on all servers:
    ```bash
    systemctl stop k3s
    ```

2. On S1, run `k3s server` with the `--cluster-reset` option, and `--cluster-reset-restore-path` indicating the path to the snapshot to restore.
   If the snapshot is stored on S3, provide S3 configuration flags (`--etcd-s3`, `--etcd-s3-bucket`, and so on), and give only the filename name of the snapshot as the restore path.

    :::note
    Using the `--cluster-reset` flag without specifying a snapshot to restore simply resets the etcd cluster to a single member without restoring a snapshot.
    :::

    ```bash
    k3s server \
      --cluster-reset \
      --cluster-reset-restore-path=<PATH-TO-SNAPSHOT>
    ```

    **Result:** K3s restores the snapshot and resets cluster membership, then prints a message indicating that it is ready to be restarted:  
    `Managed etcd cluster membership has been reset, restart without --cluster-reset flag now.`  
    `Backup and delete ${datadir}/server/db on each peer etcd server and rejoin the nodes.`

3. On S1, start K3s again:
    ```bash
    systemctl start k3s
    ```

4. On S2 and S3, delete the data directory, `/var/lib/rancher/k3s/server/db/`:
    ```bash
    rm -rf /var/lib/rancher/k3s/server/db/
    ```

5. On S2 and S3, start K3s again to join the restored cluster:
    ```bash
    systemctl start k3s
    ```
</TabItem>
</Tabs>
