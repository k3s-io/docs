"use strict";(self.webpackChunkk_3_s_docs=self.webpackChunkk_3_s_docs||[]).push([[1021],{5380:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>d,contentTitle:()=>l,default:()=>x,frontMatter:()=>i,metadata:()=>t,toc:()=>h});var r=s(5893),c=s(1151);const i={title:"secrets-encrypt"},l="k3s secrets-encrypt",t={id:"cli/secrets-encrypt",title:"secrets-encrypt",description:"K3s\u306f\u3001\u4fdd\u5b58\u6642\u306e\u30b7\u30fc\u30af\u30ec\u30c3\u30c8\u6697\u53f7\u5316\u3092\u6709\u52b9\u306b\u3059\u308b\u3053\u3068\u3092\u30b5\u30dd\u30fc\u30c8\u3057\u3066\u3044\u307e\u3059\u3002\u8a73\u7d30\u306b\u3064\u3044\u3066\u306f\u3001Secrets Encryption\u3092\u53c2\u7167\u3057\u3066\u304f\u3060\u3055\u3044\u3002",source:"@site/i18n/ja/docusaurus-plugin-content-docs/current/cli/secrets-encrypt.md",sourceDirName:"cli",slug:"/cli/secrets-encrypt",permalink:"/ja/cli/secrets-encrypt",draft:!1,unlisted:!1,editUrl:"https://github.com/k3s-io/docs/edit/main/docs/cli/secrets-encrypt.md",tags:[],version:"current",lastUpdatedAt:1730740055e3,frontMatter:{title:"secrets-encrypt"},sidebar:"mySidebar",previous:{title:"etcd-snapshot",permalink:"/ja/cli/etcd-snapshot"},next:{title:"token",permalink:"/ja/cli/token"}},d={},h=[{value:"\u30b7\u30fc\u30af\u30ec\u30c3\u30c8\u6697\u53f7\u5316\u30c4\u30fc\u30eb",id:"\u30b7\u30fc\u30af\u30ec\u30c3\u30c8\u6697\u53f7\u5316\u30c4\u30fc\u30eb",level:2},{value:"\u65b0\u3057\u3044\u6697\u53f7\u5316\u30ad\u30fc\u306e\u30ed\u30fc\u30c6\u30fc\u30b7\u30e7\u30f3\uff08\u5b9f\u9a13\u7684\uff09",id:"\u65b0\u3057\u3044\u6697\u53f7\u5316\u30ad\u30fc\u306e\u30ed\u30fc\u30c6\u30fc\u30b7\u30e7\u30f3\u5b9f\u9a13\u7684",level:3},{value:"\u6697\u53f7\u5316\u30ad\u30fc\u306e\u30ed\u30fc\u30c6\u30fc\u30b7\u30e7\u30f3\u30af\u30e9\u30b7\u30c3\u30af",id:"\u6697\u53f7\u5316\u30ad\u30fc\u306e\u30ed\u30fc\u30c6\u30fc\u30b7\u30e7\u30f3\u30af\u30e9\u30b7\u30c3\u30af",level:3},{value:"\u30b7\u30fc\u30af\u30ec\u30c3\u30c8\u6697\u53f7\u5316\u306e\u7121\u52b9\u5316/\u518d\u6709\u52b9\u5316",id:"\u30b7\u30fc\u30af\u30ec\u30c3\u30c8\u6697\u53f7\u5316\u306e\u7121\u52b9\u5316\u518d\u6709\u52b9\u5316",level:3},{value:"\u30b7\u30fc\u30af\u30ec\u30c3\u30c8\u6697\u53f7\u5316\u306e\u30b9\u30c6\u30fc\u30bf\u30b9",id:"\u30b7\u30fc\u30af\u30ec\u30c3\u30c8\u6697\u53f7\u5316\u306e\u30b9\u30c6\u30fc\u30bf\u30b9",level:3}];function a(e){const n={a:"a",admonition:"admonition",br:"br",code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",li:"li",mdxAdmonitionTitle:"mdxAdmonitionTitle",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,c.a)(),...e.components},{TabItem:s,Tabs:i}=n;return s||j("TabItem",!0),i||j("Tabs",!0),(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.header,{children:(0,r.jsx)(n.h1,{id:"k3s-secrets-encrypt",children:"k3s secrets-encrypt"})}),"\n",(0,r.jsxs)(n.p,{children:["K3s\u306f\u3001\u4fdd\u5b58\u6642\u306e\u30b7\u30fc\u30af\u30ec\u30c3\u30c8\u6697\u53f7\u5316\u3092\u6709\u52b9\u306b\u3059\u308b\u3053\u3068\u3092\u30b5\u30dd\u30fc\u30c8\u3057\u3066\u3044\u307e\u3059\u3002\u8a73\u7d30\u306b\u3064\u3044\u3066\u306f\u3001",(0,r.jsx)(n.a,{href:"/ja/security/secrets-encryption",children:"Secrets Encryption"}),"\u3092\u53c2\u7167\u3057\u3066\u304f\u3060\u3055\u3044\u3002"]}),"\n",(0,r.jsx)(n.h2,{id:"\u30b7\u30fc\u30af\u30ec\u30c3\u30c8\u6697\u53f7\u5316\u30c4\u30fc\u30eb",children:"\u30b7\u30fc\u30af\u30ec\u30c3\u30c8\u6697\u53f7\u5316\u30c4\u30fc\u30eb"}),"\n",(0,r.jsx)(n.admonition,{title:"\u30d0\u30fc\u30b8\u30e7\u30f3\u30b2\u30fc\u30c8",type:"info",children:(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.a,{href:"https://github.com/k3s-io/k3s/releases/tag/v1.21.8%2Bk3s1",children:"v1.21.8+k3s1"}),"\u304b\u3089\u5229\u7528\u53ef\u80fd"]})}),"\n",(0,r.jsxs)(n.p,{children:["K3s\u306b\u306f\u3001\u4ee5\u4e0b\u306e\u81ea\u52d5\u5236\u5fa1\u3092\u53ef\u80fd\u306b\u3059\u308bCLI\u30c4\u30fc\u30eb",(0,r.jsx)(n.code,{children:"secrets-encrypt"}),"\u304c\u542b\u307e\u308c\u3066\u3044\u307e\u3059\uff1a"]}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"\u30b7\u30fc\u30af\u30ec\u30c3\u30c8\u6697\u53f7\u5316\u306e\u7121\u52b9\u5316/\u6709\u52b9\u5316"}),"\n",(0,r.jsx)(n.li,{children:"\u65b0\u3057\u3044\u6697\u53f7\u5316\u30ad\u30fc\u306e\u8ffd\u52a0"}),"\n",(0,r.jsx)(n.li,{children:"\u6697\u53f7\u5316\u30ad\u30fc\u306e\u30ed\u30fc\u30c6\u30fc\u30b7\u30e7\u30f3\u3068\u524a\u9664"}),"\n",(0,r.jsx)(n.li,{children:"\u30b7\u30fc\u30af\u30ec\u30c3\u30c8\u306e\u518d\u6697\u53f7\u5316"}),"\n"]}),"\n",(0,r.jsx)(n.admonition,{type:"warning",children:(0,r.jsx)(n.p,{children:"\u6697\u53f7\u5316\u30ad\u30fc\u306e\u30ed\u30fc\u30c6\u30fc\u30b7\u30e7\u30f3\u306e\u9069\u5207\u306a\u624b\u9806\u306b\u5f93\u308f\u306a\u3044\u3068\u3001\u30af\u30e9\u30b9\u30bf\u30fc\u304c\u6c38\u4e45\u306b\u7834\u640d\u3059\u308b\u53ef\u80fd\u6027\u304c\u3042\u308a\u307e\u3059\u3002\u614e\u91cd\u306b\u9032\u3081\u3066\u304f\u3060\u3055\u3044\u3002"})}),"\n",(0,r.jsx)(n.h3,{id:"\u65b0\u3057\u3044\u6697\u53f7\u5316\u30ad\u30fc\u306e\u30ed\u30fc\u30c6\u30fc\u30b7\u30e7\u30f3\u5b9f\u9a13\u7684",children:"\u65b0\u3057\u3044\u6697\u53f7\u5316\u30ad\u30fc\u306e\u30ed\u30fc\u30c6\u30fc\u30b7\u30e7\u30f3\uff08\u5b9f\u9a13\u7684\uff09"}),"\n",(0,r.jsxs)(n.admonition,{title:"\u30d0\u30fc\u30b8\u30e7\u30f3\u30b2\u30fc\u30c8",type:"info",children:[(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.a,{href:"https://github.com/k3s-io/k3s/releases/tag/v1.28.1%2Bk3s1",children:"v1.28.1+k3s1"}),"\u304b\u3089\u5229\u7528\u53ef\u80fd\u3002\u3053\u306e\u65b0\u3057\u3044\u30d0\u30fc\u30b8\u30e7\u30f3\u306e\u30c4\u30fc\u30eb\u306f\u3001\u73fe\u5728\u30d9\u30fc\u30bf\u7248\u306eK8s ",(0,r.jsx)(n.a,{href:"https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/#configure-automatic-reloading",children:"\u81ea\u52d5\u8a2d\u5b9a\u30ea\u30ed\u30fc\u30c9"}),"\u3092\u5229\u7528\u3057\u3066\u3044\u307e\u3059\u3002GA\u306fv1.29.0\u3067\u4e88\u5b9a\u3055\u308c\u3066\u3044\u307e\u3059\u3002"]}),(0,r.jsxs)(n.p,{children:["\u53e4\u3044\u30ea\u30ea\u30fc\u30b9\u306b\u3064\u3044\u3066\u306f\u3001",(0,r.jsx)(n.a,{href:"#encryption-key-rotation-classic",children:"Encryption Key Rotation Classic"}),"\u3092\u53c2\u7167\u3057\u3066\u304f\u3060\u3055\u3044\u3002"]})]}),"\n",(0,r.jsxs)(i,{groupId:"se",children:[(0,r.jsxs)(s,{value:"Single-Server",default:!0,children:[(0,r.jsx)(n.p,{children:"\u30b7\u30f3\u30b0\u30eb\u30b5\u30fc\u30d0\u30fc\u30af\u30e9\u30b9\u30bf\u30fc\u3067\u30b7\u30fc\u30af\u30ec\u30c3\u30c8\u6697\u53f7\u5316\u30ad\u30fc\u3092\u30ed\u30fc\u30c6\u30fc\u30b7\u30e7\u30f3\u3059\u308b\u306b\u306f\uff1a"}),(0,r.jsxs)(n.ol,{children:["\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsxs)(n.p,{children:["\u30d5\u30e9\u30b0",(0,r.jsx)(n.code,{children:"--secrets-encryption"}),"\u3092\u4f7f\u7528\u3057\u3066K3s\u30b5\u30fc\u30d0\u30fc\u3092\u8d77\u52d5\u3057\u307e\u3059\u3002"]}),"\n",(0,r.jsxs)(n.admonition,{type:"note",children:[(0,r.jsx)(n.mdxAdmonitionTitle,{}),(0,r.jsx)(n.p,{children:"\u6697\u53f7\u5316\u306a\u3057\u3067K3s\u3092\u8d77\u52d5\u3057\u3001\u5f8c\u3067\u6709\u52b9\u306b\u3059\u308b\u3053\u3068\u306f\u73fe\u5728\u30b5\u30dd\u30fc\u30c8\u3055\u308c\u3066\u3044\u307e\u305b\u3093\u3002"})]}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsx)(n.p,{children:"\u30b7\u30fc\u30af\u30ec\u30c3\u30c8\u6697\u53f7\u5316\u30ad\u30fc\u3092\u30ed\u30fc\u30c6\u30fc\u30b7\u30e7\u30f3\u3057\u307e\u3059\u3002"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{children:"k3s secrets-encrypt rotate-keys\n"})}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsx)(n.p,{children:"\u518d\u6697\u53f7\u5316\u304c\u5b8c\u4e86\u3059\u308b\u306e\u3092\u5f85\u3061\u307e\u3059\u3002\u30b5\u30fc\u30d0\u30fc\u30ed\u30b0\u3092\u76e3\u8996\u3059\u308b\u304b\u3001\u4ee5\u4e0b\u3092\u5f85\u3061\u307e\u3059\uff1a"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"$ k3s secrets-encrypt status\nEncryption Status: Enabled\nCurrent Rotation Stage: reencrypt_finished\n"})}),"\n"]}),"\n"]})]}),(0,r.jsxs)(s,{value:"High-Availability",children:[(0,r.jsx)(n.p,{children:"HA\u30bb\u30c3\u30c8\u30a2\u30c3\u30d7\u3067\u30b7\u30fc\u30af\u30ec\u30c3\u30c8\u6697\u53f7\u5316\u30ad\u30fc\u3092\u30ed\u30fc\u30c6\u30fc\u30b7\u30e7\u30f3\u3059\u308b\u306b\u306f\uff1a"}),(0,r.jsxs)(n.ol,{children:["\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsxs)(n.p,{children:["\u3059\u3079\u3066\u306eK3s\u30b5\u30fc\u30d0\u30fc\u3092",(0,r.jsx)(n.code,{children:"--secrets-encryption"}),"\u30d5\u30e9\u30b0\u3067\u8d77\u52d5\u3057\u307e\u3059\u3002\u7c21\u7565\u5316\u306e\u305f\u3081\u3001\u30b5\u30fc\u30d0\u30fc\u3092S1\u3001S2\u3001S3\u3068\u547c\u3073\u307e\u3059\u3002"]}),"\n",(0,r.jsx)(n.admonition,{type:"note",children:(0,r.jsx)(n.p,{children:"\u6697\u53f7\u5316\u306a\u3057\u3067K3s\u3092\u8d77\u52d5\u3057\u3001\u5f8c\u3067\u6709\u52b9\u306b\u3059\u308b\u3053\u3068\u306f\u73fe\u5728\u30b5\u30dd\u30fc\u30c8\u3055\u308c\u3066\u3044\u307e\u305b\u3093\u3002"})}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsx)(n.p,{children:"S1\u3067\u30b7\u30fc\u30af\u30ec\u30c3\u30c8\u6697\u53f7\u5316\u30ad\u30fc\u3092\u30ed\u30fc\u30c6\u30fc\u30b7\u30e7\u30f3\u3057\u307e\u3059\u3002"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"k3s secrets-encrypt rotate-keys\n"})}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsx)(n.p,{children:"\u518d\u6697\u53f7\u5316\u304c\u5b8c\u4e86\u3059\u308b\u306e\u3092\u5f85\u3061\u307e\u3059\u3002\u30b5\u30fc\u30d0\u30fc\u30ed\u30b0\u3092\u76e3\u8996\u3059\u308b\u304b\u3001\u4ee5\u4e0b\u3092\u5f85\u3061\u307e\u3059\uff1a"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"$ k3s secrets-encrypt status\nEncryption Status: Enabled\nCurrent Rotation Stage: reencrypt_finished\n"})}),"\n",(0,r.jsx)(n.admonition,{type:"info",children:(0,r.jsx)(n.p,{children:"K3s\u306f1\u79d2\u3042\u305f\u308a\u7d045\u3064\u306e\u30b7\u30fc\u30af\u30ec\u30c3\u30c8\u3092\u518d\u6697\u53f7\u5316\u3057\u307e\u3059\u3002\u30b7\u30fc\u30af\u30ec\u30c3\u30c8\u306e\u6570\u304c\u591a\u3044\u30af\u30e9\u30b9\u30bf\u30fc\u3067\u306f\u3001\u518d\u6697\u53f7\u5316\u306b\u6570\u5206\u304b\u304b\u308b\u3053\u3068\u304c\u3042\u308a\u307e\u3059\u3002\u30b5\u30fc\u30d0\u30fc\u30ed\u30b0\u3067\u9032\u884c\u72b6\u6cc1\u3092\u78ba\u8a8d\u3067\u304d\u307e\u3059\u3002"})}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsx)(n.p,{children:"\u540c\u3058\u5f15\u6570\u3067S1\u306eK3s\u3092\u518d\u8d77\u52d5\u3057\u307e\u3059\u3002K3s\u3092\u30b5\u30fc\u30d3\u30b9\u3068\u3057\u3066\u5b9f\u884c\u3057\u3066\u3044\u308b\u5834\u5408\uff1a"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"# systemd\u3092\u4f7f\u7528\u3057\u3066\u3044\u308b\u5834\u5408\nsystemctl restart k3s\n# openrc\u3092\u4f7f\u7528\u3057\u3066\u3044\u308b\u5834\u5408\nrc-service k3s restart\n"})}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsx)(n.p,{children:"S1\u304c\u8d77\u52d5\u3057\u305f\u3089\u3001S2\u3068S3\u306eK3s\u3092\u518d\u8d77\u52d5\u3057\u307e\u3059\u3002"}),"\n"]}),"\n"]})]})]}),"\n",(0,r.jsx)(n.h3,{id:"\u6697\u53f7\u5316\u30ad\u30fc\u306e\u30ed\u30fc\u30c6\u30fc\u30b7\u30e7\u30f3\u30af\u30e9\u30b7\u30c3\u30af",children:"\u6697\u53f7\u5316\u30ad\u30fc\u306e\u30ed\u30fc\u30c6\u30fc\u30b7\u30e7\u30f3\u30af\u30e9\u30b7\u30c3\u30af"}),"\n",(0,r.jsxs)(i,{groupId:"se",children:[(0,r.jsxs)(s,{value:"Single-Server",default:!0,children:[(0,r.jsx)(n.p,{children:"\u30b7\u30f3\u30b0\u30eb\u30b5\u30fc\u30d0\u30fc\u30af\u30e9\u30b9\u30bf\u30fc\u3067\u30b7\u30fc\u30af\u30ec\u30c3\u30c8\u6697\u53f7\u5316\u30ad\u30fc\u3092\u30ed\u30fc\u30c6\u30fc\u30b7\u30e7\u30f3\u3059\u308b\u306b\u306f\uff1a"}),(0,r.jsxs)(n.ol,{children:["\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsxs)(n.p,{children:["\u30d5\u30e9\u30b0",(0,r.jsx)(n.code,{children:"--secrets-encryption"}),"\u3092\u4f7f\u7528\u3057\u3066K3s\u30b5\u30fc\u30d0\u30fc\u3092\u8d77\u52d5\u3057\u307e\u3059\u3002"]}),"\n",(0,r.jsxs)(n.admonition,{type:"note",children:[(0,r.jsx)(n.mdxAdmonitionTitle,{}),(0,r.jsx)(n.p,{children:"\u6697\u53f7\u5316\u306a\u3057\u3067K3s\u3092\u8d77\u52d5\u3057\u3001\u5f8c\u3067\u6709\u52b9\u306b\u3059\u308b\u3053\u3068\u306f\u73fe\u5728\u30b5\u30dd\u30fc\u30c8\u3055\u308c\u3066\u3044\u307e\u305b\u3093\u3002"})]}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsx)(n.p,{children:"\u6e96\u5099\u3057\u307e\u3059\u3002"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"k3s secrets-encrypt prepare\n"})}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsx)(n.p,{children:"\u540c\u3058\u5f15\u6570\u3067K3s\u30b5\u30fc\u30d0\u30fc\u3092\u518d\u8d77\u52d5\u3057\u307e\u3059\u3002K3s\u3092\u30b5\u30fc\u30d3\u30b9\u3068\u3057\u3066\u5b9f\u884c\u3057\u3066\u3044\u308b\u5834\u5408\uff1a"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"# systemd\u3092\u4f7f\u7528\u3057\u3066\u3044\u308b\u5834\u5408\nsystemctl restart k3s\n# openrc\u3092\u4f7f\u7528\u3057\u3066\u3044\u308b\u5834\u5408\nrc-service k3s restart\n"})}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsx)(n.p,{children:"\u30ed\u30fc\u30c6\u30fc\u30b7\u30e7\u30f3\u3057\u307e\u3059\u3002"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"k3s secrets-encrypt rotate\n"})}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsx)(n.p,{children:"\u540c\u3058\u5f15\u6570\u3067K3s\u30b5\u30fc\u30d0\u30fc\u3092\u518d\u8d77\u52d5\u3057\u307e\u3059\u3002"}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsx)(n.p,{children:"\u518d\u6697\u53f7\u5316\u3057\u307e\u3059\u3002"}),"\n",(0,r.jsx)(n.admonition,{type:"info",children:(0,r.jsxs)(n.p,{children:["K3s\u306f1\u79d2\u3042\u305f\u308a\u7d045\u3064\u306e\u30b7\u30fc\u30af\u30ec\u30c3\u30c8\u3092\u518d\u6697\u53f7\u5316\u3057\u307e\u3059\u3002",(0,r.jsx)(n.br,{}),"\n","\u30b7\u30fc\u30af\u30ec\u30c3\u30c8\u306e\u6570\u304c\u591a\u3044\u30af\u30e9\u30b9\u30bf\u30fc\u3067\u306f\u3001\u518d\u6697\u53f7\u5316\u306b\u6570\u5206\u304b\u304b\u308b\u3053\u3068\u304c\u3042\u308a\u307e\u3059\u3002"]})}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"k3s secrets-encrypt reencrypt\n"})}),"\n"]}),"\n"]})]}),(0,r.jsxs)(s,{value:"High-Availability",children:[(0,r.jsx)(n.p,{children:"\u57cb\u3081\u8fbc\u307fDB\u3068\u5916\u90e8DB\u30af\u30e9\u30b9\u30bf\u30fc\u306e\u4e21\u65b9\u3067\u624b\u9806\u306f\u540c\u3058\u3067\u3059\u3002"}),(0,r.jsx)(n.p,{children:"HA\u30bb\u30c3\u30c8\u30a2\u30c3\u30d7\u3067\u30b7\u30fc\u30af\u30ec\u30c3\u30c8\u6697\u53f7\u5316\u30ad\u30fc\u3092\u30ed\u30fc\u30c6\u30fc\u30b7\u30e7\u30f3\u3059\u308b\u306b\u306f\uff1a"}),(0,r.jsxs)(n.ol,{children:["\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsxs)(n.p,{children:["\u3059\u3079\u3066\u306eK3s\u30b5\u30fc\u30d0\u30fc\u3092",(0,r.jsx)(n.code,{children:"--secrets-encryption"}),"\u30d5\u30e9\u30b0\u3067\u8d77\u52d5\u3057\u307e\u3059\u3002\u7c21\u7565\u5316\u306e\u305f\u3081\u3001\u30b5\u30fc\u30d0\u30fc\u3092S1\u3001S2\u3001S3\u3068\u547c\u3073\u307e\u3059\u3002"]}),"\n",(0,r.jsx)(n.admonition,{title:"Notes",type:"note",children:(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"\u6697\u53f7\u5316\u306a\u3057\u3067K3s\u3092\u8d77\u52d5\u3057\u3001\u5f8c\u3067\u6709\u52b9\u306b\u3059\u308b\u3053\u3068\u306f\u73fe\u5728\u30b5\u30dd\u30fc\u30c8\u3055\u308c\u3066\u3044\u307e\u305b\u3093\u3002"}),"\n",(0,r.jsxs)(n.li,{children:["\u5fc5\u9808\u3067\u306f\u3042\u308a\u307e\u305b\u3093\u304c\u3001",(0,r.jsx)(n.code,{children:"secrets-encrypt"}),"\u30b3\u30de\u30f3\u30c9\u3092\u5b9f\u884c\u3059\u308b\u30b5\u30fc\u30d0\u30fc\u30ce\u30fc\u30c9\u30921\u3064\u9078\u3076\u3053\u3068\u3092\u304a\u52e7\u3081\u3057\u307e\u3059\u3002"]}),"\n"]})}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsx)(n.p,{children:"S1\u3067\u6e96\u5099\u3057\u307e\u3059\u3002"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"k3s secrets-encrypt prepare\n"})}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsx)(n.p,{children:"\u540c\u3058\u5f15\u6570\u3067S1\u3092\u518d\u8d77\u52d5\u3057\u307e\u3059\u3002K3s\u3092\u30b5\u30fc\u30d3\u30b9\u3068\u3057\u3066\u5b9f\u884c\u3057\u3066\u3044\u308b\u5834\u5408\uff1a"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"# systemd\u3092\u4f7f\u7528\u3057\u3066\u3044\u308b\u5834\u5408\nsystemctl restart k3s\n# openrc\u3092\u4f7f\u7528\u3057\u3066\u3044\u308b\u5834\u5408\nrc-service k3s restart\n"})}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsx)(n.p,{children:"S1\u304c\u8d77\u52d5\u3057\u305f\u3089\u3001S2\u3068S3\u3092\u518d\u8d77\u52d5\u3057\u307e\u3059\u3002"}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsx)(n.p,{children:"S1\u3067\u30ed\u30fc\u30c6\u30fc\u30b7\u30e7\u30f3\u3057\u307e\u3059\u3002"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"k3s secrets-encrypt rotate\n"})}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsx)(n.p,{children:"\u540c\u3058\u5f15\u6570\u3067S1\u3092\u518d\u8d77\u52d5\u3057\u307e\u3059\u3002"}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsx)(n.p,{children:"S1\u304c\u8d77\u52d5\u3057\u305f\u3089\u3001S2\u3068S3\u3092\u518d\u8d77\u52d5\u3057\u307e\u3059\u3002"}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsx)(n.p,{children:"S1\u3067\u518d\u6697\u53f7\u5316\u3057\u307e\u3059\u3002"}),"\n",(0,r.jsx)(n.admonition,{type:"info",children:(0,r.jsxs)(n.p,{children:["K3s\u306f1\u79d2\u3042\u305f\u308a\u7d045\u3064\u306e\u30b7\u30fc\u30af\u30ec\u30c3\u30c8\u3092\u518d\u6697\u53f7\u5316\u3057\u307e\u3059\u3002",(0,r.jsx)(n.br,{}),"\n","\u30b7\u30fc\u30af\u30ec\u30c3\u30c8\u306e\u6570\u304c\u591a\u3044\u30af\u30e9\u30b9\u30bf\u30fc\u3067\u306f\u3001\u518d\u6697\u53f7\u5316\u306b\u6570\u5206\u304b\u304b\u308b\u3053\u3068\u304c\u3042\u308a\u307e\u3059\u3002"]})}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"k3s secrets-encrypt reencrypt\n"})}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsx)(n.p,{children:"\u540c\u3058\u5f15\u6570\u3067S1\u3092\u518d\u8d77\u52d5\u3057\u307e\u3059\u3002"}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsx)(n.p,{children:"S1\u304c\u8d77\u52d5\u3057\u305f\u3089\u3001S2\u3068S3\u3092\u518d\u8d77\u52d5\u3057\u307e\u3059\u3002"}),"\n"]}),"\n"]})]})]}),"\n",(0,r.jsx)(n.h3,{id:"\u30b7\u30fc\u30af\u30ec\u30c3\u30c8\u6697\u53f7\u5316\u306e\u7121\u52b9\u5316\u518d\u6709\u52b9\u5316",children:"\u30b7\u30fc\u30af\u30ec\u30c3\u30c8\u6697\u53f7\u5316\u306e\u7121\u52b9\u5316/\u518d\u6709\u52b9\u5316"}),"\n",(0,r.jsxs)(i,{groupId:"se",children:[(0,r.jsxs)(s,{value:"Single-Server",default:!0,children:[(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.code,{children:"--secrets-encryption"}),"\u30d5\u30e9\u30b0\u3092\u4f7f\u7528\u3057\u3066\u30b5\u30fc\u30d0\u30fc\u3092\u8d77\u52d5\u3057\u305f\u5f8c\u3001\u30b7\u30fc\u30af\u30ec\u30c3\u30c8\u6697\u53f7\u5316\u3092\u7121\u52b9\u306b\u3059\u308b\u3053\u3068\u304c\u3067\u304d\u307e\u3059\u3002"]}),(0,r.jsx)(n.p,{children:"\u30b7\u30f3\u30b0\u30eb\u30ce\u30fc\u30c9\u30af\u30e9\u30b9\u30bf\u30fc\u3067\u30b7\u30fc\u30af\u30ec\u30c3\u30c8\u6697\u53f7\u5316\u3092\u7121\u52b9\u306b\u3059\u308b\u306b\u306f\uff1a"}),(0,r.jsxs)(n.ol,{children:["\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsx)(n.p,{children:"\u7121\u52b9\u5316\u3057\u307e\u3059\u3002"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"k3s secrets-encrypt disable\n"})}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsx)(n.p,{children:"\u540c\u3058\u5f15\u6570\u3067K3s\u30b5\u30fc\u30d0\u30fc\u3092\u518d\u8d77\u52d5\u3057\u307e\u3059\u3002K3s\u3092\u30b5\u30fc\u30d3\u30b9\u3068\u3057\u3066\u5b9f\u884c\u3057\u3066\u3044\u308b\u5834\u5408\uff1a"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"# systemd\u3092\u4f7f\u7528\u3057\u3066\u3044\u308b\u5834\u5408\nsystemctl restart k3s\n# openrc\u3092\u4f7f\u7528\u3057\u3066\u3044\u308b\u5834\u5408\nrc-service k3s restart\n"})}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsx)(n.p,{children:"\u30d5\u30e9\u30b0\u3092\u4f7f\u7528\u3057\u3066\u518d\u6697\u53f7\u5316\u3057\u307e\u3059\u3002"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"k3s secrets-encrypt reencrypt --force --skip\n"})}),"\n"]}),"\n"]}),(0,r.jsx)(n.p,{children:"\u30b7\u30f3\u30b0\u30eb\u30ce\u30fc\u30c9\u30af\u30e9\u30b9\u30bf\u30fc\u3067\u30b7\u30fc\u30af\u30ec\u30c3\u30c8\u6697\u53f7\u5316\u3092\u518d\u6709\u52b9\u5316\u3059\u308b\u306b\u306f\uff1a"}),(0,r.jsxs)(n.ol,{children:["\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsx)(n.p,{children:"\u6709\u52b9\u5316\u3057\u307e\u3059\u3002"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"k3s secrets-encrypt enable\n"})}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsx)(n.p,{children:"\u540c\u3058\u5f15\u6570\u3067K3s\u30b5\u30fc\u30d0\u30fc\u3092\u518d\u8d77\u52d5\u3057\u307e\u3059\u3002"}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsx)(n.p,{children:"\u30d5\u30e9\u30b0\u3092\u4f7f\u7528\u3057\u3066\u518d\u6697\u53f7\u5316\u3057\u307e\u3059\u3002"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"k3s secrets-encrypt reencrypt --force --skip\n"})}),"\n"]}),"\n"]})]}),(0,r.jsxs)(s,{value:"High-Availability",children:[(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.code,{children:"--secrets-encryption"}),"\u30d5\u30e9\u30b0\u3092\u4f7f\u7528\u3057\u3066HA\u30af\u30e9\u30b9\u30bf\u30fc\u3092\u8d77\u52d5\u3057\u305f\u5f8c\u3001\u30b7\u30fc\u30af\u30ec\u30c3\u30c8\u6697\u53f7\u5316\u3092\u7121\u52b9\u306b\u3059\u308b\u3053\u3068\u304c\u3067\u304d\u307e\u3059\u3002"]}),(0,r.jsx)(n.admonition,{type:"note",children:(0,r.jsxs)(n.p,{children:["\u5fc5\u9808\u3067\u306f\u3042\u308a\u307e\u305b\u3093\u304c\u3001",(0,r.jsx)(n.code,{children:"secrets-encrypt"}),"\u30b3\u30de\u30f3\u30c9\u3092\u5b9f\u884c\u3059\u308b\u30b5\u30fc\u30d0\u30fc\u30ce\u30fc\u30c9\u30921\u3064\u9078\u3076\u3053\u3068\u3092\u304a\u52e7\u3081\u3057\u307e\u3059\u3002"]})}),(0,r.jsx)(n.p,{children:"\u7c21\u7565\u5316\u306e\u305f\u3081\u3001\u3053\u306e\u30ac\u30a4\u30c9\u3067\u4f7f\u7528\u3059\u308b3\u3064\u306e\u30b5\u30fc\u30d0\u30fc\u3092S1\u3001S2\u3001S3\u3068\u547c\u3073\u307e\u3059\u3002"}),(0,r.jsx)(n.p,{children:"HA\u30af\u30e9\u30b9\u30bf\u30fc\u3067\u30b7\u30fc\u30af\u30ec\u30c3\u30c8\u6697\u53f7\u5316\u3092\u7121\u52b9\u306b\u3059\u308b\u306b\u306f\uff1a"}),(0,r.jsxs)(n.ol,{children:["\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsx)(n.p,{children:"S1\u3067\u7121\u52b9\u5316\u3057\u307e\u3059\u3002"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"k3s secrets-encrypt disable\n"})}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsx)(n.p,{children:"\u540c\u3058\u5f15\u6570\u3067S1\u3092\u518d\u8d77\u52d5\u3057\u307e\u3059\u3002K3s\u3092\u30b5\u30fc\u30d3\u30b9\u3068\u3057\u3066\u5b9f\u884c\u3057\u3066\u3044\u308b\u5834\u5408\uff1a"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"# systemd\u3092\u4f7f\u7528\u3057\u3066\u3044\u308b\u5834\u5408\nsystemctl restart k3s\n# openrc\u3092\u4f7f\u7528\u3057\u3066\u3044\u308b\u5834\u5408\nrc-service k3s restart\n"})}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsx)(n.p,{children:"S1\u304c\u8d77\u52d5\u3057\u305f\u3089\u3001S2\u3068S3\u3092\u518d\u8d77\u52d5\u3057\u307e\u3059\u3002"}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsx)(n.p,{children:"S1\u3067\u30d5\u30e9\u30b0\u3092\u4f7f\u7528\u3057\u3066\u518d\u6697\u53f7\u5316\u3057\u307e\u3059\u3002"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"k3s secrets-encrypt reencrypt --force --skip\n"})}),"\n"]}),"\n"]}),(0,r.jsx)(n.p,{children:"HA\u30af\u30e9\u30b9\u30bf\u30fc\u3067\u30b7\u30fc\u30af\u30ec\u30c3\u30c8\u6697\u53f7\u5316\u3092\u518d\u6709\u52b9\u5316\u3059\u308b\u306b\u306f\uff1a"}),(0,r.jsxs)(n.ol,{children:["\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsx)(n.p,{children:"S1\u3067\u6709\u52b9\u5316\u3057\u307e\u3059\u3002"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"k3s secrets-encrypt enable\n"})}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsx)(n.p,{children:"\u540c\u3058\u5f15\u6570\u3067S1\u3092\u518d\u8d77\u52d5\u3057\u307e\u3059\u3002"}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsx)(n.p,{children:"S1\u304c\u8d77\u52d5\u3057\u305f\u3089\u3001S2\u3068S3\u3092\u518d\u8d77\u52d5\u3057\u307e\u3059\u3002"}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsx)(n.p,{children:"S1\u3067\u30d5\u30e9\u30b0\u3092\u4f7f\u7528\u3057\u3066\u518d\u6697\u53f7\u5316\u3057\u307e\u3059\u3002"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"k3s secrets-encrypt reencrypt --force --skip\n"})}),"\n"]}),"\n"]})]})]}),"\n",(0,r.jsx)(n.h3,{id:"\u30b7\u30fc\u30af\u30ec\u30c3\u30c8\u6697\u53f7\u5316\u306e\u30b9\u30c6\u30fc\u30bf\u30b9",children:"\u30b7\u30fc\u30af\u30ec\u30c3\u30c8\u6697\u53f7\u5316\u306e\u30b9\u30c6\u30fc\u30bf\u30b9"}),"\n",(0,r.jsxs)(n.p,{children:["secrets-encrypt\u30c4\u30fc\u30eb\u306b\u306f\u3001\u30ce\u30fc\u30c9\u4e0a\u306e\u30b7\u30fc\u30af\u30ec\u30c3\u30c8\u6697\u53f7\u5316\u306e\u73fe\u5728\u306e\u30b9\u30c6\u30fc\u30bf\u30b9\u306b\u95a2\u3059\u308b\u60c5\u5831\u3092\u8868\u793a\u3059\u308b",(0,r.jsx)(n.code,{children:"status"}),"\u30b3\u30de\u30f3\u30c9\u304c\u542b\u307e\u308c\u3066\u3044\u307e\u3059\u3002"]}),"\n",(0,r.jsx)(n.p,{children:"\u30b7\u30f3\u30b0\u30eb\u30b5\u30fc\u30d0\u30fc\u30ce\u30fc\u30c9\u3067\u306e\u30b3\u30de\u30f3\u30c9\u306e\u4f8b\uff1a"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"$ k3s secrets-encrypt status\nEncryption Status: Enabled\nCurrent Rotation Stage: start\nServer Encryption Hashes: All hashes match\n\nActive  Key Type  Name\n------  --------  ----\n *      AES-CBC   aescbckey\n\n"})}),"\n",(0,r.jsx)(n.p,{children:"HA\u30af\u30e9\u30b9\u30bf\u30fc\u3067\u306e\u5225\u306e\u4f8b\u3001\u30ad\u30fc\u3092\u30ed\u30fc\u30c6\u30fc\u30b7\u30e7\u30f3\u3057\u305f\u5f8c\u3001\u30b5\u30fc\u30d0\u30fc\u3092\u518d\u8d77\u52d5\u3059\u308b\u524d\uff1a"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"$ k3s secrets-encrypt status\nEncryption Status: Enabled\nCurrent Rotation Stage: rotate\nServer Encryption Hashes: hash does not match between node-1 and node-2\n\nActive  Key Type  Name\n------  --------  ----\n *      AES-CBC   aescbckey-2021-12-10T22:54:38Z\n        AES-CBC   aescbckey\n\n"})}),"\n",(0,r.jsx)(n.p,{children:"\u5404\u30bb\u30af\u30b7\u30e7\u30f3\u306e\u8a73\u7d30\u306f\u4ee5\u4e0b\u306e\u901a\u308a\u3067\u3059\uff1a"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"Encryption Status"}),": \u30ce\u30fc\u30c9\u4e0a\u3067\u30b7\u30fc\u30af\u30ec\u30c3\u30c8\u6697\u53f7\u5316\u304c\u7121\u52b9\u304b\u6709\u52b9\u304b\u3092\u8868\u793a\u3057\u307e\u3059\u3002"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"Current Rotation Stage"}),": \u30ce\u30fc\u30c9\u4e0a\u306e\u73fe\u5728\u306e\u30ed\u30fc\u30c6\u30fc\u30b7\u30e7\u30f3\u30b9\u30c6\u30fc\u30b8\u3092\u793a\u3057\u307e\u3059\u3002",(0,r.jsx)(n.br,{}),"\n","\u30b9\u30c6\u30fc\u30b8\u306f\uff1a",(0,r.jsx)(n.code,{children:"start"}),"\u3001",(0,r.jsx)(n.code,{children:"prepare"}),"\u3001",(0,r.jsx)(n.code,{children:"rotate"}),"\u3001",(0,r.jsx)(n.code,{children:"reencrypt_request"}),"\u3001",(0,r.jsx)(n.code,{children:"reencrypt_active"}),"\u3001",(0,r.jsx)(n.code,{children:"reencrypt_finished"}),"\u3067\u3059\u3002"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"Server Encryption Hashes"}),": HA\u30af\u30e9\u30b9\u30bf\u30fc\u306b\u5f79\u7acb\u3061\u307e\u3059\u3002\u3053\u308c\u306f\u3001\u3059\u3079\u3066\u306e\u30b5\u30fc\u30d0\u30fc\u304c\u30ed\u30fc\u30ab\u30eb\u30d5\u30a1\u30a4\u30eb\u3068\u540c\u3058\u30b9\u30c6\u30fc\u30b8\u306b\u3042\u308b\u304b\u3069\u3046\u304b\u3092\u793a\u3057\u307e\u3059\u3002\u6b21\u306e\u30b9\u30c6\u30fc\u30b8\u306b\u9032\u3080\u524d\u306b\u30b5\u30fc\u30d0\u30fc\u306e\u518d\u8d77\u52d5\u304c\u5fc5\u8981\u304b\u3069\u3046\u304b\u3092\u78ba\u8a8d\u3059\u308b\u305f\u3081\u306b\u4f7f\u7528\u3067\u304d\u307e\u3059\u3002\u4e0a\u8a18\u306eHA\u306e\u4f8b\u3067\u306f\u3001node-1\u3068node-2\u306e\u30cf\u30c3\u30b7\u30e5\u304c\u7570\u306a\u308a\u3001\u73fe\u5728\u540c\u3058\u6697\u53f7\u5316\u8a2d\u5b9a\u3092\u6301\u3063\u3066\u3044\u306a\u3044\u3053\u3068\u3092\u793a\u3057\u3066\u3044\u307e\u3059\u3002\u30b5\u30fc\u30d0\u30fc\u3092\u518d\u8d77\u52d5\u3059\u308b\u3068\u3001\u8a2d\u5b9a\u304c\u540c\u671f\u3055\u308c\u307e\u3059\u3002"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"Key Table"}),": \u30ce\u30fc\u30c9\u4e0a\u3067\u898b\u3064\u304b\u3063\u305f\u30b7\u30fc\u30af\u30ec\u30c3\u30c8\u6697\u53f7\u5316\u30ad\u30fc\u306b\u95a2\u3059\u308b\u60c5\u5831\u3092\u8981\u7d04\u3057\u307e\u3059\u3002","\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"Active"}),': "*"\u306f\u3001\u73fe\u5728\u30b7\u30fc\u30af\u30ec\u30c3\u30c8\u6697\u53f7\u5316\u306b\u4f7f\u7528\u3055\u308c\u3066\u3044\u308b\u30ad\u30fc\u3092\u793a\u3057\u307e\u3059\u3002\u30a2\u30af\u30c6\u30a3\u30d6\u306a\u30ad\u30fc\u306f\u3001Kubernetes\u304c\u65b0\u3057\u3044\u30b7\u30fc\u30af\u30ec\u30c3\u30c8\u3092\u6697\u53f7\u5316\u3059\u308b\u305f\u3081\u306b\u4f7f\u7528\u3057\u307e\u3059\u3002']}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"Key Type"}),": \u3053\u306e\u30c4\u30fc\u30eb\u3092\u4f7f\u7528\u3059\u308b\u3059\u3079\u3066\u306e\u30ad\u30fc\u306f",(0,r.jsx)(n.code,{children:"AES-CBC"}),"\u30bf\u30a4\u30d7\u3067\u3059\u3002\u8a73\u7d30\u306f",(0,r.jsx)(n.a,{href:"https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/#providers",children:"\u3053\u3061\u3089"}),"\u3092\u53c2\u7167\u3057\u3066\u304f\u3060\u3055\u3044\u3002"]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.strong,{children:"Name"}),": \u6697\u53f7\u5316\u30ad\u30fc\u306e\u540d\u524d\u3002"]}),"\n"]}),"\n"]}),"\n"]})]})}function x(e={}){const{wrapper:n}={...(0,c.a)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(a,{...e})}):a(e)}function j(e,n){throw new Error("Expected "+(n?"component":"object")+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}},1151:(e,n,s)=>{s.d(n,{Z:()=>t,a:()=>l});var r=s(7294);const c={},i=r.createContext(c);function l(e){const n=r.useContext(i);return r.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function t(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(c):e.components||c:l(e.components),r.createElement(i.Provider,{value:n},e.children)}}}]);