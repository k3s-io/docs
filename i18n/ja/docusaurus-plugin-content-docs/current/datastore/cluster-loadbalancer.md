---
title: クラスター・ロードバランサー
---

このセクションでは、外部ロードバランサーを高可用性（HA）K3sクラスターのサーバーノードの前にインストールする方法について説明します。NginxとHAProxyの2つの例が提供されています。

:::tip
外部ロードバランサーは、Kubernetes LoadBalancerサービスをサードパーティのロードバランサーコントローラーをデプロイせずに使用できるようにする組み込みコントローラーであるServiceLBと混同しないでください。詳細については、[Service Load Balancer](../networking/networking-services.md#service-load-balancer)を参照してください。

外部ロードバランサーは、ノードの登録用の固定登録アドレスを提供したり、Kubernetes APIサーバーへの外部アクセスを提供するために使用できます。LoadBalancerサービスを公開するために、外部ロードバランサーはServiceLBと一緒に、または代わりに使用できますが、ほとんどの場合、MetalLBやKube-VIPなどの代替ロードバランサーコントローラーの方が良い選択です。
:::

## 前提条件

この例のすべてのノードはUbuntu 20.04を実行しています。

両方の例では、[組み込みetcdを使用したHA K3sクラスター](../datastore/ha-embedded.md)が3つのノードにインストールされていると仮定します。

各k3sサーバーは次のように構成されています：
```yaml
# /etc/rancher/k3s/config.yaml
token: lb-cluster-gd
tls-san: 10.10.10.100
```

ノードのホスト名とIPは次の通りです：
* server-1: `10.10.10.50`
* server-2: `10.10.10.51`
* server-3: `10.10.10.52`

ロードバランシング用に追加の2つのノードがホスト名とIPで構成されています：
* lb-1: `10.10.10.98`
* lb-2: `10.10.10.99`

追加の3つのノードがホスト名とIPで存在します：
* agent-1: `10.10.10.101`
* agent-2: `10.10.10.102`
* agent-3: `10.10.10.103`

## ロードバランサーのセットアップ
<Tabs>
<TabItem value="HAProxy" default>

[HAProxy](http://www.haproxy.org/)は、TCPロードバランサーを提供するオープンソースのオプションです。また、ロードバランサー自体のHAをサポートし、すべてのレベルで冗長性を確保します。詳細については、[HAProxy Documentation](http://docs.haproxy.org/2.8/intro.html)を参照してください。

さらに、クラスターにアクセスするために使用される仮想IP（VIP）を生成するためにKeepAlivedを使用します。詳細については、[KeepAlived Documentation](https://www.keepalived.org/manpage.html)を参照してください。

1) HAProxyとKeepAlivedをインストールします：

```bash
sudo apt-get install haproxy keepalived
```

2) lb-1とlb-2の`/etc/haproxy/haproxy.cfg`に次の内容を追加します：

```
frontend k3s-frontend
    bind *:6443
    mode tcp
    option tcplog
    default_backend k3s-backend

backend k3s-backend
    mode tcp
    option tcp-check
    balance roundrobin
    default-server inter 10s downinter 5s
    server server-1 10.10.10.50:6443 check
    server server-2 10.10.10.51:6443 check
    server server-3 10.10.10.52:6443 check
```

3) lb-1とlb-2の`/etc/keepalived/keepalived.conf`に次の内容を追加します：

```
vrrp_script chk_haproxy {
    script 'killall -0 haproxy' # pidofよりも高速
    interval 2
}

vrrp_instance haproxy-vip {
    interface eth1
    state <STATE> # lb-1ではMASTER、lb-2ではBACKUP
    priority <PRIORITY> # lb-1では200、lb-2では100

    virtual_router_id 51

    virtual_ipaddress {
        10.10.10.100/24
    }

    track_script {
        chk_haproxy
    }
}
```

4) lb-1とlb-2でHAProxyとKeepAlivedを再起動します：

```bash
systemctl restart haproxy
systemctl restart keepalived
```

5) agent-1、agent-2、およびagent-3で次のコマンドを実行してk3sをインストールし、クラスターに参加します：

```bash
curl -sfL https://get.k3s.io | K3S_TOKEN=lb-cluster-gd sh -s - agent --server https://10.10.10.100:6443
```

サーバーノードから`kubectl`を使用してクラスターと対話できます。
```bash
root@server-1 $ k3s kubectl get nodes -A
NAME       STATUS   ROLES                       AGE     VERSION
agent-1    Ready    <none>                      32s     v1.27.3+k3s1
agent-2    Ready    <none>                      20s     v1.27.3+k3s1
agent-3    Ready    <none>                      9s      v1.27.3+k3s1
server-1   Ready    control-plane,etcd,master   4m22s   v1.27.3+k3s1
server-2   Ready    control-plane,etcd,master   3m58s   v1.27.3+k3s1
server-3   Ready    control-plane,etcd,master   3m12s   v1.27.3+k3s1
```

</TabItem>

<TabItem value="Nginx">

## Nginxロードバランサー

:::danger
Nginxはネイティブに高可用性（HA）構成をサポートしていません。HAクラスターを設定する場合、K3sの前に単一のロードバランサーを配置すると、単一障害点が再導入されます。
:::

[Nginx Open Source](http://nginx.org/)は、TCPロードバランサーを提供します。詳細については、[Using nginx as HTTP load balancer](https://nginx.org/en/docs/http/load_balancing.html)を参照してください。

1) lb-1に次の内容の`nginx.conf`ファイルを作成します：

```
events {}

stream {
  upstream k3s_servers {
    server 10.10.10.50:6443;
    server 10.10.10.51:6443;
    server 10.10.10.52:6443;
  }

  server {
    listen 6443;
    proxy_pass k3s_servers;
  }
}
```

2) lb-1でNginxロードバランサーを実行します：

Dockerを使用する場合：

```bash
docker run -d --restart unless-stopped \
    -v ${PWD}/nginx.conf:/etc/nginx/nginx.conf \
    -p 6443:6443 \
    nginx:stable
```

または[Nginxをインストール](https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-open-source/)してから次を実行します：

```bash
cp nginx.conf /etc/nginx/nginx.conf
systemctl start nginx
```

3) agent-1、agent-2、およびagent-3で次のコマンドを実行してk3sをインストールし、クラスターに参加します：

```bash
curl -sfL https://get.k3s.io | K3S_TOKEN=lb-cluster-gd sh -s - agent --server https://10.10.10.98:6443
```

サーバーノードから`kubectl`を使用してクラスターと対話できます。
```bash
root@server1 $ k3s kubectl get nodes -A
NAME       STATUS   ROLES                       AGE     VERSION
agent-1    Ready    <none>                      30s     v1.27.3+k3s1
agent-2    Ready    <none>                      22s     v1.27.3+k3s1
agent-3    Ready    <none>                      13s     v1.27.3+k3s1
server-1   Ready    control-plane,etcd,master   4m49s   v1.27.3+k3s1
server-2   Ready    control-plane,etcd,master   3m58s   v1.27.3+k3s1
server-3   Ready    control-plane,etcd,master   3m16s   v1.27.3+k3s1
```
</TabItem>
</Tabs>