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


## Choosing Encryption Provider

:::info Version Gate
Available as of the April 2025 releases: v1.30.12+k3s1, v1.31.8+k3s1, v1.32.4+k3s1, v1.33.0+k3s1
:::

Using the `--secrets-encryption-provider` flag, you can choose which encryption provider to use. The default is `aescbc`. 

K3s supports the following encryption providers:
- `aescbc`: AES-CBC with PKCS#7 padding
- `secretbox`: XSalsa20 and Poly1305

#### Migrating Providers
You can migrate from the `aescbc` provider to the `secretbox` provider by following these steps:
1. Ensure that the `secretbox` provider is supported by your K3s version.
2. Update/Add the `secrets-encryption-provider` flag in your K3s configuration file to `secretbox`.
3. Rotate the encryption keys, following the [Encryption Key Rotation](#encryption-key-rotation) section below.


## Generated encryption config file

When you start the server with `--secrets-encryption`, K3s will generate an encryption config file at `/var/lib/rancher/k3s/server/cred/encryption-config.json`.

Below is an example of the generated encryption config file with the default `aescbc` provider:

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
