import{r,_ as w,R as y,b as g,c as S,P as a}from"./index-CLNSMZLW.js";import{C as k}from"./CFormControlWrapper-xxYQpUFA.js";var C=r.forwardRef(function(e,x){var l,N=e.children,T=e.className,d=e.delay,o=d===void 0?!1:d,h=e.feedback,F=e.feedbackInvalid,I=e.feedbackValid,O=e.floatingClassName,V=e.floatingLabel,s=e.id,c=e.invalid,z=e.label,t=e.onChange,E=e.plainText,f=e.size,L=e.text,R=e.tooltipFeedback,p=e.type,b=p===void 0?"text":p,m=e.valid,u=w(e,["children","className","delay","feedback","feedbackInvalid","feedbackValid","floatingClassName","floatingLabel","id","invalid","label","onChange","plainText","size","text","tooltipFeedback","type","valid"]),v=r.useState(),n=v[0],P=v[1];return r.useEffect(function(){var i=setTimeout(function(){return n&&t&&t(n)},typeof o=="number"?o:500);return function(){return clearTimeout(i)}},[n]),y.createElement(k,{describedby:u["aria-describedby"],feedback:h,feedbackInvalid:F,feedbackValid:I,floatingClassName:O,floatingLabel:V,id:s,invalid:c,label:z,text:L,tooltipFeedback:R,valid:m},y.createElement("input",g({className:S(E?"form-control-plaintext":"form-control",(l={},l["form-control-".concat(f)]=f,l["form-control-color"]=b==="color",l["is-invalid"]=c,l["is-valid"]=m,l),T),id:s,type:b,onChange:function(i){return o?P(i):t&&t(i)}},u,{ref:x}),N))});C.propTypes=g({className:a.string,id:a.string,delay:a.oneOfType([a.bool,a.number]),plainText:a.bool,size:a.oneOf(["sm","lg"]),type:a.oneOfType([a.oneOf(["color","file","text"]),a.string])},k.propTypes);C.displayName="CFormInput";export{C};
