---
title: 알려진 이슈
---

알려진 이슈는 주기적으로 업데이트되며, 다음 릴리스에서 즉시 해결되지 않을 수 있는 문제에 대해 알려드리기 위해 고안되었습니다.

### 스냅(Snap) 도커

스냅(Snap) 패키지를 통해 설치된 도커는 K3s를 실행하는 데 문제를 일으키는 것으로 알려져 있으므로 K3s와 함께 사용하려는 경우 권장하지 않습니다.

### Iptables

레거시 대신 nftables 모드에서 iptables를 실행하는 경우 문제가 발생할 수 있습니다. 문제를 방지하려면 최신 버전(예: 1.6.1+)의 iptables를 사용하는 것이 좋습니다.

또한 1.8.0-1.8.4 버전에는 K3s가 실패할 수 있는 알려진 문제가 있습니다. 해결 방법은 [추가 OS 준비](./advanced.md#이전-iptables-버전)를 참조하세요.

### Rootless Mode

루트리스 모드로 K3s를 실행하는 것은 실험 중이며 몇 가지 [알려진 이슈](./advanced.md#known-issues-with-rootless-mode)가 있습니다.

# 강화된(Hardened) 클러스터를 v1.24.x에서 v1.25.x로 업그레이드하기

쿠버네티스는 파드 보안 표준(PSS, Pod Security Standards)을 위해 v1.25에서 PodSecurityPolicy를 제거했습니다. PSS에 대한 자세한 내용은 [업스트림 문서](https://kubernetes.io/ko/docs/concepts/security/pod-security-standards/)에서 확인할 수 있습니다. K3S의 경우, 노드에 'PodSecurityPolicy'가 구성된 경우 수행해야 하는 몇 가지 수동 단계가 있습니다.

1. 모든 노드에서 `kube-apiserver-arg` 값을 업데이트하여 `PodSecurityPolicy` 어드미션 플러그인을 제거합니다. 대신 다음 arg 값을 추가합니다: `'admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml'` 이지만, 아직 K3S를 재시작하거나 업그레이드하지 마십시오. 아래는 노드를 강화한 후 구성 파일의 예시입니다.

```yaml
protect-kernel-defaults: true
secrets-encryption: true
kube-apiserver-arg:
  - "admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml"
  - "audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log"
  - "audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml"
  - "audit-log-maxage=30"
  - "audit-log-maxbackup=10"
  - "audit-log-maxsize=100"
kube-controller-manager-arg:
  - "terminated-pod-gc-threshold=10"
  - "use-service-account-credentials=true"
kubelet-arg:
  - "streaming-connection-idle-timeout=5m"
  - "make-iptables-util-chains=true"
```

2. `/var/lib/rancher/k3s/server/psa.yaml` 파일을 다음 내용으로 작성합니다. 더 많은 네임스페이스를 제외할 수도 있습니다. 아래 예시는 `kube-system`(필수), `cis-operator-system`(선택적이지만 Rancher를 통해 보안 스캔을 실행할 때 유용), `system-upgrade`(자동 업그레이드를 수행하는 경우 필수)을 제외합니다.

```yaml
apiVersion: apiserver.config.k8s.io/v1
kind: AdmissionConfiguration
plugins:
  - name: PodSecurity
    configuration:
      apiVersion: pod-security.admission.config.k8s.io/v1beta1
      kind: PodSecurityConfiguration
      defaults:
        enforce: "restricted"
        enforce-version: "latest"
        audit: "restricted"
        audit-version: "latest"
        warn: "restricted"
        warn-version: "latest"
      exemptions:
        usernames: []
        runtimeClasses: []
        namespaces: [kube-system, cis-operator-system, system-upgrade]
```

3. 일반적으로 업그레이드를 수행합니다. [자동 업그레이드](./upgrades/automated.md)를 수행하는 경우 `system-upgrade-controller`가 실행되는 네임스페이스가 [파드 보안 수준](https://kubernetes.io/docs/concepts/security/pod-security-admission/#pod-security-levels)에 따라 권한이 부여된 것으로 설정되었는지 확인합니다.

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: system-upgrade
  labels:
    # This value must be privileged for the controller to run successfully.
    pod-security.kubernetes.io/enforce: privileged
    pod-security.kubernetes.io/enforce-version: v1.25
    # We are setting these to our _desired_ `enforce` level, but note that these below values can be any of the available options.
    pod-security.kubernetes.io/audit: privileged
    pod-security.kubernetes.io/audit-version: v1.25
    pod-security.kubernetes.io/warn: privileged
    pod-security.kubernetes.io/warn-version: v1.25
```

4. 업그레이드가 완료된 후, 클러스터에서 남아있는 모든 PSP 리소스를 제거합니다. 대부분의 경우, `/var/lib/rancher/k3s/server/manifests/` 내부에서 강화를 위해 사용된 사용자 정의 파일에는 PodSecurityPolicies 및 관련 RBAC 리소스가 있을 수 있습니다. 이러한 리소스를 제거하면 k3s가 자동으로 업데이트됩니다. 때때로 시간이 지난 후에 이러한 리소스가 클러스터에 남아있을 수 있으므로 수동으로 삭제해야 합니다. 이전에 [강화 가이드](./security/hardening-guide.md)를 따르면 다음과 같이 삭제할 수 있습니다:

```sh
# Get the resources associated with PSPs
$ kubectl get roles,clusterroles,rolebindings,clusterrolebindings -A | grep -i psp

# Delete those resources:
$ kubectl delete clusterrole.rbac.authorization.k8s.io/psp:restricted-psp clusterrole.rbac.authorization.k8s.io/psp:svclb-psp clusterrole.rbac.authorization.k8s.io/psp:system-unrestricted-psp clusterrolebinding.rbac.authorization.k8s.io/default:restricted-psp clusterrolebinding.rbac.authorization.k8s.io/system-unrestricted-node-psp-rolebinding && kubectl delete -n kube-system rolebinding.rbac.authorization.k8s.io/svclb-psp-rolebinding rolebinding.rbac.authorization.k8s.io/system-unrestricted-svc-acct-psp-rolebinding
```
