---
title: "集群数据存储"
---


K3s 与其他 Kubernetes 发行版的不同之处，在于 K3s 支持使用 etcd 以外的数据库来运行 Kubernetes。该功能让 Kubernetes 运维更加灵活。你可以根据实际情况选择合适的数据存储选项。例如：

* 如果你的团队没有操作 etcd 的专业知识，你可以选择 MySQL 或 PostgreSQL 等企业级 SQL 数据库。
* 如果你需要在 CI/CD 环境中运行一个简单、短期的集群，你可以使用嵌入式 SQLite 数据库。
* 如果你希望在边缘部署 Kubernetes 并需要高可用解决方案，但又无法承担在边缘管理数据库的运营开销，你可以使用 K3s 的嵌入式 HA 数据存储，该数据存储构建在嵌入式 etcd 之上。

K3s 支持以下数据存储选项：

* **嵌入式 [SQLite](https://www.sqlite.org/index.html)**  
   SQLite 不能用于具有多个 Server 的集群。  
   SQLite 是默认的数据存储，如果没有其他数据存储配置，并且磁盘上没有嵌入式 etcd 数据库文件，将使用 SQLite。
* **嵌入式 etcd**  
   有关在具有多个 Server 的情况下使用嵌入式 etcd，请参阅[高可用嵌入式 etcd](ha-embedded.md) 文档。
   如果 K3s 配置为初始化一个新的 etcd 集群，加入一个现有的 etcd 集群，或者 etcd 数据库文件在启动时在磁盘上，那么会自动选择嵌入式 etcd。
* **外部数据库**  
   有关在具有多个 Server 的情况下使用外部数据存储，请参阅[高可用外部数据库](ha.md)文档。  
   支持以下外部数据存储：
   * [etcd](https://etcd.io/)（针对版本 3.5.4 进行了认证）
   * [MySQL](https://www.mysql.com/)（针对版本 5.7 和 8.0 进行了认证）
   * [MariaDB](https://mariadb.org/)（针对版本 10.6.8 进行了认证）
   * [PostgreSQL](https://www.postgresql.org/)（针对版本 10.7、11.5 和 14.2 进行了认证）

:::warning 准备语句支持
K3s 需要 DB 的准备语句支持。换言之，[PgBouncer](https://www.pgbouncer.org/faq.html#how-to-use-prepared-statements-with-transaction-pooling) 之类的连接池将无法与 K3s 一起使用。
:::

### 外部数据存储配置参数
如果你希望使用外部数据存储（例如 PostgreSQL、MySQL 或 etcd），你必须设置 `datastore-endpoint` 参数，以便 K3s 知道如何连接到外部数据存储。你也可以指定参数来配置连接的认证和加密。下表总结了这些参数，它们可以作为 CLI 标志或环境变量传递：

| CLI 标志 | 环境变量 | 描述 |
|------------|-------------|------------------
| `--datastore-endpoint` | `K3S_DATASTORE_ENDPOINT` | 指定 PostgreSQL、MySQL 或 etcd 连接字符串。该字符串用于描述与数据存储的连接。不同的后端对应不同的字符串结构，下文有详细说明。 |
| `--datastore-cafile` | `K3S_DATASTORE_CAFILE` | TLS 证书颁发机构（CA）文件，用于确保数据存储的通信安全。如果你的数据存储使用自定义证书颁发机构签署的证书通过 TLS 处理请求，则可以使用此参数指定 CA，以便 K3s 客户端可以正确验证证书。 |
| `--datastore-certfile` | `K3S_DATASTORE_CERTFILE` | TLS 证书文件，用于对数据存储进行基于客户端证书的验证。要使用这个功能，你必须将数据存储配置为支持基于客户端证书的认证。要指定此参数，你还必须指定 `datastore-keyfile` 参数。 |
| `--datastore-keyfile` | `K3S_DATASTORE_KEYFILE` | TLS 密钥文件，用于对数据存储进行基于客户端证书的验证。有关详细信息，请参阅前面的 `datastore-certfile` 参数。 |

作为最佳实践，我们建议将这些参数设置为环境变量，而不是命令行参数，这样你的数据库证书或其他敏感信息就不会作为进程信息的一部分暴露出来。

### 数据存储端点格式和功能
如前所述，传递给 `datastore-endpoint` 参数的值的格式取决于数据存储后端。下文详细介绍了每个支持的外部数据存储的格式和功能。

<Tabs>
<TabItem value="PostgreSQL">


最常见的 PostgreSQL 的 `datastore-endpoint` 参数格式如下：

`postgres://username:password@hostname:port/database-name`

支持使用更高级的配置参数。有关更多信息，请参阅 https://godoc.org/github.com/lib/pq。

如果指定数据库名称不存在，server 将尝试创建它。

如果你只提供了 `postgres://` 作为端点，K3s 将尝试执行以下操作：

- 使用 `postgres` 作为用户名和密码连接到 localhost
- 创建一个名为 `kubernetes` 的数据库

</TabItem>
<TabItem value="MySQL / MariaDB">

最常见的 MySQL 和 MariaDB 的 `datastore-endpoint` 参数格式如下：

`mysql://username:password@tcp(hostname:3306)/database-name`

支持使用更高级的配置参数。有关更多信息，请参阅 https://github.com/go-sql-driver/mysql#dsn-data-source-name

请注意，由于 K3s 的一个[已知问题](https://github.com/k3s-io/k3s/issues/1093)，你无法设置 `tls` 参数。TLS 通信是支持的，但你不能将此参数设置为 “skip-verify” 以使 K3s 跳过证书验证。

如果指定数据库名称不存在，server 将尝试创建它。

如果你只提供了 `mysql://` 作为端点，K3s 将尝试执行以下操作：

- 通过 `root` 用户，不使用密码连接到 `/var/run/mysqld/mysqld.sock` 的 MySQL socket
- 创建一个名为 `kubernetes` 的数据库

</TabItem>

<TabItem value="etcd">

最常见的 etcd 的 `datastore-endpoint` 参数格式如下：

`https://etcd-host-1:2379,https://etcd-host-2:2379,https://etcd-host-3:2379`

以上假设使用的是典型的三节点 etcd 集群。该参数可以再接受一个逗号分隔的 etcd URL。

</TabItem>
</Tabs>
