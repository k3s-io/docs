"use strict";(self.webpackChunkk_3_s_docs=self.webpackChunkk_3_s_docs||[]).push([[920],{2027:function(e,t,r){r.r(t),r.d(t,{default:function(){return M}});var n=r(7872),a=r(1017),l=r(4035),u=r(7294),s=r(2263),c=r(3929),o=r(5742),i=r(9960),m=r(5999),h=["zero","one","two","few","many","other"];function f(e){return h.filter((function(t){return e.includes(t)}))}var p={locale:"en",pluralForms:f(["one","other"]),select:function(e){return 1===e?"one":"other"}};function d(){var e=(0,s.Z)().i18n.currentLocale;return(0,u.useMemo)((function(){try{return t=e,r=new Intl.PluralRules(t),{locale:t,pluralForms:f(r.resolvedOptions().pluralCategories),select:function(e){return r.select(e)}}}catch(n){return console.error('Failed to use Intl.PluralRules for locale "'+e+'".\nDocusaurus will fallback to the default (English) implementation.\nError: '+n.message+"\n"),p}var t,r}),[e])}function g(){var e=d();return{selectMessage:function(t,r){return function(e,t,r){var n=e.split("|");if(1===n.length)return n[0];n.length>r.pluralForms.length&&console.error("For locale="+r.locale+", a maximum of "+r.pluralForms.length+" plural forms are expected ("+r.pluralForms.join(",")+"), but the message contains "+n.length+": "+e);var a=r.select(t),l=r.pluralForms.indexOf(a);return n[Math.min(l,n.length-1)]}(r,t,e)}}}var v=r(6775),E=r(412);var y=function(){var e=(0,v.k6)(),t=(0,v.TH)(),r=(0,s.Z)().siteConfig.baseUrl,n=E.Z.canUseDOM?new URLSearchParams(t.search):null,a=(null==n?void 0:n.get("q"))||"",l=(null==n?void 0:n.get("ctx"))||"",u=(null==n?void 0:n.get("version"))||"",c=function(e){var r=new URLSearchParams(t.search);return e?r.set("q",e):r.delete("q"),r};return{searchValue:a,searchContext:l,searchVersion:u,updateSearchPath:function(t){var r=c(t);e.replace({search:r.toString()})},generateSearchPageLink:function(e){var t=c(e);return r+"search?"+t.toString()}}},S=r(22),w=r(8202),_=r(2539),b=r(726),k=r(2775),I=r(311),P=r(3926),x=r(1029),F="searchQueryInput_CFBF",R="searchResultItem_U687",Z="searchResultItemPath_uIbk",C="searchResultItemSummary_oZHr";function T(){var e=(0,s.Z)().siteConfig.baseUrl,t=g().selectMessage,r=y(),n=r.searchValue,c=r.searchContext,i=r.searchVersion,h=r.updateSearchPath,f=(0,u.useState)(n),p=f[0],d=f[1],v=(0,u.useState)(),E=v[0],_=v[1],b=(0,u.useState)(),k=b[0],P=b[1],x=""+e+i,R=(0,u.useMemo)((function(){return p?(0,m.I)({id:"theme.SearchPage.existingResultsTitle",message:'Search results for "{query}"',description:"The search page title for non-empty query"},{query:p}):(0,m.I)({id:"theme.SearchPage.emptyResultsTitle",message:"Search the documentation",description:"The search page title for empty query"})}),[p]);(0,u.useEffect)((function(){h(p),E&&(p?E(p,(function(e){P(e)})):P(void 0))}),[p,E]);var Z=(0,u.useCallback)((function(e){d(e.target.value)}),[]);return(0,u.useEffect)((function(){n&&n!==p&&d(n)}),[n]),(0,u.useEffect)((function(){function e(){return(e=(0,l.Z)((0,a.Z)().mark((function e(){var t,r,n;return(0,a.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,(0,S.w)(x,c);case 2:t=e.sent,r=t.wrappedIndexes,n=t.zhDictionary,_((function(){return(0,w.v)(r,n,100)}));case 6:case"end":return e.stop()}}),e)})))).apply(this,arguments)}!function(){e.apply(this,arguments)}()}),[c,x]),u.createElement(u.Fragment,null,u.createElement(o.Z,null,u.createElement("meta",{property:"robots",content:"noindex, follow"}),u.createElement("title",null,R)),u.createElement("div",{className:"container margin-vert--lg"},u.createElement("h1",null,R),u.createElement("input",{type:"search",name:"q",className:F,"aria-label":"Search",onChange:Z,value:p,autoComplete:"off",autoFocus:!0}),!E&&p&&u.createElement("div",null,u.createElement(I.Z,null)),k&&(k.length>0?u.createElement("p",null,t(k.length,(0,m.I)({id:"theme.SearchPage.documentsFound.plurals",message:"1 document found|{count} documents found",description:'Pluralized label for "{count} documents found". Use as much plural forms (separated by "|") as your language support (see https://www.unicode.org/cldr/cldr-aux/charts/34/supplemental/language_plural_rules.html)'},{count:k.length}))):u.createElement("p",null,(0,m.I)({id:"theme.SearchPage.noResultsText",message:"No documents were found",description:"The paragraph for empty search result"}))),u.createElement("section",null,k&&k.map((function(e){return u.createElement(q,{key:e.document.i,searchResult:e})})))))}function q(e){var t=e.searchResult,r=t.document,a=t.type,l=t.page,s=t.tokens,c=t.metadata,o=0===a,m=2===a,h=(o?r.b:l.b).slice(),f=m?r.s:r.t;o||h.push(l.t);var p="";if(x.vc&&s.length>0){for(var d,g=new URLSearchParams,v=(0,n.Z)(s);!(d=v()).done;){var E=d.value;g.append("_highlight",E)}p="?"+g.toString()}return u.createElement("article",{className:R},u.createElement("h2",null,u.createElement(i.Z,{to:r.u+p+(r.h||""),dangerouslySetInnerHTML:{__html:m?(0,_.C)(f,s):(0,b.o)(f,(0,k.m)(c,"t"),s,100)}})),h.length>0&&u.createElement("p",{className:Z},(0,P.e)(h)),m&&u.createElement("p",{className:C,dangerouslySetInnerHTML:{__html:(0,b.o)(r.t,(0,k.m)(c,"t"),s,100)}}))}var M=function(){return u.createElement(c.Z,null,u.createElement(T,null))}}}]);