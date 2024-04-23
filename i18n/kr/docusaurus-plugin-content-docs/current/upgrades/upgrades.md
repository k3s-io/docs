---
title: "업그레이드"
---

### K3s 클러스터 업그레이드하기

[수동 업그레이드](manual.md)에서는 클러스터를 수동으로 업그레이드하는 몇 가지 기술을 설명합니다. 또한 [Terraform](https://www.terraform.io/)과 같은 타사 코드형 인프라 도구(Infrastructure-as-Code)를 통한 업그레이드의 기초로 사용할 수도 있습니다.

[자동 업그레이드](automated.md)는 Rancher의 [시스템-업그레이드-컨트롤러(system-upgrade-controller)](https://github.com/rancher/system-upgrade-controller)를 사용하여 쿠버네티스 네이티브 자동 업그레이드를 수행하는 방법을 설명합니다.

### 버전별 주의사항

- **Traefik:** Traefik이 비활성화되지 않은 경우, K3s 버전 1.20 이하에서는 Traefik v1이 설치되고, K3s 버전 1.21 이상에서는 v1이 없는 경우 Traefik v2가 설치됩니다. 구형 Traefik v1에서 Traefik v2로 업그레이드하려면 [Traefik 문서](https://doc.traefik.io/traefik/migration/v1-to-v2/)를 참조하시고 [마이그레이션 도구](https://github.com/traefik/traefik-migration-tool)를 사용하세요.

- **K3s 부트스트랩 데이터:** 외부 SQL 데이터스토어가 있는 HA 구성에서 K3s를 사용 중이고 서버(컨트롤 플레인) 노드가 `--token` CLI 플래그로 시작되지 않은 경우, 토큰을 지정하지 않고는 더 이상 클러스터에 K3s 서버를 추가할 수 없게 됩니다. 백업에서 복원할 때 필요하므로 이 토큰의 사본을 보관해야 합니다. 이전에는 K3s에서 외부 SQL 데이터스토어를 사용할 때 토큰을 사용하도록 강제하지 않았습니다.

  - 영향을 받는 버전은 &lt;= v1.19.12+k3s1, v1.20.8+k3s1, v1.21.2+k3s1; 이며, 패치된 버전은 v1.19.13+k3s1, v1.20.9+k3s1, v1.21.3+k3s1 입니다.

  - 다음과 같이 클러스터에 이미 가입된 서버에서 토큰 값을 찾을 수 있습니다:

```bash
cat /var/lib/rancher/k3s/server/token
```

- **실험용 Dqlite:** 실험용 내장 Dqlite 데이터 저장소는 K3s v1.19.1에서 더 이상 사용되지 않습니다. 실험용 Dqlite에서 실험용 내장 etcd 업그레이드는 지원되지 않는다는 점에 유의하세요. 업그레이드를 시도하면 성공하지 못하고 데이터가 손실됩니다.
