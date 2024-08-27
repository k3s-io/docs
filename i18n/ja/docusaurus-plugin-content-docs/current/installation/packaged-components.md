---
title: "パッケージ化されたコンポーネントの管理"
---

## マニフェストの自動デプロイ (AddOns)

サーバーノード上では、`/var/lib/rancher/k3s/server/manifests` にあるファイルは、起動時およびディスク上のファイルが変更されたときに、`kubectl apply` に似た方法で自動的にKubernetesにデプロイされます。このディレクトリからファイルを削除しても、対応するリソースはクラスターから削除されません。

マニフェストは `kube-system` ネームスペースの `AddOn` カスタムリソースとして追跡されます。マニフェストファイルの適用時に発生したエラーや警告は、対応する `AddOn` に対して `kubectl describe` を使用するか、`kubectl get event -n kube-system` を使用してそのネームスペースのすべてのイベントを表示することで確認できます。

### パッケージ化されたコンポーネント

K3sには、`coredns`、`traefik`、`local-storage`、および `metrics-server` など、マニフェストディレクトリを介してAddOnsとしてデプロイされる多数のパッケージ化されたコンポーネントが付属しています。組み込みの `servicelb` ロードバランサーコントローラーにはマニフェストファイルがありませんが、歴史的な理由から `AddOn` として無効にすることができます。

パッケージ化されたコンポーネントのマニフェストはK3sによって管理されており、変更しないでください。これらのファイルはK3sが起動するたびにディスクに再書き込みされ、その整合性が確保されます。

### ユーザーAddOns

追加のファイルをマニフェストディレクトリに配置して `AddOn` としてデプロイすることができます。各ファイルには、`---` YAMLドキュメントセパレーターで区切られた複数のKubernetesリソースを含めることができます。マニフェスト内のリソースの整理に関する詳細は、Kubernetesドキュメントの[リソース管理](https://kubernetes.io/docs/concepts/cluster-administration/manage-deployment/)セクションを参照してください。

#### ファイル命名要件

マニフェストディレクトリ内の各ファイルの `AddOn` 名は、ファイルのベース名から派生します。マニフェストディレクトリ内（またはサブディレクトリ内）のすべてのファイルが一意の名前を持ち、Kubernetesの[オブジェクト命名制限](https://kubernetes.io/docs/concepts/overview/working-with-objects/names/)に従うようにしてください。デフォルトのK3sパッケージ化コンポーネントで使用されている名前と競合しないようにも注意が必要です。

ファイル名にアンダースコアが含まれている場合に報告されるエラーの例を以下に示します：
> `Failed to process config: failed to process /var/lib/rancher/k3s/server/manifests/example_manifest.yaml:
   Addon.k3s.cattle.io "example_manifest" is invalid: metadata.name: Invalid value: "example_manifest": 
   a lowercase RFC 1123 subdomain must consist of lower case alphanumeric characters, '-' or '.', and must start and end with an alphanumeric character
   (e.g. 'example.com', regex used for validation is '[a-z0-9]([-a-z0-9]*[a-z0-9])?(\\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*')`

:::danger
複数のサーバーノードがあり、複数のサーバーに追加のAddOnマニフェストを配置する場合、ファイルがこれらのノード間で同期されることを保証するのはあなたの責任です。K3sはノード間でAddOnの内容を同期せず、異なるサーバーが競合するマニフェストをデプロイしようとした場合の正しい動作を保証できません。
:::

## マニフェストの無効化

マニフェストディレクトリから特定のコンテンツのデプロイを無効にする方法は2つあります。

### `--disable` フラグを使用する

上記のパッケージ化されたコンポーネントのAddOnsに加えて、`manifests` ディレクトリに配置された追加のマニフェストのAddOnsは、`--disable` フラグを使用して無効にできます。無効にされたAddOnsはクラスターから積極的にアンインストールされ、ソースファイルは `manifests` ディレクトリから削除されます。

例えば、新しいクラスターにtraefikをインストールしないようにするか、既存のクラスターからアンインストールしてマニフェストを削除するには、`--disable=traefik` を使用してK3sを起動します。複数の項目を無効にするには、名前をカンマで区切るか、フラグを繰り返して使用します。

### .skipファイルを使用する

`/var/lib/rancher/k3s/server/manifests` 配下の任意のファイルに対して、対応するマニフェストをK3sが無視するようにする `.skip` ファイルを作成できます。`.skip` ファイルの内容は関係なく、その存在のみがチェックされます。AddOnが既に作成された後に `.skip` ファイルを作成しても、それを削除または変更することはなく、リソースも変更されません。ファイルは存在しないものとして扱われます。

例えば、K3sが初めて起動する前にマニフェストディレクトリに空の `traefik.yaml.skip` ファイルを作成すると、K3sは `traefik.yaml` のデプロイをスキップします：
```bash
$ ls /var/lib/rancher/k3s/server/manifests
ccm.yaml      local-storage.yaml  rolebindings.yaml  traefik.yaml.skip
coredns.yaml  traefik.yaml

$ kubectl get pods -A
NAMESPACE     NAME                                     READY   STATUS    RESTARTS   AGE
kube-system   local-path-provisioner-64ffb68fd-xx98j   1/1     Running   0          74s
kube-system   metrics-server-5489f84d5d-7zwkt          1/1     Running   0          74s
kube-system   coredns-85cb69466-vcq7j                  1/1     Running   0          74s
```

`traefik.skip` ファイルを作成する前にTraefikが既にデプロイされていた場合、Traefikはそのまま残り、K3sがアップグレードされたときに将来の更新に影響を受けません。

## Helm AddOns

自動デプロイマニフェストを介してHelmチャートを管理する方法については、[Helm](../helm.md)セクションを参照してください。