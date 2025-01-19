---
title: Ferramentas CLI
---

O binário K3s contém uma série de ferramentas adicionais que ajudam você a gerenciar seu cluster.

| Comando               | Descrição                                                                                                                                                                                                                                                                                         |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `k3s server`          | Execute um nó de servidor K3s, que inicia os componentes `apiserver`, `scheduler`, `controller-manager` e `cloud-controller-manager` do Kubernetes, além de um datastore e os componentes do agente. Veja a [documentação do comando `k3s server`](server.md) para mais informações.              |
| `k3s agent`           | Execute o nó do agente K3s, que inicia o controlador de política de rede `containerd`, `flannel`, `kube-router` e os componentes `kubelet` e `kube-proxy` do Kubernetes. Veja a [documentação do comando `k3s agent`](agent.md) para obter mais informações.                                      |
| `k3s kubectl`         | Execute o comando incorporado [`kubectl`](https://kubernetes.io/docs/reference/kubectl). Esta é uma CLI para interagir com o apiserver do Kubernetes. Se a variável de ambiente `KUBECONFIG` não estiver definida, isso tentará usar automaticamente o kubeconfig em `/etc/rancher/k3s/k3s.yaml`. |
| `k3s crictl`          | Execute o comando incorporado [`crictl`](https://github.com/kubernetes-sigs/cri-tools/blob/master/docs/crictl.md). Esta é uma CLI para interagir com a interface de tempo de execução do contêiner (CRI) do Kubernetes. Útil para depuração.                                                      |
| `k3s ctr`             | Execute o comando incorporado [`ctr`](https://github.com/projectatomic/containerd/blob/master/docs/cli.md). Este é um CLI para containerd, o daemon de contêiner usado pelo K3s. Útil para depuração.                                                                                             |
| `k3s token`           | Gerenciar tokens bootstrap. Veja a [documentação do comando `k3s token`](token.md) para mais informações.                                                                                                                                                                                         |
| `k3s etcd-snapshot`   | Execute backups sob demanda dos dados do cluster K3s e carregue no S3. Veja a [documentação do comando `k3s etcd-snapshot`](etcd-snapshot.md) para mais informações.                                                                                                                              |
| `k3s secrets-encrypt` | Configure o K3s para criptografar segredos ao armazená-los no cluster. Veja a [documentação do comando `k3s secrets-encrypt`](secrets-encrypt.md) para mais informações.                                                                                                                          |
| `k3s certificate`     | Gerenciar certificados K3s. Veja a [documentação do comando `k3s certificate`](certificate.md) para mais informações.                                                                                                                                                                             |
| `k3s completion`      | Gerar scripts de conclusão de shell para k3s                                                                                                                                                                                                                                                      |
| `k3s help`            | Mostra uma lista de comandos ou ajuda para um comando                                                                                                                                                                                                                                             |