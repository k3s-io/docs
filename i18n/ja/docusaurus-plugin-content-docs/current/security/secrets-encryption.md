---
title: 秘密の暗号化
---

# 秘密の暗号化設定

K3sは、保存時の秘密の暗号化を有効にすることをサポートしています。サーバーを初めて起動する際に、フラグ `--secrets-encryption` を渡すと、以下のことが自動的に行われます：

- AES-CBCキーの生成
- 生成されたキーを使用して暗号化設定ファイルの生成
- 暗号化設定ファイルをKubeAPIに暗号化プロバイダー設定として渡す

:::tip

秘密の暗号化は、サーバーを再起動せずに既存のサーバーで有効にすることはできません。  
スクリプトからインストールする場合は `curl -sfL https://get.k3s.io | sh -s - server --secrets-encryption` を使用するか、[設定オプション](../installation/configuration.md#configuration-with-install-script)に記載されている他の方法を使用してください。

:::

暗号化設定ファイルの例：
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

## 秘密の暗号化ツール

K3sには `secrets-encrypt` というユーティリティツールが含まれており、以下の自動制御を可能にします：

- 秘密の暗号化の無効化/有効化
- 新しい暗号化キーの追加
- 暗号化キーのローテーションおよび削除
- 秘密の再暗号化

詳細については、[`k3s secrets-encrypt` コマンドのドキュメント](../cli/secrets-encrypt.md)を参照してください。