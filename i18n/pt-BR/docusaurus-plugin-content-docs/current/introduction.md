---
slug: /
title: "K3s - Kubernetes Leve"
---

Kubernetes Leve. Fácil de instalar, metade da memória, tudo em um binário de menos de 100MB.

Ideal para:

* Edge (Computação de borda)
* Homelab (Hospedagem doméstica)
* Internet das Coisas (IoT)
* Integração Contínua (CI)
* Desenvolvimento
* Computador em placa única (ARM)
* Ambientes isolados (air-gapped)
* Kubernetes embarcado (Embedded K8s)
* Situações em que um doutorado em "clusterologia" de K8s é inviável

# O que é K3s?

K3s é uma distribuição Kubernetes totalmente compatível, com os seguintes aprimoramentos:

 * Distribuído como um único binário ou imagem de contêiner mínima.
 * Datastore leve baseado em sqlite3 como backend de armazenamento padrão. etcd3, MySQL e Postgres também estão disponíveis.
 * Envolvido em um iniciador simples que gerencia grande parte da complexidade relacionada a TLS e opções.
 * Seguro por padrão, com configurações razoáveis para ambientes leves.
 * A operação de todos os componentes do plano de controle do Kubernetes é encapsulada em um único binário e processo, permitindo que o K3s automatize e gerencie operações complexas do cluster, como a distribuição de certificados.
 * As dependências externas foram minimizadas; os únicos requisitos são um kernel moderno e montagens de cgroups.
 * Inclui as dependências necessárias para facilitar a criação de clusters no estilo "baterias incluídas":
    * containerd / cri-dockerd (runtime de contêineres - CRI)
    * Flannel (interface de rede de contêineres - CNI)
    * CoreDNS (DNS do cluster)
    * Traefik (controlador de Ingress)
    * ServiceLB (controlador de balanceamento de carga)
    * Kube-router (controlador de políticas de rede)
    * Local-path-provisioner (controlador de volumes persistentes)
    * Spegel (espelho de registro de imagens de contêiner distribuído)
    * Utilitários de host (iptables, socat, etc.)

# Qual é o significado do nome?

Queríamos uma instalação do Kubernetes que fosse metade do tamanho em termos de consumo de memória. Kubernetes é uma palavra de 10 letras estilizada como K8s. Então, algo metade do tamanho do Kubernetes seria uma palavra de 5 letras estilizada como K3s. Não existe uma forma longa de K3s e nenhuma pronúncia oficial.