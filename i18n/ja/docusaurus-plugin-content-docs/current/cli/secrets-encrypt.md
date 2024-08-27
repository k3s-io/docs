---
title: secrets-encrypt
---

# k3s secrets-encrypt

K3sは、保存時のシークレット暗号化を有効にすることをサポートしています。詳細については、[Secrets Encryption](../security/secrets-encryption.md)を参照してください。

## シークレット暗号化ツール

:::info バージョンゲート
[v1.21.8+k3s1](https://github.com/k3s-io/k3s/releases/tag/v1.21.8%2Bk3s1)から利用可能
:::

K3sには、以下の自動制御を可能にするCLIツール`secrets-encrypt`が含まれています：

- シークレット暗号化の無効化/有効化
- 新しい暗号化キーの追加
- 暗号化キーのローテーションと削除
- シークレットの再暗号化

:::warning
暗号化キーのローテーションの適切な手順に従わないと、クラスターが永久に破損する可能性があります。慎重に進めてください。
:::

### 新しい暗号化キーのローテーション（実験的）

:::info バージョンゲート
[v1.28.1+k3s1](https://github.com/k3s-io/k3s/releases/tag/v1.28.1%2Bk3s1)から利用可能。この新しいバージョンのツールは、現在ベータ版のK8s [自動設定リロード](https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/#configure-automatic-reloading)を利用しています。GAはv1.29.0で予定されています。

古いリリースについては、[Encryption Key Rotation Classic](#encryption-key-rotation-classic)を参照してください。
:::

<Tabs groupId="se">
<TabItem value="Single-Server" default>
シングルサーバークラスターでシークレット暗号化キーをローテーションするには：

1. フラグ`--secrets-encryption`を使用してK3sサーバーを起動します。

    :::note 
    暗号化なしでK3sを起動し、後で有効にすることは現在サポートされていません。
    :::

2. シークレット暗号化キーをローテーションします。
    ```
    k3s secrets-encrypt rotate-keys
    ```

3. 再暗号化が完了するのを待ちます。サーバーログを監視するか、以下を待ちます：
    ```bash
    $ k3s secrets-encrypt status
    Encryption Status: Enabled
    Current Rotation Stage: reencrypt_finished
    ```

</TabItem>
<TabItem value="High-Availability">

HAセットアップでシークレット暗号化キーをローテーションするには：

1. すべてのK3sサーバーを`--secrets-encryption`フラグで起動します。簡略化のため、サーバーをS1、S2、S3と呼びます。

    :::note
    暗号化なしでK3sを起動し、後で有効にすることは現在サポートされていません。
    :::

2. S1でシークレット暗号化キーをローテーションします。

    ```bash
    k3s secrets-encrypt rotate-keys
    ```

3. 再暗号化が完了するのを待ちます。サーバーログを監視するか、以下を待ちます：
    ```bash
    $ k3s secrets-encrypt status
    Encryption Status: Enabled
    Current Rotation Stage: reencrypt_finished
    ```
    :::info
    K3sは1秒あたり約5つのシークレットを再暗号化します。シークレットの数が多いクラスターでは、再暗号化に数分かかることがあります。サーバーログで進行状況を確認できます。
    ::: 

4. 同じ引数でS1のK3sを再起動します。K3sをサービスとして実行している場合：
    ```bash
    # systemdを使用している場合
    systemctl restart k3s
    # openrcを使用している場合
    rc-service k3s restart
    ```

5. S1が起動したら、S2とS3のK3sを再起動します。

</TabItem>
</Tabs>

### 暗号化キーのローテーションクラシック

<Tabs groupId="se">
<TabItem value="Single-Server" default>

シングルサーバークラスターでシークレット暗号化キーをローテーションするには：

1. フラグ`--secrets-encryption`を使用してK3sサーバーを起動します。

    :::note 
    暗号化なしでK3sを起動し、後で有効にすることは現在サポートされていません。
    :::

2. 準備します。

    ```bash
    k3s secrets-encrypt prepare
    ```

3. 同じ引数でK3sサーバーを再起動します。K3sをサービスとして実行している場合：
    ```bash
    # systemdを使用している場合
    systemctl restart k3s
    # openrcを使用している場合
    rc-service k3s restart
    ```

4. ローテーションします。

    ```bash
    k3s secrets-encrypt rotate
    ```

5. 同じ引数でK3sサーバーを再起動します。
6. 再暗号化します。
    :::info
    K3sは1秒あたり約5つのシークレットを再暗号化します。  
    シークレットの数が多いクラスターでは、再暗号化に数分かかることがあります。
    ::: 
    ```bash
    k3s secrets-encrypt reencrypt
    ``` 

</TabItem>
<TabItem value="High-Availability">

埋め込みDBと外部DBクラスターの両方で手順は同じです。

HAセットアップでシークレット暗号化キーをローテーションするには：

1. すべてのK3sサーバーを`--secrets-encryption`フラグで起動します。簡略化のため、サーバーをS1、S2、S3と呼びます。
    :::note Notes
    - 暗号化なしでK3sを起動し、後で有効にすることは現在サポートされていません。
    - 必須ではありませんが、`secrets-encrypt`コマンドを実行するサーバーノードを1つ選ぶことをお勧めします。
    :::

2. S1で準備します。

    ```bash
    k3s secrets-encrypt prepare
    ```

3. 同じ引数でS1を再起動します。K3sをサービスとして実行している場合：
    ```bash
    # systemdを使用している場合
    systemctl restart k3s
    # openrcを使用している場合
    rc-service k3s restart
    ```

4. S1が起動したら、S2とS3を再起動します。

5. S1でローテーションします。

    ```bash
    k3s secrets-encrypt rotate
    ```

6. 同じ引数でS1を再起動します。
7. S1が起動したら、S2とS3を再起動します。

8. S1で再暗号化します。
    :::info
    K3sは1秒あたり約5つのシークレットを再暗号化します。  
    シークレットの数が多いクラスターでは、再暗号化に数分かかることがあります。
    :::
    ```bash
    k3s secrets-encrypt reencrypt
    ```

9. 同じ引数でS1を再起動します。
10. S1が起動したら、S2とS3を再起動します。

</TabItem>
</Tabs>

### シークレット暗号化の無効化/再有効化
<Tabs groupId="se">
<TabItem value="Single-Server" default>

`--secrets-encryption`フラグを使用してサーバーを起動した後、シークレット暗号化を無効にすることができます。

シングルノードクラスターでシークレット暗号化を無効にするには：

1. 無効化します。

    ```bash
    k3s secrets-encrypt disable
    ```

2. 同じ引数でK3sサーバーを再起動します。K3sをサービスとして実行している場合：
    ```bash
    # systemdを使用している場合
    systemctl restart k3s
    # openrcを使用している場合
    rc-service k3s restart
    ```

3. フラグを使用して再暗号化します。

    ```bash
    k3s secrets-encrypt reencrypt --force --skip
    ```

シングルノードクラスターでシークレット暗号化を再有効化するには：

1. 有効化します。

    ```bash
    k3s secrets-encrypt enable
    ```

2. 同じ引数でK3sサーバーを再起動します。

3. フラグを使用して再暗号化します。

    ```bash
    k3s secrets-encrypt reencrypt --force --skip
    ```

</TabItem>
<TabItem value="High-Availability">

`--secrets-encryption`フラグを使用してHAクラスターを起動した後、シークレット暗号化を無効にすることができます。

:::note
必須ではありませんが、`secrets-encrypt`コマンドを実行するサーバーノードを1つ選ぶことをお勧めします。
:::

簡略化のため、このガイドで使用する3つのサーバーをS1、S2、S3と呼びます。

HAクラスターでシークレット暗号化を無効にするには：

1. S1で無効化します。

    ```bash
    k3s secrets-encrypt disable
    ```

2. 同じ引数でS1を再起動します。K3sをサービスとして実行している場合：
    ```bash
    # systemdを使用している場合
    systemctl restart k3s
    # openrcを使用している場合
    rc-service k3s restart
    ```

3. S1が起動したら、S2とS3を再起動します。

4. S1でフラグを使用して再暗号化します。

    ```bash
    k3s secrets-encrypt reencrypt --force --skip
    ```

HAクラスターでシークレット暗号化を再有効化するには：

1. S1で有効化します。

    ```bash
    k3s secrets-encrypt enable
    ```

2. 同じ引数でS1を再起動します。
3. S1が起動したら、S2とS3を再起動します。

4. S1でフラグを使用して再暗号化します。

    ```bash
    k3s secrets-encrypt reencrypt --force --skip
    ```

</TabItem>
</Tabs>

### シークレット暗号化のステータス
secrets-encryptツールには、ノード上のシークレット暗号化の現在のステータスに関する情報を表示する`status`コマンドが含まれています。

シングルサーバーノードでのコマンドの例：  
```bash
$ k3s secrets-encrypt status
Encryption Status: Enabled
Current Rotation Stage: start
Server Encryption Hashes: All hashes match

Active  Key Type  Name
------  --------  ----
 *      AES-CBC   aescbckey

```

HAクラスターでの別の例、キーをローテーションした後、サーバーを再起動する前：  
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

各セクションの詳細は以下の通りです：  

- __Encryption Status__: ノード上でシークレット暗号化が無効か有効かを表示します。  
- __Current Rotation Stage__: ノード上の現在のローテーションステージを示します。  
  ステージは：`start`、`prepare`、`rotate`、`reencrypt_request`、`reencrypt_active`、`reencrypt_finished`です。  
- __Server Encryption Hashes__: HAクラスターに役立ちます。これは、すべてのサーバーがローカルファイルと同じステージにあるかどうかを示します。次のステージに進む前にサーバーの再起動が必要かどうかを確認するために使用できます。上記のHAの例では、node-1とnode-2のハッシュが異なり、現在同じ暗号化設定を持っていないことを示しています。サーバーを再起動すると、設定が同期されます。
- __Key Table__: ノード上で見つかったシークレット暗号化キーに関する情報を要約します。  
  * __Active__: "*"は、現在シークレット暗号化に使用されているキーを示します。アクティブなキーは、Kubernetesが新しいシークレットを暗号化するために使用します。
  * __Key Type__: このツールを使用するすべてのキーは`AES-CBC`タイプです。詳細は[こちら](https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/#providers)を参照してください。
  * __Name__: 暗号化キーの名前。  
