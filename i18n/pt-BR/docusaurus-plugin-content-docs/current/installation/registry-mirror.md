---
title: "Espelho de Registro Integrado"
---

:::info Nota de Versão
O Espelho de Registro Integrado está disponível como um recurso experimental a partir das versões de janeiro de 2024: v1.26.13+k3s1, v1.27.10+k3s1, v1.28.6+k3s1, v1.29.1+k3s1, e como recurso estável (GA) a partir das versões de dezembro de 2024: v1.29.12+k3s1, v1.30.8+k3s1, v1.31.4+k3s1.
:::


O K3s incorpora o [Spegel](https://github.com/spegel-org/spegel), um espelho de registro OCI distribuído e sem estado, que permite o compartilhamento peer-to-peer de imagens de contêiner entre os nós em um cluster Kubernetes. O espelho de registro distribuído está desativado por padrão. Para que o K3s o utilize, você deve ativar tanto o [Espelho de Registro OCI Distribuído](#enabling-the-distributed-oci-registry-mirror) quanto o [Espelhamento de Registro](#enabling-registry-mirroring), conforme explicado nas subseções a seguir.

## Ativando o Espelho de Registro OCI Distribuído

Para ativar o espelho de registro integrado, os nós do servidor devem ser iniciados com a flag `--embedded-registry` ou com `embedded-registry: true` no arquivo de configuração.
Essa opção habilita o espelho integrado para uso em todos os nós do cluster.

Quando ativado em nível de cluster, todos os nós hospedarão um registro OCI local na porta 6443 e publicarão uma lista de imagens disponíveis por meio de uma rede peer-to-peer na porta 5001.
Qualquer imagem disponível no armazenamento de imagens do Containerd em qualquer nó pode ser puxada por outros membros do cluster sem necessidade de acesso a um registro externo.
Imagens importadas via arquivos [tar de imagens para ambiente isolado](./airgap.md#manually-deploy-images-method) são fixadas no Containerd para garantir que permaneçam disponíveis e não sejam removidas pela coleta de lixo do Kubelet.

A porta peer-to-peer pode ser alterada de 5001 configurando a variável de ambiente `K3S_P2P_PORT` para o serviço K3s. A porta deve ser configurada com o mesmo valor em todos os nós.
Alterar a porta não é suportado e não é recomendável.

### Requisitos

Quando o espelho de registro integrado está habilitado, todos os nós devem ser capazes de se comunicar entre si por meio de seus endereços IP internos, nas portas TCP 5001 e 6443.
Se os nós não puderem se comunicar, pode demorar mais para as imagens serem puxadas, já que o registro distribuído será tentado primeiro pelo Containerd, antes de recorrer a outros endpoints.

## Ativando o Espelhamento de Registro

Ativar o espelhamento para um registro permite que um nó tanto puxe imagens desse registro de outros nós quanto compartilhe as imagens do registro com outros nós.
Se um registro for ativado para espelhamento em alguns nós, mas não em outros, apenas os nós com o espelhamento ativado trocarão imagens desse registro.

Para ativar o espelhamento de imagens de um registro de contêiner upstream, os nós devem ter uma entrada na seção `mirrors` do arquivo `registries.yaml` para esse registro.
O registro não precisa ter nenhum endpoint listado, apenas precisa estar presente.
Por exemplo, para habilitar o espelhamento distribuído de imagens de `docker.io` e `registry.k8s.io`, configure o `registries.yaml` com o seguinte conteúdo em todos os nós do cluster:

```yaml
mirrors:
  docker.io:
  registry.k8s.io:
```

Endpoints para espelhos de registros também podem ser adicionados como de costume.
Na configuração a seguir, as tentativas de pull de imagens tentarão primeiro o espelho integrado, depois `mirror.example.com` e, finalmente, `docker.io`:
```yaml
mirrors:
  docker.io:
    endpoint:
      - https://mirror.example.com
```

Se você estiver usando um registro privado diretamente, em vez de como espelho de um registro upstream, pode habilitar o espelhamento distribuído da mesma forma que os registros públicos são habilitados — listando-o na seção de espelhos:
```yaml
mirrors:
  mirror.example.com:
```

:::info Nota de Versão
O suporte a curingas está disponível a partir das versões de março de 2024: v1.26.15+k3s1, v1.27.12+k3s1, v1.28.8+k3s1, v1.29.3+k3s1.
:::

A entrada de espelho com curinga `"*"` pode ser usada para habilitar o espelhamento distribuído de todos os registros. Observe que o asterisco DEVE estar entre aspas:
```yaml
mirrors:
  "*":
```

Se nenhum registro estiver habilitado para espelhamento em um nó, esse nó não participará do registro distribuído de nenhuma forma.

Para mais informações sobre a estrutura do arquivo `registries.yaml`, consulte [Configuração de Registro Privado](./private-registry.md).

### Fallback de Endpoint Padrão

Por padrão, o containerd recorrerá ao endpoint padrão ao puxar de registros com endpoints de espelho configurados. Se você quiser desabilitar isso e puxar imagens apenas dos espelhos configurados e/ou do espelho integrado, consulte a seção [Fallback de Endpoint Padrão](./private-registry.md#default-endpoint-fallback) da documentação de Configuração de Registro Privado.

Observe que, se você estiver usando a opção `--disable-default-endpoint` e quiser permitir o pull diretamente de um registro específico, enquanto desabilita para os outros, você pode fornecer explicitamente um endpoint para permitir que o pull da imagem recorra ao próprio registro:
```yaml
mirrors:
  docker.io:           # Sem o endpoint padrão, os pulls falharão se a imagem não estiver disponível em um nó.
  registry.k8s.io:     # Sem o endpoint padrão, os pulls falharão se a imagem não estiver disponível em um nó.
  mirror.example.com:  # Com um endpoint padrão explícito, é possível puxar do registro upstream se a imagem não estiver disponível em um nó.
    endpoint:
      - https://mirror.example.com
```

### Tag mais Recente

Quando nenhuma tag é especificada para uma imagem de contêiner, a tag padrão implícita é `latest`. Essa tag é frequentemente atualizada para apontar para a versão mais recente da imagem. Como essa tag pode apontar para diferentes revisões de uma imagem dependendo de quando é puxada, o registro distribuído **não puxará** a tag `latest` de outros nós. Isso força o containerd a acessar um registro upstream ou espelho de registro para garantir uma visão consistente do que a tag `latest` refere-se.

Isso está alinhado com a [política especial de `imagePullPolicy`](https://kubernetes.io/docs/concepts/containers/images/#imagepullpolicy-defaulting) observada pelo Kubernetes ao usar a tag `latest` para uma imagem de contêiner.

O espelhamento da tag `latest` pode ser ativado configurando a variável de ambiente `K3S_P2P_ENABLE_LATEST=true` para o serviço K3s.
Isso não é suportado e não é recomendado, pelos motivos discutidos acima.

## Segurança

### Autenticação

O acesso à API de registro do espelho integrado requer um certificado de cliente válido, assinado pela autoridade certificadora de cliente do cluster.

O acesso à rede peer-to-peer da tabela de hash distribuída requer uma chave pré-compartilhada que é controlada pelos nós do servidor.
Os nós se autenticam mutuamente usando tanto a chave pré-compartilhada quanto um certificado assinado pela autoridade certificadora do cluster.

### Preocupações Potenciais

:::warning
O registro distribuído é construído com base em princípios peer-to-peer e assume um nível igual de privilégio e confiança entre todos os membros do cluster.
Se isso não corresponder à postura de segurança do seu cluster, você não deve habilitar o registro distribuído integrado.
:::

O registro integrado pode disponibilizar imagens às quais um nó não teria acesso de outra forma.
Por exemplo, se algumas das suas imagens forem puxadas de um registro, projeto ou repositório que exija autenticação via Kubernetes Image Pull Secrets, ou credenciais em `registries.yaml`, o registro distribuído permitirá que outros nós compartilhem essas imagens sem fornecer credenciais para o registro upstream.

Usuários com acesso para enviar imagens para o armazenamento de imagens do containerd em um nó podem ser capazes de usar isso para "contaminar" a imagem para outros nós do cluster, já que outros nós confiarão na tag anunciada pelo nó e a usarão sem verificar com o registro upstream.
Se a integridade da imagem for importante, você deve usar digests de imagem em vez de tags, pois o digest não pode ser contaminado dessa maneira.

## Compartilhando Imagens para Ambiente Isolado ou Carregadas Manualmente

O compartilhamento de imagens é controlado com base no registro de origem.
Imagens carregadas diretamente no containerd por meio de arquivos tar para ambiente isolado (air-gap), ou carregadas diretamente no armazenamento de imagens do containerd usando a ferramenta de linha de comando `ctr`, serão compartilhadas entre os nós se forem marcadas como provenientes de um registro habilitado para espelhamento.

Observe que o registro upstream de onde as imagens parecem vir não precisa, na verdade, existir ou ser acessível.
Por exemplo, você pode marcar imagens como se fossem de um registro upstream fictício e importar essas imagens para o armazenamento de imagens do containerd.
Você então poderá puxar essas imagens de todos os membros do cluster, contanto que esse registro esteja listado em `registries.yaml`.

## Enviando Imagens

O registro integrado é somente leitura e não pode ser enviado diretamente usando `docker push` ou outras ferramentas comuns que interagem com registros OCI.

As imagens podem ser disponibilizadas manualmente pelo registro integrado executando `ctr -n k8s.io image pull` para puxar uma imagem, ou carregando arquivos de imagem criados com `docker save` por meio do comando `ctr -n k8s.io image import`.
Observe que o namespace `k8s.io` deve ser especificado ao gerenciar imagens via `ctr` para que elas sejam visíveis ao kubelet.