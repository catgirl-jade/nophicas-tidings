(()=>{var e={235:()=>{}},t={};function r(o){var a=t[o];if(void 0!==a)return a.exports;var n=t[o]={exports:{}};return e[o](n,n.exports,r),n.exports}r.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return r.d(t,{a:t}),t},r.d=(e,t)=>{for(var o in t)r.o(t,o)&&!r.o(e,o)&&Object.defineProperty(e,o,{enumerable:!0,get:t[o]})},r.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{"use strict";var e=r(235);console.log("Worker initialized"),onmessage=t=>{console.debug("Got request from main thread");let r=t.data,o=e.generate_rotation(r.player_level,r.player_gp,r.node_durability,r.item_success_chance,r.item_gather_amount,r.item_boon_chance,r.item_bountiful_bonus);postMessage(o)}})()})();