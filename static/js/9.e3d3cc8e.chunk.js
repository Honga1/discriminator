(this.webpackJsonpdisc=this.webpackJsonpdisc||[]).push([[9],{179:function(e,t,n){"use strict";n.d(t,"a",(function(){return c}));var r=n(1),u=n(4);function c(e,t){Object(r.useEffect)((function(){u.a.setState({isCameraEnabled:t})}),[t]);var n=Object(r.useCallback)((function(){var t;return null===(t=e.current)||void 0===t?void 0:t.play()}),[e]),c=Object(r.useCallback)((function(){var t;return null===(t=e.current)||void 0===t?void 0:t.pause()}),[e]),i=Object(r.useCallback)((function(){e.current&&(e.current.currentTime=0)}),[e]),a=Object(r.useCallback)((function(){return!!e.current&&!!(e.current.currentTime>0&&!e.current.paused&&!e.current.ended&&e.current.readyState>2)}),[e]),l=Object(r.useCallback)((function(){return e.current?e.current.currentTime/e.current.duration:0}),[e]),s=Object(r.useCallback)((function(t){e.current&&(e.current.currentTime=t*e.current.duration)}),[e]),o=Object(r.useCallback)((function(t){if(e.current){var n=e.current.currentTime+t,r=Math.min(Math.max(0,n),e.current.duration);e.current.currentTime=r}}),[e]),d=Object(r.useCallback)((function(t){e.current&&(e.current.muted=t)}),[e]),v=Object(r.useCallback)((function(){return!!e.current&&e.current.muted}),[e]),b=Object(r.useCallback)((function(){return a()?c():n()}),[a,c,n]);Object(r.useEffect)((function(){var t,r,f,p,m,j=function(){return u.a.setState({chapter:{play:n,pause:c,rewind:i,getIsPlaying:a,getProgress:l,setProgress:s,seekTimeDelta:o,setMuted:d,isMuted:v(),progress:l(),intention:a()?"PLAY":"PAUSE"}})},h=e.current;return null===(t=e.current)||void 0===t||t.addEventListener("click",b),null===(r=e.current)||void 0===r||r.addEventListener("playing",j),null===(f=e.current)||void 0===f||f.addEventListener("pause",j),null===(p=e.current)||void 0===p||p.addEventListener("volumechange",j),null===(m=e.current)||void 0===m||m.addEventListener("timeupdate",j),j(),function(){null===h||void 0===h||h.removeEventListener("click",b),null===h||void 0===h||h.removeEventListener("play",j),null===h||void 0===h||h.removeEventListener("pause",j),null===h||void 0===h||h.removeEventListener("timeupdate",j),u.a.setState({chapter:void 0})}}),[a,c,n,l,i,s,o,d,v,e,b])}},410:function(e,t,n){"use strict";n.r(t),n.d(t,"default",(function(){return a}));var r=n(1),u=n.p+"static/media/chapter4.182f5d13.mp4",c=n(179),i=n(0);function a(){var e=Object(r.useRef)(null);return Object(c.a)(e,!1),Object(i.jsx)("video",{ref:e,style:{boxSizing:"border-box",outline:"none",width:"100%",height:"100%"},width:"100%",height:"100%",src:u})}}}]);
//# sourceMappingURL=9.e3d3cc8e.chunk.js.map