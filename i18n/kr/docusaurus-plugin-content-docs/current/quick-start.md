---
title: "빠른 시작 가이드"
---

이 가이드는 기본 옵션으로 클러스터를 빠르게 시작하는 데 도움이 됩니다. [설치 섹션](./installation/installation.md)에서는 K3s를 설정하는 방법에 대해 자세히 설명합니다.

K3s 구성 요소들이 작동하는 방식에 대한 자세한 내용은 [아키텍처 섹션](./architecture.md)을 참조하세요.

:::info
Kubernetes를 처음 사용하시나요?
공식 쿠버네티스 문서에는 이미 기본 사항을 설명하는 훌륭한 튜토리얼이 [여기](https://kubernetes.io/ko/docs/tutorials/kubernetes-basics/) 있습니다.
:::

## 설치 스크립트

K3s는 systemd 또는 openrc 기반 시스템에 서비스로 설치하는 편리한 방법으로 설치 스크립트를 제공합니다. 이 스크립트는 https://get.k3s.io 에서 확인할 수 있습니다. 이 방법으로 K3s를 설치하려면, 간단하게 다음을 실행하세요:

```bash
curl -sfL https://get.k3s.io | sh -
```

이 설치를 실행한 후:

- 노드가 재부팅되거나 프로세스가 충돌 또는 종료된 경우 자동으로 재시작되도록 K3s 서비스가 구성됩니다.
- `kubectl`, `crictl`, `ctr`, `k3s-killall.sh` 및 `k3s-uninstall.sh`를 포함한 추가 유틸리티가 설치됩니다.
- `/etc/rancher/k3s/k3s.yaml`에 [kubeconfig](https://kubernetes.io/ko/docs/concepts/configuration/organize-cluster-access-kubeconfig/) 파일을 작성하고, K3s가 설치한 kubectl이 자동으로 이를 사용하게 됩니다.

단일 노드 서버 설치는 워크로드 파드를 호스팅하는 데 필요한 모든 데이터스토어, 컨트롤 플레인, kubelet 및 컨테이너 런타임 구성 요소를 포함하여 모든 기능을 갖춘 Kubernetes 클러스터입니다. 서버 또는 에이전트 노드를 추가할 필요는 없지만, 클러스터에 추가 용량 또는 중복성을 추가하기 위해 추가하는 것이 좋습니다.

에이전트 노드를 추가로 설치하여 클러스터에 추가하려면, `K3S_URL` 및 `K3S_TOKEN` 환경 변수를 사용하여 설치 스크립트를 실행합니다. 다음은 에이전트 가입 방법을 보여주는 예제입니다:

```bash
curl -sfL https://get.k3s.io | K3S_URL=https://myserver:6443 K3S_TOKEN=mynodetoken sh -
```

`K3S_URL` 파라미터를 설정하면 인스톨러가 K3s를 서버가 아닌 에이전트로 구성합니다. K3s 에이전트는 제공된 URL에서 수신 대기 중인 K3s 서버에 등록됩니다. `K3S_TOKEN`에 사용할 값은 서버 노드의 `/var/lib/rancher/k3s/server/node-token`에 저장됩니다.

:::note
각 머신은 고유한 호스트 이름을 가져야 합니다. 머신에 고유 호스트명이 없는 경우, `K3S_NODE_NAME` 환경 변수를 전달하고 각 노드에 대해 유효한 고유 호스트명이 있는 값을 제공하세요.
:::
