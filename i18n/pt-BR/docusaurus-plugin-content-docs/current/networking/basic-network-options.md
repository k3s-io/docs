---
title: "Opções Básicas de Rede"
---

Esta página descreve as opções de configuração de rede do K3s, incluindo configuração ou substituição do Flannel e configuração de IPv6 ou dualStack.

## Opções de Flannel

[Flannel](https://github.com/flannel-io/flannel/blob/master/README.md) é um provedor leve de malha de rede de camada 3 que implementa a Kubernetes Container Network Interface (CNI). É o que é comumente chamado de CNI Plugin.

* As opções de flanela só podem ser definidas em nós de servidor e devem ser idênticas em todos os servidores do cluster.
* O backend padrão para Flannel é `vxlan`. Para habilitar a criptografia, use o backend `wireguard-native`.
* Usar `vxlan` no Rasperry Pi com versões recentes do Ubuntu requer [preparação adicional](../installation/requirements.md?os=pi#operating-systems).
* Usar `wireguard-native` como backend Flannel pode exigir módulos adicionais em algumas distribuições Linux. Consulte o [Guia de instalação do WireGuard](https://www.wireguard.com/install/) para obter detalhes.
  As etapas de instalação do WireGuard garantirão que os módulos do kernel apropriados sejam instalados para seu sistema operacional.
  Você deve garantir que os módulos do kernel do WireGuard estejam disponíveis em todos os nós, tanto servidores quanto agentes, antes de tentar usar o backend do WireGuard Flannel.


| CLI Flag e Valor                     | Descrição                                                                                                                                                                                 |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--flannel-ipv6-masq`                | Aplique regras de mascaramento ao tráfego IPv6 (padrão para IPv4). Aplica-se somente em clusters dual-stack ou somente IPv6. Compatível com qualquer backend Flannel diferente de `none`. |
| `--flannel-external-ip`              | Use endereços IP externos do nó como o destino para o tráfego Flannel, em vez de IPs internos. Aplica-se somente quando --node-external-ip é definido em um nó.                           |
| `--flannel-backend=vxlan`            | Use VXLAN para encapsular os pacotes. Pode exigir módulos de kernel adicionais no Raspberry Pi.                                                                                           |
| `--flannel-backend=host-gw`          | Use rotas IP para podar sub-redes por meio de IPs de nó. Requer conectividade direta de camada 2 entre todos os nós no cluster.                                                           |
| `--flannel-backend=wireguard-native` | Use WireGuard para encapsular e criptografar tráfego de rede. Pode exigir módulos de kernel adicionais.                                                                                   |
| `--flannel-backend=ipsec`            | Use strongSwan IPSec por meio do binário `swanctl` para criptografar o tráfego de rede. (Obsoleto; será removido na v1.27.0)                                                              |
| `--flannel-backend=none`             | Desabilite o Flannel completamente.                                                                                                                                                       |

:::info Nota de Versão

O K3s não inclui mais os binários strongSwan `swanctl` e `charon` a partir das versões 2022-12 (v1.26.0+k3s1, v1.25.5+k3s1, v1.24.9+k3s1, v1.23.15+k3s1). Instale os pacotes corretos no seu nó antes de atualizar ou instalar essas versões se quiser usar o backend `ipsec`.

:::

### Migrando de `wireguard` ou `ipsec` para `wireguard-native`

O backend `wireguard` legado requer a instalação da ferramenta `wg` no host. Este backend não está disponível no K3s v1.26 e superior, em favor do backend `wireguard-native`, que faz interface direta com o kernel.

O backend legado `ipsec` requer a instalação dos binários `swanctl` e `charon` no host. Este backend não está disponível no K3s v1.27 e superior, em favor do backend `wireguard-native`.

Recomendamos que os usuários migrem para o novo backend o mais rápido possível. A migração requer um curto período de inatividade enquanto os nós surgem com a nova configuração. Você deve seguir estas duas etapas:

1. Atualize a configuração do K3s em todos os nós do servidor. Se estiver usando arquivos de configuração, o `/etc/rancher/k3s/config.yaml` deve incluir `flannel-backend: wireguard-native` em vez de `flannel-backend: wireguard` ou `flannel-backend: ipsec`. Se estiver configurando o K3s por meio de sinalizadores CLI na unidade systemd, os sinalizadores equivalentes devem ser alterados.
2. Reinicie todos os nós, começando pelos servidores.

## CNI Customizado

Inicie o K3s com `--flannel-backend=none` e instale o CNI de sua escolha. A maioria dos plugins CNI vem com seu próprio mecanismo de política de rede, então é recomendado definir `--disable-network-policy` também para evitar conflitos. Algumas informações importantes a serem consideradas:

<Tabs queryString="cni">
<TabItem value="Canal" default>

Visite o site [Canal Docs](https://docs.tigera.io/calico/latest/getting-started/kubernetes/flannel/install-for-flannel#installing-calico-for-policy-and-flannel-aka-canal-for-networking). Siga as etapas para instalar o Canal. Modifique o YAML do Canal para que o encaminhamento de IP seja permitido na seção `container_settings`, por exemplo:

```yaml
"container_settings": {
  "allow_ip_forwarding": true
}
```

Aplique o Canal YAML.

Garanta que as configurações foram aplicadas executando o seguinte comando no host:

```bash
cat /etc/cni/net.d/10-canal.conflist
```

Você deverá ver que o encaminhamento de IP está definido como verdadeiro.

</TabItem>
<TabItem value="Calico" default>

Siga o [Guia de plugins Calico CNI](https://docs.tigera.io/calico/latest/reference/configure-cni-plugins). Modifique o Calico YAML para que o encaminhamento de IP seja permitido na seção `container_settings`, por exemplo:

```yaml
"container_settings": {
  "allow_ip_forwarding": true
}
```

Aplique o Calico YAML.

Garanta que as configurações foram aplicadas executando o seguinte comando no host:

```bash
cat /etc/cni/net.d/10-calico.conflist
```

Você deverá ver que o encaminhamento de IP está definido como verdadeiro.


</TabItem>
<TabItem value="Cilium" default>

Antes de executar `k3s-killall.sh` ou `k3s-uninstall.sh`, você deve remover manualmente as interfaces `cilium_host`, `cilium_net` e `cilium_vxlan`. Se você não fizer isso, poderá perder a conectividade de rede com o host quando o K3s for interrompido

```bash
ip link delete cilium_host
ip link delete cilium_net
ip link delete cilium_vxlan
```

Além disso, as regras do iptables para cilium devem ser removidas:

```bash
iptables-save | grep -iv cilium | iptables-restore
ip6tables-save | grep -iv cilium | ip6tables-restore
```

</TabItem>
</Tabs>

## Configuração Control-Plane Egress Selector

Os agentes e servidores K3s mantêm túneis websocket entre nós que são usados ​​para encapsular a comunicação bidirecional entre os componentes do plano de controle (apiserver) e do agente (kubelet e containerd).
Isso permite que os agentes operem sem expor as portas de streaming do tempo de execução do kubelet e do contêiner a conexões de entrada, e que o plano de controle se conecte aos serviços de cluster ao operar com o agente desabilitado.
Essa funcionalidade é equivalente ao serviço [Konnectivity](https://kubernetes.io/docs/tasks/extend-kubernetes/setup-konnectivity/) comumente usado em outras distribuições do Kubernetes, e é gerenciado por meio da configuração do seletor de saída do apiserver.

O modo padrão é `agent`. Os modos `pod` ou `cluster` são recomendados ao executar [servidores sem agente](../advanced.md#running-agentless-servers-experimental), para fornecer ao apiserver acesso aos pontos de extremidade do serviço de cluster na ausência de flannel e kube-proxy.

O modo seletor de saída pode ser configurado em servidores por meio do sinalizador `--egress-selector-mode` e oferece quatro modos:
* `disabled`: o apiserver não usa túneis de agente para se comunicar com kubelets ou endpoints de cluster.
Este modo requer que os servidores executem o kubelet, CNI e kube-proxy e tenham conectividade direta com agentes, ou o apiserver não poderá acessar endpoints de serviço ou executar `kubectl exec` e `kubectl logs`.
* `agent` (padrão): o apiserver usa túneis de agente para se comunicar com kubelets.
Este modo requer que os servidores também executem o kubelet, CNI e kube-proxy, ou o apiserver não poderá acessar endpoints de serviço.
* `pod`: o apiserver usa túneis de agente para se comunicar com kubelets e endpoints de serviço, roteando conexões de endpoint para o agente correto observando Nodes e Endpoints.
**NOTA**: Este modo não funcionará ao usar um CNI que usa seu próprio IPAM e não respeita a alocação de PodCIDR do nó. O modo `cluster` ou `agent` deve ser usado com esses CNIs.
* `cluster`: O apiserver usa túneis de agente para se comunicar com kubelets e endpoints de serviço, roteando conexões de endpoint para o agente correto observando Pods e Endpoints. Este modo tem a maior portabilidade entre diferentes configurações de cluster, ao custo de maior sobrecarga.

## Rede Dual-stack (IPv4 + IPv6)

:::info Nota de Versão

O suporte experimental está disponível a partir de [v1.21.0+k3s1](https://github.com/k3s-io/k3s/releases/tag/v1.21.0%2Bk3s1).
O suporte estável está disponível a partir de [v1.23.7+k3s1](https://github.com/k3s-io/k3s/releases/tag/v1.23.7%2Bk3s1).

:::

:::warning Problema Conhecido

Antes da versão 1.27, o Kubernetes [Problema nº 111695](https://github.com/kubernetes/kubernetes/issues/111695) faz com que o Kubelet ignore os endereços IPv6 do nó se você tiver um ambiente dual-stack e não estiver usando a interface de rede primária para tráfego de cluster. Para evitar esse bug, use a versão 1.27 ou mais recente ou adicione o seguinte sinalizador aos servidores e agentes do K3s:

```
--kubelet-arg="node-ip=0.0.0.0" # Para priorizar o tráfego IPv4
#OR
--kubelet-arg="node-ip=::" # Para priorizar o tráfego IPv6
```

:::

A rede dual-stack deve ser configurada quando o cluster é criado pela primeira vez. Ela não pode ser habilitada em um cluster existente depois que ele foi iniciado como IPv4-only.

Para habilitar dual-stack no K3s, você deve fornecer dual-stack válido `cluster-cidr` e `service-cidr` em todos os nós do servidor. Este é um exemplo de uma configuração válida:

```
--cluster-cidr=10.42.0.0/16,2001:cafe:42::/56 --service-cidr=10.43.0.0/16,2001:cafe:43::/112
```

Observe que você pode configurar quaisquer valores válidos de `cluster-cidr` e `service-cidr`, mas as máscaras acima são recomendadas. Se você alterar a máscara `cluster-cidr`, também deverá alterar os valores `node-cidr-mask-size-ipv4` e `node-cidr-mask-size-ipv6` para corresponder aos pods planejados por nó e à contagem total de nós. A maior máscara `service-cidr` suportada é /12 para IPv4 e /112 para IPv6. Lembre-se de permitir tráfego IPv6 se estiver implantando em uma nuvem pública.

Ao usar endereços IPv6 que não são roteados publicamente, por exemplo, no intervalo ULA, você pode adicionar a opção `--flannel-ipv6-masq` para habilitar o NAT IPv6, pois por padrão os pods usam seus endereços IPv6 para tráfego de saída.

Se você estiver usando um plugin CNI personalizado, ou seja, um plugin CNI diferente do Flannel, a configuração adicional pode ser necessária. Consulte a documentação dual-stack do seu plugin e verifique se as políticas de rede podem ser habilitadas.

:::warning Problema Conhecido
Ao definir cluster-cidr e service-cidr com IPv6 como a família primária, o node-ip de todos os membros do cluster deve ser explicitamente definido, colocando o endereço IPv6 desejado do node como o primeiro endereço. Por padrão, o kubelet sempre usa IPv4 como a família de endereços primária.
:::

## Rede Single-stack IPv6

:::info Nota de Versão
Disponível a partir de [v1.22.9+k3s1](https://github.com/k3s-io/k3s/releases/tag/v1.22.9%2Bk3s1)
:::

:::warning Problema Conhecido
Se sua rota padrão IPv6 for definida por um anúncio de roteador (RA), você precisará definir o sysctl `net.ipv6.conf.all.accept_ra=2`; caso contrário, o nó descartará a rota padrão quando ela expirar. Esteja ciente de que aceitar RAs pode aumentar o risco de [ataques man-in-the-middle](https://github.com/kubernetes/kubernetes/issues/91507).
:::

Clusters IPv6 single-stack (clusters sem IPv4) são suportados em K3s usando os flags `--cluster-cidr` e `--service-cidr`. Este é um exemplo de uma configuração válida:

```bash
--cluster-cidr=2001:cafe:42::/56 --service-cidr=2001:cafe:43::/112
```

Ao usar endereços IPv6 que não são roteados publicamente, por exemplo, no intervalo ULA, você pode adicionar a opção `--flannel-ipv6-masq` para habilitar o NAT IPv6, pois por padrão os pods usam seus endereços IPv6 para tráfego de saída.

## Nós Sem um Nome de Host

Alguns provedores de nuvem, como Linode, criarão máquinas com "localhost" como nome do host e outros podem não ter um nome de host definido. Isso pode causar problemas com a resolução do nome de domínio. Você pode executar o K3s com o sinalizador `--node-name` ou a variável de ambiente `K3S_NODE_NAME` e isso passará o nome do nó para resolver esse problema.

