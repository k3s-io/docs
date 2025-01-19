---
title: Criação de Perfil de Recursos
---

Esta seção captura os resultados dos testes para determinar os requisitos de recursos para K3s.


## Requisitos mínimos de recursos para K3s

Os resultados são resumidos da seguinte forma:

| Componentes                            | Processador               | Min CPU          | Mínimo de RAM com Kine/SQLite | Mínimo de RAM com etcd incorporado |
| -------------------------------------- | ------------------------- | ---------------- | ----------------------------- | ---------------------------------- |
| Servidor K3s com uma carga de trabalho | Intel 8375C CPU, 2.90 GHz | 6% de um núcleo  | 1596 M                        | 1606 M                             |
| Cluster K3s com um único agente        | Intel 8375C CPU, 2.90 GHz | 5% de um núcleo  | 1428 M                        | 1450 M                             |
| K3s agente                             | Intel 8375C CPU, 2.90 GHz | 3% de um núcleo  | 275 M                         | 275 M                              |
| Servidor K3s com uma carga de trabalho | Pi4B BCM2711, 1.50 GHz    | 30% de um núcleo | 1588 M                        | 1613 M                             |
| Cluster K3s com um único agente        | Pi4B BCM2711, 1.50 GHz    | 25% de um núcleo | 1215 M                        | 1413 M                             |
| K3s agente                             | Pi4B BCM2711, 1.50 GHz    | 10% de um núcleo | 268 M                         | 268 M                              |

### Escopo do teste de recursos

Os testes de recursos tinham como objetivo abordar as seguintes declarações de problemas:

- Em um cluster de nó único, determine a quantidade mínima legítima de CPU, memória e IOPs que devem ser reservadas para executar toda a pilha do servidor K3s, assumindo que uma carga de trabalho real será implantada no cluster.
- Em um nó de agente (trabalhador), determine a quantidade mínima legítima de CPU, memória e IOPs que devem ser reservadas para os componentes do plano de controle do Kubernetes e do K3s (o agente kubelet e k3s).

### Componentes Incluídos para Medições de Linha de Base

Os componentes testados são:

* K3s v1.26.5 com todos os componentes empacotados habilitados
* Pilha de monitoramento Prometheus + Grafana
* [Exemplo de implantação Nginx do Kubernetes](https://kubernetes.io/docs/tasks/run-application/run-stateless-application-deployment/)

Estes são números de base para um sistema estável usando apenas componentes empacotados do K3s (Traefik Ingress, Klipper lb, armazenamento de caminho local) executando uma pilha de monitoramento padrão (Prometheus e Grafana) e o aplicativo de exemplo Guestbook.

Os números de recursos, incluindo IOPS, são apenas para o datastore e plano de controle do Kubernetes e não incluem sobrecarga para agentes de gerenciamento de nível de sistema ou registro, gerenciamento de imagem de contêiner ou quaisquer requisitos específicos de carga de trabalho.

### Metodologia

Uma instância autônoma do Prometheus v2.43.0 foi usada para coletar estatísticas de CPU, memória e E/S de disco do host usando `prometheus-node-exporter` instalado via apt.

`systemd-cgtop` foi usado para verificar a utilização de CPU e memória no nível de cgroup do systemd. `system.slice/k3s.service` rastreia a utilização de recursos para K3s e containerd, enquanto pods individuais estão sob a hierarquia `kubepods`.

Dados adicionais detalhados de utilização de memória do K3s foram coletados de `kubectl top node` usando o servidor de métricas integrado para os processos de servidor e agente.

Os números de utilização foram baseados em leituras do 95º percentil da operação em estado estável em nós executando as cargas de trabalho descritas.

### Ambiente

| Arch    | OS                 | Sistema                | CPU                                            | RAM  | Disco        |
| ------- | ------------------ | ---------------------- | ---------------------------------------------- | ---- | ------------ |
| x86_64  | Ubuntu 22.04       | AWS c6id.xlarge        | Intel Xeon Platinum 8375C CPU, 4 Core 2.90 GHz | 8 GB | NVME SSD     |
| aarch64 | Raspberry Pi OS 11 | Raspberry Pi 4 Model B | BCM2711, 4 Core 1.50 GHz                       | 8 GB | UHS-III SDXC |


### Requisitos de Recursos de Linha de Base

Esta seção captura os resultados dos testes para determinar os requisitos mínimos de recursos para a operação básica do K3.

#### Servidor K3s com uma Carga de Trabalho

Estes são os requisitos para um cluster de nó único no qual o servidor K3s compartilha recursos com uma [carga de trabalho simples](https://kubernetes.io/docs/tasks/run-application/run-stateless-application-deployment/).

Os requisitos de CPU são:

| Sistema     | Uso do Núcleo da CPU |
| ----------- | -------------------- |
| Intel 8375C | 6% de um núcleo      |
| Pi4B        | 30% de um núcleo     |

Os Requisitos de Memória São:

| Armazenamento de Dados Testado | Sistema     | Memória |
| ------------------------------ | ----------- | ------- |
| Kine/SQLite                    | Intel 8375C | 1596 M  |
|                                | Pi4B        | 1588 M  |
| etcd Incorporado               | Intel 8375C | 1606 M  |
|                                | Pi4B        | 1613 M  |

Os requisitos do disco são:

| Armazenamento de Dados Testado | IOPS | KiB/sec | Latência |
| ------------------------------ | ---- | ------- | -------- |
| Kine/SQLite                    | 10   | 500     | < 10 ms  |
| etcd Incorporado               | 50   | 250     | < 5 ms   |

### Cluster K3s com um Único Agente

Esses são os requisitos básicos para um cluster K3s com um nó de servidor K3s e um agente K3s, mas sem carga de trabalho.

#### Servidor K3s
Os requisitos da CPU são:

| Sistema     | Uso do Núcleo da CPU |
| ----------- | -------------------- |
| Intel 8375C | 5% de um núcleo      |
| Pi4B        | 25% de um núcleo     |

Os requisitos de memória são:

| Tested Datastore | System      | Memory |
| ---------------- | ----------- | ------ |
| Kine/SQLite      | Intel 8375C | 1428 M |
|                  | Pi4B        | 1215 M |
| Embedded etcd    | Intel 8375C | 1450 M |
|                  | Pi4B        | 1413 M |

#### Agente K3s

Os requisitos são:

| System      | Uso do Núcleo da CPU | RAM   |
| ----------- | -------------------- | ----- |
| Intel 8375C | 3% de um núcleo      | 275 M |
| Pi4B        | 5% de um núcleo      | 268 M |




### Análise dos principais impulsionadores da utilização dos recursos

Os números de utilização do servidor K3s são impulsionados principalmente pelo suporte do repositório de dados do Kubernetes (kine ou etcd), API Server, Controller-Manager e loops de controle do Scheduler, bem como quaisquer tarefas de gerenciamento necessárias para efetuar alterações no estado do sistema. Operações que colocam carga adicional no plano de controle do Kubernetes, como criar/modificar/excluir recursos, causarão picos temporários na utilização. Usar operadores ou aplicativos que fazem uso extensivo do repositório de dados do Kubernetes (como Rancher ou outros aplicativos do tipo Operator) aumentará os requisitos de recursos do servidor. Aumentar a escala do cluster adicionando nós adicionais ou criando muitos recursos de cluster aumentará os requisitos de recursos do servidor.

Os números de utilização do agente K3s são impulsionados principalmente pelo suporte de loops de controle de gerenciamento do ciclo de vida do contêiner. Operações que envolvem gerenciamento de imagens, provisionamento de armazenamento ou criação/destruição de contêineres causarão picos temporários na utilização. Os pulls de imagem em particular são tipicamente altamente limitados pela CPU e IO, pois envolvem a descompactação do conteúdo da imagem para o disco. Se possível, o armazenamento de carga de trabalho (armazenamento efêmero de pod e volumes) deve ser isolado dos componentes do agente (/var/lib/rancher/k3s/agent) para garantir que não haja conflitos de recursos.

### Impedindo que agentes e cargas de trabalho interfiram no armazenamento de dados do cluster

Ao executar em um ambiente em que o servidor também hospeda pods de carga de trabalho, deve-se tomar cuidado para garantir que o agente e o IOPS de carga de trabalho não interfiram no armazenamento de dados.

Isso pode ser melhor realizado colocando os componentes do servidor (/var/lib/rancher/k3s/server) em um meio de armazenamento diferente dos componentes do agente (/var/lib/rancher/k3s/agent), que incluem o armazenamento de imagens do containerd.

O armazenamento de carga de trabalho (armazenamento efêmero de pod e volumes) também deve ser isolado do armazenamento de dados.

O não cumprimento dos requisitos de taxa de transferência e latência do armazenamento de dados pode resultar em resposta atrasada do plano de controle e/ou falha do plano de controle em manter o estado do sistema.


## Requisitos de Dimensionamento do Servidor para K3s

### Ambiente

- Todos os agentes eram instâncias t3.medium AWS ec2.
  - Um único agente era uma instância c5.4xlarge. Isso hospedava a pilha de monitoramento grafana e a impedia de interferir nos recursos do plano de controle.
- O servidor era uma instância c5 AWS ec2. Conforme o número de agentes aumentava, o servidor era atualizado para instâncias c5 maiores.

### Metodologia

Esses dados foram recuperados sob condições de teste específicas. Eles variam dependendo do ambiente e das cargas de trabalho. As etapas abaixo fornecem uma visão geral do teste que foi executado para recuperá-los. Ele foi executado pela última vez em v1.31.0+k3s1. Todas as máquinas foram provisionadas na AWS com volumes gp3 padrão de 20 GiB. O teste foi executado com as seguintes etapas:
1. Monitore os recursos no grafana usando a fonte de dados prometheus.
2. Implante as cargas de trabalho de forma a simular a atividade contínua do cluster:
   - Uma carga de trabalho básica que aumenta e diminui continuamente
   - Uma carga de trabalho que é excluída e recriada em um loop
   - Uma carga de trabalho constante que contém vários outros recursos, incluindo CRDs.
3. Junte os nós do agente em lotes de 50-100 por vez.
4. Pare de adicionar agentes quando a CPU do servidor atingir picos acima de 90% de utilização na junção do agente ou se a RAM estiver acima de 80% de utilização.

### Observações

- Ao ingressar em agentes, a CPU do servidor viu picos de ~20% acima da linha de base.
- Normalmente, o fator limitante era a CPU, não a RAM. Para a maioria dos testes, quando a CPU atingiu 90% de utilização, a utilização da RAM estava em torno de 60%.

#### Uma nota sobre Alta Disponibilidade (HA)
No final de cada teste, dois servidores adicionais foram unidos (formando um cluster HA básico de 3 nós) para observar qual efeito isso teve nos recursos originais do servidor. O efeito foi:
  - Uma queda perceptível na utilização da CPU, geralmente 30-50%.
  - A utilização da RAM permaneceu a mesma.

Embora não tenha sido testado, com a utilização da CPU como fator limitante em um único servidor, espera-se que o número de agentes que podem ser unidos aumente em ~50% com um cluster HA de 3 nós.
