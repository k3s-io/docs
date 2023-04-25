---
slug: /
title: "K3s - 轻量级 Kubernetes"
---

K3s 是轻量级的 Kubernetes。K3s 易于安装，仅需要 Kubernetes 内存的一半，所有组件都在一个小于 100 MB 的二进制文件中。

它适用于：

* Edge
* IoT
* CI
* Development
* ARM
* 嵌入 K8s
* 不去学习那么多的 Kubernetes 高深知识也能上手使用

# 什么是 K3s？

K3s 是一个完全兼容的 Kubernetes 发行版，具有以下增强功能：

* 打包为单个二进制文件。
* 使用基于 sqlite3 作为默认存储机制的轻量级存储后端。同时支持使用 etcd3、MySQL 和 Postgres。
* 封装在简单的启动程序中，可以处理很多复杂的 TLS 和选项。
* 默认情况下是安全的，对轻量级环境有合理的默认值。
* 添加了简单但强大的 `batteries-included` 功能，例如：
   * 本地存储提供程序
   * service load balancer
   * Helm controller
   * Traefik ingress controller
* 所有 Kubernetes control plane 组件的操作都封装在单个二进制文件和进程中。因此，K3s 支持自动化和管理复杂的集群操作（例如证书分发等）。
* 最大程度减轻了外部依赖性，K3s 仅需要现代内核和 cgroup 挂载。K3s 打包了所需的依赖，包括：
   * containerd
   * Flannel (CNI)
   * CoreDNS
   * Traefik (Ingress)
   * Klipper-lb (Service LB)
   * 嵌入式网络策略控制器
   * 嵌入式 local-path-provisioner
   * 主机实用程序（iptables、socat 等）


# 为什么叫 K3s?

我们希望安装的 Kubernetes 只占用一半的内存。Kubernetes 是一个 10 个字母的单词，简写为 K8s。Kubernetes 的一半就是一个 5 个字母的单词，因此简写为 K3s。K3s 没有全称，也没有官方的发音。
