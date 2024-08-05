---
title: "アップグレード"
---

### K3s クラスターのアップグレード

[手動アップグレード](manual.md)では、クラスターを手動でアップグレードするためのいくつかの技術について説明しています。また、[Terraform](https://www.terraform.io/)のようなサードパーティのInfrastructure-as-Codeツールを使用してアップグレードするための基礎としても使用できます。

[自動アップグレード](automated.md)では、Rancherの[system-upgrade-controller](https://github.com/rancher/system-upgrade-controller)を使用してKubernetesネイティブの自動アップグレードを実行する方法について説明しています。

### バージョン固有の注意点

- **Traefik:** Traefikが無効化されていない場合、K3sバージョン1.20以前ではTraefik v1がインストールされ、K3sバージョン1.21以降ではv1が存在しない場合にTraefik v2がインストールされます。古いTraefik v1からTraefik v2にアップグレードするには、[Traefikのドキュメント](https://doc.traefik.io/traefik/migration/v1-to-v2/)を参照し、[移行ツール](https://github.com/traefik/traefik-migration-tool)を使用してください。

- **K3sブートストラップデータ:** 外部SQLデータストアを使用したHA構成でK3sを使用している場合、サーバー（コントロールプレーン）ノードが`--token` CLIフラグを使用して起動されていないと、トークンを指定せずに追加のK3sサーバーをクラスターに追加することができなくなります。このトークンのコピーを保持しておくことが重要です。バックアップから復元する際に必要です。以前は、外部SQLデータストアを使用する場合、K3sはトークンの使用を強制していませんでした。
    - 影響を受けるバージョンは &lt;= v1.19.12+k3s1, v1.20.8+k3s1, v1.21.2+k3s1; 修正されたバージョンは v1.19.13+k3s1, v1.20.9+k3s1, v1.21.3+k3s1 です。

    - クラスターに既に参加している任意のサーバーからトークン値を取得するには、以下のコマンドを実行します:
```bash
cat /var/lib/rancher/k3s/server/token
```