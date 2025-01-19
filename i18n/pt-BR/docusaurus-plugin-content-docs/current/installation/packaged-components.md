---
title: "Gerenciando Componentes Empacotados"
---

## Implantação Automática de Manifests (AddOns)

Em nós de servidor, qualquer arquivo encontrado em `/var/lib/rancher/k3s/server/manifests` será automaticamente implantado no Kubernetes de uma maneira similar a `kubectl apply`, tanto na inicialização quanto quando o arquivo for alterado no disco. Excluir arquivos deste diretório não excluirá os recursos correspondentes do cluster.

Os manifestos são rastreados como recursos personalizados `AddOn` no namespace `kube-system`. Quaisquer erros ou avisos encontrados ao aplicar o arquivo manifesto podem ser vistos usando `kubectl describe` no `AddOn` correspondente ou usando `kubectl get event -n kube-system` para visualizar todos os eventos para esse namespace, incluindo aqueles do controlador de implantação.

### Componentes Empacotados

O K3s vem com vários componentes empacotados que são implantados como AddOns por meio do diretório manifests: `coredns`, `traefik`, `local-storage` e `metrics-server`. O controlador LoadBalancer `servicelb` incorporado não tem um arquivo manifest, mas pode ser desabilitado como se fosse um `AddOn` por motivos históricos.

Manifestos para componentes empacotados são gerenciados pelo K3s e não devem ser alterados. Os arquivos são reescritos no disco sempre que o K3s é iniciado, para garantir sua integridade.

### AddOns do Usuário

Você pode colocar arquivos adicionais no diretório manifests para implantação como um `AddOn`. Cada arquivo pode conter vários recursos do Kubernetes, delimitados pelo separador de documentos YAML `---`. Para obter mais informações sobre como organizar recursos em manifests, consulte a seção [Gerenciando recursos](https://kubernetes.io/docs/concepts/cluster-administration/manage-deployment/) da documentação do Kubernetes.

#### Requisitos de Nomeação de Arquivos

O nome `AddOn` para cada arquivo no diretório manifest é derivado do nome base do arquivo.
Certifique-se de que todos os arquivos dentro do diretório manifests (ou dentro de quaisquer subdiretórios) tenham nomes exclusivos e sigam as [restrições de nomenclatura de objetos](https://kubernetes.io/docs/concepts/overview/working-with-objects/names/) do Kubernetes.
Também deve-se tomar cuidado para não entrar em conflito com nomes em uso pelos componentes empacotados padrão do K3s, mesmo que esses componentes estejam desabilitados.

Aqui está um exemplo de um erro que seria relatado se o nome do arquivo contivesse sublinhados:
> `Failed to process config: failed to process /var/lib/rancher/k3s/server/manifests/example_manifest.yaml:
   Addon.k3s.cattle.io "example_manifest" is invalid: metadata.name: Invalid value: "example_manifest":
   a lowercase RFC 1123 subdomain must consist of lower case alphanumeric characters, '-' or '.', and must start and end with an alphanumeric character
   (e.g. 'example.com', regex used for validation is '[a-z0-9]([-a-z0-9]*[a-z0-9])?(\\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*')`

:::danger
Se você tiver vários nós de servidor e colocar manifestos AddOn adicionais em mais de um servidor, é sua responsabilidade garantir que os arquivos permaneçam sincronizados entre esses nós. O K3s não sincroniza o conteúdo do AddOn entre os nós e não pode garantir o comportamento correto se servidores diferentes tentarem implantar manifestos conflitantes.
:::

## Desabilitando Manifests

Há duas maneiras de desabilitar a implantação de conteúdo específico do diretório de manifestos.

### Usando a flag `--disable`

Os AddOns para componentes empacotados listados acima, além dos AddOns para quaisquer manifestos adicionais colocados no diretório `manifests`, podem ser desabilitados com o sinalizador `--disable`. Os AddOns desabilitados são ativamente desinstalados do cluster, e os arquivos de origem são excluídos do diretório `manifests`.

Por exemplo, para desabilitar o traefik de ser instalado em um novo cluster, ou para desinstalá-lo e remover o manifesto de um cluster existente, você pode iniciar o K3s com `--disable=traefik`. Vários itens podem ser desabilitados separando seus nomes com vírgulas, ou repetindo o sinalizador.

### Usando arquivos .skip

Para qualquer arquivo em `/var/lib/rancher/k3s/server/manifests`, você pode criar um arquivo `.skip` que fará com que o K3s ignore o manifesto correspondente. O conteúdo do arquivo `.skip` não importa, apenas sua existência é verificada. Observe que criar um arquivo `.skip` após um AddOn já ter sido criado não o removerá ou modificará de outra forma ou os recursos que ele criou; o arquivo é simplesmente tratado como se não existisse.

Por exemplo, criar um arquivo `traefik.yaml.skip` vazio no diretório de manifestos antes do K3s ser iniciado pela primeira vez fará com que o K3s ignore a implantação de `traefik.yaml`:
```bash
$ ls /var/lib/rancher/k3s/server/manifests
ccm.yaml      local-storage.yaml  rolebindings.yaml  traefik.yaml.skip
coredns.yaml  traefik.yaml

$ kubectl get pods -A
NAMESPACE     NAME                                     READY   STATUS    RESTARTS   AGE
kube-system   local-path-provisioner-64ffb68fd-xx98j   1/1     Running   0          74s
kube-system   metrics-server-5489f84d5d-7zwkt          1/1     Running   0          74s
kube-system   coredns-85cb69466-vcq7j                  1/1     Running   0          74s
```

Se o Traefik já tivesse sido implantado antes da criação do arquivo `traefik.skip`, o Traefik permaneceria como está e não seria afetado por atualizações futuras quando o K3s fosse atualizado.

## Helm AddOns

Para obter informações sobre como gerenciar gráficos do Helm por meio de manifestos de implantação automática, consulte a seção sobre [Helm.](../helm.md)