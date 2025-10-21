---
title: "卷和存储"
---

在部署需要保​​留数据的应用时，你需要创建持久存储。持久存储允许你在运行应用的 pod 之外存储应用数据。即使运行应用的 pod 发生故障，这种存储方式也能让你保留应用数据。

持久卷 (PV) 是 Kubernetes 集群中的一块存储，而持久卷声明 (PVC) 是对存储的请求。有关 PV 和 PVC 工作原理的详细信息，请参阅 [Kubernetes 存储相关的官方文档](https://kubernetes.io/docs/concepts/storage/volumes/)。

本文介绍如何使用本地存储提供程序或 [Longhorn](#设置-longhorn) 设置持久存储。

## K3s 存储有什么不同？

K3s 删除了几个可选的卷插件和所有内置的（有时称为“in-tree”）云提供商。我们这样做是为了让二进制文件更小，并避免对第三方云或数据中心技术和服务的依赖，因为这些依赖在许多 K3s 用例中可能不可用。我们之所以能够这样做，是因为它们的移除既不会影响核心 Kubernetes 功能，也不会影响一致性。

以下卷插件已从 K3s 中删除：

* cephfs
* fc
* flocker
* git_repo
* glusterfs
* portworx
* quobyte
* rbd
* storageos

这两个组件都有可以与 K3s 一起使用的树外替代方案：Kubernetes [Container Storage Interface (CSI)](https://github.com/container-storage-interface/spec/blob/master/spec.md) 和 [Cloud Provider Interface (CPI)](https://kubernetes.io/docs/tasks/administer-cluster/running-cloud-controller/)。

Kubernetes 维护人员正在积极地将树内卷插件迁移到 CSI 驱动程序。有关此迁移的更多信息，请参阅[此处](https://kubernetes.io/blog/2021/12/10/storage-in-tree-to-csi-migration-status-update/)。

## 设置本地存储提供程序
K3s 自带 Rancher 的 Local Path Provisioner，这使得能够使用各自节点上的本地存储来开箱即用地创建持久卷声明。下面是一个简单的例子。有关更多信息，请参阅[官方文档](https://github.com/rancher/local-path-provisioner/blob/master/README.md#usage)。

创建一个 hostPath 支持的持久卷声明和一个使用它的 Pod：

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

应用 yaml：

```bash
kubectl create -f pvc.yaml
kubectl create -f pod.yaml
```

确认创建了 PV 和 PVC：

```bash
kubectl get pv
kubectl get pvc
```

状态都应该是 Bound。

## 设置 Longhorn

:::warning

Longhorn 不支持 ARM32。

:::


K3s 支持 [Longhorn](https://github.com/longhorn/longhorn)，这是用于 Kubernetes 的开源分布式块存储系统。

下面是一个简单的例子。有关详细信息，请参阅[官方文档](https://longhorn.io/docs/latest/)。

应用 longhorn.yaml 来安装 Longhorn：

```bash
kubectl apply -f https://raw.githubusercontent.com/longhorn/longhorn/v1.5.1/deploy/longhorn.yaml
```

Longhorn 将安装在命名空间 `longhorn-system` 中。

应用 yaml 来创建 PVC 和 Pod：

```bash
kubectl create -f pvc.yaml
kubectl create -f pod.yaml
```

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

确认创建了 PV 和 PVC：

```bash
kubectl get pv
kubectl get pvc
```

状态都应该是 Bound。
