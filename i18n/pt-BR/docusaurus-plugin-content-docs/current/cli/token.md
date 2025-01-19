---
title: token
---

# k3s token

O K3s usa tokens para proteger o processo de junção de nós e criptografar informações confidenciais que são persistidas no datastore. Os tokens autenticam o cluster para o nó de junção e o nó para o cluster.

## Formato de Token

Os tokens K3s podem ser especificados em formato seguro ou curto. O formato seguro é o preferido, pois permite que o cliente autentique a identidade do cluster ao qual está se unindo, antes de enviar credenciais.

### Seguro

O formato de token seguro (ocasionalmente chamado de token "completo") contém as seguintes partes:

`<prefix><cluster CA hash>::<credentials>`

* `prefix`: um prefixo `K10` fixo que identifica o formato do token
* `hash CA do cluster`: o hash do certificado CA do servidor do cluster, usado para autenticar o servidor no nó de junção.
  * Para certificados CA autoassinados, esta é a soma SHA256 do certificado formatado em PEM, conforme armazenado no disco.
  * Para certificados CA personalizados, esta é a soma SHA256 da codificação DER do certificado raiz; comumente conhecido como impressão digital do certificado.
* `credentials`: o nome de usuário e a senha, ou token portador, usados ​​para autenticar o nó de junção no cluster.

#### Inicialização TLS

Quando um token seguro é especificado, o nó de junção executa as seguintes etapas para validar a identidade do servidor ao qual ele se conectou, antes de transmitir credenciais:
1. Com a verificação TLS desabilitada, baixe o pacote CA de `/cacerts` no servidor ao qual ele está se juntando.
2. Calcule o hash SHA256 do certificado CA, conforme descrito acima.
3. Compare o hash SHA256 calculado com o hash do token.
4. Se o hash corresponder, valide se o certificado apresentado pelo servidor pode ser validado pelo pacote CA do servidor.
5. Se o certificado do servidor for válido, apresente credenciais para se juntar ao cluster usando autenticação de token básica ou portadora, dependendo do tipo de token.

### Curto

O formato de token curto inclui apenas a senha ou o token portador usado para autenticar o nó de junção ao cluster.

Se um token curto for usado, o nó de junção confia implicitamente no pacote CA apresentado pelo servidor; as etapas 2 a 4 no processo de Bootstrapping TLS são ignoradas. A conexão inicial pode ser vulnerável ao ataque [man-in-the-middle](https://en.wikipedia.org/wiki/Man-in-the-middle_attack).

## Tipos de Token

O K3s suporta três tipos de tokens. Apenas o token do servidor está disponível por padrão; tipos de token adicionais devem ser configurados ou criados pelo administrador.

| Tipo      | Opção CLI       | Variável de ambiente |
| --------- | --------------- | -------------------- |
| Servidor  | `--token`       | `K3S_TOKEN`          |
| Agente    | `--agent-token` | `K3S_AGENT_TOKEN`    |
| Bootstrap | `n/a`           | `n/a`                |

### Servidor

Se nenhum token for fornecido ao iniciar o primeiro servidor no cluster, um será criado com uma senha aleatória. O token do servidor é sempre gravado em `/var/lib/rancher/k3s/server/token`, em formato seguro.

O token do servidor pode ser usado para unir nós de servidor e agente ao cluster. Qualquer pessoa com acesso ao token do servidor essencialmente tem acesso de administrador total ao cluster. Este token deve ser guardado cuidadosamente.

O token do servidor também é usado como a frase-senha [PBKDF2](https://en.wikipedia.org/wiki/PBKDF2) para criptografar informações confidenciais que são persistidas no armazenamento de dados conhecido como dados bootstrap. Os dados bootstrap são essenciais para configurar novos nós de servidor ou restaurar de um snapshot. Por esse motivo, o token deve ser copiado junto com o próprio armazenamento de dados do cluster.

:::warning
A menos que certificados CA personalizados estejam em uso, somente o formato de token curto (somente senha) pode ser usado ao iniciar o primeiro servidor no cluster. Isso ocorre porque o hash CA do cluster não pode ser conhecido até que o servidor tenha gerado os certificados CA do cluster autoassinados.
:::

Para obter mais informações sobre o uso de certificados CA personalizados, consulte a [documentação do certificado k3s](./certificate.md).
Para obter mais informações sobre como fazer backup do seu cluster, consulte a documentação do [Backup and Restore](../datastore/backup-restore.md).

### Agente

Por padrão, o token do agente é o mesmo que o token do servidor. O token do agente pode ser definido antes ou depois que o cluster foi iniciado, alterando a opção CLI ou a variável de ambiente em todos os servidores no cluster. O token do agente é semelhante ao token do servidor, pois é configurado estaticamente e não expira.

O token do agente é gravado em `/var/lib/rancher/k3s/server/agent-token`, em formato seguro. Se nenhum token do agente for especificado, este arquivo é um link para o token do servidor.

### Bootstrap

O K3s suporta agentes gerados dinamicamente e com expiração automática [tokens bootstrap](https://kubernetes.io/docs/reference/access-authn-authz/bootstrap-tokens/).

## k3s token

Os tokens bootstrap K3s usam o mesmo código de geração e validação que os tokens bootstrap `kubeadm token`, e a CLI `k3s token` é semelhante.

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
   rotate    Rotate original server token with a new bootstrap token

OPTIONS:
   --help, -h  show help
```

#### `k3s token create [token]`

Crie um novo token. O `[token]` é o token real a ser escrito, conforme gerado por `k3s token generate`. Se nenhum token for fornecido, um aleatório será gerado.

Um token em formato seguro, incluindo o hash do cluster CA, será gravado no stdout. A saída desse comando deve ser salva, pois a parte secreta do token não pode ser mostrada novamente.

| Flag                  | Descrição                                                                                                                                           |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--data-dir` value    | Pasta para armazenar o estado (padrão: /var/lib/rancher/k3s ou $\{HOME\}/.rancher/k3s se não for root)                                              |
| `--kubeconfig` value  | Servidor para conectar a [$KUBECONFIG]                                                                                                              |
| `--description` value | Uma descrição amigável de como este token é usado                                                                                                   |
| `--groups` value      | Grupos extras que este token autenticará quando usado para autenticação. (padrão: Padrão: "system:bootstrappers:k3s:default-node-token")            |
| `--ttl` value         | A duração antes que o token seja excluído automaticamente (por exemplo, 1s, 2m, 3h). Se definido como '0', o token nunca expirará (padrão: 24h0m0s) |
| `--usages` value      | Descreve as maneiras pelas quais este token pode ser usado. (padrão: "signing,authentication")                                                      |

#### `k3s token delete`

Exclua um ou mais tokens. O token completo pode ser fornecido, ou apenas o ID do token.

| Flag                 | Descrição                                                                                              |
| -------------------- | ------------------------------------------------------------------------------------------------------ |
| `--data-dir` value   | Pasta para armazenar o estado (padrão: /var/lib/rancher/k3s ou $\{HOME\}/.rancher/k3s se não for root) |
| `--kubeconfig` value | Servidor para conectar a [$KUBECONFIG]                                                                 |

#### `k3s token generate`

Gere um token bootstrap gerado aleatoriamente.

Você não precisa usar este comando para gerar um token. Você pode fazer isso sozinho, desde que esteja no formato `[a-z0-9]{6}.[a-z0-9]{16}`, onde a primeira parte é o ID do token, e a segunda parte é o segredo.

| Flag                 | Descrição                                                                                              |
| -------------------- | ------------------------------------------------------------------------------------------------------ |
| `--data-dir` value   | Pasta para armazenar o estado (padrão: /var/lib/rancher/k3s ou $\{HOME\}/.rancher/k3s se não for root) |
| `--kubeconfig` value | Servidor para conectar a [$KUBECONFIG]                                                                 |

#### `k3s token list`

Listar tokens bootstrap, mostrando seu ID, descrição e tempo de vida restante.

| Flag                 | Descrição                                                                                              |
| -------------------- | ------------------------------------------------------------------------------------------------------ |
| `--data-dir` value   | Pasta para armazenar o estado (padrão: /var/lib/rancher/k3s ou $\{HOME\}/.rancher/k3s se não for root) |
| `--kubeconfig` value | Servidor para conectar a [$KUBECONFIG]                                                                 |
| `--output` value     | Formato de saída. Opções válidas: text, json (padrão: "text")                                          |

#### `k3s token rotate`

:::info Version Gate
Disponível a partir das versões de outubro de 2023 (v1.28.2+k3s1, v1.27.7+k3s1, v1.26.10+k3s1, v1.25.15+k3s1).
:::

Gire o token do servidor original com um novo token do servidor. Após executar este comando, todos os servidores e quaisquer agentes que se juntaram originalmente com o token antigo devem ser reiniciados com o novo token.

Se você não especificar um novo token, um será gerado para você.

 | Flag                 | Descrição                                                                                              |
 | -------------------- | ------------------------------------------------------------------------------------------------------ |
 | `--data-dir` value   | Pasta para armazenar o estado (padrão: /var/lib/rancher/k3s ou $\{HOME\}/.rancher/k3s se não for root) |
 | `--kubeconfig` value | Servidor para conectar a [$KUBECONFIG]                                                                 |
 | `--server` value     | Servidor para conectar (padrão: "https://127.0.0.1:6443") [$K3S_URL]                                   |
 | `--token` value      | Token existente usado para unir um servidor ou agente a um cluster [$K3S_TOKEN]                        |
 | `--new-token` value  | Novo token que substitui o token existente                                                             |

:::warning
Os snapshots tirados antes da rotação exigirão o token do servidor antigo ao restaurar o cluster
:::