---
title: "Atualizações Manuais"
---

Você pode atualizar o K3s usando o script de instalação ou instalando manualmente o binário da versão desejada.

:::note
Ao atualizar, atualize primeiro os nós do servidor, um de cada vez, e depois todos os nós do agente.
:::

### Canais de Lançamento

As atualizações realizadas por meio do script de instalação ou usando nosso recurso [automated upgrades](automated.md) podem ser vinculadas a diferentes canais de lançamento. Os seguintes canais estão disponíveis:

| Canal           | Descrição                                                                                                                                                                                                                       |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| stable          | (Padrão) Stable é recomendado para ambientes de produção. Essas versões passaram por um período de fortalecimento da comunidade.                                                                                                |
| latest          | Latest é recomendado para testar os recursos mais recentes. Esses lançamentos ainda não passaram por um período de fortalecimento da comunidade.                                                                                |
| v1.26 (example) | Há um canal de lançamento vinculado a cada versão secundária do Kubernetes, incluindo versões que estão no fim da vida útil. Esses canais selecionarão o patch mais recente disponível, não necessariamente uma versão estável. |

Para uma lista exaustiva e atualizada de canais, você pode visitar a [API de serviço de canal k3s](https://update.k3s.io/v1-release/channels). Para mais detalhes técnicos sobre como os canais funcionam, você vê o [projeto channelserver](https://github.com/rancher/channelserver).

:::tip
Ao tentar atualizar para uma nova versão do K3s, a [política de distorção de versão do Kubernetes](https://kubernetes.io/releases/version-skew-policy/) se aplica. Certifique-se de que seu plano não pule versões secundárias intermediárias ao atualizar. O próprio system-upgrade-controller não protegerá contra alterações não suportadas na versão do Kubernetes.
:::

### Atualizar K3s Usando o Script de Instalação

Para atualizar o K3s de uma versão mais antiga, você pode executar novamente o script de instalação usando as mesmas opções de configuração usadas originalmente ao executar o script de instalação.

:::info Nota
A variável `INSTALL_K3S_EXEC`, as variáveis ​​`K3S_` e os argumentos shell finais são todos usados ​​pelo script de instalação para gerar a unidade systemd e o arquivo de ambiente.
Se você definir a configuração ao executar originalmente o script de instalação, mas não defini-la novamente ao executar novamente o script de instalação, os valores originais serão perdidos.

O conteúdo do [arquivo de configuração](../installation/configuration.md#configuration-file) não é gerenciado pelo script de instalação.
Se você quiser que sua configuração seja independente do script de instalação, você deve usar um arquivo de configuração em vez de passar variáveis ​​de ambiente ou argumentos para o script de instalação.
:::

A execução do script de instalação irá:

1. Baixará o novo binário k3s
2. Atualizar a unidade systemd ou o script init openrc para refletir os argumentos passados ​​para o script de instalação
3. Reiniciar o serviço k3s

Por exemplo, para atualizar para a versão estável atual:

```sh
curl -sfL https://get.k3s.io | <EXISTING_K3S_ENV> sh -s - <EXISTING_K3S_ARGS>
```

Se você quiser atualizar para uma versão mais recente em um canal específico (como o mais recente), você pode especificar o canal:
```sh
curl -sfL https://get.k3s.io | INSTALL_K3S_CHANNEL=latest <EXISTING_K3S_ENV> sh -s - <EXISTING_K3S_ARGS>
```

Se você quiser atualizar para uma versão específica, você pode executar o seguinte comando:

```sh
curl -sfL https://get.k3s.io | INSTALL_K3S_VERSION=vX.Y.Z+k3s1 <EXISTING_K3S_ENV> sh -s - <EXISTING_K3S_ARGS>
```

:::tip
Se você quiser baixar a nova versão do k3s, mas não iniciá-lo, você pode usar a variável de ambiente `INSTALL_K3S_SKIP_START=true`.
:::

### Atualizar K3s Usando o Binário

Para atualizar o K3s manualmente, você pode baixar a versão desejada do binário do K3s e substituir o binário existente pelo novo.

1. Baixe a versão desejada do binário K3s em [releases](https://github.com/k3s-io/k3s/releases)
2. Copie o binário baixado para `/usr/local/bin/k3s` (ou seu local desejado)
3. Pare o antigo binário k3s
4. Inicie o novo binário k3s