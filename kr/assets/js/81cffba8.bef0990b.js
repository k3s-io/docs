"use strict";(self.webpackChunkk_3_s_docs=self.webpackChunkk_3_s_docs||[]).push([[804],{8247:(n,e,i)=>{i.r(e),i.d(e,{assets:()=>d,contentTitle:()=>t,default:()=>u,frontMatter:()=>l,metadata:()=>c,toc:()=>o});var s=i(5893),r=i(1151);const l={slug:"/",title:"K3s - Lightweight Kubernetes"},t="k3s\ub780 \ubb34\uc5c7\uc785\ub2c8\uae4c?",c={id:"introduction",title:"K3s - Lightweight Kubernetes",description:"\uacbd\ub7c9\uc758 \ucfe0\ubc84\ub124\ud2f0\uc2a4. \uac04\ud3b8\ud55c \uc124\uce58\uc640 \uc808\ubc18\uc758 \uba54\ubaa8\ub9ac, \ubaa8\ub4e0\uac78 100MB \ubbf8\ub9cc\uc758 \ubc14\uc774\ub108\ub9ac\ub85c \uc81c\uacf5\ud569\ub2c8\ub2e4.",source:"@site/i18n/kr/docusaurus-plugin-content-docs/current/introduction.md",sourceDirName:".",slug:"/",permalink:"/kr/",draft:!1,unlisted:!1,editUrl:"https://github.com/k3s-io/docs/edit/main/docs/introduction.md",tags:[],version:"current",lastUpdatedAt:172080213e4,frontMatter:{slug:"/",title:"K3s - Lightweight Kubernetes"},sidebar:"mySidebar",next:{title:"\ube60\ub978 \uc2dc\uc791 \uac00\uc774\ub4dc",permalink:"/kr/quick-start"}},d={},o=[];function h(n){const e={h1:"h1",li:"li",p:"p",ul:"ul",...(0,r.a)(),...n.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(e.p,{children:"\uacbd\ub7c9\uc758 \ucfe0\ubc84\ub124\ud2f0\uc2a4. \uac04\ud3b8\ud55c \uc124\uce58\uc640 \uc808\ubc18\uc758 \uba54\ubaa8\ub9ac, \ubaa8\ub4e0\uac78 100MB \ubbf8\ub9cc\uc758 \ubc14\uc774\ub108\ub9ac\ub85c \uc81c\uacf5\ud569\ub2c8\ub2e4."}),"\n",(0,s.jsx)(e.p,{children:"\uc801\ud569\ud55c \ud658\uacbd:"}),"\n",(0,s.jsxs)(e.ul,{children:["\n",(0,s.jsx)(e.li,{children:"\uc5e3\uc9c0(Edge)"}),"\n",(0,s.jsx)(e.li,{children:"\uc0ac\ubb3c\uc778\ud130\ub137(IoT)"}),"\n",(0,s.jsx)(e.li,{children:"\uc9c0\uc18d\uc801\uc778 \ud1b5\ud569(CI)"}),"\n",(0,s.jsx)(e.li,{children:"\uac1c\ubc1c"}),"\n",(0,s.jsx)(e.li,{children:"ARM"}),"\n",(0,s.jsx)(e.li,{children:"\uc784\ubca0\ub529 K8s"}),"\n",(0,s.jsx)(e.li,{children:"k8s \ud074\ub7ec\uc2a4\ud130 \ubd84\uc57c\uc758 \ubc15\uc0ac \ud559\uc704\ub97c \ucde8\ub4dd\ud558\uae30 \uc5b4\ub824\uc6b4 \uc0c1\ud669"}),"\n"]}),"\n",(0,s.jsx)(e.h1,{id:"k3s\ub780-\ubb34\uc5c7\uc785\ub2c8\uae4c",children:"k3s\ub780 \ubb34\uc5c7\uc785\ub2c8\uae4c?"}),"\n",(0,s.jsx)(e.p,{children:"K3s\ub294 \ucfe0\ubc84\ub124\ud2f0\uc2a4\uc640 \uc644\uc804\ud788 \ud638\ud658\ub418\uba70 \ub2e4\uc74c\uacfc \uac19\uc740 \ud5a5\uc0c1\ub41c \uae30\ub2a5\uc744 \uac16\ucd98 \ubc30\ud3ec\ud310\uc785\ub2c8\ub2e4:"}),"\n",(0,s.jsxs)(e.ul,{children:["\n",(0,s.jsx)(e.li,{children:"\ub2e8\uc77c \ubc14\uc774\ub108\ub9ac\ub85c \ud328\ud0a4\uc9c0\ud654."}),"\n",(0,s.jsx)(e.li,{children:"\uae30\ubcf8 \uc2a4\ud1a0\ub9ac\uc9c0 \uba54\ucee4\ub2c8\uc998\uc73c\ub85c sqlite3\ub97c \uae30\ubc18\uc73c\ub85c \ud558\ub294 \uacbd\ub7c9 \uc2a4\ud1a0\ub9ac\uc9c0 \ubc31\uc5d4\ub4dc. etcd3, MySQL, Postgres\ub3c4 \uc0ac\uc6a9 \uac00\ub2a5."}),"\n",(0,s.jsx)(e.li,{children:"\ubcf5\uc7a1\ud55c TLS \ubc0f \uc635\uc158\uc744 \ucc98\ub9ac\ud558\ub294 \uac04\ub2e8\ud55c \ub7f0\ucc98\uc5d0 \ud3ec\ud568."}),"\n",(0,s.jsx)(e.li,{children:"\uacbd\ub7c9 \ud658\uacbd\uc744 \uc704\ud55c \ud569\ub9ac\uc801\uc778 \uae30\ubcf8\uac12\uc73c\ub85c \uae30\ubcf8\uc801\uc73c\ub85c \ubcf4\uc548\uc744 \uc720\uc9c0\ud568."}),"\n",(0,s.jsxs)(e.li,{children:["\ub2e4\uc74c\uacfc \uac19\uc774 \uac04\ub2e8\ud558\uc9c0\ub9cc \uac15\ub825\ud55c 'batteries-included' \uae30\ub2a5 \ucd94\uac00. \uc608\ub97c \ub4e4\uc5b4:","\n",(0,s.jsxs)(e.ul,{children:["\n",(0,s.jsx)(e.li,{children:"local storage provider"}),"\n",(0,s.jsx)(e.li,{children:"service load balancer"}),"\n",(0,s.jsx)(e.li,{children:"Helm controller"}),"\n",(0,s.jsx)(e.li,{children:"Traefik ingress controller"}),"\n"]}),"\n"]}),"\n",(0,s.jsx)(e.li,{children:"\ubaa8\ub4e0 \ucfe0\ubc84\ub124\ud2f0\uc2a4 \ucee8\ud2b8\ub864 \ud50c\ub808\uc778 \uad6c\uc131 \uc694\uc18c\uc758 \uc791\ub3d9\uc740 \ub2e8\uc77c \ubc14\uc774\ub108\ub9ac \ubc0f \ud504\ub85c\uc138\uc2a4\ub85c \ucea1\uc290\ud654. \uc774\ub97c \ud1b5\ud574 K3s\ub294 \uc778\uc99d\uc11c \ubc30\ud3ec\uc640 \uac19\uc740 \ubcf5\uc7a1\ud55c \ud074\ub7ec\uc2a4\ud130 \uc791\uc5c5\uc744 \uc790\ub3d9\ud654\ud558\uace0 \uad00\ub9ac."}),"\n",(0,s.jsx)(e.li,{children:"\uc678\ubd80 \uc885\uc18d\uc131 \ucd5c\uc18c\ud654(\ucd5c\uc2e0 \ucee4\ub110\uacfc cgroup \ub9c8\uc6b4\ud2b8\ub9cc \ud544\uc694)"}),"\n"]}),"\n",(0,s.jsx)(e.p,{children:"K3s\ub294 \ub2e4\uc74c\uacfc \uac19\uc740 \ud544\uc218 \uc885\uc18d\uc131\uc744 \ud328\ud0a4\uc9c0\ub85c \uc81c\uacf5\ud569\ub2c8\ub2e4:"}),"\n",(0,s.jsxs)(e.ul,{children:["\n",(0,s.jsx)(e.li,{children:"Containerd"}),"\n",(0,s.jsx)(e.li,{children:"Flannel (CNI)"}),"\n",(0,s.jsx)(e.li,{children:"CoreDNS"}),"\n",(0,s.jsx)(e.li,{children:"Traefik (\uc778\uadf8\ub808\uc2a4)"}),"\n",(0,s.jsx)(e.li,{children:"Klipper-lb (\uc11c\ube44\uc2a4 \ub85c\ub4dc\ubc38\ub7f0\uc11c)"}),"\n",(0,s.jsx)(e.li,{children:"\uc784\ubca0\ub514\ub4dc \ub124\ud2b8\uc6cc\ud06c \uc815\ucc45 \ucee8\ud2b8\ub864\ub7ec"}),"\n",(0,s.jsx)(e.li,{children:"\uc784\ubca0\ub514\ub4dc \ub85c\uceec \uacbd\ub85c \ud504\ub85c\ube44\uc800\ub108"}),"\n",(0,s.jsx)(e.li,{children:"\ud638\uc2a4\ud2b8 \uc720\ud2f8\ub9ac\ud2f0(iptables, socat \ub4f1)"}),"\n"]}),"\n",(0,s.jsx)(e.h1,{id:"\uc774\ub984\uc5d0\ub294-\ubb34\uc2a8-\ub73b\uc774-\uc788\ub098\uc694",children:"\uc774\ub984\uc5d0\ub294 \ubb34\uc2a8 \ub73b\uc774 \uc788\ub098\uc694?"}),"\n",(0,s.jsx)(e.p,{children:"\uc6b0\ub9ac\ub294 \uba54\ubaa8\ub9ac \ud48b\ud504\ub9b0\ud2b8 \uce21\uba74\uc5d0\uc11c \uc808\ubc18 \ud06c\uae30\uc758 Kubernetes\ub97c \uc124\uce58\ud558\uae30\ub97c \uc6d0\ud588\uc2b5\ub2c8\ub2e4. Kubernetes\ub294 K8s\ub85c \ud45c\uae30\ub418\ub294 10\uae00\uc790 \ub2e8\uc5b4\uc785\ub2c8\ub2e4. \ub530\ub77c\uc11c \ucfe0\ubc84\ub124\ud2f0\uc2a4\uc758 \uc808\ubc18 \ud06c\uae30\ub77c\uba74 K3s\ub85c \ud45c\uae30\ub41c 5\uae00\uc790 \ub2e8\uc5b4\uac00 \ub420 \uac83\uc785\ub2c8\ub2e4. K3s\uc758 \uae34 \ud615\ud0dc\ub294 \uc5c6\uc73c\uba70 \uacf5\uc2dd\uc801\uc778 \ubc1c\uc74c\ub3c4 \uc5c6\uc2b5\ub2c8\ub2e4."})]})}function u(n={}){const{wrapper:e}={...(0,r.a)(),...n.components};return e?(0,s.jsx)(e,{...n,children:(0,s.jsx)(h,{...n})}):h(n)}},1151:(n,e,i)=>{i.d(e,{Z:()=>c,a:()=>t});var s=i(7294);const r={},l=s.createContext(r);function t(n){const e=s.useContext(l);return s.useMemo((function(){return"function"==typeof n?n(e):{...e,...n}}),[e,n])}function c(n){let e;return e=n.disableParentContext?"function"==typeof n.components?n.components(r):n.components||r:t(n.components),s.createElement(l.Provider,{value:e},n.children)}}}]);