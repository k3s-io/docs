---
title: certificate
---

# k3s certificate

## Client and Server Certificates

K3s client and server certificates are valid for 365 days from their date of issuance. Any certificates that are expired, or within 90 days of expiring, are automatically renewed every time K3s starts.

### Rotating Client and Server Certificates {#rotate}

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

## Cluster Certificate Authority (CA) Certificates

Kubernetes requires a number of CA certificates for proper operation. For more information on how Kubernetes uses CA certificates, see the Kubernetes [PKI Certificates and Requirements](https://kubernetes.io/docs/setup/best-practices/certificates/#all-certificates) documentation.

By default, K3s generates self-signed CA certificates during startup of the first server node. These CA certificates are valid for 10 years from date of issuance, and are not automatically renewed.

To rotate CA certificates and keys, use the `k3s certificate rotate-ca` command.
The command performs integrity checks to confirm that the updated certificates and keys are usable.
If the updated data is acceptable, the datastore's encrypted bootstrap data is updated, and the new certificates and keys will be used the next time K3s starts.
If problems are encountered while validating the certificates and keys, an error is reported to the system log and the operation is cancelled without changes.

### Using Custom CA Certificates

If CA certificates and keys are found the correct location during initial startup of the first server in the cluster, automatic generation of CA certificates will be bypassed.
An example script to pre-create the appropriate certificates and keys is available at [`contrib/util/certs.sh`](https://github.com/k3s-io/k3s/blob/master/contrib/util/certs.sh).
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

### Rotating Custom CA Certificates {#rotate-ca}

To rotate custom CA certificates, use the `k3s certificate rotate-ca` subcommand.

A cluster that has been started with custom CA certificates can renew or rotate the certificates and keys non-disruptively: without requiring any change to node configuration.
Updated files must be staged into a temporary directory, loaded into the datastore, and k3s must be restarted to use the updated certificates.
Rotating custom certificates requires the updated certificates be signed by the same root CA that was used when the cluster was initially started.

:::caution
You must not overwrite the currently in-use data in `/var/lib/rancher/k3s/server/tls`.  
Stage the updated certificates and keys into a separate directory.
:::

For example, to generate updated certs and keys, run the following commands:
```bash
# Create a temporary directory for cert generation
mkdir -p /opt/k3s/server/tls

# Copy your root CA cert and intermediate CA cert+key into the correct location for the script
cp /etc/ssl/certs/root.crt /etc/ssl/certs/intermediate.cert /etc/ssl/private/intermediate.key /opt/k3s/server/tls

# Generate updated certs
DATA_DIR=/opt/k3s ./certs.sh

# Load the updated certs into the datastore
k3s certificate rotate-ca --path=/opt/k3s/server

# If the command returns successfully, restart k3s. If it does not, check the log for errors.
systemctl restart k3s

# Repeat the restart command sequentially on all other nodes in the cluster. Servers first, then agents.
```

### Rotating Self-Signed CA Certificates {#rotate-ca-force}

To rotate self-signed CA certificates, generate updated certificates, and use the `k3s certificate rotate-ca` subcommand with the `--force` option to skip integrity checks that confirm a continuous root of trust. 

Following renewal of the self-signed CA certificates, all nodes will need to be reconfigured to verify that their join token includes the hash of the new server CA certificate, and restarted to use the updated certificates.

:::caution
You must not overwrite the currently in-use data in `/var/lib/rancher/k3s/server/tls`.  
Stage the updated certificates and keys into a separate directory.
:::

For example, to generate updated certificates
```bash
# Create a temporary directory for cert generation
mkdir -p /opt/k3s/server/tls

# Create updated certificates using the current certificates and keys


# Calculate the hash of the new server CA certificate, and update the token file
export SERVER_CA_HASH=$(sha256sum /opt/k3s/server/tls/server-ca.crt | awk '{print $1}')
export NEW_TOKEN=$(awk -F:: '{print ENVIRON["SERVER_CA_HASH"] $FS $2}' /var/lib/rancher/k3s/server/node-token)
echo $NEW_TOKEN > /var/lib/rancher/k3s/server/node-token

# Load the updated certs into the datastore
k3s certificate rotate-ca --path=/opt/k3s/server --force

# If the command returns successfully, restart k3s. If it does not, check the log for errors.
systemctl restart k3s

# Update the token and repeat the restart command sequentially on all other nodes in the cluster. Servers first, then agents.
```


## Service-Account Issuer Key

The service-account issuer key is an RSA private key used to sign service-account tokens.
When rotating the service-account issuer key, at least one old key should be retained in the file so that existing service-account tokens are not invalidated.
It can be independently rotated by using the `k3s certificate rotate-ca` to install a new `service.key` file that includes both the new and old key.

:::caution
You must not overwrite the currently in-use data in `/var/lib/rancher/k3s/server/tls`.  
Stage the updated key into a separate directory.
:::

For example, to rotate only the service-account issuer key, run the following commands:
```bash
# Create a temporary directory for cert generation
mkdir -p /opt/k3s/server/tls
# Generate a new key
openssl genrsa -traditional -out /opt/k3s/server/tls/service.key 2048
# Append the existing key to avoid invalidating current tokens
cat /var/lib/rancher/k3s/server/tls/service.key >> /opt/k3s/server/tls/service.key
# Load the updated certs into the datastore
k3s certificate rotate-ca --path=/opt/k3s/server
# If the command returns successfully, restart k3s. If it does not, check the log for errors.
systemctl restart k3s
# Repeat the restart command sequentially on all other servers in the cluster.
```
