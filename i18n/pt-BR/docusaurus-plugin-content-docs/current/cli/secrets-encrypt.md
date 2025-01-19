---
title: secrets-encrypt
---

# k3s secrets-encrypt

O K3s suporta habilitar a criptografia de segredos em repouso. Para obter mais informações, consulte [Criptografia de secrets](../security/secrets-encryption.md).

## Ferramenta de Criptografia Secrets

:::info Nota de Versão
Disponível a partir de [v1.21.8+k3s1](https://github.com/k3s-io/k3s/releases/tag/v1.21.8%2Bk3s1)
:::

O K3s contém uma ferramenta CLI `secrets-encrypt`, que permite o controle automático sobre o seguinte:

- Desabilitando/Habilitando a criptografia de secrets
- Adicionando novas secrets de criptografia
- Girando e excluindo secrets de criptografia
- Recriptografando secrets

:::warning
Não seguir o procedimento adequado para rotacionar chaves de criptografia pode deixar seu cluster permanentemente corrompido. Prossiga com cautela.
:::

### Nova Rotação de Chave de Criptografia (Experimental)

:::info Nota de Versão
Disponível a partir de [v1.28.1+k3s1](https://github.com/k3s-io/k3s/releases/tag/v1.28.1%2Bk3s1). Esta nova versão da ferramenta utilizou o K8s [recarregamento automático de configuração](https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/#configure-automatic-reloading) que está atualmente em beta. O GA é esperado na v1.29.0

Para versões mais antigas, consulte [Encryption Key Rotation Classic](#encryption-key-rotation-classic)
:::

<Tabs groupId="se" queryString>
<TabItem value="Servidor Único" default>
Para rotacionar chaves de criptografia de segredos em um cluster de servidor único:

1. Inicie o servidor K3s com o sinalizador `--secrets-encryption`

    :::note
    Atualmente, *não* há suporte para iniciar o K3s sem criptografia e habilitá-lo posteriormente.
    :::

2. Gire as chaves de criptografia de secrets
    ```
    k3s secrets-encrypt rotate-keys
    ```

3. Aguarde a conclusão da reencriptação. Observe os logs do servidor ou aguarde:
    ```bash
    $ k3s secrets-encrypt status
    Encryption Status: Enabled
    Current Rotation Stage: reencrypt_finished
    ```

</TabItem>
<TabItem value="Alta Disponibilidade">

Para rotacionar chaves de criptografia secrets em configurações de HA:


1. Inicie todos os três servidores K3s com o sinalizador `--secrets-encryption`. Para resumir, os servidores serão chamados de S1, S2, S3.

    :::note
    Atualmente, *não* há suporte para iniciar o K3s sem criptografia e habilitá-lo posteriormente.
    :::

2. Rotaciona as secrets de criptografia no S1

    ```bash
    k3s secrets-encrypt rotate-keys
    ```

3. Aguarde a conclusão da reencriptação. Observe os logs do servidor ou aguarde:
    ```bash
    $ k3s secrets-encrypt status
    Encryption Status: Enabled
    Current Rotation Stage: reencrypt_finished
    ```
    :::info
    K3s criptografará novamente ~5 secrets por segundo. Clusters com grande número de secrets podem levar vários minutos para criptografar novamente. Você pode acompanhar o progresso nos logs do servidor.
    :::

4. Reinicie o K3s no S1 com os mesmos argumentos. Se estiver executando o K3s como um serviço:
    ```bash
    # If using systemd
    systemctl restart k3s
    # If using openrc
    rc-service k3s restart
    ```

5. Assim que o S1 estiver ativo, reinicie os K3s no S2 e S3


</TabItem>
</Tabs>

### Rotação de Chave de Criptografia Clássica

<Tabs groupId="se" queryString>
<TabItem value="Único Servidor" default>

Para rotacionar chaves de criptografia de segredos em um cluster de servidor único:

1. Inicie o servidor K3s com a flag `--secrets-encryption`

    :::note
    Atualmente, *não* há suporte para iniciar o K3s sem criptografia e habilitá-lo posteriormente.
    :::

2. Prepare

    ```bash
    k3s secrets-encrypt prepare
    ```

3. Mate e reinicie o servidor K3s com os mesmos argumentos. Se estiver executando o K3s como um serviço:
    ```bash
    # If using systemd
    systemctl restart k3s
    # If using openrc
    rc-service k3s restart
    ```

4. Rotacione

    ```bash
    k3s secrets-encrypt rotate
    ```

5. Mate e reinicie o servidor K3s com os mesmos argumentos
6. Recriptografar
    :::info
    K3s criptografará novamente ~5 secrets por segundo.
    Clusters com grande número de secrets podem levar vários minutos para criptografar novamente.
    :::
    ```bash
    k3s secrets-encrypt reencrypt
    ```


</TabItem>
<TabItem value="Alta Disponibilidade">

As etapas são as mesmas para clusters de DB incorporados e DB externos.

Para rotacionar chaves de criptografia de segredos em configurações de HA:



1. Inicie todos os três servidores K3s com o sinalizador `--secrets-encryption`. Para resumir, os servidores serão chamados de S1, S2, S3.
    :::note Nota
      - Iniciar o K3s sem criptografia e habilitá-lo posteriormente *não* é suportado atualmente.
      - Embora não seja obrigatório, é recomendado que você escolha um nó de servidor do qual executar os comandos `secrets-encrypt`.
    :::

2. Prepare o S1

    ```bash
    k3s secrets-encrypt prepare
    ```

3. Mate e reinicie S1 com os mesmos argumentos. Se estiver executando K3s como um serviço:
    ```bash
    # Se estiver usando systemd
    systemctl restart k3s
    # Se estiver usando openrc
    rc-service k3s restart
    ```

4. Assim que o S1 estiver ativo, mate e reinicie o S2 e o S3

5. Rotacione no S1

    ```bash
    k3s secrets-encrypt rotate
    ```

6. Mate e reinicie o S1 com os mesmos argumentos
7. Assim que o S1 estiver ativo, mate e reinicie o S2 e o S3

8. Recriptografar em S1
    :::info
    K3s criptografará novamente ~5 secrets por segundo.
    Clusters com grande número de secrets podem levar vários minutos para criptografar novamente.
    :::
    ```bash
    k3s secrets-encrypt reencrypt
    ```

9. Mate e reinicie o S1 com os mesmos argumentos
10. Assim que o S1 estiver ativo, mate e reinicie o S2 e o S3

</TabItem>
</Tabs>

### Desativar/Reativar Criptografia de Segredos
<Tabs groupId="se" queryString>
<TabItem value="Servidor Único" default>

Após iniciar um servidor com o sinalizador `--secrets-encryption`, a criptografia de segredos pode ser desabilitada.

Para desabilitar a criptografia de segredos em um cluster de nó único:

1. Desabilite

    ```bash
    k3s secrets-encrypt disable
    ```

2. Mate e reinicie o servidor K3s com os mesmos argumentos. Se estiver executando o K3s como um serviço:
    ```bash
    # Se estiver usando systemd
    systemctl restart k3s
    # Se estiver usando openrc
    rc-service k3s restart
    ```

3. Recriptografar com Flags

    ```bash
    k3s secrets-encrypt reencrypt --force --skip
    ```

Para reativar a criptografia de secrets em um cluster de nó único:

1. Habilitar

    ```bash
    k3s secrets-encrypt enable
    ```

2. Mate e reinicie o servidor K3s com os mesmos argumentos

3. Recriptografar com flags

    ```bash
    k3s secrets-encrypt reencrypt --force --skip
    ```

</TabItem>
<TabItem value="Alta Disponibilidade">

Após iniciar um cluster HA com sinalizadores `--secrets-encryption`, a criptografia de secrets pode ser desabilitada.

:::note
Embora não seja obrigatório, é recomendável que você escolha um nó de servidor para executar os comandos `secrets-encrypt`.
:::

Para resumir, os três servidores usados ​​neste guia serão chamados de S1, S2, S3.

Para desabilitar a criptografia de secrets em um cluster HA:

1. Desabilitar em S1

    ```bash
    k3s secrets-encrypt disable
    ```

2. Mate e reinicie S1 com os mesmos argumentos. Se estiver executando K3s como um serviço:
    ```bash
    # Se estiver usando systemd
    systemctl restart k3s
    # If using openrc
    rc-service k3s restart
    ```

3. Assim que o S1 estiver ativo, mate e reinicie o S2 e o S3


4. Recriptografar com flags em S1

    ```bash
    k3s secrets-encrypt reencrypt --force --skip
    ```

Para reativar a criptografia de secrets em um cluster HA:

1. Habilitar em S1

    ```bash
    k3s secrets-encrypt enable
    ```

2. Mate e reinicie o S1 com os mesmos argumentos
3. Assim que o S1 estiver ativo, mate e reinicie o S2 e o S3

4. Recriptografar com flags em S1

    ```bash
    k3s secrets-encrypt reencrypt --force --skip
    ```

</TabItem>
</Tabs>

### Status de Criptografia Secrets
A ferramenta secrets-encrypt inclui um comando `status` que exibe informações sobre o status atual da criptografia de secrets no nó.

Um exemplo do comando em um nó de servidor único:
```bash
$ k3s secrets-encrypt status
Encryption Status: Enabled
Current Rotation Stage: start
Server Encryption Hashes: All hashes match

Active  Key Type  Name
------  --------  ----
 *      AES-CBC   aescbckey

```

Outro exemplo no cluster HA, após rotacionar as chaves, mas antes de reiniciar os servidores:
```bash
$ k3s secrets-encrypt status
Encryption Status: Enabled
Current Rotation Stage: rotate
Server Encryption Hashes: hash does not match between node-1 and node-2

Active  Key Type  Name
------  --------  ----
 *      AES-CBC   aescbckey-2021-12-10T22:54:38Z
        AES-CBC   aescbckey

```

Os detalhes de cada seção são os seguintes:

- __Encryption Status__: Exibido se a criptografia de segredos está desabilitada ou habilitada no nó
- __Current Rotation Stage__: Indica o estágio de rotação atual no nó.
  Os estágios são: `start`, `prepare`, `rotate`, `reencrypt_request`, `reencrypt_active`, `reencrypt_finished`
- __Server Encryption Hashes__: Útil para clusters HA, isso indica se todos os servidores estão no mesmo estágio com seus arquivos locais. Isso pode ser usado para identificar se uma reinicialização dos servidores é necessária antes de prosseguir para o próximo estágio. No exemplo de HA acima, node-1 e node-2 têm hashes diferentes, indicando que eles atualmente não têm a mesma configuração de criptografia. Reiniciar os servidores sincronizará suas configurações.
- __Key Table__: Resume informações sobre as chaves de criptografia secretas encontradas no nó.
  * __Active__: O "*" indica quais, se houver, das chaves são usadas atualmente para criptografia de segredos. Uma chave ativa é usada pelo Kubernetes para criptografar quaisquer novos segredos.
  * __Key Type__: Todas as chaves que usam esta ferramenta são do tipo `AES-CBC`. Veja mais informações [aqui.](https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/#providers)
  * __Name__: Nome da chave de criptografia.
