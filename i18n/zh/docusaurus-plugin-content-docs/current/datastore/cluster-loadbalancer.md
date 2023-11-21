---
title: 集群负载均衡器
weight: 30
---


本节介绍如何在高可用性 (HA) K3s 集群的 Server 节点前安装外部负载均衡器。此处提供了两个示例：Nginx 和 HAProxy。

:::tip
不要混淆外部负载均衡器与嵌入式 ServiceLB，后者是一个嵌入式控制器，允许在不部署第三方负载均衡器控制器的情况下使用 Kubernetes LoadBalancer Service。有关更多详细信息，请参阅 [Service Load Balancer](../networking/networking.md#service-load-balancer)。

外部负载均衡器可用于提供固定的注册地址来注册节点，或用于从外部访问 Kubernetes API Server。为了公开 LoadBalancer Service，外部负载均衡器可以与 ServiceLB 一起使用或代替 ServiceLB，但在大多数情况下，替代负载均衡器控制器（例如 MetalLB 或 Kube-VIP）是更好的选择。
:::

## 先决条件

本示例中的所有节点都运行 Ubuntu 20.04。

这两个示例假设已在 3 个节点上安装了[具有嵌入式 etcd 的 HA K3s 集群](../datastore/ha-embedded.md)。

每个 K3s Server 配置有：
```yaml
# /etc/rancher/k3s/config.yaml
token: lb-cluster-gd
tls-san: 10.10.10.100
```

节点的主机名和 IP 为：
* server-1: `10.10.10.50`
* server-2: `10.10.10.51`
* server-3: `10.10.10.52`


用于负载均衡的两个节点配置了以下主机名和 IP：
* lb-1: `10.10.10.98`
* lb-2: `10.10.10.99`

存在三个附加节点，其主机名和 IP 为：
* agent-1: `10.10.10.101`
* agent-2: `10.10.10.102`
* agent-3: `10.10.10.103`

## 设置负载均衡器
<Tabs>
<TabItem value="HAProxy" default>

[HAProxy](http://www.haproxy.org/) 是一个提供 TCP 负载均衡器的开源选项。它还支持负载均衡器本身的 HA，确保各个级别的冗余。有关详细信息，请参阅 [HAProxy 文档](http://docs.haproxy.org/2.8/intro.html)。

此外，我们将使用 KeepAlived 来生成用于访问集群的虚拟 IP (VIP)。有关详细信息，请参阅 [KeepAlived 文档](https://www.keepalived.org/manpage.html)。



1) 安装 HAProxy 和 KeepAlived：

```bash
sudo apt-get install haproxy keepalived
```

2) 将以下内容添加到 lb-1 和 lb-2 上的 `/etc/haproxy/haproxy.cfg` 中：

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
3) 将以下内容添加到 lb-1 和 lb-2 上的 `/etc/keepalived/keepalived.conf` 中：

```
vrrp_script chk_haproxy {
    script 'killall -0 haproxy' # faster than pidof
    interval 2
}

vrrp_instance haproxy-vip {
   interface eth1
    state <STATE> # MASTER on lb-1, BACKUP on lb-2
    priority <PRIORITY> # 200 on lb-1, 100 on lb-2

    virtual_router_id 51

    virtual_ipaddress {
        10.10.10.100/24
    }

    track_script {
        chk_haproxy
    }
}
```

6) 在 lb-1 和 lb-2 上重启 HAProxy 和 KeepAlived：

```bash
systemctl restart haproxy
systemctl restart keepalived
```

5) 在 agent-1、agent-2、agent-3 上执行以下命令来安装 K3s 并加入集群：

```bash
curl -sfL https://get.k3s.io | K3S_TOKEN=lb-cluster-gd sh -s - agent --server https://10.10.10.100:6443
```

你现在可以从 Server 节点使用 `kubectl` 与集群交互。
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

## Nginx 负载均衡器

:::warning
Nginx 本身不支持高可用性 (HA) 配置。如果设置 HA 集群，在 K3 前面使用单个负载均衡器将重新引入单一故障点。
:::

[Nginx 开源](http://nginx.org/)提供 TCP 负载均衡器。有关详细信息，请参阅[使用 Nginx 作为 HTTP 负载均衡器](https://nginx.org/en/docs/http/load_balancing.html)。

1) 在 lb-1 上创建一个包含以下内容的 `nginx.conf` 文件：

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

2) 在 lb-1 上运行 Nginx 负载均衡器：

使用 Docker：

```bash
docker run -d --restart unless-stopped \
    -v ${PWD}/nginx.conf:/etc/nginx/nginx.conf \
    -p 6443:6443 \
    nginx:stable
```

或者[安装 Nginx](https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-open-source/) 然后运行：

```bash
cp nginx.conf /etc/nginx/nginx.conf
systemctl start nginx
```

3) 在 agent-1、agent-2、agent-3 上执行以下命令来安装 K3s 并加入集群：

```bash
curl -sfL https://get.k3s.io | K3S_TOKEN=lb-cluster-gd sh -s - agent --server https://10.10.10.99:6443
```

你现在可以从 Server 节点使用 `kubectl` 与集群交互。
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