---
title: Helm
---

O Helm é a ferramenta de gerenciamento de pacotes de escolha para o Kubernetes. Os Helm charts fornecem sintaxe de modelo para documentos de manifesto YAML do Kubernetes. Com o Helm, os desenvolvedores ou administradores de cluster podem criar modelos configuráveis ​​conhecidos como Charts, em vez de usar apenas manifestos estáticos. Para obter mais informações sobre como criar seu próprio catálogo Chart, confira os documentos em [https://helm.sh/docs/intro/quickstart/](https://helm.sh/docs/intro/quickstart/).

O K3s não requer nenhuma configuração especial para suportar o Helm. Apenas certifique-se de ter definido corretamente o caminho do kubeconfig conforme a documentação [cluster access](./cluster-access.md).

O K3s inclui um [Helm Controller](https://github.com/k3s-io/helm-controller/) que gerencia a instalação, atualização/reconfiguração e desinstalação de Helm charts usando uma Definição de Recurso Personalizada (CRD) do HelmChart. Emparelhado com [manifestos AddOn de implantação automática](./installation/packaged-components.md), a instalação de um Helm charts no seu cluster pode ser automatizada criando um único arquivo no disco.

### Usando o Controlador Helm

O [HelmChart Custom Resource](https://github.com/k3s-io/helm-controller#helm-controller) captura a maioria das opções que você normalmente passaria para a ferramenta de linha de comando `helm`. Aqui está um exemplo de como você pode implantar o Apache do repositório chart da Bitnami, substituindo alguns dos valores do chart padrão. Observe que o próprio recurso HelmChart está no namespace `kube-system`, mas os recursos do chart serão implantados no namespace `web`, que é criado no mesmo manifesto. Isso pode ser útil se você quiser manter seus recursos HelmChart separados dos recursos que eles implantam.

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: web
---
apiVersion: helm.cattle.io/v1
kind: HelmChart
metadata:
  name: apache
  namespace: kube-system
spec:
  repo: https://charts.bitnami.com/bitnami
  chart: apache
  targetNamespace: web
  valuesContent: |-
    service:
      type: ClusterIP
    ingress:
      enabled: true
      hostname: www.example.com
    metrics:
      enabled: true
```

Um exemplo de implantação de um helm chart de um repositório privado com autenticação:

```yaml
apiVersion: helm.cattle.io/v1
kind: HelmChart
metadata:
  namespace: kube-system
  name: example-app
spec:
  targetNamespace: example-space
  createNamespace: true
  version: v1.2.3
  chart: example-app
  repo: https://secure-repo.example.com
  authSecret:
    name: example-repo-auth
  repoCAConfigMap:
    name: example-repo-ca
  valuesContent: |-
    image:
      tag: v1.2.2
---
apiVersion: v1
kind: Secret
metadata:
  namespace: kube-system
  name: example-repo-auth
type: kubernetes.io/basic-auth
stringData:
  username: user
  password: pass
---
apiVersion: v1
kind: ConfigMap
metadata:
  namespace: kube-system
  name: example-repo-ca
data:
  ca.crt: |-
    -----BEGIN CERTIFICATE-----
    <YOUR CERTIFICATE>
    -----END CERTIFICATE-----
```

#### Definições de Campo do HelmChart

| Campo                     | Padrão    | Descrição                                                                                                                                                                        | Argumento do Helm / Equivalente de sinalizador |
| ------------------------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| metadata.name             |           | Nome do Helm Chart                                                                                                                                                               | NOME                                           |
| spec.chart                |           | Nome do Helm Chart no repositório ou URL HTTPS completa para o arquivo do gráfico (.tgz)                                                                                         | CHART                                          |
| spec.targetNamespace      | default   | Namespace de destino do Helm Chart                                                                                                                                               | `--namespace`                                  |
| spec.createNamespace      | false     | Cria namespace de destino se não estiver presente                                                                                                                                | `--create-namespace`                           |
| spec.version              |           | Versão do Helm Chart (ao instalar do repositório)                                                                                                                                | `--version`                                    |
| spec.repo                 |           | URL do repositório do Helm Chart                                                                                                                                                 | `--repo`                                       |
| spec.repoCA               |           | Verifica certificados de servidores habilitados para HTTPS usando este pacote CA. Deve ser uma sequência contendo um ou mais Certificados CA codificados em PEM.                 | `--ca-file`                                    |
| spec.repoCAConfigMap      |           | Referência a um ConfigMap contendo Certificados CA confiáveis ​​pelo Helm. Pode ser usado junto com ou em vez de `repoCA`                                                        | `--ca-file`                                    |
| spec.helmVersion          | v3        | Versão do Helm a ser usada (`v2` ou `v3`)                                                                                                                                        |                                                |
| spec.bootstrap            | False     | Defina como True se este gráfico for necessário para inicializar o cluster (Cloud Controller Manager, etc.)                                                                      |                                                |
| spec.set                  |           | Substitui valores de gráfico padrão simples. Eles têm precedência sobre opções definidas via valuesContent.                                                                      | `--set` / `--set-string`                       |
| spec.jobImage             |           | Especifique a imagem a ser usada ao instalar o gráfico do Helm. Por exemplo, rancher/klipper-helm:v0.3.0 .                                                                       |                                                |
| spec.backOffLimit         | 1000      | Especifique o número de tentativas antes de considerar que um trabalho falhou.                                                                                                   |                                                |
| spec.timeout              | 300s      | Tempo limite para operações do Helm, como uma [string de duração](https://pkg.go.dev/time#ParseDuration) (`300s`, `10m`, `1h`, etc)                                              | `--timeout`                                    |
| spec.failurePolicy        | reinstall | Defina como `abort`, caso em que a operação do Helm é abortada, aguardando intervenção manual do operador.                                                                       |                                                |
| spec.authSecret           |           | Referência ao segredo do tipo `kubernetes.io/basic-auth` que contém credenciais de autenticação básica para o repositório Chart.                                                 |                                                |
| spec.authPassCredentials  | false     | Passe credenciais de autenticação básica para todos os domínios.                                                                                                                 | `--pass-credentials`                           |
| spec.dockerRegistrySecret |           | Referência ao segredo do tipo `kubernetes.io/dockerconfigjson` que contém credenciais de autenticação do Docker para o registro baseado em OCI atuando como o repositório Chart. |                                                |
| spec.valuesContent        |           | Substituir valores Chart padrão complexos via conteúdo de arquivo YAML                                                                                                           | `--values`                                     |
| spec.chartContent         |           | Arquivo de chart codificado em Base64 .tgz - substitui spec.chart                                                                                                                | CHART                                          |

O conteúdo colocado em `/var/lib/rancher/k3s/server/static/` pode ser acessado anonimamente por meio do Kubernetes APIServer de dentro do cluster. Esta URL pode ser modelada usando a variável especial `%{KUBERNETES_API}%` no campo `spec.chart`. Por exemplo, o componente Traefik empacotado carrega seu gráfico de `https://%{KUBERNETES_API}%/static/charts/traefik-12.0.000.tgz`.

:::note
O campo `name` deve seguir as convenções de nomenclatura do gráfico Helm. Consulte a [documentação de práticas recomendadas do Helm](https://helm.sh/docs/chart_best_practices/conventions/#chart-names) para saber mais.
:::

### Personalizando Componentes Empacotados com HelmChartConfig

Para permitir a substituição de valores para componentes empacotados que são implantados como HelmCharts (como Traefik), o K3s oferece suporte à personalização de implantações por meio de recursos HelmChartConfig. O recurso HelmChartConfig deve corresponder ao nome e ao namespace do HelmChart correspondente e oferece suporte ao fornecimento de `valuesContent` adicional, que é passado para o comando `helm` como um arquivo de valor adicional.

:::note
Os valores `spec.set` do HelmChart substituem as configurações `spec.valuesContent` do HelmChart e HelmChartConfig.
:::

Por exemplo, para personalizar a configuração de entrada do Traefik empacotada, você pode criar um arquivo chamado `/var/lib/rancher/k3s/server/manifests/traefik-config.yaml` e preenchê-lo com o seguinte conteúdo:

```yaml
apiVersion: helm.cattle.io/v1
kind: HelmChartConfig
metadata:
  name: traefik
  namespace: kube-system
spec:
  valuesContent: |-
    image:
      name: traefik
      tag: 2.9.10
    ports:
      web:
        forwardedHeaders:
          trustedIPs:
            - 10.0.0.0/8
```

### Migrando do Helm v2

O K3s pode lidar com o Helm v2 ou o Helm v3. Se você deseja migrar para o Helm v3, [esta](https://helm.sh/blog/migrate-from-helm-v2-to-helm-v3/) postagem do blog do Helm explica como usar um plugin para migrar com sucesso. Consulte a documentação oficial do Helm 3 [aqui](https://helm.sh/docs/) para obter mais informações. Apenas certifique-se de ter definido corretamente seu kubeconfig conforme a seção sobre [acesso ao cluster.](./cluster-access.md)

:::note
O Helm 3 não requer mais o Tiller e o comando `helm init`. Consulte a documentação oficial para obter detalhes.
:::