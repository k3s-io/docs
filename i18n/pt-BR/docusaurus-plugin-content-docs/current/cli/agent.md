---
title: agente
---

# K3s Agente

Nesta seção, você aprenderá como configurar o agente K3s.

Observe que os servidores também executam um agente, portanto, todos os sinalizadores listados nesta página também são válidos para uso em servidores.

As opções são documentadas nesta página como sinalizadores CLI, mas também podem ser passadas como opções de arquivo de configuração. Veja a documentação do [Arquivo de configuração](../installation/configuration.md#configuration-file) para mais informações sobre o uso de arquivos de configuração YAML.

### Logging

| Flag                    | Valor Padrão | Descrição                                                                                              |
| ----------------------- | ------------ | ------------------------------------------------------------------------------------------------------ |
| `-v` value              | 0            | Número para a verbosidade do nível de log                                                              |
| `--vmodule` value       | N/A          | Lista separada por vírgulas de configurações FILE_PATTERN=LOG_LEVEL para registro filtrado por arquivo |
| `--log value, -l` value | N/A          | Registrar para arquivar                                                                                |
| `--alsologtostderr`     | N/A          | Registre no erro padrão e também no arquivo (se definido)                                              |

### Opções de Cluster

| Flag                       | Variável de Ambiente | Descrição                                      |
| -------------------------- | -------------------- | ---------------------------------------------- |
| `--token value, -t` value  | `K3S_TOKEN`          | Token a ser usado para autenticação            |
| `--token-file` value       | `K3S_TOKEN_FILE`     | Arquivo de token a ser usado para autenticação |
| `--server value, -s` value | `K3S_URL`            | Servidor para conectar                         |

### Listener

| Flag             | Valor Padrão | Descrição               |
| ---------------- | ------------ | ----------------------- |
| `--bind-address` | 0.0.0.0      | Endereço de ligação k3s |

### Data

| Flag                         | Valor Padrão           | Descrição                   |
| ---------------------------- | ---------------------- | --------------------------- |
| `--data-dir value, -d` value | "/var/lib/rancher/k3s" | Pasta para armazenar estado |

### Nó

| Flag                        | Variável de Ambiente | Descrição                                                                                                                                                                                                                                                 |
| --------------------------- | -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--node-name` value         | `K3S_NODE_NAME`      | nome do Nó                                                                                                                                                                                                                                                |
| `--with-node-id`            | N/A                  | Adicionar id ao nome do Nó                                                                                                                                                                                                                                |
| `--node-label` value        | N/A                  | Registrando e iniciando o kubelet com conjunto de rótulos                                                                                                                                                                                                 |
| `--node-taint` value        | N/A                  | Registrando kubelet com conjunto de taints                                                                                                                                                                                                                |
| `--protect-kernel-defaults` | N/A                  | Comportamento de ajuste do kernel. Se definido, erro se os ajustes do kernel forem diferentes dos padrões do kubelet.                                                                                                                                     |
| `--selinux`                 | `K3S_SELINUX`        | Habilitar SELinux no containerd                                                                                                                                                                                                                           |
| `--lb-server-port` value    | `K3S_LB_SERVER_PORT` | Porta local para o balanceador de carga do cliente supervisor. Se o supervisor e o apiserver não estiverem colocalizados, uma porta adicional 1 a menos que esta porta também será usada para o balanceador de carga do cliente apiserver. (padrão: 6444) |

### Runtime

| Flag                           | Valor Padrão                       | Descrição                                                                                                                                                                                |
| ------------------------------ | ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--container-runtime-endpoint` | N/A                                | Desabilite o containerd incorporado e use o soquete CRI no caminho fornecido; quando usado com --docker, isso define o caminho do soquete do docker                                      |
| `--default-runtime`            | N/A                                | Defina o tempo de execução padrão no containerd                                                                                                                                          |
| `--image-service-endpoint`     | N/A                                | Desabilite o serviço de imagem containerd incorporado e use o socket de serviço de imagem remoto no caminho fornecido. Se não for especificado, o padrão é --container-runtime-endpoint. |
| `--pause-image` value          | "docker.io/rancher/pause:3.1"      | Imagem de pausa personalizada para containerd ou docker sandbox                                                                                                                          |
| `--private-registry` value     | "/etc/rancher/k3s/registries.yaml" | Arquivo de configuração de registro privado                                                                                                                                              |

### Rede

| Flag                        | Variável de Ambiente | Descrição                                             |
| --------------------------- | -------------------- | ----------------------------------------------------- |
| `--node-ip value, -i` value | N/A                  | Endereço IP para anunciar o nó                        |
| `--node-external-ip` value  | N/A                  | Endereço IP externo para anunciar o nó                |
| `--node-internal-dns`       | N/A                  | endereços DNS internos para anunciar o nó             |
| `--node-external-dns`       | N/A                  | endereços DNS externos para anunciar o nó             |
| `--resolv-conf` value       | `K3S_RESOLV_CONF`    | Arquivo resolv.conf do Kubelet                        |
| `--flannel-iface` value     | N/A                  | Substituir interface de flanela padrão                |
| `--flannel-conf` value      | N/A                  | Substituir arquivo de configuração flannel padrão     |
| `--flannel-cni-conf` value  | N/A                  | Substituir arquivo de configuração cni flannel padrão |

### Flags Customizadas

| Flag                     | Descrição                                         |
| ------------------------ | ------------------------------------------------- |
| `--kubelet-arg` value    | Bandeira personalizada para o processo kubelet    |
| `--kube-proxy-arg` value | Bandeira personalizada para o processo kube-proxy |

### Experimental

| Flag                                  | Descrição                                                                                                                                                  |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--rootless`                          | Executa modo Rootless                                                                                                                                      |
| `--docker`                            | Use cri-dockerd em vez de containerd                                                                                                                       |
| `--enable-pprof`                      | Habilitar ponto de extremidade pprof na porta do supervisor                                                                                                |
| `--prefer-bundled-bin`                | Prefira binários de espaço de usuário agrupados em vez de binários de host                                                                                 |
| `--disable-default-registry-endpoint` | Consulte "[Default Endpoint Fallback](../installation/private-registry.md#default-endpoint-fallback)"                                                      |
| `--vpn-auth`                          | Consulte "[Integration with the Tailscale VPN provider](../networking/distributed-multicloud.md#integration-with-the-tailscale-vpn-provider-experimental)" |
| `--vpn-auth-file`                     | Consulte "[Integration with the Tailscale VPN provider](../networking/distributed-multicloud.md#integration-with-the-tailscale-vpn-provider-experimental)" |

### Depreciado

| Flag                     | Variável de Ambiente | Descrição                    |
| ------------------------ | -------------------- | ---------------------------- |
| `--no-flannel`           | N/A                  | Use `--flannel-backend=none` |
| `--cluster-secret` value | `K3S_CLUSTER_SECRET` | Use `--token`                |

### Rótulos de Nós e Taints para Agentes

Os agentes K3s podem ser configurados com as opções `--node-label` e `--node-taint` que adicionam um rótulo e taint ao kubelet. As duas opções apenas adicionam rótulos e/ou taints no momento do registro, então eles só podem ser adicionados uma vez e não alterados depois disso novamente executando comandos K3s.

Abaixo está um exemplo mostrando como adicionar rótulos e uma contaminação:

```bash
     --node-label foo=bar \
     --node-label hello=world \
     --node-taint key1=value1:NoExecute
```

Se você quiser alterar os rótulos e taints dos nós após o registro do nó, você deve usar `kubectl`. Consulte a documentação oficial do Kubernetes para obter detalhes sobre como adicionar [taints](https://kubernetes.io/docs/concepts/configuration/taint-and-toleration/) e [rótulos dos nós.](https://kubernetes.io/docs/tasks/configure-pod-container/assign-pods-nodes/#add-a-label-to-a-node)

### Ajuda do CLI do Agemte K3s

> Se uma opção aparecer entre colchetes abaixo, por exemplo `[$K3S_URL]`, significa que a opção pode ser passada como uma variável de ambiente com esse nome.

```bash
NAME:
   k3s agent - Run node agent

USAGE:
   k3s agent [OPTIONS]

OPTIONS:
   --config FILE, -c FILE                     (config) Load configuration from FILE (default: "/etc/rancher/k3s/config.yaml") [$K3S_CONFIG_FILE]
   --debug                                    (logging) Turn on debug logs [$K3S_DEBUG]
   -v value                                   (logging) Number for the log level verbosity (default: 0)
   --vmodule value                            (logging) Comma-separated list of FILE_PATTERN=LOG_LEVEL settings for file-filtered logging
   --log value, -l value                      (logging) Log to file
   --alsologtostderr                          (logging) Log to standard error as well as file (if set)
   --token value, -t value                    (cluster) Token to use for authentication [$K3S_TOKEN]
   --token-file value                         (cluster) Token file to use for authentication [$K3S_TOKEN_FILE]
   --server value, -s value                   (cluster) Server to connect to [$K3S_URL]
   --data-dir value, -d value                 (agent/data) Folder to hold state (default: "/var/lib/rancher/k3s") [$K3S_DATA_DIR]
   --node-name value                          (agent/node) Node name [$K3S_NODE_NAME]
   --with-node-id                             (agent/node) Append id to node name
   --node-label value                         (agent/node) Registering and starting kubelet with set of labels
   --node-taint value                         (agent/node) Registering kubelet with set of taints
   --image-credential-provider-bin-dir value  (agent/node) The path to the directory where credential provider plugin binaries are located (default: "/var/lib/rancher/credentialprovider/bin")
   --image-credential-provider-config value   (agent/node) The path to the credential provider plugin config file (default: "/var/lib/rancher/credentialprovider/config.yaml")
   --selinux                                  (agent/node) Enable SELinux in containerd [$K3S_SELINUX]
   --lb-server-port value                     (agent/node) Local port for supervisor client load-balancer. If the supervisor and apiserver are not colocated an additional port 1 less than this port will also be used for the apiserver client load-balancer. (default: 6444) [$K3S_LB_SERVER_PORT]
   --protect-kernel-defaults                  (agent/node) Kernel tuning behavior. If set, error if kernel tunables are different than kubelet defaults.
   --container-runtime-endpoint value         (agent/runtime) Disable embedded containerd and use the CRI socket at the given path; when used with --docker this sets the docker socket path
   --default-runtime value                    (agent/runtime) Set the default runtime in containerd
   --image-service-endpoint value             (agent/runtime) Disable embedded containerd image service and use remote image service socket at the given path. If not specified, defaults to --container-runtime-endpoint.
   --pause-image value                        (agent/runtime) Customized pause image for containerd or docker sandbox (default: "rancher/mirrored-pause:3.6")
   --snapshotter value                        (agent/runtime) Override default containerd snapshotter (default: "overlayfs")
   --private-registry value                   (agent/runtime) Private registry configuration file (default: "/etc/rancher/k3s/registries.yaml")
   --disable-default-registry-endpoint        (agent/containerd) Disables containerd fallback default registry endpoint when a mirror is configured for that registry
   --nonroot-devices                          (agent/containerd) Allows non-root pods to access devices by setting device_ownership_from_security_context=true in the containerd CRI config
   --node-ip value, -i value                  (agent/networking) IPv4/IPv6 addresses to advertise for node
   --bind-address value                       (listener) k3s bind address (default: 0.0.0.0)
   --node-external-ip value                   (agent/networking) IPv4/IPv6 external IP addresses to advertise for node
   --node-internal-dns value                  (agent/networking) internal DNS addresses to advertise for node
   --node-external-dns value                  (agent/networking) external DNS addresses to advertise for node
   --resolv-conf value                        (agent/networking) Kubelet resolv.conf file [$K3S_RESOLV_CONF]
   --flannel-iface value                      (agent/networking) Override default flannel interface
   --flannel-conf value                       (agent/networking) Override default flannel config file
   --flannel-cni-conf value                   (agent/networking) Override default flannel cni config file
   --kubelet-arg value                        (agent/flags) Customized flag for kubelet process
   --kube-proxy-arg value                     (agent/flags) Customized flag for kube-proxy process
   --enable-pprof                             (experimental) Enable pprof endpoint on supervisor port
   --rootless                                 (experimental) Run rootless
   --prefer-bundled-bin                       (experimental) Prefer bundled userspace binaries over host binaries
   --docker                                   (agent/runtime) (experimental) Use cri-dockerd instead of containerd
   --vpn-auth value                           (agent/networking) (experimental) Credentials for the VPN provider. It must include the provider name and join key in the format name=<vpn-provider>,joinKey=<key>[,controlServerURL=<url>][,extraArgs=<args>] [$K3S_VPN_AUTH]
   --vpn-auth-file value                      (agent/networking) (experimental) File containing credentials for the VPN provider. It must include the provider name and join key in the format name=<vpn-provider>,joinKey=<key>[,controlServerURL=<url>][,extraArgs=<args>] [$K3S_VPN_AUTH_FILE]
   --disable-apiserver-lb                     (agent/networking) (experimental) Disable the agent client-side load-balancer and connect directly to the configured server address
```
