(()=>{"use strict";var e,t,n,r,o={934:(e,t,n)=>{n.a(e,(async(r,o)=>{try{n.d(t,{BF:()=>W,GW:()=>j,KM:()=>P,Or:()=>I,WA:()=>B,Wl:()=>T,a2:()=>M,fY:()=>F,h4:()=>k,iX:()=>q,m_:()=>E,pT:()=>O,uB:()=>$,ug:()=>A});var c=n(530);e=n.hmd(e);var i=r([c]);c=(i.then?(await i)():i)[0];const a=new Array(32).fill(void 0);function u(e){return a[e]}a.push(void 0,null,!0,!1);let s=a.length;function f(e){e<36||(a[e]=s,s=e)}function l(e){const t=u(e);return f(e),t}function _(e){s===a.length&&a.push(a.length+1);const t=s;return s=a[t],a[t]=e,t}let b=new("undefined"==typeof TextDecoder?(0,e.require)("util").TextDecoder:TextDecoder)("utf-8",{ignoreBOM:!0,fatal:!0});b.decode();let d=new Uint8Array;function g(){return 0===d.byteLength&&(d=new Uint8Array(c.memory.buffer)),d}function p(e,t){return b.decode(g().subarray(e,e+t))}function w(e){const t=typeof e;if("number"==t||"boolean"==t||null==e)return`${e}`;if("string"==t)return`"${e}"`;if("symbol"==t){const t=e.description;return null==t?"Symbol":`Symbol(${t})`}if("function"==t){const t=e.name;return"string"==typeof t&&t.length>0?`Function(${t})`:"Function"}if(Array.isArray(e)){const t=e.length;let n="[";t>0&&(n+=w(e[0]));for(let r=1;r<t;r++)n+=", "+w(e[r]);return n+="]",n}const n=/\[object ([^\]]+)\]/.exec(toString.call(e));let r;if(!(n.length>1))return toString.call(e);if(r=n[1],"Object"==r)try{return"Object("+JSON.stringify(e)+")"}catch(e){return"Object"}return e instanceof Error?`${e.name}: ${e.message}\n${e.stack}`:r}let h=0,y=new("undefined"==typeof TextEncoder?(0,e.require)("util").TextEncoder:TextEncoder)("utf-8");const m="function"==typeof y.encodeInto?function(e,t){return y.encodeInto(e,t)}:function(e,t){const n=y.encode(e);return t.set(n),{read:e.length,written:n.length}};function v(e,t,n){if(void 0===n){const n=y.encode(e),r=t(n.length);return g().subarray(r,r+n.length).set(n),h=n.length,r}let r=e.length,o=t(r);const c=g();let i=0;for(;i<r;i++){const t=e.charCodeAt(i);if(t>127)break;c[o+i]=t}if(i!==r){0!==i&&(e=e.slice(i)),o=n(o,r,r=i+3*e.length);const t=g().subarray(o+i,o+r);i+=m(e,t).written}return h=i,o}let x=new Int32Array;function S(){return 0===x.byteLength&&(x=new Int32Array(c.memory.buffer)),x}function j(e,t,n,r,o,i,a){return l(c.generate_rotation(e,t,n,r,o,i,a))}function A(e){l(e)}function O(e){return _(e)}function E(e){return _(u(e))}function k(e,t){return _(p(e,t))}function T(e,t,n){u(e)[l(t)]=l(n)}function W(){return _(new Array)}function $(){return _(new Object)}function B(e,t,n){u(e)[t>>>0]=l(n)}function M(){return _(new Error)}function P(e,t){const n=v(u(t).stack,c.__wbindgen_malloc,c.__wbindgen_realloc),r=h;S()[e/4+1]=r,S()[e/4+0]=n}function q(e,t){try{console.error(p(e,t))}finally{c.__wbindgen_free(e,t)}}function F(e,t){const n=v(w(u(t)),c.__wbindgen_malloc,c.__wbindgen_realloc),r=h;S()[e/4+1]=r,S()[e/4+0]=n}function I(e,t){throw new Error(p(e,t))}o()}catch(D){o(D)}}))},579:(e,t,n)=>{n.a(e,(async(e,t)=>{try{var r=n(934),o=e([r]);r=(o.then?(await o)():o)[0],console.log("Worker initialized"),onmessage=e=>{console.debug("Got request from main thread");let t=e.data,n=r.GW(t.player_level,t.player_gp,t.node_durability,t.item_success_chance,t.item_gather_amount,t.item_boon_chance,t.item_bountiful_bonus);postMessage(n)},t()}catch(e){t(e)}}))},530:(e,t,n)=>{n.a(e,(async(r,o)=>{try{var c,i=r([c=n(934)]),[c]=i.then?(await i)():i;await n.v(t,e.id,"fdf5e1a4e471ddcc9068",{"./index_bg.js":{__wbindgen_object_drop_ref:c.ug,__wbindgen_number_new:c.pT,__wbindgen_object_clone_ref:c.m_,__wbindgen_string_new:c.h4,__wbg_set_20cbc34131e76824:c.Wl,__wbg_new_1d9a920c6bfc44a8:c.BF,__wbg_new_0b9bfdd97583284e:c.uB,__wbg_set_a68214f35c417fa9:c.WA,__wbg_new_abda76e883ba8a5f:c.a2,__wbg_stack_658279fe44541cf6:c.KM,__wbg_error_f851667af71bcfc6:c.iX,__wbindgen_debug_string:c.fY,__wbindgen_throw:c.Or}}),o()}catch(e){o(e)}}),1)}},c={};function i(e){var t=c[e];if(void 0!==t)return t.exports;var n=c[e]={id:e,loaded:!1,exports:{}};return o[e](n,n.exports,i),n.loaded=!0,n.exports}e="function"==typeof Symbol?Symbol("webpack queues"):"__webpack_queues__",t="function"==typeof Symbol?Symbol("webpack exports"):"__webpack_exports__",n="function"==typeof Symbol?Symbol("webpack error"):"__webpack_error__",r=e=>{e&&!e.d&&(e.d=1,e.forEach((e=>e.r--)),e.forEach((e=>e.r--?e.r++:e())))},i.a=(o,c,i)=>{var a;i&&((a=[]).d=1);var u,s,f,l=new Set,_=o.exports,b=new Promise(((e,t)=>{f=t,s=e}));b[t]=_,b[e]=e=>(a&&e(a),l.forEach(e),b.catch((e=>{}))),o.exports=b,c((o=>{var c;u=(o=>o.map((o=>{if(null!==o&&"object"==typeof o){if(o[e])return o;if(o.then){var c=[];c.d=0,o.then((e=>{i[t]=e,r(c)}),(e=>{i[n]=e,r(c)}));var i={};return i[e]=e=>e(c),i}}var a={};return a[e]=e=>{},a[t]=o,a})))(o);var i=()=>u.map((e=>{if(e[n])throw e[n];return e[t]})),s=new Promise((t=>{(c=()=>t(i)).r=0;var n=e=>e!==a&&!l.has(e)&&(l.add(e),e&&!e.d&&(c.r++,e.push(c)));u.map((t=>t[e](n)))}));return c.r?s:i()}),(e=>(e?f(b[n]=e):s(_),r(a)))),a&&(a.d=0)},i.d=(e,t)=>{for(var n in t)i.o(t,n)&&!i.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},i.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),i.hmd=e=>((e=Object.create(e)).children||(e.children=[]),Object.defineProperty(e,"exports",{enumerable:!0,set:()=>{throw new Error("ES Modules may not assign module.exports or exports.*, Use ESM export syntax, instead: "+e.id)}}),e),i.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),i.v=(e,t,n,r)=>{var o=fetch(i.p+""+n+".module.wasm");return"function"==typeof WebAssembly.instantiateStreaming?WebAssembly.instantiateStreaming(o,r).then((t=>Object.assign(e,t.instance.exports))):o.then((e=>e.arrayBuffer())).then((e=>WebAssembly.instantiate(e,r))).then((t=>Object.assign(e,t.instance.exports)))},(()=>{var e;i.g.importScripts&&(e=i.g.location+"");var t=i.g.document;if(!e&&t&&(t.currentScript&&(e=t.currentScript.src),!e)){var n=t.getElementsByTagName("script");n.length&&(e=n[n.length-1].src)}if(!e)throw new Error("Automatic publicPath is not supported in this browser");e=e.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),i.p=e})(),i(579)})();