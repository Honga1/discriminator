(this.webpackJsonpdisc=this.webpackJsonpdisc||[]).push([[0],{125:function(e,t,n){"use strict";n.r(t),n.d(t,"default",(function(){return o}));var i=n(1),r=n(0);function o(){var e=Object(i.useRef)(null),t=Object(i.useRef)();return Object(i.useEffect)((function(){var n=e.current;if(n){var i=n.getContext("2d");i&&(t.current=i)}}),[]),Object(i.useEffect)((function(){var n=e.current;if(n){var i=function(e,n){var i=t.current;i&&requestAnimationFrame((function(){for(var t=e-10;t<e+10;t++)for(var r=n-10;r<n+10;r++)i.fillStyle="hsl(".concat(t*Math.sin(Date.now()/1e4)%255,", 100%, 50%)"),i.beginPath(),i.ellipse(t,r,10,10,0,0,2*Math.PI),i.fill()}))},r=function(t){var n,r;if(e.current){var o=function(e,t){var n=e.clientX,i=e.clientY,r=t.getBoundingClientRect(),o=function(e,t,n){return Math.min(n,Math.max(e,t))},u=o(n-r.left,0,r.width-1),c=o(i-r.top,0,r.height-1),v=u/r.width,d=c/r.height;return{relativeX:v,relativeY:d}}(t,e.current),u=o.relativeX,c=o.relativeY,v=u*(null===(n=e.current)||void 0===n?void 0:n.width),d=c*(null===(r=e.current)||void 0===r?void 0:r.height);void 0!==v&&void 0!==d&&i(v,d)}};window.addEventListener("mousemove",r);var o=function(t){if(e.current){var n=function(e,t){var n,i,r,o,u=null!==(n=null===(i=e.changedTouches[0])||void 0===i?void 0:i.clientX)&&void 0!==n?n:0,c=null!==(r=null===(o=e.changedTouches[0])||void 0===o?void 0:o.clientY)&&void 0!==r?r:0,v=t.getBoundingClientRect(),d=function(e,t,n){return Math.min(n,Math.max(e,t))},h=d(u-v.left,0,v.width-1),a=d(c-v.top,0,v.height-1),l=h/v.width,f=a/v.height;return{relativeX:l,relativeY:f}}(t,e.current),r=n.relativeX,o=n.relativeY,u=r*e.current.width,c=o*e.current.height;void 0!==u&&void 0!==c&&i(u,c)}};window.addEventListener("touchmove",o);var u=function(){n.width=window.innerWidth,n.height=window.innerHeight};return window.addEventListener("resize",u),function(){window.removeEventListener("touchmove",o),window.removeEventListener("mousemove",r),window.removeEventListener("resize",u)}}}),[]),Object(r.jsx)("canvas",{style:{width:"100%",height:"100%"},width:window.innerWidth,height:window.innerHeight,ref:e})}}}]);
//# sourceMappingURL=0.259c88d9.chunk.js.map