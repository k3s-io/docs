---
title: CIS 1.8 Self Assessment Guide
---

## Overview

This document is a companion to the [K3s security hardening guide](hardening-guide.md). The hardening guide provides prescriptive guidance for hardening a production installation of K3s, and this benchmark guide is meant to help you evaluate the level of security of the hardened cluster against each control in the CIS Kubernetes Benchmark. It is to be used by K3s operators, security teams, auditors, and decision-makers.

This guide is specific to the **vv1.26-v1.29** release line of K3s and the **v1.8** release of the CIS Kubernetes Benchmark.

For more information about each control, including detailed descriptions and remediations for failing tests, you can refer to the corresponding section of the CIS Kubernetes Benchmark v1.8. You can download the benchmark, after creating a free account, in [Center for Internet Security (CIS)](https://www.cisecurity.org/benchmark/kubernetes/).

### Testing controls methodology

Each control in the CIS Kubernetes Benchmark was evaluated against a K3s cluster that was configured according to the accompanying hardening guide.

Where control audits differ from the original CIS benchmark, the audit commands specific to K3s are provided for testing.

These are the possible results for each control:

- **Pass** - The K3s cluster under test passed the audit outlined in the benchmark.
- **Not Applicable** - The control is not applicable to K3s because of how it is designed to operate. The remediation section will explain why this is so.
- **Warn** - The control is manual in the CIS benchmark and it depends on the cluster's use case or some other factor that must be determined by the cluster operator. These controls have been evaluated to ensure K3s does not prevent their implementation, but no further configuration or auditing of the cluster under test has been performed.

This guide makes the assumption that K3s is running as a Systemd unit. Your installation may vary and will require you to adjust the "audit" commands to fit your scenario.

:::note

Only `scored` test, also know as `automated` tests are covered in this guide.
:::


## 1.1 Control Plane Node Configuration Files

### 1.1.1 Ensure that the API server pod specification file permissions are set to 600 or more restrictive (Automated)

**Result:** Not Applicable

**Remediation:**
Run the below command (based on the file location on your system) on the
control plane node.
For example, chmod 600 /etc/kubernetes/manifests/kube-apiserver.yaml
Not Applicable.

### 1.1.2 Ensure that the API server pod specification file ownership is set to root:root (Automated)

**Result:** Not Applicable

**Remediation:**
Run the below command (based on the file location on your system) on the control plane node.
For example, chown root:root /etc/kubernetes/manifests/kube-apiserver.yaml
Not Applicable.

### 1.1.3 Ensure that the controller manager pod specification file permissions are set to 600 or more restrictive (Automated)

**Result:** Not Applicable

**Remediation:**
Run the below command (based on the file location on your system) on the control plane node.
For example, chmod 600 /etc/kubernetes/manifests/kube-controller-manager.yaml
Not Applicable.

### 1.1.4 Ensure that the controller manager pod specification file ownership is set to root:root (Automated)

**Result:** Not Applicable

**Remediation:**
Run the below command (based on the file location on your system) on the control plane node.
For example, chown root:root /etc/kubernetes/manifests/kube-controller-manager.yaml
Not Applicable.

### 1.1.5 Ensure that the scheduler pod specification file permissions are set to 600 or more restrictive (Automated)

**Result:** Not Applicable

**Remediation:**
Run the below command (based on the file location on your system) on the control plane node.
For example, chmod 600 /etc/kubernetes/manifests/kube-scheduler.yaml
Not Applicable.

### 1.1.6 Ensure that the scheduler pod specification file ownership is set to root:root (Automated)

**Result:** Not Applicable

**Remediation:**
Run the below command (based on the file location on your system) on the control plane node.
For example, chown root:root /etc/kubernetes/manifests/kube-scheduler.yaml
Not Applicable.

### 1.1.7 Ensure that the etcd pod specification file permissions are set to 600 or more restrictive (Automated)

**Result:** Not Applicable

**Remediation:**
Run the below command (based on the file location on your system) on the control plane node.
For example,
chmod 600 /etc/kubernetes/manifests/etcd.yaml
Not Applicable.

### 1.1.8 Ensure that the etcd pod specification file ownership is set to root:root (Automated)

**Result:** Not Applicable

**Remediation:**
Run the below command (based on the file location on your system) on the control plane node.
For example,
chown root:root /etc/kubernetes/manifests/etcd.yaml
Not Applicable.

### 1.1.9 Ensure that the Container Network Interface file permissions are set to 600 or more restrictive (Automated)

**Result:** Not Applicable

**Remediation:**
Run the below command (based on the file location on your system) on the control plane node.
For example, chmod 600 	&lt;path/to/cni/files&gt;
Not Applicable.

### 1.1.10 Ensure that the Container Network Interface file ownership is set to root:root (Manual)

**Result:** Not Applicable

**Remediation:**
Run the below command (based on the file location on your system) on the control plane node.
For example,
chown root:root 	&lt;path/to/cni/files&gt;
Not Applicable.

### 1.1.11 Ensure that the etcd data directory permissions are set to 700 or more restrictive (Automated)

**Result:** PASS

**Audit:**
```bash
stat -c %a /var/lib/rancher/k3s/server/db/etcd
```

**Expected Result:** '700' is equal to '700'

<details>
<summary><b>Returned Value:</b></summary>

```console
700
```
</details>

### 1.1.12 Ensure that the etcd data directory ownership is set to etcd:etcd (Automated)

**Result:** Not Applicable

**Remediation:**
On the etcd server node, get the etcd data directory, passed as an argument --data-dir,
from the command 'ps -ef | grep etcd'.
Run the below command (based on the etcd data directory found above).
For example, chown etcd:etcd /var/lib/etcd
Not Applicable.

### 1.1.13 Ensure that the admin.conf file permissions are set to 600 or more restrictive (Automated)

**Result:** Not Applicable

**Remediation:**
Run the below command (based on the file location on your system) on the control plane node.
For example, chmod 600 /var/lib/rancher/k3s/server/cred/admin.kubeconfig

### 1.1.14 Ensure that the admin.conf file ownership is set to root:root (Automated)

**Result:** PASS

**Audit:**
```bash
/bin/sh -c 'if test -e /var/lib/rancher/k3s/server/cred/admin.kubeconfig; then stat -c %U:%G /var/lib/rancher/k3s/server/cred/admin.kubeconfig; fi'
```

**Expected Result:** 'root:root' is equal to 'root:root'

<details>
<summary><b>Returned Value:</b></summary>

```console
root:root
```
</details>

### 1.1.15 Ensure that the scheduler.conf file permissions are set to 600 or more restrictive (Automated)

**Result:** PASS

**Audit:**
```bash
/bin/sh -c 'if test -e /var/lib/rancher/k3s/server/cred/scheduler.kubeconfig; then stat -c permissions=%a /var/lib/rancher/k3s/server/cred/scheduler.kubeconfig; fi'
```

**Expected Result:** permissions has permissions 600, expected 600 or more restrictive

<details>
<summary><b>Returned Value:</b></summary>

```console
permissions=600
```
</details>

### 1.1.16 Ensure that the scheduler.conf file ownership is set to root:root (Automated)

**Result:** PASS

**Audit:**
```bash
/bin/sh -c 'if test -e /var/lib/rancher/k3s/server/cred/scheduler.kubeconfig; then stat -c %U:%G /var/lib/rancher/k3s/server/cred/scheduler.kubeconfig; fi'
```

**Expected Result:** 'root:root' is present

<details>
<summary><b>Returned Value:</b></summary>

```console
root:root
```
</details>

### 1.1.17 Ensure that the controller-manager.conf file permissions are set to 600 or more restrictive (Automated)

**Result:** PASS

**Audit:**
```bash
/bin/sh -c 'if test -e /var/lib/rancher/k3s/server/cred/controller.kubeconfig; then stat -c permissions=%a /var/lib/rancher/k3s/server/cred/controller.kubeconfig; fi'
```

**Expected Result:** permissions has permissions 600, expected 600 or more restrictive

<details>
<summary><b>Returned Value:</b></summary>

```console
permissions=600
```
</details>

### 1.1.18 Ensure that the controller-manager.conf file ownership is set to root:root (Automated)

**Result:** PASS

**Audit:**
```bash
stat -c %U:%G /var/lib/rancher/k3s/server/cred/controller.kubeconfig
```

**Expected Result:** 'root:root' is equal to 'root:root'

<details>
<summary><b>Returned Value:</b></summary>

```console
root:root
```
</details>

### 1.1.19 Ensure that the Kubernetes PKI directory and file ownership is set to root:root (Automated)

**Result:** PASS

**Audit:**
```bash
stat -c %U:%G /var/lib/rancher/k3s/server/tls
```

**Expected Result:** 'root:root' is present

<details>
<summary><b>Returned Value:</b></summary>

```console
root:root
```
</details>

### 1.1.20 Ensure that the Kubernetes PKI certificate file permissions are set to 600 or more restrictive (Manual)

**Result:** WARN

**Remediation:**
Run the below command (based on the file location on your system) on the master node.
For example,
find /var/lib/rancher/k3s/server/tls/ -type f -name '*.crt' -exec chmod -v 600 {} +

### 1.1.21 Ensure that the Kubernetes PKI key file permissions are set to 600 (Manual)

**Result:** PASS

**Audit:**
```bash
find /var/lib/rancher/k3s/server/tls/ -type f -name '*.key' | xargs stat -c permissions=%a
```

**Expected Result:** permissions has permissions 600, expected 600 or more restrictive

<details>
<summary><b>Returned Value:</b></summary>

```console
permissions=600
permissions=600
permissions=600
permissions=600
permissions=600
permissions=600
permissions=600
permissions=600
permissions=600
permissions=600
permissions=600
permissions=600
permissions=600
permissions=600
permissions=600
permissions=600
permissions=600
permissions=600
permissions=600
permissions=600
permissions=600
permissions=600
permissions=600
```
</details>

## 1.2 API Server

### 1.2.1 Ensure that the --anonymous-auth argument is set to false (Manual)

**Result:** PASS

**Audit:**
```bash
journalctl -D /var/log/journal  -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep 'anonymous-auth'
```

**Expected Result:** '--anonymous-auth' is equal to 'false'

<details>
<summary><b>Returned Value:</b></summary>

```console
Apr 22 20:12:19 server-0 k3s[2397]: time="2024-04-22T20:12:19Z" level=info msg="Running kube-apiserver --admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --encryption-provider-config-automatic-reload=true --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-lookup=true --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

### 1.2.2 Ensure that the --token-auth-file parameter is not set (Automated)

**Result:** PASS

**Audit:**
```bash
/bin/ps -ef | grep containerd | grep -v grep
```

**Expected Result:** '--token-auth-file' is not present

<details>
<summary><b>Returned Value:</b></summary>

```console
root        2415    2397  0 Apr22 ?        00:06:36 containerd 
root        3162       1  0 Apr22 ?        00:00:30 /var/lib/rancher/k3s/data/124f36823e5696ab11a8a042537e1edbc6d69919dc7579be22caccc18ccc083f/bin/containerd-shim-runc-v2 -namespace k8s.io -id d540dd74296e1dc069f7c25dc9e76690d9afb22b404cd87c7f6217889da7aa7e -address /run/k3s/containerd/containerd.sock
root        3215       1  0 Apr22 ?        00:00:29 /var/lib/rancher/k3s/data/124f36823e5696ab11a8a042537e1edbc6d69919dc7579be22caccc18ccc083f/bin/containerd-shim-runc-v2 -namespace k8s.io -id 551b739eb5a7f61465027aaf2848954a29639e8ddf4f78a89fc9f881eb6b1378 -address /run/k3s/containerd/containerd.sock
root        3318       1  0 Apr22 ?        00:00:31 /var/lib/rancher/k3s/data/124f36823e5696ab11a8a042537e1edbc6d69919dc7579be22caccc18ccc083f/bin/containerd-shim-runc-v2 -namespace k8s.io -id dbf0b3aadcbf40fd7dc27f340051fc58979d46c2174963967ae01170c7d88f2d -address /run/k3s/containerd/containerd.sock
root        4135       1  0 Apr22 ?        00:00:41 /var/lib/rancher/k3s/data/124f36823e5696ab11a8a042537e1edbc6d69919dc7579be22caccc18ccc083f/bin/containerd-shim-runc-v2 -namespace k8s.io -id 21e58656877367076224111e51be5d30e8d316dbcb8c05a36a8432eda2d16ccb -address /run/k3s/containerd/containerd.sock
root        4300       1  0 Apr22 ?        00:00:30 /var/lib/rancher/k3s/data/124f36823e5696ab11a8a042537e1edbc6d69919dc7579be22caccc18ccc083f/bin/containerd-shim-runc-v2 -namespace k8s.io -id c1db1ac0969a14f1addcc0295ec09fa9fa4c55edac1acc4701ac18326dcb8a51 -address /run/k3s/containerd/containerd.sock
```
</details>

### 1.2.3 Ensure that the --DenyServiceExternalIPs is not set (Automated)

**Result:** PASS

**Audit:**
```bash
/bin/ps -ef | grep containerd | grep -v grep
```

**Expected Result:** '--enable-admission-plugins' is present OR '--enable-admission-plugins' is not present

<details>
<summary><b>Returned Value:</b></summary>

```console
root        2415    2397  0 Apr22 ?        00:06:36 containerd 
root        3162       1  0 Apr22 ?        00:00:30 /var/lib/rancher/k3s/data/124f36823e5696ab11a8a042537e1edbc6d69919dc7579be22caccc18ccc083f/bin/containerd-shim-runc-v2 -namespace k8s.io -id d540dd74296e1dc069f7c25dc9e76690d9afb22b404cd87c7f6217889da7aa7e -address /run/k3s/containerd/containerd.sock
root        3215       1  0 Apr22 ?        00:00:29 /var/lib/rancher/k3s/data/124f36823e5696ab11a8a042537e1edbc6d69919dc7579be22caccc18ccc083f/bin/containerd-shim-runc-v2 -namespace k8s.io -id 551b739eb5a7f61465027aaf2848954a29639e8ddf4f78a89fc9f881eb6b1378 -address /run/k3s/containerd/containerd.sock
root        3318       1  0 Apr22 ?        00:00:31 /var/lib/rancher/k3s/data/124f36823e5696ab11a8a042537e1edbc6d69919dc7579be22caccc18ccc083f/bin/containerd-shim-runc-v2 -namespace k8s.io -id dbf0b3aadcbf40fd7dc27f340051fc58979d46c2174963967ae01170c7d88f2d -address /run/k3s/containerd/containerd.sock
root        4135       1  0 Apr22 ?        00:00:41 /var/lib/rancher/k3s/data/124f36823e5696ab11a8a042537e1edbc6d69919dc7579be22caccc18ccc083f/bin/containerd-shim-runc-v2 -namespace k8s.io -id 21e58656877367076224111e51be5d30e8d316dbcb8c05a36a8432eda2d16ccb -address /run/k3s/containerd/containerd.sock
root        4300       1  0 Apr22 ?        00:00:30 /var/lib/rancher/k3s/data/124f36823e5696ab11a8a042537e1edbc6d69919dc7579be22caccc18ccc083f/bin/containerd-shim-runc-v2 -namespace k8s.io -id c1db1ac0969a14f1addcc0295ec09fa9fa4c55edac1acc4701ac18326dcb8a51 -address /run/k3s/containerd/containerd.sock
```
</details>

### 1.2.4 Ensure that the --kubelet-client-certificate and --kubelet-client-key arguments are set as appropriate (Automated)

**Result:** PASS

**Audit:**
```bash
journalctl -D /var/log/journal  -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep 'kubelet-certificate-authority'
```

**Expected Result:** '--kubelet-client-certificate' is present AND '--kubelet-client-key' is present

<details>
<summary><b>Returned Value:</b></summary>

```console
Apr 22 20:12:19 server-0 k3s[2397]: time="2024-04-22T20:12:19Z" level=info msg="Running kube-apiserver --admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --encryption-provider-config-automatic-reload=true --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-lookup=true --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

### 1.2.5 Ensure that the --kubelet-certificate-authority argument is set as appropriate (Automated)

**Result:** Not Applicable

**Remediation:**
Follow the Kubernetes documentation and setup the TLS connection between
the apiserver and kubelets. Then, edit the API server pod specification file
/etc/kubernetes/manifests/kube-apiserver.yaml on the control plane node and set the
--kubelet-certificate-authority parameter to the path to the cert file for the certificate authority.
--kubelet-certificate-authority=&lt;ca-string&gt;
Permissive - When generating serving certificates, functionality could break in conjunction with hostname overrides which are required for certain cloud providers.

### 1.2.6 Ensure that the --authorization-mode argument is not set to AlwaysAllow (Automated)

**Result:** PASS

**Audit:**
```bash
journalctl -D /var/log/journal  -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep 'authorization-mode'
```

**Expected Result:** '--authorization-mode' does not have 'AlwaysAllow'

<details>
<summary><b>Returned Value:</b></summary>

```console
Apr 22 20:12:19 server-0 k3s[2397]: time="2024-04-22T20:12:19Z" level=info msg="Running kube-apiserver --admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --encryption-provider-config-automatic-reload=true --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-lookup=true --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

### 1.2.7 Ensure that the --authorization-mode argument includes Node (Automated)

**Result:** PASS

**Audit:**
```bash
journalctl -D /var/log/journal  -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep 'authorization-mode'
```

**Expected Result:** '--authorization-mode' has 'Node'

<details>
<summary><b>Returned Value:</b></summary>

```console
Apr 22 20:12:19 server-0 k3s[2397]: time="2024-04-22T20:12:19Z" level=info msg="Running kube-apiserver --admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --encryption-provider-config-automatic-reload=true --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-lookup=true --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

### 1.2.8 Ensure that the --authorization-mode argument includes RBAC (Automated)

**Result:** PASS

**Audit:**
```bash
journalctl -D /var/log/journal  -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep 'authorization-mode'
```

**Expected Result:** '--authorization-mode' has 'RBAC'

<details>
<summary><b>Returned Value:</b></summary>

```console
Apr 22 20:12:19 server-0 k3s[2397]: time="2024-04-22T20:12:19Z" level=info msg="Running kube-apiserver --admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --encryption-provider-config-automatic-reload=true --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-lookup=true --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

### 1.2.9 Ensure that the admission control plugin EventRateLimit is set (Manual)

**Result:** WARN

**Remediation:**
Follow the Kubernetes documentation and set the desired limits in a configuration file.
Then, edit the API server pod specification file /etc/kubernetes/manifests/kube-apiserver.yaml
and set the below parameters.
--enable-admission-plugins=...,EventRateLimit,...
--admission-control-config-file=&lt;path/to/configuration/file&gt;

### 1.2.10 Ensure that the admission control plugin AlwaysAdmit is not set (Automated)

**Result:** PASS

**Audit:**
```bash
journalctl -D /var/log/journal  -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep 'enable-admission-plugins'
```

**Expected Result:** '--enable-admission-plugins' does not have 'AlwaysAdmit' OR '--enable-admission-plugins' is not present

<details>
<summary><b>Returned Value:</b></summary>

```console
Apr 22 20:12:19 server-0 k3s[2397]: time="2024-04-22T20:12:19Z" level=info msg="Running kube-apiserver --admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --encryption-provider-config-automatic-reload=true --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-lookup=true --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

### 1.2.11 Ensure that the admission control plugin AlwaysPullImages is set (Manual)

**Result:** WARN

**Remediation:**
Edit the API server pod specification file /etc/kubernetes/manifests/kube-apiserver.yaml
on the control plane node and set the --enable-admission-plugins parameter to include
AlwaysPullImages.
--enable-admission-plugins=...,AlwaysPullImages,...

### 1.2.12 Ensure that the admission control plugin SecurityContextDeny is set if PodSecurityPolicy is not used (Manual)

**Result:** Not Applicable

**Remediation:**
Edit the API server pod specification file /etc/kubernetes/manifests/kube-apiserver.yaml
on the control plane node and set the --enable-admission-plugins parameter to include
SecurityContextDeny, unless PodSecurityPolicy is already in place.
--enable-admission-plugins=...,SecurityContextDeny,...
Permissive - Enabling Pod Security Policy can cause applications to unexpectedly fail.

### 1.2.13 Ensure that the admission control plugin ServiceAccount is set (Automated)

**Result:** PASS

**Audit:**
```bash
journalctl -D /var/log/journal  -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep -v grep
```

**Expected Result:** '--disable-admission-plugins' is present OR '--disable-admission-plugins' is not present

<details>
<summary><b>Returned Value:</b></summary>

```console
Apr 22 20:12:19 server-0 k3s[2397]: time="2024-04-22T20:12:19Z" level=info msg="Running kube-apiserver --admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --encryption-provider-config-automatic-reload=true --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-lookup=true --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

### 1.2.14 Ensure that the admission control plugin NamespaceLifecycle is set (Automated)

**Result:** PASS

**Audit:**
```bash
journalctl -D /var/log/journal  -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep -v grep
```

**Expected Result:** '--disable-admission-plugins' is present OR '--disable-admission-plugins' is not present

<details>
<summary><b>Returned Value:</b></summary>

```console
Apr 22 20:12:19 server-0 k3s[2397]: time="2024-04-22T20:12:19Z" level=info msg="Running kube-apiserver --admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --encryption-provider-config-automatic-reload=true --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-lookup=true --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

### 1.2.15 Ensure that the admission control plugin NodeRestriction is set (Automated)

**Result:** PASS

**Audit:**
```bash
journalctl -D /var/log/journal  -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep 'enable-admission-plugins'
```

**Expected Result:** '--enable-admission-plugins' has 'NodeRestriction'

<details>
<summary><b>Returned Value:</b></summary>

```console
Apr 22 20:12:19 server-0 k3s[2397]: time="2024-04-22T20:12:19Z" level=info msg="Running kube-apiserver --admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --encryption-provider-config-automatic-reload=true --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-lookup=true --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

### 1.2.16 Ensure that the --profiling argument is set to false (Automated)

**Result:** PASS

**Audit:**
```bash
journalctl -D /var/log/journal  -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep 'profiling'
```

**Expected Result:** '--profiling' is equal to 'false'

<details>
<summary><b>Returned Value:</b></summary>

```console
Apr 22 20:12:19 server-0 k3s[2397]: time="2024-04-22T20:12:19Z" level=info msg="Running kube-apiserver --admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --encryption-provider-config-automatic-reload=true --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-lookup=true --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

### 1.2.17 Ensure that the --audit-log-path argument is set (Automated)

**Result:** Not Applicable

**Remediation:**
Edit the API server pod specification file /etc/kubernetes/manifests/kube-apiserver.yaml
on the control plane node and set the --audit-log-path parameter to a suitable path and
file where you would like audit logs to be written, for example,
--audit-log-path=/var/log/apiserver/audit.log
Permissive.

### 1.2.18 Ensure that the --audit-log-maxage argument is set to 30 or as appropriate (Automated)

**Result:** Not Applicable

**Remediation:**
Edit the API server pod specification file /etc/kubernetes/manifests/kube-apiserver.yaml
on the control plane node and set the --audit-log-maxage parameter to 30
or as an appropriate number of days, for example,
--audit-log-maxage=30
Permissive.

### 1.2.19 Ensure that the --audit-log-maxbackup argument is set to 10 or as appropriate (Automated)

**Result:** Not Applicable

**Remediation:**
Edit the API server pod specification file /etc/kubernetes/manifests/kube-apiserver.yaml
on the control plane node and set the --audit-log-maxbackup parameter to 10 or to an appropriate
value. For example,
--audit-log-maxbackup=10
Permissive.

### 1.2.20 Ensure that the --audit-log-maxsize argument is set to 100 or as appropriate (Automated)

**Result:** Not Applicable

**Remediation:**
Edit the API server pod specification file /etc/kubernetes/manifests/kube-apiserver.yaml
on the control plane node and set the --audit-log-maxsize parameter to an appropriate size in MB.
For example, to set it as 100 MB, --audit-log-maxsize=100
Permissive.

### 1.2.21 Ensure that the --request-timeout argument is set as appropriate (Manual)

**Result:** Not Applicable

**Remediation:**
Edit the API server pod specification file /etc/kubernetes/manifests/kube-apiserver.yaml
and set the below parameter as appropriate and if needed.
For example, --request-timeout=300s
Permissive.

### 1.2.22 Ensure that the --service-account-lookup argument is set to true (Automated)

**Result:** PASS

**Audit:**
```bash
journalctl -D /var/log/journal  -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep -v grep
```

**Expected Result:** '--service-account-lookup' is not present OR '--service-account-lookup' is equal to 'true'

<details>
<summary><b>Returned Value:</b></summary>

```console
Apr 22 20:12:19 server-0 k3s[2397]: time="2024-04-22T20:12:19Z" level=info msg="Running kube-apiserver --admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --encryption-provider-config-automatic-reload=true --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-lookup=true --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

### 1.2.23 Ensure that the --service-account-key-file argument is set as appropriate (Automated)

**Result:** Not Applicable

**Remediation:**
Edit the API server pod specification file /etc/kubernetes/manifests/kube-apiserver.yaml
on the control plane node and set the --service-account-key-file parameter
to the public key file for service accounts. For example,
--service-account-key-file=&lt;filename&gt;

### 1.2.24 Ensure that the --etcd-certfile and --etcd-keyfile arguments are set as appropriate (Automated)

**Result:** PASS

**Audit:**
```bash
journalctl -D /var/log/journal -u k3s | grep 'Running kube-apiserver' | tail -n1
```

**Expected Result:** '--etcd-certfile' is present AND '--etcd-keyfile' is present

<details>
<summary><b>Returned Value:</b></summary>

```
Apr 22 20:12:19 server-0 k3s[2397]: time="2024-04-22T20:12:19Z" level=info msg="Running kube-apiserver 


--admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --encryption-provider-config-automatic-reload=true --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-lookup=true --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

### 1.2.25 Ensure that the --tls-cert-file and --tls-private-key-file arguments are set as appropriate (Automated)

**Result:** PASS

**Audit:**
```bash
journalctl -D /var/log/journal -u k3s | grep -A1 'Running kube-apiserver' | tail -n2
```

**Expected Result:** '--tls-cert-file' is present AND '--tls-private-key-file' is present

<details>
<summary><b>Returned Value:</b></summary>

```console
Apr 22 20:12:19 server-0 k3s[2397]: time="2024-04-22T20:12:19Z" level=info msg="Running kube-apiserver --admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --encryption-provider-config-automatic-reload=true --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-lookup=true --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
Apr 22 20:12:19 server-0 k3s[2397]: time="2024-04-22T20:12:19Z" level=info msg="Running kube-scheduler --authentication-kubeconfig=/var/lib/rancher/k3s/server/cred/scheduler.kubeconfig --authorization-kubeconfig=/var/lib/rancher/k3s/server/cred/scheduler.kubeconfig --bind-address=127.0.0.1 --kubeconfig=/var/lib/rancher/k3s/server/cred/scheduler.kubeconfig --profiling=false --secure-port=10259"
```
</details>

### 1.2.26 Ensure that the --client-ca-file argument is set as appropriate (Automated)

**Result:** PASS

**Audit:**
```bash
journalctl -D /var/log/journal  -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep 'client-ca-file'
```

**Expected Result:** '--client-ca-file' is present

<details>
<summary><b>Returned Value:</b></summary>

```console
Apr 22 20:12:19 server-0 k3s[2397]: time="2024-04-22T20:12:19Z" level=info msg="Running kube-apiserver --admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --encryption-provider-config-automatic-reload=true --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-lookup=true --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

### 1.2.27 Ensure that the --etcd-cafile argument is set as appropriate (Automated)

**Result:** PASS

**Audit:**
```bash
journalctl -D /var/log/journal  -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep 'etcd-cafile'
```

**Expected Result:** '--etcd-cafile' is present

<details>
<summary><b>Returned Value:</b></summary>

```console
Apr 22 20:12:19 server-0 k3s[2397]: time="2024-04-22T20:12:19Z" level=info msg="Running kube-apiserver --admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --encryption-provider-config-automatic-reload=true --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-lookup=true --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

### 1.2.28 Ensure that the --encryption-provider-config argument is set as appropriate (Manual)

**Result:** Not Applicable

**Remediation:**
Follow the Kubernetes documentation and configure a EncryptionConfig file.
Then, edit the API server pod specification file /etc/kubernetes/manifests/kube-apiserver.yaml
on the control plane node and set the --encryption-provider-config parameter to the path of that file.
For example, --encryption-provider-config=&lt;/path/to/EncryptionConfig/File&gt;
Permissive - Enabling encryption changes how data can be recovered as data is encrypted.

### 1.2.29 Ensure that encryption providers are appropriately configured (Manual)

**Result:** Not Applicable

**Remediation:**
Follow the Kubernetes documentation and configure a EncryptionConfig file.
In this file, choose aescbc, kms or secretbox as the encryption provider.
Permissive - Enabling encryption changes how data can be recovered as data is encrypted.

### 1.2.30 Ensure that the API Server only makes use of Strong Cryptographic Ciphers (Manual)

**Result:** PASS

**Audit:**
```bash
journalctl -D /var/log/journal  -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep 'tls-cipher-suites'
```

**Expected Result:** '--tls-cipher-suites' contains valid elements from 'TLS_AES_128_GCM_SHA256,TLS_AES_256_GCM_SHA384,TLS_CHACHA20_POLY1305_SHA256,TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA,TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256,TLS_ECDHE_RSA_WITH_3DES_EDE_CBC_SHA,TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256,TLS_RSA_WITH_3DES_EDE_CBC_SHA,TLS_RSA_WITH_AES_128_CBC_SHA,TLS_RSA_WITH_AES_128_GCM_SHA256,TLS_RSA_WITH_AES_256_CBC_SHA,TLS_RSA_WITH_AES_256_GCM_SHA384'

<details>
<summary><b>Returned Value:</b></summary>

```console
Apr 22 20:12:19 server-0 k3s[2397]: time="2024-04-22T20:12:19Z" level=info msg="Running kube-apiserver --admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --encryption-provider-config-automatic-reload=true --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-lookup=true --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>


## 1.3 Controller Manager

### 1.3.1 Ensure that the --terminated-pod-gc-threshold argument is set as appropriate (Manual)

**Result:** PASS

**Audit:**
```bash
journalctl -D /var/log/journal  -u k3s | grep 'Running kube-controller-manager' | tail -n1 | grep 'terminated-pod-gc-threshold'
```

**Expected Result:** '--terminated-pod-gc-threshold' is present

<details>
<summary><b>Returned Value:</b></summary>

```console
Apr 22 20:12:19 server-0 k3s[2397]: time="2024-04-22T20:12:19Z" level=info msg="Running kube-controller-manager --allocate-node-cidrs=true --authentication-kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --authorization-kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --bind-address=127.0.0.1 --cluster-cidr=10.42.0.0/16 --cluster-signing-kube-apiserver-client-cert-file=/var/lib/rancher/k3s/server/tls/client-ca.nochain.crt --cluster-signing-kube-apiserver-client-key-file=/var/lib/rancher/k3s/server/tls/client-ca.key --cluster-signing-kubelet-client-cert-file=/var/lib/rancher/k3s/server/tls/client-ca.nochain.crt --cluster-signing-kubelet-client-key-file=/var/lib/rancher/k3s/server/tls/client-ca.key --cluster-signing-kubelet-serving-cert-file=/var/lib/rancher/k3s/server/tls/server-ca.nochain.crt --cluster-signing-kubelet-serving-key-file=/var/lib/rancher/k3s/server/tls/server-ca.key --cluster-signing-legacy-unknown-cert-file=/var/lib/rancher/k3s/server/tls/server-ca.nochain.crt --cluster-signing-legacy-unknown-key-file=/var/lib/rancher/k3s/server/tls/server-ca.key --configure-cloud-routes=false --controllers=*,tokencleaner,-service,-route,-cloud-node-lifecycle --kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --profiling=false --root-ca-file=/var/lib/rancher/k3s/server/tls/server-ca.crt --secure-port=10257 --service-account-private-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --terminated-pod-gc-threshold=10 --use-service-account-credentials=true"
```
</details>

### 1.3.2 Ensure that the --profiling argument is set to false (Automated)

**Result:** PASS

**Audit:**
```bash
journalctl -D /var/log/journal  -u k3s | grep 'Running kube-controller-manager' | tail -n1 | grep 'profiling'
```

**Expected Result:** '--profiling' is equal to 'false'

<details>
<summary><b>Returned Value:</b></summary>

```console
Apr 22 20:12:19 server-0 k3s[2397]: time="2024-04-22T20:12:19Z" level=info msg="Running kube-controller-manager --allocate-node-cidrs=true --authentication-kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --authorization-kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --bind-address=127.0.0.1 --cluster-cidr=10.42.0.0/16 --cluster-signing-kube-apiserver-client-cert-file=/var/lib/rancher/k3s/server/tls/client-ca.nochain.crt --cluster-signing-kube-apiserver-client-key-file=/var/lib/rancher/k3s/server/tls/client-ca.key --cluster-signing-kubelet-client-cert-file=/var/lib/rancher/k3s/server/tls/client-ca.nochain.crt --cluster-signing-kubelet-client-key-file=/var/lib/rancher/k3s/server/tls/client-ca.key --cluster-signing-kubelet-serving-cert-file=/var/lib/rancher/k3s/server/tls/server-ca.nochain.crt --cluster-signing-kubelet-serving-key-file=/var/lib/rancher/k3s/server/tls/server-ca.key --cluster-signing-legacy-unknown-cert-file=/var/lib/rancher/k3s/server/tls/server-ca.nochain.crt --cluster-signing-legacy-unknown-key-file=/var/lib/rancher/k3s/server/tls/server-ca.key --configure-cloud-routes=false --controllers=*,tokencleaner,-service,-route,-cloud-node-lifecycle --kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --profiling=false --root-ca-file=/var/lib/rancher/k3s/server/tls/server-ca.crt --secure-port=10257 --service-account-private-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --terminated-pod-gc-threshold=10 --use-service-account-credentials=true"
```
</details>

### 1.3.3 Ensure that the --use-service-account-credentials argument is set to true (Automated)

**Result:** PASS

**Audit:**
```bash
journalctl -D /var/log/journal  -u k3s | grep 'Running kube-controller-manager' | tail -n1 | grep 'use-service-account-credentials'
```

**Expected Result:** '--use-service-account-credentials' is not equal to 'false'

<details>
<summary><b>Returned Value:</b></summary>

```console
Apr 22 20:12:19 server-0 k3s[2397]: time="2024-04-22T20:12:19Z" level=info msg="Running kube-controller-manager --allocate-node-cidrs=true --authentication-kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --authorization-kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --bind-address=127.0.0.1 --cluster-cidr=10.42.0.0/16 --cluster-signing-kube-apiserver-client-cert-file=/var/lib/rancher/k3s/server/tls/client-ca.nochain.crt --cluster-signing-kube-apiserver-client-key-file=/var/lib/rancher/k3s/server/tls/client-ca.key --cluster-signing-kubelet-client-cert-file=/var/lib/rancher/k3s/server/tls/client-ca.nochain.crt --cluster-signing-kubelet-client-key-file=/var/lib/rancher/k3s/server/tls/client-ca.key --cluster-signing-kubelet-serving-cert-file=/var/lib/rancher/k3s/server/tls/server-ca.nochain.crt --cluster-signing-kubelet-serving-key-file=/var/lib/rancher/k3s/server/tls/server-ca.key --cluster-signing-legacy-unknown-cert-file=/var/lib/rancher/k3s/server/tls/server-ca.nochain.crt --cluster-signing-legacy-unknown-key-file=/var/lib/rancher/k3s/server/tls/server-ca.key --configure-cloud-routes=false --controllers=*,tokencleaner,-service,-route,-cloud-node-lifecycle --kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --profiling=false --root-ca-file=/var/lib/rancher/k3s/server/tls/server-ca.crt --secure-port=10257 --service-account-private-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --terminated-pod-gc-threshold=10 --use-service-account-credentials=true"
```
</details>

### 1.3.4 Ensure that the --service-account-private-key-file argument is set as appropriate (Automated)

**Result:** PASS

**Audit:**
```bash
journalctl -D /var/log/journal  -u k3s | grep 'Running kube-controller-manager' | tail -n1 | grep 'service-account-private-key-file'
```

**Expected Result:** '--service-account-private-key-file' is present

<details>
<summary><b>Returned Value:</b></summary>

```console
Apr 22 20:12:19 server-0 k3s[2397]: time="2024-04-22T20:12:19Z" level=info msg="Running kube-controller-manager --allocate-node-cidrs=true --authentication-kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --authorization-kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --bind-address=127.0.0.1 --cluster-cidr=10.42.0.0/16 --cluster-signing-kube-apiserver-client-cert-file=/var/lib/rancher/k3s/server/tls/client-ca.nochain.crt --cluster-signing-kube-apiserver-client-key-file=/var/lib/rancher/k3s/server/tls/client-ca.key --cluster-signing-kubelet-client-cert-file=/var/lib/rancher/k3s/server/tls/client-ca.nochain.crt --cluster-signing-kubelet-client-key-file=/var/lib/rancher/k3s/server/tls/client-ca.key --cluster-signing-kubelet-serving-cert-file=/var/lib/rancher/k3s/server/tls/server-ca.nochain.crt --cluster-signing-kubelet-serving-key-file=/var/lib/rancher/k3s/server/tls/server-ca.key --cluster-signing-legacy-unknown-cert-file=/var/lib/rancher/k3s/server/tls/server-ca.nochain.crt --cluster-signing-legacy-unknown-key-file=/var/lib/rancher/k3s/server/tls/server-ca.key --configure-cloud-routes=false --controllers=*,tokencleaner,-service,-route,-cloud-node-lifecycle --kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --profiling=false --root-ca-file=/var/lib/rancher/k3s/server/tls/server-ca.crt --secure-port=10257 --service-account-private-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --terminated-pod-gc-threshold=10 --use-service-account-credentials=true"
```
</details>

### 1.3.5 Ensure that the --root-ca-file argument is set as appropriate (Automated)

**Result:** PASS

**Audit:**
```bash
journalctl -D /var/log/journal  -u k3s | grep 'Running kube-controller-manager' | tail -n1 | grep 'root-ca-file'
```

**Expected Result:** '--root-ca-file' is present

<details>
<summary><b>Returned Value:</b></summary>

```console
Apr 22 20:12:19 server-0 k3s[2397]: time="2024-04-22T20:12:19Z" level=info msg="Running kube-controller-manager --allocate-node-cidrs=true --authentication-kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --authorization-kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --bind-address=127.0.0.1 --cluster-cidr=10.42.0.0/16 --cluster-signing-kube-apiserver-client-cert-file=/var/lib/rancher/k3s/server/tls/client-ca.nochain.crt --cluster-signing-kube-apiserver-client-key-file=/var/lib/rancher/k3s/server/tls/client-ca.key --cluster-signing-kubelet-client-cert-file=/var/lib/rancher/k3s/server/tls/client-ca.nochain.crt --cluster-signing-kubelet-client-key-file=/var/lib/rancher/k3s/server/tls/client-ca.key --cluster-signing-kubelet-serving-cert-file=/var/lib/rancher/k3s/server/tls/server-ca.nochain.crt --cluster-signing-kubelet-serving-key-file=/var/lib/rancher/k3s/server/tls/server-ca.key --cluster-signing-legacy-unknown-cert-file=/var/lib/rancher/k3s/server/tls/server-ca.nochain.crt --cluster-signing-legacy-unknown-key-file=/var/lib/rancher/k3s/server/tls/server-ca.key --configure-cloud-routes=false --controllers=*,tokencleaner,-service,-route,-cloud-node-lifecycle --kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --profiling=false --root-ca-file=/var/lib/rancher/k3s/server/tls/server-ca.crt --secure-port=10257 --service-account-private-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --terminated-pod-gc-threshold=10 --use-service-account-credentials=true"
```
</details>

### 1.3.6 Ensure that the RotateKubeletServerCertificate argument is set to true (Automated)

**Result:** Not Applicable

**Remediation:**
Edit the Controller Manager pod specification file /etc/kubernetes/manifests/kube-controller-manager.yaml
on the control plane node and set the --feature-gates parameter to include RotateKubeletServerCertificate=true.
--feature-gates=RotateKubeletServerCertificate=true
Not Applicable.

### 1.3.7 Ensure that the --bind-address argument is set to 127.0.0.1 (Automated)

**Result:** PASS

**Audit:**
```bash
/bin/ps -ef | grep containerd | grep -v grep
```

**Expected Result:** '--bind-address' is present OR '--bind-address' is not present

<details>
<summary><b>Returned Value:</b></summary>

```console
root        2415    2397  0 Apr22 ?        00:06:36 containerd 
root        3162       1  0 Apr22 ?        00:00:30 /var/lib/rancher/k3s/data/124f36823e5696ab11a8a042537e1edbc6d69919dc7579be22caccc18ccc083f/bin/containerd-shim-runc-v2 -namespace k8s.io -id d540dd74296e1dc069f7c25dc9e76690d9afb22b404cd87c7f6217889da7aa7e -address /run/k3s/containerd/containerd.sock
root        3215       1  0 Apr22 ?        00:00:29 /var/lib/rancher/k3s/data/124f36823e5696ab11a8a042537e1edbc6d69919dc7579be22caccc18ccc083f/bin/containerd-shim-runc-v2 -namespace k8s.io -id 551b739eb5a7f61465027aaf2848954a29639e8ddf4f78a89fc9f881eb6b1378 -address /run/k3s/containerd/containerd.sock
root        3318       1  0 Apr22 ?        00:00:31 /var/lib/rancher/k3s/data/124f36823e5696ab11a8a042537e1edbc6d69919dc7579be22caccc18ccc083f/bin/containerd-shim-runc-v2 -namespace k8s.io -id dbf0b3aadcbf40fd7dc27f340051fc58979d46c2174963967ae01170c7d88f2d -address /run/k3s/containerd/containerd.sock
root        4135       1  0 Apr22 ?        00:00:41 /var/lib/rancher/k3s/data/124f36823e5696ab11a8a042537e1edbc6d69919dc7579be22caccc18ccc083f/bin/containerd-shim-runc-v2 -namespace k8s.io -id 21e58656877367076224111e51be5d30e8d316dbcb8c05a36a8432eda2d16ccb -address /run/k3s/containerd/containerd.sock
root        4300       1  0 Apr22 ?        00:00:30 /var/lib/rancher/k3s/data/124f36823e5696ab11a8a042537e1edbc6d69919dc7579be22caccc18ccc083f/bin/containerd-shim-runc-v2 -namespace k8s.io -id c1db1ac0969a14f1addcc0295ec09fa9fa4c55edac1acc4701ac18326dcb8a51 -address /run/k3s/containerd/containerd.sock
```
</details>


## 1.4 Scheduler

### 1.4.1 Ensure that the --profiling argument is set to false (Automated)

**Result:** PASS

**Audit:**
```bash
journalctl -D /var/log/journal -u k3s | grep 'Running kube-scheduler' | tail -n1
```

**Expected Result:** '--profiling' is equal to 'false'

<details>
<summary><b>Returned Value:</b></summary>

```console
Apr 22 20:12:19 server-0 k3s[2397]: time="2024-04-22T20:12:19Z" level=info msg="Running kube-scheduler --authentication-kubeconfig=/var/lib/rancher/k3s/server/cred/scheduler.kubeconfig --authorization-kubeconfig=/var/lib/rancher/k3s/server/cred/scheduler.kubeconfig --bind-address=127.0.0.1 --kubeconfig=/var/lib/rancher/k3s/server/cred/scheduler.kubeconfig --profiling=false --secure-port=10259"
```
</details>

### 1.4.2 Ensure that the --bind-address argument is set to 127.0.0.1 (Automated)

**Result:** PASS

**Audit:**
```bash
journalctl -D /var/log/journal  -u k3s | grep 'Running kube-scheduler' | tail -n1 | grep 'bind-address'
```

**Expected Result:** '--bind-address' is equal to '127.0.0.1' OR '--bind-address' is not present

<details>
<summary><b>Returned Value:</b></summary>

```console
Apr 22 20:12:19 server-0 k3s[2397]: time="2024-04-22T20:12:19Z" level=info msg="Running kube-scheduler --authentication-kubeconfig=/var/lib/rancher/k3s/server/cred/scheduler.kubeconfig --authorization-kubeconfig=/var/lib/rancher/k3s/server/cred/scheduler.kubeconfig --bind-address=127.0.0.1 --kubeconfig=/var/lib/rancher/k3s/server/cred/scheduler.kubeconfig --profiling=false --secure-port=10259"
```
</details>


## 2 Etcd Node Configuration

### 2.1 Ensure that the --cert-file and --key-file arguments are set as appropriate (Automated)

**Result:** PASS

**Audit:**
```bash
grep -A 5 'client-transport-security' /var/lib/rancher/k3s/server/db/etcd/config | grep -E 'cert-file|key-file'
```

**Expected Result:** 'cert-file' is present AND 'key-file' is present

<details>
<summary><b>Returned Value:</b></summary>

```console
  cert-file: /var/lib/rancher/k3s/server/tls/etcd/server-client.crt
  key-file: /var/lib/rancher/k3s/server/tls/etcd/server-client.key
```
</details>

### 2.2 Ensure that the --client-cert-auth argument is set to true (Automated)

**Result:** PASS

**Audit:**
```bash
grep -A 5 'client-transport-security' /var/lib/rancher/k3s/server/db/etcd/config | grep 'client-cert-auth'
```

**Expected Result:** '--client-cert-auth' is present OR 'client-cert-auth' is equal to 'true'

<details>
<summary><b>Returned Value:</b></summary>

```console
  client-cert-auth: true
```
</details>

### 2.3 Ensure that the --auto-tls argument is not set to true (Automated)

**Result:** PASS

**Audit:**
```bash
grep 'auto-tls' /var/lib/rancher/k3s/server/db/etcd/config | true
```

**Expected Result:** 'ETCD_AUTO_TLS' is not present OR 'ETCD_AUTO_TLS' is present

<details>
<summary><b>Returned Value:</b></summary>

```console
error: process ID list syntax error

Usage:
 ps [options]

 Try 'ps --help <simple|list|output|threads|misc|all>'
  or 'ps --help <s|l|o|t|m|a>'
 for additional help text.

For more details see ps(1).
cat: /proc//environ: No such file or directory
```
</details>

### 2.4 Ensure that the --peer-cert-file and --peer-key-file arguments are set as appropriate (Automated)

**Result:** PASS

**Audit:**
```bash
grep -A 5 'peer-transport-security' /var/lib/rancher/k3s/server/db/etcd/config | grep -E 'cert-file|key-file'
```

**Expected Result:** 'cert-file' is present AND 'key-file' is present

<details>
<summary><b>Returned Value:</b></summary>

```console
  cert-file: /var/lib/rancher/k3s/server/tls/etcd/peer-server-client.crt
  key-file: /var/lib/rancher/k3s/server/tls/etcd/peer-server-client.key
```
</details>

### 2.5 Ensure that the --peer-client-cert-auth argument is set to true (Automated)

**Result:** PASS

**Audit:**
```bash
grep -A 5 'peer-transport-security' /var/lib/rancher/k3s/server/db/etcd/config | grep 'client-cert-auth'
```

**Expected Result:** '--client-cert-auth' is present OR 'client-cert-auth' is equal to 'true'

<details>
<summary><b>Returned Value:</b></summary>

```console
  client-cert-auth: true
```
</details>

### 2.6 Ensure that the --peer-auto-tls argument is not set to true (Automated)

**Result:** PASS

**Audit:**
```bash
grep 'peer-auto-tls' /var/lib/rancher/k3s/server/db/etcd/config | true
```

**Expected Result:** 'ETCD_PEER_AUTO_TLS' is not present OR 'ETCD_PEER_AUTO_TLS' is present

<details>
<summary><b>Returned Value:</b></summary>

```console
error: process ID list syntax error

Usage:
 ps [options]

 Try 'ps --help <simple|list|output|threads|misc|all>'
  or 'ps --help <s|l|o|t|m|a>'
 for additional help text.

For more details see ps(1).
cat: /proc//environ: No such file or directory
```
</details>

### 2.7 Ensure that a unique Certificate Authority is used for etcd (Automated)

**Result:** PASS

**Audit:**
```bash
grep 'trusted-ca-file' /var/lib/rancher/k3s/server/db/etcd/config
```

**Expected Result:** 'trusted-ca-file' is present

<details>
<summary><b>Returned Value:</b></summary>

```console
  trusted-ca-file: /var/lib/rancher/k3s/server/tls/etcd/server-ca.crt
  trusted-ca-file: /var/lib/rancher/k3s/server/tls/etcd/peer-ca.crt
```
</details>


## 4.1 Worker Node Configuration Files

### 4.1.1 Ensure that the kubelet service file permissions are set to 600 or more restrictive (Automated)

**Result:** Not Applicable

**Remediation:**
Run the below command (based on the file location on your system) on the each worker node.
For example, chmod 600 /etc/systemd/system/kubelet.service.d/10-kubeadm.conf
Not Applicable - All configuration is passed in as arguments at container run time.

### 4.1.2 Ensure that the kubelet service file ownership is set to root:root (Automated)

**Result:** Not Applicable

**Remediation:**
Run the below command (based on the file location on your system) on the each worker node.
For example,
chown root:root /etc/systemd/system/kubelet.service.d/10-kubeadm.conf
Not Applicable.
 All configuration is passed in as arguments at container run time.

### 4.1.3 If proxy kubeconfig file exists ensure permissions are set to 600 or more restrictive (Manual)

**Result:** WARN

**Remediation:**
Run the below command (based on the file location on your system) on the each worker node.
For example,
chmod 600 /var/lib/rancher/k3s/agent/kubeproxy.kubeconfig

### 4.1.4 If proxy kubeconfig file exists ensure ownership is set to root:root (Manual)

**Result:** PASS

**Audit:**
```bash
/bin/sh -c 'if test -e /var/lib/rancher/k3s/agent/kubeproxy.kubeconfig; then stat -c %U:%G /var/lib/rancher/k3s/agent/kubeproxy.kubeconfig; fi' 
```

**Expected Result:** 'root:root' is present

<details>
<summary><b>Returned Value:</b></summary>

```console
root:root
```
</details>

### 4.1.5 Ensure that the --kubeconfig kubelet.conf file permissions are set to 600 or more restrictive (Automated)

**Result:** PASS

**Audit:**
```bash
/bin/sh -c 'if test -e /var/lib/rancher/k3s/server/cred/admin.kubeconfig; then stat -c permissions=%a /var/lib/rancher/k3s/server/cred/admin.kubeconfig; fi' 
```

**Expected Result:** permissions has permissions 600, expected 600 or more restrictive

<details>
<summary><b>Returned Value:</b></summary>

```console
permissions=600
```
</details>

### 4.1.6 Ensure that the --kubeconfig kubelet.conf file ownership is set to root:root (Automated)

**Result:** PASS

**Audit:**
```bash
stat -c %U:%G /var/lib/rancher/k3s/agent/kubelet.kubeconfig
```

**Expected Result:** 'root:root' is present

<details>
<summary><b>Returned Value:</b></summary>

```console
root:root
```
</details>

### 4.1.7 Ensure that the certificate authorities file permissions are set to 600 or more restrictive (Manual)

**Result:** PASS

**Audit:**
```bash
stat -c permissions=%a /var/lib/rancher/k3s/agent/client-ca.crt
```

**Expected Result:** permissions has permissions 600, expected 600 or more restrictive

<details>
<summary><b>Returned Value:</b></summary>

```console
permissions=600
```
</details>

### 4.1.8 Ensure that the client certificate authorities file ownership is set to root:root (Manual)

**Result:** PASS

**Audit:**
```bash
stat -c %U:%G /var/lib/rancher/k3s/agent/client-ca.crt
```

**Expected Result:** 'root:root' is equal to 'root:root'

<details>
<summary><b>Returned Value:</b></summary>

```console
root:root
```
</details>

### 4.1.9 Ensure that the kubelet --config configuration file has permissions set to 600 or more restrictive (Automated)

**Result:** PASS

**Audit:**
```bash
/bin/sh -c 'if test -e /var/lib/rancher/k3s/agent/kubelet.kubeconfig; then stat -c permissions=%a /var/lib/rancher/k3s/agent/kubelet.kubeconfig; fi' 
```

**Expected Result:** permissions has permissions 600, expected 600 or more restrictive

<details>
<summary><b>Returned Value:</b></summary>

```console
permissions=600
```
</details>

### 4.1.10 Ensure that the kubelet --config configuration file ownership is set to root:root (Automated)

**Result:** PASS

**Audit:**
```bash
/bin/sh -c 'if test -e /var/lib/rancher/k3s/agent/kubelet.kubeconfig; then stat -c %U:%G /var/lib/rancher/k3s/agent/kubelet.kubeconfig; fi' 
```

**Expected Result:** 'root:root' is present

<details>
<summary><b>Returned Value:</b></summary>

```console
root:root
```
</details>


## 4.2 Kubelet

### 4.2.1 Ensure that the --anonymous-auth argument is set to false (Automated)

**Result:** PASS

**Audit:**
```bash
/bin/sh -c 'if test $(journalctl -D /var/log/journal -u k3s | grep "Running kube-apiserver" | wc -l) -gt 0; then journalctl -D /var/log/journal -u k3s | grep "Running kube-apiserver" | tail -n1 | grep "anonymous-auth" | grep -v grep; else echo "--anonymous-auth=false"; fi' 
```

**Expected Result:** '--anonymous-auth' is equal to 'false'

<details>
<summary><b>Returned Value:</b></summary>

```console
Apr 22 20:12:19 server-0 k3s[2397]: time="2024-04-22T20:12:19Z" level=info msg="Running kube-apiserver --admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --encryption-provider-config-automatic-reload=true --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-lookup=true --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

### 4.2.2 Ensure that the --authorization-mode argument is not set to AlwaysAllow (Automated)

**Result:** PASS

**Audit:**
```bash
/bin/sh -c 'if test $(journalctl -D /var/log/journal -u k3s | grep "Running kube-apiserver" | wc -l) -gt 0; then journalctl -D /var/log/journal -u k3s | grep "Running kube-apiserver" | tail -n1 | grep "authorization-mode" | grep -v grep; else echo "--authorization-mode=Webhook"; fi' 
```

**Expected Result:** '--authorization-mode' does not have 'AlwaysAllow'

<details>
<summary><b>Returned Value:</b></summary>

```console
Apr 22 20:12:19 server-0 k3s[2397]: time="2024-04-22T20:12:19Z" level=info msg="Running kube-apiserver --admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --encryption-provider-config-automatic-reload=true --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-lookup=true --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

### 4.2.3 Ensure that the --client-ca-file argument is set as appropriate (Automated)

**Result:** PASS

**Audit:**
```bash
/bin/sh -c 'if test $(journalctl -D /var/log/journal -u k3s | grep "Running kube-apiserver" | wc -l) -gt 0; then journalctl -D /var/log/journal -u k3s | grep "Running kube-apiserver" | tail -n1 | grep "client-ca-file" | grep -v grep; else echo "--client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt"; fi' 
```

**Expected Result:** '--client-ca-file' is present

<details>
<summary><b>Returned Value:</b></summary>

```console
Apr 22 20:12:19 server-0 k3s[2397]: time="2024-04-22T20:12:19Z" level=info msg="Running kube-apiserver --admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --encryption-provider-config-automatic-reload=true --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-lookup=true --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

### 4.2.4 Verify that the --read-only-port argument is set to 0 (Manual)

**Result:** PASS

**Audit:**
```bash
journalctl -D /var/log/journal -u k3s -u k3s-agent | grep 'Running kubelet' | tail -n1 | grep 'read-only-port' 
```

**Expected Result:** '--read-only-port' is equal to '0' OR '--read-only-port' is not present

<details>
<summary><b>Returned Value:</b></summary>

```console
Apr 22 20:12:21 server-0 k3s[2397]: time="2024-04-22T20:12:21Z" level=info msg="Running kubelet --address=0.0.0.0 --allowed-unsafe-sysctls=net.ipv4.ip_forward,net.ipv6.conf.all.forwarding --anonymous-auth=false --authentication-token-webhook=true --authorization-mode=Webhook --cgroup-driver=systemd --client-ca-file=/var/lib/rancher/k3s/agent/client-ca.crt --cloud-provider=external --cluster-dns=10.43.0.10 --cluster-domain=cluster.local --container-runtime-endpoint=unix:///run/k3s/containerd/containerd.sock --containerd=/run/k3s/containerd/containerd.sock --event-qps=0 --eviction-hard=imagefs.available<5%,nodefs.available<5% --eviction-minimum-reclaim=imagefs.available=10%,nodefs.available=10% --fail-swap-on=false --feature-gates=CloudDualStackNodeIPs=true --healthz-bind-address=127.0.0.1 --hostname-override=server-0 --kubeconfig=/var/lib/rancher/k3s/agent/kubelet.kubeconfig --make-iptables-util-chains=true --node-ip=10.10.10.100 --node-labels= --pod-infra-container-image=rancher/mirrored-pause:3.6 --pod-manifest-path=/var/lib/rancher/k3s/agent/pod-manifests --protect-kernel-defaults=true --read-only-port=0 --resolv-conf=/run/systemd/resolve/resolv.conf --serialize-image-pulls=false --streaming-connection-idle-timeout=5m --tls-cert-file=/var/lib/rancher/k3s/agent/serving-kubelet.crt --tls-private-key-file=/var/lib/rancher/k3s/agent/serving-kubelet.key"
```
</details>

### 4.2.5 Ensure that the --streaming-connection-idle-timeout argument is not set to 0 (Manual)

**Result:** PASS

**Audit:**
```bash
journalctl -D /var/log/journal -u k3s -u k3s-agent | grep 'Running kubelet' | tail -n1 | grep 'streaming-connection-idle-timeout'
```

**Expected Result:** '--streaming-connection-idle-timeout' is not equal to '0' OR '--streaming-connection-idle-timeout' is not present

<details>
<summary><b>Returned Value:</b></summary>

```console
Apr 22 20:12:21 server-0 k3s[2397]: time="2024-04-22T20:12:21Z" level=info msg="Running kubelet --address=0.0.0.0 --allowed-unsafe-sysctls=net.ipv4.ip_forward,net.ipv6.conf.all.forwarding --anonymous-auth=false --authentication-token-webhook=true --authorization-mode=Webhook --cgroup-driver=systemd --client-ca-file=/var/lib/rancher/k3s/agent/client-ca.crt --cloud-provider=external --cluster-dns=10.43.0.10 --cluster-domain=cluster.local --container-runtime-endpoint=unix:///run/k3s/containerd/containerd.sock --containerd=/run/k3s/containerd/containerd.sock --event-qps=0 --eviction-hard=imagefs.available<5%,nodefs.available<5% --eviction-minimum-reclaim=imagefs.available=10%,nodefs.available=10% --fail-swap-on=false --feature-gates=CloudDualStackNodeIPs=true --healthz-bind-address=127.0.0.1 --hostname-override=server-0 --kubeconfig=/var/lib/rancher/k3s/agent/kubelet.kubeconfig --make-iptables-util-chains=true --node-ip=10.10.10.100 --node-labels= --pod-infra-container-image=rancher/mirrored-pause:3.6 --pod-manifest-path=/var/lib/rancher/k3s/agent/pod-manifests --protect-kernel-defaults=true --read-only-port=0 --resolv-conf=/run/systemd/resolve/resolv.conf --serialize-image-pulls=false --streaming-connection-idle-timeout=5m --tls-cert-file=/var/lib/rancher/k3s/agent/serving-kubelet.crt --tls-private-key-file=/var/lib/rancher/k3s/agent/serving-kubelet.key"
```
</details>

### 4.2.6 Ensure that the --make-iptables-util-chains argument is set to true (Automated)

**Result:** PASS

**Audit:**
```bash
journalctl -D /var/log/journal -u k3s -u k3s-agent | grep 'Running kubelet' | tail -n1 | grep 'make-iptables-util-chains'
```

**Expected Result:** '--make-iptables-util-chains' is equal to 'true' OR '--make-iptables-util-chains' is not present

<details>
<summary><b>Returned Value:</b></summary>

```console
Apr 22 20:12:21 server-0 k3s[2397]: time="2024-04-22T20:12:21Z" level=info msg="Running kubelet --address=0.0.0.0 --allowed-unsafe-sysctls=net.ipv4.ip_forward,net.ipv6.conf.all.forwarding --anonymous-auth=false --authentication-token-webhook=true --authorization-mode=Webhook --cgroup-driver=systemd --client-ca-file=/var/lib/rancher/k3s/agent/client-ca.crt --cloud-provider=external --cluster-dns=10.43.0.10 --cluster-domain=cluster.local --container-runtime-endpoint=unix:///run/k3s/containerd/containerd.sock --containerd=/run/k3s/containerd/containerd.sock --event-qps=0 --eviction-hard=imagefs.available<5%,nodefs.available<5% --eviction-minimum-reclaim=imagefs.available=10%,nodefs.available=10% --fail-swap-on=false --feature-gates=CloudDualStackNodeIPs=true --healthz-bind-address=127.0.0.1 --hostname-override=server-0 --kubeconfig=/var/lib/rancher/k3s/agent/kubelet.kubeconfig --make-iptables-util-chains=true --node-ip=10.10.10.100 --node-labels= --pod-infra-container-image=rancher/mirrored-pause:3.6 --pod-manifest-path=/var/lib/rancher/k3s/agent/pod-manifests --protect-kernel-defaults=true --read-only-port=0 --resolv-conf=/run/systemd/resolve/resolv.conf --serialize-image-pulls=false --streaming-connection-idle-timeout=5m --tls-cert-file=/var/lib/rancher/k3s/agent/serving-kubelet.crt --tls-private-key-file=/var/lib/rancher/k3s/agent/serving-kubelet.key"
```
</details>

### 4.2.7 Ensure that the --hostname-override argument is not set (Manual)

**Result:** Not Applicable

**Remediation:**
Edit the kubelet service file /etc/systemd/system/kubelet.service.d/10-kubeadm.conf
on each worker node and remove the --hostname-override argument from the
KUBELET_SYSTEM_PODS_ARGS variable.
Based on your system, restart the kubelet service. For example,
systemctl daemon-reload
systemctl restart kubelet.service
Not Applicable.

### 4.2.8 Ensure that the eventRecordQPS argument is set to a level which ensures appropriate event capture (Manual)

**Result:** PASS

**Audit:**
```bash
/bin/ps -fC containerd
```

**Expected Result:** 'eventRecordQPS' is present OR 'eventRecordQPS' is not present

<details>
<summary><b>Returned Value:</b></summary>

```console
apiVersion: v1
clusters:
- cluster:
    server: https://127.0.0.1:6443
    certificate-authority: /var/lib/rancher/k3s/agent/server-ca.crt
  name: local
contexts:
- context:
    cluster: local
    namespace: default
    user: user
  name: Default
current-context: Default
kind: Config
preferences: {}
users:
- name: user
  user:
    client-certificate: /var/lib/rancher/k3s/agent/client-kubelet.crt
    client-key: /var/lib/rancher/k3s/agent/client-kubelet.key
```
</details>

### 4.2.9 Ensure that the --tls-cert-file and --tls-private-key-file arguments are set as appropriate (Manual)

**Result:** Not Applicable

**Remediation:**
If using a Kubelet config file, edit the file to set `tlsCertFile` to the location
of the certificate file to use to identify this Kubelet, and `tlsPrivateKeyFile`
to the location of the corresponding private key file.
If using command line arguments, edit the kubelet service file
/etc/systemd/system/kubelet.service.d/10-kubeadm.conf on each worker node and
set the below parameters in KUBELET_CERTIFICATE_ARGS variable.
--tls-cert-file=&lt;path/to/tls-certificate-file&gt;
--tls-private-key-file=&lt;path/to/tls-key-file&gt;
Based on your system, restart the kubelet service. For example,
systemctl daemon-reload
systemctl restart kubelet.service
Permissive - When generating serving certificates, functionality could break in conjunction with hostname overrides which are required for certain cloud providers.

### 4.2.10 Ensure that the --rotate-certificates argument is not set to false (Manual)

**Result:** PASS

**Audit:**
```bash
/bin/ps -fC containerd
```

**Expected Result:** 'rotateCertificates' is present OR 'rotateCertificates' is not present

<details>
<summary><b>Returned Value:</b></summary>

```console
apiVersion: v1
clusters:
- cluster:
    server: https://127.0.0.1:6443
    certificate-authority: /var/lib/rancher/k3s/agent/server-ca.crt
  name: local
contexts:
- context:
    cluster: local
    namespace: default
    user: user
  name: Default
current-context: Default
kind: Config
preferences: {}
users:
- name: user
  user:
    client-certificate: /var/lib/rancher/k3s/agent/client-kubelet.crt
    client-key: /var/lib/rancher/k3s/agent/client-kubelet.key
```
</details>

### 4.2.11 Verify that the RotateKubeletServerCertificate argument is set to true (Manual)

**Result:** PASS

**Audit:**
```bash
/bin/ps -fC containerd
```

**Expected Result:** 'featureGates.RotateKubeletServerCertificate' is present OR 'featureGates.RotateKubeletServerCertificate' is not present

<details>
<summary><b>Returned Value:</b></summary>

```console
apiVersion: v1
clusters:
- cluster:
    server: https://127.0.0.1:6443
    certificate-authority: /var/lib/rancher/k3s/agent/server-ca.crt
  name: local
contexts:
- context:
    cluster: local
    namespace: default
    user: user
  name: Default
current-context: Default
kind: Config
preferences: {}
users:
- name: user
  user:
    client-certificate: /var/lib/rancher/k3s/agent/client-kubelet.crt
    client-key: /var/lib/rancher/k3s/agent/client-kubelet.key
```
</details>

### 4.2.12 Ensure that the Kubelet only makes use of Strong Cryptographic Ciphers (Manual)

**Result:** WARN

**Remediation:**
If using a Kubelet config file, edit the file to set `TLSCipherSuites` to
TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_AES_128_GCM_SHA256
or to a subset of these values.
If using executable arguments, edit the kubelet service file
/etc/systemd/system/kubelet.service.d/10-kubeadm.conf on each worker node and
set the --tls-cipher-suites parameter as follows, or to a subset of these values.
--tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_AES_128_GCM_SHA256
Based on your system, restart the kubelet service. For example:
systemctl daemon-reload
systemctl restart kubelet.service

### 4.2.13 Ensure that a limit is set on pod PIDs (Manual)

**Result:** WARN

**Remediation:**
Decide on an appropriate level for this parameter and set it,
either via the --pod-max-pids command line parameter or the PodPidsLimit configuration file setting.


## 5.1 RBAC and Service Accounts

### 5.1.1 Ensure that the cluster-admin role is only used where required (Manual)

**Result:** WARN

**Remediation:**
Identify all clusterrolebindings to the cluster-admin role. Check if they are used and
if they need this role or if they could use a role with fewer privileges.
Where possible, first bind users to a lower privileged role and then remove the
clusterrolebinding to the cluster-admin role :
kubectl delete clusterrolebinding [name]

### 5.1.2 Minimize access to secrets (Manual)

**Result:** WARN

**Remediation:**
Where possible, remove get, list and watch access to Secret objects in the cluster.

### 5.1.3 Minimize wildcard use in Roles and ClusterRoles (Manual)

**Result:** WARN

**Remediation:**
Where possible replace any use of wildcards in clusterroles and roles with specific
objects or actions.

### 5.1.4 Minimize access to create pods (Manual)

**Result:** WARN

**Remediation:**
Where possible, remove create access to pod objects in the cluster.

### 5.1.5 Ensure that default service accounts are not actively used. (Manual)

**Result:** WARN

**Remediation:**
Create explicit service accounts wherever a Kubernetes workload requires specific access
to the Kubernetes API server.
Modify the configuration of each default service account to include this value
automountServiceAccountToken: false

### 5.1.6 Ensure that Service Account Tokens are only mounted where necessary (Manual)

**Result:** WARN

**Remediation:**
Modify the definition of pods and service accounts which do not need to mount service
account tokens to disable it.

### 5.1.7 Avoid use of system:masters group (Manual)

**Result:** WARN

**Remediation:**
Remove the system:masters group from all users in the cluster.

### 5.1.8 Limit use of the Bind, Impersonate and Escalate permissions in the Kubernetes cluster (Manual)

**Result:** WARN

**Remediation:**
Where possible, remove the impersonate, bind and escalate rights from subjects.

### 5.1.9 Minimize access to create persistent volumes (Manual)

**Result:** WARN

**Remediation:**
Where possible, remove create access to PersistentVolume objects in the cluster.

### 5.1.10 Minimize access to the proxy sub-resource of nodes (Manual)

**Result:** WARN

**Remediation:**
Where possible, remove access to the proxy sub-resource of node objects.

### 5.1.11 Minimize access to the approval sub-resource of certificatesigningrequests objects (Manual)

**Result:** WARN

**Remediation:**
Where possible, remove access to the approval sub-resource of certificatesigningrequest objects.

### 5.1.12 Minimize access to webhook configuration objects (Manual)

**Result:** WARN

**Remediation:**
Where possible, remove access to the validatingwebhookconfigurations or mutatingwebhookconfigurations objects

### 5.1.13 Minimize access to the service account token creation (Manual)

**Result:** WARN

**Remediation:**
Where possible, remove access to the token sub-resource of serviceaccount objects.


## 5.2 Pod Security Standards


### 5.2.1 Ensure that the cluster has at least one active policy control mechanism in place (Manual)

**Result:** WARN

**Remediation:**
Ensure that either Pod Security Admission or an external policy control system is in place
for every namespace which contains user workloads.

### 5.2.2 Minimize the admission of privileged containers (Manual)

**Result:** WARN

**Remediation:**
Add policies to each namespace in the cluster which has user workloads to restrict the
admission of privileged containers.

### 5.2.3 Minimize the admission of containers wishing to share the host process ID namespace (Automated)

**Result:** WARN

**Remediation:**
Add policies to each namespace in the cluster which has user workloads to restrict the
admission of `hostPID` containers.

### 5.2.4 Minimize the admission of containers wishing to share the host IPC namespace (Automated)

**Result:** WARN

**Remediation:**
Add policies to each namespace in the cluster which has user workloads to restrict the
admission of `hostIPC` containers.

### 5.2.5 Minimize the admission of containers wishing to share the host network namespace (Automated)

**Result:** WARN

**Remediation:**
Add policies to each namespace in the cluster which has user workloads to restrict the
admission of `hostNetwork` containers.

### 5.2.6 Minimize the admission of containers with allowPrivilegeEscalation (Automated)

**Result:** WARN

**Remediation:**
Add policies to each namespace in the cluster which has user workloads to restrict the
admission of containers with `.spec.allowPrivilegeEscalation` set to `true`.

### 5.2.7 Minimize the admission of root containers (Automated)

**Result:** WARN

**Remediation:**
Create a policy for each namespace in the cluster, ensuring that either `MustRunAsNonRoot`
or `MustRunAs` with the range of UIDs not including 0, is set.

### 5.2.8 Minimize the admission of containers with the NET_RAW capability (Automated)

**Result:** WARN

**Remediation:**
Add policies to each namespace in the cluster which has user workloads to restrict the
admission of containers with the `NET_RAW` capability.

### 5.2.9 Minimize the admission of containers with added capabilities (Automated)

**Result:** WARN

**Remediation:**
Ensure that `allowedCapabilities` is not present in policies for the cluster unless
it is set to an empty array.

### 5.2.10 Minimize the admission of containers with capabilities assigned (Manual)

**Result:** WARN

**Remediation:**
Review the use of capabilities in applications running on your cluster. Where a namespace
contains applicaions which do not require any Linux capabities to operate consider adding
a PSP which forbids the admission of containers which do not drop all capabilities.

### 5.2.11 Minimize the admission of Windows HostProcess containers (Manual)

**Result:** WARN

**Remediation:**
Add policies to each namespace in the cluster which has user workloads to restrict the
admission of containers that have `.securityContext.windowsOptions.hostProcess` set to `true`.

### 5.2.12 Minimize the admission of HostPath volumes (Manual)

**Result:** WARN

**Remediation:**
Add policies to each namespace in the cluster which has user workloads to restrict the
admission of containers with `hostPath` volumes.

### 5.2.13 Minimize the admission of containers which use HostPorts (Manual)

**Result:** WARN

**Remediation:**
Add policies to each namespace in the cluster which has user workloads to restrict the
admission of containers which use `hostPort` sections.

## 5.3 Network Policies and CNI



### 5.3.1 Ensure that the CNI in use supports NetworkPolicies (Manual)

**Result:** WARN

**Remediation:**
If the CNI plugin in use does not support network policies, consideration should be given to
making use of a different plugin, or finding an alternate mechanism for restricting traffic
in the Kubernetes cluster.

### 5.3.2 Ensure that all Namespaces have NetworkPolicies defined (Manual)

**Result:** WARN

**Remediation:**
Follow the documentation and create NetworkPolicy objects as you need them.



## 5.4 Secrets Management

### 5.4.1 Prefer using Secrets as files over Secrets as environment variables (Manual)

**Result:** WARN

**Remediation:**
If possible, rewrite application code to read Secrets from mounted secret files, rather than
from environment variables.

### 5.4.2 Consider external secret storage (Manual)

**Result:** WARN

**Remediation:**
Refer to the Secrets management options offered by your cloud provider or a third-party
secrets management solution.


## 5.5 Extensible Admission Control

### 5.5.1 Configure Image Provenance using ImagePolicyWebhook admission controller (Manual)

**Result:** WARN

**Remediation:**
Follow the Kubernetes documentation and setup image provenance.


## 5.7 General Policies

### 5.7.1 Create administrative boundaries between resources using namespaces (Manual)

**Result:** WARN

**Remediation:**
Follow the documentation and create namespaces for objects in your deployment as you need
them.

### 5.7.2 Ensure that the seccomp profile is set to docker/default in your Pod definitions (Manual)

**Result:** WARN

**Remediation:**
Use `securityContext` to enable the docker/default seccomp profile in your pod definitions.
An example is as below:
  securityContext:
    seccompProfile:
      type: RuntimeDefault

### 5.7.3 Apply SecurityContext to your Pods and Containers (Manual)

**Result:** WARN

**Remediation:**
Follow the Kubernetes documentation and apply SecurityContexts to your Pods. For a
suggested list of SecurityContexts, you may refer to the CIS Security Benchmark for Docker
Containers.

### 5.7.4 The default namespace should not be used (Manual)

**Result:** WARN

**Remediation:**
Ensure that namespaces are created to allow for appropriate segregation of Kubernetes
resources and that all new resources are created in a specific namespace.

