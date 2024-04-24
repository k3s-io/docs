---
title: "네트워킹"
---

이 페이지는 CoreDNS, Traefik 인그레스 컨트롤러, Klipper 서비스 로드밸런서가 K3s 내에서 작동하는 방식을 설명합니다.

Flannel 구성 옵션 및 백엔드 선택에 대한 자세한 내용이나 자체 CNI 설정 방법은 [설치 네트워크 옵션](./networking/basic-network-options.md) 페이지를 참조하세요.

K3s를 위해 어떤 포트를 열어야 하는지에 대한 정보는 [네트워킹 요구 사항](./installation/requirements.md#networking)을 참조하세요.

## CoreDNS

CoreDNS는 서버 시작 시 자동으로 배포됩니다. 사용하지 않으려면 클러스터의 모든 서버에 `--disable=coredns` 옵션을 사용하여 구성합니다.

CoreDNS를 설치하지 않은 경우 클러스터 DNS 공급자를 직접 설치해야 합니다.

## Traefik 인그레스 컨트롤러

[Traefik](https://traefik.io/)은 마이크로서비스를 쉽게 배포할 수 있도록 만들어진 최신 HTTP 역방향 프록시 및 로드밸런서입니다. 애플리케이션을 설계, 배포 및 실행하는 동안 네트워킹 복잡성을 단순화합니다.

Traefik 인그레스 컨트롤러는 포트 80과 443을 사용하는 로드밸런서 서비스를 배포합니다. 기본적으로 ServiceLB는 모든 클러스터 멤버에 이러한 포트를 노출하므로 다른 HostPort 또는 NodePort 파드에서는 이러한 포트를 사용할 수 없습니다.

서버를 시작할 때 기본적으로 Traefik이 배포됩니다. 자세한 내용은 [패키지 컴포넌트 관리](./installation/packaged-components.md)를 참고하세요. 기본 설정 파일은 `/var/lib/rancher/k3s/server/manifests/traefik.yaml`에 있습니다.

K3s가 시작할 때 이 파일을 기본값으로 대체하므로 `traefik.yaml` 파일을 수동으로 편집해서는 안 됩니다. 대신, `/var/lib/rancher/k3s/server/manifests`에 `HelmChartConfig` 매니페스트를 추가로 생성하여 Traefik을 사용자 정의해야 합니다. 자세한 내용과 예제는 [HelmChartConfig 패키지 컴포넌트 커스터마이징](./helm.md#customizing-packaged-components-with-helmchartconfig)을 참고하세요. 사용 가능한 구성 값에 대한 자세한 내용은 공식 [Traefik 헬름 구성 매개변수](https://github.com/traefik/traefik-helm-chart/tree/master/traefik)를 참고하세요.

클러스터에서 Traefik을 제거하려면 `--disable=traefik` 플래그를 사용하여 모든 서버를 시작합니다.

K3s 버전 1.20 이하에는 Traefik v1이 포함됩니다. K3s 버전 1.21 이상은 기존에 설치된 Traefik v1이 발견되지 않는 한 Traefik v2를 설치하며, 이 경우 Traefik은 v2로 업그레이드되지 않습니다. K3s에 포함된 특정 Traefik 버전에 대한 자세한 내용은 해당 버전의 릴리스 노트를 참조하세요.

이전 Traefik v1 인스턴스에서 마이그레이션하려면 [Traefik 문서](https://doc.traefik.io/traefik/migration/v1-to-v2/) 및 [마이그레이션 도구](https://github.com/traefik/traefik-migration-tool)를 참조하세요.

## 네트워크 정책 컨트롤러 (Network Policy Controller)

K3s에는 임베디드 네트워크 정책 컨트롤러가 포함되어 있습니다. 기본 구현은 [kube-router의](https://github.com/cloudnativelabs/kube-router) netpol 컨트롤러 라이브러리이며(다른 kube-router 기능은 없음), [여기](https://github.com/k3s-io/k3s/tree/master/pkg/agent/netpol)에서 확인할 수 있습니다.

비활성화하려면, 각 서버를 `--disable-network-policy` 플래그로 시작합니다.

## 서비스 로드밸런서

K3s 클러스터에는 모든 LoadBalancer 컨트롤러를 배포할 수 있습니다. 기본적으로 K3s는 사용 가능한 호스트 포트를 사용하는 [ServiceLB](https://github.com/k3s-io/klipper-lb)(이전의 Klipper LoadBalancer)로 알려진 로드밸런서를 제공합니다.

업스트림 쿠버네티스는 로드밸런서 유형의 서비스를 생성할 수 있지만 기본 로드밸런서 구현은 포함되어 있지 않으므로 이러한 서비스는 로드밸런서가 설치될 때까지 `pending`으로 유지됩니다. 많은 호스팅 서비스는 외부 로드 밸런서 구현을 제공하기 위해 Amazon EC2 또는 Microsoft Azure와 같은 클라우드 제공업체가 필요합니다. 반면, K3s ServiceLB를 사용하면 클라우드 제공업체나 추가 구성 없이도 로드밸런서 서비스를 사용할 수 있습니다.

### ServiceLB 작동 방식

ServiceLB 컨트롤러는 `spec.type` 필드가 `LoadBalancer`로 설정된 쿠버네티스 [서비스](https://kubernetes.io/ko/docs/concepts/services-networking/service/)를 감시합니다.

각 로드밸런서 서비스마다 `kube-system` 네임스페이스에 [데몬셋](https://kubernetes.io/ko/docs/concepts/workloads/controllers/daemonset/)이 생성된다. 이 데몬셋은 차례로 각 노드에 `svc-` 접두사를 가진 파드를 생성합니다. 이러한 파드는 아이피테이블을 사용하여 파드의 노드포트에서 서비스의 클러스터IP 주소와 포트로 트래픽을 전달합니다.

외부 IP가 구성된 노드에서 ServiceLB 파드가 실행되는 경우, 노드의 외부 IP가 서비스의 `status.loadBalancer.ingress` 주소 목록에 채워집니다. 그렇지 않으면 노드의 내부 IP가 사용됩니다.

로드밸런서 서비스가 여러 개 생성된 경우, 각 서비스마다 별도의 데몬셋이 생성됩니다.

서로 다른 포트를 사용한다면 동일한 노드에 여러 개의 서비스를 노출할 수 있습니다.

포트 80에서 수신 대기하는 로드밸런서 서비스를 생성하려고 하면 ServiceLB는 클러스터에서 포트 80에 대한 사용 가능한 호스트를 찾으려고 시도합니다. 해당 포트를 사용할 수 있는 호스트가 없는 경우, LB는 보류 상태로 유지됩니다.

### 사용법

K3s에 [LoadBalancer 타입의 서비스](https://kubernetes.io/ko/docs/concepts/services-networking/service/#loadbalancer)를 생성합니다.

### ServiceLB 노드 선택 제어하기

하나 이상의 노드에 `svccontroller.k3s.cattle.io/enablelb=true` 레이블을 추가하면 ServiceLB 컨트롤러가 허용 목록 모드로 전환되며, 해당 레이블이 있는 노드만 LoadBalancer 파드를 호스트할 수 있습니다. 레이블이 없는 노드는 ServiceLB에서 사용에서 제외됩니다.

:::note
기본적으로 노드에는 레이블이 지정되지 않습니다. 모든 노드가 레이블이 지정되지 않은 상태로 유지되는 한, 사용 가능한 포트가 있는 모든 노드가 ServiceLB에서 사용됩니다.
:::

### ServiceLB 노드 풀 생성하기

로드밸런서의 파드를 호스팅할 특정 노드 하위 집합을 선택하려면 원하는 노드에 `enablelb` 레이블을 추가하고 노드 및 서비스에서 일치하는 `lbpool` 레이블 값을 설정합니다. 예를 들면 다음과 같습니다:

1. 노드 A와 노드 B에 `svccontroller.k3s.cattle.io/lbpool=pool1` 및 `svccontroller.k3s.cattle.io/enablelb=true` 레이블을 지정합니다.
2. 노드 C와 노드 D에 `svccontroller.k3s.cattle.io/lbpool=pool2` 및 `svccontroller.k3s.cattle.io/enablelb=true`로 레이블을 지정합니다.
3. 포트 443에 `svccontroller.k3s.cattle.io/lbpool=pool1` 레이블을 가진 하나의 LoadBalancer 서비스를 생성합니다. 이 서비스에 대한 데몬셋은 노드 A와 노드 B에만 파드를 배포합니다.
4. 포트 443에 `svccontroller.k3s.cattle.io/lbpool=pool2` 레이블을 가진 다른 로드밸런서 서비스를 생성합니다. 데몬셋은 노드 C와 노드 D에만 파드를 배포합니다.

### ServiceLB 비활성화

ServiceLB를 비활성화하려면, 클러스터의 모든 서버에 `--disable=servicelb` 플래그를 사용하여 구성한다.

이 설정은 MetalLB와 같은 다른 LB를 실행하려는 경우에 필요합니다.

## 외부 클라우드 컨트롤러 매니저 배포하기

바이너리 크기를 줄이기 위해 K3s는 모든 "인-트리"(빌트인) 클라우드 제공자를 제거합니다. 대신, K3s는 다음을 수행하는 임베디드 클라우드 컨트롤러 관리자(CCM, Cloud Controller Manager) 스텁을 제공합니다:

- 노드 내부IP 및 외부IP 주소 필드를 `--node-ip` 및 `--node-external-ip` 플래그를 기반으로 설정합니다.
- ServiceLB LoadBalancer 컨트롤러를 호스팅합니다.
- 클라우드-프로바이더가 `external`로 설정된 경우 존재하는 `node.cloudprovider.kubernetes.io/uninitialized` taint를 제거합니다.

외부 CCM을 배포하기 전에 모든 K3s 서버를 `--disable-cloud-controller` 플래그로 시작하여 임베디드 CCM을 비활성화해야 합니다.

:::note
기본 제공 CCM을 비활성화하고 외부 대체품을 배포하고 올바르게 구성하지 않으면 노드가 오염된 상태로 유지되어 스케줄링이 불가능합니다.
:::

## 호스트 이름이 없는 노드

Linode와 같은 일부 클라우드 제공자는 호스트 이름이 "localhost"인 머신을 생성하며, 다른 클라우드 제공자는 호스트 이름이 전혀 설정되어 있지 않을 수 있습니다. 이로 인해 도메인 이름 확인에 문제가 발생할 수 있습니다. `K3S_NODE_NAME`플래그 또는`K3S_NODE_NAME` 환경 변수를 사용하여 K3s를 실행하면 노드 이름을 전달하여 이 문제를 해결할 수 있습니다.
