---
title: etcd-snapshot
---

# k3s etcd-snapshot

:::info 版本

从 [v1.19.1+k3s1](https://github.com/k3s-io/k3s/releases/tag/v1.19.1%2Bk3s1) 起可用

:::

在本节中，你将学习如何创建 K3s 嵌入式 etcd 数据存储的备份，以及如何使用备份恢复集群。

#### 创建快照

默认情况下，快照在系统时间 00:00 和 12:00 启用，会保留 5 个快照。要配置快照间隔或保留快照的数量，请参阅[选项](#选项)。

快照目录默认为 `${data-dir}/server/db/snapshots`。data-dir 的默认值为 `/var/lib/rancher/k3s`，你可以通过设置 `--data-dir` 标志来更改它。

#### 使用快照恢复集群

使用备份恢复 K3s 时，旧的数据目录将被移动到 `${data-dir}/server/db/etcd-old/`。然后 K3s 将尝试通过创建一个新的数据目录来恢复快照，然后使用具有一个 etcd 成员的新 K3s 集群启动 etcd。

使用备份恢复集群：

<Tabs>
<TabItem value="单服务器">

使用 `--cluster-reset` 选项运行 K3s，同时指定 `--cluster-reset-restore-path`：

```bash
k3s server \
  --cluster-reset \
  --cluster-reset-restore-path=<PATH-TO-SNAPSHOT>
```

**结果**：日志中的一条消息表示 K3s 可以在没有标志的情况下重新启动。再次启动 K3s，K3s 应该会成功运行并通过指定的快照恢复。

</TabItem>

<TabItem value="高可用">

在此示例中有 3 个 Server，分别是 `S1`、`S2`和 `S3`。快照位于 `S1` 上。

1. 在 S1 上，使用 `--cluster-reset` 选项运行 K3s，同时指定 `--cluster-reset-restore-path`：

   ```bash
   k3s server \
     --cluster-reset \
     --cluster-reset-restore-path=<PATH-TO-SNAPSHOT>
   ```

   **结果**：日志中的一条消息表示 K3s 可以在没有标志的情况下重新启动。

2. 在 S2 和 S3 上，停止 K3s。然后删除数据目录 `/var/lib/rancher/k3s/server/db/`：

   ```bash
   systemctl stop k3s
   rm -rf /var/lib/rancher/k3s/server/db/
   ```

3. 在 S1 上，再次启动 K3s：

   ```bash
   systemctl start k3s
   ```

4. 在 S2 和 S3 上，再次启动 K3s 以加入恢复后的集群：

   ```bash
   systemctl start k3s
   ```

</TabItem>
</Tabs>

#### 选项

你可以通过命令行或者[配置文件](../installation/configuration.md#配置文件)（可能更容易使用）传入这些选项。

| 选项 | 描述 |
| ----------- | --------------- |
| `--etcd-disable-snapshots` | 禁用自动 etcd 快照 |
| `--etcd-snapshot-schedule-cron` value | cron 规范中的快照间隔时间。eg. 每 5 小时 `0 */5 * * *`（默认值：`0 */12 * * *`） |
| `--etcd-snapshot-retention` value | 要保留的快照数量（默认值：5） |
| `--etcd-snapshot-dir` value | 保存数据库快照的目录。（默认位置：`${data-dir}/db/snapshots`） |
| `--cluster-reset` | 忘记所有对等点，成为新集群的唯一成员。也可以使用环境变量 `[$K3S_CLUSTER_RESET]` 进行设置。 |
| `--cluster-reset-restore-path` value | 要恢复的快照文件路径 |

#### S3 兼容 API 支持

K3s 支持向具有 S3 兼容 API 的系统写入 etcd 快照和从系统中恢复 etcd 快照。S3 支持按需和计划快照。

以下参数已添加到 `server` 子命令中。`etcd-snapshot` 子命令也存在这些标志，但是删除了 `--etcd-s3` 部分以避免冗余。

| 选项 | 描述 |
| ----------- | --------------- |
| `--etcd-s3` | 启用备份到 S3 |
| `--etcd-s3-endpoint` | S3 端点网址 |
| `--etcd-s3-endpoint-ca` | S3 自定义 CA 证书，用于连接到 S3 端点 |
| `--etcd-s3-skip-ssl-verify` | 禁用 S3 SSL 证书验证 |
| `--etcd-s3-access-key` | S3 access key |
| `--etcd-s3-secret-key` | S3 secret key |
| `--etcd-s3-bucket` | S3 存储桶名称 |
| `--etcd-s3-region` | S3 区域/存储桶位置（可选）。默认为 us-east-1 |
| `--etcd-s3-folder` | S3 文件夹 |

执行按需的 etcd 快照并将其保存到 S3：

```bash
k3s etcd-snapshot \
  --s3 \
  --s3-bucket=<S3-BUCKET-NAME> \
  --s3-access-key=<S3-ACCESS-KEY> \
  --s3-secret-key=<S3-SECRET-KEY>
```

要从 S3 中执行按需的 etcd 快照还原，首先确保 K3s 没有运行。然后运行以下命令：

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

#### Etcd 快照和恢复子命令

K3s 支持用于处理 etcd 快照的一组子命令。

| 子命令 | 描述 |
| ----------- | --------------- |
| delete | 删除给定的快照 |
| ls, list, l | 列出快照 |
| prune | 删除超过配置的保留数量的快照 |
| save | 触发即时 etcd 快照 |

:::note
`save` 子命令与 `k3s etcd-snapshot` 相同。后者最终将被前者取代。
:::

无论 etcd 快照是存储在本地还是存储在 S3 兼容的对象存储中，这些命令都将按预期执行。

有关 etcd 快照子命令的更多信息，请运行 `k3s etcd-snapshot`。

从 S3 中删除快照。

```bash
k3s etcd-snapshot delete          \
  --s3                            \
  --s3-bucket=<S3-BUCKET-NAME>    \
  --s3-access-key=<S3-ACCESS-KEY> \
  --s3-secret-key=<S3-SECRET-KEY> \
  <SNAPSHOT-NAME>
```

使用默认保留策略 (5) 修剪本地快照。`prune` 子命令接受额外的标志 `--snapshot-retention`，允许覆盖默认保留策略。

```bash
k3s etcd-snapshot prune
```

```bash
k3s etcd-snapshot prune --snapshot-retention 10
```
