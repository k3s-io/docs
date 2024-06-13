---
title: 常见问题
---

本文会定期更新，用于解答用户常见的 K3s 相关问题。

### K3s 是 Kubernetes 的替代品吗？

K3s 是经过 CNCF 认证的 Kubernetes 发行版，可以胜任标准 Kubernetes 集群的所有工作。它只是一个更轻量级的版本。有关详细信息，请参阅[介绍文档](./introduction.md)。

### 如何使用自己的 Ingress 代替 Traefik？

你只需使用 `--disable=traefik` 启动 K3s Server，然后部署你的 Ingress 即可。

### K3s 支持 Windows 吗？

目前 K3s 本身不支持 Windows，但我们对此想法持开放态度。

### 如何通过源码构建？

请参考 K3s [BUILDING.md](https://github.com/k3s-io/k3s/blob/master/BUILDING.md) 的说明。

### K3s 日志在哪里？

K3s 日志的位置将根据你运行 K3s 的方式和节点的操作系统而有所不同。

* 从命令行运行时，日志将发送到 stdout 和 stderr。
* 使用 openrc 运行时，将在 `/var/log/k3s.log` 中创建日志。
* 使用 systemd 运行时，日志将发送到 Journald 并可以使用 `journalctl -u k3s` 查看​​。
* Pod 日志在 `/var/log/pods` 中。
* Containerd 日志在 `/var/lib/rancher/k3s/agent/containerd/containerd.log` 中。

你可以在启动 K3s 时使用 `--debug` 标志（或配置文件中的 `debug: true`）来生成更详细的日志。

Kubernetes 使用名为 `klog` 的日志管理框架，该框架对进程中的所有组件使用单一的日志管理配置。
由于 K3s 在单个进程中运行所有 Kubernetes 组件，因此无法为单个 Kubernetes 组件配置不同的日志级别或目的位置。
使用 `-v=<level>` 或 `--vmodule=<module>=<level>` 组件参数的效果可能不如预期。

要获得更多日志选项，请参阅[其他日志来源](./advanced.md#其他日志来源)。

### 可以在 Docker 中运行 K3s 吗？

是的，有几种方法可以让你在 Docker 中运行 K3s。有关详细信息，请参阅[高级选项](./advanced.md#在-docker-中运行-k3s)。

### K3s Server 和 Agent Token 有什么区别？

有关管理 K3s join token 的更多信息，请参阅 [`k3s token` 命令文档](./cli/token.md)。

### 不同版本的 K3s 兼容性如何？

通常，[Kubernetes 版本倾斜策略](https://kubernetes.io/docs/setup/release/version-skew-policy/)适用。

简而言之，Server 版本可以比 Agnet 新，但 Agent 不能比 Server 新。

### 如果我遇到问题，可以在哪里获得帮助？

如果你在部署 K3s 时遇到问题，你应该：

1) 检查[已知问题](./known-issues.md)页面。

2) 检查你是否已解决[其他操作系统准备](./advanced.md#其他操作系统准备)。运行 `k3s check-config` 并确保它通过。

3) 在 K3s [Issues](https://github.com/k3s-io/k3s/issues) 和 [Discussions](https://github.com/k3s-io/k3s/discussions) 中搜索匹配的问题。

<!--lint disable no-dead-urls-->
4) 加入 [Rancher Slack](https://slack.rancher.io/) K3s 频道以获得帮助。

5) 在 K3s Github 上提交[新 issue](https://github.com/k3s-io/k3s/issues/new/choose)，你可以描述你的设置和遇到的问题。
