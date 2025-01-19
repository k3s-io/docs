---
title: "Gerenciando Funções do Servidor"
---

Iniciar o servidor K3s com `--cluster-init` executará todos os componentes do plano de controle, incluindo o apiserver, o controller-manager, o scheduler e o etcd. É possível desabilitar componentes específicos para dividir as funções do plano de controle e do etcd em nós separados.

:::info
Este documento só é relevante ao usar etcd incorporado. Quando não estiver usando etcd incorporado, todos os servidores terão a função control-plane e executarão componentes control-plane.
:::

## Nós `etcd` Dedicados
Para criar um servidor apenas com a função `etcd`, inicie o K3s com todos os componentes do plano de controle desabilitados:
```
curl -fL https://get.k3s.io | sh -s - server --cluster-init --disable-apiserver --disable-controller-manager --disable-scheduler
```

Este primeiro nó iniciará o etcd e aguardará que nós adicionais `etcd` e/ou `control-plane` se juntem. O cluster não poderá ser usado até que você junte um servidor adicional com os componentes `control-plane` habilitados.

## Nós `control-plane` Dedicados
:::note
Um nó `control-plane` dedicado não pode ser o primeiro servidor no cluster; deve haver um nó existente com a função `etcd` antes de unir nós `control-plane` dedicados.
:::

Para criar um servidor apenas com a função `control-plane`, inicie o k3s com o etcd desabilitado:
```bash
curl -fL https://get.k3s.io | sh -s - server --token <token> --disable-etcd --server https://<etcd-only-node>:6443
```

Após criar nós de servidor dedicados, as funções selecionadas ficarão visíveis em `kubectl get node`:
```bash
$ kubectl get nodes
NAME           STATUS   ROLES                       AGE     VERSION
k3s-server-1   Ready    etcd                        5h39m   v1.20.4+k3s1
k3s-server-2   Ready    control-plane,master        5h39m   v1.20.4+k3s1
```

## Adicionando Funções a Servidores Existentes

As funções podem ser adicionadas a nós dedicados existentes reiniciando o K3s com os sinalizadores de desabilitação removidos. Por exemplo, se você quiser adicionar a função `control-plane` a um nó `etcd` dedicado, você pode remover os sinalizadores `--disable-apiserver --disable-controller-manager --disable-scheduler` da unidade systemd ou do arquivo de configuração e reiniciar o serviço.

## Sintaxe do Arquivo de Configuração

Assim como com todos os outros sinalizadores CLI, você pode usar o [Arquivo de configuração](configuration.md#configuration-file) para desabilitar componentes, em vez de passar as opções como sinalizadores CLI. Por exemplo, para criar um nó `etcd` dedicado, você pode colocar os seguintes valores em `/etc/rancher/k3s/config.yaml`:

```yaml
cluster-init: true
disable-apiserver: true
disable-controller-manager: true
disable-scheduler: true
```
