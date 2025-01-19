---
title: "Flag Depreciação"
---

O K3s é um projeto de rápido desenvolvimento e, como tal, precisamos de uma maneira de descontinuar sinalizadores e opções de configuração. Esta página descreve o processo para descontinuar sinalizadores e opções de configuração. Para garantir que os usuários não sejam surpreendidos pela remoção de sinalizadores, o processo é semelhante à [Política de Descontinuação do Kubernetes](https://kubernetes.io/docs/reference/using-api/deprecation-policy/).

## Processo

1) Os sinalizadores podem ser declarados como "To Be Deprecated" a qualquer momento.
2) Os sinalizadores que são "To Be Deprecated" devem ser rotulados como tal no próximo patch de todas as versões suportadas atualmente. Além disso, o sinalizador começará a avisar os usuários que ele será descontinuado na próxima versão secundária.
3) Na próxima versão secundária, um sinalizador será marcado como descontinuado na documentação e convertido em um sinalizador oculto no código. O sinalizador continuará a operar e a dar avisos aos usuários.
4) Na ramificação da versão secundária seguinte, os sinalizadores descontinuados se tornarão "não operacionais", causando um erro fatal se usados. Este erro deve explicar ao usuário quaisquer novos sinalizadores ou configurações que substituam este sinalizador.
5) Na próxima versão secundária, os sinalizadores não operacionais serão removidos da documentação e do código.

## Exemplo

Um exemplo do processo:

- `--foo` existe em v1.22.14, v1.23.10 e v1.24.2.
- Após o lançamento da v1.24.2, foi decidido descontinuar `--foo` em favor de `--new-foo`.
- Em v1.22.15, v1.23.11 e v1.24.3, `--foo` continua existindo, mas avisará os usuários:
    ```
    [Aviso] --foo será descontinuado em v1.25.0, use `--new-foo` em vez disso
    ```
`--foo` continuará existindo como um sinalizador operacional durante a vida útil de v1.22, v1.23 e v1.24.
- Em v1.25.0, `--foo` é marcado como descontinuado na documentação e ficará oculto no código. Ele continuará funcionando e avisará os usuários para mudarem para `--new-foo`.
- Na v1.26.0, `--foo` causará um erro fatal se usado. A mensagem de erro dirá:
    ```
    [Fatal] exit 1: --foo não é mais suportado, use --new-foo em vez disso
    ```
- Na v1.27.0, `--foo` será removido completamente de todo o código e documentação.
