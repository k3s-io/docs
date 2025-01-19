---
title: "Atualizações Automatizadas"
---

### Visão Geral

Você pode gerenciar atualizações de cluster do K3s usando o system-upgrade-controller do Rancher. Esta é uma abordagem nativa do Kubernetes para atualizações de cluster. Ela aproveita uma [definição de recurso personalizada (CRD)](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/#custom-resources), um `plan` e um [controlador](https://kubernetes.io/docs/concepts/architecture/controller/).

O plano define políticas e requisitos de atualização. Ele também define quais nós devem ser atualizados por meio de um [seletor de rótulo](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/). Veja abaixo os planos com padrões apropriados para atualizar um cluster K3s. Para opções de configuração de plano mais avançadas, revise o [CRD](https://github.com/rancher/system-upgrade-controller/blob/master/pkg/apis/upgrade.cattle.io/v1/types.go).

O controlador agenda atualizações monitorando planos e selecionando nós para executar [jobs](https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/) de atualização. Quando um job é executado até a conclusão com sucesso, o controlador rotula o nó no qual ele foi executado adequadamente.

:::note
O trabalho de atualização que é iniciado deve ser altamente privilegiado. Ele é configurado com o seguinte:
- Namespaces do host `IPC`, `NET` e `PID`
- A capacidade `CAP_SYS_BOOT`
- Raiz do host montada em `/host` com permissões de leitura e gravação

:::


Para automatizar atualizações dessa maneira, você deve fazer o seguinte:

1. Instale o system-upgrade-controller em seu cluster
1. Configure os planos

:::warning
Se o cluster K3s for gerenciado pelo Rancher, você deve usar a IU do Rancher para gerenciar atualizações.
- Se o cluster K3s foi importado para o Rancher, o Rancher gerenciará a implantação e os planos do system-upgrade-controller. Não siga as etapas desta página.
- Se o cluster K3s foi provisionado pelo Rancher, o Rancher usará o agente do sistema para gerenciar atualizações de versão. Não siga as etapas desta página.
- Se o cluster K3s *não* for gerenciado pelo Rancher, você pode seguir as etapas abaixo.
:::

Para mais detalhes sobre o design e a arquitetura do system-upgrade-controller ou sua integração com o K3s, consulte os seguintes repositórios Git:

- [system-upgrade-controller](https://github.com/rancher/system-upgrade-controller)
- [k3s-upgrade](https://github.com/k3s-io/k3s-upgrade)

:::tip
Ao tentar atualizar para uma nova versão do K3s, a [política de distorção de versão do Kubernetes](https://kubernetes.io/releases/version-skew-policy/) se aplica. Certifique-se de que seu plano não pule versões secundárias intermediárias ao atualizar. O próprio system-upgrade-controller não protegerá contra alterações não suportadas na versão do Kubernetes.
:::

### Instalação do system-upgrade-controller

O system-upgrade-controller pode ser instalado como uma implantação no seu cluster. A implantação requer uma conta de serviço, clusterRoleBinding e um configmap. Para instalar esses componentes, execute o seguinte comando:

```bash
kubectl apply -f https://github.com/rancher/system-upgrade-controller/releases/latest/download/system-upgrade-controller.yaml
```
O controlador pode ser configurado e personalizado por meio do configmap mencionado anteriormente, mas o controlador deve ser reimplantado para que as alterações sejam aplicadas.

Para poder aplicar os planos, o CRD do controlador de atualização do sistema precisa ser implantado:

```bash
kubectl apply -f https://github.com/rancher/system-upgrade-controller/releases/latest/download/crd.yaml
```

### Configurar planos
É recomendável que você crie pelo menos dois planos: um plano para atualizar nós de servidor (plano de controle) e um plano para atualizar nós de agente. Você pode criar planos adicionais conforme necessário para controlar a implementação da atualização entre nós. Depois que os planos forem criados, o controlador os selecionará e começará a atualizar seu cluster.

Os dois planos de exemplo a seguir atualizarão seu cluster para K3s v1.24.6+k3s1:

```yaml
# Server plan
apiVersion: upgrade.cattle.io/v1
kind: Plan
metadata:
  name: server-plan
  namespace: system-upgrade
spec:
  concurrency: 1
  cordon: true
  nodeSelector:
    matchExpressions:
    - key: node-role.kubernetes.io/control-plane
      operator: In
      values:
      - "true"
  serviceAccountName: system-upgrade
  upgrade:
    image: rancher/k3s-upgrade
  version: v1.24.6+k3s1
---
# Agent plan
apiVersion: upgrade.cattle.io/v1
kind: Plan
metadata:
  name: agent-plan
  namespace: system-upgrade
spec:
  concurrency: 1
  cordon: true
  nodeSelector:
    matchExpressions:
    - key: node-role.kubernetes.io/control-plane
      operator: DoesNotExist
  prepare:
    args:
    - prepare
    - server-plan
    image: rancher/k3s-upgrade
  serviceAccountName: system-upgrade
  upgrade:
    image: rancher/k3s-upgrade
  version: v1.24.6+k3s1
```

Há algumas coisas importantes a serem destacadas em relação a esses planos:

1) Os planos devem ser criados no mesmo namespace em que o controlador foi implantado.

2) O campo `concurrency` indica quantos nós podem ser atualizados ao mesmo tempo.

3) O server-plan tem como alvo os nós do servidor especificando um seletor de rótulo que seleciona nós com o rótulo `node-role.kubernetes.io/control-plane`. O agent-plan tem como alvo os nós do agente especificando um seletor de rótulo que seleciona nós sem esse rótulo.

4) A etapa `prepare` no agent-plan fará com que os trabalhos de atualização para esse plano aguardem a conclusão do server-plan antes de serem executados.

5) Ambos os planos têm o campo `version` definido como v1.24.6+k3s1. Como alternativa, você pode omitir o campo `version` e definir o campo `channel` como uma URL que resolva uma versão do K3s. Isso fará com que o controlador monitore essa URL e atualize o cluster sempre que ele resolver para uma nova versão. Isso funciona bem com os [canais de versão](manual.md#release-channels). Assim, você pode configurar seus planos com o seguinte canal para garantir que seu cluster seja sempre atualizado automaticamente para a versão estável mais recente do K3s:
```yaml
apiVersion: upgrade.cattle.io/v1
kind: Plan
...
spec:
  ...
  channel: https://update.k3s.io/v1-release/channels/stable

```

Conforme declarado, a atualização começará assim que o controlador detectar que um plano foi criado. Atualizar um plano fará com que o controlador reavalie o plano e determine se outra atualização é necessária.

Você pode monitorar o progresso de uma atualização visualizando o plano e os trabalhos via kubectl:
```bash
kubectl -n system-upgrade get plans -o yaml
kubectl -n system-upgrade get jobs -o yaml
```


## Prevenção de Downgrade

:::info Nota de Versão
Começando com as versões 2023-07 ([v1.27.4+k3s1](https://github.com/k3s-io/k3s-upgrade/releases/tag/v1.27.4%2Bk3s1), [v1.26.7+k3s1](https://github.com/k3s-io/k3s-upgrade/releases/tag/v1.26.7%2Bk3s1), [v1.25.12+k3s1](https://github.com/k3s-io/k3s-upgrade/releases/tag/v1.25.12%2Bk3s1), [v1.24.16+k3s1](https://github.com/k3s-io/k3s-upgrade/releases/tag/v1.24.16%2Bk3s1))
:::

O Kubernetes não oferece suporte a downgrades de componentes do plano de controle. A imagem k3s-upgrade usada pelos planos de atualização se recusará a fazer downgrade do K3s, falhando no plano e deixando seus nós isolados.

Aqui está um cluster de exemplo, mostrando pods de atualização com falha e nós isolados:

```console
ubuntu@user:~$ kubectl get pods -n system-upgrade
NAME                                                              READY   STATUS    RESTARTS   AGE
apply-k3s-server-on-ip-172-31-0-16-with-7af95590a5af8e8c3-2cdc6   0/1     Error     0          9m25s
apply-k3s-server-on-ip-172-31-10-23-with-7af95590a5af8e8c-9xvwg   0/1     Error     0          14m
apply-k3s-server-on-ip-172-31-13-213-with-7af95590a5af8e8-8j72v   0/1     Error     0          18m
system-upgrade-controller-7c4b84d5d9-kkzr6                        1/1     Running   0          20m
ubuntu@user:~$ kubectl get nodes
NAME               STATUS                     ROLES                       AGE   VERSION
ip-172-31-0-16     Ready,SchedulingDisabled   control-plane,etcd,master   19h   v1.27.4+k3s1
ip-172-31-10-23    Ready,SchedulingDisabled   control-plane,etcd,master   19h   v1.27.4+k3s1
ip-172-31-13-213   Ready,SchedulingDisabled   control-plane,etcd,master   19h   v1.27.4+k3s1
ip-172-31-2-13     Ready                      <none>                      19h   v1.27.4+k3s1
```
Você pode retornar seus nós cordonados ao serviço por qualquer um dos seguintes métodos:
* Altere a versão ou o canal em seu plano para direcionar uma versão que seja a mesma ou mais recente do que a que está em execução no cluster, para que o plano seja bem-sucedido.
* Exclua o plano e descordone manualmente os nós.
Use `kubectl get plan -n system-upgrade` para encontrar o nome do plano e, em seguida, `kubectl delete plan -n system-upgrade PLAN_NAME` para excluí-lo. Depois que o plano for excluído, use `kubectl uncordon NODE_NAME` para descordone cada um dos nós.
