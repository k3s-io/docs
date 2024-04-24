---
title: "볼륨과 저장소"
---

데이터를 유지해야 하는 애플리케이션을 배포할 때는 퍼시스턴트 스토리지를 만들어야 합니다. 퍼시스턴트 스토리지를 사용하면 애플리케이션을 실행하는 파드 외부에 애플리케이션 데이터를 저장할 수 있습니다. 이 스토리지 방식을 사용하면 애플리케이션의 파드에 장애가 발생하더라도 애플리케이션 데이터를 유지할 수 있습니다.

퍼시스턴트 볼륨(PV: persistent volume)은 쿠버네티스 클러스터의 스토리지 조각이며, 퍼시스턴트 볼륨 클레임(PVC: persistent volume claim)은 스토리지에 대한 요청입니다. PV와 PVC의 작동 방식에 대한 자세한 내용은 [스토리지](https://kubernetes.io/ko/docs/concepts/storage/volumes/) 공식 쿠버네티스 문서를 참조하세요.

이 페이지는 로컬 스토리지 제공자 또는 [롱혼(#setting-up-longhorn)]을 사용하여 퍼시스턴트 스토리지를 설정하는 방법을 설명합니다.

## K3s 스토리지의 차이점은 무엇인가요?

K3s는 몇 가지 선택적 볼륨 플러그인과 모든 내장("in-tree"라고도 함) 클라우드 제공업체를 제거합니다. 이는 더 작은 바이너리 크기를 달성하고 많은 K3s 사용 사례에서 사용할 수 없는 타사 클라우드 또는 데이터센터 기술 및 서비스에 대한 의존을 피하기 위한 것입니다. 이러한 플러그인을 제거해도 핵심 Kubernetes 기능이나 적합성에는 영향을 미치지 않기 때문에 이렇게 할 수 있습니다.

다음 볼륨 플러그인은 K3s에서 제거되었습니다:

- cephfs
- fc
- flocker
- git_repo
- glusterfs
- portworx
- quobyte
- rbd
- storageos

K3s와 함께 사용할 수 있는 트리 외 대안인 두 구성 요소가 있습니다:
쿠버네티스 [컨테이너 스토리지 인터페이스(CSI)](https://github.com/container-storage-interface/spec/blob/master/spec.md) 및 [클라우드 프로바이더 인터페이스(CPI)](https://kubernetes.io/docs/tasks/administer-cluster/running-cloud-controller/)입니다.

쿠버네티스 유지 관리자는 인-트리 볼륨 플러그인을 CSI 드라이버로 적극적으로 마이그레이션하고 있습니다. 이 마이그레이션에 대한 자세한 내용은 [여기](https://kubernetes.io/blog/2021/12/10/storage-in-tree-to-csi-migration-status-update/)를 참고하세요.

## 로컬 스토리지 공급자 설정하기

K3s는 랜처의 로컬 경로 프로비저너와 함께 제공되며, 이를 통해 각 노드의 로컬 스토리지를 사용하여 영구 볼륨 클레임(persistent volume claims)을 즉시 생성할 수 있습니다. 아래에서는 간단한 예제를 다루겠습니다. 자세한 내용은 공식 문서 [여기](https://github.com/rancher/local-path-provisioner/blob/master/README.md#usage)를 참조하세요.

호스트 경로 지원 퍼시스턴트 볼륨 클레임과 이를 활용할 파드를 생성합니다:

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

yaml을 적용합니다:

```bash
kubectl create -f pvc.yaml
kubectl create -f pod.yaml
```

PV 및 PVC가 생성되었는지 확인합니다:

```bash
kubectl get pv
kubectl get pvc
```

상태는 각각 `Bound`여야 합니다.

## Longhorn 구성하기

:::warning

Longhorn은 ARM32를 지원하지 않습니다.

:::

K3s는 쿠버네티스용 오픈소스 분산형 블록 스토리지 시스템인 [Longhorn](https://github.com/longhorn/longhorn)을 지원합니다.

아래는 간단한 예제입니다. 자세한 내용은 [공식 문서](https://longhorn.io/docs/latest/)를 참고하시기 바랍니다.

longhorn.yaml을 적용하여 Longhorn을 설치합니다:

```bash
kubectl apply -f https://raw.githubusercontent.com/longhorn/longhorn/v1.5.1/deploy/longhorn.yaml
```

Longhorn은 네임스페이스 `longhorn-system`에 설치됩니다.

yaml을 적용하여 PVC와 파드를 생성합니다:

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

PV 및 PVC가 생성되었는지 확인합니다:

```bash
kubectl get pv
kubectl get pvc
```

상태는 각각 `Bound`여야 합니다.
