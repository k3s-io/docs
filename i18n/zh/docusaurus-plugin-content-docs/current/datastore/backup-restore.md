---
title: 备份和恢复
---

K3s 的备份和恢复方式取决于你使用的数据存储类型。

:::warning
除了备份数据存储本身，你还必须备份位于 `/var/lib/rancher/k3s/server/token` 的 Server Token 文件。
使用备份进行恢复时，你必须恢复此文件，或将其值传递给 `--token` 选项。
由于 Token 用于加密数据存储内的凭证数据，因此如果还原时没有使用相同的 Token 值，快照将无法使用。
:::

## 使用 SQLite 进行备份和恢复

你不需要使用特殊命令就能备份或恢复 SQLite 数据存储。

* 要备份 SQLite 数据存储，请复制 `/var/lib/rancher/k3s/server/db/`。
* 要恢复 SQLite 数据存储，请恢复 `/var/lib/rancher/k3s/server/db` 的内容（以及 Token，如上所述）。

## 使用外部数据存储进行备份和恢复

使用外部数据存储时，备份和恢复操作在 K3s 外面处理。数据库管理员需要对外部数据库进行备份，或者使用快照或转储进行恢复。

我们建议将数据库配置为**执行定期快照**。

有关获取数据库快照并从中恢复数据库的详细信息，请参阅官方数据库文档：

- [MySQL 官方文档](https://dev.mysql.com/doc/refman/8.0/en/replication-snapshot-method.html)
- [PostgreSQL 官方文档](https://www.postgresql.org/docs/8.3/backup-dump.html)
- [etcd 官方文档](https://etcd.io/docs/latest/op-guide/recovery/)

## 使用嵌入式 etcd 数据存储进行备份和恢复

有关在嵌入式 etcd 数据存储上执行备份和恢复操作的信息，请参阅 [`k3s etcd-snapshot` 命令文档](../cli/etcd-snapshot.md)。
