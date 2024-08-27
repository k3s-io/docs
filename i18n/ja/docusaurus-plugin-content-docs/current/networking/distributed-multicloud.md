---
title: "分散型ハイブリッドまたはマルチクラウドクラスター"
---

K3sクラスターは、共通のプライベートネットワークを共有せず、直接接続されていないノード（例：異なるパブリッククラウドにあるノード）にもデプロイできます。これを実現するためのオプションは2つあります：組み込みのk3sマルチクラウドソリューションと、`tailscale` VPNプロバイダーとの統合です。

:::warning
外部接続が必要なため、ノード間のレイテンシが増加します。これによりネットワークパフォーマンスが低下し、レイテンシが高すぎる場合はクラスターの健全性にも影響を与える可能性があります。
:::

:::warning
このタイプのデプロイメントでは、組み込みのetcdはサポートされていません。組み込みのetcdを使用する場合、すべてのサーバーノードはプライベートIPを介して相互に到達可能でなければなりません。エージェントは複数のネットワークに分散することができますが、すべてのサーバーは同じ場所にある必要があります。
:::

### 組み込みのk3sマルチクラウドソリューション

K3sはWireGuardを使用してクラスターのトラフィック用のVPNメッシュを確立します。ノードはそれぞれ一意のIP（通常はパブリックIP）を持ち、それを通じて到達可能である必要があります。K3sのスーパーバイザートラフィックはWebSocketトンネルを使用し、クラスター（CNI）トラフィックはWireGuardトンネルを使用します。

このタイプのデプロイメントを有効にするには、サーバーに次のパラメータを追加する必要があります：
```bash
--node-external-ip=<SERVER_EXTERNAL_IP> --flannel-backend=wireguard-native --flannel-external-ip
```
エージェントには次のパラメータを追加します：
```bash
--node-external-ip=<AGENT_EXTERNAL_IP>
```

ここで、`SERVER_EXTERNAL_IP`はサーバーノードに到達するためのIPであり、`AGENT_EXTERNAL_IP`はエージェントノードに到達するためのIPです。エージェントの`K3S_URL`設定パラメータは、接続するために`SERVER_EXTERNAL_IP`を使用する必要があることに注意してください。[ネットワーキング要件](../installation/requirements.md#networking)を確認し、内部および外部アドレスのリストされたポートへのアクセスを許可することを忘れないでください。

`SERVER_EXTERNAL_IP`と`AGENT_EXTERNAL_IP`は相互に接続可能であり、通常はパブリックIPです。

:::info 動的IP
ノードに動的IPが割り当てられており、IPが変更された場合（例：AWS）、`--node-external-ip`パラメータを新しいIPに反映するように変更する必要があります。K3sをサービスとして実行している場合、`/etc/systemd/system/k3s.service`を変更し、次のコマンドを実行します：

```bash
systemctl daemon-reload
systemctl restart k3s
```
:::

### Tailscale VPNプロバイダーとの統合（実験的）

v1.27.3、v1.26.6、v1.25.11以降で利用可能。

K3sは[Tailscale](https://tailscale.com/)と統合し、ノードがTailscale VPNサービスを使用してノード間のメッシュを構築できるようにします。

K3sをデプロイする前に、Tailscaleで次の4つのステップを実行する必要があります：

1. Tailscaleアカウントにログイン

2. `設定 > キー`で、認証キー（$AUTH-KEY）を生成します。このキーはクラスター内のすべてのノードで再利用可能です。

3. クラスターが使用するpodCIDRを決定します（デフォルトは`10.42.0.0/16`）。アクセスコントロールに次のスタンザを追加します：
```yaml
"autoApprovers": {
        "routes": {
            "10.42.0.0/16":        ["your_account@xyz.com"],
            "2001:cafe:42::/56": ["your_account@xyz.com"],
        },
    },
```

4. ノードにTailscaleをインストールします：
```bash
curl -fsSL https://tailscale.com/install.sh | sh
```

Tailscale統合を有効にしてK3sをデプロイするには、各ノードに次のパラメータを追加する必要があります：
```bash
--vpn-auth="name=tailscale,joinKey=$AUTH-KEY
```
または、情報をファイルに提供し、次のパラメータを使用します：
```bash
--vpn-auth-file=$PATH_TO_FILE
```

オプションとして、独自のTailscaleサーバー（例：headscale）を持っている場合、vpn-authパラメータに`controlServerURL=$URL`を追加して接続することができます。

:::warning

同じTailscaleネットワークを使用して複数のK3sクラスターを実行する予定がある場合、IPの競合を避けるために適切な[ACL](https://tailscale.com/kb/1018/acls/)を作成するか、各クラスターに異なるpodCIDRサブネットを使用してください。

:::
