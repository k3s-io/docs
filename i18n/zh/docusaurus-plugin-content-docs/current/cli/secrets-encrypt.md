---
title: secrets-encrypt
---

# k3s secrets-encrypt

K3s 支持启用静态加密。有关详细信息，请参阅 [Secret 加密](../security/secrets-encryption.md)。

## Secret 加密工具

:::info 版本
从 [v1.21.8+k3s1](https://github.com/k3s-io/k3s/releases/tag/v1.21.8%2Bk3s1) 起可用
:::

K3s 包含一个 CLI 工具 `secrets-encrypt`，可以自动控制以下内容：

- 禁用/启用 Secret 加密
- 添加新的加密密钥
- 轮换和删除加密密钥
- 重新加密 Secret

:::warning
如果不遵循正确的加密密钥轮换程序，你的集群可能会永久损坏。因此，请谨慎操作。
:::

### 加密密钥轮换

<Tabs>
<TabItem value="单服务器" default>

要在单服务器集群上轮换 Secret 加密密钥：

- 使用标志 `--secrets-encryption` 启动 K3s Server

:::note
目前*不*支持在没有加密的情况下启动 K3s 并在后续启用它。
:::

1. 准备

   ```bash
   k3s secrets-encrypt prepare
   ```

2. 使用相同的参数终止并重启 K3s Server。如果将 K3s 作为服务运行：
   ```bash
   # 如果使用 systemd
   systemctl restart k3s
   # 如果使用 openrc
   rc-service k3s restart
   ```

3. 轮换

   ```bash
   k3s secrets-encrypt rotate
   ```

4. 使用相同的参数终止并重启 K3s Server。
5. 重新加密
   :::info
   K3s 每秒将重新加密约 5 个 Secret。  
   具有大量 Secret 的集群可能需要几分钟才能重新加密。
   :::
   ```bash
   k3s secrets-encrypt reencrypt
   ```


</TabItem>
<TabItem value="高可用" default>

嵌入式数据库和外部数据库集群的步骤相同。

要在 HA 设置上轮换 Secret 加密密钥：

:::note 注意事项

- 目前*不*支持在没有加密的情况下启动 K3s 并在后续启用它。
- 虽然不是必需的，但建议你选择一个 Server 节点来运行 `secrets-encrypt` 命令。

:::

1. 使用 `--secrets-encryption` 标志启动所有三个 K3s Server。为简便起见，我们将 server 分别称为 S1、S2、S3。

2. 准备 S1

   ```bash
   k3s secrets-encrypt prepare
   ```

3. 使用相同的参数终止并重启 S1。如果将 K3s 作为服务运行：
   ```bash
   # 如果使用 systemd
   systemctl restart k3s
   # 如果使用 openrc
   rc-service k3s restart
   ```

4. S1 启动后，终止并重启 S2 和 S3

5. 轮换 S1

   ```bash
   k3s secrets-encrypt rotate
   ```

6. 使用相同的参数终止并重启 S1。
7. S1 启动后，终止并重启 S2 和 S3

8. 在 S1 上重新加密
   :::info
   K3s 每秒将重新加密约 5 个 Secret。  
   具有大量 Secret 的集群可能需要几分钟才能重新加密。
   :::
   ```bash
   k3s secrets-encrypt reencrypt
   ```

9. 使用相同的参数终止并重启 S1。
10. S1 启动后，终止并重启 S2 和 S3

</TabItem>
</Tabs>

### 禁用/启用 Secret 加密
<Tabs>
<TabItem value="单服务器" default>

使用 `--secrets-encryption` 标志启动 server 后，你还可以禁用 Secret 加密。

要在单节点集群上禁用 Secret 加密：

1. 禁用

   ```bash
   k3s secrets-encrypt disable
   ```

2. 使用相同的参数终止并重启 K3s Server。如果将 K3s 作为服务运行：
   ```bash
   # 如果使用 systemd
   systemctl restart k3s
   # 如果使用 openrc
   rc-service k3s restart
   ```

3. 使用标志重新加密

   ```bash
   k3s secrets-encrypt reencrypt --force --skip
   ```

要在单节点集群上重新启用 Secret 加密：

1. 启用

   ```bash
   k3s secrets-encrypt enable
   ```

2. 使用相同的参数终止并重启 K3s Server。

3. 使用标志重新加密

   ```bash
   k3s secrets-encrypt reencrypt --force --skip
   ```

</TabItem>
<TabItem value="高可用" default>

使用 `--secrets-encryption` 标志启动 HA 集群后，你还可以禁用 Secret 加密。

:::note
虽然不是必需的，但建议你选择一个 Server 节点来运行 `secrets-encrypt` 命令。
:::

为简便起见，我们将本指南中使用的 3 个 server 分别称为 S1、S2、S3。

要在 HA 集群上禁用 Secret 加密：

1. 在 S1 上禁用

   ```bash
   k3s secrets-encrypt disable
   ```

2. 使用相同的参数终止并重启 S1。如果将 K3s 作为服务运行：
   ```bash
   # 如果使用 systemd
   systemctl restart k3s
   # 如果使用 openrc
   rc-service k3s restart
   ```

3. S1 启动后，终止并重启 S2 和 S3


4. 在 S1 上使用标志重新加密

   ```bash
   k3s secrets-encrypt reencrypt --force --skip
   ```

要在 HA 集群上重新启用 Secret 加密：

1. 在 S1 上启用

   ```bash
   k3s secrets-encrypt enable
   ```

2. 使用相同的参数终止并重启 S1。
3. S1 启动后，终止并重启 S2 和 S3

4. 在 S1 上使用标志重新加密

   ```bash
   k3s secrets-encrypt reencrypt --force --skip
   ```

</TabItem>
</Tabs>

### Secret 加密状态
secrets-encrypt 工具包含一个 `status` 命令，该命令能显示节点上 Secret 加密的当前状态信息。

单 Server 节点上的命令示例：
```bash
$ k3s secrets-encrypt status
Encryption Status: Enabled
Current Rotation Stage: start
Server Encryption Hashes: All hashes match

Active  Key Type  Name
------  --------  ----
 *      AES-CBC   aescbckey

```

以下是另一个关于 HA 集群的例子，在轮换密钥后，重启 server 之前：
```bash
$ k3s secrets-encrypt status
Encryption Status: Enabled
Current Rotation Stage: rotate
Server Encryption Hashes: hash does not match between node-1 and node-2

Active  Key Type  Name
------  --------  ----
 *      AES-CBC   aescbckey-2021-12-10T22:54:38Z
        AES-CBC   aescbckey

```

各部分详情如下：

- __Encryption Status__：显示节点上的 Secret 加密是禁用还是启用的
- __Current Rotation Stage__：表示节点上当前的轮换阶段  
   Stage 可能是：`start`，`prepare`，`rotate`，`reencrypt_request`，`reencrypt_active`，`reencrypt_finished`
- __Server Encryption Hashes__：对 HA 集群有用，表明所有 server 是否与本地文件处于同一阶段。这可用于确定在进入下一阶段之前是否需要重启 server。在上面的 HA 例子中，node-1 和 node-2 的哈希值不同，说明它们目前没有相同的加密配置。重启 server 将同步它们的配置。
- __Key Table__：汇总在节点上找到的 Secret 加密密钥的信息。
   * __Active__：“*”表示当前使用了哪些密钥（如果有的话）进行Secret 加密。Kubernetes 使用 active 密钥来加密新的 Secret。
   * __Key Type__：使用此工具的所有密钥都是 `AES-CBC` 类型。详情请参见[此处](https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/#providers)。
   * __Name__：加密密钥的名称。
