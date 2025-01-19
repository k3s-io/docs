---
title: "Armazenamento de Dados do Cluster"
---

A capacidade de executar o Kubernetes usando um datastore diferente do etcd diferencia o K3s de outras distribuições do Kubernetes. Esse recurso fornece flexibilidade aos operadores do Kubernetes. As opções de datastore disponíveis permitem que você selecione um datastore que melhor se adapte ao seu caso de uso. Por exemplo:

* Se sua equipe não tem experiência em operar o etcd, você pode escolher um banco de dados SQL de nível empresarial como MySQL ou PostgreSQL
* Se você precisa executar um cluster simples e de curta duração em seu ambiente de CI/CD, você pode usar o banco de dados SQLite incorporado
* Se você deseja implantar o Kubernetes na borda e precisa de uma solução altamente disponível, mas não pode arcar com a sobrecarga operacional de gerenciar um banco de dados na borda, você pode usar o datastore HA incorporado do K3s construído sobre o etcd incorporado.

O K3s oferece suporte às seguintes opções de armazenamento de dados:

* **Embedded [SQLite](https://www.sqlite.org/index.html)**
  O SQLite não pode ser usado em clusters com vários servidores.
  O SQLite é o datastore padrão e será usado se nenhuma outra configuração de datastore estiver presente e nenhum arquivo de banco de dados etcd incorporado estiver presente no disco.
* **Embedded etcd**
  Consulte a documentação do [High Availability Embedded etcd](ha-embedded.md) para obter mais informações sobre o uso do etcd incorporado com vários servidores.
  O etcd incorporado será selecionado automaticamente se o K3s estiver configurado para inicializar um novo cluster etcd, ingressar em um cluster etcd existente ou se os arquivos de banco de dados etcd estiverem presentes no disco durante a inicialização.
* **External Database**
  Consulte a documentação do [High Availability External DB](ha.md) para obter mais informações sobre o uso de datastores externos com vários servidores.
  Os seguintes datastores externos são suportados:
  * [etcd](https://etcd.io/) (certificado em relação à versão 3.5.4)
  * [MySQL](https://www.mysql.com) (certificado em relação às versões 5.7 e 8.0)
  * [MariaDB](https://mariadb.org/) (certificado em relação à versão 10.6.8)
  * [PostgreSQL](https://www.postgresql.org/) (certificado em relação às versões 12.16, 13.12, 14.9 e 15.4)

:::warning Suporte de Declaração Preparada
O K3s requer suporte de instruções preparadas do BD. Isso significa que poolers de conexão como [PgBouncer](https://www.pgbouncer.org/faq.html#how-to-use-prepared-statements-with-transaction-pooling) podem exigir configuração adicional para funcionar com o K3s.
:::

### Parâmetros de Configuração do Armazenamento de Dados Externo
Se você deseja usar um datastore externo como PostgreSQL, MySQL ou etcd, você deve definir o parâmetro `datastore-endpoint` para que o K3s saiba como se conectar a ele. Você também pode especificar parâmetros para configurar a autenticação e criptografia da conexão. A tabela abaixo resume esses parâmetros, que podem ser passados ​​como flags CLI ou variáveis ​​de ambiente.

| CLI Flag               | Variável de Ambiente     | Descrição                                                                                                                                                                                                                                                                                                                                                |
| ---------------------- | ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--datastore-endpoint` | `K3S_DATASTORE_ENDPOINT` | Especifique uma string de conexão PostgreSQL, MySQL ou etcd. Esta é uma string usada para descrever a conexão com o datastore. A estrutura desta string é específica para cada backend e é detalhadabelow.                                                                                                                                               |
| `--datastore-cafile`   | `K3S_DATASTORE_CAFILE`   | Arquivo TLS Certificate Authority (CA) usado para ajudar a proteger a comunicação com o datastore. Se seu datastore atender solicitações por TLS usando um certificado assinado por uma autoridade de certificação personalizada, você pode especificar essa CA usando esse parâmetro para que o cliente K3s possa verificar o certificado corretamente. |
| `--datastore-certfile` | `K3S_DATASTORE_CERTFILE` | Arquivo de certificado TLS usado para autenticação baseada em certificado de cliente para seu datastore. Para usar esse recurso, seu datastore deve ser configurado para suportar autenticação baseada em certificado de cliente. Se você especificar esse parâmetro, também deverá especificar o parâmetro `datastore-keyfile`.                         |
| `--datastore-keyfile`  | `K3S_DATASTORE_KEYFILE`  | Arquivo de chave TLS usado para autenticação baseada em certificado de cliente para seu datastore. Veja o parâmetro `datastore-certfile` anterior para mais detalhes.                                                                                                                                                                                    |

Como prática recomendada, recomendamos definir esses parâmetros como variáveis ​​de ambiente em vez de argumentos de linha de comando para que suas credenciais de banco de dados ou outras informações confidenciais não sejam expostas como parte das informações do processo.

### Formato e Funcionalidade do Ponto de Extremidade do Datastore
Conforme mencionado, o formato do valor passado para o parâmetro `datastore-endpoint` depende do backend do datastore. O seguinte detalha esse formato e funcionalidade para cada datastore externo suportado.

<Tabs queryString="ext-db">
<TabItem value="PostgreSQL">

  Em sua forma mais comum, o parâmetro datastore-endpoint para PostgreSQL tem o seguinte formato:

  `postgres://username:password@hostname:port/database-name`

  Mais parâmetros de configuração avançados estão disponíveis. Para obter mais informações sobre eles, consulte https://godoc.org/github.com/lib/pq.

  Se você especificar um nome de banco de dados e ele não existir, o servidor tentará criá-lo.

  Se você fornecer apenas `postgres://` como o endpoint, o K3s tentará fazer o seguinte:

  - Conectar ao host local usando `postgres` como nome de usuário e senha
  - Criar um banco de dados chamado `kubernetes`

</TabItem>
<TabItem value="MySQL / MariaDB">

  Em sua forma mais comum, o parâmetro `datastore-endpoint` para MySQL e MariaDB tem o seguinte formato:

  `mysql://username:password@tcp(hostname:3306)/database-name`

  Mais parâmetros de configuração avançados estão disponíveis. Para obter mais informações sobre eles, consulte https://github.com/go-sql-driver/mysql#dsn-data-source-name

  Observe que, devido a um [problema conhecido](https://github.com/k3s-io/k3s/issues/1093) no K3s, você não pode definir o parâmetro `tls`. A comunicação TLS é suportada, mas você não pode, por exemplo, definir este parâmetro como "skip-verify" para fazer com que o K3s ignore a verificação do certificado.

  Se você especificar um nome de banco de dados e ele não existir, o servidor tentará criá-lo.

  Se você fornecer apenas `mysql://` como endpoint, o K3s tentará fazer o seguinte:

  - Conectar ao socket MySQL em `/var/run/mysqld/mysqld.sock` usando o usuário `root` e nenhuma senha
  - Criar um banco de dados com o nome `kubernetes`
</TabItem>

<TabItem value="etcd">

  Em sua forma mais comum, o parâmetro `datastore-endpoint` para etcd tem o seguinte formato:

  `https://etcd-host-1:2379,https://etcd-host-2:2379,https://etcd-host-3:2379`

  O acima assume um cluster típico de três nós etcd. O parâmetro pode aceitar mais uma URL etcd separada por vírgula.

</TabItem>
</Tabs>
