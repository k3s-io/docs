---
title: "Serviços de Rede"
---

Esta página explica como o CoreDNS, o controlador Traefik Ingress, o controlador de política de rede e o controlador do balanceador de carga ServiceLB funcionam no K3s.

Consulte a página [Opções de rede de instalação](./basic-network-options.md) para obter detalhes sobre as opções de configuração do Flannel e seleção de backend, ou como configurar seu próprio CNI.

Para obter informações sobre quais portas precisam ser abertas para K3s, consulte os [Requisitos de rede](../installation/requirements.md#networking).

## CoreDNS

O CoreDNS é implantado automaticamente na inicialização do servidor. Para desabilitá-lo, configure todos os servidores no cluster com a opção `--disable=coredns`.

Se você não instalar o CoreDNS, precisará instalar um provedor de DNS de cluster.

## Traefik Ingress Controller

[Traefik](https://traefik.io/) é um proxy reverso HTTP moderno e balanceador de carga feito para implementar microsserviços com facilidade. Ele simplifica a complexidade da rede ao projetar, implementar e executar aplicativos.

O controlador de entrada do Traefik implanta um serviço LoadBalancer que usa as portas 80 e 443 e anuncia os IPs externos do serviço LoadBalancer no status dos recursos de entrada que ele gerencia.

Por padrão, o ServiceLB usará todos os nós no cluster para hospedar o Traefik LoadBalancer Service, o que significa que as portas 80 e 443 não poderão ser usadas por outros pods HostPort ou NodePort, e o status dos recursos do Ingress mostrará todos os IPs de nós dos membros do cluster.

Para restringir os nós usados ​​pelo Traefik e, por extensão, os IPs dos nós anunciados no status de entrada, você pode seguir as instruções na seção [Controlando a seleção de nós do ServiceLB](#controlling-servicelb-node-selection) abaixo para limitar em quais nós o ServiceLB é executado ou adicionar alguns nós a um pool do LoadBalancer e restringir o serviço Traefik a esse pool definindo rótulos correspondentes no Traefik HelmChartConfig.

O Traefik é implantado por padrão ao iniciar o servidor. Para mais informações, consulte [Gerenciando Componentes Empacotados](../installation/packaged-components.md). O arquivo de configuração padrão é encontrado em `/var/lib/rancher/k3s/server/manifests/traefik.yaml`.

O arquivo `traefik.yaml` não deve ser editado manualmente, pois o K3s substituirá o arquivo pelos padrões na inicialização. Em vez disso, você deve personalizar o Traefik criando um manifesto `HelmChartConfig` adicional em `/var/lib/rancher/k3s/server/manifests`. Para mais detalhes e um exemplo, consulte [Personalizando componentes empacotados com HelmChartConfig](../helm.md#customizing-packaged-components-with-helmchartconfig). Para mais informações sobre os possíveis valores de configuração, consulte os [Parâmetros de configuração do Traefik Helm.](https://github.com/traefik/traefik-helm-chart/tree/master/traefik).

Para remover o Traefik do seu cluster, inicie todos os servidores com o sinalizador `--disable=traefik`.

O K3s inclui o Traefik v2. As versões 1.21 a 1.30 do K3s instalam o Traefik v2, a menos que uma instalação existente do Traefik v1 seja encontrada, caso em que o Traefik não é atualizado para a v2. As versões 1.20 e anteriores do K3s incluem o Traefik v1. Para obter mais informações sobre a versão específica do Traefik incluída no K3s, consulte as Notas de versão da sua versão.

Para migrar de uma instância mais antiga do Traefik v1, consulte a [documentação do Traefik](https://doc.traefik.io/traefik/migration/v1-to-v2/) e a [ferramenta de migração](https://github.com/traefik/traefik-migration-tool).

## Controlador de Política de Rede

O K3s inclui um controlador de política de rede incorporado. A implementação subjacente é a biblioteca do controlador netpol do [kube-router](https://github.com/cloudnativelabs/kube-router) (nenhuma outra funcionalidade do kube-router está presente) e pode ser encontrada [aqui](https://github.com/k3s-io/k3s/tree/master/pkg/agent/netpol).

Para desativá-lo, inicie cada servidor com o sinalizador `--disable-network-policy`.

:::note
As regras de iptables de política de rede não são removidas se a configuração do K3s for alterada para desabilitar o controlador de política de rede. Para limpar as regras de política de rede configuradas do kube-router após desabilitar o controlador de política de rede, use o script `k3s-killall.sh` ou limpe-as usando `iptables-save` e `iptables-restore`. Essas etapas devem ser executadas manualmente em todos os nós do cluster.
```
iptables-save | grep -v KUBE-ROUTER | iptables-restore
ip6tables-save | grep -v KUBE-ROUTER | ip6tables-restore
```
:::

## Serviço de Balanceador de Carga

Qualquer controlador LoadBalancer pode ser implantado no seu cluster K3s. Por padrão, o K3s fornece um balanceador de carga conhecido como [ServiceLB](https://github.com/k3s-io/klipper-lb) (anteriormente Klipper LoadBalancer) que usa portas de host disponíveis.

O Kubernetes Upstream permite que Serviços do tipo LoadBalancer sejam criados, mas não inclui uma implementação de balanceador de carga padrão, então esses serviços permanecerão `pendentes` até que um seja instalado. Muitos serviços hospedados exigem um provedor de nuvem, como Amazon EC2 ou Microsoft Azure, para oferecer uma implementação de balanceador de carga externo. Por outro lado, o K3s ServiceLB torna possível usar Serviços LoadBalancer sem um provedor de nuvem ou qualquer configuração adicional.

### Como Funciona o ServiceLB

O controlador ServiceLB monitora os [Serviços](https://kubernetes.io/docs/concepts/services-networking/service/) do Kubernetes com o campo `spec.type` definido como `LoadBalancer`.

Para cada LoadBalancer Service, um [DaemonSet](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/) é criado no namespace `kube-system`. Este DaemonSet, por sua vez, cria ServiceLB Pods com um prefixo `svc-`, em cada nó. Esses pods aproveitam o hostPort usando a porta de serviço, portanto, eles só serão implantados em nós que tenham essa porta disponível. Se não houver nenhum nó com essa porta disponível, o LB permanecerá Pendente. Observe que é possível expor vários Serviços no mesmo nó, desde que usem portas diferentes.

Quando o ServiceLB Pod é executado em um nó que tem um IP externo configurado, o IP externo do nó é preenchido na lista de endereços `status.loadBalancer.ingress` do Service com `ipMode: VIP`. Caso contrário, o IP interno do nó é usado.

Se o tráfego para o IP externo estiver sujeito a [Network Address Translation (NAT)](https://en.wikipedia.org/wiki/Network_address_translation) - por exemplo, em nuvens públicas ao usar o IP público do nó como IP externo - o tráfego é roteado para o pod ServiceLB via hostPort. O pod então usa iptables para encaminhar o tráfego para o endereço ClusterIP e porta do Service. Se o tráfego não estiver sujeito a NAT e, em vez disso, chegar com endereço de destino correspondente ao endereço LoadBalancer, o tráfego é interceptado (normalmente por kube-proxy iptables chains ou ipvs) e encaminhado para o endereço ClusterIP e porta do Service.

### Uso

Crie um [Serviço do tipo LoadBalancer](https://kubernetes.io/docs/concepts/services-networking/service/#loadbalancer) no K3s.

:::warning Nota de Versão
Se o tráfego externo atingir o nó usando um NAT (por exemplo, em nuvens públicas) e você precisar de `externalTrafficPolicy=local` para fins como preservação de IP de origem do cliente, não defina a configuração do k3s `node-external-ip` para nenhum dos nós, pois isso não funcionará corretamente.
:::

### Controlando a Seleção do Nó ServiceLB

Adicionar o rótulo `svccontroller.k3s.cattle.io/enablelb=true` a um ou mais nós alterna o controlador ServiceLB para o modo de lista de permissões, onde apenas nós com o rótulo são elegíveis para hospedar pods do LoadBalancer. Os nós que permanecerem sem rótulo serão excluídos do uso pelo ServiceLB.

:::note
Por padrão, os nós não são rotulados. Enquanto todos os nós permanecerem sem rótulo, todos os nós com portas disponíveis serão usados ​​pelo ServiceLB.
:::

### Criando pools de Nós do ServiceLB
Para selecionar um subconjunto específico de nós para hospedar pods para um LoadBalancer, adicione o rótulo `enablelb` aos nós desejados e defina valores de rótulo `lbpool` correspondentes nos nós e serviços. Por exemplo:

1. Rotule o Nó A e o Nó B com `svccontroller.k3s.cattle.io/lbpool=pool1` e `svccontroller.k3s.cattle.io/enablelb=true`
2. Rotule o Nó C e o Nó D com `svccontroller.k3s.cattle.io/lbpool=pool2` e `svccontroller.k3s.cattle.io/enablelb=true`
3. Crie um Serviço LoadBalancer na porta 443 com o rótulo `svccontroller.k3s.cattle.io/lbpool=pool1`. O DaemonSet para este serviço implanta Pods apenas no Nó A e no Nó B.
4. Crie outro Serviço LoadBalancer na porta 443 com o rótulo `svccontroller.k3s.cattle.io/lbpool=pool2`. O DaemonSet implantará Pods somente no Nó C e no Nó D.

### Desabilitando o ServiceLB

Para desabilitar o ServiceLB, configure todos os servidores no cluster com o sinalizador `--disable=servicelb`.

Isso é necessário se você deseja executar um LB diferente, como o MetalLB.

## Implantando um Gerenciador de Controlhe de Nuvem Externo

Para reduzir o tamanho binário, o K3s remove todos os provedores de nuvem "na árvore" (integrados). Em vez disso, o K3s fornece um stub do Cloud Controller Manager (CCM) incorporado que faz o seguinte:
- Define os campos de endereço InternalIP e ExternalIP do nó com base nos sinalizadores `--node-ip` e `--node-external-ip`.
- Hospeda o controlador ServiceLB LoadBalancer.
- Limpa a contaminação `node.cloudprovider.kubernetes.io/uninitialized` que está presente quando o provedor de nuvem é definido como `external`

Antes de implantar um CCM externo, você deve iniciar todos os servidores K3s com o sinalizador `--disable-cloud-controller` para desabilitar o CCM incorporado.

:::note
Se você desabilitar o CCM integrado e não implantar e configurar corretamente um substituto externo, os nós permanecerão contaminados e não programáveis.
:::