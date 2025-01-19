---
title: "Configuração de Registro Privado"
---

O Containerd pode ser configurado para se conectar a registros privados e usá-los para puxar imagens conforme necessário pelo kubelet.

Ao iniciar, o K3s verificará se o arquivo `/etc/rancher/k3s/registries.yaml` existe. Se existir, a configuração do registro contida nesse arquivo será usada ao gerar a configuração do Containerd.
* Se você quiser usar um registro privado como espelho de um registro público, como o docker.io, será necessário configurar o arquivo `registries.yaml` em cada nó que você deseja usar o espelho.
* Se o seu registro privado exigir autenticação, usar certificados TLS personalizados ou não utilizar TLS, será necessário configurar o arquivo `registries.yaml` em cada nó que puxará imagens do seu registro.

Observe que os nós do servidor são agendáveis por padrão. Se você não aplicou "taints" nos nós do servidor e pretende executar cargas de trabalho neles, certifique-se de criar o arquivo `registries.yaml` em cada servidor também.

## Recuperação de Endpoint Padrão

O Containerd possui um "endpoint padrão" implícito para todos os registros.
O endpoint padrão sempre será tentado como último recurso, mesmo que existam outros endpoints listados para esse registro no arquivo `registries.yaml`.
Reescritas não são aplicadas a pulls feitos contra o endpoint padrão.
Por exemplo, ao puxar `registry.example.com:5000/rancher/mirrored-pause:3.6`, o Containerd usará um endpoint padrão de `https://registry.example.com:5000/v2`.
* O endpoint padrão para `docker.io` é `https://index.docker.io/v2`.
* O endpoint padrão para todos os outros registros é `https://<REGISTRY>/v2`, onde `<REGISTRY>` é o nome do host do registro e a porta opcional.

Para ser reconhecido como um registro, o primeiro componente do nome da imagem deve conter pelo menos um ponto ou dois-pontos.
Por razões históricas, imagens sem um registro especificado em seus nomes são implicitamente identificadas como provenientes de `docker.io`.

:::info Nota de Versão
A opção `--disable-default-registry-endpoint` está disponível como um recurso experimental a partir das versões de janeiro de 2024: v1.26.13+k3s1, v1.27.10+k3s1, v1.28.6+k3s1, v1.29.1+k3s1.
:::

Os nós podem ser iniciados com a opção `--disable-default-registry-endpoint`.
Quando essa opção é configurada, o Containerd não recorrerá ao endpoint padrão do registro e puxará apenas de endpoints de espelho configurados, juntamente com o registro distribuído, se estiver habilitado.

Isso pode ser desejável se o seu cluster estiver em um ambiente verdadeiramente isolado (air-gapped), onde o registro upstream não está disponível, ou se você desejar que apenas alguns nós puxem do registro upstream.

Desabilitar o endpoint padrão do registro aplica-se apenas aos registros configurados via `registries.yaml`.
Se o registro não for explicitamente configurado por meio de uma entrada de espelho no `registries.yaml`, o comportamento padrão de fallback ainda será utilizado.

## Arquivo de Configuração de Registros

O arquivo consiste em duas chaves principais, com subchaves para cada registro:

```yaml
mirrors:
  <REGISTRY>:
    endpoint:
      - https://<REGISTRY>/v2
configs:
  <REGISTRY>:
    auth:
      username: <BASIC AUTH USERNAME>
      password: <BASIC AUTH PASSWORD>
      token: <BEARER TOKEN>
    tls:
      ca_file: <PATH TO SERVER CA>
      cert_file: <PATH TO CLIENT CERT>
      key_file: <PATH TO CLIENT KEY>
      insecure_skip_verify: <SKIP TLS CERT VERIFICATION BOOLEAN>
```

### Mirrors

A seção de mirrors define os nomes e endpoints dos registros, por exemplo:

```
mirrors:
  registry.example.com:
    endpoint:
      - "https://registry.example.com:5000"
```

Cada espelho deve ter um nome e um conjunto de endpoints. Ao puxar uma imagem de um registro, o Containerd tentará esses URLs de endpoint, além do endpoint padrão, e usará o primeiro que funcionar.

#### Redirecionamentos

Se o registro privado for usado como um espelho para outro registro, como ao configurar um [cache de pull-through](https://docs.docker.com/registry/recipes/mirror/), os pulls de imagens são redirecionados de forma transparente para os endpoints listados. O nome do registro original é passado para o endpoint do espelho por meio do parâmetro de consulta `ns`.

Por exemplo, se você tiver um espelho configurado para `docker.io`:

```yaml
mirrors:
  docker.io:
    endpoint:
      - "https://registry.example.com:5000"
```

Então, ao puxar `docker.io/rancher/mirrored-pause:3.6`, a imagem será puxada de forma transparente como `registry.example.com:5000/rancher/mirrored-pause:3.6`.

#### Reescritas

Cada espelho pode ter um conjunto de reescritas, que utilizam expressões regulares para corresponder e transformar o nome de uma imagem quando ela é puxada de um espelho.
Isso é útil se a estrutura de organização/projeto no registro privado for diferente do registro que está sendo espelhado.
As reescritas correspondem e transformam apenas o nome da imagem, NÃO a tag.

Por exemplo, a seguinte configuração puxaria de forma transparente a imagem `docker.io/rancher/mirrored-pause:3.6` como `registry.example.com:5000/mirrorproject/rancher-images/mirrored-pause:3.6`:

```yaml
mirrors:
  docker.io:
    endpoint:
      - "https://registry.example.com:5000"
    rewrite:
      "^rancher/(.*)": "mirrorproject/rancher-images/$1"
```

:::info Nota de Versão
Reescritas não são mais aplicadas ao [Endpoint Padrão](#default-endpoint-fallback) a partir das versões de janeiro de 2024: v1.26.13+k3s1, v1.27.10+k3s1, v1.28.6+k3s1, v1.29.1+k3s1.
Antes dessas versões, as reescritas também eram aplicadas ao endpoint padrão, o que impedia o K3s de puxar do registro upstream caso a imagem não pudesse ser puxada de um endpoint espelho e não estivesse disponível sob o nome modificado no upstream.
:::

Se você quiser aplicar reescritas ao puxar diretamente de um registro — quando ele não está sendo usado como espelho de um registro upstream diferente —, é necessário fornecer um endpoint de espelho que não corresponda ao endpoint padrão.
Os endpoints de espelho no arquivo `registries.yaml` que correspondem ao endpoint padrão são ignorados; o endpoint padrão sempre será tentado por último, sem reescritas, caso o fallback não tenha sido desativado.

Por exemplo, se você tiver um registro em `https://registry.example.com/` e quiser aplicar reescritas ao puxar explicitamente `registry.example.com/rancher/mirrored-pause:3.6`, pode adicionar um endpoint de espelho com a porta especificada.
Como o endpoint do espelho não corresponde ao endpoint padrão — **`"https://registry.example.com:443/v2" != "https://registry.example.com/v2"`** —, o endpoint é aceito como um espelho, e as reescritas são aplicadas, apesar de ser, efetivamente, o mesmo que o padrão.

```yaml
mirrors:
 registry.example.com
   endpoint:
     - "https://registry.example.com:443"
   rewrites:
     "^rancher/(.*)": "mirrorproject/rancher-images/$1"
```


Observe que, ao usar espelhos e reescritas, as imagens ainda serão armazenadas sob o nome original.
Por exemplo, `crictl image ls` mostrará `docker.io/rancher/mirrored-pause:3.6` como disponível no nó, mesmo que a imagem tenha sido puxada de um espelho com um nome diferente.

### Configurações

A seção `configs` define a configuração de TLS e credenciais para cada espelho. Para cada espelho, você pode definir `auth` e/ou `tls`.

A parte `tls` consiste em:

| Diretiva               | Descrição                                                                                               |
| ---------------------- | ------------------------------------------------------------------------------------------------------- |
| `cert_file`            | O caminho do certificado do cliente que será usado para autenticar com o registro.                      |
| `key_file`             | O caminho da chave do cliente que será usado para autenticar com o registro.                            |
| `ca_file`              | Define o caminho do certificado CA que será usado para verificar o certificado do servidor do registro. |
| `insecure_skip_verify` | Booleano que define se a verificação TLS deve ser ignorada para o registro.                             |

A parte `auth` consiste em nome de usuário/senha ou token de autenticação:

| Diretiva   | Descrição                                                            |
| ---------- | -------------------------------------------------------------------- |
| `username` | nome de usuário para a autenticação básica do registro privado       |
| `password` | senha do usuário para a autenticação básica do registro privado      |
| `auth`     | token de autenticação para a autenticação básica do registro privado |

Abaixo estão exemplos básicos de uso de registros privados em diferentes modos:

### Suporte a Curingas

:::info Nota de Versão
O suporte a curingas está disponível a partir das versões de março de 2024: v1.26.15+k3s1, v1.27.12+k3s1, v1.28.8+k3s1, v1.29.3+k3s1
:::

A entrada com curinga `"*"` pode ser usada nas seções `mirrors` e `configs` para fornecer uma configuração padrão para todos os registros.
A configuração padrão será usada apenas se não houver uma entrada específica para esse registro. Observe que o asterisco DEVE estar entre aspas.

No exemplo a seguir, um espelho de registro local será usado para todos os registros. A verificação TLS será desativada para todos os registros, exceto `docker.io`.

```yaml
mirrors:
  "*":
    endpoint:
      - "https://registry.example.com:5000"
configs:
  "docker.io":
  "*":
    tls:
      insecure_skip_verify: true
```

### Com TLS

Abaixo estão exemplos que mostram como configurar `/etc/rancher/k3s/registries.yaml` em cada nó ao usar TLS.

<Tabs>
<TabItem value="Com Autenticação">

```yaml
mirrors:
  docker.io:
    endpoint:
      - "https://registry.example.com:5000"
configs:
  "registry.example.com:5000":
    auth:
      username: xxxxxx # este é o nome de usuário do registro
      password: xxxxxx # esta é a senha do usuário do registro
    tls:
      cert_file: # caminho para o arquivo de cert usado no registro
      key_file:  # caminho para o arquivo key usado no registro
      ca_file:   # camninho para o arquivo ca usado no registro
```

</TabItem>
<TabItem value="Sem Autenticação">

```yaml
mirrors:
  docker.io:
    endpoint:
      - "https://registry.example.com:5000"
configs:
  "registry.example.com:5000":
    tls:
      cert_file: # caminho para o arquivo de cert usado no registro
      key_file:  # caminho para o arquivo key usado no registro
      ca_file:   # camninho para o arquivo ca usado no registro
```
</TabItem>
</Tabs>

### Sem TLS

Abaixo estão exemplos que mostram como configurar `/etc/rancher/k3s/registries.yaml` em cada nó quando _não_ estiver usando TLS.

<Tabs>
<TabItem value="Com Autenticação">

```yaml
mirrors:
  docker.io:
    endpoint:
      - "http://registry.example.com:5000"
configs:
  "registry.example.com:5000":
    auth:
      username: xxxxxx # este é o nome de usuário do registro
      password: xxxxxx # esta é a senha do usuário do registro
```

</TabItem>
<TabItem value="Sem Autenticação">

```yaml
mirrors:
  docker.io:
    endpoint:
      - "http://registry.example.com:5000"
```
</TabItem>
</Tabs>

> No caso de comunicação sem TLS, é necessário especificar `http://` para os endpoints, caso contrário, será usado https por padrão.

Para que as alterações no registro entrem em vigor, é necessário reiniciar o K3s em cada nó.

## Solução de Problemas com Pull de Imagens

Quando o Kubernetes encontra problemas ao puxar uma imagem, o erro exibido pelo kubelet pode refletir apenas o erro final retornado pela tentativa de pull feita no endpoint padrão, fazendo parecer que os endpoints configurados não estão sendo utilizados.

Verifique o log do Containerd no nó em `/var/lib/rancher/k3s/agent/containerd/containerd.log` para obter informações detalhadas sobre a causa raiz da falha.

## Adicionando Imagens ao Registro Privado

Espelhar imagens para um registro privado requer um host com Docker ou outras ferramentas de terceiros capazes de puxar e enviar imagens.
Os passos abaixo presumem que você possui um host com o dockerd, ferramentas de linha de comando do Docker e acesso tanto ao docker.io quanto ao seu registro privado.

1. Obtenha o arquivo `k3s-images.txt` do GitHub para a versão com a qual você está trabalhando.
2. Puxe cada uma das imagens do K3s listadas no arquivo k3s-images.txt do docker.io.
   Exemplo: `docker pull docker.io/rancher/mirrored-pause:3.6`
3. Retague as imagens para o registro privado.
   Exemplo: `docker tag docker.io/rancher/mirrored-pause:3.6 registry.example.com:5000/rancher/mirrored-pause:3.6`
4. Envie as imagens para o registro privado.
   Exemplo: `docker push registry.example.com:5000/rancher/mirrored-pause:3.6`
