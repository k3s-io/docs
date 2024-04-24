---
title: "升级"
---

### 升级 K3s 集群

[手动升级](manual.md)描述了手动升级集群的几种方法。它也可以作为通过第三方基础设施即代码工具（如 [Terraform](https://www.terraform.io/)）进行升级的基础。

[自动升级](automated.md)描述了如何使用 Rancher 的 [system-upgrade-controller](https://github.com/rancher/system-upgrade-controller) 执行 Kubernetes 原生的自动升级。

### 特定版本的注意事项

- **Traefik**：如果没有禁用 Traefik，K3s 1.20 及以前的版本将安装 Traefik v1，而 K3s 1.21 及以后的版本将安装 Traefik v2。要将旧版 Traefik v1 升级到 Traefik v2，请参阅 [Traefik 文档](https://doc.traefik.io/traefik/migration/v1-to-v2/)并使用[迁移工具](https://github.com/traefik/traefik-migration-tool)。

- **K3s 引导数据**：如果你在 HA 配置中使用 K3s 和外部 SQL 数据存储，并且你的 Server（control plane）节点没有使用 `--token` CLI 标志启动，你将不再能够在不指定令牌的情况下将其他 K3s Server 添加到集群中。请保留此令牌的副本，因为恢复备份时需要它。以前，K3s 在使用外部 SQL 数据存储时不强制使用 token。
   - 受影响的版本是 &lt;= v1.19.12+k3s1, v1.20.8+k3s1, v1.21.2+k3s1；修补后的版本为 v1.19.13+k3s1、v1.20.9+k3s1、v1.21.3+k3s1。

   - 你可以从已加入集群的任何 server 中检索令牌值，如下所示：
```bash
cat /var/lib/rancher/k3s/server/token
```

- **实验性 Dqlite**：实验性嵌入式 Dqlite 数据存储在 K3s v1.19.1 中已被弃用。请注意，不支持从实验性 Dqlite 升级到实验性嵌入式 etcd。如果你尝试升级，升级将不会成功，并且数据将会丢失。
