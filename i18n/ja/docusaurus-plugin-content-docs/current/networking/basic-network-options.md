---
title: "基本的なネットワークオプション"
---

このページでは、Flannelの設定や置き換え、IPv6やデュアルスタックの設定を含むK3sのネットワーク設定オプションについて説明します。

## Flannelオプション

[Flannel](https://github.com/flannel-io/flannel/blob/master/README.md)は、Kubernetesコンテナネットワークインターフェース（CNI）を実装するレイヤー3ネットワークファブリックの軽量プロバイダーです。一般的にCNIプラグインと呼ばれます。

* Flannelオプションはサーバーノードでのみ設定でき、クラスター内のすべてのサーバーで同一である必要があります。
* Flannelのデフォルトバックエンドは`vxlan`です。暗号化を有効にするには、`wireguard-native`バックエンドを使用します。
* 最近のバージョンのUbuntuを使用しているRaspberry Piで`vxlan`を使用するには、[追加の準備](../installation/requirements.md?os=pi#operating-systems)が必要です。
* Flannelバックエンドとして`wireguard-native`を使用する場合、一部のLinuxディストリビューションでは追加のモジュールが必要になることがあります。詳細については[WireGuardインストールガイド](https://www.wireguard.com/install/)を参照してください。WireGuardのインストール手順に従うことで、適切なカーネルモジュールがインストールされます。WireGuard Flannelバックエンドを使用する前に、すべてのノード（サーバーとエージェント）でWireGuardカーネルモジュールが利用可能であることを確認する必要があります。

| CLIフラグと値 | 説明 |
|--------------------|-------------|
| `--flannel-ipv6-masq` | IPv6トラフィックにマスカレードルールを適用します（IPv4のデフォルト）。デュアルスタックまたはIPv6のみのクラスターにのみ適用されます。`none`以外のFlannelバックエンドと互換性があります。 |
| `--flannel-external-ip` | Flannelトラフィックの宛先として内部IPではなくノードの外部IPアドレスを使用します。ノードで--node-external-ipが設定されている場合にのみ適用されます。 |
| `--flannel-backend=vxlan` | パケットをカプセル化するためにVXLANを使用します。Raspberry Piでは追加のカーネルモジュールが必要になる場合があります。 |
| `--flannel-backend=host-gw` | ノードIPを介してポッドサブネットへのIPルートを使用します。クラスター内のすべてのノード間で直接レイヤー2接続が必要です。 |
| `--flannel-backend=wireguard-native` | ネットワークトラフィックをカプセル化および暗号化するためにWireGuardを使用します。追加のカーネルモジュールが必要になる場合があります。 |
| `--flannel-backend=ipsec` | `swanctl`バイナリを介してstrongSwan IPSecを使用してネットワークトラフィックを暗号化します。（非推奨; v1.27.0で削除予定） |
| `--flannel-backend=none` | Flannelを完全に無効にします。 |

:::info バージョンゲート

K3sは2022-12リリース（v1.26.0+k3s1、v1.25.5+k3s1、v1.24.9+k3s1、v1.23.15+k3s1）以降、strongSwanの`swanctl`および`charon`バイナリを含まなくなりました。これらのリリースにアップグレードまたはインストールする前に、ノードに正しいパッケージをインストールしてください。`ipsec`バックエンドを使用する場合は特に注意が必要です。

:::

### `wireguard`または`ipsec`から`wireguard-native`への移行

従来の`wireguard`バックエンドはホストに`wg`ツールのインストールが必要です。このバックエンドはK3s v1.26以降では利用できず、カーネルと直接インターフェースする`wireguard-native`バックエンドが推奨されます。

従来の`ipsec`バックエンドはホストに`swanctl`および`charon`バイナリのインストールが必要です。このバックエンドはK3s v1.27以降では利用できず、`wireguard-native`バックエンドが推奨されます。

ユーザーはできるだけ早く新しいバックエンドに移行することをお勧めします。移行には、ノードが新しい設定で起動する間の短期間のダウンタイムが必要です。以下の2つのステップに従ってください：

1. すべてのサーバーノードでK3s設定を更新します。設定ファイルを使用している場合、`/etc/rancher/k3s/config.yaml`に`flannel-backend: wireguard-native`を含め、`flannel-backend: wireguard`または`flannel-backend: ipsec`を置き換えます。systemdユニットでCLIフラグを使用してK3sを設定している場合は、同等のフラグを変更します。
2. サーバーから始めて、すべてのノードを再起動します。

## カスタムCNI

`--flannel-backend=none`でK3sを起動し、任意のCNIをインストールします。ほとんどのCNIプラグインには独自のネットワークポリシーエンジンが付属しているため、競合を避けるために`--disable-network-policy`も設定することをお勧めします。考慮すべき重要な情報は次のとおりです：

<Tabs>
<TabItem value="Canal" default>

[Canal Docs](https://docs.tigera.io/calico/latest/getting-started/kubernetes/flannel/install-for-flannel#installing-calico-for-policy-and-flannel-aka-canal-for-networking)ウェブサイトを訪問し、Canalをインストールする手順に従います。Canal YAMLを修正して、`container_settings`セクションでIP転送が許可されるようにします。例えば：

```yaml
"container_settings": {
  "allow_ip_forwarding": true
}
```

Canal YAMLを適用します。

ホストで次のコマンドを実行して設定が適用されたことを確認します：

```bash
cat /etc/cni/net.d/10-canal.conflist
```

IP転送がtrueに設定されていることを確認します。

</TabItem>
<TabItem value="Calico" default>

[Calico CNIプラグインガイド](https://docs.tigera.io/calico/latest/reference/configure-cni-plugins)に従います。Calico YAMLを修正して、`container_settings`セクションでIP転送が許可されるようにします。例えば：

```yaml
"container_settings": {
  "allow_ip_forwarding": true
}
```

Calico YAMLを適用します。

ホストで次のコマンドを実行して設定が適用されたことを確認します：

```bash
cat /etc/cni/net.d/10-calico.conflist
```

IP転送がtrueに設定されていることを確認します。

</TabItem>
<TabItem value="Cilium" default>

`k3s-killall.sh`または`k3s-uninstall.sh`を実行する前に、`cilium_host`、`cilium_net`、および`cilium_vxlan`インターフェースを手動で削除する必要があります。これを行わないと、K3sが停止したときにホストへのネットワーク接続が失われる可能性があります。

```bash
ip link delete cilium_host
ip link delete cilium_net
ip link delete cilium_vxlan
```

さらに、ciliumのiptablesルールを削除する必要があります：

```bash
iptables-save | grep -iv cilium | iptables-restore
ip6tables-save | grep -iv cilium | ip6tables-restore
```

</TabItem>
</Tabs>

## コントロールプレーンのEgress Selector設定

K3sエージェントとサーバーは、コントロールプレーン（apiserver）とエージェント（kubeletおよびcontainerd）コンポーネント間の双方向通信をカプセル化するために使用されるノード間のWebSocketトンネルを維持します。これにより、エージェントがkubeletおよびコンテナランタイムのストリーミングポートを外部接続に公開せずに動作でき、エージェントが無効になっている場合でもコントロールプレーンがクラスターサービスに接続できるようになります。この機能は、他のKubernetesディストリビューションで一般的に使用される[Konnectivity](https://kubernetes.io/docs/tasks/extend-kubernetes/setup-konnectivity/)サービスと同等であり、apiserverのEgress Selector設定を介して管理されます。

デフォルトモードは`agent`です。[エージェントレスサーバー](../advanced.md#running-agentless-servers-experimental)を実行する場合、`pod`または`cluster`モードが推奨されます。これにより、flannelおよびkube-proxyがない場合でもapiserverがクラスターサービスエンドポイントにアクセスできるようになります。

Egress Selectorモードは、`--egress-selector-mode`フラグを介してサーバーで設定でき、次の4つのモードを提供します：
* `disabled`: apiserverはkubeletやクラスターエンドポイントと通信するためにエージェントトンネルを使用しません。このモードでは、サーバーがkubelet、CNI、およびkube-proxyを実行し、エージェントに直接接続できる必要があります。そうでない場合、apiserverはサービスエンドポイントにアクセスできず、`kubectl exec`および`kubectl logs`を実行できません。
* `agent`（デフォルト）: apiserverはkubeletと通信するためにエージェントトンネルを使用します。このモードでは、サーバーもkubelet、CNI、およびkube-proxyを実行する必要があります。そうでない場合、apiserverはサービスエンドポイントにアクセスできません。
* `pod`: apiserverはkubeletおよびサービスエンドポイントと通信するためにエージェントトンネルを使用し、ノードおよびエンドポイントを監視してエンドポイント接続を正しいエージェントにルーティングします。  
  **注意**: このモードは、独自のIPAMを使用し、ノードのPodCIDR割り当てを尊重しないCNIを使用している場合には機能しません。これらのCNIを使用する場合は、`cluster`または`agent`モードを使用する必要があります。
* `cluster`: apiserverはkubeletおよびサービスエンドポイントと通信するためにエージェントトンネルを使用し、ポッドおよびエンドポイントを監視してエンドポイント接続を正しいエージェントにルーティングします。このモードは、異なるクラスター構成間での移植性が最も高いですが、オーバーヘッドが増加します。

## デュアルスタック（IPv4 + IPv6）ネットワーキング

:::info バージョンゲート

[v1.21.0+k3s1](https://github.com/k3s-io/k3s/releases/tag/v1.21.0%2Bk3s1)から実験的サポートが利用可能です。  
[v1.23.7+k3s1](https://github.com/k3s-io/k3s/releases/tag/v1.23.7%2Bk3s1)から安定したサポートが利用可能です。

:::

:::warning 既知の問題

1.27以前では、Kubernetesの[Issue #111695](https://github.com/kubernetes/kubernetes/issues/111695)により、デュアルスタック環境でクラスター通信にプライマリネットワークインターフェースを使用していない場合、KubeletがノードのIPv6アドレスを無視します。このバグを回避するには、1.27以降を使用するか、次のフラグをK3sサーバーおよびエージェントの両方に追加します：

```
--kubelet-arg="node-ip=0.0.0.0" # IPv4トラフィックを優先する場合
#または
--kubelet-arg="node-ip=::" # IPv6トラフィックを優先する場合
```

:::

デュアルスタックネットワーキングは、クラスターが最初に作成されるときに設定する必要があります。IPv4のみで開始された既存のクラスターでは有効にできません。

K3sでデュアルスタックを有効にするには、すべてのサーバーノードで有効なデュアルスタック`cluster-cidr`および`service-cidr`を提供する必要があります。以下は有効な設定の例です：

```
--cluster-cidr=10.42.0.0/16,2001:cafe:42::/56 --service-cidr=10.43.0.0/16,2001:cafe:43::/112
```

有効な`cluster-cidr`および`service-cidr`値を設定できますが、上記のマスクが推奨されます。`cluster-cidr`マスクを変更する場合は、計画されたノードごとのポッド数および総ノード数に合わせて`node-cidr-mask-size-ipv4`および`node-cidr-mask-size-ipv6`値も変更する必要があります。サポートされる最大の`service-cidr`マスクはIPv4の場合は/12、IPv6の場合は/112です。パブリッククラウドにデプロイする場合は、IPv6トラフィックを許可することを忘れないでください。

カスタムCNIプラグイン、つまりFlannel以外のCNIプラグインを使用している場合、追加の設定が必要になることがあります。プラグインのデュアルスタックドキュメントを参照し、ネットワークポリシーが有効にできるか確認してください。

:::warning 既知の問題

クラスタCIDRおよびサービスCIDRをIPv6を主要ファミリーとして定義する場合、すべてのクラスタメンバーのノードIPを明示的に設定し、ノードの希望するIPv6アドレスを最初のアドレスとして配置する必要があります。デフォルトでは、kubeletは常にIPv4を主要アドレスファミリーとして使用します。
:::

## シングルスタックIPv6ネットワーキング

:::info バージョンゲート
[v1.22.9+k3s1](https://github.com/k3s-io/k3s/releases/tag/v1.22.9%2Bk3s1)から利用可能
:::

:::warning 既知の問題
IPv6のデフォルトルートがルーター広告（RA）によって設定されている場合、sysctl `net.ipv6.conf.all.accept_ra=2`を設定する必要があります。そうしないと、ノードはデフォルトルートが期限切れになるとドロップします。RAを受け入れることは、[中間者攻撃](https://github.com/kubernetes/kubernetes/issues/91507)のリスクを高める可能性があることに注意してください。
:::

シングルスタックIPv6クラスタ（IPv4を含まないクラスタ）は、`--cluster-cidr`および`--service-cidr`フラグを使用してK3sでサポートされています。以下は有効な設定の例です：

```bash
--cluster-cidr=2001:cafe:42::/56 --service-cidr=2001:cafe:43::/112
```
## ホスト名のないノード

Linodeなどの一部のクラウドプロバイダーは、ホスト名として「localhost」を持つマシンを作成することがあり、他のプロバイダーではホスト名がまったく設定されていない場合があります。これにより、ドメイン名解決に問題が生じる可能性があります。この問題を解決するために、K3sを`--node-name`フラグまたは`K3S_NODE_NAME`環境変数を使用して実行し、ノード名を渡すことができます。