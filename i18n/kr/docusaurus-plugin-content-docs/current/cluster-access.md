---
title: 클러스터 접근
---

`/etc/rancher/k3s/k3s.yaml`에 저장된 kubeconfig 파일은 쿠버네티스 클러스터에 대한 액세스를 구성하는 데 사용됩니다. kubectl 또는 helm과 같은 업스트림 Kubernetes 명령줄 도구를 설치한 경우 올바른 kubeconfig 경로로 구성해야 합니다. 이 작업은 `kubeconfig` 환경 변수를 내보내거나 `--kubeconfig` 명령줄 플래그를 호출하여 수행할 수 있습니다. 자세한 내용은 아래 예시를 참고하세요.

KUBECONFIG 환경 변수를 활용합니다:

```bash
export KUBECONFIG=/etc/rancher/k3s/k3s.yaml
kubectl get pods --all-namespaces
helm ls --all-namespaces
```

또는 명령에 kubeconfig 파일의 위치를 지정합니다:

```bash
kubectl --kubeconfig /etc/rancher/k3s/k3s.yaml get pods --all-namespaces
helm --kubeconfig /etc/rancher/k3s/k3s.yaml ls --all-namespaces
```

### 외부에서 kubectl로 클러스터에 접근하기

`/etc/rancher/k3s/k3s.yaml`파일을 클러스터 외부에 위치한 머신의 `~/.kube/config`로 복사합니다. 그런 다음 `server` 필드의 값을 K3s 서버의 IP 또는 이름으로 바꿉니다. 이제 `kubectl`이 K3s 클러스터를 관리할 수 있습니다.
