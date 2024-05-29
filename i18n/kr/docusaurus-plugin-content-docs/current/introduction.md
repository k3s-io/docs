---
slug: /
title: "K3s - Lightweight Kubernetes"
---

경량의 쿠버네티스. 간편한 설치와 절반의 메모리, 모든걸 100MB 미만의 바이너리로 제공합니다.

적합한 환경:

- 엣지(Edge)
- 사물인터넷(IoT)
- 지속적인 통합(CI)
- 개발
- ARM
- 임베딩 K8s
- k8s 클러스터 분야의 박사 학위를 취득하기 어려운 상황

# k3s란 무엇입니까?

K3s는 쿠버네티스와 완전히 호환되며 다음과 같은 향상된 기능을 갖춘 배포판입니다:

- 단일 바이너리로 패키지화.
- 기본 스토리지 메커니즘으로 sqlite3를 기반으로 하는 경량 스토리지 백엔드. etcd3, MySQL, Postgres도 사용 가능.
- 복잡한 TLS 및 옵션을 처리하는 간단한 런처에 포함.
- 경량 환경을 위한 합리적인 기본값으로 기본적으로 보안을 유지함.
- 다음과 같이 간단하지만 강력한 'batteries-included' 기능 추가. 예를 들어:
  - local storage provider
  - service load balancer
  - Helm controller
  - Traefik ingress controller
- 모든 쿠버네티스 컨트롤 플레인 구성 요소의 작동은 단일 바이너리 및 프로세스로 캡슐화. 이를 통해 K3s는 인증서 배포와 같은 복잡한 클러스터 작업을 자동화하고 관리.
- 외부 종속성 최소화(최신 커널과 cgroup 마운트만 필요)

K3s는 다음과 같은 필수 종속성을 패키지로 제공합니다:

- Containerd
- Flannel (CNI)
- CoreDNS
- Traefik (인그레스)
- Klipper-lb (서비스 로드밸런서)
- 임베디드 네트워크 정책 컨트롤러
- 임베디드 로컬 경로 프로비저너
- 호스트 유틸리티(iptables, socat 등)

# 이름에는 무슨 뜻이 있나요?

우리는 메모리 풋프린트 측면에서 절반 크기의 Kubernetes를 설치하기를 원했습니다. Kubernetes는 K8s로 표기되는 10글자 단어입니다. 따라서 쿠버네티스의 절반 크기라면 K3s로 표기된 5글자 단어가 될 것입니다. K3s의 긴 형태는 없으며 공식적인 발음도 없습니다.
