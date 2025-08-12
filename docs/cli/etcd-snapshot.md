---
title: etcd-snapshot
---

# k3s etcd-snapshot

This page describes how to use the `k3s etcd-snapshot` CLI tool to manage etcd snapshots and how to restore from an etcd snapshot.

K3s etcd snapshots are stored on the node file system, and may optionally be uploaded to an S3 compatible object store for disaster recovery scenarios. Snapshots can be both automated on a reoccurring schedule, and taken manually on-demand.  The `k3s etcd-snapshot` CLI tool offers a set of subcommands that can be used to create, delete, and manage snapshots.

| Subcommand | Description |
| ----------- | --------------- |
| delete      |  Delete given snapshot(s) |
| ls, list, l |  List snapshots |
| prune       |  Remove snapshots that exceed the configured retention count |
| save        |  Trigger an on-demand etcd snapshot |

For additional information on the etcd snapshot subcommands, run `k3s etcd-snapshot --help`.

## Creating Snapshots

<Tabs groupId="snapshots">
<TabItem value="Scheduled">

Scheduled snapshots are enabled by default, at 00:00 and 12:00 system time, with 5 snapshots retained. Scheduled snapshots have a name that starts with `etcd-snapshot`, followed by the node name and timestamp.

The following options control the operation of scheduled snapshots:

| Flag | Description |
| ----------- | --------------- |
| `--etcd-disable-snapshots` | Disable scheduled snapshots |
| `--etcd-snapshot-name` | Sets the base name of etcd scheduled snapshots. (Default: `etcd-snapshot`) |
| `--etcd-snapshot-compress` | Compress etcd snapshots |
| `--etcd-snapshot-dir` | Directory to save db snapshots. (Default location: `${data-dir}/db/snapshots`) |
| `--etcd-snapshot-retention` | Number of snapshots to retain (default: 5) |
| `--etcd-snapshot-schedule-cron` |  Snapshot interval time in cron spec. eg. every 5 hours `0 */5 * * *` (default: `0 */12 * * *`) |

The data-dir value defaults to `/var/lib/rancher/k3s` and can be changed independently by setting the `--data-dir` flag.

Scheduled snapshots are saved to the path set by the server's `--etcd-snapshot-dir` value. If you want them replicated in S3 compatible object stores, refer to [S3 configuration options](#s3-compatible-object-store-support)

</TabItem>
<TabItem value="On-demand">

Snapshots can be saved manually by running the `k3s etcd-snapshot save` command. There is no retention for these on-demand snapshots and the user needs to remove them manually by using `k3s etcd-snapshot delete` or `k3s etcd-snapshot prune` commands. On-demand snapshots have a name that starts with `on-demand`, followed by the node name and timestamp.

The following options control the operation of on-demand snapshots:

| Flag | Description |
| ----------- | --------------- |
| `--name` | Sets the base name of etcd on-demand snapshots. (Default: `on-demand`) |
| `--etcd-snapshot-compress` | Compress etcd snapshots |
| `--etcd-snapshot-dir` | Directory to save db snapshots. (Default location: `${data-dir}/db/snapshots`) |

The data-dir value defaults to `/var/lib/rancher/k3s` and can be changed independently by setting the `--data-dir` flag.

The `--name` flag can only be set when running the `k3s etcd-snapshot save` command. The other two can also be part of the `k3s server` [configuration file](../installation/configuration.md#configuration-file)

On-demand snapshots are saved to the path set by the server's `--etcd-snapshot-dir` value. If you want them replicated in S3 compatible object stores, refer to [S3 configuration options](#s3-compatible-object-store-support)

</TabItem>
</Tabs>


## Deleting Snapshots

Scheduled snapshots are deleted automatically when the number of snapshots exceeds the configured retention count (5 by default). The oldest snapshots are removed first. 

To manually delete scheduled snapshot(s) or on-demand snapshot(s), you can use the `k3s etcd-snapshot delete` command:

```bash
k3s etcd-snapshot delete <SNAPSHOT-NAME-1> <SNAPSHOT-NAME-2> ...
```

The `prune` subcommand removes snapshots that match the name prefix (`on-demand` by default) and exceed the configured retention count. It includes the flag `--snapshot-retention` to set the retention count. For scheduled snapshots, it overrides the default retention policy. On-demand snapshots have no retention policy and hence this flag is required.

Prune "on-demand" snapshots down to a smaller amount:
```bash
k3s etcd-snapshot prune --snapshot-retention  <NUM-OF-SNAPSHOTS-TO-RETAIN>
```
Prune "scheduled" snapshots down to a smaller amount:
```bash
k3s etcd-snapshot prune --name etcd-snapshot --etcd-snapshot-retention <NUM-OF-SNAPSHOTS-TO-RETAIN>
```

## S3 Compatible Object Store Support

K3s supports replicating etcd snapshots to and restoring etcd snapshots from S3-compatible object stores. S3 support is available for both on-demand and scheduled snapshots.

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

For example, this is how the creation and deletion of on-demand etcd snapshots in S3 would work:

```shell-session
$ k3s etcd-snapshot --s3 --s3-bucket=test-bucket --s3-access-key=test --s3-secret-key=secret save
INFO[0155] Snapshot on-demand-server-0-1753178523 saved. 
INFO[0155] Snapshot on-demand-server-0-1753178523 saved. 

$ k3s etcd-snapshot --s3 --s3-bucket=test-bucket --s3-access-key=test --s3-secret-key=secret ls
Name                              Location                                                                          Size    Created
on-demand-server-0-1753178523     s3://test-bucket/test-folder/on-demand-server-0-1753178523                        5062688 2025-07-22T10:02:03Z
on-demand-server-0-1753178523     file:///var/lib/rancher/k3s/server/db/snapshots/on-demand-server-0-1753178523     5062688 2025-07-22T10:02:03Z

$ k3s etcd-snapshot --s3 --s3-bucket=test-bucket --s3-access-key=test --s3-secret-key=secret delete on-demand-server-0-1753178523
INFO[0000] Snapshot on-demand-server-0-1753178523 deleted.

$ k3s etcd-snapshot --s3 --s3-bucket=test-bucket --s3-access-key=test --s3-secret-key=secret ls
Name                              Location                                                                          Size    Created
```

### S3 Retention

:::info Version Gate
Starting in versions v1.34.0+k3s1, v1.33.4+k3s1, v1.32.8+k3s1, v1.31.12+k3s1, K3s includes a new flag for S3 retention. It has the same default value as the local snapshot retention.
:::

| Flag | Description |
| ----------- | --------------- |
| `--etcd-s3-retention` | Number of snapshots in S3 to retain (default: `5`) |


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

When restoring a snapshot, you don't need to use the same K3s version that created it; a higher minor version is also acceptable.

### Snapshot Restore Steps

Select the tab below that matches your cluster configuration.

<Tabs queryString="etcdsnap">
<TabItem value="Single Server" default>

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
If an etcd-s3 backup configuration is defined within the K3s config file, the k3s restore will attempt to pull the snapshot file from the configured S3 bucket. In this instance only the snapshot filename should be passed in the argument `--cluster-reset-restore-path`. To restore from a local snapshot file, where an etcd-s3 backup configuration is present, add the argument `--etcd-s3=false` and pass the full path to the local snapshot file in the argument `--cluster-reset-restore-path`.

As a safety mechanism, when K3s resets the cluster, it creates an empty file at `/var/lib/rancher/k3s/server/db/reset-flag` that prevents users from accidentally running multiple cluster resets in succession. This file is deleted when K3s starts normally.

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

If an etcd-s3 backup configuration is defined within the K3s config file, the k3s restore will attempt to pull the snapshot file from the configured S3 bucket. In this instance only the snapshot filename should be passed in the argument `--cluster-reset-restore-path`. To restore from a local snapshot file, where an etcd-s3 backup configuration is present, add the argument `--etcd-s3=false` and pass the full path to the local snapshot file in the argument `--cluster-reset-restore-path`.

As a safety mechanism, when K3s resets the cluster, it creates an empty file at `/var/lib/rancher/k3s/server/db/reset-flag` that prevents users from accidentally running multiple cluster resets in succession. This file is deleted when K3s starts normally.

</TabItem>
</Tabs>

#### Restoring To New Hosts

It is possible to restore an etcd snapshot to a different host than it was taken on. When doing so, you must pass the [server token](token.md#server) that was originally used when taking the snapshot, as it is used to decrypt the bootstrap data inside the snapshot. The process is the same as above but changing step 2 by:

1. In the node that took the snapshot save the value of: `/var/lib/rancher/k3s/server/token`. This is `<BACKED-UP-TOKEN-VALUE>` in step 3.

2. Copy the snapshot to the new node. The path in the node is `<PATH-TO-SNAPSHOT>` in step 3

3. Initiate the restore from snapshot on the first server node with the following commands:

```bash
k3s server \
  --cluster-reset \
  --cluster-reset-restore-path=<PATH-TO-SNAPSHOT>
  --token=<BACKED-UP-TOKEN-VALUE>
```
The token value can also be set in the K3s config file.


:::warning
1. Node resources are also included in the etcd snapshot. If restoring to a new set of nodes, you will need to manually delete any old nodes that are no longer present in the cluster.
2. If there is a token set in the K3s config file, make sure it is the same as the `<BACKED-UP-TOKEN-VALUE>`, otherwise k3s will fail to start.
:::


## ETCDSnapshotFile Custom Resources

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
