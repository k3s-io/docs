---
title: "安装"
---

此部分文档含有在各种环境下安装 K3s 的指导。在开始安装 K3s 前，请先确保你（的设备）已满足[要求](requirements.md)。

[配置选项](configuration.md) 提供了你在 K3s 安装阶段可用的配置项的指南。

[自建镜像源](private-registry.md) 介绍了可用以配置容器镜像注册源镜像的 `registries.yaml` 文件用途。

[内置镜像源](registry-mirror.md) 演示了如何启用内嵌的分布式镜像注册源镜像。

[孤岛安装](airgap.md) 详细解释了如何在断网环境下设置 K3s。

[管理服务器角色](server-roles.md) 详述了如何配置 K3s （节点）为专职的 `control-plane` or `etcd` 服务器。

[管理包组件](packaged-components.md) 详述了如何禁用（第三方）包式组件，或通过自动化部署配置单来安装你自有的包。

[卸载 K3s](uninstall.md) 详述了如何从主机中移除 K3s。
