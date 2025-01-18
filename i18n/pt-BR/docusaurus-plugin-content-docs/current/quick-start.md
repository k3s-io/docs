---
title: "Guia Rápido"
---

Este guia ajudará você a iniciar rapidamente um cluster com opções padrão. A [seção de instalação](./installation/installation.md) cobre em maior detalhe como o K3s pode ser configurado.

Certifique-se de que seus nós atendem aos [requisitos](./installation/requirements.md) antes de continuar.

Para informações sobre como os componentes do K3s trabalham juntos, consulte a [seção de arquitetura.](./architecture.md)

:::info
Novo no Kubernetes? A documentação oficial do Kubernetes já possui ótimos tutoriais explicando os conceitos básicos [aqui](https://kubernetes.io/docs/tutorials/kubernetes-basics/).
:::

## Script de Instalação

O K3s fornece um script de instalação que é uma maneira prática de instalá-lo como um serviço em sistemas baseados em systemd ou openrc. Este script está disponível em https://get.k3s.io. Para instalar o K3s usando este método, basta executar:

```bash
curl -sfL https://get.k3s.io | sh -
```

Após executar esta instalação:

- O serviço K3s será configurado para reiniciar automaticamente após reinicializações do nó ou caso o processo falhe ou seja encerrado
- Utilitários adicionais serão instalados, incluindo `kubectl`, `crictl`, `ctr`, `k3s-killall.sh` e `k3s-uninstall.sh`
- Um arquivo [kubeconfig](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/) será gravado em `/etc/rancher/k3s/k3s.yaml` , e o kubectl instalado pelo K3s o utilizará automaticamente

Uma instalação de servidor de nó único é um cluster Kubernetes totalmente funcional, incluindo todos os componentes de datastore, control-plane, kubelet e runtime de contêiner necessários para hospedar pods de carga de trabalho. Não é necessário adicionar nós de servidor ou agentes adicionais, mas você pode querer fazê-lo para adicionar capacidade ou redundância ao seu cluster.

Para instalar nós de agente adicionais e adicioná-los ao cluster, execute o script de instalação com as variáveis de ambiente `K3S_URL` e `K3S_TOKEN`. Aqui está um exemplo mostrando como conectar um agente:

```bash
curl -sfL https://get.k3s.io | K3S_URL=https://myserver:6443 K3S_TOKEN=mynodetoken sh -
```

Definir o parâmetro `K3S_URL` faz com que o instalador configure o K3s como um agente, em vez de um servidor. O agente do K3s se registrará com o servidor K3s que está escutando na URL fornecida. O valor a ser usado para `K3S_TOKEN` está armazenado em `/var/lib/rancher/k3s/server/node-token` no seu nó servidor.

:::note
Cada máquina deve ter um hostname exclusivo. Se suas máquinas não tiverem hostnames exclusivos, defina a variável de ambiente `K3S_NODE_NAME` e forneça um valor com um hostname válido e exclusivo para cada nó.
:::

Se estiver interessado em ter mais nós de servidor, consulte as páginas [Alta Disponibilidade com etcd Embutido](./datastore/ha-embedded.md) e [Alta Disponibilidade com BD Externo](./datastore/ha.md) para mais informações.
