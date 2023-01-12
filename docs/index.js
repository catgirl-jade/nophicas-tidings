(()=>{"use strict";var e,t,n,a,r={962:(e,t,n)=>{n.d(t,{Z:()=>c});var a=n(402),r=n.n(a),o=n(352),i=n.n(o)()(r());i.push([e.id,"/* Copyright 2023 catgirl-jade\n \n   This file is part of nophicas-tidings.\n \n   nophicas-tidings is free software: you can redistribute it and or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.\n \n   nophicas-tidings is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.\n \n   You should have received a copy of the GNU General Public License along with Foobar. If not, see <https:  www.gnu.org licenses >.\n*/\ndiv.calculated_stat {\n  background-color: #00BB00;\n}\ndiv.calculating_stat {\n  background-color: #BB0000;\n}\nlabel.validated {\n  background-color: #00BB00;\n}\nlabel.unvalidated {\n  background-color: #BB0000;\n}\nspan.average-label {\n  font-weight: bold;\n}\ndiv.result-header {\n  background-color: #DDDDDD;\n}\ndiv.action-row {\n\n}\ndiv.action-row > div.action-quantity {\n  text-align: center;\n}\ndiv.action-row > div.action-icons {\n  text-align: left;\n}\ndiv.action-row > div.action-icons > img {\n  width: 32px;\n  height: 32px;\n}\ndiv.action-row > div.action-name {\n  text-align: left;\n}\n",""]);const c=i},352:e=>{e.exports=function(e){var t=[];return t.toString=function(){return this.map((function(t){var n="",a=void 0!==t[5];return t[4]&&(n+="@supports (".concat(t[4],") {")),t[2]&&(n+="@media ".concat(t[2]," {")),a&&(n+="@layer".concat(t[5].length>0?" ".concat(t[5]):""," {")),n+=e(t),a&&(n+="}"),t[2]&&(n+="}"),t[4]&&(n+="}"),n})).join("")},t.i=function(e,n,a,r,o){"string"==typeof e&&(e=[[null,e,void 0]]);var i={};if(a)for(var c=0;c<this.length;c++){var s=this[c][0];null!=s&&(i[s]=!0)}for(var l=0;l<e.length;l++){var d=[].concat(e[l]);a&&i[d[0]]||(void 0!==o&&(void 0===d[5]||(d[1]="@layer".concat(d[5].length>0?" ".concat(d[5]):""," {").concat(d[1],"}")),d[5]=o),n&&(d[2]?(d[1]="@media ".concat(d[2]," {").concat(d[1],"}"),d[2]=n):d[2]=n),r&&(d[4]?(d[1]="@supports (".concat(d[4],") {").concat(d[1],"}"),d[4]=r):d[4]="".concat(r)),t.push(d))}},t}},402:e=>{e.exports=function(e){return e[1]}},934:(e,t,n)=>{n.a(e,(async(a,r)=>{try{n.d(t,{BF:()=>j,G3:()=>P,GW:()=>b,KM:()=>R,L2:()=>v,Or:()=>D,V7:()=>O,WA:()=>M,Wl:()=>k,Y2:()=>U,a2:()=>N,h4:()=>T,iX:()=>W,lX:()=>$,m_:()=>A,pT:()=>B,uB:()=>C,ug:()=>L});var o=n(530);e=n.hmd(e);var i=a([o]);o=(i.then?(await i)():i)[0];const c=new Array(32).fill(void 0);function s(e){return c[e]}c.push(void 0,null,!0,!1);let l=c.length;function d(e){e<36||(c[e]=l,l=e)}function u(e){const t=s(e);return d(e),t}function f(e){l===c.length&&c.push(c.length+1);const t=l;return l=c[t],c[t]=e,t}let p=new("undefined"==typeof TextDecoder?(0,e.require)("util").TextDecoder:TextDecoder)("utf-8",{ignoreBOM:!0,fatal:!0});p.decode();let m=new Uint8Array;function _(){return 0===m.byteLength&&(m=new Uint8Array(o.memory.buffer)),m}function g(e,t){return p.decode(_().subarray(e,e+t))}let h=new Int32Array;function y(){return 0===h.byteLength&&(h=new Int32Array(o.memory.buffer)),h}function b(e,t,n,a,r,i,c){try{const d=o.__wbindgen_add_to_stack_pointer(-16);o.generate_rotation(d,e,t,n,a,r,i,c);var s=y()[d/4+0],l=y()[d/4+1];if(y()[d/4+2])throw u(l);return u(s)}finally{o.__wbindgen_add_to_stack_pointer(16)}}function v(e,t){return o.boon_chance(e,t)>>>0}function w(e,t){try{return e.apply(this,t)}catch(e){o.__wbindgen_exn_store(f(e))}}let I=0,x=new("undefined"==typeof TextEncoder?(0,e.require)("util").TextEncoder:TextEncoder)("utf-8");const E="function"==typeof x.encodeInto?function(e,t){return x.encodeInto(e,t)}:function(e,t){const n=x.encode(e);return t.set(n),{read:e.length,written:n.length}};function S(e,t,n){if(void 0===n){const n=x.encode(e),a=t(n.length);return _().subarray(a,a+n.length).set(n),I=n.length,a}let a=e.length,r=t(a);const o=_();let i=0;for(;i<a;i++){const t=e.charCodeAt(i);if(t>127)break;o[r+i]=t}if(i!==a){0!==i&&(e=e.slice(i)),r=n(r,a,a=i+3*e.length);const t=_().subarray(r+i,r+a);i+=E(e,t).written}return I=i,r}function L(e){u(e)}function B(e){return f(e)}function T(e,t){return f(g(e,t))}function A(e){return f(s(e))}function k(e,t,n){s(e)[u(t)]=u(n)}function j(){return f(new Array)}function C(){return f(new Object)}function M(e,t,n){s(e)[t>>>0]=u(n)}function P(e,t){try{console.log(g(e,t))}finally{o.__wbindgen_free(e,t)}}function O(e,t,n,a,r,i,c,s){try{console.log(g(e,t),g(n,a),g(r,i),g(c,s))}finally{o.__wbindgen_free(e,t)}}function $(e,t){performance.mark(g(e,t))}function U(){return w((function(e,t,n,a){try{performance.measure(g(e,t),g(n,a))}finally{o.__wbindgen_free(e,t),o.__wbindgen_free(n,a)}}),arguments)}function N(){return f(new Error)}function R(e,t){const n=S(s(t).stack,o.__wbindgen_malloc,o.__wbindgen_realloc),a=I;y()[e/4+1]=a,y()[e/4+0]=n}function W(e,t){try{console.error(g(e,t))}finally{o.__wbindgen_free(e,t)}}function D(e,t){throw new Error(g(e,t))}r()}catch(G){r(G)}}))},575:(e,t,n)=>{var a=n(379),r=n.n(a),o=n(795),i=n.n(o),c=n(569),s=n.n(c),l=n(565),d=n.n(l),u=n(216),f=n.n(u),p=n(589),m=n.n(p),_=n(962),g={};g.styleTagTransform=m(),g.setAttributes=d(),g.insert=s().bind(null,"head"),g.domAPI=i(),g.insertStyleElement=f(),r()(_.Z,g),_.Z&&_.Z.locals&&_.Z.locals},379:e=>{var t=[];function n(e){for(var n=-1,a=0;a<t.length;a++)if(t[a].identifier===e){n=a;break}return n}function a(e,a){for(var o={},i=[],c=0;c<e.length;c++){var s=e[c],l=a.base?s[0]+a.base:s[0],d=o[l]||0,u="".concat(l," ").concat(d);o[l]=d+1;var f=n(u),p={css:s[1],media:s[2],sourceMap:s[3],supports:s[4],layer:s[5]};if(-1!==f)t[f].references++,t[f].updater(p);else{var m=r(p,a);a.byIndex=c,t.splice(c,0,{identifier:u,updater:m,references:1})}i.push(u)}return i}function r(e,t){var n=t.domAPI(t);return n.update(e),function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap&&t.supports===e.supports&&t.layer===e.layer)return;n.update(e=t)}else n.remove()}}e.exports=function(e,r){var o=a(e=e||[],r=r||{});return function(e){e=e||[];for(var i=0;i<o.length;i++){var c=n(o[i]);t[c].references--}for(var s=a(e,r),l=0;l<o.length;l++){var d=n(o[l]);0===t[d].references&&(t[d].updater(),t.splice(d,1))}o=s}}},569:e=>{var t={};e.exports=function(e,n){var a=function(e){if(void 0===t[e]){var n=document.querySelector(e);if(window.HTMLIFrameElement&&n instanceof window.HTMLIFrameElement)try{n=n.contentDocument.head}catch(e){n=null}t[e]=n}return t[e]}(e);if(!a)throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");a.appendChild(n)}},216:e=>{e.exports=function(e){var t=document.createElement("style");return e.setAttributes(t,e.attributes),e.insert(t,e.options),t}},565:(e,t,n)=>{e.exports=function(e){var t=n.nc;t&&e.setAttribute("nonce",t)}},795:e=>{e.exports=function(e){var t=e.insertStyleElement(e);return{update:function(n){!function(e,t,n){var a="";n.supports&&(a+="@supports (".concat(n.supports,") {")),n.media&&(a+="@media ".concat(n.media," {"));var r=void 0!==n.layer;r&&(a+="@layer".concat(n.layer.length>0?" ".concat(n.layer):""," {")),a+=n.css,r&&(a+="}"),n.media&&(a+="}"),n.supports&&(a+="}");var o=n.sourceMap;o&&"undefined"!=typeof btoa&&(a+="\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(o))))," */")),t.styleTagTransform(a,e,t.options)}(t,e,n)},remove:function(){!function(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e)}(t)}}}},589:e=>{e.exports=function(e,t){if(t.styleSheet)t.styleSheet.cssText=e;else{for(;t.firstChild;)t.removeChild(t.firstChild);t.appendChild(document.createTextNode(e))}}},729:(e,t,n)=>{n.a(e,(async(e,t)=>{try{var a=n(934),r=(n(575),e([a]));a=(r.then?(await r)():r)[0];const o="https://xivapi.com",i=document.getElementById("parameters"),c=document.getElementById("player_level"),s=document.getElementById("player_gp"),l=document.getElementById("player_gathering"),d=document.getElementById("player_perception"),u=document.getElementById("node_durability"),f=document.getElementById("item_level"),p=document.getElementById("item_gathering"),m=document.getElementById("item_gathering_value"),_=document.getElementById("item_perception"),g=document.getElementById("item_perception_value"),h=document.getElementById("item_success_chance"),y=document.getElementById("item_gather_amount"),b=document.getElementById("label_boon_chance"),v=document.getElementById("item_boon_chance"),w=document.getElementById("item_bountiful_bonus"),I=document.getElementById("submit"),x=document.getElementById("calc_message"),E=document.getElementById("result_rotation"),S=E.querySelector("#result_items_outer"),L=S.querySelector("#result_items");let B=0,T=0;const A=window.Worker?new Worker(new URL(n.p+n.u(579),n.b)):null;function k(e,t){return`icon/${e}/${t}`}async function j(e,t){let n=new Array;for(let a of t){let t=k(e,a);localStorage.getItem(t)||n.push(a)}let a=n.map((e=>e.toString())).join(",");if(n.length>0){let t=await fetch(`${o}/${e}?`+new URLSearchParams({ids:a})),n=await t.json();for(let t of n.Results){let n=k(e,t.ID);localStorage.setItem(n,t.Icon)}}}async function C(e,t,n,r,o,i,c){return a.GW(e,t,n,r,o,i,c)}async function M(e){x.style.display="none",S.style.display="inline",L.innerText=e.items;let t=new Map,n=new Map;function a(e,t,n){e.has(t)?e.get(t).push(n):e.set(t,new Array(n))}function r(e,r,o){"action"==e?a(t,r,o):"item"==e&&a(n,r,o)}function i(e,t){for(let[n,a]of e){let e=k(t,n),r=localStorage.getItem(e);if(r){let e=`${o}${r}`;for(let t of a)t.src=e}}}for(let t of e.actions){const e=document.createElement("div");e.classList.add("row"),e.classList.add("action-row");const n=document.createElement("div");n.classList.add("col-sm-1"),n.classList.add("align-items-center"),n.classList.add("action-quantity"),t.action.hasOwnProperty("amount")&&(n.innerText=`${t.action.amount}`),e.appendChild(n);const a=document.createElement("div");a.classList.add("col-sm-auto"),a.classList.add("action-icons");const o=document.createElement("img");a.appendChild(o);const i=document.createElement("img");a.appendChild(i),e.appendChild(a);const c=document.createElement("div");c.classList.add("col"),c.classList.add("action_name"),c.innerText=t.action.name,e.appendChild(c),E.appendChild(e);let s=t.action.id_min,l=t.action.id_btn;r(s.type,s.id,o),r(l.type,l.id,i)}j("item",n.keys()),j("action",t.keys()),i(n,"item"),i(t,"action"),P(!1)}function P(e){I.disabled=e,c.disabled=e,s.disabled=e,l.disabled=e,d.disabled=e,u.disabled=e,f.disabled=e,h.disabled=e,y.disabled=e,v.disabled=e,w.disabled=e}async function O(){P(!0);let e=parseInt(c.value),t=parseInt(s.value),n=parseInt(u.value),a=parseInt(h.value),r=parseInt(y.value),o=parseInt(v.value),i=parseInt(w.value);if(S.style.display="none",E.querySelectorAll("div.action-row").forEach((e=>{e.parentNode.removeChild(e)})),x.style.display="inline",A){let c={player_level:e,player_gp:t,node_durability:n,item_success_chance:a,item_gather_amount:r,item_boon_chance:o,item_bountiful_bonus:i};A.onmessage=async e=>{let t=e.data;console.debug("Got response from worker"),await M(t)},await A.postMessage(c)}else M(await C(e,t,n,a,r,o,i))}async function $(e){let t=parseInt(f.value),n=`ilvl/${t}`,a=localStorage.getItem(n);if(p.classList.remove("calculated_stat"),_.classList.remove("calculated_stat"),p.classList.add("calculating_stat"),_.classList.add("calculating_stat"),m.innerText="...",g.innerText="...",!Boolean(a)){let e=await fetch(`${o}/ItemLevel/${t}`),r=await e.json();B=r.Gathering,T=r.Perception,a=`${B}/${T}`,localStorage.setItem(n,a)}let r=a.split("/");B=parseInt(r[0]),m.innerText=B.toString(),T=parseInt(r[1]),g.innerText=T.toString(),p.classList.add("calculated_stat"),_.classList.add("calculated_stat"),p.classList.remove("calculating_stat"),_.classList.remove("calculating_stat"),U()}function U(e){let t=parseInt(d.value);if(0==t||0==T)return!1;let n=a.L2(t,T);v.value=n.toString(),b.classList.remove("unvalidated"),b.classList.add("validated")}i.onsubmit=async function(e){return e.preventDefault(),await O(),!1},f.onchange=async function(e){return $(),!1},await $(),p.style.display="inline",_.style.display="inline",d.onchange=U,f.onchange=U,v.onchange=e=>{b.classList.add("unvalidated"),b.classList.remove("validated")},t()}catch(N){t(N)}}),1)},530:(e,t,n)=>{n.a(e,(async(a,r)=>{try{var o,i=a([o=n(934)]),[o]=i.then?(await i)():i;await n.v(t,e.id,"c466c85528f9612f6d59",{"./index_bg.js":{__wbindgen_object_drop_ref:o.ug,__wbindgen_number_new:o.pT,__wbindgen_string_new:o.h4,__wbindgen_object_clone_ref:o.m_,__wbg_set_20cbc34131e76824:o.Wl,__wbg_new_1d9a920c6bfc44a8:o.BF,__wbg_new_0b9bfdd97583284e:o.uB,__wbg_set_a68214f35c417fa9:o.WA,__wbg_log_c9486ca5d8e2cbe8:o.G3,__wbg_log_aba5996d9bde071f:o.V7,__wbg_mark_40e050a77cc39fea:o.lX,__wbg_measure_aa7a73f17813f708:o.Y2,__wbg_new_abda76e883ba8a5f:o.a2,__wbg_stack_658279fe44541cf6:o.KM,__wbg_error_f851667af71bcfc6:o.iX,__wbindgen_throw:o.Or}}),r()}catch(e){r(e)}}),1)}},o={};function i(e){var t=o[e];if(void 0!==t)return t.exports;var n=o[e]={id:e,loaded:!1,exports:{}};return r[e](n,n.exports,i),n.loaded=!0,n.exports}i.m=r,e="function"==typeof Symbol?Symbol("webpack queues"):"__webpack_queues__",t="function"==typeof Symbol?Symbol("webpack exports"):"__webpack_exports__",n="function"==typeof Symbol?Symbol("webpack error"):"__webpack_error__",a=e=>{e&&!e.d&&(e.d=1,e.forEach((e=>e.r--)),e.forEach((e=>e.r--?e.r++:e())))},i.a=(r,o,i)=>{var c;i&&((c=[]).d=1);var s,l,d,u=new Set,f=r.exports,p=new Promise(((e,t)=>{d=t,l=e}));p[t]=f,p[e]=e=>(c&&e(c),u.forEach(e),p.catch((e=>{}))),r.exports=p,o((r=>{var o;s=(r=>r.map((r=>{if(null!==r&&"object"==typeof r){if(r[e])return r;if(r.then){var o=[];o.d=0,r.then((e=>{i[t]=e,a(o)}),(e=>{i[n]=e,a(o)}));var i={};return i[e]=e=>e(o),i}}var c={};return c[e]=e=>{},c[t]=r,c})))(r);var i=()=>s.map((e=>{if(e[n])throw e[n];return e[t]})),l=new Promise((t=>{(o=()=>t(i)).r=0;var n=e=>e!==c&&!u.has(e)&&(u.add(e),e&&!e.d&&(o.r++,e.push(o)));s.map((t=>t[e](n)))}));return o.r?l:i()}),(e=>(e?d(p[n]=e):l(f),a(c)))),c&&(c.d=0)},i.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return i.d(t,{a:t}),t},i.d=(e,t)=>{for(var n in t)i.o(t,n)&&!i.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},i.u=e=>e+".index.js",i.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),i.hmd=e=>((e=Object.create(e)).children||(e.children=[]),Object.defineProperty(e,"exports",{enumerable:!0,set:()=>{throw new Error("ES Modules may not assign module.exports or exports.*, Use ESM export syntax, instead: "+e.id)}}),e),i.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),i.v=(e,t,n,a)=>{var r=fetch(i.p+""+n+".module.wasm");return"function"==typeof WebAssembly.instantiateStreaming?WebAssembly.instantiateStreaming(r,a).then((t=>Object.assign(e,t.instance.exports))):r.then((e=>e.arrayBuffer())).then((e=>WebAssembly.instantiate(e,a))).then((t=>Object.assign(e,t.instance.exports)))},(()=>{var e;i.g.importScripts&&(e=i.g.location+"");var t=i.g.document;if(!e&&t&&(t.currentScript&&(e=t.currentScript.src),!e)){var n=t.getElementsByTagName("script");n.length&&(e=n[n.length-1].src)}if(!e)throw new Error("Automatic publicPath is not supported in this browser");e=e.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),i.p=e})(),i.b=document.baseURI||self.location.href,i.nc=void 0,i(729)})();