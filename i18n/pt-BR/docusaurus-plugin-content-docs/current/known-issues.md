---
title: Problemas Conhecidos
---
Os problemas conhecidos são atualizados periodicamente e projetados para informá-lo sobre quaisquer problemas que podem não ser resolvidos imediatamente na próxima versão.

### Snap Docker

Se você planeja usar o K3s com o Docker, não é recomendado instalar o Docker por meio de um pacote snap, pois ele pode causar problemas na execução do K3s.

### Iptables

Se você estiver executando o iptables v1.6.1 e versões mais antigas no modo nftables, poderá encontrar problemas. Recomendamos utilizar iptables mais recentes (como 1.6.1+) para evitar problemas ou executar o modo legado do iptables.

```
update-alternatives --set iptables /usr/sbin/iptables-legacy
update-alternatives --set ip6tables /usr/sbin/ip6tables-legacy
```

As versões 1.8.0-1.8.4 do Iptables têm problemas conhecidos que podem causar falhas no K3s. Várias distribuições Linux populares são fornecidas com essas versões por padrão. Um bug causa o acúmulo de regras duplicadas, o que afeta negativamente o desempenho e a estabilidade do nó. Consulte [Problema nº 3117](https://github.com/k3s-io/k3s/issues/3117) para obter informações sobre como determinar se você é afetado por esse problema.

O K3s inclui uma versão funcional do iptables (v1.8.8) que funciona corretamente. Você pode dizer ao K3s para usar sua versão empacotada do iptables iniciando o K3s com a opção `--prefer-bundled-bin` ou desinstalando os pacotes iptables/nftables do seu sistema operacional.

:::info Nota de Versão

O sinalizador `--prefer-bundled-bin` está disponível a partir das versões 2022-12 (v1.26.0+k3s1, v1.25.5+k3s1, v1.24.9+k3s1, v1.23.15+k3s1).

:::

### Modo Rootless

Executar o K3s com o modo Rootless é experimental e tem vários [problemas conhecidos.](./advanced.md#known-issues-with-rootless-mode)

### Atualizando Clusters Hardened de v1.24.x para v1.25.x {#hardened-125}

O Kubernetes removeu o PodSecurityPolicy da v1.25 em favor do Pod Security Standards. Você pode ler mais sobre o PSS na [documentação upstream](https://kubernetes.io/docs/concepts/security/pod-security-standards/). Para o K3S, há algumas etapas manuais que devem ser seguidas se qualquer `PodSecurityPolicy` tiver sido configurado nos nós.

1. Em todos os nós, atualize o valor `kube-apiserver-arg` para remover o `PodSecurityPolicy` admission-plugin. Adicione o seguinte valor arg em vez disso: `'admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml'`, mas NÃO reinicie ou atualize o K3S ainda. Abaixo está um exemplo de como um arquivo de configuração pode ficar após essa atualização para o nó a ser reforçado:
```yaml
protect-kernel-defaults: true
secrets-encryption: true
kube-apiserver-arg:
  - 'admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml'
  - 'audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log'
  - 'audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml'
  - 'audit-log-maxage=30'
  - 'audit-log-maxbackup=10'
  - 'audit-log-maxsize=100'
kube-controller-manager-arg:
  - 'terminated-pod-gc-threshold=10'
  - 'use-service-account-credentials=true'
kubelet-arg:
  - 'streaming-connection-idle-timeout=5m'
```
2. Crie o arquivo `/var/lib/rancher/k3s/server/psa.yaml` com o seguinte conteúdo. Você pode querer isentar mais namespaces também. O exemplo abaixo isenta `kube-system` (obrigatório), `cis-operator-system` (opcional, mas útil para executar varreduras de segurança por meio do Rancher) e `system-upgrade` (obrigatório se estiver fazendo [Atualizações automatizadas](./upgrades/automated.md)).
```yaml
apiVersion: apiserver.config.k8s.io/v1
kind: AdmissionConfiguration
plugins:
- name: PodSecurity
  configuration:
    apiVersion: pod-security.admission.config.k8s.io/v1beta1
    kind: PodSecurityConfiguration
    defaults:
      enforce: "restricted"
      enforce-version: "latest"
      audit: "restricted"
      audit-version: "latest"
      warn: "restricted"
      warn-version: "latest"
    exemptions:
      usernames: []
      runtimeClasses: []
      namespaces: [kube-system, cis-operator-system, system-upgrade]
```
3. Execute a atualização normalmente. Se estiver fazendo [Atualizações Automatizadas](./upgrades/automated.md), certifique-se de que o namespace onde o pod `system-upgrade-controller` está sendo executado esteja configurado para ser privilegiado de acordo com os [Níveis de Segurança do Pod](https://kubernetes.io/docs/concepts/security/pod-security-admission/#pod-security-levels):
```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: system-upgrade
  labels:
    # Esse valor deve ser privilegiado para que o controlador seja executado com sucesso.
    pod-security.kubernetes.io/enforce: privileged
    pod-security.kubernetes.io/enforce-version: v1.25
    # Estamos configurando esses valores para o nosso nível _desejado_ de `enforce`, mas observe que os valores abaixo podem ser quaisquer das opções disponíveis.
    pod-security.kubernetes.io/audit: privileged
    pod-security.kubernetes.io/audit-version: v1.25
    pod-security.kubernetes.io/warn: privileged
    pod-security.kubernetes.io/warn-version: v1.25
```
4. Após a conclusão da atualização, remova quaisquer recursos PSP restantes do cluster. Em muitos casos, pode haver PodSecurityPolicies e recursos RBAC associados em arquivos personalizados usados ​​para proteção dentro de `/var/lib/rancher/k3s/server/manifests/`. Remova esses recursos e o k3s será atualizado automaticamente. Às vezes, devido ao tempo, alguns deles podem ser deixados no cluster, nesse caso você precisará excluí-los manualmente. Se o [Guia de Proteção](./security/hardening-guide.md) foi seguido anteriormente, você deve ser capaz de excluí-los por meio do seguinte:
```sh
# Obtenha os recursos associados aos PSPs
$ kubectl get roles,clusterroles,rolebindings,clusterrolebindings -A | grep -i psp

# Exclua esses recursos:
$ kubectl delete clusterrole.rbac.authorization.k8s.io/psp:restricted-psp clusterrole.rbac.authorization.k8s.io/psp:svclb-psp clusterrole.rbac.authorization.k8s.io/psp:system-unrestricted-psp clusterrolebinding.rbac.authorization.k8s.io/default:restricted-psp clusterrolebinding.rbac.authorization.k8s.io/system-unrestricted-node-psp-rolebinding && kubectl delete -n kube-system rolebinding.rbac.authorization.k8s.io/svclb-psp-rolebinding rolebinding.rbac.authorization.k8s.io/system-unrestricted-svc-acct-psp-rolebinding
```
