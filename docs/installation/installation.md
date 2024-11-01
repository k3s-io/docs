---
title: "安装"
---

本部分内容包含在不同环境下K3s的安装指导教程。请确保在正式安装K3s前，自行查阅[Requirements](requirements.md)文件。

[Configuration Options](configuration.md) 提供了在安装K3s过程中对一些可用选项的参考指南。

[Private Registry Configuration](private-registry.md) 包含了如何通过`registries.yaml`来配置容器镜像的服务器地址。

[Embedded Mirror](registry-mirror.md) 展示了如何使用内嵌的分布式镜像服务器。

[Air-Gap Install](airgap.md) 详细介绍了如何在没有互联网条件下设置K3s。

[Managing Server Roles](server-roles.md) 详细介绍了如何通过专用的 `control-plane` 或 `etcd` 服务器来设置K3s。

[Managing Packaged Components](packaged-components.md) 详细介绍了如何禁用打包组件，或者使用自动部署清单来安装你自己的组件。

[Uninstalling K3s](uninstall.md) 详细介绍了如何从一台主机中删除K3s的步骤。
