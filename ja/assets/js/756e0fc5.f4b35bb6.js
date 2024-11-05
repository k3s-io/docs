"use strict";(self.webpackChunkk_3_s_docs=self.webpackChunkk_3_s_docs||[]).push([[1838],{5186:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>l,contentTitle:()=>o,default:()=>u,frontMatter:()=>i,metadata:()=>r,toc:()=>d});const r=JSON.parse('{"id":"security/secrets-encryption","title":"secret\u306e\u6697\u53f7\u5316","description":"K3s\u306f\u3001\u4fdd\u5b58\u6642\u306esecret\u306e\u6697\u53f7\u5316\u3092\u6709\u52b9\u306b\u3059\u308b\u3053\u3068\u3092\u30b5\u30dd\u30fc\u30c8\u3057\u3066\u3044\u307e\u3059\u3002\u30b5\u30fc\u30d0\u30fc\u3092\u521d\u3081\u3066\u8d77\u52d5\u3059\u308b\u969b\u306b\u3001\u30d5\u30e9\u30b0 --secrets-encryption \u3092\u6e21\u3059\u3068\u3001\u4ee5\u4e0b\u306e\u3053\u3068\u304c\u81ea\u52d5\u7684\u306b\u884c\u308f\u308c\u307e\u3059\uff1a","source":"@site/i18n/ja/docusaurus-plugin-content-docs/current/security/secrets-encryption.md","sourceDirName":"security","slug":"/security/secrets-encryption","permalink":"/ja/security/secrets-encryption","draft":false,"unlisted":false,"editUrl":"https://github.com/k3s-io/docs/edit/main/docs/security/secrets-encryption.md","tags":[],"version":"current","lastUpdatedAt":1730828472000,"frontMatter":{"title":"secret\u306e\u6697\u53f7\u5316"},"sidebar":"mySidebar","previous":{"title":"\u30bb\u30ad\u30e5\u30ea\u30c6\u30a3","permalink":"/ja/security/"},"next":{"title":"CIS \u30cf\u30fc\u30c9\u30cb\u30f3\u30b0\u30ac\u30a4\u30c9","permalink":"/ja/security/hardening-guide"}}');var t=s(4848),c=s(8453);const i={title:"secret\u306e\u6697\u53f7\u5316"},o="secret\u306e\u6697\u53f7\u5316\u8a2d\u5b9a",l={},d=[{value:"secret\u306e\u6697\u53f7\u5316\u30c4\u30fc\u30eb",id:"secret\u306e\u6697\u53f7\u5316\u30c4\u30fc\u30eb",level:2}];function a(e){const n={a:"a",admonition:"admonition",br:"br",code:"code",h1:"h1",h2:"h2",header:"header",li:"li",p:"p",pre:"pre",ul:"ul",...(0,c.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.header,{children:(0,t.jsx)(n.h1,{id:"secret\u306e\u6697\u53f7\u5316\u8a2d\u5b9a",children:"secret\u306e\u6697\u53f7\u5316\u8a2d\u5b9a"})}),"\n",(0,t.jsxs)(n.p,{children:["K3s\u306f\u3001\u4fdd\u5b58\u6642\u306esecret\u306e\u6697\u53f7\u5316\u3092\u6709\u52b9\u306b\u3059\u308b\u3053\u3068\u3092\u30b5\u30dd\u30fc\u30c8\u3057\u3066\u3044\u307e\u3059\u3002\u30b5\u30fc\u30d0\u30fc\u3092\u521d\u3081\u3066\u8d77\u52d5\u3059\u308b\u969b\u306b\u3001\u30d5\u30e9\u30b0 ",(0,t.jsx)(n.code,{children:"--secrets-encryption"})," \u3092\u6e21\u3059\u3068\u3001\u4ee5\u4e0b\u306e\u3053\u3068\u304c\u81ea\u52d5\u7684\u306b\u884c\u308f\u308c\u307e\u3059\uff1a"]}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:"AES-CBC\u30ad\u30fc\u306e\u751f\u6210"}),"\n",(0,t.jsx)(n.li,{children:"\u751f\u6210\u3055\u308c\u305f\u30ad\u30fc\u3092\u4f7f\u7528\u3057\u3066\u6697\u53f7\u5316\u8a2d\u5b9a\u30d5\u30a1\u30a4\u30eb\u306e\u751f\u6210"}),"\n",(0,t.jsx)(n.li,{children:"\u6697\u53f7\u5316\u8a2d\u5b9a\u30d5\u30a1\u30a4\u30eb\u3092KubeAPI\u306b\u6697\u53f7\u5316\u30d7\u30ed\u30d0\u30a4\u30c0\u30fc\u8a2d\u5b9a\u3068\u3057\u3066\u6e21\u3059"}),"\n"]}),"\n",(0,t.jsx)(n.admonition,{type:"tip",children:(0,t.jsxs)(n.p,{children:["secret\u306e\u6697\u53f7\u5316\u306f\u3001\u30b5\u30fc\u30d0\u30fc\u3092\u518d\u8d77\u52d5\u305b\u305a\u306b\u65e2\u5b58\u306e\u30b5\u30fc\u30d0\u30fc\u3067\u6709\u52b9\u306b\u3059\u308b\u3053\u3068\u306f\u3067\u304d\u307e\u305b\u3093\u3002",(0,t.jsx)(n.br,{}),"\n","\u30b9\u30af\u30ea\u30d7\u30c8\u304b\u3089\u30a4\u30f3\u30b9\u30c8\u30fc\u30eb\u3059\u308b\u5834\u5408\u306f ",(0,t.jsx)(n.code,{children:"curl -sfL https://get.k3s.io | sh -s - server --secrets-encryption"})," \u3092\u4f7f\u7528\u3059\u308b\u304b\u3001",(0,t.jsx)(n.a,{href:"/ja/installation/configuration#configuration-with-install-script",children:"\u8a2d\u5b9a\u30aa\u30d7\u30b7\u30e7\u30f3"}),"\u306b\u8a18\u8f09\u3055\u308c\u3066\u3044\u308b\u4ed6\u306e\u65b9\u6cd5\u3092\u4f7f\u7528\u3057\u3066\u304f\u3060\u3055\u3044\u3002"]})}),"\n",(0,t.jsx)(n.p,{children:"\u6697\u53f7\u5316\u8a2d\u5b9a\u30d5\u30a1\u30a4\u30eb\u306e\u4f8b\uff1a"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-json",children:'{\n  "kind": "EncryptionConfiguration",\n  "apiVersion": "apiserver.config.k8s.io/v1",\n  "resources": [\n    {\n      "resources": [\n        "secrets"\n      ],\n      "providers": [\n        {\n          "aescbc": {\n            "keys": [\n              {\n                "name": "aescbckey",\n                "secret": "xxxxxxxxxxxxxxxxxxx"\n              }\n            ]\n          }\n        },\n        {\n          "identity": {}\n        }\n      ]\n    }\n  ]\n}\n'})}),"\n",(0,t.jsx)(n.h2,{id:"secret\u306e\u6697\u53f7\u5316\u30c4\u30fc\u30eb",children:"secret\u306e\u6697\u53f7\u5316\u30c4\u30fc\u30eb"}),"\n",(0,t.jsxs)(n.p,{children:["K3s\u306b\u306f ",(0,t.jsx)(n.code,{children:"secrets-encrypt"})," \u3068\u3044\u3046\u30e6\u30fc\u30c6\u30a3\u30ea\u30c6\u30a3\u30c4\u30fc\u30eb\u304c\u542b\u307e\u308c\u3066\u304a\u308a\u3001\u4ee5\u4e0b\u306e\u81ea\u52d5\u5236\u5fa1\u3092\u53ef\u80fd\u306b\u3057\u307e\u3059\uff1a"]}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:"secret\u306e\u6697\u53f7\u5316\u306e\u7121\u52b9\u5316/\u6709\u52b9\u5316"}),"\n",(0,t.jsx)(n.li,{children:"\u65b0\u3057\u3044\u6697\u53f7\u5316\u30ad\u30fc\u306e\u8ffd\u52a0"}),"\n",(0,t.jsx)(n.li,{children:"\u6697\u53f7\u5316\u30ad\u30fc\u306e\u30ed\u30fc\u30c6\u30fc\u30b7\u30e7\u30f3\u304a\u3088\u3073\u524a\u9664"}),"\n",(0,t.jsx)(n.li,{children:"secret\u306e\u518d\u6697\u53f7\u5316"}),"\n"]}),"\n",(0,t.jsxs)(n.p,{children:["\u8a73\u7d30\u306b\u3064\u3044\u3066\u306f\u3001",(0,t.jsxs)(n.a,{href:"/ja/cli/secrets-encrypt",children:[(0,t.jsx)(n.code,{children:"k3s secrets-encrypt"})," \u30b3\u30de\u30f3\u30c9\u306e\u30c9\u30ad\u30e5\u30e1\u30f3\u30c8"]}),"\u3092\u53c2\u7167\u3057\u3066\u304f\u3060\u3055\u3044\u3002"]})]})}function u(e={}){const{wrapper:n}={...(0,c.R)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(a,{...e})}):a(e)}},8453:(e,n,s)=>{s.d(n,{R:()=>i,x:()=>o});var r=s(6540);const t={},c=r.createContext(t);function i(e){const n=r.useContext(c);return r.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function o(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:i(e.components),r.createElement(c.Provider,{value:n},e.children)}}}]);