(this.webpackJsonpdisc=this.webpackJsonpdisc||[]).push([[5],{124:function(e,t,r){"use strict";r.d(t,"a",(function(){return c}));var n=r(1),u=r(5);function c(e){var t=Object(n.useCallback)((function(){var t;return null===(t=e.current)||void 0===t?void 0:t.play()}),[e]),r=Object(n.useCallback)((function(){var t;return null===(t=e.current)||void 0===t?void 0:t.pause()}),[e]),c=Object(n.useCallback)((function(){e.current&&(e.current.currentTime=0)}),[e]),i=Object(n.useCallback)((function(){return!!e.current&&!!(e.current.currentTime>0&&!e.current.paused&&!e.current.ended&&e.current.readyState>2)}),[e]),a=Object(n.useCallback)((function(){return e.current?e.current.currentTime/e.current.duration:0}),[e]),l=Object(n.useCallback)((function(t){e.current&&(e.current.currentTime=t*e.current.duration)}),[e]),o=Object(n.useCallback)((function(t){if(e.current){var r=e.current.currentTime+t,n=Math.min(Math.max(0,r),e.current.duration);e.current.currentTime=n}}),[e]),s=Object(n.useCallback)((function(){return i()?r():t()}),[i,r,t]);Object(n.useEffect)((function(){var n,d,v,b,f=function(){return u.a.setState({chapter:{play:t,pause:r,rewind:c,getIsPlaying:i,getProgress:a,setProgress:l,seekTimeDelta:o,progress:a(),intention:i()?"PLAY":"PAUSE"}})},p=e.current;return null===(n=e.current)||void 0===n||n.addEventListener("click",s),null===(d=e.current)||void 0===d||d.addEventListener("playing",f),null===(v=e.current)||void 0===v||v.addEventListener("pause",f),null===(b=e.current)||void 0===b||b.addEventListener("timeupdate",f),f(),function(){null===p||void 0===p||p.removeEventListener("click",s),null===p||void 0===p||p.removeEventListener("play",f),null===p||void 0===p||p.removeEventListener("pause",f),null===p||void 0===p||p.removeEventListener("timeupdate",f),u.a.setState({chapter:void 0})}}),[i,r,t,a,c,l,o,e,s])}},127:function(e,t,r){"use strict";r.r(t),r.d(t,"default",(function(){return a}));var n=r(1),u=r.p+"static/media/p2.2bd44c1d.mp4",c=r(124),i=r(0);function a(){var e=Object(n.useRef)(null);return Object(c.a)(e),Object(i.jsx)("video",{ref:e,style:{boxSizing:"border-box",outline:"none",width:"100%",height:"100%"},width:"100%",height:"100%",src:u})}}}]);
//# sourceMappingURL=5.d9beddc9.chunk.js.map