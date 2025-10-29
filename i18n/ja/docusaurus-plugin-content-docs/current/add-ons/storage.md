---
title: "ボリュームとストレージ"
---

データを保持する必要があるアプリケーションをデプロイする際には、永続ストレージを作成する必要があります。永続ストレージを使用すると、アプリケーションのデータをアプリケーションを実行しているポッドの外部に保存できます。このストレージの方法により、アプリケーションのポッドが失敗してもアプリケーションデータを保持できます。

永続ボリューム（PV）はKubernetesクラスター内のストレージの一部であり、永続ボリュームクレーム（PVC）はストレージの要求です。PVとPVCの動作の詳細については、公式Kubernetesドキュメントの[ストレージ](https://kubernetes.io/docs/concepts/storage/volumes/)を参照してください。

このページでは、ローカルストレージプロバイダーまたは[Longhorn](#setting-up-longhorn)を使用して永続ストレージを設定する方法について説明します。

## K3sストレージの違いは何ですか？

K3sは、いくつかのオプションのボリュームプラグインとすべての組み込み（「インツリー」とも呼ばれる）クラウドプロバイダーを削除します。これにより、バイナリサイズを小さくし、多くのK3sの使用ケースで利用できない可能性のあるサードパーティのクラウドやデータセンター技術およびサービスへの依存を避けることができます。これらの削除は、Kubernetesのコア機能や適合性に影響を与えないため可能です。

以下のボリュームプラグインはK3sから削除されました：

* cephfs
* fc
* flocker
* git_repo
* glusterfs
* portworx
* quobyte
* rbd
* storageos

両方のコンポーネントには、K3sで使用できるアウトオブツリーの代替手段があります：Kubernetesの[コンテナストレージインターフェース（CSI）](https://github.com/container-storage-interface/spec/blob/master/spec.md)および[クラウドプロバイダーインターフェース（CPI）](https://kubernetes.io/docs/tasks/administer-cluster/running-cloud-controller/)です。

Kubernetesのメンテナは、インツリーボリュームプラグインをCSIドライバーに積極的に移行しています。この移行に関する詳細については、[こちら](https://kubernetes.io/blog/2021/12/10/storage-in-tree-to-csi-migration-status-update/)を参照してください。

## ローカルストレージプロバイダーの設定
K3sにはRancherのLocal Path Provisionerが付属しており、これにより、対応するノード上のローカルストレージを使用して永続ボリュームクレームをすぐに作成する機能が有効になります。以下に簡単な例を示します。詳細については、公式ドキュメントを[こちら](https://github.com/rancher/local-path-provisioner/blob/master/README.md#usage)で参照してください。

hostPathをバックにした永続ボリュームクレームとそれを利用するポッドを作成します：

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

yamlを適用します：

```bash
kubectl create -f pvc.yaml
kubectl create -f pod.yaml
```

PVとPVCが作成されたことを確認します：

```bash
kubectl get pv
kubectl get pvc
```

ステータスはそれぞれBoundである必要があります。

## Longhornの設定

:::warning

LonghornはARM32をサポートしていません。

::: 

K3sは、Kubernetes用のオープンソースの分散ブロックストレージシステムである[Longhorn](https://github.com/longhorn/longhorn)をサポートしています。

以下に簡単な例を示します。詳細については、[公式ドキュメント](https://longhorn.io/docs/latest/)を参照してください。

longhorn.yamlを適用してLonghornをインストールします：

```bash
kubectl apply -f https://raw.githubusercontent.com/longhorn/longhorn/v1.6.0/deploy/longhorn.yaml
```

Longhornは`longhorn-system`という名前空間にインストールされます。

PVCとポッドを作成するためにyamlを適用します：

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

PVとPVCが作成されたことを確認します：

```bash
kubectl get pv
kubectl get pvc
```

ステータスはそれぞれBoundである必要があります。