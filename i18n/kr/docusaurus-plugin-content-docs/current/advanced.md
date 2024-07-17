---
title: "고급 옵션 / 설정"
aliases:
  - /k3s/latest/kr/running/
  - /k3s/latest/kr/configuration/
---


이 섹션에는 K3s를 실행하고 관리할 수 있는 다양한 방법과 K3s 사용을 위해 호스트 OS를 준비하는 데 필요한 단계를 설명하는 고급 정보가 포함되어 있습니다.

## 인증서 관리

### 인증 기관 인증서

K3s는 첫 번째 서버 노드를 시작하는 동안 자체 서명된 CA(인증 기관) 인증서를 생성합니다. 이 CA 인증서는 10년 동안 유효하며 자동으로 갱신되지 않습니다.

사용자 지정 CA 인증서 사용 또는 자체 서명 CA 인증서 갱신에 대한 자세한 내용은 [`k3s 인증서 rotate-ca` 명령 설명서](./cli/certificate.md#certificate-authority-ca-certificates)를 참조하세요.

### 클라이언트 및 서버 인증서

K3s 클라이언트 및 서버 인증서는 발급한 날로부터 365일 동안 유효합니다. 만료되었거나 만료 후 90일 이내에 만료된 인증서는 K3s를 시작할 때마다 자동으로 갱신됩니다.

클라이언트 및 서버 인증서를 수동으로 로테이션하는 것에 대한 정보는 [`k3s 인증서 로테이션` 명령 설명서](./cli/certificate.md#client-and-server-certificates)를 참조하세요.

## 토큰 관리

기본적으로 K3s는 서버와 에이전트 모두에 단일 정적 토큰을 사용합니다. 이 토큰은 클러스터가 생성된 후에는 변경할 수 없습니다.
에이전트 조인에만 사용할 수 있는 두 번째 정적 토큰을 활성화하거나 자동으로 만료되는 임시 `kubeadm` 스타일 조인 토큰을 생성할 수 있습니다.
자세한 내용은 [`k3s token` 명령어 설명서](./cli/token.md)를 참고하세요.

## HTTP 프록시 구성하기

HTTP 프록시를 통해서만 외부와 연결할 수 있는 환경에서 K3s를 실행하는 경우, K3s 시스템드 서비스에서 프록시 설정을 구성할 수 있습니다. 그러면 이 프록시 설정이 K3s에서 사용되어 내장 컨테이너와 kubelet에 전달됩니다.

K3s 설치 스크립트는 자동으로 현재 셸에서 `HTTP_PROXY`, `HTTPS_PROXY` 및 `NO_PROXY` 변수와 `CONTAINERD_HTTP_PROXY`, `CONTAINERD_HTTPS_PROXY` 및 `CONTAINERD_NO_PROXY` 변수가 있는 경우 이를 systemd 서비스의 환경 파일에 작성합니다:

- `/etc/systemd/system/k3s.service.env`
- `/etc/systemd/system/k3s-agent.service.env`

물론 이 파일을 편집하여 프록시를 구성할 수도 있습니다.

K3s는 클러스터 내부 파드 및 서비스 IP 범위와 클러스터 DNS 도메인을 자동으로 `NO_PROXY` 항목 목록에 추가합니다. 쿠버네티스 노드 자체에서 사용하는 IP 주소 범위(즉, 노드의 퍼블릭 및 프라이빗 IP)가 `NO_PROXY` 목록에 포함되어 있는지 또는 프록시를 통해 노드에 도달할 수 있는지 확인해야 합니다.

```
HTTP_PROXY=http://your-proxy.example.com:8888
HTTPS_PROXY=http://your-proxy.example.com:8888
NO_PROXY=127.0.0.0/8,10.0.0.0/8,172.16.0.0/12,192.168.0.0/16
```

K3s와 Kubelet에 영향을 주지 않고 컨테이너에 대한 프록시 설정을 구성하려면, 변수 앞에 `CONTAINERD_`를 붙이면 됩니다:

```
CONTAINERD_HTTP_PROXY=http://your-proxy.example.com:8888
CONTAINERD_HTTPS_PROXY=http://your-proxy.example.com:8888
CONTAINERD_NO_PROXY=127.0.0.0/8,10.0.0.0/8,172.16.0.0/12,192.168.0.0/16
```

## 컨테이너 런타임으로 Docker 사용

K3s는 업계 표준 컨테이너 런타임인 [containerd](https://containerd.io/)를 포함하며 기본값으로 사용합니다.
쿠버네티스 1.24부터, kubelet은 더 이상 kubelet이 dockerd와 통신할 수 있도록 하는 컴포넌트인 dockershim을 포함하지 않습니다.
K3s 1.24 이상에는 [cri-dockerd](https://github.com/Mirantis/cri-dockerd)가 포함되어 있어 이전 릴리즈의 K3s에서 원활하게 업그레이드하면서 Docker 컨테이너 런타임을 계속 사용할 수 있습니다.

컨테이너 대신 Docker를 사용하려면:

1. K3s 노드에 Docker를 설치합니다. 랜처의 [Docker 설치 스크립트](https://github.com/rancher/install-docker) 중 하나를 사용하여 Docker를 설치할 수 있습니다:

   ```bash
   curl https://releases.rancher.com/install-docker/20.10.sh | sh
   ```

2. `--docker` 옵션을 사용하여 K3s를 설치합니다:

   ```bash
   curl -sfL https://get.k3s.io | sh -s - --docker
   ```

3. 클러스터를 사용할 수 있는지 확인합니다:

   ```bash
   $ sudo k3s kubectl get pods --all-namespaces
   NAMESPACE     NAME                                     READY   STATUS      RESTARTS   AGE
   kube-system   local-path-provisioner-6d59f47c7-lncxn   1/1     Running     0          51s
   kube-system   metrics-server-7566d596c8-9tnck          1/1     Running     0          51s
   kube-system   helm-install-traefik-mbkn9               0/1     Completed   1          51s
   kube-system   coredns-8655855d6-rtbnb                  1/1     Running     0          51s
   kube-system   svclb-traefik-jbmvl                      2/2     Running     0          43s
   kube-system   traefik-758cd5fc85-2wz97                 1/1     Running     0          43s
   ```

4. Docker 컨테이너가 실행 중인지 확인합니다:

   ```bash
   $ sudo docker ps
   CONTAINER ID        IMAGE                     COMMAND                  CREATED              STATUS              PORTS               NAMES
   3e4d34729602        897ce3c5fc8f              "entry"                  About a minute ago   Up About a minute                       k8s_lb-port-443_svclb-traefik-jbmvl_kube-system_d46f10c6-073f-4c7e-8d7a-8e7ac18f9cb0_0
   bffdc9d7a65f        rancher/klipper-lb        "entry"                  About a minute ago   Up About a minute                       k8s_lb-port-80_svclb-traefik-jbmvl_kube-system_d46f10c6-073f-4c7e-8d7a-8e7ac18f9cb0_0
   436b85c5e38d        rancher/library-traefik   "/traefik --configfi…"   About a minute ago   Up About a minute                       k8s_traefik_traefik-758cd5fc85-2wz97_kube-system_07abe831-ffd6-4206-bfa1-7c9ca4fb39e7_0
   de8fded06188        rancher/pause:3.1         "/pause"                 About a minute ago   Up About a minute                       k8s_POD_svclb-traefik-jbmvl_kube-system_d46f10c6-073f-4c7e-8d7a-8e7ac18f9cb0_0
   7c6a30aeeb2f        rancher/pause:3.1         "/pause"                 About a minute ago   Up About a minute                       k8s_POD_traefik-758cd5fc85-2wz97_kube-system_07abe831-ffd6-4206-bfa1-7c9ca4fb39e7_0
   ae6c58cab4a7        9d12f9848b99              "local-path-provisio…"   About a minute ago   Up About a minute                       k8s_local-path-provisioner_local-path-provisioner-6d59f47c7-lncxn_kube-system_2dbd22bf-6ad9-4bea-a73d-620c90a6c1c1_0
   be1450e1a11e        9dd718864ce6              "/metrics-server"        About a minute ago   Up About a minute                       k8s_metrics-server_metrics-server-7566d596c8-9tnck_kube-system_031e74b5-e9ef-47ef-a88d-fbf3f726cbc6_0
   4454d14e4d3f        c4d3d16fe508              "/coredns -conf /etc…"   About a minute ago   Up About a minute                       k8s_coredns_coredns-8655855d6-rtbnb_kube-system_d05725df-4fb1-410a-8e82-2b1c8278a6a1_0
   c3675b87f96c        rancher/pause:3.1         "/pause"                 About a minute ago   Up About a minute                       k8s_POD_coredns-8655855d6-rtbnb_kube-system_d05725df-4fb1-410a-8e82-2b1c8278a6a1_0
   4b1fddbe6ca6        rancher/pause:3.1         "/pause"                 About a minute ago   Up About a minute                       k8s_POD_local-path-provisioner-6d59f47c7-lncxn_kube-system_2dbd22bf-6ad9-4bea-a73d-620c90a6c1c1_0
   64d3517d4a95        rancher/pause:3.1         "/pause"
   ```

## etcdctl 사용하기

etcdctl은 etcd 서버와 상호 작용하기 위한 CLI를 제공합니다. K3s는 etcdctl을 번들로 제공하지 않습니다.

etcdctl을 사용하여 K3s의 내장된 etcd와 상호 작용하려면 [공식 문서](https://etcd.io/docs/latest/install/)를 참조하여 etcdctl을 설치하세요.

```bash
ETCD_VERSION="v3.5.5"
ETCD_URL="https://github.com/etcd-io/etcd/releases/download/${ETCD_VERSION}/etcd-${ETCD_VERSION}-linux-amd64.tar.gz"
curl -sL ${ETCD_URL} | sudo tar -zxv --strip-components=1 -C /usr/local/bin
```

그런 다음 인증에 K3s에서 관리하는 인증서 및 키를 사용하도록 etcdctl을 구성하여 사용할 수 있습니다:

```bash
sudo etcdctl version \
  --cacert=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt \
  --cert=/var/lib/rancher/k3s/server/tls/etcd/client.crt \
  --key=/var/lib/rancher/k3s/server/tls/etcd/client.key
```

## 컨테이너 설정하기

K3s는 `/var/lib/rancher/k3s/agent/etc/containerd/config.toml`에 컨테이너에 대한 config.toml을 생성합니다.

이 파일에 대한 고급 커스터마이징을 위해 같은 디렉터리에 `config.toml.tmpl`이라는 다른 파일을 생성하면 이 파일이 대신 사용된다.

`config.toml.tmpl`은 Go 템플릿 파일로 취급되며, `config.Node` 구조가 템플릿으로 전달됩니다. 이 구조를 사용하여 구성 파일을 사용자 정의하는 방법에 대한 Linux 및 Windows 예제는 [이 폴더](https://github.com/k3s-io/k3s/blob/master/pkg/agent/templates)를 참조하세요.
config.Node Go 언어 구조체는 [여기](https://github.com/k3s-io/k3s/blob/master/pkg/daemons/config/types.go#L37)에 정의되어 있습니다.

## NVIDIA 컨테이너 런타임 지원

K3s는 K3s 시작 시 NVIDIA 컨테이너 런타임이 있으면 자동으로 감지하여 설정합니다.

1. 아래의 안내에 따라 노드에 엔비디아 컨테이너 패키지 리포지토리를 설치합니다:
   https://nvidia.github.io/libnvidia-container/
1. 엔비디아 컨테이너 런타임 패키지를 설치합니다. 예시:
   `apt install -y nvidia-container-runtime cuda-drivers-fabricmanager-515 nvidia-headless-515-server`
1. K3s를 설치하거나 이미 설치되어 있는 경우 다시 시작합니다:
   `curl -ksL get.k3s.io | sh -`
1. k3s가 엔비디아 컨테이너 런타임을 찾았는지 확인합니다:
   `grep nvidia /var/lib/rancher/k3s/agent/etc/containerd/config.toml`

이렇게 하면 발견된 런타임 실행 파일에 따라 컨테이너 설정에 `nvidia` 및/또는 `nvidia-experimental` 런타임이 자동으로 추가됩니다.
여전히 클러스터에 런타임클래스 정의를 추가하고, 파드 스펙에서 `runtimeClassName: nvidia`를 설정하여 적절한 런타임을 명시적으로 요청하는 파드를 배포해야 합니다:

```yaml
apiVersion: node.k8s.io/v1
kind: RuntimeClass
metadata:
  name: nvidia
handler: nvidia
---
apiVersion: v1
kind: Pod
metadata:
  name: nbody-gpu-benchmark
  namespace: default
spec:
  restartPolicy: OnFailure
  runtimeClassName: nvidia
  containers:
    - name: cuda-container
      image: nvcr.io/nvidia/k8s/cuda-sample:nbody
      args: ["nbody", "-gpu", "-benchmark"]
      resources:
        limits:
          nvidia.com/gpu: 1
      env:
        - name: NVIDIA_VISIBLE_DEVICES
          value: all
        - name: NVIDIA_DRIVER_CAPABILITIES
          value: all
```

엔비디아 컨테이너 런타임은 [엔비디아 디바이스 플러그인](https://github.com/NVIDIA/k8s-device-plugin/) 및 [GPU 기능 검색](https://github.com/NVIDIA/gpu-feature-discovery/)과 함께 자주 사용되며, 위에서 언급한 것처럼 파드 사양에 `runtimeClassName: nvidia`가 포함되도록 수정하여 별도로 설치해야 한다는 점에 유의하세요.

## 에이전트 없는 서버 실행하기(실험적)

> **경고:** 이 기능은 실험 단계입니다.

`disable-agent` 플래그로 시작하면, 서버는 kubelet, 컨테이너 런타임 또는 CNI를 실행하지 않습니다. 클러스터에 노드 리소스를 등록하지 않으며, `kubectl get nodes` 출력에 나타나지 않습니다.
에이전트리스 서버는 kubelet을 호스트하지 않기 때문에, 파드를 실행하거나 내장된 etcd 컨트롤러 및 시스템 업그레이드 컨트롤러를 포함하여 클러스터 노드를 열거하는 데 의존하는 운영자가 관리할 수 없습니다.

에이전트리스 서버를 실행하는 것은 클러스터 운영자 지원 부족으로 인한 관리 오버헤드 증가를 감수하고서라도 에이전트와 워크로드에 의한 검색으로부터 컨트롤 플레인 노드를 숨기고자 하는 경우에 유리할 수 있습니다.

## 루트리스 서버 실행(실험적)

> **경고:** 이 기능은 실험 단계입니다.

루트리스 모드는 잠재적인 컨테이너 브레이크아웃 공격으로부터 호스트의 실제 루트를 보호하기 위해 권한이 없는 사용자로 K3s 서버를 실행할 수 있습니다.

루트리스 쿠버네티스에 대한 자세한 내용은 https://rootlesscontaine.rs/ 을 참조하세요.

### 루트리스 모드의 알려진 이슈

- **포트**

  루트리스 실행 시 새로운 네트워크 네임스페이스가 생성됩니다. 이는 K3s 인스턴스가 호스트와 네트워킹이 상당히 분리된 상태로 실행된다는 것을 의미합니다.
  호스트에서 K3s에서 실행되는 서비스에 액세스하는 유일한 방법은 K3s 네트워크 네임스페이스에 포트 포워드를 설정하는 것입니다.
  루트리스 K3s에는 6443 및 1024 미만의 서비스 포트를 10000 오프셋으로 호스트에 자동으로 바인딩하는 컨트롤러가 포함되어 있습니다.

  예를 들어, 포트 80의 서비스는 호스트에서 10080이 되지만 8080은 오프셋 없이 8080이 됩니다. 현재 로드밸런서 서비스만 자동으로 바인딩됩니다.

- **Cgroup**

  Cgroup v1 및 하이브리드 v1/v2는 지원되지 않으며, 순수 Cgroup v2만 지원됩니다. 루트리스 실행 시 누락된 Cgroup으로 인해 K3s가 시작되지 않는 경우, 노드가 하이브리드 모드에 있고 "누락된" Cgroup이 여전히 v1 컨트롤러에 바인딩되어 있을 가능성이 높습니다.

- **멀티노드/멀티프로세스 클러스터**

  다중 노드 루트리스 클러스터 또는 동일한 노드에 있는 여러 개의 루트리스 k3s 프로세스는 현재 지원되지 않습니다. 자세한 내용은 [#6488](https://github.com/k3s-io/k3s/issues/6488#issuecomment-1314998091)을 참조하세요.

### 루트리스 서버 시작하기

- https://rootlesscontaine.rs/getting-started/common/cgroup2/ 을 참조하여 cgroup v2 위임을 활성화합니다.
  이 단계는 필수이며, 적절한 cgroups가 위임되지 않으면 루트리스 kubelet을 시작하지 못합니다.

- `https://github.com/k3s-io/k3s/blob/<VERSION>/k3s-rootless.service`](https://github.com/k3s-io/k3s/blob/master/k3s-rootless.service)에서 `k3s-rootless.service`를 다운로드한다.
  `k3s-rootless.service`와 `k3s`의 버전이 같은 것을 사용해야 합니다.

- `k3s-rootless.service`를 `~/.config/systemd/user/k3s-rootless.service`에 설치합니다.
  이 파일을 시스템 전체 서비스(`/etc/systemd/...`)로 설치하는 것은 지원되지 않습니다.
  `k3s` 바이너리의 경로에 따라 파일의 `ExecStart=/usr/local/bin/k3s ...` 행을 수정해야 할 수 있습니다.

- `systemctl --user daemon-reload`를 실행합니다.

- `systemctl --user enable --now k3s-rootless`를 실행한다.

- `KUBECONFIG=~/.kube/k3s.yaml kubectl get pods -A`를 실행하고, 파드가 실행 중인지 확인한다.

> 참고: 터미널 세션은 cgroups v2 위임을 허용하지 않으므로 터미널에서 `k3s server --rootless`를 실행하지 않는다.
> 터미널에서 꼭 실행해야 하는 경우, `systemd-run --user -p Delegate=yes --tty k3s server --roolless`를 사용하여 systemd 범위로 래핑합니다.

### 고급 루트리스 구성

루트리스 K3s는 호스트와 사용자 네트워크 네임스페이스 간 통신을 위해 [rootlesskit](https://github.com/rootless-containers/rootlesskit) 및 [slirp4netns](https://github.com/rootless-containers/slirp4netns)를 사용합니다.
루트리스킷과 slirp4net에서 사용하는 구성 중 일부는 환경 변수로 설정할 수 있습니다. 이를 설정하는 가장 좋은 방법은 k3s-rootless systemd 유닛의 `Environment` 필드에 추가하는 것입니다.

| Variable                             | Default      | Description                                                                                                                                               |
| ------------------------------------ | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `K3S_ROOTLESS_MTU`                   | 1500         | slirp4netns 가상 인터페이스의 MTU를 설정합니다.                                                                                                           |
| `K3S_ROOTLESS_CIDR`                  | 10.41.0.0/16 | slirp4netns 가상 인터페이스에서 사용하는 CIDR을 설정합니다.                                                                                               |
| `K3S_ROOTLESS_ENABLE_IPV6`           | autotedected | Enables slirp4netns IPv6 지원. 지정하지 않으면 K3가 듀얼 스택 작동을 위해 구성되면 자동으로 활성화됩니다.                                                 |
| `K3S_ROOTLESS_PORT_DRIVER`           | builtin      | 루트리스 포트 드라이버를 선택합니다. `builtin` 또는 `slirp4netns` 중 하나를 선택합니다. 빌트인이 더 빠르지만 인바운드 패킷의 원래 소스 주소를 가장합니다. |
| `K3S_ROOTLESS_DISABLE_HOST_LOOPBACK` | true         | 게이트웨이 인터페이스를 통한 호스트의 루프백 주소에 대한 액세스를 사용할지 여부를 제어합니다. 보안상의 이유로 변경하지 않는 것이 좋습니다.                |

### 루트리스 문제 해결하기

- `systemctl --user status k3s-rootless`를 실행하여 데몬 상태를 확인합니다.
- `journalctl --user -f -u k3s-rootless`를 실행하여 데몬 로그를 확인합니다.
- https://rootlesscontaine.rs/ 참조

## 노드 레이블 및 테인트

K3s 에이전트는 `--node-label` 및 `--node-taint` 옵션으로 구성할 수 있으며, 이 옵션은 kubelet에 레이블과 테인트를 추가합니다. 이 두 옵션은 [등록 시점에] 레이블 및/또는 테인트만 추가하므로(./cli/agent.md#node-labels-and-taints-for-agents), 노드가 클러스터에 처음 조인될 때만 설정할 수 있습니다.

현재 모든 버전의 쿠버네티스는 노드가 `kubernetes.io` 및 `k8s.io` 접두사가 포함된 대부분의 레이블, 특히 `kubernetes.io/role` 레이블에 등록하는 것을 제한합니다. 허용되지 않는 레이블을 가진 노드를 시작하려고 하면 K3s가 시작되지 않습니다. 쿠버네티스 작성자가 언급했듯이:

> 노드는 자체 역할 레이블을 어설트하는 것이 허용되지 않습니다. 노드 역할은 일반적으로 권한 또는 컨트롤 플레인 유형의 노드를 식별하는 데 사용되며, 노드가 해당 풀에 레이블을 지정하도록 허용하면 손상된 노드가 더 높은 권한 자격 증명에 대한 액세스 권한을 부여하는 워크로드(예: 컨트롤 플레인 데몬셋)를 사소하게 끌어들일 수 있습니다.

자세한 내용은 [SIG-Auth KEP 279](https://github.com/kubernetes/enhancements/blob/master/keps/sig-auth/279-limit-node-access/README.md#proposal)를 참조하세요.

노드 등록 후 노드 레이블과 틴트를 변경하거나 예약 레이블을 추가하려면 `kubectl`을 사용해야 합니다. [taint](https://kubernetes.io/ko/docs/concepts/scheduling-eviction/taint-and-toleration/) 및 [노드 레이블](https://kubernetes.io/ko/docs/tasks/configure-pod-container/assign-pods-nodes/#add-a-label-to-a-node)을 추가하는 방법에 대한 자세한 내용은 쿠버네티스 공식 문서를 참고하세요.

## 설치 스크립트로 서비스 시작하기

설치 스크립트는 설치 프로세스의 일부로 OS가 systemd 또는 openrc를 사용하는지 자동으로 감지하고 서비스를 활성화 및 시작합니다.

- openrc로 실행하면 `/var/log/k3s.log`에 로그가 생성됩니다.
- systemd로 실행하는 경우, `/var/log/syslog`에 로그가 생성되며 `journalctl -u k3s`(또는 에이전트에서는 `journalctl -u k3s-agent`)를 사용하여 로그를 확인할 수 있습니다.

설치 스크립트로 자동 시작 및 서비스 활성화를 비활성화하는 예제입니다:

```bash
curl -sfL https://get.k3s.io | INSTALL_K3S_SKIP_START=true INSTALL_K3S_SKIP_ENABLE=true sh -
```

## 추가 OS 준비 사항

### 이전 iptables 버전

몇몇 유명 Linux 배포판에는 중복 규칙이 누적되어 노드의 성능과 안정성에 부정적인 영향을 주는 버그가 포함된 버전의 iptables가 포함되어 있습니다. 이 문제의 영향을 받는지 확인하는 방법에 대한 자세한 내용은 [Issue #3117](https://github.com/k3s-io/k3s/issues/3117)을 참조하세요.

K3s에는 정상적으로 작동하는 iptables(v1.8.8) 버전이 포함되어 있습니다. `--prefer-bundled-bin` 옵션으로 K3s를 시작하거나 운영 체제에서 iptables/nftables 패키지를 제거하여 K3s가 번들 버전의 iptables를 사용하도록 설정할 수 있습니다.

:::info Version Gate

`prefer-bundled-bin` 플래그는 2022-12 릴리스(v1.26.0+k3s1, v1.25.5+k3s1, v1.24.9+k3s1, v1.23.15+k3s1) 부터 사용할 수 있습니다.

:::

### Red Hat Enterprise Linux / CentOS

firewalld를 끄는 것이 좋습니다:

```bash
systemctl disable firewalld --now
```

방화벽을 사용하도록 설정하려면 기본적으로 다음 규칙이 필요합니다:

```bash
firewall-cmd --permanent --add-port=6443/tcp #apiserver
firewall-cmd --permanent --zone=trusted --add-source=10.42.0.0/16 #pods
firewall-cmd --permanent --zone=trusted --add-source=10.43.0.0/16 #services
firewall-cmd --reload
```

설정에 따라 추가 포트를 열어야 할 수도 있습니다. 자세한 내용은 [인바운드 규칙](./installation/requirements.md#inbound-rules-for-k3s-nodes)을 참조하세요. 파드 또는 서비스에 대한 기본 CIDR을 변경하는 경우, 그에 따라 방화벽 규칙을 업데이트해야 합니다.

활성화된 경우, nm-cloud-setup을 비활성화하고 노드를 재부팅해야 합니다:

```bash
systemctl disable nm-cloud-setup.service nm-cloud-setup.timer
reboot
```

### Ubuntu

ufw(uncomplicated firewall)를 끄는 것이 좋습니다:

```bash
ufw disable
```

ufw를 사용하도록 설정하려면 기본적으로 다음 규칙이 필요합니다:

```bash
ufw allow 6443/tcp #apiserver
ufw allow from 10.42.0.0/16 to any #pods
ufw allow from 10.43.0.0/16 to any #services
```

설정에 따라 추가 포트를 열어야 할 수도 있습니다. 자세한 내용은 [인바운드 규칙](./installation/requirements.md#inbound-rules-for-k3s-nodes)을 참조한다. 파드 또는 서비스에 대한 기본 CIDR을 변경하는 경우, 그에 따라 방화벽 규칙을 업데이트해야 합니다.

### Raspberry Pi

라즈베리파이 OS는 데비안 기반이며, 오래된 iptables 버전으로 인해 문제가 발생할 수 있습니다. [해결 방법](#이전-iptables-버전)을 참조하세요.

표준 라즈베리파이 OS 설치는 `cgroups`가 활성화된 상태에서 시작되지 않습니다. **K3S**는 systemd 서비스를 시작하기 위해 `cgroups`가 필요합니다. `cgroups`는 `/boot/cmdline.txt`에 `cgroup_memory=1 cgroup_enable=memory`를 추가하여 활성화할 수 있습니다.

cmdline.txt 예시:

```
console=serial0,115200 console=tty1 root=PARTUUID=58b06195-02 rootfstype=ext4 elevator=deadline fsck.repair=yes rootwait cgroup_memory=1 cgroup_enable=memory
```

우분투 21.10부터 라즈베리파이의 vxlan 지원은 별도의 커널 모듈로 옮겨졌습니다.

```bash
sudo apt install linux-modules-extra-raspi
```

## Docker에서 k3s 실행하기

Docker에서 K3s를 실행하는 방법에는 여러 가지가 있습니다:

<Tabs>
<TabItem value='K3d' default>

[k3d](https://github.com/k3d-io/k3d)는 도커에서 멀티노드 K3s 클러스터를 쉽게 실행할 수 있도록 설계된 유틸리티입니다.

k3d를 사용하면 쿠버네티스의 로컬 개발 등을 위해 도커에서 단일 노드 및 다중 노드 k3s 클러스터를 매우 쉽게 생성할 수 있습니다.

k3d 설치 및 사용 방법에 대한 자세한 내용은 [설치](https://k3d.io/#installation) 설명서를 참조하세요.

</TabItem>
<TabItem value="Docker">

Docker를 사용하려면 `rancher/k3s` 이미지를 사용하여 K3s 서버와 에이전트를 실행할 수도 있습니다.
`docker run` 명령어를 사용합니다:

```bash
sudo docker run \
  --privileged \
  --name k3s-server-1 \
  --hostname k3s-server-1 \
  -p 6443:6443 \
  -d rancher/k3s:v1.24.10-k3s1 \
  server
```

:::note
태그에 유효한 K3s 버전을 지정해야 하며, `latest` 태그는 유지되지 않습니다.  
도커 이미지는 태그에 `+` 기호를 허용하지 않으므로 태그에 `-`를 대신 사용하세요.
:::

K3s가 실행되고 나면, 관리자 kubeconfig를 Docker 컨테이너에서 복사하여 사용할 수 있습니다:

```bash
sudo docker cp k3s-server-1:/etc/rancher/k3s/k3s.yaml ~/.kube/config
```

</TabItem>
</Tabs>

## SELinux 지원

:::info Version Gate

v1.19.4+k3s1부터 사용 가능

:::

기본적으로 SELinux가 활성화된 시스템(예로 CentOS)에 K3s를 설치하는 경우 적절한 SELinux 정책이 설치되어 있는지 확인해야 합니다.

<Tabs>
<TabItem value="자동 설치" default>

에어 갭(폐쇄망) 설치를 수행하지 않는 경우 호환되는 시스템에서 [설치 스크립트](./installation/configuration.md#configuration-with-install-script)는 랜처 RPM 저장소에서 SELinux RPM을 자동으로 설치합니다. 자동 설치는 `INSTALL_K3S_SKIP_SELINUX_RPM=true`로 설정하여 건너뛸 수 있습니다.

</TabItem>

<TabItem value="수동 설치" default>

필요한 policy는 다음 명령을 사용하여 설치할 수 있습니다:

```bash
yum install -y container-selinux selinux-policy-base
yum install -y https://rpm.rancher.io/k3s/latest/common/centos/7/noarch/k3s-selinux-0.2-1.el7_8.noarch.rpm
```

설치 스크립트가 실패하지 않고 경고를 기록하도록 하려면 다음 환경 변수를 설정하면 됩니다:
`INSTALL_K3S_SELINUX_WARN=true`.
</TabItem>
</Tabs>

### SELinux 적용 활성화하기

SELinux를 활용하려면 K3s 서버 및 에이전트를 시작할 때 `--selinux` 플래그를 지정하세요.

이 옵션은 K3s [구성 파일](./installation/configuration.md#configuration-file)에서도 지정할 수 있습니다.

```
selinux: true
```

SELinux에서 사용자 지정 `--data-dir`을 사용하는 것은 지원되지 않습니다. 사용자 지정하려면 사용자 지정 정책을 직접 작성해야 할 가능성이 높습니다. 컨테이너 런타임에 대한 SELinux 정책 파일이 포함된 [containers/container-selinux](https://github.com/containers/container-selinux) 리포지토리와 K3s를 위한 SELinux 정책이 포함된 [k3s-io/k3s-selinux](https://github.com/k3s-io/k3s-selinux) 리포지토리를 참고할 수 있습니다.

## 지연 풀링의 지연 풀링 활성화 (실험적)

### 지연 풀링과 eStargz란 무엇인가요?

이미지 풀링은 컨테이너 라이프사이클에서 시간이 많이 소요되는 단계 중 하나로 알려져 있습니다.
Harter, et al.(https://www.usenix.org/conference/fast16/technical-sessions/presentation/harter),

> 패키지 풀링은 컨테이너 시작 시간의 76%를 차지하지만, 그 중 읽기 데이터는 6.4%에 불과합니다.

이 문제를 해결하기 위해 k3s는 이미지 콘텐츠의 *lazy pulling*을 실험적으로 지원합니다.
이를 통해 k3s는 전체 이미지가 풀링되기 전에 컨테이너를 시작할 수 있습니다.
대신 필요한 콘텐츠 청크(예: 개별 파일)를 온디맨드 방식으로 가져옵니다.
특히 대용량 이미지의 경우 이 기술을 사용하면 컨테이너 시작 지연 시간을 단축할 수 있습니다.

지연 풀링을 사용하려면 대상 이미지의 포맷을 [_eStargz_](https://github.com/containerd/stargz-snapshotter/blob/main/docs/stargz-estargz.md)로 지정해야 합니다.
이 형식은 OCI 대체 형식이지만 지연 풀링을 위한 100% 호환되는 이미지 형식입니다.
호환성 때문에 eStargz는 표준 컨테이너 레지스트리(예: ghcr.io)로 푸시할 수 있을 뿐만 아니라 eStargz와 무관한 런타임에서도 _실행 가능_ 합니다.

eStargz는 [Google CRFS 프로젝트에서 제안한 stargz 형식](https://github.com/google/crfs)을 기반으로 개발되었지만 콘텐츠 검증 및 성능 최적화를 포함한 실용적인 기능을 제공합니다.
지연 풀링과 eStargz에 대한 자세한 내용은 [Stargz Snapshotter 프로젝트 리포지토리](https://github.com/containerd/stargz-snapshotter)를 참고하시기 바랍니다.

### 지연 풀링이 가능하도록 k3s 구성하기

아래와 같이 k3s 서버와 에이전트에는 `--snapshotter=stargz` 옵션이 필요합니다.

```bash
k3s server --snapshotter=stargz
```

이 구성을 사용하면, eStargz 형식의 이미지에 대해 지연 풀링을 수행할 수 있습니다.
다음 예제 파드 매니페스트는 eStargz 형식의 `node:13.13.0` 이미지(`ghcr.io/stargz-containers/node:13.13.0-esgz`)를 사용합니다.
스타즈 스냅샷터가 활성화되면 K3s는 이 이미지에 대해 지연 풀링을 수행합니다.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nodejs
spec:
  containers:
    - name: nodejs-estargz
      image: ghcr.io/stargz-containers/node:13.13.0-esgz
      command: ["node"]
      args:
        - -e
        - var http = require('http');
          http.createServer(function(req, res) {
          res.writeHead(200);
          res.end('Hello World!\n');
          }).listen(80);
      ports:
        - containerPort: 80
```

## 추가 로깅 소스

K3s용 [랜처 로깅](https://rancher.com/docs/rancher/v2.6/en/logging/helm-chart-options/)은 랜처를 사용하지 않고 설치할 수 있습니다. 이를 위해서는 다음 지침을 실행해야 합니다:

```bash
helm repo add rancher-charts https://charts.rancher.io
helm repo update
helm install --create-namespace -n cattle-logging-system rancher-logging-crd rancher-charts/rancher-logging-crd
helm install --create-namespace -n cattle-logging-system rancher-logging --set additionalLoggingSources.k3s.enabled=true rancher-charts/rancher-logging
```

## 추가 네트워크 정책 로깅

네트워크 정책에 의해 차단된 패킷을 로깅할 수 있습니다. 패킷은 차단 네트워크 정책을 포함한 패킷 세부 정보를 표시하는 iptables NFLOG 작업으로 전송됩니다.

트래픽이 많으면 로그 메시지 수가 매우 많아질 수 있습니다. 정책별로 로그 속도를 제어하려면, 해당 네트워크 정책에 다음 어노테이션을 추가하여 `limit` 및 `limit-burst` iptables 매개변수를 설정합니다:
* `kube-router.io/netpol-nflog-limit=<LIMIT-VALUE>`
* `kube-router.io/netpol-nflog-limit-burst=<LIMIT-BURST-VALUE>`


기본값은 `limit=10/minute`와 `limit-burst=10`입니다. 이러한 필드의 형식과 사용 가능한 값에 대한 자세한 내용은 [iptables manual](https://www.netfilter.org/documentation/HOWTO/packet-filtering-HOWTO-7.html#:~:text=restrict%20the%20rate%20of%20matches)을 참조하세요.

NFLOG 패킷을 로그 항목으로 변환하려면 ulogd2를 설치하고 `[log1]`을 `group=100`에서 읽도록 구성합니다. 그런 다음 ulogd2 서비스를 다시 시작하여 새 구성이 커밋되도록 합니다.
네트워크 정책 규칙에 의해 패킷이 차단되면 `/var/log/ulog/syslogemu.log`에 로그 메시지가 나타납니다.

NFLOG 넷링크 소켓으로 전송된 패킷은 tcpdump 또는 tshark와 같은 명령줄 도구를 사용하여 읽을 수도 있습니다:

```bash
tcpdump -ni nflog:100
```
더 쉽게 사용할 수 있지만, tcpdump는 패킷을 차단한 네트워크 정책의 이름을 표시하지 않습니다. 대신 와이어샤크의 tshark 명령을 사용하여 정책 이름이 포함된 `nflog.prefix` 필드를 포함한 전체 NFLOG 패킷 헤더를 표시하세요.
