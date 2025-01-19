---
title: "Instalação em Ambiente Isolado"
---

O K3s pode ser instalado em um ambiente isolado (air-gapped) de duas maneiras diferentes. Você pode implantar imagens através do [artefato de release tarball k3s-airgap-images](#manually-deploy-images-method) ou utilizando um [registro privado](#private-registry-method). Também é possível usar o [espelho de registro integrado](#embedded-registry-mirror), desde que haja pelo menos um membro do cluster que tenha acesso às imagens necessárias.

## Importar Imagens

### Método de Registro Privado

Esses passos assumem que você já criou nós em seu ambiente isolado (air-gap), está utilizando o containerd embutido como runtime de contêiner e tem um registro privado compatível com OCI disponível em seu ambiente.

Se você ainda não configurou um registro Docker privado, consulte a [documentação oficial do Registry](https://distribution.github.io/distribution/about/deploying/#run-an-externally-accessible-registry).

#### Criar o YAML do Registro e Enviar Imagens

1. Obtenha o arquivo de imagens para a sua arquitetura na página de [releases](https://github.com/k3s-io/k3s/releases) para a versão do K3s que você irá utilizar.
2. Use `docker image load k3s-airgap-images-amd64.tar.zst` para importar as imagens do arquivo tar para o Docker.
3. Use `docker tag` e `docker push` para retaguear e enviar as imagens carregadas para o seu registro privado.
4. Siga o guia de [Configuração de Registro Privado](private-registry.md) para criar e configurar o arquivo `registries.yaml`.
5. Prossiga para a seção [Instalar K3s](#install-k3s) abaixo.

### Método de Implantação Manual de Imagens

Essas etapas pressupõem que você já criou nós em seu ambiente air-gap,
está usando o containerd empacotado como o tempo de execução do contêiner
e não pode ou não quer usar um registro privado.

Este método requer que você implante manualmente as imagens necessárias em cada nó e é apropriado para implantações de ponta onde executar um registro privado não é prático.

#### Preparar o diretório de imagens e o tarball de imagens do Airgap

1. Obtenha o arquivo de imagens para sua arquitetura na página [releases](https://github.com/k3s-io/k3s/releases) da versão do K3s que você executará.
2. Baixe o arquivo de imagens para o diretório de imagens do agente, por exemplo:
  ```bash
  sudo mkdir -p /var/lib/rancher/k3s/agent/images/
  sudo curl -L -o /var/lib/rancher/k3s/agent/images/k3s-airgap-images-amd64.tar.zst "https://github.com/k3s-io/k3s/releases/download/v1.29.1-rc2%2Bk3s1/k3s-airgap-images-amd64.tar.zst"
  ```
3. Prossiga para a seção [Instalar K3s](#install-k3s) abaixo.

### Espelho de Registro Incorporado

O K3s inclui um espelho de registro compatível com OCI distribuído incorporado.
Quando habilitado e configurado corretamente, as imagens disponíveis no armazenamento de imagens do containerd em qualquer nó
podem ser extraídas por outros membros do cluster sem acesso a um registro de imagem externo.

As imagens espelhadas podem ser originadas de um registro upstream, espelho de registro ou tarball de imagem airgap.
Para obter mais informações sobre como habilitar o espelho de registro distribuído incorporado, consulte a documentação [Espelho de Registro Integrado](./registry-mirror.md).

## Instalação K3s

### Pré-requisitos

Antes de instalar o K3s, conclua o [Método de Registro Privado](#private-registry-method) ou o [Método de Implantação Manual de Imagens](#manually-deploy-images-method) acima para preencher previamente as imagens que o K3s precisa instalar.

#### Binários
- Baixe o binário K3s da página [releases](https://github.com/k3s-io/k3s/releases), correspondendo à mesma versão usada para obter as imagens airgap. Coloque o binário em `/usr/local/bin` em cada nó air-gapped e garanta que ele seja executável.
- Baixe o script de instalação do K3s em [get.k3s.io](https://get.k3s.io). Coloque o script de instalação em qualquer lugar em cada nó air-gapped e nomeie-o `install.sh`.

#### Rota de Rede Padrão
Se seus nós não tiverem uma interface com uma rota padrão, uma rota padrão deve ser configurada; até mesmo uma rota black-hole por meio de uma interface fictícia será suficiente. O K3s requer uma rota padrão para detectar automaticamente o IP primário do nó e para que o roteamento ClusterIP do kube-proxy funcione corretamente. Para adicionar uma rota fictícia, faça o seguinte:
  ```
  ip link add dummy0 type dummy
  ip link set dummy0 up
  ip addr add 203.0.113.254/31 dev dummy0
  ip route add default via 203.0.113.255 dev dummy0 metric 1000
  ```

Ao executar o script K3s com a variável de ambiente `INSTALL_K3S_SKIP_DOWNLOAD`, o K3s usará a versão local do script e do binário.

#### SELinux RPM

Se você pretende implantar o K3s com o SELinux habilitado, você também precisará instalar o RPM k3s-selinux apropriado em todos os nós. A versão mais recente do RPM pode ser encontrada [aqui](https://github.com/k3s-io/k3s-selinux/releases/latest). Por exemplo, no CentOS 8:

```bash
On internet accessible machine:
curl -LO https://github.com/k3s-io/k3s-selinux/releases/download/v1.4.stable.1/k3s-selinux-1.4-1.el8.noarch.rpm

# Transferir RPM para máquina isolada.
On air-gapped machine:
sudo yum install ./k3s-selinux-1.4-1.el8.noarch.rpm
```

Veja a seção [SELinux](../advanced.md#selinux-support) para mais informações.

### Instalando o K3s em um Ambiente Isolado

Você pode instalar o K3s em um ou mais servidores, conforme descrito abaixo.

<Tabs queryString="airgap-cluster">
<TabItem value="Configuração de Servidor Único." default>

Para instalar o K3s em um único servidor, basta fazer o seguinte no nó do servidor:

```bash
INSTALL_K3S_SKIP_DOWNLOAD=true ./install.sh
```

Para adicionar agentes adicionais, faça o seguinte em cada nó de agente:

```bash
INSTALL_K3S_SKIP_DOWNLOAD=true K3S_URL=https://<SERVER_IP>:6443 K3S_TOKEN=<YOUR_TOKEN> ./install.sh
```

:::note
O token do servidor normalmente é encontrado em `/var/lib/rancher/k3s/server/token`.
:::

</TabItem>
<TabItem value="Configuração de Alta Disponibilidade." default>

Consulte os guias [Alta disponibilidade com um BD externo](../datastore/ha.md) ou [Alta disponibilidade com BD incorporado](../datastore/ha-embedded.md). Você ajustará os comandos de instalação para especificar `INSTALL_K3S_SKIP_DOWNLOAD=true` e executar seu script de instalação localmente em vez de via curl. Você também utilizará `INSTALL_K3S_EXEC='args'` para fornecer quaisquer argumentos ao k3s.

Por exemplo, a segunda etapa do guia Alta disponibilidade com um banco de dados externo menciona o seguinte:

```bash
curl -sfL https://get.k3s.io | sh -s - server \
  --token=SECRET \
  --datastore-endpoint="mysql://username:password@tcp(hostname:3306)/database-name"
```

Em vez disso, você modificaria esses exemplos da seguinte forma:

```bash
INSTALL_K3S_SKIP_DOWNLOAD=true INSTALL_K3S_EXEC='server --token=SECRET' \
K3S_DATASTORE_ENDPOINT='mysql://username:password@tcp(hostname:3306)/database-name' \
./install.sh
```

</TabItem>
</Tabs>

:::note
A flag `--resolv-conf` do K3s é passada para o kubelet, o que pode ajudar na configuração da resolução de DNS dos pods em redes isoladas (air-gap), onde o host não possui servidores de nomes configurados para upstream.
:::

## Atualização

### Método de Instalação por Script

A atualização de um ambiente isolado pode ser realizada da seguinte maneira:

1. Baixe as novas imagens air-gap (arquivo tar) da página [releases](https://github.com/k3s-io/k3s/releases) para a versão do K3s para a qual você fará o upgrade. Coloque o tar no diretório `/var/lib/rancher/k3s/agent/images/` em cada
nó. Exclua o arquivo tar antigo.
2. Copie e substitua o binário antigo do K3s em `/usr/local/bin` em cada nó. Copie o script de instalação em https://get.k3s.io (pois é possível que ele tenha mudado desde o último lançamento). Execute o script novamente, assim como você fez no passado
com as mesmas variáveis ​​de ambiente.
3. Reinicie o serviço K3s (se não for reiniciado automaticamente pelo instalador).

### Método de Atualizações Automatizadas

O K3s suporta [atualizações automatizadas](../upgrades/automated.md). Para habilitar isso em ambientes com air-gapped, você deve garantir que as imagens necessárias estejam disponíveis em seu registro privado.

Você precisará da versão do rancher/k3s-upgrade que corresponde à versão do K3s para a qual pretende fazer o upgrade. Observe que a tag de imagem substitui o `+` na versão do K3s por um `-` porque as imagens do Docker não suportam `+`.

Você também precisará das versões do system-upgrade-controller e do kubectl que são especificadas no manifesto YAML do system-upgrade-controller que você implantará. Verifique a versão mais recente do system-upgrade-controller [aqui](https://github.com/rancher/system-upgrade-controller/releases/latest) e baixe o system-upgrade-controller.yaml para determinar as versões que você precisa enviar para seu registro privado. Por exemplo, na versão v0.4.0 do system-upgrade-controller, essas imagens são especificadas no manifesto YAML:

```
rancher/system-upgrade-controller:v0.4.0
rancher/kubectl:v0.17.0
```

Depois de adicionar as imagens necessárias rancher/k3s-upgrade, rancher/system-upgrade-controller e rancher/kubectl ao seu registro privado, siga o guia [atualizações automatizadas](../upgrades/automated.md).
