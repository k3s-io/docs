"use strict";(self.webpackChunkk_3_s_docs=self.webpackChunkk_3_s_docs||[]).push([[5977],{6897:(e,s,l)=>{l.r(s),l.d(s,{assets:()=>i,contentTitle:()=>a,default:()=>p,frontMatter:()=>t,metadata:()=>c,toc:()=>d});var n=l(5893),r=l(1151);const t={title:"K3s\u306e\u505c\u6b62"},a=void 0,c={id:"upgrades/killall",title:"K3s\u306e\u505c\u6b62",description:"\u30a2\u30c3\u30d7\u30b0\u30ec\u30fc\u30c9\u4e2d\u306e\u9ad8\u53ef\u7528\u6027\u3092\u78ba\u4fdd\u3059\u308b\u305f\u3081\u306b\u3001K3s\u30b5\u30fc\u30d3\u30b9\u304c\u505c\u6b62\u3057\u3066\u3082K3s\u30b3\u30f3\u30c6\u30ca\u306f\u5f15\u304d\u7d9a\u304d\u5b9f\u884c\u3055\u308c\u307e\u3059\u3002",source:"@site/i18n/ja/docusaurus-plugin-content-docs/current/upgrades/killall.md",sourceDirName:"upgrades",slug:"/upgrades/killall",permalink:"/ja/upgrades/killall",draft:!1,unlisted:!1,editUrl:"https://github.com/k3s-io/docs/edit/main/docs/upgrades/killall.md",tags:[],version:"current",lastUpdatedAt:1729028426e3,frontMatter:{title:"K3s\u306e\u505c\u6b62"},sidebar:"mySidebar",previous:{title:"\u30a2\u30c3\u30d7\u30b0\u30ec\u30fc\u30c9",permalink:"/ja/upgrades/"},next:{title:"\u624b\u52d5\u30a2\u30c3\u30d7\u30b0\u30ec\u30fc\u30c9",permalink:"/ja/upgrades/manual"}},i={},d=[{value:"K3s\u30b5\u30fc\u30d3\u30b9",id:"k3s\u30b5\u30fc\u30d3\u30b9",level:2},{value:"Killall\u30b9\u30af\u30ea\u30d7\u30c8",id:"killall\u30b9\u30af\u30ea\u30d7\u30c8",level:2}];function o(e){const s={code:"code",h2:"h2",p:"p",pre:"pre",...(0,r.a)(),...e.components},{TabItem:l,Tabs:t}=s;return l||u("TabItem",!0),t||u("Tabs",!0),(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(s.p,{children:"\u30a2\u30c3\u30d7\u30b0\u30ec\u30fc\u30c9\u4e2d\u306e\u9ad8\u53ef\u7528\u6027\u3092\u78ba\u4fdd\u3059\u308b\u305f\u3081\u306b\u3001K3s\u30b5\u30fc\u30d3\u30b9\u304c\u505c\u6b62\u3057\u3066\u3082K3s\u30b3\u30f3\u30c6\u30ca\u306f\u5f15\u304d\u7d9a\u304d\u5b9f\u884c\u3055\u308c\u307e\u3059\u3002"}),"\n",(0,n.jsx)(s.h2,{id:"k3s\u30b5\u30fc\u30d3\u30b9",children:"K3s\u30b5\u30fc\u30d3\u30b9"}),"\n",(0,n.jsx)(s.p,{children:"K3s\u306e\u505c\u6b62\u3068\u518d\u8d77\u52d5\u306f\u3001systemd\u304a\u3088\u3073OpenRC\u306e\u30a4\u30f3\u30b9\u30c8\u30fc\u30eb\u30b9\u30af\u30ea\u30d7\u30c8\u306b\u3088\u3063\u3066\u30b5\u30dd\u30fc\u30c8\u3055\u308c\u3066\u3044\u307e\u3059\u3002"}),"\n",(0,n.jsxs)(t,{children:[(0,n.jsxs)(l,{value:"systemd",children:[(0,n.jsx)(s.p,{children:"\u30b5\u30fc\u30d0\u30fc\u3092\u505c\u6b62\u3059\u308b\u306b\u306f:"}),(0,n.jsx)(s.pre,{children:(0,n.jsx)(s.code,{className:"language-sh",children:"sudo systemctl stop k3s\n"})}),(0,n.jsx)(s.p,{children:"\u30b5\u30fc\u30d0\u30fc\u3092\u518d\u8d77\u52d5\u3059\u308b\u306b\u306f:"}),(0,n.jsx)(s.pre,{children:(0,n.jsx)(s.code,{className:"language-sh",children:"sudo systemctl start k3s\n"})}),(0,n.jsx)(s.p,{children:"\u30a8\u30fc\u30b8\u30a7\u30f3\u30c8\u3092\u505c\u6b62\u3059\u308b\u306b\u306f:"}),(0,n.jsx)(s.pre,{children:(0,n.jsx)(s.code,{className:"language-sh",children:"sudo systemctl stop k3s-agent\n"})}),(0,n.jsx)(s.p,{children:"\u30a8\u30fc\u30b8\u30a7\u30f3\u30c8\u3092\u518d\u8d77\u52d5\u3059\u308b\u306b\u306f:"}),(0,n.jsx)(s.pre,{children:(0,n.jsx)(s.code,{className:"language-sh",children:"sudo systemctl start k3s-agent\n"})})]}),(0,n.jsxs)(l,{value:"OpenRC",children:[(0,n.jsx)(s.p,{children:"\u30b5\u30fc\u30d0\u30fc\u3092\u505c\u6b62\u3059\u308b\u306b\u306f:"}),(0,n.jsx)(s.pre,{children:(0,n.jsx)(s.code,{className:"language-sh",children:"sudo rc-service k3s stop\n"})}),(0,n.jsx)(s.p,{children:"\u30b5\u30fc\u30d0\u30fc\u3092\u518d\u8d77\u52d5\u3059\u308b\u306b\u306f:"}),(0,n.jsx)(s.pre,{children:(0,n.jsx)(s.code,{className:"language-sh",children:"sudo rc-service k3s restart\n"})}),(0,n.jsx)(s.p,{children:"\u30a8\u30fc\u30b8\u30a7\u30f3\u30c8\u3092\u505c\u6b62\u3059\u308b\u306b\u306f:"}),(0,n.jsx)(s.pre,{children:(0,n.jsx)(s.code,{className:"language-sh",children:"sudo rc-service k3s-agent stop\n"})}),(0,n.jsx)(s.p,{children:"\u30a8\u30fc\u30b8\u30a7\u30f3\u30c8\u3092\u518d\u8d77\u52d5\u3059\u308b\u306b\u306f:"}),(0,n.jsx)(s.pre,{children:(0,n.jsx)(s.code,{className:"language-sh",children:"sudo rc-service k3s-agent restart\n"})})]})]}),"\n",(0,n.jsx)(s.h2,{id:"killall\u30b9\u30af\u30ea\u30d7\u30c8",children:"Killall\u30b9\u30af\u30ea\u30d7\u30c8"}),"\n",(0,n.jsxs)(s.p,{children:["\u3059\u3079\u3066\u306eK3s\u30b3\u30f3\u30c6\u30ca\u3092\u505c\u6b62\u3057\u3001containerd\u306e\u72b6\u614b\u3092\u30ea\u30bb\u30c3\u30c8\u3059\u308b\u306b\u306f\u3001",(0,n.jsx)(s.code,{children:"k3s-killall.sh"}),"\u30b9\u30af\u30ea\u30d7\u30c8\u3092\u4f7f\u7528\u3067\u304d\u307e\u3059\u3002"]}),"\n",(0,n.jsx)(s.p,{children:"killall\u30b9\u30af\u30ea\u30d7\u30c8\u306f\u3001\u30b3\u30f3\u30c6\u30ca\u3001K3s\u30c7\u30a3\u30ec\u30af\u30c8\u30ea\u3001\u304a\u3088\u3073\u30cd\u30c3\u30c8\u30ef\u30fc\u30ad\u30f3\u30b0\u30b3\u30f3\u30dd\u30fc\u30cd\u30f3\u30c8\u3092\u30af\u30ea\u30fc\u30f3\u30a2\u30c3\u30d7\u3057\u3001\u95a2\u9023\u3059\u308b\u3059\u3079\u3066\u306e\u30eb\u30fc\u30eb\u3092\u6301\u3064iptables\u30c1\u30a7\u30fc\u30f3\u3092\u524a\u9664\u3057\u307e\u3059\u3002\u30af\u30e9\u30b9\u30bf\u30fc\u306e\u30c7\u30fc\u30bf\u306f\u524a\u9664\u3055\u308c\u307e\u305b\u3093\u3002"}),"\n",(0,n.jsx)(s.p,{children:"\u30b5\u30fc\u30d0\u30fc\u30ce\u30fc\u30c9\u304b\u3089killall\u30b9\u30af\u30ea\u30d7\u30c8\u3092\u5b9f\u884c\u3059\u308b\u306b\u306f\u3001\u6b21\u306e\u30b3\u30de\u30f3\u30c9\u3092\u5b9f\u884c\u3057\u307e\u3059:"}),"\n",(0,n.jsx)(s.pre,{children:(0,n.jsx)(s.code,{className:"language-bash",children:"/usr/local/bin/k3s-killall.sh\n"})})]})}function p(e={}){const{wrapper:s}={...(0,r.a)(),...e.components};return s?(0,n.jsx)(s,{...e,children:(0,n.jsx)(o,{...e})}):o(e)}function u(e,s){throw new Error("Expected "+(s?"component":"object")+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}},1151:(e,s,l)=>{l.d(s,{Z:()=>c,a:()=>a});var n=l(7294);const r={},t=n.createContext(r);function a(e){const s=n.useContext(t);return n.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function c(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:a(e.components),n.createElement(t.Provider,{value:s},e.children)}}}]);