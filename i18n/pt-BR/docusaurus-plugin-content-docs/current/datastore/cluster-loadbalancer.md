---
title: Balanceador de Carga de Cluster
---

Esta seção descreve como instalar um balanceador de carga externo na frente dos nós de servidor de um cluster K3s de Alta Disponibilidade (HA). Dois exemplos são fornecidos: Nginx e HAProxy.

:::tip
Os balanceadores de carga externos não devem ser confundidos com o ServiceLB incorporado, que é um controlador incorporado que permite o uso dos Kubernetes LoadBalancer Services sem implantar um controlador de balanceador de carga de terceiros. Para mais detalhes, consulte [Service Load Balancer](../networking/networking-services.md#service-load-balancer).

Os balanceadores de carga externos podem ser usados ​​para fornecer um endereço de registro fixo para registrar nós ou para acesso externo ao Kubernetes API Server. Para expor os LoadBalancer Services, os balanceadores de carga externos podem ser usados ​​junto ou em vez do ServiceLB, mas na maioria dos casos, controladores de balanceador de carga de substituição, como MetalLB ou Kube-VIP, são uma escolha melhor.
:::

## Pré-requisitos

Todos os nós neste exemplo estão executando o Ubuntu 20.04.

Para ambos os exemplos, suponha que um [cluster HA K3s com etcd incorporado](../datastore/ha-embedded.md) foi instalado em 3 nós.

Cada servidor k3s é configurado com:
```yaml
# /etc/rancher/k3s/config.yaml
token: lb-cluster-gd
tls-san: 10.10.10.100
```

Os nós têm nomes de host e IPs de:
* server-1: `10.10.10.50`
* server-2: `10.10.10.51`
* server-3: `10.10.10.52`


Dois nós adicionais para balanceamento de carga são configurados com nomes de host e IPs de:
* lb-1: `10.10.10.98`
* lb-2: `10.10.10.99`

Existem três nós adicionais com nomes de host e IPs de:
* agent-1: `10.10.10.101`
* agent-2: `10.10.10.102`
* agent-3: `10.10.10.103`

## Configurar Balanceador de Carga
<Tabs queryString="ext-load-balancer">
<TabItem value="HAProxy" default>

[HAProxy](http://www.haproxy.org/) é uma opção de código aberto que fornece um balanceador de carga TCP. Ele também suporta HA para o próprio balanceador de carga, garantindo redundância em todos os níveis. Veja [Documentação do HAProxy](http://docs.haproxy.org/2.8/intro.html) para mais informações.

Além disso, usaremos KeepAlived para gerar um IP virtual (VIP) que será usado para acessar o cluster. Veja [Documentação do KeepAlived](https://www.keepalived.org/manpage.html) para mais informações.



1) Instalar HAProxy e KeepAlived:

```bash
sudo apt-get install haproxy keepalived
```

2) Adicione o seguinte em `/etc/haproxy/haproxy.cfg` em lb-1 e lb-2:

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
3) Adicione o seguinte em `/etc/keepalived/keepalived.conf` em lb-1 e lb-2:

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

6) Reinicie o HAProxy e o KeepAlived em lb-1 e lb-2:

```bash
systemctl restart haproxy
systemctl restart keepalived
```

5) No agente-1, agente-2 e agente-3, execute o seguinte comando para instalar o k3s e ingressar no cluster:

```bash
curl -sfL https://get.k3s.io | K3S_TOKEN=lb-cluster-gd sh -s - agent --server https://10.10.10.100:6443
```

Agora você pode usar `kubectl` do nó do servidor para interagir com o cluster.
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
O Nginx não suporta nativamente uma configuração de Alta Disponibilidade (HA). Se estiver configurando um cluster HA, ter um único balanceador de carga na frente do K3s reintroduzirá um único ponto de falha.
:::

[Nginx Open Source](http://nginx.org/) fornece um balanceador de carga TCP. Veja [Usando nginx como balanceador de carga HTTP](https://nginx.org/en/docs/http/load_balancing.html) para mais informações.

1) Crie um arquivo `nginx.conf` em lb-1 com o seguinte conteúdo:

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

2) Execute o balanceador de carga Nginx em lb-1:

Usando o docker:

```bash
docker run -d --restart unless-stopped \
    -v ${PWD}/nginx.conf:/etc/nginx/nginx.conf \
    -p 6443:6443 \
    nginx:stable
```

Ou [instale o nginx](https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-open-source/) e então execute:

```bash
cp nginx.conf /etc/nginx/nginx.conf
systemctl start nginx
```

3) No agente-1, agente-2 e agente-3, execute o seguinte comando para instalar o k3s e ingressar no cluster:

```bash
curl -sfL https://get.k3s.io | K3S_TOKEN=lb-cluster-gd sh -s - agent --server https://10.10.10.98:6443
```

Agora você pode usar `kubectl` do nó do servidor para interagir com o cluster.
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
