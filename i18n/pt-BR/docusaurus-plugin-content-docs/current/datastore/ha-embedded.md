---
title: "Alta Disponibilidade Incorporada etcd"
---

:::warning
O etcd (HA) incorporado pode ter problemas de desempenho em discos mais lentos, como Raspberry Pis, executados com cartões SD.
:::

<details>
<summary>Por que um número ímpar de nós de servidor?</summary>

O cluster etcd incorporado HA deve ser composto por um número ímpar de nós de servidor para que o etcd mantenha o quorum. Para um cluster com n servidores, o quorum é (n/2)+1. Para qualquer cluster de tamanho ímpar, adicionar um nó sempre aumentará o número de nós necessários para o quorum. Embora adicionar um nó a um cluster de tamanho ímpar pareça melhor, pois há mais máquinas, a tolerância a falhas é pior, pois exatamente o mesmo número de nós pode falhar sem perder o quorum, mas há mais nós que podem falhar.

</details>

Um cluster HA K3s com etcd incorporado é composto de:

- Três ou mais **nós de servidor** que servirão a API do Kubernetes e executarão outros serviços de plano de controle, bem como hospedarão o armazenamento de dados etcd incorporado.
- Opcional: Zero ou mais **nós de agente** que são designados para executar seus aplicativos e serviços
- Opcional: Um **endereço de registro fixo** para nós de agente se registrarem no cluster

:::note
Para implantar rapidamente grandes clusters de HA, consulte [Projetos Relacionados](../related-projects.md)
:::

Para começar, primeiro inicie um nó de servidor com o sinalizador `cluster-init` para habilitar o cluster e um token que será usado como um segredo compartilhado para unir servidores adicionais ao cluster.

```bash
curl -sfL https://get.k3s.io | K3S_TOKEN=SECRET sh -s - server \
    --cluster-init \
    --tls-san=<FIXED_IP> # Opcional, necessário se estiver usando um endereço de registro fixo
```

Após iniciar o primeiro servidor, junte o segundo e o terceiro servidores ao cluster usando o segredo compartilhado:

```bash
curl -sfL https://get.k3s.io | K3S_TOKEN=SECRET sh -s - server \
    --server https://<ip or hostname of server1>:6443 \
    --tls-san=<FIXED_IP> # Opcional, necessário se estiver usando um endereço de registro fixo
```

Verifique se o segundo e o terceiro servidores agora fazem parte do cluster:

```bash
$ kubectl get nodes
NAME        STATUS   ROLES                       AGE   VERSION
server1     Ready    control-plane,etcd,master   28m   vX.Y.Z
server2     Ready    control-plane,etcd,master   13m   vX.Y.Z
server3     Ready    control-plane,etcd,master   10m   vX.Y.Z
```

Agora você tem um plano de controle altamente disponível. Qualquer servidor agrupado com sucesso pode ser usado no argumento `--server` para unir nós de servidor e agente adicionais. Unir nós de agente adicionais ao cluster segue o mesmo procedimento dos servidores:

```bash
curl -sfL https://get.k3s.io | K3S_TOKEN=SECRET sh -s - agent --server https://<ip or hostname of server>:6443
```

Existem alguns sinalizadores de configuração que devem ser os mesmos em todos os nós do servidor:

- Sinalizadores relacionados à rede: `--cluster-dns`, `--cluster-domain`, `--cluster-cidr`, `--service-cidr`
- Sinalizadores que controlam a implantação de certos componentes: `--disable-helm-controller`, `--disable-kube-proxy`, `--disable-network-policy` e qualquer componente passado para `--disable`
- Sinalizadores relacionados ao recurso: `--secrets-encryption`

## Clusters de Nó Único

:::info Nota de Versão
Disponível a partir de [v1.22.2+k3s1](https://github.com/k3s-io/k3s/releases/tag/v1.22.2%2Bk3s1)
:::

Se você tiver um cluster existente usando o banco de dados SQLite incorporado padrão, você pode convertê-lo para etcd simplesmente reiniciando seu servidor K3s com o sinalizador `--cluster-init`. Depois de fazer isso, você poderá adicionar instâncias adicionais conforme descrito acima.

Se um armazenamento de dados etcd for encontrado no disco porque esse nó já foi inicializado ou se juntou a um cluster, os argumentos do armazenamento de dados (`--cluster-init`, `--server`, `--datastore-endpoint`, etc.) serão ignorados.