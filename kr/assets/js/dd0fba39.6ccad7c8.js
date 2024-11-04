"use strict";(self.webpackChunkk_3_s_docs=self.webpackChunkk_3_s_docs||[]).push([[7713],{6964:(e,s,t)=>{t.r(s),t.d(s,{assets:()=>l,contentTitle:()=>c,default:()=>a,frontMatter:()=>n,metadata:()=>i,toc:()=>o});var r=t(5893),d=t(1151);const n={title:"\ud074\ub7ec\uc2a4\ud130 \ub370\uc774\ud130 \uc800\uc7a5\uc18c"},c=void 0,i={id:"datastore/datastore",title:"\ud074\ub7ec\uc2a4\ud130 \ub370\uc774\ud130 \uc800\uc7a5\uc18c",description:"etcd\uac00 \uc544\ub2cc \ub2e4\ub978 \ub370\uc774\ud130\uc2a4\ud1a0\uc5b4\ub97c \uc0ac\uc6a9\ud558\uc5ec \ucfe0\ubc84\ub124\ud2f0\uc2a4\ub97c \uc2e4\ud589\ud560 \uc218 \uc788\ub294 \uae30\ub2a5\uc740 K3s\ub97c \ub2e4\ub978 \ucfe0\ubc84\ub124\ud2f0\uc2a4 \ubc30\ud3ec\ud310\uacfc \ucc28\ubcc4\ud654\ud569\ub2c8\ub2e4. \uc774 \uae30\ub2a5\uc740 \ucfe0\ubc84\ub124\ud2f0\uc2a4 \uc6b4\uc601\uc790\uc5d0\uac8c \uc720\uc5f0\uc131\uc744 \uc81c\uacf5\ud569\ub2c8\ub2e4. \uc0ac\uc6a9 \uac00\ub2a5\ud55c \ub370\uc774\ud130\uc2a4\ud1a0\uc5b4 \uc635\uc158\uc744 \ud1b5\ud574 \uc0ac\uc6a9 \uc0ac\ub840\uc5d0 \uac00\uc7a5 \uc801\ud569\ud55c \ub370\uc774\ud130\uc2a4\ud1a0\uc5b4\ub97c \uc120\ud0dd\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4. \uc608\ub97c \ub4e4\uc5b4:",source:"@site/i18n/kr/docusaurus-plugin-content-docs/current/datastore/datastore.md",sourceDirName:"datastore",slug:"/datastore/",permalink:"/kr/datastore/",draft:!1,unlisted:!1,editUrl:"https://github.com/k3s-io/docs/edit/main/docs/datastore/datastore.md",tags:[],version:"current",lastUpdatedAt:1730740055e3,frontMatter:{title:"\ud074\ub7ec\uc2a4\ud130 \ub370\uc774\ud130 \uc800\uc7a5\uc18c"},sidebar:"mySidebar",previous:{title:"Uninstalling K3s",permalink:"/kr/installation/uninstall"},next:{title:"Backup and Restore",permalink:"/kr/datastore/backup-restore"}},l={},o=[{value:"\uc678\ubd80 \ub370\uc774\ud130\uc2a4\ud1a0\uc5b4 \uad6c\uc131 \ud30c\ub77c\ubbf8\ud130",id:"\uc678\ubd80-\ub370\uc774\ud130\uc2a4\ud1a0\uc5b4-\uad6c\uc131-\ud30c\ub77c\ubbf8\ud130",level:3},{value:"\ub370\uc774\ud130\uc2a4\ud1a0\uc5b4 \uc5d4\ub4dc\ud3ec\uc778\ud2b8 \ud615\uc2dd \ubc0f \uae30\ub2a5",id:"\ub370\uc774\ud130\uc2a4\ud1a0\uc5b4-\uc5d4\ub4dc\ud3ec\uc778\ud2b8-\ud615\uc2dd-\ubc0f-\uae30\ub2a5",level:3}];function h(e){const s={a:"a",br:"br",code:"code",h3:"h3",li:"li",p:"p",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,d.a)(),...e.components},{TabItem:t,Tabs:n}=s;return t||x("TabItem",!0),n||x("Tabs",!0),(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(s.p,{children:"etcd\uac00 \uc544\ub2cc \ub2e4\ub978 \ub370\uc774\ud130\uc2a4\ud1a0\uc5b4\ub97c \uc0ac\uc6a9\ud558\uc5ec \ucfe0\ubc84\ub124\ud2f0\uc2a4\ub97c \uc2e4\ud589\ud560 \uc218 \uc788\ub294 \uae30\ub2a5\uc740 K3s\ub97c \ub2e4\ub978 \ucfe0\ubc84\ub124\ud2f0\uc2a4 \ubc30\ud3ec\ud310\uacfc \ucc28\ubcc4\ud654\ud569\ub2c8\ub2e4. \uc774 \uae30\ub2a5\uc740 \ucfe0\ubc84\ub124\ud2f0\uc2a4 \uc6b4\uc601\uc790\uc5d0\uac8c \uc720\uc5f0\uc131\uc744 \uc81c\uacf5\ud569\ub2c8\ub2e4. \uc0ac\uc6a9 \uac00\ub2a5\ud55c \ub370\uc774\ud130\uc2a4\ud1a0\uc5b4 \uc635\uc158\uc744 \ud1b5\ud574 \uc0ac\uc6a9 \uc0ac\ub840\uc5d0 \uac00\uc7a5 \uc801\ud569\ud55c \ub370\uc774\ud130\uc2a4\ud1a0\uc5b4\ub97c \uc120\ud0dd\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4. \uc608\ub97c \ub4e4\uc5b4:"}),"\n",(0,r.jsxs)(s.ul,{children:["\n",(0,r.jsx)(s.li,{children:"\ud300\uc5d0 etcd \uc6b4\uc601\uc5d0 \ub300\ud55c \uc804\ubb38 \uc9c0\uc2dd\uc774 \uc5c6\ub294 \uacbd\uc6b0, MySQL \ub610\ub294 PostgreSQL\uacfc \uac19\uc740 \uc5d4\ud130\ud504\ub77c\uc774\uc988\uae09 SQL \ub370\uc774\ud130\ubca0\uc774\uc2a4\ub97c \uc120\ud0dd\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4."}),"\n",(0,r.jsx)(s.li,{children:"CI/CD \ud658\uacbd\uc5d0\uc11c \ub2e8\uc21c\ud558\uace0 \uc218\uba85\uc774 \uc9e7\uc740 \ud074\ub7ec\uc2a4\ud130\ub97c \uc2e4\ud589\ud574\uc57c \ud558\ub294 \uacbd\uc6b0, \uc784\ubca0\ub514\ub4dc SQLite \ub370\uc774\ud130\ubca0\uc774\uc2a4\ub97c \uc0ac\uc6a9\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4."}),"\n",(0,r.jsx)(s.li,{children:"\uc5e3\uc9c0\uc5d0 Kubernetes\ub97c \ubc30\ud3ec\ud558\uace0 \uace0\uac00\uc6a9\uc131 \uc194\ub8e8\uc158\uc774 \ud544\uc694\ud558\uc9c0\ub9cc \uc5e3\uc9c0\uc5d0\uc11c \ub370\uc774\ud130\ubca0\uc774\uc2a4\ub97c \uad00\ub9ac\ud558\ub294 \ub370 \ub530\ub978 \uc6b4\uc601 \uc624\ubc84\ud5e4\ub4dc\ub97c \uac10\ub2f9\ud560 \uc218 \uc5c6\ub294 \uacbd\uc6b0, \uc784\ubca0\ub514\ub4dc etcd\ub97c \uae30\ubc18\uc73c\ub85c \uad6c\ucd95\ub41c K3s\uc758 \uc784\ubca0\ub514\ub4dc HA \ub370\uc774\ud130\uc2a4\ud1a0\uc5b4\ub97c \uc0ac\uc6a9\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4."}),"\n"]}),"\n",(0,r.jsx)(s.p,{children:"K3s\ub294 \ub2e4\uc74c\uacfc \uac19\uc740 \ub370\uc774\ud130\uc2a4\ud1a0\uc5b4 \uc635\uc158\uc744 \uc9c0\uc6d0\ud569\ub2c8\ub2e4:"}),"\n",(0,r.jsxs)(s.ul,{children:["\n",(0,r.jsxs)(s.li,{children:[(0,r.jsxs)(s.strong,{children:["\uc784\ubca0\ub514\ub4dc ",(0,r.jsx)(s.a,{href:"https://www.sqlite.org/index.html",children:"SQLite"})]}),(0,r.jsx)(s.br,{}),"\n","SQLite\ub294 \uc5ec\ub7ec \uc11c\ubc84\uac00 \uc788\ub294 \ud074\ub7ec\uc2a4\ud130\uc5d0\uc11c\ub294 \uc0ac\uc6a9\ud560 \uc218 \uc5c6\uc2b5\ub2c8\ub2e4.",(0,r.jsx)(s.br,{}),"\n","SQLite\ub294 \uae30\ubcf8 \ub370\uc774\ud130\uc2a4\ud1a0\uc5b4\uc774\uba70, \ub2e4\ub978 \ub370\uc774\ud130\uc2a4\ud1a0\uc5b4 \uad6c\uc131\uc774 \uc5c6\uace0 \ub514\uc2a4\ud06c\uc5d0 \uc784\ubca0\ub514\ub4dc etcd \ub370\uc774\ud130\ubca0\uc774\uc2a4 \ud30c\uc77c\uc774 \uc5c6\ub294 \uacbd\uc6b0 \uc0ac\uc6a9\ub429\ub2c8\ub2e4."]}),"\n",(0,r.jsxs)(s.li,{children:[(0,r.jsx)(s.strong,{children:"\uc784\ubca0\ub514\ub4dc etcd"}),(0,r.jsx)(s.br,{}),"\n","\uc5ec\ub7ec \uc11c\ubc84\uc5d0\uc11c \uc784\ubca0\ub514\ub4dc etcd\ub97c \uc0ac\uc6a9\ud558\ub294 \ubc29\ubc95\uc5d0 \ub300\ud55c \uc790\uc138\ud55c \ub0b4\uc6a9\uc740 ",(0,r.jsx)(s.a,{href:"/kr/datastore/ha-embedded",children:"\uace0\uac00\uc6a9\uc131 \uc784\ubca0\ub514\ub4dc etcd"})," \uc124\uba85\uc11c\ub97c \ucc38\uc870\ud558\uc138\uc694.\nK3s\uac00 \uc0c8 etcd \ud074\ub7ec\uc2a4\ud130\ub97c \ucd08\uae30\ud654\ud558\uac70\ub098 \uae30\uc874 etcd \ud074\ub7ec\uc2a4\ud130\uc5d0 \uac00\uc785\ud558\ub3c4\ub85d \uad6c\uc131\ub418\uc5c8\uac70\ub098 \uc2dc\uc791 \uc2dc \ub514\uc2a4\ud06c\uc5d0 etcd \ub370\uc774\ud130\ubca0\uc774\uc2a4 \ud30c\uc77c\uc774 \uc788\ub294 \uacbd\uc6b0 \uc784\ubca0\ub514\ub4dc etcd\uac00 \uc790\ub3d9\uc73c\ub85c \uc120\ud0dd\ub429\ub2c8\ub2e4."]}),"\n",(0,r.jsxs)(s.li,{children:[(0,r.jsx)(s.strong,{children:"\uc678\ubd80 \ub370\uc774\ud130\ubca0\uc774\uc2a4"}),(0,r.jsx)(s.br,{}),"\n","\uc5ec\ub7ec \uc11c\ubc84\uc5d0\uc11c \uc678\ubd80 \ub370\uc774\ud130\uc2a4\ud1a0\uc5b4\ub97c \uc0ac\uc6a9\ud558\ub294 \ubc29\ubc95\uc5d0 \ub300\ud55c \uc790\uc138\ud55c \ub0b4\uc6a9\uc740 ",(0,r.jsx)(s.a,{href:"/kr/datastore/ha",children:"\uace0\uac00\uc6a9\uc131 \uc678\ubd80 DB"})," \uc124\uba85\uc11c\ub97c \ucc38\uc870\ud558\uc138\uc694.",(0,r.jsx)(s.br,{}),"\n","\uc9c0\uc6d0\ub418\ub294 \uc678\ubd80 \ub370\uc774\ud130\uc2a4\ud1a0\uc5b4\ub294 \ub2e4\uc74c\uacfc \uac19\uc2b5\ub2c8\ub2e4:","\n",(0,r.jsxs)(s.ul,{children:["\n",(0,r.jsxs)(s.li,{children:[(0,r.jsx)(s.a,{href:"https://etcd.io/",children:"etcd"})," (3.5.4 \ubc84\uc804\uc5d0 \ub300\ud574 \uac80\uc99d\ub428)"]}),"\n",(0,r.jsxs)(s.li,{children:[(0,r.jsx)(s.a,{href:"https://www.mysql.com",children:"MySQL"})," (5.7 and 8.0 \ubc84\uc804\uc5d0 \ub300\ud574 \uac80\uc99d\ub428)"]}),"\n",(0,r.jsxs)(s.li,{children:[(0,r.jsx)(s.a,{href:"https://mariadb.org/",children:"MariaDB"})," (10.6.8 \ubc84\uc804\uc5d0 \ub300\ud574 \uac80\uc99d\ub428)"]}),"\n",(0,r.jsxs)(s.li,{children:[(0,r.jsx)(s.a,{href:"https://www.postgresql.org/",children:"PostgreSQL"})," (10.7, 11.5, and 14.2 \ubc84\uc804\uc5d0 \ub300\ud574 \uac80\uc99d\ub428)"]}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,r.jsx)(s.h3,{id:"\uc678\ubd80-\ub370\uc774\ud130\uc2a4\ud1a0\uc5b4-\uad6c\uc131-\ud30c\ub77c\ubbf8\ud130",children:"\uc678\ubd80 \ub370\uc774\ud130\uc2a4\ud1a0\uc5b4 \uad6c\uc131 \ud30c\ub77c\ubbf8\ud130"}),"\n",(0,r.jsxs)(s.p,{children:["PostgreSQL, MySQL, etcd\uc640 \uac19\uc740 \uc678\ubd80 \ub370\uc774\ud130\uc2a4\ud1a0\uc5b4\ub97c \uc0ac\uc6a9\ud558\ub824\uba74 K3s\uac00 \uc5f0\uacb0 \ubc29\ubc95\uc744 \uc54c \uc218 \uc788\ub3c4\ub85d ",(0,r.jsx)(s.code,{children:"datastore-endpoint"})," \ud30c\ub77c\ubbf8\ud130\ub97c \uc124\uc815\ud574\uc57c \ud569\ub2c8\ub2e4. \ub610\ud55c \uc5f0\uacb0\uc758 \uc778\uc99d \ubc0f \uc554\ud638\ud654\ub97c \uad6c\uc131\ud558\ub294 \ud30c\ub77c\ubbf8\ud130\ub97c \uc9c0\uc815\ud560 \uc218\ub3c4 \uc788\uc2b5\ub2c8\ub2e4. \uc544\ub798 \ud45c\uc5d0\ub294 \uc774\ub7ec\ud55c \ub9e4\uac1c\ubcc0\uc218\uac00 \uc694\uc57d\ub418\uc5b4 \uc788\uc73c\uba70, CLI \ud50c\ub798\uadf8 \ub610\ub294 \ud658\uacbd \ubcc0\uc218\ub85c \uc804\ub2ec\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4."]}),"\n",(0,r.jsxs)(s.table,{children:[(0,r.jsx)(s.thead,{children:(0,r.jsxs)(s.tr,{children:[(0,r.jsx)(s.th,{children:"CLI Flag"}),(0,r.jsx)(s.th,{children:"Environment Variable"}),(0,r.jsx)(s.th,{children:"Description"})]})}),(0,r.jsxs)(s.tbody,{children:[(0,r.jsxs)(s.tr,{children:[(0,r.jsx)(s.td,{children:(0,r.jsx)(s.code,{children:"--datastore-endpoint"})}),(0,r.jsx)(s.td,{children:(0,r.jsx)(s.code,{children:"K3S_DATASTORE_ENDPOINT"})}),(0,r.jsx)(s.td,{children:"PostgreSQL, MySQL \ub610\ub294 etcd \uc5f0\uacb0 \ubb38\uc790\uc5f4\uc744 \uc9c0\uc815\ud569\ub2c8\ub2e4. \ub370\uc774\ud130\uc2a4\ud1a0\uc5b4\uc5d0 \ub300\ud55c \uc5f0\uacb0\uc744 \uc124\uba85\ud558\ub294 \ub370 \uc0ac\uc6a9\ub418\ub294 \ubb38\uc790\uc5f4\uc785\ub2c8\ub2e4. \uc774 \ubb38\uc790\uc5f4\uc758 \uad6c\uc870\ub294 \uac01 \ubc31\uc5d4\ub4dc\uc5d0 \ub530\ub77c \ub2e4\ub974\uba70 \uc544\ub798\uc5d0 \uc790\uc138\ud788 \uc124\uba85\ub418\uc5b4 \uc788\uc2b5\ub2c8\ub2e4."})]}),(0,r.jsxs)(s.tr,{children:[(0,r.jsx)(s.td,{children:(0,r.jsx)(s.code,{children:"--datastore-cafile"})}),(0,r.jsx)(s.td,{children:(0,r.jsx)(s.code,{children:"K3S_DATASTORE_CAFILE"})}),(0,r.jsx)(s.td,{children:"\ub370\uc774\ud130\uc2a4\ud1a0\uc5b4\uc640\uc758 \ud1b5\uc2e0\uc744 \ubcf4\ud638\ud558\ub294 \ub370 \uc0ac\uc6a9\ub418\ub294 TLS \uc778\uc99d \uae30\uad00(CA: Certificate Authority) \ud30c\uc77c\uc785\ub2c8\ub2e4. \ub370\uc774\ud130\uc2a4\ud1a0\uc5b4\uc5d0\uc11c \uc0ac\uc6a9\uc790 \uc9c0\uc815 \uc778\uc99d \uae30\uad00\uc5d0\uc11c \uc11c\uba85\ud55c \uc778\uc99d\uc11c\ub97c \uc0ac\uc6a9\ud558\uc5ec TLS\ub97c \ud1b5\ud574 \uc694\uccad\uc744 \uc81c\uacf5\ud558\ub294 \uacbd\uc6b0, \uc774 \ub9e4\uac1c\ubcc0\uc218\ub97c \uc0ac\uc6a9\ud558\uc5ec \ud574\ub2f9 CA\ub97c \uc9c0\uc815\ud558\uba74 K3s \ud074\ub77c\uc774\uc5b8\ud2b8\uac00 \uc778\uc99d\uc11c\ub97c \uc62c\ubc14\ub974\uac8c \ud655\uc778\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4."})]}),(0,r.jsxs)(s.tr,{children:[(0,r.jsx)(s.td,{children:(0,r.jsx)(s.code,{children:"--datastore-certfile"})}),(0,r.jsx)(s.td,{children:(0,r.jsx)(s.code,{children:"K3S_DATASTORE_CERTFILE"})}),(0,r.jsxs)(s.td,{children:["\ub370\uc774\ud130\uc2a4\ud1a0\uc5b4\uc5d0 \ub300\ud55c \ud074\ub77c\uc774\uc5b8\ud2b8 \uc778\uc99d\uc11c \uae30\ubc18 \uc778\uc99d\uc5d0 \uc0ac\uc6a9\ub418\ub294 TLS \uc778\uc99d\uc11c \ud30c\uc77c\uc785\ub2c8\ub2e4. \uc774 \uae30\ub2a5\uc744 \uc0ac\uc6a9\ud558\ub824\uba74 \ub370\uc774\ud130\uc2a4\ud1a0\uc5b4\uac00 \ud074\ub77c\uc774\uc5b8\ud2b8 \uc778\uc99d\uc11c \uae30\ubc18 \uc778\uc99d\uc744 \uc9c0\uc6d0\ud558\ub3c4\ub85d \uad6c\uc131\ub418\uc5b4 \uc788\uc5b4\uc57c \ud569\ub2c8\ub2e4. \uc774 \ud30c\ub77c\ubbf8\ud130\ub97c \uc9c0\uc815\ud558\ub294 \uacbd\uc6b0 ",(0,r.jsx)(s.code,{children:"datastore-keyfile"})," \ud30c\ub77c\ubbf8\ud130\ub3c4 \uc9c0\uc815\ud574\uc57c \ud569\ub2c8\ub2e4."]})]}),(0,r.jsxs)(s.tr,{children:[(0,r.jsx)(s.td,{children:(0,r.jsx)(s.code,{children:"--datastore-keyfile"})}),(0,r.jsx)(s.td,{children:(0,r.jsx)(s.code,{children:"K3S_DATASTORE_KEYFILE"})}),(0,r.jsxs)(s.td,{children:["\ub370\uc774\ud130\uc2a4\ud1a0\uc5b4\uc5d0 \ub300\ud55c \ud074\ub77c\uc774\uc5b8\ud2b8 \uc778\uc99d\uc11c \uae30\ubc18 \uc778\uc99d\uc5d0 \uc0ac\uc6a9\ub418\ub294 TLS \ud0a4 \ud30c\uc77c\uc785\ub2c8\ub2e4. \uc790\uc138\ud55c \ub0b4\uc6a9\uc740 \uc774\uc804 ",(0,r.jsx)(s.code,{children:"datastore-certfile"})," \ub9e4\uac1c\ubcc0\uc218\ub97c \ucc38\uc870\ud558\uc138\uc694."]})]})]})]}),"\n",(0,r.jsx)(s.p,{children:"\ub370\uc774\ud130\ubca0\uc774\uc2a4 \uc790\uaca9 \uc99d\uba85\uc774\ub098 \uae30\ud0c0 \ubbfc\uac10\ud55c \uc815\ubcf4\uac00 \ud504\ub85c\uc138\uc2a4 \uc815\ubcf4\uc758 \uc77c\ubd80\ub85c \ub178\ucd9c\ub418\uc9c0 \uc54a\ub3c4\ub85d \uc774\ub7ec\ud55c \ub9e4\uac1c \ubcc0\uc218\ub97c \uba85\ub839\uc904 \uc778\uc218\uac00 \uc544\ub2cc \ud658\uacbd \ubcc0\uc218\ub85c \uc124\uc815\ud558\ub294 \uac83\uc774 \uc88b\uc2b5\ub2c8\ub2e4."}),"\n",(0,r.jsx)(s.h3,{id:"\ub370\uc774\ud130\uc2a4\ud1a0\uc5b4-\uc5d4\ub4dc\ud3ec\uc778\ud2b8-\ud615\uc2dd-\ubc0f-\uae30\ub2a5",children:"\ub370\uc774\ud130\uc2a4\ud1a0\uc5b4 \uc5d4\ub4dc\ud3ec\uc778\ud2b8 \ud615\uc2dd \ubc0f \uae30\ub2a5"}),"\n",(0,r.jsxs)(s.p,{children:["\uc55e\uc11c \uc5b8\uae09\ud588\ub4ef\uc774, ",(0,r.jsx)(s.code,{children:"datastore-endpoint"})," \ub9e4\uac1c\ubcc0\uc218\uc5d0 \uc804\ub2ec\ub418\ub294 \uac12\uc758 \ud615\uc2dd\uc740 \ub370\uc774\ud130\uc2a4\ud1a0\uc5b4 \ubc31\uc5d4\ub4dc\uc5d0 \ub530\ub77c \ub2ec\ub77c\uc9d1\ub2c8\ub2e4. \ub2e4\uc74c\uc740 \uc9c0\uc6d0\ub418\ub294 \uac01 \uc678\ubd80 \ub370\uc774\ud130\uc2a4\ud1a0\uc5b4\uc5d0 \ub300\ud55c \uc774 \ud615\uc2dd\uacfc \uae30\ub2a5\uc5d0 \ub300\ud574 \uc790\uc138\ud788 \uc124\uba85\ud569\ub2c8\ub2e4."]}),"\n",(0,r.jsxs)(n,{children:[(0,r.jsxs)(t,{value:"PostgreSQL",children:[(0,r.jsx)(s.p,{children:"\uac00\uc7a5 \uc77c\ubc18\uc801\uc778 \ud615\uc2dd\uc758 PostgreSQL\uc6a9 \ub370\uc774\ud130 \uc800\uc7a5\uc18c \uc5d4\ub4dc\ud3ec\uc778\ud2b8 \ub9e4\uac1c \ubcc0\uc218\ub294 \ub2e4\uc74c\uacfc \uac19\uc740 \ud615\uc2dd\uc744 \uac16\uc2b5\ub2c8\ub2e4:"}),(0,r.jsx)(s.p,{children:(0,r.jsx)(s.code,{children:"postgres://username:password@hostname:port/database-name"})}),(0,r.jsxs)(s.p,{children:["\ub354 \uace0\uae09 \uad6c\uc131 \ub9e4\uac1c\ubcc0\uc218\ub97c \uc0ac\uc6a9\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4. \uc774\uc5d0 \ub300\ud55c \uc790\uc138\ud55c \ub0b4\uc6a9\uc740 ",(0,r.jsx)(s.a,{href:"https://godoc.org/github.com/lib/pq",children:"https://godoc.org/github.com/lib/pq"})," \uc744 \ucc38\uc870\ud558\uc138\uc694."]}),(0,r.jsx)(s.p,{children:"\ub370\uc774\ud130\ubca0\uc774\uc2a4 \uc774\ub984\uc744 \uc9c0\uc815\ud588\ub294\ub370 \ud574\ub2f9 \ub370\uc774\ud130\ubca0\uc774\uc2a4\uac00 \uc874\uc7ac\ud558\uc9c0 \uc54a\uc73c\uba74 \uc11c\ubc84\uc5d0\uc11c \ub370\uc774\ud130\ubca0\uc774\uc2a4 \uc0dd\uc131\uc744 \uc2dc\ub3c4\ud569\ub2c8\ub2e4."}),(0,r.jsxs)(s.p,{children:["\uc5d4\ub4dc\ud3ec\uc778\ud2b8\ub85c ",(0,r.jsx)(s.code,{children:"postgres://"}),"\ub9cc \uc81c\uacf5\ud558\ub294 \uacbd\uc6b0, K3s\ub294 \ub2e4\uc74c\uc744 \uc2dc\ub3c4\ud569\ub2c8\ub2e4:"]}),(0,r.jsxs)(s.ul,{children:["\n",(0,r.jsxs)(s.li,{children:["\uc0ac\uc6a9\uc790 \uc774\ub984\uacfc \ube44\ubc00\ubc88\ud638\ub85c ",(0,r.jsx)(s.code,{children:"postgres"}),"\ub97c \uc0ac\uc6a9\ud558\uc5ec localhost\uc5d0 \uc5f0\uacb0\ud569\ub2c8\ub2e4."]}),"\n",(0,r.jsxs)(s.li,{children:[(0,r.jsx)(s.code,{children:"kubernetes"}),"\ub77c\ub294 \uc774\ub984\uc758 \ub370\uc774\ud130\ubca0\uc774\uc2a4\ub97c \uc0dd\uc131\ud569\ub2c8\ub2e4."]}),"\n"]})]}),(0,r.jsxs)(t,{value:"MySQL / MariaDB",children:[(0,r.jsxs)(s.p,{children:["\uac00\uc7a5 \uc77c\ubc18\uc801\uc778 \ud615\ud0dc\uc778 MySQL\uacfc MariaDB\uc758 ",(0,r.jsx)(s.code,{children:"datastore-endpoint"})," \ud30c\ub77c\ubbf8\ud130\ub294 \ub2e4\uc74c\uacfc \uac19\uc740 \ud615\uc2dd\uc744 \uac16\uc2b5\ub2c8\ub2e4:"]}),(0,r.jsx)(s.p,{children:(0,r.jsx)(s.code,{children:"mysql://username:password@tcp(hostname:3306)/database-name"})}),(0,r.jsxs)(s.p,{children:["\ub354 \uace0\uae09 \uad6c\uc131 \ub9e4\uac1c\ubcc0\uc218\ub97c \uc0ac\uc6a9\ud560 \uc218\ub3c4 \uc788\uc2b5\ub2c8\ub2e4. \uc774\uc5d0 \ub300\ud55c \uc790\uc138\ud55c \ub0b4\uc6a9\uc740 ",(0,r.jsx)(s.a,{href:"https://github.com/go-sql-driver/mysql#dsn-data-source-name",children:"https://github.com/go-sql-driver/mysql#dsn-data-source-name"})," \uc744 \ucc38\uc870\ud558\uc138\uc694."]}),(0,r.jsxs)(s.p,{children:["K3s\uc758 ",(0,r.jsx)(s.a,{href:"https://github.com/k3s-io/k3s/issues/1093",children:"\uc54c\ub824\uc9c4 \uc774\uc288"}),"\ub85c \uc778\ud574 ",(0,r.jsx)(s.code,{children:"tls"}),' \ud30c\ub77c\ubbf8\ud130\ub97c \uc124\uc815\ud560 \uc218 \uc5c6\uc2b5\ub2c8\ub2e4. TLS \ud1b5\uc2e0\uc740 \uc9c0\uc6d0\ub418\uc9c0\ub9cc \uc608\ub97c \ub4e4\uc5b4 \uc774 \ub9e4\uac1c\ubcc0\uc218\ub97c "skip-verify"\ub85c \uc124\uc815\ud558\uc5ec K3s\uac00 \uc778\uc99d\uc11c \ud655\uc778\uc744 \uac74\ub108\ub6f0\ub3c4\ub85d \ud560 \uc218\ub294 \uc5c6\uc2b5\ub2c8\ub2e4.']}),(0,r.jsx)(s.p,{children:"\ub370\uc774\ud130\ubca0\uc774\uc2a4 \uc774\ub984\uc744 \uc9c0\uc815\ud588\ub294\ub370 \ub370\uc774\ud130\ubca0\uc774\uc2a4\uac00 \uc874\uc7ac\ud558\uc9c0 \uc54a\uc73c\uba74 \uc11c\ubc84\uc5d0\uc11c \ub9cc\ub4e4\ub824\uace0 \uc2dc\ub3c4\ud569\ub2c8\ub2e4."}),(0,r.jsxs)(s.p,{children:["\uc5d4\ub4dc\ud3ec\uc778\ud2b8\ub85c ",(0,r.jsx)(s.code,{children:"mysql://"}),"\ub9cc \uc81c\uacf5\ud558\ub294 \uacbd\uc6b0, K3s\ub294 \ub2e4\uc74c\uc744 \uc2dc\ub3c4\ud569\ub2c8\ub2e4:"]}),(0,r.jsxs)(s.ul,{children:["\n",(0,r.jsxs)(s.li,{children:[(0,r.jsx)(s.code,{children:"root"})," \uc0ac\uc6a9\uc790\uc640 \ube44\ubc00\ubc88\ud638\ub97c \uc0ac\uc6a9\ud558\uc9c0 \uc54a\uace0 ",(0,r.jsx)(s.code,{children:"/var/run/mysqld/mysqld.sock"}),"\uc5d0\uc11c MySQL \uc18c\ucf13\uc5d0 \uc5f0\uacb0\ud569\ub2c8\ub2e4."]}),"\n",(0,r.jsxs)(s.li,{children:[(0,r.jsx)(s.code,{children:"kubernetes"}),"\ub77c\ub294 \uc774\ub984\uc758 \ub370\uc774\ud130\ubca0\uc774\uc2a4\ub97c \uc0dd\uc131\ud569\ub2c8\ub2e4."]}),"\n"]})]}),(0,r.jsxs)(t,{value:"etcd",children:[(0,r.jsxs)(s.p,{children:["\uac00\uc7a5 \uc77c\ubc18\uc801\uc778 \ud615\ud0dc\uc778 etcd\uc758 ",(0,r.jsx)(s.code,{children:"datastore-endpoint"})," \ud30c\ub77c\ubbf8\ud130\uc758 \ud615\uc2dd\uc740 \ub2e4\uc74c\uacfc \uac19\uc2b5\ub2c8\ub2e4:"]}),(0,r.jsx)(s.p,{children:(0,r.jsx)(s.code,{children:"https://etcd-host-1:2379,https://etcd-host-2:2379,https://etcd-host-3:2379"})}),(0,r.jsx)(s.p,{children:"\uc704\ub294 \uc77c\ubc18\uc801\uc778 \uc138 \uac1c\uc758 \ub178\ub4dc\uc778 etcd \ud074\ub7ec\uc2a4\ud130\ub97c \uac00\uc815\ud569\ub2c8\ub2e4. \uc774 \ub9e4\uac1c\ubcc0\uc218\ub294 \uc27c\ud45c\ub85c \uad6c\ubd84\ub41c \ud558\ub098 \uc774\uc0c1\uc758 etcd URL\uc744 \uc0ac\uc6a9\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4."})]})]})]})}function a(e={}){const{wrapper:s}={...(0,d.a)(),...e.components};return s?(0,r.jsx)(s,{...e,children:(0,r.jsx)(h,{...e})}):h(e)}function x(e,s){throw new Error("Expected "+(s?"component":"object")+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}},1151:(e,s,t)=>{t.d(s,{Z:()=>i,a:()=>c});var r=t(7294);const d={},n=r.createContext(d);function c(e){const s=r.useContext(n);return r.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function i(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(d):e.components||d:c(e.components),r.createElement(n.Provider,{value:s},e.children)}}}]);