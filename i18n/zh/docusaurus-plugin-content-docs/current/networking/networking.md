---
title: "网络"
---

本文介绍在K3s中如何配置网络。

[基础网络选项](basic-network-options.md) ：介绍集群（无论它是单节点还是多节点）的基本网络配置，例如K3s默认的Flannel网络插件（负责Pod跨节点通信），以及集群内IP协议版本的设置：单栈（仅IPv4）或双栈（IPv4和IPv6）。

[Hybrid混合/Multicloud多云集群](distributed-multicloud.md) ：指导如何将K3s集群“扩展”到分散的节点上，包括地理位置分散的远程节点（remote，跨地域），以及环境/架构各异的混合节点（hybrid，如混合云、x86与ARM混用），使其形成一个统一集群。

[Multus和IPAM插件](multus-ipams.md) ：介绍如何使用Multus插件为Pod提供多个网络接口（多网卡），以及IPAM插件如何为这些接口分配和管理IP地址。

[网络服务：dns、ingress等](networking-services.md) ：解释CoreDNS、Traefik、网络策略控制器和ServiceLB控制器在K3s中的工作原理。
