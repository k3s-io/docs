---
title: servidor
---

# K3s Servidor

Nesta seção, você aprenderá como configurar o servidor K3s.

Observe que os servidores também executam um agente, portanto, todas as opções de configuração listadas na [documentação do `k3s agent`](agent.md) também são suportadas nos servidores.

As opções são documentadas nesta página como sinalizadores CLI, mas também podem ser passadas como opções de arquivo de configuração. Veja a documentação do [Arquivo de configuração](../installation/configuration.md#configuration-file) para mais informações sobre o uso de arquivos de configuração YAML.

## Valores Críticos de Configuração

As seguintes opções devem ser definidas com o mesmo valor em todos os servidores no cluster. Não fazer isso fará com que novos servidores não consigam ingressar no cluster ao usar etcd incorporado, ou operação incorreta do cluster ao usar um datastore externo.

* `--agent-token`
* `--cluster-cidr`
* `--cluster-dns`
* `--cluster-domain`
* `--disable-cloud-controller`
* `--disable-helm-controller`
* `--disable-network-policy`
* `--disable=servicelb` *nota: outros componentes empacotados podem ser desabilitados por servidor*
* `--egress-selector-mode`
* `--embedded-registry`
* `--flannel-backend`
* `--flannel-external-ip`
* `--flannel-ipv6-masq`
* `--secrets-encryption`
* `--service-cidr`

## Opções Comumente Usadas

### Banco de Dados

| Flag                                  | Variável de Ambiente     | Valor Padrão                           | Descrição                                                                                                                                              |
| ------------------------------------- | ------------------------ | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `--datastore-endpoint` value          | `K3S_DATASTORE_ENDPOINT` |                                        | Especifique o nome da fonte de dados etcd, NATS, MySQL, Postgres ou SQLite                                                                             |
| `--datastore-cafile` value            | `K3S_DATASTORE_CAFILE`   |                                        | Arquivo de Autoridade de Certificação TLS usado para proteger a comunicação de backend do armazenamento de dados                                       |
| `--datastore-certfile` value          | `K3S_DATASTORE_CERTFILE` |                                        | Arquivo de certificação TLS usado para proteger a comunicação de backend do datastore                                                                  |
| `--datastore-keyfile` value           | `K3S_DATASTORE_KEYFILE`  |                                        | Arquivo de chave TLS usado para proteger a comunicação de backend do datastore                                                                         |
| `--etcd-expose-metrics`               |                          | false                                  | Exponha métricas etcd à interface do cliente                                                                                                           |
| `--etcd-disable-snapshots`            |                          | false                                  | Desabilitar snapshots automáticos do etcd                                                                                                              |
| `--etcd-snapshot-name` value          |                          | "etcd-snapshot-&lt;unix-timestamp&gt;" | Defina o nome base dos instantâneos do etcd.                                                                                                           |
| `--etcd-snapshot-schedule-cron` value |                          | "0 */12 \* \* \*"                      | Tempo de intervalo de instantâneo na especificação cron, por exemplo, a cada 5 horas '0 */5 _ \* _'                                                    |
| `--etcd-snapshot-retention` value     |                          | 5                                      | Número de instantâneos a reter                                                                                                                         |
| `--etcd-snapshot-dir` value           |                          | $\{data-dir\}/db/snapshots             | Diretório para salvar snapshots do banco de dados                                                                                                      |
| `--etcd-s3`                           |                          |                                        | Habilitar backup para S3                                                                                                                               |
| `--etcd-s3-endpoint` value            |                          | "s3.amazonaws.com"                     | Endpoint URL S3                                                                                                                                        |
| `--etcd-s3-endpoint-ca` value         |                          |                                        | Certificado CA personalizado S3 para conectar ao endpoint S3                                                                                           |
| `--etcd-s3-skip-ssl-verify`           |                          |                                        | Desabilita a validação do certificado SSL S3                                                                                                           |
| `--etcd-s3-access-key` value          | `AWS_ACCESS_KEY_ID`      |                                        | Chave de acesso S3                                                                                                                                     |
| `--etcd-s3-secret-key` value          | `AWS_SECRET_ACCESS_KEY`  |                                        | Chave secreta S3                                                                                                                                       |
| `--etcd-s3-bucket` value              |                          |                                        | Nome do bucket S3                                                                                                                                      |
| `--etcd-s3-region` value              |                          | "us-east-1"                            | Região S3 / localização do bucket (opcional)                                                                                                           |
| `--etcd-s3-folder` value              |                          |                                        | Pasta S3                                                                                                                                               |
| `--etcd-s3-proxy`                     |                          |                                        | Servidor proxy a ser usado ao conectar ao S3, substituindo quaisquer variáveis ​​de ambiente relacionadas ao proxy                                     |
| `--etcd-s3-config-secret`             |                          |                                        | Nome do segredo no namespace kube-system usado para configurar o S3, se o etcd-s3 estiver habilitado e nenhuma outra opção do etcd-s3 estiver definida |
| `--etcd-s3-insecure`                  |                          |                                        | Desabilita S3 sobre HTTPS                                                                                                                              |
| `--etcd-s3-timeout` value             |                          | 5m0s                                   | Tempo limite S3 (padrão: 5m0s)                                                                                                                         |




### Opções de Cluster

| Flag                        | Variável de Ambiente   | Descrição                                                                    |
| --------------------------- | ---------------------- | ---------------------------------------------------------------------------- |
| `--token` value, `-t` value | `K3S_TOKEN`            | Segredo compartilhado usado para unir um servidor ou agente a um cluster     |
| `--token-file` value        | `K3S_TOKEN_FILE`       | Arquivo contendo o cluster-secret/token                                      |
| `--agent-token` value       | `K3S_AGENT_TOKEN`      | Segredo compartilhado usado para unir agentes ao cluster, mas não servidores |
| `--agent-token-file` value  | `K3S_AGENT_TOKEN_FILE` | Arquivo contendo o segredo do agente                                         |
| `--server` value            | `K3S_URL`              | Servidor ao qual se conectar, usado para unir um cluster                     |
| `--cluster-init`            | `K3S_CLUSTER_INIT`     | Inicializar um novo cluster usando o Etcd incorporado                        |
| `--cluster-reset`           | `K3S_CLUSTER_RESET`    | Esqueça todos os pares e torne-se o único membro de um novo cluster          |


### Opções do Kubeconfig Admin

| Flag                                 | Variável de Ambiente    | Descrição                                                                                                                                                                                                                                                      |
| ------------------------------------ | ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--write-kubeconfig value, -o` value | `K3S_KUBECONFIG_OUTPUT` | Grava o kubeconfig para o cliente administrador neste arquivo                                                                                                                                                                                                  |
| `--write-kubeconfig-mode` value      | `K3S_KUBECONFIG_MODE`   | Grava o kubeconfig com este [modo.](https://en.wikipedia.org/wiki/Chmod) O arquivo kubeconfig é de propriedade do root e é escrito com um modo padrão de 600. Alterar o modo para 644 permitirá que ele seja lido por outros usuários sem privilégios no host. |
| `--write-kubeconfig-group` value     | `K3S_KUBECONFIG_GROUP`  | Grava o grupo kubeconfig. Combinado com `--write-kubeconfig-mode`, permitirá que seus administradores do k3s acessem o arquivo kubeconfig, mas mantendo o arquivo de propriedade do root.                                                                      |

## Opções Avançadas

### Logging

| Flag                    | Valor Padrão | Descrição                                                                                         |
| ----------------------- | ------------ | ------------------------------------------------------------------------------------------------- |
| `--debug`               | N/A          | Ativar logs de depuração                                                                          |
| `-v` value              | 0            | Número para o detalhamento do nível de log                                                        |
| `--vmodule` value       | N/A          | Lista separada por vírgulas de configurações FILE_PATTERN=LOG_LEVEL para log filtrado por arquivo |
| `--log value, -l` value | N/A          | Logar no arquivo                                                                                  |
| `--alsologtostderr`     | N/A          | Logar no erro padrão e também no arquivo (se definido)                                            |

### Listeners

| Flag                        | Valor Padrão             | Descrição                                                                                                                                                                                                  |
| --------------------------- | ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--bind-address` value      | 0.0.0.0                  | Endereço de bind k3s                                                                                                                                                                                       |
| `--https-listen-port` value | 6443                     | Porta de escuta HTTPS                                                                                                                                                                                      |
| `--advertise-address` value | node-external-ip/node-ip | Endereço IPv4/IPv6 que o apiserver anuncia para seu ponto de extremidade de serviço<br/>Observe que o intervalo IP primário `service-cidr` deve ser da mesma família de endereços que o endereço anunciado |
| `--advertise-port` value    | listen-port/0            | Porta que o apiserver usa para anunciar aos membros do cluster                                                                                                                                             |
| `--tls-san` value           | N/A                      | Adicione nomes de host adicionais ou endereços IPv4/IPv6 como Nomes Alternativos de Assunto no certificado TLS                                                                                             |
| `--tls-san-security`        | true                     | Proteja o certificado TLS do servidor recusando-se a adicionar nomes alternativos de assunto não associados ao serviço apiserver do kubernetes, nós do servidor ou valores da opção tls-san                |


### Data

| Flag                         | Valor Padrão                                                 | Descrição                   |
| ---------------------------- | ------------------------------------------------------------ | --------------------------- |
| `--data-dir value, -d` value | `/var/lib/rancher/k3s` or `${HOME}/.rancher/k3s` if not root | Pasta para armazenar estado |

### Criptografia de Secrets

| Flag                   | Valor Padrão | Descrição                                 |
| ---------------------- | ------------ | ----------------------------------------- |
| `--secrets-encryption` | false        | Habilitar criptografia secreta em repouso |


### Rede

| Flag                              | Valor Padrão    | Descrição                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| --------------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `--cluster-cidr` value            | "10.42.0.0/16"  | CIDRs de rede IPv4/IPv6 para usar no pod IPs                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `--service-cidr` value            | "10.43.0.0/16"  | CIDRs de rede IPv4/IPv6 para uso em serviço                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `--service-node-port-range` value | "30000-32767"   | Intervalo de portas a ser reservado para serviços com visibilidade NodePort                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `--cluster-dns` value             | "10.43.0.10"    | IP do cluster IPv4 para o serviço coredns. Deve estar no seu intervalo service-cidr                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `--cluster-domain` value          | "cluster.local" | Cluster Domain                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `--flannel-backend` value         | "vxlan"         | Um de 'none', 'vxlan', 'ipsec' (obsoleto), 'host-gw', 'wireguard-native' ou 'wireguard' (obsoleto)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `--flannel-ipv6-masq`             | "N/A"           | Habilitar mascaramento IPv6 para pod                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `--flannel-external-ip`           | "N/A"           | Use endereços IP externos do nó para tráfego Flannel                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `--servicelb-namespace` value     | "kube-system"   | Namespace dos pods para o componente servicelb                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `--egress-selector-mode` value    | "agent"         | Deve ser um dos seguintes: <ul><li>desabilitado: O apiserver não usa túneis de agente para se comunicar com nós. Requer que os servidores executem agentes e tenham conectividade direta com o kubelet em agentes, ou o apiserver não poderá acessar os pontos de extremidade do serviço ou executar kubectl exec e kubectl logs.</li><li>agente: O apiserver usa túneis de agente para se comunicar com nós. Os nós permitem a conexão do túnel de endereços de loopback. Requer que os servidores também executem agentes, ou o apiserver não poderá acessar os pontos de extremidade do serviço. O padrão histórico para k3s.</li><li> pod: O apiserver usa túneis de agente para se comunicar com nós e pontos de extremidade do serviço, roteando conexões de ponto de extremidade para o agente correto observando os nós. Os nós permitem a conexão do túnel de endereços de loopback ou um CIDR atribuído ao seu nó.</li><li> cluster: O apiserver usa túneis de agente para se comunicar com nós e pontos de extremidade do serviço, roteando conexões de ponto de extremidade para o agente correto observando os pontos de extremidade. Os nós permitem a conexão de túnel a partir de endereços de loopback ou do intervalo CIDR do cluster configurado.</li></ul> |


### Classe de Armazenamento

| Flag                                 | Descrição                                                                                 |
| ------------------------------------ | ----------------------------------------------------------------------------------------- |
| `--default-local-storage-path` value | Caminho de armazenamento local padrão para classe de armazenamento do provisionador local |

### Componentes do Kubernetes

| Flag                         | Descrição                                                                                                |
| ---------------------------- | -------------------------------------------------------------------------------------------------------- |
| `--disable` value            | Consulte "[Using the `--disable` flag](../installation/packaged-components.md#using-the---disable-flag)" |
| `--disable-scheduler`        | Desabilitar o agendador padrão do Kubernetes                                                             |
| `--disable-cloud-controller` | Desabilitar o gerenciador de controlador de nuvem padrão do k3s                                          |
| `--disable-kube-proxy`       | Desabilitar execução do kube-proxy                                                                       |
| `--disable-network-policy`   | Desabilitar controlador de política de rede padrão k3s                                                   |
| `--disable-helm-controller`  | Desabilitar controlador Helm                                                                             |


### Flags Customizada para Processos do Kubernetes

| Flag                                        | Descrição                                                               |
| ------------------------------------------- | ----------------------------------------------------------------------- |
| `--etcd-arg` value                          | Bandeira personalizada para processo etcd                               |
| `--kube-apiserver-arg` value                | Sinalizador personalizado para o processo kube-apiserver                |
| `--kube-scheduler-arg` value                | Bandeira personalizada para o processo kube-scheduler                   |
| `--kube-controller-manager-arg` value       | Bandeira personalizada para o processo kube-controller-manager          |
| `--kube-cloud-controller-manager-arg` value | Sinalizador personalizado para o processo kube-cloud-controller-manager |
| `--kubelet-arg` value                       | Bandeira personalizada para o processo kubelet                          |
| `--kube-proxy-arg` value                    | Bandeira personalizada para o processo kube-proxy                       |

### Experimental Options

| Flag                   | Descrição                                                                                                                                              |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `--rootless`           | Modo rootless                                                                                                                                          |
| `--enable-pprof`       | Habilitar ponto de extremidade pprof na porta do supervisor                                                                                            |
| `--docker`             | Use cri-dockerd em vez de containerd                                                                                                                   |
| `--prefer-bundled-bin` | Prefira binários de espaço de usuário agrupados em vez de binários de host                                                                             |
| `--disable-agent`      | Consulte "[Executando Servidores Sem Agente](../advanced.md#running-agentless-servers-experimental)"                                                   |
| `--embedded-registry`  | Consulte "[Espelho do Registro Incorporado](../installation/registry-mirror.md)"                                                                       |
| `--vpn-auth`           | Consulte "[Integração com o provedor Tailscale VPN](../networking/distributed-multicloud.md#integration-with-the-tailscale-vpn-provider-experimental)" |
| `--vpn-auth-file`      | Consulte "[Integração com o provedor Tailscale VPN](../networking/distributed-multicloud.md#integration-with-the-tailscale-vpn-provider-experimental)" |

### Opções Depreciadas

| Flag                                    | Variável de Ambiente | Descrição                                                                                                |
| --------------------------------------- | -------------------- | -------------------------------------------------------------------------------------------------------- |
| `--no-flannel`                          | N/A                  | Use `--flannel-backend=none`                                                                             |
| `--no-deploy` value                     | N/A                  | Use `--disable`                                                                                          |
| `--cluster-secret` value                | `K3S_CLUSTER_SECRET` | Use `--token`                                                                                            |
| `--flannel-backend` wireguard           | N/A                  | Use `--flannel-backend=wireguard-native`                                                                 |
| `--flannel-backend` value=option1=value | N/A                  | Use `--flannel-conf` para especificar o arquivo de configuração do flannel com a configuração do backend |


## Ajuda do K3s Server CLI

> Se uma opção aparecer entre colchetes abaixo, por exemplo `[$K3S_TOKEN]`, significa que a opção pode ser passada como uma variável de ambiente com esse nome.

```bash
NAME:
   k3s server - Run management server

USAGE:
   k3s server [OPTIONS]

OPTIONS:
   --config FILE, -c FILE                     (config) Carregar configuração do ARQUIVO (padrão: "/etc/rancher/k3s/config.yaml") [$K3S_CONFIG_FILE]
   --debug                                    (logging) Ativar logs de depuração [$K3S_DEBUG]
   -v value                                   (logging) Número para a verbosidade do nível de log (padrão: 0)
   --vmodule value                            (logging) Lista separada por vírgulas de configurações FILE_PATTERN=LOG_LEVEL para registro filtrado por arquivo
   --log value, -l value                      (logging) Arquivo Log
   --alsologtostderr                          (logging) Registre no erro padrão e também no arquivo (se definido)
   --bind-address value                       (listener) Endereço de ligação k3s (padrão: 0.0.0.0)
   --https-listen-port value                  (listener) Porta de escuta HTTPS (padrão: 6443)
   --advertise-address value                  (listener) Endereço IPv4/IPv6 que o apiserver usa para anunciar aos membros do cluster (padrão: node-external-ip/node-ip)
   --advertise-port value                     (listener) Porta que o apiserver usa para anunciar aos membros do cluster (padrão: listen-port) (padrão: 0)
   --tls-san value                            (listener) Adicione nomes de host adicionais ou endereços IPv4/IPv6 como nomes alternativos de assunto no certificado TLS do servidor
   --tls-san-security                         (listener) Proteja o certificado TLS do servidor recusando-se a adicionar nomes alternativos de assunto não associados ao serviço apiserver do kubernetes, nós do servidor ou valores da opção tls-san (padrão: true)
   --data-dir value, -d value                 (data) Pasta para armazenar o estado padrão /var/lib/rancher/k3s ou ${HOME}/.rancher/k3s se não for root [$K3S_DATA_DIR]
   --cluster-cidr value                       (networking) CIDRs de rede IPv4/IPv6 a serem usados ​​para IPs de pod (padrão: 10.42.0.0/16)
   --service-cidr value                       (networking) CIDRs de rede IPv4/IPv6 a serem usados ​​para IPs de serviço (padrão: 10.43.0.0/16)
   --service-node-port-range value            (networking) Intervalo de portas a ser reservado para serviços com visibilidade NodePort (padrão: "30000-32767")
   --cluster-dns value                        (networking) IP do cluster IPv4 para o serviço coredns. Deve estar no seu intervalo service-cidr (padrão: 10.43.0.10)
   --cluster-domain value                     (networking) Domínio do Cluster (padrão: "cluster.local")
   --flannel-backend value                    (networking) Backend (valores válidos: 'none', 'vxlan', 'host-gw', 'wireguard-native' (padrão: "vxlan")
   --flannel-ipv6-masq                        (networking) Habilitar mascaramento IPv6 para pod
   --flannel-external-ip                      (networking) Use endereços IP externos do nó para tráfego Flannel
   --egress-selector-mode value               (networking) Um de 'agente', 'cluster', 'pod', 'desabilitado' (padrão: "agente")
   --servicelb-namespace value                (networking) Namespace dos pods para o componente servicelb (padrão: "kube-system")
   --write-kubeconfig value, -o value         (client) Escreva o kubeconfig para o cliente administrador neste arquivo [$K3S_KUBECONFIG_OUTPUT]
   --write-kubeconfig-mode value              (client) Escreva kubeconfig com este modo [$K3S_KUBECONFIG_MODE]
   --write-kubeconfig-group value             (client) Escreva kubeconfig com este grupo [$K3S_KUBECONFIG_GROUP]
   --helm-job-image value                     (helm) Imagem padrão a ser usada para trabalhos de helm
   --token value, -t value                    (cluster) Segredo compartilhado usado para unir um servidor ou agente a um cluster [$K3S_TOKEN]
   --token-file value                         (cluster) Arquivo contendo o token [$K3S_TOKEN_FILE]
   --agent-token value                        (cluster) Segredo compartilhado usado para unir agentes ao cluster, mas não servidores [$K3S_AGENT_TOKEN]
   --agent-token-file value                   (cluster) Arquivo contendo o segredo do agente [$K3S_AGENT_TOKEN_FILE]
   --server value, -s value                   (cluster) Servidor para conectar, usado para ingressar em um cluster [$K3S_URL]
   --cluster-init                             (cluster) Inicializar um novo cluster usando Etcd incorporado [$K3S_CLUSTER_INIT]
   --cluster-reset                            (cluster) Esqueça todos os pares e torne-se o único membro de um novo cluster [$K3S_CLUSTER_RESET]
   --cluster-reset-restore-path value         (db) Caminho para o arquivo de instantâneo a ser restaurado
   --kube-apiserver-arg value                 (flags) Sinalizador personalizado para o processo kube-apiserver
   --etcd-arg value                           (flags) Bandeira personalizada para processo etcd
   --kube-controller-manager-arg value        (flags) Bandeira personalizada para o processo kube-controller-manager
   --kube-scheduler-arg value                 (flags) Bandeira personalizada para o processo kube-scheduler
   --kube-cloud-controller-manager-arg value  (flags) Sinalizador personalizado para o processo kube-cloud-controller-manager
   --datastore-endpoint value                 (db) Especifique o nome da fonte de dados etcd, NATS, MySQL, Postgres ou SQLite (padrão) [$K3S_DATASTORE_ENDPOINT]
   --datastore-cafile value                   (db) Arquivo de Autoridade de Certificação TLS usado para proteger a comunicação de backend do datastore [$K3S_DATASTORE_CAFILE]
   --datastore-certfile value                 (db) Arquivo de certificado TLS usado para proteger a comunicação de backend do datastore [$K3S_DATASTORE_CERTFILE]
   --datastore-keyfile value                  (db) Arquivo de chave TLS usado para proteger a comunicação de backend do datastore [$K3S_DATASTORE_KEYFILE]
   --etcd-expose-metrics                      (db) Exponha métricas etcd à interface do cliente. (padrão: falso)
   --etcd-disable-snapshots                   (db) Desabilitar snapshots automáticos do etcd
   --etcd-snapshot-name value                 (db) Defina o nome base dos instantâneos do etcd (padrão: etcd-snapshot-<unix-timestamp>) (padrão: "etcd-snapshot")
   --etcd-snapshot-schedule-cron value        (db) Tempo de intervalo da execução da cron de snapshots, por exemplo, a cada 5 horas '0 */5 * * *' (padrão: "0 */12 * * *")
   --etcd-snapshot-retention value            (db) Número de instantâneos a reter (padrão: 5)
   --etcd-snapshot-dir value                  (db) Diretório para salvar instantâneos do banco de dados. (padrão: ${data-dir}/db/snapshots)
   --etcd-snapshot-compress                   (db) Compactar snapshot etcd
   --etcd-s3                                  (db) Habilitar backup para S3
   --etcd-s3-endpoint value                   (db) S3 endpoint url (default: "s3.amazonaws.com")
   --etcd-s3-endpoint-ca value                (db) Certificado CA customizado S3 para conectar ao endpoint S3
   --etcd-s3-skip-ssl-verify                  (db) Desabilita a validação do certificado SSL S3
   --etcd-s3-access-key value                 (db) Chave de acesso S3 [$AWS_ACCESS_KEY_ID]
   --etcd-s3-secret-key value                 (db) Chave secreta S3 [$AWS_SECRET_ACCESS_KEY]
   --etcd-s3-bucket value                     (db) Nome do bucket S3
   --etcd-s3-region value                     (db) Região S3 / localização do bucket (opcional) (padrão: "us-east-1")
   --etcd-s3-folder value                     (db) Pasta S3
   --etcd-s3-proxy value                      (db) Servidor proxy a ser usado ao conectar ao S3, substituindo quaisquer variáveis ​​de ambiente relacionadas ao proxy
   --etcd-s3-config-secret value              (db) Nome do secret no namespace kube-system usado para configurar o S3, se o etcd-s3 estiver habilitado e nenhuma outra opção do etcd-s3 estiver definida
   --etcd-s3-insecure                         (db) Desabilita S3 sobre HTTPS
   --etcd-s3-timeout value                    (db) Tempo limite S3 (padrão: 5m0s)
   --default-local-storage-path value         (storage) Caminho de armazenamento local padrão para classe de armazenamento do provisionador local
   --disable value                            (components) Não implante componentes empacotados e exclua quaisquer componentes implantados (itens válidos: coredns, servicelb, traefik, local-storage, metrics-server, runtimes)
   --disable-scheduler                        (components) Desabilitar o agendador padrão do Kubernetes
   --disable-cloud-controller                 (components) Desabilitar o gerenciador de controlador de nuvem padrão do k3s
   --disable-kube-proxy                       (components) Desabilitar execução do kube-proxy
   --disable-network-policy                   (components) Desabilitar controlador de política de rede padrão k3s
   --disable-helm-controller                  (components) Desabilitar controlador Helm
   --embedded-registry                        (experimental/components) Habilitar registro de contêiner distribuído incorporado; requer o uso de contêiner incorporado; quando habilitado, os agentes também escutarão na porta do supervisor
   --supervisor-metrics                       (experimental/components) Habilitar o serviço de métricas internas do k3s na porta do supervisor; quando habilitado, os agentes também escutarão na porta do supervisor
   --node-name value                          (agent/node) Nome do nó [$K3S_NODE_NAME]
   --with-node-id                             (agent/node) Adicionar id ao nome do nó
   --node-label value                         (agent/node) Registrando e iniciando o kubelet com conjunto de rótulos
   --node-taint value                         (agent/node) Registrando kubelet com conjunto de taints
   --image-credential-provider-bin-dir value  (agent/node) O caminho para o diretório onde os binários do plugin do provedor de credenciais estão localizados (padrão: "/var/lib/rancher/credentialprovider/bin")
   --image-credential-provider-config value   (agent/node) O caminho para o arquivo de configuração do plugin do provedor de credenciais (padrão: "/var/lib/rancher/credentialprovider/config.yaml")
   --docker                                   (agent/runtime) (experimental) Use cri-dockerd em vez de containerd
   --container-runtime-endpoint value         (agent/runtime) Desabilite o containerd incorporado e use o soquete CRI no caminho fornecido; quando usado com --docker, isso define o caminho do soquete do docker
   --default-runtime value                    (agent/runtime) Defina o tempo de execução padrão no containerd
   --image-service-endpoint value             (agent/runtime) Desabilite o serviço de imagem containerd incorporado e use o socket de serviço de imagem remoto no caminho fornecido. Se não for especificado, o padrão é --container-runtime-endpoint.
   --disable-default-registry-endpoint        (agent/containerd) Desabilita o ponto de extremidade de registro padrão de fallback do containerd quando um espelho é configurado para esse registro
   --nonroot-devices                          (agent/containerd) Permite que pods não root acessem dispositivos definindo device_ownership_from_security_context=true na configuração CRI do containerd
   --pause-image value                        (agent/runtime) Imagem de pausa personalizada para containerd ou docker sandbox (padrão: "rancher/mirrored-pause:3.6")
   --snapshotter value                        (agent/runtime) Substituir snapshotter padrão do containerd (padrão: "overlayfs")
   --private-registry value                   (agent/runtime) Arquivo de configuração de registro privado (padrão: "/etc/rancher/k3s/registries.yaml")
   --system-default-registry value            (agent/runtime) Registro privado a ser usado para todas as imagens do sistema [$K3S_SYSTEM_DEFAULT_REGISTRY]
   --node-ip value, -i value                  (agent/networking) Endereços IPv4/IPv6 para anunciar para o nó
   --node-external-ip value                   (agent/networking) Endereços IP externos IPv4/IPv6 para anunciar para o nó
   --node-internal-dns value                  (agent/networking) endereços DNS internos para anunciar o nó
   --node-external-dns value                  (agent/networking) endereços DNS externos para anunciar o nó
   --resolv-conf value                        (agent/networking) Kubelet resolv.conf file [$K3S_RESOLV_CONF]
   --flannel-iface value                      (agent/networking) Substituir interface de flanela padrão
   --flannel-conf value                       (agent/networking) Substituir arquivo de configuração flannel padrão
   --flannel-cni-conf value                   (agent/networking) Substituir arquivo de configuração cni flannel padrão
   --vpn-auth value                           (agent/networking) (experimental) Credenciais para o provedor VPN. Deve incluir o nome do provedor e a chave de junção no formato name=<vpn-provider>,joinKey=<key>[,controlServerURL=<url>][,extraArgs=<args>] [$K3S_VPN_AUTH]
   --vpn-auth-file value                      (agent/networking) (experimental) Arquivo contendo credenciais para o provedor VPN. Ele deve incluir o nome do provedor e a chave de junção no formato name=<vpn-provider>,joinKey=<key>[,controlServerURL=<url>][,extraArgs=<args>] [$K3S_VPN_AUTH_FILE]
   --kubelet-arg value                        (agent/flags) Bandeira personalizada para o processo kubelet
   --kube-proxy-arg value                     (agent/flags) Bandeira personalizada para o processo kube-proxy
   --protect-kernel-defaults                  (agent/node) Comportamento de ajuste do kernel. Se definido, erro se os ajustes do kernel forem diferentes dos padrões do kubelet.
   --secrets-encryption                       Habilitar criptografia secreta em repouso
   --enable-pprof                             (experimental) Habilitar ponto de extremidade pprof na porta do supervisor
   --rootless                                 (experimental) Modo rootless
   --prefer-bundled-bin                       (experimental) Prefira binários de espaço de usuário agrupados em vez de binários de host
   --selinux                                  (agent/node) Habilitar SELinux no containerd [$K3S_SELINUX]
   --lb-server-port value                     (agent/node) Porta local para o balanceador de carga do cliente supervisor. Se o supervisor e o apiserver não estiverem colocalizados, uma porta adicional 1 a menos que esta porta também será usada para o balanceador de carga do cliente apiserver. (padrão: 6444) [$K3S_LB_SERVER_PORT]
```