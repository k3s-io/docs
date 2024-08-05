---
title: "自動アップグレード"
---

### 概要

Rancherのsystem-upgrade-controllerを使用してK3sクラスターのアップグレードを管理できます。これはKubernetesネイティブのクラスターアップグレードアプローチです。これには、[カスタムリソース定義（CRD）](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/#custom-resources)、`plan`、および[コントローラー](https://kubernetes.io/docs/concepts/architecture/controller/)が含まれます。

プランはアップグレードポリシーと要件を定義します。また、[ラベルセレクター](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/)を使用して、どのノードをアップグレードするかを定義します。K3sクラスターのアップグレードに適したデフォルト設定のプランについては、以下を参照してください。より高度なプラン設定オプションについては、[CRD](https://github.com/rancher/system-upgrade-controller/blob/master/pkg/apis/upgrade.cattle.io/v1/types.go)を確認してください。

コントローラーはプランを監視し、アップグレード[ジョブ](https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/)を実行するノードを選択してアップグレードをスケジュールします。ジョブが正常に完了すると、コントローラーは実行されたノードにラベルを付けます。

:::note 
起動されるアップグレードジョブは高い特権を持つ必要があります。以下の設定が必要です：
- ホストの`IPC`、`NET`、および`PID`ネームスペース
- `CAP_SYS_BOOT`キャパビリティ
- 読み書き権限を持つホストルートが`/host`にマウントされていること

:::

この方法でアップグレードを自動化するには、以下の手順を実行する必要があります：

1. クラスターにsystem-upgrade-controllerをインストールする
1. プランを設定する

:::warning
K3sクラスターがRancherによって管理されている場合、アップグレードの管理にはRancher UIを使用する必要があります。
- K3sクラスターがRancherにインポートされた場合、Rancherはsystem-upgrade-controllerのデプロイメントとプランを管理します。このページの手順に従わないでください。
- K3sクラスターがRancherによってプロビジョニングされた場合、Rancherはバージョンアップグレードを管理するためにシステムエージェントを使用します。このページの手順に従わないでください。
- K3sクラスターがRancherによって管理されていない場合、以下の手順に従ってください。

:::

system-upgrade-controllerの設計とアーキテクチャ、またはK3sとの統合の詳細については、以下のGitリポジトリを参照してください：

- [system-upgrade-controller](https://github.com/rancher/system-upgrade-controller)
- [k3s-upgrade](https://github.com/k3s-io/k3s-upgrade)

:::tip
K3sの新しいバージョンにアップグレードする際には、[Kubernetesバージョンスキューポリシー](https://kubernetes.io/docs/setup/release/version-skew-policy/)が適用されます。アップグレード時に中間のマイナーバージョンをスキップしないようにプランを設定してください。system-upgrade-controller自体は、Kubernetesバージョンのサポートされていない変更を防ぎません。
:::

### system-upgrade-controllerのインストール

system-upgrade-controllerはクラスターにデプロイメントとしてインストールできます。デプロイメントにはサービスアカウント、clusterRoleBinding、およびconfigmapが必要です。これらのコンポーネントをインストールするには、以下のコマンドを実行します：

```bash
kubectl apply -f https://github.com/rancher/system-upgrade-controller/releases/latest/download/system-upgrade-controller.yaml
```
コントローラーは前述のconfigmapを介して設定およびカスタマイズできますが、変更を適用するにはコントローラーを再デプロイする必要があります。

プランを適用できるようにするためには、system-upgrade-controller CRDをデプロイする必要があります：

```bash
kubectl apply -f https://github.com/rancher/system-upgrade-controller/releases/latest/download/crd.yaml
```

### プランの設定
少なくとも2つのプランを作成することをお勧めします：サーバー（コントロールプレーン）ノードをアップグレードするプランと、エージェントノードをアップグレードするプランです。必要に応じて追加のプランを作成し、ノード全体のアップグレードの展開を制御できます。プランが作成されると、コントローラーはそれを検出し、クラスターのアップグレードを開始します。

以下の2つの例プランは、クラスターをK3s v1.24.6+k3s1にアップグレードします：

```yaml
# サーバープラン
apiVersion: upgrade.cattle.io/v1
kind: Plan
metadata:
  name: server-plan
  namespace: system-upgrade
spec:
  concurrency: 1
  cordon: true
  nodeSelector:
    matchExpressions:
    - key: node-role.kubernetes.io/control-plane
      operator: In
      values:
      - "true"
  serviceAccountName: system-upgrade
  upgrade:
    image: rancher/k3s-upgrade
  version: v1.24.6+k3s1
---
# エージェントプラン
apiVersion: upgrade.cattle.io/v1
kind: Plan
metadata:
  name: agent-plan
  namespace: system-upgrade
spec:
  concurrency: 1
  cordon: true
  nodeSelector:
    matchExpressions:
    - key: node-role.kubernetes.io/control-plane
      operator: DoesNotExist
  prepare:
    args:
    - prepare
    - server-plan
    image: rancher/k3s-upgrade
  serviceAccountName: system-upgrade
  upgrade:
    image: rancher/k3s-upgrade
  version: v1.24.6+k3s1
```

これらのプランに関して重要な点をいくつか挙げます：

1) プランはコントローラーがデプロイされたのと同じネームスペースに作成する必要があります。

2) `concurrency`フィールドは、同時にアップグレードできるノードの数を示します。

3) server-planは`node-role.kubernetes.io/control-plane`ラベルを持つノードを選択するラベルセレクターを指定してサーバーノードをターゲットにします。agent-planはそのラベルを持たないノードを選択するラベルセレクターを指定してエージェントノードをターゲットにします。

4) agent-planの`prepare`ステップは、そのプランのアップグレードジョブがserver-planの完了を待ってから実行されるようにします。

5) 両方のプランには`version`フィールドがv1.24.6+k3s1に設定されています。代わりに`version`フィールドを省略し、`channel`フィールドをK3sのリリースに解決されるURLに設定することもできます。これにより、コントローラーはそのURLを監視し、新しいリリースに解決されるたびにクラスターをアップグレードします。これは[リリースチャンネル](manual.md#release-channels)とよく連携します。したがって、次のチャンネルでプランを設定して、クラスターが常に最新の安定版K3sリリースに自動的にアップグレードされるようにすることができます：
```yaml
apiVersion: upgrade.cattle.io/v1
kind: Plan
...
spec:
  ...
  channel: https://update.k3s.io/v1-release/channels/stable

```

述べたように、プランが作成されるとコントローラーがそれを検出し、アップグレードが開始されます。プランを更新すると、コントローラーはプランを再評価し、別のアップグレードが必要かどうかを判断します。

kubectlを使用してプランとジョブを表示することで、アップグレードの進行状況を監視できます：
```bash
kubectl -n system-upgrade get plans -o yaml
kubectl -n system-upgrade get jobs -o yaml
```

## ダウングレード防止

:::info バージョンゲート
2023年7月のリリース（[v1.27.4+k3s1](https://github.com/k3s-io/k3s-upgrade/releases/tag/v1.27.4%2Bk3s1)、[v1.26.7+k3s1](https://github.com/k3s-io/k3s-upgrade/releases/tag/v1.26.7%2Bk3s1)、[v1.25.12+k3s1](https://github.com/k3s-io/k3s-upgrade/releases/tag/v1.25.12%2Bk3s1)、[v1.24.16+k3s1](https://github.com/k3s-io/k3s-upgrade/releases/tag/v1.24.16%2Bk3s1)）から適用されます。
:::

Kubernetesはコントロールプレーンコンポーネントのダウングレードをサポートしていません。アップグレードプランで使用されるk3s-upgradeイメージはK3sのダウングレードを拒否し、プランが失敗し、ノードがコードンされたままになります。

以下は、失敗したアップグレードポッドとコードンされたノードを示す例です：

```console
ubuntu@user:~$ kubectl get pods -n system-upgrade
NAME                                                              READY   STATUS    RESTARTS   AGE
apply-k3s-server-on-ip-172-31-0-16-with-7af95590a5af8e8c3-2cdc6   0/1     Error     0          9m25s
apply-k3s-server-on-ip-172-31-10-23-with-7af95590a5af8e8c-9xvwg   0/1     Error     0          14m
apply-k3s-server-on-ip-172-31-13-213-with-7af95590a5af8e8-8j72v   0/1     Error     0          18m
system-upgrade-controller-7c4b84d5d9-kkzr6                        1/1     Running   0          20m
ubuntu@user:~$ kubectl get nodes
NAME               STATUS                     ROLES                       AGE   VERSION
ip-172-31-0-16     Ready,SchedulingDisabled   control-plane,etcd,master   19h   v1.27.4+k3s1
ip-172-31-10-23    Ready,SchedulingDisabled   control-plane,etcd,master   19h   v1.27.4+k3s1
ip-172-31-13-213   Ready,SchedulingDisabled   control-plane,etcd,master   19h   v1.27.4+k3s1
ip-172-31-2-13     Ready                      <none>                      19h   v1.27.4+k3s1
```
コードンされたノードをサービスに戻すには、次のいずれかの方法を使用します：
* プランのバージョンまたはチャンネルを変更して、クラスターで現在実行されているものと同じかそれ以上のリリースをターゲットにし、プランが成功するようにします。
* プランを削除し、ノードを手動でアンコードンします。
  `kubectl get plan -n system-upgrade`を使用してプラン名を見つけ、`kubectl delete plan -n system-upgrade PLAN_NAME`を使用してプランを削除します。プランが削除されたら、`kubectl uncordon NODE_NAME`を使用して各ノードをアンコードンします。