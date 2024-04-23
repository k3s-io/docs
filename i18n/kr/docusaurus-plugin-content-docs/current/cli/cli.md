---
title: 명령줄 도구
---

K3s 바이너리에는 클러스터 관리에 도움이 되는 여러 가지 추가 도구가 포함되어 있습니다.

| Command               | Description                                                                                                                                                                                                                                                                     |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `k3s server`          | 데이터스토어와 에이전트 컴포넌트 외에 쿠버네티스 `apiserver`, `scheduler`, `controller-manager`, 그리고 `cloud-controller-manager` 컴포넌트를 실행하는 K3s 서버 노드를 실행합니다. 자세한 내용은 [`k3s server` 명령어 설명서](server.md)를 참고하세요.                          |
| `k3s agent`           | `containerd`, `flannel`, `kube-router` 네트워크 정책 컨트롤러와 쿠버네티스 `kubelet` 및 `kube-proxy` 구성 요소를 실행하는 K3s 에이전트 노드를 실행한다. 자세한 내용은 [`k3s agent` 명령어 설명서](agent.md)를 참조하세요.                                                       |
| `k3s kubectl`         | 임베드된 [`kubectl` 명령](https://kubernetes.io/ko/docs/reference/kubectl)을 실행합니다. 이것은 쿠버네티스 apiserver와 상호작용하기 위한 CLI입니다. `KUBECONFIG` 환경 변수가 설정되어 있지 않으면, 자동으로 `/etc/rancher/k3s/k3s.yaml`에서 kubeconfig를 사용하려고 시도합니다. |
| `k3s crictl`          | 임베드된 [`crictl` 명령](https://github.com/kubernetes-sigs/cri-tools/blob/master/docs/crictl.md)을 실행합니다. 이것은 쿠버네티스의 컨테이너 런타임 인터페이스(CRI: Container Runtime Interface)와 상호 작용하기 위한 CLI입니다. 디버깅에 유용합니다.                           |
| `k3s ctr`             | 내장된 [`ctr` 명령](https://github.com/projectatomic/containerd/blob/master/docs/cli.md)을 실행합니다. 이는 K3s에서 사용하는 컨테이너 데몬인 containerd의 CLI입니다. 디버깅에 유용합니다.                                                                                       |
| `k3s token`           | 부트스트랩 토큰을 관리합니다. 자세한 내용은 [`k3s token` 명령어 설명서](token.md)를 참조하세요.                                                                                                                                                                                 |
| `k3s etcd-snapshot`   | K3s 클러스터 데이터의 온디맨드 백업을 수행하여 S3에 업로드합니다. 자세한 내용은 [`k3s etcd-snapshot` 명령어 설명서](etcd-snapshot.md)를 참조하세요.                                                                                                                             |
| `k3s secrets-encrypt` | 클러스터에 시크릿을 저장할 때 암호화하도록 K3s를 구성합니다. 자세한 내용은 [`k3s secrets-encrypt` 명령어 설명서](secrets-encrypt.md)를 참조하세요.                                                                                                                              |
| `k3s certificate`     | K3s 인증서를 관리합니다. 자세한 내용은 [`k3s certificate` 명령어 설명서](certificate.md)를 참조하세요.                                                                                                                                                                          |
| `k3s completion`      | k3s용 셸 자동완성 스크립트를 생성합니다.                                                                                                                                                                                                                                        |
| `k3s help`            | 명령 목록 또는 한 명령어에 대한 도움말을 표시합니다.                                                                                                                                                                                                                            |
