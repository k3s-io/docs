"use strict";(self.webpackChunkk_3_s_docs=self.webpackChunkk_3_s_docs||[]).push([[3412],{3905:(e,t,a)=>{a.d(t,{Zo:()=>u,kt:()=>m});var n=a(7294);function r(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function l(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function s(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?l(Object(a),!0).forEach((function(t){r(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):l(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function i(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},l=Object.keys(e);for(n=0;n<l.length;n++)a=l[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(n=0;n<l.length;n++)a=l[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var p=n.createContext({}),o=function(e){var t=n.useContext(p),a=t;return e&&(a="function"==typeof e?e(t):s(s({},t),e)),a},u=function(e){var t=o(e.components);return n.createElement(p.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},c=n.forwardRef((function(e,t){var a=e.components,r=e.mdxType,l=e.originalType,p=e.parentName,u=i(e,["components","mdxType","originalType","parentName"]),c=o(a),m=r,k=c["".concat(p,".").concat(m)]||c[m]||d[m]||l;return a?n.createElement(k,s(s({ref:t},u),{},{components:a})):n.createElement(k,s({ref:t},u))}));function m(e,t){var a=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var l=a.length,s=new Array(l);s[0]=c;var i={};for(var p in t)hasOwnProperty.call(t,p)&&(i[p]=t[p]);i.originalType=e,i.mdxType="string"==typeof e?e:r,s[1]=i;for(var o=2;o<l;o++)s[o]=a[o];return n.createElement.apply(null,s)}return n.createElement.apply(null,a)}c.displayName="MDXCreateElement"},5162:(e,t,a)=>{a.d(t,{Z:()=>s});var n=a(7294),r=a(6010);const l="tabItem_Ymn6";function s(e){let{children:t,hidden:a,className:s}=e;return n.createElement("div",{role:"tabpanel",className:(0,r.Z)(l,s),hidden:a},t)}},4866:(e,t,a)=>{a.d(t,{Z:()=>S});var n=a(3117),r=a(7294),l=a(6010),s=a(2466),i=a(6775),p=a(1980),o=a(7392),u=a(12);function d(e){return function(e){return r.Children.map(e,(e=>{if((0,r.isValidElement)(e)&&"value"in e.props)return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))}(e).map((e=>{let{props:{value:t,label:a,attributes:n,default:r}}=e;return{value:t,label:a,attributes:n,default:r}}))}function c(e){const{values:t,children:a}=e;return(0,r.useMemo)((()=>{const e=t??d(a);return function(e){const t=(0,o.l)(e,((e,t)=>e.value===t.value));if(t.length>0)throw new Error(`Docusaurus error: Duplicate values "${t.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[t,a])}function m(e){let{value:t,tabValues:a}=e;return a.some((e=>e.value===t))}function k(e){let{queryString:t=!1,groupId:a}=e;const n=(0,i.k6)(),l=function(e){let{queryString:t=!1,groupId:a}=e;if("string"==typeof t)return t;if(!1===t)return null;if(!0===t&&!a)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return a??null}({queryString:t,groupId:a});return[(0,p._X)(l),(0,r.useCallback)((e=>{if(!l)return;const t=new URLSearchParams(n.location.search);t.set(l,e),n.replace({...n.location,search:t.toString()})}),[l,n])]}function N(e){const{defaultValue:t,queryString:a=!1,groupId:n}=e,l=c(e),[s,i]=(0,r.useState)((()=>function(e){let{defaultValue:t,tabValues:a}=e;if(0===a.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(t){if(!m({value:t,tabValues:a}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${t}" but none of its children has the corresponding value. Available values are: ${a.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return t}const n=a.find((e=>e.default))??a[0];if(!n)throw new Error("Unexpected error: 0 tabValues");return n.value}({defaultValue:t,tabValues:l}))),[p,o]=k({queryString:a,groupId:n}),[d,N]=function(e){let{groupId:t}=e;const a=function(e){return e?`docusaurus.tab.${e}`:null}(t),[n,l]=(0,u.Nk)(a);return[n,(0,r.useCallback)((e=>{a&&l.set(e)}),[a,l])]}({groupId:n}),b=(()=>{const e=p??d;return m({value:e,tabValues:l})?e:null})();(0,r.useLayoutEffect)((()=>{b&&i(b)}),[b]);return{selectedValue:s,selectValue:(0,r.useCallback)((e=>{if(!m({value:e,tabValues:l}))throw new Error(`Can't select invalid tab value=${e}`);i(e),o(e),N(e)}),[o,N,l]),tabValues:l}}var b=a(2389);const h="tabList__CuJ",g="tabItem_LNqP";function f(e){let{className:t,block:a,selectedValue:i,selectValue:p,tabValues:o}=e;const u=[],{blockElementScrollPositionUntilNextRender:d}=(0,s.o5)(),c=e=>{const t=e.currentTarget,a=u.indexOf(t),n=o[a].value;n!==i&&(d(t),p(n))},m=e=>{let t=null;switch(e.key){case"Enter":c(e);break;case"ArrowRight":{const a=u.indexOf(e.currentTarget)+1;t=u[a]??u[0];break}case"ArrowLeft":{const a=u.indexOf(e.currentTarget)-1;t=u[a]??u[u.length-1];break}}t?.focus()};return r.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,l.Z)("tabs",{"tabs--block":a},t)},o.map((e=>{let{value:t,label:a,attributes:s}=e;return r.createElement("li",(0,n.Z)({role:"tab",tabIndex:i===t?0:-1,"aria-selected":i===t,key:t,ref:e=>u.push(e),onKeyDown:m,onClick:c},s,{className:(0,l.Z)("tabs__item",g,s?.className,{"tabs__item--active":i===t})}),a??t)})))}function y(e){let{lazy:t,children:a,selectedValue:n}=e;if(a=Array.isArray(a)?a:[a],t){const e=a.find((e=>e.props.value===n));return e?(0,r.cloneElement)(e,{className:"margin-top--md"}):null}return r.createElement("div",{className:"margin-top--md"},a.map(((e,t)=>(0,r.cloneElement)(e,{key:t,hidden:e.props.value!==n}))))}function v(e){const t=N(e);return r.createElement("div",{className:(0,l.Z)("tabs-container",h)},r.createElement(f,(0,n.Z)({},e,t)),r.createElement(y,(0,n.Z)({},e,t)))}function S(e){const t=(0,b.Z)();return r.createElement(v,(0,n.Z)({key:String(t)},e))}},178:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>u,contentTitle:()=>p,default:()=>m,frontMatter:()=>i,metadata:()=>o,toc:()=>d});var n=a(3117),r=(a(7294),a(3905)),l=a(4866),s=a(5162);const i={title:"etcd-snapshot"},p="k3s etcd-snapshot",o={unversionedId:"cli/etcd-snapshot",id:"cli/etcd-snapshot",title:"etcd-snapshot",description:"\u4ece v1.19.1+k3s1 \u8d77\u53ef\u7528",source:"@site/i18n/zh/docusaurus-plugin-content-docs/current/cli/etcd-snapshot.md",sourceDirName:"cli",slug:"/cli/etcd-snapshot",permalink:"/zh/cli/etcd-snapshot",draft:!1,editUrl:"https://github.com/k3s-io/docs/edit/main/docs/cli/etcd-snapshot.md",tags:[],version:"current",lastUpdatedAt:1685608136,formattedLastUpdatedAt:"2023\u5e746\u67081\u65e5",frontMatter:{title:"etcd-snapshot"},sidebar:"mySidebar",previous:{title:"certificate",permalink:"/zh/cli/certificate"},next:{title:"secrets-encrypt",permalink:"/zh/cli/secrets-encrypt"}},u={},d=[{value:"\u521b\u5efa\u5feb\u7167",id:"\u521b\u5efa\u5feb\u7167",level:4},{value:"\u4f7f\u7528\u5feb\u7167\u6062\u590d\u96c6\u7fa4",id:"\u4f7f\u7528\u5feb\u7167\u6062\u590d\u96c6\u7fa4",level:4},{value:"\u9009\u9879",id:"\u9009\u9879",level:4},{value:"S3 \u517c\u5bb9 API \u652f\u6301",id:"s3-\u517c\u5bb9-api-\u652f\u6301",level:4},{value:"Etcd \u5feb\u7167\u548c\u6062\u590d\u5b50\u547d\u4ee4",id:"etcd-\u5feb\u7167\u548c\u6062\u590d\u5b50\u547d\u4ee4",level:4}],c={toc:d};function m(e){let{components:t,...a}=e;return(0,r.kt)("wrapper",(0,n.Z)({},c,a,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"k3s-etcd-snapshot"},"k3s etcd-snapshot"),(0,r.kt)("admonition",{title:"\u7248\u672c",type:"info"},(0,r.kt)("p",{parentName:"admonition"},"\u4ece ",(0,r.kt)("a",{parentName:"p",href:"https://github.com/k3s-io/k3s/releases/tag/v1.19.1%2Bk3s1"},"v1.19.1+k3s1")," \u8d77\u53ef\u7528")),(0,r.kt)("p",null,"\u5728\u672c\u8282\u4e2d\uff0c\u4f60\u5c06\u5b66\u4e60\u5982\u4f55\u521b\u5efa K3s \u5d4c\u5165\u5f0f etcd \u6570\u636e\u5b58\u50a8\u7684\u5907\u4efd\uff0c\u4ee5\u53ca\u5982\u4f55\u4f7f\u7528\u5907\u4efd\u6062\u590d\u96c6\u7fa4\u3002"),(0,r.kt)("h4",{id:"\u521b\u5efa\u5feb\u7167"},"\u521b\u5efa\u5feb\u7167"),(0,r.kt)("p",null,"\u9ed8\u8ba4\u60c5\u51b5\u4e0b\uff0c\u5feb\u7167\u5728\u7cfb\u7edf\u65f6\u95f4 00:00 \u548c 12:00 \u542f\u7528\uff0c\u4f1a\u4fdd\u7559 5 \u4e2a\u5feb\u7167\u3002\u8981\u914d\u7f6e\u5feb\u7167\u95f4\u9694\u6216\u4fdd\u7559\u5feb\u7167\u7684\u6570\u91cf\uff0c\u8bf7\u53c2\u9605",(0,r.kt)("a",{parentName:"p",href:"#%E9%80%89%E9%A1%B9"},"\u9009\u9879"),"\u3002"),(0,r.kt)("p",null,"\u5feb\u7167\u76ee\u5f55\u9ed8\u8ba4\u4e3a ",(0,r.kt)("inlineCode",{parentName:"p"},"${data-dir}/server/db/snapshots"),"\u3002data-dir \u7684\u9ed8\u8ba4\u503c\u4e3a ",(0,r.kt)("inlineCode",{parentName:"p"},"/var/lib/rancher/k3s"),"\uff0c\u4f60\u53ef\u4ee5\u901a\u8fc7\u8bbe\u7f6e ",(0,r.kt)("inlineCode",{parentName:"p"},"--data-dir")," \u6807\u5fd7\u6765\u66f4\u6539\u5b83\u3002"),(0,r.kt)("h4",{id:"\u4f7f\u7528\u5feb\u7167\u6062\u590d\u96c6\u7fa4"},"\u4f7f\u7528\u5feb\u7167\u6062\u590d\u96c6\u7fa4"),(0,r.kt)("p",null,"\u4f7f\u7528\u5907\u4efd\u6062\u590d K3s \u65f6\uff0c\u65e7\u7684\u6570\u636e\u76ee\u5f55\u5c06\u88ab\u79fb\u52a8\u5230 ",(0,r.kt)("inlineCode",{parentName:"p"},"${data-dir}/server/db/etcd-old/"),"\u3002\u7136\u540e K3s \u5c06\u5c1d\u8bd5\u901a\u8fc7\u521b\u5efa\u4e00\u4e2a\u65b0\u7684\u6570\u636e\u76ee\u5f55\u6765\u6062\u590d\u5feb\u7167\uff0c\u7136\u540e\u4f7f\u7528\u5177\u6709\u4e00\u4e2a etcd \u6210\u5458\u7684\u65b0 K3s \u96c6\u7fa4\u542f\u52a8 etcd\u3002"),(0,r.kt)("p",null,"\u4f7f\u7528\u5907\u4efd\u6062\u590d\u96c6\u7fa4\uff1a"),(0,r.kt)(l.Z,{mdxType:"Tabs"},(0,r.kt)(s.Z,{value:"\u5355\u670d\u52a1\u5668",mdxType:"TabItem"},(0,r.kt)("p",null,"\u4f7f\u7528 ",(0,r.kt)("inlineCode",{parentName:"p"},"--cluster-reset")," \u9009\u9879\u8fd0\u884c K3s\uff0c\u540c\u65f6\u6307\u5b9a ",(0,r.kt)("inlineCode",{parentName:"p"},"--cluster-reset-restore-path"),"\uff1a"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"k3s server \\\n  --cluster-reset \\\n  --cluster-reset-restore-path=<PATH-TO-SNAPSHOT>\n")),(0,r.kt)("p",null,(0,r.kt)("strong",{parentName:"p"},"\u7ed3\u679c"),"\uff1a\u65e5\u5fd7\u4e2d\u7684\u4e00\u6761\u6d88\u606f\u8868\u793a K3s \u53ef\u4ee5\u5728\u6ca1\u6709\u6807\u5fd7\u7684\u60c5\u51b5\u4e0b\u91cd\u65b0\u542f\u52a8\u3002\u518d\u6b21\u542f\u52a8 K3s\uff0cK3s \u5e94\u8be5\u4f1a\u6210\u529f\u8fd0\u884c\u5e76\u901a\u8fc7\u6307\u5b9a\u7684\u5feb\u7167\u6062\u590d\u3002")),(0,r.kt)(s.Z,{value:"\u9ad8\u53ef\u7528",mdxType:"TabItem"},(0,r.kt)("p",null,"\u5728\u6b64\u793a\u4f8b\u4e2d\u6709 3 \u4e2a Server\uff0c\u5206\u522b\u662f ",(0,r.kt)("inlineCode",{parentName:"p"},"S1"),"\u3001",(0,r.kt)("inlineCode",{parentName:"p"},"S2"),"\u548c ",(0,r.kt)("inlineCode",{parentName:"p"},"S3"),"\u3002\u5feb\u7167\u4f4d\u4e8e ",(0,r.kt)("inlineCode",{parentName:"p"},"S1")," \u4e0a\u3002"),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("p",{parentName:"li"},"\u5728 S1 \u4e0a\uff0c\u4f7f\u7528 ",(0,r.kt)("inlineCode",{parentName:"p"},"--cluster-reset")," \u9009\u9879\u8fd0\u884c K3s\uff0c\u540c\u65f6\u6307\u5b9a ",(0,r.kt)("inlineCode",{parentName:"p"},"--cluster-reset-restore-path"),"\uff1a"),(0,r.kt)("pre",{parentName:"li"},(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"k3s server \\\n  --cluster-reset \\\n  --cluster-reset-restore-path=<PATH-TO-SNAPSHOT>\n")),(0,r.kt)("p",{parentName:"li"},(0,r.kt)("strong",{parentName:"p"},"\u7ed3\u679c"),"\uff1a\u65e5\u5fd7\u4e2d\u7684\u4e00\u6761\u6d88\u606f\u8868\u793a K3s \u53ef\u4ee5\u5728\u6ca1\u6709\u6807\u5fd7\u7684\u60c5\u51b5\u4e0b\u91cd\u65b0\u542f\u52a8\u3002")),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("p",{parentName:"li"},"\u5728 S2 \u548c S3 \u4e0a\uff0c\u505c\u6b62 K3s\u3002\u7136\u540e\u5220\u9664\u6570\u636e\u76ee\u5f55 ",(0,r.kt)("inlineCode",{parentName:"p"},"/var/lib/rancher/k3s/server/db/"),"\uff1a"),(0,r.kt)("pre",{parentName:"li"},(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"systemctl stop k3s\nrm -rf /var/lib/rancher/k3s/server/db/\n"))),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("p",{parentName:"li"},"\u5728 S1 \u4e0a\uff0c\u518d\u6b21\u542f\u52a8 K3s\uff1a"),(0,r.kt)("pre",{parentName:"li"},(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"systemctl start k3s\n"))),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("p",{parentName:"li"},"\u5728 S2 \u548c S3 \u4e0a\uff0c\u518d\u6b21\u542f\u52a8 K3s \u4ee5\u52a0\u5165\u6062\u590d\u540e\u7684\u96c6\u7fa4\uff1a"),(0,r.kt)("pre",{parentName:"li"},(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"systemctl start k3s\n")))))),(0,r.kt)("h4",{id:"\u9009\u9879"},"\u9009\u9879"),(0,r.kt)("p",null,"\u4f60\u53ef\u4ee5\u901a\u8fc7\u547d\u4ee4\u884c\u6216\u8005",(0,r.kt)("a",{parentName:"p",href:"/zh/installation/configuration#%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6"},"\u914d\u7f6e\u6587\u4ef6"),"\uff08\u53ef\u80fd\u66f4\u5bb9\u6613\u4f7f\u7528\uff09\u4f20\u5165\u8fd9\u4e9b\u9009\u9879\u3002"),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:null},"\u9009\u9879"),(0,r.kt)("th",{parentName:"tr",align:null},"\u63cf\u8ff0"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"--etcd-disable-snapshots")),(0,r.kt)("td",{parentName:"tr",align:null},"\u7981\u7528\u81ea\u52a8 etcd \u5feb\u7167")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"--etcd-snapshot-schedule-cron")," value"),(0,r.kt)("td",{parentName:"tr",align:null},"cron \u89c4\u8303\u4e2d\u7684\u5feb\u7167\u95f4\u9694\u65f6\u95f4\u3002eg. \u6bcf 5 \u5c0f\u65f6 ",(0,r.kt)("inlineCode",{parentName:"td"},"0 */5 * * *"),"\uff08\u9ed8\u8ba4\u503c\uff1a",(0,r.kt)("inlineCode",{parentName:"td"},"0 */12 * * *"),"\uff09")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"--etcd-snapshot-retention")," value"),(0,r.kt)("td",{parentName:"tr",align:null},"\u8981\u4fdd\u7559\u7684\u5feb\u7167\u6570\u91cf\uff08\u9ed8\u8ba4\u503c\uff1a5\uff09")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"--etcd-snapshot-dir")," value"),(0,r.kt)("td",{parentName:"tr",align:null},"\u4fdd\u5b58\u6570\u636e\u5e93\u5feb\u7167\u7684\u76ee\u5f55\u3002\uff08\u9ed8\u8ba4\u4f4d\u7f6e\uff1a",(0,r.kt)("inlineCode",{parentName:"td"},"${data-dir}/db/snapshots"),"\uff09")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"--cluster-reset")),(0,r.kt)("td",{parentName:"tr",align:null},"\u5fd8\u8bb0\u6240\u6709\u5bf9\u7b49\u70b9\uff0c\u6210\u4e3a\u65b0\u96c6\u7fa4\u7684\u552f\u4e00\u6210\u5458\u3002\u4e5f\u53ef\u4ee5\u4f7f\u7528\u73af\u5883\u53d8\u91cf ",(0,r.kt)("inlineCode",{parentName:"td"},"[$K3S_CLUSTER_RESET]")," \u8fdb\u884c\u8bbe\u7f6e\u3002")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"--cluster-reset-restore-path")," value"),(0,r.kt)("td",{parentName:"tr",align:null},"\u8981\u6062\u590d\u7684\u5feb\u7167\u6587\u4ef6\u8def\u5f84")))),(0,r.kt)("h4",{id:"s3-\u517c\u5bb9-api-\u652f\u6301"},"S3 \u517c\u5bb9 API \u652f\u6301"),(0,r.kt)("p",null,"K3s \u652f\u6301\u5411\u5177\u6709 S3 \u517c\u5bb9 API \u7684\u7cfb\u7edf\u5199\u5165 etcd \u5feb\u7167\u548c\u4ece\u7cfb\u7edf\u4e2d\u6062\u590d etcd \u5feb\u7167\u3002S3 \u652f\u6301\u6309\u9700\u548c\u8ba1\u5212\u5feb\u7167\u3002"),(0,r.kt)("p",null,"\u4ee5\u4e0b\u53c2\u6570\u5df2\u6dfb\u52a0\u5230 ",(0,r.kt)("inlineCode",{parentName:"p"},"server")," \u5b50\u547d\u4ee4\u4e2d\u3002",(0,r.kt)("inlineCode",{parentName:"p"},"etcd-snapshot")," \u5b50\u547d\u4ee4\u4e5f\u5b58\u5728\u8fd9\u4e9b\u6807\u5fd7\uff0c\u4f46\u662f\u5220\u9664\u4e86 ",(0,r.kt)("inlineCode",{parentName:"p"},"--etcd-s3")," \u90e8\u5206\u4ee5\u907f\u514d\u5197\u4f59\u3002"),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:null},"\u9009\u9879"),(0,r.kt)("th",{parentName:"tr",align:null},"\u63cf\u8ff0"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"--etcd-s3")),(0,r.kt)("td",{parentName:"tr",align:null},"\u542f\u7528\u5907\u4efd\u5230 S3")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"--etcd-s3-endpoint")),(0,r.kt)("td",{parentName:"tr",align:null},"S3 \u7aef\u70b9\u7f51\u5740")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"--etcd-s3-endpoint-ca")),(0,r.kt)("td",{parentName:"tr",align:null},"S3 \u81ea\u5b9a\u4e49 CA \u8bc1\u4e66\uff0c\u7528\u4e8e\u8fde\u63a5\u5230 S3 \u7aef\u70b9")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"--etcd-s3-skip-ssl-verify")),(0,r.kt)("td",{parentName:"tr",align:null},"\u7981\u7528 S3 SSL \u8bc1\u4e66\u9a8c\u8bc1")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"--etcd-s3-access-key")),(0,r.kt)("td",{parentName:"tr",align:null},"S3 access key")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"--etcd-s3-secret-key")),(0,r.kt)("td",{parentName:"tr",align:null},"S3 secret key")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"--etcd-s3-bucket")),(0,r.kt)("td",{parentName:"tr",align:null},"S3 \u5b58\u50a8\u6876\u540d\u79f0")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"--etcd-s3-region")),(0,r.kt)("td",{parentName:"tr",align:null},"S3 \u533a\u57df/\u5b58\u50a8\u6876\u4f4d\u7f6e\uff08\u53ef\u9009\uff09\u3002\u9ed8\u8ba4\u4e3a us-east-1")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"--etcd-s3-folder")),(0,r.kt)("td",{parentName:"tr",align:null},"S3 \u6587\u4ef6\u5939")))),(0,r.kt)("p",null,"\u6267\u884c\u6309\u9700\u7684 etcd \u5feb\u7167\u5e76\u5c06\u5176\u4fdd\u5b58\u5230 S3\uff1a"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"k3s etcd-snapshot \\\n  --s3 \\\n  --s3-bucket=<S3-BUCKET-NAME> \\\n  --s3-access-key=<S3-ACCESS-KEY> \\\n  --s3-secret-key=<S3-SECRET-KEY>\n")),(0,r.kt)("p",null,"\u8981\u4ece S3 \u4e2d\u6267\u884c\u6309\u9700\u7684 etcd \u5feb\u7167\u8fd8\u539f\uff0c\u9996\u5148\u786e\u4fdd K3s \u6ca1\u6709\u8fd0\u884c\u3002\u7136\u540e\u8fd0\u884c\u4ee5\u4e0b\u547d\u4ee4\uff1a"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"k3s server \\\n  --cluster-init \\\n  --cluster-reset \\\n  --etcd-s3 \\\n  --cluster-reset-restore-path=<SNAPSHOT-NAME> \\\n  --etcd-s3-bucket=<S3-BUCKET-NAME> \\\n  --etcd-s3-access-key=<S3-ACCESS-KEY> \\\n  --etcd-s3-secret-key=<S3-SECRET-KEY>\n")),(0,r.kt)("h4",{id:"etcd-\u5feb\u7167\u548c\u6062\u590d\u5b50\u547d\u4ee4"},"Etcd \u5feb\u7167\u548c\u6062\u590d\u5b50\u547d\u4ee4"),(0,r.kt)("p",null,"K3s \u652f\u6301\u7528\u4e8e\u5904\u7406 etcd \u5feb\u7167\u7684\u4e00\u7ec4\u5b50\u547d\u4ee4\u3002"),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:null},"\u5b50\u547d\u4ee4"),(0,r.kt)("th",{parentName:"tr",align:null},"\u63cf\u8ff0"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"delete"),(0,r.kt)("td",{parentName:"tr",align:null},"\u5220\u9664\u7ed9\u5b9a\u7684\u5feb\u7167")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"ls, list, l"),(0,r.kt)("td",{parentName:"tr",align:null},"\u5217\u51fa\u5feb\u7167")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"prune"),(0,r.kt)("td",{parentName:"tr",align:null},"\u5220\u9664\u8d85\u8fc7\u914d\u7f6e\u7684\u4fdd\u7559\u6570\u91cf\u7684\u5feb\u7167")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"save"),(0,r.kt)("td",{parentName:"tr",align:null},"\u89e6\u53d1\u5373\u65f6 etcd \u5feb\u7167")))),(0,r.kt)("admonition",{type:"note"},(0,r.kt)("p",{parentName:"admonition"},(0,r.kt)("inlineCode",{parentName:"p"},"save")," \u5b50\u547d\u4ee4\u4e0e ",(0,r.kt)("inlineCode",{parentName:"p"},"k3s etcd-snapshot")," \u76f8\u540c\u3002\u540e\u8005\u6700\u7ec8\u5c06\u88ab\u524d\u8005\u53d6\u4ee3\u3002")),(0,r.kt)("p",null,"\u65e0\u8bba etcd \u5feb\u7167\u662f\u5b58\u50a8\u5728\u672c\u5730\u8fd8\u662f\u5b58\u50a8\u5728 S3 \u517c\u5bb9\u7684\u5bf9\u8c61\u5b58\u50a8\u4e2d\uff0c\u8fd9\u4e9b\u547d\u4ee4\u90fd\u5c06\u6309\u9884\u671f\u6267\u884c\u3002"),(0,r.kt)("p",null,"\u6709\u5173 etcd \u5feb\u7167\u5b50\u547d\u4ee4\u7684\u66f4\u591a\u4fe1\u606f\uff0c\u8bf7\u8fd0\u884c ",(0,r.kt)("inlineCode",{parentName:"p"},"k3s etcd-snapshot"),"\u3002"),(0,r.kt)("p",null,"\u4ece S3 \u4e2d\u5220\u9664\u5feb\u7167\u3002"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"k3s etcd-snapshot delete          \\\n  --s3                            \\\n  --s3-bucket=<S3-BUCKET-NAME>    \\\n  --s3-access-key=<S3-ACCESS-KEY> \\\n  --s3-secret-key=<S3-SECRET-KEY> \\\n  <SNAPSHOT-NAME>\n")),(0,r.kt)("p",null,"\u4f7f\u7528\u9ed8\u8ba4\u4fdd\u7559\u7b56\u7565 (5) \u4fee\u526a\u672c\u5730\u5feb\u7167\u3002",(0,r.kt)("inlineCode",{parentName:"p"},"prune")," \u5b50\u547d\u4ee4\u63a5\u53d7\u989d\u5916\u7684\u6807\u5fd7 ",(0,r.kt)("inlineCode",{parentName:"p"},"--snapshot-retention"),"\uff0c\u5141\u8bb8\u8986\u76d6\u9ed8\u8ba4\u4fdd\u7559\u7b56\u7565\u3002"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"k3s etcd-snapshot prune\n")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"k3s etcd-snapshot prune --snapshot-retention 10\n")))}m.isMDXComponent=!0}}]);