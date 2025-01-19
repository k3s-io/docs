---
title: Banco de Dados Externo de Alta Disponibilidade
---

Esta seção descreve como instalar um cluster K3s de alta disponibilidade com um banco de dados externo.

:::note
Para implantar rapidamente grandes clusters de HA, consulte [Projetos Relacionados](/related-projects)
:::

Clusters de servidor único podem atender a uma variedade de casos de uso, mas para ambientes onde o tempo de atividade do plano de controle do Kubernetes é crítico, você pode executar o K3s em uma configuração de HA. Um cluster de HA K3s é composto de:

- Dois ou mais **nós de servidor** que servirão a API do Kubernetes e executarão outros serviços de plano de controle
- Um **armazenamento de dados externo** (em oposição ao armazenamento de dados SQLite incorporado usado em configurações de servidor único)
- Opcional: Zero ou mais **nós de agente** que são designados para executar seus aplicativos e serviços
- Opcional: Um **endereço de registro fixo** para nós de agente se registrarem no cluster

Para mais detalhes sobre como esses componentes funcionam juntos, consulte a [seção de arquitetura.](../architecture.md#high-availability-k3s)

## Esboço da Instalação

A configuração de um cluster HA requer as seguintes etapas:

### 1. Criar um Armazenamento de Datastore

Primeiro, você precisará criar um datastore externo para o cluster. Veja a documentação [Cluster Datastore Options](datastore.md) para mais detalhes.

### 2. Inicialização Nós do Servidor

O K3s requer dois ou mais nós de servidor para esta configuração de HA. Consulte o guia [Requirements](../installation/requirements.md) para obter os requisitos mínimos da máquina.

Ao executar o comando `k3s server` nesses nós, você deve definir o parâmetro `datastore-endpoint` para que o K3s saiba como se conectar ao datastore externo. O parâmetro `token` também pode ser usado para definir um token determinístico ao adicionar nós. Quando vazio, esse token será gerado automaticamente para uso posterior.

Por exemplo, um comando como o seguinte pode ser usado para instalar o servidor K3s com um banco de dados MySQL como armazenamento de dados externo e [definir um token](../cli/server.md#cluster-options):

```bash
curl -sfL https://get.k3s.io | sh -s - server \
  --token=SECRET \
  --datastore-endpoint="mysql://username:password@tcp(hostname:3306)/database-name" \
  --tls-san=<FIXED_IP> # Opcional, necessário se estiver usando um endereço de registro fixo
```

O formato do ponto de extremidade do datastore difere com base no tipo de banco de dados. Para obter detalhes, consulte a seção sobre [formatos de ponto de extremidade do datastore.](../datastore/datastore.md#datastore-endpoint-format-and-functionality)

Para configurar certificados TLS ao iniciar nós de servidor, consulte o [guia de configuração do datastore.](../datastore/datastore.md#external-datastore-configuration-parameters)

:::note
As mesmas opções de instalação disponíveis para instalações de servidor único também estão disponíveis para instalações de alta disponibilidade. Para mais detalhes, consulte a documentação [Configuration Options](../installation/configuration.md).
:::

Por padrão, os nós do servidor serão agendáveis ​​e, portanto, suas cargas de trabalho poderão ser iniciadas neles. Se você deseja ter um plano de controle dedicado onde nenhuma carga de trabalho do usuário será executada, você pode usar taints. O parâmetro `node-taint` permitirá que você configure nós com taints, por exemplo `--node-taint CriticalAddonsOnly=true:NoExecute`.

Depois de iniciar o processo `k3s server` em todos os nós do servidor, certifique-se de que o cluster tenha sido iniciado corretamente com `k3s kubectl get nodes`. Você deve ver os nós do servidor no estado Ready.

### 3. Opcional: Adicione a Nós de Servidor

O mesmo comando de exemplo na Etapa 2 pode ser usado para unir nós de servidor adicionais, onde o token do primeiro nó precisa ser usado.

Se o primeiro nó do servidor foi iniciado sem o sinalizador CLI `--token` ou a variável `K3S_TOKEN`, o valor do token pode ser recuperado de qualquer servidor já associado ao cluster:

```bash
cat /var/lib/rancher/k3s/server/token
```

Nós de servidor adicionais podem ser adicionados [usando o token](../cli/server.md#cluster-options):

```bash
curl -sfL https://get.k3s.io | sh -s - server \
  --token=SECRET \
  --datastore-endpoint="mysql://username:password@tcp(hostname:3306)/database-name"
```

Existem alguns sinalizadores de configuração que devem ser os mesmos em todos os nós do servidor:

- Sinalizadores relacionados à rede: `--cluster-dns`, `--cluster-domain`, `--cluster-cidr`, `--service-cidr`
- Sinalizadores que controlam a implantação de certos componentes: `--disable-helm-controller`, `--disable-kube-proxy`, `--disable-network-policy` e qualquer componente passado para `--disable`
- Sinalizadores relacionados ao recurso: `--secrets-encryption`

:::note
Certifique-se de manter uma cópia deste token, pois ele é necessário ao restaurar do backup e adicionar nós. Anteriormente, o K3s não impunha o uso de um token ao usar datastores SQL externos.
:::

### 4. Opcional: Configurar um Endereço de Registro Fixo

Os nós de agente precisam de uma URL para registrar. Pode ser o IP ou o nome do host de qualquer nó de servidor, mas em muitos casos eles podem mudar ao longo do tempo. Por exemplo, se estiver executando seu cluster em uma nuvem que suporta grupos de dimensionamento, os nós podem ser criados e destruídos ao longo do tempo, mudando para IPs diferentes do conjunto inicial de nós de servidor. Seria melhor ter um ponto de extremidade estável na frente dos nós de servidor que não mudará ao longo do tempo. Este ponto de extremidade pode ser configurado usando qualquer número de abordagens, como:

- Um balanceador de carga de camada 4 (TCP)
- DNS round-robin
- Endereços IP virtuais ou elásticos

Consulte [Cluster Loadbalancer](./cluster-loadbalancer.md) para obter exemplos de configurações.

Este endpoint também pode ser usado para acessar a API do Kubernetes. Então você pode, por exemplo, modificar seu arquivo [kubeconfig](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/) para apontar para ele em vez de um nó específico.

Para evitar erros de certificado em tal configuração, você deve configurar o servidor com a opção `--tls-san=YOUR_IP_OR_HOSTNAME_HERE`. Esta opção adiciona um nome de host ou IP adicional como um Nome Alternativo de Assunto no certificado TLS, e pode ser especificado várias vezes se você quiser acessar por meio do IP e do nome do host.

### 5. Opcional: Adicione Nós de Agentes

Como os nós do servidor K3s são programáveis ​​por padrão, nós de agente não são necessários para um cluster HA K3s. No entanto, você pode desejar ter nós de agente dedicados para executar seus aplicativos e serviços.

Unir nós de agente em um cluster HA é o mesmo que unir nós de agente em um único cluster de servidor. Você só precisa especificar a URL na qual o agente deve se registrar (um dos IPs do servidor ou um endereço de registro fixo) e o token que ele deve usar.

```bash
K3S_TOKEN=SECRET k3s agent --server https://server-or-fixed-registration-address:6443
```
