!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):"object"==typeof exports?exports.simpleDOM=e():t.simpleDOM=e()}(this,function(){return function(t){function e(r){if(n[r])return n[r].exports;var o=n[r]={exports:{},id:r,loaded:!1};return t[r].call(o.exports,o,o.exports,e),o.loaded=!0,o.exports}var n={};return e.m=t,e.c=n,e.p="",e(0)}([function(t,e,n){var r={};r.nodes=n(1),r.helpers=n(2),r.parse=n(3),t.exports=r},function(t){function e(){var t=this;t.type="fragment",t.childNodes=[]}function n(t,e){var n=this;n.type="tag",n.childNodes=[],n.name=t,n.attributes=e||{},n.parentNode=null}function r(t){var e=this;e.type="text",e.text=t,e.parentNode=null}function o(t){var e=this;e.type="comment",e.text=t,e.parentNode=null}var a={};a.Fragment=e,a.Tag=n,a.Text=r,a.Comment=o,t.exports=a},function(t,e,n){function r(t,e,n,r){t.parentNode=r,r.childNodes.push(t)}var o=n(1),a={},u=n(4).cycle;a.appendChild=function(t,e){e instanceof o.Fragment?(u(e.childNodes,r,t),e.childNodes.length=0):(e.parentNode&&a.removeChild(e.parentNode,e),e.parentNode=t,t.childNodes.push(e))},a.removeChild=function(t,e){e.parentNode===t&&(t.childNodes.splice(t.childNodes.indexOf(e),1),e.parentNode=null)},t.exports=a},function(t,e,n){function r(t){var e=this,n=new g.Fragment,r=!1;e.treeStack=[n],e.result=n,e.state=N,e.buffer="",e.textBuffer="",e.tagName="",e.attributeName="",e.attributeValueSeparator="",e.attributeValue="",e.attributes=null,e.commentBuffer="",e.commentToken="",t&&t.isXML&&(r=!0),e.isXMLMode=r}function o(t){return X.test(t)}function a(t){return E.test(t)}function u(t){return z.test(t)}function i(t){return-1!==G.indexOf(t)}function c(t,e){t.buffer+=e}function s(t){t.textBuffer=t.buffer,t.state=N}function f(t,e){var n,r=t.attributes;r||(t.attributes=r={}),r[t.attributeName]=e!==n?e:t.attributeValue}function l(t){var e,n;t.textBuffer&&(e=t.treeStack,n=new g.Text(t.textBuffer),y.appendChild(e[e.length-1],n),t.textBuffer=""),t.buffer=""}function p(t,e){var n,r=t.treeStack,o=t.tagName;l(t),n=new g.Tag(o,t.attributes),y.appendChild(r[r.length-1],n),e||!t.isXMLMode&&i(o)||r.push(n),t.state=N}function d(t,e,n,r){y.appendChild(r,t)}function m(t){var e,n,r=t.tagName,o=t.treeStack,a=!1;for(l(t);1!==o.length&&(e=o.pop()).name!==r;)a||(a=!0,n=[]),n.push(e);a&&x(n,d,e),t.state=N}function b(t){var e,n=t.treeStack;l(t),e=new g.Comment(t.commentBuffer),y.appendChild(n[n.length-1],e),t.state=N}function h(t){""!==t.buffer&&(t.textBuffer=t.buffer,l(t))}var g=n(1),y=n(2),x=n(4).reversiveCycle,v=0,N=v++,k=v++,S=v++,w=v++,O=v++,j=v++,C=v++,B=v++,K=v++,A=v++,T=v++,V=v++,M=v++,L=v++,D=v++,F=v++,P=v++;r.prototype.destructor=function(){var t=this;t.treeStack=null,t.result=null,t.state=null,t.buffer=null,t.textBuffer=null,t.tagName=null,t.attributeName=null,t.attributeValueSeparator=null,t.attributeValue=null,t.attributes=null,t.commentBuffer=null,t.commentToken=null};var X=/[A-Za-z]/,E=/\w|-/,z=/\s/,G=["img","input","br","hr","link","meta","source","area","embed","param","base","col","command"],H=o,R=a,Z=[];Z[N]=function(t,e){switch(c(t,e),e){case"<":t.state=k;break;default:t.textBuffer+=e}},Z[k]=function(t,e){if(c(t,e),o(e))t.state=S,t.tagName=e,t.attributes=null;else switch(e){case"/":t.state=A;break;case"!":t.state=M;break;default:s(t)}},Z[S]=function(t,e){if(c(t,e),a(e))t.tagName+=e;else if(u(e))t.state=w;else switch(e){case"/":t.state=O;break;case">":t.state=N,p(t);break;default:s(t)}},Z[w]=function(t,e){if(c(t,e),!u(e))if(H(e))t.state=j,t.attributeName=e;else switch(e){case"/":t.state=O;break;case">":p(t);break;default:s(t)}},Z[j]=function(t,e){switch(c(t,e),e){case"=":t.state=C;break;case">":f(t,""),p(t);break;case"/":f(t,""),t.state=O;break;default:R(e)?t.attributeName+=e:u(e)?(f(t,""),t.state=w):s(t)}},Z[C]=function(t,e){switch(c(t,e),e){case"'":case'"':t.state=B,t.attributeValueSeparator=e,t.attributeValue="";break;default:s(t)}},Z[B]=function(t,e){c(t,e),e===t.attributeValueSeparator?(t.state=K,f(t)):t.attributeValue+=e},Z[K]=function(t,e){switch(c(t,e),e){case"/":t.state=O;break;case">":p(t),s(t);break;default:u(e)?t.state=w:s(t)}},Z[O]=function(t,e){">"===e?p(t,!0):(c(t,e),s(t))},Z[A]=function(t,e){c(t,e),o(e)?(t.tagName=e,t.state=T):s(t)},Z[T]=function(t,e){c(t,e),o(e)?t.tagName+=e:">"===e?m(t):u(e)?t.state=V:s(t)},Z[V]=function(t,e){c(t,e),">"===e?m(t):u(e)||s(t)},Z[M]=function(t,e){c(t,e),"-"===e?t.state=L:s(t)},Z[L]=function(t,e){c(t,e),"-"===e?(t.state=D,t.commentBuffer=""):s(t)},Z[D]=function(t,e){c(t,e),"-"===e?(t.state=F,t.commentToken=e):t.commentBuffer+=e},Z[F]=function(t,e){c(t,e),"-"===e?(t.state=P,t.commentToken+=e):(t.state=D,t.commentBuffer+=t.commentToken+e)},Z[P]=function(t,e){">"===e?b(t):(c(t,e),t.state=D,t.commentBuffer+=t.commentToken+e)},t.exports=function(t){for(var e,n=new r,o=0,a=t.length;a>o;o+=1)Z[n.state](n,t.charAt(o));return h(n),e=n.result,n.destructor(),e}},function(t,e,n){var r={};r.getGlobal=n(5),r.typesDetection=n(6),r.getObjectKeys=n(7),r.getObjectLength=n(8),r.cycleKeys=n(9),r.cycle=n(10),r.reversiveCycle=n(11),r.getObjectSafely=n(12),r.onload=n(13),t.exports=r},function(t,e){(function(e){var n=window||e;t.exports=function(){return n}}).call(e,function(){return this}())},function(t){function e(t){return function(e){return r.call(e)==="[object "+t+"]"}}var n={},r=Object.prototype.toString;n.isArray=Array.isArray||function(t){return"[object Array]"===r.call(t)},n.isNodesCollection=function(t){return document&&(t instanceof HTMLCollection||t instanceof NodeList)};for(var o=["Object","Arguments","Function","String","Number","Date","RegExp","Error","Boolean"],a=o.length;a--;)n["is"+o[a]]=e(o[a]);n.isCollection=function(t){return n.isArray(t)||n.isNodesCollection(t)||n.isArguments(t)},t.exports=n},function(t){var e;e=Object.keys?function(t){return Object.keys(t)}:function(t){var e,n=[];for(e in t)t.hasOwnProperty(e)&&n.push(e);return n},t.exports=e},function(t,e,n){var r=n(7);t.exports=function(t){return r(t).length}},function(t){function e(){}function n(){this.result=null}n.prototype=new e,t.exports={StopKey:e,stopKey:new e,StopObject:n,stopObject:new n}},function(t,e,n){var r=n(5),o=n(9),a=n(6),u=n(7);t.exports=function(t,e,n,i,c,s){var f,l,p,d,m,b;if(t)if(i=i||r(),c=c||1,f=s||0,a.isString(t))for(l=t.length;l>f&&(d=e.call(i,t.charAt(f),f,t,n),!(d instanceof o.StopKey));f+=c);else if(a.isCollection(t))for(l=t.length;l>f&&(d=e.call(i,t[f],f,t,n),!(d instanceof o.StopKey));f+=c);else if(a.isObject(t))if(0===f&&1===c){for(p in t)if(t.hasOwnProperty(p)&&(d=e.call(i,t[p],p,t,n),d instanceof o.StopKey))break}else for(m=u(t),l=m.length;l>f&&(p=m[f],d=e.call(i,t[p],p,t,n),!(d instanceof o.StopKey));f+=c);return d===o.stopObject?(b=d.result,d.result=null,b):t}},function(t,e,n){var r=n(5),o=n(9),a=n(6),u=n(7);t.exports=function(t,e,n,i,c,s){var f,l,p,d,m;if(t)if(i=i||r(),c=c||1,a.isString(t))for(f=s||t.length-1;f>=0&&(p=e.call(i,t.charAt(f),f,t,n),!(p instanceof o.StopKey));f-=c);else if(a.isCollection(t))for(f=s||t.length-1;f>=0&&(p=e.call(i,t[f],f,t,n),!(p instanceof o.StopKey));f-=c);else if(a.isObject(t))for(d=u(t),f=s||d.length-1;f>=0&&(l=d[f],p=e.call(i,t[l],l,t,n),!(p instanceof o.StopKey));f-=c);return p===o.stopObject?(m=p.result,p.result=null,m):t}},function(t,e,n){var r=n(6),o=n(9),a=n(10);t.exports=function(t){return a(arguments,function(e){if(t.hasOwnProperty(e)){if(!r.isObject(t[e]))return t=null,o.stopKey}else t[e]={};t=t[e]},null,null,1,1),t}},function(t){t.exports=function(t){t()}}])});