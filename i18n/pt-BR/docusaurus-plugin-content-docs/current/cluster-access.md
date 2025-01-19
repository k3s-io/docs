---
title: Acesso ao Cluster
---

O arquivo kubeconfig armazenado em `/etc/rancher/k3s/k3s.yaml` é usado para configurar o acesso ao cluster Kubernetes. Se você instalou ferramentas de linha de comando do Kubernetes upstream, como kubectl ou helm, precisará configurá-las com o caminho kubeconfig correto. Isso pode ser feito exportando a variável de ambiente `KUBECONFIG` ou invocando o sinalizador de linha de comando `--kubeconfig`. Consulte os exemplos abaixo para obter detalhes.

Utilize a variável de ambiente KUBECONFIG:

```bash
export KUBECONFIG=/etc/rancher/k3s/k3s.yaml
kubectl get pods --all-namespaces
helm ls --all-namespaces
```

Ou especifique a localização do arquivo kubeconfig no comando:

```bash
kubectl --kubeconfig /etc/rancher/k3s/k3s.yaml get pods --all-namespaces
helm --kubeconfig /etc/rancher/k3s/k3s.yaml ls --all-namespaces
```

### Acessando o Cluster de Fora com kubectl

Copie `/etc/rancher/k3s/k3s.yaml` na sua máquina localizada fora do cluster como `~/.kube/config`. Em seguida, substitua o valor do campo `server` pelo IP ou nome do seu servidor K3s. `kubectl` agora pode gerenciar seu cluster K3s.