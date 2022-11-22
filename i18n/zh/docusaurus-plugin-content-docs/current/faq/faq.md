---
title: 常见问题
weight: 60
---

本文会定期更新，用于解答用户常见的 K3s 相关问题。

### K3s 是 Kubernetes 的替代品吗？

K3s 几乎可以胜任 K8s 的所有工作。它只是一个更轻量级的版本。有关详细信息，请参阅[介绍文档](introduction.md)。

### 如何使用自己的 Ingress 代替 Traefik？

你只需使用 `--disable traefik` 启动 K3s Server，然后部署你的 Ingress 即可。

### K3s 支持 Windows 吗？

目前 K3s 本身不支持 Windows，但我们对此想法持开放态度。

### 如何通过源码构建？

请参考 K3s [BUILDING.md](https://github.com/k3s-io/k3s/blob/master/BUILDING.md) 的说明。

### K3s 日志在哪里？

安装脚本将自动检测你的操作系统是使用 systemd 还是 openrc 并启动服务。

使用 openrc 运行时，将在 `/var/log/k3s.log` 中创建日志。

使用 systemd 运行时，将在 `/var/log/syslog` 中创建日志并使用 `journalctl -u k3s` 查看。

### 可以在 Docker 中运行 K3s 吗？

是的，有几种方法可以让你在 Docker 中运行 K3s。有关详细信息，请参阅[高级选项](advanced/advanced.md#在-docker-中运行-k3s)。

### K3s Server 和 Agent Token 有什么区别？

K3s 中有两种 token，分别是 K3S_TOKEN 和 K3S_AGENT_TOKEN。

K3S_TOKEN：定义 server 提供 HTTP 配置资源所需的密钥。这些资源在加入 K3s HA 集群之前由其他 server 请求。如果未定义 K3S_AGENT_TOKEN，则 Agent 也使用此令牌来访问所需的 HTTP 资源以加入集群。请注意，此令牌还用于为数据库中的重要内容（例如引导数据）生成加密密钥。

K3S_AGENT_TOKEN：可选。定义 server 向 agent 提供 HTTP 配置资源所需的密钥。如果未定义，agent 将需要 K3S_TOKEN。建议你定义 K3S_AGENT_TOKEN，从而避免 agent 知道 K3S_TOKEN，因为 K3S_TOKEN 也用于加密数据。

如果没有定义 K3S_TOKEN，第一个 K3s Server 将生成一个随机的 token。结果是 `/var/lib/rancher/k3s/server/token` 中的部分内容。例如，`K1070878408e06a827960208f84ed18b65fa10f27864e71a57d9e053c4caff8504b::server:df54383b5659b9280aa1e73e60ef78fc`, where `df54383b5659b9280aa1e73e60ef78fc` 是 K3S_TOKEN。

### 如果我遇到问题，可以在哪里获得帮助？

如果你在部署 K3s 时遇到问题，你应该：

1) 检查[已知问题](known-issues/known-issues.md)页面。

2) 检查你是否已解决[其他操作系统准备](advanced/advanced.md#其他操作系统准备)。运行 `k3s check-config` 并确保它通过。

3) 在 [K3s GitHub existing issues](https://github.com/k3s-io/k3s/issues) 中搜索与你的问题相匹配的 issue。

4) 加入 [Rancher K3s Slack](https://rancher-users.slack.com/archives/CGGQEHPPW) 频道以获得帮助。

5) 在 K3s Github 上提交[新 issue](https://github.com/k3s-io/k3s/issues/new/choose)，你可以描述你的设置和遇到的问题。