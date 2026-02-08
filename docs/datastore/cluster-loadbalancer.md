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
<Tabs queryString="ext-load-balancer">
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
global_defs {
  enable_script_security
  script_user root
}

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
curl -sfL https://get.k3s.io | K3S_TOKEN=lb-cluster-gd sh -s - agent --server https://10.10.10.98:6443
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
<TabItem value="Kube-VIP">

## Kube-VIP

:::info
This example explains the control-plane load balancer setup using ARP mode.
:::

[Kube-VIP](https://kube-vip.io/) provides a virtual IP and load balancer for the Kubernetes control plane and for Services of type LoadBalancer. The instructions below show how to generate and deploy the daemonset manifest on K3s control-plane nodes.

1) Create the manifests directory

```bash
sudo mkdir -p /var/lib/rancher/k3s/server/manifests/
sudo chown root:root /var/lib/rancher/k3s/server/manifests/
```

2) Install RBAC manifest

```bash
curl -fsSL https://kube-vip.io/manifests/rbac.yaml -o /var/lib/rancher/k3s/server/manifests/kube-vip-rbac.yaml
```

3) Prepare variables

- Choose a VIP that is not in use on the network:

```bash
export VIP=10.10.10.100
```

- (Optional) Set the network interface name to use for ARP announcements (discover with `ip a`). If omitted, kube-vip will attempt to detect the interface.

```bash
export INTERFACE=eth0
```

- Set the kube-vip version (or obtain the latest tag programmatically):

```bash
export KVVERSION=v1.4.0
# or to obtain latest using jq:
# export KVVERSION=$(curl -sL https://api.github.com/repos/kube-vip/kube-vip/releases | jq -r '.[0].tag_name')
```

4) Generate the daemonset manifest

Use the kube-vip container to generate the manifest and write it directly to the k3s static-manifests directory. The command requires sufficient privileges (NET_ADMIN / host networking). Examples for common runtimes:

- containerd (ctr):

```bash
sudo ctr image pull ghcr.io/kube-vip/kube-vip:$KVVERSION
sudo ctr run --rm --net-host --privileged ghcr.io/kube-vip/kube-vip:$KVVERSION kube-vip /kube-vip manifest daemonset \
  --interface "$INTERFACE" \
  --address "$VIP" \
  --inCluster \
  --taint \
  --controlplane \
  --arp \
  --leaderElection > /var/lib/rancher/k3s/server/manifests/kube-vip.yaml
```

- Docker:

```bash
sudo docker run --network host --rm --privileged ghcr.io/kube-vip/kube-vip:$KVVERSION /kube-vip manifest daemonset \
  --interface "$INTERFACE" \
  --address "$VIP" \
  --inCluster \
  --taint \
  --controlplane \
  --arp \
  --leaderElection > /var/lib/rancher/k3s/server/manifests/kube-vip.yaml
```

Notes:
- The `--interface` flag is optional. If omitted, kube-vip will attempt to select the correct interface on each node.
- `--arp` selects ARP mode for the VIP. Use a mode appropriate for your network (ARP is common for layer-2 networks).
- Keep `--taint` if you want control-plane nodes to remain unschedulable for regular workloads.

5) Deploy / reconcile

- K3s automatically loads manifests placed in /var/lib/rancher/k3s/server/manifests/. After placing the manifest, kube-vip will start on the control-plane nodes.
- Verify the kube-vip pods and the VIP announcement with `kubectl -n kube-system get pods` and `ip neigh` / `arping` as needed.

6) TLS certificate note

- If you are installing K3s after creating the VIP, install K3s with the VIP included in TLS SANs:

```bash
curl -sfL https://get.k3s.io | INSTALL_K3S_VERSION="vX.Y.Z" sh -s -- --tls-san $VIP
```

- If K3s is already installed without the VIP in the server certificate, you must reconfigure or rotate the server certificates to include the VIP in the SANs so kubelets and clients can validate the API server certificate.

</TabItem>
</Tabs>
