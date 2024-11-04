"use strict";(self.webpackChunkk_3_s_docs=self.webpackChunkk_3_s_docs||[]).push([[2745],{7803:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>o,contentTitle:()=>r,default:()=>c,frontMatter:()=>a,metadata:()=>l,toc:()=>d});var s=t(5893),i=t(1151);const a={title:"Manual Upgrades"},r=void 0,l={id:"upgrades/manual",title:"Manual Upgrades",description:"You can upgrade K3s by using the installation script, or by manually installing the binary of the desired version.",source:"@site/docs/upgrades/manual.md",sourceDirName:"upgrades",slug:"/upgrades/manual",permalink:"/upgrades/manual",draft:!1,unlisted:!1,editUrl:"https://github.com/k3s-io/docs/edit/main/docs/upgrades/manual.md",tags:[],version:"current",lastUpdatedAt:1730740055e3,frontMatter:{title:"Manual Upgrades"},sidebar:"mySidebar",previous:{title:"Stopping K3s",permalink:"/upgrades/killall"},next:{title:"Automated Upgrades",permalink:"/upgrades/automated"}},o={},d=[{value:"Release Channels",id:"release-channels",level:3},{value:"Upgrade K3s Using the Installation Script",id:"upgrade-k3s-using-the-installation-script",level:3},{value:"Upgrade K3s Using the Binary",id:"upgrade-k3s-using-the-binary",level:3}];function h(e){const n={a:"a",admonition:"admonition",code:"code",h3:"h3",li:"li",mdxAdmonitionTitle:"mdxAdmonitionTitle",ol:"ol",p:"p",pre:"pre",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",...(0,i.a)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.p,{children:"You can upgrade K3s by using the installation script, or by manually installing the binary of the desired version."}),"\n",(0,s.jsx)(n.admonition,{type:"note",children:(0,s.jsx)(n.p,{children:"When upgrading, upgrade server nodes first one at a time, then any agent nodes."})}),"\n",(0,s.jsx)(n.h3,{id:"release-channels",children:"Release Channels"}),"\n",(0,s.jsxs)(n.p,{children:["Upgrades performed via the installation script or using our ",(0,s.jsx)(n.a,{href:"/upgrades/automated",children:"automated upgrades"})," feature can be tied to different release channels. The following channels are available:"]}),"\n",(0,s.jsxs)(n.table,{children:[(0,s.jsx)(n.thead,{children:(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.th,{children:"Channel"}),(0,s.jsx)(n.th,{children:"Description"})]})}),(0,s.jsxs)(n.tbody,{children:[(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{children:"stable"}),(0,s.jsx)(n.td,{children:"(Default) Stable is recommended for production environments. These releases have been through a period of community hardening."})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{children:"latest"}),(0,s.jsx)(n.td,{children:"Latest is recommended for trying out the latest features.  These releases have not yet been through a period of community hardening."})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{children:"v1.26 (example)"}),(0,s.jsx)(n.td,{children:"There is a release channel tied to each Kubernetes minor version, including versions that are end-of-life. These channels will select the latest patch available, not necessarily a stable release."})]})]})]}),"\n",(0,s.jsxs)(n.p,{children:["For an exhaustive and up-to-date list of channels, you can visit the ",(0,s.jsx)(n.a,{href:"https://update.k3s.io/v1-release/channels",children:"k3s channel service API"}),". For more technical details on how channels work, you see the ",(0,s.jsx)(n.a,{href:"https://github.com/rancher/channelserver",children:"channelserver project"}),"."]}),"\n",(0,s.jsx)(n.admonition,{type:"tip",children:(0,s.jsxs)(n.p,{children:["When attempting to upgrade to a new version of K3s, the ",(0,s.jsx)(n.a,{href:"https://kubernetes.io/releases/version-skew-policy/",children:"Kubernetes version skew policy"})," applies. Ensure that your plan does not skip intermediate minor versions when upgrading. The system-upgrade-controller itself will not protect against unsupported changes to the Kubernetes version."]})}),"\n",(0,s.jsx)(n.h3,{id:"upgrade-k3s-using-the-installation-script",children:"Upgrade K3s Using the Installation Script"}),"\n",(0,s.jsx)(n.p,{children:"To upgrade K3s from an older version you can re-run the installation script using the same configuration options you originally used when running the install script."}),"\n",(0,s.jsxs)(n.admonition,{title:"Note",type:"info",children:[(0,s.jsxs)(n.p,{children:["The ",(0,s.jsx)(n.code,{children:"INSTALL_K3S_EXEC"})," variable, ",(0,s.jsx)(n.code,{children:"K3S_"})," variables, and trailing shell arguments are all used by the install script to generate the systemd unit and environment file.\nIf you set configuration when originally running the install script, but do not set it again when re-running the install script, the original values will be lost."]}),(0,s.jsxs)(n.p,{children:["The contents of the ",(0,s.jsx)(n.a,{href:"/installation/configuration#configuration-file",children:"configuration file"})," are not managed by the install script.\nIf you want your configuration to be independent from the install script, you should use a configuration file instead of passing environment variables or arguments to the install script."]})]}),"\n",(0,s.jsx)(n.p,{children:"Running the install script will:"}),"\n",(0,s.jsxs)(n.ol,{children:["\n",(0,s.jsx)(n.li,{children:"Download the new k3s binary"}),"\n",(0,s.jsx)(n.li,{children:"Update the systemd unit or openrc init script to reflect the args passed to the install script"}),"\n",(0,s.jsx)(n.li,{children:"Restart the k3s service"}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:"For example, to upgrade to the current stable release:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-sh",children:"curl -sfL https://get.k3s.io | <EXISTING_K3S_ENV> sh -s - <EXISTING_K3S_ARGS>\n"})}),"\n",(0,s.jsx)(n.p,{children:"If you want to upgrade to a newer version in a specific channel (such as latest) you can specify the channel:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-sh",children:"curl -sfL https://get.k3s.io | INSTALL_K3S_CHANNEL=latest <EXISTING_K3S_ENV> sh -s - <EXISTING_K3S_ARGS>\n"})}),"\n",(0,s.jsx)(n.p,{children:"If you want to upgrade to a specific version you can run the following command:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-sh",children:"curl -sfL https://get.k3s.io | INSTALL_K3S_VERSION=vX.Y.Z+k3s1 <EXISTING_K3S_ENV> sh -s - <EXISTING_K3S_ARGS>\n"})}),"\n",(0,s.jsxs)(n.admonition,{type:"tip",children:[(0,s.jsx)(n.mdxAdmonitionTitle,{}),(0,s.jsxs)(n.p,{children:["If you want to download the new version of k3s, but not start it, you can use the ",(0,s.jsx)(n.code,{children:"INSTALL_K3S_SKIP_START=true"})," environment variable."]})]}),"\n",(0,s.jsx)(n.h3,{id:"upgrade-k3s-using-the-binary",children:"Upgrade K3s Using the Binary"}),"\n",(0,s.jsx)(n.p,{children:"To upgrade K3s manually, you can download the desired version of the K3s binary and replace the existing binary with the new one."}),"\n",(0,s.jsxs)(n.ol,{children:["\n",(0,s.jsxs)(n.li,{children:["Download the desired version of the K3s binary from ",(0,s.jsx)(n.a,{href:"https://github.com/k3s-io/k3s/releases",children:"releases"})]}),"\n",(0,s.jsxs)(n.li,{children:["Copy the downloaded binary to ",(0,s.jsx)(n.code,{children:"/usr/local/bin/k3s"})," (or your desired location)"]}),"\n",(0,s.jsx)(n.li,{children:"Stop the old k3s binary"}),"\n",(0,s.jsx)(n.li,{children:"Launch the new k3s binary"}),"\n"]})]})}function c(e={}){const{wrapper:n}={...(0,i.a)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(h,{...e})}):h(e)}},1151:(e,n,t)=>{t.d(n,{Z:()=>l,a:()=>r});var s=t(7294);const i={},a=s.createContext(i);function r(e){const n=s.useContext(a);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function l(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:r(e.components),s.createElement(a.Provider,{value:n},e.children)}}}]);