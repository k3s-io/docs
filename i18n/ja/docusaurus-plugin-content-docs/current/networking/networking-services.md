---
title: "ネットワーキングサービス"
---

このページでは、K3s内でCoreDNS、Traefik Ingressコントローラー、ネットワークポリシーコントローラー、およびServiceLBロードバランサーコントローラーがどのように機能するかを説明します。

Flannelの設定オプションやバックエンドの選択、または独自のCNIのセットアップ方法については、[インストールネットワークオプション](./basic-network-options.md)ページを参照してください。

K3sのために開く必要のあるポートについての情報は、[ネットワーキング要件](../installation/requirements.md#networking)を参照してください。

## CoreDNS

CoreDNSはサーバーの起動時に自動的にデプロイされます。これを無効にするには、クラスター内のすべてのサーバーに`--disable=coredns`オプションを設定します。

CoreDNSをインストールしない場合は、クラスターDNSプロバイダーを自分でインストールする必要があります。

## Traefik Ingressコントローラー

[Traefik](https://traefik.io/)は、マイクロサービスを簡単にデプロイするために作られた最新のHTTPリバースプロキシおよびロードバランサーです。アプリケーションの設計、デプロイ、および実行時のネットワークの複雑さを簡素化します。

Traefik Ingressコントローラーは、ポート80および443を使用するLoadBalancerサービスをデプロイし、管理するIngressリソースのステータスにLoadBalancerサービスの外部IPを広告します。

デフォルトでは、ServiceLBはクラスター内のすべてのノードを使用してTraefik LoadBalancerサービスをホストします。つまり、ポート80および443は他のHostPortまたはNodePortポッドには使用できず、IngressリソースのステータスにはクラスターのすべてのメンバーのノードIPが表示されます。

Traefikが使用するノードを制限し、拡張してIngressステータスに広告されるノードIPを制限するには、以下の[ServiceLBノード選択の制御](#controlling-servicelb-node-selection)セクションの指示に従って、ServiceLBが実行されるノードを制限するか、いくつかのノードをLoadBalancerプールに追加し、Traefikサービスをそのプールに制限するためにTraefik HelmChartConfigに一致するラベルを設定します。

Traefikはサーバーの起動時にデフォルトでデプロイされます。詳細については[パッケージ化されたコンポーネントの管理](../installation/packaged-components.md)を参照してください。デフォルトの設定ファイルは`/var/lib/rancher/k3s/server/manifests/traefik.yaml`にあります。

`traefik.yaml`ファイルは手動で編集しないでください。K3sは起動時にデフォルトでファイルを置き換えます。代わりに、Traefikをカスタマイズするには、`/var/lib/rancher/k3s/server/manifests`に追加の`HelmChartConfig`マニフェストを作成します。詳細および例については[HelmChartConfigを使用したパッケージ化されたコンポーネントのカスタマイズ](../helm.md#customizing-packaged-components-with-helmchartconfig)を参照してください。可能な設定値については、公式の[Traefik Helm設定パラメータ](https://github.com/traefik/traefik-helm-chart/tree/master/traefik)を参照してください。

クラスターからTraefikを削除するには、すべてのサーバーを`--disable=traefik`フラグで起動します。

K3sにはTraefik v2が含まれています。K3sバージョン1.21から1.30はTraefik v2をインストールしますが、既存のTraefik v1のインストールが見つかった場合、Traefikはv2にアップグレードされません。K3sバージョン1.20およびそれ以前にはTraefik v1が含まれています。K3sに含まれる特定のTraefikバージョンについては、使用しているバージョンのリリースノートを参照してください。

古いTraefik v1インスタンスからの移行については、[Traefikドキュメント](https://doc.traefik.io/traefik/migration/v1-to-v2/)および[移行ツール](https://github.com/traefik/traefik-migration-tool)を参照してください。

## ネットワークポリシーコントローラー

K3sには埋め込みのネットワークポリシーコントローラーが含まれています。基盤となる実装は[kube-router](https://github.com/cloudnativelabs/kube-router)のnetpolコントローラーライブラリ（他のkube-router機能は含まれていません）であり、[こちら](https://github.com/k3s-io/k3s/tree/master/pkg/agent/netpol)にあります。

これを無効にするには、各サーバーを`--disable-network-policy`フラグで起動します。

:::note
K3sの設定を変更してネットワークポリシーコントローラーを無効にしても、ネットワークポリシーのiptablesルールは削除されません。ネットワークポリシーコントローラーを無効にした後に設定されたkube-routerネットワークポリシールールをクリーンアップするには、`k3s-killall.sh`スクリプトを使用するか、`iptables-save`および`iptables-restore`を使用して手動でクリーンアップします。これらの手順はクラスター内のすべてのノードで手動で実行する必要があります。
```
iptables-save | grep -v KUBE-ROUTER | iptables-restore
ip6tables-save | grep -v KUBE-ROUTER | ip6tables-restore
```
:::

## サービスロードバランサー

任意のLoadBalancerコントローラーをK3sクラスターにデプロイできます。デフォルトでは、K3sは利用可能なホストポートを使用する[ServiceLB](https://github.com/k3s-io/klipper-lb)（以前はKlipper LoadBalancerとして知られていた）というロードバランサーを提供します。

上流のKubernetesでは、LoadBalancerタイプのサービスを作成できますが、デフォルトのロードバランサー実装は含まれていないため、これらのサービスはインストールされるまで`pending`のままです。多くのホステッドサービスは、Amazon EC2やMicrosoft Azureなどのクラウドプロバイダーを必要とし、外部ロードバランサー実装を提供します。対照的に、K3sのServiceLBはクラウドプロバイダーや追加の設定なしでLoadBalancerサービスを使用できるようにします。

### ServiceLBの動作

ServiceLBコントローラーは、`spec.type`フィールドが`LoadBalancer`に設定されたKubernetes[サービス](https://kubernetes.io/docs/concepts/services-networking/service/)を監視します。

各LoadBalancerサービスごとに、`kube-system`ネームスペースに[DaemonSet](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/)が作成されます。このDaemonSetは、各ノードに`svc-`プレフィックスを持つポッドを作成します。これらのポッドはiptablesを使用して、ポッドのNodePortからサービスのClusterIPアドレスおよびポートにトラフィックを転送します。

ServiceLBポッドが外部IPが設定されたノードで実行されている場合、そのノードの外部IPがサービスの`status.loadBalancer.ingress`アドレスリストに入力されます。そうでない場合は、ノードの内部IPが使用されます。

複数のLoadBalancerサービスが作成された場合、各サービスごとに個別のDaemonSetが作成されます。

異なるポートを使用する限り、同じノードで複数のサービスを公開することが可能です。

ポート80でリッスンするLoadBalancerサービスを作成しようとすると、ServiceLBはクラスター内のポート80の空いているホストを見つけようとします。利用可能なホストがない場合、LBはPendingのままになります。

### 使用方法

K3sで[LoadBalancerタイプのサービス](https://kubernetes.io/docs/concepts/services-networking/service/#loadbalancer)を作成します。

### ServiceLBノード選択の制御

1つ以上のノードに`svccontroller.k3s.cattle.io/enablelb=true`ラベルを追加すると、ServiceLBコントローラーが許可リストモードに切り替わり、ラベルが付いたノードのみがLoadBalancerポッドをホストする資格を持ちます。ラベルが付いていないノードはServiceLBの使用から除外されます。

:::note
デフォルトでは、ノードにはラベルが付いていません。すべてのノードがラベルなしのままである限り、ポートが利用可能なすべてのノードがServiceLBによって使用されます。
:::

### ServiceLBノードプールの作成

特定のサブセットのノードを選択してLoadBalancerのポッドをホストするには、目的のノードに`enablelb`ラベルを追加し、ノードとサービスに一致する`lbpool`ラベル値を設定します。例えば：

1. ノードAとノードBに`svccontroller.k3s.cattle.io/lbpool=pool1`および`svccontroller.k3s.cattle.io/enablelb=true`ラベルを付けます。
2. ノードCとノードDに`svccontroller.k3s.cattle.io/lbpool=pool2`および`svccontroller.k3s.cattle.io/enablelb=true`ラベルを付けます。
3. ポート443で1つのLoadBalancerサービスを作成し、`svccontroller.k3s.cattle.io/lbpool=pool1`ラベルを付けます。このサービスのDaemonSetはノードAとノードBにのみポッドをデプロイします。
4. ポート443で別のLoadBalancerサービスを作成し、`svccontroller.k3s.cattle.io/lbpool=pool2`ラベルを付けます。DaemonSetはノードCとノードDにのみポッドをデプロイします。

### ServiceLBの無効化

ServiceLBを無効にするには、クラスター内のすべてのサーバーを`--disable=servicelb`フラグで設定します。

これは、MetalLBなどの別のLBを実行する場合に必要です。

## 外部クラウドコントローラーマネージャーのデプロイ

バイナリサイズを削減するために、K3sはすべての「インツリー」（組み込み）クラウドプロバイダーを削除します。代わりに、K3sは以下のことを行う埋め込みのクラウドコントローラーマネージャー（CCM）スタブを提供します：
- `--node-ip`および`--node-external-ip`フラグに基づいてノードのInternalIPおよびExternalIPアドレスフィールドを設定します。
- ServiceLBロードバランサーコントローラーをホストします。
- クラウドプロバイダーが`external`に設定されている場合に存在する`node.cloudprovider.kubernetes.io/uninitialized`テイントをクリアします。

外部CCMをデプロイする前に、すべてのK3sサーバーを`--disable-cloud-controller`フラグで起動して埋め込みCCMを無効にする必要があります。

:::note
組み込みのCCMを無効にし、適切に構成された外部の代替品をデプロイしない場合、ノードはテイントされたままでスケジュール不可能になります。
:::
