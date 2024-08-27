---
title: "MultusとIPAMプラグイン"
---

[Multus CNI](https://github.com/k8snetworkplumbingwg/multus-cni) は、ポッドに複数のネットワークインターフェースを接続することを可能にするCNIプラグインです。MultusはCNIプラグインを置き換えるのではなく、CNIプラグインのマルチプレクサとして機能します。特に、ポッドがネットワーク集約型であり、SR-IOVなどのデータプレーンアクセラレーション技術をサポートする追加のネットワークインターフェースを必要とする場合に、Multusは有用です。

Multusは単独でデプロイすることはできません。常に、Kubernetesクラスターのネットワーク要件を満たす少なくとも1つの従来のCNIプラグインが必要です。そのCNIプラグインがMultusのデフォルトとなり、すべてのポッドに対して主要なインターフェースを提供するために使用されます。デフォルトオプションでK3sをデプロイする場合、そのCNIプラグインはFlannelです。

### Helmリポジトリを追加

Multusをデプロイするには、以下のHelmリポジトリを使用することをお勧めします：
```
helm repo add rke2-charts https://rke2-charts.rancher.io
helm repo update
```

### IPAMプラグインを設定

Multusによって作成された追加のインターフェースにIPアドレスを割り当てるために、IPAMプラグインが必要です。

<Tabs groupId="MultusIPAMplugins">
<TabItem value="host-local" default>
host-local IPAMプラグインは、アドレス範囲のセットからIPアドレスを割り当てます。状態をホストのファイルシステムにローカルに保存するため、単一ホスト上のIPアドレスの一意性が保証されます。したがって、マルチノードクラスターには推奨しません。このIPAMプラグインは追加のデプロイを必要としません。詳細については、https://www.cni.dev/plugins/current/ipam/host-local/ を参照してください。

host-localプラグインを使用するには、以下の内容で`multus-values.yaml`というファイルを作成してください：
```
config:
  cni_conf:
    confDir: /var/lib/rancher/k3s/agent/etc/cni/net.d
    binDir: /var/lib/rancher/k3s/data/current/bin/
    kubeconfig: /var/lib/rancher/k3s/agent/etc/cni/net.d/multus.d/multus.kubeconfig
```

</TabItem>
<TabItem value="Whereabouts" default>
[Whereabouts](https://github.com/k8snetworkplumbingwg/whereabouts) は、クラスター全体でIPアドレスを割り当てるIPアドレス管理（IPAM）CNIプラグインです。

Whereabouts IPAMプラグインを使用するには、以下の内容で`multus-values.yaml`というファイルを作成してください：
```
config:
  cni_conf:
    confDir: /var/lib/rancher/k3s/agent/etc/cni/net.d
    binDir: /var/lib/rancher/k3s/data/current/bin/
    kubeconfig: /var/lib/rancher/k3s/agent/etc/cni/net.d/multus.d/multus.kubeconfig
rke2-whereabouts:
  fullnameOverride: whereabouts
  enabled: true
  cniConf:
    confDir: /var/lib/rancher/k3s/agent/etc/cni/net.d
    binDir: /var/lib/rancher/k3s/data/current/bin/
```

</TabItem>
<TabItem value="Multus DHCP daemon" default>
dhcp IPAMプラグインは、ネットワーク上に既にDHCPサーバーが稼働している場合にデプロイできます。このデーモンセットは、DHCPリースの定期的な更新を担当します。詳細については、[DHCP IPAMプラグイン](https://www.cni.dev/plugins/current/ipam/dhcp/)の公式ドキュメントを参照してください。

DHCPプラグインを使用するには、以下の内容で`multus-values.yaml`というファイルを作成してください：
```
config:
  cni_conf:
    confDir: /var/lib/rancher/k3s/agent/etc/cni/net.d
    binDir: /var/lib/rancher/k3s/data/current/bin/
    kubeconfig: /var/lib/rancher/k3s/agent/etc/cni/net.d/multus.d/multus.kubeconfig
manifests:
  dhcpDaemonSet: true
```

</TabItem>
</Tabs>

### Multusをデプロイ

`multus-values.yaml`ファイルを作成した後、Multusをインストールする準備が整います：
```
helm install multus rke2-charts/rke2-multus -n kube-system --kubeconfig /etc/rancher/k3s/k3s.yaml --values multus-values.yaml
```

Helmチャートのインストールにより、必要なCNIバイナリを`/var/lib/rancher/k3s/data/current/`にインストールし、Multus CNI設定を`/var/lib/rancher/k3s/agent/etc/cni/net.d`に作成するためのMultusポッドを作成するDaemonSetがデプロイされます。

Multusの詳細については、[multus-cni](https://github.com/k8snetworkplumbingwg/multus-cni/tree/master/docs)のドキュメントを参照してください。