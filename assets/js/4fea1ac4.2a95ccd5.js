"use strict";(self.webpackChunkk_3_s_docs=self.webpackChunkk_3_s_docs||[]).push([[8768],{2444:(n,e,t)=>{t.r(e),t.d(e,{assets:()=>r,contentTitle:()=>o,default:()=>u,frontMatter:()=>l,metadata:()=>s,toc:()=>d});const s=JSON.parse('{"id":"installation/uninstall","title":"Uninstalling K3s","description":"Uninstalling K3s may cause data loss!","source":"@site/docs/installation/uninstall.md","sourceDirName":"installation","slug":"/installation/uninstall","permalink":"/installation/uninstall","draft":false,"unlisted":false,"editUrl":"https://github.com/k3s-io/docs/edit/main/docs/installation/uninstall.md","tags":[],"version":"current","lastUpdatedAt":1730828472000,"frontMatter":{"title":"Uninstalling K3s"},"sidebar":"mySidebar","previous":{"title":"Managing Packaged Components","permalink":"/installation/packaged-components"},"next":{"title":"Cluster Datastore","permalink":"/datastore/"}}');var a=t(4848),i=t(8453);const l={title:"Uninstalling K3s"},o=void 0,r={},d=[{value:"Uninstalling Servers",id:"uninstalling-servers",level:3},{value:"Uninstalling Agents",id:"uninstalling-agents",level:3}];function c(n){const e={a:"a",admonition:"admonition",code:"code",h3:"h3",p:"p",pre:"pre",...(0,i.R)(),...n.components};return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(e.admonition,{type:"warning",children:(0,a.jsx)(e.p,{children:"Uninstalling K3s may cause data loss!"})}),"\n",(0,a.jsx)(e.p,{children:"If you installed K3s using the installation script, a script to uninstall K3s was generated during installation."}),"\n",(0,a.jsxs)(e.p,{children:["Running the uninstall script stops K3s and all running pods, and deletes the local cluster datastore, ",(0,a.jsx)(e.a,{href:"/storage#setting-up-the-local-storage-provider",children:"Local Storage"})," Persistent Volume data, node configuration, and all of the scripts and CLI tools.\nIt does not remove any data from external datastores, or created by pods using external Kubernetes Persistent Volumes."]}),"\n",(0,a.jsxs)(e.p,{children:["If you are planning on rejoining a node to an existing cluster after uninstalling and reinstalling, be sure to delete the node from the cluster to ensure that the node password secret is removed. See the ",(0,a.jsx)(e.a,{href:"/architecture#how-agent-node-registration-works",children:"Node Registration"})," documentation for more information."]}),"\n",(0,a.jsx)(e.h3,{id:"uninstalling-servers",children:"Uninstalling Servers"}),"\n",(0,a.jsx)(e.p,{children:"To uninstall K3s from a server node, run:"}),"\n",(0,a.jsx)(e.pre,{children:(0,a.jsx)(e.code,{className:"language-bash",children:"/usr/local/bin/k3s-uninstall.sh\n"})}),"\n",(0,a.jsx)(e.h3,{id:"uninstalling-agents",children:"Uninstalling Agents"}),"\n",(0,a.jsx)(e.p,{children:"To uninstall K3s from an agent node, run:"}),"\n",(0,a.jsx)(e.pre,{children:(0,a.jsx)(e.code,{className:"language-bash",children:"/usr/local/bin/k3s-agent-uninstall.sh\n"})})]})}function u(n={}){const{wrapper:e}={...(0,i.R)(),...n.components};return e?(0,a.jsx)(e,{...n,children:(0,a.jsx)(c,{...n})}):c(n)}},8453:(n,e,t)=>{t.d(e,{R:()=>l,x:()=>o});var s=t(6540);const a={},i=s.createContext(a);function l(n){const e=s.useContext(i);return s.useMemo((function(){return"function"==typeof n?n(e):{...e,...n}}),[e,n])}function o(n){let e;return e=n.disableParentContext?"function"==typeof n.components?n.components(a):n.components||a:l(n.components),s.createElement(i.Provider,{value:e},n.children)}}}]);