---
title: certificate
---

# k3s certificate

## Client and Server Certificates

K3s client and server certificates are valid for 365 days from their date of issuance. Any certificates that are expired, or within 90 days of expiring, are automatically renewed every time K3s starts.

### Rotating Client and Server Certificates

To rotate client and server certificates manually, use the `k3s certificate rotate` subcommand:

```bash
# Stop K3s
systemctl stop k3s

# Rotate certificates
k3s certificate rotate

# Start K3s
systemctl start k3s
```

Individual or lists of certificates can be rotated by specifying the certificate name:

```bash
k3s certificate rotate --service <SERVICE>,<SERVICE>
```

The following certificates can be rotated: `admin`, `api-server`, `controller-manager`, `scheduler`, `k3s-controller`, `k3s-server`, `cloud-controller`, `etcd`, `auth-proxy`, `kubelet`, `kube-proxy`.

## Certificate Authority (CA) Certificates

Kubernetes requires a number of CA certificates for proper operation. For more information on how Kubernetes uses CA certificates, see the Kubernetes [PKI Certificates and Requirements](https://kubernetes.io/docs/setup/best-practices/certificates/#all-certificates) documentation.

By default, K3s generates self-signed CA certificates during startup of the first server node. These CA certificates are valid for 10 years from date of issuance, and are not automatically renewed.

The authoritative CA certificates and keys are stored within the datastore's bootstrap key, encrypted using the [server token](token.md#server) as the PBKDF2 passphrase with AES256-GCM and HMAC-SHA1.
Copies of the CA certificates and keys are extracted to disk during K3s server startup.
Any server may generate leaf certificates for nodes as they join the cluster, and the Kubernetes [Certificates API](https://kubernetes.io/docs/reference/access-authn-authz/certificate-signing-requests/) controllers may issue additional certificates at runtime.

To rotate CA certificates and keys, use the `k3s certificate rotate-ca` command.
The command performs integrity checks to confirm that the updated certificates and keys are usable.
If the updated data is acceptable, the datastore's encrypted bootstrap key is updated, and the new certificates and keys will be used the next time K3s starts.
If problems are encountered while validating the certificates and keys, an error is reported to the system log and the operation is cancelled without changes.

:::info Version Gate
Support for the `k3s certificate rotate-ca` command and the ability to use CA certificates signed by an external CA is available starting with the 2023-02 releases (v1.26.2+k3s1, v1.25.7+k3s1, v1.24.11+k3s1, v1.23.17+k3s1).
:::

### Using Custom CA Certificates

If CA certificates and keys are found the correct location during initial startup of the first server in the cluster, automatic generation of CA certificates will be bypassed.

An example script to pre-create the appropriate certificates and keys is available [in the K3s repo at `contrib/util/generate-custom-ca-certs.sh`](https://github.com/k3s-io/k3s/blob/master/contrib/util/generate-custom-ca-certs.sh).
This script should be run prior to starting K3s for the first time, and will create a full set of leaf CA certificates signed by common Root and Intermediate CA certificates.
If you have an existing Root or Intermediate CA, this script can be used (or used as a starting point) to create the correct CA certificates to provision a K3s cluster with PKI rooted in an existing authority.

Custom Certificate Authority files must be placed in `/var/lib/rancher/k3s/server/tls`. The following files are required:
* `server-ca.crt`
* `server-ca.key`
* `client-ca.crt`
* `client-ca.key`
* `request-header-ca.crt`
* `request-header-ca.key`  
  *// note: etcd files are required even if embedded etcd is not in use.*
* `etcd/peer-ca.crt`  
* `etcd/peer-ca.key`
* `etcd/server-ca.crt`
* `etcd/server-ca.key`  
  *// note: This is the private key used to sign service-account tokens. It does not have a corresponding certificate.*
* `service.key`

#### Custom CA Topology

Custom CA Certificates should observe the following topology:

```mermaid
graph TD
  root("Root CA")
  intermediate("Intermediate CA")
  server-ca("Server CA")
  client-ca("Client CA")
  request-header-ca("API Aggregation CA")
  etcd-peer-ca("etcd Peer CA")
  etcd-server-ca("etcd Server CA")

  root-hash>"Join token CA hash"]

  kube-server-certs[["Kubernetes servers<br/>(control-plane and kubelet listeners)"]]
  kube-client-certs[["Kubernetes clients<br/>(apiserver and kubelet clients)"]]
  request-header-certs[["Kubernetes API aggregation<br/>(apiserver proxy client)"]]
  etcd-peer-certs[["etcd peer client/server<br/>(etcd replication)"]]
  etcd-server-certs[["etcd client/server certificates<br/>(Kubernetes <-> etcd)"]]

  root -.-|SHA256| root-hash
  root ---> intermediate
  intermediate --> server-ca ==> kube-server-certs
  intermediate --> client-ca ==> kube-client-certs
  intermediate --> request-header-ca ==> request-header-certs
  intermediate --> etcd-peer-ca ==> etcd-peer-certs
  intermediate --> etcd-server-ca ==> etcd-server-certs
```

#### Using the Example Script

:::info 중요한
If you want to sign the cluster CA certificates with an existing root CA using the example script, you must place the root and intermediate files in the target directory prior to running the script.
If the files do not exist, the script will create new root and intermediate CA certificates.
:::

If you want to use only an existing root CA certificate, provide the following files:
* `root.pem`
* `root.key`

If you want to use existing root and intermediate CA certificates, provide the following files:
* `root.pem`
* `intermediate.pem`
* `intermediate.key`

To use the example script to generate custom certs and keys before starting K3s, run the following commands:
```bash
# Create the target directory for cert generation.
mkdir -p /var/lib/rancher/k3s/server/tls

# Copy your root CA cert and intermediate CA cert+key into the correct location for the script.
# For the purposes of this example, we assume you have existing root and intermediate CA files in /etc/ssl.
# If you do not have an existing root and/or intermediate CA, the script will generate them for you.
cp /etc/ssl/certs/root.pem /etc/ssl/certs/intermediate.pem /etc/ssl/private/intermediate.key /var/lib/rancher/k3s/server/tls

# Generate custom CA certs and keys.
curl -sL https://github.com/k3s-io/k3s/raw/master/contrib/util/generate-custom-ca-certs.sh | bash -
```

If the command completes successfully, you may install and/or start K3s for the first time.
If the script generated root and/or intermediate CA files, you should back up these files so that they can be reused if it is necessary to rotate the CA certificates at a later date.

### Rotating Custom CA Certificates

To rotate custom CA certificates, use the `k3s certificate rotate-ca` subcommand.
Updated files must be staged into a temporary directory, loaded into the datastore, and k3s must be restarted on all nodes to use the updated certificates.

:::warning
You must not overwrite the currently in-use data in `/var/lib/rancher/k3s/server/tls`.  
Stage the updated certificates and keys into a separate directory.
:::

A cluster that has been started with custom CA certificates can renew or rotate the CA certificates and keys non-disruptively, as long as the same root CA is used.

If a new root CA is required, the rotation will be disruptive. The `k3s certificate rotate-ca --force` option must be used, all nodes that were joined with a [secure token](token.md#secure) (including servers) will need to be reconfigured to use the new token value, and pods will need to be restarted to trust the new root CA.

#### Using the Example Script

The example `generate-custom-ca-certs.sh` script linked above can also be used to generate updated certs in a new temporary directory, by copying files into the correct location and setting the `DATA_DIR` environment variable.
To use the example script to generate updated certs and keys, run the following commands:
```bash
# Create a temporary directory for cert generation.
mkdir -p /opt/k3s/server/tls

# Copy your root CA cert and intermediate CA cert+key into the correct location for the script.
# Non-disruptive rotation requires the same root CA that was used to generate the original certificates.
# If the original files are still in the data directory, you can just run:
cp /var/lib/rancher/k3s/server/root.* /var/lib/rancher/k3s/server/intermediate.* /opt/k3s/server/tls

# Copy the current service-account signing key, so that existing service-account tokens are not invalidated.
cp /var/lib/rancher/k3s/server/tls/service.key /opt/k3s/server/tls

# Generate updated custom CA certs and keys.
curl -sL https://github.com/k3s-io/k3s/raw/master/contrib/util/generate-custom-ca-certs.sh | DATA_DIR=/opt/k3s bash -

# Load the updated CA certs and keys into the datastore.
k3s certificate rotate-ca --path=/opt/k3s/server
```

If the `rotate-ca` command returns an error, check the service log for errors.
If the command completes successfully, restart K3s on all nodes in the cluster - servers first, then agents.

If you used the `--force` option or changed the root CA, ensure that any nodes that were joined with a [secure token](token.md#secure) are reconfigured to use the new token value, prior to being restarted.
The token may be stored in a `.env` file, systemd unit, or config.yaml, depending on how the node was configured during initial installation.

### Rotating Self-Signed CA Certificates

To rotate the K3s-generated self-signed CA certificates, use the `k3s certificate rotate-ca` subcommand.
Updated files must be staged into a temporary directory, loaded into the datastore, and k3s must be restarted on all nodes to use the updated certificates.

:::warning
You must not overwrite the currently in-use data in `/var/lib/rancher/k3s/server/tls`.  
Stage the updated certificates and keys into a separate directory.
:::

If the cluster has been started with default self-signed CA certificates, rotation will be disruptive. All nodes that were joined with a [secure token](token.md#secure) will need to be reconfigured to trust the new CA hash.
If the new CA certificates are not cross-signed by the old CA certificates, you will need to use the `--force` option to bypass integrity checks, and pods will need to be restarted to trust the new root CA.

#### Default CA Topology
The default self-signed CA certificates have the following topology:

```mermaid
graph TD
  server-ca("Server CA")
  client-ca("Client CA")
  request-header-ca("API Aggregation CA")
  etcd-peer-ca("etcd Peer CA")
  etcd-server-ca("etcd Server CA")

  root-hash>"Join token CA hash"]

  kube-server-certs[["Kubernetes servers<br/>(control-plane and kubelet listeners)"]]
  kube-client-certs[["Kubernetes clients<br/>(apiserver and kubelet clients)"]]
  request-header-certs[["Kubernetes API aggregation<br/>(apiserver proxy client)"]]
  etcd-peer-certs[["etcd peer client/server<br/>(etcd replication)"]]
  etcd-server-certs[["etcd client/server certificates<br/>(Kubernetes <-> etcd)"]]

  server-ca -.-|SHA256| root-hash
  server-ca ===> kube-server-certs
  client-ca ===> kube-client-certs
  request-header-ca ===> request-header-certs
  etcd-peer-ca ===> etcd-peer-certs
  etcd-server-ca ===> etcd-server-certs
```

When rotating the default self-signed CAs, a modified certificate topology with intermediate CAs and a new root CA cross-signed by the old CA can be used so that there is a continuous chain of trust between the old and new CAs:
```mermaid
graph TD
  server-ca-old("Server CA<br/>(old)")
  client-ca-old("Client CA<br/>(old)")
  request-header-ca-old("API Aggregation CA<br/>(old)")
  etcd-peer-ca-old("etcd Peer CA<br/>(old)")
  etcd-server-ca-old("etcd Server CA<br/>(old)")

  root-hash>"Join token CA hash"]

  server-ca-xsigned("Server CA<br/>(cross-signed)")
  client-ca-xsigned("Client CA<br/>(cross-signed)")
  request-header-ca-xsigned("API Aggregation CA<br/>(cross-signed)")
  etcd-peer-ca-xsigned("etcd Peer CA<br/>(cross-signed)")
  etcd-server-ca-xsigned("etcd Server CA<br/>(cross-signed)")

  server-ca-ssigned("Server CA<br/>(self-signed)")
  client-ca-ssigned("Client CA<br/>(self-signed)")
  request-header-ca-ssigned("API Aggregation CA<br/>(self-signed)")
  etcd-peer-ca-ssigned("etcd Peer CA<br/>(self-signed)")
  etcd-server-ca-ssigned("etcd Server CA<br/>(self-signed)")

  server-ca("Intermediate<br/>Server CA")
  client-ca("Intermediate<br/>Client CA")
  request-header-ca("Intermediate<br/>API Aggregation CA")
  etcd-peer-ca("Intermediate<br/>etcd Peer CA")
  etcd-server-ca("Intermediate<br>etcd Server CA")

  kube-server-certs[["Kubernetes servers<br/>(control-plane and kubelet listeners)"]]
  kube-client-certs[["Kubernetes clients<br/>(apiserver and kubelet clients)"]]
  request-header-certs[["Kubernetes API aggregation<br/>(apiserver proxy client)"]]
  etcd-peer-certs[["etcd peer client/server<br/>(etcd replication)"]]
  etcd-server-certs[["etcd client/server certificates<br/>(Kubernetes <-> etcd)"]]

  server-ca-ssigned -.-|SHA256| root-hash
  server-ca-ssigned --> server-ca ==> kube-server-certs
  server-ca-old --> server-ca-xsigned --> server-ca
  client-ca-ssigned --> client-ca ==> kube-client-certs
  client-ca-old --> client-ca-xsigned --> client-ca
  request-header-ca-ssigned --> request-header-ca ==> request-header-certs
  request-header-ca-old --> request-header-ca-xsigned --> request-header-ca
  etcd-peer-ca-ssigned --> etcd-peer-ca ==> etcd-peer-certs
  etcd-peer-ca-old --> etcd-peer-ca-xsigned --> etcd-peer-ca
  etcd-server-ca-ssigned --> etcd-server-ca ==> etcd-server-certs
  etcd-server-ca-old --> etcd-server-ca-xsigned --> etcd-server-ca
```

#### Using The Example Script

An example script to create updated CA certificates and keys cross-signed by the existing CAs is available [in the K3s repo at `contrib/util/rotate-default-ca-certs.sh`](https://github.com/k3s-io/k3s/blob/master/contrib/util/rotate-default-ca-certs.sh).

To use the example script to generate updated self-signed certificates that are cross-signed by the existing CAs, run the following commands:
```bash
# Create updated CA certs and keys, cross-signed by the current CAs.
# This script will create a new temporary directory containing the updated certs, and output the new token values.
curl -sL https://github.com/k3s-io/k3s/raw/master/contrib/util/rotate-default-ca-certs.sh | bash -

# Load the updated certs into the datastore; see the script output for the updated token values.
k3s certificate rotate-ca --path=/var/lib/rancher/k3s/server/rotate-ca
```

If the `rotate-ca` command returns an error, check the service log for errors.
If the command completes successfully, restart K3s on all nodes in the cluster - servers first, then agents.

Ensure that any nodes that were joined with a [secure token](token.md#secure), including other server nodes, are reconfigured to use the new token value prior to being restarted.
The token may be stored in a `.env` file, systemd unit, or config.yaml, depending on how the node was configured during initial installation.

## Service-Account Issuer Key Rotation

The service-account issuer key is an RSA private key used to sign service-account tokens.
When rotating the service-account issuer key, at least one old key should be retained in the file so that existing service-account tokens are not invalidated.
It can be rotated independent of the cluster CAs by using the `k3s certificate rotate-ca` to install only an updated `service.key` file that includes both the new and old keys.

:::warning
You must not overwrite the currently in-use data in `/var/lib/rancher/k3s/server/tls`.  
Stage the updated key into a separate directory.
:::

For example, to rotate only the service-account issuer key, run the following commands:
```bash
# Create a temporary directory for cert generation
mkdir -p /opt/k3s/server/tls

# Check OpenSSL version
openssl version | grep -qF 'OpenSSL 3' && OPENSSL_GENRSA_FLAGS=-traditional

# Generate a new key
openssl genrsa ${OPENSSL_GENRSA_FLAGS:-} -out /opt/k3s/server/tls/service.key 2048

# Append the existing key to avoid invalidating current tokens
cat /var/lib/rancher/k3s/server/tls/service.key >> /opt/k3s/server/tls/service.key

# Load the updated key into the datastore
k3s certificate rotate-ca --path=/opt/k3s/server
```

It is normal to see warnings for files that are not being updated. If the `rotate-ca` command returns an error, check the service log for errors.
If the command completes successfully, restart K3s on all servers in the cluster. It is not necessary to restart agents or restart any pods.

