---
title: Desinstalando o K3s
---

:::warning
Desinstalar o K3s pode causar perda de dados!
:::

Se você instalou o K3s usando o script de instalação, um script para desinstalar o K3s foi gerado durante a instalação.

Executar o script de desinstalação interrompe o K3s e todos os pods em execução, além de excluir o banco de dados do cluster local, os dados de volumes persistentes do [armazenamento local](../storage.md#setting-up-the-local-storage-provider), a configuração do nó e todos os scripts e ferramentas de linha de comando.

Ele não remove nenhum dado de bancos de dados externos ou criado por pods que utilizam volumes persistentes externos do Kubernetes.

Se você planeja reconectar um nó a um cluster existente após desinstalar e reinstalar, certifique-se de excluir o nó do cluster para garantir que o segredo de senha do nó seja removido. Consulte a documentação sobre [Registro de Nós](../architecture.md#how-agent-node-registration-works) para mais informações.

### Desinstalando Servidores
Para desinstalar o K3s de um nó de servidor, execute:

```bash
/usr/local/bin/k3s-uninstall.sh
```

### Desinstalando Agentes
Para desinstalar o K3s de um nó de agente, execute:

```bash
/usr/local/bin/k3s-agent-uninstall.sh
```
