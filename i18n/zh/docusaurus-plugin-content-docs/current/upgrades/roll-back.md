# Rolling Back K3s

You can roll back a K3s Kubernetes version after a problematic upgrade, using a combination of K3s binary downgrading and datastore restoration. This is applicable to both clusters with external databases and clusters using an embedded etcd.

## Important Considerations

- **Backups:** Before upgrading, ensure you have a valid database or etcd snapshot from your cluster running the older version of K3s. Without a backup, a rollback is impossible.
- **Potential Data Loss:** The `k3s-killall.sh` script forcefully terminates K3s processes and may result in data loss if applications are not properly shut down.
- **Version Specifics:** Always verify K3s and component versions before and after the rollback.

## Rollback with External Database

This section applies to K3s clusters using an external database (e.g., PostgreSQL, MySQL).

1. If the cluster is running and the Kubernetes API is available, gracefully stop workloads by draining all nodes:

    ```bash
    kubectl drain --ignore-daemonsets --delete-emptydir-data <NODE-ONE-NAME> <NODE-TWO-NAME> <NODE-THREE-NAME> ...
    ```

    :::note

    This process may disrupt running applications.

    :::

1. On each node, stop the K3s service and all running pod processes:

    ```bash
    k3s-killall.sh
    ```

1. Restore a database snapshot taken before upgrading K3s and verify the integrity of the database. For example, if you're using PostgreSQL, run the following command:

    ```bash
    pg_restore -U <DB-USER> -d <DB-NAME> <BACKUP-FILE>
    ```

1. On each node, roll back the K3s binary to the previous version.

    - Clusters with Internet Access:
      - Server nodes:

        ```bash
        curl -sfL https://get.k3s.io | INSTALL_K3S_VERSION=vX.Y.Zk3s1 INSTALL_K3S_EXEC="server" sh -
        ```

      - Agent nodes:

        ```bash
        curl -sfL https://get.k3s.io | INSTALL_K3S_VERSION=vX.Y.Zk3s1 INSTALL_K3S_EXEC="agent" sh -
        ```

    - Air-gapped Clusters:

      - Download the artifacts and run the [install script](../installation/airgap.md#install-k3s) locally. Verify the K3s version after install with `k3s --version` and reapply any custom configurations that where used before the upgrade.

1. Start the K3s service on each node:

    ```bash
    systemctl start k3s
    ```

1. Verify the K3s service status with `systemctl status k3s`.

## Rollback with Embedded etcd

This section applies to K3s clusters using an embedded etcd.

1. If the cluster is running and the Kubernetes API is available, gracefully stop workloads by draining all nodes:

    ```bash
    kubectl drain --ignore-daemonsets --delete-emptydir-data <NODE-ONE-NAME> <NODE-TWO-NAME> <NODE-THREE-NAME> ...
    ```

1. On each node, stop the K3s service and all running pod processes:

    ```bash
    k3s-killall.sh
    ```

1. On each node, roll back the K3s binary to the previous version, but *do not* start K3s.

    - Clusters with Internet Access:

      - Server nodes:

        ```bash
        curl -sfL https://get.k3s.io | INSTALL_K3S_VERSION=vX.Y.Zk3s1 INSTALL_K3S_EXEC="server" INSTALL_K3S_SKIP_START="true" sh -
        ```

      - Agent nodes:

        ```bash
        curl -sfL https://get.k3s.io | INSTALL_K3S_VERSION=vX.Y.Zk3s1 INSTALL_K3S_EXEC="agent" INSTALL_K3S_SKIP_START="true" sh -
        ```

    - Air-gapped Clusters:

      - Download the artifacts and run the [install script](../installation/airgap.md#install-k3s) locally. Add the environment variable `INSTALL_K3S_SKIP_START="true"` when running the install script to prevent K3s from starting.

1. On the first server node or the node without a `server:` entry in its [K3s config file](../installation/configuration.md), initiate the cluster restore. Refer to the [Snapshot Restore Steps](../cli/etcd-snapshot.md#snapshot-restore-steps) for more information:

    ```bash
    k3s server --cluster-reset --cluster-reset-restore-path=<PATH-TO-SNAPSHOT>
    ```

    :::warning
    This will overwrite all data in the etcd datastore. Verify the snapshot's integrity before restoring. Be aware that large snapshots can take a long time to restore.
    :::

1. Start the K3s service on the first server node:

    ```bash
    systemctl start k3s
    ```

1. On the other server nodes, remove the K3s database directory:

    ```bash
    rm -rf /var/lib/rancher/k3s/server/db
    ```

1. Start the K3s service on the other server nodes:

    ```bash
    systemctl start k3s
    ```

1. Start the K3s service on all agent nodes:

    ```bash
    systemctl start k3s
    ```

1. Verify the K3s service status with `systemctl status k3s`.

## Verification

After the rollback, verify the following:

- K3s version: `k3s --version`
- Kubernetes cluster health: `kubectl get nodes`
- Application functionality.
- Check the K3s logs for errors.
