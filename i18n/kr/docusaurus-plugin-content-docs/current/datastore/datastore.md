---
title: "클러스터 데이터 저장소"
weight: 50
---


etcd가 아닌 다른 데이터스토어를 사용하여 쿠버네티스를 실행할 수 있는 기능은 K3s를 다른 쿠버네티스 배포판과 차별화합니다. 이 기능은 쿠버네티스 운영자에게 유연성을 제공합니다. 사용 가능한 데이터스토어 옵션을 통해 사용 사례에 가장 적합한 데이터스토어를 선택할 수 있습니다. 예를 들어:

- 팀에 etcd 운영에 대한 전문 지식이 없는 경우, MySQL 또는 PostgreSQL과 같은 엔터프라이즈급 SQL 데이터베이스를 선택할 수 있습니다.
- CI/CD 환경에서 단순하고 수명이 짧은 클러스터를 실행해야 하는 경우, 임베디드 SQLite 데이터베이스를 사용할 수 있습니다.
- 엣지에 Kubernetes를 배포하고 고가용성 솔루션이 필요하지만 엣지에서 데이터베이스를 관리하는 데 따른 운영 오버헤드를 감당할 수 없는 경우, 임베디드 etcd를 기반으로 구축된 K3s의 임베디드 HA 데이터스토어를 사용할 수 있습니다.

K3s는 다음과 같은 데이터스토어 옵션을 지원합니다:

- **임베디드 [SQLite](https://www.sqlite.org/index.html)**  
  SQLite는 여러 서버가 있는 클러스터에서는 사용할 수 없습니다.  
  SQLite는 기본 데이터스토어이며, 다른 데이터스토어 구성이 없고 디스크에 임베디드 etcd 데이터베이스 파일이 없는 경우 사용됩니다.
- **임베디드 etcd**  
  여러 서버에서 임베디드 etcd를 사용하는 방법에 대한 자세한 내용은 [고가용성 임베디드 etcd](ha-embedded.md) 설명서를 참조하세요.
  K3s가 새 etcd 클러스터를 초기화하거나 기존 etcd 클러스터에 가입하도록 구성되었거나 시작 시 디스크에 etcd 데이터베이스 파일이 있는 경우 임베디드 etcd가 자동으로 선택됩니다.
- **외부 데이터베이스**  
  여러 서버에서 외부 데이터스토어를 사용하는 방법에 대한 자세한 내용은 [고가용성 외부 DB](ha.md) 설명서를 참조하세요.  
  지원되는 외부 데이터스토어는 다음과 같습니다:
  - [etcd](https://etcd.io/) (3.5.4 버전에 대해 검증됨)
  - [MySQL](https://www.mysql.com/) (5.7 and 8.0 버전에 대해 검증됨)
  - [MariaDB](https://mariadb.org/) (10.6.8 버전에 대해 검증됨)
  - [PostgreSQL](https://www.postgresql.org/) (10.7, 11.5, and 14.2 버전에 대해 검증됨)

### 외부 데이터스토어 구성 파라미터

PostgreSQL, MySQL, etcd와 같은 외부 데이터스토어를 사용하려면 K3s가 연결 방법을 알 수 있도록 `datastore-endpoint` 파라미터를 설정해야 합니다. 또한 연결의 인증 및 암호화를 구성하는 파라미터를 지정할 수도 있습니다. 아래 표에는 이러한 매개변수가 요약되어 있으며, CLI 플래그 또는 환경 변수로 전달할 수 있습니다.

| CLI Flag               | Environment Variable     | Description                                                                                                                                                                                                                                                                                             |
| ---------------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--datastore-endpoint` | `K3S_DATASTORE_ENDPOINT` | PostgreSQL, MySQL 또는 etcd 연결 문자열을 지정합니다. 데이터스토어에 대한 연결을 설명하는 데 사용되는 문자열입니다. 이 문자열의 구조는 각 백엔드에 따라 다르며 아래에 자세히 설명되어 있습니다.                                                                                                         |
| `--datastore-cafile`   | `K3S_DATASTORE_CAFILE`   | 데이터스토어와의 통신을 보호하는 데 사용되는 TLS 인증 기관(CA: Certificate Authority) 파일입니다. 데이터스토어에서 사용자 지정 인증 기관에서 서명한 인증서를 사용하여 TLS를 통해 요청을 제공하는 경우, 이 매개변수를 사용하여 해당 CA를 지정하면 K3s 클라이언트가 인증서를 올바르게 확인할 수 있습니다. |
| `--datastore-certfile` | `K3S_DATASTORE_CERTFILE` | 데이터스토어에 대한 클라이언트 인증서 기반 인증에 사용되는 TLS 인증서 파일입니다. 이 기능을 사용하려면 데이터스토어가 클라이언트 인증서 기반 인증을 지원하도록 구성되어 있어야 합니다. 이 파라미터를 지정하는 경우 `datastore-keyfile` 파라미터도 지정해야 합니다.                                      |
| `--datastore-keyfile`  | `K3S_DATASTORE_KEYFILE`  | 데이터스토어에 대한 클라이언트 인증서 기반 인증에 사용되는 TLS 키 파일입니다. 자세한 내용은 이전 `datastore-certfile` 매개변수를 참조하세요.                                                                                                                                                            |

데이터베이스 자격 증명이나 기타 민감한 정보가 프로세스 정보의 일부로 노출되지 않도록 이러한 매개 변수를 명령줄 인수가 아닌 환경 변수로 설정하는 것이 좋습니다.

### 데이터스토어 엔드포인트 형식 및 기능

앞서 언급했듯이, `datastore-endpoint` 매개변수에 전달되는 값의 형식은 데이터스토어 백엔드에 따라 달라집니다. 다음은 지원되는 각 외부 데이터스토어에 대한 이 형식과 기능에 대해 자세히 설명합니다.

<Tabs>
<TabItem value="PostgreSQL">

가장 일반적인 형식의 PostgreSQL용 데이터 저장소 엔드포인트 매개 변수는 다음과 같은 형식을 갖습니다:

`postgres://username:password@hostname:port/database-name`

더 고급 구성 매개변수를 사용할 수 있습니다. 이에 대한 자세한 내용은 https://godoc.org/github.com/lib/pq 을 참조하세요.

데이터베이스 이름을 지정했는데 해당 데이터베이스가 존재하지 않으면 서버에서 데이터베이스 생성을 시도합니다.

엔드포인트로 `postgres://`만 제공하는 경우, K3s는 다음을 시도합니다:

- 사용자 이름과 비밀번호로 `postgres`를 사용하여 localhost에 연결합니다.
- `kubernetes`라는 이름의 데이터베이스를 생성합니다.

</TabItem>
<TabItem value="MySQL / MariaDB">

가장 일반적인 형태인 MySQL과 MariaDB의 `datastore-endpoint` 파라미터는 다음과 같은 형식을 갖습니다:

`mysql://username:password@tcp(hostname:3306)/database-name`

더 고급 구성 매개변수를 사용할 수도 있습니다. 이에 대한 자세한 내용은 https://github.com/go-sql-driver/mysql#dsn-data-source-name 을 참조하세요.

K3s의 [알려진 이슈](https://github.com/k3s-io/k3s/issues/1093)로 인해 `tls` 파라미터를 설정할 수 없습니다. TLS 통신은 지원되지만 예를 들어 이 매개변수를 "skip-verify"로 설정하여 K3s가 인증서 확인을 건너뛰도록 할 수는 없습니다.

데이터베이스 이름을 지정했는데 데이터베이스가 존재하지 않으면 서버에서 만들려고 시도합니다.

엔드포인트로 `mysql://`만 제공하는 경우, K3s는 다음을 시도합니다:

- `root` 사용자와 비밀번호를 사용하지 않고 `/var/run/mysqld/mysqld.sock`에서 MySQL 소켓에 연결합니다.
- `kubernetes`라는 이름의 데이터베이스를 생성합니다.

</TabItem>

<TabItem value="etcd">

가장 일반적인 형태인 etcd의 `datastore-endpoint` 파라미터의 형식은 다음과 같습니다:

`https://etcd-host-1:2379,https://etcd-host-2:2379,https://etcd-host-3:2379`

위는 일반적인 세 개의 노드인 etcd 클러스터를 가정합니다. 이 매개변수는 쉼표로 구분된 하나 이상의 etcd URL을 사용할 수 있습니다.

</TabItem>
</Tabs>
