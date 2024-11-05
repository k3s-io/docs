"use strict";(self.webpackChunkk_3_s_docs=self.webpackChunkk_3_s_docs||[]).push([[9030],{3170:(e,s,c)=>{c.r(s),c.d(s,{assets:()=>l,contentTitle:()=>i,default:()=>j,frontMatter:()=>n,metadata:()=>r,toc:()=>o});const r=JSON.parse('{"id":"cli/cli","title":"CLI\u30c4\u30fc\u30eb","description":"K3s\u30d0\u30a4\u30ca\u30ea\u306b\u306f\u3001\u30af\u30e9\u30b9\u30bf\u30fc\u3092\u7ba1\u7406\u3059\u308b\u305f\u3081\u306e\u8ffd\u52a0\u30c4\u30fc\u30eb\u304c\u591a\u6570\u542b\u307e\u308c\u3066\u3044\u307e\u3059\u3002","source":"@site/i18n/ja/docusaurus-plugin-content-docs/current/cli/cli.md","sourceDirName":"cli","slug":"/cli/","permalink":"/ja/cli/","draft":false,"unlisted":false,"editUrl":"https://github.com/k3s-io/docs/edit/main/docs/cli/cli.md","tags":[],"version":"current","lastUpdatedAt":1730828472000,"frontMatter":{"title":"CLI\u30c4\u30fc\u30eb"},"sidebar":"mySidebar","previous":{"title":"CIS 1.24 \u81ea\u5df1\u8a55\u4fa1\u30ac\u30a4\u30c9","permalink":"/ja/security/self-assessment-1.24"},"next":{"title":"server","permalink":"/ja/cli/server"}}');var t=c(4848),d=c(8453);const n={title:"CLI\u30c4\u30fc\u30eb"},i=void 0,l={},o=[];function h(e){const s={a:"a",code:"code",p:"p",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",...(0,d.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(s.p,{children:"K3s\u30d0\u30a4\u30ca\u30ea\u306b\u306f\u3001\u30af\u30e9\u30b9\u30bf\u30fc\u3092\u7ba1\u7406\u3059\u308b\u305f\u3081\u306e\u8ffd\u52a0\u30c4\u30fc\u30eb\u304c\u591a\u6570\u542b\u307e\u308c\u3066\u3044\u307e\u3059\u3002"}),"\n",(0,t.jsxs)(s.table,{children:[(0,t.jsx)(s.thead,{children:(0,t.jsxs)(s.tr,{children:[(0,t.jsx)(s.th,{children:"\u30b3\u30de\u30f3\u30c9"}),(0,t.jsx)(s.th,{children:"\u8aac\u660e"})]})}),(0,t.jsxs)(s.tbody,{children:[(0,t.jsxs)(s.tr,{children:[(0,t.jsx)(s.td,{children:(0,t.jsx)(s.code,{children:"k3s server"})}),(0,t.jsxs)(s.td,{children:["K3s\u30b5\u30fc\u30d0\u30fc\u30ce\u30fc\u30c9\u3092\u5b9f\u884c\u3057\u3001Kubernetes\u306e",(0,t.jsx)(s.code,{children:"apiserver"}),"\u3001",(0,t.jsx)(s.code,{children:"scheduler"}),"\u3001",(0,t.jsx)(s.code,{children:"controller-manager"}),"\u3001\u304a\u3088\u3073",(0,t.jsx)(s.code,{children:"cloud-controller-manager"}),"\u30b3\u30f3\u30dd\u30fc\u30cd\u30f3\u30c8\u306b\u52a0\u3048\u3066\u3001\u30c7\u30fc\u30bf\u30b9\u30c8\u30a2\u3068\u30a8\u30fc\u30b8\u30a7\u30f3\u30c8\u30b3\u30f3\u30dd\u30fc\u30cd\u30f3\u30c8\u3092\u8d77\u52d5\u3057\u307e\u3059\u3002\u8a73\u7d30\u306f",(0,t.jsxs)(s.a,{href:"/ja/cli/server",children:[(0,t.jsx)(s.code,{children:"k3s server"}),"\u30b3\u30de\u30f3\u30c9\u306e\u30c9\u30ad\u30e5\u30e1\u30f3\u30c8"]}),"\u3092\u53c2\u7167\u3057\u3066\u304f\u3060\u3055\u3044\u3002"]})]}),(0,t.jsxs)(s.tr,{children:[(0,t.jsx)(s.td,{children:(0,t.jsx)(s.code,{children:"k3s agent"})}),(0,t.jsxs)(s.td,{children:["K3s\u30a8\u30fc\u30b8\u30a7\u30f3\u30c8\u30ce\u30fc\u30c9\u3092\u5b9f\u884c\u3057\u3001",(0,t.jsx)(s.code,{children:"containerd"}),"\u3001",(0,t.jsx)(s.code,{children:"flannel"}),"\u3001",(0,t.jsx)(s.code,{children:"kube-router"}),"\u30cd\u30c3\u30c8\u30ef\u30fc\u30af\u30dd\u30ea\u30b7\u30fc\u30b3\u30f3\u30c8\u30ed\u30fc\u30e9\u30fc\u3001\u304a\u3088\u3073Kubernetes\u306e",(0,t.jsx)(s.code,{children:"kubelet"}),"\u3068",(0,t.jsx)(s.code,{children:"kube-proxy"}),"\u30b3\u30f3\u30dd\u30fc\u30cd\u30f3\u30c8\u3092\u8d77\u52d5\u3057\u307e\u3059\u3002\u8a73\u7d30\u306f",(0,t.jsxs)(s.a,{href:"/ja/cli/agent",children:[(0,t.jsx)(s.code,{children:"k3s agent"}),"\u30b3\u30de\u30f3\u30c9\u306e\u30c9\u30ad\u30e5\u30e1\u30f3\u30c8"]}),"\u3092\u53c2\u7167\u3057\u3066\u304f\u3060\u3055\u3044\u3002"]})]}),(0,t.jsxs)(s.tr,{children:[(0,t.jsx)(s.td,{children:(0,t.jsx)(s.code,{children:"k3s kubectl"})}),(0,t.jsxs)(s.td,{children:["\u7d44\u307f\u8fbc\u307f\u306e",(0,t.jsxs)(s.a,{href:"https://kubernetes.io/docs/reference/kubectl",children:[(0,t.jsx)(s.code,{children:"kubectl"}),"\u30b3\u30de\u30f3\u30c9"]}),"\u3092\u5b9f\u884c\u3057\u307e\u3059\u3002\u3053\u308c\u306fKubernetes\u306eapiserver\u3068\u5bfe\u8a71\u3059\u308b\u305f\u3081\u306eCLI\u3067\u3059\u3002",(0,t.jsx)(s.code,{children:"KUBECONFIG"}),"\u74b0\u5883\u5909\u6570\u304c\u8a2d\u5b9a\u3055\u308c\u3066\u3044\u306a\u3044\u5834\u5408\u3001\u81ea\u52d5\u7684\u306b",(0,t.jsx)(s.code,{children:"/etc/rancher/k3s/k3s.yaml"}),"\u306ekubeconfig\u3092\u4f7f\u7528\u3057\u3088\u3046\u3068\u3057\u307e\u3059\u3002"]})]}),(0,t.jsxs)(s.tr,{children:[(0,t.jsx)(s.td,{children:(0,t.jsx)(s.code,{children:"k3s crictl"})}),(0,t.jsxs)(s.td,{children:["\u7d44\u307f\u8fbc\u307f\u306e",(0,t.jsxs)(s.a,{href:"https://github.com/kubernetes-sigs/cri-tools/blob/master/docs/crictl.md",children:[(0,t.jsx)(s.code,{children:"crictl"}),"\u30b3\u30de\u30f3\u30c9"]}),"\u3092\u5b9f\u884c\u3057\u307e\u3059\u3002\u3053\u308c\u306fKubernetes\u306e\u30b3\u30f3\u30c6\u30ca\u30e9\u30f3\u30bf\u30a4\u30e0\u30a4\u30f3\u30bf\u30fc\u30d5\u30a7\u30fc\u30b9\uff08CRI\uff09\u3068\u5bfe\u8a71\u3059\u308b\u305f\u3081\u306eCLI\u3067\u3059\u3002\u30c7\u30d0\u30c3\u30b0\u306b\u4fbf\u5229\u3067\u3059\u3002"]})]}),(0,t.jsxs)(s.tr,{children:[(0,t.jsx)(s.td,{children:(0,t.jsx)(s.code,{children:"k3s ctr"})}),(0,t.jsxs)(s.td,{children:["\u7d44\u307f\u8fbc\u307f\u306e",(0,t.jsxs)(s.a,{href:"https://github.com/projectatomic/containerd/blob/master/docs/cli.md",children:[(0,t.jsx)(s.code,{children:"ctr"}),"\u30b3\u30de\u30f3\u30c9"]}),"\u3092\u5b9f\u884c\u3057\u307e\u3059\u3002\u3053\u308c\u306fK3s\u3067\u4f7f\u7528\u3055\u308c\u308b\u30b3\u30f3\u30c6\u30ca\u30c7\u30fc\u30e2\u30f3\u3067\u3042\u308bcontainerd\u306eCLI\u3067\u3059\u3002\u30c7\u30d0\u30c3\u30b0\u306b\u4fbf\u5229\u3067\u3059\u3002"]})]}),(0,t.jsxs)(s.tr,{children:[(0,t.jsx)(s.td,{children:(0,t.jsx)(s.code,{children:"k3s token"})}),(0,t.jsxs)(s.td,{children:["\u30d6\u30fc\u30c8\u30b9\u30c8\u30e9\u30c3\u30d7\u30c8\u30fc\u30af\u30f3\u3092\u7ba1\u7406\u3057\u307e\u3059\u3002\u8a73\u7d30\u306f",(0,t.jsxs)(s.a,{href:"/ja/cli/token",children:[(0,t.jsx)(s.code,{children:"k3s token"}),"\u30b3\u30de\u30f3\u30c9\u306e\u30c9\u30ad\u30e5\u30e1\u30f3\u30c8"]}),"\u3092\u53c2\u7167\u3057\u3066\u304f\u3060\u3055\u3044\u3002"]})]}),(0,t.jsxs)(s.tr,{children:[(0,t.jsx)(s.td,{children:(0,t.jsx)(s.code,{children:"k3s etcd-snapshot"})}),(0,t.jsxs)(s.td,{children:["K3s\u30af\u30e9\u30b9\u30bf\u30fc\u306e\u30c7\u30fc\u30bf\u306e\u30aa\u30f3\u30c7\u30de\u30f3\u30c9\u30d0\u30c3\u30af\u30a2\u30c3\u30d7\u3092\u5b9f\u884c\u3057\u3001S3\u306b\u30a2\u30c3\u30d7\u30ed\u30fc\u30c9\u3057\u307e\u3059\u3002\u8a73\u7d30\u306f",(0,t.jsxs)(s.a,{href:"/ja/cli/etcd-snapshot",children:[(0,t.jsx)(s.code,{children:"k3s etcd-snapshot"}),"\u30b3\u30de\u30f3\u30c9\u306e\u30c9\u30ad\u30e5\u30e1\u30f3\u30c8"]}),"\u3092\u53c2\u7167\u3057\u3066\u304f\u3060\u3055\u3044\u3002"]})]}),(0,t.jsxs)(s.tr,{children:[(0,t.jsx)(s.td,{children:(0,t.jsx)(s.code,{children:"k3s secrets-encrypt"})}),(0,t.jsxs)(s.td,{children:["K3s\u3092\u69cb\u6210\u3057\u3066\u3001\u30af\u30e9\u30b9\u30bf\u30fc\u306b\u4fdd\u5b58\u3059\u308b\u969b\u306b\u30b7\u30fc\u30af\u30ec\u30c3\u30c8\u3092\u6697\u53f7\u5316\u3057\u307e\u3059\u3002\u8a73\u7d30\u306f",(0,t.jsxs)(s.a,{href:"/ja/cli/secrets-encrypt",children:[(0,t.jsx)(s.code,{children:"k3s secrets-encrypt"}),"\u30b3\u30de\u30f3\u30c9\u306e\u30c9\u30ad\u30e5\u30e1\u30f3\u30c8"]}),"\u3092\u53c2\u7167\u3057\u3066\u304f\u3060\u3055\u3044\u3002"]})]}),(0,t.jsxs)(s.tr,{children:[(0,t.jsx)(s.td,{children:(0,t.jsx)(s.code,{children:"k3s certificate"})}),(0,t.jsxs)(s.td,{children:["K3s\u8a3c\u660e\u66f8\u3092\u7ba1\u7406\u3057\u307e\u3059\u3002\u8a73\u7d30\u306f",(0,t.jsxs)(s.a,{href:"/ja/cli/certificate",children:[(0,t.jsx)(s.code,{children:"k3s certificate"}),"\u30b3\u30de\u30f3\u30c9\u306e\u30c9\u30ad\u30e5\u30e1\u30f3\u30c8"]}),"\u3092\u53c2\u7167\u3057\u3066\u304f\u3060\u3055\u3044\u3002"]})]}),(0,t.jsxs)(s.tr,{children:[(0,t.jsx)(s.td,{children:(0,t.jsx)(s.code,{children:"k3s completion"})}),(0,t.jsx)(s.td,{children:"k3s\u306e\u30b7\u30a7\u30eb\u88dc\u5b8c\u30b9\u30af\u30ea\u30d7\u30c8\u3092\u751f\u6210\u3057\u307e\u3059\u3002"})]}),(0,t.jsxs)(s.tr,{children:[(0,t.jsx)(s.td,{children:(0,t.jsx)(s.code,{children:"k3s help"})}),(0,t.jsx)(s.td,{children:"\u30b3\u30de\u30f3\u30c9\u306e\u30ea\u30b9\u30c8\u307e\u305f\u306f1\u3064\u306e\u30b3\u30de\u30f3\u30c9\u306e\u30d8\u30eb\u30d7\u3092\u8868\u793a\u3057\u307e\u3059\u3002"})]})]})]})]})}function j(e={}){const{wrapper:s}={...(0,d.R)(),...e.components};return s?(0,t.jsx)(s,{...e,children:(0,t.jsx)(h,{...e})}):h(e)}},8453:(e,s,c)=>{c.d(s,{R:()=>n,x:()=>i});var r=c(6540);const t={},d=r.createContext(t);function n(e){const s=r.useContext(d);return r.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function i(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:n(e.components),r.createElement(d.Provider,{value:s},e.children)}}}]);