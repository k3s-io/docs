"use strict";(self.webpackChunkk_3_s_docs=self.webpackChunkk_3_s_docs||[]).push([[7813],{3905:(e,t,n)=>{n.d(t,{Zo:()=>c,kt:()=>u});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},o=Object.keys(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var d=a.createContext({}),m=function(e){var t=a.useContext(d),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},c=function(e){var t=m(e.components);return a.createElement(d.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},s=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,o=e.originalType,d=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),s=m(n),u=r,k=s["".concat(d,".").concat(u)]||s[u]||p[u]||o;return n?a.createElement(k,i(i({ref:t},c),{},{components:n})):a.createElement(k,i({ref:t},c))}));function u(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=n.length,i=new Array(o);i[0]=s;var l={};for(var d in t)hasOwnProperty.call(t,d)&&(l[d]=t[d]);l.originalType=e,l.mdxType="string"==typeof e?e:r,i[1]=l;for(var m=2;m<o;m++)i[m]=n[m];return a.createElement.apply(null,i)}return a.createElement.apply(null,n)}s.displayName="MDXCreateElement"},3279:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>d,contentTitle:()=>i,default:()=>p,frontMatter:()=>o,metadata:()=>l,toc:()=>m});var a=n(3117),r=(n(7294),n(3905));const o={title:"CLI Tools",weight:1},i=void 0,l={unversionedId:"cli/cli",id:"cli/cli",title:"CLI Tools",description:"The K3s binary contains a number of additional tools the help you manage your cluster.",source:"@site/docs/cli/cli.md",sourceDirName:"cli",slug:"/cli/",permalink:"/cli/",draft:!1,editUrl:"https://github.com/k3s-io/docs/edit/main/docs/cli/cli.md",tags:[],version:"current",lastUpdatedAt:1685608136,formattedLastUpdatedAt:"Jun 1, 2023",frontMatter:{title:"CLI Tools",weight:1},sidebar:"mySidebar",previous:{title:"FAQ",permalink:"/faq/"},next:{title:"server",permalink:"/cli/server"}},d={},m=[],c={toc:m};function p(e){let{components:t,...n}=e;return(0,r.kt)("wrapper",(0,a.Z)({},c,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("p",null,"The K3s binary contains a number of additional tools the help you manage your cluster."),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:null},"Command"),(0,r.kt)("th",{parentName:"tr",align:null},"Description"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"k3s server")),(0,r.kt)("td",{parentName:"tr",align:null},"Run a K3s server node, which launches the Kubernetes ",(0,r.kt)("inlineCode",{parentName:"td"},"apiserver"),", ",(0,r.kt)("inlineCode",{parentName:"td"},"scheduler"),", ",(0,r.kt)("inlineCode",{parentName:"td"},"controller-manager"),", and ",(0,r.kt)("inlineCode",{parentName:"td"},"cloud-controller-manager")," components, in addition a datastore and the agent components. See the ",(0,r.kt)("a",{parentName:"td",href:"/cli/server"},(0,r.kt)("inlineCode",{parentName:"a"},"k3s server")," command documentation")," for more information.")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"k3s agent")),(0,r.kt)("td",{parentName:"tr",align:null},"Run the K3s agent node, which launches ",(0,r.kt)("inlineCode",{parentName:"td"},"containerd"),", ",(0,r.kt)("inlineCode",{parentName:"td"},"flannel"),", ",(0,r.kt)("inlineCode",{parentName:"td"},"kube-router")," network policy controller, and the Kubernetes ",(0,r.kt)("inlineCode",{parentName:"td"},"kubelet")," and ",(0,r.kt)("inlineCode",{parentName:"td"},"kube-proxy")," components. See the ",(0,r.kt)("a",{parentName:"td",href:"/cli/agent"},(0,r.kt)("inlineCode",{parentName:"a"},"k3s agent")," command documentation")," for more information.")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"k3s kubectl")),(0,r.kt)("td",{parentName:"tr",align:null},"Run the embedded ",(0,r.kt)("a",{parentName:"td",href:"https://kubernetes.io/docs/reference/kubectl"},(0,r.kt)("inlineCode",{parentName:"a"},"kubectl")," command"),". This is a CLI for interacting with the Kubernetes apiserver.  If the ",(0,r.kt)("inlineCode",{parentName:"td"},"KUBECONFIG")," environment variable is not set, this will automatically attempt to use the kubeconfig at ",(0,r.kt)("inlineCode",{parentName:"td"},"/etc/rancher/k3s/k3s.yaml"),".")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"k3s crictl")),(0,r.kt)("td",{parentName:"tr",align:null},"Run the embedded ",(0,r.kt)("a",{parentName:"td",href:"https://github.com/kubernetes-sigs/cri-tools/blob/master/docs/crictl.md"},(0,r.kt)("inlineCode",{parentName:"a"},"crictl")," command"),". This is a CLI for interacting with Kubernetes's container runtime interface (CRI). Useful for debugging.")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"k3s ctr")),(0,r.kt)("td",{parentName:"tr",align:null},"Run the embedded ",(0,r.kt)("a",{parentName:"td",href:"https://github.com/projectatomic/containerd/blob/master/docs/cli.md"},(0,r.kt)("inlineCode",{parentName:"a"},"ctr")," command"),". This is a CLI for containerd, the container daemon used by K3s. Useful for debugging.")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"k3s token")),(0,r.kt)("td",{parentName:"tr",align:null},"Manage bootstrap tokens. See the ",(0,r.kt)("a",{parentName:"td",href:"/cli/token"},(0,r.kt)("inlineCode",{parentName:"a"},"k3s token")," command documentation")," for more information.")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"k3s etcd-snapshot")),(0,r.kt)("td",{parentName:"tr",align:null},"Perform on demand backups of the K3s cluster data and upload to S3. See the ",(0,r.kt)("a",{parentName:"td",href:"/cli/etcd-snapshot"},(0,r.kt)("inlineCode",{parentName:"a"},"k3s etcd-snapshot")," command documentation")," for more information.")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"k3s secrets-encrypt")),(0,r.kt)("td",{parentName:"tr",align:null},"Configure K3s to encrypt secrets when storing them in the cluster. See the ",(0,r.kt)("a",{parentName:"td",href:"/cli/secrets-encrypt"},(0,r.kt)("inlineCode",{parentName:"a"},"k3s secrets-encrypt")," command documentation")," for more information.")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"k3s certificate")),(0,r.kt)("td",{parentName:"tr",align:null},"Manage K3s certificates. See the ",(0,r.kt)("a",{parentName:"td",href:"/cli/certificate"},(0,r.kt)("inlineCode",{parentName:"a"},"k3s certificate")," command documentation")," for more information.")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"k3s completion")),(0,r.kt)("td",{parentName:"tr",align:null},"Generate shell completion scripts for k3s")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"k3s help")),(0,r.kt)("td",{parentName:"tr",align:null},"Shows a list of commands or help for one command")))))}p.isMDXComponent=!0}}]);