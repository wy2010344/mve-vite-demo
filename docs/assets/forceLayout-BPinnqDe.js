import{d as P,ad as ot,ac as B,ae as it,af as lt,c as K}from"./index-C09L67qZ.js";function ft(t){const i=+this._x.call(null,t),n=+this._y.call(null,t);return nt(this.cover(i,n),i,n,t)}function nt(t,i,n,e){if(isNaN(i)||isNaN(n))return t;var s,r=t._root,a={data:e},h=t._x0,l=t._y0,o=t._x1,f=t._y1,u,c,_,x,w,v,p,y;if(!r)return t._root=a,t;for(;r.length;)if((w=i>=(u=(h+o)/2))?h=u:o=u,(v=n>=(c=(l+f)/2))?l=c:f=c,s=r,!(r=r[p=v<<1|w]))return s[p]=a,t;if(_=+t._x.call(null,r.data),x=+t._y.call(null,r.data),i===_&&n===x)return a.next=r,s?s[p]=a:t._root=a,t;do s=s?s[p]=new Array(4):t._root=new Array(4),(w=i>=(u=(h+o)/2))?h=u:o=u,(v=n>=(c=(l+f)/2))?l=c:f=c;while((p=v<<1|w)===(y=(x>=c)<<1|_>=u));return s[y]=r,s[p]=a,t}function ut(t){var i,n,e=t.length,s,r,a=new Array(e),h=new Array(e),l=1/0,o=1/0,f=-1/0,u=-1/0;for(n=0;n<e;++n)isNaN(s=+this._x.call(null,i=t[n]))||isNaN(r=+this._y.call(null,i))||(a[n]=s,h[n]=r,s<l&&(l=s),s>f&&(f=s),r<o&&(o=r),r>u&&(u=r));if(l>f||o>u)return this;for(this.cover(l,o).cover(f,u),n=0;n<e;++n)nt(this,a[n],h[n],t[n]);return this}function ct(t,i){if(isNaN(t=+t)||isNaN(i=+i))return this;var n=this._x0,e=this._y0,s=this._x1,r=this._y1;if(isNaN(n))s=(n=Math.floor(t))+1,r=(e=Math.floor(i))+1;else{for(var a=s-n||1,h=this._root,l,o;n>t||t>=s||e>i||i>=r;)switch(o=(i<e)<<1|t<n,l=new Array(4),l[o]=h,h=l,a*=2,o){case 0:s=n+a,r=e+a;break;case 1:n=s-a,r=e+a;break;case 2:s=n+a,e=r-a;break;case 3:n=s-a,e=r-a;break}this._root&&this._root.length&&(this._root=h)}return this._x0=n,this._y0=e,this._x1=s,this._y1=r,this}function _t(){var t=[];return this.visit(function(i){if(!i.length)do t.push(i.data);while(i=i.next)}),t}function xt(t){return arguments.length?this.cover(+t[0][0],+t[0][1]).cover(+t[1][0],+t[1][1]):isNaN(this._x0)?void 0:[[this._x0,this._y0],[this._x1,this._y1]]}function S(t,i,n,e,s){this.node=t,this.x0=i,this.y0=n,this.x1=e,this.y1=s}function vt(t,i,n){var e,s=this._x0,r=this._y0,a,h,l,o,f=this._x1,u=this._y1,c=[],_=this._root,x,w;for(_&&c.push(new S(_,s,r,f,u)),n==null?n=1/0:(s=t-n,r=i-n,f=t+n,u=i+n,n*=n);x=c.pop();)if(!(!(_=x.node)||(a=x.x0)>f||(h=x.y0)>u||(l=x.x1)<s||(o=x.y1)<r))if(_.length){var v=(a+l)/2,p=(h+o)/2;c.push(new S(_[3],v,p,l,o),new S(_[2],a,p,v,o),new S(_[1],v,h,l,p),new S(_[0],a,h,v,p)),(w=(i>=p)<<1|t>=v)&&(x=c[c.length-1],c[c.length-1]=c[c.length-1-w],c[c.length-1-w]=x)}else{var y=t-+this._x.call(null,_.data),A=i-+this._y.call(null,_.data),z=y*y+A*A;if(z<n){var N=Math.sqrt(n=z);s=t-N,r=i-N,f=t+N,u=i+N,e=_.data}}return e}function gt(t){if(isNaN(f=+this._x.call(null,t))||isNaN(u=+this._y.call(null,t)))return this;var i,n=this._root,e,s,r,a=this._x0,h=this._y0,l=this._x1,o=this._y1,f,u,c,_,x,w,v,p;if(!n)return this;if(n.length)for(;;){if((x=f>=(c=(a+l)/2))?a=c:l=c,(w=u>=(_=(h+o)/2))?h=_:o=_,i=n,!(n=n[v=w<<1|x]))return this;if(!n.length)break;(i[v+1&3]||i[v+2&3]||i[v+3&3])&&(e=i,p=v)}for(;n.data!==t;)if(s=n,!(n=n.next))return this;return(r=n.next)&&delete n.next,s?(r?s.next=r:delete s.next,this):i?(r?i[v]=r:delete i[v],(n=i[0]||i[1]||i[2]||i[3])&&n===(i[3]||i[2]||i[1]||i[0])&&!n.length&&(e?e[p]=n:this._root=n),this):(this._root=r,this)}function yt(t){for(var i=0,n=t.length;i<n;++i)this.remove(t[i]);return this}function pt(){return this._root}function wt(){var t=0;return this.visit(function(i){if(!i.length)do++t;while(i=i.next)}),t}function dt(t){var i=[],n,e=this._root,s,r,a,h,l;for(e&&i.push(new S(e,this._x0,this._y0,this._x1,this._y1));n=i.pop();)if(!t(e=n.node,r=n.x0,a=n.y0,h=n.x1,l=n.y1)&&e.length){var o=(r+h)/2,f=(a+l)/2;(s=e[3])&&i.push(new S(s,o,f,h,l)),(s=e[2])&&i.push(new S(s,r,f,o,l)),(s=e[1])&&i.push(new S(s,o,a,h,f)),(s=e[0])&&i.push(new S(s,r,a,o,f))}return this}function Nt(t){var i=[],n=[],e;for(this._root&&i.push(new S(this._root,this._x0,this._y0,this._x1,this._y1));e=i.pop();){var s=e.node;if(s.length){var r,a=e.x0,h=e.y0,l=e.x1,o=e.y1,f=(a+l)/2,u=(h+o)/2;(r=s[0])&&i.push(new S(r,a,h,f,u)),(r=s[1])&&i.push(new S(r,f,h,l,u)),(r=s[2])&&i.push(new S(r,a,u,f,o)),(r=s[3])&&i.push(new S(r,f,u,l,o))}n.push(e)}for(;e=n.pop();)t(e.node,e.x0,e.y0,e.x1,e.y1);return this}function At(t){return t[0]}function zt(t){return arguments.length?(this._x=t,this):this._x}function Mt(t){return t[1]}function Dt(t){return arguments.length?(this._y=t,this):this._y}function C(t,i,n){var e=new E(i??At,n??Mt,NaN,NaN,NaN,NaN);return t==null?e:e.addAll(t)}function E(t,i,n,e,s,r){this._x=t,this._y=i,this._x0=n,this._y0=e,this._x1=s,this._y1=r,this._root=void 0}function Z(t){for(var i={data:t.data},n=i;t=t.next;)n=n.next={data:t.data};return i}var q=C.prototype=E.prototype;q.copy=function(){var t=new E(this._x,this._y,this._x0,this._y0,this._x1,this._y1),i=this._root,n,e;if(!i)return t;if(!i.length)return t._root=Z(i),t;for(n=[{source:i,target:t._root=new Array(4)}];i=n.pop();)for(var s=0;s<4;++s)(e=i.source[s])&&(e.length?n.push({source:e,target:i.target[s]=new Array(4)}):i.target[s]=Z(e));return t};q.add=ft;q.addAll=ut;q.cover=ct;q.data=_t;q.extent=xt;q.find=vt;q.remove=gt;q.removeAll=yt;q.root=pt;q.size=wt;q.visit=dt;q.visitAfter=Nt;q.x=zt;q.y=Dt;function $t(t){const i=+this._x.call(null,t);return et(this.cover(i),i,t)}function et(t,i,n){if(isNaN(i))return t;var e,s=t._root,r={data:n},a=t._x0,h=t._x1,l,o,f,u,c;if(!s)return t._root=r,t;for(;s.length;)if((f=i>=(l=(a+h)/2))?a=l:h=l,e=s,!(s=s[u=+f]))return e[u]=r,t;if(o=+t._x.call(null,s.data),i===o)return r.next=s,e?e[u]=r:t._root=r,t;do e=e?e[u]=new Array(2):t._root=new Array(2),(f=i>=(l=(a+h)/2))?a=l:h=l;while((u=+f)==(c=+(o>=l)));return e[c]=s,e[u]=r,t}function bt(t){Array.isArray(t)||(t=Array.from(t));const i=t.length,n=new Float64Array(i);let e=1/0,s=-1/0;for(let r=0,a;r<i;++r)isNaN(a=+this._x.call(null,t[r]))||(n[r]=a,a<e&&(e=a),a>s&&(s=a));if(e>s)return this;this.cover(e).cover(s);for(let r=0;r<i;++r)et(this,n[r],t[r]);return this}function St(t){if(isNaN(t=+t))return this;var i=this._x0,n=this._x1;if(isNaN(i))n=(i=Math.floor(t))+1;else{for(var e=n-i||1,s=this._root,r,a;i>t||t>=n;)switch(a=+(t<i),r=new Array(2),r[a]=s,s=r,e*=2,a){case 0:n=i+e;break;case 1:i=n-e;break}this._root&&this._root.length&&(this._root=s)}return this._x0=i,this._x1=n,this}function qt(){var t=[];return this.visit(function(i){if(!i.length)do t.push(i.data);while(i=i.next)}),t}function kt(t){return arguments.length?this.cover(+t[0][0]).cover(+t[1][0]):isNaN(this._x0)?void 0:[[this._x0],[this._x1]]}function m(t,i,n){this.node=t,this.x0=i,this.x1=n}function It(t,i){var n,e=this._x0,s,r,a=this._x1,h=[],l=this._root,o,f;for(l&&h.push(new m(l,e,a)),i==null?i=1/0:(e=t-i,a=t+i);o=h.pop();)if(!(!(l=o.node)||(s=o.x0)>a||(r=o.x1)<e))if(l.length){var u=(s+r)/2;h.push(new m(l[1],u,r),new m(l[0],s,u)),(f=+(t>=u))&&(o=h[h.length-1],h[h.length-1]=h[h.length-1-f],h[h.length-1-f]=o)}else{var c=Math.abs(t-+this._x.call(null,l.data));c<i&&(i=c,e=t-c,a=t+c,n=l.data)}return n}function mt(t){if(isNaN(l=+this._x.call(null,t)))return this;var i,n=this._root,e,s,r,a=this._x0,h=this._x1,l,o,f,u,c;if(!n)return this;if(n.length)for(;;){if((f=l>=(o=(a+h)/2))?a=o:h=o,i=n,!(n=n[u=+f]))return this;if(!n.length)break;i[u+1&1]&&(e=i,c=u)}for(;n.data!==t;)if(s=n,!(n=n.next))return this;return(r=n.next)&&delete n.next,s?(r?s.next=r:delete s.next,this):i?(r?i[u]=r:delete i[u],(n=i[0]||i[1])&&n===(i[1]||i[0])&&!n.length&&(e?e[c]=n:this._root=n),this):(this._root=r,this)}function Ft(t){for(var i=0,n=t.length;i<n;++i)this.remove(t[i]);return this}function jt(){return this._root}function Rt(){var t=0;return this.visit(function(i){if(!i.length)do++t;while(i=i.next)}),t}function Lt(t){var i=[],n,e=this._root,s,r,a;for(e&&i.push(new m(e,this._x0,this._x1));n=i.pop();)if(!t(e=n.node,r=n.x0,a=n.x1)&&e.length){var h=(r+a)/2;(s=e[1])&&i.push(new m(s,h,a)),(s=e[0])&&i.push(new m(s,r,h))}return this}function Pt(t){var i=[],n=[],e;for(this._root&&i.push(new m(this._root,this._x0,this._x1));e=i.pop();){var s=e.node;if(s.length){var r,a=e.x0,h=e.x1,l=(a+h)/2;(r=s[0])&&i.push(new m(r,a,l)),(r=s[1])&&i.push(new m(r,l,h))}n.push(e)}for(;e=n.pop();)t(e.node,e.x0,e.x1);return this}function Kt(t){return t[0]}function Ot(t){return arguments.length?(this._x=t,this):this._x}function G(t,i){var n=new X(i??Kt,NaN,NaN);return t==null?n:n.addAll(t)}function X(t,i,n){this._x=t,this._x0=i,this._x1=n,this._root=void 0}function J(t){for(var i={data:t.data},n=i;t=t.next;)n=n.next={data:t.data};return i}var k=G.prototype=X.prototype;k.copy=function(){var t=new X(this._x,this._x0,this._x1),i=this._root,n,e;if(!i)return t;if(!i.length)return t._root=J(i),t;for(n=[{source:i,target:t._root=new Array(2)}];i=n.pop();)for(var s=0;s<2;++s)(e=i.source[s])&&(e.length?n.push({source:e,target:i.target[s]=new Array(2)}):i.target[s]=J(e));return t};k.add=$t;k.addAll=bt;k.cover=St;k.data=qt;k.extent=kt;k.find=It;k.remove=mt;k.removeAll=Ft;k.root=jt;k.size=Rt;k.visit=Lt;k.visitAfter=Pt;k.x=Ot;function Tt(t){const i=+this._x.call(null,t),n=+this._y.call(null,t),e=+this._z.call(null,t);return rt(this.cover(i,n,e),i,n,e,t)}function rt(t,i,n,e,s){if(isNaN(i)||isNaN(n)||isNaN(e))return t;var r,a=t._root,h={data:s},l=t._x0,o=t._y0,f=t._z0,u=t._x1,c=t._y1,_=t._z1,x,w,v,p,y,A,z,N,D,b,L;if(!a)return t._root=h,t;for(;a.length;)if((z=i>=(x=(l+u)/2))?l=x:u=x,(N=n>=(w=(o+c)/2))?o=w:c=w,(D=e>=(v=(f+_)/2))?f=v:_=v,r=a,!(a=a[b=D<<2|N<<1|z]))return r[b]=h,t;if(p=+t._x.call(null,a.data),y=+t._y.call(null,a.data),A=+t._z.call(null,a.data),i===p&&n===y&&e===A)return h.next=a,r?r[b]=h:t._root=h,t;do r=r?r[b]=new Array(8):t._root=new Array(8),(z=i>=(x=(l+u)/2))?l=x:u=x,(N=n>=(w=(o+c)/2))?o=w:c=w,(D=e>=(v=(f+_)/2))?f=v:_=v;while((b=D<<2|N<<1|z)===(L=(A>=v)<<2|(y>=w)<<1|p>=x));return r[L]=a,r[b]=h,t}function Ct(t){Array.isArray(t)||(t=Array.from(t));const i=t.length,n=new Float64Array(i),e=new Float64Array(i),s=new Float64Array(i);let r=1/0,a=1/0,h=1/0,l=-1/0,o=-1/0,f=-1/0;for(let u=0,c,_,x,w;u<i;++u)isNaN(_=+this._x.call(null,c=t[u]))||isNaN(x=+this._y.call(null,c))||isNaN(w=+this._z.call(null,c))||(n[u]=_,e[u]=x,s[u]=w,_<r&&(r=_),_>l&&(l=_),x<a&&(a=x),x>o&&(o=x),w<h&&(h=w),w>f&&(f=w));if(r>l||a>o||h>f)return this;this.cover(r,a,h).cover(l,o,f);for(let u=0;u<i;++u)rt(this,n[u],e[u],s[u],t[u]);return this}function Et(t,i,n){if(isNaN(t=+t)||isNaN(i=+i)||isNaN(n=+n))return this;var e=this._x0,s=this._y0,r=this._z0,a=this._x1,h=this._y1,l=this._z1;if(isNaN(e))a=(e=Math.floor(t))+1,h=(s=Math.floor(i))+1,l=(r=Math.floor(n))+1;else{for(var o=a-e||1,f=this._root,u,c;e>t||t>=a||s>i||i>=h||r>n||n>=l;)switch(c=(n<r)<<2|(i<s)<<1|t<e,u=new Array(8),u[c]=f,f=u,o*=2,c){case 0:a=e+o,h=s+o,l=r+o;break;case 1:e=a-o,h=s+o,l=r+o;break;case 2:a=e+o,s=h-o,l=r+o;break;case 3:e=a-o,s=h-o,l=r+o;break;case 4:a=e+o,h=s+o,r=l-o;break;case 5:e=a-o,h=s+o,r=l-o;break;case 6:a=e+o,s=h-o,r=l-o;break;case 7:e=a-o,s=h-o,r=l-o;break}this._root&&this._root.length&&(this._root=f)}return this._x0=e,this._y0=s,this._z0=r,this._x1=a,this._y1=h,this._z1=l,this}function Gt(){var t=[];return this.visit(function(i){if(!i.length)do t.push(i.data);while(i=i.next)}),t}function Xt(t){return arguments.length?this.cover(+t[0][0],+t[0][1],+t[0][2]).cover(+t[1][0],+t[1][1],+t[1][2]):isNaN(this._x0)?void 0:[[this._x0,this._y0,this._z0],[this._x1,this._y1,this._z1]]}function M(t,i,n,e,s,r,a){this.node=t,this.x0=i,this.y0=n,this.z0=e,this.x1=s,this.y1=r,this.z1=a}function Ht(t,i,n,e){var s,r=this._x0,a=this._y0,h=this._z0,l,o,f,u,c,_,x=this._x1,w=this._y1,v=this._z1,p=[],y=this._root,A,z;for(y&&p.push(new M(y,r,a,h,x,w,v)),e==null?e=1/0:(r=t-e,a=i-e,h=n-e,x=t+e,w=i+e,v=n+e,e*=e);A=p.pop();)if(!(!(y=A.node)||(l=A.x0)>x||(o=A.y0)>w||(f=A.z0)>v||(u=A.x1)<r||(c=A.y1)<a||(_=A.z1)<h))if(y.length){var N=(l+u)/2,D=(o+c)/2,b=(f+_)/2;p.push(new M(y[7],N,D,b,u,c,_),new M(y[6],l,D,b,N,c,_),new M(y[5],N,o,b,u,D,_),new M(y[4],l,o,b,N,D,_),new M(y[3],N,D,f,u,c,b),new M(y[2],l,D,f,N,c,b),new M(y[1],N,o,f,u,D,b),new M(y[0],l,o,f,N,D,b)),(z=(n>=b)<<2|(i>=D)<<1|t>=N)&&(A=p[p.length-1],p[p.length-1]=p[p.length-1-z],p[p.length-1-z]=A)}else{var L=t-+this._x.call(null,y.data),V=i-+this._y.call(null,y.data),W=n-+this._z.call(null,y.data),Y=L*L+V*V+W*W;if(Y<e){var F=Math.sqrt(e=Y);r=t-F,a=i-F,h=n-F,x=t+F,w=i+F,v=n+F,s=y.data}}return s}const Qt=(t,i,n,e,s,r)=>Math.sqrt((t-e)**2+(i-s)**2+(n-r)**2);function Vt(t,i,n,e){const s=[],r=t-e,a=i-e,h=n-e,l=t+e,o=i+e,f=n+e;return this.visit((u,c,_,x,w,v,p)=>{if(!u.length)do{const y=u.data;Qt(t,i,n,this._x(y),this._y(y),this._z(y))<=e&&s.push(y)}while(u=u.next);return c>l||_>o||x>f||w<r||v<a||p<h}),s}function Wt(t){if(isNaN(c=+this._x.call(null,t))||isNaN(_=+this._y.call(null,t))||isNaN(x=+this._z.call(null,t)))return this;var i,n=this._root,e,s,r,a=this._x0,h=this._y0,l=this._z0,o=this._x1,f=this._y1,u=this._z1,c,_,x,w,v,p,y,A,z,N,D;if(!n)return this;if(n.length)for(;;){if((y=c>=(w=(a+o)/2))?a=w:o=w,(A=_>=(v=(h+f)/2))?h=v:f=v,(z=x>=(p=(l+u)/2))?l=p:u=p,i=n,!(n=n[N=z<<2|A<<1|y]))return this;if(!n.length)break;(i[N+1&7]||i[N+2&7]||i[N+3&7]||i[N+4&7]||i[N+5&7]||i[N+6&7]||i[N+7&7])&&(e=i,D=N)}for(;n.data!==t;)if(s=n,!(n=n.next))return this;return(r=n.next)&&delete n.next,s?(r?s.next=r:delete s.next,this):i?(r?i[N]=r:delete i[N],(n=i[0]||i[1]||i[2]||i[3]||i[4]||i[5]||i[6]||i[7])&&n===(i[7]||i[6]||i[5]||i[4]||i[3]||i[2]||i[1]||i[0])&&!n.length&&(e?e[D]=n:this._root=n),this):(this._root=r,this)}function Yt(t){for(var i=0,n=t.length;i<n;++i)this.remove(t[i]);return this}function Bt(){return this._root}function Zt(){var t=0;return this.visit(function(i){if(!i.length)do++t;while(i=i.next)}),t}function Jt(t){var i=[],n,e=this._root,s,r,a,h,l,o,f;for(e&&i.push(new M(e,this._x0,this._y0,this._z0,this._x1,this._y1,this._z1));n=i.pop();)if(!t(e=n.node,r=n.x0,a=n.y0,h=n.z0,l=n.x1,o=n.y1,f=n.z1)&&e.length){var u=(r+l)/2,c=(a+o)/2,_=(h+f)/2;(s=e[7])&&i.push(new M(s,u,c,_,l,o,f)),(s=e[6])&&i.push(new M(s,r,c,_,u,o,f)),(s=e[5])&&i.push(new M(s,u,a,_,l,c,f)),(s=e[4])&&i.push(new M(s,r,a,_,u,c,f)),(s=e[3])&&i.push(new M(s,u,c,h,l,o,_)),(s=e[2])&&i.push(new M(s,r,c,h,u,o,_)),(s=e[1])&&i.push(new M(s,u,a,h,l,c,_)),(s=e[0])&&i.push(new M(s,r,a,h,u,c,_))}return this}function Ut(t){var i=[],n=[],e;for(this._root&&i.push(new M(this._root,this._x0,this._y0,this._z0,this._x1,this._y1,this._z1));e=i.pop();){var s=e.node;if(s.length){var r,a=e.x0,h=e.y0,l=e.z0,o=e.x1,f=e.y1,u=e.z1,c=(a+o)/2,_=(h+f)/2,x=(l+u)/2;(r=s[0])&&i.push(new M(r,a,h,l,c,_,x)),(r=s[1])&&i.push(new M(r,c,h,l,o,_,x)),(r=s[2])&&i.push(new M(r,a,_,l,c,f,x)),(r=s[3])&&i.push(new M(r,c,_,l,o,f,x)),(r=s[4])&&i.push(new M(r,a,h,x,c,_,u)),(r=s[5])&&i.push(new M(r,c,h,x,o,_,u)),(r=s[6])&&i.push(new M(r,a,_,x,c,f,u)),(r=s[7])&&i.push(new M(r,c,_,x,o,f,u))}n.push(e)}for(;e=n.pop();)t(e.node,e.x0,e.y0,e.z0,e.x1,e.y1,e.z1);return this}function ti(t){return t[0]}function ii(t){return arguments.length?(this._x=t,this):this._x}function ni(t){return t[1]}function ei(t){return arguments.length?(this._y=t,this):this._y}function ri(t){return t[2]}function si(t){return arguments.length?(this._z=t,this):this._z}function H(t,i,n,e){var s=new Q(i??ti,n??ni,e??ri,NaN,NaN,NaN,NaN,NaN,NaN);return t==null?s:s.addAll(t)}function Q(t,i,n,e,s,r,a,h,l){this._x=t,this._y=i,this._z=n,this._x0=e,this._y0=s,this._z0=r,this._x1=a,this._y1=h,this._z1=l,this._root=void 0}function U(t){for(var i={data:t.data},n=i;t=t.next;)n=n.next={data:t.data};return i}var $=H.prototype=Q.prototype;$.copy=function(){var t=new Q(this._x,this._y,this._z,this._x0,this._y0,this._z0,this._x1,this._y1,this._z1),i=this._root,n,e;if(!i)return t;if(!i.length)return t._root=U(i),t;for(n=[{source:i,target:t._root=new Array(8)}];i=n.pop();)for(var s=0;s<8;++s)(e=i.source[s])&&(e.length?n.push({source:e,target:i.target[s]=new Array(8)}):i.target[s]=U(e));return t};$.add=Tt;$.addAll=Ct;$.cover=Et;$.data=Gt;$.extent=Xt;$.find=Ht;$.findAllWithinRadius=Vt;$.remove=Wt;$.removeAll=Yt;$.root=Bt;$.size=Zt;$.visit=Jt;$.visitAfter=Ut;$.x=ii;$.y=ei;$.z=si;var ai=Object.defineProperty,hi=(t,i,n)=>i in t?ai(t,i,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[i]=n,O=(t,i,n)=>(hi(t,typeof i!="symbol"?i+"":i,n),n);function I(t){return(t()-.5)*1e-6}function j(t){return i=>{const n=i[t];return n.d+n.v}}function oi(){return 1}function Ni({strength:t=1,iterations:i=1,random:n=Math.random,getRadius:e=oi}=P){return function(s,r){d.nDim=r,d.strength=t,d.getRadius=e,d.random=n;for(var a=0;a<i;++a){const h=(r===1?G(s,j("x")):r===2?C(s,j("x"),j("y")):r===3?H(s,j("x"),j("y"),j("z")):null).visitAfter(fi);for(let l=0;l<s.length;++l){const o=s[l];d.node=o,d.ri=e(o),d.ri2=d.ri*d.ri,d.xi=o.x.d+o.x.v,r>1&&(d.yi=o.y.d+o.y.v),r>2&&(d.zi=o.z.d+o.z.v),h.visit(li)}}}}const d={};function li(t,i,n,e,s,r,a){var h=[i,n,e,s,r,a],l=h[0],o=h[1],f=h[2],u=h[d.nDim],c=h[d.nDim+1],_=h[d.nDim+2],x=t.data,w=t.r,v=d.ri+w;if(x){if(x.index>d.node.index){var p=d.xi-x.x.d-x.x.v,y=d.nDim>1?d.yi-x.y.d-x.y.v:0,A=d.nDim>2?d.zi-x.z.d-x.z.v:0,z=p*p+y*y+A*A;z<v*v&&(p===0&&(p=I(d.random),z+=p*p),d.nDim>1&&y===0&&(y=I(d.random),z+=y*y),d.nDim>2&&A===0&&(A=I(d.random),z+=A*A),z=(v-(z=Math.sqrt(z)))/z*d.strength,d.node.x.v+=(p*=z)*(v=(w*=w)/(d.ri2+w)),d.nDim>1&&(d.node.y.v+=(y*=z)*v),d.nDim>2&&(d.node.z.v+=(A*=z)*v),x.x.v-=p*(v=1-v),d.nDim>1&&(x.y.v-=y*v),d.nDim>2&&(x.z.v-=A*v))}return}return l>d.xi+v||u<d.xi-v||d.nDim>1&&(o>d.yi+v||c<d.yi-v)||d.nDim>2&&(f>d.zi+v||_<d.zi-v)}function fi(t){if(t.data)return t.r=d.getRadius(t.data);for(var i=t.r=0;i<Math.pow(2,d.nDim);++i)t[i]&&t[i].r>t.r&&(t.r=t[i].r)}function Ai(t,{getZ:i=B(0),getStrength:n=B(.1)}=P){return function(e,s){for(var r=0,a=e.length,h;r<a;++r)h=e[r],h[t].v+=(i(h,r,e)-h[t].d)*n(h,r,e)*s}}function ui(){return 30}function zi({random:t=Math.random,getDistance:i=ui,iterations:n=1,getStrength:e}=P){let s;const r=[],a=[],h=e||(o=>1/Math.min(a[o.source.index],a[o.target.index]));function l(o){if(s!=o){s=o,r.length=0,a.length=0;const f=o.length;for(let u=0;u<f;++u){const c=o[u];a[c.source.index]=(a[c.source.index]||0)+1,a[c.target.index]=(a[c.target.index]||0)+1}for(let u=0;u<f;++u){const c=o[u];r[u]=a[c.source.index]/(a[c.source.index]+a[c.target.index])}}}return function(o,f,u){l(o);for(let c=0;c<n;++c){let _=0,x=0,w=0;for(let v=0;v<o.length;++v){const p=o[v],y=p.source,A=p.target;_=A.x.d+A.x.v-y.x.d-y.x.v||I(t),f>1&&(x=A.y.d+A.y.v-y.y.d-y.y.v||I(t)),f>2&&(w=A.z.d+A.z.v-y.z.d-y.z.v||I(t));let z=Math.sqrt(_*_+x*x+w*w);z=(z-i(p,v))/z*u*h(p,v),_*=z,x*=z,w*=z;let N=r[v];A.x.v-=_*N,f>1&&(A.y.v-=x*N),f>2&&(A.z.v-=w*N),N=1-N,y.x.v+=_*N,f>1&&(y.y.v+=x*N),f>2&&(y.z.v+=w*N)}}}}function R(t){return i=>i[t].d}const g={};function ci(t){return-30}function Mi({distanceMax2:t=1/0,distanceMin2:i=1,theta2:n=.81,random:e=Math.random,getStrenth:s=ci}=P){return function(r,a,h){g.alpha=h,g.nDim=a,g.distanceMax2=t,g.distanceMin2=i,g.theta2=n,g.random=e,g.getStrenth=s;const l=(g.nDim===1?G(r,R("x")):g.nDim===2?C(r,R("x"),R("y")):g.nDim===3?H(r,R("x"),R("y"),R("z")):null).visitAfter(_i);for(let o=0,f=r.length;o<f;++o)g.node=r[o],l.visit(xi)}}function _i(t){var i=0,n,e,s=0,r,a,h,l,o=t.length;if(o){for(r=a=h=l=0;l<o;++l)(n=t[l])&&(e=Math.abs(n.value))&&(i+=n.value,s+=e,r+=e*(n.x||0),a+=e*(n.y||0),h+=e*(n.z||0));i*=Math.sqrt(4/o),t.x=r/s,g.nDim>1&&(t.y=a/s),g.nDim>2&&(t.z=h/s)}else{n=t,n.x=n.data.x.d,g.nDim>1&&(n.y=n.data.y.d),g.nDim>2&&(n.z=n.data.z.d);do i+=g.getStrenth(n.data);while(n=n.next)}t.value=i}function xi(t,i,n,e,s){if(!t.value)return!0;var r=[n,e,s][g.nDim-1],a=t.x-g.node.x.d,h=g.nDim>1?t.y-g.node.y.d:0,l=g.nDim>2?t.z-g.node.z.d:0,o=r-i,f=a*a+h*h+l*l;if(o*o/g.theta2<f)return f<g.distanceMax2&&(a===0&&(a=I(g.random),f+=a*a),g.nDim>1&&h===0&&(h=I(g.random),f+=h*h),g.nDim>2&&l===0&&(l=I(g.random),f+=l*l),f<g.distanceMin2&&(f=Math.sqrt(g.distanceMin2*f)),g.node.x.v+=a*t.value*g.alpha/f,g.nDim>1&&(g.node.y.v+=h*t.value*g.alpha/f),g.nDim>2&&(g.node.z.v+=l*t.value*g.alpha/f)),!0;if(t.length||f>=g.distanceMax2)return;(t.data!==g.node||t.next)&&(a===0&&(a=I(g.random),f+=a*a),g.nDim>1&&h===0&&(h=I(g.random),f+=h*h),g.nDim>2&&l===0&&(l=I(g.random),f+=l*l),f<g.distanceMin2&&(f=Math.sqrt(g.distanceMin2*f)));do t.data!==g.node&&(o=g.getStrenth(t.data.value)*g.alpha/f,g.node.x.v+=a*o,g.nDim>1&&(g.node.y.v+=h*o),g.nDim>2&&(g.node.z.v+=l*o));while(t=t.next)}const vi=10,gi=Math.PI*(3-Math.sqrt(5));function st({nodes:t,fromNodes:i,createForceNode:n}){const e=new lt(t),s=Math.max(t.length,i.length);for(let r=0;r<s;r++){const a=i[r],h=e.get()[r];if(a){const l=a;if(h)if(h.value==l)h.index!=r&&e.replace(r,{...h,index:r});else{const f=e.get().findIndex(u=>u.value==l);if(f<0)e.insert(r,n(a,r,t));else{const u=e.get()[f];e.removeAt(f),e.insert(r,{...u,index:r})}}else e.insert(r,n(a,r,t))}else e.removeAt(r)}return e}function Di(t){return st(t).get()}function $i(t){const i=st(t),{nodes:n,links:e,fromLinks:s,getNodeKey:r,getSorceKey:a,getTargetKey:h,createFromKey:l,createForceNode:o}=t;function f(c){let _=i.get().find(x=>r(x.value)==c);if(!_){const x=i.get().length;_=o(l(c),x,n),i.insert(x,_)}return _}const u=[];for(let c=0;c<s.length;c++){const _=s[c];u.push({source:f(a(_)),target:f(h(_)),value:_})}return ot(u,e,yi)?{nodes:i.get(),links:e}:{nodes:i.get(),links:u}}function bi(t,i,n,e,s){var r=vi*Math.sqrt(.5+n),a=n*gi;return{index:n,value:t,x:e(r*Math.cos(a)),y:e(r*Math.sin(a)),z:s}}function yi(t,i){return t.source==i.source&&t.target==i.target&&t.value==i.value}function Si(){return{nDim:2,alphaTarget:0,alpha:1,alphaMin:.001,alphaDecay:1-Math.pow(.001,1/300),velocityDecay:.6}}function T(t,i){if(typeof t.f=="number"){t.v=0,t.d=t.f;return}t.v=t.v*i,t.d=t.d+t.v}let at=2,ht=0;function pi(t){const i=ht,n=at;T(t.x,i),n>1&&T(t.y,i),n>2&&T(t.z,i)}function qi(t,i,n){let{alphaDecay:e,alphaTarget:s,alpha:r,nDim:a,velocityDecay:h}=t;r+=(s-r)*e,n(r),at=a,ht=h,i.forEach(pi),t.alpha=r}class wi{constructor(i,n,e){O(this,"vSignal"),O(this,"dSignal"),O(this,"fSignal"),this.dSignal=K(i),this.vSignal=K(n),this.fSignal=K(e)}get d(){return this.dSignal.get()}set d(i){this.dSignal.set(i)}get v(){return this.vSignal.get()}set v(i){this.vSignal.set(i)}get f(){return this.fSignal.get()}set f(i){this.fSignal.set(i)}}function ki(t,i=0,n){return new wi(t,i,n)}const tt=it(0),Ii={d:0,dSignal:tt,v:0,vSignal:tt,fSignal:it(void 0)};export{Mi as a,Ai as b,Si as c,ki as d,Ii as e,zi as f,Di as g,Ni as h,bi as i,$i as m,qi as t};
