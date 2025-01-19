---
title: Criptografia de Secrets
---

# Configurando Criptografia de Secrets

O K3s suporta habilitar a criptografia de segredos em repouso. Ao iniciar o servidor pela primeira vez, passar o sinalizador `--secrets-encryption` fará o seguinte automaticamente:

- Gerar uma chave AES-CBC
- Gerar um arquivo de configuração de criptografia com a chave gerada
- Passar a configuração para o KubeAPI como encryption-provider-config

:::tip
O Secrets-encryption não pode ser habilitado em um servidor existente sem reiniciá-lo.
Use `curl -sfL https://get.k3s.io | sh -s - server --secrets-encryption` se estiver instalando a partir de script ou outros métodos descritos em [Opções de configuração](../installation/configuration.md#configuration-with-install-script).
:::

Exemplo do arquivo de configuração de criptografia:
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

## Ferramenta de Criptografia Secrets

O K3s contém uma ferramenta utilitária `secrets-encrypt`, que permite o controle automático sobre o seguinte:

- Desabilitando/Habilitando a criptografia de segredos
- Adicionando novas chaves de criptografia
- Girando e excluindo chaves de criptografia
- Recriptografando segredos

Para obter mais informações, consulte a [documentação do comando `k3s secrets-encrypt`](../cli/secrets-encrypt.md).
