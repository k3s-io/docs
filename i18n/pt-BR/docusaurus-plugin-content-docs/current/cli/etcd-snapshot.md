---
title: etcd-snapshot
---

# k3s etcd-snapshot

Esta página documenta o gerenciamento de snapshots do etcd usando a CLI `k3s etcd-snapshot`, bem como a configuração de snapshots agendados do etcd para o processo `k3s server` e o uso do comando `k3s server --cluster-reset` para redefinir a associação do cluster etcd e, opcionalmente, restaurar snapshots do etcd.

## Criando Snapshots

Os snapshots são salvos no caminho definido pelo valor `--etcd-snapshot-dir` do servidor, que tem como padrão `${data-dir}/server/db/snapshots`. O valor data-dir tem como padrão `/var/lib/rancher/k3s` e pode ser alterado independentemente definindo o sinalizador `--data-dir`.

### Snapshots Agendados

Os snapshots agendados são habilitados por padrão, às 00:00 e 12:00, horário do sistema, com 5 snapshots retidos. Para configurar o intervalo de snapshot ou o número de snapshots retidos, consulte as [opções de configuração de snapshot](#snapshot-configuration-options).

Os snapshots agendados têm um nome que começa com `etcd-snapshot`, seguido pelo nome do nó e timestamp. O nome base pode ser alterado com o sinalizador `--etcd-snapshot-name` na configuração do servidor.

### Snapshots Sob Demanda

Os snapshots podem ser salvos manualmente executando o comando `k3s etcd-snapshot save`.

Os snapshots sob demanda têm um nome que começa com `on-demand`, seguido pelo nome do nó e pelo registro de data e hora. O nome base pode ser alterado com o sinalizador `--name` ao salvar o snapshot.

### Opções de Configuração do Snapshot

Esses sinalizadores podem ser passados ​​para o comando `k3s server` para redefinir o cluster etcd e, opcionalmente, restaurar a partir de um snapshot.

| Flag                           | Descrição                                                                                                                                            |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--cluster-reset`              | Esqueça todos os pares e torne-se o único membro de um novo cluster. Isso também pode ser definido com a variável de ambiente `[$K3S_CLUSTER_RESET]` |
| `--cluster-reset-restore-path` | Caminho para o arquivo de instantâneo a ser restaurado                                                                                               |

Esses sinalizadores são válidos para `k3s server` e `k3s etcd-snapshot`, no entanto, quando passados ​​para `k3s etcd-snapshot`, o prefixo `--etcd-` pode ser omitido para evitar redundância.
Os sinalizadores podem ser passados ​​com a linha de comando ou no [arquivo de configuração,](../installation/configuration.md#configuration-file ) que pode ser mais fácil de usar.

| Flag                            | Descrição                                                                                              |
| ------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `--etcd-disable-snapshots`      | Desativar snapshots agendados                                                                          |
| `--etcd-snapshot-compress`      | Compactação etcd snapshots                                                                             |
| `--etcd-snapshot-dir`           | Diretório para salvar instantâneos do banco de dados. (Localização padrão: `${data-dir}/db/snapshots`) |
| `--etcd-snapshot-retention`     | Número de snapshots para reter (default: 5)                                                            |
| `--etcd-snapshot-schedule-cron` | Tempo de intervalo da execução do snapshot, ex: a cada 5 horas `0 */5 * * *` (default: `0 */12 * * *`) |

### Suporte de armazenamento de objetos compatível com S3

O K3s suporta a gravação de snapshots etcd e a restauração de snapshots etcd de armazenamentos de objetos compatíveis com S3. O suporte S3 está disponível para snapshots sob demanda e agendados.

| Flag                        | Descrição                                                                                                                                          |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--etcd-s3`                 | Habilitar backup para S3                                                                                                                           |
| `--etcd-s3-endpoint`        | S3 endpoint url                                                                                                                                    |
| `--etcd-s3-endpoint-ca`     | Certificado CA customizado para endpoint S3                                                                                                        |
| `--etcd-s3-skip-ssl-verify` | Desativa a validação de certificado SSL com S3                                                                                                     |
| `--etcd-s3-access-key`      | Chave de acesso S3                                                                                                                                 |
| `--etcd-s3-secret-key`      | Segredo de acesso S3                                                                                                                               |
| `--etcd-s3-bucket`          | Nome do bucket S3                                                                                                                                  |
| `--etcd-s3-region`          | Região S3 / localização do bucket (opcional). O padrão é us-east-1                                                                                 |
| `--etcd-s3-folder`          | Pasta S3                                                                                                                                           |
| `--etcd-s3-proxy`           | Servidor proxy a ser usado ao conectar ao S3, substituindo quaisquer variáveis ​​de ambiente relacionadas ao proxy                                 |
| `--etcd-s3-insecure`        | Desabilita S3 sobre HTTPS                                                                                                                          |
| `--etcd-s3-timeout`         | S3 timeout (default: `5m0s`)                                                                                                                       |
| `--etcd-s3-config-secret`   | Secret name no namespace kube-system usado para configurar o S3, se o etcd-s3 estiver habilitado e nenhuma outra opção do etcd-s3 estiver definida |

Para executar um instantâneo etcd sob demanda e salvá-lo no S3:

```bash
k3s etcd-snapshot save \
  --s3 \
  --s3-bucket=<S3-BUCKET-NAME> \
  --s3-access-key=<S3-ACCESS-KEY> \
  --s3-secret-key=<S3-SECRET-KEY>
```

Para executar uma restauração de snapshot etcd sob demanda do S3, primeiro certifique-se de que o K3s não esteja em execução. Em seguida, execute os seguintes comandos:

```bash
k3s server \
  --cluster-init \
  --cluster-reset \
  --etcd-s3 \
  --cluster-reset-restore-path=<SNAPSHOT-NAME> \
  --etcd-s3-bucket=<S3-BUCKET-NAME> \
  --etcd-s3-access-key=<S3-ACCESS-KEY> \
  --etcd-s3-secret-key=<S3-SECRET-KEY>
```

### Suporte Secret de Configuração S3

:::info Nota de Versão
O suporte ao S3 Configuration Secret está disponível a partir das versões de agosto de 2024: v1.30.4+k3s1, v1.29.8+k3s1, v1.28.13+k3s1
:::

O K3s suporta a leitura da configuração de snapshot etcd S3 de um Kubernetes Secret.
Isso pode ser preferível à codificação rígida de credenciais em flags CLI do K3s ou arquivos de configuração por motivos de segurança, ou se as credenciais precisarem ser rotacionadas sem reiniciar o K3s.
Para passar a configuração de snapshot S3 por meio de um Secret, inicie o K3s com `--etcd-s3` e `--etcd-s3-config-secret=<SECRET-NAME>`.
O Secret não precisa existir quando o K3s é iniciado, mas será verificado sempre que uma operação de salvar/listar/excluir/remoção de snapshot for realizada.

O S3 config Secret não pode ser usado ao restaurar um snapshot, pois o apiserver não está disponível para fornecer o segredo durante uma restauração.
A configuração do S3 deve ser passada via CLI ao restaurar um snapshot armazenado no S3.

:::note
Passe apenas os flags `--etcd-s3` e `--etcd-s3-config-secret` para habilitar o Secret.
Se quaisquer outros flags de configuração S3 forem definidos, o Secret será ignorado.
:::

As chaves no Secret correspondem aos sinalizadores CLI `--etcd-s3-*` listados acima.
A chave `etcd-s3-endpoint-ca` aceita um pacote CA codificado em PEM, ou a chave `etcd-s3-endpoint-ca-name` pode ser usada para especificar o nome de um ConfigMap no namespace `kube-system` contendo um ou mais pacotes CA codificados em PEM.

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: k3s-etcd-snapshot-s3-config
  namespace: kube-system
type: etcd.k3s.cattle.io/s3-config-secret
stringData:
  etcd-s3-endpoint: ""
  etcd-s3-endpoint-ca: ""
  etcd-s3-endpoint-ca-name: ""
  etcd-s3-skip-ssl-verify: "false"
  etcd-s3-access-key: "AWS_ACCESS_KEY_ID"
  etcd-s3-secret-key: "AWS_SECRET_ACCESS_KEY"
  etcd-s3-bucket: "bucket"
  etcd-s3-folder: "folder"
  etcd-s3-region: "us-east-1"
  etcd-s3-insecure: "false"
  etcd-s3-timeout: "5m"
  etcd-s3-proxy: ""
```

## Gerenciado Snapshots

O k3s suporta um conjunto de subcomandos para trabalhar com seus instantâneos do etcd.

| Subcomando  | Descrição                                                        |
| ----------- | ---------------------------------------------------------------- |
| delete      | Excluir snapshots                                                |
| ls, list, l | Listar snapshots                                                 |
| prune       | Remover snapshots que excedem a contagem de retenção configurada |
| save        | Aciona de imediato snapshot do etcd                              |

Esses comandos funcionarão conforme o esperado, independentemente de os snapshots etcd serem armazenados localmente ou em um armazenamento de objetos compatível com S3.

Para obter informações adicionais sobre os subcomandos etcd snapshot, execute `k3s etcd-snapshot --help`.

Excluir um snapshot do S3.

```bash
k3s etcd-snapshot delete          \
  --s3                            \
  --s3-bucket=<S3-BUCKET-NAME>    \
  --s3-access-key=<S3-ACCESS-KEY> \
  --s3-secret-key=<S3-SECRET-KEY> \
  <SNAPSHOT-NAME>
```

Podar snapshots locais com a política de retenção padrão (5). O subcomando `prune` recebe um sinalizador adicional `--snapshot-retention` que permite substituir a política de retenção padrão.

```bash
k3s etcd-snapshot prune
```

```bash
k3s etcd-snapshot prune --snapshot-retention 10
```

### Recursos Customizados ETCDSnapshotFile

:::info Nota de Versão
Os arquivos ETCDSnapshot estão disponíveis a partir das versões de novembro de 2023: v1.28.4+k3s2, v1.27.8+k3s2, v1.26.11+k3s2, v1.25.16+k3s4
:::

Os snapshots podem ser visualizados remotamente usando qualquer cliente Kubernetes listando ou descrevendo recursos `ETCDSnapshotFile` com escopo de cluster.
Ao contrário do comando `k3s etcd-snapshot list`, que mostra apenas snapshots visíveis para aquele nó, os recursos `ETCDSnapshotFile` rastreiam todos os snapshots presentes nos membros do cluster.

```console
root@k3s-server-1:~# kubectl get etcdsnapshotfile
NAME                                             SNAPSHOTNAME                        NODE           LOCATION                                                                            SIZE      CREATIONTIME
local-on-demand-k3s-server-1-1730308816-3e9290   on-demand-k3s-server-1-1730308816   k3s-server-1   file:///var/lib/rancher/k3s/server/db/snapshots/on-demand-k3s-server-1-1730308816   2891808   2024-10-30T17:20:16Z
s3-on-demand-k3s-server-1-1730308816-79b15c      on-demand-k3s-server-1-1730308816   s3             s3://etcd/k3s-test/on-demand-k3s-server-1-1730308816                                2891808   2024-10-30T17:20:16Z
```

```console
root@k3s-server-1:~# kubectl describe etcdsnapshotfile s3-on-demand-k3s-server-1-1730308816-79b15c
Name:         s3-on-demand-k3s-server-1-1730308816-79b15c
Namespace:
Labels:       etcd.k3s.cattle.io/snapshot-storage-node=s3
Annotations:  etcd.k3s.cattle.io/snapshot-token-hash: b4b83cda3099
API Version:  k3s.cattle.io/v1
Kind:         ETCDSnapshotFile
Metadata:
  Creation Timestamp:  2024-10-30T17:20:16Z
  Finalizers:
    wrangler.cattle.io/managed-etcd-snapshots-controller
  Generation:        1
  Resource Version:  790
  UID:               bec9a51c-dbbe-4746-922e-a5136bef53fc
Spec:
  Location:   s3://etcd/k3s-test/on-demand-k3s-server-1-1730308816
  Node Name:  s3
  s3:
    Bucket:           etcd
    Endpoint:         s3.example.com
    Prefix:           k3s-test
    Region:           us-east-1
    Skip SSL Verify:  true
  Snapshot Name:      on-demand-k3s-server-1-1730308816
Status:
  Creation Time:  2024-10-30T17:20:16Z
  Ready To Use:   true
  Size:           2891808
Events:
  Type    Reason               Age   From            Message
  ----    ------               ----  ----            -------
  Normal  ETCDSnapshotCreated  113s  k3s-supervisor  Snapshot on-demand-k3s-server-1-1730308816 saved on S3
```


## Restaurando Snapshots

O K3s executa várias etapas ao restaurar um snapshot:
1. Se o snapshot estiver armazenado no S3, o arquivo será baixado para o diretório do snapshot.
2. Se o snapshot estiver compactado, ele será descompactado.
3. Se presentes, os arquivos de banco de dados etcd atuais serão movidos para `${data-dir}/server/db/etcd-old-$TIMESTAMP/`.
4. O conteúdo do snapshot é extraído para o disco e a soma de verificação é verificada.
5. O etcd é iniciado e todos os membros do cluster etcd, exceto o nó atual, são removidos do cluster.
6. Os certificados CA e outros dados confidenciais são extraídos do armazenamento de dados e gravados no disco para uso posterior.
7. A restauração é concluída e o K3s pode ser reiniciado e usado normalmente no servidor onde a restauração foi realizada.
8. (opcional) Os agentes e servidores do plano de controle podem ser iniciados normalmente.
8. (opcional) Os servidores Etcd podem ser reiniciados para se juntarem novamente ao cluster após a remoção dos arquivos antigos do banco de dados.

### Etapas para Restauração do Snapshot

Selecione a aba abaixo que corresponde à configuração do seu cluster.

<Tabs queryString="etcdsnap">
<TabItem value="Servidor Único">

1. Pare o serviço K3s:
    ```bash
    systemctl stop k3s
    ```

2. Execute `k3s server` com o sinalizador `--cluster-reset` e `--cluster-reset-restore-path` indicando o caminho para o snapshot a ser restaurado.
    Se o snapshot estiver armazenado no S3, forneça sinalizadores de configuração do S3 (`--etcd-s3`, `--etcd-s3-bucket` e assim por diante) e forneça apenas o nome do arquivo do snapshot como o caminho de restauração.

    :::note
    Usar o sinalizador `--cluster-reset` sem especificar um snapshot para restaurar simplesmente redefine o cluster etcd para um único membro sem restaurar um snapshot.
    :::

    ```bash
    k3s server \
      --cluster-reset \
      --cluster-reset-restore-path=<PATH-TO-SNAPSHOT>
    ```

    **Resultado:** O K3s restaura o snapshot e redefine a associação ao cluster, então imprime uma mensagem indicando que ele está pronto para ser reiniciado:
    `A associação ao cluster etcd gerenciado foi redefinida, reinicie sem o sinalizador --cluster-reset agora.`

3. Inicie K3s novamente:
    ```bash
    systemctl start k3s
    ```
</TabItem>
<TabItem value="Múltiplos Servidores">

Neste exemplo, há 3 servidores, `S1`, `S2` e `S3`. O snapshot está localizado em `S1`.

1. Para K3s em todos os servidores:
    ```bash
    systemctl stop k3s
    ```

2. No S1, execute `k3s server` com a opção `--cluster-reset` e `--cluster-reset-restore-path` indicando o caminho para o snapshot a ser restaurado.
   Se o snapshot estiver armazenado no S3, forneça os sinalizadores de configuração do S3 (`--etcd-s3`, `--etcd-s3-bucket` e assim por diante) e forneça apenas o nome do arquivo do snapshot como o caminho de restauração.

    :::note
    Usar o sinalizador `--cluster-reset` sem especificar um snapshot para restaurar simplesmente redefine o cluster etcd para um único membro sem restaurar um snapshot.
    :::

    ```bash
    k3s server \
      --cluster-reset \
      --cluster-reset-restore-path=<PATH-TO-SNAPSHOT>
    ```

    **Resultado:** O K3s restaura o snapshot e redefine a associação ao cluster, então imprime uma mensagem indicando que ele está pronto para ser reiniciado:
    `A associação ao cluster etcd gerenciado foi redefinida, reinicie sem o sinalizador --cluster-reset agora.`
    `Faça backup e exclua ${datadir}/server/db em cada servidor etcd peer e reuna os nós.`

1. No S1, comece K3s novamente:
    ```bash
    systemctl start k3s
    ```

2. No S2 e S3, exclua o diretório de dados, `/var/lib/rancher/k3s/server/db/`:
    ```bash
    rm -rf /var/lib/rancher/k3s/server/db/
    ```

3. Em S2 e S3, inicie o K3s novamente para ingressar no cluster restaurado:
    ```bash
    systemctl start k3s
    ```
</TabItem>
</Tabs>
