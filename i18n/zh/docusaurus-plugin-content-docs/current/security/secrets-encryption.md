---
title: Secret 加密
---

# Secret 加密配置

K3s 支持启用静态加密。首次启动 server 时，传递标志 `--secrets-encryption` 将自动执行以下操作：

- 生成 AES-CBC 密钥
- 使用密钥生成加密配置文件
- 将配置作为 encryption-provider-config 传递给 KubeAPI

:::tip

如果不重新启动现有 server，则无法在其上启用 Secret 加密。  
如果使用脚本或[配置选项](../installation/configuration.md#使用安装脚本的选项)中描述的其他方法进行安装，请使用 `curl -sfL https://get.k3s.io | sh -s - server --secrets-encryption`。

:::

加密配置文件示例：
```json
{
  "kind": "EncryptionConfiguration",
  "apiVersion": "apiserver.config.k8s.io/v1",
  "resources": [
    {
      "resources": [
        "secrets"
      ],
      "providers": [
        {
          "aescbc": {
            "keys": [
              {
                "name": "aescbckey",
                "secret": "xxxxxxxxxxxxxxxxxxx"
              }
            ]
          }
        },
        {
          "identity": {}
        }
      ]
    }
  ]
}
```

## Secret 加密工具

K3s 包含一个实用工具 `secrets-encrypt`，可以自动控制以下内容：

- 禁用/启用 Secret 加密
- 添加新的加密密钥
- 轮换和删除加密密钥
- 重新加密 Secret

有关详细信息，请参阅 [`k3s secrets-encrypt` 命令文档](../cli/secrets-encrypt.md)。
