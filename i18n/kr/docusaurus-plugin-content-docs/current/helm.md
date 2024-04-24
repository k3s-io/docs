---
title: 헬름(Helm)
---

헬름(Helm)은 쿠버네티스를 위한 패키지 관리 도구입니다. 헬름 차트는 쿠버네티스 YAML 매니페스트 문서를 위한 템플릿 구문을 제공합니다. 개발자 또는 클러스터 관리자는 헬름을 사용하여 정적 매니페스트만 사용하는 대신 차트라는 구성 가능한 템플릿을 만들 수 있다. 자신만의 차트 카탈로그 생성에 대한 자세한 내용은 [https://helm.sh/docs/intro/quickstart/](https://helm.sh/docs/intro/quickstart/)에서 문서를 확인하세요.

K3s는 헬름을 지원하기 위한 별도의 구성이 필요하지 않습니다. 다만, [클러스터 액세스](./cluster-access.md) 문서에 따라 kubeconfig 경로를 올바르게 설정했는지 확인하면 됩니다.

K3s에는 헬름 차트의 설치, 업그레이드/재구성 및 제거를 관리하는 [Helm Controller](https://github.com/k3s-io/helm-controller/)가 포함되어 있으며, 헬름 차트 커스텀 리소스 정의(CRD)를 사용하여 헬름 차트를 설치, 업그레이드/재구성 및 제거할 수 있습니다. 애드온 매니페스트 자동 배포](./installation/packaged-components.md)와 함께 사용하면 디스크에 단일 파일을 생성하여 클러스터에 헬름 차트를 설치하는 것을 자동화할 수 있습니다.

### 헬름 컨트롤러 사용하기

[헬름 차트 커스텀 리소스](https://github.com/k3s-io/helm-controller#helm-controller)는 일반적으로 `helm` 명령줄 도구에 전달할 대부분의 옵션을 담고 있습니다. 다음은 Bitnami 차트 저장소에서 아파치를 배포하여 기본 차트 값 중 일부를 재정의하는 방법에 대한 예제입니다. HelmChart 리소스 자체는 `kube-system` 네임스페이스에 있지만, 차트의 리소스는 동일한 매니페스트에 생성되는 `web` 네임스페이스에 배포된다는 점에 유의하세요. 이는 HelmChart 리소스를 배포하는 리소스와 분리하여 유지하려는 경우에 유용할 수 있습니다.

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: web
---
apiVersion: helm.cattle.io/v1
kind: HelmChart
metadata:
  name: apache
  namespace: kube-system
spec:
  repo: https://charts.bitnami.com/bitnami
  chart: apache
  targetNamespace: web
  valuesContent: |-
    service:
      type: ClusterIP
    ingress:
      enabled: true
      hostname: www.example.com
    metrics:
      enabled: true
```

#### HelmChart 필드 정의

| 필드                 | 기본값    | 설명                                                                                               | 헬름 인수 / 플래그 상응값 |
| -------------------- | --------- | -------------------------------------------------------------------------------------------------- | ------------------------- |
| metadata.name        |           | 헬름 차트 이름                                                                                     | NAME                      |
| spec.chart           |           | 리포지토리에 있는 헬름 차트 이름 또는 차트 아카이브(.tgz)에 대한 전체 HTTPS URL                    | CHART                     |
| spec.targetNamespace | default   | 헬름 차트 대상 네임스페이스                                                                        | `--namespace`             |
| spec.version         |           | 헬름 차트 버전(리포지토리에서 설치하는 경우)                                                       | `--version`               |
| spec.repo            |           | 헬름 차트 리포지토리 URL                                                                           | `--repo`                  |
| spec.repoCA          |           | HTTPS 사용 서버의 인증서를 지정                                                                    | `--ca-file`               |
| spec.helmVersion     | v3        | 사용할 헬름 버전 (`v2` 혹은 `v3`)                                                                  |                           |
| spec.bootstrap       | False     | 클러스터(클라우드 컨트롤러 관리자 등)를 부트스트랩하는 데 이 차트가 필요한 경우 True로 설정합니다. |                           |
| spec.set             |           | 간단한 기본 차트 값을 재정의합니다. 값을 통해 설정된 옵션보다 우선합니다.                          | `--set` / `--set-string`  |
| spec.jobImage        |           | 헬름 차트를 설치할 때 사용할 이미지를 지정합니다. 예시. rancher/klipper-helm:v0.3.0 .              |                           |
| spec.timeout         | 300       | 헬름 작업 시간 초과(초)                                                                            | `--timeout`               |
| spec.failurePolicy   | reinstall | `abort`로 설정하면 헬름 작업이 중단되고 운영자의 수동 개입이 있을 때까지 중단된다.                 |                           |
| spec.valuesContent   |           | YAML 파일 콘텐츠를 통해 복잡한 기본 차트 값 재정의                                                 | `--values`                |
| spec.chartContent    |           | Base64로 인코딩된 차트 아카이브 .tgz - spec.chart를 재정의합니다.                                  | CHART                     |

`/var/lib/rancher/k3s/server/static/`에 위치한 콘텐츠는 클러스터 내에서 쿠버네티스 APIServer를 통해 익명으로 액세스할 수 있습니다. 이 URL은 `spec.chart` 필드에 있는 특수 변수 `%{KUBERNETES_API}%`를 사용하여 템플릿화할 수 있습니다. 예를 들어, 패키지화된 Traefik 컴포넌트는 `https://%{KUBERNETES_API}%/static/charts/traefik-12.0.000.tgz`에서 해당 차트를 로드합니다.

:::note
`name` 필드는 헬름 차트 명명 규칙을 따라야 합니다. 자세한 내용은 [헬름 베스트 프랙티스 문서](https://helm.sh/docs/chart_best_practices/conventions/#chart-names)를 참고하세요.
:::

### HelmChartConfig로 패키지 컴포넌트 커스터마이징하기

:::info Version Gate

[v1.19.1+k3s1](https://github.com/k3s-io/k3s/releases/tag/v1.19.1%2Bk3s1) 부터 사용 가능

:::

HelmChart로 배포되는 패키지 컴포넌트(예로 Traefik)의 값을 재정의할 수 있도록, K3s는 HelmChartConfig 리소스를 통해 배포를 사용자 정의할 수 있도록 지원합니다. HelmChartConfig 리소스는 해당 HelmChart의 이름과 네임스페이스와 일치해야 하며, 추가 값 파일로 `helm` 명령에 전달되는 `valuesContent`를 추가로 제공할 수 있도록 지원합니다.

:::note
HelmChart `spec.set` 값은 HelmChart 및 HelmChartConfig `spec.valuesContent` 설정을 재정의합니다.
:::

예를 들어, 패키징된 트래픽 인그레스 구성을 사용자 정의하려면 `/var/lib/rancher/k3s/server/manifests/traefik-config.yaml`이라는 파일을 생성하고 다음 내용으로 채우면 됩니다:

```yaml
apiVersion: helm.cattle.io/v1
kind: HelmChartConfig
metadata:
  name: traefik
  namespace: kube-system
spec:
  valuesContent: |-
    image:
      name: traefik
      tag: v2.8.5
    forwardedHeaders:
      enabled: true
      trustedIPs:
        - 10.0.0.0/8
    ssl:
      enabled: true
      permanentRedirect: false
```

### 헬름 버전 2에서 마이그레이션하기

:::info Version Gate
v1.17.[v1.17.0+k3s.1](https://github.com/k3s-io/k3s/releases/tag/v1.17.0%2Bk3s.1)부터 헬름 v3가 기본적으로 지원 및 사용됩니다.
:::

K3s는 헬름 v2 또는 헬름 v3를 처리할 수 있습니다. 헬름 v3로 마이그레이션하려는 경우, [이](https://helm.sh/blog/migrate-from-helm-v2-to-helm-v3/) 헬름 블로그 게시물에서 플러그인을 사용하여 성공적으로 마이그레이션하는 방법을 설명합니다. 자세한 내용은 헬름 3 공식 문서 [여기](https://helm.sh/docs/)를 참고하세요. [클러스터 접근](./cluster-access.md)에 대한 섹션에 따라 kubeconfig를 올바르게 설정했는지 확인하세요.

:::note
헬름 3에서는 더 이상 Tiller와 `helm init` 명령이 필요하지 않습니다. 자세한 내용은 공식 문서를 참고하세요.
:::
