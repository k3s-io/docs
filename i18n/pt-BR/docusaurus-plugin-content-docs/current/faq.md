---
title: FAQ
---

As Perguntas Frequentes são atualizadas periodicamente e projetadas para responder às perguntas mais frequentes dos nossos usuários sobre os K3s.

### O K3s é uma substituição adequada para o Kubernetes?

K3s é uma distribuição Kubernetes certificada pela CNCF e pode fazer tudo o que é necessário para um cluster Kubernetes padrão. É apenas uma versão mais leve. Veja a página de documentação [main](./introduction.md) para mais detalhes.

### Como posso usar meu próprio Ingress em vez do Traefik?

Basta iniciar o servidor K3s com `--disable=traefik` e implantar seu ingress.

### O K3s é compatível com Windows?

No momento, o K3s não oferece suporte nativo ao Windows, mas estamos abertos a essa ideia no futuro.

### O que exatamente são Servers e Agents?

Para uma análise dos componentes que compõem um servidor e um agente, consulte a [página Arquitetura](./architecture.md).

### Como posso compilar a partir do código-fonte?

Consulte o K3s [BUILDING.md](https://github.com/k3s-io/k3s/blob/master/BUILDING.md) com instruções.

### Onde estão os logs do K3s?

A localização dos logs do K3s varia dependendo de como você executa o K3s e do sistema operacional do nó.

* Quando executado a partir da linha de comando, os logs são enviados para stdout e stderr.
* Quando executado sob openrc, os logs serão criados em `/var/log/k3s.log`.
* Quando executado sob Systemd, os logs serão enviados para Journald e podem ser visualizados usando `journalctl -u k3s`.
* Os logs do pod podem ser encontrados em `/var/log/pods`.
* Os logs do Containerd podem ser encontrados em `/var/lib/rancher/k3s/agent/containerd/containerd.log`.

Você pode gerar logs mais detalhados usando o sinalizador `--debug` ao iniciar o K3s (ou `debug: true` no arquivo de configuração).

O Kubernetes usa uma estrutura de registro conhecida como `klog`, que usa uma única configuração de registro para todos os componentes dentro de um processo.
Como o K3s executa todos os componentes do Kubernetes dentro de um único processo, não é possível configurar diferentes níveis de registro ou destinos para componentes individuais do Kubernetes.
O uso dos argumentos de componente `-v=<level>` ou `--vmodule=<module>=<level>` provavelmente não terá o efeito desejado.

Veja [Fontes Adicionais de Log](./advanced.md#additional-logging-sources) para ainda mais opções de registro.

### Posso executar o K3s no Docker?

Sim, há várias maneiras de executar K3s no Docker. Veja [Opções avançadas](./advanced.md#running-k3s-in-docker) para mais detalhes.

### Qual é a diferença entre os Tokens de Servidor e de Agente do K3s?

Para mais informações sobre como gerenciar os tokens de junção do K3s, consulte a [documentação do comando `k3s token`](./cli/token.md).

### Quão compatíveis são as diferentes versões do K3s?

Em geral, aplica-se a [política de variação de versão do Kubernetes](https://kubernetes.io/releases/version-skew-policy/).

Resumindo, os servidores podem ser mais novos que os agentes, mas os agentes não podem ser mais novos que os servidores.

### Estou com um problema. Onde posso obter ajuda?

Se você estiver tendo problemas com a implantação de K3s, você deve:

1) Verifique a página [Problemas conhecidos](./known-issues.md).

2) Verifique se você resolveu qualquer [Preparação adicional do SO](./installation/requirements.md#operating-systems). Execute `k3s check-config` e certifique-se de que ele passe.

3) Pesquise os [Problemas](https://github.com/k3s-io/k3s/issues) e [Discussões](https://github.com/k3s-io/k3s/discussions) do K3s para encontrar um que corresponda ao seu problema.

<!--lint disable no-dead-urls-->
4) Entre no canal [Rancher Slack](https://slack.rancher.io/) do K3s para obter ajuda.

5) Envie um [Novo problema](https://github.com/k3s-io/k3s/issues/new/choose) no K3s Github descrevendo sua configuração e o problema que você está enfrentando.
