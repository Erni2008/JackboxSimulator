var yd=0,Vl=1,_d=2;var ps=1,Wo=2,cr=3,ni=0,on=1,Rt=2,ii=0,Xi=1,dt=2,Wl=3,Xl=4,vd=5;var ms=100,Md=101,bd=102,Ed=103,Sd=104,Td=200,wd=201,Ad=202,Rd=203,ql=204,Yl=205,Cd=206,Id=207,Pd=208,Ld=209,Nd=210,Dd=211,zd=212,Ud=213,Fd=214,fo=0,po=1,mo=2,Vs=3,go=4,xo=5,yo=6,_o=7,Zl=0,Bd=1,Od=2,Wn=0,Kl=1,$l=2,Jl=3,pa=4,jl=5,Ql=6,eh=7,Cl="attached",Hd="detached",th=300,qi=301,gs=302,lr=303,Xo=304,ma=306,cn=1e3,An=1001,Ws=1002,Dt=1003,qo=1004;var xs=1005;var zt=1006,hr=1007;var Xn=1008;var mn=1009,nh=1010,ih=1011,ur=1012,Yo=1013,qn=1014,Mn=1015,Yn=1016,Zo=1017,Ko=1018,dr=1020,sh=35902,rh=35899,ah=1021,oh=1022,bn=1023,jn=1026,Yi=1027,$o=1028,Jo=1029,Zi=1030,jo=1031;var Qo=1033,ga=33776,xa=33777,ya=33778,_a=33779,ec=35840,tc=35841,nc=35842,ic=35843,sc=36196,rc=37492,ac=37496,oc=37488,cc=37489,va=37490,lc=37491,hc=37808,uc=37809,dc=37810,fc=37811,pc=37812,mc=37813,gc=37814,xc=37815,yc=37816,_c=37817,vc=37818,Mc=37819,bc=37820,Ec=37821,Sc=36492,Tc=36494,wc=36495,Ac=36283,Rc=36284,Ma=36285,Cc=36286,Ic=2200,Pc=2201,kd=2202,rs=2300,as=2301,lo=2302,Il=2303,ts=2400,ns=2401,Br=2402,Lc=2500,Gd=2501,ch=0,ba=1,fr=2,Vd=3200;var Nc=0,Wd=1,Ti="",_t="srgb",sn="srgb-linear",Or="linear",gt="srgb";var ho=7680;var Xd=519,qd=512,Yd=513,Zd=514,Dc=515,Kd=516,$d=517,zc=518,Jd=519,lh=35044;var hh="300 es",On=2e3,Xs=2001;function mp(r){for(let e=r.length-1;e>=0;--e)if(r[e]>=65535)return!0;return!1}function gp(r){return ArrayBuffer.isView(r)&&!(r instanceof DataView)}function qs(r){return document.createElementNS("http://www.w3.org/1999/xhtml",r)}function jd(){let r=qs("canvas");return r.style.display="block",r}var Tu={},Ys=null;function Hr(...r){let e="THREE."+r.shift();Ys?Ys("log",e,...r):console.log(e,...r)}function Qd(r){let e=r[0];if(typeof e=="string"&&e.startsWith("TSL:")){let t=r[1];t&&t.isStackTrace?r[0]+=" "+t.getLocation():r[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return r}function Le(...r){r=Qd(r);let e="THREE."+r.shift();if(Ys)Ys("warn",e,...r);else{let t=r[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...r)}}function He(...r){r=Qd(r);let e="THREE."+r.shift();if(Ys)Ys("error",e,...r);else{let t=r[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...r)}}function ss(...r){let e=r.join(" ");e in Tu||(Tu[e]=!0,Le(...r))}function ef(r,e,t){return new Promise(function(n,i){function s(){switch(r.clientWaitSync(e,r.SYNC_FLUSH_COMMANDS_BIT,0)){case r.WAIT_FAILED:i();break;case r.TIMEOUT_EXPIRED:setTimeout(s,t);break;default:n()}}setTimeout(s,t)})}var tf={[fo]:po,[mo]:yo,[go]:_o,[Vs]:xo,[po]:fo,[yo]:mo,[_o]:go,[xo]:Vs},Hn=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let i=n[e];if(i!==void 0){let s=i.indexOf(t);s!==-1&&i.splice(s,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let i=n.slice(0);for(let s=0,a=i.length;s<a;s++)i[s].call(this,e);e.target=null}}},jt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],wu=1234567,Dr=Math.PI/180,os=180/Math.PI;function Rn(){let r=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(jt[r&255]+jt[r>>8&255]+jt[r>>16&255]+jt[r>>24&255]+"-"+jt[e&255]+jt[e>>8&255]+"-"+jt[e>>16&15|64]+jt[e>>24&255]+"-"+jt[t&63|128]+jt[t>>8&255]+"-"+jt[t>>16&255]+jt[t>>24&255]+jt[n&255]+jt[n>>8&255]+jt[n>>16&255]+jt[n>>24&255]).toLowerCase()}function et(r,e,t){return Math.max(e,Math.min(t,r))}function uh(r,e){return(r%e+e)%e}function xp(r,e,t,n,i){return n+(r-e)*(i-n)/(t-e)}function yp(r,e,t){return r!==e?(t-r)/(e-r):0}function zr(r,e,t){return(1-t)*r+t*e}function _p(r,e,t,n){return zr(r,e,1-Math.exp(-t*n))}function vp(r,e=1){return e-Math.abs(uh(r,e*2)-e)}function Mp(r,e,t){return r<=e?0:r>=t?1:(r=(r-e)/(t-e),r*r*(3-2*r))}function bp(r,e,t){return r<=e?0:r>=t?1:(r=(r-e)/(t-e),r*r*r*(r*(r*6-15)+10))}function Ep(r,e){return r+Math.floor(Math.random()*(e-r+1))}function Sp(r,e){return r+Math.random()*(e-r)}function Tp(r){return r*(.5-Math.random())}function wp(r){r!==void 0&&(wu=r);let e=wu+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Ap(r){return r*Dr}function Rp(r){return r*os}function Cp(r){return r>0&&Number.isInteger(r)&&2**Math.round(Math.log2(r))===r}function Ip(r){return Math.pow(2,Math.ceil(Math.log(r)/Math.LN2))}function Pp(r){return Math.pow(2,Math.floor(Math.log(r)/Math.LN2))}function Lp(r,e,t,n,i){let s=Math.cos,a=Math.sin,c=s(t/2),l=a(t/2),h=s((e+n)/2),o=a((e+n)/2),u=s((e-n)/2),d=a((e-n)/2),f=s((n-e)/2),m=a((n-e)/2);switch(i){case"XYX":r.set(c*o,l*u,l*d,c*h);break;case"YZY":r.set(l*d,c*o,l*u,c*h);break;case"ZXZ":r.set(l*u,l*d,c*o,c*h);break;case"XZX":r.set(c*o,l*m,l*f,c*h);break;case"YXY":r.set(l*f,c*o,l*m,c*h);break;case"ZYZ":r.set(l*m,l*f,c*o,c*h);break;default:Le("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function Bn(r,e){switch(e.constructor){case Float32Array:return r;case Uint32Array:return r/4294967295;case Uint16Array:return r/65535;case Uint8Array:case Uint8ClampedArray:return r/255;case Int32Array:return Math.max(r/2147483647,-1);case Int16Array:return Math.max(r/32767,-1);case Int8Array:return Math.max(r/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function yt(r,e){switch(e.constructor){case Float32Array:return r;case Uint32Array:return Math.round(r*4294967295);case Uint16Array:return Math.round(r*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(r*255);case Int32Array:return Math.round(r*2147483647);case Int16Array:return Math.round(r*32767);case Int8Array:return Math.round(r*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}var Ea={DEG2RAD:Dr,RAD2DEG:os,generateUUID:Rn,clamp:et,euclideanModulo:uh,mapLinear:xp,inverseLerp:yp,lerp:zr,damp:_p,pingpong:vp,smoothstep:Mp,smootherstep:bp,randInt:Ep,randFloat:Sp,randFloatSpread:Tp,seededRandom:wp,degToRad:Ap,radToDeg:Rp,isPowerOfTwo:Cp,ceilPowerOfTwo:Ip,floorPowerOfTwo:Pp,setQuaternionFromProperEuler:Lp,normalize:yt,denormalize:Bn},ae=class r{static{r.prototype.isVector2=!0}constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6],this.y=i[1]*t+i[4]*n+i[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=et(this.x,e.x,t.x),this.y=et(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=et(this.x,e,t),this.y=et(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(et(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(et(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),i=Math.sin(t),s=this.x-e.x,a=this.y-e.y;return this.x=s*n-a*i+e.x,this.y=s*i+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Pt=class{constructor(e=0,t=0,n=0,i=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=i}static slerpFlat(e,t,n,i,s,a,c){let l=n[i+0],h=n[i+1],o=n[i+2],u=n[i+3],d=s[a+0],f=s[a+1],m=s[a+2],x=s[a+3];if(u!==x||l!==d||h!==f||o!==m){let p=l*d+h*f+o*m+u*x;p<0&&(d=-d,f=-f,m=-m,x=-x,p=-p);let g=1-c;if(p<.9995){let y=Math.acos(p),b=Math.sin(y);g=Math.sin(g*y)/b,c=Math.sin(c*y)/b,l=l*g+d*c,h=h*g+f*c,o=o*g+m*c,u=u*g+x*c}else{l=l*g+d*c,h=h*g+f*c,o=o*g+m*c,u=u*g+x*c;let y=1/Math.sqrt(l*l+h*h+o*o+u*u);l*=y,h*=y,o*=y,u*=y}}e[t]=l,e[t+1]=h,e[t+2]=o,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,i,s,a){let c=n[i],l=n[i+1],h=n[i+2],o=n[i+3],u=s[a],d=s[a+1],f=s[a+2],m=s[a+3];return e[t]=c*m+o*u+l*f-h*d,e[t+1]=l*m+o*d+h*u-c*f,e[t+2]=h*m+o*f+c*d-l*u,e[t+3]=o*m-c*u-l*d-h*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,i){return this._x=e,this._y=t,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,i=e._y,s=e._z,a=e._order,c=Math.cos,l=Math.sin,h=c(n/2),o=c(i/2),u=c(s/2),d=l(n/2),f=l(i/2),m=l(s/2);switch(a){case"XYZ":this._x=d*o*u+h*f*m,this._y=h*f*u-d*o*m,this._z=h*o*m+d*f*u,this._w=h*o*u-d*f*m;break;case"YXZ":this._x=d*o*u+h*f*m,this._y=h*f*u-d*o*m,this._z=h*o*m-d*f*u,this._w=h*o*u+d*f*m;break;case"ZXY":this._x=d*o*u-h*f*m,this._y=h*f*u+d*o*m,this._z=h*o*m+d*f*u,this._w=h*o*u-d*f*m;break;case"ZYX":this._x=d*o*u-h*f*m,this._y=h*f*u+d*o*m,this._z=h*o*m-d*f*u,this._w=h*o*u+d*f*m;break;case"YZX":this._x=d*o*u+h*f*m,this._y=h*f*u+d*o*m,this._z=h*o*m-d*f*u,this._w=h*o*u-d*f*m;break;case"XZY":this._x=d*o*u-h*f*m,this._y=h*f*u-d*o*m,this._z=h*o*m+d*f*u,this._w=h*o*u+d*f*m;break;default:Le("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,i=Math.sin(n);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],i=t[4],s=t[8],a=t[1],c=t[5],l=t[9],h=t[2],o=t[6],u=t[10],d=n+c+u;if(d>0){let f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(o-l)*f,this._y=(s-h)*f,this._z=(a-i)*f}else if(n>c&&n>u){let f=2*Math.sqrt(1+n-c-u);this._w=(o-l)/f,this._x=.25*f,this._y=(i+a)/f,this._z=(s+h)/f}else if(c>u){let f=2*Math.sqrt(1+c-n-u);this._w=(s-h)/f,this._x=(i+a)/f,this._y=.25*f,this._z=(l+o)/f}else{let f=2*Math.sqrt(1+u-n-c);this._w=(a-i)/f,this._x=(s+h)/f,this._y=(l+o)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(et(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let i=Math.min(1,t/n);return this.slerp(e,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,i=e._y,s=e._z,a=e._w,c=t._x,l=t._y,h=t._z,o=t._w;return this._x=n*o+a*c+i*h-s*l,this._y=i*o+a*l+s*c-n*h,this._z=s*o+a*h+n*l-i*c,this._w=a*o-n*c-i*l-s*h,this._onChangeCallback(),this}slerp(e,t){let n=e._x,i=e._y,s=e._z,a=e._w,c=this.dot(e);c<0&&(n=-n,i=-i,s=-s,a=-a,c=-c);let l=1-t;if(c<.9995){let h=Math.acos(c),o=Math.sin(h);l=Math.sin(l*h)/o,t=Math.sin(t*h)/o,this._x=this._x*l+n*t,this._y=this._y*l+i*t,this._z=this._z*l+s*t,this._w=this._w*l+a*t,this._onChangeCallback()}else this._x=this._x*l+n*t,this._y=this._y*l+i*t,this._z=this._z*l+s*t,this._w=this._w*l+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),s=Math.sqrt(n);return this.set(i*Math.sin(e),i*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},L=class r{static{r.prototype.isVector3=!0}constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Au.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Au.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,i=this.z,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6]*i,this.y=s[1]*t+s[4]*n+s[7]*i,this.z=s[2]*t+s[5]*n+s[8]*i,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,i=this.z,s=e.elements,a=1/(s[3]*t+s[7]*n+s[11]*i+s[15]);return this.x=(s[0]*t+s[4]*n+s[8]*i+s[12])*a,this.y=(s[1]*t+s[5]*n+s[9]*i+s[13])*a,this.z=(s[2]*t+s[6]*n+s[10]*i+s[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,i=this.z,s=e.x,a=e.y,c=e.z,l=e.w,h=2*(a*i-c*n),o=2*(c*t-s*i),u=2*(s*n-a*t);return this.x=t+l*h+a*u-c*o,this.y=n+l*o+c*h-s*u,this.z=i+l*u+s*o-a*h,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,i=this.z,s=e.elements;return this.x=s[0]*t+s[4]*n+s[8]*i,this.y=s[1]*t+s[5]*n+s[9]*i,this.z=s[2]*t+s[6]*n+s[10]*i,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=et(this.x,e.x,t.x),this.y=et(this.y,e.y,t.y),this.z=et(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=et(this.x,e,t),this.y=et(this.y,e,t),this.z=et(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(et(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,i=e.y,s=e.z,a=t.x,c=t.y,l=t.z;return this.x=i*l-s*c,this.y=s*a-n*l,this.z=n*c-i*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return tl.copy(this).projectOnVector(e),this.sub(tl)}reflect(e){return this.sub(tl.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(et(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,i=this.z-e.z;return t*t+n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let i=Math.sin(t)*e;return this.x=i*Math.sin(n),this.y=Math.cos(t)*e,this.z=i*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),i=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=i,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},tl=new L,Au=new Pt,Ye=class r{static{r.prototype.isMatrix3=!0}constructor(e,t,n,i,s,a,c,l,h){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,i,s,a,c,l,h)}set(e,t,n,i,s,a,c,l,h){let o=this.elements;return o[0]=e,o[1]=i,o[2]=c,o[3]=t,o[4]=s,o[5]=l,o[6]=n,o[7]=a,o[8]=h,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,i=t.elements,s=this.elements,a=n[0],c=n[3],l=n[6],h=n[1],o=n[4],u=n[7],d=n[2],f=n[5],m=n[8],x=i[0],p=i[3],g=i[6],y=i[1],b=i[4],M=i[7],w=i[2],S=i[5],T=i[8];return s[0]=a*x+c*y+l*w,s[3]=a*p+c*b+l*S,s[6]=a*g+c*M+l*T,s[1]=h*x+o*y+u*w,s[4]=h*p+o*b+u*S,s[7]=h*g+o*M+u*T,s[2]=d*x+f*y+m*w,s[5]=d*p+f*b+m*S,s[8]=d*g+f*M+m*T,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],a=e[4],c=e[5],l=e[6],h=e[7],o=e[8];return t*a*o-t*c*h-n*s*o+n*c*l+i*s*h-i*a*l}invert(){let e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],a=e[4],c=e[5],l=e[6],h=e[7],o=e[8],u=o*a-c*h,d=c*l-o*s,f=h*s-a*l,m=t*u+n*d+i*f;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);let x=1/m;return e[0]=u*x,e[1]=(i*h-o*n)*x,e[2]=(c*n-i*a)*x,e[3]=d*x,e[4]=(o*t-i*l)*x,e[5]=(i*s-c*t)*x,e[6]=f*x,e[7]=(n*l-h*t)*x,e[8]=(a*t-n*s)*x,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,i,s,a,c){let l=Math.cos(s),h=Math.sin(s);return this.set(n*l,n*h,-n*(l*a+h*c)+a+e,-i*h,i*l,-i*(-h*a+l*c)+c+t,0,0,1),this}scale(e,t){return ss("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(nl.makeScale(e,t)),this}rotate(e){return ss("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(nl.makeRotation(-e)),this}translate(e,t){return ss("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(nl.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let i=0;i<9;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},nl=new Ye,Ru=new Ye().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Cu=new Ye().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Np(){let r={enabled:!0,workingColorSpace:sn,spaces:{},convert:function(i,s,a){return this.enabled===!1||s===a||!s||!a||(this.spaces[s].transfer===gt&&(i.r=yi(i.r),i.g=yi(i.g),i.b=yi(i.b)),this.spaces[s].primaries!==this.spaces[a].primaries&&(i.applyMatrix3(this.spaces[s].toXYZ),i.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===gt&&(i.r=Gs(i.r),i.g=Gs(i.g),i.b=Gs(i.b))),i},workingToColorSpace:function(i,s){return this.convert(i,this.workingColorSpace,s)},colorSpaceToWorking:function(i,s){return this.convert(i,s,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===Ti?Or:this.spaces[i].transfer},getToneMappingMode:function(i){return this.spaces[i].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(i,s=this.workingColorSpace){return i.fromArray(this.spaces[s].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,s,a){return i.copy(this.spaces[s].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(i,s){return ss("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),r.workingToColorSpace(i,s)},toWorkingColorSpace:function(i,s){return ss("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),r.colorSpaceToWorking(i,s)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return r.define({[sn]:{primaries:e,whitePoint:n,transfer:Or,toXYZ:Ru,fromXYZ:Cu,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:_t},outputColorSpaceConfig:{drawingBufferColorSpace:_t}},[_t]:{primaries:e,whitePoint:n,transfer:gt,toXYZ:Ru,fromXYZ:Cu,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:_t}}}),r}var Qe=Np();function yi(r){return r<.04045?r*.0773993808:Math.pow(r*.9478672986+.0521327014,2.4)}function Gs(r){return r<.0031308?r*12.92:1.055*Math.pow(r,.41666)-.055}var Ss,vo=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Ss===void 0&&(Ss=qs("canvas")),Ss.width=e.width,Ss.height=e.height;let i=Ss.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),n=Ss}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=qs("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let i=n.getImageData(0,0,e.width,e.height),s=i.data;for(let a=0;a<s.length;a++)s[a]=yi(s[a]/255)*255;return n.putImageData(i,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(yi(t[n]/255)*255):t[n]=yi(t[n]);return{data:t,width:e.width,height:e.height}}else return Le("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},Dp=0,Zs=class{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:Dp++}),this.uuid=Rn(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let s;if(Array.isArray(i)){s=[];for(let a=0,c=i.length;a<c;a++)i[a].isDataTexture?s.push(il(i[a].image)):s.push(il(i[a]))}else s=il(i);n.url=s}return t||(e.images[this.uuid]=n),n}};function il(r){return typeof HTMLImageElement<"u"&&r instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&r instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&r instanceof ImageBitmap?vo.getDataURL(r):r.data?{data:Array.from(r.data),width:r.width,height:r.height,type:r.data.constructor.name}:(Le("Texture: Unable to serialize Texture."),{})}var zp=0,sl=new L,Wt=class r extends Hn{constructor(e=r.DEFAULT_IMAGE,t=r.DEFAULT_MAPPING,n=An,i=An,s=zt,a=Xn,c=bn,l=mn,h=r.DEFAULT_ANISOTROPY,o=Ti){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:zp++}),this.uuid=Rn(),this.name="",this.source=new Zs(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=s,this.minFilter=a,this.anisotropy=h,this.format=c,this.internalFormat=null,this.type=l,this.offset=new ae(0,0),this.repeat=new ae(1,1),this.center=new ae(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ye,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=o,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(sl).x}get height(){return this.source.getSize(sl).y}get depth(){return this.source.getSize(sl).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){Le(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let i=this[t];if(i===void 0){Le(`Texture.setValues(): property '${t}' does not exist.`);continue}i&&n&&i.isVector2&&n.isVector2||i&&n&&i.isVector3&&n.isVector3||i&&n&&i.isMatrix3&&n.isMatrix3?i.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==th)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case cn:e.x=e.x-Math.floor(e.x);break;case An:e.x=e.x<0?0:1;break;case Ws:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case cn:e.y=e.y-Math.floor(e.y);break;case An:e.y=e.y<0?0:1;break;case Ws:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};Wt.DEFAULT_IMAGE=null;Wt.DEFAULT_MAPPING=th;Wt.DEFAULT_ANISOTROPY=1;var vt=class r{static{r.prototype.isVector4=!0}constructor(e=0,t=0,n=0,i=1){this.x=e,this.y=t,this.z=n,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,i){return this.x=e,this.y=t,this.z=n,this.w=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,i=this.z,s=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*i+a[12]*s,this.y=a[1]*t+a[5]*n+a[9]*i+a[13]*s,this.z=a[2]*t+a[6]*n+a[10]*i+a[14]*s,this.w=a[3]*t+a[7]*n+a[11]*i+a[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,i,s,l=e.elements,h=l[0],o=l[4],u=l[8],d=l[1],f=l[5],m=l[9],x=l[2],p=l[6],g=l[10];if(Math.abs(o-d)<.01&&Math.abs(u-x)<.01&&Math.abs(m-p)<.01){if(Math.abs(o+d)<.1&&Math.abs(u+x)<.1&&Math.abs(m+p)<.1&&Math.abs(h+f+g-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let b=(h+1)/2,M=(f+1)/2,w=(g+1)/2,S=(o+d)/4,T=(u+x)/4,_=(m+p)/4;return b>M&&b>w?b<.01?(n=0,i=.707106781,s=.707106781):(n=Math.sqrt(b),i=S/n,s=T/n):M>w?M<.01?(n=.707106781,i=0,s=.707106781):(i=Math.sqrt(M),n=S/i,s=_/i):w<.01?(n=.707106781,i=.707106781,s=0):(s=Math.sqrt(w),n=T/s,i=_/s),this.set(n,i,s,t),this}let y=Math.sqrt((p-m)*(p-m)+(u-x)*(u-x)+(d-o)*(d-o));return Math.abs(y)<.001&&(y=1),this.x=(p-m)/y,this.y=(u-x)/y,this.z=(d-o)/y,this.w=Math.acos((h+f+g-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=et(this.x,e.x,t.x),this.y=et(this.y,e.y,t.y),this.z=et(this.z,e.z,t.z),this.w=et(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=et(this.x,e,t),this.y=et(this.y,e,t),this.z=et(this.z,e,t),this.w=et(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(et(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Mo=class extends Hn{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:zt,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new vt(0,0,e,t),this.scissorTest=!1,this.viewport=new vt(0,0,e,t),this.textures=[];let i={width:e,height:t,depth:n.depth},s=new Wt(i),a=n.count;for(let c=0;c<a;c++)this.textures[c]=s.clone(),this.textures[c].isRenderTargetTexture=!0,this.textures[c].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:zt,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let i=0,s=this.textures.length;i<s;i++)this.textures[i].image.width=e,this.textures[i].image.height=t,this.textures[i].image.depth=n,this.textures[i].isData3DTexture!==!0&&(this.textures[i].isArrayTexture=this.textures[i].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let i=Object.assign({},e.textures[t].image);this.textures[t].source=new Zs(i)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){let t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}},ln=class extends Mo{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},kr=class extends Wt{constructor(e=null,t=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=Dt,this.minFilter=Dt,this.wrapR=An,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var bo=class extends Wt{constructor(e=null,t=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=Dt,this.minFilter=Dt,this.wrapR=An,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}};var Fe=class r{static{r.prototype.isMatrix4=!0}constructor(e,t,n,i,s,a,c,l,h,o,u,d,f,m,x,p){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,i,s,a,c,l,h,o,u,d,f,m,x,p)}set(e,t,n,i,s,a,c,l,h,o,u,d,f,m,x,p){let g=this.elements;return g[0]=e,g[4]=t,g[8]=n,g[12]=i,g[1]=s,g[5]=a,g[9]=c,g[13]=l,g[2]=h,g[6]=o,g[10]=u,g[14]=d,g[3]=f,g[7]=m,g[11]=x,g[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new r().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,n=e.elements,i=1/Ts.setFromMatrixColumn(e,0).length(),s=1/Ts.setFromMatrixColumn(e,1).length(),a=1/Ts.setFromMatrixColumn(e,2).length();return t[0]=n[0]*i,t[1]=n[1]*i,t[2]=n[2]*i,t[3]=0,t[4]=n[4]*s,t[5]=n[5]*s,t[6]=n[6]*s,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,i=e.y,s=e.z,a=Math.cos(n),c=Math.sin(n),l=Math.cos(i),h=Math.sin(i),o=Math.cos(s),u=Math.sin(s);if(e.order==="XYZ"){let d=a*o,f=a*u,m=c*o,x=c*u;t[0]=l*o,t[4]=-l*u,t[8]=h,t[1]=f+m*h,t[5]=d-x*h,t[9]=-c*l,t[2]=x-d*h,t[6]=m+f*h,t[10]=a*l}else if(e.order==="YXZ"){let d=l*o,f=l*u,m=h*o,x=h*u;t[0]=d+x*c,t[4]=m*c-f,t[8]=a*h,t[1]=a*u,t[5]=a*o,t[9]=-c,t[2]=f*c-m,t[6]=x+d*c,t[10]=a*l}else if(e.order==="ZXY"){let d=l*o,f=l*u,m=h*o,x=h*u;t[0]=d-x*c,t[4]=-a*u,t[8]=m+f*c,t[1]=f+m*c,t[5]=a*o,t[9]=x-d*c,t[2]=-a*h,t[6]=c,t[10]=a*l}else if(e.order==="ZYX"){let d=a*o,f=a*u,m=c*o,x=c*u;t[0]=l*o,t[4]=m*h-f,t[8]=d*h+x,t[1]=l*u,t[5]=x*h+d,t[9]=f*h-m,t[2]=-h,t[6]=c*l,t[10]=a*l}else if(e.order==="YZX"){let d=a*l,f=a*h,m=c*l,x=c*h;t[0]=l*o,t[4]=x-d*u,t[8]=m*u+f,t[1]=u,t[5]=a*o,t[9]=-c*o,t[2]=-h*o,t[6]=f*u+m,t[10]=d-x*u}else if(e.order==="XZY"){let d=a*l,f=a*h,m=c*l,x=c*h;t[0]=l*o,t[4]=-u,t[8]=h*o,t[1]=d*u+x,t[5]=a*o,t[9]=f*u-m,t[2]=m*u-f,t[6]=c*o,t[10]=x*u+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Up,e,Fp)}lookAt(e,t,n){let i=this.elements;return xn.subVectors(e,t),xn.lengthSq()===0&&(xn.z=1),xn.normalize(),Ii.crossVectors(n,xn),Ii.lengthSq()===0&&(Math.abs(n.z)===1?xn.x+=1e-4:xn.z+=1e-4,xn.normalize(),Ii.crossVectors(n,xn)),Ii.normalize(),Na.crossVectors(xn,Ii),i[0]=Ii.x,i[4]=Na.x,i[8]=xn.x,i[1]=Ii.y,i[5]=Na.y,i[9]=xn.y,i[2]=Ii.z,i[6]=Na.z,i[10]=xn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,i=t.elements,s=this.elements,a=n[0],c=n[4],l=n[8],h=n[12],o=n[1],u=n[5],d=n[9],f=n[13],m=n[2],x=n[6],p=n[10],g=n[14],y=n[3],b=n[7],M=n[11],w=n[15],S=i[0],T=i[4],_=i[8],v=i[12],R=i[1],C=i[5],I=i[9],z=i[13],N=i[2],F=i[6],D=i[10],B=i[14],X=i[3],k=i[7],Y=i[11],$=i[15];return s[0]=a*S+c*R+l*N+h*X,s[4]=a*T+c*C+l*F+h*k,s[8]=a*_+c*I+l*D+h*Y,s[12]=a*v+c*z+l*B+h*$,s[1]=o*S+u*R+d*N+f*X,s[5]=o*T+u*C+d*F+f*k,s[9]=o*_+u*I+d*D+f*Y,s[13]=o*v+u*z+d*B+f*$,s[2]=m*S+x*R+p*N+g*X,s[6]=m*T+x*C+p*F+g*k,s[10]=m*_+x*I+p*D+g*Y,s[14]=m*v+x*z+p*B+g*$,s[3]=y*S+b*R+M*N+w*X,s[7]=y*T+b*C+M*F+w*k,s[11]=y*_+b*I+M*D+w*Y,s[15]=y*v+b*z+M*B+w*$,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],i=e[8],s=e[12],a=e[1],c=e[5],l=e[9],h=e[13],o=e[2],u=e[6],d=e[10],f=e[14],m=e[3],x=e[7],p=e[11],g=e[15],y=l*f-h*d,b=c*f-h*u,M=c*d-l*u,w=a*f-h*o,S=a*d-l*o,T=a*u-c*o;return t*(x*y-p*b+g*M)-n*(m*y-p*w+g*S)+i*(m*b-x*w+g*T)-s*(m*M-x*S+p*T)}determinantAffine(){let e=this.elements,t=e[0],n=e[4],i=e[8],s=e[1],a=e[5],c=e[9],l=e[2],h=e[6],o=e[10];return t*(a*o-c*h)-n*(s*o-c*l)+i*(s*h-a*l)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let i=this.elements;return e.isVector3?(i[12]=e.x,i[13]=e.y,i[14]=e.z):(i[12]=e,i[13]=t,i[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],a=e[4],c=e[5],l=e[6],h=e[7],o=e[8],u=e[9],d=e[10],f=e[11],m=e[12],x=e[13],p=e[14],g=e[15],y=t*c-n*a,b=t*l-i*a,M=t*h-s*a,w=n*l-i*c,S=n*h-s*c,T=i*h-s*l,_=o*x-u*m,v=o*p-d*m,R=o*g-f*m,C=u*p-d*x,I=u*g-f*x,z=d*g-f*p,N=y*z-b*I+M*C+w*R-S*v+T*_;if(N===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let F=1/N;return e[0]=(c*z-l*I+h*C)*F,e[1]=(i*I-n*z-s*C)*F,e[2]=(x*T-p*S+g*w)*F,e[3]=(d*S-u*T-f*w)*F,e[4]=(l*R-a*z-h*v)*F,e[5]=(t*z-i*R+s*v)*F,e[6]=(p*M-m*T-g*b)*F,e[7]=(o*T-d*M+f*b)*F,e[8]=(a*I-c*R+h*_)*F,e[9]=(n*R-t*I-s*_)*F,e[10]=(m*S-x*M+g*y)*F,e[11]=(u*M-o*S-f*y)*F,e[12]=(c*v-a*C-l*_)*F,e[13]=(t*C-n*v+i*_)*F,e[14]=(x*b-m*w-p*y)*F,e[15]=(o*w-u*b+d*y)*F,this}scale(e){let t=this.elements,n=e.x,i=e.y,s=e.z;return t[0]*=n,t[4]*=i,t[8]*=s,t[1]*=n,t[5]*=i,t[9]*=s,t[2]*=n,t[6]*=i,t[10]*=s,t[3]*=n,t[7]*=i,t[11]*=s,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],i=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,i))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),i=Math.sin(t),s=1-n,a=e.x,c=e.y,l=e.z,h=s*a,o=s*c;return this.set(h*a+n,h*c-i*l,h*l+i*c,0,h*c+i*l,o*c+n,o*l-i*a,0,h*l-i*c,o*l+i*a,s*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,i,s,a){return this.set(1,n,s,0,e,1,a,0,t,i,1,0,0,0,0,1),this}compose(e,t,n){let i=this.elements,s=t._x,a=t._y,c=t._z,l=t._w,h=s+s,o=a+a,u=c+c,d=s*h,f=s*o,m=s*u,x=a*o,p=a*u,g=c*u,y=l*h,b=l*o,M=l*u,w=n.x,S=n.y,T=n.z;return i[0]=(1-(x+g))*w,i[1]=(f+M)*w,i[2]=(m-b)*w,i[3]=0,i[4]=(f-M)*S,i[5]=(1-(d+g))*S,i[6]=(p+y)*S,i[7]=0,i[8]=(m+b)*T,i[9]=(p-y)*T,i[10]=(1-(d+x))*T,i[11]=0,i[12]=e.x,i[13]=e.y,i[14]=e.z,i[15]=1,this}decompose(e,t,n){let i=this.elements;e.x=i[12],e.y=i[13],e.z=i[14];let s=this.determinantAffine();if(s===0)return n.set(1,1,1),t.identity(),this;let a=Ts.set(i[0],i[1],i[2]).length(),c=Ts.set(i[4],i[5],i[6]).length(),l=Ts.set(i[8],i[9],i[10]).length();s<0&&(a=-a),Dn.copy(this);let h=1/a,o=1/c,u=1/l;return Dn.elements[0]*=h,Dn.elements[1]*=h,Dn.elements[2]*=h,Dn.elements[4]*=o,Dn.elements[5]*=o,Dn.elements[6]*=o,Dn.elements[8]*=u,Dn.elements[9]*=u,Dn.elements[10]*=u,t.setFromRotationMatrix(Dn),n.x=a,n.y=c,n.z=l,this}makePerspective(e,t,n,i,s,a,c=On,l=!1){let h=this.elements,o=2*s/(t-e),u=2*s/(n-i),d=(t+e)/(t-e),f=(n+i)/(n-i),m,x;if(l)m=s/(a-s),x=a*s/(a-s);else if(c===On)m=-(a+s)/(a-s),x=-2*a*s/(a-s);else if(c===Xs)m=-a/(a-s),x=-a*s/(a-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+c);return h[0]=o,h[4]=0,h[8]=d,h[12]=0,h[1]=0,h[5]=u,h[9]=f,h[13]=0,h[2]=0,h[6]=0,h[10]=m,h[14]=x,h[3]=0,h[7]=0,h[11]=-1,h[15]=0,this}makeOrthographic(e,t,n,i,s,a,c=On,l=!1){let h=this.elements,o=2/(t-e),u=2/(n-i),d=-(t+e)/(t-e),f=-(n+i)/(n-i),m,x;if(l)m=1/(a-s),x=a/(a-s);else if(c===On)m=-2/(a-s),x=-(a+s)/(a-s);else if(c===Xs)m=-1/(a-s),x=-s/(a-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+c);return h[0]=o,h[4]=0,h[8]=0,h[12]=d,h[1]=0,h[5]=u,h[9]=0,h[13]=f,h[2]=0,h[6]=0,h[10]=m,h[14]=x,h[3]=0,h[7]=0,h[11]=0,h[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let i=0;i<16;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},Ts=new L,Dn=new Fe,Up=new L(0,0,0),Fp=new L(1,1,1),Ii=new L,Na=new L,xn=new L,Iu=new Fe,Pu=new Pt,hn=class r{constructor(e=0,t=0,n=0,i=r.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,i=this._order){return this._x=e,this._y=t,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let i=e.elements,s=i[0],a=i[4],c=i[8],l=i[1],h=i[5],o=i[9],u=i[2],d=i[6],f=i[10];switch(t){case"XYZ":this._y=Math.asin(et(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-o,f),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(d,h),this._z=0);break;case"YXZ":this._x=Math.asin(-et(o,-1,1)),Math.abs(o)<.9999999?(this._y=Math.atan2(c,f),this._z=Math.atan2(l,h)):(this._y=Math.atan2(-u,s),this._z=0);break;case"ZXY":this._x=Math.asin(et(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,h)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-et(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-a,h));break;case"YZX":this._z=Math.asin(et(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-o,h),this._y=Math.atan2(-u,s)):(this._x=0,this._y=Math.atan2(c,f));break;case"XZY":this._z=Math.asin(-et(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,h),this._y=Math.atan2(c,s)):(this._x=Math.atan2(-o,f),this._y=0);break;default:Le("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Iu.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Iu,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Pu.setFromEuler(this),this.setFromQuaternion(Pu,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};hn.DEFAULT_ORDER="XYZ";var Ks=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},Bp=0,Lu=new L,ws=new Pt,ui=new Fe,Da=new L,br=new L,Op=new L,Hp=new Pt,Nu=new L(1,0,0),Du=new L(0,1,0),zu=new L(0,0,1),Uu={type:"added"},kp={type:"removed"},As={type:"childadded",child:null},rl={type:"childremoved",child:null},It=class r extends Hn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Bp++}),this.uuid=Rn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=r.DEFAULT_UP.clone();let e=new L,t=new hn,n=new Pt,i=new L(1,1,1);function s(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(s),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new Fe},normalMatrix:{value:new Ye}}),this.matrix=new Fe,this.matrixWorld=new Fe,this.matrixAutoUpdate=r.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=r.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Ks,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return ws.setFromAxisAngle(e,t),this.quaternion.multiply(ws),this}rotateOnWorldAxis(e,t){return ws.setFromAxisAngle(e,t),this.quaternion.premultiply(ws),this}rotateX(e){return this.rotateOnAxis(Nu,e)}rotateY(e){return this.rotateOnAxis(Du,e)}rotateZ(e){return this.rotateOnAxis(zu,e)}translateOnAxis(e,t){return Lu.copy(e).applyQuaternion(this.quaternion),this.position.add(Lu.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Nu,e)}translateY(e){return this.translateOnAxis(Du,e)}translateZ(e){return this.translateOnAxis(zu,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(ui.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Da.copy(e):Da.set(e,t,n);let i=this.parent;this.updateWorldMatrix(!0,!1),br.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?ui.lookAt(br,Da,this.up):ui.lookAt(Da,br,this.up),this.quaternion.setFromRotationMatrix(ui),i&&(ui.extractRotation(i.matrixWorld),ws.setFromRotationMatrix(ui),this.quaternion.premultiply(ws.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(He("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Uu),As.child=e,this.dispatchEvent(As),As.child=null):He("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(kp),rl.child=e,this.dispatchEvent(rl),rl.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),ui.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),ui.multiply(e.parent.matrixWorld)),e.applyMatrix4(ui),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Uu),As.child=e,this.dispatchEvent(As),As.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,i=this.children.length;n<i;n++){let a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let i=this.children;for(let s=0,a=i.length;s<a;s++)i[s].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(br,e,Op),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(br,Hp,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);let t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,n=e.y,i=e.z,s=this.matrix.elements;s[12]+=t-s[0]*t-s[4]*n-s[8]*i,s[13]+=n-s[1]*t-s[5]*n-s[9]*i,s[14]+=i-s[2]*t-s[6]*n-s[10]*i}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){let i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){let s=this.children;for(let a=0,c=s.length;a<c;a++)s[a].updateWorldMatrix(!1,!0,n)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let i={};i.uuid=this.uuid,i.type=this.type,i.name=this.name,i.castShadow=this.castShadow,i.receiveShadow=this.receiveShadow,i.visible=this.visible,i.frustumCulled=this.frustumCulled,i.renderOrder=this.renderOrder,i.static=this.static,i.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.pivot!==null&&(i.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(i.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(i.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.geometryInfo=this._geometryInfo.map(c=>({...c,boundingBox:c.boundingBox?c.boundingBox.toJSON():void 0,boundingSphere:c.boundingSphere?c.boundingSphere.toJSON():void 0})),i.instanceInfo=this._instanceInfo.map(c=>({...c})),i.availableInstanceIds=this._availableInstanceIds.slice(),i.availableGeometryIds=this._availableGeometryIds.slice(),i.nextIndexStart=this._nextIndexStart,i.nextVertexStart=this._nextVertexStart,i.geometryCount=this._geometryCount,i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.matricesTexture=this._matricesTexture.toJSON(e),i.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(i.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(i.boundingBox=this.boundingBox.toJSON()));function s(c,l){return c[l.uuid]===void 0&&(c[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=s(e.geometries,this.geometry);let c=this.geometry.parameters;if(c!==void 0&&c.shapes!==void 0){let l=c.shapes;if(Array.isArray(l))for(let h=0,o=l.length;h<o;h++){let u=l[h];s(e.shapes,u)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let c=[];for(let l=0,h=this.material.length;l<h;l++)c.push(s(e.materials,this.material[l]));i.material=c}else i.material=s(e.materials,this.material);if(this.children.length>0){i.children=[];for(let c=0;c<this.children.length;c++)i.children.push(this.children[c].toJSON(e).object)}if(this.animations.length>0){i.animations=[];for(let c=0;c<this.animations.length;c++){let l=this.animations[c];i.animations.push(s(e.animations,l))}}if(t){let c=a(e.geometries),l=a(e.materials),h=a(e.textures),o=a(e.images),u=a(e.shapes),d=a(e.skeletons),f=a(e.animations),m=a(e.nodes);c.length>0&&(n.geometries=c),l.length>0&&(n.materials=l),h.length>0&&(n.textures=h),o.length>0&&(n.images=o),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),m.length>0&&(n.nodes=m)}return n.object=i,n;function a(c){let l=[];for(let h in c){let o=c[h];delete o.metadata,l.push(o)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let i=e.children[n];this.add(i.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}};It.DEFAULT_UP=new L(0,1,0);It.DEFAULT_MATRIX_AUTO_UPDATE=!0;It.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var qe=class extends It{constructor(){super(),this.isGroup=!0,this.type="Group"}},Gp={type:"move"},$s=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new qe,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new qe,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new L,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new L),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new qe,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new L,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new L,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let i=null,s=null,a=null,c=this._targetRay,l=this._grip,h=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(h&&e.hand){a=!0;for(let x of e.hand.values()){let p=t.getJointPose(x,n),g=this._getHandJoint(h,x);p!==null&&(g.matrix.fromArray(p.transform.matrix),g.matrix.decompose(g.position,g.rotation,g.scale),g.matrixWorldNeedsUpdate=!0,g.jointRadius=p.radius),g.visible=p!==null}let o=h.joints["index-finger-tip"],u=h.joints["thumb-tip"],d=o.position.distanceTo(u.position),f=.02,m=.005;h.inputState.pinching&&d>f+m?(h.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!h.inputState.pinching&&d<=f-m&&(h.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,n),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:e,target:this})));c!==null&&(i=t.getPose(e.targetRaySpace,n),i===null&&s!==null&&(i=s),i!==null&&(c.matrix.fromArray(i.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,i.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(i.linearVelocity)):c.hasLinearVelocity=!1,i.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(i.angularVelocity)):c.hasAngularVelocity=!1,this.dispatchEvent(Gp)))}return c!==null&&(c.visible=i!==null),l!==null&&(l.visible=s!==null),h!==null&&(h.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new qe;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},nf={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Pi={h:0,s:0,l:0},za={h:0,s:0,l:0};function al(r,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?r+(e-r)*6*t:t<1/2?e:t<2/3?r+(e-r)*6*(2/3-t):r}var Ae=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let i=e;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=_t){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Qe.colorSpaceToWorking(this,t),this}setRGB(e,t,n,i=Qe.workingColorSpace){return this.r=e,this.g=t,this.b=n,Qe.colorSpaceToWorking(this,i),this}setHSL(e,t,n,i=Qe.workingColorSpace){if(e=uh(e,1),t=et(t,0,1),n=et(n,0,1),t===0)this.r=this.g=this.b=n;else{let s=n<=.5?n*(1+t):n+t-n*t,a=2*n-s;this.r=al(a,s,e+1/3),this.g=al(a,s,e),this.b=al(a,s,e-1/3)}return Qe.colorSpaceToWorking(this,i),this}setStyle(e,t=_t){function n(s){s!==void 0&&parseFloat(s)<1&&Le("Color: Alpha component of "+e+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(e)){let s,a=i[1],c=i[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(c))return n(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(c))return n(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(c))return n(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:Le("Color: Unknown color model "+e)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(e)){let s=i[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(s,16),t);Le("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=_t){let n=nf[e.toLowerCase()];return n!==void 0?this.setHex(n,t):Le("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=yi(e.r),this.g=yi(e.g),this.b=yi(e.b),this}copyLinearToSRGB(e){return this.r=Gs(e.r),this.g=Gs(e.g),this.b=Gs(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=_t){return Qe.workingToColorSpace(Qt.copy(this),e),Math.round(et(Qt.r*255,0,255))*65536+Math.round(et(Qt.g*255,0,255))*256+Math.round(et(Qt.b*255,0,255))}getHexString(e=_t){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Qe.workingColorSpace){Qe.workingToColorSpace(Qt.copy(this),t);let n=Qt.r,i=Qt.g,s=Qt.b,a=Math.max(n,i,s),c=Math.min(n,i,s),l,h,o=(c+a)/2;if(c===a)l=0,h=0;else{let u=a-c;switch(h=o<=.5?u/(a+c):u/(2-a-c),a){case n:l=(i-s)/u+(i<s?6:0);break;case i:l=(s-n)/u+2;break;case s:l=(n-i)/u+4;break}l/=6}return e.h=l,e.s=h,e.l=o,e}getRGB(e,t=Qe.workingColorSpace){return Qe.workingToColorSpace(Qt.copy(this),t),e.r=Qt.r,e.g=Qt.g,e.b=Qt.b,e}getStyle(e=_t){Qe.workingToColorSpace(Qt.copy(this),e);let t=Qt.r,n=Qt.g,i=Qt.b;return e!==_t?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(e,t,n){return this.getHSL(Pi),this.setHSL(Pi.h+e,Pi.s+t,Pi.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Pi),e.getHSL(za);let n=zr(Pi.h,za.h,t),i=zr(Pi.s,za.s,t),s=zr(Pi.l,za.l,t);return this.setHSL(n,i,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,i=this.b,s=e.elements;return this.r=s[0]*t+s[3]*n+s[6]*i,this.g=s[1]*t+s[4]*n+s[7]*i,this.b=s[2]*t+s[5]*n+s[8]*i,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Qt=new Ae;Ae.NAMES=nf;var Ui=class r{constructor(e,t=1,n=1e3){this.isFog=!0,this.name="",this.color=new Ae(e),this.near=t,this.far=n}clone(){return new r(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},Gr=class extends It{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new hn,this.environmentIntensity=1,this.environmentRotation=new hn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}},zn=new L,di=new L,ol=new L,fi=new L,Rs=new L,Cs=new L,Fu=new L,cl=new L,ll=new L,hl=new L,ul=new vt,dl=new vt,fl=new vt,xi=class r{constructor(e=new L,t=new L,n=new L){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,i){i.subVectors(n,t),zn.subVectors(e,t),i.cross(zn);let s=i.lengthSq();return s>0?i.multiplyScalar(1/Math.sqrt(s)):i.set(0,0,0)}static getBarycoord(e,t,n,i,s){zn.subVectors(i,t),di.subVectors(n,t),ol.subVectors(e,t);let a=zn.dot(zn),c=zn.dot(di),l=zn.dot(ol),h=di.dot(di),o=di.dot(ol),u=a*h-c*c;if(u===0)return s.set(0,0,0),null;let d=1/u,f=(h*l-c*o)*d,m=(a*o-c*l)*d;return s.set(1-f-m,m,f)}static containsPoint(e,t,n,i){return this.getBarycoord(e,t,n,i,fi)===null?!1:fi.x>=0&&fi.y>=0&&fi.x+fi.y<=1}static getInterpolation(e,t,n,i,s,a,c,l){return this.getBarycoord(e,t,n,i,fi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,fi.x),l.addScaledVector(a,fi.y),l.addScaledVector(c,fi.z),l)}static getInterpolatedAttribute(e,t,n,i,s,a){return ul.setScalar(0),dl.setScalar(0),fl.setScalar(0),ul.fromBufferAttribute(e,t),dl.fromBufferAttribute(e,n),fl.fromBufferAttribute(e,i),a.setScalar(0),a.addScaledVector(ul,s.x),a.addScaledVector(dl,s.y),a.addScaledVector(fl,s.z),a}static isFrontFacing(e,t,n,i){return zn.subVectors(n,t),di.subVectors(e,t),zn.cross(di).dot(i)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,i){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[i]),this}setFromAttributeAndIndices(e,t,n,i){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return zn.subVectors(this.c,this.b),di.subVectors(this.a,this.b),zn.cross(di).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return r.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return r.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,i,s){return r.getInterpolation(e,this.a,this.b,this.c,t,n,i,s)}containsPoint(e){return r.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return r.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,i=this.b,s=this.c,a,c;Rs.subVectors(i,n),Cs.subVectors(s,n),cl.subVectors(e,n);let l=Rs.dot(cl),h=Cs.dot(cl);if(l<=0&&h<=0)return t.copy(n);ll.subVectors(e,i);let o=Rs.dot(ll),u=Cs.dot(ll);if(o>=0&&u<=o)return t.copy(i);let d=l*u-o*h;if(d<=0&&l>=0&&o<=0)return a=l/(l-o),t.copy(n).addScaledVector(Rs,a);hl.subVectors(e,s);let f=Rs.dot(hl),m=Cs.dot(hl);if(m>=0&&f<=m)return t.copy(s);let x=f*h-l*m;if(x<=0&&h>=0&&m<=0)return c=h/(h-m),t.copy(n).addScaledVector(Cs,c);let p=o*m-f*u;if(p<=0&&u-o>=0&&f-m>=0)return Fu.subVectors(s,i),c=(u-o)/(u-o+(f-m)),t.copy(i).addScaledVector(Fu,c);let g=1/(p+x+d);return a=x*g,c=d*g,t.copy(n).addScaledVector(Rs,a).addScaledVector(Cs,c)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},rn=class{constructor(e=new L(1/0,1/0,1/0),t=new L(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Un.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Un.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=Un.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let s=n.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let a=0,c=s.count;a<c;a++)e.isMesh===!0?e.getVertexPosition(a,Un):Un.fromBufferAttribute(s,a),Un.applyMatrix4(e.matrixWorld),this.expandByPoint(Un);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Ua.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Ua.copy(n.boundingBox)),Ua.applyMatrix4(e.matrixWorld),this.union(Ua)}let i=e.children;for(let s=0,a=i.length;s<a;s++)this.expandByObject(i[s],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Un),Un.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Er),Fa.subVectors(this.max,Er),Is.subVectors(e.a,Er),Ps.subVectors(e.b,Er),Ls.subVectors(e.c,Er),Li.subVectors(Ps,Is),Ni.subVectors(Ls,Ps),Ji.subVectors(Is,Ls);let t=[0,-Li.z,Li.y,0,-Ni.z,Ni.y,0,-Ji.z,Ji.y,Li.z,0,-Li.x,Ni.z,0,-Ni.x,Ji.z,0,-Ji.x,-Li.y,Li.x,0,-Ni.y,Ni.x,0,-Ji.y,Ji.x,0];return!pl(t,Is,Ps,Ls,Fa)||(t=[1,0,0,0,1,0,0,0,1],!pl(t,Is,Ps,Ls,Fa))?!1:(Ba.crossVectors(Li,Ni),t=[Ba.x,Ba.y,Ba.z],pl(t,Is,Ps,Ls,Fa))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Un).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Un).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(pi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),pi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),pi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),pi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),pi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),pi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),pi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),pi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(pi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},pi=[new L,new L,new L,new L,new L,new L,new L,new L],Un=new L,Ua=new rn,Is=new L,Ps=new L,Ls=new L,Li=new L,Ni=new L,Ji=new L,Er=new L,Fa=new L,Ba=new L,ji=new L;function pl(r,e,t,n,i){for(let s=0,a=r.length-3;s<=a;s+=3){ji.fromArray(r,s);let c=i.x*Math.abs(ji.x)+i.y*Math.abs(ji.y)+i.z*Math.abs(ji.z),l=e.dot(ji),h=t.dot(ji),o=n.dot(ji);if(Math.max(-Math.max(l,h,o),Math.min(l,h,o))>c)return!1}return!0}var Ht=new L,Oa=new ae,Vp=0,At=class extends Hn{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Vp++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=lh,this.updateRanges=[],this.gpuType=Mn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let i=0,s=this.itemSize;i<s;i++)this.array[e+i]=t.array[n+i];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Oa.fromBufferAttribute(this,t),Oa.applyMatrix3(e),this.setXY(t,Oa.x,Oa.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Ht.fromBufferAttribute(this,t),Ht.applyMatrix3(e),this.setXYZ(t,Ht.x,Ht.y,Ht.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Ht.fromBufferAttribute(this,t),Ht.applyMatrix4(e),this.setXYZ(t,Ht.x,Ht.y,Ht.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Ht.fromBufferAttribute(this,t),Ht.applyNormalMatrix(e),this.setXYZ(t,Ht.x,Ht.y,Ht.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Ht.fromBufferAttribute(this,t),Ht.transformDirection(e),this.setXYZ(t,Ht.x,Ht.y,Ht.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Bn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=yt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Bn(t,this.array)),t}setX(e,t){return this.normalized&&(t=yt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Bn(t,this.array)),t}setY(e,t){return this.normalized&&(t=yt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Bn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=yt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Bn(t,this.array)),t}setW(e,t){return this.normalized&&(t=yt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=yt(t,this.array),n=yt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,i){return e*=this.itemSize,this.normalized&&(t=yt(t,this.array),n=yt(n,this.array),i=yt(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this}setXYZW(e,t,n,i,s){return e*=this.itemSize,this.normalized&&(t=yt(t,this.array),n=yt(n,this.array),i=yt(i,this.array),s=yt(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}};var Vr=class extends At{constructor(e,t,n){super(new Uint16Array(e),t,n)}};var Wr=class extends At{constructor(e,t,n){super(new Uint32Array(e),t,n)}};var Xe=class extends At{constructor(e,t,n){super(new Float32Array(e),t,n)}},Wp=new rn,Sr=new L,ml=new L,un=class{constructor(e=new L,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):Wp.setFromPoints(e).getCenter(n);let i=0;for(let s=0,a=e.length;s<a;s++)i=Math.max(i,n.distanceToSquared(e[s]));return this.radius=Math.sqrt(i),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Sr.subVectors(e,this.center);let t=Sr.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),i=(n-this.radius)*.5;this.center.addScaledVector(Sr,i/n),this.radius+=i}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(ml.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Sr.copy(e.center).add(ml)),this.expandByPoint(Sr.copy(e.center).sub(ml))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},Xp=0,wn=new Fe,gl=new It,Ns=new L,yn=new rn,Tr=new rn,Yt=new L,ot=class r extends Hn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Xp++}),this.uuid=Rn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(mp(e)?Wr:Vr)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let s=new Ye().getNormalMatrix(e);n.applyNormalMatrix(s),n.needsUpdate=!0}let i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(e),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return wn.makeRotationFromQuaternion(e),this.applyMatrix4(wn),this}rotateX(e){return wn.makeRotationX(e),this.applyMatrix4(wn),this}rotateY(e){return wn.makeRotationY(e),this.applyMatrix4(wn),this}rotateZ(e){return wn.makeRotationZ(e),this.applyMatrix4(wn),this}translate(e,t,n){return wn.makeTranslation(e,t,n),this.applyMatrix4(wn),this}scale(e,t,n){return wn.makeScale(e,t,n),this.applyMatrix4(wn),this}lookAt(e){return gl.lookAt(e),gl.updateMatrix(),this.applyMatrix4(gl.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ns).negate(),this.translate(Ns.x,Ns.y,Ns.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let i=0,s=e.length;i<s;i++){let a=e[i];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new Xe(n,3))}else{let n=Math.min(e.length,t.count);for(let i=0;i<n;i++){let s=e[i];t.setXYZ(i,s.x,s.y,s.z||0)}e.length>t.count&&Le("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new rn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){He("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new L(-1/0,-1/0,-1/0),new L(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,i=t.length;n<i;n++){let s=t[n];yn.setFromBufferAttribute(s),this.morphTargetsRelative?(Yt.addVectors(this.boundingBox.min,yn.min),this.boundingBox.expandByPoint(Yt),Yt.addVectors(this.boundingBox.max,yn.max),this.boundingBox.expandByPoint(Yt)):(this.boundingBox.expandByPoint(yn.min),this.boundingBox.expandByPoint(yn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&He('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new un);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){He("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new L,1/0);return}if(e){let n=this.boundingSphere.center;if(yn.setFromBufferAttribute(e),t)for(let s=0,a=t.length;s<a;s++){let c=t[s];Tr.setFromBufferAttribute(c),this.morphTargetsRelative?(Yt.addVectors(yn.min,Tr.min),yn.expandByPoint(Yt),Yt.addVectors(yn.max,Tr.max),yn.expandByPoint(Yt)):(yn.expandByPoint(Tr.min),yn.expandByPoint(Tr.max))}yn.getCenter(n);let i=0;for(let s=0,a=e.count;s<a;s++)Yt.fromBufferAttribute(e,s),i=Math.max(i,n.distanceToSquared(Yt));if(t)for(let s=0,a=t.length;s<a;s++){let c=t[s],l=this.morphTargetsRelative;for(let h=0,o=c.count;h<o;h++)Yt.fromBufferAttribute(c,h),l&&(Ns.fromBufferAttribute(e,h),Yt.add(Ns)),i=Math.max(i,n.distanceToSquared(Yt))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&He('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){He("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.position,i=t.normal,s=t.uv,a=this.getAttribute("tangent");(a===void 0||a.count!==n.count)&&(a=new At(new Float32Array(4*n.count),4),this.setAttribute("tangent",a));let c=[],l=[];for(let _=0;_<n.count;_++)c[_]=new L,l[_]=new L;let h=new L,o=new L,u=new L,d=new ae,f=new ae,m=new ae,x=new L,p=new L;function g(_,v,R){h.fromBufferAttribute(n,_),o.fromBufferAttribute(n,v),u.fromBufferAttribute(n,R),d.fromBufferAttribute(s,_),f.fromBufferAttribute(s,v),m.fromBufferAttribute(s,R),o.sub(h),u.sub(h),f.sub(d),m.sub(d);let C=1/(f.x*m.y-m.x*f.y);isFinite(C)&&(x.copy(o).multiplyScalar(m.y).addScaledVector(u,-f.y).multiplyScalar(C),p.copy(u).multiplyScalar(f.x).addScaledVector(o,-m.x).multiplyScalar(C),c[_].add(x),c[v].add(x),c[R].add(x),l[_].add(p),l[v].add(p),l[R].add(p))}let y=this.groups;y.length===0&&(y=[{start:0,count:e.count}]);for(let _=0,v=y.length;_<v;++_){let R=y[_],C=R.start,I=R.count;for(let z=C,N=C+I;z<N;z+=3)g(e.getX(z+0),e.getX(z+1),e.getX(z+2))}let b=new L,M=new L,w=new L,S=new L;function T(_){w.fromBufferAttribute(i,_),S.copy(w);let v=c[_];b.copy(v),b.sub(w.multiplyScalar(w.dot(v))).normalize(),M.crossVectors(S,v);let C=M.dot(l[_])<0?-1:1;a.setXYZW(_,b.x,b.y,b.z,C)}for(let _=0,v=y.length;_<v;++_){let R=y[_],C=R.start,I=R.count;for(let z=C,N=C+I;z<N;z+=3)T(e.getX(z+0)),T(e.getX(z+1)),T(e.getX(z+2))}this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==t.count)n=new At(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);let i=new L,s=new L,a=new L,c=new L,l=new L,h=new L,o=new L,u=new L;if(e)for(let d=0,f=e.count;d<f;d+=3){let m=e.getX(d+0),x=e.getX(d+1),p=e.getX(d+2);i.fromBufferAttribute(t,m),s.fromBufferAttribute(t,x),a.fromBufferAttribute(t,p),o.subVectors(a,s),u.subVectors(i,s),o.cross(u),c.fromBufferAttribute(n,m),l.fromBufferAttribute(n,x),h.fromBufferAttribute(n,p),c.add(o),l.add(o),h.add(o),n.setXYZ(m,c.x,c.y,c.z),n.setXYZ(x,l.x,l.y,l.z),n.setXYZ(p,h.x,h.y,h.z)}else for(let d=0,f=t.count;d<f;d+=3)i.fromBufferAttribute(t,d+0),s.fromBufferAttribute(t,d+1),a.fromBufferAttribute(t,d+2),o.subVectors(a,s),u.subVectors(i,s),o.cross(u),n.setXYZ(d+0,o.x,o.y,o.z),n.setXYZ(d+1,o.x,o.y,o.z),n.setXYZ(d+2,o.x,o.y,o.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Yt.fromBufferAttribute(e,t),Yt.normalize(),e.setXYZ(t,Yt.x,Yt.y,Yt.z)}toNonIndexed(){function e(c,l){let h=c.array,o=c.itemSize,u=c.normalized,d=new h.constructor(l.length*o),f=0,m=0;for(let x=0,p=l.length;x<p;x++){c.isInterleavedBufferAttribute?f=l[x]*c.data.stride+c.offset:f=l[x]*o;for(let g=0;g<o;g++)d[m++]=h[f++]}return new At(d,o,u)}if(this.index===null)return Le("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new r,n=this.index.array,i=this.attributes;for(let c in i){let l=i[c],h=e(l,n);t.setAttribute(c,h)}let s=this.morphAttributes;for(let c in s){let l=[],h=s[c];for(let o=0,u=h.length;o<u;o++){let d=h[o],f=e(d,n);l.push(f)}t.morphAttributes[c]=l}t.morphTargetsRelative=this.morphTargetsRelative;let a=this.groups;for(let c=0,l=a.length;c<l;c++){let h=a[c];t.addGroup(h.start,h.count,h.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let l=this.parameters;for(let h in l)l[h]!==void 0&&(e[h]=l[h]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let l in n){let h=n[l];e.data.attributes[l]=h.toJSON(e.data)}let i={},s=!1;for(let l in this.morphAttributes){let h=this.morphAttributes[l],o=[];for(let u=0,d=h.length;u<d;u++){let f=h[u];o.push(f.toJSON(e.data))}o.length>0&&(i[l]=o,s=!0)}s&&(e.data.morphAttributes=i,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let c=this.boundingSphere;return c!==null&&(e.data.boundingSphere=c.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let i=e.attributes;for(let h in i){let o=i[h];this.setAttribute(h,o.clone(t))}let s=e.morphAttributes;for(let h in s){let o=[],u=s[h];for(let d=0,f=u.length;d<f;d++)o.push(u[d].clone(t));this.morphAttributes[h]=o}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let h=0,o=a.length;h<o;h++){let u=a[h];this.addGroup(u.start,u.count,u.materialIndex)}let c=e.boundingBox;c!==null&&(this.boundingBox=c.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}},cs=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=lh,this.updateRanges=[],this.version=0,this.uuid=Rn()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let i=0,s=this.stride;i<s;i++)this.array[e+i]=t.array[n+i];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Rn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Rn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer)));let t={uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride};return t.usage=this.usage,t}},nn=new L,Fi=class r{constructor(e,t,n,i=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=i}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)nn.fromBufferAttribute(this,t),nn.applyMatrix4(e),this.setXYZ(t,nn.x,nn.y,nn.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)nn.fromBufferAttribute(this,t),nn.applyNormalMatrix(e),this.setXYZ(t,nn.x,nn.y,nn.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)nn.fromBufferAttribute(this,t),nn.transformDirection(e),this.setXYZ(t,nn.x,nn.y,nn.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=Bn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=yt(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=yt(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=yt(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=yt(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=yt(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=Bn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=Bn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=Bn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=Bn(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=yt(t,this.array),n=yt(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=yt(t,this.array),n=yt(n,this.array),i=yt(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this}setXYZW(e,t,n,i,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=yt(t,this.array),n=yt(n,this.array),i=yt(i,this.array),s=yt(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this.data.array[e+3]=s,this}clone(e){if(e===void 0){Hr("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let i=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[i+s])}return new At(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new r(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){Hr("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let i=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[i+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},xl=new L,qp=new L,Yp=new Ye,Fn=class{constructor(e=new L(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,i){return this.normal.set(e,t,n),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let i=xl.subVectors(n,t).cross(qp.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){let i=e.delta(xl),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let a=-(e.start.dot(this.normal)+this.constant)/s;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(i,a)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||Yp.getNormalMatrix(e),i=this.coplanarPoint(xl).applyMatrix4(e),s=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}},Zp=0,an=class extends Hn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Zp++}),this.uuid=Rn(),this.name="",this.type="Material",this.blending=Xi,this.side=ni,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=ql,this.blendDst=Yl,this.blendEquation=ms,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ae(0,0,0),this.blendAlpha=0,this.depthFunc=Vs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Xd,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ho,this.stencilZFail=ho,this.stencilZPass=ho,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){Le(`Material: parameter '${t}' has value of undefined.`);continue}let i=this[t];if(i===void 0){Le(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector2&&n&&n.isVector2||i&&i.isEuler&&n&&n.isEuler||i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(s=>s.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(s){let a=[];for(let c in s){let l=s[c];delete l.metadata,a.push(l)}return a}if(t){let s=i(e.textures),a=i(e.images);s.length>0&&(n.textures=s),a.length>0&&(n.images=a)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new Ae().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(n=>new Fn().fromJSON(n))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let n=e.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new ae().fromArray(n)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new ae().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let i=t.length;n=new Array(i);for(let s=0;s!==i;++s)n[s]=t[s].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}},Ut=class extends an{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Ae(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},Ds,wr=new L,zs=new L,Us=new L,Fs=new ae,Ar=new ae,sf=new Fe,Ha=new L,Rr=new L,ka=new L,Bu=new ae,yl=new ae,Ou=new ae,Gt=class extends It{constructor(e=new Ut){if(super(),this.isSprite=!0,this.type="Sprite",Ds===void 0){Ds=new ot;let t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new cs(t,5);Ds.setIndex([0,1,2,0,2,3]),Ds.setAttribute("position",new Fi(n,3,0,!1)),Ds.setAttribute("uv",new Fi(n,2,3,!1))}this.geometry=Ds,this.material=e,this.center=new ae(.5,.5),this.count=1}intersectsFrustum(e){return e.intersectsSprite(this)}raycast(e,t){e.camera===null&&He('Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),zs.setFromMatrixScale(this.matrixWorld),sf.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),Us.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&zs.multiplyScalar(-Us.z);let n=this.material.rotation,i,s;n!==0&&(s=Math.cos(n),i=Math.sin(n));let a=this.center;Ga(Ha.set(-.5,-.5,0),Us,a,zs,i,s),Ga(Rr.set(.5,-.5,0),Us,a,zs,i,s),Ga(ka.set(.5,.5,0),Us,a,zs,i,s),Bu.set(0,0),yl.set(1,0),Ou.set(1,1);let c=e.ray.intersectTriangle(Ha,Rr,ka,!1,wr);if(c===null&&(Ga(Rr.set(-.5,.5,0),Us,a,zs,i,s),yl.set(0,1),c=e.ray.intersectTriangle(Ha,ka,Rr,!1,wr),c===null))return;let l=e.ray.origin.distanceTo(wr);l<e.near||l>e.far||t.push({distance:l,point:wr.clone(),uv:xi.getInterpolation(wr,Ha,Rr,ka,Bu,yl,Ou,new ae),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}};function Ga(r,e,t,n,i,s){Fs.subVectors(r,t).addScalar(.5).multiply(n),i!==void 0?(Ar.x=s*Fs.x-i*Fs.y,Ar.y=i*Fs.x+s*Fs.y):Ar.copy(Fs),r.copy(e),r.x+=Ar.x,r.y+=Ar.y,r.applyMatrix4(sf)}var mi=new L,_l=new L,Va=new L,Wa=new L,Bi=class{constructor(e=new L,t=new L(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,mi)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=mi.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(mi.copy(this.origin).addScaledVector(this.direction,t),mi.distanceToSquared(e))}distanceSqToSegment(e,t,n,i){_l.copy(e).add(t).multiplyScalar(.5),Va.copy(t).sub(e).normalize(),Wa.copy(this.origin).sub(_l);let s=e.distanceTo(t)*.5,a=-this.direction.dot(Va),c=Wa.dot(this.direction),l=-Wa.dot(Va),h=Wa.lengthSq(),o=Math.abs(1-a*a),u,d,f,m;if(o>0)if(u=a*l-c,d=a*c-l,m=s*o,u>=0)if(d>=-m)if(d<=m){let x=1/o;u*=x,d*=x,f=u*(u+a*d+2*c)+d*(a*u+d+2*l)+h}else d=s,u=Math.max(0,-(a*d+c)),f=-u*u+d*(d+2*l)+h;else d=-s,u=Math.max(0,-(a*d+c)),f=-u*u+d*(d+2*l)+h;else d<=-m?(u=Math.max(0,-(-a*s+c)),d=u>0?-s:Math.min(Math.max(-s,-l),s),f=-u*u+d*(d+2*l)+h):d<=m?(u=0,d=Math.min(Math.max(-s,-l),s),f=d*(d+2*l)+h):(u=Math.max(0,-(a*s+c)),d=u>0?s:Math.min(Math.max(-s,-l),s),f=-u*u+d*(d+2*l)+h);else d=a>0?-s:s,u=Math.max(0,-(a*d+c)),f=-u*u+d*(d+2*l)+h;return n&&n.copy(this.origin).addScaledVector(this.direction,u),i&&i.copy(_l).addScaledVector(Va,d),f}intersectSphere(e,t){if(e.radius<0)return null;mi.subVectors(e.center,this.origin);let n=mi.dot(this.direction),i=mi.dot(mi)-n*n,s=e.radius*e.radius;if(i>s)return null;let a=Math.sqrt(s-i),c=n-a,l=n+a;return l<0?null:c<0?this.at(l,t):this.at(c,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,i,s,a,c,l,h=1/this.direction.x,o=1/this.direction.y,u=1/this.direction.z,d=this.origin;return h>=0?(n=(e.min.x-d.x)*h,i=(e.max.x-d.x)*h):(n=(e.max.x-d.x)*h,i=(e.min.x-d.x)*h),o>=0?(s=(e.min.y-d.y)*o,a=(e.max.y-d.y)*o):(s=(e.max.y-d.y)*o,a=(e.min.y-d.y)*o),n>a||s>i||((s>n||isNaN(n))&&(n=s),(a<i||isNaN(i))&&(i=a),u>=0?(c=(e.min.z-d.z)*u,l=(e.max.z-d.z)*u):(c=(e.max.z-d.z)*u,l=(e.min.z-d.z)*u),n>l||c>i)||((c>n||n!==n)&&(n=c),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,t)}intersectsBox(e){return this.intersectBox(e,mi)!==null}intersectTriangle(e,t,n,i,s){let a=this.origin,c=this.direction,l=c.x,h=c.y,o=c.z,u=e.x-a.x,d=e.y-a.y,f=e.z-a.z,m=t.x-a.x,x=t.y-a.y,p=t.z-a.z,g=n.x-a.x,y=n.y-a.y,b=n.z-a.z,M=Math.abs(l),w=Math.abs(h),S=Math.abs(o),T,_,v,R,C,I,z,N,F,D,B,X;if(M>=w&&M>=S?(v=l,I=u,F=m,X=g,l>=0?(T=h,_=o,R=d,C=f,z=x,N=p,D=y,B=b):(T=o,_=h,R=f,C=d,z=p,N=x,D=b,B=y)):w>=S?(v=h,I=d,F=x,X=y,h>=0?(T=o,_=l,R=f,C=u,z=p,N=m,D=b,B=g):(T=l,_=o,R=u,C=f,z=m,N=p,D=g,B=b)):(v=o,I=f,F=p,X=b,o>=0?(T=l,_=h,R=u,C=d,z=m,N=x,D=g,B=y):(T=h,_=l,R=d,C=u,z=x,N=m,D=y,B=g)),v===0)return null;let k=T/v,Y=_/v,$=1/v,ye=R-k*I,Me=C-Y*I,ht=z-k*F,it=N-Y*F,ct=D-k*X,Q=B-Y*X,ne=ct*it-Q*ht,_e=ye*Q-Me*ct,Ge=ht*Me-it*ye;if(i){if(ne<0||_e<0||Ge<0)return null}else if((ne<0||_e<0||Ge<0)&&(ne>0||_e>0||Ge>0))return null;let Se=ne+_e+Ge;if(Se===0)return null;let Ve=$*(ne*I+_e*F+Ge*X);return(Se>0?Ve<0:Ve>0)?null:this.at(Ve/Se,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},tt=class extends an{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ae(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new hn,this.combine=Zl,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},Hu=new Fe,Qi=new Bi,Xa=new un,ku=new L,qa=new L,Ya=new L,Za=new L,vl=new L,Ka=new L,Gu=new L,$a=new L,Z=class extends It{constructor(e=new ot,t=new tt){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=i.length;s<a;s++){let c=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[c]=s}}}}getVertexPosition(e,t){let n=this.geometry,i=n.attributes.position,s=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(i,e);let c=this.morphTargetInfluences;if(s&&c){Ka.set(0,0,0);for(let l=0,h=s.length;l<h;l++){let o=c[l],u=s[l];o!==0&&(vl.fromBufferAttribute(u,e),a?Ka.addScaledVector(vl,o):Ka.addScaledVector(vl.sub(t),o))}t.add(Ka)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,i=this.material,s=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Xa.copy(n.boundingSphere),Xa.applyMatrix4(s),Qi.copy(e.ray).recast(e.near),!(Xa.containsPoint(Qi.origin)===!1&&(Qi.intersectSphere(Xa,ku)===null||Qi.origin.distanceToSquared(ku)>(e.far-e.near)**2))&&(Hu.copy(s).invert(),Qi.copy(e.ray).applyMatrix4(Hu),!(n.boundingBox!==null&&Qi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Qi)))}_computeIntersections(e,t,n){let i,s=this.geometry,a=this.material,c=s.index,l=s.attributes.position,h=s.attributes.uv,o=s.attributes.uv1,u=s.attributes.normal,d=s.groups,f=s.drawRange;if(c!==null)if(Array.isArray(a))for(let m=0,x=d.length;m<x;m++){let p=d[m],g=a[p.materialIndex],y=Math.max(p.start,f.start),b=Math.min(c.count,Math.min(p.start+p.count,f.start+f.count));for(let M=y,w=b;M<w;M+=3){let S=c.getX(M),T=c.getX(M+1),_=c.getX(M+2);i=Ja(this,g,e,n,h,o,u,S,T,_),i&&(i.faceIndex=Math.floor(M/3),i.face.materialIndex=p.materialIndex,t.push(i))}}else{let m=Math.max(0,f.start),x=Math.min(c.count,f.start+f.count);for(let p=m,g=x;p<g;p+=3){let y=c.getX(p),b=c.getX(p+1),M=c.getX(p+2);i=Ja(this,a,e,n,h,o,u,y,b,M),i&&(i.faceIndex=Math.floor(p/3),t.push(i))}}else if(l!==void 0)if(Array.isArray(a))for(let m=0,x=d.length;m<x;m++){let p=d[m],g=a[p.materialIndex],y=Math.max(p.start,f.start),b=Math.min(l.count,Math.min(p.start+p.count,f.start+f.count));for(let M=y,w=b;M<w;M+=3){let S=M,T=M+1,_=M+2;i=Ja(this,g,e,n,h,o,u,S,T,_),i&&(i.faceIndex=Math.floor(M/3),i.face.materialIndex=p.materialIndex,t.push(i))}}else{let m=Math.max(0,f.start),x=Math.min(l.count,f.start+f.count);for(let p=m,g=x;p<g;p+=3){let y=p,b=p+1,M=p+2;i=Ja(this,a,e,n,h,o,u,y,b,M),i&&(i.faceIndex=Math.floor(p/3),t.push(i))}}}};function Kp(r,e,t,n,i,s,a,c){let l;if(e.side===on?l=n.intersectTriangle(a,s,i,!0,c):l=n.intersectTriangle(i,s,a,e.side===ni,c),l===null)return null;$a.copy(c),$a.applyMatrix4(r.matrixWorld);let h=t.ray.origin.distanceTo($a);return h<t.near||h>t.far?null:{distance:h,point:$a.clone(),object:r}}function Ja(r,e,t,n,i,s,a,c,l,h){r.getVertexPosition(c,qa),r.getVertexPosition(l,Ya),r.getVertexPosition(h,Za);let o=Kp(r,e,t,n,qa,Ya,Za,Gu);if(o){let u=new L;xi.getBarycoord(Gu,qa,Ya,Za,u),i&&(o.uv=xi.getInterpolatedAttribute(i,c,l,h,u,new ae)),s&&(o.uv1=xi.getInterpolatedAttribute(s,c,l,h,u,new ae)),a&&(o.normal=xi.getInterpolatedAttribute(a,c,l,h,u,new L),o.normal.dot(n.direction)>0&&o.normal.multiplyScalar(-1));let d={a:c,b:l,c:h,normal:new L,materialIndex:0};xi.getNormal(qa,Ya,Za,d.normal),o.face=d,o.barycoord=u}return o}var Cr=new vt,Vu=new vt,Wu=new vt,$p=new vt,Xu=new Fe,ja=new L,Ml=new un,qu=new Fe,bl=new Bi,Xr=class extends Z{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=Cl,this.bindMatrix=new Fe,this.bindMatrixInverse=new Fe,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){let e=this.geometry;this.boundingBox===null&&(this.boundingBox=new rn),this.boundingBox.makeEmpty();let t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,ja),this.boundingBox.expandByPoint(ja)}computeBoundingSphere(){let e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new un),this.boundingSphere.makeEmpty();let t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,ja),this.boundingSphere.expandByPoint(ja)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){let n=this.material,i=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Ml.copy(this.boundingSphere),Ml.applyMatrix4(i),e.ray.intersectsSphere(Ml)!==!1&&(qu.copy(i).invert(),bl.copy(e.ray).applyMatrix4(qu),!(this.boundingBox!==null&&bl.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,bl)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){let e=new vt,t=this.geometry.attributes.skinWeight;for(let n=0,i=t.count;n<i;n++){e.fromBufferAttribute(t,n);let s=1/e.manhattanLength();s!==1/0?e.multiplyScalar(s):e.set(1,0,0,0),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===Cl?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===Hd?this.bindMatrixInverse.copy(this.bindMatrix).invert():Le("SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){let n=this.skeleton,i=this.geometry;Vu.fromBufferAttribute(i.attributes.skinIndex,e),Wu.fromBufferAttribute(i.attributes.skinWeight,e),t.isVector4?(Cr.copy(t),t.set(0,0,0,0)):(Cr.set(...t,1),t.set(0,0,0)),Cr.applyMatrix4(this.bindMatrix);for(let s=0;s<4;s++){let a=Wu.getComponent(s);if(a!==0){let c=Vu.getComponent(s);Xu.multiplyMatrices(n.bones[c].matrixWorld,n.boneInverses[c]),t.addScaledVector($p.copy(Cr).applyMatrix4(Xu),a)}}return t.isVector4&&(t.w=Cr.w),t.applyMatrix4(this.bindMatrixInverse)}},Js=class extends It{constructor(){super(),this.isBone=!0,this.type="Bone"}},js=class extends Wt{constructor(e=null,t=1,n=1,i,s,a,c,l,h=Dt,o=Dt,u,d){super(null,a,c,l,h,o,i,s,u,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},Yu=new Fe,Jp=new Fe,qr=class r{constructor(e=[],t=[]){this.uuid=Rn(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){let e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){Le("Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,i=this.bones.length;n<i;n++)this.boneInverses.push(new Fe)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){let n=new Fe;this.bones[e]&&n.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){let n=this.bones[e];n&&n.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){let n=this.bones[e];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){let e=this.bones,t=this.boneInverses,n=this.boneMatrices,i=this.boneTexture;for(let s=0,a=e.length;s<a;s++){let c=e[s]?e[s].matrixWorld:Jp;Yu.multiplyMatrices(c,t[s]),Yu.toArray(n,s*16)}i!==null&&(i.needsUpdate=!0)}clone(){return new r(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);let t=new Float32Array(e*e*4);t.set(this.boneMatrices);let n=new js(t,e,e,bn,Mn);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){let i=this.bones[t];if(i.name===e)return i}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,i=e.bones.length;n<i;n++){let s=e.bones[n],a=t[s];a===void 0&&(Le("Skeleton: No bone found with UUID:",s),a=new Js),this.bones.push(a),this.boneInverses.push(new Fe().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){let e={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;let t=this.bones,n=this.boneInverses;for(let i=0,s=t.length;i<s;i++){let a=t[i];e.bones.push(a.uuid);let c=n[i];e.boneInverses.push(c.toArray())}return e}},_i=class extends At{constructor(e,t,n,i=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},Bs=new Fe,Zu=new Fe,Qa=[],Ku=new rn,jp=new Fe,Ir=new Z,Pr=new un,Zt=class extends Z{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new _i(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,jp)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new rn),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Bs),Ku.copy(e.boundingBox).applyMatrix4(Bs),this.boundingBox.union(Ku)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new un),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Bs),Pr.copy(e.boundingSphere).applyMatrix4(Bs),this.boundingSphere.union(Pr)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,i=this.morphTexture.source.data.data,s=n.length+1,a=e*s+1;for(let c=0;c<n.length;c++)n[c]=i[a+c]}raycast(e,t){let n=this.matrixWorld,i=this.count;if(Ir.geometry=this.geometry,Ir.material=this.material,Ir.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Pr.copy(this.boundingSphere),Pr.applyMatrix4(n),e.ray.intersectsSphere(Pr)!==!1))for(let s=0;s<i;s++){this.getMatrixAt(s,Bs),Zu.multiplyMatrices(n,Bs),Ir.matrixWorld=Zu,Ir.raycast(e,Qa);for(let a=0,c=Qa.length;a<c;a++){let l=Qa[a];l.instanceId=s,l.object=this,t.push(l)}Qa.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new _i(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){let n=t.morphTargetInfluences,i=n.length+1;this.morphTexture===null&&(this.morphTexture=new js(new Float32Array(i*this.count),i,this.count,$o,Mn));let s=this.morphTexture.source.data.data,a=0;for(let h=0;h<n.length;h++)a+=n[h];let c=this.geometry.morphTargetsRelative?1:1-a,l=i*e;return s[l]=c,s.set(n,l+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},es=new un,Qp=new ae(.5,.5),eo=new L,Qs=class{constructor(e=new Fn,t=new Fn,n=new Fn,i=new Fn,s=new Fn,a=new Fn){this.planes=[e,t,n,i,s,a]}set(e,t,n,i,s,a){let c=this.planes;return c[0].copy(e),c[1].copy(t),c[2].copy(n),c[3].copy(i),c[4].copy(s),c[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=On,n=!1){let i=this.planes,s=e.elements,a=s[0],c=s[1],l=s[2],h=s[3],o=s[4],u=s[5],d=s[6],f=s[7],m=s[8],x=s[9],p=s[10],g=s[11],y=s[12],b=s[13],M=s[14],w=s[15];if(i[0].setComponents(h-a,f-o,g-m,w-y).normalize(),i[1].setComponents(h+a,f+o,g+m,w+y).normalize(),i[2].setComponents(h+c,f+u,g+x,w+b).normalize(),i[3].setComponents(h-c,f-u,g-x,w-b).normalize(),n)i[4].setComponents(l,d,p,M).normalize(),i[5].setComponents(h-l,f-d,g-p,w-M).normalize();else if(i[4].setComponents(h-l,f-d,g-p,w-M).normalize(),t===On)i[5].setComponents(h+l,f+d,g+p,w+M).normalize();else if(t===Xs)i[5].setComponents(l,d,p,M).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),es.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),es.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(es)}intersectsSprite(e){es.center.set(0,0,0);let t=Qp.distanceTo(e.center);return es.radius=.7071067811865476+t,es.applyMatrix4(e.matrixWorld),this.intersectsSphere(es)}intersectsSphere(e){let t=this.planes,n=e.center,i=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(n)<i)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let i=t[n];if(eo.x=i.normal.x>0?e.max.x:e.min.x,eo.y=i.normal.y>0?e.max.y:e.min.y,eo.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint(eo)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var er=class extends an{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Ae(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},Eo=new L,So=new L,$u=new Fe,Lr=new Bi,to=new un,El=new L,Ju=new L,ls=class extends It{constructor(e=new ot,t=new er){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let i=1,s=t.count;i<s;i++)Eo.fromBufferAttribute(t,i-1),So.fromBufferAttribute(t,i),n[i]=n[i-1],n[i]+=Eo.distanceTo(So);e.setAttribute("lineDistance",new Xe(n,1))}else Le("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,i=this.matrixWorld,s=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),to.copy(n.boundingSphere),to.applyMatrix4(i),to.radius+=s,e.ray.intersectsSphere(to)===!1)return;$u.copy(i).invert(),Lr.copy(e.ray).applyMatrix4($u);let c=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=c*c,h=this.isLineSegments?2:1,o=n.index,d=n.attributes.position;if(o!==null){let f=Math.max(0,a.start),m=Math.min(o.count,a.start+a.count);for(let x=f,p=m-1;x<p;x+=h){let g=o.getX(x),y=o.getX(x+1),b=no(this,e,Lr,l,g,y,x);b&&t.push(b)}if(this.isLineLoop){let x=o.getX(m-1),p=o.getX(f),g=no(this,e,Lr,l,x,p,m-1);g&&t.push(g)}}else{let f=Math.max(0,a.start),m=Math.min(d.count,a.start+a.count);for(let x=f,p=m-1;x<p;x+=h){let g=no(this,e,Lr,l,x,x+1,x);g&&t.push(g)}if(this.isLineLoop){let x=no(this,e,Lr,l,m-1,f,m-1);x&&t.push(x)}}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=i.length;s<a;s++){let c=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[c]=s}}}}};function no(r,e,t,n,i,s,a){let c=r.geometry.attributes.position;if(Eo.fromBufferAttribute(c,i),So.fromBufferAttribute(c,s),t.distanceSqToSegment(Eo,So,El,Ju)>n)return;El.applyMatrix4(r.matrixWorld);let h=e.ray.origin.distanceTo(El);if(!(h<e.near||h>e.far))return{distance:h,point:Ju.clone().applyMatrix4(r.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:r}}var ju=new L,Qu=new L,Yr=class extends ls{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[];for(let i=0,s=t.count;i<s;i+=2)ju.fromBufferAttribute(t,i),Qu.fromBufferAttribute(t,i+1),n[i]=i===0?0:n[i-1],n[i+1]=n[i]+ju.distanceTo(Qu);e.setAttribute("lineDistance",new Xe(n,1))}else Le("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}},Zr=class extends ls{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}},Cn=class extends an{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Ae(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},ed=new Fe,Pl=new Bi,io=new un,so=new L,kn=class extends It{constructor(e=new ot,t=new Cn){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,i=this.matrixWorld,s=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),io.copy(n.boundingSphere),io.applyMatrix4(i),io.radius+=s,e.ray.intersectsSphere(io)===!1)return;ed.copy(i).invert(),Pl.copy(e.ray).applyMatrix4(ed);let c=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=c*c,h=n.index,u=n.attributes.position;if(h!==null){let d=Math.max(0,a.start),f=Math.min(h.count,a.start+a.count);for(let m=d,x=f;m<x;m++){let p=h.getX(m);so.fromBufferAttribute(u,p),td(so,p,l,i,e,t,this)}}else{let d=Math.max(0,a.start),f=Math.min(u.count,a.start+a.count);for(let m=d,x=f;m<x;m++)so.fromBufferAttribute(u,m),td(so,m,l,i,e,t,this)}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=i.length;s<a;s++){let c=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[c]=s}}}}};function td(r,e,t,n,i,s,a){let c=Pl.distanceSqToPoint(r);if(c<t){let l=new L;Pl.closestPointToPoint(r,l),l.applyMatrix4(n);let h=i.ray.origin.distanceTo(l);if(h<i.near||h>i.far)return;s.push({distance:h,distanceToRay:Math.sqrt(c),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}var Kr=class extends Wt{constructor(e=[],t=qi,n,i,s,a,c,l,h,o){super(e,t,n,i,s,a,c,l,h,o),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},Ft=class extends Wt{constructor(e,t,n,i,s,a,c,l,h){super(e,t,n,i,s,a,c,l,h),this.isCanvasTexture=!0,this.needsUpdate=!0}};var Oi=class extends Wt{constructor(e,t,n=qn,i,s,a,c=Dt,l=Dt,h,o=jn,u=1){if(o!==jn&&o!==Yi)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let d={width:e,height:t,depth:u};super(d,i,s,a,c,l,o,n,h),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Zs(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}},To=class extends Oi{constructor(e,t=qn,n=qi,i,s,a=Dt,c=Dt,l,h=jn){let o={width:e,height:e,depth:1},u=[o,o,o,o,o,o];super(e,e,t,n,i,s,a,c,l,h),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},$r=class extends Wt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},ke=class r extends ot{constructor(e=1,t=1,n=1,i=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:i,heightSegments:s,depthSegments:a};let c=this;i=Math.floor(i),s=Math.floor(s),a=Math.floor(a);let l=[],h=[],o=[],u=[],d=0,f=0;m("z","y","x",-1,-1,n,t,e,a,s,0),m("z","y","x",1,-1,n,t,-e,a,s,1),m("x","z","y",1,1,e,n,t,i,a,2),m("x","z","y",1,-1,e,n,-t,i,a,3),m("x","y","z",1,-1,e,t,n,i,s,4),m("x","y","z",-1,-1,e,t,-n,i,s,5),this.setIndex(l),this.setAttribute("position",new Xe(h,3)),this.setAttribute("normal",new Xe(o,3)),this.setAttribute("uv",new Xe(u,2));function m(x,p,g,y,b,M,w,S,T,_,v){let R=M/T,C=w/_,I=M/2,z=w/2,N=S/2,F=T+1,D=_+1,B=0,X=0,k=new L;for(let Y=0;Y<D;Y++){let $=Y*C-z;for(let ye=0;ye<F;ye++){let Me=ye*R-I;k[x]=Me*y,k[p]=$*b,k[g]=N,h.push(k.x,k.y,k.z),k[x]=0,k[p]=0,k[g]=S>0?1:-1,o.push(k.x,k.y,k.z),u.push(ye/T),u.push(1-Y/_),B+=1}}for(let Y=0;Y<_;Y++)for(let $=0;$<T;$++){let ye=d+$+F*Y,Me=d+$+F*(Y+1),ht=d+($+1)+F*(Y+1),it=d+($+1)+F*Y;l.push(ye,Me,it),l.push(Me,ht,it),X+=6}c.addGroup(f,X,v),f+=X,d+=B}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};var In=class r extends ot{constructor(e=1,t=32,n=0,i=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:i},t=Math.max(3,t);let s=[],a=[],c=[],l=[],h=new L,o=new ae;a.push(0,0,0),c.push(0,0,1),l.push(.5,.5);for(let u=0,d=3;u<=t;u++,d+=3){let f=n+u/t*i;h.x=e*Math.cos(f),h.y=e*Math.sin(f),a.push(h.x,h.y,h.z),c.push(0,0,1),o.x=(a[d]/e+1)/2,o.y=(a[d+1]/e+1)/2,l.push(o.x,o.y)}for(let u=1;u<=t;u++)s.push(u,u+1,0);this.setIndex(s),this.setAttribute("position",new Xe(a,3)),this.setAttribute("normal",new Xe(c,3)),this.setAttribute("uv",new Xe(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.radius,e.segments,e.thetaStart,e.thetaLength)}},Et=class r extends ot{constructor(e=1,t=1,n=1,i=32,s=1,a=!1,c=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:i,heightSegments:s,openEnded:a,thetaStart:c,thetaLength:l};let h=this;i=Math.floor(i),s=Math.floor(s);let o=[],u=[],d=[],f=[],m=0,x=[],p=n/2,g=0;y(),a===!1&&(e>0&&b(!0),t>0&&b(!1)),this.setIndex(o),this.setAttribute("position",new Xe(u,3)),this.setAttribute("normal",new Xe(d,3)),this.setAttribute("uv",new Xe(f,2));function y(){let M=new L,w=new L,S=0,T=(t-e)/n;for(let _=0;_<=s;_++){let v=[],R=_/s,C=R*(t-e)+e;for(let I=0;I<=i;I++){let z=I/i,N=z*l+c,F=Math.sin(N),D=Math.cos(N);w.x=C*F,w.y=-R*n+p,w.z=C*D,u.push(w.x,w.y,w.z),M.set(F,T,D).normalize(),d.push(M.x,M.y,M.z),f.push(z,1-R),v.push(m++)}x.push(v)}for(let _=0;_<i;_++)for(let v=0;v<s;v++){let R=x[v][_],C=x[v+1][_],I=x[v+1][_+1],z=x[v][_+1];(e>0||v!==0)&&(o.push(R,C,z),S+=3),(t>0||v!==s-1)&&(o.push(C,I,z),S+=3)}h.addGroup(g,S,0),g+=S}function b(M){let w=m,S=new ae,T=new L,_=0,v=M===!0?e:t,R=M===!0?1:-1;for(let I=1;I<=i;I++)u.push(0,p*R,0),d.push(0,R,0),f.push(.5,.5),m++;let C=m;for(let I=0;I<=i;I++){let N=I/i*l+c,F=Math.cos(N),D=Math.sin(N);T.x=v*D,T.y=p*R,T.z=v*F,u.push(T.x,T.y,T.z),d.push(0,R,0),S.x=F*.5+.5,S.y=D*.5*R+.5,f.push(S.x,S.y),m++}for(let I=0;I<i;I++){let z=w+I,N=C+I;M===!0?o.push(N,N+1,z):o.push(N+1,N,z),_+=3}h.addGroup(g,_,M===!0?1:2),g+=_}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},Qn=class r extends Et{constructor(e=1,t=1,n=32,i=1,s=!1,a=0,c=Math.PI*2){super(0,e,t,n,i,s,a,c),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:i,openEnded:s,thetaStart:a,thetaLength:c}}static fromJSON(e){return new r(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},Jr=class r extends ot{constructor(e=[],t=[],n=1,i=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:i};let s=[],a=[];c(i),h(n),o(),this.setAttribute("position",new Xe(s,3)),this.setAttribute("normal",new Xe(s.slice(),3)),this.setAttribute("uv",new Xe(a,2)),i===0?this.computeVertexNormals():this.normalizeNormals();function c(y){let b=new L,M=new L,w=new L;for(let S=0;S<t.length;S+=3)f(t[S+0],b),f(t[S+1],M),f(t[S+2],w),l(b,M,w,y)}function l(y,b,M,w){let S=w+1,T=[];for(let _=0;_<=S;_++){T[_]=[];let v=y.clone().lerp(M,_/S),R=b.clone().lerp(M,_/S),C=S-_;for(let I=0;I<=C;I++)I===0&&_===S?T[_][I]=v:T[_][I]=v.clone().lerp(R,I/C)}for(let _=0;_<S;_++)for(let v=0;v<2*(S-_)-1;v++){let R=Math.floor(v/2);v%2===0?(d(T[_][R+1]),d(T[_+1][R]),d(T[_][R])):(d(T[_][R+1]),d(T[_+1][R+1]),d(T[_+1][R]))}}function h(y){let b=new L;for(let M=0;M<s.length;M+=3)b.x=s[M+0],b.y=s[M+1],b.z=s[M+2],b.normalize().multiplyScalar(y),s[M+0]=b.x,s[M+1]=b.y,s[M+2]=b.z}function o(){let y=new L;for(let b=0;b<s.length;b+=3){y.x=s[b+0],y.y=s[b+1],y.z=s[b+2];let M=p(y)/2/Math.PI+.5,w=g(y)/Math.PI+.5;a.push(M,1-w)}m(),u()}function u(){for(let y=0;y<a.length;y+=6){let b=a[y+0],M=a[y+2],w=a[y+4],S=Math.max(b,M,w),T=Math.min(b,M,w);S>.9&&T<.1&&(b<.2&&(a[y+0]+=1),M<.2&&(a[y+2]+=1),w<.2&&(a[y+4]+=1))}}function d(y){s.push(y.x,y.y,y.z)}function f(y,b){let M=y*3;b.x=e[M+0],b.y=e[M+1],b.z=e[M+2]}function m(){let y=new L,b=new L,M=new L,w=new L,S=new ae,T=new ae,_=new ae;for(let v=0,R=0;v<s.length;v+=9,R+=6){y.set(s[v+0],s[v+1],s[v+2]),b.set(s[v+3],s[v+4],s[v+5]),M.set(s[v+6],s[v+7],s[v+8]),S.set(a[R+0],a[R+1]),T.set(a[R+2],a[R+3]),_.set(a[R+4],a[R+5]),w.copy(y).add(b).add(M).divideScalar(3);let C=p(w);x(S,R+0,y,C),x(T,R+2,b,C),x(_,R+4,M,C)}}function x(y,b,M,w){w<0&&y.x===1&&(a[b]=y.x-1),M.x===0&&M.z===0&&(a[b]=w/2/Math.PI+.5)}function p(y){return Math.atan2(y.z,-y.x)}function g(y){return Math.atan2(-y.y,Math.sqrt(y.x*y.x+y.z*y.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.vertices,e.indices,e.radius,e.detail)}};var _n=class{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){Le("Curve: .getPoint() not implemented.")}getPointAt(e,t){let n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],n,i=this.getPoint(0),s=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),s+=n.distanceTo(i),t.push(s),i=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){let n=this.getLengths(),i=0,s=n.length,a;t?a=t:a=e*n[s-1];let c=0,l=s-1,h;for(;c<=l;)if(i=Math.floor(c+(l-c)/2),h=n[i]-a,h<0)c=i+1;else if(h>0)l=i-1;else{l=i;break}if(i=l,n[i]===a)return i/(s-1);let o=n[i],d=n[i+1]-o,f=(a-o)/d;return(i+f)/(s-1)}getTangent(e,t){let i=e-1e-4,s=e+1e-4;i<0&&(i=0),s>1&&(s=1);let a=this.getPoint(i),c=this.getPoint(s),l=t||(a.isVector2?new ae:new L);return l.copy(c).sub(a).normalize(),l}getTangentAt(e,t){let n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){let n=new L,i=[],s=[],a=[],c=new L,l=new Fe;for(let f=0;f<=e;f++){let m=f/e;i[f]=this.getTangentAt(m,new L)}s[0]=new L,a[0]=new L;let h=Number.MAX_VALUE,o=Math.abs(i[0].x),u=Math.abs(i[0].y),d=Math.abs(i[0].z);o<=h&&(h=o,n.set(1,0,0)),u<=h&&(h=u,n.set(0,1,0)),d<=h&&n.set(0,0,1),c.crossVectors(i[0],n).normalize(),s[0].crossVectors(i[0],c),a[0].crossVectors(i[0],s[0]);for(let f=1;f<=e;f++){if(s[f]=s[f-1].clone(),a[f]=a[f-1].clone(),c.crossVectors(i[f-1],i[f]),c.length()>Number.EPSILON){c.normalize();let m=Math.acos(et(i[f-1].dot(i[f]),-1,1));s[f].applyMatrix4(l.makeRotationAxis(c,m))}a[f].crossVectors(i[f],s[f])}if(t===!0){let f=Math.acos(et(s[0].dot(s[e]),-1,1));f/=e,i[0].dot(c.crossVectors(s[0],s[e]))>0&&(f=-f);for(let m=1;m<=e;m++)s[m].applyMatrix4(l.makeRotationAxis(i[m],f*m)),a[m].crossVectors(i[m],s[m])}return{tangents:i,normals:s,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},tr=class extends _n{constructor(e=0,t=0,n=1,i=1,s=0,a=Math.PI*2,c=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=i,this.aStartAngle=s,this.aEndAngle=a,this.aClockwise=c,this.aRotation=l}getPoint(e,t=new ae){let n=t,i=Math.PI*2,s=this.aEndAngle-this.aStartAngle,a=Math.abs(s)<Number.EPSILON;for(;s<0;)s+=i;for(;s>i;)s-=i;s<Number.EPSILON&&(a?s=0:s=i),this.aClockwise===!0&&!a&&(s===i?s=-i:s=s-i);let c=this.aStartAngle+e*s,l=this.aX+this.xRadius*Math.cos(c),h=this.aY+this.yRadius*Math.sin(c);if(this.aRotation!==0){let o=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=l-this.aX,f=h-this.aY;l=d*o-f*u+this.aX,h=d*u+f*o+this.aY}return n.set(l,h)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},wo=class extends tr{constructor(e,t,n,i,s,a){super(e,t,n,n,i,s,a),this.isArcCurve=!0,this.type="ArcCurve"}};function dh(){let r=0,e=0,t=0,n=0;function i(s,a,c,l){r=s,e=c,t=-3*s+3*a-2*c-l,n=2*s-2*a+c+l}return{initCatmullRom:function(s,a,c,l,h){i(a,c,h*(c-s),h*(l-a))},initNonuniformCatmullRom:function(s,a,c,l,h,o,u){let d=(a-s)/h-(c-s)/(h+o)+(c-a)/o,f=(c-a)/o-(l-a)/(o+u)+(l-c)/u;d*=o,f*=o,i(a,c,d,f)},calc:function(s){let a=s*s,c=a*s;return r+e*s+t*a+n*c}}}var nd=new L,id=new L,Sl=new dh,Tl=new dh,wl=new dh,nr=class extends _n{constructor(e=[],t=!1,n="centripetal",i=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=i}getPoint(e,t=new L){let n=t,i=this.points,s=i.length,a=(s-(this.closed?0:1))*e,c=Math.floor(a),l=a-c;this.closed?c+=c>0?0:(Math.floor(Math.abs(c)/s)+1)*s:l===0&&c===s-1&&(c=s-2,l=1);let h,o;this.closed||c>0?h=i[(c-1)%s]:(id.subVectors(i[0],i[1]).add(i[0]),h=id);let u=i[c%s],d=i[(c+1)%s];if(this.closed||c+2<s?o=i[(c+2)%s]:(nd.subVectors(i[s-1],i[s-2]).add(i[s-1]),o=nd),this.curveType==="centripetal"||this.curveType==="chordal"){let f=this.curveType==="chordal"?.5:.25,m=Math.pow(h.distanceToSquared(u),f),x=Math.pow(u.distanceToSquared(d),f),p=Math.pow(d.distanceToSquared(o),f);x<1e-4&&(x=1),m<1e-4&&(m=x),p<1e-4&&(p=x),Sl.initNonuniformCatmullRom(h.x,u.x,d.x,o.x,m,x,p),Tl.initNonuniformCatmullRom(h.y,u.y,d.y,o.y,m,x,p),wl.initNonuniformCatmullRom(h.z,u.z,d.z,o.z,m,x,p)}else this.curveType==="catmullrom"&&(Sl.initCatmullRom(h.x,u.x,d.x,o.x,this.tension),Tl.initCatmullRom(h.y,u.y,d.y,o.y,this.tension),wl.initCatmullRom(h.z,u.z,d.z,o.z,this.tension));return n.set(Sl.calc(l),Tl.calc(l),wl.calc(l)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let i=e.points[t];this.points.push(i.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let i=this.points[t];e.points.push(i.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let i=e.points[t];this.points.push(new L().fromArray(i))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function sd(r,e,t,n,i){let s=(n-e)*.5,a=(i-t)*.5,c=r*r,l=r*c;return(2*t-2*n+s+a)*l+(-3*t+3*n-2*s-a)*c+s*r+t}function em(r,e){let t=1-r;return t*t*e}function tm(r,e){return 2*(1-r)*r*e}function nm(r,e){return r*r*e}function Ur(r,e,t,n){return em(r,e)+tm(r,t)+nm(r,n)}function im(r,e){let t=1-r;return t*t*t*e}function sm(r,e){let t=1-r;return 3*t*t*r*e}function rm(r,e){return 3*(1-r)*r*r*e}function am(r,e){return r*r*r*e}function Fr(r,e,t,n,i){return im(r,e)+sm(r,t)+rm(r,n)+am(r,i)}var jr=class extends _n{constructor(e=new ae,t=new ae,n=new ae,i=new ae){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=i}getPoint(e,t=new ae){let n=t,i=this.v0,s=this.v1,a=this.v2,c=this.v3;return n.set(Fr(e,i.x,s.x,a.x,c.x),Fr(e,i.y,s.y,a.y,c.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Ao=class extends _n{constructor(e=new L,t=new L,n=new L,i=new L){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=i}getPoint(e,t=new L){let n=t,i=this.v0,s=this.v1,a=this.v2,c=this.v3;return n.set(Fr(e,i.x,s.x,a.x,c.x),Fr(e,i.y,s.y,a.y,c.y),Fr(e,i.z,s.z,a.z,c.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Qr=class extends _n{constructor(e=new ae,t=new ae){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new ae){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new ae){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Ro=class extends _n{constructor(e=new L,t=new L){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new L){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new L){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},ea=class extends _n{constructor(e=new ae,t=new ae,n=new ae){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new ae){let n=t,i=this.v0,s=this.v1,a=this.v2;return n.set(Ur(e,i.x,s.x,a.x),Ur(e,i.y,s.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Co=class extends _n{constructor(e=new L,t=new L,n=new L){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new L){let n=t,i=this.v0,s=this.v1,a=this.v2;return n.set(Ur(e,i.x,s.x,a.x),Ur(e,i.y,s.y,a.y),Ur(e,i.z,s.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},ta=class extends _n{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new ae){let n=t,i=this.points,s=(i.length-1)*e,a=Math.floor(s),c=s-a,l=i[a===0?a:a-1],h=i[a],o=i[a>i.length-2?i.length-1:a+1],u=i[a>i.length-3?i.length-1:a+2];return n.set(sd(c,l.x,h.x,o.x,u.x),sd(c,l.y,h.y,o.y,u.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let i=e.points[t];this.points.push(i.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let i=this.points[t];e.points.push(i.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let i=e.points[t];this.points.push(new ae().fromArray(i))}return this}},Ll=Object.freeze({__proto__:null,ArcCurve:wo,CatmullRomCurve3:nr,CubicBezierCurve:jr,CubicBezierCurve3:Ao,EllipseCurve:tr,LineCurve:Qr,LineCurve3:Ro,QuadraticBezierCurve:ea,QuadraticBezierCurve3:Co,SplineCurve:ta}),Io=class extends _n{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Ll[n](t,e))}return this}getPoint(e,t){let n=e*this.getLength(),i=this.getCurveLengths(),s=0;for(;s<i.length;){if(i[s]>=n){let a=i[s]-n,c=this.curves[s],l=c.getLength(),h=l===0?0:1-a/l;return c.getPointAt(h,t)}s++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let n=0,i=this.curves.length;n<i;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],n;for(let i=0,s=this.curves;i<s.length;i++){let a=s[i],c=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,l=a.getPoints(c);for(let h=0;h<l.length;h++){let o=l[h];n&&n.equals(o)||(t.push(o),n=o)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let i=e.curves[t];this.curves.push(i.clone())}return this.autoClose=e.autoClose,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){let i=this.curves[t];e.curves.push(i.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let i=e.curves[t];this.curves.push(new Ll[i.type]().fromJSON(i))}return this}},Hi=class extends Io{constructor(e){super(),this.type="Path",this.currentPoint=new ae,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let n=new Qr(this.currentPoint.clone(),new ae(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,i){let s=new ea(this.currentPoint.clone(),new ae(e,t),new ae(n,i));return this.curves.push(s),this.currentPoint.set(n,i),this}bezierCurveTo(e,t,n,i,s,a){let c=new jr(this.currentPoint.clone(),new ae(e,t),new ae(n,i),new ae(s,a));return this.curves.push(c),this.currentPoint.set(s,a),this}splineThru(e){let t=[this.currentPoint.clone()].concat(e),n=new ta(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,i,s,a){let c=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+c,t+l,n,i,s,a),this}absarc(e,t,n,i,s,a){return this.absellipse(e,t,n,n,i,s,a),this}ellipse(e,t,n,i,s,a,c,l){let h=this.currentPoint.x,o=this.currentPoint.y;return this.absellipse(e+h,t+o,n,i,s,a,c,l),this}absellipse(e,t,n,i,s,a,c,l){let h=new tr(e,t,n,i,s,a,c,l);if(this.curves.length>0){let u=h.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(h);let o=h.getPoint(1);return this.currentPoint.copy(o),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},hs=class extends Hi{constructor(e){super(e),this.uuid=Rn(),this.type="Shape",this.holes=[]}getPointsHoles(e){let t=[];for(let n=0,i=this.holes.length;n<i;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let i=e.holes[t];this.holes.push(i.clone())}return this}toJSON(){let e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){let i=this.holes[t];e.holes.push(i.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let i=e.holes[t];this.holes.push(new Hi().fromJSON(i))}return this}};function om(r,e,t=2){let n=e&&e.length,i=n?e[0]*t:r.length,s=rf(r,0,i,t,!0),a=[];if(!s||s.next===s.prev)return a;let c,l,h;if(n&&(s=dm(r,e,s,t)),r.length>80*t){c=r[0],l=r[1];let o=c,u=l;for(let d=t;d<i;d+=t){let f=r[d],m=r[d+1];f<c&&(c=f),m<l&&(l=m),f>o&&(o=f),m>u&&(u=m)}h=Math.max(o-c,u-l),h=h!==0?32767/h:0}return na(s,a,t,c,l,h,0),a}function rf(r,e,t,n,i){let s;if(i===Em(r,e,t,n)>0)for(let a=e;a<t;a+=n)s=rd(a/n|0,r[a],r[a+1],s);else for(let a=t-n;a>=e;a-=n)s=rd(a/n|0,r[a],r[a+1],s);return s&&ir(s,s.next)&&(sa(s),s=s.next),s}function us(r,e){if(!r)return r;e||(e=r);let t=r,n;do if(n=!1,!t.steiner&&(ir(t,t.next)||Lt(t.prev,t,t.next)===0)){if(sa(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function na(r,e,t,n,i,s,a){if(!r)return;!a&&s&&xm(r,n,i,s);let c=r;for(;r.prev!==r.next;){let l=r.prev,h=r.next;if(s?lm(r,n,i,s):cm(r)){e.push(l.i,r.i,h.i),sa(r),r=h.next,c=h.next;continue}if(r=h,r===c){a?a===1?(r=hm(us(r),e),na(r,e,t,n,i,s,2)):a===2&&um(r,e,t,n,i,s):na(us(r),e,t,n,i,s,1);break}}}function cm(r){let e=r.prev,t=r,n=r.next;if(Lt(e,t,n)>=0)return!1;let i=e.x,s=t.x,a=n.x,c=e.y,l=t.y,h=n.y,o=Math.min(i,s,a),u=Math.min(c,l,h),d=Math.max(i,s,a),f=Math.max(c,l,h),m=n.next;for(;m!==e;){if(m.x>=o&&m.x<=d&&m.y>=u&&m.y<=f&&Nr(i,c,s,l,a,h,m.x,m.y)&&Lt(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function lm(r,e,t,n){let i=r.prev,s=r,a=r.next;if(Lt(i,s,a)>=0)return!1;let c=i.x,l=s.x,h=a.x,o=i.y,u=s.y,d=a.y,f=Math.min(c,l,h),m=Math.min(o,u,d),x=Math.max(c,l,h),p=Math.max(o,u,d),g=Nl(f,m,e,t,n),y=Nl(x,p,e,t,n),b=r.prevZ,M=r.nextZ;for(;b&&b.z>=g&&M&&M.z<=y;){if(b.x>=f&&b.x<=x&&b.y>=m&&b.y<=p&&b!==i&&b!==a&&Nr(c,o,l,u,h,d,b.x,b.y)&&Lt(b.prev,b,b.next)>=0||(b=b.prevZ,M.x>=f&&M.x<=x&&M.y>=m&&M.y<=p&&M!==i&&M!==a&&Nr(c,o,l,u,h,d,M.x,M.y)&&Lt(M.prev,M,M.next)>=0))return!1;M=M.nextZ}for(;b&&b.z>=g;){if(b.x>=f&&b.x<=x&&b.y>=m&&b.y<=p&&b!==i&&b!==a&&Nr(c,o,l,u,h,d,b.x,b.y)&&Lt(b.prev,b,b.next)>=0)return!1;b=b.prevZ}for(;M&&M.z<=y;){if(M.x>=f&&M.x<=x&&M.y>=m&&M.y<=p&&M!==i&&M!==a&&Nr(c,o,l,u,h,d,M.x,M.y)&&Lt(M.prev,M,M.next)>=0)return!1;M=M.nextZ}return!0}function hm(r,e){let t=r;do{let n=t.prev,i=t.next.next;!ir(n,i)&&of(n,t,t.next,i)&&ia(n,i)&&ia(i,n)&&(e.push(n.i,t.i,i.i),sa(t),sa(t.next),t=r=i),t=t.next}while(t!==r);return us(t)}function um(r,e,t,n,i,s){let a=r;do{let c=a.next.next;for(;c!==a.prev;){if(a.i!==c.i&&vm(a,c)){let l=cf(a,c);a=us(a,a.next),l=us(l,l.next),na(a,e,t,n,i,s,0),na(l,e,t,n,i,s,0);return}c=c.next}a=a.next}while(a!==r)}function dm(r,e,t,n){let i=[];for(let s=0,a=e.length;s<a;s++){let c=e[s]*n,l=s<a-1?e[s+1]*n:r.length,h=rf(r,c,l,n,!1);h===h.next&&(h.steiner=!0),i.push(_m(h))}i.sort(fm);for(let s=0;s<i.length;s++)t=pm(i[s],t);return t}function fm(r,e){let t=r.x-e.x;if(t===0&&(t=r.y-e.y,t===0)){let n=(r.next.y-r.y)/(r.next.x-r.x),i=(e.next.y-e.y)/(e.next.x-e.x);t=n-i}return t}function pm(r,e){let t=mm(r,e);if(!t)return e;let n=cf(t,r);return us(n,n.next),us(t,t.next)}function mm(r,e){let t=e,n=r.x,i=r.y,s=-1/0,a;if(ir(r,t))return t;do{if(ir(r,t.next))return t.next;if(i<=t.y&&i>=t.next.y&&t.next.y!==t.y){let u=t.x+(i-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(u<=n&&u>s&&(s=u,a=t.x<t.next.x?t:t.next,u===n))return a}t=t.next}while(t!==e);if(!a)return null;let c=a,l=a.x,h=a.y,o=1/0;t=a;do{if(n>=t.x&&t.x>=l&&n!==t.x&&af(i<h?n:s,i,l,h,i<h?s:n,i,t.x,t.y)){let u=Math.abs(i-t.y)/(n-t.x);ia(t,r)&&(u<o||u===o&&(t.x>a.x||t.x===a.x&&gm(a,t)))&&(a=t,o=u)}t=t.next}while(t!==c);return a}function gm(r,e){return Lt(r.prev,r,e.prev)<0&&Lt(e.next,r,r.next)<0}function xm(r,e,t,n){let i=r;do i.z===0&&(i.z=Nl(i.x,i.y,e,t,n)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==r);i.prevZ.nextZ=null,i.prevZ=null,ym(i)}function ym(r){let e,t=1;do{let n=r,i;r=null;let s=null;for(e=0;n;){e++;let a=n,c=0;for(let h=0;h<t&&(c++,a=a.nextZ,!!a);h++);let l=t;for(;c>0||l>0&&a;)c!==0&&(l===0||!a||n.z<=a.z)?(i=n,n=n.nextZ,c--):(i=a,a=a.nextZ,l--),s?s.nextZ=i:r=i,i.prevZ=s,s=i;n=a}s.nextZ=null,t*=2}while(e>1);return r}function Nl(r,e,t,n,i){return r=(r-t)*i|0,e=(e-n)*i|0,r=(r|r<<8)&16711935,r=(r|r<<4)&252645135,r=(r|r<<2)&858993459,r=(r|r<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,r|e<<1}function _m(r){let e=r,t=r;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==r);return t}function af(r,e,t,n,i,s,a,c){return(i-a)*(e-c)>=(r-a)*(s-c)&&(r-a)*(n-c)>=(t-a)*(e-c)&&(t-a)*(s-c)>=(i-a)*(n-c)}function Nr(r,e,t,n,i,s,a,c){return!(r===a&&e===c)&&af(r,e,t,n,i,s,a,c)}function vm(r,e){return r.next.i!==e.i&&r.prev.i!==e.i&&!Mm(r,e)&&(ia(r,e)&&ia(e,r)&&bm(r,e)&&(Lt(r.prev,r,e.prev)||Lt(r,e.prev,e))||ir(r,e)&&Lt(r.prev,r,r.next)>0&&Lt(e.prev,e,e.next)>0)}function Lt(r,e,t){return(e.y-r.y)*(t.x-e.x)-(e.x-r.x)*(t.y-e.y)}function ir(r,e){return r.x===e.x&&r.y===e.y}function of(r,e,t,n){let i=ao(Lt(r,e,t)),s=ao(Lt(r,e,n)),a=ao(Lt(t,n,r)),c=ao(Lt(t,n,e));return!!(i!==s&&a!==c||i===0&&ro(r,t,e)||s===0&&ro(r,n,e)||a===0&&ro(t,r,n)||c===0&&ro(t,e,n))}function ro(r,e,t){return e.x<=Math.max(r.x,t.x)&&e.x>=Math.min(r.x,t.x)&&e.y<=Math.max(r.y,t.y)&&e.y>=Math.min(r.y,t.y)}function ao(r){return r>0?1:r<0?-1:0}function Mm(r,e){let t=r;do{if(t.i!==r.i&&t.next.i!==r.i&&t.i!==e.i&&t.next.i!==e.i&&of(t,t.next,r,e))return!0;t=t.next}while(t!==r);return!1}function ia(r,e){return Lt(r.prev,r,r.next)<0?Lt(r,e,r.next)>=0&&Lt(r,r.prev,e)>=0:Lt(r,e,r.prev)<0||Lt(r,r.next,e)<0}function bm(r,e){let t=r,n=!1,i=(r.x+e.x)/2,s=(r.y+e.y)/2;do t.y>s!=t.next.y>s&&t.next.y!==t.y&&i<(t.next.x-t.x)*(s-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==r);return n}function cf(r,e){let t=Dl(r.i,r.x,r.y),n=Dl(e.i,e.x,e.y),i=r.next,s=e.prev;return r.next=e,e.prev=r,t.next=i,i.prev=t,n.next=t,t.prev=n,s.next=n,n.prev=s,n}function rd(r,e,t,n){let i=Dl(r,e,t);return n?(i.next=n.next,i.prev=n,n.next.prev=i,n.next=i):(i.prev=i,i.next=i),i}function sa(r){r.next.prev=r.prev,r.prev.next=r.next,r.prevZ&&(r.prevZ.nextZ=r.nextZ),r.nextZ&&(r.nextZ.prevZ=r.prevZ)}function Dl(r,e,t){return{i:r,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function Em(r,e,t,n){let i=0;for(let s=e,a=t-n;s<t;s+=n)i+=(r[a]-r[s])*(r[s+1]+r[a+1]),a=s;return i}var zl=class{static triangulate(e,t,n=2){return om(e,t,n)}},is=class r{static area(e){let t=e.length,n=0;for(let i=t-1,s=0;s<t;i=s++)n+=e[i].x*e[s].y-e[s].x*e[i].y;return n*.5}static isClockWise(e){return r.area(e)<0}static triangulateShape(e,t){let n=[],i=[],s=[];ad(e),od(n,e);let a=e.length;t.forEach(ad);for(let l=0;l<t.length;l++)i.push(a),a+=t[l].length,od(n,t[l]);let c=zl.triangulate(n,i);for(let l=0;l<c.length;l+=3)s.push(c.slice(l,l+3));return s}};function ad(r){let e=r.length;e>2&&r[e-1].equals(r[0])&&r.pop()}function od(r,e){for(let t=0;t<e.length;t++)r.push(e[t].x),r.push(e[t].y)}var sr=class r extends ot{constructor(e=new hs([new ae(.5,.5),new ae(-.5,.5),new ae(-.5,-.5),new ae(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];let n=this,i=[],s=[];for(let c=0,l=e.length;c<l;c++){let h=e[c];a(h)}this.setAttribute("position",new Xe(i,3)),this.setAttribute("uv",new Xe(s,2)),this.computeVertexNormals();function a(c){let l=[],h=t.curveSegments!==void 0?t.curveSegments:12,o=t.steps!==void 0?t.steps:1,u=t.depth!==void 0?t.depth:1,d=t.bevelEnabled!==void 0?t.bevelEnabled:!0,f=t.bevelThickness!==void 0?t.bevelThickness:.2,m=t.bevelSize!==void 0?t.bevelSize:f-.1,x=t.bevelOffset!==void 0?t.bevelOffset:0,p=t.bevelSegments!==void 0?t.bevelSegments:3,g=t.extrudePath,y=t.UVGenerator!==void 0?t.UVGenerator:Sm,b,M=!1,w,S,T,_;if(g){b=g.getSpacedPoints(o),M=!0,d=!1;let ie=g.isCatmullRomCurve3?g.closed:!1;w=g.computeFrenetFrames(o,ie),S=new L,T=new L,_=new L}d||(p=0,f=0,m=0,x=0);let v=c.extractPoints(h),R=v.shape,C=v.holes;if(!is.isClockWise(R)){R=R.reverse();for(let ie=0,re=C.length;ie<re;ie++){let oe=C[ie];is.isClockWise(oe)&&(C[ie]=oe.reverse())}}function z(ie){let oe=10000000000000001e-36,ce=ie[0];for(let ue=1;ue<=ie.length;ue++){let Be=ue%ie.length,Ue=ie[Be],We=Ue.x-ce.x,Ze=Ue.y-ce.y,U=We*We+Ze*Ze,ft=Math.max(Math.abs(Ue.x),Math.abs(Ue.y),Math.abs(ce.x),Math.abs(ce.y)),st=oe*ft*ft;if(U<=st){ie.splice(Be,1),ue--;continue}ce=Ue}}z(R),C.forEach(z);let N=C.length,F=R;for(let ie=0;ie<N;ie++){let re=C[ie];R=R.concat(re)}function D(ie,re,oe){return re||He("ExtrudeGeometry: vec does not exist"),ie.clone().addScaledVector(re,oe)}let B=R.length;function X(ie,re,oe){let ce,ue,Be,Ue=ie.x-re.x,We=ie.y-re.y,Ze=oe.x-ie.x,U=oe.y-ie.y,ft=Ue*Ue+We*We,st=Ue*U-We*Ze;if(Math.abs(st)>Number.EPSILON){let P=Math.sqrt(ft),E=Math.sqrt(Ze*Ze+U*U),G=re.x-We/P,q=re.y+Ue/P,J=oe.x-U/E,le=oe.y+Ze/E,he=((J-G)*U-(le-q)*Ze)/(Ue*U-We*Ze);ce=G+Ue*he-ie.x,ue=q+We*he-ie.y;let j=ce*ce+ue*ue;if(j<=2)return new ae(ce,ue);Be=Math.sqrt(j/2)}else{let P=!1;Ue>Number.EPSILON?Ze>Number.EPSILON&&(P=!0):Ue<-Number.EPSILON?Ze<-Number.EPSILON&&(P=!0):Math.sign(We)===Math.sign(U)&&(P=!0),P?(ce=-We,ue=Ue,Be=Math.sqrt(ft)):(ce=Ue,ue=We,Be=Math.sqrt(ft/2))}return new ae(ce/Be,ue/Be)}let k=[];for(let ie=0,re=F.length,oe=re-1,ce=ie+1;ie<re;ie++,oe++,ce++)oe===re&&(oe=0),ce===re&&(ce=0),k[ie]=X(F[ie],F[oe],F[ce]);let Y=[],$,ye=k.concat();for(let ie=0,re=N;ie<re;ie++){let oe=C[ie];$=[];for(let ce=0,ue=oe.length,Be=ue-1,Ue=ce+1;ce<ue;ce++,Be++,Ue++)Be===ue&&(Be=0),Ue===ue&&(Ue=0),$[ce]=X(oe[ce],oe[Be],oe[Ue]);Y.push($),ye=ye.concat($)}let Me;if(p===0)Me=is.triangulateShape(F,C);else{let ie=[],re=[];for(let oe=0;oe<p;oe++){let ce=oe/p,ue=f*Math.cos(ce*Math.PI/2),Be=m*Math.sin(ce*Math.PI/2)+x;for(let Ue=0,We=F.length;Ue<We;Ue++){let Ze=D(F[Ue],k[Ue],Be);_e(Ze.x,Ze.y,-ue),ce===0&&ie.push(Ze)}for(let Ue=0,We=N;Ue<We;Ue++){let Ze=C[Ue];$=Y[Ue];let U=[];for(let ft=0,st=Ze.length;ft<st;ft++){let P=D(Ze[ft],$[ft],Be);_e(P.x,P.y,-ue),ce===0&&U.push(P)}ce===0&&re.push(U)}}Me=is.triangulateShape(ie,re)}let ht=Me.length,it=m+x;for(let ie=0;ie<B;ie++){let re=d?D(R[ie],ye[ie],it):R[ie];M?(T.copy(w.normals[0]).multiplyScalar(re.x),S.copy(w.binormals[0]).multiplyScalar(re.y),_.copy(b[0]).add(T).add(S),_e(_.x,_.y,_.z)):_e(re.x,re.y,0)}for(let ie=1;ie<=o;ie++)for(let re=0;re<B;re++){let oe=d?D(R[re],ye[re],it):R[re];M?(T.copy(w.normals[ie]).multiplyScalar(oe.x),S.copy(w.binormals[ie]).multiplyScalar(oe.y),_.copy(b[ie]).add(T).add(S),_e(_.x,_.y,_.z)):_e(oe.x,oe.y,u/o*ie)}for(let ie=p-1;ie>=0;ie--){let re=ie/p,oe=f*Math.cos(re*Math.PI/2),ce=m*Math.sin(re*Math.PI/2)+x;for(let ue=0,Be=F.length;ue<Be;ue++){let Ue=D(F[ue],k[ue],ce);_e(Ue.x,Ue.y,u+oe)}for(let ue=0,Be=C.length;ue<Be;ue++){let Ue=C[ue];$=Y[ue];for(let We=0,Ze=Ue.length;We<Ze;We++){let U=D(Ue[We],$[We],ce);M?_e(U.x,U.y+b[o-1].y,b[o-1].x+oe):_e(U.x,U.y,u+oe)}}}ct(),Q();function ct(){let ie=i.length/3;if(d){let re=0,oe=B*re;for(let ce=0;ce<ht;ce++){let ue=Me[ce];Ge(ue[2]+oe,ue[1]+oe,ue[0]+oe)}re=o+p*2,oe=B*re;for(let ce=0;ce<ht;ce++){let ue=Me[ce];Ge(ue[0]+oe,ue[1]+oe,ue[2]+oe)}}else{for(let re=0;re<ht;re++){let oe=Me[re];Ge(oe[2],oe[1],oe[0])}for(let re=0;re<ht;re++){let oe=Me[re];Ge(oe[0]+B*o,oe[1]+B*o,oe[2]+B*o)}}n.addGroup(ie,i.length/3-ie,0)}function Q(){let ie=i.length/3,re=0;ne(F,re),re+=F.length;for(let oe=0,ce=C.length;oe<ce;oe++){let ue=C[oe];ne(ue,re),re+=ue.length}n.addGroup(ie,i.length/3-ie,1)}function ne(ie,re){let oe=ie.length;for(;--oe>=0;){let ce=oe,ue=oe-1;ue<0&&(ue=ie.length-1);for(let Be=0,Ue=o+p*2;Be<Ue;Be++){let We=B*Be,Ze=B*(Be+1),U=re+ce+We,ft=re+ue+We,st=re+ue+Ze,P=re+ce+Ze;Se(U,ft,st,P)}}}function _e(ie,re,oe){l.push(ie),l.push(re),l.push(oe)}function Ge(ie,re,oe){Ve(ie),Ve(re),Ve(oe);let ce=i.length/3,ue=y.generateTopUV(n,i,ce-3,ce-2,ce-1);xt(ue[0]),xt(ue[1]),xt(ue[2])}function Se(ie,re,oe,ce){Ve(ie),Ve(re),Ve(ce),Ve(re),Ve(oe),Ve(ce);let ue=i.length/3,Be=y.generateSideWallUV(n,i,ue-6,ue-3,ue-2,ue-1);xt(Be[0]),xt(Be[1]),xt(Be[3]),xt(Be[1]),xt(Be[2]),xt(Be[3])}function Ve(ie){i.push(l[ie*3+0]),i.push(l[ie*3+1]),i.push(l[ie*3+2])}function xt(ie){s.push(ie.x),s.push(ie.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes,n=this.parameters.options;return Tm(t,n,e)}static fromJSON(e,t){let n=[];for(let s=0,a=e.shapes.length;s<a;s++){let c=t[e.shapes[s]];n.push(c)}let i=e.options.extrudePath;return i!==void 0&&(e.options.extrudePath=new Ll[i.type]().fromJSON(i)),new r(n,e.options)}},Sm={generateTopUV:function(r,e,t,n,i){let s=e[t*3],a=e[t*3+1],c=e[n*3],l=e[n*3+1],h=e[i*3],o=e[i*3+1];return[new ae(s,a),new ae(c,l),new ae(h,o)]},generateSideWallUV:function(r,e,t,n,i,s){let a=e[t*3],c=e[t*3+1],l=e[t*3+2],h=e[n*3],o=e[n*3+1],u=e[n*3+2],d=e[i*3],f=e[i*3+1],m=e[i*3+2],x=e[s*3],p=e[s*3+1],g=e[s*3+2];return Math.abs(c-o)<Math.abs(a-h)?[new ae(a,1-l),new ae(h,1-u),new ae(d,1-m),new ae(x,1-g)]:[new ae(c,1-l),new ae(o,1-u),new ae(f,1-m),new ae(p,1-g)]}};function Tm(r,e,t){if(t.shapes=[],Array.isArray(r))for(let n=0,i=r.length;n<i;n++){let s=r[n];t.shapes.push(s.uuid)}else t.shapes.push(r.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}var Gn=class r extends Jr{constructor(e=1,t=0){let n=(1+Math.sqrt(5))/2,i=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],s=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(i,s,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new r(e.radius,e.detail)}};var ra=class r extends Jr{constructor(e=1,t=0){let n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],i=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,i,e,t),this.type="OctahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new r(e.radius,e.detail)}},ut=class r extends ot{constructor(e=1,t=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:i};let s=e/2,a=t/2,c=Math.floor(n),l=Math.floor(i),h=c+1,o=l+1,u=e/c,d=t/l,f=[],m=[],x=[],p=[];for(let g=0;g<o;g++){let y=g*d-a;for(let b=0;b<h;b++){let M=b*u-s;m.push(M,-y,0),x.push(0,0,1),p.push(b/c),p.push(1-g/l)}}for(let g=0;g<l;g++)for(let y=0;y<c;y++){let b=y+h*g,M=y+h*(g+1),w=y+1+h*(g+1),S=y+1+h*g;f.push(b,M,S),f.push(M,w,S)}this.setIndex(f),this.setAttribute("position",new Xe(m,3)),this.setAttribute("normal",new Xe(x,3)),this.setAttribute("uv",new Xe(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.width,e.height,e.widthSegments,e.heightSegments)}},rr=class r extends ot{constructor(e=.5,t=1,n=32,i=1,s=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:i,thetaStart:s,thetaLength:a},n=Math.max(3,n),i=Math.max(1,i);let c=[],l=[],h=[],o=[],u=e,d=(t-e)/i,f=new L,m=new ae;for(let x=0;x<=i;x++){for(let p=0;p<=n;p++){let g=s+p/n*a;f.x=u*Math.cos(g),f.y=u*Math.sin(g),l.push(f.x,f.y,f.z),h.push(0,0,1),m.x=(f.x/t+1)/2,m.y=(f.y/t+1)/2,o.push(m.x,m.y)}u+=d}for(let x=0;x<i;x++){let p=x*(n+1);for(let g=0;g<n;g++){let y=g+p,b=y,M=y+n+1,w=y+n+2,S=y+1;c.push(b,M,S),c.push(M,w,S)}}this.setIndex(c),this.setAttribute("position",new Xe(l,3)),this.setAttribute("normal",new Xe(h,3)),this.setAttribute("uv",new Xe(o,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}};var dn=class r extends ot{constructor(e=1,t=32,n=16,i=0,s=Math.PI*2,a=0,c=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:i,phiLength:s,thetaStart:a,thetaLength:c},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let l=Math.min(a+c,Math.PI),h=0,o=[],u=new L,d=new L,f=[],m=[],x=[],p=[];for(let g=0;g<=n;g++){let y=[],b=g/n,M=a+b*c,w=e*Math.cos(M),S=Math.sqrt(e*e-w*w),T=0;g===0&&a===0?T=.5/t:g===n&&l===Math.PI&&(T=-.5/t);for(let _=0;_<=t;_++){let v=_/t,R=i+v*s;u.x=-S*Math.cos(R),u.y=w,u.z=S*Math.sin(R),m.push(u.x,u.y,u.z),d.copy(u).normalize(),x.push(d.x,d.y,d.z),p.push(v+T,1-b),y.push(h++)}o.push(y)}for(let g=0;g<n;g++)for(let y=0;y<t;y++){let b=o[g][y+1],M=o[g][y],w=o[g+1][y],S=o[g+1][y+1];(g!==0||a>0)&&f.push(b,M,S),(g!==n-1||l<Math.PI)&&f.push(M,w,S)}this.setIndex(f),this.setAttribute("position",new Xe(m,3)),this.setAttribute("normal",new Xe(x,3)),this.setAttribute("uv",new Xe(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}};var Kt=class r extends ot{constructor(e=1,t=.4,n=12,i=48,s=Math.PI*2,a=0,c=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:i,arc:s,thetaStart:a,thetaLength:c},n=Math.floor(n),i=Math.floor(i);let l=[],h=[],o=[],u=[],d=new L,f=new L,m=new L;for(let x=0;x<=n;x++){let p=a+x/n*c;for(let g=0;g<=i;g++){let y=g/i*s;f.x=(e+t*Math.cos(p))*Math.cos(y),f.y=(e+t*Math.cos(p))*Math.sin(y),f.z=t*Math.sin(p),h.push(f.x,f.y,f.z),d.x=e*Math.cos(y),d.y=e*Math.sin(y),m.subVectors(f,d).normalize(),o.push(m.x,m.y,m.z),u.push(g/i),u.push(x/n)}}for(let x=1;x<=n;x++)for(let p=1;p<=i;p++){let g=(i+1)*x+p-1,y=(i+1)*(x-1)+p-1,b=(i+1)*(x-1)+p,M=(i+1)*x+p;l.push(g,y,M),l.push(y,b,M)}this.setIndex(l),this.setAttribute("position",new Xe(h,3)),this.setAttribute("normal",new Xe(o,3)),this.setAttribute("uv",new Xe(u,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc,e.thetaStart,e.thetaLength)}};function ys(r){let e={};for(let t in r){e[t]={};for(let n in r[t]){let i=r[t][n];if(cd(i))i.isRenderTargetTexture?(Le("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=i.clone();else if(Array.isArray(i))if(cd(i[0])){let s=[];for(let a=0,c=i.length;a<c;a++)s[a]=i[a].clone();e[t][n]=s}else e[t][n]=i.slice();else e[t][n]=i}}return e}function en(r){let e={};for(let t=0;t<r.length;t++){let n=ys(r[t]);for(let i in n)e[i]=n[i]}return e}function cd(r){return r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)}function wm(r){let e=[];for(let t=0;t<r.length;t++)e.push(r[t].clone());return e}function fh(r){let e=r.getRenderTarget();return e===null?r.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Qe.workingColorSpace}var lf={clone:ys,merge:en},Am=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Rm=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,vn=class extends an{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Am,this.fragmentShader=Rm,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=ys(e.uniforms),this.uniformsGroups=wm(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let i in this.uniforms){let a=this.uniforms[i].value;a&&a.isTexture?t.uniforms[i]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[i]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[i]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[i]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[i]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[i]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[i]={type:"m4",value:a.toArray()}:t.uniforms[i]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let n in e.uniforms){let i=e.uniforms[n];switch(this.uniforms[n]={},i.type){case"t":this.uniforms[n].value=t[i.value]||null;break;case"c":this.uniforms[n].value=new Ae().setHex(i.value);break;case"v2":this.uniforms[n].value=new ae().fromArray(i.value);break;case"v3":this.uniforms[n].value=new L().fromArray(i.value);break;case"v4":this.uniforms[n].value=new vt().fromArray(i.value);break;case"m3":this.uniforms[n].value=new Ye().fromArray(i.value);break;case"m4":this.uniforms[n].value=new Fe().fromArray(i.value);break;default:this.uniforms[n].value=i.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let n in e.extensions)this.extensions[n]=e.extensions[n];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},Po=class extends vn{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}},$e=class extends an{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Ae(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ae(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Nc,this.normalScale=new ae(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new hn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},fn=class extends $e{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new ae(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return et(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Ae(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Ae(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Ae(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get retroreflectivity(){return this._retroreflectivity}set retroreflectivity(e){this._retroreflectivity>0!=e>0&&this.version++,this._retroreflectivity=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.retroreflectivity=e.retroreflectivity,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}};var Lo=class extends an{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Vd,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},No=class extends an{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function zi(r,e){return!r||r.constructor===e?r:typeof e.BYTES_PER_ELEMENT=="number"?new e(r):Array.prototype.slice.call(r)}function uo(r){return r!==void 0&&r.inTangents!==void 0&&r.outTangents!==void 0}function Cm(r){function e(i,s){return r[i]-r[s]}let t=r.length,n=new Array(t);for(let i=0;i!==t;++i)n[i]=i;return n.sort(e),n}function ld(r,e,t){let n=r.length,i=new r.constructor(n);for(let s=0,a=0;a!==n;++s){let c=t[s]*e;for(let l=0;l!==e;++l)i[a++]=r[c+l]}return i}function Im(r,e,t,n){let i=1,s=r[0];for(;s!==void 0&&s[n]===void 0;)s=r[i++];if(s===void 0)return;let a=s[n];if(a!==void 0)if(Array.isArray(a))do a=s[n],a!==void 0&&(e.push(s.time),t.push(...a)),s=r[i++];while(s!==void 0);else if(a.toArray!==void 0)do a=s[n],a!==void 0&&(e.push(s.time),a.toArray(t,t.length)),s=r[i++];while(s!==void 0);else do a=s[n],a!==void 0&&(e.push(s.time),t.push(a)),s=r[i++];while(s!==void 0)}var ei=class{constructor(e,t,n,i){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=i!==void 0?i:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,i=t[n],s=t[n-1];e:{t:{let a;n:{i:if(!(e<i)){for(let c=n+2;;){if(i===void 0){if(e<s)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===c)break;if(s=i,i=t[++n],e<i)break t}a=t.length;break n}if(!(e>=s)){let c=t[1];e<c&&(n=2,s=c);for(let l=n-2;;){if(s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(i=s,s=t[--n-1],e>=s)break t}a=n,n=0;break n}break e}for(;n<a;){let c=n+a>>>1;e<t[c]?a=c:n=c+1}if(i=t[n],s=t[n-1],s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,s,i)}return this.interpolate_(n,s,e,i)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,s=e*i;for(let a=0;a!==i;++a)t[a]=n[s+a];return t}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},Do=class extends ei{constructor(e,t,n,i){super(e,t,n,i),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:ts,endingEnd:ts}}intervalChanged_(e,t,n){let i=this.parameterPositions,s=e-2,a=e+1,c=i[s],l=i[a];if(c===void 0)switch(this.getSettings_().endingStart){case ns:s=e,c=2*t-n;break;case Br:s=i.length-2,c=t+i[s]-i[s+1];break;default:s=e,c=n}if(l===void 0)switch(this.getSettings_().endingEnd){case ns:a=e,l=2*n-t;break;case Br:a=1,l=n+i[1]-i[0];break;default:a=e-1,l=t}let h=(n-t)*.5,o=this.valueSize;this._weightPrev=h/(t-c),this._weightNext=h/(l-n),this._offsetPrev=s*o,this._offsetNext=a*o}interpolate_(e,t,n,i){let s=this.resultBuffer,a=this.sampleValues,c=this.valueSize,l=e*c,h=l-c,o=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,m=(n-t)/(i-t),x=m*m,p=x*m,g=-d*p+2*d*x-d*m,y=(1+d)*p+(-1.5-2*d)*x+(-.5+d)*m+1,b=(-1-f)*p+(1.5+f)*x+.5*m,M=f*p-f*x;for(let w=0;w!==c;++w)s[w]=g*a[o+w]+y*a[h+w]+b*a[l+w]+M*a[u+w];return s}},aa=class extends ei{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){let s=this.resultBuffer,a=this.sampleValues,c=this.valueSize,l=e*c,h=l-c,o=(n-t)/(i-t),u=1-o;for(let d=0;d!==c;++d)s[d]=a[h+d]*u+a[l+d]*o;return s}},zo=class extends ei{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e){return this.copySampleValue_(e-1)}},Uo=class extends ei{interpolate_(e,t,n,i){let s=this.resultBuffer,a=this.sampleValues,c=this.valueSize,l=e*c,h=l-c,o=this.inTangents,u=this.outTangents;if(!o||!u){let m=(n-t)/(i-t),x=1-m;for(let p=0;p!==c;++p)s[p]=a[h+p]*x+a[l+p]*m;return s}let d=c*2,f=e-1;for(let m=0;m!==c;++m){let x=a[h+m],p=a[l+m],g=f*d+m*2,y=u[g],b=u[g+1],M=e*d+m*2,w=o[M],S=o[M+1],T=Lm(n,t,y,w,i);s[m]=hf(T,x,b,S,p)}return s}};function hf(r,e,t,n,i){let s=1-r;return s*s*s*e+3*s*s*r*t+3*s*r*r*n+r*r*r*i}function Pm(r,e,t,n,i){let s=1-r;return 3*s*s*(t-e)+6*s*r*(n-t)+3*r*r*(i-n)}function Lm(r,e,t,n,i){let s=(r-e)/(i-e);for(let a=0;a<8;a++){let c=hf(s,e,t,n,i)-r;if(Math.abs(c)<1e-10)break;let l=Pm(s,e,t,n,i);if(Math.abs(l)<1e-10)break;s=Math.max(0,Math.min(1,s-c/l))}return s}var pn=class{constructor(e,t,n,i){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=zi(t,this.TimeBufferType),this.values=zi(n,this.ValueBufferType),this.setInterpolation(i||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:zi(e.times,Array),values:zi(e.values,Array)};let i=e.getInterpolation();i!==e.DefaultInterpolation&&(n.interpolation=i),uo(e.settings)&&(n.settings={inTangents:zi(e.settings.inTangents,Array),outTangents:zi(e.settings.outTangents,Array)})}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new zo(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new aa(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Do(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new Uo(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case rs:t=this.InterpolantFactoryMethodDiscrete;break;case as:t=this.InterpolantFactoryMethodLinear;break;case lo:t=this.InterpolantFactoryMethodSmooth;break;case Il:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return Le("KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return rs;case this.InterpolantFactoryMethodLinear:return as;case this.InterpolantFactoryMethodSmooth:return lo;case this.InterpolantFactoryMethodBezier:return Il}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]*=e;uo(this.settings)&&(hd(this.settings.inTangents,e),hd(this.settings.outTangents,e))}return this}trim(e,t){let n=this.times,i=n.length,s=0,a=i-1;for(;s!==i&&n[s]<e;)++s;for(;a!==-1&&n[a]>t;)--a;if(++a,s!==0||a!==i){s>=a&&(a=Math.max(a,1),s=a-1);let c=this.getValueSize();this.times=n.slice(s,a),this.values=this.values.slice(s*c,a*c)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(He("KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,i=this.values,s=n.length;s===0&&(He("KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let c=0;c!==s;c++){let l=n[c];if(typeof l=="number"&&isNaN(l)){He("KeyframeTrack: Time is not a valid number.",this,c,l),e=!1;break}if(a!==null&&a>l){He("KeyframeTrack: Out of order keys.",this,c,l,a),e=!1;break}a=l}if(i!==void 0&&gp(i))for(let c=0,l=i.length;c!==l;++c){let h=i[c];if(isNaN(h)){He("KeyframeTrack: Value is not a valid number.",this,c,h),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),i=this.getInterpolation()===lo,s=e.length-1,a=1;for(let c=1;c<s;++c){let l=!1,h=e[c],o=e[c+1];if(h!==o&&(c!==1||h!==e[0]))if(i)l=!0;else{let u=c*n,d=u-n,f=u+n;for(let m=0;m!==n;++m){let x=t[u+m];if(x!==t[d+m]||x!==t[f+m]){l=!0;break}}}if(l){if(c!==a){e[a]=e[c];let u=c*n,d=a*n;for(let f=0;f!==n;++f)t[d+f]=t[u+f]}++a}}if(s>0){e[a]=e[s];for(let c=s*n,l=a*n,h=0;h!==n;++h)t[l+h]=t[c+h];++a}return a!==e.length?(this.times=e.slice(0,a),this.values=t.slice(0,a*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,i=new n(this.name,e,t);return i.createInterpolant=this.createInterpolant,uo(this.settings)&&(i.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),i}};function hd(r,e){for(let t=0,n=r.length;t!==n;t+=2)r[t]*=e}pn.prototype.ValueTypeName="";pn.prototype.TimeBufferType=Float32Array;pn.prototype.ValueBufferType=Float32Array;pn.prototype.DefaultInterpolation=as;var vi=class extends pn{constructor(e,t,n){super(e,t,n)}};vi.prototype.ValueTypeName="bool";vi.prototype.ValueBufferType=Array;vi.prototype.DefaultInterpolation=rs;vi.prototype.InterpolantFactoryMethodLinear=void 0;vi.prototype.InterpolantFactoryMethodSmooth=void 0;var oa=class extends pn{constructor(e,t,n,i){super(e,t,n,i)}};oa.prototype.ValueTypeName="color";var Mi=class extends pn{constructor(e,t,n,i){super(e,t,n,i)}};Mi.prototype.ValueTypeName="number";var Fo=class extends ei{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){let s=this.resultBuffer,a=this.sampleValues,c=this.valueSize,l=(n-t)/(i-t),h=e*c;for(let o=h+c;h!==o;h+=4)Pt.slerpFlat(s,0,a,h-c,a,h,l);return s}},bi=class extends pn{constructor(e,t,n,i){super(e,t,n,i)}InterpolantFactoryMethodLinear(e){return new Fo(this.times,this.values,this.getValueSize(),e)}};bi.prototype.ValueTypeName="quaternion";bi.prototype.InterpolantFactoryMethodSmooth=void 0;var Ei=class extends pn{constructor(e,t,n){super(e,t,n)}};Ei.prototype.ValueTypeName="string";Ei.prototype.ValueBufferType=Array;Ei.prototype.DefaultInterpolation=rs;Ei.prototype.InterpolantFactoryMethodLinear=void 0;Ei.prototype.InterpolantFactoryMethodSmooth=void 0;var ki=class extends pn{constructor(e,t,n,i){super(e,t,n,i)}};ki.prototype.ValueTypeName="vector";var ds=class{constructor(e="",t=-1,n=[],i=Lc){this.name=e,this.tracks=n,this.duration=t,this.blendMode=i,this.uuid=Rn(),this.userData={},this.duration<0&&this.resetDuration()}static parse(e){let t=[],n=e.tracks,i=1/(e.fps||1);for(let a=0,c=n.length;a!==c;++a)t.push(Dm(n[a]).scale(i));let s=new this(e.name,e.duration,t,e.blendMode);return s.uuid=e.uuid,s.userData=JSON.parse(e.userData||"{}"),s}static toJSON(e){let t=[],n=e.tracks,i={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode,userData:JSON.stringify(e.userData)};for(let s=0,a=n.length;s!==a;++s)t.push(pn.toJSON(n[s]));return i}static CreateFromMorphTargetSequence(e,t,n,i){let s=t.length,a=[];for(let c=0;c<s;c++){let l=[],h=[];l.push((c+s-1)%s,c,(c+1)%s),h.push(0,1,0);let o=Cm(l);l=ld(l,1,o),h=ld(h,1,o),!i&&l[0]===0&&(l.push(s),h.push(h[0])),a.push(new Mi(".morphTargetInfluences["+t[c].name+"]",l,h).scale(1/n))}return new this(e,-1,a)}static findByName(e,t){let n=e;if(!Array.isArray(e)){let i=e;n=i.geometry&&i.geometry.animations||i.animations}for(let i=0;i<n.length;i++)if(n[i].name===t)return n[i];return null}static CreateClipsFromMorphTargetSequences(e,t,n){let i={},s=/^([\w-]*?)([\d]+)$/;for(let c=0,l=e.length;c<l;c++){let h=e[c],o=h.name.match(s);if(o&&o.length>1){let u=o[1],d=i[u];d||(i[u]=d=[]),d.push(h)}}let a=[];for(let c in i)a.push(this.CreateFromMorphTargetSequence(c,i[c],t,n));return a}resetDuration(){let e=this.tracks,t=0;for(let n=0,i=e.length;n!==i;++n){let s=this.tracks[n];t=Math.max(t,s.times[s.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){let e=[];for(let n=0;n<this.tracks.length;n++)e.push(this.tracks[n].clone());let t=new this.constructor(this.name,this.duration,e,this.blendMode);return t.userData=JSON.parse(JSON.stringify(this.userData)),t}toJSON(){return this.constructor.toJSON(this)}};function Nm(r){switch(r.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return Mi;case"vector":case"vector2":case"vector3":case"vector4":return ki;case"color":return oa;case"quaternion":return bi;case"bool":case"boolean":return vi;case"string":return Ei}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+r)}function Dm(r){if(r.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");let e=Nm(r.type);if(r.times===void 0){let n=[],i=[];Im(r.keys,n,i,"value"),r.times=n,r.values=i}let t;return e.parse!==void 0?t=e.parse(r):t=new e(r.name,r.times,r.values,r.interpolation),uo(r.settings)&&(t.settings={inTangents:zi(r.settings.inTangents,Float32Array),outTangents:zi(r.settings.outTangents,Float32Array)}),t}var Jn={enabled:!1,files:{},add:function(r,e){this.enabled!==!1&&(ud(r)||(this.files[r]=e))},get:function(r){if(this.enabled!==!1&&!ud(r))return this.files[r]},remove:function(r){delete this.files[r]},clear:function(){this.files={}}};function ud(r){try{let e=r.slice(r.indexOf(":")+1);return new URL(e).protocol==="blob:"}catch{return!1}}var Bo=class{constructor(e,t,n){let i=this,s=!1,a=0,c=0,l,h=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this._abortController=null,this.itemStart=function(o){c++,s===!1&&i.onStart!==void 0&&i.onStart(o,a,c),s=!0},this.itemEnd=function(o){a++,i.onProgress!==void 0&&i.onProgress(o,a,c),a===c&&(s=!1,i.onLoad!==void 0&&i.onLoad())},this.itemError=function(o){i.onError!==void 0&&i.onError(o)},this.resolveURL=function(o){return o=o.normalize("NFC"),l?l(o):o},this.setURLModifier=function(o){return l=o,this},this.addHandler=function(o,u){return h.push(o,u),this},this.removeHandler=function(o){let u=h.indexOf(o);return u!==-1&&h.splice(u,2),this},this.getHandler=function(o){for(let u=0,d=h.length;u<d;u+=2){let f=h[u],m=h[u+1];if(f.global&&(f.lastIndex=0),f.test(o))return m}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},uf=new Bo,ti=class{constructor(e){this.manager=e!==void 0?e:uf,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){let n=this;return new Promise(function(i,s){n.load(e,i,t,s)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};ti.DEFAULT_MATERIAL_NAME="__DEFAULT";var gi={},Ul=class extends Error{constructor(e,t){super(e),this.response=t}},ar=class extends ti{constructor(e){super(e),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let s=Jn.get(`file:${e}`);if(s!==void 0){this.manager.itemStart(e),setTimeout(()=>{t&&t(s),this.manager.itemEnd(e)},0);return}if(gi[e]!==void 0){gi[e].push({onLoad:t,onProgress:n,onError:i});return}gi[e]=[],gi[e].push({onLoad:t,onProgress:n,onError:i});let a=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),c=this.mimeType,l=this.responseType;fetch(a).then(h=>{if(h.status===200||h.status===0){if(h.status===0&&Le("FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||h.body===void 0||h.body.getReader===void 0)return h;let o=gi[e],u=h.body.getReader(),d=h.headers.get("X-File-Size")||h.headers.get("Content-Length"),f=d?parseInt(d):0,m=f!==0,x=0,p=new ReadableStream({start(g){y();function y(){u.read().then(({done:b,value:M})=>{if(b)g.close();else{x+=M.byteLength;let w=new ProgressEvent("progress",{lengthComputable:m,loaded:x,total:f});for(let S=0,T=o.length;S<T;S++){let _=o[S];_.onProgress&&_.onProgress(w)}g.enqueue(M),y()}},b=>{g.error(b)})}}});return new Response(p)}else throw new Ul(`fetch for "${h.url}" responded with ${h.status}: ${h.statusText}`,h)}).then(h=>{switch(l){case"arraybuffer":return h.arrayBuffer();case"blob":return h.blob();case"document":return h.text().then(o=>new DOMParser().parseFromString(o,c));case"json":return h.json();default:if(c==="")return h.text();{let u=/charset="?([^;"\s]*)"?/i.exec(c),d=u&&u[1]?u[1].toLowerCase():void 0,f=new TextDecoder(d);return h.arrayBuffer().then(m=>f.decode(m))}}}).then(h=>{Jn.add(`file:${e}`,h);let o=gi[e];delete gi[e];for(let u=0,d=o.length;u<d;u++){let f=o[u];f.onLoad&&f.onLoad(h)}}).catch(h=>{let o=gi[e];if(o===void 0)throw this.manager.itemError(e),h;delete gi[e];for(let u=0,d=o.length;u<d;u++){let f=o[u];f.onError&&f.onError(h)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}};var Os=new WeakMap,Oo=class extends ti{constructor(e){super(e)}load(e,t,n,i){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let s=this,a=Jn.get(`image:${e}`);if(a!==void 0){if(a.complete===!0)s.manager.itemStart(e),setTimeout(function(){t&&t(a),s.manager.itemEnd(e)},0);else{let u=Os.get(a);u===void 0&&(u=[],Os.set(a,u)),u.push({onLoad:t,onError:i})}return a}let c=qs("img");function l(){o(),t&&t(this);let u=Os.get(this)||[];for(let d=0;d<u.length;d++){let f=u[d];f.onLoad&&f.onLoad(this)}Os.delete(this),s.manager.itemEnd(e)}function h(u){o(),i&&i(u),Jn.remove(`image:${e}`);let d=Os.get(this)||[];for(let f=0;f<d.length;f++){let m=d[f];m.onError&&m.onError(u)}Os.delete(this),s.manager.itemError(e),s.manager.itemEnd(e)}function o(){c.removeEventListener("load",l,!1),c.removeEventListener("error",h,!1)}return c.addEventListener("load",l,!1),c.addEventListener("error",h,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(c.crossOrigin=this.crossOrigin),Jn.add(`image:${e}`,c),s.manager.itemStart(e),c.src=e,c}};var Gi=class extends ti{constructor(e){super(e)}load(e,t,n,i){let s=new Wt,a=new Oo(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(c){s.image=c,s.needsUpdate=!0,t!==void 0&&t(s)},n,i),s}},fs=class extends It{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Ae(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}},Vi=class extends fs{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(It.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Ae(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){let t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}},Al=new Fe,dd=new L,fd=new L,or=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ae(512,512),this.mapType=mn,this.map=null,this.mapPass=null,this.matrix=new Fe,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Qs,this._frameExtents=new ae(1,1),this._viewportCount=1,this._viewports=[new vt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera;dd.setFromMatrixPosition(e.matrixWorld),t.position.copy(dd),fd.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(fd),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,n,i){Al.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),n.setFromProjectionMatrix(Al,e.coordinateSystem,e.reversedDepth);let s=this._frameExtents,a=i?i.z/s.x:1,c=i?i.w/s.y:1,l=i?i.x/s.x:0,h=i?i.y/s.y:0;e.coordinateSystem===Xs||e.reversedDepth?t.set(.5*a,0,0,.5*a+l,0,.5*c,0,.5*c+h,0,0,1,0,0,0,0,1):t.set(.5*a,0,0,.5*a+l,0,.5*c,0,.5*c+h,0,0,.5,.5,0,0,0,1),t.multiply(Al)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},oo=new L,co=new Pt,$n=new L,ca=class extends It{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Fe,this.projectionMatrix=new Fe,this.projectionMatrixInverse=new Fe,this.coordinateSystem=On,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(oo,co,$n),$n.x===1&&$n.y===1&&$n.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(oo,co,$n.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(oo,co,$n),$n.x===1&&$n.y===1&&$n.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(oo,co,$n.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},Di=new L,pd=new ae,md=new ae,kt=class extends ca{constructor(e=50,t=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=os*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(Dr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return os*2*Math.atan(Math.tan(Dr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Di.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Di.x,Di.y).multiplyScalar(-e/Di.z),Di.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Di.x,Di.y).multiplyScalar(-e/Di.z)}getViewSize(e,t){return this.getViewBounds(e,pd,md),t.subVectors(md,pd)}setViewOffset(e,t,n,i,s,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(Dr*.5*this.fov)/this.zoom,n=2*t,i=this.aspect*n,s=-.5*i,a=this.view;if(this.view!==null&&this.view.enabled){let l=a.fullWidth,h=a.fullHeight;s+=a.offsetX*i/l,t-=a.offsetY*n/h,i*=a.width/l,n*=a.height/h}let c=this.filmOffset;c!==0&&(s+=e*c/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+i,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},Fl=class extends or{constructor(){super(new kt(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){let t=this.camera,n=os*2*e.angle*this.focus,i=this.mapSize.width/this.mapSize.height*this.aspect,s=e.distance||t.far;(n!==t.fov||i!==t.aspect||s!==t.far)&&(t.fov=n,t.aspect=i,t.far=s,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this.aspect=e.aspect,this}toJSON(){let e=super.toJSON();return e.focus=this.focus,e.aspect=this.aspect,e}},la=class extends fs{constructor(e,t,n=0,i=Math.PI/3,s=0,a=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(It.DEFAULT_UP),this.updateMatrix(),this.target=new It,this.distance=n,this.angle=i,this.penumbra=s,this.decay=a,this.map=null,this.shadow=new Fl}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.map=e.map,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.angle=this.angle,t.object.decay=this.decay,t.object.penumbra=this.penumbra,t.object.target=this.target.uuid,this.map&&this.map.isTexture&&(t.object.map=this.map.toJSON(e).uuid),t.object.shadow=this.shadow.toJSON(),t}},Bl=class extends or{constructor(){super(new kt(90,1,.5,500)),this.isPointLightShadow=!0}},ha=class extends fs{constructor(e,t,n=0,i=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new Bl}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}},Wi=class extends ca{constructor(e=-1,t=1,n=1,i=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=i,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,i,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2,s=n-e,a=n+e,c=i+t,l=i-t;if(this.view!==null&&this.view.enabled){let h=(this.right-this.left)/this.view.fullWidth/this.zoom,o=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=h*this.view.offsetX,a=s+h*this.view.width,c-=o*this.view.offsetY,l=c-o*this.view.height}this.projectionMatrix.makeOrthographic(s,a,c,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},Ol=class extends or{constructor(){super(new Wi(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Vn=class extends fs{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(It.DEFAULT_UP),this.updateMatrix(),this.target=new It,this.shadow=new Ol}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}};var Si=class{static extractUrlBase(e){let t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}};var Rl=new WeakMap,ua=class extends ti{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&Le("ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&Le("ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"},this._abortController=new AbortController}setOptions(e){return this.options=e,this}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let s=this,a=Jn.get(`image-bitmap:${e}`);if(a!==void 0){if(s.manager.itemStart(e),a.then){a.then(h=>{Rl.has(a)===!0?(i&&i(Rl.get(a)),s.manager.itemError(e),s.manager.itemEnd(e)):(t&&t(h),s.manager.itemEnd(e))});return}setTimeout(function(){t&&t(a),s.manager.itemEnd(e)},0);return}let c={};c.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",c.headers=this.requestHeader,c.signal=typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;let l=fetch(e,c).then(function(h){return h.blob()}).then(function(h){return createImageBitmap(h,Object.assign({},s.options,{colorSpaceConversion:"none"}))}).then(function(h){return Jn.add(`image-bitmap:${e}`,h),t&&t(h),s.manager.itemEnd(e),h}).catch(function(h){i&&i(h),Rl.set(l,h),Jn.remove(`image-bitmap:${e}`),s.manager.itemError(e),s.manager.itemEnd(e)});Jn.add(`image-bitmap:${e}`,l),s.manager.itemStart(e)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}};var Hs=-90,ks=1,Ho=class extends It{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let i=new kt(Hs,ks,e,t);i.layers=this.layers,this.add(i);let s=new kt(Hs,ks,e,t);s.layers=this.layers,this.add(s);let a=new kt(Hs,ks,e,t);a.layers=this.layers,this.add(a);let c=new kt(Hs,ks,e,t);c.layers=this.layers,this.add(c);let l=new kt(Hs,ks,e,t);l.layers=this.layers,this.add(l);let h=new kt(Hs,ks,e,t);h.layers=this.layers,this.add(h)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,i,s,a,c,l]=t;for(let h of t)this.remove(h);if(e===On)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),c.up.set(0,1,0),c.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Xs)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),c.up.set(0,-1,0),c.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let h of t)this.add(h),h.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[s,a,c,l,h,o]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),m=e.xr.enabled;e.xr.enabled=!1;let x=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let p=!1;e.isWebGLRenderer===!0?p=e.state.buffers.depth.getReversed():p=e.reversedDepthBuffer,e.setRenderTarget(n,0,i),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,s),e.setRenderTarget(n,1,i),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,i),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),e.setRenderTarget(n,3,i),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(n,4,i),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,h),n.texture.generateMipmaps=x,e.setRenderTarget(n,5,i),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(u,d,f),e.xr.enabled=m,n.texture.needsPMREMUpdate=!0}},ko=class extends kt{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}};var Go=class{constructor(e,t,n){this.binding=e,this.valueSize=n;let i,s,a;switch(t){case"quaternion":i=this._slerp,s=this._slerpAdditive,a=this._setAdditiveIdentityQuaternion,this.buffer=new Float64Array(n*6),this._workIndex=5;break;case"string":case"bool":i=this._select,s=this._select,a=this._setAdditiveIdentityOther,this.buffer=new Array(n*5);break;default:i=this._lerp,s=this._lerpAdditive,a=this._setAdditiveIdentityNumeric,this.buffer=new Float64Array(n*5)}this._mixBufferRegion=i,this._mixBufferRegionAdditive=s,this._setIdentity=a,this._origIndex=3,this._addIndex=4,this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,this.useCount=0,this.referenceCount=0}accumulate(e,t){let n=this.buffer,i=this.valueSize,s=e*i+i,a=this.cumulativeWeight;if(a===0){for(let c=0;c!==i;++c)n[s+c]=n[c];a=t}else{a+=t;let c=t/a;this._mixBufferRegion(n,s,0,c,i)}this.cumulativeWeight=a}accumulateAdditive(e){let t=this.buffer,n=this.valueSize,i=n*this._addIndex;this.cumulativeWeightAdditive===0&&this._setIdentity(),this._mixBufferRegionAdditive(t,i,0,e,n),this.cumulativeWeightAdditive+=e}apply(e){let t=this.valueSize,n=this.buffer,i=e*t+t,s=this.cumulativeWeight,a=this.cumulativeWeightAdditive,c=this.binding;if(this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,s<1){let l=t*this._origIndex;this._mixBufferRegion(n,i,l,1-s,t)}a>0&&this._mixBufferRegionAdditive(n,i,this._addIndex*t,1,t);for(let l=t,h=t+t;l!==h;++l)if(n[l]!==n[l+t]){c.setValue(n,i);break}}saveOriginalState(){let e=this.binding,t=this.buffer,n=this.valueSize,i=n*this._origIndex;e.getValue(t,i);for(let s=n,a=i;s!==a;++s)t[s]=t[i+s%n];this._setIdentity(),this.cumulativeWeight=0,this.cumulativeWeightAdditive=0}restoreOriginalState(){let e=this.valueSize*3;this.binding.setValue(this.buffer,e)}_setAdditiveIdentityNumeric(){let e=this._addIndex*this.valueSize,t=e+this.valueSize;for(let n=e;n<t;n++)this.buffer[n]=0}_setAdditiveIdentityQuaternion(){this._setAdditiveIdentityNumeric(),this.buffer[this._addIndex*this.valueSize+3]=1}_setAdditiveIdentityOther(){let e=this._origIndex*this.valueSize,t=this._addIndex*this.valueSize;for(let n=0;n<this.valueSize;n++)this.buffer[t+n]=this.buffer[e+n]}_select(e,t,n,i,s){if(i>=.5)for(let a=0;a!==s;++a)e[t+a]=e[n+a]}_slerp(e,t,n,i){Pt.slerpFlat(e,t,e,t,e,n,i)}_slerpAdditive(e,t,n,i,s){let a=this._workIndex*s;Pt.multiplyQuaternionsFlat(e,a,e,t,e,n),Pt.slerpFlat(e,t,e,t,e,a,i)}_lerp(e,t,n,i,s){let a=1-i;for(let c=0;c!==s;++c){let l=t+c;e[l]=e[l]*a+e[n+c]*i}}_lerpAdditive(e,t,n,i,s){for(let a=0;a!==s;++a){let c=t+a;e[c]=e[c]+e[n+a]*i}}},ph="\\[\\]\\.:\\/",zm=new RegExp("["+ph+"]","g"),mh="[^"+ph+"]",Um="[^"+ph.replace("\\.","")+"]",Fm=/((?:WC+[\/:])*)/.source.replace("WC",mh),Bm=/(WCOD+)?/.source.replace("WCOD",Um),Om=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",mh),Hm=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",mh),km=new RegExp("^"+Fm+Bm+Om+Hm+"$"),Gm=["material","materials","bones","map"],Hl=class{constructor(e,t,n){let i=n||bt.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,i)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,i=this._bindings[n];i!==void 0&&i.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let i=this._targetGroup.nCachedObjects_,s=n.length;i!==s;++i)n[i].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},bt=class r{constructor(e,t,n){this.path=t,this.parsedPath=n||r.parseTrackName(t),this.node=r.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new r.Composite(e,t,n):new r(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(zm,"")}static parseTrackName(e){let t=km.exec(e);if(t===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},i=n.nodeName&&n.nodeName.lastIndexOf(".");if(i!==void 0&&i!==-1){let s=n.nodeName.substring(i+1);Gm.indexOf(s)!==-1&&(n.nodeName=n.nodeName.substring(0,i),n.objectName=s)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(s){for(let a=0;a<s.length;a++){let c=s[a];if(c.name===t||c.uuid===t)return c;let l=n(c.children);if(l)return l}return null},i=n(e.children);if(i)return i}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)e[t++]=n[i]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,i=t.propertyName,s=t.propertyIndex;if(e||(e=r.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){Le("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let h=t.objectIndex;switch(n){case"materials":if(!e.material){He("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){He("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){He("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let o=0;o<e.length;o++)if(e[o].name===h){h=o;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){He("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){He("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){He("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(h!==void 0){if(e[h]===void 0){He("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[h]}}let a=e[i];if(a===void 0){let h=t.nodeName;He("PropertyBinding: Trying to update property for track: "+h+"."+i+" but it wasn't found.",e);return}let c=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?c=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(c=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(s!==void 0){if(i==="morphTargetInfluences"){if(!e.geometry){He("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){He("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[s]!==void 0&&(s=e.morphTargetDictionary[s])}l=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=s}else a.fromArray!==void 0&&a.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(l=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=i;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][c]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};bt.Composite=Hl;bt.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};bt.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};bt.prototype.GetterByBindingType=[bt.prototype._getValue_direct,bt.prototype._getValue_array,bt.prototype._getValue_arrayElement,bt.prototype._getValue_toArray];bt.prototype.SetterByBindingTypeAndVersioning=[[bt.prototype._setValue_direct,bt.prototype._setValue_direct_setNeedsUpdate,bt.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[bt.prototype._setValue_array,bt.prototype._setValue_array_setNeedsUpdate,bt.prototype._setValue_array_setMatrixWorldNeedsUpdate],[bt.prototype._setValue_arrayElement,bt.prototype._setValue_arrayElement_setNeedsUpdate,bt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[bt.prototype._setValue_fromArray,bt.prototype._setValue_fromArray_setNeedsUpdate,bt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var Vo=class{constructor(e,t,n=null,i=t.blendMode){this._mixer=e,this._clip=t,this._localRoot=n,this.blendMode=i;let s=t.tracks,a=s.length,c=new Array(a),l={endingStart:ts,endingEnd:ts};for(let h=0;h!==a;++h){let o=s[h].createInterpolant(null);c[h]=o,o.settings=l}this._interpolantSettings=l,this._interpolants=c,this._propertyBindings=new Array(a),this._cacheIndex=null,this._byClipCacheIndex=null,this._timeScaleInterpolant=null,this._restoreTimeScale=null,this._weightInterpolant=null,this.loop=Pc,this._loopCount=-1,this._startTime=null,this.time=0,this.timeScale=1,this._effectiveTimeScale=1,this.weight=1,this._effectiveWeight=1,this.repetitions=1/0,this.paused=!1,this.enabled=!0,this.clampWhenFinished=!1,this.zeroSlopeAtStart=!0,this.zeroSlopeAtEnd=!0}play(){return this._mixer._activateAction(this),this}stop(){return this._mixer._deactivateAction(this),this.reset()}reset(){return this.paused=!1,this.enabled=!0,this.time=0,this._loopCount=-1,this._startTime=null,this.stopFading().stopWarping()}isRunning(){return this.enabled&&!this.paused&&this.timeScale!==0&&this._startTime===null&&this._mixer._isActiveAction(this)}isScheduled(){return this._mixer._isActiveAction(this)}startAt(e){return this._startTime=e,this}setLoop(e,t){return this.loop=e,this.repetitions=t,this}setEffectiveWeight(e){return this.weight=e,this._effectiveWeight=this.enabled?e:0,this.stopFading()}getEffectiveWeight(){return this._effectiveWeight}fadeIn(e){return this._scheduleFading(e,0,1)}fadeOut(e){return this._scheduleFading(e,1,0)}crossFadeFrom(e,t,n=!1){if(e.fadeOut(t),this.fadeIn(t),n===!0){let i=this._clip.duration,s=e._clip.duration,a=s/i,c=i/s;e._restoreTimeScale=e.timeScale,this._restoreTimeScale=this.timeScale,e.warp(1,a,t),this.warp(c,1,t)}return this}crossFadeTo(e,t,n=!1){return e.crossFadeFrom(this,t,n)}stopFading(){let e=this._weightInterpolant;return e!==null&&(this._weightInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this}setEffectiveTimeScale(e){return this.timeScale=e,this._effectiveTimeScale=this.paused?0:e,this.stopWarping()}getEffectiveTimeScale(){return this._effectiveTimeScale}setDuration(e){return this.timeScale=this._clip.duration/e,this.stopWarping()}syncWith(e){return this.time=e.time,this.timeScale=e.timeScale,this.stopWarping()}halt(e){return this.warp(this._effectiveTimeScale,0,e)}warp(e,t,n){let i=this._mixer,s=i.time,a=this.timeScale,c=this._timeScaleInterpolant;c===null&&(c=i._lendControlInterpolant(),this._timeScaleInterpolant=c);let l=c.parameterPositions,h=c.sampleValues;return l[0]=s,l[1]=s+n,h[0]=e/a,h[1]=t/a,this}stopWarping(){let e=this._timeScaleInterpolant;return e!==null&&(this._timeScaleInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this._restoreTimeScale=null,this}getMixer(){return this._mixer}getClip(){return this._clip}getRoot(){return this._localRoot||this._mixer._root}_update(e,t,n,i){if(!this.enabled){this._updateWeight(e);return}let s=this._startTime;if(s!==null){let l=(e-s)*n;l<0||n===0?t=0:(this._startTime=null,t=n*l)}t*=this._updateTimeScale(e);let a=this._updateTime(t),c=this._updateWeight(e);if(c>0){let l=this._interpolants,h=this._propertyBindings;switch(this.blendMode){case Gd:for(let o=0,u=l.length;o!==u;++o)l[o].evaluate(a),h[o].accumulateAdditive(c);break;case Lc:default:for(let o=0,u=l.length;o!==u;++o)l[o].evaluate(a),h[o].accumulate(i,c)}}}_updateWeight(e){let t=0;if(this.enabled){t=this.weight;let n=this._weightInterpolant;if(n!==null){let i=n.evaluate(e)[0];t*=i,e>n.parameterPositions[1]&&(this.stopFading(),i===0&&(this.enabled=!1))}}return this._effectiveWeight=t,t}_updateTimeScale(e){let t=0;if(!this.paused){t=this.timeScale;let n=this._timeScaleInterpolant;if(n!==null){let i=n.evaluate(e)[0];t*=i,e>n.parameterPositions[1]&&(t===0?this.paused=!0:(this._restoreTimeScale!==null&&(t=this._restoreTimeScale),this.timeScale=t),this.stopWarping())}}return this._effectiveTimeScale=t,t}_updateTime(e){let t=this._clip.duration,n=this.loop,i=this.time+e,s=this._loopCount,a=n===kd;if(e===0)return s===-1?i:a&&(s&1)===1?t-i:i;if(n===Ic){s===-1&&(this._loopCount=0,this._setEndings(!0,!0,!1));e:{if(i>=t)i=t;else if(i<0)i=0;else{this.time=i;break e}this.clampWhenFinished?this.paused=!0:this.enabled=!1,this.time=i,this._mixer.dispatchEvent({type:"finished",action:this,direction:e<0?-1:1})}}else{if(s===-1&&(e>=0?(s=0,this._setEndings(!0,this.repetitions===0,a)):this._setEndings(this.repetitions===0,!0,a)),i>=t||i<0){let c=Math.floor(i/t);i-=t*c,s+=Math.abs(c);let l=this.repetitions-s;if(l<=0)this.clampWhenFinished?this.paused=!0:this.enabled=!1,i=e>0?t:0,this.time=i,this._mixer.dispatchEvent({type:"finished",action:this,direction:e>0?1:-1});else{if(l===1){let h=e<0;this._setEndings(h,!h,a)}else this._setEndings(!1,!1,a);this._loopCount=s,this.time=i,this._mixer.dispatchEvent({type:"loop",action:this,loopDelta:c})}}else this._loopCount=s,this.time=i;if(a&&(s&1)===1)return t-i}return i}_setEndings(e,t,n){let i=this._interpolantSettings;n?(i.endingStart=ns,i.endingEnd=ns):(e?i.endingStart=this.zeroSlopeAtStart?ns:ts:i.endingStart=Br,t?i.endingEnd=this.zeroSlopeAtEnd?ns:ts:i.endingEnd=Br)}_scheduleFading(e,t,n){let i=this._mixer,s=i.time,a=this._weightInterpolant;a===null&&(a=i._lendControlInterpolant(),this._weightInterpolant=a);let c=a.parameterPositions,l=a.sampleValues;return c[0]=s,l[0]=t,c[1]=s+e,l[1]=n,this}},Vm=new Float32Array(1),da=class extends Hn{constructor(e){super(),this._root=e,this._initMemoryManager(),this._accuIndex=0,this.time=0,this.timeScale=1,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}_bindAction(e,t){let n=e._localRoot||this._root,i=e._clip.tracks,s=i.length,a=e._propertyBindings,c=e._interpolants,l=n.uuid,h=this._bindingsByRootAndName,o=h[l];o===void 0&&(o={},h[l]=o);for(let u=0;u!==s;++u){let d=i[u],f=d.name,m=o[f];if(m!==void 0)++m.referenceCount,a[u]=m;else{if(m=a[u],m!==void 0){m._cacheIndex===null&&(++m.referenceCount,this._addInactiveBinding(m,l,f));continue}let x=t&&t._propertyBindings[u].binding.parsedPath;m=new Go(bt.create(n,f,x),d.ValueTypeName,d.getValueSize()),++m.referenceCount,this._addInactiveBinding(m,l,f),a[u]=m}c[u].resultBuffer=m.buffer}}_activateAction(e){if(!this._isActiveAction(e)){if(e._cacheIndex===null){let n=(e._localRoot||this._root).uuid,i=e._clip.uuid,s=this._actionsByClip[i];this._bindAction(e,s&&s.knownActions[0]),this._addInactiveAction(e,i,n)}let t=e._propertyBindings;for(let n=0,i=t.length;n!==i;++n){let s=t[n];s.useCount++===0&&(this._lendBinding(s),s.saveOriginalState())}this._lendAction(e)}}_deactivateAction(e){if(this._isActiveAction(e)){let t=e._propertyBindings;for(let n=0,i=t.length;n!==i;++n){let s=t[n];--s.useCount===0&&(s.restoreOriginalState(),this._takeBackBinding(s))}this._takeBackAction(e)}}_initMemoryManager(){this._actions=[],this._nActiveActions=0,this._actionsByClip={},this._bindings=[],this._nActiveBindings=0,this._bindingsByRootAndName={},this._controlInterpolants=[],this._nActiveControlInterpolants=0;let e=this;this.stats={actions:{get total(){return e._actions.length},get inUse(){return e._nActiveActions}},bindings:{get total(){return e._bindings.length},get inUse(){return e._nActiveBindings}},controlInterpolants:{get total(){return e._controlInterpolants.length},get inUse(){return e._nActiveControlInterpolants}}}}_isActiveAction(e){let t=e._cacheIndex;return t!==null&&t<this._nActiveActions}_addInactiveAction(e,t,n){let i=this._actions,s=this._actionsByClip,a=s[t];if(a===void 0)a={knownActions:[e],actionByRoot:{}},e._byClipCacheIndex=0,s[t]=a;else{let c=a.knownActions;e._byClipCacheIndex=c.length,c.push(e)}e._cacheIndex=i.length,i.push(e),a.actionByRoot[n]=e}_removeInactiveAction(e){let t=this._actions,n=t[t.length-1],i=e._cacheIndex;n._cacheIndex=i,t[i]=n,t.pop(),e._cacheIndex=null;let s=e._clip.uuid,a=this._actionsByClip,c=a[s],l=c.knownActions,h=l[l.length-1],o=e._byClipCacheIndex;h._byClipCacheIndex=o,l[o]=h,l.pop(),e._byClipCacheIndex=null;let u=c.actionByRoot,d=(e._localRoot||this._root).uuid;delete u[d],l.length===0&&delete a[s],this._removeInactiveBindingsForAction(e)}_removeInactiveBindingsForAction(e){let t=e._propertyBindings;for(let n=0,i=t.length;n!==i;++n){let s=t[n];--s.referenceCount===0&&this._removeInactiveBinding(s)}}_lendAction(e){let t=this._actions,n=e._cacheIndex,i=this._nActiveActions++,s=t[i];e._cacheIndex=i,t[i]=e,s._cacheIndex=n,t[n]=s}_takeBackAction(e){let t=this._actions,n=e._cacheIndex,i=--this._nActiveActions,s=t[i];e._cacheIndex=i,t[i]=e,s._cacheIndex=n,t[n]=s}_addInactiveBinding(e,t,n){let i=this._bindingsByRootAndName,s=this._bindings,a=i[t];a===void 0&&(a={},i[t]=a),a[n]=e,e._cacheIndex=s.length,s.push(e)}_removeInactiveBinding(e){let t=this._bindings,n=e.binding,i=n.rootNode.uuid,s=n.path,a=this._bindingsByRootAndName,c=a[i],l=t[t.length-1],h=e._cacheIndex;l._cacheIndex=h,t[h]=l,t.pop(),delete c[s],Object.keys(c).length===0&&delete a[i]}_lendBinding(e){let t=this._bindings,n=e._cacheIndex,i=this._nActiveBindings++,s=t[i];e._cacheIndex=i,t[i]=e,s._cacheIndex=n,t[n]=s}_takeBackBinding(e){let t=this._bindings,n=e._cacheIndex,i=--this._nActiveBindings,s=t[i];e._cacheIndex=i,t[i]=e,s._cacheIndex=n,t[n]=s}_lendControlInterpolant(){let e=this._controlInterpolants,t=this._nActiveControlInterpolants++,n=e[t];return n===void 0&&(n=new aa(new Float32Array(2),new Float32Array(2),1,Vm),n.__cacheIndex=t,e[t]=n),n}_takeBackControlInterpolant(e){let t=this._controlInterpolants,n=e.__cacheIndex,i=--this._nActiveControlInterpolants,s=t[i];e.__cacheIndex=i,t[i]=e,s.__cacheIndex=n,t[n]=s}clipAction(e,t,n){let i=t||this._root,s=i.uuid,a=typeof e=="string"?ds.findByName(i,e):e,c=a!==null?a.uuid:e,l=this._actionsByClip[c],h=null;if(n===void 0&&(a!==null?n=a.blendMode:n=Lc),l!==void 0){let u=l.actionByRoot[s];if(u!==void 0&&u.blendMode===n)return u;h=l.knownActions[0],a===null&&(a=h._clip)}if(a===null)return null;let o=new Vo(this,a,t,n);return this._bindAction(o,h),this._addInactiveAction(o,c,s),o}existingAction(e,t){let n=t||this._root,i=n.uuid,s=typeof e=="string"?ds.findByName(n,e):e,a=s?s.uuid:e,c=this._actionsByClip[a];return c!==void 0&&c.actionByRoot[i]||null}stopAllAction(){let e=this._actions,t=this._nActiveActions;for(let n=t-1;n>=0;--n)e[n].stop();return this}update(e){e*=this.timeScale;let t=this._actions,n=this._nActiveActions,i=this.time+=e,s=Math.sign(e),a=this._accuIndex^=1;for(let h=0;h!==n;++h)t[h]._update(i,e,s,a);let c=this._bindings,l=this._nActiveBindings;for(let h=0;h!==l;++h)c[h].apply(a);return this}setTime(e){this.time=0;for(let t=0;t<this._actions.length;t++)this._actions[t].time=0;return this.update(e)}getRoot(){return this._root}uncacheClip(e){let t=this._actions,n=e.uuid,i=this._actionsByClip,s=i[n];if(s!==void 0){let a=s.knownActions;for(let c=0,l=a.length;c!==l;++c){let h=a[c];this._deactivateAction(h);let o=h._cacheIndex,u=t[t.length-1];h._cacheIndex=null,h._byClipCacheIndex=null,u._cacheIndex=o,t[o]=u,t.pop(),this._removeInactiveBindingsForAction(h)}delete i[n]}}uncacheRoot(e){let t=e.uuid,n=this._actionsByClip;for(let a in n){let c=n[a].actionByRoot,l=c[t];l!==void 0&&(this._deactivateAction(l),this._removeInactiveAction(l))}let i=this._bindingsByRootAndName,s=i[t];if(s!==void 0)for(let a in s){let c=s[a];c.restoreOriginalState(),this._removeInactiveBinding(c)}}uncacheAction(e,t){let n=this.existingAction(e,t);n!==null&&(this._deactivateAction(n),this._removeInactiveAction(n))}};var gd=new Fe,fa=class{constructor(e,t,n=0,i=1/0){this.ray=new Bi(e,t),this.near=n,this.far=i,this.camera=null,this.layers=new Ks,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,t.projectionMatrix.elements[14]).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):He("Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return gd.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(gd),this}intersectObject(e,t=!0,n=[]){return kl(e,this,n,t),n.sort(xd),n}intersectObjects(e,t=!0,n=[]){for(let i=0,s=e.length;i<s;i++)kl(e[i],this,n,t);return n.sort(xd),n}};function xd(r,e){return r.distance-e.distance}function kl(r,e,t,n){let i=!0;if(r.layers.test(e.layers)&&r.raycast(e,t)===!1&&(i=!1),i===!0&&n===!0){let s=r.children;for(let a=0,c=s.length;a<c;a++)kl(s[a],e,t,!0)}}var Gl=class r{static{r.prototype.isMatrix2=!0}constructor(e,t,n,i){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,i)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,i){let s=this.elements;return s[0]=e,s[2]=t,s[1]=n,s[3]=i,this}};function gh(r,e,t,n){let i=Wm(n);switch(t){case ah:return r*e;case $o:return r*e/i.components*i.byteLength;case Jo:return r*e/i.components*i.byteLength;case Zi:return r*e*2/i.components*i.byteLength;case jo:return r*e*2/i.components*i.byteLength;case oh:return r*e*3/i.components*i.byteLength;case bn:return r*e*4/i.components*i.byteLength;case Qo:return r*e*4/i.components*i.byteLength;case ga:case xa:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*8;case ya:case _a:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*16;case tc:case ic:return Math.max(r,16)*Math.max(e,8)/4;case ec:case nc:return Math.max(r,8)*Math.max(e,8)/2;case sc:case rc:case oc:case cc:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*8;case ac:case va:case lc:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*16;case hc:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*16;case uc:return Math.floor((r+4)/5)*Math.floor((e+3)/4)*16;case dc:return Math.floor((r+4)/5)*Math.floor((e+4)/5)*16;case fc:return Math.floor((r+5)/6)*Math.floor((e+4)/5)*16;case pc:return Math.floor((r+5)/6)*Math.floor((e+5)/6)*16;case mc:return Math.floor((r+7)/8)*Math.floor((e+4)/5)*16;case gc:return Math.floor((r+7)/8)*Math.floor((e+5)/6)*16;case xc:return Math.floor((r+7)/8)*Math.floor((e+7)/8)*16;case yc:return Math.floor((r+9)/10)*Math.floor((e+4)/5)*16;case _c:return Math.floor((r+9)/10)*Math.floor((e+5)/6)*16;case vc:return Math.floor((r+9)/10)*Math.floor((e+7)/8)*16;case Mc:return Math.floor((r+9)/10)*Math.floor((e+9)/10)*16;case bc:return Math.floor((r+11)/12)*Math.floor((e+9)/10)*16;case Ec:return Math.floor((r+11)/12)*Math.floor((e+11)/12)*16;case Sc:case Tc:case wc:return Math.ceil(r/4)*Math.ceil(e/4)*16;case Ac:case Rc:return Math.ceil(r/4)*Math.ceil(e/4)*8;case Ma:case Cc:return Math.ceil(r/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Wm(r){switch(r){case mn:case nh:return{byteLength:1,components:1};case ur:case ih:case Yn:return{byteLength:2,components:1};case Zo:case Ko:return{byteLength:2,components:4};case qn:case Yo:case Mn:return{byteLength:4,components:1};case sh:case rh:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${r}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"186"}}));typeof window<"u"&&(window.__THREE__?Le("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="186");function Nf(){let r=null,e=!1,t=null,n=null;function i(s,a){n=r.requestAnimationFrame(i),t(s,a)}return{start:function(){e!==!0&&t!==null&&r!==null&&(n=r.requestAnimationFrame(i),e=!0)},stop:function(){r!==null&&r.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){r=s}}}function qm(r){let e=new WeakMap;function t(c,l){let h=c.array,o=c.usage,u=h.byteLength,d=r.createBuffer();r.bindBuffer(l,d),r.bufferData(l,h,o),c.onUploadCallback();let f;if(h instanceof Float32Array)f=r.FLOAT;else if(typeof Float16Array<"u"&&h instanceof Float16Array)f=r.HALF_FLOAT;else if(h instanceof Uint16Array)c.isFloat16BufferAttribute?f=r.HALF_FLOAT:f=r.UNSIGNED_SHORT;else if(h instanceof Int16Array)f=r.SHORT;else if(h instanceof Uint32Array)f=r.UNSIGNED_INT;else if(h instanceof Int32Array)f=r.INT;else if(h instanceof Int8Array)f=r.BYTE;else if(h instanceof Uint8Array)f=r.UNSIGNED_BYTE;else if(h instanceof Uint8ClampedArray)f=r.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+h);return{buffer:d,type:f,bytesPerElement:h.BYTES_PER_ELEMENT,version:c.version,size:u}}function n(c,l,h){let o=l.array,u=l.updateRanges;if(r.bindBuffer(h,c),u.length===0)r.bufferSubData(h,0,o);else{u.sort((f,m)=>f.start-m.start);let d=0;for(let f=1;f<u.length;f++){let m=u[d],x=u[f];x.start<=m.start+m.count+1?m.count=Math.max(m.count,x.start+x.count-m.start):(++d,u[d]=x)}u.length=d+1;for(let f=0,m=u.length;f<m;f++){let x=u[f];r.bufferSubData(h,x.start*o.BYTES_PER_ELEMENT,o,x.start,x.count)}l.clearUpdateRanges()}l.onUploadCallback()}function i(c){return c.isInterleavedBufferAttribute&&(c=c.data),e.get(c)}function s(c){c.isInterleavedBufferAttribute&&(c=c.data);let l=e.get(c);l&&(r.deleteBuffer(l.buffer),e.delete(c))}function a(c,l){if(c.isInterleavedBufferAttribute&&(c=c.data),c.isGLBufferAttribute){let o=e.get(c);(!o||o.version<c.version)&&e.set(c,{buffer:c.buffer,type:c.type,bytesPerElement:c.elementSize,version:c.version});return}let h=e.get(c);if(h===void 0)e.set(c,t(c,l));else if(h.version<c.version){if(h.size!==c.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(h.buffer,c,l),h.version=c.version}}return{get:i,remove:s,update:a}}var Ym=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Zm=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Km=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,$m=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Jm=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,jm=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Qm=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,eg=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,tg=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,ng=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,ig=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,sg=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,rg=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,ag=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,og=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,cg=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,lg=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,hg=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,ug=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,dg=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,fg=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,pg=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,mg=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,gg=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,xg=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,yg=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,_g=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,vg=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Mg=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,bg=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Eg="gl_FragColor = linearToOutputTexel( gl_FragColor );",Sg=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Tg=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,wg=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,Ag=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Rg=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Cg=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Ig=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Pg=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Lg=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Ng=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Dg=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,zg=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Ug=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Fg=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Bg=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,Og=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_CUBE_UV
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,Hg=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,kg=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Gg=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Vg=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Wg=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Xg=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,qg=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Yg=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Zg=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Kg=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,$g=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Jg=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,jg=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Qg=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,e0=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,t0=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,n0=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,i0=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,s0=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,r0=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,a0=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,o0=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,c0=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,l0=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,h0=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,u0=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,d0=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,f0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,p0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,m0=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,g0=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,x0=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,y0=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,_0=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,v0=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,M0=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,b0=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,E0=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,S0=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,T0=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,w0=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,A0=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,R0=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,C0=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,I0=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,P0=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,L0=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,N0=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,D0=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,z0=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,U0=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,F0=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,B0=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,O0=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,H0=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,k0=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,G0=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,V0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,W0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,X0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,q0=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,Y0=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Z0=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,K0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,$0=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,J0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,j0=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Q0=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,ex=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,tx=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,nx=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,ix=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,sx=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,rx=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,ax=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,ox=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,cx=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,lx=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,hx=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ux=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,dx=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,fx=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,px=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,mx=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,gx=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,xx=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,yx=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,_x=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,vx=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Mx=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,bx=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Ex=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Sx=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Tx=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,wx=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,je={alphahash_fragment:Ym,alphahash_pars_fragment:Zm,alphamap_fragment:Km,alphamap_pars_fragment:$m,alphatest_fragment:Jm,alphatest_pars_fragment:jm,aomap_fragment:Qm,aomap_pars_fragment:eg,batching_pars_vertex:tg,batching_vertex:ng,begin_vertex:ig,beginnormal_vertex:sg,bsdfs:rg,iridescence_fragment:ag,bumpmap_pars_fragment:og,clipping_planes_fragment:cg,clipping_planes_pars_fragment:lg,clipping_planes_pars_vertex:hg,clipping_planes_vertex:ug,color_fragment:dg,color_pars_fragment:fg,color_pars_vertex:pg,color_vertex:mg,common:gg,cube_uv_reflection_fragment:xg,defaultnormal_vertex:yg,displacementmap_pars_vertex:_g,displacementmap_vertex:vg,emissivemap_fragment:Mg,emissivemap_pars_fragment:bg,colorspace_fragment:Eg,colorspace_pars_fragment:Sg,envmap_fragment:Tg,envmap_common_pars_fragment:wg,envmap_pars_fragment:Ag,envmap_pars_vertex:Rg,envmap_physical_pars_fragment:Og,envmap_vertex:Cg,fog_vertex:Ig,fog_pars_vertex:Pg,fog_fragment:Lg,fog_pars_fragment:Ng,gradientmap_pars_fragment:Dg,lightmap_pars_fragment:zg,lights_lambert_fragment:Ug,lights_lambert_pars_fragment:Fg,lights_pars_begin:Bg,lights_toon_fragment:Hg,lights_toon_pars_fragment:kg,lights_phong_fragment:Gg,lights_phong_pars_fragment:Vg,lights_physical_fragment:Wg,lights_physical_pars_fragment:Xg,lights_fragment_begin:qg,lights_fragment_maps:Yg,lights_fragment_end:Zg,lightprobes_pars_fragment:Kg,logdepthbuf_fragment:$g,logdepthbuf_pars_fragment:Jg,logdepthbuf_pars_vertex:jg,logdepthbuf_vertex:Qg,map_fragment:e0,map_pars_fragment:t0,map_particle_fragment:n0,map_particle_pars_fragment:i0,metalnessmap_fragment:s0,metalnessmap_pars_fragment:r0,morphinstance_vertex:a0,morphcolor_vertex:o0,morphnormal_vertex:c0,morphtarget_pars_vertex:l0,morphtarget_vertex:h0,normal_fragment_begin:u0,normal_fragment_maps:d0,normal_pars_fragment:f0,normal_pars_vertex:p0,normal_vertex:m0,normalmap_pars_fragment:g0,clearcoat_normal_fragment_begin:x0,clearcoat_normal_fragment_maps:y0,clearcoat_pars_fragment:_0,iridescence_pars_fragment:v0,opaque_fragment:M0,packing:b0,premultiplied_alpha_fragment:E0,project_vertex:S0,dithering_fragment:T0,dithering_pars_fragment:w0,roughnessmap_fragment:A0,roughnessmap_pars_fragment:R0,shadowmap_pars_fragment:C0,shadowmap_pars_vertex:I0,shadowmap_vertex:P0,shadowmask_pars_fragment:L0,skinbase_vertex:N0,skinning_pars_vertex:D0,skinning_vertex:z0,skinnormal_vertex:U0,specularmap_fragment:F0,specularmap_pars_fragment:B0,tonemapping_fragment:O0,tonemapping_pars_fragment:H0,transmission_fragment:k0,transmission_pars_fragment:G0,uv_pars_fragment:V0,uv_pars_vertex:W0,uv_vertex:X0,worldpos_vertex:q0,background_vert:Y0,background_frag:Z0,backgroundCube_vert:K0,backgroundCube_frag:$0,cube_vert:J0,cube_frag:j0,depth_vert:Q0,depth_frag:ex,distance_vert:tx,distance_frag:nx,equirect_vert:ix,equirect_frag:sx,linedashed_vert:rx,linedashed_frag:ax,meshbasic_vert:ox,meshbasic_frag:cx,meshlambert_vert:lx,meshlambert_frag:hx,meshmatcap_vert:ux,meshmatcap_frag:dx,meshnormal_vert:fx,meshnormal_frag:px,meshphong_vert:mx,meshphong_frag:gx,meshphysical_vert:xx,meshphysical_frag:yx,meshtoon_vert:_x,meshtoon_frag:vx,points_vert:Mx,points_frag:bx,shadow_vert:Ex,shadow_frag:Sx,sprite_vert:Tx,sprite_frag:wx},xe={common:{diffuse:{value:new Ae(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ye},alphaMap:{value:null},alphaMapTransform:{value:new Ye},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ye}},envmap:{envMap:{value:null},envMapRotation:{value:new Ye},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ye}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ye}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ye},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ye},normalScale:{value:new ae(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ye},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ye}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ye}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ye}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ae(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new L},probesMax:{value:new L},probesResolution:{value:new L}},points:{diffuse:{value:new Ae(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ye},alphaTest:{value:0},uvTransform:{value:new Ye}},sprite:{diffuse:{value:new Ae(16777215)},opacity:{value:1},center:{value:new ae(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ye},alphaMap:{value:null},alphaMapTransform:{value:new Ye},alphaTest:{value:0}}},ri={basic:{uniforms:en([xe.common,xe.specularmap,xe.envmap,xe.aomap,xe.lightmap,xe.fog]),vertexShader:je.meshbasic_vert,fragmentShader:je.meshbasic_frag},lambert:{uniforms:en([xe.common,xe.specularmap,xe.envmap,xe.aomap,xe.lightmap,xe.emissivemap,xe.bumpmap,xe.normalmap,xe.displacementmap,xe.fog,xe.lights,{emissive:{value:new Ae(0)},envMapIntensity:{value:1}}]),vertexShader:je.meshlambert_vert,fragmentShader:je.meshlambert_frag},phong:{uniforms:en([xe.common,xe.specularmap,xe.envmap,xe.aomap,xe.lightmap,xe.emissivemap,xe.bumpmap,xe.normalmap,xe.displacementmap,xe.fog,xe.lights,{emissive:{value:new Ae(0)},specular:{value:new Ae(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:je.meshphong_vert,fragmentShader:je.meshphong_frag},standard:{uniforms:en([xe.common,xe.envmap,xe.aomap,xe.lightmap,xe.emissivemap,xe.bumpmap,xe.normalmap,xe.displacementmap,xe.roughnessmap,xe.metalnessmap,xe.fog,xe.lights,{emissive:{value:new Ae(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:je.meshphysical_vert,fragmentShader:je.meshphysical_frag},toon:{uniforms:en([xe.common,xe.aomap,xe.lightmap,xe.emissivemap,xe.bumpmap,xe.normalmap,xe.displacementmap,xe.gradientmap,xe.fog,xe.lights,{emissive:{value:new Ae(0)}}]),vertexShader:je.meshtoon_vert,fragmentShader:je.meshtoon_frag},matcap:{uniforms:en([xe.common,xe.bumpmap,xe.normalmap,xe.displacementmap,xe.fog,{matcap:{value:null}}]),vertexShader:je.meshmatcap_vert,fragmentShader:je.meshmatcap_frag},points:{uniforms:en([xe.points,xe.fog]),vertexShader:je.points_vert,fragmentShader:je.points_frag},dashed:{uniforms:en([xe.common,xe.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:je.linedashed_vert,fragmentShader:je.linedashed_frag},depth:{uniforms:en([xe.common,xe.displacementmap]),vertexShader:je.depth_vert,fragmentShader:je.depth_frag},normal:{uniforms:en([xe.common,xe.bumpmap,xe.normalmap,xe.displacementmap,{opacity:{value:1}}]),vertexShader:je.meshnormal_vert,fragmentShader:je.meshnormal_frag},sprite:{uniforms:en([xe.sprite,xe.fog]),vertexShader:je.sprite_vert,fragmentShader:je.sprite_frag},background:{uniforms:{uvTransform:{value:new Ye},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:je.background_vert,fragmentShader:je.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ye}},vertexShader:je.backgroundCube_vert,fragmentShader:je.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:je.cube_vert,fragmentShader:je.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:je.equirect_vert,fragmentShader:je.equirect_frag},distance:{uniforms:en([xe.common,xe.displacementmap,{referencePosition:{value:new L},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:je.distance_vert,fragmentShader:je.distance_frag},shadow:{uniforms:en([xe.lights,xe.fog,{color:{value:new Ae(0)},opacity:{value:1}}]),vertexShader:je.shadow_vert,fragmentShader:je.shadow_frag}};ri.physical={uniforms:en([ri.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ye},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ye},clearcoatNormalScale:{value:new ae(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ye},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ye},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ye},sheen:{value:0},sheenColor:{value:new Ae(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ye},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ye},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ye},transmissionSamplerSize:{value:new ae},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ye},attenuationDistance:{value:0},attenuationColor:{value:new Ae(0)},specularColor:{value:new Ae(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ye},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ye},anisotropyVector:{value:new ae},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ye}}]),vertexShader:je.meshphysical_vert,fragmentShader:je.meshphysical_frag};var Uc={r:0,b:0,g:0},Ax=new Fe,Df=new Ye;Df.set(-1,0,0,0,1,0,0,0,1);function Rx(r,e,t,n,i,s){let a=new Ae(0),c=i===!0?0:1,l,h,o=null,u=0,d=null;function f(y){let b=y.isScene===!0?y.background:null;if(b&&b.isTexture){let M=y.backgroundBlurriness>0;b=e.get(b,M)}return b}function m(y){let b=!1,M=f(y);M===null?p(a,c):M&&M.isColor&&(p(M,1),b=!0);let w=r.xr.getEnvironmentBlendMode();w==="additive"?t.buffers.color.setClear(0,0,0,1,s):w==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,s),(r.autoClear||b)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),r.clear(r.autoClearColor,r.autoClearDepth,r.autoClearStencil))}function x(y,b){let M=f(b);M&&(M.isCubeTexture||M.mapping===ma)?(h===void 0&&(h=new Z(new ke(1,1,1),new vn({name:"BackgroundCubeMaterial",uniforms:ys(ri.backgroundCube.uniforms),vertexShader:ri.backgroundCube.vertexShader,fragmentShader:ri.backgroundCube.fragmentShader,side:on,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(w,S,T){this.matrixWorld.copyPosition(T.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(h)),h.material.uniforms.envMap.value=M,h.material.uniforms.backgroundBlurriness.value=b.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(Ax.makeRotationFromEuler(b.backgroundRotation)).transpose(),M.isCubeTexture&&M.isRenderTargetTexture===!1&&h.material.uniforms.backgroundRotation.value.premultiply(Df),h.material.toneMapped=Qe.getTransfer(M.colorSpace)!==gt,(o!==M||u!==M.version||d!==r.toneMapping)&&(h.material.needsUpdate=!0,o=M,u=M.version,d=r.toneMapping),h.layers.enableAll(),y.unshift(h,h.geometry,h.material,0,0,null)):M&&M.isTexture&&(l===void 0&&(l=new Z(new ut(2,2),new vn({name:"BackgroundMaterial",uniforms:ys(ri.background.uniforms),vertexShader:ri.background.vertexShader,fragmentShader:ri.background.fragmentShader,side:ni,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=M,l.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,l.material.toneMapped=Qe.getTransfer(M.colorSpace)!==gt,M.matrixAutoUpdate===!0&&M.updateMatrix(),l.material.uniforms.uvTransform.value.copy(M.matrix),(o!==M||u!==M.version||d!==r.toneMapping)&&(l.material.needsUpdate=!0,o=M,u=M.version,d=r.toneMapping),l.layers.enableAll(),y.unshift(l,l.geometry,l.material,0,0,null))}function p(y,b){y.getRGB(Uc,fh(r)),t.buffers.color.setClear(Uc.r,Uc.g,Uc.b,b,s)}function g(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(y,b=1){a.set(y),c=b,p(a,c)},getClearAlpha:function(){return c},setClearAlpha:function(y){c=y,p(a,c)},render:m,addToRenderList:x,dispose:g}}function Cx(r,e){let t=r.getParameter(r.MAX_VERTEX_ATTRIBS),n={},i=d(null),s=i,a=!1;function c(C,I,z,N,F){let D=!1,B=u(C,N,z,I);s!==B&&(s=B,h(s.object)),D=f(C,N,z,F),D&&m(C,N,z,F),F!==null&&e.update(F,r.ELEMENT_ARRAY_BUFFER),(D||a)&&(a=!1,M(C,I,z,N),F!==null&&r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,e.get(F).buffer))}function l(){return r.createVertexArray()}function h(C){return r.bindVertexArray(C)}function o(C){return r.deleteVertexArray(C)}function u(C,I,z,N){let F=N.wireframe===!0,D=n[I.id];D===void 0&&(D={},n[I.id]=D);let B=C.isInstancedMesh===!0?C.id:0,X=D[B];X===void 0&&(X={},D[B]=X);let k=X[z.id];k===void 0&&(k={},X[z.id]=k);let Y=k[F];return Y===void 0&&(Y=d(l()),k[F]=Y),Y}function d(C){let I=[],z=[],N=[];for(let F=0;F<t;F++)I[F]=0,z[F]=0,N[F]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:I,enabledAttributes:z,attributeDivisors:N,object:C,attributes:{},index:null}}function f(C,I,z,N){let F=s.attributes,D=I.attributes,B=0,X=z.getAttributes();for(let k in X)if(X[k].location>=0){let $=F[k],ye=D[k];if(ye===void 0&&(k==="instanceMatrix"&&C.instanceMatrix&&(ye=C.instanceMatrix),k==="instanceColor"&&C.instanceColor&&(ye=C.instanceColor)),$===void 0||$.attribute!==ye||ye&&$.data!==ye.data)return!0;B++}return s.attributesNum!==B||s.index!==N}function m(C,I,z,N){let F={},D=I.attributes,B=0,X=z.getAttributes();for(let k in X)if(X[k].location>=0){let $=D[k];$===void 0&&(k==="instanceMatrix"&&C.instanceMatrix&&($=C.instanceMatrix),k==="instanceColor"&&C.instanceColor&&($=C.instanceColor));let ye={};ye.attribute=$,$&&$.data&&(ye.data=$.data),F[k]=ye,B++}s.attributes=F,s.attributesNum=B,s.index=N}function x(){let C=s.newAttributes;for(let I=0,z=C.length;I<z;I++)C[I]=0}function p(C){g(C,0)}function g(C,I){let z=s.newAttributes,N=s.enabledAttributes,F=s.attributeDivisors;z[C]=1,N[C]===0&&(r.enableVertexAttribArray(C),N[C]=1),F[C]!==I&&(r.vertexAttribDivisor(C,I),F[C]=I)}function y(){let C=s.newAttributes,I=s.enabledAttributes;for(let z=0,N=I.length;z<N;z++)I[z]!==C[z]&&(r.disableVertexAttribArray(z),I[z]=0)}function b(C,I,z,N,F,D,B){B===!0?r.vertexAttribIPointer(C,I,z,F,D):r.vertexAttribPointer(C,I,z,N,F,D)}function M(C,I,z,N){x();let F=N.attributes,D=z.getAttributes(),B=I.defaultAttributeValues;for(let X in D){let k=D[X];if(k.location>=0){let Y=F[X];if(Y===void 0&&(X==="instanceMatrix"&&C.instanceMatrix&&(Y=C.instanceMatrix),X==="instanceColor"&&C.instanceColor&&(Y=C.instanceColor)),Y!==void 0){let $=Y.normalized,ye=Y.itemSize,Me=e.get(Y);if(Me===void 0)continue;let ht=Me.buffer,it=Me.type,ct=Me.bytesPerElement,Q=it===r.INT||it===r.UNSIGNED_INT||Y.gpuType===Yo;if(Y.isInterleavedBufferAttribute){let ne=Y.data,_e=ne.stride,Ge=Y.offset;if(ne.isInstancedInterleavedBuffer){for(let Se=0;Se<k.locationSize;Se++)g(k.location+Se,ne.meshPerAttribute);C.isInstancedMesh!==!0&&N._maxInstanceCount===void 0&&(N._maxInstanceCount=ne.meshPerAttribute*ne.count)}else for(let Se=0;Se<k.locationSize;Se++)p(k.location+Se);r.bindBuffer(r.ARRAY_BUFFER,ht);for(let Se=0;Se<k.locationSize;Se++)b(k.location+Se,ye/k.locationSize,it,$,_e*ct,(Ge+ye/k.locationSize*Se)*ct,Q)}else{if(Y.isInstancedBufferAttribute){for(let ne=0;ne<k.locationSize;ne++)g(k.location+ne,Y.meshPerAttribute);C.isInstancedMesh!==!0&&N._maxInstanceCount===void 0&&(N._maxInstanceCount=Y.meshPerAttribute*Y.count)}else for(let ne=0;ne<k.locationSize;ne++)p(k.location+ne);r.bindBuffer(r.ARRAY_BUFFER,ht);for(let ne=0;ne<k.locationSize;ne++)b(k.location+ne,ye/k.locationSize,it,$,ye*ct,ye/k.locationSize*ne*ct,Q)}}else if(B!==void 0){let $=B[X];if($!==void 0)switch($.length){case 2:r.vertexAttrib2fv(k.location,$);break;case 3:r.vertexAttrib3fv(k.location,$);break;case 4:r.vertexAttrib4fv(k.location,$);break;default:r.vertexAttrib1fv(k.location,$)}}}}y()}function w(){v();for(let C in n){let I=n[C];for(let z in I){let N=I[z];for(let F in N){let D=N[F];for(let B in D)o(D[B].object),delete D[B];delete N[F]}}delete n[C]}}function S(C){if(n[C.id]===void 0)return;let I=n[C.id];for(let z in I){let N=I[z];for(let F in N){let D=N[F];for(let B in D)o(D[B].object),delete D[B];delete N[F]}}delete n[C.id]}function T(C){for(let I in n){let z=n[I];for(let N in z){let F=z[N];if(F[C.id]===void 0)continue;let D=F[C.id];for(let B in D)o(D[B].object),delete D[B];delete F[C.id]}}}function _(C){for(let I in n){let z=n[I],N=C.isInstancedMesh===!0?C.id:0,F=z[N];if(F!==void 0){for(let D in F){let B=F[D];for(let X in B)o(B[X].object),delete B[X];delete F[D]}delete z[N],Object.keys(z).length===0&&delete n[I]}}}function v(){R(),a=!0,s!==i&&(s=i,h(s.object))}function R(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:c,reset:v,resetDefaultState:R,dispose:w,releaseStatesOfGeometry:S,releaseStatesOfObject:_,releaseStatesOfProgram:T,initAttributes:x,enableAttribute:p,disableUnusedAttributes:y}}function Ix(r,e,t){let n;function i(l){n=l}function s(l,h){r.drawArrays(n,l,h),t.update(h,n,1)}function a(l,h,o){o!==0&&(r.drawArraysInstanced(n,l,h,o),t.update(h,n,o))}function c(l,h,o){if(o===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,h,0,o);let d=0;for(let f=0;f<o;f++)d+=h[f];t.update(d,n,1)}this.setMode=i,this.render=s,this.renderInstances=a,this.renderMultiDraw=c}function Px(r,e,t,n){let i;function s(){if(i!==void 0)return i;if(e.has("EXT_texture_filter_anisotropic")===!0){let T=e.get("EXT_texture_filter_anisotropic");i=r.getParameter(T.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function a(T){return!(T!==bn&&n.convert(T)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_FORMAT))}function c(T){let _=T===Yn&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(T!==mn&&T!==Mn&&!_&&n.convert(T)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_TYPE))}function l(T){if(T==="highp"){if(r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.HIGH_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.HIGH_FLOAT).precision>0)return"highp";T="mediump"}return T==="mediump"&&r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.MEDIUM_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let h=t.precision!==void 0?t.precision:"highp",o=l(h);o!==h&&(Le("WebGLRenderer:",h,"not supported, using",o,"instead."),h=o);let u=t.logarithmicDepthBuffer===!0,d=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&d===!1&&Le("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");let f=r.getParameter(r.MAX_TEXTURE_IMAGE_UNITS),m=r.getParameter(r.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=r.getParameter(r.MAX_TEXTURE_SIZE),p=r.getParameter(r.MAX_CUBE_MAP_TEXTURE_SIZE),g=r.getParameter(r.MAX_VERTEX_ATTRIBS),y=r.getParameter(r.MAX_VERTEX_UNIFORM_VECTORS),b=r.getParameter(r.MAX_VARYING_VECTORS),M=r.getParameter(r.MAX_FRAGMENT_UNIFORM_VECTORS),w=r.getParameter(r.MAX_SAMPLES),S=r.getParameter(r.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:c,precision:h,logarithmicDepthBuffer:u,reversedDepthBuffer:d,maxTextures:f,maxVertexTextures:m,maxTextureSize:x,maxCubemapSize:p,maxAttributes:g,maxVertexUniforms:y,maxVaryings:b,maxFragmentUniforms:M,maxSamples:w,samples:S}}function Lx(r){let e=this,t=null,n=0,i=!1,s=!1,a=new Fn,c=new Ye,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){let f=u.length!==0||d||n!==0||i;return i=d,n=u.length,f},this.beginShadows=function(){s=!0,o(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(u,d){t=o(u,d,0)},this.setState=function(u,d,f){let m=u.clippingPlanes,x=u.clipIntersection,p=u.clipShadows,g=r.get(u);if(!i||m===null||m.length===0||s&&!p)s?o(null):h();else{let y=s?0:n,b=y*4,M=g.clippingState||null;l.value=M,M=o(m,d,b,f);for(let w=0;w!==b;++w)M[w]=t[w];g.clippingState=M,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=y}};function h(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function o(u,d,f,m){let x=u!==null?u.length:0,p=null;if(x!==0){if(p=l.value,m!==!0||p===null){let g=f+x*4,y=d.matrixWorldInverse;c.getNormalMatrix(y),(p===null||p.length<g)&&(p=new Float32Array(g));for(let b=0,M=f;b!==x;++b,M+=4)a.copy(u[b]).applyMatrix4(y,c),a.normal.toArray(p,M),p[M+3]=a.constant}l.value=p,l.needsUpdate=!0}return e.numPlanes=x,e.numIntersection=0,p}}var mr=4,Nx=6,Dx=20,zx=256,Sa=new Wi,df=new Ae,xh=null,yh=0,_h=0,vh=!1,Ux=new L,_s=new L,xr=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,i=100,s={}){let{size:a=256,position:c=Ux}=s;xh=this._renderer.getRenderTarget(),yh=this._renderer.getActiveCubeFace(),_h=this._renderer.getActiveMipmapLevel(),vh=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,n,i,l,c),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=mf(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=pf(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(xh,yh,_h),this._renderer.xr.enabled=vh,e.scissorTest=!1,pr(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===qi||e.mapping===gs?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),xh=this._renderer.getRenderTarget(),yh=this._renderer.getActiveCubeFace(),_h=this._renderer.getActiveMipmapLevel(),vh=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:zt,minFilter:zt,generateMipmaps:!1,type:Yn,format:bn,colorSpace:sn,depthBuffer:!1},i=ff(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=ff(e,t,n);let{_lodMax:s}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=Fx(s)),this._blurMaterial=Ox(s,e,t),this._ggxMaterial=Bx(s,e,t)}return i}_compileMaterial(e){let t=new Z(new ot,e);this._renderer.compile(t,Sa)}_sceneToCubeUV(e,t,n,i,s){let l=new kt(90,1,t,n),h=[1,-1,1,1,1,1],o=[1,1,1,-1,-1,-1],u=this._renderer,d=u.autoClear,f=u.toneMapping;u.getClearColor(df),u.toneMapping=Wn,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(i),u.clearDepth(),u.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new Z(new ke,new tt({name:"PMREM.Background",side:on,depthWrite:!1,depthTest:!1})));let x=this._backgroundBox,p=x.material,g=!1,y=e.background;y?y.isColor&&(p.color.copy(y),e.background=null,g=!0):(p.color.copy(df),g=!0);for(let b=0;b<6;b++){let M=b%3;M===0?(l.up.set(0,h[b],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x+o[b],s.y,s.z)):M===1?(l.up.set(0,0,h[b]),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y+o[b],s.z)):(l.up.set(0,h[b],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y,s.z+o[b]));let w=this._cubeSize;pr(i,M*w,b>2?w:0,w,w),u.setRenderTarget(i),g&&u.render(x,l),u.render(e,l)}u.toneMapping=f,u.autoClear=d,e.background=y}_textureToCubeUV(e,t){let n=this._renderer,i=e.mapping===qi||e.mapping===gs;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=mf()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=pf());let s=i?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=s;let c=s.uniforms;c.envMap.value=e;let l=this._cubeSize;pr(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(a,Sa)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let i=this._lodMeshes.length;for(let s=1;s<i;s++)this._applyGGXFilter(e,s-1,s);t.autoClear=n}_applyGGXFilter(e,t,n){let i=this._renderer,s=this._pingPongRenderTarget,a=this._ggxMaterial,c=this._lodMeshes[n];c.material=a;let l=a.uniforms,h=n/(this._lodMeshes.length-1),o=t/(this._lodMeshes.length-1),u=Math.sqrt(h*h-o*o),d=h*1.25,f=u*d,{_lodMax:m}=this,x=this._sizeLods[n],p=3*x*(n>m-mr?n-m+mr:0),g=4*(this._cubeSize-x);l.envMap.value=e.texture,l.roughness.value=f,l.mipInt.value=m-t,pr(s,p,g,3*x,2*x),i.setRenderTarget(s),i.render(c,Sa),l.envMap.value=s.texture,l.roughness.value=0,l.mipInt.value=m-n,pr(e,p,g,3*x,2*x),i.setRenderTarget(e),i.render(c,Sa)}_blur(e,t,n,i){let s=this._pingPongRenderTarget,a=Math.min(i,Math.PI)/Math.SQRT2;this._blurPass(e,s,t,n,a),this._blurPass(s,e,n,n,a)}_blurPass(e,t,n,i,s){let a=this._renderer,c=this._blurMaterial,l=this._lodMeshes[i];l.material=c;let h=c.uniforms;h.envMap.value=e.texture,h.sigma.value=s,h.mipInt.value=this._lodMax-n;let o=this._sizeLods[i],u=3*o*(i>this._lodMax-mr?i-this._lodMax+mr:0),d=4*(this._cubeSize-o);pr(t,u,d,3*o,2*o),a.setRenderTarget(t),a.render(l,Sa)}};function Fx(r){let e=[],t=[],n=r,i=r-mr+1+Nx;for(let s=0;s<i;s++){let a=Math.pow(2,n);e.push(a);let c=1/(a-2),l=-c,h=1+c,o=[l,l,h,l,h,h,l,l,h,h,l,h],u=6,d=6,f=3,m=new Float32Array(f*d*u),x=new Float32Array(f*d*u);for(let g=0;g<u;g++){let y=g%3*2/3-1,b=g>2?0:-1,M=[y,b,0,y+2/3,b,0,y+2/3,b+1,0,y,b,0,y+2/3,b+1,0,y,b+1,0];m.set(M,f*d*g);for(let w=0;w<d;w++){let S=o[w*2]*2-1,T=o[w*2+1]*2-1;g===0?_s.set(1,T,S):g===1?_s.set(-S,1,-T):g===2?_s.set(-S,T,1):g===3?_s.set(-1,T,-S):g===4?_s.set(-S,-1,T):_s.set(S,T,-1),_s.toArray(x,(g*d+w)*f)}}let p=new ot;p.setAttribute("position",new At(m,f)),p.setAttribute("outputDirection",new At(x,f)),t.push(new Z(p,null)),n>mr&&n--}return{lodMeshes:t,sizeLods:e}}function ff(r,e,t){let n=new ln(r,e,t);return n.texture.mapping=ma,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function pr(r,e,t,n,i){r.viewport.set(e,t,n,i),r.scissor.set(e,t,n,i)}function Bx(r,e,t){return new vn({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:zx,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${r}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Hc(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:ii,depthTest:!1,depthWrite:!1})}function Ox(r,e,t){return new vn({name:"SphericalGaussianBlur",defines:{SAMPLES:Dx,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${r}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:Hc(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float sigma;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359
			#define GOLDEN_ANGLE 2.39996322973

			void main() {

				if ( sigma == 0.0 ) {

					gl_FragColor = vec4( bilinearCubeUV( envMap, vOutputDirection, mipInt ), 1.0 );
					return;

				}

				vec3 outputDirection = normalize( vOutputDirection );

				vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
				vec3 tangent = normalize( cross( up, outputDirection ) );
				vec3 bitangent = cross( outputDirection, tangent );

				// Truncate the kernel at three standard deviations or at the antipode.
				float thetaMax = min( 3.0 * sigma, PI );
				float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

				vec3 accumColor = vec3( 0.0 );
				float accumWeight = 0.0;

				for ( int i = 0; i < SAMPLES; i ++ ) {

					// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
					float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
					float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
					float phi = float( i ) * GOLDEN_ANGLE;

					vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
					vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

					// Correct the planar sample density to solid angle.
					float weight = sin( theta ) / theta;

					accumColor += weight * bilinearCubeUV( envMap, sampleDirection, mipInt );
					accumWeight += weight;

				}

				gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

			}
		`,blending:ii,depthTest:!1,depthWrite:!1})}function pf(){return new vn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Hc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:ii,depthTest:!1,depthWrite:!1})}function mf(){return new vn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Hc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ii,depthTest:!1,depthWrite:!1})}function Hc(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}var Bc=class extends ln{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},i=[n,n,n,n,n,n];this.texture=new Kr(i),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},i=new ke(5,5,5),s=new vn({name:"CubemapFromEquirect",uniforms:ys(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:on,blending:ii});s.uniforms.tEquirect.value=t;let a=new Z(i,s),c=t.minFilter;return t.minFilter===Xn&&(t.minFilter=zt),new Ho(1,10,this).update(e,a),t.minFilter=c,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,i=!0){let s=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,i);e.setRenderTarget(s)}};function Hx(r){let e=new WeakMap,t=new WeakMap,n=null;function i(d,f=!1){return d==null?null:f?a(d):s(d)}function s(d){if(d&&d.isTexture){let f=d.mapping;if(f===lr||f===Xo)if(e.has(d)){let m=e.get(d).texture;return c(m,d.mapping)}else{let m=d.image;if(m&&m.height>0){let x=new Bc(m.height);return x.fromEquirectangularTexture(r,d),e.set(d,x),d.addEventListener("dispose",h),c(x.texture,d.mapping)}else return null}}return d}function a(d){if(d&&d.isTexture){let f=d.mapping,m=f===lr||f===Xo,x=f===qi||f===gs;if(m||x){let p=t.get(d),g=p!==void 0?p.texture.pmremVersion:0;if(d.isRenderTargetTexture&&d.pmremVersion!==g)return n===null&&(n=new xr(r)),p=m?n.fromEquirectangular(d,p):n.fromCubemap(d,p),p.texture.pmremVersion=d.pmremVersion,t.set(d,p),p.texture;if(p!==void 0)return p.texture;{let y=d.image;return m&&y&&y.height>0||x&&y&&l(y)?(n===null&&(n=new xr(r)),p=m?n.fromEquirectangular(d):n.fromCubemap(d),p.texture.pmremVersion=d.pmremVersion,t.set(d,p),d.addEventListener("dispose",o),p.texture):null}}}return d}function c(d,f){return f===lr?d.mapping=qi:f===Xo&&(d.mapping=gs),d}function l(d){let f=0,m=6;for(let x=0;x<m;x++)d[x]!==void 0&&f++;return f===m}function h(d){let f=d.target;f.removeEventListener("dispose",h);let m=e.get(f);m!==void 0&&(e.delete(f),m.dispose())}function o(d){let f=d.target;f.removeEventListener("dispose",o);let m=t.get(f);m!==void 0&&(t.delete(f),m.dispose())}function u(){e=new WeakMap,t=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:i,dispose:u}}function kx(r){let e={};function t(n){if(e[n]!==void 0)return e[n];let i=r.getExtension(n);return e[n]=i,i}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){let i=t(n);return i===null&&ss("WebGLRenderer: "+n+" extension not supported."),i}}}function Gx(r,e,t,n){let i={},s=new WeakMap;function a(u){let d=u.target;d.index!==null&&e.remove(d.index);for(let m in d.attributes)e.remove(d.attributes[m]);d.removeEventListener("dispose",a),delete i[d.id];let f=s.get(d);f&&(e.remove(f),s.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function c(u,d){return i[d.id]===!0||(d.addEventListener("dispose",a),i[d.id]=!0,t.memory.geometries++),d}function l(u){let d=u.attributes;for(let f in d)e.update(d[f],r.ARRAY_BUFFER)}function h(u){let d=[],f=u.index,m=u.attributes.position,x=0;if(m===void 0)return;if(f!==null){let y=f.array;x=f.version;for(let b=0,M=y.length;b<M;b+=3){let w=y[b+0],S=y[b+1],T=y[b+2];d.push(w,S,S,T,T,w)}}else{let y=m.array;x=m.version;for(let b=0,M=y.length/3-1;b<M;b+=3){let w=b+0,S=b+1,T=b+2;d.push(w,S,S,T,T,w)}}let p=new(m.count>=65535?Wr:Vr)(d,1);p.version=x;let g=s.get(u);g&&e.remove(g),s.set(u,p)}function o(u){let d=s.get(u);if(d){let f=u.index;f!==null&&d.version<f.version&&h(u)}else h(u);return s.get(u)}return{get:c,update:l,getWireframeAttribute:o}}function Vx(r,e,t){let n;function i(u){n=u}let s,a;function c(u){s=u.type,a=u.bytesPerElement}function l(u,d){r.drawElements(n,d,s,u*a),t.update(d,n,1)}function h(u,d,f){f!==0&&(r.drawElementsInstanced(n,d,s,u*a,f),t.update(d,n,f))}function o(u,d,f){if(f===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,d,0,s,u,0,f);let x=0;for(let p=0;p<f;p++)x+=d[p];t.update(x,n,1)}this.setMode=i,this.setIndex=c,this.render=l,this.renderInstances=h,this.renderMultiDraw=o}function Wx(r){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(s,a,c){switch(t.calls++,a){case r.TRIANGLES:t.triangles+=c*(s/3);break;case r.LINES:t.lines+=c*(s/2);break;case r.LINE_STRIP:t.lines+=c*(s-1);break;case r.LINE_LOOP:t.lines+=c*s;break;case r.POINTS:t.points+=c*s;break;default:He("WebGLInfo: Unknown draw mode:",a);break}}function i(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:i,update:n}}function Xx(r,e,t){let n=new WeakMap,i=new vt;function s(a,c,l){let h=a.morphTargetInfluences,o=c.morphAttributes.position||c.morphAttributes.normal||c.morphAttributes.color,u=o!==void 0?o.length:0,d=n.get(c);if(d===void 0||d.count!==u){let v=function(){T.dispose(),n.delete(c),c.removeEventListener("dispose",v)};d!==void 0&&d.texture.dispose();let f=c.morphAttributes.position!==void 0,m=c.morphAttributes.normal!==void 0,x=c.morphAttributes.color!==void 0,p=c.morphAttributes.position||[],g=c.morphAttributes.normal||[],y=c.morphAttributes.color||[],b=0;f===!0&&(b=1),m===!0&&(b=2),x===!0&&(b=3);let M=c.attributes.position.count*b,w=1;M>e.maxTextureSize&&(w=Math.ceil(M/e.maxTextureSize),M=e.maxTextureSize);let S=new Float32Array(M*w*4*u),T=new kr(S,M,w,u);T.type=Mn,T.needsUpdate=!0;let _=b*4;for(let R=0;R<u;R++){let C=p[R],I=g[R],z=y[R],N=M*w*4*R;for(let F=0;F<C.count;F++){let D=F*_;f===!0&&(i.fromBufferAttribute(C,F),S[N+D+0]=i.x,S[N+D+1]=i.y,S[N+D+2]=i.z,S[N+D+3]=0),m===!0&&(i.fromBufferAttribute(I,F),S[N+D+4]=i.x,S[N+D+5]=i.y,S[N+D+6]=i.z,S[N+D+7]=0),x===!0&&(i.fromBufferAttribute(z,F),S[N+D+8]=i.x,S[N+D+9]=i.y,S[N+D+10]=i.z,S[N+D+11]=z.itemSize===4?i.w:1)}}d={count:u,texture:T,size:new ae(M,w)},n.set(c,d),c.addEventListener("dispose",v)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(r,"morphTexture",a.morphTexture,t);else{let f=0;for(let x=0;x<h.length;x++)f+=h[x];let m=c.morphTargetsRelative?1:1-f;l.getUniforms().setValue(r,"morphTargetBaseInfluence",m),l.getUniforms().setValue(r,"morphTargetInfluences",h)}l.getUniforms().setValue(r,"morphTargetsTexture",d.texture,t),l.getUniforms().setValue(r,"morphTargetsTextureSize",d.size)}return{update:s}}function qx(r,e,t,n,i){let s=new WeakMap;function a(h){let o=i.render.frame,u=h.geometry,d=e.get(h,u);if(s.get(d)!==o&&(e.update(d),s.set(d,o)),h.isInstancedMesh&&(h.hasEventListener("dispose",l)===!1&&h.addEventListener("dispose",l),s.get(h)!==o&&(t.update(h.instanceMatrix,r.ARRAY_BUFFER),h.instanceColor!==null&&t.update(h.instanceColor,r.ARRAY_BUFFER),s.set(h,o))),h.isSkinnedMesh){let f=h.skeleton;s.get(f)!==o&&(f.update(),s.set(f,o))}return d}function c(){s=new WeakMap}function l(h){let o=h.target;o.removeEventListener("dispose",l),n.releaseStatesOfObject(o),t.remove(o.instanceMatrix),o.instanceColor!==null&&t.remove(o.instanceColor)}return{update:a,dispose:c}}var Yx={[Kl]:"LINEAR_TONE_MAPPING",[$l]:"REINHARD_TONE_MAPPING",[Jl]:"CINEON_TONE_MAPPING",[pa]:"ACES_FILMIC_TONE_MAPPING",[Ql]:"AGX_TONE_MAPPING",[eh]:"NEUTRAL_TONE_MAPPING",[jl]:"CUSTOM_TONE_MAPPING"};function Zx(r,e,t,n,i,s){let a=new ln(e,t,{type:r,depthBuffer:i,stencilBuffer:s,samples:n?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),c=null,l=null,h=new ot;h.setAttribute("position",new Xe([-1,3,0,-1,-1,0,3,-1,0],3)),h.setAttribute("uv",new Xe([0,2,0,0,2,0],2));let o=new Po({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),u=new Z(h,o),d=new Wi(-1,1,1,-1,0,1),f=null,m=null,x=!1,p,g=null,y=[],b=!1;this.setSize=function(M,w){a.setSize(M,w),c!==null&&c.setSize(M,w),l!==null&&l.setSize(M,w);for(let S=0;S<y.length;S++){let T=y[S];T.setSize&&T.setSize(M,w)}},this.setEffects=function(M){y=M,b=y.length>0&&y[0].isRenderPass===!0;let w=a.width,S=a.height;y.length>0&&c===null&&(c=new ln(w,S,{type:Yn,depthBuffer:!1,stencilBuffer:!1}),l=new ln(w,S,{type:Yn,depthBuffer:!1,stencilBuffer:!1}));for(let T=0;T<y.length;T++){let _=y[T];_.setSize&&_.setSize(w,S)}},this.begin=function(M,w){if(x||M.toneMapping===Wn&&y.length===0)return!1;if(g=w,w!==null){let S=w.width,T=w.height;(a.width!==S||a.height!==T)&&this.setSize(S,T)}return b===!1&&M.setRenderTarget(a),p=M.toneMapping,M.toneMapping=Wn,!0},this.hasRenderPass=function(){return b},this.end=function(M,w){M.toneMapping=p,x=!0;let S=a,T=c;for(let _=0;_<y.length;_++){let v=y[_];v.enabled!==!1&&(v.render(M,T,S,w),v.needsSwap!==!1&&(S=T,T=T===c?l:c))}if(f!==M.outputColorSpace||m!==M.toneMapping){f=M.outputColorSpace,m=M.toneMapping,o.defines={},Qe.getTransfer(f)===gt&&(o.defines.SRGB_TRANSFER="");let _=Yx[m];_&&(o.defines[_]=""),o.needsUpdate=!0}o.uniforms.tDiffuse.value=S.texture,M.setRenderTarget(g),M.render(u,d),g=null,x=!1},this.isCompositing=function(){return x},this.dispose=function(){a.dispose(),c!==null&&c.dispose(),l!==null&&l.dispose(),h.dispose(),o.dispose()}}var zf=new Wt,Eh=new Oi(1,1),Uf=new kr,Ff=new bo,Bf=new Kr,gf=[],xf=[],yf=new Float32Array(16),_f=new Float32Array(9),vf=new Float32Array(4);function yr(r,e,t){let n=r[0];if(n<=0||n>0)return r;let i=e*t,s=gf[i];if(s===void 0&&(s=new Float32Array(i),gf[i]=s),e!==0){n.toArray(s,0);for(let a=1,c=0;a!==e;++a)c+=t,r[a].toArray(s,c)}return s}function Xt(r,e){if(r.length!==e.length)return!1;for(let t=0,n=r.length;t<n;t++)if(r[t]!==e[t])return!1;return!0}function qt(r,e){for(let t=0,n=e.length;t<n;t++)r[t]=e[t]}function kc(r,e){let t=xf[e];t===void 0&&(t=new Int32Array(e),xf[e]=t);for(let n=0;n!==e;++n)t[n]=r.allocateTextureUnit();return t}function Kx(r,e){let t=this.cache;t[0]!==e&&(r.uniform1f(this.addr,e),t[0]=e)}function $x(r,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(r.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Xt(t,e))return;r.uniform2fv(this.addr,e),qt(t,e)}}function Jx(r,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(r.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(r.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Xt(t,e))return;r.uniform3fv(this.addr,e),qt(t,e)}}function jx(r,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(r.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Xt(t,e))return;r.uniform4fv(this.addr,e),qt(t,e)}}function Qx(r,e){let t=this.cache,n=e.elements;if(n===void 0){if(Xt(t,e))return;r.uniformMatrix2fv(this.addr,!1,e),qt(t,e)}else{if(Xt(t,n))return;vf.set(n),r.uniformMatrix2fv(this.addr,!1,vf),qt(t,n)}}function ey(r,e){let t=this.cache,n=e.elements;if(n===void 0){if(Xt(t,e))return;r.uniformMatrix3fv(this.addr,!1,e),qt(t,e)}else{if(Xt(t,n))return;_f.set(n),r.uniformMatrix3fv(this.addr,!1,_f),qt(t,n)}}function ty(r,e){let t=this.cache,n=e.elements;if(n===void 0){if(Xt(t,e))return;r.uniformMatrix4fv(this.addr,!1,e),qt(t,e)}else{if(Xt(t,n))return;yf.set(n),r.uniformMatrix4fv(this.addr,!1,yf),qt(t,n)}}function ny(r,e){let t=this.cache;t[0]!==e&&(r.uniform1i(this.addr,e),t[0]=e)}function iy(r,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(r.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Xt(t,e))return;r.uniform2iv(this.addr,e),qt(t,e)}}function sy(r,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(r.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Xt(t,e))return;r.uniform3iv(this.addr,e),qt(t,e)}}function ry(r,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(r.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Xt(t,e))return;r.uniform4iv(this.addr,e),qt(t,e)}}function ay(r,e){let t=this.cache;t[0]!==e&&(r.uniform1ui(this.addr,e),t[0]=e)}function oy(r,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(r.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Xt(t,e))return;r.uniform2uiv(this.addr,e),qt(t,e)}}function cy(r,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(r.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Xt(t,e))return;r.uniform3uiv(this.addr,e),qt(t,e)}}function ly(r,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(r.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Xt(t,e))return;r.uniform4uiv(this.addr,e),qt(t,e)}}function hy(r,e,t){let n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i);let s;this.type===r.SAMPLER_2D_SHADOW?(Eh.compareFunction=t.isReversedDepthBuffer()?zc:Dc,s=Eh):s=zf,t.setTexture2D(e||s,i)}function uy(r,e,t){let n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),t.setTexture3D(e||Ff,i)}function dy(r,e,t){let n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),t.setTextureCube(e||Bf,i)}function fy(r,e,t){let n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),t.setTexture2DArray(e||Uf,i)}function py(r){switch(r){case 5126:return Kx;case 35664:return $x;case 35665:return Jx;case 35666:return jx;case 35674:return Qx;case 35675:return ey;case 35676:return ty;case 5124:case 35670:return ny;case 35667:case 35671:return iy;case 35668:case 35672:return sy;case 35669:case 35673:return ry;case 5125:return ay;case 36294:return oy;case 36295:return cy;case 36296:return ly;case 35678:case 36198:case 36298:case 36306:case 35682:return hy;case 35679:case 36299:case 36307:return uy;case 35680:case 36300:case 36308:case 36293:return dy;case 36289:case 36303:case 36311:case 36292:return fy}}function my(r,e){r.uniform1fv(this.addr,e)}function gy(r,e){let t=yr(e,this.size,2);r.uniform2fv(this.addr,t)}function xy(r,e){let t=yr(e,this.size,3);r.uniform3fv(this.addr,t)}function yy(r,e){let t=yr(e,this.size,4);r.uniform4fv(this.addr,t)}function _y(r,e){let t=yr(e,this.size,4);r.uniformMatrix2fv(this.addr,!1,t)}function vy(r,e){let t=yr(e,this.size,9);r.uniformMatrix3fv(this.addr,!1,t)}function My(r,e){let t=yr(e,this.size,16);r.uniformMatrix4fv(this.addr,!1,t)}function by(r,e){r.uniform1iv(this.addr,e)}function Ey(r,e){r.uniform2iv(this.addr,e)}function Sy(r,e){r.uniform3iv(this.addr,e)}function Ty(r,e){r.uniform4iv(this.addr,e)}function wy(r,e){r.uniform1uiv(this.addr,e)}function Ay(r,e){r.uniform2uiv(this.addr,e)}function Ry(r,e){r.uniform3uiv(this.addr,e)}function Cy(r,e){r.uniform4uiv(this.addr,e)}function Iy(r,e,t){let n=this.cache,i=e.length,s=kc(t,i);Xt(n,s)||(r.uniform1iv(this.addr,s),qt(n,s));let a;this.type===r.SAMPLER_2D_SHADOW?a=Eh:a=zf;for(let c=0;c!==i;++c)t.setTexture2D(e[c]||a,s[c])}function Py(r,e,t){let n=this.cache,i=e.length,s=kc(t,i);Xt(n,s)||(r.uniform1iv(this.addr,s),qt(n,s));for(let a=0;a!==i;++a)t.setTexture3D(e[a]||Ff,s[a])}function Ly(r,e,t){let n=this.cache,i=e.length,s=kc(t,i);Xt(n,s)||(r.uniform1iv(this.addr,s),qt(n,s));for(let a=0;a!==i;++a)t.setTextureCube(e[a]||Bf,s[a])}function Ny(r,e,t){let n=this.cache,i=e.length,s=kc(t,i);Xt(n,s)||(r.uniform1iv(this.addr,s),qt(n,s));for(let a=0;a!==i;++a)t.setTexture2DArray(e[a]||Uf,s[a])}function Dy(r){switch(r){case 5126:return my;case 35664:return gy;case 35665:return xy;case 35666:return yy;case 35674:return _y;case 35675:return vy;case 35676:return My;case 5124:case 35670:return by;case 35667:case 35671:return Ey;case 35668:case 35672:return Sy;case 35669:case 35673:return Ty;case 5125:return wy;case 36294:return Ay;case 36295:return Ry;case 36296:return Cy;case 35678:case 36198:case 36298:case 36306:case 35682:return Iy;case 35679:case 36299:case 36307:return Py;case 35680:case 36300:case 36308:case 36293:return Ly;case 36289:case 36303:case 36311:case 36292:return Ny}}var Sh=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=py(t.type)}},Th=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Dy(t.type)}},wh=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let i=this.seq;for(let s=0,a=i.length;s!==a;++s){let c=i[s];c.setValue(e,t[c.id],n)}}},Mh=/(\w+)(\])?(\[|\.)?/g;function Mf(r,e){r.seq.push(e),r.map[e.id]=e}function zy(r,e,t){let n=r.name,i=n.length;for(Mh.lastIndex=0;;){let s=Mh.exec(n),a=Mh.lastIndex,c=s[1],l=s[2]==="]",h=s[3];if(l&&(c=c|0),h===void 0||h==="["&&a+2===i){Mf(t,h===void 0?new Sh(c,r,e):new Th(c,r,e));break}else{let u=t.map[c];u===void 0&&(u=new wh(c),Mf(t,u)),t=u}}}var gr=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<n;++a){let c=e.getActiveUniform(t,a),l=e.getUniformLocation(t,c.name);zy(c,l,this)}let i=[],s=[];for(let a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?i.push(a):s.push(a);i.length>0&&(this.seq=i.concat(s))}setValue(e,t,n,i){let s=this.map[t];s!==void 0&&s.setValue(e,n,i)}setOptional(e,t,n){let i=t[n];i!==void 0&&this.setValue(e,n,i)}static upload(e,t,n,i){for(let s=0,a=t.length;s!==a;++s){let c=t[s],l=n[c.id];l.needsUpdate!==!1&&c.setValue(e,l.value,i)}}static seqWithValue(e,t){let n=[];for(let i=0,s=e.length;i!==s;++i){let a=e[i];a.id in t&&n.push(a)}return n}};function bf(r,e,t){let n=r.createShader(e);return r.shaderSource(n,t),r.compileShader(n),n}var Uy=37297,Fy=0;function By(r,e){let t=r.split(`
`),n=[],i=Math.max(e-6,0),s=Math.min(e+6,t.length);for(let a=i;a<s;a++){let c=a+1;n.push(`${c===e?">":" "} ${c}: ${t[a]}`)}return n.join(`
`)}var Ef=new Ye;function Oy(r){Qe._getMatrix(Ef,Qe.workingColorSpace,r);let e=`mat3( ${Ef.elements.map(t=>t.toFixed(4))} )`;switch(Qe.getTransfer(r)){case Or:return[e,"LinearTransferOETF"];case gt:return[e,"sRGBTransferOETF"];default:return Le("WebGLProgram: Unsupported color space: ",r),[e,"LinearTransferOETF"]}}function Sf(r,e,t){let n=r.getShaderParameter(e,r.COMPILE_STATUS),s=(r.getShaderInfoLog(e)||"").trim();if(n&&s==="")return"";let a=/ERROR: 0:(\d+)/.exec(s);if(a){let c=parseInt(a[1]);return t.toUpperCase()+`

`+s+`

`+By(r.getShaderSource(e),c)}else return s}function Hy(r,e){let t=Oy(e);return[`vec4 ${r}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}var ky={[Kl]:"Linear",[$l]:"Reinhard",[Jl]:"Cineon",[pa]:"ACESFilmic",[Ql]:"AgX",[eh]:"Neutral",[jl]:"Custom"};function Gy(r,e){let t=ky[e];return t===void 0?(Le("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+r+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+r+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var Fc=new L;function Vy(){Qe.getLuminanceCoefficients(Fc);let r=Fc.x.toFixed(4),e=Fc.y.toFixed(4),t=Fc.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${r}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Wy(r){return[r.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",r.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(wa).join(`
`)}function Xy(r){let e=[];for(let t in r){let n=r[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function qy(r,e){let t={},n=r.getProgramParameter(e,r.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){let s=r.getActiveAttrib(e,i),a=s.name,c=1;s.type===r.FLOAT_MAT2&&(c=2),s.type===r.FLOAT_MAT3&&(c=3),s.type===r.FLOAT_MAT4&&(c=4),t[a]={type:s.type,location:r.getAttribLocation(e,a),locationSize:c}}return t}function wa(r){return r!==""}function Tf(r,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return r.replace(/NUM_SUN_LIGHTS/g,e.numSunLights).replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,e.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function wf(r,e){return r.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var Yy=/^[ \t]*#include +<([\w\d./]+)>/gm;function Ah(r){return r.replace(Yy,Ky)}var Zy=new Map;function Ky(r,e){let t=je[e];if(t===void 0){let n=Zy.get(e);if(n!==void 0)t=je[n],Le('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return Ah(t)}var $y=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Af(r){return r.replace($y,Jy)}function Jy(r,e,t,n){let i="";for(let s=parseInt(e);s<parseInt(t);s++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return i}function Rf(r){let e=`precision ${r.precision} float;
	precision ${r.precision} int;
	precision ${r.precision} sampler2D;
	precision ${r.precision} samplerCube;
	precision ${r.precision} sampler3D;
	precision ${r.precision} sampler2DArray;
	precision ${r.precision} sampler2DShadow;
	precision ${r.precision} samplerCubeShadow;
	precision ${r.precision} sampler2DArrayShadow;
	precision ${r.precision} isampler2D;
	precision ${r.precision} isampler3D;
	precision ${r.precision} isamplerCube;
	precision ${r.precision} isampler2DArray;
	precision ${r.precision} usampler2D;
	precision ${r.precision} usampler3D;
	precision ${r.precision} usamplerCube;
	precision ${r.precision} usampler2DArray;
	`;return r.precision==="highp"?e+=`
#define HIGH_PRECISION`:r.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:r.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}var jy={[ps]:"SHADOWMAP_TYPE_PCF",[cr]:"SHADOWMAP_TYPE_VSM"};function Qy(r){return jy[r.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var e_={[qi]:"ENVMAP_TYPE_CUBE",[gs]:"ENVMAP_TYPE_CUBE",[ma]:"ENVMAP_TYPE_CUBE_UV"};function t_(r){return r.envMap===!1?"ENVMAP_TYPE_CUBE":e_[r.envMapMode]||"ENVMAP_TYPE_CUBE"}var n_={[gs]:"ENVMAP_MODE_REFRACTION"};function i_(r){return r.envMap===!1?"ENVMAP_MODE_REFLECTION":n_[r.envMapMode]||"ENVMAP_MODE_REFLECTION"}var s_={[Zl]:"ENVMAP_BLENDING_MULTIPLY",[Bd]:"ENVMAP_BLENDING_MIX",[Od]:"ENVMAP_BLENDING_ADD"};function r_(r){return r.envMap===!1?"ENVMAP_BLENDING_NONE":s_[r.combine]||"ENVMAP_BLENDING_NONE"}function a_(r){let e=r.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function o_(r,e,t,n){let i=r.getContext(),s=t.defines,a=t.vertexShader,c=t.fragmentShader,l=Qy(t),h=t_(t),o=i_(t),u=r_(t),d=a_(t),f=Wy(t),m=Xy(s),x=i.createProgram(),p,g,y=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m].filter(wa).join(`
`),p.length>0&&(p+=`
`),g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m].filter(wa).join(`
`),g.length>0&&(g+=`
`)):(p=[Rf(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+o:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(wa).join(`
`),g=[Rf(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.envMap?"#define "+o:"",t.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.retroreflection?"#define USE_RETROREFLECTION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Wn?"#define TONE_MAPPING":"",t.toneMapping!==Wn?je.tonemapping_pars_fragment:"",t.toneMapping!==Wn?Gy("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",je.colorspace_pars_fragment,Hy("linearToOutputTexel",t.outputColorSpace),Vy(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(wa).join(`
`)),a=Ah(a),a=Tf(a,t),a=wf(a,t),c=Ah(c),c=Tf(c,t),c=wf(c,t),a=Af(a),c=Af(c),t.isRawShaderMaterial!==!0&&(y=`#version 300 es
`,p=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,g=["#define varying in",t.glslVersion===hh?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===hh?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+g);let b=y+p+a,M=y+g+c,w=bf(i,i.VERTEX_SHADER,b),S=bf(i,i.FRAGMENT_SHADER,M);i.attachShader(x,w),i.attachShader(x,S),t.index0AttributeName!==void 0?i.bindAttribLocation(x,0,t.index0AttributeName):t.hasPositionAttribute===!0&&i.bindAttribLocation(x,0,"position"),i.linkProgram(x);function T(C){if(r.debug.checkShaderErrors){let I=i.getProgramInfoLog(x)||"",z=i.getShaderInfoLog(w)||"",N=i.getShaderInfoLog(S)||"",F=I.trim(),D=z.trim(),B=N.trim(),X=!0,k=!0;if(i.getProgramParameter(x,i.LINK_STATUS)===!1)if(X=!1,typeof r.debug.onShaderError=="function")r.debug.onShaderError(i,x,w,S);else{let Y=Sf(i,w,"vertex"),$=Sf(i,S,"fragment");He("WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(x,i.VALIDATE_STATUS)+`

Material Name: `+C.name+`
Material Type: `+C.type+`

Program Info Log: `+F+`
`+Y+`
`+$)}else F!==""?Le("WebGLProgram: Program Info Log:",F):(D===""||B==="")&&(k=!1);k&&(C.diagnostics={runnable:X,programLog:F,vertexShader:{log:D,prefix:p},fragmentShader:{log:B,prefix:g}})}i.deleteShader(w),i.deleteShader(S),_=new gr(i,x),v=qy(i,x)}let _;this.getUniforms=function(){return _===void 0&&T(this),_};let v;this.getAttributes=function(){return v===void 0&&T(this),v};let R=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return R===!1&&(R=i.getProgramParameter(x,Uy)),R},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(x),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Fy++,this.cacheKey=e,this.usedTimes=1,this.program=x,this.vertexShader=w,this.fragmentShader=S,this}var c_=0,Rh=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){let i=this._getShaderCacheForMaterial(e);return i.has(t)===!1&&(i.add(t),t.usedTimes++),i.has(n)===!1&&(i.add(n),n.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new Ch(e),t.set(e,n)),n}},Ch=class{constructor(e){this.id=c_++,this.code=e,this.usedTimes=0}};function l_(r){return r===Zi||r===va||r===Ma}function h_(r,e,t,n,i,s){let a=new Ks,c=new Rh,l=new Set,h=[],o=new Map,u=n.logarithmicDepthBuffer,d=n.precision,f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function m(_){return l.add(_),_===0?"uv":`uv${_}`}function x(_,v,R,C,I,z){let N=C.fog,F=I.geometry,D=_.isMeshStandardMaterial||_.isMeshLambertMaterial||_.isMeshPhongMaterial?C.environment:null,B=_.isMeshStandardMaterial||_.isMeshLambertMaterial&&!_.envMap||_.isMeshPhongMaterial&&!_.envMap,X=e.get(_.envMap||D,B),k=X&&X.mapping===ma?X.image.height:null,Y=f[_.type];_.precision!==null&&(d=n.getMaxPrecision(_.precision),d!==_.precision&&Le("WebGLProgram.getParameters:",_.precision,"not supported, using",d,"instead."));let $=F.morphAttributes.position||F.morphAttributes.normal||F.morphAttributes.color,ye=$!==void 0?$.length:0,Me=0;F.morphAttributes.position!==void 0&&(Me=1),F.morphAttributes.normal!==void 0&&(Me=2),F.morphAttributes.color!==void 0&&(Me=3);let ht,it,ct,Q;if(Y){let Tt=ri[Y];ht=Tt.vertexShader,it=Tt.fragmentShader}else{ht=_.vertexShader,it=_.fragmentShader;let Tt=c.getVertexShaderStage(_),pt=c.getFragmentShaderStage(_);c.update(_,Tt,pt),ct=Tt.id,Q=pt.id}let ne=r.getRenderTarget(),_e=r.state.buffers.depth.getReversed(),Ge=I.isInstancedMesh===!0,Se=I.isBatchedMesh===!0,Ve=!!_.map,xt=!!_.matcap,ie=!!X,re=!!_.aoMap,oe=!!_.lightMap,ce=!!_.bumpMap&&_.wireframe===!1,ue=!!_.normalMap,Be=!!_.displacementMap,Ue=!!_.emissiveMap,We=!!_.metalnessMap,Ze=!!_.roughnessMap,U=_.anisotropy>0,ft=_.clearcoat>0,st=_.dispersion>0,P=_.retroreflectivity>0,E=_.iridescence>0,G=_.sheen>0,q=_.transmission>0,J=U&&!!_.anisotropyMap,le=ft&&!!_.clearcoatMap,he=ft&&!!_.clearcoatNormalMap,j=ft&&!!_.clearcoatRoughnessMap,te=E&&!!_.iridescenceMap,de=E&&!!_.iridescenceThicknessMap,Ne=G&&!!_.sheenColorMap,ge=G&&!!_.sheenRoughnessMap,fe=!!_.specularMap,De=!!_.specularColorMap,Oe=!!_.specularIntensityMap,Ke=q&&!!_.transmissionMap,H=q&&!!_.thicknessMap,pe=!!_.gradientMap,ee=!!_.alphaMap,me=_.alphaTest>0,Ee=!!_.alphaHash,se=!!_.extensions,ze=Wn;_.toneMapped&&(ne===null||ne.isXRRenderTarget===!0)&&(ze=r.toneMapping);let Ie={shaderID:Y,shaderType:_.type,shaderName:_.name,vertexShader:ht,fragmentShader:it,defines:_.defines,customVertexShaderID:ct,customFragmentShaderID:Q,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:d,batching:Se,batchingColor:Se&&I._colorsTexture!==null,instancing:Ge,instancingColor:Ge&&I.instanceColor!==null,instancingMorph:Ge&&I.morphTexture!==null,outputColorSpace:ne===null?r.outputColorSpace:ne.isXRRenderTarget===!0?ne.texture.colorSpace:Qe.workingColorSpace,alphaToCoverage:!!_.alphaToCoverage,map:Ve,matcap:xt,envMap:ie,envMapMode:ie&&X.mapping,envMapCubeUVHeight:k,aoMap:re,lightMap:oe,bumpMap:ce,normalMap:ue,displacementMap:Be,emissiveMap:Ue,normalMapObjectSpace:ue&&_.normalMapType===Wd,normalMapTangentSpace:ue&&_.normalMapType===Nc,packedNormalMap:ue&&_.normalMapType===Nc&&l_(_.normalMap.format),metalnessMap:We,roughnessMap:Ze,anisotropy:U,anisotropyMap:J,clearcoat:ft,clearcoatMap:le,clearcoatNormalMap:he,clearcoatRoughnessMap:j,dispersion:st,retroreflection:P,iridescence:E,iridescenceMap:te,iridescenceThicknessMap:de,sheen:G,sheenColorMap:Ne,sheenRoughnessMap:ge,specularMap:fe,specularColorMap:De,specularIntensityMap:Oe,transmission:q,transmissionMap:Ke,thicknessMap:H,gradientMap:pe,opaque:_.transparent===!1&&_.blending===Xi&&_.alphaToCoverage===!1,alphaMap:ee,alphaTest:me,alphaHash:Ee,combine:_.combine,mapUv:Ve&&m(_.map.channel),aoMapUv:re&&m(_.aoMap.channel),lightMapUv:oe&&m(_.lightMap.channel),bumpMapUv:ce&&m(_.bumpMap.channel),normalMapUv:ue&&m(_.normalMap.channel),displacementMapUv:Be&&m(_.displacementMap.channel),emissiveMapUv:Ue&&m(_.emissiveMap.channel),metalnessMapUv:We&&m(_.metalnessMap.channel),roughnessMapUv:Ze&&m(_.roughnessMap.channel),anisotropyMapUv:J&&m(_.anisotropyMap.channel),clearcoatMapUv:le&&m(_.clearcoatMap.channel),clearcoatNormalMapUv:he&&m(_.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:j&&m(_.clearcoatRoughnessMap.channel),iridescenceMapUv:te&&m(_.iridescenceMap.channel),iridescenceThicknessMapUv:de&&m(_.iridescenceThicknessMap.channel),sheenColorMapUv:Ne&&m(_.sheenColorMap.channel),sheenRoughnessMapUv:ge&&m(_.sheenRoughnessMap.channel),specularMapUv:fe&&m(_.specularMap.channel),specularColorMapUv:De&&m(_.specularColorMap.channel),specularIntensityMapUv:Oe&&m(_.specularIntensityMap.channel),transmissionMapUv:Ke&&m(_.transmissionMap.channel),thicknessMapUv:H&&m(_.thicknessMap.channel),alphaMapUv:ee&&m(_.alphaMap.channel),vertexTangents:!!F.attributes.tangent&&(ue||U),vertexNormals:!!F.attributes.normal,vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&!!F.attributes.color&&F.attributes.color.itemSize===4,pointsUvs:I.isPoints===!0&&!!F.attributes.uv&&(Ve||ee),fog:!!N,useFog:_.fog===!0,fogExp2:!!N&&N.isFogExp2,flatShading:_.wireframe===!1&&(_.flatShading===!0||F.attributes.normal===void 0&&ue===!1&&(_.isMeshLambertMaterial||_.isMeshPhongMaterial||_.isMeshStandardMaterial||_.isMeshPhysicalMaterial)),sizeAttenuation:_.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:_e,skinning:I.isSkinnedMesh===!0,hasPositionAttribute:F.attributes.position!==void 0,morphTargets:F.morphAttributes.position!==void 0,morphNormals:F.morphAttributes.normal!==void 0,morphColors:F.morphAttributes.color!==void 0,morphTargetsCount:ye,morphTextureStride:Me,numSunLights:v.sun.length,numDirLights:v.directional.length,numPointLights:v.point.length,numSpotLights:v.spot.length,numSpotLightMaps:v.spotLightMap.length,numRectAreaLights:v.rectArea.length,numHemiLights:v.hemi.length,numSunLightShadows:v.sunShadowMap.length,numDirLightShadows:v.directionalShadowMap.length,numPointLightShadows:v.pointShadowMap.length,numSpotLightShadows:v.spotShadowMap.length,numSpotLightShadowsWithMaps:v.numSpotLightShadowsWithMaps,numLightProbes:v.numLightProbes,numLightProbeGrids:z.length,numClippingPlanes:s.numPlanes,numClipIntersection:s.numIntersection,dithering:_.dithering,shadowMapEnabled:r.shadowMap.enabled&&R.length>0,shadowMapType:r.shadowMap.type,toneMapping:ze,decodeVideoTexture:Ve&&_.map.isVideoTexture===!0&&Qe.getTransfer(_.map.colorSpace)===gt,decodeVideoTextureEmissive:Ue&&_.emissiveMap.isVideoTexture===!0&&Qe.getTransfer(_.emissiveMap.colorSpace)===gt,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===Rt,flipSided:_.side===on,useDepthPacking:_.depthPacking>=0,depthPacking:_.depthPacking||0,index0AttributeName:_.index0AttributeName,extensionClipCullDistance:se&&_.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(se&&_.extensions.multiDraw===!0||Se)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:_.customProgramCacheKey()};return Ie.vertexUv1s=l.has(1),Ie.vertexUv2s=l.has(2),Ie.vertexUv3s=l.has(3),l.clear(),Ie}function p(_){let v=[];if(_.shaderID?v.push(_.shaderID):(v.push(_.customVertexShaderID),v.push(_.customFragmentShaderID)),_.defines!==void 0)for(let R in _.defines)v.push(R),v.push(_.defines[R]);return _.isRawShaderMaterial===!1&&(g(v,_),y(v,_),v.push(r.outputColorSpace)),v.push(_.customProgramCacheKey),v.join()}function g(_,v){_.push(v.precision),_.push(v.outputColorSpace),_.push(v.envMapMode),_.push(v.envMapCubeUVHeight),_.push(v.mapUv),_.push(v.alphaMapUv),_.push(v.lightMapUv),_.push(v.aoMapUv),_.push(v.bumpMapUv),_.push(v.normalMapUv),_.push(v.displacementMapUv),_.push(v.emissiveMapUv),_.push(v.metalnessMapUv),_.push(v.roughnessMapUv),_.push(v.anisotropyMapUv),_.push(v.clearcoatMapUv),_.push(v.clearcoatNormalMapUv),_.push(v.clearcoatRoughnessMapUv),_.push(v.iridescenceMapUv),_.push(v.iridescenceThicknessMapUv),_.push(v.sheenColorMapUv),_.push(v.sheenRoughnessMapUv),_.push(v.specularMapUv),_.push(v.specularColorMapUv),_.push(v.specularIntensityMapUv),_.push(v.transmissionMapUv),_.push(v.thicknessMapUv),_.push(v.combine),_.push(v.fogExp2),_.push(v.sizeAttenuation),_.push(v.morphTargetsCount),_.push(v.morphAttributeCount),_.push(v.numSunLights),_.push(v.numDirLights),_.push(v.numPointLights),_.push(v.numSpotLights),_.push(v.numSpotLightMaps),_.push(v.numHemiLights),_.push(v.numRectAreaLights),_.push(v.numSunLightShadows),_.push(v.numDirLightShadows),_.push(v.numPointLightShadows),_.push(v.numSpotLightShadows),_.push(v.numSpotLightShadowsWithMaps),_.push(v.numLightProbes),_.push(v.shadowMapType),_.push(v.toneMapping),_.push(v.numClippingPlanes),_.push(v.numClipIntersection),_.push(v.depthPacking)}function y(_,v){a.disableAll(),v.instancing&&a.enable(0),v.instancingColor&&a.enable(1),v.instancingMorph&&a.enable(2),v.matcap&&a.enable(3),v.envMap&&a.enable(4),v.normalMapObjectSpace&&a.enable(5),v.normalMapTangentSpace&&a.enable(6),v.clearcoat&&a.enable(7),v.iridescence&&a.enable(8),v.alphaTest&&a.enable(9),v.vertexColors&&a.enable(10),v.vertexAlphas&&a.enable(11),v.vertexUv1s&&a.enable(12),v.vertexUv2s&&a.enable(13),v.vertexUv3s&&a.enable(14),v.vertexTangents&&a.enable(15),v.anisotropy&&a.enable(16),v.alphaHash&&a.enable(17),v.batching&&a.enable(18),v.dispersion&&a.enable(19),v.retroreflection&&a.enable(24),v.batchingColor&&a.enable(20),v.gradientMap&&a.enable(21),v.packedNormalMap&&a.enable(22),v.vertexNormals&&a.enable(23),_.push(a.mask),a.disableAll(),v.fog&&a.enable(0),v.useFog&&a.enable(1),v.flatShading&&a.enable(2),v.logarithmicDepthBuffer&&a.enable(3),v.reversedDepthBuffer&&a.enable(4),v.skinning&&a.enable(5),v.morphTargets&&a.enable(6),v.morphNormals&&a.enable(7),v.morphColors&&a.enable(8),v.premultipliedAlpha&&a.enable(9),v.shadowMapEnabled&&a.enable(10),v.doubleSided&&a.enable(11),v.flipSided&&a.enable(12),v.useDepthPacking&&a.enable(13),v.dithering&&a.enable(14),v.transmission&&a.enable(15),v.sheen&&a.enable(16),v.opaque&&a.enable(17),v.pointsUvs&&a.enable(18),v.decodeVideoTexture&&a.enable(19),v.decodeVideoTextureEmissive&&a.enable(20),v.alphaToCoverage&&a.enable(21),v.numLightProbeGrids>0&&a.enable(22),v.hasPositionAttribute&&a.enable(23),_.push(a.mask)}function b(_){let v=f[_.type],R;if(v){let C=ri[v];R=lf.clone(C.uniforms)}else R=_.uniforms;return R}function M(_,v){let R=o.get(v);return R!==void 0?++R.usedTimes:(R=new o_(r,v,_,i),h.push(R),o.set(v,R)),R}function w(_){if(--_.usedTimes===0){let v=h.indexOf(_);h[v]=h[h.length-1],h.pop(),o.delete(_.cacheKey),_.destroy()}}function S(_){c.remove(_)}function T(){c.dispose()}return{getParameters:x,getProgramCacheKey:p,getUniforms:b,acquireProgram:M,releaseProgram:w,releaseShaderCache:S,programs:h,dispose:T}}function u_(){let r=new WeakMap;function e(a){return r.has(a)}function t(a){let c=r.get(a);return c===void 0&&(c={},r.set(a,c)),c}function n(a){r.delete(a)}function i(a,c,l){r.get(a)[c]=l}function s(){r=new WeakMap}return{has:e,get:t,remove:n,update:i,dispose:s}}function d_(r,e){return r.groupOrder!==e.groupOrder?r.groupOrder-e.groupOrder:r.renderOrder!==e.renderOrder?r.renderOrder-e.renderOrder:r.material.id!==e.material.id?r.material.id-e.material.id:r.materialVariant!==e.materialVariant?r.materialVariant-e.materialVariant:r.z!==e.z?r.z-e.z:r.id-e.id}function Cf(r,e){return r.groupOrder!==e.groupOrder?r.groupOrder-e.groupOrder:r.renderOrder!==e.renderOrder?r.renderOrder-e.renderOrder:r.z!==e.z?e.z-r.z:r.id-e.id}function If(){let r=[],e=0,t=[],n=[],i=[];function s(){e=0,t.length=0,n.length=0,i.length=0}function a(d){let f=0;return d.isInstancedMesh&&(f+=2),d.isSkinnedMesh&&(f+=1),f}function c(d,f,m,x,p,g){let y=r[e];return y===void 0?(y={id:d.id,object:d,geometry:f,material:m,materialVariant:a(d),groupOrder:x,renderOrder:d.renderOrder,z:p,group:g},r[e]=y):(y.id=d.id,y.object=d,y.geometry=f,y.material=m,y.materialVariant=a(d),y.groupOrder=x,y.renderOrder=d.renderOrder,y.z=p,y.group=g),e++,y}function l(d,f,m,x,p,g,y){y.reversedDepth===!0&&(p=-p);let b=c(d,f,m,x,p,g);m.transmission>0?n.push(b):m.transparent===!0?i.push(b):t.push(b)}function h(d,f,m,x,p,g){let y=c(d,f,m,x,p,g);m.transmission>0?n.unshift(y):m.transparent===!0?i.unshift(y):t.unshift(y)}function o(d,f){t.length>1&&t.sort(d||d_),n.length>1&&n.sort(f||Cf),i.length>1&&i.sort(f||Cf)}function u(){for(let d=e,f=r.length;d<f;d++){let m=r[d];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:t,transmissive:n,transparent:i,init:s,push:l,unshift:h,finish:u,sort:o}}function f_(){let r=new WeakMap;function e(n,i){let s=r.get(n),a;return s===void 0?(a=new If,r.set(n,[a])):i>=s.length?(a=new If,s.push(a)):a=s[i],a}function t(){r=new WeakMap}return{get:e,dispose:t}}function p_(){let r={};return{get:function(e){if(r[e.id]!==void 0)return r[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={direction:new L,color:new Ae};break;case"SpotLight":t={position:new L,direction:new L,color:new Ae,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new L,color:new Ae,distance:0,decay:0};break;case"HemisphereLight":t={direction:new L,skyColor:new Ae,groundColor:new Ae};break;case"RectAreaLight":t={color:new Ae,position:new L,halfWidth:new L,halfHeight:new L};break}return r[e.id]=t,t}}}function m_(){let r={};return{get:function(e){if(r[e.id]!==void 0)return r[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ae};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ae};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ae,shadowCameraNear:1,shadowCameraFar:1e3};break}return r[e.id]=t,t}}}var g_=0;function x_(r,e){return(e.castShadow?2:0)-(r.castShadow?2:0)+(e.map?1:0)-(r.map?1:0)}function y_(r){let e=new p_,t=m_(),n={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)n.probe.push(new L);let i=new L,s=new Fe,a=new Fe;function c(h){let o=0,u=0,d=0;for(let I=0;I<9;I++)n.probe[I].set(0,0,0);let f=0,m=0,x=0,p=0,g=0,y=0,b=0,M=0,w=0,S=0,T=0,_=0,v=0,R=0;h.sort(x_);for(let I=0,z=h.length;I<z;I++){let N=h[I],F=N.color,D=N.intensity,B=N.distance,X=null;if(N.shadow&&N.shadow.map&&(N.shadow.map.texture.format===Zi?X=N.shadow.map.texture:X=N.shadow.map.depthTexture||N.shadow.map.texture),N.isAmbientLight)o+=F.r*D,u+=F.g*D,d+=F.b*D;else if(N.isLightProbe){for(let k=0;k<9;k++)n.probe[k].addScaledVector(N.sh.coefficients[k],D);R++}else if(N.isSunLight){let k=e.get(N);if(k.color.copy(N.color).multiplyScalar(N.intensity),N.castShadow){let Y=N.shadow,$=t.get(N);$.shadowIntensity=Y.intensity,$.shadowBias=Y.bias,$.shadowNormalBias=Y.normalBias,$.shadowRadius=Y.radius,$.shadowMapSize.copy(Y.mapSize).multiply(Y.getFrameExtents()),n.sunShadow[m]=$,n.sunShadowMap[m]=X;let ye=Y.getViewportCount();for(let Me=0;Me<ye;Me++)n.sunShadowMatrix[x+Me]=Y.getMatrix(Me),n.sunShadowCascade[x+Me]=Y._cascadeData[Me];x+=ye,m++}n.sun[f]=k,f++}else if(N.isDirectionalLight){let k=e.get(N);if(k.color.copy(N.color).multiplyScalar(N.intensity),N.castShadow){let Y=N.shadow,$=t.get(N);$.shadowIntensity=Y.intensity,$.shadowBias=Y.bias,$.shadowNormalBias=Y.normalBias,$.shadowRadius=Y.radius,$.shadowMapSize=Y.mapSize,n.directionalShadow[p]=$,n.directionalShadowMap[p]=X,n.directionalShadowMatrix[p]=N.shadow.matrix,w++}n.directional[p]=k,p++}else if(N.isSpotLight){let k=e.get(N);k.position.setFromMatrixPosition(N.matrixWorld),k.color.copy(F).multiplyScalar(D),k.distance=B,k.coneCos=Math.cos(N.angle),k.penumbraCos=Math.cos(N.angle*(1-N.penumbra)),k.decay=N.decay,n.spot[y]=k;let Y=N.shadow;if(N.map&&(n.spotLightMap[_]=N.map,_++,Y.updateMatrices(N),N.castShadow&&v++),n.spotLightMatrix[y]=Y.matrix,N.castShadow){let $=t.get(N);$.shadowIntensity=Y.intensity,$.shadowBias=Y.bias,$.shadowNormalBias=Y.normalBias,$.shadowRadius=Y.radius,$.shadowMapSize=Y.mapSize,n.spotShadow[y]=$,n.spotShadowMap[y]=X,T++}y++}else if(N.isRectAreaLight){let k=e.get(N);k.color.copy(F).multiplyScalar(D),k.halfWidth.set(N.width*.5,0,0),k.halfHeight.set(0,N.height*.5,0),n.rectArea[b]=k,b++}else if(N.isPointLight){let k=e.get(N);if(k.color.copy(N.color).multiplyScalar(N.intensity),k.distance=N.distance,k.decay=N.decay,N.castShadow){let Y=N.shadow,$=t.get(N);$.shadowIntensity=Y.intensity,$.shadowBias=Y.bias,$.shadowNormalBias=Y.normalBias,$.shadowRadius=Y.radius,$.shadowMapSize=Y.mapSize,$.shadowCameraNear=Y.camera.near,$.shadowCameraFar=Y.camera.far,n.pointShadow[g]=$,n.pointShadowMap[g]=X,n.pointShadowMatrix[g]=N.shadow.matrix,S++}n.point[g]=k,g++}else if(N.isHemisphereLight){let k=e.get(N);k.skyColor.copy(N.color).multiplyScalar(D),k.groundColor.copy(N.groundColor).multiplyScalar(D),n.hemi[M]=k,M++}}b>0&&(r.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=xe.LTC_FLOAT_1,n.rectAreaLTC2=xe.LTC_FLOAT_2):(n.rectAreaLTC1=xe.LTC_HALF_1,n.rectAreaLTC2=xe.LTC_HALF_2)),n.ambient[0]=o,n.ambient[1]=u,n.ambient[2]=d;let C=n.hash;(C.sunLength!==f||C.directionalLength!==p||C.pointLength!==g||C.spotLength!==y||C.rectAreaLength!==b||C.hemiLength!==M||C.numSunShadows!==m||C.numDirectionalShadows!==w||C.numPointShadows!==S||C.numSpotShadows!==T||C.numSpotMaps!==_||C.numLightProbes!==R)&&(n.sun.length=f,n.directional.length=p,n.spot.length=y,n.rectArea.length=b,n.point.length=g,n.hemi.length=M,n.sunShadow.length=m,n.sunShadowMap.length=m,n.sunShadowMatrix.length=x,n.sunShadowCascade.length=x,n.directionalShadow.length=w,n.directionalShadowMap.length=w,n.directionalShadowMatrix.length=w,n.pointShadow.length=S,n.pointShadowMap.length=S,n.pointShadowMatrix.length=S,n.spotShadow.length=T,n.spotShadowMap.length=T,n.spotLightMatrix.length=T+_-v,n.spotLightMap.length=_,n.numSpotLightShadowsWithMaps=v,n.numLightProbes=R,C.sunLength=f,C.directionalLength=p,C.pointLength=g,C.spotLength=y,C.rectAreaLength=b,C.hemiLength=M,C.numSunShadows=m,C.numDirectionalShadows=w,C.numPointShadows=S,C.numSpotShadows=T,C.numSpotMaps=_,C.numLightProbes=R,n.version=g_++)}function l(h,o){let u=0,d=0,f=0,m=0,x=0,p=0,g=o.matrixWorldInverse;for(let y=0,b=h.length;y<b;y++){let M=h[y];if(M.isSunLight){let w=n.sun[u];w.direction.setFromMatrixPosition(M.matrixWorld),w.direction.transformDirection(g),u++}else if(M.isDirectionalLight){let w=n.directional[d];w.direction.setFromMatrixPosition(M.matrixWorld),i.setFromMatrixPosition(M.target.matrixWorld),w.direction.sub(i),w.direction.transformDirection(g),d++}else if(M.isSpotLight){let w=n.spot[m];w.position.setFromMatrixPosition(M.matrixWorld),w.position.applyMatrix4(g),w.direction.setFromMatrixPosition(M.matrixWorld),i.setFromMatrixPosition(M.target.matrixWorld),w.direction.sub(i),w.direction.transformDirection(g),m++}else if(M.isRectAreaLight){let w=n.rectArea[x];w.position.setFromMatrixPosition(M.matrixWorld),w.position.applyMatrix4(g),a.identity(),s.copy(M.matrixWorld),s.premultiply(g),a.extractRotation(s),w.halfWidth.set(M.width*.5,0,0),w.halfHeight.set(0,M.height*.5,0),w.halfWidth.applyMatrix4(a),w.halfHeight.applyMatrix4(a),x++}else if(M.isPointLight){let w=n.point[f];w.position.setFromMatrixPosition(M.matrixWorld),w.position.applyMatrix4(g),f++}else if(M.isHemisphereLight){let w=n.hemi[p];w.direction.setFromMatrixPosition(M.matrixWorld),w.direction.transformDirection(g),p++}}}return{setup:c,setupView:l,state:n}}function Pf(r){let e=new y_(r),t=[],n=[],i=[];function s(d){u.camera=d,t.length=0,n.length=0,i.length=0}function a(d){t.push(d)}function c(d){n.push(d)}function l(d){i.push(d)}function h(){e.setup(t)}function o(d){e.setupView(t,d)}let u={lightsArray:t,shadowsArray:n,lightProbeGridArray:i,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:s,state:u,setupLights:h,setupLightsView:o,pushLight:a,pushShadow:c,pushLightProbeGrid:l}}function __(r){let e=new WeakMap;function t(i,s=0){let a=e.get(i),c;return a===void 0?(c=new Pf(r),e.set(i,[c])):s>=a.length?(c=new Pf(r),a.push(c)):c=a[s],c}function n(){e=new WeakMap}return{get:t,dispose:n}}var v_=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,M_=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,b_=[new L(1,0,0),new L(-1,0,0),new L(0,1,0),new L(0,-1,0),new L(0,0,1),new L(0,0,-1)],E_=[new L(0,-1,0),new L(0,-1,0),new L(0,0,1),new L(0,0,-1),new L(0,-1,0),new L(0,-1,0)],Lf=new Fe,Ta=new L,bh=new L;function S_(r,e,t){let n=new Qs,i=new ae,s=new ae,a=new vt,c=new Lo,l=new No,h={},o=t.maxTextureSize,u={[ni]:on,[on]:ni,[Rt]:Rt},d=new vn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ae},radius:{value:4}},vertexShader:v_,fragmentShader:M_}),f=d.clone();f.defines.HORIZONTAL_PASS=1;let m=new ot;m.setAttribute("position",new At(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let x=new Z(m,d),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=ps;let g=this.type;this.render=function(S,T,_){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||S.length===0)return;this.type===Wo&&(Le("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=ps);let v=r.getRenderTarget(),R=r.getActiveCubeFace(),C=r.getActiveMipmapLevel(),I=r.state;I.setBlending(ii),I.buffers.depth.getReversed()===!0?I.buffers.color.setClear(0,0,0,0):I.buffers.color.setClear(1,1,1,1),I.buffers.depth.setTest(!0),I.setScissorTest(!1);let z=g!==this.type;z&&T.traverse(function(N){N.material&&(Array.isArray(N.material)?N.material.forEach(F=>F.needsUpdate=!0):N.material.needsUpdate=!0)});for(let N=0,F=S.length;N<F;N++){let D=S[N],B=D.shadow;if(B===void 0){Le("WebGLShadowMap:",D,"has no shadow.");continue}if(B.autoUpdate===!1&&B.needsUpdate===!1)continue;i.copy(B.mapSize);let X=B.getFrameExtents();i.multiply(X),s.copy(B.mapSize),(i.x>o||i.y>o)&&(i.x>o&&(s.x=Math.floor(o/X.x),i.x=s.x*X.x,B.mapSize.x=s.x),i.y>o&&(s.y=Math.floor(o/X.y),i.y=s.y*X.y,B.mapSize.y=s.y));let k=r.state.buffers.depth.getReversed();if(B.camera._reversedDepth=k,B.map===null||z===!0){if(B.map!==null&&(B.map.depthTexture!==null&&(B.map.depthTexture.dispose(),B.map.depthTexture=null),B.map.dispose()),this.type===cr){if(D.isPointLight){Le("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}B.map=new ln(i.x,i.y,{format:Zi,type:Yn,minFilter:zt,magFilter:zt,generateMipmaps:!1}),B.map.texture.name=D.name+".shadowMap",B.map.depthTexture=new Oi(i.x,i.y,Mn),B.map.depthTexture.name=D.name+".shadowMapDepth",B.map.depthTexture.format=jn,B.map.depthTexture.compareFunction=null,B.map.depthTexture.minFilter=Dt,B.map.depthTexture.magFilter=Dt}else D.isPointLight?(B.map=new Bc(i.x),B.map.depthTexture=new To(i.x,qn)):(B.map=new ln(i.x,i.y),B.map.depthTexture=new Oi(i.x,i.y,qn)),B.map.depthTexture.name=D.name+".shadowMap",B.map.depthTexture.format=jn,this.type===ps?(B.map.depthTexture.compareFunction=k?zc:Dc,B.map.depthTexture.minFilter=zt,B.map.depthTexture.magFilter=zt):(B.map.depthTexture.compareFunction=null,B.map.depthTexture.minFilter=Dt,B.map.depthTexture.magFilter=Dt);B.camera.updateProjectionMatrix()}B.map.isWebGLCubeRenderTarget!==!0&&(B.map.width!==i.x||B.map.height!==i.y)&&B.map.setSize(i.x,i.y);let Y=B.map.isWebGLCubeRenderTarget?6:B.getViewportCount();D.isPointLight!==!0&&B.updateMatrices(D,_);for(let $=0;$<Y;$++){let ye=B.getCamera($);if(D.isPointLight){let Me=B.camera,ht=B.matrix,it=D.distance||Me.far;it!==Me.far&&(Me.far=it,Me.updateProjectionMatrix()),Ta.setFromMatrixPosition(D.matrixWorld),Me.position.copy(Ta),bh.copy(Me.position),bh.add(b_[$]),Me.up.copy(E_[$]),Me.lookAt(bh),Me.updateMatrixWorld(),ht.makeTranslation(-Ta.x,-Ta.y,-Ta.z),Lf.multiplyMatrices(Me.projectionMatrix,Me.matrixWorldInverse),B._frustum.setFromProjectionMatrix(Lf,Me.coordinateSystem,Me.reversedDepth)}if(B.map.isWebGLCubeRenderTarget)r.setRenderTarget(B.map,$),r.clear();else{$===0&&(r.setRenderTarget(B.map),r.clear());let Me=B.getViewport($);a.set(s.x*Me.x,s.y*Me.y,s.x*Me.z,s.y*Me.w),I.viewport(a)}n=B.getFrustum($),M(T,_,ye,D,this.type)}B.isPointLightShadow!==!0&&this.type===cr&&y(B,_),B.needsUpdate=!1}g=this.type,p.needsUpdate=!1,r.setRenderTarget(v,R,C)};function y(S,T){let _=e.update(x);d.defines.VSM_SAMPLES!==S.blurSamples&&(d.defines.VSM_SAMPLES=S.blurSamples,f.defines.VSM_SAMPLES=S.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),S.mapPass===null?S.mapPass=new ln(i.x,i.y,{format:Zi,type:Yn}):(S.mapPass.width!==S.map.width||S.mapPass.height!==S.map.height)&&S.mapPass.setSize(S.map.width,S.map.height),d.uniforms.shadow_pass.value=S.map.depthTexture,d.uniforms.resolution.value.set(S.map.width,S.map.height),d.uniforms.radius.value=S.radius,r.setRenderTarget(S.mapPass),r.clear(),r.renderBufferDirect(T,null,_,d,x,null),f.uniforms.shadow_pass.value=S.mapPass.texture,f.uniforms.resolution.value.set(S.map.width,S.map.height),f.uniforms.radius.value=S.radius,r.setRenderTarget(S.map),r.clear(),r.renderBufferDirect(T,null,_,f,x,null)}function b(S,T,_,v){let R=null,C=_.isPointLight===!0?S.customDistanceMaterial:S.customDepthMaterial;if(C!==void 0)R=C;else if(R=_.isPointLight===!0?l:c,r.localClippingEnabled&&T.clipShadows===!0&&Array.isArray(T.clippingPlanes)&&T.clippingPlanes.length!==0||T.displacementMap&&T.displacementScale!==0||T.alphaMap&&T.alphaTest>0||T.map&&T.alphaTest>0||T.alphaToCoverage===!0){let I=R.uuid,z=T.uuid,N=h[I];N===void 0&&(N={},h[I]=N);let F=N[z];F===void 0&&(F=R.clone(),N[z]=F,T.addEventListener("dispose",w)),R=F}if(R.visible=T.visible,R.wireframe=T.wireframe,v===cr?R.side=T.shadowSide!==null?T.shadowSide:T.side:R.side=T.shadowSide!==null?T.shadowSide:u[T.side],R.alphaMap=T.alphaMap,R.alphaTest=T.alphaToCoverage===!0?.5:T.alphaTest,R.map=T.map,R.clipShadows=T.clipShadows,R.clippingPlanes=T.clippingPlanes,R.clipIntersection=T.clipIntersection,R.displacementMap=T.displacementMap,R.displacementScale=T.displacementScale,R.displacementBias=T.displacementBias,R.wireframeLinewidth=T.wireframeLinewidth,R.linewidth=T.linewidth,_.isPointLight===!0&&R.isMeshDistanceMaterial===!0){let I=r.properties.get(R);I.light=_}return R}function M(S,T,_,v,R){if(S.visible===!1)return;if(S.layers.test(T.layers)&&(S.isMesh||S.isLine||S.isPoints)&&(S.castShadow||S.receiveShadow&&R===cr)&&(!S.frustumCulled||S.intersectsFrustum(n))){S.modelViewMatrix.multiplyMatrices(_.matrixWorldInverse,S.matrixWorld);let z=e.update(S),N=S.material;if(Array.isArray(N)){let F=z.groups;for(let D=0,B=F.length;D<B;D++){let X=F[D],k=N[X.materialIndex];if(k&&k.visible){let Y=b(S,k,v,R);S.onBeforeShadow(r,S,T,_,z,Y,X),r.renderBufferDirect(_,null,z,Y,S,X),S.onAfterShadow(r,S,T,_,z,Y,X)}}}else if(N.visible){let F=b(S,N,v,R);S.onBeforeShadow(r,S,T,_,z,F,null),r.renderBufferDirect(_,null,z,F,S,null),S.onAfterShadow(r,S,T,_,z,F,null)}}let I=S.children;for(let z=0,N=I.length;z<N;z++)M(I[z],T,_,v,R)}function w(S){S.target.removeEventListener("dispose",w);for(let _ in h){let v=h[_],R=S.target.uuid;R in v&&(v[R].dispose(),delete v[R])}}}function T_(r,e){function t(){let H=!1,pe=new vt,ee=null,me=new vt(0,0,0,0);return{setMask:function(Ee){ee!==Ee&&!H&&(r.colorMask(Ee,Ee,Ee,Ee),ee=Ee)},setLocked:function(Ee){H=Ee},setClear:function(Ee,se,ze,Ie,Tt){Tt===!0&&(Ee*=Ie,se*=Ie,ze*=Ie),pe.set(Ee,se,ze,Ie),me.equals(pe)===!1&&(r.clearColor(Ee,se,ze,Ie),me.copy(pe))},reset:function(){H=!1,ee=null,me.set(-1,0,0,0)}}}function n(){let H=!1,pe=!1,ee=null,me=null,Ee=null;return{setReversed:function(se){if(pe!==se){let ze=e.get("EXT_clip_control");se?ze.clipControlEXT(ze.LOWER_LEFT_EXT,ze.ZERO_TO_ONE_EXT):ze.clipControlEXT(ze.LOWER_LEFT_EXT,ze.NEGATIVE_ONE_TO_ONE_EXT),pe=se;let Ie=Ee;Ee=null,this.setClear(Ie)}},getReversed:function(){return pe},setTest:function(se){se?ne(r.DEPTH_TEST):_e(r.DEPTH_TEST)},setMask:function(se){ee!==se&&!H&&(r.depthMask(se),ee=se)},setFunc:function(se){if(pe&&(se=tf[se]),me!==se){switch(se){case fo:r.depthFunc(r.NEVER);break;case po:r.depthFunc(r.ALWAYS);break;case mo:r.depthFunc(r.LESS);break;case Vs:r.depthFunc(r.LEQUAL);break;case go:r.depthFunc(r.EQUAL);break;case xo:r.depthFunc(r.GEQUAL);break;case yo:r.depthFunc(r.GREATER);break;case _o:r.depthFunc(r.NOTEQUAL);break;default:r.depthFunc(r.LEQUAL)}me=se}},setLocked:function(se){H=se},setClear:function(se){Ee!==se&&(Ee=se,pe&&(se=1-se),r.clearDepth(se))},reset:function(){H=!1,ee=null,me=null,Ee=null,pe=!1}}}function i(){let H=!1,pe=null,ee=null,me=null,Ee=null,se=null,ze=null,Ie=null,Tt=null;return{setTest:function(pt){H||(pt?ne(r.STENCIL_TEST):_e(r.STENCIL_TEST))},setMask:function(pt){pe!==pt&&!H&&(r.stencilMask(pt),pe=pt)},setFunc:function(pt,Nn,Zn){(ee!==pt||me!==Nn||Ee!==Zn)&&(r.stencilFunc(pt,Nn,Zn),ee=pt,me=Nn,Ee=Zn)},setOp:function(pt,Nn,Zn){(se!==pt||ze!==Nn||Ie!==Zn)&&(r.stencilOp(pt,Nn,Zn),se=pt,ze=Nn,Ie=Zn)},setLocked:function(pt){H=pt},setClear:function(pt){Tt!==pt&&(r.clearStencil(pt),Tt=pt)},reset:function(){H=!1,pe=null,ee=null,me=null,Ee=null,se=null,ze=null,Ie=null,Tt=null}}}let s=new t,a=new n,c=new i,l=new WeakMap,h=new WeakMap,o={},u={},d={},f=new WeakMap,m=[],x=null,p=!1,g=null,y=null,b=null,M=null,w=null,S=null,T=null,_=new Ae(0,0,0),v=0,R=!1,C=null,I=null,z=null,N=null,F=null,D=r.getParameter(r.MAX_COMBINED_TEXTURE_IMAGE_UNITS),B=!1,X=0,k=r.getParameter(r.VERSION);k.indexOf("WebGL")!==-1?(X=parseFloat(/^WebGL (\d)/.exec(k)[1]),B=X>=1):k.indexOf("OpenGL ES")!==-1&&(X=parseFloat(/^OpenGL ES (\d)/.exec(k)[1]),B=X>=2);let Y=null,$={},ye=r.getParameter(r.SCISSOR_BOX),Me=r.getParameter(r.VIEWPORT),ht=new vt().fromArray(ye),it=new vt().fromArray(Me);function ct(H,pe,ee,me){let Ee=new Uint8Array(4),se=r.createTexture();r.bindTexture(H,se),r.texParameteri(H,r.TEXTURE_MIN_FILTER,r.NEAREST),r.texParameteri(H,r.TEXTURE_MAG_FILTER,r.NEAREST);for(let ze=0;ze<ee;ze++)H===r.TEXTURE_3D||H===r.TEXTURE_2D_ARRAY?r.texImage3D(pe,0,r.RGBA,1,1,me,0,r.RGBA,r.UNSIGNED_BYTE,Ee):r.texImage2D(pe+ze,0,r.RGBA,1,1,0,r.RGBA,r.UNSIGNED_BYTE,Ee);return se}let Q={};Q[r.TEXTURE_2D]=ct(r.TEXTURE_2D,r.TEXTURE_2D,1),Q[r.TEXTURE_CUBE_MAP]=ct(r.TEXTURE_CUBE_MAP,r.TEXTURE_CUBE_MAP_POSITIVE_X,6),Q[r.TEXTURE_2D_ARRAY]=ct(r.TEXTURE_2D_ARRAY,r.TEXTURE_2D_ARRAY,1,1),Q[r.TEXTURE_3D]=ct(r.TEXTURE_3D,r.TEXTURE_3D,1,1),s.setClear(0,0,0,1),a.setClear(1),c.setClear(0),ne(r.DEPTH_TEST),a.setFunc(Vs),ce(!1),ue(Vl),ne(r.CULL_FACE),re(ii);function ne(H){o[H]!==!0&&(r.enable(H),o[H]=!0)}function _e(H){o[H]!==!1&&(r.disable(H),o[H]=!1)}function Ge(H,pe){return d[H]!==pe?(r.bindFramebuffer(H,pe),d[H]=pe,H===r.DRAW_FRAMEBUFFER&&(d[r.FRAMEBUFFER]=pe),H===r.FRAMEBUFFER&&(d[r.DRAW_FRAMEBUFFER]=pe),!0):!1}function Se(H,pe){let ee=m,me=!1;if(H){ee=f.get(pe),ee===void 0&&(ee=[],f.set(pe,ee));let Ee=H.textures;if(ee.length!==Ee.length||ee[0]!==r.COLOR_ATTACHMENT0){for(let se=0,ze=Ee.length;se<ze;se++)ee[se]=r.COLOR_ATTACHMENT0+se;ee.length=Ee.length,me=!0}}else ee[0]!==r.BACK&&(ee[0]=r.BACK,me=!0);me&&r.drawBuffers(ee)}function Ve(H){return x!==H?(r.useProgram(H),x=H,!0):!1}let xt={[ms]:r.FUNC_ADD,[Md]:r.FUNC_SUBTRACT,[bd]:r.FUNC_REVERSE_SUBTRACT};xt[Ed]=r.MIN,xt[Sd]=r.MAX;let ie={[Td]:r.ZERO,[wd]:r.ONE,[Ad]:r.SRC_COLOR,[ql]:r.SRC_ALPHA,[Nd]:r.SRC_ALPHA_SATURATE,[Pd]:r.DST_COLOR,[Cd]:r.DST_ALPHA,[Rd]:r.ONE_MINUS_SRC_COLOR,[Yl]:r.ONE_MINUS_SRC_ALPHA,[Ld]:r.ONE_MINUS_DST_COLOR,[Id]:r.ONE_MINUS_DST_ALPHA,[Dd]:r.CONSTANT_COLOR,[zd]:r.ONE_MINUS_CONSTANT_COLOR,[Ud]:r.CONSTANT_ALPHA,[Fd]:r.ONE_MINUS_CONSTANT_ALPHA};function re(H,pe,ee,me,Ee,se,ze,Ie,Tt,pt){if(H===ii){p===!0&&(_e(r.BLEND),p=!1);return}if(p===!1&&(ne(r.BLEND),p=!0),H!==vd){if(H!==g||pt!==R){if((y!==ms||w!==ms)&&(r.blendEquation(r.FUNC_ADD),y=ms,w=ms),pt)switch(H){case Xi:r.blendFuncSeparate(r.ONE,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case dt:r.blendFunc(r.ONE,r.ONE);break;case Wl:r.blendFuncSeparate(r.ZERO,r.ONE_MINUS_SRC_COLOR,r.ZERO,r.ONE);break;case Xl:r.blendFuncSeparate(r.DST_COLOR,r.ONE_MINUS_SRC_ALPHA,r.ZERO,r.ONE);break;default:He("WebGLState: Invalid blending: ",H);break}else switch(H){case Xi:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case dt:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE,r.ONE,r.ONE);break;case Wl:He("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Xl:He("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:He("WebGLState: Invalid blending: ",H);break}b=null,M=null,S=null,T=null,_.set(0,0,0),v=0,g=H,R=pt}return}Ee=Ee||pe,se=se||ee,ze=ze||me,(pe!==y||Ee!==w)&&(r.blendEquationSeparate(xt[pe],xt[Ee]),y=pe,w=Ee),(ee!==b||me!==M||se!==S||ze!==T)&&(r.blendFuncSeparate(ie[ee],ie[me],ie[se],ie[ze]),b=ee,M=me,S=se,T=ze),(Ie.equals(_)===!1||Tt!==v)&&(r.blendColor(Ie.r,Ie.g,Ie.b,Tt),_.copy(Ie),v=Tt),g=H,R=!1}function oe(H,pe){H.side===Rt?_e(r.CULL_FACE):ne(r.CULL_FACE);let ee=H.side===on;pe&&(ee=!ee),ce(ee),H.blending===Xi&&H.transparent===!1?re(ii):re(H.blending,H.blendEquation,H.blendSrc,H.blendDst,H.blendEquationAlpha,H.blendSrcAlpha,H.blendDstAlpha,H.blendColor,H.blendAlpha,H.premultipliedAlpha),a.setFunc(H.depthFunc),a.setTest(H.depthTest),a.setMask(H.depthWrite),s.setMask(H.colorWrite);let me=H.stencilWrite;c.setTest(me),me&&(c.setMask(H.stencilWriteMask),c.setFunc(H.stencilFunc,H.stencilRef,H.stencilFuncMask),c.setOp(H.stencilFail,H.stencilZFail,H.stencilZPass)),Ue(H.polygonOffset,H.polygonOffsetFactor,H.polygonOffsetUnits),H.alphaToCoverage===!0?ne(r.SAMPLE_ALPHA_TO_COVERAGE):_e(r.SAMPLE_ALPHA_TO_COVERAGE)}function ce(H){C!==H&&(H?r.frontFace(r.CW):r.frontFace(r.CCW),C=H)}function ue(H){H!==yd?(ne(r.CULL_FACE),H!==I&&(H===Vl?r.cullFace(r.BACK):H===_d?r.cullFace(r.FRONT):r.cullFace(r.FRONT_AND_BACK))):_e(r.CULL_FACE),I=H}function Be(H){H!==z&&(B&&r.lineWidth(H),z=H)}function Ue(H,pe,ee){H?(ne(r.POLYGON_OFFSET_FILL),(N!==pe||F!==ee)&&(N=pe,F=ee,a.getReversed()&&(pe=-pe),r.polygonOffset(pe,ee))):_e(r.POLYGON_OFFSET_FILL)}function We(H){H?ne(r.SCISSOR_TEST):_e(r.SCISSOR_TEST)}function Ze(H){H===void 0&&(H=r.TEXTURE0+D-1),Y!==H&&(r.activeTexture(H),Y=H)}function U(H,pe,ee){ee===void 0&&(Y===null?ee=r.TEXTURE0+D-1:ee=Y);let me=$[ee];me===void 0&&(me={type:void 0,texture:void 0},$[ee]=me),(me.type!==H||me.texture!==pe)&&(Y!==ee&&(r.activeTexture(ee),Y=ee),r.bindTexture(H,pe||Q[H]),me.type=H,me.texture=pe)}function ft(){let H=$[Y];H!==void 0&&H.type!==void 0&&(r.bindTexture(H.type,null),H.type=void 0,H.texture=void 0)}function st(){try{r.compressedTexImage2D(...arguments)}catch(H){He("WebGLState:",H)}}function P(){try{r.compressedTexImage3D(...arguments)}catch(H){He("WebGLState:",H)}}function E(){try{r.texSubImage2D(...arguments)}catch(H){He("WebGLState:",H)}}function G(){try{r.texSubImage3D(...arguments)}catch(H){He("WebGLState:",H)}}function q(){try{r.compressedTexSubImage2D(...arguments)}catch(H){He("WebGLState:",H)}}function J(){try{r.compressedTexSubImage3D(...arguments)}catch(H){He("WebGLState:",H)}}function le(){try{r.texStorage2D(...arguments)}catch(H){He("WebGLState:",H)}}function he(){try{r.texStorage3D(...arguments)}catch(H){He("WebGLState:",H)}}function j(){try{r.texImage2D(...arguments)}catch(H){He("WebGLState:",H)}}function te(){try{r.texImage3D(...arguments)}catch(H){He("WebGLState:",H)}}function de(H){return u[H]!==void 0?u[H]:r.getParameter(H)}function Ne(H,pe){u[H]!==pe&&(r.pixelStorei(H,pe),u[H]=pe)}function ge(H){ht.equals(H)===!1&&(r.scissor(H.x,H.y,H.z,H.w),ht.copy(H))}function fe(H){it.equals(H)===!1&&(r.viewport(H.x,H.y,H.z,H.w),it.copy(H))}function De(H,pe){let ee=h.get(pe);ee===void 0&&(ee=new WeakMap,h.set(pe,ee));let me=ee.get(H);me===void 0&&(me=r.getUniformBlockIndex(pe,H.name),ee.set(H,me))}function Oe(H,pe){let me=h.get(pe).get(H);l.get(pe)!==me&&(r.uniformBlockBinding(pe,me,H.__bindingPointIndex),l.set(pe,me))}function Ke(){r.disable(r.BLEND),r.disable(r.CULL_FACE),r.disable(r.DEPTH_TEST),r.disable(r.POLYGON_OFFSET_FILL),r.disable(r.SCISSOR_TEST),r.disable(r.STENCIL_TEST),r.disable(r.SAMPLE_ALPHA_TO_COVERAGE),r.blendEquation(r.FUNC_ADD),r.blendFunc(r.ONE,r.ZERO),r.blendFuncSeparate(r.ONE,r.ZERO,r.ONE,r.ZERO),r.blendColor(0,0,0,0),r.colorMask(!0,!0,!0,!0),r.clearColor(0,0,0,0),r.depthMask(!0),r.depthFunc(r.LESS),a.setReversed(!1),r.clearDepth(1),r.stencilMask(4294967295),r.stencilFunc(r.ALWAYS,0,4294967295),r.stencilOp(r.KEEP,r.KEEP,r.KEEP),r.clearStencil(0),r.cullFace(r.BACK),r.frontFace(r.CCW),r.polygonOffset(0,0),r.activeTexture(r.TEXTURE0),r.bindFramebuffer(r.FRAMEBUFFER,null),r.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),r.bindFramebuffer(r.READ_FRAMEBUFFER,null),r.useProgram(null),r.lineWidth(1),r.scissor(0,0,r.canvas.width,r.canvas.height),r.viewport(0,0,r.canvas.width,r.canvas.height),r.pixelStorei(r.PACK_ALIGNMENT,4),r.pixelStorei(r.UNPACK_ALIGNMENT,4),r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,!1),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,r.BROWSER_DEFAULT_WEBGL),r.pixelStorei(r.PACK_ROW_LENGTH,0),r.pixelStorei(r.PACK_SKIP_PIXELS,0),r.pixelStorei(r.PACK_SKIP_ROWS,0),r.pixelStorei(r.UNPACK_ROW_LENGTH,0),r.pixelStorei(r.UNPACK_IMAGE_HEIGHT,0),r.pixelStorei(r.UNPACK_SKIP_PIXELS,0),r.pixelStorei(r.UNPACK_SKIP_ROWS,0),r.pixelStorei(r.UNPACK_SKIP_IMAGES,0),o={},u={},Y=null,$={},d={},f=new WeakMap,m=[],x=null,p=!1,g=null,y=null,b=null,M=null,w=null,S=null,T=null,_=new Ae(0,0,0),v=0,R=!1,C=null,I=null,z=null,N=null,F=null,ht.set(0,0,r.canvas.width,r.canvas.height),it.set(0,0,r.canvas.width,r.canvas.height),s.reset(),a.reset(),c.reset()}return{buffers:{color:s,depth:a,stencil:c},enable:ne,disable:_e,bindFramebuffer:Ge,drawBuffers:Se,useProgram:Ve,setBlending:re,setMaterial:oe,setFlipSided:ce,setCullFace:ue,setLineWidth:Be,setPolygonOffset:Ue,setScissorTest:We,activeTexture:Ze,bindTexture:U,unbindTexture:ft,compressedTexImage2D:st,compressedTexImage3D:P,texImage2D:j,texImage3D:te,pixelStorei:Ne,getParameter:de,updateUBOMapping:De,uniformBlockBinding:Oe,texStorage2D:le,texStorage3D:he,texSubImage2D:E,texSubImage3D:G,compressedTexSubImage2D:q,compressedTexSubImage3D:J,scissor:ge,viewport:fe,reset:Ke}}function w_(r,e,t,n,i,s,a){let c=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new ae,o=new WeakMap,u=new Set,d,f=new WeakMap,m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function x(P,E){return m?new OffscreenCanvas(P,E):qs("canvas")}function p(P,E,G){let q=1,J=st(P);if((J.width>G||J.height>G)&&(q=G/Math.max(J.width,J.height)),q<1)if(typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&P instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&P instanceof ImageBitmap||typeof VideoFrame<"u"&&P instanceof VideoFrame){let le=Math.floor(q*J.width),he=Math.floor(q*J.height);d===void 0&&(d=x(le,he));let j=E?x(le,he):d;return j.width=le,j.height=he,j.getContext("2d").drawImage(P,0,0,le,he),Le("WebGLRenderer: Texture has been resized from ("+J.width+"x"+J.height+") to ("+le+"x"+he+")."),j}else return"data"in P&&Le("WebGLRenderer: Image in DataTexture is too big ("+J.width+"x"+J.height+")."),P;return P}function g(P){return P.generateMipmaps}function y(P){r.generateMipmap(P)}function b(P){return P.isWebGLCubeRenderTarget?r.TEXTURE_CUBE_MAP:P.isWebGL3DRenderTarget?r.TEXTURE_3D:P.isWebGLArrayRenderTarget||P.isCompressedArrayTexture?r.TEXTURE_2D_ARRAY:r.TEXTURE_2D}function M(P,E,G,q,J,le=!1){if(P!==null){if(r[P]!==void 0)return r[P];Le("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+P+"'")}let he;q&&(he=e.get("EXT_texture_norm16"),he||Le("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let j=E;if(E===r.RED&&(G===r.FLOAT&&(j=r.R32F),G===r.HALF_FLOAT&&(j=r.R16F),G===r.UNSIGNED_BYTE&&(j=r.R8),G===r.UNSIGNED_SHORT&&he&&(j=he.R16_EXT),G===r.SHORT&&he&&(j=he.R16_SNORM_EXT)),E===r.RED_INTEGER&&(G===r.UNSIGNED_BYTE&&(j=r.R8UI),G===r.UNSIGNED_SHORT&&(j=r.R16UI),G===r.UNSIGNED_INT&&(j=r.R32UI),G===r.BYTE&&(j=r.R8I),G===r.SHORT&&(j=r.R16I),G===r.INT&&(j=r.R32I)),E===r.RG&&(G===r.FLOAT&&(j=r.RG32F),G===r.HALF_FLOAT&&(j=r.RG16F),G===r.UNSIGNED_BYTE&&(j=r.RG8),G===r.UNSIGNED_SHORT&&he&&(j=he.RG16_EXT),G===r.SHORT&&he&&(j=he.RG16_SNORM_EXT)),E===r.RG_INTEGER&&(G===r.UNSIGNED_BYTE&&(j=r.RG8UI),G===r.UNSIGNED_SHORT&&(j=r.RG16UI),G===r.UNSIGNED_INT&&(j=r.RG32UI),G===r.BYTE&&(j=r.RG8I),G===r.SHORT&&(j=r.RG16I),G===r.INT&&(j=r.RG32I)),E===r.RGB_INTEGER&&(G===r.UNSIGNED_BYTE&&(j=r.RGB8UI),G===r.UNSIGNED_SHORT&&(j=r.RGB16UI),G===r.UNSIGNED_INT&&(j=r.RGB32UI),G===r.BYTE&&(j=r.RGB8I),G===r.SHORT&&(j=r.RGB16I),G===r.INT&&(j=r.RGB32I)),E===r.RGBA_INTEGER&&(G===r.UNSIGNED_BYTE&&(j=r.RGBA8UI),G===r.UNSIGNED_SHORT&&(j=r.RGBA16UI),G===r.UNSIGNED_INT&&(j=r.RGBA32UI),G===r.BYTE&&(j=r.RGBA8I),G===r.SHORT&&(j=r.RGBA16I),G===r.INT&&(j=r.RGBA32I)),E===r.RGB&&(G===r.UNSIGNED_SHORT&&he&&(j=he.RGB16_EXT),G===r.SHORT&&he&&(j=he.RGB16_SNORM_EXT),G===r.UNSIGNED_INT_5_9_9_9_REV&&(j=r.RGB9_E5),G===r.UNSIGNED_INT_10F_11F_11F_REV&&(j=r.R11F_G11F_B10F)),E===r.RGBA){let te=le?Or:Qe.getTransfer(J);G===r.FLOAT&&(j=r.RGBA32F),G===r.HALF_FLOAT&&(j=r.RGBA16F),G===r.UNSIGNED_BYTE&&(j=te===gt?r.SRGB8_ALPHA8:r.RGBA8),G===r.UNSIGNED_SHORT&&he&&(j=he.RGBA16_EXT),G===r.SHORT&&he&&(j=he.RGBA16_SNORM_EXT),G===r.UNSIGNED_SHORT_4_4_4_4&&(j=r.RGBA4),G===r.UNSIGNED_SHORT_5_5_5_1&&(j=r.RGB5_A1)}return(j===r.R16F||j===r.R32F||j===r.RG16F||j===r.RG32F||j===r.RGBA16F||j===r.RGBA32F)&&e.get("EXT_color_buffer_float"),j}function w(P,E){let G;return P?E===null||E===qn||E===dr?G=r.DEPTH24_STENCIL8:E===Mn?G=r.DEPTH32F_STENCIL8:E===ur&&(G=r.DEPTH24_STENCIL8,Le("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):E===null||E===qn||E===dr?G=r.DEPTH_COMPONENT24:E===Mn?G=r.DEPTH_COMPONENT32F:E===ur&&(G=r.DEPTH_COMPONENT16),G}function S(P,E){return g(P)===!0||P.isFramebufferTexture&&P.minFilter!==Dt&&P.minFilter!==zt?Math.log2(Math.max(E.width,E.height))+1:P.mipmaps!==void 0&&P.mipmaps.length>0?P.mipmaps.length:P.isCompressedTexture&&Array.isArray(P.image)?E.mipmaps.length:1}function T(P){let E=P.target;E.removeEventListener("dispose",T),v(E),E.isVideoTexture&&o.delete(E),E.isHTMLTexture&&u.delete(E)}function _(P){let E=P.target;E.removeEventListener("dispose",_),C(E)}function v(P){let E=n.get(P);if(E.__webglInit===void 0)return;let G=P.source,q=f.get(G);if(q){let J=q[E.__cacheKey];J.usedTimes--,J.usedTimes===0&&R(P),Object.keys(q).length===0&&f.delete(G)}n.remove(P)}function R(P){let E=n.get(P);r.deleteTexture(E.__webglTexture);let G=P.source,q=f.get(G);delete q[E.__cacheKey],a.memory.textures--}function C(P){let E=n.get(P);if(P.depthTexture&&(P.depthTexture.dispose(),n.remove(P.depthTexture)),P.isWebGLCubeRenderTarget)for(let q=0;q<6;q++){if(Array.isArray(E.__webglFramebuffer[q]))for(let J=0;J<E.__webglFramebuffer[q].length;J++)r.deleteFramebuffer(E.__webglFramebuffer[q][J]);else r.deleteFramebuffer(E.__webglFramebuffer[q]);E.__webglDepthbuffer&&r.deleteRenderbuffer(E.__webglDepthbuffer[q])}else{if(Array.isArray(E.__webglFramebuffer))for(let q=0;q<E.__webglFramebuffer.length;q++)r.deleteFramebuffer(E.__webglFramebuffer[q]);else r.deleteFramebuffer(E.__webglFramebuffer);if(E.__webglDepthbuffer&&r.deleteRenderbuffer(E.__webglDepthbuffer),E.__webglMultisampledFramebuffer&&r.deleteFramebuffer(E.__webglMultisampledFramebuffer),E.__webglColorRenderbuffer)for(let q=0;q<E.__webglColorRenderbuffer.length;q++)E.__webglColorRenderbuffer[q]&&r.deleteRenderbuffer(E.__webglColorRenderbuffer[q]);E.__webglDepthRenderbuffer&&r.deleteRenderbuffer(E.__webglDepthRenderbuffer)}let G=P.textures;for(let q=0,J=G.length;q<J;q++){let le=n.get(G[q]);le.__webglTexture&&(r.deleteTexture(le.__webglTexture),a.memory.textures--),n.remove(G[q])}n.remove(P)}let I=0;function z(){I=0}function N(){return I}function F(P){I=P}function D(){let P=I;return P>=i.maxTextures&&Le("WebGLTextures: Trying to use "+(P+1)+" texture units while this GPU supports only "+i.maxTextures),I+=1,P}function B(P){let E=[];return E.push(P.wrapS),E.push(P.wrapT),E.push(P.wrapR||0),E.push(P.magFilter),E.push(P.minFilter),E.push(P.anisotropy),E.push(P.internalFormat),E.push(P.format),E.push(P.type),E.push(P.generateMipmaps),E.push(P.premultiplyAlpha),E.push(P.flipY),E.push(P.unpackAlignment),E.push(P.colorSpace),E.join()}function X(P,E){let G=n.get(P);if(P.isVideoTexture&&U(P),P.isRenderTargetTexture===!1&&P.isExternalTexture!==!0&&P.version>0&&G.__version!==P.version){let q=P.image;if(q===null)Le("WebGLRenderer: Texture marked for update but no image data found.");else if(q.complete===!1)Le("WebGLRenderer: Texture marked for update but image is incomplete");else{_e(G,P,E);return}}else P.isExternalTexture&&(G.__webglTexture=P.sourceTexture?P.sourceTexture:null);t.bindTexture(r.TEXTURE_2D,G.__webglTexture,r.TEXTURE0+E)}function k(P,E){let G=n.get(P);if(P.isRenderTargetTexture===!1&&P.version>0&&G.__version!==P.version){_e(G,P,E);return}else P.isExternalTexture&&(G.__webglTexture=P.sourceTexture?P.sourceTexture:null);t.bindTexture(r.TEXTURE_2D_ARRAY,G.__webglTexture,r.TEXTURE0+E)}function Y(P,E){let G=n.get(P);if(P.isRenderTargetTexture===!1&&P.version>0&&G.__version!==P.version){_e(G,P,E);return}t.bindTexture(r.TEXTURE_3D,G.__webglTexture,r.TEXTURE0+E)}function $(P,E){let G=n.get(P);if(P.isCubeDepthTexture!==!0&&P.version>0&&G.__version!==P.version){Ge(G,P,E);return}t.bindTexture(r.TEXTURE_CUBE_MAP,G.__webglTexture,r.TEXTURE0+E)}let ye={[cn]:r.REPEAT,[An]:r.CLAMP_TO_EDGE,[Ws]:r.MIRRORED_REPEAT},Me={[Dt]:r.NEAREST,[qo]:r.NEAREST_MIPMAP_NEAREST,[xs]:r.NEAREST_MIPMAP_LINEAR,[zt]:r.LINEAR,[hr]:r.LINEAR_MIPMAP_NEAREST,[Xn]:r.LINEAR_MIPMAP_LINEAR},ht={[qd]:r.NEVER,[Jd]:r.ALWAYS,[Yd]:r.LESS,[Dc]:r.LEQUAL,[Zd]:r.EQUAL,[zc]:r.GEQUAL,[Kd]:r.GREATER,[$d]:r.NOTEQUAL};function it(P,E){if(E.type===Mn&&e.has("OES_texture_float_linear")===!1&&(E.magFilter===zt||E.magFilter===hr||E.magFilter===xs||E.magFilter===Xn||E.minFilter===zt||E.minFilter===hr||E.minFilter===xs||E.minFilter===Xn)&&Le("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),r.texParameteri(P,r.TEXTURE_WRAP_S,ye[E.wrapS]),r.texParameteri(P,r.TEXTURE_WRAP_T,ye[E.wrapT]),(P===r.TEXTURE_3D||P===r.TEXTURE_2D_ARRAY)&&r.texParameteri(P,r.TEXTURE_WRAP_R,ye[E.wrapR]),r.texParameteri(P,r.TEXTURE_MAG_FILTER,Me[E.magFilter]),r.texParameteri(P,r.TEXTURE_MIN_FILTER,Me[E.minFilter]),E.compareFunction&&(r.texParameteri(P,r.TEXTURE_COMPARE_MODE,r.COMPARE_REF_TO_TEXTURE),r.texParameteri(P,r.TEXTURE_COMPARE_FUNC,ht[E.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(E.magFilter===Dt||E.minFilter!==xs&&E.minFilter!==Xn||E.type===Mn&&e.has("OES_texture_float_linear")===!1)return;if(E.anisotropy>1||n.get(E).__currentAnisotropy){let G=e.get("EXT_texture_filter_anisotropic");r.texParameterf(P,G.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(E.anisotropy,i.getMaxAnisotropy())),n.get(E).__currentAnisotropy=E.anisotropy}}}function ct(P,E){let G=!1;P.__webglInit===void 0&&(P.__webglInit=!0,E.addEventListener("dispose",T));let q=E.source,J=f.get(q);J===void 0&&(J={},f.set(q,J));let le=B(E);if(le!==P.__cacheKey){J[le]===void 0&&(J[le]={texture:r.createTexture(),usedTimes:0},a.memory.textures++,G=!0),J[le].usedTimes++;let he=J[P.__cacheKey];he!==void 0&&(J[P.__cacheKey].usedTimes--,he.usedTimes===0&&R(E)),P.__cacheKey=le,P.__webglTexture=J[le].texture}return G}function Q(P,E,G){return Math.floor(Math.floor(P/G)/E)}function ne(P,E,G,q){let le=P.updateRanges;if(le.length===0)t.texSubImage2D(r.TEXTURE_2D,0,0,0,E.width,E.height,G,q,E.data);else{le.sort((Ne,ge)=>Ne.start-ge.start);let he=0;for(let Ne=1;Ne<le.length;Ne++){let ge=le[he],fe=le[Ne],De=ge.start+ge.count,Oe=Q(fe.start,E.width,4),Ke=Q(ge.start,E.width,4);fe.start<=De+1&&Oe===Ke&&Q(fe.start+fe.count-1,E.width,4)===Oe?ge.count=Math.max(ge.count,fe.start+fe.count-ge.start):(++he,le[he]=fe)}le.length=he+1;let j=t.getParameter(r.UNPACK_ROW_LENGTH),te=t.getParameter(r.UNPACK_SKIP_PIXELS),de=t.getParameter(r.UNPACK_SKIP_ROWS);t.pixelStorei(r.UNPACK_ROW_LENGTH,E.width);for(let Ne=0,ge=le.length;Ne<ge;Ne++){let fe=le[Ne],De=Math.floor(fe.start/4),Oe=Math.ceil(fe.count/4),Ke=De%E.width,H=Math.floor(De/E.width),pe=Oe,ee=1;t.pixelStorei(r.UNPACK_SKIP_PIXELS,Ke),t.pixelStorei(r.UNPACK_SKIP_ROWS,H),t.texSubImage2D(r.TEXTURE_2D,0,Ke,H,pe,ee,G,q,E.data)}P.clearUpdateRanges(),t.pixelStorei(r.UNPACK_ROW_LENGTH,j),t.pixelStorei(r.UNPACK_SKIP_PIXELS,te),t.pixelStorei(r.UNPACK_SKIP_ROWS,de)}}function _e(P,E,G){let q=r.TEXTURE_2D;(E.isDataArrayTexture||E.isCompressedArrayTexture)&&(q=r.TEXTURE_2D_ARRAY),E.isData3DTexture&&(q=r.TEXTURE_3D);let J=ct(P,E),le=E.source;t.bindTexture(q,P.__webglTexture,r.TEXTURE0+G);let he=n.get(le);if(le.version!==he.__version||J===!0){if(t.activeTexture(r.TEXTURE0+G),(typeof ImageBitmap<"u"&&E.image instanceof ImageBitmap)===!1){let ee=Qe.getPrimaries(Qe.workingColorSpace),me=E.colorSpace===Ti?null:Qe.getPrimaries(E.colorSpace),Ee=E.colorSpace===Ti||ee===me?r.NONE:r.BROWSER_DEFAULT_WEBGL;t.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,E.flipY),t.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),t.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ee)}t.pixelStorei(r.UNPACK_ALIGNMENT,E.unpackAlignment);let te=p(E.image,!1,i.maxTextureSize);te=ft(E,te);let de=s.convert(E.format,E.colorSpace),Ne=s.convert(E.type),ge=M(E.internalFormat,de,Ne,E.normalized,E.colorSpace,E.isVideoTexture);it(q,E);let fe,De=E.mipmaps,Oe=E.isVideoTexture!==!0,Ke=he.__version===void 0||J===!0,H=le.dataReady,pe=S(E,te);if(E.isDepthTexture)ge=w(E.format===Yi,E.type),Ke&&(Oe?t.texStorage2D(r.TEXTURE_2D,1,ge,te.width,te.height):t.texImage2D(r.TEXTURE_2D,0,ge,te.width,te.height,0,de,Ne,null));else if(E.isDataTexture)if(De.length>0){Oe&&Ke&&t.texStorage2D(r.TEXTURE_2D,pe,ge,De[0].width,De[0].height);for(let ee=0,me=De.length;ee<me;ee++)fe=De[ee],Oe?H&&t.texSubImage2D(r.TEXTURE_2D,ee,0,0,fe.width,fe.height,de,Ne,fe.data):t.texImage2D(r.TEXTURE_2D,ee,ge,fe.width,fe.height,0,de,Ne,fe.data);E.generateMipmaps=!1}else Oe?(Ke&&t.texStorage2D(r.TEXTURE_2D,pe,ge,te.width,te.height),H&&ne(E,te,de,Ne)):t.texImage2D(r.TEXTURE_2D,0,ge,te.width,te.height,0,de,Ne,te.data);else if(E.isCompressedTexture)if(E.isCompressedArrayTexture){Oe&&Ke&&t.texStorage3D(r.TEXTURE_2D_ARRAY,pe,ge,De[0].width,De[0].height,te.depth);for(let ee=0,me=De.length;ee<me;ee++)if(fe=De[ee],E.format!==bn)if(de!==null)if(Oe){if(H)if(E.layerUpdates.size>0){let Ee=gh(fe.width,fe.height,E.format,E.type);for(let se of E.layerUpdates){let ze=fe.data.subarray(se*Ee/fe.data.BYTES_PER_ELEMENT,(se+1)*Ee/fe.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,ee,0,0,se,fe.width,fe.height,1,de,ze)}}else t.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,ee,0,0,0,fe.width,fe.height,te.depth,de,fe.data)}else t.compressedTexImage3D(r.TEXTURE_2D_ARRAY,ee,ge,fe.width,fe.height,te.depth,0,fe.data,0,0);else Le("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Oe?H&&t.texSubImage3D(r.TEXTURE_2D_ARRAY,ee,0,0,0,fe.width,fe.height,te.depth,de,Ne,fe.data):t.texImage3D(r.TEXTURE_2D_ARRAY,ee,ge,fe.width,fe.height,te.depth,0,de,Ne,fe.data);E.layerUpdates.size>0&&E.clearLayerUpdates()}else{Oe&&Ke&&t.texStorage2D(r.TEXTURE_2D,pe,ge,De[0].width,De[0].height);for(let ee=0,me=De.length;ee<me;ee++)fe=De[ee],E.format!==bn?de!==null?Oe?H&&t.compressedTexSubImage2D(r.TEXTURE_2D,ee,0,0,fe.width,fe.height,de,fe.data):t.compressedTexImage2D(r.TEXTURE_2D,ee,ge,fe.width,fe.height,0,fe.data):Le("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Oe?H&&t.texSubImage2D(r.TEXTURE_2D,ee,0,0,fe.width,fe.height,de,Ne,fe.data):t.texImage2D(r.TEXTURE_2D,ee,ge,fe.width,fe.height,0,de,Ne,fe.data)}else if(E.isDataArrayTexture)if(Oe){if(Ke&&t.texStorage3D(r.TEXTURE_2D_ARRAY,pe,ge,te.width,te.height,te.depth),H)if(E.layerUpdates.size>0){let ee=gh(te.width,te.height,E.format,E.type);for(let me of E.layerUpdates){let Ee=te.data.subarray(me*ee/te.data.BYTES_PER_ELEMENT,(me+1)*ee/te.data.BYTES_PER_ELEMENT);t.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,me,te.width,te.height,1,de,Ne,Ee)}E.clearLayerUpdates()}else t.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,0,te.width,te.height,te.depth,de,Ne,te.data)}else t.texImage3D(r.TEXTURE_2D_ARRAY,0,ge,te.width,te.height,te.depth,0,de,Ne,te.data);else if(E.isData3DTexture)Oe?(Ke&&t.texStorage3D(r.TEXTURE_3D,pe,ge,te.width,te.height,te.depth),H&&t.texSubImage3D(r.TEXTURE_3D,0,0,0,0,te.width,te.height,te.depth,de,Ne,te.data)):t.texImage3D(r.TEXTURE_3D,0,ge,te.width,te.height,te.depth,0,de,Ne,te.data);else if(E.isFramebufferTexture){if(Ke)if(Oe)t.texStorage2D(r.TEXTURE_2D,pe,ge,te.width,te.height);else{let ee=te.width,me=te.height;for(let Ee=0;Ee<pe;Ee++)t.texImage2D(r.TEXTURE_2D,Ee,ge,ee,me,0,de,Ne,null),ee>>=1,me>>=1}}else if(E.isHTMLTexture){if("texElementImage2D"in r){let ee=r.canvas;if(ee.hasAttribute("layoutsubtree")||ee.setAttribute("layoutsubtree","true"),te.parentNode!==ee){ee.appendChild(te),u.add(E),ee.onpaint=me=>{let Ee=me.changedElements;for(let se of u)Ee.includes(se.image)&&(se.needsUpdate=!0)},ee.requestPaint();return}if(r.texElementImage2D.length===3)r.texElementImage2D(r.TEXTURE_2D,r.RGBA8,te);else{let Ee=r.RGBA,se=r.RGBA,ze=r.UNSIGNED_BYTE;r.texElementImage2D(r.TEXTURE_2D,0,Ee,se,ze,te)}r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MIN_FILTER,r.LINEAR),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_S,r.CLAMP_TO_EDGE),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_T,r.CLAMP_TO_EDGE)}}else if(De.length>0){if(Oe&&Ke){let ee=st(De[0]);t.texStorage2D(r.TEXTURE_2D,pe,ge,ee.width,ee.height)}for(let ee=0,me=De.length;ee<me;ee++)fe=De[ee],Oe?H&&t.texSubImage2D(r.TEXTURE_2D,ee,0,0,de,Ne,fe):t.texImage2D(r.TEXTURE_2D,ee,ge,de,Ne,fe);E.generateMipmaps=!1}else if(Oe){if(Ke){let ee=st(te);t.texStorage2D(r.TEXTURE_2D,pe,ge,ee.width,ee.height)}H&&t.texSubImage2D(r.TEXTURE_2D,0,0,0,de,Ne,te)}else t.texImage2D(r.TEXTURE_2D,0,ge,de,Ne,te);g(E)&&y(q),he.__version=le.version,E.onUpdate&&E.onUpdate(E)}P.__version=E.version}function Ge(P,E,G){if(E.image.length!==6)return;let q=ct(P,E),J=E.source;t.bindTexture(r.TEXTURE_CUBE_MAP,P.__webglTexture,r.TEXTURE0+G);let le=n.get(J);if(J.version!==le.__version||q===!0){t.activeTexture(r.TEXTURE0+G);let he=Qe.getPrimaries(Qe.workingColorSpace),j=E.colorSpace===Ti?null:Qe.getPrimaries(E.colorSpace),te=E.colorSpace===Ti||he===j?r.NONE:r.BROWSER_DEFAULT_WEBGL;t.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,E.flipY),t.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),t.pixelStorei(r.UNPACK_ALIGNMENT,E.unpackAlignment),t.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,te);let de=E.isCompressedTexture||E.image[0].isCompressedTexture,Ne=E.image[0]&&E.image[0].isDataTexture,ge=[];for(let se=0;se<6;se++)!de&&!Ne?ge[se]=p(E.image[se],!0,i.maxCubemapSize):ge[se]=Ne?E.image[se].image:E.image[se],ge[se]=ft(E,ge[se]);let fe=ge[0],De=s.convert(E.format,E.colorSpace),Oe=s.convert(E.type),Ke=M(E.internalFormat,De,Oe,E.normalized,E.colorSpace),H=E.isVideoTexture!==!0,pe=le.__version===void 0||q===!0,ee=J.dataReady,me=S(E,fe);it(r.TEXTURE_CUBE_MAP,E);let Ee;if(de){H&&pe&&t.texStorage2D(r.TEXTURE_CUBE_MAP,me,Ke,fe.width,fe.height);for(let se=0;se<6;se++){Ee=ge[se].mipmaps;for(let ze=0;ze<Ee.length;ze++){let Ie=Ee[ze];E.format!==bn?De!==null?H?ee&&t.compressedTexSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+se,ze,0,0,Ie.width,Ie.height,De,Ie.data):t.compressedTexImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+se,ze,Ke,Ie.width,Ie.height,0,Ie.data):Le("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):H?ee&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+se,ze,0,0,Ie.width,Ie.height,De,Oe,Ie.data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+se,ze,Ke,Ie.width,Ie.height,0,De,Oe,Ie.data)}}}else{if(Ee=E.mipmaps,H&&pe){Ee.length>0&&me++;let se=st(ge[0]);t.texStorage2D(r.TEXTURE_CUBE_MAP,me,Ke,se.width,se.height)}for(let se=0;se<6;se++)if(Ne){H?ee&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+se,0,0,0,ge[se].width,ge[se].height,De,Oe,ge[se].data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+se,0,Ke,ge[se].width,ge[se].height,0,De,Oe,ge[se].data);for(let ze=0;ze<Ee.length;ze++){let Tt=Ee[ze].image[se].image;H?ee&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+se,ze+1,0,0,Tt.width,Tt.height,De,Oe,Tt.data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+se,ze+1,Ke,Tt.width,Tt.height,0,De,Oe,Tt.data)}}else{H?ee&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+se,0,0,0,De,Oe,ge[se]):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+se,0,Ke,De,Oe,ge[se]);for(let ze=0;ze<Ee.length;ze++){let Ie=Ee[ze];H?ee&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+se,ze+1,0,0,De,Oe,Ie.image[se]):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+se,ze+1,Ke,De,Oe,Ie.image[se])}}}g(E)&&y(r.TEXTURE_CUBE_MAP),le.__version=J.version,E.onUpdate&&E.onUpdate(E)}P.__version=E.version}function Se(P,E,G,q,J,le){let he=s.convert(G.format,G.colorSpace),j=s.convert(G.type),te=M(G.internalFormat,he,j,G.normalized,G.colorSpace),de=n.get(E),Ne=n.get(G);if(Ne.__renderTarget=E,!de.__hasExternalTextures){let ge=Math.max(1,E.width>>le),fe=Math.max(1,E.height>>le);J===r.TEXTURE_3D||J===r.TEXTURE_2D_ARRAY?t.texImage3D(J,le,te,ge,fe,E.depth,0,he,j,null):t.texImage2D(J,le,te,ge,fe,0,he,j,null)}t.bindFramebuffer(r.FRAMEBUFFER,P),Ze(E)?c.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,q,J,Ne.__webglTexture,0,We(E)):(J===r.TEXTURE_2D||J>=r.TEXTURE_CUBE_MAP_POSITIVE_X&&J<=r.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&r.framebufferTexture2D(r.FRAMEBUFFER,q,J,Ne.__webglTexture,le),t.bindFramebuffer(r.FRAMEBUFFER,null)}function Ve(P,E,G){if(r.bindRenderbuffer(r.RENDERBUFFER,P),E.depthBuffer){let q=E.depthTexture,J=q&&q.isDepthTexture?q.type:null,le=w(E.stencilBuffer,J),he=E.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;Ze(E)?c.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,We(E),le,E.width,E.height):G?r.renderbufferStorageMultisample(r.RENDERBUFFER,We(E),le,E.width,E.height):r.renderbufferStorage(r.RENDERBUFFER,le,E.width,E.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,he,r.RENDERBUFFER,P)}else{let q=E.textures;for(let J=0;J<q.length;J++){let le=q[J],he=s.convert(le.format,le.colorSpace),j=s.convert(le.type),te=M(le.internalFormat,he,j,le.normalized,le.colorSpace);Ze(E)?c.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,We(E),te,E.width,E.height):G?r.renderbufferStorageMultisample(r.RENDERBUFFER,We(E),te,E.width,E.height):r.renderbufferStorage(r.RENDERBUFFER,te,E.width,E.height)}}r.bindRenderbuffer(r.RENDERBUFFER,null)}function xt(P,E,G){let q=E.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(r.FRAMEBUFFER,P),!(E.depthTexture&&E.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let J=n.get(E.depthTexture);if(J.__renderTarget=E,(!J.__webglTexture||E.depthTexture.image.width!==E.width||E.depthTexture.image.height!==E.height)&&(E.depthTexture.image.width=E.width,E.depthTexture.image.height=E.height,E.depthTexture.needsUpdate=!0),q){if(J.__webglInit===void 0&&(J.__webglInit=!0,E.depthTexture.addEventListener("dispose",T)),J.__webglTexture===void 0){J.__webglTexture=r.createTexture(),t.bindTexture(r.TEXTURE_CUBE_MAP,J.__webglTexture),it(r.TEXTURE_CUBE_MAP,E.depthTexture);let de=s.convert(E.depthTexture.format),Ne=s.convert(E.depthTexture.type),ge;E.depthTexture.format===jn?ge=r.DEPTH_COMPONENT24:E.depthTexture.format===Yi&&(ge=r.DEPTH24_STENCIL8);for(let fe=0;fe<6;fe++)r.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+fe,0,ge,E.width,E.height,0,de,Ne,null)}}else X(E.depthTexture,0);let le=J.__webglTexture,he=We(E),j=q?r.TEXTURE_CUBE_MAP_POSITIVE_X+G:r.TEXTURE_2D,te=E.depthTexture.format===Yi?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;if(E.depthTexture.format===jn)Ze(E)?c.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,te,j,le,0,he):r.framebufferTexture2D(r.FRAMEBUFFER,te,j,le,0);else if(E.depthTexture.format===Yi)Ze(E)?c.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,te,j,le,0,he):r.framebufferTexture2D(r.FRAMEBUFFER,te,j,le,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function ie(P){let E=n.get(P),G=P.isWebGLCubeRenderTarget===!0;if(E.__boundDepthTexture!==P.depthTexture){let q=P.depthTexture;if(E.__depthDisposeCallback&&E.__depthDisposeCallback(),q){let J=()=>{delete E.__boundDepthTexture,delete E.__depthDisposeCallback,q.removeEventListener("dispose",J)};q.addEventListener("dispose",J),E.__depthDisposeCallback=J}E.__boundDepthTexture=q}if(P.depthTexture&&!E.__autoAllocateDepthBuffer)if(G)for(let q=0;q<6;q++)xt(E.__webglFramebuffer[q],P,q);else{let q=P.texture.mipmaps;q&&q.length>0?xt(E.__webglFramebuffer[0],P,0):xt(E.__webglFramebuffer,P,0)}else if(G){E.__webglDepthbuffer=[];for(let q=0;q<6;q++)if(t.bindFramebuffer(r.FRAMEBUFFER,E.__webglFramebuffer[q]),E.__webglDepthbuffer[q]===void 0)E.__webglDepthbuffer[q]=r.createRenderbuffer(),Ve(E.__webglDepthbuffer[q],P,!1);else{let J=P.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,le=E.__webglDepthbuffer[q];r.bindRenderbuffer(r.RENDERBUFFER,le),r.framebufferRenderbuffer(r.FRAMEBUFFER,J,r.RENDERBUFFER,le)}}else{let q=P.texture.mipmaps;if(q&&q.length>0?t.bindFramebuffer(r.FRAMEBUFFER,E.__webglFramebuffer[0]):t.bindFramebuffer(r.FRAMEBUFFER,E.__webglFramebuffer),E.__webglDepthbuffer===void 0)E.__webglDepthbuffer=r.createRenderbuffer(),Ve(E.__webglDepthbuffer,P,!1);else{let J=P.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,le=E.__webglDepthbuffer;r.bindRenderbuffer(r.RENDERBUFFER,le),r.framebufferRenderbuffer(r.FRAMEBUFFER,J,r.RENDERBUFFER,le)}}t.bindFramebuffer(r.FRAMEBUFFER,null)}function re(P,E,G){let q=n.get(P);E!==void 0&&Se(q.__webglFramebuffer,P,P.texture,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,0),G!==void 0&&ie(P)}function oe(P){let E=P.texture,G=n.get(P),q=n.get(E);P.addEventListener("dispose",_);let J=P.textures,le=P.isWebGLCubeRenderTarget===!0,he=J.length>1;if(he||(q.__webglTexture===void 0&&(q.__webglTexture=r.createTexture()),q.__version=E.version,a.memory.textures++),le){G.__webglFramebuffer=[];for(let j=0;j<6;j++)if(E.mipmaps&&E.mipmaps.length>0){G.__webglFramebuffer[j]=[];for(let te=0;te<E.mipmaps.length;te++)G.__webglFramebuffer[j][te]=r.createFramebuffer()}else G.__webglFramebuffer[j]=r.createFramebuffer()}else{if(E.mipmaps&&E.mipmaps.length>0){G.__webglFramebuffer=[];for(let j=0;j<E.mipmaps.length;j++)G.__webglFramebuffer[j]=r.createFramebuffer()}else G.__webglFramebuffer=r.createFramebuffer();if(he)for(let j=0,te=J.length;j<te;j++){let de=n.get(J[j]);de.__webglTexture===void 0&&(de.__webglTexture=r.createTexture(),a.memory.textures++)}if(P.samples>0&&Ze(P)===!1){G.__webglMultisampledFramebuffer=r.createFramebuffer(),G.__webglColorRenderbuffer=[],t.bindFramebuffer(r.FRAMEBUFFER,G.__webglMultisampledFramebuffer);for(let j=0;j<J.length;j++){let te=J[j];G.__webglColorRenderbuffer[j]=r.createRenderbuffer(),r.bindRenderbuffer(r.RENDERBUFFER,G.__webglColorRenderbuffer[j]);let de=s.convert(te.format,te.colorSpace),Ne=s.convert(te.type),ge=M(te.internalFormat,de,Ne,te.normalized,te.colorSpace,P.isXRRenderTarget===!0),fe=We(P);r.renderbufferStorageMultisample(r.RENDERBUFFER,fe,ge,P.width,P.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+j,r.RENDERBUFFER,G.__webglColorRenderbuffer[j])}r.bindRenderbuffer(r.RENDERBUFFER,null),P.depthBuffer&&(G.__webglDepthRenderbuffer=r.createRenderbuffer(),Ve(G.__webglDepthRenderbuffer,P,!0)),t.bindFramebuffer(r.FRAMEBUFFER,null)}}if(le){t.bindTexture(r.TEXTURE_CUBE_MAP,q.__webglTexture),it(r.TEXTURE_CUBE_MAP,E);for(let j=0;j<6;j++)if(E.mipmaps&&E.mipmaps.length>0)for(let te=0;te<E.mipmaps.length;te++)Se(G.__webglFramebuffer[j][te],P,E,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+j,te);else Se(G.__webglFramebuffer[j],P,E,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+j,0);g(E)&&y(r.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(he){for(let j=0,te=J.length;j<te;j++){let de=J[j],Ne=n.get(de),ge=r.TEXTURE_2D;(P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(ge=P.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY),t.bindTexture(ge,Ne.__webglTexture),it(ge,de),Se(G.__webglFramebuffer,P,de,r.COLOR_ATTACHMENT0+j,ge,0),g(de)&&y(ge)}t.unbindTexture()}else{let j=r.TEXTURE_2D;if((P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(j=P.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY),t.bindTexture(j,q.__webglTexture),it(j,E),E.mipmaps&&E.mipmaps.length>0)for(let te=0;te<E.mipmaps.length;te++)Se(G.__webglFramebuffer[te],P,E,r.COLOR_ATTACHMENT0,j,te);else Se(G.__webglFramebuffer,P,E,r.COLOR_ATTACHMENT0,j,0);g(E)&&y(j),t.unbindTexture()}P.depthBuffer&&ie(P)}function ce(P){let E=P.textures;for(let G=0,q=E.length;G<q;G++){let J=E[G];if(g(J)){let le=b(P),he=n.get(J).__webglTexture;t.bindTexture(le,he),y(le),t.unbindTexture()}}}let ue=[],Be=[];function Ue(P){if(P.samples>0){if(Ze(P)===!1){let E=P.textures,G=P.width,q=P.height,J=r.COLOR_BUFFER_BIT,le=P.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,he=n.get(P),j=E.length>1;if(j)for(let de=0;de<E.length;de++)t.bindFramebuffer(r.FRAMEBUFFER,he.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+de,r.RENDERBUFFER,null),t.bindFramebuffer(r.FRAMEBUFFER,he.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+de,r.TEXTURE_2D,null,0);t.bindFramebuffer(r.READ_FRAMEBUFFER,he.__webglMultisampledFramebuffer);let te=P.texture.mipmaps;te&&te.length>0?t.bindFramebuffer(r.DRAW_FRAMEBUFFER,he.__webglFramebuffer[0]):t.bindFramebuffer(r.DRAW_FRAMEBUFFER,he.__webglFramebuffer);for(let de=0;de<E.length;de++){if(P.resolveDepthBuffer&&(P.depthBuffer&&(J|=r.DEPTH_BUFFER_BIT),P.stencilBuffer&&P.resolveStencilBuffer&&(J|=r.STENCIL_BUFFER_BIT)),j){r.framebufferRenderbuffer(r.READ_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.RENDERBUFFER,he.__webglColorRenderbuffer[de]);let Ne=n.get(E[de]).__webglTexture;r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,Ne,0)}r.blitFramebuffer(0,0,G,q,0,0,G,q,J,r.NEAREST),l===!0&&(ue.length=0,Be.length=0,ue.push(r.COLOR_ATTACHMENT0+de),P.depthBuffer&&P.storeMultisampledDepthBuffer===!1&&(ue.push(le),Be.push(le),r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,Be)),r.invalidateFramebuffer(r.READ_FRAMEBUFFER,ue))}if(t.bindFramebuffer(r.READ_FRAMEBUFFER,null),t.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),j)for(let de=0;de<E.length;de++){t.bindFramebuffer(r.FRAMEBUFFER,he.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+de,r.RENDERBUFFER,he.__webglColorRenderbuffer[de]);let Ne=n.get(E[de]).__webglTexture;t.bindFramebuffer(r.FRAMEBUFFER,he.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+de,r.TEXTURE_2D,Ne,0)}t.bindFramebuffer(r.DRAW_FRAMEBUFFER,he.__webglMultisampledFramebuffer)}else if(P.depthBuffer&&P.storeMultisampledDepthBuffer===!1&&l){let E=P.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,[E])}}}function We(P){return Math.min(i.maxSamples,P.samples)}function Ze(P){let E=n.get(P);return P.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&E.__useRenderToTexture!==!1}function U(P){let E=a.render.frame;o.get(P)!==E&&(o.set(P,E),P.update())}function ft(P,E){let G=P.colorSpace,q=P.format,J=P.type;return P.isCompressedTexture===!0||P.isVideoTexture===!0||G!==sn&&G!==Ti&&(Qe.getTransfer(G)===gt?(q!==bn||J!==mn)&&Le("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):He("WebGLTextures: Unsupported texture color space:",G)),E}function st(P){return typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement?(h.width=P.naturalWidth||P.width,h.height=P.naturalHeight||P.height):typeof VideoFrame<"u"&&P instanceof VideoFrame?(h.width=P.displayWidth,h.height=P.displayHeight):(h.width=P.width,h.height=P.height),h}this.allocateTextureUnit=D,this.resetTextureUnits=z,this.getTextureUnits=N,this.setTextureUnits=F,this.setTexture2D=X,this.setTexture2DArray=k,this.setTexture3D=Y,this.setTextureCube=$,this.rebindTextures=re,this.setupRenderTarget=oe,this.updateRenderTargetMipmap=ce,this.updateMultisampleRenderTarget=Ue,this.setupDepthRenderbuffer=ie,this.setupFrameBufferTexture=Se,this.useMultisampledRTT=Ze,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function A_(r,e){function t(n,i=Ti){let s,a=Qe.getTransfer(i);if(n===mn)return r.UNSIGNED_BYTE;if(n===Zo)return r.UNSIGNED_SHORT_4_4_4_4;if(n===Ko)return r.UNSIGNED_SHORT_5_5_5_1;if(n===sh)return r.UNSIGNED_INT_5_9_9_9_REV;if(n===rh)return r.UNSIGNED_INT_10F_11F_11F_REV;if(n===nh)return r.BYTE;if(n===ih)return r.SHORT;if(n===ur)return r.UNSIGNED_SHORT;if(n===Yo)return r.INT;if(n===qn)return r.UNSIGNED_INT;if(n===Mn)return r.FLOAT;if(n===Yn)return r.HALF_FLOAT;if(n===ah)return r.ALPHA;if(n===oh)return r.RGB;if(n===bn)return r.RGBA;if(n===jn)return r.DEPTH_COMPONENT;if(n===Yi)return r.DEPTH_STENCIL;if(n===$o)return r.RED;if(n===Jo)return r.RED_INTEGER;if(n===Zi)return r.RG;if(n===jo)return r.RG_INTEGER;if(n===Qo)return r.RGBA_INTEGER;if(n===ga||n===xa||n===ya||n===_a)if(a===gt)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(n===ga)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===xa)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===ya)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===_a)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(n===ga)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===xa)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===ya)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===_a)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===ec||n===tc||n===nc||n===ic)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(n===ec)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===tc)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===nc)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===ic)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===sc||n===rc||n===ac||n===oc||n===cc||n===va||n===lc)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(n===sc||n===rc)return a===gt?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(n===ac)return a===gt?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC;if(n===oc)return s.COMPRESSED_R11_EAC;if(n===cc)return s.COMPRESSED_SIGNED_R11_EAC;if(n===va)return s.COMPRESSED_RG11_EAC;if(n===lc)return s.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===hc||n===uc||n===dc||n===fc||n===pc||n===mc||n===gc||n===xc||n===yc||n===_c||n===vc||n===Mc||n===bc||n===Ec)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(n===hc)return a===gt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===uc)return a===gt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===dc)return a===gt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===fc)return a===gt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===pc)return a===gt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===mc)return a===gt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===gc)return a===gt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===xc)return a===gt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===yc)return a===gt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===_c)return a===gt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===vc)return a===gt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Mc)return a===gt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===bc)return a===gt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Ec)return a===gt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Sc||n===Tc||n===wc)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(n===Sc)return a===gt?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Tc)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===wc)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Ac||n===Rc||n===Ma||n===Cc)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(n===Ac)return s.COMPRESSED_RED_RGTC1_EXT;if(n===Rc)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Ma)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Cc)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===dr?r.UNSIGNED_INT_24_8:r[n]!==void 0?r[n]:null}return{convert:t}}var R_=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,C_=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,Ih=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new $r(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new vn({vertexShader:R_,fragmentShader:C_,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Z(new ut(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Ph=class extends Hn{constructor(e,t){super();let n=this,i=null,s=1,a=null,c="local-floor",l=1,h=null,o=null,u=null,d=null,f=null,m=null,x=typeof XRWebGLBinding<"u",p=new Ih,g={},y=t.getContextAttributes(),b=null,M=null,w=[],S=[],T=new ae,_=null,v=null,R=new kt;R.viewport=new vt;let C=new kt;C.viewport=new vt;let I=[R,C],z=new ko,N=null,F=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Q){let ne=w[Q];return ne===void 0&&(ne=new $s,w[Q]=ne),ne.getTargetRaySpace()},this.getControllerGrip=function(Q){let ne=w[Q];return ne===void 0&&(ne=new $s,w[Q]=ne),ne.getGripSpace()},this.getHand=function(Q){let ne=w[Q];return ne===void 0&&(ne=new $s,w[Q]=ne),ne.getHandSpace()};function D(Q){let ne=S.indexOf(Q.inputSource);if(ne===-1)return;let _e=w[ne];_e!==void 0&&(_e.update(Q.inputSource,Q.frame,h||a),_e.dispatchEvent({type:Q.type,data:Q.inputSource}))}function B(){i.removeEventListener("select",D),i.removeEventListener("selectstart",D),i.removeEventListener("selectend",D),i.removeEventListener("squeeze",D),i.removeEventListener("squeezestart",D),i.removeEventListener("squeezeend",D),i.removeEventListener("end",B),i.removeEventListener("inputsourceschange",X);for(let Q=0;Q<w.length;Q++){let ne=S[Q];ne!==null&&(S[Q]=null,w[Q].disconnect(ne))}N=null,F=null,p.reset();for(let Q in g)delete g[Q];if(e.setRenderTarget(b),f=null,d=null,u=null,i=null,M=null,ct.stop(),n.isPresenting=!1,e.setPixelRatio(_),e.setSize(T.width,T.height,!1),v!==null){let Q=v.camera;Q.fov=v.fov,Q.zoom=v.zoom,Q.updateProjectionMatrix(),v=null}n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Q){s=Q,n.isPresenting===!0&&Le("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Q){c=Q,n.isPresenting===!0&&Le("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return h||a},this.setReferenceSpace=function(Q){h=Q},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u===null&&x&&(u=new XRWebGLBinding(i,t)),u},this.getFrame=function(){return m},this.getSession=function(){return i},this.setSession=async function(Q){if(i=Q,i!==null){if(b=e.getRenderTarget(),i.addEventListener("select",D),i.addEventListener("selectstart",D),i.addEventListener("selectend",D),i.addEventListener("squeeze",D),i.addEventListener("squeezestart",D),i.addEventListener("squeezeend",D),i.addEventListener("end",B),i.addEventListener("inputsourceschange",X),y.xrCompatible!==!0&&await t.makeXRCompatible(),_=e.getPixelRatio(),e.getSize(T),x&&"createProjectionLayer"in XRWebGLBinding.prototype){let _e=null,Ge=null,Se=null;y.depth&&(Se=y.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,_e=y.stencil?Yi:jn,Ge=y.stencil?dr:qn);let Ve={colorFormat:t.RGBA8,depthFormat:Se,scaleFactor:s};u=this.getBinding(),d=u.createProjectionLayer(Ve),i.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),M=new ln(d.textureWidth,d.textureHeight,{format:bn,type:mn,depthTexture:new Oi(d.textureWidth,d.textureHeight,Ge,void 0,void 0,void 0,void 0,void 0,void 0,_e),stencilBuffer:y.stencil,colorSpace:e.outputColorSpace,samples:y.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}else{let _e={antialias:y.antialias,alpha:!0,depth:y.depth,stencil:y.stencil,framebufferScaleFactor:s};f=new XRWebGLLayer(i,t,_e),i.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),M=new ln(f.framebufferWidth,f.framebufferHeight,{format:bn,type:mn,colorSpace:e.outputColorSpace,stencilBuffer:y.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}M.isXRRenderTarget=!0,this.setFoveation(l),h=null,a=await i.requestReferenceSpace(c),ct.setContext(i),ct.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return p.getDepthTexture()};function X(Q){for(let ne=0;ne<Q.removed.length;ne++){let _e=Q.removed[ne],Ge=S.indexOf(_e);Ge>=0&&(S[Ge]=null,w[Ge].disconnect(_e))}for(let ne=0;ne<Q.added.length;ne++){let _e=Q.added[ne],Ge=S.indexOf(_e);if(Ge===-1){for(let Ve=0;Ve<w.length;Ve++)if(Ve>=S.length){S.push(_e),Ge=Ve;break}else if(S[Ve]===null){S[Ve]=_e,Ge=Ve;break}if(Ge===-1)break}let Se=w[Ge];Se&&Se.connect(_e)}}let k=new L,Y=new L;function $(Q,ne,_e){k.setFromMatrixPosition(ne.matrixWorld),Y.setFromMatrixPosition(_e.matrixWorld);let Ge=k.distanceTo(Y),Se=ne.projectionMatrix.elements,Ve=_e.projectionMatrix.elements,xt=Se[14]/(Se[10]-1),ie=Se[14]/(Se[10]+1),re=(Se[9]+1)/Se[5],oe=(Se[9]-1)/Se[5],ce=(Se[8]-1)/Se[0],ue=(Ve[8]+1)/Ve[0],Be=xt*ce,Ue=xt*ue,We=Ge/(-ce+ue),Ze=We*-ce;if(ne.matrixWorld.decompose(Q.position,Q.quaternion,Q.scale),Q.translateX(Ze),Q.translateZ(We),Q.matrixWorld.compose(Q.position,Q.quaternion,Q.scale),Q.matrixWorldInverse.copy(Q.matrixWorld).invert(),Se[10]===-1)Q.projectionMatrix.copy(ne.projectionMatrix),Q.projectionMatrixInverse.copy(ne.projectionMatrixInverse);else{let U=xt+We,ft=ie+We,st=Be-Ze,P=Ue+(Ge-Ze),E=re*ie/ft*U,G=oe*ie/ft*U;Q.projectionMatrix.makePerspective(st,P,E,G,U,ft),Q.projectionMatrixInverse.copy(Q.projectionMatrix).invert()}}function ye(Q,ne){ne===null?Q.matrixWorld.copy(Q.matrix):Q.matrixWorld.multiplyMatrices(ne.matrixWorld,Q.matrix),Q.matrixWorldInverse.copy(Q.matrixWorld).invert()}this.updateCamera=function(Q){if(i===null)return;let ne=Q.near,_e=Q.far;p.texture!==null&&(p.depthNear>0&&(ne=p.depthNear),p.depthFar>0&&(_e=p.depthFar)),z.near=C.near=R.near=ne,z.far=C.far=R.far=_e,(N!==z.near||F!==z.far)&&(i.updateRenderState({depthNear:z.near,depthFar:z.far}),N=z.near,F=z.far),z.layers.mask=Q.layers.mask|6,R.layers.mask=z.layers.mask&-5,C.layers.mask=z.layers.mask&-3;let Ge=Q.parent,Se=z.cameras;ye(z,Ge);for(let Ve=0;Ve<Se.length;Ve++)ye(Se[Ve],Ge);Se.length===2?$(z,R,C):z.projectionMatrix.copy(R.projectionMatrix),v===null&&Q.isPerspectiveCamera&&(v={camera:Q,fov:Q.fov,zoom:Q.zoom}),Me(Q,z,Ge)};function Me(Q,ne,_e){_e===null?Q.matrix.copy(ne.matrixWorld):(Q.matrix.copy(_e.matrixWorld),Q.matrix.invert(),Q.matrix.multiply(ne.matrixWorld)),Q.matrix.decompose(Q.position,Q.quaternion,Q.scale),Q.updateMatrixWorld(!0),Q.projectionMatrix.copy(ne.projectionMatrix),Q.projectionMatrixInverse.copy(ne.projectionMatrixInverse),Q.isPerspectiveCamera&&(Q.fov=os*2*Math.atan(1/Q.projectionMatrix.elements[5]),Q.zoom=1)}this.getCamera=function(){return z},this.getFoveation=function(){if(!(d===null&&f===null))return l},this.setFoveation=function(Q){l=Q,d!==null&&(d.fixedFoveation=Q),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=Q)},this.hasDepthSensing=function(){return p.texture!==null},this.getDepthSensingMesh=function(){return p.getMesh(z)},this.getCameraTexture=function(Q){return g[Q]};let ht=null;function it(Q,ne){if(o=ne.getViewerPose(h||a),m=ne,o!==null){let _e=o.views;f!==null&&(e.setRenderTargetFramebuffer(M,f.framebuffer),e.setRenderTarget(M));let Ge=!1;_e.length!==z.cameras.length&&(z.cameras.length=0,Ge=!0);for(let ie=0;ie<_e.length;ie++){let re=_e[ie],oe=null;if(f!==null)oe=f.getViewport(re);else{let ue=u.getViewSubImage(d,re);oe=ue.viewport,ie===0&&(e.setRenderTargetTextures(M,ue.colorTexture,ue.depthStencilTexture),e.setRenderTarget(M))}let ce=I[ie];ce===void 0&&(ce=new kt,ce.layers.enable(ie),ce.viewport=new vt,I[ie]=ce),ce.matrix.fromArray(re.transform.matrix),ce.matrix.decompose(ce.position,ce.quaternion,ce.scale),ce.projectionMatrix.fromArray(re.projectionMatrix),ce.projectionMatrixInverse.copy(ce.projectionMatrix).invert(),ce.viewport.set(oe.x,oe.y,oe.width,oe.height),ie===0&&(z.matrix.copy(ce.matrix),z.matrix.decompose(z.position,z.quaternion,z.scale)),Ge===!0&&z.cameras.push(ce)}let Se=i.enabledFeatures;if(Se&&Se.includes("depth-sensing")&&i.depthUsage=="gpu-optimized"&&x){u=n.getBinding();let ie=u.getDepthInformation(_e[0]);ie&&ie.isValid&&ie.texture&&p.init(ie,i.renderState)}if(Se&&Se.includes("camera-access")&&x){e.state.unbindTexture(),u=n.getBinding();for(let ie=0;ie<_e.length;ie++){let re=_e[ie].camera;if(re){let oe=g[re];oe||(oe=new $r,g[re]=oe);let ce=u.getCameraImage(re);oe.sourceTexture=ce}}}}for(let _e=0;_e<w.length;_e++){let Ge=S[_e],Se=w[_e];Ge!==null&&Se!==void 0&&Se.update(Ge,ne,h||a)}ht&&ht(Q,ne),ne.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:ne}),m=null}let ct=new Nf;ct.setAnimationLoop(it),this.setAnimationLoop=function(Q){ht=Q},this.dispose=function(){}}},I_=new Fe,Of=new Ye;Of.set(-1,0,0,0,1,0,0,0,1);function P_(r,e){function t(p,g){p.matrixAutoUpdate===!0&&p.updateMatrix(),g.value.copy(p.matrix)}function n(p,g){g.color.getRGB(p.fogColor.value,fh(r)),g.isFog?(p.fogNear.value=g.near,p.fogFar.value=g.far):g.isFogExp2&&(p.fogDensity.value=g.density)}function i(p,g,y,b,M){g.isNodeMaterial?g.uniformsNeedUpdate=!1:g.isMeshBasicMaterial?s(p,g):g.isMeshLambertMaterial?(s(p,g),g.envMap&&(p.envMapIntensity.value=g.envMapIntensity)):g.isMeshToonMaterial?(s(p,g),u(p,g)):g.isMeshPhongMaterial?(s(p,g),o(p,g),g.envMap&&(p.envMapIntensity.value=g.envMapIntensity)):g.isMeshStandardMaterial?(s(p,g),d(p,g),g.isMeshPhysicalMaterial&&f(p,g,M)):g.isMeshMatcapMaterial?(s(p,g),m(p,g)):g.isMeshDepthMaterial?s(p,g):g.isMeshDistanceMaterial?(s(p,g),x(p,g)):g.isMeshNormalMaterial?s(p,g):g.isLineBasicMaterial?(a(p,g),g.isLineDashedMaterial&&c(p,g)):g.isPointsMaterial?l(p,g,y,b):g.isSpriteMaterial?h(p,g):g.isShadowMaterial?(p.color.value.copy(g.color),p.opacity.value=g.opacity):g.isShaderMaterial&&(g.uniformsNeedUpdate=!1)}function s(p,g){p.opacity.value=g.opacity,g.color&&p.diffuse.value.copy(g.color),g.emissive&&p.emissive.value.copy(g.emissive).multiplyScalar(g.emissiveIntensity),g.map&&(p.map.value=g.map,t(g.map,p.mapTransform)),g.alphaMap&&(p.alphaMap.value=g.alphaMap,t(g.alphaMap,p.alphaMapTransform)),g.bumpMap&&(p.bumpMap.value=g.bumpMap,t(g.bumpMap,p.bumpMapTransform),p.bumpScale.value=g.bumpScale,g.side===on&&(p.bumpScale.value*=-1)),g.normalMap&&(p.normalMap.value=g.normalMap,t(g.normalMap,p.normalMapTransform),p.normalScale.value.copy(g.normalScale),g.side===on&&p.normalScale.value.negate()),g.displacementMap&&(p.displacementMap.value=g.displacementMap,t(g.displacementMap,p.displacementMapTransform),p.displacementScale.value=g.displacementScale,p.displacementBias.value=g.displacementBias),g.emissiveMap&&(p.emissiveMap.value=g.emissiveMap,t(g.emissiveMap,p.emissiveMapTransform)),g.specularMap&&(p.specularMap.value=g.specularMap,t(g.specularMap,p.specularMapTransform)),g.alphaTest>0&&(p.alphaTest.value=g.alphaTest);let y=e.get(g),b=y.envMap,M=y.envMapRotation;b&&(p.envMap.value=b,p.envMapRotation.value.setFromMatrix4(I_.makeRotationFromEuler(M)).transpose(),b.isCubeTexture&&b.isRenderTargetTexture===!1&&p.envMapRotation.value.premultiply(Of),p.reflectivity.value=g.reflectivity,p.ior.value=g.ior,p.refractionRatio.value=g.refractionRatio),g.lightMap&&(p.lightMap.value=g.lightMap,p.lightMapIntensity.value=g.lightMapIntensity,t(g.lightMap,p.lightMapTransform)),g.aoMap&&(p.aoMap.value=g.aoMap,p.aoMapIntensity.value=g.aoMapIntensity,t(g.aoMap,p.aoMapTransform))}function a(p,g){p.diffuse.value.copy(g.color),p.opacity.value=g.opacity,g.map&&(p.map.value=g.map,t(g.map,p.mapTransform))}function c(p,g){p.dashSize.value=g.dashSize,p.totalSize.value=g.dashSize+g.gapSize,p.scale.value=g.scale}function l(p,g,y,b){p.diffuse.value.copy(g.color),p.opacity.value=g.opacity,p.size.value=g.size*y,p.scale.value=b*.5,g.map&&(p.map.value=g.map,t(g.map,p.uvTransform)),g.alphaMap&&(p.alphaMap.value=g.alphaMap,t(g.alphaMap,p.alphaMapTransform)),g.alphaTest>0&&(p.alphaTest.value=g.alphaTest)}function h(p,g){p.diffuse.value.copy(g.color),p.opacity.value=g.opacity,p.rotation.value=g.rotation,g.map&&(p.map.value=g.map,t(g.map,p.mapTransform)),g.alphaMap&&(p.alphaMap.value=g.alphaMap,t(g.alphaMap,p.alphaMapTransform)),g.alphaTest>0&&(p.alphaTest.value=g.alphaTest)}function o(p,g){p.specular.value.copy(g.specular),p.shininess.value=Math.max(g.shininess,1e-4)}function u(p,g){g.gradientMap&&(p.gradientMap.value=g.gradientMap)}function d(p,g){p.metalness.value=g.metalness,g.metalnessMap&&(p.metalnessMap.value=g.metalnessMap,t(g.metalnessMap,p.metalnessMapTransform)),p.roughness.value=g.roughness,g.roughnessMap&&(p.roughnessMap.value=g.roughnessMap,t(g.roughnessMap,p.roughnessMapTransform)),g.envMap&&(p.envMapIntensity.value=g.envMapIntensity)}function f(p,g,y){p.ior.value=g.ior,g.sheen>0&&(p.sheenColor.value.copy(g.sheenColor).multiplyScalar(g.sheen),p.sheenRoughness.value=g.sheenRoughness,g.sheenColorMap&&(p.sheenColorMap.value=g.sheenColorMap,t(g.sheenColorMap,p.sheenColorMapTransform)),g.sheenRoughnessMap&&(p.sheenRoughnessMap.value=g.sheenRoughnessMap,t(g.sheenRoughnessMap,p.sheenRoughnessMapTransform))),g.clearcoat>0&&(p.clearcoat.value=g.clearcoat,p.clearcoatRoughness.value=g.clearcoatRoughness,g.clearcoatMap&&(p.clearcoatMap.value=g.clearcoatMap,t(g.clearcoatMap,p.clearcoatMapTransform)),g.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=g.clearcoatRoughnessMap,t(g.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),g.clearcoatNormalMap&&(p.clearcoatNormalMap.value=g.clearcoatNormalMap,t(g.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(g.clearcoatNormalScale),g.side===on&&p.clearcoatNormalScale.value.negate())),g.dispersion>0&&(p.dispersion.value=g.dispersion),g.retroreflectivity>0&&(p.retroreflectivity.value=g.retroreflectivity),g.iridescence>0&&(p.iridescence.value=g.iridescence,p.iridescenceIOR.value=g.iridescenceIOR,p.iridescenceThicknessMinimum.value=g.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=g.iridescenceThicknessRange[1],g.iridescenceMap&&(p.iridescenceMap.value=g.iridescenceMap,t(g.iridescenceMap,p.iridescenceMapTransform)),g.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=g.iridescenceThicknessMap,t(g.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),g.transmission>0&&(p.transmission.value=g.transmission,p.transmissionSamplerMap.value=y.texture,p.transmissionSamplerSize.value.set(y.width,y.height),g.transmissionMap&&(p.transmissionMap.value=g.transmissionMap,t(g.transmissionMap,p.transmissionMapTransform)),p.thickness.value=g.thickness,g.thicknessMap&&(p.thicknessMap.value=g.thicknessMap,t(g.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=g.attenuationDistance,p.attenuationColor.value.copy(g.attenuationColor)),g.anisotropy>0&&(p.anisotropyVector.value.set(g.anisotropy*Math.cos(g.anisotropyRotation),g.anisotropy*Math.sin(g.anisotropyRotation)),g.anisotropyMap&&(p.anisotropyMap.value=g.anisotropyMap,t(g.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=g.specularIntensity,p.specularColor.value.copy(g.specularColor),g.specularColorMap&&(p.specularColorMap.value=g.specularColorMap,t(g.specularColorMap,p.specularColorMapTransform)),g.specularIntensityMap&&(p.specularIntensityMap.value=g.specularIntensityMap,t(g.specularIntensityMap,p.specularIntensityMapTransform))}function m(p,g){g.matcap&&(p.matcap.value=g.matcap)}function x(p,g){let y=e.get(g).light;p.referencePosition.value.setFromMatrixPosition(y.matrixWorld),p.nearDistance.value=y.shadow.camera.near,p.farDistance.value=y.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function L_(r,e,t,n){let i={},s={},a=[],c=r.getParameter(r.MAX_UNIFORM_BUFFER_BINDINGS);function l(M,w){let S=w.program;n.uniformBlockBinding(M,S)}function h(M,w){let S=i[M.id];S===void 0&&(p(M),S=o(M),i[M.id]=S,M.addEventListener("dispose",y));let T=w.program;n.updateUBOMapping(M,T);let _=e.render.frame;s[M.id]!==_&&(d(M),s[M.id]=_)}function o(M){let w=u();M.__bindingPointIndex=w;let S=r.createBuffer(),T=M.__size,_=M.usage;return r.bindBuffer(r.UNIFORM_BUFFER,S),r.bufferData(r.UNIFORM_BUFFER,T,_),r.bindBuffer(r.UNIFORM_BUFFER,null),r.bindBufferBase(r.UNIFORM_BUFFER,w,S),S}function u(){for(let M=0;M<c;M++)if(a.indexOf(M)===-1)return a.push(M),M;return He("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(M){let w=i[M.id],S=M.uniforms,T=M.__cache;r.bindBuffer(r.UNIFORM_BUFFER,w);for(let _=0,v=S.length;_<v;_++){let R=S[_];if(Array.isArray(R))for(let C=0,I=R.length;C<I;C++)f(R[C],_,C,T);else f(R,_,0,T)}r.bindBuffer(r.UNIFORM_BUFFER,null)}function f(M,w,S,T){if(x(M,w,S,T)===!0){let _=M.__offset,v=M.value;if(Array.isArray(v)){let R=0;for(let C=0;C<v.length;C++){let I=v[C],z=g(I);m(I,M.__data,R),typeof I!="number"&&typeof I!="boolean"&&!I.isMatrix3&&!ArrayBuffer.isView(I)&&(R+=z.storage/Float32Array.BYTES_PER_ELEMENT)}}else m(v,M.__data,0);r.bufferSubData(r.UNIFORM_BUFFER,_,M.__data)}}function m(M,w,S){typeof M=="number"||typeof M=="boolean"?w[0]=M:M.isMatrix3?(w[0]=M.elements[0],w[1]=M.elements[1],w[2]=M.elements[2],w[3]=0,w[4]=M.elements[3],w[5]=M.elements[4],w[6]=M.elements[5],w[7]=0,w[8]=M.elements[6],w[9]=M.elements[7],w[10]=M.elements[8],w[11]=0):ArrayBuffer.isView(M)?w.set(new M.constructor(M.buffer,M.byteOffset,w.length)):M.toArray(w,S)}function x(M,w,S,T){let _=M.value,v=w+"_"+S;if(T[v]===void 0)return typeof _=="number"||typeof _=="boolean"?T[v]=_:ArrayBuffer.isView(_)?T[v]=_.slice():T[v]=_.clone(),!0;{let R=T[v];if(typeof _=="number"||typeof _=="boolean"){if(R!==_)return T[v]=_,!0}else{if(ArrayBuffer.isView(_))return!0;if(R.equals(_)===!1)return R.copy(_),!0}}return!1}function p(M){let w=M.uniforms,S=0,T=16;for(let v=0,R=w.length;v<R;v++){let C=Array.isArray(w[v])?w[v]:[w[v]];for(let I=0,z=C.length;I<z;I++){let N=C[I],F=Array.isArray(N.value)?N.value:[N.value];for(let D=0,B=F.length;D<B;D++){let X=F[D],k=g(X),Y=S%T,$=Y%k.boundary,ye=Y+$;S+=$,ye!==0&&T-ye<k.storage&&(S+=T-ye),N.__data=new Float32Array(k.storage/Float32Array.BYTES_PER_ELEMENT),N.__offset=S,S+=k.storage}}}let _=S%T;return _>0&&(S+=T-_),M.__size=S,M.__cache={},this}function g(M){let w={boundary:0,storage:0};return typeof M=="number"||typeof M=="boolean"?(w.boundary=4,w.storage=4):M.isVector2?(w.boundary=8,w.storage=8):M.isVector3||M.isColor?(w.boundary=16,w.storage=12):M.isVector4?(w.boundary=16,w.storage=16):M.isMatrix3?(w.boundary=48,w.storage=48):M.isMatrix4?(w.boundary=64,w.storage=64):M.isTexture?Le("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(M)?(w.boundary=16,w.storage=M.byteLength):Le("WebGLRenderer: Unsupported uniform value type.",M),w}function y(M){let w=M.target;w.removeEventListener("dispose",y);let S=a.indexOf(w.__bindingPointIndex);a.splice(S,1),r.deleteBuffer(i[w.id]),delete i[w.id],delete s[w.id]}function b(){for(let M in i)r.deleteBuffer(i[M]);a=[],i={},s={}}return{bind:l,update:h,dispose:b}}var N_=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),si=null;function D_(){return si===null&&(si=new js(N_,16,16,Zi,Yn),si.name="DFG_LUT",si.minFilter=zt,si.magFilter=zt,si.wrapS=An,si.wrapT=An,si.generateMipmaps=!1,si.needsUpdate=!0),si}var Oc=class{constructor(e={}){let{canvas:t=jd(),context:n=null,depth:i=!0,stencil:s=!1,alpha:a=!1,antialias:c=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:h=!1,powerPreference:o="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1,outputBufferType:f=mn}=e;this.isWebGLRenderer=!0;let m;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");m=n.getContextAttributes().alpha}else m=a;let x=f,p=new Set([Qo,jo,Jo]),g=new Set([mn,qn,ur,dr,Zo,Ko]),y=new Uint32Array(4),b=new Int32Array(4),M=new L,w=null,S=null,T=[],_=[],v=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Wn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let R=this,C=!1,I=null,z=null,N=null,F=null;this._outputColorSpace=_t;let D=0,B=0,X=null,k=-1,Y=null,$=new vt,ye=new vt,Me=null,ht=new Ae(0),it=0,ct=t.width,Q=t.height,ne=1,_e=null,Ge=null,Se=new vt(0,0,ct,Q),Ve=new vt(0,0,ct,Q),xt=!1,ie=new Qs,re=!1,oe=!1,ce=new Fe,ue=new L,Be=new vt,Ue={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},We=!1;function Ze(){return X===null?ne:1}let U=n;function ft(A,O){return t.getContext(A,O)}let st,P,E,G,q,J,le,he,j,te,de,Ne,ge,fe,De,Oe,Ke,H,pe,ee,me,Ee,se;try{let A={alpha:!0,depth:i,stencil:s,antialias:c,premultipliedAlpha:l,preserveDrawingBuffer:h,powerPreference:o,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${"186"}`),t.addEventListener("webglcontextlost",Tt,!1),t.addEventListener("webglcontextrestored",pt,!1),t.addEventListener("webglcontextcreationerror",Nn,!1),U===null){let O="webgl2";if(U=ft(O,A),U===null)throw ft(O)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}ze()}catch(A){throw t.removeEventListener("webglcontextlost",Tt,!1),t.removeEventListener("webglcontextrestored",pt,!1),t.removeEventListener("webglcontextcreationerror",Nn,!1),He("WebGLRenderer: "+A.message),A}function ze(){st=new kx(U),st.init(),me=new A_(U,st),P=new Px(U,st,e,me),E=new T_(U,st),P.reversedDepthBuffer&&d&&E.buffers.depth.setReversed(!0),z=U.createFramebuffer(),N=U.createFramebuffer(),F=U.createFramebuffer(),G=new Wx(U),q=new u_,J=new w_(U,st,E,q,P,me,G),le=new Hx(R),he=new qm(U),Ee=new Cx(U,he),j=new Gx(U,he,G,Ee),te=new qx(U,j,he,Ee,G),H=new Xx(U,P,J),De=new Lx(q),de=new h_(R,le,st,P,Ee,De),Ne=new P_(R,q),ge=new f_,fe=new __(st),Ke=new Rx(R,le,E,te,m,l),Oe=new S_(R,te,P),se=new L_(U,G,P,E),pe=new Ix(U,st,G),ee=new Vx(U,st,G),G.programs=de.programs,R.capabilities=P,R.extensions=st,R.properties=q,R.renderLists=ge,R.shadowMap=Oe,R.state=E,R.info=G}x!==mn&&(v=new Zx(x,t.width,t.height,c,i,s));let Ie=new Ph(R,U);this.xr=Ie,this.getContext=function(){return U},this.getContextAttributes=function(){return U.getContextAttributes()},this.forceContextLoss=function(){let A=st.get("WEBGL_lose_context");A&&A.loseContext()},this.forceContextRestore=function(){let A=st.get("WEBGL_lose_context");A&&A.restoreContext()},this.getPixelRatio=function(){return ne},this.setPixelRatio=function(A){A!==void 0&&(ne=A,this.setSize(ct,Q,!1))},this.getSize=function(A){return A.set(ct,Q)},this.setSize=function(A,O,K=!0){if(Ie.isPresenting){Le("WebGLRenderer: Can't change size while VR device is presenting.");return}ct=A,Q=O,t.width=Math.floor(A*ne),t.height=Math.floor(O*ne),K===!0&&(t.style.width=A+"px",t.style.height=O+"px"),v!==null&&v.setSize(t.width,t.height),this.setViewport(0,0,A,O)},this.getDrawingBufferSize=function(A){return A.set(ct*ne,Q*ne).floor()},this.setDrawingBufferSize=function(A,O,K){ct=A,Q=O,ne=K,t.width=Math.floor(A*K),t.height=Math.floor(O*K),this.setViewport(0,0,A,O)},this.setEffects=function(A){if(x===mn){He("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(A){for(let O=0;O<A.length;O++)if(A[O].isOutputPass===!0){Le("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}v.setEffects(A||[])},this.getCurrentViewport=function(A){return A.copy($)},this.getViewport=function(A){return A.copy(Se)},this.setViewport=function(A,O,K,V){A.isVector4?Se.set(A.x,A.y,A.z,A.w):Se.set(A,O,K,V),E.viewport($.copy(Se).multiplyScalar(ne).round())},this.getScissor=function(A){return A.copy(Ve)},this.setScissor=function(A,O,K,V){A.isVector4?Ve.set(A.x,A.y,A.z,A.w):Ve.set(A,O,K,V),E.scissor(ye.copy(Ve).multiplyScalar(ne).round())},this.getScissorTest=function(){return xt},this.setScissorTest=function(A){E.setScissorTest(xt=A)},this.setOpaqueSort=function(A){_e=A},this.setTransparentSort=function(A){Ge=A},this.getClearColor=function(A){return A.copy(Ke.getClearColor())},this.setClearColor=function(){Ke.setClearColor(...arguments)},this.getClearAlpha=function(){return Ke.getClearAlpha()},this.setClearAlpha=function(){Ke.setClearAlpha(...arguments)},this.clear=function(A=!0,O=!0,K=!0){let V=0;if(A){let W=!1;if(X!==null){let be=X.texture.format;W=p.has(be)}if(W){let be=X.texture.type,we=g.has(be),ve=Ke.getClearColor(),Re=Ke.getClearAlpha(),Pe=ve.r,Je=ve.g,rt=ve.b;we?(y[0]=Pe,y[1]=Je,y[2]=rt,y[3]=Re,U.clearBufferuiv(U.COLOR,0,y)):(b[0]=Pe,b[1]=Je,b[2]=rt,b[3]=Re,U.clearBufferiv(U.COLOR,0,b))}else V|=U.COLOR_BUFFER_BIT}O&&(V|=U.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),K&&(V|=U.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),V!==0&&U.clear(V)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(A){A.setRenderer(this),I=A},this.dispose=function(){t.removeEventListener("webglcontextlost",Tt,!1),t.removeEventListener("webglcontextrestored",pt,!1),t.removeEventListener("webglcontextcreationerror",Nn,!1),Ke.dispose(),ge.dispose(),fe.dispose(),q.dispose(),le.dispose(),te.dispose(),Ee.dispose(),se.dispose(),de.dispose(),Ie.dispose(),Ie.removeEventListener("sessionstart",gu),Ie.removeEventListener("sessionend",xu),$i.stop()};function Tt(A){A.preventDefault(),Hr("WebGLRenderer: Context Lost."),C=!0}function pt(){Hr("WebGLRenderer: Context Restored."),C=!1;let A=G.autoReset,O=Oe.enabled,K=Oe.autoUpdate,V=Oe.needsUpdate,W=Oe.type;ze(),G.autoReset=A,Oe.enabled=O,Oe.autoUpdate=K,Oe.needsUpdate=V,Oe.type=W}function Nn(A){He("WebGLRenderer: A WebGL context could not be created. Reason: ",A.statusMessage)}function Zn(A){let O=A.target;O.removeEventListener("dispose",Zn),cp(O)}function cp(A){lp(A),q.remove(A)}function lp(A){let O=q.get(A).programs;O!==void 0&&(O.forEach(function(K){de.releaseProgram(K)}),A.isShaderMaterial&&de.releaseShaderCache(A))}this.renderBufferDirect=function(A,O,K,V,W,be){O===null&&(O=Ue);let we=W.isMesh&&W.matrixWorld.determinantAffine()<0,ve=dp(A,O,K,V,W);E.setMaterial(V,we);let Re=K.index,Pe=1;if(V.wireframe===!0){if(Re=j.getWireframeAttribute(K),Re===void 0)return;Pe=2}let Je=K.drawRange,rt=K.attributes.position,Ce=Je.start*Pe,mt=(Je.start+Je.count)*Pe;be!==null&&(Ce=Math.max(Ce,be.start*Pe),mt=Math.min(mt,(be.start+be.count)*Pe)),Re!==null?(Ce=Math.max(Ce,0),mt=Math.min(mt,Re.count)):rt!=null&&(Ce=Math.max(Ce,0),mt=Math.min(mt,rt.count));let Ot=mt-Ce;if(Ot<0||Ot===1/0)return;Ee.setup(W,V,ve,K,Re);let Ct,St=pe;if(Re!==null&&(Ct=he.get(Re),St=ee,St.setIndex(Ct)),W.isMesh)V.wireframe===!0?(E.setLineWidth(V.wireframeLinewidth*Ze()),St.setMode(U.LINES)):St.setMode(U.TRIANGLES);else if(W.isLine){let Jt=V.linewidth;Jt===void 0&&(Jt=1),E.setLineWidth(Jt*Ze()),W.isLineSegments?St.setMode(U.LINES):W.isLineLoop?St.setMode(U.LINE_LOOP):St.setMode(U.LINE_STRIP)}else W.isPoints?St.setMode(U.POINTS):W.isSprite&&St.setMode(U.TRIANGLES);if(W.isBatchedMesh)if(st.get("WEBGL_multi_draw"))St.renderMultiDraw(W._multiDrawStarts,W._multiDrawCounts,W._multiDrawCount);else{let Jt=W._multiDrawStarts,Te=W._multiDrawCounts,tn=W._multiDrawCount,lt=Re?he.get(Re).bytesPerElement:1,Tn=q.get(V).currentProgram.getUniforms();for(let Kn=0;Kn<tn;Kn++)Tn.setValue(U,"_gl_DrawID",Kn),St.render(Jt[Kn]/lt,Te[Kn])}else if(W.isInstancedMesh)St.renderInstances(Ce,Ot,W.count);else if(K.isInstancedBufferGeometry){let Jt=K._maxInstanceCount!==void 0?K._maxInstanceCount:1/0,Te=Math.min(K.instanceCount,Jt);St.renderInstances(Ce,Ot,Te)}else St.render(Ce,Ot)};function mu(A,O,K,V){I!==null&&A.isNodeMaterial&&I.setObject(V,A),re===!0&&De.setState(A,K,!1),A.transparent===!0&&A.side===Rt&&A.forceSinglePass===!1?(A.side=on,A.needsUpdate=!0,La(A,O,V),A.side=ni,A.needsUpdate=!0,La(A,O,V),A.side=Rt):La(A,O,V)}this.compile=function(A,O,K=null){K===null&&(K=A),I!==null&&I.renderStart(A,O,K),S=fe.get(K),S.init(O),_.push(S),K.traverseVisible(function(W){W.isLight&&W.layers.test(O.layers)&&(S.pushLight(W),W.castShadow&&S.pushShadow(W))}),A!==K&&A.traverseVisible(function(W){W.isLight&&W.layers.test(O.layers)&&(S.pushLight(W),W.castShadow&&S.pushShadow(W))}),S.setupLights(),I!==null&&I.updateLights(S.state.lightsArray),oe=this.localClippingEnabled,re=De.init(this.clippingPlanes,oe),re===!0&&De.setGlobalState(this.clippingPlanes,O),I!==null&&Oe.render(S.state.shadowsArray,K,O);let V=new Set;return A.traverse(function(W){if(!(W.isMesh||W.isPoints||W.isLine||W.isSprite))return;let be=W.material;if(be)if(Array.isArray(be))for(let we=0;we<be.length;we++){let ve=be[we];mu(ve,K,O,W),V.add(ve)}else mu(be,K,O,W),V.add(be)}),S=_.pop(),I!==null&&I.renderEnd(),V},this.compileAsync=function(A,O,K=null){let V=this.compile(A,O,K);return new Promise(W=>{function be(){if(V.forEach(function(we){let Re=q.get(we).currentProgram;(Re===void 0||Re.isReady())&&V.delete(we)}),V.size===0){W(A);return}setTimeout(be,10)}st.get("KHR_parallel_shader_compile")!==null?be():setTimeout(be,10)})};let Qc=null;function hp(A){Qc&&Qc(A)}function gu(){$i.stop()}function xu(){$i.start()}let $i=new Nf;$i.setAnimationLoop(hp),typeof self<"u"&&$i.setContext(self),this.setAnimationLoop=function(A){Qc=A,Ie.setAnimationLoop(A),A===null?$i.stop():$i.start()},Ie.addEventListener("sessionstart",gu),Ie.addEventListener("sessionend",xu),this.render=function(A,O){if(O!==void 0&&O.isCamera!==!0){He("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(C===!0)return;I!==null&&I.renderStart(A,O);let K=Ie.enabled===!0&&Ie.isPresenting===!0,V=v!==null&&(X===null||K)&&v.begin(R,X);if(A.matrixWorldAutoUpdate===!0&&A.updateMatrixWorld(),O.parent===null&&O.matrixWorldAutoUpdate===!0&&O.updateMatrixWorld(),Ie.enabled===!0&&Ie.isPresenting===!0&&(v===null||v.isCompositing()===!1)&&(Ie.cameraAutoUpdate===!0&&Ie.updateCamera(O),O=Ie.getCamera()),A.isScene===!0&&A.onBeforeRender(R,A,O,X),S=fe.get(A,_.length),S.init(O),S.state.textureUnits=J.getTextureUnits(),_.push(S),ce.multiplyMatrices(O.projectionMatrix,O.matrixWorldInverse),ie.setFromProjectionMatrix(ce,On,O.reversedDepth),oe=this.localClippingEnabled,re=De.init(this.clippingPlanes,oe),w=ge.get(A,T.length),w.init(),T.push(w),Ie.enabled===!0&&Ie.isPresenting===!0){let we=R.xr.getDepthSensingMesh();we!==null&&el(we,O,-1/0,R.sortObjects)}el(A,O,0,R.sortObjects),w.finish(),I!==null&&I.updateLights(S.state.lightsArray),R.sortObjects===!0&&w.sort(_e,Ge),We=Ie.enabled===!1||Ie.isPresenting===!1||Ie.hasDepthSensing()===!1,We&&Ke.addToRenderList(w,A),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),re===!0&&De.beginShadows();let W=S.state.shadowsArray;if(Oe.render(W,A,O),re===!0&&De.endShadows(),(V&&v.hasRenderPass())===!1){let we=w.opaque,ve=w.transmissive;if(S.setupLights(),O.isArrayCamera){let Re=O.cameras;if(ve.length>0)for(let Pe=0,Je=Re.length;Pe<Je;Pe++){let rt=Re[Pe];_u(we,ve,A,rt)}We&&Ke.render(A);for(let Pe=0,Je=Re.length;Pe<Je;Pe++){let rt=Re[Pe];yu(w,A,rt,rt.viewport)}}else ve.length>0&&_u(we,ve,A,O),We&&Ke.render(A),yu(w,A,O)}X!==null&&B===0&&(J.updateMultisampleRenderTarget(X),J.updateRenderTargetMipmap(X)),V&&v.end(R),A.isScene===!0&&A.onAfterRender(R,A,O),Ee.resetDefaultState(),k=-1,Y=null,_.pop(),_.length>0?(S=_[_.length-1],J.setTextureUnits(S.state.textureUnits),re===!0&&De.setGlobalState(R.clippingPlanes,S.state.camera)):S=null,T.pop(),T.length>0?w=T[T.length-1]:w=null,I!==null&&I.renderEnd()};function el(A,O,K,V){if(A.visible===!1)return;if(A.layers.test(O.layers)){if(A.isGroup)K=A.renderOrder;else if(A.isLOD)A.autoUpdate===!0&&A.update(O);else if(A.isLightProbeGrid)S.pushLightProbeGrid(A);else if(A.isLight)S.pushLight(A),A.castShadow&&S.pushShadow(A);else if(A.isSprite){if(!A.frustumCulled||A.intersectsFrustum(ie)){V&&Be.setFromMatrixPosition(A.matrixWorld).applyMatrix4(ce);let we=te.update(A),ve=A.material;ve.visible&&w.push(A,we,ve,K,Be.z,null,O)}}else if((A.isMesh||A.isLine||A.isPoints)&&(!A.frustumCulled||A.intersectsFrustum(ie))){let we=te.update(A),ve=A.material;if(V&&(A.boundingSphere!==void 0?(A.boundingSphere===null&&A.computeBoundingSphere(),Be.copy(A.boundingSphere.center)):(we.boundingSphere===null&&we.computeBoundingSphere(),Be.copy(we.boundingSphere.center)),Be.applyMatrix4(A.matrixWorld).applyMatrix4(ce)),Array.isArray(ve)){let Re=we.groups;for(let Pe=0,Je=Re.length;Pe<Je;Pe++){let rt=Re[Pe],Ce=ve[rt.materialIndex];Ce&&Ce.visible&&w.push(A,we,Ce,K,Be.z,rt,O)}}else ve.visible&&w.push(A,we,ve,K,Be.z,null,O)}}let be=A.children;for(let we=0,ve=be.length;we<ve;we++)el(be[we],O,K,V)}function yu(A,O,K,V){let{opaque:W,transmissive:be,transparent:we}=A;S.setupLightsView(K),re===!0&&De.setGlobalState(R.clippingPlanes,K),V&&E.viewport($.copy(V)),W.length>0&&Pa(W,O,K),be.length>0&&Pa(be,O,K),we.length>0&&Pa(we,O,K),E.buffers.depth.setTest(!0),E.buffers.depth.setMask(!0),E.buffers.color.setMask(!0),E.setPolygonOffset(!1)}function _u(A,O,K,V){if((K.isScene===!0?K.overrideMaterial:null)!==null)return;if(S.state.transmissionRenderTarget[V.id]===void 0){let Ce=st.has("EXT_color_buffer_half_float")||st.has("EXT_color_buffer_float");S.state.transmissionRenderTarget[V.id]=new ln(1,1,{generateMipmaps:!0,type:Ce?Yn:mn,minFilter:Xn,samples:Math.max(4,P.samples),stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:Qe.workingColorSpace})}let be=S.state.transmissionRenderTarget[V.id],we=V.viewport||$;be.setSize(we.z*R.transmissionResolutionScale,we.w*R.transmissionResolutionScale);let ve=R.getRenderTarget(),Re=R.getActiveCubeFace(),Pe=R.getActiveMipmapLevel();R.setRenderTarget(be),R.getClearColor(ht),it=R.getClearAlpha(),it<1&&R.setClearColor(16777215,.5),R.clear(),We&&Ke.render(K);let Je=R.toneMapping;R.toneMapping=Wn;let rt=V.viewport;if(V.viewport!==void 0&&(V.viewport=void 0),S.setupLightsView(V),re===!0&&De.setGlobalState(R.clippingPlanes,V),Pa(A,K,V),J.updateMultisampleRenderTarget(be),J.updateRenderTargetMipmap(be),st.has("WEBGL_multisampled_render_to_texture")===!1){let Ce=!1;for(let mt=0,Ot=O.length;mt<Ot;mt++){let Ct=O[mt],{object:St,geometry:Jt,material:Te,group:tn}=Ct;if(Te.side===Rt&&St.layers.test(V.layers)){let lt=Te.side;Te.side=on,Te.needsUpdate=!0,vu(St,K,V,Jt,Te,tn),Te.side=lt,Te.needsUpdate=!0,Ce=!0}}Ce===!0&&(J.updateMultisampleRenderTarget(be),J.updateRenderTargetMipmap(be))}R.setRenderTarget(ve,Re,Pe),R.setClearColor(ht,it),rt!==void 0&&(V.viewport=rt),R.toneMapping=Je}function Pa(A,O,K){let V=O.isScene===!0?O.overrideMaterial:null;for(let W=0,be=A.length;W<be;W++){let we=A[W],{object:ve,geometry:Re,group:Pe}=we,Je=we.material;Je.allowOverride===!0&&V!==null&&(Je=V),ve.layers.test(K.layers)&&vu(ve,O,K,Re,Je,Pe)}}function vu(A,O,K,V,W,be){I!==null&&W.isNodeMaterial&&I.setObject(A,W),A.onBeforeRender(R,O,K,V,W,be),A.modelViewMatrix.multiplyMatrices(K.matrixWorldInverse,A.matrixWorld),A.normalMatrix.getNormalMatrix(A.modelViewMatrix),W.onBeforeRender(R,O,K,V,A,be),W.transparent===!0&&W.side===Rt&&W.forceSinglePass===!1?(W.side=on,W.needsUpdate=!0,R.renderBufferDirect(K,O,V,W,A,be),W.side=ni,W.needsUpdate=!0,R.renderBufferDirect(K,O,V,W,A,be),W.side=Rt):R.renderBufferDirect(K,O,V,W,A,be),A.onAfterRender(R,O,K,V,W,be)}function La(A,O,K){O.isScene!==!0&&(O=Ue);let V=q.get(A),W=S.state.lights,be=S.state.shadowsArray,we=W.state.version,ve=de.getParameters(A,W.state,be,O,K,S.state.lightProbeGridArray),Re=de.getProgramCacheKey(ve),Pe=V.programs;V.environment=A.isMeshStandardMaterial||A.isMeshLambertMaterial||A.isMeshPhongMaterial?O.environment:null,V.fog=O.fog;let Je=A.isMeshStandardMaterial||A.isMeshLambertMaterial&&!A.envMap||A.isMeshPhongMaterial&&!A.envMap;V.envMap=le.get(A.envMap||V.environment,Je),V.envMapRotation=V.environment!==null&&A.envMap===null?O.environmentRotation:A.envMapRotation,Pe===void 0&&(A.addEventListener("dispose",Zn),Pe=new Map,V.programs=Pe);let rt=Pe.get(Re);if(rt!==void 0){if(V.currentProgram===rt&&V.lightsStateVersion===we)return bu(A,ve),rt}else ve.uniforms=de.getUniforms(A),I!==null&&A.isNodeMaterial&&I.build(A,K,ve),A.onBeforeCompile(ve,R),rt=de.acquireProgram(ve,Re),Pe.set(Re,rt),V.uniforms=ve.uniforms;let Ce=V.uniforms;return(!A.isShaderMaterial&&!A.isRawShaderMaterial||A.clipping===!0)&&(Ce.clippingPlanes=De.uniform),bu(A,ve),V.needsLights=pp(A),V.lightsStateVersion=we,V.needsLights&&(Ce.ambientLightColor.value=W.state.ambient,Ce.lightProbe.value=W.state.probe,Ce.sunLights.value=W.state.sun,Ce.sunLightShadows.value=W.state.sunShadow,Ce.directionalLights.value=W.state.directional,Ce.directionalLightShadows.value=W.state.directionalShadow,Ce.spotLights.value=W.state.spot,Ce.spotLightShadows.value=W.state.spotShadow,Ce.rectAreaLights.value=W.state.rectArea,Ce.ltc_1.value=W.state.rectAreaLTC1,Ce.ltc_2.value=W.state.rectAreaLTC2,Ce.pointLights.value=W.state.point,Ce.pointLightShadows.value=W.state.pointShadow,Ce.hemisphereLights.value=W.state.hemi,Ce.sunShadowMatrix.value=W.state.sunShadowMatrix,Ce.sunShadowCascade.value=W.state.sunShadowCascade,Ce.directionalShadowMatrix.value=W.state.directionalShadowMatrix,Ce.spotLightMatrix.value=W.state.spotLightMatrix,Ce.spotLightMap.value=W.state.spotLightMap,Ce.pointShadowMatrix.value=W.state.pointShadowMatrix),V.lightProbeGrid=S.state.lightProbeGridArray.length>0,V.currentProgram=rt,V.uniformsList=null,rt}function Mu(A){if(A.uniformsList===null){let O=A.currentProgram.getUniforms();A.uniformsList=gr.seqWithValue(O.seq,A.uniforms)}return A.uniformsList}function bu(A,O){let K=q.get(A);K.outputColorSpace=O.outputColorSpace,K.batching=O.batching,K.batchingColor=O.batchingColor,K.instancing=O.instancing,K.instancingColor=O.instancingColor,K.instancingMorph=O.instancingMorph,K.skinning=O.skinning,K.morphTargets=O.morphTargets,K.morphNormals=O.morphNormals,K.morphColors=O.morphColors,K.morphTargetsCount=O.morphTargetsCount,K.numClippingPlanes=O.numClippingPlanes,K.numIntersection=O.numClipIntersection,K.vertexAlphas=O.vertexAlphas,K.vertexTangents=O.vertexTangents,K.toneMapping=O.toneMapping}function up(A,O){if(A.length===0)return null;if(A.length===1)return A[0].texture!==null?A[0]:null;M.setFromMatrixPosition(O.matrixWorld);for(let K=0,V=A.length;K<V;K++){let W=A[K];if(W.texture!==null&&W.boundingBox.containsPoint(M))return W}return null}function dp(A,O,K,V,W){O.isScene!==!0&&(O=Ue),J.resetTextureUnits();let be=O.fog,we=V.isMeshStandardMaterial||V.isMeshLambertMaterial||V.isMeshPhongMaterial?O.environment:null,ve=X===null?R.outputColorSpace:X.isXRRenderTarget===!0?X.texture.colorSpace:Qe.workingColorSpace,Re=V.isMeshStandardMaterial||V.isMeshLambertMaterial&&!V.envMap||V.isMeshPhongMaterial&&!V.envMap,Pe=le.get(V.envMap||we,Re),Je=V.vertexColors===!0&&!!K.attributes.color&&K.attributes.color.itemSize===4,rt=!!K.attributes.tangent&&(!!V.normalMap||V.anisotropy>0),Ce=!!K.morphAttributes.position,mt=!!K.morphAttributes.normal,Ot=!!K.morphAttributes.color,Ct=Wn;V.toneMapped&&(X===null||X.isXRRenderTarget===!0)&&(Ct=R.toneMapping);let St=K.morphAttributes.position||K.morphAttributes.normal||K.morphAttributes.color,Jt=St!==void 0?St.length:0,Te=q.get(V),tn=S.state.lights;if(re===!0&&(oe===!0||A!==Y)){let wt=A===Y&&V.id===k;De.setState(V,A,wt)}let lt=!1;V.version===Te.__version?(Te.needsLights&&Te.lightsStateVersion!==tn.state.version||Te.outputColorSpace!==ve||W.isBatchedMesh&&Te.batching===!1||!W.isBatchedMesh&&Te.batching===!0||W.isBatchedMesh&&Te.batchingColor===!0&&W._colorsTexture===null||W.isBatchedMesh&&Te.batchingColor===!1&&W._colorsTexture!==null||W.isInstancedMesh&&Te.instancing===!1||!W.isInstancedMesh&&Te.instancing===!0||W.isSkinnedMesh&&Te.skinning===!1||!W.isSkinnedMesh&&Te.skinning===!0||W.isInstancedMesh&&Te.instancingColor===!0&&W.instanceColor===null||W.isInstancedMesh&&Te.instancingColor===!1&&W.instanceColor!==null||W.isInstancedMesh&&Te.instancingMorph===!0&&W.morphTexture===null||W.isInstancedMesh&&Te.instancingMorph===!1&&W.morphTexture!==null||Te.envMap!==Pe||V.fog===!0&&Te.fog!==be||Te.numClippingPlanes!==void 0&&(Te.numClippingPlanes!==De.numPlanes||Te.numIntersection!==De.numIntersection)||Te.vertexAlphas!==Je||Te.vertexTangents!==rt||Te.morphTargets!==Ce||Te.morphNormals!==mt||Te.morphColors!==Ot||Te.toneMapping!==Ct||Te.morphTargetsCount!==Jt||!!Te.lightProbeGrid!=S.state.lightProbeGridArray.length>0)&&(lt=!0):(lt=!0,Te.__version=V.version);let Tn=Te.currentProgram;lt===!0&&(Tn=La(V,O,W),I&&V.isNodeMaterial&&I.onUpdateProgram(V,Tn,Te));let Kn=!1,Ai=!1,bs=!1,Mt=Tn.getUniforms(),Nt=Te.uniforms;if(E.useProgram(Tn.program)&&(Kn=!0,Ai=!0,bs=!0),V.id!==k&&(k=V.id,Ai=!0),Te.needsLights){let wt=up(S.state.lightProbeGridArray,W);Te.lightProbeGrid!==wt&&(Te.lightProbeGrid=wt,Ai=!0)}if(Kn||Y!==A){E.buffers.depth.getReversed()&&A.reversedDepth!==!0&&(A._reversedDepth=!0,A.updateProjectionMatrix()),Mt.setValue(U,"projectionMatrix",A.projectionMatrix),Mt.setValue(U,"viewMatrix",A.matrixWorldInverse);let Ci=Mt.map.cameraPosition;Ci!==void 0&&Ci.setValue(U,ue.setFromMatrixPosition(A.matrixWorld)),P.logarithmicDepthBuffer&&Mt.setValue(U,"logDepthBufFC",2/(Math.log(A.far+1)/Math.LN2)),(V.isMeshPhongMaterial||V.isMeshToonMaterial||V.isMeshLambertMaterial||V.isMeshBasicMaterial||V.isMeshStandardMaterial||V.isShaderMaterial)&&Mt.setValue(U,"isOrthographic",A.isOrthographicCamera===!0),Y!==A&&(Y=A,Ai=!0,bs=!0)}if(Te.needsLights&&(tn.state.sunShadowMap.length>0&&Mt.setValue(U,"sunShadowMap",tn.state.sunShadowMap,J),tn.state.directionalShadowMap.length>0&&Mt.setValue(U,"directionalShadowMap",tn.state.directionalShadowMap,J),tn.state.spotShadowMap.length>0&&Mt.setValue(U,"spotShadowMap",tn.state.spotShadowMap,J),tn.state.pointShadowMap.length>0&&Mt.setValue(U,"pointShadowMap",tn.state.pointShadowMap,J)),W.isSkinnedMesh){Mt.setOptional(U,W,"bindMatrix"),Mt.setOptional(U,W,"bindMatrixInverse");let wt=W.skeleton;wt&&(wt.boneTexture===null&&wt.computeBoneTexture(),Mt.setValue(U,"boneTexture",wt.boneTexture,J))}W.isBatchedMesh&&(Mt.setOptional(U,W,"batchingTexture"),Mt.setValue(U,"batchingTexture",W._matricesTexture,J),Mt.setOptional(U,W,"batchingIdTexture"),Mt.setValue(U,"batchingIdTexture",W._indirectTexture,J),Mt.setOptional(U,W,"batchingColorTexture"),W._colorsTexture!==null&&Mt.setValue(U,"batchingColorTexture",W._colorsTexture,J));let Ri=K.morphAttributes;if((Ri.position!==void 0||Ri.normal!==void 0||Ri.color!==void 0)&&H.update(W,K,Tn),(Ai||Te.receiveShadow!==W.receiveShadow)&&(Te.receiveShadow=W.receiveShadow,Mt.setValue(U,"receiveShadow",W.receiveShadow)),(V.isMeshStandardMaterial||V.isMeshLambertMaterial||V.isMeshPhongMaterial)&&V.envMap===null&&O.environment!==null&&(Nt.envMapIntensity.value=O.environmentIntensity),Nt.dfgLUT!==void 0&&(Nt.dfgLUT.value=D_()),Ai){if(Mt.setValue(U,"toneMappingExposure",R.toneMappingExposure),Te.needsLights&&fp(Nt,bs),be&&V.fog===!0&&Ne.refreshFogUniforms(Nt,be),Ne.refreshMaterialUniforms(Nt,V,ne,Q,S.state.transmissionRenderTarget[A.id]),Te.needsLights&&Te.lightProbeGrid){let wt=Te.lightProbeGrid;Nt.probesSH.value=wt.texture,Nt.probesMin.value.copy(wt.boundingBox.min),Nt.probesMax.value.copy(wt.boundingBox.max),Nt.probesResolution.value.copy(wt.resolution)}gr.upload(U,Mu(Te),Nt,J)}if(V.isShaderMaterial&&V.uniformsNeedUpdate===!0&&(gr.upload(U,Mu(Te),Nt,J),V.uniformsNeedUpdate=!1),V.isSpriteMaterial&&Mt.setValue(U,"center",W.center),Mt.setValue(U,"modelViewMatrix",W.modelViewMatrix),Mt.setValue(U,"normalMatrix",W.normalMatrix),Mt.setValue(U,"modelMatrix",W.matrixWorld),V.uniformsGroups!==void 0){let wt=V.uniformsGroups;for(let Ci=0,Es=wt.length;Ci<Es;Ci++){let Su=wt[Ci];se.update(Su,Tn),se.bind(Su,Tn)}}return Tn}function fp(A,O){A.ambientLightColor.needsUpdate=O,A.lightProbe.needsUpdate=O,A.sunLights.needsUpdate=O,A.sunLightShadows.needsUpdate=O,A.directionalLights.needsUpdate=O,A.directionalLightShadows.needsUpdate=O,A.pointLights.needsUpdate=O,A.pointLightShadows.needsUpdate=O,A.spotLights.needsUpdate=O,A.spotLightShadows.needsUpdate=O,A.rectAreaLights.needsUpdate=O,A.hemisphereLights.needsUpdate=O}function pp(A){return A.isMeshLambertMaterial||A.isMeshToonMaterial||A.isMeshPhongMaterial||A.isMeshStandardMaterial||A.isShadowMaterial||A.isShaderMaterial&&A.lights===!0}this.getActiveCubeFace=function(){return D},this.getActiveMipmapLevel=function(){return B},this.getRenderTarget=function(){return X},this.setRenderTargetTextures=function(A,O,K){let V=q.get(A);V.__autoAllocateDepthBuffer=A.resolveDepthBuffer===!1,V.__autoAllocateDepthBuffer===!1&&(V.__useRenderToTexture=!1),q.get(A.texture).__webglTexture=O,q.get(A.depthTexture).__webglTexture=V.__autoAllocateDepthBuffer?void 0:K,V.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(A,O){let K=q.get(A);K.__webglFramebuffer=O,K.__useDefaultFramebuffer=O===void 0},this.setRenderTarget=function(A,O=0,K=0){X=A,D=O,B=K;let V=null,W=!1,be=!1;if(A){let ve=q.get(A);if(ve.__useDefaultFramebuffer!==void 0){E.bindFramebuffer(U.FRAMEBUFFER,ve.__webglFramebuffer),$.copy(A.viewport),ye.copy(A.scissor),Me=A.scissorTest,E.viewport($),E.scissor(ye),E.setScissorTest(Me),k=-1;return}else if(ve.__webglFramebuffer===void 0)J.setupRenderTarget(A);else if(ve.__hasExternalTextures)J.rebindTextures(A,q.get(A.texture).__webglTexture,q.get(A.depthTexture).__webglTexture);else if(A.depthBuffer){let Je=A.depthTexture;if(ve.__boundDepthTexture!==Je){if(Je!==null&&q.has(Je)&&(A.width!==Je.image.width||A.height!==Je.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");J.setupDepthRenderbuffer(A)}}let Re=A.texture;(Re.isData3DTexture||Re.isDataArrayTexture||Re.isCompressedArrayTexture)&&(be=!0);let Pe=q.get(A).__webglFramebuffer;A.isWebGLCubeRenderTarget?(Array.isArray(Pe[O])?V=Pe[O][K]:V=Pe[O],W=!0):A.samples>0&&J.useMultisampledRTT(A)===!1?V=q.get(A).__webglMultisampledFramebuffer:Array.isArray(Pe)?V=Pe[K]:V=Pe,$.copy(A.viewport),ye.copy(A.scissor),Me=A.scissorTest}else $.copy(Se).multiplyScalar(ne).floor(),ye.copy(Ve).multiplyScalar(ne).floor(),Me=xt;if(K!==0&&(V=z),E.bindFramebuffer(U.FRAMEBUFFER,V)&&E.drawBuffers(A,V),E.viewport($),E.scissor(ye),E.setScissorTest(Me),W){let ve=q.get(A.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_CUBE_MAP_POSITIVE_X+O,ve.__webglTexture,K)}else if(be){let ve=O;for(let Re=0;Re<A.textures.length;Re++){let Pe=q.get(A.textures[Re]);U.framebufferTextureLayer(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0+Re,Pe.__webglTexture,K,ve)}}else if(A!==null&&K!==0){let ve=q.get(A.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,ve.__webglTexture,K)}k=-1};function Eu(A){let O=q.get(A);return(O.__readFormat!==A.format||O.__readType!==A.type)&&(O.__readFormat=A.format,O.__readType=A.type,O.__formatReadable=P.textureFormatReadable(A.format),O.__typeReadable=P.textureTypeReadable(A.type)),O}this.readRenderTargetPixels=function(A,O,K,V,W,be,we,ve=0){if(!(A&&A.isWebGLRenderTarget)){He("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Re=q.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&we!==void 0&&(Re=Re[we]),Re){E.bindFramebuffer(U.FRAMEBUFFER,Re);try{let Pe=A.textures[ve],Je=Pe.format,rt=Pe.type;A.textures.length>1&&U.readBuffer(U.COLOR_ATTACHMENT0+ve);let Ce=Eu(Pe);if(Ce.__formatReadable===!1){He("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Ce.__typeReadable===!1){He("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}O>=0&&O<=A.width-V&&K>=0&&K<=A.height-W&&U.readPixels(O,K,V,W,me.convert(Je),me.convert(rt),be)}finally{let Pe=X!==null?q.get(X).__webglFramebuffer:null;E.bindFramebuffer(U.FRAMEBUFFER,Pe)}}},this.readRenderTargetPixelsAsync=async function(A,O,K,V,W,be,we,ve=0){if(!(A&&A.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Re=q.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&we!==void 0&&(Re=Re[we]),Re)if(O>=0&&O<=A.width-V&&K>=0&&K<=A.height-W){E.bindFramebuffer(U.FRAMEBUFFER,Re);let Pe=A.textures[ve],Je=Pe.format,rt=Pe.type;A.textures.length>1&&U.readBuffer(U.COLOR_ATTACHMENT0+ve);let Ce=Eu(Pe);if(Ce.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Ce.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let mt=U.createBuffer();U.bindBuffer(U.PIXEL_PACK_BUFFER,mt),U.bufferData(U.PIXEL_PACK_BUFFER,be.byteLength,U.STREAM_READ),U.readPixels(O,K,V,W,me.convert(Je),me.convert(rt),0),U.bindBuffer(U.PIXEL_PACK_BUFFER,null);let Ot=X!==null?q.get(X).__webglFramebuffer:null;E.bindFramebuffer(U.FRAMEBUFFER,Ot);let Ct=U.fenceSync(U.SYNC_GPU_COMMANDS_COMPLETE,0);return U.flush(),await ef(U,Ct,4),U.bindBuffer(U.PIXEL_PACK_BUFFER,mt),U.getBufferSubData(U.PIXEL_PACK_BUFFER,0,be),U.bindBuffer(U.PIXEL_PACK_BUFFER,null),U.deleteBuffer(mt),U.deleteSync(Ct),be}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(A,O=null,K=0){let V=Math.pow(2,-K),W=Math.floor(A.image.width*V),be=Math.floor(A.image.height*V),we=O!==null?O.x:0,ve=O!==null?O.y:0;J.setTexture2D(A,0),U.copyTexSubImage2D(U.TEXTURE_2D,K,0,0,we,ve,W,be),E.unbindTexture()},this.copyTextureToTexture=function(A,O,K=null,V=null,W=0,be=0){let we,ve,Re,Pe,Je,rt,Ce,mt,Ot,Ct=A.isCompressedTexture?A.mipmaps[be]:A.image;if(K!==null)we=K.max.x-K.min.x,ve=K.max.y-K.min.y,Re=K.isBox3?K.max.z-K.min.z:1,Pe=K.min.x,Je=K.min.y,rt=K.isBox3?K.min.z:0;else{let Nt=Math.pow(2,-W);we=Math.floor(Ct.width*Nt),ve=Math.floor(Ct.height*Nt),A.isDataArrayTexture?Re=Ct.depth:A.isData3DTexture?Re=Math.floor(Ct.depth*Nt):Re=1,Pe=0,Je=0,rt=0}V!==null?(Ce=V.x,mt=V.y,Ot=V.z):(Ce=0,mt=0,Ot=0);let St=me.convert(O.format),Jt=me.convert(O.type),Te;O.isData3DTexture?(J.setTexture3D(O,0),Te=U.TEXTURE_3D):O.isDataArrayTexture||O.isCompressedArrayTexture?(J.setTexture2DArray(O,0),Te=U.TEXTURE_2D_ARRAY):(J.setTexture2D(O,0),Te=U.TEXTURE_2D),E.activeTexture(U.TEXTURE0),E.pixelStorei(U.UNPACK_FLIP_Y_WEBGL,O.flipY),E.pixelStorei(U.UNPACK_PREMULTIPLY_ALPHA_WEBGL,O.premultiplyAlpha),E.pixelStorei(U.UNPACK_ALIGNMENT,O.unpackAlignment);let tn=E.getParameter(U.UNPACK_ROW_LENGTH),lt=E.getParameter(U.UNPACK_IMAGE_HEIGHT),Tn=E.getParameter(U.UNPACK_SKIP_PIXELS),Kn=E.getParameter(U.UNPACK_SKIP_ROWS),Ai=E.getParameter(U.UNPACK_SKIP_IMAGES);E.pixelStorei(U.UNPACK_ROW_LENGTH,Ct.width),E.pixelStorei(U.UNPACK_IMAGE_HEIGHT,Ct.height),E.pixelStorei(U.UNPACK_SKIP_PIXELS,Pe),E.pixelStorei(U.UNPACK_SKIP_ROWS,Je),E.pixelStorei(U.UNPACK_SKIP_IMAGES,rt);let bs=A.isDataArrayTexture||A.isData3DTexture,Mt=O.isDataArrayTexture||O.isData3DTexture;if(A.isDepthTexture){let Nt=q.get(A),Ri=q.get(O),wt=q.get(Nt.__renderTarget),Ci=q.get(Ri.__renderTarget);E.bindFramebuffer(U.READ_FRAMEBUFFER,wt.__webglFramebuffer),E.bindFramebuffer(U.DRAW_FRAMEBUFFER,Ci.__webglFramebuffer);for(let Es=0;Es<Re;Es++)bs&&(U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,q.get(A).__webglTexture,W,rt+Es),U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,q.get(O).__webglTexture,be,Ot+Es)),U.blitFramebuffer(Pe,Je,we,ve,Ce,mt,we,ve,U.DEPTH_BUFFER_BIT,U.NEAREST);E.bindFramebuffer(U.READ_FRAMEBUFFER,null),E.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else if(W!==0||A.isRenderTargetTexture||q.has(A)){let Nt=q.get(A),Ri=q.get(O);E.bindFramebuffer(U.READ_FRAMEBUFFER,N),E.bindFramebuffer(U.DRAW_FRAMEBUFFER,F);for(let wt=0;wt<Re;wt++)bs?U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,Nt.__webglTexture,W,rt+wt):U.framebufferTexture2D(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,Nt.__webglTexture,W),Mt?U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,Ri.__webglTexture,be,Ot+wt):U.framebufferTexture2D(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,Ri.__webglTexture,be),W!==0?U.blitFramebuffer(Pe,Je,we,ve,Ce,mt,we,ve,U.COLOR_BUFFER_BIT,U.NEAREST):Mt?U.copyTexSubImage3D(Te,be,Ce,mt,Ot+wt,Pe,Je,we,ve):U.copyTexSubImage2D(Te,be,Ce,mt,Pe,Je,we,ve);E.bindFramebuffer(U.READ_FRAMEBUFFER,null),E.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else Mt?A.isDataTexture||A.isData3DTexture?U.texSubImage3D(Te,be,Ce,mt,Ot,we,ve,Re,St,Jt,Ct.data):O.isCompressedArrayTexture?U.compressedTexSubImage3D(Te,be,Ce,mt,Ot,we,ve,Re,St,Ct.data):U.texSubImage3D(Te,be,Ce,mt,Ot,we,ve,Re,St,Jt,Ct):A.isDataTexture?U.texSubImage2D(U.TEXTURE_2D,be,Ce,mt,we,ve,St,Jt,Ct.data):A.isCompressedTexture?U.compressedTexSubImage2D(U.TEXTURE_2D,be,Ce,mt,Ct.width,Ct.height,St,Ct.data):U.texSubImage2D(U.TEXTURE_2D,be,Ce,mt,we,ve,St,Jt,Ct);E.pixelStorei(U.UNPACK_ROW_LENGTH,tn),E.pixelStorei(U.UNPACK_IMAGE_HEIGHT,lt),E.pixelStorei(U.UNPACK_SKIP_PIXELS,Tn),E.pixelStorei(U.UNPACK_SKIP_ROWS,Kn),E.pixelStorei(U.UNPACK_SKIP_IMAGES,Ai),be===0&&O.generateMipmaps&&U.generateMipmap(Te),E.unbindTexture()},this.initRenderTarget=function(A){q.get(A).__webglFramebuffer===void 0&&J.setupRenderTarget(A)},this.initTexture=function(A){A.isCubeTexture?J.setTextureCube(A,0):A.isData3DTexture?J.setTexture3D(A,0):A.isDataArrayTexture||A.isCompressedArrayTexture?J.setTexture2DArray(A,0):J.setTexture2D(A,0),E.unbindTexture()},this.resetState=function(){D=0,B=0,X=null,E.reset(),Ee.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return On}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=Qe._getDrawingBufferColorSpace(e),t.unpackColorSpace=Qe._getUnpackColorSpace()}};var En={duration:19.71,maps:["\u0423\u0429\u0415\u041B\u042C\u0415 \u0417\u0410\u041A\u0410\u0422\u0410","\u041F\u0420\u041E\u041A\u041B\u042F\u0422\u041E\u0415 \u041A\u041B\u0410\u0414\u0411\u0418\u0429\u0415","\u0414\u041E\u041C \u041A\u041E\u041B\u041B\u0415\u041A\u0426\u0418\u041E\u041D\u0415\u0420\u0410","\u041A\u0410\u0422\u0410\u041A\u041E\u041C\u0411\u042B"],beats:[{at:.2,title:"\u0414\u041E\u0411\u0415\u0420\u0418\u0421\u042C \u0414\u041E \u0421\u041F\u0410\u0421\u0415\u041D\u0418\u042F",text:"\u0414\u043E\u0431\u0435\u0440\u0438\u0441\u044C \u0434\u043E \u0444\u0438\u043D\u0438\u0448\u0430 \u0436\u0438\u0432\u044B\u043C. \u041F\u0430\u0434\u0435\u043D\u0438\u0435 \u0432\u0435\u0440\u043D\u0451\u0442 \u043A \u0447\u0435\u043A\u043F\u043E\u0438\u043D\u0442\u0443.",clip:"short_goal"},{at:4.24,title:"\u0414\u0412\u0418\u0413\u0410\u0419\u0421\u042F \u0418 \u041F\u0420\u042B\u0413\u0410\u0419",text:"\u041D\u0430 \u0442\u0435\u043B\u0435\u0444\u043E\u043D\u0435 \u2014 \u0434\u0436\u043E\u0439\u0441\u0442\u0438\u043A \u0438 \u043F\u0440\u044B\u0436\u043E\u043A. \u041D\u0430 \u043A\u043E\u043C\u043F\u044C\u044E\u0442\u0435\u0440\u0435 \u2014 \u0441\u0442\u0440\u0435\u043B\u043A\u0438 \u0438 \u043F\u0440\u043E\u0431\u0435\u043B.",clip:"short_controls"},{at:8.38,title:"\u041F\u0420\u0410\u0412\u0418\u041B\u041E \u0417\u0410\u0411\u0415\u0413\u0410",text:"",clip:"format"},{at:13.92,title:"\u0420\u0415\u0414\u041A\u0418\u0419 \u0428\u0410\u041D\u0421 \u0412\u0415\u0420\u041D\u0423\u0422\u042C\u0421\u042F",text:"\u0420\u0435\u0434\u043A\u0430\u044F \u0418\u0441\u043A\u0440\u0430 \u0436\u0438\u0437\u043D\u0438 \u0432\u043E\u0437\u0432\u0440\u0430\u0449\u0430\u0435\u0442 \u043F\u0440\u0438\u0437\u0440\u0430\u043A\u0430 \u043A \u0436\u0438\u0432\u044B\u043C. \u041F\u0435\u0440\u0432\u044B\u0439, \u043A\u0442\u043E \u043A\u043E\u0441\u043D\u0451\u0442\u0441\u044F \u0435\u0451, \u0432\u043E\u0441\u043A\u0440\u0435\u0441\u043D\u0435\u0442.",clip:"short_spark"}],formats:{DEATH_RUN:{text:"\u0414\u043E\u0431\u0435\u0440\u0438\u0441\u044C \u0434\u043E \u0444\u0438\u043D\u0438\u0448\u0430, \u043F\u043E\u043A\u0430 \u043D\u0435 \u0438\u0441\u0442\u0451\u043A \u043E\u0431\u0449\u0438\u0439 \u0442\u0430\u0439\u043C\u0435\u0440. \u041E\u043F\u043E\u0437\u0434\u0430\u0432\u0448\u0438\u0435 \u043F\u043E\u0433\u0438\u0431\u043D\u0443\u0442.",clip:"intro_format_death",duration:4.1,filmDuration:18.41},DARKNESS:{text:"\u0417\u0430 \u0441\u043F\u0438\u043D\u043E\u0439 \u043D\u0430\u0441\u0442\u0443\u043F\u0430\u0435\u0442 \u0442\u044C\u043C\u0430. \u041D\u0435 \u0434\u0430\u0439 \u0435\u0439 \u0434\u043E\u0433\u043D\u0430\u0442\u044C \u0442\u0435\u0431\u044F.",clip:"intro_format_darkness",duration:3.4,filmDuration:17.71},LAST_SURVIVORS:{text:"\u041D\u0430 \u0440\u0443\u0431\u0435\u0436\u0430\u0445 \u0432\u043E\u0440\u043E\u0442\u0430 \u0437\u0430\u043A\u0440\u044B\u0432\u0430\u044E\u0442\u0441\u044F. \u041E\u0442\u0441\u0442\u0430\u0432\u0448\u0438\u0435 \u0432\u044B\u0431\u044B\u0432\u0430\u044E\u0442. \u041D\u0435 \u043E\u043A\u0430\u0436\u0438\u0441\u044C \u0437\u0430 \u0447\u0435\u0440\u0442\u043E\u0439.",clip:"intro_format_survivors",duration:4.9,filmDuration:19.21},COLLAPSE:{text:"\u0422\u0440\u0430\u0441\u0441\u0430 \u0440\u0443\u0448\u0438\u0442\u0441\u044F \u0437\u0430 \u0441\u043F\u0438\u043D\u043E\u0439. \u041F\u0440\u043E\u0439\u0434\u0435\u043D\u043D\u044B\u0439 \u043F\u0443\u0442\u044C \u0431\u043E\u043B\u044C\u0448\u0435 \u043D\u0435 \u0431\u0435\u0437\u043E\u043F\u0430\u0441\u0435\u043D.",clip:"intro_format_collapse",duration:3.7,filmDuration:18.01},LAST_CHANCE:{text:"\u0423 \u043A\u0430\u0436\u0434\u043E\u0433\u043E \u0441\u0432\u043E\u0439 \u0442\u0430\u0439\u043C\u0435\u0440. \u0414\u043E\u0441\u0442\u0438\u0433\u0430\u0439 \u043D\u043E\u0432\u044B\u0445 \u0447\u0435\u043A\u043F\u043E\u0438\u043D\u0442\u043E\u0432, \u0447\u0442\u043E\u0431\u044B \u043F\u043E\u043B\u0443\u0447\u0438\u0442\u044C \u0434\u043E\u043F\u043E\u043B\u043D\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u0435 \u0441\u0435\u043A\u0443\u043D\u0434\u044B.",clip:"intro_format_chance",duration:5.4,filmDuration:19.71},SALVATION:{text:"\u041D\u0430 \u0444\u0438\u043D\u0438\u0448\u0435 \u0436\u0434\u0451\u0442 \u0443\u0431\u0435\u0436\u0438\u0449\u0435. \u041D\u043E \u043C\u0435\u0441\u0442 \u0432 \u043D\u0451\u043C \u043C\u0435\u043D\u044C\u0448\u0435, \u0447\u0435\u043C \u0436\u0438\u0432\u044B\u0445.",clip:"intro_format_salvation",duration:4.1,filmDuration:18.41}}};var _r={DEATH_RUN:"\u0421\u041C\u0415\u0420\u0422\u0415\u041B\u042C\u041D\u042B\u0419 \u0417\u0410\u0411\u0415\u0413",DARKNESS:"\u041D\u0410\u0421\u0422\u0423\u041F\u0410\u042E\u0429\u0410\u042F \u0422\u042C\u041C\u0410",LAST_SURVIVORS:"\u041F\u041E\u0421\u041B\u0415\u0414\u041D\u0418\u0415 \u0412\u042B\u0416\u0418\u0412\u0428\u0418\u0415",COLLAPSE:"\u0420\u0410\u0417\u0420\u0423\u0428\u0410\u042E\u0429\u0418\u0419\u0421\u042F \u041C\u0418\u0420",LAST_CHANCE:"\u041F\u041E\u0421\u041B\u0415\u0414\u041D\u0418\u0419 \u0428\u0410\u041D\u0421",SALVATION:"\u0421\u041F\u0410\u0421\u0418\u0422\u0415\u041B\u042C\u041D\u042B\u0415 \u0412\u041E\u0420\u041E\u0422\u0410"},U_={DEATH_RUN:"\u0423\u0441\u043F\u0435\u0439 \u0434\u043E \u0444\u0438\u043D\u0438\u0448\u0430 \u2014 \u0438\u043B\u0438 \u0443\u043C\u0440\u0438",DARKNESS:"\u0422\u044C\u043C\u0430 \u043F\u043E\u0433\u043B\u043E\u0449\u0430\u0435\u0442 \u043E\u0442\u0441\u0442\u0430\u0432\u0448\u0438\u0445",LAST_SURVIVORS:"\u041D\u0430 \u0440\u0443\u0431\u0435\u0436\u0430\u0445 \u043C\u0435\u0441\u0442\u0430 \u0437\u0430\u043A\u0430\u043D\u0447\u0438\u0432\u0430\u044E\u0442\u0441\u044F",COLLAPSE:"\u0422\u0440\u0430\u0441\u0441\u0430 \u0440\u0443\u0448\u0438\u0442\u0441\u044F \u0437\u0430 \u0441\u043F\u0438\u043D\u043E\u0439",LAST_CHANCE:"\u0421\u0432\u043E\u0451 \u0432\u0440\u0435\u043C\u044F \u0443 \u043A\u0430\u0436\u0434\u043E\u0433\u043E: \u0447\u0435\u043A\u043F\u043E\u0438\u043D\u0442\u044B \u0434\u0430\u044E\u0442 \u0441\u0435\u043A\u0443\u043D\u0434\u044B",SALVATION:"\u0412 \u0443\u0431\u0435\u0436\u0438\u0449\u0435 \u043C\u0435\u0441\u0442 \u043C\u0435\u043D\u044C\u0448\u0435, \u0447\u0435\u043C \u0436\u0438\u0432\u044B\u0445"},F_={DEATH_RUN:1,DARKNESS:2,LAST_SURVIVORS:3,COLLAPSE:4,LAST_CHANCE:5,SALVATION:6},B_={TIME:["\u0412\u0420\u0415\u041C\u042F \u0418\u0421\u0422\u0415\u041A\u041B\u041E","\u0442\u0435\u043F\u0435\u0440\u044C \u0442\u044B \u043F\u0440\u0438\u0437\u0440\u0430\u043A"],DARKNESS:["\u0422\u042C\u041C\u0410 \u041F\u041E\u0413\u041B\u041E\u0422\u0418\u041B\u0410 \u0422\u0415\u0411\u042F","\u0442\u0435\u043F\u0435\u0440\u044C \u0442\u044B \u043F\u0440\u0438\u0437\u0440\u0430\u043A"],COLLAPSE:["\u041C\u0418\u0420 \u0420\u0423\u0425\u041D\u0423\u041B \u041F\u041E\u0414 \u0422\u041E\u0411\u041E\u0419","\u0442\u0435\u043F\u0435\u0440\u044C \u0442\u044B \u043F\u0440\u0438\u0437\u0440\u0430\u043A"],GATE:["\u0412\u041E\u0420\u041E\u0422\u0410 \u0417\u0410\u041A\u0420\u042B\u041B\u0418\u0421\u042C","\u043C\u0435\u0441\u0442 \u0431\u043E\u043B\u044C\u0448\u0435 \u043D\u0435\u0442"],SEATS:["\u0422\u042B \u041D\u0415 \u0423\u0421\u041F\u0415\u041B!","\u0443\u0431\u0435\u0436\u0438\u0449\u0435 \u0437\u0430\u043F\u043E\u043B\u043D\u0435\u043D\u043E"]},Gc=class{constructor(e){this.app=e}run=null;pending=null;prev=new Map;seenEv=0;ghostLook=new Map;spark;sparkCore;sparkShards=[];sparkHalo;sparkSent=0;front;frontMats=[];ash;revivals=[];voiceQ=[];voiceBusy=0;saidStart=!1;camFocus;camSince=0;manual=null;lastBeep=0;shown=new Set;apply(e){if(!e)return;let t=this.app;if(!t.me||!t.runners?.length){this.pending=e;return}let n=!this.run;this.run=e,t.limit=e.limitMs/1e3,n&&this.announce();for(let i of t.runners){let s=e.players[i.id];if(!s)continue;let a=this.prev.get(i.id);this.prev.set(i.id,s.status),i.ghost=!s.alive,this.setGhostLook(i,!s.alive&&!this.revivals.some(c=>c.r===i)),a&&a!==s.status&&this.transition(i,a,s)}for(let i of e.events)i.seq>this.seenEv&&(this.seenEv=i.seq,this.event(i));document.body.classList.toggle("me-ghost",!!t.me.ghost)}announce(){let e=this.run.format;this.app.toast?.(_r[e]);let t=document.getElementById("format");t&&(t.innerHTML=`<b>${_r[e]}</b><span>${U_[e]}</span>`,t.hidden=!1)}transition(e,t,n){let i=e===this.app.me,s=this.app;if(n.status==="REVIVED"&&this.startRevival(e),n.status==="DEAD"&&(s.puff(e.x,e.y,e.z,2),i&&this.big(...B_[n.reason]??["\u0422\u042B \u041F\u041E\u0413\u0418\u0411","\u0442\u0435\u043F\u0435\u0440\u044C \u0442\u044B \u043F\u0440\u0438\u0437\u0440\u0430\u043A"],"bad"),s.snd.deathSting?.(),(n.reason==="SEATS"||n.reason==="GATE")&&s.snd.metal(0)),n.status==="SAVED"&&i){let a=this.run.format;this.run.events.some(l=>l.type==="LAST_SURVIVOR"&&l.who===e.id)?this.big("\u041F\u041E\u0421\u041B\u0415\u0414\u041D\u0418\u0419 \u0412\u042B\u0416\u0418\u0412\u0428\u0418\u0419",e.name,"win"):a==="DARKNESS"?this.big("\u0422\u042B \u0421\u0411\u0415\u0416\u0410\u041B!","\u0442\u044C\u043C\u0430 \u043E\u0441\u0442\u0430\u043B\u0430\u0441\u044C \u043F\u043E\u0437\u0430\u0434\u0438","win"):a==="SALVATION"?this.big("\u0422\u042B \u0421\u041F\u0410\u0421\u0401\u041D!",`\u043C\u0435\u0441\u0442\u043E ${n.place} \u0438\u0437 ${this.run.seats}`,"win"):this.big("\u0422\u042B \u0412\u042B\u0416\u0418\u041B!","","win"),s.snd.finish(!0)}n.status==="GHOST_FINISHED"&&i&&this.big("\u0424\u0418\u041D\u0418\u0428 \u0414\u041E\u0421\u0422\u0418\u0413\u041D\u0423\u0422","\u043D\u043E \u0442\u044B \u0432\u0441\u0451 \u0435\u0449\u0451 \u043F\u0440\u0438\u0437\u0440\u0430\u043A\u2026","ghost"),n.status==="GHOST_CAUGHT"&&i&&this.big("\u0422\u042C\u041C\u0410 \u0414\u041E\u0413\u041D\u0410\u041B\u0410 \u0422\u0415\u0411\u042F","\u0437\u0430\u0431\u0435\u0433 \u043E\u043A\u043E\u043D\u0447\u0435\u043D","ghost")}event(e){let t=this.app,n=s=>t.runners.find(a=>a.id===s)?.name??"",i=s=>{let a=document.getElementById("feed");if(!a)return;let c=document.createElement("div");for(c.textContent=s,a.prepend(c);a.children.length>5;)a.lastChild.remove();setTimeout(()=>c.classList.add("old"),6e3)};switch(e.type){case"SPARK":t.toast?.("\u0418\u0421\u041A\u0420\u0410 \u0416\u0418\u0417\u041D\u0418 \u041F\u041E\u042F\u0412\u0418\u041B\u0410\u0421\u042C!"),i("\u2726 \u0418\u0441\u043A\u0440\u0430 \u0436\u0438\u0437\u043D\u0438 \u043F\u043E\u044F\u0432\u0438\u043B\u0430\u0441\u044C"),this.say(7),t.snd.sparkAppear?.();break;case"REVIVED":i(e.who===t.me?.id&&!t.net?.spectator?"\u2726 \u0422\u044B \u0432\u043E\u0441\u043A\u0440\u0435\u0441!":`\u2726 ${n(e.who)} \u0432\u043E\u0441\u043A\u0440\u0435\u0441!`),this.say(8),this.focus(e.who,3);break;case"DIED":i(`\u271D ${n(e.who)} \u043F\u043E\u0433\u0438\u0431`),this.shown.has("died")||(this.shown.add("died"),this.say(10));break;case"SAVED":i(`\u2713 ${n(e.who)} \u0441\u043F\u0430\u0441\u0451\u043D${e.seat?` \xB7 \u043C\u0435\u0441\u0442\u043E ${e.seat}`:""}`),this.shown.has("saved")||(this.shown.add("saved"),this.say(9)),this.run.format==="SALVATION"&&t.snd.metal(0);break;case"GATE_CLOSED":i(`\u26D3 \u0420\u0443\u0431\u0435\u0436 ${e.gate} \u0437\u0430\u043A\u0440\u044B\u0442`),t.snd.metal(0);break;case"LAST_SURVIVOR":i(`\u2605 ${n(e.who)} \u2014 \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0439 \u0432\u044B\u0436\u0438\u0432\u0448\u0438\u0439`),t.snd.finish(!0);break;case"END":i("\u0418\u0441\u043F\u044B\u0442\u0430\u043D\u0438\u0435 \u043E\u043A\u043E\u043D\u0447\u0435\u043D\u043E");break}}tick(e,t,n){if(this.pending&&this.app.me){let a=this.pending;this.pending=null,this.apply(a)}let i=this.app,s=this.run;s&&(!this.saidStart&&n>0&&n<3&&(this.saidStart=!0,this.say(0),this.say(F_[s.format])),this.tickSpark(e,t),this.tickFront(e,n),this.tickRevivals(e),this.hud(t,n),this.tickVoice(e),i.net?.spectator&&this.hostCamera(e))}frontZ(e){let t=this.run.front,n=e-t.delayMs/1e3;if(n<=0)return t.z0;let i=(t.vMax-t.v0)/t.a;return t.z0+(n<i?t.v0*n+.5*t.a*n*n:t.v0*i+.5*t.a*i*i+t.vMax*(n-i))}tickFront(e,t){let n=this.run.format;if(n!=="DARKNESS"&&n!=="COLLAPSE")return;let i=this.app,s=this.frontZ(t);this.front||this.buildFront(n);let a=i.course.spawnY(Math.max(0,s));this.front.position.set(0,a,s);let c=performance.now()/1e3;this.frontMats.forEach((d,f)=>{d.map&&(d.map.offset.x=c*(.05+f*.03)%1),f===2&&(d.opacity=.25+.25*Math.max(0,Math.sin(c*7)*Math.sin(c*2.3)))});let l=this.ash.geometry.getAttribute("position");for(let d=0;d<l.count;d++){let f=l.getY(d)+e*(1+d%5*.4);f>14&&(f=0),l.setY(d,f),l.setZ(d,(l.getZ(d)+e*3)%6)}if(l.needsUpdate=!0,n==="COLLAPSE")for(let d of i.course.blocks)d.z1<s-1&&!d.collapsed?(d.collapsed=!0,d.crumbles=!0,d.crumbleDelay=0,d.crumbleAt=i.course.time-.01,d.restoreAfter=1e9,i.puff((d.x0+d.x1)/2,d.y0,(d.z0+d.z1)/2,2.5),i.snd.crumble(Math.abs(i.me.z-d.z1))):!d.collapsed&&d.z0<s+10&&d.crumbleAt<0&&!d.land&&(d.shakeUntil=i.course.time+.2);let h=i.me.z-s,o=!i.net?.spectator&&!i.me.ghost&&h<14&&!i.me.finished;document.body.classList.toggle("front-warn",o);let u=document.getElementById("front-gap");u&&(u.hidden=!o,u.textContent=`${n==="DARKNESS"?"\u0422\u042C\u041C\u0410":"\u041E\u0411\u0412\u0410\u041B"} \u0412 ${Math.max(0,h).toFixed(0)} \u041C`),i.snd.rumble?.(Math.max(0,1-Math.max(0,h)/30))}buildFront(e){let t=this.app,n=new qe,i=e==="DARKNESS",s=document.createElement("canvas");s.width=256,s.height=256;let a=s.getContext("2d");for(let u=0;u<90;u++){let d=Math.random()*256,f=Math.random()*256,m=20+Math.random()*70,x=a.createRadialGradient(d,f,0,d,f,m);x.addColorStop(0,i?"rgba(10,0,8,.9)":"rgba(90,70,55,.8)"),x.addColorStop(1,"rgba(0,0,0,0)"),a.fillStyle=x,a.fillRect(d-m,f-m,m*2,m*2)}let c=new Ft(s);c.wrapS=c.wrapT=cn;for(let u=0;u<3;u++){let d=new tt({map:u<2?c.clone():null,color:u===2?16718346:i?328198:3812386,transparent:!0,opacity:u===2?.3:.92-u*.25,depthWrite:!1,side:Rt,blending:u===2?dt:Xi,fog:!1});d.map&&d.map.repeat.set(2,1),this.frontMats.push(d);let f=new Z(new ut(80,40),d);f.position.set(0,12,-u*2.5),n.add(f)}let l=160,h=new Float32Array(l*3);for(let u=0;u<l;u++)h[u*3]=(Math.random()-.5)*30,h[u*3+1]=Math.random()*14,h[u*3+2]=Math.random()*6;let o=new ot;o.setAttribute("position",new At(h,3)),this.ash=new kn(o,new Cn({color:i?16734762:12099712,size:.14,transparent:!0,opacity:.8,depthWrite:!1})),this.ash.frustumCulled=!1,n.add(this.ash),t.scene.add(n),this.front=n}buildSpark(){let e=new qe;this.sparkCore=new Z(new Gn(.22,2),new $e({color:16774352,emissive:16766848,emissiveIntensity:1.6,roughness:.3})),e.add(this.sparkCore);let t=document.createElement("canvas");t.width=t.height=64;let n=t.getContext("2d");n.fillStyle="#ff3b3b",n.beginPath(),n.moveTo(32,52),n.bezierCurveTo(4,32,14,8,32,22),n.bezierCurveTo(50,8,60,32,32,52),n.fill();let i=new Gt(new Ut({map:new Ft(t),transparent:!0,depthTest:!1}));i.scale.setScalar(.22),i.userData.heart=!0,e.add(i);for(let l=0;l<5;l++){let h=new Z(new ra(.09,0),new $e({color:16773312,emissive:16762976,emissiveIntensity:.8,transparent:!0,opacity:.6}));h.scale.set(.6,1.6,.6),this.sparkShards.push(h),e.add(h)}let s=document.createElement("canvas");s.width=s.height=64;let a=s.getContext("2d"),c=a.createRadialGradient(32,32,0,32,32,32);c.addColorStop(0,"rgba(255,240,200,.9)"),c.addColorStop(.4,"rgba(255,210,120,.3)"),c.addColorStop(1,"rgba(255,200,100,0)"),a.fillStyle=c,a.fillRect(0,0,64,64),this.sparkHalo=new Gt(new Ut({map:new Ft(s),transparent:!0,depthWrite:!1,blending:dt})),this.sparkHalo.scale.setScalar(1.4),e.add(this.sparkHalo),this.app.scene.add(e),this.spark=e}tickSpark(e,t){let n=this.app,i=this.run.spark,s=i.active;if(s&&!this.spark&&this.buildSpark(),!this.spark){let x=document.getElementById("spark-hint");x&&(x.hidden=!0);return}if(this.spark.visible=s,!s){let x=document.getElementById("spark-hint");x&&(x.hidden=!0);return}let a=performance.now()/1e3,c=n.course.spawnY(i.z)+1.25+Math.sin(a*1.6)*.15;this.spark.position.set(0,c,i.z);let l=n.me,h=l.ghost&&!n.net?.spectator&&!this.run.players[l.id]?.revived&&this.run.players[l.id]?.status!=="GHOST_CAUGHT",o=Math.hypot(l.x,l.z-i.z,l.y-(c-1.25)),u=h&&o<9,f=1+.12*Math.sin(a*(u?7:2.6));this.sparkCore.scale.setScalar(f),this.sparkCore.rotation.y+=e*.8,this.sparkCore.material.emissiveIntensity=(u?2.2:1.6)+(Math.sin(a*13)>.97?1.5:0),this.sparkShards.forEach((x,p)=>{let g=a*(.9+p*.07)+p*1.257,y=.45+.05*Math.sin(a*2+p);x.position.set(Math.cos(g)*y,Math.sin(a*1.3+p)*.18,Math.sin(g)*y),x.rotation.set(a+p,a*.7,0)}),this.sparkHalo.scale.setScalar(1.2+.25*f+(u?.3:0)),u&&n.snd.sparkHum?.(1-o/9),h&&o<1.6&&t-this.sparkSent>400&&(this.sparkSent=t,n.net?.spark?.());let m=document.getElementById("spark-hint");m&&(m.hidden=!h,h&&(m.textContent=i.z>l.z?`\u2726 \u0418\u0421\u041A\u0420\u0410 \u0412\u041F\u0415\u0420\u0415\u0414\u0418 \xB7 ${Math.round(i.z-l.z)} \u043C`:"\u2726 \u0418\u0421\u041A\u0420\u0410 \u041F\u041E\u0417\u0410\u0414\u0418"))}startRevival(e){let t=this.app,n=new Z(new Kt(.6,.05,8,32).rotateX(Math.PI/2),new tt({color:16769696,transparent:!0,opacity:.9,depthWrite:!1,blending:dt}));t.scene.add(n),this.revivals.push({r:e,t:0,ring:n}),this.spark&&this.run.spark.by===e.id&&(this.spark.visible=!1),t.snd.revive?.(),e===t.me&&navigator.vibrate?.([30,60,30])}tickRevivals(e){let t=this.app;for(let n of[...this.revivals]){n.t+=e;let i=n.r,s=n.t;n.ring.position.set(i.x,i.y+.1+Math.min(1.6,Math.max(0,s-.4)*2),i.z),n.ring.scale.setScalar(1+s*1.4),n.ring.material.opacity=Math.max(0,.9-s*.5),s<.4&&Math.random()<.5&&t.puff(i.x+(Math.random()-.5),i.y+1.5+Math.random(),i.z+(Math.random()-.5),.4);let a=Math.min(1,Math.max(0,(s-.4)/.8));this.ghostMaterial(i,1-a),s>1.2&&!n.flash&&(n.flash=!0,t.puff(i.x,i.y+.8,i.z,1.8),i===t.me&&this.big("\u0412\u041E\u0421\u041A\u0420\u0415\u0428\u0415\u041D\u0418\u0415!","\u0422\u042B \u0421\u041D\u041E\u0412\u0410 \u0416\u0418\u0412!","win")),s>1.7&&(t.scene.remove(n.ring),this.revivals.splice(this.revivals.indexOf(n),1),this.setGhostLook(i,!1,!0))}}setGhostLook(e,t,n=!1){!n&&this.ghostLook.get(e)===t||(this.ghostLook.set(e,t),this.ghostMaterial(e,t?1:0))}ghostMaterial(e,t){let n=this.app.looks.get(e);n&&n.root.traverse(i=>{if(!i.isMesh)return;let s=i.material;s.userData.base??=s.color.clone(),s.transparent=t>.01,s.opacity=1-.55*t,s.depthWrite=t<.5,s.color.copy(s.userData.base).lerp(new Ae(.55,.75,1),.55*t),s.emissiveIntensity=.15+.35*t})}hud(e,t){let n=this.app,i=this.run,s=n.me,a=i.players[s.id],c=n.net?.spectator,l=document.getElementById("life");if(l&&!c&&a){let u=a.status,d=u==="SAVED"?"\u0421\u041F\u0410\u0421\u0401\u041D":a.alive?a.revived?"\u0412\u041E\u0421\u041A\u0420\u0415\u0428\u0401\u041D":"\u0416\u0418\u0412":"\u041F\u0420\u0418\u0417\u0420\u0410\u041A";l.textContent!==d&&(l.textContent=d,l.className=u==="SAVED"?"saved":a.alive?"alive":"ghost")}let h=document.getElementById("run-info"),o="";if(i.format==="SALVATION"){let u=i.seats-i.seatsUsed;o=`\u0423\u0411\u0415\u0416\u0418\u0429\u0415 ${"\u25A0".repeat(i.seatsUsed)}${"\u25A1".repeat(Math.max(0,u))} \xB7 \u043C\u0435\u0441\u0442 ${u}`}if(i.format==="LAST_SURVIVORS"){let u=i.closed.findIndex(d=>!d);o=u<0?"\u0412\u0421\u0415 \u0420\u0423\u0411\u0415\u0416\u0418 \u0417\u0410\u041A\u0420\u042B\u0422\u042B":`\u0420\u0423\u0411\u0415\u0416 ${u+1} \xB7 \u043C\u0435\u0441\u0442 ${Math.max(0,i.quotas[u]-i.passed[u])} \u0438\u0437 ${i.quotas[u]}`}if(i.format==="LAST_CHANCE"&&a&&a.alive&&a.status!=="SAVED"&&!c){let u=Math.max(0,(a.deadline-e)/1e3);o=`\u0422\u0412\u041E\u0401 \u0412\u0420\u0415\u041C\u042F ${u.toFixed(1)} \u0421`,document.body.classList.toggle("chance-low",u<10),u<10&&e-this.lastBeep>(u<4?350:900)&&(this.lastBeep=e,n.snd.alarm(0))}else document.body.classList.remove("chance-low");if(h&&h.textContent!==o&&(h.textContent=o,h.hidden=!o),c){let u=Object.values(i.players),d=m=>u.filter(m).length,f=document.getElementById("host-stats");if(f){let m=`<b>${_r[i.format]}</b><span>\u0416\u0438\u0432\u044B\u0445 ${d(x=>x.alive&&x.status!=="SAVED")}</span><span>\u0421\u043F\u0430\u0441\u0435\u043D\u043E ${d(x=>x.status==="SAVED")}</span><span>\u041F\u0440\u0438\u0437\u0440\u0430\u043A\u043E\u0432 ${d(x=>!x.alive)}</span><span>\u041F\u043E\u0433\u0438\u0431\u043B\u043E ${d(x=>x.status==="DEAD")}</span>`;f.innerHTML!==m&&(f.innerHTML=m),f.hidden=!1}}}big(e,t,n){let i=document.getElementById("big");i&&(i.className=n,i.innerHTML=`<b>${e}</b>${t?`<span>${t}</span>`:""}`,i.classList.remove("show"),i.offsetWidth,i.classList.add("show"))}key(e){let t=this.app.runners;e==="0"&&(this.manual=null);let n=Number(e)-1;n>=0&&n<t.length&&(this.manual=t[n])}focus(e,t){let n=this.app.runners.find(i=>i.id===e);n&&(this.camFocus=n,this.camSince=-t)}hostCamera(e){let t=this.app,n=this.run,i=t.runners.filter(s=>!s.finished||s===this.camFocus);if(this.camSince+=e,this.manual){t.me=this.manual;return}if(this.camSince>4||!this.camFocus){let s,a=-1,c=0,l=n.spark;for(let h of i.length?i:t.runners){let o=n.players[h.id];if(!o)continue;let u=h.progress/Math.max(1,t.course.finishZ);l.active&&!o.alive&&Math.abs(h.z-l.z)<12&&(u+=2),(n.format==="DARKNESS"||n.format==="COLLAPSE")&&(u+=Math.max(0,1.5-Math.abs(h.z-(this.front?.position.z??-99))/10)),t.course.finishZ-h.z<25&&(u+=1),i.filter(d=>d!==h&&Math.abs(d.z-h.z)<3).length&&(u+=.6),u>a&&(a=u,s=h)}s&&s!==this.camFocus&&(this.camFocus=s,this.camSince=0)}this.camFocus&&(t.me=this.camFocus)}say(e){this.voiceQ.includes(e)||this.voiceQ.push(e)}tickVoice(e){if(this.voiceBusy-=e,this.voiceBusy>0||!this.voiceQ.length)return;let t=this.voiceQ.shift();this.app.snd.voice(`audio/host_${t}.m4a`),this.voiceBusy=5.2}};var Vc=En.duration,Hf=r=>(r=Ea.clamp(r,0,1),r*r*(3-2*r)),Wc=class{constructor(e){this.app=e}line=-1;format="";spoken=-1;spark;materials=[];geometries=[];path;sparkZ=0;active=!1;announcedSpark=!1;reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;get selectedFormat(){return this.app.surv?.run?.format??new URLSearchParams(location.search).get("format")??"DEATH_RUN"}get duration(){return En.formats[this.selectedFormat]?.filmDuration??Vc}build(){let e=this.app.course;this.sparkZ=(e.checkpoints[Math.max(1,Math.floor(e.checkpoints.length*.55))]??e.finishZ*.5)+1.4;let t=[],n=Math.max(12,Math.ceil(e.finishZ/8));for(let h=0;h<=n;h++){let o=-8+(e.finishZ+8)*h/n,u=-1/0;for(let f=-6;f<=6;f+=2)u=Math.max(u,e.spawnY(Math.max(0,o+f)));let d=Math.sin(h/n*Math.PI*1.3)*(this.app.manor?.35:1.8);t.push(new L(d,u+(this.app.manor?5.8:8),o))}for(let h=0;h<3;h++)for(let o=1;o<t.length-1;o++)t[o].y=(t[o-1].y+2*t[o].y+t[o+1].y)/4;this.path=new nr(t,!1,"centripetal");let i=new qe,s=new Gn(.28,1);this.geometries.push(s);let a=new $e({color:16774084,emissive:16760133,emissiveIntensity:1.8,roughness:.3});this.materials.push(a),i.add(new Z(s,a));let c=new Kt(.68,.025,6,48);this.geometries.push(c);let l=new tt({color:16766850,transparent:!0,opacity:.85});this.materials.push(l);for(let h=0;h<2;h++){let o=new Z(c,l);o.rotation.x=h?Math.PI/2:.35,i.add(o)}for(let h=0;h<5;h++){let o=new Z(s,a);o.scale.setScalar(.2),o.position.set(Math.cos(h*1.257)*.8,Math.sin(h*2)*.25,Math.sin(h*1.257)*.8),i.add(o)}i.visible=!1,this.app.scene.add(i),this.spark=i}update(e,t){let n=document.getElementById("intro");if(!n)return!1;let i=e>=0&&e<this.duration&&!t;if(n.hidden=!i,document.body.classList.toggle("intro-on",i),!i)return this.active&&(this.app.snd.voice(""),this.app.camera.fov=55,this.app.camera.updateProjectionMatrix()),this.active=!1,this.spark&&(this.spark.visible=!1),!1;this.active=!0;let s=this.selectedFormat,a=this.duration-Vc,c=En.beats.map((m,x)=>x===En.beats.length-1?{...m,at:m.at+a}:m),l=-1;c.forEach((m,x)=>{e>=m.at&&(l=x)});let h=c[l],o=En.formats[s]??En.formats.DEATH_RUN;if(l!==this.line||s!==this.format){this.line=l,this.format=s,this.spoken=-1;let m=(x,p)=>{let g=document.getElementById(x);g&&(g.textContent=p)};m("intro-map",En.maps[this.app.course.map-1]),m("intro-chapter",`${String(Math.max(1,l+1)).padStart(2,"0")} / ${String(En.beats.length).padStart(2,"0")}`),m("intro-title",h?.clip==="format"?_r[s]??_r.DEATH_RUN:h?.title??"\u041F\u0420\u041E\u041A\u041B\u042F\u0422\u042B\u0419 \u0417\u0410\u0411\u0415\u0413"),m("intro-sub",h?.clip==="format"?o.text:h?.text??""),n.classList.remove("beat-in"),n.offsetWidth,n.classList.add("beat-in")}h&&this.spoken!==l&&this.app.snd.ready&&(this.spoken=l,this.app.snd.voice(`audio/${h.clip==="format"?o.clip:h.clip}.m4a`,Math.max(0,e-h.at)));let u=document.getElementById("intro-bar");u.style.width=`${e/this.duration*100}%`;let d=e>=En.beats[En.beats.length-1].at+this.duration-Vc;document.getElementById("intro-example").hidden=!d;let f=e<.3?1-Hf(e/.3):e>this.duration-.3?Hf((e-this.duration+.3)/.3):0;return n.style.setProperty("--curtain",String(f)),d&&!this.announcedSpark&&(this.announcedSpark=!0,this.app.snd.sparkAppear()),!0}camera(e){this.path||this.build();let t=this.app,n=t.course,i=t.camera,s=e>=En.beats[En.beats.length-1].at+this.duration-Vc,a=Math.min(.999,Math.max(0,e/this.duration)),c=this.path.getPointAt(a),h=this.path.getPointAt(Math.min(1,a+.045)).clone().sub(c).normalize(),o=c.clone().addScaledVector(h,14);o.y-=2.4,i.position.copy(c),i.lookAt(o),i.fov=t.camera.aspect<1?65:55,i.updateProjectionMatrix(),this.spark.visible=s;let u=new L().crossVectors(h,new L(0,1,0)).normalize();this.spark.position.copy(c).addScaledVector(h,6).addScaledVector(u,t.camera.aspect<1?.1:1.6),this.spark.position.y-=.3,this.spark.scale.setScalar(.5),this.spark.rotation.y=e*.7,t.camTarget.set(t.me.x*.75,Math.max(t.me.y,-4),t.me.z)}};function Nh(r,e=!1){let t=r[0].index!==null,n=new Set(Object.keys(r[0].attributes)),i=new Set(Object.keys(r[0].morphAttributes)),s={},a={},c=r[0].morphTargetsRelative,l=new ot,h=0;for(let o=0;o<r.length;++o){let u=r[o],d=0;if(t!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+o+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(let f in u.attributes){if(!n.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+o+'. All geometries must have compatible attributes; make sure "'+f+'" attribute exists among all geometries, or in none of them.'),null;s[f]===void 0&&(s[f]=[]),s[f].push(u.attributes[f]),d++}if(d!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+o+". Make sure all geometries have the same number of attributes."),null;if(c!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+o+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(let f in u.morphAttributes){if(!i.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+o+".  .morphAttributes must be consistent throughout all geometries."),null;a[f]===void 0&&(a[f]=[]),a[f].push(u.morphAttributes[f])}if(e){let f;if(t)f=u.index.count;else if(u.attributes.position!==void 0)f=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+o+". The geometry must have either an index or a position attribute"),null;l.addGroup(h,f,o),h+=f}}if(t){let o=0,u=[];for(let d=0;d<r.length;++d){let f=r[d].index;for(let m=0;m<f.count;++m)u.push(f.getX(m)+o);o+=r[d].attributes.position.count}l.setIndex(u)}for(let o in s){let u=kf(s[o]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+o+" attribute."),null;l.setAttribute(o,u)}for(let o in a){let u=a[o][0].length;if(u!==0){l.morphAttributes=l.morphAttributes||{},l.morphAttributes[o]=[];for(let d=0;d<u;++d){let f=[];for(let x=0;x<a[o].length;++x)f.push(a[o][x][d]);let m=kf(f);if(!m)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+o+" morphAttribute."),null;l.morphAttributes[o].push(m)}}}return l}function kf(r){let e,t,n,i=-1,s=0;for(let h=0;h<r.length;++h){let o=r[h];if(e===void 0&&(e=o.array.constructor),e!==o.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=o.itemSize),t!==o.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=o.normalized),n!==o.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(i===-1&&(i=o.gpuType),i!==o.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;s+=o.count*t}let a=new e(s),c=new At(a,t,n),l=0;for(let h=0;h<r.length;++h){let o=r[h];if(o.isInterleavedBufferAttribute){let u=l/t;for(let d=0,f=o.count;d<f;d++)for(let m=0;m<t;m++){let x=o.getComponent(d,m);c.setComponent(d+u,m,x)}}else a.set(o.array,l);l+=o.count*t}return i!==void 0&&(c.gpuType=i),c}function Dh(r,e){if(e===ch)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),r;if(e===fr||e===ba){let t=r.getIndex();if(t===null){let s=[],a=r.getAttribute("position");if(a!==void 0){for(let c=0;c<a.count;c++)s.push(c);r.setIndex(s),t=r.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),r}let n=t.count-2,i=[];if(e===fr)for(let s=1;s<=n;s++)i.push(t.getX(0)),i.push(t.getX(s)),i.push(t.getX(s+1));else for(let s=0;s<n;s++)s%2===0?(i.push(t.getX(s)),i.push(t.getX(s+1)),i.push(t.getX(s+2))):(i.push(t.getX(s+2)),i.push(t.getX(s+1)),i.push(t.getX(s)));return i.length/3!==n&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles."),r.setIndex(i),r.clearGroups(),r}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),r}function Xc(r){let e=new Map,t=new Map,n=r.clone();return Gf(r,n,function(i,s){e.set(s,i),t.set(i,s)}),n.traverse(function(i){if(!i.isSkinnedMesh)return;let s=i,a=e.get(i),c=a.skeleton.bones;s.skeleton=a.skeleton.clone(),s.bindMatrix.copy(a.bindMatrix),s.skeleton.bones=c.map(function(l){return t.get(l)}),s.bind(s.skeleton,s.bindMatrix)}),n}function Gf(r,e,t){t(r,e);for(let n=0;n<r.children.length;n++)Gf(r.children[n],e.children[n],t)}var qc=class extends ti{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(t){return new kh(t)}),this.register(function(t){return new Gh(t)}),this.register(function(t){return new Jh(t)}),this.register(function(t){return new jh(t)}),this.register(function(t){return new Qh(t)}),this.register(function(t){return new Wh(t)}),this.register(function(t){return new Xh(t)}),this.register(function(t){return new qh(t)}),this.register(function(t){return new Yh(t)}),this.register(function(t){return new Hh(t)}),this.register(function(t){return new Zh(t)}),this.register(function(t){return new Vh(t)}),this.register(function(t){return new $h(t)}),this.register(function(t){return new Kh(t)}),this.register(function(t){return new Bh(t)}),this.register(function(t){return new Yc(t,nt.EXT_MESHOPT_COMPRESSION)}),this.register(function(t){return new Yc(t,nt.KHR_MESHOPT_COMPRESSION)}),this.register(function(t){return new eu(t)})}load(e,t,n,i){let s=this,a;if(this.resourcePath!=="")a=this.resourcePath;else if(this.path!==""){let h=Si.extractUrlBase(e);a=Si.resolveURL(h,this.path)}else a=Si.extractUrlBase(e);this.manager.itemStart(e);let c=function(h){i?i(h):console.error(h),s.manager.itemError(e),s.manager.itemEnd(e)},l=new ar(this.manager);l.setPath(this.path),l.setResponseType("arraybuffer"),l.setRequestHeader(this.requestHeader),l.setWithCredentials(this.withCredentials),l.load(e,function(h){try{s.parse(h,a,function(o){t(o),s.manager.itemEnd(e)},c)}catch(o){c(o)}},n,c)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,n,i){let s,a={},c={},l=new TextDecoder;if(typeof e=="string")s=JSON.parse(e);else if(e instanceof ArrayBuffer)if(l.decode(new Uint8Array(e,0,4))===Yf){try{a[nt.KHR_BINARY_GLTF]=new tu(e)}catch(u){i&&i(u);return}s=JSON.parse(a[nt.KHR_BINARY_GLTF].content)}else s=JSON.parse(l.decode(e));else s=e;if(s.asset===void 0||s.asset.version[0]<2){i&&i(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}let h=new cu(s,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});h.fileLoader.setRequestHeader(this.requestHeader);for(let o=0;o<this.pluginCallbacks.length;o++){let u=this.pluginCallbacks[o](h);u.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),c[u.name]=u,a[u.name]=!0}if(s.extensionsUsed)for(let o=0;o<s.extensionsUsed.length;++o){let u=s.extensionsUsed[o],d=s.extensionsRequired||[];switch(u){case nt.KHR_MATERIALS_UNLIT:a[u]=new Oh;break;case nt.KHR_DRACO_MESH_COMPRESSION:a[u]=new nu(s,this.dracoLoader);break;case nt.KHR_TEXTURE_TRANSFORM:a[u]=new iu;break;case nt.KHR_MESH_QUANTIZATION:a[u]=new su;break;default:d.indexOf(u)>=0&&c[u]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+u+'".')}}h.setExtensions(a),h.setPlugins(c),h.parse(n,i)}parseAsync(e,t){let n=this;return new Promise(function(i,s){n.parse(e,t,i,s)})}};function H_(){let r={};return{get:function(e){return r[e]},add:function(e,t){r[e]=t},remove:function(e){delete r[e]},removeAll:function(){r={}}}}function Bt(r,e,t){let n=r.json.materials[e];return n.extensions&&n.extensions[t]?n.extensions[t]:null}var nt={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",KHR_MESHOPT_COMPRESSION:"KHR_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"},Bh=class{constructor(e){this.parser=e,this.name=nt.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){let e=this.parser,t=this.parser.json.nodes||[];for(let n=0,i=t.length;n<i;n++){let s=t[n];s.extensions&&s.extensions[this.name]&&s.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,s.extensions[this.name].light)}}_loadLight(e){let t=this.parser,n="light:"+e,i=t.cache.get(n);if(i)return i;let s=t.json,l=((s.extensions&&s.extensions[this.name]||{}).lights||[])[e],h,o=new Ae(16777215);l.color!==void 0&&o.setRGB(l.color[0],l.color[1],l.color[2],sn);let u=l.range!==void 0?l.range:0;switch(l.type){case"directional":h=new Vn(o),h.target.position.set(0,0,-1),h.add(h.target);break;case"point":h=new ha(o),h.distance=u;break;case"spot":h=new la(o),h.distance=u,l.spot=l.spot||{},l.spot.innerConeAngle=l.spot.innerConeAngle!==void 0?l.spot.innerConeAngle:0,l.spot.outerConeAngle=l.spot.outerConeAngle!==void 0?l.spot.outerConeAngle:Math.PI/4,h.angle=l.spot.outerConeAngle,h.penumbra=1-l.spot.innerConeAngle/l.spot.outerConeAngle,h.target.position.set(0,0,-1),h.add(h.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+l.type)}return h.position.set(0,0,0),ai(h,l),l.intensity!==void 0&&(h.intensity=l.intensity),h.name=t.createUniqueName(l.name||"light_"+e),i=Promise.resolve(h),t.cache.add(n,i),i}getDependency(e,t){if(e==="light")return this._loadLight(t)}createNodeAttachment(e){let t=this,n=this.parser,s=n.json.nodes[e],c=(s.extensions&&s.extensions[this.name]||{}).light;return c===void 0?null:this._loadLight(c).then(function(l){return n._getNodeRef(t.cache,c,l)})}},Oh=class{constructor(){this.name=nt.KHR_MATERIALS_UNLIT}getMaterialType(){return tt}extendParams(e,t,n){let i=[];e.color=new Ae(1,1,1),e.opacity=1;let s=t.pbrMetallicRoughness;if(s){if(Array.isArray(s.baseColorFactor)){let a=s.baseColorFactor;e.color.setRGB(a[0],a[1],a[2],sn),e.opacity=a[3]}s.baseColorTexture!==void 0&&i.push(n.assignTexture(e,"map",s.baseColorTexture,_t))}return Promise.all(i)}},Hh=class{constructor(e){this.parser=e,this.name=nt.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){let n=Bt(this.parser,e,this.name);return n===null||n.emissiveStrength!==void 0&&(t.emissiveIntensity=n.emissiveStrength),Promise.resolve()}},kh=class{constructor(e){this.parser=e,this.name=nt.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){return Bt(this.parser,e,this.name)!==null?fn:null}extendMaterialParams(e,t){let n=Bt(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];if(n.clearcoatFactor!==void 0&&(t.clearcoat=n.clearcoatFactor),n.clearcoatTexture!==void 0&&i.push(this.parser.assignTexture(t,"clearcoatMap",n.clearcoatTexture)),n.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=n.clearcoatRoughnessFactor),n.clearcoatRoughnessTexture!==void 0&&i.push(this.parser.assignTexture(t,"clearcoatRoughnessMap",n.clearcoatRoughnessTexture)),n.clearcoatNormalTexture!==void 0&&(i.push(this.parser.assignTexture(t,"clearcoatNormalMap",n.clearcoatNormalTexture)),n.clearcoatNormalTexture.scale!==void 0)){let s=n.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new ae(s,s)}return Promise.all(i)}},Gh=class{constructor(e){this.parser=e,this.name=nt.KHR_MATERIALS_DISPERSION}getMaterialType(e){return Bt(this.parser,e,this.name)!==null?fn:null}extendMaterialParams(e,t){let n=Bt(this.parser,e,this.name);return n===null||(t.dispersion=n.dispersion!==void 0?n.dispersion:0),Promise.resolve()}},Vh=class{constructor(e){this.parser=e,this.name=nt.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){return Bt(this.parser,e,this.name)!==null?fn:null}extendMaterialParams(e,t){let n=Bt(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];return n.iridescenceFactor!==void 0&&(t.iridescence=n.iridescenceFactor),n.iridescenceTexture!==void 0&&i.push(this.parser.assignTexture(t,"iridescenceMap",n.iridescenceTexture)),n.iridescenceIor!==void 0&&(t.iridescenceIOR=n.iridescenceIor),t.iridescenceThicknessRange===void 0&&(t.iridescenceThicknessRange=[100,400]),n.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessRange[0]=n.iridescenceThicknessMinimum),n.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessRange[1]=n.iridescenceThicknessMaximum),n.iridescenceThicknessTexture!==void 0&&i.push(this.parser.assignTexture(t,"iridescenceThicknessMap",n.iridescenceThicknessTexture)),Promise.all(i)}},Wh=class{constructor(e){this.parser=e,this.name=nt.KHR_MATERIALS_SHEEN}getMaterialType(e){return Bt(this.parser,e,this.name)!==null?fn:null}extendMaterialParams(e,t){let n=Bt(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];if(t.sheenColor=new Ae(0,0,0),t.sheenRoughness=0,t.sheen=1,n.sheenColorFactor!==void 0){let s=n.sheenColorFactor;t.sheenColor.setRGB(s[0],s[1],s[2],sn)}return n.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=n.sheenRoughnessFactor),n.sheenColorTexture!==void 0&&i.push(this.parser.assignTexture(t,"sheenColorMap",n.sheenColorTexture,_t)),n.sheenRoughnessTexture!==void 0&&i.push(this.parser.assignTexture(t,"sheenRoughnessMap",n.sheenRoughnessTexture)),Promise.all(i)}},Xh=class{constructor(e){this.parser=e,this.name=nt.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){return Bt(this.parser,e,this.name)!==null?fn:null}extendMaterialParams(e,t){let n=Bt(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];return n.transmissionFactor!==void 0&&(t.transmission=n.transmissionFactor),n.transmissionTexture!==void 0&&i.push(this.parser.assignTexture(t,"transmissionMap",n.transmissionTexture)),Promise.all(i)}},qh=class{constructor(e){this.parser=e,this.name=nt.KHR_MATERIALS_VOLUME}getMaterialType(e){return Bt(this.parser,e,this.name)!==null?fn:null}extendMaterialParams(e,t){let n=Bt(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];t.thickness=n.thicknessFactor!==void 0?n.thicknessFactor:0,n.thicknessTexture!==void 0&&i.push(this.parser.assignTexture(t,"thicknessMap",n.thicknessTexture)),t.attenuationDistance=n.attenuationDistance||1/0;let s=n.attenuationColor||[1,1,1];return t.attenuationColor=new Ae().setRGB(s[0],s[1],s[2],sn),Promise.all(i)}},Yh=class{constructor(e){this.parser=e,this.name=nt.KHR_MATERIALS_IOR}getMaterialType(e){return Bt(this.parser,e,this.name)!==null?fn:null}extendMaterialParams(e,t){let n=Bt(this.parser,e,this.name);return n===null||(t.ior=n.ior!==void 0?n.ior:1.5,t.ior===0&&(t.ior=1e3)),Promise.resolve()}},Zh=class{constructor(e){this.parser=e,this.name=nt.KHR_MATERIALS_SPECULAR}getMaterialType(e){return Bt(this.parser,e,this.name)!==null?fn:null}extendMaterialParams(e,t){let n=Bt(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];t.specularIntensity=n.specularFactor!==void 0?n.specularFactor:1,n.specularTexture!==void 0&&i.push(this.parser.assignTexture(t,"specularIntensityMap",n.specularTexture));let s=n.specularColorFactor||[1,1,1];return t.specularColor=new Ae().setRGB(s[0],s[1],s[2],sn),n.specularColorTexture!==void 0&&i.push(this.parser.assignTexture(t,"specularColorMap",n.specularColorTexture,_t)),Promise.all(i)}},Kh=class{constructor(e){this.parser=e,this.name=nt.EXT_MATERIALS_BUMP}getMaterialType(e){return Bt(this.parser,e,this.name)!==null?fn:null}extendMaterialParams(e,t){let n=Bt(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];return t.bumpScale=n.bumpFactor!==void 0?n.bumpFactor:1,n.bumpTexture!==void 0&&i.push(this.parser.assignTexture(t,"bumpMap",n.bumpTexture)),Promise.all(i)}},$h=class{constructor(e){this.parser=e,this.name=nt.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){return Bt(this.parser,e,this.name)!==null?fn:null}extendMaterialParams(e,t){let n=Bt(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];return n.anisotropyStrength!==void 0&&(t.anisotropy=n.anisotropyStrength),n.anisotropyRotation!==void 0&&(t.anisotropyRotation=n.anisotropyRotation),n.anisotropyTexture!==void 0&&i.push(this.parser.assignTexture(t,"anisotropyMap",n.anisotropyTexture)),Promise.all(i)}},Jh=class{constructor(e){this.parser=e,this.name=nt.KHR_TEXTURE_BASISU}loadTexture(e){let t=this.parser,n=t.json,i=n.textures[e];if(!i.extensions||!i.extensions[this.name])return null;let s=i.extensions[this.name],a=t.options.ktx2Loader;if(!a){if(n.extensionsRequired&&n.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return t.loadTextureImage(e,s.source,a)}},jh=class{constructor(e){this.parser=e,this.name=nt.EXT_TEXTURE_WEBP}loadTexture(e){let t=this.name,n=this.parser,i=n.json,s=i.textures[e];if(!s.extensions||!s.extensions[t])return null;let a=s.extensions[t],c=i.images[a.source],l=n.textureLoader;if(c.uri){let h=n.options.manager.getHandler(c.uri);h!==null&&(l=h)}return n.loadTextureImage(e,a.source,l)}},Qh=class{constructor(e){this.parser=e,this.name=nt.EXT_TEXTURE_AVIF}loadTexture(e){let t=this.name,n=this.parser,i=n.json,s=i.textures[e];if(!s.extensions||!s.extensions[t])return null;let a=s.extensions[t],c=i.images[a.source],l=n.textureLoader;if(c.uri){let h=n.options.manager.getHandler(c.uri);h!==null&&(l=h)}return n.loadTextureImage(e,a.source,l)}},Yc=class{constructor(e,t){this.name=t,this.parser=e}loadBufferView(e){let t=this.parser.json,n=t.bufferViews[e];if(n.extensions&&n.extensions[this.name]){let i=n.extensions[this.name],s=this.parser.getDependency("buffer",i.buffer),a=this.parser.options.meshoptDecoder;if(!a||!a.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return s.then(function(c){let l=i.byteOffset||0,h=i.byteLength||0,o=i.count,u=i.byteStride,d=new Uint8Array(c,l,h);return a.decodeGltfBufferAsync?a.decodeGltfBufferAsync(o,u,d,i.mode,i.filter).then(function(f){return f.buffer}):a.ready.then(function(){let f=new ArrayBuffer(o*u);return a.decodeGltfBuffer(new Uint8Array(f),o,u,d,i.mode,i.filter),f})})}else return null}},eu=class{constructor(e){this.name=nt.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){let t=this.parser.json,n=t.nodes[e];if(!n.extensions||!n.extensions[this.name]||n.mesh===void 0)return null;let i=t.meshes[n.mesh];for(let h of i.primitives)if(h.mode!==Pn.TRIANGLES&&h.mode!==Pn.TRIANGLE_STRIP&&h.mode!==Pn.TRIANGLE_FAN&&h.mode!==void 0)return null;let a=n.extensions[this.name].attributes,c=[],l={};for(let h in a)c.push(this.parser.getDependency("accessor",a[h]).then(o=>(l[h]=o,l[h])));return c.length<1?null:(c.push(this.parser.createNodeMesh(e)),Promise.all(c).then(h=>{let o=h.pop(),u=o.isGroup?o.children:[o],d=h[0].count,f=[];for(let m of u){let x=new Fe,p=new L,g=new Pt,y=new L(1,1,1),b=new Zt(m.geometry,m.material,d);for(let w=0;w<d;w++)l.TRANSLATION&&p.fromBufferAttribute(l.TRANSLATION,w),l.ROTATION&&g.fromBufferAttribute(l.ROTATION,w),l.SCALE&&y.fromBufferAttribute(l.SCALE,w),b.setMatrixAt(w,x.compose(p,g,y));let M=null;for(let w in l)if(w==="_COLOR_0"){let S=l[w];b.instanceColor=new _i(S.array,S.itemSize,S.normalized)}else if(w!=="TRANSLATION"&&w!=="ROTATION"&&w!=="SCALE"){if(M===null){let T=b.geometry;M=new ot,M.name=T.name;for(let _ in T.attributes)M.setAttribute(_,T.attributes[_]);for(let _ in T.morphAttributes)M.morphAttributes[_]=T.morphAttributes[_];T.index!==null&&M.setIndex(T.index),M.morphTargetsRelative=T.morphTargetsRelative;for(let _ of T.groups)M.addGroup(_.start,_.count,_.materialIndex);T.boundingBox!==null&&(M.boundingBox=T.boundingBox.clone()),T.boundingSphere!==null&&(M.boundingSphere=T.boundingSphere.clone()),M.drawRange.start=T.drawRange.start,M.drawRange.count=T.drawRange.count,M.userData=Object.assign({},T.userData),b.geometry=M}let S=l[w];M.setAttribute(w,new _i(S.array,S.itemSize,S.normalized))}It.prototype.copy.call(b,m),this.parser.assignFinalMaterial(b),f.push(b)}return o.isGroup?(o.clear(),o.add(...f),o):f[0]}))}},Yf="glTF",Aa=12,Vf={JSON:1313821514,BIN:5130562},tu=class{constructor(e){this.name=nt.KHR_BINARY_GLTF,this.content=null,this.body=null;let t=new DataView(e,0,Aa),n=new TextDecoder;if(this.header={magic:n.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==Yf)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");let i=this.header.length-Aa,s=new DataView(e,Aa),a=0;for(;a<i;){let c=s.getUint32(a,!0);a+=4;let l=s.getUint32(a,!0);if(a+=4,l===Vf.JSON){let h=new Uint8Array(e,Aa+a,c);this.content=n.decode(h)}else if(l===Vf.BIN){let h=Aa+a;this.body=e.slice(h,h+c)}a+=c}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}},nu=class{constructor(e,t){if(!t)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=nt.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){let n=this.json,i=this.dracoLoader,s=e.extensions[this.name].bufferView,a=e.extensions[this.name].attributes,c={},l={},h={};for(let o in a){let u=au[o]||o.toLowerCase();c[u]=a[o]}for(let o in e.attributes){let u=au[o]||o.toLowerCase();if(a[o]!==void 0){let d=n.accessors[e.attributes[o]],f=vr[d.componentType];h[u]=f.name,l[u]=d.normalized===!0}}return t.getDependency("bufferView",s).then(function(o){return new Promise(function(u,d){i.decodeDracoFile(o,function(f){for(let m in f.attributes){let x=f.attributes[m],p=l[m];p!==void 0&&(x.normalized=p)}u(f)},c,h,sn,d)})})}},iu=class{constructor(){this.name=nt.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){if((t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0)return e;if(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),t.rotation!==void 0){let n=Math.cos(e.rotation),i=Math.sin(e.rotation);e.matrix.set(e.repeat.x*n,e.repeat.y*i,e.offset.x,-e.repeat.x*i,e.repeat.y*n,e.offset.y,0,0,1),e.matrixAutoUpdate=!1}return e.needsUpdate=!0,e}},su=class{constructor(){this.name=nt.KHR_MESH_QUANTIZATION}},Zc=class extends ei{constructor(e,t,n,i){super(e,t,n,i)}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,s=e*i*3+i;for(let a=0;a!==i;a++)t[a]=n[s+a];return t}interpolate_(e,t,n,i){let s=this.resultBuffer,a=this.sampleValues,c=this.valueSize,l=c*2,h=c*3,o=i-t,u=(n-t)/o,d=u*u,f=d*u,m=e*h,x=m-h,p=-2*f+3*d,g=f-d,y=1-p,b=g-d+u;for(let M=0;M!==c;M++){let w=a[x+M+c],S=a[x+M+l]*o,T=a[m+M+c],_=a[m+M]*o;s[M]=y*w+b*S+p*T+g*_}return s}},k_=new Pt,ru=class extends Zc{interpolate_(e,t,n,i){let s=super.interpolate_(e,t,n,i);return k_.fromArray(s).normalize().toArray(s),s}},Pn={FLOAT:5126,FLOAT_MAT3:35675,FLOAT_MAT4:35676,FLOAT_VEC2:35664,FLOAT_VEC3:35665,FLOAT_VEC4:35666,LINEAR:9729,REPEAT:10497,SAMPLER_2D:35678,POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6,UNSIGNED_BYTE:5121,UNSIGNED_SHORT:5123},vr={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},Wf={9728:Dt,9729:zt,9984:qo,9985:hr,9986:xs,9987:Xn},Xf={33071:An,33648:Ws,10497:cn},zh={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},au={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},Ki={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},G_={CUBICSPLINE:void 0,LINEAR:as,STEP:rs},Uh={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function V_(r){return r.DefaultMaterial===void 0&&(r.DefaultMaterial=new $e({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:ni})),r.DefaultMaterial}function vs(r,e,t){for(let n in t.extensions)r[n]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[n]=t.extensions[n])}function ai(r,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(r.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function W_(r,e,t){let n=!1,i=!1,s=!1;for(let h=0,o=e.length;h<o;h++){let u=e[h];if(u.POSITION!==void 0&&(n=!0),u.NORMAL!==void 0&&(i=!0),u.COLOR_0!==void 0&&(s=!0),n&&i&&s)break}if(!n&&!i&&!s)return Promise.resolve(r);let a=[],c=[],l=[];for(let h=0,o=e.length;h<o;h++){let u=e[h];if(n){let d=u.POSITION!==void 0?t.getDependency("accessor",u.POSITION):r.attributes.position;a.push(d)}if(i){let d=u.NORMAL!==void 0?t.getDependency("accessor",u.NORMAL):r.attributes.normal;c.push(d)}if(s){let d=u.COLOR_0!==void 0?t.getDependency("accessor",u.COLOR_0):r.attributes.color;l.push(d)}}return Promise.all([Promise.all(a),Promise.all(c),Promise.all(l)]).then(function(h){let o=h[0],u=h[1],d=h[2];return n&&(r.morphAttributes.position=o),i&&(r.morphAttributes.normal=u),s&&(r.morphAttributes.color=d),r.morphTargetsRelative=!0,r})}function X_(r,e){if(r.updateMorphTargets(),e.weights!==void 0)for(let t=0,n=e.weights.length;t<n;t++)r.morphTargetInfluences[t]=e.weights[t];if(e.extras&&Array.isArray(e.extras.targetNames)){let t=e.extras.targetNames;if(r.morphTargetInfluences.length===t.length){r.morphTargetDictionary={};for(let n=0,i=t.length;n<i;n++)r.morphTargetDictionary[t[n]]=n}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function q_(r){let e,t=r.extensions&&r.extensions[nt.KHR_DRACO_MESH_COMPRESSION];if(t?e="draco:"+t.bufferView+":"+t.indices+":"+Fh(t.attributes):e=r.indices+":"+Fh(r.attributes)+":"+r.mode,r.targets!==void 0)for(let n=0,i=r.targets.length;n<i;n++)e+=":"+Fh(r.targets[n]);return e}function Fh(r){let e="",t=Object.keys(r).sort();for(let n=0,i=t.length;n<i;n++)e+=t[n]+":"+r[t[n]]+";";return e}function ou(r){switch(r){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function Y_(r){return r.search(/\.jpe?g($|\?)/i)>0||r.search(/^data\:image\/jpeg/)===0?"image/jpeg":r.search(/\.webp($|\?)/i)>0||r.search(/^data\:image\/webp/)===0?"image/webp":r.search(/\.ktx2($|\?)/i)>0||r.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}var Z_=new Fe,cu=class{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new H_,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let n=!1,i=-1,s=!1,a=-1;if(typeof navigator<"u"&&typeof navigator.userAgent<"u"){let c=navigator.userAgent;n=/^((?!chrome|android).)*safari/i.test(c)===!0;let l=c.match(/Version\/(\d+)/);i=n&&l?parseInt(l[1],10):-1,s=c.indexOf("Firefox")>-1,a=s?c.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||n&&i<17||s&&a<98?this.textureLoader=new Gi(this.options.manager):this.textureLoader=new ua(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new ar(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials"&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){let n=this,i=this.json,s=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(a){return a._markDefs&&a._markDefs()}),Promise.all(this._invokeAll(function(a){return a.beforeRoot&&a.beforeRoot()})).then(function(){return Promise.all([n.getDependencies("scene"),n.getDependencies("animation"),n.getDependencies("camera")])}).then(function(a){let c={scene:a[0][i.scene||0],scenes:a[0],animations:a[1],cameras:a[2],asset:i.asset,parser:n,userData:{}};return vs(s,c,i),ai(c,i),Promise.all(n._invokeAll(function(l){return l.afterRoot&&l.afterRoot(c)})).then(function(){for(let l of c.scenes)l.updateMatrixWorld();e(c)})}).catch(t)}_markDefs(){let e=this.json.nodes||[],t=this.json.skins||[],n=this.json.meshes||[];for(let i=0,s=t.length;i<s;i++){let a=t[i].joints;for(let c=0,l=a.length;c<l;c++)e[a[c]].isBone=!0}for(let i=0,s=e.length;i<s;i++){let a=e[i];a.mesh!==void 0&&(this._addNodeRef(this.meshCache,a.mesh),a.skin!==void 0&&(n[a.mesh].isSkinnedMesh=!0)),a.camera!==void 0&&this._addNodeRef(this.cameraCache,a.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,n){if(e.refs[t]<=1)return n;let i=n.clone(),s=(a,c)=>{let l=this.associations.get(a);l!=null&&this.associations.set(c,l);for(let[h,o]of a.children.entries())s(o,c.children[h])};return s(n,i),i.name+="_instance_"+e.uses[t]++,i}_invokeOne(e){let t=Object.values(this.plugins);t.push(this);for(let n=0;n<t.length;n++){let i=e(t[n]);if(i)return i}return null}_invokeAll(e){let t=Object.values(this.plugins);t.unshift(this);let n=[];for(let i=0;i<t.length;i++){let s=e(t[i]);s&&n.push(s)}return n}getDependency(e,t){let n=e+":"+t,i=this.cache.get(n);if(!i){switch(e){case"scene":i=this.loadScene(t);break;case"node":i=this._invokeOne(function(s){return s.loadNode&&s.loadNode(t)});break;case"mesh":i=this._invokeOne(function(s){return s.loadMesh&&s.loadMesh(t)});break;case"accessor":i=this.loadAccessor(t);break;case"bufferView":i=this._invokeOne(function(s){return s.loadBufferView&&s.loadBufferView(t)});break;case"buffer":i=this.loadBuffer(t);break;case"material":i=this._invokeOne(function(s){return s.loadMaterial&&s.loadMaterial(t)});break;case"texture":i=this._invokeOne(function(s){return s.loadTexture&&s.loadTexture(t)});break;case"skin":i=this.loadSkin(t);break;case"animation":i=this._invokeOne(function(s){return s.loadAnimation&&s.loadAnimation(t)});break;case"camera":i=this.loadCamera(t);break;default:if(i=this._invokeOne(function(s){return s!=this&&s.getDependency&&s.getDependency(e,t)}),!i)throw new Error("Unknown type: "+e);break}this.cache.add(n,i)}return i}getDependencies(e){let t=this.cache.get(e);if(!t){let n=this,i=this.json[e+(e==="mesh"?"es":"s")]||[];t=Promise.all(i.map(function(s,a){return n.getDependency(e,a)})),this.cache.add(e,t)}return t}loadBuffer(e){let t=this.json.buffers[e],n=this.fileLoader;if(t.type&&t.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[nt.KHR_BINARY_GLTF].body);let i=this.options;return new Promise(function(s,a){n.load(Si.resolveURL(t.uri,i.path),s,void 0,function(){a(new Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))})})}loadBufferView(e){let t=this.json.bufferViews[e];return this.getDependency("buffer",t.buffer).then(function(n){let i=t.byteLength||0,s=t.byteOffset||0;return n.slice(s,s+i)})}loadAccessor(e){let t=this,n=this.json,i=this.json.accessors[e];if(i.bufferView===void 0&&i.sparse===void 0){let a=zh[i.type],c=vr[i.componentType],l=i.normalized===!0,h=new c(i.count*a);return Promise.resolve(new At(h,a,l))}let s=[];return i.bufferView!==void 0?s.push(this.getDependency("bufferView",i.bufferView)):s.push(null),i.sparse!==void 0&&(s.push(this.getDependency("bufferView",i.sparse.indices.bufferView)),s.push(this.getDependency("bufferView",i.sparse.values.bufferView))),Promise.all(s).then(function(a){let c=a[0],l=zh[i.type],h=vr[i.componentType],o=h.BYTES_PER_ELEMENT,u=o*l,d=i.byteOffset||0,f=i.bufferView!==void 0?n.bufferViews[i.bufferView].byteStride:void 0,m=i.normalized===!0,x,p;if(f&&f!==u){let g=Math.floor(d/f),y="InterleavedBuffer:"+i.bufferView+":"+i.componentType+":"+g+":"+i.count,b=t.cache.get(y);b||(x=new h(c,g*f,i.count*f/o),b=new cs(x,f/o),t.cache.add(y,b)),p=new Fi(b,l,d%f/o,m)}else c===null?x=new h(i.count*l):x=new h(c,d,i.count*l),p=new At(x,l,m);if(i.sparse!==void 0){let g=zh.SCALAR,y=vr[i.sparse.indices.componentType],b=i.sparse.indices.byteOffset||0,M=i.sparse.values.byteOffset||0,w=new y(a[1],b,i.sparse.count*g),S=new h(a[2],M,i.sparse.count*l);c!==null&&(p=new At(p.array.slice(),p.itemSize,p.normalized)),p.normalized=!1;for(let T=0,_=w.length;T<_;T++){let v=w[T];if(p.setX(v,S[T*l]),l>=2&&p.setY(v,S[T*l+1]),l>=3&&p.setZ(v,S[T*l+2]),l>=4&&p.setW(v,S[T*l+3]),l>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}p.normalized=m}return p})}loadTexture(e){let t=this.json,n=this.options,s=t.textures[e].source,a=t.images[s],c=this.textureLoader;if(a.uri){let l=n.manager.getHandler(a.uri);l!==null&&(c=l)}return this.loadTextureImage(e,s,c)}loadTextureImage(e,t,n){let i=this,s=this.json,a=s.textures[e],c=s.images[t],l=(c.uri||c.bufferView)+":"+a.sampler;if(this.textureCache[l])return this.textureCache[l];let h=this.loadImageSource(t,n).then(function(o){o.flipY=!1,o.name=a.name||c.name||"",o.name===""&&typeof c.uri=="string"&&c.uri.startsWith("data:image/")===!1&&(o.name=c.uri);let d=(s.samplers||{})[a.sampler]||{};return o.magFilter=Wf[d.magFilter]||zt,o.minFilter=Wf[d.minFilter]||Xn,o.wrapS=Xf[d.wrapS]||cn,o.wrapT=Xf[d.wrapT]||cn,o.generateMipmaps=!o.isCompressedTexture&&o.minFilter!==Dt&&o.minFilter!==zt,i.associations.set(o,{textures:e}),o}).catch(function(){return null});return this.textureCache[l]=h,h}loadImageSource(e,t){let n=this,i=this.json,s=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(u=>u.clone());let a=i.images[e],c=self.URL||self.webkitURL,l=a.uri||"",h=!1;if(a.bufferView!==void 0)l=n.getDependency("bufferView",a.bufferView).then(function(u){h=!0;let d=new Blob([u],{type:a.mimeType});return l=c.createObjectURL(d),l});else if(a.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");let o=Promise.resolve(l).then(function(u){return new Promise(function(d,f){let m=d;t.isImageBitmapLoader===!0&&(m=function(x){let p=new Wt(x);p.needsUpdate=!0,d(p)}),t.load(Si.resolveURL(u,s.path),m,void 0,f)})}).then(function(u){return h===!0&&c.revokeObjectURL(l),ai(u,a),u.userData.mimeType=a.mimeType||Y_(a.uri),u}).catch(function(u){throw console.error("THREE.GLTFLoader: Couldn't load texture",l),u});return this.sourceCache[e]=o,o}assignTexture(e,t,n,i){let s=this;return this.getDependency("texture",n.index).then(function(a){if(!a)return null;if(n.texCoord!==void 0&&n.texCoord>0&&(a=a.clone(),a.channel=n.texCoord),s.extensions[nt.KHR_TEXTURE_TRANSFORM]){let c=n.extensions!==void 0?n.extensions[nt.KHR_TEXTURE_TRANSFORM]:void 0;if(c){let l=s.associations.get(a);a=s.extensions[nt.KHR_TEXTURE_TRANSFORM].extendTexture(a,c),s.associations.set(a,l)}}return i!==void 0&&(a.colorSpace=i),e[t]=a,a})}assignFinalMaterial(e){let t=e.geometry,n=e.material,i=t.attributes.tangent===void 0,s=t.attributes.color!==void 0,a=t.attributes.normal===void 0;if(e.isPoints){let c="PointsMaterial:"+n.uuid,l=this.cache.get(c);l||(l=new Cn,an.prototype.copy.call(l,n),l.color.copy(n.color),l.map=n.map,l.sizeAttenuation=!1,this.cache.add(c,l)),n=l}else if(e.isLine){let c="LineBasicMaterial:"+n.uuid,l=this.cache.get(c);l||(l=new er,an.prototype.copy.call(l,n),l.color.copy(n.color),l.map=n.map,this.cache.add(c,l)),n=l}if(i||s||a){let c="ClonedMaterial:"+n.uuid+":";i&&(c+="derivative-tangents:"),s&&(c+="vertex-colors:"),a&&(c+="flat-shading:");let l=this.cache.get(c);l||(l=n.clone(),s&&(l.vertexColors=!0),a&&(l.flatShading=!0),i&&(l.normalScale&&(l.normalScale.y*=-1),l.clearcoatNormalScale&&(l.clearcoatNormalScale.y*=-1)),this.cache.add(c,l),this.associations.set(l,this.associations.get(n))),n=l}e.material=n}getMaterialType(){return $e}loadMaterial(e){let t=this,n=this.json,i=this.extensions,s=n.materials[e],a,c={},l=s.extensions||{},h=[];if(l[nt.KHR_MATERIALS_UNLIT]){let u=i[nt.KHR_MATERIALS_UNLIT];a=u.getMaterialType(),h.push(u.extendParams(c,s,t))}else{let u=s.pbrMetallicRoughness||{};if(c.color=new Ae(1,1,1),c.opacity=1,Array.isArray(u.baseColorFactor)){let d=u.baseColorFactor;c.color.setRGB(d[0],d[1],d[2],sn),c.opacity=d[3]}u.baseColorTexture!==void 0&&h.push(t.assignTexture(c,"map",u.baseColorTexture,_t)),c.metalness=u.metallicFactor!==void 0?u.metallicFactor:1,c.roughness=u.roughnessFactor!==void 0?u.roughnessFactor:1,u.metallicRoughnessTexture!==void 0&&(h.push(t.assignTexture(c,"metalnessMap",u.metallicRoughnessTexture)),h.push(t.assignTexture(c,"roughnessMap",u.metallicRoughnessTexture))),a=this._invokeOne(function(d){return d.getMaterialType&&d.getMaterialType(e)}),h.push(Promise.all(this._invokeAll(function(d){return d.extendMaterialParams&&d.extendMaterialParams(e,c)})))}s.doubleSided===!0&&(c.side=Rt);let o=s.alphaMode||Uh.OPAQUE;if(o===Uh.BLEND?(c.transparent=!0,c.depthWrite=!1):(c.transparent=!1,o===Uh.MASK&&(c.alphaTest=s.alphaCutoff!==void 0?s.alphaCutoff:.5)),s.normalTexture!==void 0&&a!==tt&&(h.push(t.assignTexture(c,"normalMap",s.normalTexture)),c.normalScale=new ae(1,1),s.normalTexture.scale!==void 0)){let u=s.normalTexture.scale;c.normalScale.set(u,u)}if(s.occlusionTexture!==void 0&&a!==tt&&(h.push(t.assignTexture(c,"aoMap",s.occlusionTexture)),s.occlusionTexture.strength!==void 0&&(c.aoMapIntensity=s.occlusionTexture.strength)),s.emissiveFactor!==void 0&&a!==tt){let u=s.emissiveFactor;c.emissive=new Ae().setRGB(u[0],u[1],u[2],sn)}return s.emissiveTexture!==void 0&&a!==tt&&h.push(t.assignTexture(c,"emissiveMap",s.emissiveTexture,_t)),Promise.all(h).then(function(){let u=new a(c);return s.name&&(u.name=s.name),ai(u,s),t.associations.set(u,{materials:e}),s.extensions&&vs(i,u,s),u})}createUniqueName(e){let t=bt.sanitizeNodeName(e||"");return t in this.nodeNamesUsed?t+"_"+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){let t=this,n=this.extensions,i=this.primitiveCache;function s(c){return n[nt.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(c,t).then(function(l){return qf(l,c,t)})}let a=[];for(let c=0,l=e.length;c<l;c++){let h=e[c],o=q_(h),u=i[o];if(u)a.push(u.promise);else{let d;h.extensions&&h.extensions[nt.KHR_DRACO_MESH_COMPRESSION]?d=s(h):d=qf(new ot,h,t),h.mode===Pn.TRIANGLE_STRIP?d=d.then(f=>Dh(f,ba)):h.mode===Pn.TRIANGLE_FAN&&(d=d.then(f=>Dh(f,fr))),i[o]={primitive:h,promise:d},a.push(d)}}return Promise.all(a)}loadMesh(e){let t=this,n=this.json,i=this.extensions,s=n.meshes[e],a=s.primitives,c=[];for(let l=0,h=a.length;l<h;l++){let o=a[l].material===void 0?V_(this.cache):this.getDependency("material",a[l].material);c.push(o)}return c.push(t.loadGeometries(a)),Promise.all(c).then(async function(l){let h=l.slice(0,l.length-1),o=l[l.length-1],u=[];for(let f=0,m=o.length;f<m;f++){let x=o[f],p=a[f],g,y=h[f];if(p.mode===Pn.TRIANGLES||p.mode===Pn.TRIANGLE_STRIP||p.mode===Pn.TRIANGLE_FAN||p.mode===void 0){let b=s.isSkinnedMesh===!0,M=x.hasAttribute("skinIndex")&&x.hasAttribute("skinWeight");b&&M===!1&&console.warn("THREE.GLTFLoader: Missing skinIndex or skinWeight attributes. Skinning disabled."),g=b&&M?new Xr(x,y):new Z(x,y),g.isSkinnedMesh===!0&&g.normalizeSkinWeights()}else if(p.mode===Pn.LINES)g=new Yr(x,y);else if(p.mode===Pn.LINE_STRIP)g=new ls(x,y);else if(p.mode===Pn.LINE_LOOP)g=new Zr(x,y);else if(p.mode===Pn.POINTS)g=new kn(x,y);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+p.mode);Object.keys(g.geometry.morphAttributes).length>0&&X_(g,s),g.name=t.createUniqueName(s.name||"mesh_"+e),ai(g,s),p.extensions&&vs(i,g,p),t.assignFinalMaterial(g),u.push(g)}for(let f=0,m=u.length;f<m;f++)t.associations.set(u[f],{meshes:e,primitives:f});if(u.length===1)return s.extensions&&vs(i,u[0],s),u[0];let d=new qe;s.extensions&&vs(i,d,s),t.associations.set(d,{meshes:e});for(let f=0,m=u.length;f<m;f++)d.add(u[f]);return d})}loadCamera(e){let t,n=this.json.cameras[e],i=n[n.type];if(!i){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return n.type==="perspective"?t=new kt(Ea.radToDeg(i.yfov),i.aspectRatio||1,i.znear||1,i.zfar||2e6):n.type==="orthographic"&&(t=new Wi(-i.xmag,i.xmag,i.ymag,-i.ymag,i.znear,i.zfar)),n.name&&(t.name=this.createUniqueName(n.name)),ai(t,n),Promise.resolve(t)}loadSkin(e){let t=this.json.skins[e],n=[];for(let i=0,s=t.joints.length;i<s;i++)n.push(this._loadNodeShallow(t.joints[i]));return t.inverseBindMatrices!==void 0?n.push(this.getDependency("accessor",t.inverseBindMatrices)):n.push(null),Promise.all(n).then(function(i){let s=i.pop(),a=i,c=[],l=[];for(let h=0,o=a.length;h<o;h++){let u=a[h];if(u){c.push(u);let d=new Fe;s!==null&&d.fromArray(s.array,h*16),l.push(d)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[h])}return new qr(c,l)})}loadAnimation(e){let t=this.json,n=this,i=t.animations[e],s=i.name?i.name:"animation_"+e,a=[],c=[],l=[],h=[],o=[];for(let u=0,d=i.channels.length;u<d;u++){let f=i.channels[u],m=i.samplers[f.sampler],x=f.target,p=x.node,g=i.parameters!==void 0?i.parameters[m.input]:m.input,y=i.parameters!==void 0?i.parameters[m.output]:m.output;x.node!==void 0&&(a.push(this.getDependency("node",p)),c.push(this.getDependency("accessor",g)),l.push(this.getDependency("accessor",y)),h.push(m),o.push(x))}return Promise.all([Promise.all(a),Promise.all(c),Promise.all(l),Promise.all(h),Promise.all(o)]).then(function(u){let d=u[0],f=u[1],m=u[2],x=u[3],p=u[4],g=[];for(let b=0,M=d.length;b<M;b++){let w=d[b],S=f[b],T=m[b],_=x[b],v=p[b];if(w===void 0)continue;w.updateMatrix&&w.updateMatrix();let R=n._createAnimationTracks(w,S,T,_,v);if(R)for(let C=0;C<R.length;C++)g.push(R[C])}let y=new ds(s,void 0,g);return ai(y,i),y})}createNodeMesh(e){let t=this.json,n=this,i=t.nodes[e];return i.mesh===void 0?null:n.getDependency("mesh",i.mesh).then(function(s){let a=n._getNodeRef(n.meshCache,i.mesh,s);return i.weights!==void 0&&a.traverse(function(c){if(c.isMesh)for(let l=0,h=i.weights.length;l<h;l++)c.morphTargetInfluences[l]=i.weights[l]}),a})}loadNode(e){let t=this.json,n=this,i=t.nodes[e],s=n._loadNodeShallow(e),a=[],c=i.children||[];for(let h=0,o=c.length;h<o;h++)a.push(n.getDependency("node",c[h]));let l=i.skin===void 0?Promise.resolve(null):n.getDependency("skin",i.skin);return Promise.all([s,Promise.all(a),l]).then(function(h){let o=h[0],u=h[1],d=h[2];d!==null&&o.traverse(function(f){f.isSkinnedMesh&&f.bind(d,Z_)});for(let f=0,m=u.length;f<m;f++)o.add(u[f]);if(o.userData.pivot!==void 0&&u.length>0){let f=o.userData.pivot,m=u[0];o.pivot=new L().fromArray(f),o.position.x-=f[0],o.position.y-=f[1],o.position.z-=f[2],m.position.set(0,0,0),delete o.userData.pivot}return o})}_loadNodeShallow(e){let t=this.json,n=this.extensions,i=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];let s=t.nodes[e],a=s.name?i.createUniqueName(s.name):"",c=[],l=i._invokeOne(function(h){return h.createNodeMesh&&h.createNodeMesh(e)});return l&&c.push(l),s.camera!==void 0&&c.push(i.getDependency("camera",s.camera).then(function(h){return i._getNodeRef(i.cameraCache,s.camera,h)})),i._invokeAll(function(h){return h.createNodeAttachment&&h.createNodeAttachment(e)}).forEach(function(h){c.push(h)}),this.nodeCache[e]=Promise.all(c).then(function(h){let o;if(s.isBone===!0?o=new Js:h.length>1?o=new qe:h.length===1?o=h[0]:o=new It,o!==h[0])for(let u=0,d=h.length;u<d;u++)o.add(h[u]);if(s.name&&(o.userData.name=s.name,o.name=a),ai(o,s),s.extensions&&vs(n,o,s),s.matrix!==void 0){let u=new Fe;u.fromArray(s.matrix),o.applyMatrix4(u)}else s.translation!==void 0&&o.position.fromArray(s.translation),s.rotation!==void 0&&o.quaternion.fromArray(s.rotation),s.scale!==void 0&&o.scale.fromArray(s.scale);if(!i.associations.has(o))i.associations.set(o,{});else if(s.mesh!==void 0&&i.meshCache.refs[s.mesh]>1){let u=i.associations.get(o);i.associations.set(o,{...u})}return i.associations.get(o).nodes=e,o}),this.nodeCache[e]}loadScene(e){let t=this.extensions,n=this.json.scenes[e],i=this,s=new qe;n.name&&(s.name=i.createUniqueName(n.name)),ai(s,n),n.extensions&&vs(t,s,n);let a=n.nodes||[],c=[];for(let l=0,h=a.length;l<h;l++)c.push(i.getDependency("node",a[l]));return Promise.all(c).then(function(l){for(let o=0,u=l.length;o<u;o++){let d=l[o];d.parent!==null?s.add(Xc(d)):s.add(d)}let h=o=>{let u=new Map;for(let[d,f]of i.associations)(d instanceof an||d instanceof Wt)&&u.set(d,f);return o.traverse(d=>{let f=i.associations.get(d);f!=null&&u.set(d,f)}),u};return i.associations=h(s),s})}_createAnimationTracks(e,t,n,i,s){let a=[],c=e.name?e.name:e.uuid,l=[];function h(f){f.morphTargetInfluences&&l.push(f.name?f.name:f.uuid)}Ki[s.path]===Ki.weights?(h(e),e.isGroup&&e.children.forEach(h)):l.push(c);let o;switch(Ki[s.path]){case Ki.weights:o=Mi;break;case Ki.rotation:o=bi;break;case Ki.translation:case Ki.scale:o=ki;break;default:switch(n.itemSize){case 1:o=Mi;break;case 2:case 3:default:o=ki;break}break}let u=i.interpolation!==void 0?G_[i.interpolation]:as,d=this._getArrayFromAccessor(n);for(let f=0,m=l.length;f<m;f++){let x=new o(l[f]+"."+Ki[s.path],t.array,d,u);i.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(x),a.push(x)}return a}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){let n=ou(t.constructor),i=new Float32Array(t.length);for(let s=0,a=t.length;s<a;s++)i[s]=t[s]*n;t=i}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(n){let i=this instanceof bi?ru:Zc;return new i(this.times,this.values,this.getValueSize()/3,n)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}};function K_(r,e,t){let n=e.attributes,i=new rn;if(n.POSITION!==void 0){let c=t.json.accessors[n.POSITION],l=c.min,h=c.max;if(l!==void 0&&h!==void 0){if(i.set(new L(l[0],l[1],l[2]),new L(h[0],h[1],h[2])),c.normalized){let o=ou(vr[c.componentType]);i.min.multiplyScalar(o),i.max.multiplyScalar(o)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;let s=e.targets;if(s!==void 0){let c=new L,l=new L;for(let h=0,o=s.length;h<o;h++){let u=s[h];if(u.POSITION!==void 0){let d=t.json.accessors[u.POSITION],f=d.min,m=d.max;if(f!==void 0&&m!==void 0){if(l.setX(Math.max(Math.abs(f[0]),Math.abs(m[0]))),l.setY(Math.max(Math.abs(f[1]),Math.abs(m[1]))),l.setZ(Math.max(Math.abs(f[2]),Math.abs(m[2]))),d.normalized){let x=ou(vr[d.componentType]);l.multiplyScalar(x)}c.max(l)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}i.expandByVector(c)}r.boundingBox=i;let a=new un;i.getCenter(a.center),a.radius=i.min.distanceTo(i.max)/2,r.boundingSphere=a}function qf(r,e,t){let n=e.attributes,i=[];function s(a,c){return t.getDependency("accessor",a).then(function(l){r.setAttribute(c,l)})}for(let a in n){let c=au[a]||a.toLowerCase();c in r.attributes||i.push(s(n[a],c))}if(e.indices!==void 0&&!r.index){let a=t.getDependency("accessor",e.indices).then(function(c){r.setIndex(c)});i.push(a)}return Qe.workingColorSpace!==sn&&"COLOR_0"in n&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${Qe.workingColorSpace}" not supported.`),ai(r,e),K_(r,e,t),Promise.all(i).then(function(){return e.targets!==void 0?W_(r,e.targets,t):r})}var Kc=class{ctx=null;master;sfx;musicGain;noise;voices=0;music;amb;windG;last=new Map;muted=!1;unlock(){if(this.ctx){this.ctx.state==="suspended"&&this.ctx.resume();return}let e=window.AudioContext||window.webkitAudioContext;if(!e)return;let t=this.ctx=new e;this.master=t.createGain(),this.master.gain.value=.9,this.master.connect(t.destination);let n=t.createDynamicsCompressor();n.threshold.value=-14,n.ratio.value=4,n.connect(this.master),this.sfx=t.createGain(),this.sfx.gain.value=.8,this.sfx.connect(n),this.musicGain=t.createGain(),this.musicGain.gain.value=.35,this.musicGain.connect(this.master);let i=t.sampleRate*2,s=t.createBuffer(1,i,t.sampleRate),a=s.getChannelData(0);for(let c=0;c<i;c++)a[c]=Math.random()*2-1;this.noise=s}get ready(){return!!this.ctx&&!this.muted}ambience(e){if(!this.ctx||this.amb)return;let t=this.ctx,n=t.createBufferSource();n.buffer=this.noise,n.loop=!0;let i=t.createBiquadFilter();i.type="lowpass",i.frequency.value=e==="cliffs"?700:e==="graveyard"?380:220,i.Q.value=.7;let s=t.createGain();s.gain.value=e==="cliffs"?.06:.045,n.connect(i).connect(s).connect(this.sfx),n.start(),this.amb={src:n,g:s,f:i};let a=t.createBufferSource();a.buffer=this.noise,a.loop=!0;let c=t.createBiquadFilter();c.type="bandpass",c.frequency.value=900,c.Q.value=.6,this.windG=t.createGain(),this.windG.gain.value=0,a.connect(c).connect(this.windG).connect(this.sfx),a.start()}tickAmbience(e,t){!this.ctx||!this.amb||(this.amb.f.frequency.value=300+260*(.5+.5*Math.sin(e*.23)),this.windG.gain.setTargetAtTime(t*.22,this.ctx.currentTime,.15))}playMusic(e){if(this.music)return;let t=new Audio(e);t.loop=!0,t.volume=.28,this.music=t,t.play().catch(()=>{})}setMuted(e){this.muted=e,this.master&&(this.master.gain.value=e?0:.9),this.music&&(this.music.muted=e)}voiceEl;voice(e,t=0){if(this.voiceEl?.pause(),this.music&&(this.music.volume=.28),this.muted||!e)return;let n=new Audio(e);n.volume=1,t>0&&(n.currentTime=t),this.voiceEl=n,this.music&&(this.music.volume=.1),n.onended=()=>{this.music&&(this.music.volume=.28)},n.play().catch(()=>{})}can(e,t){let n=performance.now(),i=this.last.get(e)??0;return n-i<t||this.voices>14?!1:(this.last.set(e,n),!0)}env(e,t,n,i){let s=this.ctx.currentTime;e.gain.setValueAtTime(0,s),e.gain.linearRampToValueAtTime(n,s+t),e.gain.exponentialRampToValueAtTime(1e-4,s+t+i)}tone(e,t,n,i,s=0,a=0){let c=this.ctx,l=c.createOscillator(),h=c.createGain();l.type=t,l.frequency.setValueAtTime(e,c.currentTime+a),s&&l.frequency.exponentialRampToValueAtTime(Math.max(20,e*s),c.currentTime+a+n),h.gain.setValueAtTime(0,c.currentTime+a),h.gain.linearRampToValueAtTime(i,c.currentTime+a+.008),h.gain.exponentialRampToValueAtTime(1e-4,c.currentTime+a+n),l.connect(h).connect(this.sfx),l.start(c.currentTime+a),l.stop(c.currentTime+a+n+.05),this.voices++,l.onended=()=>this.voices--}burst(e,t,n,i,s=i,a=1,c=0){let l=this.ctx,h=l.createBufferSource();h.buffer=this.noise;let o=l.createBiquadFilter();o.type=n,o.Q.value=a;let u=l.currentTime+c;o.frequency.setValueAtTime(i,u),o.frequency.exponentialRampToValueAtTime(Math.max(30,s),u+e);let d=l.createGain();d.gain.setValueAtTime(0,u),d.gain.linearRampToValueAtTime(t,u+.006),d.gain.exponentialRampToValueAtTime(1e-4,u+e),h.connect(o).connect(d).connect(this.sfx),h.start(u,Math.random()),h.stop(u+e+.05),this.voices++,h.onended=()=>this.voices--}att(e){return Math.max(0,1-e/28)**1.5}jump(){!this.ready||!this.can("jump",90)||(this.tone(260,"triangle",.16,.16,2.1),this.burst(.12,.08,"highpass",2500,4e3))}land(e){if(!this.ready||!this.can("land",80))return;let t=Math.min(1,.3+e*.7);this.burst(.18,.35*t,"lowpass",500,120),this.tone(90,"sine",.14,.25*t,.6)}step(e){if(!this.ready||!this.can("step",140))return;let t=e==="plank"||e==="floor"||e==="dark"?1400:e==="grass"||e==="mud"?700:1800;this.burst(.05,.05,"bandpass",t,t*.7,2)}hit(e){let t=this.att(e);!this.ready||t<.05||!this.can("hit",120)||(this.burst(.3,.55*t,"lowpass",900,90),this.tone(70,"sine",.3,.45*t,.5),this.tone(520,"square",.06,.05*t,.5))}thud(e,t=1){let n=this.att(e);!this.ready||n<.05||!this.can("thud"+Math.round(e),60)||(this.burst(.45*t,.6*n,"lowpass",300,40),this.tone(48,"sine",.5,.55*n,.55))}roll(e){let t=this.att(e);!this.ready||t<.05||!this.can("roll",220)||this.burst(.35,.18*t,"lowpass",220,120,3)}whoosh(e){let t=this.att(e);!this.ready||t<.08||!this.can("whoosh",260)||this.burst(.32,.2*t,"bandpass",500,1500,1.5)}fire(e){let t=this.att(e);!this.ready||t<.05||!this.can("fire",200)||(this.burst(.6,.28*t,"lowpass",1800,300,.8),this.burst(.4,.12*t,"highpass",3e3,6e3))}metal(e){let t=this.att(e);if(!(!this.ready||t<.05||!this.can("metal",150))){for(let n of[310,467,721])this.tone(n,"triangle",.5,.07*t,.98);this.burst(.12,.3*t,"bandpass",2500,1200,3)}}alarm(e){let t=this.att(e);!this.ready||t<.05||!this.can("alarm",420)||(this.tone(880,"square",.1,.06*t),this.tone(660,"square",.1,.06*t,1,.14))}chain(e){let t=this.att(e);if(!(!this.ready||t<.05||!this.can("chain",200)))for(let n=0;n<6;n++)this.burst(.04,.12*t,"bandpass",3500+Math.random()*2e3,3e3,4,n*.035)}spring(){!this.ready||!this.can("spring",150)||(this.tone(180,"sine",.35,.3,3.2),this.tone(360,"triangle",.2,.1,2.5))}portal(){if(!(!this.ready||!this.can("portal",300))){for(let e=0;e<5;e++)this.tone(400+e*180,"sine",.25,.08,1.6,e*.04);this.burst(.5,.15,"bandpass",600,3e3,2)}}crumble(e){let t=this.att(e);if(!(!this.ready||t<.05||!this.can("crumble",120)))for(let n=0;n<4;n++)this.burst(.09,.2*t,"bandpass",900+Math.random()*1500,400,2,n*.05)}splash(){!this.ready||!this.can("fall",500)||(this.burst(.9,.3,"lowpass",2e3,200),this.tone(500,"sine",.7,.12,.25))}checkpoint(){this.ready&&[659,784,988,1319].forEach((e,t)=>this.tone(e,"triangle",.35,.12,1,t*.08))}countdown(e){this.ready&&(e?[523,659,784].forEach((t,n)=>this.tone(t,"square",.45,.09,1,n*.03)):this.tone(440,"square",.18,.09))}rumbleG;rumble(e){if(this.ready){if(!this.rumbleG){let t=this.ctx,n=t.createBufferSource();n.buffer=this.noise,n.loop=!0;let i=t.createBiquadFilter();i.type="lowpass",i.frequency.value=120,this.rumbleG=t.createGain(),this.rumbleG.gain.value=0,n.connect(i).connect(this.rumbleG).connect(this.sfx),n.start()}this.rumbleG.gain.setTargetAtTime(e*.5,this.ctx.currentTime,.2)}}sparkAppear(){this.ready&&[784,988,1175,1568].forEach((e,t)=>this.tone(e,"sine",.9,.06,1.01,t*.09))}sparkHum(e){!this.ready||!this.can("hum",450)||this.tone(523+e*300,"sine",.4,.04+e*.05,1.05)}revive(){this.ready&&(this.burst(.4,.2,"bandpass",400,4e3,2),[523,659,784,1047,1319,1568].forEach((e,t)=>this.tone(e,"triangle",.7,.08,1,.4+t*.07)),this.burst(1.2,.12,"highpass",5e3,9e3,1,1.2))}deathSting(){this.ready&&([330,311,262,196].forEach((e,t)=>this.tone(e,"sawtooth",.55,.05,.98,t*.14)),this.tone(55,"sine",1.2,.3,.7))}finish(e){if(!this.ready)return;(e?[523,659,784,1047,1319]:[392,330,262]).forEach((n,i)=>this.tone(n,"triangle",.6,.13,1,i*.12)),e&&this.burst(1.6,.1,"highpass",4e3,8e3)}};var Zf=.008333333333333333;function Kf(r,e,t,n,i){let s=Math.max(0,Math.floor(e/Zf+1e-7)),a=r;(!a||a.birth!==t||s<a.tick)&&(a={x:Math.sin(t*2.17)*.18,y:n.y1+i+.6,z:n.z1-1,vx:Math.sin(t*1.31)*.22,vy:0,vz:-6,spin:0,tick:0,birth:t});let c=(n.y1-n.y0)/(n.z1-n.z0),l=Math.sqrt(1+c*c);for(;a.tick<s;a.tick++){let h=Zf;if(a.vy-=18*h,a.vx*=Math.exp(-.12*h),a.x+=a.vx*h,a.z+=a.vz*h,a.y+=a.vy*h,a.z>=n.z0&&a.z<=n.z1){let o=n.y0+(a.z-n.z0)*c+i*l;if(a.y<o){a.y=o;let d=(a.vy-c*a.vz)/l;d<0&&(a.vy-=1.16*d/l,a.vz+=1.16*d*c/l),a.vz+=(18*c/(1+c*c)*2/7-.012*a.vz*Math.abs(a.vz))*h}let u=n.halfWidth-i;Math.abs(a.x)>u&&(a.x=Math.sign(a.x)*u,a.vx=-a.vx*.45)}a.spin+=a.vz*h/i}return a}var $_=["plank","dark"],J_=2.6,at=.42,Ln=1.55,$f=-12,j_=-16,$t=(r,e,t)=>r<e?e:r>t?t:r,gn=(r,e,t=(r.x0+r.x1)/2+r.offX)=>{let n=r.z1===r.z0?0:$t((e-r.z0)/(r.z1-r.z0),0,1);return r.y0+(r.y1-r.y0)*n+r.offY+r.tiltX*(t-(r.x0+r.x1)/2-r.offX)+r.tiltZ*(e-(r.z0+r.z1)/2)},Ra=class{constructor(e,t,n,i,s){this.id=e;this.name=t;this.character=n;this.slot=i;this.bot=s}x=0;y=0;z=0;vx=0;vy=0;vz=0;inX=0;inZ=0;facing=0;stun=0;coyote=0;jumpBuffer=0;progress=0;finishTime=0;jump=!1;holdJump=!1;finished=!1;checkpoint=0;falls=0;ground=null;launched=!1;botCool=0;landed=0;hook=-1;wind=0},Q_={cliffs:{main:"grass",alt:"stone",thin:"plank",land:"grass",crumble:"stone"},graveyard:{main:"cobble",alt:"brick",thin:"dark",land:"mud",crumble:"mud"},manor:{main:"floor",alt:"flag",thin:"floor",land:"flag",crumble:"floor"},crypt:{main:"flag",alt:"flag",thin:"floor",land:"flag",crumble:"flag"}},jf={gears:"\u0413\u0438\u0433\u0430\u043D\u0442\u0441\u043A\u0438\u0435 \u0448\u0435\u0441\u0442\u0435\u0440\u043D\u0438",gates:"\u0421\u043C\u0435\u0440\u0442\u0435\u043B\u044C\u043D\u044B\u0435 \u0432\u043E\u0440\u043E\u0442\u0430",wind:"\u0412\u0435\u0442\u0440\u044F\u043D\u043E\u0439 \u043A\u043E\u0440\u0438\u0434\u043E\u0440",chase:"\u041A\u0430\u0442\u044F\u0449\u0438\u0439\u0441\u044F \u0432\u0430\u043B\u0443\u043D",tilt:"\u041F\u0435\u0440\u0435\u0432\u043E\u0440\u0430\u0447\u0438\u0432\u0430\u044E\u0449\u0430\u044F\u0441\u044F \u043A\u043E\u043C\u043D\u0430\u0442\u0430",hooks:"\u041A\u0440\u044E\u043A\u0438",falsebridge:"\u041B\u043E\u0436\u043D\u044B\u0439 \u043C\u043E\u0441\u0442",minecarts:"\u0411\u0435\u0437\u0443\u043C\u043D\u044B\u0435 \u0432\u0430\u0433\u043E\u043D\u0435\u0442\u043A\u0438",spinner:"\u041C\u0435\u043B\u044C\u043D\u0438\u0446\u0430",gaps:"\u041F\u0440\u043E\u0432\u0430\u043B\u044B",pendulums:"\u041C\u0430\u044F\u0442\u043D\u0438\u043A\u0438",rafts:"\u041F\u043B\u043E\u0442\u044B",crumble:"\u041E\u0431\u0432\u0430\u043B \u043F\u043E\u043B\u0430",sink:"\u0422\u0440\u044F\u0441\u0438\u043D\u0430",pushers:"\u0422\u0430\u0440\u0430\u043D\u044B",pads:"\u0411\u0430\u0442\u0443\u0442\u044B",traps:"\u041B\u044E\u043A\u0438",conveyor:"\u0422\u0440\u0430\u043D\u0441\u043F\u043E\u0440\u0442\u0451\u0440",flames:"\u041E\u0433\u043D\u0435\u043D\u043D\u044B\u0439 \u043F\u043E\u043B",gauntlet:"\u041C\u044F\u0441\u043E\u0440\u0443\u0431\u043A\u0430",highlow:"\u0412\u0435\u0440\u0445-\u043D\u0438\u0437",hammers:"\u041C\u043E\u043B\u043E\u0442\u044B",beams:"\u0423\u0437\u043A\u0438\u0435 \u0431\u0430\u043B\u043A\u0438",zigzag:"\u0417\u043C\u0435\u0439\u043A\u0430",maze:"\u041B\u0430\u0431\u0438\u0440\u0438\u043D\u0442",fakewalls:"\u041B\u043E\u0436\u043D\u044B\u0435 \u0441\u0442\u0435\u043D\u044B",portals:"\u041F\u043E\u0440\u0442\u0430\u043B\u044B",ramp:"\u0421\u043A\u0430\u0442",rain:"\u0414\u043E\u0436\u0434\u044C \u0441 \u043D\u0435\u0431\u0430"},hu=["spinner","gauntlet","highlow","gaps","beams","pendulums","rafts","crumble","sink","pushers","pads","traps","conveyor","flames","hammers","zigzag","ramp","rain","maze","fakewalls","portals","gears","gates","wind","chase","tilt","hooks","falsebridge","minecarts"],$c=class r{constructor(e=1,t=1,n=""){this.map=e;this.courseSeed=t;this.only=n;this.theme=e===4?"crypt":e===3?"manor":e===2?"graveyard":"cliffs",this.deathY=this.theme==="manor"||this.theme==="crypt"?-6:this.theme==="graveyard"?-2.4:$f,this.look=Q_[this.theme],this.rs=t>>>0||1,this.build()}static BARREL_SPEEDS=[5.5,9,13];blocks=[];sweepers=[];pendulums=[];boulders=[];fallers=[];pushers=[];jets=[];gears=[];gates=[];fans=[];hooks=[];chasers=[];carts=[];tilts=[];pads=[];portals=[];mazePath=[];mazeBox=[0,0,0,0];rooms=[];sections=[];fallZones=[];checkpoints=[0];finishZ=0;time=0;rampZ0=0;rampZ1=0;rampY0=0;rampY1=0;rampHalfW=4;theme;deathY=$f;boulderTimer=1.2;seed=7;fallTimer=0;fallSeed=99;fallId=0;look;z=0;y=0;rs;separateLogs(){let e=[.55,1.2,2.3,2.95],t=this.sweepers;for(let n=0;n<t.length;n++){let i=t[n],s=this.spawnY(i.z),a=l=>t.some((h,o)=>o!==n&&Math.hypot(i.x-h.x,i.z-h.z)<i.len+h.len+.2&&Math.abs(h.y-l)<.64);if(!a(i.y))continue;let c=e.map(l=>s+l).filter(l=>!a(l)).sort((l,h)=>Math.abs(l-i.y)-Math.abs(h-i.y))[0];c!==void 0&&(i.y=c)}}rnd(){return this.rs=Math.imul(this.rs,1103515245)+12345>>>0,(this.rs>>>8&65535)/65535}build(){let e=this.look;this.add(-10,10,-6,20,0,0,e.land).land=!0,this.room(-8,20,10,10),this.z=20;let t=["gears","gates","wind","chase","tilt","hooks","falsebridge","minecarts"],n=c=>{for(let l=c.length-1;l>0;l--){let h=Math.floor(this.rnd()*(l+1));[c[l],c[h]]=[c[h],c[l]]}return c},i=n(["spinner","gaps","pendulums","rafts","crumble","pushers","pads","traps","conveyor","flames","hammers","beams","zigzag",...this.theme==="graveyard"?["sink"]:[]].filter(c=>!(this.theme==="manor"&&c==="pads"))),s=n([...t]),a;if(this.theme==="cliffs"){let c=n(["gauntlet","highlow","spinner","pads"]),l=n(["gears","minecarts","falsebridge","wind","chase"]);a=[c[0],l[0],c[1],"ramp",l[1],c[2],l[2],c[3]]}else if(this.theme==="crypt"){let c=[...s.filter(h=>h!=="minecarts").slice(0,2),i[0]],l=["maze","fakewalls","portals","maze",this.rnd()<.5?"portals":"fakewalls"];for(let h=l.length-1;h>1;h--){let o=1+Math.floor(this.rnd()*h);[l[h],l[o]]=[l[o],l[h]]}a=[],l.forEach((h,o)=>{a.push(h),c[o]&&a.push(c[o])}),a.push("rain")}else a=[i[0],s[0],i[1],s[1],"ramp",i[2],s[2],i[3]],a.push(this.theme==="manor"?"pads":"rain");for(let c=1;c<a.length;c++)if(a[c]===a[c-1]){let l=a.findIndex((h,o)=>o>c&&h!==a[c]);l>0&&([a[c],a[l]]=[a[l],a[c]])}this.only&&(a=[this.only]);for(let c of a){let l=this.z;this["s_"+c](),this.sections.push({name:c,z0:l,z1:this.z}),this.add(-6,6,this.z,this.z+6,this.y,this.y,e.land).land=!0,this.room(this.z,this.z+6,6.6,8,!1),this.checkpoints.push(this.z+2.5),this.z+=6}this.separateLogs(),this.z+=1.8,this.add(-11,11,this.z,this.z+22,this.y,this.y,e.alt).land=!0,this.room(this.z,this.z+22,11.6,12),this.finishZ=this.z+12}s_spinner(){let e=Math.floor(this.rnd()*5),t=this.y,n=this.z,i=(1.1+this.rnd()*.6)*(this.rnd()<.5?-1:1);this.add(-10,10,n,n+26,t,t,this.look.alt),this.room(n,n+26,10.6,9),e===0?this.sweepers.push({x:0,y:t+.55,z:n+13,len:10.2,speed:i,angle:0}):e===1?this.sweepers.push({x:0,y:t+.55,z:n+13,len:10.2,speed:i*1.2,angle:0},{x:0,y:t+1.2,z:n+13,len:10.2,speed:-i*1.35,angle:1}):e===2?this.sweepers.push({x:0,y:t+.55,z:n+13,len:10.2,speed:i*.95,angle:0,arms:2}):e===3?this.sweepers.push({x:0,y:t+.55,z:n+13,len:10.2,speed:i,angle:0,vary:"pulse"}):this.sweepers.push({x:0,y:t+.55,z:n+13,len:10.2,speed:i*1.2,angle:0,arms:2,vary:"reverse"}),this.z+=26}s_gaps(){let e=6+Math.floor(this.rnd()*2),t=this.rnd()<.5,n=this.z;for(let i=0;i<e;i++){let s=2+this.rnd()*1.2,a=t?i%2?1.3:-1.3:0;this.add(a-2.2,a+2.2,this.z,this.z+s,this.y,this.y,this.look.thin).bottom=this.y-.45,this.z+=s+(i<e-1?1.5+this.rnd()*.4:0)}this.room(n,this.z,5,8)}s_pendulums(){let e=32+this.rnd()*6,t=this.y,n=this.z,i=4,s=2.2+this.rnd()*.6;this.add(-4.5,4.5,n,n+e,t,t,this.look.main),this.room(n,n+e,5.1,9);for(let a=0;a<i;a++)this.pendulums.push({px:0,py:t+7.8,pz:n+5+a*(e-8)/(i-1),len:6.3,amp:.95,period:s,phase:a*(1.1+this.rnd()),radius:1.05,bx:0,by:0,bz:0,swing:0});this.z+=e}s_rafts(){let e=this.z;for(let t=0;t<4;t++){let n=this.add(-2.2,2.2,this.z+1.6,this.z+6,this.y,this.y,this.look.thin);n.bottom=this.y-.45,n.driftAmp=3.6+this.rnd(),n.driftPeriod=3+this.rnd(),n.driftPhase=this.rnd()*6,this.z+=6}this.z+=1.6,this.room(e,this.z,7,9)}s_crumble(){let e=5+Math.floor(this.rnd()*2),t=this.z;for(let n=0;n<e;n++)for(let i of[-1,0,1]){let s=this.add(i*3-1.3,i*3+1.3,this.z+n*3.1+.25,this.z+n*3.1+2.85,this.y,this.y,this.look.crumble);s.crumbles=!0,s.crumbleDelay=.7,s.bottom=this.y-.7}this.z+=e*3.1,this.room(t,this.z,6.6,8)}s_sink(){let e=this.z;for(let t=0;t<4;t++)for(let n of[-1,0,1]){let i=this.add(n*3-1.2,n*3+1.2,this.z+t*3+.3,this.z+t*3+2.7,this.y,this.y,"mud");i.crumbles=!0,i.sink=!0,i.crumbleDelay=.35,i.bottom=this.y-.7}this.z+=12.6,this.room(e,this.z,6.6,8)}s_pushers(){let t=this.y,n=this.z,i=4.2;this.add(-i,i,n,n+34,t,t,this.look.main),this.room(n,n+34,i+.6,8);for(let s=0;s<6;s++)this.pushers.push({side:s%2?1:-1,wallX:i+.2,z:n+4+s*5.3,d:2.4,y:t,reach:i*1.15,period:2.2+this.rnd()*.5,phase:this.rnd(),ext:0,lastExt:0});this.z+=34}s_pads(){let e=this.z;for(let t=0;t<3;t++)this.add(-3.5,3.5,this.z,this.z+5,this.y,this.y,this.look.alt),this.pads.push({x:0,z:this.z+5-1.4,y:this.y,r:1.3,fired:-9}),this.z+=5+(t===0?6+this.rnd()*1.5:3.6+this.rnd()*.6),this.y+=this.rnd()<.5?.8:0;this.add(-3.5,3.5,this.z,this.z+3,this.y,this.y,this.look.alt),this.z+=3,this.room(e,this.z,5,11)}s_traps(){let t=this.z,n=2.6+this.rnd()*.6,i=this.rnd()<.5;for(let s=0;s<6;s++)for(let a of[-1,0,1]){let c=this.add(a*2.6-1.25,a*2.6+1.25,this.z+s*2.6,this.z+s*2.6+2.5,this.y,this.y,this.look.alt);c.bottom=this.y-.35,c.trapPeriod=n,c.trapPhase=i?s*.14+a*.05:(s*3+a+7)*.37%1}this.z+=6*2.6,this.room(t,this.z,4.6,8)}s_conveyor(){let t=this.y,n=this.z,i=this.add(-4,4,n,n+30,t,t,this.look.main);i.conveyor=-(3.2+this.rnd()*1.2),this.room(n,n+30,4.6,8);for(let s=0;s<4;s++){let a=n+5+s*6.5,c=s%2?1:-1,l=this.rnd()<.35;this.add(l?-4:c>0?-.4:-4,l||c>0?4:.4,a,a+.6,t+.75,t+.75,this.look.alt).bottom=t}this.z+=30}s_ramp(){let e=30+this.rnd()*6,t=6+this.rnd()*2,n=this.theme==="manor"?4:6;this.rampZ0=this.z,this.rampZ1=this.z+e,this.rampY0=this.y,this.rampY1=this.y+t,this.rampHalfW=n-.6,this.add(-n,n,this.z,this.z+e,this.y,this.y+t,this.look.alt),this.room(this.z,this.z+e,n+.6,10+t),this.z+=e,this.y+=t}s_rain(){let e=40+this.rnd()*6;this.add(-5.5,5.5,this.z,this.z+e,this.y,this.y,this.look.alt),this.fallZones.push([-4.5,4.5,this.z+2,this.z+e-1]),this.room(this.z,this.z+e,6.1,10),this.z+=e}wallBlock(e,t,n,i,s=2.8,a=!1){let c=this.add(e,t,n,i,this.y+s,this.y+s,"flag");return c.bottom=this.y,c.wall=!0,c.ghost=a,c}s_maze(){let s=this.z+1,a=-27/2,c=.35,l=this.y,h=this.pick(["classic","traps","secret","portals"]),o=new Set,u=new Set,d=(T,_)=>T<_?T+":"+_:_+":"+T,f=(T,_)=>_*9+T,m=Math.floor(9/2),x=Math.floor(this.rnd()*9),p=[[m,0]];for(o.add(f(m,0));p.length;){let[T,_]=p[p.length-1],v=[[T+1,_],[T-1,_],[T,_+1],[T,_-1]].filter(([I,z])=>I>=0&&I<9&&z>=0&&z<8&&!o.has(f(I,z)));if(!v.length){p.pop();continue}let[R,C]=v[Math.floor(this.rnd()*v.length)%v.length];u.add(d(f(T,_),f(R,C))),o.add(f(R,C)),p.push([R,C])}for(let T=0;T<9;T++){let _=Math.floor(this.rnd()*8),v=Math.floor(this.rnd()*8);this.rnd()<.5?u.add(d(f(_,v),f(_+1,v))):v<7&&u.add(d(f(_,v),f(_,v+1)))}let g=new Map,y=[f(m,0)];for(g.set(f(m,0),-1);y.length;){let T=y.shift(),_=T%9,v=Math.floor(T/9);for(let[R,C]of[[_+1,v],[_-1,v],[_,v+1],[_,v-1]]){if(R<0||R>=9||C<0||C>=8)continue;let I=f(R,C);g.has(I)||!u.has(d(T,I))||(g.set(I,T),y.push(I))}}let b=[];for(let T=f(x,7);T!==-1;T=g.get(T))b.unshift(T);let M=new Set(b);for(let T=0;T<8;T++)for(let _=0;_<9;_++){let v=this.add(a+_*3,a+(_+1)*3,s+T*3,s+(T+1)*3,l,l,this.look.main);h==="traps"&&!M.has(f(_,T))&&this.rnd()<.45&&(v.trapPeriod=2.2+this.rnd(),v.trapPhase=this.rnd(),v.bottom=l-.35),h==="traps"&&M.has(f(_,T))&&T>0&&T<7&&this.rnd()<.22&&(v.trapPeriod=3,v.trapPhase=this.rnd(),v.bottom=l-.35)}this.add(-27/2-.5,27/2+.5,this.z,s,l,l,this.look.main),this.add(-27/2-.5,27/2+.5,s+24,s+24+1,l,l,this.look.main),this.room(this.z,s+24+1,27/2+1.1,12);let w=new Set;if(h==="secret")for(let T=0;T<5;T++){let _=Math.floor(this.rnd()*8),v=Math.floor(this.rnd()*8),R=d(f(_,v),f(_+1,v));u.has(R)||w.add(R)}for(let T=0;T<=8;T++)for(let _=0;_<9;_++)(T===0?_===m:T===8?_===x:u.has(d(f(_,T-1),f(_,T))))||this.wallBlock(a+_*3-c/2,a+(_+1)*3+c/2,s+T*3-c/2,s+T*3+c/2,3);for(let T=0;T<8;T++)for(let _=0;_<=9;_++){let v=_>0&&_<9?d(f(_-1,T),f(_,T)):"";v!==""&&u.has(v)||this.wallBlock(a+_*3-c/2,a+_*3+c/2,s+T*3-c/2,s+(T+1)*3+c/2,3,w.has(v))}if(h==="portals"){let T=[...Array(72).keys()].filter(C=>!M.has(C)&&Math.floor(C/9)>1&&Math.floor(C/9)<7);for(let C=T.length-1;C>0;C--){let I=Math.floor(this.rnd()*(C+1));[T[C],T[I]]=[T[I],T[C]]}let _=b[Math.max(0,b.length-2)],v=b[0],R=C=>[a+(C%9+.5)*3,s+(Math.floor(C/9)+.5)*3];T.slice(0,2).forEach((C,I)=>{let[z,N]=R(C),[F,D]=R(I===0?_:v);this.portals.push({x:z,y:l,z:N,r:.9,tx:F,ty:l,tz:D,kind:I===0?"far":"back",used:-9})})}let S=b.map(T=>[a+(T%9+.5)*3,s+(Math.floor(T/9)+.5)*3]);S.unshift([0,s-.6]),S.push([a+(x+.5)*3,s+24+.8]),this.mazePaths.push({box:[a,a+27,s-1,s+24+1],path:S,variant:h}),this.z=s+24+1}mazePaths=[];fakeWalls=[];s_fakewalls(){let e=4+Math.floor(this.rnd()*2),t=6.5,n=3+e*t,i=5,s=this.z,a=.5,c=2;this.add(-i,i,s,s+n,this.y,this.y,this.look.main),this.room(s,s+n,i+.6,9);let l=[-3.75,-1.25,1.25,3.75];for(let h=0;h<e;h++){let o=s+4+h*t,u=Math.floor(this.rnd()*l.length)%l.length;l.forEach((d,f)=>this.wallBlock(d-c/2-(f===0?.25:0),d+c/2+(f===3?.25:0),o,o+a,3.2,f===u)),this.fakeWalls.push({z:o,slots:l,real:u})}this.z+=n}s_portals(){let e=this.z,t=7,n=this.y,i=3+Math.floor(this.rnd()*3);this.add(-t,t,e,e+12,n,n,this.look.main),this.room(e,e+12,t+.6,9),this.wallBlock(-t,t,e+11,e+12,5);let s=e+12;this.add(-4,4,s,s+4,n,n,this.look.main);for(let l=0;l<5;l++)for(let h of[-1,0,1]){let o=this.add(h*2.6-1.25,h*2.6+1.25,s+4+l*2.6,s+4+l*2.6+2.5,n,n,this.look.alt);o.bottom=n-.35,o.trapPeriod=2.4,o.trapPhase=l*.15+h*.04}let a=s+17;this.add(-4,4,a,a+4,n,n,this.look.main),this.room(s,a+4,4.6,9);let c=["far","near",...Array(i-2).fill("back")];i>=4&&this.rnd()<.5&&(c[2]="near");for(let l=c.length-1;l>0;l--){let h=Math.floor(this.rnd()*(l+1));[c[l],c[h]]=[c[h],c[l]]}c.forEach((l,h)=>{let o=-((i-1)*2.9)/2+h*2.9,u=l==="far"?a+2:l==="near"?s+1.5:e+1.5;this.portals.push({x:o,y:n,z:e+8,r:1.05,tx:0,ty:n,tz:u,kind:l,used:-9})}),this.z=a+4}pick(e){return e[Math.floor(this.rnd()*e.length)%e.length]}s_gauntlet(){let e=this.z,t=this.y,n=40;this.add(-11,11,e,e+n,t,t,this.look.alt),this.room(e,e+n,11.6,9);let i=1+this.rnd()*.4,s=()=>.8+this.rnd()*.5;this.sweepers.push({x:-4.5,y:t+.55,z:e+9,len:6.7,speed:i*1.6*s(),angle:0,vary:"pulse"},{x:4.5,y:t+.55,z:e+9,len:6.7,speed:-i*1.6*s(),angle:1.5},{x:0,y:t+.55,z:e+20,len:11.2,speed:i*s(),angle:.7,arms:2,vary:"pulse"},{x:-4,y:t+2.1,z:e+31,len:7.2,speed:-i*1.3*s(),angle:2},{x:4,y:t+.55,z:e+31,len:7.2,speed:i*1.3*s(),angle:.3,vary:"pulse"}),this.z+=n}s_highlow(){let e=this.z,t=this.y,n=34;this.add(-9,9,e,e+n,t,t,this.look.alt),this.room(e,e+n,9.6,10);for(let i=0;i<3;i++){let s=e+6+i*11,a=(1.1+this.rnd()*.5)*(i%2?-1:1);this.sweepers.push({x:0,y:t+.55,z:s,len:9.2,speed:a,angle:0},{x:0,y:t+2.3,z:s,len:9.2,speed:a,angle:Math.PI/2})}this.z+=n}s_flames(){let n=this.z,i=this.y;this.add(-5,5,n,n+30,i,i,this.look.alt),this.room(n,n+30,5+.6,9);let s=2.4+this.rnd()*.6,a=Math.floor(this.rnd()*3);for(let c=0;c<6;c++)for(let l=0;l<4;l++){let h=-3.75+l*2.5,o=n+3+c*4.4,u=a===0?c*.17:a===1?(c+l)%2*.5:this.rnd();this.jets.push({x:h,z:o,y:i,r:1,period:s,phase:u,kind:"fire",state:0})}this.z+=30}s_hammers(){let n=this.z,i=this.y;this.add(-4.5,4.5,n,n+32,i,i,this.look.main),this.room(n,n+32,4.5+.6,10);for(let s=0;s<5;s++){let a=this.rnd()<.5?[-2.2,2.2]:[0];for(let c of a)this.jets.push({x:c,z:n+4+s*6,y:i,r:1.5,period:2+this.rnd()*.8,phase:this.rnd(),kind:"hammer",state:0})}this.z+=32}s_beams(){let e=this.z,t=this.y,n=Math.floor(this.rnd()*4),i=0,s=(a,c,l,h)=>{let o=this.add(a,c,l,h,t,t,this.look.thin);return o.bottom=t-.4,n===1&&(o.crumbles=!0,o.crumbleDelay=.7),n===2&&h-l>2&&(o.tilt={amp:.55,period:3.4+this.rnd(),seed:this.rnd()*9,axis:"x",warn:!1},this.tilts.push(o)),o};for(let a=0;a<6;a++){let c=5+this.rnd()*2,l=(this.rnd()-.5)*6;s(Math.min(i,l)-.55,Math.max(i,l)+.55,this.z,this.z+.9),s(l-.55,l+.55,this.z+.9,this.z+c),i=l,this.z+=c}if(s(Math.min(i,0)-.55,Math.max(i,0)+.55,this.z,this.z+1),this.z+=1,n===3)for(let a=0;a<3;a++){let c=e+6+a*11,l=a%2?1:-1;this.fans.push({x:l*7,z:c,y:t+1.2,dx:-l,dz:0,reach:14,half:2.6,force:6.5,period:3.6,phase:a*.33,on:0,spin:0})}this.room(e,this.z,6,9)}s_zigzag(){let e=this.z,t=this.y,n=6;this.add(-n,n,e,e+34,t,t,this.look.main),this.room(e,e+34,n+.6,9);for(let i=0;i<5;i++){let s=e+4+i*6,a=i%2?1:-1;this.wallBlock(a>0?-n:-n+2.6,a>0?n-2.6:n,s,s+.5,1.6),this.jets.push({x:a*(n-1.3),z:s+3,y:t,r:1,period:2.6,phase:i*.2,kind:"fire",state:0})}this.z+=34}s_gears(){let e=this.z,t=this.y,n=5+Math.floor(this.rnd()*3),i=this.z+1,s=0;for(let a=0;a<n;a++){let c=2.2+this.rnd()*1.3,l=a===0?0:$t(s+(this.rnd()-.5)*4,-3.5,3.5);i+=c;let h={x:l,z:i,y:t,r:c,speed:(.45+this.rnd()*.55)*(a%2?-1:1),move:this.rnd()<.35?2.4:99,stop:1.2,phase:this.rnd()*3,gaps:[],angle:0,lastAngle:0,teeth:Math.round(c*7),block:null};if(this.rnd()<.45){let u=this.rnd()*6.28;h.gaps.push([u,u+.9+this.rnd()*.5])}let o=this.add(l-c,l+c,i-c,i+c,t,t,"stone");o.gear=h,o.bottom=t-.7,h.block=o,this.gears.push(h),i+=c+1.4+this.rnd()*.5,s=l}this.z=i-.6,this.room(e,this.z,7.5,10)}s_gates(){let e=5+Math.floor(this.rnd()*4),t=5.2,n=4+e*t,i=3.4,s=this.z,a=this.y;this.add(-i,i,s,s+n,a,a,this.look.main),this.room(s,s+n,i+.6,9);let c=this.rnd()<.5,l=3.2+this.rnd()*.8;for(let h=0;h<e;h++){let o=s+4+h*t;this.wallBlock(-i-1.2,-i,o-.4,o+.4,4.2),this.wallBlock(i,i+1.2,o-.4,o+.4,4.2),this.gates.push({z:o,y:a,halfW:i,kind:this.rnd()<.5?"slide":"drop",period:c?l:2.6+this.rnd()*1.6,phase:c?h*.09:this.rnd(),open:1,lastOpen:1,warn:!1})}this.z+=n}s_wind(){let n=this.z,i=this.y;this.add(-3.6,3.6,n,n+36,i,i,this.look.main),this.room(n,n+36,3.6+4,10);let s=4+Math.floor(this.rnd()*3);for(let a=0;a<s-1;a++){let c=n+5+a*26/(s-2),l=a%2?1:-1;this.fans.push({x:l*(3.6+2.6),z:c,y:i+1.3,dx:-l,dz:0,reach:2*3.6+3,half:2.4,force:11+this.rnd()*4,period:3+this.rnd(),phase:this.rnd(),on:0,spin:0}),this.wallBlock(l>0?3.6-1.8:-3.6+1.4,l>0?3.6-1.4:-3.6+1.8,c-3.6,c-2.2,1.6)}this.fans.push({x:0,z:n+36+1.5,y:i+1.3,dx:0,dz:-1,reach:36,half:2.2,force:7,period:4.2,phase:this.rnd(),on:0,spin:0});for(let a=0;a<3;a++)this.wallBlock(-1.2+a%2*1.5,.3+a%2*1.5,n+8+a*9,n+8.6+a*9,1.3);this.z+=36}s_chase(){let e=this.z,t=this.y,n=48,i=5,s=2.7;this.add(-s,s,e,e+n,t,t+i,this.look.alt).bottom=t-1;for(let h=0;h<5;h++){let o=e+6+h*8,u=t+(o-e)/n*i,d=h%2?-1:1;this.add(d>0?s-.4:-s-3.2,d>0?s+3.2:-s+.4,o-2,o+2,u-.21,u+.21,this.look.main)}let a={z0:e,z1:e+n,y0:t,y1:t+i,halfWidth:s},c=[[0,e+n],[0,e-5]],l=this.rnd()*.4;for(let h=0;h<8;h++)this.chasers.push({path:c,y:t,r:2.2,period:2,phase:l,x:0,z:e+n,spin:0,active:!1,dist:0,slot:h,track:a,vx:0,vz:0});this.z+=n,this.y+=i,this.room(e,this.z,7.5,12)}s_tilt(){let e=this.z,t=this.y,n=22,i=6.5;this.add(-i,i,e,e+1.5,t,t,this.look.main);let s=this.add(-i,i,e+1.5,e+n-1.5,t,t,this.look.alt);s.tilt={amp:.3,period:3,seed:this.rnd()*99,axis:"xz",warn:!1},s.bottom=t-1.2,this.tilts.push(s),this.add(-i,i,e+n-1.5,e+n,t,t,this.look.main),this.room(e,e+n,i+.6,12),this.z+=n}s_hooks(){let n=this.z,i=this.y,s=5+Math.floor(this.rnd()*4);this.add(-2.8,2.8,n,n+36,i,i,this.look.main),this.room(n,n+36,2.8+5,10);let a=this.rnd()<.5;for(let c=0;c<s;c++){let l=c%2?1:-1;this.hooks.push({side:l,pillarX:l*(2.8+3),z:n+3+c*30/(s-1),y:i+.9,reach:2*2.8+3.4,period:3.4,phase:a?c*.13:c%3*.33+this.rnd()*.1,ext:0,state:0})}this.z+=36}s_falsebridge(){let t=this.z,n=this.y,i=this.z+.8;for(let s=0;s<7;s++){let a=this.rnd()<.5?2:3,c=a===2?[-1.5,1.5]:[-2.8,0,2.8],l=Math.floor(this.rnd()*a)%a;c.forEach((h,o)=>{let u=this.add(h-1.15,h+1.15,i,i+2.3,n,n,this.look.alt);u.bottom=n-.4,o!==l&&!(a===3&&this.rnd()<.2)&&(u.fake=!0,u.crumbles=!0,u.crumbleDelay=.12,u.restoreAfter=8)}),i+=2.3+1.2}this.z=i-.4,this.room(t,this.z,5,9)}s_minecarts(){let e=this.z,t=this.y,n=5,i=11,s=this.z+1.2;for(let a=0;a<n;a++){let c=(2.2+this.rnd()*1.6)*(a%2?-1:1),l=a%2?1:2;for(let h=0;h<l;h++){let o=this.add(-1.2,1.2,s,s+2.1,t,t,this.look.thin);o.bottom=t-.9,o.cart={lane:a,speed:c,len:i,base:h*i+this.rnd()*3,move:this.rnd()<.4?3:99,stop:1.1},this.carts.push(o)}s+=2.1+1.4}this.z=s-.2,this.room(e,this.z,i+2,10)}room(e,t,n,i=8,s=!0){(this.theme==="manor"||this.theme==="crypt")&&this.rooms.push({z0:e,z1:t,halfW:n,y:this.y,h:i,skylights:s&&this.theme==="manor"})}add(e,t,n,i,s,a,c){let l={x0:e,x1:t,z0:n,z1:i,y0:s,y1:a,mat:c,bottom:$_.includes(c)?Math.min(s,a)-.42:j_,sink:!1,liftAmp:0,liftPeriod:1,liftPhase:0,lastOffY:0,conveyor:0,trapPeriod:0,trapPhase:0,warn:!1,driftAmp:0,driftPeriod:1,driftPhase:0,crumbles:!1,crumbleDelay:.75,offX:0,offY:0,lastOffX:0,crumbleAt:-1,fallV:0,gone:!1,tiltX:0,tiltZ:0,restoreAfter:3.8};return this.blocks.push(l),l}spawnY(e){let t=-99;for(let n of this.blocks)!n.crumbles&&!n.driftAmp&&!n.trapPeriod&&!n.wall&&!n.gear&&!n.cart&&!n.tilt&&e>=n.z0&&e<=n.z1&&n.bottom<n.y0-.5&&(t=Math.max(t,gn(n,e)));return t>-99?t:0}sectionAt(e){return this.sections.find(t=>e>=t.z0&&e<t.z1)}step(e){this.time+=e;let t=this.time;for(let s of this.blocks){if(s.lastOffX=s.offX,s.lastOffY=s.offY,s.liftAmp&&(s.offY=s.liftAmp*Math.sin(Math.PI*2*t/s.liftPeriod+s.liftPhase)),s.driftAmp&&(s.offX=s.driftAmp*Math.sin(Math.PI*2*t/s.driftPeriod+s.driftPhase)),s.trapPeriod){let a=(t/s.trapPeriod+s.trapPhase)%1;s.gone=a>.7,s.warn=a>.46&&a<=.7}if(s.sink&&s.crumbleAt<0&&s.offY<0&&(s.offY=Math.min(0,s.offY+e*1.2)),s.crumbles&&s.crumbleAt>=0){let a=t-s.crumbleAt;s.sink?(a>s.crumbleDelay&&(s.offY=Math.max(-2.6,s.offY-e*1.6)),a>s.crumbleDelay+3.2&&(s.crumbleAt=-1)):a>s.crumbleDelay&&(s.fallV+=26*e,s.offY-=s.fallV*e,s.offY<-6&&(s.gone=!0)),!s.sink&&a>s.crumbleDelay+s.restoreAfter&&(s.crumbleAt=-1,s.offY=0,s.fallV=0,s.gone=!1)}}for(let s of this.sweepers)if(s.angle0??=s.angle,s.lastAngle=s.angle,s.vary==="pulse"){let a=t/6+s.angle0,c=a-Math.floor(a);s.boost=c>.7?1:c>.58?.5:0,s.angle=s.angle0+s.speed*(t+1.8*Math.floor(a)+Math.max(0,c-.7)*6)}else s.vary==="reverse"?s.angle=s.angle0+s.speed*2.6*Math.sin(t*.45):s.angle=s.speed*t+s.angle0;for(let s of this.gears){s.lastAngle=s.angle;let a=s.move+s.stop,c=Math.floor((t+s.phase)/a),l=Math.min(s.move,t+s.phase-c*a);s.angle=s.speed*(c*s.move+l)}for(let s of this.carts){let a=s.cart,c=a.move+a.stop,l=Math.floor(t/c),h=l*a.move+Math.min(a.move,t-l*c),o=a.len+J_,u=o*2,d=((a.base+a.speed*h)%u+u)%u-o;s.lastOffX=s.offX,s.offX=d,s.gone=Math.abs(d)>a.len-.8}for(let s of this.gates){s.lastOpen=s.open;let a=(t/s.period+s.phase)%1,c=a<.35||a<.47?1:a<.55?1-(a-.47)/.08:a<.7?0:a<.82?(a-.7)/.12:1;s.open=c,s.warn=a>.35&&a<.47}for(let s of this.fans){let a=(t/s.period+s.phase)%1;s.on=a<.55?(a<.08?a/.08:1)*(.75+.25*Math.sin(t*2.3+s.z)):0,s.spin+=e*(2+22*s.on)}for(let s of this.hooks){let a=(t/s.period+s.phase)%1;s.state=a<.5?0:a<.68?1:a<.74?2:a<.8?3:4,s.ext=s.state===2?(a-.68)/.06:s.state===3?1:s.state===4?Math.max(0,1-(a-.8)/.2):0}for(let s of this.chasers){let a=Math.floor((t-s.phase)/2),c=a-((a-s.slot)%8+8)%8,l=s.phase+c*2,h=t-l;s.active=c>=0&&h>=0&&h<12,s.active&&(s.body=Kf(s.body,h,l,s.track,s.r),s.x=s.body.x,s.z=s.body.z,s.y=s.body.y-s.r,s.vx=s.body.vx,s.vz=s.body.vz,s.spin=s.body.spin,s.dist=s.track.z1-s.z,(s.z<s.track.z0-7||s.body.y<this.deathY-5)&&(s.active=!1))}for(let s of this.tilts){let a=s.tilt;if(a.axis==="x"){s.tiltX=a.amp*Math.sin(t*Math.PI*2/a.period+a.seed)*.5;continue}let c=Math.floor(t/a.period),l=t/a.period-c,h=p=>{let g=Math.sin((p+a.seed)*12.9898)*43758.5453,y=g-Math.floor(g),b=Math.sin((p+a.seed)*78.233)*12345.678,M=b-Math.floor(b);return[(y-.5)*2*a.amp,(M-.5)*2*a.amp*.7]},[o,u]=h(c),[d,f]=h(c+1),m=l<.55?0:(l-.55)/.45,x=m*m*(3-2*m);s.tiltX=o+(d-o)*x,s.tiltZ=u+(f-u)*x,a.warn=l>.3&&l<.6&&Math.hypot(d,f)>a.amp*.75}for(let s of this.pendulums)s.swing=s.amp*Math.sin(Math.PI*2*t/s.period+s.phase),s.bx=s.px+Math.sin(s.swing)*s.len,s.by=s.py-Math.cos(s.swing)*s.len,s.bz=s.pz;for(let s of this.jets){let a=(t/s.period+s.phase)%1;s.state=s.kind==="fire"?a>.62?2:a>.4?1:0:a>.8?2:a>.55?1:0}for(let s of this.pushers){s.lastExt=s.ext;let a=(t/s.period+s.phase)%1,c=a<.1?a/.1:a<.42?1:a<.72?1-(a-.42)/.3:0;s.ext=c*c*(3-2*c)}if(this.boulderTimer-=e,this.boulderTimer<=0&&this.rampZ1>this.rampZ0){let s=this.rampZ1-this.rampZ0,a=this.rampHalfW,c=this.srand(),l=[-1,0,1].sort(()=>this.srand()-.5),h=c<.34?"down":c<.52?"up":c<.72?"cross":c<.87?"zigzag":"hop",o=(u,d,f={})=>{if(this.boulders.length>=8)return;let m=.85+this.srand()*.2,x=$t(u*a*.62+(this.srand()-.5)*.8,-a+m,a-m),p=d<0?this.rampZ1-1-this.srand()*2:this.rampZ0+.6;if(this.boulders.some(b=>Math.hypot(b.x-x,b.z-p)<b.radius+m+.2))return;let g=d>0,y=Math.sqrt(12*s*(.38+this.srand()*.32));this.boulders.push({x,y:this.rampY0+m,z:p,vz:g?y:-2-this.srand()*2,spin:0,radius:m,alive:!0,target:r.BARREL_SPEEDS[Math.min(2,Math.floor(this.srand()*3))],next:this.time+.8+this.srand()*1.6,vx:0,hop:0,vh:0,free:g,bouncy:!1,roll:0,...f})};if(h==="down")for(let u of l.slice(0,this.srand()<.6?1:2))o(u,-1);else h==="up"?o(l[0],1):h==="cross"?(o(l[0],-1),o(l[0],1)):h==="zigzag"?o(l[0],-1,{vx:(this.srand()<.5?-1:1)*(2.6+this.srand()*1.6),target:r.BARREL_SPEEDS[1]}):o(l[0],-1,{bouncy:!0,vh:4,target:r.BARREL_SPEEDS[this.srand()<.5?0:1]});this.boulderTimer=(h==="up"||h==="cross"?1.7:1.05)+this.srand()*.55}let n=(this.rampY1-this.rampY0)/Math.max(1,this.rampZ1-this.rampZ0),i=this.rampHalfW;for(let s of this.boulders){!s.free&&this.time>=s.next&&(s.target=r.BARREL_SPEEDS[Math.min(2,Math.floor(this.srand()*3))]*(.85+this.srand()*.3),s.next=this.time+.9+this.srand()*1.8);let a=s.z>this.rampZ0&&s.z<this.rampZ1+.5;a?s.free?s.vz-=6*e:s.vz+=$t(-s.target-s.vz,-7*e,7*e):s.vz-=10*e,s.z>this.rampZ1-s.radius&&s.vz>0&&(s.vz=-s.vz*.4),s.z+=s.vz*e,s.x+=s.vx*e,s.spin+=(s.vz<0?-1:1)*Math.hypot(s.vx,s.vz)*e/s.radius,s.roll=Math.atan(s.vx/(Math.abs(s.vz)<.3?.3*(s.vz<0?-1:1):s.vz)),Math.abs(s.x)>i-s.radius&&(s.x=Math.sign(s.x)*(i-s.radius),s.vx=-s.vx*.85,s.hop<.05&&(s.vh=Math.max(s.vh,2.6))),s.vx*=1-.08*e,s.vh-=22*e,s.hop+=s.vh*e,s.hop<0&&(s.hop=0,s.vh=s.bouncy?6.2:0),a||s.z>this.rampZ0?s.y=this.rampY0+$t(s.z-this.rampZ0,0,this.rampZ1-this.rampZ0)*n+s.radius+s.hop:s.y-=30*e,s.y<this.deathY-10&&(s.alive=!1)}this.boulders=this.boulders.filter(s=>s.alive);for(let s=0;s<this.boulders.length;s++)for(let a=s+1;a<this.boulders.length;a++){let c=this.boulders[s],l=this.boulders[a],h=l.x-c.x,o=l.z-c.z,u=Math.hypot(h,o),d=c.radius+l.radius;if(u>=d||u<1e-4||Math.abs(c.hop-l.hop)>d*.8)continue;let f=h/u,m=o/u,x=(d-u)/2;c.x-=f*x,c.z-=m*x,l.x+=f*x,l.z+=m*x;let p=(l.vx-c.vx)*f+(l.vz-c.vz)*m;if(p<0){let g=-p*.92;c.vx-=f*g,c.vz-=m*g,l.vx+=f*g,l.vz+=m*g;let y=(this.srand()-.5)*2.4;c.vx+=y,l.vx-=y,c.vh=Math.max(c.vh,3.2),l.vh=Math.max(l.vh,3.2);for(let b of[c,l])b.free||(b.free=b.vz>0,b.next=this.time+1.2)}for(let g of[c,l])g.x=$t(g.x,-i+g.radius,i-g.radius)}for(let s of this.boulders)s.free&&s.vz<-3&&s.z<this.rampZ1-4&&this.time>=s.next&&(s.free=!1);for(this.fallTimer-=e;this.fallTimer<=0&&this.fallZones.length;){let s=()=>((this.fallSeed=this.fallSeed*1103515245+12345|0)>>>8&65535)/65535,a=this.fallZones[s()<.72?0:this.fallZones.length-1],c=a[0]+s()*(a[1]-a[0]),l=a[2]+s()*(a[3]-a[2]),h=-99;for(let u of this.blocks)!u.crumbles&&!u.driftAmp&&c>=u.x0&&c<=u.x1&&l>=u.z0&&l<=u.z1&&(h=Math.max(h,gn(u,l)));let o=.8+s()*.7;h>-50&&this.fallers.push({id:++this.fallId,x:c,z:l,g:h,spawn:t,impact:t+1.25+s()*.3,r:o,y:h+30,alive:!0,landed:!1}),this.fallTimer+=.2+s()*.16}for(let s of this.fallers){let a=(t-s.spawn)/(s.impact-s.spawn);a<1?s.y=s.g+s.r+30*(1-a*a):(s.landed=!0,s.y=s.g+s.r*.7-Math.max(0,t-s.impact-.6)*2),t>s.impact+1.4&&(s.alive=!1)}this.fallers=this.fallers.filter(s=>s.alive)}srand(){return this.seed=Math.imul(this.seed,1103515245)+12345|0,(this.seed>>>8&1023)/1023}move(e,t){if(e.hook>=0){let o=this.hooks[e.hook];e.x=o.pillarX-o.side*o.reach*o.ext,e.z=o.z,e.y=o.y-.6,e.vx=e.vy=e.vz=0,e.ground=null,(o.ext<.05||o.state<2)&&(e.hook=-1,e.vx=o.side*2,e.stun=.4);return}if(e.finished){e.vx=e.vy=e.vz=0;return}e.stun=Math.max(0,e.stun-t),e.coyote-=t,e.jumpBuffer-=t;let n=e.inX,i=e.inZ,s=Math.hypot(n,i);s>1&&(n/=s,i/=s);let a=8.2,c=e.ground?75:24;if(e.stun>0&&(c=3),e.vx=Jf(e.vx,n*a,c*t),e.vz=!e.ground&&e.vz>a?e.vz-2*t:Jf(e.vz,i*a,c*t),s>.1&&(e.facing=Math.atan2(n,i)),e.jump&&(e.jumpBuffer=.14,e.jump=!1),e.jumpBuffer>0&&e.coyote>0&&e.stun<=0&&(e.vy=9.6,e.coyote=0,e.jumpBuffer=0,e.ground=null),e.vy<=0&&(e.launched=!1),e.vy-=(e.vy>0&&!e.holdJump&&!e.launched?38:26)*t,e.ground){let o=e.ground;if(o.gear){let u=o.gear,d=u.angle-u.lastAngle,f=e.x-u.x,m=e.z-u.z,x=Math.cos(d),p=Math.sin(d);e.x=u.x+f*x-m*p,e.z=u.z+f*p+m*x,e.facing+=d*0}else o.cart&&Math.abs(o.offX-o.lastOffX)>3||(e.x+=o.offX-o.lastOffX,e.y+=o.offY-o.lastOffY);e.z+=o.conveyor*t,(o.tiltX||o.tiltZ)&&(e.x-=o.tiltX*15*t,e.z-=o.tiltZ*15*t)}e.wind=0;for(let o of this.fans){if(o.on<=.02)continue;let u=o.dx?(e.x-o.x)*o.dx:(e.z-o.z)*o.dz,d=o.dx?Math.abs(e.z-o.z):Math.abs(e.x-o.x);if(u<0||u>o.reach||d>o.half||e.y>o.y+2.5)continue;let f=!1;for(let x of this.blocks)if(x.wall&&!x.ghost&&(o.dx?e.z>=x.z0&&e.z<=x.z1&&(x.x0+x.x1)/2>Math.min(o.x,e.x)&&(x.x0+x.x1)/2<Math.max(o.x,e.x):e.x>=x.x0&&e.x<=x.x1&&(x.z0+x.z1)/2>Math.min(o.z,e.z)&&(x.z0+x.z1)/2<Math.max(o.z,e.z))){f=!0;break}if(f)continue;let m=o.force*o.on*(e.ground?1:1.5)*(1-.4*u/o.reach);e.x+=o.dx*m*t,e.z+=o.dz*m*t,e.wind=Math.max(e.wind,o.on)}let l=e.y;e.x+=e.vx*t,e.y+=e.vy*t,e.z+=e.vz*t;let h=null;for(let o of this.blocks){if(o.gone||o.ghost||o.gear)continue;let u=o.x0+o.offX,d=o.x1+o.offX,f=$t(e.x,u,d),m=$t(e.z,o.z0,o.z1),x=e.x-f,p=e.z-m,g=x*x+p*p;if(g>at*at)continue;let y=gn(o,m,$t(e.x,u,d)),b=o.y0!==o.y1||!!(o.tiltX||o.tiltZ);if(e.x>u-at*.5&&e.x<d+at*.5&&e.z>o.z0-at*.5&&e.z<o.z1+at*.5&&e.vy<=.01&&e.y<=y+.05&&l>=y-.45-(b?.5:0)){e.y=y,e.vy=0,h=o;continue}if(e.y<y-.45&&e.y+Ln>o.bottom)if(g>1e-6){let w=Math.sqrt(g),S=at-w;e.x+=x/w*S,e.z+=p/w*S,Math.abs(x)>Math.abs(p)?e.vx=0:e.vz=0}else{let w=e.x-u,S=d-e.x,T=e.z-o.z0,_=o.z1-e.z,v=Math.min(w,S,T,_);v===w?e.x=u-at:v===S?e.x=d+at:v===T?e.z=o.z0-at:e.z=o.z1+at}}h&&!e.ground&&l-e.y>=0&&(e.landed=this.time);for(let o of this.gears){let u=e.x-o.x,d=e.z-o.z,f=Math.hypot(u,d);if(f>o.r+at)continue;let m=Math.atan2(d,u)-o.angle;m=(m%6.2832+6.2832)%6.2832;let x=o.gaps.some(([p,g])=>m>=p&&m<=g);if(f<=o.r&&!x&&e.vy<=.01&&e.y<=o.y+.05&&l>=o.y-.45){e.y=o.y,e.vy=0,h=o.block;continue}if(!x&&e.y<o.y-.45&&e.y+Ln>o.y-.7&&f>.01){let p=o.r+at-f;e.x+=u/f*p,e.z+=d/f*p}}for(let o of this.gates){if(Math.abs(e.z-o.z)>.35+at||e.y>o.y+3.6)continue;let u=o.open<o.lastOpen,d=!1;if(o.kind==="slide"){let f=o.halfW*(1-o.open);d=e.x-at<-o.halfW+f||e.x+at>o.halfW-f}else d=o.y+3.2*o.open<e.y+Ln;d&&(u&&o.open>.05&&(this.hit(e,(e.x>0?-1:1)*3,6,e.z<o.z?-13:13),e.stun=.8),e.z=e.z<o.z?o.z-.35-at:o.z+.35+at,e.vz=0)}for(let o=0;o<this.hooks.length;o++){let u=this.hooks[o];if(u.state!==2&&u.state!==3)continue;let d=u.pillarX-u.side*u.reach*u.ext;if(Math.abs(e.x-d)<.8&&Math.abs(e.z-u.z)<.9&&e.y<u.y+1&&e.y+Ln>u.y-.5&&e.stun<=.25){e.hook=o;return}}for(let o of this.chasers){if(!o.active)continue;let u=e.x-o.x,d=e.z-o.z,f=e.y+Ln/2-(o.y+o.r);if(u*u+d*d+f*f<(o.r+at)**2){let m=Math.hypot(u,d)||1;this.hit(e,u/m*8+o.vx,6,Math.min(-7,o.vz*1.4)),e.stun=.9}}e.ground=h,h&&(e.coyote=.1,h.crumbles&&h.crumbleAt<0&&(h.crumbleAt=this.time));for(let o of this.sweepers)for(let u=0;u<(o.arms||1);u++){let d=o.angle+u*Math.PI/(o.arms||1),f=Math.cos(d)*o.len,m=Math.sin(d)*o.len,x=$t(((e.x-o.x)*f+(e.z-o.z)*m)/(f*f+m*m),-1,1),p=e.x-(o.x+f*x),g=e.z-(o.z+m*x),y=Math.hypot(p,g);if(y<at+.42&&e.y<o.y+.45&&e.y+Ln>o.y-.45){let b=Math.sign(x+1e-4)*(Math.sign(o.angle-(o.lastAngle??o.angle))||Math.sign(o.speed));this.hit(e,-Math.sin(d)*b*11+(y?p/y*4:0),6.5,Math.cos(d)*b*11+(y?g/y*4:0))}}for(let o of this.pendulums){let u=e.x-o.bx,d=e.y+Ln/2-o.by,f=e.z-o.bz,m=o.radius+at+.2;if(u*u+d*d+f*f<m*m){let x=Math.sign(Math.cos(Math.PI*2*this.time/o.period+o.phase))||1;this.hit(e,x*15,7,Math.sign(f)*2)}}for(let o of this.pushers){let u=o.wallX-o.reach*o.ext,d=Math.min(o.side*o.wallX,o.side*u),f=Math.max(o.side*o.wallX,o.side*u);o.ext>.05&&e.x+at>d&&e.x-at<f&&Math.abs(e.z-o.z)<o.d/2+at&&e.y<o.y+1.7&&e.y+Ln>o.y&&((o.ext>=o.lastExt||o.ext>.3)&&this.hit(e,-o.side*(o.ext>o.lastExt?15:9),6.5,(e.z-o.z)*2),e.x=o.side>0?Math.min(e.x,d-at):Math.max(e.x,f+at))}for(let o of this.portals)Math.hypot(e.x-o.x,e.z-o.z)<o.r&&Math.abs(e.y-o.y)<1.2&&(e.x=o.tx+(e.slot%3-1)*.8,e.y=o.ty+.1,e.z=o.tz,e.vx=e.vz=0,e.vy=0,e.ground=null,o.used=this.time,e.teleported=this.time,e.progress=Math.max(e.progress,e.z));for(let o of this.jets)if(o.state===2&&Math.hypot(e.x-o.x,e.z-o.z)<o.r+at*.6&&e.y<o.y+(o.kind==="fire"?2.4:1.6)){let u=e.x-o.x,d=e.z-o.z,f=Math.hypot(u,d)||1;this.hit(e,u/f*8,o.kind==="fire"?11:4,d/f*8-3)}for(let o of this.pads)e.ground&&Math.hypot(e.x-o.x,e.z-o.z)<o.r&&Math.abs(e.y-o.y)<.3&&(e.vy=15,e.vz=Math.max(e.vz,10.5),e.launched=!0,e.ground=null,e.coyote=0,o.fired=this.time);for(let o of this.fallers){if(this.time>o.impact+.25)continue;let u=e.x-o.x,d=e.y+Ln/2-o.y,f=e.z-o.z,m=o.r+at;if(u*u+d*d+f*f<m*m){let x=Math.hypot(u,f)||1;this.hit(e,u/x*9,8,f/x*9)}}for(let o of this.boulders){let u=e.x-o.x,d=e.y+Ln/2-o.y,f=e.z-o.z,m=o.radius+at;u*u+d*d+f*f<m*m&&this.hit(e,Math.sign(u)*4+o.vx*.6,6,o.vz>1?12:-12)}for(let o=this.checkpoints.length-1;o>=0;o--)if(e.z>=this.checkpoints[o]&&e.ground?.land){e.checkpoint=Math.max(e.checkpoint,o);break}e.y<this.deathY&&this.respawn(e),e.progress=Math.max(e.progress,e.z),e.z>=this.finishZ&&e.ground&&!e.finished&&(e.finished=!0,e.finishTime=this.time)}hit(e,t,n,i){e.stun>.25||(e.vx=t,e.vy=n,e.vz=i,e.stun=.55,e.ground=null,e.coyote=0)}respawn(e){e.hook=-1;let t=this.checkpoints[e.checkpoint]+.5;e.x=(e.slot%5-2)*1.4,e.y=this.spawnY(t)+1.5,e.z=t,e.vx=e.vy=e.vz=0,e.ground=null,e.falls++,e.stun=.3}think(e,t){e.botCool-=t;let n=(e.slot%5-2)*.9;e.ground?.driftAmp&&(n=(e.ground.x0+e.ground.x1)/2+e.ground.offX);for(let o of this.blocks)o.driftAmp&&o.z0>e.z&&o.z0-e.z<2.5&&(n=(o.x0+o.x1)/2+o.offX);for(let o of this.pads)o.z>e.z&&o.z-e.z<6&&(n=o.x);{let o=e.z+1.4,u=d=>!d.wall&&!d.gone&&!d.fake&&!d.cart&&o>=d.z0&&o<=d.z1&&d.bottom<gn(d,o)-.1;if(!this.blocks.some(d=>u(d)&&n>d.x0+d.offX+.35&&n<d.x1+d.offX-.35)){let d=n,f=1e9;for(let m of this.blocks)if(u(m)){let x=$t(e.x,m.x0+m.offX+.45,m.x1+m.offX-.45),p=Math.abs(x-e.x);p<f&&(f=p,d=x)}n=d}}for(let o of this.blocks){if(!o.wall||o.ghost||o.gone||o.z0-e.z>3.5||o.z1<e.z-.2||n<o.x0-at-.3||n>o.x1+at+.3)continue;let u=f=>this.blocks.some(m=>!m.wall&&!m.gone&&f>m.x0+.3&&f<m.x1-.3&&o.z0>=m.z0&&o.z0<=m.z1),d=[o.x0-at-.55,o.x1+at+.55].filter(u).sort((f,m)=>Math.abs(f-e.x)-Math.abs(m-e.x));d.length&&(n=d[0])}if(e.inX=$t((n-e.x)*.6,-1,1),e.inZ=1,e.ground&&!e.ground.cart||e.ground?.cart){let o=e.z+1.9,u=this.carts.filter(d=>o>=d.z0-.2&&o<=d.z1+.2&&e.ground!==d);if(u.length&&!this.blocks.some(d=>!d.cart&&!d.wall&&o>=d.z0&&o<=d.z1&&e.x>d.x0&&e.x<d.x1)){let d=u.find(f=>!f.gone&&e.x>f.x0+f.offX+.3&&e.x<f.x1+f.offX-.3&&Math.abs(f.offX+f.cart.speed*.35)<f.cart.len-2.5);d?e.inX=$t(((d.x0+d.x1)/2+d.offX-e.x)*1.5,-1,1):(e.inZ=e.ground?-.15:e.inZ,e.inX=e.ground?.cart?$t(((e.ground.x0+e.ground.x1)/2+e.ground.offX-e.x)*2,-1,1):e.inX)}}for(let o of this.mazePaths)if(e.x>o.box[0]-1&&e.x<o.box[1]+1&&e.z>o.box[2]&&e.z<o.box[3]){let u=0,d=1e9;o.path.forEach(([y,b],M)=>{let w=Math.hypot(y-e.x,b-e.z);w<d&&(d=w,u=M)});let[f,m]=o.path[Math.min(o.path.length-1,u+(d<1.1?1:0))],x=f-e.x,p=m-e.z,g=Math.hypot(x,p)||1;e.inX=x/g,e.inZ=p/g}for(let o of this.fakeWalls)if(e.z>o.z-3.5&&e.z<o.z+.2){let u=e;u.fwZ!==o.z&&(u.fwZ=o.z,u.try=Math.floor(Math.random()*o.slots.length),u.stuck=0);let d=o.slots[u.try%o.slots.length];e.inX=$t((d-e.x)*1.2,-1,1),e.inZ=Math.abs(d-e.x)<.6?1:.25,e.z>o.z-.9&&Math.abs(e.vz)<.5&&(u.stuck+=t,u.stuck>.35&&(u.try++,u.stuck=0));break}{let o=this.portals.filter(u=>u.kind!=="far"||!0).filter(u=>Math.abs(u.z-(e.z+4))<4.5&&Math.abs(u.z-e.z)<8&&u.z>e.z);if(o.length>=3&&!this.mazePaths.some(u=>e.z>u.box[2]&&e.z<u.box[3])){let u=o[(e.slot*7+Math.floor(this.time/9))%o.length];e.inX=$t((u.x-e.x)*.8,-1,1)}}let i=!1,s=!1,a=!1,c=e.z+1.3,l=e.ground?gn(e.ground,e.z):e.y;for(let o of this.blocks)o.gone||o.wall||e.x>=o.x0+o.offX&&e.x<=o.x1+o.offX&&c>=o.z0&&c<=o.z1&&(a=!0,gn(o,c)>l+.35&&(i=!0));let h=!1;if(!a&&!this.pads.some(o=>Math.abs(o.z-e.z)<2.5)){let o=e.z+.55;h=!this.blocks.some(m=>!m.wall&&!m.gone&&e.x>=m.x0+m.offX&&e.x<=m.x1+m.offX&&o>=m.z0&&o<=m.z1);let u=1e9,d=0;for(let m of this.blocks)!m.wall&&!m.gone&&!m.cart&&e.x>=m.x0+m.offX-.2&&e.x<=m.x1+m.offX+.2&&m.z0>e.z+.3&&m.z0<u&&(u=m.z0,d=m.z1);let f=u<1e9?(u+Math.min(d,u+4))/2:1e9;(h||!e.ground||f-e.z<=5.4)&&(i=!0)}for(let o of this.sweepers)for(let u=0;u<(o.arms||1);u++){let d=o.angle+u*Math.PI/(o.arms||1),f=Math.cos(d)*o.len,m=Math.sin(d)*o.len,x=$t(((e.x-o.x)*f+(e.z-o.z)*m)/(f*f+m*m),-1,1),p=o.y-l;Math.hypot(e.x-(o.x+f*x),e.z-(o.z+m*x))<1.7&&(p<1.5?i=!0:p<3.4&&(s=!0,e.vy>0&&(e.holdJump=!1)))}for(let o of this.boulders){let u=o.z-e.z,d=Math.abs(u)/Math.max(1,Math.abs(o.vz));(u>0?o.vz<0:o.vz>1)&&Math.abs(u)<3.2&&Math.abs(o.x+o.vx*d-e.x)<o.radius+.6&&(i=!0)}for(let o of this.jets)o.state>=1&&o.z>e.z&&o.z-e.z<2.2&&Math.abs(o.x-e.x)<o.r+.5&&(e.inZ=.1,e.inX=Math.sign(e.x-o.x||1));for(let o of this.fallers)!o.landed&&Math.abs(o.z-e.z-1.5)<2&&Math.abs(o.x-e.x)<o.r+.8&&(e.inX=Math.sign(e.x-o.x||1));i&&!(s&&a)&&e.ground&&e.botCool<=0&&(h||Math.random()<.55)&&(e.jump=!0,e.holdJump=!0,e.botCool=.35),e.ground&&!i&&(e.holdJump=!1)}},Jf=(r,e,t)=>r<e?Math.min(e,r+t):Math.max(e,r-t);var wi=["skeleton","dracula","pumpkin","voodoo","ghost","zombie","plague_doctor","puppeteer"],du={skeleton:"\u0421\u043A\u0435\u043B\u0435\u0442",dracula:"\u0414\u0440\u0430\u043A\u0443\u043B\u0430",pumpkin:"\u0422\u044B\u043A\u0432\u0430",voodoo:"\u0412\u0443\u0434\u0443",ghost:"\u041F\u0440\u0438\u0437\u0440\u0430\u043A",zombie:"\u0417\u043E\u043C\u0431\u0438",plague_doctor:"\u0427\u0443\u043C\u043D\u043E\u0439 \u0434\u043E\u043A\u0442\u043E\u0440",puppeteer:"\u041A\u0443\u043A\u043E\u043B\u044C\u043D\u0438\u043A"},ev=150,oi=3.5,ci=1/120,Ia=class{constructor(e,t,n=1,i){this.host=e;this.myChar=t;this.net=i,i&&(this.surv=new Gc(this));let s=new URLSearchParams(location.search),a=s.get("t"),c=a?hu[Number(a)-1]??(hu.includes(a)?a:""):"";this.course=new $c(n,i?i.seed:Number(s.get("seed"))||Math.random()*1e9|0,c),this.night=this.course.theme==="graveyard",this.crypt=this.course.theme==="crypt",this.manor=this.course.theme==="manor"||this.crypt,this.limit=this.crypt?210:ev;let l=matchMedia("(pointer:coarse)").matches;this.renderer=new Oc({antialias:!l||devicePixelRatio<2,powerPreference:"high-performance"}),this.pixelRatio=Math.min(devicePixelRatio,1.25),this.renderer.setPixelRatio(this.pixelRatio),this.renderer.outputColorSpace=_t,this.renderer.toneMapping=pa,this.renderer.toneMappingExposure=1.15,this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=l?ps:Wo,e.appendChild(this.renderer.domElement),this.hud=document.getElementById("hud"),addEventListener("resize",()=>this.resize()),this.resize(),this.input()}renderer;scene=new Gr;camera=new kt(55,1,.3,900);course;night;manor;crypt;limit;surv;runners=[];me;clock=0;acc=0;sun;fill;mist=[];pollen;puffs=[];grassMat;looks=new Map;blockMeshes=new Map;sweeperMeshes=[];cpArches=[];lastCp=0;pend=[];rams=[];padMeshes=[];warnPlanes=new Map;belts=[];composer;lastSection="";ghosts=[];lastTp=0;headless=new URLSearchParams(location.search).has("bot");hudT=0;phoneShadows=!1;frameNo=0;snd=new Kc;sndState={count:9,falls:0,stun:0,fin:!1,step:0,gates:new Map,hooks:new Map,jets:new Map,pads:new Map,crumbs:new Set};sunGlow;moonGlow;rays=[];ray=new fa;faded=new Set;soft=[];jetFx=[];mazeBlend=0;portalFx=[];boulderPool=[];gltf=new qc;texLoader=new Gi;cache=new Map;camTarget=new L;pixelRatio;frameAvg=16;last=0;blobs=new Map;dots=new Map;keys=new Set;stick={id:-1,ox:0,oy:0,x:0,y:0};hud;net;async load(e){let t=this.night||this.manor,n=this.manor,i=this.tex(t?"sky_night.jpg":"sky.jpg",!1);i.mapping=lr,this.scene.background=i;let s=new xr(this.renderer);this.scene.environment=s.fromEquirectangular(await sv(i)).texture,s.dispose(),this.scene.environmentIntensity=n?.3:t?.55:.75,this.scene.backgroundIntensity=t?.85:1,n&&(this.scene.background=new Ae(this.crypt?198149:263432)),this.scene.fog=this.crypt?new Ui(new Ae(.03,.05,.045),9,58):n?new Ui(new Ae(.025,.03,.05),10,70):t?new Ui(new Ae(.13,.18,.28),18,170):new Ui(new Ae(.74,.6,.56),45,330),this.scene.add(this.crypt?new Vi(4881e3,2233868,.8):n?new Vi(4610188,2365196,.5):t?new Vi(7375048,1316882,.55):new Vi(12568831,4010788,.35)),t&&(this.renderer.toneMappingExposure=n?1.3:1.2),this.sun=this.crypt?new Vn(9425080,1.3):n?new Vn(11125503,4.2):t?new Vn(11848959,2.4):new Vn(16759160,3.4),this.sun.castShadow=!this.crypt;let a=!matchMedia("(pointer:coarse)").matches;if(this.sun.shadow.mapSize.set(a?2048:1024,a?2048:1024),Object.assign(this.sun.shadow.camera,{left:-24,right:24,top:24,bottom:-24,near:1,far:140}),this.sun.shadow.bias=-5e-4,this.sun.shadow.normalBias=.04,this.scene.add(this.sun,this.sun.target),this.fill=new Vn(this.crypt?16754792:n?16757626:t?11057407:13161215,this.crypt?1.6:n?1.25:t?1.1:1.7),this.scene.add(this.fill,this.fill.target),this.atmosphere(),this.night){let y=new Gt(new Ut({map:Vt(!0),color:10469631,transparent:!0,opacity:.45,depthWrite:!1,blending:dt,fog:!1}));y.scale.set(200,200,1),this.moonGlow=y,this.scene.add(y)}if(!t){let y=new Gt(new Ut({map:Vt(!0),color:16756848,transparent:!0,opacity:.55,depthWrite:!1,blending:dt,fog:!1}));y.scale.set(260,160,1),y.userData.sun=!0,this.sunGlow=y,this.scene.add(y);for(let b=0;b<5;b++){let M=new Z(new ut(14+b*4,420),new tt({map:fv(),color:16763024,transparent:!0,opacity:.07,depthWrite:!1,blending:dt,fog:!1,side:Rt}));M.userData.k=b,this.rays.push(M),this.scene.add(M)}}let c={floor:this.mat("old_wooden_floor_02",2.5,!0),flag:this.mat("mossy_cobblestone",2.5,!1,9079434),wall:this.mat("castle_brick_07",3),beam:this.mat("medieval_wood",2,!0),cobble:this.mat("mossy_cobblestone",3,!1,this.night?15132912:16777215),brick:this.mat("mossy_brick",3,!0),dark:this.mat("dark_wooden_planks",2.2,!0),mud:this.mat("brown_mud_leaves_01",3,!1,14212296),grass:this.mat("leafy_grass",3.2,!1,12901514),rock:this.mat("rock_face_03",4,!0),plank:this.mat("brown_planks_05",2.2,!0),stone:this.mat("mossy_rock",3.2),bark:this.mat("bark_brown_02",1),ground:this.mat("forest_ground_04",6)};for(let y of this.course.blocks){let b={grass:c.grass,plank:c.plank,stone:c.stone,cobble:c.cobble,brick:c.brick,dark:c.dark,mud:c.mud,floor:c.floor,flag:c.flag}[y.mat],M=y.mat==="plank"?c.plank:y.mat==="dark"?c.dark:this.manor?y.mat==="floor"?c.beam:c.wall:this.night?c.brick:c.rock,w=b;if(y.conveyor){let _=b.clone();for(let v of["map","normalMap","roughnessMap"])_[v]&&(_[v]=_[v].clone(),_[v].needsUpdate=!0,this.belts.push(_[v]));w=_}if(y.wall&&(w=c.wall,M=c.wall),y.ghost){let _=c.wall.clone();_.transparent=!0,_.opacity=.92,_.emissive=new Ae(2817946),_.emissiveIntensity=0,w=_,M=_,this.ghosts.push(_)}if(y.crumbles&&!y.sink&&y.fake,y.mat!=="grass"&&!y.fake&&this.course.sections.some(_=>_.name==="falsebridge"&&y.z0>=_.z0&&y.z1<=_.z1)&&!y.land){let _=w.clone();_.color=new Ae(13819074),w=_}let S=new Z(tv(y),[w,y.wall?M:this.shaded(M)]);if(S.geometry.computeBoundingSphere(),y.wall&&(S.castShadow=!0),y.tilt){let _=(y.x0+y.x1)/2,v=(y.z0+y.z1)/2;S.geometry.translate(-_,-y.y0,-v),S.userData.pivot=[_,y.y0,v]}if((y.gear||y.cart)&&(S.visible=!1,S.userData.hidden=!0),y.crumbles&&!y.sink){let _=new Z(new ut(y.x1-y.x0-.1,y.z1-y.z0-.1).rotateX(-Math.PI/2),new tt({map:dv(),transparent:!0,opacity:0,depthWrite:!1,color:1182214}));_.position.set((y.x0+y.x1)/2,y.y0+.03,(y.z0+y.z1)/2),S.add(_),S.userData.crack=_}let T=this.manor?y.mat==="floor"?c.beam:c.wall:this.night?c.brick:y.mat==="grass"?null:y.mat==="plank"?c.bark:c.rock;if(T&&!y.trapPeriod&&!y.wall&&y.x1-y.x0>2&&y.y0===y.y1){let _=y.y0,v=.28,R=.2,C=(I,z,N,F)=>{let D=new Z(new ke(I,R,z),T);D.position.set(N,_-R/2+.07,F),D.castShadow=!1,D.receiveShadow=!0,S.add(D)};C(v,y.z1-y.z0,y.x0+v/2-.04,(y.z0+y.z1)/2),C(v,y.z1-y.z0,y.x1-v/2+.04,(y.z0+y.z1)/2),y.land||(C(y.x1-y.x0,v,(y.x0+y.x1)/2,y.z0+v/2-.04),C(y.x1-y.x0,v,(y.x0+y.x1)/2,y.z1-v/2+.04))}if(y.trapPeriod){let _=new Z(new ut(y.x1-y.x0-.1,y.z1-y.z0-.1).rotateX(-Math.PI/2),new tt({color:16722450,transparent:!0,opacity:.5,depthWrite:!1,blending:dt}));_.position.set((y.x0+y.x1)/2,y.y0+.03,(y.z0+y.z1)/2),_.visible=!1,this.scene.add(_),this.warnPlanes.set(y,_)}(y.mat==="grass"||y.mat==="mud")&&!(y.gear||y.cart||y.tilt||y.trapPeriod||y.wall||y.fake||y.driftAmp||y.x1-y.x0<6)&&this.grassOn(y),S.receiveShadow=!0,S.castShadow=y.mat==="plank"||y.crumbles,this.blockMeshes.set(y,S),this.scene.add(S)}if(!this.night){let y=new Z(new ut(520,540).rotateX(-Math.PI/2),c.ground);y.receiveShadow=!1,y.position.set(0,-34,150),nv(y.geometry,6,"xz"),this.scene.add(y)}let l=new Et(.42,.42,1,14,1);l.rotateZ(Math.PI/2);for(let y of this.course.sweepers){let b=new qe;for(let S=0;S<(y.arms||1);S++){let T=new Z(this.manor?new ke(1,.62,.62):l,this.manor?c.beam:this.night?c.dark:c.bark);T.scale.set(y.len*2,1,1),T.rotation.y=S*Math.PI/(y.arms||1),T.castShadow=!0,b.add(T)}this.sweeperMeshes.push(b),this.scene.add(b);let M=y.y-this.course.spawnY(y.z)+1.05,w=new Z(new Et(.55,.65,M,12),this.night?c.brick:c.bark);w.position.set(y.x,y.y+.5-M/2,y.z),w.castShadow=!0,this.scene.add(w)}let h=await this.model("env/boulder_01.glb");e(.15);let o=new Kt(.13,.035,6,12),u=Sn("rusty_metal_02",10132122,.3);for(let y of this.course.pendulums){let b=new qe;b.position.set(y.px,y.py,y.pz);let M=Math.round(y.len/.2),w=new Zt(o,u,M),S=new Fe,T=new Pt;for(let I=0;I<M;I++)T.setFromEuler(new hn(0,I%2?Math.PI/2:0,Math.PI/2)),S.compose(new L(0,-I*.2-.1,0),T,new L(1,1,1)),w.setMatrixAt(I,S);w.castShadow=!0,b.add(w);let _=this.manor?lv():this.night?rv():li(h.scene,y.radius*2.1,"max");_.position.y=-y.len,b.add(_),this.scene.add(b);let v=this.course.spawnY(y.pz),R=this.night?5.2:5.4;if(!this.manor)for(let I of[-1,1]){let z=new Z(this.night?new ke(.9,y.py-v,.9):new Et(.45,.5,y.py-v,10),this.night?c.brick:c.bark);z.position.set(I*R,(v+y.py)/2,y.pz),z.castShadow=!0,this.scene.add(z)}let C=new Z(l,this.manor?c.beam:this.night?c.dark:c.bark);C.scale.set(R*2+.8,.9,.9),C.position.set(0,y.py+.3,y.pz),C.castShadow=!0,this.scene.add(C),this.pend.push(b)}for(let y of this.course.pushers){let b=new qe,M=y.reach+1.4,w=new Z(new ke(M,1.5,y.d-.2),this.manor?c.beam:this.night?c.dark:c.bark);w.position.x=M/2-1,w.castShadow=!0;let S=new Z(new ke(.18,1.7,y.d),u);S.position.x=-1.02,b.add(w,S);for(let _=0;_<6;_++){let v=new Z(new Qn(.1,.35,8).rotateZ(Math.PI/2),u);v.position.set(-1.25,-.5+_%2*.9,-y.d/2+.4+Math.floor(_/2)*(y.d-.8)/2),b.add(v)}b.position.set(y.side*(y.wallX+1),y.y+.8,y.z),b.scale.x=y.side,b.userData.p=y,Ms(b),this.rams.push(b),this.scene.add(b);let T=new Z(new ke(1.2,2.6,y.d+.8),this.manor?c.wall:this.night?c.brick:c.rock);T.position.set(y.side*(y.wallX+.6),y.y+1.3,y.z),T.castShadow=!0,this.scene.add(T)}for(let y of this.course.portals){let b=new qe;b.position.set(y.x,y.y,y.z);let M=new Z(new Kt(1.25,.2,10,32),c.wall);M.position.y=1.35,M.castShadow=!0,b.add(M);let w=new Z(new In(1.1,40),new tt({map:uv(),color:7012296,transparent:!0,opacity:.85,depthWrite:!1,blending:dt,side:Rt}));w.position.y=1.35,b.add(w);let S=new Gt(new Ut({map:Vt(!0),color:4521904,transparent:!0,opacity:.7,depthWrite:!1,blending:dt}));S.scale.setScalar(4.2),S.position.y=1.35,b.add(S);let T=new Z(new In(1.8,24).rotateX(-Math.PI/2),new tt({map:Vt(!0),color:2817952,transparent:!0,opacity:.4,depthWrite:!1,blending:dt}));T.position.y=.04,b.add(T),b.userData.disc=w,this.portalFx.push(b),this.scene.add(b)}this.buildMech(c);for(let y of this.course.jets){let b=new qe;if(b.position.set(y.x,y.y,y.z),y.kind==="fire"){let M=Sn("metal_grate_rusty",16777215,.6).clone();M.emissive=new Ae(16726528),M.emissiveIntensity=0;let w=new Z(new Et(.75,.8,.08,20),M);w.position.y=.04,b.add(w);let S=new qe;for(let T=0;T<3;T++){let _=new Gt(new Ut({map:Vt(!0),color:T?16742938:16769162,transparent:!0,depthWrite:!1,blending:dt}));_.scale.set(1.6-T*.3,2.8-T*.5,1),_.position.y=1.2+T*.5,S.add(_)}b.add(S),this.jetFx.push({j:y,o:w,f:S})}else{let M=new qe,w=new Z(new Et(1.2,1.2,1.1,24),Sn("rusty_metal_02",10526880,.6));w.castShadow=!0;let S=new Z(new Et(.18,.18,8,10),Sn("metal_plate_02",10132122,.3));S.position.y=4.5,M.add(w,S);let T=new Z(new rr(1.3,1.5,32).rotateX(-Math.PI/2),new tt({color:16726554,transparent:!0,opacity:0,depthWrite:!1}));T.position.y=.04,b.add(M,T),this.jetFx.push({j:y,o:T,f:M})}this.scene.add(b)}for(let y of this.course.pads){let b=new Z(new Et(y.r,y.r*1.08,.22,32),Sn("rusty_metal_02",16777215,.5));b.position.set(y.x,y.y+.11,y.z),this.scene.add(b);let M=new Z(new In(y.r*.86,32).rotateX(-Math.PI/2),new $e({map:tp(),emissive:16757306,emissiveMap:tp(),emissiveIntensity:1.1,roughness:.5}));M.position.set(y.x,y.y+.23,y.z),this.padMeshes.push(M),this.scene.add(M)}this.boulderSrc=h.scene;let d=await this.model("env/wine_barrel_01.glb");for(let y=0;y<9;y++){let b=d?ov(li(d.scene,2.4,"max")):li(h.scene,2.4,"max");b.visible=!1,this.boulderPool.push(b),this.scene.add(b)}let f=this.course.spawnY(this.course.finishZ);for(let y of[-1,1]){let b=new Z(this.night||this.manor?new ke(1.3,7,1.3):new Et(.55,.6,7,12),this.night?c.brick:c.bark);b.position.set(y*7.5,f+3.5,this.course.finishZ),b.castShadow=!0,this.scene.add(b)}let m=new Z(l,c.bark);m.scale.set(16.5,1.1,1.1),m.position.set(0,f+7.1,this.course.finishZ),this.scene.add(m);let x=new Z(new ut(13,1.7),new $e({map:iv(this.manor?"\u0421\u0412\u041E\u0411\u041E\u0414\u0410":"\u0424\u0418\u041D\u0418\u0428"),side:Rt,roughness:.85}));x.position.set(0,f+6,this.course.finishZ),x.rotation.y=Math.PI,this.scene.add(x),this.checkpointArches(this.manor?c.beam:this.night?c.brick:c.bark);let p=this.scene.children.length;if(await(this.manor?this.decorateManor(c,e):this.night?this.decorateNight(c.stone,e):this.decorate(e)),this.buildGrass(),this.mergeStatic(p),e(.8),this.net){let y=this.net;for(let b=0;b<y.roster.length;b++){let M=y.roster[b],w=M.id===y.selfId&&!y.spectator,S=new Ra(M.id,w?"\u0412\u044B":M.name,wi.includes(M.char)?M.char:wi[b%wi.length],b,w&&new URLSearchParams(location.search).has("bot"));S.remote=!w,S.x=(b%4-1.5)*2.2,S.z=-1.5-Math.floor(b/4)*2.2,this.runners.push(S),e(.8+.2*(b+1)/y.roster.length)}await Promise.all(this.runners.map(b=>this.addLook(b))),this.me=this.runners.find(b=>!b.remote)??this.runners[0],y.spectator&&document.body.classList.add("spectator")}else{let y=wi.filter(M=>M!==this.myChar),b=[this.myChar,...y.sort(()=>Math.random()-.5).slice(0,5)];for(let M=0;M<b.length;M++){let w=new Ra("p"+M,M===0?"\u0412\u044B":du[b[M]],b[M],M,M>0);w.x=(M%3-1)*2.4,w.z=-1.5-Math.floor(M/3)*2.4,this.runners.push(w),e(.8+.2*(M+1)/b.length)}await Promise.all(this.runners.map(M=>this.addLook(M))),this.me=this.runners[0]}let g=Number(new URLSearchParams(location.search).get("z"));if(g)for(let y of this.runners)y.z=g+y.slot*.3,y.x=(y.slot%3-1)*1.5,y.y=this.course.spawnY(g)+.5,y.progress=g,y.checkpoint=this.course.checkpoints.filter(b=>b<=g).length-1;this.camTarget.set(this.me.x,this.me.y,this.me.z)}async addLook(e){let t=await this.model(`chars/${fu}/${e.character}.glb`),n=Xc(t.scene);n.traverse(l=>{let h=l;if(h.isMesh){h.castShadow=!0,h.frustumCulled=!1;let o=h.material;o.side=Rt,o.envMapIntensity=1.6,o.roughness=.6,o.emissive=new Ae(1,1,1),o.emissiveMap=o.map,o.emissiveIntensity=.15}});let i=new Z(new In(.55,24).rotateX(-Math.PI/2),new tt({map:Vt(!0),color:0,transparent:!0,opacity:.55,depthWrite:!1}));i.renderOrder=1,this.scene.add(i),this.blobs.set(e,i),this.scene.add(n);let s=new da(n),a={};for(let l of t.animations){let h=s.clipAction(l);a[l.name]=h,(l.name==="jump"||l.name==="stun")&&(h.setLoop(l.name==="stun"?Pc:Ic,1/0),h.clampWhenFinished=!0)}a.idle?.play();let c=document.createElement("div");c.className="tag"+((this.net?!e.remote:!e.bot)?" me":""),c.textContent=e.name,this.hud.appendChild(c),this.looks.set(e,{root:n,mixer:s,acts:a,cur:"idle",tag:c,squash:0,prevVy:0})}async decorate(e){let t=11,n=()=>(t=t*16807%2147483647)/2147483647,i={},s=(o,u,d,f,m,x=n()*Math.PI*2)=>(i[o]??=[]).push(new Fe().compose(new L(u,d,f),new Pt().setFromAxisAngle(new L(0,1,0),x),new L(m,m,m))),a=this.course.finishZ+30;for(let o=-40;o<a+40;o+=8+n()*7)for(let u of[-1,1])s(n()<.55?"fir_tree_01_c":"pine_tree_01_c",u*(34+n()*46),-34,o+n()*5,30+n()*14);for(let o=-60;o<a+120;o+=26+n()*18)for(let u of[-1,1])s("namaqualand_cliff_01",u*(170+n()*70),-46,o,55+n()*35);for(let o=0;o<6;o++)s("namaqualand_cliff_01",(n()-.5)*260,-46,a+200+n()*80,60+n()*40);for(let o of this.course.blocks){if(o.mat==="plank"||o.crumbles||o.gear||o.cart||o.tilt||o.trapPeriod||o.wall||o.fake||o.driftAmp||o.x1-o.x0<6)continue;let u=o.z1-o.z0;for(let d=0;d<u*.8;d++){let f=n()<.5?-1:1,m=f>0?o.x1-1-n()*1.3:o.x0+1+n()*1.3,x=o.z0+n()*u,p=gn(o,x),g=n();o.mat==="grass"&&g<.5?s("grass_medium_01",m,p,x,.7+n()*.5):g<.74?s("fern_02",m,p,x,.8+n()*.6):g<.88?s("rock_moss_set_01",m,p-.1,x,.8+n()*.7):g<.95?s("shrub_01",m,p,x,1.1+n()*.8):s("tree_stump_01",m,p,x,.9+n()*.4)}o.x1-o.x0>12&&u>14&&n()<.7&&s("boulder_01",n()<.5?o.x0+1.4:o.x1-1.4,gn(o,o.z0+u/2)-.3,o.z0+u/2,2.4);for(let d=0;d<0;d++){let f=o.z0+n()*u,m=n()<.5?-1:1;s("root_cluster_01",m>0?o.x1+.1:o.x0-.1,gn(o,f)-1.6,f,2.2,m>0?Math.PI/2:-Math.PI/2)}}let c=this.course.spawnY(this.course.finishZ);s("fir_tree_01_c",-9.5,c,this.course.finishZ+7,17),s("dead_tree_trunk",9.5,c,this.course.finishZ+6,3);let l=Object.keys(i),h=0;await Promise.all(l.map(async o=>{let u=await this.model(`env/${o}.glb`),d=/tree|grass|fern|shrub|cliff/.test(o)?"height":"max",f=li(u.scene,1,d);f.updateMatrixWorld(!0);let m=/cliff/.test(o)||/tree_01_c/.test(o);f.traverse(x=>{let p=x;if(!p.isMesh)return;let g=new Zt(p.geometry,p.material,i[o].length),y=p.matrixWorld.clone();i[o].forEach((M,w)=>g.setMatrixAt(w,M.clone().multiply(y))),g.castShadow=!m,g.receiveShadow=!m,g.computeBoundingSphere(),this.scene.add(g);let b=p.material;(b.alphaTest>0||b.transparent)&&(b.transparent=!1,b.alphaTest=.45,b.side=Rt)}),e(.15+.65*++h/l.length)}))}mech={gears:[],carts:[],gates:[],fans:[],hooks:[],chasers:[],tiltLamps:[],sweepLamps:[]};buildMech(e){let t=this.course,n=Sn("metal_plate_02",14211806,.35),i=Sn("rusty_metal_02",9079434,.5),s=Sn("rusty_metal_02",16777215,.6),a=()=>new $e({color:3344901,emissive:16722448,emissiveIntensity:0});for(let o of t.gears){let u=new qe;u.position.set(o.x,o.y,o.z);let d=new hs,f=o.teeth,m=o.r+.28,x=o.r-.05;for(let T=0;T<f*4;T++){let _=T/(f*4)*Math.PI*2,v=T%4===1||T%4===2?m:x,R=Math.cos(_)*v,C=Math.sin(_)*v;T===0?d.moveTo(R,C):d.lineTo(R,C)}let p=new Hi;p.absarc(0,0,o.r*.3,0,Math.PI*2,!0),d.holes.push(p);for(let[T,_]of o.gaps){let v=new Hi;v.moveTo(Math.cos(T)*o.r*.38,Math.sin(T)*o.r*.38),v.absarc(0,0,o.r*.93,T,_,!1),v.lineTo(Math.cos(_)*o.r*.38,Math.sin(_)*o.r*.38),v.absarc(0,0,o.r*.38,_,T,!0),d.holes.push(v)}let g=new sr(d,{depth:.55,bevelEnabled:!0,bevelSize:.05,bevelThickness:.05,bevelSegments:1,curveSegments:24});g.rotateX(Math.PI/2),g.translate(0,0,0);let y=new Z(g,n);y.castShadow=y.receiveShadow=!0;let b=new qe;b.add(y);let M=new Z(new Et(o.r*.32,o.r*.32,.62,24),i);M.position.y=-.27,b.add(M);for(let T=0;T<6;T++){let _=new Z(new Et(.09,.09,.1,8),s),v=T/6*Math.PI*2;_.position.set(Math.cos(v)*o.r*.22,.05,Math.sin(v)*o.r*.22),b.add(_)}let w=new Z(new ke(o.r*.55,.04,.18),new $e({color:14197306,metalness:.3,roughness:.6}));w.position.set(o.r*.62,.03,0),b.add(w),u.add(b);let S=new Z(new Et(.35,.45,14,12),i);S.position.y=-7.4,u.add(S),this.scene.add(u),this.mech.gears.push([o,b])}let c=new Map;for(let o of t.carts)c.set(o.cart.lane,o);for(let[,o]of c){let u=o.cart.len,d=(o.z0+o.z1)/2,f=o.y0;for(let x of[-.75,.75]){let p=new Z(new ke(u*2+4,.12,.1),n);p.position.set(0,f-.95,d+x),this.scene.add(p)}let m=new Zt(new ke(.25,.12,2.1),e.bark,Math.floor(u*2/.9));for(let x=0;x<m.count;x++)m.setMatrixAt(x,new Fe().setPosition(-u+x*.9,f-1.06,d));this.scene.add(m);for(let x of[-1,1]){let p=new qe,g=new Z(new ke(4.4,4.2,3.2),e.rock??i);g.position.set(x*(u+2.7),f+.6,d),p.add(g);let y=new Z(new ut(2.4,2.6),new tt({color:328707}));y.position.set(x*(u+.48),f+.1,d),y.rotation.y=-x*Math.PI/2,p.add(y);let b=new Z(new ke(.4,.4,3),e.bark);b.position.set(x*(u+.45),f+1.5,d),p.add(b),this.scene.add(p)}}for(let o of t.carts){let u=new qe,d=o.x1-o.x0,f=o.z1-o.z0,m=new Z(new ke(d,.9,f),s);m.position.y=-.45,m.castShadow=!0,u.add(m);let x=new Z(new ke(d-.2,.06,f-.2),Sn("metal_grate_rusty",16777215,.8));x.position.y=-.02,u.add(x);for(let b of[-1,1])for(let M of[-1,1]){let w=new Z(new ke(b?.12:d,.16,M?.12:f),i)}let p=new ke(d+.1,.12,.12),g=new Z(p,i),y=g.clone();g.position.set(0,.02,-f/2),y.position.set(0,.02,f/2),u.add(g,y);for(let b of[-.75,.75])for(let M of[-.75,.75]){let w=new Z(new Et(.26,.26,.14,14).rotateX(Math.PI/2),i);w.position.set(b*d/2.2,-.9,M),u.add(w)}u.position.set(0,o.y0,(o.z0+o.z1)/2),this.scene.add(u),this.mech.carts.push([o,u])}for(let o of t.gates){let u=new Z(new ke(o.halfW*2+2.4,.6,.8),i);u.position.set(0,o.y+4.2,o.z),this.scene.add(u);let d=a();for(let x of[-1,1]){let p=new Z(new dn(.18,12,8),d);p.position.set(x*(o.halfW+.6),o.y+3.6,o.z-.45),this.scene.add(p)}let f,m;if(o.kind==="slide"){let x=()=>{let p=new qe,g=new Z(new ke(o.halfW,3.6,.3),n);g.position.set(o.halfW/2,1.8,0),g.castShadow=!0,p.add(g);for(let b=0;b<4;b++){let M=new Z(new ke(o.halfW,.12,.36),i);M.position.set(o.halfW/2,.4+b*.95,0),p.add(M)}let y=new Z(new ke(.14,3.6,.4),new $e({color:14201402,metalness:.4,roughness:.5}));return y.position.set(o.halfW,1.8,0),p.add(y),Ms(p)};f=x(),m=x(),m.scale.x=-1,f.position.set(-o.halfW*2,o.y,o.z),m.position.set(o.halfW*2,o.y,o.z)}else{f=new qe;for(let x=0;x<9;x++){let p=new Z(new ke(.14,3.4,.14),n);p.position.set(-o.halfW+.2+x*(o.halfW*2-.4)/8,1.7,0),f.add(p);let g=new Z(new Qn(.12,.35,6).rotateX(Math.PI),n);g.position.set(p.position.x,-.15,0),f.add(g)}for(let x=0;x<3;x++){let p=new Z(new ke(o.halfW*2,.14,.18),i);p.position.y=.5+x*1.2,f.add(p)}Ms(f),f.position.set(0,o.y,o.z),m=new qe}this.scene.add(f,m),this.mech.gates.push([o,f,m,u,d])}for(let o of t.fans){let u=new qe;u.position.set(o.x,o.y,o.z),u.rotation.y=Math.atan2(o.dx,o.dz);let d=new Z(new Kt(1.25,.16,10,32),i);u.add(d);let f=new Z(new Kt(.6,.04,6,24),n);f.position.z=.2,u.add(f);let m=new qe;for(let S=0;S<5;S++){let T=new Z(new ke(.32,1.1,.05),n);T.position.y=.58,T.rotation.y=.5;let _=new qe;_.add(T),_.rotation.z=S/5*Math.PI*2,m.add(_)}m.add(new Z(new dn(.2,12,8),i)),Ms(m),u.add(m);let x=new Z(new ke(.4,o.y-this.course.spawnY(o.z)+4,.4),i);x.position.y=-(o.y-this.course.spawnY(o.z)+4)/2-1,u.add(x);let p=a(),g=new Z(new dn(.15,10,8),p);g.position.set(0,1.5,0),u.add(g);let y=70,b=new Float32Array(y*3);for(let S=0;S<y;S++)b[S*3]=(Math.random()-.5)*2*o.half,b[S*3+1]=(Math.random()-.3)*2,b[S*3+2]=Math.random()*o.reach;let M=new ot;M.setAttribute("position",new At(b,3));let w=new kn(M,new Cn({map:Vt(!0),size:.25,color:15262940,transparent:!0,opacity:.5,depthWrite:!1}));w.frustumCulled=!1,u.add(w),this.scene.add(u),this.mech.fans.push([o,m,p,w])}for(let o of t.hooks){let u=this.course.spawnY(o.z),d=new Z(new ke(1.2,8,1.2),i);d.position.set(o.pillarX+o.side*.4,o.y-3,o.z),this.scene.add(d);let f=a(),m=new Z(new dn(.2,10,8),f);m.position.set(o.pillarX-o.side*.3,o.y+1,o.z),this.scene.add(m);let x=new qe,p=new Z(new Et(.09,.09,.9,8).rotateZ(Math.PI/2),n);x.add(p);let g=new Z(new Kt(.38,.09,8,20,Math.PI*1.3),n);g.position.x=-.5,g.rotation.z=Math.PI*.35,x.add(g);let y=new Z(new Qn(.11,.3,8),n);y.position.set(-.5,.38,0),x.add(y),Ms(x),x.scale.x=o.side,this.scene.add(x);let b=new Z(new Et(.06,.06,1,6).rotateZ(Math.PI/2),i);this.scene.add(b),this.mech.hooks.push([o,x,b,f])}let l=new dn(1,32,24),h=l.getAttribute("position");for(let o=0;o<h.count;o++){let u=h.getX(o),d=h.getY(o),f=h.getZ(o),m=.96+.035*Math.sin(u*5+f*2)*Math.sin(d*6-f*3);h.setXYZ(o,u*m,d*m,f*m)}l.computeVertexNormals();for(let o of t.chasers){let u=new Z(l,e.rock);u.scale.setScalar(o.r),u.castShadow=!0;let d=new qe;if(d.add(u),this.scene.add(d),this.mech.chasers.push([o,d]),o.slot!==0)continue;let f=new $e({color:3940616,emissive:16753962,emissiveIntensity:.2}),m=new Z(new dn(.3,12,8),f);m.position.set(3.2,o.track.y1+3,o.track.z1-1),this.scene.add(m),this.stoneSignals.push({phase:o.phase,lamp:f});for(let x=0;x<5;x++){let p=o.track.z0+6+x*8,g=x%2?-1:1,y=new Z(new ke(.12,.12,2.4),new $e({color:12758374,emissive:7099938,emissiveIntensity:.4}));y.position.set(g*4.4,this.course.spawnY(p)+.12,p),this.scene.add(y)}}for(let o of t.tilts)if(o.tilt.axis==="xz"){let u=[];for(let[d,f]of[[o.x0,o.z0],[o.x1,o.z0],[o.x0,o.z1],[o.x1,o.z1]]){let m=a();u.push(m);let x=new Z(new Et(.08,.08,3,6),i);x.position.set(d*1.12,o.y0+1.5,f),this.scene.add(x);let p=new Z(new dn(.22,10,8),m);p.position.set(d*1.12,o.y0+3.1,f),this.scene.add(p)}this.mech.tiltLamps.push([o,u])}for(let o of t.sweepers)if(o.vary){let u=a(),d=new Z(new dn(.25,10,8),u);d.position.set(o.x,o.y+1.3,o.z),this.scene.add(d),this.mech.sweepLamps.push([o,u])}}columns=[];stoneSignals=[];syncMech(e){let t=this.course,n=t.time;for(let l of this.stoneSignals){let h=((n-l.phase)%2+2)%2;l.lamp.emissiveIntensity=h>1.55?1.5+Math.sin(n*35)*1.1:.12}for(let[l,h]of this.mech.gears)h.rotation.y=-l.angle;for(let[l,h]of this.mech.carts)h.position.x=l.offX,h.visible=Math.abs(l.offX)<l.cart.len+1.8;for(let[l,h,o,,u]of this.mech.gates)if(u.emissiveIntensity=l.warn?Math.sin(n*30)>0?3:.2:l.open<.5?1.2:0,l.kind==="slide"){let d=l.halfW*(1-l.open);h.position.x=-l.halfW-l.halfW+d,o.position.x=l.halfW+l.halfW-d}else h.position.y=l.y+3.2*l.open+.1;for(let[l,h,o,u]of this.mech.fans){h.rotation.z=l.spin,o.emissiveIntensity=l.on>.05?2.5:(n/l.period+l.phase)%1>.9&&Math.sin(n*25)>0?2:0,u.material.opacity=.55*l.on;let d=u.geometry.getAttribute("position");for(let f=0;f<d.count;f++){let m=d.getZ(f)+e*18*l.on;m>l.reach&&(m-=l.reach),d.setZ(f,m)}d.needsUpdate=!0}for(let[l,h,o,u]of this.mech.hooks){let d=l.pillarX-l.side*l.reach*l.ext;h.position.set(d,l.y,l.z),u.emissiveIntensity=l.state===1?Math.sin(n*28)>0?3:.2:0;let f=Math.abs(d-l.pillarX)+.01;o.scale.set(f,1,1),o.position.set((d+l.pillarX)/2,l.y,l.z),o.visible=l.ext>.02}for(let[l,h]of this.mech.chasers)h.visible=l.active,h.position.set(l.x,l.y+l.r,l.z),h.rotation.x=l.spin,h.rotation.y=0;for(let l of this.columns){let[h,o]=l.userData.col,[u,d]=h.path[o];h.active&&Math.hypot(h.x-u,h.z-d)<3&&(l.userData.fall=1),h.active||(l.userData.fall=0);let m=l.userData.fall?Math.min(1.4,(l.rotation.z?Math.abs(l.rotation.z):0)+e*2.5):Math.max(0,Math.abs(l.rotation.z)-e);l.rotation.z=m*(o%2?1:-1)}for(let[l,h]of this.mech.tiltLamps)for(let o of h)o.emissiveIntensity=l.tilt.warn?Math.sin(n*22)>0?3:.3:0;for(let[l,h]of this.mech.sweepLamps)h.emissiveIntensity=l.boost===1?3:l.boost?Math.sin(n*24)>0?2.5:.2:0;let i=this.me,s=this.sndState,a=(l,h)=>Math.hypot(l-i.x,h-i.z);i.falls>s.falls&&(s.falls=i.falls,this.snd.splash(),navigator.vibrate?.(40),this.puff(i.x,i.y,i.z,1.8),this.flash()),!i.ground&&Math.hypot(i.vx,i.vz)>4&&(s.trail=(s.trail||0)+e,s.trail>.05&&(s.trail=0,this.puff(i.x,i.y+.4,i.z,.35))),i.stun>.5&&s.stun<=.25&&(this.snd.hit(0),navigator.vibrate?.(35)),s.stun=i.stun,i.ground&&Math.hypot(i.vx,i.vz)>2&&(s.step+=e*Math.hypot(i.vx,i.vz),s.step>1.6&&(s.step=0,this.snd.step(i.ground.mat)));for(let l of t.gates)l.warn&&!s.gates.get(l)&&this.snd.alarm(a(0,l.z)),l.open<.05&&l.lastOpen>=.05&&this.snd.metal(a(0,l.z)),s.gates.set(l,l.warn);for(let l of t.hooks){let h=s.hooks.get(l)??0;l.state===1&&h!==1&&this.snd.alarm(a(l.pillarX,l.z)),l.state===2&&h!==2&&this.snd.chain(a(l.pillarX,l.z)),s.hooks.set(l,l.state)}for(let l of t.jets){let h=s.jets.get(l)??0;l.state===2&&h!==2&&(l.kind==="fire"?this.snd.fire(a(l.x,l.z)):this.snd.thud(a(l.x,l.z),.8)),s.jets.set(l,l.state)}for(let l of t.pads)l.fired!==(s.pads.get(l)??-9)&&(s.pads.set(l,l.fired),a(l.x,l.z)>1.5&&this.snd.whoosh(a(l.x,l.z)));for(let l of t.blocks)l.crumbleAt>=0&&!s.crumbs.has(l)?(s.crumbs.add(l),this.snd.crumble(a((l.x0+l.x1)/2,(l.z0+l.z1)/2))):l.crumbleAt<0&&s.crumbs.delete(l);for(let l of t.boulders)a(l.x,l.z)<14&&this.snd.roll(a(l.x,l.z));for(let l of t.chasers)l.active&&this.snd.roll(a(l.x,l.z)*.6);for(let l of t.sweepers){let h=a(l.x,l.z);if(h<l.len+2){let o=l.angle%Math.PI;Math.abs(o)<.08&&this.snd.whoosh(h*.5)}}let c=i.wind||0;for(let l of t.fans)l.on>.1&&a(l.x,l.z)<14&&(c=Math.max(c,l.on*.5));this.snd.tickAmbience(n,c)}start(){{let e=new Set;for(let t of this.looks.values())t.root.traverse(n=>e.add(n));this.scene.traverse(t=>{let n=t;n.isMesh&&!e.has(n)&&!n.isSkinnedMesh&&!n.userData.p&&(n.castShadow=!1)}),this.renderer.shadowMap.autoUpdate=!1,this.phoneShadows=!0}this.renderer.setAnimationLoop(e=>this.frame(e))}checkpointArches(e){let t=this.course.checkpoints.slice(1);for(let n of t){let i=6;for(let o of this.course.blocks)!o.crumbles&&!o.driftAmp&&n>=o.z0&&n<=o.z1&&(i=Math.min((o.x1-o.x0)/2-.5,7));let s=this.course.spawnY(n);for(let o of[-1,1]){let u=new Z(new Et(.18,.22,4.2,10),e);u.position.set(o*i,s+2.1,n),u.castShadow=!0,this.scene.add(u);let d=new Z(new dn(.28,12,8),new $e({color:2236440,emissive:16752704,emissiveIntensity:1.6}));d.position.set(o*i,s+4.35,n),this.scene.add(d);let f=new Gt(new Ut({map:Vt(!0),color:16752704,transparent:!0,opacity:.8,depthWrite:!1,blending:dt}));f.scale.setScalar(2.2),f.position.copy(d.position),this.scene.add(f)}let a=0,c=new Z(new ut(i*2-.6,.9),new $e({map:ep(),side:Rt,roughness:.8,emissive:0,emissiveMap:ep(),emissiveIntensity:.9}));c.position.set(0,s+3.7,n),c.rotation.y=Math.PI,this.scene.add(c),this.soft.push(c);let l=new Z(new Et(.04,.04,i*2,6).rotateZ(Math.PI/2),new $e({color:2760728}));l.position.set(0,s+4.2,n),this.scene.add(l),this.soft.push(l);let h=new Z(new ut(i*2,.7).rotateX(-Math.PI/2),new tt({color:7328767,transparent:!0,opacity:.4,depthWrite:!1,blending:dt}));h.position.set(0,s+.03,n),h.renderOrder=3,this.scene.add(h),this.cpArches.push({glow:h,flag:c,lit:!1})}}mergeStatic(e){let t=new Map,n=[];this.scene.updateMatrixWorld(!0);let i=l=>{let h=l.geometry.index?l.geometry.toNonIndexed():l.geometry.clone();h.applyMatrix4(l.matrixWorld);for(let d of Object.keys(h.attributes))["position","normal","uv"].includes(d)||h.deleteAttribute(d);h.attributes.normal||h.computeVertexNormals(),h.attributes.uv||h.setAttribute("uv",new Xe(new Float32Array(h.attributes.position.count*2),2));let o=l.material.uuid+(l.castShadow?"s":""),u=t.get(o);u||(u={mat:l.material,geos:[],shadow:l.castShadow},t.set(o,u)),u.geos.push(h)};for(let l of this.scene.children.slice(e)){if(l.isMesh||l.isSprite||l.isPoints||l.userData.sway!==void 0||l.userData.keep)continue;let h=[];l.traverse(u=>{let d=u;d!==l&&d.isMesh&&!d.isInstancedMesh&&!d.isSkinnedMesh&&!Array.isArray(d.material)&&h.push(d)});for(let u of h)i(u),u.parent.remove(u);let o=0;l.traverse(u=>{u!==l&&(u.isMesh||u.isSprite||u.isPoints)&&o++}),o||this.scene.remove(l)}for(let l of this.scene.children.slice(e)){let h=l;if(!h.isMesh||h.isInstancedMesh||Array.isArray(h.material)||h.userData.keep)continue;let o=h.geometry.index?h.geometry.toNonIndexed():h.geometry.clone();o.applyMatrix4(h.matrixWorld);let u=Object.keys(o.attributes).sort().join(",");for(let m of Object.keys(o.attributes))["position","normal","uv"].includes(m)||o.deleteAttribute(m);o.attributes.normal||o.computeVertexNormals(),o.attributes.uv||o.setAttribute("uv",new Xe(new Float32Array(o.attributes.position.count*2),2));let d=h.material.uuid+(h.castShadow?"s":""),f=t.get(d);f||(f={mat:h.material,geos:[],shadow:h.castShadow},t.set(d,f)),f.geos.push(o),n.push(h)}let s=l=>this.course.mazePaths.some(h=>l.z0>=h.box[2]-.5&&l.z1<=h.box[3]+.5);for(let[l,h]of[...this.blockMeshes]){if(l.driftAmp||l.liftAmp||l.crumbles||l.trapPeriod||l.gear||l.cart||l.tilt||l.ghost||l.fake||l.wall&&!s(l)||l.conveyor||h.userData.pivot)continue;h.updateMatrixWorld(!0);let o=h.geometry.index?h.geometry.toNonIndexed():h.geometry,u=h.material;for(let d of o.groups){let f=new ot;for(let g of["position","normal","uv"]){let y=o.getAttribute(g);f.setAttribute(g,new At(y.array.slice(d.start*y.itemSize,(d.start+d.count)*y.itemSize),y.itemSize))}f.applyMatrix4(h.matrixWorld);let m=u[d.materialIndex??0],x=m.uuid+(h.castShadow?"s":""),p=t.get(x);p||(p={mat:m,geos:[],shadow:h.castShadow},t.set(x,p)),p.geos.push(f)}for(let d of h.children){let f=d;if(!f.isMesh||h.userData.crack===f)continue;let m=f.geometry.index?f.geometry.toNonIndexed():f.geometry.clone();for(let g of Object.keys(m.attributes))["position","normal","uv"].includes(g)||m.deleteAttribute(g);m.applyMatrix4(f.matrixWorld);let x=f.material.uuid,p=t.get(x);p||(p={mat:f.material,geos:[],shadow:!1},t.set(x,p)),p.geos.push(m)}this.scene.remove(h),this.blockMeshes.delete(l)}for(let l of n)this.scene.remove(l);let a=new Map,c=new Set(this.flames);for(let l of[...this.scene.children]){let h=l;if(!h.isSprite||c.has(h)||h===this.sunGlow||h===this.moonGlow||h.userData.keep)continue;let o=h.material,u=o.color.getHexString()+Math.round(h.scale.x*4)+o.opacity.toFixed(2),d=a.get(u);d||(d={mat:o,pos:[],size:h.scale.x},a.set(u,d)),d.pos.push(h.position.x,h.position.y,h.position.z),this.scene.remove(h)}for(let{mat:l,pos:h,size:o}of a.values()){let u=new ot;u.setAttribute("position",new Xe(h,3));let d=new Cn({map:l.map,color:l.color,size:o*1,transparent:!0,opacity:l.opacity,depthWrite:!1,blending:l.blending,sizeAttenuation:!0}),f=new kn(u,d);f.frustumCulled=!1,this.scene.add(f)}for(let{mat:l,geos:h,shadow:o}of t.values()){let u=Nh(h,!1);if(!u)continue;let d=new Z(u,l);d.castShadow=o,d.receiveShadow=!0,this.scene.add(d)}}flash(){let e=document.getElementById("flash");e&&(e.classList.remove("on"),e.offsetWidth,e.classList.add("on"))}toast(e){let t=document.getElementById("toast");t&&(t.textContent=e,t.classList.remove("show"),t.offsetWidth,t.classList.add("show"))}async decorateManor(e,t){let n=this.course,i=31,s=()=>(i=i*16807%2147483647)/2147483647,a={},c=[],l=[],h=(v,R,C,I,z,N=s()*Math.PI*2)=>(a[v]??=[]).push(new Fe().compose(new L(R,C,I),new Pt().setFromAxisAngle(new L(0,1,0),N),new L(z,z,z))),o=(v,R=!0)=>(v.castShadow=R,v.receiveShadow=!0,this.scene.add(v),v),u=(v,R,C)=>{let I=new ut(v,R),z=I.getAttribute("uv");for(let N=0;N<z.count;N++)z.setXY(N,z.getX(N)*v/C,z.getY(N)*R/C);return I},d=new $e({color:1513243,metalness:.85,roughness:.45}),f=-1;for(let v of n.rooms){let R=v.z1-v.z0,C=(v.z0+v.z1)/2,I=v.y-8,z=v.h+8;for(let D of[-1,1]){let B=o(new Z(u(R,z,3),e.wall));B.position.set(D*v.halfW,I+z/2,C),B.rotation.y=-D*Math.PI/2;let X=o(new Z(u(R,1.3,2),e.beam),!1);X.position.set(D*(v.halfW-.03),v.y+.65,C),X.rotation.y=-D*Math.PI/2,o(new Z(new ke(.12,.14,R),e.beam),!1).position.set(D*(v.halfW-.06),v.y+1.32,C);let Y=o(new Z(new ut(R,1.2),gv()),!1);Y.rotation.set(-Math.PI/2,0,-D*Math.PI/2+Math.PI/2),Y.position.set(D*(v.halfW-.6),v.y+.02,C);for(let $=Math.ceil((v.z0+1)/8)*8;$<v.z1;$+=8)o(new Z(new ke(.5,v.h+1,.5),e.beam)).position.set(D*(v.halfW-.25),v.y+v.h/2-.5,$)}if(f>0&&f!==v.halfW)for(let D of[-1,1]){let B=Math.min(f,v.halfW),X=Math.max(f,v.halfW),k=o(new Z(u(X-B,z+4,3),e.wall));k.position.set(D*(B+X)/2,I+(z+4)/2,v.z0),f<v.halfW&&(k.rotation.y=Math.PI)}f=v.halfW;let N=v.y+v.h,F=v.z0;for(;F<v.z1;){let D=v.skylights&&Math.round(F)%8<3&&F+2.4<v.z1,B=D?2.4:Math.min(v.z1-F,5.6);if(D){for(let X=-v.halfW+.5;X<v.halfW;X+=.6)o(new Z(new ke(.07,.07,B),d)).position.set(X,N,F+B/2);l.push([0,N,F+B/2,v.halfW])}else{let X=o(new Z(u(v.halfW*2,B,2.5),e.beam));X.rotation.x=Math.PI/2,X.position.set(0,N+.05,F+B/2),o(new Z(new ke(v.halfW*2+2,.3,B),new tt({color:0}))).position.set(0,N+.4,F+B/2)}F+=B}for(let D=Math.ceil((v.z0+1)/8)*8;D<v.z1;D+=8)o(new Z(new ke(v.halfW*2,.45,.45),e.beam)).position.set(0,N-.25,D);if(this.crypt){for(let D=Math.ceil(v.z0/5)*5+2;D<v.z1-1;D+=5)for(let B of[-1,1]){let X=B*(v.halfW-.05);for(let k=0;k<3;k++){let Y=new Z(new ut(1.5,.78),this.niche);Y.position.set(X-B*.01,v.y+.9+k*.95,D),Y.rotation.y=-B*Math.PI/2,this.scene.add(Y);for(let $=0;$<3;$++)s()<.7&&this.skullAt.push(new L(X-B*.18,v.y+.78+k*.95,D-.45+$*.45))}if(Math.round(D/5)%2){let k=D+2.5,Y=new L(X-B*.25,v.y+2.6,k),$=new Z(new Et(.05,.04,.6,6),this.gold);$.position.copy(Y).add(new L(0,-.2,0)),$.rotation.z=B*.4,this.scene.add($);let ye=new Gt(new Ut({map:Vt(!0),color:16747050,transparent:!0,depthWrite:!1,blending:dt}));ye.scale.set(.5,.9,1),ye.position.copy(Y).add(new L(0,.25,0)),this.scene.add(ye),this.flames.push(ye);let Me=new Z(new In(3,24).rotateX(-Math.PI/2),new tt({map:Vt(!0),color:16742944,transparent:!0,opacity:.3,depthWrite:!1,blending:dt}));Me.position.set(X-B*1.6,v.y+.03,k),this.scene.add(Me)}}for(let D=0;D<(v.z1-v.z0)/6;D++){let B=new Z(new ut(1.6,1.6),this.web),X=s()<.5?-1:1;B.position.set(X*(v.halfW-.7),v.y+v.h-.7,v.z0+s()*(v.z1-v.z0)),B.rotation.set(0,X*.8,0),this.scene.add(B)}}else{for(let D=Math.ceil(v.z0/8)*8+4;D<v.z1-2;D+=8)for(let B of[-1,1]){if(s()<.25)continue;let X=wi[Math.floor(s()*wi.length)],k=new qe;k.position.set(B*(v.halfW-.06),v.y+3.1,D),k.rotation.y=-B*Math.PI/2;let Y=new Z(new ke(1.7,2.1,.12),this.gold),$=new Z(new ut(1.4,1.8),this.portrait(X));$.position.z=.075;let ye=new Z(new ut(1.45,1.85),this.canvasBg);ye.position.z=.065,k.add(Y,ye,$);let Me=new Z(new ke(.7,.14,.03),this.gold);Me.position.set(0,-1.2,.06),k.add(Me),this.scene.add(k)}for(let D=Math.ceil(v.z0/8)*8;D<v.z1;D+=8)for(let B of[-1,1]){let X=new Z(new ut(1.6,v.h-.6,6,1),this.drape);X.position.set(B*(v.halfW-.12),v.y+(v.h-.6)/2+.3,D+B*.9),X.rotation.y=-B*Math.PI/2;let k=X.geometry.getAttribute("position");for(let Y=0;Y<k.count;Y++)k.setZ(Y,Math.sin(k.getX(Y)*6)*.08);X.geometry.computeVertexNormals(),this.scene.add(X)}}for(let D=v.z0+3;D<v.z1-1;D+=7){let B=Math.round(D/7)%2?1:-1;h("caged_hanging_light",B*(v.halfW-.45),v.y+2.4,D,.55,B>0?-Math.PI/2:Math.PI/2),c.push(new L(B*(v.halfW-.5),v.y+2.45,D))}if(v.halfW>=6)for(let D=0;D<R/3.5;D++){let B=s()<.5?-1:1,X=B*(v.halfW-1.1-s()*.8),k=v.z0+1+s()*(R-2),Y=s();n.blocks.some($=>$.crumbles&&k>$.z0-1&&k<$.z1+1)||(Y<.3?h("wine_barrel_01",X,v.y,k,1.1):Y<.5?h("wooden_crate_01",X,v.y,k,.9+s()*.3):Y<.62?h("wooden_barrels_01",X,v.y,k,1.8):Y<.74?h("wooden_bucket_01",X,v.y,k,.45):Y<.86?h("wine_bottles_01",X,v.y,k,.5):(h("brass_candleholders",X,v.y,k,.6),c.push(new L(X,v.y+.65,k))))}}if(this.skullAt.length){let v=document.createElement("canvas");v.width=v.height=128;let R=v.getContext("2d");R.fillStyle="#c9bc9c",R.fillRect(0,0,128,128);let C=R.createRadialGradient(64,50,10,64,64,70);C.addColorStop(0,"rgba(255,250,230,.25)"),C.addColorStop(1,"rgba(60,45,30,.6)"),R.fillStyle=C,R.fillRect(0,0,128,128),R.fillStyle="#120a06";for(let k of[44,84])R.beginPath(),R.ellipse(k,60,14,17,0,0,7),R.fill();R.beginPath(),R.moveTo(64,74),R.lineTo(57,92),R.lineTo(71,92),R.fill();for(let k=0;k<6;k++)R.fillRect(42+k*8,104,5,12);let I=new Ft(v);I.colorSpace=_t;let z=new $e({map:I,roughness:.8}),N=new $e({color:12365452,roughness:.85}),F=new dn(.2,14,10).scale(1,.95,1.05),D=new ut(.3,.32).translate(0,-.02,.2).rotateY(0),B=new Zt(F,N,this.skullAt.length),X=new Zt(D,z,this.skullAt.length);this.skullAt.forEach((k,Y)=>{let $=new Fe().compose(k,new Pt().setFromEuler(new hn(0,(Math.random()-.5)*.4+(k.x>0?-Math.PI*.75:Math.PI*.75))),new L(1,1,1));B.setMatrixAt(Y,$),X.setMatrixAt(Y,$)}),B.computeBoundingSphere(),X.computeBoundingSphere(),this.scene.add(B,X)}let m=n.sweepers[0];if(m)for(let v=m.z-12;v<m.z+12;v+=2.2)for(let R of[-1,1])h("wooden_bookshelf_worn",R*10,m.y-.55,v,2.6,R>0?-Math.PI/2:Math.PI/2);let x=await this.model("env/lantern_chandelier_01.glb");this.chandelier=x.scene;for(let[v,R,C]of[[-5.5,2,4.2],[5,6,3.6],[-4.5,12,3.9],[5.5,16,4.4],[0,19,5.2],[-6.5,18,3.4]]){let I=np();I.position.set(v,C,R),I.rotation.y=s()*6,I.userData.sway=s()*6,this.scene.add(I),this.swingers.push(I),o(new Z(new Et(.04,.04,10-C-2.2,6),d),!1).position.set(v,C+2.2+(10-C-2.2)/2,R)}for(let[v,R,C]of[[-5.4,-2,0],[6,9,0]]){let I=np(!0);I.position.set(v,C,R),I.rotation.set(0,s()*6,.15),this.scene.add(I)}let p=n.fallZones[0];if(p)for(let v=p[2]+4;v<p[3];v+=9){let R=li(x.scene,2.4,"max");R.position.set(0,(n.rooms.find(C=>v>=C.z0&&v<=C.z1)?.y??0)+7.4,v),this.scene.add(R),c.push(R.position.clone().add(new L(0,-.3,0)))}let g=await this.model("env/large_castle_door.glb"),y=n.spawnY(n.finishZ),b=li(g.scene,7.5,"height");b.position.set(0,y,n.finishZ+8.6),b.rotation.y=Math.PI,this.scene.add(b);let M=new Gt(new Ut({map:Vt(!0),color:12177663,transparent:!0,opacity:.8,depthWrite:!1,blending:dt}));M.scale.set(14,10,1),M.position.set(0,y+3.6,n.finishZ+8),this.scene.add(M),t(.45);let w=Object.keys(a),S=0;await Promise.all(w.map(async v=>{let R=await this.model(`env/${v}.glb`),C=li(R.scene,1,/shelf|candle|light|bottles|bucket|barrels/.test(v)?"height":"max");C.updateMatrixWorld(!0),/shelf|light/.test(v)||(C.children[0].position.y+=0),C.traverse(I=>{let z=I;if(!z.isMesh)return;let N=new Zt(z.geometry,z.material,a[v].length),F=z.matrixWorld.clone();a[v].forEach((D,B)=>N.setMatrixAt(B,D.clone().multiply(F))),N.castShadow=!0,N.receiveShadow=!0,N.computeBoundingSphere(),this.scene.add(N)}),t(.45+.35*++S/w.length)}));let T=new Ut({map:Vt(!0),color:16751168,transparent:!0,opacity:.8,depthWrite:!1,blending:dt});for(let v of c){let R=new Gt(T);R.scale.setScalar(1.9),R.position.copy(v),this.scene.add(R),this.flames.push(R);let C=new Z(new In(2.6,24).rotateX(-Math.PI/2),xv());C.position.set(v.x,n.spawnY(v.z)+.03,v.z),this.scene.add(C)}let _=cv();for(let[v,R,C,I]of l)for(let N of[0,Math.PI/2]){let F=new Z(new ut(I*1.6,14),new tt({map:_,color:10467583,transparent:!0,opacity:.07,depthWrite:!1,blending:dt,side:Rt,fog:!1}));F.position.set(v-Ca.x*14/2,R-14/2,C-Ca.z*14/2),F.rotation.set(Math.atan2(Ca.z,Ca.y),N,0),this.scene.add(F)}t(.8)}swingers=[];skullAt=[];niche=new tt({color:394243});web=(()=>{let e=document.createElement("canvas");e.width=e.height=128;let t=e.getContext("2d");t.strokeStyle="rgba(230,230,230,.55)",t.lineWidth=1;for(let i=0;i<9;i++){let s=i/9*Math.PI/2;t.beginPath(),t.moveTo(0,0),t.lineTo(Math.cos(s)*128,Math.sin(s)*128),t.stroke()}for(let i=14;i<128;i+=14)t.beginPath(),t.arc(0,0,i,0,Math.PI/2),t.stroke();let n=new Ft(e);return new tt({map:n,transparent:!0,depthWrite:!1,side:Rt})})();gold=new $e({color:13211182,metalness:1,roughness:.35,envMapIntensity:1.6});drape=new $e({color:5901584,roughness:.85,side:Rt});canvasBg=new $e({color:2824724,roughness:.9});portraits=new Map;portrait(e){let t=this.portraits.get(e);if(!t){let n=this.texLoader.load(`portraits/${e}.png`);n.colorSpace=_t;let i=document.createElement("canvas");i.width=4,i.height=4,t=new $e({map:n,color:14207152,roughness:.7,transparent:!0,alphaTest:.05});let s=new $e({color:2757648});this.portraits.set(e,t)}return t}flames=[];async decorateNight(e,t){let n=23,i=()=>(n=n*16807%2147483647)/2147483647,s=this.course.finishZ+30,a=()=>new Fe,c=[],l=[],h=[],o=[],u=[],d=new Pt,f=new hn,m=new L,x=new L,p=(I,z,N,F,D,B,X=0)=>I.push(a().compose(m.set(z,N,F),d.setFromEuler(f.set(X,B,X*.6)),x.set(D,D,D)));for(let I=-20;I<s;I+=1.6+i()*1.6)for(let z of[-1,1]){let N=z*(8+i()*34);i()<.3||this.course.blocks.some(F=>N>F.x0-1.5&&N<F.x1+1.5&&I>F.z0-1.5&&I<F.z1+1.5)||p(i()<.7?c:l,N,-2.6,I,.9+i()*.6,(i()-.5)*.6,(i()-.5)*.35)}for(let I of this.course.blocks){if(I.crumbles||I.driftAmp||I.liftAmp||I.gear||I.cart||I.tilt||I.trapPeriod||I.wall||I.fake||I.driftAmp||I.x1-I.x0<6)continue;let z=I.z1-I.z0,N=I.x1-I.x0,F=gn(I,I.z0);if(N>=14)for(let D=0;D<z/3;D++){let B=i()<.5?-1:1,X=B>0?I.x1-.8-i()*1.2:I.x0+.8+i()*1.2;p(i()<.75?c:l,X,F,I.z0+i()*z,.7+i()*.4,(i()-.5)*.5,(i()-.5)*.25)}if(I.mat!=="mud")for(let D of[-1,1])for(let B=I.z0+.3;B<I.z1;B+=.45)i()<.92&&p(h,D>0?I.x1-.1:I.x0+.1,F,B,1,0,(i()-.5)*.12);for(let D=I.z0+3;D<I.z1-1;D+=11)for(let B of[-1,1])o.push(new L(B>0?I.x1-.45:I.x0+.45,F,D+(B>0?5:0)))}for(let I=-30;I<s+30;I+=6+i()*6)for(let z of[-1,1])p(u,z*(16+i()*45),-2.9,I,3.5+i()*2.5,i()*6);let g=uu([new ke(.8,1,.2).translate(0,.5,0),new Et(.4,.4,.2,18,1,!1,-Math.PI/2,Math.PI).rotateX(Math.PI/2).rotateZ(0).translate(0,1,0),new ke(1,.18,.32).translate(0,.09,0)]),y=uu([new ke(.16,1.5,.16).translate(0,.75,0),new ke(.8,.16,.16).translate(0,1.1,0)]),b=(I,z,N,F=!0)=>{if(!N.length)return;let D=new Zt(I,z,N.length);N.forEach((B,X)=>D.setMatrixAt(X,B)),D.castShadow=F,D.receiveShadow=!0,D.computeBoundingSphere(),this.scene.add(D)};b(g,e,c),b(y,e,l),b(new ke(.05,1.25,.05).translate(0,.62,0),new $e({color:1381658,metalness:.85,roughness:.4}),h,!1),t(.4);let M=await this.model("env/pine_tree_01_c.glb"),w=li(M.scene,1,"height");w.updateMatrixWorld(!0),w.traverse(I=>{let z=I;if(!z.isMesh)return;let N=z.material.clone();N.color=new Ae(3818576);let F=new Zt(z.geometry,N,u.length),D=z.matrixWorld.clone();u.forEach((B,X)=>{let k=B.clone(),Y=new L;k.decompose(new L,new Pt,Y),F.setMatrixAt(X,k.scale(new L(2.6,2.6,2.6)).multiply(D))}),F.computeBoundingSphere(),this.scene.add(F)});let S=new $e({color:1777190,roughness:1}),T=new tt({color:16752704,fog:!1});for(let I=0;I<9;I++){let z=I%2?1:-1,N=-10+I*(s/8),F=z*(100+i()*70),D=new qe;D.position.set(F,-3,N);let B=2+i()*2.5;D.scale.setScalar(B);let X=new Z(new ke(4,5,7),S);X.position.y=2.5,D.add(X);let k=new Z(new Qn(3.6,3,4).rotateY(Math.PI/4),S);if(k.scale.z=1.7,k.position.y=6.5,D.add(k),i()<.7){let Y=new Z(new ke(1.8,8,1.8),S);Y.position.set(0,4,-4),D.add(Y);let $=new Z(new Qn(1.4,4,4),S);$.position.set(0,10,-4),D.add($);let ye=new Z(new ke(.2,1.4,.2),S);ye.position.set(0,12.6,-4),D.add(ye);let Me=new Z(new ke(.8,.2,.2),S);Me.position.set(0,12.8,-4),D.add(Me)}for(let Y=0;Y<3;Y++)if(i()<.7){let $=new Z(new ut(.6,1.2),T);$.position.set(-z*2.02,2.6,-2+Y*2),$.rotation.y=-z*Math.PI/2,D.add($);let ye=new Gt(new Ut({map:Vt(!0),color:16748592,transparent:!0,opacity:.35,depthWrite:!1,blending:dt,fog:!1}));ye.scale.setScalar(3),ye.position.copy($.position),D.add(ye)}this.scene.add(D)}let _=new Et(.06,.08,2.2,8).translate(0,1.1,0),v=new ke(.32,.42,.32),R=new Zt(_,new $e({color:1184278,metalness:.8,roughness:.5}),o.length),C=new Zt(v,new $e({color:2365448,emissive:16751164,emissiveIntensity:2.2}),o.length);o.forEach((I,z)=>{R.setMatrixAt(z,a().setPosition(I)),C.setMatrixAt(z,a().setPosition(I.x,I.y+2.35,I.z));let N=new Gt(new Ut({map:Vt(!0),color:16751164,transparent:!0,opacity:.75,depthWrite:!1,blending:dt}));N.scale.setScalar(2.6),N.position.set(I.x,I.y+2.35,I.z),this.scene.add(N);let F=new Z(new In(2.2,24).rotateX(-Math.PI/2),new tt({map:Vt(!0),color:16747056,transparent:!0,opacity:.35,depthWrite:!1,blending:dt}));F.position.set(I.x,I.y+.03,I.z),this.scene.add(F)}),R.computeBoundingSphere(),C.computeBoundingSphere(),this.scene.add(R,C),t(.8)}chandelier;rocks=[];shake=0;boulderSrc;syncRocks(e){if(!this.boulderSrc)return;let t=n=>new tt({color:16726815,transparent:!0,opacity:n,depthWrite:!1,blending:dt,side:Rt});for(;this.rocks.length<this.course.fallers.length;){let n=this.manor&&this.chandelier?li(this.chandelier,2.2,"max"):this.night?av():li(this.boulderSrc,2,"max"),i=new Z(new rr(.82,1,40).rotateX(-Math.PI/2),t(.8)),s=new Z(new In(1,40).rotateX(-Math.PI/2),t(.25));i.add(s),i.renderOrder=3,this.scene.add(n,i),this.rocks.push({rock:n,ring:i,id:-1})}this.rocks.forEach((n,i)=>{let s=this.course.fallers[i];if(n.rock.visible=n.ring.visible=!!s,!s){n.id=-1;return}n.id!==s.id&&(n.id=s.id,n.rock.userData.done=!1,n.rock.rotation.set(Math.random()*6,Math.random()*6,0)),n.rock.position.set(s.x,s.y,s.z),n.rock.scale.setScalar(s.r),n.rock.rotation.x+=e*4;let a=Math.min(1,(this.course.time-s.spawn)/(s.impact-s.spawn));if(n.ring.visible=!s.landed,n.ring.position.set(s.x,s.g+.04,s.z),n.ring.scale.setScalar(s.r*(2.4-1.3*a)),n.ring.material.opacity=.35+.6*a*(.6+.4*Math.sin(this.course.time*30)),s.landed&&!n.rock.userData.done){n.rock.userData.done=!0,this.snd.thud(Math.hypot(s.x-this.me.x,s.z-this.me.z),1.2),this.night&&this.snd.fire(Math.hypot(s.x-this.me.x,s.z-this.me.z)),this.puff(s.x,s.g,s.z,2.2),this.puff(s.x,s.g,s.z,1.6);let c=Math.hypot(s.x-this.me.x,s.z-this.me.z);c<14&&(this.shake=Math.max(this.shake,.35*(1-c/14)),navigator.vibrate?.(c<5?30:0))}})}grassSpots=[];grassOn(e){let t=Math.abs(Math.floor(e.z0*131+e.x0*17))%2147483e3+7,n=()=>(t=t*16807%2147483647)/2147483647,i=(e.x1-e.x0)*(e.z1-e.z0),s=Math.floor(i*(matchMedia("(pointer:coarse)").matches?1.2:2.2)),a=new Pt,c=new hn,l=new L,h=new L;for(let o=0;o<s;o++){let u=e.x0+n()*(e.x1-e.x0),d=e.z0+n()*(e.z1-e.z0),f=Math.min(u-e.x0,e.x1-u);if(f>2.5&&n()<.35)continue;f<.45&&(u+=u<(e.x0+e.x1)/2?.45-f:f-.45);let m=.5+n()*.6+(f<1.5?.3:0);c.set(0,n()*Math.PI,0),a.setFromEuler(c),this.grassSpots.push(new Fe().compose(l.set(u,gn(e,d),d),a,h.set(m,m*(.8+n()*.5),m)))}}buildGrass(){let e=document.createElement("canvas");e.width=128,e.height=128;let t=e.getContext("2d");for(let h=0;h<46;h++){let o=4+Math.random()*120,u=(Math.random()-.5)*34,d=60+Math.random()*66,f=1.4+Math.random()*2.2,m=t.createLinearGradient(0,128,0,128-d);m.addColorStop(0,"#1f3310"),m.addColorStop(.55,"#5f8a2a"),m.addColorStop(1,"#c9d27a"),t.fillStyle=m,t.beginPath(),t.moveTo(o-f,128),t.quadraticCurveTo(o+u*.4,128-d*.6,o+u,128-d),t.quadraticCurveTo(o+u*.4+1,128-d*.6,o+f,128),t.fill()}let n=new Ft(e);n.colorSpace=_t;let i=h=>new ut(.75,.55).translate(0,.275,0).rotateY(h),s=uu([i(0),i(Math.PI/3),i(-Math.PI/3)]),a=new $e({map:n,alphaTest:.45,side:Rt,roughness:.9,envMapIntensity:.6});a.onBeforeCompile=h=>{h.uniforms.uTime={value:0},a.userData.shader=h,h.vertexShader=`uniform float uTime;
`+h.vertexShader.replace("#include <begin_vertex>",`#include <begin_vertex>
        vec4 wp = instanceMatrix * vec4(0.,0.,0.,1.); float sway = sin(uTime*1.7 + wp.x*.35 + wp.z*.27) * .12 + sin(uTime*3.1 + wp.z*.9) * .04;
        transformed.x += sway * uv.y * uv.y; transformed.z += sway * .6 * uv.y * uv.y;`),h.vertexShader=h.vertexShader.replace("#include <beginnormal_vertex>",`#include <beginnormal_vertex>
 objectNormal = vec3(0.,1.,0.);`)},this.grassMat=a;let c=new Zt(s,a,this.grassSpots.length),l=new Ae;this.grassSpots.forEach((h,o)=>{c.setMatrixAt(o,h),this.night?l.setHSL(.15+Math.random()*.05,.25,.32+Math.random()*.12):l.setHSL(.2+Math.random()*.07,.5,.5+Math.random()*.2),c.setColorAt(o,l)}),c.receiveShadow=!0,c.computeBoundingSphere(),this.scene.add(c)}atmosphere(){let e=document.createElement("canvas");e.width=e.height=256;let t=e.getContext("2d");for(let l=0;l<70;l++){let h=Math.random()*256,o=Math.random()*256,u=20+Math.random()*60,d=t.createRadialGradient(h,o,0,h,o,u);d.addColorStop(0,"rgba(255,240,230,.22)"),d.addColorStop(1,"rgba(255,240,230,0)"),t.fillStyle=d;for(let f of[-256,0,256])for(let m of[-256,0,256])t.save(),t.translate(f,m),t.fillRect(h-u,o-u,u*2,u*2),t.restore()}let n=new Ft(e);n.wrapS=n.wrapT=cn,n.repeat.set(5,5);for(let[l,h]of this.manor?[[-4,.35]]:this.night?[[-1.6,.35],[-.6,.22],[.6,.12]]:[[-9,.5],[-15,.65],[-22,.8],[-29,.9]]){let o=new Z(new ut(700,700).rotateX(-Math.PI/2),new tt({map:n.clone(),transparent:!0,opacity:h,depthWrite:!1,color:this.manor?6123414:this.night?10470616:15915208}));o.material.map.repeat.set(4+l*-.05,4),o.position.set(0,l,150),o.renderOrder=2,this.mist.push(o),this.scene.add(o)}if(this.manor){let l=new Z(new ut(60,700).rotateX(-Math.PI/2),new tt({color:65794}));l.position.set(0,-7,200),this.scene.add(l)}else if(this.night){let l=new Z(new ut(400,700).rotateX(-Math.PI/2),new $e({color:792340,metalness:.85,roughness:.18,envMapIntensity:1.1}));l.position.set(0,-2.5,200),this.scene.add(l)}let i=new Z(new ut(26,600).rotateX(-Math.PI/2),new $e({color:1911347,metalness:.9,roughness:.12,envMapIntensity:1.3}));i.position.set(-6,-33.6,150),this.night||this.scene.add(i);let s=matchMedia("(pointer:coarse)").matches?260:520,a=new Float32Array(s*3);for(let l=0;l<s;l++)a[l*3]=(Math.random()-.5)*40,a[l*3+1]=Math.random()*14,a[l*3+2]=Math.random()*50-10;let c=new ot;c.setAttribute("position",new At(a,3)),this.pollen=new kn(c,new Cn({map:Vt(),size:this.night?.16:.13,color:this.manor?12571391:this.night?13172602:16767392,transparent:!0,opacity:.85,depthWrite:!1,blending:dt})),this.pollen.frustumCulled=!1,this.scene.add(this.pollen)}animateAtmosphere(e){let t=this.course.time;this.mist.forEach((s,a)=>{let c=s.material.map;c.offset.x=t*(.004+a*.002),c.offset.y=t*.002*(a%2?1:-1)});let n=this.grassMat?.userData?.shader;n&&(n.uniforms.uTime.value=t),this.pollen.position.set(this.camTarget.x,this.camTarget.y-2,this.camTarget.z-10);let i=this.pollen.geometry.getAttribute("position");for(let s=0;s<i.count;s++){let a=i.getY(s)+e*(.15+s%7*.03);a>14&&(a=0),i.setY(s,a),i.setX(s,i.getX(s)+Math.sin(t*.6+s)*e*.2)}i.needsUpdate=!0;for(let s of this.puffs){if(s.t<0)continue;s.t+=e;let a=s.t/.7;if(a>=1){s.t=-1,s.s.visible=!1;continue}s.s.scale.setScalar(s.s.userData.size*(.5+a*1.4)),s.s.material.opacity=.55*(1-a),s.s.position.y+=e*.5}}puff(e,t,n,i){if(!this.puffs.length){let s=Vt(!0);for(let a=0;a<24;a++){let c=new Gt(new Ut({map:s,color:14271394,transparent:!0,depthWrite:!1}));c.visible=!1,this.scene.add(c),this.puffs.push({s:c,t:-1})}}for(let s=0;s<5;s++){let a=this.puffs.find(h=>h.t<0);if(!a)return;let c=Math.random()*Math.PI*2,l=.3+Math.random()*.4;a.t=0,a.s.visible=!0,a.s.position.set(e+Math.cos(c)*l,t+.15,n+Math.sin(c)*l),a.s.userData.size=i*(.6+Math.random()*.5)}}prevPos=new Map;frame(e){if(this.last&&e-this.last<11)return;let t=this.last?Math.min(.1,(e-this.last)/1e3):1/60;if(this.last=e,this.frameAvg+=(t*1e3-this.frameAvg)*.05,this.frameAvg>19&&this.pixelRatio>.75&&(this.pixelRatio=Math.max(.75,this.pixelRatio-.1),this.renderer.setPixelRatio(this.pixelRatio),this.frameAvg=16),this.readInput(),!this.net){this.localIntroStart<0&&(this.localIntroStart=e);let a=new URLSearchParams(location.search).get("introAt");this.intro(a!==null?Number(a):(e-this.localIntroStart)/1e3)}if(this.net){let a=oi+(this.net.serverNow()-this.net.startAt)/1e3;if(this.intro(a+this.rulesIntro.duration),(a<this.clock||this.clock<=0&&a<0)&&(this.clock=Math.min(a,0)),this.acc=Math.max(0,Math.min(8,a-this.clock)),this.acc>2)for(;this.acc>.2;)this.acc-=ci,this.clock+=ci,this.course.step(ci);this.netTick(t)}if(this.introT>=0&&!this.introSkipped){let a=this.course.time;this.course.time=this.introT,this.course.step(0),this.sync(t),this.course.time=a,this.phoneShadows&&(this.renderer.shadowMap.needsUpdate=!0),this.renderer.render(this.scene,this.camera);return}else this.acc+=t;let n=this.prevPos;for(;this.acc>=ci;){this.acc-=ci,this.clock+=ci;let a=this.clock>=oi&&!this.over();for(let c of this.runners)c.remote||n.set(c,[c.x,c.y,c.z]);this.course.step(ci);for(let c of this.runners)c.remote||(c.bot&&this.course.think(c,ci),(!a||this.clock<0)&&(c.inX=c.inZ=0,c.jump=!1),this.course.move(c,ci));for(let c=0;c<this.runners.length;c++)for(let l=c+1;l<this.runners.length;l++){let h=this.runners[c],o=this.runners[l];if(h.hook>=0||o.hook>=0)continue;let u=o.x-h.x,d=o.z-h.z,f=Math.hypot(u,d),m=at*1.9;if(f<m&&f>1e-4&&Math.abs(h.y-o.y)<1.2){let x=(m-f)/2;h.x-=u/f*x,h.z-=d/f*x,o.x+=u/f*x,o.z+=d/f*x}}}if(this.headless){if(this.hudT=(this.hudT||0)+t,this.hudT<1)return;this.hudT=0}this.phoneShadows&&(this.renderer.shadowMap.needsUpdate=(this.frameNo++&1)===0);let i=1-Math.min(1,this.acc/ci),s=[];for(let[a,[c,l,h]]of n)Math.abs(a.x-c)+Math.abs(a.y-l)+Math.abs(a.z-h)>2||(s.push([a,a.x,a.y,a.z]),a.x-=(a.x-c)*i,a.y-=(a.y-l)*i,a.z-=(a.z-h)*i);this.sync(t);for(let[a,c,l,h]of s)a.x=c,a.y=l,a.z=h;this.composer?this.composer.render():this.renderer.render(this.scene,this.camera),this.hudUpdate()}remote(e){let t=performance.now()/1e3;for(let n of this.runners){let i=e[n.id];if(!i||!n.remote)continue;let s=n,a=s.target;if(a&&(a[0]!==i[0]||a[2]!==i[2])){let c=Math.max(.05,t-(s.tAt??t-.2)),l=h=>Math.max(-9,Math.min(9,h));s.estVx=l((i[0]-a[0])/c),s.estVz=l((i[2]-a[2])/c),s.tAt=t}else a&&t-(s.tAt??t)>.5&&(s.estVx=0,s.estVz=0);s.target=i}}sendT=0;netTick(e){for(let i of this.runners){let s=i.target;if(!i.remote||!s)continue;let a=Math.min(1,e*10),c=i;i.vx=c.estVx??0,i.vz=c.estVz??0,Math.hypot(s[0]-i.x,s[2]-i.z)>6?(i.x=s[0],i.y=s[1],i.z=s[2]):(i.x+=(s[0]-i.x)*a,i.y+=(s[1]-i.y)*a,i.z+=(s[2]-i.z)*a),i.facing=s[3],i.stun=s[4]===3?.3:0,i.ground=s[4]===2?null:this.course.blocks[0],i.vy=0,s[4]===0&&(i.vx=0,i.vz=0),i.checkpoint=s[5],i.progress=s[6],s[7]&&!i.finished&&(i.finished=!0,i.finishTime=s[8]),i.falls=s[9]}if(this.net.spectator){if(!this.surv?.run){let i=this.standings()[0];i&&(this.me=i)}return}if(this.sendT-=e,this.sendT>0)return;this.sendT=.2;let t=this.me,n=t.stun>0?3:t.ground?Math.hypot(t.vx,t.vz)>.8?1:0:2;this.netSends=(this.netSends||0)+1,this.net.send([+t.x.toFixed(2),+t.y.toFixed(2),+t.z.toFixed(2),+t.facing.toFixed(2),n,t.checkpoint,+t.progress.toFixed(1),t.finished?1:0,+t.finishTime.toFixed(2),t.falls],this.netSends<6||this.surv?.run?.needCourse?{c:this.course.checkpoints.map(i=>+i.toFixed(2)),f:+this.course.finishZ.toFixed(2)}:void 0)}netSends=0;rulesIntro=new Wc(this);localIntroStart=-1;introT=-1;introSkipped=!1;intro(e){this.introT=this.rulesIntro.update(e,this.introSkipped)?e:-1}over(){return this.clock-oi>=this.limit?!0:this.runners.length>0&&this.runners.every(e=>e.finished)}timeLeft(){return Math.max(0,this.limit-Math.max(0,this.clock-oi))}standings(){return[...this.runners].sort((e,t)=>(e.finished?0:1)-(t.finished?0:1)||(e.finished?e.finishTime-t.finishTime:t.progress-e.progress))}sync(e){let t=this.course;for(let[x,p]of this.blockMeshes){let g=x.crumbleAt>=0?t.time-x.crumbleAt:-1,y=x.crumbles&&g>=0&&g<x.crumbleDelay?Math.sin(t.time*70)*.06*(g/x.crumbleDelay):0;if(p.userData.pivot){let[b,M,w]=p.userData.pivot;p.position.set(b+x.offX,M+x.offY,w),p.rotation.set(-Math.atan(x.tiltZ),0,Math.atan(x.tiltX))}else p.position.set(x.offX+y,x.offY,0);p.visible=!x.gone&&!p.userData.hidden,p.userData.crack&&(p.userData.crack.material.opacity=g>=0?Math.min(.9,g/x.crumbleDelay*1.2):0)}this.syncMech(e),t.sweepers.forEach((x,p)=>{let g=this.sweeperMeshes[p];g.position.set(x.x,x.y,x.z),g.rotation.y=-x.angle}),t.pendulums.forEach((x,p)=>{this.pend[p].rotation.z=x.swing});for(let x of this.rams){let p=x.userData.p;x.position.x=p.side*(p.wallX-p.reach*p.ext+1)}t.pads.forEach((x,p)=>{let g=Math.max(0,1-(t.time-x.fired)*4);this.padMeshes[p].position.y=x.y+.23+g*.25,this.padMeshes[p].material.emissiveIntensity=1+Math.sin(t.time*6)*.3+g*3});for(let[x,p]of this.warnPlanes)p.visible=x.warn&&!x.gone,p.material.opacity=.35+.35*Math.sin(t.time*28);for(let x of this.belts)x.offset.y=(x.offset.y+e*.9)%1;for(let{j:x,o:p,f:g}of this.jetFx)if(x.kind==="fire")g.visible=x.state===2,g.scale.y=.8+Math.random()*.4,p.material.emissiveIntensity=x.state===1?1+Math.sin(t.time*30):x.state===2?2:0;else{let y=x.state===2?.55:x.state===1?3.2:4.2;g.position.y+=(y-g.position.y)*Math.min(1,e*(x.state===2?30:4)),p.material.opacity=x.state===1?.5+.4*Math.sin(t.time*25):x.state===2?.8:0}for(let x of this.ghosts)x.emissiveIntensity=.025*Math.max(0,Math.sin(t.time*1.3))**8;this.portalFx.forEach((x,p)=>{x.userData.disc.rotation.z-=e*2.4;let g=t.portals[p];x.userData.disc.material.opacity=.7+.25*Math.sin(t.time*5+p)+(t.time-g.used<.4?.5:0)});let n=this.me.teleported;if(n&&n!==this.lastTp){this.lastTp=n,this.camTarget.set(this.me.x,this.me.y,this.me.z);let x=t.portals.find(p=>t.time-p.used<.1);this.snd.portal(),this.toast(x?.kind==="far"?"\u0414\u0410\u041B\u0415\u041A\u041E \u0412\u041F\u0415\u0420\u0401\u0414!":x?.kind==="back"?"\u041D\u0410\u0417\u0410\u0414!":"\u0422\u0415\u041B\u0415\u041F\u041E\u0420\u0422!"),this.puff(this.me.x,this.me.y,this.me.z,1.6)}let i=t.sectionAt(this.me.z);i&&i.name!==this.lastSection&&(this.lastSection=i.name,this.clock>oi+.5&&this.toast(jf[i.name].toUpperCase())),this.boulderPool.forEach((x,p)=>{let g=t.boulders[p];x.visible=!!g,g&&(x.position.set(g.x,g.y,g.z),x.rotation.order="YXZ",x.rotation.y+=(g.roll-x.rotation.y)*.25,x.rotation.x=g.spin,x.scale.setScalar(g.radius/1.2*x.userData.base))});for(let[x,p]of this.looks){let g=Math.hypot(x.vx,x.vz),y=x.stun>0?"stun":x.ground?g>.8?"run":"idle":"jump";y!==p.cur&&p.acts[y]&&(p.acts[y].reset().fadeIn(.06).play(),p.acts[p.cur]?.fadeOut(.06),p.cur=y),p.acts.run&&(p.acts.run.timeScale=Math.max(.6,g/5.5)),x===this.me&&x.ground&&p.prevVy<-4&&this.snd.land(Math.min(1,-p.prevVy/14)),x===this.me&&!x.ground&&p.prevVy<=.5&&x.vy>8&&(x.vy>12?this.snd.spring():this.snd.jump()),x.ground&&p.prevVy<-6&&(p.squash=Math.min(.3,-p.prevVy*.022),this.puff(x.x,x.y,x.z,Math.min(1.4,-p.prevVy/9))),!x.ground&&p.prevVy<=.5&&x.vy>8&&this.puff(x.x,x.y,x.z,.6),p.prevVy=x.vy,p.squash=Math.max(0,p.squash-e*2.2);let b=1-p.squash,M=1/Math.sqrt(b),w=x.character==="ghost"?.25+Math.sin(t.time*3+x.slot)*.08:0;p.root.position.set(x.x,x.y+w,x.z),p.root.scale.set(M,b,M);let T=x.facing-p.root.rotation.y;T=Math.atan2(Math.sin(T),Math.cos(T)),p.root.rotation.y+=T*Math.min(1,e*22),p.mixer.update(e);let _=this.blobs.get(x);if(_){let v=-99;for(let C of t.blocks)!C.gone&&x.x>=C.x0+C.offX&&x.x<=C.x1+C.offX&&x.z>=C.z0&&x.z<=C.z1&&gn(C,x.z)<=x.y+.05&&(v=Math.max(v,gn(C,x.z)));_.visible=v>-50;let R=x.y-v;_.position.set(x.x,v+.03,x.z),_.scale.setScalar(Math.max(.4,1-R*.12)),_.material.opacity=Math.max(.15,.55-R*.06)}}if(this.introT>=0&&!this.introSkipped){this.rulesIntro.camera(this.introT),this.sun.position.copy(this.camera.position).addScaledVector(Jc,70),this.sun.target.position.set(0,this.camera.position.y-3,this.camera.position.z+8),this.animateAtmosphere(e);return}let s=this.me,a=this.camera.aspect<1,c=Math.min(1,e*5);this.camTarget.x+=(s.x*.75-this.camTarget.x)*c,this.camTarget.z+=(s.z-this.camTarget.z)*c,this.camTarget.y+=(Math.max(s.y,-4)-this.camTarget.y)*Math.min(1,e*2.5);let l=this.manor?a?9:7.4:a?11:8.6,h=this.manor?a?6:4.4:a?7.2:5.4,o=this.course.mazePaths.some(x=>s.z>x.box[2]-2&&s.z<x.box[3])||this.course.fakeWalls.some(x=>s.z>x.z-6&&s.z<x.z+3);this.mazeBlend+=((o?1:0)-this.mazeBlend)*Math.min(1,e*2.5);let u=this.mazeBlend,d=l+(4.6-l)*u,f=h+(7.4-h)*u;if(this.camera.position.set(this.camTarget.x,this.camTarget.y+f,this.camTarget.z-d),this.manor){let x=this.camera.position.z,p=this.course.rooms.find(g=>x>=g.z0&&x<=g.z1)??this.course.rooms.find(g=>this.camTarget.z>=g.z0&&this.camTarget.z<=g.z1);if(p){let g=p.halfW-1.1;this.camera.position.x=Math.max(-g,Math.min(g,this.camera.position.x)),this.camera.position.y=Math.min(this.camera.position.y,p.y+p.h-.8+4*this.mazeBlend)}}this.camera.lookAt(this.camTarget.x,this.camTarget.y+1.3,this.camTarget.z+7);{let x=new L(s.x,s.y+1.1,s.z);for(let p of this.faded)p.material.forEach(y=>{y.opacity=Math.min(1,y.opacity+e*4),y.opacity>=1&&(y.transparent=!1)});for(let p=0;p<3;p++){let g=this.camera.position.clone().sub(x),y=g.length();g.normalize(),this.ray.set(x,g),this.ray.far=y;for(let T of this.soft){let _=Math.abs(T.position.z-s.z)<1?0:1,v=this.camera.position.z<T.position.z&&s.z>T.position.z-.5?.15:1,R=T.material;R.transparent=!0,R.opacity+=(v-R.opacity)*Math.min(1,e*8)}let b=[];for(let[T,_]of this.blockMeshes)_.visible&&Math.abs((T.z0+T.z1)/2-s.z)<30&&b.push(_);let M=this.ray.intersectObjects(b,!1)[0];if(!M)break;let w=M.object;if([...this.blockMeshes].find(([,T])=>T===w)?.[0]?.wall){if(w.material.__own||(w.material=w.material.map(T=>T.clone()),w.material.__own=!0),w.material.forEach(T=>{T.transparent=!0,T.opacity=.18,T.depthWrite=!1}),this.faded.add(w),b.splice(b.indexOf(w),1),this.ray.intersectObjects(b,!1),!this.ray.intersectObjects(b,!1).length)break;continue}this.camera.position.y+=2.5,this.camera.lookAt(s.x,s.y+1.2,s.z+5)}}this.sun.target.position.set(this.camTarget.x,this.camTarget.y,this.camTarget.z+8);let m=this.manor?Ca:this.night?Qf:Jc;if(this.sun.position.set(this.camTarget.x+m.x*70,this.camTarget.y+m.y*70,this.camTarget.z+8+m.z*70),this.fill.position.copy(this.camera.position),this.fill.target.position.set(this.camTarget.x,this.camTarget.y,this.camTarget.z),this.animateAtmosphere(e),this.syncRocks(e),this.surv&&this.net){let x=this.net.serverNow();this.surv.tick(e,x,(x-this.net.startAt)/1e3)}if(this.moonGlow&&this.moonGlow.position.copy(this.camera.position).addScaledVector(Qf,400),this.sunGlow){let x=this.camera.position.clone().addScaledVector(Jc,420);this.sunGlow.position.copy(x),this.rays.forEach((p,g)=>{p.position.copy(this.camera.position).addScaledVector(Jc,300),p.lookAt(this.camera.position),p.rotateZ(-.5+g*.25+Math.sin(this.course.time*.1+g)*.03),p.translateY(-120)})}for(let x of this.swingers)x.rotation.z=Math.sin(this.course.time*.8+x.userData.sway)*.05;if(this.flames.forEach((x,p)=>x.scale.setScalar(1.8+Math.sin(this.course.time*13+p*1.7)*.12+Math.sin(this.course.time*7.3+p)*.08)),this.me.checkpoint>this.lastCp){for(let x=this.lastCp+1;x<=this.me.checkpoint;x++){let p=this.cpArches[x-1];p&&!p.lit&&(p.lit=!0,p.flag.material.emissive.set(16757304),p.glow.material.color.set(16761941),this.toast("\u0427\u0415\u041A\u041F\u041E\u0418\u041D\u0422!"),this.snd.checkpoint(),this.puff(this.me.x,this.me.y,this.me.z,1.4),navigator.vibrate?.(20))}this.lastCp=this.me.checkpoint}for(let x of this.cpArches){let p=x.glow.material;p.opacity=(x.lit?.55:.35)+Math.sin(this.course.time*3)*.12}if(this.shake>0){this.shake=Math.max(0,this.shake-e*1.2);let x=this.shake*this.shake*1.4;this.camera.position.x+=(Math.random()-.5)*x,this.camera.position.y+=(Math.random()-.5)*x}}hudUpdate(){let e=innerWidth,t=innerHeight,n=new L,i=this.camera.position,s=[];for(let[p,g]of this.looks){let y=Math.hypot(p.x-i.x,p.y-i.y,p.z-i.z),b=p===this.me;if(n.set(p.x,p.y+Ln+.45,p.z).project(this.camera),n.z>=1||Math.abs(n.x)>1.05||Math.abs(n.y)>1.05||!b&&y>34){g.tag.style.display!=="none"&&(g.tag.style.display="none");continue}s.push({l:g,x:(n.x*.5+.5)*e,y:(-n.y*.5+.5)*t,d:y,me:b})}s.sort((p,g)=>(g.me?1:0)-(p.me?1:0)||p.d-g.d);let a=[];for(let p of s){let g=Math.max(.62,Math.min(1,14/p.d)),y=(p.l.tagW??=p.l.tag.offsetWidth||60)*g,b=22*g,M=[p.x-y/2,p.y-b,p.x+y/2,p.y];if(!p.me&&a.some(_=>M[0]<_[2]&&M[2]>_[0]&&M[1]<_[3]&&M[3]>_[1])){p.l.tag.style.display!=="none"&&(p.l.tag.style.display="none");continue}a.push(M),p.l.tag.style.display==="none"&&(p.l.tag.style.display="");let S=p.me?"1":(Math.round(Math.max(.35,Math.min(1,1.6-p.d/26))*10)/10).toString();p.l.tagO!==S&&(p.l.tagO=S,p.l.tag.style.opacity=S);let T=`translate(${Math.round(p.x)}px,${Math.round(p.y)}px) translate(-50%,-100%) scale(${g.toFixed(2)})`;p.l.tagT!==T&&(p.l.tagT=T,p.l.tag.style.transform=T)}let c=this.timeLeft();Mr("timer",`${Math.floor(c/60)}:${String(Math.floor(c%60)).padStart(2,"0")}`),document.getElementById("timer").classList.toggle("low",c<20&&this.clock>oi);let l=Math.ceil(oi-.5-this.clock);this.clock<oi+.3&&l!==this.sndState.count&&(this.sndState.count=l,l>=0&&l<=3&&this.snd.countdown(l<=0)),Mr("count",this.clock>=0&&this.clock<oi?l>0?String(l):"\u0412\u041F\u0415\u0420\u0401\u0414!":this.clock<0&&this.introSkipped?"\u0416\u0414\u0401\u041C \u0421\u0422\u0410\u0420\u0422\u0410\u2026":"");let h=this.standings(),o=h.indexOf(this.me)+1;if(Mr("place-n",String(o)),Mr("place-of",`/${h.length}`),document.getElementById("place").dataset.p=String(Math.min(o,4)),!this.dots.size){let p=document.getElementById("track");for(let g of this.runners){let y=document.createElement("i");y.className=g===this.me?"me":"",y.style.backgroundImage=`url(portraits/${g.character}.png)`,p.appendChild(y),this.dots.set(g,y)}}for(let[p,g]of this.dots){let y=p.finished?1:Math.min(1,Math.max(0,p.z/this.course.finishZ));g.style.left=`${y*100}%`,g.style.zIndex=p===this.me?"9":String(Math.round(y*8))}document.getElementById("fill").style.width=`${Math.min(1,Math.max(0,this.me.z/this.course.finishZ))*100}%`;let u=h.slice(0,3);u.includes(this.me)||u.push(this.me);let d=u.map(p=>`<li class="${p===this.me?"me":""}"><b>${h.indexOf(p)+1}</b><img src="portraits/${p.character}.png" alt="">${p.name}${p.finished?" \u2713":""}</li>`).join(""),f=document.getElementById("board");f.dataset.h!==d&&(f.dataset.h=d,f.innerHTML=d);let m=document.getElementById("results");if((this.surv?.run?this.surv.run.ended:this.me.finished||this.over())&&m.hidden){m.hidden=!1,this.snd.finish(this.me.finished&&h.indexOf(this.me)<3);let p=this.surv?.run,g=S=>{let T=p?.players[S.id];return T?T.status==="SAVED"?T.revived?"\u0432\u043E\u0441\u043A\u0440\u0435\u0441 \u0438 \u0432\u044B\u0436\u0438\u043B":"\u0432\u044B\u0436\u0438\u043B":T.status==="DEAD"?"\u043F\u043E\u0433\u0438\u0431":T.revived?"\u0432\u043E\u0441\u043A\u0440\u0435\u0441":"\u043F\u0440\u0438\u0437\u0440\u0430\u043A":""},y=S=>p?g(S):S.finished?(S.finishTime-oi).toFixed(1)+" \u0441":Math.round(Math.min(1,S.progress/this.course.finishZ)*100)+"%",b=S=>`portraits/${S.character}.png`,M=[h[1],h[0],h[2]];m.querySelector(".podium").innerHTML=M.map((S,T)=>S?`<div class="step s${[2,1,3][T]}${S===this.me?" me":""}"><img src="${b(S)}" alt=""><b>${S.name}</b><small>${y(S)}</small><div class="block">${[2,1,3][T]}</div></div>`:'<div class="step empty"></div>').join(""),m.querySelector("ol").innerHTML=h.slice(3).map((S,T)=>`<li class="${S===this.me?"me":""}"><em>${T+4}</em>${S.name}<span>${y(S)}${S.falls?` \xB7 \u043F\u0430\u0434\u0435\u043D\u0438\u0439 ${S.falls}`:""}</span></li>`).join("");let w=h.indexOf(this.me)+1;if(p){let S=_=>{let v=p.players[_.id];return v?.status==="SAVED"?0:v?.alive?1:v?.status==="DEAD"?2:3};m.querySelector(".podium").innerHTML=[...this.runners].sort((_,v)=>S(_)-S(v)).map(_=>{let v=p.players[_.id]??{};return`<div class="fate ${v.status==="SAVED"?"ok":v.status==="DEAD"?"dead":"ghost"}${_===this.me?" me":""}"><img src="${b(_)}" alt=""><b>${_.name}</b><small>${g(_)}</small></div>`}).join(""),m.querySelector("ol").innerHTML="";let T=p.players[this.me.id];Mr("verdict",this.net?.spectator?"\u0418\u0422\u041E\u0413\u0418 \u0418\u0421\u041F\u042B\u0422\u0410\u041D\u0418\u042F":T?.status==="SAVED"?"\u0422\u042B \u0412\u042B\u0416\u0418\u041B!":T?.alive===!1?"\u0422\u042B \u041F\u0420\u0418\u0417\u0420\u0410\u041A":"\u0418\u0422\u041E\u0413\u0418"),(T?.status==="SAVED"||this.net?.spectator)&&sp(),document.body.classList.add("done");return}Mr("verdict",this.net?.spectator?"\u0418\u0422\u041E\u0413\u0418 \u0417\u0410\u0411\u0415\u0413\u0410":this.me.finished?w===1?"\u041F\u041E\u0411\u0415\u0414\u0410!":`\u0424\u0418\u041D\u0418\u0428 \xB7 ${w} \u041C\u0415\u0421\u0422\u041E`:"\u0412\u0420\u0415\u041C\u042F \u0412\u042B\u0428\u041B\u041E"),document.body.classList.add("done"),(w<=3||this.net?.spectator)&&sp()}}input(){let e=()=>{this.snd.unlock(),this.snd.ambience(this.course.theme),this.snd.playMusic("audio/music.m4a")},t=document.getElementById("mute");if(t){let h=!1;try{h=localStorage.getItem("race-mute")==="1"}catch{}this.snd.setMuted(h),t.textContent=h?"\u{1F507}":"\u{1F50A}",t.addEventListener("pointerdown",o=>{o.stopPropagation(),h=!h,this.snd.setMuted(h),t.textContent=h?"\u{1F507}":"\u{1F50A}";try{localStorage.setItem("race-mute",h?"1":"0")}catch{}})}addEventListener("pointerdown",e),addEventListener("keydown",e),addEventListener("keydown",h=>{this.net?.spectator&&/^Digit[0-9]$/.test(h.code)&&this.surv?.key(h.code.slice(5)),this.keys.add(h.code),h.code==="Space"&&(this.me&&(this.me.jump=!0),h.preventDefault())}),addEventListener("keyup",h=>this.keys.delete(h.code));let n=document.getElementById("stick-zone"),i=document.getElementById("knob"),s=document.getElementById("stick"),a=document.getElementById("jump");n.addEventListener("pointerdown",h=>{this.stick={id:h.pointerId,ox:h.clientX,oy:h.clientY,x:0,y:0},s.style.display="block",s.style.left=h.clientX+"px",s.style.top=h.clientY+"px",i.style.transform="",n.setPointerCapture(h.pointerId)}),n.addEventListener("pointermove",h=>{if(h.pointerId!==this.stick.id)return;let o=h.clientX-this.stick.ox,u=h.clientY-this.stick.oy,d=Math.hypot(o,u),f=56;d>f&&(o*=f/d,u*=f/d),this.stick.x=o/f,this.stick.y=u/f,i.style.transform=`translate(${o}px,${u}px)`});let c=h=>{h.pointerId===this.stick.id&&(this.stick.id=-1,this.stick.x=this.stick.y=0,s.style.display="none")};n.addEventListener("pointerup",c),n.addEventListener("pointercancel",c),a.addEventListener("pointerdown",h=>{h.preventDefault(),this.me&&(this.me.jump=!0,this.me.holdJump=!0),a.classList.add("down"),navigator.vibrate?.(8)});let l=()=>{this.me&&(this.me.holdJump=!1),a.classList.remove("down")};a.addEventListener("pointerup",l),a.addEventListener("pointercancel",l)}readInput(){if(!this.me)return;let e=this.keys,t=(e.has("KeyA")||e.has("ArrowLeft")?1:0)-(e.has("KeyD")||e.has("ArrowRight")?1:0),n=(e.has("KeyW")||e.has("ArrowUp")?1:0)-(e.has("KeyS")||e.has("ArrowDown")?1:0);this.stick.id>=0&&(t=-this.stick.x,n=-this.stick.y),this.me.inX=t,this.me.inZ=n,e.has("Space")?this.me.holdJump=!0:this.stick.id<0&&!document.getElementById("jump").classList.contains("down")&&(this.me.holdJump=!1)}resize(){let e=innerWidth,t=innerHeight;this.renderer.setSize(e,t),this.composer?.setSize(e,t),this.camera.aspect=e/t,this.camera.fov=e<t?70:58,this.camera.updateProjectionMatrix()}model(e){let t=this.cache.get(e);return t||(t=this.gltf.loadAsync(e),this.cache.set(e,t)),t}tex(e,t=!0,n=!0){let i=this.texLoader.load(e);return n&&(i.colorSpace=_t),t&&(i.wrapS=i.wrapT=cn),i.anisotropy=4,i}shadedCache=new Map;shaded(e){let t=this.shadedCache.get(e);return t||(t=e.clone(),t.vertexColors=!0,this.shadedCache.set(e,t)),t}mat(e,t,n=!1,i=16777215){let s=this.tex(`tex/${e}/arm.jpg`,!0,!1);return new $e({map:this.tex(`tex/${e}/diffuse.jpg`),normalMap:this.tex(`tex/${e}/nor_gl.jpg`,!0,!1),roughnessMap:s,roughness:1,metalness:0,vertexColors:!1,envMapIntensity:.8,color:i})}};function tv(r){let e=[],t=[],n=r.mat==="plank"?2.2:3.2,i=4,{x0:s,x1:a,z0:c,z1:l,y0:h,y1:o,bottom:u}=r,d=Math.max(.01,Math.max(h,o)-u),f=w=>r.mat==="plank"?1:.18+.82*Math.pow(Math.max(0,Math.min(1,(w-u)/d)),2.2),m=(w,S,T,_,v,R=!0)=>{for(let C of S)w.push([C[0],C[1],C[2],T[0],T[1],T[2],v==="xz"?C[0]/_:v==="zy"?C[2]/_:C[0]/_,v==="xz"?C[2]/_:C[1]/_,R?1:f(C[1])])},x=1,p=-(o-h)/(l-c),g=Math.hypot(x,p);m(e,[[s,h,c],[s,o,l],[a,o,l],[a,h,c]],[0,x/g,p/g],n,"xz"),m(t,[[s,u,c],[s,h,c],[a,h,c],[a,u,c]],[0,0,-1],i,"xy",!1),m(t,[[a,u,l],[a,o,l],[s,o,l],[s,u,l]],[0,0,1],i,"xy",!1),m(t,[[s,u,l],[s,o,l],[s,h,c],[s,u,c]],[-1,0,0],i,"zy",!1),m(t,[[a,u,c],[a,h,c],[a,o,l],[a,u,l]],[1,0,0],i,"zy",!1),(r.mat==="plank"||r.crumbles)&&m(t,[[s,u,c],[a,u,c],[a,u,l],[s,u,l]],[0,-1,0],i,"xz",!1),r.mat==="grass"&&(m(e,[[s-.03,h-.32,c-.03],[s-.03,h,c-.03],[a+.03,h,c-.03],[a+.03,h-.32,c-.03]],[0,0,-1],n,"xy"),m(e,[[s-.03,o-.32,l+.03],[s-.03,h-.32,c-.03],[s-.03,h,c-.03],[s-.03,o,l+.03]].map((T,_)=>T)&&[[s-.03,h-.32,l+.03],[s-.03,o,l+.03],[s-.03,h,c-.03],[s-.03,h-.32,c-.03]],[-1,0,0],n,"zy"),m(e,[[a+.03,h-.32,c-.03],[a+.03,h,c-.03],[a+.03,o,l+.03],[a+.03,o-.32,l+.03]],[1,0,0],n,"zy"));let y=[...e,...t],b=new ot,M=[];for(let w=0;w<y.length/4;w++){let S=w*4;M.push(S,S+1,S+2,S,S+2,S+3)}return b.setAttribute("position",new Xe(y.flatMap(w=>w.slice(0,3)),3)),b.setAttribute("normal",new Xe(y.flatMap(w=>w.slice(3,6)),3)),b.setAttribute("uv",new Xe(y.flatMap(w=>w.slice(6,8)),2)),b.setAttribute("color",new Xe(y.flatMap(w=>[w[8],w[8],w[8]]),3)),b.setIndex(M),b.addGroup(0,e.length/4*6,0),b.addGroup(e.length/4*6,t.length/4*6,1),b}function nv(r,e,t){let n=r.getAttribute("position"),i=r.getAttribute("uv");for(let s=0;s<n.count;s++)i.setXY(s,n.getX(s)/e,n.getZ(s)/e);i.needsUpdate=!0}function li(r,e,t){let n=new rn().setFromObject(r),i=new L;n.getSize(i);let s=e/Math.max(.001,t==="height"?i.y:Math.max(i.x,i.y,i.z)),a=r.clone(!0);a.position.set(-(n.min.x+n.max.x)/2*s,t==="height"?-n.min.y*s:-(n.min.y+n.max.y)/2*s,-(n.min.z+n.max.z)/2*s),a.scale.setScalar(s);let c=new qe;return c.add(a),c.userData.base=1,a.traverse(l=>{l.isMesh&&(l.castShadow=!0,l.receiveShadow=!0)}),c}function iv(r="\u0424\u0418\u041D\u0418\u0428"){let e=document.createElement("canvas");e.width=1024,e.height=136;let t=e.getContext("2d");t.fillStyle="#7a0f0b",t.fillRect(0,0,1024,136);for(let i=0;i<32;i++)t.fillStyle=i%2?"#f2eadc":"#111",t.fillRect(i*32,0,32,16),t.fillStyle=i%2?"#111":"#f2eadc",t.fillRect(i*32,120,32,16);t.fillStyle="#f6e7c8",t.font="bold 76px Georgia, serif",t.textAlign="center",t.textBaseline="middle",t.fillText(r,512,70);let n=new Ft(e);return n.colorSpace=_t,n}function Mr(r,e){let t=document.getElementById(r);t&&t.textContent!==e&&(t.textContent=e)}var Jc=new L(.31,.32,.9).normalize();function sv(r){return new Promise(e=>{if(r.image?.complete)e(r);else{let t=r.image,n=()=>r.image?.complete?e(r):setTimeout(n,30);n()}})}function Vt(r=!1){let e=document.createElement("canvas");e.width=e.height=64;let t=e.getContext("2d"),n=t.createRadialGradient(32,32,0,32,32,32);return n.addColorStop(0,"rgba(255,255,255,1)"),n.addColorStop(r?.5:.25,`rgba(255,255,255,${r?.45:.5})`),n.addColorStop(1,"rgba(255,255,255,0)"),t.fillStyle=n,t.fillRect(0,0,64,64),new Ft(e)}function uu(r){let e=[],t=[],n=[],i=[],s=0;for(let c of r){let l=c.getAttribute("position"),h=c.getAttribute("normal"),o=c.getAttribute("uv"),u=c.getIndex();for(let d=0;d<l.count;d++)e.push(l.getX(d),l.getY(d),l.getZ(d)),t.push(h.getX(d),h.getY(d),h.getZ(d)),n.push(o.getX(d),o.getY(d));for(let d=0;d<u.count;d++)i.push(u.getX(d)+s);s+=l.count}let a=new ot;return a.setAttribute("position",new Xe(e,3)),a.setAttribute("normal",new Xe(t,3)),a.setAttribute("uv",new Xe(n,2)),a.setIndex(i),a}var Qf=new L(.81,.3,.59).normalize();function rv(){let r=new hs;r.moveTo(-1.6,0),r.quadraticCurveTo(0,-1.25,1.6,0),r.quadraticCurveTo(0,-.55,-1.6,0);let e=new sr(r,{depth:.06,bevelEnabled:!0,bevelThickness:.02,bevelSize:.03,bevelSegments:1,curveSegments:18});e.translate(0,.1,-.03);let t=new Z(e,Sn("metal_plate_02",13620184,.5)),n=new Z(new ke(.5,.5,.3),new $e({color:2761760,metalness:.6,roughness:.6}));n.position.y=.25;let i=new qe;return i.add(t,n),t.castShadow=!0,i.userData.base=1,i}function av(){let r=new qe,e=new Z(new Gn(.85,1),new $e({color:3149832,emissive:16738842,emissiveIntensity:2.4,roughness:.9})),t=new Gt(new Ut({map:Vt(!0),color:16742954,transparent:!0,depthWrite:!1,blending:dt}));t.scale.setScalar(3.4);let n=new Gt(new Ut({map:Vt(!0),color:16726544,transparent:!0,opacity:.6,depthWrite:!1,blending:dt}));return n.scale.set(1.8,4.5,1),n.position.y=1.9,r.add(e,t,n),r.userData.base=1,r}function ep(){let r=document.createElement("canvas");r.width=512,r.height=64;let e=r.getContext("2d");for(let n=0;n<16;n++)e.fillStyle=n%2?"#f2eadc":"#1a1410",e.fillRect(n*32,0,32,10),e.fillStyle=n%2?"#1a1410":"#f2eadc",e.fillRect(n*32,54,32,10);e.fillStyle="#2a7fb0",e.fillRect(0,10,512,44),e.fillStyle="#f6e7c8",e.font="bold 32px Georgia, serif",e.textAlign="center",e.textBaseline="middle",e.fillText("\u0427\u0415\u041A\u041F\u041E\u0418\u041D\u0422",256,33);let t=new Ft(r);return t.colorSpace=_t,t}var Ca=new L(-.18,1,.32).normalize();function ov(r){let e=new qe;return r.rotation.z=Math.PI/2,e.add(r),e.userData.base=r.userData.base,e}function cv(){let r=document.createElement("canvas");r.width=64,r.height=256;let e=r.getContext("2d"),t=e.createLinearGradient(0,0,0,256);t.addColorStop(0,"rgba(255,255,255,.9)"),t.addColorStop(1,"rgba(255,255,255,0)"),e.fillStyle=t,e.fillRect(0,0,64,256);let n=e.createLinearGradient(0,0,64,0);return n.addColorStop(0,"rgba(0,0,0,1)"),n.addColorStop(.25,"rgba(0,0,0,0)"),n.addColorStop(.75,"rgba(0,0,0,0)"),n.addColorStop(1,"rgba(0,0,0,1)"),e.globalCompositeOperation="destination-out",e.fillStyle=n,e.fillRect(0,0,64,256),new Ft(r)}function lv(){let r=new qe,e=Sn("rusty_metal_02",10132122,.5),t=new Z(new Gn(.85,2),e);t.castShadow=!0,r.add(t);let n=new Gn(1,1),i=n.getAttribute("position"),s=new Set;for(let c=0;c<i.count;c++){let l=new L(i.getX(c),i.getY(c),i.getZ(c)).normalize(),h=l.toArray().map(u=>u.toFixed(2)).join();if(s.has(h))continue;s.add(h);let o=new Z(new Qn(.13,.55,8),e);o.position.copy(l.clone().multiplyScalar(1.02)),o.quaternion.setFromUnitVectors(new L(0,1,0),l),r.add(o)}let a=new Z(new Kt(.2,.06,6,12),e);return a.position.y=.95,r.add(a),r.userData.base=1,Ms(r)}function tp(){let r=document.createElement("canvas");r.width=r.height=128;let e=r.getContext("2d");e.fillStyle="#3a1a08",e.fillRect(0,0,128,128),e.strokeStyle="#ffcf5a",e.lineWidth=8;for(let n of[56,38])e.beginPath(),e.arc(64,64,n,0,7),e.stroke();e.fillStyle="#ffe08a",e.beginPath(),e.moveTo(64,26),e.lineTo(90,64),e.lineTo(74,64),e.lineTo(74,100),e.lineTo(54,100),e.lineTo(54,64),e.lineTo(38,64),e.closePath(),e.fill();let t=new Ft(r);return t.colorSpace=_t,t.center.set(.5,.5),t.rotation=Math.PI,t}function np(r=!1){let e=new qe,t=Sn("rusty_metal_02",9211020,.3),n=Sn("rusty_metal_02",16777215,.6),i=.85,s=1.7,a=18,c=new Z(new Et(i,i*1.02,.12,28),n);c.position.y=.06,e.add(c);for(let o of[.12,.9,s]){let u=new Z(new Kt(i,.045,8,40).rotateX(Math.PI/2),t);u.position.y=o,e.add(u)}let l=new Et(.025,.025,s-.12,6);for(let o=0;o<a;o++){let u=o/a*Math.PI*2;if(r&&o>=2&&o<=4)continue;let d=new Z(l,t);d.position.set(Math.cos(u)*i,(s+.12)/2,Math.sin(u)*i),d.castShadow=!0,e.add(d)}for(let o=0;o<a/2;o++){let u=o/(a/2)*Math.PI,d=new Z(new Kt(i,.025,6,24,Math.PI),t);d.position.y=s,d.rotation.y=u,e.add(d)}let h=new Z(new Kt(.13,.035,8,16),t);if(h.position.y=s+i+.12,e.add(h),r){let o=new qe;for(let u=0;u<3;u++){let d=new Z(l,t);d.position.set(u*.26,(s+.12)/2,0),o.add(d)}o.position.set(Math.cos(2/a*Math.PI*2)*i,0,Math.sin(2/a*Math.PI*2)*i),o.rotation.y=-1.6,e.add(o)}return e.traverse(o=>{o.isMesh&&(o.castShadow=!0,o.receiveShadow=!0)}),Ms(e)}function hv(){let r=document.createElement("canvas");r.width=4,r.height=64;let e=r.getContext("2d"),t=e.createLinearGradient(0,0,0,64);return t.addColorStop(0,"rgba(0,0,0,0)"),t.addColorStop(1,"rgba(0,0,0,.75)"),e.fillStyle=t,e.fillRect(0,0,4,64),new Ft(r)}function uv(){let r=document.createElement("canvas");r.width=r.height=256;let e=r.getContext("2d");e.translate(128,128);for(let n=0;n<900;n++){let i=n/900,s=i*Math.PI*14,a=i*120;e.fillStyle=`rgba(255,255,255,${.6*(1-i)+.1})`,e.beginPath(),e.arc(Math.cos(s)*a,Math.sin(s)*a,2+i*7,0,7),e.fill()}let t=e.createRadialGradient(0,0,0,0,0,128);return t.addColorStop(0,"rgba(255,255,255,.9)"),t.addColorStop(.3,"rgba(255,255,255,.2)"),t.addColorStop(1,"rgba(255,255,255,0)"),e.fillStyle=t,e.fillRect(-128,-128,256,256),new Ft(r)}function dv(){let r=document.createElement("canvas");r.width=r.height=256;let e=r.getContext("2d");e.strokeStyle="#000",e.lineCap="round";for(let t=0;t<7;t++){let n=128+(Math.random()-.5)*30,i=128+(Math.random()-.5)*30;e.lineWidth=4,e.beginPath(),e.moveTo(n,i);let s=Math.random()*6.28;for(let a=0;a<8;a++)n+=Math.cos(s+(Math.random()-.5)*1.2)*18,i+=Math.sin(s+(Math.random()-.5)*1.2)*18,e.lineTo(n,i),e.lineWidth=Math.max(1,4-a*.4);e.stroke()}return new Ft(r)}var ip=new Map;function Sn(r,e=16777215,t=1){let n=r+e+t,i=ip.get(n);if(i)return i;let s=new Gi,a=(l,h=!1)=>{let o=s.load(`tex/${r}/${l}.jpg`);return o.wrapS=o.wrapT=cn,o.repeat.set(t,t),o.anisotropy=4,h&&(o.colorSpace=_t),o},c=a("arm");return i=new $e({map:a("diffuse",!0),normalMap:a("nor_gl"),roughnessMap:c,metalnessMap:c,metalness:1,roughness:1,color:e,envMapIntensity:1.3}),ip.set(n,i),i}function fv(){let r=document.createElement("canvas");r.width=64,r.height=256;let e=r.getContext("2d"),t=e.createLinearGradient(0,0,0,256);t.addColorStop(0,"rgba(255,255,255,0)"),t.addColorStop(.6,"rgba(255,255,255,.8)"),t.addColorStop(1,"rgba(255,255,255,1)"),e.fillStyle=t,e.fillRect(0,0,64,256);let n=e.createLinearGradient(0,0,64,0);return n.addColorStop(0,"rgba(0,0,0,1)"),n.addColorStop(.5,"rgba(0,0,0,0)"),n.addColorStop(1,"rgba(0,0,0,1)"),e.globalCompositeOperation="destination-out",e.fillStyle=n,e.fillRect(0,0,64,256),new Ft(r)}function sp(){let r=document.createElement("canvas");r.className="confetti",r.width=innerWidth,r.height=innerHeight,document.body.appendChild(r);let e=r.getContext("2d"),t=["#f6c26b","#e74c3c","#fff1d0","#c0392b","#ffd24a"],n=Array.from({length:140},()=>({x:Math.random()*r.width,y:-20-Math.random()*r.height*.5,vx:(Math.random()-.5)*2,vy:2+Math.random()*3,r:Math.random()*6,s:4+Math.random()*6,c:t[Math.floor(Math.random()*t.length)]})),i=0,s=()=>{i++,e.clearRect(0,0,r.width,r.height);for(let a of n)a.x+=a.vx,a.y+=a.vy,a.r+=.1,e.save(),e.translate(a.x,a.y),e.rotate(a.r),e.fillStyle=a.c,e.fillRect(-a.s/2,-a.s/4,a.s,a.s/2),e.restore();i<260?requestAnimationFrame(s):r.remove()};s()}var pv=null,mv=null,gv=()=>pv??=new tt({map:hv(),transparent:!0,depthWrite:!1,color:0}),xv=()=>mv??=new tt({map:Vt(!0),color:16744496,transparent:!0,opacity:.22,depthWrite:!1,blending:dt});function Ms(r){r.updateMatrixWorld(!0);let e=r.matrixWorld.clone().invert(),t=new Map,n=[];if(r.traverse(i=>{let s=i;if(!s.isMesh||s===r||Array.isArray(s.material)||s.isInstancedMesh)return;let a=(s.geometry.index?s.geometry.toNonIndexed():s.geometry.clone()).applyMatrix4(e.clone().multiply(s.matrixWorld));for(let c of Object.keys(a.attributes))["position","normal","uv"].includes(c)||a.deleteAttribute(c);a.attributes.uv||a.setAttribute("uv",new Xe(new Float32Array(a.attributes.position.count*2),2)),(t.get(s.material)??t.set(s.material,[]).get(s.material)).push(a),n.push(s)}),n.length<2)return r;for(let i of n)i.parent.remove(i);for(let[i,s]of t){let a=new Z(Nh(s,!1),i);a.castShadow=a.receiveShadow=!0,r.add(a)}return r}var fu=(()=>{let e=new URLSearchParams(location.search).get("skin");if(!e)try{e=localStorage.getItem("race-skin")}catch{}return["a","b","c"].includes(e||"")?e:"a"})();var hi=new URLSearchParams(location.search),ap=document.getElementById("pick"),jc=document.getElementById("loading"),op=document.getElementById("load-fill"),pu=[1,2,3,4].includes(Number(hi.get("map")))?Number(hi.get("map")):1;function yv(){let r=null;if(hi.get("host")){let o=/#token=([^&]+)/.exec(location.hash)?.[1];o&&(r={code:hi.get("room"),token:decodeURIComponent(o)})}else{let o=/#seat=([^.&]+)\.([^&]+)/.exec(location.hash);if(o){r={code:o[1],token:decodeURIComponent(o[2])};try{sessionStorage.setItem("finalanswer-session",JSON.stringify(r))}catch{}}else try{r=JSON.parse(sessionStorage.getItem("finalanswer-session")||"null")}catch{}}if(!r?.code||!r?.token){document.querySelector("#loading h2").textContent="\u041D\u0435\u0442 \u0441\u0435\u0441\u0441\u0438\u0438 \u043A\u043E\u043C\u043D\u0430\u0442\u044B \u2014 \u0432\u0435\u0440\u043D\u0438\u0442\u0435\u0441\u044C \u0432 \u0438\u0433\u0440\u0443";return}ap.hidden=!0,jc.hidden=!1,document.body.classList.add("playing");let e=null,t=0,n="",i,s=!1,a=()=>Date.now()+t,c=(o,u)=>{i?.readyState===1&&i.send(JSON.stringify({type:o,requestId:"race_"+Math.random().toString(36).slice(2),payload:u}))},l=async o=>{if(typeof o.serverTime=="number"&&(t=o.serverTime-Date.now()),o.webGame!=="race"||!o.race){n&&(location.href="/");return}if(s||n===o.race.id)return;s=!0,n=o.race.id;let u=(o.players||[]).filter(x=>x.connectionStatus!=="OFFLINE"||!0).map(x=>({id:x.id,name:x.nickname||x.name,char:x.characterId})),d=u.find(x=>x.id===o.selfId);e=new Ia(document.getElementById("stage"),d?.char||"pumpkin",o.race.map,{roster:u,selfId:o.selfId,seed:o.race.seed,startAt:o.race.startAt,serverNow:a,send:(x,p)=>c("RACE_STATE",{roomCode:r.code,s:x,...p||{}}),spark:()=>c("RACE_SPARK",{roomCode:r.code}),spectator:!!o.host}),o.run&&e.surv?.apply(o.run),await e.load(x=>op.style.width=`${Math.round(x*100)}%`),o.run&&(e.surv?.apply(o.run),e.surv&&(e.surv.pending=null)),jc.hidden=!0,e.start(),window.__race=e;let f=document.getElementById("tap");f.hidden=!1,f.onclick=()=>{f.hidden=!0,e.snd.unlock(),e.snd.ambience(e.course.theme),e.snd.playMusic("audio/music.m4a")},document.getElementById("intro-skip").onclick=()=>{e.introSkipped=!0,document.getElementById("intro").hidden=!0,e.snd.voice("")};let m=document.getElementById("again");m.textContent=o.host?"\u0412 \u041B\u041E\u0411\u0411\u0418":"\u0416\u0414\u0401\u041C \u0412\u0415\u0414\u0423\u0429\u0415\u0413\u041E",o.host||(m.onclick=()=>{})};if(hi.get("host")){let o=(d=!1)=>`/rooms/${encodeURIComponent(r.code)}/race?token=${encodeURIComponent(r.token)}${d?"&close=1":""}`,u=async()=>{try{let d=await fetch(o()),f=await d.json();d.ok&&(!n&&f.race?await l(f):n&&f.webGame!=="race"?document.querySelector("#verdict").textContent="\u0417\u0410\u0411\u0415\u0413 \u0417\u0410\u041A\u0420\u042B\u0422":(t+=(f.serverTime-Date.now()-t)*.2,e?.remote(f.runners),f.run&&e?.surv?.apply(f.run)))}catch{}setTimeout(u,120)};u(),document.getElementById("again").onclick=()=>fetch(o(!0));return}let h=()=>{i=new WebSocket(`${location.protocol==="https:"?"wss":"ws"}://${location.host}/ws`),i.onopen=()=>c("AUTH",{roomCode:r.code,token:r.token}),i.onmessage=o=>{try{let u=JSON.parse(o.data);if(u.type==="RACE_POS"){u.payload.id===n&&(t+=(u.payload.serverTime-Date.now()-t)*.1,e?.remote(u.payload.runners),u.payload.run&&e?.surv?.apply(u.payload.run));return}u.payload?.run&&e&&e.surv?.apply(u.payload.run),u.payload?.code&&u.payload?.selfId!==void 0&&l(u.payload)}catch{}},i.onclose=()=>setTimeout(h,1500)};h(),setInterval(()=>c("PING",{roomCode:r.code}),8e3)}var rp=async r=>{ap.hidden=!0,jc.hidden=!1,document.body.classList.add("playing");let e=new Ia(document.getElementById("stage"),r,pu);await e.load(t=>op.style.width=`${Math.round(t*100)}%`),jc.hidden=!0,e.snd.unlock(),e.snd.ambience(e.course.theme),e.snd.playMusic("audio/music.m4a"),e.start(),window.__race=e,document.getElementById("intro-skip").onclick=()=>{e.introSkipped=!0,e.snd.voice("")},document.getElementById("again").onclick=()=>location.reload()};if(hi.get("net")||hi.get("host"))yv();else if(hi.get("char")&&wi.includes(hi.get("char")))rp(hi.get("char"));else for(let r of wi){let e=document.createElement("button");e.innerHTML=`<img src="portraits/${r}.png" alt=""><span>${du[r]}</span>`,e.onclick=()=>rp(r),document.getElementById("roster").appendChild(e)}for(let r of document.querySelectorAll("#maps button"))r.classList.toggle("on",Number(r.dataset.map)===pu),r.onclick=()=>{pu=Number(r.dataset.map),document.querySelectorAll("#maps button").forEach(e=>e.classList.toggle("on",e===r))};for(let r of document.querySelectorAll("#skins button"))r.classList.toggle("on",r.dataset.skin===fu),r.onclick=()=>{try{localStorage.setItem("race-skin",r.dataset.skin)}catch{}location.reload()};
/*! Bundled license information:

three/build/three.core.js:
three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2026 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
//# sourceMappingURL=app.js.map
