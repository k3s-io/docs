---
title: 已知问题
weight: 70
---
我们会定期更新已知问题文档，说明下一个即将发布的版本中可能无法立即解决的问题。

### Snap Docker

如果你计划同时使用 K3s 与 Docker，则不建议通过 snap 包安装 Docker，因为它会导致运行 K3s 时出现问题。

### Iptables

如果你使用 nftables 模式而不是传统模式来运行 iptables，则可能会遇到问题。我们建议使用较新的 iptables（例如 1.6.1+）来避免出现问题。

此外，版本 1.8.0-1.8.4 存在可能导致 K3s 失败的问题。有关解决方法，请参阅[其他操作系统准备](../advanced/advanced.md#旧的-iptables-版本)。

### Rootless 模式

使用 Rootless 模式运行 K3s 是实验性的，存在几个[已知问题](../advanced/advanced.md#rootless-模式的已知问题)。
