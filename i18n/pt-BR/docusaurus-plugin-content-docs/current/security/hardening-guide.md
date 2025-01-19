---
title: "Guia de Segurança CIS."
---

Este documento fornece orientação prescritiva para fortalecer uma instalação de produção do K3s. Ele descreve as configurações e os controles necessários para abordar os controles de benchmark do Kubernetes do Center for Internet Security (CIS).

O K3s tem uma série de mitigações de segurança aplicadas e ativadas por padrão e passará por uma série de controles do Kubernetes CIS sem modificação. Há algumas exceções notáveis ​​a isso que exigem intervenção manual para cumprir totalmente com o CIS Benchmark:

1. O K3s não modificará o sistema operacional do host. Quaisquer modificações no nível do host precisarão ser feitas manualmente.
2. Certos controles de política do CIS para `NetworkPolicies` e `PodSecurityStandards` (`PodSecurityPolicies` na v1.24 e anteriores) restringirão a funcionalidade do cluster. Você deve optar por fazer com que o K3s configure isso adicionando as opções apropriadas (habilitando plugins de admissão) aos seus sinalizadores de linha de comando ou arquivo de configuração, bem como aplicando manualmente as políticas apropriadas. Mais detalhes são apresentados nas seções abaixo.

A primeira seção (1.1) do CIS Benchmark se preocupa principalmente com as permissões e propriedade do manifesto do pod. O K3s não os utiliza para os componentes principais, pois tudo é empacotado em um único binário.

## Requisitos de Nível de Host

Há duas áreas de requisitos de nível de host: parâmetros do kernel e configuração de processo/diretório etcd. Elas são descritas nesta seção.

### Certifique-se de que `protect-kernel-defaults` esteja definido

Este é um sinalizador do kubelet que fará com que o kubelet saia se os parâmetros do kernel necessários não forem definidos ou forem definidos para valores diferentes dos padrões do kubelet.

> **Observação:** `protect-kernel-defaults` é exposto como um sinalizador de nível superior para K3s.

#### Definir Parâmetros do Kernel

Crie um arquivo chamado `/etc/sysctl.d/90-kubelet.conf` e adicione o snippet abaixo. Em seguida, execute `sysctl -p /etc/sysctl.d/90-kubelet.conf`.

```bash
vm.panic_on_oom=0
vm.overcommit_memory=1
kernel.panic=10
kernel.panic_on_oops=1
```

## Requisitos de Tempo de Execução do Kubernetes

Os requisitos de tempo de execução para cumprir com o CIS Benchmark são centralizados em torno da segurança do pod (via PSP ou PSA), políticas de rede e logs de auditoria do API Server. Eles são descritos nesta seção.

Por padrão, o K3s não inclui nenhuma segurança de pod ou políticas de rede. No entanto, o K3s é fornecido com um controlador que aplicará políticas de rede, se alguma for criada. O K3s não habilita a auditoria por padrão, portanto, a configuração do log de auditoria e a política de auditoria devem ser criadas manualmente. Por padrão, o K3s é executado com os controladores de admissão `PodSecurity` e `NodeRestriction` habilitados, entre outros.

### Segurança do Pod

<Tabs groupId="pod-sec" queryString>
<TabItem value="v1.25 and Newer" default>

O K3s v1.25 e versões mais recentes oferecem suporte a [Pod Security Admissions (PSAs)](https://kubernetes.io/docs/concepts/security/pod-security-admission/) para controlar a segurança do pod. Os PSAs são habilitados passando o seguinte sinalizador para o servidor K3s:
```
--kube-apiserver-arg="admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml"
```

A política deve ser escrita em um arquivo chamado `psa.yaml` no diretório `/var/lib/rancher/k3s/server`.

Aqui está um exemplo de um PSA compatível:
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
      namespaces: [kube-system, cis-operator-system]
```
</TabItem>
<TabItem value="v1.24 and Older" default>

O K3s v1.24 e versões mais antigas oferecem suporte a [Pod Security Policies (PSPs)](https://kubernetes.io/docs/concepts/security/pod-security-policy/) para controlar a segurança do pod. Os PSPs são habilitados passando o seguinte sinalizador para o servidor K3s:

```
--kube-apiserver-arg="enable-admission-plugins=NodeRestriction,PodSecurityPolicy"
```
Isso terá o efeito de manter o plugin `NodeRestriction`, bem como habilitar o `PodSecurityPolicy`.

Quando os PSPs são habilitados, uma política pode ser aplicada para satisfazer os controles necessários descritos na seção 5.2 do CIS Benchmark.

Aqui está um exemplo de um PSP compatível:

```yaml
apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  name: restricted-psp
spec:
  privileged: false                # CIS - 5.2.1
  allowPrivilegeEscalation: false  # CIS - 5.2.5
  requiredDropCapabilities:        # CIS - 5.2.7/8/9
    - ALL
  volumes:
    - 'configMap'
    - 'emptyDir'
    - 'projected'
    - 'secret'
    - 'downwardAPI'
    - 'csi'
    - 'persistentVolumeClaim'
    - 'ephemeral'
  hostNetwork: false               # CIS - 5.2.4
  hostIPC: false                   # CIS - 5.2.3
  hostPID: false                   # CIS - 5.2.2
  runAsUser:
    rule: 'MustRunAsNonRoot'       # CIS - 5.2.6
  seLinux:
    rule: 'RunAsAny'
  supplementalGroups:
    rule: 'MustRunAs'
    ranges:
      - min: 1
        max: 65535
  fsGroup:
    rule: 'MustRunAs'
    ranges:
      - min: 1
        max: 65535
  readOnlyRootFilesystem: false
```

Para que o PSP acima seja efetivo, precisamos criar um ClusterRole e um ClusterRoleBinding. Também precisamos incluir uma "política irrestrita do sistema", que é necessária para pods de nível de sistema que exigem privilégios adicionais, e uma política adicional que permite que sysctls necessários para o servicelb funcionem corretamente.

Combinando a configuração acima com a [Política de Rede](#networkpolicies) descrita na próxima seção, um único arquivo pode ser colocado no diretório `/var/lib/rancher/k3s/server/manifests`. Aqui está um exemplo de um arquivo `policy.yaml`:

```yaml
apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  name: restricted-psp
spec:
  privileged: false
  allowPrivilegeEscalation: false
  requiredDropCapabilities:
    - ALL
  volumes:
    - 'configMap'
    - 'emptyDir'
    - 'projected'
    - 'secret'
    - 'downwardAPI'
    - 'csi'
    - 'persistentVolumeClaim'
    - 'ephemeral'
  hostNetwork: false
  hostIPC: false
  hostPID: false
  runAsUser:
    rule: 'MustRunAsNonRoot'
  seLinux:
    rule: 'RunAsAny'
  supplementalGroups:
    rule: 'MustRunAs'
    ranges:
      - min: 1
        max: 65535
  fsGroup:
    rule: 'MustRunAs'
    ranges:
      - min: 1
        max: 65535
  readOnlyRootFilesystem: false
---
apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  name: system-unrestricted-psp
  annotations:
    seccomp.security.alpha.kubernetes.io/allowedProfileNames: '*'
spec:
  allowPrivilegeEscalation: true
  allowedCapabilities:
  - '*'
  fsGroup:
    rule: RunAsAny
  hostIPC: true
  hostNetwork: true
  hostPID: true
  hostPorts:
  - max: 65535
    min: 0
  privileged: true
  runAsUser:
    rule: RunAsAny
  seLinux:
    rule: RunAsAny
  supplementalGroups:
    rule: RunAsAny
  volumes:
  - '*'
---
apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  name: svclb-psp
  annotations:
    seccomp.security.alpha.kubernetes.io/allowedProfileNames: '*'
spec:
  allowPrivilegeEscalation: false
  allowedCapabilities:
  - NET_ADMIN
  allowedUnsafeSysctls:
  - net.ipv4.ip_forward
  - net.ipv6.conf.all.forwarding
  fsGroup:
    rule: RunAsAny
  hostPorts:
  - max: 65535
    min: 0
  runAsUser:
    rule: RunAsAny
  seLinux:
    rule: RunAsAny
  supplementalGroups:
    rule: RunAsAny
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: psp:restricted-psp
rules:
- apiGroups:
  - policy
  resources:
  - podsecuritypolicies
  verbs:
  - use
  resourceNames:
  - restricted-psp
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: psp:system-unrestricted-psp
rules:
- apiGroups:
  - policy
  resources:
  - podsecuritypolicies
  resourceNames:
  - system-unrestricted-psp
  verbs:
  - use
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: psp:svclb-psp
rules:
- apiGroups:
  - policy
  resources:
  - podsecuritypolicies
  resourceNames:
  - svclb-psp
  verbs:
  - use
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: default:restricted-psp
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: psp:restricted-psp
subjects:
- kind: Group
  name: system:authenticated
  apiGroup: rbac.authorization.k8s.io
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: system-unrestricted-node-psp-rolebinding
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: psp:system-unrestricted-psp
subjects:
- apiGroup: rbac.authorization.k8s.io
  kind: Group
  name: system:nodes
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: system-unrestricted-svc-acct-psp-rolebinding
  namespace: kube-system
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: psp:system-unrestricted-psp
subjects:
- apiGroup: rbac.authorization.k8s.io
  kind: Group
  name: system:serviceaccounts
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: svclb-psp-rolebinding
  namespace: kube-system
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: psp:svclb-psp
subjects:
- kind: ServiceAccount
  name: svclb
---
kind: NetworkPolicy
apiVersion: networking.k8s.io/v1
metadata:
  name: intra-namespace
  namespace: kube-system
spec:
  podSelector: {}
  ingress:
    - from:
      - namespaceSelector:
          matchLabels:
            name: kube-system
---
kind: NetworkPolicy
apiVersion: networking.k8s.io/v1
metadata:
  name: intra-namespace
  namespace: default
spec:
  podSelector: {}
  ingress:
    - from:
      - namespaceSelector:
          matchLabels:
            name: default
---
kind: NetworkPolicy
apiVersion: networking.k8s.io/v1
metadata:
  name: intra-namespace
  namespace: kube-public
spec:
  podSelector: {}
  ingress:
    - from:
      - namespaceSelector:
          matchLabels:
            name: kube-public
```

</TabItem>
</Tabs>


> **Observação:** As adições críticas do Kubernetes, como CNI, DNS e Ingress, são executadas como pods no namespace `kube-system`. Portanto, esse namespace terá uma política menos restritiva para que esses componentes possam ser executados corretamente.


### NetworkPolicies

O CIS exige que todos os namespaces tenham uma política de rede aplicada que limite razoavelmente o tráfego em namespaces e pods.

As políticas de rede devem ser colocadas no diretório `/var/lib/rancher/k3s/server/manifests`, onde serão automaticamente implantadas na inicialização.

Aqui está um exemplo de uma política de rede compatível.

```yaml
kind: NetworkPolicy
apiVersion: networking.k8s.io/v1
metadata:
  name: intra-namespace
  namespace: kube-system
spec:
  podSelector: {}
  ingress:
    - from:
      - namespaceSelector:
          matchLabels:
            kubernetes.io/metadata.name: kube-system
```

Com as restrições aplicadas, o DNS será bloqueado, a menos que seja permitido propositalmente. Abaixo está uma política de rede que permitirá que o tráfego exista para DNS.

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-network-dns-policy
  namespace: <NAMESPACE>
spec:
  ingress:
  - ports:
    - port: 53
      protocol: TCP
    - port: 53
      protocol: UDP
  podSelector:
    matchLabels:
      k8s-app: kube-dns
  policyTypes:
  - Ingress
```

O metrics-server e o controlador de entrada do Traefik serão bloqueados por padrão se as políticas de rede não forem criadas para permitir o acesso. O Traefik v1, conforme empacotado no K3s versão 1.20 e abaixo, usa rótulos diferentes do Traefik v2. Certifique-se de usar apenas o yaml de amostra abaixo que está associado à versão do Traefik presente no seu cluster.

<Tabs>
<TabItem value="v1.21 and Newer" default>

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-all-metrics-server
  namespace: kube-system
spec:
  podSelector:
    matchLabels:
      k8s-app: metrics-server
  ingress:
  - {}
  policyTypes:
  - Ingress
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-all-svclbtraefik-ingress
  namespace: kube-system
spec:
  podSelector:
    matchLabels:
      svccontroller.k3s.cattle.io/svcname: traefik
  ingress:
  - {}
  policyTypes:
  - Ingress
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-all-traefik-v121-ingress
  namespace: kube-system
spec:
  podSelector:
    matchLabels:
      app.kubernetes.io/name: traefik
  ingress:
  - {}
  policyTypes:
  - Ingress
---

```
</TabItem>

<TabItem value="v1.20 e anteriores" default>

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-all-metrics-server
  namespace: kube-system
spec:
  podSelector:
    matchLabels:
      k8s-app: metrics-server
  ingress:
  - {}
  policyTypes:
  - Ingress
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-all-svclbtraefik-ingress
  namespace: kube-system
spec:
  podSelector:
    matchLabels:
      svccontroller.k3s.cattle.io/svcname: traefik
  ingress:
  - {}
  policyTypes:
  - Ingress
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-all-traefik-v120-ingress
  namespace: kube-system
spec:
  podSelector:
    matchLabels:
      app: traefik
  ingress:
  - {}
  policyTypes:
  - Ingress
---

```
</TabItem>
</Tabs>

:::info
Os operadores devem gerenciar políticas de rede normalmente para namespaces adicionais que são criados.
:::


### Configuração de auditoria do servidor API

Os requisitos CIS 1.2.22 a 1.2.25 estão relacionados à configuração de logs de auditoria para o API Server. O K3s não cria por padrão o diretório de log e a política de auditoria, pois os requisitos de auditoria são específicos para as políticas e o ambiente de cada usuário.

O diretório de log, idealmente, deve ser criado antes de iniciar o K3s. Uma permissão de acesso restritiva é recomendada para evitar vazamento de informações potencialmente sensíveis.

```bash
sudo mkdir -p -m 700 /var/lib/rancher/k3s/server/logs
```

Uma política de auditoria inicial para registrar metadados de solicitação é fornecida abaixo. A política deve ser gravada em um arquivo chamado `audit.yaml` no diretório `/var/lib/rancher/k3s/server`. Informações detalhadas sobre a configuração da política para o servidor de API podem ser encontradas na [documentação](https://kubernetes.io/docs/tasks/debug/debug-cluster/audit/) do Kubernetes.

```yaml
apiVersion: audit.k8s.io/v1
kind: Policy
rules:
- level: Metadata
```

Ambas as configurações devem ser passadas como argumentos para o Servidor de API como:

<Tabs>
<TabItem value="config">

```yaml
kube-apiserver-arg:
  - 'admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml'
  - 'audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log'
  - 'audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml'
  - 'audit-log-maxage=30'
  - 'audit-log-maxbackup=10'
  - 'audit-log-maxsize=100'
```
</TabItem>
<TabItem value="cmdline">

```bash
--kube-apiserver-arg='audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log'
--kube-apiserver-arg='audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml'
```
</TabItem>

</Tabs>

O K3s deve ser reiniciado para carregar a nova configuração.

```bash
sudo systemctl daemon-reload
sudo systemctl restart k3s.service
```

## Configuração para Componentes do Kubernetes


A configuração abaixo deve ser colocada no [arquivo de configuração](../installation/configuration.md#configuration-file) e contém todas as correções necessárias para proteger os componentes do Kubernetes.


<Tabs groupId="pod-sec" queryString>
<TabItem value="v1.25 e mais recente" default>

```yaml
protect-kernel-defaults: true
secrets-encryption: true
kube-apiserver-arg:
  - "enable-admission-plugins=NodeRestriction,EventRateLimit"
  - 'admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml'
  - 'audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log'
  - 'audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml'
  - 'audit-log-maxage=30'
  - 'audit-log-maxbackup=10'
  - 'audit-log-maxsize=100'
kube-controller-manager-arg:
  - 'terminated-pod-gc-threshold=10'
kubelet-arg:
  - 'streaming-connection-idle-timeout=5m'
  - "tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305"
```

</TabItem>

<TabItem value="v1.24 e anteriores" default>

```yaml
protect-kernel-defaults: true
secrets-encryption: true
kube-apiserver-arg:
  - 'enable-admission-plugins=NodeRestriction,PodSecurityPolicy,NamespaceLifecycle,ServiceAccount'
  - 'audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log'
  - 'audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml'
  - 'audit-log-maxage=30'
  - 'audit-log-maxbackup=10'
  - 'audit-log-maxsize=100'
kube-controller-manager-arg:
  - 'terminated-pod-gc-threshold=10'
kubelet-arg:
  - 'streaming-connection-idle-timeout=5m'
  - 'make-iptables-util-chains=true'
  - "tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305"
```

</TabItem>
</Tabs>

## Operações Manuais
Os seguintes são controles que o K3s atualmente não passa com a configuração acima aplicada. Esses controles exigem intervenção manual para cumprir totalmente com o CIS Benchmark.

### Control 1.1.20
Certifique-se de que as permissões do arquivo de certificado PKI do Kubernetes estejam definidas como 600 ou mais restritivas (Manual)

<details>
<summary>Remediação</summary>
Os arquivos de certificado PKI do K3s são armazenados em `/var/lib/rancher/k3s/server/tls/` com permissão 644.
Para remediar, execute o seguinte comando:
```bash
chmod -R 600 /var/lib/rancher/k3s/server/tls/*.crt
```
</details>

### Control 1.2.9
Certifique-se de que o plugin de controle de admissão EventRateLimit esteja definido

<details>
<summary>Remediação</summary>
Siga a [documentação do Kubernetes](https://kubernetes.io/docs/reference/access-authn-authz/admission-controllers/#eventratelimit) e defina os limites desejados em um arquivo de configuração.
Para esta e outras configurações psa, esta documentação usa /var/lib/rancher/k3s/server/psa.yaml.
Em seguida, edite o arquivo de configuração do K3s /etc/rancher/k3s/config.yaml e defina os parâmetros abaixo.
```yaml
kube-apiserver-arg:
  - "enable-admission-plugins=NodeRestriction,EventRateLimit"
  - "admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml"
```
</details>

### Control 1.2.11
Certifique-se de que o plugin de controle de admissão AlwaysPullImages esteja definido

<details>
<summary>Remediação</summary>
Permissivo, conforme as diretrizes do CIS,
"Esta configuração pode impactar clusters offline ou isolados, que têm imagens pré-carregadas e
não têm acesso a um registro para extrair imagens em uso. Esta configuração não é apropriada para
clusters que usam esta configuração."
Edite o arquivo de configuração do K3s /etc/rancher/k3s/config.yaml e defina o parâmetro abaixo.
```yaml
kube-apiserver-arg:
  - "enable-admission-plugins=...,AlwaysPullImages,..."
```
</details>

### Control 1.2.21
Certifique-se de que o argumento --request-timeout esteja definido como apropriado

<details>
<summary>Remediação</summary>
Permissivo, conforme as diretrizes do CIS,
"é recomendado definir esse limite conforme apropriado e alterar o limite padrão de 60 segundos somente se necessário".
Edite o arquivo de configuração do K3s /etc/rancher/k3s/config.yaml
e defina o parâmetro abaixo se necessário. Por exemplo,
```yaml
kube-apiserver-arg:
  - "request-timeout=300s"
```
</details>

### Control 4.2.13
Garanta que um limite seja definido nos PIDs do pod

<details>
<summary>Remediação</summary>
Decida um nível apropriado para este parâmetro e defina-o,
Se estiver usando um arquivo de configuração K3s /etc/rancher/k3s/config.yaml, edite o arquivo para definir `podPidsLimit` para
```yaml
kubelet-arg:
  - "pod-max-pids=<value>"
```
</details>

### Control 5.X

Todos os controles 5.X estão relacionados à configuração de política do Kubernetes. Esses controles não são impostos pelo K3s por padrão.

Consulte [CIS 1.8 Seção 5](self-assessment-1.8.md#51-rbac-and-service-accounts) para obter mais informações sobre como criar e aplicar essas políticas.

## Conclusão

Se você seguiu este guia, seu cluster K3s será configurado para estar em conformidade com o CIS Kubernetes Benchmark. Você pode revisar o [CIS 1.8 Self-Assessment Guide](self-assessment-1.8.md) para entender as expectativas de cada uma das verificações do benchmark e como você pode fazer o mesmo em seu cluster.
