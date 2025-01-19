---
title: "Volumes e Armazenamento"
---

Ao implantar um aplicativo que precisa reter dados, você precisará criar um armazenamento persistente. O armazenamento persistente permite que você armazene dados do aplicativo externamente ao pod que está executando seu aplicativo. Essa prática de armazenamento permite que você mantenha os dados do aplicativo, mesmo se o pod do aplicativo falhar.

Um volume persistente (PV) é uma parte do armazenamento no cluster do Kubernetes, enquanto uma reivindicação de volume persistente (PVC) é uma solicitação de armazenamento. Para obter detalhes sobre como os PVs e PVCs funcionam, consulte a documentação oficial do Kubernetes sobre [armazenamento.](https://kubernetes.io/docs/concepts/storage/volumes/)

Esta página descreve como configurar o armazenamento persistente com um provedor de armazenamento local ou com [Longhorn.](#setting-up-longhorn)

## O que há de diferente no armazenamento do K3s?

O K3s remove vários plugins de volume opcionais e todos os provedores de nuvem integrados (às vezes chamados de "in-tree"). Fazemos isso para atingir um tamanho binário menor e evitar a dependência de tecnologias e serviços de nuvem ou data center de terceiros, que podem não estar disponíveis em muitos casos de uso do K3s. Podemos fazer isso porque sua remoção não afeta nem a funcionalidade principal do Kubernetes nem a conformidade.

Os seguintes plugins de volume foram removidos do K3s:

* cephfs
* fc
* flocker
* git_repo
* glusterfs
* portworx
* quobyte
* rbd
* storageos

Ambos os componentes têm alternativas fora da árvore que podem ser usadas com K3s: o Kubernetes [Container Storage Interface (CSI)](https://github.com/container-storage-interface/spec/blob/master/spec.md) e [Cloud Provider Interface (CPI)](https://kubernetes.io/docs/tasks/administer-cluster/running-cloud-controller/).

Os mantenedores do Kubernetes estão migrando ativamente plugins de volume in-tree para drivers CSI. Para mais informações sobre essa migração, consulte [aqui](https://kubernetes.io/blog/2021/12/10/storage-in-tree-to-csi-migration-status-update/).

## Configurando o Provedor de Armazenamento Local
O K3s vem com o Local Path Provisioner do Rancher e isso permite a capacidade de criar reivindicações de volume persistentes imediatamente usando armazenamento local no respectivo nó. Abaixo, cobrimos um exemplo simples. Para obter mais informações, consulte a documentação oficial [aqui](https://github.com/rancher/local-path-provisioner/blob/master/README.md#usage).

Crie uma reivindicação de volume persistente com suporte do hostPath e um pod para utilizá-la:

### pvc.yaml

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: local-path-pvc
  namespace: default
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: local-path
  resources:
    requests:
      storage: 2Gi
```

### pod.yaml

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: volume-test
  namespace: default
spec:
  containers:
  - name: volume-test
    image: nginx:stable-alpine
    imagePullPolicy: IfNotPresent
    volumeMounts:
    - name: volv
      mountPath: /data
    ports:
    - containerPort: 80
  volumes:
  - name: volv
    persistentVolumeClaim:
      claimName: local-path-pvc
```

Aplique o yaml:

```bash
kubectl create -f pvc.yaml
kubectl create -f pod.yaml
```

Confirme se o PV e o PVC foram criados:

```bash
kubectl get pv
kubectl get pvc
```

O status deve ser Bound para cada um.

## Configurando o Longhorn

:::warning

O Longhorn não suporta ARM32.

:::


O K3s oferece suporte ao [Longhorn](https://github.com/longhorn/longhorn), um sistema de armazenamento em bloco distribuído de código aberto para Kubernetes.

Abaixo cobrimos um exemplo simples. Para mais informações, consulte a [documentação oficial](https://longhorn.io/docs/latest/).

Aplique o longhorn.yaml para instalar o Longhorn:

```bash
kubectl apply -f https://raw.githubusercontent.com/longhorn/longhorn/v1.6.0/deploy/longhorn.yaml
```

O Longhorn será instalado no namespace `longhorn-system`.

Crie uma reivindicação de volume persistente e um pod para utilizá-lo:

### pvc.yaml

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: longhorn-volv-pvc
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: longhorn
  resources:
    requests:
      storage: 2Gi
```

### pod.yaml

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: volume-test
  namespace: default
spec:
  containers:
  - name: volume-test
    image: nginx:stable-alpine
    imagePullPolicy: IfNotPresent
    volumeMounts:
    - name: volv
      mountPath: /data
    ports:
    - containerPort: 80
  volumes:
  - name: volv
    persistentVolumeClaim:
      claimName: longhorn-volv-pvc
```

Aplique o yaml para criar o PVC e o pod:

```bash
kubectl create -f pvc.yaml
kubectl create -f pod.yaml
```

Confirme se o PV e o PVC foram criados:

```bash
kubectl get pv
kubectl get pvc
```

O status deve ser Bound para cada um.
