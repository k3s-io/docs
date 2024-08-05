---
title: 要件
---

K3sは非常に軽量ですが、以下に示す最低要件があります。

K3sをコンテナ内で実行する場合でも、ネイティブのLinuxサービスとして実行する場合でも、K3sを実行する各ノードは以下の最低要件を満たす必要があります。これらの要件はK3sおよびそのパッケージ化されたコンポーネントのためのベースラインであり、ワークロード自体によって消費されるリソースは含まれていません。

## 前提条件

2つのノードは同じホスト名を持つことはできません。

複数のノードが同じホスト名を持つ場合、またはホスト名が自動プロビジョニングシステムによって再利用される可能性がある場合は、`--with-node-id`オプションを使用して各ノードにランダムなサフィックスを追加するか、`--node-name`または`$K3S_NODE_NAME`で一意の名前を渡してクラスターに追加する各ノードに指定してください。

## アーキテクチャ

K3sは以下のアーキテクチャで利用可能です:
- x86_64
- armhf
- arm64/aarch64
- s390x

:::warning ARM64 ページサイズ

2023年5月以前のリリース（v1.24.14+k3s1、v1.25.10+k3s1、v1.26.5+k3s1、v1.27.2+k3s1）では、`aarch64/arm64`システムでカーネルが4kページを使用する必要があります。**RHEL9**、**Ubuntu**、**Raspberry PI OS**、および**SLES**はすべてこの要件を満たしています。

:::

## オペレーティングシステム

K3sはほとんどの最新のLinuxシステムで動作することが期待されています。

一部のOSには追加のセットアップ要件があります:
<Tabs queryString="os">
<TabItem value="suse" label="SUSE Linux Enterprise / openSUSE">

firewalldをオフにすることをお勧めします:
```bash
systemctl disable firewalld --now
```

firewalldを有効にしたままにしたい場合、デフォルトで以下のルールが必要です:
```bash
firewall-cmd --permanent --add-port=6443/tcp #apiserver
firewall-cmd --permanent --zone=trusted --add-source=10.42.0.0/16 #pods
firewall-cmd --permanent --zone=trusted --add-source=10.43.0.0/16 #services
firewall-cmd --reload
```

セットアップに応じて追加のポートを開く必要がある場合があります。詳細については[インバウンドルール](#inbound-rules-for-k3s-nodes)を参照してください。ポッドやサービスのデフォルトCIDRを変更する場合は、ファイアウォールルールを更新する必要があります。

</TabItem>
<TabItem value="rhel" label="Red Hat Enterprise Linux / CentOS / Fedora">

firewalldをオフにすることをお勧めします:
```bash
systemctl disable firewalld --now
```

firewalldを有効にしたままにしたい場合、デフォルトで以下のルールが必要です:
```bash
firewall-cmd --permanent --add-port=6443/tcp #apiserver
firewall-cmd --permanent --zone=trusted --add-source=10.42.0.0/16 #pods
firewall-cmd --permanent --zone=trusted --add-source=10.43.0.0/16 #services
firewall-cmd --reload
```

セットアップに応じて追加のポートを開く必要がある場合があります。詳細については[インバウンドルール](#inbound-rules-for-k3s-nodes)を参照してください。ポッドやサービスのデフォルトCIDRを変更する場合は、ファイアウォールルールを更新する必要があります。

有効になっている場合は、nm-cloud-setupを無効にしてノードを再起動する必要があります:
```bash
systemctl disable nm-cloud-setup.service nm-cloud-setup.timer
reboot
```
</TabItem>
<TabItem value="debian" label="Ubuntu / Debian">

古いDebianリリースには既知のiptablesバグがある可能性があります。詳細は[既知の問題](../known-issues.md#iptables)を参照してください。

ufw（uncomplicated firewall）をオフにすることをお勧めします:
```bash
ufw disable
```

ufwを有効にしたままにしたい場合、デフォルトで以下のルールが必要です:
```bash
ufw allow 6443/tcp #apiserver
ufw allow from 10.42.0.0/16 to any #pods
ufw allow from 10.43.0.0/16 to any #services
```

セットアップに応じて追加のポートを開く必要がある場合があります。詳細については[インバウンドルール](#inbound-rules-for-k3s-nodes)を参照してください。ポッドやサービスのデフォルトCIDRを変更する場合は、ファイアウォールルールを更新する必要があります。
</TabItem>
<TabItem value="pi" label="Raspberry Pi">

Raspberry Pi OSはDebianベースであり、既知のiptablesバグがある可能性があります。詳細は[既知の問題](../known-issues.md#iptables)を参照してください。

標準のRaspberry Pi OSインストールでは、`cgroups`が有効になっていません。**K3S**はsystemdサービスを開始するために`cgroups`を必要とします。`cgroups`は`/boot/cmdline.txt`に`cgroup_memory=1 cgroup_enable=memory`を追加することで有効にできます。

例のcmdline.txt:
```
console=serial0,115200 console=tty1 root=PARTUUID=58b06195-02 rootfstype=ext4 elevator=deadline fsck.repair=yes rootwait cgroup_memory=1 cgroup_enable=memory
```

Ubuntu 21.10以降、Raspberry Piでのvxlanサポートは別のカーネルモジュールに移動されました。
```bash
sudo apt install linux-modules-extra-raspi
```
</TabItem>
</Tabs>

Rancher管理のK3sクラスターでテストされたOSの詳細については、[Rancherのサポートとメンテナンスの条件](https://rancher.com/support-maintenance-terms/)を参照してください。

## ハードウェア

ハードウェア要件はデプロイメントの規模に応じてスケールします。ここでは最低限の推奨事項を示します。

| スペック | 最低限 | 推奨 |
|------|---------|-------------|
| CPU  | 1コア      | 2コア          |
| RAM  | 512 MB  | 1 GB        |

[リソースプロファイリング](../reference/resource-profiling.md)では、K3sエージェント、ワークロードを持つK3sサーバー、および1つのエージェントを持つK3sサーバーの最小リソース要件を決定するためのテスト結果をキャプチャしています。また、K3sサーバーとエージェントの利用に最も大きな影響を与える要因についての分析や、エージェントやワークロードからクラスターのデータストアを保護する方法についても含まれています。

:::info Raspberry Piと組み込みetcd
Raspberry Piで組み込みetcdを使用してK3sをデプロイする場合、外部SSDを使用することをお勧めします。etcdは書き込みが多く、SDカードはIO負荷に耐えられません。
:::

#### ディスク

K3sのパフォーマンスはデータベースのパフォーマンスに依存します。最適な速度を確保するために、可能であればSSDを使用することをお勧めします。ARMデバイスでSDカードやeMMCを使用する場合、ディスクのパフォーマンスは異なります。

## ネットワーキング

K3sサーバーはポート6443がすべてのノードからアクセス可能である必要があります。

ノードは、Flannel VXLANバックエンドを使用する場合はUDPポート8472を介して、Flannel WireGuardバックエンドを使用する場合はUDPポート51820（IPv6を使用する場合は51821）を介して他のノードに到達できる必要があります。ノードは他のポートでリッスンしないようにする必要があります。K3sはリバーストンネリングを使用して、ノードがサーバーに対してアウトバウンド接続を行い、すべてのkubeletトラフィックがそのトンネルを通じて実行されるようにします。ただし、Flannelを使用せずに独自のカスタムCNIを提供する場合は、Flannelが必要とするポートはK3sには必要ありません。

メトリクスサーバーを利用する場合、すべてのノードがポート10250で相互にアクセス可能である必要があります。

組み込みetcdを使用して高可用性を実現する予定がある場合、サーバーノードはポート2379および2380で相互にアクセス可能である必要があります。

:::tip 重要
ノードのVXLANポートは、クラスターネットワークが誰でもアクセスできるようになるため、外部に公開しないでください。ポート8472へのアクセスを無効にするファイアウォール/セキュリティグループの背後でノードを実行してください。
:::

:::danger
Flannelは、トラフィックをスイッチングするL2ネットワークを作成するために[Bridge CNIプラグイン](https://www.cni.dev/plugins/current/main/bridge/)に依存しています。`NET_RAW`機能を持つ不正なポッドは、そのL2ネットワークを悪用して[ARPスプーフィング](https://static.sched.com/hosted_files/kccncna19/72/ARP%20DNS%20spoof.pdf)などの攻撃を開始する可能性があります。したがって、[Kubernetesドキュメント](https://kubernetes.io/docs/concepts/security/pod-security-standards/)に記載されているように、信頼できないポッドで`NET_RAW`を無効にする制限付きプロファイルを設定してください。
:::

### K3sノードのインバウンドルール

| プロトコル | ポート      | ソース    | 宛先 | 説明
|----------|-----------|-----------|-------------|------------
| TCP      | 2379-2380 | サーバー   | サーバー     | 組み込みetcdを使用したHAの場合のみ必要
| TCP      | 6443      | エージェント    | サーバー     | K3sスーパーバイザーおよびKubernetes APIサーバー
| UDP      | 8472      | すべてのノード | すべてのノード   | Flannel VXLANの場合のみ必要
| TCP      | 10250     | すべてのノード | すべてのノード   | Kubeletメトリクス
| UDP      | 51820     | すべてのノード | すべてのノード   | Flannel WireguardをIPv4で使用する場合のみ必要
| UDP      | 51821     | すべてのノード | すべてのノード   | Flannel WireguardをIPv6で使用する場合のみ必要
| TCP      | 5001      | すべてのノード | すべてのノード   | 組み込み分散レジストリ（Spegel）の場合のみ必要
| TCP      | 6443      | すべてのノード | すべてのノード   | 組み込み分散レジストリ（Spegel）の場合のみ必要

通常、すべてのアウトバウンドトラフィックは許可されます。

使用するOSに応じて、ファイアウォールに追加の変更が必要な場合があります。

## 大規模クラスター

ハードウェア要件はK3sクラスターの規模に基づいています。プロダクションおよび大規模クラスターの場合、外部データベースを使用した高可用性セットアップをお勧めします。プロダクションでの外部データベースには以下のオプションが推奨されます:

- MySQL
- PostgreSQL
- etcd

### CPUとメモリ

高可用性K3sサーバーのノードに必要な最小CPUおよびメモリ要件は以下の通りです:

| デプロイメント規模 |   ノード数   | VCPUS |  RAM  |
|:---------------:|:---------:|:-----:|:-----:|
|      小規模      |  最大10   |   2   |  4 GB |
|      中規模     | 最大100   |   4   |  8 GB |
|      大規模     | 最大250   |   8   | 16 GB |
|     超大規模     | 最大500   |   16  | 32 GB |
|     超超大規模    |   500+    |   32  | 64 GB |

### ディスク

クラスターのパフォーマンスはデータベースのパフォーマンスに依存します。最適な速度を確保するために、常にSSDディスクを使用してK3sクラスターをバックアップすることをお勧めします。クラウドプロバイダーでは、最大IOPSを許可する最小サイズを使用することもお勧めします。

### ネットワーク

クラスターCIDRのサブネットサイズを増やして、ポッドのIPが不足しないようにすることを検討してください。K3sサーバーを起動する際に`--cluster-cidr`オプションを渡すことでそれを行うことができます。

### データベース

K3sはMySQL、PostgreSQL、MariaDB、およびetcdなどのさまざまなデータベースをサポートしています。詳細については[クラスターデータストア](../datastore/datastore.md)を参照してください。

大規模クラスターを実行するために必要なデータベースリソースのサイズガイドは以下の通りです:

| デプロイメント規模 |   ノード数   | VCPUS |  RAM  |
|:---------------:|:---------:|:-----:|:-----:|
|      小規模      |  最大10   |   1   |  2 GB |
|      中規模     | 最大100   |   2   |  8 GB |
|      大規模     | 最大250   |   4   | 16 GB |
|     超大規模     | 最大500   |   8   | 32 GB |
|     超超大規模    |   500+    |   16  | 64 GB |
