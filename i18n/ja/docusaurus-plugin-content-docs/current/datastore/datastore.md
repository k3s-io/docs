---
title: "クラスタデータストア"
---

K3sが他のKubernetesディストリビューションと異なる点は、etcd以外のデータストアを使用してKubernetesを実行できる能力です。この機能はKubernetesオペレーターに柔軟性を提供します。利用可能なデータストアオプションにより、ユースケースに最適なデータストアを選択できます。例えば：

* チームにetcdの運用経験がない場合、MySQLやPostgreSQLのようなエンタープライズグレードのSQLデータベースを選択できます。
* CI/CD環境でシンプルで短期間のクラスタを実行する必要がある場合、組み込みのSQLiteデータベースを使用できます。
* エッジでKubernetesをデプロイし、高可用性のソリューションが必要だが、エッジでデータベースを管理する運用負荷を負えない場合、組み込みのetcdをベースにしたK3sの組み込みHAデータストアを使用できます。

K3sは以下のデータストアオプションをサポートしています：

* **組み込み [SQLite](https://www.sqlite.org/index.html)**  
  SQLiteは複数のサーバーを持つクラスタでは使用できません。  
  SQLiteはデフォルトのデータストアであり、他のデータストアの設定が存在せず、ディスク上に組み込みetcdデータベースファイルが存在しない場合に使用されます。
* **組み込みetcd**  
  複数のサーバーで組み込みetcdを使用する方法については、[高可用性組み込みetcd](ha-embedded.md)のドキュメントを参照してください。  
  K3sが新しいetcdクラスタを初期化するように設定されている場合、既存のetcdクラスタに参加する場合、または起動時にディスク上にetcdデータベースファイルが存在する場合、組み込みetcdが自動的に選択されます。
* **外部データベース**  
  複数のサーバーで外部データストアを使用する方法については、[高可用性外部DB](ha.md)のドキュメントを参照してください。  
  以下の外部データストアがサポートされています：
  * [etcd](https://etcd.io/) (バージョン3.5.4に対して認定)
  * [MySQL](https://www.mysql.com/) (バージョン5.7および8.0に対して認定)
  * [MariaDB](https://mariadb.org/) (バージョン10.6.8に対して認定)
  * [PostgreSQL](https://www.postgresql.org/) (バージョン12.16、13.12、14.9および15.4に対して認定)

:::warning プリペアドステートメントサポート
K3sはDBからのプリペアドステートメントサポートを必要とします。これは、[PgBouncer](https://www.pgbouncer.org/faq.html#how-to-use-prepared-statements-with-transaction-pooling)のような接続プーラーがK3sと連携するために追加の設定を必要とする場合があることを意味します。
:::

### 外部データストアの設定パラメータ
PostgreSQL、MySQL、またはetcdなどの外部データストアを使用する場合、`datastore-endpoint`パラメータを設定してK3sが接続方法を認識できるようにする必要があります。また、接続の認証と暗号化を設定するためのパラメータを指定することもできます。以下の表は、CLIフラグまたは環境変数として渡すことができるこれらのパラメータをまとめたものです。

| CLIフラグ | 環境変数 | 説明
|------------|-------------|------------------
| `--datastore-endpoint` | `K3S_DATASTORE_ENDPOINT` | PostgreSQL、MySQL、またはetcdの接続文字列を指定します。これはデータストアへの接続を記述するために使用される文字列です。この文字列の構造は各バックエンドに特有であり、以下に詳細が記載されています。 |
| `--datastore-cafile` | `K3S_DATASTORE_CAFILE` | データストアとの通信を保護するために使用されるTLS証明書認証局（CA）ファイル。データストアがカスタム証明書認証局によって署名された証明書を使用してTLS経由でリクエストを提供する場合、このパラメータを使用してそのCAを指定することで、K3sクライアントが証明書を適切に検証できるようにします。 |
| `--datastore-certfile` | `K3S_DATASTORE_CERTFILE` | データストアへのクライアント証明書ベースの認証に使用されるTLS証明書ファイル。この機能を使用するには、データストアがクライアント証明書ベースの認証をサポートするように設定されている必要があります。このパラメータを指定する場合、`datastore-keyfile`パラメータも指定する必要があります。 |
| `--datastore-keyfile` | `K3S_DATASTORE_KEYFILE` | データストアへのクライアント証明書ベースの認証に使用されるTLSキー ファイル。詳細については、前述の`datastore-certfile`パラメータを参照してください。 |

ベストプラクティスとして、これらのパラメータをコマンドライン引数ではなく環境変数として設定することをお勧めします。これにより、データベースの資格情報やその他の機密情報がプロセス情報の一部として露出しないようにします。

### データストアエンドポイントの形式と機能
前述のように、`datastore-endpoint`パラメータに渡される値の形式はデータストアバックエンドに依存します。以下に、各サポートされている外部データストアの形式と機能を詳細に説明します。

<Tabs>
<TabItem value="PostgreSQL">

  PostgreSQLの最も一般的な形式では、`datastore-endpoint`パラメータは以下の形式を持ちます：

  `postgres://username:password@hostname:port/database-name`

  より高度な設定パラメータも利用可能です。これらの詳細については、https://godoc.org/github.com/lib/pq を参照してください。

  データベース名を指定し、それが存在しない場合、サーバーはそれを作成しようとします。

  エンドポイントとして`postgres://`のみを指定した場合、K3sは以下を試みます：

  - `postgres`をユーザー名とパスワードとして使用してlocalhostに接続
  - `kubernetes`という名前のデータベースを作成

</TabItem>
<TabItem value="MySQL / MariaDB">

  MySQLおよびMariaDBの最も一般的な形式では、`datastore-endpoint`パラメータは以下の形式を持ちます：

  `mysql://username:password@tcp(hostname:3306)/database-name`

  より高度な設定パラメータも利用可能です。これらの詳細については、https://github.com/go-sql-driver/mysql#dsn-data-source-name を参照してください。

  K3sの[既知の問題](https://github.com/k3s-io/k3s/issues/1093)により、`tls`パラメータを設定できないことに注意してください。TLS通信はサポートされていますが、例えばこのパラメータを"skip-verify"に設定してK3sが証明書の検証をスキップするようにすることはできません。

  データベース名を指定し、それが存在しない場合、サーバーはそれを作成しようとします。

  エンドポイントとして`mysql://`のみを指定した場合、K3sは以下を試みます：

  - `root`ユーザーとパスワードなしで`/var/run/mysqld/mysqld.sock`のMySQLソケットに接続
  - `kubernetes`という名前のデータベースを作成

</TabItem>

<TabItem value="etcd">

  etcdの最も一般的な形式では、`datastore-endpoint`パラメータは以下の形式を持ちます：

  `https://etcd-host-1:2379,https://etcd-host-2:2379,https://etcd-host-3:2379`

  上記は典型的な3ノードのetcdクラスタを想定しています。このパラメータは、カンマで区切られた1つ以上のetcd URLを受け入れることができます。

</TabItem>
</Tabs>