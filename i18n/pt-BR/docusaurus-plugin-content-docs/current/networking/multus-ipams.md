---
title: "Plugins Multus e IPAM"
---

[Multus CNI](https://github.com/k8snetworkplumbingwg/multus-cni) é um plugin CNI que permite anexar múltiplas interfaces de rede a pods. O Multus não substitui plugins CNI, em vez disso, ele atua como um multiplexador de plugins CNI. O Multus é útil em certos casos de uso, especialmente quando os pods são intensivos em rede e exigem interfaces de rede extras que suportam técnicas de aceleração de plano de dados, como SR-IOV.

Para obter mais informações sobre o Multus, consulte a documentação [multus-cni](https://github.com/k8snetworkplumbingwg/multus-cni/tree/master/docs).

O Multus não pode ser implantado de forma independente. Ele sempre requer pelo menos um plugin CNI convencional que atenda aos requisitos de rede do cluster Kubernetes. Esse plugin CNI se torna o padrão para o Multus e será usado para fornecer a interface primária para todos os pods. Ao implantar K3s com opções padrão, esse plugin CNI é o Flannel.

:::info Nota de Versão
O K3s usa um caminho binário CNI fixo a partir das versões de outubro de 2024: v1.28.15+k3s1, v1.29.10+k3s1, v1.30.6+k3s1, v1.31.2+k3s1.
:::

O K3s olha para `$DATA_DIR/data/cni` para binários de plug-ins CNI. Por padrão, é `/var/lib/rancher/k3s/data/cni`. Plug-ins CNI adicionais devem ser instalados neste local.

Antes dos lançamentos de outubro de 2024, os binários CNI faziam parte do pacote de espaço do usuário do K3s em `$DATA_DIR/data/$HASH/bin`, onde o hash é exclusivo para cada lançamento do K3s.
Isso dificultava a implantação de plug-ins CNI adicionais, pois o caminho mudava toda vez que o K3s era atualizado.
Se estiver implantando o Multus em uma versão mais antiga do K3s, você deve usar `/var/lib/rancher/k3s/data/current/bin/` como o diretório bin do CNI, mas espere que os plug-ins precisem ser reimplantados sempre que o K3s for atualizado.

### Implantar com um Plugin IPAM

Um plugin IP Address Manager (IPAM) é necessário para atribuir endereços IP nas interfaces extras criadas pelo Multus. Um ou mais IPAMs podem ser instalados; os exemplos abaixo mostram o uso de um único plugin IPAM, mas eles podem ser combinados conforme necessário.

Os exemplos de implantação do helm abaixo implantarão um DaemonSet para criar pods Multus para instalar os binários CNI necessários em `/var/lib/rancher/k3s/data/cni/` e a configuração Multus CNI em `/var/lib/rancher/k3s/agent/etc/cni/net.d`.

<Tabs groupId = "MultusIPAMplugins">
<TabItem value="host-local" default>
O plugin IPAM host-local aloca endereços IP de um conjunto de intervalos de endereços. Ele armazena o estado localmente no sistema de arquivos do host, garantindo assim a exclusividade dos endereços IP em um único host. Portanto, não o recomendamos para clusters de vários nós. Este plugin IPAM não requer nenhuma implantação extra. Para mais informações: https://www.cni.dev/plugins/current/ipam/host-local/.

Para usar o plugin host-local, implante o Multus com a seguinte configuração:
```yaml
apiVersion: helm.cattle.io/v1
kind: HelmChart
metadata:
  name: multus
  namespace: kube-system
spec:
  repo: https://rke2-charts.rancher.io
  chart: rke2-multus
  targetNamespace: kube-system
  valuesContent: |-
    config:
      fullnameOverride: multus
      cni_conf:
        confDir: /var/lib/rancher/k3s/agent/etc/cni/net.d
        binDir: /var/lib/rancher/k3s/data/cni/
        kubeconfig: /var/lib/rancher/k3s/agent/etc/cni/net.d/multus.d/multus.kubeconfig
```

</TabItem>
<TabItem value="Whereabouts" default>
[Whereabouts](https://github.com/k8snetworkplumbingwg/whereabouts) é um plugin CNI de Gerenciamento de Endereços IP (IPAM) que atribui endereços IP em todo o cluster.

Para usar o plugin Whereabouts IPAM, implante o Multus com a seguinte configuração:
```yaml
apiVersion: helm.cattle.io/v1
kind: HelmChart
metadata:
  name: multus
  namespace: kube-system
spec:
  repo: https://rke2-charts.rancher.io
  chart: rke2-multus
  targetNamespace: kube-system
  valuesContent: |-
    config:
      fullnameOverride: multus
      cni_conf:
        confDir: /var/lib/rancher/k3s/agent/etc/cni/net.d
        binDir: /var/lib/rancher/k3s/data/cni/
        kubeconfig: /var/lib/rancher/k3s/agent/etc/cni/net.d/multus.d/multus.kubeconfig
    rke2-whereabouts:
      fullnameOverride: whereabouts
      enabled: true
      cniConf:
        confDir: /var/lib/rancher/k3s/agent/etc/cni/net.d
        binDir: /var/lib/rancher/k3s/data/cni/
```

Ao usar whereabouts no K3s, `configuration_path` deve ser definido como `/var/lib/rancher/k3s/agent/etc/cni/net.d/whereabouts.d/whereabouts.conf` na configuração `ipam` do NetworkAttachmentDefinition.
Por exemplo, ao usar whereabouts como o IPAM com o plugin macvlan:
```yaml
apiVersion: k8s.cni.cncf.io/v1
kind: NetworkAttachmentDefinition
metadata:
  name: macvlan-whereabouts
spec:
  config: |-
    {
      "cniVersion": "1.0.0",
      "type": "macvlan",
      "master": "eth0",
      "mode": "bridge",
      "ipam": {
        "type": "whereabouts",
        "range": "172.17.0.0/24",
        "gateway": "172.17.0.1",
        "configuration_path": "/var/lib/rancher/k3s/agent/etc/cni/net.d/whereabouts.d/whereabouts.conf"
      }
    }
```

</TabItem>
<TabItem value="Multus DHCP daemon" default>
O plugin dhcp IPAM pode ser implantado quando já houver um servidor DHCP em execução na rede. Este daemonset cuida da renovação periódica do lease do DHCP. Para mais informações, verifique a documentação oficial do [plugin DHCP IPAM](https://www.cni.dev/plugins/current/ipam/dhcp/).

Para usar o plugin DHCP, implante o Multus com a seguinte configuração:
```yaml
apiVersion: helm.cattle.io/v1
kind: HelmChart
metadata:
  name: multus
  namespace: kube-system
spec:
  repo: https://rke2-charts.rancher.io
  chart: rke2-multus
  targetNamespace: kube-system
  valuesContent: |-
    config:
      fullnameOverride: multus
      cni_conf:
        confDir: /var/lib/rancher/k3s/agent/etc/cni/net.d
        binDir: /var/lib/rancher/k3s/data/cni/
        kubeconfig: /var/lib/rancher/k3s/agent/etc/cni/net.d/multus.d/multus.kubeconfig
    manifests:
      dhcpDaemonSet: true
```

</TabItem>
</Tabs>

### Usando Multus

Depois que o Multus for implantado, você pode criar recursos NetworkAttachmentDefinition e referenciá-los nas especificações do Pod para anexar interfaces adicionais.
Por exemplo, usando o exemplo whereabouts acima, você pode criar uma interface `eth1` em um Pod usando a anotação `k8s.v1.cni.cncf.io/networks`:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: multus-demo
  labels:
    app: multus-demo
spec:
  replicas: 1
  selector:
    matchLabels:
      app: multus-demo
  template:
    metadata:
      annotations:
        k8s.v1.cni.cncf.io/networks: macvlan-whereabouts@eth1
      labels:
        app: multus-demo
    spec:
      containers:
      - name: shell
        image: docker.io/rancher/mirrored-library-busybox:1.36.1
        imagePullPolicy: IfNotPresent
        command:
          - sleep
          - "3600"
```

Consulte a documentação upstream para obter informações adicionais e exemplos.