---
title: "Opções de Configuração"
---

Esta página se concentra nas opções comumente usadas ao configurar o K3s pela primeira vez. Consulte a documentação sobre [Opções e Configuração Avançadas](../advanced.md) e a documentação dos comandos [server](../cli/server.md) e [agent](../cli/agent.md) para uma cobertura mais detalhada.

## Configuração com o script de instalação

Conforme mencionado no [Guia de Início Rápido](../quick-start.md), você pode usar o script de instalação disponível em https://get.k3s.io para instalar o K3s como um serviço em sistemas baseados em systemd e openrc.

Você pode usar uma combinação de `INSTALL_K3S_EXEC`, variáveis de ambiente `K3S_` e flags de comando para passar configurações para a configuração do serviço.
As variáveis de ambiente prefixadas, o valor de `INSTALL_K3S_EXEC` e os argumentos adicionais fornecidos no shell são todos persistidos na configuração do serviço. Após a instalação, a configuração pode ser alterada editando o arquivo de ambiente, modificando a configuração do serviço ou simplesmente executando novamente o instalador com novas opções.


Para ilustrar isso, os seguintes comandos resultam no mesmo comportamento: registrar um servidor sem o Flannel e com um token:

```bash
curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="server" sh -s - --flannel-backend none --token 12345
curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="server --flannel-backend none" K3S_TOKEN=12345 sh -s -
curl -sfL https://get.k3s.io | K3S_TOKEN=12345 sh -s - server --flannel-backend none
# O servidor é assumido abaixo porque não há K3S_URL
curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="--flannel-backend none --token 12345" sh -s -
curl -sfL https://get.k3s.io | sh -s - --flannel-backend none --token 12345
```

Ao registrar um agente, os seguintes comandos resultam no mesmo comportamento:

```bash
curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="agent --server https://k3s.example.com --token mypassword" sh -s -
curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="agent" K3S_TOKEN="mypassword" sh -s - --server https://k3s.example.com
curl -sfL https://get.k3s.io | K3S_URL=https://k3s.example.com sh -s - agent --token mypassword
curl -sfL https://get.k3s.io | K3S_URL=https://k3s.example.com K3S_TOKEN=mypassword sh -s - # O agente é assumido devido à presença de K3S_URL
```

Para detalhes sobre todas as variáveis de ambiente, consulte [Variáveis de Ambiente.](../reference/env-variables.md)

:::info Note
Se você definir configurações ao executar o script de instalação, mas não as definir novamente ao reexecutar o script, os valores originais serão perdidos.

O conteúdo do [arquivo de configuração](#configuration-file) não é gerenciado pelo script de instalação.
Se você deseja que sua configuração seja independente do script de instalação, deve usar um arquivo de configuração em vez de passar variáveis de ambiente ou argumentos ao script de instalação.
:::

## Configuração com binário

Conforme mencionado, o script de instalação está principalmente focado em configurar o K3s para ser executado como um serviço.
Se você optar por não usar o script, pode executar o K3s simplesmente baixando o binário da nossa [página de lançamentos](https://github.com/k3s-io/k3s/releases/latest), colocando-o no seu PATH e executando-o. Isso não é particularmente útil para instalações permanentes, mas pode ser prático ao realizar testes rápidos que não justifiquem gerenciar o K3s como um serviço do sistema.

```bash
curl -Lo /usr/local/bin/k3s https://github.com/k3s-io/k3s/releases/download/v1.26.5+k3s1/k3s; chmod a+x /usr/local/bin/k3s
```

Você pode passar configurações definindo variáveis de ambiente `K3S_`:
```bash
K3S_KUBECONFIG_MODE="644" k3s server
```

Ou flags de comando:
```bash
k3s server --write-kubeconfig-mode=644
```

O agent K3s também pode ser configurado dessa forma:
```bash
k3s agent --server https://k3s.example.com --token mypassword
```

Para detalhes sobre como configurar o servidor K3s, consulte a [documentação do `k3s server`](../cli/server.md).
Para detalhes sobre como configurar o agente K3s, consulte a [documentação do `k3s agent`](../cli/agent.md).
Você também pode usar a flag `--help` para ver uma lista de todas as opções disponíveis e suas respectivas variáveis de ambiente.

:::info Flags Correspondentes
É importante que flags críticas sejam iguais em todos os nós do servidor. Por exemplo, se você usar a flag
`--disable servicelb` ou `--cluster-cidr=10.200.0.0/16` no nó master, mas não configurá-la nos outros nós do servidor, esses nós não conseguirão se conectar. Eles exibirão erros como:
`failed to validate server configuration: critical configuration value mismatch.`

Consulte a documentação de Configuração do Servidor (linkada acima) para mais informações sobre quais flags devem ser configuradas de forma idêntica nos nós do servidor.
:::

## Arquivo de Configuração

:::info Controle de Versão
Disponível a partir da versão [v1.19.1+k3s1](https://github.com/k3s-io/k3s/releases/tag/v1.19.1%2Bk3s1)
:::

Além de configurar o K3s com variáveis de ambiente e argumentos de linha de comando, também é possível usar um arquivo de configuração.

Por padrão, os valores presentes em um arquivo YAML localizado em `/etc/rancher/k3s/config.yaml` serão utilizados durante a instalação.

Abaixo está um exemplo básico de arquivo de configuração para o `server`:

```yaml
write-kubeconfig-mode: "0644"
tls-san:
  - "foo.local"
node-label:
  - "foo=bar"
  - "something=amazing"
cluster-init: true
```

Isso é equivalente aos seguintes argumentos de linha de comando:

```bash
k3s server \
  --write-kubeconfig-mode "0644"    \
  --tls-san "foo.local"             \
  --node-label "foo=bar"            \
  --node-label "something=amazing"  \
  --cluster-init
```

De forma geral, os argumentos da linha de comando correspondem às suas respectivas chaves no YAML, com argumentos repetíveis sendo representados como listas no YAML. Flags booleanas são representadas como `true` ou `false` no arquivo YAML.

Também é possível usar tanto um arquivo de configuração quanto argumentos de linha de comando. Nesses casos, os valores serão carregados de ambas as fontes, mas os argumentos da linha de comando terão precedência. Para argumentos repetíveis, como `--node-label`, os argumentos da linha de comando substituirão todos os valores na lista.

Por fim, a localização do arquivo de configuração pode ser alterada usando o argumento de linha de comando `--config FILE, -c FILE` ou a variável de ambiente `$K3S_CONFIG_FILE`.

### Múltiplos Arquivos de Configuração

:::info Limite de Versão
Disponível a partir da versão [v1.21.0+k3s1](https://github.com/k3s-io/k3s/releases/tag/v1.21.0%2Bk3s1)
:::

Múltiplos arquivos de configuração são suportados. Por padrão, os arquivos de configuração são lidos de `/etc/rancher/k3s/config.yaml` e `/etc/rancher/k3s/config.yaml.d/*.yaml` em ordem alfabética.

Por padrão, o último valor encontrado para uma determinada chave será utilizado. Um + pode ser adicionado à chave para anexar o valor à string ou lista existente, em vez de substituí-lo. Todas as ocorrências dessa chave em arquivos subsequentes também precisarão de um + para evitar a sobrescrição do valor acumulado.

Abaixo está um exemplo de múltiplos arquivos de configuração:

```yaml
# config.yaml
token: boop
node-label:
  - foo=bar
  - bar=baz


# config.yaml.d/test1.yaml
write-kubeconfig-mode: 600
node-taint:
  - alice=bob:NoExecute

# config.yaml.d/test2.yaml
write-kubeconfig-mode: 777
node-label:
  - other=what
  - foo=three
node-taint+:
  - charlie=delta:NoSchedule

```

Isso resulta em uma configuração final de:

```yaml
write-kubeconfig-mode: 777
token: boop
node-label:
  - other=what
  - foo=three
node-taint:
  - alice=bob:NoExecute
  - charlie=delta:NoSchedule
```

## Colocando tudo junto

Todas as opções mencionadas acima podem ser combinadas em um único exemplo.

Um arquivo `config.yaml` é criado em `/etc/rancher/k3s/config.yaml`:

```yaml
token: "secret"
debug: true
```

Em seguida, o script de instalação é executado com uma combinação de variáveis de ambiente e flags:

```bash
curl -sfL https://get.k3s.io | K3S_KUBECONFIG_MODE="644" INSTALL_K3S_EXEC="server" sh -s - --flannel-backend none
```

Ou, se você já instalou o binário do K3s:
```bash
K3S_KUBECONFIG_MODE="644" k3s server --flannel-backend none
```

Isso resulta em um servidor com:
- Um arquivo kubeconfig com permissões `644`
- Backend Flannel definido como `none`
- O token configurado como `secret`
- Log de depuração habilitado
