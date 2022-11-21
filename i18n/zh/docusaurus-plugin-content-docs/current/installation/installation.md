---
title: "安装"
weight: 20
---

本文包含了在各种环境下安装 K3s 的说明。在开始安装 K3s 之前，请确保已满足 [K3s 的安装要求](requirements.md)。

[配置选项](configuration.md)提供了安装 K3s 时可用选项的指南。

[网络选项](network-options.md)提供了 K3s 中可用网络选项的指南。

[使用外部数据库实现 HA](ha.md) 详细介绍了如何设置一个由外部数据存储（如 MySQL、PostgreSQL 或 etcd）支持的 K3s HA 集群。

[使用嵌入式数据库实现 HA](ha-embedded.md) 详细介绍了如何设置使用内置分布式数据库的 HA K3s 集群。

[离线安装](airgap.md)详细介绍了如何在无法直接访问互联网的环境中设置 K3s。

[禁用组件标志](disable-flags.md)详细介绍了如何在 K3s 上单独设置 etcd 节点和 control plane 节点。

### 卸载

如果你使用 `install.sh` 脚本安装了 K3s，那么在安装过程中会生成一个卸载脚本。该脚本创建到你节点上的 `/usr/local/bin/k3s-uninstall.sh`（或 `k3s-agent-uninstall.sh`）中。
