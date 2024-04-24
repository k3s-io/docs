---
title: Cluster Load Balancer
---


This section describes how to install an external load balancer in front of a High Availability (HA) K3s cluster's server nodes. Two examples are provided: Nginx and HAProxy.

:::tip
External load-balancers should not be confused with the embedded ServiceLB, which is an embedded controller that allows for use of Kubernetes LoadBalancer Services without deploying a third-party load-balancer controller. For more details, see [Service Load Balancer](../networking/networking-services.md#service-load-balancer). 

External load-balancers can be used to provide a fixed registration address for registering nodes, or for external access to the Kubernetes API Server. For exposing LoadBalancer Services, external load-balancers can be used alongside or instead of ServiceLB, but in most cases, replacement load-balancer controllers such as MetalLB or Kube-VIP are a better choice.
:::

## Prerequisites

All nodes in this example are running Ubuntu 20.04.

For both examples, assume that a [HA K3s cluster with embedded etcd](../datastore/ha-embedded.md) has been installed on 3 nodes.

Each k3s server is configured with:
```yaml
# /etc/rancher/k3s/config.yaml
token: lb-cluster-gd
tls-san: 10.10.10.100
```

The nodes have hostnames and IPs of: 
* server-1: `10.10.10.50`
* server-2: `10.10.10.51`
* server-3: `10.10.10.52`


Two additional nodes for load balancing are configured with hostnames and IPs of:
* lb-1: `10.10.10.98`
* lb-2: `10.10.10.99`

Three additional nodes exist with hostnames and IPs of:
* agent-1: `10.10.10.101`
* agent-2: `10.10.10.102`
* agent-3: `10.10.10.103`

## Setup Load Balancer
<Tabs>
<TabItem value="HAProxy" default>

[HAProxy](http://www.haproxy.org/) is an open source option that provides a TCP load balancer. It also supports HA for the load balancer itself, ensuring redundancy at all levels. See [HAProxy Documentation](http://docs.haproxy.org/2.8/intro.html) for more info.

Additionally, we will use KeepAlived to generate a virtual IP (VIP) that will be used to access the cluster. See [KeepAlived Documentation](https://www.keepalived.org/manpage.html) for more info.



1) Install HAProxy and KeepAlived:

```bash
sudo apt-get install haproxy keepalived
```

2) Add the following to `/etc/haproxy/haproxy.cfg` on lb-1 and lb-2:

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
3) Add the following to `/etc/keepalived/keepalived.conf` on lb-1 and lb-2:

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

6) Restart HAProxy and KeepAlived on lb-1 and lb-2:

```bash
systemctl restart haproxy
systemctl restart keepalived
```

5) On agent-1, agent-2, and agent-3, run the following command to install k3s and join the cluster:

```bash
curl -sfL https://get.k3s.io | K3S_TOKEN=lb-cluster-gd sh -s - agent --server https://10.10.10.100:6443
```

You can now use `kubectl` from server node to interact with the cluster.
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

## Nginx Load Balancer

:::danger
Nginx does not natively support a High Availability (HA) configuration. If setting up an HA cluster, having a single load balancer in front of K3s will reintroduce a single point of failure.
:::

[Nginx Open Source](http://nginx.org/) provides a TCP load balancer. See [Using nginx as HTTP load balancer](https://nginx.org/en/docs/http/load_balancing.html) for more info.

1) Create a `nginx.conf` file on lb-1 with the following contents:

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

2) Run the Nginx load balancer on lb-1:

Using docker:

```bash
docker run -d --restart unless-stopped \
    -v ${PWD}/nginx.conf:/etc/nginx/nginx.conf \
    -p 6443:6443 \
    nginx:stable
```

Or [install nginx](https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-open-source/) and then run:

```bash
cp nginx.conf /etc/nginx/nginx.conf
systemctl start nginx
```

3) On agent-1, agent-2, and agent-3, run the following command to install k3s and join the cluster:

```bash
curl -sfL https://get.k3s.io | K3S_TOKEN=lb-cluster-gd sh -s - agent --server https://10.10.10.99:6443
```

You can now use `kubectl` from server node to interact with the cluster.
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
