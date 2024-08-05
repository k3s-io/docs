---
title: 既知の問題
---
既知の問題は定期的に更新され、次のリリースで直ちに対処されない可能性のある問題についてお知らせすることを目的としています。

### Snap Docker

K3sをDockerと一緒に使用する予定がある場合、Snapパッケージ経由でインストールされたDockerは推奨されません。これは、K3sの実行に問題を引き起こすことが知られているためです。

### Iptables

iptables v1.6.1およびそれ以前のバージョンをnftablesモードで実行している場合、問題が発生する可能性があります。問題を回避するために、新しいiptables（例えば1.6.1+）を使用するか、iptablesのレガシーモードを実行することをお勧めします。

```
update-alternatives --set iptables /usr/sbin/iptables-legacy
update-alternatives --set ip6tables /usr/sbin/ip6tables-legacy
```

iptablesバージョン1.8.0-1.8.4には、K3sの失敗を引き起こす既知の問題があります。いくつかの人気のあるLinuxディストリビューションは、デフォルトでこれらのバージョンを提供しています。あるバグは重複したルールの蓄積を引き起こし、ノードのパフォーマンスと安定性に悪影響を与えます。この問題の影響を受けているかどうかを確認する方法については、[Issue #3117](https://github.com/k3s-io/k3s/issues/3117)を参照してください。

K3sには、正常に動作するiptables（v1.8.8）が含まれています。K3sを`--prefer-bundled-bin`オプションで起動するか、オペレーティングシステムからiptables/nftablesパッケージをアンインストールすることで、K3sにバンドルされたiptablesバージョンを使用させることができます。

:::info バージョンゲート

`--prefer-bundled-bin`フラグは、2022-12リリース（v1.26.0+k3s1、v1.25.5+k3s1、v1.24.9+k3s1、v1.23.15+k3s1）から利用可能です。

:::

### ルートレスモード

K3sをルートレスモードで実行することは実験的であり、いくつかの[既知の問題](./advanced.md#known-issues-with-rootless-mode)があります。

### v1.24.xからv1.25.xへのハードニングされたクラスターのアップグレード {#hardened-125}

Kubernetesは、Pod Security Standardsに置き換えるためにv1.25からPodSecurityPolicyを削除しました。PSSについての詳細は[上流のドキュメント](https://kubernetes.io/docs/concepts/security/pod-security-standards/)を参照してください。K3Sの場合、ノードに`PodSecurityPolicy`が設定されている場合、いくつかの手動ステップが必要です。

1. すべてのノードで、`kube-apiserver-arg`の値を更新して`PodSecurityPolicy`アドミッションプラグインを削除します。代わりに次の引数値を追加します：`'admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml'`、ただし、まだK3Sを再起動またはアップグレードしないでください。以下は、この更新後のノードのハードニングされた設定ファイルの例です：
```yaml
protect-kernel-defaults: true
secrets-encryption: true
kube-apiserver-arg:
  - 'admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml'
  - 'audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log'
  - 'audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml'
  - 'audit-log-maxage=30'
  - 'audit-log-maxbackup=10'
  - 'audit-log-maxsize=100'
  - 'request-timeout=300s'
  - 'service-account-lookup=true'
kube-controller-manager-arg:
  - 'terminated-pod-gc-threshold=10'
  - 'use-service-account-credentials=true'
kubelet-arg:
  - 'streaming-connection-idle-timeout=5m'
  - 'make-iptables-util-chains=true'
```
2. 次の内容で`/var/lib/rancher/k3s/server/psa.yaml`ファイルを作成します。さらに多くのネームスペースを免除することもできます。以下の例では、`kube-system`（必須）、`cis-operator-system`（オプションですが、Rancherを通じてセキュリティスキャンを実行する場合に便利）、および`system-upgrade`（[自動アップグレード](./upgrades/automated.md)を行う場合に必須）を免除しています。
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
3. 通常通りアップグレードを実行します。[自動アップグレード](./upgrades/automated.md)を行う場合、`system-upgrade-controller`ポッドが実行されているネームスペースが[Pod Securityレベル](https://kubernetes.io/docs/concepts/security/pod-security-admission/#pod-security-levels)に従って特権を持つように設定されていることを確認してください：
```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: system-upgrade
  labels:
    # コントローラーが正常に実行されるためには、この値は特権である必要があります。
    pod-security.kubernetes.io/enforce: privileged
    pod-security.kubernetes.io/enforce-version: v1.25
    # これらの値は、希望する`enforce`レベルに設定していますが、以下の値は利用可能なオプションのいずれかにすることができます。
    pod-security.kubernetes.io/audit: privileged
    pod-security.kubernetes.io/audit-version: v1.25
    pod-security.kubernetes.io/warn: privileged
    pod-security.kubernetes.io/warn-version: v1.25
```
4. アップグレードが完了したら、クラスターから残りのPSPリソースを削除します。多くの場合、`/var/lib/rancher/k3s/server/manifests/`内のカスタムファイルでハードニングに使用されるPodSecurityPoliciesおよび関連するRBACリソースが存在する可能性があります。これらのリソースを削除すると、k3sは自動的に更新されます。タイミングの関係で、これらの一部がクラスターに残る場合があるため、その場合は手動で削除する必要があります。[ハードニングガイド](./security/hardening-guide.md)が以前に従われていた場合、以下のコマンドで削除できるはずです：
```sh
# PSPに関連するリソースを取得
$ kubectl get roles,clusterroles,rolebindings,clusterrolebindings -A | grep -i psp

# これらのリソースを削除：
$ kubectl delete clusterrole.rbac.authorization.k8s.io/psp:restricted-psp clusterrole.rbac.authorization.k8s.io/psp:svclb-psp clusterrole.rbac.authorization.k8s.io/psp:system-unrestricted-psp clusterrolebinding.rbac.authorization.k8s.io/default:restricted-psp clusterrolebinding.rbac.authorization.k8s.io/system-unrestricted-node-psp-rolebinding && kubectl delete -n kube-system rolebinding.rbac.authorization.k8s.io/svclb-psp-rolebinding rolebinding.rbac.authorization.k8s.io/system-unrestricted-svc-acct-psp-rolebinding
```