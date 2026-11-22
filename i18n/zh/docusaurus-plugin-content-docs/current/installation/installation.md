---
title: "安装"
---

本节包含在各种环境中安装 K3s 的操作说明。开始安装 K3s 之前，请确保已满足[系统要求](requirements.md)。

[配置选项](configuration.md)介绍了安装 K3s 时可用的各项配置选项。

[私有镜像仓库配置](private-registry.md)介绍了如何使用 `registries.yaml` 配置容器镜像仓库的身份验证和镜像加速。

[内嵌镜像加速器](registry-mirror.md)介绍了如何启用内嵌的分布式镜像加速器，以便在节点之间以对等方式共享镜像。

[离线安装](airgap.md)详细说明了如何在无法直接访问互联网的环境中部署 K3s。

[管理 Server 角色](server-roles.md)详细说明了如何将 K3s 部署为专用的 `control-plane` 或 `etcd` Server 节点。

[管理打包组件](packaged-components.md)详细说明了如何禁用打包组件，或通过自动部署清单安装自定义组件。

[卸载 K3s](uninstall.md)详细说明了如何从主机上移除 K3s。
