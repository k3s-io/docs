---
title: "Atualizações"
---

### Atualizando seu Cluster K3s

[Manual Upgrades](manual.md) descreve várias técnicas para atualizar seu cluster manualmente. Ele também pode ser usado como base para atualização por meio de ferramentas de infraestrutura como código de terceiros, como [Terraform](https://www.terraform.io/).

[Atualizações automatizadas](automated.md) descreve como executar atualizações automatizadas nativas do Kubernetes usando o [system-upgrade-controller](https://github.com/rancher/system-upgrade-controller) do Rancher.

### Advertências Específicas da Versão

- **Traefik:** Se o Traefik não estiver desabilitado, as versões 1.20 e anteriores do K3s instalarão o Traefik v1, enquanto as versões 1.21 e posteriores do K3s instalarão o Traefik v2, se o v1 ainda não estiver presente. Para atualizar do Traefik v1 mais antigo para o Traefik v2, consulte a [documentação do Traefik](https://doc.traefik.io/traefik/migration/v1-to-v2/) e use a [ferramenta de migração](https://github.com/traefik/traefik-migration-tool).

- **Dados de bootstrap do K3s:** Se você estiver usando o K3s em uma configuração de HA com um armazenamento de dados SQL externo, e os nós do seu servidor (plano de controle) não foram iniciados com o sinalizador CLI `--token`, você não poderá mais adicionar servidores K3s adicionais ao cluster sem especificar o token. Certifique-se de manter uma cópia deste token, pois ele é necessário ao restaurar a partir do backup. Anteriormente, o K3s não impunha o uso de um token ao usar armazenamentos de dados SQL externos.
  - As versões afetadas são &lt;= v1.19.12+k3s1, v1.20.8+k3s1, v1.21.2+k3s1; as versões corrigidas são v1.19.13+k3s1, v1.20.9+k3s1, v1.21.3+k3s1.

- Você pode recuperar o valor do token de qualquer servidor já associado ao cluster da seguinte maneira:
```bash
cat /var/lib/rancher/k3s/server/token
```
