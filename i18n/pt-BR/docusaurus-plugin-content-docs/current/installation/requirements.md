---
title: Requisitos
---

O K3s é muito leve, mas possui alguns requisitos mínimos, conforme descrito abaixo.

Seja configurando o K3s para ser executado em um contêiner ou como um serviço nativo do Linux, cada nó executando o K3s deve atender aos seguintes requisitos mínimos. Esses requisitos são a base para o K3s e seus componentes empacotados, não incluindo os recursos consumidos pelas cargas de trabalho em si.

## Pré-requisitos

Dois nós não podem ter o mesmo hostname.

Se vários nós tiverem o mesmo hostname ou se hostnames puderem ser reutilizados por um sistema de provisionamento automatizado, use a opção `--with-node-id` para adicionar um sufixo aleatório a cada nó. Alternativamente, crie um nome exclusivo para cada nó e passe-o com `--node-name` ou `$K3S_NODE_NAME` ao adicioná-lo ao cluster.

## Arquitetura

O K3s está disponível para as seguintes arquiteturas:
- x86_64
- armhf
- arm64/aarch64
- s390x

:::warning Tamanho da Página ARM64

Antes dos lançamentos de maio de 2023 (v1.24.14+k3s1, v1.25.10+k3s1, v1.26.5+k3s1, v1.27.2+k3s1), em sistemas `aarch64/arm64`, o kernel deve usar páginas de 4k. **RHEL9**, **Ubuntu**, **Raspberry Pi OS** e **SLES** atendem a esse requisito.

:::

## Sistemas Operacionais

Espera-se que o K3s funcione na maioria dos sistemas Linux modernos.

Alguns sistemas operacionais possuem requisitos adicionais de configuração:
<Tabs queryString="os">
<TabItem value="suse" label="SUSE Linux Enterprise / openSUSE">

Recomenda-se desativar o firewalld:
```bash
systemctl disable firewalld --now
```

Se você deseja manter o firewalld habilitado, as seguintes regras são necessárias por padrão:
```bash
firewall-cmd --permanent --add-port=6443/tcp #apiserver
firewall-cmd --permanent --zone=trusted --add-source=10.42.0.0/16 #pods
firewall-cmd --permanent --zone=trusted --add-source=10.43.0.0/16 #services
firewall-cmd --reload
```

Portas adicionais podem precisar ser abertas, dependendo da sua configuração. Consulte [Regras de Entrada](#inbound-rules-for-k3s-nodes) para mais informações. Se você alterar o CIDR padrão para pods ou serviços, será necessário atualizar as regras do firewall de acordo.

</TabItem>
<TabItem value="rhel" label="Red Hat Enterprise Linux / CentOS / Fedora">

Recomenda-se desativar o firewalld:
```bash
systemctl disable firewalld --now
```

Se você deseja manter o firewalld habilitado, as seguintes regras são necessárias por padrão:
```bash
firewall-cmd --permanent --add-port=6443/tcp #apiserver
firewall-cmd --permanent --zone=trusted --add-source=10.42.0.0/16 #pods
firewall-cmd --permanent --zone=trusted --add-source=10.43.0.0/16 #services
firewall-cmd --reload
```

Portas adicionais podem precisar ser abertas, dependendo da sua configuração. Consulte [Regras de Entrada](#inbound-rules-for-k3s-nodes) para mais informações. Se você alterar o CIDR padrão para pods ou serviços, será necessário atualizar as regras do firewall de acordo.

Se habilitado, é necessário desativar o nm-cloud-setup e reiniciar o nó:
```bash
systemctl disable nm-cloud-setup.service nm-cloud-setup.timer
reboot
```
</TabItem>
<TabItem value="debian" label="Ubuntu / Debian">

Versões mais antigas do Debian podem sofrer com um bug conhecido no iptables. Consulte [Problemas Conhecidos](../known-issues.md#iptables).

É recomendável desativar o ufw (firewall descomplicado):
```bash
ufw disable
```

Se você deseja manter o ufw habilitado, as seguintes regras são necessárias por padrão:
```bash
ufw allow 6443/tcp #apiserver
ufw allow from 10.42.0.0/16 to any #pods
ufw allow from 10.43.0.0/16 to any #services
```

Portas adicionais podem precisar ser abertas, dependendo da sua configuração. Consulte [Regras de Entrada](#inbound-rules-for-k3s-nodes) para mais informações. Se você alterar o CIDR padrão para pods ou serviços, será necessário atualizar as regras do firewall de acordo.
</TabItem>
<TabItem value="pi" label="Raspberry Pi">

O Raspberry Pi OS é baseado no Debian e pode ser afetado por um bug conhecido no iptables. Consulte [Problemas Conhecidos](../known-issues.md#iptables).

#### Cgroups

Instalações padrão do Raspberry Pi OS não iniciam com os `cgroups` habilitados. O **K3S** precisa dos `cgroups` para iniciar o serviço systemd. Os `cgroups` podem ser habilitados adicionando `cgroup_memory=1 cgroup_enable=memory` ao arquivo `/boot/firmware/cmdline.txt`.
**Nota:** No Debian 11 e em versões mais antigas do Raspberry Pi OS, o arquivo cmdline.txt está localizado em `/boot/cmdline.txt`.

Exemplo cmdline.txt:
```
console=serial0,115200 console=tty1 root=PARTUUID=58b06195-02 rootfstype=ext4 elevator=deadline fsck.repair=yes rootwait cgroup_memory=1 cgroup_enable=memory
```

#### Módulo Vxlan no Ubuntu
No Ubuntu 21.10 até o Ubuntu 23.10, o suporte ao vxlan no Raspberry Pi foi movido para um módulo de kernel separado. Esse passo não é necessário para o Ubuntu 24.04 e versões posteriores.
```bash
sudo apt install linux-modules-extra-raspi
```
</TabItem>
</Tabs>

Para mais informações sobre quais sistemas operacionais foram testados com clusters K3s gerenciados pelo Rancher, consulte os [termos de suporte e manutenção do Rancher.](https://rancher.com/support-maintenance-terms/)

## Hardware

Os requisitos de hardware escalam com base no tamanho das suas implantações. Os requisitos mínimos são:

| Node   | CPU     | RAM    |
| ------ | ------- | ------ |
| Server | 2 cores | 2 GB   |
| Agent  | 1 core  | 512 MB |

O [Perfil de Recursos](../reference/resource-profiling.md) captura os resultados de testes e análises para determinar os requisitos mínimos de recursos para o agente K3s, o servidor K3s com uma carga de trabalho e o servidor K3s com um agente.

### Disco

O desempenho do K3s depende do desempenho do banco de dados. Para garantir uma velocidade ideal, recomendamos o uso de um SSD sempre que possível.

Se estiver implantando o K3s em um Raspberry Pi ou outros dispositivos ARM, é recomendável usar um SSD externo. O etcd é intensivo em gravações; cartões SD e eMMC não conseguem lidar com a carga de E/S.

### Guia de Dimensionamento de Servidor

Quando há limitações de CPU e RAM no nó do servidor (plano de controle + etcd), existem restrições sobre a quantidade de nós de agente que podem ser adicionados sob condições padrão de carga de trabalho.

| Server CPU | Server RAM | Número de Agentes |
| ---------- | ---------- | ----------------- |
| 2          | 4 GB       | 0-350             |
| 4          | 8 GB       | 351-900           |
| 8          | 16 GB      | 901-1800          |
| 16+        | 32 GB      | 1800+             |

:::tip Dimensionamento para Alta Disponibilidade

Em uma configuração de alta disponibilidade com 3 nós de servidor, o número de agentes pode escalar aproximadamente 50% a mais do que o descrito na tabela anterior.

Ex: 3 servidores com 4 vCPUs e 8 GB de RAM. Essa configuração pode suportar aproximadamente 1200 agentes.
:::

Recomenda-se adicionar os nós de agente em lotes de 50 ou menos para permitir que a CPU libere recursos, já que ocorre um pico de uso durante a adição de nós. Lembre-se de modificar o valor padrão de `cluster-cidr` se planejar mais de 255 nós no cluster! Isso garantirá espaço de endereçamento IP suficiente para acomodar todos os nós no ambiente.

O [Perfil de Recursos](../reference/resource-profiling.md#server-sizing-requirements-for-k3s) contém mais informações sobre como essas recomendações foram determinadas.


## Rede

O servidor K3s precisa que a porta 6443 esteja acessível por todos os nós.

Os nós precisam ser capazes de se comunicar entre si pela porta UDP 8472 ao usar o backend Flannel VXLAN, ou pela porta UDP 51820 (e 51821 se IPv6 for utilizado) ao usar o backend Flannel WireGuard. O nó não deve escutar em nenhuma outra porta. O K3s utiliza tunelamento reverso, de forma que os nós fazem conexões de saída para o servidor, e todo o tráfego do kubelet passa por esse túnel. No entanto, se você não utilizar o Flannel e fornecer sua própria CNI personalizada, as portas necessárias pelo Flannel não serão necessárias para o K3s.

Se você deseja utilizar o servidor de métricas, todos os nós devem estar acessíveis entre si pela porta 10250.

Se você planeja alcançar alta disponibilidade com o etcd embutido, os nós do servidor devem estar acessíveis entre si pelas portas 2379 e 2380.

:::tip Importante
A porta VXLAN nos nós não deve ser exposta para o mundo, pois isso abre a rede do seu cluster para ser acessada por qualquer pessoa. Execute seus nós por trás de um firewall ou grupo de segurança que desabilite o acesso à porta 8472.
:::

:::danger
O Flannel depende do [plugin Bridge CNI](https://www.cni.dev/plugins/current/main/bridge/) para criar uma rede L2 que encaminha o tráfego. Pods maliciosos com capacidades `NET_RAW` podem abusar dessa rede L2 para lançar ataques, como [spoofing de ARP](https://static.sched.com/hosted_files/kccncna19/72/ARP%20DNS%20spoof.pdf). Portanto, conforme documentado na [documentação do Kubernetes](https://kubernetes.io/docs/concepts/security/pod-security-standards/), configure um perfil restrito que desabilite `NET_RAW` em pods não confiáveis.
:::

### Regras de Entrada para os Nós K3s

| Protocolo | Porta     | Fonte        | Destino      | Descrição                                                     |
| --------- | --------- | ------------ | ------------ | ------------------------------------------------------------- |
| TCP       | 2379-2380 | Servidores   | Servidores   | Necessário apenas para HA com etcd embutido                   |
| TCP       | 6443      | Agentes      | Servidores   | Supervisor do K3s e Servidor de API do Kubernetes             |
| UDP       | 8472      | Todos os nós | Todos os nós | Necessário apenas para Flannel VXLAN                          |
| TCP       | 10250     | Todos os nós | Todos os nós | Métricas do Kubelet                                           |
| UDP       | 51820     | Todos os nós | Todos os nós | Necessário apenas para Flannel Wireguard com IPv4             |
| UDP       | 51821     | Todos os nós | Todos os nós | Necessário apenas para Flannel Wireguard com IPv6             |
| TCP       | 5001      | Todos os nós | Todos os nós | Necessário apenas para registro distribuído embutido (Spegel) |
| TCP       | 6443      | Todos os nós | Todos os nós | Necessário apenas para registro distribuído embutido (Spegel) |

Normalmente, todo o tráfego de saída é permitido.

Alterações adicionais no firewall podem ser necessárias dependendo do sistema operacional utilizado.

## Clusters Grandes

Os requisitos de hardware dependem do tamanho do seu cluster K3s. Para produção e clusters grandes, recomendamos o uso de uma configuração de alta disponibilidade com um banco de dados externo. As seguintes opções são recomendadas para o banco de dados externo em produção:

- MySQL
- PostgreSQL
- etcd

### CPU e Memória

A seguir estão os requisitos mínimos de CPU e memória para os nós em um servidor K3s de alta disponibilidade:

| Tamanho da Implantação |   Nodes   | vCPUs |  RAM  |
| :--------------------: | :-------: | :---: | :---: |
|        Pequeno         | Up to 10  |   2   | 4 GB  |
|         Médio          | Up to 100 |   4   | 8 GB  |
|         Large          | Up to 250 |   8   | 16 GB |
|        X-Grande        | Up to 500 |  16   | 32 GB |
|       XX-Grande        |   500+    |  32   | 64 GB |

### Discos

O desempenho do cluster depende do desempenho do banco de dados. Para garantir velocidade ideal, recomendamos sempre usar discos SSD para suportar seu cluster K3s. Em provedores de nuvem, também é recomendável usar o tamanho mínimo que permita o máximo de IOPS.

### Rede

Deve-se considerar o aumento do tamanho do sub-rede para o CIDR do cluster para evitar a falta de IPs para os pods. Isso pode ser feito passando a opção `--cluster-cidr` ao servidor K3s durante a inicialização.

### Banco de Dados

O K3s suporta diferentes bancos de dados, incluindo MySQL, PostgreSQL, MariaDB e etcd. Consulte [Cluster Datastore](../datastore/datastore.md) para mais informações.

A seguir está um guia de dimensionamento para os recursos de banco de dados necessários para executar clusters grandes:

| Tamanho da Implantação |   Nodes   | vCPUs |  RAM  |
| :--------------------: | :-------: | :---: | :---: |
|        Pequeno         | Up to 10  |   1   | 2 GB  |
|         Médio          | Up to 100 |   2   | 8 GB  |
|         Grande         | Up to 250 |   4   | 16 GB |
|        X-Grande        | Up to 500 |   8   | 32 GB |
|       XX-Grande        |   500+    |  16   | 64 GB |
