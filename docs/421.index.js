(()=>{"use strict";var e,n,t,r,o={421:(e,n,t)=>{t.a(e,(async(e,n)=>{try{var r=t(300),o=e([r]);r=(o.then?(await o)():o)[0],console.log("Worker initialized"),onmessage=e=>{console.debug("Got request from main thread");let n=e.data,t=r.Hp(n.player_level,n.player_gp,n.node_durability,n.item_success_chance,n.item_gather_amount,n.item_boon_chance,n.item_bountiful_bonus);postMessage(t)},n()}catch(e){n(e)}}))},300:(e,n,t)=>{t.a(e,(async(e,r)=>{try{t.d(n,{Hp:()=>a.Hp});var o=t(650),a=t(27),i=e([o]);o=(i.then?(await i)():i)[0],(0,a.lI)(o),o.__wbindgen_start(),r()}catch(e){r(e)}}))},27:(e,n,t)=>{let r;function o(e){r=e}t.d(n,{BZ:()=>v,DK:()=>S,Hp:()=>p,M2:()=>E,Pb:()=>O,QR:()=>x,QU:()=>A,Qn:()=>q,V5:()=>I,Xu:()=>W,bk:()=>m,c3:()=>T,c9:()=>P,dJ:()=>M,lI:()=>o,ot:()=>j,u$:()=>Q,yc:()=>k}),e=t.hmd(e);const a=new Array(128).fill(void 0);function i(e){return a[e]}a.push(void 0,null,!0,!1);let c=a.length;function _(e){const n=i(e);return function(e){e<132||(a[e]=c,c=e)}(e),n}function s(e){c===a.length&&a.push(a.length+1);const n=c;return c=a[n],a[n]=e,n}let u=new("undefined"==typeof TextDecoder?(0,e.require)("util").TextDecoder:TextDecoder)("utf-8",{ignoreBOM:!0,fatal:!0});u.decode();let f=null;function l(){return null!==f&&0!==f.byteLength||(f=new Uint8Array(r.memory.buffer)),f}function b(e,n){return e>>>=0,u.decode(l().subarray(e,e+n))}let d=null;function w(){return null!==d&&0!==d.byteLength||(d=new Int32Array(r.memory.buffer)),d}function p(e,n,t,o,a,i,c){try{const f=r.__wbindgen_add_to_stack_pointer(-16);r.generate_rotation(f,e,n,t,o,a,i,c);var s=w()[f/4+0],u=w()[f/4+1];if(w()[f/4+2])throw _(u);return _(s)}finally{r.__wbindgen_add_to_stack_pointer(16)}}let g=0,h=new("undefined"==typeof TextEncoder?(0,e.require)("util").TextEncoder:TextEncoder)("utf-8");const y="function"==typeof h.encodeInto?function(e,n){return h.encodeInto(e,n)}:function(e,n){const t=h.encode(e);return n.set(t),{read:e.length,written:t.length}};function m(e){_(e)}function v(e){return s(i(e))}function x(e){return s(e)}function k(e,n){return s(b(e,n))}function S(e,n,t){i(e)[_(n)]=_(t)}function E(){return s(new Array)}function j(){return s(new Object)}function A(e,n,t){i(e)[n>>>0]=_(t)}function O(e,n){let t,o;try{t=e,o=n,console.log(b(e,n))}finally{r.__wbindgen_free(t,o,1)}}function T(e,n,t,o,a,i,c,_){let s,u;try{s=e,u=n,console.log(b(e,n),b(t,o),b(a,i),b(c,_))}finally{r.__wbindgen_free(s,u,1)}}function M(e,n){performance.mark(b(e,n))}function P(){return function(e,n){try{return function(e,n,t,o){let a,i,c,_;try{a=e,i=n,c=t,_=o,performance.measure(b(e,n),b(t,o))}finally{r.__wbindgen_free(a,i,1),r.__wbindgen_free(c,_,1)}}.apply(this,n)}catch(e){r.__wbindgen_exn_store(s(e))}}(0,arguments)}function I(){return s(new Error)}function Q(e,n){const t=function(e,n,t){if(void 0===t){const t=h.encode(e),r=n(t.length,1)>>>0;return l().subarray(r,r+t.length).set(t),g=t.length,r}let r=e.length,o=n(r,1)>>>0;const a=l();let i=0;for(;i<r;i++){const n=e.charCodeAt(i);if(n>127)break;a[o+i]=n}if(i!==r){0!==i&&(e=e.slice(i)),o=t(o,r,r=i+3*e.length,1)>>>0;const n=l().subarray(o+i,o+r);i+=y(e,n).written,o=t(o,r,i,1)>>>0}return g=i,o}(i(n).stack,r.__wbindgen_malloc,r.__wbindgen_realloc),o=g;w()[e/4+1]=o,w()[e/4+0]=t}function W(e,n){let t,o;try{t=e,o=n,console.error(b(e,n))}finally{r.__wbindgen_free(t,o,1)}}function q(e,n){throw new Error(b(e,n))}},650:(e,n,t)=>{var r=t(27);e.exports=t.v(n,e.id,"ab6389395cec6fa23756",{"./index_bg.js":{__wbindgen_object_drop_ref:r.bk,__wbindgen_object_clone_ref:r.BZ,__wbindgen_number_new:r.QR,__wbindgen_string_new:r.yc,__wbg_set_f975102236d3c502:r.DK,__wbg_new_16b304a2cfa7ff4a:r.M2,__wbg_new_72fb9a18b5ae2624:r.ot,__wbg_set_d4638f722068f043:r.QU,__wbg_log_c9486ca5d8e2cbe8:r.Pb,__wbg_log_aba5996d9bde071f:r.c3,__wbg_mark_40e050a77cc39fea:r.dJ,__wbg_measure_aa7a73f17813f708:r.c9,__wbg_new_abda76e883ba8a5f:r.V5,__wbg_stack_658279fe44541cf6:r.u$,__wbg_error_f851667af71bcfc6:r.Xu,__wbindgen_throw:r.Qn}})}},a={};function i(e){var n=a[e];if(void 0!==n)return n.exports;var t=a[e]={id:e,loaded:!1,exports:{}};return o[e](t,t.exports,i),t.loaded=!0,t.exports}e="function"==typeof Symbol?Symbol("webpack queues"):"__webpack_queues__",n="function"==typeof Symbol?Symbol("webpack exports"):"__webpack_exports__",t="function"==typeof Symbol?Symbol("webpack error"):"__webpack_error__",r=e=>{e&&e.d<1&&(e.d=1,e.forEach((e=>e.r--)),e.forEach((e=>e.r--?e.r++:e())))},i.a=(o,a,i)=>{var c;i&&((c=[]).d=-1);var _,s,u,f=new Set,l=o.exports,b=new Promise(((e,n)=>{u=n,s=e}));b[n]=l,b[e]=e=>(c&&e(c),f.forEach(e),b.catch((e=>{}))),o.exports=b,a((o=>{var a;_=(o=>o.map((o=>{if(null!==o&&"object"==typeof o){if(o[e])return o;if(o.then){var a=[];a.d=0,o.then((e=>{i[n]=e,r(a)}),(e=>{i[t]=e,r(a)}));var i={};return i[e]=e=>e(a),i}}var c={};return c[e]=e=>{},c[n]=o,c})))(o);var i=()=>_.map((e=>{if(e[t])throw e[t];return e[n]})),s=new Promise((n=>{(a=()=>n(i)).r=0;var t=e=>e!==c&&!f.has(e)&&(f.add(e),e&&!e.d&&(a.r++,e.push(a)));_.map((n=>n[e](t)))}));return a.r?s:i()}),(e=>(e?u(b[t]=e):s(l),r(c)))),c&&c.d<0&&(c.d=0)},i.d=(e,n)=>{for(var t in n)i.o(n,t)&&!i.o(e,t)&&Object.defineProperty(e,t,{enumerable:!0,get:n[t]})},i.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),i.hmd=e=>((e=Object.create(e)).children||(e.children=[]),Object.defineProperty(e,"exports",{enumerable:!0,set:()=>{throw new Error("ES Modules may not assign module.exports or exports.*, Use ESM export syntax, instead: "+e.id)}}),e),i.o=(e,n)=>Object.prototype.hasOwnProperty.call(e,n),i.v=(e,n,t,r)=>{var o=fetch(i.p+""+t+".module.wasm"),a=()=>o.then((e=>e.arrayBuffer())).then((e=>WebAssembly.instantiate(e,r))).then((n=>Object.assign(e,n.instance.exports)));return o.then((n=>"function"==typeof WebAssembly.instantiateStreaming?WebAssembly.instantiateStreaming(n,r).then((n=>Object.assign(e,n.instance.exports)),(e=>{if("application/wasm"!==n.headers.get("Content-Type"))return console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n",e),a();throw e})):a()))},(()=>{var e;i.g.importScripts&&(e=i.g.location+"");var n=i.g.document;if(!e&&n&&(n.currentScript&&(e=n.currentScript.src),!e)){var t=n.getElementsByTagName("script");if(t.length)for(var r=t.length-1;r>-1&&(!e||!/^http(s?):/.test(e));)e=t[r--].src}if(!e)throw new Error("Automatic publicPath is not supported in this browser");e=e.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),i.p=e})(),i(421)})();