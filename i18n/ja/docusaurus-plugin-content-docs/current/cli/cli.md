---
title: CLIツール
---

K3sバイナリには、クラスターを管理するための追加ツールが多数含まれています。

コマンド | 説明
--------|------------------
`k3s server`| K3sサーバーノードを実行し、Kubernetesの`apiserver`、`scheduler`、`controller-manager`、および`cloud-controller-manager`コンポーネントに加えて、データストアとエージェントコンポーネントを起動します。詳細は[`k3s server`コマンドのドキュメント](server.md)を参照してください。
`k3s agent`| K3sエージェントノードを実行し、`containerd`、`flannel`、`kube-router`ネットワークポリシーコントローラー、およびKubernetesの`kubelet`と`kube-proxy`コンポーネントを起動します。詳細は[`k3s agent`コマンドのドキュメント](agent.md)を参照してください。
`k3s kubectl`| 組み込みの[`kubectl`コマンド](https://kubernetes.io/docs/reference/kubectl)を実行します。これはKubernetesのapiserverと対話するためのCLIです。`KUBECONFIG`環境変数が設定されていない場合、自動的に`/etc/rancher/k3s/k3s.yaml`のkubeconfigを使用しようとします。
`k3s crictl`| 組み込みの[`crictl`コマンド](https://github.com/kubernetes-sigs/cri-tools/blob/master/docs/crictl.md)を実行します。これはKubernetesのコンテナランタイムインターフェース（CRI）と対話するためのCLIです。デバッグに便利です。
`k3s ctr`| 組み込みの[`ctr`コマンド](https://github.com/projectatomic/containerd/blob/master/docs/cli.md)を実行します。これはK3sで使用されるコンテナデーモンであるcontainerdのCLIです。デバッグに便利です。
`k3s token` | ブートストラップトークンを管理します。詳細は[`k3s token`コマンドのドキュメント](token.md)を参照してください。
`k3s etcd-snapshot` | K3sクラスターのデータのオンデマンドバックアップを実行し、S3にアップロードします。詳細は[`k3s etcd-snapshot`コマンドのドキュメント](etcd-snapshot.md)を参照してください。
`k3s secrets-encrypt` | K3sを構成して、クラスターに保存する際にシークレットを暗号化します。詳細は[`k3s secrets-encrypt`コマンドのドキュメント](secrets-encrypt.md)を参照してください。
`k3s certificate` | K3s証明書を管理します。詳細は[`k3s certificate`コマンドのドキュメント](certificate.md)を参照してください。
`k3s completion` | k3sのシェル補完スクリプトを生成します。
`k3s help`| コマンドのリストまたは1つのコマンドのヘルプを表示します。