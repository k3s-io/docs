---
title: "Opções Avançadas / Configuração"
---

Esta seção contém informações avançadas descrevendo as diferentes maneiras de executar e gerenciar o K3s, bem como as etapas necessárias para preparar o sistema operacional host para uso do K3s.

## Gestão de Certificados

### Certificados de Autoridade Certificadora

O K3s gera Certificados de Autoridade de Certificação (CA) autoassinados durante a inicialização do primeiro nó do servidor. Esses certificados de CA são válidos por 10 anos e não são renovados automaticamente.

Para obter informações sobre o uso de certificados de CA personalizados ou a renovação de certificados de CA autoassinados, consulte a [documentação do comando `k3s certificate rotate-ca`](./cli/certificate.md#certificate-authority-ca-certificates).

### Certificados de cliente e servidor

Os certificados de cliente e servidor do K3s são válidos por 365 dias a partir da data de emissão. Quaisquer certificados que estejam expirados, ou dentro de 90 dias de expiração, são renovados automaticamente toda vez que o K3s é iniciado.

Para obter informações sobre a rotação manual de certificados de cliente e servidor, consulte a [documentação do comando `k3s certificate rotate`](./cli/certificate.md#client-and-server-certificates).

## Gerenciamento de Tokens

Por padrão, o K3s usa um único token estático para servidores e agentes. Este token não pode ser alterado depois que o cluster foi criado.
É possível habilitar um segundo token estático que só pode ser usado para unir agentes ou para criar tokens de união temporários no estilo `kubeadm` que expiram automaticamente.
Para obter mais informações, consulte a [documentação do comando `k3s token`](./cli/token.md).

## Configurando um proxy HTTP

Se você estiver executando o K3s em um ambiente que só tem conectividade externa por meio de um proxy HTTP, você pode configurar suas configurações de proxy no serviço systemd do K3s. Essas configurações de proxy serão então usadas no K3s e passadas para o containerd e o kubelet incorporados.

O script de instalação do K3s pegará automaticamente as variáveis ​​`HTTP_PROXY`, `HTTPS_PROXY` e `NO_PROXY`, bem como as variáveis ​​`CONTAINERD_HTTP_PROXY`, `CONTAINERD_HTTPS_PROXY` e `CONTAINERD_NO_PROXY` do shell atual, se estiverem presentes, e as gravará no arquivo de ambiente do seu serviço systemd, geralmente:

- `/etc/systemd/system/k3s.service.env`
- `/etc/systemd/system/k3s-agent.service.env`

Claro, você também pode configurar o proxy editando esses arquivos.

O K3s adicionará automaticamente os intervalos de IP do Pod e do Serviço interno do cluster e o domínio DNS do cluster à lista de entradas `NO_PROXY`. Você deve garantir que os intervalos de endereços IP usados ​​pelos próprios nós do Kubernetes (ou seja, os IPs públicos e privados dos nós) estejam incluídos na lista `NO_PROXY` ou que os nós possam ser acessados ​​por meio do proxy.

```
HTTP_PROXY=http://your-proxy.example.com:8888
HTTPS_PROXY=http://your-proxy.example.com:8888
NO_PROXY=127.0.0.0/8,10.0.0.0/8,172.16.0.0/12,192.168.0.0/16
```

Se você quiser configurar as configurações de proxy para o containerd sem afetar o K3s e o Kubelet, você pode prefixar as variáveis ​​com `CONTAINERD_`:

```
CONTAINERD_HTTP_PROXY=http://your-proxy.example.com:8888
CONTAINERD_HTTPS_PROXY=http://your-proxy.example.com:8888
CONTAINERD_NO_PROXY=127.0.0.0/8,10.0.0.0/8,172.16.0.0/12,192.168.0.0/16
```

## Usando o Docker como o tempo de execução do contêiner

O K3s inclui e tem como padrão [containerd](https://containerd.io/), um tempo de execução de contêiner padrão do setor.
A partir do Kubernetes 1.24, o Kubelet não inclui mais dockershim, o componente que permite que o kubelet se comunique com o dockerd.
O K3s 1.24 e superior incluem [cri-dockerd](https://github.com/Mirantis/cri-dockerd), que permite atualização contínua de versões anteriores do K3s enquanto continua a usar o tempo de execução do contêiner Docker.

Para usar o Docker em vez do containerd:

1. Instale o Docker no nó K3s. Um dos [scripts de instalação do Docker](https://github.com/rancher/install-docker) do Rancher pode ser usado para instalar o Docker:

    ```bash
    curl https://releases.rancher.com/install-docker/20.10.sh | sh
    ```

2. Instale o K3s usando a opção `--docker`:

    ```bash
    curl -sfL https://get.k3s.io | sh -s - --docker
    ```

3. Confirme se o cluster está disponível:

    ```bash
    $ sudo k3s kubectl get pods --all-namespaces
    NAMESPACE     NAME                                     READY   STATUS      RESTARTS   AGE
    kube-system   local-path-provisioner-6d59f47c7-lncxn   1/1     Running     0          51s
    kube-system   metrics-server-7566d596c8-9tnck          1/1     Running     0          51s
    kube-system   helm-install-traefik-mbkn9               0/1     Completed   1          51s
    kube-system   coredns-8655855d6-rtbnb                  1/1     Running     0          51s
    kube-system   svclb-traefik-jbmvl                      2/2     Running     0          43s
    kube-system   traefik-758cd5fc85-2wz97                 1/1     Running     0          43s
    ```

4. Confirme se os contêineres do Docker estão em execução:

    ```bash
    $ sudo docker ps
    CONTAINER ID        IMAGE                     COMMAND                  CREATED              STATUS              PORTS               NAMES
    3e4d34729602        897ce3c5fc8f              "entry"                  About a minute ago   Up About a minute                       k8s_lb-port-443_svclb-traefik-jbmvl_kube-system_d46f10c6-073f-4c7e-8d7a-8e7ac18f9cb0_0
    bffdc9d7a65f        rancher/klipper-lb        "entry"                  About a minute ago   Up About a minute                       k8s_lb-port-80_svclb-traefik-jbmvl_kube-system_d46f10c6-073f-4c7e-8d7a-8e7ac18f9cb0_0
    436b85c5e38d        rancher/library-traefik   "/traefik --configfi…"   About a minute ago   Up About a minute                       k8s_traefik_traefik-758cd5fc85-2wz97_kube-system_07abe831-ffd6-4206-bfa1-7c9ca4fb39e7_0
    de8fded06188        rancher/pause:3.1         "/pause"                 About a minute ago   Up About a minute                       k8s_POD_svclb-traefik-jbmvl_kube-system_d46f10c6-073f-4c7e-8d7a-8e7ac18f9cb0_0
    7c6a30aeeb2f        rancher/pause:3.1         "/pause"                 About a minute ago   Up About a minute                       k8s_POD_traefik-758cd5fc85-2wz97_kube-system_07abe831-ffd6-4206-bfa1-7c9ca4fb39e7_0
    ae6c58cab4a7        9d12f9848b99              "local-path-provisio…"   About a minute ago   Up About a minute                       k8s_local-path-provisioner_local-path-provisioner-6d59f47c7-lncxn_kube-system_2dbd22bf-6ad9-4bea-a73d-620c90a6c1c1_0
    be1450e1a11e        9dd718864ce6              "/metrics-server"        About a minute ago   Up About a minute                       k8s_metrics-server_metrics-server-7566d596c8-9tnck_kube-system_031e74b5-e9ef-47ef-a88d-fbf3f726cbc6_0
    4454d14e4d3f        c4d3d16fe508              "/coredns -conf /etc…"   About a minute ago   Up About a minute                       k8s_coredns_coredns-8655855d6-rtbnb_kube-system_d05725df-4fb1-410a-8e82-2b1c8278a6a1_0
    c3675b87f96c        rancher/pause:3.1         "/pause"                 About a minute ago   Up About a minute                       k8s_POD_coredns-8655855d6-rtbnb_kube-system_d05725df-4fb1-410a-8e82-2b1c8278a6a1_0
    4b1fddbe6ca6        rancher/pause:3.1         "/pause"                 About a minute ago   Up About a minute                       k8s_POD_local-path-provisioner-6d59f47c7-lncxn_kube-system_2dbd22bf-6ad9-4bea-a73d-620c90a6c1c1_0
    64d3517d4a95        rancher/pause:3.1         "/pause"
    ```

## Usando etcdctl

etcdctl fornece uma CLI para interagir com servidores etcd. O K3s não empacota etcdctl.

Se você quiser usar o etcdctl para interagir com o etcd incorporado do K3s, instale o etcdctl usando a [documentação oficial](https://etcd.io/docs/latest/install/).

```bash
ETCD_VERSION="v3.5.5"
ETCD_URL="https://github.com/etcd-io/etcd/releases/download/${ETCD_VERSION}/etcd-${ETCD_VERSION}-linux-amd64.tar.gz"
curl -sL ${ETCD_URL} | sudo tar -zxv --strip-components=1 -C /usr/local/bin
```

Você pode então usar o etcdctl configurando-o para usar os certificados e chaves gerenciados pelo K3s para autenticação:

```bash
sudo etcdctl version \
  --cacert=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt \
  --cert=/var/lib/rancher/k3s/server/tls/etcd/client.crt \
  --key=/var/lib/rancher/k3s/server/tls/etcd/client.key
```

## Configurando o containerd

O K3s gerará config.toml para o containerd em `/var/lib/rancher/k3s/agent/etc/containerd/config.toml`.

Para personalização avançada deste arquivo, você pode criar outro arquivo chamado `config.toml.tmpl` no mesmo diretório, e ele será usado em seu lugar.

O `config.toml.tmpl` será tratado como um arquivo de modelo Go, e a estrutura `config.Node` está sendo passada para o modelo. Veja [esta pasta](https://github.com/k3s-io/k3s/blob/master/pkg/agent/templates) para exemplos de Linux e Windows sobre como usar a estrutura para personalizar o arquivo de configuração.
A estrutura golang config.Node é definida [aqui](https://github.com/k3s-io/k3s/blob/master/pkg/daemons/config/types.go#L37)

### Modelo base

:::info Nota de Versão
Disponível a partir das versões de setembro de 2023: v1.24.17+k3s1, v1.25.13+k3s1, v1.26.8+k3s1, v1.27.5+k3s1, v1.28.1+k3s1
:::

Você pode estender o modelo base do K3s em vez de copiar e colar o modelo de estoque completo do código-fonte do K3s. Isso é útil se você precisa construir sobre a configuração existente e adicionar algumas linhas extras no final.

```toml
#/var/lib/rancher/k3s/agent/etc/containerd/config.toml.tmpl

{{ template "base" . }}

[plugins."io.containerd.grpc.v1.cri".containerd.runtimes."custom"]
  runtime_type = "io.containerd.runc.v2"
[plugins."io.containerd.grpc.v1.cri".containerd.runtimes."custom".options]
  BinaryName = "/usr/bin/custom-container-runtime"

```
## Suporte alternativo de tempo de execução de contêiner

O K3s detectará automaticamente runtimes de contêiner alternativos se eles estiverem presentes quando o K3s iniciar. Os runtimes de contêiner suportados são:
```
crun, lunatic, nvidia, nvidia-cdi, nvidia-experimental, slight, spin, wasmedge, wasmer, wasmtime, wws
```

As GPUs NVIDIA exigem a instalação do NVIDIA Container Runtime para agendar e executar cargas de trabalho aceleradas em Pods. Para usar GPUs NVIDIA com K3s, execute as seguintes etapas:

1. Instale o repositório de pacotes nvidia-container no nó seguindo as instruções em:
    https://nvidia.github.io/libnvidia-container/
2. Instale os pacotes de tempo de execução do contêiner nvidia. Por exemplo:
   `apt install -y nvidia-container-runtime cuda-drivers-fabricmanager-515 nvidia-headless-515-server`
3. [Instale o K3s](./installation), ou reinicie-o se já estiver instalado.
4. Confirme se o tempo de execução do contêiner nvidia foi encontrado pelo k3s:
    `grep nvidia /var/lib/rancher/k3s/agent/etc/containerd/config.toml`

Se essas etapas forem seguidas corretamente, o K3s adicionará automaticamente os tempos de execução da NVIDIA à configuração do containerd, dependendo de quais executáveis ​​de tempo de execução forem encontrados.

:::info Nota de Versão
O sinalizador `--default-runtime` e os recursos RuntimeClass integrados estão disponíveis a partir das versões de dezembro de 2023: v1.29.0+k3s1, v1.28.5+k3s1, v1.27.9+k3s1, v1.26.12+k3s1
Antes dessas versões, você deve implantar seus próprios recursos RuntimeClass para quaisquer tempos de execução que deseja referenciar nas especificações do Pod.
:::

O K3s inclui definições de Kubernetes RuntimeClass para todos os runtimes alternativos suportados. Você pode selecionar um deles para substituir `runc` como o runtime padrão em um nó definindo o valor `--default-runtime` por meio do k3s CLI ou do arquivo de configuração.

Se você não alterou o tempo de execução padrão nos nós da GPU, deverá solicitar explicitamente o tempo de execução da NVIDIA definindo `runtimeClassName: nvidia` na especificação do Pod:
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nbody-gpu-benchmark
  namespace: default
spec:
  restartPolicy: OnFailure
  runtimeClassName: nvidia
  containers:
  - name: cuda-container
    image: nvcr.io/nvidia/k8s/cuda-sample:nbody
    args: ["nbody", "-gpu", "-benchmark"]
    resources:
      limits:
        nvidia.com/gpu: 1
    env:
    - name: NVIDIA_VISIBLE_DEVICES
      value: all
    - name: NVIDIA_DRIVER_CAPABILITIES
      value: all
```

Observe que o NVIDIA Container Runtime também é frequentemente usado com o [NVIDIA Device Plugin](https://github.com/NVIDIA/k8s-device-plugin/), com modificações para garantir que as especificações do pod incluam `runtimeClassName: nvidia`, conforme mencionado acima.

## Executando Servidores sem Agentes (Experimental)
> **Aviso:** Este recurso é experimental.

Quando iniciados com o sinalizador `--disable-agent`, os servidores não executam o kubelet, o tempo de execução do contêiner ou o CNI. Eles não registram um recurso Node no cluster e não aparecerão na saída `kubectl get nodes`.
Como eles não hospedam um kubelet, eles não podem executar pods ou ser gerenciados por operadores que dependem da enumeração de nós do cluster, incluindo o controlador etcd incorporado e o controlador de atualização do sistema.

Executar servidores sem agentes pode ser vantajoso se você quiser ocultar os nós do seu plano de controle da descoberta por agentes e cargas de trabalho, ao custo de maior sobrecarga administrativa causada pela falta de suporte do operador de cluster.

Por padrão, o apiserver em servidores sem agente não poderá fazer conexões de saída para webhooks de admissão ou apiservices agregados em execução no cluster. Para remediar isso, defina o sinalizador de servidor `--egress-selector-mode` como `pod` ou `cluster`. Se você estiver alterando esse sinalizador em um cluster existente, precisará reiniciar todos os nós no cluster para que a opção entre em vigor.

## Executando Servers Rootless (Experimental)
> **Aviso:** Este recurso é experimental.

O modo Rootless permite executar servidores K3s como um usuário sem privilégios, a fim de proteger a raiz real no host contra possíveis ataques de invasão de contêiner.

Acesse https://rootlesscontaine.rs/ para saber mais sobre o Rootless Kubernetes.

### Problemas conhecidos com o modo Rootless

* **Portas**

  Ao executar em modo rootless, um novo namespace de rede é criado. Isso significa que a instância do K3s está sendo executada com a rede bastante separada do host.
  A única maneira de acessar os serviços executados no K3s a partir do host é configurar encaminhamentos de porta para o namespace de rede do K3s.
  O K3s rootless inclui um controlador que vinculará automaticamente as portas 6443 e de serviço abaixo de 1024 ao host com um deslocamento de 10000.

  For example, a Service on port 80 will become 10080 on the host, but 8080 will become 8080 without any offset. Currently, only LoadBalancer Services are automatically bound.

* **Cgroups**

  Cgroup v1 e Hybrid v1/v2 não são suportados; somente Cgroup v2 puro é suportado. Se o K3s falhar ao iniciar devido a cgroups ausentes ao executar em rootless, é provável que seu nó esteja no modo Hybrid, e os cgroups "ausentes" ainda estejam vinculados a um controlador v1.

* **Multi-node/multi-process cluster**

  Clusters rootless de vários nós, ou vários processos k3s rootless no mesmo nó, não são suportados atualmente. Veja [#6488](https://github.com/k3s-io/k3s/issues/6488#issuecomment-1314998091) para mais detalhes.

### Iniciando Servers Rootless
* Habilite a delegação do cgroup v2, veja https://rootlesscontaine.rs/getting-started/common/cgroup2/ .
  Esta etapa é necessária; o kubelet rootless falhará ao iniciar sem os cgroups apropriados delegados.

* Baixe `k3s-rootless.service` de [`https://github.com/k3s-io/k3s/blob/<VERSION>/k3s-rootless.service`](https://github.com/k3s-io/k3s/blob/master/k3s-rootless.service).
  Certifique-se de usar a mesma versão de `k3s-rootless.service` e `k3s`.

* Instale `k3s-rootless.service` em `~/.config/systemd/user/k3s-rootless.service`.
  A instalação deste arquivo como um serviço de todo o sistema (`/etc/systemd/...`) não é suportada.
  Dependendo do caminho do binário `k3s`, pode ser necessário modificar a linha `ExecStart=/usr/local/bin/k3s ...` do arquivo.

* Execute `systemctl --user daemon-reload`

* Execute `systemctl --user enable --now k3s-rootless`

* Execute `KUBECONFIG=~/.kube/k3s.yaml kubectl get pods -A` e certifique-se de que os pods estejam em execução.

> **Observação:** não tente executar `k3s server --rootless` em um terminal, pois as sessões de terminal não permitem delegação do cgroup v2.
> Se você realmente precisar testá-lo em um terminal, use `systemd-run --user -p Delegate=yes --tty k3s server --rootless` para envolvê-lo em um escopo systemd.

### Configurações Avançadas Rootless

O Rootless K3s usa [rootlesskit](https://github.com/rootless-containers/rootlesskit) e [slirp4netns](https://github.com/rootless-containers/slirp4netns) para se comunicar entre namespaces de rede de host e usuário.
Algumas das configurações usadas pelo rootlesskit e slirp4nets podem ser definidas por variáveis ​​de ambiente. A melhor maneira de defini-las é adicioná-las ao campo `Environment` da unidade systemd k3s-rootless.

| Variável                             | Valor Padrão | Descrição                                                                                                                                                                  |
| ------------------------------------ | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `K3S_ROOTLESS_MTU`                   | 1500         | Define a MTU para as interfaces virtuais slirp4netns.                                                                                                                      |
| `K3S_ROOTLESS_CIDR`                  | 10.41.0.0/16 | Define o CIDR usado pelas interfaces virtuais slirp4netns.                                                                                                                 |
| `K3S_ROOTLESS_ENABLE_IPV6`           | autotedected | Habilita o suporte IPv6 do slirp4netns. Se não for especificado, ele será habilitado automaticamente se o K3s estiver configurado para operação dual-stack.                |
| `K3S_ROOTLESS_PORT_DRIVER`           | builtin      | Seleciona o driver de porta sem raiz; `builtin` ou `slirp4netns`. Builtin é mais rápido, mas mascara o endereço de origem original dos pacotes de entrada.                 |
| `K3S_ROOTLESS_DISABLE_HOST_LOOPBACK` | true         | Controla se o acesso ao endereço de loopback dos hosts via interface de gateway está habilitado ou não. É recomendado que isso não seja alterado, por razões de segurança. |

### Solução para problemas com Rootless Mode

* Execute `systemctl --user status k3s-rootless` para verificar o status do daemon
* Execute `journalctl --user -f -u k3s-rootless` para ver o log do daemon
* Veja também https://rootlesscontaine.rs/

## Node Labels e Taints

Os agentes K3s podem ser configurados com as opções `--node-label` e `--node-taint` que adicionam uma label e taint ao kubelet. As duas opções apenas adicionam labels e/ou taints [no momento do registro](./cli/agent.md#node-labels-and-taints-for-agents), então eles só podem ser definidos quando o nó é unido ao cluster pela primeira vez.

Todas as versões atuais do Kubernetes restringem os nós de se registrarem com a maioria das labels com prefixos `kubernetes.io` e `k8s.io`, incluindo especificamente a label `kubernetes.io/role`. Se você tentar iniciar um nó com uma label não permitido, o K3s falhará ao iniciar. Conforme declarado pelos autores do Kubernetes:

> Os nós não têm permissão para afirmar suas próprias labels de função. As funções de nó são normalmente usadas para identificar tipos de nós privilegiados ou de plano de controle, e permitir que os nós se rotulem nesse pool permite que um nó comprometido atraia trivialmente cargas de trabalho (como daemonsets de plano de controle) que conferem acesso a credenciais de privilégio mais alto.

Consulte [SIG-Auth KEP 279](https://github.com/kubernetes/enhancements/blob/master/keps/sig-auth/279-limit-node-access/README.md) para obter mais informações.

Se você quiser alterar as labels e taints dos nós após o registro do nó, ou adicionar labels reservados, você deve usar `kubectl`. Consulte a documentação oficial do Kubernetes para obter detalhes sobre como adicionar [taints](https://kubernetes.io/docs/concepts/configuration/taint-and-toleration/) e [label dos nós.](https://kubernetes.io/docs/tasks/configure-pod-container/assign-pods-nodes/#add-a-label-to-a-node)

## Iniciando o Serviço com o Script de Instalação

O script de instalação detectará automaticamente se o seu sistema operacional está usando systemd ou openrc e habilitará e iniciará o serviço como parte do processo de instalação.
* Ao executar com openrc, os logs serão criados em `/var/log/k3s.log`.
* Ao executar com systemd, os logs serão criados em `/var/log/syslog` e visualizados usando `journalctl -u k3s` (ou `journalctl -u k3s-agent` em agentes).

Um exemplo de desabilitação de inicialização automática e habilitação de serviço com o script de instalação:

```bash
curl -sfL https://get.k3s.io | INSTALL_K3S_SKIP_START=true INSTALL_K3S_SKIP_ENABLE=true sh -
```

## Executando K3s no Docker

Existem várias maneiras de executar o K3s no Docker:

<Tabs>
<TabItem value='K3d' default>

[k3d](https://github.com/k3d-io/k3d) é um utilitário projetado para executar facilmente clusters K3s de vários nós no Docker.

O k3d torna muito fácil criar clusters k3s de nó único e múltiplo no docker, por exemplo, para desenvolvimento local no Kubernetes.

Consulte a documentação [Instalação](https://k3d.io/#installation) para obter mais informações sobre como instalar e usar o k3d.

</TabItem>
<TabItem value="Docker">

Para usar o Docker, as imagens `rancher/k3s` também estão disponíveis para executar o servidor e o agente K3s.
Usando o comando `docker run`:

```bash
sudo docker run \
  --privileged \
  --name k3s-server-1 \
  --hostname k3s-server-1 \
  -p 6443:6443 \
  -d rancher/k3s:v1.24.10-k3s1 \
  server
```
:::note
Você deve especificar uma versão válida do K3s como a tag; a tag `latest` não é mantida.
As imagens do Docker não permitem um sinal `+` em tags, use um `-` na tag em vez disso.
:::

Quando o K3s estiver instalado e funcionando, você pode copiar o kubeconfig do administrador do contêiner do Docker para uso:
```bash
sudo docker cp k3s-server-1:/etc/rancher/k3s/k3s.yaml ~/.kube/config
```

</TabItem>
</Tabs>

## SELinux Support

:::info Nota de Versão

Disponível a partir da versão 1.19.4+k3s1

:::

Se você estiver instalando o K3s em um sistema onde o SELinux está habilitado por padrão (como o CentOS), você deve garantir que as políticas adequadas do SELinux tenham sido instaladas.

<Tabs>
<TabItem value="Instalação Automática" default>

O [script de instalação](./installation/configuration.md#configuration-with-install-script) instalará automaticamente o SELinux RPM do repositório Rancher RPM se estiver em um sistema compatível, caso não esteja executando uma instalação air-gapped. A instalação automática pode ser ignorada definindo `INSTALL_K3S_SKIP_SELINUX_RPM=true`.

</TabItem>

<TabItem value="Instalação Manual" default>

As políticas necessárias podem ser instaladas com os seguintes comandos:
```bash
yum install -y container-selinux selinux-policy-base
yum install -y https://rpm.rancher.io/k3s/latest/common/centos/7/noarch/k3s-selinux-1.4-1.el7.noarch.rpm
```

Para forçar o script de instalação a registrar um aviso em vez de falhar, você pode definir a seguinte variável de ambiente: `INSTALL_K3S_SELINUX_WARN=true`.
</TabItem>
</Tabs>

### Habilitando SELinux Enforcement

Para aproveitar o SELinux, especifique o sinalizador `--selinux` ao iniciar servidores e agentes K3s.

Esta opção também pode ser especificada no [arquivo de configuração](./installation/configuration.md#configuration-file) do K3s.

```
selinux: true
```

Não há suporte para usar um `--data-dir` personalizado no SELinux. Para personalizá-lo, você provavelmente precisará escrever sua própria política personalizada. Para orientação, você pode consultar o repositório [containers/container-selinux](https://github.com/containers/container-selinux), que contém os arquivos de política do SELinux para Container Runtimes, e o repositório [k3s-io/k3s-selinux](https://github.com/k3s-io/k3s-selinux), que contém a política do SELinux para o K3s.

## Habilitando o Lazy Pulling do eStargz (Experimental)

### O que é Lazy Pulling e eStargz?

Puxar imagens é conhecido como uma das etapas que consomem mais tempo no ciclo de vida do contêiner.
De acordo com [Harter, et al.](https://www.usenix.org/conference/fast16/technical-sessions/presentation/harter),

> a extração de pacotes é responsável por 76% do tempo de inicialização do contêiner, mas apenas 6,4% desses dados são lidos

Para resolver esse problema, o k3s suporta experimentalmente *lazy pulling* de conteúdos de imagem.
Isso permite que o k3s inicie um contêiner antes que a imagem inteira tenha sido puxada.
Em vez disso, os pedaços necessários de conteúdo (por exemplo, arquivos individuais) são buscados sob demanda.
Especialmente para imagens grandes, essa técnica pode encurtar a latência de inicialização do contêiner.

Para habilitar o lazy pulling, a imagem de destino precisa ser formatada como [*eStargz*](https://github.com/containerd/stargz-snapshotter/blob/main/docs/stargz-estargz.md).
Este é um formato de imagem alternativo ao OCI, mas 100% compatível com OCI para lazy pulling.
Devido à compatibilidade, o eStargz pode ser enviado para registros de contêineres padrão (por exemplo, ghcr.io), assim como isso é *ainda executável* mesmo em tempos de execução agnósticos do eStargz.

O eStargz é desenvolvido com base no [formato stargz proposto pelo projeto Google CRFS](https://github.com/google/crfs), mas vem com recursos práticos, incluindo verificação de conteúdo e otimização de desempenho.
Para mais detalhes sobre lazy pulling e eStargz, consulte o [repositório do projeto Stargz Snapshotter](https://github.com/containerd/stargz-snapshotter).

### Configurar k3s para lazy pulling de eStargz

Conforme mostrado a seguir, a opção `--snapshotter=stargz` é necessária para o servidor e o agente k3s.

```bash
k3s server --snapshotter=stargz
```

Com essa configuração, você pode executar lazy pulling para imagens formatadas em eStargz.
O manifesto de Pod de exemplo a seguir usa a imagem `node:13.13.0` formatada em eStargz (`ghcr.io/stargz-containers/node:13.13.0-esgz`).
Quando o snapshotter stargz está habilitado, o K3s executa lazy pulling para essa imagem.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nodejs
spec:
  containers:
  - name: nodejs-estargz
    image: ghcr.io/stargz-containers/node:13.13.0-esgz
    command: ["node"]
    args:
    - -e
    - var http = require('http');
      http.createServer(function(req, res) {
        res.writeHead(200);
        res.end('Hello World!\n');
      }).listen(80);
    ports:
    - containerPort: 80
```

## Fontes Adicionais de Logs

[Rancher logging](https://rancher.com/docs/rancher/v2.6/en/logging/helm-chart-options/) para K3s pode ser instalado sem usar o Rancher. As seguintes instruções devem ser executadas para fazer isso:

```bash
helm repo add rancher-charts https://charts.rancher.io
helm repo update
helm install --create-namespace -n cattle-logging-system rancher-logging-crd rancher-charts/rancher-logging-crd
helm install --create-namespace -n cattle-logging-system rancher-logging --set additionalLoggingSources.k3s.enabled=true rancher-charts/rancher-logging
```

## Logs Adicionais de Política de Rede

Pacotes descartados por políticas de rede podem ser registrados. O pacote é enviado para a ação NFLOG do iptables, que mostra os detalhes do pacote, incluindo a política de rede que o bloqueou.

Se houver muito tráfego, o número de mensagens de log pode ser muito alto. Para controlar a taxa de log em uma base por política, defina os parâmetros iptables `limit` e `limit-burst` adicionando as seguintes anotações à política de rede em questão:
* `kube-router.io/netpol-nflog-limit=<LIMIT-VALUE>`
* `kube-router.io/netpol-nflog-limit-burst=<LIMIT-BURST-VALUE>`

Os valores padrão são `limit=10/minute` e `limit-burst=10`. Verifique o [manual do iptables](https://www.netfilter.org/documentation/HOWTO/packet-filtering-HOWTO-7.html#:~:text=restrict%20the%20rate%20of%20matches) para obter mais informações sobre o formato e os valores possíveis para esses campos.

Para converter pacotes NFLOG em entradas de log, instale o ulogd2 e configure `[log1]` para ler em `group=100`. Em seguida, reinicie o serviço ulogd2 para que a nova configuração seja confirmada.
Quando um pacote é bloqueado por regras de política de rede, uma mensagem de log aparecerá em `/var/log/ulog/syslogemu.log`.

Os pacotes enviados para o soquete netlink NFLOG também podem ser lidos usando ferramentas de linha de comando como tcpdump ou tshark:
```bash
tcpdump -ni nflog:100
```
Embora mais prontamente disponível, o tcpdump não mostrará o nome da política de rede que bloqueou o pacote. Use o comando tshark do wireshark em vez disso para exibir o cabeçalho completo do pacote NFLOG, incluindo o campo `nflog.prefix` que contém o nome da política.
