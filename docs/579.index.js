(()=>{"use strict";var e,n,t,r,o={579:(e,n,t)=>{t.a(e,(async(e,n)=>{try{var r=t(235),o=e([r]);r=(o.then?(await o)():o)[0],console.log("Worker initialized"),onmessage=e=>{console.debug("Got request from main thread");let n=e.data,t=r.GW(n.player_level,n.player_gp,n.node_durability,n.item_success_chance,n.item_gather_amount,n.item_boon_chance,n.item_bountiful_bonus);postMessage(t)},n()}catch(e){n(e)}}))},235:(e,n,t)=>{t.a(e,(async(e,r)=>{try{t.d(n,{GW:()=>a.GW});var o=t(530),a=t(838),i=e([o]);o=(i.then?(await i)():i)[0],(0,a.oT)(o),o.__wbindgen_start(),r()}catch(e){r(e)}}))},838:(e,n,t)=>{let r;function o(e){r=e}t.d(n,{G3:()=>O,GW:()=>w,KM:()=>M,KQ:()=>T,Kj:()=>S,Or:()=>q,Rl:()=>E,V7:()=>W,Wl:()=>k,Y2:()=>G,a2:()=>K,h4:()=>x,iX:()=>P,lX:()=>A,m_:()=>j,oT:()=>o,pT:()=>v,ug:()=>m}),e=t.hmd(e);const a=new Array(128).fill(void 0);function i(e){return a[e]}a.push(void 0,null,!0,!1);let c=a.length;function _(e){const n=i(e);return function(e){e<132||(a[e]=c,c=e)}(e),n}function u(e){c===a.length&&a.push(a.length+1);const n=c;return c=a[n],a[n]=e,n}let l=new("undefined"==typeof TextDecoder?(0,e.require)("util").TextDecoder:TextDecoder)("utf-8",{ignoreBOM:!0,fatal:!0});l.decode();let f=null;function s(){return null!==f&&0!==f.byteLength||(f=new Uint8Array(r.memory.buffer)),f}function d(e,n){return e>>>=0,l.decode(s().subarray(e,e+n))}let b=null;function g(){return null!==b&&0!==b.byteLength||(b=new Int32Array(r.memory.buffer)),b}function w(e,n,t,o,a,i,c){try{const f=r.__wbindgen_add_to_stack_pointer(-16);r.generate_rotation(f,e,n,t,o,a,i,c);var u=g()[f/4+0],l=g()[f/4+1];if(g()[f/4+2])throw _(l);return _(u)}finally{r.__wbindgen_add_to_stack_pointer(16)}}let p=0,h=new("undefined"==typeof TextEncoder?(0,e.require)("util").TextEncoder:TextEncoder)("utf-8");const y="function"==typeof h.encodeInto?function(e,n){return h.encodeInto(e,n)}:function(e,n){const t=h.encode(e);return n.set(t),{read:e.length,written:t.length}};function m(e){_(e)}function v(e){return u(e)}function x(e,n){return u(d(e,n))}function j(e){return u(i(e))}function k(e,n,t){i(e)[_(n)]=_(t)}function S(){return u(new Array)}function E(){return u(new Object)}function T(e,n,t){i(e)[n>>>0]=_(t)}function O(e,n){let t,o;try{t=e,o=n,console.log(d(e,n))}finally{r.__wbindgen_free(t,o)}}function W(e,n,t,o,a,i,c,_){let u,l;try{u=e,l=n,console.log(d(e,n),d(t,o),d(a,i),d(c,_))}finally{r.__wbindgen_free(u,l)}}function A(e,n){performance.mark(d(e,n))}function G(){return function(e,n){try{return function(e,n,t,o){let a,i,c,_;try{a=e,i=n,c=t,_=o,performance.measure(d(e,n),d(t,o))}finally{r.__wbindgen_free(a,i),r.__wbindgen_free(c,_)}}.apply(this,n)}catch(e){r.__wbindgen_exn_store(u(e))}}(0,arguments)}function K(){return u(new Error)}function M(e,n){const t=function(e,n,t){if(void 0===t){const t=h.encode(e),r=n(t.length)>>>0;return s().subarray(r,r+t.length).set(t),p=t.length,r}let r=e.length,o=n(r)>>>0;const a=s();let i=0;for(;i<r;i++){const n=e.charCodeAt(i);if(n>127)break;a[o+i]=n}if(i!==r){0!==i&&(e=e.slice(i)),o=t(o,r,r=i+3*e.length)>>>0;const n=s().subarray(o+i,o+r);i+=y(e,n).written}return p=i,o}(i(n).stack,r.__wbindgen_malloc,r.__wbindgen_realloc),o=p;g()[e/4+1]=o,g()[e/4+0]=t}function P(e,n){let t,o;try{t=e,o=n,console.error(d(e,n))}finally{r.__wbindgen_free(t,o)}}function q(e,n){throw new Error(d(e,n))}},530:(e,n,t)=>{var r=t(838);e.exports=t.v(n,e.id,"a5d49c64943da6661330",{"./index_bg.js":{__wbindgen_object_drop_ref:r.ug,__wbindgen_number_new:r.pT,__wbindgen_string_new:r.h4,__wbindgen_object_clone_ref:r.m_,__wbg_set_20cbc34131e76824:r.Wl,__wbg_new_0394642eae39db16:r.Kj,__wbg_new_2b6fea4ea03b1b95:r.Rl,__wbg_set_b4da98d504ac6091:r.KQ,__wbg_log_c9486ca5d8e2cbe8:r.G3,__wbg_log_aba5996d9bde071f:r.V7,__wbg_mark_40e050a77cc39fea:r.lX,__wbg_measure_aa7a73f17813f708:r.Y2,__wbg_new_abda76e883ba8a5f:r.a2,__wbg_stack_658279fe44541cf6:r.KM,__wbg_error_f851667af71bcfc6:r.iX,__wbindgen_throw:r.Or}})}},a={};function i(e){var n=a[e];if(void 0!==n)return n.exports;var t=a[e]={id:e,loaded:!1,exports:{}};return o[e](t,t.exports,i),t.loaded=!0,t.exports}e="function"==typeof Symbol?Symbol("webpack queues"):"__webpack_queues__",n="function"==typeof Symbol?Symbol("webpack exports"):"__webpack_exports__",t="function"==typeof Symbol?Symbol("webpack error"):"__webpack_error__",r=e=>{e&&!e.d&&(e.d=1,e.forEach((e=>e.r--)),e.forEach((e=>e.r--?e.r++:e())))},i.a=(o,a,i)=>{var c;i&&((c=[]).d=1);var _,u,l,f=new Set,s=o.exports,d=new Promise(((e,n)=>{l=n,u=e}));d[n]=s,d[e]=e=>(c&&e(c),f.forEach(e),d.catch((e=>{}))),o.exports=d,a((o=>{var a;_=(o=>o.map((o=>{if(null!==o&&"object"==typeof o){if(o[e])return o;if(o.then){var a=[];a.d=0,o.then((e=>{i[n]=e,r(a)}),(e=>{i[t]=e,r(a)}));var i={};return i[e]=e=>e(a),i}}var c={};return c[e]=e=>{},c[n]=o,c})))(o);var i=()=>_.map((e=>{if(e[t])throw e[t];return e[n]})),u=new Promise((n=>{(a=()=>n(i)).r=0;var t=e=>e!==c&&!f.has(e)&&(f.add(e),e&&!e.d&&(a.r++,e.push(a)));_.map((n=>n[e](t)))}));return a.r?u:i()}),(e=>(e?l(d[t]=e):u(s),r(c)))),c&&(c.d=0)},i.d=(e,n)=>{for(var t in n)i.o(n,t)&&!i.o(e,t)&&Object.defineProperty(e,t,{enumerable:!0,get:n[t]})},i.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),i.hmd=e=>((e=Object.create(e)).children||(e.children=[]),Object.defineProperty(e,"exports",{enumerable:!0,set:()=>{throw new Error("ES Modules may not assign module.exports or exports.*, Use ESM export syntax, instead: "+e.id)}}),e),i.o=(e,n)=>Object.prototype.hasOwnProperty.call(e,n),i.v=(e,n,t,r)=>{var o=fetch(i.p+""+t+".module.wasm");return"function"==typeof WebAssembly.instantiateStreaming?WebAssembly.instantiateStreaming(o,r).then((n=>Object.assign(e,n.instance.exports))):o.then((e=>e.arrayBuffer())).then((e=>WebAssembly.instantiate(e,r))).then((n=>Object.assign(e,n.instance.exports)))},(()=>{var e;i.g.importScripts&&(e=i.g.location+"");var n=i.g.document;if(!e&&n&&(n.currentScript&&(e=n.currentScript.src),!e)){var t=n.getElementsByTagName("script");if(t.length)for(var r=t.length-1;r>-1&&!e;)e=t[r--].src}if(!e)throw new Error("Automatic publicPath is not supported in this browser");e=e.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),i.p=e})(),i(579)})();