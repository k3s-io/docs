---
title: 자주 묻는 질문
---

자주 묻는 질문은 주기적으로 업데이트되며, 사용자가 K3s에 대해 가장 자주 묻는 질문에 대한 답변으로 구성되어 있습니다.

### K3s가 Kubernetes를 대체하기에 적합한가요?

K3s는 CNCF 인증을 받은 Kubernetes 배포판으로, 표준 Kubernetes 클러스터에 필요한 모든 작업을 수행할 수 있습니다. 단지 더 가벼운 버전일 뿐입니다. 자세한 내용은 [main](./introduction.md) 문서 페이지를 참조하세요.

### Traefik 대신 자체 Ingress를 사용하려면 어떻게 해야 하나요?

`--disable=traefik`으로 K3s 서버를 시작하고 인그레스를 배포하기만 하면 됩니다.

### K3s는 Windows를 지원하나요?

현재 K3s는 기본적으로 Windows를 지원하지 않지만, 추후에 지원할 수 있습니다.

### 소스로부터 빌드하려면 어떻게 해야 하나요?

K3s [BUILDING.md](https://github.com/k3s-io/k3s/blob/master/BUILDING.md)에서 지침을 참조하시기 바랍니다.

### K3s 로그는 어디에 있나요?

K3s 로그의 위치는 K3s를 실행하는 방법과 노드의 OS에 따라 달라집니다.

- 명령줄에서 실행할 경우, 로그는 stdout과 stderr로 전송됩니다.
- openrc에서 실행하면 `/var/log/k3s.log`에 로그가 생성됩니다.
- Systemd에서 실행하는 경우, 로그는 저널널로 전송되며 `journalctl -u k3s`를 사용하여 볼 수 있습니다.
- 파드 로그는 `/var/log/pods`에서 확인할 수 있습니다.
- 컨테이너 로그는 `/var/lib/rancher/k3s/agent/containerd/containerd.log`에서 확인할 수 있습니다.

K3s를 시작할 때 `--debug` 플래그(또는 환경설정 파일에서 `debug: true`)를 사용하면 더 자세한 로그를 생성할 수 있습니다.

쿠버네티스는 프로세스 내의 모든 컴포넌트에 대해 단일 로깅 구성을 사용하는 `klog`라는 로깅 프레임워크를 사용합니다.
K3s는 단일 프로세스 내에서 모든 쿠버네티스 컴포넌트를 실행하기 때문에, 개별 쿠버네티스 컴포넌트에 대해 다른 로그 레벨이나 대상을 구성할 수 없습니다.
`-v=<level>`또는`--vmodule=<module>=<level>` 컴포넌트 인수를 사용하면 원하는 효과를 얻지 못할 수 있습니다.

더 많은 로그 옵션은 [추가 로깅 소스](./advanced.md#additional-logging-sources)를 참조하세요.

### Docker에서 K3s를 실행할 수 있나요?

예, Docker에서 K3s를 실행하는 방법은 여러 가지가 있습니다. 자세한 내용은 [고급 옵션](./advanced.md#running-k3s-in-docker)을 참조하세요.

### K3s 서버와 에이전트 토큰의 차이점은 무엇인가요?

K3s 조인 토큰 관리에 대한 자세한 내용은 [`k3s token` 명령어 설명서](./cli/token.md)를 참조하세요.

### K3s의 다른 버전들은 얼마나 호환되나요?

일반적으로 [쿠버네티스 버전 skew 정책](https://kubernetes.io/ko/releases/version-skew-policy/)이 적용됩니다.

즉, 서버가 에이전트보다 최신 버전일 수는 있지만 에이전트가 서버보다 최신 버전일 수는 없습니다.

### 문제가 발생했는데 어디서 도움을 받을 수 있나요?

K3s를 배포하는 데 문제가 있는 경우 다음과 같이 하세요:

1. [알려진 문제](./known-issues.md) 페이지를 확인하세요.

2. [추가 OS 준비사항](./advanced.md#추가-os-준비-사항)을 모두 해결했는지 확인합니다. `k3s check-config`를 실행하고 통과했는지 확인합니다.

3. K3s [이슈](https://github.com/k3s-io/k3s/issues) 및 [토론](https://github.com/k3s-io/k3s/discussions)에서 문제와 일치하는 항목을 검색합니다.

<!--lint disable no-dead-urls-->
4. [Rancher 슬랙](https://slack.rancher.io/) K3s 채널에 가입하여 도움을 받습니다.

5. K3s 깃허브에 설정과 발생한 문제를 설명하는 [새 이슈](https://github.com/k3s-io/k3s/issues/new/choose)를 제출합니다.
