---
title: Arquitetura
---

import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';

### Servers e Agents

* Um nó de servidor é definido como um host que executa o comando `k3s server`, com componentes de plano de controle e armazenamento de dados gerenciados pelo K3s.
* Um nó de agente é definido como um host executando o comando `k3s agent`, sem nenhum componente de armazenamento de dados ou plano de controle.
* Tanto os servidores quanto os agentes executam o kubelet, o tempo de execução do contêiner e o CNI. Consulte a documentação [Advanced Options](./advanced.md#running-agentless-servers-experimental) para obter mais informações sobre a execução de servidores sem agentes.

![](/img/how-it-works-k3s-revised.svg)

### Configuração de Servidor Único com um Banco de Dados Incorporado

O diagrama a seguir mostra um exemplo de um cluster que tem um servidor K3s de nó único com um banco de dados SQLite incorporado.

Nessa configuração, cada nó de agente é registrado no mesmo nó de servidor. Um usuário do K3s pode manipular recursos do Kubernetes chamando a API do K3s no nó de servidor.

<ThemedImage
  alt="Arquitetura K3s com um Único Servidor"
  sources={{
    light: useBaseUrl('/img/k3s-architecture-single-server.svg'),
    dark: useBaseUrl('/img/k3s-architecture-single-server-dark.svg'),
  }}
/>

### K3s de Alta Disponibilidade

Clusters de servidor único podem atender a uma variedade de casos de uso, mas para ambientes onde o tempo de atividade do plano de controle do Kubernetes é crítico, você pode executar o K3s em uma configuração de HA. Um cluster de HA K3s compreende:

<Tabs>
<TabItem value="Banco de Dados Incorporado">

* Três ou mais **nós de servidor** que servirão a API do Kubernetes e executarão outros serviços de plano de controle
* Um **armazenamento de dados etcd incorporado** (em oposição ao armazenamento de dados SQLite incorporado usado em configurações de servidor único)


<ThemedImage
  alt="Arquitetura K3s com Servidores de Alta Disponibilidade"
  sources={{
    light: useBaseUrl('/img/k3s-architecture-ha-embedded.svg'),
    dark: useBaseUrl('/img/k3s-architecture-ha-embedded-dark.svg'),
}} />

</TabItem>
<TabItem value="Banco de Dados Externo">

* Dois ou mais **nós de servidor** que servirão a API do Kubernetes e executarão outros serviços de plano de controle
* Um **armazenamento de dados externo** (como MySQL, PostgreSQL ou etcd)

<ThemedImage
  alt="Arquitetura K3s com Servidores de Alta Disponibilidade e um Banco de Dados Externo"
  sources={{
    light: useBaseUrl('/img/k3s-architecture-ha-external.svg'),
    dark: useBaseUrl('/img/k3s-architecture-ha-external-dark.svg'),
}} />

</TabItem>
</Tabs>

### Endereço de Registro Fixo para Nós de Agente

Na configuração do servidor de alta disponibilidade, cada nó também pode se registrar na API do Kubernetes usando um endereço de registro fixo, conforme mostrado no diagrama abaixo.

Após o registro, os nós do agente estabelecem uma conexão diretamente com um dos nós do servidor.

<ThemedImage
  alt="Registro de Agente HA"
  sources={{
    light: useBaseUrl('/img/k3s-production-setup.svg'),
    dark: useBaseUrl('/img/k3s-production-setup-dark.svg'),
  }}
/>

### Como Funciona o Registro do Nó do Agente

Os nós do agente são registrados com uma conexão websocket iniciada pelo processo `k3s agent`, e a conexão é mantida por um balanceador de carga do lado do cliente em execução como parte do processo do agente. Inicialmente, o agente se conecta ao supervisor (e ao kube-apiserver) por meio do balanceador de carga local na porta 6443. O balanceador de carga mantém uma lista de endpoints disponíveis para conexão. O endpoint padrão (e inicialmente único) é semeado pelo nome do host do endereço `--server`. Depois de se conectar ao cluster, o agente recupera uma lista de endereços kube-apiserver da lista de endpoints de serviço do Kubernetes no namespace padrão. Esses endpoints são adicionados ao balanceador de carga, que então mantém conexões estáveis ​​com todos os servidores no cluster, fornecendo uma conexão com o kube-apiserver que tolera interrupções de servidores individuais.

Os agentes se registrarão no servidor usando o segredo do cluster de nós junto com uma senha gerada aleatoriamente para o nó, armazenada em `/etc/rancher/node/password`. O servidor armazenará as senhas para nós individuais como segredos do Kubernetes, e quaisquer tentativas subsequentes devem usar a mesma senha. Os segredos de senha do nó são armazenados no namespace `kube-system` com nomes usando o modelo `<host>.node-password.k3s`. Isso é feito para proteger a integridade dos IDs do nó.

Se o diretório `/etc/rancher/node` de um agente for removido, ou você desejar se juntar novamente a um nó usando um nome existente, o nó deve ser excluído do cluster. Isso limpará tanto a entrada do nó antigo quanto o segredo da senha do nó e permitirá que o nó (re)junte-se ao cluster.

Se você reutiliza nomes de host com frequência, mas não consegue remover os segredos de senha do nó, um ID de nó exclusivo pode ser automaticamente anexado ao nome de host ao iniciar servidores ou agentes K3s usando o sinalizador `--with-node-id`. Quando habilitado, o ID do nó também é armazenado em `/etc/rancher/node/`.
