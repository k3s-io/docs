"use strict";(self.webpackChunkk_3_s_docs=self.webpackChunkk_3_s_docs||[]).push([[1088],{8822:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>i,contentTitle:()=>c,default:()=>h,frontMatter:()=>t,metadata:()=>a,toc:()=>d});var r=s(5893),l=s(1151);const t={title:"\u30af\u30e9\u30b9\u30bf\u30fc\u30fb\u30ed\u30fc\u30c9\u30d0\u30e9\u30f3\u30b5\u30fc"},c=void 0,a={id:"datastore/cluster-loadbalancer",title:"\u30af\u30e9\u30b9\u30bf\u30fc\u30fb\u30ed\u30fc\u30c9\u30d0\u30e9\u30f3\u30b5\u30fc",description:"\u3053\u306e\u30bb\u30af\u30b7\u30e7\u30f3\u3067\u306f\u3001\u5916\u90e8\u30ed\u30fc\u30c9\u30d0\u30e9\u30f3\u30b5\u30fc\u3092\u9ad8\u53ef\u7528\u6027\uff08HA\uff09K3s\u30af\u30e9\u30b9\u30bf\u30fc\u306e\u30b5\u30fc\u30d0\u30fc\u30ce\u30fc\u30c9\u306e\u524d\u306b\u30a4\u30f3\u30b9\u30c8\u30fc\u30eb\u3059\u308b\u65b9\u6cd5\u306b\u3064\u3044\u3066\u8aac\u660e\u3057\u307e\u3059\u3002Nginx\u3068HAProxy\u306e2\u3064\u306e\u4f8b\u304c\u63d0\u4f9b\u3055\u308c\u3066\u3044\u307e\u3059\u3002",source:"@site/i18n/ja/docusaurus-plugin-content-docs/current/datastore/cluster-loadbalancer.md",sourceDirName:"datastore",slug:"/datastore/cluster-loadbalancer",permalink:"/ja/datastore/cluster-loadbalancer",draft:!1,unlisted:!1,editUrl:"https://github.com/k3s-io/docs/edit/main/docs/datastore/cluster-loadbalancer.md",tags:[],version:"current",lastUpdatedAt:1730740055e3,frontMatter:{title:"\u30af\u30e9\u30b9\u30bf\u30fc\u30fb\u30ed\u30fc\u30c9\u30d0\u30e9\u30f3\u30b5\u30fc"},sidebar:"mySidebar",previous:{title:"\u9ad8\u53ef\u7528\u6027\u5916\u90e8\u30c7\u30fc\u30bf\u30d9\u30fc\u30b9",permalink:"/ja/datastore/ha"},next:{title:"\u30a2\u30c3\u30d7\u30b0\u30ec\u30fc\u30c9",permalink:"/ja/upgrades/"}},i={},d=[{value:"\u524d\u63d0\u6761\u4ef6",id:"\u524d\u63d0\u6761\u4ef6",level:2},{value:"\u30ed\u30fc\u30c9\u30d0\u30e9\u30f3\u30b5\u30fc\u306e\u30bb\u30c3\u30c8\u30a2\u30c3\u30d7",id:"\u30ed\u30fc\u30c9\u30d0\u30e9\u30f3\u30b5\u30fc\u306e\u30bb\u30c3\u30c8\u30a2\u30c3\u30d7",level:2},{value:"Nginx\u30ed\u30fc\u30c9\u30d0\u30e9\u30f3\u30b5\u30fc",id:"nginx\u30ed\u30fc\u30c9\u30d0\u30e9\u30f3\u30b5\u30fc",level:2}];function o(e){const n={a:"a",admonition:"admonition",code:"code",h2:"h2",li:"li",ol:"ol",p:"p",pre:"pre",ul:"ul",...(0,l.a)(),...e.components},{TabItem:s,Tabs:t}=n;return s||x("TabItem",!0),t||x("Tabs",!0),(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.p,{children:"\u3053\u306e\u30bb\u30af\u30b7\u30e7\u30f3\u3067\u306f\u3001\u5916\u90e8\u30ed\u30fc\u30c9\u30d0\u30e9\u30f3\u30b5\u30fc\u3092\u9ad8\u53ef\u7528\u6027\uff08HA\uff09K3s\u30af\u30e9\u30b9\u30bf\u30fc\u306e\u30b5\u30fc\u30d0\u30fc\u30ce\u30fc\u30c9\u306e\u524d\u306b\u30a4\u30f3\u30b9\u30c8\u30fc\u30eb\u3059\u308b\u65b9\u6cd5\u306b\u3064\u3044\u3066\u8aac\u660e\u3057\u307e\u3059\u3002Nginx\u3068HAProxy\u306e2\u3064\u306e\u4f8b\u304c\u63d0\u4f9b\u3055\u308c\u3066\u3044\u307e\u3059\u3002"}),"\n",(0,r.jsxs)(n.admonition,{type:"tip",children:[(0,r.jsxs)(n.p,{children:["\u5916\u90e8\u30ed\u30fc\u30c9\u30d0\u30e9\u30f3\u30b5\u30fc\u306f\u3001Kubernetes LoadBalancer\u30b5\u30fc\u30d3\u30b9\u3092\u30b5\u30fc\u30c9\u30d1\u30fc\u30c6\u30a3\u306e\u30ed\u30fc\u30c9\u30d0\u30e9\u30f3\u30b5\u30fc\u30b3\u30f3\u30c8\u30ed\u30fc\u30e9\u30fc\u3092\u30c7\u30d7\u30ed\u30a4\u305b\u305a\u306b\u4f7f\u7528\u3067\u304d\u308b\u3088\u3046\u306b\u3059\u308b\u7d44\u307f\u8fbc\u307f\u30b3\u30f3\u30c8\u30ed\u30fc\u30e9\u30fc\u3067\u3042\u308bServiceLB\u3068\u6df7\u540c\u3057\u306a\u3044\u3067\u304f\u3060\u3055\u3044\u3002\u8a73\u7d30\u306b\u3064\u3044\u3066\u306f\u3001",(0,r.jsx)(n.a,{href:"/ja/networking/networking-services#service-load-balancer",children:"Service Load Balancer"}),"\u3092\u53c2\u7167\u3057\u3066\u304f\u3060\u3055\u3044\u3002"]}),(0,r.jsx)(n.p,{children:"\u5916\u90e8\u30ed\u30fc\u30c9\u30d0\u30e9\u30f3\u30b5\u30fc\u306f\u3001\u30ce\u30fc\u30c9\u306e\u767b\u9332\u7528\u306e\u56fa\u5b9a\u767b\u9332\u30a2\u30c9\u30ec\u30b9\u3092\u63d0\u4f9b\u3057\u305f\u308a\u3001Kubernetes API\u30b5\u30fc\u30d0\u30fc\u3078\u306e\u5916\u90e8\u30a2\u30af\u30bb\u30b9\u3092\u63d0\u4f9b\u3059\u308b\u305f\u3081\u306b\u4f7f\u7528\u3067\u304d\u307e\u3059\u3002LoadBalancer\u30b5\u30fc\u30d3\u30b9\u3092\u516c\u958b\u3059\u308b\u305f\u3081\u306b\u3001\u5916\u90e8\u30ed\u30fc\u30c9\u30d0\u30e9\u30f3\u30b5\u30fc\u306fServiceLB\u3068\u4e00\u7dd2\u306b\u3001\u307e\u305f\u306f\u4ee3\u308f\u308a\u306b\u4f7f\u7528\u3067\u304d\u307e\u3059\u304c\u3001\u307b\u3068\u3093\u3069\u306e\u5834\u5408\u3001MetalLB\u3084Kube-VIP\u306a\u3069\u306e\u4ee3\u66ff\u30ed\u30fc\u30c9\u30d0\u30e9\u30f3\u30b5\u30fc\u30b3\u30f3\u30c8\u30ed\u30fc\u30e9\u30fc\u306e\u65b9\u304c\u826f\u3044\u9078\u629e\u3067\u3059\u3002"})]}),"\n",(0,r.jsx)(n.h2,{id:"\u524d\u63d0\u6761\u4ef6",children:"\u524d\u63d0\u6761\u4ef6"}),"\n",(0,r.jsx)(n.p,{children:"\u3053\u306e\u4f8b\u306e\u3059\u3079\u3066\u306e\u30ce\u30fc\u30c9\u306fUbuntu 20.04\u3092\u5b9f\u884c\u3057\u3066\u3044\u307e\u3059\u3002"}),"\n",(0,r.jsxs)(n.p,{children:["\u4e21\u65b9\u306e\u4f8b\u3067\u306f\u3001",(0,r.jsx)(n.a,{href:"/ja/datastore/ha-embedded",children:"\u7d44\u307f\u8fbc\u307fetcd\u3092\u4f7f\u7528\u3057\u305fHA K3s\u30af\u30e9\u30b9\u30bf\u30fc"}),"\u304c3\u3064\u306e\u30ce\u30fc\u30c9\u306b\u30a4\u30f3\u30b9\u30c8\u30fc\u30eb\u3055\u308c\u3066\u3044\u308b\u3068\u4eee\u5b9a\u3057\u307e\u3059\u3002"]}),"\n",(0,r.jsx)(n.p,{children:"\u5404k3s\u30b5\u30fc\u30d0\u30fc\u306f\u6b21\u306e\u3088\u3046\u306b\u69cb\u6210\u3055\u308c\u3066\u3044\u307e\u3059\uff1a"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-yaml",children:"# /etc/rancher/k3s/config.yaml\ntoken: lb-cluster-gd\ntls-san: 10.10.10.100\n"})}),"\n",(0,r.jsx)(n.p,{children:"\u30ce\u30fc\u30c9\u306e\u30db\u30b9\u30c8\u540d\u3068IP\u306f\u6b21\u306e\u901a\u308a\u3067\u3059\uff1a"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:["server-1: ",(0,r.jsx)(n.code,{children:"10.10.10.50"})]}),"\n",(0,r.jsxs)(n.li,{children:["server-2: ",(0,r.jsx)(n.code,{children:"10.10.10.51"})]}),"\n",(0,r.jsxs)(n.li,{children:["server-3: ",(0,r.jsx)(n.code,{children:"10.10.10.52"})]}),"\n"]}),"\n",(0,r.jsx)(n.p,{children:"\u30ed\u30fc\u30c9\u30d0\u30e9\u30f3\u30b7\u30f3\u30b0\u7528\u306b\u8ffd\u52a0\u306e2\u3064\u306e\u30ce\u30fc\u30c9\u304c\u30db\u30b9\u30c8\u540d\u3068IP\u3067\u69cb\u6210\u3055\u308c\u3066\u3044\u307e\u3059\uff1a"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:["lb-1: ",(0,r.jsx)(n.code,{children:"10.10.10.98"})]}),"\n",(0,r.jsxs)(n.li,{children:["lb-2: ",(0,r.jsx)(n.code,{children:"10.10.10.99"})]}),"\n"]}),"\n",(0,r.jsx)(n.p,{children:"\u8ffd\u52a0\u306e3\u3064\u306e\u30ce\u30fc\u30c9\u304c\u30db\u30b9\u30c8\u540d\u3068IP\u3067\u5b58\u5728\u3057\u307e\u3059\uff1a"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:["agent-1: ",(0,r.jsx)(n.code,{children:"10.10.10.101"})]}),"\n",(0,r.jsxs)(n.li,{children:["agent-2: ",(0,r.jsx)(n.code,{children:"10.10.10.102"})]}),"\n",(0,r.jsxs)(n.li,{children:["agent-3: ",(0,r.jsx)(n.code,{children:"10.10.10.103"})]}),"\n"]}),"\n",(0,r.jsx)(n.h2,{id:"\u30ed\u30fc\u30c9\u30d0\u30e9\u30f3\u30b5\u30fc\u306e\u30bb\u30c3\u30c8\u30a2\u30c3\u30d7",children:"\u30ed\u30fc\u30c9\u30d0\u30e9\u30f3\u30b5\u30fc\u306e\u30bb\u30c3\u30c8\u30a2\u30c3\u30d7"}),"\n",(0,r.jsxs)(t,{children:[(0,r.jsxs)(s,{value:"HAProxy",default:!0,children:[(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.a,{href:"http://www.haproxy.org/",children:"HAProxy"}),"\u306f\u3001TCP\u30ed\u30fc\u30c9\u30d0\u30e9\u30f3\u30b5\u30fc\u3092\u63d0\u4f9b\u3059\u308b\u30aa\u30fc\u30d7\u30f3\u30bd\u30fc\u30b9\u306e\u30aa\u30d7\u30b7\u30e7\u30f3\u3067\u3059\u3002\u307e\u305f\u3001\u30ed\u30fc\u30c9\u30d0\u30e9\u30f3\u30b5\u30fc\u81ea\u4f53\u306eHA\u3092\u30b5\u30dd\u30fc\u30c8\u3057\u3001\u3059\u3079\u3066\u306e\u30ec\u30d9\u30eb\u3067\u5197\u9577\u6027\u3092\u78ba\u4fdd\u3057\u307e\u3059\u3002\u8a73\u7d30\u306b\u3064\u3044\u3066\u306f\u3001",(0,r.jsx)(n.a,{href:"http://docs.haproxy.org/2.8/intro.html",children:"HAProxy Documentation"}),"\u3092\u53c2\u7167\u3057\u3066\u304f\u3060\u3055\u3044\u3002"]}),(0,r.jsxs)(n.p,{children:["\u3055\u3089\u306b\u3001\u30af\u30e9\u30b9\u30bf\u30fc\u306b\u30a2\u30af\u30bb\u30b9\u3059\u308b\u305f\u3081\u306b\u4f7f\u7528\u3055\u308c\u308b\u4eee\u60f3IP\uff08VIP\uff09\u3092\u751f\u6210\u3059\u308b\u305f\u3081\u306bKeepAlived\u3092\u4f7f\u7528\u3057\u307e\u3059\u3002\u8a73\u7d30\u306b\u3064\u3044\u3066\u306f\u3001",(0,r.jsx)(n.a,{href:"https://www.keepalived.org/manpage.html",children:"KeepAlived Documentation"}),"\u3092\u53c2\u7167\u3057\u3066\u304f\u3060\u3055\u3044\u3002"]}),(0,r.jsxs)(n.ol,{children:["\n",(0,r.jsx)(n.li,{children:"HAProxy\u3068KeepAlived\u3092\u30a4\u30f3\u30b9\u30c8\u30fc\u30eb\u3057\u307e\u3059\uff1a"}),"\n"]}),(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"sudo apt-get install haproxy keepalived\n"})}),(0,r.jsxs)(n.ol,{start:"2",children:["\n",(0,r.jsxs)(n.li,{children:["lb-1\u3068lb-2\u306e",(0,r.jsx)(n.code,{children:"/etc/haproxy/haproxy.cfg"}),"\u306b\u6b21\u306e\u5185\u5bb9\u3092\u8ffd\u52a0\u3057\u307e\u3059\uff1a"]}),"\n"]}),(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{children:"frontend k3s-frontend\n    bind *:6443\n    mode tcp\n    option tcplog\n    default_backend k3s-backend\n\nbackend k3s-backend\n    mode tcp\n    option tcp-check\n    balance roundrobin\n    default-server inter 10s downinter 5s\n    server server-1 10.10.10.50:6443 check\n    server server-2 10.10.10.51:6443 check\n    server server-3 10.10.10.52:6443 check\n"})}),(0,r.jsxs)(n.ol,{start:"3",children:["\n",(0,r.jsxs)(n.li,{children:["lb-1\u3068lb-2\u306e",(0,r.jsx)(n.code,{children:"/etc/keepalived/keepalived.conf"}),"\u306b\u6b21\u306e\u5185\u5bb9\u3092\u8ffd\u52a0\u3057\u307e\u3059\uff1a"]}),"\n"]}),(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{children:"vrrp_script chk_haproxy {\n    script 'killall -0 haproxy' # pidof\u3088\u308a\u3082\u9ad8\u901f\n    interval 2\n}\n\nvrrp_instance haproxy-vip {\n    interface eth1\n    state <STATE> # lb-1\u3067\u306fMASTER\u3001lb-2\u3067\u306fBACKUP\n    priority <PRIORITY> # lb-1\u3067\u306f200\u3001lb-2\u3067\u306f100\n\n    virtual_router_id 51\n\n    virtual_ipaddress {\n        10.10.10.100/24\n    }\n\n    track_script {\n        chk_haproxy\n    }\n}\n"})}),(0,r.jsxs)(n.ol,{start:"4",children:["\n",(0,r.jsx)(n.li,{children:"lb-1\u3068lb-2\u3067HAProxy\u3068KeepAlived\u3092\u518d\u8d77\u52d5\u3057\u307e\u3059\uff1a"}),"\n"]}),(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"systemctl restart haproxy\nsystemctl restart keepalived\n"})}),(0,r.jsxs)(n.ol,{start:"5",children:["\n",(0,r.jsx)(n.li,{children:"agent-1\u3001agent-2\u3001\u304a\u3088\u3073agent-3\u3067\u6b21\u306e\u30b3\u30de\u30f3\u30c9\u3092\u5b9f\u884c\u3057\u3066k3s\u3092\u30a4\u30f3\u30b9\u30c8\u30fc\u30eb\u3057\u3001\u30af\u30e9\u30b9\u30bf\u30fc\u306b\u53c2\u52a0\u3057\u307e\u3059\uff1a"}),"\n"]}),(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"curl -sfL https://get.k3s.io | K3S_TOKEN=lb-cluster-gd sh -s - agent --server https://10.10.10.100:6443\n"})}),(0,r.jsxs)(n.p,{children:["\u30b5\u30fc\u30d0\u30fc\u30ce\u30fc\u30c9\u304b\u3089",(0,r.jsx)(n.code,{children:"kubectl"}),"\u3092\u4f7f\u7528\u3057\u3066\u30af\u30e9\u30b9\u30bf\u30fc\u3068\u5bfe\u8a71\u3067\u304d\u307e\u3059\u3002"]}),(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"root@server-1 $ k3s kubectl get nodes -A\nNAME       STATUS   ROLES                       AGE     VERSION\nagent-1    Ready    <none>                      32s     v1.27.3+k3s1\nagent-2    Ready    <none>                      20s     v1.27.3+k3s1\nagent-3    Ready    <none>                      9s      v1.27.3+k3s1\nserver-1   Ready    control-plane,etcd,master   4m22s   v1.27.3+k3s1\nserver-2   Ready    control-plane,etcd,master   3m58s   v1.27.3+k3s1\nserver-3   Ready    control-plane,etcd,master   3m12s   v1.27.3+k3s1\n"})})]}),(0,r.jsxs)(s,{value:"Nginx",children:[(0,r.jsx)(n.h2,{id:"nginx\u30ed\u30fc\u30c9\u30d0\u30e9\u30f3\u30b5\u30fc",children:"Nginx\u30ed\u30fc\u30c9\u30d0\u30e9\u30f3\u30b5\u30fc"}),(0,r.jsx)(n.admonition,{type:"danger",children:(0,r.jsx)(n.p,{children:"Nginx\u306f\u30cd\u30a4\u30c6\u30a3\u30d6\u306b\u9ad8\u53ef\u7528\u6027\uff08HA\uff09\u69cb\u6210\u3092\u30b5\u30dd\u30fc\u30c8\u3057\u3066\u3044\u307e\u305b\u3093\u3002HA\u30af\u30e9\u30b9\u30bf\u30fc\u3092\u8a2d\u5b9a\u3059\u308b\u5834\u5408\u3001K3s\u306e\u524d\u306b\u5358\u4e00\u306e\u30ed\u30fc\u30c9\u30d0\u30e9\u30f3\u30b5\u30fc\u3092\u914d\u7f6e\u3059\u308b\u3068\u3001\u5358\u4e00\u969c\u5bb3\u70b9\u304c\u518d\u5c0e\u5165\u3055\u308c\u307e\u3059\u3002"})}),(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.a,{href:"http://nginx.org/",children:"Nginx Open Source"}),"\u306f\u3001TCP\u30ed\u30fc\u30c9\u30d0\u30e9\u30f3\u30b5\u30fc\u3092\u63d0\u4f9b\u3057\u307e\u3059\u3002\u8a73\u7d30\u306b\u3064\u3044\u3066\u306f\u3001",(0,r.jsx)(n.a,{href:"https://nginx.org/en/docs/http/load_balancing.html",children:"Using nginx as HTTP load balancer"}),"\u3092\u53c2\u7167\u3057\u3066\u304f\u3060\u3055\u3044\u3002"]}),(0,r.jsxs)(n.ol,{children:["\n",(0,r.jsxs)(n.li,{children:["lb-1\u306b\u6b21\u306e\u5185\u5bb9\u306e",(0,r.jsx)(n.code,{children:"nginx.conf"}),"\u30d5\u30a1\u30a4\u30eb\u3092\u4f5c\u6210\u3057\u307e\u3059\uff1a"]}),"\n"]}),(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{children:"events {}\n\nstream {\n  upstream k3s_servers {\n    server 10.10.10.50:6443;\n    server 10.10.10.51:6443;\n    server 10.10.10.52:6443;\n  }\n\n  server {\n    listen 6443;\n    proxy_pass k3s_servers;\n  }\n}\n"})}),(0,r.jsxs)(n.ol,{start:"2",children:["\n",(0,r.jsx)(n.li,{children:"lb-1\u3067Nginx\u30ed\u30fc\u30c9\u30d0\u30e9\u30f3\u30b5\u30fc\u3092\u5b9f\u884c\u3057\u307e\u3059\uff1a"}),"\n"]}),(0,r.jsx)(n.p,{children:"Docker\u3092\u4f7f\u7528\u3059\u308b\u5834\u5408\uff1a"}),(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"docker run -d --restart unless-stopped \\\n    -v ${PWD}/nginx.conf:/etc/nginx/nginx.conf \\\n    -p 6443:6443 \\\n    nginx:stable\n"})}),(0,r.jsxs)(n.p,{children:["\u307e\u305f\u306f",(0,r.jsx)(n.a,{href:"https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-open-source/",children:"Nginx\u3092\u30a4\u30f3\u30b9\u30c8\u30fc\u30eb"}),"\u3057\u3066\u304b\u3089\u6b21\u3092\u5b9f\u884c\u3057\u307e\u3059\uff1a"]}),(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"cp nginx.conf /etc/nginx/nginx.conf\nsystemctl start nginx\n"})}),(0,r.jsxs)(n.ol,{start:"3",children:["\n",(0,r.jsx)(n.li,{children:"agent-1\u3001agent-2\u3001\u304a\u3088\u3073agent-3\u3067\u6b21\u306e\u30b3\u30de\u30f3\u30c9\u3092\u5b9f\u884c\u3057\u3066k3s\u3092\u30a4\u30f3\u30b9\u30c8\u30fc\u30eb\u3057\u3001\u30af\u30e9\u30b9\u30bf\u30fc\u306b\u53c2\u52a0\u3057\u307e\u3059\uff1a"}),"\n"]}),(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"curl -sfL https://get.k3s.io | K3S_TOKEN=lb-cluster-gd sh -s - agent --server https://10.10.10.98:6443\n"})}),(0,r.jsxs)(n.p,{children:["\u30b5\u30fc\u30d0\u30fc\u30ce\u30fc\u30c9\u304b\u3089",(0,r.jsx)(n.code,{children:"kubectl"}),"\u3092\u4f7f\u7528\u3057\u3066\u30af\u30e9\u30b9\u30bf\u30fc\u3068\u5bfe\u8a71\u3067\u304d\u307e\u3059\u3002"]}),(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-bash",children:"root@server1 $ k3s kubectl get nodes -A\nNAME       STATUS   ROLES                       AGE     VERSION\nagent-1    Ready    <none>                      30s     v1.27.3+k3s1\nagent-2    Ready    <none>                      22s     v1.27.3+k3s1\nagent-3    Ready    <none>                      13s     v1.27.3+k3s1\nserver-1   Ready    control-plane,etcd,master   4m49s   v1.27.3+k3s1\nserver-2   Ready    control-plane,etcd,master   3m58s   v1.27.3+k3s1\nserver-3   Ready    control-plane,etcd,master   3m16s   v1.27.3+k3s1\n"})})]})]})]})}function h(e={}){const{wrapper:n}={...(0,l.a)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(o,{...e})}):o(e)}function x(e,n){throw new Error("Expected "+(n?"component":"object")+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}},1151:(e,n,s)=>{s.d(n,{Z:()=>a,a:()=>c});var r=s(7294);const l={},t=r.createContext(l);function c(e){const n=r.useContext(t);return r.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function a(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(l):e.components||l:c(e.components),r.createElement(t.Provider,{value:n},e.children)}}}]);