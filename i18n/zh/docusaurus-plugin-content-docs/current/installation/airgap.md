---
title: "离线安装"
---

本指南分三步介绍如何在离线（air-gap）环境中安装 K3s。

## 1. 加载镜像 {#1-load-images}

每种镜像加载方式的要求不同，适用于不同的离线场景。请选择最符合你的基础设施和安全要求的方式。

<Tabs queryString="airgap-load-images">
<TabItem value="Private Registry Method" label="私有镜像仓库方式">

以下步骤假设你已在离线环境中创建了节点，使用内置的 containerd 作为容器运行时，并且环境中已有符合 OCI 规范的私有镜像仓库。

如果尚未搭建私有 Docker 镜像仓库，请参阅 [Docker Registry 官方文档](https://distribution.github.io/distribution/about/deploying/#run-an-externally-accessible-registry)。

#### 创建镜像仓库配置并推送镜像 {#create-the-registry-yaml-and-push-images}

1. 从 [releases](https://github.com/k3s-io/k3s/releases) 页面获取与你要运行的 K3s 版本和 CPU 架构对应的镜像归档包。
2. 使用 `docker image load k3s-airgap-images-amd64.tar.zst` 将 tar 文件中的镜像导入 Docker。
3. 使用 `docker tag` 和 `docker push` 为导入的镜像重新打标签，并推送到私有镜像仓库。
4. 按照[私有镜像仓库配置](private-registry.md)指南创建并配置 `registries.yaml` 文件。
5. 继续执行下文的[安装 K3s](#2-install-k3s) 部分。

</TabItem>
<TabItem value="Manually Deploy Images" label="手动部署镜像">

以下步骤假设你已在离线环境中创建了节点，使用内置的 containerd 作为容器运行时，并且无法或不想使用私有镜像仓库。

此方法要求你手动将所需镜像部署到每个节点，适用于运行私有镜像仓库不切实际的边缘部署场景。

#### 准备镜像目录和离线镜像 tar 包 {#prepare-the-images-directory-and-airgap-image-tarball}

1. 在可访问互联网的机器上，从 [releases](https://github.com/k3s-io/k3s/releases) 页面下载与你要运行的 K3s 版本和 CPU 架构对应的镜像归档包。例如：
  ```bash
  curl -L -o k3s-airgap-images-amd64.tar.zst "https://github.com/k3s-io/k3s/releases/download/v1.33.3%2Bk3s1/k3s-airgap-images-amd64.tar.zst"
  ```
2. 将镜像归档包传输到离线节点，并放入 agent 的镜像目录，例如：
  ```bash
  sudo mkdir -p /var/lib/rancher/k3s/agent/images/
  sudo cp k3s-airgap-images-amd64.tar.zst /var/lib/rancher/k3s/agent/images/k3s-airgap-images-amd64.tar.zst
  ```
3. 继续执行下文的[安装 K3s](#2-install-k3s) 部分。

#### 启用有条件的镜像导入 {#enable-conditional-image-imports}

每次启动 K3s 时都会导入镜像归档包。这样做的目的是确保所有镜像始终可用，即使自上次启动以来某些镜像已被删除或清理。但是，这会延迟启动，因为在处理完所有归档包之前 kubelet 不会启动。为缓解这一延迟，可以选择仅在 tar 包自上次导入后发生变化时才导入，即使跨越重启也是如此。

要启用此功能，请在镜像目录中创建一个 `.cache.json` 文件：
```bash
touch /var/lib/rancher/k3s/agent/images/.cache.json
```
缓存文件会在处理文件时存储归档元数据。只要归档包的大小和修改时间保持不变，后续重启 K3s 时将不会导入这些镜像。

:::warning
启用此功能后，将无法保证每次启动 K3s 时所有镜像都可用。如果某个镜像自上次启动以来被删除或清理，请手动重新导入该镜像，可选择以下任一方式：
* 使用 `ctr image import` 手动导入归档包。
* 使用 `touch` 修改包含该镜像的归档包的时间戳。
* 清空 `.cache.json` 文件的内容，然后重启 K3s。
:::


</TabItem>
<TabItem value="Embedded Registry Mirror" label="内嵌镜像加速器">

K3s 内置了一个符合 OCI 规范的分布式镜像加速器。启用并正确配置后，任何节点 containerd 镜像存储中已有的镜像，都可以被集群中的其他成员拉取，而无需访问外部镜像仓库。

被加速的镜像可以来自上游镜像仓库、镜像加速器或离线镜像 tar 包。有关启用内嵌分布式镜像加速器的更多信息，请参阅[内嵌镜像加速器](./registry-mirror.md)文档。

</TabItem>
</Tabs>

## 2. 安装 K3s {#2-install-k3s}

### 前提条件 {#prerequisites}

安装 K3s 之前，请先从上方[加载镜像](#1-load-images)的选项中选择一种方式，预先准备好 K3s 安装所需的镜像。

#### 下载二进制文件和脚本 {#download-binary-and-script}
- 从 [releases](https://github.com/k3s-io/k3s/releases) 页面下载与获取离线镜像时所用版本相同的 K3s 二进制文件。将二进制文件放到每个离线节点的 `/usr/local/bin` 目录，并确保其具有可执行权限。
```bash
sudo curl -Lo /usr/local/bin/k3s https://github.com/k3s-io/k3s/releases/download/v1.33.3%2Bk3s1/k3s
sudo chmod +x /usr/local/bin/k3s
```

- 从 [get.k3s.io](https://get.k3s.io) 下载 K3s 安装脚本。将脚本放到每个离线节点上的任意位置，并命名为 `install.sh`。
```bash
curl -Lo install.sh https://get.k3s.io
chmod +x install.sh
```


<details>
<summary>**设置默认网络路由**——没有默认路由的节点需要此设置</summary>

如果你的节点没有配置默认路由的网卡，则必须配置一条默认路由；即使是通过 dummy 接口配置的黑洞路由也可以。K3s 需要默认路由来自动检测节点的主 IP，并且 kube-proxy 的 ClusterIP 路由也需要它才能正常工作。要添加 dummy 路由，请执行以下操作：
```bash
ip link add dummy0 type dummy
ip link set dummy0 up
ip addr add 203.0.113.254/31 dev dummy0
ip route add default via 203.0.113.255 dev dummy0 metric 1000
```
</details>

<details>
<summary>**下载 SELinux RPM**——启用了 SELinux 的离线节点需要此设置</summary>

如果在启用了 SELinux 的离线节点上运行，必须在安装 K3s 之前手动安装 k3s-selinux RPM。此 RPM 包含 K3s 正常运行所需的 SELinux 策略。最新版本的 RPM 可在[此处](https://github.com/k3s-io/k3s-selinux/releases/latest)找到。例如，在 CentOS 8 上：

```bash
# On internet accessible machine:
curl -LO https://github.com/k3s-io/k3s-selinux/releases/download/v1.6.stable.1/k3s-selinux-1.6-1.el8.noarch.rpm

# Transfer RPM to air-gapped machine
sudo yum install ./k3s-selinux-1.6-1.el8.noarch.rpm
```
安装 k3s-selinux RPM 需要操作系统提供以下依赖项：
    * container-selinux
    * policycoreutils
    * selinux-policy

有关更多信息，请参阅 [SELinux](../advanced.md#selinux-support) 部分。

</details>


### 运行安装脚本 {#running-install-script}

你可以按照以下说明在一个或多个服务器上安装 K3s。

<Tabs queryString="airgap-install">
<TabItem value="Single Server Configuration" label="单服务器配置" default>

要在单个服务器上安装 K3s，只需在 server 节点上执行以下操作：

```bash
INSTALL_K3S_SKIP_DOWNLOAD=true ./install.sh
```

要添加更多 agent，请在每个 agent 节点上执行以下操作：

```bash
INSTALL_K3S_SKIP_DOWNLOAD=true K3S_URL=https://<SERVER_IP>:6443 K3S_TOKEN=<YOUR_TOKEN> ./install.sh
```

</TabItem>
<TabItem value="High Availability Configuration" label="高可用配置" default>

请参考[使用外部数据库实现高可用](../datastore/ha.md)或[使用内嵌数据库实现高可用](../datastore/ha-embedded.md)指南。你需要调整安装命令，指定 `INSTALL_K3S_SKIP_DOWNLOAD=true`，并在本地运行安装脚本，而不是通过 curl 运行。你还需要使用 `INSTALL_K3S_EXEC='args'` 向 K3s 传递所需的参数。

例如，使用外部数据库实现高可用指南的第二步提到了以下命令：

```bash
curl -sfL https://get.k3s.io | sh -s - server \
  --token=SECRET \
  --datastore-endpoint="mysql://username:password@tcp(hostname:3306)/database-name"
```

此时，你可以像下面这样修改此类示例：

```bash
INSTALL_K3S_SKIP_DOWNLOAD=true INSTALL_K3S_EXEC='server --token=SECRET' \
K3S_DATASTORE_ENDPOINT='mysql://username:password@tcp(hostname:3306)/database-name' \
./install.sh
```

</TabItem>
</Tabs>

:::note
K3s 的 `--resolv-conf` 标志会传递给 kubelet，这有助于在主机未配置上游名称服务器的离线环境中配置 Pod 的 DNS 解析。
:::

## 3. 升级 {#3-upgrading}

<Tabs queryString="airgap-upgrade">
<TabItem value="Manual Upgrade" label="手动升级">

升级离线环境可以按以下方式完成：

1. 从 [releases](https://github.com/k3s-io/k3s/releases) 页面下载要升级到的 K3s 版本对应的新离线镜像（tar 文件）。将 tar 文件放到每个节点的 `/var/lib/rancher/k3s/agent/images/` 目录中，并删除旧的 tar 文件。
2. 复制新的 K3s 二进制文件，替换每个节点 `/usr/local/bin` 中的旧文件。同时复制 https://get.k3s.io 上的安装脚本（因为自上个版本以来它可能已发生变化）。然后像以前一样，使用相同的环境变量重新运行脚本。
3. 重启 K3s 服务（如果安装程序未自动重启）。

</TabItem>
<TabItem value="Automated Upgrade" label="自动升级">

K3s 支持[自动升级](../upgrades/automated.md)。要在离线环境中启用此功能，必须确保私有镜像仓库中具有所需的镜像。

你需要与目标 K3s 版本对应的 rancher/k3s-upgrade 版本。注意，由于 Docker 镜像不支持 `+`，镜像标签会将 K3s 版本中的 `+` 替换为 `-`。

你还需要将要部署的 system-upgrade-controller 清单 YAML 中指定的 system-upgrade-controller 和 kubectl 版本。请[在此处](https://github.com/rancher/system-upgrade-controller/releases/latest)查看 system-upgrade-controller 的最新版本，并下载 system-upgrade-controller.yaml 以确定需要推送到私有镜像仓库的版本。例如，在 system-upgrade-controller v0.15.2 版本中，清单 YAML 指定了以下镜像：

```
rancher/system-upgrade-controller:v0.15.2
rancher/kubectl:v1.30.3
```

将所需的 rancher/k3s-upgrade、rancher/system-upgrade-controller 和 rancher/kubectl 镜像添加到私有镜像仓库后，请按照[自动升级](../upgrades/automated.md)指南操作。

</TabItem>
</Tabs>
