import{r as n,_ as v,R as l,b as m,c as p,P as o}from"./index-CLNSMZLW.js";import{u as le,T as te,n as re,o as ae}from"./DefaultLayout-HRgSVHY3.js";import{C as I}from"./CConditionalPortal-CNl-bRuG.js";var k=n.forwardRef(function(e,i){var t=e.children,s=e.className,a=v(e,["children","className"]);return l.createElement("div",m({className:p("modal-content",s)},a,{ref:i}),t)});k.propTypes={children:o.node,className:o.string};k.displayName="CModalContent";var x=n.forwardRef(function(e,i){var t,s=e.children,a=e.alignment,c=e.className,d=e.fullscreen,f=e.scrollable,b=e.size,y=v(e,["children","alignment","className","fullscreen","scrollable","size"]);return l.createElement("div",m({className:p("modal-dialog",(t={"modal-dialog-centered":a==="center"},t[typeof d=="boolean"?"modal-fullscreen":"modal-fullscreen-".concat(d,"-down")]=d,t["modal-dialog-scrollable"]=f,t["modal-".concat(b)]=b,t),c)},y,{ref:i}),s)});x.propTypes={alignment:o.oneOf(["top","center"]),children:o.node,className:o.string,fullscreen:o.oneOfType([o.bool,o.oneOf(["sm","md","lg","xl","xxl"])]),scrollable:o.bool,size:o.oneOf(["sm","lg","xl"])};x.displayName="CModalDialog";var K=n.createContext({}),q=n.forwardRef(function(e,i){var t=e.children,s=e.alignment,a=e.backdrop,c=a===void 0?!0:a,d=e.className,f=e.container,b=e.duration,y=b===void 0?150:b,w=e.focus,Q=w===void 0?!0:w,U=e.fullscreen,R=e.keyboard,W=R===void 0?!0:R,h=e.onClose,O=e.onClosePrevented,X=e.onShow,T=e.portal,M=T===void 0?!0:T,Y=e.scrollable,Z=e.size,P=e.transition,N=P===void 0?!0:P,B=e.unmountOnClose,$=B===void 0?!0:B,g=e.visible,_=v(e,["children","alignment","backdrop","className","container","duration","focus","fullscreen","keyboard","onClose","onClosePrevented","onShow","portal","scrollable","size","transition","unmountOnClose","visible"]),z=n.useRef(null),C=n.useRef(null),ee=n.useRef(null),oe=le(i,C),L=n.useState(g),u=L[0],E=L[1],S=n.useState(!1),V=S[0],D=S[1],ne={visible:u,setVisible:E};n.useEffect(function(){E(g)},[g]),n.useEffect(function(){var r;return u?(z.current=document.activeElement,document.addEventListener("mouseup",H),document.addEventListener("keydown",j)):(r=z.current)===null||r===void 0||r.focus(),function(){document.removeEventListener("mouseup",H),document.removeEventListener("keydown",j)}},[u]);var F=function(){return c==="static"?D(!0):(E(!1),h&&h())};n.useLayoutEffect(function(){O&&O(),setTimeout(function(){return D(!1)},y)},[V]),n.useLayoutEffect(function(){return u?(document.body.classList.add("modal-open"),c&&(document.body.style.overflow="hidden",document.body.style.paddingRight="0px"),setTimeout(function(){var r;Q&&((r=C.current)===null||r===void 0||r.focus())},N?y:0)):(document.body.classList.remove("modal-open"),c&&(document.body.style.removeProperty("overflow"),document.body.style.removeProperty("padding-right"))),function(){document.body.classList.remove("modal-open"),c&&(document.body.style.removeProperty("overflow"),document.body.style.removeProperty("padding-right"))}},[u]);var H=function(r){C.current&&C.current==r.target&&F()},j=function(r){r.key==="Escape"&&W&&F()};return l.createElement(l.Fragment,null,l.createElement(te,{in:u,mountOnEnter:!0,nodeRef:C,onEnter:X,onExit:h,unmountOnExit:$,timeout:N?y:0},function(r){return l.createElement(I,{container:f,portal:M},l.createElement(K.Provider,{value:ne},l.createElement("div",m({className:p("modal",{"modal-static":V,fade:N,show:r==="entered"},d),tabIndex:-1},u?{"aria-modal":!0,role:"dialog"}:{"aria-hidden":"true"},{style:m({},r!=="exited"&&{display:"block"})},_,{ref:oe}),l.createElement(x,{alignment:s,fullscreen:U,scrollable:Y,size:Z},l.createElement(k,{ref:ee},t)))))}),c&&l.createElement(I,{container:f,portal:M},l.createElement(re,{visible:u})))});q.propTypes={alignment:o.oneOf(["top","center"]),backdrop:o.oneOfType([o.bool,o.oneOf(["static"])]),children:o.node,className:o.string,container:o.any,duration:o.number,focus:o.bool,fullscreen:o.oneOfType([o.bool,o.oneOf(["sm","md","lg","xl","xxl"])]),keyboard:o.bool,onClose:o.func,onClosePrevented:o.func,onShow:o.func,portal:o.bool,scrollable:o.bool,size:o.oneOf(["sm","lg","xl"]),transition:o.bool,unmountOnClose:o.bool,visible:o.bool};q.displayName="CModal";var A=n.forwardRef(function(e,i){var t=e.children,s=e.className,a=v(e,["children","className"]);return l.createElement("div",m({className:p("modal-body",s)},a,{ref:i}),t)});A.propTypes={children:o.node,className:o.string};A.displayName="CModalBody";var G=n.forwardRef(function(e,i){var t=e.children,s=e.className,a=e.closeButton,c=a===void 0?!0:a,d=v(e,["children","className","closeButton"]),f=n.useContext(K).setVisible;return l.createElement("div",m({className:p("modal-header",s)},d,{ref:i}),t,c&&l.createElement(ae,{onClick:function(){return f(!1)}}))});G.propTypes={children:o.node,className:o.string,closeButton:o.bool};G.displayName="CModalHeader";var J=n.forwardRef(function(e,i){var t=e.children,s=e.as,a=s===void 0?"h5":s,c=e.className,d=v(e,["children","as","className"]);return l.createElement(a,m({className:p("modal-title",c)},d,{ref:i}),t)});J.propTypes={as:o.elementType,children:o.node,className:o.string};J.displayName="CModalTitle";export{q as C,G as a,J as b,A as c};
