"use strict";(self.webpackChunkk_3_s_docs=self.webpackChunkk_3_s_docs||[]).push([[3100],{3905:(e,t,a)=>{a.d(t,{Zo:()=>p,kt:()=>m});var r=a(7294);function n(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function l(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,r)}return a}function o(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?l(Object(a),!0).forEach((function(t){n(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):l(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function i(e,t){if(null==e)return{};var a,r,n=function(e,t){if(null==e)return{};var a,r,n={},l=Object.keys(e);for(r=0;r<l.length;r++)a=l[r],t.indexOf(a)>=0||(n[a]=e[a]);return n}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(r=0;r<l.length;r++)a=l[r],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(n[a]=e[a])}return n}var u=r.createContext({}),s=function(e){var t=r.useContext(u),a=t;return e&&(a="function"==typeof e?e(t):o(o({},t),e)),a},p=function(e){var t=s(e.components);return r.createElement(u.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},c=r.forwardRef((function(e,t){var a=e.components,n=e.mdxType,l=e.originalType,u=e.parentName,p=i(e,["components","mdxType","originalType","parentName"]),c=s(a),m=n,k=c["".concat(u,".").concat(m)]||c[m]||d[m]||l;return a?r.createElement(k,o(o({ref:t},p),{},{components:a})):r.createElement(k,o({ref:t},p))}));function m(e,t){var a=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var l=a.length,o=new Array(l);o[0]=c;var i={};for(var u in t)hasOwnProperty.call(t,u)&&(i[u]=t[u]);i.originalType=e,i.mdxType="string"==typeof e?e:n,o[1]=i;for(var s=2;s<l;s++)o[s]=a[s];return r.createElement.apply(null,o)}return r.createElement.apply(null,a)}c.displayName="MDXCreateElement"},5162:(e,t,a)=>{a.d(t,{Z:()=>o});var r=a(7294),n=a(6010);const l="tabItem_Ymn6";function o(e){let{children:t,hidden:a,className:o}=e;return r.createElement("div",{role:"tabpanel",className:(0,n.Z)(l,o),hidden:a},t)}},4866:(e,t,a)=>{a.d(t,{Z:()=>S});var r=a(3117),n=a(7294),l=a(6010),o=a(2466),i=a(6775),u=a(1980),s=a(7392),p=a(12);function d(e){return function(e){return n.Children.map(e,(e=>{if((0,n.isValidElement)(e)&&"value"in e.props)return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))}(e).map((e=>{let{props:{value:t,label:a,attributes:r,default:n}}=e;return{value:t,label:a,attributes:r,default:n}}))}function c(e){const{values:t,children:a}=e;return(0,n.useMemo)((()=>{const e=t??d(a);return function(e){const t=(0,s.l)(e,((e,t)=>e.value===t.value));if(t.length>0)throw new Error(`Docusaurus error: Duplicate values "${t.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[t,a])}function m(e){let{value:t,tabValues:a}=e;return a.some((e=>e.value===t))}function k(e){let{queryString:t=!1,groupId:a}=e;const r=(0,i.k6)(),l=function(e){let{queryString:t=!1,groupId:a}=e;if("string"==typeof t)return t;if(!1===t)return null;if(!0===t&&!a)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return a??null}({queryString:t,groupId:a});return[(0,u._X)(l),(0,n.useCallback)((e=>{if(!l)return;const t=new URLSearchParams(r.location.search);t.set(l,e),r.replace({...r.location,search:t.toString()})}),[l,r])]}function b(e){const{defaultValue:t,queryString:a=!1,groupId:r}=e,l=c(e),[o,i]=(0,n.useState)((()=>function(e){let{defaultValue:t,tabValues:a}=e;if(0===a.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(t){if(!m({value:t,tabValues:a}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${t}" but none of its children has the corresponding value. Available values are: ${a.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return t}const r=a.find((e=>e.default))??a[0];if(!r)throw new Error("Unexpected error: 0 tabValues");return r.value}({defaultValue:t,tabValues:l}))),[u,s]=k({queryString:a,groupId:r}),[d,b]=function(e){let{groupId:t}=e;const a=function(e){return e?`docusaurus.tab.${e}`:null}(t),[r,l]=(0,p.Nk)(a);return[r,(0,n.useCallback)((e=>{a&&l.set(e)}),[a,l])]}({groupId:r}),f=(()=>{const e=u??d;return m({value:e,tabValues:l})?e:null})();(0,n.useLayoutEffect)((()=>{f&&i(f)}),[f]);return{selectedValue:o,selectValue:(0,n.useCallback)((e=>{if(!m({value:e,tabValues:l}))throw new Error(`Can't select invalid tab value=${e}`);i(e),s(e),b(e)}),[s,b,l]),tabValues:l}}var f=a(2389);const h="tabList__CuJ",N="tabItem_LNqP";function g(e){let{className:t,block:a,selectedValue:i,selectValue:u,tabValues:s}=e;const p=[],{blockElementScrollPositionUntilNextRender:d}=(0,o.o5)(),c=e=>{const t=e.currentTarget,a=p.indexOf(t),r=s[a].value;r!==i&&(d(t),u(r))},m=e=>{let t=null;switch(e.key){case"Enter":c(e);break;case"ArrowRight":{const a=p.indexOf(e.currentTarget)+1;t=p[a]??p[0];break}case"ArrowLeft":{const a=p.indexOf(e.currentTarget)-1;t=p[a]??p[p.length-1];break}}t?.focus()};return n.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,l.Z)("tabs",{"tabs--block":a},t)},s.map((e=>{let{value:t,label:a,attributes:o}=e;return n.createElement("li",(0,r.Z)({role:"tab",tabIndex:i===t?0:-1,"aria-selected":i===t,key:t,ref:e=>p.push(e),onKeyDown:m,onClick:c},o,{className:(0,l.Z)("tabs__item",N,o?.className,{"tabs__item--active":i===t})}),a??t)})))}function y(e){let{lazy:t,children:a,selectedValue:r}=e;if(a=Array.isArray(a)?a:[a],t){const e=a.find((e=>e.props.value===r));return e?(0,n.cloneElement)(e,{className:"margin-top--md"}):null}return n.createElement("div",{className:"margin-top--md"},a.map(((e,t)=>(0,n.cloneElement)(e,{key:t,hidden:e.props.value!==r}))))}function v(e){const t=b(e);return n.createElement("div",{className:(0,l.Z)("tabs-container",h)},n.createElement(g,(0,r.Z)({},e,t)),n.createElement(y,(0,r.Z)({},e,t)))}function S(e){const t=(0,f.Z)();return n.createElement(v,(0,r.Z)({key:String(t)},e))}},7958:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>p,contentTitle:()=>u,default:()=>m,frontMatter:()=>i,metadata:()=>s,toc:()=>d});var r=a(3117),n=(a(7294),a(3905)),l=a(4866),o=a(5162);const i={title:"\u96c6\u7fa4\u6570\u636e\u5b58\u50a8",weight:50},u=void 0,s={unversionedId:"datastore/datastore",id:"datastore/datastore",title:"\u96c6\u7fa4\u6570\u636e\u5b58\u50a8",description:"K3s \u4e0e\u5176\u4ed6 Kubernetes \u53d1\u884c\u7248\u7684\u4e0d\u540c\u4e4b\u5904\uff0c\u5728\u4e8e K3s \u652f\u6301\u4f7f\u7528 etcd \u4ee5\u5916\u7684\u6570\u636e\u5e93\u6765\u8fd0\u884c Kubernetes\u3002\u8be5\u529f\u80fd\u8ba9 Kubernetes \u8fd0\u7ef4\u66f4\u52a0\u7075\u6d3b\u3002\u4f60\u53ef\u4ee5\u6839\u636e\u5b9e\u9645\u60c5\u51b5\u9009\u62e9\u5408\u9002\u7684\u6570\u636e\u5b58\u50a8\u9009\u9879\u3002\u4f8b\u5982\uff1a",source:"@site/i18n/zh/docusaurus-plugin-content-docs/current/datastore/datastore.md",sourceDirName:"datastore",slug:"/datastore/",permalink:"/zh/datastore/",draft:!1,editUrl:"https://github.com/k3s-io/docs/edit/main/docs/datastore/datastore.md",tags:[],version:"current",lastUpdatedAt:1685608136,formattedLastUpdatedAt:"2023\u5e746\u67081\u65e5",frontMatter:{title:"\u96c6\u7fa4\u6570\u636e\u5b58\u50a8",weight:50},sidebar:"mySidebar",previous:{title:"\u5378\u8f7d K3s",permalink:"/zh/installation/uninstall"},next:{title:"\u5907\u4efd\u548c\u6062\u590d",permalink:"/zh/datastore/backup-restore"}},p={},d=[{value:"\u5916\u90e8\u6570\u636e\u5b58\u50a8\u914d\u7f6e\u53c2\u6570",id:"\u5916\u90e8\u6570\u636e\u5b58\u50a8\u914d\u7f6e\u53c2\u6570",level:3},{value:"\u6570\u636e\u5b58\u50a8\u7aef\u70b9\u683c\u5f0f\u548c\u529f\u80fd",id:"\u6570\u636e\u5b58\u50a8\u7aef\u70b9\u683c\u5f0f\u548c\u529f\u80fd",level:3}],c={toc:d};function m(e){let{components:t,...a}=e;return(0,n.kt)("wrapper",(0,r.Z)({},c,a,{components:t,mdxType:"MDXLayout"}),(0,n.kt)("p",null,"K3s \u4e0e\u5176\u4ed6 Kubernetes \u53d1\u884c\u7248\u7684\u4e0d\u540c\u4e4b\u5904\uff0c\u5728\u4e8e K3s \u652f\u6301\u4f7f\u7528 etcd \u4ee5\u5916\u7684\u6570\u636e\u5e93\u6765\u8fd0\u884c Kubernetes\u3002\u8be5\u529f\u80fd\u8ba9 Kubernetes \u8fd0\u7ef4\u66f4\u52a0\u7075\u6d3b\u3002\u4f60\u53ef\u4ee5\u6839\u636e\u5b9e\u9645\u60c5\u51b5\u9009\u62e9\u5408\u9002\u7684\u6570\u636e\u5b58\u50a8\u9009\u9879\u3002\u4f8b\u5982\uff1a"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"\u5982\u679c\u4f60\u7684\u56e2\u961f\u6ca1\u6709\u64cd\u4f5c etcd \u7684\u4e13\u4e1a\u77e5\u8bc6\uff0c\u4f60\u53ef\u4ee5\u9009\u62e9 MySQL \u6216 PostgreSQL \u7b49\u4f01\u4e1a\u7ea7 SQL \u6570\u636e\u5e93\u3002"),(0,n.kt)("li",{parentName:"ul"},"\u5982\u679c\u4f60\u9700\u8981\u5728 CI/CD \u73af\u5883\u4e2d\u8fd0\u884c\u4e00\u4e2a\u7b80\u5355\u3001\u77ed\u671f\u7684\u96c6\u7fa4\uff0c\u4f60\u53ef\u4ee5\u4f7f\u7528\u5d4c\u5165\u5f0f SQLite \u6570\u636e\u5e93\u3002"),(0,n.kt)("li",{parentName:"ul"},"\u5982\u679c\u4f60\u5e0c\u671b\u5728\u8fb9\u7f18\u90e8\u7f72 Kubernetes \u5e76\u9700\u8981\u9ad8\u53ef\u7528\u89e3\u51b3\u65b9\u6848\uff0c\u4f46\u53c8\u65e0\u6cd5\u627f\u62c5\u5728\u8fb9\u7f18\u7ba1\u7406\u6570\u636e\u5e93\u7684\u8fd0\u8425\u5f00\u9500\uff0c\u4f60\u53ef\u4ee5\u4f7f\u7528 K3s \u7684\u5d4c\u5165\u5f0f HA \u6570\u636e\u5b58\u50a8\uff0c\u8be5\u6570\u636e\u5b58\u50a8\u6784\u5efa\u5728\u5d4c\u5165\u5f0f etcd \u4e4b\u4e0a\u3002")),(0,n.kt)("p",null,"K3s \u652f\u6301\u4ee5\u4e0b\u6570\u636e\u5b58\u50a8\u9009\u9879\uff1a"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("strong",{parentName:"li"},"\u5d4c\u5165\u5f0f ",(0,n.kt)("a",{parentName:"strong",href:"https://www.sqlite.org/index.html"},"SQLite")),(0,n.kt)("br",{parentName:"li"}),"SQLite \u4e0d\u80fd\u7528\u4e8e\u5177\u6709\u591a\u4e2a Server \u7684\u96c6\u7fa4\u3002",(0,n.kt)("br",{parentName:"li"}),"SQLite \u662f\u9ed8\u8ba4\u7684\u6570\u636e\u5b58\u50a8\uff0c\u5982\u679c\u6ca1\u6709\u5176\u4ed6\u6570\u636e\u5b58\u50a8\u914d\u7f6e\uff0c\u5e76\u4e14\u78c1\u76d8\u4e0a\u6ca1\u6709\u5d4c\u5165\u5f0f etcd \u6570\u636e\u5e93\u6587\u4ef6\uff0c\u5c06\u4f7f\u7528 SQLite\u3002"),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("strong",{parentName:"li"},"\u5d4c\u5165\u5f0f etcd"),(0,n.kt)("br",{parentName:"li"}),"\u6709\u5173\u5728\u5177\u6709\u591a\u4e2a Server \u7684\u60c5\u51b5\u4e0b\u4f7f\u7528\u5d4c\u5165\u5f0f etcd\uff0c\u8bf7\u53c2\u9605",(0,n.kt)("a",{parentName:"li",href:"/zh/datastore/ha-embedded"},"\u9ad8\u53ef\u7528\u5d4c\u5165\u5f0f etcd")," \u6587\u6863\u3002\n\u5982\u679c K3s \u914d\u7f6e\u4e3a\u521d\u59cb\u5316\u4e00\u4e2a\u65b0\u7684 etcd \u96c6\u7fa4\uff0c\u52a0\u5165\u4e00\u4e2a\u73b0\u6709\u7684 etcd \u96c6\u7fa4\uff0c\u6216\u8005 etcd \u6570\u636e\u5e93\u6587\u4ef6\u5728\u542f\u52a8\u65f6\u5728\u78c1\u76d8\u4e0a\uff0c\u90a3\u4e48\u4f1a\u81ea\u52a8\u9009\u62e9\u5d4c\u5165\u5f0f etcd\u3002"),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("strong",{parentName:"li"},"\u5916\u90e8\u6570\u636e\u5e93"),(0,n.kt)("br",{parentName:"li"}),"\u6709\u5173\u5728\u5177\u6709\u591a\u4e2a Server \u7684\u60c5\u51b5\u4e0b\u4f7f\u7528\u5916\u90e8\u6570\u636e\u5b58\u50a8\uff0c\u8bf7\u53c2\u9605",(0,n.kt)("a",{parentName:"li",href:"/zh/datastore/ha"},"\u9ad8\u53ef\u7528\u5916\u90e8\u6570\u636e\u5e93"),"\u6587\u6863\u3002",(0,n.kt)("br",{parentName:"li"}),"\u652f\u6301\u4ee5\u4e0b\u5916\u90e8\u6570\u636e\u5b58\u50a8\uff1a",(0,n.kt)("ul",{parentName:"li"},(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://etcd.io/"},"etcd"),"\uff08\u9488\u5bf9\u7248\u672c 3.5.4 \u8fdb\u884c\u4e86\u8ba4\u8bc1\uff09"),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://www.mysql.com/"},"MySQL"),"\uff08\u9488\u5bf9\u7248\u672c 5.7 \u548c 8.0 \u8fdb\u884c\u4e86\u8ba4\u8bc1\uff09"),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://mariadb.org/"},"MariaDB"),"\uff08\u9488\u5bf9\u7248\u672c 10.6.8 \u8fdb\u884c\u4e86\u8ba4\u8bc1\uff09"),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://www.postgresql.org/"},"PostgreSQL"),"\uff08\u9488\u5bf9\u7248\u672c 10.7\u300111.5 \u548c 14.2 \u8fdb\u884c\u4e86\u8ba4\u8bc1\uff09")))),(0,n.kt)("h3",{id:"\u5916\u90e8\u6570\u636e\u5b58\u50a8\u914d\u7f6e\u53c2\u6570"},"\u5916\u90e8\u6570\u636e\u5b58\u50a8\u914d\u7f6e\u53c2\u6570"),(0,n.kt)("p",null,"\u5982\u679c\u4f60\u5e0c\u671b\u4f7f\u7528\u5916\u90e8\u6570\u636e\u5b58\u50a8\uff08\u4f8b\u5982 PostgreSQL\u3001MySQL \u6216 etcd\uff09\uff0c\u4f60\u5fc5\u987b\u8bbe\u7f6e ",(0,n.kt)("inlineCode",{parentName:"p"},"datastore-endpoint")," \u53c2\u6570\uff0c\u4ee5\u4fbf K3s \u77e5\u9053\u5982\u4f55\u8fde\u63a5\u5230\u5916\u90e8\u6570\u636e\u5b58\u50a8\u3002\u4f60\u4e5f\u53ef\u4ee5\u6307\u5b9a\u53c2\u6570\u6765\u914d\u7f6e\u8fde\u63a5\u7684\u8ba4\u8bc1\u548c\u52a0\u5bc6\u3002\u4e0b\u8868\u603b\u7ed3\u4e86\u8fd9\u4e9b\u53c2\u6570\uff0c\u5b83\u4eec\u53ef\u4ee5\u4f5c\u4e3a CLI \u6807\u5fd7\u6216\u73af\u5883\u53d8\u91cf\u4f20\u9012\uff1a"),(0,n.kt)("table",null,(0,n.kt)("thead",{parentName:"table"},(0,n.kt)("tr",{parentName:"thead"},(0,n.kt)("th",{parentName:"tr",align:null},"CLI \u6807\u5fd7"),(0,n.kt)("th",{parentName:"tr",align:null},"\u73af\u5883\u53d8\u91cf"),(0,n.kt)("th",{parentName:"tr",align:null},"\u63cf\u8ff0"))),(0,n.kt)("tbody",{parentName:"table"},(0,n.kt)("tr",{parentName:"tbody"},(0,n.kt)("td",{parentName:"tr",align:null},(0,n.kt)("inlineCode",{parentName:"td"},"--datastore-endpoint")),(0,n.kt)("td",{parentName:"tr",align:null},(0,n.kt)("inlineCode",{parentName:"td"},"K3S_DATASTORE_ENDPOINT")),(0,n.kt)("td",{parentName:"tr",align:null},"\u6307\u5b9a PostgreSQL\u3001MySQL \u6216 etcd \u8fde\u63a5\u5b57\u7b26\u4e32\u3002\u8be5\u5b57\u7b26\u4e32\u7528\u4e8e\u63cf\u8ff0\u4e0e\u6570\u636e\u5b58\u50a8\u7684\u8fde\u63a5\u3002\u4e0d\u540c\u7684\u540e\u7aef\u5bf9\u5e94\u4e0d\u540c\u7684\u5b57\u7b26\u4e32\u7ed3\u6784\uff0c\u4e0b\u6587\u6709\u8be6\u7ec6\u8bf4\u660e\u3002")),(0,n.kt)("tr",{parentName:"tbody"},(0,n.kt)("td",{parentName:"tr",align:null},(0,n.kt)("inlineCode",{parentName:"td"},"--datastore-cafile")),(0,n.kt)("td",{parentName:"tr",align:null},(0,n.kt)("inlineCode",{parentName:"td"},"K3S_DATASTORE_CAFILE")),(0,n.kt)("td",{parentName:"tr",align:null},"TLS \u8bc1\u4e66\u9881\u53d1\u673a\u6784\uff08CA\uff09\u6587\u4ef6\uff0c\u7528\u4e8e\u786e\u4fdd\u6570\u636e\u5b58\u50a8\u7684\u901a\u4fe1\u5b89\u5168\u3002\u5982\u679c\u4f60\u7684\u6570\u636e\u5b58\u50a8\u4f7f\u7528\u81ea\u5b9a\u4e49\u8bc1\u4e66\u9881\u53d1\u673a\u6784\u7b7e\u7f72\u7684\u8bc1\u4e66\u901a\u8fc7 TLS \u5904\u7406\u8bf7\u6c42\uff0c\u5219\u53ef\u4ee5\u4f7f\u7528\u6b64\u53c2\u6570\u6307\u5b9a CA\uff0c\u4ee5\u4fbf K3s \u5ba2\u6237\u7aef\u53ef\u4ee5\u6b63\u786e\u9a8c\u8bc1\u8bc1\u4e66\u3002")),(0,n.kt)("tr",{parentName:"tbody"},(0,n.kt)("td",{parentName:"tr",align:null},(0,n.kt)("inlineCode",{parentName:"td"},"--datastore-certfile")),(0,n.kt)("td",{parentName:"tr",align:null},(0,n.kt)("inlineCode",{parentName:"td"},"K3S_DATASTORE_CERTFILE")),(0,n.kt)("td",{parentName:"tr",align:null},"TLS \u8bc1\u4e66\u6587\u4ef6\uff0c\u7528\u4e8e\u5bf9\u6570\u636e\u5b58\u50a8\u8fdb\u884c\u57fa\u4e8e\u5ba2\u6237\u7aef\u8bc1\u4e66\u7684\u9a8c\u8bc1\u3002\u8981\u4f7f\u7528\u8fd9\u4e2a\u529f\u80fd\uff0c\u4f60\u5fc5\u987b\u5c06\u6570\u636e\u5b58\u50a8\u914d\u7f6e\u4e3a\u652f\u6301\u57fa\u4e8e\u5ba2\u6237\u7aef\u8bc1\u4e66\u7684\u8ba4\u8bc1\u3002\u8981\u6307\u5b9a\u6b64\u53c2\u6570\uff0c\u4f60\u8fd8\u5fc5\u987b\u6307\u5b9a ",(0,n.kt)("inlineCode",{parentName:"td"},"datastore-keyfile")," \u53c2\u6570\u3002")),(0,n.kt)("tr",{parentName:"tbody"},(0,n.kt)("td",{parentName:"tr",align:null},(0,n.kt)("inlineCode",{parentName:"td"},"--datastore-keyfile")),(0,n.kt)("td",{parentName:"tr",align:null},(0,n.kt)("inlineCode",{parentName:"td"},"K3S_DATASTORE_KEYFILE")),(0,n.kt)("td",{parentName:"tr",align:null},"TLS \u5bc6\u94a5\u6587\u4ef6\uff0c\u7528\u4e8e\u5bf9\u6570\u636e\u5b58\u50a8\u8fdb\u884c\u57fa\u4e8e\u5ba2\u6237\u7aef\u8bc1\u4e66\u7684\u9a8c\u8bc1\u3002\u6709\u5173\u8be6\u7ec6\u4fe1\u606f\uff0c\u8bf7\u53c2\u9605\u524d\u9762\u7684 ",(0,n.kt)("inlineCode",{parentName:"td"},"datastore-certfile")," \u53c2\u6570\u3002")))),(0,n.kt)("p",null,"\u4f5c\u4e3a\u6700\u4f73\u5b9e\u8df5\uff0c\u6211\u4eec\u5efa\u8bae\u5c06\u8fd9\u4e9b\u53c2\u6570\u8bbe\u7f6e\u4e3a\u73af\u5883\u53d8\u91cf\uff0c\u800c\u4e0d\u662f\u547d\u4ee4\u884c\u53c2\u6570\uff0c\u8fd9\u6837\u4f60\u7684\u6570\u636e\u5e93\u8bc1\u4e66\u6216\u5176\u4ed6\u654f\u611f\u4fe1\u606f\u5c31\u4e0d\u4f1a\u4f5c\u4e3a\u8fdb\u7a0b\u4fe1\u606f\u7684\u4e00\u90e8\u5206\u66b4\u9732\u51fa\u6765\u3002"),(0,n.kt)("h3",{id:"\u6570\u636e\u5b58\u50a8\u7aef\u70b9\u683c\u5f0f\u548c\u529f\u80fd"},"\u6570\u636e\u5b58\u50a8\u7aef\u70b9\u683c\u5f0f\u548c\u529f\u80fd"),(0,n.kt)("p",null,"\u5982\u524d\u6240\u8ff0\uff0c\u4f20\u9012\u7ed9 ",(0,n.kt)("inlineCode",{parentName:"p"},"datastore-endpoint")," \u53c2\u6570\u7684\u503c\u7684\u683c\u5f0f\u53d6\u51b3\u4e8e\u6570\u636e\u5b58\u50a8\u540e\u7aef\u3002\u4e0b\u6587\u8be6\u7ec6\u4ecb\u7ecd\u4e86\u6bcf\u4e2a\u652f\u6301\u7684\u5916\u90e8\u6570\u636e\u5b58\u50a8\u7684\u683c\u5f0f\u548c\u529f\u80fd\u3002"),(0,n.kt)(l.Z,{mdxType:"Tabs"},(0,n.kt)(o.Z,{value:"PostgreSQL",mdxType:"TabItem"},(0,n.kt)("p",null,"\u6700\u5e38\u89c1\u7684 PostgreSQL \u7684 ",(0,n.kt)("inlineCode",{parentName:"p"},"datastore-endpoint")," \u53c2\u6570\u683c\u5f0f\u5982\u4e0b\uff1a"),(0,n.kt)("p",null,(0,n.kt)("inlineCode",{parentName:"p"},"postgres://username:password@hostname:port/database-name")),(0,n.kt)("p",null,"\u652f\u6301\u4f7f\u7528\u66f4\u9ad8\u7ea7\u7684\u914d\u7f6e\u53c2\u6570\u3002\u6709\u5173\u66f4\u591a\u4fe1\u606f\uff0c\u8bf7\u53c2\u9605 ",(0,n.kt)("a",{parentName:"p",href:"https://godoc.org/github.com/lib/pq%E3%80%82"},"https://godoc.org/github.com/lib/pq\u3002")),(0,n.kt)("p",null,"\u5982\u679c\u6307\u5b9a\u6570\u636e\u5e93\u540d\u79f0\u4e0d\u5b58\u5728\uff0cserver \u5c06\u5c1d\u8bd5\u521b\u5efa\u5b83\u3002"),(0,n.kt)("p",null,"\u5982\u679c\u4f60\u53ea\u63d0\u4f9b\u4e86 ",(0,n.kt)("inlineCode",{parentName:"p"},"postgres://")," \u4f5c\u4e3a\u7aef\u70b9\uff0cK3s \u5c06\u5c1d\u8bd5\u6267\u884c\u4ee5\u4e0b\u64cd\u4f5c\uff1a"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"\u4f7f\u7528 ",(0,n.kt)("inlineCode",{parentName:"li"},"postgres")," \u4f5c\u4e3a\u7528\u6237\u540d\u548c\u5bc6\u7801\u8fde\u63a5\u5230 localhost"),(0,n.kt)("li",{parentName:"ul"},"\u521b\u5efa\u4e00\u4e2a\u540d\u4e3a ",(0,n.kt)("inlineCode",{parentName:"li"},"kubernetes")," \u7684\u6570\u636e\u5e93"))),(0,n.kt)(o.Z,{value:"MySQL / MariaDB",mdxType:"TabItem"},(0,n.kt)("p",null,"\u6700\u5e38\u89c1\u7684 MySQL \u548c MariaDB \u7684 ",(0,n.kt)("inlineCode",{parentName:"p"},"datastore-endpoint")," \u53c2\u6570\u683c\u5f0f\u5982\u4e0b\uff1a"),(0,n.kt)("p",null,(0,n.kt)("inlineCode",{parentName:"p"},"mysql://username:password@tcp(hostname:3306)/database-name")),(0,n.kt)("p",null,"\u652f\u6301\u4f7f\u7528\u66f4\u9ad8\u7ea7\u7684\u914d\u7f6e\u53c2\u6570\u3002\u6709\u5173\u66f4\u591a\u4fe1\u606f\uff0c\u8bf7\u53c2\u9605 ",(0,n.kt)("a",{parentName:"p",href:"https://github.com/go-sql-driver/mysql#dsn-data-source-name"},"https://github.com/go-sql-driver/mysql#dsn-data-source-name")),(0,n.kt)("p",null,"\u8bf7\u6ce8\u610f\uff0c\u7531\u4e8e K3s \u7684\u4e00\u4e2a",(0,n.kt)("a",{parentName:"p",href:"https://github.com/k3s-io/k3s/issues/1093"},"\u5df2\u77e5\u95ee\u9898"),"\uff0c\u4f60\u65e0\u6cd5\u8bbe\u7f6e ",(0,n.kt)("inlineCode",{parentName:"p"},"tls")," \u53c2\u6570\u3002TLS \u901a\u4fe1\u662f\u652f\u6301\u7684\uff0c\u4f46\u4f60\u4e0d\u80fd\u5c06\u6b64\u53c2\u6570\u8bbe\u7f6e\u4e3a \u201cskip-verify\u201d \u4ee5\u4f7f K3s \u8df3\u8fc7\u8bc1\u4e66\u9a8c\u8bc1\u3002"),(0,n.kt)("p",null,"\u5982\u679c\u6307\u5b9a\u6570\u636e\u5e93\u540d\u79f0\u4e0d\u5b58\u5728\uff0cserver \u5c06\u5c1d\u8bd5\u521b\u5efa\u5b83\u3002"),(0,n.kt)("p",null,"\u5982\u679c\u4f60\u53ea\u63d0\u4f9b\u4e86 ",(0,n.kt)("inlineCode",{parentName:"p"},"mysql://")," \u4f5c\u4e3a\u7aef\u70b9\uff0cK3s \u5c06\u5c1d\u8bd5\u6267\u884c\u4ee5\u4e0b\u64cd\u4f5c\uff1a"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"\u901a\u8fc7 ",(0,n.kt)("inlineCode",{parentName:"li"},"root")," \u7528\u6237\uff0c\u4e0d\u4f7f\u7528\u5bc6\u7801\u8fde\u63a5\u5230 ",(0,n.kt)("inlineCode",{parentName:"li"},"/var/run/mysqld/mysqld.sock")," \u7684 MySQL socket"),(0,n.kt)("li",{parentName:"ul"},"\u521b\u5efa\u4e00\u4e2a\u540d\u4e3a ",(0,n.kt)("inlineCode",{parentName:"li"},"kubernetes")," \u7684\u6570\u636e\u5e93"))),(0,n.kt)(o.Z,{value:"etcd",mdxType:"TabItem"},(0,n.kt)("p",null,"\u6700\u5e38\u89c1\u7684 etcd \u7684 ",(0,n.kt)("inlineCode",{parentName:"p"},"datastore-endpoint")," \u53c2\u6570\u683c\u5f0f\u5982\u4e0b\uff1a"),(0,n.kt)("p",null,(0,n.kt)("inlineCode",{parentName:"p"},"https://etcd-host-1:2379,https://etcd-host-2:2379,https://etcd-host-3:2379")),(0,n.kt)("p",null,"\u4ee5\u4e0a\u5047\u8bbe\u4f7f\u7528\u7684\u662f\u5178\u578b\u7684\u4e09\u8282\u70b9 etcd \u96c6\u7fa4\u3002\u8be5\u53c2\u6570\u53ef\u4ee5\u518d\u63a5\u53d7\u4e00\u4e2a\u9017\u53f7\u5206\u9694\u7684 etcd URL\u3002"))))}m.isMDXComponent=!0}}]);