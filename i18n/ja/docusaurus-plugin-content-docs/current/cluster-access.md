---
title: クラスターアクセス
---

`/etc/rancher/k3s/k3s.yaml` に保存されている kubeconfig ファイルは、Kubernetes クラスターへのアクセスを構成するために使用されます。kubectl や helm などの上流の Kubernetes コマンドラインツールをインストールしている場合は、正しい kubeconfig パスでそれらを構成する必要があります。これは、`KUBECONFIG` 環境変数をエクスポートするか、`--kubeconfig` コマンドラインフラグを使用して行うことができます。詳細は以下の例を参照してください。

KUBECONFIG 環境変数を利用する方法:

```bash
export KUBECONFIG=/etc/rancher/k3s/k3s.yaml
kubectl get pods --all-namespaces
helm ls --all-namespaces
```

または、コマンドで kubeconfig ファイルの場所を指定する方法:

```bash
kubectl --kubeconfig /etc/rancher/k3s/k3s.yaml get pods --all-namespaces
helm --kubeconfig /etc/rancher/k3s/k3s.yaml ls --all-namespaces
```

### kubectl を使用して外部からクラスターにアクセスする

クラスター外にあるマシンに `/etc/rancher/k3s/k3s.yaml` を `~/.kube/config` としてコピーします。その後、`server` フィールドの値を K3s サーバーの IP または名前に置き換えます。これで `kubectl` は K3s クラスターを管理できるようになります。