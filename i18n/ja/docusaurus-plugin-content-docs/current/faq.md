---
title: FAQ
---

FAQは定期的に更新され、K3sに関してユーザーが最も頻繁に尋ねる質問に答えるために設計されています。

### K3sはKubernetesの代替として適していますか？

K3sはCNCF認定のKubernetesディストリビューションであり、標準的なKubernetesクラスターに必要なすべてのことを実行できます。ただし、より軽量なバージョンです。詳細については[メイン](./introduction.md)ドキュメントページを参照してください。

### Traefikの代わりに自分のIngressを使用するにはどうすればよいですか？

単にK3sサーバーを`--disable=traefik`オプションで起動し、Ingressをデプロイしてください。

### K3sはWindowsをサポートしていますか？

現時点ではK3sはネイティブにWindowsをサポートしていませんが、将来的にはその可能性を検討しています。

### サーバーとエージェントとは具体的に何ですか？

サーバーとエージェントを構成するコンポーネントの詳細については、[アーキテクチャページ](./architecture.md)を参照してください。

### ソースからビルドするにはどうすればよいですか？

K3sの[BUILDING.md](https://github.com/k3s-io/k3s/blob/master/BUILDING.md)を参照してください。

### K3sのログはどこにありますか？

K3sのログの場所は、K3sの実行方法やノードのOSによって異なります。

* コマンドラインから実行する場合、ログはstdoutとstderrに送信されます。
* openrcで実行する場合、ログは`/var/log/k3s.log`に作成されます。
* Systemdで実行する場合、ログはJournaldに送信され、`journalctl -u k3s`で表示できます。
* Podのログは`/var/log/pods`にあります。
* Containerdのログは`/var/lib/rancher/k3s/agent/containerd/containerd.log`にあります。

K3sを起動する際に`--debug`フラグ（または設定ファイルで`debug: true`）を使用すると、より詳細なログを生成できます。

Kubernetesは`klog`というロギングフレームワークを使用しており、プロセス内のすべてのコンポーネントに対して単一のロギング設定を使用します。K3sはすべてのKubernetesコンポーネントを単一のプロセス内で実行するため、個々のKubernetesコンポーネントに対して異なるログレベルや出力先を設定することはできません。`-v=<level>`や`--vmodule=<module>=<level>`のコンポーネント引数を使用しても、期待通りの効果は得られない可能性があります。

さらに多くのログオプションについては、[追加のログソース](./advanced.md#additional-logging-sources)を参照してください。

### DockerでK3sを実行できますか？

はい、DockerでK3sを実行する方法はいくつかあります。詳細については[高度なオプション](./advanced.md#running-k3s-in-docker)を参照してください。

### K3sサーバーとエージェントトークンの違いは何ですか？

K3sの参加トークンの管理に関する詳細は、[`k3s token`コマンドのドキュメント](./cli/token.md)を参照してください。

### 異なるバージョンのK3sの互換性はどの程度ですか？

一般的に、[Kubernetesのバージョンスキューポリシー](https://kubernetes.io/docs/setup/release/version-skew-policy/)が適用されます。

簡単に言えば、サーバーはエージェントより新しいバージョンであることができますが、エージェントはサーバーより新しいバージョンであってはなりません。

### 問題が発生した場合、どこで助けを得られますか？

K3sのデプロイに問題がある場合は、以下を行ってください：

1) [既知の問題](./known-issues.md)ページを確認してください。

2) [追加のOS準備](./installation/requirements.md#operating-systems)が解決されていることを確認してください。`k3s check-config`を実行し、パスすることを確認してください。

3) K3sの[Issues](https://github.com/k3s-io/k3s/issues)および[Discussions](https://github.com/k3s-io/k3s/discussions)で、問題に一致するものを検索してください。

<!--lint disable no-dead-urls-->
4) [Rancher Slack](https://slack.rancher.io/)のK3sチャンネルに参加して助けを求めてください。

5) K3s Githubに[新しいIssue](https://github.com/k3s-io/k3s/issues/new/choose)を提出し、セットアップと発生している問題を説明してください。