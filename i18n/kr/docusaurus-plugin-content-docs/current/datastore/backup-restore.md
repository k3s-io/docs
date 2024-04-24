---
title: Backup and Restore
---

The way K3s is backed up and restored depends on which type of datastore is used.

:::warning
In addition to backing up the datastore itself, you must also back up the server token file at `/var/lib/rancher/k3s/server/token`.
You must restore this file, or pass its value into the `--token` option, when restoring from backup.
If you do not use the same token value when restoring, the snapshot will be unusable, as the token is used to encrypt confidential data within the datastore itself.
:::

## Backup and Restore with SQLite

No special commands are required to back up or restore the SQLite datastore. 

* To back up the SQLite datastore, take a copy of `/var/lib/rancher/k3s/server/db/`.
* To restore the SQLite datastore, restore the contents of `/var/lib/rancher/k3s/server/db` (and the token, as discussed above).

## Backup and Restore with External Datastore

When an external datastore is used, backup and restore operations are handled outside of K3s. The database administrator will need to back up the external database, or restore it from a snapshot or dump.

We recommend configuring the database to take recurring snapshots.

For details on taking database snapshots and restoring your database from them, refer to the official database documentation:

- [Official MySQL documentation](https://dev.mysql.com/doc/refman/8.0/en/replication-snapshot-method.html)
- [Official PostgreSQL documentation](https://www.postgresql.org/docs/8.3/backup-dump.html)
- [Official etcd documentation](https://etcd.io/docs/latest/op-guide/recovery/)

## Backup and Restore with Embedded etcd Datastore

See the [`k3s etcd-snapshot` command documentation](../cli/etcd-snapshot.md) for information on performing backup and restore operations on the embedded etcd datastore.
