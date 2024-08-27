---
title: K3sの停止
---


アップグレード中の高可用性を確保するために、K3sサービスが停止してもK3sコンテナは引き続き実行されます。


## K3sサービス

K3sの停止と再起動は、systemdおよびOpenRCのインストールスクリプトによってサポートされています。

<Tabs>
<TabItem value="systemd">

サーバーを停止するには:
```sh
sudo systemctl stop k3s
```

サーバーを再起動するには:
```sh
sudo systemctl start k3s
```

エージェントを停止するには:
```sh
sudo systemctl stop k3s-agent
```

エージェントを再起動するには:
```sh
sudo systemctl start k3s-agent
```

</TabItem>
<TabItem value="OpenRC">

サーバーを停止するには:
```sh
sudo rc-service k3s stop
```

サーバーを再起動するには:
```sh
sudo rc-service k3s restart
```

エージェントを停止するには:
```sh
sudo rc-service k3s-agent stop
```

エージェントを再起動するには:
```sh
sudo rc-service k3s-agent restart
```

</TabItem>
</Tabs>


## Killallスクリプト

すべてのK3sコンテナを停止し、containerdの状態をリセットするには、`k3s-killall.sh`スクリプトを使用できます。

killallスクリプトは、コンテナ、K3sディレクトリ、およびネットワーキングコンポーネントをクリーンアップし、関連するすべてのルールを持つiptablesチェーンを削除します。クラスターのデータは削除されません。

サーバーノードからkillallスクリプトを実行するには、次のコマンドを実行します:

```bash
/usr/local/bin/k3s-killall.sh
```