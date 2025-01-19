---
title: "Cluster Híbrido ou MultiCloud Distribuído"
---

Um cluster K3s ainda pode ser implantado em nós que não compartilham uma rede privada comum e não estão conectados diretamente (por exemplo, nós em diferentes nuvens públicas). Há duas opções para conseguir isso: a solução multicloud k3s incorporada e a integração com o provedor de VPN `tailscale`.

:::warning
A latência entre nós aumentará à medida que a conectividade externa exigir mais saltos. Isso reduzirá o desempenho da rede e também poderá impactar a saúde do cluster se a latência for muito alta.
:::

:::warning
O etcd incorporado não é suportado neste tipo de implantação. Se estiver usando o etcd incorporado, todos os nós do servidor devem ser acessíveis uns aos outros por meio de seus IPs privados. Os agentes podem ser distribuídos em várias redes, mas todos os servidores devem estar no mesmo local.
:::

### Solução Multicloud K3s Incorporada

O K3s usa o wireguard para estabelecer uma malha VPN para tráfego de cluster. Cada nó deve ter um IP exclusivo por meio do qual pode ser alcançado (geralmente um IP público). O tráfego do supervisor do K3s usará um túnel websocket, e o tráfego do cluster (CNI) usará um túnel wireguard.

Para habilitar esse tipo de implantação, você deve adicionar os seguintes parâmetros nos servidores:
```bash
--node-external-ip=<SERVER_EXTERNAL_IP> --flannel-backend=wireguard-native --flannel-external-ip
```
e sobre agentes:
```bash
--node-external-ip=<AGENT_EXTERNAL_IP>
```

onde `SERVER_EXTERNAL_IP` é o IP através do qual podemos alcançar o nó do servidor e `AGENT_EXTERNAL_IP` é o IP através do qual podemos alcançar o nó do agente. Note que o parâmetro de configuração `K3S_URL` no agente deve usar o `SERVER_EXTERNAL_IP` para poder se conectar a ele. Lembre-se de verificar os [Requisitos de Rede](../installation/requirements.md#networking) e permitir acesso às portas listadas em endereços internos e externos.

Tanto `SERVER_EXTERNAL_IP` quanto `AGENT_EXTERNAL_IP` devem ter conectividade entre si e normalmente são IPs públicos.

:::info IPs Dinâmicos
Se nós forem atribuídos IPs dinâmicos e o IP mudar (por exemplo, na AWS), você deve modificar o parâmetro `--node-external-ip` para refletir o novo IP. Se estiver executando o K3s como um serviço, você deve modificar `/etc/systemd/system/k3s.service` e então executar:

```bash
systemctl daemon-reload
systemctl restart k3s
```
:::

### Integração com o provedor Tailscale VPN (experimental)

Disponível nas versões v1.27.3, v1.26.6, v1.25.11 e mais recentes.

O K3s pode ser integrado ao [Tailscale](https://tailscale.com/) para que os nós usem o serviço Tailscale VPN para construir uma malha entre os nós.

Há quatro etapas a serem executadas com o Tailscale antes de implantar o K3s:

1. Entre na sua conta Tailscale

2. Em `Configurações > Chaves`, gere uma chave de autenticação ($AUTH-KEY), que pode ser reutilizável para todos os nós do seu cluster

3. Decida o podCIDR que o cluster usará (por padrão `10.42.0.0/16`). Anexe o CIDR (ou CIDRs para dual-stack) em Controles de acesso com a stanza:
```yaml
"autoApprovers": {
        "routes": {
            "10.42.0.0/16":        ["your_account@xyz.com"],
            "2001:cafe:42::/56": ["your_account@xyz.com"],
        },
    },
```

1. Instale o Tailscale em seus nós:
```bash
curl -fsSL https://tailscale.com/install.sh | sh
```

Para implantar o K3s com a integração do Tailscale habilitada, você deve adicionar o seguinte parâmetro em cada um dos seus nós:
```bash
--vpn-auth="name=tailscale,joinKey=$AUTH-KEY
```
ou forneça essas informações em um arquivo e use o parâmetro:
```bash
--vpn-auth-file=$PATH_TO_FILE
```

Opcionalmente, se você tiver seu próprio servidor Tailscale (por exemplo, headscale), você pode se conectar a ele anexando `,controlServerURL=$URL` aos parâmetros vpn-auth.

Em seguida, você pode prosseguir para criar o servidor usando o seguinte comando:

```bash
k3s server --token <token> --vpn-auth="name=tailscale,joinKey=<joinKey>" --node-external-ip=<TailscaleIPOfServerNode>
```

Depois de executar este comando, acesse o console de administração do Tailscale para aprovar o nó e a sub-rede do Tailscale (se ainda não tiverem sido aprovados pelo autoApprovers).

Depois que o servidor estiver configurado, conecte os agentes usando:

```bash
k3s agent --token <token> --vpn-auth="name=tailscale,joinKey=<joinKey>" --server https://<TailscaleIPOfServerNode>:6443 --node-external-ip=<TailscaleIPOfAgentNode>
```

Novamente, aprove o nó e a sub-rede do Tailscale como você fez para o servidor.

Se você tiver ACLs ativadas no Tailscale, precisará adicionar uma regra "accept" para permitir que os pods se comuniquem entre si. Supondo que a chave de autenticação que você criou marque automaticamente os nós do Tailscale com a tag `testing-k3s`, a regra deve ficar assim:

```yaml
"acls": [
    {
        "action": "accept",
        "src":    ["tag:testing-k3s", "10.42.0.0/16"],
        "dst":    ["tag:testing-k3s:*", "10.42.0.0/16:*"],
    },
],
```

:::warning

Se você planeja executar vários clusters K3s usando a mesma rede tailscale, crie [ACLs](https://tailscale.com/kb/1018/acls) apropriadas para evitar conflitos de IP ou use sub-redes podCIDR diferentes para cada cluster.

:::
