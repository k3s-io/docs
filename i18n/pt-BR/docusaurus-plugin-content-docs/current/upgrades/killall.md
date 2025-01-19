---
title: Parando K3s
---


Para permitir alta disponibilidade durante atualizações, os contêineres K3s continuam em execução quando o serviço K3s é interrompido.


## Serviço K3s

Parar e reiniciar o K3s é suportado pelo script de instalação do systemd e do OpenRC.

<Tabs>
<TabItem value="systemd">

Parando servidor:
```sh
sudo systemctl stop k3s
```

Reiniciando servidor:
```sh
sudo systemctl start k3s
```

Parando agentes:
```sh
sudo systemctl stop k3s-agent
```

Reiniciando agentes:
```sh
sudo systemctl start k3s-agent
```

</TabItem>
<TabItem value="OpenRC">

Parando servidor:
```sh
sudo rc-service k3s stop
```

Reiniciando servidor:
```sh
sudo rc-service k3s restart
```

Parando agentes:
```sh
sudo rc-service k3s-agent stop
```

Reiniciando agentes:
```sh
sudo rc-service k3s-agent restart
```

</TabItem>
</Tabs>


## Killall Script

Para parar todos os contêineres K3s e redefinir o estado do contêiner, o script `k3s-killall.sh` pode ser usado.

O script killall limpa contêineres, diretórios K3s e componentes de rede, além de remover a cadeia iptables com todas as regras associadas. Os dados do cluster não serão excluídos.

Para executar o script killall de um nó de servidor, execute:

```bash
/usr/local/bin/k3s-killall.sh
```