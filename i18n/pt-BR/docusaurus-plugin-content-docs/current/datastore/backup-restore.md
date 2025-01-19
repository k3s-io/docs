---
title: Backup e Restauração
---

A maneira como o K3s é feito backup e restaurado depende do tipo de armazenamento de dados usado.

:::warning
Além de fazer backup do próprio datastore, você também deve fazer backup do arquivo de token do servidor em `/var/lib/rancher/k3s/server/token`.
Você deve restaurar este arquivo, ou passar seu valor para a opção `--token`, ao restaurar do backup.
Se você não usar o mesmo valor de token ao restaurar, o snapshot ficará inutilizável, pois o token é usado para criptografar dados confidenciais dentro do próprio datastore.
:::

## Backup e Restauração com SQLite

Não são necessários comandos especiais para fazer backup ou restaurar o armazenamento de dados SQLite.

* Para fazer backup do armazenamento de dados SQLite, faça uma cópia de `/var/lib/rancher/k3s/server/db/`.
* Para restaurar o armazenamento de dados SQLite, restaure o conteúdo de `/var/lib/rancher/k3s/server/db` (e o token, conforme discutido acima).

## Backup e Restauração com Armazenamento de Dados Externo

Quando um datastore externo é usado, as operações de backup e restauração são manipuladas fora do K3s. O administrador do banco de dados precisará fazer backup do banco de dados externo ou restaurá-lo de um snapshot ou dump.

Recomendamos configurar o banco de dados para tirar instantâneos recorrentes.

Para obter detalhes sobre como tirar instantâneos do banco de dados e restaurar seu banco de dados a partir deles, consulte a documentação oficial do banco de dados:

- [Documentação Official MySQL](https://dev.mysql.com/doc/refman/8.0/en/replication-snapshot-method.html)
- [Documentação Official PostgreSQL](https://www.postgresql.org/docs/8.3/backup-dump.html)
- [Documentação Official etcd](https://etcd.io/docs/latest/op-guide/recovery/)

## Backup e Restauração com Armazenamento de Dados etcd Incorporado

Consulte a [documentação do comando `k3s etcd-snapshot`](../cli/etcd-snapshot.md) para obter informações sobre como executar operações de backup e restauração no armazenamento de dados etcd incorporado.
