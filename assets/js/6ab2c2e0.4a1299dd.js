"use strict";(self.webpackChunkk_3_s_docs=self.webpackChunkk_3_s_docs||[]).push([[981],{3905:(e,t,n)=>{n.d(t,{Zo:()=>p,kt:()=>u});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function l(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?l(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):l(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function o(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},l=Object.keys(e);for(a=0;a<l.length;a++)n=l[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(a=0;a<l.length;a++)n=l[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var s=a.createContext({}),d=function(e){var t=a.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},p=function(e){var t=d(e.components);return a.createElement(s.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},c=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,l=e.originalType,s=e.parentName,p=o(e,["components","mdxType","originalType","parentName"]),c=d(n),u=r,k=c["".concat(s,".").concat(u)]||c[u]||m[u]||l;return n?a.createElement(k,i(i({ref:t},p),{},{components:n})):a.createElement(k,i({ref:t},p))}));function u(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var l=n.length,i=new Array(l);i[0]=c;var o={};for(var s in t)hasOwnProperty.call(t,s)&&(o[s]=t[s]);o.originalType=e,o.mdxType="string"==typeof e?e:r,i[1]=o;for(var d=2;d<l;d++)i[d]=n[d];return a.createElement.apply(null,i)}return a.createElement.apply(null,n)}c.displayName="MDXCreateElement"},7473:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>s,contentTitle:()=>i,default:()=>m,frontMatter:()=>l,metadata:()=>o,toc:()=>d});var a=n(3117),r=(n(7294),n(3905));const l={title:"Environment Variables",weight:3},i=void 0,o={unversionedId:"reference/env-variables",id:"reference/env-variables",title:"Environment Variables",description:"As mentioned in the Quick-Start Guide, you can use the installation script available at https://get.k3s.io to install K3s as a service on systemd and openrc based systems.",source:"@site/docs/reference/env-variables.md",sourceDirName:"reference",slug:"/reference/env-variables",permalink:"/reference/env-variables",draft:!1,editUrl:"https://github.com/k3s-io/docs/edit/main/docs/reference/env-variables.md",tags:[],version:"current",lastUpdatedAt:1685608136,formattedLastUpdatedAt:"Jun 1, 2023",frontMatter:{title:"Environment Variables",weight:3},sidebar:"mySidebar",previous:{title:"Reference",permalink:"/reference/"},next:{title:"Resource Profiling",permalink:"/reference/resource-profiling"}},s={},d=[],p={toc:d};function m(e){let{components:t,...n}=e;return(0,r.kt)("wrapper",(0,a.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("p",null,"As mentioned in the ",(0,r.kt)("a",{parentName:"p",href:"/quick-start/"},"Quick-Start Guide"),", you can use the installation script available at ",(0,r.kt)("a",{parentName:"p",href:"https://get.k3s.io"},"https://get.k3s.io")," to install K3s as a service on systemd and openrc based systems."),(0,r.kt)("p",null,"The simplest form of this command is as follows:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"curl -sfL https://get.k3s.io | sh -\n")),(0,r.kt)("p",null,"When using this method to install K3s, the following environment variables can be used to configure the installation:"),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:null},"Environment Variable"),(0,r.kt)("th",{parentName:"tr",align:null},"Description"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"INSTALL_K3S_SKIP_DOWNLOAD")),(0,r.kt)("td",{parentName:"tr",align:null},"If set to true will not download K3s hash or binary.")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"INSTALL_K3S_SYMLINK")),(0,r.kt)("td",{parentName:"tr",align:null},"By default will create symlinks for the kubectl, crictl, and ctr binaries if the commands do not already exist in path. If set to 'skip' will not create symlinks and 'force' will overwrite.")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"INSTALL_K3S_SKIP_ENABLE")),(0,r.kt)("td",{parentName:"tr",align:null},"If set to true will not enable or start K3s service.")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"INSTALL_K3S_SKIP_START")),(0,r.kt)("td",{parentName:"tr",align:null},"If set to true will not start K3s service.")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"INSTALL_K3S_VERSION")),(0,r.kt)("td",{parentName:"tr",align:null},"Version of K3s to download from Github. Will attempt to download from the stable channel if not specified.")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"INSTALL_K3S_BIN_DIR")),(0,r.kt)("td",{parentName:"tr",align:null},"Directory to install K3s binary, links, and uninstall script to, or use ",(0,r.kt)("inlineCode",{parentName:"td"},"/usr/local/bin")," as the default.")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"INSTALL_K3S_BIN_DIR_READ_ONLY")),(0,r.kt)("td",{parentName:"tr",align:null},"If set to true will not write files to ",(0,r.kt)("inlineCode",{parentName:"td"},"INSTALL_K3S_BIN_DIR"),", forces setting ",(0,r.kt)("inlineCode",{parentName:"td"},"INSTALL_K3S_SKIP_DOWNLOAD=true"),".")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"INSTALL_K3S_SYSTEMD_DIR")),(0,r.kt)("td",{parentName:"tr",align:null},"Directory to install systemd service and environment files to, or use ",(0,r.kt)("inlineCode",{parentName:"td"},"/etc/systemd/system")," as the default.")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"INSTALL_K3S_EXEC")),(0,r.kt)("td",{parentName:"tr",align:null},"Command with flags to use for launching K3s in the service. If the command is not specified, and the ",(0,r.kt)("inlineCode",{parentName:"td"},"K3S_URL"),' is set, it will default to "agent." If ',(0,r.kt)("inlineCode",{parentName:"td"},"K3S_URL"),' not set, it will default to "server." For help, refer to ',(0,r.kt)("a",{parentName:"td",href:"/installation/configuration#configuration-with-install-script"},"this example."))),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"INSTALL_K3S_NAME")),(0,r.kt)("td",{parentName:"tr",align:null},"Name of systemd service to create, will default to 'k3s' if running k3s as a server and 'k3s-agent' if running k3s as an agent. If specified the name will be prefixed with 'k3s-'.")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"INSTALL_K3S_TYPE")),(0,r.kt)("td",{parentName:"tr",align:null},"Type of systemd service to create, will default from the K3s exec command if not specified.")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"INSTALL_K3S_SELINUX_WARN")),(0,r.kt)("td",{parentName:"tr",align:null},"If set to true will continue if k3s-selinux policy is not found.")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"INSTALL_K3S_SKIP_SELINUX_RPM")),(0,r.kt)("td",{parentName:"tr",align:null},"If set to true will skip automatic installation of the k3s RPM.")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"INSTALL_K3S_CHANNEL_URL")),(0,r.kt)("td",{parentName:"tr",align:null},"Channel URL for fetching K3s download URL. Defaults to ",(0,r.kt)("a",{parentName:"td",href:"https://update.k3s.io/v1-release/channels"},"https://update.k3s.io/v1-release/channels"),".")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"INSTALL_K3S_CHANNEL")),(0,r.kt)("td",{parentName:"tr",align:null},'Channel to use for fetching K3s download URL. Defaults to "stable". Options include: ',(0,r.kt)("inlineCode",{parentName:"td"},"stable"),", ",(0,r.kt)("inlineCode",{parentName:"td"},"latest"),", ",(0,r.kt)("inlineCode",{parentName:"td"},"testing"),".")))),(0,r.kt)("p",null,"This example shows where to place aforementioned environment variables as options (after the pipe):"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"curl -sfL https://get.k3s.io | INSTALL_K3S_CHANNEL=latest sh -\n")),(0,r.kt)("p",null,"Environment variables which begin with ",(0,r.kt)("inlineCode",{parentName:"p"},"K3S_")," will be preserved for the systemd and openrc services to use."),(0,r.kt)("p",null,"Setting ",(0,r.kt)("inlineCode",{parentName:"p"},"K3S_URL"),' without explicitly setting an exec command will default the command to "agent".'),(0,r.kt)("p",null,"When running the agent, ",(0,r.kt)("inlineCode",{parentName:"p"},"K3S_TOKEN")," must also be set."))}m.isMDXComponent=!0}}]);