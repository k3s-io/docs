---
title: Stopping K3s
---


To allow high availability during upgrades, the K3s containers continue running when the K3s service is stopped.


## K3s Service

Stopping and restarting K3s is supported by the installation script for systemd and OpenRC.

<Tabs>
<TabItem value="systemd">

To stop servers:
```sh
sudo systemctl stop k3s
```

To restart servers:
```sh
sudo systemctl start k3s
```

To stop agents:
```sh
sudo systemctl stop k3s-agent
```

To restart agents:
```sh
sudo systemctl start k3s-agent
```

</TabItem>
<TabItem value="OpenRC">

To stop servers:
```sh
sudo rc-service k3s stop
```

To restart servers:
```sh
sudo rc-service k3s restart
```

To stop agents:
```sh
sudo rc-service k3s-agent stop
```

To restart agents:
```sh
sudo rc-service k3s-agent restart
```

</TabItem>
</Tabs>


## Killall Script

To stop all of the K3s containers and reset the containerd state, the `k3s-killall.sh` script can be used.

The killall script cleans up containers, K3s directories, and networking components while also removing the iptables chain with all the associated rules. The cluster data will not be deleted.

To run the killall script from a server node, run:

```bash
/usr/local/bin/k3s-killall.sh
```
