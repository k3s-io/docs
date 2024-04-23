---
title: Secrets Encryption
---

# Secrets Encryption Config

K3s supports enabling secrets encryption at rest. When first starting the server, passing the flag `--secrets-encryption` will do the following automatically:

- Generate an AES-CBC key
- Generate an encryption config file with the generated key
- Pass the config to the KubeAPI as encryption-provider-config

:::tip 

Secrets-encryption cannot be enabled on an existing server without restarting it.  
Use `curl -sfL https://get.k3s.io | sh -s - server --secrets-encryption` if installing from script, or other methods described in [Configuration Options](../installation/configuration.md#configuration-with-install-script).

:::

Example of the encryption config file:
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

## Secrets Encryption Tool

K3s contains a utility tool `secrets-encrypt`, which enables automatic control over the following:

- Disabling/Enabling secrets encryption
- Adding new encryption keys
- Rotating and deleting encryption keys
- Reencrypting secrets

For more information, see the [`k3s secrets-encrypt` command documentation](../cli/secrets-encrypt.md).
