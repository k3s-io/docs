---
title: Cluster Load Balancer
weight: 30
---


This section describes how to install an external load balancer for use with a High Availability (HA) K3s cluster. Two examples are provided: Nginx and HAProxy.

:::tip
An external loadbalancer should not be confused with the embedded ServiceLB, which is an internal load balancer that allows pods to maintain static IPs inside the cluster itself. For more details, see [Service Load Balancer](../networking/networking.md#service-load-balancer).
:::

## Prerequisites

For both examples, assume that a [HA K3s cluster with embedded etcd](../datastore/ha-embedded.md) has been installed on 3 nodes.

Each k3s server is configured with:
```yaml
# /etc/rancher/k3s/config.yaml
token: lb-cluster-gd
tls-san: 10.10.10.99
```

The nodes have hostnames and IPs of: 
* server-1: `10.10.10.50`
* server-2: `10.10.10.51`
* server-3: `10.10.10.52`


An additional node with docker installed is also configured, with hostname and IP of:
* lb-1: `10.10.10.99`

Three additional nodes exist with hostnames and IPs of:
* agent-1: `10.10.10.101`
* agent-2: `10.10.10.102`
* agent-3: `10.10.10.103`

## Nginx Load Balancer

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

2) Run the following command on lb-1 to start the Nginx load balancer:

```bash
docker run -d --restart unless-stopped \
    -v ${PWD}/nginx.conf:/etc/nginx/nginx.conf \
    -p 6443:6443 \
    nginx:stable
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

## HAProxy Load Balancer

[HAProxy](http://www.haproxy.org/) is another open source option that provides a TCP load balancer. It also supports HA for the load balancer itself. See [HAProxy Documentation](http://docs.haproxy.org/2.8/intro.html) for more info.


1) Create a `haproxy.cfg` file on lb-1 with the following contents:

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

2) Run the following command on lb-1 to start the HAProxy load balancer:

```bash
docker run -d --restart unless-stopped \
    -v ${PWD}/haproxy.cfg:/usr/local/etc/haproxy/haproxy.cfg \
    -p 6443:6443 \
    haproxy:alpine
```

3) On agent-1, agent-2, and agent-3, run the following command to install k3s and join the cluster:

```bash
curl -sfL https://get.k3s.io | K3S_TOKEN=lb-cluster-gd sh -s - agent --server https://10.10.10.99:6443
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