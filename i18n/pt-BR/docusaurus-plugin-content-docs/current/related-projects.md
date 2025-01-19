---
title: "Projetos Relacionados"
---

Projetos que implementam a distribuição K3s são adições bem-vindas para ajudar a expandir a comunidade. Esta página apresentará a você uma gama de projetos relacionados ao K3s e pode ajudá-lo a explorar ainda mais suas capacidades e potenciais aplicações.

Esses projetos demonstram a versatilidade e a adaptabilidade dos K3s em vários ambientes, bem como extensões dos K3s. Todos eles são úteis na criação de clusters Kubernetes de Alta Disponibilidade (HA) em larga escala.

## k3s-ansible

Para usuários que buscam inicializar um cluster K3s multi-node e estão familiarizados com o ansible, dê uma olhada no repositório [k3s-io/k3s-ansible](https://github.com/k3s-io/k3s-ansible). Este conjunto de playbooks do ansible fornece uma maneira conveniente de instalar o K3s em seus nós, permitindo que você se concentre na configuração do seu cluster em vez do processo de instalação.

## k3sup

Outro projeto que simplifica o processo de configuração de um cluster K3s é o [k3sup](https://github.com/alexellis/k3sup). Este projeto, escrito em golang, requer apenas acesso ssh aos seus nós. Ele também fornece uma maneira conveniente de implantar o K3s com datastores externos, não apenas o etcd incorporado.

## autok3s

Outra ferramenta de provisionamento, [autok3s](https://github.com/cnrancher/autok3s), fornece uma GUI para provisionar cluster k3s em uma variedade de provedores de nuvem, VMs e máquinas locais. Esta ferramenta é útil para usuários que preferem uma interface gráfica para provisionar clusters K3s.