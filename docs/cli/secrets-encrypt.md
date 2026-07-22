---
title: secrets-encrypt
---

# k3s secrets-encrypt

K3s supports enabling secrets encryption at rest. For more information, see [Secrets Encryption](../security/secrets-encryption.md).

## Secrets Encryption Tool

K3s contains a CLI tool `secrets-encrypt`, which enables automatic control over the following:

- Disabling/Enabling secrets encryption
- Adding new encryption keys
- Rotating and deleting encryption keys
- Reencrypting secrets

:::warning
Failure to follow proper procedure for rotating encryption keys can leave your cluster permanently corrupted. Proceed with caution.
:::

### Encryption Key Rotation

<Tabs groupId="se" queryString>
<TabItem value="Single-Server" default>
To rotate secrets encryption keys on a single-server cluster:

1. Start the K3s server with the flag `--secrets-encryption`

2. Rotate secrets encryption keys
    ```
    k3s secrets-encrypt rotate-keys
    ```

3. Wait for reencryption to finish. Watch the server logs, or wait for:
    ```bash
    $ k3s secrets-encrypt status
    Encryption Status: Enabled
    Current Rotation Stage: reencrypt_finished
    ```

</TabItem>
<TabItem value="High-Availability">

For brevity, the servers will be referred to as S1, S2, S3.

To rotate secrets encryption keys on HA setups:

1. Start up all three K3s servers with the `--secrets-encryption` flag. 

2. Rotate secrets encryption keys on S1

    ```bash
    k3s secrets-encrypt rotate-keys
    ```

3. Wait for reencryption to finish. Watch the server logs, or wait for:
    ```bash
    $ k3s secrets-encrypt status
    Encryption Status: Enabled
    Current Rotation Stage: reencrypt_finished
    ```
    :::info
    K3s will reencrypt ~5 secrets per second. Clusters with large # of secrets can take several minutes to reencrypt. You can track progress in the server logs.
    ::: 

4. Restart K3s on S1 with same arguments. If running K3s as a service:
    ```bash
    # If using systemd
    systemctl restart k3s
    # If using openrc
    rc-service k3s restart
    ```

5. Once S1 is up, restart K3s on S2 and S3


</TabItem>
</Tabs>

### Enable Secrets Encryption on an Existing Cluster

:::info Version Gate
Available as of the March 2026 releases: v1.33.10+k3s1, v1.34.6+k3s1, v1.35.3+k3s1
:::

Use this procedure when the cluster was started without `--secrets-encryption` and you want to enable secrets encryption at a later time.

<Tabs groupId="se" queryString>
<TabItem value="Single-Server" default>

1. Verify encryption is currently disabled

    ```bash
    $ k3s secrets-encrypt status 
    Encryption Status: Disabled, no configuration file found
    ```

2. Enable secrets encryption on the server

    ```bash
    k3s secrets-encrypt enable
    ```

3. Modify the server args/config and add `--secrets-encryption`. Restart the server.

4. Verify the status shows encryption disabled but at the `start` stage

    ```bash
    $ k3s secrets-encrypt status
    Encryption Status: Disabled
    Current Rotation Stage: start
    Server Encryption Hashes: All hashes match
    ```

5. Rotate keys to enable encryption for new secrets

    ```bash
    k3s secrets-encrypt rotate-keys
    ```

6. Restart the server with the same arguments

7. Verify encryption is enabled

    ```bash
    $ k3s secrets-encrypt status
    Encryption Status: Enabled
    Current Rotation Stage: reencrypt_finished
    Server Encryption Hashes: All hashes match
    ```

</TabItem>
<TabItem value="High-Availability">

For brevity, the servers will be referred to as S1, S2, S3.

1. Verify encryption is currently disabled

    ```bash
    k3s secrets-encrypt status
    Encryption Status: Disabled, no configuration file found
    ```

2. Enable secrets encryption on S1

    ```bash
    k3s secrets-encrypt enable
    ```

3. Restart all servers with `--secrets-encryption`

4. Verify the status shows encryption disabled but at the `start` stage, and that all server hashes match

    ```bash
    k3s secrets-encrypt status
    Encryption Status: Disabled
    Current Rotation Stage: start
    Server Encryption Hashes: All hashes match
    ```

5. Rotate keys on S1 to enable encryption for new secrets

    ```bash
    k3s secrets-encrypt rotate-keys
    ```

6. Restart all servers with the same arguments

7. Verify encryption is enabled

    ```bash
    k3s secrets-encrypt status
    Encryption Status: Enabled
    Current Rotation Stage: reencrypt_finished
    Server Encryption Hashes: All hashes match
    ```

</TabItem>
</Tabs>

### Legacy Encryption Key Rotation

:::tip New Procedure
If using K3s versions v1.30+, we recommend using the [Encryption Key Rotation](#encryption-key-rotation) instead.
:::

<Tabs groupId="se" queryString>
<TabItem value="Single-Server" default>

To rotate secrets encryption keys on a single-server cluster:

1. Start the K3s server with the flag `--secrets-encryption`

2. Prepare

    ```bash
    k3s secrets-encrypt prepare
    ```

3. Kill and restart the K3s server with same arguments. If running K3s as a service:
    ```bash
    # If using systemd
    systemctl restart k3s
    # If using openrc
    rc-service k3s restart
    ```

4. Rotate

    ```bash
    k3s secrets-encrypt rotate
    ```

5. Kill and restart the K3s server with same arguments
6. Reencrypt
    :::info
    K3s will reencrypt ~5 secrets per second.  
    Clusters with large # of secrets can take several minutes to reencrypt.
    ::: 
    ```bash
    k3s secrets-encrypt reencrypt
    ``` 


</TabItem>
<TabItem value="High-Availability">

The steps are the same for both embedded DB and external DB clusters. or brevity, the servers will be referred to as S1, S2, S3.

To rotate secrets encryption keys on HA setups:

1. Start up all three K3s servers with the `--secrets-encryption` flag. F
    :::note Notes
    - While not required, it is recommended that you pick one server node from which to run the `secrets-encrypt` commands.
    :::

2. Prepare on S1

    ```bash
    k3s secrets-encrypt prepare
    ```

3. Kill and restart S1 with same arguments. If running K3s as a service:
    ```bash
    # If using systemd
    systemctl restart k3s
    # If using openrc
    rc-service k3s restart
    ```

4. Once S1 is up, kill and restart the S2 and S3

5. Rotate on S1

    ```bash
    k3s secrets-encrypt rotate
    ```

6. Kill and restart S1 with same arguments
7. Once S1 is up, kill and restart the S2 and S3

8. Reencrypt on S1
    :::info
    K3s will reencrypt ~5 secrets per second.  
    Clusters with large # of secrets can take several minutes to reencrypt.
    :::
    ```bash
    k3s secrets-encrypt reencrypt
    ```

9. Kill and restart S1 with same arguments
10. Once S1 is up, kill and restart the S2 and S3

</TabItem>
</Tabs>

### Secrets Encryption Disable/Re-enable
<Tabs groupId="se" queryString>
<TabItem value="Single-Server" default>

To disable secrets encryption on a single-node cluster:

1. Disable

    ```bash
    k3s secrets-encrypt disable
    ```

2. Kill and restart the K3s server with same arguments. If running K3s as a service:
    ```bash
    # If using systemd
    systemctl restart k3s
    # If using openrc
    rc-service k3s restart
    ```

3. Reencrypt with flags

    ```bash
    k3s secrets-encrypt reencrypt --force --skip
    ```

To re-enable secrets encryption on a single node cluster:

1. Enable

    ```bash
    k3s secrets-encrypt enable
    ```

2. Kill and restart the K3s server with same arguments

3. Reencrypt with flags

    ```bash
    k3s secrets-encrypt reencrypt --force --skip
    ```

</TabItem>
<TabItem value="High-Availability">

:::note
While not required, it is recommended that you pick one server node from which to run the `secrets-encrypt` commands.
:::

For brevity, the servers will be referred to as S1, S2, S3.

To disable secrets encryption on a HA cluster:

1. Disable on S1

    ```bash
    k3s secrets-encrypt disable
    ```

2. Kill and restart S1 with same arguments. If running K3s as a service:
    ```bash
    # If using systemd
    systemctl restart k3s
    # If using openrc
    rc-service k3s restart
    ```

3. Once S1 is up, kill and restart the S2 and S3


4. Reencrypt with flags on S1

    ```bash
    k3s secrets-encrypt reencrypt --force --skip
    ```

To re-enable secrets encryption on a HA cluster:

1. Enable on S1

    ```bash
    k3s secrets-encrypt enable
    ```

2. Kill and restart S1 with same arguments
3. Once S1 is up, kill and restart the S2 and S3

4. Reencrypt with flags on S1

    ```bash
    k3s secrets-encrypt reencrypt --force --skip
    ```

</TabItem>
</Tabs>

### Secrets Encryption Status
The secrets-encrypt tool includes a `status` command that displays information about the current status of secrets encryption on the node.

An example of the command on a single-server node:  
```bash
$ k3s secrets-encrypt status
Encryption Status: Enabled
Current Rotation Stage: start
Server Encryption Hashes: All hashes match

Active  Key Type  Name
------  --------  ----
 *      AES-CBC   aescbckey

```

Another example on HA cluster, after rotating the keys, but before restarting the servers:  
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

Details on each section are as follows:  

- __Encryption Status__: Displayed whether secrets encryption is disabled or enabled on the node  
- __Current Rotation Stage__: Indicates the current rotation stage on the node.  
  Stages are: `start`, `prepare`, `rotate`, `reencrypt_request`, `reencrypt_active`, `reencrypt_finished`  
- __Server Encryption Hashes__: Useful for HA clusters, this indicates whether all servers are on the same stage with their local files. This can be used to identify whether a restart of servers is required before proceeding to the next stage. In the HA example above, node-1 and node-2 have different hashes, indicating that they currently do not have the same encryption configuration. Restarting the servers will sync up their configuration.
- __Key Table__: Summarizes information about the secrets encryption keys found on the node.  
  * __Active__: The "*" indicates which, if any, of the keys are currently used for secrets encryption. An active key is used by Kubernetes to encrypt any new secrets.
  * __Key Type__: Keys using this tool support `AES-CBC` and `secretbox` types. See more info [here.](https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/#providers)
  * __Name__: Name of the encryption key.  
