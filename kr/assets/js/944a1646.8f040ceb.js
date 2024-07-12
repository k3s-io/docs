"use strict";(self.webpackChunkk_3_s_docs=self.webpackChunkk_3_s_docs||[]).push([[2399],{4273:(e,s,t)=>{t.r(s),t.d(s,{assets:()=>o,contentTitle:()=>i,default:()=>h,frontMatter:()=>d,metadata:()=>a,toc:()=>c});var r=t(5893),n=t(1151);const d={title:"High Availability Embedded etcd"},i=void 0,a={id:"datastore/ha-embedded",title:"High Availability Embedded etcd",description:"Embedded etcd (HA) may have performance issues on slower disks such as Raspberry Pis running with SD cards.",source:"@site/i18n/kr/docusaurus-plugin-content-docs/current/datastore/ha-embedded.md",sourceDirName:"datastore",slug:"/datastore/ha-embedded",permalink:"/kr/datastore/ha-embedded",draft:!1,unlisted:!1,editUrl:"https://github.com/k3s-io/docs/edit/main/docs/datastore/ha-embedded.md",tags:[],version:"current",lastUpdatedAt:172080213e4,frontMatter:{title:"High Availability Embedded etcd"},sidebar:"mySidebar",previous:{title:"Backup and Restore",permalink:"/kr/datastore/backup-restore"},next:{title:"High Availability External DB",permalink:"/kr/datastore/ha"}},o={},c=[{value:"New cluster",id:"new-cluster",level:2},{value:"Existing clusters",id:"existing-clusters",level:2}];function l(e){const s={admonition:"admonition",blockquote:"blockquote",code:"code",h2:"h2",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,n.a)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(s.admonition,{type:"warning",children:(0,r.jsx)(s.p,{children:"Embedded etcd (HA) may have performance issues on slower disks such as Raspberry Pis running with SD cards."})}),"\n",(0,r.jsx)(s.h2,{id:"new-cluster",children:"New cluster"}),"\n",(0,r.jsx)(s.p,{children:"To run K3s in this mode, you must have an odd number of server nodes. We recommend starting with three nodes."}),"\n",(0,r.jsxs)(s.p,{children:["To get started, first launch a server node with the ",(0,r.jsx)(s.code,{children:"cluster-init"})," flag to enable clustering and a token that will be used as a shared secret to join additional servers to the cluster."]}),"\n",(0,r.jsx)(s.pre,{children:(0,r.jsx)(s.code,{className:"language-bash",children:"curl -sfL https://get.k3s.io | K3S_TOKEN=SECRET sh -s - server --cluster-init\n"})}),"\n",(0,r.jsx)(s.p,{children:"After launching the first server, join the second and third servers to the cluster using the shared secret:"}),"\n",(0,r.jsx)(s.pre,{children:(0,r.jsx)(s.code,{className:"language-bash",children:"curl -sfL https://get.k3s.io | K3S_TOKEN=SECRET sh -s - server --server https://<ip or hostname of server1>:6443\n"})}),"\n",(0,r.jsx)(s.p,{children:"Check to see that the second and third servers are now part of the cluster:"}),"\n",(0,r.jsx)(s.pre,{children:(0,r.jsx)(s.code,{className:"language-bash",children:"$ kubectl get nodes\nNAME        STATUS   ROLES                       AGE   VERSION\nserver1     Ready    control-plane,etcd,master   28m   vX.Y.Z\nserver2     Ready    control-plane,etcd,master   13m   vX.Y.Z\n"})}),"\n",(0,r.jsxs)(s.p,{children:["Now you have a highly available control plane. Any successfully clustered servers can be used in the ",(0,r.jsx)(s.code,{children:"--server"})," argument to join additional server and worker nodes. Joining additional worker nodes to the cluster follows the same procedure as a single server cluster."]}),"\n",(0,r.jsx)(s.p,{children:"There are a few config flags that must be the same in all server nodes:"}),"\n",(0,r.jsxs)(s.ul,{children:["\n",(0,r.jsxs)(s.li,{children:["Network related flags: ",(0,r.jsx)(s.code,{children:"--cluster-dns"}),", ",(0,r.jsx)(s.code,{children:"--cluster-domain"}),", ",(0,r.jsx)(s.code,{children:"--cluster-cidr"}),", ",(0,r.jsx)(s.code,{children:"--service-cidr"})]}),"\n",(0,r.jsxs)(s.li,{children:["Flags controlling the deployment of certain components: ",(0,r.jsx)(s.code,{children:"--disable-helm-controller"}),", ",(0,r.jsx)(s.code,{children:"--disable-kube-proxy"}),", ",(0,r.jsx)(s.code,{children:"--disable-network-policy"})," and any component passed to ",(0,r.jsx)(s.code,{children:"--disable"})]}),"\n",(0,r.jsxs)(s.li,{children:["Feature related flags: ",(0,r.jsx)(s.code,{children:"--secrets-encryption"})]}),"\n"]}),"\n",(0,r.jsx)(s.h2,{id:"existing-clusters",children:"Existing clusters"}),"\n",(0,r.jsxs)(s.p,{children:["If you have an existing cluster using the default embedded SQLite database, you can convert it to etcd by simply restarting your K3s server with the ",(0,r.jsx)(s.code,{children:"--cluster-init"})," flag. Once you've done that, you'll be able to add additional instances as described above."]}),"\n",(0,r.jsxs)(s.p,{children:["If an etcd datastore is found on disk either because that node has either initialized or joined a cluster already, the datastore arguments (",(0,r.jsx)(s.code,{children:"--cluster-init"}),", ",(0,r.jsx)(s.code,{children:"--server"}),", ",(0,r.jsx)(s.code,{children:"--datastore-endpoint"}),", etc) are ignored."]}),"\n",(0,r.jsxs)(s.blockquote,{children:["\n",(0,r.jsxs)(s.p,{children:[(0,r.jsx)(s.strong,{children:"Important:"})," K3s v1.22.2 and newer support migration from SQLite to etcd. Older versions will create a new empty datastore if you add ",(0,r.jsx)(s.code,{children:"--cluster-init"})," to an existing server."]}),"\n"]})]})}function h(e={}){const{wrapper:s}={...(0,n.a)(),...e.components};return s?(0,r.jsx)(s,{...e,children:(0,r.jsx)(l,{...e})}):l(e)}},1151:(e,s,t)=>{t.d(s,{Z:()=>a,a:()=>i});var r=t(7294);const n={},d=r.createContext(n);function i(e){const s=r.useContext(d);return r.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function a(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(n):e.components||n:i(e.components),r.createElement(d.Provider,{value:s},e.children)}}}]);