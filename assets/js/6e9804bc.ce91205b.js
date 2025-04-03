"use strict";(self.webpackChunkk_3_s_docs=self.webpackChunkk_3_s_docs||[]).push([[7026],{3117:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>o,contentTitle:()=>a,default:()=>h,frontMatter:()=>c,metadata:()=>s,toc:()=>d});const s=JSON.parse('{"id":"cli/certificate","title":"certificate","description":"Client and Server Certificates","source":"@site/docs/cli/certificate.md","sourceDirName":"cli","slug":"/cli/certificate","permalink":"/cli/certificate","draft":false,"unlisted":false,"editUrl":"https://github.com/k3s-io/docs/edit/main/docs/cli/certificate.md","tags":[],"version":"current","lastUpdatedAt":1743700129000,"frontMatter":{"title":"certificate"},"sidebar":"mySidebar","previous":{"title":"agent","permalink":"/cli/agent"},"next":{"title":"etcd-snapshot","permalink":"/cli/etcd-snapshot"}}');var n=r(4848),i=r(8453);const c={title:"certificate"},a="k3s certificate",o={},d=[{value:"Client and Server Certificates",id:"client-and-server-certificates",level:2},{value:"Checking expiration dates",id:"checking-expiration-dates",level:3},{value:"Rotating Client and Server Certificates",id:"rotating-client-and-server-certificates",level:3},{value:"Certificate Authority (CA) Certificates",id:"certificate-authority-ca-certificates",level:2},{value:"Using Custom CA Certificates",id:"using-custom-ca-certificates",level:3},{value:"Custom CA Topology",id:"custom-ca-topology",level:4},{value:"Using the Example Script",id:"using-the-example-script",level:4},{value:"Rotating Custom CA Certificates",id:"rotating-custom-ca-certificates",level:3},{value:"Using the Example Script",id:"using-the-example-script-1",level:4},{value:"Rotating Self-Signed CA Certificates",id:"rotating-self-signed-ca-certificates",level:3},{value:"Default CA Topology",id:"default-ca-topology",level:4},{value:"Using The Example Script",id:"using-the-example-script-2",level:4},{value:"Service-Account Issuer Key Rotation",id:"service-account-issuer-key-rotation",level:2}];function l(e){const t={a:"a",admonition:"admonition",br:"br",code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",h4:"h4",header:"header",li:"li",mermaid:"mermaid",p:"p",pre:"pre",ul:"ul",...(0,i.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(t.header,{children:(0,n.jsx)(t.h1,{id:"k3s-certificate",children:"k3s certificate"})}),"\n",(0,n.jsx)(t.h2,{id:"client-and-server-certificates",children:"Client and Server Certificates"}),"\n",(0,n.jsx)(t.p,{children:"K3s client and server certificates are valid for 365 days from their date of issuance. Any certificates that are expired, or within 90 days of expiring, are automatically renewed every time K3s starts."}),"\n",(0,n.jsx)(t.admonition,{title:"CERTIFICATE EXPIRATION WARNING",type:"info",children:(0,n.jsxs)(t.p,{children:["When a certificate is within 90 days of expiring a Kubernetes Warning event with reason: ",(0,n.jsx)(t.code,{children:"CertificateExpirationWarning"})," is created"]})}),"\n",(0,n.jsx)(t.h3,{id:"checking-expiration-dates",children:"Checking expiration dates"}),"\n",(0,n.jsxs)(t.p,{children:["To check the node certificates and their expiration date use the ",(0,n.jsx)(t.code,{children:"k3s certificate check --output table"}),":"]}),"\n",(0,n.jsx)(t.pre,{children:(0,n.jsx)(t.code,{className:"language-bash",children:"CERTIFICATE                SUBJECT                                            STATUS  EXPIRES\n-----------                -------                                            ------  -------\nclient-kube-proxy.crt      CN=system:kube-proxy                               OK      2026-04-02T12:51:38Z\nclient-kube-proxy.crt      CN=k3s-client-ca@1743598281                        OK      2035-03-31T12:51:21Z\nclient-kubelet.crt         CN=system:node:vm1,O=system:nodes                  OK      2026-04-02T12:51:38Z\nclient-kubelet.crt         CN=k3s-client-ca@1743598281                        OK      2035-03-31T12:51:21Z\nserving-kubelet.crt        CN=vm1                                             OK      2026-04-02T12:51:38Z\nserving-kubelet.crt        CN=k3s-server-ca@1743598281                        OK      2035-03-31T12:51:21Z\nclient-k3s-controller.crt  CN=system:k3s-controller                           OK      2026-04-02T12:51:38Z\nclient-k3s-controller.crt  CN=k3s-client-ca@1743598281                        OK      2035-03-31T12:51:21Z\n"})}),"\n",(0,n.jsx)(t.admonition,{title:"SAME CERTIFICATE TWICE",type:"info",children:(0,n.jsx)(t.p,{children:"Each certificate file (CERTIFICATE column) contains two certificates, including the certificate itself and its issuing Certificate Authority (CA)"})}),"\n",(0,n.jsxs)(t.p,{children:["In case of unexpected output, please use ",(0,n.jsx)(t.code,{children:"--debug"})," flag to get more information or configure the correct data directory with ",(0,n.jsx)(t.code,{children:"--data-dir"})," flag."]}),"\n",(0,n.jsx)(t.h3,{id:"rotating-client-and-server-certificates",children:"Rotating Client and Server Certificates"}),"\n",(0,n.jsxs)(t.p,{children:["To rotate client and server certificates manually, use the ",(0,n.jsx)(t.code,{children:"k3s certificate rotate"})," subcommand:"]}),"\n",(0,n.jsx)(t.pre,{children:(0,n.jsx)(t.code,{className:"language-bash",children:"# Stop K3s\nsystemctl stop k3s\n\n# Rotate certificates\nk3s certificate rotate\n\n# Start K3s\nsystemctl start k3s\n"})}),"\n",(0,n.jsx)(t.p,{children:"Individual or lists of certificates can be rotated by specifying the certificate name:"}),"\n",(0,n.jsx)(t.pre,{children:(0,n.jsx)(t.code,{className:"language-bash",children:"k3s certificate rotate --service <SERVICE>,<SERVICE>\n"})}),"\n",(0,n.jsxs)(t.p,{children:["The following certificates can be rotated: ",(0,n.jsx)(t.code,{children:"admin"}),", ",(0,n.jsx)(t.code,{children:"api-server"}),", ",(0,n.jsx)(t.code,{children:"controller-manager"}),", ",(0,n.jsx)(t.code,{children:"scheduler"}),", ",(0,n.jsx)(t.code,{children:"k3s-controller"}),", ",(0,n.jsx)(t.code,{children:"k3s-server"}),", ",(0,n.jsx)(t.code,{children:"cloud-controller"}),", ",(0,n.jsx)(t.code,{children:"etcd"}),", ",(0,n.jsx)(t.code,{children:"auth-proxy"}),", ",(0,n.jsx)(t.code,{children:"kubelet"}),", ",(0,n.jsx)(t.code,{children:"kube-proxy"}),"."]}),"\n",(0,n.jsx)(t.h2,{id:"certificate-authority-ca-certificates",children:"Certificate Authority (CA) Certificates"}),"\n",(0,n.jsxs)(t.p,{children:["Kubernetes requires a number of CA certificates for proper operation. For more information on how Kubernetes uses CA certificates, see the Kubernetes ",(0,n.jsx)(t.a,{href:"https://kubernetes.io/docs/setup/best-practices/certificates/#all-certificates",children:"PKI Certificates and Requirements"})," documentation."]}),"\n",(0,n.jsx)(t.p,{children:"By default, K3s generates self-signed CA certificates during startup of the first server node. These CA certificates are valid for 10 years from date of issuance, and are not automatically renewed."}),"\n",(0,n.jsxs)(t.p,{children:["The authoritative CA certificates and keys are stored within the datastore's bootstrap key, encrypted using the ",(0,n.jsx)(t.a,{href:"/cli/token#server",children:"server token"})," as the PBKDF2 passphrase with AES256-GCM and HMAC-SHA1.\nCopies of the CA certificates and keys are extracted to disk during K3s server startup.\nAny server may generate leaf certificates for nodes as they join the cluster, and the Kubernetes ",(0,n.jsx)(t.a,{href:"https://kubernetes.io/docs/reference/access-authn-authz/certificate-signing-requests/",children:"Certificates API"})," controllers may issue additional certificates at runtime."]}),"\n",(0,n.jsxs)(t.p,{children:["To rotate CA certificates and keys, use the ",(0,n.jsx)(t.code,{children:"k3s certificate rotate-ca"})," command.\nThe command performs integrity checks to confirm that the updated certificates and keys are usable.\nIf the updated data is acceptable, the datastore's encrypted bootstrap key is updated, and the new certificates and keys will be used the next time K3s starts.\nIf problems are encountered while validating the certificates and keys, an error is reported to the system log and the operation is cancelled without changes."]}),"\n",(0,n.jsx)(t.admonition,{title:"Version Gate",type:"info",children:(0,n.jsxs)(t.p,{children:["Support for the ",(0,n.jsx)(t.code,{children:"k3s certificate rotate-ca"})," command and the ability to use CA certificates signed by an external CA is available starting with the 2023-02 releases (v1.26.2+k3s1, v1.25.7+k3s1, v1.24.11+k3s1, v1.23.17+k3s1)."]})}),"\n",(0,n.jsx)(t.h3,{id:"using-custom-ca-certificates",children:"Using Custom CA Certificates"}),"\n",(0,n.jsx)(t.p,{children:"If CA certificates and keys are found the correct location during initial startup of the first server in the cluster, automatic generation of CA certificates will be bypassed."}),"\n",(0,n.jsxs)(t.p,{children:["An example script to pre-create the appropriate certificates and keys is available ",(0,n.jsxs)(t.a,{href:"https://github.com/k3s-io/k3s/blob/master/contrib/util/generate-custom-ca-certs.sh",children:["in the K3s repo at ",(0,n.jsx)(t.code,{children:"contrib/util/generate-custom-ca-certs.sh"})]}),".\nThis script should be run prior to starting K3s for the first time, and will create a full set of leaf CA certificates signed by common Root and Intermediate CA certificates.\nIf you have an existing Root or Intermediate CA, this script can be used (or used as a starting point) to create the correct CA certificates to provision a K3s cluster with PKI rooted in an existing authority."]}),"\n",(0,n.jsxs)(t.p,{children:["Custom Certificate Authority files must be placed in ",(0,n.jsx)(t.code,{children:"/var/lib/rancher/k3s/server/tls"}),". The following files are required:"]}),"\n",(0,n.jsxs)(t.ul,{children:["\n",(0,n.jsx)(t.li,{children:(0,n.jsx)(t.code,{children:"server-ca.crt"})}),"\n",(0,n.jsx)(t.li,{children:(0,n.jsx)(t.code,{children:"server-ca.key"})}),"\n",(0,n.jsx)(t.li,{children:(0,n.jsx)(t.code,{children:"client-ca.crt"})}),"\n",(0,n.jsx)(t.li,{children:(0,n.jsx)(t.code,{children:"client-ca.key"})}),"\n",(0,n.jsx)(t.li,{children:(0,n.jsx)(t.code,{children:"request-header-ca.crt"})}),"\n",(0,n.jsxs)(t.li,{children:[(0,n.jsx)(t.code,{children:"request-header-ca.key"}),(0,n.jsx)(t.br,{}),"\n",(0,n.jsx)(t.em,{children:"// note: etcd files are required even if embedded etcd is not in use."})]}),"\n",(0,n.jsx)(t.li,{children:(0,n.jsx)(t.code,{children:"etcd/peer-ca.crt"})}),"\n",(0,n.jsx)(t.li,{children:(0,n.jsx)(t.code,{children:"etcd/peer-ca.key"})}),"\n",(0,n.jsx)(t.li,{children:(0,n.jsx)(t.code,{children:"etcd/server-ca.crt"})}),"\n",(0,n.jsxs)(t.li,{children:[(0,n.jsx)(t.code,{children:"etcd/server-ca.key"}),(0,n.jsx)(t.br,{}),"\n",(0,n.jsx)(t.em,{children:"// note: This is the private key used to sign service-account tokens. It does not have a corresponding certificate."})]}),"\n",(0,n.jsx)(t.li,{children:(0,n.jsx)(t.code,{children:"service.key"})}),"\n"]}),"\n",(0,n.jsx)(t.h4,{id:"custom-ca-topology",children:"Custom CA Topology"}),"\n",(0,n.jsx)(t.p,{children:"Custom CA Certificates should observe the following topology:"}),"\n",(0,n.jsx)(t.mermaid,{value:'graph TD\n  root("Root CA")\n  intermediate("Intermediate CA")\n  server-ca("Server CA")\n  client-ca("Client CA")\n  request-header-ca("API Aggregation CA")\n  etcd-peer-ca("etcd Peer CA")\n  etcd-server-ca("etcd Server CA")\n\n  root-hash>"Join token CA hash"]\n\n  kube-server-certs[["Kubernetes servers<br/>(control-plane and kubelet listeners)"]]\n  kube-client-certs[["Kubernetes clients<br/>(apiserver and kubelet clients)"]]\n  request-header-certs[["Kubernetes API aggregation<br/>(apiserver proxy client)"]]\n  etcd-peer-certs[["etcd peer client/server<br/>(etcd replication)"]]\n  etcd-server-certs[["etcd client/server certificates<br/>(Kubernetes <-> etcd)"]]\n\n  root -.-|SHA256| root-hash\n  root ---\x3e intermediate\n  intermediate --\x3e server-ca ==> kube-server-certs\n  intermediate --\x3e client-ca ==> kube-client-certs\n  intermediate --\x3e request-header-ca ==> request-header-certs\n  intermediate --\x3e etcd-peer-ca ==> etcd-peer-certs\n  intermediate --\x3e etcd-server-ca ==> etcd-server-certs'}),"\n",(0,n.jsx)(t.h4,{id:"using-the-example-script",children:"Using the Example Script"}),"\n",(0,n.jsx)(t.admonition,{title:"Important",type:"info",children:(0,n.jsx)(t.p,{children:"If you want to sign the cluster CA certificates with an existing root CA using the example script, you must place the root and intermediate files in the target directory prior to running the script.\nIf the files do not exist, the script will create new root and intermediate CA certificates."})}),"\n",(0,n.jsx)(t.p,{children:"If you want to use only an existing root CA certificate, provide the following files:"}),"\n",(0,n.jsxs)(t.ul,{children:["\n",(0,n.jsx)(t.li,{children:(0,n.jsx)(t.code,{children:"root-ca.pem"})}),"\n",(0,n.jsx)(t.li,{children:(0,n.jsx)(t.code,{children:"root-ca.key"})}),"\n"]}),"\n",(0,n.jsx)(t.p,{children:"If you want to use existing root and intermediate CA certificates, provide the following files:"}),"\n",(0,n.jsxs)(t.ul,{children:["\n",(0,n.jsx)(t.li,{children:(0,n.jsx)(t.code,{children:"root-ca.pem"})}),"\n",(0,n.jsx)(t.li,{children:(0,n.jsx)(t.code,{children:"intermediate-ca.pem"})}),"\n",(0,n.jsx)(t.li,{children:(0,n.jsx)(t.code,{children:"intermediate-ca.key"})}),"\n"]}),"\n",(0,n.jsx)(t.p,{children:"To use the example script to generate custom certs and keys before starting K3s, run the following commands:"}),"\n",(0,n.jsx)(t.pre,{children:(0,n.jsx)(t.code,{className:"language-bash",children:"# Create the target directory for cert generation.\nmkdir -p /var/lib/rancher/k3s/server/tls\n\n# Copy your root CA cert and intermediate CA cert+key into the correct location for the script.\n# For the purposes of this example, we assume you have existing root and intermediate CA files in /etc/ssl.\n# If you do not have an existing root and/or intermediate CA, the script will generate them for you.\ncp /etc/ssl/certs/root-ca.pem /etc/ssl/certs/intermediate-ca.pem /etc/ssl/private/intermediate-ca.key /var/lib/rancher/k3s/server/tls\n\n# Generate custom CA certs and keys.\ncurl -sL https://github.com/k3s-io/k3s/raw/master/contrib/util/generate-custom-ca-certs.sh | bash -\n"})}),"\n",(0,n.jsx)(t.p,{children:"If the command completes successfully, you may install and/or start K3s for the first time.\nIf the script generated root and/or intermediate CA files, you should back up these files so that they can be reused if it is necessary to rotate the CA certificates at a later date."}),"\n",(0,n.jsx)(t.h3,{id:"rotating-custom-ca-certificates",children:"Rotating Custom CA Certificates"}),"\n",(0,n.jsxs)(t.p,{children:["To rotate custom CA certificates, use the ",(0,n.jsx)(t.code,{children:"k3s certificate rotate-ca"})," subcommand.\nUpdated files must be staged into a temporary directory, loaded into the datastore, and k3s must be restarted on all nodes to use the updated certificates."]}),"\n",(0,n.jsx)(t.admonition,{type:"warning",children:(0,n.jsxs)(t.p,{children:["You must not overwrite the currently in-use data in ",(0,n.jsx)(t.code,{children:"/var/lib/rancher/k3s/server/tls"}),".",(0,n.jsx)(t.br,{}),"\n","Stage the updated certificates and keys into a separate directory."]})}),"\n",(0,n.jsx)(t.p,{children:"A cluster that has been started with custom CA certificates can renew or rotate the CA certificates and keys non-disruptively, as long as the same root CA is used."}),"\n",(0,n.jsxs)(t.p,{children:["If a new root CA is required, the rotation will be disruptive. The ",(0,n.jsx)(t.code,{children:"k3s certificate rotate-ca --force"})," option must be used, all nodes that were joined with a ",(0,n.jsx)(t.a,{href:"/cli/token#secure",children:"secure token"})," (including servers) will need to be reconfigured to use the new token value, and pods will need to be restarted to trust the new root CA."]}),"\n",(0,n.jsx)(t.h4,{id:"using-the-example-script-1",children:"Using the Example Script"}),"\n",(0,n.jsxs)(t.p,{children:["The example ",(0,n.jsx)(t.code,{children:"generate-custom-ca-certs.sh"})," script linked above can also be used to generate updated certs in a new temporary directory, by copying files into the correct location and setting the ",(0,n.jsx)(t.code,{children:"DATA_DIR"})," environment variable.\nTo use the example script to generate updated certs and keys, run the following commands:"]}),"\n",(0,n.jsx)(t.pre,{children:(0,n.jsx)(t.code,{className:"language-bash",children:"# Create a temporary directory for cert generation.\nmkdir -p /opt/k3s/server/tls\n\n# Copy your root CA cert and intermediate CA cert+key into the correct location for the script.\n# Non-disruptive rotation requires the same root CA that was used to generate the original certificates.\n# If the original files are still in the data directory, you can just run:\ncp /var/lib/rancher/k3s/server/tls/root-ca.* /var/lib/rancher/k3s/server/tls/intermediate-ca.* /opt/k3s/server/tls\n\n# Copy the current service-account signing key, so that existing service-account tokens are not invalidated.\ncp /var/lib/rancher/k3s/server/tls/service.key /opt/k3s/server/tls\n\n# Generate updated custom CA certs and keys.\ncurl -sL https://github.com/k3s-io/k3s/raw/master/contrib/util/generate-custom-ca-certs.sh | DATA_DIR=/opt/k3s bash -\n\n# Load the updated CA certs and keys into the datastore.\nk3s certificate rotate-ca --path=/opt/k3s/server\n"})}),"\n",(0,n.jsxs)(t.p,{children:["If the ",(0,n.jsx)(t.code,{children:"rotate-ca"})," command returns an error, check the service log for errors.\nIf the command completes successfully, restart K3s on all nodes in the cluster - servers first, then agents."]}),"\n",(0,n.jsxs)(t.p,{children:["If you used the ",(0,n.jsx)(t.code,{children:"--force"})," option or changed the root CA, ensure that any nodes that were joined with a ",(0,n.jsx)(t.a,{href:"/cli/token#secure",children:"secure token"})," are reconfigured to use the new token value, prior to being restarted.\nThe token may be stored in a ",(0,n.jsx)(t.code,{children:".env"})," file, systemd unit, or config.yaml, depending on how the node was configured during initial installation."]}),"\n",(0,n.jsx)(t.h3,{id:"rotating-self-signed-ca-certificates",children:"Rotating Self-Signed CA Certificates"}),"\n",(0,n.jsxs)(t.p,{children:["To rotate the K3s-generated self-signed CA certificates, use the ",(0,n.jsx)(t.code,{children:"k3s certificate rotate-ca"})," subcommand.\nUpdated files must be staged into a temporary directory, loaded into the datastore, and k3s must be restarted on all nodes to use the updated certificates."]}),"\n",(0,n.jsx)(t.admonition,{type:"warning",children:(0,n.jsxs)(t.p,{children:["You must not overwrite the currently in-use data in ",(0,n.jsx)(t.code,{children:"/var/lib/rancher/k3s/server/tls"}),".",(0,n.jsx)(t.br,{}),"\n","Stage the updated certificates and keys into a separate directory."]})}),"\n",(0,n.jsxs)(t.p,{children:["If the cluster has been started with default self-signed CA certificates, rotation will be disruptive. All nodes that were joined with a ",(0,n.jsx)(t.a,{href:"/cli/token#secure",children:"secure token"})," will need to be reconfigured to trust the new CA hash.\nIf the new CA certificates are not cross-signed by the old CA certificates, you will need to use the ",(0,n.jsx)(t.code,{children:"--force"})," option to bypass integrity checks, and pods will need to be restarted to trust the new root CA."]}),"\n",(0,n.jsx)(t.h4,{id:"default-ca-topology",children:"Default CA Topology"}),"\n",(0,n.jsx)(t.p,{children:"The default self-signed CA certificates have the following topology:"}),"\n",(0,n.jsx)(t.mermaid,{value:'graph TD\n  server-ca("Server CA")\n  client-ca("Client CA")\n  request-header-ca("API Aggregation CA")\n  etcd-peer-ca("etcd Peer CA")\n  etcd-server-ca("etcd Server CA")\n\n  root-hash>"Join token CA hash"]\n\n  kube-server-certs[["Kubernetes servers<br/>(control-plane and kubelet listeners)"]]\n  kube-client-certs[["Kubernetes clients<br/>(apiserver and kubelet clients)"]]\n  request-header-certs[["Kubernetes API aggregation<br/>(apiserver proxy client)"]]\n  etcd-peer-certs[["etcd peer client/server<br/>(etcd replication)"]]\n  etcd-server-certs[["etcd client/server certificates<br/>(Kubernetes <-> etcd)"]]\n\n  server-ca -.-|SHA256| root-hash\n  server-ca ===> kube-server-certs\n  client-ca ===> kube-client-certs\n  request-header-ca ===> request-header-certs\n  etcd-peer-ca ===> etcd-peer-certs\n  etcd-server-ca ===> etcd-server-certs'}),"\n",(0,n.jsx)(t.p,{children:"When rotating the default self-signed CAs, a modified certificate topology with intermediate CAs and a new root CA cross-signed by the old CA can be used so that there is a continuous chain of trust between the old and new CAs:"}),"\n",(0,n.jsx)(t.mermaid,{value:'graph TD\n  server-ca-old("Server CA<br/>(old)")\n  client-ca-old("Client CA<br/>(old)")\n  request-header-ca-old("API Aggregation CA<br/>(old)")\n  etcd-peer-ca-old("etcd Peer CA<br/>(old)")\n  etcd-server-ca-old("etcd Server CA<br/>(old)")\n\n  root-hash>"Join token CA hash"]\n\n  server-ca-xsigned("Server CA<br/>(cross-signed)")\n  client-ca-xsigned("Client CA<br/>(cross-signed)")\n  request-header-ca-xsigned("API Aggregation CA<br/>(cross-signed)")\n  etcd-peer-ca-xsigned("etcd Peer CA<br/>(cross-signed)")\n  etcd-server-ca-xsigned("etcd Server CA<br/>(cross-signed)")\n\n  server-ca-ssigned("Server CA<br/>(self-signed)")\n  client-ca-ssigned("Client CA<br/>(self-signed)")\n  request-header-ca-ssigned("API Aggregation CA<br/>(self-signed)")\n  etcd-peer-ca-ssigned("etcd Peer CA<br/>(self-signed)")\n  etcd-server-ca-ssigned("etcd Server CA<br/>(self-signed)")\n\n  server-ca("Intermediate<br/>Server CA")\n  client-ca("Intermediate<br/>Client CA")\n  request-header-ca("Intermediate<br/>API Aggregation CA")\n  etcd-peer-ca("Intermediate<br/>etcd Peer CA")\n  etcd-server-ca("Intermediate<br>etcd Server CA")\n\n  kube-server-certs[["Kubernetes servers<br/>(control-plane and kubelet listeners)"]]\n  kube-client-certs[["Kubernetes clients<br/>(apiserver and kubelet clients)"]]\n  request-header-certs[["Kubernetes API aggregation<br/>(apiserver proxy client)"]]\n  etcd-peer-certs[["etcd peer client/server<br/>(etcd replication)"]]\n  etcd-server-certs[["etcd client/server certificates<br/>(Kubernetes <-> etcd)"]]\n\n  server-ca-ssigned -.-|SHA256| root-hash\n  server-ca-ssigned --\x3e server-ca ==> kube-server-certs\n  server-ca-old --\x3e server-ca-xsigned --\x3e server-ca\n  client-ca-ssigned --\x3e client-ca ==> kube-client-certs\n  client-ca-old --\x3e client-ca-xsigned --\x3e client-ca\n  request-header-ca-ssigned --\x3e request-header-ca ==> request-header-certs\n  request-header-ca-old --\x3e request-header-ca-xsigned --\x3e request-header-ca\n  etcd-peer-ca-ssigned --\x3e etcd-peer-ca ==> etcd-peer-certs\n  etcd-peer-ca-old --\x3e etcd-peer-ca-xsigned --\x3e etcd-peer-ca\n  etcd-server-ca-ssigned --\x3e etcd-server-ca ==> etcd-server-certs\n  etcd-server-ca-old --\x3e etcd-server-ca-xsigned --\x3e etcd-server-ca'}),"\n",(0,n.jsx)(t.h4,{id:"using-the-example-script-2",children:"Using The Example Script"}),"\n",(0,n.jsxs)(t.p,{children:["An example script to create updated CA certificates and keys cross-signed by the existing CAs is available ",(0,n.jsxs)(t.a,{href:"https://github.com/k3s-io/k3s/blob/master/contrib/util/rotate-default-ca-certs.sh",children:["in the K3s repo at ",(0,n.jsx)(t.code,{children:"contrib/util/rotate-default-ca-certs.sh"})]}),"."]}),"\n",(0,n.jsx)(t.p,{children:"To use the example script to generate updated self-signed certificates that are cross-signed by the existing CAs, run the following commands:"}),"\n",(0,n.jsx)(t.pre,{children:(0,n.jsx)(t.code,{className:"language-bash",children:"# Create updated CA certs and keys, cross-signed by the current CAs.\n# This script will create a new temporary directory containing the updated certs, and output the new token values.\ncurl -sL https://github.com/k3s-io/k3s/raw/master/contrib/util/rotate-default-ca-certs.sh | bash -\n\n# Load the updated certs into the datastore; see the script output for the updated token values.\nk3s certificate rotate-ca --path=/var/lib/rancher/k3s/server/rotate-ca\n"})}),"\n",(0,n.jsxs)(t.p,{children:["If the ",(0,n.jsx)(t.code,{children:"rotate-ca"})," command returns an error, check the service log for errors.\nIf the command completes successfully, restart K3s on all nodes in the cluster - servers first, then agents."]}),"\n",(0,n.jsxs)(t.p,{children:["Ensure that any nodes that were joined with a ",(0,n.jsx)(t.a,{href:"/cli/token#secure",children:"secure token"}),", including other server nodes, are reconfigured to use the new token value prior to being restarted.\nThe token may be stored in a ",(0,n.jsx)(t.code,{children:".env"})," file, systemd unit, or config.yaml, depending on how the node was configured during initial installation."]}),"\n",(0,n.jsx)(t.h2,{id:"service-account-issuer-key-rotation",children:"Service-Account Issuer Key Rotation"}),"\n",(0,n.jsxs)(t.p,{children:["The service-account issuer key is an RSA private key used to sign service-account tokens.\nWhen rotating the service-account issuer key, at least one old key should be retained in the file so that existing service-account tokens are not invalidated.\nIt can be rotated independent of the cluster CAs by using the ",(0,n.jsx)(t.code,{children:"k3s certificate rotate-ca"})," to install only an updated ",(0,n.jsx)(t.code,{children:"service.key"})," file that includes both the new and old keys."]}),"\n",(0,n.jsx)(t.admonition,{type:"warning",children:(0,n.jsxs)(t.p,{children:["You must not overwrite the currently in-use data in ",(0,n.jsx)(t.code,{children:"/var/lib/rancher/k3s/server/tls"}),".",(0,n.jsx)(t.br,{}),"\n","Stage the updated key into a separate directory."]})}),"\n",(0,n.jsx)(t.p,{children:"For example, to rotate only the service-account issuer key, run the following commands:"}),"\n",(0,n.jsx)(t.pre,{children:(0,n.jsx)(t.code,{className:"language-bash",children:"# Create a temporary directory for cert generation\nmkdir -p /opt/k3s/server/tls\n\n# Check OpenSSL version\nopenssl version | grep -qF 'OpenSSL 3' && OPENSSL_GENRSA_FLAGS=-traditional\n\n# Generate a new key\nopenssl genrsa ${OPENSSL_GENRSA_FLAGS:-} -out /opt/k3s/server/tls/service.key 2048\n\n# Append the existing key to avoid invalidating current tokens\ncat /var/lib/rancher/k3s/server/tls/service.key >> /opt/k3s/server/tls/service.key\n\n# Load the updated key into the datastore\nk3s certificate rotate-ca --path=/opt/k3s/server\n"})}),"\n",(0,n.jsxs)(t.p,{children:["It is normal to see warnings for files that are not being updated. If the ",(0,n.jsx)(t.code,{children:"rotate-ca"})," command returns an error, check the service log for errors.\nIf the command completes successfully, restart K3s on all servers in the cluster. It is not necessary to restart agents or restart any pods."]})]})}function h(e={}){const{wrapper:t}={...(0,i.R)(),...e.components};return t?(0,n.jsx)(t,{...e,children:(0,n.jsx)(l,{...e})}):l(e)}},8453:(e,t,r)=>{r.d(t,{R:()=>c,x:()=>a});var s=r(6540);const n={},i=s.createContext(n);function c(e){const t=s.useContext(i);return s.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function a(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(n):e.components||n:c(e.components),s.createElement(i.Provider,{value:t},e.children)}}}]);