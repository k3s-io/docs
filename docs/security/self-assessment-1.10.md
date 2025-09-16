---
title: CIS 1.10 Self Assessment Guide
---

## Overview

This document is a companion to the [K3s security hardening guide](hardening-guide.md). The hardening guide provides prescriptive guidance for hardening a production installation of K3s, and this benchmark guide is meant to help you evaluate the level of security of the hardened cluster against each control in the CIS Kubernetes Benchmark. It is to be used by K3s operators, security teams, auditors, and decision-makers.

This guide is specific to the **v1.28-v1.33** release line of K3s and the **v1.10** release of the CIS Kubernetes Benchmark.

For more information about each control, including detailed descriptions and remediations for failing tests, you can refer to the corresponding section of the CIS Kubernetes Benchmark v1.9. You can download the benchmark, after creating a free account, in [Center for Internet Security (CIS)](https://www.cisecurity.org/benchmark/kubernetes).

### Testing controls methodology

Each control in the CIS Kubernetes Benchmark was evaluated against a K3s cluster that was configured according to the accompanying hardening guide.

Where control audits differ from the original CIS benchmark, the audit commands specific to K3s are provided for testing.

These are the possible results for each control:

- **Pass** - The K3s cluster under test passed the audit outlined in the benchmark.
- **Not Applicable** - The control is not applicable to K3s because of how it is designed to operate. The remediation section will explain why this is so.
- **Warn** - The control is manual in the CIS benchmark and it depends on the cluster's use case or some other factor that must be determined by the cluster operator. These controls have been evaluated to ensure K3s does not prevent their implementation, but no further configuration or auditing of the cluster under test has been performed.

This guide makes the assumption that K3s is running as a Systemd unit. Your installation may vary and will require you to adjust the "audit" commands to fit your scenario.

## 1.1 Control Plane Node Configuration Files

### 1.1.1 Ensure that the API server pod specification file permissions are set to 600 or more restrictive (Automated)

**Result:** Not Applicable

**Rationale:**

By default, K3s embeds the api server within the k3s process. There is no API server pod specification file.

### 1.1.2 Ensure that the API server pod specification file ownership is set to root:root (Automated)

**Result:** Not Applicable

**Rationale:**

By default, K3s embeds the api server within the k3s process. There is no API server pod specification file.

### 1.1.3 Ensure that the controller manager pod specification file permissions are set to 600 or more restrictive (Automated)

**Result:** Not Applicable

**Rationale:**

By default, K3s embeds the controller manager within the k3s process. There is no controller manager pod specification file.

### 1.1.4 Ensure that the controller manager pod specification file ownership is set to root:root (Automated)

**Result:** Not Applicable

**Rationale:**

By default, K3s embeds the controller manager within the k3s process. There is no controller manager pod specification file.

### 1.1.5 Ensure that the scheduler pod specification file permissions are set to 600 or more restrictive (Automated)

**Result:** Not Applicable

**Rationale:**

By default, K3s embeds the scheduler within the k3s process. There is no scheduler pod specification file.

### 1.1.6 Ensure that the scheduler pod specification file ownership is set to root:root (Automated)

**Result:** Not Applicable

**Rationale:**

By default, K3s embeds the scheduler within the k3s process. There is no scheduler pod specification file.

### 1.1.7 Ensure that the etcd pod specification file permissions are set to 600 or more restrictive (Automated)

**Result:** Not Applicable

**Rationale:**

By default, K3s embeds etcd within the k3s process. There is no etcd pod specification file.

### 1.1.8 Ensure that the etcd pod specification file ownership is set to root:root (Automated)

**Result:** Not Applicable

**Rationale:**

By default, K3s embeds etcd within the k3s process. There is no etcd pod specification file.

### 1.1.9 Ensure that the Container Network Interface file permissions are set to 600 or more restrictive (Automated)

**Result:** PASS

**Audit:**
```bash
find /var/lib/cni/networks -type f ! -name lock 2> /dev/null | xargs --no-run-if-empty stat -c permissions=%a
```

**Expected Result:** permissions has permissions 600, expected 600 or more restrictive

<details>
<summary><b>Returned Value:</b></summary>

```log
permissions=600
permissions=600
permissions=600
permissions=600
permissions=600
permissions=600
```
</details>

<details>
<summary><b>Remediation:</b></summary>

By default, K3s sets the CNI file permissions to 600.
Note that for many CNIs, a lock file is created with permissions 750. This is expected and can be ignored.
If you modify your CNI configuration, ensure that the permissions are set to 600.
For example, `chmod 600 /var/lib/cni/networks/<filename>`
</details>

### 1.1.10 Ensure that the Container Network Interface file ownership is set to root:root (Automated)

**Result:** PASS

**Audit:**
```bash
find /var/lib/cni/networks -type f 2> /dev/null | xargs --no-run-if-empty stat -c %U:%G
```

**Expected Result:** 'root:root' is present

<details>
<summary><b>Returned Value:</b></summary>

```log
root:root
root:root
root:root
root:root
root:root
root:root
root:root
```
</details>

<details>
<summary><b>Remediation:</b></summary>

Run the below command (based on the file location on your system) on the control plane node.
For example,
`chown root:root /var/lib/cni/networks/<filename>`
</details>

### 1.1.11 Ensure that the etcd data directory permissions are set to 700 or more restrictive (Manual)

**Result:** PASS

**Audit:**
```bash
stat -c permissions=%a /var/lib/rancher/k3s/server/db/etcd
```

**Expected Result:** permissions has permissions 700, expected 700 or more restrictive

<details>
<summary><b>Returned Value:</b></summary>

```log
permissions=700
```
</details>

<details>
<summary><b>Remediation:</b></summary>

Not applicable for the non-etcd cluster. If running master only with no etcd role, this check is not applicable.
If controlplane and etcd roles are present on the same nodes but this check is warn then
On the etcd server node, get the etcd data directory, passed as an argument --data-dir,
from the command 'ps -ef | grep etcd'.
Run the below command (based on the etcd data directory found above). For example,
`chmod 700 /var/lib/rancher/k3s/server/db/etcd`
</details>

### 1.1.12 Ensure that the etcd data directory ownership is set to etcd:etcd (Automated)

**Result:** Not Applicable

**Rationale:**

For K3s, etcd is embedded within the k3s process. There is no separate etcd process.
Therefore the etcd data directory ownership is managed by the k3s process and should be root:root.

### 1.1.13 Ensure that the admin.conf file permissions are set to 600 or more restrictive (Automated)

**Result:** PASS

**Audit:**
```bash
/bin/sh -c 'if test -e /var/lib/rancher/k3s/server/cred/admin.kubeconfig; then stat -c permissions=%a /var/lib/rancher/k3s/server/cred/admin.kubeconfig; fi'
```

**Expected Result:** permissions has permissions 600, expected 600 or more restrictive

<details>
<summary><b>Returned Value:</b></summary>

```log
permissions=600
```
</details>

<details>
<summary><b>Remediation:</b></summary>

Run the below command (based on the file location on your system) on the control plane node.
For example, `chmod 600 /var/lib/rancher/k3s/server/cred/admin.kubeconfig`
</details>

### 1.1.14 Ensure that the admin.conf file ownership is set to root:root (Automated)

**Result:** PASS

**Audit:**
```bash
/bin/sh -c 'if test -e /var/lib/rancher/k3s/server/cred/admin.kubeconfig; then stat -c %U:%G /var/lib/rancher/k3s/server/cred/admin.kubeconfig; fi'
```

**Expected Result:** 'root:root' is equal to 'root:root'

<details>
<summary><b>Returned Value:</b></summary>

```log
root:root
```
</details>

<details>
<summary><b>Remediation:</b></summary>

Run the below command (based on the file location on your system) on the control plane node.
For example, `chown root:root /var/lib/rancher/k3s/server/cred/admin.kubeconfig`
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

```log
permissions=600
```
</details>

<details>
<summary><b>Remediation:</b></summary>

Run the below command (based on the file location on your system) on the control plane node.
For example,
`chmod 600 /var/lib/rancher/k3s/server/cred/scheduler.kubeconfig`
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

```log
root:root
```
</details>

<details>
<summary><b>Remediation:</b></summary>

Run the below command (based on the file location on your system) on the control plane node.
For example,
`chown root:root /var/lib/rancher/k3s/server/cred/scheduler.kubeconfig`
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

```log
permissions=600
```
</details>

<details>
<summary><b>Remediation:</b></summary>

Run the below command (based on the file location on your system) on the control plane node.
For example,
`chmod 600 /var/lib/rancher/k3s/server/cred/controller.kubeconfig`
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

```log
root:root
```
</details>

<details>
<summary><b>Remediation:</b></summary>

Run the below command (based on the file location on your system) on the control plane node.
For example,
`chown root:root /var/lib/rancher/k3s/server/cred/controller.kubeconfig`
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

```log
root:root
```
</details>

<details>
<summary><b>Remediation:</b></summary>

Run the below command (based on the file location on your system) on the control plane node.
For example,
`chown -R root:root /var/lib/rancher/k3s/server/tls`
</details>

### 1.1.20 Ensure that the Kubernetes PKI certificate file permissions are set to 600 or more restrictive (Manual)

**Result:** WARN

**Remediation:**
Run the below command (based on the file location on your system) on the master node.
For example,
`chmod -R 600 /var/lib/rancher/k3s/server/tls/*.crt`

### 1.1.21 Ensure that the Kubernetes PKI key file permissions are set to 600 (Automated)

**Result:** PASS

**Audit:**
```bash
/bin/sh -c 'stat -c permissions=%a /var/lib/rancher/k3s/server/tls/*.key'
```

**Expected Result:** permissions has permissions 600, expected 600 or more restrictive

<details>
<summary><b>Returned Value:</b></summary>

```log
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

<details>
<summary><b>Remediation:</b></summary>

Run the below command (based on the file location on your system) on the master node.
For example,
`chmod -R 600 /var/lib/rancher/k3s/server/tls/*.key`
</details>

## 1.2 API Server

### 1.2.1 Ensure that the --anonymous-auth argument is set to false (Automated)

**Result:** PASS

**Audit:**
```bash
journalctl -m -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep 'anonymous-auth'
```

**Expected Result:** '--anonymous-auth' is equal to 'false'

<details>
<summary><b>Returned Value:</b></summary>

```log
Sep 11 17:22:08 server-0 k3s[2234]: time="2025-09-11T17:22:08Z" level=info msg="Running kube-apiserver --admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --encryption-provider-config-automatic-reload=true --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

<details>
<summary><b>Remediation:</b></summary>

By default, K3s sets the --anonymous-auth argument to false.
If this check fails, edit the K3s config file /etc/rancher/k3s/config.yaml and remove anything similar to below.
```
kube-apiserver-arg:
  - "anonymous-auth=true"
```
</details>

### 1.2.2 Ensure that the --token-auth-file parameter is not set (Automated)

**Result:** PASS

**Audit:**
```bash
journalctl -m -u k3s | grep 'Running kube-apiserver' | tail -n1
```

**Expected Result:** '--token-auth-file' is not present

<details>
<summary><b>Returned Value:</b></summary>

```log
Sep 11 17:22:08 server-0 k3s[2234]: time="2025-09-11T17:22:08Z" level=info msg="Running kube-apiserver --admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --encryption-provider-config-automatic-reload=true --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

<details>
<summary><b>Remediation:</b></summary>

Follow the documentation and configure alternate mechanisms for authentication.
If this check fails, edit the K3s config file /etc/rancher/k3s/config.yaml and remove anything similar to below.
```
kube-apiserver-arg:
  - "token-auth-file=<path>"
```
</details>

### 1.2.3 Ensure that the --DenyServiceExternalIPs is set (Manual)

**Result:** WARN

**Remediation:**
By default, K3s does not set DenyServiceExternalIPs.
To enable this flag, edit the K3s config file /etc/rancher/k3s/config.yaml like below.
```
kube-apiserver-arg:
  - "enable-admission-plugins=DenyServiceExternalIPs"
```

### 1.2.4 Ensure that the --kubelet-client-certificate and --kubelet-client-key arguments are set as appropriate (Automated)

**Result:** PASS

**Audit:**
```bash
journalctl -m -u k3s | grep 'Running kube-apiserver' | tail -n1
```

**Expected Result:** '--kubelet-client-certificate' is present AND '--kubelet-client-key' is present

<details>
<summary><b>Returned Value:</b></summary>

```log
Sep 11 17:22:08 server-0 k3s[2234]: time="2025-09-11T17:22:08Z" level=info msg="Running kube-apiserver --admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --encryption-provider-config-automatic-reload=true --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

<details>
<summary><b>Remediation:</b></summary>

By default, K3s automatically provides the kubelet client certificate and key.
They are generated and located at /var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt and /var/lib/rancher/k3s/server/tls/client-kube-apiserver.key
If for some reason you need to provide your own certificate and key, you can set the
below parameters in the K3s config file /etc/rancher/k3s/config.yaml.
```
kube-apiserver-arg:
  - "kubelet-client-certificate=<path/to/client-cert-file>"
  - "kubelet-client-key=<path/to/client-key-file>"
```
</details>

### 1.2.5 Ensure that the --kubelet-certificate-authority argument is set as appropriate (Automated)

**Result:** PASS

**Audit:**
```bash
journalctl -m -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep 'kubelet-certificate-authority'
```

**Expected Result:** '--kubelet-certificate-authority' is present

<details>
<summary><b>Returned Value:</b></summary>

```log
Sep 11 17:22:08 server-0 k3s[2234]: time="2025-09-11T17:22:08Z" level=info msg="Running kube-apiserver --admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --encryption-provider-config-automatic-reload=true --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

<details>
<summary><b>Remediation:</b></summary>

By default, K3s automatically provides the kubelet CA cert file, at /var/lib/rancher/k3s/server/tls/server-ca.crt.
If for some reason you need to provide your own ca certificate, look at using the k3s certificate command line tool.
If this check fails, edit the K3s config file /etc/rancher/k3s/config.yaml and remove any lines like below.
```
kube-apiserver-arg:
  - "kubelet-certificate-authority=<path/to/ca-cert-file>"
```
</details>

### 1.2.6 Ensure that the --authorization-mode argument is not set to AlwaysAllow (Automated)

**Result:** PASS

**Audit:**
```bash
journalctl -m -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep 'authorization-mode'
```

**Expected Result:** '--authorization-mode' does not have 'AlwaysAllow'

<details>
<summary><b>Returned Value:</b></summary>

```log
Sep 11 17:22:08 server-0 k3s[2234]: time="2025-09-11T17:22:08Z" level=info msg="Running kube-apiserver --admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --encryption-provider-config-automatic-reload=true --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

<details>
<summary><b>Remediation:</b></summary>

By default, K3s does not set the --authorization-mode to AlwaysAllow.
If this check fails, edit K3s config file /etc/rancher/k3s/config.yaml, remove any lines like below.
```
kube-apiserver-arg:
  - "authorization-mode=AlwaysAllow"
```
</details>

### 1.2.7 Ensure that the --authorization-mode argument includes Node (Automated)

**Result:** PASS

**Audit:**
```bash
journalctl -m -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep 'authorization-mode'
```

**Expected Result:** '--authorization-mode' has 'Node'

<details>
<summary><b>Returned Value:</b></summary>

```log
Sep 11 17:22:08 server-0 k3s[2234]: time="2025-09-11T17:22:08Z" level=info msg="Running kube-apiserver --admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --encryption-provider-config-automatic-reload=true --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

<details>
<summary><b>Remediation:</b></summary>

By default, K3s sets the --authorization-mode to Node and RBAC.
If this check fails, edit the K3s config file /etc/rancher/k3s/config.yaml,
ensure that you are not overriding authorization-mode.
</details>

### 1.2.8 Ensure that the --authorization-mode argument includes RBAC (Automated)

**Result:** PASS

**Audit:**
```bash
journalctl -m -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep 'authorization-mode'
```

**Expected Result:** '--authorization-mode' has 'RBAC'

<details>
<summary><b>Returned Value:</b></summary>

```log
Sep 11 17:22:08 server-0 k3s[2234]: time="2025-09-11T17:22:08Z" level=info msg="Running kube-apiserver --admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --encryption-provider-config-automatic-reload=true --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

<details>
<summary><b>Remediation:</b></summary>

By default, K3s sets the --authorization-mode to Node and RBAC.
If this check fails, edit the K3s config file /etc/rancher/k3s/config.yaml,
ensure that you are not overriding authorization-mode.
</details>

### 1.2.9 Ensure that the admission control plugin EventRateLimit is set (Manual)

**Result:** WARN

**Remediation:**
Follow the Kubernetes documentation and set the desired limits in a configuration file.
Then, edit the K3s config file /etc/rancher/k3s/config.yaml and set the below parameters.
```
kube-apiserver-arg:
  - "enable-admission-plugins=...,EventRateLimit,..."
  - "admission-control-config-file=<path/to/configuration/file>"
```

### 1.2.10 Ensure that the admission control plugin AlwaysAdmit is not set (Automated)

**Result:** PASS

**Audit:**
```bash
journalctl -m -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep 'enable-admission-plugins'
```

**Expected Result:** '--enable-admission-plugins' does not have 'AlwaysAdmit' OR '--enable-admission-plugins' is not present

<details>
<summary><b>Returned Value:</b></summary>

```log
Sep 11 17:22:08 server-0 k3s[2234]: time="2025-09-11T17:22:08Z" level=info msg="Running kube-apiserver --admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --encryption-provider-config-automatic-reload=true --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

<details>
<summary><b>Remediation:</b></summary>

By default, K3s does not set the --enable-admission-plugins to AlwaysAdmit.
If this check fails, edit K3s config file /etc/rancher/k3s/config.yaml, remove any lines like below.
```
kube-apiserver-arg:
  - "enable-admission-plugins=AlwaysAdmit"
```
</details>

### 1.2.11 Ensure that the admission control plugin AlwaysPullImages is set (Manual)

**Result:** WARN

**Remediation:**
Permissive, per CIS guidelines,
"This setting could impact offline or isolated clusters, which have images pre-loaded and
do not have access to a registry to pull in-use images. This setting is not appropriate for
clusters which use this configuration."
Edit the K3s config file /etc/rancher/k3s/config.yaml and set the below parameter.
```
kube-apiserver-arg:
  - "enable-admission-plugins=...,AlwaysPullImages,..."
```

### 1.2.12 Ensure that the admission control plugin ServiceAccount is set (Automated)

**Result:** PASS

**Audit:**
```bash
journalctl -m -u k3s | grep 'Running kube-apiserver' | tail -n1
```

**Expected Result:** '--disable-admission-plugins' is present OR '--disable-admission-plugins' is not present

<details>
<summary><b>Returned Value:</b></summary>

```log
Sep 11 17:22:08 server-0 k3s[2234]: time="2025-09-11T17:22:08Z" level=info msg="Running kube-apiserver --admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --encryption-provider-config-automatic-reload=true --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

<details>
<summary><b>Remediation:</b></summary>

By default, K3s does not set the --disable-admission-plugins to anything.
Follow the documentation and create ServiceAccount objects as per your environment.
If this check fails, edit the K3s config file /etc/rancher/k3s/config.yaml and remove any lines like below.
```
kube-apiserver-arg:
  - "disable-admission-plugins=ServiceAccount"
```
</details>

### 1.2.13 Ensure that the admission control plugin NamespaceLifecycle is set (Automated)

**Result:** PASS

**Audit:**
```bash
journalctl -m -u k3s | grep 'Running kube-apiserver' | tail -n1
```

**Expected Result:** '--disable-admission-plugins' is present OR '--disable-admission-plugins' is not present

<details>
<summary><b>Returned Value:</b></summary>

```log
Sep 11 17:22:08 server-0 k3s[2234]: time="2025-09-11T17:22:08Z" level=info msg="Running kube-apiserver --admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --encryption-provider-config-automatic-reload=true --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

<details>
<summary><b>Remediation:</b></summary>

By default, K3s does not set the --disable-admission-plugins to anything.
If this check fails, edit the K3s config file /etc/rancher/k3s/config.yaml and remove any lines like below.
```
kube-apiserver-arg:
  - "disable-admission-plugins=...,NamespaceLifecycle,..."
```
</details>

### 1.2.14 Ensure that the admission control plugin NodeRestriction is set (Automated)

**Result:** PASS

**Audit:**
```bash
journalctl -m -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep 'enable-admission-plugins'
```

**Expected Result:** '--enable-admission-plugins' has 'NodeRestriction'

<details>
<summary><b>Returned Value:</b></summary>

```log
Sep 11 17:22:08 server-0 k3s[2234]: time="2025-09-11T17:22:08Z" level=info msg="Running kube-apiserver --admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --encryption-provider-config-automatic-reload=true --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

<details>
<summary><b>Remediation:</b></summary>

By default, K3s sets the --enable-admission-plugins to NodeRestriction.
If using the K3s config file /etc/rancher/k3s/config.yaml, check that you are not overriding the admission plugins.
If you are, include NodeRestriction in the list.
```
kube-apiserver-arg:
  - "enable-admission-plugins=...,NodeRestriction,..."
```
</details>

### 1.2.15 Ensure that the --profiling argument is set to false (Automated)

**Result:** PASS

**Audit:**
```bash
journalctl -m -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep 'profiling'
```

**Expected Result:** '--profiling' is equal to 'false'

<details>
<summary><b>Returned Value:</b></summary>

```log
Sep 11 17:22:08 server-0 k3s[2234]: time="2025-09-11T17:22:08Z" level=info msg="Running kube-apiserver --admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --encryption-provider-config-automatic-reload=true --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

<details>
<summary><b>Remediation:</b></summary>

By default, K3s sets the --profiling argument to false.
If this check fails, edit the K3s config file /etc/rancher/k3s/config.yaml and remove any lines like below.
```
kube-apiserver-arg:
  - "profiling=true"
```
</details>

### 1.2.16 Ensure that the --audit-log-path argument is set (Manual)

**Result:** PASS

**Audit:**
```bash
journalctl -m -u k3s | grep 'Running kube-apiserver' | tail -n1
```

**Expected Result:** '--audit-log-path' is present

<details>
<summary><b>Returned Value:</b></summary>

```log
Sep 11 17:22:08 server-0 k3s[2234]: time="2025-09-11T17:22:08Z" level=info msg="Running kube-apiserver --admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --encryption-provider-config-automatic-reload=true --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

<details>
<summary><b>Remediation:</b></summary>

Edit the K3s config file /etc/rancher/k3s/config.yaml and set the audit-log-path parameter to a suitable path and
file where you would like audit logs to be written, for example,
```
kube-apiserver-arg:
  - "audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log"
```
</details>

### 1.2.17 Ensure that the --audit-log-maxage argument is set to 30 or as appropriate (Manual)

**Result:** PASS

**Audit:**
```bash
journalctl -m -u k3s | grep 'Running kube-apiserver' | tail -n1
```

**Expected Result:** '--audit-log-maxage' is greater or equal to 30

<details>
<summary><b>Returned Value:</b></summary>

```log
Sep 11 17:22:08 server-0 k3s[2234]: time="2025-09-11T17:22:08Z" level=info msg="Running kube-apiserver --admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --encryption-provider-config-automatic-reload=true --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

<details>
<summary><b>Remediation:</b></summary>

Edit the K3s config file /etc/rancher/k3s/config.yaml on the control plane node and
set the audit-log-maxage parameter to 30 or as an appropriate number of days, for example,
```
kube-apiserver-arg:
  - "audit-log-maxage=30"
```
</details>

### 1.2.18 Ensure that the --audit-log-maxbackup argument is set to 10 or as appropriate (Manual)

**Result:** PASS

**Audit:**
```bash
journalctl -m -u k3s | grep 'Running kube-apiserver' | tail -n1
```

**Expected Result:** '--audit-log-maxbackup' is greater or equal to 10

<details>
<summary><b>Returned Value:</b></summary>

```log
Sep 11 17:22:08 server-0 k3s[2234]: time="2025-09-11T17:22:08Z" level=info msg="Running kube-apiserver --admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --encryption-provider-config-automatic-reload=true --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

<details>
<summary><b>Remediation:</b></summary>

Edit the K3s config file /etc/rancher/k3s/config.yaml on the control plane node and
set the audit-log-maxbackup parameter to 10 or to an appropriate value. For example,
```
kube-apiserver-arg:
  - "audit-log-maxbackup=10"
```
</details>

### 1.2.19 Ensure that the --audit-log-maxsize argument is set to 100 or as appropriate (Manual)

**Result:** PASS

**Audit:**
```bash
journalctl -m -u k3s | grep 'Running kube-apiserver' | tail -n1
```

**Expected Result:** '--audit-log-maxsize' is greater or equal to 100

<details>
<summary><b>Returned Value:</b></summary>

```log
Sep 11 17:22:08 server-0 k3s[2234]: time="2025-09-11T17:22:08Z" level=info msg="Running kube-apiserver --admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --encryption-provider-config-automatic-reload=true --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

<details>
<summary><b>Remediation:</b></summary>

Edit the K3s config file /etc/rancher/k3s/config.yaml on the control plane node and
set the audit-log-maxsize parameter to an appropriate size in MB. For example,
```
kube-apiserver-arg:
  - "audit-log-maxsize=100"
```
</details>

### 1.2.20 Ensure that the --request-timeout argument is set as appropriate (Manual)

**Result:** WARN

**Remediation:**
Permissive, per CIS guidelines,
"it is recommended to set this limit as appropriate and change the default limit of 60 seconds only if needed".
Edit the K3s config file /etc/rancher/k3s/config.yaml
and set the below parameter if needed. For example,
```
kube-apiserver-arg:
  - "request-timeout=300s"
```

### 1.2.21 Ensure that the --service-account-lookup argument is set to true (Automated)

**Result:** PASS

**Audit:**
```bash
journalctl -m -u k3s | grep 'Running kube-apiserver' | tail -n1
```

**Expected Result:** '--service-account-lookup' is not present OR '--service-account-lookup' is present

<details>
<summary><b>Returned Value:</b></summary>

```log
Sep 11 17:22:08 server-0 k3s[2234]: time="2025-09-11T17:22:08Z" level=info msg="Running kube-apiserver --admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --encryption-provider-config-automatic-reload=true --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

<details>
<summary><b>Remediation:</b></summary>

By default, K3s does not set the --service-account-lookup argument.
Edit the K3s config file /etc/rancher/k3s/config.yaml and set the service-account-lookup. For example,
```
kube-apiserver-arg:
  - "service-account-lookup=true"
```
Alternatively, you can delete the service-account-lookup parameter from this file so
that the default takes effect.
</details>

### 1.2.22 Ensure that the --service-account-key-file argument is set as appropriate (Automated)

**Result:** PASS

**Audit:**
```bash
journalctl -m -u k3s | grep 'Running kube-apiserver' | tail -n1
```

**Expected Result:** '--service-account-key-file' is present

<details>
<summary><b>Returned Value:</b></summary>

```log
Sep 11 17:22:08 server-0 k3s[2234]: time="2025-09-11T17:22:08Z" level=info msg="Running kube-apiserver --admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --encryption-provider-config-automatic-reload=true --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

<details>
<summary><b>Remediation:</b></summary>

K3s automatically generates and sets the service account key file.
It is located at /var/lib/rancher/k3s/server/tls/service.key.
If this check fails, edit K3s config file /etc/rancher/k3s/config.yaml and remove any lines like below.
```
kube-apiserver-arg:
  - "service-account-key-file=<path>"
```
</details>

### 1.2.23 Ensure that the --etcd-certfile and --etcd-keyfile arguments are set as appropriate (Automated)

**Result:** PASS

**Audit:**
```bash
if [ "$(journalctl -m -u k3s | grep -m1 'Managed etcd cluster' | wc -l)" -gt 0 ]; then
  journalctl -m -u k3s | grep  -m1 'Running kube-apiserver' | tail -n1
else
  echo "--etcd-certfile AND --etcd-keyfile"
fi
```

**Expected Result:** '--etcd-certfile' is present AND '--etcd-keyfile' is present

<details>
<summary><b>Returned Value:</b></summary>

```log
Sep 11 17:22:08 server-0 k3s[2234]: time="2025-09-11T17:22:08Z" level=info msg="Running kube-apiserver --admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --encryption-provider-config-automatic-reload=true --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

<details>
<summary><b>Remediation:</b></summary>

K3s automatically generates and sets the etcd certificate and key files.
They are located at /var/lib/rancher/k3s/server/tls/etcd/client.crt and /var/lib/rancher/k3s/server/tls/etcd/client.key.
If this check fails, edit the K3s config file /etc/rancher/k3s/config.yaml and remove any lines like below.
```
kube-apiserver-arg:
  - "etcd-certfile=<path>"
  - "etcd-keyfile=<path>"
```
</details>

### 1.2.24 Ensure that the --tls-cert-file and --tls-private-key-file arguments are set as appropriate (Automated)

**Result:** PASS

**Audit:**
```bash
journalctl -m -u k3s | grep -A1 'Running kube-apiserver' | tail -n2
```

**Expected Result:** '--tls-cert-file' is present AND '--tls-private-key-file' is present

<details>
<summary><b>Returned Value:</b></summary>

```log
Sep 11 17:22:08 server-0 k3s[2234]: time="2025-09-11T17:22:08Z" level=info msg="Running kube-apiserver --admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --encryption-provider-config-automatic-reload=true --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
Sep 11 17:22:08 server-0 k3s[2234]: time="2025-09-11T17:22:08Z" level=info msg="Running kube-scheduler --authentication-kubeconfig=/var/lib/rancher/k3s/server/cred/scheduler.kubeconfig --authorization-kubeconfig=/var/lib/rancher/k3s/server/cred/scheduler.kubeconfig --bind-address=127.0.0.1 --kubeconfig=/var/lib/rancher/k3s/server/cred/scheduler.kubeconfig --profiling=false --secure-port=10259"
```
</details>

<details>
<summary><b>Remediation:</b></summary>

By default, K3s automatically generates and provides the TLS certificate and private key for the apiserver.
They are generated and located at /var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt and /var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key
If this check fails, edit the K3s config file /etc/rancher/k3s/config.yaml and remove any lines like below.
```
kube-apiserver-arg:
  - "tls-cert-file=<path>"
  - "tls-private-key-file=<path>"
```
</details>

### 1.2.25 Ensure that the --client-ca-file argument is set as appropriate (Automated)

**Result:** PASS

**Audit:**
```bash
journalctl -m -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep 'client-ca-file'
```

**Expected Result:** '--client-ca-file' is present

<details>
<summary><b>Returned Value:</b></summary>

```log
Sep 11 17:22:08 server-0 k3s[2234]: time="2025-09-11T17:22:08Z" level=info msg="Running kube-apiserver --admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --encryption-provider-config-automatic-reload=true --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

<details>
<summary><b>Remediation:</b></summary>

By default, K3s automatically provides the client certificate authority file.
It is generated and located at /var/lib/rancher/k3s/server/tls/client-ca.crt.
If for some reason you need to provide your own ca certificate, look at using the k3s certificate command line tool.
If this check fails, edit the K3s config file /etc/rancher/k3s/config.yaml and remove any lines like below.
```
kube-apiserver-arg:
  - "client-ca-file=<path>"
```
</details>

### 1.2.26 Ensure that the --etcd-cafile argument is set as appropriate (Automated)

**Result:** PASS

**Audit:**
```bash
journalctl -m -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep 'etcd-cafile'
```

**Expected Result:** '--etcd-cafile' is present

<details>
<summary><b>Returned Value:</b></summary>

```log
Sep 11 17:22:08 server-0 k3s[2234]: time="2025-09-11T17:22:08Z" level=info msg="Running kube-apiserver --admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --encryption-provider-config-automatic-reload=true --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

<details>
<summary><b>Remediation:</b></summary>

By default, K3s automatically provides the etcd certificate authority file.
It is generated and located at /var/lib/rancher/k3s/server/tls/client-ca.crt.
If for some reason you need to provide your own ca certificate, look at using the k3s certificate command line tool.
If this check fails, edit the K3s config file /etc/rancher/k3s/config.yaml and remove any lines like below.
```
kube-apiserver-arg:
  - "etcd-cafile=<path>"
```
</details>

### 1.2.27 Ensure that the --encryption-provider-config argument is set as appropriate (Manual)

**Result:** PASS

**Audit:**
```bash
journalctl -m -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep 'encryption-provider-config'
```

**Expected Result:** '--encryption-provider-config' is present

<details>
<summary><b>Returned Value:</b></summary>

```log
Sep 11 17:22:08 server-0 k3s[2234]: time="2025-09-11T17:22:08Z" level=info msg="Running kube-apiserver --admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --encryption-provider-config-automatic-reload=true --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

<details>
<summary><b>Remediation:</b></summary>

K3s can be configured to use encryption providers to encrypt secrets at rest.
Edit the K3s config file /etc/rancher/k3s/config.yaml on the control plane node and set the below parameter.
secrets-encryption: true
Secrets encryption can then be managed with the k3s secrets-encrypt command line tool.
If needed, you can find the generated encryption config at /var/lib/rancher/k3s/server/cred/encryption-config.json.
</details>

### 1.2.28 Ensure that encryption providers are appropriately configured (Manual)

**Result:** PASS

**Audit:**
```bash
ENCRYPTION_PROVIDER_CONFIG=$(journalctl -m -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep -- --encryption-provider-config | sed 's%.*encryption-provider-config[= ]\([^ ]*\).*%\1%')
if test -e $ENCRYPTION_PROVIDER_CONFIG; then grep -o 'providers\"\:\[.*\]' $ENCRYPTION_PROVIDER_CONFIG | grep -o "[A-Za-z]*" | head -2 | tail -1  | sed 's/^/provider=/'; fi
```

**Expected Result:** 'provider' contains valid elements from 'aescbc,kms,secretbox'

<details>
<summary><b>Returned Value:</b></summary>

```log
provider=aescbc
```
</details>

<details>
<summary><b>Remediation:</b></summary>

K3s can be configured to use encryption providers to encrypt secrets at rest. K3s will utilize the aescbc provider.
Edit the K3s config file /etc/rancher/k3s/config.yaml on the control plane node and set the below parameter.
secrets-encryption: true
Secrets encryption can then be managed with the k3s secrets-encrypt command line tool.
If needed, you can find the generated encryption config at /var/lib/rancher/k3s/server/cred/encryption-config.json
</details>

### 1.2.29 Ensure that the API Server only makes use of Strong Cryptographic Ciphers (Automated)

**Result:** PASS

**Audit:**
```bash
journalctl -m -u k3s | grep 'Running kube-apiserver' | tail -n1 | grep 'tls-cipher-suites'
```

**Expected Result:** '--tls-cipher-suites' contains valid elements from 'TLS_AES_128_GCM_SHA256,TLS_AES_256_GCM_SHA384,TLS_CHACHA20_POLY1305_SHA256,TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA,TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256,TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256,TLS_RSA_WITH_AES_128_GCM_SHA256,TLS_RSA_WITH_AES_256_GCM_SHA384'

<details>
<summary><b>Returned Value:</b></summary>

```log
Sep 11 17:22:08 server-0 k3s[2234]: time="2025-09-11T17:22:08Z" level=info msg="Running kube-apiserver --admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --encryption-provider-config-automatic-reload=true --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

<details>
<summary><b>Remediation:</b></summary>

By default, the K3s kube-apiserver complies with this test. Changes to these values may cause regression, therefore ensure that all apiserver clients support the new TLS configuration before applying it in production deployments.
If a custom TLS configuration is required, consider also creating a custom version of this rule that aligns with your requirements.
If this check fails, remove any custom configuration around `tls-cipher-suites` or update the /etc/rancher/k3s/config.yaml file to match the default by adding the following:
```
kube-apiserver-arg:
  - "tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305"
```
</details>

## 1.3 Controller Manager

### 1.3.1 Ensure that the --terminated-pod-gc-threshold argument is set as appropriate (Manual)

**Result:** PASS

**Audit:**
```bash
journalctl -m -u k3s | grep 'Running kube-controller-manager' | tail -n1 | grep 'terminated-pod-gc-threshold'
```

**Expected Result:** '--terminated-pod-gc-threshold' is present

<details>
<summary><b>Returned Value:</b></summary>

```log
Sep 11 17:22:08 server-0 k3s[2234]: time="2025-09-11T17:22:08Z" level=info msg="Running kube-controller-manager --allocate-node-cidrs=true --authentication-kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --authorization-kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --bind-address=127.0.0.1 --cluster-cidr=10.42.0.0/16 --cluster-signing-kube-apiserver-client-cert-file=/var/lib/rancher/k3s/server/tls/client-ca.nochain.crt --cluster-signing-kube-apiserver-client-key-file=/var/lib/rancher/k3s/server/tls/client-ca.key --cluster-signing-kubelet-client-cert-file=/var/lib/rancher/k3s/server/tls/client-ca.nochain.crt --cluster-signing-kubelet-client-key-file=/var/lib/rancher/k3s/server/tls/client-ca.key --cluster-signing-kubelet-serving-cert-file=/var/lib/rancher/k3s/server/tls/server-ca.nochain.crt --cluster-signing-kubelet-serving-key-file=/var/lib/rancher/k3s/server/tls/server-ca.key --cluster-signing-legacy-unknown-cert-file=/var/lib/rancher/k3s/server/tls/server-ca.nochain.crt --cluster-signing-legacy-unknown-key-file=/var/lib/rancher/k3s/server/tls/server-ca.key --configure-cloud-routes=false --controllers=*,tokencleaner,-service,-route,-cloud-node-lifecycle --kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --profiling=false --root-ca-file=/var/lib/rancher/k3s/server/tls/server-ca.crt --secure-port=10257 --service-account-private-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --terminated-pod-gc-threshold=10 --use-service-account-credentials=true"
```
</details>

<details>
<summary><b>Remediation:</b></summary>

Edit the K3s config file /etc/rancher/k3s/config.yaml on the control plane node
and set the --terminated-pod-gc-threshold to an appropriate threshold,
```
kube-controller-manager-arg:
  - "terminated-pod-gc-threshold=10"
```
</details>

### 1.3.2 Ensure that the --profiling argument is set to false (Automated)

**Result:** PASS

**Audit:**
```bash
journalctl -m -u k3s | grep 'Running kube-controller-manager' | tail -n1 | grep 'profiling'
```

**Expected Result:** '--profiling' is equal to 'false'

<details>
<summary><b>Returned Value:</b></summary>

```log
Sep 11 17:22:08 server-0 k3s[2234]: time="2025-09-11T17:22:08Z" level=info msg="Running kube-controller-manager --allocate-node-cidrs=true --authentication-kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --authorization-kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --bind-address=127.0.0.1 --cluster-cidr=10.42.0.0/16 --cluster-signing-kube-apiserver-client-cert-file=/var/lib/rancher/k3s/server/tls/client-ca.nochain.crt --cluster-signing-kube-apiserver-client-key-file=/var/lib/rancher/k3s/server/tls/client-ca.key --cluster-signing-kubelet-client-cert-file=/var/lib/rancher/k3s/server/tls/client-ca.nochain.crt --cluster-signing-kubelet-client-key-file=/var/lib/rancher/k3s/server/tls/client-ca.key --cluster-signing-kubelet-serving-cert-file=/var/lib/rancher/k3s/server/tls/server-ca.nochain.crt --cluster-signing-kubelet-serving-key-file=/var/lib/rancher/k3s/server/tls/server-ca.key --cluster-signing-legacy-unknown-cert-file=/var/lib/rancher/k3s/server/tls/server-ca.nochain.crt --cluster-signing-legacy-unknown-key-file=/var/lib/rancher/k3s/server/tls/server-ca.key --configure-cloud-routes=false --controllers=*,tokencleaner,-service,-route,-cloud-node-lifecycle --kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --profiling=false --root-ca-file=/var/lib/rancher/k3s/server/tls/server-ca.crt --secure-port=10257 --service-account-private-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --terminated-pod-gc-threshold=10 --use-service-account-credentials=true"
```
</details>

<details>
<summary><b>Remediation:</b></summary>

By default, K3s sets the --profiling argument to false.
If this check fails, edit the K3s config file /etc/rancher/k3s/config.yaml and remove any lines like below.
```
kube-controller-manager-arg:
  - "profiling=true"
```
</details>

### 1.3.3 Ensure that the --use-service-account-credentials argument is set to true (Automated)

**Result:** PASS

**Audit:**
```bash
journalctl -m -u k3s | grep 'Running kube-controller-manager' | tail -n1 | grep 'use-service-account-credentials'
```

**Expected Result:** '--use-service-account-credentials' is not equal to 'false'

<details>
<summary><b>Returned Value:</b></summary>

```log
Sep 11 17:22:08 server-0 k3s[2234]: time="2025-09-11T17:22:08Z" level=info msg="Running kube-controller-manager --allocate-node-cidrs=true --authentication-kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --authorization-kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --bind-address=127.0.0.1 --cluster-cidr=10.42.0.0/16 --cluster-signing-kube-apiserver-client-cert-file=/var/lib/rancher/k3s/server/tls/client-ca.nochain.crt --cluster-signing-kube-apiserver-client-key-file=/var/lib/rancher/k3s/server/tls/client-ca.key --cluster-signing-kubelet-client-cert-file=/var/lib/rancher/k3s/server/tls/client-ca.nochain.crt --cluster-signing-kubelet-client-key-file=/var/lib/rancher/k3s/server/tls/client-ca.key --cluster-signing-kubelet-serving-cert-file=/var/lib/rancher/k3s/server/tls/server-ca.nochain.crt --cluster-signing-kubelet-serving-key-file=/var/lib/rancher/k3s/server/tls/server-ca.key --cluster-signing-legacy-unknown-cert-file=/var/lib/rancher/k3s/server/tls/server-ca.nochain.crt --cluster-signing-legacy-unknown-key-file=/var/lib/rancher/k3s/server/tls/server-ca.key --configure-cloud-routes=false --controllers=*,tokencleaner,-service,-route,-cloud-node-lifecycle --kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --profiling=false --root-ca-file=/var/lib/rancher/k3s/server/tls/server-ca.crt --secure-port=10257 --service-account-private-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --terminated-pod-gc-threshold=10 --use-service-account-credentials=true"
```
</details>

<details>
<summary><b>Remediation:</b></summary>

By default, K3s sets the --use-service-account-credentials argument to true.
If this check fails, edit the K3s config file /etc/rancher/k3s/config.yaml and remove any lines like below.
```
kube-controller-manager-arg:
  - "use-service-account-credentials=false"
```
</details>

### 1.3.4 Ensure that the --service-account-private-key-file argument is set as appropriate (Automated)

**Result:** PASS

**Audit:**
```bash
journalctl -m -u k3s | grep 'Running kube-controller-manager' | tail -n1 | grep 'service-account-private-key-file'
```

**Expected Result:** '--service-account-private-key-file' is present

<details>
<summary><b>Returned Value:</b></summary>

```log
Sep 11 17:22:08 server-0 k3s[2234]: time="2025-09-11T17:22:08Z" level=info msg="Running kube-controller-manager --allocate-node-cidrs=true --authentication-kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --authorization-kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --bind-address=127.0.0.1 --cluster-cidr=10.42.0.0/16 --cluster-signing-kube-apiserver-client-cert-file=/var/lib/rancher/k3s/server/tls/client-ca.nochain.crt --cluster-signing-kube-apiserver-client-key-file=/var/lib/rancher/k3s/server/tls/client-ca.key --cluster-signing-kubelet-client-cert-file=/var/lib/rancher/k3s/server/tls/client-ca.nochain.crt --cluster-signing-kubelet-client-key-file=/var/lib/rancher/k3s/server/tls/client-ca.key --cluster-signing-kubelet-serving-cert-file=/var/lib/rancher/k3s/server/tls/server-ca.nochain.crt --cluster-signing-kubelet-serving-key-file=/var/lib/rancher/k3s/server/tls/server-ca.key --cluster-signing-legacy-unknown-cert-file=/var/lib/rancher/k3s/server/tls/server-ca.nochain.crt --cluster-signing-legacy-unknown-key-file=/var/lib/rancher/k3s/server/tls/server-ca.key --configure-cloud-routes=false --controllers=*,tokencleaner,-service,-route,-cloud-node-lifecycle --kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --profiling=false --root-ca-file=/var/lib/rancher/k3s/server/tls/server-ca.crt --secure-port=10257 --service-account-private-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --terminated-pod-gc-threshold=10 --use-service-account-credentials=true"
```
</details>

<details>
<summary><b>Remediation:</b></summary>

By default, K3s automatically provides the service account private key file.
It is generated and located at /var/lib/rancher/k3s/server/tls/service.current.key.
If this check fails, edit the K3s config file /etc/rancher/k3s/config.yaml and remove any lines like below.
```
kube-controller-manager-arg:
  - "service-account-private-key-file=<path>"
```
</details>

### 1.3.5 Ensure that the --root-ca-file argument is set as appropriate (Automated)

**Result:** PASS

**Audit:**
```bash
journalctl -m -u k3s | grep 'Running kube-controller-manager' | tail -n1 | grep 'root-ca-file'
```

**Expected Result:** '--root-ca-file' is present

<details>
<summary><b>Returned Value:</b></summary>

```log
Sep 11 17:22:08 server-0 k3s[2234]: time="2025-09-11T17:22:08Z" level=info msg="Running kube-controller-manager --allocate-node-cidrs=true --authentication-kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --authorization-kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --bind-address=127.0.0.1 --cluster-cidr=10.42.0.0/16 --cluster-signing-kube-apiserver-client-cert-file=/var/lib/rancher/k3s/server/tls/client-ca.nochain.crt --cluster-signing-kube-apiserver-client-key-file=/var/lib/rancher/k3s/server/tls/client-ca.key --cluster-signing-kubelet-client-cert-file=/var/lib/rancher/k3s/server/tls/client-ca.nochain.crt --cluster-signing-kubelet-client-key-file=/var/lib/rancher/k3s/server/tls/client-ca.key --cluster-signing-kubelet-serving-cert-file=/var/lib/rancher/k3s/server/tls/server-ca.nochain.crt --cluster-signing-kubelet-serving-key-file=/var/lib/rancher/k3s/server/tls/server-ca.key --cluster-signing-legacy-unknown-cert-file=/var/lib/rancher/k3s/server/tls/server-ca.nochain.crt --cluster-signing-legacy-unknown-key-file=/var/lib/rancher/k3s/server/tls/server-ca.key --configure-cloud-routes=false --controllers=*,tokencleaner,-service,-route,-cloud-node-lifecycle --kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --profiling=false --root-ca-file=/var/lib/rancher/k3s/server/tls/server-ca.crt --secure-port=10257 --service-account-private-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --terminated-pod-gc-threshold=10 --use-service-account-credentials=true"
```
</details>

<details>
<summary><b>Remediation:</b></summary>

By default, K3s automatically provides the root CA file.
It is generated and located at /var/lib/rancher/k3s/server/tls/server-ca.crt.
If for some reason you need to provide your own ca certificate, look at using the k3s certificate command line tool.
If this check fails, edit the K3s config file /etc/rancher/k3s/config.yaml and remove any lines like below.
```
kube-controller-manager-arg:
  - "root-ca-file=<path>"
```
</details>

### 1.3.6 Ensure that the RotateKubeletServerCertificate argument is set to true (Automated)

**Result:** PASS

**Audit:**
```bash
journalctl -m -u k3s | grep 'Running kube-controller-manager' | tail -n1
```

**Expected Result:** '--feature-gates' is present OR '--feature-gates' is not present

<details>
<summary><b>Returned Value:</b></summary>

```log
Sep 11 17:22:08 server-0 k3s[2234]: time="2025-09-11T17:22:08Z" level=info msg="Running kube-controller-manager --allocate-node-cidrs=true --authentication-kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --authorization-kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --bind-address=127.0.0.1 --cluster-cidr=10.42.0.0/16 --cluster-signing-kube-apiserver-client-cert-file=/var/lib/rancher/k3s/server/tls/client-ca.nochain.crt --cluster-signing-kube-apiserver-client-key-file=/var/lib/rancher/k3s/server/tls/client-ca.key --cluster-signing-kubelet-client-cert-file=/var/lib/rancher/k3s/server/tls/client-ca.nochain.crt --cluster-signing-kubelet-client-key-file=/var/lib/rancher/k3s/server/tls/client-ca.key --cluster-signing-kubelet-serving-cert-file=/var/lib/rancher/k3s/server/tls/server-ca.nochain.crt --cluster-signing-kubelet-serving-key-file=/var/lib/rancher/k3s/server/tls/server-ca.key --cluster-signing-legacy-unknown-cert-file=/var/lib/rancher/k3s/server/tls/server-ca.nochain.crt --cluster-signing-legacy-unknown-key-file=/var/lib/rancher/k3s/server/tls/server-ca.key --configure-cloud-routes=false --controllers=*,tokencleaner,-service,-route,-cloud-node-lifecycle --kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --profiling=false --root-ca-file=/var/lib/rancher/k3s/server/tls/server-ca.crt --secure-port=10257 --service-account-private-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --terminated-pod-gc-threshold=10 --use-service-account-credentials=true"
```
</details>

<details>
<summary><b>Remediation:</b></summary>

By default, K3s does not set the RotateKubeletServerCertificate feature gate.
If you have enabled this feature gate, you should remove it.
If this check fails, edit the K3s config file /etc/rancher/k3s/config.yaml, remove any lines like below.
```
kube-controller-manager-arg:
  - "feature-gate=RotateKubeletServerCertificate"
```
</details>

### 1.3.7 Ensure that the --bind-address argument is set to 127.0.0.1 (Automated)

**Result:** PASS

**Audit:**
```bash
journalctl -m -u k3s | grep 'Running kube-controller-manager' | tail -n1
```

**Expected Result:** '--bind-address' is equal to '127.0.0.1' OR '--bind-address' is not present

<details>
<summary><b>Returned Value:</b></summary>

```log
Sep 11 17:22:08 server-0 k3s[2234]: time="2025-09-11T17:22:08Z" level=info msg="Running kube-controller-manager --allocate-node-cidrs=true --authentication-kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --authorization-kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --bind-address=127.0.0.1 --cluster-cidr=10.42.0.0/16 --cluster-signing-kube-apiserver-client-cert-file=/var/lib/rancher/k3s/server/tls/client-ca.nochain.crt --cluster-signing-kube-apiserver-client-key-file=/var/lib/rancher/k3s/server/tls/client-ca.key --cluster-signing-kubelet-client-cert-file=/var/lib/rancher/k3s/server/tls/client-ca.nochain.crt --cluster-signing-kubelet-client-key-file=/var/lib/rancher/k3s/server/tls/client-ca.key --cluster-signing-kubelet-serving-cert-file=/var/lib/rancher/k3s/server/tls/server-ca.nochain.crt --cluster-signing-kubelet-serving-key-file=/var/lib/rancher/k3s/server/tls/server-ca.key --cluster-signing-legacy-unknown-cert-file=/var/lib/rancher/k3s/server/tls/server-ca.nochain.crt --cluster-signing-legacy-unknown-key-file=/var/lib/rancher/k3s/server/tls/server-ca.key --configure-cloud-routes=false --controllers=*,tokencleaner,-service,-route,-cloud-node-lifecycle --kubeconfig=/var/lib/rancher/k3s/server/cred/controller.kubeconfig --profiling=false --root-ca-file=/var/lib/rancher/k3s/server/tls/server-ca.crt --secure-port=10257 --service-account-private-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --terminated-pod-gc-threshold=10 --use-service-account-credentials=true"
```
</details>

<details>
<summary><b>Remediation:</b></summary>

By default, K3s sets the --bind-address argument to 127.0.0.1
If this check fails, edit the K3s config file /etc/rancher/k3s/config.yaml and remove any lines like below.
```
kube-controller-manager-arg:
  - "bind-address=<IP>"
```
</details>

## 1.4 Scheduler

### 1.4.1 Ensure that the --profiling argument is set to false (Automated)

**Result:** PASS

**Audit:**
```bash
journalctl -m -u k3s | grep 'Running kube-scheduler' | tail -n1 | grep 'profiling'
```

**Expected Result:** '--profiling' is equal to 'false'

<details>
<summary><b>Returned Value:</b></summary>

```log
Sep 11 17:22:08 server-0 k3s[2234]: time="2025-09-11T17:22:08Z" level=info msg="Running kube-scheduler --authentication-kubeconfig=/var/lib/rancher/k3s/server/cred/scheduler.kubeconfig --authorization-kubeconfig=/var/lib/rancher/k3s/server/cred/scheduler.kubeconfig --bind-address=127.0.0.1 --kubeconfig=/var/lib/rancher/k3s/server/cred/scheduler.kubeconfig --profiling=false --secure-port=10259"
```
</details>

<details>
<summary><b>Remediation:</b></summary>

By default, K3s sets the --profiling argument to false.
If this check fails, edit the K3s config file /etc/rancher/k3s/config.yaml and remove any lines like below.
```
kube-scheduler-arg:
  - "profiling=true"
```
</details>

### 1.4.2 Ensure that the --bind-address argument is set to 127.0.0.1 (Automated)

**Result:** PASS

**Audit:**
```bash
journalctl -m -u k3s | grep 'Running kube-scheduler' | tail -n1 | grep 'bind-address'
```

**Expected Result:** '--bind-address' is equal to '127.0.0.1' OR '--bind-address' is not present

<details>
<summary><b>Returned Value:</b></summary>

```log
Sep 11 17:22:08 server-0 k3s[2234]: time="2025-09-11T17:22:08Z" level=info msg="Running kube-scheduler --authentication-kubeconfig=/var/lib/rancher/k3s/server/cred/scheduler.kubeconfig --authorization-kubeconfig=/var/lib/rancher/k3s/server/cred/scheduler.kubeconfig --bind-address=127.0.0.1 --kubeconfig=/var/lib/rancher/k3s/server/cred/scheduler.kubeconfig --profiling=false --secure-port=10259"
```
</details>

<details>
<summary><b>Remediation:</b></summary>

By default, K3s sets the --bind-address argument to 127.0.0.1
If this check fails, edit the K3s config file /etc/rancher/k3s/config.yaml and remove any lines like below.
```
kube-scheduler-arg:
  - "bind-address=<IP>"
```
</details>

## 2 Etcd Node Configuration

### 2.1 Ensure that the --cert-file and --key-file arguments are set as appropriate (Manual)

**Result:** PASS

**Audit:**
```bash

```

**Expected Result:** '.client-transport-security.cert-file' is equal to '/var/lib/rancher/k3s/server/tls/etcd/server-client.crt' AND '.client-transport-security.key-file' is equal to '/var/lib/rancher/k3s/server/tls/etcd/server-client.key'

<details>
<summary><b>Returned Value:</b></summary>

```log
advertise-client-urls: https://10.10.10.100:2379
client-transport-security:
  cert-file: /var/lib/rancher/k3s/server/tls/etcd/server-client.crt
  client-cert-auth: true
  key-file: /var/lib/rancher/k3s/server/tls/etcd/server-client.key
  trusted-ca-file: /var/lib/rancher/k3s/server/tls/etcd/server-ca.crt
data-dir: /var/lib/rancher/k3s/server/db/etcd
election-timeout: 5000
experimental-initial-corrupt-check: true
experimental-watch-progress-notify-interval: 5000000000
heartbeat-interval: 500
initial-advertise-peer-urls: https://10.10.10.100:2380
initial-cluster: server-0-08c675b0=https://10.10.10.100:2380
initial-cluster-state: new
listen-client-http-urls: https://127.0.0.1:2382
listen-client-urls: https://127.0.0.1:2379,https://10.10.10.100:2379
listen-metrics-urls: http://127.0.0.1:2381
listen-peer-urls: https://127.0.0.1:2380,https://10.10.10.100:2380
log-outputs:
- stderr
logger: zap
name: server-0-08c675b0
peer-transport-security:
  cert-file: /var/lib/rancher/k3s/server/tls/etcd/peer-server-client.crt
  client-cert-auth: true
  key-file: /var/lib/rancher/k3s/server/tls/etcd/peer-server-client.key
  trusted-ca-file: /var/lib/rancher/k3s/server/tls/etcd/peer-ca.crt
snapshot-count: 10000
```
</details>

<details>
<summary><b>Remediation:</b></summary>

If running on with sqlite or a external DB, etcd checks are Not Applicable.
When running with embedded-etcd, K3s generates cert and key files for etcd.
These are located in /var/lib/rancher/k3s/server/tls/etcd/.
If this check fails, ensure that the configuration file /var/lib/rancher/k3s/server/db/etcd/config
has not been modified to use custom cert and key files.
</details>

### 2.2 Ensure that the --client-cert-auth argument is set to true (Manual)

**Result:** PASS

**Audit:**
```bash

```

**Expected Result:** '.client-transport-security.client-cert-auth' is equal to 'true'

<details>
<summary><b>Returned Value:</b></summary>

```log
advertise-client-urls: https://10.10.10.100:2379
client-transport-security:
  cert-file: /var/lib/rancher/k3s/server/tls/etcd/server-client.crt
  client-cert-auth: true
  key-file: /var/lib/rancher/k3s/server/tls/etcd/server-client.key
  trusted-ca-file: /var/lib/rancher/k3s/server/tls/etcd/server-ca.crt
data-dir: /var/lib/rancher/k3s/server/db/etcd
election-timeout: 5000
experimental-initial-corrupt-check: true
experimental-watch-progress-notify-interval: 5000000000
heartbeat-interval: 500
initial-advertise-peer-urls: https://10.10.10.100:2380
initial-cluster: server-0-08c675b0=https://10.10.10.100:2380
initial-cluster-state: new
listen-client-http-urls: https://127.0.0.1:2382
listen-client-urls: https://127.0.0.1:2379,https://10.10.10.100:2379
listen-metrics-urls: http://127.0.0.1:2381
listen-peer-urls: https://127.0.0.1:2380,https://10.10.10.100:2380
log-outputs:
- stderr
logger: zap
name: server-0-08c675b0
peer-transport-security:
  cert-file: /var/lib/rancher/k3s/server/tls/etcd/peer-server-client.crt
  client-cert-auth: true
  key-file: /var/lib/rancher/k3s/server/tls/etcd/peer-server-client.key
  trusted-ca-file: /var/lib/rancher/k3s/server/tls/etcd/peer-ca.crt
snapshot-count: 10000
```
</details>

<details>
<summary><b>Remediation:</b></summary>

If running on with sqlite or a external DB, etcd checks are Not Applicable.
When running with embedded-etcd, K3s sets the --client-cert-auth parameter to true.
If this check fails, ensure that the configuration file /var/lib/rancher/k3s/server/db/etcd/config
has not been modified to disable client certificate authentication.
</details>

### 2.3 Ensure that the --auto-tls argument is not set to true (Manual)

**Result:** PASS

**Audit:**
```bash

```

**Expected Result:** '.client-transport-security.auto-tls' is present OR '.client-transport-security.auto-tls' is not present

<details>
<summary><b>Returned Value:</b></summary>

```log
advertise-client-urls: https://10.10.10.100:2379
client-transport-security:
  cert-file: /var/lib/rancher/k3s/server/tls/etcd/server-client.crt
  client-cert-auth: true
  key-file: /var/lib/rancher/k3s/server/tls/etcd/server-client.key
  trusted-ca-file: /var/lib/rancher/k3s/server/tls/etcd/server-ca.crt
data-dir: /var/lib/rancher/k3s/server/db/etcd
election-timeout: 5000
experimental-initial-corrupt-check: true
experimental-watch-progress-notify-interval: 5000000000
heartbeat-interval: 500
initial-advertise-peer-urls: https://10.10.10.100:2380
initial-cluster: server-0-08c675b0=https://10.10.10.100:2380
initial-cluster-state: new
listen-client-http-urls: https://127.0.0.1:2382
listen-client-urls: https://127.0.0.1:2379,https://10.10.10.100:2379
listen-metrics-urls: http://127.0.0.1:2381
listen-peer-urls: https://127.0.0.1:2380,https://10.10.10.100:2380
log-outputs:
- stderr
logger: zap
name: server-0-08c675b0
peer-transport-security:
  cert-file: /var/lib/rancher/k3s/server/tls/etcd/peer-server-client.crt
  client-cert-auth: true
  key-file: /var/lib/rancher/k3s/server/tls/etcd/peer-server-client.key
  trusted-ca-file: /var/lib/rancher/k3s/server/tls/etcd/peer-ca.crt
snapshot-count: 10000
```
</details>

<details>
<summary><b>Remediation:</b></summary>

If running on with sqlite or a external DB, etcd checks are Not Applicable.
When running with embedded-etcd, K3s does not set the --auto-tls parameter.
If this check fails, edit the etcd pod specification file /var/lib/rancher/k3s/server/db/etcd/config on the master
node and either remove the --auto-tls parameter or set it to false.
client-transport-security:
  auto-tls: false
</details>

### 2.4 Ensure that the --peer-cert-file and --peer-key-file arguments are set as appropriate (Manual)

**Result:** PASS

**Audit:**
```bash

```

**Expected Result:** '.peer-transport-security.cert-file' is equal to '/var/lib/rancher/k3s/server/tls/etcd/peer-server-client.crt' AND '.peer-transport-security.key-file' is equal to '/var/lib/rancher/k3s/server/tls/etcd/peer-server-client.key'

<details>
<summary><b>Returned Value:</b></summary>

```log
advertise-client-urls: https://10.10.10.100:2379
client-transport-security:
  cert-file: /var/lib/rancher/k3s/server/tls/etcd/server-client.crt
  client-cert-auth: true
  key-file: /var/lib/rancher/k3s/server/tls/etcd/server-client.key
  trusted-ca-file: /var/lib/rancher/k3s/server/tls/etcd/server-ca.crt
data-dir: /var/lib/rancher/k3s/server/db/etcd
election-timeout: 5000
experimental-initial-corrupt-check: true
experimental-watch-progress-notify-interval: 5000000000
heartbeat-interval: 500
initial-advertise-peer-urls: https://10.10.10.100:2380
initial-cluster: server-0-08c675b0=https://10.10.10.100:2380
initial-cluster-state: new
listen-client-http-urls: https://127.0.0.1:2382
listen-client-urls: https://127.0.0.1:2379,https://10.10.10.100:2379
listen-metrics-urls: http://127.0.0.1:2381
listen-peer-urls: https://127.0.0.1:2380,https://10.10.10.100:2380
log-outputs:
- stderr
logger: zap
name: server-0-08c675b0
peer-transport-security:
  cert-file: /var/lib/rancher/k3s/server/tls/etcd/peer-server-client.crt
  client-cert-auth: true
  key-file: /var/lib/rancher/k3s/server/tls/etcd/peer-server-client.key
  trusted-ca-file: /var/lib/rancher/k3s/server/tls/etcd/peer-ca.crt
snapshot-count: 10000
```
</details>

<details>
<summary><b>Remediation:</b></summary>

If running on with sqlite or a external DB, etcd checks are Not Applicable.
When running with embedded-etcd, K3s generates peer cert and key files for etcd.
These are located in /var/lib/rancher/k3s/server/tls/etcd/.
If this check fails, ensure that the configuration file /var/lib/rancher/k3s/server/db/etcd/config
has not been modified to use custom peer cert and key files.
</details>

### 2.5 Ensure that the --peer-client-cert-auth argument is set to true (Manual)

**Result:** PASS

**Audit:**
```bash

```

**Expected Result:** '.peer-transport-security.client-cert-auth' is equal to 'true'

<details>
<summary><b>Returned Value:</b></summary>

```log
advertise-client-urls: https://10.10.10.100:2379
client-transport-security:
  cert-file: /var/lib/rancher/k3s/server/tls/etcd/server-client.crt
  client-cert-auth: true
  key-file: /var/lib/rancher/k3s/server/tls/etcd/server-client.key
  trusted-ca-file: /var/lib/rancher/k3s/server/tls/etcd/server-ca.crt
data-dir: /var/lib/rancher/k3s/server/db/etcd
election-timeout: 5000
experimental-initial-corrupt-check: true
experimental-watch-progress-notify-interval: 5000000000
heartbeat-interval: 500
initial-advertise-peer-urls: https://10.10.10.100:2380
initial-cluster: server-0-08c675b0=https://10.10.10.100:2380
initial-cluster-state: new
listen-client-http-urls: https://127.0.0.1:2382
listen-client-urls: https://127.0.0.1:2379,https://10.10.10.100:2379
listen-metrics-urls: http://127.0.0.1:2381
listen-peer-urls: https://127.0.0.1:2380,https://10.10.10.100:2380
log-outputs:
- stderr
logger: zap
name: server-0-08c675b0
peer-transport-security:
  cert-file: /var/lib/rancher/k3s/server/tls/etcd/peer-server-client.crt
  client-cert-auth: true
  key-file: /var/lib/rancher/k3s/server/tls/etcd/peer-server-client.key
  trusted-ca-file: /var/lib/rancher/k3s/server/tls/etcd/peer-ca.crt
snapshot-count: 10000
```
</details>

<details>
<summary><b>Remediation:</b></summary>

If running on with sqlite or a external DB, etcd checks are Not Applicable.
When running with embedded-etcd, K3s sets the --peer-cert-auth parameter to true.
If this check fails, ensure that the configuration file /var/lib/rancher/k3s/server/db/etcd/config
has not been modified to disable peer client certificate authentication.
</details>

### 2.6 Ensure that the --peer-auto-tls argument is not set to true (Manual)

**Result:** PASS

**Audit:**
```bash

```

**Expected Result:** '.peer-transport-security.auto-tls' is present OR '.peer-transport-security.auto-tls' is not present

<details>
<summary><b>Returned Value:</b></summary>

```log
advertise-client-urls: https://10.10.10.100:2379
client-transport-security:
  cert-file: /var/lib/rancher/k3s/server/tls/etcd/server-client.crt
  client-cert-auth: true
  key-file: /var/lib/rancher/k3s/server/tls/etcd/server-client.key
  trusted-ca-file: /var/lib/rancher/k3s/server/tls/etcd/server-ca.crt
data-dir: /var/lib/rancher/k3s/server/db/etcd
election-timeout: 5000
experimental-initial-corrupt-check: true
experimental-watch-progress-notify-interval: 5000000000
heartbeat-interval: 500
initial-advertise-peer-urls: https://10.10.10.100:2380
initial-cluster: server-0-08c675b0=https://10.10.10.100:2380
initial-cluster-state: new
listen-client-http-urls: https://127.0.0.1:2382
listen-client-urls: https://127.0.0.1:2379,https://10.10.10.100:2379
listen-metrics-urls: http://127.0.0.1:2381
listen-peer-urls: https://127.0.0.1:2380,https://10.10.10.100:2380
log-outputs:
- stderr
logger: zap
name: server-0-08c675b0
peer-transport-security:
  cert-file: /var/lib/rancher/k3s/server/tls/etcd/peer-server-client.crt
  client-cert-auth: true
  key-file: /var/lib/rancher/k3s/server/tls/etcd/peer-server-client.key
  trusted-ca-file: /var/lib/rancher/k3s/server/tls/etcd/peer-ca.crt
snapshot-count: 10000
```
</details>

<details>
<summary><b>Remediation:</b></summary>

If running on with sqlite or a external DB, etcd checks are Not Applicable.
When running with embedded-etcd, K3s does not set the --peer-auto-tls parameter.
If this check fails, edit the etcd pod specification file /var/lib/rancher/k3s/server/db/etcd/config on the master
node and either remove the --peer-auto-tls parameter or set it to false.
peer-transport-security:
  auto-tls: false
</details>

### 2.7 Ensure that a unique Certificate Authority is used for etcd (Manual)

**Result:** PASS

**Audit:**
```bash

```

**Expected Result:** '.peer-transport-security.trusted-ca-file' is equal to '/var/lib/rancher/k3s/server/tls/etcd/peer-ca.crt'

<details>
<summary><b>Returned Value:</b></summary>

```log
advertise-client-urls: https://10.10.10.100:2379
client-transport-security:
  cert-file: /var/lib/rancher/k3s/server/tls/etcd/server-client.crt
  client-cert-auth: true
  key-file: /var/lib/rancher/k3s/server/tls/etcd/server-client.key
  trusted-ca-file: /var/lib/rancher/k3s/server/tls/etcd/server-ca.crt
data-dir: /var/lib/rancher/k3s/server/db/etcd
election-timeout: 5000
experimental-initial-corrupt-check: true
experimental-watch-progress-notify-interval: 5000000000
heartbeat-interval: 500
initial-advertise-peer-urls: https://10.10.10.100:2380
initial-cluster: server-0-08c675b0=https://10.10.10.100:2380
initial-cluster-state: new
listen-client-http-urls: https://127.0.0.1:2382
listen-client-urls: https://127.0.0.1:2379,https://10.10.10.100:2379
listen-metrics-urls: http://127.0.0.1:2381
listen-peer-urls: https://127.0.0.1:2380,https://10.10.10.100:2380
log-outputs:
- stderr
logger: zap
name: server-0-08c675b0
peer-transport-security:
  cert-file: /var/lib/rancher/k3s/server/tls/etcd/peer-server-client.crt
  client-cert-auth: true
  key-file: /var/lib/rancher/k3s/server/tls/etcd/peer-server-client.key
  trusted-ca-file: /var/lib/rancher/k3s/server/tls/etcd/peer-ca.crt
snapshot-count: 10000
```
</details>

<details>
<summary><b>Remediation:</b></summary>

If running on with sqlite or a external DB, etcd checks are Not Applicable.
When running with embedded-etcd, K3s generates a unique certificate authority for etcd.
This is located at /var/lib/rancher/k3s/server/tls/etcd/peer-ca.crt.
If this check fails, ensure that the configuration file /var/lib/rancher/k3s/server/db/etcd/config
has not been modified to use a shared certificate authority.
</details>

## 4.1 Worker Node Configuration Files

### 4.1.1 Ensure that the kubelet service file permissions are set to 600 or more restrictive (Automated)

**Result:** Not Applicable

**Rationale:**

The kubelet is embedded in the k3s process. There is no kubelet service file, all configuration is passed in as arguments at runtime.

### 4.1.2 Ensure that the kubelet service file ownership is set to root:root (Automated)

**Result:** Not Applicable

**Rationale:**

The kubelet is embedded in the k3s process. There is no kubelet service file, all configuration is passed in as arguments at runtime.

 All configuration is passed in as arguments at container run time.

### 4.1.3 If proxy kubeconfig file exists ensure permissions are set to 600 or more restrictive (Automated)

**Result:** PASS

**Audit:**
```bash
/bin/sh -c 'if test -e /var/lib/rancher/k3s/agent/kubeproxy.kubeconfig; then stat -c permissions=%a /var/lib/rancher/k3s/agent/kubeproxy.kubeconfig; fi' 
```

**Expected Result:** permissions has permissions 600, expected 600 or more restrictive

<details>
<summary><b>Returned Value:</b></summary>

```log
permissions=600
```
</details>

<details>
<summary><b>Remediation:</b></summary>

Run the below command (based on the file location on your system) on the each worker node.
For example,
`chmod 600 /var/lib/rancher/k3s/agent/kubeproxy.kubeconfig`
</details>

### 4.1.4 If proxy kubeconfig file exists ensure ownership is set to root:root (Automated)

**Result:** PASS

**Audit:**
```bash
/bin/sh -c 'if test -e /var/lib/rancher/k3s/agent/kubeproxy.kubeconfig; then stat -c %U:%G /var/lib/rancher/k3s/agent/kubeproxy.kubeconfig; fi' 
```

**Expected Result:** 'root:root' is present

<details>
<summary><b>Returned Value:</b></summary>

```log
root:root
```
</details>

<details>
<summary><b>Remediation:</b></summary>

Run the below command (based on the file location on your system) on the each worker node.
For example, `chown root:root /var/lib/rancher/k3s/agent/kubeproxy.kubeconfig`
</details>

### 4.1.5 Ensure that the --kubeconfig kubelet.conf file permissions are set to 600 or more restrictive (Automated)

**Result:** PASS

**Audit:**
```bash
/bin/sh -c 'if test -e /var/lib/rancher/k3s/agent/kubelet.kubeconfig; then stat -c permissions=%a /var/lib/rancher/k3s/agent/kubelet.kubeconfig; fi' 
```

**Expected Result:** permissions has permissions 600, expected 600 or more restrictive

<details>
<summary><b>Returned Value:</b></summary>

```log
permissions=600
```
</details>

<details>
<summary><b>Remediation:</b></summary>

Run the below command (based on the file location on your system) on the each worker node.
For example,
`chmod 600 /var/lib/rancher/k3s/agent/kubelet.kubeconfig`
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

```log
root:root
```
</details>

<details>
<summary><b>Remediation:</b></summary>

Run the below command (based on the file location on your system) on the each worker node.
For example,
`chown root:root /var/lib/rancher/k3s/agent/kubelet.kubeconfig`
</details>

### 4.1.7 Ensure that the certificate authorities file permissions are set to 600 or more restrictive (Automated)

**Result:** PASS

**Audit:**
```bash
stat -c permissions=%a /var/lib/rancher/k3s/agent/client-ca.crt
```

**Expected Result:** permissions has permissions 600, expected 600 or more restrictive

<details>
<summary><b>Returned Value:</b></summary>

```log
permissions=600
```
</details>

<details>
<summary><b>Remediation:</b></summary>

Run the following command to modify the file permissions of the
--client-ca-file `chmod 600 /var/lib/rancher/k3s/agent/client-ca.crt`
</details>

### 4.1.8 Ensure that the client certificate authorities file ownership is set to root:root (Automated)

**Result:** PASS

**Audit:**
```bash
stat -c %U:%G /var/lib/rancher/k3s/agent/client-ca.crt
```

**Expected Result:** 'root:root' is equal to 'root:root'

<details>
<summary><b>Returned Value:</b></summary>

```log
root:root
```
</details>

<details>
<summary><b>Remediation:</b></summary>

Run the following command to modify the ownership of the --client-ca-file.
`chown root:root /var/lib/rancher/k3s/agent/client-ca.crt`
</details>

### 4.1.9 Ensure that the kubelet --config configuration file has permissions set to 600 or more restrictive (Automated)

**Result:** Not Applicable

**Rationale:**

The kubelet is embedded in the k3s process. There is no kubelet config file, all configuration is passed in as arguments at runtime.

### 4.1.10 Ensure that the kubelet --config configuration file ownership is set to root:root (Automated)

**Result:** Not Applicable

**Rationale:**

The kubelet is embedded in the k3s process. There is no kubelet config file, all configuration is passed in as arguments at runtime.

## 4.2 Kubelet

### 4.2.1 Ensure that the --anonymous-auth argument is set to false (Automated)

**Result:** PASS

**Audit:**
```bash
/bin/sh -c 'if test $(journalctl -m -u k3s | grep  "Running kube-apiserver" | wc -l) -gt 0; then journalctl -m -u k3s | grep  "Running kube-apiserver" | tail -n1 | grep "anonymous-auth" | grep -v grep; else echo "--anonymous-auth=false"; fi' 
```

**Expected Result:** '--anonymous-auth' is equal to 'false'

<details>
<summary><b>Returned Value:</b></summary>

```log
Sep 11 17:22:08 server-0 k3s[2234]: time="2025-09-11T17:22:08Z" level=info msg="Running kube-apiserver --admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --encryption-provider-config-automatic-reload=true --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

<details>
<summary><b>Remediation:</b></summary>

By default, K3s sets the --anonymous-auth to false. If you have set this to a different value, you
should set it back to false. If using the K3s config file /etc/rancher/k3s/config.yaml, remove any lines similar to below.
```
kubelet-arg:
  - "anonymous-auth=true"
```
If using the command line, edit the K3s service file and remove the below argument.
--kubelet-arg="anonymous-auth=true"
Based on your system, restart the k3s service. For example,
systemctl daemon-reload
systemctl restart k3s.service
</details>

### 4.2.2 Ensure that the --authorization-mode argument is not set to AlwaysAllow (Automated)

**Result:** PASS

**Audit:**
```bash
/bin/sh -c 'if test $(journalctl -m -u k3s | grep  "Running kube-apiserver" | wc -l) -gt 0; then journalctl -m -u k3s | grep  "Running kube-apiserver" | tail -n1 | grep "authorization-mode"; else echo "--authorization-mode=Webhook"; fi' 
```

**Expected Result:** '--authorization-mode' does not have 'AlwaysAllow'

<details>
<summary><b>Returned Value:</b></summary>

```log
Sep 11 17:22:08 server-0 k3s[2234]: time="2025-09-11T17:22:08Z" level=info msg="Running kube-apiserver --admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --encryption-provider-config-automatic-reload=true --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

<details>
<summary><b>Remediation:</b></summary>

By default, K3s does not set the --authorization-mode to AlwaysAllow.
If using the K3s config file /etc/rancher/k3s/config.yaml, remove any lines similar to below.
```
kubelet-arg:
  - "authorization-mode=AlwaysAllow"
```
If using the command line, edit the K3s service file and remove the below argument.
--kubelet-arg="authorization-mode=AlwaysAllow"
Based on your system, restart the k3s service. For example,
systemctl daemon-reload
systemctl restart k3s.service
</details>

### 4.2.3 Ensure that the --client-ca-file argument is set as appropriate (Automated)

**Result:** PASS

**Audit:**
```bash
/bin/sh -c 'if test $(journalctl -m -u k3s | grep  "Running kube-apiserver" | wc -l) -gt 0; then journalctl -m -u k3s | grep  "Running kube-apiserver" | tail -n1 | grep "client-ca-file"; else echo "--client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt"; fi' 
```

**Expected Result:** '--client-ca-file' is present

<details>
<summary><b>Returned Value:</b></summary>

```log
Sep 11 17:22:08 server-0 k3s[2234]: time="2025-09-11T17:22:08Z" level=info msg="Running kube-apiserver --admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml --advertise-address=10.10.10.100 --advertise-port=6443 --allow-privileged=true --anonymous-auth=false --api-audiences=https://kubernetes.default.svc.cluster.local,k3s --audit-log-maxage=30 --audit-log-maxbackup=10 --audit-log-maxsize=100 --audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log --audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml --authorization-mode=Node,RBAC --bind-address=127.0.0.1 --cert-dir=/var/lib/rancher/k3s/server/tls/temporary-certs --client-ca-file=/var/lib/rancher/k3s/server/tls/client-ca.crt --egress-selector-config-file=/var/lib/rancher/k3s/server/etc/egress-selector-config.yaml --enable-admission-plugins=NodeRestriction --enable-aggregator-routing=true --enable-bootstrap-token-auth=true --encryption-provider-config=/var/lib/rancher/k3s/server/cred/encryption-config.json --encryption-provider-config-automatic-reload=true --etcd-cafile=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt --etcd-certfile=/var/lib/rancher/k3s/server/tls/etcd/client.crt --etcd-keyfile=/var/lib/rancher/k3s/server/tls/etcd/client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-certificate-authority=/var/lib/rancher/k3s/server/tls/server-ca.crt --kubelet-client-certificate=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.crt --kubelet-client-key=/var/lib/rancher/k3s/server/tls/client-kube-apiserver.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --profiling=false --proxy-client-cert-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.crt --proxy-client-key-file=/var/lib/rancher/k3s/server/tls/client-auth-proxy.key --requestheader-allowed-names=system:auth-proxy --requestheader-client-ca-file=/var/lib/rancher/k3s/server/tls/request-header-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6444 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/var/lib/rancher/k3s/server/tls/service.key --service-account-signing-key-file=/var/lib/rancher/k3s/server/tls/service.current.key --service-cluster-ip-range=10.43.0.0/16 --service-node-port-range=30000-32767 --storage-backend=etcd3 --tls-cert-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/server/tls/serving-kube-apiserver.key"
```
</details>

<details>
<summary><b>Remediation:</b></summary>

By default, K3s automatically provides the client ca certificate for the Kubelet.
It is generated and located at /var/lib/rancher/k3s/agent/client-ca.crt
</details>

### 4.2.4 Verify that the --read-only-port argument is set to 0 (Automated)

**Result:** PASS

**Audit:**
```bash
journalctl -m -u k3s -u k3s-agent | grep 'Running kubelet' | tail -n1
```

**Expected Result:** '--read-only-port' is equal to '0' OR '--read-only-port' is not present

<details>
<summary><b>Returned Value:</b></summary>

```log
Sep 11 17:22:10 server-0 k3s[2234]: time="2025-09-11T17:22:10Z" level=info msg="Running kubelet --address=0.0.0.0 --allowed-unsafe-sysctls=net.ipv4.ip_forward,net.ipv6.conf.all.forwarding --anonymous-auth=false --authentication-token-webhook=true --authorization-mode=Webhook --cgroup-driver=systemd --client-ca-file=/var/lib/rancher/k3s/agent/client-ca.crt --cloud-provider=external --cluster-dns=10.43.0.10 --cluster-domain=cluster.local --container-runtime-endpoint=unix:///run/k3s/containerd/containerd.sock --containerd=/run/k3s/containerd/containerd.sock --event-qps=0 --eviction-hard=imagefs.available<5%,nodefs.available<5% --eviction-minimum-reclaim=imagefs.available=10%,nodefs.available=10% --fail-swap-on=false --feature-gates=CloudDualStackNodeIPs=true --healthz-bind-address=127.0.0.1 --hostname-override=server-0 --kubeconfig=/var/lib/rancher/k3s/agent/kubelet.kubeconfig --make-iptables-util-chains=true --node-ip=10.10.10.100 --node-labels= --pod-infra-container-image=rancher/mirrored-pause:3.6 --pod-manifest-path=/var/lib/rancher/k3s/agent/pod-manifests --protect-kernel-defaults=true --read-only-port=0 --resolv-conf=/run/systemd/resolve/resolv.conf --serialize-image-pulls=false --streaming-connection-idle-timeout=5m --tls-cert-file=/var/lib/rancher/k3s/agent/serving-kubelet.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/agent/serving-kubelet.key"
```
</details>

<details>
<summary><b>Remediation:</b></summary>

By default, K3s sets the --read-only-port to 0. If you have set this to a different value, you
should set it back to 0. If using the K3s config file /etc/rancher/k3s/config.yaml, remove any lines similar to below.
```
kubelet-arg:
  - "read-only-port=XXXX"
```
If using the command line, edit the K3s service file and remove the below argument.
--kubelet-arg="read-only-port=XXXX"
Based on your system, restart the k3s service. For example,
systemctl daemon-reload
systemctl restart k3s.service
</details>

### 4.2.5 Ensure that the --streaming-connection-idle-timeout argument is not set to 0 (Manual)

**Result:** PASS

**Audit:**
```bash
journalctl -m -u k3s -u k3s-agent | grep 'Running kubelet' | tail -n1
```

**Expected Result:** '--streaming-connection-idle-timeout' is not equal to '0' OR '--streaming-connection-idle-timeout' is not present

<details>
<summary><b>Returned Value:</b></summary>

```log
Sep 11 17:22:10 server-0 k3s[2234]: time="2025-09-11T17:22:10Z" level=info msg="Running kubelet --address=0.0.0.0 --allowed-unsafe-sysctls=net.ipv4.ip_forward,net.ipv6.conf.all.forwarding --anonymous-auth=false --authentication-token-webhook=true --authorization-mode=Webhook --cgroup-driver=systemd --client-ca-file=/var/lib/rancher/k3s/agent/client-ca.crt --cloud-provider=external --cluster-dns=10.43.0.10 --cluster-domain=cluster.local --container-runtime-endpoint=unix:///run/k3s/containerd/containerd.sock --containerd=/run/k3s/containerd/containerd.sock --event-qps=0 --eviction-hard=imagefs.available<5%,nodefs.available<5% --eviction-minimum-reclaim=imagefs.available=10%,nodefs.available=10% --fail-swap-on=false --feature-gates=CloudDualStackNodeIPs=true --healthz-bind-address=127.0.0.1 --hostname-override=server-0 --kubeconfig=/var/lib/rancher/k3s/agent/kubelet.kubeconfig --make-iptables-util-chains=true --node-ip=10.10.10.100 --node-labels= --pod-infra-container-image=rancher/mirrored-pause:3.6 --pod-manifest-path=/var/lib/rancher/k3s/agent/pod-manifests --protect-kernel-defaults=true --read-only-port=0 --resolv-conf=/run/systemd/resolve/resolv.conf --serialize-image-pulls=false --streaming-connection-idle-timeout=5m --tls-cert-file=/var/lib/rancher/k3s/agent/serving-kubelet.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/agent/serving-kubelet.key"
```
</details>

<details>
<summary><b>Remediation:</b></summary>

If using the K3s config file /etc/rancher/k3s/config.yaml, set the following parameter to an appropriate value.
```
kubelet-arg:
  - "streaming-connection-idle-timeout=5m"
```
If using the command line, run K3s with --kubelet-arg="streaming-connection-idle-timeout=5m".
Based on your system, restart the k3s service. For example,
systemctl restart k3s.service
</details>

### 4.2.6 Ensure that the --make-iptables-util-chains argument is set to true (Automated)

**Result:** PASS

**Audit:**
```bash
journalctl -m -u k3s -u k3s-agent | grep 'Running kubelet' | tail -n1
```

**Expected Result:** '--make-iptables-util-chains' is equal to 'true' OR '--make-iptables-util-chains' is not present

<details>
<summary><b>Returned Value:</b></summary>

```log
Sep 11 17:22:10 server-0 k3s[2234]: time="2025-09-11T17:22:10Z" level=info msg="Running kubelet --address=0.0.0.0 --allowed-unsafe-sysctls=net.ipv4.ip_forward,net.ipv6.conf.all.forwarding --anonymous-auth=false --authentication-token-webhook=true --authorization-mode=Webhook --cgroup-driver=systemd --client-ca-file=/var/lib/rancher/k3s/agent/client-ca.crt --cloud-provider=external --cluster-dns=10.43.0.10 --cluster-domain=cluster.local --container-runtime-endpoint=unix:///run/k3s/containerd/containerd.sock --containerd=/run/k3s/containerd/containerd.sock --event-qps=0 --eviction-hard=imagefs.available<5%,nodefs.available<5% --eviction-minimum-reclaim=imagefs.available=10%,nodefs.available=10% --fail-swap-on=false --feature-gates=CloudDualStackNodeIPs=true --healthz-bind-address=127.0.0.1 --hostname-override=server-0 --kubeconfig=/var/lib/rancher/k3s/agent/kubelet.kubeconfig --make-iptables-util-chains=true --node-ip=10.10.10.100 --node-labels= --pod-infra-container-image=rancher/mirrored-pause:3.6 --pod-manifest-path=/var/lib/rancher/k3s/agent/pod-manifests --protect-kernel-defaults=true --read-only-port=0 --resolv-conf=/run/systemd/resolve/resolv.conf --serialize-image-pulls=false --streaming-connection-idle-timeout=5m --tls-cert-file=/var/lib/rancher/k3s/agent/serving-kubelet.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/agent/serving-kubelet.key"
```
</details>

<details>
<summary><b>Remediation:</b></summary>

If using the K3s config file /etc/rancher/k3s/config.yaml, set the following parameter.
```
kubelet-arg:
  - "make-iptables-util-chains=true"
```
If using the command line, run K3s with --kubelet-arg="make-iptables-util-chains=true".
Based on your system, restart the k3s service. For example,
systemctl restart k3s.service
</details>

### 4.2.7 Ensure that the --hostname-override argument is not set (Automated)

**Result:** Not Applicable

**Rationale:**

By default, K3s does set the --hostname-override argument. Per CIS guidelines, this is to comply
with cloud providers that require this flag to ensure that hostname matches node names.

### 4.2.8 Ensure that the eventRecordQPS argument is set to a level which ensures appropriate event capture (Manual)

**Result:** PASS

**Audit:**
```bash
journalctl -m -u k3s -u k3s-agent | grep 'Running kubelet' | tail -n1
```

**Expected Result:** '--event-qps' is greater or equal to 0 OR '--event-qps' is not present

<details>
<summary><b>Returned Value:</b></summary>

```log
Sep 11 17:22:10 server-0 k3s[2234]: time="2025-09-11T17:22:10Z" level=info msg="Running kubelet --address=0.0.0.0 --allowed-unsafe-sysctls=net.ipv4.ip_forward,net.ipv6.conf.all.forwarding --anonymous-auth=false --authentication-token-webhook=true --authorization-mode=Webhook --cgroup-driver=systemd --client-ca-file=/var/lib/rancher/k3s/agent/client-ca.crt --cloud-provider=external --cluster-dns=10.43.0.10 --cluster-domain=cluster.local --container-runtime-endpoint=unix:///run/k3s/containerd/containerd.sock --containerd=/run/k3s/containerd/containerd.sock --event-qps=0 --eviction-hard=imagefs.available<5%,nodefs.available<5% --eviction-minimum-reclaim=imagefs.available=10%,nodefs.available=10% --fail-swap-on=false --feature-gates=CloudDualStackNodeIPs=true --healthz-bind-address=127.0.0.1 --hostname-override=server-0 --kubeconfig=/var/lib/rancher/k3s/agent/kubelet.kubeconfig --make-iptables-util-chains=true --node-ip=10.10.10.100 --node-labels= --pod-infra-container-image=rancher/mirrored-pause:3.6 --pod-manifest-path=/var/lib/rancher/k3s/agent/pod-manifests --protect-kernel-defaults=true --read-only-port=0 --resolv-conf=/run/systemd/resolve/resolv.conf --serialize-image-pulls=false --streaming-connection-idle-timeout=5m --tls-cert-file=/var/lib/rancher/k3s/agent/serving-kubelet.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/agent/serving-kubelet.key"
```
</details>

<details>
<summary><b>Remediation:</b></summary>

By default, K3s sets the event-qps to 0. Should you wish to change this,
If using the K3s config file /etc/rancher/k3s/config.yaml, set the following parameter to an appropriate value.
```
kubelet-arg:
  - "event-qps=<value>"
```
If using the command line, run K3s with --kubelet-arg="event-qps=&lt;value&gt;".
Based on your system, restart the k3s service. For example,
systemctl restart k3s.service
</details>

### 4.2.9 Ensure that the --tls-cert-file and --tls-private-key-file arguments are set as appropriate (Automated)

**Result:** PASS

**Audit:**
```bash
journalctl -m -u k3s -u k3s-agent | grep 'Running kubelet' | tail -n1
```

**Expected Result:** '--tls-cert-file' is present AND '--tls-private-key-file' is present

<details>
<summary><b>Returned Value:</b></summary>

```log
Sep 11 17:22:10 server-0 k3s[2234]: time="2025-09-11T17:22:10Z" level=info msg="Running kubelet --address=0.0.0.0 --allowed-unsafe-sysctls=net.ipv4.ip_forward,net.ipv6.conf.all.forwarding --anonymous-auth=false --authentication-token-webhook=true --authorization-mode=Webhook --cgroup-driver=systemd --client-ca-file=/var/lib/rancher/k3s/agent/client-ca.crt --cloud-provider=external --cluster-dns=10.43.0.10 --cluster-domain=cluster.local --container-runtime-endpoint=unix:///run/k3s/containerd/containerd.sock --containerd=/run/k3s/containerd/containerd.sock --event-qps=0 --eviction-hard=imagefs.available<5%,nodefs.available<5% --eviction-minimum-reclaim=imagefs.available=10%,nodefs.available=10% --fail-swap-on=false --feature-gates=CloudDualStackNodeIPs=true --healthz-bind-address=127.0.0.1 --hostname-override=server-0 --kubeconfig=/var/lib/rancher/k3s/agent/kubelet.kubeconfig --make-iptables-util-chains=true --node-ip=10.10.10.100 --node-labels= --pod-infra-container-image=rancher/mirrored-pause:3.6 --pod-manifest-path=/var/lib/rancher/k3s/agent/pod-manifests --protect-kernel-defaults=true --read-only-port=0 --resolv-conf=/run/systemd/resolve/resolv.conf --serialize-image-pulls=false --streaming-connection-idle-timeout=5m --tls-cert-file=/var/lib/rancher/k3s/agent/serving-kubelet.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/agent/serving-kubelet.key"
```
</details>

<details>
<summary><b>Remediation:</b></summary>

By default, K3s automatically provides the TLS certificate and private key for the Kubelet.
They are generated and located at /var/lib/rancher/k3s/agent/serving-kubelet.crt and /var/lib/rancher/k3s/agent/serving-kubelet.key
If for some reason you need to provide your own certificate and key, you can set the
below parameters in the K3s config file /etc/rancher/k3s/config.yaml.
```
kubelet-arg:
  - "tls-cert-file=<path/to/tls-cert-file>"
  - "tls-private-key-file=<path/to/tls-private-key-file>"
```
</details>

### 4.2.10 Ensure that the --rotate-certificates argument is not set to false (Automated)

**Result:** PASS

**Audit:**
```bash
journalctl -m -u k3s -u k3s-agent | grep 'Running kubelet' | tail -n1
```

**Expected Result:** '--rotate-certificates' is present OR '--rotate-certificates' is not present

<details>
<summary><b>Returned Value:</b></summary>

```log
Sep 11 17:22:10 server-0 k3s[2234]: time="2025-09-11T17:22:10Z" level=info msg="Running kubelet --address=0.0.0.0 --allowed-unsafe-sysctls=net.ipv4.ip_forward,net.ipv6.conf.all.forwarding --anonymous-auth=false --authentication-token-webhook=true --authorization-mode=Webhook --cgroup-driver=systemd --client-ca-file=/var/lib/rancher/k3s/agent/client-ca.crt --cloud-provider=external --cluster-dns=10.43.0.10 --cluster-domain=cluster.local --container-runtime-endpoint=unix:///run/k3s/containerd/containerd.sock --containerd=/run/k3s/containerd/containerd.sock --event-qps=0 --eviction-hard=imagefs.available<5%,nodefs.available<5% --eviction-minimum-reclaim=imagefs.available=10%,nodefs.available=10% --fail-swap-on=false --feature-gates=CloudDualStackNodeIPs=true --healthz-bind-address=127.0.0.1 --hostname-override=server-0 --kubeconfig=/var/lib/rancher/k3s/agent/kubelet.kubeconfig --make-iptables-util-chains=true --node-ip=10.10.10.100 --node-labels= --pod-infra-container-image=rancher/mirrored-pause:3.6 --pod-manifest-path=/var/lib/rancher/k3s/agent/pod-manifests --protect-kernel-defaults=true --read-only-port=0 --resolv-conf=/run/systemd/resolve/resolv.conf --serialize-image-pulls=false --streaming-connection-idle-timeout=5m --tls-cert-file=/var/lib/rancher/k3s/agent/serving-kubelet.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/agent/serving-kubelet.key"
```
</details>

<details>
<summary><b>Remediation:</b></summary>

By default, K3s does not set the --rotate-certificates argument. If you have set this flag with a value of `false`, you should either set it to `true` or completely remove the flag.
If using the K3s config file /etc/rancher/k3s/config.yaml, remove any rotate-certificates parameter.
If using the command line, remove the K3s flag --kubelet-arg="rotate-certificates".
Based on your system, restart the k3s service. For example,
systemctl restart k3s.service
</details>

### 4.2.11 Verify that the RotateKubeletServerCertificate argument is set to true (Automated)

**Result:** PASS

**Audit:**
```bash
journalctl -m -u k3s -u k3s-agent | grep 'Running kubelet' | tail -n1
```

**Expected Result:** 'RotateKubeletServerCertificate' is present OR 'RotateKubeletServerCertificate' is not present

<details>
<summary><b>Returned Value:</b></summary>

```log
Sep 11 17:22:10 server-0 k3s[2234]: time="2025-09-11T17:22:10Z" level=info msg="Running kubelet --address=0.0.0.0 --allowed-unsafe-sysctls=net.ipv4.ip_forward,net.ipv6.conf.all.forwarding --anonymous-auth=false --authentication-token-webhook=true --authorization-mode=Webhook --cgroup-driver=systemd --client-ca-file=/var/lib/rancher/k3s/agent/client-ca.crt --cloud-provider=external --cluster-dns=10.43.0.10 --cluster-domain=cluster.local --container-runtime-endpoint=unix:///run/k3s/containerd/containerd.sock --containerd=/run/k3s/containerd/containerd.sock --event-qps=0 --eviction-hard=imagefs.available<5%,nodefs.available<5% --eviction-minimum-reclaim=imagefs.available=10%,nodefs.available=10% --fail-swap-on=false --feature-gates=CloudDualStackNodeIPs=true --healthz-bind-address=127.0.0.1 --hostname-override=server-0 --kubeconfig=/var/lib/rancher/k3s/agent/kubelet.kubeconfig --make-iptables-util-chains=true --node-ip=10.10.10.100 --node-labels= --pod-infra-container-image=rancher/mirrored-pause:3.6 --pod-manifest-path=/var/lib/rancher/k3s/agent/pod-manifests --protect-kernel-defaults=true --read-only-port=0 --resolv-conf=/run/systemd/resolve/resolv.conf --serialize-image-pulls=false --streaming-connection-idle-timeout=5m --tls-cert-file=/var/lib/rancher/k3s/agent/serving-kubelet.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/agent/serving-kubelet.key"
```
</details>

<details>
<summary><b>Remediation:</b></summary>

By default, K3s does not set the RotateKubeletServerCertificate feature gate.
If you have enabled this feature gate, you should remove it.
If using the K3s config file /etc/rancher/k3s/config.yaml, remove any feature-gate=RotateKubeletServerCertificate parameter.
If using the command line, remove the K3s flag --kubelet-arg="feature-gate=RotateKubeletServerCertificate".
Based on your system, restart the k3s service. For example,
systemctl restart k3s.service
</details>

### 4.2.12 Ensure that the Kubelet only makes use of Strong Cryptographic Ciphers (Manual)

**Result:** PASS

**Audit:**
```bash
journalctl -m -u k3s -u k3s-agent | grep 'Running kubelet' | tail -n1
```

**Expected Result:** '--tls-cipher-suites' contains valid elements from 'TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_AES_128_GCM_SHA256'

<details>
<summary><b>Returned Value:</b></summary>

```log
Sep 11 17:22:10 server-0 k3s[2234]: time="2025-09-11T17:22:10Z" level=info msg="Running kubelet --address=0.0.0.0 --allowed-unsafe-sysctls=net.ipv4.ip_forward,net.ipv6.conf.all.forwarding --anonymous-auth=false --authentication-token-webhook=true --authorization-mode=Webhook --cgroup-driver=systemd --client-ca-file=/var/lib/rancher/k3s/agent/client-ca.crt --cloud-provider=external --cluster-dns=10.43.0.10 --cluster-domain=cluster.local --container-runtime-endpoint=unix:///run/k3s/containerd/containerd.sock --containerd=/run/k3s/containerd/containerd.sock --event-qps=0 --eviction-hard=imagefs.available<5%,nodefs.available<5% --eviction-minimum-reclaim=imagefs.available=10%,nodefs.available=10% --fail-swap-on=false --feature-gates=CloudDualStackNodeIPs=true --healthz-bind-address=127.0.0.1 --hostname-override=server-0 --kubeconfig=/var/lib/rancher/k3s/agent/kubelet.kubeconfig --make-iptables-util-chains=true --node-ip=10.10.10.100 --node-labels= --pod-infra-container-image=rancher/mirrored-pause:3.6 --pod-manifest-path=/var/lib/rancher/k3s/agent/pod-manifests --protect-kernel-defaults=true --read-only-port=0 --resolv-conf=/run/systemd/resolve/resolv.conf --serialize-image-pulls=false --streaming-connection-idle-timeout=5m --tls-cert-file=/var/lib/rancher/k3s/agent/serving-kubelet.crt --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305 --tls-private-key-file=/var/lib/rancher/k3s/agent/serving-kubelet.key"
```
</details>

<details>
<summary><b>Remediation:</b></summary>

If using a K3s config file /etc/rancher/k3s/config.yaml, edit the file to set `TLSCipherSuites` to
```
kubelet-arg:
  - "tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305"
```
or to a subset of these values.
If using the command line, add the K3s flag --kubelet-arg="tls-cipher-suites=&lt;same values as above&gt;"
Based on your system, restart the k3s service. For example,
systemctl restart k3s.service
</details>

### 4.2.13 Ensure that a limit is set on pod PIDs (Manual)

**Result:** WARN

**Remediation:**
Decide on an appropriate level for this parameter and set it,
If using a K3s config file /etc/rancher/k3s/config.yaml, edit the file to set `podPidsLimit` to
```
kubelet-arg:
  - "pod-max-pids=<value>"
```

## 4.3 kube-proxy

### 4.3.1 Ensure that the kube-proxy metrics service is bound to localhost (Automated)

**Result:** PASS

**Audit:**
```bash
journalctl -m -u k3s -u k3s-agent | grep 'Running kube-proxy' | tail -n1
```

**Expected Result:** '--metrics-bind-address' is present OR '--metrics-bind-address' is not present

<details>
<summary><b>Returned Value:</b></summary>

```log
Sep 11 17:22:10 server-0 k3s[2234]: time="2025-09-11T17:22:10Z" level=info msg="Running kube-proxy --cluster-cidr=10.42.0.0/16 --conntrack-max-per-core=0 --conntrack-tcp-timeout-close-wait=0s --conntrack-tcp-timeout-established=0s --healthz-bind-address=127.0.0.1 --hostname-override=server-0 --kubeconfig=/var/lib/rancher/k3s/agent/kubeproxy.kubeconfig --proxy-mode=iptables"
```
</details>

<details>
<summary><b>Remediation:</b></summary>

Modify or remove any values which bind the metrics service to a non-localhost address.
The default value is 127.0.0.1:10249.
</details>

## 5.1 RBAC and Service Accounts

### 5.1.1 Ensure that the cluster-admin role is only used where required (Automated)

**Result:** PASS

**Audit:**
```bash
kubectl get clusterrolebindings -o=custom-columns=ROLE:.roleRef.name,NAME:.metadata.name,SUBJECT:.subjects[*].name --no-headers |  grep cluster-admin
```

**Expected Result:** 'cluster-admin' contains valid elements from 'cluster-admin, helm-kube-system-traefik, helm-kube-system-traefik-crd'

<details>
<summary><b>Returned Value:</b></summary>

```log
cluster-admin                                          cluster-admin                                          system:masters
cluster-admin                                          helm-kube-system-traefik                               helm-traefik
cluster-admin                                          helm-kube-system-traefik-crd                           helm-traefik-crd
```
</details>

<details>
<summary><b>Remediation:</b></summary>

Identify all clusterrolebindings to the cluster-admin role. Check if they are used and
if they need this role or if they could use a role with fewer privileges. K3s gives exceptions
to the helm-kube-system-traefik and helm-kube-system-traefik-crd clusterrolebindings
as these are required for traefik installation into the kube-system namespace for regular operations.
Where possible, first bind users to a lower privileged role and then remove the
clusterrolebinding to the cluster-admin role:
```
kubectl delete clusterrolebinding [name]
```
</details>

### 5.1.2 Minimize access to secrets (Automated)

**Result:** WARN

**Remediation:**
Where possible, remove get, list and watch access to Secret objects in the cluster.

### 5.1.3 Minimize wildcard use in Roles and ClusterRoles (Automated)

**Result:** PASS

**Audit:**
```bash
# Check Roles
kubectl get roles --all-namespaces -o custom-columns=ROLE_NAMESPACE:.metadata.namespace,ROLE_NAME:.metadata.name --no-headers | while read -r role_namespace role_name
do
  role_rules=$(kubectl get role -n "${role_namespace}" "${role_name}" -o=json | jq -c '.rules')
  if echo "${role_rules}" | grep -q "\[\"\*\"\]"; then
    printf "**role_name: %-50s  role_namespace: %-25s role_rules: %s is_compliant: false\n" "${role_name}" "${role_namespace}" "${role_rules}"
  else
    printf "**role_name: %-50s role_namespace: %-25s is_compliant: true\n" "${role_name}" "${role_namespace}"
  fi;
done

cr_whitelist="cluster-admin k3s-cloud-controller-manager local-path-provisioner-role"
cr_whitelist="$cr_whitelist system:kube-controller-manager system:kubelet-api-admin system:controller:namespace-controller"
cr_whitelist="$cr_whitelist system:controller:disruption-controller system:controller:generic-garbage-collector"
cr_whitelist="$cr_whitelist system:controller:horizontal-pod-autoscaler system:controller:resourcequota-controller"
# Check ClusterRoles
kubectl get clusterroles -o custom-columns=CLUSTERROLE_NAME:.metadata.name --no-headers | while read -r clusterrole_name
do
  clusterrole_rules=$(kubectl get clusterrole "${clusterrole_name}" -o=json | jq -c '.rules')
  if echo "${cr_whitelist}" | grep -q "${clusterrole_name}"; then
    printf "**clusterrole_name: %-50s is_whitelist: true  is_compliant: true\n" "${clusterrole_name}"
  elif echo "${clusterrole_rules}" | grep -q "\[\"\*\"\]"; then
    echo "**clusterrole_name: ${clusterrole_name} clusterrole_rules: ${clusterrole_rules} is_compliant: false"
  else
    printf "**clusterrole_name: %-50s is_whitelist: false is_compliant: true\n" "${clusterrole_name}"
  fi;
done
```

**Expected Result:** 'is_compliant' is equal to 'true'

<details>
<summary><b>Returned Value:</b></summary>

```log
**role_name: system:controller:bootstrap-signer                 role_namespace: kube-public               is_compliant: true
**role_name: extension-apiserver-authentication-reader          role_namespace: kube-system               is_compliant: true
**role_name: system::leader-locking-kube-controller-manager     role_namespace: kube-system               is_compliant: true
**role_name: system::leader-locking-kube-scheduler              role_namespace: kube-system               is_compliant: true
**role_name: system:controller:bootstrap-signer                 role_namespace: kube-system               is_compliant: true
**role_name: system:controller:cloud-provider                   role_namespace: kube-system               is_compliant: true
**role_name: system:controller:token-cleaner                    role_namespace: kube-system               is_compliant: true
**clusterrole_name: admin                                              is_whitelist: true  is_compliant: true
**clusterrole_name: cluster-admin                                      is_whitelist: true  is_compliant: true
**clusterrole_name: clustercidrs-node                                  is_whitelist: false is_compliant: true
**clusterrole_name: edit                                               is_whitelist: false is_compliant: true
**clusterrole_name: k3s-cloud-controller-manager                       is_whitelist: true  is_compliant: true
**clusterrole_name: local-path-provisioner-role                        is_whitelist: true  is_compliant: true
**clusterrole_name: system:aggregate-to-admin                          is_whitelist: false is_compliant: true
**clusterrole_name: system:aggregate-to-edit                           is_whitelist: false is_compliant: true
**clusterrole_name: system:aggregate-to-view                           is_whitelist: false is_compliant: true
**clusterrole_name: system:aggregated-metrics-reader                   is_whitelist: false is_compliant: true
**clusterrole_name: system:auth-delegator                              is_whitelist: false is_compliant: true
**clusterrole_name: system:basic-user                                  is_whitelist: false is_compliant: true
**clusterrole_name: system:certificates.k8s.io:certificatesigningrequests:nodeclient is_whitelist: false is_compliant: true
**clusterrole_name: system:certificates.k8s.io:certificatesigningrequests:selfnodeclient is_whitelist: false is_compliant: true
**clusterrole_name: system:certificates.k8s.io:kube-apiserver-client-approver is_whitelist: false is_compliant: true
**clusterrole_name: system:certificates.k8s.io:kube-apiserver-client-kubelet-approver is_whitelist: false is_compliant: true
**clusterrole_name: system:certificates.k8s.io:kubelet-serving-approver is_whitelist: false is_compliant: true
**clusterrole_name: system:certificates.k8s.io:legacy-unknown-approver is_whitelist: false is_compliant: true
**clusterrole_name: system:controller:attachdetach-controller          is_whitelist: false is_compliant: true
**clusterrole_name: system:controller:certificate-controller           is_whitelist: false is_compliant: true
**clusterrole_name: system:controller:clusterrole-aggregation-controller is_whitelist: false is_compliant: true
**clusterrole_name: system:controller:cronjob-controller               is_whitelist: false is_compliant: true
**clusterrole_name: system:controller:daemon-set-controller            is_whitelist: false is_compliant: true
**clusterrole_name: system:controller:deployment-controller            is_whitelist: false is_compliant: true
**clusterrole_name: system:controller:disruption-controller            is_whitelist: true  is_compliant: true
**clusterrole_name: system:controller:endpoint-controller              is_whitelist: false is_compliant: true
**clusterrole_name: system:controller:endpointslice-controller         is_whitelist: false is_compliant: true
**clusterrole_name: system:controller:endpointslicemirroring-controller is_whitelist: false is_compliant: true
**clusterrole_name: system:controller:ephemeral-volume-controller      is_whitelist: false is_compliant: true
**clusterrole_name: system:controller:expand-controller                is_whitelist: false is_compliant: true
**clusterrole_name: system:controller:generic-garbage-collector        is_whitelist: true  is_compliant: true
**clusterrole_name: system:controller:horizontal-pod-autoscaler        is_whitelist: true  is_compliant: true
**clusterrole_name: system:controller:job-controller                   is_whitelist: false is_compliant: true
**clusterrole_name: system:controller:namespace-controller             is_whitelist: true  is_compliant: true
**clusterrole_name: system:controller:node-controller                  is_whitelist: false is_compliant: true
**clusterrole_name: system:controller:persistent-volume-binder         is_whitelist: false is_compliant: true
**clusterrole_name: system:controller:pod-garbage-collector            is_whitelist: false is_compliant: true
**clusterrole_name: system:controller:pv-protection-controller         is_whitelist: false is_compliant: true
**clusterrole_name: system:controller:pvc-protection-controller        is_whitelist: false is_compliant: true
**clusterrole_name: system:controller:replicaset-controller            is_whitelist: false is_compliant: true
**clusterrole_name: system:controller:replication-controller           is_whitelist: false is_compliant: true
**clusterrole_name: system:controller:resourcequota-controller         is_whitelist: true  is_compliant: true
**clusterrole_name: system:controller:root-ca-cert-publisher           is_whitelist: false is_compliant: true
**clusterrole_name: system:controller:route-controller                 is_whitelist: false is_compliant: true
**clusterrole_name: system:controller:service-account-controller       is_whitelist: false is_compliant: true
**clusterrole_name: system:controller:service-controller               is_whitelist: false is_compliant: true
**clusterrole_name: system:controller:statefulset-controller           is_whitelist: false is_compliant: true
**clusterrole_name: system:controller:ttl-after-finished-controller    is_whitelist: false is_compliant: true
**clusterrole_name: system:controller:ttl-controller                   is_whitelist: false is_compliant: true
**clusterrole_name: system:coredns                                     is_whitelist: false is_compliant: true
**clusterrole_name: system:discovery                                   is_whitelist: false is_compliant: true
**clusterrole_name: system:heapster                                    is_whitelist: false is_compliant: true
**clusterrole_name: system:k3s-controller                              is_whitelist: false is_compliant: true
**clusterrole_name: system:kube-aggregator                             is_whitelist: false is_compliant: true
**clusterrole_name: system:kube-controller-manager                     is_whitelist: true  is_compliant: true
**clusterrole_name: system:kube-dns                                    is_whitelist: false is_compliant: true
**clusterrole_name: system:kube-scheduler                              is_whitelist: false is_compliant: true
**clusterrole_name: system:kubelet-api-admin                           is_whitelist: true  is_compliant: true
**clusterrole_name: system:metrics-server                              is_whitelist: false is_compliant: true
**clusterrole_name: system:monitoring                                  is_whitelist: false is_compliant: true
**clusterrole_name: system:node                                        is_whitelist: false is_compliant: true
**clusterrole_name: system:node-bootstrapper                           is_whitelist: false is_compliant: true
**clusterrole_name: system:node-problem-detector                       is_whitelist: false is_compliant: true
**clusterrole_name: system:node-proxier                                is_whitelist: false is_compliant: true
**clusterrole_name: system:persistent-volume-provisioner               is_whitelist: false is_compliant: true
**clusterrole_name: system:public-info-viewer                          is_whitelist: false is_compliant: true
**clusterrole_name: system:service-account-issuer-discovery            is_whitelist: false is_compliant: true
**clusterrole_name: system:volume-scheduler                            is_whitelist: false is_compliant: true
**clusterrole_name: traefik-kube-system                                is_whitelist: false is_compliant: true
**clusterrole_name: view                                               is_whitelist: false is_compliant: true
```
</details>

<details>
<summary><b>Remediation:</b></summary>

Where possible replace any use of wildcards in clusterroles and roles with specific objects or actions.
K3s gives exceptions for following cluster roles, which are required for regular operations:
- k3s-cloud-controller-manager, local-path-provisioner-role, cluster-admin
- system:kube-controller-manager, system:kubelet-api-admin, system:controller:namespace-controller,
- system:controller:disruption-controller, system:controller:generic-garbage-collector,
- system:controller:horizontal-pod-autoscaler, system:controller:resourcequota-controller
</details>

### 5.1.4 Minimize access to create pods (Automated)

**Result:** WARN

**Remediation:**
Where possible, remove create access to pod objects in the cluster.

### 5.1.5 Ensure that default service accounts are not actively used. (Automated)

**Result:** PASS

**Audit:**
```bash
kubectl get serviceaccounts --all-namespaces --field-selector metadata.name=default \
-o custom-columns=N:.metadata.namespace,SA:.metadata.name,ASA:.automountServiceAccountToken --no-headers \
| while read -r namespace serviceaccount automountserviceaccounttoken
do
  if [ "${automountserviceaccounttoken}" = "<none>" ]; then
    automountserviceaccounttoken="notset"
  fi
  if [ "${namespace}" != "kube-system" ] && [ "${automountserviceaccounttoken}" != "false" ]; then
    printf "**namespace: %-20s service_account: %-10s automountServiceAccountToken: %-6s is_compliant: false\n" "${namespace}" "${serviceaccount}" "${automountserviceaccounttoken}"
  else
    printf "**namespace: %-20s service_account: %-10s automountServiceAccountToken: %-6s is_compliant: true\n" "${namespace}" "${serviceaccount}" "${automountserviceaccounttoken}"
  fi
done
```

**Expected Result:** 'is_compliant' is equal to 'true'

<details>
<summary><b>Returned Value:</b></summary>

```log
**namespace: default              service_account: default    automountServiceAccountToken: false  is_compliant: true
**namespace: kube-node-lease      service_account: default    automountServiceAccountToken: false  is_compliant: true
**namespace: kube-public          service_account: default    automountServiceAccountToken: false  is_compliant: true
**namespace: kube-system          service_account: default    automountServiceAccountToken: notset is_compliant: true
```
</details>

<details>
<summary><b>Remediation:</b></summary>

Create explicit service accounts wherever a Kubernetes workload requires specific access
to the Kubernetes API server.
K3s makes an exception for the default service account in the kube-system namespace.
Modify the configuration of each default service account to include this value
automountServiceAccountToken: false
Or using kubectl:
```bash
kubectl patch serviceaccount --namespace <NAMESPACE> default --patch '{"automountServiceAccountToken": false}'
```
</details>

### 5.1.6 Ensure that Service Account Tokens are only mounted where necessary (Automated)

**Result:** PASS

**Audit:**
```bash
kubectl get pods --all-namespaces -o custom-columns=POD_NAMESPACE:.metadata.namespace,POD_NAME:.metadata.name,POD_SERVICE_ACCOUNT:.spec.serviceAccount,POD_IS_AUTOMOUNTSERVICEACCOUNTTOKEN:.spec.automountServiceAccountToken --no-headers | while read -r pod_namespace pod_name pod_service_account pod_is_automountserviceaccounttoken
do
  # Retrieve automountServiceAccountToken's value for ServiceAccount and Pod, set to notset if null or <none>.
  svacc_is_automountserviceaccounttoken=$(kubectl get serviceaccount -n "${pod_namespace}" "${pod_service_account}" -o json | jq -r '.automountServiceAccountToken' | sed -e 's/<none>/notset/g' -e 's/null/notset/g')
  pod_is_automountserviceaccounttoken=$(echo "${pod_is_automountserviceaccounttoken}" | sed -e 's/<none>/notset/g' -e 's/null/notset/g')
  if [ "${svacc_is_automountserviceaccounttoken}" = "false" ] && ( [ "${pod_is_automountserviceaccounttoken}" = "false" ] || [ "${pod_is_automountserviceaccounttoken}" = "notset" ] ); then
    is_compliant="true"
  elif [ "${svacc_is_automountserviceaccounttoken}" = "true" ] && [ "${pod_is_automountserviceaccounttoken}" = "false" ]; then
    is_compliant="true"
  else
    is_compliant="false"
  fi
  echo "**namespace: ${pod_namespace} pod_name: ${pod_name} service_account: ${pod_service_account} pod_is_automountserviceaccounttoken: ${pod_is_automountserviceaccounttoken} svacc_is_automountServiceAccountToken: ${svacc_is_automountserviceaccounttoken} is_compliant: ${is_compliant}"
done
```

**Expected Result:** 'is_compliant' is equal to 'true' OR 'service_account' contains valid elements from 'coredns, helm-traefik, helm-traefik-crd, traefik, metrics-server, svclb, local-path-provisioner-service-account'

<details>
<summary><b>Returned Value:</b></summary>

```log
**namespace: kube-system pod_name: coredns-559656f558-b89kj service_account: coredns pod_is_automountserviceaccounttoken: notset svacc_is_automountServiceAccountToken: notset is_compliant: false
**namespace: kube-system pod_name: helm-install-traefik-crd-7fvrx service_account: helm-traefik-crd pod_is_automountserviceaccounttoken: notset svacc_is_automountServiceAccountToken: true is_compliant: false
**namespace: kube-system pod_name: helm-install-traefik-rttbs service_account: helm-traefik pod_is_automountserviceaccounttoken: notset svacc_is_automountServiceAccountToken: true is_compliant: false
**namespace: kube-system pod_name: local-path-provisioner-7677785564-6kh8q service_account: local-path-provisioner-service-account pod_is_automountserviceaccounttoken: notset svacc_is_automountServiceAccountToken: notset is_compliant: false
**namespace: kube-system pod_name: metrics-server-7cbbc464f4-q8xn9 service_account: metrics-server pod_is_automountserviceaccounttoken: notset svacc_is_automountServiceAccountToken: notset is_compliant: false
**namespace: kube-system pod_name: svclb-traefik-19f40894-dr4mq service_account: svclb pod_is_automountserviceaccounttoken: false svacc_is_automountServiceAccountToken: notset is_compliant: false
**namespace: kube-system pod_name: traefik-6c7b69cd74-v86cg service_account: traefik pod_is_automountserviceaccounttoken: notset svacc_is_automountServiceAccountToken: notset is_compliant: false
```
</details>

<details>
<summary><b>Remediation:</b></summary>

Modify the definition of ServiceAccounts and Pods which do not need to mount service
account tokens to disable it, with `automountServiceAccountToken: false`.
If both the ServiceAccount and the Pod's .spec specify a value for automountServiceAccountToken, the Pod spec takes precedence.
Condition: Pod is_compliant to true when
  - ServiceAccount is automountServiceAccountToken: false and Pod is automountServiceAccountToken: false or notset
  - ServiceAccount is automountServiceAccountToken: true notset and Pod is automountServiceAccountToken: false
K3s gives exceptions to the following service-accounts, which are required for regular operations:
  - coredns, helm-traefik, helm-traefik-crd, traefik, metrics-server, svclb, local-path-provisioner-service-account
</details>

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
Where possible, remove access to the approval sub-resource of certificatesigningrequests objects.

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

**Result:** PASS

**Audit:**
```bash
kubectl get pods --all-namespaces -o custom-columns=POD_NAME:.metadata.name,POD_NAMESPACE:.metadata.namespace --no-headers | while read -r pod_name pod_namespace
do
  # Retrieve container(s) for each Pod.
  kubectl get pod "${pod_name}" --namespace "${pod_namespace}" -o json | jq -c '.spec.containers[]' | while read -r container
  do
    # Retrieve container's name.
    container_name=$(echo ${container} | jq -r '.name')
    # Retrieve container's .securityContext.privileged value.
    container_privileged=$(echo ${container} | jq -r '.securityContext.privileged' | sed -e 's/null/notset/g')
    if [ "${container_privileged}" = "false" ] || [ "${container_privileged}" = "notset" ] ; then
      echo "***pod_name: ${pod_name} container_name: ${container_name} pod_namespace: ${pod_namespace} is_container_privileged: ${container_privileged} is_compliant: true"
    else
      echo "***pod_name: ${pod_name} container_name: ${container_name} pod_namespace: ${pod_namespace} is_container_privileged: ${container_privileged} is_compliant: false"
    fi
  done
done
```

**Expected Result:** 'is_compliant' is equal to 'true'

<details>
<summary><b>Returned Value:</b></summary>

```log
***pod_name: coredns-559656f558-b89kj container_name: coredns pod_namespace: kube-system is_container_privileged: notset is_compliant: true
***pod_name: helm-install-traefik-crd-7fvrx container_name: helm pod_namespace: kube-system is_container_privileged: notset is_compliant: true
***pod_name: helm-install-traefik-rttbs container_name: helm pod_namespace: kube-system is_container_privileged: notset is_compliant: true
***pod_name: local-path-provisioner-7677785564-6kh8q container_name: local-path-provisioner pod_namespace: kube-system is_container_privileged: notset is_compliant: true
***pod_name: metrics-server-7cbbc464f4-q8xn9 container_name: metrics-server pod_namespace: kube-system is_container_privileged: notset is_compliant: true
***pod_name: svclb-traefik-19f40894-dr4mq container_name: lb-tcp-80 pod_namespace: kube-system is_container_privileged: notset is_compliant: true
***pod_name: svclb-traefik-19f40894-dr4mq container_name: lb-tcp-443 pod_namespace: kube-system is_container_privileged: notset is_compliant: true
***pod_name: traefik-6c7b69cd74-v86cg container_name: traefik pod_namespace: kube-system is_container_privileged: notset is_compliant: true
```
</details>

<details>
<summary><b>Remediation:</b></summary>

Add policies to each namespace in the cluster which has user workloads to restrict the
admission of privileged containers.
Audit: the audit list all pods' containers to retrieve their .securityContext.privileged value.
Condition: is_compliant is false if container's `.securityContext.privileged` is set to `true`.
Default: by default, there are no restrictions on the creation of privileged containers.
</details>

### 5.2.3 Minimize the admission of containers wishing to share the host process ID namespace (Manual)

**Result:** PASS

**Audit:**
```bash
kubectl get pods --all-namespaces -o custom-columns=POD_NAME:.metadata.name,POD_NAMESPACE:.metadata.namespace --no-headers | while read -r pod_name pod_namespace
do
  # Retrieve spec.hostPID for each pod.
  pod_hostpid=$(kubectl get pod "${pod_name}" --namespace "${pod_namespace}" -o jsonpath='{.spec.hostPID}' 2>/dev/null)
  if [ -z "${pod_hostpid}" ]; then
    pod_hostpid="false"
    echo "***pod_name: ${pod_name} pod_namespace: ${pod_namespace} is_pod_hostpid: ${pod_hostpid} is_compliant: true"
  else
    echo "***pod_name: ${pod_name} pod_namespace: ${pod_namespace} is_pod_hostpid: ${pod_hostpid} is_compliant: false"
  fi
done
```

**Expected Result:** 'is_compliant' is equal to 'true'

<details>
<summary><b>Returned Value:</b></summary>

```log
***pod_name: coredns-559656f558-b89kj pod_namespace: kube-system is_pod_hostpid: false is_compliant: true
***pod_name: helm-install-traefik-crd-7fvrx pod_namespace: kube-system is_pod_hostpid: false is_compliant: true
***pod_name: helm-install-traefik-rttbs pod_namespace: kube-system is_pod_hostpid: false is_compliant: true
***pod_name: local-path-provisioner-7677785564-6kh8q pod_namespace: kube-system is_pod_hostpid: false is_compliant: true
***pod_name: metrics-server-7cbbc464f4-q8xn9 pod_namespace: kube-system is_pod_hostpid: false is_compliant: true
***pod_name: svclb-traefik-19f40894-dr4mq pod_namespace: kube-system is_pod_hostpid: false is_compliant: true
***pod_name: traefik-6c7b69cd74-v86cg pod_namespace: kube-system is_pod_hostpid: false is_compliant: true
```
</details>

<details>
<summary><b>Remediation:</b></summary>

Add policies to each namespace in the cluster which has user workloads to restrict the
admission of `hostPID` containers.
Audit: the audit retrieves each Pod' spec.hostPID.
Condition: is_compliant is false if Pod's spec.hostPID is set to `true`.
Default: by default, there are no restrictions on the creation of hostPID containers.
</details>

### 5.2.4 Minimize the admission of containers wishing to share the host IPC namespace (Manual)

**Result:** PASS

**Audit:**
```bash
kubectl get pods --all-namespaces -o custom-columns=POD_NAME:.metadata.name,POD_NAMESPACE:.metadata.namespace --no-headers | while read -r pod_name pod_namespace
do
  # Retrieve spec.hostIPC for each pod.
  pod_hostipc=$(kubectl get pod "${pod_name}" --namespace "${pod_namespace}" -o jsonpath='{.spec.hostIPC}' 2>/dev/null)
  if [ -z "${pod_hostipc}" ]; then
    pod_hostipc="false"
    echo "***pod_name: ${pod_name} pod_namespace: ${pod_namespace} is_pod_hostipc: ${pod_hostipc} is_compliant: true"
  else
    echo "***pod_name: ${pod_name} pod_namespace: ${pod_namespace} is_pod_hostipc: ${pod_hostipc} is_compliant: false"
  fi
done
```

**Expected Result:** 'is_compliant' is equal to 'true'

<details>
<summary><b>Returned Value:</b></summary>

```log
***pod_name: coredns-559656f558-b89kj pod_namespace: kube-system is_pod_hostipc: false is_compliant: true
***pod_name: helm-install-traefik-crd-7fvrx pod_namespace: kube-system is_pod_hostipc: false is_compliant: true
***pod_name: helm-install-traefik-rttbs pod_namespace: kube-system is_pod_hostipc: false is_compliant: true
***pod_name: local-path-provisioner-7677785564-6kh8q pod_namespace: kube-system is_pod_hostipc: false is_compliant: true
***pod_name: metrics-server-7cbbc464f4-q8xn9 pod_namespace: kube-system is_pod_hostipc: false is_compliant: true
***pod_name: svclb-traefik-19f40894-dr4mq pod_namespace: kube-system is_pod_hostipc: false is_compliant: true
***pod_name: traefik-6c7b69cd74-v86cg pod_namespace: kube-system is_pod_hostipc: false is_compliant: true
```
</details>

<details>
<summary><b>Remediation:</b></summary>

Add policies to each namespace in the cluster which has user workloads to restrict the
admission of `hostIPC` containers.
Audit: the audit retrieves each Pod' spec.IPC.
Condition: is_compliant is false if Pod's spec.hostIPC is set to `true`.
Default: by default, there are no restrictions on the creation of hostIPC containers.
</details>

### 5.2.5 Minimize the admission of containers wishing to share the host network namespace (Manual)

**Result:** PASS

**Audit:**
```bash
kubectl get pods --all-namespaces -o custom-columns=POD_NAME:.metadata.name,POD_NAMESPACE:.metadata.namespace --no-headers | while read -r pod_name pod_namespace
do
  # Retrieve spec.hostNetwork for each pod.
  pod_hostnetwork=$(kubectl get pod "${pod_name}" --namespace "${pod_namespace}" -o jsonpath='{.spec.hostNetwork}' 2>/dev/null)
  if [ -z "${pod_hostnetwork}" ]; then
    pod_hostnetwork="false"
    echo "***pod_name: ${pod_name} pod_namespace: ${pod_namespace} is_pod_hostnetwork: ${pod_hostnetwork} is_compliant: true"
  else
    echo "***pod_name: ${pod_name} pod_namespace: ${pod_namespace} is_pod_hostnetwork: ${pod_hostnetwork} is_compliant: false"
  fi
done
```

**Expected Result:** 'is_compliant' is equal to 'true'

<details>
<summary><b>Returned Value:</b></summary>

```log
***pod_name: coredns-559656f558-b89kj pod_namespace: kube-system is_pod_hostnetwork: false is_compliant: true
***pod_name: helm-install-traefik-crd-7fvrx pod_namespace: kube-system is_pod_hostnetwork: false is_compliant: true
***pod_name: helm-install-traefik-rttbs pod_namespace: kube-system is_pod_hostnetwork: false is_compliant: true
***pod_name: local-path-provisioner-7677785564-6kh8q pod_namespace: kube-system is_pod_hostnetwork: false is_compliant: true
***pod_name: metrics-server-7cbbc464f4-q8xn9 pod_namespace: kube-system is_pod_hostnetwork: false is_compliant: true
***pod_name: svclb-traefik-19f40894-dr4mq pod_namespace: kube-system is_pod_hostnetwork: false is_compliant: true
***pod_name: traefik-6c7b69cd74-v86cg pod_namespace: kube-system is_pod_hostnetwork: false is_compliant: true
```
</details>

<details>
<summary><b>Remediation:</b></summary>

Add policies to each namespace in the cluster which has user workloads to restrict the
admission of `hostNetwork` containers.
Audit: the audit retrieves each Pod' spec.hostNetwork.
Condition: is_compliant is false if Pod's spec.hostNetwork is set to `true`.
Default: by default, there are no restrictions on the creation of hostNetwork containers.
</details>

### 5.2.6 Minimize the admission of containers with allowPrivilegeEscalation (Manual)

**Result:** PASS

**Audit:**
```bash
kubectl get pods --all-namespaces -o custom-columns=POD_NAME:.metadata.name,POD_NAMESPACE:.metadata.namespace --no-headers | while read -r pod_name pod_namespace
do
  # Retrieve container(s) for each Pod.
  kubectl get pod "${pod_name}" --namespace "${pod_namespace}" -o json | jq -c '.spec.containers[]' | while read -r container
  do
    # Retrieve container's name
    container_name=$(echo ${container} | jq -r '.name')
    # Retrieve container's .securityContext.allowPrivilegeEscalation
    container_allowprivesc=$(echo ${container} | jq -r '.securityContext.allowPrivilegeEscalation' | sed -e 's/null/notset/g')
    if [ "${container_allowprivesc}" = "false" ] || [ "${container_allowprivesc}" = "notset" ]; then
      echo "***pod_name: ${pod_name} container_name: ${container_name} pod_namespace: ${pod_namespace} is_container_allowprivesc: ${container_allowprivesc} is_compliant: true"
    else
      echo "***pod_name: ${pod_name} container_name: ${container_name} pod_namespace: ${pod_namespace} is_container_allowprivesc: ${container_allowprivesc} is_compliant: false"
    fi
  done
done
```

**Expected Result:** 'is_compliant' is equal to 'true'

<details>
<summary><b>Returned Value:</b></summary>

```log
***pod_name: coredns-559656f558-b89kj container_name: coredns pod_namespace: kube-system is_container_allowprivesc: false is_compliant: true
***pod_name: helm-install-traefik-crd-7fvrx container_name: helm pod_namespace: kube-system is_container_allowprivesc: false is_compliant: true
***pod_name: helm-install-traefik-rttbs container_name: helm pod_namespace: kube-system is_container_allowprivesc: false is_compliant: true
***pod_name: local-path-provisioner-7677785564-6kh8q container_name: local-path-provisioner pod_namespace: kube-system is_container_allowprivesc: notset is_compliant: true
***pod_name: metrics-server-7cbbc464f4-q8xn9 container_name: metrics-server pod_namespace: kube-system is_container_allowprivesc: false is_compliant: true
***pod_name: svclb-traefik-19f40894-dr4mq container_name: lb-tcp-80 pod_namespace: kube-system is_container_allowprivesc: notset is_compliant: true
***pod_name: svclb-traefik-19f40894-dr4mq container_name: lb-tcp-443 pod_namespace: kube-system is_container_allowprivesc: notset is_compliant: true
***pod_name: traefik-6c7b69cd74-v86cg container_name: traefik pod_namespace: kube-system is_container_allowprivesc: false is_compliant: true
```
</details>

<details>
<summary><b>Remediation:</b></summary>

Add policies to each namespace in the cluster which has user workloads to restrict the
admission of containers with `.securityContext.allowPrivilegeEscalation` set to `true`.
Audit: the audit retrieves each Pod's container(s) `.securityContext.allowPrivilegeEscalation`.
Condition: is_compliant is false if container's `.securityContext.allowPrivilegeEscalation` is set to `true`.
Default: If notset, privilege escalation is allowed (default to true). However if PSP/PSA is used with a `restricted` profile,
privilege escalation is explicitly disallowed unless configured otherwise.
</details>

### 5.2.7 Minimize the admission of root containers (Manual)

**Result:** WARN

**Remediation:**
Create a policy for each namespace in the cluster, ensuring that either `MustRunAsNonRoot`
or `MustRunAs` with the range of UIDs not including 0, is set.

### 5.2.8 Minimize the admission of containers with the NET_RAW capability (Manual)

**Result:** WARN

**Remediation:**
Add policies to each namespace in the cluster which has user workloads to restrict the
admission of containers with the `NET_RAW` capability.

### 5.2.9 Minimize the admission of containers with added capabilities (Manual)

**Result:** PASS

**Audit:**
```bash
kubectl get pods --all-namespaces -o custom-columns=POD_NAME:.metadata.name,POD_NAMESPACE:.metadata.namespace --no-headers | while read -r pod_name pod_namespace
do
  # Retrieve container(s) for each Pod.
  kubectl get pod "${pod_name}" --namespace "${pod_namespace}" -o json | jq -c '.spec.containers[]' | while read -r container
  do
    # Retrieve container's name
    container_name=$(echo ${container} | jq -r '.name')
    # Retrieve container's added capabilities
    container_caps_add=$(echo ${container} | jq -r '.securityContext.capabilities.add' | sed -e 's/null/notset/g')
    # Set is_compliant to true by default.
    is_compliant=true
    is_whitelist=false
    caps_list=""

    # Check if pod is in whitelist
    if echo "${pod_name}" | grep -q -E "^(coredns|svclb-traefik)"; then
      is_whitelist=true
      is_compliant=true
    elif [ "${container_caps_add}" != "notset" ]; then
      # Loop through all caps and append caps_list, then set is_compliant to false.
      for cap in $(echo "${container_caps_add}" | jq -r '.[]'); do
        caps_list="${caps_list}${cap},"
        is_compliant=false
      done
      # Remove trailing comma for the last list member.
      caps_list=${caps_list%,}
    fi
    # Remove newlines from final output.
    continaer_caps_add=$(echo "${container_caps_add}" | tr -d '\n')
    if [ "${is_whitelist}" = true ]; then
      printf "***pod_name: %-30s container_name: %-30s pod_namespace: %-20s is_whitelist: %-5s is_compliant: true\n" "${pod_name}" "${container_name}" "${pod_namespace}" "${is_whitelist}"
    elif [ "${is_compliant}" = true ]; then
      printf "***pod_name: %-30s container_name: %-30s pod_namespace: %-20s container_caps_add: %-15s is_compliant: true\n" "${pod_name}" "${container_name}" "${pod_namespace}" "${container_caps_add}"
    else
      printf "***pod_name: %-30s container_name: %-30s pod_namespace: %-20s container_caps_add: %-15s is_compliant: false\n" "${pod_name}" "${container_name}" "${pod_namespace}" "${caps_list}"
    fi
  done
done
```

**Expected Result:** 'is_compliant' is equal to 'true'

<details>
<summary><b>Returned Value:</b></summary>

```log
***pod_name: coredns-559656f558-b89kj       container_name: coredns                        pod_namespace: kube-system          is_whitelist: true  is_compliant: true
***pod_name: helm-install-traefik-crd-7fvrx container_name: helm                           pod_namespace: kube-system          container_caps_add: notset          is_compliant: true
***pod_name: helm-install-traefik-rttbs     container_name: helm                           pod_namespace: kube-system          container_caps_add: notset          is_compliant: true
***pod_name: local-path-provisioner-7677785564-6kh8q container_name: local-path-provisioner         pod_namespace: kube-system          container_caps_add: notset          is_compliant: true
***pod_name: metrics-server-7cbbc464f4-q8xn9 container_name: metrics-server                 pod_namespace: kube-system          container_caps_add: notset          is_compliant: true
***pod_name: svclb-traefik-19f40894-dr4mq   container_name: lb-tcp-80                      pod_namespace: kube-system          is_whitelist: true  is_compliant: true
***pod_name: svclb-traefik-19f40894-dr4mq   container_name: lb-tcp-443                     pod_namespace: kube-system          is_whitelist: true  is_compliant: true
***pod_name: traefik-6c7b69cd74-v86cg       container_name: traefik                        pod_namespace: kube-system          container_caps_add: notset          is_compliant: true
```
</details>

<details>
<summary><b>Remediation:</b></summary>

Ensure that `allowedCapabilities` is not present in policies for the cluster unless
it is set to an empty array.
Audit: the audit retrieves each Pod's container(s) added capabilities.
Condition: is_compliant is false if added capabilities are added for a given container.
Default: Containers run with a default set of capabilities as assigned by the Container Runtime.
K3s gives exceptions to the following pods, which are required for regular operations:
  - coredns, svclb-traefik
</details>

### 5.2.10 Minimize the admission of containers with capabilities assigned (Manual)

**Result:** WARN

**Remediation:**
Review the use of capabilities in applications running on your cluster. Where a namespace
contains applications which do not require any Linux capabities to operate consider adding
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

