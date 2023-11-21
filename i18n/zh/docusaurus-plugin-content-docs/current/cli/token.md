---
title: token
---

# k3s token

K3s 使用 Token 来保护加入节点的过程。Token 用于验证加入的节点和集群。

## Token 格式

K3s Token 可以使用安全（secure）或短（short）格式。安全格式能让客户端在发送凭证之前验证加入的集群的身份，因此首选安全格式。

### Secure

安全 Token 格式（有时称为“完整” Token 格式）包含以下部分：

`<prefix><cluster CA hash>::<credentials>`

* `prefix`：固定的 `K10` 前缀，用来标识 token 格式
* `cluster CA hash`：集群的 Server CA 证书的哈希，用于为加入的节点验证 Server。
   * 对于自签名 CA 证书，这是存储在磁盘上的 PEM 格式证书的 SHA256 总和。
   * 对于自定义 CA 证书，这是根证书的 DER 编码的 SHA256 总和，也称为证书指纹。
* `credentials`：用户名和密码，或持有者 Token，用于验证加入集群的节点。

#### TLS 引导

如果指定了安全 Token，在传输凭证之前，加入的节点会执行以下步骤来认证连接的 Server：
1. 禁用 TLS 验证后，从要加入的 Server 上的 `/cacerts` 下载 CA 包。
2. 如上所述计算 CA 证书的 SHA256 哈希值。
3. 比较计算出的 SHA256 哈希值与 Token 中的哈希值。
4. 如果哈希值匹配，则验证 Server 提供的证书是否可以由 Server 的 CA 包进行验证。
5. 如果 Server 证书有效，你需要使用基础或持有者 Token 认证（根据 Token 的类型）来提供加入集群的凭证。

### Short

短 Token 格式仅包括用于验证加入集群的节点的密码或持有者 Token。

如果使用了短 Token，则加入的节点会隐式信任 Server 提供的 CA 包，以及跳过 TLS 引导过程中的步骤 2-4。初始连接可能容易受到[中间人](https://en.wikipedia.org/wiki/Man-in-the-middle_attack)攻击。

## Token 类型

K3s 支持三种类型的 Token。默认情况下只有 Server Token 可用，其他类型的 Token 必须由管理员配置或创建。

| 类型 | CLI 选项 | 环境变量 |
--------- | --------------- | --------------------
| Server | `--token` | `K3S_TOKEN` |
| Agent | `--agent-token` | `K3S_AGENT_TOKEN` |
| Bootstrap | `n/a` | `n/a` |

### Server

如果在启动集群中的第一个 Server 时未提供 Token，则会使用随机密码创建。Server Token 始终以安全格式写入 `/var/lib/rancher/k3s/server/token`。

Server Token 可用于将 Server 和 Agent 节点加入集群。一旦创建了集群，它就无法更改，任何有权访问 Server Token 的用户基本上都拥有集群的完全管理员访问权限。因此，你需要小心保管 Token。

Server Token 还用作密钥的 [PBKDF2](https://en.wikipedia.org/wiki/PBKDF2) 密码，该密钥用于加密持久保存到数据存储的机密信息，例如 Secret 加密配置、wireguard 密钥，集群 CA 证书的私钥以及 service-account Token。因此，Token 必须与集群数据存储一起备份。

:::warning
除非使用了自定义 CA 证书，否则在启动集群的第一个 Server 时只能使用短 Token 格式（仅密码）。这是因为只有在 Server 生成自签名集群 CA 证书后才能知道集群 CA 哈希值。
:::

有关使用自定义 CA 证书的更多信息，请参阅 [`k3s certificate` 文档](./certificate.md)。  
有关备份集群的更多信息，请参阅[备份和恢复](../datastore/backup-restore.md)文档。

### Agent

默认情况下，Agent Token 与 Server Token 相同。你可以通过更改集群中所有 Server 上的 CLI 选项或环境变量，在集群启动之前或之后设置 Agent Token。Agent Token 类似于 Server Token，是静态配置的并且不会过期。

Agent Token 以安全格式写入 `/var/lib/rancher/k3s/server/agent-token`。如果未指定 Agent Token，则此文件是指向 Server Token 的链接。

### Bootstrap

:::info 版本
从 2023-02 版本（v1.26.2+k3s1、v1.25.7+k3s1、v1.24.11+k3s1、v1.23.17+k3s1）开始，支持 `k3s token` 命令以及使用 Bootstrap Token 加入节点。
:::

K3s 支持动态生成、自动过期的 agent bootstrap token。Bootstrap Token 只能用于加入 Agent。

## k3s token

K3s Bootstrap Token 使用与 `kubeadm token` Bootstrap Token 相同的生成和验证代码，`k3s token` CLI 也是类似的。

```
NAME:
   k3s token - Manage bootstrap tokens

USAGE:
   k3s token command [command options] [arguments...]

COMMANDS:
   create    Create bootstrap tokens on the server
   delete    Delete bootstrap tokens on the server
   generate  Generate and print a bootstrap token, but do not create it on the server
   list      List bootstrap tokens on the server

OPTIONS:
   --help, -h  show help
```

#### `k3s token create [token]`

创建一个新 Token。`[token]` 是要写入的实际 Token，由 `k3s token generate` 生成。如果没有指定 Token，将生成一个随机 Token。

安全格式的 Token（包括集群 CA 哈希）会写入到 stdout。Token 的 secret 部分只显示一次，因此你需要保存此命令的输出。

| 标志 | 描述 |
---- | ----
| `--data-dir` value | 保存状态的（数据）文件夹，如果不是 root，则默认为 `/var/lib/rancher/k3s 或 ${HOME}/.rancher/k3s` |
| `--kubeconfig` value | 要连接到 [$KUBECONFIG] 的（集群）Server |
| `--description` value | 有关如何使用此 Token 的描述 |
| `--groups` value | 该 Token 用于认证的其他组（默认值：“system:bootstrappers:k3s:default-node-token”） |
| `--ttl` value | 自动删除 Token 的时间（例如 1s、2m、3h）。如果设置为 `0`，Token 将永不过期（默认值：24h0m0s） |
| `--usages` value | 描述可使用此 Token 的方式。(默认值："signing,authentication") |

#### `k3s token delete`

删除一个或多个 Token。你可以提供完整的 Token，也可以仅提供 Token ID。

| 标志 | 描述 |
---- | ----
| `--data-dir` value | 保存状态的（数据）文件夹，如果不是 root，则默认为 `/var/lib/rancher/k3s 或 ${HOME}/.rancher/k3s` |
| `--kubeconfig` value | 要连接到 [$KUBECONFIG] 的（集群）Server |

#### `k3s token generate`

生成一个随机的 Bootstrap Token。

你不需要使用此命令来生成 Token。只要格式为 "[a-z0-9]{6}.[a-z0-9]{16}"（其中第一部分是 Token ID，第二部分是 Secret），你就可以自己进行操作。

| 标志 | 描述 |
---- | ----
| `--data-dir` value | 保存状态的（数据）文件夹，如果不是 root，则默认为 `/var/lib/rancher/k3s 或 ${HOME}/.rancher/k3s` |
| `--kubeconfig` value | 要连接到 [$KUBECONFIG] 的（集群）Server |

#### `k3s token list`

列出 Bootstrap Token，这将显示 Token 的 ID、描述和剩余 TTL。

| 标志 | 描述 |
---- | ----
| `--data-dir` value | 保存状态的（数据）文件夹，如果不是 root，则默认为 `/var/lib/rancher/k3s 或 ${HOME}/.rancher/k3s` |
| `--kubeconfig` value | 要连接到 [$KUBECONFIG] 的（集群）Server |
| `--output` value | 输出格式。可选值：text、json（默认值：`text`） |
