---
title: CIS Hardening Guide
---

This document provides prescriptive guidance for hardening a production installation of K3s. It outlines the configurations and controls required to address Kubernetes benchmark controls from the Center for Internet Security (CIS).

K3s has a number of security mitigations applied and turned on by default and will pass a number of the Kubernetes CIS controls without modification. There are some notable exceptions to this that require manual intervention to fully comply with the CIS Benchmark:

1. K3s will not modify the host operating system. Any host-level modifications will need to be done manually.
2. Certain CIS policy controls for `NetworkPolicies` and `PodSecurityStandards` (`PodSecurityPolicies` on v1.24 and older) will restrict the functionality of the cluster. You must opt into having K3s configure these by adding the appropriate options (enabling of admission plugins) to your command-line flags or configuration file as well as manually applying appropriate policies. Further details are presented in the sections below.

The first section (1.1) of the CIS Benchmark concerns itself primarily with pod manifest permissions and ownership. K3s doesn't utilize these for the core components since everything is packaged into a single binary.

## Host-level Requirements

There are two areas of host-level requirements: kernel parameters and etcd process/directory configuration. These are outlined in this section.

### Ensure `protect-kernel-defaults` is set

This is a kubelet flag that will cause the kubelet to exit if the required kernel parameters are unset or are set to values that are different from the kubelet's defaults.

> **Note:** `protect-kernel-defaults` is exposed as a top-level flag for K3s.

#### Set kernel parameters

Create a file called `/etc/sysctl.d/90-kubelet.conf` and add the snippet below. Then run `sysctl -p /etc/sysctl.d/90-kubelet.conf`.

```bash
vm.panic_on_oom=0
vm.overcommit_memory=1
kernel.panic=10
kernel.panic_on_oops=1
```

## Kubernetes Runtime Requirements

The runtime requirements to comply with the CIS Benchmark are centered around pod security (via PSP or PSA), network policies and API Server auditing logs. These are outlined in this section.

By default, K3s does not include any pod security or network policies. However, K3s ships with a controller that will enforce network policies, if any are created. K3s doesn't enable auditing by default, so audit log configuration and audit policy must be created manually. By default, K3s runs with the both the `PodSecurity` and `NodeRestriction` admission controllers enabled, among others.

### Pod Security

<Tabs groupId="pod-sec" queryString>
<TabItem value="v1.25 and Newer" default>

K3s v1.25 and newer support [Pod Security Admissions (PSAs)](https://kubernetes.io/docs/concepts/security/pod-security-admission/) for controlling pod security. PSAs are enabled by passing the following flag to the K3s server:
```
--kube-apiserver-arg="admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml"
```

The policy should be written to a file named `psa.yaml` in `/var/lib/rancher/k3s/server` directory. 

Here is an example of a compliant PSA:
```yaml
apiVersion: apiserver.config.k8s.io/v1
kind: AdmissionConfiguration
plugins:
- name: PodSecurity
  configuration:
    apiVersion: pod-security.admission.config.k8s.io/v1beta1
    kind: PodSecurityConfiguration
    defaults:
      enforce: "restricted"
      enforce-version: "latest"
      audit: "restricted"
      audit-version: "latest"
      warn: "restricted"
      warn-version: "latest"
    exemptions:
      usernames: []
      runtimeClasses: []
      namespaces: [kube-system, cis-operator-system]
```
</TabItem>
<TabItem value="v1.24 and Older" default>

K3s v1.24 and older support [Pod Security Policies (PSPs)](https://kubernetes.io/docs/concepts/security/pod-security-policy/) for controlling pod security. PSPs are enabled by passing the following flag to the K3s server:

```
--kube-apiserver-arg="enable-admission-plugins=NodeRestriction,PodSecurityPolicy"
```
This will have the effect of maintaining the `NodeRestriction` plugin as well as enabling the `PodSecurityPolicy`. 

When PSPs are enabled, a policy can be applied to satisfy the necessary controls described in section 5.2 of the CIS Benchmark.

Here is an example of a compliant PSP:

```yaml
apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  name: restricted-psp
spec:
  privileged: false                # CIS - 5.2.1
  allowPrivilegeEscalation: false  # CIS - 5.2.5
  requiredDropCapabilities:        # CIS - 5.2.7/8/9
    - ALL
  volumes:
    - 'configMap'
    - 'emptyDir'
    - 'projected'
    - 'secret'
    - 'downwardAPI'
    - 'csi'
    - 'persistentVolumeClaim'
    - 'ephemeral'
  hostNetwork: false               # CIS - 5.2.4
  hostIPC: false                   # CIS - 5.2.3
  hostPID: false                   # CIS - 5.2.2
  runAsUser:
    rule: 'MustRunAsNonRoot'       # CIS - 5.2.6
  seLinux:
    rule: 'RunAsAny'
  supplementalGroups:
    rule: 'MustRunAs'
    ranges:
      - min: 1
        max: 65535
  fsGroup:
    rule: 'MustRunAs'
    ranges:
      - min: 1
        max: 65535
  readOnlyRootFilesystem: false
```

For the above PSP to be effective, we need to create a ClusterRole and a ClusterRoleBinding. We also need to include a "system unrestricted policy" which is needed for system-level pods that require additional privileges, and an additional policy that allows sysctls necessary for servicelb to function properly.

Combining the configuration above with the [Network Policy](#networkpolicies) described in the next section, a single file can be placed in the `/var/lib/rancher/k3s/server/manifests` directory. Here is an example of a `policy.yaml` file: 

```yaml
apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  name: restricted-psp
spec:
  privileged: false
  allowPrivilegeEscalation: false
  requiredDropCapabilities:
    - ALL
  volumes:
    - 'configMap'
    - 'emptyDir'
    - 'projected'
    - 'secret'
    - 'downwardAPI'
    - 'csi'
    - 'persistentVolumeClaim'
    - 'ephemeral'
  hostNetwork: false
  hostIPC: false
  hostPID: false
  runAsUser:
    rule: 'MustRunAsNonRoot'
  seLinux:
    rule: 'RunAsAny'
  supplementalGroups:
    rule: 'MustRunAs'
    ranges:
      - min: 1
        max: 65535
  fsGroup:
    rule: 'MustRunAs'
    ranges:
      - min: 1
        max: 65535
  readOnlyRootFilesystem: false
---
apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  name: system-unrestricted-psp
  annotations:
    seccomp.security.alpha.kubernetes.io/allowedProfileNames: '*'
spec:
  allowPrivilegeEscalation: true
  allowedCapabilities:
  - '*'
  fsGroup:
    rule: RunAsAny
  hostIPC: true
  hostNetwork: true
  hostPID: true
  hostPorts:
  - max: 65535
    min: 0
  privileged: true
  runAsUser:
    rule: RunAsAny
  seLinux:
    rule: RunAsAny
  supplementalGroups:
    rule: RunAsAny
  volumes:
  - '*'
---
apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  name: svclb-psp
  annotations:
    seccomp.security.alpha.kubernetes.io/allowedProfileNames: '*'
spec:
  allowPrivilegeEscalation: false
  allowedCapabilities:
  - NET_ADMIN
  allowedUnsafeSysctls:
  - net.ipv4.ip_forward
  - net.ipv6.conf.all.forwarding
  fsGroup:
    rule: RunAsAny
  hostPorts:
  - max: 65535
    min: 0
  runAsUser:
    rule: RunAsAny
  seLinux:
    rule: RunAsAny
  supplementalGroups:
    rule: RunAsAny
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: psp:restricted-psp
rules:
- apiGroups:
  - policy
  resources:
  - podsecuritypolicies
  verbs:
  - use
  resourceNames:
  - restricted-psp
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: psp:system-unrestricted-psp
rules:
- apiGroups:
  - policy
  resources:
  - podsecuritypolicies
  resourceNames:
  - system-unrestricted-psp
  verbs:
  - use
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: psp:svclb-psp
rules:
- apiGroups:
  - policy
  resources:
  - podsecuritypolicies
  resourceNames:
  - svclb-psp
  verbs:
  - use
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: default:restricted-psp
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: psp:restricted-psp
subjects:
- kind: Group
  name: system:authenticated
  apiGroup: rbac.authorization.k8s.io
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: system-unrestricted-node-psp-rolebinding
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: psp:system-unrestricted-psp
subjects:
- apiGroup: rbac.authorization.k8s.io
  kind: Group
  name: system:nodes
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: system-unrestricted-svc-acct-psp-rolebinding
  namespace: kube-system
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: psp:system-unrestricted-psp
subjects:
- apiGroup: rbac.authorization.k8s.io
  kind: Group
  name: system:serviceaccounts
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: svclb-psp-rolebinding
  namespace: kube-system
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: psp:svclb-psp
subjects:
- kind: ServiceAccount
  name: svclb
---
kind: NetworkPolicy
apiVersion: networking.k8s.io/v1
metadata:
  name: intra-namespace
  namespace: kube-system
spec:
  podSelector: {}
  ingress:
    - from:
      - namespaceSelector:
          matchLabels:
            name: kube-system
---
kind: NetworkPolicy
apiVersion: networking.k8s.io/v1
metadata:
  name: intra-namespace
  namespace: default
spec:
  podSelector: {}
  ingress:
    - from:
      - namespaceSelector:
          matchLabels:
            name: default
---
kind: NetworkPolicy
apiVersion: networking.k8s.io/v1
metadata:
  name: intra-namespace
  namespace: kube-public
spec:
  podSelector: {}
  ingress:
    - from:
      - namespaceSelector:
          matchLabels:
            name: kube-public
```

</TabItem>
</Tabs>


> **Note:** The Kubernetes critical additions such as CNI, DNS, and Ingress are run as pods in the `kube-system` namespace. Therefore, this namespace will have a policy that is less restrictive so that these components can run properly.

### NetworkPolicies

CIS requires that all namespaces have a network policy applied that reasonably limits traffic into namespaces and pods.

Network policies should be placed the `/var/lib/rancher/k3s/server/manifests` directory, where they will automatically be deployed on startup.

Here is an example of a compliant network policy.

```yaml
kind: NetworkPolicy
apiVersion: networking.k8s.io/v1
metadata:
  name: intra-namespace
  namespace: kube-system
spec:
  podSelector: {}
  ingress:
    - from:
      - namespaceSelector:
          matchLabels:
            kubernetes.io/metadata.name: kube-system
```

With the applied restrictions, DNS will be blocked unless purposely allowed. Below is a network policy that will allow for traffic to exist for DNS.

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-network-dns-policy
  namespace: <NAMESPACE>
spec:
  ingress:
  - ports:
    - port: 53
      protocol: TCP
    - port: 53
      protocol: UDP
  podSelector:
    matchLabels:
      k8s-app: kube-dns
  policyTypes:
  - Ingress
```

The metrics-server and Traefik ingress controller will be blocked by default if network policies are not created to allow access. Ensure that you use the sample yaml below:
```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-all-metrics-server
  namespace: kube-system
spec:
  podSelector:
    matchLabels:
      k8s-app: metrics-server
  ingress:
  - {}
  policyTypes:
  - Ingress
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-all-svclbtraefik-ingress
  namespace: kube-system
spec:
  podSelector: 
    matchLabels:
      svccontroller.k3s.cattle.io/svcname: traefik
  ingress:
  - {}
  policyTypes:
  - Ingress
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-all-traefik-v121-ingress
  namespace: kube-system
spec:
  podSelector:
    matchLabels:
      app.kubernetes.io/name: traefik
  ingress:
  - {}
  policyTypes:
  - Ingress
```

:::info
Operators must manage network policies as normal for additional namespaces that are created.
:::


### API Server audit configuration

CIS requirements 1.2.22 to 1.2.25 are related to configuring audit logs for the API Server. K3s doesn't create by default the log directory and audit policy, as auditing requirements are specific to each user's policies and environment.

The log directory, ideally, must be created before starting K3s. A restrictive access permission is recommended to avoid leaking potential sensitive information.

```bash
sudo mkdir -p -m 700 /var/lib/rancher/k3s/server/logs
```

A starter audit policy to log request metadata is provided below. The policy should be written to a file named `audit.yaml` in `/var/lib/rancher/k3s/server` directory. Detailed information about policy configuration for the API server can be found in the Kubernetes [documentation](https://kubernetes.io/docs/tasks/debug/debug-cluster/audit/).

```yaml
apiVersion: audit.k8s.io/v1
kind: Policy
rules:
- level: Metadata
```

Both configurations must be passed as arguments to the API Server as:

<Tabs>
<TabItem value="config">

```yaml
kube-apiserver-arg:
  - 'admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml'
  - 'audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log'
  - 'audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml'
  - 'audit-log-maxage=30'
  - 'audit-log-maxbackup=10'
  - 'audit-log-maxsize=100'
```
</TabItem>
<TabItem value="cmdline">

```bash
--kube-apiserver-arg='audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log'
--kube-apiserver-arg='audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml'
```
</TabItem>

</Tabs>

K3s must be restarted to load the new configuration.

```bash
sudo systemctl daemon-reload
sudo systemctl restart k3s.service
```

## Configuration for Kubernetes Components


The configuration below should be placed in the [configuration file](../installation/configuration.md#configuration-file), and contains all the necessary remediations to harden the Kubernetes components.


<Tabs groupId="pod-sec" queryString>
<TabItem value="v1.25 and Newer" default>

```yaml
protect-kernel-defaults: true
secrets-encryption: true
kube-apiserver-arg:
  - "enable-admission-plugins=NodeRestriction,EventRateLimit"
  - 'admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml'
  - 'audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log'
  - 'audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml'
  - 'audit-log-maxage=30'
  - 'audit-log-maxbackup=10'
  - 'audit-log-maxsize=100'
kube-controller-manager-arg:
  - 'terminated-pod-gc-threshold=10'
kubelet-arg:
  - 'streaming-connection-idle-timeout=5m'
  - "tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305"
```

</TabItem>

<TabItem value="v1.24 and Older" default>

```yaml
protect-kernel-defaults: true
secrets-encryption: true
kube-apiserver-arg:
  - 'enable-admission-plugins=NodeRestriction,PodSecurityPolicy,NamespaceLifecycle,ServiceAccount'
  - 'audit-log-path=/var/lib/rancher/k3s/server/logs/audit.log'
  - 'audit-policy-file=/var/lib/rancher/k3s/server/audit.yaml'
  - 'audit-log-maxage=30'
  - 'audit-log-maxbackup=10'
  - 'audit-log-maxsize=100'
kube-controller-manager-arg:
  - 'terminated-pod-gc-threshold=10'
kubelet-arg:
  - 'streaming-connection-idle-timeout=5m'
  - 'make-iptables-util-chains=true'
  - "tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305"
```

</TabItem>
</Tabs>

## Manual Operations
The following are controls that K3s currently does not pass by with the above configuration applied. These controls require manual intervention to fully comply with the CIS Benchmark.

### Control 1.1.20
Ensure that the Kubernetes PKI certificate file permissions are set to 600 or more restrictive (Manual)

<details>
<summary>Remediation</summary>
K3s PKI certificate files are stored in `/var/lib/rancher/k3s/server/tls/` with permission 644.
To remediate, run the following command:
```bash
chmod -R 600 /var/lib/rancher/k3s/server/tls/*.crt
```
</details>

### Control 1.2.9 
Ensure that the admission control plugin EventRateLimit is set

<details>
<summary>Remediation</summary>
Follow the [Kubernetes documentation](https://kubernetes.io/docs/reference/access-authn-authz/admission-controllers/#eventratelimit) and set the desired limits in a configuration file.
For this and other psa configuration, this documentation uses /var/lib/rancher/k3s/server/psa.yaml.
Then, edit the K3s config file /etc/rancher/k3s/config.yaml and set the below parameters.
```yaml
kube-apiserver-arg:
  - "enable-admission-plugins=NodeRestriction,EventRateLimit"
  - "admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml"
```
</details>

### Control 1.2.11
Ensure that the admission control plugin AlwaysPullImages is set

<details>
<summary>Remediation</summary>
Permissive, per CIS guidelines,
"This setting could impact offline or isolated clusters, which have images pre-loaded and
do not have access to a registry to pull in-use images. This setting is not appropriate for
clusters which use this configuration."
Edit the K3s config file /etc/rancher/k3s/config.yaml and set the below parameter.
```yaml
kube-apiserver-arg:
  - "enable-admission-plugins=...,AlwaysPullImages,..."
```
</details>

### Control 1.2.21 
Ensure that the --request-timeout argument is set as appropriate

<details>
<summary>Remediation</summary>
Permissive, per CIS guidelines,
"it is recommended to set this limit as appropriate and change the default limit of 60 seconds only if needed".
Edit the K3s config file /etc/rancher/k3s/config.yaml
and set the below parameter if needed. For example,
```yaml
kube-apiserver-arg:
  - "request-timeout=300s"
```
</details>

### Control 4.2.13 
Ensure that a limit is set on pod PIDs 

<details>
<summary>Remediation</summary>
Decide on an appropriate level for this parameter and set it,
If using a K3s config file /etc/rancher/k3s/config.yaml, edit the file to set `podPidsLimit` to
```yaml
kubelet-arg:
  - "pod-max-pids=<value>"
```
</details>

### Control 5.X

All the 5.X Controls are related to Kubernetes policy configuration. These controls are not enforced by K3s by default. 

Refer to [CIS 1.8 Section 5](self-assessment-1.8.md#51-rbac-and-service-accounts) for more information on how to create and apply these policies.

#### Control 5.1.5

:::note
Remediation to achieve passing score is only needed for cis-1.9
:::

<details>
<summary>Remediation</summary>
Create explicit service accounts wherever a Kubernetes workload requires specific access to the Kubernetes API server.
At a minimum, patch the following:
```bash
kubectl patch serviceaccount --namespace default default --patch '{"automountServiceAccountToken": false}'
kubectl patch serviceaccount --namespace kube-node-lease default --patch '{"automountServiceAccountToken": false}'
kubectl patch serviceaccount --namespace kube-public default --patch '{"automountServiceAccountToken": false}'
```
</details>


## Conclusion

If you have followed this guide, your K3s cluster will be configured to comply with the CIS Kubernetes Benchmark. You can review the [CIS 1.8 Self-Assessment Guide](self-assessment-1.8.md) to understand the expectations of each of the benchmark's checks and how you can do the same on your cluster.
