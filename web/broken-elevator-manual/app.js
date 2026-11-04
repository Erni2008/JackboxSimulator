var Ts={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},ws={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Mf=0,kh=1,xf=2;var Ks=1,Sf=2,Gr=3,Hn=0,vn=1,bn=2,Ii=0,Hr=1,Js=2,zh=3,Vh=4,Tf=5;var js=100,wf=101,Ef=102,Af=103,Rf=104,Cf=200,Pf=201,If=202,Lf=203,Gh=204,Hh=205,Df=206,Nf=207,Uf=208,Ff=209,Of=210,Bf=211,kf=212,zf=213,Vf=214,$a=0,Za=1,Ka=2,wr=3,Ja=4,ja=5,Qa=6,el=7,Wh=0,Gf=1,Hf=2,pi=0,Xh=1,qh=2,Yh=3,Yo=4,$h=5,Zh=6,Kh=7,Sh="attached",Wf="detached",Jh=300,Es=301,Qs=302,As=303,Tl=304,$o=306,rn=1e3,On=1001,Er=1002,qt=1003,wl=1004;var er=1005;var Rt=1006,Wr=1007;var mn=1008;var Wn=1009,jh=1010,Qh=1011,Xr=1012,El=1013,mi=1014,An=1015,Fn=1016,Al=1017,Rl=1018,qr=1020,eu=35902,tu=35899,nu=1021,iu=1022,Kn=1023,Ti=1026,Rs=1027,Cl=1028,Pl=1029,Cs=1030,Il=1031;var Ll=1033,Zo=33776,Ko=33777,Jo=33778,jo=33779,Dl=35840,Nl=35841,Ul=35842,Fl=35843,Ol=36196,Bl=37492,kl=37496,zl=37488,Vl=37489,Qo=37490,Gl=37491,Hl=37808,Wl=37809,Xl=37810,ql=37811,Yl=37812,$l=37813,Zl=37814,Kl=37815,Jl=37816,jl=37817,Ql=37818,ec=37819,tc=37820,nc=37821,ic=36492,sc=36494,rc=36495,oc=36283,ac=36284,ea=36285,lc=36286;var Vs=2300,Gs=2301,Xa=2302,Th=2303,wh=2400,Eh=2401,Ah=2402,Xf=2500;var su=0,ta=1,Yr=2,qf=3200;var cc=0,Yf=1,Ft="",nt="srgb",_n="srgb-linear",vo="linear",yt="srgb";var qa=7680;var $f=519,Zf=512,Kf=513,Jf=514,hc=515,jf=516,Qf=517,uc=518,ep=519,ru=35044;var ou="300 es",hi=2e3,Ar=2001;function Xm(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function qm(n){return ArrayBuffer.isView(n)&&!(n instanceof DataView)}function Rr(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function tp(){let n=Rr("canvas");return n.style.display="block",n}var Cd={},Cr=null;function bo(...n){let e="THREE."+n.shift();Cr?Cr("log",e,...n):console.log(e,...n)}function np(n){let e=n[0];if(typeof e=="string"&&e.startsWith("TSL:")){let t=n[1];t&&t.isStackTrace?n[0]+=" "+t.getLocation():n[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return n}function ke(...n){n=np(n);let e="THREE."+n.shift();if(Cr)Cr("warn",e,...n);else{let t=n[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...n)}}function Ye(...n){n=np(n);let e="THREE."+n.shift();if(Cr)Cr("error",e,...n);else{let t=n[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...n)}}function zs(...n){let e=n.join(" ");e in Cd||(Cd[e]=!0,ke(...n))}function ip(n,e,t){return new Promise(function(i,s){function r(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:i()}}setTimeout(r,t)})}var sp={[$a]:Za,[Ka]:Qa,[Ja]:el,[wr]:ja,[Za]:$a,[Qa]:Ka,[el]:Ja,[ja]:wr},ui=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){let i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){let i=this._listeners;if(i===void 0)return;let s=i[e];if(s!==void 0){let r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let i=t[e.type];if(i!==void 0){e.target=this;let s=i.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,e);e.target=null}}},Sn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Pd=1234567,mo=Math.PI/180,Hs=180/Math.PI;function ei(){let n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Sn[n&255]+Sn[n>>8&255]+Sn[n>>16&255]+Sn[n>>24&255]+"-"+Sn[e&255]+Sn[e>>8&255]+"-"+Sn[e>>16&15|64]+Sn[e>>24&255]+"-"+Sn[t&63|128]+Sn[t>>8&255]+"-"+Sn[t>>16&255]+Sn[t>>24&255]+Sn[i&255]+Sn[i>>8&255]+Sn[i>>16&255]+Sn[i>>24&255]).toLowerCase()}function tt(n,e,t){return Math.max(e,Math.min(t,n))}function au(n,e){return(n%e+e)%e}function Ym(n,e,t,i,s){return i+(n-e)*(s-i)/(t-e)}function $m(n,e,t){return n!==e?(t-n)/(e-n):0}function go(n,e,t){return(1-t)*n+t*e}function Zm(n,e,t,i){return go(n,e,1-Math.exp(-t*i))}function Km(n,e=1){return e-Math.abs(au(n,e*2)-e)}function Jm(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*(3-2*n))}function jm(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*n*(n*(n*6-15)+10))}function Qm(n,e){return n+Math.floor(Math.random()*(e-n+1))}function eg(n,e){return n+Math.random()*(e-n)}function tg(n){return n*(.5-Math.random())}function ng(n){n!==void 0&&(Pd=n);let e=Pd+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function ig(n){return n*mo}function sg(n){return n*Hs}function rg(n){return n>0&&Number.isInteger(n)&&2**Math.round(Math.log2(n))===n}function og(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function ag(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function lg(n,e,t,i,s){let r=Math.cos,o=Math.sin,a=r(t/2),l=o(t/2),c=r((e+i)/2),h=o((e+i)/2),u=r((e-i)/2),d=o((e-i)/2),f=r((i-e)/2),m=o((i-e)/2);switch(s){case"XYX":n.set(a*h,l*u,l*d,a*c);break;case"YZY":n.set(l*d,a*h,l*u,a*c);break;case"ZXZ":n.set(l*u,l*d,a*h,a*c);break;case"XZX":n.set(a*h,l*m,l*f,a*c);break;case"YXY":n.set(l*f,a*h,l*m,a*c);break;case"ZYZ":n.set(l*m,l*f,a*h,a*c);break;default:ke("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function ci(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:case Uint8ClampedArray:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function bt(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}var Zt={DEG2RAD:mo,RAD2DEG:Hs,generateUUID:ei,clamp:tt,euclideanModulo:au,mapLinear:Ym,inverseLerp:$m,lerp:go,damp:Zm,pingpong:Km,smoothstep:Jm,smootherstep:jm,randInt:Qm,randFloat:eg,randFloatSpread:tg,seededRandom:ng,degToRad:ig,radToDeg:sg,isPowerOfTwo:rg,ceilPowerOfTwo:og,floorPowerOfTwo:ag,setQuaternionFromProperEuler:lg,normalize:bt,denormalize:ci},ae=class n{static{n.prototype.isVector2=!0}constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,i=this.y,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6],this.y=s[1]*t+s[4]*i+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=tt(this.x,e.x,t.x),this.y=tt(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=tt(this.x,e,t),this.y=tt(this.y,e,t),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(tt(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let i=this.dot(e)/t;return Math.acos(tt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let i=Math.cos(t),s=Math.sin(t),r=this.x-e.x,o=this.y-e.y;return this.x=r*i-o*s+e.x,this.y=r*s+o*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},ft=class{constructor(e=0,t=0,i=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=s}static slerpFlat(e,t,i,s,r,o,a){let l=i[s+0],c=i[s+1],h=i[s+2],u=i[s+3],d=r[o+0],f=r[o+1],m=r[o+2],_=r[o+3];if(u!==_||l!==d||c!==f||h!==m){let p=l*d+c*f+h*m+u*_;p<0&&(d=-d,f=-f,m=-m,_=-_,p=-p);let g=1-a;if(p<.9995){let T=Math.acos(p),x=Math.sin(T);g=Math.sin(g*T)/x,a=Math.sin(a*T)/x,l=l*g+d*a,c=c*g+f*a,h=h*g+m*a,u=u*g+_*a}else{l=l*g+d*a,c=c*g+f*a,h=h*g+m*a,u=u*g+_*a;let T=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=T,c*=T,h*=T,u*=T}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,i,s,r,o){let a=i[s],l=i[s+1],c=i[s+2],h=i[s+3],u=r[o],d=r[o+1],f=r[o+2],m=r[o+3];return e[t]=a*m+h*u+l*f-c*d,e[t+1]=l*m+h*d+c*u-a*f,e[t+2]=c*m+h*f+a*d-l*u,e[t+3]=h*m-a*u-l*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,s){return this._x=e,this._y=t,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let i=e._x,s=e._y,r=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(i/2),h=a(s/2),u=a(r/2),d=l(i/2),f=l(s/2),m=l(r/2);switch(o){case"XYZ":this._x=d*h*u+c*f*m,this._y=c*f*u-d*h*m,this._z=c*h*m+d*f*u,this._w=c*h*u-d*f*m;break;case"YXZ":this._x=d*h*u+c*f*m,this._y=c*f*u-d*h*m,this._z=c*h*m-d*f*u,this._w=c*h*u+d*f*m;break;case"ZXY":this._x=d*h*u-c*f*m,this._y=c*f*u+d*h*m,this._z=c*h*m+d*f*u,this._w=c*h*u-d*f*m;break;case"ZYX":this._x=d*h*u-c*f*m,this._y=c*f*u+d*h*m,this._z=c*h*m-d*f*u,this._w=c*h*u+d*f*m;break;case"YZX":this._x=d*h*u+c*f*m,this._y=c*f*u+d*h*m,this._z=c*h*m-d*f*u,this._w=c*h*u-d*f*m;break;case"XZY":this._x=d*h*u-c*f*m,this._y=c*f*u-d*h*m,this._z=c*h*m+d*f*u,this._w=c*h*u+d*f*m;break;default:ke("Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let i=t/2,s=Math.sin(i);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,i=t[0],s=t[4],r=t[8],o=t[1],a=t[5],l=t[9],c=t[2],h=t[6],u=t[10],d=i+a+u;if(d>0){let f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-l)*f,this._y=(r-c)*f,this._z=(o-s)*f}else if(i>a&&i>u){let f=2*Math.sqrt(1+i-a-u);this._w=(h-l)/f,this._x=.25*f,this._y=(s+o)/f,this._z=(r+c)/f}else if(a>u){let f=2*Math.sqrt(1+a-i-u);this._w=(r-c)/f,this._x=(s+o)/f,this._y=.25*f,this._z=(l+h)/f}else{let f=2*Math.sqrt(1+u-i-a);this._w=(o-s)/f,this._x=(r+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(tt(this.dot(e),-1,1)))}rotateTowards(e,t){let i=this.angleTo(e);if(i===0)return this;let s=Math.min(1,t/i);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let i=e._x,s=e._y,r=e._z,o=e._w,a=t._x,l=t._y,c=t._z,h=t._w;return this._x=i*h+o*a+s*c-r*l,this._y=s*h+o*l+r*a-i*c,this._z=r*h+o*c+i*l-s*a,this._w=o*h-i*a-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){let i=e._x,s=e._y,r=e._z,o=e._w,a=this.dot(e);a<0&&(i=-i,s=-s,r=-r,o=-o,a=-a);let l=1-t;if(a<.9995){let c=Math.acos(a),h=Math.sin(c);l=Math.sin(l*c)/h,t=Math.sin(t*c)/h,this._x=this._x*l+i*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+o*t,this._onChangeCallback()}else this._x=this._x*l+i*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+o*t,this.normalize();return this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},C=class n{static{n.prototype.isVector3=!0}constructor(e=0,t=0,i=0){this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Id.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Id.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6]*s,this.y=r[1]*t+r[4]*i+r[7]*s,this.z=r[2]*t+r[5]*i+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,i=this.y,s=this.z,r=e.elements,o=1/(r[3]*t+r[7]*i+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*i+r[8]*s+r[12])*o,this.y=(r[1]*t+r[5]*i+r[9]*s+r[13])*o,this.z=(r[2]*t+r[6]*i+r[10]*s+r[14])*o,this}applyQuaternion(e){let t=this.x,i=this.y,s=this.z,r=e.x,o=e.y,a=e.z,l=e.w,c=2*(o*s-a*i),h=2*(a*t-r*s),u=2*(r*i-o*t);return this.x=t+l*c+o*u-a*h,this.y=i+l*h+a*c-r*u,this.z=s+l*u+r*h-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*i+r[8]*s,this.y=r[1]*t+r[5]*i+r[9]*s,this.z=r[2]*t+r[6]*i+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=tt(this.x,e.x,t.x),this.y=tt(this.y,e.y,t.y),this.z=tt(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=tt(this.x,e,t),this.y=tt(this.y,e,t),this.z=tt(this.z,e,t),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(tt(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let i=e.x,s=e.y,r=e.z,o=t.x,a=t.y,l=t.z;return this.x=s*l-r*a,this.y=r*o-i*l,this.z=i*a-s*o,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return Kc.copy(this).projectOnVector(e),this.sub(Kc)}reflect(e){return this.sub(Kc.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let i=this.dot(e)/t;return Math.acos(tt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,i=this.y-e.y,s=this.z-e.z;return t*t+i*i+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){let s=Math.sin(t)*e;return this.x=s*Math.sin(i),this.y=Math.cos(t)*e,this.z=s*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Kc=new C,Id=new ft,je=class n{static{n.prototype.isMatrix3=!0}constructor(e,t,i,s,r,o,a,l,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,o,a,l,c)}set(e,t,i,s,r,o,a,l,c){let h=this.elements;return h[0]=e,h[1]=s,h[2]=a,h[3]=t,h[4]=r,h[5]=l,h[6]=i,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let i=e.elements,s=t.elements,r=this.elements,o=i[0],a=i[3],l=i[6],c=i[1],h=i[4],u=i[7],d=i[2],f=i[5],m=i[8],_=s[0],p=s[3],g=s[6],T=s[1],x=s[4],v=s[7],M=s[2],E=s[5],A=s[8];return r[0]=o*_+a*T+l*M,r[3]=o*p+a*x+l*E,r[6]=o*g+a*v+l*A,r[1]=c*_+h*T+u*M,r[4]=c*p+h*x+u*E,r[7]=c*g+h*v+u*A,r[2]=d*_+f*T+m*M,r[5]=d*p+f*x+m*E,r[8]=d*g+f*v+m*A,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8];return t*o*h-t*a*c-i*r*h+i*a*l+s*r*c-s*o*l}invert(){let e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8],u=h*o-a*c,d=a*l-h*r,f=c*r-o*l,m=t*u+i*d+s*f;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);let _=1/m;return e[0]=u*_,e[1]=(s*c-h*i)*_,e[2]=(a*i-s*o)*_,e[3]=d*_,e[4]=(h*t-s*l)*_,e[5]=(s*r-a*t)*_,e[6]=f*_,e[7]=(i*l-c*t)*_,e[8]=(o*t-i*r)*_,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,s,r,o,a){let l=Math.cos(r),c=Math.sin(r);return this.set(i*l,i*c,-i*(l*o+c*a)+o+e,-s*c,s*l,-s*(-c*o+l*a)+a+t,0,0,1),this}scale(e,t){return zs("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Jc.makeScale(e,t)),this}rotate(e){return zs("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Jc.makeRotation(-e)),this}translate(e,t){return zs("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Jc.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,i=e.elements;for(let s=0;s<9;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){let i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}},Jc=new je,Ld=new je().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Dd=new je().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function cg(){let n={enabled:!0,workingColorSpace:_n,spaces:{},convert:function(s,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===yt&&(s.r=Yi(s.r),s.g=Yi(s.g),s.b=Yi(s.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===yt&&(s.r=Tr(s.r),s.g=Tr(s.g),s.b=Tr(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Ft?vo:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,o){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return zs("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),n.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return zs("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),n.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[_n]:{primaries:e,whitePoint:i,transfer:vo,toXYZ:Ld,fromXYZ:Dd,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:nt},outputColorSpaceConfig:{drawingBufferColorSpace:nt}},[nt]:{primaries:e,whitePoint:i,transfer:yt,toXYZ:Ld,fromXYZ:Dd,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:nt}}}),n}var rt=cg();function Yi(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function Tr(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}var hr,tl=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{hr===void 0&&(hr=Rr("canvas")),hr.width=e.width,hr.height=e.height;let s=hr.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),i=hr}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=Rr("canvas");t.width=e.width,t.height=e.height;let i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);let s=i.getImageData(0,0,e.width,e.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=Yi(r[o]/255)*255;return i.putImageData(s,0,0),t}else if(e.data){let t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(Yi(t[i]/255)*255):t[i]=Yi(t[i]);return{data:t,width:e.width,height:e.height}}else return ke("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},hg=0,Pr=class{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:hg++}),this.uuid=ei(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(jc(s[o].image)):r.push(jc(s[o]))}else r=jc(s);i.url=r}return t||(e.images[this.uuid]=i),i}};function jc(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?tl.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(ke("Texture: Unable to serialize Texture."),{})}var ug=0,Qc=new C,on=class n extends ui{constructor(e=n.DEFAULT_IMAGE,t=n.DEFAULT_MAPPING,i=On,s=On,r=Rt,o=mn,a=Kn,l=Wn,c=n.DEFAULT_ANISOTROPY,h=Ft){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:ug++}),this.uuid=ei(),this.name="",this.source=new Pr(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new ae(0,0),this.repeat=new ae(1,1),this.center=new ae(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new je,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Qc).x}get height(){return this.source.getSize(Qc).y}get depth(){return this.source.getSize(Qc).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let i=e[t];if(i===void 0){ke(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){ke(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[t]=i}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Jh)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case rn:e.x=e.x-Math.floor(e.x);break;case On:e.x=e.x<0?0:1;break;case Er:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case rn:e.y=e.y-Math.floor(e.y);break;case On:e.y=e.y<0?0:1;break;case Er:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};on.DEFAULT_IMAGE=null;on.DEFAULT_MAPPING=Jh;on.DEFAULT_ANISOTROPY=1;var Mt=class n{static{n.prototype.isVector4=!0}constructor(e=0,t=0,i=0,s=1){this.x=e,this.y=t,this.z=i,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,s){return this.x=e,this.y=t,this.z=i,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,i=this.y,s=this.z,r=this.w,o=e.elements;return this.x=o[0]*t+o[4]*i+o[8]*s+o[12]*r,this.y=o[1]*t+o[5]*i+o[9]*s+o[13]*r,this.z=o[2]*t+o[6]*i+o[10]*s+o[14]*r,this.w=o[3]*t+o[7]*i+o[11]*s+o[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,s,r,l=e.elements,c=l[0],h=l[4],u=l[8],d=l[1],f=l[5],m=l[9],_=l[2],p=l[6],g=l[10];if(Math.abs(h-d)<.01&&Math.abs(u-_)<.01&&Math.abs(m-p)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+_)<.1&&Math.abs(m+p)<.1&&Math.abs(c+f+g-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let x=(c+1)/2,v=(f+1)/2,M=(g+1)/2,E=(h+d)/4,A=(u+_)/4,y=(m+p)/4;return x>v&&x>M?x<.01?(i=0,s=.707106781,r=.707106781):(i=Math.sqrt(x),s=E/i,r=A/i):v>M?v<.01?(i=.707106781,s=0,r=.707106781):(s=Math.sqrt(v),i=E/s,r=y/s):M<.01?(i=.707106781,s=.707106781,r=0):(r=Math.sqrt(M),i=A/r,s=y/r),this.set(i,s,r,t),this}let T=Math.sqrt((p-m)*(p-m)+(u-_)*(u-_)+(d-h)*(d-h));return Math.abs(T)<.001&&(T=1),this.x=(p-m)/T,this.y=(u-_)/T,this.z=(d-h)/T,this.w=Math.acos((c+f+g-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=tt(this.x,e.x,t.x),this.y=tt(this.y,e.y,t.y),this.z=tt(this.z,e.z,t.z),this.w=tt(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=tt(this.x,e,t),this.y=tt(this.y,e,t),this.z=tt(this.z,e,t),this.w=tt(this.w,e,t),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(tt(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},nl=class extends ui{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Rt,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new Mt(0,0,e,t),this.scissorTest=!1,this.viewport=new Mt(0,0,e,t),this.textures=[];let s={width:e,height:t,depth:i.depth},r=new on(s),o=i.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveColorBuffer=i.resolveColorBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.storeMultisampledColorBuffer=i.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=i.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=i.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview,this.useArrayDepthTexture=i.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:Rt,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=i,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let s=Object.assign({},e.textures[t].image);this.textures[t].source=new Pr(s)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){let t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}},Bn=class extends nl{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}},Mo=class extends on{constructor(e=null,t=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=qt,this.minFilter=qt,this.wrapR=On,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var il=class extends on{constructor(e=null,t=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=qt,this.minFilter=qt,this.wrapR=On,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}};var We=class n{static{n.prototype.isMatrix4=!0}constructor(e,t,i,s,r,o,a,l,c,h,u,d,f,m,_,p){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,o,a,l,c,h,u,d,f,m,_,p)}set(e,t,i,s,r,o,a,l,c,h,u,d,f,m,_,p){let g=this.elements;return g[0]=e,g[4]=t,g[8]=i,g[12]=s,g[1]=r,g[5]=o,g[9]=a,g[13]=l,g[2]=c,g[6]=h,g[10]=u,g[14]=d,g[3]=f,g[7]=m,g[11]=_,g[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new n().fromArray(this.elements)}copy(e){let t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){let t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),i.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,i=e.elements,s=1/ur.setFromMatrixColumn(e,0).length(),r=1/ur.setFromMatrixColumn(e,1).length(),o=1/ur.setFromMatrixColumn(e,2).length();return t[0]=i[0]*s,t[1]=i[1]*s,t[2]=i[2]*s,t[3]=0,t[4]=i[4]*r,t[5]=i[5]*r,t[6]=i[6]*r,t[7]=0,t[8]=i[8]*o,t[9]=i[9]*o,t[10]=i[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,i=e.x,s=e.y,r=e.z,o=Math.cos(i),a=Math.sin(i),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){let d=o*h,f=o*u,m=a*h,_=a*u;t[0]=l*h,t[4]=-l*u,t[8]=c,t[1]=f+m*c,t[5]=d-_*c,t[9]=-a*l,t[2]=_-d*c,t[6]=m+f*c,t[10]=o*l}else if(e.order==="YXZ"){let d=l*h,f=l*u,m=c*h,_=c*u;t[0]=d+_*a,t[4]=m*a-f,t[8]=o*c,t[1]=o*u,t[5]=o*h,t[9]=-a,t[2]=f*a-m,t[6]=_+d*a,t[10]=o*l}else if(e.order==="ZXY"){let d=l*h,f=l*u,m=c*h,_=c*u;t[0]=d-_*a,t[4]=-o*u,t[8]=m+f*a,t[1]=f+m*a,t[5]=o*h,t[9]=_-d*a,t[2]=-o*c,t[6]=a,t[10]=o*l}else if(e.order==="ZYX"){let d=o*h,f=o*u,m=a*h,_=a*u;t[0]=l*h,t[4]=m*c-f,t[8]=d*c+_,t[1]=l*u,t[5]=_*c+d,t[9]=f*c-m,t[2]=-c,t[6]=a*l,t[10]=o*l}else if(e.order==="YZX"){let d=o*l,f=o*c,m=a*l,_=a*c;t[0]=l*h,t[4]=_-d*u,t[8]=m*u+f,t[1]=u,t[5]=o*h,t[9]=-a*h,t[2]=-c*h,t[6]=f*u+m,t[10]=d-_*u}else if(e.order==="XZY"){let d=o*l,f=o*c,m=a*l,_=a*c;t[0]=l*h,t[4]=-u,t[8]=c*h,t[1]=d*u+_,t[5]=o*h,t[9]=f*u-m,t[2]=m*u-f,t[6]=a*h,t[10]=_*u+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(dg,e,fg)}lookAt(e,t,i){let s=this.elements;return qn.subVectors(e,t),qn.lengthSq()===0&&(qn.z=1),qn.normalize(),cs.crossVectors(i,qn),cs.lengthSq()===0&&(Math.abs(i.z)===1?qn.x+=1e-4:qn.z+=1e-4,qn.normalize(),cs.crossVectors(i,qn)),cs.normalize(),ya.crossVectors(qn,cs),s[0]=cs.x,s[4]=ya.x,s[8]=qn.x,s[1]=cs.y,s[5]=ya.y,s[9]=qn.y,s[2]=cs.z,s[6]=ya.z,s[10]=qn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let i=e.elements,s=t.elements,r=this.elements,o=i[0],a=i[4],l=i[8],c=i[12],h=i[1],u=i[5],d=i[9],f=i[13],m=i[2],_=i[6],p=i[10],g=i[14],T=i[3],x=i[7],v=i[11],M=i[15],E=s[0],A=s[4],y=s[8],S=s[12],I=s[1],D=s[5],F=s[9],R=s[13],P=s[2],N=s[6],O=s[10],X=s[14],J=s[3],z=s[7],B=s[11],W=s[15];return r[0]=o*E+a*I+l*P+c*J,r[4]=o*A+a*D+l*N+c*z,r[8]=o*y+a*F+l*O+c*B,r[12]=o*S+a*R+l*X+c*W,r[1]=h*E+u*I+d*P+f*J,r[5]=h*A+u*D+d*N+f*z,r[9]=h*y+u*F+d*O+f*B,r[13]=h*S+u*R+d*X+f*W,r[2]=m*E+_*I+p*P+g*J,r[6]=m*A+_*D+p*N+g*z,r[10]=m*y+_*F+p*O+g*B,r[14]=m*S+_*R+p*X+g*W,r[3]=T*E+x*I+v*P+M*J,r[7]=T*A+x*D+v*N+M*z,r[11]=T*y+x*F+v*O+M*B,r[15]=T*S+x*R+v*X+M*W,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],i=e[4],s=e[8],r=e[12],o=e[1],a=e[5],l=e[9],c=e[13],h=e[2],u=e[6],d=e[10],f=e[14],m=e[3],_=e[7],p=e[11],g=e[15],T=l*f-c*d,x=a*f-c*u,v=a*d-l*u,M=o*f-c*h,E=o*d-l*h,A=o*u-a*h;return t*(_*T-p*x+g*v)-i*(m*T-p*M+g*E)+s*(m*x-_*M+g*A)-r*(m*v-_*E+p*A)}determinantAffine(){let e=this.elements,t=e[0],i=e[4],s=e[8],r=e[1],o=e[5],a=e[9],l=e[2],c=e[6],h=e[10];return t*(o*h-a*c)-i*(r*h-a*l)+s*(r*c-o*l)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){let s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=i),this}invert(){let e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8],u=e[9],d=e[10],f=e[11],m=e[12],_=e[13],p=e[14],g=e[15],T=t*a-i*o,x=t*l-s*o,v=t*c-r*o,M=i*l-s*a,E=i*c-r*a,A=s*c-r*l,y=h*_-u*m,S=h*p-d*m,I=h*g-f*m,D=u*p-d*_,F=u*g-f*_,R=d*g-f*p,P=T*R-x*F+v*D+M*I-E*S+A*y;if(P===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let N=1/P;return e[0]=(a*R-l*F+c*D)*N,e[1]=(s*F-i*R-r*D)*N,e[2]=(_*A-p*E+g*M)*N,e[3]=(d*E-u*A-f*M)*N,e[4]=(l*I-o*R-c*S)*N,e[5]=(t*R-s*I+r*S)*N,e[6]=(p*v-m*A-g*x)*N,e[7]=(h*A-d*v+f*x)*N,e[8]=(o*F-a*I+c*y)*N,e[9]=(i*I-t*F-r*y)*N,e[10]=(m*E-_*v+g*T)*N,e[11]=(u*v-h*E-f*T)*N,e[12]=(a*S-o*D-l*y)*N,e[13]=(t*D-i*S+s*y)*N,e[14]=(_*x-m*M-p*T)*N,e[15]=(h*M-u*x+d*T)*N,this}scale(e){let t=this.elements,i=e.x,s=e.y,r=e.z;return t[0]*=i,t[4]*=s,t[8]*=r,t[1]*=i,t[5]*=s,t[9]*=r,t[2]*=i,t[6]*=s,t[10]*=r,t[3]*=i,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,s))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let i=Math.cos(t),s=Math.sin(t),r=1-i,o=e.x,a=e.y,l=e.z,c=r*o,h=r*a;return this.set(c*o+i,c*a-s*l,c*l+s*a,0,c*a+s*l,h*a+i,h*l-s*o,0,c*l-s*a,h*l+s*o,r*l*l+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,s,r,o){return this.set(1,i,r,0,e,1,o,0,t,s,1,0,0,0,0,1),this}compose(e,t,i){let s=this.elements,r=t._x,o=t._y,a=t._z,l=t._w,c=r+r,h=o+o,u=a+a,d=r*c,f=r*h,m=r*u,_=o*h,p=o*u,g=a*u,T=l*c,x=l*h,v=l*u,M=i.x,E=i.y,A=i.z;return s[0]=(1-(_+g))*M,s[1]=(f+v)*M,s[2]=(m-x)*M,s[3]=0,s[4]=(f-v)*E,s[5]=(1-(d+g))*E,s[6]=(p+T)*E,s[7]=0,s[8]=(m+x)*A,s[9]=(p-T)*A,s[10]=(1-(d+_))*A,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,i){let s=this.elements;e.x=s[12],e.y=s[13],e.z=s[14];let r=this.determinantAffine();if(r===0)return i.set(1,1,1),t.identity(),this;let o=ur.set(s[0],s[1],s[2]).length(),a=ur.set(s[4],s[5],s[6]).length(),l=ur.set(s[8],s[9],s[10]).length();r<0&&(o=-o),oi.copy(this);let c=1/o,h=1/a,u=1/l;return oi.elements[0]*=c,oi.elements[1]*=c,oi.elements[2]*=c,oi.elements[4]*=h,oi.elements[5]*=h,oi.elements[6]*=h,oi.elements[8]*=u,oi.elements[9]*=u,oi.elements[10]*=u,t.setFromRotationMatrix(oi),i.x=o,i.y=a,i.z=l,this}makePerspective(e,t,i,s,r,o,a=hi,l=!1){let c=this.elements,h=2*r/(t-e),u=2*r/(i-s),d=(t+e)/(t-e),f=(i+s)/(i-s),m,_;if(l)m=r/(o-r),_=o*r/(o-r);else if(a===hi)m=-(o+r)/(o-r),_=-2*o*r/(o-r);else if(a===Ar)m=-o/(o-r),_=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=m,c[14]=_,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,i,s,r,o,a=hi,l=!1){let c=this.elements,h=2/(t-e),u=2/(i-s),d=-(t+e)/(t-e),f=-(i+s)/(i-s),m,_;if(l)m=1/(o-r),_=o/(o-r);else if(a===hi)m=-2/(o-r),_=-(o+r)/(o-r);else if(a===Ar)m=-1/(o-r),_=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=m,c[14]=_,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,i=e.elements;for(let s=0;s<16;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){let i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}},ur=new C,oi=new We,dg=new C(0,0,0),fg=new C(1,1,1),cs=new C,ya=new C,qn=new C,Nd=new We,Ud=new ft,Yt=class n{constructor(e=0,t=0,i=0,s=n.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,s=this._order){return this._x=e,this._y=t,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){let s=e.elements,r=s[0],o=s[4],a=s[8],l=s[1],c=s[5],h=s[9],u=s[2],d=s[6],f=s[10];switch(t){case"XYZ":this._y=Math.asin(tt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-tt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(tt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-tt(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(tt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-tt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:ke("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return Nd.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Nd,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Ud.setFromEuler(this),this.setFromQuaternion(Ud,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Yt.DEFAULT_ORDER="XYZ";var Ir=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},pg=0,Fd=new C,dr=new ft,zi=new We,va=new C,ro=new C,mg=new C,gg=new ft,Od=new C(1,0,0),Bd=new C(0,1,0),kd=new C(0,0,1),zd={type:"added"},_g={type:"removed"},fr={type:"childadded",child:null},eh={type:"childremoved",child:null},Ut=class n extends ui{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:pg++}),this.uuid=ei(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=n.DEFAULT_UP.clone();let e=new C,t=new Yt,i=new ft,s=new C(1,1,1);function r(){i.setFromEuler(t,!1)}function o(){t.setFromQuaternion(i,void 0,!1)}t._onChange(r),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new We},normalMatrix:{value:new je}}),this.matrix=new We,this.matrixWorld=new We,this.matrixAutoUpdate=n.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=n.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Ir,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return dr.setFromAxisAngle(e,t),this.quaternion.multiply(dr),this}rotateOnWorldAxis(e,t){return dr.setFromAxisAngle(e,t),this.quaternion.premultiply(dr),this}rotateX(e){return this.rotateOnAxis(Od,e)}rotateY(e){return this.rotateOnAxis(Bd,e)}rotateZ(e){return this.rotateOnAxis(kd,e)}translateOnAxis(e,t){return Fd.copy(e).applyQuaternion(this.quaternion),this.position.add(Fd.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Od,e)}translateY(e){return this.translateOnAxis(Bd,e)}translateZ(e){return this.translateOnAxis(kd,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(zi.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?va.copy(e):va.set(e,t,i);let s=this.parent;this.updateWorldMatrix(!0,!1),ro.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?zi.lookAt(ro,va,this.up):zi.lookAt(va,ro,this.up),this.quaternion.setFromRotationMatrix(zi),s&&(zi.extractRotation(s.matrixWorld),dr.setFromRotationMatrix(zi),this.quaternion.premultiply(dr.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(Ye("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(zd),fr.child=e,this.dispatchEvent(fr),fr.child=null):Ye("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(_g),eh.child=e,this.dispatchEvent(eh),eh.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),zi.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),zi.multiply(e.parent.matrixWorld)),e.applyMatrix4(zi),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(zd),fr.child=e,this.dispatchEvent(fr),fr.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,s=this.children.length;i<s;i++){let o=this.children[i].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ro,e,mg),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ro,gg,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);let t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,i=e.y,s=e.z,r=this.matrix.elements;r[12]+=t-r[0]*t-r[4]*i-r[8]*s,r[13]+=i-r[1]*t-r[5]*i-r[9]*s,r[14]+=s-r[2]*t-r[6]*i-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t,i=!1){let s=this.parent;if(e===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||i)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,i=!0),t===!0){let r=this.children;for(let o=0,a=r.length;o<a;o++)r[o].updateWorldMatrix(!1,!0,i)}}toJSON(e){let t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,s.name=this.name,s.castShadow=this.castShadow,s.receiveShadow=this.receiveShadow,s.visible=this.visible,s.frustumCulled=this.frustumCulled,s.renderOrder=this.renderOrder,s.static=this.static,s.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(a=>({...a})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let u=l[c];r(e.shapes,u)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(e.materials,this.material[l]));s.material=a}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){let l=this.animations[a];s.animations.push(r(e.animations,l))}}if(t){let a=o(e.geometries),l=o(e.materials),c=o(e.textures),h=o(e.images),u=o(e.shapes),d=o(e.skeletons),f=o(e.animations),m=o(e.nodes);a.length>0&&(i.geometries=a),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),h.length>0&&(i.images=h),u.length>0&&(i.shapes=u),d.length>0&&(i.skeletons=d),f.length>0&&(i.animations=f),m.length>0&&(i.nodes=m)}return i.object=s,i;function o(a){let l=[];for(let c in a){let h=a[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){let s=e.children[i];this.add(s.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}};Ut.DEFAULT_UP=new C(0,1,0);Ut.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ut.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var ct=class extends Ut{constructor(){super(),this.isGroup=!0,this.type="Group"}},yg={type:"move"},Lr=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new ct,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new ct,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new C,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new C),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new ct,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new C,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new C,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let s=null,r=null,o=null,a=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(let _ of e.hand.values()){let p=t.getJointPose(_,i),g=this._getHandJoint(c,_);p!==null&&(g.matrix.fromArray(p.transform.matrix),g.matrix.decompose(g.position,g.rotation,g.scale),g.matrixWorldNeedsUpdate=!0,g.jointRadius=p.radius),g.visible=p!==null}let h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,m=.005;c.inputState.pinching&&d>f+m?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&d<=f-m&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,i),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:e,target:this})));a!==null&&(s=t.getPose(e.targetRaySpace,i),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(yg)))}return a!==null&&(a.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let i=new ct;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}},rp={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},hs={h:0,s:0,l:0},ba={h:0,s:0,l:0};function th(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}var Ne=class{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){let s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=nt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,rt.colorSpaceToWorking(this,t),this}setRGB(e,t,i,s=rt.workingColorSpace){return this.r=e,this.g=t,this.b=i,rt.colorSpaceToWorking(this,s),this}setHSL(e,t,i,s=rt.workingColorSpace){if(e=au(e,1),t=tt(t,0,1),i=tt(i,0,1),t===0)this.r=this.g=this.b=i;else{let r=i<=.5?i*(1+t):i+t-i*t,o=2*i-r;this.r=th(o,r,e+1/3),this.g=th(o,r,e),this.b=th(o,r,e-1/3)}return rt.colorSpaceToWorking(this,s),this}setStyle(e,t=nt){function i(r){r!==void 0&&parseFloat(r)<1&&ke("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:ke("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(r,16),t);ke("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=nt){let i=rp[e.toLowerCase()];return i!==void 0?this.setHex(i,t):ke("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Yi(e.r),this.g=Yi(e.g),this.b=Yi(e.b),this}copyLinearToSRGB(e){return this.r=Tr(e.r),this.g=Tr(e.g),this.b=Tr(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=nt){return rt.workingToColorSpace(Tn.copy(this),e),Math.round(tt(Tn.r*255,0,255))*65536+Math.round(tt(Tn.g*255,0,255))*256+Math.round(tt(Tn.b*255,0,255))}getHexString(e=nt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=rt.workingColorSpace){rt.workingToColorSpace(Tn.copy(this),t);let i=Tn.r,s=Tn.g,r=Tn.b,o=Math.max(i,s,r),a=Math.min(i,s,r),l,c,h=(a+o)/2;if(a===o)l=0,c=0;else{let u=o-a;switch(c=h<=.5?u/(o+a):u/(2-o-a),o){case i:l=(s-r)/u+(s<r?6:0);break;case s:l=(r-i)/u+2;break;case r:l=(i-s)/u+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=rt.workingColorSpace){return rt.workingToColorSpace(Tn.copy(this),t),e.r=Tn.r,e.g=Tn.g,e.b=Tn.b,e}getStyle(e=nt){rt.workingToColorSpace(Tn.copy(this),e);let t=Tn.r,i=Tn.g,s=Tn.b;return e!==nt?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(e,t,i){return this.getHSL(hs),this.setHSL(hs.h+e,hs.s+t,hs.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(hs),e.getHSL(ba);let i=go(hs.h,ba.h,t),s=go(hs.s,ba.s,t),r=go(hs.l,ba.l,t);return this.setHSL(i,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,i=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*i+r[6]*s,this.g=r[1]*t+r[4]*i+r[7]*s,this.b=r[2]*t+r[5]*i+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Tn=new Ne;Ne.NAMES=rp;var Ws=class n{constructor(e,t=25e-5){this.isFogExp2=!0,this.name="",this.color=new Ne(e),this.density=t}clone(){return new n(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}};var xo=class extends Ut{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Yt,this.environmentIntensity=1,this.environmentRotation=new Yt,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}},ai=new C,Vi=new C,nh=new C,Gi=new C,pr=new C,mr=new C,Vd=new C,ih=new C,sh=new C,rh=new C,oh=new Mt,ah=new Mt,lh=new Mt,ms=class n{constructor(e=new C,t=new C,i=new C){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,s){s.subVectors(i,t),ai.subVectors(e,t),s.cross(ai);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,i,s,r){ai.subVectors(s,t),Vi.subVectors(i,t),nh.subVectors(e,t);let o=ai.dot(ai),a=ai.dot(Vi),l=ai.dot(nh),c=Vi.dot(Vi),h=Vi.dot(nh),u=o*c-a*a;if(u===0)return r.set(0,0,0),null;let d=1/u,f=(c*l-a*h)*d,m=(o*h-a*l)*d;return r.set(1-f-m,m,f)}static containsPoint(e,t,i,s){return this.getBarycoord(e,t,i,s,Gi)===null?!1:Gi.x>=0&&Gi.y>=0&&Gi.x+Gi.y<=1}static getInterpolation(e,t,i,s,r,o,a,l){return this.getBarycoord(e,t,i,s,Gi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Gi.x),l.addScaledVector(o,Gi.y),l.addScaledVector(a,Gi.z),l)}static getInterpolatedAttribute(e,t,i,s,r,o){return oh.setScalar(0),ah.setScalar(0),lh.setScalar(0),oh.fromBufferAttribute(e,t),ah.fromBufferAttribute(e,i),lh.fromBufferAttribute(e,s),o.setScalar(0),o.addScaledVector(oh,r.x),o.addScaledVector(ah,r.y),o.addScaledVector(lh,r.z),o}static isFrontFacing(e,t,i,s){return ai.subVectors(i,t),Vi.subVectors(e,t),ai.cross(Vi).dot(s)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,s){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,i,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return ai.subVectors(this.c,this.b),Vi.subVectors(this.a,this.b),ai.cross(Vi).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return n.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return n.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,s,r){return n.getInterpolation(e,this.a,this.b,this.c,t,i,s,r)}containsPoint(e){return n.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return n.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let i=this.a,s=this.b,r=this.c,o,a;pr.subVectors(s,i),mr.subVectors(r,i),ih.subVectors(e,i);let l=pr.dot(ih),c=mr.dot(ih);if(l<=0&&c<=0)return t.copy(i);sh.subVectors(e,s);let h=pr.dot(sh),u=mr.dot(sh);if(h>=0&&u<=h)return t.copy(s);let d=l*u-h*c;if(d<=0&&l>=0&&h<=0)return o=l/(l-h),t.copy(i).addScaledVector(pr,o);rh.subVectors(e,r);let f=pr.dot(rh),m=mr.dot(rh);if(m>=0&&f<=m)return t.copy(r);let _=f*c-l*m;if(_<=0&&c>=0&&m<=0)return a=c/(c-m),t.copy(i).addScaledVector(mr,a);let p=h*m-f*u;if(p<=0&&u-h>=0&&f-m>=0)return Vd.subVectors(r,s),a=(u-h)/(u-h+(f-m)),t.copy(s).addScaledVector(Vd,a);let g=1/(p+_+d);return o=_*g,a=d*g,t.copy(i).addScaledVector(pr,o).addScaledVector(mr,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},yn=class{constructor(e=new C(1/0,1/0,1/0),t=new C(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(li.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(li.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let i=li.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let i=e.geometry;if(i!==void 0){let r=i.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,li):li.fromBufferAttribute(r,o),li.applyMatrix4(e.matrixWorld),this.expandByPoint(li);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Ma.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Ma.copy(i.boundingBox)),Ma.applyMatrix4(e.matrixWorld),this.union(Ma)}let s=e.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,li),li.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(oo),xa.subVectors(this.max,oo),gr.subVectors(e.a,oo),_r.subVectors(e.b,oo),yr.subVectors(e.c,oo),us.subVectors(_r,gr),ds.subVectors(yr,_r),Us.subVectors(gr,yr);let t=[0,-us.z,us.y,0,-ds.z,ds.y,0,-Us.z,Us.y,us.z,0,-us.x,ds.z,0,-ds.x,Us.z,0,-Us.x,-us.y,us.x,0,-ds.y,ds.x,0,-Us.y,Us.x,0];return!ch(t,gr,_r,yr,xa)||(t=[1,0,0,0,1,0,0,0,1],!ch(t,gr,_r,yr,xa))?!1:(Sa.crossVectors(us,ds),t=[Sa.x,Sa.y,Sa.z],ch(t,gr,_r,yr,xa))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,li).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(li).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Hi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Hi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Hi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Hi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Hi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Hi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Hi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Hi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Hi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},Hi=[new C,new C,new C,new C,new C,new C,new C,new C],li=new C,Ma=new yn,gr=new C,_r=new C,yr=new C,us=new C,ds=new C,Us=new C,oo=new C,xa=new C,Sa=new C,Fs=new C;function ch(n,e,t,i,s){for(let r=0,o=n.length-3;r<=o;r+=3){Fs.fromArray(n,r);let a=s.x*Math.abs(Fs.x)+s.y*Math.abs(Fs.y)+s.z*Math.abs(Fs.z),l=e.dot(Fs),c=t.dot(Fs),h=i.dot(Fs);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}var qi=vg();function vg(){let n=new ArrayBuffer(4),e=new Float32Array(n),t=new Uint32Array(n),i=new Uint32Array(512),s=new Uint32Array(512);for(let l=0;l<256;++l){let c=l-127;c<-27?(i[l]=0,i[l|256]=32768,s[l]=24,s[l|256]=24):c<-14?(i[l]=1024>>-c-14,i[l|256]=1024>>-c-14|32768,s[l]=-c-1,s[l|256]=-c-1):c<=15?(i[l]=c+15<<10,i[l|256]=c+15<<10|32768,s[l]=13,s[l|256]=13):c<128?(i[l]=31744,i[l|256]=64512,s[l]=24,s[l|256]=24):(i[l]=31744,i[l|256]=64512,s[l]=13,s[l|256]=13)}let r=new Uint32Array(2048),o=new Uint32Array(64),a=new Uint32Array(64);for(let l=1;l<1024;++l){let c=l<<13,h=0;for(;(c&8388608)===0;)c<<=1,h-=8388608;c&=-8388609,h+=947912704,r[l]=c|h}for(let l=1024;l<2048;++l)r[l]=939524096+(l-1024<<13);for(let l=1;l<31;++l)o[l]=l<<23;o[31]=1199570944,o[32]=2147483648;for(let l=33;l<63;++l)o[l]=2147483648+(l-32<<23);o[63]=3347054592;for(let l=1;l<64;++l)l!==32&&(a[l]=1024);return{floatView:e,uint32View:t,baseTable:i,shiftTable:s,mantissaTable:r,exponentTable:o,offsetTable:a}}function bg(n){Math.abs(n)>65504&&ke("DataUtils.toHalfFloat(): Value out of range."),n=tt(n,-65504,65504),qi.floatView[0]=n;let e=qi.uint32View[0],t=e>>23&511;return qi.baseTable[t]+((e&8388607)>>qi.shiftTable[t])}function Mg(n){let e=n>>10;return qi.uint32View[0]=qi.mantissaTable[qi.offsetTable[e]+(n&1023)]+qi.exponentTable[e],qi.floatView[0]}var gs=class{static toHalfFloat(e){return bg(e)}static fromHalfFloat(e){return Mg(e)}},en=new C,Ta=new ae,xg=0,wt=class extends ui{constructor(e,t,i=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:xg++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=ru,this.updateRanges=[],this.gpuType=An,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[i+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)Ta.fromBufferAttribute(this,t),Ta.applyMatrix3(e),this.setXY(t,Ta.x,Ta.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)en.fromBufferAttribute(this,t),en.applyMatrix3(e),this.setXYZ(t,en.x,en.y,en.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)en.fromBufferAttribute(this,t),en.applyMatrix4(e),this.setXYZ(t,en.x,en.y,en.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)en.fromBufferAttribute(this,t),en.applyNormalMatrix(e),this.setXYZ(t,en.x,en.y,en.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)en.fromBufferAttribute(this,t),en.transformDirection(e),this.setXYZ(t,en.x,en.y,en.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=ci(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=bt(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=ci(t,this.array)),t}setX(e,t){return this.normalized&&(t=bt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=ci(t,this.array)),t}setY(e,t){return this.normalized&&(t=bt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=ci(t,this.array)),t}setZ(e,t){return this.normalized&&(t=bt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=ci(t,this.array)),t}setW(e,t){return this.normalized&&(t=bt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=bt(t,this.array),i=bt(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,s){return e*=this.itemSize,this.normalized&&(t=bt(t,this.array),i=bt(i,this.array),s=bt(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this}setXYZW(e,t,i,s,r){return e*=this.itemSize,this.normalized&&(t=bt(t,this.array),i=bt(i,this.array),s=bt(s,this.array),r=bt(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}};var So=class extends wt{constructor(e,t,i){super(new Uint16Array(e),t,i)}};var To=class extends wt{constructor(e,t,i){super(new Uint32Array(e),t,i)}};var ot=class extends wt{constructor(e,t,i){super(new Float32Array(e),t,i)}},Sg=new yn,ao=new C,hh=new C,kn=class{constructor(e=new C,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let i=this.center;t!==void 0?i.copy(t):Sg.setFromPoints(e).getCenter(i);let s=0;for(let r=0,o=e.length;r<o;r++)s=Math.max(s,i.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;ao.subVectors(e,this.center);let t=ao.lengthSq();if(t>this.radius*this.radius){let i=Math.sqrt(t),s=(i-this.radius)*.5;this.center.addScaledVector(ao,s/i),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(hh.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(ao.copy(e.center).add(hh)),this.expandByPoint(ao.copy(e.center).sub(hh))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},Tg=0,Qn=new We,uh=new Ut,vr=new C,Yn=new yn,lo=new yn,fn=new C,pt=class n extends ui{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Tg++}),this.uuid=ei(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Xm(e)?To:So)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let i=this.attributes.normal;if(i!==void 0){let r=new je().getNormalMatrix(e);i.applyNormalMatrix(r),i.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return Qn.makeRotationFromQuaternion(e),this.applyMatrix4(Qn),this}rotateX(e){return Qn.makeRotationX(e),this.applyMatrix4(Qn),this}rotateY(e){return Qn.makeRotationY(e),this.applyMatrix4(Qn),this}rotateZ(e){return Qn.makeRotationZ(e),this.applyMatrix4(Qn),this}translate(e,t,i){return Qn.makeTranslation(e,t,i),this.applyMatrix4(Qn),this}scale(e,t,i){return Qn.makeScale(e,t,i),this.applyMatrix4(Qn),this}lookAt(e){return uh.lookAt(e),uh.updateMatrix(),this.applyMatrix4(uh.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(vr).negate(),this.translate(vr.x,vr.y,vr.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let i=[];for(let s=0,r=e.length;s<r;s++){let o=e[s];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new ot(i,3))}else{let i=Math.min(e.length,t.count);for(let s=0;s<i;s++){let r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&ke("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new yn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Ye("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new C(-1/0,-1/0,-1/0),new C(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,s=t.length;i<s;i++){let r=t[i];Yn.setFromBufferAttribute(r),this.morphTargetsRelative?(fn.addVectors(this.boundingBox.min,Yn.min),this.boundingBox.expandByPoint(fn),fn.addVectors(this.boundingBox.max,Yn.max),this.boundingBox.expandByPoint(fn)):(this.boundingBox.expandByPoint(Yn.min),this.boundingBox.expandByPoint(Yn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Ye('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new kn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Ye("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new C,1/0);return}if(e){let i=this.boundingSphere.center;if(Yn.setFromBufferAttribute(e),t)for(let r=0,o=t.length;r<o;r++){let a=t[r];lo.setFromBufferAttribute(a),this.morphTargetsRelative?(fn.addVectors(Yn.min,lo.min),Yn.expandByPoint(fn),fn.addVectors(Yn.max,lo.max),Yn.expandByPoint(fn)):(Yn.expandByPoint(lo.min),Yn.expandByPoint(lo.max))}Yn.getCenter(i);let s=0;for(let r=0,o=e.count;r<o;r++)fn.fromBufferAttribute(e,r),s=Math.max(s,i.distanceToSquared(fn));if(t)for(let r=0,o=t.length;r<o;r++){let a=t[r],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)fn.fromBufferAttribute(a,c),l&&(vr.fromBufferAttribute(e,c),fn.add(vr)),s=Math.max(s,i.distanceToSquared(fn))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&Ye('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){Ye("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let i=t.position,s=t.normal,r=t.uv,o=this.getAttribute("tangent");(o===void 0||o.count!==i.count)&&(o=new wt(new Float32Array(4*i.count),4),this.setAttribute("tangent",o));let a=[],l=[];for(let y=0;y<i.count;y++)a[y]=new C,l[y]=new C;let c=new C,h=new C,u=new C,d=new ae,f=new ae,m=new ae,_=new C,p=new C;function g(y,S,I){c.fromBufferAttribute(i,y),h.fromBufferAttribute(i,S),u.fromBufferAttribute(i,I),d.fromBufferAttribute(r,y),f.fromBufferAttribute(r,S),m.fromBufferAttribute(r,I),h.sub(c),u.sub(c),f.sub(d),m.sub(d);let D=1/(f.x*m.y-m.x*f.y);isFinite(D)&&(_.copy(h).multiplyScalar(m.y).addScaledVector(u,-f.y).multiplyScalar(D),p.copy(u).multiplyScalar(f.x).addScaledVector(h,-m.x).multiplyScalar(D),a[y].add(_),a[S].add(_),a[I].add(_),l[y].add(p),l[S].add(p),l[I].add(p))}let T=this.groups;T.length===0&&(T=[{start:0,count:e.count}]);for(let y=0,S=T.length;y<S;++y){let I=T[y],D=I.start,F=I.count;for(let R=D,P=D+F;R<P;R+=3)g(e.getX(R+0),e.getX(R+1),e.getX(R+2))}let x=new C,v=new C,M=new C,E=new C;function A(y){M.fromBufferAttribute(s,y),E.copy(M);let S=a[y];x.copy(S),x.sub(M.multiplyScalar(M.dot(S))).normalize(),v.crossVectors(E,S);let D=v.dot(l[y])<0?-1:1;o.setXYZW(y,x.x,x.y,x.z,D)}for(let y=0,S=T.length;y<S;++y){let I=T[y],D=I.start,F=I.count;for(let R=D,P=D+F;R<P;R+=3)A(e.getX(R+0)),A(e.getX(R+1)),A(e.getX(R+2))}this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0||i.count!==t.count)i=new wt(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let d=0,f=i.count;d<f;d++)i.setXYZ(d,0,0,0);let s=new C,r=new C,o=new C,a=new C,l=new C,c=new C,h=new C,u=new C;if(e)for(let d=0,f=e.count;d<f;d+=3){let m=e.getX(d+0),_=e.getX(d+1),p=e.getX(d+2);s.fromBufferAttribute(t,m),r.fromBufferAttribute(t,_),o.fromBufferAttribute(t,p),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),a.fromBufferAttribute(i,m),l.fromBufferAttribute(i,_),c.fromBufferAttribute(i,p),a.add(h),l.add(h),c.add(h),i.setXYZ(m,a.x,a.y,a.z),i.setXYZ(_,l.x,l.y,l.z),i.setXYZ(p,c.x,c.y,c.z)}else for(let d=0,f=t.count;d<f;d+=3)s.fromBufferAttribute(t,d+0),r.fromBufferAttribute(t,d+1),o.fromBufferAttribute(t,d+2),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),i.setXYZ(d+0,h.x,h.y,h.z),i.setXYZ(d+1,h.x,h.y,h.z),i.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)fn.fromBufferAttribute(e,t),fn.normalize(),e.setXYZ(t,fn.x,fn.y,fn.z)}toNonIndexed(){function e(a,l){let c=a.array,h=a.itemSize,u=a.normalized,d=new c.constructor(l.length*h),f=0,m=0;for(let _=0,p=l.length;_<p;_++){a.isInterleavedBufferAttribute?f=l[_]*a.data.stride+a.offset:f=l[_]*h;for(let g=0;g<h;g++)d[m++]=c[f++]}return new wt(d,h,u)}if(this.index===null)return ke("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new n,i=this.index.array,s=this.attributes;for(let a in s){let l=s[a],c=e(l,i);t.setAttribute(a,c)}let r=this.morphAttributes;for(let a in r){let l=[],c=r[a];for(let h=0,u=c.length;h<u;h++){let d=c[h],f=e(d,i);l.push(f)}t.morphAttributes[a]=l}t.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,l=o.length;a<l;a++){let c=o[a];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let i=this.attributes;for(let l in i){let c=i[l];e.data.attributes[l]=c.toJSON(e.data)}let s={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let u=0,d=c.length;u<d;u++){let f=c[u];h.push(f.toJSON(e.data))}h.length>0&&(s[l]=h,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(e.data.boundingSphere=a.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let i=e.index;i!==null&&this.setIndex(i.clone());let s=e.attributes;for(let c in s){let h=s[c];this.setAttribute(c,h.clone(t))}let r=e.morphAttributes;for(let c in r){let h=[],u=r[c];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;let o=e.groups;for(let c=0,h=o.length;c<h;c++){let u=o[c];this.addGroup(u.start,u.count,u.materialIndex)}let a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}},Dr=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=ru,this.updateRanges=[],this.version=0,this.uuid=ei()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,i){e*=this.stride,i*=t.stride;for(let s=0,r=this.stride;s<r;s++)this.array[e+s]=t.array[i+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ei()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(t,this.stride);return i.setUsage(this.usage),i}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ei()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer)));let t={uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride};return t.usage=this.usage,t}},Nn=new C,Nr=class n{constructor(e,t,i,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=i,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,i=this.data.count;t<i;t++)Nn.fromBufferAttribute(this,t),Nn.applyMatrix4(e),this.setXYZ(t,Nn.x,Nn.y,Nn.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)Nn.fromBufferAttribute(this,t),Nn.applyNormalMatrix(e),this.setXYZ(t,Nn.x,Nn.y,Nn.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)Nn.fromBufferAttribute(this,t),Nn.transformDirection(e),this.setXYZ(t,Nn.x,Nn.y,Nn.z);return this}getComponent(e,t){let i=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(i=ci(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=bt(i,this.array)),this.data.array[e*this.data.stride+this.offset+t]=i,this}setX(e,t){return this.normalized&&(t=bt(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=bt(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=bt(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=bt(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=ci(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=ci(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=ci(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=ci(t,this.array)),t}setXY(e,t,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=bt(t,this.array),i=bt(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this}setXYZ(e,t,i,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=bt(t,this.array),i=bt(i,this.array),s=bt(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=s,this}setXYZW(e,t,i,s,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=bt(t,this.array),i=bt(i,this.array),s=bt(s,this.array),r=bt(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=s,this.data.array[e+3]=r,this}clone(e){if(e===void 0){bo("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let i=0;i<this.count;i++){let s=i*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return new wt(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new n(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){bo("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let i=0;i<this.count;i++){let s=i*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},dh=new C,wg=new C,Eg=new je,Un=class{constructor(e=new C(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,s){return this.normal.set(e,t,i),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){let s=dh.subVectors(i,t).cross(wg.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,i=!0){let s=e.delta(dh),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let o=-(e.start.dot(this.normal)+this.constant)/r;return i===!0&&(o<0||o>1)?null:t.copy(e.start).addScaledVector(s,o)}intersectsLine(e){let t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let i=t||Eg.getNormalMatrix(e),s=this.coplanarPoint(dh).applyMatrix4(e),r=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}},Ag=0,zn=class extends ui{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Ag++}),this.uuid=ei(),this.name="",this.type="Material",this.blending=Hr,this.side=Hn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Gh,this.blendDst=Hh,this.blendEquation=js,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ne(0,0,0),this.blendAlpha=0,this.depthFunc=wr,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=$f,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=qa,this.stencilZFail=qa,this.stencilZPass=qa,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let i=e[t];if(i===void 0){ke(`Material: parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){ke(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector2&&i&&i.isVector2||s&&s.isEuler&&i&&i.isEuler||s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[t]=i}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,i.blending=this.blending,i.side=this.side,i.shadowSide=this.shadowSide,i.vertexColors=this.vertexColors,i.opacity=this.opacity,i.transparent=this.transparent,i.blendSrc=this.blendSrc,i.blendDst=this.blendDst,i.blendEquation=this.blendEquation,i.blendSrcAlpha=this.blendSrcAlpha,i.blendDstAlpha=this.blendDstAlpha,i.blendEquationAlpha=this.blendEquationAlpha,i.blendColor=this.blendColor.getHex(),i.blendAlpha=this.blendAlpha,i.depthFunc=this.depthFunc,i.depthTest=this.depthTest,i.depthWrite=this.depthWrite,i.colorWrite=this.colorWrite,i.clipIntersection=this.clipIntersection,i.clipShadows=this.clipShadows,i.stencilWriteMask=this.stencilWriteMask,i.stencilFunc=this.stencilFunc,i.stencilRef=this.stencilRef,i.stencilFuncMask=this.stencilFuncMask,i.stencilFail=this.stencilFail,i.stencilZFail=this.stencilZFail,i.stencilZPass=this.stencilZPass,i.stencilWrite=this.stencilWrite,i.polygonOffset=this.polygonOffset,i.polygonOffsetFactor=this.polygonOffsetFactor,i.polygonOffsetUnits=this.polygonOffsetUnits,i.dithering=this.dithering,i.alphaTest=this.alphaTest,i.alphaHash=this.alphaHash,i.alphaToCoverage=this.alphaToCoverage,i.premultipliedAlpha=this.premultipliedAlpha,i.forceSinglePass=this.forceSinglePass,i.allowOverride=this.allowOverride,i.visible=this.visible,i.toneMapped=this.toneMapped,i.name=this.name,this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(i.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(i.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(i.rotation=this.rotation),this.depthPacking!==void 0&&(i.depthPacking=this.depthPacking),this.linewidth!==void 0&&(i.linewidth=this.linewidth),this.linecap!==void 0&&(i.linecap=this.linecap),this.linejoin!==void 0&&(i.linejoin=this.linejoin),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.wireframe!==void 0&&(i.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(i.flatShading=this.flatShading),this.fog!==void 0&&(i.fog=this.fog),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(r){let o=[];for(let a in r){let l=r[a];delete l.metadata,o.push(l)}return o}if(t){let r=s(e.textures),o=s(e.images);r.length>0&&(i.textures=r),o.length>0&&(i.images=o)}return i}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new Ne().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(i=>new Un().fromJSON(i))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let i=e.normalScale;Array.isArray(i)===!1&&(i=[i,i]),this.normalScale=new ae().fromArray(i)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new ae().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,i=null;if(t!==null){let s=t.length;i=new Array(s);for(let r=0;r!==s;++r)i[r]=t[r].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}};var Wi=new C,fh=new C,wa=new C,Ea=new C,wi=class{constructor(e=new C,t=new C(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Wi)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=Wi.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Wi.copy(this.origin).addScaledVector(this.direction,t),Wi.distanceToSquared(e))}distanceSqToSegment(e,t,i,s){fh.copy(e).add(t).multiplyScalar(.5),wa.copy(t).sub(e).normalize(),Ea.copy(this.origin).sub(fh);let r=e.distanceTo(t)*.5,o=-this.direction.dot(wa),a=Ea.dot(this.direction),l=-Ea.dot(wa),c=Ea.lengthSq(),h=Math.abs(1-o*o),u,d,f,m;if(h>0)if(u=o*l-a,d=o*a-l,m=r*h,u>=0)if(d>=-m)if(d<=m){let _=1/h;u*=_,d*=_,f=u*(u+o*d+2*a)+d*(o*u+d+2*l)+c}else d=r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*l)+c;else d=-r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*l)+c;else d<=-m?(u=Math.max(0,-(-o*r+a)),d=u>0?-r:Math.min(Math.max(-r,-l),r),f=-u*u+d*(d+2*l)+c):d<=m?(u=0,d=Math.min(Math.max(-r,-l),r),f=d*(d+2*l)+c):(u=Math.max(0,-(o*r+a)),d=u>0?r:Math.min(Math.max(-r,-l),r),f=-u*u+d*(d+2*l)+c);else d=o>0?-r:r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(fh).addScaledVector(wa,d),f}intersectSphere(e,t){if(e.radius<0)return null;Wi.subVectors(e.center,this.origin);let i=Wi.dot(this.direction),s=Wi.dot(Wi)-i*i,r=e.radius*e.radius;if(s>r)return null;let o=Math.sqrt(r-s),a=i-o,l=i+o;return l<0?null:a<0?this.at(l,t):this.at(a,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){let i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,s,r,o,a,l,c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(i=(e.min.x-d.x)*c,s=(e.max.x-d.x)*c):(i=(e.max.x-d.x)*c,s=(e.min.x-d.x)*c),h>=0?(r=(e.min.y-d.y)*h,o=(e.max.y-d.y)*h):(r=(e.max.y-d.y)*h,o=(e.min.y-d.y)*h),i>o||r>s||((r>i||isNaN(i))&&(i=r),(o<s||isNaN(s))&&(s=o),u>=0?(a=(e.min.z-d.z)*u,l=(e.max.z-d.z)*u):(a=(e.max.z-d.z)*u,l=(e.min.z-d.z)*u),i>l||a>s)||((a>i||i!==i)&&(i=a),(l<s||s!==s)&&(s=l),s<0)?null:this.at(i>=0?i:s,t)}intersectsBox(e){return this.intersectBox(e,Wi)!==null}intersectTriangle(e,t,i,s,r){let o=this.origin,a=this.direction,l=a.x,c=a.y,h=a.z,u=e.x-o.x,d=e.y-o.y,f=e.z-o.z,m=t.x-o.x,_=t.y-o.y,p=t.z-o.z,g=i.x-o.x,T=i.y-o.y,x=i.z-o.z,v=Math.abs(l),M=Math.abs(c),E=Math.abs(h),A,y,S,I,D,F,R,P,N,O,X,J;if(v>=M&&v>=E?(S=l,F=u,N=m,J=g,l>=0?(A=c,y=h,I=d,D=f,R=_,P=p,O=T,X=x):(A=h,y=c,I=f,D=d,R=p,P=_,O=x,X=T)):M>=E?(S=c,F=d,N=_,J=T,c>=0?(A=h,y=l,I=f,D=u,R=p,P=m,O=x,X=g):(A=l,y=h,I=u,D=f,R=m,P=p,O=g,X=x)):(S=h,F=f,N=p,J=x,h>=0?(A=l,y=c,I=u,D=d,R=m,P=_,O=g,X=T):(A=c,y=l,I=d,D=u,R=_,P=m,O=T,X=g)),S===0)return null;let z=A/S,B=y/S,W=1/S,ne=I-z*F,oe=D-B*F,Ue=R-z*N,$e=P-B*N,Xe=O-z*J,Z=X-B*J,Q=Xe*$e-Z*Ue,de=ne*Z-oe*Xe,De=Ue*oe-$e*ne;if(s){if(Q<0||de<0||De<0)return null}else if((Q<0||de<0||De<0)&&(Q>0||de>0||De>0))return null;let pe=Q+de+De;if(pe===0)return null;let xe=W*(Q*F+de*N+De*J);return(pe>0?xe<0:xe>0)?null:this.at(xe/pe,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},wn=class extends zn{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ne(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Yt,this.combine=Wh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},Gd=new We,Os=new wi,Aa=new kn,Hd=new C,Ra=new C,Ca=new C,Pa=new C,ph=new C,Ia=new C,Wd=new C,La=new C,ge=class extends Ut{constructor(e=new pt,t=new wn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){let s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){let i=this.geometry,s=i.attributes.position,r=i.morphAttributes.position,o=i.morphTargetsRelative;t.fromBufferAttribute(s,e);let a=this.morphTargetInfluences;if(r&&a){Ia.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let h=a[l],u=r[l];h!==0&&(ph.fromBufferAttribute(u,e),o?Ia.addScaledVector(ph,h):Ia.addScaledVector(ph.sub(t),h))}t.add(Ia)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let i=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Aa.copy(i.boundingSphere),Aa.applyMatrix4(r),Os.copy(e.ray).recast(e.near),!(Aa.containsPoint(Os.origin)===!1&&(Os.intersectSphere(Aa,Hd)===null||Os.origin.distanceToSquared(Hd)>(e.far-e.near)**2))&&(Gd.copy(r).invert(),Os.copy(e.ray).applyMatrix4(Gd),!(i.boundingBox!==null&&Os.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,Os)))}_computeIntersections(e,t,i){let s,r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,f=r.drawRange;if(a!==null)if(Array.isArray(o))for(let m=0,_=d.length;m<_;m++){let p=d[m],g=o[p.materialIndex],T=Math.max(p.start,f.start),x=Math.min(a.count,Math.min(p.start+p.count,f.start+f.count));for(let v=T,M=x;v<M;v+=3){let E=a.getX(v),A=a.getX(v+1),y=a.getX(v+2);s=Da(this,g,e,i,c,h,u,E,A,y),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=p.materialIndex,t.push(s))}}else{let m=Math.max(0,f.start),_=Math.min(a.count,f.start+f.count);for(let p=m,g=_;p<g;p+=3){let T=a.getX(p),x=a.getX(p+1),v=a.getX(p+2);s=Da(this,o,e,i,c,h,u,T,x,v),s&&(s.faceIndex=Math.floor(p/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(o))for(let m=0,_=d.length;m<_;m++){let p=d[m],g=o[p.materialIndex],T=Math.max(p.start,f.start),x=Math.min(l.count,Math.min(p.start+p.count,f.start+f.count));for(let v=T,M=x;v<M;v+=3){let E=v,A=v+1,y=v+2;s=Da(this,g,e,i,c,h,u,E,A,y),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=p.materialIndex,t.push(s))}}else{let m=Math.max(0,f.start),_=Math.min(l.count,f.start+f.count);for(let p=m,g=_;p<g;p+=3){let T=p,x=p+1,v=p+2;s=Da(this,o,e,i,c,h,u,T,x,v),s&&(s.faceIndex=Math.floor(p/3),t.push(s))}}}};function Rg(n,e,t,i,s,r,o,a){let l;if(e.side===vn?l=i.intersectTriangle(o,r,s,!0,a):l=i.intersectTriangle(s,r,o,e.side===Hn,a),l===null)return null;La.copy(a),La.applyMatrix4(n.matrixWorld);let c=t.ray.origin.distanceTo(La);return c<t.near||c>t.far?null:{distance:c,point:La.clone(),object:n}}function Da(n,e,t,i,s,r,o,a,l,c){n.getVertexPosition(a,Ra),n.getVertexPosition(l,Ca),n.getVertexPosition(c,Pa);let h=Rg(n,e,t,i,Ra,Ca,Pa,Wd);if(h){let u=new C;ms.getBarycoord(Wd,Ra,Ca,Pa,u),s&&(h.uv=ms.getInterpolatedAttribute(s,a,l,c,u,new ae)),r&&(h.uv1=ms.getInterpolatedAttribute(r,a,l,c,u,new ae)),o&&(h.normal=ms.getInterpolatedAttribute(o,a,l,c,u,new C),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));let d={a,b:l,c,normal:new C,materialIndex:0};ms.getNormal(Ra,Ca,Pa,d.normal),h.face=d,h.barycoord=u}return h}var co=new Mt,Xd=new Mt,qd=new Mt,Cg=new Mt,Yd=new We,Na=new C,mh=new kn,$d=new We,gh=new wi,wo=class extends ge{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=Sh,this.bindMatrix=new We,this.bindMatrixInverse=new We,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){let e=this.geometry;this.boundingBox===null&&(this.boundingBox=new yn),this.boundingBox.makeEmpty();let t=e.getAttribute("position");for(let i=0;i<t.count;i++)this.getVertexPosition(i,Na),this.boundingBox.expandByPoint(Na)}computeBoundingSphere(){let e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new kn),this.boundingSphere.makeEmpty();let t=e.getAttribute("position");for(let i=0;i<t.count;i++)this.getVertexPosition(i,Na),this.boundingSphere.expandByPoint(Na)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){let i=this.material,s=this.matrixWorld;i!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),mh.copy(this.boundingSphere),mh.applyMatrix4(s),e.ray.intersectsSphere(mh)!==!1&&($d.copy(s).invert(),gh.copy(e.ray).applyMatrix4($d),!(this.boundingBox!==null&&gh.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,gh)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){let e=new Mt,t=this.geometry.attributes.skinWeight;for(let i=0,s=t.count;i<s;i++){e.fromBufferAttribute(t,i);let r=1/e.manhattanLength();r!==1/0?e.multiplyScalar(r):e.set(1,0,0,0),t.setXYZW(i,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===Sh?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===Wf?this.bindMatrixInverse.copy(this.bindMatrix).invert():ke("SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){let i=this.skeleton,s=this.geometry;Xd.fromBufferAttribute(s.attributes.skinIndex,e),qd.fromBufferAttribute(s.attributes.skinWeight,e),t.isVector4?(co.copy(t),t.set(0,0,0,0)):(co.set(...t,1),t.set(0,0,0)),co.applyMatrix4(this.bindMatrix);for(let r=0;r<4;r++){let o=qd.getComponent(r);if(o!==0){let a=Xd.getComponent(r);Yd.multiplyMatrices(i.bones[a].matrixWorld,i.boneInverses[a]),t.addScaledVector(Cg.copy(co).applyMatrix4(Yd),o)}}return t.isVector4&&(t.w=co.w),t.applyMatrix4(this.bindMatrixInverse)}},Ur=class extends Ut{constructor(){super(),this.isBone=!0,this.type="Bone"}},_s=class extends on{constructor(e=null,t=1,i=1,s,r,o,a,l,c=qt,h=qt,u,d){super(null,o,a,l,c,h,s,r,u,d),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},Zd=new We,Pg=new We,Eo=class n{constructor(e=[],t=[]){this.uuid=ei(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){let e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){ke("Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let i=0,s=this.bones.length;i<s;i++)this.boneInverses.push(new We)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){let i=new We;this.bones[e]&&i.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(i)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){let i=this.bones[e];i&&i.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){let i=this.bones[e];i&&(i.parent&&i.parent.isBone?(i.matrix.copy(i.parent.matrixWorld).invert(),i.matrix.multiply(i.matrixWorld)):i.matrix.copy(i.matrixWorld),i.matrix.decompose(i.position,i.quaternion,i.scale))}}update(){let e=this.bones,t=this.boneInverses,i=this.boneMatrices,s=this.boneTexture;for(let r=0,o=e.length;r<o;r++){let a=e[r]?e[r].matrixWorld:Pg;Zd.multiplyMatrices(a,t[r]),Zd.toArray(i,r*16)}s!==null&&(s.needsUpdate=!0)}clone(){return new n(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);let t=new Float32Array(e*e*4);t.set(this.boneMatrices);let i=new _s(t,e,e,Kn,An);return i.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=i,this}getBoneByName(e){for(let t=0,i=this.bones.length;t<i;t++){let s=this.bones[t];if(s.name===e)return s}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let i=0,s=e.bones.length;i<s;i++){let r=e.bones[i],o=t[r];o===void 0&&(ke("Skeleton: No bone found with UUID:",r),o=new Ur),this.bones.push(o),this.boneInverses.push(new We().fromArray(e.boneInverses[i]))}return this.init(),this}toJSON(){let e={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;let t=this.bones,i=this.boneInverses;for(let s=0,r=t.length;s<r;s++){let o=t[s];e.bones.push(o.uuid);let a=i[s];e.boneInverses.push(a.toArray())}return e}},$i=class extends wt{constructor(e,t,i,s=1){super(e,t,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},br=new We,Kd=new We,Ua=[],Jd=new yn,Ig=new We,ho=new ge,uo=new kn,Ei=class extends ge{constructor(e,t,i){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new $i(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<i;s++)this.setMatrixAt(s,Ig)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new yn),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,br),Jd.copy(e.boundingBox).applyMatrix4(br),this.boundingBox.union(Jd)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new kn),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,br),uo.copy(e.boundingSphere).applyMatrix4(br),this.boundingSphere.union(uo)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let i=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=i.length+1,o=e*r+1;for(let a=0;a<i.length;a++)i[a]=s[o+a]}raycast(e,t){let i=this.matrixWorld,s=this.count;if(ho.geometry=this.geometry,ho.material=this.material,ho.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),uo.copy(this.boundingSphere),uo.applyMatrix4(i),e.ray.intersectsSphere(uo)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,br),Kd.multiplyMatrices(i,br),ho.matrixWorld=Kd,ho.raycast(e,Ua);for(let o=0,a=Ua.length;o<a;o++){let l=Ua[o];l.instanceId=r,l.object=this,t.push(l)}Ua.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new $i(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){let i=t.morphTargetInfluences,s=i.length+1;this.morphTexture===null&&(this.morphTexture=new _s(new Float32Array(s*this.count),s,this.count,Cl,An));let r=this.morphTexture.source.data.data,o=0;for(let c=0;c<i.length;c++)o+=i[c];let a=this.geometry.morphTargetsRelative?1:1-o,l=s*e;return r[l]=a,r.set(i,l+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},Bs=new kn,Lg=new ae(.5,.5),Fa=new C,Fr=class{constructor(e=new Un,t=new Un,i=new Un,s=new Un,r=new Un,o=new Un){this.planes=[e,t,i,s,r,o]}set(e,t,i,s,r,o){let a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(i),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(e){let t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=hi,i=!1){let s=this.planes,r=e.elements,o=r[0],a=r[1],l=r[2],c=r[3],h=r[4],u=r[5],d=r[6],f=r[7],m=r[8],_=r[9],p=r[10],g=r[11],T=r[12],x=r[13],v=r[14],M=r[15];if(s[0].setComponents(c-o,f-h,g-m,M-T).normalize(),s[1].setComponents(c+o,f+h,g+m,M+T).normalize(),s[2].setComponents(c+a,f+u,g+_,M+x).normalize(),s[3].setComponents(c-a,f-u,g-_,M-x).normalize(),i)s[4].setComponents(l,d,p,v).normalize(),s[5].setComponents(c-l,f-d,g-p,M-v).normalize();else if(s[4].setComponents(c-l,f-d,g-p,M-v).normalize(),t===hi)s[5].setComponents(c+l,f+d,g+p,M+v).normalize();else if(t===Ar)s[5].setComponents(l,d,p,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Bs.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Bs.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Bs)}intersectsSprite(e){Bs.center.set(0,0,0);let t=Lg.distanceTo(e.center);return Bs.radius=.7071067811865476+t,Bs.applyMatrix4(e.matrixWorld),this.intersectsSphere(Bs)}intersectsSphere(e){let t=this.planes,i=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(i)<s)return!1;return!0}intersectsBox(e){let t=this.planes;for(let i=0;i<6;i++){let s=t[i];if(Fa.x=s.normal.x>0?e.max.x:e.min.x,Fa.y=s.normal.y>0?e.max.y:e.min.y,Fa.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(Fa)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var Or=class extends zn{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Ne(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},sl=new C,rl=new C,jd=new We,fo=new wi,Oa=new kn,_h=new C,Qd=new C,Xs=class extends Ut{constructor(e=new pt,t=new Or){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,i=[0];for(let s=1,r=t.count;s<r;s++)sl.fromBufferAttribute(t,s-1),rl.fromBufferAttribute(t,s),i[s]=i[s-1],i[s]+=sl.distanceTo(rl);e.setAttribute("lineDistance",new ot(i,1))}else ke("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let i=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Oa.copy(i.boundingSphere),Oa.applyMatrix4(s),Oa.radius+=r,e.ray.intersectsSphere(Oa)===!1)return;jd.copy(s).invert(),fo.copy(e.ray).applyMatrix4(jd);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,h=i.index,d=i.attributes.position;if(h!==null){let f=Math.max(0,o.start),m=Math.min(h.count,o.start+o.count);for(let _=f,p=m-1;_<p;_+=c){let g=h.getX(_),T=h.getX(_+1),x=Ba(this,e,fo,l,g,T,_);x&&t.push(x)}if(this.isLineLoop){let _=h.getX(m-1),p=h.getX(f),g=Ba(this,e,fo,l,_,p,m-1);g&&t.push(g)}}else{let f=Math.max(0,o.start),m=Math.min(d.count,o.start+o.count);for(let _=f,p=m-1;_<p;_+=c){let g=Ba(this,e,fo,l,_,_+1,_);g&&t.push(g)}if(this.isLineLoop){let _=Ba(this,e,fo,l,m-1,f,m-1);_&&t.push(_)}}}updateMorphTargets(){let t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){let s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function Ba(n,e,t,i,s,r,o){let a=n.geometry.attributes.position;if(sl.fromBufferAttribute(a,s),rl.fromBufferAttribute(a,r),t.distanceSqToSegment(sl,rl,_h,Qd)>i)return;_h.applyMatrix4(n.matrixWorld);let c=e.ray.origin.distanceTo(_h);if(!(c<e.near||c>e.far))return{distance:c,point:Qd.clone().applyMatrix4(n.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:n}}var ef=new C,tf=new C,Ao=class extends Xs{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,i=[];for(let s=0,r=t.count;s<r;s+=2)ef.fromBufferAttribute(t,s),tf.fromBufferAttribute(t,s+1),i[s]=s===0?0:i[s-1],i[s+1]=i[s]+ef.distanceTo(tf);e.setAttribute("lineDistance",new ot(i,1))}else ke("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}},Ro=class extends Xs{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}},ys=class extends zn{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Ne(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},nf=new We,Rh=new wi,ka=new kn,za=new C,Zi=class extends Ut{constructor(e=new pt,t=new ys){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let i=this.geometry,s=this.matrixWorld,r=e.params.Points.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),ka.copy(i.boundingSphere),ka.applyMatrix4(s),ka.radius+=r,e.ray.intersectsSphere(ka)===!1)return;nf.copy(s).invert(),Rh.copy(e.ray).applyMatrix4(nf);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=i.index,u=i.attributes.position;if(c!==null){let d=Math.max(0,o.start),f=Math.min(c.count,o.start+o.count);for(let m=d,_=f;m<_;m++){let p=c.getX(m);za.fromBufferAttribute(u,p),sf(za,p,l,s,e,t,this)}}else{let d=Math.max(0,o.start),f=Math.min(u.count,o.start+o.count);for(let m=d,_=f;m<_;m++)za.fromBufferAttribute(u,m),sf(za,m,l,s,e,t,this)}}updateMorphTargets(){let t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){let s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function sf(n,e,t,i,s,r,o){let a=Rh.distanceSqToPoint(n);if(a<t){let l=new C;Rh.closestPointToPoint(n,l),l.applyMatrix4(i);let c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:o})}}var Co=class extends on{constructor(e=[],t=Es,i,s,r,o,a,l,c,h){super(e,t,i,s,r,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},an=class extends on{constructor(e,t,i,s,r,o,a,l,c){super(e,t,i,s,r,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}};var vs=class extends on{constructor(e,t,i=mi,s,r,o,a=qt,l=qt,c,h=Ti,u=1){if(h!==Ti&&h!==Rs)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let d={width:e,height:t,depth:u};super(d,s,r,o,a,l,h,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Pr(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}},ol=class extends vs{constructor(e,t=mi,i=Es,s,r,o=qt,a=qt,l,c=Ti){let h={width:e,height:e,depth:1},u=[h,h,h,h,h,h];super(e,e,t,i,s,r,o,a,l,c),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},Po=class extends on{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},Dt=class n extends pt{constructor(e=1,t=1,i=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:s,heightSegments:r,depthSegments:o};let a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);let l=[],c=[],h=[],u=[],d=0,f=0;m("z","y","x",-1,-1,i,t,e,o,r,0),m("z","y","x",1,-1,i,t,-e,o,r,1),m("x","z","y",1,1,e,i,t,s,o,2),m("x","z","y",1,-1,e,i,-t,s,o,3),m("x","y","z",1,-1,e,t,i,s,r,4),m("x","y","z",-1,-1,e,t,-i,s,r,5),this.setIndex(l),this.setAttribute("position",new ot(c,3)),this.setAttribute("normal",new ot(h,3)),this.setAttribute("uv",new ot(u,2));function m(_,p,g,T,x,v,M,E,A,y,S){let I=v/A,D=M/y,F=v/2,R=M/2,P=E/2,N=A+1,O=y+1,X=0,J=0,z=new C;for(let B=0;B<O;B++){let W=B*D-R;for(let ne=0;ne<N;ne++){let oe=ne*I-F;z[_]=oe*T,z[p]=W*x,z[g]=P,c.push(z.x,z.y,z.z),z[_]=0,z[p]=0,z[g]=E>0?1:-1,h.push(z.x,z.y,z.z),u.push(ne/A),u.push(1-B/y),X+=1}}for(let B=0;B<y;B++)for(let W=0;W<A;W++){let ne=d+W+N*B,oe=d+W+N*(B+1),Ue=d+(W+1)+N*(B+1),$e=d+(W+1)+N*B;l.push(ne,oe,$e),l.push(oe,Ue,$e),J+=6}a.addGroup(f,J,S),f+=J,d+=X}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};var Ai=class n extends pt{constructor(e=1,t=32,i=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:i,thetaLength:s},t=Math.max(3,t);let r=[],o=[],a=[],l=[],c=new C,h=new ae;o.push(0,0,0),a.push(0,0,1),l.push(.5,.5);for(let u=0,d=3;u<=t;u++,d+=3){let f=i+u/t*s;c.x=e*Math.cos(f),c.y=e*Math.sin(f),o.push(c.x,c.y,c.z),a.push(0,0,1),h.x=(o[d]/e+1)/2,h.y=(o[d+1]/e+1)/2,l.push(h.x,h.y)}for(let u=1;u<=t;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new ot(o,3)),this.setAttribute("normal",new ot(a,3)),this.setAttribute("uv",new ot(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.radius,e.segments,e.thetaStart,e.thetaLength)}},xt=class n extends pt{constructor(e=1,t=1,i=1,s=32,r=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:i,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:l};let c=this;s=Math.floor(s),r=Math.floor(r);let h=[],u=[],d=[],f=[],m=0,_=[],p=i/2,g=0;T(),o===!1&&(e>0&&x(!0),t>0&&x(!1)),this.setIndex(h),this.setAttribute("position",new ot(u,3)),this.setAttribute("normal",new ot(d,3)),this.setAttribute("uv",new ot(f,2));function T(){let v=new C,M=new C,E=0,A=(t-e)/i;for(let y=0;y<=r;y++){let S=[],I=y/r,D=I*(t-e)+e;for(let F=0;F<=s;F++){let R=F/s,P=R*l+a,N=Math.sin(P),O=Math.cos(P);M.x=D*N,M.y=-I*i+p,M.z=D*O,u.push(M.x,M.y,M.z),v.set(N,A,O).normalize(),d.push(v.x,v.y,v.z),f.push(R,1-I),S.push(m++)}_.push(S)}for(let y=0;y<s;y++)for(let S=0;S<r;S++){let I=_[S][y],D=_[S+1][y],F=_[S+1][y+1],R=_[S][y+1];(e>0||S!==0)&&(h.push(I,D,R),E+=3),(t>0||S!==r-1)&&(h.push(D,F,R),E+=3)}c.addGroup(g,E,0),g+=E}function x(v){let M=m,E=new ae,A=new C,y=0,S=v===!0?e:t,I=v===!0?1:-1;for(let F=1;F<=s;F++)u.push(0,p*I,0),d.push(0,I,0),f.push(.5,.5),m++;let D=m;for(let F=0;F<=s;F++){let P=F/s*l+a,N=Math.cos(P),O=Math.sin(P);A.x=S*O,A.y=p*I,A.z=S*N,u.push(A.x,A.y,A.z),d.push(0,I,0),E.x=N*.5+.5,E.y=O*.5*I+.5,f.push(E.x,E.y),m++}for(let F=0;F<s;F++){let R=M+F,P=D+F;v===!0?h.push(P,P+1,R):h.push(P+1,P,R),y+=3}c.addGroup(g,y,v===!0?1:2),g+=y}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},Io=class n extends xt{constructor(e=1,t=1,i=32,s=1,r=!1,o=0,a=Math.PI*2){super(0,e,t,i,s,r,o,a),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:i,heightSegments:s,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(e){return new n(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}};var $n=class{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){ke("Curve: .getPoint() not implemented.")}getPointAt(e,t){let i=this.getUtoTmapping(e);return this.getPoint(i,t)}getPoints(e=5){let t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return t}getSpacedPoints(e=5){let t=[];for(let i=0;i<=e;i++)t.push(this.getPointAt(i/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],i,s=this.getPoint(0),r=0;t.push(0);for(let o=1;o<=e;o++)i=this.getPoint(o/e),r+=i.distanceTo(s),t.push(r),s=i;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){let i=this.getLengths(),s=0,r=i.length,o;t?o=t:o=e*i[r-1];let a=0,l=r-1,c;for(;a<=l;)if(s=Math.floor(a+(l-a)/2),c=i[s]-o,c<0)a=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,i[s]===o)return s/(r-1);let h=i[s],d=i[s+1]-h,f=(o-h)/d;return(s+f)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);let o=this.getPoint(s),a=this.getPoint(r),l=t||(o.isVector2?new ae:new C);return l.copy(a).sub(o).normalize(),l}getTangentAt(e,t){let i=this.getUtoTmapping(e);return this.getTangent(i,t)}computeFrenetFrames(e,t=!1){let i=new C,s=[],r=[],o=[],a=new C,l=new We;for(let f=0;f<=e;f++){let m=f/e;s[f]=this.getTangentAt(m,new C)}r[0]=new C,o[0]=new C;let c=Number.MAX_VALUE,h=Math.abs(s[0].x),u=Math.abs(s[0].y),d=Math.abs(s[0].z);h<=c&&(c=h,i.set(1,0,0)),u<=c&&(c=u,i.set(0,1,0)),d<=c&&i.set(0,0,1),a.crossVectors(s[0],i).normalize(),r[0].crossVectors(s[0],a),o[0].crossVectors(s[0],r[0]);for(let f=1;f<=e;f++){if(r[f]=r[f-1].clone(),o[f]=o[f-1].clone(),a.crossVectors(s[f-1],s[f]),a.length()>Number.EPSILON){a.normalize();let m=Math.acos(tt(s[f-1].dot(s[f]),-1,1));r[f].applyMatrix4(l.makeRotationAxis(a,m))}o[f].crossVectors(s[f],r[f])}if(t===!0){let f=Math.acos(tt(r[0].dot(r[e]),-1,1));f/=e,s[0].dot(a.crossVectors(r[0],r[e]))>0&&(f=-f);for(let m=1;m<=e;m++)r[m].applyMatrix4(l.makeRotationAxis(s[m],f*m)),o[m].crossVectors(s[m],r[m])}return{tangents:s,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},Br=class extends $n{constructor(e=0,t=0,i=1,s=1,r=0,o=Math.PI*2,a=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=i,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=l}getPoint(e,t=new ae){let i=t,s=Math.PI*2,r=this.aEndAngle-this.aStartAngle,o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(o?r=0:r=s),this.aClockwise===!0&&!o&&(r===s?r=-s:r=r-s);let a=this.aStartAngle+e*r,l=this.aX+this.xRadius*Math.cos(a),c=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){let h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=l-this.aX,f=c-this.aY;l=d*h-f*u+this.aX,c=d*u+f*h+this.aY}return i.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},al=class extends Br{constructor(e,t,i,s,r,o){super(e,t,i,i,s,r,o),this.isArcCurve=!0,this.type="ArcCurve"}};function lu(){let n=0,e=0,t=0,i=0;function s(r,o,a,l){n=r,e=a,t=-3*r+3*o-2*a-l,i=2*r-2*o+a+l}return{initCatmullRom:function(r,o,a,l,c){s(o,a,c*(a-r),c*(l-o))},initNonuniformCatmullRom:function(r,o,a,l,c,h,u){let d=(o-r)/c-(a-r)/(c+h)+(a-o)/h,f=(a-o)/h-(l-o)/(h+u)+(l-a)/u;d*=h,f*=h,s(o,a,d,f)},calc:function(r){let o=r*r,a=o*r;return n+e*r+t*o+i*a}}}var rf=new C,of=new C,yh=new lu,vh=new lu,bh=new lu,Ki=class extends $n{constructor(e=[],t=!1,i="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=i,this.tension=s}getPoint(e,t=new C){let i=t,s=this.points,r=s.length,o=(r-(this.closed?0:1))*e,a=Math.floor(o),l=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:l===0&&a===r-1&&(a=r-2,l=1);let c,h;this.closed||a>0?c=s[(a-1)%r]:(of.subVectors(s[0],s[1]).add(s[0]),c=of);let u=s[a%r],d=s[(a+1)%r];if(this.closed||a+2<r?h=s[(a+2)%r]:(rf.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=rf),this.curveType==="centripetal"||this.curveType==="chordal"){let f=this.curveType==="chordal"?.5:.25,m=Math.pow(c.distanceToSquared(u),f),_=Math.pow(u.distanceToSquared(d),f),p=Math.pow(d.distanceToSquared(h),f);_<1e-4&&(_=1),m<1e-4&&(m=_),p<1e-4&&(p=_),yh.initNonuniformCatmullRom(c.x,u.x,d.x,h.x,m,_,p),vh.initNonuniformCatmullRom(c.y,u.y,d.y,h.y,m,_,p),bh.initNonuniformCatmullRom(c.z,u.z,d.z,h.z,m,_,p)}else this.curveType==="catmullrom"&&(yh.initCatmullRom(c.x,u.x,d.x,h.x,this.tension),vh.initCatmullRom(c.y,u.y,d.y,h.y,this.tension),bh.initCatmullRom(c.z,u.z,d.z,h.z,this.tension));return i.set(yh.calc(l),vh.calc(l),bh.calc(l)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){let s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let s=e.points[t];this.points.push(new C().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function af(n,e,t,i,s){let r=(i-e)*.5,o=(s-t)*.5,a=n*n,l=n*a;return(2*t-2*i+r+o)*l+(-3*t+3*i-2*r-o)*a+r*n+t}function Dg(n,e){let t=1-n;return t*t*e}function Ng(n,e){return 2*(1-n)*n*e}function Ug(n,e){return n*n*e}function _o(n,e,t,i){return Dg(n,e)+Ng(n,t)+Ug(n,i)}function Fg(n,e){let t=1-n;return t*t*t*e}function Og(n,e){let t=1-n;return 3*t*t*n*e}function Bg(n,e){return 3*(1-n)*n*n*e}function kg(n,e){return n*n*n*e}function yo(n,e,t,i,s){return Fg(n,e)+Og(n,t)+Bg(n,i)+kg(n,s)}var Lo=class extends $n{constructor(e=new ae,t=new ae,i=new ae,s=new ae){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=i,this.v3=s}getPoint(e,t=new ae){let i=t,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return i.set(yo(e,s.x,r.x,o.x,a.x),yo(e,s.y,r.y,o.y,a.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},ll=class extends $n{constructor(e=new C,t=new C,i=new C,s=new C){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=i,this.v3=s}getPoint(e,t=new C){let i=t,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return i.set(yo(e,s.x,r.x,o.x,a.x),yo(e,s.y,r.y,o.y,a.y),yo(e,s.z,r.z,o.z,a.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Do=class extends $n{constructor(e=new ae,t=new ae){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new ae){let i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new ae){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},cl=class extends $n{constructor(e=new C,t=new C){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new C){let i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new C){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},No=class extends $n{constructor(e=new ae,t=new ae,i=new ae){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new ae){let i=t,s=this.v0,r=this.v1,o=this.v2;return i.set(_o(e,s.x,r.x,o.x),_o(e,s.y,r.y,o.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Uo=class extends $n{constructor(e=new C,t=new C,i=new C){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new C){let i=t,s=this.v0,r=this.v1,o=this.v2;return i.set(_o(e,s.x,r.x,o.x),_o(e,s.y,r.y,o.y),_o(e,s.z,r.z,o.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Fo=class extends $n{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new ae){let i=t,s=this.points,r=(s.length-1)*e,o=Math.floor(r),a=r-o,l=s[o===0?o:o-1],c=s[o],h=s[o>s.length-2?s.length-1:o+1],u=s[o>s.length-3?s.length-1:o+2];return i.set(af(a,l.x,c.x,h.x,u.x),af(a,l.y,c.y,h.y,u.y)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let s=e.points[t];this.points.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){let s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let s=e.points[t];this.points.push(new ae().fromArray(s))}return this}},hl=Object.freeze({__proto__:null,ArcCurve:al,CatmullRomCurve3:Ki,CubicBezierCurve:Lo,CubicBezierCurve3:ll,EllipseCurve:Br,LineCurve:Do,LineCurve3:cl,QuadraticBezierCurve:No,QuadraticBezierCurve3:Uo,SplineCurve:Fo}),ul=class extends $n{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let i=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new hl[i](t,e))}return this}getPoint(e,t){let i=e*this.getLength(),s=this.getCurveLengths(),r=0;for(;r<s.length;){if(s[r]>=i){let o=s[r]-i,a=this.curves[r],l=a.getLength(),c=l===0?0:1-o/l;return a.getPointAt(c,t)}r++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let i=0,s=this.curves.length;i<s;i++)t+=this.curves[i].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],i;for(let s=0,r=this.curves;s<r.length;s++){let o=r[s],a=o.isEllipseCurve?e*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?e*o.points.length:e,l=o.getPoints(a);for(let c=0;c<l.length;c++){let h=l[c];i&&i.equals(h)||(t.push(h),i=h)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){let s=e.curves[t];this.curves.push(s.clone())}return this.autoClose=e.autoClose,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,i=this.curves.length;t<i;t++){let s=this.curves[t];e.curves.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){let s=e.curves[t];this.curves.push(new hl[s.type]().fromJSON(s))}return this}},Ji=class extends ul{constructor(e){super(),this.type="Path",this.currentPoint=new ae,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,i=e.length;t<i;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let i=new Do(this.currentPoint.clone(),new ae(e,t));return this.curves.push(i),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,i,s){let r=new No(this.currentPoint.clone(),new ae(e,t),new ae(i,s));return this.curves.push(r),this.currentPoint.set(i,s),this}bezierCurveTo(e,t,i,s,r,o){let a=new Lo(this.currentPoint.clone(),new ae(e,t),new ae(i,s),new ae(r,o));return this.curves.push(a),this.currentPoint.set(r,o),this}splineThru(e){let t=[this.currentPoint.clone()].concat(e),i=new Fo(t);return this.curves.push(i),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,i,s,r,o){let a=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+a,t+l,i,s,r,o),this}absarc(e,t,i,s,r,o){return this.absellipse(e,t,i,i,s,r,o),this}ellipse(e,t,i,s,r,o,a,l){let c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(e+c,t+h,i,s,r,o,a,l),this}absellipse(e,t,i,s,r,o,a,l){let c=new Br(e,t,i,s,r,o,a,l);if(this.curves.length>0){let u=c.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(c);let h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},Ri=class extends Ji{constructor(e){super(e),this.uuid=ei(),this.type="Shape",this.holes=[]}getPointsHoles(e){let t=[];for(let i=0,s=this.holes.length;i<s;i++)t[i]=this.holes[i].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){let s=e.holes[t];this.holes.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,i=this.holes.length;t<i;t++){let s=this.holes[t];e.holes.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){let s=e.holes[t];this.holes.push(new Ji().fromJSON(s))}return this}};function zg(n,e,t=2){let i=e&&e.length,s=i?e[0]*t:n.length,r=op(n,0,s,t,!0),o=[];if(!r||r.next===r.prev)return o;let a,l,c;if(i&&(r=Xg(n,e,r,t)),n.length>80*t){a=n[0],l=n[1];let h=a,u=l;for(let d=t;d<s;d+=t){let f=n[d],m=n[d+1];f<a&&(a=f),m<l&&(l=m),f>h&&(h=f),m>u&&(u=m)}c=Math.max(h-a,u-l),c=c!==0?32767/c:0}return Oo(r,o,t,a,l,c,0),o}function op(n,e,t,i,s){let r;if(s===n0(n,e,t,i)>0)for(let o=e;o<t;o+=i)r=lf(o/i|0,n[o],n[o+1],r);else for(let o=t-i;o>=e;o-=i)r=lf(o/i|0,n[o],n[o+1],r);return r&&kr(r,r.next)&&(ko(r),r=r.next),r}function qs(n,e){if(!n)return n;e||(e=n);let t=n,i;do if(i=!1,!t.steiner&&(kr(t,t.next)||zt(t.prev,t,t.next)===0)){if(ko(t),t=e=t.prev,t===t.next)break;i=!0}else t=t.next;while(i||t!==e);return e}function Oo(n,e,t,i,s,r,o){if(!n)return;!o&&r&&Kg(n,i,s,r);let a=n;for(;n.prev!==n.next;){let l=n.prev,c=n.next;if(r?Gg(n,i,s,r):Vg(n)){e.push(l.i,n.i,c.i),ko(n),n=c.next,a=c.next;continue}if(n=c,n===a){o?o===1?(n=Hg(qs(n),e),Oo(n,e,t,i,s,r,2)):o===2&&Wg(n,e,t,i,s,r):Oo(qs(n),e,t,i,s,r,1);break}}}function Vg(n){let e=n.prev,t=n,i=n.next;if(zt(e,t,i)>=0)return!1;let s=e.x,r=t.x,o=i.x,a=e.y,l=t.y,c=i.y,h=Math.min(s,r,o),u=Math.min(a,l,c),d=Math.max(s,r,o),f=Math.max(a,l,c),m=i.next;for(;m!==e;){if(m.x>=h&&m.x<=d&&m.y>=u&&m.y<=f&&po(s,a,r,l,o,c,m.x,m.y)&&zt(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function Gg(n,e,t,i){let s=n.prev,r=n,o=n.next;if(zt(s,r,o)>=0)return!1;let a=s.x,l=r.x,c=o.x,h=s.y,u=r.y,d=o.y,f=Math.min(a,l,c),m=Math.min(h,u,d),_=Math.max(a,l,c),p=Math.max(h,u,d),g=Ch(f,m,e,t,i),T=Ch(_,p,e,t,i),x=n.prevZ,v=n.nextZ;for(;x&&x.z>=g&&v&&v.z<=T;){if(x.x>=f&&x.x<=_&&x.y>=m&&x.y<=p&&x!==s&&x!==o&&po(a,h,l,u,c,d,x.x,x.y)&&zt(x.prev,x,x.next)>=0||(x=x.prevZ,v.x>=f&&v.x<=_&&v.y>=m&&v.y<=p&&v!==s&&v!==o&&po(a,h,l,u,c,d,v.x,v.y)&&zt(v.prev,v,v.next)>=0))return!1;v=v.nextZ}for(;x&&x.z>=g;){if(x.x>=f&&x.x<=_&&x.y>=m&&x.y<=p&&x!==s&&x!==o&&po(a,h,l,u,c,d,x.x,x.y)&&zt(x.prev,x,x.next)>=0)return!1;x=x.prevZ}for(;v&&v.z<=T;){if(v.x>=f&&v.x<=_&&v.y>=m&&v.y<=p&&v!==s&&v!==o&&po(a,h,l,u,c,d,v.x,v.y)&&zt(v.prev,v,v.next)>=0)return!1;v=v.nextZ}return!0}function Hg(n,e){let t=n;do{let i=t.prev,s=t.next.next;!kr(i,s)&&lp(i,t,t.next,s)&&Bo(i,s)&&Bo(s,i)&&(e.push(i.i,t.i,s.i),ko(t),ko(t.next),t=n=s),t=t.next}while(t!==n);return qs(t)}function Wg(n,e,t,i,s,r){let o=n;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&Qg(o,a)){let l=cp(o,a);o=qs(o,o.next),l=qs(l,l.next),Oo(o,e,t,i,s,r,0),Oo(l,e,t,i,s,r,0);return}a=a.next}o=o.next}while(o!==n)}function Xg(n,e,t,i){let s=[];for(let r=0,o=e.length;r<o;r++){let a=e[r]*i,l=r<o-1?e[r+1]*i:n.length,c=op(n,a,l,i,!1);c===c.next&&(c.steiner=!0),s.push(jg(c))}s.sort(qg);for(let r=0;r<s.length;r++)t=Yg(s[r],t);return t}function qg(n,e){let t=n.x-e.x;if(t===0&&(t=n.y-e.y,t===0)){let i=(n.next.y-n.y)/(n.next.x-n.x),s=(e.next.y-e.y)/(e.next.x-e.x);t=i-s}return t}function Yg(n,e){let t=$g(n,e);if(!t)return e;let i=cp(t,n);return qs(i,i.next),qs(t,t.next)}function $g(n,e){let t=e,i=n.x,s=n.y,r=-1/0,o;if(kr(n,t))return t;do{if(kr(n,t.next))return t.next;if(s<=t.y&&s>=t.next.y&&t.next.y!==t.y){let u=t.x+(s-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(u<=i&&u>r&&(r=u,o=t.x<t.next.x?t:t.next,u===i))return o}t=t.next}while(t!==e);if(!o)return null;let a=o,l=o.x,c=o.y,h=1/0;t=o;do{if(i>=t.x&&t.x>=l&&i!==t.x&&ap(s<c?i:r,s,l,c,s<c?r:i,s,t.x,t.y)){let u=Math.abs(s-t.y)/(i-t.x);Bo(t,n)&&(u<h||u===h&&(t.x>o.x||t.x===o.x&&Zg(o,t)))&&(o=t,h=u)}t=t.next}while(t!==a);return o}function Zg(n,e){return zt(n.prev,n,e.prev)<0&&zt(e.next,n,n.next)<0}function Kg(n,e,t,i){let s=n;do s.z===0&&(s.z=Ch(s.x,s.y,e,t,i)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==n);s.prevZ.nextZ=null,s.prevZ=null,Jg(s)}function Jg(n){let e,t=1;do{let i=n,s;n=null;let r=null;for(e=0;i;){e++;let o=i,a=0;for(let c=0;c<t&&(a++,o=o.nextZ,!!o);c++);let l=t;for(;a>0||l>0&&o;)a!==0&&(l===0||!o||i.z<=o.z)?(s=i,i=i.nextZ,a--):(s=o,o=o.nextZ,l--),r?r.nextZ=s:n=s,s.prevZ=r,r=s;i=o}r.nextZ=null,t*=2}while(e>1);return n}function Ch(n,e,t,i,s){return n=(n-t)*s|0,e=(e-i)*s|0,n=(n|n<<8)&16711935,n=(n|n<<4)&252645135,n=(n|n<<2)&858993459,n=(n|n<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,n|e<<1}function jg(n){let e=n,t=n;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==n);return t}function ap(n,e,t,i,s,r,o,a){return(s-o)*(e-a)>=(n-o)*(r-a)&&(n-o)*(i-a)>=(t-o)*(e-a)&&(t-o)*(r-a)>=(s-o)*(i-a)}function po(n,e,t,i,s,r,o,a){return!(n===o&&e===a)&&ap(n,e,t,i,s,r,o,a)}function Qg(n,e){return n.next.i!==e.i&&n.prev.i!==e.i&&!e0(n,e)&&(Bo(n,e)&&Bo(e,n)&&t0(n,e)&&(zt(n.prev,n,e.prev)||zt(n,e.prev,e))||kr(n,e)&&zt(n.prev,n,n.next)>0&&zt(e.prev,e,e.next)>0)}function zt(n,e,t){return(e.y-n.y)*(t.x-e.x)-(e.x-n.x)*(t.y-e.y)}function kr(n,e){return n.x===e.x&&n.y===e.y}function lp(n,e,t,i){let s=Ga(zt(n,e,t)),r=Ga(zt(n,e,i)),o=Ga(zt(t,i,n)),a=Ga(zt(t,i,e));return!!(s!==r&&o!==a||s===0&&Va(n,t,e)||r===0&&Va(n,i,e)||o===0&&Va(t,n,i)||a===0&&Va(t,e,i))}function Va(n,e,t){return e.x<=Math.max(n.x,t.x)&&e.x>=Math.min(n.x,t.x)&&e.y<=Math.max(n.y,t.y)&&e.y>=Math.min(n.y,t.y)}function Ga(n){return n>0?1:n<0?-1:0}function e0(n,e){let t=n;do{if(t.i!==n.i&&t.next.i!==n.i&&t.i!==e.i&&t.next.i!==e.i&&lp(t,t.next,n,e))return!0;t=t.next}while(t!==n);return!1}function Bo(n,e){return zt(n.prev,n,n.next)<0?zt(n,e,n.next)>=0&&zt(n,n.prev,e)>=0:zt(n,e,n.prev)<0||zt(n,n.next,e)<0}function t0(n,e){let t=n,i=!1,s=(n.x+e.x)/2,r=(n.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&s<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(i=!i),t=t.next;while(t!==n);return i}function cp(n,e){let t=Ph(n.i,n.x,n.y),i=Ph(e.i,e.x,e.y),s=n.next,r=e.prev;return n.next=e,e.prev=n,t.next=s,s.prev=t,i.next=t,t.prev=i,r.next=i,i.prev=r,i}function lf(n,e,t,i){let s=Ph(n,e,t);return i?(s.next=i.next,s.prev=i,i.next.prev=s,i.next=s):(s.prev=s,s.next=s),s}function ko(n){n.next.prev=n.prev,n.prev.next=n.next,n.prevZ&&(n.prevZ.nextZ=n.nextZ),n.nextZ&&(n.nextZ.prevZ=n.prevZ)}function Ph(n,e,t){return{i:n,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function n0(n,e,t,i){let s=0;for(let r=e,o=t-i;r<t;r+=i)s+=(n[o]-n[r])*(n[r+1]+n[o+1]),o=r;return s}var Ih=class{static triangulate(e,t,i=2){return zg(e,t,i)}},ks=class n{static area(e){let t=e.length,i=0;for(let s=t-1,r=0;r<t;s=r++)i+=e[s].x*e[r].y-e[r].x*e[s].y;return i*.5}static isClockWise(e){return n.area(e)<0}static triangulateShape(e,t){let i=[],s=[],r=[];cf(e),hf(i,e);let o=e.length;t.forEach(cf);for(let l=0;l<t.length;l++)s.push(o),o+=t[l].length,hf(i,t[l]);let a=Ih.triangulate(i,s);for(let l=0;l<a.length;l+=3)r.push(a.slice(l,l+3));return r}};function cf(n){let e=n.length;e>2&&n[e-1].equals(n[0])&&n.pop()}function hf(n,e){for(let t=0;t<e.length;t++)n.push(e[t].x),n.push(e[t].y)}var ji=class n extends pt{constructor(e=new Ri([new ae(.5,.5),new ae(-.5,.5),new ae(-.5,-.5),new ae(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];let i=this,s=[],r=[];for(let a=0,l=e.length;a<l;a++){let c=e[a];o(c)}this.setAttribute("position",new ot(s,3)),this.setAttribute("uv",new ot(r,2)),this.computeVertexNormals();function o(a){let l=[],c=t.curveSegments!==void 0?t.curveSegments:12,h=t.steps!==void 0?t.steps:1,u=t.depth!==void 0?t.depth:1,d=t.bevelEnabled!==void 0?t.bevelEnabled:!0,f=t.bevelThickness!==void 0?t.bevelThickness:.2,m=t.bevelSize!==void 0?t.bevelSize:f-.1,_=t.bevelOffset!==void 0?t.bevelOffset:0,p=t.bevelSegments!==void 0?t.bevelSegments:3,g=t.extrudePath,T=t.UVGenerator!==void 0?t.UVGenerator:i0,x,v=!1,M,E,A,y;if(g){x=g.getSpacedPoints(h),v=!0,d=!1;let te=g.isCatmullRomCurve3?g.closed:!1;M=g.computeFrenetFrames(h,te),E=new C,A=new C,y=new C}d||(p=0,f=0,m=0,_=0);let S=a.extractPoints(c),I=S.shape,D=S.holes;if(!ks.isClockWise(I)){I=I.reverse();for(let te=0,le=D.length;te<le;te++){let ue=D[te];ks.isClockWise(ue)&&(D[te]=ue.reverse())}}function R(te){let ue=10000000000000001e-36,ce=te[0];for(let fe=1;fe<=te.length;fe++){let Le=fe%te.length,G=te[Le],re=G.x-ce.x,Re=G.y-ce.y,U=re*re+Re*Re,Ce=Math.max(Math.abs(G.x),Math.abs(G.y),Math.abs(ce.x),Math.abs(ce.y)),Ke=ue*Ce*Ce;if(U<=Ke){te.splice(Le,1),fe--;continue}ce=G}}R(I),D.forEach(R);let P=D.length,N=I;for(let te=0;te<P;te++){let le=D[te];I=I.concat(le)}function O(te,le,ue){return le||Ye("ExtrudeGeometry: vec does not exist"),te.clone().addScaledVector(le,ue)}let X=I.length;function J(te,le,ue){let ce,fe,Le,G=te.x-le.x,re=te.y-le.y,Re=ue.x-te.x,U=ue.y-te.y,Ce=G*G+re*re,Ke=G*U-re*Re;if(Math.abs(Ke)>Number.EPSILON){let L=Math.sqrt(Ce),b=Math.sqrt(Re*Re+U*U),H=le.x-re/L,$=le.y+G/L,j=ue.x-U/b,me=ue.y+Re/b,_e=((j-H)*U-(me-$)*Re)/(G*U-re*Re);ce=H+G*_e-te.x,fe=$+re*_e-te.y;let ee=ce*ce+fe*fe;if(ee<=2)return new ae(ce,fe);Le=Math.sqrt(ee/2)}else{let L=!1;G>Number.EPSILON?Re>Number.EPSILON&&(L=!0):G<-Number.EPSILON?Re<-Number.EPSILON&&(L=!0):Math.sign(re)===Math.sign(U)&&(L=!0),L?(ce=-re,fe=G,Le=Math.sqrt(Ce)):(ce=G,fe=re,Le=Math.sqrt(Ce/2))}return new ae(ce/Le,fe/Le)}let z=[];for(let te=0,le=N.length,ue=le-1,ce=te+1;te<le;te++,ue++,ce++)ue===le&&(ue=0),ce===le&&(ce=0),z[te]=J(N[te],N[ue],N[ce]);let B=[],W,ne=z.concat();for(let te=0,le=P;te<le;te++){let ue=D[te];W=[];for(let ce=0,fe=ue.length,Le=fe-1,G=ce+1;ce<fe;ce++,Le++,G++)Le===fe&&(Le=0),G===fe&&(G=0),W[ce]=J(ue[ce],ue[Le],ue[G]);B.push(W),ne=ne.concat(W)}let oe;if(p===0)oe=ks.triangulateShape(N,D);else{let te=[],le=[];for(let ue=0;ue<p;ue++){let ce=ue/p,fe=f*Math.cos(ce*Math.PI/2),Le=m*Math.sin(ce*Math.PI/2)+_;for(let G=0,re=N.length;G<re;G++){let Re=O(N[G],z[G],Le);de(Re.x,Re.y,-fe),ce===0&&te.push(Re)}for(let G=0,re=P;G<re;G++){let Re=D[G];W=B[G];let U=[];for(let Ce=0,Ke=Re.length;Ce<Ke;Ce++){let L=O(Re[Ce],W[Ce],Le);de(L.x,L.y,-fe),ce===0&&U.push(L)}ce===0&&le.push(U)}}oe=ks.triangulateShape(te,le)}let Ue=oe.length,$e=m+_;for(let te=0;te<X;te++){let le=d?O(I[te],ne[te],$e):I[te];v?(A.copy(M.normals[0]).multiplyScalar(le.x),E.copy(M.binormals[0]).multiplyScalar(le.y),y.copy(x[0]).add(A).add(E),de(y.x,y.y,y.z)):de(le.x,le.y,0)}for(let te=1;te<=h;te++)for(let le=0;le<X;le++){let ue=d?O(I[le],ne[le],$e):I[le];v?(A.copy(M.normals[te]).multiplyScalar(ue.x),E.copy(M.binormals[te]).multiplyScalar(ue.y),y.copy(x[te]).add(A).add(E),de(y.x,y.y,y.z)):de(ue.x,ue.y,u/h*te)}for(let te=p-1;te>=0;te--){let le=te/p,ue=f*Math.cos(le*Math.PI/2),ce=m*Math.sin(le*Math.PI/2)+_;for(let fe=0,Le=N.length;fe<Le;fe++){let G=O(N[fe],z[fe],ce);de(G.x,G.y,u+ue)}for(let fe=0,Le=D.length;fe<Le;fe++){let G=D[fe];W=B[fe];for(let re=0,Re=G.length;re<Re;re++){let U=O(G[re],W[re],ce);v?de(U.x,U.y+x[h-1].y,x[h-1].x+ue):de(U.x,U.y,u+ue)}}}Xe(),Z();function Xe(){let te=s.length/3;if(d){let le=0,ue=X*le;for(let ce=0;ce<Ue;ce++){let fe=oe[ce];De(fe[2]+ue,fe[1]+ue,fe[0]+ue)}le=h+p*2,ue=X*le;for(let ce=0;ce<Ue;ce++){let fe=oe[ce];De(fe[0]+ue,fe[1]+ue,fe[2]+ue)}}else{for(let le=0;le<Ue;le++){let ue=oe[le];De(ue[2],ue[1],ue[0])}for(let le=0;le<Ue;le++){let ue=oe[le];De(ue[0]+X*h,ue[1]+X*h,ue[2]+X*h)}}i.addGroup(te,s.length/3-te,0)}function Z(){let te=s.length/3,le=0;Q(N,le),le+=N.length;for(let ue=0,ce=D.length;ue<ce;ue++){let fe=D[ue];Q(fe,le),le+=fe.length}i.addGroup(te,s.length/3-te,1)}function Q(te,le){let ue=te.length;for(;--ue>=0;){let ce=ue,fe=ue-1;fe<0&&(fe=te.length-1);for(let Le=0,G=h+p*2;Le<G;Le++){let re=X*Le,Re=X*(Le+1),U=le+ce+re,Ce=le+fe+re,Ke=le+fe+Re,L=le+ce+Re;pe(U,Ce,Ke,L)}}}function de(te,le,ue){l.push(te),l.push(le),l.push(ue)}function De(te,le,ue){xe(te),xe(le),xe(ue);let ce=s.length/3,fe=T.generateTopUV(i,s,ce-3,ce-2,ce-1);Ze(fe[0]),Ze(fe[1]),Ze(fe[2])}function pe(te,le,ue,ce){xe(te),xe(le),xe(ce),xe(le),xe(ue),xe(ce);let fe=s.length/3,Le=T.generateSideWallUV(i,s,fe-6,fe-3,fe-2,fe-1);Ze(Le[0]),Ze(Le[1]),Ze(Le[3]),Ze(Le[1]),Ze(Le[2]),Ze(Le[3])}function xe(te){s.push(l[te*3+0]),s.push(l[te*3+1]),s.push(l[te*3+2])}function Ze(te){r.push(te.x),r.push(te.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes,i=this.parameters.options;return s0(t,i,e)}static fromJSON(e,t){let i=[];for(let r=0,o=e.shapes.length;r<o;r++){let a=t[e.shapes[r]];i.push(a)}let s=e.options.extrudePath;return s!==void 0&&(e.options.extrudePath=new hl[s.type]().fromJSON(s)),new n(i,e.options)}},i0={generateTopUV:function(n,e,t,i,s){let r=e[t*3],o=e[t*3+1],a=e[i*3],l=e[i*3+1],c=e[s*3],h=e[s*3+1];return[new ae(r,o),new ae(a,l),new ae(c,h)]},generateSideWallUV:function(n,e,t,i,s,r){let o=e[t*3],a=e[t*3+1],l=e[t*3+2],c=e[i*3],h=e[i*3+1],u=e[i*3+2],d=e[s*3],f=e[s*3+1],m=e[s*3+2],_=e[r*3],p=e[r*3+1],g=e[r*3+2];return Math.abs(a-h)<Math.abs(o-c)?[new ae(o,1-l),new ae(c,1-u),new ae(d,1-m),new ae(_,1-g)]:[new ae(a,1-l),new ae(h,1-u),new ae(f,1-m),new ae(p,1-g)]}};function s0(n,e,t){if(t.shapes=[],Array.isArray(n))for(let i=0,s=n.length;i<s;i++){let r=n[i];t.shapes.push(r.uuid)}else t.shapes.push(n.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}var En=class n extends pt{constructor(e=1,t=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:s};let r=e/2,o=t/2,a=Math.floor(i),l=Math.floor(s),c=a+1,h=l+1,u=e/a,d=t/l,f=[],m=[],_=[],p=[];for(let g=0;g<h;g++){let T=g*d-o;for(let x=0;x<c;x++){let v=x*u-r;m.push(v,-T,0),_.push(0,0,1),p.push(x/a),p.push(1-g/l)}}for(let g=0;g<l;g++)for(let T=0;T<a;T++){let x=T+c*g,v=T+c*(g+1),M=T+1+c*(g+1),E=T+1+c*g;f.push(x,v,E),f.push(v,M,E)}this.setIndex(f),this.setAttribute("position",new ot(m,3)),this.setAttribute("normal",new ot(_,3)),this.setAttribute("uv",new ot(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.width,e.height,e.widthSegments,e.heightSegments)}};var nn=class n extends pt{constructor(e=1,t=32,i=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));let l=Math.min(o+a,Math.PI),c=0,h=[],u=new C,d=new C,f=[],m=[],_=[],p=[];for(let g=0;g<=i;g++){let T=[],x=g/i,v=o+x*a,M=e*Math.cos(v),E=Math.sqrt(e*e-M*M),A=0;g===0&&o===0?A=.5/t:g===i&&l===Math.PI&&(A=-.5/t);for(let y=0;y<=t;y++){let S=y/t,I=s+S*r;u.x=-E*Math.cos(I),u.y=M,u.z=E*Math.sin(I),m.push(u.x,u.y,u.z),d.copy(u).normalize(),_.push(d.x,d.y,d.z),p.push(S+A,1-x),T.push(c++)}h.push(T)}for(let g=0;g<i;g++)for(let T=0;T<t;T++){let x=h[g][T+1],v=h[g][T],M=h[g+1][T],E=h[g+1][T+1];(g!==0||o>0)&&f.push(x,v,E),(g!==i-1||l<Math.PI)&&f.push(v,M,E)}this.setIndex(f),this.setAttribute("position",new ot(m,3)),this.setAttribute("normal",new ot(_,3)),this.setAttribute("uv",new ot(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}};var bs=class n extends pt{constructor(e=1,t=.4,i=12,s=48,r=Math.PI*2,o=0,a=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:i,tubularSegments:s,arc:r,thetaStart:o,thetaLength:a},i=Math.floor(i),s=Math.floor(s);let l=[],c=[],h=[],u=[],d=new C,f=new C,m=new C;for(let _=0;_<=i;_++){let p=o+_/i*a;for(let g=0;g<=s;g++){let T=g/s*r;f.x=(e+t*Math.cos(p))*Math.cos(T),f.y=(e+t*Math.cos(p))*Math.sin(T),f.z=t*Math.sin(p),c.push(f.x,f.y,f.z),d.x=e*Math.cos(T),d.y=e*Math.sin(T),m.subVectors(f,d).normalize(),h.push(m.x,m.y,m.z),u.push(g/s),u.push(_/i)}}for(let _=1;_<=i;_++)for(let p=1;p<=s;p++){let g=(s+1)*_+p-1,T=(s+1)*(_-1)+p-1,x=(s+1)*(_-1)+p,v=(s+1)*_+p;l.push(g,T,v),l.push(T,x,v)}this.setIndex(l),this.setAttribute("position",new ot(c,3)),this.setAttribute("normal",new ot(h,3)),this.setAttribute("uv",new ot(u,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc,e.thetaStart,e.thetaLength)}};var Ms=class n extends pt{constructor(e=new Uo(new C(-1,-1,0),new C(-1,1,0),new C(1,1,0)),t=64,i=1,s=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:e,tubularSegments:t,radius:i,radialSegments:s,closed:r};let o=e.computeFrenetFrames(t,r);this.tangents=o.tangents,this.normals=o.normals,this.binormals=o.binormals;let a=new C,l=new C,c=new ae,h=new C,u=[],d=[],f=[],m=[];_(),this.setIndex(m),this.setAttribute("position",new ot(u,3)),this.setAttribute("normal",new ot(d,3)),this.setAttribute("uv",new ot(f,2));function _(){for(let x=0;x<t;x++)p(x);p(r===!1?t:0),T(),g()}function p(x){h=e.getPointAt(x/t,h);let v=o.normals[x],M=o.binormals[x];for(let E=0;E<=s;E++){let A=E/s*Math.PI*2,y=Math.sin(A),S=-Math.cos(A);l.x=S*v.x+y*M.x,l.y=S*v.y+y*M.y,l.z=S*v.z+y*M.z,l.normalize(),d.push(l.x,l.y,l.z),a.x=h.x+i*l.x,a.y=h.y+i*l.y,a.z=h.z+i*l.z,u.push(a.x,a.y,a.z)}}function g(){for(let x=1;x<=t;x++)for(let v=1;v<=s;v++){let M=(s+1)*(x-1)+(v-1),E=(s+1)*x+(v-1),A=(s+1)*x+v,y=(s+1)*(x-1)+v;m.push(M,E,y),m.push(E,A,y)}}function T(){for(let x=0;x<=t;x++)for(let v=0;v<=s;v++)c.x=x/t,c.y=v/s,f.push(c.x,c.y)}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON();return e.path=this.parameters.path.toJSON(),e}static fromJSON(e){return new n(new hl[e.path.type]().fromJSON(e.path),e.tubularSegments,e.radius,e.radialSegments,e.closed)}};function tr(n){let e={};for(let t in n){e[t]={};for(let i in n[t]){let s=n[t][i];if(uf(s))s.isRenderTargetTexture?(ke("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=s.clone();else if(Array.isArray(s))if(uf(s[0])){let r=[];for(let o=0,a=s.length;o<a;o++)r[o]=s[o].clone();e[t][i]=r}else e[t][i]=s.slice();else e[t][i]=s}}return e}function Rn(n){let e={};for(let t=0;t<n.length;t++){let i=tr(n[t]);for(let s in i)e[s]=i[s]}return e}function uf(n){return n&&(n.isColor||n.isMatrix3||n.isMatrix4||n.isVector2||n.isVector3||n.isVector4||n.isTexture||n.isQuaternion)}function r0(n){let e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function cu(n){let e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:rt.workingColorSpace}var hp={clone:tr,merge:Rn},o0=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,a0=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,pn=class extends zn{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=o0,this.fragmentShader=a0,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=tr(e.uniforms),this.uniformsGroups=r0(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let s in this.uniforms){let o=this.uniforms[s].value;o&&o.isTexture?t.uniforms[s]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[s]={type:"m4",value:o.toArray()}:t.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let i={};for(let s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let i in e.uniforms){let s=e.uniforms[i];switch(this.uniforms[i]={},s.type){case"t":this.uniforms[i].value=t[s.value]||null;break;case"c":this.uniforms[i].value=new Ne().setHex(s.value);break;case"v2":this.uniforms[i].value=new ae().fromArray(s.value);break;case"v3":this.uniforms[i].value=new C().fromArray(s.value);break;case"v4":this.uniforms[i].value=new Mt().fromArray(s.value);break;case"m3":this.uniforms[i].value=new je().fromArray(s.value);break;case"m4":this.uniforms[i].value=new We().fromArray(s.value);break;default:this.uniforms[i].value=s.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let i in e.extensions)this.extensions[i]=e.extensions[i];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},dl=class extends pn{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}},$t=class extends zn{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Ne(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ne(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=cc,this.normalScale=new ae(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Yt,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},Je=class extends $t{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new ae(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return tt(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Ne(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Ne(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Ne(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get retroreflectivity(){return this._retroreflectivity}set retroreflectivity(e){this._retroreflectivity>0!=e>0&&this.version++,this._retroreflectivity=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.retroreflectivity=e.retroreflectivity,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}};var fl=class extends zn{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=qf,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},pl=class extends zn{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function ps(n,e){return!n||n.constructor===e?n:typeof e.BYTES_PER_ELEMENT=="number"?new e(n):Array.prototype.slice.call(n)}function Ya(n){return n!==void 0&&n.inTangents!==void 0&&n.outTangents!==void 0}function l0(n){function e(s,r){return n[s]-n[r]}let t=n.length,i=new Array(t);for(let s=0;s!==t;++s)i[s]=s;return i.sort(e),i}function df(n,e,t){let i=n.length,s=new n.constructor(i);for(let r=0,o=0;o!==i;++r){let a=t[r]*e;for(let l=0;l!==e;++l)s[o++]=n[a+l]}return s}function c0(n,e,t,i){let s=1,r=n[0];for(;r!==void 0&&r[i]===void 0;)r=n[s++];if(r===void 0)return;let o=r[i];if(o!==void 0)if(Array.isArray(o))do o=r[i],o!==void 0&&(e.push(r.time),t.push(...o)),r=n[s++];while(r!==void 0);else if(o.toArray!==void 0)do o=r[i],o!==void 0&&(e.push(r.time),o.toArray(t,t.length)),r=n[s++];while(r!==void 0);else do o=r[i],o!==void 0&&(e.push(r.time),t.push(o)),r=n[s++];while(r!==void 0)}var Ci=class{constructor(e,t,i,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(i),this.sampleValues=t,this.valueSize=i,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,i=this._cachedIndex,s=t[i],r=t[i-1];n:{e:{let o;t:{i:if(!(e<s)){for(let a=i+2;;){if(s===void 0){if(e<r)break i;return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}if(i===a)break;if(r=s,s=t[++i],e<s)break e}o=t.length;break t}if(!(e>=r)){let a=t[1];e<a&&(i=2,r=a);for(let l=i-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===l)break;if(s=r,r=t[--i-1],e>=r)break e}o=i,i=0;break t}break n}for(;i<o;){let a=i+o>>>1;e<t[a]?o=a:i=a+1}if(s=t[i],r=t[i-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}this._cachedIndex=i,this.intervalChanged_(i,r,s)}return this.interpolate_(i,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,i=this.sampleValues,s=this.valueSize,r=e*s;for(let o=0;o!==s;++o)t[o]=i[r+o];return t}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},ml=class extends Ci{constructor(e,t,i,s){super(e,t,i,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:wh,endingEnd:wh}}intervalChanged_(e,t,i){let s=this.parameterPositions,r=e-2,o=e+1,a=s[r],l=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case Eh:r=e,a=2*t-i;break;case Ah:r=s.length-2,a=t+s[r]-s[r+1];break;default:r=e,a=i}if(l===void 0)switch(this.getSettings_().endingEnd){case Eh:o=e,l=2*i-t;break;case Ah:o=1,l=i+s[1]-s[0];break;default:o=e-1,l=t}let c=(i-t)*.5,h=this.valueSize;this._weightPrev=c/(t-a),this._weightNext=c/(l-i),this._offsetPrev=r*h,this._offsetNext=o*h}interpolate_(e,t,i,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,h=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,m=(i-t)/(s-t),_=m*m,p=_*m,g=-d*p+2*d*_-d*m,T=(1+d)*p+(-1.5-2*d)*_+(-.5+d)*m+1,x=(-1-f)*p+(1.5+f)*_+.5*m,v=f*p-f*_;for(let M=0;M!==a;++M)r[M]=g*o[h+M]+T*o[c+M]+x*o[l+M]+v*o[u+M];return r}},gl=class extends Ci{constructor(e,t,i,s){super(e,t,i,s)}interpolate_(e,t,i,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,h=(i-t)/(s-t),u=1-h;for(let d=0;d!==a;++d)r[d]=o[c+d]*u+o[l+d]*h;return r}},_l=class extends Ci{constructor(e,t,i,s){super(e,t,i,s)}interpolate_(e){return this.copySampleValue_(e-1)}},yl=class extends Ci{interpolate_(e,t,i,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,h=this.inTangents,u=this.outTangents;if(!h||!u){let m=(i-t)/(s-t),_=1-m;for(let p=0;p!==a;++p)r[p]=o[c+p]*_+o[l+p]*m;return r}let d=a*2,f=e-1;for(let m=0;m!==a;++m){let _=o[c+m],p=o[l+m],g=f*d+m*2,T=u[g],x=u[g+1],v=e*d+m*2,M=h[v],E=h[v+1],A=u0(i,t,T,M,s);r[m]=up(A,_,x,E,p)}return r}};function up(n,e,t,i,s){let r=1-n;return r*r*r*e+3*r*r*n*t+3*r*n*n*i+n*n*n*s}function h0(n,e,t,i,s){let r=1-n;return 3*r*r*(t-e)+6*r*n*(i-t)+3*n*n*(s-i)}function u0(n,e,t,i,s){let r=(n-e)/(s-e);for(let o=0;o<8;o++){let a=up(r,e,t,i,s)-n;if(Math.abs(a)<1e-10)break;let l=h0(r,e,t,i,s);if(Math.abs(l)<1e-10)break;r=Math.max(0,Math.min(1,r-a/l))}return r}var Vn=class{constructor(e,t,i,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=ps(t,this.TimeBufferType),this.values=ps(i,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,i;if(t.toJSON!==this.toJSON)i=t.toJSON(e);else{i={name:e.name,times:ps(e.times,Array),values:ps(e.values,Array)};let s=e.getInterpolation();s!==e.DefaultInterpolation&&(i.interpolation=s),Ya(e.settings)&&(i.settings={inTangents:ps(e.settings.inTangents,Array),outTangents:ps(e.settings.outTangents,Array)})}return i.type=e.ValueTypeName,i}InterpolantFactoryMethodDiscrete(e){return new _l(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new gl(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new ml(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new yl(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case Vs:t=this.InterpolantFactoryMethodDiscrete;break;case Gs:t=this.InterpolantFactoryMethodLinear;break;case Xa:t=this.InterpolantFactoryMethodSmooth;break;case Th:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){let i="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(i);return ke("KeyframeTrack:",i),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Vs;case this.InterpolantFactoryMethodLinear:return Gs;case this.InterpolantFactoryMethodSmooth:return Xa;case this.InterpolantFactoryMethodBezier:return Th}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let i=0,s=t.length;i!==s;++i)t[i]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let i=0,s=t.length;i!==s;++i)t[i]*=e;Ya(this.settings)&&(ff(this.settings.inTangents,e),ff(this.settings.outTangents,e))}return this}trim(e,t){let i=this.times,s=i.length,r=0,o=s-1;for(;r!==s&&i[r]<e;)++r;for(;o!==-1&&i[o]>t;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=i.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(Ye("KeyframeTrack: Invalid value size in track.",this),e=!1);let i=this.times,s=this.values,r=i.length;r===0&&(Ye("KeyframeTrack: Track is empty.",this),e=!1);let o=null;for(let a=0;a!==r;a++){let l=i[a];if(typeof l=="number"&&isNaN(l)){Ye("KeyframeTrack: Time is not a valid number.",this,a,l),e=!1;break}if(o!==null&&o>l){Ye("KeyframeTrack: Out of order keys.",this,a,l,o),e=!1;break}o=l}if(s!==void 0&&qm(s))for(let a=0,l=s.length;a!==l;++a){let c=s[a];if(isNaN(c)){Ye("KeyframeTrack: Value is not a valid number.",this,a,c),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),i=this.getValueSize(),s=this.getInterpolation()===Xa,r=e.length-1,o=1;for(let a=1;a<r;++a){let l=!1,c=e[a],h=e[a+1];if(c!==h&&(a!==1||c!==e[0]))if(s)l=!0;else{let u=a*i,d=u-i,f=u+i;for(let m=0;m!==i;++m){let _=t[u+m];if(_!==t[d+m]||_!==t[f+m]){l=!0;break}}}if(l){if(a!==o){e[o]=e[a];let u=a*i,d=o*i;for(let f=0;f!==i;++f)t[d+f]=t[u+f]}++o}}if(r>0){e[o]=e[r];for(let a=r*i,l=o*i,c=0;c!==i;++c)t[l+c]=t[a+c];++o}return o!==e.length?(this.times=e.slice(0,o),this.values=t.slice(0,o*i)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),i=this.constructor,s=new i(this.name,e,t);return s.createInterpolant=this.createInterpolant,Ya(this.settings)&&(s.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),s}};function ff(n,e){for(let t=0,i=n.length;t!==i;t+=2)n[t]*=e}Vn.prototype.ValueTypeName="";Vn.prototype.TimeBufferType=Float32Array;Vn.prototype.ValueBufferType=Float32Array;Vn.prototype.DefaultInterpolation=Gs;var Qi=class extends Vn{constructor(e,t,i){super(e,t,i)}};Qi.prototype.ValueTypeName="bool";Qi.prototype.ValueBufferType=Array;Qi.prototype.DefaultInterpolation=Vs;Qi.prototype.InterpolantFactoryMethodLinear=void 0;Qi.prototype.InterpolantFactoryMethodSmooth=void 0;var zo=class extends Vn{constructor(e,t,i,s){super(e,t,i,s)}};zo.prototype.ValueTypeName="color";var es=class extends Vn{constructor(e,t,i,s){super(e,t,i,s)}};es.prototype.ValueTypeName="number";var vl=class extends Ci{constructor(e,t,i,s){super(e,t,i,s)}interpolate_(e,t,i,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(i-t)/(s-t),c=e*a;for(let h=c+a;c!==h;c+=4)ft.slerpFlat(r,0,o,c-a,o,c,l);return r}},ts=class extends Vn{constructor(e,t,i,s){super(e,t,i,s)}InterpolantFactoryMethodLinear(e){return new vl(this.times,this.values,this.getValueSize(),e)}};ts.prototype.ValueTypeName="quaternion";ts.prototype.InterpolantFactoryMethodSmooth=void 0;var ns=class extends Vn{constructor(e,t,i){super(e,t,i)}};ns.prototype.ValueTypeName="string";ns.prototype.ValueBufferType=Array;ns.prototype.DefaultInterpolation=Vs;ns.prototype.InterpolantFactoryMethodLinear=void 0;ns.prototype.InterpolantFactoryMethodSmooth=void 0;var xs=class extends Vn{constructor(e,t,i,s){super(e,t,i,s)}};xs.prototype.ValueTypeName="vector";var Vo=class{constructor(e="",t=-1,i=[],s=Xf){this.name=e,this.tracks=i,this.duration=t,this.blendMode=s,this.uuid=ei(),this.userData={},this.duration<0&&this.resetDuration()}static parse(e){let t=[],i=e.tracks,s=1/(e.fps||1);for(let o=0,a=i.length;o!==a;++o)t.push(f0(i[o]).scale(s));let r=new this(e.name,e.duration,t,e.blendMode);return r.uuid=e.uuid,r.userData=JSON.parse(e.userData||"{}"),r}static toJSON(e){let t=[],i=e.tracks,s={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode,userData:JSON.stringify(e.userData)};for(let r=0,o=i.length;r!==o;++r)t.push(Vn.toJSON(i[r]));return s}static CreateFromMorphTargetSequence(e,t,i,s){let r=t.length,o=[];for(let a=0;a<r;a++){let l=[],c=[];l.push((a+r-1)%r,a,(a+1)%r),c.push(0,1,0);let h=l0(l);l=df(l,1,h),c=df(c,1,h),!s&&l[0]===0&&(l.push(r),c.push(c[0])),o.push(new es(".morphTargetInfluences["+t[a].name+"]",l,c).scale(1/i))}return new this(e,-1,o)}static findByName(e,t){let i=e;if(!Array.isArray(e)){let s=e;i=s.geometry&&s.geometry.animations||s.animations}for(let s=0;s<i.length;s++)if(i[s].name===t)return i[s];return null}static CreateClipsFromMorphTargetSequences(e,t,i){let s={},r=/^([\w-]*?)([\d]+)$/;for(let a=0,l=e.length;a<l;a++){let c=e[a],h=c.name.match(r);if(h&&h.length>1){let u=h[1],d=s[u];d||(s[u]=d=[]),d.push(c)}}let o=[];for(let a in s)o.push(this.CreateFromMorphTargetSequence(a,s[a],t,i));return o}resetDuration(){let e=this.tracks,t=0;for(let i=0,s=e.length;i!==s;++i){let r=this.tracks[i];t=Math.max(t,r.times[r.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){let e=[];for(let i=0;i<this.tracks.length;i++)e.push(this.tracks[i].clone());let t=new this.constructor(this.name,this.duration,e,this.blendMode);return t.userData=JSON.parse(JSON.stringify(this.userData)),t}toJSON(){return this.constructor.toJSON(this)}};function d0(n){switch(n.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return es;case"vector":case"vector2":case"vector3":case"vector4":return xs;case"color":return zo;case"quaternion":return ts;case"bool":case"boolean":return Qi;case"string":return ns}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+n)}function f0(n){if(n.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");let e=d0(n.type);if(n.times===void 0){let i=[],s=[];c0(n.keys,i,s,"value"),n.times=i,n.values=s}let t;return e.parse!==void 0?t=e.parse(n):t=new e(n.name,n.times,n.values,n.interpolation),Ya(n.settings)&&(t.settings={inTangents:ps(n.settings.inTangents,Float32Array),outTangents:ps(n.settings.outTangents,Float32Array)}),t}var Si={enabled:!1,files:{},add:function(n,e){this.enabled!==!1&&(pf(n)||(this.files[n]=e))},get:function(n){if(this.enabled!==!1&&!pf(n))return this.files[n]},remove:function(n){delete this.files[n]},clear:function(){this.files={}}};function pf(n){try{let e=n.slice(n.indexOf(":")+1);return new URL(e).protocol==="blob:"}catch{return!1}}var bl=class{constructor(e,t,i){let s=this,r=!1,o=0,a=0,l,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=i,this._abortController=null,this.itemStart=function(h){a++,r===!1&&s.onStart!==void 0&&s.onStart(h,o,a),r=!0},this.itemEnd=function(h){o++,s.onProgress!==void 0&&s.onProgress(h,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return h=h.normalize("NFC"),l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,u){return c.push(h,u),this},this.removeHandler=function(h){let u=c.indexOf(h);return u!==-1&&c.splice(u,2),this},this.getHandler=function(h){for(let u=0,d=c.length;u<d;u+=2){let f=c[u],m=c[u+1];if(f.global&&(f.lastIndex=0),f.test(h))return m}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},dp=new bl,di=class{constructor(e){this.manager=e!==void 0?e:dp,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){let i=this;return new Promise(function(s,r){i.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};di.DEFAULT_MATERIAL_NAME="__DEFAULT";var Xi={},Lh=class extends Error{constructor(e,t){super(e),this.response=t}},Ys=class extends di{constructor(e){super(e),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(e,t,i,s){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=Si.get(`file:${e}`);if(r!==void 0){this.manager.itemStart(e),setTimeout(()=>{t&&t(r),this.manager.itemEnd(e)},0);return}if(Xi[e]!==void 0){Xi[e].push({onLoad:t,onProgress:i,onError:s});return}Xi[e]=[],Xi[e].push({onLoad:t,onProgress:i,onError:s});let o=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),a=this.mimeType,l=this.responseType;fetch(o).then(c=>{if(c.status===200||c.status===0){if(c.status===0&&ke("FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||c.body===void 0||c.body.getReader===void 0)return c;let h=Xi[e],u=c.body.getReader(),d=c.headers.get("X-File-Size")||c.headers.get("Content-Length"),f=d?parseInt(d):0,m=f!==0,_=0,p=new ReadableStream({start(g){T();function T(){u.read().then(({done:x,value:v})=>{if(x)g.close();else{_+=v.byteLength;let M=new ProgressEvent("progress",{lengthComputable:m,loaded:_,total:f});for(let E=0,A=h.length;E<A;E++){let y=h[E];y.onProgress&&y.onProgress(M)}g.enqueue(v),T()}},x=>{g.error(x)})}}});return new Response(p)}else throw new Lh(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`,c)}).then(c=>{switch(l){case"arraybuffer":return c.arrayBuffer();case"blob":return c.blob();case"document":return c.text().then(h=>new DOMParser().parseFromString(h,a));case"json":return c.json();default:if(a==="")return c.text();{let u=/charset="?([^;"\s]*)"?/i.exec(a),d=u&&u[1]?u[1].toLowerCase():void 0,f=new TextDecoder(d);return c.arrayBuffer().then(m=>f.decode(m))}}}).then(c=>{Si.add(`file:${e}`,c);let h=Xi[e];delete Xi[e];for(let u=0,d=h.length;u<d;u++){let f=h[u];f.onLoad&&f.onLoad(c)}}).catch(c=>{let h=Xi[e];if(h===void 0)throw this.manager.itemError(e),c;delete Xi[e];for(let u=0,d=h.length;u<d;u++){let f=h[u];f.onError&&f.onError(c)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}};var Mr=new WeakMap,Ml=class extends di{constructor(e){super(e)}load(e,t,i,s){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=this,o=Si.get(`image:${e}`);if(o!==void 0){if(o.complete===!0)r.manager.itemStart(e),setTimeout(function(){t&&t(o),r.manager.itemEnd(e)},0);else{let u=Mr.get(o);u===void 0&&(u=[],Mr.set(o,u)),u.push({onLoad:t,onError:s})}return o}let a=Rr("img");function l(){h(),t&&t(this);let u=Mr.get(this)||[];for(let d=0;d<u.length;d++){let f=u[d];f.onLoad&&f.onLoad(this)}Mr.delete(this),r.manager.itemEnd(e)}function c(u){h(),s&&s(u),Si.remove(`image:${e}`);let d=Mr.get(this)||[];for(let f=0;f<d.length;f++){let m=d[f];m.onError&&m.onError(u)}Mr.delete(this),r.manager.itemError(e),r.manager.itemEnd(e)}function h(){a.removeEventListener("load",l,!1),a.removeEventListener("error",c,!1)}return a.addEventListener("load",l,!1),a.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(a.crossOrigin=this.crossOrigin),Si.add(`image:${e}`,a),r.manager.itemStart(e),a.src=e,a}};var Go=class extends di{constructor(e){super(e)}load(e,t,i,s){let r=this,o=new _s,a=new Ys(this.manager);return a.setResponseType("arraybuffer"),a.setRequestHeader(this.requestHeader),a.setPath(this.path),a.setWithCredentials(r.withCredentials),a.load(e,function(l){let c;try{c=r.parse(l)}catch(h){s!==void 0?s(h):Ye(h);return}r._applyTexData(o,c),t&&t(o,c)},i,s),o}createDataTexture(e){let t=new _s;return this._applyTexData(t,this.parse(e)),t}_applyTexData(e,t){t.image!==void 0?e.image=t.image:t.data!==void 0&&(e.image.width=t.width,e.image.height=t.height,e.image.data=t.data),e.wrapS=t.wrapS!==void 0?t.wrapS:On,e.wrapT=t.wrapT!==void 0?t.wrapT:On,e.magFilter=t.magFilter!==void 0?t.magFilter:Rt,e.minFilter=t.minFilter!==void 0?t.minFilter:Rt,e.anisotropy=t.anisotropy!==void 0?t.anisotropy:1,t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.mipmaps!==void 0&&(e.mipmaps=t.mipmaps,e.minFilter=mn),t.mipmapCount===1&&(e.minFilter=Rt),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),e.needsUpdate=!0}},Zn=class extends di{constructor(e){super(e)}load(e,t,i,s){let r=new on,o=new Ml(this.manager);return o.setCrossOrigin(this.crossOrigin),o.setPath(this.path),o.load(e,function(a){r.image=a,r.needsUpdate=!0,t!==void 0&&t(r)},i,s),r}},$s=class extends Ut{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Ne(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}},Zs=class extends $s{constructor(e,t,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Ut.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Ne(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){let t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}},Mh=new We,mf=new C,gf=new C,zr=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ae(512,512),this.mapType=Wn,this.map=null,this.mapPass=null,this.matrix=new We,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Fr,this._frameExtents=new ae(1,1),this._viewportCount=1,this._viewports=[new Mt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera;mf.setFromMatrixPosition(e.matrixWorld),t.position.copy(mf),gf.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(gf),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,i,s){Mh.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),i.setFromProjectionMatrix(Mh,e.coordinateSystem,e.reversedDepth);let r=this._frameExtents,o=s?s.z/r.x:1,a=s?s.w/r.y:1,l=s?s.x/r.x:0,c=s?s.y/r.y:0;e.coordinateSystem===Ar||e.reversedDepth?t.set(.5*o,0,0,.5*o+l,0,.5*a,0,.5*a+c,0,0,1,0,0,0,0,1):t.set(.5*o,0,0,.5*o+l,0,.5*a,0,.5*a+c,0,0,.5,.5,0,0,0,1),t.multiply(Mh)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},Ha=new C,Wa=new ft,xi=new C,Ho=class extends Ut{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new We,this.projectionMatrix=new We,this.projectionMatrixInverse=new We,this.coordinateSystem=hi,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Ha,Wa,xi),xi.x===1&&xi.y===1&&xi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Ha,Wa,xi.set(1,1,1)).invert()}updateWorldMatrix(e,t,i=!1){super.updateWorldMatrix(e,t,i),this.matrixWorld.decompose(Ha,Wa,xi),xi.x===1&&xi.y===1&&xi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Ha,Wa,xi.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},fs=new C,_f=new ae,yf=new ae,tn=class extends Ho{constructor(e=50,t=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=Hs*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(mo*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Hs*2*Math.atan(Math.tan(mo*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){fs.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(fs.x,fs.y).multiplyScalar(-e/fs.z),fs.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(fs.x,fs.y).multiplyScalar(-e/fs.z)}getViewSize(e,t){return this.getViewBounds(e,_f,yf),t.subVectors(yf,_f)}setViewOffset(e,t,i,s,r,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(mo*.5*this.fov)/this.zoom,i=2*t,s=this.aspect*i,r=-.5*s,o=this.view;if(this.view!==null&&this.view.enabled){let l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*s/l,t-=o.offsetY*i/c,s*=o.width/l,i*=o.height/c}let a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},Dh=class extends zr{constructor(){super(new tn(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){let t=this.camera,i=Hs*2*e.angle*this.focus,s=this.mapSize.width/this.mapSize.height*this.aspect,r=e.distance||t.far;(i!==t.fov||s!==t.aspect||r!==t.far)&&(t.fov=i,t.aspect=s,t.far=r,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this.aspect=e.aspect,this}toJSON(){let e=super.toJSON();return e.focus=this.focus,e.aspect=this.aspect,e}},fi=class extends $s{constructor(e,t,i=0,s=Math.PI/3,r=0,o=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(Ut.DEFAULT_UP),this.updateMatrix(),this.target=new Ut,this.distance=i,this.angle=s,this.penumbra=r,this.decay=o,this.map=null,this.shadow=new Dh}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.map=e.map,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.angle=this.angle,t.object.decay=this.decay,t.object.penumbra=this.penumbra,t.object.target=this.target.uuid,this.map&&this.map.isTexture&&(t.object.map=this.map.toJSON(e).uuid),t.object.shadow=this.shadow.toJSON(),t}},Nh=class extends zr{constructor(){super(new tn(90,1,.5,500)),this.isPointLightShadow=!0}},Gn=class extends $s{constructor(e,t,i=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=s,this.shadow=new Nh}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}},Ss=class extends Ho{constructor(e=-1,t=1,i=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=i-e,o=i+e,a=s+t,l=s-t;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},Uh=class extends zr{constructor(){super(new Ss(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Wo=class extends $s{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Ut.DEFAULT_UP),this.updateMatrix(),this.target=new Ut,this.shadow=new Uh}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}};var is=class{static extractUrlBase(e){let t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}};var xh=new WeakMap,Xo=class extends di{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&ke("ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&ke("ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"},this._abortController=new AbortController}setOptions(e){return this.options=e,this}load(e,t,i,s){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=this,o=Si.get(`image-bitmap:${e}`);if(o!==void 0){if(r.manager.itemStart(e),o.then){o.then(c=>{xh.has(o)===!0?(s&&s(xh.get(o)),r.manager.itemError(e),r.manager.itemEnd(e)):(t&&t(c),r.manager.itemEnd(e))});return}setTimeout(function(){t&&t(o),r.manager.itemEnd(e)},0);return}let a={};a.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",a.headers=this.requestHeader,a.signal=typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;let l=fetch(e,a).then(function(c){return c.blob()}).then(function(c){return createImageBitmap(c,Object.assign({},r.options,{colorSpaceConversion:"none"}))}).then(function(c){return Si.add(`image-bitmap:${e}`,c),t&&t(c),r.manager.itemEnd(e),c}).catch(function(c){s&&s(c),xh.set(l,c),Si.remove(`image-bitmap:${e}`),r.manager.itemError(e),r.manager.itemEnd(e)});Si.add(`image-bitmap:${e}`,l),r.manager.itemStart(e)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}};var xr=-90,Sr=1,xl=class extends Ut{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new tn(xr,Sr,e,t);s.layers=this.layers,this.add(s);let r=new tn(xr,Sr,e,t);r.layers=this.layers,this.add(r);let o=new tn(xr,Sr,e,t);o.layers=this.layers,this.add(o);let a=new tn(xr,Sr,e,t);a.layers=this.layers,this.add(a);let l=new tn(xr,Sr,e,t);l.layers=this.layers,this.add(l);let c=new tn(xr,Sr,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[i,s,r,o,a,l]=t;for(let c of t)this.remove(c);if(e===hi)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Ar)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,l,c,h]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),m=e.xr.enabled;e.xr.enabled=!1;let _=i.texture.generateMipmaps;i.texture.generateMipmaps=!1;let p=!1;e.isWebGLRenderer===!0?p=e.state.buffers.depth.getReversed():p=e.reversedDepthBuffer,e.setRenderTarget(i,0,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(i,1,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(i,2,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(i,3,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(i,4,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),i.texture.generateMipmaps=_,e.setRenderTarget(i,5,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,h),e.setRenderTarget(u,d,f),e.xr.enabled=m,i.texture.needsPMREMUpdate=!0}},Sl=class extends tn{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}};var hu="\\[\\]\\.:\\/",p0=new RegExp("["+hu+"]","g"),uu="[^"+hu+"]",m0="[^"+hu.replace("\\.","")+"]",g0=/((?:WC+[\/:])*)/.source.replace("WC",uu),_0=/(WCOD+)?/.source.replace("WCOD",m0),y0=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",uu),v0=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",uu),b0=new RegExp("^"+g0+_0+y0+v0+"$"),M0=["material","materials","bones","map"],Fh=class{constructor(e,t,i){let s=i||At.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();let i=this._targetGroup.nCachedObjects_,s=this._bindings[i];s!==void 0&&s.getValue(e,t)}setValue(e,t){let i=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=i.length;s!==r;++s)i[s].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,i=e.length;t!==i;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,i=e.length;t!==i;++t)e[t].unbind()}},At=class n{constructor(e,t,i){this.path=t,this.parsedPath=i||n.parseTrackName(t),this.node=n.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,i){return e&&e.isAnimationObjectGroup?new n.Composite(e,t,i):new n(e,t,i)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(p0,"")}static parseTrackName(e){let t=b0.exec(e);if(t===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+e);let i={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=i.nodeName&&i.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=i.nodeName.substring(s+1);M0.indexOf(r)!==-1&&(i.nodeName=i.nodeName.substring(0,s),i.objectName=r)}if(i.propertyName===null||i.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+e);return i}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let i=e.skeleton.getBoneByName(t);if(i!==void 0)return i}if(e.children){let i=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===t||a.uuid===t)return a;let l=i(a.children);if(l)return l}return null},s=i(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)e[t++]=i[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,i=t.objectName,s=t.propertyName,r=t.propertyIndex;if(e||(e=n.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){ke("PropertyBinding: No target node found for track: "+this.path+".");return}if(i){let c=t.objectIndex;switch(i){case"materials":if(!e.material){Ye("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){Ye("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){Ye("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===c){c=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){Ye("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){Ye("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[i]===void 0){Ye("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[i]}if(c!==void 0){if(e[c]===void 0){Ye("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}let o=e[s];if(o===void 0){let c=t.nodeName;Ye("PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",e);return}let a=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?a=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){Ye("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){Ye("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};At.Composite=Fh;At.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};At.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};At.prototype.GetterByBindingType=[At.prototype._getValue_direct,At.prototype._getValue_array,At.prototype._getValue_arrayElement,At.prototype._getValue_toArray];At.prototype.SetterByBindingTypeAndVersioning=[[At.prototype._setValue_direct,At.prototype._setValue_direct_setNeedsUpdate,At.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[At.prototype._setValue_array,At.prototype._setValue_array_setNeedsUpdate,At.prototype._setValue_array_setMatrixWorldNeedsUpdate],[At.prototype._setValue_arrayElement,At.prototype._setValue_arrayElement_setNeedsUpdate,At.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[At.prototype._setValue_fromArray,At.prototype._setValue_fromArray_setNeedsUpdate,At.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var Ex=new Float32Array(1);var vf=new We,Pi=class{constructor(e,t,i=0,s=1/0){this.ray=new wi(e,t),this.near=i,this.far=s,this.camera=null,this.layers=new Ir,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,t.projectionMatrix.elements[14]).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):Ye("Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return vf.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(vf),this}intersectObject(e,t=!0,i=[]){return Oh(e,this,i,t),i.sort(bf),i}intersectObjects(e,t=!0,i=[]){for(let s=0,r=e.length;s<r;s++)Oh(e[s],this,i,t);return i.sort(bf),i}};function bf(n,e){return n.distance-e.distance}function Oh(n,e,t,i){let s=!0;if(n.layers.test(e.layers)&&n.raycast(e,t)===!1&&(s=!1),s===!0&&i===!0){let r=n.children;for(let o=0,a=r.length;o<a;o++)Oh(r[o],e,t,!0)}}var Vr=class{constructor(e=1,t=0,i=0){this.radius=e,this.phi=t,this.theta=i}set(e,t,i){return this.radius=e,this.phi=t,this.theta=i,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=tt(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,i){return this.radius=Math.sqrt(e*e+t*t+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,i),this.phi=Math.acos(tt(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}};var Bh=class n{static{n.prototype.isMatrix2=!0}constructor(e,t,i,s){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,i,s)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let i=0;i<4;i++)this.elements[i]=e[i+t];return this}set(e,t,i,s){let r=this.elements;return r[0]=e,r[2]=t,r[1]=i,r[3]=s,this}};var qo=class extends ui{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(e){this.domElement!==null&&this.disconnect(),this.domElement=e}disconnect(){}dispose(){}update(){}};function du(n,e,t,i){let s=x0(i);switch(t){case nu:return n*e;case Cl:return n*e/s.components*s.byteLength;case Pl:return n*e/s.components*s.byteLength;case Cs:return n*e*2/s.components*s.byteLength;case Il:return n*e*2/s.components*s.byteLength;case iu:return n*e*3/s.components*s.byteLength;case Kn:return n*e*4/s.components*s.byteLength;case Ll:return n*e*4/s.components*s.byteLength;case Zo:case Ko:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case Jo:case jo:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Nl:case Fl:return Math.max(n,16)*Math.max(e,8)/4;case Dl:case Ul:return Math.max(n,8)*Math.max(e,8)/2;case Ol:case Bl:case zl:case Vl:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case kl:case Qo:case Gl:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Hl:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Wl:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case Xl:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case ql:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case Yl:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case $l:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case Zl:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case Kl:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case Jl:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case jl:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case Ql:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case ec:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case tc:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case nc:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case ic:case sc:case rc:return Math.ceil(n/4)*Math.ceil(e/4)*16;case oc:case ac:return Math.ceil(n/4)*Math.ceil(e/4)*8;case ea:case lc:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function x0(n){switch(n){case Wn:case jh:return{byteLength:1,components:1};case Xr:case Qh:case Fn:return{byteLength:2,components:1};case Al:case Rl:return{byteLength:2,components:4};case mi:case El:case An:return{byteLength:4,components:1};case eu:case tu:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"186"}}));typeof window<"u"&&(window.__THREE__?ke("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="186");function Np(){let n=null,e=!1,t=null,i=null;function s(r,o){i=n.requestAnimationFrame(s),t(r,o)}return{start:function(){e!==!0&&t!==null&&n!==null&&(i=n.requestAnimationFrame(s),e=!0)},stop:function(){n!==null&&n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){n=r}}}function T0(n){let e=new WeakMap;function t(a,l){let c=a.array,h=a.usage,u=c.byteLength,d=n.createBuffer();n.bindBuffer(l,d),n.bufferData(l,c,h),a.onUploadCallback();let f;if(c instanceof Float32Array)f=n.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)f=n.HALF_FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?f=n.HALF_FLOAT:f=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=n.SHORT;else if(c instanceof Uint32Array)f=n.UNSIGNED_INT;else if(c instanceof Int32Array)f=n.INT;else if(c instanceof Int8Array)f=n.BYTE;else if(c instanceof Uint8Array)f=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:u}}function i(a,l,c){let h=l.array,u=l.updateRanges;if(n.bindBuffer(c,a),u.length===0)n.bufferSubData(c,0,h);else{u.sort((f,m)=>f.start-m.start);let d=0;for(let f=1;f<u.length;f++){let m=u[d],_=u[f];_.start<=m.start+m.count+1?m.count=Math.max(m.count,_.start+_.count-m.start):(++d,u[d]=_)}u.length=d+1;for(let f=0,m=u.length;f<m;f++){let _=u[f];n.bufferSubData(c,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);let l=e.get(a);l&&(n.deleteBuffer(l.buffer),e.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let h=e.get(a);(!h||h.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let c=e.get(a);if(c===void 0)e.set(a,t(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,a,l),c.version=a.version}}return{get:s,remove:r,update:o}}var w0=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,E0=`#ifdef USE_ALPHAHASH
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
#endif`,A0=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,R0=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,C0=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,P0=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,I0=`#ifdef USE_AOMAP
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
#endif`,L0=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,D0=`#ifdef USE_BATCHING
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
#endif`,N0=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,U0=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,F0=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,O0=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,B0=`#ifdef USE_IRIDESCENCE
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
#endif`,k0=`#ifdef USE_BUMPMAP
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
#endif`,z0=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,V0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,G0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,H0=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,W0=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,X0=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,q0=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,Y0=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,$0=`#define PI 3.141592653589793
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
} // validated`,Z0=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,K0=`vec3 transformedNormal = objectNormal;
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
#endif`,J0=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,j0=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Q0=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,e_=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,t_="gl_FragColor = linearToOutputTexel( gl_FragColor );",n_=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,i_=`#ifdef USE_ENVMAP
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
#endif`,s_=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,r_=`#ifdef USE_ENVMAP
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
#endif`,o_=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,a_=`#ifdef USE_ENVMAP
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
#endif`,l_=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,c_=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,h_=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,u_=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,d_=`#ifdef USE_GRADIENTMAP
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
}`,f_=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,p_=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,m_=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,g_=`uniform bool receiveShadow;
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
#include <lightprobes_pars_fragment>`,__=`#ifdef USE_ENVMAP
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
#endif`,y_=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,v_=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,b_=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,M_=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,x_=`PhysicalMaterial material;
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
#endif`,S_=`uniform sampler2D dfgLUT;
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
}`,T_=`
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
#endif`,w_=`#if defined( RE_IndirectDiffuse )
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
#endif`,E_=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,A_=`#ifdef USE_LIGHT_PROBES_GRID
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
#endif`,R_=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,C_=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,P_=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,I_=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,L_=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,D_=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,N_=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,U_=`#if defined( USE_POINTS_UV )
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
#endif`,F_=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,O_=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,B_=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,k_=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,z_=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,V_=`#ifdef USE_MORPHTARGETS
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
#endif`,G_=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,H_=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,W_=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,X_=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,q_=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Y_=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,$_=`#ifdef USE_NORMALMAP
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
#endif`,Z_=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,K_=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,J_=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,j_=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Q_=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,ey=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,ty=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,ny=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,iy=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,sy=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,ry=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,oy=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,ay=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,ly=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,cy=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,hy=`float getShadowMask() {
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
}`,uy=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,dy=`#ifdef USE_SKINNING
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
#endif`,fy=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,py=`#ifdef USE_SKINNING
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
#endif`,my=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,gy=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,_y=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,yy=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,vy=`#ifdef USE_TRANSMISSION
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
#endif`,by=`#ifdef USE_TRANSMISSION
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
#endif`,My=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,xy=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Sy=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Ty=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,wy=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Ey=`uniform sampler2D t2D;
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
}`,Ay=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Ry=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Cy=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Py=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Iy=`#include <common>
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
}`,Ly=`#if DEPTH_PACKING == 3200
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
}`,Dy=`#define DISTANCE
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
}`,Ny=`#define DISTANCE
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
}`,Uy=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Fy=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Oy=`uniform float scale;
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
}`,By=`uniform vec3 diffuse;
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
}`,ky=`#include <common>
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
}`,zy=`uniform vec3 diffuse;
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
}`,Vy=`#define LAMBERT
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
}`,Gy=`#define LAMBERT
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
}`,Hy=`#define MATCAP
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
}`,Wy=`#define MATCAP
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
}`,Xy=`#define NORMAL
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
}`,qy=`#define NORMAL
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
}`,Yy=`#define PHONG
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
}`,$y=`#define PHONG
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
}`,Zy=`#define STANDARD
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
}`,Ky=`#define STANDARD
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
}`,Jy=`#define TOON
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
}`,jy=`#define TOON
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
}`,Qy=`uniform float size;
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
}`,ev=`uniform vec3 diffuse;
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
}`,tv=`#include <common>
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
}`,nv=`uniform vec3 color;
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
}`,iv=`uniform float rotation;
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
}`,sv=`uniform vec3 diffuse;
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
}`,st={alphahash_fragment:w0,alphahash_pars_fragment:E0,alphamap_fragment:A0,alphamap_pars_fragment:R0,alphatest_fragment:C0,alphatest_pars_fragment:P0,aomap_fragment:I0,aomap_pars_fragment:L0,batching_pars_vertex:D0,batching_vertex:N0,begin_vertex:U0,beginnormal_vertex:F0,bsdfs:O0,iridescence_fragment:B0,bumpmap_pars_fragment:k0,clipping_planes_fragment:z0,clipping_planes_pars_fragment:V0,clipping_planes_pars_vertex:G0,clipping_planes_vertex:H0,color_fragment:W0,color_pars_fragment:X0,color_pars_vertex:q0,color_vertex:Y0,common:$0,cube_uv_reflection_fragment:Z0,defaultnormal_vertex:K0,displacementmap_pars_vertex:J0,displacementmap_vertex:j0,emissivemap_fragment:Q0,emissivemap_pars_fragment:e_,colorspace_fragment:t_,colorspace_pars_fragment:n_,envmap_fragment:i_,envmap_common_pars_fragment:s_,envmap_pars_fragment:r_,envmap_pars_vertex:o_,envmap_physical_pars_fragment:__,envmap_vertex:a_,fog_vertex:l_,fog_pars_vertex:c_,fog_fragment:h_,fog_pars_fragment:u_,gradientmap_pars_fragment:d_,lightmap_pars_fragment:f_,lights_lambert_fragment:p_,lights_lambert_pars_fragment:m_,lights_pars_begin:g_,lights_toon_fragment:y_,lights_toon_pars_fragment:v_,lights_phong_fragment:b_,lights_phong_pars_fragment:M_,lights_physical_fragment:x_,lights_physical_pars_fragment:S_,lights_fragment_begin:T_,lights_fragment_maps:w_,lights_fragment_end:E_,lightprobes_pars_fragment:A_,logdepthbuf_fragment:R_,logdepthbuf_pars_fragment:C_,logdepthbuf_pars_vertex:P_,logdepthbuf_vertex:I_,map_fragment:L_,map_pars_fragment:D_,map_particle_fragment:N_,map_particle_pars_fragment:U_,metalnessmap_fragment:F_,metalnessmap_pars_fragment:O_,morphinstance_vertex:B_,morphcolor_vertex:k_,morphnormal_vertex:z_,morphtarget_pars_vertex:V_,morphtarget_vertex:G_,normal_fragment_begin:H_,normal_fragment_maps:W_,normal_pars_fragment:X_,normal_pars_vertex:q_,normal_vertex:Y_,normalmap_pars_fragment:$_,clearcoat_normal_fragment_begin:Z_,clearcoat_normal_fragment_maps:K_,clearcoat_pars_fragment:J_,iridescence_pars_fragment:j_,opaque_fragment:Q_,packing:ey,premultiplied_alpha_fragment:ty,project_vertex:ny,dithering_fragment:iy,dithering_pars_fragment:sy,roughnessmap_fragment:ry,roughnessmap_pars_fragment:oy,shadowmap_pars_fragment:ay,shadowmap_pars_vertex:ly,shadowmap_vertex:cy,shadowmask_pars_fragment:hy,skinbase_vertex:uy,skinning_pars_vertex:dy,skinning_vertex:fy,skinnormal_vertex:py,specularmap_fragment:my,specularmap_pars_fragment:gy,tonemapping_fragment:_y,tonemapping_pars_fragment:yy,transmission_fragment:vy,transmission_pars_fragment:by,uv_pars_fragment:My,uv_pars_vertex:xy,uv_vertex:Sy,worldpos_vertex:Ty,background_vert:wy,background_frag:Ey,backgroundCube_vert:Ay,backgroundCube_frag:Ry,cube_vert:Cy,cube_frag:Py,depth_vert:Iy,depth_frag:Ly,distance_vert:Dy,distance_frag:Ny,equirect_vert:Uy,equirect_frag:Fy,linedashed_vert:Oy,linedashed_frag:By,meshbasic_vert:ky,meshbasic_frag:zy,meshlambert_vert:Vy,meshlambert_frag:Gy,meshmatcap_vert:Hy,meshmatcap_frag:Wy,meshnormal_vert:Xy,meshnormal_frag:qy,meshphong_vert:Yy,meshphong_frag:$y,meshphysical_vert:Zy,meshphysical_frag:Ky,meshtoon_vert:Jy,meshtoon_frag:jy,points_vert:Qy,points_frag:ev,shadow_vert:tv,shadow_frag:nv,sprite_vert:iv,sprite_frag:sv},Te={common:{diffuse:{value:new Ne(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new je},alphaMap:{value:null},alphaMapTransform:{value:new je},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new je}},envmap:{envMap:{value:null},envMapRotation:{value:new je},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new je}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new je}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new je},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new je},normalScale:{value:new ae(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new je},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new je}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new je}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new je}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ne(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new C},probesMax:{value:new C},probesResolution:{value:new C}},points:{diffuse:{value:new Ne(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new je},alphaTest:{value:0},uvTransform:{value:new je}},sprite:{diffuse:{value:new Ne(16777215)},opacity:{value:1},center:{value:new ae(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new je},alphaMap:{value:null},alphaMapTransform:{value:new je},alphaTest:{value:0}}},Di={basic:{uniforms:Rn([Te.common,Te.specularmap,Te.envmap,Te.aomap,Te.lightmap,Te.fog]),vertexShader:st.meshbasic_vert,fragmentShader:st.meshbasic_frag},lambert:{uniforms:Rn([Te.common,Te.specularmap,Te.envmap,Te.aomap,Te.lightmap,Te.emissivemap,Te.bumpmap,Te.normalmap,Te.displacementmap,Te.fog,Te.lights,{emissive:{value:new Ne(0)},envMapIntensity:{value:1}}]),vertexShader:st.meshlambert_vert,fragmentShader:st.meshlambert_frag},phong:{uniforms:Rn([Te.common,Te.specularmap,Te.envmap,Te.aomap,Te.lightmap,Te.emissivemap,Te.bumpmap,Te.normalmap,Te.displacementmap,Te.fog,Te.lights,{emissive:{value:new Ne(0)},specular:{value:new Ne(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:st.meshphong_vert,fragmentShader:st.meshphong_frag},standard:{uniforms:Rn([Te.common,Te.envmap,Te.aomap,Te.lightmap,Te.emissivemap,Te.bumpmap,Te.normalmap,Te.displacementmap,Te.roughnessmap,Te.metalnessmap,Te.fog,Te.lights,{emissive:{value:new Ne(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:st.meshphysical_vert,fragmentShader:st.meshphysical_frag},toon:{uniforms:Rn([Te.common,Te.aomap,Te.lightmap,Te.emissivemap,Te.bumpmap,Te.normalmap,Te.displacementmap,Te.gradientmap,Te.fog,Te.lights,{emissive:{value:new Ne(0)}}]),vertexShader:st.meshtoon_vert,fragmentShader:st.meshtoon_frag},matcap:{uniforms:Rn([Te.common,Te.bumpmap,Te.normalmap,Te.displacementmap,Te.fog,{matcap:{value:null}}]),vertexShader:st.meshmatcap_vert,fragmentShader:st.meshmatcap_frag},points:{uniforms:Rn([Te.points,Te.fog]),vertexShader:st.points_vert,fragmentShader:st.points_frag},dashed:{uniforms:Rn([Te.common,Te.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:st.linedashed_vert,fragmentShader:st.linedashed_frag},depth:{uniforms:Rn([Te.common,Te.displacementmap]),vertexShader:st.depth_vert,fragmentShader:st.depth_frag},normal:{uniforms:Rn([Te.common,Te.bumpmap,Te.normalmap,Te.displacementmap,{opacity:{value:1}}]),vertexShader:st.meshnormal_vert,fragmentShader:st.meshnormal_frag},sprite:{uniforms:Rn([Te.sprite,Te.fog]),vertexShader:st.sprite_vert,fragmentShader:st.sprite_frag},background:{uniforms:{uvTransform:{value:new je},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:st.background_vert,fragmentShader:st.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new je}},vertexShader:st.backgroundCube_vert,fragmentShader:st.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:st.cube_vert,fragmentShader:st.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:st.equirect_vert,fragmentShader:st.equirect_frag},distance:{uniforms:Rn([Te.common,Te.displacementmap,{referencePosition:{value:new C},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:st.distance_vert,fragmentShader:st.distance_frag},shadow:{uniforms:Rn([Te.lights,Te.fog,{color:{value:new Ne(0)},opacity:{value:1}}]),vertexShader:st.shadow_vert,fragmentShader:st.shadow_frag}};Di.physical={uniforms:Rn([Di.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new je},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new je},clearcoatNormalScale:{value:new ae(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new je},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new je},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new je},sheen:{value:0},sheenColor:{value:new Ne(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new je},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new je},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new je},transmissionSamplerSize:{value:new ae},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new je},attenuationDistance:{value:0},attenuationColor:{value:new Ne(0)},specularColor:{value:new Ne(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new je},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new je},anisotropyVector:{value:new ae},anisotropyMap:{value:null},anisotropyMapTransform:{value:new je}}]),vertexShader:st.meshphysical_vert,fragmentShader:st.meshphysical_frag};var dc={r:0,b:0,g:0},rv=new We,Up=new je;Up.set(-1,0,0,0,1,0,0,0,1);function ov(n,e,t,i,s,r){let o=new Ne(0),a=s===!0?0:1,l,c,h=null,u=0,d=null;function f(T){let x=T.isScene===!0?T.background:null;if(x&&x.isTexture){let v=T.backgroundBlurriness>0;x=e.get(x,v)}return x}function m(T){let x=!1,v=f(T);v===null?p(o,a):v&&v.isColor&&(p(v,1),x=!0);let M=n.xr.getEnvironmentBlendMode();M==="additive"?t.buffers.color.setClear(0,0,0,1,r):M==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,r),(n.autoClear||x)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function _(T,x){let v=f(x);v&&(v.isCubeTexture||v.mapping===$o)?(c===void 0&&(c=new ge(new Dt(1,1,1),new pn({name:"BackgroundCubeMaterial",uniforms:tr(Di.backgroundCube.uniforms),vertexShader:Di.backgroundCube.vertexShader,fragmentShader:Di.backgroundCube.fragmentShader,side:vn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(M,E,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(c)),c.material.uniforms.envMap.value=v,c.material.uniforms.backgroundBlurriness.value=x.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(rv.makeRotationFromEuler(x.backgroundRotation)).transpose(),v.isCubeTexture&&v.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(Up),c.material.toneMapped=rt.getTransfer(v.colorSpace)!==yt,(h!==v||u!==v.version||d!==n.toneMapping)&&(c.material.needsUpdate=!0,h=v,u=v.version,d=n.toneMapping),c.layers.enableAll(),T.unshift(c,c.geometry,c.material,0,0,null)):v&&v.isTexture&&(l===void 0&&(l=new ge(new En(2,2),new pn({name:"BackgroundMaterial",uniforms:tr(Di.background.uniforms),vertexShader:Di.background.vertexShader,fragmentShader:Di.background.fragmentShader,side:Hn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=v,l.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,l.material.toneMapped=rt.getTransfer(v.colorSpace)!==yt,v.matrixAutoUpdate===!0&&v.updateMatrix(),l.material.uniforms.uvTransform.value.copy(v.matrix),(h!==v||u!==v.version||d!==n.toneMapping)&&(l.material.needsUpdate=!0,h=v,u=v.version,d=n.toneMapping),l.layers.enableAll(),T.unshift(l,l.geometry,l.material,0,0,null))}function p(T,x){T.getRGB(dc,cu(n)),t.buffers.color.setClear(dc.r,dc.g,dc.b,x,r)}function g(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return o},setClearColor:function(T,x=1){o.set(T),a=x,p(o,a)},getClearAlpha:function(){return a},setClearAlpha:function(T){a=T,p(o,a)},render:m,addToRenderList:_,dispose:g}}function av(n,e){let t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=d(null),r=s,o=!1;function a(D,F,R,P,N){let O=!1,X=u(D,P,R,F);r!==X&&(r=X,c(r.object)),O=f(D,P,R,N),O&&m(D,P,R,N),N!==null&&e.update(N,n.ELEMENT_ARRAY_BUFFER),(O||o)&&(o=!1,v(D,F,R,P),N!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(N).buffer))}function l(){return n.createVertexArray()}function c(D){return n.bindVertexArray(D)}function h(D){return n.deleteVertexArray(D)}function u(D,F,R,P){let N=P.wireframe===!0,O=i[F.id];O===void 0&&(O={},i[F.id]=O);let X=D.isInstancedMesh===!0?D.id:0,J=O[X];J===void 0&&(J={},O[X]=J);let z=J[R.id];z===void 0&&(z={},J[R.id]=z);let B=z[N];return B===void 0&&(B=d(l()),z[N]=B),B}function d(D){let F=[],R=[],P=[];for(let N=0;N<t;N++)F[N]=0,R[N]=0,P[N]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:F,enabledAttributes:R,attributeDivisors:P,object:D,attributes:{},index:null}}function f(D,F,R,P){let N=r.attributes,O=F.attributes,X=0,J=R.getAttributes();for(let z in J)if(J[z].location>=0){let W=N[z],ne=O[z];if(ne===void 0&&(z==="instanceMatrix"&&D.instanceMatrix&&(ne=D.instanceMatrix),z==="instanceColor"&&D.instanceColor&&(ne=D.instanceColor)),W===void 0||W.attribute!==ne||ne&&W.data!==ne.data)return!0;X++}return r.attributesNum!==X||r.index!==P}function m(D,F,R,P){let N={},O=F.attributes,X=0,J=R.getAttributes();for(let z in J)if(J[z].location>=0){let W=O[z];W===void 0&&(z==="instanceMatrix"&&D.instanceMatrix&&(W=D.instanceMatrix),z==="instanceColor"&&D.instanceColor&&(W=D.instanceColor));let ne={};ne.attribute=W,W&&W.data&&(ne.data=W.data),N[z]=ne,X++}r.attributes=N,r.attributesNum=X,r.index=P}function _(){let D=r.newAttributes;for(let F=0,R=D.length;F<R;F++)D[F]=0}function p(D){g(D,0)}function g(D,F){let R=r.newAttributes,P=r.enabledAttributes,N=r.attributeDivisors;R[D]=1,P[D]===0&&(n.enableVertexAttribArray(D),P[D]=1),N[D]!==F&&(n.vertexAttribDivisor(D,F),N[D]=F)}function T(){let D=r.newAttributes,F=r.enabledAttributes;for(let R=0,P=F.length;R<P;R++)F[R]!==D[R]&&(n.disableVertexAttribArray(R),F[R]=0)}function x(D,F,R,P,N,O,X){X===!0?n.vertexAttribIPointer(D,F,R,N,O):n.vertexAttribPointer(D,F,R,P,N,O)}function v(D,F,R,P){_();let N=P.attributes,O=R.getAttributes(),X=F.defaultAttributeValues;for(let J in O){let z=O[J];if(z.location>=0){let B=N[J];if(B===void 0&&(J==="instanceMatrix"&&D.instanceMatrix&&(B=D.instanceMatrix),J==="instanceColor"&&D.instanceColor&&(B=D.instanceColor)),B!==void 0){let W=B.normalized,ne=B.itemSize,oe=e.get(B);if(oe===void 0)continue;let Ue=oe.buffer,$e=oe.type,Xe=oe.bytesPerElement,Z=$e===n.INT||$e===n.UNSIGNED_INT||B.gpuType===El;if(B.isInterleavedBufferAttribute){let Q=B.data,de=Q.stride,De=B.offset;if(Q.isInstancedInterleavedBuffer){for(let pe=0;pe<z.locationSize;pe++)g(z.location+pe,Q.meshPerAttribute);D.isInstancedMesh!==!0&&P._maxInstanceCount===void 0&&(P._maxInstanceCount=Q.meshPerAttribute*Q.count)}else for(let pe=0;pe<z.locationSize;pe++)p(z.location+pe);n.bindBuffer(n.ARRAY_BUFFER,Ue);for(let pe=0;pe<z.locationSize;pe++)x(z.location+pe,ne/z.locationSize,$e,W,de*Xe,(De+ne/z.locationSize*pe)*Xe,Z)}else{if(B.isInstancedBufferAttribute){for(let Q=0;Q<z.locationSize;Q++)g(z.location+Q,B.meshPerAttribute);D.isInstancedMesh!==!0&&P._maxInstanceCount===void 0&&(P._maxInstanceCount=B.meshPerAttribute*B.count)}else for(let Q=0;Q<z.locationSize;Q++)p(z.location+Q);n.bindBuffer(n.ARRAY_BUFFER,Ue);for(let Q=0;Q<z.locationSize;Q++)x(z.location+Q,ne/z.locationSize,$e,W,ne*Xe,ne/z.locationSize*Q*Xe,Z)}}else if(X!==void 0){let W=X[J];if(W!==void 0)switch(W.length){case 2:n.vertexAttrib2fv(z.location,W);break;case 3:n.vertexAttrib3fv(z.location,W);break;case 4:n.vertexAttrib4fv(z.location,W);break;default:n.vertexAttrib1fv(z.location,W)}}}}T()}function M(){S();for(let D in i){let F=i[D];for(let R in F){let P=F[R];for(let N in P){let O=P[N];for(let X in O)h(O[X].object),delete O[X];delete P[N]}}delete i[D]}}function E(D){if(i[D.id]===void 0)return;let F=i[D.id];for(let R in F){let P=F[R];for(let N in P){let O=P[N];for(let X in O)h(O[X].object),delete O[X];delete P[N]}}delete i[D.id]}function A(D){for(let F in i){let R=i[F];for(let P in R){let N=R[P];if(N[D.id]===void 0)continue;let O=N[D.id];for(let X in O)h(O[X].object),delete O[X];delete N[D.id]}}}function y(D){for(let F in i){let R=i[F],P=D.isInstancedMesh===!0?D.id:0,N=R[P];if(N!==void 0){for(let O in N){let X=N[O];for(let J in X)h(X[J].object),delete X[J];delete N[O]}delete R[P],Object.keys(R).length===0&&delete i[F]}}}function S(){I(),o=!0,r!==s&&(r=s,c(r.object))}function I(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:S,resetDefaultState:I,dispose:M,releaseStatesOfGeometry:E,releaseStatesOfObject:y,releaseStatesOfProgram:A,initAttributes:_,enableAttribute:p,disableUnusedAttributes:T}}function lv(n,e,t){let i;function s(l){i=l}function r(l,c){n.drawArrays(i,l,c),t.update(c,i,1)}function o(l,c,h){h!==0&&(n.drawArraysInstanced(i,l,c,h),t.update(c,i,h))}function a(l,c,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,c,0,h);let d=0;for(let f=0;f<h;f++)d+=c[f];t.update(d,i,1)}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a}function cv(n,e,t,i){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){let A=e.get("EXT_texture_filter_anisotropic");s=n.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(A){return!(A!==Kn&&i.convert(A)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(A){let y=A===Fn&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(A!==Wn&&A!==An&&!y&&i.convert(A)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE))}function l(A){if(A==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp",h=l(c);h!==c&&(ke("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);let u=t.logarithmicDepthBuffer===!0,d=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&d===!1&&ke("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");let f=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),m=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=n.getParameter(n.MAX_TEXTURE_SIZE),p=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),g=n.getParameter(n.MAX_VERTEX_ATTRIBS),T=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),x=n.getParameter(n.MAX_VARYING_VECTORS),v=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),M=n.getParameter(n.MAX_SAMPLES),E=n.getParameter(n.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:u,reversedDepthBuffer:d,maxTextures:f,maxVertexTextures:m,maxTextureSize:_,maxCubemapSize:p,maxAttributes:g,maxVertexUniforms:T,maxVaryings:x,maxFragmentUniforms:v,maxSamples:M,samples:E}}function hv(n){let e=this,t=null,i=0,s=!1,r=!1,o=new Un,a=new je,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){let f=u.length!==0||d||i!==0||s;return s=d,i=u.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){t=h(u,d,0)},this.setState=function(u,d,f){let m=u.clippingPlanes,_=u.clipIntersection,p=u.clipShadows,g=n.get(u);if(!s||m===null||m.length===0||r&&!p)r?h(null):c();else{let T=r?0:i,x=T*4,v=g.clippingState||null;l.value=v,v=h(m,d,x,f);for(let M=0;M!==x;++M)v[M]=t[M];g.clippingState=v,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=T}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function h(u,d,f,m){let _=u!==null?u.length:0,p=null;if(_!==0){if(p=l.value,m!==!0||p===null){let g=f+_*4,T=d.matrixWorldInverse;a.getNormalMatrix(T),(p===null||p.length<g)&&(p=new Float32Array(g));for(let x=0,v=f;x!==_;++x,v+=4)o.copy(u[x]).applyMatrix4(T,a),o.normal.toArray(p,v),p[v+3]=o.constant}l.value=p,l.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,p}}var Zr=4,uv=6,dv=20,fv=256,na=new Ss,fp=new Ne,fu=null,pu=0,mu=0,gu=!1,pv=new C,nr=new C,Ps=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,i=.1,s=100,r={}){let{size:o=256,position:a=pv}=r;fu=this._renderer.getRenderTarget(),pu=this._renderer.getActiveCubeFace(),mu=this._renderer.getActiveMipmapLevel(),gu=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,i,s,l,a),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=gp(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=mp(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(fu,pu,mu),this._renderer.xr.enabled=gu,e.scissorTest=!1,$r(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Es||e.mapping===Qs?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),fu=this._renderer.getRenderTarget(),pu=this._renderer.getActiveCubeFace(),mu=this._renderer.getActiveMipmapLevel(),gu=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:Rt,minFilter:Rt,generateMipmaps:!1,type:Fn,format:Kn,colorSpace:_n,depthBuffer:!1},s=pp(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=pp(e,t,i);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=mv(r)),this._blurMaterial=_v(r,e,t),this._ggxMaterial=gv(r,e,t)}return s}_compileMaterial(e){let t=new ge(new pt,e);this._renderer.compile(t,na)}_sceneToCubeUV(e,t,i,s,r){let l=new tn(90,1,t,i),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,d=u.autoClear,f=u.toneMapping;u.getClearColor(fp),u.toneMapping=pi,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(s),u.clearDepth(),u.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new ge(new Dt,new wn({name:"PMREM.Background",side:vn,depthWrite:!1,depthTest:!1})));let _=this._backgroundBox,p=_.material,g=!1,T=e.background;T?T.isColor&&(p.color.copy(T),e.background=null,g=!0):(p.color.copy(fp),g=!0);for(let x=0;x<6;x++){let v=x%3;v===0?(l.up.set(0,c[x],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[x],r.y,r.z)):v===1?(l.up.set(0,0,c[x]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[x],r.z)):(l.up.set(0,c[x],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[x]));let M=this._cubeSize;$r(s,v*M,x>2?M:0,M,M),u.setRenderTarget(s),g&&u.render(_,l),u.render(e,l)}u.toneMapping=f,u.autoClear=d,e.background=T}_textureToCubeUV(e,t){let i=this._renderer,s=e.mapping===Es||e.mapping===Qs;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=gp()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=mp());let r=s?this._cubemapMaterial:this._equirectMaterial,o=this._lodMeshes[0];o.material=r;let a=r.uniforms;a.envMap.value=e;let l=this._cubeSize;$r(t,0,0,3*l,2*l),i.setRenderTarget(t),i.render(o,na)}_applyPMREM(e){let t=this._renderer,i=t.autoClear;t.autoClear=!1;let s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(e,r-1,r);t.autoClear=i}_applyGGXFilter(e,t,i){let s=this._renderer,r=this._pingPongRenderTarget,o=this._ggxMaterial,a=this._lodMeshes[i];a.material=o;let l=o.uniforms,c=i/(this._lodMeshes.length-1),h=t/(this._lodMeshes.length-1),u=Math.sqrt(c*c-h*h),d=c*1.25,f=u*d,{_lodMax:m}=this,_=this._sizeLods[i],p=3*_*(i>m-Zr?i-m+Zr:0),g=4*(this._cubeSize-_);l.envMap.value=e.texture,l.roughness.value=f,l.mipInt.value=m-t,$r(r,p,g,3*_,2*_),s.setRenderTarget(r),s.render(a,na),l.envMap.value=r.texture,l.roughness.value=0,l.mipInt.value=m-i,$r(e,p,g,3*_,2*_),s.setRenderTarget(e),s.render(a,na)}_blur(e,t,i,s){let r=this._pingPongRenderTarget,o=Math.min(s,Math.PI)/Math.SQRT2;this._blurPass(e,r,t,i,o),this._blurPass(r,e,i,i,o)}_blurPass(e,t,i,s,r){let o=this._renderer,a=this._blurMaterial,l=this._lodMeshes[s];l.material=a;let c=a.uniforms;c.envMap.value=e.texture,c.sigma.value=r,c.mipInt.value=this._lodMax-i;let h=this._sizeLods[s],u=3*h*(s>this._lodMax-Zr?s-this._lodMax+Zr:0),d=4*(this._cubeSize-h);$r(t,u,d,3*h,2*h),o.setRenderTarget(t),o.render(l,na)}};function mv(n){let e=[],t=[],i=n,s=n-Zr+1+uv;for(let r=0;r<s;r++){let o=Math.pow(2,i);e.push(o);let a=1/(o-2),l=-a,c=1+a,h=[l,l,c,l,c,c,l,l,c,c,l,c],u=6,d=6,f=3,m=new Float32Array(f*d*u),_=new Float32Array(f*d*u);for(let g=0;g<u;g++){let T=g%3*2/3-1,x=g>2?0:-1,v=[T,x,0,T+2/3,x,0,T+2/3,x+1,0,T,x,0,T+2/3,x+1,0,T,x+1,0];m.set(v,f*d*g);for(let M=0;M<d;M++){let E=h[M*2]*2-1,A=h[M*2+1]*2-1;g===0?nr.set(1,A,E):g===1?nr.set(-E,1,-A):g===2?nr.set(-E,A,1):g===3?nr.set(-1,A,-E):g===4?nr.set(-E,-1,A):nr.set(E,A,-1),nr.toArray(_,(g*d+M)*f)}}let p=new pt;p.setAttribute("position",new wt(m,f)),p.setAttribute("outputDirection",new wt(_,f)),t.push(new ge(p,null)),i>Zr&&i--}return{lodMeshes:t,sizeLods:e}}function pp(n,e,t){let i=new Bn(n,e,t);return i.texture.mapping=$o,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function $r(n,e,t,i,s){n.viewport.set(e,t,i,s),n.scissor.set(e,t,i,s)}function gv(n,e,t){return new pn({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:fv,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:gc(),fragmentShader:`

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
		`,blending:Ii,depthTest:!1,depthWrite:!1})}function _v(n,e,t){return new pn({name:"SphericalGaussianBlur",defines:{SAMPLES:dv,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:gc(),fragmentShader:`

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
		`,blending:Ii,depthTest:!1,depthWrite:!1})}function mp(){return new pn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:gc(),fragmentShader:`

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
		`,blending:Ii,depthTest:!1,depthWrite:!1})}function gp(){return new pn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:gc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Ii,depthTest:!1,depthWrite:!1})}function gc(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}var pc=class extends Bn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let i={width:e,height:e,depth:1},s=[i,i,i,i,i,i];this.texture=new Co(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Dt(5,5,5),r=new pn({name:"CubemapFromEquirect",uniforms:tr(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:vn,blending:Ii});r.uniforms.tEquirect.value=t;let o=new ge(s,r),a=t.minFilter;return t.minFilter===mn&&(t.minFilter=Rt),new xl(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t=!0,i=!0,s=!0){let r=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,i,s);e.setRenderTarget(r)}};function yv(n){let e=new WeakMap,t=new WeakMap,i=null;function s(d,f=!1){return d==null?null:f?o(d):r(d)}function r(d){if(d&&d.isTexture){let f=d.mapping;if(f===As||f===Tl)if(e.has(d)){let m=e.get(d).texture;return a(m,d.mapping)}else{let m=d.image;if(m&&m.height>0){let _=new pc(m.height);return _.fromEquirectangularTexture(n,d),e.set(d,_),d.addEventListener("dispose",c),a(_.texture,d.mapping)}else return null}}return d}function o(d){if(d&&d.isTexture){let f=d.mapping,m=f===As||f===Tl,_=f===Es||f===Qs;if(m||_){let p=t.get(d),g=p!==void 0?p.texture.pmremVersion:0;if(d.isRenderTargetTexture&&d.pmremVersion!==g)return i===null&&(i=new Ps(n)),p=m?i.fromEquirectangular(d,p):i.fromCubemap(d,p),p.texture.pmremVersion=d.pmremVersion,t.set(d,p),p.texture;if(p!==void 0)return p.texture;{let T=d.image;return m&&T&&T.height>0||_&&T&&l(T)?(i===null&&(i=new Ps(n)),p=m?i.fromEquirectangular(d):i.fromCubemap(d),p.texture.pmremVersion=d.pmremVersion,t.set(d,p),d.addEventListener("dispose",h),p.texture):null}}}return d}function a(d,f){return f===As?d.mapping=Es:f===Tl&&(d.mapping=Qs),d}function l(d){let f=0,m=6;for(let _=0;_<m;_++)d[_]!==void 0&&f++;return f===m}function c(d){let f=d.target;f.removeEventListener("dispose",c);let m=e.get(f);m!==void 0&&(e.delete(f),m.dispose())}function h(d){let f=d.target;f.removeEventListener("dispose",h);let m=t.get(f);m!==void 0&&(t.delete(f),m.dispose())}function u(){e=new WeakMap,t=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:s,dispose:u}}function vv(n){let e={};function t(i){if(e[i]!==void 0)return e[i];let s=n.getExtension(i);return e[i]=s,s}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){let s=t(i);return s===null&&zs("WebGLRenderer: "+i+" extension not supported."),s}}}function bv(n,e,t,i){let s={},r=new WeakMap;function o(u){let d=u.target;d.index!==null&&e.remove(d.index);for(let m in d.attributes)e.remove(d.attributes[m]);d.removeEventListener("dispose",o),delete s[d.id];let f=r.get(d);f&&(e.remove(f),r.delete(d)),i.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function a(u,d){return s[d.id]===!0||(d.addEventListener("dispose",o),s[d.id]=!0,t.memory.geometries++),d}function l(u){let d=u.attributes;for(let f in d)e.update(d[f],n.ARRAY_BUFFER)}function c(u){let d=[],f=u.index,m=u.attributes.position,_=0;if(m===void 0)return;if(f!==null){let T=f.array;_=f.version;for(let x=0,v=T.length;x<v;x+=3){let M=T[x+0],E=T[x+1],A=T[x+2];d.push(M,E,E,A,A,M)}}else{let T=m.array;_=m.version;for(let x=0,v=T.length/3-1;x<v;x+=3){let M=x+0,E=x+1,A=x+2;d.push(M,E,E,A,A,M)}}let p=new(m.count>=65535?To:So)(d,1);p.version=_;let g=r.get(u);g&&e.remove(g),r.set(u,p)}function h(u){let d=r.get(u);if(d){let f=u.index;f!==null&&d.version<f.version&&c(u)}else c(u);return r.get(u)}return{get:a,update:l,getWireframeAttribute:h}}function Mv(n,e,t){let i;function s(u){i=u}let r,o;function a(u){r=u.type,o=u.bytesPerElement}function l(u,d){n.drawElements(i,d,r,u*o),t.update(d,i,1)}function c(u,d,f){f!==0&&(n.drawElementsInstanced(i,d,r,u*o,f),t.update(d,i,f))}function h(u,d,f){if(f===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,d,0,r,u,0,f);let _=0;for(let p=0;p<f;p++)_+=d[p];t.update(_,i,1)}this.setMode=s,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=h}function xv(n){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,o,a){switch(t.calls++,o){case n.TRIANGLES:t.triangles+=a*(r/3);break;case n.LINES:t.lines+=a*(r/2);break;case n.LINE_STRIP:t.lines+=a*(r-1);break;case n.LINE_LOOP:t.lines+=a*r;break;case n.POINTS:t.points+=a*r;break;default:Ye("WebGLInfo: Unknown draw mode:",o);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:i}}function Sv(n,e,t){let i=new WeakMap,s=new Mt;function r(o,a,l){let c=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,u=h!==void 0?h.length:0,d=i.get(a);if(d===void 0||d.count!==u){let S=function(){A.dispose(),i.delete(a),a.removeEventListener("dispose",S)};d!==void 0&&d.texture.dispose();let f=a.morphAttributes.position!==void 0,m=a.morphAttributes.normal!==void 0,_=a.morphAttributes.color!==void 0,p=a.morphAttributes.position||[],g=a.morphAttributes.normal||[],T=a.morphAttributes.color||[],x=0;f===!0&&(x=1),m===!0&&(x=2),_===!0&&(x=3);let v=a.attributes.position.count*x,M=1;v>e.maxTextureSize&&(M=Math.ceil(v/e.maxTextureSize),v=e.maxTextureSize);let E=new Float32Array(v*M*4*u),A=new Mo(E,v,M,u);A.type=An,A.needsUpdate=!0;let y=x*4;for(let I=0;I<u;I++){let D=p[I],F=g[I],R=T[I],P=v*M*4*I;for(let N=0;N<D.count;N++){let O=N*y;f===!0&&(s.fromBufferAttribute(D,N),E[P+O+0]=s.x,E[P+O+1]=s.y,E[P+O+2]=s.z,E[P+O+3]=0),m===!0&&(s.fromBufferAttribute(F,N),E[P+O+4]=s.x,E[P+O+5]=s.y,E[P+O+6]=s.z,E[P+O+7]=0),_===!0&&(s.fromBufferAttribute(R,N),E[P+O+8]=s.x,E[P+O+9]=s.y,E[P+O+10]=s.z,E[P+O+11]=R.itemSize===4?s.w:1)}}d={count:u,texture:A,size:new ae(v,M)},i.set(a,d),a.addEventListener("dispose",S)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",o.morphTexture,t);else{let f=0;for(let _=0;_<c.length;_++)f+=c[_];let m=a.morphTargetsRelative?1:1-f;l.getUniforms().setValue(n,"morphTargetBaseInfluence",m),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",d.texture,t),l.getUniforms().setValue(n,"morphTargetsTextureSize",d.size)}return{update:r}}function Tv(n,e,t,i,s){let r=new WeakMap;function o(c){let h=s.render.frame,u=c.geometry,d=e.get(c,u);if(r.get(d)!==h&&(e.update(d),r.set(d,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==h&&(t.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,n.ARRAY_BUFFER),r.set(c,h))),c.isSkinnedMesh){let f=c.skeleton;r.get(f)!==h&&(f.update(),r.set(f,h))}return d}function a(){r=new WeakMap}function l(c){let h=c.target;h.removeEventListener("dispose",l),i.releaseStatesOfObject(h),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:o,dispose:a}}var wv={[Xh]:"LINEAR_TONE_MAPPING",[qh]:"REINHARD_TONE_MAPPING",[Yh]:"CINEON_TONE_MAPPING",[Yo]:"ACES_FILMIC_TONE_MAPPING",[Zh]:"AGX_TONE_MAPPING",[Kh]:"NEUTRAL_TONE_MAPPING",[$h]:"CUSTOM_TONE_MAPPING"};function Ev(n,e,t,i,s,r){let o=new Bn(e,t,{type:n,depthBuffer:s,stencilBuffer:r,samples:i?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),a=null,l=null,c=new pt;c.setAttribute("position",new ot([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute("uv",new ot([0,2,0,0,2,0],2));let h=new dl({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),u=new ge(c,h),d=new Ss(-1,1,1,-1,0,1),f=null,m=null,_=!1,p,g=null,T=[],x=!1;this.setSize=function(v,M){o.setSize(v,M),a!==null&&a.setSize(v,M),l!==null&&l.setSize(v,M);for(let E=0;E<T.length;E++){let A=T[E];A.setSize&&A.setSize(v,M)}},this.setEffects=function(v){T=v,x=T.length>0&&T[0].isRenderPass===!0;let M=o.width,E=o.height;T.length>0&&a===null&&(a=new Bn(M,E,{type:Fn,depthBuffer:!1,stencilBuffer:!1}),l=new Bn(M,E,{type:Fn,depthBuffer:!1,stencilBuffer:!1}));for(let A=0;A<T.length;A++){let y=T[A];y.setSize&&y.setSize(M,E)}},this.begin=function(v,M){if(_||v.toneMapping===pi&&T.length===0)return!1;if(g=M,M!==null){let E=M.width,A=M.height;(o.width!==E||o.height!==A)&&this.setSize(E,A)}return x===!1&&v.setRenderTarget(o),p=v.toneMapping,v.toneMapping=pi,!0},this.hasRenderPass=function(){return x},this.end=function(v,M){v.toneMapping=p,_=!0;let E=o,A=a;for(let y=0;y<T.length;y++){let S=T[y];S.enabled!==!1&&(S.render(v,A,E,M),S.needsSwap!==!1&&(E=A,A=A===a?l:a))}if(f!==v.outputColorSpace||m!==v.toneMapping){f=v.outputColorSpace,m=v.toneMapping,h.defines={},rt.getTransfer(f)===yt&&(h.defines.SRGB_TRANSFER="");let y=wv[m];y&&(h.defines[y]=""),h.needsUpdate=!0}h.uniforms.tDiffuse.value=E.texture,v.setRenderTarget(g),v.render(u,d),g=null,_=!1},this.isCompositing=function(){return _},this.dispose=function(){o.dispose(),a!==null&&a.dispose(),l!==null&&l.dispose(),c.dispose(),h.dispose()}}var Fp=new on,vu=new vs(1,1),Op=new Mo,Bp=new il,kp=new Co,_p=[],yp=[],vp=new Float32Array(16),bp=new Float32Array(9),Mp=new Float32Array(4);function Jr(n,e,t){let i=n[0];if(i<=0||i>0)return n;let s=e*t,r=_p[s];if(r===void 0&&(r=new Float32Array(s),_p[s]=r),e!==0){i.toArray(r,0);for(let o=1,a=0;o!==e;++o)a+=t,n[o].toArray(r,a)}return r}function ln(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function cn(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function _c(n,e){let t=yp[e];t===void 0&&(t=new Int32Array(e),yp[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function Av(n,e){let t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function Rv(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(ln(t,e))return;n.uniform2fv(this.addr,e),cn(t,e)}}function Cv(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(ln(t,e))return;n.uniform3fv(this.addr,e),cn(t,e)}}function Pv(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(ln(t,e))return;n.uniform4fv(this.addr,e),cn(t,e)}}function Iv(n,e){let t=this.cache,i=e.elements;if(i===void 0){if(ln(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),cn(t,e)}else{if(ln(t,i))return;Mp.set(i),n.uniformMatrix2fv(this.addr,!1,Mp),cn(t,i)}}function Lv(n,e){let t=this.cache,i=e.elements;if(i===void 0){if(ln(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),cn(t,e)}else{if(ln(t,i))return;bp.set(i),n.uniformMatrix3fv(this.addr,!1,bp),cn(t,i)}}function Dv(n,e){let t=this.cache,i=e.elements;if(i===void 0){if(ln(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),cn(t,e)}else{if(ln(t,i))return;vp.set(i),n.uniformMatrix4fv(this.addr,!1,vp),cn(t,i)}}function Nv(n,e){let t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function Uv(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(ln(t,e))return;n.uniform2iv(this.addr,e),cn(t,e)}}function Fv(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(ln(t,e))return;n.uniform3iv(this.addr,e),cn(t,e)}}function Ov(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(ln(t,e))return;n.uniform4iv(this.addr,e),cn(t,e)}}function Bv(n,e){let t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function kv(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(ln(t,e))return;n.uniform2uiv(this.addr,e),cn(t,e)}}function zv(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(ln(t,e))return;n.uniform3uiv(this.addr,e),cn(t,e)}}function Vv(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(ln(t,e))return;n.uniform4uiv(this.addr,e),cn(t,e)}}function Gv(n,e,t){let i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let r;this.type===n.SAMPLER_2D_SHADOW?(vu.compareFunction=t.isReversedDepthBuffer()?uc:hc,r=vu):r=Fp,t.setTexture2D(e||r,s)}function Hv(n,e,t){let i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture3D(e||Bp,s)}function Wv(n,e,t){let i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTextureCube(e||kp,s)}function Xv(n,e,t){let i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture2DArray(e||Op,s)}function qv(n){switch(n){case 5126:return Av;case 35664:return Rv;case 35665:return Cv;case 35666:return Pv;case 35674:return Iv;case 35675:return Lv;case 35676:return Dv;case 5124:case 35670:return Nv;case 35667:case 35671:return Uv;case 35668:case 35672:return Fv;case 35669:case 35673:return Ov;case 5125:return Bv;case 36294:return kv;case 36295:return zv;case 36296:return Vv;case 35678:case 36198:case 36298:case 36306:case 35682:return Gv;case 35679:case 36299:case 36307:return Hv;case 35680:case 36300:case 36308:case 36293:return Wv;case 36289:case 36303:case 36311:case 36292:return Xv}}function Yv(n,e){n.uniform1fv(this.addr,e)}function $v(n,e){let t=Jr(e,this.size,2);n.uniform2fv(this.addr,t)}function Zv(n,e){let t=Jr(e,this.size,3);n.uniform3fv(this.addr,t)}function Kv(n,e){let t=Jr(e,this.size,4);n.uniform4fv(this.addr,t)}function Jv(n,e){let t=Jr(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function jv(n,e){let t=Jr(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function Qv(n,e){let t=Jr(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function eb(n,e){n.uniform1iv(this.addr,e)}function tb(n,e){n.uniform2iv(this.addr,e)}function nb(n,e){n.uniform3iv(this.addr,e)}function ib(n,e){n.uniform4iv(this.addr,e)}function sb(n,e){n.uniform1uiv(this.addr,e)}function rb(n,e){n.uniform2uiv(this.addr,e)}function ob(n,e){n.uniform3uiv(this.addr,e)}function ab(n,e){n.uniform4uiv(this.addr,e)}function lb(n,e,t){let i=this.cache,s=e.length,r=_c(t,s);ln(i,r)||(n.uniform1iv(this.addr,r),cn(i,r));let o;this.type===n.SAMPLER_2D_SHADOW?o=vu:o=Fp;for(let a=0;a!==s;++a)t.setTexture2D(e[a]||o,r[a])}function cb(n,e,t){let i=this.cache,s=e.length,r=_c(t,s);ln(i,r)||(n.uniform1iv(this.addr,r),cn(i,r));for(let o=0;o!==s;++o)t.setTexture3D(e[o]||Bp,r[o])}function hb(n,e,t){let i=this.cache,s=e.length,r=_c(t,s);ln(i,r)||(n.uniform1iv(this.addr,r),cn(i,r));for(let o=0;o!==s;++o)t.setTextureCube(e[o]||kp,r[o])}function ub(n,e,t){let i=this.cache,s=e.length,r=_c(t,s);ln(i,r)||(n.uniform1iv(this.addr,r),cn(i,r));for(let o=0;o!==s;++o)t.setTexture2DArray(e[o]||Op,r[o])}function db(n){switch(n){case 5126:return Yv;case 35664:return $v;case 35665:return Zv;case 35666:return Kv;case 35674:return Jv;case 35675:return jv;case 35676:return Qv;case 5124:case 35670:return eb;case 35667:case 35671:return tb;case 35668:case 35672:return nb;case 35669:case 35673:return ib;case 5125:return sb;case 36294:return rb;case 36295:return ob;case 36296:return ab;case 35678:case 36198:case 36298:case 36306:case 35682:return lb;case 35679:case 36299:case 36307:return cb;case 35680:case 36300:case 36308:case 36293:return hb;case 36289:case 36303:case 36311:case 36292:return ub}}var bu=class{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=qv(t.type)}},Mu=class{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=db(t.type)}},xu=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){let s=this.seq;for(let r=0,o=s.length;r!==o;++r){let a=s[r];a.setValue(e,t[a.id],i)}}},_u=/(\w+)(\])?(\[|\.)?/g;function xp(n,e){n.seq.push(e),n.map[e.id]=e}function fb(n,e,t){let i=n.name,s=i.length;for(_u.lastIndex=0;;){let r=_u.exec(i),o=_u.lastIndex,a=r[1],l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===s){xp(t,c===void 0?new bu(a,n,e):new Mu(a,n,e));break}else{let u=t.map[a];u===void 0&&(u=new xu(a),xp(t,u)),t=u}}}var Kr=class{constructor(e,t){this.seq=[],this.map={};let i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let o=0;o<i;++o){let a=e.getActiveUniform(t,o),l=e.getUniformLocation(t,a.name);fb(a,l,this)}let s=[],r=[];for(let o of this.seq)o.type===e.SAMPLER_2D_SHADOW||o.type===e.SAMPLER_CUBE_SHADOW||o.type===e.SAMPLER_2D_ARRAY_SHADOW?s.push(o):r.push(o);s.length>0&&(this.seq=s.concat(r))}setValue(e,t,i,s){let r=this.map[t];r!==void 0&&r.setValue(e,i,s)}setOptional(e,t,i){let s=t[i];s!==void 0&&this.setValue(e,i,s)}static upload(e,t,i,s){for(let r=0,o=t.length;r!==o;++r){let a=t[r],l=i[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,s)}}static seqWithValue(e,t){let i=[];for(let s=0,r=e.length;s!==r;++s){let o=e[s];o.id in t&&i.push(o)}return i}};function Sp(n,e,t){let i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}var pb=37297,mb=0;function gb(n,e){let t=n.split(`
`),i=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let o=s;o<r;o++){let a=o+1;i.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return i.join(`
`)}var Tp=new je;function _b(n){rt._getMatrix(Tp,rt.workingColorSpace,n);let e=`mat3( ${Tp.elements.map(t=>t.toFixed(4))} )`;switch(rt.getTransfer(n)){case vo:return[e,"LinearTransferOETF"];case yt:return[e,"sRGBTransferOETF"];default:return ke("WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function wp(n,e,t){let i=n.getShaderParameter(e,n.COMPILE_STATUS),r=(n.getShaderInfoLog(e)||"").trim();if(i&&r==="")return"";let o=/ERROR: 0:(\d+)/.exec(r);if(o){let a=parseInt(o[1]);return t.toUpperCase()+`

`+r+`

`+gb(n.getShaderSource(e),a)}else return r}function yb(n,e){let t=_b(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}var vb={[Xh]:"Linear",[qh]:"Reinhard",[Yh]:"Cineon",[Yo]:"ACESFilmic",[Zh]:"AgX",[Kh]:"Neutral",[$h]:"Custom"};function bb(n,e){let t=vb[e];return t===void 0?(ke("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+n+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var fc=new C;function Mb(){rt.getLuminanceCoefficients(fc);let n=fc.x.toFixed(4),e=fc.y.toFixed(4),t=fc.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function xb(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(sa).join(`
`)}function Sb(n){let e=[];for(let t in n){let i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function Tb(n,e){let t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){let r=n.getActiveAttrib(e,s),o=r.name,a=1;r.type===n.FLOAT_MAT2&&(a=2),r.type===n.FLOAT_MAT3&&(a=3),r.type===n.FLOAT_MAT4&&(a=4),t[o]={type:r.type,location:n.getAttribLocation(e,o),locationSize:a}}return t}function sa(n){return n!==""}function Ep(n,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_SUN_LIGHTS/g,e.numSunLights).replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,e.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Ap(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var wb=/^[ \t]*#include +<([\w\d./]+)>/gm;function Su(n){return n.replace(wb,Ab)}var Eb=new Map;function Ab(n,e){let t=st[e];if(t===void 0){let i=Eb.get(e);if(i!==void 0)t=st[i],ke('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return Su(t)}var Rb=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Rp(n){return n.replace(Rb,Cb)}function Cb(n,e,t,i){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Cp(n){let e=`precision ${n.precision} float;
	precision ${n.precision} int;
	precision ${n.precision} sampler2D;
	precision ${n.precision} samplerCube;
	precision ${n.precision} sampler3D;
	precision ${n.precision} sampler2DArray;
	precision ${n.precision} sampler2DShadow;
	precision ${n.precision} samplerCubeShadow;
	precision ${n.precision} sampler2DArrayShadow;
	precision ${n.precision} isampler2D;
	precision ${n.precision} isampler3D;
	precision ${n.precision} isamplerCube;
	precision ${n.precision} isampler2DArray;
	precision ${n.precision} usampler2D;
	precision ${n.precision} usampler3D;
	precision ${n.precision} usamplerCube;
	precision ${n.precision} usampler2DArray;
	`;return n.precision==="highp"?e+=`
#define HIGH_PRECISION`:n.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}var Pb={[Ks]:"SHADOWMAP_TYPE_PCF",[Gr]:"SHADOWMAP_TYPE_VSM"};function Ib(n){return Pb[n.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var Lb={[Es]:"ENVMAP_TYPE_CUBE",[Qs]:"ENVMAP_TYPE_CUBE",[$o]:"ENVMAP_TYPE_CUBE_UV"};function Db(n){return n.envMap===!1?"ENVMAP_TYPE_CUBE":Lb[n.envMapMode]||"ENVMAP_TYPE_CUBE"}var Nb={[Qs]:"ENVMAP_MODE_REFRACTION"};function Ub(n){return n.envMap===!1?"ENVMAP_MODE_REFLECTION":Nb[n.envMapMode]||"ENVMAP_MODE_REFLECTION"}var Fb={[Wh]:"ENVMAP_BLENDING_MULTIPLY",[Gf]:"ENVMAP_BLENDING_MIX",[Hf]:"ENVMAP_BLENDING_ADD"};function Ob(n){return n.envMap===!1?"ENVMAP_BLENDING_NONE":Fb[n.combine]||"ENVMAP_BLENDING_NONE"}function Bb(n){let e=n.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:i,maxMip:t}}function kb(n,e,t,i){let s=n.getContext(),r=t.defines,o=t.vertexShader,a=t.fragmentShader,l=Ib(t),c=Db(t),h=Ub(t),u=Ob(t),d=Bb(t),f=xb(t),m=Sb(r),_=s.createProgram(),p,g,T=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m].filter(sa).join(`
`),p.length>0&&(p+=`
`),g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m].filter(sa).join(`
`),g.length>0&&(g+=`
`)):(p=[Cp(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(sa).join(`
`),g=[Cp(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.retroreflection?"#define USE_RETROREFLECTION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==pi?"#define TONE_MAPPING":"",t.toneMapping!==pi?st.tonemapping_pars_fragment:"",t.toneMapping!==pi?bb("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",st.colorspace_pars_fragment,yb("linearToOutputTexel",t.outputColorSpace),Mb(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(sa).join(`
`)),o=Su(o),o=Ep(o,t),o=Ap(o,t),a=Su(a),a=Ep(a,t),a=Ap(a,t),o=Rp(o),a=Rp(a),t.isRawShaderMaterial!==!0&&(T=`#version 300 es
`,p=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,g=["#define varying in",t.glslVersion===ou?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===ou?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+g);let x=T+p+o,v=T+g+a,M=Sp(s,s.VERTEX_SHADER,x),E=Sp(s,s.FRAGMENT_SHADER,v);s.attachShader(_,M),s.attachShader(_,E),t.index0AttributeName!==void 0?s.bindAttribLocation(_,0,t.index0AttributeName):t.hasPositionAttribute===!0&&s.bindAttribLocation(_,0,"position"),s.linkProgram(_);function A(D){if(n.debug.checkShaderErrors){let F=s.getProgramInfoLog(_)||"",R=s.getShaderInfoLog(M)||"",P=s.getShaderInfoLog(E)||"",N=F.trim(),O=R.trim(),X=P.trim(),J=!0,z=!0;if(s.getProgramParameter(_,s.LINK_STATUS)===!1)if(J=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,_,M,E);else{let B=wp(s,M,"vertex"),W=wp(s,E,"fragment");Ye("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(_,s.VALIDATE_STATUS)+`

Material Name: `+D.name+`
Material Type: `+D.type+`

Program Info Log: `+N+`
`+B+`
`+W)}else N!==""?ke("WebGLProgram: Program Info Log:",N):(O===""||X==="")&&(z=!1);z&&(D.diagnostics={runnable:J,programLog:N,vertexShader:{log:O,prefix:p},fragmentShader:{log:X,prefix:g}})}s.deleteShader(M),s.deleteShader(E),y=new Kr(s,_),S=Tb(s,_)}let y;this.getUniforms=function(){return y===void 0&&A(this),y};let S;this.getAttributes=function(){return S===void 0&&A(this),S};let I=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return I===!1&&(I=s.getProgramParameter(_,pb)),I},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(_),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=mb++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=M,this.fragmentShader=E,this}var zb=0,Tu=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,i){let s=this._getShaderCacheForMaterial(e);return s.has(t)===!1&&(s.add(t),t.usedTimes++),s.has(i)===!1&&(s.add(i),i.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){let t=this.shaderCache,i=t.get(e);return i===void 0&&(i=new wu(e),t.set(e,i)),i}},wu=class{constructor(e){this.id=zb++,this.code=e,this.usedTimes=0}};function Vb(n){return n===Cs||n===Qo||n===ea}function Gb(n,e,t,i,s,r){let o=new Ir,a=new Tu,l=new Set,c=[],h=new Map,u=i.logarithmicDepthBuffer,d=i.precision,f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function m(y){return l.add(y),y===0?"uv":`uv${y}`}function _(y,S,I,D,F,R){let P=D.fog,N=F.geometry,O=y.isMeshStandardMaterial||y.isMeshLambertMaterial||y.isMeshPhongMaterial?D.environment:null,X=y.isMeshStandardMaterial||y.isMeshLambertMaterial&&!y.envMap||y.isMeshPhongMaterial&&!y.envMap,J=e.get(y.envMap||O,X),z=J&&J.mapping===$o?J.image.height:null,B=f[y.type];y.precision!==null&&(d=i.getMaxPrecision(y.precision),d!==y.precision&&ke("WebGLProgram.getParameters:",y.precision,"not supported, using",d,"instead."));let W=N.morphAttributes.position||N.morphAttributes.normal||N.morphAttributes.color,ne=W!==void 0?W.length:0,oe=0;N.morphAttributes.position!==void 0&&(oe=1),N.morphAttributes.normal!==void 0&&(oe=2),N.morphAttributes.color!==void 0&&(oe=3);let Ue,$e,Xe,Z;if(B){let Ct=Di[B];Ue=Ct.vertexShader,$e=Ct.fragmentShader}else{Ue=y.vertexShader,$e=y.fragmentShader;let Ct=a.getVertexShaderStage(y),gt=a.getFragmentShaderStage(y);a.update(y,Ct,gt),Xe=Ct.id,Z=gt.id}let Q=n.getRenderTarget(),de=n.state.buffers.depth.getReversed(),De=F.isInstancedMesh===!0,pe=F.isBatchedMesh===!0,xe=!!y.map,Ze=!!y.matcap,te=!!J,le=!!y.aoMap,ue=!!y.lightMap,ce=!!y.bumpMap&&y.wireframe===!1,fe=!!y.normalMap,Le=!!y.displacementMap,G=!!y.emissiveMap,re=!!y.metalnessMap,Re=!!y.roughnessMap,U=y.anisotropy>0,Ce=y.clearcoat>0,Ke=y.dispersion>0,L=y.retroreflectivity>0,b=y.iridescence>0,H=y.sheen>0,$=y.transmission>0,j=U&&!!y.anisotropyMap,me=Ce&&!!y.clearcoatMap,_e=Ce&&!!y.clearcoatNormalMap,ee=Ce&&!!y.clearcoatRoughnessMap,se=b&&!!y.iridescenceMap,ye=b&&!!y.iridescenceThicknessMap,Ve=H&&!!y.sheenColorMap,Se=H&&!!y.sheenRoughnessMap,ve=!!y.specularMap,Ge=!!y.specularColorMap,qe=!!y.specularIntensityMap,et=$&&!!y.transmissionMap,V=$&&!!y.thicknessMap,be=!!y.gradientMap,ie=!!y.alphaMap,Me=y.alphaTest>0,Ae=!!y.alphaHash,he=!!y.extensions,He=pi;y.toneMapped&&(Q===null||Q.isXRRenderTarget===!0)&&(He=n.toneMapping);let Be={shaderID:B,shaderType:y.type,shaderName:y.name,vertexShader:Ue,fragmentShader:$e,defines:y.defines,customVertexShaderID:Xe,customFragmentShaderID:Z,isRawShaderMaterial:y.isRawShaderMaterial===!0,glslVersion:y.glslVersion,precision:d,batching:pe,batchingColor:pe&&F._colorsTexture!==null,instancing:De,instancingColor:De&&F.instanceColor!==null,instancingMorph:De&&F.morphTexture!==null,outputColorSpace:Q===null?n.outputColorSpace:Q.isXRRenderTarget===!0?Q.texture.colorSpace:rt.workingColorSpace,alphaToCoverage:!!y.alphaToCoverage,map:xe,matcap:Ze,envMap:te,envMapMode:te&&J.mapping,envMapCubeUVHeight:z,aoMap:le,lightMap:ue,bumpMap:ce,normalMap:fe,displacementMap:Le,emissiveMap:G,normalMapObjectSpace:fe&&y.normalMapType===Yf,normalMapTangentSpace:fe&&y.normalMapType===cc,packedNormalMap:fe&&y.normalMapType===cc&&Vb(y.normalMap.format),metalnessMap:re,roughnessMap:Re,anisotropy:U,anisotropyMap:j,clearcoat:Ce,clearcoatMap:me,clearcoatNormalMap:_e,clearcoatRoughnessMap:ee,dispersion:Ke,retroreflection:L,iridescence:b,iridescenceMap:se,iridescenceThicknessMap:ye,sheen:H,sheenColorMap:Ve,sheenRoughnessMap:Se,specularMap:ve,specularColorMap:Ge,specularIntensityMap:qe,transmission:$,transmissionMap:et,thicknessMap:V,gradientMap:be,opaque:y.transparent===!1&&y.blending===Hr&&y.alphaToCoverage===!1,alphaMap:ie,alphaTest:Me,alphaHash:Ae,combine:y.combine,mapUv:xe&&m(y.map.channel),aoMapUv:le&&m(y.aoMap.channel),lightMapUv:ue&&m(y.lightMap.channel),bumpMapUv:ce&&m(y.bumpMap.channel),normalMapUv:fe&&m(y.normalMap.channel),displacementMapUv:Le&&m(y.displacementMap.channel),emissiveMapUv:G&&m(y.emissiveMap.channel),metalnessMapUv:re&&m(y.metalnessMap.channel),roughnessMapUv:Re&&m(y.roughnessMap.channel),anisotropyMapUv:j&&m(y.anisotropyMap.channel),clearcoatMapUv:me&&m(y.clearcoatMap.channel),clearcoatNormalMapUv:_e&&m(y.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ee&&m(y.clearcoatRoughnessMap.channel),iridescenceMapUv:se&&m(y.iridescenceMap.channel),iridescenceThicknessMapUv:ye&&m(y.iridescenceThicknessMap.channel),sheenColorMapUv:Ve&&m(y.sheenColorMap.channel),sheenRoughnessMapUv:Se&&m(y.sheenRoughnessMap.channel),specularMapUv:ve&&m(y.specularMap.channel),specularColorMapUv:Ge&&m(y.specularColorMap.channel),specularIntensityMapUv:qe&&m(y.specularIntensityMap.channel),transmissionMapUv:et&&m(y.transmissionMap.channel),thicknessMapUv:V&&m(y.thicknessMap.channel),alphaMapUv:ie&&m(y.alphaMap.channel),vertexTangents:!!N.attributes.tangent&&(fe||U),vertexNormals:!!N.attributes.normal,vertexColors:y.vertexColors,vertexAlphas:y.vertexColors===!0&&!!N.attributes.color&&N.attributes.color.itemSize===4,pointsUvs:F.isPoints===!0&&!!N.attributes.uv&&(xe||ie),fog:!!P,useFog:y.fog===!0,fogExp2:!!P&&P.isFogExp2,flatShading:y.wireframe===!1&&(y.flatShading===!0||N.attributes.normal===void 0&&fe===!1&&(y.isMeshLambertMaterial||y.isMeshPhongMaterial||y.isMeshStandardMaterial||y.isMeshPhysicalMaterial)),sizeAttenuation:y.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:de,skinning:F.isSkinnedMesh===!0,hasPositionAttribute:N.attributes.position!==void 0,morphTargets:N.morphAttributes.position!==void 0,morphNormals:N.morphAttributes.normal!==void 0,morphColors:N.morphAttributes.color!==void 0,morphTargetsCount:ne,morphTextureStride:oe,numSunLights:S.sun.length,numDirLights:S.directional.length,numPointLights:S.point.length,numSpotLights:S.spot.length,numSpotLightMaps:S.spotLightMap.length,numRectAreaLights:S.rectArea.length,numHemiLights:S.hemi.length,numSunLightShadows:S.sunShadowMap.length,numDirLightShadows:S.directionalShadowMap.length,numPointLightShadows:S.pointShadowMap.length,numSpotLightShadows:S.spotShadowMap.length,numSpotLightShadowsWithMaps:S.numSpotLightShadowsWithMaps,numLightProbes:S.numLightProbes,numLightProbeGrids:R.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:y.dithering,shadowMapEnabled:n.shadowMap.enabled&&I.length>0,shadowMapType:n.shadowMap.type,toneMapping:He,decodeVideoTexture:xe&&y.map.isVideoTexture===!0&&rt.getTransfer(y.map.colorSpace)===yt,decodeVideoTextureEmissive:G&&y.emissiveMap.isVideoTexture===!0&&rt.getTransfer(y.emissiveMap.colorSpace)===yt,premultipliedAlpha:y.premultipliedAlpha,doubleSided:y.side===bn,flipSided:y.side===vn,useDepthPacking:y.depthPacking>=0,depthPacking:y.depthPacking||0,index0AttributeName:y.index0AttributeName,extensionClipCullDistance:he&&y.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(he&&y.extensions.multiDraw===!0||pe)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:y.customProgramCacheKey()};return Be.vertexUv1s=l.has(1),Be.vertexUv2s=l.has(2),Be.vertexUv3s=l.has(3),l.clear(),Be}function p(y){let S=[];if(y.shaderID?S.push(y.shaderID):(S.push(y.customVertexShaderID),S.push(y.customFragmentShaderID)),y.defines!==void 0)for(let I in y.defines)S.push(I),S.push(y.defines[I]);return y.isRawShaderMaterial===!1&&(g(S,y),T(S,y),S.push(n.outputColorSpace)),S.push(y.customProgramCacheKey),S.join()}function g(y,S){y.push(S.precision),y.push(S.outputColorSpace),y.push(S.envMapMode),y.push(S.envMapCubeUVHeight),y.push(S.mapUv),y.push(S.alphaMapUv),y.push(S.lightMapUv),y.push(S.aoMapUv),y.push(S.bumpMapUv),y.push(S.normalMapUv),y.push(S.displacementMapUv),y.push(S.emissiveMapUv),y.push(S.metalnessMapUv),y.push(S.roughnessMapUv),y.push(S.anisotropyMapUv),y.push(S.clearcoatMapUv),y.push(S.clearcoatNormalMapUv),y.push(S.clearcoatRoughnessMapUv),y.push(S.iridescenceMapUv),y.push(S.iridescenceThicknessMapUv),y.push(S.sheenColorMapUv),y.push(S.sheenRoughnessMapUv),y.push(S.specularMapUv),y.push(S.specularColorMapUv),y.push(S.specularIntensityMapUv),y.push(S.transmissionMapUv),y.push(S.thicknessMapUv),y.push(S.combine),y.push(S.fogExp2),y.push(S.sizeAttenuation),y.push(S.morphTargetsCount),y.push(S.morphAttributeCount),y.push(S.numSunLights),y.push(S.numDirLights),y.push(S.numPointLights),y.push(S.numSpotLights),y.push(S.numSpotLightMaps),y.push(S.numHemiLights),y.push(S.numRectAreaLights),y.push(S.numSunLightShadows),y.push(S.numDirLightShadows),y.push(S.numPointLightShadows),y.push(S.numSpotLightShadows),y.push(S.numSpotLightShadowsWithMaps),y.push(S.numLightProbes),y.push(S.shadowMapType),y.push(S.toneMapping),y.push(S.numClippingPlanes),y.push(S.numClipIntersection),y.push(S.depthPacking)}function T(y,S){o.disableAll(),S.instancing&&o.enable(0),S.instancingColor&&o.enable(1),S.instancingMorph&&o.enable(2),S.matcap&&o.enable(3),S.envMap&&o.enable(4),S.normalMapObjectSpace&&o.enable(5),S.normalMapTangentSpace&&o.enable(6),S.clearcoat&&o.enable(7),S.iridescence&&o.enable(8),S.alphaTest&&o.enable(9),S.vertexColors&&o.enable(10),S.vertexAlphas&&o.enable(11),S.vertexUv1s&&o.enable(12),S.vertexUv2s&&o.enable(13),S.vertexUv3s&&o.enable(14),S.vertexTangents&&o.enable(15),S.anisotropy&&o.enable(16),S.alphaHash&&o.enable(17),S.batching&&o.enable(18),S.dispersion&&o.enable(19),S.retroreflection&&o.enable(24),S.batchingColor&&o.enable(20),S.gradientMap&&o.enable(21),S.packedNormalMap&&o.enable(22),S.vertexNormals&&o.enable(23),y.push(o.mask),o.disableAll(),S.fog&&o.enable(0),S.useFog&&o.enable(1),S.flatShading&&o.enable(2),S.logarithmicDepthBuffer&&o.enable(3),S.reversedDepthBuffer&&o.enable(4),S.skinning&&o.enable(5),S.morphTargets&&o.enable(6),S.morphNormals&&o.enable(7),S.morphColors&&o.enable(8),S.premultipliedAlpha&&o.enable(9),S.shadowMapEnabled&&o.enable(10),S.doubleSided&&o.enable(11),S.flipSided&&o.enable(12),S.useDepthPacking&&o.enable(13),S.dithering&&o.enable(14),S.transmission&&o.enable(15),S.sheen&&o.enable(16),S.opaque&&o.enable(17),S.pointsUvs&&o.enable(18),S.decodeVideoTexture&&o.enable(19),S.decodeVideoTextureEmissive&&o.enable(20),S.alphaToCoverage&&o.enable(21),S.numLightProbeGrids>0&&o.enable(22),S.hasPositionAttribute&&o.enable(23),y.push(o.mask)}function x(y){let S=f[y.type],I;if(S){let D=Di[S];I=hp.clone(D.uniforms)}else I=y.uniforms;return I}function v(y,S){let I=h.get(S);return I!==void 0?++I.usedTimes:(I=new kb(n,S,y,s),c.push(I),h.set(S,I)),I}function M(y){if(--y.usedTimes===0){let S=c.indexOf(y);c[S]=c[c.length-1],c.pop(),h.delete(y.cacheKey),y.destroy()}}function E(y){a.remove(y)}function A(){a.dispose()}return{getParameters:_,getProgramCacheKey:p,getUniforms:x,acquireProgram:v,releaseProgram:M,releaseShaderCache:E,programs:c,dispose:A}}function Hb(){let n=new WeakMap;function e(o){return n.has(o)}function t(o){let a=n.get(o);return a===void 0&&(a={},n.set(o,a)),a}function i(o){n.delete(o)}function s(o,a,l){n.get(o)[a]=l}function r(){n=new WeakMap}return{has:e,get:t,remove:i,update:s,dispose:r}}function Wb(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.materialVariant!==e.materialVariant?n.materialVariant-e.materialVariant:n.z!==e.z?n.z-e.z:n.id-e.id}function Pp(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function Ip(){let n=[],e=0,t=[],i=[],s=[];function r(){e=0,t.length=0,i.length=0,s.length=0}function o(d){let f=0;return d.isInstancedMesh&&(f+=2),d.isSkinnedMesh&&(f+=1),f}function a(d,f,m,_,p,g){let T=n[e];return T===void 0?(T={id:d.id,object:d,geometry:f,material:m,materialVariant:o(d),groupOrder:_,renderOrder:d.renderOrder,z:p,group:g},n[e]=T):(T.id=d.id,T.object=d,T.geometry=f,T.material=m,T.materialVariant=o(d),T.groupOrder=_,T.renderOrder=d.renderOrder,T.z=p,T.group=g),e++,T}function l(d,f,m,_,p,g,T){T.reversedDepth===!0&&(p=-p);let x=a(d,f,m,_,p,g);m.transmission>0?i.push(x):m.transparent===!0?s.push(x):t.push(x)}function c(d,f,m,_,p,g){let T=a(d,f,m,_,p,g);m.transmission>0?i.unshift(T):m.transparent===!0?s.unshift(T):t.unshift(T)}function h(d,f){t.length>1&&t.sort(d||Wb),i.length>1&&i.sort(f||Pp),s.length>1&&s.sort(f||Pp)}function u(){for(let d=e,f=n.length;d<f;d++){let m=n[d];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:t,transmissive:i,transparent:s,init:r,push:l,unshift:c,finish:u,sort:h}}function Xb(){let n=new WeakMap;function e(i,s){let r=n.get(i),o;return r===void 0?(o=new Ip,n.set(i,[o])):s>=r.length?(o=new Ip,r.push(o)):o=r[s],o}function t(){n=new WeakMap}return{get:e,dispose:t}}function qb(){let n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={direction:new C,color:new Ne};break;case"SpotLight":t={position:new C,direction:new C,color:new Ne,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new C,color:new Ne,distance:0,decay:0};break;case"HemisphereLight":t={direction:new C,skyColor:new Ne,groundColor:new Ne};break;case"RectAreaLight":t={color:new Ne,position:new C,halfWidth:new C,halfHeight:new C};break}return n[e.id]=t,t}}}function Yb(){let n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ae};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ae};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ae,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}var $b=0;function Zb(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function Kb(n){let e=new qb,t=Yb(),i={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new C);let s=new C,r=new We,o=new We;function a(c){let h=0,u=0,d=0;for(let F=0;F<9;F++)i.probe[F].set(0,0,0);let f=0,m=0,_=0,p=0,g=0,T=0,x=0,v=0,M=0,E=0,A=0,y=0,S=0,I=0;c.sort(Zb);for(let F=0,R=c.length;F<R;F++){let P=c[F],N=P.color,O=P.intensity,X=P.distance,J=null;if(P.shadow&&P.shadow.map&&(P.shadow.map.texture.format===Cs?J=P.shadow.map.texture:J=P.shadow.map.depthTexture||P.shadow.map.texture),P.isAmbientLight)h+=N.r*O,u+=N.g*O,d+=N.b*O;else if(P.isLightProbe){for(let z=0;z<9;z++)i.probe[z].addScaledVector(P.sh.coefficients[z],O);I++}else if(P.isSunLight){let z=e.get(P);if(z.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){let B=P.shadow,W=t.get(P);W.shadowIntensity=B.intensity,W.shadowBias=B.bias,W.shadowNormalBias=B.normalBias,W.shadowRadius=B.radius,W.shadowMapSize.copy(B.mapSize).multiply(B.getFrameExtents()),i.sunShadow[m]=W,i.sunShadowMap[m]=J;let ne=B.getViewportCount();for(let oe=0;oe<ne;oe++)i.sunShadowMatrix[_+oe]=B.getMatrix(oe),i.sunShadowCascade[_+oe]=B._cascadeData[oe];_+=ne,m++}i.sun[f]=z,f++}else if(P.isDirectionalLight){let z=e.get(P);if(z.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){let B=P.shadow,W=t.get(P);W.shadowIntensity=B.intensity,W.shadowBias=B.bias,W.shadowNormalBias=B.normalBias,W.shadowRadius=B.radius,W.shadowMapSize=B.mapSize,i.directionalShadow[p]=W,i.directionalShadowMap[p]=J,i.directionalShadowMatrix[p]=P.shadow.matrix,M++}i.directional[p]=z,p++}else if(P.isSpotLight){let z=e.get(P);z.position.setFromMatrixPosition(P.matrixWorld),z.color.copy(N).multiplyScalar(O),z.distance=X,z.coneCos=Math.cos(P.angle),z.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),z.decay=P.decay,i.spot[T]=z;let B=P.shadow;if(P.map&&(i.spotLightMap[y]=P.map,y++,B.updateMatrices(P),P.castShadow&&S++),i.spotLightMatrix[T]=B.matrix,P.castShadow){let W=t.get(P);W.shadowIntensity=B.intensity,W.shadowBias=B.bias,W.shadowNormalBias=B.normalBias,W.shadowRadius=B.radius,W.shadowMapSize=B.mapSize,i.spotShadow[T]=W,i.spotShadowMap[T]=J,A++}T++}else if(P.isRectAreaLight){let z=e.get(P);z.color.copy(N).multiplyScalar(O),z.halfWidth.set(P.width*.5,0,0),z.halfHeight.set(0,P.height*.5,0),i.rectArea[x]=z,x++}else if(P.isPointLight){let z=e.get(P);if(z.color.copy(P.color).multiplyScalar(P.intensity),z.distance=P.distance,z.decay=P.decay,P.castShadow){let B=P.shadow,W=t.get(P);W.shadowIntensity=B.intensity,W.shadowBias=B.bias,W.shadowNormalBias=B.normalBias,W.shadowRadius=B.radius,W.shadowMapSize=B.mapSize,W.shadowCameraNear=B.camera.near,W.shadowCameraFar=B.camera.far,i.pointShadow[g]=W,i.pointShadowMap[g]=J,i.pointShadowMatrix[g]=P.shadow.matrix,E++}i.point[g]=z,g++}else if(P.isHemisphereLight){let z=e.get(P);z.skyColor.copy(P.color).multiplyScalar(O),z.groundColor.copy(P.groundColor).multiplyScalar(O),i.hemi[v]=z,v++}}x>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=Te.LTC_FLOAT_1,i.rectAreaLTC2=Te.LTC_FLOAT_2):(i.rectAreaLTC1=Te.LTC_HALF_1,i.rectAreaLTC2=Te.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=u,i.ambient[2]=d;let D=i.hash;(D.sunLength!==f||D.directionalLength!==p||D.pointLength!==g||D.spotLength!==T||D.rectAreaLength!==x||D.hemiLength!==v||D.numSunShadows!==m||D.numDirectionalShadows!==M||D.numPointShadows!==E||D.numSpotShadows!==A||D.numSpotMaps!==y||D.numLightProbes!==I)&&(i.sun.length=f,i.directional.length=p,i.spot.length=T,i.rectArea.length=x,i.point.length=g,i.hemi.length=v,i.sunShadow.length=m,i.sunShadowMap.length=m,i.sunShadowMatrix.length=_,i.sunShadowCascade.length=_,i.directionalShadow.length=M,i.directionalShadowMap.length=M,i.directionalShadowMatrix.length=M,i.pointShadow.length=E,i.pointShadowMap.length=E,i.pointShadowMatrix.length=E,i.spotShadow.length=A,i.spotShadowMap.length=A,i.spotLightMatrix.length=A+y-S,i.spotLightMap.length=y,i.numSpotLightShadowsWithMaps=S,i.numLightProbes=I,D.sunLength=f,D.directionalLength=p,D.pointLength=g,D.spotLength=T,D.rectAreaLength=x,D.hemiLength=v,D.numSunShadows=m,D.numDirectionalShadows=M,D.numPointShadows=E,D.numSpotShadows=A,D.numSpotMaps=y,D.numLightProbes=I,i.version=$b++)}function l(c,h){let u=0,d=0,f=0,m=0,_=0,p=0,g=h.matrixWorldInverse;for(let T=0,x=c.length;T<x;T++){let v=c[T];if(v.isSunLight){let M=i.sun[u];M.direction.setFromMatrixPosition(v.matrixWorld),M.direction.transformDirection(g),u++}else if(v.isDirectionalLight){let M=i.directional[d];M.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),M.direction.sub(s),M.direction.transformDirection(g),d++}else if(v.isSpotLight){let M=i.spot[m];M.position.setFromMatrixPosition(v.matrixWorld),M.position.applyMatrix4(g),M.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),M.direction.sub(s),M.direction.transformDirection(g),m++}else if(v.isRectAreaLight){let M=i.rectArea[_];M.position.setFromMatrixPosition(v.matrixWorld),M.position.applyMatrix4(g),o.identity(),r.copy(v.matrixWorld),r.premultiply(g),o.extractRotation(r),M.halfWidth.set(v.width*.5,0,0),M.halfHeight.set(0,v.height*.5,0),M.halfWidth.applyMatrix4(o),M.halfHeight.applyMatrix4(o),_++}else if(v.isPointLight){let M=i.point[f];M.position.setFromMatrixPosition(v.matrixWorld),M.position.applyMatrix4(g),f++}else if(v.isHemisphereLight){let M=i.hemi[p];M.direction.setFromMatrixPosition(v.matrixWorld),M.direction.transformDirection(g),p++}}}return{setup:a,setupView:l,state:i}}function Lp(n){let e=new Kb(n),t=[],i=[],s=[];function r(d){u.camera=d,t.length=0,i.length=0,s.length=0}function o(d){t.push(d)}function a(d){i.push(d)}function l(d){s.push(d)}function c(){e.setup(t)}function h(d){e.setupView(t,d)}let u={lightsArray:t,shadowsArray:i,lightProbeGridArray:s,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:u,setupLights:c,setupLightsView:h,pushLight:o,pushShadow:a,pushLightProbeGrid:l}}function Jb(n){let e=new WeakMap;function t(s,r=0){let o=e.get(s),a;return o===void 0?(a=new Lp(n),e.set(s,[a])):r>=o.length?(a=new Lp(n),o.push(a)):a=o[r],a}function i(){e=new WeakMap}return{get:t,dispose:i}}var jb=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Qb=`uniform sampler2D shadow_pass;
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
}`,eM=[new C(1,0,0),new C(-1,0,0),new C(0,1,0),new C(0,-1,0),new C(0,0,1),new C(0,0,-1)],tM=[new C(0,-1,0),new C(0,-1,0),new C(0,0,1),new C(0,0,-1),new C(0,-1,0),new C(0,-1,0)],Dp=new We,ia=new C,yu=new C;function nM(n,e,t){let i=new Fr,s=new ae,r=new ae,o=new Mt,a=new fl,l=new pl,c={},h=t.maxTextureSize,u={[Hn]:vn,[vn]:Hn,[bn]:bn},d=new pn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ae},radius:{value:4}},vertexShader:jb,fragmentShader:Qb}),f=d.clone();f.defines.HORIZONTAL_PASS=1;let m=new pt;m.setAttribute("position",new wt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let _=new ge(m,d),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Ks;let g=this.type;this.render=function(E,A,y){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||E.length===0)return;this.type===Sf&&(ke("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=Ks);let S=n.getRenderTarget(),I=n.getActiveCubeFace(),D=n.getActiveMipmapLevel(),F=n.state;F.setBlending(Ii),F.buffers.depth.getReversed()===!0?F.buffers.color.setClear(0,0,0,0):F.buffers.color.setClear(1,1,1,1),F.buffers.depth.setTest(!0),F.setScissorTest(!1);let R=g!==this.type;R&&A.traverse(function(P){P.material&&(Array.isArray(P.material)?P.material.forEach(N=>N.needsUpdate=!0):P.material.needsUpdate=!0)});for(let P=0,N=E.length;P<N;P++){let O=E[P],X=O.shadow;if(X===void 0){ke("WebGLShadowMap:",O,"has no shadow.");continue}if(X.autoUpdate===!1&&X.needsUpdate===!1)continue;s.copy(X.mapSize);let J=X.getFrameExtents();s.multiply(J),r.copy(X.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/J.x),s.x=r.x*J.x,X.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/J.y),s.y=r.y*J.y,X.mapSize.y=r.y));let z=n.state.buffers.depth.getReversed();if(X.camera._reversedDepth=z,X.map===null||R===!0){if(X.map!==null&&(X.map.depthTexture!==null&&(X.map.depthTexture.dispose(),X.map.depthTexture=null),X.map.dispose()),this.type===Gr){if(O.isPointLight){ke("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}X.map=new Bn(s.x,s.y,{format:Cs,type:Fn,minFilter:Rt,magFilter:Rt,generateMipmaps:!1}),X.map.texture.name=O.name+".shadowMap",X.map.depthTexture=new vs(s.x,s.y,An),X.map.depthTexture.name=O.name+".shadowMapDepth",X.map.depthTexture.format=Ti,X.map.depthTexture.compareFunction=null,X.map.depthTexture.minFilter=qt,X.map.depthTexture.magFilter=qt}else O.isPointLight?(X.map=new pc(s.x),X.map.depthTexture=new ol(s.x,mi)):(X.map=new Bn(s.x,s.y),X.map.depthTexture=new vs(s.x,s.y,mi)),X.map.depthTexture.name=O.name+".shadowMap",X.map.depthTexture.format=Ti,this.type===Ks?(X.map.depthTexture.compareFunction=z?uc:hc,X.map.depthTexture.minFilter=Rt,X.map.depthTexture.magFilter=Rt):(X.map.depthTexture.compareFunction=null,X.map.depthTexture.minFilter=qt,X.map.depthTexture.magFilter=qt);X.camera.updateProjectionMatrix()}X.map.isWebGLCubeRenderTarget!==!0&&(X.map.width!==s.x||X.map.height!==s.y)&&X.map.setSize(s.x,s.y);let B=X.map.isWebGLCubeRenderTarget?6:X.getViewportCount();O.isPointLight!==!0&&X.updateMatrices(O,y);for(let W=0;W<B;W++){let ne=X.getCamera(W);if(O.isPointLight){let oe=X.camera,Ue=X.matrix,$e=O.distance||oe.far;$e!==oe.far&&(oe.far=$e,oe.updateProjectionMatrix()),ia.setFromMatrixPosition(O.matrixWorld),oe.position.copy(ia),yu.copy(oe.position),yu.add(eM[W]),oe.up.copy(tM[W]),oe.lookAt(yu),oe.updateMatrixWorld(),Ue.makeTranslation(-ia.x,-ia.y,-ia.z),Dp.multiplyMatrices(oe.projectionMatrix,oe.matrixWorldInverse),X._frustum.setFromProjectionMatrix(Dp,oe.coordinateSystem,oe.reversedDepth)}if(X.map.isWebGLCubeRenderTarget)n.setRenderTarget(X.map,W),n.clear();else{W===0&&(n.setRenderTarget(X.map),n.clear());let oe=X.getViewport(W);o.set(r.x*oe.x,r.y*oe.y,r.x*oe.z,r.y*oe.w),F.viewport(o)}i=X.getFrustum(W),v(A,y,ne,O,this.type)}X.isPointLightShadow!==!0&&this.type===Gr&&T(X,y),X.needsUpdate=!1}g=this.type,p.needsUpdate=!1,n.setRenderTarget(S,I,D)};function T(E,A){let y=e.update(_);d.defines.VSM_SAMPLES!==E.blurSamples&&(d.defines.VSM_SAMPLES=E.blurSamples,f.defines.VSM_SAMPLES=E.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),E.mapPass===null?E.mapPass=new Bn(s.x,s.y,{format:Cs,type:Fn}):(E.mapPass.width!==E.map.width||E.mapPass.height!==E.map.height)&&E.mapPass.setSize(E.map.width,E.map.height),d.uniforms.shadow_pass.value=E.map.depthTexture,d.uniforms.resolution.value.set(E.map.width,E.map.height),d.uniforms.radius.value=E.radius,n.setRenderTarget(E.mapPass),n.clear(),n.renderBufferDirect(A,null,y,d,_,null),f.uniforms.shadow_pass.value=E.mapPass.texture,f.uniforms.resolution.value.set(E.map.width,E.map.height),f.uniforms.radius.value=E.radius,n.setRenderTarget(E.map),n.clear(),n.renderBufferDirect(A,null,y,f,_,null)}function x(E,A,y,S){let I=null,D=y.isPointLight===!0?E.customDistanceMaterial:E.customDepthMaterial;if(D!==void 0)I=D;else if(I=y.isPointLight===!0?l:a,n.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0||A.alphaToCoverage===!0){let F=I.uuid,R=A.uuid,P=c[F];P===void 0&&(P={},c[F]=P);let N=P[R];N===void 0&&(N=I.clone(),P[R]=N,A.addEventListener("dispose",M)),I=N}if(I.visible=A.visible,I.wireframe=A.wireframe,S===Gr?I.side=A.shadowSide!==null?A.shadowSide:A.side:I.side=A.shadowSide!==null?A.shadowSide:u[A.side],I.alphaMap=A.alphaMap,I.alphaTest=A.alphaToCoverage===!0?.5:A.alphaTest,I.map=A.map,I.clipShadows=A.clipShadows,I.clippingPlanes=A.clippingPlanes,I.clipIntersection=A.clipIntersection,I.displacementMap=A.displacementMap,I.displacementScale=A.displacementScale,I.displacementBias=A.displacementBias,I.wireframeLinewidth=A.wireframeLinewidth,I.linewidth=A.linewidth,y.isPointLight===!0&&I.isMeshDistanceMaterial===!0){let F=n.properties.get(I);F.light=y}return I}function v(E,A,y,S,I){if(E.visible===!1)return;if(E.layers.test(A.layers)&&(E.isMesh||E.isLine||E.isPoints)&&(E.castShadow||E.receiveShadow&&I===Gr)&&(!E.frustumCulled||E.intersectsFrustum(i))){E.modelViewMatrix.multiplyMatrices(y.matrixWorldInverse,E.matrixWorld);let R=e.update(E),P=E.material;if(Array.isArray(P)){let N=R.groups;for(let O=0,X=N.length;O<X;O++){let J=N[O],z=P[J.materialIndex];if(z&&z.visible){let B=x(E,z,S,I);E.onBeforeShadow(n,E,A,y,R,B,J),n.renderBufferDirect(y,null,R,B,E,J),E.onAfterShadow(n,E,A,y,R,B,J)}}}else if(P.visible){let N=x(E,P,S,I);E.onBeforeShadow(n,E,A,y,R,N,null),n.renderBufferDirect(y,null,R,N,E,null),E.onAfterShadow(n,E,A,y,R,N,null)}}let F=E.children;for(let R=0,P=F.length;R<P;R++)v(F[R],A,y,S,I)}function M(E){E.target.removeEventListener("dispose",M);for(let y in c){let S=c[y],I=E.target.uuid;I in S&&(S[I].dispose(),delete S[I])}}}function iM(n,e){function t(){let V=!1,be=new Mt,ie=null,Me=new Mt(0,0,0,0);return{setMask:function(Ae){ie!==Ae&&!V&&(n.colorMask(Ae,Ae,Ae,Ae),ie=Ae)},setLocked:function(Ae){V=Ae},setClear:function(Ae,he,He,Be,Ct){Ct===!0&&(Ae*=Be,he*=Be,He*=Be),be.set(Ae,he,He,Be),Me.equals(be)===!1&&(n.clearColor(Ae,he,He,Be),Me.copy(be))},reset:function(){V=!1,ie=null,Me.set(-1,0,0,0)}}}function i(){let V=!1,be=!1,ie=null,Me=null,Ae=null;return{setReversed:function(he){if(be!==he){let He=e.get("EXT_clip_control");he?He.clipControlEXT(He.LOWER_LEFT_EXT,He.ZERO_TO_ONE_EXT):He.clipControlEXT(He.LOWER_LEFT_EXT,He.NEGATIVE_ONE_TO_ONE_EXT),be=he;let Be=Ae;Ae=null,this.setClear(Be)}},getReversed:function(){return be},setTest:function(he){he?Q(n.DEPTH_TEST):de(n.DEPTH_TEST)},setMask:function(he){ie!==he&&!V&&(n.depthMask(he),ie=he)},setFunc:function(he){if(be&&(he=sp[he]),Me!==he){switch(he){case $a:n.depthFunc(n.NEVER);break;case Za:n.depthFunc(n.ALWAYS);break;case Ka:n.depthFunc(n.LESS);break;case wr:n.depthFunc(n.LEQUAL);break;case Ja:n.depthFunc(n.EQUAL);break;case ja:n.depthFunc(n.GEQUAL);break;case Qa:n.depthFunc(n.GREATER);break;case el:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}Me=he}},setLocked:function(he){V=he},setClear:function(he){Ae!==he&&(Ae=he,be&&(he=1-he),n.clearDepth(he))},reset:function(){V=!1,ie=null,Me=null,Ae=null,be=!1}}}function s(){let V=!1,be=null,ie=null,Me=null,Ae=null,he=null,He=null,Be=null,Ct=null;return{setTest:function(gt){V||(gt?Q(n.STENCIL_TEST):de(n.STENCIL_TEST))},setMask:function(gt){be!==gt&&!V&&(n.stencilMask(gt),be=gt)},setFunc:function(gt,ri,bi){(ie!==gt||Me!==ri||Ae!==bi)&&(n.stencilFunc(gt,ri,bi),ie=gt,Me=ri,Ae=bi)},setOp:function(gt,ri,bi){(he!==gt||He!==ri||Be!==bi)&&(n.stencilOp(gt,ri,bi),he=gt,He=ri,Be=bi)},setLocked:function(gt){V=gt},setClear:function(gt){Ct!==gt&&(n.clearStencil(gt),Ct=gt)},reset:function(){V=!1,be=null,ie=null,Me=null,Ae=null,he=null,He=null,Be=null,Ct=null}}}let r=new t,o=new i,a=new s,l=new WeakMap,c=new WeakMap,h={},u={},d={},f=new WeakMap,m=[],_=null,p=!1,g=null,T=null,x=null,v=null,M=null,E=null,A=null,y=new Ne(0,0,0),S=0,I=!1,D=null,F=null,R=null,P=null,N=null,O=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS),X=!1,J=0,z=n.getParameter(n.VERSION);z.indexOf("WebGL")!==-1?(J=parseFloat(/^WebGL (\d)/.exec(z)[1]),X=J>=1):z.indexOf("OpenGL ES")!==-1&&(J=parseFloat(/^OpenGL ES (\d)/.exec(z)[1]),X=J>=2);let B=null,W={},ne=n.getParameter(n.SCISSOR_BOX),oe=n.getParameter(n.VIEWPORT),Ue=new Mt().fromArray(ne),$e=new Mt().fromArray(oe);function Xe(V,be,ie,Me){let Ae=new Uint8Array(4),he=n.createTexture();n.bindTexture(V,he),n.texParameteri(V,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(V,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let He=0;He<ie;He++)V===n.TEXTURE_3D||V===n.TEXTURE_2D_ARRAY?n.texImage3D(be,0,n.RGBA,1,1,Me,0,n.RGBA,n.UNSIGNED_BYTE,Ae):n.texImage2D(be+He,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,Ae);return he}let Z={};Z[n.TEXTURE_2D]=Xe(n.TEXTURE_2D,n.TEXTURE_2D,1),Z[n.TEXTURE_CUBE_MAP]=Xe(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),Z[n.TEXTURE_2D_ARRAY]=Xe(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),Z[n.TEXTURE_3D]=Xe(n.TEXTURE_3D,n.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),Q(n.DEPTH_TEST),o.setFunc(wr),ce(!1),fe(kh),Q(n.CULL_FACE),le(Ii);function Q(V){h[V]!==!0&&(n.enable(V),h[V]=!0)}function de(V){h[V]!==!1&&(n.disable(V),h[V]=!1)}function De(V,be){return d[V]!==be?(n.bindFramebuffer(V,be),d[V]=be,V===n.DRAW_FRAMEBUFFER&&(d[n.FRAMEBUFFER]=be),V===n.FRAMEBUFFER&&(d[n.DRAW_FRAMEBUFFER]=be),!0):!1}function pe(V,be){let ie=m,Me=!1;if(V){ie=f.get(be),ie===void 0&&(ie=[],f.set(be,ie));let Ae=V.textures;if(ie.length!==Ae.length||ie[0]!==n.COLOR_ATTACHMENT0){for(let he=0,He=Ae.length;he<He;he++)ie[he]=n.COLOR_ATTACHMENT0+he;ie.length=Ae.length,Me=!0}}else ie[0]!==n.BACK&&(ie[0]=n.BACK,Me=!0);Me&&n.drawBuffers(ie)}function xe(V){return _!==V?(n.useProgram(V),_=V,!0):!1}let Ze={[js]:n.FUNC_ADD,[wf]:n.FUNC_SUBTRACT,[Ef]:n.FUNC_REVERSE_SUBTRACT};Ze[Af]=n.MIN,Ze[Rf]=n.MAX;let te={[Cf]:n.ZERO,[Pf]:n.ONE,[If]:n.SRC_COLOR,[Gh]:n.SRC_ALPHA,[Of]:n.SRC_ALPHA_SATURATE,[Uf]:n.DST_COLOR,[Df]:n.DST_ALPHA,[Lf]:n.ONE_MINUS_SRC_COLOR,[Hh]:n.ONE_MINUS_SRC_ALPHA,[Ff]:n.ONE_MINUS_DST_COLOR,[Nf]:n.ONE_MINUS_DST_ALPHA,[Bf]:n.CONSTANT_COLOR,[kf]:n.ONE_MINUS_CONSTANT_COLOR,[zf]:n.CONSTANT_ALPHA,[Vf]:n.ONE_MINUS_CONSTANT_ALPHA};function le(V,be,ie,Me,Ae,he,He,Be,Ct,gt){if(V===Ii){p===!0&&(de(n.BLEND),p=!1);return}if(p===!1&&(Q(n.BLEND),p=!0),V!==Tf){if(V!==g||gt!==I){if((T!==js||M!==js)&&(n.blendEquation(n.FUNC_ADD),T=js,M=js),gt)switch(V){case Hr:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Js:n.blendFunc(n.ONE,n.ONE);break;case zh:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Vh:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:Ye("WebGLState: Invalid blending: ",V);break}else switch(V){case Hr:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Js:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case zh:Ye("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Vh:Ye("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Ye("WebGLState: Invalid blending: ",V);break}x=null,v=null,E=null,A=null,y.set(0,0,0),S=0,g=V,I=gt}return}Ae=Ae||be,he=he||ie,He=He||Me,(be!==T||Ae!==M)&&(n.blendEquationSeparate(Ze[be],Ze[Ae]),T=be,M=Ae),(ie!==x||Me!==v||he!==E||He!==A)&&(n.blendFuncSeparate(te[ie],te[Me],te[he],te[He]),x=ie,v=Me,E=he,A=He),(Be.equals(y)===!1||Ct!==S)&&(n.blendColor(Be.r,Be.g,Be.b,Ct),y.copy(Be),S=Ct),g=V,I=!1}function ue(V,be){V.side===bn?de(n.CULL_FACE):Q(n.CULL_FACE);let ie=V.side===vn;be&&(ie=!ie),ce(ie),V.blending===Hr&&V.transparent===!1?le(Ii):le(V.blending,V.blendEquation,V.blendSrc,V.blendDst,V.blendEquationAlpha,V.blendSrcAlpha,V.blendDstAlpha,V.blendColor,V.blendAlpha,V.premultipliedAlpha),o.setFunc(V.depthFunc),o.setTest(V.depthTest),o.setMask(V.depthWrite),r.setMask(V.colorWrite);let Me=V.stencilWrite;a.setTest(Me),Me&&(a.setMask(V.stencilWriteMask),a.setFunc(V.stencilFunc,V.stencilRef,V.stencilFuncMask),a.setOp(V.stencilFail,V.stencilZFail,V.stencilZPass)),G(V.polygonOffset,V.polygonOffsetFactor,V.polygonOffsetUnits),V.alphaToCoverage===!0?Q(n.SAMPLE_ALPHA_TO_COVERAGE):de(n.SAMPLE_ALPHA_TO_COVERAGE)}function ce(V){D!==V&&(V?n.frontFace(n.CW):n.frontFace(n.CCW),D=V)}function fe(V){V!==Mf?(Q(n.CULL_FACE),V!==F&&(V===kh?n.cullFace(n.BACK):V===xf?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):de(n.CULL_FACE),F=V}function Le(V){V!==R&&(X&&n.lineWidth(V),R=V)}function G(V,be,ie){V?(Q(n.POLYGON_OFFSET_FILL),(P!==be||N!==ie)&&(P=be,N=ie,o.getReversed()&&(be=-be),n.polygonOffset(be,ie))):de(n.POLYGON_OFFSET_FILL)}function re(V){V?Q(n.SCISSOR_TEST):de(n.SCISSOR_TEST)}function Re(V){V===void 0&&(V=n.TEXTURE0+O-1),B!==V&&(n.activeTexture(V),B=V)}function U(V,be,ie){ie===void 0&&(B===null?ie=n.TEXTURE0+O-1:ie=B);let Me=W[ie];Me===void 0&&(Me={type:void 0,texture:void 0},W[ie]=Me),(Me.type!==V||Me.texture!==be)&&(B!==ie&&(n.activeTexture(ie),B=ie),n.bindTexture(V,be||Z[V]),Me.type=V,Me.texture=be)}function Ce(){let V=W[B];V!==void 0&&V.type!==void 0&&(n.bindTexture(V.type,null),V.type=void 0,V.texture=void 0)}function Ke(){try{n.compressedTexImage2D(...arguments)}catch(V){Ye("WebGLState:",V)}}function L(){try{n.compressedTexImage3D(...arguments)}catch(V){Ye("WebGLState:",V)}}function b(){try{n.texSubImage2D(...arguments)}catch(V){Ye("WebGLState:",V)}}function H(){try{n.texSubImage3D(...arguments)}catch(V){Ye("WebGLState:",V)}}function $(){try{n.compressedTexSubImage2D(...arguments)}catch(V){Ye("WebGLState:",V)}}function j(){try{n.compressedTexSubImage3D(...arguments)}catch(V){Ye("WebGLState:",V)}}function me(){try{n.texStorage2D(...arguments)}catch(V){Ye("WebGLState:",V)}}function _e(){try{n.texStorage3D(...arguments)}catch(V){Ye("WebGLState:",V)}}function ee(){try{n.texImage2D(...arguments)}catch(V){Ye("WebGLState:",V)}}function se(){try{n.texImage3D(...arguments)}catch(V){Ye("WebGLState:",V)}}function ye(V){return u[V]!==void 0?u[V]:n.getParameter(V)}function Ve(V,be){u[V]!==be&&(n.pixelStorei(V,be),u[V]=be)}function Se(V){Ue.equals(V)===!1&&(n.scissor(V.x,V.y,V.z,V.w),Ue.copy(V))}function ve(V){$e.equals(V)===!1&&(n.viewport(V.x,V.y,V.z,V.w),$e.copy(V))}function Ge(V,be){let ie=c.get(be);ie===void 0&&(ie=new WeakMap,c.set(be,ie));let Me=ie.get(V);Me===void 0&&(Me=n.getUniformBlockIndex(be,V.name),ie.set(V,Me))}function qe(V,be){let Me=c.get(be).get(V);l.get(be)!==Me&&(n.uniformBlockBinding(be,Me,V.__bindingPointIndex),l.set(be,Me))}function et(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),o.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),n.pixelStorei(n.PACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,!1),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,n.BROWSER_DEFAULT_WEBGL),n.pixelStorei(n.PACK_ROW_LENGTH,0),n.pixelStorei(n.PACK_SKIP_PIXELS,0),n.pixelStorei(n.PACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_ROW_LENGTH,0),n.pixelStorei(n.UNPACK_IMAGE_HEIGHT,0),n.pixelStorei(n.UNPACK_SKIP_PIXELS,0),n.pixelStorei(n.UNPACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_SKIP_IMAGES,0),h={},u={},B=null,W={},d={},f=new WeakMap,m=[],_=null,p=!1,g=null,T=null,x=null,v=null,M=null,E=null,A=null,y=new Ne(0,0,0),S=0,I=!1,D=null,F=null,R=null,P=null,N=null,Ue.set(0,0,n.canvas.width,n.canvas.height),$e.set(0,0,n.canvas.width,n.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:Q,disable:de,bindFramebuffer:De,drawBuffers:pe,useProgram:xe,setBlending:le,setMaterial:ue,setFlipSided:ce,setCullFace:fe,setLineWidth:Le,setPolygonOffset:G,setScissorTest:re,activeTexture:Re,bindTexture:U,unbindTexture:Ce,compressedTexImage2D:Ke,compressedTexImage3D:L,texImage2D:ee,texImage3D:se,pixelStorei:Ve,getParameter:ye,updateUBOMapping:Ge,uniformBlockBinding:qe,texStorage2D:me,texStorage3D:_e,texSubImage2D:b,texSubImage3D:H,compressedTexSubImage2D:$,compressedTexSubImage3D:j,scissor:Se,viewport:ve,reset:et}}function sM(n,e,t,i,s,r,o){let a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new ae,h=new WeakMap,u=new Set,d,f=new WeakMap,m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function _(L,b){return m?new OffscreenCanvas(L,b):Rr("canvas")}function p(L,b,H){let $=1,j=Ke(L);if((j.width>H||j.height>H)&&($=H/Math.max(j.width,j.height)),$<1)if(typeof HTMLImageElement<"u"&&L instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&L instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&L instanceof ImageBitmap||typeof VideoFrame<"u"&&L instanceof VideoFrame){let me=Math.floor($*j.width),_e=Math.floor($*j.height);d===void 0&&(d=_(me,_e));let ee=b?_(me,_e):d;return ee.width=me,ee.height=_e,ee.getContext("2d").drawImage(L,0,0,me,_e),ke("WebGLRenderer: Texture has been resized from ("+j.width+"x"+j.height+") to ("+me+"x"+_e+")."),ee}else return"data"in L&&ke("WebGLRenderer: Image in DataTexture is too big ("+j.width+"x"+j.height+")."),L;return L}function g(L){return L.generateMipmaps}function T(L){n.generateMipmap(L)}function x(L){return L.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:L.isWebGL3DRenderTarget?n.TEXTURE_3D:L.isWebGLArrayRenderTarget||L.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function v(L,b,H,$,j,me=!1){if(L!==null){if(n[L]!==void 0)return n[L];ke("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+L+"'")}let _e;$&&(_e=e.get("EXT_texture_norm16"),_e||ke("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let ee=b;if(b===n.RED&&(H===n.FLOAT&&(ee=n.R32F),H===n.HALF_FLOAT&&(ee=n.R16F),H===n.UNSIGNED_BYTE&&(ee=n.R8),H===n.UNSIGNED_SHORT&&_e&&(ee=_e.R16_EXT),H===n.SHORT&&_e&&(ee=_e.R16_SNORM_EXT)),b===n.RED_INTEGER&&(H===n.UNSIGNED_BYTE&&(ee=n.R8UI),H===n.UNSIGNED_SHORT&&(ee=n.R16UI),H===n.UNSIGNED_INT&&(ee=n.R32UI),H===n.BYTE&&(ee=n.R8I),H===n.SHORT&&(ee=n.R16I),H===n.INT&&(ee=n.R32I)),b===n.RG&&(H===n.FLOAT&&(ee=n.RG32F),H===n.HALF_FLOAT&&(ee=n.RG16F),H===n.UNSIGNED_BYTE&&(ee=n.RG8),H===n.UNSIGNED_SHORT&&_e&&(ee=_e.RG16_EXT),H===n.SHORT&&_e&&(ee=_e.RG16_SNORM_EXT)),b===n.RG_INTEGER&&(H===n.UNSIGNED_BYTE&&(ee=n.RG8UI),H===n.UNSIGNED_SHORT&&(ee=n.RG16UI),H===n.UNSIGNED_INT&&(ee=n.RG32UI),H===n.BYTE&&(ee=n.RG8I),H===n.SHORT&&(ee=n.RG16I),H===n.INT&&(ee=n.RG32I)),b===n.RGB_INTEGER&&(H===n.UNSIGNED_BYTE&&(ee=n.RGB8UI),H===n.UNSIGNED_SHORT&&(ee=n.RGB16UI),H===n.UNSIGNED_INT&&(ee=n.RGB32UI),H===n.BYTE&&(ee=n.RGB8I),H===n.SHORT&&(ee=n.RGB16I),H===n.INT&&(ee=n.RGB32I)),b===n.RGBA_INTEGER&&(H===n.UNSIGNED_BYTE&&(ee=n.RGBA8UI),H===n.UNSIGNED_SHORT&&(ee=n.RGBA16UI),H===n.UNSIGNED_INT&&(ee=n.RGBA32UI),H===n.BYTE&&(ee=n.RGBA8I),H===n.SHORT&&(ee=n.RGBA16I),H===n.INT&&(ee=n.RGBA32I)),b===n.RGB&&(H===n.UNSIGNED_SHORT&&_e&&(ee=_e.RGB16_EXT),H===n.SHORT&&_e&&(ee=_e.RGB16_SNORM_EXT),H===n.UNSIGNED_INT_5_9_9_9_REV&&(ee=n.RGB9_E5),H===n.UNSIGNED_INT_10F_11F_11F_REV&&(ee=n.R11F_G11F_B10F)),b===n.RGBA){let se=me?vo:rt.getTransfer(j);H===n.FLOAT&&(ee=n.RGBA32F),H===n.HALF_FLOAT&&(ee=n.RGBA16F),H===n.UNSIGNED_BYTE&&(ee=se===yt?n.SRGB8_ALPHA8:n.RGBA8),H===n.UNSIGNED_SHORT&&_e&&(ee=_e.RGBA16_EXT),H===n.SHORT&&_e&&(ee=_e.RGBA16_SNORM_EXT),H===n.UNSIGNED_SHORT_4_4_4_4&&(ee=n.RGBA4),H===n.UNSIGNED_SHORT_5_5_5_1&&(ee=n.RGB5_A1)}return(ee===n.R16F||ee===n.R32F||ee===n.RG16F||ee===n.RG32F||ee===n.RGBA16F||ee===n.RGBA32F)&&e.get("EXT_color_buffer_float"),ee}function M(L,b){let H;return L?b===null||b===mi||b===qr?H=n.DEPTH24_STENCIL8:b===An?H=n.DEPTH32F_STENCIL8:b===Xr&&(H=n.DEPTH24_STENCIL8,ke("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):b===null||b===mi||b===qr?H=n.DEPTH_COMPONENT24:b===An?H=n.DEPTH_COMPONENT32F:b===Xr&&(H=n.DEPTH_COMPONENT16),H}function E(L,b){return g(L)===!0||L.isFramebufferTexture&&L.minFilter!==qt&&L.minFilter!==Rt?Math.log2(Math.max(b.width,b.height))+1:L.mipmaps!==void 0&&L.mipmaps.length>0?L.mipmaps.length:L.isCompressedTexture&&Array.isArray(L.image)?b.mipmaps.length:1}function A(L){let b=L.target;b.removeEventListener("dispose",A),S(b),b.isVideoTexture&&h.delete(b),b.isHTMLTexture&&u.delete(b)}function y(L){let b=L.target;b.removeEventListener("dispose",y),D(b)}function S(L){let b=i.get(L);if(b.__webglInit===void 0)return;let H=L.source,$=f.get(H);if($){let j=$[b.__cacheKey];j.usedTimes--,j.usedTimes===0&&I(L),Object.keys($).length===0&&f.delete(H)}i.remove(L)}function I(L){let b=i.get(L);n.deleteTexture(b.__webglTexture);let H=L.source,$=f.get(H);delete $[b.__cacheKey],o.memory.textures--}function D(L){let b=i.get(L);if(L.depthTexture&&(L.depthTexture.dispose(),i.remove(L.depthTexture)),L.isWebGLCubeRenderTarget)for(let $=0;$<6;$++){if(Array.isArray(b.__webglFramebuffer[$]))for(let j=0;j<b.__webglFramebuffer[$].length;j++)n.deleteFramebuffer(b.__webglFramebuffer[$][j]);else n.deleteFramebuffer(b.__webglFramebuffer[$]);b.__webglDepthbuffer&&n.deleteRenderbuffer(b.__webglDepthbuffer[$])}else{if(Array.isArray(b.__webglFramebuffer))for(let $=0;$<b.__webglFramebuffer.length;$++)n.deleteFramebuffer(b.__webglFramebuffer[$]);else n.deleteFramebuffer(b.__webglFramebuffer);if(b.__webglDepthbuffer&&n.deleteRenderbuffer(b.__webglDepthbuffer),b.__webglMultisampledFramebuffer&&n.deleteFramebuffer(b.__webglMultisampledFramebuffer),b.__webglColorRenderbuffer)for(let $=0;$<b.__webglColorRenderbuffer.length;$++)b.__webglColorRenderbuffer[$]&&n.deleteRenderbuffer(b.__webglColorRenderbuffer[$]);b.__webglDepthRenderbuffer&&n.deleteRenderbuffer(b.__webglDepthRenderbuffer)}let H=L.textures;for(let $=0,j=H.length;$<j;$++){let me=i.get(H[$]);me.__webglTexture&&(n.deleteTexture(me.__webglTexture),o.memory.textures--),i.remove(H[$])}i.remove(L)}let F=0;function R(){F=0}function P(){return F}function N(L){F=L}function O(){let L=F;return L>=s.maxTextures&&ke("WebGLTextures: Trying to use "+(L+1)+" texture units while this GPU supports only "+s.maxTextures),F+=1,L}function X(L){let b=[];return b.push(L.wrapS),b.push(L.wrapT),b.push(L.wrapR||0),b.push(L.magFilter),b.push(L.minFilter),b.push(L.anisotropy),b.push(L.internalFormat),b.push(L.format),b.push(L.type),b.push(L.generateMipmaps),b.push(L.premultiplyAlpha),b.push(L.flipY),b.push(L.unpackAlignment),b.push(L.colorSpace),b.join()}function J(L,b){let H=i.get(L);if(L.isVideoTexture&&U(L),L.isRenderTargetTexture===!1&&L.isExternalTexture!==!0&&L.version>0&&H.__version!==L.version){let $=L.image;if($===null)ke("WebGLRenderer: Texture marked for update but no image data found.");else if($.complete===!1)ke("WebGLRenderer: Texture marked for update but image is incomplete");else{de(H,L,b);return}}else L.isExternalTexture&&(H.__webglTexture=L.sourceTexture?L.sourceTexture:null);t.bindTexture(n.TEXTURE_2D,H.__webglTexture,n.TEXTURE0+b)}function z(L,b){let H=i.get(L);if(L.isRenderTargetTexture===!1&&L.version>0&&H.__version!==L.version){de(H,L,b);return}else L.isExternalTexture&&(H.__webglTexture=L.sourceTexture?L.sourceTexture:null);t.bindTexture(n.TEXTURE_2D_ARRAY,H.__webglTexture,n.TEXTURE0+b)}function B(L,b){let H=i.get(L);if(L.isRenderTargetTexture===!1&&L.version>0&&H.__version!==L.version){de(H,L,b);return}t.bindTexture(n.TEXTURE_3D,H.__webglTexture,n.TEXTURE0+b)}function W(L,b){let H=i.get(L);if(L.isCubeDepthTexture!==!0&&L.version>0&&H.__version!==L.version){De(H,L,b);return}t.bindTexture(n.TEXTURE_CUBE_MAP,H.__webglTexture,n.TEXTURE0+b)}let ne={[rn]:n.REPEAT,[On]:n.CLAMP_TO_EDGE,[Er]:n.MIRRORED_REPEAT},oe={[qt]:n.NEAREST,[wl]:n.NEAREST_MIPMAP_NEAREST,[er]:n.NEAREST_MIPMAP_LINEAR,[Rt]:n.LINEAR,[Wr]:n.LINEAR_MIPMAP_NEAREST,[mn]:n.LINEAR_MIPMAP_LINEAR},Ue={[Zf]:n.NEVER,[ep]:n.ALWAYS,[Kf]:n.LESS,[hc]:n.LEQUAL,[Jf]:n.EQUAL,[uc]:n.GEQUAL,[jf]:n.GREATER,[Qf]:n.NOTEQUAL};function $e(L,b){if(b.type===An&&e.has("OES_texture_float_linear")===!1&&(b.magFilter===Rt||b.magFilter===Wr||b.magFilter===er||b.magFilter===mn||b.minFilter===Rt||b.minFilter===Wr||b.minFilter===er||b.minFilter===mn)&&ke("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(L,n.TEXTURE_WRAP_S,ne[b.wrapS]),n.texParameteri(L,n.TEXTURE_WRAP_T,ne[b.wrapT]),(L===n.TEXTURE_3D||L===n.TEXTURE_2D_ARRAY)&&n.texParameteri(L,n.TEXTURE_WRAP_R,ne[b.wrapR]),n.texParameteri(L,n.TEXTURE_MAG_FILTER,oe[b.magFilter]),n.texParameteri(L,n.TEXTURE_MIN_FILTER,oe[b.minFilter]),b.compareFunction&&(n.texParameteri(L,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(L,n.TEXTURE_COMPARE_FUNC,Ue[b.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(b.magFilter===qt||b.minFilter!==er&&b.minFilter!==mn||b.type===An&&e.has("OES_texture_float_linear")===!1)return;if(b.anisotropy>1||i.get(b).__currentAnisotropy){let H=e.get("EXT_texture_filter_anisotropic");n.texParameterf(L,H.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(b.anisotropy,s.getMaxAnisotropy())),i.get(b).__currentAnisotropy=b.anisotropy}}}function Xe(L,b){let H=!1;L.__webglInit===void 0&&(L.__webglInit=!0,b.addEventListener("dispose",A));let $=b.source,j=f.get($);j===void 0&&(j={},f.set($,j));let me=X(b);if(me!==L.__cacheKey){j[me]===void 0&&(j[me]={texture:n.createTexture(),usedTimes:0},o.memory.textures++,H=!0),j[me].usedTimes++;let _e=j[L.__cacheKey];_e!==void 0&&(j[L.__cacheKey].usedTimes--,_e.usedTimes===0&&I(b)),L.__cacheKey=me,L.__webglTexture=j[me].texture}return H}function Z(L,b,H){return Math.floor(Math.floor(L/H)/b)}function Q(L,b,H,$){let me=L.updateRanges;if(me.length===0)t.texSubImage2D(n.TEXTURE_2D,0,0,0,b.width,b.height,H,$,b.data);else{me.sort((Ve,Se)=>Ve.start-Se.start);let _e=0;for(let Ve=1;Ve<me.length;Ve++){let Se=me[_e],ve=me[Ve],Ge=Se.start+Se.count,qe=Z(ve.start,b.width,4),et=Z(Se.start,b.width,4);ve.start<=Ge+1&&qe===et&&Z(ve.start+ve.count-1,b.width,4)===qe?Se.count=Math.max(Se.count,ve.start+ve.count-Se.start):(++_e,me[_e]=ve)}me.length=_e+1;let ee=t.getParameter(n.UNPACK_ROW_LENGTH),se=t.getParameter(n.UNPACK_SKIP_PIXELS),ye=t.getParameter(n.UNPACK_SKIP_ROWS);t.pixelStorei(n.UNPACK_ROW_LENGTH,b.width);for(let Ve=0,Se=me.length;Ve<Se;Ve++){let ve=me[Ve],Ge=Math.floor(ve.start/4),qe=Math.ceil(ve.count/4),et=Ge%b.width,V=Math.floor(Ge/b.width),be=qe,ie=1;t.pixelStorei(n.UNPACK_SKIP_PIXELS,et),t.pixelStorei(n.UNPACK_SKIP_ROWS,V),t.texSubImage2D(n.TEXTURE_2D,0,et,V,be,ie,H,$,b.data)}L.clearUpdateRanges(),t.pixelStorei(n.UNPACK_ROW_LENGTH,ee),t.pixelStorei(n.UNPACK_SKIP_PIXELS,se),t.pixelStorei(n.UNPACK_SKIP_ROWS,ye)}}function de(L,b,H){let $=n.TEXTURE_2D;(b.isDataArrayTexture||b.isCompressedArrayTexture)&&($=n.TEXTURE_2D_ARRAY),b.isData3DTexture&&($=n.TEXTURE_3D);let j=Xe(L,b),me=b.source;t.bindTexture($,L.__webglTexture,n.TEXTURE0+H);let _e=i.get(me);if(me.version!==_e.__version||j===!0){if(t.activeTexture(n.TEXTURE0+H),(typeof ImageBitmap<"u"&&b.image instanceof ImageBitmap)===!1){let ie=rt.getPrimaries(rt.workingColorSpace),Me=b.colorSpace===Ft?null:rt.getPrimaries(b.colorSpace),Ae=b.colorSpace===Ft||ie===Me?n.NONE:n.BROWSER_DEFAULT_WEBGL;t.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,b.flipY),t.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),t.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ae)}t.pixelStorei(n.UNPACK_ALIGNMENT,b.unpackAlignment);let se=p(b.image,!1,s.maxTextureSize);se=Ce(b,se);let ye=r.convert(b.format,b.colorSpace),Ve=r.convert(b.type),Se=v(b.internalFormat,ye,Ve,b.normalized,b.colorSpace,b.isVideoTexture);$e($,b);let ve,Ge=b.mipmaps,qe=b.isVideoTexture!==!0,et=_e.__version===void 0||j===!0,V=me.dataReady,be=E(b,se);if(b.isDepthTexture)Se=M(b.format===Rs,b.type),et&&(qe?t.texStorage2D(n.TEXTURE_2D,1,Se,se.width,se.height):t.texImage2D(n.TEXTURE_2D,0,Se,se.width,se.height,0,ye,Ve,null));else if(b.isDataTexture)if(Ge.length>0){qe&&et&&t.texStorage2D(n.TEXTURE_2D,be,Se,Ge[0].width,Ge[0].height);for(let ie=0,Me=Ge.length;ie<Me;ie++)ve=Ge[ie],qe?V&&t.texSubImage2D(n.TEXTURE_2D,ie,0,0,ve.width,ve.height,ye,Ve,ve.data):t.texImage2D(n.TEXTURE_2D,ie,Se,ve.width,ve.height,0,ye,Ve,ve.data);b.generateMipmaps=!1}else qe?(et&&t.texStorage2D(n.TEXTURE_2D,be,Se,se.width,se.height),V&&Q(b,se,ye,Ve)):t.texImage2D(n.TEXTURE_2D,0,Se,se.width,se.height,0,ye,Ve,se.data);else if(b.isCompressedTexture)if(b.isCompressedArrayTexture){qe&&et&&t.texStorage3D(n.TEXTURE_2D_ARRAY,be,Se,Ge[0].width,Ge[0].height,se.depth);for(let ie=0,Me=Ge.length;ie<Me;ie++)if(ve=Ge[ie],b.format!==Kn)if(ye!==null)if(qe){if(V)if(b.layerUpdates.size>0){let Ae=du(ve.width,ve.height,b.format,b.type);for(let he of b.layerUpdates){let He=ve.data.subarray(he*Ae/ve.data.BYTES_PER_ELEMENT,(he+1)*Ae/ve.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,ie,0,0,he,ve.width,ve.height,1,ye,He)}}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,ie,0,0,0,ve.width,ve.height,se.depth,ye,ve.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,ie,Se,ve.width,ve.height,se.depth,0,ve.data,0,0);else ke("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else qe?V&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,ie,0,0,0,ve.width,ve.height,se.depth,ye,Ve,ve.data):t.texImage3D(n.TEXTURE_2D_ARRAY,ie,Se,ve.width,ve.height,se.depth,0,ye,Ve,ve.data);b.layerUpdates.size>0&&b.clearLayerUpdates()}else{qe&&et&&t.texStorage2D(n.TEXTURE_2D,be,Se,Ge[0].width,Ge[0].height);for(let ie=0,Me=Ge.length;ie<Me;ie++)ve=Ge[ie],b.format!==Kn?ye!==null?qe?V&&t.compressedTexSubImage2D(n.TEXTURE_2D,ie,0,0,ve.width,ve.height,ye,ve.data):t.compressedTexImage2D(n.TEXTURE_2D,ie,Se,ve.width,ve.height,0,ve.data):ke("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):qe?V&&t.texSubImage2D(n.TEXTURE_2D,ie,0,0,ve.width,ve.height,ye,Ve,ve.data):t.texImage2D(n.TEXTURE_2D,ie,Se,ve.width,ve.height,0,ye,Ve,ve.data)}else if(b.isDataArrayTexture)if(qe){if(et&&t.texStorage3D(n.TEXTURE_2D_ARRAY,be,Se,se.width,se.height,se.depth),V)if(b.layerUpdates.size>0){let ie=du(se.width,se.height,b.format,b.type);for(let Me of b.layerUpdates){let Ae=se.data.subarray(Me*ie/se.data.BYTES_PER_ELEMENT,(Me+1)*ie/se.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,Me,se.width,se.height,1,ye,Ve,Ae)}b.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,se.width,se.height,se.depth,ye,Ve,se.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,Se,se.width,se.height,se.depth,0,ye,Ve,se.data);else if(b.isData3DTexture)qe?(et&&t.texStorage3D(n.TEXTURE_3D,be,Se,se.width,se.height,se.depth),V&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,se.width,se.height,se.depth,ye,Ve,se.data)):t.texImage3D(n.TEXTURE_3D,0,Se,se.width,se.height,se.depth,0,ye,Ve,se.data);else if(b.isFramebufferTexture){if(et)if(qe)t.texStorage2D(n.TEXTURE_2D,be,Se,se.width,se.height);else{let ie=se.width,Me=se.height;for(let Ae=0;Ae<be;Ae++)t.texImage2D(n.TEXTURE_2D,Ae,Se,ie,Me,0,ye,Ve,null),ie>>=1,Me>>=1}}else if(b.isHTMLTexture){if("texElementImage2D"in n){let ie=n.canvas;if(ie.hasAttribute("layoutsubtree")||ie.setAttribute("layoutsubtree","true"),se.parentNode!==ie){ie.appendChild(se),u.add(b),ie.onpaint=Me=>{let Ae=Me.changedElements;for(let he of u)Ae.includes(he.image)&&(he.needsUpdate=!0)},ie.requestPaint();return}if(n.texElementImage2D.length===3)n.texElementImage2D(n.TEXTURE_2D,n.RGBA8,se);else{let Ae=n.RGBA,he=n.RGBA,He=n.UNSIGNED_BYTE;n.texElementImage2D(n.TEXTURE_2D,0,Ae,he,He,se)}n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE)}}else if(Ge.length>0){if(qe&&et){let ie=Ke(Ge[0]);t.texStorage2D(n.TEXTURE_2D,be,Se,ie.width,ie.height)}for(let ie=0,Me=Ge.length;ie<Me;ie++)ve=Ge[ie],qe?V&&t.texSubImage2D(n.TEXTURE_2D,ie,0,0,ye,Ve,ve):t.texImage2D(n.TEXTURE_2D,ie,Se,ye,Ve,ve);b.generateMipmaps=!1}else if(qe){if(et){let ie=Ke(se);t.texStorage2D(n.TEXTURE_2D,be,Se,ie.width,ie.height)}V&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,ye,Ve,se)}else t.texImage2D(n.TEXTURE_2D,0,Se,ye,Ve,se);g(b)&&T($),_e.__version=me.version,b.onUpdate&&b.onUpdate(b)}L.__version=b.version}function De(L,b,H){if(b.image.length!==6)return;let $=Xe(L,b),j=b.source;t.bindTexture(n.TEXTURE_CUBE_MAP,L.__webglTexture,n.TEXTURE0+H);let me=i.get(j);if(j.version!==me.__version||$===!0){t.activeTexture(n.TEXTURE0+H);let _e=rt.getPrimaries(rt.workingColorSpace),ee=b.colorSpace===Ft?null:rt.getPrimaries(b.colorSpace),se=b.colorSpace===Ft||_e===ee?n.NONE:n.BROWSER_DEFAULT_WEBGL;t.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,b.flipY),t.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),t.pixelStorei(n.UNPACK_ALIGNMENT,b.unpackAlignment),t.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,se);let ye=b.isCompressedTexture||b.image[0].isCompressedTexture,Ve=b.image[0]&&b.image[0].isDataTexture,Se=[];for(let he=0;he<6;he++)!ye&&!Ve?Se[he]=p(b.image[he],!0,s.maxCubemapSize):Se[he]=Ve?b.image[he].image:b.image[he],Se[he]=Ce(b,Se[he]);let ve=Se[0],Ge=r.convert(b.format,b.colorSpace),qe=r.convert(b.type),et=v(b.internalFormat,Ge,qe,b.normalized,b.colorSpace),V=b.isVideoTexture!==!0,be=me.__version===void 0||$===!0,ie=j.dataReady,Me=E(b,ve);$e(n.TEXTURE_CUBE_MAP,b);let Ae;if(ye){V&&be&&t.texStorage2D(n.TEXTURE_CUBE_MAP,Me,et,ve.width,ve.height);for(let he=0;he<6;he++){Ae=Se[he].mipmaps;for(let He=0;He<Ae.length;He++){let Be=Ae[He];b.format!==Kn?Ge!==null?V?ie&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+he,He,0,0,Be.width,Be.height,Ge,Be.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+he,He,et,Be.width,Be.height,0,Be.data):ke("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):V?ie&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+he,He,0,0,Be.width,Be.height,Ge,qe,Be.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+he,He,et,Be.width,Be.height,0,Ge,qe,Be.data)}}}else{if(Ae=b.mipmaps,V&&be){Ae.length>0&&Me++;let he=Ke(Se[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,Me,et,he.width,he.height)}for(let he=0;he<6;he++)if(Ve){V?ie&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+he,0,0,0,Se[he].width,Se[he].height,Ge,qe,Se[he].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+he,0,et,Se[he].width,Se[he].height,0,Ge,qe,Se[he].data);for(let He=0;He<Ae.length;He++){let Ct=Ae[He].image[he].image;V?ie&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+he,He+1,0,0,Ct.width,Ct.height,Ge,qe,Ct.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+he,He+1,et,Ct.width,Ct.height,0,Ge,qe,Ct.data)}}else{V?ie&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+he,0,0,0,Ge,qe,Se[he]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+he,0,et,Ge,qe,Se[he]);for(let He=0;He<Ae.length;He++){let Be=Ae[He];V?ie&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+he,He+1,0,0,Ge,qe,Be.image[he]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+he,He+1,et,Ge,qe,Be.image[he])}}}g(b)&&T(n.TEXTURE_CUBE_MAP),me.__version=j.version,b.onUpdate&&b.onUpdate(b)}L.__version=b.version}function pe(L,b,H,$,j,me){let _e=r.convert(H.format,H.colorSpace),ee=r.convert(H.type),se=v(H.internalFormat,_e,ee,H.normalized,H.colorSpace),ye=i.get(b),Ve=i.get(H);if(Ve.__renderTarget=b,!ye.__hasExternalTextures){let Se=Math.max(1,b.width>>me),ve=Math.max(1,b.height>>me);j===n.TEXTURE_3D||j===n.TEXTURE_2D_ARRAY?t.texImage3D(j,me,se,Se,ve,b.depth,0,_e,ee,null):t.texImage2D(j,me,se,Se,ve,0,_e,ee,null)}t.bindFramebuffer(n.FRAMEBUFFER,L),Re(b)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,$,j,Ve.__webglTexture,0,re(b)):(j===n.TEXTURE_2D||j>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&j<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,$,j,Ve.__webglTexture,me),t.bindFramebuffer(n.FRAMEBUFFER,null)}function xe(L,b,H){if(n.bindRenderbuffer(n.RENDERBUFFER,L),b.depthBuffer){let $=b.depthTexture,j=$&&$.isDepthTexture?$.type:null,me=M(b.stencilBuffer,j),_e=b.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;Re(b)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,re(b),me,b.width,b.height):H?n.renderbufferStorageMultisample(n.RENDERBUFFER,re(b),me,b.width,b.height):n.renderbufferStorage(n.RENDERBUFFER,me,b.width,b.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,_e,n.RENDERBUFFER,L)}else{let $=b.textures;for(let j=0;j<$.length;j++){let me=$[j],_e=r.convert(me.format,me.colorSpace),ee=r.convert(me.type),se=v(me.internalFormat,_e,ee,me.normalized,me.colorSpace);Re(b)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,re(b),se,b.width,b.height):H?n.renderbufferStorageMultisample(n.RENDERBUFFER,re(b),se,b.width,b.height):n.renderbufferStorage(n.RENDERBUFFER,se,b.width,b.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function Ze(L,b,H){let $=b.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(n.FRAMEBUFFER,L),!(b.depthTexture&&b.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let j=i.get(b.depthTexture);if(j.__renderTarget=b,(!j.__webglTexture||b.depthTexture.image.width!==b.width||b.depthTexture.image.height!==b.height)&&(b.depthTexture.image.width=b.width,b.depthTexture.image.height=b.height,b.depthTexture.needsUpdate=!0),$){if(j.__webglInit===void 0&&(j.__webglInit=!0,b.depthTexture.addEventListener("dispose",A)),j.__webglTexture===void 0){j.__webglTexture=n.createTexture(),t.bindTexture(n.TEXTURE_CUBE_MAP,j.__webglTexture),$e(n.TEXTURE_CUBE_MAP,b.depthTexture);let ye=r.convert(b.depthTexture.format),Ve=r.convert(b.depthTexture.type),Se;b.depthTexture.format===Ti?Se=n.DEPTH_COMPONENT24:b.depthTexture.format===Rs&&(Se=n.DEPTH24_STENCIL8);for(let ve=0;ve<6;ve++)n.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ve,0,Se,b.width,b.height,0,ye,Ve,null)}}else J(b.depthTexture,0);let me=j.__webglTexture,_e=re(b),ee=$?n.TEXTURE_CUBE_MAP_POSITIVE_X+H:n.TEXTURE_2D,se=b.depthTexture.format===Rs?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;if(b.depthTexture.format===Ti)Re(b)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,se,ee,me,0,_e):n.framebufferTexture2D(n.FRAMEBUFFER,se,ee,me,0);else if(b.depthTexture.format===Rs)Re(b)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,se,ee,me,0,_e):n.framebufferTexture2D(n.FRAMEBUFFER,se,ee,me,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function te(L){let b=i.get(L),H=L.isWebGLCubeRenderTarget===!0;if(b.__boundDepthTexture!==L.depthTexture){let $=L.depthTexture;if(b.__depthDisposeCallback&&b.__depthDisposeCallback(),$){let j=()=>{delete b.__boundDepthTexture,delete b.__depthDisposeCallback,$.removeEventListener("dispose",j)};$.addEventListener("dispose",j),b.__depthDisposeCallback=j}b.__boundDepthTexture=$}if(L.depthTexture&&!b.__autoAllocateDepthBuffer)if(H)for(let $=0;$<6;$++)Ze(b.__webglFramebuffer[$],L,$);else{let $=L.texture.mipmaps;$&&$.length>0?Ze(b.__webglFramebuffer[0],L,0):Ze(b.__webglFramebuffer,L,0)}else if(H){b.__webglDepthbuffer=[];for(let $=0;$<6;$++)if(t.bindFramebuffer(n.FRAMEBUFFER,b.__webglFramebuffer[$]),b.__webglDepthbuffer[$]===void 0)b.__webglDepthbuffer[$]=n.createRenderbuffer(),xe(b.__webglDepthbuffer[$],L,!1);else{let j=L.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,me=b.__webglDepthbuffer[$];n.bindRenderbuffer(n.RENDERBUFFER,me),n.framebufferRenderbuffer(n.FRAMEBUFFER,j,n.RENDERBUFFER,me)}}else{let $=L.texture.mipmaps;if($&&$.length>0?t.bindFramebuffer(n.FRAMEBUFFER,b.__webglFramebuffer[0]):t.bindFramebuffer(n.FRAMEBUFFER,b.__webglFramebuffer),b.__webglDepthbuffer===void 0)b.__webglDepthbuffer=n.createRenderbuffer(),xe(b.__webglDepthbuffer,L,!1);else{let j=L.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,me=b.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,me),n.framebufferRenderbuffer(n.FRAMEBUFFER,j,n.RENDERBUFFER,me)}}t.bindFramebuffer(n.FRAMEBUFFER,null)}function le(L,b,H){let $=i.get(L);b!==void 0&&pe($.__webglFramebuffer,L,L.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),H!==void 0&&te(L)}function ue(L){let b=L.texture,H=i.get(L),$=i.get(b);L.addEventListener("dispose",y);let j=L.textures,me=L.isWebGLCubeRenderTarget===!0,_e=j.length>1;if(_e||($.__webglTexture===void 0&&($.__webglTexture=n.createTexture()),$.__version=b.version,o.memory.textures++),me){H.__webglFramebuffer=[];for(let ee=0;ee<6;ee++)if(b.mipmaps&&b.mipmaps.length>0){H.__webglFramebuffer[ee]=[];for(let se=0;se<b.mipmaps.length;se++)H.__webglFramebuffer[ee][se]=n.createFramebuffer()}else H.__webglFramebuffer[ee]=n.createFramebuffer()}else{if(b.mipmaps&&b.mipmaps.length>0){H.__webglFramebuffer=[];for(let ee=0;ee<b.mipmaps.length;ee++)H.__webglFramebuffer[ee]=n.createFramebuffer()}else H.__webglFramebuffer=n.createFramebuffer();if(_e)for(let ee=0,se=j.length;ee<se;ee++){let ye=i.get(j[ee]);ye.__webglTexture===void 0&&(ye.__webglTexture=n.createTexture(),o.memory.textures++)}if(L.samples>0&&Re(L)===!1){H.__webglMultisampledFramebuffer=n.createFramebuffer(),H.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,H.__webglMultisampledFramebuffer);for(let ee=0;ee<j.length;ee++){let se=j[ee];H.__webglColorRenderbuffer[ee]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,H.__webglColorRenderbuffer[ee]);let ye=r.convert(se.format,se.colorSpace),Ve=r.convert(se.type),Se=v(se.internalFormat,ye,Ve,se.normalized,se.colorSpace,L.isXRRenderTarget===!0),ve=re(L);n.renderbufferStorageMultisample(n.RENDERBUFFER,ve,Se,L.width,L.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ee,n.RENDERBUFFER,H.__webglColorRenderbuffer[ee])}n.bindRenderbuffer(n.RENDERBUFFER,null),L.depthBuffer&&(H.__webglDepthRenderbuffer=n.createRenderbuffer(),xe(H.__webglDepthRenderbuffer,L,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(me){t.bindTexture(n.TEXTURE_CUBE_MAP,$.__webglTexture),$e(n.TEXTURE_CUBE_MAP,b);for(let ee=0;ee<6;ee++)if(b.mipmaps&&b.mipmaps.length>0)for(let se=0;se<b.mipmaps.length;se++)pe(H.__webglFramebuffer[ee][se],L,b,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+ee,se);else pe(H.__webglFramebuffer[ee],L,b,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0);g(b)&&T(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(_e){for(let ee=0,se=j.length;ee<se;ee++){let ye=j[ee],Ve=i.get(ye),Se=n.TEXTURE_2D;(L.isWebGL3DRenderTarget||L.isWebGLArrayRenderTarget)&&(Se=L.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(Se,Ve.__webglTexture),$e(Se,ye),pe(H.__webglFramebuffer,L,ye,n.COLOR_ATTACHMENT0+ee,Se,0),g(ye)&&T(Se)}t.unbindTexture()}else{let ee=n.TEXTURE_2D;if((L.isWebGL3DRenderTarget||L.isWebGLArrayRenderTarget)&&(ee=L.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(ee,$.__webglTexture),$e(ee,b),b.mipmaps&&b.mipmaps.length>0)for(let se=0;se<b.mipmaps.length;se++)pe(H.__webglFramebuffer[se],L,b,n.COLOR_ATTACHMENT0,ee,se);else pe(H.__webglFramebuffer,L,b,n.COLOR_ATTACHMENT0,ee,0);g(b)&&T(ee),t.unbindTexture()}L.depthBuffer&&te(L)}function ce(L){let b=L.textures;for(let H=0,$=b.length;H<$;H++){let j=b[H];if(g(j)){let me=x(L),_e=i.get(j).__webglTexture;t.bindTexture(me,_e),T(me),t.unbindTexture()}}}let fe=[],Le=[];function G(L){if(L.samples>0){if(Re(L)===!1){let b=L.textures,H=L.width,$=L.height,j=n.COLOR_BUFFER_BIT,me=L.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,_e=i.get(L),ee=b.length>1;if(ee)for(let ye=0;ye<b.length;ye++)t.bindFramebuffer(n.FRAMEBUFFER,_e.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ye,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,_e.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+ye,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,_e.__webglMultisampledFramebuffer);let se=L.texture.mipmaps;se&&se.length>0?t.bindFramebuffer(n.DRAW_FRAMEBUFFER,_e.__webglFramebuffer[0]):t.bindFramebuffer(n.DRAW_FRAMEBUFFER,_e.__webglFramebuffer);for(let ye=0;ye<b.length;ye++){if(L.resolveDepthBuffer&&(L.depthBuffer&&(j|=n.DEPTH_BUFFER_BIT),L.stencilBuffer&&L.resolveStencilBuffer&&(j|=n.STENCIL_BUFFER_BIT)),ee){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,_e.__webglColorRenderbuffer[ye]);let Ve=i.get(b[ye]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,Ve,0)}n.blitFramebuffer(0,0,H,$,0,0,H,$,j,n.NEAREST),l===!0&&(fe.length=0,Le.length=0,fe.push(n.COLOR_ATTACHMENT0+ye),L.depthBuffer&&L.storeMultisampledDepthBuffer===!1&&(fe.push(me),Le.push(me),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,Le)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,fe))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),ee)for(let ye=0;ye<b.length;ye++){t.bindFramebuffer(n.FRAMEBUFFER,_e.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ye,n.RENDERBUFFER,_e.__webglColorRenderbuffer[ye]);let Ve=i.get(b[ye]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,_e.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+ye,n.TEXTURE_2D,Ve,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,_e.__webglMultisampledFramebuffer)}else if(L.depthBuffer&&L.storeMultisampledDepthBuffer===!1&&l){let b=L.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[b])}}}function re(L){return Math.min(s.maxSamples,L.samples)}function Re(L){let b=i.get(L);return L.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&b.__useRenderToTexture!==!1}function U(L){let b=o.render.frame;h.get(L)!==b&&(h.set(L,b),L.update())}function Ce(L,b){let H=L.colorSpace,$=L.format,j=L.type;return L.isCompressedTexture===!0||L.isVideoTexture===!0||H!==_n&&H!==Ft&&(rt.getTransfer(H)===yt?($!==Kn||j!==Wn)&&ke("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Ye("WebGLTextures: Unsupported texture color space:",H)),b}function Ke(L){return typeof HTMLImageElement<"u"&&L instanceof HTMLImageElement?(c.width=L.naturalWidth||L.width,c.height=L.naturalHeight||L.height):typeof VideoFrame<"u"&&L instanceof VideoFrame?(c.width=L.displayWidth,c.height=L.displayHeight):(c.width=L.width,c.height=L.height),c}this.allocateTextureUnit=O,this.resetTextureUnits=R,this.getTextureUnits=P,this.setTextureUnits=N,this.setTexture2D=J,this.setTexture2DArray=z,this.setTexture3D=B,this.setTextureCube=W,this.rebindTextures=le,this.setupRenderTarget=ue,this.updateRenderTargetMipmap=ce,this.updateMultisampleRenderTarget=G,this.setupDepthRenderbuffer=te,this.setupFrameBufferTexture=pe,this.useMultisampledRTT=Re,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function rM(n,e){function t(i,s=Ft){let r,o=rt.getTransfer(s);if(i===Wn)return n.UNSIGNED_BYTE;if(i===Al)return n.UNSIGNED_SHORT_4_4_4_4;if(i===Rl)return n.UNSIGNED_SHORT_5_5_5_1;if(i===eu)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===tu)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===jh)return n.BYTE;if(i===Qh)return n.SHORT;if(i===Xr)return n.UNSIGNED_SHORT;if(i===El)return n.INT;if(i===mi)return n.UNSIGNED_INT;if(i===An)return n.FLOAT;if(i===Fn)return n.HALF_FLOAT;if(i===nu)return n.ALPHA;if(i===iu)return n.RGB;if(i===Kn)return n.RGBA;if(i===Ti)return n.DEPTH_COMPONENT;if(i===Rs)return n.DEPTH_STENCIL;if(i===Cl)return n.RED;if(i===Pl)return n.RED_INTEGER;if(i===Cs)return n.RG;if(i===Il)return n.RG_INTEGER;if(i===Ll)return n.RGBA_INTEGER;if(i===Zo||i===Ko||i===Jo||i===jo)if(o===yt)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===Zo)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Ko)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Jo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===jo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===Zo)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Ko)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Jo)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===jo)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Dl||i===Nl||i===Ul||i===Fl)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===Dl)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Nl)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Ul)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Fl)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Ol||i===Bl||i===kl||i===zl||i===Vl||i===Qo||i===Gl)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(i===Ol||i===Bl)return o===yt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===kl)return o===yt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(i===zl)return r.COMPRESSED_R11_EAC;if(i===Vl)return r.COMPRESSED_SIGNED_R11_EAC;if(i===Qo)return r.COMPRESSED_RG11_EAC;if(i===Gl)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===Hl||i===Wl||i===Xl||i===ql||i===Yl||i===$l||i===Zl||i===Kl||i===Jl||i===jl||i===Ql||i===ec||i===tc||i===nc)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(i===Hl)return o===yt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Wl)return o===yt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Xl)return o===yt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===ql)return o===yt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Yl)return o===yt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===$l)return o===yt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Zl)return o===yt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Kl)return o===yt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Jl)return o===yt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===jl)return o===yt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Ql)return o===yt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===ec)return o===yt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===tc)return o===yt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===nc)return o===yt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===ic||i===sc||i===rc)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(i===ic)return o===yt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===sc)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===rc)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===oc||i===ac||i===ea||i===lc)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(i===oc)return r.COMPRESSED_RED_RGTC1_EXT;if(i===ac)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===ea)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===lc)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===qr?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}var oM=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,aM=`
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

}`,Eu=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let i=new Po(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,i=new pn({vertexShader:oM,fragmentShader:aM,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new ge(new En(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Au=class extends ui{constructor(e,t){super();let i=this,s=null,r=1,o=null,a="local-floor",l=1,c=null,h=null,u=null,d=null,f=null,m=null,_=typeof XRWebGLBinding<"u",p=new Eu,g={},T=t.getContextAttributes(),x=null,v=null,M=[],E=[],A=new ae,y=null,S=null,I=new tn;I.viewport=new Mt;let D=new tn;D.viewport=new Mt;let F=[I,D],R=new Sl,P=null,N=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Z){let Q=M[Z];return Q===void 0&&(Q=new Lr,M[Z]=Q),Q.getTargetRaySpace()},this.getControllerGrip=function(Z){let Q=M[Z];return Q===void 0&&(Q=new Lr,M[Z]=Q),Q.getGripSpace()},this.getHand=function(Z){let Q=M[Z];return Q===void 0&&(Q=new Lr,M[Z]=Q),Q.getHandSpace()};function O(Z){let Q=E.indexOf(Z.inputSource);if(Q===-1)return;let de=M[Q];de!==void 0&&(de.update(Z.inputSource,Z.frame,c||o),de.dispatchEvent({type:Z.type,data:Z.inputSource}))}function X(){s.removeEventListener("select",O),s.removeEventListener("selectstart",O),s.removeEventListener("selectend",O),s.removeEventListener("squeeze",O),s.removeEventListener("squeezestart",O),s.removeEventListener("squeezeend",O),s.removeEventListener("end",X),s.removeEventListener("inputsourceschange",J);for(let Z=0;Z<M.length;Z++){let Q=E[Z];Q!==null&&(E[Z]=null,M[Z].disconnect(Q))}P=null,N=null,p.reset();for(let Z in g)delete g[Z];if(e.setRenderTarget(x),f=null,d=null,u=null,s=null,v=null,Xe.stop(),i.isPresenting=!1,e.setPixelRatio(y),e.setSize(A.width,A.height,!1),S!==null){let Z=S.camera;Z.fov=S.fov,Z.zoom=S.zoom,Z.updateProjectionMatrix(),S=null}i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Z){r=Z,i.isPresenting===!0&&ke("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Z){a=Z,i.isPresenting===!0&&ke("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(Z){c=Z},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u===null&&_&&(u=new XRWebGLBinding(s,t)),u},this.getFrame=function(){return m},this.getSession=function(){return s},this.setSession=async function(Z){if(s=Z,s!==null){if(x=e.getRenderTarget(),s.addEventListener("select",O),s.addEventListener("selectstart",O),s.addEventListener("selectend",O),s.addEventListener("squeeze",O),s.addEventListener("squeezestart",O),s.addEventListener("squeezeend",O),s.addEventListener("end",X),s.addEventListener("inputsourceschange",J),T.xrCompatible!==!0&&await t.makeXRCompatible(),y=e.getPixelRatio(),e.getSize(A),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let de=null,De=null,pe=null;T.depth&&(pe=T.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,de=T.stencil?Rs:Ti,De=T.stencil?qr:mi);let xe={colorFormat:t.RGBA8,depthFormat:pe,scaleFactor:r};u=this.getBinding(),d=u.createProjectionLayer(xe),s.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),v=new Bn(d.textureWidth,d.textureHeight,{format:Kn,type:Wn,depthTexture:new vs(d.textureWidth,d.textureHeight,De,void 0,void 0,void 0,void 0,void 0,void 0,de),stencilBuffer:T.stencil,colorSpace:e.outputColorSpace,samples:T.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}else{let de={antialias:T.antialias,alpha:!0,depth:T.depth,stencil:T.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,t,de),s.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),v=new Bn(f.framebufferWidth,f.framebufferHeight,{format:Kn,type:Wn,colorSpace:e.outputColorSpace,stencilBuffer:T.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await s.requestReferenceSpace(a),Xe.setContext(s),Xe.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return p.getDepthTexture()};function J(Z){for(let Q=0;Q<Z.removed.length;Q++){let de=Z.removed[Q],De=E.indexOf(de);De>=0&&(E[De]=null,M[De].disconnect(de))}for(let Q=0;Q<Z.added.length;Q++){let de=Z.added[Q],De=E.indexOf(de);if(De===-1){for(let xe=0;xe<M.length;xe++)if(xe>=E.length){E.push(de),De=xe;break}else if(E[xe]===null){E[xe]=de,De=xe;break}if(De===-1)break}let pe=M[De];pe&&pe.connect(de)}}let z=new C,B=new C;function W(Z,Q,de){z.setFromMatrixPosition(Q.matrixWorld),B.setFromMatrixPosition(de.matrixWorld);let De=z.distanceTo(B),pe=Q.projectionMatrix.elements,xe=de.projectionMatrix.elements,Ze=pe[14]/(pe[10]-1),te=pe[14]/(pe[10]+1),le=(pe[9]+1)/pe[5],ue=(pe[9]-1)/pe[5],ce=(pe[8]-1)/pe[0],fe=(xe[8]+1)/xe[0],Le=Ze*ce,G=Ze*fe,re=De/(-ce+fe),Re=re*-ce;if(Q.matrixWorld.decompose(Z.position,Z.quaternion,Z.scale),Z.translateX(Re),Z.translateZ(re),Z.matrixWorld.compose(Z.position,Z.quaternion,Z.scale),Z.matrixWorldInverse.copy(Z.matrixWorld).invert(),pe[10]===-1)Z.projectionMatrix.copy(Q.projectionMatrix),Z.projectionMatrixInverse.copy(Q.projectionMatrixInverse);else{let U=Ze+re,Ce=te+re,Ke=Le-Re,L=G+(De-Re),b=le*te/Ce*U,H=ue*te/Ce*U;Z.projectionMatrix.makePerspective(Ke,L,b,H,U,Ce),Z.projectionMatrixInverse.copy(Z.projectionMatrix).invert()}}function ne(Z,Q){Q===null?Z.matrixWorld.copy(Z.matrix):Z.matrixWorld.multiplyMatrices(Q.matrixWorld,Z.matrix),Z.matrixWorldInverse.copy(Z.matrixWorld).invert()}this.updateCamera=function(Z){if(s===null)return;let Q=Z.near,de=Z.far;p.texture!==null&&(p.depthNear>0&&(Q=p.depthNear),p.depthFar>0&&(de=p.depthFar)),R.near=D.near=I.near=Q,R.far=D.far=I.far=de,(P!==R.near||N!==R.far)&&(s.updateRenderState({depthNear:R.near,depthFar:R.far}),P=R.near,N=R.far),R.layers.mask=Z.layers.mask|6,I.layers.mask=R.layers.mask&-5,D.layers.mask=R.layers.mask&-3;let De=Z.parent,pe=R.cameras;ne(R,De);for(let xe=0;xe<pe.length;xe++)ne(pe[xe],De);pe.length===2?W(R,I,D):R.projectionMatrix.copy(I.projectionMatrix),S===null&&Z.isPerspectiveCamera&&(S={camera:Z,fov:Z.fov,zoom:Z.zoom}),oe(Z,R,De)};function oe(Z,Q,de){de===null?Z.matrix.copy(Q.matrixWorld):(Z.matrix.copy(de.matrixWorld),Z.matrix.invert(),Z.matrix.multiply(Q.matrixWorld)),Z.matrix.decompose(Z.position,Z.quaternion,Z.scale),Z.updateMatrixWorld(!0),Z.projectionMatrix.copy(Q.projectionMatrix),Z.projectionMatrixInverse.copy(Q.projectionMatrixInverse),Z.isPerspectiveCamera&&(Z.fov=Hs*2*Math.atan(1/Z.projectionMatrix.elements[5]),Z.zoom=1)}this.getCamera=function(){return R},this.getFoveation=function(){if(!(d===null&&f===null))return l},this.setFoveation=function(Z){l=Z,d!==null&&(d.fixedFoveation=Z),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=Z)},this.hasDepthSensing=function(){return p.texture!==null},this.getDepthSensingMesh=function(){return p.getMesh(R)},this.getCameraTexture=function(Z){return g[Z]};let Ue=null;function $e(Z,Q){if(h=Q.getViewerPose(c||o),m=Q,h!==null){let de=h.views;f!==null&&(e.setRenderTargetFramebuffer(v,f.framebuffer),e.setRenderTarget(v));let De=!1;de.length!==R.cameras.length&&(R.cameras.length=0,De=!0);for(let te=0;te<de.length;te++){let le=de[te],ue=null;if(f!==null)ue=f.getViewport(le);else{let fe=u.getViewSubImage(d,le);ue=fe.viewport,te===0&&(e.setRenderTargetTextures(v,fe.colorTexture,fe.depthStencilTexture),e.setRenderTarget(v))}let ce=F[te];ce===void 0&&(ce=new tn,ce.layers.enable(te),ce.viewport=new Mt,F[te]=ce),ce.matrix.fromArray(le.transform.matrix),ce.matrix.decompose(ce.position,ce.quaternion,ce.scale),ce.projectionMatrix.fromArray(le.projectionMatrix),ce.projectionMatrixInverse.copy(ce.projectionMatrix).invert(),ce.viewport.set(ue.x,ue.y,ue.width,ue.height),te===0&&(R.matrix.copy(ce.matrix),R.matrix.decompose(R.position,R.quaternion,R.scale)),De===!0&&R.cameras.push(ce)}let pe=s.enabledFeatures;if(pe&&pe.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&_){u=i.getBinding();let te=u.getDepthInformation(de[0]);te&&te.isValid&&te.texture&&p.init(te,s.renderState)}if(pe&&pe.includes("camera-access")&&_){e.state.unbindTexture(),u=i.getBinding();for(let te=0;te<de.length;te++){let le=de[te].camera;if(le){let ue=g[le];ue||(ue=new Po,g[le]=ue);let ce=u.getCameraImage(le);ue.sourceTexture=ce}}}}for(let de=0;de<M.length;de++){let De=E[de],pe=M[de];De!==null&&pe!==void 0&&pe.update(De,Q,c||o)}Ue&&Ue(Z,Q),Q.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:Q}),m=null}let Xe=new Np;Xe.setAnimationLoop($e),this.setAnimationLoop=function(Z){Ue=Z},this.dispose=function(){}}},lM=new We,zp=new je;zp.set(-1,0,0,0,1,0,0,0,1);function cM(n,e){function t(p,g){p.matrixAutoUpdate===!0&&p.updateMatrix(),g.value.copy(p.matrix)}function i(p,g){g.color.getRGB(p.fogColor.value,cu(n)),g.isFog?(p.fogNear.value=g.near,p.fogFar.value=g.far):g.isFogExp2&&(p.fogDensity.value=g.density)}function s(p,g,T,x,v){g.isNodeMaterial?g.uniformsNeedUpdate=!1:g.isMeshBasicMaterial?r(p,g):g.isMeshLambertMaterial?(r(p,g),g.envMap&&(p.envMapIntensity.value=g.envMapIntensity)):g.isMeshToonMaterial?(r(p,g),u(p,g)):g.isMeshPhongMaterial?(r(p,g),h(p,g),g.envMap&&(p.envMapIntensity.value=g.envMapIntensity)):g.isMeshStandardMaterial?(r(p,g),d(p,g),g.isMeshPhysicalMaterial&&f(p,g,v)):g.isMeshMatcapMaterial?(r(p,g),m(p,g)):g.isMeshDepthMaterial?r(p,g):g.isMeshDistanceMaterial?(r(p,g),_(p,g)):g.isMeshNormalMaterial?r(p,g):g.isLineBasicMaterial?(o(p,g),g.isLineDashedMaterial&&a(p,g)):g.isPointsMaterial?l(p,g,T,x):g.isSpriteMaterial?c(p,g):g.isShadowMaterial?(p.color.value.copy(g.color),p.opacity.value=g.opacity):g.isShaderMaterial&&(g.uniformsNeedUpdate=!1)}function r(p,g){p.opacity.value=g.opacity,g.color&&p.diffuse.value.copy(g.color),g.emissive&&p.emissive.value.copy(g.emissive).multiplyScalar(g.emissiveIntensity),g.map&&(p.map.value=g.map,t(g.map,p.mapTransform)),g.alphaMap&&(p.alphaMap.value=g.alphaMap,t(g.alphaMap,p.alphaMapTransform)),g.bumpMap&&(p.bumpMap.value=g.bumpMap,t(g.bumpMap,p.bumpMapTransform),p.bumpScale.value=g.bumpScale,g.side===vn&&(p.bumpScale.value*=-1)),g.normalMap&&(p.normalMap.value=g.normalMap,t(g.normalMap,p.normalMapTransform),p.normalScale.value.copy(g.normalScale),g.side===vn&&p.normalScale.value.negate()),g.displacementMap&&(p.displacementMap.value=g.displacementMap,t(g.displacementMap,p.displacementMapTransform),p.displacementScale.value=g.displacementScale,p.displacementBias.value=g.displacementBias),g.emissiveMap&&(p.emissiveMap.value=g.emissiveMap,t(g.emissiveMap,p.emissiveMapTransform)),g.specularMap&&(p.specularMap.value=g.specularMap,t(g.specularMap,p.specularMapTransform)),g.alphaTest>0&&(p.alphaTest.value=g.alphaTest);let T=e.get(g),x=T.envMap,v=T.envMapRotation;x&&(p.envMap.value=x,p.envMapRotation.value.setFromMatrix4(lM.makeRotationFromEuler(v)).transpose(),x.isCubeTexture&&x.isRenderTargetTexture===!1&&p.envMapRotation.value.premultiply(zp),p.reflectivity.value=g.reflectivity,p.ior.value=g.ior,p.refractionRatio.value=g.refractionRatio),g.lightMap&&(p.lightMap.value=g.lightMap,p.lightMapIntensity.value=g.lightMapIntensity,t(g.lightMap,p.lightMapTransform)),g.aoMap&&(p.aoMap.value=g.aoMap,p.aoMapIntensity.value=g.aoMapIntensity,t(g.aoMap,p.aoMapTransform))}function o(p,g){p.diffuse.value.copy(g.color),p.opacity.value=g.opacity,g.map&&(p.map.value=g.map,t(g.map,p.mapTransform))}function a(p,g){p.dashSize.value=g.dashSize,p.totalSize.value=g.dashSize+g.gapSize,p.scale.value=g.scale}function l(p,g,T,x){p.diffuse.value.copy(g.color),p.opacity.value=g.opacity,p.size.value=g.size*T,p.scale.value=x*.5,g.map&&(p.map.value=g.map,t(g.map,p.uvTransform)),g.alphaMap&&(p.alphaMap.value=g.alphaMap,t(g.alphaMap,p.alphaMapTransform)),g.alphaTest>0&&(p.alphaTest.value=g.alphaTest)}function c(p,g){p.diffuse.value.copy(g.color),p.opacity.value=g.opacity,p.rotation.value=g.rotation,g.map&&(p.map.value=g.map,t(g.map,p.mapTransform)),g.alphaMap&&(p.alphaMap.value=g.alphaMap,t(g.alphaMap,p.alphaMapTransform)),g.alphaTest>0&&(p.alphaTest.value=g.alphaTest)}function h(p,g){p.specular.value.copy(g.specular),p.shininess.value=Math.max(g.shininess,1e-4)}function u(p,g){g.gradientMap&&(p.gradientMap.value=g.gradientMap)}function d(p,g){p.metalness.value=g.metalness,g.metalnessMap&&(p.metalnessMap.value=g.metalnessMap,t(g.metalnessMap,p.metalnessMapTransform)),p.roughness.value=g.roughness,g.roughnessMap&&(p.roughnessMap.value=g.roughnessMap,t(g.roughnessMap,p.roughnessMapTransform)),g.envMap&&(p.envMapIntensity.value=g.envMapIntensity)}function f(p,g,T){p.ior.value=g.ior,g.sheen>0&&(p.sheenColor.value.copy(g.sheenColor).multiplyScalar(g.sheen),p.sheenRoughness.value=g.sheenRoughness,g.sheenColorMap&&(p.sheenColorMap.value=g.sheenColorMap,t(g.sheenColorMap,p.sheenColorMapTransform)),g.sheenRoughnessMap&&(p.sheenRoughnessMap.value=g.sheenRoughnessMap,t(g.sheenRoughnessMap,p.sheenRoughnessMapTransform))),g.clearcoat>0&&(p.clearcoat.value=g.clearcoat,p.clearcoatRoughness.value=g.clearcoatRoughness,g.clearcoatMap&&(p.clearcoatMap.value=g.clearcoatMap,t(g.clearcoatMap,p.clearcoatMapTransform)),g.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=g.clearcoatRoughnessMap,t(g.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),g.clearcoatNormalMap&&(p.clearcoatNormalMap.value=g.clearcoatNormalMap,t(g.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(g.clearcoatNormalScale),g.side===vn&&p.clearcoatNormalScale.value.negate())),g.dispersion>0&&(p.dispersion.value=g.dispersion),g.retroreflectivity>0&&(p.retroreflectivity.value=g.retroreflectivity),g.iridescence>0&&(p.iridescence.value=g.iridescence,p.iridescenceIOR.value=g.iridescenceIOR,p.iridescenceThicknessMinimum.value=g.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=g.iridescenceThicknessRange[1],g.iridescenceMap&&(p.iridescenceMap.value=g.iridescenceMap,t(g.iridescenceMap,p.iridescenceMapTransform)),g.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=g.iridescenceThicknessMap,t(g.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),g.transmission>0&&(p.transmission.value=g.transmission,p.transmissionSamplerMap.value=T.texture,p.transmissionSamplerSize.value.set(T.width,T.height),g.transmissionMap&&(p.transmissionMap.value=g.transmissionMap,t(g.transmissionMap,p.transmissionMapTransform)),p.thickness.value=g.thickness,g.thicknessMap&&(p.thicknessMap.value=g.thicknessMap,t(g.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=g.attenuationDistance,p.attenuationColor.value.copy(g.attenuationColor)),g.anisotropy>0&&(p.anisotropyVector.value.set(g.anisotropy*Math.cos(g.anisotropyRotation),g.anisotropy*Math.sin(g.anisotropyRotation)),g.anisotropyMap&&(p.anisotropyMap.value=g.anisotropyMap,t(g.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=g.specularIntensity,p.specularColor.value.copy(g.specularColor),g.specularColorMap&&(p.specularColorMap.value=g.specularColorMap,t(g.specularColorMap,p.specularColorMapTransform)),g.specularIntensityMap&&(p.specularIntensityMap.value=g.specularIntensityMap,t(g.specularIntensityMap,p.specularIntensityMapTransform))}function m(p,g){g.matcap&&(p.matcap.value=g.matcap)}function _(p,g){let T=e.get(g).light;p.referencePosition.value.setFromMatrixPosition(T.matrixWorld),p.nearDistance.value=T.shadow.camera.near,p.farDistance.value=T.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function hM(n,e,t,i){let s={},r={},o=[],a=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function l(v,M){let E=M.program;i.uniformBlockBinding(v,E)}function c(v,M){let E=s[v.id];E===void 0&&(p(v),E=h(v),s[v.id]=E,v.addEventListener("dispose",T));let A=M.program;i.updateUBOMapping(v,A);let y=e.render.frame;r[v.id]!==y&&(d(v),r[v.id]=y)}function h(v){let M=u();v.__bindingPointIndex=M;let E=n.createBuffer(),A=v.__size,y=v.usage;return n.bindBuffer(n.UNIFORM_BUFFER,E),n.bufferData(n.UNIFORM_BUFFER,A,y),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,M,E),E}function u(){for(let v=0;v<a;v++)if(o.indexOf(v)===-1)return o.push(v),v;return Ye("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(v){let M=s[v.id],E=v.uniforms,A=v.__cache;n.bindBuffer(n.UNIFORM_BUFFER,M);for(let y=0,S=E.length;y<S;y++){let I=E[y];if(Array.isArray(I))for(let D=0,F=I.length;D<F;D++)f(I[D],y,D,A);else f(I,y,0,A)}n.bindBuffer(n.UNIFORM_BUFFER,null)}function f(v,M,E,A){if(_(v,M,E,A)===!0){let y=v.__offset,S=v.value;if(Array.isArray(S)){let I=0;for(let D=0;D<S.length;D++){let F=S[D],R=g(F);m(F,v.__data,I),typeof F!="number"&&typeof F!="boolean"&&!F.isMatrix3&&!ArrayBuffer.isView(F)&&(I+=R.storage/Float32Array.BYTES_PER_ELEMENT)}}else m(S,v.__data,0);n.bufferSubData(n.UNIFORM_BUFFER,y,v.__data)}}function m(v,M,E){typeof v=="number"||typeof v=="boolean"?M[0]=v:v.isMatrix3?(M[0]=v.elements[0],M[1]=v.elements[1],M[2]=v.elements[2],M[3]=0,M[4]=v.elements[3],M[5]=v.elements[4],M[6]=v.elements[5],M[7]=0,M[8]=v.elements[6],M[9]=v.elements[7],M[10]=v.elements[8],M[11]=0):ArrayBuffer.isView(v)?M.set(new v.constructor(v.buffer,v.byteOffset,M.length)):v.toArray(M,E)}function _(v,M,E,A){let y=v.value,S=M+"_"+E;if(A[S]===void 0)return typeof y=="number"||typeof y=="boolean"?A[S]=y:ArrayBuffer.isView(y)?A[S]=y.slice():A[S]=y.clone(),!0;{let I=A[S];if(typeof y=="number"||typeof y=="boolean"){if(I!==y)return A[S]=y,!0}else{if(ArrayBuffer.isView(y))return!0;if(I.equals(y)===!1)return I.copy(y),!0}}return!1}function p(v){let M=v.uniforms,E=0,A=16;for(let S=0,I=M.length;S<I;S++){let D=Array.isArray(M[S])?M[S]:[M[S]];for(let F=0,R=D.length;F<R;F++){let P=D[F],N=Array.isArray(P.value)?P.value:[P.value];for(let O=0,X=N.length;O<X;O++){let J=N[O],z=g(J),B=E%A,W=B%z.boundary,ne=B+W;E+=W,ne!==0&&A-ne<z.storage&&(E+=A-ne),P.__data=new Float32Array(z.storage/Float32Array.BYTES_PER_ELEMENT),P.__offset=E,E+=z.storage}}}let y=E%A;return y>0&&(E+=A-y),v.__size=E,v.__cache={},this}function g(v){let M={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(M.boundary=4,M.storage=4):v.isVector2?(M.boundary=8,M.storage=8):v.isVector3||v.isColor?(M.boundary=16,M.storage=12):v.isVector4?(M.boundary=16,M.storage=16):v.isMatrix3?(M.boundary=48,M.storage=48):v.isMatrix4?(M.boundary=64,M.storage=64):v.isTexture?ke("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(v)?(M.boundary=16,M.storage=v.byteLength):ke("WebGLRenderer: Unsupported uniform value type.",v),M}function T(v){let M=v.target;M.removeEventListener("dispose",T);let E=o.indexOf(M.__bindingPointIndex);o.splice(E,1),n.deleteBuffer(s[M.id]),delete s[M.id],delete r[M.id]}function x(){for(let v in s)n.deleteBuffer(s[v]);o=[],s={},r={}}return{bind:l,update:c,dispose:x}}var uM=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),Li=null;function dM(){return Li===null&&(Li=new _s(uM,16,16,Cs,Fn),Li.name="DFG_LUT",Li.minFilter=Rt,Li.magFilter=Rt,Li.wrapS=On,Li.wrapT=On,Li.generateMipmaps=!1,Li.needsUpdate=!0),Li}var mc=class{constructor(e={}){let{canvas:t=tp(),context:i=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1,outputBufferType:f=Wn}=e;this.isWebGLRenderer=!0;let m;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");m=i.getContextAttributes().alpha}else m=o;let _=f,p=new Set([Ll,Il,Pl]),g=new Set([Wn,mi,Xr,qr,Al,Rl]),T=new Uint32Array(4),x=new Int32Array(4),v=new C,M=null,E=null,A=[],y=[],S=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=pi,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let I=this,D=!1,F=null,R=null,P=null,N=null;this._outputColorSpace=nt;let O=0,X=0,J=null,z=-1,B=null,W=new Mt,ne=new Mt,oe=null,Ue=new Ne(0),$e=0,Xe=t.width,Z=t.height,Q=1,de=null,De=null,pe=new Mt(0,0,Xe,Z),xe=new Mt(0,0,Xe,Z),Ze=!1,te=new Fr,le=!1,ue=!1,ce=new We,fe=new C,Le=new Mt,G={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},re=!1;function Re(){return J===null?Q:1}let U=i;function Ce(w,k){return t.getContext(w,k)}let Ke,L,b,H,$,j,me,_e,ee,se,ye,Ve,Se,ve,Ge,qe,et,V,be,ie,Me,Ae,he;try{let w={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${"186"}`),t.addEventListener("webglcontextlost",Ct,!1),t.addEventListener("webglcontextrestored",gt,!1),t.addEventListener("webglcontextcreationerror",ri,!1),U===null){let k="webgl2";if(U=Ce(k,w),U===null)throw Ce(k)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}He()}catch(w){throw t.removeEventListener("webglcontextlost",Ct,!1),t.removeEventListener("webglcontextrestored",gt,!1),t.removeEventListener("webglcontextcreationerror",ri,!1),Ye("WebGLRenderer: "+w.message),w}function He(){Ke=new vv(U),Ke.init(),Me=new rM(U,Ke),L=new cv(U,Ke,e,Me),b=new iM(U,Ke),L.reversedDepthBuffer&&d&&b.buffers.depth.setReversed(!0),R=U.createFramebuffer(),P=U.createFramebuffer(),N=U.createFramebuffer(),H=new xv(U),$=new Hb,j=new sM(U,Ke,b,$,L,Me,H),me=new yv(I),_e=new T0(U),Ae=new av(U,_e),ee=new bv(U,_e,H,Ae),se=new Tv(U,ee,_e,Ae,H),V=new Sv(U,L,j),Ge=new hv($),ye=new Gb(I,me,Ke,L,Ae,Ge),Ve=new cM(I,$),Se=new Xb,ve=new Jb(Ke),et=new ov(I,me,b,se,m,l),qe=new nM(I,se,L),he=new hM(U,H,L,b),be=new lv(U,Ke,H),ie=new Mv(U,Ke,H),H.programs=ye.programs,I.capabilities=L,I.extensions=Ke,I.properties=$,I.renderLists=Se,I.shadowMap=qe,I.state=b,I.info=H}_!==Wn&&(S=new Ev(_,t.width,t.height,a,s,r));let Be=new Au(I,U);this.xr=Be,this.getContext=function(){return U},this.getContextAttributes=function(){return U.getContextAttributes()},this.forceContextLoss=function(){let w=Ke.get("WEBGL_lose_context");w&&w.loseContext()},this.forceContextRestore=function(){let w=Ke.get("WEBGL_lose_context");w&&w.restoreContext()},this.getPixelRatio=function(){return Q},this.setPixelRatio=function(w){w!==void 0&&(Q=w,this.setSize(Xe,Z,!1))},this.getSize=function(w){return w.set(Xe,Z)},this.setSize=function(w,k,K=!0){if(Be.isPresenting){ke("WebGLRenderer: Can't change size while VR device is presenting.");return}Xe=w,Z=k,t.width=Math.floor(w*Q),t.height=Math.floor(k*Q),K===!0&&(t.style.width=w+"px",t.style.height=k+"px"),S!==null&&S.setSize(t.width,t.height),this.setViewport(0,0,w,k)},this.getDrawingBufferSize=function(w){return w.set(Xe*Q,Z*Q).floor()},this.setDrawingBufferSize=function(w,k,K){Xe=w,Z=k,Q=K,t.width=Math.floor(w*K),t.height=Math.floor(k*K),this.setViewport(0,0,w,k)},this.setEffects=function(w){if(_===Wn){Ye("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(w){for(let k=0;k<w.length;k++)if(w[k].isOutputPass===!0){ke("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}S.setEffects(w||[])},this.getCurrentViewport=function(w){return w.copy(W)},this.getViewport=function(w){return w.copy(pe)},this.setViewport=function(w,k,K,q){w.isVector4?pe.set(w.x,w.y,w.z,w.w):pe.set(w,k,K,q),b.viewport(W.copy(pe).multiplyScalar(Q).round())},this.getScissor=function(w){return w.copy(xe)},this.setScissor=function(w,k,K,q){w.isVector4?xe.set(w.x,w.y,w.z,w.w):xe.set(w,k,K,q),b.scissor(ne.copy(xe).multiplyScalar(Q).round())},this.getScissorTest=function(){return Ze},this.setScissorTest=function(w){b.setScissorTest(Ze=w)},this.setOpaqueSort=function(w){de=w},this.setTransparentSort=function(w){De=w},this.getClearColor=function(w){return w.copy(et.getClearColor())},this.setClearColor=function(){et.setClearColor(...arguments)},this.getClearAlpha=function(){return et.getClearAlpha()},this.setClearAlpha=function(){et.setClearAlpha(...arguments)},this.clear=function(w=!0,k=!0,K=!0){let q=0;if(w){let Y=!1;if(J!==null){let Ee=J.texture.format;Y=p.has(Ee)}if(Y){let Ee=J.texture.type,Ie=g.has(Ee),we=et.getClearColor(),Fe=et.getClearAlpha(),ze=we.r,it=we.g,lt=we.b;Ie?(T[0]=ze,T[1]=it,T[2]=lt,T[3]=Fe,U.clearBufferuiv(U.COLOR,0,T)):(x[0]=ze,x[1]=it,x[2]=lt,x[3]=Fe,U.clearBufferiv(U.COLOR,0,x))}else q|=U.COLOR_BUFFER_BIT}k&&(q|=U.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),K&&(q|=U.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),q!==0&&U.clear(q)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(w){w.setRenderer(this),F=w},this.dispose=function(){t.removeEventListener("webglcontextlost",Ct,!1),t.removeEventListener("webglcontextrestored",gt,!1),t.removeEventListener("webglcontextcreationerror",ri,!1),et.dispose(),Se.dispose(),ve.dispose(),$.dispose(),me.dispose(),se.dispose(),Ae.dispose(),he.dispose(),ye.dispose(),Be.dispose(),Be.removeEventListener("sessionstart",bd),Be.removeEventListener("sessionend",Md),Ns.stop()};function Ct(w){w.preventDefault(),bo("WebGLRenderer: Context Lost."),D=!0}function gt(){bo("WebGLRenderer: Context Restored."),D=!1;let w=H.autoReset,k=qe.enabled,K=qe.autoUpdate,q=qe.needsUpdate,Y=qe.type;He(),H.autoReset=w,qe.enabled=k,qe.autoUpdate=K,qe.needsUpdate=q,qe.type=Y}function ri(w){Ye("WebGLRenderer: A WebGL context could not be created. Reason: ",w.statusMessage)}function bi(w){let k=w.target;k.removeEventListener("dispose",bi),Bm(k)}function Bm(w){km(w),$.remove(w)}function km(w){let k=$.get(w).programs;k!==void 0&&(k.forEach(function(K){ye.releaseProgram(K)}),w.isShaderMaterial&&ye.releaseShaderCache(w))}this.renderBufferDirect=function(w,k,K,q,Y,Ee){k===null&&(k=G);let Ie=Y.isMesh&&Y.matrixWorld.determinantAffine()<0,we=Gm(w,k,K,q,Y);b.setMaterial(q,Ie);let Fe=K.index,ze=1;if(q.wireframe===!0){if(Fe=ee.getWireframeAttribute(K),Fe===void 0)return;ze=2}let it=K.drawRange,lt=K.attributes.position,Oe=it.start*ze,_t=(it.start+it.count)*ze;Ee!==null&&(Oe=Math.max(Oe,Ee.start*ze),_t=Math.min(_t,(Ee.start+Ee.count)*ze)),Fe!==null?(Oe=Math.max(Oe,0),_t=Math.min(_t,Fe.count)):lt!=null&&(Oe=Math.max(Oe,0),_t=Math.min(_t,lt.count));let Qt=_t-Oe;if(Qt<0||Qt===1/0)return;Ae.setup(Y,q,we,K,Fe);let Lt,Et=be;if(Fe!==null&&(Lt=_e.get(Fe),Et=ie,Et.setIndex(Lt)),Y.isMesh)q.wireframe===!0?(b.setLineWidth(q.wireframeLinewidth*Re()),Et.setMode(U.LINES)):Et.setMode(U.TRIANGLES);else if(Y.isLine){let xn=q.linewidth;xn===void 0&&(xn=1),b.setLineWidth(xn*Re()),Y.isLineSegments?Et.setMode(U.LINES):Y.isLineLoop?Et.setMode(U.LINE_LOOP):Et.setMode(U.LINE_STRIP)}else Y.isPoints?Et.setMode(U.POINTS):Y.isSprite&&Et.setMode(U.TRIANGLES);if(Y.isBatchedMesh)if(Ke.get("WEBGL_multi_draw"))Et.renderMultiDraw(Y._multiDrawStarts,Y._multiDrawCounts,Y._multiDrawCount);else{let xn=Y._multiDrawStarts,Pe=Y._multiDrawCounts,Dn=Y._multiDrawCount,ht=Fe?_e.get(Fe).bytesPerElement:1,jn=$.get(q).currentProgram.getUniforms();for(let Mi=0;Mi<Dn;Mi++)jn.setValue(U,"_gl_DrawID",Mi),Et.render(xn[Mi]/ht,Pe[Mi])}else if(Y.isInstancedMesh)Et.renderInstances(Oe,Qt,Y.count);else if(K.isInstancedBufferGeometry){let xn=K._maxInstanceCount!==void 0?K._maxInstanceCount:1/0,Pe=Math.min(K.instanceCount,xn);Et.renderInstances(Oe,Qt,Pe)}else Et.render(Oe,Qt)};function vd(w,k,K,q){F!==null&&w.isNodeMaterial&&F.setObject(q,w),le===!0&&Ge.setState(w,K,!1),w.transparent===!0&&w.side===bn&&w.forceSinglePass===!1?(w.side=vn,w.needsUpdate=!0,_a(w,k,q),w.side=Hn,w.needsUpdate=!0,_a(w,k,q),w.side=bn):_a(w,k,q)}this.compile=function(w,k,K=null){K===null&&(K=w),F!==null&&F.renderStart(w,k,K),E=ve.get(K),E.init(k),y.push(E),K.traverseVisible(function(Y){Y.isLight&&Y.layers.test(k.layers)&&(E.pushLight(Y),Y.castShadow&&E.pushShadow(Y))}),w!==K&&w.traverseVisible(function(Y){Y.isLight&&Y.layers.test(k.layers)&&(E.pushLight(Y),Y.castShadow&&E.pushShadow(Y))}),E.setupLights(),F!==null&&F.updateLights(E.state.lightsArray),ue=this.localClippingEnabled,le=Ge.init(this.clippingPlanes,ue),le===!0&&Ge.setGlobalState(this.clippingPlanes,k),F!==null&&qe.render(E.state.shadowsArray,K,k);let q=new Set;return w.traverse(function(Y){if(!(Y.isMesh||Y.isPoints||Y.isLine||Y.isSprite))return;let Ee=Y.material;if(Ee)if(Array.isArray(Ee))for(let Ie=0;Ie<Ee.length;Ie++){let we=Ee[Ie];vd(we,K,k,Y),q.add(we)}else vd(Ee,K,k,Y),q.add(Ee)}),E=y.pop(),F!==null&&F.renderEnd(),q},this.compileAsync=function(w,k,K=null){let q=this.compile(w,k,K);return new Promise(Y=>{function Ee(){if(q.forEach(function(Ie){let Fe=$.get(Ie).currentProgram;(Fe===void 0||Fe.isReady())&&q.delete(Ie)}),q.size===0){Y(w);return}setTimeout(Ee,10)}Ke.get("KHR_parallel_shader_compile")!==null?Ee():setTimeout(Ee,10)})};let $c=null;function zm(w){$c&&$c(w)}function bd(){Ns.stop()}function Md(){Ns.start()}let Ns=new Np;Ns.setAnimationLoop(zm),typeof self<"u"&&Ns.setContext(self),this.setAnimationLoop=function(w){$c=w,Be.setAnimationLoop(w),w===null?Ns.stop():Ns.start()},Be.addEventListener("sessionstart",bd),Be.addEventListener("sessionend",Md),this.render=function(w,k){if(k!==void 0&&k.isCamera!==!0){Ye("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(D===!0)return;F!==null&&F.renderStart(w,k);let K=Be.enabled===!0&&Be.isPresenting===!0,q=S!==null&&(J===null||K)&&S.begin(I,J);if(w.matrixWorldAutoUpdate===!0&&w.updateMatrixWorld(),k.parent===null&&k.matrixWorldAutoUpdate===!0&&k.updateMatrixWorld(),Be.enabled===!0&&Be.isPresenting===!0&&(S===null||S.isCompositing()===!1)&&(Be.cameraAutoUpdate===!0&&Be.updateCamera(k),k=Be.getCamera()),w.isScene===!0&&w.onBeforeRender(I,w,k,J),E=ve.get(w,y.length),E.init(k),E.state.textureUnits=j.getTextureUnits(),y.push(E),ce.multiplyMatrices(k.projectionMatrix,k.matrixWorldInverse),te.setFromProjectionMatrix(ce,hi,k.reversedDepth),ue=this.localClippingEnabled,le=Ge.init(this.clippingPlanes,ue),M=Se.get(w,A.length),M.init(),A.push(M),Be.enabled===!0&&Be.isPresenting===!0){let Ie=I.xr.getDepthSensingMesh();Ie!==null&&Zc(Ie,k,-1/0,I.sortObjects)}Zc(w,k,0,I.sortObjects),M.finish(),F!==null&&F.updateLights(E.state.lightsArray),I.sortObjects===!0&&M.sort(de,De),re=Be.enabled===!1||Be.isPresenting===!1||Be.hasDepthSensing()===!1,re&&et.addToRenderList(M,w),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),le===!0&&Ge.beginShadows();let Y=E.state.shadowsArray;if(qe.render(Y,w,k),le===!0&&Ge.endShadows(),(q&&S.hasRenderPass())===!1){let Ie=M.opaque,we=M.transmissive;if(E.setupLights(),k.isArrayCamera){let Fe=k.cameras;if(we.length>0)for(let ze=0,it=Fe.length;ze<it;ze++){let lt=Fe[ze];Sd(Ie,we,w,lt)}re&&et.render(w);for(let ze=0,it=Fe.length;ze<it;ze++){let lt=Fe[ze];xd(M,w,lt,lt.viewport)}}else we.length>0&&Sd(Ie,we,w,k),re&&et.render(w),xd(M,w,k)}J!==null&&X===0&&(j.updateMultisampleRenderTarget(J),j.updateRenderTargetMipmap(J)),q&&S.end(I),w.isScene===!0&&w.onAfterRender(I,w,k),Ae.resetDefaultState(),z=-1,B=null,y.pop(),y.length>0?(E=y[y.length-1],j.setTextureUnits(E.state.textureUnits),le===!0&&Ge.setGlobalState(I.clippingPlanes,E.state.camera)):E=null,A.pop(),A.length>0?M=A[A.length-1]:M=null,F!==null&&F.renderEnd()};function Zc(w,k,K,q){if(w.visible===!1)return;if(w.layers.test(k.layers)){if(w.isGroup)K=w.renderOrder;else if(w.isLOD)w.autoUpdate===!0&&w.update(k);else if(w.isLightProbeGrid)E.pushLightProbeGrid(w);else if(w.isLight)E.pushLight(w),w.castShadow&&E.pushShadow(w);else if(w.isSprite){if(!w.frustumCulled||w.intersectsFrustum(te)){q&&Le.setFromMatrixPosition(w.matrixWorld).applyMatrix4(ce);let Ie=se.update(w),we=w.material;we.visible&&M.push(w,Ie,we,K,Le.z,null,k)}}else if((w.isMesh||w.isLine||w.isPoints)&&(!w.frustumCulled||w.intersectsFrustum(te))){let Ie=se.update(w),we=w.material;if(q&&(w.boundingSphere!==void 0?(w.boundingSphere===null&&w.computeBoundingSphere(),Le.copy(w.boundingSphere.center)):(Ie.boundingSphere===null&&Ie.computeBoundingSphere(),Le.copy(Ie.boundingSphere.center)),Le.applyMatrix4(w.matrixWorld).applyMatrix4(ce)),Array.isArray(we)){let Fe=Ie.groups;for(let ze=0,it=Fe.length;ze<it;ze++){let lt=Fe[ze],Oe=we[lt.materialIndex];Oe&&Oe.visible&&M.push(w,Ie,Oe,K,Le.z,lt,k)}}else we.visible&&M.push(w,Ie,we,K,Le.z,null,k)}}let Ee=w.children;for(let Ie=0,we=Ee.length;Ie<we;Ie++)Zc(Ee[Ie],k,K,q)}function xd(w,k,K,q){let{opaque:Y,transmissive:Ee,transparent:Ie}=w;E.setupLightsView(K),le===!0&&Ge.setGlobalState(I.clippingPlanes,K),q&&b.viewport(W.copy(q)),Y.length>0&&ga(Y,k,K),Ee.length>0&&ga(Ee,k,K),Ie.length>0&&ga(Ie,k,K),b.buffers.depth.setTest(!0),b.buffers.depth.setMask(!0),b.buffers.color.setMask(!0),b.setPolygonOffset(!1)}function Sd(w,k,K,q){if((K.isScene===!0?K.overrideMaterial:null)!==null)return;if(E.state.transmissionRenderTarget[q.id]===void 0){let Oe=Ke.has("EXT_color_buffer_half_float")||Ke.has("EXT_color_buffer_float");E.state.transmissionRenderTarget[q.id]=new Bn(1,1,{generateMipmaps:!0,type:Oe?Fn:Wn,minFilter:mn,samples:Math.max(4,L.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:rt.workingColorSpace})}let Ee=E.state.transmissionRenderTarget[q.id],Ie=q.viewport||W;Ee.setSize(Ie.z*I.transmissionResolutionScale,Ie.w*I.transmissionResolutionScale);let we=I.getRenderTarget(),Fe=I.getActiveCubeFace(),ze=I.getActiveMipmapLevel();I.setRenderTarget(Ee),I.getClearColor(Ue),$e=I.getClearAlpha(),$e<1&&I.setClearColor(16777215,.5),I.clear(),re&&et.render(K);let it=I.toneMapping;I.toneMapping=pi;let lt=q.viewport;if(q.viewport!==void 0&&(q.viewport=void 0),E.setupLightsView(q),le===!0&&Ge.setGlobalState(I.clippingPlanes,q),ga(w,K,q),j.updateMultisampleRenderTarget(Ee),j.updateRenderTargetMipmap(Ee),Ke.has("WEBGL_multisampled_render_to_texture")===!1){let Oe=!1;for(let _t=0,Qt=k.length;_t<Qt;_t++){let Lt=k[_t],{object:Et,geometry:xn,material:Pe,group:Dn}=Lt;if(Pe.side===bn&&Et.layers.test(q.layers)){let ht=Pe.side;Pe.side=vn,Pe.needsUpdate=!0,Td(Et,K,q,xn,Pe,Dn),Pe.side=ht,Pe.needsUpdate=!0,Oe=!0}}Oe===!0&&(j.updateMultisampleRenderTarget(Ee),j.updateRenderTargetMipmap(Ee))}I.setRenderTarget(we,Fe,ze),I.setClearColor(Ue,$e),lt!==void 0&&(q.viewport=lt),I.toneMapping=it}function ga(w,k,K){let q=k.isScene===!0?k.overrideMaterial:null;for(let Y=0,Ee=w.length;Y<Ee;Y++){let Ie=w[Y],{object:we,geometry:Fe,group:ze}=Ie,it=Ie.material;it.allowOverride===!0&&q!==null&&(it=q),we.layers.test(K.layers)&&Td(we,k,K,Fe,it,ze)}}function Td(w,k,K,q,Y,Ee){F!==null&&Y.isNodeMaterial&&F.setObject(w,Y),w.onBeforeRender(I,k,K,q,Y,Ee),w.modelViewMatrix.multiplyMatrices(K.matrixWorldInverse,w.matrixWorld),w.normalMatrix.getNormalMatrix(w.modelViewMatrix),Y.onBeforeRender(I,k,K,q,w,Ee),Y.transparent===!0&&Y.side===bn&&Y.forceSinglePass===!1?(Y.side=vn,Y.needsUpdate=!0,I.renderBufferDirect(K,k,q,Y,w,Ee),Y.side=Hn,Y.needsUpdate=!0,I.renderBufferDirect(K,k,q,Y,w,Ee),Y.side=bn):I.renderBufferDirect(K,k,q,Y,w,Ee),w.onAfterRender(I,k,K,q,Y,Ee)}function _a(w,k,K){k.isScene!==!0&&(k=G);let q=$.get(w),Y=E.state.lights,Ee=E.state.shadowsArray,Ie=Y.state.version,we=ye.getParameters(w,Y.state,Ee,k,K,E.state.lightProbeGridArray),Fe=ye.getProgramCacheKey(we),ze=q.programs;q.environment=w.isMeshStandardMaterial||w.isMeshLambertMaterial||w.isMeshPhongMaterial?k.environment:null,q.fog=k.fog;let it=w.isMeshStandardMaterial||w.isMeshLambertMaterial&&!w.envMap||w.isMeshPhongMaterial&&!w.envMap;q.envMap=me.get(w.envMap||q.environment,it),q.envMapRotation=q.environment!==null&&w.envMap===null?k.environmentRotation:w.envMapRotation,ze===void 0&&(w.addEventListener("dispose",bi),ze=new Map,q.programs=ze);let lt=ze.get(Fe);if(lt!==void 0){if(q.currentProgram===lt&&q.lightsStateVersion===Ie)return Ed(w,we),lt}else we.uniforms=ye.getUniforms(w),F!==null&&w.isNodeMaterial&&F.build(w,K,we),w.onBeforeCompile(we,I),lt=ye.acquireProgram(we,Fe),ze.set(Fe,lt),q.uniforms=we.uniforms;let Oe=q.uniforms;return(!w.isShaderMaterial&&!w.isRawShaderMaterial||w.clipping===!0)&&(Oe.clippingPlanes=Ge.uniform),Ed(w,we),q.needsLights=Wm(w),q.lightsStateVersion=Ie,q.needsLights&&(Oe.ambientLightColor.value=Y.state.ambient,Oe.lightProbe.value=Y.state.probe,Oe.sunLights.value=Y.state.sun,Oe.sunLightShadows.value=Y.state.sunShadow,Oe.directionalLights.value=Y.state.directional,Oe.directionalLightShadows.value=Y.state.directionalShadow,Oe.spotLights.value=Y.state.spot,Oe.spotLightShadows.value=Y.state.spotShadow,Oe.rectAreaLights.value=Y.state.rectArea,Oe.ltc_1.value=Y.state.rectAreaLTC1,Oe.ltc_2.value=Y.state.rectAreaLTC2,Oe.pointLights.value=Y.state.point,Oe.pointLightShadows.value=Y.state.pointShadow,Oe.hemisphereLights.value=Y.state.hemi,Oe.sunShadowMatrix.value=Y.state.sunShadowMatrix,Oe.sunShadowCascade.value=Y.state.sunShadowCascade,Oe.directionalShadowMatrix.value=Y.state.directionalShadowMatrix,Oe.spotLightMatrix.value=Y.state.spotLightMatrix,Oe.spotLightMap.value=Y.state.spotLightMap,Oe.pointShadowMatrix.value=Y.state.pointShadowMatrix),q.lightProbeGrid=E.state.lightProbeGridArray.length>0,q.currentProgram=lt,q.uniformsList=null,lt}function wd(w){if(w.uniformsList===null){let k=w.currentProgram.getUniforms();w.uniformsList=Kr.seqWithValue(k.seq,w.uniforms)}return w.uniformsList}function Ed(w,k){let K=$.get(w);K.outputColorSpace=k.outputColorSpace,K.batching=k.batching,K.batchingColor=k.batchingColor,K.instancing=k.instancing,K.instancingColor=k.instancingColor,K.instancingMorph=k.instancingMorph,K.skinning=k.skinning,K.morphTargets=k.morphTargets,K.morphNormals=k.morphNormals,K.morphColors=k.morphColors,K.morphTargetsCount=k.morphTargetsCount,K.numClippingPlanes=k.numClippingPlanes,K.numIntersection=k.numClipIntersection,K.vertexAlphas=k.vertexAlphas,K.vertexTangents=k.vertexTangents,K.toneMapping=k.toneMapping}function Vm(w,k){if(w.length===0)return null;if(w.length===1)return w[0].texture!==null?w[0]:null;v.setFromMatrixPosition(k.matrixWorld);for(let K=0,q=w.length;K<q;K++){let Y=w[K];if(Y.texture!==null&&Y.boundingBox.containsPoint(v))return Y}return null}function Gm(w,k,K,q,Y){k.isScene!==!0&&(k=G),j.resetTextureUnits();let Ee=k.fog,Ie=q.isMeshStandardMaterial||q.isMeshLambertMaterial||q.isMeshPhongMaterial?k.environment:null,we=J===null?I.outputColorSpace:J.isXRRenderTarget===!0?J.texture.colorSpace:rt.workingColorSpace,Fe=q.isMeshStandardMaterial||q.isMeshLambertMaterial&&!q.envMap||q.isMeshPhongMaterial&&!q.envMap,ze=me.get(q.envMap||Ie,Fe),it=q.vertexColors===!0&&!!K.attributes.color&&K.attributes.color.itemSize===4,lt=!!K.attributes.tangent&&(!!q.normalMap||q.anisotropy>0),Oe=!!K.morphAttributes.position,_t=!!K.morphAttributes.normal,Qt=!!K.morphAttributes.color,Lt=pi;q.toneMapped&&(J===null||J.isXRRenderTarget===!0)&&(Lt=I.toneMapping);let Et=K.morphAttributes.position||K.morphAttributes.normal||K.morphAttributes.color,xn=Et!==void 0?Et.length:0,Pe=$.get(q),Dn=E.state.lights;if(le===!0&&(ue===!0||w!==B)){let Pt=w===B&&q.id===z;Ge.setState(q,w,Pt)}let ht=!1;q.version===Pe.__version?(Pe.needsLights&&Pe.lightsStateVersion!==Dn.state.version||Pe.outputColorSpace!==we||Y.isBatchedMesh&&Pe.batching===!1||!Y.isBatchedMesh&&Pe.batching===!0||Y.isBatchedMesh&&Pe.batchingColor===!0&&Y._colorsTexture===null||Y.isBatchedMesh&&Pe.batchingColor===!1&&Y._colorsTexture!==null||Y.isInstancedMesh&&Pe.instancing===!1||!Y.isInstancedMesh&&Pe.instancing===!0||Y.isSkinnedMesh&&Pe.skinning===!1||!Y.isSkinnedMesh&&Pe.skinning===!0||Y.isInstancedMesh&&Pe.instancingColor===!0&&Y.instanceColor===null||Y.isInstancedMesh&&Pe.instancingColor===!1&&Y.instanceColor!==null||Y.isInstancedMesh&&Pe.instancingMorph===!0&&Y.morphTexture===null||Y.isInstancedMesh&&Pe.instancingMorph===!1&&Y.morphTexture!==null||Pe.envMap!==ze||q.fog===!0&&Pe.fog!==Ee||Pe.numClippingPlanes!==void 0&&(Pe.numClippingPlanes!==Ge.numPlanes||Pe.numIntersection!==Ge.numIntersection)||Pe.vertexAlphas!==it||Pe.vertexTangents!==lt||Pe.morphTargets!==Oe||Pe.morphNormals!==_t||Pe.morphColors!==Qt||Pe.toneMapping!==Lt||Pe.morphTargetsCount!==xn||!!Pe.lightProbeGrid!=E.state.lightProbeGridArray.length>0)&&(ht=!0):(ht=!0,Pe.__version=q.version);let jn=Pe.currentProgram;ht===!0&&(jn=_a(q,k,Y),F&&q.isNodeMaterial&&F.onUpdateProgram(q,jn,Pe));let Mi=!1,os=!1,lr=!1,Tt=jn.getUniforms(),Xt=Pe.uniforms;if(b.useProgram(jn.program)&&(Mi=!0,os=!0,lr=!0),q.id!==z&&(z=q.id,os=!0),Pe.needsLights){let Pt=Vm(E.state.lightProbeGridArray,Y);Pe.lightProbeGrid!==Pt&&(Pe.lightProbeGrid=Pt,os=!0)}if(Mi||B!==w){b.buffers.depth.getReversed()&&w.reversedDepth!==!0&&(w._reversedDepth=!0,w.updateProjectionMatrix()),Tt.setValue(U,"projectionMatrix",w.projectionMatrix),Tt.setValue(U,"viewMatrix",w.matrixWorldInverse);let ls=Tt.map.cameraPosition;ls!==void 0&&ls.setValue(U,fe.setFromMatrixPosition(w.matrixWorld)),L.logarithmicDepthBuffer&&Tt.setValue(U,"logDepthBufFC",2/(Math.log(w.far+1)/Math.LN2)),(q.isMeshPhongMaterial||q.isMeshToonMaterial||q.isMeshLambertMaterial||q.isMeshBasicMaterial||q.isMeshStandardMaterial||q.isShaderMaterial)&&Tt.setValue(U,"isOrthographic",w.isOrthographicCamera===!0),B!==w&&(B=w,os=!0,lr=!0)}if(Pe.needsLights&&(Dn.state.sunShadowMap.length>0&&Tt.setValue(U,"sunShadowMap",Dn.state.sunShadowMap,j),Dn.state.directionalShadowMap.length>0&&Tt.setValue(U,"directionalShadowMap",Dn.state.directionalShadowMap,j),Dn.state.spotShadowMap.length>0&&Tt.setValue(U,"spotShadowMap",Dn.state.spotShadowMap,j),Dn.state.pointShadowMap.length>0&&Tt.setValue(U,"pointShadowMap",Dn.state.pointShadowMap,j)),Y.isSkinnedMesh){Tt.setOptional(U,Y,"bindMatrix"),Tt.setOptional(U,Y,"bindMatrixInverse");let Pt=Y.skeleton;Pt&&(Pt.boneTexture===null&&Pt.computeBoneTexture(),Tt.setValue(U,"boneTexture",Pt.boneTexture,j))}Y.isBatchedMesh&&(Tt.setOptional(U,Y,"batchingTexture"),Tt.setValue(U,"batchingTexture",Y._matricesTexture,j),Tt.setOptional(U,Y,"batchingIdTexture"),Tt.setValue(U,"batchingIdTexture",Y._indirectTexture,j),Tt.setOptional(U,Y,"batchingColorTexture"),Y._colorsTexture!==null&&Tt.setValue(U,"batchingColorTexture",Y._colorsTexture,j));let as=K.morphAttributes;if((as.position!==void 0||as.normal!==void 0||as.color!==void 0)&&V.update(Y,K,jn),(os||Pe.receiveShadow!==Y.receiveShadow)&&(Pe.receiveShadow=Y.receiveShadow,Tt.setValue(U,"receiveShadow",Y.receiveShadow)),(q.isMeshStandardMaterial||q.isMeshLambertMaterial||q.isMeshPhongMaterial)&&q.envMap===null&&k.environment!==null&&(Xt.envMapIntensity.value=k.environmentIntensity),Xt.dfgLUT!==void 0&&(Xt.dfgLUT.value=dM()),os){if(Tt.setValue(U,"toneMappingExposure",I.toneMappingExposure),Pe.needsLights&&Hm(Xt,lr),Ee&&q.fog===!0&&Ve.refreshFogUniforms(Xt,Ee),Ve.refreshMaterialUniforms(Xt,q,Q,Z,E.state.transmissionRenderTarget[w.id]),Pe.needsLights&&Pe.lightProbeGrid){let Pt=Pe.lightProbeGrid;Xt.probesSH.value=Pt.texture,Xt.probesMin.value.copy(Pt.boundingBox.min),Xt.probesMax.value.copy(Pt.boundingBox.max),Xt.probesResolution.value.copy(Pt.resolution)}Kr.upload(U,wd(Pe),Xt,j)}if(q.isShaderMaterial&&q.uniformsNeedUpdate===!0&&(Kr.upload(U,wd(Pe),Xt,j),q.uniformsNeedUpdate=!1),q.isSpriteMaterial&&Tt.setValue(U,"center",Y.center),Tt.setValue(U,"modelViewMatrix",Y.modelViewMatrix),Tt.setValue(U,"normalMatrix",Y.normalMatrix),Tt.setValue(U,"modelMatrix",Y.matrixWorld),q.uniformsGroups!==void 0){let Pt=q.uniformsGroups;for(let ls=0,cr=Pt.length;ls<cr;ls++){let Rd=Pt[ls];he.update(Rd,jn),he.bind(Rd,jn)}}return jn}function Hm(w,k){w.ambientLightColor.needsUpdate=k,w.lightProbe.needsUpdate=k,w.sunLights.needsUpdate=k,w.sunLightShadows.needsUpdate=k,w.directionalLights.needsUpdate=k,w.directionalLightShadows.needsUpdate=k,w.pointLights.needsUpdate=k,w.pointLightShadows.needsUpdate=k,w.spotLights.needsUpdate=k,w.spotLightShadows.needsUpdate=k,w.rectAreaLights.needsUpdate=k,w.hemisphereLights.needsUpdate=k}function Wm(w){return w.isMeshLambertMaterial||w.isMeshToonMaterial||w.isMeshPhongMaterial||w.isMeshStandardMaterial||w.isShadowMaterial||w.isShaderMaterial&&w.lights===!0}this.getActiveCubeFace=function(){return O},this.getActiveMipmapLevel=function(){return X},this.getRenderTarget=function(){return J},this.setRenderTargetTextures=function(w,k,K){let q=$.get(w);q.__autoAllocateDepthBuffer=w.resolveDepthBuffer===!1,q.__autoAllocateDepthBuffer===!1&&(q.__useRenderToTexture=!1),$.get(w.texture).__webglTexture=k,$.get(w.depthTexture).__webglTexture=q.__autoAllocateDepthBuffer?void 0:K,q.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(w,k){let K=$.get(w);K.__webglFramebuffer=k,K.__useDefaultFramebuffer=k===void 0},this.setRenderTarget=function(w,k=0,K=0){J=w,O=k,X=K;let q=null,Y=!1,Ee=!1;if(w){let we=$.get(w);if(we.__useDefaultFramebuffer!==void 0){b.bindFramebuffer(U.FRAMEBUFFER,we.__webglFramebuffer),W.copy(w.viewport),ne.copy(w.scissor),oe=w.scissorTest,b.viewport(W),b.scissor(ne),b.setScissorTest(oe),z=-1;return}else if(we.__webglFramebuffer===void 0)j.setupRenderTarget(w);else if(we.__hasExternalTextures)j.rebindTextures(w,$.get(w.texture).__webglTexture,$.get(w.depthTexture).__webglTexture);else if(w.depthBuffer){let it=w.depthTexture;if(we.__boundDepthTexture!==it){if(it!==null&&$.has(it)&&(w.width!==it.image.width||w.height!==it.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");j.setupDepthRenderbuffer(w)}}let Fe=w.texture;(Fe.isData3DTexture||Fe.isDataArrayTexture||Fe.isCompressedArrayTexture)&&(Ee=!0);let ze=$.get(w).__webglFramebuffer;w.isWebGLCubeRenderTarget?(Array.isArray(ze[k])?q=ze[k][K]:q=ze[k],Y=!0):w.samples>0&&j.useMultisampledRTT(w)===!1?q=$.get(w).__webglMultisampledFramebuffer:Array.isArray(ze)?q=ze[K]:q=ze,W.copy(w.viewport),ne.copy(w.scissor),oe=w.scissorTest}else W.copy(pe).multiplyScalar(Q).floor(),ne.copy(xe).multiplyScalar(Q).floor(),oe=Ze;if(K!==0&&(q=R),b.bindFramebuffer(U.FRAMEBUFFER,q)&&b.drawBuffers(w,q),b.viewport(W),b.scissor(ne),b.setScissorTest(oe),Y){let we=$.get(w.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_CUBE_MAP_POSITIVE_X+k,we.__webglTexture,K)}else if(Ee){let we=k;for(let Fe=0;Fe<w.textures.length;Fe++){let ze=$.get(w.textures[Fe]);U.framebufferTextureLayer(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0+Fe,ze.__webglTexture,K,we)}}else if(w!==null&&K!==0){let we=$.get(w.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,we.__webglTexture,K)}z=-1};function Ad(w){let k=$.get(w);return(k.__readFormat!==w.format||k.__readType!==w.type)&&(k.__readFormat=w.format,k.__readType=w.type,k.__formatReadable=L.textureFormatReadable(w.format),k.__typeReadable=L.textureTypeReadable(w.type)),k}this.readRenderTargetPixels=function(w,k,K,q,Y,Ee,Ie,we=0){if(!(w&&w.isWebGLRenderTarget)){Ye("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Fe=$.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&Ie!==void 0&&(Fe=Fe[Ie]),Fe){b.bindFramebuffer(U.FRAMEBUFFER,Fe);try{let ze=w.textures[we],it=ze.format,lt=ze.type;w.textures.length>1&&U.readBuffer(U.COLOR_ATTACHMENT0+we);let Oe=Ad(ze);if(Oe.__formatReadable===!1){Ye("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Oe.__typeReadable===!1){Ye("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}k>=0&&k<=w.width-q&&K>=0&&K<=w.height-Y&&U.readPixels(k,K,q,Y,Me.convert(it),Me.convert(lt),Ee)}finally{let ze=J!==null?$.get(J).__webglFramebuffer:null;b.bindFramebuffer(U.FRAMEBUFFER,ze)}}},this.readRenderTargetPixelsAsync=async function(w,k,K,q,Y,Ee,Ie,we=0){if(!(w&&w.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Fe=$.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&Ie!==void 0&&(Fe=Fe[Ie]),Fe)if(k>=0&&k<=w.width-q&&K>=0&&K<=w.height-Y){b.bindFramebuffer(U.FRAMEBUFFER,Fe);let ze=w.textures[we],it=ze.format,lt=ze.type;w.textures.length>1&&U.readBuffer(U.COLOR_ATTACHMENT0+we);let Oe=Ad(ze);if(Oe.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Oe.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let _t=U.createBuffer();U.bindBuffer(U.PIXEL_PACK_BUFFER,_t),U.bufferData(U.PIXEL_PACK_BUFFER,Ee.byteLength,U.STREAM_READ),U.readPixels(k,K,q,Y,Me.convert(it),Me.convert(lt),0),U.bindBuffer(U.PIXEL_PACK_BUFFER,null);let Qt=J!==null?$.get(J).__webglFramebuffer:null;b.bindFramebuffer(U.FRAMEBUFFER,Qt);let Lt=U.fenceSync(U.SYNC_GPU_COMMANDS_COMPLETE,0);return U.flush(),await ip(U,Lt,4),U.bindBuffer(U.PIXEL_PACK_BUFFER,_t),U.getBufferSubData(U.PIXEL_PACK_BUFFER,0,Ee),U.bindBuffer(U.PIXEL_PACK_BUFFER,null),U.deleteBuffer(_t),U.deleteSync(Lt),Ee}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(w,k=null,K=0){let q=Math.pow(2,-K),Y=Math.floor(w.image.width*q),Ee=Math.floor(w.image.height*q),Ie=k!==null?k.x:0,we=k!==null?k.y:0;j.setTexture2D(w,0),U.copyTexSubImage2D(U.TEXTURE_2D,K,0,0,Ie,we,Y,Ee),b.unbindTexture()},this.copyTextureToTexture=function(w,k,K=null,q=null,Y=0,Ee=0){let Ie,we,Fe,ze,it,lt,Oe,_t,Qt,Lt=w.isCompressedTexture?w.mipmaps[Ee]:w.image;if(K!==null)Ie=K.max.x-K.min.x,we=K.max.y-K.min.y,Fe=K.isBox3?K.max.z-K.min.z:1,ze=K.min.x,it=K.min.y,lt=K.isBox3?K.min.z:0;else{let Xt=Math.pow(2,-Y);Ie=Math.floor(Lt.width*Xt),we=Math.floor(Lt.height*Xt),w.isDataArrayTexture?Fe=Lt.depth:w.isData3DTexture?Fe=Math.floor(Lt.depth*Xt):Fe=1,ze=0,it=0,lt=0}q!==null?(Oe=q.x,_t=q.y,Qt=q.z):(Oe=0,_t=0,Qt=0);let Et=Me.convert(k.format),xn=Me.convert(k.type),Pe;k.isData3DTexture?(j.setTexture3D(k,0),Pe=U.TEXTURE_3D):k.isDataArrayTexture||k.isCompressedArrayTexture?(j.setTexture2DArray(k,0),Pe=U.TEXTURE_2D_ARRAY):(j.setTexture2D(k,0),Pe=U.TEXTURE_2D),b.activeTexture(U.TEXTURE0),b.pixelStorei(U.UNPACK_FLIP_Y_WEBGL,k.flipY),b.pixelStorei(U.UNPACK_PREMULTIPLY_ALPHA_WEBGL,k.premultiplyAlpha),b.pixelStorei(U.UNPACK_ALIGNMENT,k.unpackAlignment);let Dn=b.getParameter(U.UNPACK_ROW_LENGTH),ht=b.getParameter(U.UNPACK_IMAGE_HEIGHT),jn=b.getParameter(U.UNPACK_SKIP_PIXELS),Mi=b.getParameter(U.UNPACK_SKIP_ROWS),os=b.getParameter(U.UNPACK_SKIP_IMAGES);b.pixelStorei(U.UNPACK_ROW_LENGTH,Lt.width),b.pixelStorei(U.UNPACK_IMAGE_HEIGHT,Lt.height),b.pixelStorei(U.UNPACK_SKIP_PIXELS,ze),b.pixelStorei(U.UNPACK_SKIP_ROWS,it),b.pixelStorei(U.UNPACK_SKIP_IMAGES,lt);let lr=w.isDataArrayTexture||w.isData3DTexture,Tt=k.isDataArrayTexture||k.isData3DTexture;if(w.isDepthTexture){let Xt=$.get(w),as=$.get(k),Pt=$.get(Xt.__renderTarget),ls=$.get(as.__renderTarget);b.bindFramebuffer(U.READ_FRAMEBUFFER,Pt.__webglFramebuffer),b.bindFramebuffer(U.DRAW_FRAMEBUFFER,ls.__webglFramebuffer);for(let cr=0;cr<Fe;cr++)lr&&(U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,$.get(w).__webglTexture,Y,lt+cr),U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,$.get(k).__webglTexture,Ee,Qt+cr)),U.blitFramebuffer(ze,it,Ie,we,Oe,_t,Ie,we,U.DEPTH_BUFFER_BIT,U.NEAREST);b.bindFramebuffer(U.READ_FRAMEBUFFER,null),b.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else if(Y!==0||w.isRenderTargetTexture||$.has(w)){let Xt=$.get(w),as=$.get(k);b.bindFramebuffer(U.READ_FRAMEBUFFER,P),b.bindFramebuffer(U.DRAW_FRAMEBUFFER,N);for(let Pt=0;Pt<Fe;Pt++)lr?U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,Xt.__webglTexture,Y,lt+Pt):U.framebufferTexture2D(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,Xt.__webglTexture,Y),Tt?U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,as.__webglTexture,Ee,Qt+Pt):U.framebufferTexture2D(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,as.__webglTexture,Ee),Y!==0?U.blitFramebuffer(ze,it,Ie,we,Oe,_t,Ie,we,U.COLOR_BUFFER_BIT,U.NEAREST):Tt?U.copyTexSubImage3D(Pe,Ee,Oe,_t,Qt+Pt,ze,it,Ie,we):U.copyTexSubImage2D(Pe,Ee,Oe,_t,ze,it,Ie,we);b.bindFramebuffer(U.READ_FRAMEBUFFER,null),b.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else Tt?w.isDataTexture||w.isData3DTexture?U.texSubImage3D(Pe,Ee,Oe,_t,Qt,Ie,we,Fe,Et,xn,Lt.data):k.isCompressedArrayTexture?U.compressedTexSubImage3D(Pe,Ee,Oe,_t,Qt,Ie,we,Fe,Et,Lt.data):U.texSubImage3D(Pe,Ee,Oe,_t,Qt,Ie,we,Fe,Et,xn,Lt):w.isDataTexture?U.texSubImage2D(U.TEXTURE_2D,Ee,Oe,_t,Ie,we,Et,xn,Lt.data):w.isCompressedTexture?U.compressedTexSubImage2D(U.TEXTURE_2D,Ee,Oe,_t,Lt.width,Lt.height,Et,Lt.data):U.texSubImage2D(U.TEXTURE_2D,Ee,Oe,_t,Ie,we,Et,xn,Lt);b.pixelStorei(U.UNPACK_ROW_LENGTH,Dn),b.pixelStorei(U.UNPACK_IMAGE_HEIGHT,ht),b.pixelStorei(U.UNPACK_SKIP_PIXELS,jn),b.pixelStorei(U.UNPACK_SKIP_ROWS,Mi),b.pixelStorei(U.UNPACK_SKIP_IMAGES,os),Ee===0&&k.generateMipmaps&&U.generateMipmap(Pe),b.unbindTexture()},this.initRenderTarget=function(w){$.get(w).__webglFramebuffer===void 0&&j.setupRenderTarget(w)},this.initTexture=function(w){w.isCubeTexture?j.setTextureCube(w,0):w.isData3DTexture?j.setTexture3D(w,0):w.isDataArrayTexture||w.isCompressedArrayTexture?j.setTexture2DArray(w,0):j.setTexture2D(w,0),b.unbindTexture()},this.resetState=function(){O=0,X=0,J=null,b.reset(),Ae.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return hi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=rt._getDrawingBufferColorSpace(e),t.unpackColorSpace=rt._getUnpackColorSpace()}};var Vp={type:"change"},Cu={type:"start"},Hp={type:"end"},yc=new wi,Gp=new Un,fM=Math.cos(70*Zt.DEG2RAD),hn=new C,Xn=2*Math.PI,St={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},Ru=1e-6,vc=class extends qo{constructor(e,t=null){super(e,t),this.state=St.NONE,this.target=new C,this.cursor=new C,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Ts.ROTATE,MIDDLE:Ts.DOLLY,RIGHT:Ts.PAN},this.touches={ONE:ws.ROTATE,TWO:ws.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._cursorStyle="auto",this._domElementKeyEvents=null,this._lastPosition=new C,this._lastQuaternion=new ft,this._lastTargetPosition=new C,this._quat=new ft().setFromUnitVectors(e.up,new C(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Vr,this._sphericalDelta=new Vr,this._scale=1,this._panOffset=new C,this._rotateStart=new ae,this._rotateEnd=new ae,this._rotateDelta=new ae,this._panStart=new ae,this._panEnd=new ae,this._panDelta=new ae,this._dollyStart=new ae,this._dollyEnd=new ae,this._dollyDelta=new ae,this._dollyDirection=new C,this._mouse=new ae,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=mM.bind(this),this._onPointerDown=pM.bind(this),this._onPointerUp=gM.bind(this),this._onContextMenu=SM.bind(this),this._onMouseWheel=vM.bind(this),this._onKeyDown=bM.bind(this),this._onTouchStart=MM.bind(this),this._onTouchMove=xM.bind(this),this._onMouseDown=_M.bind(this),this._onMouseMove=yM.bind(this),this._interceptControlDown=TM.bind(this),this._interceptControlUp=wM.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}set cursorStyle(e){this._cursorStyle=e,e==="grab"?this.domElement.style.cursor="grab":this.domElement.style.cursor="auto"}get cursorStyle(){return this._cursorStyle}connect(e){super.connect(e),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.state=St.NONE,this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents();let e=this.domElement.getRootNode();e.removeEventListener("keydown",this._interceptControlDown,{capture:!0}),e.removeEventListener("keyup",this._interceptControlUp,{capture:!0}),this._controlActive=!1,this._pointers.length=0,this._pointerPositions={},this.domElement.style.touchAction="",this.domElement.style.cursor="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(Vp),this.update(),this.state=St.NONE}pan(e,t){this._pan(e,t),this.update()}dollyIn(e){this._dollyIn(e),this.update()}dollyOut(e){this._dollyOut(e),this.update()}rotateLeft(e){this._rotateLeft(e),this.update()}rotateUp(e){this._rotateUp(e),this.update()}update(e=null){let t=this.object.position;hn.copy(t).sub(this.target),hn.applyQuaternion(this._quat),this._spherical.setFromVector3(hn),this.autoRotate&&this.state===St.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let i=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(i)&&isFinite(s)&&(i<-Math.PI?i+=Xn:i>Math.PI&&(i-=Xn),s<-Math.PI?s+=Xn:s>Math.PI&&(s-=Xn),i<=s?this._spherical.theta=Math.max(i,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(i+s)/2?Math.max(i,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{let o=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=o!=this._spherical.radius}if(hn.setFromSpherical(this._spherical),hn.applyQuaternion(this._quatInverse),t.copy(this.target).add(hn),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let o=null;if(this.object.isPerspectiveCamera){let a=hn.length();o=this._clampDistance(a*this._scale);let l=a-o;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),r=!!l}else if(this.object.isOrthographicCamera){let a=new C(this._mouse.x,this._mouse.y,0);a.unproject(this.object);let l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=l!==this.object.zoom;let c=new C(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(a),this.object.updateMatrixWorld(),o=hn.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;o!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(o).add(this.object.position):(yc.origin.copy(this.object.position),yc.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(yc.direction))<fM?this.object.lookAt(this.target):(Gp.setFromNormalAndCoplanarPoint(this.object.up,this.target),yc.intersectPlane(Gp,this.target))))}else if(this.object.isOrthographicCamera){let o=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),o!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>Ru||8*(1-this._lastQuaternion.dot(this.object.quaternion))>Ru||this._lastTargetPosition.distanceToSquared(this.target)>Ru?(this.dispatchEvent(Vp),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?Xn/60*this.autoRotateSpeed*e:Xn/60/60*this.autoRotateSpeed}_getZoomScale(e){let t=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){hn.setFromMatrixColumn(t,0),hn.multiplyScalar(-e),this._panOffset.add(hn)}_panUp(e,t){this.screenSpacePanning===!0?hn.setFromMatrixColumn(t,1):(hn.setFromMatrixColumn(t,0),hn.crossVectors(this.object.up,hn)),hn.multiplyScalar(e),this._panOffset.add(hn)}_pan(e,t){let i=this.domElement;if(this.object.isPerspectiveCamera){let s=this.object.position;hn.copy(s).sub(this.target);let r=hn.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*r/i.clientHeight,this.object.matrix),this._panUp(2*t*r/i.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/i.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/i.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;let i=this.domElement.getBoundingClientRect(),s=e-i.left,r=t-i.top,o=i.width,a=i.height;this._mouse.x=s/o*2-1,this._mouse.y=-(r/a)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let t=this.domElement;this._rotateLeft(Xn*this._rotateDelta.x/t.clientHeight),this._rotateUp(Xn*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(Xn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-Xn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(Xn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-Xn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),t=!0;break}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._rotateStart.set(i,s)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panStart.set(i,s)}}_handleTouchStartDolly(e){let t=this._getSecondPointerPosition(e),i=e.pageX-t.x,s=e.pageY-t.y,r=Math.sqrt(i*i+s*s);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{let i=this._getSecondPointerPosition(e),s=.5*(e.pageX+i.x),r=.5*(e.pageY+i.y);this._rotateEnd.set(s,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let t=this.domElement;this._rotateLeft(Xn*this._rotateDelta.x/t.clientHeight),this._rotateUp(Xn*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panEnd.set(i,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){let t=this._getSecondPointerPosition(e),i=e.pageX-t.x,s=e.pageY-t.y,r=Math.sqrt(i*i+s*s);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);let o=(e.pageX+t.x)*.5,a=(e.pageY+t.y)*.5;this._updateZoomParameters(o,a)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new ae,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){let t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){let t=e.deltaMode,i={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:i.deltaY*=16;break;case 2:i.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(i.deltaY*=10),i}};function pM(n){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(n.pointerId),this.domElement.ownerDocument.addEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(n)&&(this._addPointer(n),n.pointerType==="touch"?this._onTouchStart(n):this._onMouseDown(n),this._cursorStyle==="grab"&&(this.domElement.style.cursor="grabbing")))}function mM(n){this.enabled!==!1&&(n.pointerType==="touch"?this._onTouchMove(n):this._onMouseMove(n))}function gM(n){switch(this._removePointer(n),this._pointers.length){case 0:this.domElement.releasePointerCapture(n.pointerId),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(Hp),this.state=St.NONE,this._cursorStyle==="grab"&&(this.domElement.style.cursor="grab");break;case 1:let e=this._pointers[0],t=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:t.x,pageY:t.y});break}}function _M(n){let e;switch(n.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case Ts.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(n),this.state=St.DOLLY;break;case Ts.ROTATE:if(n.ctrlKey||n.metaKey||n.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(n),this.state=St.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(n),this.state=St.ROTATE}break;case Ts.PAN:if(n.ctrlKey||n.metaKey||n.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(n),this.state=St.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(n),this.state=St.PAN}break;default:this.state=St.NONE}this.state!==St.NONE&&this.dispatchEvent(Cu)}function yM(n){switch(this.state){case St.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(n);break;case St.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(n);break;case St.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(n);break}}function vM(n){this.enabled===!1||this.enableZoom===!1||this.state!==St.NONE||(n.preventDefault(),this.dispatchEvent(Cu),this._handleMouseWheel(this._customWheelEvent(n)),this.dispatchEvent(Hp))}function bM(n){this.enabled!==!1&&this._handleKeyDown(n)}function MM(n){switch(this._trackPointer(n),this._pointers.length){case 1:switch(this.touches.ONE){case ws.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(n),this.state=St.TOUCH_ROTATE;break;case ws.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(n),this.state=St.TOUCH_PAN;break;default:this.state=St.NONE}break;case 2:switch(this.touches.TWO){case ws.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(n),this.state=St.TOUCH_DOLLY_PAN;break;case ws.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(n),this.state=St.TOUCH_DOLLY_ROTATE;break;default:this.state=St.NONE}break;default:this.state=St.NONE}this.state!==St.NONE&&this.dispatchEvent(Cu)}function xM(n){switch(this._trackPointer(n),this.state){case St.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(n),this.update();break;case St.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(n),this.update();break;case St.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(n),this.update();break;case St.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(n),this.update();break;default:this.state=St.NONE}}function SM(n){this.enabled!==!1&&n.preventDefault()}function TM(n){n.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function wM(n){n.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}var ra=new C;function ti(n,e,t,i,s,r){let o=2*Math.PI*s/4,a=Math.max(r-2*s,0),l=Math.PI/4;ra.copy(e),ra[i]=0,ra.normalize();let c=.5*o/(o+a),h=1-ra.angleTo(n)/l;return Math.sign(ra[t])===1?h*c:a/(o+a)+c+c*(1-h)}var ss=class n extends Dt{constructor(e=1,t=1,i=1,s=2,r=.1){let o=s*2+1;if(r=Math.min(e/2,t/2,i/2,r),super(1,1,1,o,o,o),this.type="RoundedBoxGeometry",this.parameters={width:e,height:t,depth:i,segments:s,radius:r},o===1)return;let a=this.toNonIndexed();this.index=null,this.attributes.position=a.attributes.position,this.attributes.normal=a.attributes.normal,this.attributes.uv=a.attributes.uv;let l=new C,c=new C,h=new C(e,t,i).divideScalar(2).subScalar(r),u=this.attributes.position.array,d=this.attributes.normal.array,f=this.attributes.uv.array,m=u.length/6,_=new C,p=.5/o;for(let g=0,T=0;g<u.length;g+=3,T+=2)switch(l.fromArray(u,g),c.copy(l),c.x-=Math.sign(c.x)*p,c.y-=Math.sign(c.y)*p,c.z-=Math.sign(c.z)*p,c.normalize(),u[g+0]=h.x*Math.sign(l.x)+c.x*r,u[g+1]=h.y*Math.sign(l.y)+c.y*r,u[g+2]=h.z*Math.sign(l.z)+c.z*r,d[g+0]=c.x,d[g+1]=c.y,d[g+2]=c.z,Math.floor(g/m)){case 0:_.set(1,0,0),f[T+0]=ti(_,c,"z","y",r,i),f[T+1]=1-ti(_,c,"y","z",r,t);break;case 1:_.set(-1,0,0),f[T+0]=1-ti(_,c,"z","y",r,i),f[T+1]=1-ti(_,c,"y","z",r,t);break;case 2:_.set(0,1,0),f[T+0]=1-ti(_,c,"x","z",r,e),f[T+1]=ti(_,c,"z","x",r,i);break;case 3:_.set(0,-1,0),f[T+0]=1-ti(_,c,"x","z",r,e),f[T+1]=1-ti(_,c,"z","x",r,i);break;case 4:_.set(0,0,1),f[T+0]=1-ti(_,c,"x","y",r,e),f[T+1]=1-ti(_,c,"y","x",r,t);break;case 5:_.set(0,0,-1),f[T+0]=ti(_,c,"x","y",r,e),f[T+1]=1-ti(_,c,"y","x",r,t);break}}static fromJSON(e){return new n(e.width,e.height,e.depth,e.segments,e.radius)}};function bc(n,e=!1){let t=n[0].index!==null,i=new Set(Object.keys(n[0].attributes)),s=new Set(Object.keys(n[0].morphAttributes)),r={},o={},a=n[0].morphTargetsRelative,l=new pt,c=0;for(let h=0;h<n.length;++h){let u=n[h],d=0;if(t!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(let f in u.attributes){if(!i.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+f+'" attribute exists among all geometries, or in none of them.'),null;r[f]===void 0&&(r[f]=[]),r[f].push(u.attributes[f]),d++}if(d!==i.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(a!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(let f in u.morphAttributes){if(!s.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;o[f]===void 0&&(o[f]=[]),o[f].push(u.morphAttributes[f])}if(e){let f;if(t)f=u.index.count;else if(u.attributes.position!==void 0)f=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,f,h),c+=f}}if(t){let h=0,u=[];for(let d=0;d<n.length;++d){let f=n[d].index;for(let m=0;m<f.count;++m)u.push(f.getX(m)+h);h+=n[d].attributes.position.count}l.setIndex(u)}for(let h in r){let u=Wp(r[h]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;l.setAttribute(h,u)}for(let h in o){let u=o[h][0].length;if(u!==0){l.morphAttributes=l.morphAttributes||{},l.morphAttributes[h]=[];for(let d=0;d<u;++d){let f=[];for(let _=0;_<o[h].length;++_)f.push(o[h][_][d]);let m=Wp(f);if(!m)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;l.morphAttributes[h].push(m)}}}return l}function Wp(n){let e,t,i,s=-1,r=0;for(let c=0;c<n.length;++c){let h=n[c];if(e===void 0&&(e=h.array.constructor),e!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=h.itemSize),t!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(i===void 0&&(i=h.normalized),i!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=h.gpuType),s!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.count*t}let o=new e(r),a=new wt(o,t,i),l=0;for(let c=0;c<n.length;++c){let h=n[c];if(h.isInterleavedBufferAttribute){let u=l/t;for(let d=0,f=h.count;d<f;d++)for(let m=0;m<t;m++){let _=h.getComponent(d,m);a.setComponent(d+u,m,_)}}else o.set(h.array,l);l+=h.count*t}return s!==void 0&&(a.gpuType=s),a}function Pu(n,e){if(e===su)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),n;if(e===Yr||e===ta){let t=n.getIndex();if(t===null){let r=[],o=n.getAttribute("position");if(o!==void 0){for(let a=0;a<o.count;a++)r.push(a);n.setIndex(r),t=n.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),n}let i=t.count-2,s=[];if(e===Yr)for(let r=1;r<=i;r++)s.push(t.getX(0)),s.push(t.getX(r)),s.push(t.getX(r+1));else for(let r=0;r<i;r++)r%2===0?(s.push(t.getX(r)),s.push(t.getX(r+1)),s.push(t.getX(r+2))):(s.push(t.getX(r+2)),s.push(t.getX(r+1)),s.push(t.getX(r)));return s.length/3!==i&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles."),n.setIndex(s),n.clearGroups(),n}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),n}var Mc=["A1","B2","C3","D4","E5","F6"],EM={overload:"OVERLOAD",short:"SHORT CIRCUIT",power:"POWER FAILURE"},AM=["FIRST","SECOND","THIRD","FOURTH","FIFTH","SIXTH"];function RM(n,e){switch(n.k){case"fault":return e.fault===n.v;case"mode":return e.mode===n.v;case"pos":return e.wires[n.at==="last"?e.wires.length-1:n.at]===n.color;case"none":return!e.wires.includes(n.color);case"has":return e.wires.includes(n.color);case"leftOf":return e.wires.includes(n.a)&&e.wires.includes(n.b)&&e.wires.indexOf(n.a)<e.wires.indexOf(n.b);case"odd":return+e.serial[e.serial.length-1]%2===1;case"even":return+e.serial[e.serial.length-1]%2===0;case"vowel":return/[AEU]/.test(e.serial);case"else":return!0}}function CM(n){switch(n.k){case"fault":return EM[n.v];case"mode":return`${n.v.toUpperCase()} MODE`;case"pos":return`${n.at==="last"?"LAST":AM[n.at]} WIRE ${n.color.toUpperCase()}`;case"none":return`NO ${n.color.toUpperCase()} WIRE`;case"has":return`A ${n.color.toUpperCase()} WIRE IS PRESENT`;case"leftOf":return`${n.a.toUpperCase()} LEFT OF ${n.b.toUpperCase()}`;case"odd":return"SERIAL ENDS IN ODD DIGIT";case"even":return"SERIAL ENDS IN EVEN DIGIT";case"vowel":return"SERIAL CONTAINS A VOWEL";case"else":return"NO OTHER RULE APPLIES"}}var Ot=(n,e)=>({cond:n,when:n.map(CM),cut:Mc.indexOf(e),test:t=>n.every(i=>RM(i,t))}),Cn=n=>({k:"fault",v:n}),jr=n=>({k:"mode",v:n}),ir=(n,e)=>({k:"pos",at:n,color:e}),Xp={k:"odd"},PM={k:"even"},Iu={k:"vowel"},Lu={k:"else"},Du=[{numeral:"I",title:"FOUR WIRES",wires:4,rules:[Ot([Cn("overload"),ir(0,"red")],"B2"),Ot([Cn("short"),{k:"none",color:"blue"}],"D4"),Ot([Cn("power"),jr("emergency")],"A1"),Ot([ir("last","white"),Xp],"C3"),Ot([Cn("overload"),jr("emergency")],"D4"),Ot([Cn("short"),Iu],"A1"),Ot([{k:"has",color:"yellow"}],"C3"),Ot([Lu],"B2")]},{numeral:"II",title:"FIVE WIRES",wires:5,rules:[Ot([Cn("power"),ir(0,"green")],"E5"),Ot([Cn("overload"),{k:"none",color:"red"}],"C3"),Ot([Cn("short"),jr("emergency")],"B2"),Ot([ir(2,"blue"),PM],"D4"),Ot([Cn("overload"),jr("normal")],"A1"),Ot([Cn("short"),ir("last","purple")],"E5"),Ot([Iu],"D4"),Ot([Lu],"C3")]},{numeral:"III",title:"SIX WIRES",wires:6,rules:[Ot([Cn("short"),ir(0,"white")],"F6"),Ot([Cn("power"),jr("normal")],"B2"),Ot([Cn("overload"),{k:"leftOf",a:"red",b:"blue"}],"E5"),Ot([jr("emergency"),Xp],"A1"),Ot([Cn("power"),ir("last","yellow")],"D4"),Ot([Cn("short"),Iu],"C3"),Ot([Cn("overload")],"F6"),Ot([Lu],"D4")]}];function qp(n){let e=Du.find(i=>i.wires===n.wires.length),t=e.rules.findIndex(i=>i.test(n));return{wire:e.rules[t].cut,rule:t+1,section:e.numeral}}var oa={red:"#9e1208",yellow:"#c79300",blue:"#0f3a8c",green:"#1f6e1c",purple:"#4a1670",white:"#b9b6ad"},Yp=Object.keys(oa);function $p(n,e){n=n.slice();for(let t=n.length-1;t>0;t--){let i=Math.floor(e()*(t+1));[n[t],n[i]]=[n[i],n[t]]}return n}function Zp(n){let e=Vt(n*101+7);return{table:$p(Yp,e).slice(0,5)}}function Kp(n,e,t=6,i={}){let s=Vt(e*7919+3),r="ABCDEFHKMNPRTUVXZ",o="2346789",a=m=>m[Math.floor(s()*m.length)],l=`${a(r)}${a(o)}${a(r)}${a(o)}${a(o)}`,c=$p(Yp,s).slice(0,Math.max(4,Math.min(6,t))),h=["overload","short","power"],u=i.fault||h[Math.floor(s()*3)],d=i.mode||(s()<.5?"normal":"emergency"),f=qp({fault:u,mode:d,wires:c,serial:l});return{serial:l,wires:c,fault:u,mode:d,answer:f.wire,rule:f.rule,section:f.section}}var mt="#140b05",Qr="rgba(20,11,5,.7)",Ni="#6a1013",IM="rgba(20,11,5,.22)",xc="#8a652a",Ht={display:(n,e)=>`700 ${e}px 'Cormorant SC', 'Cinzel', Georgia, serif`,body:(n,e=500,t=!1)=>`${t?"italic ":""}500 ${n}px 'Lora', Georgia, serif`,tech:(n,e=700)=>`${e>=600?700:500} ${n}px 'Oswald', 'Arial Narrow', sans-serif`,mono:(n,e=700)=>`${e} ${n}px 'IBM Plex Mono', Menlo, monospace`},Kt=1024,Nu=1408,Qe=84,LM={red:"#c8231a",yellow:"#f0b20f",blue:"#1d55c4",green:"#2c8f33",purple:"#7a2fae",white:"#f7f3ea"},aa={red:["\u041A\u0420\u0410\u0421\u041D\u042B\u0419","\u041A\u0420\u0410\u0421\u041D\u041E\u0413\u041E"],yellow:["\u0416\u0401\u041B\u0422\u042B\u0419","\u0416\u0401\u041B\u0422\u041E\u0413\u041E"],blue:["\u0421\u0418\u041D\u0418\u0419","\u0421\u0418\u041D\u0415\u0413\u041E"],green:["\u0417\u0415\u041B\u0401\u041D\u042B\u0419","\u0417\u0415\u041B\u0401\u041D\u041E\u0413\u041E"],purple:["\u0424\u0418\u041E\u041B\u0415\u0422.","\u0424\u0418\u041E\u041B\u0415\u0422."],white:["\u0411\u0415\u041B\u042B\u0419","\u0411\u0415\u041B\u041E\u0413\u041E"]},Is={fault:"#f7d6c4",mode:"#d3e0f0",serial:"#f1e0b0",wire:"#d6ecd0",else:"#e9e2d4"},DM=n=>n.k==="fault"?Is.fault:n.k==="mode"?Is.mode:n.k==="odd"||n.k==="even"||n.k==="vowel"?Is.serial:n.k==="else"?Is.else:Is.wire;function Pn(n,e,t,i,s,r){n.beginPath(),n.moveTo(e+r,t),n.arcTo(e+i,t,e+i,t+s,r),n.arcTo(e+i,t+s,e,t+s,r),n.arcTo(e,t+s,e,t,r),n.arcTo(e,t,e+i,t,r),n.closePath()}function ni(n,e,t,i,s=22,r=mt){n.font=Ht.tech(s,700),n.fillStyle=r,n.textAlign="center",n.textBaseline="alphabetic",n.fillText(e,t,i)}function eo(n,e,t,i,s,r=15){n.lineCap="round",n.strokeStyle=mt,n.lineWidth=r+4,n.beginPath(),n.moveTo(e,t),n.lineTo(e,i),n.stroke(),n.strokeStyle=LM[s],n.lineWidth=r,n.beginPath(),n.moveTo(e,t),n.lineTo(e,i),n.stroke(),n.strokeStyle="rgba(255,255,255,.28)",n.lineWidth=r*.25,n.beginPath(),n.moveTo(e-r*.2,t+3),n.lineTo(e-r*.2,i-3),n.stroke(),n.fillStyle=xc;for(let o of[t-6,i+6])n.fillRect(e-r*.7,o-6,r*1.4,12),n.strokeStyle=mt,n.lineWidth=1.5,n.strokeRect(e-r*.7,o-6,r*1.4,12)}function NM(n,e,t,i,s,r,o=26,a=74){let l=i*o;n.strokeStyle=mt,n.lineWidth=2.5,Pn(n,e-l/2-8,t-a/2-12,l+16,a+24,6),n.stroke();for(let c=0;c<i;c++){let h=e-l/2+o*(c+.5);c===s?r?eo(n,h,t-a/2+6,t+a/2-6,r,13):(n.fillStyle=mt,n.fillRect(h-6,t-a/2+6,12,a-12)):(n.strokeStyle="rgba(20,11,5,.3)",n.setLineDash([5,5]),n.lineWidth=3,n.beginPath(),n.moveTo(h,t-a/2+8),n.lineTo(h,t+a/2-8),n.stroke(),n.setLineDash([]))}}var sr=150;function UM(n,e,t,i){if(n.save(),n.translate(t,i-12),e==="overload"){let r=a=>Math.PI*(.75+a*1.5);n.fillStyle="#efe6cf",n.beginPath(),n.arc(0,0,52,0,7),n.fill(),n.strokeStyle=mt,n.lineWidth=5,n.stroke(),n.strokeStyle="#b3221a",n.lineWidth=12,n.beginPath(),n.arc(0,0,39,r(.72),r(1)),n.stroke(),n.strokeStyle=mt,n.lineWidth=2;for(let a=0;a<=10;a++){let l=r(a/10);n.beginPath(),n.moveTo(Math.cos(l)*46,Math.sin(l)*46),n.lineTo(Math.cos(l)*37,Math.sin(l)*37),n.stroke()}let o=r(.9);n.lineWidth=5,n.lineCap="round",n.beginPath(),n.moveTo(0,0),n.lineTo(Math.cos(o)*42,Math.sin(o)*42),n.stroke(),n.fillStyle=mt,n.beginPath(),n.arc(0,0,6,0,7),n.fill()}else if(e==="short"){n.strokeStyle=mt,n.lineWidth=10,n.lineCap="round",n.beginPath(),n.moveTo(-60,30),n.lineTo(-24,30),n.moveTo(24,30),n.lineTo(60,30),n.stroke(),n.fillStyle="#e0a21b",n.strokeStyle=mt,n.lineWidth=3.5,n.lineJoin="round",n.beginPath(),n.moveTo(8,-52),n.lineTo(-26,2),n.lineTo(-2,2),n.lineTo(-12,46),n.lineTo(26,-10),n.lineTo(2,-10),n.lineTo(14,-52),n.closePath(),n.fill(),n.stroke();for(let[s,r]of[[-40,-20],[38,-26],[-34,12],[42,8]])n.lineWidth=3,n.beginPath(),n.moveTo(s*.7,r*.7),n.lineTo(s,r),n.stroke()}else n.fillStyle="#8f8778",n.strokeStyle=mt,n.lineWidth=4.5,n.beginPath(),n.arc(0,-10,36,Math.PI*.8,Math.PI*2.2),n.lineTo(14,32),n.lineTo(-14,32),n.closePath(),n.fill(),n.stroke(),n.fillStyle=mt,n.fillRect(-15,34,30,14),n.strokeStyle="#efe6cf",n.lineWidth=2,n.beginPath(),n.moveTo(-15,41),n.lineTo(15,41),n.stroke(),n.strokeStyle="rgba(20,11,5,.55)",n.lineWidth=3,n.beginPath(),n.moveTo(-10,-4),n.lineTo(-4,-18),n.lineTo(4,-4),n.lineTo(10,-18),n.stroke(),n.strokeStyle="#b3221a",n.lineWidth=6,n.lineCap="round",n.beginPath(),n.moveTo(52,-34),n.lineTo(52,10),n.moveTo(40,-2),n.lineTo(52,12),n.lineTo(64,-2),n.stroke();n.restore(),ni(n,e==="overload"?"\u041F\u0415\u0420\u0415\u0413\u0420\u0423\u0417\u041A\u0410":e==="short"?"\u0417\u0410\u041C\u042B\u041A\u0410\u041D\u0418\u0415":"\u041D\u0415\u0422 \u041F\u0418\u0422\u0410\u041D\u0418\u042F",t,i+sr/2-4,24,Ni)}function FM(n,e,t,i){n.save(),n.translate(t,i-14);let s=46;n.fillStyle="#e3d6b4",n.beginPath(),n.arc(0,0,s,0,7),n.fill(),n.strokeStyle=mt,n.lineWidth=4,n.stroke(),n.font=Ht.tech(28,700),n.textAlign="center",n.textBaseline="middle";for(let[o,a]of[["N",-Math.PI*.75],["E",-Math.PI*.25]]){let l=o==="N"==(e==="normal");n.fillStyle=l?mt:"rgba(20,11,5,.3)",n.fillText(o,Math.cos(a)*(s+18),Math.sin(a)*(s+18))}let r=e==="normal"?-Math.PI*.75:-Math.PI*.25;n.rotate(r+Math.PI/2),n.fillStyle=mt,Pn(n,-9,-s+6,18,s*2-12,8),n.fill(),n.fillStyle="#b3221a",n.beginPath(),n.moveTo(0,-s+2),n.lineTo(-9,-s+18),n.lineTo(9,-s+18),n.closePath(),n.fill(),n.restore(),ni(n,e==="normal"?"\u0420\u0415\u0416\u0418\u041C N":"\u0420\u0415\u0416\u0418\u041C E",t,i+sr/2-4,25)}function Jp(n,e,t,i,s,r=128){n.fillStyle="#1c1612",Pn(n,e-r/2,t-54/2,r,54,6),n.fill(),n.strokeStyle=xc,n.lineWidth=4,Pn(n,e-r/2,t-54/2,r,54,6),n.stroke(),n.font=Ht.mono(30,700),n.textAlign="center",n.textBaseline="middle";let a=(r-22)/i.length;[...i].forEach((l,c)=>{let h=e-r/2+11+a*(c+.5);s.includes(c)?(n.fillStyle="#b3221a",Pn(n,h-a/2+2,t-19,a-4,38,4),n.fill(),n.fillStyle="#f5ecd6"):n.fillStyle="rgba(240,229,201,.5)",n.fillText(l,h,t+1)})}function OM(n,e,t,i){if(e==="vowel"){Jp(n,t,i-26,"A E U",[0,2,4]),ni(n,"\u0413\u041B\u0410\u0421\u041D\u0410\u042F",t,i+32,24),ni(n,"\u0412 \u041D\u041E\u041C\u0415\u0420\u0415",t,i+58,24);return}Jp(n,t,i-26,"\u2022\u2022\u2022\u2022"+(e==="odd"?"7":"4"),[4]),ni(n,"\u041F\u041E\u0421\u041B. \u0426\u0418\u0424\u0420\u0410",t,i+32,22),ni(n,e==="odd"?"\u041D\u0415\u0427\u0401\u0422\u041D\u0410\u042F":"\u0427\u0401\u0422\u041D\u0410\u042F",t,i+60,26,Ni)}var jp=["1-\u0419","2-\u0419","3-\u0419","4-\u0419","5-\u0419","6-\u0419"];function BM(n,e,t,i,s){let r=e.at==="last"?t-1:e.at;NM(n,i,s-16,t,r,e.color,t>5?22:25),ni(n,`${e.at==="last"?"\u041F\u041E\u0421\u041B.":jp[e.at]} = ${aa[e.color][0]}`,i,s+sr/2-4,22)}function kM(n,e,t,i){eo(n,t,i-58,i+22,e,20),n.strokeStyle="#b3221a",n.lineWidth=7,n.beginPath(),n.arc(t,i-18,46,0,7),n.stroke(),n.beginPath(),n.moveTo(t-32,i+14),n.lineTo(t+32,i-50),n.stroke(),ni(n,`\u041D\u0415\u0422 ${aa[e][1]}`,t,i+sr/2-4,23)}function zM(n,e,t,i){eo(n,t,i-58,i+22,e,20),n.strokeStyle="#2f6b33",n.lineWidth=6,n.beginPath(),n.arc(t+34,i-50,16,0,7),n.stroke(),n.beginPath(),n.moveTo(t+26,i-50),n.lineTo(t+32,i-43),n.lineTo(t+43,i-58),n.stroke(),ni(n,`\u0415\u0421\u0422\u042C ${aa[e][0]}`,t,i+sr/2-4,23)}function VM(n,e,t,i,s){eo(n,i-40,s-58,s+18,e,18),eo(n,i+40,s-58,s+18,t,18),n.fillStyle=mt,n.font=Ht.tech(34,700),n.textAlign="center",n.fillText("\u2026",i,s-10),ni(n,`${aa[e][0]} \u041B\u0415\u0412\u0415\u0415 ${aa[t][1]}`,i,s+sr/2-4,19)}function GM(n,e,t){n.strokeStyle=mt,n.lineWidth=3,n.setLineDash([8,6]),Pn(n,e-66,t-58,132,92,10),n.stroke(),n.setLineDash([]),n.fillStyle=mt,n.font=Ht.tech(46,700),n.textAlign="center",n.textBaseline="middle",n.fillText("\u0418\u041D\u0410\u0427\u0415",e,t-12),n.textBaseline="alphabetic",ni(n,"\u041D\u0418\u0427\u0415\u0413\u041E \u0412\u042B\u0428\u0415",e,t+sr/2-4,22,Qr)}function HM(n,e,t,i,s){switch(e.k){case"fault":return UM(n,e.v,i,s);case"mode":return FM(n,e.v,i,s);case"pos":return BM(n,e,t,i,s);case"none":return kM(n,e.color,i,s);case"has":return zM(n,e.color,i,s);case"leftOf":return VM(n,e.a,e.b,i,s);case"odd":case"even":case"vowel":return OM(n,e.k,i,s);case"else":return GM(n,i,s)}}function WM(n,e,t,i=1){n.save(),n.translate(e,t),n.scale(i,i),n.rotate(-.5),n.fillStyle="#7d1a16",n.strokeStyle=mt,n.lineWidth=3;for(let s of[-1,1])n.beginPath(),n.moveTo(0,0),n.quadraticCurveTo(-18,s*10,-46,s*16),n.lineTo(-48,s*6),n.quadraticCurveTo(-20,s*2,0,0),n.closePath(),n.fill(),n.stroke();n.fillStyle="#6f6a62";for(let s of[-1,1])n.beginPath(),n.moveTo(0,0),n.lineTo(30,s*8),n.lineTo(32,s*1),n.closePath(),n.fill(),n.stroke();n.fillStyle=mt,n.beginPath(),n.arc(0,0,5,0,7),n.fill(),n.restore()}function XM(n,e,t,i,s){WM(n,i-70,s-38,1.15),n.fillStyle="#1c1612",Pn(n,i-30,s-70,104,64,8),n.fill(),n.strokeStyle=Ni,n.lineWidth=5,Pn(n,i-30,s-70,104,64,8),n.stroke(),n.fillStyle="#f5ecd6",n.font=Ht.mono(44,700),n.textAlign="center",n.textBaseline="middle",n.fillText(Mc[e],i+22,s-37),n.textBaseline="alphabetic";let r=16,o=t*r;for(let a=0;a<t;a++){let l=i-o/2+r*(a+.5)+2;n.fillStyle=a===e?Ni:"rgba(20,11,5,.25)",n.fillRect(l-4,s+4,8,a===e?34:24)}ni(n,`${jp[e]} \u041F\u0420\u041E\u0412\u041E\u0414`,i+2,s+64,22,Ni)}var qM=n=>n===4?"\u041F\u0420\u041E\u0412\u041E\u0414\u0410":"\u041F\u0420\u041E\u0412\u041E\u0414\u041E\u0412";function YM(n,e,t,i,s){n.textBaseline="alphabetic",n.fillStyle=Qr,n.font=Ht.tech(20,500),n.textAlign="left",n.fillText("WIRE MODULE \xB7 \u0420\u0410\u0417\u0414\u0415\u041B "+e.numeral,Qe,s?70:82),n.fillStyle=mt,n.font=Ht.display(700,s?52:78),n.fillText("\u041C\u043E\u0434\u0443\u043B\u044C \u043F\u0440\u043E\u0432\u043E\u0434\u043E\u0432",Qe-2,s?118:150);let r=s?136:172,o=s?44:56,a=`${e.wires} ${qM(e.wires)}`;n.font=Ht.tech(s?30:38,700);let l=n.measureText(a).width+56;n.fillStyle=Ni,n.beginPath(),n.moveTo(Qe,r),n.lineTo(Qe+l,r),n.lineTo(Qe+l-16,r+o/2),n.lineTo(Qe+l,r+o),n.lineTo(Qe,r+o),n.closePath(),n.fill(),n.fillStyle="#f6ead0",n.fillText(a,Qe+18,r+o*.74);let c=e.wires,h=c*30,u=Kt-Qe-h/2-10,d=s?70:92,f=s?100:128;n.fillStyle="rgba(40,28,18,.08)",Pn(n,u-h/2-22,d-34,h+44,f+50,10),n.fill(),n.strokeStyle=mt,n.lineWidth=4,n.beginPath(),n.moveTo(u-h/2-12,d),n.lineTo(u+h/2+12,d),n.moveTo(u-h/2-12,d+f),n.lineTo(u+h/2+12,d+f),n.stroke();let m=["red","yellow","blue","green","purple","white"];for(let p=0;p<c;p++){let g=u-h/2+30*(p+.5);eo(n,g,d+12,d+f-12,m[p],12),n.fillStyle=mt,n.font=Ht.mono(17,700),n.textAlign="center",n.fillText(Mc[p],g,d-10)}n.font=Ht.tech(22,700),n.fillStyle=Qr,n.textAlign=t>0?"right":"left",n.fillText(String(i),t>0?Kt-Qe:Qe,Nu-58);let _=s?206:262;return n.strokeStyle=mt,n.lineWidth=3,n.beginPath(),n.moveTo(Qe,_),n.lineTo(Kt-Qe,_),n.stroke(),s||(n.fillStyle=Ni,n.font=Ht.tech(29,700),n.textAlign="left",n.fillText("\u041F\u0415\u0420\u0412\u041E\u0415 \u0421\u041E\u0412\u041F\u0410\u0414\u0415\u041D\u0418\u0415 \u2014 \u0412\u0415\u0420\u041D\u041E\u0415",Qe+54,_+52),n.strokeStyle=Ni,n.lineWidth=6,n.lineCap="round",n.beginPath(),n.moveTo(Qe+20,_+20),n.lineTo(Qe+20,_+58),n.moveTo(Qe+8,_+46),n.lineTo(Qe+20,_+60),n.lineTo(Qe+32,_+46),n.stroke(),n.fillStyle=Qr,n.font=Ht.tech(20,500),n.textAlign="right",n.fillText("\u0421\u0427\u0401\u0422 \u0421\u041B\u0415\u0412\u0410 \u2192 \u041D\u0410\u041F\u0420\u0410\u0412\u041E",Kt-Qe,_+50)),s?_+14:_+84}function $M(n,e,t,i,s,r,o){let a=r+o/2+8;n.fillStyle=mt,n.beginPath(),n.arc(Qe+50,r+o/2,46,0,7),n.fill(),n.strokeStyle=xc,n.lineWidth=4,n.beginPath(),n.arc(Qe+50,r+o/2,40,0,7),n.stroke(),n.fillStyle="#f3e6c8",n.font=Ht.mono(46,700),n.textAlign="center",n.textBaseline="middle",n.fillText(String(e).padStart(2,"0"),Qe+50,r+o/2+2),n.textBaseline="alphabetic";let l=Qe+130,c=168;t.forEach((u,d)=>{let f=l+c/2+d*(c+44);n.fillStyle=DM(u),Pn(n,f-c/2,r+14,c,o-28,12),n.fill(),n.strokeStyle="rgba(20,11,5,.35)",n.lineWidth=2,Pn(n,f-c/2,r+14,c,o-28,12),n.stroke(),HM(n,u,s,f,a),d<t.length-1&&(n.fillStyle=mt,n.font=Ht.tech(54,700),n.textAlign="center",n.textBaseline="middle",n.fillText("+",f+c/2+22,r+o/2),n.textBaseline="alphabetic")});let h=l+2*c+44+18;n.strokeStyle=mt,n.lineWidth=6,n.lineCap="round",n.beginPath(),n.moveTo(h,r+o/2),n.lineTo(h+44,r+o/2),n.moveTo(h+30,r+o/2-14),n.lineTo(h+46,r+o/2),n.lineTo(h+30,r+o/2+14),n.stroke(),XM(n,i,s,Kt-Qe-92,a),n.strokeStyle=IM,n.lineWidth=2,n.beginPath(),n.moveTo(Qe,r+o),n.lineTo(Kt-Qe,r+o),n.stroke()}function Qp(n,e,t){let i=Du[e.section],s=e.half?1:-1;Sc(n,t+41,s,!0);let r=YM(n,i,s,t+1,e.half===1),o=Nu-96,a=(o-r)/4;i.rules.slice(e.half*4,e.half*4+4).forEach((l,c)=>$M(n,e.half*4+c+1,l.cond,l.cut,i.wires,r+c*a,a))}function em(n,e){Sc(n,e+31,1,!0),n.textBaseline="alphabetic",n.fillStyle=Qr,n.font=Ht.tech(22,500),n.textAlign="center",n.fillText("FINAL ANSWER \xB7 THE BROKEN ELEVATOR",Kt/2,92),n.fillStyle=mt,n.font=Ht.display(700,84),n.fillText("\u0421\u043B\u043E\u043C\u0430\u043D\u043D\u044B\u0439 \u043B\u0438\u0444\u0442",Kt/2,176),n.strokeStyle=xc,n.lineWidth=2,n.beginPath(),n.moveTo(Kt/2-220,204),n.lineTo(Kt/2+220,204),n.stroke();let t=Kt/2,i=236,s=520,r=n.createLinearGradient(0,i,0,i+s);r.addColorStop(0,"#2a1d16"),r.addColorStop(.62,"#4a2014"),r.addColorStop(1,"#c2451a"),n.fillStyle=r,Pn(n,Qe,i,Kt-2*Qe,s,14),n.fill(),n.save(),Pn(n,Qe,i,Kt-2*Qe,s,14),n.clip();for(let m=0;m<9;m++){let _=i+s-90+m*12,p=n.createLinearGradient(0,_,0,_+14);p.addColorStop(0,m%2?"#ff8a2a":"#ffb23e"),p.addColorStop(1,"#8a1d0c"),n.fillStyle=p,n.beginPath(),n.moveTo(Qe,_);for(let g=Qe;g<=Kt-Qe;g+=18)n.lineTo(g,_+Math.sin(g*.045+m)*6);n.lineTo(Kt-Qe,_+20),n.lineTo(Qe,_+20),n.fill()}for(let m=0;m<26;m++)n.fillStyle=`rgba(255,${150+m*37%80},60,${.4+m%5*.1})`,n.beginPath(),n.arc(Qe+40+m*131%(Kt-2*Qe-80),i+s-120-m*53%220,2+m%3,0,7),n.fill();n.strokeStyle="#1b120d",n.lineWidth=5;for(let m of[-60,60])n.beginPath(),n.moveTo(t+m,i),n.lineTo(t+m*.55,i+110),n.stroke();let o=200,a=250,l=i+110;n.fillStyle="#1b120d",n.fillRect(t-o/2-12,l-22,o+24,26),n.beginPath(),n.moveTo(t-o/2-20,l-22),n.lineTo(t,l-70),n.lineTo(t+o/2+20,l-22),n.fill(),n.fillStyle="rgba(255,190,110,.18)",n.fillRect(t-o/2,l,o,a),n.strokeStyle="#1b120d",n.lineWidth=9,n.strokeRect(t-o/2,l,o,a),n.lineWidth=5;for(let m=1;m<7;m++){let _=t-o/2+m*o/7;n.beginPath(),n.moveTo(_,l),n.lineTo(_,l+a),n.stroke()}n.beginPath(),n.moveTo(t-o/2,l+a*.5),n.lineTo(t+o/2,l+a*.5),n.stroke(),n.fillStyle="#ffd27a",n.beginPath(),n.arc(t,l+30,9,0,7),n.fill();let c=n.createRadialGradient(t,l+30,4,t,l+30,90);c.addColorStop(0,"rgba(255,210,122,.5)"),c.addColorStop(1,"rgba(255,210,122,0)"),n.fillStyle=c,n.fillRect(t-100,l-70,200,200),n.restore(),n.strokeStyle=mt,n.lineWidth=3,Pn(n,Qe,i,Kt-2*Qe,s,14),n.stroke(),n.fillStyle=mt,n.font=Ht.body(28),n.textAlign="center",["\u041A\u0430\u0431\u0438\u043D\u0430 \u0437\u0430\u0441\u0442\u0440\u044F\u043B\u0430 \u043D\u0430\u0434 \u0448\u0430\u0445\u0442\u043E\u0439, \u043F\u043E\u043B\u043D\u043E\u0439 \u043B\u0430\u0432\u044B.","\u0426\u0435\u043F\u0438 \u0434\u0435\u0440\u0436\u0430\u0442 \u0435\u0451 \u0438\u0437 \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0445 \u0441\u0438\u043B.","\u041F\u043E\u0447\u0438\u043D\u0438\u0442\u044C \u043B\u0438\u0444\u0442 \u043C\u043E\u0436\u043D\u043E \u0442\u043E\u043B\u044C\u043A\u043E \u043F\u043E \u044D\u0442\u043E\u0439 \u043A\u043D\u0438\u0433\u0435."].forEach((m,_)=>n.fillText(m,Kt/2,i+s+62+_*40));let u=[["\u041E\u0442\u043A\u0440\u043E\u0439\u0442\u0435 \u0449\u0438\u0442\u043E\u043A",Is.wire],["\u041D\u0430\u0436\u043C\u0438\u0442\u0435 TEST CIRCUIT",Is.fault],["\u041D\u0430\u0439\u0434\u0438\u0442\u0435 \u043F\u0440\u0430\u0432\u0438\u043B\u043E \u2014 \u0440\u0435\u0436\u044C\u0442\u0435",Is.serial]],d=i+s+210,f=(Kt-2*Qe-40)/3;u.forEach(([m,_],p)=>{let g=Qe+p*(f+20);n.fillStyle=_,Pn(n,g,d,f,96,12),n.fill(),n.strokeStyle="rgba(20,11,5,.35)",n.lineWidth=2,Pn(n,g,d,f,96,12),n.stroke(),n.fillStyle=Ni,n.font=Ht.mono(34,700),n.textAlign="left",n.fillText(String(p+1),g+16,d+58),n.fillStyle=mt,n.font=Ht.tech(23,700);let T=m.split(" "),x="",v="";for(let M of T)n.measureText(x+" "+M).width<f-70&&!v?x=(x?x+" ":"")+M:v=(v?v+" ":"")+M;n.fillText(x,g+52,d+(v?44:58)),v&&n.fillText(v,g+52,d+74)}),n.fillStyle=Ni,n.font=Ht.tech(30,700),n.textAlign="center",n.fillText("\u0423 \u0412\u0410\u0421 45 \u0421\u0415\u041A\u0423\u041D\u0414. \u041E\u0428\u0418\u0411\u041A\u0410 \u2014 \u0418 \u041A\u0410\u0411\u0418\u041D\u0410 \u0421\u041E\u0420\u0412\u0401\u0422\u0421\u042F.",Kt/2,d+160),n.font=Ht.tech(22,700),n.fillStyle=Qr,n.textAlign="right",n.fillText(String(e+1),Kt-Qe,Nu-58)}var gn=1024,ii=1408,un="#24180f",to="rgba(36,24,15,.78)",wc="#8a1f14",nm="rgba(70,66,62,.82)",Ls="'IM Fell English', Georgia, serif",_i="'IM Fell English', Georgia, serif",yi="'IM Fell English SC', Georgia, serif",Fi="'IM Fell DW Pica', Georgia, serif",ZM="'Caveat', 'Bradley Hand', cursive";function Vt(n){let e=n>>>0||1;return()=>(e^=e<<13,e^=e>>>17,e^=e<<5,(e>>>0)/4294967296)}function Sc(n,e,t,i=!1){let s=Vt(e*7919+13),r=gn,o=ii;n.fillStyle=i?"#e9dcbc":"#d9c597",n.fillRect(0,0,r,o);let a=n.createRadialGradient(r*.5,o*.45,80,r*.5,o*.5,r*.95);a.addColorStop(0,"rgba(240,226,190,.55)"),a.addColorStop(1,"rgba(120,86,40,.35)"),n.fillStyle=a,n.fillRect(0,0,r,o);for(let c=0;c<2600;c++){let h=s()*r,u=s()*o,d=3+s()*14,f=s()*Math.PI;n.strokeStyle=`rgba(${s()<.5?"90,64,30":"255,245,220"},${.04+s()*.06})`,n.lineWidth=.6+s(),n.beginPath(),n.moveTo(h,u),n.lineTo(h+Math.cos(f)*d,u+Math.sin(f)*d),n.stroke()}for(let c=0;c<70;c++){let h=s()*r,u=s()*o,d=30+s()*160;a=n.createRadialGradient(h,u,0,h,u,d),a.addColorStop(0,`rgba(140,100,45,${.03+s()*.05})`),a.addColorStop(1,"rgba(140,100,45,0)"),n.fillStyle=a,n.fillRect(h-d,u-d,d*2,d*2)}for(let c=0;c<26+s()*30;c++){let h=s()*r,u=s()*o,d=1.5+s()*s()*9;n.fillStyle=`rgba(${120+s()*30},${70+s()*20},30,${.18+s()*.3})`,n.beginPath(),n.ellipse(h,u,d,d*(.7+s()*.5),s()*3,0,7),n.fill(),n.fillStyle="rgba(130,85,35,.06)",n.beginPath(),n.arc(h,u,d*3.5,0,7),n.fill()}if(s()<.55){let c=(s()<.5?.15:.8)*r,h=(.2+s()*.7)*o,u=120+s()*220;n.save(),n.globalCompositeOperation="multiply",a=n.createRadialGradient(c,h,u*.82,c,h,u),a.addColorStop(0,"rgba(200,170,120,.0)"),a.addColorStop(.8,"rgba(160,115,60,.22)"),a.addColorStop(1,"rgba(160,115,60,0)"),n.fillStyle=a,n.beginPath(),n.arc(c,h,u,0,7),n.fill(),n.fillStyle="rgba(205,180,130,.18)",n.beginPath(),n.arc(c,h,u*.82,0,7),n.fill(),n.restore()}if(s()<.7){let c=t>0?r-90-s()*60:90+s()*60,h=o-110-s()*90;a=n.createRadialGradient(c,h,4,c,h,70),a.addColorStop(0,"rgba(80,55,25,.16)"),a.addColorStop(1,"rgba(80,55,25,0)"),n.fillStyle=a,n.beginPath(),n.ellipse(c,h,70,52,.5,0,7),n.fill()}let l=(c,h,u,d,f)=>{let m=n.createLinearGradient(c,h,u,d);m.addColorStop(0,`rgba(105,68,28,${f})`),m.addColorStop(1,"rgba(105,68,28,0)"),n.fillStyle=m,n.fillRect(0,0,r,o)};l(0,0,0,60,.45),l(0,o,0,o-60,.45),l(t>0?r:0,0,t>0?r-60:60,0,.5),l(t>0?0:r,0,t>0?130:r-130,0,.42),n.fillStyle="rgba(80,50,20,.35)";for(let c=0;c<o;c+=3){let h=s()*s()*7;n.fillRect(t>0?r-h:0,c,h,3)}}function Nt(n,e,t){n.save(),n.globalAlpha=.22,n.translate(.8,.6),e(),n.restore(),n.save(),n.globalAlpha=.88+t()*.1,e(),n.restore()}function Ui(n,e,t){let i=e.split(/\s+/),s=[],r="";for(let o of i){let a=r?r+" "+o:o;n.measureText(a).width>t&&r?(s.push(r),r=o):r=a}return r&&s.push(r),s}function Uu(n,e,t,i,s,r){let o=e.split(" ");if(r||o.length<2){n.fillText(e,t,i);return}let a=o.reduce((h,u)=>h+n.measureText(u).width,0),l=(s-a)/(o.length-1),c=t;for(let h of o)n.fillText(h,c,i),c+=n.measureText(h).width+l}function KM(n,e,t,i,s=!1){n.strokeStyle=un,n.lineWidth=2,n.beginPath(),n.moveTo(e,i),n.lineTo(t,i),n.stroke(),s&&(n.lineWidth=.9,n.beginPath(),n.moveTo(e,i+6),n.lineTo(t,i+6),n.stroke())}function Fu(n,e,t,i=1){n.save(),n.translate(e,t),n.scale(i,i),n.strokeStyle=un,n.fillStyle=un,n.lineWidth=2;for(let s of[-1,1])n.beginPath(),n.moveTo(s*14,0),n.bezierCurveTo(s*60,-18,s*90,16,s*150,0),n.stroke(),n.beginPath(),n.arc(s*156,0,3,0,7),n.fill();n.beginPath(),n.moveTo(0,-9),n.lineTo(9,0),n.lineTo(0,9),n.lineTo(-9,0),n.closePath(),n.fill(),n.restore()}var no={l:104,r:104,t:120,b:128};function tm(n,e,t,i){let s=t%2?1:-1,r=Vt(t*31+5);e.layout!=="rules"&&e.layout!=="guide"&&Sc(n,t+1,s);let o=s>0?no.l+24:no.l,a=o,l=gn-(s>0?no.r:no.r+24),c=l-a;if(n.textBaseline="alphabetic",n.fillStyle=un,e.layout==="rules")return Qp(n,e,t);if(e.layout==="guide")return em(n,t);if(e.layout==="title")return JM(n,i,r);if(e.layout==="endpaper"){n.font=`italic 30px ${_i}`,n.textAlign="center",n.fillStyle=to,n.fillText("Notes",gn/2,220);for(let u=300;u<ii-160;u+=64)n.strokeStyle="rgba(60,40,20,.25)",n.lineWidth=1,n.beginPath(),n.moveTo(a,u),n.lineTo(l,u),n.stroke();return}n.font=`24px ${yi}`,n.fillStyle=to,n.textAlign=s>0?"right":"left",Nt(n,()=>n.fillText(s>0?"The Engineer\u2019s Manual":e.kicker||"Contents",s>0?l:a,78),r),n.textAlign=s>0?"left":"right",Nt(n,()=>n.fillText(String(t+1),s>0?a:l,78),r),n.strokeStyle=to,n.lineWidth=1.2,n.beginPath(),n.moveTo(a,92),n.lineTo(l,92),n.stroke();let h=no.t+40;if(e.layout==="contents"){n.textAlign="center",n.font=`64px ${yi}`,Nt(n,()=>n.fillText("Contents",gn/2+(s>0?12:-12),h+30),r),h+=76,Fu(n,gn/2,h),h+=80,n.font=`36px ${Ls}`,n.textAlign="left",i.sections.forEach((u,d)=>{let[f,m]=[u.numeral,u.title];n.textAlign="right",Nt(n,()=>n.fillText(f+".",a+70,h),r),n.textAlign="left",Nt(n,()=>n.fillText(m,a+92,h),r);let _=String(3+d*2),p=n.measureText(m).width;n.textAlign="right",Nt(n,()=>n.fillText(_,l,h),r),n.fillStyle=to;for(let g=a+104+p;g<l-n.measureText(_).width-14;g+=14)n.fillRect(g,h-4,2.4,2.4);n.fillStyle=un,h+=80}),h+=20,Fu(n,gn/2,h,.8),h+=70,n.font=`italic 26px ${_i}`,n.textAlign="center",n.fillStyle=to;for(let u of Ui(n,"Every operator of the car is required to carry this manual and to read the relevant section in full before touching any mechanism.",c-60))Nt(n,()=>n.fillText(u,gn/2,h),r),h+=38;return i.specimen&&(n.font=`22px ${yi}`,n.fillText(i.edition,gn/2,ii-96)),Ou(n,e.notes,s)}if(e.heading){n.font=`50px ${Fi}`,n.textAlign="left";let u=Ui(n,e.heading,c);for(let d of u)Nt(n,()=>n.fillText(d,a,h),r),h+=58;KM(n,a,l,h-30,!0),h+=26}if(e.paragraphs&&(n.font=`31px ${Ls}`,e.paragraphs.forEach((u,d)=>{let f=Ui(n,u,c-0);f.forEach((m,_)=>{if(d===0&&_===0){n.font=`118px ${Fi}`;let p=m[0];Nt(n,()=>n.fillText(p,a-4,h+66),r);let g=n.measureText(p).width+10;n.font=`31px ${Ls}`;let T=Ui(n,u.slice(1),c-g);T.slice(0,2).forEach((v,M)=>{n.save(),Nt(n,()=>Uu(n,v,a+g,h+M*42,c-g,!1),r),n.restore()});let x=Ui(n,T.slice(2).join(" "),c);h+=84,x.forEach((v,M)=>{Nt(n,()=>Uu(n,v,a,h,c,M===x.length-1),r),h+=42}),f.length=0;return}Nt(n,()=>Uu(n,m,a+(_===0?34:0),h,c-(_===0?34:0),_===f.length-1),r),h+=42}),d===0&&f.length,h+=16})),e.steps&&(h+=8,n.font=`28px ${yi}`,Nt(n,()=>n.fillText("Procedure",a,h),r),h+=46,n.font=`30px ${Ls}`,e.steps.forEach((u,d)=>{let f=Ui(n,u,c-64);n.font=`30px ${Fi}`,Nt(n,()=>n.fillText(`${d+1}.`,a+6,h),r),n.font=`30px ${Ls}`,f.forEach(m=>{Nt(n,()=>n.fillText(m,a+56,h),r),h+=40}),h+=6})),e.diagram){let u=h+10,d=ii-no.b-(e.caption?70:20);jM(n,e.diagram,a,u,c,d-u,r),h=d}if(e.caption){n.font=`italic 27px ${_i}`,n.textAlign="center",n.fillStyle=to;for(let u of Ui(n,e.caption,c-40))Nt(n,()=>n.fillText(u,(a+l)/2,h+30),r),h+=36;n.fillStyle=un}Ou(n,e.notes,s)}function JM(n,e,t){let i=gn/2-12;n.textAlign="center",n.fillStyle=un,n.strokeStyle=un,n.lineWidth=3,n.strokeRect(96,110,gn-220,ii-230),n.lineWidth=1,n.strokeRect(108,122,gn-244,ii-254),n.font=`30px ${yi}`,Nt(n,()=>n.fillText("The Hartwell Lift & Hoist Company",i,230),t),Fu(n,i,290),n.font=`44px ${Fi}`,Nt(n,()=>n.fillText("THE",i,420),t),n.font=`96px ${Fi}`,Nt(n,()=>n.fillText("ENGINEER\u2019S",i,530),t),Nt(n,()=>n.fillText("MANUAL",i,640),t),n.font=`italic 32px ${_i}`,Nt(n,()=>n.fillText("for the Safe Operation & Repair",i,720),t),Nt(n,()=>n.fillText("of the Passenger Car",i,762),t),n.fillStyle="#6a1013",n.font="italic 500 30px 'Lora', Georgia, serif",Nt(n,()=>n.fillText("\u0420\u0443\u043A\u043E\u0432\u043E\u0434\u0441\u0442\u0432\u043E \u0438\u043D\u0436\u0435\u043D\u0435\u0440\u0430 \xB7 \u0438\u0437\u0434\u0430\u043D\u0438\u0435 \u0434\u043B\u044F \u043A\u0430\u0431\u0438\u043D\u044B \u2116 7",i,818),t),n.fillStyle=un,n.save(),n.translate(i,950),n.lineWidth=2.2;for(let s=0;s<24;s++){let r=s/24*Math.PI*2;n.save(),n.rotate(r),n.fillRect(-7,-118,14,20),n.restore()}n.beginPath(),n.arc(0,0,100,0,7),n.stroke(),n.beginPath(),n.arc(0,0,86,0,7),n.stroke();for(let s=-70;s<70;s+=7)n.lineWidth=.8,n.beginPath(),n.moveTo(s,-Math.sqrt(7396-s*s)),n.lineTo(s,Math.sqrt(7396-s*s)),n.globalAlpha=.35,n.stroke(),n.globalAlpha=1;n.fillStyle="#d9c597",n.fillRect(-36,-54,72,108),n.lineWidth=3,n.strokeRect(-36,-54,72,108);for(let s=-28;s<=28;s+=14)n.beginPath(),n.moveTo(s,-46),n.lineTo(s,46),n.stroke();n.beginPath(),n.moveTo(0,-54),n.lineTo(0,-86),n.stroke(),n.restore(),n.fillStyle=un,n.font=`28px ${yi}`,Nt(n,()=>n.fillText("Seventh Edition \xB7 Revised",i,1160),t),n.font=`italic 26px ${_i}`,Nt(n,()=>n.fillText("London \xB7 MDCCCLXXXIX",i,1200),t),Ou(n,[{text:"property of car no. 7",x:.66,y:.085,angle:-3,ink:"pencil"}],-1)}function Ou(n,e,t){for(let i of e||[]){if(n.save(),n.translate(i.x*gn,i.y*ii),n.rotate((i.angle||0)*Math.PI/180),n.font=`${Math.round(44*(i.size||1))}px ${ZM}`,n.textAlign="center",n.fillStyle=i.ink==="red"?wc:i.ink==="pencil"?nm:un,n.globalAlpha=i.ink==="pencil"?.85:.9,n.fillText(i.text,0,0),i.ink==="red"){n.strokeStyle=wc,n.lineWidth=2.4;let s=n.measureText(i.text).width;n.beginPath(),n.moveTo(-s/2,10),n.quadraticCurveTo(0,16,s/2,7),n.stroke()}n.restore()}}function la(n,e,t,i,s,r){let o=Math.max(2,Math.round(Math.hypot(i-e,s-t)/24));n.beginPath(),n.moveTo(e,t);for(let a=1;a<=o;a++){let l=a/o;n.lineTo(e+(i-e)*l+(a<o?(r()-.5)*1.2:0),t+(s-t)*l+(a<o?(r()-.5)*1.2:0))}n.stroke()}function Tc(n,e,t,i,s,r=7,o=.4){n.save(),n.beginPath(),n.rect(e,t,i,s),n.clip(),n.strokeStyle=un,n.globalAlpha=o,n.lineWidth=1;for(let a=-s;a<i;a+=r)n.beginPath(),n.moveTo(e+a,t+s),n.lineTo(e+a+s,t),n.stroke();n.restore()}function jM(n,e,t,i,s,r,o){n.save(),n.strokeStyle=un,n.fillStyle=un,n.lineWidth=2.4,n.lineCap="round",n.textAlign="center";let a=t+s/2;if(e.type==="wiring"){let l=e.terminals.length,c=i+60,h=i+r-60,u={x:t+30,y:c-40,w:s-60,h:h-c+80};n.lineWidth=4,n.strokeRect(u.x,u.y,u.w,u.h),n.lineWidth=1.4,n.strokeRect(u.x+10,u.y+10,u.w-20,u.h-20);for(let[_,p]of[[u.x+26,u.y+26],[u.x+u.w-26,u.y+26],[u.x+26,u.y+u.h-26],[u.x+u.w-26,u.y+u.h-26]])n.beginPath(),n.arc(_,p,9,0,7),n.stroke(),n.beginPath(),n.moveTo(_-6,p),n.lineTo(_+6,p),n.stroke();let d=_=>c+30+_*(h-c-60)/(l-1),f=u.x+120,m=u.x+u.w-120;e.wires.forEach((_,p)=>{let g=d(_.from),T=d(_.to);n.lineWidth=_.pattern==="double"?2:4.5,n.setLineDash(_.pattern==="dashed"?[22,12]:_.pattern==="dotted"?[3,11]:[]);let x=()=>{n.beginPath(),n.moveTo(f,g),n.bezierCurveTo(f+160,g,m-160,T,m,T),n.stroke()};_.pattern==="double"?(n.save(),n.translate(0,-4),x(),n.restore(),n.save(),n.translate(0,4),x(),n.restore()):x(),n.setLineDash([]),n.font=`italic 24px ${_i}`,n.fillText(_.label,(f+m)/2+(p%2?60:-60),(g+T)/2-12)}),e.terminals.forEach((_,p)=>{for(let[g,T]of[[f,"right"],[m,"left"]])n.fillStyle="#d9c597",n.beginPath(),n.arc(g,d(p),14,0,7),n.fill(),n.fillStyle=un,n.lineWidth=3,n.stroke(),n.beginPath(),n.arc(g,d(p),4,0,7),n.fill(),n.font=`34px ${Fi}`,n.textAlign=T,n.fillText(_,g+(T==="right"?-30:30),d(p)+11),n.textAlign="center"}),n.font=`22px ${yi}`,n.fillText("Travelling cable \u2193",a,u.y-14)}else if(e.type==="cutting"){let l=Math.min(118,(r-70)/e.rows.length),c=i+50;n.lineWidth=3,n.strokeRect(t,i,s,l*e.rows.length+50),n.font=`26px ${yi}`,n.textAlign="left",n.fillText("If \u2014 condition",t+20,i+34),n.textAlign="right",n.fillText("then",t+s-20,i+34),Tc(n,t,i,s,50,9,.12),e.rows.forEach((h,u)=>{n.lineWidth=1.4,n.beginPath(),n.moveTo(t,c),n.lineTo(t+s,c),n.stroke(),n.textAlign="left",n.font=`30px ${Fi}`,n.fillText(`${u+1}.`,t+16,c+44),n.font=`28px ${Ls}`,Ui(n,h.condition,s*.58).forEach((f,m)=>n.fillText(f,t+60,c+44+m*34)),n.textAlign="right",n.font=`italic 29px ${_i}`,Ui(n,h.action,s*.3).forEach((f,m)=>n.fillText(f,t+s-18,c+44+m*34)),c+=l}),n.save(),n.translate(t+s-86,i+r-70),n.rotate(-.5),n.lineWidth=3,n.beginPath(),n.ellipse(-46,-14,22,13,.2,0,7),n.stroke(),n.beginPath(),n.ellipse(-46,16,22,13,-.2,0,7),n.stroke(),n.beginPath(),n.moveTo(-26,-8),n.lineTo(60,6),n.lineTo(-26,10),n.moveTo(-26,12),n.lineTo(60,-4),n.stroke(),n.restore()}else if(e.type==="gauge"){let l=Math.min(s,r)*.42,c=i+r*.5,h=Math.PI*.75,u=Math.PI*2.25,d=m=>h+(m-e.min)/(e.max-e.min)*(u-h);n.lineWidth=9,n.beginPath(),n.arc(a,c,l+18,0,7),n.stroke(),n.lineWidth=2,n.beginPath(),n.arc(a,c,l+6,0,7),n.stroke(),n.save(),n.beginPath(),n.arc(a,c,l-6,d(e.safeFrom),d(e.safeTo)),n.arc(a,c,l-50,d(e.safeTo),d(e.safeFrom),!0),n.closePath(),n.clip(),Tc(n,a-l,c-l,l*2,l*2,6,.55),n.restore();for(let m=e.min;m<=e.max;m+=5){let _=d(m),p=m%20===0;n.lineWidth=p?4:1.6,n.beginPath(),n.moveTo(a+Math.cos(_)*(l-(p?34:18)),c+Math.sin(_)*(l-(p?34:18))),n.lineTo(a+Math.cos(_)*l,c+Math.sin(_)*l),n.stroke(),p&&(n.font=`32px ${Fi}`,n.fillText(String(m),a+Math.cos(_)*(l-70),c+Math.sin(_)*(l-70)+11))}n.font=`italic 26px ${_i}`,n.fillText(e.unit,a,c+l*.45),n.font=`24px ${yi}`,n.fillText("Buffer pressure",a,c-l*.35);let f=d(e.needle);n.lineWidth=5,la(n,a-Math.cos(f)*30,c-Math.sin(f)*30,a+Math.cos(f)*(l-22),c+Math.sin(f)*(l-22),o),n.beginPath(),n.arc(a,c,16,0,7),n.fill()}else if(e.type==="power"){let l=e.cells,c=(s-80)/l,h=i+110,u=Math.min(260,r*.45);n.font=`26px ${yi}`,n.fillText(e.label,a,i+40),n.lineWidth=3,la(n,t+40,i+70,t+s-40,i+70,o);for(let f=0;f<l;f++){let m=t+40+f*c+10,_=c-20;n.lineWidth=3,n.strokeRect(m,h,_,u),Tc(n,m,h+u*.55,_,u*.45,6,.35),n.fillRect(m+_*.2,h-16,_*.2,16),n.fillRect(m+_*.6,h-16,_*.2,16),n.lineWidth=2,la(n,m+_*.3,h-16,m+_*.3,i+70,o),n.font=`34px ${Fi}`,n.fillText(String(f+1),m+_/2,h+u*.38),n.font=`italic 22px ${_i}`,n.fillText(f%2?"\u2212":"+",m+_/2,h+u+36)}let d=h+u+120;n.lineWidth=3,n.beginPath(),n.arc(a-80,d,10,0,7),n.stroke(),n.beginPath(),n.arc(a+80,d,10,0,7),n.stroke(),n.beginPath(),n.moveTo(a-72,d-6),n.lineTo(a+70,d-60),n.stroke(),n.font=`italic 26px ${_i}`,n.fillText("Isolating switch (shown open)",a,d+60)}else if(e.type==="gears"){let l=(_,p,g,T,x)=>{n.beginPath();for(let v=0;v<g*4;v++){let M=x+v/(g*4)*Math.PI*2,E=v%4<2?T:T*.86;n.lineTo(_+Math.cos(M)*E,p+Math.sin(M)*E)}n.closePath(),n.lineWidth=3,n.stroke(),n.save(),n.clip(),Tc(n,_-T,p-T,T*2,T*2,8,.18),n.restore(),n.beginPath(),n.arc(_,p,T*.62,0,7),n.stroke(),n.beginPath(),n.arc(_,p,T*.16,0,7),n.fill();for(let v=0;v<5;v++){let M=x+v/5*Math.PI*2;n.lineWidth=6,n.beginPath(),n.moveTo(_+Math.cos(M)*T*.16,p+Math.sin(M)*T*.16),n.lineTo(_+Math.cos(M)*T*.62,p+Math.sin(M)*T*.62),n.stroke()}},[c,h,u]=e.teeth,d=Math.min(s*.3,r*.28),f=d*h/c,m=d*u/c;l(t+d+20,i+d+40,c,d,0),l(t+d*2+f+14,i+d+40,h,f,.2),l(t+d*2+f+6,i+d*2+m+60,u,m,.1),n.font=`italic 26px ${_i}`,n.fillText(`A \u2014 ${c} teeth`,t+d+20,i+d*2+90),n.fillText(`B \u2014 ${h}`,t+d*2+f+14,i+26),n.fillText(`C \u2014 ${u}`,t+d*2+f+6,i+d*3+m*2+110>i+r?i+r-10:i+d*2+m*2+100),n.save(),n.strokeStyle=wc,n.lineWidth=3,n.beginPath(),n.arc(t+d*2+f+14+f*.9,i+d+40,18,0,7),n.stroke(),n.restore()}else if(e.type==="symbols"){let c=Math.ceil(e.symbols.length/2),h=s/2,u=Math.min(240,r/c);e.symbols.forEach((m,_)=>{let p=t+_%2*h+h/2,g=i+Math.floor(_/2)*u+80;QM(n,m.glyph,p,g,58),n.font=`27px ${Ls}`,n.fillStyle=un,n.fillText(m.meaning,p,g+104),n.font=`22px ${yi}`,n.fillText(`No. ${_+1}`,p,g+132)}),n.strokeStyle=wc,n.lineWidth=4;let d=t+h*1.5,f=i+u*2+80;la(n,d-70,f-60,d+70,f+60,o),la(n,d+70,f-60,d-70,f+60,o)}else if(e.type==="checklist"){let l=i+40;n.textAlign="left",e.items.forEach((c,h)=>{n.lineWidth=2.5,n.strokeRect(t+10,l-30,36,36),n.font=`30px ${Fi}`,n.fillText(`${h+1}.`,t+64,l),n.font=`30px ${Ls}`;let u=Ui(n,c,s-130);u.forEach((d,f)=>n.fillText(d,t+112,l+f*38)),h<3&&(n.save(),n.strokeStyle=nm,n.lineWidth=4,n.beginPath(),n.moveTo(t+14,l-14),n.lineTo(t+26,l),n.lineTo(t+52,l-42),n.stroke(),n.restore()),l+=38*u.length+34})}n.restore()}function QM(n,e,t,i,s){n.save(),n.translate(t,i),n.strokeStyle=un,n.fillStyle=un,n.lineWidth=4,n.lineJoin="round",n.beginPath(),n.moveTo(0,-s),n.lineTo(s*1.1,s*.8),n.lineTo(-s*1.1,s*.8),n.closePath(),n.stroke(),n.lineWidth=1.5,n.beginPath(),n.moveTo(0,-s+14),n.lineTo(s*1.1-16,s*.8-7),n.lineTo(-s*1.1+16,s*.8-7),n.closePath(),n.stroke(),n.lineWidth=3.5;let r=s/58;if(n.scale(r,r),n.translate(0,12),e==="bolt")n.beginPath(),n.moveTo(6,-36),n.lineTo(-14,4),n.lineTo(2,4),n.lineTo(-6,30),n.lineTo(16,-8),n.lineTo(0,-8),n.closePath(),n.fill();else if(e==="skull")n.beginPath(),n.arc(0,-8,20,Math.PI*.85,Math.PI*2.15),n.lineTo(10,18),n.lineTo(-10,18),n.closePath(),n.fill(),n.fillStyle="#d9c597",n.beginPath(),n.arc(-8,-6,6,0,7),n.arc(8,-6,6,0,7),n.fill(),n.fillStyle=un,n.lineWidth=5,n.beginPath(),n.moveTo(-24,22),n.lineTo(24,34),n.moveTo(24,22),n.lineTo(-24,34),n.stroke();else if(e==="flame")n.beginPath(),n.moveTo(0,30),n.bezierCurveTo(-26,26,-22,-6,-4,-34),n.bezierCurveTo(-2,-14,14,-14,10,-30),n.bezierCurveTo(30,-6,24,26,0,30),n.fill();else if(e==="gear"){n.beginPath();for(let o=0;o<32;o++){let a=o/32*Math.PI*2,l=o%4<2?28:21;n.lineTo(Math.cos(a)*l,Math.sin(a)*l)}n.closePath(),n.fill(),n.fillStyle="#d9c597",n.beginPath(),n.arc(0,0,9,0,7),n.fill()}else if(e==="drop")n.beginPath(),n.moveTo(0,-32),n.bezierCurveTo(10,-10,22,2,22,12),n.arc(0,12,22,0,Math.PI),n.bezierCurveTo(-22,2,-10,-10,0,-32),n.fill();else if(e==="eye")n.beginPath(),n.moveTo(-30,0),n.quadraticCurveTo(0,-26,30,0),n.quadraticCurveTo(0,26,-30,0),n.stroke(),n.beginPath(),n.arc(0,0,9,0,7),n.fill();else if(e==="hand"){n.beginPath(),n.roundRect(-14,-4,30,32,8),n.fill();for(let o=0;o<4;o++)n.beginPath(),n.roundRect(-14+o*8,-30+Math.abs(o-1.5)*4,7,30,3.5),n.fill();n.beginPath(),n.roundRect(14,-2,16,7,3.5),n.fill()}else e==="triangle"&&(n.font="bold 54px 'IM Fell DW Pica', serif",n.textAlign="center",n.fillText("!",0,18));n.restore()}function im(n,e,t,i,s){let r=n.getContext("2d"),o=n.width/gn;r.setTransform(o,0,0,o,0,0),r.imageSmoothingQuality="high",tm(r,e[t],t,i);let a=t%2?t+1:t-1;if(a>=0&&a<e.length&&e[a].layout!=="endpaper"){let l=s.getContext("2d");l.setTransform(1,0,0,1,0,0),l.clearRect(0,0,gn,ii),l.save(),l.globalCompositeOperation="source-over",tm(l,e[a],a,i),l.restore(),r.save(),r.globalAlpha=.045,r.globalCompositeOperation="multiply",r.translate(gn,0),r.scale(-1,1),r.drawImage(s,0,0),r.restore()}r.setTransform(1,0,0,1,0,0)}function sm(){let n=document.createElement("canvas");n.width=512,n.height=256;let e=n.getContext("2d"),t=Vt(99);e.fillStyle="#cdb88a",e.fillRect(0,0,512,256);for(let s=0;s<256;s+=1){let r=t();e.fillStyle=r<.35?`rgba(90,60,25,${.25+t()*.35})`:`rgba(250,238,205,${t()*.25})`,e.fillRect(0,s,512,1)}for(let s=0;s<400;s++)e.fillStyle=`rgba(90,60,25,${t()*.25})`,e.fillRect(t()*512,t()*256,2+t()*30,1);let i=e.createLinearGradient(0,0,512,0);return i.addColorStop(0,"rgba(70,45,20,.35)"),i.addColorStop(.2,"rgba(70,45,20,0)"),i.addColorStop(.85,"rgba(70,45,20,0)"),i.addColorStop(1,"rgba(70,45,20,.3)"),e.fillStyle=i,e.fillRect(0,0,512,256),n}async function rm(n){let e=await fetch(n);if(!e.ok)throw new Error(`Manual rules ${e.status}`);let t=await e.json();if(!Array.isArray(t?.sections))throw new Error("Manual rules: sections missing");return t}function om(n){if(n.layoutPages)return n.layoutPages.length%2?[...n.layoutPages,{layout:"endpaper"}]:n.layoutPages;let e=[{layout:"title"},{layout:"contents",heading:"Contents",paragraphs:n.sections.map(t=>`${t.numeral}\u2003${t.title}`)}];for(let t of n.sections)for(let i of t.pages)e.push({kicker:`Section ${t.numeral}`,...i});return e.length%2&&e.push({layout:"endpaper"}),e}var Bu={edition:"Specimen edition \u2014 rules supplied at run time",specimen:!0,sections:[{id:"wiring",numeral:"I",title:"Electrical Wiring",pages:[{heading:"Electrical Wiring of the Car",paragraphs:["The car receives its current through the travelling cable, which descends from the machine room and terminates at the junction box beneath the operating panel.","Before any wire is disturbed the operator shall identify each conductor by its sheathing. Five patterns of sheathing are employed in this installation and are figured opposite."],steps:["Open the junction box with the brass key.","Count the conductors present.","Note the pattern of the uppermost wire.","Consult Section II before cutting."],notes:[{text:"never trust the colour \u2014 count them",x:.52,y:.86,angle:-4,ink:"pencil"}]},{heading:"Fig. 1 \u2014 Junction Box",diagram:{type:"wiring",terminals:["A","B","C","D","E"],wires:[{from:0,to:2,label:"Main",pattern:"solid"},{from:1,to:4,label:"Brake",pattern:"dashed"},{from:2,to:0,label:"Lamp",pattern:"dotted"},{from:3,to:3,label:"Bell",pattern:"double"},{from:4,to:1,label:"Earth",pattern:"solid"}]},caption:"Terminals A\u2013E viewed from the operator\u2019s side.",notes:[{text:"E is live even when off!",x:.6,y:.935,angle:-3,ink:"red"}]}]},{id:"cutting",numeral:"II",title:"Wire Cutting Protocols",pages:[{heading:"Protocol for Severing Conductors",paragraphs:["A conductor once cut cannot be restored within the car. The operator shall therefore read the whole of this table before the shears are applied.","Conditions are to be tested in the order printed. The first condition which holds true determines the wire to be cut; all later lines are to be disregarded."],notes:[{text:"first true line only",x:.2,y:.9,angle:3,ink:"red"}]},{heading:"Table II \u2014 Order of Cutting",diagram:{type:"cutting",rows:[{condition:"If there are exactly three wires",action:"cut the second"},{condition:"If no wire is dashed",action:"cut the last"},{condition:"If the gauge reads above 80",action:"cut the first dotted"},{condition:"If the bell wire is present",action:"cut the bell wire"},{condition:"Otherwise",action:"cut the uppermost"}]},caption:"Specimen table. The live table is printed for each descent."}]},{id:"pressure",numeral:"III",title:"Pressure Regulation",pages:[{heading:"The Hydraulic Buffer",paragraphs:["Beneath the car a column of oil arrests its descent. Should the pressure fall below the safe band the car will strike the pit; should it rise above, the relief valve will vent scalding fluid into the shaft."],steps:["Read the gauge at eye level.","Turn the regulator one quarter for every ten pounds outside the band.","Wait for the needle to settle before turning again."],notes:[{text:"slowly. it sticks at 60",x:.55,y:.82,angle:-6,ink:"pencil"}]},{heading:"Fig. 3 \u2014 Buffer Gauge",diagram:{type:"gauge",min:0,max:120,unit:"lb / sq. in.",safeFrom:45,safeTo:75,needle:88},caption:"The shaded arc marks the safe band."}]},{id:"circuits",numeral:"IV",title:"Electrical Circuits",pages:[{heading:"Reading a Circuit Plate",paragraphs:["Every panel of the car carries a plate showing its circuit. Lamps are drawn as circles, switches as hinged lines, fuses as small rectangles.","A circuit is complete only when every switch upon its path is closed. The operator shall trace the path with a finger from the source to the lamp before throwing any switch."],steps:["Find the source marked +.","Follow the line to each switch in turn.","Close only the switches that lie upon the path.","Leave all others open."],notes:[{text:"dead ends are traps",x:.6,y:.9,angle:-4,ink:"red"}]},{heading:"Plate IV \u2014 Warning Marks",diagram:{type:"symbols",symbols:[{glyph:"bolt",meaning:"Live conductor"},{glyph:"flame",meaning:"Heat / vent"},{glyph:"gear",meaning:"Moving parts"},{glyph:"drop",meaning:"Hydraulic fluid"},{glyph:"skull",meaning:"Fatal \u2014 do not touch"},{glyph:"eye",meaning:"Observe only"},{glyph:"hand",meaning:"Operate by hand"},{glyph:"triangle",meaning:"General hazard"}]},caption:"Where two marks appear together, the upper governs."}]},{id:"codes",numeral:"V",title:"Emergency Access Codes",pages:[{heading:"Deriving the Access Code",paragraphs:["The emergency hatch is sealed by a four-figure combination. The combination is never written down; it is derived afresh from the instruments of the car.","Take the figures in order from the plates named below. Where a plate shows no figure, use the number of rivets upon it."],steps:["First figure: the floor indicator, last digit.","Second: the number of lamps lit.","Third: the gauge reading, first digit.","Fourth: the sum of the first three, last digit."],notes:[{text:"specimen rule \u2014 live rule changes each descent",x:.5,y:.92,angle:-2,ink:"pencil",size:.8}]},{heading:"Table V \u2014 Code Corrections",diagram:{type:"cutting",rows:[{condition:"If any figure is 0",action:"read it as 9"},{condition:"If two figures are equal",action:"add one to the later"},{condition:"If the bell has rung",action:"reverse the order"},{condition:"Otherwise",action:"enter as derived"}]},caption:"Apply corrections from top to bottom."}]},{id:"power",numeral:"VI",title:"Power Restoration",pages:[{heading:"Emergency Accumulators",paragraphs:["When the main supply fails the car may be lowered upon its own accumulator bank. The bank holds sufficient charge for a single descent of not more than three floors.","Cells are to be engaged in sequence from the left. A cell engaged out of turn will discharge the whole bank."],steps:["Throw the isolating switch.","Engage cells one by one.","Release the brake only when the lamp burns steady."]},{heading:"Fig. 4 \u2014 Accumulator Bank",diagram:{type:"power",cells:6,label:"To brake solenoid"},notes:[{text:"cell 4 cracked \u2014 skip?",x:.58,y:.74,angle:5,ink:"red"}]}]},{id:"mechanical",numeral:"VII",title:"Mechanical Repair",pages:[{heading:"Failure of the Winding Gear",paragraphs:["A slipping car is most often caused by a stripped pinion. Listen for an irregular knocking: one knock for each missing tooth.","The governor will trip only when the car exceeds its rated speed by one half. Do not rely upon it."],notes:[{text:"it did not trip for us",x:.18,y:.88,angle:-3,ink:"pencil"}]},{heading:"Fig. 5 \u2014 Gear Train",diagram:{type:"gears",teeth:[24,12,18]},caption:"Driving wheel, pinion and governor wheel."}]},{id:"emergency",numeral:"VIII",title:"Emergency Procedures",pages:[{heading:"In the Event of Arrest Between Floors",diagram:{type:"checklist",items:["Remain calm. Do not force the gate.","Sound the bell three times.","Isolate the main supply.","Inspect the junction box (Sect. I).","Regulate the buffer (Sect. III).","Derive the hatch code (Sect. V).","Restore power (Sect. VI).","Release the brake by hand."]}},{heading:"Final Note",paragraphs:["If these procedures fail, the operator shall record the hour and the names of all persons within the car upon the last page of this manual."],notes:[{text:"the last page is full",x:.5,y:.62,angle:-8,ink:"red",size:1.4}]}]}]};function am(){return{edition:"Form VII",specimen:!1,sections:[],layoutPages:[{layout:"title"},{layout:"guide"},{layout:"rules",section:0,half:0},{layout:"rules",section:0,half:1},{layout:"rules",section:1,half:0},{layout:"rules",section:1,half:1},{layout:"rules",section:2,half:0},{layout:"rules",section:2,half:1}]}}var lm=new URLSearchParams(location.search).has("bake"),cm={};window.__bakedOut=cm;async function Ec(n,e){if(lm)return null;let t=new Zn;try{return await Promise.all(n.map((i,s)=>t.loadAsync(`${vi}baked/${i}.jpg`).then(r=>(r.colorSpace=e.srgb[s]?nt:Ft,r.flipY=e.flipY,r.anisotropy=e.aniso,r.needsUpdate=!0,r))))}catch{return null}}function rr(n,e){lm&&(cm[n]=e.image)}var vi="textures/";async function ex(n){let e=await fetch(n);if(!e.ok)throw new Error(`Missing texture ${n}`);return createImageBitmap(await e.blob())}function Jn(n,e){let t=document.createElement("canvas");return t.width=n,t.height=e,t}function ku(n,e,t,i){let s=Jn(e,t),r=s.getContext("2d",{willReadFrequently:!0}),o=e/i,a=o*n.height/n.width;for(let l=0;l<t;l+=a)for(let c=0;c<e;c+=o)r.drawImage(n,c,l,o,a);return r.getImageData(0,0,e,t)}function hm(n,e){let t=n.canvas,i=Jn(t.width,t.height),s=i.getContext("2d");s.filter=`blur(${e}px)`,s.drawImage(t,0,0),n.clearRect(0,0,t.width,t.height),n.drawImage(i,0,0)}async function um(){let[n,e,t]=await Promise.all(["brown_leather_albedo_1k.jpg","brown_leather_nor_gl_1k.jpg","brown_leather_rough_1k.jpg"].map(i=>ex(vi+i)));return{albedo:n,normal:e,rough:t}}async function Ac(n,e,t,i){let s=await Ec([`${i}-map`,`${i}-normal`,`${i}-orm`],{srgb:[!0,!1,!1],flipY:!0,aniso:t});if(s)return{map:s[0],normalMap:s[1],orm:s[2]};let r=tx(await n(),e,t);return rr(`${i}-map`,r.map),rr(`${i}-normal`,r.normalMap),rr(`${i}-orm`,r.orm),r}function tx(n,e,t){let{w:i,h:s}=e,r=Vt(e.seed),o=ku(n.albedo,i,s,e.tiles),a=ku(n.normal,i,s,e.tiles),l=ku(n.rough,i,s,e.tiles),c=Jn(i,s),h=c.getContext("2d",{willReadFrequently:!0});h.fillStyle="#000",h.fillRect(0,0,i,s),e.tooling?.(h,i,s);let u=h.getImageData(0,0,i,s);hm(h,1.6);let d=h.getImageData(0,0,i,s),f=Jn(i,s),m=f.getContext("2d",{willReadFrequently:!0});m.fillStyle="#000",m.fillRect(0,0,i,s),m.strokeStyle="#fff",m.lineCap="round";let _=(B,W,ne,oe,Ue,$e)=>{m.lineWidth=Ue,m.beginPath(),m.moveTo(B,W);for(let Xe=0;Xe<oe;Xe++)ne+=(r()-.5)*.7,B+=Math.cos(ne)*5,W+=Math.sin(ne)*5,m.lineTo(B,W),$e<2&&r()<.04&&(m.stroke(),_(B,W,ne+(r()<.5?1:-1)*(.6+r()),oe*.4,Ue*.6,$e+1),m.beginPath(),m.moveTo(B,W));m.stroke()};for(let B=0;B<26;B++)_(r()*i,r()*s,r()*7,12+r()*40,1.2+r()*1.6,0);for(let B=0;B<140;B++){let W=r()<.5,ne=W?r()<.5?r()*i*.12:i-r()*i*.12:r()*i,oe=W?r()*s:r()<.5?r()*s*.1:s-r()*s*.1;_(ne,oe,r()*7,3+r()*8,.8,2)}let p=m.getImageData(0,0,i,s);hm(m,1.2);let g=m.getImageData(0,0,i,s),T=Jn(i,s),x=T.getContext("2d",{willReadFrequently:!0});x.fillStyle="#000",x.fillRect(0,0,i,s);for(let B=0;B<9;B++){let W=r()*i,ne=r()*s,oe=20+r()*110,Ue=x.createRadialGradient(W,ne,0,W,ne,oe);Ue.addColorStop(0,`rgba(255,255,255,${.25+r()*.5})`),Ue.addColorStop(.7,`rgba(255,255,255,${.1+r()*.2})`),Ue.addColorStop(1,"rgba(255,255,255,0)"),x.fillStyle=Ue,x.beginPath(),x.ellipse(W,ne,oe,oe*(.5+r()*.5),r()*3,0,7),x.fill()}let v=Jn(i,s),M=v.getContext("2d",{willReadFrequently:!0});M.fillStyle="#000",M.fillRect(0,0,i,s),M.strokeStyle="#fff";for(let B=0;B<70;B++){let W=r()*i,ne=r()*s,oe=r()*7,Ue=20+r()*180;M.globalAlpha=.25+r()*.6,M.lineWidth=.6+r()*1.4,M.beginPath(),M.moveTo(W,ne),M.quadraticCurveTo(W+Math.cos(oe+.2)*Ue*.5,ne+Math.sin(oe+.2)*Ue*.5,W+Math.cos(oe)*Ue,ne+Math.sin(oe)*Ue),M.stroke()}let E=M.getImageData(0,0,i,s),A=x.getImageData(0,0,i,s),y=Jn(i>>3,s>>3),S=y.getContext("2d",{willReadFrequently:!0}),I=S.createImageData(y.width,y.height);for(let B=0;B<I.data.length;B+=4){let W=110+r()*50;I.data[B]=I.data[B+1]=I.data[B+2]=W,I.data[B+3]=255}S.putImageData(I,0,0);let D=Jn(i,s),F=D.getContext("2d",{willReadFrequently:!0});F.filter="blur(18px)",F.drawImage(y,0,0,i,s);let R=F.getImageData(0,0,i,s),P=new ImageData(i,s),N=new ImageData(i,s),O=new ImageData(i,s),X=e.edgeWear??1,J=(B,W,ne)=>B.data[(Math.min(s-1,Math.max(0,ne))*i+Math.min(i-1,Math.max(0,W)))*4]/255;for(let B=0;B<s;B++)for(let W=0;W<i;W++){let ne=(B*i+W)*4,oe=Math.min(W,i-1-W),Ue=Math.min(B,s-1-B),$e=Math.min(oe,Ue),Xe=Math.max(0,1-Math.hypot(Math.max(0,90-oe),Math.max(0,90-Ue))/-90*-1),Z=Math.max(0,1-$e/(26+18*J(R,W,B)))*X,Q=Math.min(1,Math.max(0,(180-Math.hypot(oe,Ue))/180))*X*(oe<120&&Ue<120?1:0),de=Math.min(1,Z*.85+Q*.6)*(.6+.4*Math.sin(W*.05+B*.031)**2),De=J(u,W,B),pe=J(p,W,B),xe=A.data[ne]/255,Ze=E.data[ne]/255,te=J(R,W,B)/.53,le=De>.7?1:0,ue=De>.2&&De<=.7?1:0,ce=le&&(Math.sin(W*12.9898+B*78.233)*43758.5453%1+1)%1>.22+de*.6?1:0,fe=o.data[ne],Le=o.data[ne+1],G=o.data[ne+2],re=(fe*.3+Le*.59+G*.11)/255;fe=(36+re*58)*te,Le=(21+re*34)*te,G=(13+re*18)*te,ue&&(fe*=.62,Le*=.6,G*=.58),fe+=(104-fe)*de*.5,Le+=(74-Le)*de*.45,G+=(50-G)*de*.4,fe+=70*Ze*(1-de),Le+=52*Ze*(1-de),G+=36*Ze*(1-de),fe*=1-xe*.38,Le*=1-xe*.42,G*=1-xe*.45,fe*=1-pe*.65,Le*=1-pe*.68,G*=1-pe*.7,ce&&(fe=168*(.8+.2*re),Le=128*(.8+.2*re),G=62*(.8+.2*re)),P.data[ne]=fe,P.data[ne+1]=Le,P.data[ne+2]=G,P.data[ne+3]=255;let Re=(J(d,W+1,B)-J(d,W-1,B))*2.2+(J(g,W+1,B)-J(g,W-1,B))*1.8,U=(J(d,W,B+1)-J(d,W,B-1))*2.2+(J(g,W,B+1)-J(g,W,B-1))*1.8,Ce=1-de*.55-ce*.8,Ke=(a.data[ne]/255*2-1)*Ce+Re,L=(a.data[ne+1]/255*2-1)*Ce-U,b=a.data[ne+2]/255*2-1,H=Math.hypot(Ke,L,b)||1;N.data[ne]=(Ke/H*.5+.5)*255,N.data[ne+1]=(L/H*.5+.5)*255,N.data[ne+2]=(b/H*.5+.5)*255,N.data[ne+3]=255;let j=.5+l.data[ne]/255*.32-xe*.3-de*.16-Ze*.1+pe*.2;ce&&(j=.38+de*.2),O.data[ne]=255*(1-pe*.55-ue*.2),O.data[ne+1]=255*Math.min(1,Math.max(.18,j)),O.data[ne+2]=ce?230:0,O.data[ne+3]=255}let z=(B,W)=>{let ne=Jn(i,s);ne.getContext("2d").putImageData(B,0,0);let oe=new an(ne);return oe.colorSpace=W?nt:Ft,oe.anisotropy=t,oe.generateMipmaps=!0,oe.minFilter=mn,oe.needsUpdate=!0,oe};return{map:z(P,!0),normalMap:z(N,!1),orm:z(O,!1)}}function Rc(n){return new Je({map:n.map,normalMap:n.normalMap,normalScale:new ae(1.15,1.15),roughnessMap:n.orm,metalnessMap:n.orm,aoMap:n.orm,aoMapIntensity:.9,roughness:1,metalness:1,sheen:.35,sheenRoughness:.55,sheenColor:new Ne("#6b4a32"),clearcoat:.12,clearcoatRoughness:.55,envMapIntensity:.8})}function dm(n){let t=Jn(512,512),i=t.getContext("2d",{willReadFrequently:!0}),s=Vt(4242),r=i.createImageData(512,512),o=i.createImageData(512,512),a=Jn(512,512),l=a.getContext("2d",{willReadFrequently:!0});for(let d=0;d<220;d++){let f=s()*512,m=s()*512,_=6+s()*60,p=l.createRadialGradient(f,m,0,f,m,_);p.addColorStop(0,`rgba(255,255,255,${s()*.7})`),p.addColorStop(1,"rgba(255,255,255,0)"),l.fillStyle=p,l.fillRect(f-_,m-_,_*2,_*2)}let c=l.getImageData(0,0,512,512);for(let d=0;d<512*512*4;d+=4){let f=c.data[d+3]/255*(c.data[d]/255),m=s(),_=Math.max(0,f-.35)*1.6,p=Math.min(1,f*1.2),g=198-p*70,T=154-p*58,x=86-p*36;g+=(78-g)*_,T+=(104-T)*_,x+=(78-x)*_,g+=m*10,T+=m*8,r.data[d]=g,r.data[d+1]=T,r.data[d+2]=x,r.data[d+3]=255,o.data[d]=255*(1-_*.35),o.data[d+1]=255*Math.min(1,.26+p*.3+_*.4+m*.08),o.data[d+2]=255*(1-_*.85),o.data[d+3]=255}let h=(d,f)=>{let m=Jn(512,512);m.getContext("2d").putImageData(d,0,0);let _=new an(m);return _.colorSpace=f?nt:Ft,_.wrapS=_.wrapT=rn,_.repeat.set(24,24),_.anisotropy=n,_},u=h(o,!1);return new Je({map:h(r,!0),roughnessMap:u,metalnessMap:u,aoMap:u,roughness:1,metalness:1,envMapIntensity:1.1,clearcoat:0})}function fm(n){let i=Jn(512,704),s=i.getContext("2d"),r=Vt(n);s.fillStyle="#5b2a20",s.fillRect(0,0,512,704);let o=["#1f3346","#8a6a3b","#2b1a14","#6f2f22","#c9b68a"];for(let u=0;u<900;u++){let d=r()*512,f=r()*704,m=4+r()*26;s.fillStyle=o[Math.floor(r()*o.length)],s.globalAlpha=.55,s.beginPath(),s.ellipse(d,f,m,m*(.5+r()),r()*3,0,7),s.fill()}let a=s.getImageData(0,0,512,704),l=s.createImageData(512,704);for(let u=0;u<704;u++)for(let d=0;d<512;d++){let f=Math.round(d+Math.sin(u*.045)*18+Math.sin(u*.011+d*.02)*10),m=Math.round(u+Math.sin(d*.06)*8),_=(Math.min(703,Math.max(0,m))*512+(f%512+512)%512)*4,p=(u*512+d)*4;l.data[p]=a.data[_]*.82,l.data[p+1]=a.data[_+1]*.8,l.data[p+2]=a.data[_+2]*.78,l.data[p+3]=255}s.putImageData(l,0,0);let c=s.createLinearGradient(0,0,512,0);c.addColorStop(0,"rgba(40,20,10,.45)"),c.addColorStop(.15,"rgba(40,20,10,0)"),s.globalAlpha=1,s.fillStyle=c,s.fillRect(0,0,512,704);let h=new an(i);return h.colorSpace=nt,h}function pm(n,e,t){let i=e*.07;n.strokeStyle="#888",n.lineWidth=7,n.strokeRect(i,i,e-i*2,t-i*2),n.lineWidth=3,n.strokeRect(i+18,i+18,e-i*2-36,t-i*2-36),n.strokeStyle="#fff",n.lineWidth=3.5,n.strokeRect(i+34,i+34,e-i*2-68,t-i*2-68),n.fillStyle="#fff",n.textAlign="center",n.font=`${e*.052}px 'IM Fell English SC', serif`,n.fillText("THE",e/2,t*.27),n.font=`${e*.105}px 'IM Fell DW Pica', serif`,n.fillText("ENGINEER\u2019S",e/2,t*.36),n.fillText("MANUAL",e/2,t*.45),n.lineWidth=3,n.strokeStyle="#fff",n.beginPath(),n.moveTo(e*.3,t*.5),n.lineTo(e*.7,t*.5),n.stroke(),n.font=`${e*.036}px 'IM Fell English', serif`,n.fillText("Hartwell Lift & Hoist Co.",e/2,t*.545),n.save(),n.translate(e/2,t*.7),n.strokeStyle="#888",n.lineWidth=6,n.beginPath(),n.arc(0,0,e*.11,0,7),n.stroke(),n.lineWidth=3,n.beginPath(),n.arc(0,0,e*.085,0,7),n.stroke(),n.fillStyle="#888";for(let s=0;s<20;s++)n.save(),n.rotate(s/20*Math.PI*2),n.fillRect(-6,-e*.135,12,e*.024),n.restore();n.fillStyle="#fff",n.font=`${e*.06}px 'IM Fell DW Pica', serif`,n.fillText("VII",0,e*.02),n.restore();for(let[s,r]of[[i+70,i+70],[e-i-70,i+70],[i+70,t-i-70],[e-i-70,t-i-70]]){n.save(),n.translate(s,r),n.fillStyle="#888";for(let o=0;o<4;o++)n.rotate(Math.PI/2),n.beginPath(),n.ellipse(0,-14,6,14,0,0,7),n.fill();n.restore()}}function mm(n,e,t){let i=e*.07;n.strokeStyle="#888",n.lineWidth=6,n.strokeRect(i,i,e-i*2,t-i*2),n.lineWidth=2.5,n.strokeRect(i+18,i+18,e-i*2-36,t-i*2-36)}function gm(n){return(e,t,i)=>{e.fillStyle="#fff",e.strokeStyle="#fff";for(let s of n){let r=s*i;e.lineWidth=3,e.beginPath(),e.moveTo(t*.12,r-22),e.lineTo(t*.88,r-22),e.moveTo(t*.12,r+22),e.lineTo(t*.88,r+22),e.stroke()}e.save(),e.translate(t/2,i*.36),e.rotate(Math.PI/2),e.font=`${t*.2}px 'IM Fell DW Pica', serif`,e.textAlign="center",e.textBaseline="middle",e.fillText("ENGINEER\u2019S MANUAL",0,0),e.restore(),e.save(),e.translate(t/2,i*.72),e.font=`${t*.2}px 'IM Fell DW Pica', serif`,e.textAlign="center",e.textBaseline="middle",e.fillText("VII",0,0),e.restore(),e.fillStyle="#888";for(let s=16;s<i;s+=26)for(let r of[.05,.95])e.beginPath(),e.ellipse(r*t,s,3.2,8,0,0,7),e.fill()}}var Jt=.18,Bt=.25,Mn=.04,dn=.0036,or=Jt-.0058,rs=Bt-.0075,zu=Mn-2*dn,Cc=gn,Pc=ii,_m=[.1,.22,.56,.66,.88],nx=n=>n<.5?4*n*n*n:1-(-2*n+2)**3/2,ca=(n,e,t)=>{let i=Math.min(1,Math.max(0,(t-n)/(e-n)));return i*i*(3-2*i)},Ic=class{constructor(e,t,i){this.flipU=i;this.mesh=new ge(this.geo,[e,t]),this.mesh.castShadow=this.mesh.receiveShadow=!0}mesh;geo=new pt;segX=22;segZ=2;thick=0;dip=0;width=or;surface(e){return this.thick-this.dip*(1-e)**2.4}build(e,t,i=or){if(Math.abs(e-this.thick)<1e-6&&Math.abs(t-this.dip)<1e-6&&Math.abs(i-this.width)<1e-6&&this.geo.attributes.position)return;this.width=i,this.thick=Math.max(6e-4,e),this.dip=Math.min(t,this.thick*.8);let s=[],r=[],o=[],a=[],l=(_,p,g,T)=>{let x=o.length,v=s.length/3;for(let M=0;M<=p;M++)for(let E=0;E<=_;E++){let[A,y,S,I,D]=g(E,M);s.push(A,y,S),r.push(I,D)}for(let M=0;M<p;M++)for(let E=0;E<_;E++){let A=v+M*(_+1)+E,y=A+1,S=A+_+1,I=S+1;o.push(A,S,y,y,S,I)}a.push([x,o.length-x,T])},c=this.width,h=_=>_*c,u=_=>-rs/2+_*rs,d=this.surface.bind(this),f=this.segX,m=_=>_/zu;l(f,this.segZ,(_,p)=>{let g=_/f,T=p/this.segZ;return[h(g),d(g),u(T),this.flipU?1-g:g,1-T]},0),l(1,1,(_,p)=>[c,_?0:d(1),u(1-p),p,m(_?0:d(1))],1),l(f,1,(_,p)=>{let g=_/f;return[h(g),p?0:d(g),-rs/2,g,m(p?0:d(g))]},1),l(f,1,(_,p)=>{let g=1-_/f;return[h(g),p?0:d(g),rs/2,g,m(p?0:d(g))]},1),l(1,1,(_,p)=>[0,_?d(0):0,u(1-p),p,m(_?d(0):0)],1),this.geo.dispose(),this.geo=new pt,this.geo.setAttribute("position",new ot(s,3)),this.geo.setAttribute("uv",new ot(r,2)),this.geo.setIndex(o);for(let[_,p,g]of a)this.geo.addGroup(_,p,g);this.geo.computeVertexNormals(),this.mesh.geometry=this.geo}},Lc=class n{root=new ct;inner=new ct;backBoard=new ct;frontBoard=new ct;spine;left;right;leaf;brass=[];openness=0;openFrom=0;openTo=0;openT=1;openDur=1;pages=[];content;spread=0;turning=null;settle=0;settleAmp=0;texL;texR;texFront;texBack;cache=new Map;scratch=document.createElement("canvas");leafGeo;leafSegX=40;leafSegZ=10;flutter=0;sounds=null;pickables=[];quality="high";creakAcc=0;onspread=e=>{};static async create(e,t,i){let s=new n;return s.quality=i,await document.fonts.load("30px 'IM Fell English'").catch(()=>{}),await Promise.all(["30px 'IM Fell English SC'","30px 'IM Fell DW Pica'","30px 'Caveat'","italic 30px 'IM Fell English'","400 30px 'Libre Caslon Text'","italic 400 30px 'Libre Caslon Text'","700 30px 'Libre Caslon Text'","500 30px 'Barlow Condensed'","700 30px 'Barlow Condensed'","700 30px 'IBM Plex Mono'","600 30px 'IBM Plex Mono'","600 30px 'Cinzel'","800 30px 'Cinzel'"].map(r=>document.fonts.load(r).catch(()=>{}))),await s.build(e,t),s}async build(e,t){let i=e.capabilities.getMaxAnisotropy(),s=this.quality==="high",r=Math.min(s?1.5:1.25,e.capabilities.maxTextureSize/ii);Cc=Math.round(gn*r),Pc=Math.round(ii*r);let o=null,a=()=>o||=um(),l=s?1024:640,c=Math.round(l*Bt/Jt),[h,u,d]=await Promise.all([Ac(a,{w:l,h:c,seed:11,tiles:2,tooling:pm},i,"leather-front"),Ac(a,{w:l,h:c,seed:29,tiles:2,tooling:mm},i,"leather-back"),Ac(a,{w:s?256:160,h:s?1408:880,seed:47,tiles:.5,tooling:gm(_m),edgeWear:.5},i,"leather-spine")]),f=Rc(h),m=Rc(u),_=Rc(d);_.side=bn;let p=dm(i);this.scratch.width=Cc,this.scratch.height=Pc;let g=()=>{let S=document.createElement("canvas");S.width=Cc,S.height=Pc;let I=new an(S);return I.colorSpace=nt,I.anisotropy=i,I.minFilter=mn,I};this.texL=g(),this.texR=g(),this.texFront=g(),this.texBack=g(),this.texBack.wrapS=rn,this.texBack.repeat.x=-1,this.texBack.offset.x=1;let T=(S,I,D=-1)=>{let F=new $t({map:S,side:I,color:new Ne("#cfc6b4"),roughness:.95,metalness:0,envMapIntensity:.15});return D>=0&&(F.onBeforeCompile=R=>{R.fragmentShader=R.fragmentShader.replace("#include <map_fragment>",`#include <map_fragment>
        { float g = abs(vMapUv.x - ${D.toFixed(1)}); diffuseColor.rgb *= mix(.42, 1., smoothstep(.0, .075, g)) * (1. + .07 * smoothstep(.06, .1, g) * (1. - smoothstep(.1, .16, g))); }`)}),F},x=new an(sm());x.colorSpace=nt,x.anisotropy=i;let v=new $t({map:x,roughness:.92,metalness:0,envMapIntensity:.4,side:bn});this.left=new Ic(T(this.texL,Hn,1),v,!0),this.right=new Ic(T(this.texR,Hn,0),v,!1);let M=new ss(Jt,dn,Bt,3,.0011);M.translate(Jt/2,-dn/2,0);{let S=M.attributes.position,I=M.attributes.uv;for(let D=0;D<S.count;D++)I.setXY(D,S.getX(D)/Jt,1-(S.getZ(D)+Bt/2)/Bt);I.needsUpdate=!0,M.setAttribute("uv1",I.clone())}let E=S=>new $t({map:fm(S),roughness:.8,metalness:0}),A=(S,I,D)=>{let F=new ge(M,I);F.castShadow=F.receiveShadow=!0,S.add(F);let R=new ge(new En(Jt-.012,Bt-.012),E(D));R.rotation.x=Math.PI/2,R.position.set(Jt/2+.002,-dn-15e-5,0),R.receiveShadow=!0,S.add(R);let P=new ge(ix(),p);P.castShadow=P.receiveShadow=!0,S.add(P),this.brass.push(P),this.pickables.push(F,P)};A(this.frontBoard,f,3),A(this.backBoard,m,8),this.backBoard.rotation.x=Math.PI,this.backBoard.scale.z=-1,this.frontBoard.add(this.left.mesh),this.backBoard.add(this.right.mesh),this.right.mesh.scale.y=-1,this.right.mesh.position.set(.002,-dn,0),this.left.mesh.scale.y=-1,this.left.mesh.position.set(.002,-dn,0),this.spine=new ge(new pt,_),this.spine.castShadow=this.spine.receiveShadow=!0,this.initSpine(),this.pickables.push(this.spine),this.leafGeo=new En(or,rs,this.leafSegX,this.leafSegZ),this.leafGeo.clearGroups();let y=this.leafGeo.index.count;this.leafGeo.addGroup(0,y,0),this.leafGeo.addGroup(0,y,1);{let S=this.leafGeo.attributes.uv;for(let I=0;I<S.count;I++){let D=I%(this.leafSegX+1),F=Math.floor(I/(this.leafSegX+1));S.setXY(I,D/this.leafSegX,1-F/this.leafSegZ)}}this.leaf=new ge(this.leafGeo,[T(this.texFront,Hn),T(this.texBack,vn)]),this.leaf.castShadow=this.leaf.receiveShadow=!0,this.leaf.visible=!1,this.leaf.frustumCulled=!1,this.inner.add(this.backBoard,this.frontBoard,this.spine,this.leaf),this.root.add(this.inner),this.root.traverse(S=>{S.userData.book=this}),this.setContent(t),this.pose()}setContent(e){this.content=e,this.pages=om(e),this.cache.clear(),this.spread=Math.min(this.spread,this.spreads-1),this.show(this.texL,2*this.spread),this.show(this.texR,2*this.spread+1),this.split=this.splitFor(this.spread),this.splitTarget=this.split}get spreads(){return this.pages.length/2}page(e){let t=this.cache.get(e);if(!t&&(t=document.createElement("canvas"),t.width=Cc,t.height=Pc,im(t,this.pages,e,this.content,this.scratch),this.cache.set(e,t),this.cache.size>8)){let i=[...this.cache.keys()].sort((s,r)=>Math.abs(r-2*this.spread)-Math.abs(s-2*this.spread))[0];this.cache.delete(i)}return t}show(e,t){t<0||t>=this.pages.length||(e.image=this.page(t),e.needsUpdate=!0)}prefetch(){let e=()=>{for(let t of[2*this.spread+2,2*this.spread+3,2*this.spread-1,2*this.spread-2])if(t>=0&&t<this.pages.length&&!this.cache.has(t)){this.page(t),ym(e);return}};ym(e)}open(e=1.15){this.openTo!==1&&(this.animateOpen(1,e),this.sounds?.coverOpen(),this.flutter=0,this.prefetch())}close(e=1){this.openTo!==0&&(this.turning&&this.finishTurn(),this.animateOpen(0,e),this.sounds?.coverClose())}get isOpen(){return this.openTo===1&&this.openT>=1}get isClosed(){return this.openTo===0&&this.openT>=1}get busy(){return this.openT<1||!!this.turning}animateOpen(e,t){this.openFrom=this.openness,this.openTo=e,this.openT=0,this.openDur=t*Math.max(.35,Math.abs(e-this.openness))}split=.1;splitTarget=.1;splitFor(e){return .1+.8*(this.spreads>1?e/(this.spreads-1):.5)}canTurn(e){let t=this.spread+e;return this.isOpen&&!this.turning&&t>=0&&t<this.spreads}turn(e,t=1){if(!this.canTurn(e))return!1;let i=this.spread;return this.turning={dir:e,t:0,dur:(e>0,.95/t),from:i},e>0?(this.show(this.texFront,2*i+1),this.show(this.texBack,2*i+2),this.show(this.texR,2*i+3)):(this.show(this.texFront,2*i-1),this.show(this.texBack,2*i),this.show(this.texL,2*i-2)),this.leaf.visible=!0,this.sounds?.pageTurn(t),!0}finishTurn(){let e=this.turning;this.spread=e.from+e.dir,this.turning=null,this.leaf.visible=!1,this.show(this.texL,2*this.spread),this.show(this.texR,2*this.spread+1),this.splitTarget=this.splitFor(this.spread),this.settle=0,this.settleAmp=e.dir,this.onspread(this.spread),this.prefetch()}update(e){if(this.openT<1){this.openT=Math.min(1,this.openT+e/this.openDur);let t=this.openness;this.openness=this.openFrom+(this.openTo-this.openFrom)*nx(this.openT),this.creakAcc+=Math.abs(this.openness-t),this.creakAcc>.22&&(this.creakAcc=0,this.sounds?.creak(Math.abs(this.openness-t)/Math.max(e,.001)))}this.turning&&(this.turning.t+=e/this.turning.dur,this.turning.t>=1&&this.finishTurn()),this.settle+=e,this.flutter=Math.max(0,this.flutter-e*.9),this.split+=(this.splitTarget-this.split)*Math.min(1,e*6),this.pose()}pose(){let e=this.openness,t=e*Math.PI,i=t/2,s=zu*this.split,r=zu-s,o=ca(.25,1,e)*.0075,a=new ae(0,0),l=new ae(-Math.sin(i),Math.cos(i)),c=a.clone().addScaledVector(l,Mn);this.backBoard.position.set(0,0,0),this.frontBoard.position.set(c.x,c.y,0),this.frontBoard.rotation.set(0,0,t);let h=e*Mn/2,u=f=>f+((s+r)/2-f)*ca(.4,1,e)*.75,d=h*(1.04+.05*ca(.6,1,e));this.right.build(u(r),o,or+h),this.right.mesh.position.x=.0012-d,this.left.build(u(s),o,or+h),this.left.mesh.position.x=.0012-d,this.sweepSpine(a,c,e),this.inner.position.set(-(Jt/2)*(1-e)+Mn/2*e,-(Mn/2)*(1-e)-dn*e,0),this.turning&&e>.98?this.poseLeaf(u(r),u(s),o,h,d):this.leaf.visible=!1}poseLeaf(e,t,i,s,r=s*1.04){let o=this.turning,a=o?o.dir>0?o.t:1-o.t:0,l=o?o.dir:1;if(!o&&this.flutter<=0)return;this.leaf.visible=!0,o||(this.show(this.texFront,2*this.spread+1),this.show(this.texBack,2*this.spread+2));let c=this.leafGeo.attributes.position,h=this.leafSegX,u=this.leafSegZ,d=or+s,f=d/h,m=-r+.0012,_=-Mn*this.openness+r-.0012,p=A=>dn+e-i*(1-A)**2.4,g=A=>dn+t-i*(1-A)**2.4,T=A=>Math.atan2(p(Math.min(1,A+.01))-p(A),d*.01),x=A=>Math.atan2(g(Math.min(1,A+.01))-g(A),d*.01),v=a<.5?2*a*a:1-(-2*a+2)**2/2,M=Math.exp(-this.settle*5)*Math.sin(this.settle*17)*.06*this.settleAmp,E=this.flutter*Math.sin(this.flutter*22)*.05;for(let A=0;A<=u;A++){let y=A/u,S=-rs/2+y*rs,I=.22*(y-.5)*(l>0,1),D=ca(0,1,v*1.35+I*Math.sin(Math.PI*v)),F=m+(_-m)*D,R=p(0)+(g(0)-p(0))*D+3e-4;for(let P=0;P<=h;P++){let N=P/h,O=T(N),X=Math.PI-x(N),J=ca(0,1,v*1.35+I*Math.sin(Math.PI*v)-N*.35),z=O+(X-O)*J;z+=Math.sin(Math.PI*J)*.35*N*(1-N*.4),o?z+=M*N*N*0:z+=(E+M)*N*N;let B=A*(h+1)+P;c.setXYZ(B,F,R,S),F+=Math.cos(z)*f,R+=Math.sin(z)*f,R<dn+2e-4&&(R=dn+2e-4)}}c.needsUpdate=!0,this.leafGeo.computeVertexNormals(),this.leafGeo.computeBoundingSphere(),!o&&this.flutter<=0&&(this.leaf.visible=!1)}spineN=14;spineM=64;initSpine(){let e=this.spineN,t=this.spineM,i=(e+1)*(t+1)*2+(e+1)*2*2,s=new Float32Array(i*3),r=new Float32Array(i*2),o=[],a=new pt;a.setAttribute("position",new wt(s,3)),a.setAttribute("uv",new wt(r,2));let l=0,c=(e+1)*(t+1);for(let u=0;u<=t;u++)for(let d=0;d<=e;d++){let f=u*(e+1)+d;r[(l+f)*2]=d/e,r[(l+f)*2+1]=1-u/t,r[(c+f)*2]=d/e,r[(c+f)*2+1]=1-u/t}for(let u=0;u<t;u++)for(let d=0;d<e;d++){let f=u*(e+1)+d,m=f+1,_=f+e+1,p=_+1;o.push(l+f,l+m,l+_,l+m,l+p,l+_),o.push(c+f,c+_,c+m,c+m,c+_,c+p)}let h=c*2;for(let u=0;u<2;u++){let d=h+u*(e+1)*2;for(let f=0;f<=e;f++)r[(d+f)*2]=f/e,r[(d+f)*2+1]=u,r[(d+e+1+f)*2]=f/e,r[(d+e+1+f)*2+1]=u;for(let f=0;f<e;f++){let m=d+f,_=m+1,p=d+e+1+f,g=p+1;u?o.push(m,_,p,_,g,p):o.push(m,p,_,_,p,g)}}a.setIndex(o),this.spine.geometry=a}sweepSpine(e,t,i){let s=this.spineN,r=this.spineM,o=this.spine.geometry,a=o.attributes.position,l=(s+1)*(r+1),c=l*2,h=t.clone().sub(e),u=h.clone().normalize(),d=new ae(-u.y,u.x),f=.0055*(1-.65*i),m=p=>_m.reduce((g,T)=>g+Math.exp(-((((p+Bt/2)/Bt-T)/.012)**2)),0)*.0013,_=(p,g,T)=>{let x=p/s,v=-Bt/2+g*Bt,M=Math.sin(Math.PI*x),E=(f+m(v)*Math.sqrt(M))*M-T,A=Math.min(1,Math.min(g,1-g)*Bt/.004);return[e.x+h.x*x+d.x*E*(.7+.3*A),e.y+h.y*x+d.y*E*(.7+.3*A),v]};for(let p=0;p<=r;p++)for(let g=0;g<=s;g++){let T=p*(s+1)+g,x=p/r,v=_(g,x,0),M=_(g,x,dn*.9);a.setXYZ(T,v[0],v[1],v[2]),a.setXYZ(l+T,M[0],M[1],M[2])}for(let p=0;p<2;p++){let g=c+p*(s+1)*2,T=p;for(let x=0;x<=s;x++){let v=_(x,T,0),M=_(x,T,dn*.9);a.setXYZ(g+x,v[0],v[1],v[2]),a.setXYZ(g+s+1+x,M[0],M[1],M[2])}}a.needsUpdate=!0,o.computeVertexNormals(),o.computeBoundingSphere()}pageHit(e){if(!this.isOpen)return null;let t=this.inner.worldToLocal(e.point.clone()),i=-Mn/2+.0012+0,s=t.x>i?1:-1,r=Math.abs(t.x-i)/(or+Mn/2),o=(t.z+rs/2)/rs;return r>1.05||o<-.05||o>1.05?null:{side:s,u:r,v:o}}dispose(){this.root.traverse(e=>{e.geometry?.dispose();for(let t of[].concat(e.material||[])){for(let i in t)t[i]?.isTexture&&t[i].dispose();t.dispose()}})}};function ix(){let n=[],i=new Ri;i.moveTo(0,0),i.lineTo(.03,0),i.quadraticCurveTo(.03*.42,.03*.42,0,.03),i.lineTo(0,0);let s=new Ji;s.absarc(.03*.26,.03*.26,.03*.07,0,Math.PI*2,!0),i.holes.push(s);let r=new ji(i,{depth:8e-4,bevelEnabled:!0,bevelThickness:35e-5,bevelSize:4e-4,bevelSegments:2,curveSegments:10});for(let a of[-1,1]){for(let h of[0,1]){let u=r.clone(),d=new We().makeBasis(new C(-1,0,0),new C(0,0,-a),new C(0,h?-1:1,0));d.setPosition(Jt+4e-4,h?-dn-2e-4:2e-4,a*(Bt/2+4e-4)),u.applyMatrix4(d),d.determinant()<0&&sx(u),n.push(u.index?u.toNonIndexed():u)}let l=new ss(.0012,dn+.0026,.03*.9,2,4e-4);l.translate(Jt+6e-4,-dn/2,a*(Bt/2-.03*.45)),n.push(l.index?l.toNonIndexed():l);let c=new ss(.03*.9,dn+.0026,.0012,2,4e-4);c.translate(Jt-.03*.45,-dn/2,a*(Bt/2+6e-4)),n.push(c.index?c.toNonIndexed():c);for(let[h,u]of[[.03*.62,.03*.16],[.03*.16,.03*.62]])for(let d of[0,1]){let f=new nn(.0013,12,6,0,Math.PI*2,0,Math.PI/2);f.scale(1,.55,1),d&&f.rotateX(Math.PI),f.translate(Jt-h,d?-dn-.0012:.0012,a*(Bt/2-u)),n.push(f.index?f.toNonIndexed():f)}}for(let a of n){for(let l of Object.keys(a.attributes))["position","normal","uv"].includes(l)||a.deleteAttribute(l);a.attributes.uv||a.setAttribute("uv",new ot(new Float32Array(a.attributes.position.count*2),2))}let o=bc(n);return o.setAttribute("uv1",o.attributes.uv),o}function sx(n){let e=n.index;if(e)for(let t=0;t<e.count;t+=3){let i=e.getX(t+1);e.setX(t+1,e.getX(t+2)),e.setX(t+2,i)}else{let t=n.attributes.position;for(let i of Object.keys(n.attributes)){let s=n.attributes[i],r=s.itemSize;for(let o=0;o<s.count;o+=3)for(let a=0;a<r;a++){let l=s.getComponent(o+1,a);s.setComponent(o+1,a,s.getComponent(o+2,a)),s.setComponent(o+2,a,l)}}}}function ym(n){let e=window;e.requestIdleCallback?e.requestIdleCallback(n,{timeout:400}):setTimeout(n,60)}var Dc=class{constructor(e,t=1.15){this.half=e;this.invMass=1/t;let[i,s,r]=[e.x*2,e.y*2,e.z*2];this.invInertiaLocal=new C(12/(t*(s*s+r*r)),12/(t*(i*i+r*r)),12/(t*(i*i+s*s)))}pos=new C;quat=new ft;vel=new C;ang=new C;invMass;invInertiaLocal;sleeping=!0;still=0;planes=[];onimpact=e=>{};lastImpact=new Map;time=0;wake(){this.sleeping=!1,this.still=0}invI(e,t){let i=this.quat.clone().invert();return t.copy(e).applyQuaternion(i).multiply(this.invInertiaLocal).applyQuaternion(this.quat),t}step(e){if(this.sleeping)return;let t=8,i=e/t;for(let r=0;r<t;r++)this.substep(i);let s=this.vel.lengthSq()+this.ang.lengthSq()*.02;this.still=s<.004?this.still+e:0,this.still>.3&&(this.sleeping=!0,this.vel.set(0,0,0),this.ang.set(0,0,0))}substep(e){this.time+=e,this.vel.y-=9.81*e,this.vel.multiplyScalar(1-.05*e),this.ang.multiplyScalar(1-.2*e);let t=new C,i=new C,s=new C,r=new C,o=new C,a=new C,l=!1;for(let u=0;u<4;u++)for(let d=0;d<this.planes.length;d++){let f=this.planes[d];for(let m=0;m<8;m++){t.set(m&1?this.half.x:-this.half.x,m&2?this.half.y:-this.half.y,m&4?this.half.z:-this.half.z).applyQuaternion(this.quat).add(this.pos);let _=f.d-t.dot(f.n);if(_<0)continue;l=!0,i.subVectors(t,this.pos),s.copy(this.ang).cross(i).add(this.vel);let p=s.dot(f.n);if(this.pos.addScaledVector(f.n,_*.35),p>=0)continue;if(u===0&&-p>.35){let y=d*8+m,S=this.lastImpact.get(y)||-1;this.time-S>.08&&(this.lastImpact.set(y,this.time),this.onimpact({speed:-p,material:f.material,point:t.clone()}))}let g=r.copy(i).cross(f.n),T=this.invMass+this.invI(g,o).cross(i).dot(f.n),x=-p>.6?f.restitution:0,v=-(1+x)*p/T,M=a.copy(f.n).multiplyScalar(v);this.applyImpulse(M,i),s.copy(this.ang).cross(i).add(this.vel);let E=s.clone().addScaledVector(f.n,-s.dot(f.n)),A=E.length();if(A>1e-6){let y=E.divideScalar(A),S=r.copy(i).cross(y),I=this.invMass+this.invI(S,o).cross(i).dot(y),D=Math.min(A/I,f.friction*v);this.applyImpulse(y.multiplyScalar(-D),i)}}}l&&(this.ang.multiplyScalar(1-Math.min(1,6*e)),this.vel.lengthSq()<.01&&this.vel.multiplyScalar(1-Math.min(1,4*e))),this.pos.addScaledVector(this.vel,e);let c=this.ang,h=new ft(c.x*e*.5,c.y*e*.5,c.z*e*.5,0).multiply(this.quat);this.quat.x+=h.x,this.quat.y+=h.y,this.quat.z+=h.z,this.quat.w+=h.w,this.quat.normalize()}applyImpulse(e,t){this.vel.addScaledVector(e,this.invMass);let i=new C().copy(t).cross(e);this.ang.add(this.invI(i,new C))}};var vm=n=>n<.5?2*n*n:1-(-2*n+2)**2/2,Nc=class{constructor(e,t,i,s,r){this.book=e;this.camera=t;this.dom=i;this.audio=s;this.body=new Dc(new C(Jt/2,Mn/2,Bt/2)),this.body.planes=r,this.body.onimpact=o=>this.audio.play("impactMetal",o.speed/2.2),this.bind()}state="rest";body;zoom=1;zoomTarget=1;focusSide=0;pan=new ae;panTarget=new ae;lift={t:0,fromP:new C,fromQ:new ft};ray=new Pi;ndc=new ae;pointers=new Map;pinch0=0;zoom0=1;lastTap=0;sway=0;handP=new C;handQ=new ft;dropAfterClose=!1;onstate=e=>{};get portrait(){return this.camera.aspect<.9}place(e,t){this.body.pos.copy(e),this.body.quat.copy(t),this.body.vel.set(0,0,0),this.body.ang.set(0,0,0),this.body.sleeping=!0,this.apply()}apply(){this.book.root.position.copy(this.body.pos),this.book.root.quaternion.copy(this.body.quat)}set(e){this.state=e,e!=="held"&&e!=="reading"&&(this.lowered=!1),this.onstate(e)}lowered=!1;lowK=0;onlower=e=>{};setLowered(e){!(this.state==="held"||this.state==="reading")||e===this.lowered||(this.lowered=e,this.audio.play("pickup"),this.onlower(e))}pickUp(){["rest","falling"].includes(this.state)&&(this.lift.t=0,this.lift.fromP.copy(this.book.root.position),this.lift.fromQ.copy(this.book.root.quaternion),this.body.sleeping=!0,this.set("lifting"),this.audio.play("pickup"))}open(){this.state!=="held"||this.book.busy||(this.book.open(),this.set("reading"),this.focusSide=this.portrait?1:0,this.zoomTarget=1,this.pan.set(0,0))}close(){this.state==="reading"&&(this.book.close(),this.zoomTarget=1,this.focusSide=0,this.set("held"))}drop(){if(this.state==="reading"){this.book.close(.42),this.dropAfterClose=!0,this.zoomTarget=1,this.focusSide=0,this.set("releasing");return}this.state!=="held"&&this.state!=="lifting"||this.release()}release(){this.body.pos.copy(this.book.root.position),this.body.quat.copy(this.book.root.quaternion);let e=new C;this.camera.getWorldDirection(e),e.y=0,e.normalize(),this.body.vel.copy(e).multiplyScalar(.25+Math.random()*.2).add(new C(0,-.15,0)),this.body.ang.set((Math.random()-.5)*5,(Math.random()-.5)*3,(Math.random()-.5)*5),this.body.wake(),this.audio.play("drop"),this.set("falling")}turn(e){if(!(this.state!=="reading"||this.lowered)){if(this.portrait&&this.zoomTarget>1.05){if(e>0&&this.focusSide<0){this.focusSide=1;return}if(e<0&&this.focusSide>0){this.focusSide=-1;return}this.book.turn(e)&&(this.focusSide=e>0?-1:1);return}this.book.turn(e)}}readingRot=new ft().setFromEuler(new Yt(Math.PI/2-.16,0,0));heldRot=new ft().setFromEuler(new Yt(Math.PI/2-.22,-.12,-.04));fit(e,t,i){let s=Zt.degToRad(this.camera.fov)/2,r=Math.atan(Math.tan(s)*this.camera.aspect);return Math.max(t/2/Math.tan(s),e/2/Math.tan(r))*i}pageZoom(){let e=this.fit(2*Jt+Mn,Bt,1.08),t=this.fit(Jt,Bt,1.06);return Math.max(1,e/t)}hand(e){let t=this.book.openness,i=this.fit(2*Jt+Mn,Bt,1.1),s=Math.max(this.fit(Jt,Bt,1.5),.34);this.state==="reading"&&this.portrait&&this.focusSide!==0&&this.zoomTarget<this.pageZoom()*.98&&!this.pointers.size&&(this.zoomTarget=Math.max(this.zoomTarget,this.pageZoom())),this.zoom+=(this.zoomTarget-this.zoom)*Math.min(1,e*7);let r=this.focusSide*(Jt/2+.003)*(this.zoom>1.05?1:0);this.panTarget.x=Zt.clamp(this.panTarget.x,-Jt,Jt),this.panTarget.y=Zt.clamp(this.panTarget.y,-Bt/2,Bt/2);let o=new ae(this.zoomTarget>1.05?r+this.panTarget.x:0,this.zoomTarget>1.05?this.panTarget.y:0);this.pan.lerp(o,Math.min(1,e*8));let a=Zt.lerp(s,i,t)/this.zoom;this.sway+=e;let l=this.sway,c=new Yt(Math.sin(l*1.3)*.006+Math.sin(l*3.1)*.002,Math.sin(l*.9)*.006,Math.sin(l*1.7)*.004),h=this.heldRot.clone().slerp(this.readingRot,t).multiply(new ft().setFromEuler(c));this.handQ.copy(this.camera.quaternion).multiply(h);let u=new C(-this.pan.x,0,-this.pan.y).applyQuaternion(this.handQ);if(this.handP.set(0,-.005*(1-t),-a).applyQuaternion(this.camera.quaternion).add(this.camera.position).add(u),this.lowK+=((this.lowered?1:0)-this.lowK)*Math.min(1,e*9),this.lowK>.001){let d=this.lowK*this.lowK*(3-2*this.lowK),f=new C(-.2-.08*t,-.3,-.5).applyQuaternion(this.camera.quaternion).add(this.camera.position),m=this.camera.quaternion.clone().multiply(new ft().setFromEuler(new Yt(Math.PI/2-.95,.35,.25)));this.handP.lerp(f,d),this.handQ.slerp(m,d)}}update(e){switch(this.book.update(e),this.hand(e),this.state){case"rest":case"falling":this.body.step(Math.min(e,1/30)),this.apply(),this.state==="falling"&&this.body.sleeping&&this.set("rest");break;case"lifting":{this.lift.t=Math.min(1,this.lift.t+e/.75);let t=vm(this.lift.t),i=this.lift.fromP.clone().lerp(this.handP,t);i.y+=Math.sin(Math.PI*t)*.08,this.book.root.position.copy(i),this.book.root.quaternion.copy(this.lift.fromQ).slerp(this.handQ,vm(Math.min(1,this.lift.t*1.15))),this.lift.t>=1&&this.set("held");break}case"held":case"reading":case"releasing":this.book.root.position.lerp(this.handP,Math.min(1,e*12)),this.book.root.quaternion.slerp(this.handQ,Math.min(1,e*12)),this.state==="releasing"&&this.book.isClosed&&(this.dropAfterClose=!1,this.release());break}}pick(e,t){let i=this.dom.getBoundingClientRect();return this.ndc.set((e-i.left)/i.width*2-1,-(t-i.top)/i.height*2+1),this.ray.setFromCamera(this.ndc,this.camera),this.ray.intersectObject(this.book.root,!0)[0]||null}tap(e,t){let i=this.pick(e,t);if(this.state==="rest"||this.state==="falling"){i&&this.pickUp();return}if(this.lowered){i&&this.setLowered(!1);return}if(this.state==="held"){i&&this.open();return}if(this.state==="reading"&&i){let s=this.book.pageHit(i);if(!s)return;if(this.portrait&&this.zoomTarget>1.05){let r=this.dom.getBoundingClientRect();this.turn(e-r.left>r.width/2?1:-1)}else this.turn(s.side)}}bind(){let e=this.dom;e.addEventListener("pointerdown",i=>{try{e.setPointerCapture?.(i.pointerId)}catch{}if(this.audio.unlock(),this.pointers.set(i.pointerId,{x:i.clientX,y:i.clientY,sx:i.clientX,sy:i.clientY,t:performance.now()}),this.pointers.size===2){let[s,r]=[...this.pointers.values()];this.pinch0=Math.hypot(s.x-r.x,s.y-r.y),this.zoom0=this.zoomTarget}}),e.addEventListener("pointermove",i=>{let s=this.pointers.get(i.pointerId);if(!s){this.hover(i.clientX,i.clientY);return}let r=i.clientX-s.x,o=i.clientY-s.y;if(s.x=i.clientX,s.y=i.clientY,this.pointers.size===2&&this.state==="reading"){let[a,l]=[...this.pointers.values()],c=Math.hypot(a.x-l.x,a.y-l.y);this.zoomTarget=Zt.clamp(this.zoom0*c/Math.max(20,this.pinch0),1,3.2);return}if(this.state==="reading"&&this.zoomTarget>1.05&&this.pointers.size===1){let a=this.metersPerPixel();this.panTarget.x-=r*a*(this.portrait?0:1),this.panTarget.y-=o*a}});let t=i=>{let s=this.pointers.get(i.pointerId);if(!s)return;let r=this.pointers.size>1;if(this.pointers.delete(i.pointerId),r)return;let o=i.clientX-s.sx,a=i.clientY-s.sy,l=performance.now()-s.t;if(Math.abs(o)>48&&Math.abs(o)>Math.abs(a)*1.3&&l<700){this.state==="reading"&&(this.zoomTarget<=1.05||this.portrait)&&this.turn(o<0?1:-1);return}Math.hypot(o,a)<12&&l<450&&this.tap(i.clientX,i.clientY)};e.addEventListener("pointerup",t),e.addEventListener("pointercancel",i=>this.pointers.delete(i.pointerId)),e.addEventListener("wheel",i=>{if(!(this.state!=="reading"||this.lowered)){if(i.preventDefault(),this.zoomTarget=Zt.clamp(this.zoomTarget*Math.exp(-i.deltaY*.0015),1,3.2),this.zoomTarget>1.05&&!this.portrait){let s=this.pick(i.clientX,i.clientY),r=s&&this.book.pageHit(s);r&&this.focusSide===0&&(this.focusSide=r.side)}this.zoomTarget<=1.05&&(this.focusSide=this.portrait?this.focusSide:0,this.panTarget.set(0,0))}},{passive:!1}),window.addEventListener("keydown",i=>{i.key==="ArrowRight"?this.turn(1):i.key==="ArrowLeft"?this.turn(-1):i.key===" "||i.key==="Enter"?this.state==="rest"?this.pickUp():this.state==="held"?this.open():this.state==="reading"&&this.close():(i.key==="Escape"||i.key.toLowerCase()==="q")&&this.drop()})}toggleZoom(e,t){if(this.zoomTarget>1.05&&!this.portrait){this.zoomTarget=1,this.focusSide=0,this.panTarget.set(0,0);return}let i=this.pick(e,t),s=i&&this.book.pageHit(i);s&&(this.focusSide=s.side,this.zoomTarget=this.portrait?this.zoomTarget>this.pageZoom()*1.2?this.pageZoom():this.pageZoom()*1.7:this.pageZoom()*1.15,this.panTarget.set(0,(s.v-.5)*Bt*(this.portrait?1:.6)))}metersPerPixel(){return 2*this.book.root.position.distanceTo(this.camera.position)*Math.tan(Zt.degToRad(this.camera.fov)/2)/this.dom.clientHeight}hover(e,t){let i=this.pick(e,t),s="default";if(i){if(this.state==="rest"||this.state==="held"||this.state==="falling")s="pointer";else if(this.state==="reading"){let r=this.book.pageHit(i);r&&this.book.canTurn(r.side)&&(s=r.side>0?"e-resize":"w-resize")}}this.dom.style.cursor=s}};var rx={pageTurn:"audio/page_turn.wav"},Uc=class{ctx=null;out;buffers=new Map;noise;enabled=!0;unlock(){try{let o=navigator.audioSession;o&&o.type!=="playback"&&(o.type="playback")}catch{}if(this.ctx){this.ctx.state!=="running"&&this.ctx.resume().catch(()=>{}),this.tick();return}let e=window.AudioContext||window.webkitAudioContext;if(!e)return;this.ctx=new e;let t=this.ctx;this.tick(),this.out=t.createGain(),this.out.gain.value=.9;let i=t.createDynamicsCompressor();i.threshold.value=-14,this.out.connect(i).connect(t.destination),this.noise=t.createBuffer(1,t.sampleRate*2,t.sampleRate);let s=this.noise.getChannelData(0),r=0;for(let o=0;o<s.length;o++){let a=Math.random()*2-1;r=.985*r+.015*a,s[o]=a*.6+r*4}for(let[o,a]of Object.entries(rx))fetch(a).then(l=>l.arrayBuffer()).then(l=>t.decodeAudioData(l)).then(l=>this.buffers.set(o,l)).catch(()=>{})}tick(){let e=this.ctx;if(e)try{let t=e.createBufferSource();t.buffer=e.createBuffer(1,1,22050),t.connect(e.destination),t.start(0)}catch{}}sample(e,t,i=1){let s=this.buffers.get(e);if(!s||!this.ctx)return!1;let r=this.ctx.createBufferSource();r.buffer=s,r.playbackRate.value=i;let o=this.ctx.createGain();return o.gain.value=t,r.connect(o).connect(this.out),r.start(),!0}rustle(e,t,i,s,r,o=.01){let a=this.ctx,l=a.createBufferSource();l.buffer=this.noise;let c=a.createBiquadFilter();c.type="bandpass",c.frequency.value=i,c.Q.value=s;let h=a.createGain();return h.gain.setValueAtTime(0,e),h.gain.linearRampToValueAtTime(r,e+o),h.gain.exponentialRampToValueAtTime(1e-4,e+t),l.connect(c).connect(h).connect(this.out),l.start(e,Math.random()),l.stop(e+t+.05),c}mode(e,t,i,s){let r=this.ctx,o=r.createOscillator(),a=r.createGain();o.frequency.value=t,a.gain.setValueAtTime(s,e),a.gain.exponentialRampToValueAtTime(1e-4,e+i),o.connect(a).connect(this.out),o.start(e),o.stop(e+i+.02)}hum(e,t=2){if(!this.enabled||!this.ctx||this.ctx.state!=="running")return;let i=this.ctx,s=i.currentTime,r=i.createGain(),o=i.createBiquadFilter();o.type="lowpass",o.frequency.value=e==="overload"?2200:500;let a=e==="overload"?.16:e==="short"?.07:.06;r.gain.setValueAtTime(0,s),r.gain.linearRampToValueAtTime(a,s+.12),e==="power"?r.gain.exponentialRampToValueAtTime(.002,s+t):r.gain.setValueAtTime(a,s+t-.2),r.gain.linearRampToValueAtTime(0,s+t);for(let[l,c,h]of[[1,"sawtooth",1],[2,"square",.35],[3,"sine",.3]]){let u=i.createOscillator(),d=i.createGain();u.type=c,u.frequency.value=50*l,e==="power"&&u.frequency.linearRampToValueAtTime(50*l*.7,s+t),d.gain.value=h,u.connect(d).connect(o),u.start(s),u.stop(s+t+.05)}o.connect(r).connect(this.out)}play(e,t=1){if(!this.enabled||!this.ctx||this.ctx.state!=="running")return;let i=this.ctx.currentTime;if(!(this.buffers.has(e)&&this.sample(e,.8*t,.92+Math.random()*.16)))switch(e){case"pageTurn":this.rustle(i,.35,2600,.7,.35*t,.04),this.rustle(i+.18,.22,4200,1.2,.2*t);break;case"coverOpen":{this.rustle(i,.7,380,6,.5*t,.12).frequency.linearRampToValueAtTime(240,i+.6),this.rustle(i+.03,.12,1400,2,.2),this.rustle(i+.55,.25,900,1,.25*t);break}case"coverClose":this.rustle(i,.25,700,.8,.25,.08),this.rustle(i+.2,.16,260,1.4,.9*t,.004),this.mode(i+.2,118,.12,.25*t);break;case"creak":{this.rustle(i,.28,300+Math.random()*120,9,.18*Math.min(1,t),.06).frequency.linearRampToValueAtTime(220,i+.25);break}case"pickup":this.rustle(i,.18,900,1.1,.3,.03),this.rustle(i+.05,.2,320,3,.22,.05);break;case"drop":this.rustle(i,.2,1800,.8,.12,.05);break;case"impactMetal":{let s=Math.min(1,t);this.rustle(i,.14,180,1.2,1.1*s,.002),this.rustle(i,.05,2400,.6,.3*s,.001);for(let[r,o,a]of[[186,.55,.16],[412,.4,.1],[733,.3,.07],[1290,.22,.04],[2210,.15,.02]])this.mode(i+.002,r*(.97+Math.random()*.06),o*(.6+s*.6),a*s);break}case"snip":this.rustle(i,.05,5200,.9,.9,.001),this.mode(i,2900,.09,.12),this.mode(i,4400,.06,.07),this.rustle(i+.01,.08,900,2,.3,.002);break;case"spark":for(let s=0;s<7;s++)this.rustle(i+s*.028+Math.random()*.02,.04,3e3+Math.random()*4e3,.8,.5*Math.random()+.2,.001);break;case"good":for(let[s,r]of[[660,1.2],[990,1],[1320,.8]])this.mode(i+.02,s,r,.08);this.rustle(i,.25,300,1,.4,.002);break;case"bad":{let s=this.ctx.createOscillator(),r=this.ctx.createGain();s.type="sawtooth",s.frequency.value=62,r.gain.setValueAtTime(.18,i),r.gain.exponentialRampToValueAtTime(.001,i+.9),s.connect(r).connect(this.out),s.start(i),s.stop(i+.95),this.rustle(i,.5,2500,.7,.5,.002);break}case"doorOpen":{this.rustle(i,.55,700,7,.35,.05).frequency.linearRampToValueAtTime(420,i+.5),this.mode(i,240,.3,.1);break}case"button":this.rustle(i,.03,2400,1.5,.7,.001),this.mode(i,1650,.06,.1),this.mode(i+.09,900,.08,.08),this.rustle(i+.09,.04,1200,2,.4,.001);break;case"locked":this.rustle(i,.05,800,3,.6,.001),this.mode(i,520,.12,.1),this.rustle(i+.07,.04,700,3,.4,.001);break;case"screech":{this.rustle(i,1.1,2600,18,.45,.03).frequency.exponentialRampToValueAtTime(700,i+1),this.rustle(i+.05,.9,3900,22,.2,.03).frequency.exponentialRampToValueAtTime(1100,i+.9);for(let o=0;o<10;o++)this.rustle(i+o*.07+Math.random()*.03,.05,1800+Math.random()*1500,3,.25,.002);break}case"slam":{let s=Math.min(1.5,t);this.rustle(i,.5,90,.9,1.4*s,.002),this.rustle(i,.25,400,1,.7*s,.002);for(let[r,o,a]of[[62,1.2,.3],[131,.9,.2],[277,.7,.12],[521,.5,.08],[1013,.3,.05]])this.mode(i+.003,r,o,a*s);break}case"doorClose":this.rustle(i,.12,300,1.2,.9,.002),this.mode(i,180,.45,.2),this.mode(i,410,.3,.1);break}}};var io=class extends Go{constructor(e){super(e),this.type=Fn}parse(e){let o=function(y,S){switch(y){case 1:throw new Error("THREE.HDRLoader: Read Error: "+(S||""));case 2:throw new Error("THREE.HDRLoader: Write Error: "+(S||""));case 3:throw new Error("THREE.HDRLoader: Bad File Format: "+(S||""));default:case 4:throw new Error("THREE.HDRLoader: Memory Error: "+(S||""))}},u=function(y,S,I){S=S||1024;let F=y.pos,R=-1,P=0,N="",O=String.fromCharCode.apply(null,new Uint16Array(y.subarray(F,F+128)));for(;0>(R=O.indexOf(`
`))&&P<S&&F<y.byteLength;)N+=O,P+=O.length,F+=128,O=String.fromCharCode.apply(null,new Uint16Array(y.subarray(F,F+128)));return-1<R?(I!==!1&&(y.pos+=P+R+1),N+O.slice(0,R)):!1},d=function(y){let S=/^#\?(\S+)/,I=/^\s*GAMMA\s*=\s*(\d+(\.\d+)?)\s*$/,D=/^\s*EXPOSURE\s*=\s*(\d+(\.\d+)?)\s*$/,F=/^\s*FORMAT=(\S+)\s*$/,R=/^\s*\-Y\s+(\d+)\s+\+X\s+(\d+)\s*$/,P={valid:0,string:"",comments:"",programtype:"RGBE",format:"",gamma:1,exposure:1,width:0,height:0},N,O;for((y.pos>=y.byteLength||!(N=u(y)))&&o(1,"no header found"),(O=N.match(S))||o(3,"bad initial token"),P.valid|=1,P.programtype=O[1],P.string+=N+`
`;N=u(y),N!==!1;){if(P.string+=N+`
`,N.charAt(0)==="#"){P.comments+=N+`
`;continue}if((O=N.match(I))&&(P.gamma=parseFloat(O[1])),(O=N.match(D))&&(P.exposure=parseFloat(O[1])),(O=N.match(F))&&(P.valid|=2,P.format=O[1]),(O=N.match(R))&&(P.valid|=4,P.height=parseInt(O[1],10),P.width=parseInt(O[2],10)),P.valid&2&&P.valid&4)break}return P.valid&2||o(3,"missing format specifier"),P.valid&4||o(3,"missing image size specifier"),P},f=function(y,S,I){let D=S;if(D<8||D>32767||y[0]!==2||y[1]!==2||y[2]&128)return new Uint8Array(y);D!==(y[2]<<8|y[3])&&o(3,"wrong scanline width");let F=new Uint8Array(4*S*I);F.length||o(4,"unable to allocate buffer space");let R=0,P=0,N=4*D,O=new Uint8Array(4),X=new Uint8Array(N),J=I;for(;J>0&&P<y.byteLength;){P+4>y.byteLength&&o(1),O[0]=y[P++],O[1]=y[P++],O[2]=y[P++],O[3]=y[P++],(O[0]!=2||O[1]!=2||(O[2]<<8|O[3])!=D)&&o(3,"bad rgbe scanline format");let z=0,B;for(;z<N&&P<y.byteLength;){B=y[P++];let ne=B>128;if(ne&&(B-=128),(B===0||z+B>N)&&o(3,"bad scanline data"),ne){let oe=y[P++];for(let Ue=0;Ue<B;Ue++)X[z++]=oe}else X.set(y.subarray(P,P+B),z),z+=B,P+=B}let W=D;for(let ne=0;ne<W;ne++){let oe=0;F[R]=X[ne+oe],oe+=D,F[R+1]=X[ne+oe],oe+=D,F[R+2]=X[ne+oe],oe+=D,F[R+3]=X[ne+oe],R+=4}J--}return F},m=function(y,S,I,D){let F=y[S+3],R=Math.pow(2,F-128)/255;I[D+0]=y[S+0]*R,I[D+1]=y[S+1]*R,I[D+2]=y[S+2]*R,I[D+3]=1},_=function(y,S,I,D){let F=y[S+3],R=Math.pow(2,F-128)/255;I[D+0]=gs.toHalfFloat(Math.min(y[S+0]*R,65504)),I[D+1]=gs.toHalfFloat(Math.min(y[S+1]*R,65504)),I[D+2]=gs.toHalfFloat(Math.min(y[S+2]*R,65504)),I[D+3]=gs.toHalfFloat(1)},p=new Uint8Array(e);p.pos=0;let g=d(p),T=g.width,x=g.height,v=f(p.subarray(p.pos),T,x),M,E,A;switch(this.type){case An:A=v.length/4;let y=new Float32Array(A*4);for(let I=0;I<A;I++)m(v,I*4,y,I*4);M=y,E=An;break;case Fn:A=v.length/4;let S=new Uint16Array(A*4);for(let I=0;I<A;I++)_(v,I*4,S,I*4);M=S,E=Fn;break;default:throw new Error("THREE.HDRLoader: Unsupported type: "+this.type)}return{width:T,height:x,data:M,header:g.string,gamma:g.gamma,exposure:g.exposure,type:E,colorSpace:_n,minFilter:Rt,magFilter:Rt,generateMipmaps:!1,flipY:!0}}setDataType(e){return this.type=e,this}};var Wt=1.6;async function bm(n,e,t){let i=n.capabilities.getMaxAnisotropy(),s=new Zn,r=(z,B,W)=>new Promise((ne,oe)=>s.load(vi+z,Ue=>{Ue.colorSpace=B?nt:Ft,Ue.wrapS=Ue.wrapT=rn,Ue.repeat.set(W,W),Ue.anisotropy=i,ne(Ue)},void 0,oe)),[o,a,l,c]=await Promise.all([r("rusty_metal_05_diff_1k.jpg",!0,2),r("rusty_metal_05_nor_gl_1k.jpg",!1,2),r("rusty_metal_05_rough_1k.jpg",!1,2),new io().loadAsync(vi+"boiler_room_1k.hdr")]),h=new Ps(n);c.mapping=As;let u=h.fromEquirectangular(c).texture;c.dispose(),h.dispose(),e.environment=u,e.environmentIntensity=.32,e.background=new Ne("#050403"),e.fog=new Ws("#0a0603",.16);let d=new $t({map:o,normalMap:a,roughnessMap:l,metalness:.65,roughness:1,color:"#9a8f86",envMapIntensity:.9}),f=new ge(new En(Wt,Wt),d);f.rotation.x=-Math.PI/2,f.receiveShadow=!0,e.add(f);let m=new nn(.007,10,5,0,Math.PI*2,0,Math.PI/2),_=new $t({color:"#4a4038",metalness:.8,roughness:.55}),p=[];for(let z of[-Wt/2+.04,0,Wt/2-.04])for(let B=-Wt/2+.06;B<Wt/2;B+=.09)p.push(new C(z,0,B),new C(B,0,z));let g=new Ei(m,_,p.length);p.forEach((z,B)=>g.setMatrixAt(B,new We().makeTranslation(z.x,0,z.z))),g.receiveShadow=!0,e.add(g);let T=new $t({color:"#120d0a",roughness:.9});for(let z of[0,Math.PI/2]){let B=new ge(new En(.006,Wt),T);B.rotation.set(-Math.PI/2,0,z),B.position.y=6e-4,e.add(B)}let x=d.clone();x.color=new Ne("#5a4c42"),x.map=o.clone(),x.map.repeat.set(2,3),x.map.needsUpdate=!0;let v=new ge(new En(Wt,2.4),x);v.position.set(0,1.2,-Wt/2),v.receiveShadow=!0,e.add(v);let M=new xt(.011,.011,2.4,10),E=new $t({color:"#2b2420",metalness:.85,roughness:.45,envMapIntensity:1.2}),A=[];for(let z=0;z<=16;z++){let B=-Wt/2+z*Wt/16;A.push(new We().makeTranslation(-Wt/2,1.2,B),new We().makeTranslation(Wt/2,1.2,B))}let y=new Ei(M,E,A.length);A.forEach((z,B)=>y.setMatrixAt(B,z)),y.castShadow=!0,e.add(y);let S=new ge(new Dt(Wt,.05,.03),E);for(let[z,B,W,ne]of[[-Wt/2,.08,0,Math.PI/2],[Wt/2,.08,0,Math.PI/2],[-Wt/2,1.05,0,Math.PI/2],[Wt/2,1.05,0,Math.PI/2]]){let oe=S.clone();oe.position.set(z,B,W),oe.rotation.y=ne,oe.castShadow=!0,e.add(oe)}let I=new pn({uniforms:{time:{value:0}},fog:!1,vertexShader:"varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",fragmentShader:"uniform float time;varying vec2 vUv;float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5);}float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}void main(){vec2 p=vUv*9.;float v=n(p+time*.05)*.6+n(p*2.3-time*.08)*.3+n(p*5.-time*.1)*.1;v=pow(v,2.2);vec3 c=mix(vec3(.08,.01,.0),vec3(1.,.32,.04),v)+vec3(1.,.7,.3)*pow(v,6.)*1.5;gl_FragColor=vec4(c*.75,1.);}"}),D=new ge(new En(14,14),I);D.rotation.x=-Math.PI/2,D.position.y=-6,e.add(D);let F=[];for(let[z,B]of[[-1.4,.2],[1.4,-.3]]){let W=new Gn("#ff5a14",3.2,6,1.6);W.position.set(z,-.4,B),e.add(W),F.push(W)}let R=new fi("#ffbf73",9,4.5,.62,.55,1.7);R.position.set(.18,2.3,.1),R.target.position.set(0,0,-.1),R.castShadow=!0,R.shadow.mapSize.set(t?2048:1024,t?2048:1024),R.shadow.bias=-12e-5,R.shadow.normalBias=.0012,R.shadow.radius=3,R.shadow.camera.near=.4,R.shadow.camera.far=3.2,R.shadow.focus=.9,e.add(R,R.target);let P=new ge(new nn(.035,16,12),new wn({color:"#ffd9a0"}));P.position.copy(R.position),e.add(P);let N=new ge(new xt(.06,.07,.11,10,1,!0),new $t({color:"#1b1612",metalness:.8,roughness:.5,wireframe:!0}));N.position.copy(R.position),e.add(N);let O=new Zs("#6d5a48","#2a0d04",.25);e.add(O);let X=[{n:new C(0,1,0),d:0,restitution:.18,friction:.55,material:"metal"},{n:new C(1,0,0),d:-Wt/2+.012,restitution:.25,friction:.4,material:"metal"},{n:new C(-1,0,0),d:-Wt/2+.012,restitution:.25,friction:.4,material:"metal"},{n:new C(0,0,1),d:-Wt/2,restitution:.25,friction:.4,material:"metal"},{n:new C(0,0,-1),d:-Wt/2,restitution:.25,friction:.4,material:"metal"}],J=0;return{planes:X,lamp:R,update(z){J+=z,I.uniforms.time.value=J,F.forEach((W,ne)=>{W.intensity=3+Math.sin(J*1.3+ne*2)*.6+Math.sin(J*4.7+ne)*.25});let B=Math.random()<.004?.35:1;R.intensity=9*(.96+Math.sin(J*50)*.01)*B}}}function Mm(){let n=document.createElement("canvas");n.width=n.height=128;let e=n.getContext("2d"),t=e.createRadialGradient(64,64,8,64,64,64);t.addColorStop(0,"rgba(0,0,0,.85)"),t.addColorStop(.55,"rgba(0,0,0,.4)"),t.addColorStop(1,"rgba(0,0,0,0)"),e.fillStyle=t,e.fillRect(0,0,128,128);let i=new ge(new En(.3,.37),new wn({map:new an(n),transparent:!0,depthWrite:!1,opacity:.7}));return i.rotation.x=-Math.PI/2,i.position.y=.0012,i.renderOrder=1,i}var Fc=(n,e,t,i=!0)=>{let s=document.createElement("canvas");s.width=n,s.height=e,t(s.getContext("2d"));let r=new an(s);return r.colorSpace=i?nt:Ft,r.anisotropy=16,r},ha=(()=>{let n=null;return()=>n||={brass:new Je({color:"#8a6a36",metalness:.9,roughness:.45,envMapIntensity:.9}),bronze:new Je({color:"#5a4026",metalness:.85,roughness:.55}),iron:new Je({color:"#2e2925",metalness:.7,roughness:.72,envMapIntensity:.5}),black:new Je({color:"#141210",metalness:.2,roughness:.6})}})(),xm="'IM Fell English SC', Georgia, serif";var Oc="'Barlow Condensed', 'Arial Narrow', sans-serif",Sm="'IBM Plex Mono', Menlo, monospace";function Vc(n,e,t,i=44,s="brass",r={}){let o=Math.min(1024,Math.round(e*8e3)),a=Math.max(32,Math.round(o*t/e)),l=Fc(o,a,u=>{let d=u.canvas.width,f=u.canvas.height,m=Vt(n.length*7+d);if(s==="brass"){let S=u.createLinearGradient(0,0,d,f);S.addColorStop(0,"#8b6a36"),S.addColorStop(.5,"#b8945a"),S.addColorStop(1,"#6f5228"),u.fillStyle=S}else{let S=u.createLinearGradient(0,0,0,f);S.addColorStop(0,"#1d1814"),S.addColorStop(1,"#0f0c0a"),u.fillStyle=S}u.fillRect(0,0,d,f);for(let S=0;S<d*f/260;S++)u.fillStyle=`rgba(${m()<.6?"40,26,10":"240,220,170"},${m()*(s==="brass"?.13:.05)})`,u.fillRect(m()*d,m()*f,2+m()*14,1);let _=Math.max(3,f*.07);u.strokeStyle=s==="brass"?"rgba(40,25,8,.7)":"#9b7638",u.lineWidth=_*.6,u.strokeRect(_,_,d-_*2,f-_*2);let p=r.screws??d/f>3.2;if(p)for(let S of[_*3.4,d-_*3.4]){let I=f*.12,D=f/2,F=u.createRadialGradient(S-I*.3,D-I*.3,1,S,D,I);F.addColorStop(0,"#d8b77a"),F.addColorStop(1,"#5a4222"),u.fillStyle=F,u.beginPath(),u.arc(S,D,I,0,7),u.fill(),u.strokeStyle="#2a1a08",u.lineWidth=I*.25,u.beginPath(),u.moveTo(S-I*.7,D-I*.3),u.lineTo(S+I*.7,D+I*.3),u.stroke()}let g=p?_*6.4:_*2.4,T=d-g*2,v=r.sub?f*.5:f*.62;u.font=`${r.mono,700} ${v}px ${r.mono?Sm:Oc}`;let M=r.mono?v*.06:v*.1,E=S=>[...S].reduce((I,D)=>I+u.measureText(D).width+M,-M);for(;E(n)>T&&v>6;)v*=.94,u.font=`700 ${v}px ${r.mono?Sm:Oc}`;let A=r.sub?f*.64:f*.53,y=(S,I,D=0)=>{let F=d/2-E(S)/2+D;for(let R of S)u.fillText(R,F,I),F+=u.measureText(R).width+M};if(u.textBaseline="middle",u.textAlign="left",s==="brass"?(u.fillStyle="rgba(255,238,195,.45)",y(n,A+v*.045,v*.03),u.fillStyle="#1c1107",y(n,A)):(u.fillStyle="rgba(0,0,0,.6)",y(n,A+v*.04),u.fillStyle="#fff6dc",y(n,A)),r.sub){let S=f*.17;u.font=`600 ${S}px 'Cinzel', Georgia, serif`,u.fillStyle=s==="brass"?"#1c1107":"#e6c784",u.textAlign="center",u.fillText(r.sub,d/2,f*.24)}});l.generateMipmaps=!0,l.minFilter=mn;let c=new Je({map:l,emissiveMap:l,emissive:"#ffffff",emissiveIntensity:s==="brass"?.25:.5,metalness:s==="brass"?.75:.35,roughness:s==="brass"?.45:.5,clearcoat:s==="enamel"?.5:0,clearcoatRoughness:.4}),h=s==="brass"?ha().brass:ha().iron;return new ge(new Dt(e,t,.0025),[h,h,h,h,c,h])}var Bc=class n{constructor(e=.055){this.radius=e;let t=e,i=ha(),s=new ge(new bs(t,t*.12,14,48),i.brass);s.castShadow=!0,this.group.add(s);let r=new ge(new xt(t*1.02,t*1.08,t*.35,48,1,!0),i.bronze);r.rotation.x=Math.PI/2,r.position.z=-t*.17,this.group.add(r);let o=new ge(new Ai(t*.98,64),(()=>{let d=this.dialTexture();return new $t({map:d,emissiveMap:d,emissive:"#ffffff",emissiveIntensity:.55,roughness:.8})})());o.position.z=-t*.05,this.group.add(o);let a=new ge(new Dt(t*.025,t*.82,t*.01),new $t({color:"#1a0f08",roughness:.5}));a.position.y=t*.36,this.needle.add(a);let l=new ge(new Dt(t*.015,t*.14,t*.012),new $t({color:"#8e1b10",roughness:.5}));l.position.y=t*.73,this.needle.add(l);let c=new ge(new xt(t*.06,t*.06,t*.02,16),i.black);c.rotation.x=Math.PI/2,c.position.y=-t*.1,this.needle.add(c),this.needle.position.z=-t*.02,this.group.add(this.needle);let h=new ge(new nn(t*.07,16,8),i.brass);h.scale.z=.5,this.group.add(h);let u=new ge(new nn(t*2.2,32,8,0,Math.PI*2,0,Math.asin(.98/2.2)),new Je({color:"#ffffff",transparent:!0,opacity:.14,roughness:.08,roughnessMap:this.scratches(),metalness:0,clearcoat:1,clearcoatRoughness:.25,depthWrite:!1,envMapIntensity:1.4}));u.rotation.x=Math.PI/2,u.position.z=-t*2.2*Math.cos(Math.asin(.98/2.2))+t*.06,this.group.add(u);for(let d=0;d<4;d++){let f=Math.PI/4+d*Math.PI/2,m=new ge(new xt(t*.07,t*.07,t*.05,12),i.brass);m.rotation.x=Math.PI/2,m.position.set(Math.cos(f)*t*1.25,Math.sin(f)*t*1.25,-t*.1),this.group.add(m);let _=new ge(new Dt(t*.11,t*.02,t*.02),i.bronze);_.position.copy(m.position).setZ(-t*.07),_.rotation.z=f*1.7,this.group.add(_)}this.setAngle(0)}group=new ct;needle=new ct;angle=0;target=0;vel=0;fault="power";testT=-1;dur=2;seed=0;static A0=-Math.PI*.75;static A1=Math.PI*.75;dialTexture(){return Fc(1024,1024,e=>{e.scale(2,2);let t=256,i=e.createRadialGradient(t,t,40,t,t,256);i.addColorStop(0,"#ece0bd"),i.addColorStop(1,"#c8b383"),e.fillStyle=i,e.fillRect(0,0,512,512);let s=Vt(77);for(let a=0;a<40;a++)e.fillStyle=`rgba(120,80,30,${s()*.2})`,e.beginPath(),e.arc(s()*512,s()*512,2+s()*12,0,7),e.fill();let r=a=>-Math.PI/2+n.A0+a/10*(n.A1-n.A0);for(let[a,l,c]of[[6.5,8,"rgba(196,140,30,.75)"],[8,10,"rgba(160,30,18,.85)"]])e.strokeStyle=c,e.lineWidth=26,e.beginPath(),e.arc(t,t,178,r(a),r(l)),e.stroke();e.strokeStyle="#2a1a0c",e.lineWidth=3,e.beginPath(),e.arc(t,t,196,r(0),r(10)),e.stroke();for(let a=0;a<=10;a+=.5){let l=r(a),c=a%1===0;e.lineWidth=c?4:2,e.beginPath(),e.moveTo(t+Math.cos(l)*(c?164:178),t+Math.sin(l)*(c?164:178)),e.lineTo(t+Math.cos(l)*196,t+Math.sin(l)*196),e.stroke(),c&&(e.font="700 44px 'Cinzel', serif",e.fillStyle="#120a03",e.textAlign="center",e.textBaseline="middle",e.fillText(String(a),t+Math.cos(l)*132,t+Math.sin(l)*132))}e.textAlign="center",e.fillStyle="#120a03",e.font=`700 36px ${xm}`,e.fillText("AMPERES",t,t+70),e.font=`600 24px ${xm}`,e.fillText("HARTWELL \xB7 LONDON",t,t+104);let o=(a,l,c)=>{e.save(),e.fillStyle=c,e.font=`800 25px ${Oc}`;let h=r(l),u=[...a],d=.062,f=h-(u.length-1)*d/2;for(let m of u)e.save(),e.translate(t+Math.cos(f)*232,t+Math.sin(f)*232),e.rotate(f+Math.PI/2),e.textAlign="center",e.fillText(m,0,0),e.restore(),f+=d;e.restore()};o("POWER FAILURE",1.3,"#120a03"),o("SHORT CIRCUIT",5,"#120a03"),o("OVERLOAD",9,"#b01808")})}scratches(){return Fc(256,256,e=>{e.fillStyle="#1a1a1a",e.fillRect(0,0,256,256);let t=Vt(31);e.strokeStyle="#d0d0d0";for(let i=0;i<70;i++){e.globalAlpha=.2+t()*.6,e.lineWidth=.5+t(),e.beginPath();let s=t()*256,r=t()*256,o=t()*7,a=10+t()*90;e.moveTo(s,r),e.lineTo(s+Math.cos(o)*a,r+Math.sin(o)*a),e.stroke()}},!1)}setAngle(e){this.needle.rotation.z=-(n.A0+Zt.clamp(e,-.3,10.4)/10*(n.A1-n.A0))}setState(e){this.fault=e}get state(){return this.fault}test(e=2){this.testT=0,this.dur=e,this.seed=Math.random()*100}get testing(){return this.testT>=0}get progress(){return this.testT<0?-1:this.testT/this.dur}update(e){let t=performance.now()/1e3;if(this.testT>=0){this.testT+=e;let o=this.testT/this.dur,a=Math.min(1,o*6)*Math.min(1,(1-o)*5);if(this.fault==="overload")this.target=9.1+Math.sin(t*31)*.25+Math.sin(t*13)*.2;else if(this.fault==="short"){let l=Math.floor(t*9+this.seed),c=Math.sin(l*91.7)*.5+.5;this.target=1.5+c*7+Math.sin(t*47)*.6}else this.target=o<.18?2.4*Math.sin(o/.18*Math.PI):.25*(1-o);this.target*=a,this.testT>=this.dur&&(this.testT=-1)}else this.target=0;let i=this.testT>=0,s=i?this.fault==="short"?260:this.fault==="overload"?170:90:90,r=i&&this.fault==="short"?9:13;this.vel+=((this.target-this.angle)*s-this.vel*r)*e,this.angle+=this.vel*e,this.setAngle(this.angle)}},kc=class{group=new ct;cap;press=0;pressT=0;pick=[];constructor(){let e=ha(),t=new ge(new xt(.03,.033,.012,32),e.bronze);t.rotation.x=Math.PI/2,t.position.z=.006,this.group.add(t);let i=new ge(new bs(.024,.004,10,32),e.brass);i.position.z=.013,this.group.add(i),this.cap=new ge(new nn(.02,32,12,0,Math.PI*2,0,Math.PI/2),new Je({color:"#9a7740",metalness:.92,roughness:.32,clearcoat:.2})),this.cap.rotation.x=Math.PI/2,this.cap.scale.set(1,.55,1),this.cap.position.z=.014,this.cap.castShadow=!0,this.group.add(this.cap);let s=Vc("TEST CIRCUIT",.1,.026,46,"enamel",{screws:!0});s.position.set(0,-.05,.002),this.group.add(s),this.pick.push(this.cap,t,i,s)}push(){this.pressT=.22}update(e){this.pressT=Math.max(0,this.pressT-e);let t=this.pressT>0?1:0;this.press+=(t-this.press)*Math.min(1,e*30),this.cap.position.z=.014-this.press*.0065}},zc=class{group=new ct;knob=new ct;window=new ge;angle=0;target=0;shake=0;pick=[];mode="normal";constructor(){let e=ha(),t=new ge(new xt(.046,.046,.004,40),e.bronze),i=new ge(new Ai(.045,48),new Je({metalness:.6,roughness:.5,emissive:"#6a4a22",emissiveIntensity:.5,map:Fc(256,256,a=>{let l=a.createRadialGradient(128,128,10,128,128,128);l.addColorStop(0,"#b18c52"),l.addColorStop(1,"#6e5129"),a.fillStyle=l,a.fillRect(0,0,256,256),a.save(),a.translate(128,128),a.fillStyle="#0e0802",a.font=`800 30px ${Oc}`,a.textAlign="center";for(let[c,h]of[["NORMAL",-Math.PI/4],["EMERGENCY",Math.PI/4]])a.save(),a.rotate(h),a.fillText(c,0,-88),a.fillRect(-2,-78,4,14),a.restore();a.restore(),a.strokeStyle="rgba(40,25,8,.8)",a.lineWidth=4,a.beginPath(),a.arc(128,128,124,0,7),a.stroke()})}));i.position.z=.0042,this.group.add(i),t.rotation.x=Math.PI/2,t.position.z=.002,this.group.add(t);let s=new ge(new xt(.022,.025,.02,12),e.black);s.rotation.x=Math.PI/2,s.position.z=.014,this.knob.add(s);let r=new ge(new Dt(.01,.05,.012),e.brass);r.position.z=.022,this.knob.add(r);let o=new ge(new Io(.006,.012,3),e.brass);o.position.set(0,.03,.022),this.knob.add(o),this.knob.traverse(a=>{a.castShadow=!0}),this.group.add(this.knob),this.window.position.set(0,-.062,.002),this.group.add(this.window),this.pick.push(t,i,s,r,o,this.window)}setMode(e){this.mode=e,this.target=e==="normal"?Math.PI/4:-Math.PI/4;let t=Vc(e==="normal"?"NORMAL":"EMERGENCY",.09,.026,40,"enamel",{sub:"MODE",screws:!1});this.window.geometry?.dispose?.(),this.window.geometry=t.geometry,this.window.material=t.material}tryTurn(){this.shake=.35}update(e){this.angle+=(this.target-this.angle)*Math.min(1,e*8),this.shake=Math.max(0,this.shake-e),this.knob.rotation.z=this.angle+Math.sin(this.shake*70)*this.shake*.12}};var ox=["A1","B2","C3","D4","E5","F6"],It=.46,sn=.56,In=.15,Gt=.014;var ua=.12,Gc=-.2,Tm=.056,da=(n,e,t,i=!0)=>{let s=document.createElement("canvas");s.width=n,s.height=e,t(s.getContext("2d"));let r=new an(s);return r.colorSpace=i?nt:Ft,r.anisotropy=16,r};function ax(){let n=(e,t)=>{e.fillStyle=t?"#808080":"#d8d4cc",e.fillRect(0,0,512,64);for(let r=-64;r<512;r+=6)for(let o of[1,-1])e.strokeStyle=t?o>0?"#c8c8c8":"#404040":o>0?"rgba(255,255,255,.16)":"rgba(0,0,0,.2)",e.lineWidth=2.4,e.beginPath(),e.moveTo(r,0),e.lineTo(r+o*64,64),e.stroke();if(!t){let r=e.createLinearGradient(0,0,512,0);r.addColorStop(0,"rgba(30,22,16,.85)"),r.addColorStop(.12,"rgba(30,22,16,0)"),r.addColorStop(.88,"rgba(30,22,16,0)"),r.addColorStop(1,"rgba(30,22,16,.85)"),e.fillStyle=r,e.fillRect(0,0,512,64);let o=Vt(5);for(let a=0;a<260;a++)e.fillStyle=`rgba(${o()<.75?"35,26,18":"240,232,215"},${o()*.28})`,e.fillRect(o()*512,o()*64,3+o()*30,1+o()*4)}};return{map:da(512,64,e=>n(e,!1)),bump:da(512,64,e=>n(e,!0),!1)}}var Gu=class{group=new ct;a=new ct;b=new ct;close=0;target=0;constructor(){let e=new Je({color:"#7d7f82",metalness:1,roughness:.38,envMapIntensity:1}),t=new Je({color:"#3b3d40",metalness:.9,roughness:.5}),i=new Je({color:"#5e0b07",roughness:.55,metalness:0,clearcoat:.4,clearcoatRoughness:.45});for(let[r,o]of[[this.a,1],[this.b,-1]]){let a=new Ri;a.moveTo(0,0),a.lineTo(.055,o*.002),a.quadraticCurveTo(.03,o*.012,-.005,o*.011),a.lineTo(0,0);let l=new ji(a,{depth:.006,bevelEnabled:!0,bevelSize:.0012,bevelThickness:.0012,bevelSegments:2});l.translate(0,0,-.003+o*.0032),l.rotateX(Math.PI/2);let c=new ge(l,e);c.castShadow=!0,r.add(c);let h=new Ki([new C(-.005,0,o*.006),new C(-.04,0,o*.014),new C(-.09,0,o*.026),new C(-.15,0,o*.03)]);r.add(new ge(new Ms(h,20,.0045,8),t));let u=new Ki([new C(-.04,0,o*.014),new C(-.09,0,o*.026),new C(-.155,0,o*.03)]),d=new ge(new Ms(u,24,.0078,12),i);d.castShadow=!0,r.add(d);let f=new ge(new nn(.0078,12,8),i);f.position.set(-.155,0,o*.03),r.add(f),this.group.add(r)}this.group.add(new ge(new xt(.007,.007,.016,16),e));let s=new ge(new Dt(.011,.0015,.002),t);s.position.y=.0082,this.group.add(s),this.group.visible=!1}update(e){this.close+=(this.target-this.close)*Math.min(1,e*28);let t=.42*(1-this.close);this.a.rotation.y=t,this.b.rotation.y=-t}},Hc=class{group=new ct;door=new ct;pickDoor=[];wireMeshes=[];open=!1;doorT=0;halves=[];plate;plateCanvas=document.createElement("canvas");lamp;lampLight;sparks;sparkVel=[];sparkLife=0;braid=ax();pliers=new Gu;aim=new C(0,-.04,.07);aimTarget=new C(0,-.04,.07);snipping=0;reach=0;hot=[];header=new ct;meter=new Bc(.055);button=new kc;selector=new zc;latch=new ct;latchT=0;terminals=new ct;mats;fault="power";fxT=0;hum=null;onTest=e=>{};locked=!1;task=null;sounds=null;onCut=e=>{};constructor(e){let t=new Zn,i=(R,P,N=1,O=0)=>{let X=t.load(vi+R);return X.wrapS=X.wrapT=rn,X.repeat.set(N,N),X.offset.set(O,O*.7),X.colorSpace=P?nt:Ft,X.anisotropy=4,X},s=R=>new Je({map:i("rusty_metal_05_diff_1k.jpg",!0,.55,R),normalMap:i("rusty_metal_05_nor_gl_1k.jpg",!1,.55,R),roughnessMap:i("rusty_metal_05_rough_1k.jpg",!1,.55,R),color:"#4f453e",metalness:.6,roughness:1,envMapIntensity:.55}),r=s(0),o=s(.37),a=new Je({color:"#8a6a36",metalness:.9,roughness:.42,envMapIntensity:.9}),l=new Je({color:"#5e4624",metalness:.85,roughness:.55}),c=new Je({color:"#b8ad98",roughness:.22,metalness:0,clearcoat:.8,clearcoatRoughness:.2,map:da(256,64,R=>{R.fillStyle="#eee8dc",R.fillRect(0,0,256,64);let P=Vt(3);for(let N=0;N<120;N++)R.fillStyle=`rgba(60,45,30,${P()*.25})`,R.fillRect(P()*256,P()*64,2+P()*20,1+P()*3);R.strokeStyle="rgba(80,60,40,.35)",R.lineWidth=1;for(let N=0;N<6;N++){R.beginPath();let O=P()*256,X=P()*64;R.moveTo(O,X);for(let J=0;J<6;J++)O+=(P()-.5)*30,X+=(P()-.5)*12,R.lineTo(O,X);R.stroke()}})}),h=new Je({roughness:.62,metalness:0,map:da(512,640,R=>{R.fillStyle="#0e0b09",R.fillRect(0,0,512,640);let P=Vt(9);for(let O=0;O<2e3;O++)R.fillStyle=`rgba(${P()<.5?"70,60,50":"0,0,0"},${P()*.2})`,R.fillRect(P()*512,P()*640,1+P()*6,1+P()*2);R.font="bold 42px 'IM Fell English SC', Georgia, serif",R.textAlign="center",R.fillStyle="#ff5a3a",R.fillText("DANGER",256,300),R.font="bold 24px 'IM Fell English SC', Georgia, serif",R.fillStyle="#f4ead4",R.fillText("220 VOLTS \xB7 ISOLATE BEFORE WORK",256,334);let N=R.createRadialGradient(256,330,50,256,330,360);N.addColorStop(0,"rgba(0,0,0,0)"),N.addColorStop(1,"rgba(0,0,0,.4)"),R.fillStyle=N,R.fillRect(0,0,512,640)})});h.emissiveMap=h.map,h.emissive.set("#ffffff"),h.emissiveIntensity=.45;let u=(R,P,N,O,X,J=this.group)=>{let z=new ge(R,P);return z.position.set(N,O,X),z.castShadow=z.receiveShadow=!0,J.add(z),z},d=(R,P,N,O=.003)=>new ss(R,P,N,2,O);u(new Dt(It-.01,sn-.01,.006),h,0,0,Gt+.003),u(d(It,sn,Gt),r,0,0,Gt/2),u(d(Gt,sn,In),r,-It/2+Gt/2,0,In/2),u(d(Gt,sn,In),r,It/2-Gt/2,0,In/2),u(d(It,Gt,In),r,0,sn/2-Gt/2,In/2),u(d(It,Gt,In),r,0,-sn/2+Gt/2,In/2);let f=.02;for(let[R,P,N,O]of[[It+.012,f,0,sn/2-f/2+.006],[It+.012,f,0,-sn/2+f/2-.006],[f,sn+.012,-It/2+f/2-.006,0],[f,sn+.012,It/2-f/2+.006,0]])u(d(R,P,.01,.003),r,N,O,In-.002);let m=new nn(.0042,10,6,0,Math.PI*2,0,Math.PI/2);m.rotateX(Math.PI/2);let _=[];for(let R=0;R<=8;R++){let P=-It/2+.005+R*(It-.01)/8;_.push(new C(P,sn/2-.004,In+.003),new C(P,-sn/2+.004,In+.003))}for(let R=1;R<10;R++){let P=-sn/2+R*sn/10;_.push(new C(-It/2-.002,P,In+.003),new C(It/2+.002,P,In+.003))}let p=new Ei(m,l,_.length);_.forEach((R,P)=>p.setMatrixAt(P,new We().makeTranslation(R.x,R.y,R.z))),this.group.add(p);for(let[R,P]of[[-1,1],[1,1],[-1,-1],[1,-1]])u(new xt(.009,.009,.008,6),l,R*(It/2-.035),P*(sn/2-.035),Gt+.01).rotation.x=Math.PI/2;for(let R of[ua+.012,Gc-.012])u(new ss(It-.07,.05,.03,3,.008),c,0,R,Gt+.021);this.mats={brass:a,brassDark:l},this.plateCanvas.width=1040,this.plateCanvas.height=360,this.plate=new an(this.plateCanvas),this.plate.colorSpace=nt,this.plate.anisotropy=16;let g=new ge(d(.26,.09,.004,.0015),[a,a,a,a,new Je({map:this.plate,emissiveMap:this.plate,emissive:"#ffffff",emissiveIntensity:.45,metalness:.45,roughness:.45,clearcoat:.4,clearcoatRoughness:.35}),a]);g.position.set(0,.229,Gt+.01),this.group.add(g),this.door.position.set(-It/2-.006,0,In+.012),this.group.add(this.door);let T=u(d(It+.012,sn+.012,.012,.004),o,It/2+.006,0,0,this.door);this.pickDoor.push(T);let x=u(new xt(.026,.028,.006,24),l,It-.045,0,.009,this.door);x.rotation.x=Math.PI/2,this.pickDoor.push(x),this.latch.position.set(It-.045,0,.02),this.door.add(this.latch);let v=new ge(new xt(.007,.008,.02,12),a);v.rotation.x=Math.PI/2,this.latch.add(v);let M=new ge(d(.075,.014,.01,.004),a);M.position.z=.01,M.castShadow=!0,this.latch.add(M);for(let R of[-1,1]){let P=new ge(new nn(.009,12,8),a);P.position.set(R*.037,0,.01),this.latch.add(P)}let E=u(new Dt(.016,.03,.012),l,It/2+.013,0,In+.01);this.latch.traverse(R=>this.pickDoor.push(R));let A=new ge(new En(.11,.1),new Je({transparent:!0,roughness:.7,metalness:.2,map:da(256,232,R=>{R.fillStyle="#b5862a",R.beginPath(),R.moveTo(128,8),R.lineTo(250,224),R.lineTo(6,224),R.closePath(),R.fill(),R.lineWidth=10,R.strokeStyle="#1d1510",R.lineJoin="round",R.stroke(),R.fillStyle="#1d1510",R.beginPath(),R.moveTo(140,70),R.lineTo(104,150),R.lineTo(130,150),R.lineTo(112,205),R.lineTo(156,128),R.lineTo(130,128),R.lineTo(148,70),R.closePath(),R.fill(),R.globalCompositeOperation="source-atop";let P=Vt(4);for(let N=0;N<500;N++)R.fillStyle=`rgba(${P()<.6?"90,45,15":"20,12,8"},${P()*.5})`,R.beginPath(),R.arc(P()*256,P()*232,1+P()*7,0,7),R.fill()})}));A.position.set(It/2+.006,.14,.0068),this.door.add(A),this.pickDoor.push(A);for(let R of[sn/2-.07,-sn/2+.07])u(new xt(.008,.008,.075,12),l,-.004,R,-.002);let y=.2,S=sn/2+y/2+.004;this.header.position.set(0,S,0),this.group.add(this.header),u(d(It+.02,y,.075,.005),r,0,0,.0375,this.header),u(d(It-.02,y-.03,.006,.003),new Je({color:"#1a1512",roughness:.7,metalness:.3,map:r.map}),0,0,.077,this.header);for(let[R,P]of[[-1,1],[1,1],[-1,-1],[1,-1]]){let N=u(new xt(.006,.006,.006,6),l,R*(It/2-.01),P*(y/2-.012),.079,this.header);N.rotation.x=Math.PI/2}this.meter.group.position.set(-.13,.006,.096),this.header.add(this.meter.group),this.button.group.position.set(.035,.018,.08),this.header.add(this.button.group),this.selector.group.position.set(.15,.018,.08),this.header.add(this.selector.group);let I=u(new xt(.016,.019,.014,16),l,-.13,y/2+.008,.045,this.header);this.lamp=new ge(new nn(.015,16,10),new Je({color:"#3a0d06",emissive:"#000",roughness:.2,clearcoat:1})),this.lamp.position.set(-.13,y/2+.03,.045),this.header.add(this.lamp);for(let R=0;R<4;R++){let P=new ge(new bs(.017,.0012,6,16,Math.PI),l);P.position.copy(this.lamp.position),P.rotation.y=R*Math.PI/4,this.header.add(P)}this.lampLight=new Gn("#ff3b1f",0,1.2,2),this.lampLight.position.copy(this.lamp.position),this.header.add(this.lampLight);let D=new fi("#ffe6c8",5,1.6,.75,.6,1.5);D.position.set(0,sn/2+.12,.45),D.target.position.set(0,-.02,.04),this.group.add(D,D.target);let F=new pt;F.setAttribute("position",new wt(new Float32Array(168),3));for(let R=0;R<56;R++)this.sparkVel.push(new C);this.sparks=new Zi(F,new ys({color:"#ffc46b",size:.007,transparent:!0,blending:Js,depthWrite:!1})),this.sparks.visible=!1,this.sparks.frustumCulled=!1,this.group.add(this.sparks),this.group.add(this.pliers.group,this.terminals),Vu(this.group,new Set([this.lamp])),Vu(this.header,new Set([this.lamp]))}setTask(e){this.task=e,this.locked=!1,this.drawPlate(e.serial),this.setLamp("off");for(let i of this.wireMeshes)i.geometry.dispose(),i.removeFromParent();for(let i of this.halves)i.top.removeFromParent(),i.bot.removeFromParent();this.wireMeshes=[],this.halves=[],this.buildTerminals(e.wires.length);let t=e.wires.length;e.wires.forEach((i,s)=>{let r=(s-(t-1)/2)*Tm,o=Vt(s*31+e.serial.charCodeAt(5)),a=Gt+.05,l=.02+o()*.035,c=(o()-.5)*.022,h=ua+.012-.044,u=Gc-.012+.044,d=new Ki([new C(r,h,a),new C(r,h-.03,a+.01),new C(r+c*.6,h-.1,a+l*.8),new C(r+c,(h+u)/2,a+l),new C(r+c*.5,u+.1,a+l*.7),new C(r,u+.03,a+.01),new C(r,u,a)]),f=this.braid.map.clone(),m=this.braid.bump.clone();f.wrapS=f.wrapT=m.wrapS=m.wrapT=rn,m.repeat.set(9,1),f.needsUpdate=m.needsUpdate=!0;let _=new Je({color:oa[i],map:f,bumpMap:m,bumpScale:1.2,roughness:.82,metalness:0,sheen:.6,sheenRoughness:.7,sheenColor:new Ne(oa[i]).multiplyScalar(.6)}),p=new ge(new Ms(d,64,.0098,14),_);p.castShadow=!0,p.userData={wire:s,curve:d,mat:_},this.group.add(p),this.wireMeshes.push(p)})}buildTerminals(e){for(let r of[...this.terminals.children])r.removeFromParent(),r.geometry?.dispose?.();let{brass:t,brassDark:i}=this.mats,s=(r,o,a,l,c)=>{let h=new ge(r,o);return h.position.set(a,l,c),h.castShadow=!0,this.terminals.add(h),h};for(let r=0;r<e;r++){let o=(r-(e-1)/2)*Tm;for(let l of[ua+.012,Gc-.012]){let c=l>0?-1:1;s(new xt(.013,.013,.002,20),t,o,l,Gt+.037).rotation.x=Math.PI/2,s(new xt(.0105,.0105,.008,6),t,o,l,Gt+.042).rotation.x=Math.PI/2,s(new xt(.0065,.0072,.004,16),t,o,l,Gt+.048).rotation.x=Math.PI/2,s(new Dt(.011,.0016,.002),i,o,l,Gt+.0502).rotation.z=(r*1.3+l*9)%3,s(new xt(.0125,.011,.028,16),t,o,l+c*.03,Gt+.05)}let a=Vc(ox[r],.044,.024,150,"enamel",{mono:!0,screws:!1});a.position.set(o,ua+.05,Gt+.026),this.terminals.add(a)}Vu(this.terminals,new Set,!1)}configure(e,t){this.fault=e,this.meter.setState(e),this.selector.setMode(t)}runTest(){return this.meter.testing?!1:(this.button.push(),this.meter.test(2),this.fxT=2,this.onTest(this.fault),!0)}get testing(){return this.meter.testing}drawPlate(e){let t=this.plateCanvas,i=t.getContext("2d"),s=t.width,r=t.height,o=Vt(e.charCodeAt(1)*13),a=i.createLinearGradient(0,0,0,r);a.addColorStop(0,"#1e1915"),a.addColorStop(1,"#0e0b09"),i.fillStyle=a,i.fillRect(0,0,s,r);for(let u=0;u<1500;u++)i.fillStyle=`rgba(${o()<.5?"255,240,210":"0,0,0"},${o()*.05})`,i.fillRect(o()*s,o()*r,2+o()*20,1);i.strokeStyle="#a17c3e",i.lineWidth=14,i.strokeRect(7,7,s-14,r-14),i.strokeStyle="rgba(40,25,8,.8)",i.lineWidth=3,i.strokeRect(22,22,s-44,r-44);for(let[u,d]of[[48,48],[s-48,48],[48,r-48],[s-48,r-48]]){let f=i.createRadialGradient(u-5,d-5,1,u,d,17);f.addColorStop(0,"#d8b77a"),f.addColorStop(1,"#5a4222"),i.fillStyle=f,i.beginPath(),i.arc(u,d,17,0,7),i.fill(),i.strokeStyle="#2a1a08",i.lineWidth=4,i.beginPath(),i.moveTo(u-11,d+4),i.lineTo(u+11,d-4),i.stroke()}i.textAlign="center",i.textBaseline="middle",i.fillStyle="#f0d396",i.font="700 48px 'Cinzel', Georgia, serif";{let u="SERIAL NO.",d=0,f=10;for(let _ of u)d+=i.measureText(_).width+f;let m=s/2-d/2+f/2;i.textAlign="left";for(let _ of u)i.fillText(_,m,92),m+=i.measureText(_).width+f}i.strokeStyle="rgba(184,149,90,.5)",i.lineWidth=2,i.beginPath(),i.moveTo(170,128),i.lineTo(s-170,128),i.stroke(),i.font="700 170px 'IBM Plex Mono', Menlo, monospace";let l=18,c=0;for(let u of e)c+=i.measureText(u).width+l;c-=l;let h=s/2-c/2;for(let u of e)i.fillStyle="rgba(0,0,0,.7)",i.fillText(u,h+3,246),i.fillStyle="#fffaea",i.fillText(u,h,242),h+=i.measureText(u).width+l;this.plate.needsUpdate=!0}setLamp(e){let t=this.lamp.material,i=e==="good"?"#3dff6a":e==="bad"?"#ff2a14":"#000";t.emissive.set(i),t.emissiveIntensity=e==="off"?0:3,this.lampLight.color.set(i),this.lampLight.intensity=e==="off"?0:1.2}toggleDoor(){this.open=!this.open,this.sounds?.door(this.open)}hover(e){if(!this.open||this.locked||this.snipping)return;let t=e.intersectObjects(this.wireMeshes,!1)[0];if(t){this.aimTarget.copy(this.group.worldToLocal(t.point.clone()));return}let i=new Un(new C(0,0,1),-(Gt+.08)).applyMatrix4(this.group.matrixWorld),s=new C;e.ray.intersectPlane(i,s)&&(this.group.worldToLocal(s),this.aimTarget.set(Zt.clamp(s.x,-.17,.17),Zt.clamp(s.y,Gc+.06,ua-.06),Gt+.06))}tap(e){let t=e.intersectObjects([...this.pickDoor,...this.wireMeshes,...this.button.pick,...this.selector.pick,this.header],!0);if(!t.length)return null;let i=t[0].object;return this.button.pick.includes(i)?(this.runTest(),"test"):this.selector.pick.includes(i)?(this.selector.tryTurn(),this.sounds?.door(!1),"selector"):i.parent===this.header||this.header.children.includes(i)||this.meter.group.getObjectById(i.id)?"panel":this.pickDoor.includes(i)||this.latch.getObjectById(i.id)?(this.snipping||this.toggleDoor(),"door"):i.userData.wire!==void 0&&this.open&&!this.locked&&!this.snipping?(this.snip(i,t[0].point),"wire"):"box"}pickables(){return[...this.pickDoor,...this.wireMeshes,...this.group.children]}snip(e,t){this.locked=!0,this.snipping=1,this.aimTarget.copy(this.group.worldToLocal(t.clone())),setTimeout(()=>{this.pliers.target=1},150),setTimeout(()=>this.cut(e,t),260),setTimeout(()=>{this.pliers.target=0,this.snipping=0},560)}cut(e,t){let i=e.userData.wire,s=e.userData.curve,r=e.userData.mat,o=s.getSpacedPoints(80),a=this.group.worldToLocal(t.clone()),l=0,c=1e9;o.forEach((_,p)=>{let g=_.distanceTo(a);g<c&&(c=g,l=p)}),l=Zt.clamp(l,14,66);let h=(_,p,g,T)=>{let x=new ct;x.position.copy(p);let v=new ge(new Ms(new Ki(_.map(E=>E.clone().sub(p))),32,.0098,14),r);v.castShadow=!0,x.add(v);let M=cx(r.color);return M.position.copy(g).sub(p),M.quaternion.setFromUnitVectors(new C(0,1,0),T),x.add(M),this.hot.push(M.userData.hot),this.group.add(x),x},u=o[l-2].clone().sub(o[l-4]).normalize(),d=o[l+1].clone().sub(o[l+3]).normalize(),f=h(o.slice(0,l-1),o[0],o[l-2],u),m=h(o.slice(l+1),o[80],o[l+1],d);e.visible=!1,this.halves.push({top:f,bot:m,t:0,side:i<this.wireMeshes.length/2?-1:1}),this.burst(o[l]),this.sounds?.snip(),setTimeout(()=>this.sounds?.spark(),40),this.onCut(i)}burst(e){let t=this.sparks.geometry.attributes.position;for(let i=0;i<t.count;i++)t.setXYZ(i,e.x,e.y,e.z),this.sparkVel[i].set((Math.random()-.5)*1.3,Math.random(),Math.random()*.9);t.needsUpdate=!0,this.sparkLife=.7,this.sparks.visible=!0}update(e){this.latchT+=((this.open?1:0)-this.latchT)*Math.min(1,e*9),this.latch.rotation.z=-this.latchT*Math.PI/2;let t=this.open&&this.latchT>.85?1:0;this.doorT+=(t-this.doorT)*Math.min(1,e*5),this.door.rotation.y=-this.doorT*1.95,this.meter.update(e),this.button.update(e),this.selector.update(e),this.diagnosticFx(e);for(let l of this.halves){l.t=Math.min(1,l.t+e*2.2);let c=1-(1-l.t)**3,h=Math.sin(l.t*14)*(1-l.t)*.15;l.top.rotation.x=(.16+h*.4)*c,l.top.rotation.z=(.3+h)*c*l.side,l.bot.rotation.x=-(.12+h*.4)*c,l.bot.rotation.z=(.3+h)*c*l.side}if(this.sparkLife>0){this.sparkLife-=e;let l=this.sparks.geometry.attributes.position;for(let c=0;c<l.count;c++){let h=this.sparkVel[c];h.y-=3*e,l.setXYZ(c,l.getX(c)+h.x*e,l.getY(c)+h.y*e,l.getZ(c)+h.z*e)}l.needsUpdate=!0,this.sparks.material.opacity=Math.max(0,this.sparkLife/.7),this.sparkLife<=0&&(this.sparks.visible=!1)}for(let l of this.hot)l.t=Math.max(0,l.t-e*.9),l.mat.emissive.setRGB(1,.42-.2*l.t,.1-.08*l.t),l.mat.emissiveIntensity=.1+l.t*l.t*2;let i=this.pliers;i.group.visible=this.doorT>.6,this.aim.lerp(this.aimTarget,Math.min(1,e*(this.snipping?14:10)));let s=new C(-.3,.22,-.93).normalize(),r=new C(0,1,0).addScaledVector(s,-s.y).normalize(),o=new C().crossVectors(s,r);this.reach+=((this.snipping?1:0)-this.reach)*Math.min(1,e*16);let a=.034*1.45+(1-this.reach)*.075;i.group.position.copy(this.aim).addScaledVector(s,-a),i.group.quaternion.setFromRotationMatrix(new We().makeBasis(s,r,o)),i.group.scale.setScalar(1.45),i.update(e)}center(){return this.group.localToWorld(new C(0,.07,In))}diagnosticFx(e){let t=this.lamp.material;if(this.fxT<=0){this.header.position.x=0;return}this.fxT-=e;let i=performance.now()/1e3,s=this.fxT>0;if(this.fault==="overload"){let r=Math.sin(i*60)>0?1:.25;t.emissive.set("#ffa21a"),t.emissiveIntensity=s?3.2*r:0,this.lampLight.color.set("#ffa21a"),this.lampLight.intensity=s?1.4*r:0,this.header.position.x=s?Math.sin(i*190)*6e-4:0}else if(this.fault==="short"){let r=Math.sin(i*23)*Math.sin(i*57)>.1?1:0;if(t.emissive.set("#ff2a14"),t.emissiveIntensity=s?3*r:0,this.lampLight.color.set("#ff2a14"),this.lampLight.intensity=s?r:0,s&&Math.random()<e*5&&this.wireMeshes.length){let o=this.wireMeshes[Math.floor(Math.random()*this.wireMeshes.length)],a=o.userData.curve.getPoint(Math.random()<.5?.03:.97);this.burst(a),this.sounds?.spark()}}else t.emissive.set("#ff4a1a"),t.emissiveIntensity=s?.35*(1-(2-this.fxT)/2)+.05:0,this.lampLight.color.set("#ff4a1a"),this.lampLight.intensity=s?.15:0;s||(t.emissiveIntensity=0,this.lampLight.intensity=0,this.header.position.x=0)}},lx=new Je({color:"#c9632a",metalness:.7,roughness:.3,envMapIntensity:1.6,clearcoat:.5,clearcoatRoughness:.2}),wm=new Je({color:"#191512",roughness:.75,metalness:0});function cx(n){let e=new ct,t=new ge(new xt(.0076,.0082,.0045,18),wm);t.position.y=.0012,e.add(t);let i=new ge(new Ai(.0076,18),wm);i.rotation.x=-Math.PI/2,i.position.y=.0035,e.add(i);let s=new Je({color:n.clone().multiplyScalar(.85),roughness:.9});for(let a=0;a<14;a++){let l=a/14*Math.PI*2+Math.random()*.3,c=.003+Math.random()*.004,h=new ge(new xt(5e-4,3e-4,c,4),s);h.position.set(Math.cos(l)*.0094,-5e-4+c*.3,Math.sin(l)*.0094),h.rotation.set(Math.sin(l)*.9,0,-Math.cos(l)*.9),e.add(h)}let r=lx.clone();r.emissive=new Ne("#ff6a1a"),r.emissiveIntensity=2.2;let o=.024+Math.random()*.004;for(let a=0;a<7;a++){let l=a===6,c=a/6*Math.PI*2,h=l?o*1.08:o*(.85+Math.random()*.25),u=l?0:.16+Math.random()*.12,d=new ge(new xt(.0017,.0019,h,7),r),f=l?0:.0034;d.position.set(Math.cos(c)*(f+Math.sin(u)*h/2),.003+h/2*Math.cos(u),Math.sin(c)*(f+Math.sin(u)*h/2)),d.rotation.set(Math.sin(c)*u,0,-Math.cos(c)*u),d.castShadow=!0,e.add(d)}return e.userData.hot={mat:r,t:1},e}function Vu(n,e,t=!0){n.updateMatrix();let i=new Map;for(let s of[...n.children]){let r=s;if(!r.isMesh||r.isInstancedMesh||Array.isArray(r.material)||e.has(r)||r.children.length)continue;r.updateMatrix();let o=(r.geometry.index?r.geometry.toNonIndexed():r.geometry.clone()).applyMatrix4(r.matrix);for(let l of Object.keys(o.attributes))["position","normal","uv"].includes(l)||o.deleteAttribute(l);o.attributes.uv||o.setAttribute("uv",new ot(new Float32Array(o.attributes.position.count*2),2));let a=i.get(r.material)||{geos:[],meshes:[]};a.geos.push(o),a.meshes.push(r),i.set(r.material,a)}for(let[s,r]of i){if(r.geos.length<2)continue;let o=bc(r.geos);if(!o)continue;for(let c of r.meshes)c.removeFromParent(),c.geometry.dispose();let a=r.meshes.some(c=>(c.geometry.computeBoundingSphere?.(),(c.geometry.boundingSphere?.radius||0)>.12)),l=new ge(o,s);l.castShadow=t&&a,l.receiveShadow=!0,n.add(l)}}function Em(n){let e=new Map,t=new Map,i=n.clone();return Am(n,i,function(s,r){e.set(r,s),t.set(s,r)}),i.traverse(function(s){if(!s.isSkinnedMesh)return;let r=s,o=e.get(s),a=o.skeleton.bones;r.skeleton=o.skeleton.clone(),r.bindMatrix.copy(o.bindMatrix),r.skeleton.bones=a.map(function(l){return t.get(l)}),r.bind(r.skeleton,r.bindMatrix)}),i}function Am(n,e,t){t(n,e);for(let i=0;i<n.children.length;i++)Am(n.children[i],e.children[i],t)}var Wc=class extends di{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(t){return new Zu(t)}),this.register(function(t){return new Ku(t)}),this.register(function(t){return new rd(t)}),this.register(function(t){return new od(t)}),this.register(function(t){return new ad(t)}),this.register(function(t){return new ju(t)}),this.register(function(t){return new Qu(t)}),this.register(function(t){return new ed(t)}),this.register(function(t){return new td(t)}),this.register(function(t){return new $u(t)}),this.register(function(t){return new nd(t)}),this.register(function(t){return new Ju(t)}),this.register(function(t){return new sd(t)}),this.register(function(t){return new id(t)}),this.register(function(t){return new qu(t)}),this.register(function(t){return new Xc(t,at.EXT_MESHOPT_COMPRESSION)}),this.register(function(t){return new Xc(t,at.KHR_MESHOPT_COMPRESSION)}),this.register(function(t){return new ld(t)})}load(e,t,i,s){let r=this,o;if(this.resourcePath!=="")o=this.resourcePath;else if(this.path!==""){let c=is.extractUrlBase(e);o=is.resolveURL(c,this.path)}else o=is.extractUrlBase(e);this.manager.itemStart(e);let a=function(c){s?s(c):console.error(c),r.manager.itemError(e),r.manager.itemEnd(e)},l=new Ys(this.manager);l.setPath(this.path),l.setResponseType("arraybuffer"),l.setRequestHeader(this.requestHeader),l.setWithCredentials(this.withCredentials),l.load(e,function(c){try{r.parse(c,o,function(h){t(h),r.manager.itemEnd(e)},a)}catch(h){a(h)}},i,a)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,i,s){let r,o={},a={},l=new TextDecoder;if(typeof e=="string")r=JSON.parse(e);else if(e instanceof ArrayBuffer)if(l.decode(new Uint8Array(e,0,4))===Lm){try{o[at.KHR_BINARY_GLTF]=new cd(e)}catch(u){s&&s(u);return}r=JSON.parse(o[at.KHR_BINARY_GLTF].content)}else r=JSON.parse(l.decode(e));else r=e;if(r.asset===void 0||r.asset.version[0]<2){s&&s(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}let c=new gd(r,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});c.fileLoader.setRequestHeader(this.requestHeader);for(let h=0;h<this.pluginCallbacks.length;h++){let u=this.pluginCallbacks[h](c);u.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),a[u.name]=u,o[u.name]=!0}if(r.extensionsUsed)for(let h=0;h<r.extensionsUsed.length;++h){let u=r.extensionsUsed[h],d=r.extensionsRequired||[];switch(u){case at.KHR_MATERIALS_UNLIT:o[u]=new Yu;break;case at.KHR_DRACO_MESH_COMPRESSION:o[u]=new hd(r,this.dracoLoader);break;case at.KHR_TEXTURE_TRANSFORM:o[u]=new ud;break;case at.KHR_MESH_QUANTIZATION:o[u]=new dd;break;default:d.indexOf(u)>=0&&a[u]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+u+'".')}}c.setExtensions(o),c.setPlugins(a),c.parse(i,s)}parseAsync(e,t){let i=this;return new Promise(function(s,r){i.parse(e,t,s,r)})}};function hx(){let n={};return{get:function(e){return n[e]},add:function(e,t){n[e]=t},remove:function(e){delete n[e]},removeAll:function(){n={}}}}function jt(n,e,t){let i=n.json.materials[e];return i.extensions&&i.extensions[t]?i.extensions[t]:null}var at={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",KHR_MESHOPT_COMPRESSION:"KHR_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"},qu=class{constructor(e){this.parser=e,this.name=at.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){let e=this.parser,t=this.parser.json.nodes||[];for(let i=0,s=t.length;i<s;i++){let r=t[i];r.extensions&&r.extensions[this.name]&&r.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,r.extensions[this.name].light)}}_loadLight(e){let t=this.parser,i="light:"+e,s=t.cache.get(i);if(s)return s;let r=t.json,l=((r.extensions&&r.extensions[this.name]||{}).lights||[])[e],c,h=new Ne(16777215);l.color!==void 0&&h.setRGB(l.color[0],l.color[1],l.color[2],_n);let u=l.range!==void 0?l.range:0;switch(l.type){case"directional":c=new Wo(h),c.target.position.set(0,0,-1),c.add(c.target);break;case"point":c=new Gn(h),c.distance=u;break;case"spot":c=new fi(h),c.distance=u,l.spot=l.spot||{},l.spot.innerConeAngle=l.spot.innerConeAngle!==void 0?l.spot.innerConeAngle:0,l.spot.outerConeAngle=l.spot.outerConeAngle!==void 0?l.spot.outerConeAngle:Math.PI/4,c.angle=l.spot.outerConeAngle,c.penumbra=1-l.spot.innerConeAngle/l.spot.outerConeAngle,c.target.position.set(0,0,-1),c.add(c.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+l.type)}return c.position.set(0,0,0),Oi(c,l),l.intensity!==void 0&&(c.intensity=l.intensity),c.name=t.createUniqueName(l.name||"light_"+e),s=Promise.resolve(c),t.cache.add(i,s),s}getDependency(e,t){if(e==="light")return this._loadLight(t)}createNodeAttachment(e){let t=this,i=this.parser,r=i.json.nodes[e],a=(r.extensions&&r.extensions[this.name]||{}).light;return a===void 0?null:this._loadLight(a).then(function(l){return i._getNodeRef(t.cache,a,l)})}},Yu=class{constructor(){this.name=at.KHR_MATERIALS_UNLIT}getMaterialType(){return wn}extendParams(e,t,i){let s=[];e.color=new Ne(1,1,1),e.opacity=1;let r=t.pbrMetallicRoughness;if(r){if(Array.isArray(r.baseColorFactor)){let o=r.baseColorFactor;e.color.setRGB(o[0],o[1],o[2],_n),e.opacity=o[3]}r.baseColorTexture!==void 0&&s.push(i.assignTexture(e,"map",r.baseColorTexture,nt))}return Promise.all(s)}},$u=class{constructor(e){this.parser=e,this.name=at.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){let i=jt(this.parser,e,this.name);return i===null||i.emissiveStrength!==void 0&&(t.emissiveIntensity=i.emissiveStrength),Promise.resolve()}},Zu=class{constructor(e){this.parser=e,this.name=at.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){return jt(this.parser,e,this.name)!==null?Je:null}extendMaterialParams(e,t){let i=jt(this.parser,e,this.name);if(i===null)return Promise.resolve();let s=[];if(i.clearcoatFactor!==void 0&&(t.clearcoat=i.clearcoatFactor),i.clearcoatTexture!==void 0&&s.push(this.parser.assignTexture(t,"clearcoatMap",i.clearcoatTexture)),i.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=i.clearcoatRoughnessFactor),i.clearcoatRoughnessTexture!==void 0&&s.push(this.parser.assignTexture(t,"clearcoatRoughnessMap",i.clearcoatRoughnessTexture)),i.clearcoatNormalTexture!==void 0&&(s.push(this.parser.assignTexture(t,"clearcoatNormalMap",i.clearcoatNormalTexture)),i.clearcoatNormalTexture.scale!==void 0)){let r=i.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new ae(r,r)}return Promise.all(s)}},Ku=class{constructor(e){this.parser=e,this.name=at.KHR_MATERIALS_DISPERSION}getMaterialType(e){return jt(this.parser,e,this.name)!==null?Je:null}extendMaterialParams(e,t){let i=jt(this.parser,e,this.name);return i===null||(t.dispersion=i.dispersion!==void 0?i.dispersion:0),Promise.resolve()}},Ju=class{constructor(e){this.parser=e,this.name=at.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){return jt(this.parser,e,this.name)!==null?Je:null}extendMaterialParams(e,t){let i=jt(this.parser,e,this.name);if(i===null)return Promise.resolve();let s=[];return i.iridescenceFactor!==void 0&&(t.iridescence=i.iridescenceFactor),i.iridescenceTexture!==void 0&&s.push(this.parser.assignTexture(t,"iridescenceMap",i.iridescenceTexture)),i.iridescenceIor!==void 0&&(t.iridescenceIOR=i.iridescenceIor),t.iridescenceThicknessRange===void 0&&(t.iridescenceThicknessRange=[100,400]),i.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessRange[0]=i.iridescenceThicknessMinimum),i.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessRange[1]=i.iridescenceThicknessMaximum),i.iridescenceThicknessTexture!==void 0&&s.push(this.parser.assignTexture(t,"iridescenceThicknessMap",i.iridescenceThicknessTexture)),Promise.all(s)}},ju=class{constructor(e){this.parser=e,this.name=at.KHR_MATERIALS_SHEEN}getMaterialType(e){return jt(this.parser,e,this.name)!==null?Je:null}extendMaterialParams(e,t){let i=jt(this.parser,e,this.name);if(i===null)return Promise.resolve();let s=[];if(t.sheenColor=new Ne(0,0,0),t.sheenRoughness=0,t.sheen=1,i.sheenColorFactor!==void 0){let r=i.sheenColorFactor;t.sheenColor.setRGB(r[0],r[1],r[2],_n)}return i.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=i.sheenRoughnessFactor),i.sheenColorTexture!==void 0&&s.push(this.parser.assignTexture(t,"sheenColorMap",i.sheenColorTexture,nt)),i.sheenRoughnessTexture!==void 0&&s.push(this.parser.assignTexture(t,"sheenRoughnessMap",i.sheenRoughnessTexture)),Promise.all(s)}},Qu=class{constructor(e){this.parser=e,this.name=at.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){return jt(this.parser,e,this.name)!==null?Je:null}extendMaterialParams(e,t){let i=jt(this.parser,e,this.name);if(i===null)return Promise.resolve();let s=[];return i.transmissionFactor!==void 0&&(t.transmission=i.transmissionFactor),i.transmissionTexture!==void 0&&s.push(this.parser.assignTexture(t,"transmissionMap",i.transmissionTexture)),Promise.all(s)}},ed=class{constructor(e){this.parser=e,this.name=at.KHR_MATERIALS_VOLUME}getMaterialType(e){return jt(this.parser,e,this.name)!==null?Je:null}extendMaterialParams(e,t){let i=jt(this.parser,e,this.name);if(i===null)return Promise.resolve();let s=[];t.thickness=i.thicknessFactor!==void 0?i.thicknessFactor:0,i.thicknessTexture!==void 0&&s.push(this.parser.assignTexture(t,"thicknessMap",i.thicknessTexture)),t.attenuationDistance=i.attenuationDistance||1/0;let r=i.attenuationColor||[1,1,1];return t.attenuationColor=new Ne().setRGB(r[0],r[1],r[2],_n),Promise.all(s)}},td=class{constructor(e){this.parser=e,this.name=at.KHR_MATERIALS_IOR}getMaterialType(e){return jt(this.parser,e,this.name)!==null?Je:null}extendMaterialParams(e,t){let i=jt(this.parser,e,this.name);return i===null||(t.ior=i.ior!==void 0?i.ior:1.5,t.ior===0&&(t.ior=1e3)),Promise.resolve()}},nd=class{constructor(e){this.parser=e,this.name=at.KHR_MATERIALS_SPECULAR}getMaterialType(e){return jt(this.parser,e,this.name)!==null?Je:null}extendMaterialParams(e,t){let i=jt(this.parser,e,this.name);if(i===null)return Promise.resolve();let s=[];t.specularIntensity=i.specularFactor!==void 0?i.specularFactor:1,i.specularTexture!==void 0&&s.push(this.parser.assignTexture(t,"specularIntensityMap",i.specularTexture));let r=i.specularColorFactor||[1,1,1];return t.specularColor=new Ne().setRGB(r[0],r[1],r[2],_n),i.specularColorTexture!==void 0&&s.push(this.parser.assignTexture(t,"specularColorMap",i.specularColorTexture,nt)),Promise.all(s)}},id=class{constructor(e){this.parser=e,this.name=at.EXT_MATERIALS_BUMP}getMaterialType(e){return jt(this.parser,e,this.name)!==null?Je:null}extendMaterialParams(e,t){let i=jt(this.parser,e,this.name);if(i===null)return Promise.resolve();let s=[];return t.bumpScale=i.bumpFactor!==void 0?i.bumpFactor:1,i.bumpTexture!==void 0&&s.push(this.parser.assignTexture(t,"bumpMap",i.bumpTexture)),Promise.all(s)}},sd=class{constructor(e){this.parser=e,this.name=at.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){return jt(this.parser,e,this.name)!==null?Je:null}extendMaterialParams(e,t){let i=jt(this.parser,e,this.name);if(i===null)return Promise.resolve();let s=[];return i.anisotropyStrength!==void 0&&(t.anisotropy=i.anisotropyStrength),i.anisotropyRotation!==void 0&&(t.anisotropyRotation=i.anisotropyRotation),i.anisotropyTexture!==void 0&&s.push(this.parser.assignTexture(t,"anisotropyMap",i.anisotropyTexture)),Promise.all(s)}},rd=class{constructor(e){this.parser=e,this.name=at.KHR_TEXTURE_BASISU}loadTexture(e){let t=this.parser,i=t.json,s=i.textures[e];if(!s.extensions||!s.extensions[this.name])return null;let r=s.extensions[this.name],o=t.options.ktx2Loader;if(!o){if(i.extensionsRequired&&i.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return t.loadTextureImage(e,r.source,o)}},od=class{constructor(e){this.parser=e,this.name=at.EXT_TEXTURE_WEBP}loadTexture(e){let t=this.name,i=this.parser,s=i.json,r=s.textures[e];if(!r.extensions||!r.extensions[t])return null;let o=r.extensions[t],a=s.images[o.source],l=i.textureLoader;if(a.uri){let c=i.options.manager.getHandler(a.uri);c!==null&&(l=c)}return i.loadTextureImage(e,o.source,l)}},ad=class{constructor(e){this.parser=e,this.name=at.EXT_TEXTURE_AVIF}loadTexture(e){let t=this.name,i=this.parser,s=i.json,r=s.textures[e];if(!r.extensions||!r.extensions[t])return null;let o=r.extensions[t],a=s.images[o.source],l=i.textureLoader;if(a.uri){let c=i.options.manager.getHandler(a.uri);c!==null&&(l=c)}return i.loadTextureImage(e,o.source,l)}},Xc=class{constructor(e,t){this.name=t,this.parser=e}loadBufferView(e){let t=this.parser.json,i=t.bufferViews[e];if(i.extensions&&i.extensions[this.name]){let s=i.extensions[this.name],r=this.parser.getDependency("buffer",s.buffer),o=this.parser.options.meshoptDecoder;if(!o||!o.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return r.then(function(a){let l=s.byteOffset||0,c=s.byteLength||0,h=s.count,u=s.byteStride,d=new Uint8Array(a,l,c);return o.decodeGltfBufferAsync?o.decodeGltfBufferAsync(h,u,d,s.mode,s.filter).then(function(f){return f.buffer}):o.ready.then(function(){let f=new ArrayBuffer(h*u);return o.decodeGltfBuffer(new Uint8Array(f),h,u,d,s.mode,s.filter),f})})}else return null}},ld=class{constructor(e){this.name=at.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){let t=this.parser.json,i=t.nodes[e];if(!i.extensions||!i.extensions[this.name]||i.mesh===void 0)return null;let s=t.meshes[i.mesh];for(let c of s.primitives)if(c.mode!==si.TRIANGLES&&c.mode!==si.TRIANGLE_STRIP&&c.mode!==si.TRIANGLE_FAN&&c.mode!==void 0)return null;let o=i.extensions[this.name].attributes,a=[],l={};for(let c in o)a.push(this.parser.getDependency("accessor",o[c]).then(h=>(l[c]=h,l[c])));return a.length<1?null:(a.push(this.parser.createNodeMesh(e)),Promise.all(a).then(c=>{let h=c.pop(),u=h.isGroup?h.children:[h],d=c[0].count,f=[];for(let m of u){let _=new We,p=new C,g=new ft,T=new C(1,1,1),x=new Ei(m.geometry,m.material,d);for(let M=0;M<d;M++)l.TRANSLATION&&p.fromBufferAttribute(l.TRANSLATION,M),l.ROTATION&&g.fromBufferAttribute(l.ROTATION,M),l.SCALE&&T.fromBufferAttribute(l.SCALE,M),x.setMatrixAt(M,_.compose(p,g,T));let v=null;for(let M in l)if(M==="_COLOR_0"){let E=l[M];x.instanceColor=new $i(E.array,E.itemSize,E.normalized)}else if(M!=="TRANSLATION"&&M!=="ROTATION"&&M!=="SCALE"){if(v===null){let A=x.geometry;v=new pt,v.name=A.name;for(let y in A.attributes)v.setAttribute(y,A.attributes[y]);for(let y in A.morphAttributes)v.morphAttributes[y]=A.morphAttributes[y];A.index!==null&&v.setIndex(A.index),v.morphTargetsRelative=A.morphTargetsRelative;for(let y of A.groups)v.addGroup(y.start,y.count,y.materialIndex);A.boundingBox!==null&&(v.boundingBox=A.boundingBox.clone()),A.boundingSphere!==null&&(v.boundingSphere=A.boundingSphere.clone()),v.drawRange.start=A.drawRange.start,v.drawRange.count=A.drawRange.count,v.userData=Object.assign({},A.userData),x.geometry=v}let E=l[M];v.setAttribute(M,new $i(E.array,E.itemSize,E.normalized))}Ut.prototype.copy.call(x,m),this.parser.assignFinalMaterial(x),f.push(x)}return h.isGroup?(h.clear(),h.add(...f),h):f[0]}))}},Lm="glTF",fa=12,Rm={JSON:1313821514,BIN:5130562},cd=class{constructor(e){this.name=at.KHR_BINARY_GLTF,this.content=null,this.body=null;let t=new DataView(e,0,fa),i=new TextDecoder;if(this.header={magic:i.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==Lm)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");let s=this.header.length-fa,r=new DataView(e,fa),o=0;for(;o<s;){let a=r.getUint32(o,!0);o+=4;let l=r.getUint32(o,!0);if(o+=4,l===Rm.JSON){let c=new Uint8Array(e,fa+o,a);this.content=i.decode(c)}else if(l===Rm.BIN){let c=fa+o;this.body=e.slice(c,c+a)}o+=a}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}},hd=class{constructor(e,t){if(!t)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=at.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){let i=this.json,s=this.dracoLoader,r=e.extensions[this.name].bufferView,o=e.extensions[this.name].attributes,a={},l={},c={};for(let h in o){let u=pd[h]||h.toLowerCase();a[u]=o[h]}for(let h in e.attributes){let u=pd[h]||h.toLowerCase();if(o[h]!==void 0){let d=i.accessors[e.attributes[h]],f=so[d.componentType];c[u]=f.name,l[u]=d.normalized===!0}}return t.getDependency("bufferView",r).then(function(h){return new Promise(function(u,d){s.decodeDracoFile(h,function(f){for(let m in f.attributes){let _=f.attributes[m],p=l[m];p!==void 0&&(_.normalized=p)}u(f)},a,c,_n,d)})})}},ud=class{constructor(){this.name=at.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){if((t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0)return e;if(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),t.rotation!==void 0){let i=Math.cos(e.rotation),s=Math.sin(e.rotation);e.matrix.set(e.repeat.x*i,e.repeat.y*s,e.offset.x,-e.repeat.x*s,e.repeat.y*i,e.offset.y,0,0,1),e.matrixAutoUpdate=!1}return e.needsUpdate=!0,e}},dd=class{constructor(){this.name=at.KHR_MESH_QUANTIZATION}},qc=class extends Ci{constructor(e,t,i,s){super(e,t,i,s)}copySampleValue_(e){let t=this.resultBuffer,i=this.sampleValues,s=this.valueSize,r=e*s*3+s;for(let o=0;o!==s;o++)t[o]=i[r+o];return t}interpolate_(e,t,i,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=a*2,c=a*3,h=s-t,u=(i-t)/h,d=u*u,f=d*u,m=e*c,_=m-c,p=-2*f+3*d,g=f-d,T=1-p,x=g-d+u;for(let v=0;v!==a;v++){let M=o[_+v+a],E=o[_+v+l]*h,A=o[m+v+a],y=o[m+v]*h;r[v]=T*M+x*E+p*A+g*y}return r}},ux=new ft,fd=class extends qc{interpolate_(e,t,i,s){let r=super.interpolate_(e,t,i,s);return ux.fromArray(r).normalize().toArray(r),r}},si={FLOAT:5126,FLOAT_MAT3:35675,FLOAT_MAT4:35676,FLOAT_VEC2:35664,FLOAT_VEC3:35665,FLOAT_VEC4:35666,LINEAR:9729,REPEAT:10497,SAMPLER_2D:35678,POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6,UNSIGNED_BYTE:5121,UNSIGNED_SHORT:5123},so={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},Cm={9728:qt,9729:Rt,9984:wl,9985:Wr,9986:er,9987:mn},Pm={33071:On,33648:Er,10497:rn},Hu={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},pd={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},Ds={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},dx={CUBICSPLINE:void 0,LINEAR:Gs,STEP:Vs},Wu={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function fx(n){return n.DefaultMaterial===void 0&&(n.DefaultMaterial=new $t({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:Hn})),n.DefaultMaterial}function ar(n,e,t){for(let i in t.extensions)n[i]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[i]=t.extensions[i])}function Oi(n,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(n.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function px(n,e,t){let i=!1,s=!1,r=!1;for(let c=0,h=e.length;c<h;c++){let u=e[c];if(u.POSITION!==void 0&&(i=!0),u.NORMAL!==void 0&&(s=!0),u.COLOR_0!==void 0&&(r=!0),i&&s&&r)break}if(!i&&!s&&!r)return Promise.resolve(n);let o=[],a=[],l=[];for(let c=0,h=e.length;c<h;c++){let u=e[c];if(i){let d=u.POSITION!==void 0?t.getDependency("accessor",u.POSITION):n.attributes.position;o.push(d)}if(s){let d=u.NORMAL!==void 0?t.getDependency("accessor",u.NORMAL):n.attributes.normal;a.push(d)}if(r){let d=u.COLOR_0!==void 0?t.getDependency("accessor",u.COLOR_0):n.attributes.color;l.push(d)}}return Promise.all([Promise.all(o),Promise.all(a),Promise.all(l)]).then(function(c){let h=c[0],u=c[1],d=c[2];return i&&(n.morphAttributes.position=h),s&&(n.morphAttributes.normal=u),r&&(n.morphAttributes.color=d),n.morphTargetsRelative=!0,n})}function mx(n,e){if(n.updateMorphTargets(),e.weights!==void 0)for(let t=0,i=e.weights.length;t<i;t++)n.morphTargetInfluences[t]=e.weights[t];if(e.extras&&Array.isArray(e.extras.targetNames)){let t=e.extras.targetNames;if(n.morphTargetInfluences.length===t.length){n.morphTargetDictionary={};for(let i=0,s=t.length;i<s;i++)n.morphTargetDictionary[t[i]]=i}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function gx(n){let e,t=n.extensions&&n.extensions[at.KHR_DRACO_MESH_COMPRESSION];if(t?e="draco:"+t.bufferView+":"+t.indices+":"+Xu(t.attributes):e=n.indices+":"+Xu(n.attributes)+":"+n.mode,n.targets!==void 0)for(let i=0,s=n.targets.length;i<s;i++)e+=":"+Xu(n.targets[i]);return e}function Xu(n){let e="",t=Object.keys(n).sort();for(let i=0,s=t.length;i<s;i++)e+=t[i]+":"+n[t[i]]+";";return e}function md(n){switch(n){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function _x(n){return n.search(/\.jpe?g($|\?)/i)>0||n.search(/^data\:image\/jpeg/)===0?"image/jpeg":n.search(/\.webp($|\?)/i)>0||n.search(/^data\:image\/webp/)===0?"image/webp":n.search(/\.ktx2($|\?)/i)>0||n.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}var yx=new We,gd=class{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new hx,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let i=!1,s=-1,r=!1,o=-1;if(typeof navigator<"u"&&typeof navigator.userAgent<"u"){let a=navigator.userAgent;i=/^((?!chrome|android).)*safari/i.test(a)===!0;let l=a.match(/Version\/(\d+)/);s=i&&l?parseInt(l[1],10):-1,r=a.indexOf("Firefox")>-1,o=r?a.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||i&&s<17||r&&o<98?this.textureLoader=new Zn(this.options.manager):this.textureLoader=new Xo(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new Ys(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials"&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){let i=this,s=this.json,r=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(o){return o._markDefs&&o._markDefs()}),Promise.all(this._invokeAll(function(o){return o.beforeRoot&&o.beforeRoot()})).then(function(){return Promise.all([i.getDependencies("scene"),i.getDependencies("animation"),i.getDependencies("camera")])}).then(function(o){let a={scene:o[0][s.scene||0],scenes:o[0],animations:o[1],cameras:o[2],asset:s.asset,parser:i,userData:{}};return ar(r,a,s),Oi(a,s),Promise.all(i._invokeAll(function(l){return l.afterRoot&&l.afterRoot(a)})).then(function(){for(let l of a.scenes)l.updateMatrixWorld();e(a)})}).catch(t)}_markDefs(){let e=this.json.nodes||[],t=this.json.skins||[],i=this.json.meshes||[];for(let s=0,r=t.length;s<r;s++){let o=t[s].joints;for(let a=0,l=o.length;a<l;a++)e[o[a]].isBone=!0}for(let s=0,r=e.length;s<r;s++){let o=e[s];o.mesh!==void 0&&(this._addNodeRef(this.meshCache,o.mesh),o.skin!==void 0&&(i[o.mesh].isSkinnedMesh=!0)),o.camera!==void 0&&this._addNodeRef(this.cameraCache,o.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,i){if(e.refs[t]<=1)return i;let s=i.clone(),r=(o,a)=>{let l=this.associations.get(o);l!=null&&this.associations.set(a,l);for(let[c,h]of o.children.entries())r(h,a.children[c])};return r(i,s),s.name+="_instance_"+e.uses[t]++,s}_invokeOne(e){let t=Object.values(this.plugins);t.push(this);for(let i=0;i<t.length;i++){let s=e(t[i]);if(s)return s}return null}_invokeAll(e){let t=Object.values(this.plugins);t.unshift(this);let i=[];for(let s=0;s<t.length;s++){let r=e(t[s]);r&&i.push(r)}return i}getDependency(e,t){let i=e+":"+t,s=this.cache.get(i);if(!s){switch(e){case"scene":s=this.loadScene(t);break;case"node":s=this._invokeOne(function(r){return r.loadNode&&r.loadNode(t)});break;case"mesh":s=this._invokeOne(function(r){return r.loadMesh&&r.loadMesh(t)});break;case"accessor":s=this.loadAccessor(t);break;case"bufferView":s=this._invokeOne(function(r){return r.loadBufferView&&r.loadBufferView(t)});break;case"buffer":s=this.loadBuffer(t);break;case"material":s=this._invokeOne(function(r){return r.loadMaterial&&r.loadMaterial(t)});break;case"texture":s=this._invokeOne(function(r){return r.loadTexture&&r.loadTexture(t)});break;case"skin":s=this.loadSkin(t);break;case"animation":s=this._invokeOne(function(r){return r.loadAnimation&&r.loadAnimation(t)});break;case"camera":s=this.loadCamera(t);break;default:if(s=this._invokeOne(function(r){return r!=this&&r.getDependency&&r.getDependency(e,t)}),!s)throw new Error("Unknown type: "+e);break}this.cache.add(i,s)}return s}getDependencies(e){let t=this.cache.get(e);if(!t){let i=this,s=this.json[e+(e==="mesh"?"es":"s")]||[];t=Promise.all(s.map(function(r,o){return i.getDependency(e,o)})),this.cache.add(e,t)}return t}loadBuffer(e){let t=this.json.buffers[e],i=this.fileLoader;if(t.type&&t.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[at.KHR_BINARY_GLTF].body);let s=this.options;return new Promise(function(r,o){i.load(is.resolveURL(t.uri,s.path),r,void 0,function(){o(new Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))})})}loadBufferView(e){let t=this.json.bufferViews[e];return this.getDependency("buffer",t.buffer).then(function(i){let s=t.byteLength||0,r=t.byteOffset||0;return i.slice(r,r+s)})}loadAccessor(e){let t=this,i=this.json,s=this.json.accessors[e];if(s.bufferView===void 0&&s.sparse===void 0){let o=Hu[s.type],a=so[s.componentType],l=s.normalized===!0,c=new a(s.count*o);return Promise.resolve(new wt(c,o,l))}let r=[];return s.bufferView!==void 0?r.push(this.getDependency("bufferView",s.bufferView)):r.push(null),s.sparse!==void 0&&(r.push(this.getDependency("bufferView",s.sparse.indices.bufferView)),r.push(this.getDependency("bufferView",s.sparse.values.bufferView))),Promise.all(r).then(function(o){let a=o[0],l=Hu[s.type],c=so[s.componentType],h=c.BYTES_PER_ELEMENT,u=h*l,d=s.byteOffset||0,f=s.bufferView!==void 0?i.bufferViews[s.bufferView].byteStride:void 0,m=s.normalized===!0,_,p;if(f&&f!==u){let g=Math.floor(d/f),T="InterleavedBuffer:"+s.bufferView+":"+s.componentType+":"+g+":"+s.count,x=t.cache.get(T);x||(_=new c(a,g*f,s.count*f/h),x=new Dr(_,f/h),t.cache.add(T,x)),p=new Nr(x,l,d%f/h,m)}else a===null?_=new c(s.count*l):_=new c(a,d,s.count*l),p=new wt(_,l,m);if(s.sparse!==void 0){let g=Hu.SCALAR,T=so[s.sparse.indices.componentType],x=s.sparse.indices.byteOffset||0,v=s.sparse.values.byteOffset||0,M=new T(o[1],x,s.sparse.count*g),E=new c(o[2],v,s.sparse.count*l);a!==null&&(p=new wt(p.array.slice(),p.itemSize,p.normalized)),p.normalized=!1;for(let A=0,y=M.length;A<y;A++){let S=M[A];if(p.setX(S,E[A*l]),l>=2&&p.setY(S,E[A*l+1]),l>=3&&p.setZ(S,E[A*l+2]),l>=4&&p.setW(S,E[A*l+3]),l>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}p.normalized=m}return p})}loadTexture(e){let t=this.json,i=this.options,r=t.textures[e].source,o=t.images[r],a=this.textureLoader;if(o.uri){let l=i.manager.getHandler(o.uri);l!==null&&(a=l)}return this.loadTextureImage(e,r,a)}loadTextureImage(e,t,i){let s=this,r=this.json,o=r.textures[e],a=r.images[t],l=(a.uri||a.bufferView)+":"+o.sampler;if(this.textureCache[l])return this.textureCache[l];let c=this.loadImageSource(t,i).then(function(h){h.flipY=!1,h.name=o.name||a.name||"",h.name===""&&typeof a.uri=="string"&&a.uri.startsWith("data:image/")===!1&&(h.name=a.uri);let d=(r.samplers||{})[o.sampler]||{};return h.magFilter=Cm[d.magFilter]||Rt,h.minFilter=Cm[d.minFilter]||mn,h.wrapS=Pm[d.wrapS]||rn,h.wrapT=Pm[d.wrapT]||rn,h.generateMipmaps=!h.isCompressedTexture&&h.minFilter!==qt&&h.minFilter!==Rt,s.associations.set(h,{textures:e}),h}).catch(function(){return null});return this.textureCache[l]=c,c}loadImageSource(e,t){let i=this,s=this.json,r=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(u=>u.clone());let o=s.images[e],a=self.URL||self.webkitURL,l=o.uri||"",c=!1;if(o.bufferView!==void 0)l=i.getDependency("bufferView",o.bufferView).then(function(u){c=!0;let d=new Blob([u],{type:o.mimeType});return l=a.createObjectURL(d),l});else if(o.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");let h=Promise.resolve(l).then(function(u){return new Promise(function(d,f){let m=d;t.isImageBitmapLoader===!0&&(m=function(_){let p=new on(_);p.needsUpdate=!0,d(p)}),t.load(is.resolveURL(u,r.path),m,void 0,f)})}).then(function(u){return c===!0&&a.revokeObjectURL(l),Oi(u,o),u.userData.mimeType=o.mimeType||_x(o.uri),u}).catch(function(u){throw console.error("THREE.GLTFLoader: Couldn't load texture",l),u});return this.sourceCache[e]=h,h}assignTexture(e,t,i,s){let r=this;return this.getDependency("texture",i.index).then(function(o){if(!o)return null;if(i.texCoord!==void 0&&i.texCoord>0&&(o=o.clone(),o.channel=i.texCoord),r.extensions[at.KHR_TEXTURE_TRANSFORM]){let a=i.extensions!==void 0?i.extensions[at.KHR_TEXTURE_TRANSFORM]:void 0;if(a){let l=r.associations.get(o);o=r.extensions[at.KHR_TEXTURE_TRANSFORM].extendTexture(o,a),r.associations.set(o,l)}}return s!==void 0&&(o.colorSpace=s),e[t]=o,o})}assignFinalMaterial(e){let t=e.geometry,i=e.material,s=t.attributes.tangent===void 0,r=t.attributes.color!==void 0,o=t.attributes.normal===void 0;if(e.isPoints){let a="PointsMaterial:"+i.uuid,l=this.cache.get(a);l||(l=new ys,zn.prototype.copy.call(l,i),l.color.copy(i.color),l.map=i.map,l.sizeAttenuation=!1,this.cache.add(a,l)),i=l}else if(e.isLine){let a="LineBasicMaterial:"+i.uuid,l=this.cache.get(a);l||(l=new Or,zn.prototype.copy.call(l,i),l.color.copy(i.color),l.map=i.map,this.cache.add(a,l)),i=l}if(s||r||o){let a="ClonedMaterial:"+i.uuid+":";s&&(a+="derivative-tangents:"),r&&(a+="vertex-colors:"),o&&(a+="flat-shading:");let l=this.cache.get(a);l||(l=i.clone(),r&&(l.vertexColors=!0),o&&(l.flatShading=!0),s&&(l.normalScale&&(l.normalScale.y*=-1),l.clearcoatNormalScale&&(l.clearcoatNormalScale.y*=-1)),this.cache.add(a,l),this.associations.set(l,this.associations.get(i))),i=l}e.material=i}getMaterialType(){return $t}loadMaterial(e){let t=this,i=this.json,s=this.extensions,r=i.materials[e],o,a={},l=r.extensions||{},c=[];if(l[at.KHR_MATERIALS_UNLIT]){let u=s[at.KHR_MATERIALS_UNLIT];o=u.getMaterialType(),c.push(u.extendParams(a,r,t))}else{let u=r.pbrMetallicRoughness||{};if(a.color=new Ne(1,1,1),a.opacity=1,Array.isArray(u.baseColorFactor)){let d=u.baseColorFactor;a.color.setRGB(d[0],d[1],d[2],_n),a.opacity=d[3]}u.baseColorTexture!==void 0&&c.push(t.assignTexture(a,"map",u.baseColorTexture,nt)),a.metalness=u.metallicFactor!==void 0?u.metallicFactor:1,a.roughness=u.roughnessFactor!==void 0?u.roughnessFactor:1,u.metallicRoughnessTexture!==void 0&&(c.push(t.assignTexture(a,"metalnessMap",u.metallicRoughnessTexture)),c.push(t.assignTexture(a,"roughnessMap",u.metallicRoughnessTexture))),o=this._invokeOne(function(d){return d.getMaterialType&&d.getMaterialType(e)}),c.push(Promise.all(this._invokeAll(function(d){return d.extendMaterialParams&&d.extendMaterialParams(e,a)})))}r.doubleSided===!0&&(a.side=bn);let h=r.alphaMode||Wu.OPAQUE;if(h===Wu.BLEND?(a.transparent=!0,a.depthWrite=!1):(a.transparent=!1,h===Wu.MASK&&(a.alphaTest=r.alphaCutoff!==void 0?r.alphaCutoff:.5)),r.normalTexture!==void 0&&o!==wn&&(c.push(t.assignTexture(a,"normalMap",r.normalTexture)),a.normalScale=new ae(1,1),r.normalTexture.scale!==void 0)){let u=r.normalTexture.scale;a.normalScale.set(u,u)}if(r.occlusionTexture!==void 0&&o!==wn&&(c.push(t.assignTexture(a,"aoMap",r.occlusionTexture)),r.occlusionTexture.strength!==void 0&&(a.aoMapIntensity=r.occlusionTexture.strength)),r.emissiveFactor!==void 0&&o!==wn){let u=r.emissiveFactor;a.emissive=new Ne().setRGB(u[0],u[1],u[2],_n)}return r.emissiveTexture!==void 0&&o!==wn&&c.push(t.assignTexture(a,"emissiveMap",r.emissiveTexture,nt)),Promise.all(c).then(function(){let u=new o(a);return r.name&&(u.name=r.name),Oi(u,r),t.associations.set(u,{materials:e}),r.extensions&&ar(s,u,r),u})}createUniqueName(e){let t=At.sanitizeNodeName(e||"");return t in this.nodeNamesUsed?t+"_"+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){let t=this,i=this.extensions,s=this.primitiveCache;function r(a){return i[at.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(a,t).then(function(l){return Im(l,a,t)})}let o=[];for(let a=0,l=e.length;a<l;a++){let c=e[a],h=gx(c),u=s[h];if(u)o.push(u.promise);else{let d;c.extensions&&c.extensions[at.KHR_DRACO_MESH_COMPRESSION]?d=r(c):d=Im(new pt,c,t),c.mode===si.TRIANGLE_STRIP?d=d.then(f=>Pu(f,ta)):c.mode===si.TRIANGLE_FAN&&(d=d.then(f=>Pu(f,Yr))),s[h]={primitive:c,promise:d},o.push(d)}}return Promise.all(o)}loadMesh(e){let t=this,i=this.json,s=this.extensions,r=i.meshes[e],o=r.primitives,a=[];for(let l=0,c=o.length;l<c;l++){let h=o[l].material===void 0?fx(this.cache):this.getDependency("material",o[l].material);a.push(h)}return a.push(t.loadGeometries(o)),Promise.all(a).then(async function(l){let c=l.slice(0,l.length-1),h=l[l.length-1],u=[];for(let f=0,m=h.length;f<m;f++){let _=h[f],p=o[f],g,T=c[f];if(p.mode===si.TRIANGLES||p.mode===si.TRIANGLE_STRIP||p.mode===si.TRIANGLE_FAN||p.mode===void 0){let x=r.isSkinnedMesh===!0,v=_.hasAttribute("skinIndex")&&_.hasAttribute("skinWeight");x&&v===!1&&console.warn("THREE.GLTFLoader: Missing skinIndex or skinWeight attributes. Skinning disabled."),g=x&&v?new wo(_,T):new ge(_,T),g.isSkinnedMesh===!0&&g.normalizeSkinWeights()}else if(p.mode===si.LINES)g=new Ao(_,T);else if(p.mode===si.LINE_STRIP)g=new Xs(_,T);else if(p.mode===si.LINE_LOOP)g=new Ro(_,T);else if(p.mode===si.POINTS)g=new Zi(_,T);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+p.mode);Object.keys(g.geometry.morphAttributes).length>0&&mx(g,r),g.name=t.createUniqueName(r.name||"mesh_"+e),Oi(g,r),p.extensions&&ar(s,g,p),t.assignFinalMaterial(g),u.push(g)}for(let f=0,m=u.length;f<m;f++)t.associations.set(u[f],{meshes:e,primitives:f});if(u.length===1)return r.extensions&&ar(s,u[0],r),u[0];let d=new ct;r.extensions&&ar(s,d,r),t.associations.set(d,{meshes:e});for(let f=0,m=u.length;f<m;f++)d.add(u[f]);return d})}loadCamera(e){let t,i=this.json.cameras[e],s=i[i.type];if(!s){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return i.type==="perspective"?t=new tn(Zt.radToDeg(s.yfov),s.aspectRatio||1,s.znear||1,s.zfar||2e6):i.type==="orthographic"&&(t=new Ss(-s.xmag,s.xmag,s.ymag,-s.ymag,s.znear,s.zfar)),i.name&&(t.name=this.createUniqueName(i.name)),Oi(t,i),Promise.resolve(t)}loadSkin(e){let t=this.json.skins[e],i=[];for(let s=0,r=t.joints.length;s<r;s++)i.push(this._loadNodeShallow(t.joints[s]));return t.inverseBindMatrices!==void 0?i.push(this.getDependency("accessor",t.inverseBindMatrices)):i.push(null),Promise.all(i).then(function(s){let r=s.pop(),o=s,a=[],l=[];for(let c=0,h=o.length;c<h;c++){let u=o[c];if(u){a.push(u);let d=new We;r!==null&&d.fromArray(r.array,c*16),l.push(d)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[c])}return new Eo(a,l)})}loadAnimation(e){let t=this.json,i=this,s=t.animations[e],r=s.name?s.name:"animation_"+e,o=[],a=[],l=[],c=[],h=[];for(let u=0,d=s.channels.length;u<d;u++){let f=s.channels[u],m=s.samplers[f.sampler],_=f.target,p=_.node,g=s.parameters!==void 0?s.parameters[m.input]:m.input,T=s.parameters!==void 0?s.parameters[m.output]:m.output;_.node!==void 0&&(o.push(this.getDependency("node",p)),a.push(this.getDependency("accessor",g)),l.push(this.getDependency("accessor",T)),c.push(m),h.push(_))}return Promise.all([Promise.all(o),Promise.all(a),Promise.all(l),Promise.all(c),Promise.all(h)]).then(function(u){let d=u[0],f=u[1],m=u[2],_=u[3],p=u[4],g=[];for(let x=0,v=d.length;x<v;x++){let M=d[x],E=f[x],A=m[x],y=_[x],S=p[x];if(M===void 0)continue;M.updateMatrix&&M.updateMatrix();let I=i._createAnimationTracks(M,E,A,y,S);if(I)for(let D=0;D<I.length;D++)g.push(I[D])}let T=new Vo(r,void 0,g);return Oi(T,s),T})}createNodeMesh(e){let t=this.json,i=this,s=t.nodes[e];return s.mesh===void 0?null:i.getDependency("mesh",s.mesh).then(function(r){let o=i._getNodeRef(i.meshCache,s.mesh,r);return s.weights!==void 0&&o.traverse(function(a){if(a.isMesh)for(let l=0,c=s.weights.length;l<c;l++)a.morphTargetInfluences[l]=s.weights[l]}),o})}loadNode(e){let t=this.json,i=this,s=t.nodes[e],r=i._loadNodeShallow(e),o=[],a=s.children||[];for(let c=0,h=a.length;c<h;c++)o.push(i.getDependency("node",a[c]));let l=s.skin===void 0?Promise.resolve(null):i.getDependency("skin",s.skin);return Promise.all([r,Promise.all(o),l]).then(function(c){let h=c[0],u=c[1],d=c[2];d!==null&&h.traverse(function(f){f.isSkinnedMesh&&f.bind(d,yx)});for(let f=0,m=u.length;f<m;f++)h.add(u[f]);if(h.userData.pivot!==void 0&&u.length>0){let f=h.userData.pivot,m=u[0];h.pivot=new C().fromArray(f),h.position.x-=f[0],h.position.y-=f[1],h.position.z-=f[2],m.position.set(0,0,0),delete h.userData.pivot}return h})}_loadNodeShallow(e){let t=this.json,i=this.extensions,s=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];let r=t.nodes[e],o=r.name?s.createUniqueName(r.name):"",a=[],l=s._invokeOne(function(c){return c.createNodeMesh&&c.createNodeMesh(e)});return l&&a.push(l),r.camera!==void 0&&a.push(s.getDependency("camera",r.camera).then(function(c){return s._getNodeRef(s.cameraCache,r.camera,c)})),s._invokeAll(function(c){return c.createNodeAttachment&&c.createNodeAttachment(e)}).forEach(function(c){a.push(c)}),this.nodeCache[e]=Promise.all(a).then(function(c){let h;if(r.isBone===!0?h=new Ur:c.length>1?h=new ct:c.length===1?h=c[0]:h=new Ut,h!==c[0])for(let u=0,d=c.length;u<d;u++)h.add(c[u]);if(r.name&&(h.userData.name=r.name,h.name=o),Oi(h,r),r.extensions&&ar(i,h,r),r.matrix!==void 0){let u=new We;u.fromArray(r.matrix),h.applyMatrix4(u)}else r.translation!==void 0&&h.position.fromArray(r.translation),r.rotation!==void 0&&h.quaternion.fromArray(r.rotation),r.scale!==void 0&&h.scale.fromArray(r.scale);if(!s.associations.has(h))s.associations.set(h,{});else if(r.mesh!==void 0&&s.meshCache.refs[r.mesh]>1){let u=s.associations.get(h);s.associations.set(h,{...u})}return s.associations.get(h).nodes=e,h}),this.nodeCache[e]}loadScene(e){let t=this.extensions,i=this.json.scenes[e],s=this,r=new ct;i.name&&(r.name=s.createUniqueName(i.name)),Oi(r,i),i.extensions&&ar(t,r,i);let o=i.nodes||[],a=[];for(let l=0,c=o.length;l<c;l++)a.push(s.getDependency("node",o[l]));return Promise.all(a).then(function(l){for(let h=0,u=l.length;h<u;h++){let d=l[h];d.parent!==null?r.add(Em(d)):r.add(d)}let c=h=>{let u=new Map;for(let[d,f]of s.associations)(d instanceof zn||d instanceof on)&&u.set(d,f);return h.traverse(d=>{let f=s.associations.get(d);f!=null&&u.set(d,f)}),u};return s.associations=c(r),r})}_createAnimationTracks(e,t,i,s,r){let o=[],a=e.name?e.name:e.uuid,l=[];function c(f){f.morphTargetInfluences&&l.push(f.name?f.name:f.uuid)}Ds[r.path]===Ds.weights?(c(e),e.isGroup&&e.children.forEach(c)):l.push(a);let h;switch(Ds[r.path]){case Ds.weights:h=es;break;case Ds.rotation:h=ts;break;case Ds.translation:case Ds.scale:h=xs;break;default:switch(i.itemSize){case 1:h=es;break;case 2:case 3:default:h=xs;break}break}let u=s.interpolation!==void 0?dx[s.interpolation]:Gs,d=this._getArrayFromAccessor(i);for(let f=0,m=l.length;f<m;f++){let _=new h(l[f]+"."+Ds[r.path],t.array,d,u);s.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(_),o.push(_)}return o}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){let i=md(t.constructor),s=new Float32Array(t.length);for(let r=0,o=t.length;r<o;r++)s[r]=t[r]*i;t=s}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(i){let s=this instanceof ts?fd:qc;return new s(this.times,this.values,this.getValueSize()/3,i)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}};function vx(n,e,t){let i=e.attributes,s=new yn;if(i.POSITION!==void 0){let a=t.json.accessors[i.POSITION],l=a.min,c=a.max;if(l!==void 0&&c!==void 0){if(s.set(new C(l[0],l[1],l[2]),new C(c[0],c[1],c[2])),a.normalized){let h=md(so[a.componentType]);s.min.multiplyScalar(h),s.max.multiplyScalar(h)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;let r=e.targets;if(r!==void 0){let a=new C,l=new C;for(let c=0,h=r.length;c<h;c++){let u=r[c];if(u.POSITION!==void 0){let d=t.json.accessors[u.POSITION],f=d.min,m=d.max;if(f!==void 0&&m!==void 0){if(l.setX(Math.max(Math.abs(f[0]),Math.abs(m[0]))),l.setY(Math.max(Math.abs(f[1]),Math.abs(m[1]))),l.setZ(Math.max(Math.abs(f[2]),Math.abs(m[2]))),d.normalized){let _=md(so[d.componentType]);l.multiplyScalar(_)}a.max(l)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}s.expandByVector(a)}n.boundingBox=s;let o=new kn;s.getCenter(o.center),o.radius=s.min.distanceTo(s.max)/2,n.boundingSphere=o}function Im(n,e,t){let i=e.attributes,s=[];function r(o,a){return t.getDependency("accessor",o).then(function(l){n.setAttribute(a,l)})}for(let o in i){let a=pd[o]||o.toLowerCase();a in n.attributes||s.push(r(i[o],a))}if(e.indices!==void 0&&!n.index){let o=t.getDependency("accessor",e.indices).then(function(a){n.setIndex(a)});s.push(o)}return rt.workingColorSpace!==_n&&"COLOR_0"in i&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${rt.workingColorSpace}" not supported.`),Oi(n,e),vx(n,e,t),Promise.all(s).then(function(){return e.targets!==void 0?px(n,e.targets,t):n})}var bx=n=>`
#define OCT ${n?5:2}
uniform float time; varying vec3 vW;
float h1(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
vec2 h2(vec2 p){ return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453); }
float n2(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f); return mix(mix(h1(i), h1(i + vec2(1, 0)), f.x), mix(h1(i + vec2(0, 1)), h1(i + vec2(1, 1)), f.x), f.y); }
float fbm(vec2 p){ float s = 0., a = .5; for (int i = 0; i < OCT; i++) { s += a * n2(p); p = mat2(1.6, 1.2, -1.2, 1.6) * p; a *= .5; } return s; }
// F1 and F2 distances of a jittered grid (crust plates)
vec2 vor(vec2 p, float t){ vec2 i = floor(p), f = fract(p); float d1 = 8., d2 = 8.;
  for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) { vec2 g = vec2(x, y), o = h2(i + g); o = .5 + .42 * sin(t * .15 + 6.2831 * o); float d = length(g + o - f); if (d < d1) { d2 = d1; d1 = d; } else if (d < d2) d2 = d; }
  return vec2(d1, d2); }
vec3 heat(float k){ // blackbody-ish ramp: dark red -> orange -> yellow -> white-hot
  k = clamp(k, 0., 1.); return mix(mix(vec3(.25, .02, .0), vec3(1., .22, .02), smoothstep(.0, .45, k)), mix(vec3(1., .55, .08), vec3(1.6, 1.25, .7), smoothstep(.8, 1., k)), smoothstep(.4, .85, k)); }
void main(){
  vec2 p = vW.xz * .55; float t = time;
  // slow convective flow: domain-warped coordinates
  vec2 q = vec2(fbm(p + vec2(0., t * .03)), fbm(p + vec2(5.2, 1.3) - t * .025));
  vec2 w = p + 1.6 * q + vec2(t * .02, -t * .012);
  float molten = fbm(w * .7 + 3.1);                 // where the crust has broken open
  vec2 v = vor(w * 1.15, t);
  float seam = 1. - smoothstep(.0, .09 + .06 * molten, v.y - v.x);
  float crustMask = smoothstep(.56, .44, molten);   // 1 = crusted, 0 = open pool
  float crustTex = ${n?"fbm(w * 6.)":"n2(w * 6.)"};
  vec3 crust = vec3(.035, .025, .022) * (.6 + .8 * crustTex) + heat(.25) * .25 * smoothstep(.35, 0., v.x) * 0.;
  // the crust glows dimly where it is thin (near seams) and from below
  crust += heat(.3) * .35 * pow(1. - smoothstep(.0, .35, v.y - v.x), 2.);
  float poolHeat = .32 + .5 * pow(${n?"fbm":"n2"}(w * 2.3 - t * .08), 1.6);
  vec3 col = mix(heat(poolHeat), crust, crustMask);
  col += heat(.55 + .3 * molten) * seam * crustMask * .9;
  // bubbles: one per cell, swelling then bursting into a ring; mostly in open pools
  vec2 bc = vW.xz * 1.1; vec2 bi = floor(bc), bf = fract(bc);
  float bub = 0., ring = 0.;
  for (int y = -1; y <= ${n?1:0}; y++) for (int x = -1; x <= ${n?1:0}; x++) {
    vec2 g = vec2(x, y), r = h2(bi + g + 17.); float period = 2.5 + 4. * r.x, life = fract(t / period + r.y);
    vec2 c = g + .2 + .6 * r - bf; float d = length(c), R = .08 + .22 * h1(bi + g + 3.);
    float alive = step(.35, h1(bi + g + 9.)) * (1. - crustMask * .7);
    float grow = smoothstep(0., .85, life), rad = R * grow;
    bub += alive * step(life, .9) * pow(max(0., 1. - d / max(rad, 1e-3)), 1.5) * grow;
    float burst = smoothstep(.9, 1., life); ring += alive * step(.9, life) * smoothstep(.04, 0., abs(d - R * (1. + burst * 1.4))) * (1. - burst);
  }
  // a bubble skin is cooler at its top and catches a hot rim
  col = mix(col, heat(.5) * .6, clamp(bub * .55, 0., .8)) + heat(.85) * clamp(bub, 0., 1.) * (1. - bub) * .9 * (1. - crustMask * .6);
  col += heat(.8) * ring * .6 * (1. - crustMask);
  float far = smoothstep(9., 22., length(vW.xz)); col *= 1. - far * .85; // falls off into the dark of the shaft
  gl_FragColor = vec4(col * vec3(1., .62, .38) * .7, 1.);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;function Dm(n,e,t){let i=new pn({uniforms:{time:{value:0}},fog:!1,vertexShader:"varying vec3 vW;void main(){vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}",fragmentShader:bx(t)}),s=new ge(new Ai(26,40),i);s.rotation.x=-Math.PI/2,s.position.y=e,n.add(s);let r=t?260:55,o=new Float32Array(r*4);for(let d=0;d<r*4;d++)o[d]=Math.random();let a=new pt;a.setAttribute("position",new wt(new Float32Array(r*3),3)),a.setAttribute("seed",new wt(o,4));let l=new pn({uniforms:{time:{value:0},base:{value:e},px:{value:Math.min(devicePixelRatio,2)}},transparent:!0,depthWrite:!1,blending:Js,vertexShader:`uniform float time, base, px; attribute vec4 seed; varying float vA;
      void main(){ float life = fract(time * (.08 + .1 * seed.z) + seed.w); vec3 p = vec3((seed.x - .5) * 9., base + life * 7., (seed.y - .5) * 9.);
        p.x += sin(time * (.6 + seed.z) + seed.w * 20.) * .35 * life; p.z += cos(time * (.5 + seed.x) + seed.y * 20.) * .35 * life;
        vA = (1. - life) * smoothstep(0., .05, life); vec4 mv = viewMatrix * vec4(p, 1.); gl_PointSize = (2. + 4. * seed.z) * px * (1.2 / -mv.z) * 6.; gl_Position = projectionMatrix * mv; }`,fragmentShader:"varying float vA; void main(){ float d = length(gl_PointCoord - .5); float a = smoothstep(.5, .0, d) * vA; gl_FragColor = vec4(vec3(1., .45, .12) * a * 1.4, a); }"}),c=new Zi(a,l);c.frustumCulled=!1,n.add(c);let h=[];for(let[d,f]of[[0,0]]){let m=new Gn("#ff5a12",14,14,1.2);m.position.set(d,e+.9,f),n.add(m),h.push(m)}let u=0;return{lake:s,setY(d){s.position.y=d,l.uniforms.base.value=d,h.forEach(f=>f.position.y=d+.9)},update(d){u+=d,i.uniforms.time.value=u,l.uniforms.time.value=u,h.forEach((f,m)=>{f.intensity=14+2*Math.sin(u*1.3+m*2.1)*1.2+Math.sin(u*5.7+m)*.5+Math.max(0,Math.sin(u*2.9+m*4))**12*3})}}}var _d=3.6;function Mx(n,e,t){let i=document.createElement("canvas");i.width=i.height=t;let s=i.getContext("2d",{willReadFrequently:!0});s.drawImage(n,0,0,t,t);let r=s.getImageData(0,0,t,t),o=null;e&&(s.drawImage(e,0,0,t,t),o=s.getImageData(0,0,t,t));let a=(f,m)=>{let _=document.createElement("canvas");_.width=_.height=f;let p=_.getContext("2d"),g=p.createImageData(f,f),T=Vt(m);for(let M=0;M<g.data.length;M+=4)g.data[M]=g.data[M+1]=g.data[M+2]=T()*255,g.data[M+3]=255;p.putImageData(g,0,0);let x=document.createElement("canvas");x.width=x.height=t;let v=x.getContext("2d",{willReadFrequently:!0});return v.imageSmoothingQuality="high",v.drawImage(_,0,0,t,t),v.getImageData(0,0,t,t).data},l=a(24,7),c=a(160,19),h=s.createImageData(t,t),u=s.createImageData(t,t);for(let f=0;f<r.data.length;f+=4){let m=r.data[f]/255,_=r.data[f+1]/255,p=r.data[f+2]/255,g=Math.max(m,_,p),T=Math.min(m,_,p),x=g>0?(g-T)/g:0,v=m*.3+_*.59+p*.11,M=Math.min(1,Math.max(0,(m-_*1.08)*4.5)*Math.min(1,x*2.2)),E=Math.max(0,.16-v)/.16,A=l[f]/255,y=c[f]/255,S=.58+A*.14+(y-.5)*.1;S=S+(.9-S)*M+E*.08,o&&(S=Math.max(S,o.data[f+1]/255));let I=.78-M*.62-E*.25+(A-.5)*.1,D=Math.max(0,A-.78)*4*(1-M);S-=D*.18,h.data[f]=255,h.data[f+1]=Math.min(1,Math.max(.42,S))*255,h.data[f+2]=Math.min(1,Math.max(.05,I))*255,h.data[f+3]=255;let F=Math.max(0,.2-v)/.2,R=74+y*30,P=62+y*22,N=54+y*16,O=1-D*.2-(1-y)*.05;u.data[f]=(r.data[f]+(R-r.data[f])*F*.75)*O,u.data[f+1]=(r.data[f+1]+(P-r.data[f+1])*F*.75)*O,u.data[f+2]=(r.data[f+2]+(N-r.data[f+2])*F*.75)*O,u.data[f+3]=255}let d=(f,m)=>{let _=document.createElement("canvas");_.width=_.height=t,_.getContext("2d").putImageData(f,0,0);let p=new an(_);return p.flipY=!1,p.colorSpace=m?nt:Ft,p.anisotropy=8,p};return{orm:d(h,!1),map:d(u,!0)}}async function Nm(n,e,t,i="models/cage.glb"){let[s,r]=await Promise.all([new Wc().loadAsync(i),new io().loadAsync(vi+"boiler_room_1k.hdr")]),o=new Ps(n);r.mapping=As,e.environment=o.fromEquirectangular(r).texture,r.dispose(),o.dispose(),e.environmentIntensity=.5,e.background=new Ne("#030201"),e.fog=new Ws("#0b0503",.045);let a=s.scene,l;a.traverse(xe=>{xe.isMesh&&(l=xe)});let c=new yn().setFromObject(a),h=c.getSize(new C),u=_d/h.y;a.scale.setScalar(u),a.updateMatrixWorld(!0),c=new yn().setFromObject(a);let d=c.getCenter(new C);a.position.set(-d.x,-c.min.y,-d.z),a.updateMatrixWorld(!0),c.setFromObject(a);let f=l.material,m=f.map.image,_=f.roughnessMap?.image||null,p=t?2048:1024,g=await Ec(["cage-map","cage-orm"],{srgb:[!0,!1],flipY:!1,aniso:8}),T=g?{map:g[0],orm:g[1]}:Mx(m,_,p);g||(rr("cage-map",T.map),rr("cage-orm",T.orm));let x=new Je({map:T.map,normalMap:f.normalMap,normalScale:new ae(1.6,1.6),roughnessMap:T.orm,metalnessMap:T.orm,roughness:1,metalness:1,specularIntensity:.5,specularColor:new Ne(1,1,1),envMapIntensity:.6,side:bn});await Sx(x),f.map?.dispose(),f.roughnessMap?.dispose(),f.dispose(),l.material=x,l.castShadow=l.receiveShadow=!0,e.add(a);let v=new Pi,M=(xe,Ze)=>(v.set(xe,Ze),v.far=20,v.intersectObject(l,!1)[0]||null),E=new C(0,_d*.5,0),A=M(E,new C(0,-1,0))?.point.y??0,y=M(E,new C(0,1,0))?.point.y??_d,S=xe=>{let Ze=[.35,.55,.8].map(te=>M(new C(0,A+te*(y-A),0),xe)?.distance??1.2);return Math.min(...Ze)},I=S(new C(1,0,0)),D=S(new C(-1,0,0)),F=S(new C(0,0,1)),R=S(new C(0,0,-1)),P=new yn(new C(-D,A,-R),new C(I,y,F)),N=new C(0,Math.min(A+1.55,y-.25),(F-R)*.5+F*.1),O=new fi("#ffb870",34,9,1.2,.75,1.3);O.position.set(0,y-.12,0),O.target.position.set(0,A,0),O.castShadow=!0,O.shadow.mapSize.set(t?2048:1024,t?2048:1024),O.shadow.bias=-2e-4,O.shadow.normalBias=.02,O.shadow.camera.near=.1,O.shadow.camera.far=8,e.add(O,O.target);let X={intensity:0},J=new ge(new nn(.03,16,10),new wn({color:"#ffcf96"}));J.position.copy(O.position).y-=.02,e.add(J);let z=Dm(e,A-3.2,t);for(let[xe,Ze,te,le,ue]of[[0,.5,0,"#ffc79a",1.8]]){let ce=new Gn(le,ue,4.5,1.5);ce.position.set(xe*(I+D)/2,A+Ze*(y-A),te*(F+R)/2),e.add(ce)}e.add(new Zs("#8a7058","#5a2008",.8));let B=xx(),W=A+1.02,ne=Math.min(I,D)*.35;B.position.set(ne,W,-R+.005),e.add(B);let oe=new C(ne,W+.007,-R+.005+.165),Ue=[{n:new C(0,1,0),d:A,restitution:.16,friction:.6,material:"metal"},{n:new C(1,0,0),d:-D+.03,restitution:.2,friction:.4,material:"metal"},{n:new C(-1,0,0),d:-I+.03,restitution:.2,friction:.4,material:"metal"},{n:new C(0,0,1),d:-R+.03,restitution:.2,friction:.4,material:"metal"},{n:new C(0,0,-1),d:-F+.03,restitution:.2,friction:.4,material:"metal"}],$e=0,Xe=A-3.2,Z=Xe,Q=0,de=.55,De=new Gn("#ff2a10",0,6,1.6);De.position.set(0,y-.25,0),e.add(De);let pe={root:a,mesh:l,planes:Ue,floorY:A,ceilingY:y,inner:P,eye:N,lamp:O,alarm:De,power:1,alarmLevel:0,shelf:{group:B,top:oe,facing:0},get height(){return(A-Xe-de)/(3.2-de)},onFallStart:()=>{},onFallImpact:xe=>{},drop(xe=.8){Z>Xe+.01||(Z=Math.min(A-de,Xe+xe),Q=.4,pe.onFallStart())},update(xe){Xe<Z&&(Q+=9.8*1.4*xe,Xe=Math.min(Z,Xe+Q*xe),z.setY(Xe),Xe>=Z&&(pe.onFallImpact(Math.min(1.5,Q/3)),Q=0)),$e+=xe,z.update(xe);let Ze=Math.random()<.003?.3:1;O.intensity=34*(.97+Math.sin($e*47)*.015)*Ze*pe.power,X.intensity=2.2*Ze*pe.power,De.intensity=pe.alarmLevel*9*(.55+.45*Math.max(0,Math.sin($e*9)))}};return pe}function xx(){let n=new ct,e=new Je({color:"#2a2420",roughness:.78,metalness:.7,envMapIntensity:.5}),t=new Je({color:"#6e5530",roughness:.55,metalness:.85,envMapIntensity:.6}),i=new ge(new Dt(.42,.012,.33),e);i.position.set(0,0,.165),n.add(i);let s=new ge(new Dt(.42,.03,.008),e);s.position.set(0,.015,.326),n.add(s);let r=new ge(new Dt(.44,.07,.01),e);r.position.set(0,-.02,.005),n.add(r);let o=new Ri;o.moveTo(0,0),o.lineTo(.26,0),o.quadraticCurveTo(.06,-.03,0,-.22),o.lineTo(0,0);let a=new Ji;a.absarc(.045,-.045,.025,0,Math.PI*2,!0),o.holes.push(a);let l=new ji(o,{depth:.008,bevelEnabled:!0,bevelSize:.002,bevelThickness:.002,bevelSegments:2});for(let h of[-.16,.16]){let u=new ge(l,t);u.rotation.y=-Math.PI/2,u.position.set(h-.004,-.006,.01),n.add(u)}let c=new nn(.005,10,6);for(let h of[-.19,-.07,.07,.19]){let u=new ge(c,t);u.position.set(h,-.02,.011),u.scale.z=.5,n.add(u)}return n.traverse(h=>{h.castShadow=h.receiveShadow=!0}),n}async function Sx(n){let e=new Zn,t=(r,o)=>e.loadAsync(vi+r).then(a=>(a.wrapS=a.wrapT=rn,a.colorSpace=o?nt:Ft,a.anisotropy=4,a)),[i,s]=await Promise.all([t("rusty_metal_05_diff_1k.jpg",!0),t("rusty_metal_05_rough_1k.jpg",!1)]);n.onBeforeCompile=r=>{r.uniforms.detailDiff={value:i},r.uniforms.detailRough={value:s},r.vertexShader=r.vertexShader.replace("#include <common>",`#include <common>
varying vec3 vWPos; varying vec3 vWNrm;`).replace("#include <worldpos_vertex>",`#include <worldpos_vertex>
vWPos = (modelMatrix * vec4(transformed, 1.0)).xyz; vWNrm = normalize(mat3(modelMatrix) * objectNormal);`),r.fragmentShader=r.fragmentShader.replace("#include <common>",`#include <common>
uniform sampler2D detailDiff; uniform sampler2D detailRough; varying vec3 vWPos; varying vec3 vWNrm;
vec3 triW(){ vec3 w = pow(abs(normalize(vWNrm)), vec3(4.)); return w / (w.x + w.y + w.z); }
vec4 tri(sampler2D t, float k){ vec3 w = triW(); vec3 p = vWPos * k; return texture2D(t, p.zy) * w.x + texture2D(t, p.xz) * w.y + texture2D(t, p.xy) * w.z; }`).replace("#include <map_fragment>",`#include <map_fragment>
{ vec3 d = tri(detailDiff, 1.7).rgb; float g = dot(d, vec3(.3,.59,.11)); diffuseColor.rgb *= mix(vec3(1.), d / max(g, .05) * (.55 + g), .38); }`).replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
{ float dr = tri(detailRough, 1.7).g; roughnessFactor = clamp(max(roughnessFactor, .45) + (dr - .5) * .35, .4, 1.); }`)},n.customProgramCacheKey=()=>"cage-triplanar"}var ut=n=>document.getElementById(n),Ln=new URLSearchParams(location.search),ki=matchMedia("(pointer: coarse)").matches||Math.min(screen.width,screen.height)<600,pa=Ln.get("quality")==="low"||ki&&Ln.get("quality")!=="high"?"low":"high",vt=new mc({antialias:!ki,powerPreference:"high-performance",preserveDrawingBuffer:Ln.has("capture")});vt.outputColorSpace=nt;vt.toneMapping=Yo;vt.toneMappingExposure=1;vt.shadowMap.enabled=!0;vt.shadowMap.type=Ks;vt.shadowMap.autoUpdate=!1;var Tx=0,Om=/iPhone|iPad|iPod/.test(navigator.userAgent)||navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1,Um=ki&&Om?1.5:1,ma=Math.min(devicePixelRatio,ki?Om?2:1.6:pa==="high"?1.5:1.25),Yc=ki?3:1;vt.setPixelRatio(ma);ut("viewport").append(vt.domElement);var Bi=new xo,dt=new tn(50,1,.03,40);dt.position.set(0,1.56,.5);dt.lookAt(0,.1,-.25);function yd(){let n=innerWidth,e=innerHeight;vt.setSize(n,e,!1),vt.domElement.style.width=n+"px",vt.domElement.style.height=e+"px",dt.aspect=n/e,dt.fov=dt.aspect<.9?58:46,dt.updateProjectionMatrix()}addEventListener("resize",yd);yd();var kt=new Uc,Fm=1;async function wx(){ut("load-text").textContent="\u0421\u043F\u0443\u0441\u043A\u2026";let n=Ln.get("cage")==="procedural";ut("load-text").textContent="Binding the manual\u2026";let e=Ln.get("rules")?await rm(Ln.get("rules")).catch(G=>(console.warn(G),Bu)):Bu,t=+(Ln.get("seed")||Date.now()%1e5),i=Zp(t),s=Ln.get("rules")?e:am();performance.mark("cage0"),performance.mark("book0");let r=n?bm(vt,Bi,pa==="high"):Nm(vt,Bi,pa==="high"),[o,a]=await Promise.all([r.then(G=>(performance.measure("cage","cage0"),G)),Lc.create(vt,s,pa).then(G=>(performance.measure("book","book0"),G))]),l=o.floorY??0,c=o.eye??new C(0,1.56,.5);dt.position.copy(c);let h=0,u=-.5,d=0,f=-.5,m=new Pi;a.sounds={coverOpen:()=>kt.play("coverOpen"),coverClose:()=>kt.play("coverClose"),pageTurn:G=>kt.play("pageTurn",G),creak:G=>kt.play("creak",G)},Bi.add(a.root);let _=Mm();Bi.add(_);let p=new Nc(a,dt,vt.domElement,kt,o.planes);if(o.shelf){p.place(o.shelf.top.clone().add(new C(0,Mn/2,0)),new ft().setFromEuler(new Yt(0,.04,0)));let G=o.shelf.top.clone().sub(c);h=d=Math.atan2(-G.x,-G.z),u=f=Math.atan2(G.y,Math.hypot(G.x,G.z))}else p.place(new C(.06,Mn/2,-.22),new ft().setFromEuler(new Yt(0,.5,0)));let g={rest:ki?"\u0412\u0435\u0434\u0438\u0442\u0435 \u043F\u0430\u043B\u044C\u0446\u0435\u043C, \u0447\u0442\u043E\u0431\u044B \u043E\u0441\u043C\u043E\u0442\u0440\u0435\u0442\u044C\u0441\u044F \xB7 \u043D\u0430\u0436\u043C\u0438\u0442\u0435 \u043D\u0430 \u043A\u043D\u0438\u0433\u0443 \u0438\u043B\u0438 \u0449\u0438\u0442\u043E\u043A":"\u0422\u044F\u043D\u0438\u0442\u0435 \u043C\u044B\u0448\u044C\u044E, \u0447\u0442\u043E\u0431\u044B \u043E\u0441\u043C\u043E\u0442\u0440\u0435\u0442\u044C\u0441\u044F \xB7 \u043A\u043B\u0438\u043A\u043D\u0438\u0442\u0435 \u043F\u043E \u043A\u043D\u0438\u0433\u0435 \u0438\u043B\u0438 \u0449\u0438\u0442\u043A\u0443",lifting:"",held:ki?"\u041D\u0430\u0436\u043C\u0438\u0442\u0435 \u043D\u0430 \u043E\u0431\u043B\u043E\u0436\u043A\u0443, \u0447\u0442\u043E\u0431\u044B \u043E\u0442\u043A\u0440\u044B\u0442\u044C":"\u041A\u043B\u0438\u043A\u043D\u0438\u0442\u0435 \u043F\u043E \u043E\u0431\u043B\u043E\u0436\u043A\u0435, \u0447\u0442\u043E\u0431\u044B \u043E\u0442\u043A\u0440\u044B\u0442\u044C",reading:ki?"\u041F\u0440\u0430\u0432\u0430\u044F \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0430 \u2014 \u0432\u043F\u0435\u0440\u0451\u0434, \u043B\u0435\u0432\u0430\u044F \u2014 \u043D\u0430\u0437\u0430\u0434 \xB7 \u0441\u0432\u0430\u0439\u043F \xB7 \u0449\u0438\u043F\u043E\u043A \u0434\u043B\u044F \u0437\u0443\u043C\u0430":"\u041F\u0440\u0430\u0432\u0430\u044F \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0430 \u2014 \u0432\u043F\u0435\u0440\u0451\u0434, \u043B\u0435\u0432\u0430\u044F \u2014 \u043D\u0430\u0437\u0430\u0434 \xB7 \u043A\u043E\u043B\u0435\u0441\u043E \u0434\u043B\u044F \u0437\u0443\u043C\u0430",releasing:"",falling:""},T=G=>{ut("hint").textContent=p.lowered?ki?"\u041A\u043D\u0438\u0433\u0430 \u043E\u043F\u0443\u0449\u0435\u043D\u0430 \xB7 \u043D\u0430\u0436\u043C\u0438\u0442\u0435 \u043D\u0430 \u043D\u0435\u0451, \u0447\u0442\u043E\u0431\u044B \u043F\u043E\u0434\u043D\u044F\u0442\u044C":"\u041A\u043D\u0438\u0433\u0430 \u043E\u043F\u0443\u0449\u0435\u043D\u0430 \xB7 \u043A\u043B\u0438\u043A\u043D\u0438\u0442\u0435 \u043F\u043E \u043D\u0435\u0439, \u0447\u0442\u043E\u0431\u044B \u043F\u043E\u0434\u043D\u044F\u0442\u044C":g[G],ut("btn-lower").hidden=!["held","reading"].includes(G),ut("btn-lower").textContent=p.lowered?"\u041F\u043E\u0434\u043D\u044F\u0442\u044C":"\u041E\u043F\u0443\u0441\u0442\u0438\u0442\u044C",ut("btn-open").hidden=G!=="held",ut("btn-close").hidden=G!=="reading",ut("btn-drop").hidden=!["held","reading"].includes(G),document.body.dataset.state=G};p.onstate=T,T("rest"),p.onlower=()=>T(p.state),ut("btn-lower").onclick=()=>p.setLowered(!p.lowered);let x=new Hc(pa==="high"),v=o.inner;v?x.group.position.set(v.min.x*.45,l+1.3,v.min.z+.008):x.group.position.set(-.45,1.3,-.79),Bi.add(x.group),x.sounds={door:G=>kt.play(G?"doorOpen":"doorClose"),snip:()=>kt.play("snip"),spark:()=>kt.play("spark"),good:()=>kt.play("good"),bad:()=>kt.play("bad")};let M=12,E=60,A=1,y=0,S=t,I=0,D=()=>{ut("task").textContent=`\u0417\u0410\u0414\u0410\u041D\u0418\u0415 ${A} / ${M}`},F=0,R=(G,re)=>{let Re=ut("verdict");Re.querySelector("b").textContent=G?"\u0426\u0435\u043F\u044C \u0441\u0442\u0430\u0431\u0438\u043B\u0438\u0437\u0438\u0440\u043E\u0432\u0430\u043D\u0430":"\u041A\u0440\u0438\u0442\u0438\u0447\u0435\u0441\u043A\u0430\u044F \u043E\u0448\u0438\u0431\u043A\u0430",Re.querySelector("span").textContent=re,Re.dataset.tone=G?"good":"bad",Re.classList.remove("show"),Re.offsetWidth,Re.classList.add("show"),clearTimeout(F),F=setTimeout(()=>Re.classList.remove("show"),2300),G||(document.body.classList.remove("jolt"),document.body.offsetWidth,document.body.classList.add("jolt"))},P=G=>{G&&(A=Math.min(M,A+1)),S++;let re=Kp(i,S,Ue||4+Math.floor(Math.random()*3),oe);x.setTask(re),x.configure(re.fault,re.mode),y=0,D()},N=(G,re)=>{x.locked=!0,x.setLamp(G?"good":"bad"),kt.play(G?"good":"bad"),R(G,G?"\u0420\u0415\u041C\u041E\u041D\u0422 \u0423\u0421\u041F\u0415\u0428\u0415\u041D":re),D(),y=0,clearTimeout(I),I=setTimeout(()=>{x.open&&x.toggleDoor(),setTimeout(()=>P(G),500)},2400)};x.onCut=G=>{let re=G===x.task.answer;N(re,"\u041D\u0415\u0412\u0415\u0420\u041D\u042B\u0419 \u041F\u0420\u041E\u0412\u041E\u0414"),re||setTimeout(()=>o.drop?.(.8),350)};let O=0,X=!1,J=-1,z=-1,B=0,W=0,ne=dt.fov;o.onFallStart=()=>{kt.play("screech"),O=Math.max(O,.5),X=!0,J=0,z=-1,Q&&De(!1),Z=[d,-.42];let G=ut("fall");G.classList.remove("show"),G.offsetWidth,G.classList.add("show"),document.body.classList.add("falling")},o.onFallImpact=G=>{kt.play("slam",G),O=.9*G+.6,X=!1,z=0,W=-1.6*G,setTimeout(()=>{ut("fall").classList.remove("show"),document.body.classList.remove("falling")},2400)};let oe={};["overload","short","power"].includes(Ln.get("fault")||"")&&(oe.fault=Ln.get("fault")),["normal","emergency"].includes(Ln.get("mode")||"")&&(oe.mode=Ln.get("mode"));let Ue=Ln.get("wires")?Math.max(4,Math.min(6,+Ln.get("wires"))):0;x.onTest=G=>{if(kt.play("button"),setTimeout(()=>kt.hum(G,2),60),G==="short")for(let re=0;re<6;re++)setTimeout(()=>kt.play("spark"),150+re*280+Math.random()*120)},P(!1);let $e=new Map,Xe=new Pi;vt.domElement.addEventListener("pointerdown",G=>$e.set(G.pointerId,{x:G.clientX,y:G.clientY,t:performance.now()})),vt.domElement.addEventListener("pointerup",G=>{let re=$e.get(G.pointerId);if($e.delete(G.pointerId),!re||Math.hypot(G.clientX-re.x,G.clientY-re.y)>12||performance.now()-re.t>450)return;Xe.setFromCamera(new ae(G.clientX/innerWidth*2-1,-G.clientY/innerHeight*2+1),dt);let Re=Xe.intersectObject(a.root,!0)[0],U=Xe.intersectObject(x.group,!0)[0];if(Re&&(!U||Re.distance<U.distance)||(p.state==="reading"||p.state==="held")&&!p.lowered&&!U)return;let Ce=x.tap(Xe);if(window.__lastTap=Ce,!(Ce&&(Ce!=="door"||x.open)&&!Q&&(p.state==="rest"||p.state==="falling"||p.lowered)&&(De(!0),Ce!=="test"))&&Ce==="door"&&x.open&&(!y&&!x.locked&&(y=performance.now()+E*1e3),p.state==="rest"||p.state==="falling")){let Ke=x.center().sub(c);Z=[Math.atan2(-Ke.x,-Ke.z),Math.atan2(Ke.y,Math.hypot(Ke.x,Ke.z))]}});let Z=null,Q=!1,de=0,De=G=>{Q=G,ut("btn-back").hidden=!G,ut("hint").style.opacity=G?"0":"",ut("task").style.opacity=G&&innerWidth>700?"0":"",G&&(Z=null,x.open||x.toggleDoor())};ut("btn-back").onclick=()=>De(!1),addEventListener("keydown",G=>{G.key==="Escape"&&Q&&De(!1)}),ut("btn-open").onclick=()=>p.open(),ut("btn-close").onclick=()=>p.close(),ut("btn-drop").onclick=()=>p.drop(),ut("btn-sound").onclick=()=>{kt.unlock(),kt.enabled=!kt.enabled,ut("btn-sound").textContent=kt.enabled?"\u0417\u0432\u0443\u043A: \u0432\u043A\u043B.":"\u0417\u0432\u0443\u043A: \u0432\u044B\u043A\u043B."},a.onspread=G=>{ut("page-label").textContent=`${2*G+1}\u2013${2*G+2} / ${a.pages.length}`},a.onspread(0);let pe=new vc(dt,vt.domElement);pe.enableDamping=!0,pe.maxDistance=14,pe.minDistance=.1,pe.screenSpacePanning=!0,pe.target.set(0,.4,0),pe.enabled=!1;let xe=!1,Ze=G=>{xe=G,pe.enabled=G,ut("btn-cam").textContent=G?"\u041A\u0430\u043C\u0435\u0440\u0430: \u0441\u0432\u043E\u0431\u043E\u0434\u043D\u0430\u044F":"\u041A\u0430\u043C\u0435\u0440\u0430: \u0438\u0433\u0440\u043E\u043A",G?(dt.position.set(c.x+.3,c.y+.3,c.z+1.6),pe.target.set(0,l+1,0),pe.update()):dt.position.copy(c)};ut("btn-cam").onclick=()=>Ze(!xe),addEventListener("keydown",G=>{G.key.toLowerCase()==="c"&&Ze(!xe)}),Ln.get("freecam")==="1"&&Ze(!0);for(let G of["pointerup","touchend","click","keydown"])addEventListener(G,()=>kt.unlock(),{passive:!0});document.addEventListener("visibilitychange",()=>{!document.hidden&&kt.ctx&&kt.ctx.state!=="running"&&kt.ctx.resume().catch(()=>{})}),ut("load-text").textContent="\u041F\u043E\u0434\u0433\u043E\u0442\u043E\u0432\u043A\u0430\u2026";try{await vt.compileAsync?.(Bi,dt)}catch{}Bi.traverse(G=>{let re=G.material?Array.isArray(G.material)?G.material:[G.material]:[];for(let Re of re)for(let U of["map","normalMap","roughnessMap","metalnessMap","emissiveMap","bumpMap","aoMap","alphaMap"])Re[U]&&vt.initTexture(Re[U])});{let G=dt.quaternion.clone();for(let re=0;re<8;re++)dt.quaternion.setFromEuler(new Yt(0,re*Math.PI/4,0)),vt.shadowMap.needsUpdate=!0,vt.render(Bi,dt),await new Promise(Re=>requestAnimationFrame(Re));dt.quaternion.copy(G)}{let G=!1;try{G=!!sessionStorage.getItem("finalanswer-session")}catch{}let re=ut("btn-room");re.hidden=!G,re.onclick=()=>{location.href="/"}}ut("loading").hidden=!0;{let G=document.documentElement,re=G.requestFullscreen||G.webkitRequestFullscreen,Re=matchMedia("(display-mode: fullscreen), (display-mode: standalone)").matches||navigator.standalone;if(re&&!Re&&Ln.get("capture")===null&&addEventListener("pointerup",function U(){removeEventListener("pointerup",U);try{re.call(G,{navigationUI:"hide"})?.catch?.(()=>{})}catch{}}),ki&&!re&&!Re&&/iPhone|iPod/.test(navigator.userAgent)){let U=document.createElement("div");U.id="fs-tip",U.textContent="\u041F\u043E\u043B\u043D\u044B\u0439 \u044D\u043A\u0440\u0430\u043D: \xAB\u041F\u043E\u0434\u0435\u043B\u0438\u0442\u044C\u0441\u044F\xBB \u2192 \xAB\u041D\u0430 \u044D\u043A\u0440\u0430\u043D \u0414\u043E\u043C\u043E\u0439\xBB, \u0437\u0430\u0442\u0435\u043C \u043E\u0442\u043A\u0440\u044B\u0442\u044C \u0441 \u0438\u043A\u043E\u043D\u043A\u0438",U.onclick=()=>U.remove(),document.body.append(U),setTimeout(()=>U.remove(),9e3)}}let te=performance.now(),le=0,ue=0,ce=new Map,fe=()=>!xe&&!Q&&(p.state==="rest"||p.state==="falling"||p.lowered);vt.domElement.addEventListener("pointerdown",G=>ce.set(G.pointerId,{x:G.clientX,y:G.clientY})),addEventListener("pointerup",G=>ce.delete(G.pointerId)),addEventListener("pointercancel",G=>ce.delete(G.pointerId)),vt.domElement.addEventListener("pointermove",G=>{let re=ce.get(G.pointerId);if(!re||ce.size>1)return;let Re=G.clientX-re.x,U=G.clientY-re.y;if(re.x=G.clientX,re.y=G.clientY,!fe())return;let Ce=2.6/Math.max(innerHeight,400);d+=Re*Ce,f=Zt.clamp(f+U*Ce,-1.45,1.35),Z=null}),vt.domElement.addEventListener("pointermove",G=>{G.pointerType!=="mouse"||ce.size||(m.setFromCamera(new ae(G.clientX/innerWidth*2-1,-G.clientY/innerHeight*2+1),dt),x.hover(m))});let Le=G=>{let re=Math.min(.05,(G-te)/1e3)*Fm;te=G,le+=re,ue++,le>1&&(le/ue*1e3>19&&(ma>Um?(ma=Math.max(Um,ma-.2),vt.setPixelRatio(ma),yd()):Yc<15&&(Yc=Yc*2+1)),le=0,ue=0);{let Ce=1-Math.exp(-re*22);h+=(d-h)*Ce,u+=(f-u)*Ce}if(de+=((Q?1:0)-de)*(1-Math.exp(-re*6)),xe)pe.update();else if(de>.001){let Ce=x.center(),Ke=new C(0,0,1).applyQuaternion(x.group.getWorldQuaternion(new ft)),L=Ce.clone().add(new C(0,.05,0)),b=Ce.clone().addScaledVector(Ke,dt.aspect<.9?1.3:1.12).add(new C(0,.09,0)),H=new ft().setFromRotationMatrix(new We().lookAt(b,L,new C(0,1,0))),$=new ft().setFromEuler(new Yt(u,h,0,"YXZ"));dt.position.copy(c).lerp(b,de),dt.quaternion.copy($).slerp(H,de),!Q&&de<.002&&(de=0)}else dt.position.copy(c),dt.quaternion.setFromEuler(new Yt(u,h,0,"YXZ"));if(o.update(re),p.update(re),x.update(re),Z){let Ce=Z[0]-d;Ce=Math.atan2(Math.sin(Ce),Math.cos(Ce)),d+=Ce*Math.min(1,re*5),f+=(Z[1]-f)*Math.min(1,re*5),Math.abs(Ce)<.002&&Math.abs(Z[1]-f)<.002&&(Z=null)}{let Ce=y?Math.max(0,(y-performance.now())/1e3):E;ut("clock-num").textContent=String(Math.ceil(Ce)),ut("clock-ring").style.strokeDashoffset=String(176*(1-Ce/E)),ut("clock").dataset.urgent=String(!!y&&Ce<10),y&&Ce<=0&&!x.locked&&(N(!1,"\u0412\u0420\u0415\u041C\u042F \u0412\u042B\u0428\u041B\u041E"),setTimeout(()=>o.drop?.(.8),350))}let Re=o.shelf&&Math.abs(a.root.position.y-Mn/2-o.shelf.top.y)<.2&&Math.abs(a.root.position.z-o.shelf.top.z)<.2?o.shelf.top.y:l,U=Math.max(0,a.root.position.y-Mn/2-Re);_.position.set(a.root.position.x,Re+.0012,a.root.position.z),_.rotation.z=new Yt().setFromQuaternion(a.root.quaternion,"YXZ").y,_.material.opacity=.75*Math.max(0,1-U/.18),_.visible=U<.18;{J>=0&&(J+=re),z>=0&&(z+=re);let Ce=X?ne+9:ne;Math.abs(dt.fov-Ce)>.05&&(dt.fov+=(Ce-dt.fov)*(1-Math.exp(-re*(X?7:2.5))),dt.updateProjectionMatrix()),X?(O=Math.max(O,.35),o.power=Math.random()<.25?.35:.08,o.alarmLevel=Math.min(1,J*6),W+=(1.2-W)*Math.min(1,re*6)):z>=0&&(o.power=z<.25?.05:z<1.4?(Math.random()<.5?.25:.9)*Math.min(1,z):Math.min(1,o.power+re),o.alarmLevel=Math.max(0,1-Math.max(0,z-1.2)/1.6),z>3&&(z=-1,J=-1,o.power=1,o.alarmLevel=0)),W+=(-B*90-W*12)*re,B+=W*re,(Math.abs(B)>1e-4||X||z>=0)&&(dt.position.y+=B*.05)}if(O>.002){let Ce=O*O;dt.position.add(new C((Math.random()-.5)*.05*Ce,(Math.random()-.5)*.07*Ce,(Math.random()-.5)*.03*Ce)),dt.rotateZ((Math.random()-.5)*.03*Ce),O*=Math.exp(-re*4)}Tx++%(Yc+1)===0&&(vt.shadowMap.needsUpdate=!0),vt.render(Bi,dt),requestAnimationFrame(Le)};requestAnimationFrame(Le),window.__manual={book:a,ui:p,renderer:vt,scene:Bi,camera:dt,get state(){return p.state},get info(){return vt.info.render},box:x,setInspect:De,cage:o,get shake(){return O},look(G,re){h=d=G,u=f=re},setFree:Ze,set timeScale(G){Fm=G},step(G){for(let re=0;re<Math.round(G*60);re++)o.update(1/60),p.update(1/60)}}}wx().catch(n=>{ut("load-text").textContent="Failed: "+(n?.message||n),console.error(n)});
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
