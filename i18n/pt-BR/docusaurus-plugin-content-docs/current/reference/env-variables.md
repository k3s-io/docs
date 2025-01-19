---
title: Variáveis ​​de Ambiente
---

Conforme mencionado no [Guia de Início Rápido](../quick-start.md), você pode usar o script de instalação disponível em https://get.k3s.io para instalar o K3s como um serviço em sistemas baseados em systemd e openrc.

A forma mais simples deste comando é a seguinte:

```bash
curl -sfL https://get.k3s.io | sh -
```

Ao usar este método para instalar o K3s, as seguintes variáveis ​​de ambiente podem ser usadas para configurar a instalação:

| Variável de Ambiente            | Descrição                                                                                                                                                                                                                                                                                                                           |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `INSTALL_K3S_SKIP_DOWNLOAD`     | Se definido como verdadeiro, não fará o download do hash ou binário do K3s.                                                                                                                                                                                                                                                         |
| `INSTALL_K3S_SYMLINK`           | Por padrão, criará links simbólicos para os binários kubectl, crictl e ctr se os comandos ainda não existirem no caminho. Se definido como 'skip', não criará links simbólicos e 'force' substituirá.                                                                                                                               |
| `INSTALL_K3S_SKIP_ENABLE`       | Se definido como verdadeiro, não habilitará nem iniciará o serviço K3s.                                                                                                                                                                                                                                                             |
| `INSTALL_K3S_SKIP_START`        | Se definido como verdadeiro, não iniciará o serviço K3s.                                                                                                                                                                                                                                                                            |
| `INSTALL_K3S_VERSION`           | Versão do K3s para baixar do Github. Tentará baixar do canal estável se não for especificado.                                                                                                                                                                                                                                       |
| `INSTALL_K3S_BIN_DIR`           | Diretório para instalar o binário do K3s, links e script de desinstalação, ou usar `/usr/local/bin` como padrão.                                                                                                                                                                                                                    |
| `INSTALL_K3S_BIN_DIR_READ_ONLY` | Se definido como verdadeiro, não gravará arquivos em `INSTALL_K3S_BIN_DIR`, força a configuração `INSTALL_K3S_SKIP_DOWNLOAD=true`.                                                                                                                                                                                                  |
| `INSTALL_K3S_SYSTEMD_DIR`       | Diretório para instalar o serviço systemd e os arquivos de ambiente, ou use `/etc/systemd/system` como padrão.                                                                                                                                                                                                                      |
| `INSTALL_K3S_EXEC`              | Comando com sinalizadores para usar para iniciar K3s no serviço. Se o comando não for especificado e o `K3S_URL` estiver definido, o padrão será "agent". Se `K3S_URL` não estiver definido, o padrão será "server". Para obter ajuda, consulte [este exemplo.](../installation/configuration.md#configuration-with-install-script) |
| `INSTALL_K3S_NAME`              | Nome do serviço systemd a ser criado, será por padrão 'k3s' se estiver executando o k3s como um servidor e 'k3s-agent' se estiver executando o k3s como um agente. Se especificado, o nome será prefixado com 'k3s-'.                                                                                                               |
| `INSTALL_K3S_TYPE`              | O tipo de serviço systemd a ser criado será definido como padrão pelo comando exec do K3s se não for especificado.                                                                                                                                                                                                                  |
| `INSTALL_K3S_SELINUX_WARN`      | Se definido como verdadeiro, continuará se a política k3s-selinux não for encontrada.                                                                                                                                                                                                                                               |
| `INSTALL_K3S_SKIP_SELINUX_RPM`  | Se definido como verdadeiro, ignorará a instalação automática do RPM do k3s.                                                                                                                                                                                                                                                        |
| `INSTALL_K3S_CHANNEL_URL`       | URL do canal para buscar a URL de download do K3s. O padrão é https://update.k3s.io/v1-release/channels.                                                                                                                                                                                                                            |
| `INSTALL_K3S_CHANNEL`           | Canal a ser usado para buscar a URL de download do K3s. O padrão é "stable". As opções incluem: `stable`, `latest`, `testing`.                                                                                                                                                                                                      |

Este exemplo mostra onde colocar as variáveis ​​de ambiente mencionadas acima como opções (após o pipe):

```bash
curl -sfL https://get.k3s.io | INSTALL_K3S_CHANNEL=latest sh -
```

Variáveis ​​de ambiente que começam com `K3S_` serão preservadas para os serviços systemd e openrc usarem.

Definir `K3S_URL` sem definir explicitamente um comando exec definirá o comando como "agent" por padrão.

Ao executar o agente, `K3S_TOKEN` também deve ser definido.

:::info Nota de Versão
Disponível nas versões de outubro de 2024: v1.28.15+k3s1, v1.29.10+k3s1, v1.30.6+k3s1, v1.31.2+k3s1.
:::

O K3s agora usará `PATH` para encontrar runtimes de contêiner alternativos, além de verificar os caminhos padrão usados ​​pelos pacotes de runtime de contêiner. Para usar esse recurso, você deve modificar a variável de ambiente PATH do serviço K3s para adicionar os diretórios que contêm os binários de runtime de contêiner.

É recomendado que você modifique um desses dois arquivos de ambiente:

- /etc/default/k3s # ou k3s-agent
- /etc/sysconfig/k3s # ou k3s-agent

Este exemplo adicionará o `PATH` em `/etc/default/k3s`:

```bash
echo PATH=$PATH >> /etc/default/k3s
```

:::warning
As alterações no `PATH` devem ser feitas com cuidado para evitar colocar binários não confiáveis ​​no caminho de serviços executados como root.
:::
