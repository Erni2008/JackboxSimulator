var od=0,Ul=1,cd=2;var ra=1,Oo=2,tr=3,Jn=0,sn=1,Ct=2,$n=0,nr=1,Et=2,zl=3,Fl=4,ld=5;var hs=100,hd=101,ud=102,dd=103,fd=104,pd=200,md=201,gd=202,xd=203,Ol=204,Bl=205,_d=206,yd=207,vd=208,Md=209,bd=210,Ed=211,Sd=212,Td=213,wd=214,so=0,ro=1,ao=2,Fs=3,oo=4,co=5,lo=6,ho=7,Hl=0,Ad=1,Rd=2,Fn=0,kl=1,Gl=2,Vl=3,aa=4,Wl=5,Xl=6,ql=7,Ml="attached",Cd="detached",Yl=300,Gi=301,us=302,ir=303,Bo=304,oa=306,Sn=1e3,bn=1001,Os=1002,Nt=1003,Ho=1004;var ds=1005;var Dt=1006,sr=1007;var On=1008;var hn=1009,Zl=1010,Kl=1011,rr=1012,ko=1013,Bn=1014,gn=1015,Hn=1016,Go=1017,Vo=1018,ar=1020,Jl=35902,$l=35899,jl=1021,Ql=1022,xn=1023,qn=1026,Vi=1027,Wo=1028,Xo=1029,Wi=1030,qo=1031;var Yo=1033,ca=33776,la=33777,ha=33778,ua=33779,Zo=35840,Ko=35841,Jo=35842,$o=35843,jo=36196,Qo=37492,ec=37496,tc=37488,nc=37489,da=37490,ic=37491,sc=37808,rc=37809,ac=37810,oc=37811,cc=37812,lc=37813,hc=37814,uc=37815,dc=37816,fc=37817,pc=37818,mc=37819,gc=37820,xc=37821,_c=36492,yc=36494,vc=36495,Mc=36283,bc=36284,fa=36285,Ec=36286,Sc=2200,Tc=2201,Id=2202,ts=2300,ns=2301,to=2302,bl=2303,$i=2400,ji=2401,Pr=2402,wc=2500,Pd=2501,eh=0,pa=1,or=2,Ld=3200;var Ac=0,Nd=1,yi="",mt="srgb",en="srgb-linear",Lr="linear",dt="srgb";var no=7680;var Dd=519,Ud=512,zd=513,Fd=514,Rc=515,Od=516,Bd=517,Cc=518,Hd=519,th=35044;var nh="300 es",Dn=2e3,Bs=2001;function jf(r){for(let e=r.length-1;e>=0;--e)if(r[e]>=65535)return!0;return!1}function Qf(r){return ArrayBuffer.isView(r)&&!(r instanceof DataView)}function Hs(r){return document.createElementNS("http://www.w3.org/1999/xhtml",r)}function kd(){let r=Hs("canvas");return r.style.display="block",r}var pu={},ks=null;function Nr(...r){let e="THREE."+r.shift();ks?ks("log",e,...r):console.log(e,...r)}function Gd(r){let e=r[0];if(typeof e=="string"&&e.startsWith("TSL:")){let t=r[1];t&&t.isStackTrace?r[0]+=" "+t.getLocation():r[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return r}function Le(...r){r=Gd(r);let e="THREE."+r.shift();if(ks)ks("warn",e,...r);else{let t=r[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...r)}}function He(...r){r=Gd(r);let e="THREE."+r.shift();if(ks)ks("error",e,...r);else{let t=r[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...r)}}function es(...r){let e=r.join(" ");e in pu||(pu[e]=!0,Le(...r))}function Vd(r,e,t){return new Promise(function(n,i){function s(){switch(r.clientWaitSync(e,r.SYNC_FLUSH_COMMANDS_BIT,0)){case r.WAIT_FAILED:i();break;case r.TIMEOUT_EXPIRED:setTimeout(s,t);break;default:n()}}setTimeout(s,t)})}var Wd={[so]:ro,[ao]:lo,[oo]:ho,[Fs]:co,[ro]:so,[lo]:ao,[ho]:oo,[co]:Fs},Un=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let i=n[e];if(i!==void 0){let s=i.indexOf(t);s!==-1&&i.splice(s,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let i=n.slice(0);for(let s=0,a=i.length;s<a;s++)i[s].call(this,e);e.target=null}}},Kt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],mu=1234567,Ar=Math.PI/180,is=180/Math.PI;function En(){let r=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Kt[r&255]+Kt[r>>8&255]+Kt[r>>16&255]+Kt[r>>24&255]+"-"+Kt[e&255]+Kt[e>>8&255]+"-"+Kt[e>>16&15|64]+Kt[e>>24&255]+"-"+Kt[t&63|128]+Kt[t>>8&255]+"-"+Kt[t>>16&255]+Kt[t>>24&255]+Kt[n&255]+Kt[n>>8&255]+Kt[n>>16&255]+Kt[n>>24&255]).toLowerCase()}function Qe(r,e,t){return Math.max(e,Math.min(t,r))}function ih(r,e){return(r%e+e)%e}function ep(r,e,t,n,i){return n+(r-e)*(i-n)/(t-e)}function tp(r,e,t){return r!==e?(t-r)/(e-r):0}function Rr(r,e,t){return(1-t)*r+t*e}function np(r,e,t,n){return Rr(r,e,1-Math.exp(-t*n))}function ip(r,e=1){return e-Math.abs(ih(r,e*2)-e)}function sp(r,e,t){return r<=e?0:r>=t?1:(r=(r-e)/(t-e),r*r*(3-2*r))}function rp(r,e,t){return r<=e?0:r>=t?1:(r=(r-e)/(t-e),r*r*r*(r*(r*6-15)+10))}function ap(r,e){return r+Math.floor(Math.random()*(e-r+1))}function op(r,e){return r+Math.random()*(e-r)}function cp(r){return r*(.5-Math.random())}function lp(r){r!==void 0&&(mu=r);let e=mu+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function hp(r){return r*Ar}function up(r){return r*is}function dp(r){return r>0&&Number.isInteger(r)&&2**Math.round(Math.log2(r))===r}function fp(r){return Math.pow(2,Math.ceil(Math.log(r)/Math.LN2))}function pp(r){return Math.pow(2,Math.floor(Math.log(r)/Math.LN2))}function mp(r,e,t,n,i){let s=Math.cos,a=Math.sin,c=s(t/2),o=a(t/2),h=s((e+n)/2),l=a((e+n)/2),u=s((e-n)/2),d=a((e-n)/2),p=s((n-e)/2),g=a((n-e)/2);switch(i){case"XYX":r.set(c*l,o*u,o*d,c*h);break;case"YZY":r.set(o*d,c*l,o*u,c*h);break;case"ZXZ":r.set(o*u,o*d,c*l,c*h);break;case"XZX":r.set(c*l,o*g,o*p,c*h);break;case"YXY":r.set(o*p,c*l,o*g,c*h);break;case"ZYZ":r.set(o*g,o*p,c*l,c*h);break;default:Le("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function Nn(r,e){switch(e.constructor){case Float32Array:return r;case Uint32Array:return r/4294967295;case Uint16Array:return r/65535;case Uint8Array:case Uint8ClampedArray:return r/255;case Int32Array:return Math.max(r/2147483647,-1);case Int16Array:return Math.max(r/32767,-1);case Int8Array:return Math.max(r/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function pt(r,e){switch(e.constructor){case Float32Array:return r;case Uint32Array:return Math.round(r*4294967295);case Uint16Array:return Math.round(r*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(r*255);case Int32Array:return Math.round(r*2147483647);case Int16Array:return Math.round(r*32767);case Int8Array:return Math.round(r*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}var sh={DEG2RAD:Ar,RAD2DEG:is,generateUUID:En,clamp:Qe,euclideanModulo:ih,mapLinear:ep,inverseLerp:tp,lerp:Rr,damp:np,pingpong:ip,smoothstep:sp,smootherstep:rp,randInt:ap,randFloat:op,randFloatSpread:cp,seededRandom:lp,degToRad:hp,radToDeg:up,isPowerOfTwo:dp,ceilPowerOfTwo:fp,floorPowerOfTwo:pp,setQuaternionFromProperEuler:mp,normalize:pt,denormalize:Nn},ae=class r{static{r.prototype.isVector2=!0}constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6],this.y=i[1]*t+i[4]*n+i[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Qe(this.x,e.x,t.x),this.y=Qe(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=Qe(this.x,e,t),this.y=Qe(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Qe(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(Qe(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),i=Math.sin(t),s=this.x-e.x,a=this.y-e.y;return this.x=s*n-a*i+e.x,this.y=s*i+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Rt=class{constructor(e=0,t=0,n=0,i=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=i}static slerpFlat(e,t,n,i,s,a,c){let o=n[i+0],h=n[i+1],l=n[i+2],u=n[i+3],d=s[a+0],p=s[a+1],g=s[a+2],x=s[a+3];if(u!==x||o!==d||h!==p||l!==g){let m=o*d+h*p+l*g+u*x;m<0&&(d=-d,p=-p,g=-g,x=-x,m=-m);let f=1-c;if(m<.9995){let M=Math.acos(m),T=Math.sin(M);f=Math.sin(f*M)/T,c=Math.sin(c*M)/T,o=o*f+d*c,h=h*f+p*c,l=l*f+g*c,u=u*f+x*c}else{o=o*f+d*c,h=h*f+p*c,l=l*f+g*c,u=u*f+x*c;let M=1/Math.sqrt(o*o+h*h+l*l+u*u);o*=M,h*=M,l*=M,u*=M}}e[t]=o,e[t+1]=h,e[t+2]=l,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,i,s,a){let c=n[i],o=n[i+1],h=n[i+2],l=n[i+3],u=s[a],d=s[a+1],p=s[a+2],g=s[a+3];return e[t]=c*g+l*u+o*p-h*d,e[t+1]=o*g+l*d+h*u-c*p,e[t+2]=h*g+l*p+c*d-o*u,e[t+3]=l*g-c*u-o*d-h*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,i){return this._x=e,this._y=t,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,i=e._y,s=e._z,a=e._order,c=Math.cos,o=Math.sin,h=c(n/2),l=c(i/2),u=c(s/2),d=o(n/2),p=o(i/2),g=o(s/2);switch(a){case"XYZ":this._x=d*l*u+h*p*g,this._y=h*p*u-d*l*g,this._z=h*l*g+d*p*u,this._w=h*l*u-d*p*g;break;case"YXZ":this._x=d*l*u+h*p*g,this._y=h*p*u-d*l*g,this._z=h*l*g-d*p*u,this._w=h*l*u+d*p*g;break;case"ZXY":this._x=d*l*u-h*p*g,this._y=h*p*u+d*l*g,this._z=h*l*g+d*p*u,this._w=h*l*u-d*p*g;break;case"ZYX":this._x=d*l*u-h*p*g,this._y=h*p*u+d*l*g,this._z=h*l*g-d*p*u,this._w=h*l*u+d*p*g;break;case"YZX":this._x=d*l*u+h*p*g,this._y=h*p*u+d*l*g,this._z=h*l*g-d*p*u,this._w=h*l*u-d*p*g;break;case"XZY":this._x=d*l*u-h*p*g,this._y=h*p*u-d*l*g,this._z=h*l*g+d*p*u,this._w=h*l*u+d*p*g;break;default:Le("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,i=Math.sin(n);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],i=t[4],s=t[8],a=t[1],c=t[5],o=t[9],h=t[2],l=t[6],u=t[10],d=n+c+u;if(d>0){let p=.5/Math.sqrt(d+1);this._w=.25/p,this._x=(l-o)*p,this._y=(s-h)*p,this._z=(a-i)*p}else if(n>c&&n>u){let p=2*Math.sqrt(1+n-c-u);this._w=(l-o)/p,this._x=.25*p,this._y=(i+a)/p,this._z=(s+h)/p}else if(c>u){let p=2*Math.sqrt(1+c-n-u);this._w=(s-h)/p,this._x=(i+a)/p,this._y=.25*p,this._z=(o+l)/p}else{let p=2*Math.sqrt(1+u-n-c);this._w=(a-i)/p,this._x=(s+h)/p,this._y=(o+l)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Qe(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let i=Math.min(1,t/n);return this.slerp(e,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,i=e._y,s=e._z,a=e._w,c=t._x,o=t._y,h=t._z,l=t._w;return this._x=n*l+a*c+i*h-s*o,this._y=i*l+a*o+s*c-n*h,this._z=s*l+a*h+n*o-i*c,this._w=a*l-n*c-i*o-s*h,this._onChangeCallback(),this}slerp(e,t){let n=e._x,i=e._y,s=e._z,a=e._w,c=this.dot(e);c<0&&(n=-n,i=-i,s=-s,a=-a,c=-c);let o=1-t;if(c<.9995){let h=Math.acos(c),l=Math.sin(h);o=Math.sin(o*h)/l,t=Math.sin(t*h)/l,this._x=this._x*o+n*t,this._y=this._y*o+i*t,this._z=this._z*o+s*t,this._w=this._w*o+a*t,this._onChangeCallback()}else this._x=this._x*o+n*t,this._y=this._y*o+i*t,this._z=this._z*o+s*t,this._w=this._w*o+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),s=Math.sqrt(n);return this.set(i*Math.sin(e),i*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},L=class r{static{r.prototype.isVector3=!0}constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(gu.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(gu.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,i=this.z,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6]*i,this.y=s[1]*t+s[4]*n+s[7]*i,this.z=s[2]*t+s[5]*n+s[8]*i,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,i=this.z,s=e.elements,a=1/(s[3]*t+s[7]*n+s[11]*i+s[15]);return this.x=(s[0]*t+s[4]*n+s[8]*i+s[12])*a,this.y=(s[1]*t+s[5]*n+s[9]*i+s[13])*a,this.z=(s[2]*t+s[6]*n+s[10]*i+s[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,i=this.z,s=e.x,a=e.y,c=e.z,o=e.w,h=2*(a*i-c*n),l=2*(c*t-s*i),u=2*(s*n-a*t);return this.x=t+o*h+a*u-c*l,this.y=n+o*l+c*h-s*u,this.z=i+o*u+s*l-a*h,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,i=this.z,s=e.elements;return this.x=s[0]*t+s[4]*n+s[8]*i,this.y=s[1]*t+s[5]*n+s[9]*i,this.z=s[2]*t+s[6]*n+s[10]*i,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Qe(this.x,e.x,t.x),this.y=Qe(this.y,e.y,t.y),this.z=Qe(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=Qe(this.x,e,t),this.y=Qe(this.y,e,t),this.z=Qe(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Qe(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,i=e.y,s=e.z,a=t.x,c=t.y,o=t.z;return this.x=i*o-s*c,this.y=s*a-n*o,this.z=n*c-i*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Yc.copy(this).projectOnVector(e),this.sub(Yc)}reflect(e){return this.sub(Yc.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(Qe(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,i=this.z-e.z;return t*t+n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let i=Math.sin(t)*e;return this.x=i*Math.sin(n),this.y=Math.cos(t)*e,this.z=i*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),i=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=i,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Yc=new L,gu=new Rt,Xe=class r{static{r.prototype.isMatrix3=!0}constructor(e,t,n,i,s,a,c,o,h){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,i,s,a,c,o,h)}set(e,t,n,i,s,a,c,o,h){let l=this.elements;return l[0]=e,l[1]=i,l[2]=c,l[3]=t,l[4]=s,l[5]=o,l[6]=n,l[7]=a,l[8]=h,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,i=t.elements,s=this.elements,a=n[0],c=n[3],o=n[6],h=n[1],l=n[4],u=n[7],d=n[2],p=n[5],g=n[8],x=i[0],m=i[3],f=i[6],M=i[1],T=i[4],y=i[7],E=i[2],w=i[5],S=i[8];return s[0]=a*x+c*M+o*E,s[3]=a*m+c*T+o*w,s[6]=a*f+c*y+o*S,s[1]=h*x+l*M+u*E,s[4]=h*m+l*T+u*w,s[7]=h*f+l*y+u*S,s[2]=d*x+p*M+g*E,s[5]=d*m+p*T+g*w,s[8]=d*f+p*y+g*S,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],a=e[4],c=e[5],o=e[6],h=e[7],l=e[8];return t*a*l-t*c*h-n*s*l+n*c*o+i*s*h-i*a*o}invert(){let e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],a=e[4],c=e[5],o=e[6],h=e[7],l=e[8],u=l*a-c*h,d=c*o-l*s,p=h*s-a*o,g=t*u+n*d+i*p;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let x=1/g;return e[0]=u*x,e[1]=(i*h-l*n)*x,e[2]=(c*n-i*a)*x,e[3]=d*x,e[4]=(l*t-i*o)*x,e[5]=(i*s-c*t)*x,e[6]=p*x,e[7]=(n*o-h*t)*x,e[8]=(a*t-n*s)*x,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,i,s,a,c){let o=Math.cos(s),h=Math.sin(s);return this.set(n*o,n*h,-n*(o*a+h*c)+a+e,-i*h,i*o,-i*(-h*a+o*c)+c+t,0,0,1),this}scale(e,t){return es("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Zc.makeScale(e,t)),this}rotate(e){return es("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Zc.makeRotation(-e)),this}translate(e,t){return es("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Zc.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let i=0;i<9;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},Zc=new Xe,xu=new Xe().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),_u=new Xe().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function gp(){let r={enabled:!0,workingColorSpace:en,spaces:{},convert:function(i,s,a){return this.enabled===!1||s===a||!s||!a||(this.spaces[s].transfer===dt&&(i.r=ui(i.r),i.g=ui(i.g),i.b=ui(i.b)),this.spaces[s].primaries!==this.spaces[a].primaries&&(i.applyMatrix3(this.spaces[s].toXYZ),i.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===dt&&(i.r=zs(i.r),i.g=zs(i.g),i.b=zs(i.b))),i},workingToColorSpace:function(i,s){return this.convert(i,this.workingColorSpace,s)},colorSpaceToWorking:function(i,s){return this.convert(i,s,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===yi?Lr:this.spaces[i].transfer},getToneMappingMode:function(i){return this.spaces[i].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(i,s=this.workingColorSpace){return i.fromArray(this.spaces[s].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,s,a){return i.copy(this.spaces[s].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(i,s){return es("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),r.workingToColorSpace(i,s)},toWorkingColorSpace:function(i,s){return es("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),r.colorSpaceToWorking(i,s)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return r.define({[en]:{primaries:e,whitePoint:n,transfer:Lr,toXYZ:xu,fromXYZ:_u,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:mt},outputColorSpaceConfig:{drawingBufferColorSpace:mt}},[mt]:{primaries:e,whitePoint:n,transfer:dt,toXYZ:xu,fromXYZ:_u,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:mt}}}),r}var je=gp();function ui(r){return r<.04045?r*.0773993808:Math.pow(r*.9478672986+.0521327014,2.4)}function zs(r){return r<.0031308?r*12.92:1.055*Math.pow(r,.41666)-.055}var _s,uo=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{_s===void 0&&(_s=Hs("canvas")),_s.width=e.width,_s.height=e.height;let i=_s.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),n=_s}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=Hs("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let i=n.getImageData(0,0,e.width,e.height),s=i.data;for(let a=0;a<s.length;a++)s[a]=ui(s[a]/255)*255;return n.putImageData(i,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(ui(t[n]/255)*255):t[n]=ui(t[n]);return{data:t,width:e.width,height:e.height}}else return Le("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},xp=0,Gs=class{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:xp++}),this.uuid=En(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let s;if(Array.isArray(i)){s=[];for(let a=0,c=i.length;a<c;a++)i[a].isDataTexture?s.push(Kc(i[a].image)):s.push(Kc(i[a]))}else s=Kc(i);n.url=s}return t||(e.images[this.uuid]=n),n}};function Kc(r){return typeof HTMLImageElement<"u"&&r instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&r instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&r instanceof ImageBitmap?uo.getDataURL(r):r.data?{data:Array.from(r.data),width:r.width,height:r.height,type:r.data.constructor.name}:(Le("Texture: Unable to serialize Texture."),{})}var _p=0,Jc=new L,Ht=class r extends Un{constructor(e=r.DEFAULT_IMAGE,t=r.DEFAULT_MAPPING,n=bn,i=bn,s=Dt,a=On,c=xn,o=hn,h=r.DEFAULT_ANISOTROPY,l=yi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:_p++}),this.uuid=En(),this.name="",this.source=new Gs(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=s,this.minFilter=a,this.anisotropy=h,this.format=c,this.internalFormat=null,this.type=o,this.offset=new ae(0,0),this.repeat=new ae(1,1),this.center=new ae(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Xe,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=l,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Jc).x}get height(){return this.source.getSize(Jc).y}get depth(){return this.source.getSize(Jc).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){Le(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let i=this[t];if(i===void 0){Le(`Texture.setValues(): property '${t}' does not exist.`);continue}i&&n&&i.isVector2&&n.isVector2||i&&n&&i.isVector3&&n.isVector3||i&&n&&i.isMatrix3&&n.isMatrix3?i.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Yl)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Sn:e.x=e.x-Math.floor(e.x);break;case bn:e.x=e.x<0?0:1;break;case Os:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Sn:e.y=e.y-Math.floor(e.y);break;case bn:e.y=e.y<0?0:1;break;case Os:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};Ht.DEFAULT_IMAGE=null;Ht.DEFAULT_MAPPING=Yl;Ht.DEFAULT_ANISOTROPY=1;var gt=class r{static{r.prototype.isVector4=!0}constructor(e=0,t=0,n=0,i=1){this.x=e,this.y=t,this.z=n,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,i){return this.x=e,this.y=t,this.z=n,this.w=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,i=this.z,s=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*i+a[12]*s,this.y=a[1]*t+a[5]*n+a[9]*i+a[13]*s,this.z=a[2]*t+a[6]*n+a[10]*i+a[14]*s,this.w=a[3]*t+a[7]*n+a[11]*i+a[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,i,s,o=e.elements,h=o[0],l=o[4],u=o[8],d=o[1],p=o[5],g=o[9],x=o[2],m=o[6],f=o[10];if(Math.abs(l-d)<.01&&Math.abs(u-x)<.01&&Math.abs(g-m)<.01){if(Math.abs(l+d)<.1&&Math.abs(u+x)<.1&&Math.abs(g+m)<.1&&Math.abs(h+p+f-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let T=(h+1)/2,y=(p+1)/2,E=(f+1)/2,w=(l+d)/4,S=(u+x)/4,_=(g+m)/4;return T>y&&T>E?T<.01?(n=0,i=.707106781,s=.707106781):(n=Math.sqrt(T),i=w/n,s=S/n):y>E?y<.01?(n=.707106781,i=0,s=.707106781):(i=Math.sqrt(y),n=w/i,s=_/i):E<.01?(n=.707106781,i=.707106781,s=0):(s=Math.sqrt(E),n=S/s,i=_/s),this.set(n,i,s,t),this}let M=Math.sqrt((m-g)*(m-g)+(u-x)*(u-x)+(d-l)*(d-l));return Math.abs(M)<.001&&(M=1),this.x=(m-g)/M,this.y=(u-x)/M,this.z=(d-l)/M,this.w=Math.acos((h+p+f-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Qe(this.x,e.x,t.x),this.y=Qe(this.y,e.y,t.y),this.z=Qe(this.z,e.z,t.z),this.w=Qe(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=Qe(this.x,e,t),this.y=Qe(this.y,e,t),this.z=Qe(this.z,e,t),this.w=Qe(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Qe(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},fo=class extends Un{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Dt,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new gt(0,0,e,t),this.scissorTest=!1,this.viewport=new gt(0,0,e,t),this.textures=[];let i={width:e,height:t,depth:n.depth},s=new Ht(i),a=n.count;for(let c=0;c<a;c++)this.textures[c]=s.clone(),this.textures[c].isRenderTargetTexture=!0,this.textures[c].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:Dt,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let i=0,s=this.textures.length;i<s;i++)this.textures[i].image.width=e,this.textures[i].image.height=t,this.textures[i].image.depth=n,this.textures[i].isData3DTexture!==!0&&(this.textures[i].isArrayTexture=this.textures[i].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let i=Object.assign({},e.textures[t].image);this.textures[t].source=new Gs(i)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){let t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}},rn=class extends fo{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},Dr=class extends Ht{constructor(e=null,t=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=Nt,this.minFilter=Nt,this.wrapR=bn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var po=class extends Ht{constructor(e=null,t=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=Nt,this.minFilter=Nt,this.wrapR=bn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}};var Fe=class r{static{r.prototype.isMatrix4=!0}constructor(e,t,n,i,s,a,c,o,h,l,u,d,p,g,x,m){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,i,s,a,c,o,h,l,u,d,p,g,x,m)}set(e,t,n,i,s,a,c,o,h,l,u,d,p,g,x,m){let f=this.elements;return f[0]=e,f[4]=t,f[8]=n,f[12]=i,f[1]=s,f[5]=a,f[9]=c,f[13]=o,f[2]=h,f[6]=l,f[10]=u,f[14]=d,f[3]=p,f[7]=g,f[11]=x,f[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new r().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,n=e.elements,i=1/ys.setFromMatrixColumn(e,0).length(),s=1/ys.setFromMatrixColumn(e,1).length(),a=1/ys.setFromMatrixColumn(e,2).length();return t[0]=n[0]*i,t[1]=n[1]*i,t[2]=n[2]*i,t[3]=0,t[4]=n[4]*s,t[5]=n[5]*s,t[6]=n[6]*s,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,i=e.y,s=e.z,a=Math.cos(n),c=Math.sin(n),o=Math.cos(i),h=Math.sin(i),l=Math.cos(s),u=Math.sin(s);if(e.order==="XYZ"){let d=a*l,p=a*u,g=c*l,x=c*u;t[0]=o*l,t[4]=-o*u,t[8]=h,t[1]=p+g*h,t[5]=d-x*h,t[9]=-c*o,t[2]=x-d*h,t[6]=g+p*h,t[10]=a*o}else if(e.order==="YXZ"){let d=o*l,p=o*u,g=h*l,x=h*u;t[0]=d+x*c,t[4]=g*c-p,t[8]=a*h,t[1]=a*u,t[5]=a*l,t[9]=-c,t[2]=p*c-g,t[6]=x+d*c,t[10]=a*o}else if(e.order==="ZXY"){let d=o*l,p=o*u,g=h*l,x=h*u;t[0]=d-x*c,t[4]=-a*u,t[8]=g+p*c,t[1]=p+g*c,t[5]=a*l,t[9]=x-d*c,t[2]=-a*h,t[6]=c,t[10]=a*o}else if(e.order==="ZYX"){let d=a*l,p=a*u,g=c*l,x=c*u;t[0]=o*l,t[4]=g*h-p,t[8]=d*h+x,t[1]=o*u,t[5]=x*h+d,t[9]=p*h-g,t[2]=-h,t[6]=c*o,t[10]=a*o}else if(e.order==="YZX"){let d=a*o,p=a*h,g=c*o,x=c*h;t[0]=o*l,t[4]=x-d*u,t[8]=g*u+p,t[1]=u,t[5]=a*l,t[9]=-c*l,t[2]=-h*l,t[6]=p*u+g,t[10]=d-x*u}else if(e.order==="XZY"){let d=a*o,p=a*h,g=c*o,x=c*h;t[0]=o*l,t[4]=-u,t[8]=h*l,t[1]=d*u+x,t[5]=a*l,t[9]=p*u-g,t[2]=g*u-p,t[6]=c*l,t[10]=x*u+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(yp,e,vp)}lookAt(e,t,n){let i=this.elements;return un.subVectors(e,t),un.lengthSq()===0&&(un.z=1),un.normalize(),Ti.crossVectors(n,un),Ti.lengthSq()===0&&(Math.abs(n.z)===1?un.x+=1e-4:un.z+=1e-4,un.normalize(),Ti.crossVectors(n,un)),Ti.normalize(),Ta.crossVectors(un,Ti),i[0]=Ti.x,i[4]=Ta.x,i[8]=un.x,i[1]=Ti.y,i[5]=Ta.y,i[9]=un.y,i[2]=Ti.z,i[6]=Ta.z,i[10]=un.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,i=t.elements,s=this.elements,a=n[0],c=n[4],o=n[8],h=n[12],l=n[1],u=n[5],d=n[9],p=n[13],g=n[2],x=n[6],m=n[10],f=n[14],M=n[3],T=n[7],y=n[11],E=n[15],w=i[0],S=i[4],_=i[8],v=i[12],R=i[1],C=i[5],I=i[9],F=i[13],N=i[2],U=i[6],D=i[10],O=i[14],X=i[3],k=i[7],Y=i[11],K=i[15];return s[0]=a*w+c*R+o*N+h*X,s[4]=a*S+c*C+o*U+h*k,s[8]=a*_+c*I+o*D+h*Y,s[12]=a*v+c*F+o*O+h*K,s[1]=l*w+u*R+d*N+p*X,s[5]=l*S+u*C+d*U+p*k,s[9]=l*_+u*I+d*D+p*Y,s[13]=l*v+u*F+d*O+p*K,s[2]=g*w+x*R+m*N+f*X,s[6]=g*S+x*C+m*U+f*k,s[10]=g*_+x*I+m*D+f*Y,s[14]=g*v+x*F+m*O+f*K,s[3]=M*w+T*R+y*N+E*X,s[7]=M*S+T*C+y*U+E*k,s[11]=M*_+T*I+y*D+E*Y,s[15]=M*v+T*F+y*O+E*K,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],i=e[8],s=e[12],a=e[1],c=e[5],o=e[9],h=e[13],l=e[2],u=e[6],d=e[10],p=e[14],g=e[3],x=e[7],m=e[11],f=e[15],M=o*p-h*d,T=c*p-h*u,y=c*d-o*u,E=a*p-h*l,w=a*d-o*l,S=a*u-c*l;return t*(x*M-m*T+f*y)-n*(g*M-m*E+f*w)+i*(g*T-x*E+f*S)-s*(g*y-x*w+m*S)}determinantAffine(){let e=this.elements,t=e[0],n=e[4],i=e[8],s=e[1],a=e[5],c=e[9],o=e[2],h=e[6],l=e[10];return t*(a*l-c*h)-n*(s*l-c*o)+i*(s*h-a*o)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let i=this.elements;return e.isVector3?(i[12]=e.x,i[13]=e.y,i[14]=e.z):(i[12]=e,i[13]=t,i[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],a=e[4],c=e[5],o=e[6],h=e[7],l=e[8],u=e[9],d=e[10],p=e[11],g=e[12],x=e[13],m=e[14],f=e[15],M=t*c-n*a,T=t*o-i*a,y=t*h-s*a,E=n*o-i*c,w=n*h-s*c,S=i*h-s*o,_=l*x-u*g,v=l*m-d*g,R=l*f-p*g,C=u*m-d*x,I=u*f-p*x,F=d*f-p*m,N=M*F-T*I+y*C+E*R-w*v+S*_;if(N===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let U=1/N;return e[0]=(c*F-o*I+h*C)*U,e[1]=(i*I-n*F-s*C)*U,e[2]=(x*S-m*w+f*E)*U,e[3]=(d*w-u*S-p*E)*U,e[4]=(o*R-a*F-h*v)*U,e[5]=(t*F-i*R+s*v)*U,e[6]=(m*y-g*S-f*T)*U,e[7]=(l*S-d*y+p*T)*U,e[8]=(a*I-c*R+h*_)*U,e[9]=(n*R-t*I-s*_)*U,e[10]=(g*w-x*y+f*M)*U,e[11]=(u*y-l*w-p*M)*U,e[12]=(c*v-a*C-o*_)*U,e[13]=(t*C-n*v+i*_)*U,e[14]=(x*T-g*E-m*M)*U,e[15]=(l*E-u*T+d*M)*U,this}scale(e){let t=this.elements,n=e.x,i=e.y,s=e.z;return t[0]*=n,t[4]*=i,t[8]*=s,t[1]*=n,t[5]*=i,t[9]*=s,t[2]*=n,t[6]*=i,t[10]*=s,t[3]*=n,t[7]*=i,t[11]*=s,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],i=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,i))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),i=Math.sin(t),s=1-n,a=e.x,c=e.y,o=e.z,h=s*a,l=s*c;return this.set(h*a+n,h*c-i*o,h*o+i*c,0,h*c+i*o,l*c+n,l*o-i*a,0,h*o-i*c,l*o+i*a,s*o*o+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,i,s,a){return this.set(1,n,s,0,e,1,a,0,t,i,1,0,0,0,0,1),this}compose(e,t,n){let i=this.elements,s=t._x,a=t._y,c=t._z,o=t._w,h=s+s,l=a+a,u=c+c,d=s*h,p=s*l,g=s*u,x=a*l,m=a*u,f=c*u,M=o*h,T=o*l,y=o*u,E=n.x,w=n.y,S=n.z;return i[0]=(1-(x+f))*E,i[1]=(p+y)*E,i[2]=(g-T)*E,i[3]=0,i[4]=(p-y)*w,i[5]=(1-(d+f))*w,i[6]=(m+M)*w,i[7]=0,i[8]=(g+T)*S,i[9]=(m-M)*S,i[10]=(1-(d+x))*S,i[11]=0,i[12]=e.x,i[13]=e.y,i[14]=e.z,i[15]=1,this}decompose(e,t,n){let i=this.elements;e.x=i[12],e.y=i[13],e.z=i[14];let s=this.determinantAffine();if(s===0)return n.set(1,1,1),t.identity(),this;let a=ys.set(i[0],i[1],i[2]).length(),c=ys.set(i[4],i[5],i[6]).length(),o=ys.set(i[8],i[9],i[10]).length();s<0&&(a=-a),Cn.copy(this);let h=1/a,l=1/c,u=1/o;return Cn.elements[0]*=h,Cn.elements[1]*=h,Cn.elements[2]*=h,Cn.elements[4]*=l,Cn.elements[5]*=l,Cn.elements[6]*=l,Cn.elements[8]*=u,Cn.elements[9]*=u,Cn.elements[10]*=u,t.setFromRotationMatrix(Cn),n.x=a,n.y=c,n.z=o,this}makePerspective(e,t,n,i,s,a,c=Dn,o=!1){let h=this.elements,l=2*s/(t-e),u=2*s/(n-i),d=(t+e)/(t-e),p=(n+i)/(n-i),g,x;if(o)g=s/(a-s),x=a*s/(a-s);else if(c===Dn)g=-(a+s)/(a-s),x=-2*a*s/(a-s);else if(c===Bs)g=-a/(a-s),x=-a*s/(a-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+c);return h[0]=l,h[4]=0,h[8]=d,h[12]=0,h[1]=0,h[5]=u,h[9]=p,h[13]=0,h[2]=0,h[6]=0,h[10]=g,h[14]=x,h[3]=0,h[7]=0,h[11]=-1,h[15]=0,this}makeOrthographic(e,t,n,i,s,a,c=Dn,o=!1){let h=this.elements,l=2/(t-e),u=2/(n-i),d=-(t+e)/(t-e),p=-(n+i)/(n-i),g,x;if(o)g=1/(a-s),x=a/(a-s);else if(c===Dn)g=-2/(a-s),x=-(a+s)/(a-s);else if(c===Bs)g=-1/(a-s),x=-s/(a-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+c);return h[0]=l,h[4]=0,h[8]=0,h[12]=d,h[1]=0,h[5]=u,h[9]=0,h[13]=p,h[2]=0,h[6]=0,h[10]=g,h[14]=x,h[3]=0,h[7]=0,h[11]=0,h[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let i=0;i<16;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},ys=new L,Cn=new Fe,yp=new L(0,0,0),vp=new L(1,1,1),Ti=new L,Ta=new L,un=new L,yu=new Fe,vu=new Rt,an=class r{constructor(e=0,t=0,n=0,i=r.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,i=this._order){return this._x=e,this._y=t,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let i=e.elements,s=i[0],a=i[4],c=i[8],o=i[1],h=i[5],l=i[9],u=i[2],d=i[6],p=i[10];switch(t){case"XYZ":this._y=Math.asin(Qe(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-l,p),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(d,h),this._z=0);break;case"YXZ":this._x=Math.asin(-Qe(l,-1,1)),Math.abs(l)<.9999999?(this._y=Math.atan2(c,p),this._z=Math.atan2(o,h)):(this._y=Math.atan2(-u,s),this._z=0);break;case"ZXY":this._x=Math.asin(Qe(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,p),this._z=Math.atan2(-a,h)):(this._y=0,this._z=Math.atan2(o,s));break;case"ZYX":this._y=Math.asin(-Qe(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,p),this._z=Math.atan2(o,s)):(this._x=0,this._z=Math.atan2(-a,h));break;case"YZX":this._z=Math.asin(Qe(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-l,h),this._y=Math.atan2(-u,s)):(this._x=0,this._y=Math.atan2(c,p));break;case"XZY":this._z=Math.asin(-Qe(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,h),this._y=Math.atan2(c,s)):(this._x=Math.atan2(-l,p),this._y=0);break;default:Le("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return yu.makeRotationFromQuaternion(e),this.setFromRotationMatrix(yu,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return vu.setFromEuler(this),this.setFromQuaternion(vu,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};an.DEFAULT_ORDER="XYZ";var Vs=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},Mp=0,Mu=new L,vs=new Rt,si=new Fe,wa=new L,mr=new L,bp=new L,Ep=new Rt,bu=new L(1,0,0),Eu=new L(0,1,0),Su=new L(0,0,1),Tu={type:"added"},Sp={type:"removed"},Ms={type:"childadded",child:null},$c={type:"childremoved",child:null},At=class r extends Un{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Mp++}),this.uuid=En(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=r.DEFAULT_UP.clone();let e=new L,t=new an,n=new Rt,i=new L(1,1,1);function s(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(s),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new Fe},normalMatrix:{value:new Xe}}),this.matrix=new Fe,this.matrixWorld=new Fe,this.matrixAutoUpdate=r.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=r.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Vs,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return vs.setFromAxisAngle(e,t),this.quaternion.multiply(vs),this}rotateOnWorldAxis(e,t){return vs.setFromAxisAngle(e,t),this.quaternion.premultiply(vs),this}rotateX(e){return this.rotateOnAxis(bu,e)}rotateY(e){return this.rotateOnAxis(Eu,e)}rotateZ(e){return this.rotateOnAxis(Su,e)}translateOnAxis(e,t){return Mu.copy(e).applyQuaternion(this.quaternion),this.position.add(Mu.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(bu,e)}translateY(e){return this.translateOnAxis(Eu,e)}translateZ(e){return this.translateOnAxis(Su,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(si.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?wa.copy(e):wa.set(e,t,n);let i=this.parent;this.updateWorldMatrix(!0,!1),mr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?si.lookAt(mr,wa,this.up):si.lookAt(wa,mr,this.up),this.quaternion.setFromRotationMatrix(si),i&&(si.extractRotation(i.matrixWorld),vs.setFromRotationMatrix(si),this.quaternion.premultiply(vs.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(He("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Tu),Ms.child=e,this.dispatchEvent(Ms),Ms.child=null):He("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Sp),$c.child=e,this.dispatchEvent($c),$c.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),si.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),si.multiply(e.parent.matrixWorld)),e.applyMatrix4(si),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Tu),Ms.child=e,this.dispatchEvent(Ms),Ms.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,i=this.children.length;n<i;n++){let a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let i=this.children;for(let s=0,a=i.length;s<a;s++)i[s].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(mr,e,bp),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(mr,Ep,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);let t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,n=e.y,i=e.z,s=this.matrix.elements;s[12]+=t-s[0]*t-s[4]*n-s[8]*i,s[13]+=n-s[1]*t-s[5]*n-s[9]*i,s[14]+=i-s[2]*t-s[6]*n-s[10]*i}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){let i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){let s=this.children;for(let a=0,c=s.length;a<c;a++)s[a].updateWorldMatrix(!1,!0,n)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let i={};i.uuid=this.uuid,i.type=this.type,i.name=this.name,i.castShadow=this.castShadow,i.receiveShadow=this.receiveShadow,i.visible=this.visible,i.frustumCulled=this.frustumCulled,i.renderOrder=this.renderOrder,i.static=this.static,i.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.pivot!==null&&(i.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(i.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(i.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.geometryInfo=this._geometryInfo.map(c=>({...c,boundingBox:c.boundingBox?c.boundingBox.toJSON():void 0,boundingSphere:c.boundingSphere?c.boundingSphere.toJSON():void 0})),i.instanceInfo=this._instanceInfo.map(c=>({...c})),i.availableInstanceIds=this._availableInstanceIds.slice(),i.availableGeometryIds=this._availableGeometryIds.slice(),i.nextIndexStart=this._nextIndexStart,i.nextVertexStart=this._nextVertexStart,i.geometryCount=this._geometryCount,i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.matricesTexture=this._matricesTexture.toJSON(e),i.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(i.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(i.boundingBox=this.boundingBox.toJSON()));function s(c,o){return c[o.uuid]===void 0&&(c[o.uuid]=o.toJSON(e)),o.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=s(e.geometries,this.geometry);let c=this.geometry.parameters;if(c!==void 0&&c.shapes!==void 0){let o=c.shapes;if(Array.isArray(o))for(let h=0,l=o.length;h<l;h++){let u=o[h];s(e.shapes,u)}else s(e.shapes,o)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let c=[];for(let o=0,h=this.material.length;o<h;o++)c.push(s(e.materials,this.material[o]));i.material=c}else i.material=s(e.materials,this.material);if(this.children.length>0){i.children=[];for(let c=0;c<this.children.length;c++)i.children.push(this.children[c].toJSON(e).object)}if(this.animations.length>0){i.animations=[];for(let c=0;c<this.animations.length;c++){let o=this.animations[c];i.animations.push(s(e.animations,o))}}if(t){let c=a(e.geometries),o=a(e.materials),h=a(e.textures),l=a(e.images),u=a(e.shapes),d=a(e.skeletons),p=a(e.animations),g=a(e.nodes);c.length>0&&(n.geometries=c),o.length>0&&(n.materials=o),h.length>0&&(n.textures=h),l.length>0&&(n.images=l),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),p.length>0&&(n.animations=p),g.length>0&&(n.nodes=g)}return n.object=i,n;function a(c){let o=[];for(let h in c){let l=c[h];delete l.metadata,o.push(l)}return o}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let i=e.children[n];this.add(i.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}};At.DEFAULT_UP=new L(0,1,0);At.DEFAULT_MATRIX_AUTO_UPDATE=!0;At.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Je=class extends At{constructor(){super(),this.isGroup=!0,this.type="Group"}},Tp={type:"move"},Ws=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Je,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Je,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new L,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new L),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Je,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new L,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new L,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let i=null,s=null,a=null,c=this._targetRay,o=this._grip,h=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(h&&e.hand){a=!0;for(let x of e.hand.values()){let m=t.getJointPose(x,n),f=this._getHandJoint(h,x);m!==null&&(f.matrix.fromArray(m.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=m.radius),f.visible=m!==null}let l=h.joints["index-finger-tip"],u=h.joints["thumb-tip"],d=l.position.distanceTo(u.position),p=.02,g=.005;h.inputState.pinching&&d>p+g?(h.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!h.inputState.pinching&&d<=p-g&&(h.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else o!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,n),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,o.eventsEnabled&&o.dispatchEvent({type:"gripUpdated",data:e,target:this})));c!==null&&(i=t.getPose(e.targetRaySpace,n),i===null&&s!==null&&(i=s),i!==null&&(c.matrix.fromArray(i.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,i.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(i.linearVelocity)):c.hasLinearVelocity=!1,i.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(i.angularVelocity)):c.hasAngularVelocity=!1,this.dispatchEvent(Tp)))}return c!==null&&(c.visible=i!==null),o!==null&&(o.visible=s!==null),h!==null&&(h.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new Je;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},Xd={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},wi={h:0,s:0,l:0},Aa={h:0,s:0,l:0};function jc(r,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?r+(e-r)*6*t:t<1/2?e:t<2/3?r+(e-r)*6*(2/3-t):r}var Ae=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let i=e;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=mt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,je.colorSpaceToWorking(this,t),this}setRGB(e,t,n,i=je.workingColorSpace){return this.r=e,this.g=t,this.b=n,je.colorSpaceToWorking(this,i),this}setHSL(e,t,n,i=je.workingColorSpace){if(e=ih(e,1),t=Qe(t,0,1),n=Qe(n,0,1),t===0)this.r=this.g=this.b=n;else{let s=n<=.5?n*(1+t):n+t-n*t,a=2*n-s;this.r=jc(a,s,e+1/3),this.g=jc(a,s,e),this.b=jc(a,s,e-1/3)}return je.colorSpaceToWorking(this,i),this}setStyle(e,t=mt){function n(s){s!==void 0&&parseFloat(s)<1&&Le("Color: Alpha component of "+e+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(e)){let s,a=i[1],c=i[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(c))return n(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(c))return n(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(c))return n(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:Le("Color: Unknown color model "+e)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(e)){let s=i[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(s,16),t);Le("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=mt){let n=Xd[e.toLowerCase()];return n!==void 0?this.setHex(n,t):Le("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=ui(e.r),this.g=ui(e.g),this.b=ui(e.b),this}copyLinearToSRGB(e){return this.r=zs(e.r),this.g=zs(e.g),this.b=zs(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=mt){return je.workingToColorSpace(Jt.copy(this),e),Math.round(Qe(Jt.r*255,0,255))*65536+Math.round(Qe(Jt.g*255,0,255))*256+Math.round(Qe(Jt.b*255,0,255))}getHexString(e=mt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=je.workingColorSpace){je.workingToColorSpace(Jt.copy(this),t);let n=Jt.r,i=Jt.g,s=Jt.b,a=Math.max(n,i,s),c=Math.min(n,i,s),o,h,l=(c+a)/2;if(c===a)o=0,h=0;else{let u=a-c;switch(h=l<=.5?u/(a+c):u/(2-a-c),a){case n:o=(i-s)/u+(i<s?6:0);break;case i:o=(s-n)/u+2;break;case s:o=(n-i)/u+4;break}o/=6}return e.h=o,e.s=h,e.l=l,e}getRGB(e,t=je.workingColorSpace){return je.workingToColorSpace(Jt.copy(this),t),e.r=Jt.r,e.g=Jt.g,e.b=Jt.b,e}getStyle(e=mt){je.workingToColorSpace(Jt.copy(this),e);let t=Jt.r,n=Jt.g,i=Jt.b;return e!==mt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(e,t,n){return this.getHSL(wi),this.setHSL(wi.h+e,wi.s+t,wi.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(wi),e.getHSL(Aa);let n=Rr(wi.h,Aa.h,t),i=Rr(wi.s,Aa.s,t),s=Rr(wi.l,Aa.l,t);return this.setHSL(n,i,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,i=this.b,s=e.elements;return this.r=s[0]*t+s[3]*n+s[6]*i,this.g=s[1]*t+s[4]*n+s[7]*i,this.b=s[2]*t+s[5]*n+s[8]*i,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Jt=new Ae;Ae.NAMES=Xd;var Pi=class r{constructor(e,t=1,n=1e3){this.isFog=!0,this.name="",this.color=new Ae(e),this.near=t,this.far=n}clone(){return new r(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},Ur=class extends At{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new an,this.environmentIntensity=1,this.environmentRotation=new an,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}},In=new L,ri=new L,Qc=new L,ai=new L,bs=new L,Es=new L,wu=new L,el=new L,tl=new L,nl=new L,il=new gt,sl=new gt,rl=new gt,hi=class r{constructor(e=new L,t=new L,n=new L){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,i){i.subVectors(n,t),In.subVectors(e,t),i.cross(In);let s=i.lengthSq();return s>0?i.multiplyScalar(1/Math.sqrt(s)):i.set(0,0,0)}static getBarycoord(e,t,n,i,s){In.subVectors(i,t),ri.subVectors(n,t),Qc.subVectors(e,t);let a=In.dot(In),c=In.dot(ri),o=In.dot(Qc),h=ri.dot(ri),l=ri.dot(Qc),u=a*h-c*c;if(u===0)return s.set(0,0,0),null;let d=1/u,p=(h*o-c*l)*d,g=(a*l-c*o)*d;return s.set(1-p-g,g,p)}static containsPoint(e,t,n,i){return this.getBarycoord(e,t,n,i,ai)===null?!1:ai.x>=0&&ai.y>=0&&ai.x+ai.y<=1}static getInterpolation(e,t,n,i,s,a,c,o){return this.getBarycoord(e,t,n,i,ai)===null?(o.x=0,o.y=0,"z"in o&&(o.z=0),"w"in o&&(o.w=0),null):(o.setScalar(0),o.addScaledVector(s,ai.x),o.addScaledVector(a,ai.y),o.addScaledVector(c,ai.z),o)}static getInterpolatedAttribute(e,t,n,i,s,a){return il.setScalar(0),sl.setScalar(0),rl.setScalar(0),il.fromBufferAttribute(e,t),sl.fromBufferAttribute(e,n),rl.fromBufferAttribute(e,i),a.setScalar(0),a.addScaledVector(il,s.x),a.addScaledVector(sl,s.y),a.addScaledVector(rl,s.z),a}static isFrontFacing(e,t,n,i){return In.subVectors(n,t),ri.subVectors(e,t),In.cross(ri).dot(i)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,i){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[i]),this}setFromAttributeAndIndices(e,t,n,i){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return In.subVectors(this.c,this.b),ri.subVectors(this.a,this.b),In.cross(ri).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return r.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return r.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,i,s){return r.getInterpolation(e,this.a,this.b,this.c,t,n,i,s)}containsPoint(e){return r.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return r.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,i=this.b,s=this.c,a,c;bs.subVectors(i,n),Es.subVectors(s,n),el.subVectors(e,n);let o=bs.dot(el),h=Es.dot(el);if(o<=0&&h<=0)return t.copy(n);tl.subVectors(e,i);let l=bs.dot(tl),u=Es.dot(tl);if(l>=0&&u<=l)return t.copy(i);let d=o*u-l*h;if(d<=0&&o>=0&&l<=0)return a=o/(o-l),t.copy(n).addScaledVector(bs,a);nl.subVectors(e,s);let p=bs.dot(nl),g=Es.dot(nl);if(g>=0&&p<=g)return t.copy(s);let x=p*h-o*g;if(x<=0&&h>=0&&g<=0)return c=h/(h-g),t.copy(n).addScaledVector(Es,c);let m=l*g-p*u;if(m<=0&&u-l>=0&&p-g>=0)return wu.subVectors(s,i),c=(u-l)/(u-l+(p-g)),t.copy(i).addScaledVector(wu,c);let f=1/(m+x+d);return a=x*f,c=d*f,t.copy(n).addScaledVector(bs,a).addScaledVector(Es,c)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},tn=class{constructor(e=new L(1/0,1/0,1/0),t=new L(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Pn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Pn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=Pn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let s=n.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let a=0,c=s.count;a<c;a++)e.isMesh===!0?e.getVertexPosition(a,Pn):Pn.fromBufferAttribute(s,a),Pn.applyMatrix4(e.matrixWorld),this.expandByPoint(Pn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Ra.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Ra.copy(n.boundingBox)),Ra.applyMatrix4(e.matrixWorld),this.union(Ra)}let i=e.children;for(let s=0,a=i.length;s<a;s++)this.expandByObject(i[s],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Pn),Pn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(gr),Ca.subVectors(this.max,gr),Ss.subVectors(e.a,gr),Ts.subVectors(e.b,gr),ws.subVectors(e.c,gr),Ai.subVectors(Ts,Ss),Ri.subVectors(ws,Ts),Yi.subVectors(Ss,ws);let t=[0,-Ai.z,Ai.y,0,-Ri.z,Ri.y,0,-Yi.z,Yi.y,Ai.z,0,-Ai.x,Ri.z,0,-Ri.x,Yi.z,0,-Yi.x,-Ai.y,Ai.x,0,-Ri.y,Ri.x,0,-Yi.y,Yi.x,0];return!al(t,Ss,Ts,ws,Ca)||(t=[1,0,0,0,1,0,0,0,1],!al(t,Ss,Ts,ws,Ca))?!1:(Ia.crossVectors(Ai,Ri),t=[Ia.x,Ia.y,Ia.z],al(t,Ss,Ts,ws,Ca))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Pn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Pn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(oi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),oi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),oi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),oi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),oi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),oi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),oi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),oi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(oi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},oi=[new L,new L,new L,new L,new L,new L,new L,new L],Pn=new L,Ra=new tn,Ss=new L,Ts=new L,ws=new L,Ai=new L,Ri=new L,Yi=new L,gr=new L,Ca=new L,Ia=new L,Zi=new L;function al(r,e,t,n,i){for(let s=0,a=r.length-3;s<=a;s+=3){Zi.fromArray(r,s);let c=i.x*Math.abs(Zi.x)+i.y*Math.abs(Zi.y)+i.z*Math.abs(Zi.z),o=e.dot(Zi),h=t.dot(Zi),l=n.dot(Zi);if(Math.max(-Math.max(o,h,l),Math.min(o,h,l))>c)return!1}return!0}var Ft=new L,Pa=new ae,wp=0,Pt=class extends Un{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:wp++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=th,this.updateRanges=[],this.gpuType=gn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let i=0,s=this.itemSize;i<s;i++)this.array[e+i]=t.array[n+i];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Pa.fromBufferAttribute(this,t),Pa.applyMatrix3(e),this.setXY(t,Pa.x,Pa.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Ft.fromBufferAttribute(this,t),Ft.applyMatrix3(e),this.setXYZ(t,Ft.x,Ft.y,Ft.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Ft.fromBufferAttribute(this,t),Ft.applyMatrix4(e),this.setXYZ(t,Ft.x,Ft.y,Ft.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Ft.fromBufferAttribute(this,t),Ft.applyNormalMatrix(e),this.setXYZ(t,Ft.x,Ft.y,Ft.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Ft.fromBufferAttribute(this,t),Ft.transformDirection(e),this.setXYZ(t,Ft.x,Ft.y,Ft.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Nn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=pt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Nn(t,this.array)),t}setX(e,t){return this.normalized&&(t=pt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Nn(t,this.array)),t}setY(e,t){return this.normalized&&(t=pt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Nn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=pt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Nn(t,this.array)),t}setW(e,t){return this.normalized&&(t=pt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=pt(t,this.array),n=pt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,i){return e*=this.itemSize,this.normalized&&(t=pt(t,this.array),n=pt(n,this.array),i=pt(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this}setXYZW(e,t,n,i,s){return e*=this.itemSize,this.normalized&&(t=pt(t,this.array),n=pt(n,this.array),i=pt(i,this.array),s=pt(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}};var zr=class extends Pt{constructor(e,t,n){super(new Uint16Array(e),t,n)}};var Fr=class extends Pt{constructor(e,t,n){super(new Uint32Array(e),t,n)}};var Ye=class extends Pt{constructor(e,t,n){super(new Float32Array(e),t,n)}},Ap=new tn,xr=new L,ol=new L,on=class{constructor(e=new L,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):Ap.setFromPoints(e).getCenter(n);let i=0;for(let s=0,a=e.length;s<a;s++)i=Math.max(i,n.distanceToSquared(e[s]));return this.radius=Math.sqrt(i),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;xr.subVectors(e,this.center);let t=xr.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),i=(n-this.radius)*.5;this.center.addScaledVector(xr,i/n),this.radius+=i}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(ol.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(xr.copy(e.center).add(ol)),this.expandByPoint(xr.copy(e.center).sub(ol))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},Rp=0,Mn=new Fe,cl=new At,As=new L,dn=new tn,_r=new tn,Vt=new L,xt=class r extends Un{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Rp++}),this.uuid=En(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(jf(e)?Fr:zr)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let s=new Xe().getNormalMatrix(e);n.applyNormalMatrix(s),n.needsUpdate=!0}let i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(e),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return Mn.makeRotationFromQuaternion(e),this.applyMatrix4(Mn),this}rotateX(e){return Mn.makeRotationX(e),this.applyMatrix4(Mn),this}rotateY(e){return Mn.makeRotationY(e),this.applyMatrix4(Mn),this}rotateZ(e){return Mn.makeRotationZ(e),this.applyMatrix4(Mn),this}translate(e,t,n){return Mn.makeTranslation(e,t,n),this.applyMatrix4(Mn),this}scale(e,t,n){return Mn.makeScale(e,t,n),this.applyMatrix4(Mn),this}lookAt(e){return cl.lookAt(e),cl.updateMatrix(),this.applyMatrix4(cl.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(As).negate(),this.translate(As.x,As.y,As.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let i=0,s=e.length;i<s;i++){let a=e[i];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new Ye(n,3))}else{let n=Math.min(e.length,t.count);for(let i=0;i<n;i++){let s=e[i];t.setXYZ(i,s.x,s.y,s.z||0)}e.length>t.count&&Le("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new tn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){He("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new L(-1/0,-1/0,-1/0),new L(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,i=t.length;n<i;n++){let s=t[n];dn.setFromBufferAttribute(s),this.morphTargetsRelative?(Vt.addVectors(this.boundingBox.min,dn.min),this.boundingBox.expandByPoint(Vt),Vt.addVectors(this.boundingBox.max,dn.max),this.boundingBox.expandByPoint(Vt)):(this.boundingBox.expandByPoint(dn.min),this.boundingBox.expandByPoint(dn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&He('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new on);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){He("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new L,1/0);return}if(e){let n=this.boundingSphere.center;if(dn.setFromBufferAttribute(e),t)for(let s=0,a=t.length;s<a;s++){let c=t[s];_r.setFromBufferAttribute(c),this.morphTargetsRelative?(Vt.addVectors(dn.min,_r.min),dn.expandByPoint(Vt),Vt.addVectors(dn.max,_r.max),dn.expandByPoint(Vt)):(dn.expandByPoint(_r.min),dn.expandByPoint(_r.max))}dn.getCenter(n);let i=0;for(let s=0,a=e.count;s<a;s++)Vt.fromBufferAttribute(e,s),i=Math.max(i,n.distanceToSquared(Vt));if(t)for(let s=0,a=t.length;s<a;s++){let c=t[s],o=this.morphTargetsRelative;for(let h=0,l=c.count;h<l;h++)Vt.fromBufferAttribute(c,h),o&&(As.fromBufferAttribute(e,h),Vt.add(As)),i=Math.max(i,n.distanceToSquared(Vt))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&He('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){He("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.position,i=t.normal,s=t.uv,a=this.getAttribute("tangent");(a===void 0||a.count!==n.count)&&(a=new Pt(new Float32Array(4*n.count),4),this.setAttribute("tangent",a));let c=[],o=[];for(let _=0;_<n.count;_++)c[_]=new L,o[_]=new L;let h=new L,l=new L,u=new L,d=new ae,p=new ae,g=new ae,x=new L,m=new L;function f(_,v,R){h.fromBufferAttribute(n,_),l.fromBufferAttribute(n,v),u.fromBufferAttribute(n,R),d.fromBufferAttribute(s,_),p.fromBufferAttribute(s,v),g.fromBufferAttribute(s,R),l.sub(h),u.sub(h),p.sub(d),g.sub(d);let C=1/(p.x*g.y-g.x*p.y);isFinite(C)&&(x.copy(l).multiplyScalar(g.y).addScaledVector(u,-p.y).multiplyScalar(C),m.copy(u).multiplyScalar(p.x).addScaledVector(l,-g.x).multiplyScalar(C),c[_].add(x),c[v].add(x),c[R].add(x),o[_].add(m),o[v].add(m),o[R].add(m))}let M=this.groups;M.length===0&&(M=[{start:0,count:e.count}]);for(let _=0,v=M.length;_<v;++_){let R=M[_],C=R.start,I=R.count;for(let F=C,N=C+I;F<N;F+=3)f(e.getX(F+0),e.getX(F+1),e.getX(F+2))}let T=new L,y=new L,E=new L,w=new L;function S(_){E.fromBufferAttribute(i,_),w.copy(E);let v=c[_];T.copy(v),T.sub(E.multiplyScalar(E.dot(v))).normalize(),y.crossVectors(w,v);let C=y.dot(o[_])<0?-1:1;a.setXYZW(_,T.x,T.y,T.z,C)}for(let _=0,v=M.length;_<v;++_){let R=M[_],C=R.start,I=R.count;for(let F=C,N=C+I;F<N;F+=3)S(e.getX(F+0)),S(e.getX(F+1)),S(e.getX(F+2))}this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==t.count)n=new Pt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let d=0,p=n.count;d<p;d++)n.setXYZ(d,0,0,0);let i=new L,s=new L,a=new L,c=new L,o=new L,h=new L,l=new L,u=new L;if(e)for(let d=0,p=e.count;d<p;d+=3){let g=e.getX(d+0),x=e.getX(d+1),m=e.getX(d+2);i.fromBufferAttribute(t,g),s.fromBufferAttribute(t,x),a.fromBufferAttribute(t,m),l.subVectors(a,s),u.subVectors(i,s),l.cross(u),c.fromBufferAttribute(n,g),o.fromBufferAttribute(n,x),h.fromBufferAttribute(n,m),c.add(l),o.add(l),h.add(l),n.setXYZ(g,c.x,c.y,c.z),n.setXYZ(x,o.x,o.y,o.z),n.setXYZ(m,h.x,h.y,h.z)}else for(let d=0,p=t.count;d<p;d+=3)i.fromBufferAttribute(t,d+0),s.fromBufferAttribute(t,d+1),a.fromBufferAttribute(t,d+2),l.subVectors(a,s),u.subVectors(i,s),l.cross(u),n.setXYZ(d+0,l.x,l.y,l.z),n.setXYZ(d+1,l.x,l.y,l.z),n.setXYZ(d+2,l.x,l.y,l.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Vt.fromBufferAttribute(e,t),Vt.normalize(),e.setXYZ(t,Vt.x,Vt.y,Vt.z)}toNonIndexed(){function e(c,o){let h=c.array,l=c.itemSize,u=c.normalized,d=new h.constructor(o.length*l),p=0,g=0;for(let x=0,m=o.length;x<m;x++){c.isInterleavedBufferAttribute?p=o[x]*c.data.stride+c.offset:p=o[x]*l;for(let f=0;f<l;f++)d[g++]=h[p++]}return new Pt(d,l,u)}if(this.index===null)return Le("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new r,n=this.index.array,i=this.attributes;for(let c in i){let o=i[c],h=e(o,n);t.setAttribute(c,h)}let s=this.morphAttributes;for(let c in s){let o=[],h=s[c];for(let l=0,u=h.length;l<u;l++){let d=h[l],p=e(d,n);o.push(p)}t.morphAttributes[c]=o}t.morphTargetsRelative=this.morphTargetsRelative;let a=this.groups;for(let c=0,o=a.length;c<o;c++){let h=a[c];t.addGroup(h.start,h.count,h.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let o=this.parameters;for(let h in o)o[h]!==void 0&&(e[h]=o[h]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let o in n){let h=n[o];e.data.attributes[o]=h.toJSON(e.data)}let i={},s=!1;for(let o in this.morphAttributes){let h=this.morphAttributes[o],l=[];for(let u=0,d=h.length;u<d;u++){let p=h[u];l.push(p.toJSON(e.data))}l.length>0&&(i[o]=l,s=!0)}s&&(e.data.morphAttributes=i,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let c=this.boundingSphere;return c!==null&&(e.data.boundingSphere=c.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let i=e.attributes;for(let h in i){let l=i[h];this.setAttribute(h,l.clone(t))}let s=e.morphAttributes;for(let h in s){let l=[],u=s[h];for(let d=0,p=u.length;d<p;d++)l.push(u[d].clone(t));this.morphAttributes[h]=l}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let h=0,l=a.length;h<l;h++){let u=a[h];this.addGroup(u.start,u.count,u.materialIndex)}let c=e.boundingBox;c!==null&&(this.boundingBox=c.clone());let o=e.boundingSphere;return o!==null&&(this.boundingSphere=o.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}},ss=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=th,this.updateRanges=[],this.version=0,this.uuid=En()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let i=0,s=this.stride;i<s;i++)this.array[e+i]=t.array[n+i];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=En()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=En()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer)));let t={uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride};return t.usage=this.usage,t}},Qt=new L,Li=class r{constructor(e,t,n,i=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=i}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)Qt.fromBufferAttribute(this,t),Qt.applyMatrix4(e),this.setXYZ(t,Qt.x,Qt.y,Qt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Qt.fromBufferAttribute(this,t),Qt.applyNormalMatrix(e),this.setXYZ(t,Qt.x,Qt.y,Qt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Qt.fromBufferAttribute(this,t),Qt.transformDirection(e),this.setXYZ(t,Qt.x,Qt.y,Qt.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=Nn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=pt(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=pt(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=pt(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=pt(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=pt(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=Nn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=Nn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=Nn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=Nn(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=pt(t,this.array),n=pt(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=pt(t,this.array),n=pt(n,this.array),i=pt(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this}setXYZW(e,t,n,i,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=pt(t,this.array),n=pt(n,this.array),i=pt(i,this.array),s=pt(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this.data.array[e+3]=s,this}clone(e){if(e===void 0){Nr("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let i=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[i+s])}return new Pt(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new r(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){Nr("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let i=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[i+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},ll=new L,Cp=new L,Ip=new Xe,Ln=class{constructor(e=new L(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,i){return this.normal.set(e,t,n),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let i=ll.subVectors(n,t).cross(Cp.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){let i=e.delta(ll),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let a=-(e.start.dot(this.normal)+this.constant)/s;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(i,a)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||Ip.getNormalMatrix(e),i=this.coplanarPoint(ll).applyMatrix4(e),s=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}},Pp=0,nn=class extends Un{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Pp++}),this.uuid=En(),this.name="",this.type="Material",this.blending=nr,this.side=Jn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Ol,this.blendDst=Bl,this.blendEquation=hs,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ae(0,0,0),this.blendAlpha=0,this.depthFunc=Fs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Dd,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=no,this.stencilZFail=no,this.stencilZPass=no,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){Le(`Material: parameter '${t}' has value of undefined.`);continue}let i=this[t];if(i===void 0){Le(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector2&&n&&n.isVector2||i&&i.isEuler&&n&&n.isEuler||i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(s=>s.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(s){let a=[];for(let c in s){let o=s[c];delete o.metadata,a.push(o)}return a}if(t){let s=i(e.textures),a=i(e.images);s.length>0&&(n.textures=s),a.length>0&&(n.images=a)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new Ae().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(n=>new Ln().fromJSON(n))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let n=e.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new ae().fromArray(n)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new ae().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let i=t.length;n=new Array(i);for(let s=0;s!==i;++s)n[s]=t[s].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}},Wt=class extends nn{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Ae(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},Rs,yr=new L,Cs=new L,Is=new L,Ps=new ae,vr=new ae,qd=new Fe,La=new L,Mr=new L,Na=new L,Au=new ae,hl=new ae,Ru=new ae,Xt=class extends At{constructor(e=new Wt){if(super(),this.isSprite=!0,this.type="Sprite",Rs===void 0){Rs=new xt;let t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new ss(t,5);Rs.setIndex([0,1,2,0,2,3]),Rs.setAttribute("position",new Li(n,3,0,!1)),Rs.setAttribute("uv",new Li(n,2,3,!1))}this.geometry=Rs,this.material=e,this.center=new ae(.5,.5),this.count=1}intersectsFrustum(e){return e.intersectsSprite(this)}raycast(e,t){e.camera===null&&He('Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Cs.setFromMatrixScale(this.matrixWorld),qd.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),Is.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Cs.multiplyScalar(-Is.z);let n=this.material.rotation,i,s;n!==0&&(s=Math.cos(n),i=Math.sin(n));let a=this.center;Da(La.set(-.5,-.5,0),Is,a,Cs,i,s),Da(Mr.set(.5,-.5,0),Is,a,Cs,i,s),Da(Na.set(.5,.5,0),Is,a,Cs,i,s),Au.set(0,0),hl.set(1,0),Ru.set(1,1);let c=e.ray.intersectTriangle(La,Mr,Na,!1,yr);if(c===null&&(Da(Mr.set(-.5,.5,0),Is,a,Cs,i,s),hl.set(0,1),c=e.ray.intersectTriangle(La,Na,Mr,!1,yr),c===null))return;let o=e.ray.origin.distanceTo(yr);o<e.near||o>e.far||t.push({distance:o,point:yr.clone(),uv:hi.getInterpolation(yr,La,Mr,Na,Au,hl,Ru,new ae),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}};function Da(r,e,t,n,i,s){Ps.subVectors(r,t).addScalar(.5).multiply(n),i!==void 0?(vr.x=s*Ps.x-i*Ps.y,vr.y=i*Ps.x+s*Ps.y):vr.copy(Ps),r.copy(e),r.x+=vr.x,r.y+=vr.y,r.applyMatrix4(qd)}var ci=new L,ul=new L,Ua=new L,za=new L,Ni=class{constructor(e=new L,t=new L(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,ci)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=ci.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(ci.copy(this.origin).addScaledVector(this.direction,t),ci.distanceToSquared(e))}distanceSqToSegment(e,t,n,i){ul.copy(e).add(t).multiplyScalar(.5),Ua.copy(t).sub(e).normalize(),za.copy(this.origin).sub(ul);let s=e.distanceTo(t)*.5,a=-this.direction.dot(Ua),c=za.dot(this.direction),o=-za.dot(Ua),h=za.lengthSq(),l=Math.abs(1-a*a),u,d,p,g;if(l>0)if(u=a*o-c,d=a*c-o,g=s*l,u>=0)if(d>=-g)if(d<=g){let x=1/l;u*=x,d*=x,p=u*(u+a*d+2*c)+d*(a*u+d+2*o)+h}else d=s,u=Math.max(0,-(a*d+c)),p=-u*u+d*(d+2*o)+h;else d=-s,u=Math.max(0,-(a*d+c)),p=-u*u+d*(d+2*o)+h;else d<=-g?(u=Math.max(0,-(-a*s+c)),d=u>0?-s:Math.min(Math.max(-s,-o),s),p=-u*u+d*(d+2*o)+h):d<=g?(u=0,d=Math.min(Math.max(-s,-o),s),p=d*(d+2*o)+h):(u=Math.max(0,-(a*s+c)),d=u>0?s:Math.min(Math.max(-s,-o),s),p=-u*u+d*(d+2*o)+h);else d=a>0?-s:s,u=Math.max(0,-(a*d+c)),p=-u*u+d*(d+2*o)+h;return n&&n.copy(this.origin).addScaledVector(this.direction,u),i&&i.copy(ul).addScaledVector(Ua,d),p}intersectSphere(e,t){if(e.radius<0)return null;ci.subVectors(e.center,this.origin);let n=ci.dot(this.direction),i=ci.dot(ci)-n*n,s=e.radius*e.radius;if(i>s)return null;let a=Math.sqrt(s-i),c=n-a,o=n+a;return o<0?null:c<0?this.at(o,t):this.at(c,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,i,s,a,c,o,h=1/this.direction.x,l=1/this.direction.y,u=1/this.direction.z,d=this.origin;return h>=0?(n=(e.min.x-d.x)*h,i=(e.max.x-d.x)*h):(n=(e.max.x-d.x)*h,i=(e.min.x-d.x)*h),l>=0?(s=(e.min.y-d.y)*l,a=(e.max.y-d.y)*l):(s=(e.max.y-d.y)*l,a=(e.min.y-d.y)*l),n>a||s>i||((s>n||isNaN(n))&&(n=s),(a<i||isNaN(i))&&(i=a),u>=0?(c=(e.min.z-d.z)*u,o=(e.max.z-d.z)*u):(c=(e.max.z-d.z)*u,o=(e.min.z-d.z)*u),n>o||c>i)||((c>n||n!==n)&&(n=c),(o<i||i!==i)&&(i=o),i<0)?null:this.at(n>=0?n:i,t)}intersectsBox(e){return this.intersectBox(e,ci)!==null}intersectTriangle(e,t,n,i,s){let a=this.origin,c=this.direction,o=c.x,h=c.y,l=c.z,u=e.x-a.x,d=e.y-a.y,p=e.z-a.z,g=t.x-a.x,x=t.y-a.y,m=t.z-a.z,f=n.x-a.x,M=n.y-a.y,T=n.z-a.z,y=Math.abs(o),E=Math.abs(h),w=Math.abs(l),S,_,v,R,C,I,F,N,U,D,O,X;if(y>=E&&y>=w?(v=o,I=u,U=g,X=f,o>=0?(S=h,_=l,R=d,C=p,F=x,N=m,D=M,O=T):(S=l,_=h,R=p,C=d,F=m,N=x,D=T,O=M)):E>=w?(v=h,I=d,U=x,X=M,h>=0?(S=l,_=o,R=p,C=u,F=m,N=g,D=T,O=f):(S=o,_=l,R=u,C=p,F=g,N=m,D=f,O=T)):(v=l,I=p,U=m,X=T,l>=0?(S=o,_=h,R=u,C=d,F=g,N=x,D=f,O=M):(S=h,_=o,R=d,C=u,F=x,N=g,D=M,O=f)),v===0)return null;let k=S/v,Y=_/v,K=1/v,_e=R-k*I,Me=C-Y*I,ct=F-k*U,tt=N-Y*U,rt=D-k*X,Q=O-Y*X,ne=rt*tt-Q*ct,ye=_e*Q-Me*rt,Ge=ct*Me-tt*_e;if(i){if(ne<0||ye<0||Ge<0)return null}else if((ne<0||ye<0||Ge<0)&&(ne>0||ye>0||Ge>0))return null;let Se=ne+ye+Ge;if(Se===0)return null;let Ve=K*(ne*I+ye*U+Ge*X);return(Se>0?Ve<0:Ve>0)?null:this.at(Ve/Se,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},ot=class extends nn{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ae(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new an,this.combine=Hl,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},Cu=new Fe,Ki=new Ni,Fa=new on,Iu=new L,Oa=new L,Ba=new L,Ha=new L,dl=new L,ka=new L,Pu=new L,Ga=new L,J=class extends At{constructor(e=new xt,t=new ot){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=i.length;s<a;s++){let c=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[c]=s}}}}getVertexPosition(e,t){let n=this.geometry,i=n.attributes.position,s=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(i,e);let c=this.morphTargetInfluences;if(s&&c){ka.set(0,0,0);for(let o=0,h=s.length;o<h;o++){let l=c[o],u=s[o];l!==0&&(dl.fromBufferAttribute(u,e),a?ka.addScaledVector(dl,l):ka.addScaledVector(dl.sub(t),l))}t.add(ka)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,i=this.material,s=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Fa.copy(n.boundingSphere),Fa.applyMatrix4(s),Ki.copy(e.ray).recast(e.near),!(Fa.containsPoint(Ki.origin)===!1&&(Ki.intersectSphere(Fa,Iu)===null||Ki.origin.distanceToSquared(Iu)>(e.far-e.near)**2))&&(Cu.copy(s).invert(),Ki.copy(e.ray).applyMatrix4(Cu),!(n.boundingBox!==null&&Ki.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Ki)))}_computeIntersections(e,t,n){let i,s=this.geometry,a=this.material,c=s.index,o=s.attributes.position,h=s.attributes.uv,l=s.attributes.uv1,u=s.attributes.normal,d=s.groups,p=s.drawRange;if(c!==null)if(Array.isArray(a))for(let g=0,x=d.length;g<x;g++){let m=d[g],f=a[m.materialIndex],M=Math.max(m.start,p.start),T=Math.min(c.count,Math.min(m.start+m.count,p.start+p.count));for(let y=M,E=T;y<E;y+=3){let w=c.getX(y),S=c.getX(y+1),_=c.getX(y+2);i=Va(this,f,e,n,h,l,u,w,S,_),i&&(i.faceIndex=Math.floor(y/3),i.face.materialIndex=m.materialIndex,t.push(i))}}else{let g=Math.max(0,p.start),x=Math.min(c.count,p.start+p.count);for(let m=g,f=x;m<f;m+=3){let M=c.getX(m),T=c.getX(m+1),y=c.getX(m+2);i=Va(this,a,e,n,h,l,u,M,T,y),i&&(i.faceIndex=Math.floor(m/3),t.push(i))}}else if(o!==void 0)if(Array.isArray(a))for(let g=0,x=d.length;g<x;g++){let m=d[g],f=a[m.materialIndex],M=Math.max(m.start,p.start),T=Math.min(o.count,Math.min(m.start+m.count,p.start+p.count));for(let y=M,E=T;y<E;y+=3){let w=y,S=y+1,_=y+2;i=Va(this,f,e,n,h,l,u,w,S,_),i&&(i.faceIndex=Math.floor(y/3),i.face.materialIndex=m.materialIndex,t.push(i))}}else{let g=Math.max(0,p.start),x=Math.min(o.count,p.start+p.count);for(let m=g,f=x;m<f;m+=3){let M=m,T=m+1,y=m+2;i=Va(this,a,e,n,h,l,u,M,T,y),i&&(i.faceIndex=Math.floor(m/3),t.push(i))}}}};function Lp(r,e,t,n,i,s,a,c){let o;if(e.side===sn?o=n.intersectTriangle(a,s,i,!0,c):o=n.intersectTriangle(i,s,a,e.side===Jn,c),o===null)return null;Ga.copy(c),Ga.applyMatrix4(r.matrixWorld);let h=t.ray.origin.distanceTo(Ga);return h<t.near||h>t.far?null:{distance:h,point:Ga.clone(),object:r}}function Va(r,e,t,n,i,s,a,c,o,h){r.getVertexPosition(c,Oa),r.getVertexPosition(o,Ba),r.getVertexPosition(h,Ha);let l=Lp(r,e,t,n,Oa,Ba,Ha,Pu);if(l){let u=new L;hi.getBarycoord(Pu,Oa,Ba,Ha,u),i&&(l.uv=hi.getInterpolatedAttribute(i,c,o,h,u,new ae)),s&&(l.uv1=hi.getInterpolatedAttribute(s,c,o,h,u,new ae)),a&&(l.normal=hi.getInterpolatedAttribute(a,c,o,h,u,new L),l.normal.dot(n.direction)>0&&l.normal.multiplyScalar(-1));let d={a:c,b:o,c:h,normal:new L,materialIndex:0};hi.getNormal(Oa,Ba,Ha,d.normal),l.face=d,l.barycoord=u}return l}var br=new gt,Lu=new gt,Nu=new gt,Np=new gt,Du=new Fe,Wa=new L,fl=new on,Uu=new Fe,pl=new Ni,Or=class extends J{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=Ml,this.bindMatrix=new Fe,this.bindMatrixInverse=new Fe,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){let e=this.geometry;this.boundingBox===null&&(this.boundingBox=new tn),this.boundingBox.makeEmpty();let t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,Wa),this.boundingBox.expandByPoint(Wa)}computeBoundingSphere(){let e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new on),this.boundingSphere.makeEmpty();let t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,Wa),this.boundingSphere.expandByPoint(Wa)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){let n=this.material,i=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),fl.copy(this.boundingSphere),fl.applyMatrix4(i),e.ray.intersectsSphere(fl)!==!1&&(Uu.copy(i).invert(),pl.copy(e.ray).applyMatrix4(Uu),!(this.boundingBox!==null&&pl.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,pl)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){let e=new gt,t=this.geometry.attributes.skinWeight;for(let n=0,i=t.count;n<i;n++){e.fromBufferAttribute(t,n);let s=1/e.manhattanLength();s!==1/0?e.multiplyScalar(s):e.set(1,0,0,0),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===Ml?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===Cd?this.bindMatrixInverse.copy(this.bindMatrix).invert():Le("SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){let n=this.skeleton,i=this.geometry;Lu.fromBufferAttribute(i.attributes.skinIndex,e),Nu.fromBufferAttribute(i.attributes.skinWeight,e),t.isVector4?(br.copy(t),t.set(0,0,0,0)):(br.set(...t,1),t.set(0,0,0)),br.applyMatrix4(this.bindMatrix);for(let s=0;s<4;s++){let a=Nu.getComponent(s);if(a!==0){let c=Lu.getComponent(s);Du.multiplyMatrices(n.bones[c].matrixWorld,n.boneInverses[c]),t.addScaledVector(Np.copy(br).applyMatrix4(Du),a)}}return t.isVector4&&(t.w=br.w),t.applyMatrix4(this.bindMatrixInverse)}},Xs=class extends At{constructor(){super(),this.isBone=!0,this.type="Bone"}},qs=class extends Ht{constructor(e=null,t=1,n=1,i,s,a,c,o,h=Nt,l=Nt,u,d){super(null,a,c,o,h,l,i,s,u,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},zu=new Fe,Dp=new Fe,Br=class r{constructor(e=[],t=[]){this.uuid=En(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){let e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){Le("Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,i=this.bones.length;n<i;n++)this.boneInverses.push(new Fe)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){let n=new Fe;this.bones[e]&&n.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){let n=this.bones[e];n&&n.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){let n=this.bones[e];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){let e=this.bones,t=this.boneInverses,n=this.boneMatrices,i=this.boneTexture;for(let s=0,a=e.length;s<a;s++){let c=e[s]?e[s].matrixWorld:Dp;zu.multiplyMatrices(c,t[s]),zu.toArray(n,s*16)}i!==null&&(i.needsUpdate=!0)}clone(){return new r(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);let t=new Float32Array(e*e*4);t.set(this.boneMatrices);let n=new qs(t,e,e,xn,gn);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){let i=this.bones[t];if(i.name===e)return i}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,i=e.bones.length;n<i;n++){let s=e.bones[n],a=t[s];a===void 0&&(Le("Skeleton: No bone found with UUID:",s),a=new Xs),this.bones.push(a),this.boneInverses.push(new Fe().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){let e={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;let t=this.bones,n=this.boneInverses;for(let i=0,s=t.length;i<s;i++){let a=t[i];e.bones.push(a.uuid);let c=n[i];e.boneInverses.push(c.toArray())}return e}},di=class extends Pt{constructor(e,t,n,i=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},Ls=new Fe,Fu=new Fe,Xa=[],Ou=new tn,Up=new Fe,Er=new J,Sr=new on,qt=class extends J{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new di(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,Up)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new tn),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Ls),Ou.copy(e.boundingBox).applyMatrix4(Ls),this.boundingBox.union(Ou)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new on),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Ls),Sr.copy(e.boundingSphere).applyMatrix4(Ls),this.boundingSphere.union(Sr)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,i=this.morphTexture.source.data.data,s=n.length+1,a=e*s+1;for(let c=0;c<n.length;c++)n[c]=i[a+c]}raycast(e,t){let n=this.matrixWorld,i=this.count;if(Er.geometry=this.geometry,Er.material=this.material,Er.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Sr.copy(this.boundingSphere),Sr.applyMatrix4(n),e.ray.intersectsSphere(Sr)!==!1))for(let s=0;s<i;s++){this.getMatrixAt(s,Ls),Fu.multiplyMatrices(n,Ls),Er.matrixWorld=Fu,Er.raycast(e,Xa);for(let a=0,c=Xa.length;a<c;a++){let o=Xa[a];o.instanceId=s,o.object=this,t.push(o)}Xa.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new di(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){let n=t.morphTargetInfluences,i=n.length+1;this.morphTexture===null&&(this.morphTexture=new qs(new Float32Array(i*this.count),i,this.count,Wo,gn));let s=this.morphTexture.source.data.data,a=0;for(let h=0;h<n.length;h++)a+=n[h];let c=this.geometry.morphTargetsRelative?1:1-a,o=i*e;return s[o]=c,s.set(n,o+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},Ji=new on,zp=new ae(.5,.5),qa=new L,Ys=class{constructor(e=new Ln,t=new Ln,n=new Ln,i=new Ln,s=new Ln,a=new Ln){this.planes=[e,t,n,i,s,a]}set(e,t,n,i,s,a){let c=this.planes;return c[0].copy(e),c[1].copy(t),c[2].copy(n),c[3].copy(i),c[4].copy(s),c[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Dn,n=!1){let i=this.planes,s=e.elements,a=s[0],c=s[1],o=s[2],h=s[3],l=s[4],u=s[5],d=s[6],p=s[7],g=s[8],x=s[9],m=s[10],f=s[11],M=s[12],T=s[13],y=s[14],E=s[15];if(i[0].setComponents(h-a,p-l,f-g,E-M).normalize(),i[1].setComponents(h+a,p+l,f+g,E+M).normalize(),i[2].setComponents(h+c,p+u,f+x,E+T).normalize(),i[3].setComponents(h-c,p-u,f-x,E-T).normalize(),n)i[4].setComponents(o,d,m,y).normalize(),i[5].setComponents(h-o,p-d,f-m,E-y).normalize();else if(i[4].setComponents(h-o,p-d,f-m,E-y).normalize(),t===Dn)i[5].setComponents(h+o,p+d,f+m,E+y).normalize();else if(t===Bs)i[5].setComponents(o,d,m,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Ji.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Ji.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Ji)}intersectsSprite(e){Ji.center.set(0,0,0);let t=zp.distanceTo(e.center);return Ji.radius=.7071067811865476+t,Ji.applyMatrix4(e.matrixWorld),this.intersectsSphere(Ji)}intersectsSphere(e){let t=this.planes,n=e.center,i=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(n)<i)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let i=t[n];if(qa.x=i.normal.x>0?e.max.x:e.min.x,qa.y=i.normal.y>0?e.max.y:e.min.y,qa.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint(qa)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var Zs=class extends nn{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Ae(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},mo=new L,go=new L,Bu=new Fe,Tr=new Ni,Ya=new on,ml=new L,Hu=new L,rs=class extends At{constructor(e=new xt,t=new Zs){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let i=1,s=t.count;i<s;i++)mo.fromBufferAttribute(t,i-1),go.fromBufferAttribute(t,i),n[i]=n[i-1],n[i]+=mo.distanceTo(go);e.setAttribute("lineDistance",new Ye(n,1))}else Le("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,i=this.matrixWorld,s=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Ya.copy(n.boundingSphere),Ya.applyMatrix4(i),Ya.radius+=s,e.ray.intersectsSphere(Ya)===!1)return;Bu.copy(i).invert(),Tr.copy(e.ray).applyMatrix4(Bu);let c=s/((this.scale.x+this.scale.y+this.scale.z)/3),o=c*c,h=this.isLineSegments?2:1,l=n.index,d=n.attributes.position;if(l!==null){let p=Math.max(0,a.start),g=Math.min(l.count,a.start+a.count);for(let x=p,m=g-1;x<m;x+=h){let f=l.getX(x),M=l.getX(x+1),T=Za(this,e,Tr,o,f,M,x);T&&t.push(T)}if(this.isLineLoop){let x=l.getX(g-1),m=l.getX(p),f=Za(this,e,Tr,o,x,m,g-1);f&&t.push(f)}}else{let p=Math.max(0,a.start),g=Math.min(d.count,a.start+a.count);for(let x=p,m=g-1;x<m;x+=h){let f=Za(this,e,Tr,o,x,x+1,x);f&&t.push(f)}if(this.isLineLoop){let x=Za(this,e,Tr,o,g-1,p,g-1);x&&t.push(x)}}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=i.length;s<a;s++){let c=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[c]=s}}}}};function Za(r,e,t,n,i,s,a){let c=r.geometry.attributes.position;if(mo.fromBufferAttribute(c,i),go.fromBufferAttribute(c,s),t.distanceSqToSegment(mo,go,ml,Hu)>n)return;ml.applyMatrix4(r.matrixWorld);let h=e.ray.origin.distanceTo(ml);if(!(h<e.near||h>e.far))return{distance:h,point:Hu.clone().applyMatrix4(r.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:r}}var ku=new L,Gu=new L,Hr=class extends rs{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[];for(let i=0,s=t.count;i<s;i+=2)ku.fromBufferAttribute(t,i),Gu.fromBufferAttribute(t,i+1),n[i]=i===0?0:n[i-1],n[i+1]=n[i]+ku.distanceTo(Gu);e.setAttribute("lineDistance",new Ye(n,1))}else Le("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}},kr=class extends rs{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}},fi=class extends nn{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Ae(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},Vu=new Fe,El=new Ni,Ka=new on,Ja=new L,Di=class extends At{constructor(e=new xt,t=new fi){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,i=this.matrixWorld,s=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Ka.copy(n.boundingSphere),Ka.applyMatrix4(i),Ka.radius+=s,e.ray.intersectsSphere(Ka)===!1)return;Vu.copy(i).invert(),El.copy(e.ray).applyMatrix4(Vu);let c=s/((this.scale.x+this.scale.y+this.scale.z)/3),o=c*c,h=n.index,u=n.attributes.position;if(h!==null){let d=Math.max(0,a.start),p=Math.min(h.count,a.start+a.count);for(let g=d,x=p;g<x;g++){let m=h.getX(g);Ja.fromBufferAttribute(u,m),Wu(Ja,m,o,i,e,t,this)}}else{let d=Math.max(0,a.start),p=Math.min(u.count,a.start+a.count);for(let g=d,x=p;g<x;g++)Ja.fromBufferAttribute(u,g),Wu(Ja,g,o,i,e,t,this)}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=i.length;s<a;s++){let c=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[c]=s}}}}};function Wu(r,e,t,n,i,s,a){let c=El.distanceSqToPoint(r);if(c<t){let o=new L;El.closestPointToPoint(r,o),o.applyMatrix4(n);let h=i.ray.origin.distanceTo(o);if(h<i.near||h>i.far)return;s.push({distance:h,distanceToRay:Math.sqrt(c),point:o,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}var Gr=class extends Ht{constructor(e=[],t=Gi,n,i,s,a,c,o,h,l){super(e,t,n,i,s,a,c,o,h,l),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},Yt=class extends Ht{constructor(e,t,n,i,s,a,c,o,h){super(e,t,n,i,s,a,c,o,h),this.isCanvasTexture=!0,this.needsUpdate=!0}};var Ui=class extends Ht{constructor(e,t,n=Bn,i,s,a,c=Nt,o=Nt,h,l=qn,u=1){if(l!==qn&&l!==Vi)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let d={width:e,height:t,depth:u};super(d,i,s,a,c,o,l,n,h),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Gs(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}},xo=class extends Ui{constructor(e,t=Bn,n=Gi,i,s,a=Nt,c=Nt,o,h=qn){let l={width:e,height:e,depth:1},u=[l,l,l,l,l,l];super(e,e,t,n,i,s,a,c,o,h),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},Vr=class extends Ht{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},ke=class r extends xt{constructor(e=1,t=1,n=1,i=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:i,heightSegments:s,depthSegments:a};let c=this;i=Math.floor(i),s=Math.floor(s),a=Math.floor(a);let o=[],h=[],l=[],u=[],d=0,p=0;g("z","y","x",-1,-1,n,t,e,a,s,0),g("z","y","x",1,-1,n,t,-e,a,s,1),g("x","z","y",1,1,e,n,t,i,a,2),g("x","z","y",1,-1,e,n,-t,i,a,3),g("x","y","z",1,-1,e,t,n,i,s,4),g("x","y","z",-1,-1,e,t,-n,i,s,5),this.setIndex(o),this.setAttribute("position",new Ye(h,3)),this.setAttribute("normal",new Ye(l,3)),this.setAttribute("uv",new Ye(u,2));function g(x,m,f,M,T,y,E,w,S,_,v){let R=y/S,C=E/_,I=y/2,F=E/2,N=w/2,U=S+1,D=_+1,O=0,X=0,k=new L;for(let Y=0;Y<D;Y++){let K=Y*C-F;for(let _e=0;_e<U;_e++){let Me=_e*R-I;k[x]=Me*M,k[m]=K*T,k[f]=N,h.push(k.x,k.y,k.z),k[x]=0,k[m]=0,k[f]=w>0?1:-1,l.push(k.x,k.y,k.z),u.push(_e/S),u.push(1-Y/_),O+=1}}for(let Y=0;Y<_;Y++)for(let K=0;K<S;K++){let _e=d+K+U*Y,Me=d+K+U*(Y+1),ct=d+(K+1)+U*(Y+1),tt=d+(K+1)+U*Y;o.push(_e,Me,tt),o.push(Me,ct,tt),X+=6}c.addGroup(p,X,v),p+=X,d+=O}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};var Tn=class r extends xt{constructor(e=1,t=32,n=0,i=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:i},t=Math.max(3,t);let s=[],a=[],c=[],o=[],h=new L,l=new ae;a.push(0,0,0),c.push(0,0,1),o.push(.5,.5);for(let u=0,d=3;u<=t;u++,d+=3){let p=n+u/t*i;h.x=e*Math.cos(p),h.y=e*Math.sin(p),a.push(h.x,h.y,h.z),c.push(0,0,1),l.x=(a[d]/e+1)/2,l.y=(a[d+1]/e+1)/2,o.push(l.x,l.y)}for(let u=1;u<=t;u++)s.push(u,u+1,0);this.setIndex(s),this.setAttribute("position",new Ye(a,3)),this.setAttribute("normal",new Ye(c,3)),this.setAttribute("uv",new Ye(o,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.radius,e.segments,e.thetaStart,e.thetaLength)}},_t=class r extends xt{constructor(e=1,t=1,n=1,i=32,s=1,a=!1,c=0,o=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:i,heightSegments:s,openEnded:a,thetaStart:c,thetaLength:o};let h=this;i=Math.floor(i),s=Math.floor(s);let l=[],u=[],d=[],p=[],g=0,x=[],m=n/2,f=0;M(),a===!1&&(e>0&&T(!0),t>0&&T(!1)),this.setIndex(l),this.setAttribute("position",new Ye(u,3)),this.setAttribute("normal",new Ye(d,3)),this.setAttribute("uv",new Ye(p,2));function M(){let y=new L,E=new L,w=0,S=(t-e)/n;for(let _=0;_<=s;_++){let v=[],R=_/s,C=R*(t-e)+e;for(let I=0;I<=i;I++){let F=I/i,N=F*o+c,U=Math.sin(N),D=Math.cos(N);E.x=C*U,E.y=-R*n+m,E.z=C*D,u.push(E.x,E.y,E.z),y.set(U,S,D).normalize(),d.push(y.x,y.y,y.z),p.push(F,1-R),v.push(g++)}x.push(v)}for(let _=0;_<i;_++)for(let v=0;v<s;v++){let R=x[v][_],C=x[v+1][_],I=x[v+1][_+1],F=x[v][_+1];(e>0||v!==0)&&(l.push(R,C,F),w+=3),(t>0||v!==s-1)&&(l.push(C,I,F),w+=3)}h.addGroup(f,w,0),f+=w}function T(y){let E=g,w=new ae,S=new L,_=0,v=y===!0?e:t,R=y===!0?1:-1;for(let I=1;I<=i;I++)u.push(0,m*R,0),d.push(0,R,0),p.push(.5,.5),g++;let C=g;for(let I=0;I<=i;I++){let N=I/i*o+c,U=Math.cos(N),D=Math.sin(N);S.x=v*D,S.y=m*R,S.z=v*U,u.push(S.x,S.y,S.z),d.push(0,R,0),w.x=U*.5+.5,w.y=D*.5*R+.5,p.push(w.x,w.y),g++}for(let I=0;I<i;I++){let F=E+I,N=C+I;y===!0?l.push(N,N+1,F):l.push(N+1,N,F),_+=3}h.addGroup(f,_,y===!0?1:2),f+=_}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},Yn=class r extends _t{constructor(e=1,t=1,n=32,i=1,s=!1,a=0,c=Math.PI*2){super(0,e,t,n,i,s,a,c),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:i,openEnded:s,thetaStart:a,thetaLength:c}}static fromJSON(e){return new r(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},_o=class r extends xt{constructor(e=[],t=[],n=1,i=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:i};let s=[],a=[];c(i),h(n),l(),this.setAttribute("position",new Ye(s,3)),this.setAttribute("normal",new Ye(s.slice(),3)),this.setAttribute("uv",new Ye(a,2)),i===0?this.computeVertexNormals():this.normalizeNormals();function c(M){let T=new L,y=new L,E=new L;for(let w=0;w<t.length;w+=3)p(t[w+0],T),p(t[w+1],y),p(t[w+2],E),o(T,y,E,M)}function o(M,T,y,E){let w=E+1,S=[];for(let _=0;_<=w;_++){S[_]=[];let v=M.clone().lerp(y,_/w),R=T.clone().lerp(y,_/w),C=w-_;for(let I=0;I<=C;I++)I===0&&_===w?S[_][I]=v:S[_][I]=v.clone().lerp(R,I/C)}for(let _=0;_<w;_++)for(let v=0;v<2*(w-_)-1;v++){let R=Math.floor(v/2);v%2===0?(d(S[_][R+1]),d(S[_+1][R]),d(S[_][R])):(d(S[_][R+1]),d(S[_+1][R+1]),d(S[_+1][R]))}}function h(M){let T=new L;for(let y=0;y<s.length;y+=3)T.x=s[y+0],T.y=s[y+1],T.z=s[y+2],T.normalize().multiplyScalar(M),s[y+0]=T.x,s[y+1]=T.y,s[y+2]=T.z}function l(){let M=new L;for(let T=0;T<s.length;T+=3){M.x=s[T+0],M.y=s[T+1],M.z=s[T+2];let y=m(M)/2/Math.PI+.5,E=f(M)/Math.PI+.5;a.push(y,1-E)}g(),u()}function u(){for(let M=0;M<a.length;M+=6){let T=a[M+0],y=a[M+2],E=a[M+4],w=Math.max(T,y,E),S=Math.min(T,y,E);w>.9&&S<.1&&(T<.2&&(a[M+0]+=1),y<.2&&(a[M+2]+=1),E<.2&&(a[M+4]+=1))}}function d(M){s.push(M.x,M.y,M.z)}function p(M,T){let y=M*3;T.x=e[y+0],T.y=e[y+1],T.z=e[y+2]}function g(){let M=new L,T=new L,y=new L,E=new L,w=new ae,S=new ae,_=new ae;for(let v=0,R=0;v<s.length;v+=9,R+=6){M.set(s[v+0],s[v+1],s[v+2]),T.set(s[v+3],s[v+4],s[v+5]),y.set(s[v+6],s[v+7],s[v+8]),w.set(a[R+0],a[R+1]),S.set(a[R+2],a[R+3]),_.set(a[R+4],a[R+5]),E.copy(M).add(T).add(y).divideScalar(3);let C=m(E);x(w,R+0,M,C),x(S,R+2,T,C),x(_,R+4,y,C)}}function x(M,T,y,E){E<0&&M.x===1&&(a[T]=M.x-1),y.x===0&&y.z===0&&(a[T]=E/2/Math.PI+.5)}function m(M){return Math.atan2(M.z,-M.x)}function f(M){return Math.atan2(-M.y,Math.sqrt(M.x*M.x+M.z*M.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.vertices,e.indices,e.radius,e.detail)}};var fn=class{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){Le("Curve: .getPoint() not implemented.")}getPointAt(e,t){let n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],n,i=this.getPoint(0),s=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),s+=n.distanceTo(i),t.push(s),i=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){let n=this.getLengths(),i=0,s=n.length,a;t?a=t:a=e*n[s-1];let c=0,o=s-1,h;for(;c<=o;)if(i=Math.floor(c+(o-c)/2),h=n[i]-a,h<0)c=i+1;else if(h>0)o=i-1;else{o=i;break}if(i=o,n[i]===a)return i/(s-1);let l=n[i],d=n[i+1]-l,p=(a-l)/d;return(i+p)/(s-1)}getTangent(e,t){let i=e-1e-4,s=e+1e-4;i<0&&(i=0),s>1&&(s=1);let a=this.getPoint(i),c=this.getPoint(s),o=t||(a.isVector2?new ae:new L);return o.copy(c).sub(a).normalize(),o}getTangentAt(e,t){let n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){let n=new L,i=[],s=[],a=[],c=new L,o=new Fe;for(let p=0;p<=e;p++){let g=p/e;i[p]=this.getTangentAt(g,new L)}s[0]=new L,a[0]=new L;let h=Number.MAX_VALUE,l=Math.abs(i[0].x),u=Math.abs(i[0].y),d=Math.abs(i[0].z);l<=h&&(h=l,n.set(1,0,0)),u<=h&&(h=u,n.set(0,1,0)),d<=h&&n.set(0,0,1),c.crossVectors(i[0],n).normalize(),s[0].crossVectors(i[0],c),a[0].crossVectors(i[0],s[0]);for(let p=1;p<=e;p++){if(s[p]=s[p-1].clone(),a[p]=a[p-1].clone(),c.crossVectors(i[p-1],i[p]),c.length()>Number.EPSILON){c.normalize();let g=Math.acos(Qe(i[p-1].dot(i[p]),-1,1));s[p].applyMatrix4(o.makeRotationAxis(c,g))}a[p].crossVectors(i[p],s[p])}if(t===!0){let p=Math.acos(Qe(s[0].dot(s[e]),-1,1));p/=e,i[0].dot(c.crossVectors(s[0],s[e]))>0&&(p=-p);for(let g=1;g<=e;g++)s[g].applyMatrix4(o.makeRotationAxis(i[g],p*g)),a[g].crossVectors(i[g],s[g])}return{tangents:i,normals:s,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},Ks=class extends fn{constructor(e=0,t=0,n=1,i=1,s=0,a=Math.PI*2,c=!1,o=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=i,this.aStartAngle=s,this.aEndAngle=a,this.aClockwise=c,this.aRotation=o}getPoint(e,t=new ae){let n=t,i=Math.PI*2,s=this.aEndAngle-this.aStartAngle,a=Math.abs(s)<Number.EPSILON;for(;s<0;)s+=i;for(;s>i;)s-=i;s<Number.EPSILON&&(a?s=0:s=i),this.aClockwise===!0&&!a&&(s===i?s=-i:s=s-i);let c=this.aStartAngle+e*s,o=this.aX+this.xRadius*Math.cos(c),h=this.aY+this.yRadius*Math.sin(c);if(this.aRotation!==0){let l=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=o-this.aX,p=h-this.aY;o=d*l-p*u+this.aX,h=d*u+p*l+this.aY}return n.set(o,h)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},yo=class extends Ks{constructor(e,t,n,i,s,a){super(e,t,n,n,i,s,a),this.isArcCurve=!0,this.type="ArcCurve"}};function rh(){let r=0,e=0,t=0,n=0;function i(s,a,c,o){r=s,e=c,t=-3*s+3*a-2*c-o,n=2*s-2*a+c+o}return{initCatmullRom:function(s,a,c,o,h){i(a,c,h*(c-s),h*(o-a))},initNonuniformCatmullRom:function(s,a,c,o,h,l,u){let d=(a-s)/h-(c-s)/(h+l)+(c-a)/l,p=(c-a)/l-(o-a)/(l+u)+(o-c)/u;d*=l,p*=l,i(a,c,d,p)},calc:function(s){let a=s*s,c=a*s;return r+e*s+t*a+n*c}}}var Xu=new L,qu=new L,gl=new rh,xl=new rh,_l=new rh,vo=class extends fn{constructor(e=[],t=!1,n="centripetal",i=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=i}getPoint(e,t=new L){let n=t,i=this.points,s=i.length,a=(s-(this.closed?0:1))*e,c=Math.floor(a),o=a-c;this.closed?c+=c>0?0:(Math.floor(Math.abs(c)/s)+1)*s:o===0&&c===s-1&&(c=s-2,o=1);let h,l;this.closed||c>0?h=i[(c-1)%s]:(qu.subVectors(i[0],i[1]).add(i[0]),h=qu);let u=i[c%s],d=i[(c+1)%s];if(this.closed||c+2<s?l=i[(c+2)%s]:(Xu.subVectors(i[s-1],i[s-2]).add(i[s-1]),l=Xu),this.curveType==="centripetal"||this.curveType==="chordal"){let p=this.curveType==="chordal"?.5:.25,g=Math.pow(h.distanceToSquared(u),p),x=Math.pow(u.distanceToSquared(d),p),m=Math.pow(d.distanceToSquared(l),p);x<1e-4&&(x=1),g<1e-4&&(g=x),m<1e-4&&(m=x),gl.initNonuniformCatmullRom(h.x,u.x,d.x,l.x,g,x,m),xl.initNonuniformCatmullRom(h.y,u.y,d.y,l.y,g,x,m),_l.initNonuniformCatmullRom(h.z,u.z,d.z,l.z,g,x,m)}else this.curveType==="catmullrom"&&(gl.initCatmullRom(h.x,u.x,d.x,l.x,this.tension),xl.initCatmullRom(h.y,u.y,d.y,l.y,this.tension),_l.initCatmullRom(h.z,u.z,d.z,l.z,this.tension));return n.set(gl.calc(o),xl.calc(o),_l.calc(o)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let i=e.points[t];this.points.push(i.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let i=this.points[t];e.points.push(i.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let i=e.points[t];this.points.push(new L().fromArray(i))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function Yu(r,e,t,n,i){let s=(n-e)*.5,a=(i-t)*.5,c=r*r,o=r*c;return(2*t-2*n+s+a)*o+(-3*t+3*n-2*s-a)*c+s*r+t}function Fp(r,e){let t=1-r;return t*t*e}function Op(r,e){return 2*(1-r)*r*e}function Bp(r,e){return r*r*e}function Cr(r,e,t,n){return Fp(r,e)+Op(r,t)+Bp(r,n)}function Hp(r,e){let t=1-r;return t*t*t*e}function kp(r,e){let t=1-r;return 3*t*t*r*e}function Gp(r,e){return 3*(1-r)*r*r*e}function Vp(r,e){return r*r*r*e}function Ir(r,e,t,n,i){return Hp(r,e)+kp(r,t)+Gp(r,n)+Vp(r,i)}var Wr=class extends fn{constructor(e=new ae,t=new ae,n=new ae,i=new ae){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=i}getPoint(e,t=new ae){let n=t,i=this.v0,s=this.v1,a=this.v2,c=this.v3;return n.set(Ir(e,i.x,s.x,a.x,c.x),Ir(e,i.y,s.y,a.y,c.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Mo=class extends fn{constructor(e=new L,t=new L,n=new L,i=new L){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=i}getPoint(e,t=new L){let n=t,i=this.v0,s=this.v1,a=this.v2,c=this.v3;return n.set(Ir(e,i.x,s.x,a.x,c.x),Ir(e,i.y,s.y,a.y,c.y),Ir(e,i.z,s.z,a.z,c.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Xr=class extends fn{constructor(e=new ae,t=new ae){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new ae){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new ae){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},bo=class extends fn{constructor(e=new L,t=new L){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new L){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new L){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},qr=class extends fn{constructor(e=new ae,t=new ae,n=new ae){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new ae){let n=t,i=this.v0,s=this.v1,a=this.v2;return n.set(Cr(e,i.x,s.x,a.x),Cr(e,i.y,s.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Eo=class extends fn{constructor(e=new L,t=new L,n=new L){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new L){let n=t,i=this.v0,s=this.v1,a=this.v2;return n.set(Cr(e,i.x,s.x,a.x),Cr(e,i.y,s.y,a.y),Cr(e,i.z,s.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Yr=class extends fn{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new ae){let n=t,i=this.points,s=(i.length-1)*e,a=Math.floor(s),c=s-a,o=i[a===0?a:a-1],h=i[a],l=i[a>i.length-2?i.length-1:a+1],u=i[a>i.length-3?i.length-1:a+2];return n.set(Yu(c,o.x,h.x,l.x,u.x),Yu(c,o.y,h.y,l.y,u.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let i=e.points[t];this.points.push(i.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let i=this.points[t];e.points.push(i.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let i=e.points[t];this.points.push(new ae().fromArray(i))}return this}},Sl=Object.freeze({__proto__:null,ArcCurve:yo,CatmullRomCurve3:vo,CubicBezierCurve:Wr,CubicBezierCurve3:Mo,EllipseCurve:Ks,LineCurve:Xr,LineCurve3:bo,QuadraticBezierCurve:qr,QuadraticBezierCurve3:Eo,SplineCurve:Yr}),So=class extends fn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Sl[n](t,e))}return this}getPoint(e,t){let n=e*this.getLength(),i=this.getCurveLengths(),s=0;for(;s<i.length;){if(i[s]>=n){let a=i[s]-n,c=this.curves[s],o=c.getLength(),h=o===0?0:1-a/o;return c.getPointAt(h,t)}s++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let n=0,i=this.curves.length;n<i;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],n;for(let i=0,s=this.curves;i<s.length;i++){let a=s[i],c=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,o=a.getPoints(c);for(let h=0;h<o.length;h++){let l=o[h];n&&n.equals(l)||(t.push(l),n=l)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let i=e.curves[t];this.curves.push(i.clone())}return this.autoClose=e.autoClose,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){let i=this.curves[t];e.curves.push(i.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let i=e.curves[t];this.curves.push(new Sl[i.type]().fromJSON(i))}return this}},zi=class extends So{constructor(e){super(),this.type="Path",this.currentPoint=new ae,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let n=new Xr(this.currentPoint.clone(),new ae(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,i){let s=new qr(this.currentPoint.clone(),new ae(e,t),new ae(n,i));return this.curves.push(s),this.currentPoint.set(n,i),this}bezierCurveTo(e,t,n,i,s,a){let c=new Wr(this.currentPoint.clone(),new ae(e,t),new ae(n,i),new ae(s,a));return this.curves.push(c),this.currentPoint.set(s,a),this}splineThru(e){let t=[this.currentPoint.clone()].concat(e),n=new Yr(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,i,s,a){let c=this.currentPoint.x,o=this.currentPoint.y;return this.absarc(e+c,t+o,n,i,s,a),this}absarc(e,t,n,i,s,a){return this.absellipse(e,t,n,n,i,s,a),this}ellipse(e,t,n,i,s,a,c,o){let h=this.currentPoint.x,l=this.currentPoint.y;return this.absellipse(e+h,t+l,n,i,s,a,c,o),this}absellipse(e,t,n,i,s,a,c,o){let h=new Ks(e,t,n,i,s,a,c,o);if(this.curves.length>0){let u=h.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(h);let l=h.getPoint(1);return this.currentPoint.copy(l),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},as=class extends zi{constructor(e){super(e),this.uuid=En(),this.type="Shape",this.holes=[]}getPointsHoles(e){let t=[];for(let n=0,i=this.holes.length;n<i;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let i=e.holes[t];this.holes.push(i.clone())}return this}toJSON(){let e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){let i=this.holes[t];e.holes.push(i.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let i=e.holes[t];this.holes.push(new zi().fromJSON(i))}return this}};function Wp(r,e,t=2){let n=e&&e.length,i=n?e[0]*t:r.length,s=Yd(r,0,i,t,!0),a=[];if(!s||s.next===s.prev)return a;let c,o,h;if(n&&(s=Kp(r,e,s,t)),r.length>80*t){c=r[0],o=r[1];let l=c,u=o;for(let d=t;d<i;d+=t){let p=r[d],g=r[d+1];p<c&&(c=p),g<o&&(o=g),p>l&&(l=p),g>u&&(u=g)}h=Math.max(l-c,u-o),h=h!==0?32767/h:0}return Zr(s,a,t,c,o,h,0),a}function Yd(r,e,t,n,i){let s;if(i===am(r,e,t,n)>0)for(let a=e;a<t;a+=n)s=Zu(a/n|0,r[a],r[a+1],s);else for(let a=t-n;a>=e;a-=n)s=Zu(a/n|0,r[a],r[a+1],s);return s&&Js(s,s.next)&&(Jr(s),s=s.next),s}function os(r,e){if(!r)return r;e||(e=r);let t=r,n;do if(n=!1,!t.steiner&&(Js(t,t.next)||It(t.prev,t,t.next)===0)){if(Jr(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function Zr(r,e,t,n,i,s,a){if(!r)return;!a&&s&&em(r,n,i,s);let c=r;for(;r.prev!==r.next;){let o=r.prev,h=r.next;if(s?qp(r,n,i,s):Xp(r)){e.push(o.i,r.i,h.i),Jr(r),r=h.next,c=h.next;continue}if(r=h,r===c){a?a===1?(r=Yp(os(r),e),Zr(r,e,t,n,i,s,2)):a===2&&Zp(r,e,t,n,i,s):Zr(os(r),e,t,n,i,s,1);break}}}function Xp(r){let e=r.prev,t=r,n=r.next;if(It(e,t,n)>=0)return!1;let i=e.x,s=t.x,a=n.x,c=e.y,o=t.y,h=n.y,l=Math.min(i,s,a),u=Math.min(c,o,h),d=Math.max(i,s,a),p=Math.max(c,o,h),g=n.next;for(;g!==e;){if(g.x>=l&&g.x<=d&&g.y>=u&&g.y<=p&&wr(i,c,s,o,a,h,g.x,g.y)&&It(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function qp(r,e,t,n){let i=r.prev,s=r,a=r.next;if(It(i,s,a)>=0)return!1;let c=i.x,o=s.x,h=a.x,l=i.y,u=s.y,d=a.y,p=Math.min(c,o,h),g=Math.min(l,u,d),x=Math.max(c,o,h),m=Math.max(l,u,d),f=Tl(p,g,e,t,n),M=Tl(x,m,e,t,n),T=r.prevZ,y=r.nextZ;for(;T&&T.z>=f&&y&&y.z<=M;){if(T.x>=p&&T.x<=x&&T.y>=g&&T.y<=m&&T!==i&&T!==a&&wr(c,l,o,u,h,d,T.x,T.y)&&It(T.prev,T,T.next)>=0||(T=T.prevZ,y.x>=p&&y.x<=x&&y.y>=g&&y.y<=m&&y!==i&&y!==a&&wr(c,l,o,u,h,d,y.x,y.y)&&It(y.prev,y,y.next)>=0))return!1;y=y.nextZ}for(;T&&T.z>=f;){if(T.x>=p&&T.x<=x&&T.y>=g&&T.y<=m&&T!==i&&T!==a&&wr(c,l,o,u,h,d,T.x,T.y)&&It(T.prev,T,T.next)>=0)return!1;T=T.prevZ}for(;y&&y.z<=M;){if(y.x>=p&&y.x<=x&&y.y>=g&&y.y<=m&&y!==i&&y!==a&&wr(c,l,o,u,h,d,y.x,y.y)&&It(y.prev,y,y.next)>=0)return!1;y=y.nextZ}return!0}function Yp(r,e){let t=r;do{let n=t.prev,i=t.next.next;!Js(n,i)&&Kd(n,t,t.next,i)&&Kr(n,i)&&Kr(i,n)&&(e.push(n.i,t.i,i.i),Jr(t),Jr(t.next),t=r=i),t=t.next}while(t!==r);return os(t)}function Zp(r,e,t,n,i,s){let a=r;do{let c=a.next.next;for(;c!==a.prev;){if(a.i!==c.i&&im(a,c)){let o=Jd(a,c);a=os(a,a.next),o=os(o,o.next),Zr(a,e,t,n,i,s,0),Zr(o,e,t,n,i,s,0);return}c=c.next}a=a.next}while(a!==r)}function Kp(r,e,t,n){let i=[];for(let s=0,a=e.length;s<a;s++){let c=e[s]*n,o=s<a-1?e[s+1]*n:r.length,h=Yd(r,c,o,n,!1);h===h.next&&(h.steiner=!0),i.push(nm(h))}i.sort(Jp);for(let s=0;s<i.length;s++)t=$p(i[s],t);return t}function Jp(r,e){let t=r.x-e.x;if(t===0&&(t=r.y-e.y,t===0)){let n=(r.next.y-r.y)/(r.next.x-r.x),i=(e.next.y-e.y)/(e.next.x-e.x);t=n-i}return t}function $p(r,e){let t=jp(r,e);if(!t)return e;let n=Jd(t,r);return os(n,n.next),os(t,t.next)}function jp(r,e){let t=e,n=r.x,i=r.y,s=-1/0,a;if(Js(r,t))return t;do{if(Js(r,t.next))return t.next;if(i<=t.y&&i>=t.next.y&&t.next.y!==t.y){let u=t.x+(i-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(u<=n&&u>s&&(s=u,a=t.x<t.next.x?t:t.next,u===n))return a}t=t.next}while(t!==e);if(!a)return null;let c=a,o=a.x,h=a.y,l=1/0;t=a;do{if(n>=t.x&&t.x>=o&&n!==t.x&&Zd(i<h?n:s,i,o,h,i<h?s:n,i,t.x,t.y)){let u=Math.abs(i-t.y)/(n-t.x);Kr(t,r)&&(u<l||u===l&&(t.x>a.x||t.x===a.x&&Qp(a,t)))&&(a=t,l=u)}t=t.next}while(t!==c);return a}function Qp(r,e){return It(r.prev,r,e.prev)<0&&It(e.next,r,r.next)<0}function em(r,e,t,n){let i=r;do i.z===0&&(i.z=Tl(i.x,i.y,e,t,n)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==r);i.prevZ.nextZ=null,i.prevZ=null,tm(i)}function tm(r){let e,t=1;do{let n=r,i;r=null;let s=null;for(e=0;n;){e++;let a=n,c=0;for(let h=0;h<t&&(c++,a=a.nextZ,!!a);h++);let o=t;for(;c>0||o>0&&a;)c!==0&&(o===0||!a||n.z<=a.z)?(i=n,n=n.nextZ,c--):(i=a,a=a.nextZ,o--),s?s.nextZ=i:r=i,i.prevZ=s,s=i;n=a}s.nextZ=null,t*=2}while(e>1);return r}function Tl(r,e,t,n,i){return r=(r-t)*i|0,e=(e-n)*i|0,r=(r|r<<8)&16711935,r=(r|r<<4)&252645135,r=(r|r<<2)&858993459,r=(r|r<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,r|e<<1}function nm(r){let e=r,t=r;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==r);return t}function Zd(r,e,t,n,i,s,a,c){return(i-a)*(e-c)>=(r-a)*(s-c)&&(r-a)*(n-c)>=(t-a)*(e-c)&&(t-a)*(s-c)>=(i-a)*(n-c)}function wr(r,e,t,n,i,s,a,c){return!(r===a&&e===c)&&Zd(r,e,t,n,i,s,a,c)}function im(r,e){return r.next.i!==e.i&&r.prev.i!==e.i&&!sm(r,e)&&(Kr(r,e)&&Kr(e,r)&&rm(r,e)&&(It(r.prev,r,e.prev)||It(r,e.prev,e))||Js(r,e)&&It(r.prev,r,r.next)>0&&It(e.prev,e,e.next)>0)}function It(r,e,t){return(e.y-r.y)*(t.x-e.x)-(e.x-r.x)*(t.y-e.y)}function Js(r,e){return r.x===e.x&&r.y===e.y}function Kd(r,e,t,n){let i=ja(It(r,e,t)),s=ja(It(r,e,n)),a=ja(It(t,n,r)),c=ja(It(t,n,e));return!!(i!==s&&a!==c||i===0&&$a(r,t,e)||s===0&&$a(r,n,e)||a===0&&$a(t,r,n)||c===0&&$a(t,e,n))}function $a(r,e,t){return e.x<=Math.max(r.x,t.x)&&e.x>=Math.min(r.x,t.x)&&e.y<=Math.max(r.y,t.y)&&e.y>=Math.min(r.y,t.y)}function ja(r){return r>0?1:r<0?-1:0}function sm(r,e){let t=r;do{if(t.i!==r.i&&t.next.i!==r.i&&t.i!==e.i&&t.next.i!==e.i&&Kd(t,t.next,r,e))return!0;t=t.next}while(t!==r);return!1}function Kr(r,e){return It(r.prev,r,r.next)<0?It(r,e,r.next)>=0&&It(r,r.prev,e)>=0:It(r,e,r.prev)<0||It(r,r.next,e)<0}function rm(r,e){let t=r,n=!1,i=(r.x+e.x)/2,s=(r.y+e.y)/2;do t.y>s!=t.next.y>s&&t.next.y!==t.y&&i<(t.next.x-t.x)*(s-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==r);return n}function Jd(r,e){let t=wl(r.i,r.x,r.y),n=wl(e.i,e.x,e.y),i=r.next,s=e.prev;return r.next=e,e.prev=r,t.next=i,i.prev=t,n.next=t,t.prev=n,s.next=n,n.prev=s,n}function Zu(r,e,t,n){let i=wl(r,e,t);return n?(i.next=n.next,i.prev=n,n.next.prev=i,n.next=i):(i.prev=i,i.next=i),i}function Jr(r){r.next.prev=r.prev,r.prev.next=r.next,r.prevZ&&(r.prevZ.nextZ=r.nextZ),r.nextZ&&(r.nextZ.prevZ=r.prevZ)}function wl(r,e,t){return{i:r,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function am(r,e,t,n){let i=0;for(let s=e,a=t-n;s<t;s+=n)i+=(r[a]-r[s])*(r[s+1]+r[a+1]),a=s;return i}var Al=class{static triangulate(e,t,n=2){return Wp(e,t,n)}},Qi=class r{static area(e){let t=e.length,n=0;for(let i=t-1,s=0;s<t;i=s++)n+=e[i].x*e[s].y-e[s].x*e[i].y;return n*.5}static isClockWise(e){return r.area(e)<0}static triangulateShape(e,t){let n=[],i=[],s=[];Ku(e),Ju(n,e);let a=e.length;t.forEach(Ku);for(let o=0;o<t.length;o++)i.push(a),a+=t[o].length,Ju(n,t[o]);let c=Al.triangulate(n,i);for(let o=0;o<c.length;o+=3)s.push(c.slice(o,o+3));return s}};function Ku(r){let e=r.length;e>2&&r[e-1].equals(r[0])&&r.pop()}function Ju(r,e){for(let t=0;t<e.length;t++)r.push(e[t].x),r.push(e[t].y)}var $s=class r extends xt{constructor(e=new as([new ae(.5,.5),new ae(-.5,.5),new ae(-.5,-.5),new ae(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];let n=this,i=[],s=[];for(let c=0,o=e.length;c<o;c++){let h=e[c];a(h)}this.setAttribute("position",new Ye(i,3)),this.setAttribute("uv",new Ye(s,2)),this.computeVertexNormals();function a(c){let o=[],h=t.curveSegments!==void 0?t.curveSegments:12,l=t.steps!==void 0?t.steps:1,u=t.depth!==void 0?t.depth:1,d=t.bevelEnabled!==void 0?t.bevelEnabled:!0,p=t.bevelThickness!==void 0?t.bevelThickness:.2,g=t.bevelSize!==void 0?t.bevelSize:p-.1,x=t.bevelOffset!==void 0?t.bevelOffset:0,m=t.bevelSegments!==void 0?t.bevelSegments:3,f=t.extrudePath,M=t.UVGenerator!==void 0?t.UVGenerator:om,T,y=!1,E,w,S,_;if(f){T=f.getSpacedPoints(l),y=!0,d=!1;let ie=f.isCatmullRomCurve3?f.closed:!1;E=f.computeFrenetFrames(l,ie),w=new L,S=new L,_=new L}d||(m=0,p=0,g=0,x=0);let v=c.extractPoints(h),R=v.shape,C=v.holes;if(!Qi.isClockWise(R)){R=R.reverse();for(let ie=0,re=C.length;ie<re;ie++){let oe=C[ie];Qi.isClockWise(oe)&&(C[ie]=oe.reverse())}}function F(ie){let oe=10000000000000001e-36,ce=ie[0];for(let ue=1;ue<=ie.length;ue++){let Oe=ue%ie.length,ze=ie[Oe],We=ze.x-ce.x,qe=ze.y-ce.y,z=We*We+qe*qe,lt=Math.max(Math.abs(ze.x),Math.abs(ze.y),Math.abs(ce.x),Math.abs(ce.y)),nt=oe*lt*lt;if(z<=nt){ie.splice(Oe,1),ue--;continue}ce=ze}}F(R),C.forEach(F);let N=C.length,U=R;for(let ie=0;ie<N;ie++){let re=C[ie];R=R.concat(re)}function D(ie,re,oe){return re||He("ExtrudeGeometry: vec does not exist"),ie.clone().addScaledVector(re,oe)}let O=R.length;function X(ie,re,oe){let ce,ue,Oe,ze=ie.x-re.x,We=ie.y-re.y,qe=oe.x-ie.x,z=oe.y-ie.y,lt=ze*ze+We*We,nt=ze*z-We*qe;if(Math.abs(nt)>Number.EPSILON){let P=Math.sqrt(lt),b=Math.sqrt(qe*qe+z*z),G=re.x-We/P,q=re.y+ze/P,$=oe.x-z/b,le=oe.y+qe/b,he=(($-G)*z-(le-q)*qe)/(ze*z-We*qe);ce=G+ze*he-ie.x,ue=q+We*he-ie.y;let j=ce*ce+ue*ue;if(j<=2)return new ae(ce,ue);Oe=Math.sqrt(j/2)}else{let P=!1;ze>Number.EPSILON?qe>Number.EPSILON&&(P=!0):ze<-Number.EPSILON?qe<-Number.EPSILON&&(P=!0):Math.sign(We)===Math.sign(z)&&(P=!0),P?(ce=-We,ue=ze,Oe=Math.sqrt(lt)):(ce=ze,ue=We,Oe=Math.sqrt(lt/2))}return new ae(ce/Oe,ue/Oe)}let k=[];for(let ie=0,re=U.length,oe=re-1,ce=ie+1;ie<re;ie++,oe++,ce++)oe===re&&(oe=0),ce===re&&(ce=0),k[ie]=X(U[ie],U[oe],U[ce]);let Y=[],K,_e=k.concat();for(let ie=0,re=N;ie<re;ie++){let oe=C[ie];K=[];for(let ce=0,ue=oe.length,Oe=ue-1,ze=ce+1;ce<ue;ce++,Oe++,ze++)Oe===ue&&(Oe=0),ze===ue&&(ze=0),K[ce]=X(oe[ce],oe[Oe],oe[ze]);Y.push(K),_e=_e.concat(K)}let Me;if(m===0)Me=Qi.triangulateShape(U,C);else{let ie=[],re=[];for(let oe=0;oe<m;oe++){let ce=oe/m,ue=p*Math.cos(ce*Math.PI/2),Oe=g*Math.sin(ce*Math.PI/2)+x;for(let ze=0,We=U.length;ze<We;ze++){let qe=D(U[ze],k[ze],Oe);ye(qe.x,qe.y,-ue),ce===0&&ie.push(qe)}for(let ze=0,We=N;ze<We;ze++){let qe=C[ze];K=Y[ze];let z=[];for(let lt=0,nt=qe.length;lt<nt;lt++){let P=D(qe[lt],K[lt],Oe);ye(P.x,P.y,-ue),ce===0&&z.push(P)}ce===0&&re.push(z)}}Me=Qi.triangulateShape(ie,re)}let ct=Me.length,tt=g+x;for(let ie=0;ie<O;ie++){let re=d?D(R[ie],_e[ie],tt):R[ie];y?(S.copy(E.normals[0]).multiplyScalar(re.x),w.copy(E.binormals[0]).multiplyScalar(re.y),_.copy(T[0]).add(S).add(w),ye(_.x,_.y,_.z)):ye(re.x,re.y,0)}for(let ie=1;ie<=l;ie++)for(let re=0;re<O;re++){let oe=d?D(R[re],_e[re],tt):R[re];y?(S.copy(E.normals[ie]).multiplyScalar(oe.x),w.copy(E.binormals[ie]).multiplyScalar(oe.y),_.copy(T[ie]).add(S).add(w),ye(_.x,_.y,_.z)):ye(oe.x,oe.y,u/l*ie)}for(let ie=m-1;ie>=0;ie--){let re=ie/m,oe=p*Math.cos(re*Math.PI/2),ce=g*Math.sin(re*Math.PI/2)+x;for(let ue=0,Oe=U.length;ue<Oe;ue++){let ze=D(U[ue],k[ue],ce);ye(ze.x,ze.y,u+oe)}for(let ue=0,Oe=C.length;ue<Oe;ue++){let ze=C[ue];K=Y[ue];for(let We=0,qe=ze.length;We<qe;We++){let z=D(ze[We],K[We],ce);y?ye(z.x,z.y+T[l-1].y,T[l-1].x+oe):ye(z.x,z.y,u+oe)}}}rt(),Q();function rt(){let ie=i.length/3;if(d){let re=0,oe=O*re;for(let ce=0;ce<ct;ce++){let ue=Me[ce];Ge(ue[2]+oe,ue[1]+oe,ue[0]+oe)}re=l+m*2,oe=O*re;for(let ce=0;ce<ct;ce++){let ue=Me[ce];Ge(ue[0]+oe,ue[1]+oe,ue[2]+oe)}}else{for(let re=0;re<ct;re++){let oe=Me[re];Ge(oe[2],oe[1],oe[0])}for(let re=0;re<ct;re++){let oe=Me[re];Ge(oe[0]+O*l,oe[1]+O*l,oe[2]+O*l)}}n.addGroup(ie,i.length/3-ie,0)}function Q(){let ie=i.length/3,re=0;ne(U,re),re+=U.length;for(let oe=0,ce=C.length;oe<ce;oe++){let ue=C[oe];ne(ue,re),re+=ue.length}n.addGroup(ie,i.length/3-ie,1)}function ne(ie,re){let oe=ie.length;for(;--oe>=0;){let ce=oe,ue=oe-1;ue<0&&(ue=ie.length-1);for(let Oe=0,ze=l+m*2;Oe<ze;Oe++){let We=O*Oe,qe=O*(Oe+1),z=re+ce+We,lt=re+ue+We,nt=re+ue+qe,P=re+ce+qe;Se(z,lt,nt,P)}}}function ye(ie,re,oe){o.push(ie),o.push(re),o.push(oe)}function Ge(ie,re,oe){Ve(ie),Ve(re),Ve(oe);let ce=i.length/3,ue=M.generateTopUV(n,i,ce-3,ce-2,ce-1);ft(ue[0]),ft(ue[1]),ft(ue[2])}function Se(ie,re,oe,ce){Ve(ie),Ve(re),Ve(ce),Ve(re),Ve(oe),Ve(ce);let ue=i.length/3,Oe=M.generateSideWallUV(n,i,ue-6,ue-3,ue-2,ue-1);ft(Oe[0]),ft(Oe[1]),ft(Oe[3]),ft(Oe[1]),ft(Oe[2]),ft(Oe[3])}function Ve(ie){i.push(o[ie*3+0]),i.push(o[ie*3+1]),i.push(o[ie*3+2])}function ft(ie){s.push(ie.x),s.push(ie.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes,n=this.parameters.options;return cm(t,n,e)}static fromJSON(e,t){let n=[];for(let s=0,a=e.shapes.length;s<a;s++){let c=t[e.shapes[s]];n.push(c)}let i=e.options.extrudePath;return i!==void 0&&(e.options.extrudePath=new Sl[i.type]().fromJSON(i)),new r(n,e.options)}},om={generateTopUV:function(r,e,t,n,i){let s=e[t*3],a=e[t*3+1],c=e[n*3],o=e[n*3+1],h=e[i*3],l=e[i*3+1];return[new ae(s,a),new ae(c,o),new ae(h,l)]},generateSideWallUV:function(r,e,t,n,i,s){let a=e[t*3],c=e[t*3+1],o=e[t*3+2],h=e[n*3],l=e[n*3+1],u=e[n*3+2],d=e[i*3],p=e[i*3+1],g=e[i*3+2],x=e[s*3],m=e[s*3+1],f=e[s*3+2];return Math.abs(c-l)<Math.abs(a-h)?[new ae(a,1-o),new ae(h,1-u),new ae(d,1-g),new ae(x,1-f)]:[new ae(c,1-o),new ae(l,1-u),new ae(p,1-g),new ae(m,1-f)]}};function cm(r,e,t){if(t.shapes=[],Array.isArray(r))for(let n=0,i=r.length;n<i;n++){let s=r[n];t.shapes.push(s.uuid)}else t.shapes.push(r.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}var Fi=class r extends _o{constructor(e=1,t=0){let n=(1+Math.sqrt(5))/2,i=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],s=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(i,s,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new r(e.radius,e.detail)}};var yt=class r extends xt{constructor(e=1,t=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:i};let s=e/2,a=t/2,c=Math.floor(n),o=Math.floor(i),h=c+1,l=o+1,u=e/c,d=t/o,p=[],g=[],x=[],m=[];for(let f=0;f<l;f++){let M=f*d-a;for(let T=0;T<h;T++){let y=T*u-s;g.push(y,-M,0),x.push(0,0,1),m.push(T/c),m.push(1-f/o)}}for(let f=0;f<o;f++)for(let M=0;M<c;M++){let T=M+h*f,y=M+h*(f+1),E=M+1+h*(f+1),w=M+1+h*f;p.push(T,y,w),p.push(y,E,w)}this.setIndex(p),this.setAttribute("position",new Ye(g,3)),this.setAttribute("normal",new Ye(x,3)),this.setAttribute("uv",new Ye(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.width,e.height,e.widthSegments,e.heightSegments)}},js=class r extends xt{constructor(e=.5,t=1,n=32,i=1,s=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:i,thetaStart:s,thetaLength:a},n=Math.max(3,n),i=Math.max(1,i);let c=[],o=[],h=[],l=[],u=e,d=(t-e)/i,p=new L,g=new ae;for(let x=0;x<=i;x++){for(let m=0;m<=n;m++){let f=s+m/n*a;p.x=u*Math.cos(f),p.y=u*Math.sin(f),o.push(p.x,p.y,p.z),h.push(0,0,1),g.x=(p.x/t+1)/2,g.y=(p.y/t+1)/2,l.push(g.x,g.y)}u+=d}for(let x=0;x<i;x++){let m=x*(n+1);for(let f=0;f<n;f++){let M=f+m,T=M,y=M+n+1,E=M+n+2,w=M+1;c.push(T,y,w),c.push(y,E,w)}}this.setIndex(c),this.setAttribute("position",new Ye(o,3)),this.setAttribute("normal",new Ye(h,3)),this.setAttribute("uv",new Ye(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}};var wn=class r extends xt{constructor(e=1,t=32,n=16,i=0,s=Math.PI*2,a=0,c=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:i,phiLength:s,thetaStart:a,thetaLength:c},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let o=Math.min(a+c,Math.PI),h=0,l=[],u=new L,d=new L,p=[],g=[],x=[],m=[];for(let f=0;f<=n;f++){let M=[],T=f/n,y=a+T*c,E=e*Math.cos(y),w=Math.sqrt(e*e-E*E),S=0;f===0&&a===0?S=.5/t:f===n&&o===Math.PI&&(S=-.5/t);for(let _=0;_<=t;_++){let v=_/t,R=i+v*s;u.x=-w*Math.cos(R),u.y=E,u.z=w*Math.sin(R),g.push(u.x,u.y,u.z),d.copy(u).normalize(),x.push(d.x,d.y,d.z),m.push(v+S,1-T),M.push(h++)}l.push(M)}for(let f=0;f<n;f++)for(let M=0;M<t;M++){let T=l[f][M+1],y=l[f][M],E=l[f+1][M],w=l[f+1][M+1];(f!==0||a>0)&&p.push(T,y,w),(f!==n-1||o<Math.PI)&&p.push(y,E,w)}this.setIndex(p),this.setAttribute("position",new Ye(g,3)),this.setAttribute("normal",new Ye(x,3)),this.setAttribute("uv",new Ye(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}};var pn=class r extends xt{constructor(e=1,t=.4,n=12,i=48,s=Math.PI*2,a=0,c=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:i,arc:s,thetaStart:a,thetaLength:c},n=Math.floor(n),i=Math.floor(i);let o=[],h=[],l=[],u=[],d=new L,p=new L,g=new L;for(let x=0;x<=n;x++){let m=a+x/n*c;for(let f=0;f<=i;f++){let M=f/i*s;p.x=(e+t*Math.cos(m))*Math.cos(M),p.y=(e+t*Math.cos(m))*Math.sin(M),p.z=t*Math.sin(m),h.push(p.x,p.y,p.z),d.x=e*Math.cos(M),d.y=e*Math.sin(M),g.subVectors(p,d).normalize(),l.push(g.x,g.y,g.z),u.push(f/i),u.push(x/n)}}for(let x=1;x<=n;x++)for(let m=1;m<=i;m++){let f=(i+1)*x+m-1,M=(i+1)*(x-1)+m-1,T=(i+1)*(x-1)+m,y=(i+1)*x+m;o.push(f,M,y),o.push(M,T,y)}this.setIndex(o),this.setAttribute("position",new Ye(h,3)),this.setAttribute("normal",new Ye(l,3)),this.setAttribute("uv",new Ye(u,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc,e.thetaStart,e.thetaLength)}};function fs(r){let e={};for(let t in r){e[t]={};for(let n in r[t]){let i=r[t][n];if($u(i))i.isRenderTargetTexture?(Le("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=i.clone();else if(Array.isArray(i))if($u(i[0])){let s=[];for(let a=0,c=i.length;a<c;a++)s[a]=i[a].clone();e[t][n]=s}else e[t][n]=i.slice();else e[t][n]=i}}return e}function $t(r){let e={};for(let t=0;t<r.length;t++){let n=fs(r[t]);for(let i in n)e[i]=n[i]}return e}function $u(r){return r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)}function lm(r){let e=[];for(let t=0;t<r.length;t++)e.push(r[t].clone());return e}function ah(r){let e=r.getRenderTarget();return e===null?r.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:je.workingColorSpace}var $d={clone:fs,merge:$t},hm=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,um=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,mn=class extends nn{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=hm,this.fragmentShader=um,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=fs(e.uniforms),this.uniformsGroups=lm(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let i in this.uniforms){let a=this.uniforms[i].value;a&&a.isTexture?t.uniforms[i]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[i]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[i]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[i]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[i]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[i]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[i]={type:"m4",value:a.toArray()}:t.uniforms[i]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let n in e.uniforms){let i=e.uniforms[n];switch(this.uniforms[n]={},i.type){case"t":this.uniforms[n].value=t[i.value]||null;break;case"c":this.uniforms[n].value=new Ae().setHex(i.value);break;case"v2":this.uniforms[n].value=new ae().fromArray(i.value);break;case"v3":this.uniforms[n].value=new L().fromArray(i.value);break;case"v4":this.uniforms[n].value=new gt().fromArray(i.value);break;case"m3":this.uniforms[n].value=new Xe().fromArray(i.value);break;case"m4":this.uniforms[n].value=new Fe().fromArray(i.value);break;default:this.uniforms[n].value=i.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let n in e.extensions)this.extensions[n]=e.extensions[n];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},To=class extends mn{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}},st=class extends nn{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Ae(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ae(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Ac,this.normalScale=new ae(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new an,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},cn=class extends st{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new ae(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return Qe(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Ae(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Ae(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Ae(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get retroreflectivity(){return this._retroreflectivity}set retroreflectivity(e){this._retroreflectivity>0!=e>0&&this.version++,this._retroreflectivity=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.retroreflectivity=e.retroreflectivity,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}};var wo=class extends nn{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Ld,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},Ao=class extends nn{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function Ii(r,e){return!r||r.constructor===e?r:typeof e.BYTES_PER_ELEMENT=="number"?new e(r):Array.prototype.slice.call(r)}function io(r){return r!==void 0&&r.inTangents!==void 0&&r.outTangents!==void 0}function dm(r){function e(i,s){return r[i]-r[s]}let t=r.length,n=new Array(t);for(let i=0;i!==t;++i)n[i]=i;return n.sort(e),n}function ju(r,e,t){let n=r.length,i=new r.constructor(n);for(let s=0,a=0;a!==n;++s){let c=t[s]*e;for(let o=0;o!==e;++o)i[a++]=r[c+o]}return i}function fm(r,e,t,n){let i=1,s=r[0];for(;s!==void 0&&s[n]===void 0;)s=r[i++];if(s===void 0)return;let a=s[n];if(a!==void 0)if(Array.isArray(a))do a=s[n],a!==void 0&&(e.push(s.time),t.push(...a)),s=r[i++];while(s!==void 0);else if(a.toArray!==void 0)do a=s[n],a!==void 0&&(e.push(s.time),a.toArray(t,t.length)),s=r[i++];while(s!==void 0);else do a=s[n],a!==void 0&&(e.push(s.time),t.push(a)),s=r[i++];while(s!==void 0)}var Zn=class{constructor(e,t,n,i){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=i!==void 0?i:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,i=t[n],s=t[n-1];e:{t:{let a;n:{i:if(!(e<i)){for(let c=n+2;;){if(i===void 0){if(e<s)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===c)break;if(s=i,i=t[++n],e<i)break t}a=t.length;break n}if(!(e>=s)){let c=t[1];e<c&&(n=2,s=c);for(let o=n-2;;){if(s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===o)break;if(i=s,s=t[--n-1],e>=s)break t}a=n,n=0;break n}break e}for(;n<a;){let c=n+a>>>1;e<t[c]?a=c:n=c+1}if(i=t[n],s=t[n-1],s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,s,i)}return this.interpolate_(n,s,e,i)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,s=e*i;for(let a=0;a!==i;++a)t[a]=n[s+a];return t}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},Ro=class extends Zn{constructor(e,t,n,i){super(e,t,n,i),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:$i,endingEnd:$i}}intervalChanged_(e,t,n){let i=this.parameterPositions,s=e-2,a=e+1,c=i[s],o=i[a];if(c===void 0)switch(this.getSettings_().endingStart){case ji:s=e,c=2*t-n;break;case Pr:s=i.length-2,c=t+i[s]-i[s+1];break;default:s=e,c=n}if(o===void 0)switch(this.getSettings_().endingEnd){case ji:a=e,o=2*n-t;break;case Pr:a=1,o=n+i[1]-i[0];break;default:a=e-1,o=t}let h=(n-t)*.5,l=this.valueSize;this._weightPrev=h/(t-c),this._weightNext=h/(o-n),this._offsetPrev=s*l,this._offsetNext=a*l}interpolate_(e,t,n,i){let s=this.resultBuffer,a=this.sampleValues,c=this.valueSize,o=e*c,h=o-c,l=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,p=this._weightNext,g=(n-t)/(i-t),x=g*g,m=x*g,f=-d*m+2*d*x-d*g,M=(1+d)*m+(-1.5-2*d)*x+(-.5+d)*g+1,T=(-1-p)*m+(1.5+p)*x+.5*g,y=p*m-p*x;for(let E=0;E!==c;++E)s[E]=f*a[l+E]+M*a[h+E]+T*a[o+E]+y*a[u+E];return s}},$r=class extends Zn{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){let s=this.resultBuffer,a=this.sampleValues,c=this.valueSize,o=e*c,h=o-c,l=(n-t)/(i-t),u=1-l;for(let d=0;d!==c;++d)s[d]=a[h+d]*u+a[o+d]*l;return s}},Co=class extends Zn{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e){return this.copySampleValue_(e-1)}},Io=class extends Zn{interpolate_(e,t,n,i){let s=this.resultBuffer,a=this.sampleValues,c=this.valueSize,o=e*c,h=o-c,l=this.inTangents,u=this.outTangents;if(!l||!u){let g=(n-t)/(i-t),x=1-g;for(let m=0;m!==c;++m)s[m]=a[h+m]*x+a[o+m]*g;return s}let d=c*2,p=e-1;for(let g=0;g!==c;++g){let x=a[h+g],m=a[o+g],f=p*d+g*2,M=u[f],T=u[f+1],y=e*d+g*2,E=l[y],w=l[y+1],S=mm(n,t,M,E,i);s[g]=jd(S,x,T,w,m)}return s}};function jd(r,e,t,n,i){let s=1-r;return s*s*s*e+3*s*s*r*t+3*s*r*r*n+r*r*r*i}function pm(r,e,t,n,i){let s=1-r;return 3*s*s*(t-e)+6*s*r*(n-t)+3*r*r*(i-n)}function mm(r,e,t,n,i){let s=(r-e)/(i-e);for(let a=0;a<8;a++){let c=jd(s,e,t,n,i)-r;if(Math.abs(c)<1e-10)break;let o=pm(s,e,t,n,i);if(Math.abs(o)<1e-10)break;s=Math.max(0,Math.min(1,s-c/o))}return s}var ln=class{constructor(e,t,n,i){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=Ii(t,this.TimeBufferType),this.values=Ii(n,this.ValueBufferType),this.setInterpolation(i||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:Ii(e.times,Array),values:Ii(e.values,Array)};let i=e.getInterpolation();i!==e.DefaultInterpolation&&(n.interpolation=i),io(e.settings)&&(n.settings={inTangents:Ii(e.settings.inTangents,Array),outTangents:Ii(e.settings.outTangents,Array)})}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new Co(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new $r(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Ro(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new Io(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case ts:t=this.InterpolantFactoryMethodDiscrete;break;case ns:t=this.InterpolantFactoryMethodLinear;break;case to:t=this.InterpolantFactoryMethodSmooth;break;case bl:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return Le("KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return ts;case this.InterpolantFactoryMethodLinear:return ns;case this.InterpolantFactoryMethodSmooth:return to;case this.InterpolantFactoryMethodBezier:return bl}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]*=e;io(this.settings)&&(Qu(this.settings.inTangents,e),Qu(this.settings.outTangents,e))}return this}trim(e,t){let n=this.times,i=n.length,s=0,a=i-1;for(;s!==i&&n[s]<e;)++s;for(;a!==-1&&n[a]>t;)--a;if(++a,s!==0||a!==i){s>=a&&(a=Math.max(a,1),s=a-1);let c=this.getValueSize();this.times=n.slice(s,a),this.values=this.values.slice(s*c,a*c)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(He("KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,i=this.values,s=n.length;s===0&&(He("KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let c=0;c!==s;c++){let o=n[c];if(typeof o=="number"&&isNaN(o)){He("KeyframeTrack: Time is not a valid number.",this,c,o),e=!1;break}if(a!==null&&a>o){He("KeyframeTrack: Out of order keys.",this,c,o,a),e=!1;break}a=o}if(i!==void 0&&Qf(i))for(let c=0,o=i.length;c!==o;++c){let h=i[c];if(isNaN(h)){He("KeyframeTrack: Value is not a valid number.",this,c,h),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),i=this.getInterpolation()===to,s=e.length-1,a=1;for(let c=1;c<s;++c){let o=!1,h=e[c],l=e[c+1];if(h!==l&&(c!==1||h!==e[0]))if(i)o=!0;else{let u=c*n,d=u-n,p=u+n;for(let g=0;g!==n;++g){let x=t[u+g];if(x!==t[d+g]||x!==t[p+g]){o=!0;break}}}if(o){if(c!==a){e[a]=e[c];let u=c*n,d=a*n;for(let p=0;p!==n;++p)t[d+p]=t[u+p]}++a}}if(s>0){e[a]=e[s];for(let c=s*n,o=a*n,h=0;h!==n;++h)t[o+h]=t[c+h];++a}return a!==e.length?(this.times=e.slice(0,a),this.values=t.slice(0,a*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,i=new n(this.name,e,t);return i.createInterpolant=this.createInterpolant,io(this.settings)&&(i.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),i}};function Qu(r,e){for(let t=0,n=r.length;t!==n;t+=2)r[t]*=e}ln.prototype.ValueTypeName="";ln.prototype.TimeBufferType=Float32Array;ln.prototype.ValueBufferType=Float32Array;ln.prototype.DefaultInterpolation=ns;var pi=class extends ln{constructor(e,t,n){super(e,t,n)}};pi.prototype.ValueTypeName="bool";pi.prototype.ValueBufferType=Array;pi.prototype.DefaultInterpolation=ts;pi.prototype.InterpolantFactoryMethodLinear=void 0;pi.prototype.InterpolantFactoryMethodSmooth=void 0;var jr=class extends ln{constructor(e,t,n,i){super(e,t,n,i)}};jr.prototype.ValueTypeName="color";var mi=class extends ln{constructor(e,t,n,i){super(e,t,n,i)}};mi.prototype.ValueTypeName="number";var Po=class extends Zn{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){let s=this.resultBuffer,a=this.sampleValues,c=this.valueSize,o=(n-t)/(i-t),h=e*c;for(let l=h+c;h!==l;h+=4)Rt.slerpFlat(s,0,a,h-c,a,h,o);return s}},gi=class extends ln{constructor(e,t,n,i){super(e,t,n,i)}InterpolantFactoryMethodLinear(e){return new Po(this.times,this.values,this.getValueSize(),e)}};gi.prototype.ValueTypeName="quaternion";gi.prototype.InterpolantFactoryMethodSmooth=void 0;var xi=class extends ln{constructor(e,t,n){super(e,t,n)}};xi.prototype.ValueTypeName="string";xi.prototype.ValueBufferType=Array;xi.prototype.DefaultInterpolation=ts;xi.prototype.InterpolantFactoryMethodLinear=void 0;xi.prototype.InterpolantFactoryMethodSmooth=void 0;var Oi=class extends ln{constructor(e,t,n,i){super(e,t,n,i)}};Oi.prototype.ValueTypeName="vector";var cs=class{constructor(e="",t=-1,n=[],i=wc){this.name=e,this.tracks=n,this.duration=t,this.blendMode=i,this.uuid=En(),this.userData={},this.duration<0&&this.resetDuration()}static parse(e){let t=[],n=e.tracks,i=1/(e.fps||1);for(let a=0,c=n.length;a!==c;++a)t.push(xm(n[a]).scale(i));let s=new this(e.name,e.duration,t,e.blendMode);return s.uuid=e.uuid,s.userData=JSON.parse(e.userData||"{}"),s}static toJSON(e){let t=[],n=e.tracks,i={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode,userData:JSON.stringify(e.userData)};for(let s=0,a=n.length;s!==a;++s)t.push(ln.toJSON(n[s]));return i}static CreateFromMorphTargetSequence(e,t,n,i){let s=t.length,a=[];for(let c=0;c<s;c++){let o=[],h=[];o.push((c+s-1)%s,c,(c+1)%s),h.push(0,1,0);let l=dm(o);o=ju(o,1,l),h=ju(h,1,l),!i&&o[0]===0&&(o.push(s),h.push(h[0])),a.push(new mi(".morphTargetInfluences["+t[c].name+"]",o,h).scale(1/n))}return new this(e,-1,a)}static findByName(e,t){let n=e;if(!Array.isArray(e)){let i=e;n=i.geometry&&i.geometry.animations||i.animations}for(let i=0;i<n.length;i++)if(n[i].name===t)return n[i];return null}static CreateClipsFromMorphTargetSequences(e,t,n){let i={},s=/^([\w-]*?)([\d]+)$/;for(let c=0,o=e.length;c<o;c++){let h=e[c],l=h.name.match(s);if(l&&l.length>1){let u=l[1],d=i[u];d||(i[u]=d=[]),d.push(h)}}let a=[];for(let c in i)a.push(this.CreateFromMorphTargetSequence(c,i[c],t,n));return a}resetDuration(){let e=this.tracks,t=0;for(let n=0,i=e.length;n!==i;++n){let s=this.tracks[n];t=Math.max(t,s.times[s.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){let e=[];for(let n=0;n<this.tracks.length;n++)e.push(this.tracks[n].clone());let t=new this.constructor(this.name,this.duration,e,this.blendMode);return t.userData=JSON.parse(JSON.stringify(this.userData)),t}toJSON(){return this.constructor.toJSON(this)}};function gm(r){switch(r.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return mi;case"vector":case"vector2":case"vector3":case"vector4":return Oi;case"color":return jr;case"quaternion":return gi;case"bool":case"boolean":return pi;case"string":return xi}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+r)}function xm(r){if(r.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");let e=gm(r.type);if(r.times===void 0){let n=[],i=[];fm(r.keys,n,i,"value"),r.times=n,r.values=i}let t;return e.parse!==void 0?t=e.parse(r):t=new e(r.name,r.times,r.values,r.interpolation),io(r.settings)&&(t.settings={inTangents:Ii(r.settings.inTangents,Float32Array),outTangents:Ii(r.settings.outTangents,Float32Array)}),t}var Xn={enabled:!1,files:{},add:function(r,e){this.enabled!==!1&&(ed(r)||(this.files[r]=e))},get:function(r){if(this.enabled!==!1&&!ed(r))return this.files[r]},remove:function(r){delete this.files[r]},clear:function(){this.files={}}};function ed(r){try{let e=r.slice(r.indexOf(":")+1);return new URL(e).protocol==="blob:"}catch{return!1}}var Lo=class{constructor(e,t,n){let i=this,s=!1,a=0,c=0,o,h=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this._abortController=null,this.itemStart=function(l){c++,s===!1&&i.onStart!==void 0&&i.onStart(l,a,c),s=!0},this.itemEnd=function(l){a++,i.onProgress!==void 0&&i.onProgress(l,a,c),a===c&&(s=!1,i.onLoad!==void 0&&i.onLoad())},this.itemError=function(l){i.onError!==void 0&&i.onError(l)},this.resolveURL=function(l){return l=l.normalize("NFC"),o?o(l):l},this.setURLModifier=function(l){return o=l,this},this.addHandler=function(l,u){return h.push(l,u),this},this.removeHandler=function(l){let u=h.indexOf(l);return u!==-1&&h.splice(u,2),this},this.getHandler=function(l){for(let u=0,d=h.length;u<d;u+=2){let p=h[u],g=h[u+1];if(p.global&&(p.lastIndex=0),p.test(l))return g}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},Qd=new Lo,Kn=class{constructor(e){this.manager=e!==void 0?e:Qd,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){let n=this;return new Promise(function(i,s){n.load(e,i,t,s)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};Kn.DEFAULT_MATERIAL_NAME="__DEFAULT";var li={},Rl=class extends Error{constructor(e,t){super(e),this.response=t}},Qs=class extends Kn{constructor(e){super(e),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let s=Xn.get(`file:${e}`);if(s!==void 0){this.manager.itemStart(e),setTimeout(()=>{t&&t(s),this.manager.itemEnd(e)},0);return}if(li[e]!==void 0){li[e].push({onLoad:t,onProgress:n,onError:i});return}li[e]=[],li[e].push({onLoad:t,onProgress:n,onError:i});let a=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),c=this.mimeType,o=this.responseType;fetch(a).then(h=>{if(h.status===200||h.status===0){if(h.status===0&&Le("FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||h.body===void 0||h.body.getReader===void 0)return h;let l=li[e],u=h.body.getReader(),d=h.headers.get("X-File-Size")||h.headers.get("Content-Length"),p=d?parseInt(d):0,g=p!==0,x=0,m=new ReadableStream({start(f){M();function M(){u.read().then(({done:T,value:y})=>{if(T)f.close();else{x+=y.byteLength;let E=new ProgressEvent("progress",{lengthComputable:g,loaded:x,total:p});for(let w=0,S=l.length;w<S;w++){let _=l[w];_.onProgress&&_.onProgress(E)}f.enqueue(y),M()}},T=>{f.error(T)})}}});return new Response(m)}else throw new Rl(`fetch for "${h.url}" responded with ${h.status}: ${h.statusText}`,h)}).then(h=>{switch(o){case"arraybuffer":return h.arrayBuffer();case"blob":return h.blob();case"document":return h.text().then(l=>new DOMParser().parseFromString(l,c));case"json":return h.json();default:if(c==="")return h.text();{let u=/charset="?([^;"\s]*)"?/i.exec(c),d=u&&u[1]?u[1].toLowerCase():void 0,p=new TextDecoder(d);return h.arrayBuffer().then(g=>p.decode(g))}}}).then(h=>{Xn.add(`file:${e}`,h);let l=li[e];delete li[e];for(let u=0,d=l.length;u<d;u++){let p=l[u];p.onLoad&&p.onLoad(h)}}).catch(h=>{let l=li[e];if(l===void 0)throw this.manager.itemError(e),h;delete li[e];for(let u=0,d=l.length;u<d;u++){let p=l[u];p.onError&&p.onError(h)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}};var Ns=new WeakMap,No=class extends Kn{constructor(e){super(e)}load(e,t,n,i){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let s=this,a=Xn.get(`image:${e}`);if(a!==void 0){if(a.complete===!0)s.manager.itemStart(e),setTimeout(function(){t&&t(a),s.manager.itemEnd(e)},0);else{let u=Ns.get(a);u===void 0&&(u=[],Ns.set(a,u)),u.push({onLoad:t,onError:i})}return a}let c=Hs("img");function o(){l(),t&&t(this);let u=Ns.get(this)||[];for(let d=0;d<u.length;d++){let p=u[d];p.onLoad&&p.onLoad(this)}Ns.delete(this),s.manager.itemEnd(e)}function h(u){l(),i&&i(u),Xn.remove(`image:${e}`);let d=Ns.get(this)||[];for(let p=0;p<d.length;p++){let g=d[p];g.onError&&g.onError(u)}Ns.delete(this),s.manager.itemError(e),s.manager.itemEnd(e)}function l(){c.removeEventListener("load",o,!1),c.removeEventListener("error",h,!1)}return c.addEventListener("load",o,!1),c.addEventListener("error",h,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(c.crossOrigin=this.crossOrigin),Xn.add(`image:${e}`,c),s.manager.itemStart(e),c.src=e,c}};var Bi=class extends Kn{constructor(e){super(e)}load(e,t,n,i){let s=new Ht,a=new No(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(c){s.image=c,s.needsUpdate=!0,t!==void 0&&t(s)},n,i),s}},ls=class extends At{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Ae(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}},Hi=class extends ls{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(At.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Ae(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){let t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}},yl=new Fe,td=new L,nd=new L,er=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ae(512,512),this.mapType=hn,this.map=null,this.mapPass=null,this.matrix=new Fe,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Ys,this._frameExtents=new ae(1,1),this._viewportCount=1,this._viewports=[new gt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera;td.setFromMatrixPosition(e.matrixWorld),t.position.copy(td),nd.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(nd),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,n,i){yl.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),n.setFromProjectionMatrix(yl,e.coordinateSystem,e.reversedDepth);let s=this._frameExtents,a=i?i.z/s.x:1,c=i?i.w/s.y:1,o=i?i.x/s.x:0,h=i?i.y/s.y:0;e.coordinateSystem===Bs||e.reversedDepth?t.set(.5*a,0,0,.5*a+o,0,.5*c,0,.5*c+h,0,0,1,0,0,0,0,1):t.set(.5*a,0,0,.5*a+o,0,.5*c,0,.5*c+h,0,0,.5,.5,0,0,0,1),t.multiply(yl)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},Qa=new L,eo=new Rt,Wn=new L,Qr=class extends At{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Fe,this.projectionMatrix=new Fe,this.projectionMatrixInverse=new Fe,this.coordinateSystem=Dn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Qa,eo,Wn),Wn.x===1&&Wn.y===1&&Wn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Qa,eo,Wn.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(Qa,eo,Wn),Wn.x===1&&Wn.y===1&&Wn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Qa,eo,Wn.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},Ci=new L,id=new ae,sd=new ae,Ot=class extends Qr{constructor(e=50,t=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=is*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(Ar*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return is*2*Math.atan(Math.tan(Ar*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Ci.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Ci.x,Ci.y).multiplyScalar(-e/Ci.z),Ci.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Ci.x,Ci.y).multiplyScalar(-e/Ci.z)}getViewSize(e,t){return this.getViewBounds(e,id,sd),t.subVectors(sd,id)}setViewOffset(e,t,n,i,s,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(Ar*.5*this.fov)/this.zoom,n=2*t,i=this.aspect*n,s=-.5*i,a=this.view;if(this.view!==null&&this.view.enabled){let o=a.fullWidth,h=a.fullHeight;s+=a.offsetX*i/o,t-=a.offsetY*n/h,i*=a.width/o,n*=a.height/h}let c=this.filmOffset;c!==0&&(s+=e*c/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+i,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},Cl=class extends er{constructor(){super(new Ot(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){let t=this.camera,n=is*2*e.angle*this.focus,i=this.mapSize.width/this.mapSize.height*this.aspect,s=e.distance||t.far;(n!==t.fov||i!==t.aspect||s!==t.far)&&(t.fov=n,t.aspect=i,t.far=s,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this.aspect=e.aspect,this}toJSON(){let e=super.toJSON();return e.focus=this.focus,e.aspect=this.aspect,e}},ea=class extends ls{constructor(e,t,n=0,i=Math.PI/3,s=0,a=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(At.DEFAULT_UP),this.updateMatrix(),this.target=new At,this.distance=n,this.angle=i,this.penumbra=s,this.decay=a,this.map=null,this.shadow=new Cl}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.map=e.map,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.angle=this.angle,t.object.decay=this.decay,t.object.penumbra=this.penumbra,t.object.target=this.target.uuid,this.map&&this.map.isTexture&&(t.object.map=this.map.toJSON(e).uuid),t.object.shadow=this.shadow.toJSON(),t}},Il=class extends er{constructor(){super(new Ot(90,1,.5,500)),this.isPointLightShadow=!0}},ta=class extends ls{constructor(e,t,n=0,i=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new Il}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}},ki=class extends Qr{constructor(e=-1,t=1,n=1,i=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=i,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,i,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2,s=n-e,a=n+e,c=i+t,o=i-t;if(this.view!==null&&this.view.enabled){let h=(this.right-this.left)/this.view.fullWidth/this.zoom,l=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=h*this.view.offsetX,a=s+h*this.view.width,c-=l*this.view.offsetY,o=c-l*this.view.height}this.projectionMatrix.makeOrthographic(s,a,c,o,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},Pl=class extends er{constructor(){super(new ki(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},zn=class extends ls{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(At.DEFAULT_UP),this.updateMatrix(),this.target=new At,this.shadow=new Pl}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}};var _i=class{static extractUrlBase(e){let t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}};var vl=new WeakMap,na=class extends Kn{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&Le("ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&Le("ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"},this._abortController=new AbortController}setOptions(e){return this.options=e,this}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let s=this,a=Xn.get(`image-bitmap:${e}`);if(a!==void 0){if(s.manager.itemStart(e),a.then){a.then(h=>{vl.has(a)===!0?(i&&i(vl.get(a)),s.manager.itemError(e),s.manager.itemEnd(e)):(t&&t(h),s.manager.itemEnd(e))});return}setTimeout(function(){t&&t(a),s.manager.itemEnd(e)},0);return}let c={};c.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",c.headers=this.requestHeader,c.signal=typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;let o=fetch(e,c).then(function(h){return h.blob()}).then(function(h){return createImageBitmap(h,Object.assign({},s.options,{colorSpaceConversion:"none"}))}).then(function(h){return Xn.add(`image-bitmap:${e}`,h),t&&t(h),s.manager.itemEnd(e),h}).catch(function(h){i&&i(h),vl.set(o,h),Xn.remove(`image-bitmap:${e}`),s.manager.itemError(e),s.manager.itemEnd(e)});Xn.add(`image-bitmap:${e}`,o),s.manager.itemStart(e)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}};var Ds=-90,Us=1,Do=class extends At{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let i=new Ot(Ds,Us,e,t);i.layers=this.layers,this.add(i);let s=new Ot(Ds,Us,e,t);s.layers=this.layers,this.add(s);let a=new Ot(Ds,Us,e,t);a.layers=this.layers,this.add(a);let c=new Ot(Ds,Us,e,t);c.layers=this.layers,this.add(c);let o=new Ot(Ds,Us,e,t);o.layers=this.layers,this.add(o);let h=new Ot(Ds,Us,e,t);h.layers=this.layers,this.add(h)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,i,s,a,c,o]=t;for(let h of t)this.remove(h);if(e===Dn)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),c.up.set(0,1,0),c.lookAt(0,0,1),o.up.set(0,1,0),o.lookAt(0,0,-1);else if(e===Bs)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),c.up.set(0,-1,0),c.lookAt(0,0,1),o.up.set(0,-1,0),o.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let h of t)this.add(h),h.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[s,a,c,o,h,l]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;let x=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let m=!1;e.isWebGLRenderer===!0?m=e.state.buffers.depth.getReversed():m=e.reversedDepthBuffer,e.setRenderTarget(n,0,i),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,s),e.setRenderTarget(n,1,i),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,i),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),e.setRenderTarget(n,3,i),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,4,i),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,h),n.texture.generateMipmaps=x,e.setRenderTarget(n,5,i),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(u,d,p),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}},Uo=class extends Ot{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}};var zo=class{constructor(e,t,n){this.binding=e,this.valueSize=n;let i,s,a;switch(t){case"quaternion":i=this._slerp,s=this._slerpAdditive,a=this._setAdditiveIdentityQuaternion,this.buffer=new Float64Array(n*6),this._workIndex=5;break;case"string":case"bool":i=this._select,s=this._select,a=this._setAdditiveIdentityOther,this.buffer=new Array(n*5);break;default:i=this._lerp,s=this._lerpAdditive,a=this._setAdditiveIdentityNumeric,this.buffer=new Float64Array(n*5)}this._mixBufferRegion=i,this._mixBufferRegionAdditive=s,this._setIdentity=a,this._origIndex=3,this._addIndex=4,this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,this.useCount=0,this.referenceCount=0}accumulate(e,t){let n=this.buffer,i=this.valueSize,s=e*i+i,a=this.cumulativeWeight;if(a===0){for(let c=0;c!==i;++c)n[s+c]=n[c];a=t}else{a+=t;let c=t/a;this._mixBufferRegion(n,s,0,c,i)}this.cumulativeWeight=a}accumulateAdditive(e){let t=this.buffer,n=this.valueSize,i=n*this._addIndex;this.cumulativeWeightAdditive===0&&this._setIdentity(),this._mixBufferRegionAdditive(t,i,0,e,n),this.cumulativeWeightAdditive+=e}apply(e){let t=this.valueSize,n=this.buffer,i=e*t+t,s=this.cumulativeWeight,a=this.cumulativeWeightAdditive,c=this.binding;if(this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,s<1){let o=t*this._origIndex;this._mixBufferRegion(n,i,o,1-s,t)}a>0&&this._mixBufferRegionAdditive(n,i,this._addIndex*t,1,t);for(let o=t,h=t+t;o!==h;++o)if(n[o]!==n[o+t]){c.setValue(n,i);break}}saveOriginalState(){let e=this.binding,t=this.buffer,n=this.valueSize,i=n*this._origIndex;e.getValue(t,i);for(let s=n,a=i;s!==a;++s)t[s]=t[i+s%n];this._setIdentity(),this.cumulativeWeight=0,this.cumulativeWeightAdditive=0}restoreOriginalState(){let e=this.valueSize*3;this.binding.setValue(this.buffer,e)}_setAdditiveIdentityNumeric(){let e=this._addIndex*this.valueSize,t=e+this.valueSize;for(let n=e;n<t;n++)this.buffer[n]=0}_setAdditiveIdentityQuaternion(){this._setAdditiveIdentityNumeric(),this.buffer[this._addIndex*this.valueSize+3]=1}_setAdditiveIdentityOther(){let e=this._origIndex*this.valueSize,t=this._addIndex*this.valueSize;for(let n=0;n<this.valueSize;n++)this.buffer[t+n]=this.buffer[e+n]}_select(e,t,n,i,s){if(i>=.5)for(let a=0;a!==s;++a)e[t+a]=e[n+a]}_slerp(e,t,n,i){Rt.slerpFlat(e,t,e,t,e,n,i)}_slerpAdditive(e,t,n,i,s){let a=this._workIndex*s;Rt.multiplyQuaternionsFlat(e,a,e,t,e,n),Rt.slerpFlat(e,t,e,t,e,a,i)}_lerp(e,t,n,i,s){let a=1-i;for(let c=0;c!==s;++c){let o=t+c;e[o]=e[o]*a+e[n+c]*i}}_lerpAdditive(e,t,n,i,s){for(let a=0;a!==s;++a){let c=t+a;e[c]=e[c]+e[n+a]*i}}},oh="\\[\\]\\.:\\/",_m=new RegExp("["+oh+"]","g"),ch="[^"+oh+"]",ym="[^"+oh.replace("\\.","")+"]",vm=/((?:WC+[\/:])*)/.source.replace("WC",ch),Mm=/(WCOD+)?/.source.replace("WCOD",ym),bm=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",ch),Em=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",ch),Sm=new RegExp("^"+vm+Mm+bm+Em+"$"),Tm=["material","materials","bones","map"],Ll=class{constructor(e,t,n){let i=n||Mt.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,i)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,i=this._bindings[n];i!==void 0&&i.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let i=this._targetGroup.nCachedObjects_,s=n.length;i!==s;++i)n[i].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},Mt=class r{constructor(e,t,n){this.path=t,this.parsedPath=n||r.parseTrackName(t),this.node=r.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new r.Composite(e,t,n):new r(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(_m,"")}static parseTrackName(e){let t=Sm.exec(e);if(t===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},i=n.nodeName&&n.nodeName.lastIndexOf(".");if(i!==void 0&&i!==-1){let s=n.nodeName.substring(i+1);Tm.indexOf(s)!==-1&&(n.nodeName=n.nodeName.substring(0,i),n.objectName=s)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(s){for(let a=0;a<s.length;a++){let c=s[a];if(c.name===t||c.uuid===t)return c;let o=n(c.children);if(o)return o}return null},i=n(e.children);if(i)return i}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)e[t++]=n[i]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,i=t.propertyName,s=t.propertyIndex;if(e||(e=r.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){Le("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let h=t.objectIndex;switch(n){case"materials":if(!e.material){He("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){He("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){He("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let l=0;l<e.length;l++)if(e[l].name===h){h=l;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){He("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){He("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){He("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(h!==void 0){if(e[h]===void 0){He("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[h]}}let a=e[i];if(a===void 0){let h=t.nodeName;He("PropertyBinding: Trying to update property for track: "+h+"."+i+" but it wasn't found.",e);return}let c=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?c=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(c=this.Versioning.MatrixWorldNeedsUpdate);let o=this.BindingType.Direct;if(s!==void 0){if(i==="morphTargetInfluences"){if(!e.geometry){He("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){He("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[s]!==void 0&&(s=e.morphTargetDictionary[s])}o=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=s}else a.fromArray!==void 0&&a.toArray!==void 0?(o=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(o=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=i;this.getValue=this.GetterByBindingType[o],this.setValue=this.SetterByBindingTypeAndVersioning[o][c]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Mt.Composite=Ll;Mt.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Mt.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Mt.prototype.GetterByBindingType=[Mt.prototype._getValue_direct,Mt.prototype._getValue_array,Mt.prototype._getValue_arrayElement,Mt.prototype._getValue_toArray];Mt.prototype.SetterByBindingTypeAndVersioning=[[Mt.prototype._setValue_direct,Mt.prototype._setValue_direct_setNeedsUpdate,Mt.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Mt.prototype._setValue_array,Mt.prototype._setValue_array_setNeedsUpdate,Mt.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Mt.prototype._setValue_arrayElement,Mt.prototype._setValue_arrayElement_setNeedsUpdate,Mt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Mt.prototype._setValue_fromArray,Mt.prototype._setValue_fromArray_setNeedsUpdate,Mt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var Fo=class{constructor(e,t,n=null,i=t.blendMode){this._mixer=e,this._clip=t,this._localRoot=n,this.blendMode=i;let s=t.tracks,a=s.length,c=new Array(a),o={endingStart:$i,endingEnd:$i};for(let h=0;h!==a;++h){let l=s[h].createInterpolant(null);c[h]=l,l.settings=o}this._interpolantSettings=o,this._interpolants=c,this._propertyBindings=new Array(a),this._cacheIndex=null,this._byClipCacheIndex=null,this._timeScaleInterpolant=null,this._restoreTimeScale=null,this._weightInterpolant=null,this.loop=Tc,this._loopCount=-1,this._startTime=null,this.time=0,this.timeScale=1,this._effectiveTimeScale=1,this.weight=1,this._effectiveWeight=1,this.repetitions=1/0,this.paused=!1,this.enabled=!0,this.clampWhenFinished=!1,this.zeroSlopeAtStart=!0,this.zeroSlopeAtEnd=!0}play(){return this._mixer._activateAction(this),this}stop(){return this._mixer._deactivateAction(this),this.reset()}reset(){return this.paused=!1,this.enabled=!0,this.time=0,this._loopCount=-1,this._startTime=null,this.stopFading().stopWarping()}isRunning(){return this.enabled&&!this.paused&&this.timeScale!==0&&this._startTime===null&&this._mixer._isActiveAction(this)}isScheduled(){return this._mixer._isActiveAction(this)}startAt(e){return this._startTime=e,this}setLoop(e,t){return this.loop=e,this.repetitions=t,this}setEffectiveWeight(e){return this.weight=e,this._effectiveWeight=this.enabled?e:0,this.stopFading()}getEffectiveWeight(){return this._effectiveWeight}fadeIn(e){return this._scheduleFading(e,0,1)}fadeOut(e){return this._scheduleFading(e,1,0)}crossFadeFrom(e,t,n=!1){if(e.fadeOut(t),this.fadeIn(t),n===!0){let i=this._clip.duration,s=e._clip.duration,a=s/i,c=i/s;e._restoreTimeScale=e.timeScale,this._restoreTimeScale=this.timeScale,e.warp(1,a,t),this.warp(c,1,t)}return this}crossFadeTo(e,t,n=!1){return e.crossFadeFrom(this,t,n)}stopFading(){let e=this._weightInterpolant;return e!==null&&(this._weightInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this}setEffectiveTimeScale(e){return this.timeScale=e,this._effectiveTimeScale=this.paused?0:e,this.stopWarping()}getEffectiveTimeScale(){return this._effectiveTimeScale}setDuration(e){return this.timeScale=this._clip.duration/e,this.stopWarping()}syncWith(e){return this.time=e.time,this.timeScale=e.timeScale,this.stopWarping()}halt(e){return this.warp(this._effectiveTimeScale,0,e)}warp(e,t,n){let i=this._mixer,s=i.time,a=this.timeScale,c=this._timeScaleInterpolant;c===null&&(c=i._lendControlInterpolant(),this._timeScaleInterpolant=c);let o=c.parameterPositions,h=c.sampleValues;return o[0]=s,o[1]=s+n,h[0]=e/a,h[1]=t/a,this}stopWarping(){let e=this._timeScaleInterpolant;return e!==null&&(this._timeScaleInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this._restoreTimeScale=null,this}getMixer(){return this._mixer}getClip(){return this._clip}getRoot(){return this._localRoot||this._mixer._root}_update(e,t,n,i){if(!this.enabled){this._updateWeight(e);return}let s=this._startTime;if(s!==null){let o=(e-s)*n;o<0||n===0?t=0:(this._startTime=null,t=n*o)}t*=this._updateTimeScale(e);let a=this._updateTime(t),c=this._updateWeight(e);if(c>0){let o=this._interpolants,h=this._propertyBindings;switch(this.blendMode){case Pd:for(let l=0,u=o.length;l!==u;++l)o[l].evaluate(a),h[l].accumulateAdditive(c);break;case wc:default:for(let l=0,u=o.length;l!==u;++l)o[l].evaluate(a),h[l].accumulate(i,c)}}}_updateWeight(e){let t=0;if(this.enabled){t=this.weight;let n=this._weightInterpolant;if(n!==null){let i=n.evaluate(e)[0];t*=i,e>n.parameterPositions[1]&&(this.stopFading(),i===0&&(this.enabled=!1))}}return this._effectiveWeight=t,t}_updateTimeScale(e){let t=0;if(!this.paused){t=this.timeScale;let n=this._timeScaleInterpolant;if(n!==null){let i=n.evaluate(e)[0];t*=i,e>n.parameterPositions[1]&&(t===0?this.paused=!0:(this._restoreTimeScale!==null&&(t=this._restoreTimeScale),this.timeScale=t),this.stopWarping())}}return this._effectiveTimeScale=t,t}_updateTime(e){let t=this._clip.duration,n=this.loop,i=this.time+e,s=this._loopCount,a=n===Id;if(e===0)return s===-1?i:a&&(s&1)===1?t-i:i;if(n===Sc){s===-1&&(this._loopCount=0,this._setEndings(!0,!0,!1));e:{if(i>=t)i=t;else if(i<0)i=0;else{this.time=i;break e}this.clampWhenFinished?this.paused=!0:this.enabled=!1,this.time=i,this._mixer.dispatchEvent({type:"finished",action:this,direction:e<0?-1:1})}}else{if(s===-1&&(e>=0?(s=0,this._setEndings(!0,this.repetitions===0,a)):this._setEndings(this.repetitions===0,!0,a)),i>=t||i<0){let c=Math.floor(i/t);i-=t*c,s+=Math.abs(c);let o=this.repetitions-s;if(o<=0)this.clampWhenFinished?this.paused=!0:this.enabled=!1,i=e>0?t:0,this.time=i,this._mixer.dispatchEvent({type:"finished",action:this,direction:e>0?1:-1});else{if(o===1){let h=e<0;this._setEndings(h,!h,a)}else this._setEndings(!1,!1,a);this._loopCount=s,this.time=i,this._mixer.dispatchEvent({type:"loop",action:this,loopDelta:c})}}else this._loopCount=s,this.time=i;if(a&&(s&1)===1)return t-i}return i}_setEndings(e,t,n){let i=this._interpolantSettings;n?(i.endingStart=ji,i.endingEnd=ji):(e?i.endingStart=this.zeroSlopeAtStart?ji:$i:i.endingStart=Pr,t?i.endingEnd=this.zeroSlopeAtEnd?ji:$i:i.endingEnd=Pr)}_scheduleFading(e,t,n){let i=this._mixer,s=i.time,a=this._weightInterpolant;a===null&&(a=i._lendControlInterpolant(),this._weightInterpolant=a);let c=a.parameterPositions,o=a.sampleValues;return c[0]=s,o[0]=t,c[1]=s+e,o[1]=n,this}},wm=new Float32Array(1),ia=class extends Un{constructor(e){super(),this._root=e,this._initMemoryManager(),this._accuIndex=0,this.time=0,this.timeScale=1,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}_bindAction(e,t){let n=e._localRoot||this._root,i=e._clip.tracks,s=i.length,a=e._propertyBindings,c=e._interpolants,o=n.uuid,h=this._bindingsByRootAndName,l=h[o];l===void 0&&(l={},h[o]=l);for(let u=0;u!==s;++u){let d=i[u],p=d.name,g=l[p];if(g!==void 0)++g.referenceCount,a[u]=g;else{if(g=a[u],g!==void 0){g._cacheIndex===null&&(++g.referenceCount,this._addInactiveBinding(g,o,p));continue}let x=t&&t._propertyBindings[u].binding.parsedPath;g=new zo(Mt.create(n,p,x),d.ValueTypeName,d.getValueSize()),++g.referenceCount,this._addInactiveBinding(g,o,p),a[u]=g}c[u].resultBuffer=g.buffer}}_activateAction(e){if(!this._isActiveAction(e)){if(e._cacheIndex===null){let n=(e._localRoot||this._root).uuid,i=e._clip.uuid,s=this._actionsByClip[i];this._bindAction(e,s&&s.knownActions[0]),this._addInactiveAction(e,i,n)}let t=e._propertyBindings;for(let n=0,i=t.length;n!==i;++n){let s=t[n];s.useCount++===0&&(this._lendBinding(s),s.saveOriginalState())}this._lendAction(e)}}_deactivateAction(e){if(this._isActiveAction(e)){let t=e._propertyBindings;for(let n=0,i=t.length;n!==i;++n){let s=t[n];--s.useCount===0&&(s.restoreOriginalState(),this._takeBackBinding(s))}this._takeBackAction(e)}}_initMemoryManager(){this._actions=[],this._nActiveActions=0,this._actionsByClip={},this._bindings=[],this._nActiveBindings=0,this._bindingsByRootAndName={},this._controlInterpolants=[],this._nActiveControlInterpolants=0;let e=this;this.stats={actions:{get total(){return e._actions.length},get inUse(){return e._nActiveActions}},bindings:{get total(){return e._bindings.length},get inUse(){return e._nActiveBindings}},controlInterpolants:{get total(){return e._controlInterpolants.length},get inUse(){return e._nActiveControlInterpolants}}}}_isActiveAction(e){let t=e._cacheIndex;return t!==null&&t<this._nActiveActions}_addInactiveAction(e,t,n){let i=this._actions,s=this._actionsByClip,a=s[t];if(a===void 0)a={knownActions:[e],actionByRoot:{}},e._byClipCacheIndex=0,s[t]=a;else{let c=a.knownActions;e._byClipCacheIndex=c.length,c.push(e)}e._cacheIndex=i.length,i.push(e),a.actionByRoot[n]=e}_removeInactiveAction(e){let t=this._actions,n=t[t.length-1],i=e._cacheIndex;n._cacheIndex=i,t[i]=n,t.pop(),e._cacheIndex=null;let s=e._clip.uuid,a=this._actionsByClip,c=a[s],o=c.knownActions,h=o[o.length-1],l=e._byClipCacheIndex;h._byClipCacheIndex=l,o[l]=h,o.pop(),e._byClipCacheIndex=null;let u=c.actionByRoot,d=(e._localRoot||this._root).uuid;delete u[d],o.length===0&&delete a[s],this._removeInactiveBindingsForAction(e)}_removeInactiveBindingsForAction(e){let t=e._propertyBindings;for(let n=0,i=t.length;n!==i;++n){let s=t[n];--s.referenceCount===0&&this._removeInactiveBinding(s)}}_lendAction(e){let t=this._actions,n=e._cacheIndex,i=this._nActiveActions++,s=t[i];e._cacheIndex=i,t[i]=e,s._cacheIndex=n,t[n]=s}_takeBackAction(e){let t=this._actions,n=e._cacheIndex,i=--this._nActiveActions,s=t[i];e._cacheIndex=i,t[i]=e,s._cacheIndex=n,t[n]=s}_addInactiveBinding(e,t,n){let i=this._bindingsByRootAndName,s=this._bindings,a=i[t];a===void 0&&(a={},i[t]=a),a[n]=e,e._cacheIndex=s.length,s.push(e)}_removeInactiveBinding(e){let t=this._bindings,n=e.binding,i=n.rootNode.uuid,s=n.path,a=this._bindingsByRootAndName,c=a[i],o=t[t.length-1],h=e._cacheIndex;o._cacheIndex=h,t[h]=o,t.pop(),delete c[s],Object.keys(c).length===0&&delete a[i]}_lendBinding(e){let t=this._bindings,n=e._cacheIndex,i=this._nActiveBindings++,s=t[i];e._cacheIndex=i,t[i]=e,s._cacheIndex=n,t[n]=s}_takeBackBinding(e){let t=this._bindings,n=e._cacheIndex,i=--this._nActiveBindings,s=t[i];e._cacheIndex=i,t[i]=e,s._cacheIndex=n,t[n]=s}_lendControlInterpolant(){let e=this._controlInterpolants,t=this._nActiveControlInterpolants++,n=e[t];return n===void 0&&(n=new $r(new Float32Array(2),new Float32Array(2),1,wm),n.__cacheIndex=t,e[t]=n),n}_takeBackControlInterpolant(e){let t=this._controlInterpolants,n=e.__cacheIndex,i=--this._nActiveControlInterpolants,s=t[i];e.__cacheIndex=i,t[i]=e,s.__cacheIndex=n,t[n]=s}clipAction(e,t,n){let i=t||this._root,s=i.uuid,a=typeof e=="string"?cs.findByName(i,e):e,c=a!==null?a.uuid:e,o=this._actionsByClip[c],h=null;if(n===void 0&&(a!==null?n=a.blendMode:n=wc),o!==void 0){let u=o.actionByRoot[s];if(u!==void 0&&u.blendMode===n)return u;h=o.knownActions[0],a===null&&(a=h._clip)}if(a===null)return null;let l=new Fo(this,a,t,n);return this._bindAction(l,h),this._addInactiveAction(l,c,s),l}existingAction(e,t){let n=t||this._root,i=n.uuid,s=typeof e=="string"?cs.findByName(n,e):e,a=s?s.uuid:e,c=this._actionsByClip[a];return c!==void 0&&c.actionByRoot[i]||null}stopAllAction(){let e=this._actions,t=this._nActiveActions;for(let n=t-1;n>=0;--n)e[n].stop();return this}update(e){e*=this.timeScale;let t=this._actions,n=this._nActiveActions,i=this.time+=e,s=Math.sign(e),a=this._accuIndex^=1;for(let h=0;h!==n;++h)t[h]._update(i,e,s,a);let c=this._bindings,o=this._nActiveBindings;for(let h=0;h!==o;++h)c[h].apply(a);return this}setTime(e){this.time=0;for(let t=0;t<this._actions.length;t++)this._actions[t].time=0;return this.update(e)}getRoot(){return this._root}uncacheClip(e){let t=this._actions,n=e.uuid,i=this._actionsByClip,s=i[n];if(s!==void 0){let a=s.knownActions;for(let c=0,o=a.length;c!==o;++c){let h=a[c];this._deactivateAction(h);let l=h._cacheIndex,u=t[t.length-1];h._cacheIndex=null,h._byClipCacheIndex=null,u._cacheIndex=l,t[l]=u,t.pop(),this._removeInactiveBindingsForAction(h)}delete i[n]}}uncacheRoot(e){let t=e.uuid,n=this._actionsByClip;for(let a in n){let c=n[a].actionByRoot,o=c[t];o!==void 0&&(this._deactivateAction(o),this._removeInactiveAction(o))}let i=this._bindingsByRootAndName,s=i[t];if(s!==void 0)for(let a in s){let c=s[a];c.restoreOriginalState(),this._removeInactiveBinding(c)}}uncacheAction(e,t){let n=this.existingAction(e,t);n!==null&&(this._deactivateAction(n),this._removeInactiveAction(n))}};var rd=new Fe,sa=class{constructor(e,t,n=0,i=1/0){this.ray=new Ni(e,t),this.near=n,this.far=i,this.camera=null,this.layers=new Vs,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,t.projectionMatrix.elements[14]).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):He("Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return rd.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(rd),this}intersectObject(e,t=!0,n=[]){return Nl(e,this,n,t),n.sort(ad),n}intersectObjects(e,t=!0,n=[]){for(let i=0,s=e.length;i<s;i++)Nl(e[i],this,n,t);return n.sort(ad),n}};function ad(r,e){return r.distance-e.distance}function Nl(r,e,t,n){let i=!0;if(r.layers.test(e.layers)&&r.raycast(e,t)===!1&&(i=!1),i===!0&&n===!0){let s=r.children;for(let a=0,c=s.length;a<c;a++)Nl(s[a],e,t,!0)}}var Dl=class r{static{r.prototype.isMatrix2=!0}constructor(e,t,n,i){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,i)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,i){let s=this.elements;return s[0]=e,s[2]=t,s[1]=n,s[3]=i,this}};function lh(r,e,t,n){let i=Am(n);switch(t){case jl:return r*e;case Wo:return r*e/i.components*i.byteLength;case Xo:return r*e/i.components*i.byteLength;case Wi:return r*e*2/i.components*i.byteLength;case qo:return r*e*2/i.components*i.byteLength;case Ql:return r*e*3/i.components*i.byteLength;case xn:return r*e*4/i.components*i.byteLength;case Yo:return r*e*4/i.components*i.byteLength;case ca:case la:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*8;case ha:case ua:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*16;case Ko:case $o:return Math.max(r,16)*Math.max(e,8)/4;case Zo:case Jo:return Math.max(r,8)*Math.max(e,8)/2;case jo:case Qo:case tc:case nc:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*8;case ec:case da:case ic:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*16;case sc:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*16;case rc:return Math.floor((r+4)/5)*Math.floor((e+3)/4)*16;case ac:return Math.floor((r+4)/5)*Math.floor((e+4)/5)*16;case oc:return Math.floor((r+5)/6)*Math.floor((e+4)/5)*16;case cc:return Math.floor((r+5)/6)*Math.floor((e+5)/6)*16;case lc:return Math.floor((r+7)/8)*Math.floor((e+4)/5)*16;case hc:return Math.floor((r+7)/8)*Math.floor((e+5)/6)*16;case uc:return Math.floor((r+7)/8)*Math.floor((e+7)/8)*16;case dc:return Math.floor((r+9)/10)*Math.floor((e+4)/5)*16;case fc:return Math.floor((r+9)/10)*Math.floor((e+5)/6)*16;case pc:return Math.floor((r+9)/10)*Math.floor((e+7)/8)*16;case mc:return Math.floor((r+9)/10)*Math.floor((e+9)/10)*16;case gc:return Math.floor((r+11)/12)*Math.floor((e+9)/10)*16;case xc:return Math.floor((r+11)/12)*Math.floor((e+11)/12)*16;case _c:case yc:case vc:return Math.ceil(r/4)*Math.ceil(e/4)*16;case Mc:case bc:return Math.ceil(r/4)*Math.ceil(e/4)*8;case fa:case Ec:return Math.ceil(r/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Am(r){switch(r){case hn:case Zl:return{byteLength:1,components:1};case rr:case Kl:case Hn:return{byteLength:2,components:1};case Go:case Vo:return{byteLength:2,components:4};case Bn:case ko:case gn:return{byteLength:4,components:1};case Jl:case $l:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${r}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"186"}}));typeof window<"u"&&(window.__THREE__?Le("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="186");function bf(){let r=null,e=!1,t=null,n=null;function i(s,a){n=r.requestAnimationFrame(i),t(s,a)}return{start:function(){e!==!0&&t!==null&&r!==null&&(n=r.requestAnimationFrame(i),e=!0)},stop:function(){r!==null&&r.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){r=s}}}function Cm(r){let e=new WeakMap;function t(c,o){let h=c.array,l=c.usage,u=h.byteLength,d=r.createBuffer();r.bindBuffer(o,d),r.bufferData(o,h,l),c.onUploadCallback();let p;if(h instanceof Float32Array)p=r.FLOAT;else if(typeof Float16Array<"u"&&h instanceof Float16Array)p=r.HALF_FLOAT;else if(h instanceof Uint16Array)c.isFloat16BufferAttribute?p=r.HALF_FLOAT:p=r.UNSIGNED_SHORT;else if(h instanceof Int16Array)p=r.SHORT;else if(h instanceof Uint32Array)p=r.UNSIGNED_INT;else if(h instanceof Int32Array)p=r.INT;else if(h instanceof Int8Array)p=r.BYTE;else if(h instanceof Uint8Array)p=r.UNSIGNED_BYTE;else if(h instanceof Uint8ClampedArray)p=r.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+h);return{buffer:d,type:p,bytesPerElement:h.BYTES_PER_ELEMENT,version:c.version,size:u}}function n(c,o,h){let l=o.array,u=o.updateRanges;if(r.bindBuffer(h,c),u.length===0)r.bufferSubData(h,0,l);else{u.sort((p,g)=>p.start-g.start);let d=0;for(let p=1;p<u.length;p++){let g=u[d],x=u[p];x.start<=g.start+g.count+1?g.count=Math.max(g.count,x.start+x.count-g.start):(++d,u[d]=x)}u.length=d+1;for(let p=0,g=u.length;p<g;p++){let x=u[p];r.bufferSubData(h,x.start*l.BYTES_PER_ELEMENT,l,x.start,x.count)}o.clearUpdateRanges()}o.onUploadCallback()}function i(c){return c.isInterleavedBufferAttribute&&(c=c.data),e.get(c)}function s(c){c.isInterleavedBufferAttribute&&(c=c.data);let o=e.get(c);o&&(r.deleteBuffer(o.buffer),e.delete(c))}function a(c,o){if(c.isInterleavedBufferAttribute&&(c=c.data),c.isGLBufferAttribute){let l=e.get(c);(!l||l.version<c.version)&&e.set(c,{buffer:c.buffer,type:c.type,bytesPerElement:c.elementSize,version:c.version});return}let h=e.get(c);if(h===void 0)e.set(c,t(c,o));else if(h.version<c.version){if(h.size!==c.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(h.buffer,c,o),h.version=c.version}}return{get:i,remove:s,update:a}}var Im=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Pm=`#ifdef USE_ALPHAHASH
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
#endif`,Lm=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Nm=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Dm=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Um=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,zm=`#ifdef USE_AOMAP
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
#endif`,Fm=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Om=`#ifdef USE_BATCHING
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
#endif`,Bm=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Hm=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,km=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Gm=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Vm=`#ifdef USE_IRIDESCENCE
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
#endif`,Wm=`#ifdef USE_BUMPMAP
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
#endif`,Xm=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,qm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Ym=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Zm=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Km=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,Jm=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,$m=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,jm=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,Qm=`#define PI 3.141592653589793
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
} // validated`,eg=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,tg=`vec3 transformedNormal = objectNormal;
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
#endif`,ng=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,ig=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,sg=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,rg=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,ag="gl_FragColor = linearToOutputTexel( gl_FragColor );",og=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,cg=`#ifdef USE_ENVMAP
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
#endif`,lg=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,hg=`#ifdef USE_ENVMAP
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
#endif`,ug=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,dg=`#ifdef USE_ENVMAP
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
#endif`,fg=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,pg=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,mg=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,gg=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,xg=`#ifdef USE_GRADIENTMAP
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
}`,_g=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,yg=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,vg=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Mg=`uniform bool receiveShadow;
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
#include <lightprobes_pars_fragment>`,bg=`#ifdef USE_ENVMAP
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
#endif`,Eg=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Sg=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Tg=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,wg=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Ag=`PhysicalMaterial material;
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
#endif`,Rg=`uniform sampler2D dfgLUT;
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
}`,Cg=`
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
#endif`,Ig=`#if defined( RE_IndirectDiffuse )
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
#endif`,Pg=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Lg=`#ifdef USE_LIGHT_PROBES_GRID
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
#endif`,Ng=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Dg=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Ug=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,zg=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Fg=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Og=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Bg=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Hg=`#if defined( USE_POINTS_UV )
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
#endif`,kg=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Gg=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Vg=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Wg=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Xg=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,qg=`#ifdef USE_MORPHTARGETS
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
#endif`,Yg=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Zg=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Kg=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Jg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,$g=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,jg=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,Qg=`#ifdef USE_NORMALMAP
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
#endif`,e0=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,t0=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,n0=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,i0=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,s0=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,r0=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,a0=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,o0=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,c0=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,l0=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,h0=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,u0=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,d0=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,f0=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,p0=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,m0=`float getShadowMask() {
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
}`,g0=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,x0=`#ifdef USE_SKINNING
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
#endif`,_0=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,y0=`#ifdef USE_SKINNING
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
#endif`,v0=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,M0=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,b0=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,E0=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,S0=`#ifdef USE_TRANSMISSION
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
#endif`,T0=`#ifdef USE_TRANSMISSION
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
#endif`,w0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,A0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,R0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,C0=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,I0=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,P0=`uniform sampler2D t2D;
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
}`,L0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,N0=`#ifdef ENVMAP_TYPE_CUBE
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
}`,D0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,U0=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,z0=`#include <common>
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
}`,F0=`#if DEPTH_PACKING == 3200
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
}`,O0=`#define DISTANCE
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
}`,B0=`#define DISTANCE
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
}`,H0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,k0=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,G0=`uniform float scale;
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
}`,V0=`uniform vec3 diffuse;
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
}`,W0=`#include <common>
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
}`,X0=`uniform vec3 diffuse;
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
}`,q0=`#define LAMBERT
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
}`,Y0=`#define LAMBERT
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
}`,Z0=`#define MATCAP
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
}`,K0=`#define MATCAP
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
}`,J0=`#define NORMAL
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
}`,$0=`#define NORMAL
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
}`,j0=`#define PHONG
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
}`,Q0=`#define PHONG
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
}`,ex=`#define STANDARD
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
}`,tx=`#define STANDARD
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
}`,nx=`#define TOON
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
}`,ix=`#define TOON
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
}`,sx=`uniform float size;
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
}`,rx=`uniform vec3 diffuse;
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
}`,ax=`#include <common>
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
}`,ox=`uniform vec3 color;
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
}`,cx=`uniform float rotation;
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
}`,lx=`uniform vec3 diffuse;
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
}`,$e={alphahash_fragment:Im,alphahash_pars_fragment:Pm,alphamap_fragment:Lm,alphamap_pars_fragment:Nm,alphatest_fragment:Dm,alphatest_pars_fragment:Um,aomap_fragment:zm,aomap_pars_fragment:Fm,batching_pars_vertex:Om,batching_vertex:Bm,begin_vertex:Hm,beginnormal_vertex:km,bsdfs:Gm,iridescence_fragment:Vm,bumpmap_pars_fragment:Wm,clipping_planes_fragment:Xm,clipping_planes_pars_fragment:qm,clipping_planes_pars_vertex:Ym,clipping_planes_vertex:Zm,color_fragment:Km,color_pars_fragment:Jm,color_pars_vertex:$m,color_vertex:jm,common:Qm,cube_uv_reflection_fragment:eg,defaultnormal_vertex:tg,displacementmap_pars_vertex:ng,displacementmap_vertex:ig,emissivemap_fragment:sg,emissivemap_pars_fragment:rg,colorspace_fragment:ag,colorspace_pars_fragment:og,envmap_fragment:cg,envmap_common_pars_fragment:lg,envmap_pars_fragment:hg,envmap_pars_vertex:ug,envmap_physical_pars_fragment:bg,envmap_vertex:dg,fog_vertex:fg,fog_pars_vertex:pg,fog_fragment:mg,fog_pars_fragment:gg,gradientmap_pars_fragment:xg,lightmap_pars_fragment:_g,lights_lambert_fragment:yg,lights_lambert_pars_fragment:vg,lights_pars_begin:Mg,lights_toon_fragment:Eg,lights_toon_pars_fragment:Sg,lights_phong_fragment:Tg,lights_phong_pars_fragment:wg,lights_physical_fragment:Ag,lights_physical_pars_fragment:Rg,lights_fragment_begin:Cg,lights_fragment_maps:Ig,lights_fragment_end:Pg,lightprobes_pars_fragment:Lg,logdepthbuf_fragment:Ng,logdepthbuf_pars_fragment:Dg,logdepthbuf_pars_vertex:Ug,logdepthbuf_vertex:zg,map_fragment:Fg,map_pars_fragment:Og,map_particle_fragment:Bg,map_particle_pars_fragment:Hg,metalnessmap_fragment:kg,metalnessmap_pars_fragment:Gg,morphinstance_vertex:Vg,morphcolor_vertex:Wg,morphnormal_vertex:Xg,morphtarget_pars_vertex:qg,morphtarget_vertex:Yg,normal_fragment_begin:Zg,normal_fragment_maps:Kg,normal_pars_fragment:Jg,normal_pars_vertex:$g,normal_vertex:jg,normalmap_pars_fragment:Qg,clearcoat_normal_fragment_begin:e0,clearcoat_normal_fragment_maps:t0,clearcoat_pars_fragment:n0,iridescence_pars_fragment:i0,opaque_fragment:s0,packing:r0,premultiplied_alpha_fragment:a0,project_vertex:o0,dithering_fragment:c0,dithering_pars_fragment:l0,roughnessmap_fragment:h0,roughnessmap_pars_fragment:u0,shadowmap_pars_fragment:d0,shadowmap_pars_vertex:f0,shadowmap_vertex:p0,shadowmask_pars_fragment:m0,skinbase_vertex:g0,skinning_pars_vertex:x0,skinning_vertex:_0,skinnormal_vertex:y0,specularmap_fragment:v0,specularmap_pars_fragment:M0,tonemapping_fragment:b0,tonemapping_pars_fragment:E0,transmission_fragment:S0,transmission_pars_fragment:T0,uv_pars_fragment:w0,uv_pars_vertex:A0,uv_vertex:R0,worldpos_vertex:C0,background_vert:I0,background_frag:P0,backgroundCube_vert:L0,backgroundCube_frag:N0,cube_vert:D0,cube_frag:U0,depth_vert:z0,depth_frag:F0,distance_vert:O0,distance_frag:B0,equirect_vert:H0,equirect_frag:k0,linedashed_vert:G0,linedashed_frag:V0,meshbasic_vert:W0,meshbasic_frag:X0,meshlambert_vert:q0,meshlambert_frag:Y0,meshmatcap_vert:Z0,meshmatcap_frag:K0,meshnormal_vert:J0,meshnormal_frag:$0,meshphong_vert:j0,meshphong_frag:Q0,meshphysical_vert:ex,meshphysical_frag:tx,meshtoon_vert:nx,meshtoon_frag:ix,points_vert:sx,points_frag:rx,shadow_vert:ax,shadow_frag:ox,sprite_vert:cx,sprite_frag:lx},xe={common:{diffuse:{value:new Ae(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Xe},alphaMap:{value:null},alphaMapTransform:{value:new Xe},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Xe}},envmap:{envMap:{value:null},envMapRotation:{value:new Xe},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Xe}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Xe}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Xe},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Xe},normalScale:{value:new ae(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Xe},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Xe}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Xe}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Xe}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ae(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new L},probesMax:{value:new L},probesResolution:{value:new L}},points:{diffuse:{value:new Ae(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Xe},alphaTest:{value:0},uvTransform:{value:new Xe}},sprite:{diffuse:{value:new Ae(16777215)},opacity:{value:1},center:{value:new ae(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Xe},alphaMap:{value:null},alphaMapTransform:{value:new Xe},alphaTest:{value:0}}},Qn={basic:{uniforms:$t([xe.common,xe.specularmap,xe.envmap,xe.aomap,xe.lightmap,xe.fog]),vertexShader:$e.meshbasic_vert,fragmentShader:$e.meshbasic_frag},lambert:{uniforms:$t([xe.common,xe.specularmap,xe.envmap,xe.aomap,xe.lightmap,xe.emissivemap,xe.bumpmap,xe.normalmap,xe.displacementmap,xe.fog,xe.lights,{emissive:{value:new Ae(0)},envMapIntensity:{value:1}}]),vertexShader:$e.meshlambert_vert,fragmentShader:$e.meshlambert_frag},phong:{uniforms:$t([xe.common,xe.specularmap,xe.envmap,xe.aomap,xe.lightmap,xe.emissivemap,xe.bumpmap,xe.normalmap,xe.displacementmap,xe.fog,xe.lights,{emissive:{value:new Ae(0)},specular:{value:new Ae(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:$e.meshphong_vert,fragmentShader:$e.meshphong_frag},standard:{uniforms:$t([xe.common,xe.envmap,xe.aomap,xe.lightmap,xe.emissivemap,xe.bumpmap,xe.normalmap,xe.displacementmap,xe.roughnessmap,xe.metalnessmap,xe.fog,xe.lights,{emissive:{value:new Ae(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:$e.meshphysical_vert,fragmentShader:$e.meshphysical_frag},toon:{uniforms:$t([xe.common,xe.aomap,xe.lightmap,xe.emissivemap,xe.bumpmap,xe.normalmap,xe.displacementmap,xe.gradientmap,xe.fog,xe.lights,{emissive:{value:new Ae(0)}}]),vertexShader:$e.meshtoon_vert,fragmentShader:$e.meshtoon_frag},matcap:{uniforms:$t([xe.common,xe.bumpmap,xe.normalmap,xe.displacementmap,xe.fog,{matcap:{value:null}}]),vertexShader:$e.meshmatcap_vert,fragmentShader:$e.meshmatcap_frag},points:{uniforms:$t([xe.points,xe.fog]),vertexShader:$e.points_vert,fragmentShader:$e.points_frag},dashed:{uniforms:$t([xe.common,xe.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:$e.linedashed_vert,fragmentShader:$e.linedashed_frag},depth:{uniforms:$t([xe.common,xe.displacementmap]),vertexShader:$e.depth_vert,fragmentShader:$e.depth_frag},normal:{uniforms:$t([xe.common,xe.bumpmap,xe.normalmap,xe.displacementmap,{opacity:{value:1}}]),vertexShader:$e.meshnormal_vert,fragmentShader:$e.meshnormal_frag},sprite:{uniforms:$t([xe.sprite,xe.fog]),vertexShader:$e.sprite_vert,fragmentShader:$e.sprite_frag},background:{uniforms:{uvTransform:{value:new Xe},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:$e.background_vert,fragmentShader:$e.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Xe}},vertexShader:$e.backgroundCube_vert,fragmentShader:$e.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:$e.cube_vert,fragmentShader:$e.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:$e.equirect_vert,fragmentShader:$e.equirect_frag},distance:{uniforms:$t([xe.common,xe.displacementmap,{referencePosition:{value:new L},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:$e.distance_vert,fragmentShader:$e.distance_frag},shadow:{uniforms:$t([xe.lights,xe.fog,{color:{value:new Ae(0)},opacity:{value:1}}]),vertexShader:$e.shadow_vert,fragmentShader:$e.shadow_frag}};Qn.physical={uniforms:$t([Qn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Xe},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Xe},clearcoatNormalScale:{value:new ae(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Xe},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Xe},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Xe},sheen:{value:0},sheenColor:{value:new Ae(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Xe},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Xe},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Xe},transmissionSamplerSize:{value:new ae},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Xe},attenuationDistance:{value:0},attenuationColor:{value:new Ae(0)},specularColor:{value:new Ae(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Xe},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Xe},anisotropyVector:{value:new ae},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Xe}}]),vertexShader:$e.meshphysical_vert,fragmentShader:$e.meshphysical_frag};var Ic={r:0,b:0,g:0},hx=new Fe,Ef=new Xe;Ef.set(-1,0,0,0,1,0,0,0,1);function ux(r,e,t,n,i,s){let a=new Ae(0),c=i===!0?0:1,o,h,l=null,u=0,d=null;function p(M){let T=M.isScene===!0?M.background:null;if(T&&T.isTexture){let y=M.backgroundBlurriness>0;T=e.get(T,y)}return T}function g(M){let T=!1,y=p(M);y===null?m(a,c):y&&y.isColor&&(m(y,1),T=!0);let E=r.xr.getEnvironmentBlendMode();E==="additive"?t.buffers.color.setClear(0,0,0,1,s):E==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,s),(r.autoClear||T)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),r.clear(r.autoClearColor,r.autoClearDepth,r.autoClearStencil))}function x(M,T){let y=p(T);y&&(y.isCubeTexture||y.mapping===oa)?(h===void 0&&(h=new J(new ke(1,1,1),new mn({name:"BackgroundCubeMaterial",uniforms:fs(Qn.backgroundCube.uniforms),vertexShader:Qn.backgroundCube.vertexShader,fragmentShader:Qn.backgroundCube.fragmentShader,side:sn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(E,w,S){this.matrixWorld.copyPosition(S.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(h)),h.material.uniforms.envMap.value=y,h.material.uniforms.backgroundBlurriness.value=T.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=T.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(hx.makeRotationFromEuler(T.backgroundRotation)).transpose(),y.isCubeTexture&&y.isRenderTargetTexture===!1&&h.material.uniforms.backgroundRotation.value.premultiply(Ef),h.material.toneMapped=je.getTransfer(y.colorSpace)!==dt,(l!==y||u!==y.version||d!==r.toneMapping)&&(h.material.needsUpdate=!0,l=y,u=y.version,d=r.toneMapping),h.layers.enableAll(),M.unshift(h,h.geometry,h.material,0,0,null)):y&&y.isTexture&&(o===void 0&&(o=new J(new yt(2,2),new mn({name:"BackgroundMaterial",uniforms:fs(Qn.background.uniforms),vertexShader:Qn.background.vertexShader,fragmentShader:Qn.background.fragmentShader,side:Jn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),o.geometry.deleteAttribute("normal"),Object.defineProperty(o.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(o)),o.material.uniforms.t2D.value=y,o.material.uniforms.backgroundIntensity.value=T.backgroundIntensity,o.material.toneMapped=je.getTransfer(y.colorSpace)!==dt,y.matrixAutoUpdate===!0&&y.updateMatrix(),o.material.uniforms.uvTransform.value.copy(y.matrix),(l!==y||u!==y.version||d!==r.toneMapping)&&(o.material.needsUpdate=!0,l=y,u=y.version,d=r.toneMapping),o.layers.enableAll(),M.unshift(o,o.geometry,o.material,0,0,null))}function m(M,T){M.getRGB(Ic,ah(r)),t.buffers.color.setClear(Ic.r,Ic.g,Ic.b,T,s)}function f(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),o!==void 0&&(o.geometry.dispose(),o.material.dispose(),o=void 0)}return{getClearColor:function(){return a},setClearColor:function(M,T=1){a.set(M),c=T,m(a,c)},getClearAlpha:function(){return c},setClearAlpha:function(M){c=M,m(a,c)},render:g,addToRenderList:x,dispose:f}}function dx(r,e){let t=r.getParameter(r.MAX_VERTEX_ATTRIBS),n={},i=d(null),s=i,a=!1;function c(C,I,F,N,U){let D=!1,O=u(C,N,F,I);s!==O&&(s=O,h(s.object)),D=p(C,N,F,U),D&&g(C,N,F,U),U!==null&&e.update(U,r.ELEMENT_ARRAY_BUFFER),(D||a)&&(a=!1,y(C,I,F,N),U!==null&&r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,e.get(U).buffer))}function o(){return r.createVertexArray()}function h(C){return r.bindVertexArray(C)}function l(C){return r.deleteVertexArray(C)}function u(C,I,F,N){let U=N.wireframe===!0,D=n[I.id];D===void 0&&(D={},n[I.id]=D);let O=C.isInstancedMesh===!0?C.id:0,X=D[O];X===void 0&&(X={},D[O]=X);let k=X[F.id];k===void 0&&(k={},X[F.id]=k);let Y=k[U];return Y===void 0&&(Y=d(o()),k[U]=Y),Y}function d(C){let I=[],F=[],N=[];for(let U=0;U<t;U++)I[U]=0,F[U]=0,N[U]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:I,enabledAttributes:F,attributeDivisors:N,object:C,attributes:{},index:null}}function p(C,I,F,N){let U=s.attributes,D=I.attributes,O=0,X=F.getAttributes();for(let k in X)if(X[k].location>=0){let K=U[k],_e=D[k];if(_e===void 0&&(k==="instanceMatrix"&&C.instanceMatrix&&(_e=C.instanceMatrix),k==="instanceColor"&&C.instanceColor&&(_e=C.instanceColor)),K===void 0||K.attribute!==_e||_e&&K.data!==_e.data)return!0;O++}return s.attributesNum!==O||s.index!==N}function g(C,I,F,N){let U={},D=I.attributes,O=0,X=F.getAttributes();for(let k in X)if(X[k].location>=0){let K=D[k];K===void 0&&(k==="instanceMatrix"&&C.instanceMatrix&&(K=C.instanceMatrix),k==="instanceColor"&&C.instanceColor&&(K=C.instanceColor));let _e={};_e.attribute=K,K&&K.data&&(_e.data=K.data),U[k]=_e,O++}s.attributes=U,s.attributesNum=O,s.index=N}function x(){let C=s.newAttributes;for(let I=0,F=C.length;I<F;I++)C[I]=0}function m(C){f(C,0)}function f(C,I){let F=s.newAttributes,N=s.enabledAttributes,U=s.attributeDivisors;F[C]=1,N[C]===0&&(r.enableVertexAttribArray(C),N[C]=1),U[C]!==I&&(r.vertexAttribDivisor(C,I),U[C]=I)}function M(){let C=s.newAttributes,I=s.enabledAttributes;for(let F=0,N=I.length;F<N;F++)I[F]!==C[F]&&(r.disableVertexAttribArray(F),I[F]=0)}function T(C,I,F,N,U,D,O){O===!0?r.vertexAttribIPointer(C,I,F,U,D):r.vertexAttribPointer(C,I,F,N,U,D)}function y(C,I,F,N){x();let U=N.attributes,D=F.getAttributes(),O=I.defaultAttributeValues;for(let X in D){let k=D[X];if(k.location>=0){let Y=U[X];if(Y===void 0&&(X==="instanceMatrix"&&C.instanceMatrix&&(Y=C.instanceMatrix),X==="instanceColor"&&C.instanceColor&&(Y=C.instanceColor)),Y!==void 0){let K=Y.normalized,_e=Y.itemSize,Me=e.get(Y);if(Me===void 0)continue;let ct=Me.buffer,tt=Me.type,rt=Me.bytesPerElement,Q=tt===r.INT||tt===r.UNSIGNED_INT||Y.gpuType===ko;if(Y.isInterleavedBufferAttribute){let ne=Y.data,ye=ne.stride,Ge=Y.offset;if(ne.isInstancedInterleavedBuffer){for(let Se=0;Se<k.locationSize;Se++)f(k.location+Se,ne.meshPerAttribute);C.isInstancedMesh!==!0&&N._maxInstanceCount===void 0&&(N._maxInstanceCount=ne.meshPerAttribute*ne.count)}else for(let Se=0;Se<k.locationSize;Se++)m(k.location+Se);r.bindBuffer(r.ARRAY_BUFFER,ct);for(let Se=0;Se<k.locationSize;Se++)T(k.location+Se,_e/k.locationSize,tt,K,ye*rt,(Ge+_e/k.locationSize*Se)*rt,Q)}else{if(Y.isInstancedBufferAttribute){for(let ne=0;ne<k.locationSize;ne++)f(k.location+ne,Y.meshPerAttribute);C.isInstancedMesh!==!0&&N._maxInstanceCount===void 0&&(N._maxInstanceCount=Y.meshPerAttribute*Y.count)}else for(let ne=0;ne<k.locationSize;ne++)m(k.location+ne);r.bindBuffer(r.ARRAY_BUFFER,ct);for(let ne=0;ne<k.locationSize;ne++)T(k.location+ne,_e/k.locationSize,tt,K,_e*rt,_e/k.locationSize*ne*rt,Q)}}else if(O!==void 0){let K=O[X];if(K!==void 0)switch(K.length){case 2:r.vertexAttrib2fv(k.location,K);break;case 3:r.vertexAttrib3fv(k.location,K);break;case 4:r.vertexAttrib4fv(k.location,K);break;default:r.vertexAttrib1fv(k.location,K)}}}}M()}function E(){v();for(let C in n){let I=n[C];for(let F in I){let N=I[F];for(let U in N){let D=N[U];for(let O in D)l(D[O].object),delete D[O];delete N[U]}}delete n[C]}}function w(C){if(n[C.id]===void 0)return;let I=n[C.id];for(let F in I){let N=I[F];for(let U in N){let D=N[U];for(let O in D)l(D[O].object),delete D[O];delete N[U]}}delete n[C.id]}function S(C){for(let I in n){let F=n[I];for(let N in F){let U=F[N];if(U[C.id]===void 0)continue;let D=U[C.id];for(let O in D)l(D[O].object),delete D[O];delete U[C.id]}}}function _(C){for(let I in n){let F=n[I],N=C.isInstancedMesh===!0?C.id:0,U=F[N];if(U!==void 0){for(let D in U){let O=U[D];for(let X in O)l(O[X].object),delete O[X];delete U[D]}delete F[N],Object.keys(F).length===0&&delete n[I]}}}function v(){R(),a=!0,s!==i&&(s=i,h(s.object))}function R(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:c,reset:v,resetDefaultState:R,dispose:E,releaseStatesOfGeometry:w,releaseStatesOfObject:_,releaseStatesOfProgram:S,initAttributes:x,enableAttribute:m,disableUnusedAttributes:M}}function fx(r,e,t){let n;function i(o){n=o}function s(o,h){r.drawArrays(n,o,h),t.update(h,n,1)}function a(o,h,l){l!==0&&(r.drawArraysInstanced(n,o,h,l),t.update(h,n,l))}function c(o,h,l){if(l===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,o,0,h,0,l);let d=0;for(let p=0;p<l;p++)d+=h[p];t.update(d,n,1)}this.setMode=i,this.render=s,this.renderInstances=a,this.renderMultiDraw=c}function px(r,e,t,n){let i;function s(){if(i!==void 0)return i;if(e.has("EXT_texture_filter_anisotropic")===!0){let S=e.get("EXT_texture_filter_anisotropic");i=r.getParameter(S.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function a(S){return!(S!==xn&&n.convert(S)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_FORMAT))}function c(S){let _=S===Hn&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(S!==hn&&S!==gn&&!_&&n.convert(S)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_TYPE))}function o(S){if(S==="highp"){if(r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.HIGH_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.HIGH_FLOAT).precision>0)return"highp";S="mediump"}return S==="mediump"&&r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.MEDIUM_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let h=t.precision!==void 0?t.precision:"highp",l=o(h);l!==h&&(Le("WebGLRenderer:",h,"not supported, using",l,"instead."),h=l);let u=t.logarithmicDepthBuffer===!0,d=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&d===!1&&Le("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");let p=r.getParameter(r.MAX_TEXTURE_IMAGE_UNITS),g=r.getParameter(r.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=r.getParameter(r.MAX_TEXTURE_SIZE),m=r.getParameter(r.MAX_CUBE_MAP_TEXTURE_SIZE),f=r.getParameter(r.MAX_VERTEX_ATTRIBS),M=r.getParameter(r.MAX_VERTEX_UNIFORM_VECTORS),T=r.getParameter(r.MAX_VARYING_VECTORS),y=r.getParameter(r.MAX_FRAGMENT_UNIFORM_VECTORS),E=r.getParameter(r.MAX_SAMPLES),w=r.getParameter(r.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:o,textureFormatReadable:a,textureTypeReadable:c,precision:h,logarithmicDepthBuffer:u,reversedDepthBuffer:d,maxTextures:p,maxVertexTextures:g,maxTextureSize:x,maxCubemapSize:m,maxAttributes:f,maxVertexUniforms:M,maxVaryings:T,maxFragmentUniforms:y,maxSamples:E,samples:w}}function mx(r){let e=this,t=null,n=0,i=!1,s=!1,a=new Ln,c=new Xe,o={value:null,needsUpdate:!1};this.uniform=o,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){let p=u.length!==0||d||n!==0||i;return i=d,n=u.length,p},this.beginShadows=function(){s=!0,l(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(u,d){t=l(u,d,0)},this.setState=function(u,d,p){let g=u.clippingPlanes,x=u.clipIntersection,m=u.clipShadows,f=r.get(u);if(!i||g===null||g.length===0||s&&!m)s?l(null):h();else{let M=s?0:n,T=M*4,y=f.clippingState||null;o.value=y,y=l(g,d,T,p);for(let E=0;E!==T;++E)y[E]=t[E];f.clippingState=y,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=M}};function h(){o.value!==t&&(o.value=t,o.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function l(u,d,p,g){let x=u!==null?u.length:0,m=null;if(x!==0){if(m=o.value,g!==!0||m===null){let f=p+x*4,M=d.matrixWorldInverse;c.getNormalMatrix(M),(m===null||m.length<f)&&(m=new Float32Array(f));for(let T=0,y=p;T!==x;++T,y+=4)a.copy(u[T]).applyMatrix4(M,c),a.normal.toArray(m,y),m[y+3]=a.constant}o.value=m,o.needsUpdate=!0}return e.numPlanes=x,e.numIntersection=0,m}}var lr=4,gx=6,xx=20,_x=256,ma=new ki,ef=new Ae,hh=null,uh=0,dh=0,fh=!1,yx=new L,ps=new L,ur=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,i=100,s={}){let{size:a=256,position:c=yx}=s;hh=this._renderer.getRenderTarget(),uh=this._renderer.getActiveCubeFace(),dh=this._renderer.getActiveMipmapLevel(),fh=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let o=this._allocateTargets();return o.depthBuffer=!0,this._sceneToCubeUV(e,n,i,o,c),t>0&&this._blur(o,0,0,t),this._applyPMREM(o),this._cleanup(o),o}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=sf(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=nf(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(hh,uh,dh),this._renderer.xr.enabled=fh,e.scissorTest=!1,cr(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Gi||e.mapping===us?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),hh=this._renderer.getRenderTarget(),uh=this._renderer.getActiveCubeFace(),dh=this._renderer.getActiveMipmapLevel(),fh=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Dt,minFilter:Dt,generateMipmaps:!1,type:Hn,format:xn,colorSpace:en,depthBuffer:!1},i=tf(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=tf(e,t,n);let{_lodMax:s}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=vx(s)),this._blurMaterial=bx(s,e,t),this._ggxMaterial=Mx(s,e,t)}return i}_compileMaterial(e){let t=new J(new xt,e);this._renderer.compile(t,ma)}_sceneToCubeUV(e,t,n,i,s){let o=new Ot(90,1,t,n),h=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],u=this._renderer,d=u.autoClear,p=u.toneMapping;u.getClearColor(ef),u.toneMapping=Fn,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(i),u.clearDepth(),u.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new J(new ke,new ot({name:"PMREM.Background",side:sn,depthWrite:!1,depthTest:!1})));let x=this._backgroundBox,m=x.material,f=!1,M=e.background;M?M.isColor&&(m.color.copy(M),e.background=null,f=!0):(m.color.copy(ef),f=!0);for(let T=0;T<6;T++){let y=T%3;y===0?(o.up.set(0,h[T],0),o.position.set(s.x,s.y,s.z),o.lookAt(s.x+l[T],s.y,s.z)):y===1?(o.up.set(0,0,h[T]),o.position.set(s.x,s.y,s.z),o.lookAt(s.x,s.y+l[T],s.z)):(o.up.set(0,h[T],0),o.position.set(s.x,s.y,s.z),o.lookAt(s.x,s.y,s.z+l[T]));let E=this._cubeSize;cr(i,y*E,T>2?E:0,E,E),u.setRenderTarget(i),f&&u.render(x,o),u.render(e,o)}u.toneMapping=p,u.autoClear=d,e.background=M}_textureToCubeUV(e,t){let n=this._renderer,i=e.mapping===Gi||e.mapping===us;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=sf()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=nf());let s=i?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=s;let c=s.uniforms;c.envMap.value=e;let o=this._cubeSize;cr(t,0,0,3*o,2*o),n.setRenderTarget(t),n.render(a,ma)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let i=this._lodMeshes.length;for(let s=1;s<i;s++)this._applyGGXFilter(e,s-1,s);t.autoClear=n}_applyGGXFilter(e,t,n){let i=this._renderer,s=this._pingPongRenderTarget,a=this._ggxMaterial,c=this._lodMeshes[n];c.material=a;let o=a.uniforms,h=n/(this._lodMeshes.length-1),l=t/(this._lodMeshes.length-1),u=Math.sqrt(h*h-l*l),d=h*1.25,p=u*d,{_lodMax:g}=this,x=this._sizeLods[n],m=3*x*(n>g-lr?n-g+lr:0),f=4*(this._cubeSize-x);o.envMap.value=e.texture,o.roughness.value=p,o.mipInt.value=g-t,cr(s,m,f,3*x,2*x),i.setRenderTarget(s),i.render(c,ma),o.envMap.value=s.texture,o.roughness.value=0,o.mipInt.value=g-n,cr(e,m,f,3*x,2*x),i.setRenderTarget(e),i.render(c,ma)}_blur(e,t,n,i){let s=this._pingPongRenderTarget,a=Math.min(i,Math.PI)/Math.SQRT2;this._blurPass(e,s,t,n,a),this._blurPass(s,e,n,n,a)}_blurPass(e,t,n,i,s){let a=this._renderer,c=this._blurMaterial,o=this._lodMeshes[i];o.material=c;let h=c.uniforms;h.envMap.value=e.texture,h.sigma.value=s,h.mipInt.value=this._lodMax-n;let l=this._sizeLods[i],u=3*l*(i>this._lodMax-lr?i-this._lodMax+lr:0),d=4*(this._cubeSize-l);cr(t,u,d,3*l,2*l),a.setRenderTarget(t),a.render(o,ma)}};function vx(r){let e=[],t=[],n=r,i=r-lr+1+gx;for(let s=0;s<i;s++){let a=Math.pow(2,n);e.push(a);let c=1/(a-2),o=-c,h=1+c,l=[o,o,h,o,h,h,o,o,h,h,o,h],u=6,d=6,p=3,g=new Float32Array(p*d*u),x=new Float32Array(p*d*u);for(let f=0;f<u;f++){let M=f%3*2/3-1,T=f>2?0:-1,y=[M,T,0,M+2/3,T,0,M+2/3,T+1,0,M,T,0,M+2/3,T+1,0,M,T+1,0];g.set(y,p*d*f);for(let E=0;E<d;E++){let w=l[E*2]*2-1,S=l[E*2+1]*2-1;f===0?ps.set(1,S,w):f===1?ps.set(-w,1,-S):f===2?ps.set(-w,S,1):f===3?ps.set(-1,S,-w):f===4?ps.set(-w,-1,S):ps.set(w,S,-1),ps.toArray(x,(f*d+E)*p)}}let m=new xt;m.setAttribute("position",new Pt(g,p)),m.setAttribute("outputDirection",new Pt(x,p)),t.push(new J(m,null)),n>lr&&n--}return{lodMeshes:t,sizeLods:e}}function tf(r,e,t){let n=new rn(r,e,t);return n.texture.mapping=oa,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function cr(r,e,t,n,i){r.viewport.set(e,t,n,i),r.scissor.set(e,t,n,i)}function Mx(r,e,t){return new mn({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:_x,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${r}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Dc(),fragmentShader:`

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
		`,blending:$n,depthTest:!1,depthWrite:!1})}function bx(r,e,t){return new mn({name:"SphericalGaussianBlur",defines:{SAMPLES:xx,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${r}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:Dc(),fragmentShader:`

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
		`,blending:$n,depthTest:!1,depthWrite:!1})}function nf(){return new mn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Dc(),fragmentShader:`

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
		`,blending:$n,depthTest:!1,depthWrite:!1})}function sf(){return new mn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Dc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:$n,depthTest:!1,depthWrite:!1})}function Dc(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}var Lc=class extends rn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},i=[n,n,n,n,n,n];this.texture=new Gr(i),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},i=new ke(5,5,5),s=new mn({name:"CubemapFromEquirect",uniforms:fs(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:sn,blending:$n});s.uniforms.tEquirect.value=t;let a=new J(i,s),c=t.minFilter;return t.minFilter===On&&(t.minFilter=Dt),new Do(1,10,this).update(e,a),t.minFilter=c,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,i=!0){let s=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,i);e.setRenderTarget(s)}};function Ex(r){let e=new WeakMap,t=new WeakMap,n=null;function i(d,p=!1){return d==null?null:p?a(d):s(d)}function s(d){if(d&&d.isTexture){let p=d.mapping;if(p===ir||p===Bo)if(e.has(d)){let g=e.get(d).texture;return c(g,d.mapping)}else{let g=d.image;if(g&&g.height>0){let x=new Lc(g.height);return x.fromEquirectangularTexture(r,d),e.set(d,x),d.addEventListener("dispose",h),c(x.texture,d.mapping)}else return null}}return d}function a(d){if(d&&d.isTexture){let p=d.mapping,g=p===ir||p===Bo,x=p===Gi||p===us;if(g||x){let m=t.get(d),f=m!==void 0?m.texture.pmremVersion:0;if(d.isRenderTargetTexture&&d.pmremVersion!==f)return n===null&&(n=new ur(r)),m=g?n.fromEquirectangular(d,m):n.fromCubemap(d,m),m.texture.pmremVersion=d.pmremVersion,t.set(d,m),m.texture;if(m!==void 0)return m.texture;{let M=d.image;return g&&M&&M.height>0||x&&M&&o(M)?(n===null&&(n=new ur(r)),m=g?n.fromEquirectangular(d):n.fromCubemap(d),m.texture.pmremVersion=d.pmremVersion,t.set(d,m),d.addEventListener("dispose",l),m.texture):null}}}return d}function c(d,p){return p===ir?d.mapping=Gi:p===Bo&&(d.mapping=us),d}function o(d){let p=0,g=6;for(let x=0;x<g;x++)d[x]!==void 0&&p++;return p===g}function h(d){let p=d.target;p.removeEventListener("dispose",h);let g=e.get(p);g!==void 0&&(e.delete(p),g.dispose())}function l(d){let p=d.target;p.removeEventListener("dispose",l);let g=t.get(p);g!==void 0&&(t.delete(p),g.dispose())}function u(){e=new WeakMap,t=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:i,dispose:u}}function Sx(r){let e={};function t(n){if(e[n]!==void 0)return e[n];let i=r.getExtension(n);return e[n]=i,i}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){let i=t(n);return i===null&&es("WebGLRenderer: "+n+" extension not supported."),i}}}function Tx(r,e,t,n){let i={},s=new WeakMap;function a(u){let d=u.target;d.index!==null&&e.remove(d.index);for(let g in d.attributes)e.remove(d.attributes[g]);d.removeEventListener("dispose",a),delete i[d.id];let p=s.get(d);p&&(e.remove(p),s.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function c(u,d){return i[d.id]===!0||(d.addEventListener("dispose",a),i[d.id]=!0,t.memory.geometries++),d}function o(u){let d=u.attributes;for(let p in d)e.update(d[p],r.ARRAY_BUFFER)}function h(u){let d=[],p=u.index,g=u.attributes.position,x=0;if(g===void 0)return;if(p!==null){let M=p.array;x=p.version;for(let T=0,y=M.length;T<y;T+=3){let E=M[T+0],w=M[T+1],S=M[T+2];d.push(E,w,w,S,S,E)}}else{let M=g.array;x=g.version;for(let T=0,y=M.length/3-1;T<y;T+=3){let E=T+0,w=T+1,S=T+2;d.push(E,w,w,S,S,E)}}let m=new(g.count>=65535?Fr:zr)(d,1);m.version=x;let f=s.get(u);f&&e.remove(f),s.set(u,m)}function l(u){let d=s.get(u);if(d){let p=u.index;p!==null&&d.version<p.version&&h(u)}else h(u);return s.get(u)}return{get:c,update:o,getWireframeAttribute:l}}function wx(r,e,t){let n;function i(u){n=u}let s,a;function c(u){s=u.type,a=u.bytesPerElement}function o(u,d){r.drawElements(n,d,s,u*a),t.update(d,n,1)}function h(u,d,p){p!==0&&(r.drawElementsInstanced(n,d,s,u*a,p),t.update(d,n,p))}function l(u,d,p){if(p===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,d,0,s,u,0,p);let x=0;for(let m=0;m<p;m++)x+=d[m];t.update(x,n,1)}this.setMode=i,this.setIndex=c,this.render=o,this.renderInstances=h,this.renderMultiDraw=l}function Ax(r){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(s,a,c){switch(t.calls++,a){case r.TRIANGLES:t.triangles+=c*(s/3);break;case r.LINES:t.lines+=c*(s/2);break;case r.LINE_STRIP:t.lines+=c*(s-1);break;case r.LINE_LOOP:t.lines+=c*s;break;case r.POINTS:t.points+=c*s;break;default:He("WebGLInfo: Unknown draw mode:",a);break}}function i(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:i,update:n}}function Rx(r,e,t){let n=new WeakMap,i=new gt;function s(a,c,o){let h=a.morphTargetInfluences,l=c.morphAttributes.position||c.morphAttributes.normal||c.morphAttributes.color,u=l!==void 0?l.length:0,d=n.get(c);if(d===void 0||d.count!==u){let v=function(){S.dispose(),n.delete(c),c.removeEventListener("dispose",v)};d!==void 0&&d.texture.dispose();let p=c.morphAttributes.position!==void 0,g=c.morphAttributes.normal!==void 0,x=c.morphAttributes.color!==void 0,m=c.morphAttributes.position||[],f=c.morphAttributes.normal||[],M=c.morphAttributes.color||[],T=0;p===!0&&(T=1),g===!0&&(T=2),x===!0&&(T=3);let y=c.attributes.position.count*T,E=1;y>e.maxTextureSize&&(E=Math.ceil(y/e.maxTextureSize),y=e.maxTextureSize);let w=new Float32Array(y*E*4*u),S=new Dr(w,y,E,u);S.type=gn,S.needsUpdate=!0;let _=T*4;for(let R=0;R<u;R++){let C=m[R],I=f[R],F=M[R],N=y*E*4*R;for(let U=0;U<C.count;U++){let D=U*_;p===!0&&(i.fromBufferAttribute(C,U),w[N+D+0]=i.x,w[N+D+1]=i.y,w[N+D+2]=i.z,w[N+D+3]=0),g===!0&&(i.fromBufferAttribute(I,U),w[N+D+4]=i.x,w[N+D+5]=i.y,w[N+D+6]=i.z,w[N+D+7]=0),x===!0&&(i.fromBufferAttribute(F,U),w[N+D+8]=i.x,w[N+D+9]=i.y,w[N+D+10]=i.z,w[N+D+11]=F.itemSize===4?i.w:1)}}d={count:u,texture:S,size:new ae(y,E)},n.set(c,d),c.addEventListener("dispose",v)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)o.getUniforms().setValue(r,"morphTexture",a.morphTexture,t);else{let p=0;for(let x=0;x<h.length;x++)p+=h[x];let g=c.morphTargetsRelative?1:1-p;o.getUniforms().setValue(r,"morphTargetBaseInfluence",g),o.getUniforms().setValue(r,"morphTargetInfluences",h)}o.getUniforms().setValue(r,"morphTargetsTexture",d.texture,t),o.getUniforms().setValue(r,"morphTargetsTextureSize",d.size)}return{update:s}}function Cx(r,e,t,n,i){let s=new WeakMap;function a(h){let l=i.render.frame,u=h.geometry,d=e.get(h,u);if(s.get(d)!==l&&(e.update(d),s.set(d,l)),h.isInstancedMesh&&(h.hasEventListener("dispose",o)===!1&&h.addEventListener("dispose",o),s.get(h)!==l&&(t.update(h.instanceMatrix,r.ARRAY_BUFFER),h.instanceColor!==null&&t.update(h.instanceColor,r.ARRAY_BUFFER),s.set(h,l))),h.isSkinnedMesh){let p=h.skeleton;s.get(p)!==l&&(p.update(),s.set(p,l))}return d}function c(){s=new WeakMap}function o(h){let l=h.target;l.removeEventListener("dispose",o),n.releaseStatesOfObject(l),t.remove(l.instanceMatrix),l.instanceColor!==null&&t.remove(l.instanceColor)}return{update:a,dispose:c}}var Ix={[kl]:"LINEAR_TONE_MAPPING",[Gl]:"REINHARD_TONE_MAPPING",[Vl]:"CINEON_TONE_MAPPING",[aa]:"ACES_FILMIC_TONE_MAPPING",[Xl]:"AGX_TONE_MAPPING",[ql]:"NEUTRAL_TONE_MAPPING",[Wl]:"CUSTOM_TONE_MAPPING"};function Px(r,e,t,n,i,s){let a=new rn(e,t,{type:r,depthBuffer:i,stencilBuffer:s,samples:n?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),c=null,o=null,h=new xt;h.setAttribute("position",new Ye([-1,3,0,-1,-1,0,3,-1,0],3)),h.setAttribute("uv",new Ye([0,2,0,0,2,0],2));let l=new To({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),u=new J(h,l),d=new ki(-1,1,1,-1,0,1),p=null,g=null,x=!1,m,f=null,M=[],T=!1;this.setSize=function(y,E){a.setSize(y,E),c!==null&&c.setSize(y,E),o!==null&&o.setSize(y,E);for(let w=0;w<M.length;w++){let S=M[w];S.setSize&&S.setSize(y,E)}},this.setEffects=function(y){M=y,T=M.length>0&&M[0].isRenderPass===!0;let E=a.width,w=a.height;M.length>0&&c===null&&(c=new rn(E,w,{type:Hn,depthBuffer:!1,stencilBuffer:!1}),o=new rn(E,w,{type:Hn,depthBuffer:!1,stencilBuffer:!1}));for(let S=0;S<M.length;S++){let _=M[S];_.setSize&&_.setSize(E,w)}},this.begin=function(y,E){if(x||y.toneMapping===Fn&&M.length===0)return!1;if(f=E,E!==null){let w=E.width,S=E.height;(a.width!==w||a.height!==S)&&this.setSize(w,S)}return T===!1&&y.setRenderTarget(a),m=y.toneMapping,y.toneMapping=Fn,!0},this.hasRenderPass=function(){return T},this.end=function(y,E){y.toneMapping=m,x=!0;let w=a,S=c;for(let _=0;_<M.length;_++){let v=M[_];v.enabled!==!1&&(v.render(y,S,w,E),v.needsSwap!==!1&&(w=S,S=S===c?o:c))}if(p!==y.outputColorSpace||g!==y.toneMapping){p=y.outputColorSpace,g=y.toneMapping,l.defines={},je.getTransfer(p)===dt&&(l.defines.SRGB_TRANSFER="");let _=Ix[g];_&&(l.defines[_]=""),l.needsUpdate=!0}l.uniforms.tDiffuse.value=w.texture,y.setRenderTarget(f),y.render(u,d),f=null,x=!1},this.isCompositing=function(){return x},this.dispose=function(){a.dispose(),c!==null&&c.dispose(),o!==null&&o.dispose(),h.dispose(),l.dispose()}}var Sf=new Ht,gh=new Ui(1,1),Tf=new Dr,wf=new po,Af=new Gr,rf=[],af=[],of=new Float32Array(16),cf=new Float32Array(9),lf=new Float32Array(4);function dr(r,e,t){let n=r[0];if(n<=0||n>0)return r;let i=e*t,s=rf[i];if(s===void 0&&(s=new Float32Array(i),rf[i]=s),e!==0){n.toArray(s,0);for(let a=1,c=0;a!==e;++a)c+=t,r[a].toArray(s,c)}return s}function kt(r,e){if(r.length!==e.length)return!1;for(let t=0,n=r.length;t<n;t++)if(r[t]!==e[t])return!1;return!0}function Gt(r,e){for(let t=0,n=e.length;t<n;t++)r[t]=e[t]}function Uc(r,e){let t=af[e];t===void 0&&(t=new Int32Array(e),af[e]=t);for(let n=0;n!==e;++n)t[n]=r.allocateTextureUnit();return t}function Lx(r,e){let t=this.cache;t[0]!==e&&(r.uniform1f(this.addr,e),t[0]=e)}function Nx(r,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(r.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(kt(t,e))return;r.uniform2fv(this.addr,e),Gt(t,e)}}function Dx(r,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(r.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(r.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(kt(t,e))return;r.uniform3fv(this.addr,e),Gt(t,e)}}function Ux(r,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(r.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(kt(t,e))return;r.uniform4fv(this.addr,e),Gt(t,e)}}function zx(r,e){let t=this.cache,n=e.elements;if(n===void 0){if(kt(t,e))return;r.uniformMatrix2fv(this.addr,!1,e),Gt(t,e)}else{if(kt(t,n))return;lf.set(n),r.uniformMatrix2fv(this.addr,!1,lf),Gt(t,n)}}function Fx(r,e){let t=this.cache,n=e.elements;if(n===void 0){if(kt(t,e))return;r.uniformMatrix3fv(this.addr,!1,e),Gt(t,e)}else{if(kt(t,n))return;cf.set(n),r.uniformMatrix3fv(this.addr,!1,cf),Gt(t,n)}}function Ox(r,e){let t=this.cache,n=e.elements;if(n===void 0){if(kt(t,e))return;r.uniformMatrix4fv(this.addr,!1,e),Gt(t,e)}else{if(kt(t,n))return;of.set(n),r.uniformMatrix4fv(this.addr,!1,of),Gt(t,n)}}function Bx(r,e){let t=this.cache;t[0]!==e&&(r.uniform1i(this.addr,e),t[0]=e)}function Hx(r,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(r.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(kt(t,e))return;r.uniform2iv(this.addr,e),Gt(t,e)}}function kx(r,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(r.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(kt(t,e))return;r.uniform3iv(this.addr,e),Gt(t,e)}}function Gx(r,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(r.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(kt(t,e))return;r.uniform4iv(this.addr,e),Gt(t,e)}}function Vx(r,e){let t=this.cache;t[0]!==e&&(r.uniform1ui(this.addr,e),t[0]=e)}function Wx(r,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(r.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(kt(t,e))return;r.uniform2uiv(this.addr,e),Gt(t,e)}}function Xx(r,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(r.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(kt(t,e))return;r.uniform3uiv(this.addr,e),Gt(t,e)}}function qx(r,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(r.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(kt(t,e))return;r.uniform4uiv(this.addr,e),Gt(t,e)}}function Yx(r,e,t){let n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i);let s;this.type===r.SAMPLER_2D_SHADOW?(gh.compareFunction=t.isReversedDepthBuffer()?Cc:Rc,s=gh):s=Sf,t.setTexture2D(e||s,i)}function Zx(r,e,t){let n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),t.setTexture3D(e||wf,i)}function Kx(r,e,t){let n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),t.setTextureCube(e||Af,i)}function Jx(r,e,t){let n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),t.setTexture2DArray(e||Tf,i)}function $x(r){switch(r){case 5126:return Lx;case 35664:return Nx;case 35665:return Dx;case 35666:return Ux;case 35674:return zx;case 35675:return Fx;case 35676:return Ox;case 5124:case 35670:return Bx;case 35667:case 35671:return Hx;case 35668:case 35672:return kx;case 35669:case 35673:return Gx;case 5125:return Vx;case 36294:return Wx;case 36295:return Xx;case 36296:return qx;case 35678:case 36198:case 36298:case 36306:case 35682:return Yx;case 35679:case 36299:case 36307:return Zx;case 35680:case 36300:case 36308:case 36293:return Kx;case 36289:case 36303:case 36311:case 36292:return Jx}}function jx(r,e){r.uniform1fv(this.addr,e)}function Qx(r,e){let t=dr(e,this.size,2);r.uniform2fv(this.addr,t)}function e_(r,e){let t=dr(e,this.size,3);r.uniform3fv(this.addr,t)}function t_(r,e){let t=dr(e,this.size,4);r.uniform4fv(this.addr,t)}function n_(r,e){let t=dr(e,this.size,4);r.uniformMatrix2fv(this.addr,!1,t)}function i_(r,e){let t=dr(e,this.size,9);r.uniformMatrix3fv(this.addr,!1,t)}function s_(r,e){let t=dr(e,this.size,16);r.uniformMatrix4fv(this.addr,!1,t)}function r_(r,e){r.uniform1iv(this.addr,e)}function a_(r,e){r.uniform2iv(this.addr,e)}function o_(r,e){r.uniform3iv(this.addr,e)}function c_(r,e){r.uniform4iv(this.addr,e)}function l_(r,e){r.uniform1uiv(this.addr,e)}function h_(r,e){r.uniform2uiv(this.addr,e)}function u_(r,e){r.uniform3uiv(this.addr,e)}function d_(r,e){r.uniform4uiv(this.addr,e)}function f_(r,e,t){let n=this.cache,i=e.length,s=Uc(t,i);kt(n,s)||(r.uniform1iv(this.addr,s),Gt(n,s));let a;this.type===r.SAMPLER_2D_SHADOW?a=gh:a=Sf;for(let c=0;c!==i;++c)t.setTexture2D(e[c]||a,s[c])}function p_(r,e,t){let n=this.cache,i=e.length,s=Uc(t,i);kt(n,s)||(r.uniform1iv(this.addr,s),Gt(n,s));for(let a=0;a!==i;++a)t.setTexture3D(e[a]||wf,s[a])}function m_(r,e,t){let n=this.cache,i=e.length,s=Uc(t,i);kt(n,s)||(r.uniform1iv(this.addr,s),Gt(n,s));for(let a=0;a!==i;++a)t.setTextureCube(e[a]||Af,s[a])}function g_(r,e,t){let n=this.cache,i=e.length,s=Uc(t,i);kt(n,s)||(r.uniform1iv(this.addr,s),Gt(n,s));for(let a=0;a!==i;++a)t.setTexture2DArray(e[a]||Tf,s[a])}function x_(r){switch(r){case 5126:return jx;case 35664:return Qx;case 35665:return e_;case 35666:return t_;case 35674:return n_;case 35675:return i_;case 35676:return s_;case 5124:case 35670:return r_;case 35667:case 35671:return a_;case 35668:case 35672:return o_;case 35669:case 35673:return c_;case 5125:return l_;case 36294:return h_;case 36295:return u_;case 36296:return d_;case 35678:case 36198:case 36298:case 36306:case 35682:return f_;case 35679:case 36299:case 36307:return p_;case 35680:case 36300:case 36308:case 36293:return m_;case 36289:case 36303:case 36311:case 36292:return g_}}var xh=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=$x(t.type)}},_h=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=x_(t.type)}},yh=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let i=this.seq;for(let s=0,a=i.length;s!==a;++s){let c=i[s];c.setValue(e,t[c.id],n)}}},ph=/(\w+)(\])?(\[|\.)?/g;function hf(r,e){r.seq.push(e),r.map[e.id]=e}function __(r,e,t){let n=r.name,i=n.length;for(ph.lastIndex=0;;){let s=ph.exec(n),a=ph.lastIndex,c=s[1],o=s[2]==="]",h=s[3];if(o&&(c=c|0),h===void 0||h==="["&&a+2===i){hf(t,h===void 0?new xh(c,r,e):new _h(c,r,e));break}else{let u=t.map[c];u===void 0&&(u=new yh(c),hf(t,u)),t=u}}}var hr=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<n;++a){let c=e.getActiveUniform(t,a),o=e.getUniformLocation(t,c.name);__(c,o,this)}let i=[],s=[];for(let a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?i.push(a):s.push(a);i.length>0&&(this.seq=i.concat(s))}setValue(e,t,n,i){let s=this.map[t];s!==void 0&&s.setValue(e,n,i)}setOptional(e,t,n){let i=t[n];i!==void 0&&this.setValue(e,n,i)}static upload(e,t,n,i){for(let s=0,a=t.length;s!==a;++s){let c=t[s],o=n[c.id];o.needsUpdate!==!1&&c.setValue(e,o.value,i)}}static seqWithValue(e,t){let n=[];for(let i=0,s=e.length;i!==s;++i){let a=e[i];a.id in t&&n.push(a)}return n}};function uf(r,e,t){let n=r.createShader(e);return r.shaderSource(n,t),r.compileShader(n),n}var y_=37297,v_=0;function M_(r,e){let t=r.split(`
`),n=[],i=Math.max(e-6,0),s=Math.min(e+6,t.length);for(let a=i;a<s;a++){let c=a+1;n.push(`${c===e?">":" "} ${c}: ${t[a]}`)}return n.join(`
`)}var df=new Xe;function b_(r){je._getMatrix(df,je.workingColorSpace,r);let e=`mat3( ${df.elements.map(t=>t.toFixed(4))} )`;switch(je.getTransfer(r)){case Lr:return[e,"LinearTransferOETF"];case dt:return[e,"sRGBTransferOETF"];default:return Le("WebGLProgram: Unsupported color space: ",r),[e,"LinearTransferOETF"]}}function ff(r,e,t){let n=r.getShaderParameter(e,r.COMPILE_STATUS),s=(r.getShaderInfoLog(e)||"").trim();if(n&&s==="")return"";let a=/ERROR: 0:(\d+)/.exec(s);if(a){let c=parseInt(a[1]);return t.toUpperCase()+`

`+s+`

`+M_(r.getShaderSource(e),c)}else return s}function E_(r,e){let t=b_(e);return[`vec4 ${r}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}var S_={[kl]:"Linear",[Gl]:"Reinhard",[Vl]:"Cineon",[aa]:"ACESFilmic",[Xl]:"AgX",[ql]:"Neutral",[Wl]:"Custom"};function T_(r,e){let t=S_[e];return t===void 0?(Le("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+r+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+r+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var Pc=new L;function w_(){je.getLuminanceCoefficients(Pc);let r=Pc.x.toFixed(4),e=Pc.y.toFixed(4),t=Pc.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${r}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function A_(r){return[r.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",r.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(xa).join(`
`)}function R_(r){let e=[];for(let t in r){let n=r[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function C_(r,e){let t={},n=r.getProgramParameter(e,r.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){let s=r.getActiveAttrib(e,i),a=s.name,c=1;s.type===r.FLOAT_MAT2&&(c=2),s.type===r.FLOAT_MAT3&&(c=3),s.type===r.FLOAT_MAT4&&(c=4),t[a]={type:s.type,location:r.getAttribLocation(e,a),locationSize:c}}return t}function xa(r){return r!==""}function pf(r,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return r.replace(/NUM_SUN_LIGHTS/g,e.numSunLights).replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,e.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function mf(r,e){return r.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var I_=/^[ \t]*#include +<([\w\d./]+)>/gm;function vh(r){return r.replace(I_,L_)}var P_=new Map;function L_(r,e){let t=$e[e];if(t===void 0){let n=P_.get(e);if(n!==void 0)t=$e[n],Le('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return vh(t)}var N_=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function gf(r){return r.replace(N_,D_)}function D_(r,e,t,n){let i="";for(let s=parseInt(e);s<parseInt(t);s++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return i}function xf(r){let e=`precision ${r.precision} float;
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
#define LOW_PRECISION`),e}var U_={[ra]:"SHADOWMAP_TYPE_PCF",[tr]:"SHADOWMAP_TYPE_VSM"};function z_(r){return U_[r.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var F_={[Gi]:"ENVMAP_TYPE_CUBE",[us]:"ENVMAP_TYPE_CUBE",[oa]:"ENVMAP_TYPE_CUBE_UV"};function O_(r){return r.envMap===!1?"ENVMAP_TYPE_CUBE":F_[r.envMapMode]||"ENVMAP_TYPE_CUBE"}var B_={[us]:"ENVMAP_MODE_REFRACTION"};function H_(r){return r.envMap===!1?"ENVMAP_MODE_REFLECTION":B_[r.envMapMode]||"ENVMAP_MODE_REFLECTION"}var k_={[Hl]:"ENVMAP_BLENDING_MULTIPLY",[Ad]:"ENVMAP_BLENDING_MIX",[Rd]:"ENVMAP_BLENDING_ADD"};function G_(r){return r.envMap===!1?"ENVMAP_BLENDING_NONE":k_[r.combine]||"ENVMAP_BLENDING_NONE"}function V_(r){let e=r.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function W_(r,e,t,n){let i=r.getContext(),s=t.defines,a=t.vertexShader,c=t.fragmentShader,o=z_(t),h=O_(t),l=H_(t),u=G_(t),d=V_(t),p=A_(t),g=R_(s),x=i.createProgram(),m,f,M=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(xa).join(`
`),m.length>0&&(m+=`
`),f=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(xa).join(`
`),f.length>0&&(f+=`
`)):(m=[xf(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+o:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(xa).join(`
`),f=[xf(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.envMap?"#define "+l:"",t.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.retroreflection?"#define USE_RETROREFLECTION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+o:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Fn?"#define TONE_MAPPING":"",t.toneMapping!==Fn?$e.tonemapping_pars_fragment:"",t.toneMapping!==Fn?T_("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",$e.colorspace_pars_fragment,E_("linearToOutputTexel",t.outputColorSpace),w_(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(xa).join(`
`)),a=vh(a),a=pf(a,t),a=mf(a,t),c=vh(c),c=pf(c,t),c=mf(c,t),a=gf(a),c=gf(c),t.isRawShaderMaterial!==!0&&(M=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,f=["#define varying in",t.glslVersion===nh?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===nh?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);let T=M+m+a,y=M+f+c,E=uf(i,i.VERTEX_SHADER,T),w=uf(i,i.FRAGMENT_SHADER,y);i.attachShader(x,E),i.attachShader(x,w),t.index0AttributeName!==void 0?i.bindAttribLocation(x,0,t.index0AttributeName):t.hasPositionAttribute===!0&&i.bindAttribLocation(x,0,"position"),i.linkProgram(x);function S(C){if(r.debug.checkShaderErrors){let I=i.getProgramInfoLog(x)||"",F=i.getShaderInfoLog(E)||"",N=i.getShaderInfoLog(w)||"",U=I.trim(),D=F.trim(),O=N.trim(),X=!0,k=!0;if(i.getProgramParameter(x,i.LINK_STATUS)===!1)if(X=!1,typeof r.debug.onShaderError=="function")r.debug.onShaderError(i,x,E,w);else{let Y=ff(i,E,"vertex"),K=ff(i,w,"fragment");He("WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(x,i.VALIDATE_STATUS)+`

Material Name: `+C.name+`
Material Type: `+C.type+`

Program Info Log: `+U+`
`+Y+`
`+K)}else U!==""?Le("WebGLProgram: Program Info Log:",U):(D===""||O==="")&&(k=!1);k&&(C.diagnostics={runnable:X,programLog:U,vertexShader:{log:D,prefix:m},fragmentShader:{log:O,prefix:f}})}i.deleteShader(E),i.deleteShader(w),_=new hr(i,x),v=C_(i,x)}let _;this.getUniforms=function(){return _===void 0&&S(this),_};let v;this.getAttributes=function(){return v===void 0&&S(this),v};let R=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return R===!1&&(R=i.getProgramParameter(x,y_)),R},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(x),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=v_++,this.cacheKey=e,this.usedTimes=1,this.program=x,this.vertexShader=E,this.fragmentShader=w,this}var X_=0,Mh=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){let i=this._getShaderCacheForMaterial(e);return i.has(t)===!1&&(i.add(t),t.usedTimes++),i.has(n)===!1&&(i.add(n),n.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new bh(e),t.set(e,n)),n}},bh=class{constructor(e){this.id=X_++,this.code=e,this.usedTimes=0}};function q_(r){return r===Wi||r===da||r===fa}function Y_(r,e,t,n,i,s){let a=new Vs,c=new Mh,o=new Set,h=[],l=new Map,u=n.logarithmicDepthBuffer,d=n.precision,p={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(_){return o.add(_),_===0?"uv":`uv${_}`}function x(_,v,R,C,I,F){let N=C.fog,U=I.geometry,D=_.isMeshStandardMaterial||_.isMeshLambertMaterial||_.isMeshPhongMaterial?C.environment:null,O=_.isMeshStandardMaterial||_.isMeshLambertMaterial&&!_.envMap||_.isMeshPhongMaterial&&!_.envMap,X=e.get(_.envMap||D,O),k=X&&X.mapping===oa?X.image.height:null,Y=p[_.type];_.precision!==null&&(d=n.getMaxPrecision(_.precision),d!==_.precision&&Le("WebGLProgram.getParameters:",_.precision,"not supported, using",d,"instead."));let K=U.morphAttributes.position||U.morphAttributes.normal||U.morphAttributes.color,_e=K!==void 0?K.length:0,Me=0;U.morphAttributes.position!==void 0&&(Me=1),U.morphAttributes.normal!==void 0&&(Me=2),U.morphAttributes.color!==void 0&&(Me=3);let ct,tt,rt,Q;if(Y){let St=Qn[Y];ct=St.vertexShader,tt=St.fragmentShader}else{ct=_.vertexShader,tt=_.fragmentShader;let St=c.getVertexShaderStage(_),ht=c.getFragmentShaderStage(_);c.update(_,St,ht),rt=St.id,Q=ht.id}let ne=r.getRenderTarget(),ye=r.state.buffers.depth.getReversed(),Ge=I.isInstancedMesh===!0,Se=I.isBatchedMesh===!0,Ve=!!_.map,ft=!!_.matcap,ie=!!X,re=!!_.aoMap,oe=!!_.lightMap,ce=!!_.bumpMap&&_.wireframe===!1,ue=!!_.normalMap,Oe=!!_.displacementMap,ze=!!_.emissiveMap,We=!!_.metalnessMap,qe=!!_.roughnessMap,z=_.anisotropy>0,lt=_.clearcoat>0,nt=_.dispersion>0,P=_.retroreflectivity>0,b=_.iridescence>0,G=_.sheen>0,q=_.transmission>0,$=z&&!!_.anisotropyMap,le=lt&&!!_.clearcoatMap,he=lt&&!!_.clearcoatNormalMap,j=lt&&!!_.clearcoatRoughnessMap,te=b&&!!_.iridescenceMap,de=b&&!!_.iridescenceThicknessMap,Ne=G&&!!_.sheenColorMap,ge=G&&!!_.sheenRoughnessMap,fe=!!_.specularMap,De=!!_.specularColorMap,Be=!!_.specularIntensityMap,Ze=q&&!!_.transmissionMap,H=q&&!!_.thicknessMap,pe=!!_.gradientMap,ee=!!_.alphaMap,me=_.alphaTest>0,Ee=!!_.alphaHash,se=!!_.extensions,Ue=Fn;_.toneMapped&&(ne===null||ne.isXRRenderTarget===!0)&&(Ue=r.toneMapping);let Ie={shaderID:Y,shaderType:_.type,shaderName:_.name,vertexShader:ct,fragmentShader:tt,defines:_.defines,customVertexShaderID:rt,customFragmentShaderID:Q,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:d,batching:Se,batchingColor:Se&&I._colorsTexture!==null,instancing:Ge,instancingColor:Ge&&I.instanceColor!==null,instancingMorph:Ge&&I.morphTexture!==null,outputColorSpace:ne===null?r.outputColorSpace:ne.isXRRenderTarget===!0?ne.texture.colorSpace:je.workingColorSpace,alphaToCoverage:!!_.alphaToCoverage,map:Ve,matcap:ft,envMap:ie,envMapMode:ie&&X.mapping,envMapCubeUVHeight:k,aoMap:re,lightMap:oe,bumpMap:ce,normalMap:ue,displacementMap:Oe,emissiveMap:ze,normalMapObjectSpace:ue&&_.normalMapType===Nd,normalMapTangentSpace:ue&&_.normalMapType===Ac,packedNormalMap:ue&&_.normalMapType===Ac&&q_(_.normalMap.format),metalnessMap:We,roughnessMap:qe,anisotropy:z,anisotropyMap:$,clearcoat:lt,clearcoatMap:le,clearcoatNormalMap:he,clearcoatRoughnessMap:j,dispersion:nt,retroreflection:P,iridescence:b,iridescenceMap:te,iridescenceThicknessMap:de,sheen:G,sheenColorMap:Ne,sheenRoughnessMap:ge,specularMap:fe,specularColorMap:De,specularIntensityMap:Be,transmission:q,transmissionMap:Ze,thicknessMap:H,gradientMap:pe,opaque:_.transparent===!1&&_.blending===nr&&_.alphaToCoverage===!1,alphaMap:ee,alphaTest:me,alphaHash:Ee,combine:_.combine,mapUv:Ve&&g(_.map.channel),aoMapUv:re&&g(_.aoMap.channel),lightMapUv:oe&&g(_.lightMap.channel),bumpMapUv:ce&&g(_.bumpMap.channel),normalMapUv:ue&&g(_.normalMap.channel),displacementMapUv:Oe&&g(_.displacementMap.channel),emissiveMapUv:ze&&g(_.emissiveMap.channel),metalnessMapUv:We&&g(_.metalnessMap.channel),roughnessMapUv:qe&&g(_.roughnessMap.channel),anisotropyMapUv:$&&g(_.anisotropyMap.channel),clearcoatMapUv:le&&g(_.clearcoatMap.channel),clearcoatNormalMapUv:he&&g(_.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:j&&g(_.clearcoatRoughnessMap.channel),iridescenceMapUv:te&&g(_.iridescenceMap.channel),iridescenceThicknessMapUv:de&&g(_.iridescenceThicknessMap.channel),sheenColorMapUv:Ne&&g(_.sheenColorMap.channel),sheenRoughnessMapUv:ge&&g(_.sheenRoughnessMap.channel),specularMapUv:fe&&g(_.specularMap.channel),specularColorMapUv:De&&g(_.specularColorMap.channel),specularIntensityMapUv:Be&&g(_.specularIntensityMap.channel),transmissionMapUv:Ze&&g(_.transmissionMap.channel),thicknessMapUv:H&&g(_.thicknessMap.channel),alphaMapUv:ee&&g(_.alphaMap.channel),vertexTangents:!!U.attributes.tangent&&(ue||z),vertexNormals:!!U.attributes.normal,vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&!!U.attributes.color&&U.attributes.color.itemSize===4,pointsUvs:I.isPoints===!0&&!!U.attributes.uv&&(Ve||ee),fog:!!N,useFog:_.fog===!0,fogExp2:!!N&&N.isFogExp2,flatShading:_.wireframe===!1&&(_.flatShading===!0||U.attributes.normal===void 0&&ue===!1&&(_.isMeshLambertMaterial||_.isMeshPhongMaterial||_.isMeshStandardMaterial||_.isMeshPhysicalMaterial)),sizeAttenuation:_.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:ye,skinning:I.isSkinnedMesh===!0,hasPositionAttribute:U.attributes.position!==void 0,morphTargets:U.morphAttributes.position!==void 0,morphNormals:U.morphAttributes.normal!==void 0,morphColors:U.morphAttributes.color!==void 0,morphTargetsCount:_e,morphTextureStride:Me,numSunLights:v.sun.length,numDirLights:v.directional.length,numPointLights:v.point.length,numSpotLights:v.spot.length,numSpotLightMaps:v.spotLightMap.length,numRectAreaLights:v.rectArea.length,numHemiLights:v.hemi.length,numSunLightShadows:v.sunShadowMap.length,numDirLightShadows:v.directionalShadowMap.length,numPointLightShadows:v.pointShadowMap.length,numSpotLightShadows:v.spotShadowMap.length,numSpotLightShadowsWithMaps:v.numSpotLightShadowsWithMaps,numLightProbes:v.numLightProbes,numLightProbeGrids:F.length,numClippingPlanes:s.numPlanes,numClipIntersection:s.numIntersection,dithering:_.dithering,shadowMapEnabled:r.shadowMap.enabled&&R.length>0,shadowMapType:r.shadowMap.type,toneMapping:Ue,decodeVideoTexture:Ve&&_.map.isVideoTexture===!0&&je.getTransfer(_.map.colorSpace)===dt,decodeVideoTextureEmissive:ze&&_.emissiveMap.isVideoTexture===!0&&je.getTransfer(_.emissiveMap.colorSpace)===dt,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===Ct,flipSided:_.side===sn,useDepthPacking:_.depthPacking>=0,depthPacking:_.depthPacking||0,index0AttributeName:_.index0AttributeName,extensionClipCullDistance:se&&_.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(se&&_.extensions.multiDraw===!0||Se)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:_.customProgramCacheKey()};return Ie.vertexUv1s=o.has(1),Ie.vertexUv2s=o.has(2),Ie.vertexUv3s=o.has(3),o.clear(),Ie}function m(_){let v=[];if(_.shaderID?v.push(_.shaderID):(v.push(_.customVertexShaderID),v.push(_.customFragmentShaderID)),_.defines!==void 0)for(let R in _.defines)v.push(R),v.push(_.defines[R]);return _.isRawShaderMaterial===!1&&(f(v,_),M(v,_),v.push(r.outputColorSpace)),v.push(_.customProgramCacheKey),v.join()}function f(_,v){_.push(v.precision),_.push(v.outputColorSpace),_.push(v.envMapMode),_.push(v.envMapCubeUVHeight),_.push(v.mapUv),_.push(v.alphaMapUv),_.push(v.lightMapUv),_.push(v.aoMapUv),_.push(v.bumpMapUv),_.push(v.normalMapUv),_.push(v.displacementMapUv),_.push(v.emissiveMapUv),_.push(v.metalnessMapUv),_.push(v.roughnessMapUv),_.push(v.anisotropyMapUv),_.push(v.clearcoatMapUv),_.push(v.clearcoatNormalMapUv),_.push(v.clearcoatRoughnessMapUv),_.push(v.iridescenceMapUv),_.push(v.iridescenceThicknessMapUv),_.push(v.sheenColorMapUv),_.push(v.sheenRoughnessMapUv),_.push(v.specularMapUv),_.push(v.specularColorMapUv),_.push(v.specularIntensityMapUv),_.push(v.transmissionMapUv),_.push(v.thicknessMapUv),_.push(v.combine),_.push(v.fogExp2),_.push(v.sizeAttenuation),_.push(v.morphTargetsCount),_.push(v.morphAttributeCount),_.push(v.numSunLights),_.push(v.numDirLights),_.push(v.numPointLights),_.push(v.numSpotLights),_.push(v.numSpotLightMaps),_.push(v.numHemiLights),_.push(v.numRectAreaLights),_.push(v.numSunLightShadows),_.push(v.numDirLightShadows),_.push(v.numPointLightShadows),_.push(v.numSpotLightShadows),_.push(v.numSpotLightShadowsWithMaps),_.push(v.numLightProbes),_.push(v.shadowMapType),_.push(v.toneMapping),_.push(v.numClippingPlanes),_.push(v.numClipIntersection),_.push(v.depthPacking)}function M(_,v){a.disableAll(),v.instancing&&a.enable(0),v.instancingColor&&a.enable(1),v.instancingMorph&&a.enable(2),v.matcap&&a.enable(3),v.envMap&&a.enable(4),v.normalMapObjectSpace&&a.enable(5),v.normalMapTangentSpace&&a.enable(6),v.clearcoat&&a.enable(7),v.iridescence&&a.enable(8),v.alphaTest&&a.enable(9),v.vertexColors&&a.enable(10),v.vertexAlphas&&a.enable(11),v.vertexUv1s&&a.enable(12),v.vertexUv2s&&a.enable(13),v.vertexUv3s&&a.enable(14),v.vertexTangents&&a.enable(15),v.anisotropy&&a.enable(16),v.alphaHash&&a.enable(17),v.batching&&a.enable(18),v.dispersion&&a.enable(19),v.retroreflection&&a.enable(24),v.batchingColor&&a.enable(20),v.gradientMap&&a.enable(21),v.packedNormalMap&&a.enable(22),v.vertexNormals&&a.enable(23),_.push(a.mask),a.disableAll(),v.fog&&a.enable(0),v.useFog&&a.enable(1),v.flatShading&&a.enable(2),v.logarithmicDepthBuffer&&a.enable(3),v.reversedDepthBuffer&&a.enable(4),v.skinning&&a.enable(5),v.morphTargets&&a.enable(6),v.morphNormals&&a.enable(7),v.morphColors&&a.enable(8),v.premultipliedAlpha&&a.enable(9),v.shadowMapEnabled&&a.enable(10),v.doubleSided&&a.enable(11),v.flipSided&&a.enable(12),v.useDepthPacking&&a.enable(13),v.dithering&&a.enable(14),v.transmission&&a.enable(15),v.sheen&&a.enable(16),v.opaque&&a.enable(17),v.pointsUvs&&a.enable(18),v.decodeVideoTexture&&a.enable(19),v.decodeVideoTextureEmissive&&a.enable(20),v.alphaToCoverage&&a.enable(21),v.numLightProbeGrids>0&&a.enable(22),v.hasPositionAttribute&&a.enable(23),_.push(a.mask)}function T(_){let v=p[_.type],R;if(v){let C=Qn[v];R=$d.clone(C.uniforms)}else R=_.uniforms;return R}function y(_,v){let R=l.get(v);return R!==void 0?++R.usedTimes:(R=new W_(r,v,_,i),h.push(R),l.set(v,R)),R}function E(_){if(--_.usedTimes===0){let v=h.indexOf(_);h[v]=h[h.length-1],h.pop(),l.delete(_.cacheKey),_.destroy()}}function w(_){c.remove(_)}function S(){c.dispose()}return{getParameters:x,getProgramCacheKey:m,getUniforms:T,acquireProgram:y,releaseProgram:E,releaseShaderCache:w,programs:h,dispose:S}}function Z_(){let r=new WeakMap;function e(a){return r.has(a)}function t(a){let c=r.get(a);return c===void 0&&(c={},r.set(a,c)),c}function n(a){r.delete(a)}function i(a,c,o){r.get(a)[c]=o}function s(){r=new WeakMap}return{has:e,get:t,remove:n,update:i,dispose:s}}function K_(r,e){return r.groupOrder!==e.groupOrder?r.groupOrder-e.groupOrder:r.renderOrder!==e.renderOrder?r.renderOrder-e.renderOrder:r.material.id!==e.material.id?r.material.id-e.material.id:r.materialVariant!==e.materialVariant?r.materialVariant-e.materialVariant:r.z!==e.z?r.z-e.z:r.id-e.id}function _f(r,e){return r.groupOrder!==e.groupOrder?r.groupOrder-e.groupOrder:r.renderOrder!==e.renderOrder?r.renderOrder-e.renderOrder:r.z!==e.z?e.z-r.z:r.id-e.id}function yf(){let r=[],e=0,t=[],n=[],i=[];function s(){e=0,t.length=0,n.length=0,i.length=0}function a(d){let p=0;return d.isInstancedMesh&&(p+=2),d.isSkinnedMesh&&(p+=1),p}function c(d,p,g,x,m,f){let M=r[e];return M===void 0?(M={id:d.id,object:d,geometry:p,material:g,materialVariant:a(d),groupOrder:x,renderOrder:d.renderOrder,z:m,group:f},r[e]=M):(M.id=d.id,M.object=d,M.geometry=p,M.material=g,M.materialVariant=a(d),M.groupOrder=x,M.renderOrder=d.renderOrder,M.z=m,M.group=f),e++,M}function o(d,p,g,x,m,f,M){M.reversedDepth===!0&&(m=-m);let T=c(d,p,g,x,m,f);g.transmission>0?n.push(T):g.transparent===!0?i.push(T):t.push(T)}function h(d,p,g,x,m,f){let M=c(d,p,g,x,m,f);g.transmission>0?n.unshift(M):g.transparent===!0?i.unshift(M):t.unshift(M)}function l(d,p){t.length>1&&t.sort(d||K_),n.length>1&&n.sort(p||_f),i.length>1&&i.sort(p||_f)}function u(){for(let d=e,p=r.length;d<p;d++){let g=r[d];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:t,transmissive:n,transparent:i,init:s,push:o,unshift:h,finish:u,sort:l}}function J_(){let r=new WeakMap;function e(n,i){let s=r.get(n),a;return s===void 0?(a=new yf,r.set(n,[a])):i>=s.length?(a=new yf,s.push(a)):a=s[i],a}function t(){r=new WeakMap}return{get:e,dispose:t}}function $_(){let r={};return{get:function(e){if(r[e.id]!==void 0)return r[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={direction:new L,color:new Ae};break;case"SpotLight":t={position:new L,direction:new L,color:new Ae,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new L,color:new Ae,distance:0,decay:0};break;case"HemisphereLight":t={direction:new L,skyColor:new Ae,groundColor:new Ae};break;case"RectAreaLight":t={color:new Ae,position:new L,halfWidth:new L,halfHeight:new L};break}return r[e.id]=t,t}}}function j_(){let r={};return{get:function(e){if(r[e.id]!==void 0)return r[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ae};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ae};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ae,shadowCameraNear:1,shadowCameraFar:1e3};break}return r[e.id]=t,t}}}var Q_=0;function ey(r,e){return(e.castShadow?2:0)-(r.castShadow?2:0)+(e.map?1:0)-(r.map?1:0)}function ty(r){let e=new $_,t=j_(),n={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)n.probe.push(new L);let i=new L,s=new Fe,a=new Fe;function c(h){let l=0,u=0,d=0;for(let I=0;I<9;I++)n.probe[I].set(0,0,0);let p=0,g=0,x=0,m=0,f=0,M=0,T=0,y=0,E=0,w=0,S=0,_=0,v=0,R=0;h.sort(ey);for(let I=0,F=h.length;I<F;I++){let N=h[I],U=N.color,D=N.intensity,O=N.distance,X=null;if(N.shadow&&N.shadow.map&&(N.shadow.map.texture.format===Wi?X=N.shadow.map.texture:X=N.shadow.map.depthTexture||N.shadow.map.texture),N.isAmbientLight)l+=U.r*D,u+=U.g*D,d+=U.b*D;else if(N.isLightProbe){for(let k=0;k<9;k++)n.probe[k].addScaledVector(N.sh.coefficients[k],D);R++}else if(N.isSunLight){let k=e.get(N);if(k.color.copy(N.color).multiplyScalar(N.intensity),N.castShadow){let Y=N.shadow,K=t.get(N);K.shadowIntensity=Y.intensity,K.shadowBias=Y.bias,K.shadowNormalBias=Y.normalBias,K.shadowRadius=Y.radius,K.shadowMapSize.copy(Y.mapSize).multiply(Y.getFrameExtents()),n.sunShadow[g]=K,n.sunShadowMap[g]=X;let _e=Y.getViewportCount();for(let Me=0;Me<_e;Me++)n.sunShadowMatrix[x+Me]=Y.getMatrix(Me),n.sunShadowCascade[x+Me]=Y._cascadeData[Me];x+=_e,g++}n.sun[p]=k,p++}else if(N.isDirectionalLight){let k=e.get(N);if(k.color.copy(N.color).multiplyScalar(N.intensity),N.castShadow){let Y=N.shadow,K=t.get(N);K.shadowIntensity=Y.intensity,K.shadowBias=Y.bias,K.shadowNormalBias=Y.normalBias,K.shadowRadius=Y.radius,K.shadowMapSize=Y.mapSize,n.directionalShadow[m]=K,n.directionalShadowMap[m]=X,n.directionalShadowMatrix[m]=N.shadow.matrix,E++}n.directional[m]=k,m++}else if(N.isSpotLight){let k=e.get(N);k.position.setFromMatrixPosition(N.matrixWorld),k.color.copy(U).multiplyScalar(D),k.distance=O,k.coneCos=Math.cos(N.angle),k.penumbraCos=Math.cos(N.angle*(1-N.penumbra)),k.decay=N.decay,n.spot[M]=k;let Y=N.shadow;if(N.map&&(n.spotLightMap[_]=N.map,_++,Y.updateMatrices(N),N.castShadow&&v++),n.spotLightMatrix[M]=Y.matrix,N.castShadow){let K=t.get(N);K.shadowIntensity=Y.intensity,K.shadowBias=Y.bias,K.shadowNormalBias=Y.normalBias,K.shadowRadius=Y.radius,K.shadowMapSize=Y.mapSize,n.spotShadow[M]=K,n.spotShadowMap[M]=X,S++}M++}else if(N.isRectAreaLight){let k=e.get(N);k.color.copy(U).multiplyScalar(D),k.halfWidth.set(N.width*.5,0,0),k.halfHeight.set(0,N.height*.5,0),n.rectArea[T]=k,T++}else if(N.isPointLight){let k=e.get(N);if(k.color.copy(N.color).multiplyScalar(N.intensity),k.distance=N.distance,k.decay=N.decay,N.castShadow){let Y=N.shadow,K=t.get(N);K.shadowIntensity=Y.intensity,K.shadowBias=Y.bias,K.shadowNormalBias=Y.normalBias,K.shadowRadius=Y.radius,K.shadowMapSize=Y.mapSize,K.shadowCameraNear=Y.camera.near,K.shadowCameraFar=Y.camera.far,n.pointShadow[f]=K,n.pointShadowMap[f]=X,n.pointShadowMatrix[f]=N.shadow.matrix,w++}n.point[f]=k,f++}else if(N.isHemisphereLight){let k=e.get(N);k.skyColor.copy(N.color).multiplyScalar(D),k.groundColor.copy(N.groundColor).multiplyScalar(D),n.hemi[y]=k,y++}}T>0&&(r.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=xe.LTC_FLOAT_1,n.rectAreaLTC2=xe.LTC_FLOAT_2):(n.rectAreaLTC1=xe.LTC_HALF_1,n.rectAreaLTC2=xe.LTC_HALF_2)),n.ambient[0]=l,n.ambient[1]=u,n.ambient[2]=d;let C=n.hash;(C.sunLength!==p||C.directionalLength!==m||C.pointLength!==f||C.spotLength!==M||C.rectAreaLength!==T||C.hemiLength!==y||C.numSunShadows!==g||C.numDirectionalShadows!==E||C.numPointShadows!==w||C.numSpotShadows!==S||C.numSpotMaps!==_||C.numLightProbes!==R)&&(n.sun.length=p,n.directional.length=m,n.spot.length=M,n.rectArea.length=T,n.point.length=f,n.hemi.length=y,n.sunShadow.length=g,n.sunShadowMap.length=g,n.sunShadowMatrix.length=x,n.sunShadowCascade.length=x,n.directionalShadow.length=E,n.directionalShadowMap.length=E,n.directionalShadowMatrix.length=E,n.pointShadow.length=w,n.pointShadowMap.length=w,n.pointShadowMatrix.length=w,n.spotShadow.length=S,n.spotShadowMap.length=S,n.spotLightMatrix.length=S+_-v,n.spotLightMap.length=_,n.numSpotLightShadowsWithMaps=v,n.numLightProbes=R,C.sunLength=p,C.directionalLength=m,C.pointLength=f,C.spotLength=M,C.rectAreaLength=T,C.hemiLength=y,C.numSunShadows=g,C.numDirectionalShadows=E,C.numPointShadows=w,C.numSpotShadows=S,C.numSpotMaps=_,C.numLightProbes=R,n.version=Q_++)}function o(h,l){let u=0,d=0,p=0,g=0,x=0,m=0,f=l.matrixWorldInverse;for(let M=0,T=h.length;M<T;M++){let y=h[M];if(y.isSunLight){let E=n.sun[u];E.direction.setFromMatrixPosition(y.matrixWorld),E.direction.transformDirection(f),u++}else if(y.isDirectionalLight){let E=n.directional[d];E.direction.setFromMatrixPosition(y.matrixWorld),i.setFromMatrixPosition(y.target.matrixWorld),E.direction.sub(i),E.direction.transformDirection(f),d++}else if(y.isSpotLight){let E=n.spot[g];E.position.setFromMatrixPosition(y.matrixWorld),E.position.applyMatrix4(f),E.direction.setFromMatrixPosition(y.matrixWorld),i.setFromMatrixPosition(y.target.matrixWorld),E.direction.sub(i),E.direction.transformDirection(f),g++}else if(y.isRectAreaLight){let E=n.rectArea[x];E.position.setFromMatrixPosition(y.matrixWorld),E.position.applyMatrix4(f),a.identity(),s.copy(y.matrixWorld),s.premultiply(f),a.extractRotation(s),E.halfWidth.set(y.width*.5,0,0),E.halfHeight.set(0,y.height*.5,0),E.halfWidth.applyMatrix4(a),E.halfHeight.applyMatrix4(a),x++}else if(y.isPointLight){let E=n.point[p];E.position.setFromMatrixPosition(y.matrixWorld),E.position.applyMatrix4(f),p++}else if(y.isHemisphereLight){let E=n.hemi[m];E.direction.setFromMatrixPosition(y.matrixWorld),E.direction.transformDirection(f),m++}}}return{setup:c,setupView:o,state:n}}function vf(r){let e=new ty(r),t=[],n=[],i=[];function s(d){u.camera=d,t.length=0,n.length=0,i.length=0}function a(d){t.push(d)}function c(d){n.push(d)}function o(d){i.push(d)}function h(){e.setup(t)}function l(d){e.setupView(t,d)}let u={lightsArray:t,shadowsArray:n,lightProbeGridArray:i,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:s,state:u,setupLights:h,setupLightsView:l,pushLight:a,pushShadow:c,pushLightProbeGrid:o}}function ny(r){let e=new WeakMap;function t(i,s=0){let a=e.get(i),c;return a===void 0?(c=new vf(r),e.set(i,[c])):s>=a.length?(c=new vf(r),a.push(c)):c=a[s],c}function n(){e=new WeakMap}return{get:t,dispose:n}}var iy=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,sy=`uniform sampler2D shadow_pass;
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
}`,ry=[new L(1,0,0),new L(-1,0,0),new L(0,1,0),new L(0,-1,0),new L(0,0,1),new L(0,0,-1)],ay=[new L(0,-1,0),new L(0,-1,0),new L(0,0,1),new L(0,0,-1),new L(0,-1,0),new L(0,-1,0)],Mf=new Fe,ga=new L,mh=new L;function oy(r,e,t){let n=new Ys,i=new ae,s=new ae,a=new gt,c=new wo,o=new Ao,h={},l=t.maxTextureSize,u={[Jn]:sn,[sn]:Jn,[Ct]:Ct},d=new mn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ae},radius:{value:4}},vertexShader:iy,fragmentShader:sy}),p=d.clone();p.defines.HORIZONTAL_PASS=1;let g=new xt;g.setAttribute("position",new Pt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let x=new J(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=ra;let f=this.type;this.render=function(w,S,_){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||w.length===0)return;this.type===Oo&&(Le("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=ra);let v=r.getRenderTarget(),R=r.getActiveCubeFace(),C=r.getActiveMipmapLevel(),I=r.state;I.setBlending($n),I.buffers.depth.getReversed()===!0?I.buffers.color.setClear(0,0,0,0):I.buffers.color.setClear(1,1,1,1),I.buffers.depth.setTest(!0),I.setScissorTest(!1);let F=f!==this.type;F&&S.traverse(function(N){N.material&&(Array.isArray(N.material)?N.material.forEach(U=>U.needsUpdate=!0):N.material.needsUpdate=!0)});for(let N=0,U=w.length;N<U;N++){let D=w[N],O=D.shadow;if(O===void 0){Le("WebGLShadowMap:",D,"has no shadow.");continue}if(O.autoUpdate===!1&&O.needsUpdate===!1)continue;i.copy(O.mapSize);let X=O.getFrameExtents();i.multiply(X),s.copy(O.mapSize),(i.x>l||i.y>l)&&(i.x>l&&(s.x=Math.floor(l/X.x),i.x=s.x*X.x,O.mapSize.x=s.x),i.y>l&&(s.y=Math.floor(l/X.y),i.y=s.y*X.y,O.mapSize.y=s.y));let k=r.state.buffers.depth.getReversed();if(O.camera._reversedDepth=k,O.map===null||F===!0){if(O.map!==null&&(O.map.depthTexture!==null&&(O.map.depthTexture.dispose(),O.map.depthTexture=null),O.map.dispose()),this.type===tr){if(D.isPointLight){Le("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}O.map=new rn(i.x,i.y,{format:Wi,type:Hn,minFilter:Dt,magFilter:Dt,generateMipmaps:!1}),O.map.texture.name=D.name+".shadowMap",O.map.depthTexture=new Ui(i.x,i.y,gn),O.map.depthTexture.name=D.name+".shadowMapDepth",O.map.depthTexture.format=qn,O.map.depthTexture.compareFunction=null,O.map.depthTexture.minFilter=Nt,O.map.depthTexture.magFilter=Nt}else D.isPointLight?(O.map=new Lc(i.x),O.map.depthTexture=new xo(i.x,Bn)):(O.map=new rn(i.x,i.y),O.map.depthTexture=new Ui(i.x,i.y,Bn)),O.map.depthTexture.name=D.name+".shadowMap",O.map.depthTexture.format=qn,this.type===ra?(O.map.depthTexture.compareFunction=k?Cc:Rc,O.map.depthTexture.minFilter=Dt,O.map.depthTexture.magFilter=Dt):(O.map.depthTexture.compareFunction=null,O.map.depthTexture.minFilter=Nt,O.map.depthTexture.magFilter=Nt);O.camera.updateProjectionMatrix()}O.map.isWebGLCubeRenderTarget!==!0&&(O.map.width!==i.x||O.map.height!==i.y)&&O.map.setSize(i.x,i.y);let Y=O.map.isWebGLCubeRenderTarget?6:O.getViewportCount();D.isPointLight!==!0&&O.updateMatrices(D,_);for(let K=0;K<Y;K++){let _e=O.getCamera(K);if(D.isPointLight){let Me=O.camera,ct=O.matrix,tt=D.distance||Me.far;tt!==Me.far&&(Me.far=tt,Me.updateProjectionMatrix()),ga.setFromMatrixPosition(D.matrixWorld),Me.position.copy(ga),mh.copy(Me.position),mh.add(ry[K]),Me.up.copy(ay[K]),Me.lookAt(mh),Me.updateMatrixWorld(),ct.makeTranslation(-ga.x,-ga.y,-ga.z),Mf.multiplyMatrices(Me.projectionMatrix,Me.matrixWorldInverse),O._frustum.setFromProjectionMatrix(Mf,Me.coordinateSystem,Me.reversedDepth)}if(O.map.isWebGLCubeRenderTarget)r.setRenderTarget(O.map,K),r.clear();else{K===0&&(r.setRenderTarget(O.map),r.clear());let Me=O.getViewport(K);a.set(s.x*Me.x,s.y*Me.y,s.x*Me.z,s.y*Me.w),I.viewport(a)}n=O.getFrustum(K),y(S,_,_e,D,this.type)}O.isPointLightShadow!==!0&&this.type===tr&&M(O,_),O.needsUpdate=!1}f=this.type,m.needsUpdate=!1,r.setRenderTarget(v,R,C)};function M(w,S){let _=e.update(x);d.defines.VSM_SAMPLES!==w.blurSamples&&(d.defines.VSM_SAMPLES=w.blurSamples,p.defines.VSM_SAMPLES=w.blurSamples,d.needsUpdate=!0,p.needsUpdate=!0),w.mapPass===null?w.mapPass=new rn(i.x,i.y,{format:Wi,type:Hn}):(w.mapPass.width!==w.map.width||w.mapPass.height!==w.map.height)&&w.mapPass.setSize(w.map.width,w.map.height),d.uniforms.shadow_pass.value=w.map.depthTexture,d.uniforms.resolution.value.set(w.map.width,w.map.height),d.uniforms.radius.value=w.radius,r.setRenderTarget(w.mapPass),r.clear(),r.renderBufferDirect(S,null,_,d,x,null),p.uniforms.shadow_pass.value=w.mapPass.texture,p.uniforms.resolution.value.set(w.map.width,w.map.height),p.uniforms.radius.value=w.radius,r.setRenderTarget(w.map),r.clear(),r.renderBufferDirect(S,null,_,p,x,null)}function T(w,S,_,v){let R=null,C=_.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(C!==void 0)R=C;else if(R=_.isPointLight===!0?o:c,r.localClippingEnabled&&S.clipShadows===!0&&Array.isArray(S.clippingPlanes)&&S.clippingPlanes.length!==0||S.displacementMap&&S.displacementScale!==0||S.alphaMap&&S.alphaTest>0||S.map&&S.alphaTest>0||S.alphaToCoverage===!0){let I=R.uuid,F=S.uuid,N=h[I];N===void 0&&(N={},h[I]=N);let U=N[F];U===void 0&&(U=R.clone(),N[F]=U,S.addEventListener("dispose",E)),R=U}if(R.visible=S.visible,R.wireframe=S.wireframe,v===tr?R.side=S.shadowSide!==null?S.shadowSide:S.side:R.side=S.shadowSide!==null?S.shadowSide:u[S.side],R.alphaMap=S.alphaMap,R.alphaTest=S.alphaToCoverage===!0?.5:S.alphaTest,R.map=S.map,R.clipShadows=S.clipShadows,R.clippingPlanes=S.clippingPlanes,R.clipIntersection=S.clipIntersection,R.displacementMap=S.displacementMap,R.displacementScale=S.displacementScale,R.displacementBias=S.displacementBias,R.wireframeLinewidth=S.wireframeLinewidth,R.linewidth=S.linewidth,_.isPointLight===!0&&R.isMeshDistanceMaterial===!0){let I=r.properties.get(R);I.light=_}return R}function y(w,S,_,v,R){if(w.visible===!1)return;if(w.layers.test(S.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&R===tr)&&(!w.frustumCulled||w.intersectsFrustum(n))){w.modelViewMatrix.multiplyMatrices(_.matrixWorldInverse,w.matrixWorld);let F=e.update(w),N=w.material;if(Array.isArray(N)){let U=F.groups;for(let D=0,O=U.length;D<O;D++){let X=U[D],k=N[X.materialIndex];if(k&&k.visible){let Y=T(w,k,v,R);w.onBeforeShadow(r,w,S,_,F,Y,X),r.renderBufferDirect(_,null,F,Y,w,X),w.onAfterShadow(r,w,S,_,F,Y,X)}}}else if(N.visible){let U=T(w,N,v,R);w.onBeforeShadow(r,w,S,_,F,U,null),r.renderBufferDirect(_,null,F,U,w,null),w.onAfterShadow(r,w,S,_,F,U,null)}}let I=w.children;for(let F=0,N=I.length;F<N;F++)y(I[F],S,_,v,R)}function E(w){w.target.removeEventListener("dispose",E);for(let _ in h){let v=h[_],R=w.target.uuid;R in v&&(v[R].dispose(),delete v[R])}}}function cy(r,e){function t(){let H=!1,pe=new gt,ee=null,me=new gt(0,0,0,0);return{setMask:function(Ee){ee!==Ee&&!H&&(r.colorMask(Ee,Ee,Ee,Ee),ee=Ee)},setLocked:function(Ee){H=Ee},setClear:function(Ee,se,Ue,Ie,St){St===!0&&(Ee*=Ie,se*=Ie,Ue*=Ie),pe.set(Ee,se,Ue,Ie),me.equals(pe)===!1&&(r.clearColor(Ee,se,Ue,Ie),me.copy(pe))},reset:function(){H=!1,ee=null,me.set(-1,0,0,0)}}}function n(){let H=!1,pe=!1,ee=null,me=null,Ee=null;return{setReversed:function(se){if(pe!==se){let Ue=e.get("EXT_clip_control");se?Ue.clipControlEXT(Ue.LOWER_LEFT_EXT,Ue.ZERO_TO_ONE_EXT):Ue.clipControlEXT(Ue.LOWER_LEFT_EXT,Ue.NEGATIVE_ONE_TO_ONE_EXT),pe=se;let Ie=Ee;Ee=null,this.setClear(Ie)}},getReversed:function(){return pe},setTest:function(se){se?ne(r.DEPTH_TEST):ye(r.DEPTH_TEST)},setMask:function(se){ee!==se&&!H&&(r.depthMask(se),ee=se)},setFunc:function(se){if(pe&&(se=Wd[se]),me!==se){switch(se){case so:r.depthFunc(r.NEVER);break;case ro:r.depthFunc(r.ALWAYS);break;case ao:r.depthFunc(r.LESS);break;case Fs:r.depthFunc(r.LEQUAL);break;case oo:r.depthFunc(r.EQUAL);break;case co:r.depthFunc(r.GEQUAL);break;case lo:r.depthFunc(r.GREATER);break;case ho:r.depthFunc(r.NOTEQUAL);break;default:r.depthFunc(r.LEQUAL)}me=se}},setLocked:function(se){H=se},setClear:function(se){Ee!==se&&(Ee=se,pe&&(se=1-se),r.clearDepth(se))},reset:function(){H=!1,ee=null,me=null,Ee=null,pe=!1}}}function i(){let H=!1,pe=null,ee=null,me=null,Ee=null,se=null,Ue=null,Ie=null,St=null;return{setTest:function(ht){H||(ht?ne(r.STENCIL_TEST):ye(r.STENCIL_TEST))},setMask:function(ht){pe!==ht&&!H&&(r.stencilMask(ht),pe=ht)},setFunc:function(ht,Rn,Gn){(ee!==ht||me!==Rn||Ee!==Gn)&&(r.stencilFunc(ht,Rn,Gn),ee=ht,me=Rn,Ee=Gn)},setOp:function(ht,Rn,Gn){(se!==ht||Ue!==Rn||Ie!==Gn)&&(r.stencilOp(ht,Rn,Gn),se=ht,Ue=Rn,Ie=Gn)},setLocked:function(ht){H=ht},setClear:function(ht){St!==ht&&(r.clearStencil(ht),St=ht)},reset:function(){H=!1,pe=null,ee=null,me=null,Ee=null,se=null,Ue=null,Ie=null,St=null}}}let s=new t,a=new n,c=new i,o=new WeakMap,h=new WeakMap,l={},u={},d={},p=new WeakMap,g=[],x=null,m=!1,f=null,M=null,T=null,y=null,E=null,w=null,S=null,_=new Ae(0,0,0),v=0,R=!1,C=null,I=null,F=null,N=null,U=null,D=r.getParameter(r.MAX_COMBINED_TEXTURE_IMAGE_UNITS),O=!1,X=0,k=r.getParameter(r.VERSION);k.indexOf("WebGL")!==-1?(X=parseFloat(/^WebGL (\d)/.exec(k)[1]),O=X>=1):k.indexOf("OpenGL ES")!==-1&&(X=parseFloat(/^OpenGL ES (\d)/.exec(k)[1]),O=X>=2);let Y=null,K={},_e=r.getParameter(r.SCISSOR_BOX),Me=r.getParameter(r.VIEWPORT),ct=new gt().fromArray(_e),tt=new gt().fromArray(Me);function rt(H,pe,ee,me){let Ee=new Uint8Array(4),se=r.createTexture();r.bindTexture(H,se),r.texParameteri(H,r.TEXTURE_MIN_FILTER,r.NEAREST),r.texParameteri(H,r.TEXTURE_MAG_FILTER,r.NEAREST);for(let Ue=0;Ue<ee;Ue++)H===r.TEXTURE_3D||H===r.TEXTURE_2D_ARRAY?r.texImage3D(pe,0,r.RGBA,1,1,me,0,r.RGBA,r.UNSIGNED_BYTE,Ee):r.texImage2D(pe+Ue,0,r.RGBA,1,1,0,r.RGBA,r.UNSIGNED_BYTE,Ee);return se}let Q={};Q[r.TEXTURE_2D]=rt(r.TEXTURE_2D,r.TEXTURE_2D,1),Q[r.TEXTURE_CUBE_MAP]=rt(r.TEXTURE_CUBE_MAP,r.TEXTURE_CUBE_MAP_POSITIVE_X,6),Q[r.TEXTURE_2D_ARRAY]=rt(r.TEXTURE_2D_ARRAY,r.TEXTURE_2D_ARRAY,1,1),Q[r.TEXTURE_3D]=rt(r.TEXTURE_3D,r.TEXTURE_3D,1,1),s.setClear(0,0,0,1),a.setClear(1),c.setClear(0),ne(r.DEPTH_TEST),a.setFunc(Fs),ce(!1),ue(Ul),ne(r.CULL_FACE),re($n);function ne(H){l[H]!==!0&&(r.enable(H),l[H]=!0)}function ye(H){l[H]!==!1&&(r.disable(H),l[H]=!1)}function Ge(H,pe){return d[H]!==pe?(r.bindFramebuffer(H,pe),d[H]=pe,H===r.DRAW_FRAMEBUFFER&&(d[r.FRAMEBUFFER]=pe),H===r.FRAMEBUFFER&&(d[r.DRAW_FRAMEBUFFER]=pe),!0):!1}function Se(H,pe){let ee=g,me=!1;if(H){ee=p.get(pe),ee===void 0&&(ee=[],p.set(pe,ee));let Ee=H.textures;if(ee.length!==Ee.length||ee[0]!==r.COLOR_ATTACHMENT0){for(let se=0,Ue=Ee.length;se<Ue;se++)ee[se]=r.COLOR_ATTACHMENT0+se;ee.length=Ee.length,me=!0}}else ee[0]!==r.BACK&&(ee[0]=r.BACK,me=!0);me&&r.drawBuffers(ee)}function Ve(H){return x!==H?(r.useProgram(H),x=H,!0):!1}let ft={[hs]:r.FUNC_ADD,[hd]:r.FUNC_SUBTRACT,[ud]:r.FUNC_REVERSE_SUBTRACT};ft[dd]=r.MIN,ft[fd]=r.MAX;let ie={[pd]:r.ZERO,[md]:r.ONE,[gd]:r.SRC_COLOR,[Ol]:r.SRC_ALPHA,[bd]:r.SRC_ALPHA_SATURATE,[vd]:r.DST_COLOR,[_d]:r.DST_ALPHA,[xd]:r.ONE_MINUS_SRC_COLOR,[Bl]:r.ONE_MINUS_SRC_ALPHA,[Md]:r.ONE_MINUS_DST_COLOR,[yd]:r.ONE_MINUS_DST_ALPHA,[Ed]:r.CONSTANT_COLOR,[Sd]:r.ONE_MINUS_CONSTANT_COLOR,[Td]:r.CONSTANT_ALPHA,[wd]:r.ONE_MINUS_CONSTANT_ALPHA};function re(H,pe,ee,me,Ee,se,Ue,Ie,St,ht){if(H===$n){m===!0&&(ye(r.BLEND),m=!1);return}if(m===!1&&(ne(r.BLEND),m=!0),H!==ld){if(H!==f||ht!==R){if((M!==hs||E!==hs)&&(r.blendEquation(r.FUNC_ADD),M=hs,E=hs),ht)switch(H){case nr:r.blendFuncSeparate(r.ONE,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case Et:r.blendFunc(r.ONE,r.ONE);break;case zl:r.blendFuncSeparate(r.ZERO,r.ONE_MINUS_SRC_COLOR,r.ZERO,r.ONE);break;case Fl:r.blendFuncSeparate(r.DST_COLOR,r.ONE_MINUS_SRC_ALPHA,r.ZERO,r.ONE);break;default:He("WebGLState: Invalid blending: ",H);break}else switch(H){case nr:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case Et:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE,r.ONE,r.ONE);break;case zl:He("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Fl:He("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:He("WebGLState: Invalid blending: ",H);break}T=null,y=null,w=null,S=null,_.set(0,0,0),v=0,f=H,R=ht}return}Ee=Ee||pe,se=se||ee,Ue=Ue||me,(pe!==M||Ee!==E)&&(r.blendEquationSeparate(ft[pe],ft[Ee]),M=pe,E=Ee),(ee!==T||me!==y||se!==w||Ue!==S)&&(r.blendFuncSeparate(ie[ee],ie[me],ie[se],ie[Ue]),T=ee,y=me,w=se,S=Ue),(Ie.equals(_)===!1||St!==v)&&(r.blendColor(Ie.r,Ie.g,Ie.b,St),_.copy(Ie),v=St),f=H,R=!1}function oe(H,pe){H.side===Ct?ye(r.CULL_FACE):ne(r.CULL_FACE);let ee=H.side===sn;pe&&(ee=!ee),ce(ee),H.blending===nr&&H.transparent===!1?re($n):re(H.blending,H.blendEquation,H.blendSrc,H.blendDst,H.blendEquationAlpha,H.blendSrcAlpha,H.blendDstAlpha,H.blendColor,H.blendAlpha,H.premultipliedAlpha),a.setFunc(H.depthFunc),a.setTest(H.depthTest),a.setMask(H.depthWrite),s.setMask(H.colorWrite);let me=H.stencilWrite;c.setTest(me),me&&(c.setMask(H.stencilWriteMask),c.setFunc(H.stencilFunc,H.stencilRef,H.stencilFuncMask),c.setOp(H.stencilFail,H.stencilZFail,H.stencilZPass)),ze(H.polygonOffset,H.polygonOffsetFactor,H.polygonOffsetUnits),H.alphaToCoverage===!0?ne(r.SAMPLE_ALPHA_TO_COVERAGE):ye(r.SAMPLE_ALPHA_TO_COVERAGE)}function ce(H){C!==H&&(H?r.frontFace(r.CW):r.frontFace(r.CCW),C=H)}function ue(H){H!==od?(ne(r.CULL_FACE),H!==I&&(H===Ul?r.cullFace(r.BACK):H===cd?r.cullFace(r.FRONT):r.cullFace(r.FRONT_AND_BACK))):ye(r.CULL_FACE),I=H}function Oe(H){H!==F&&(O&&r.lineWidth(H),F=H)}function ze(H,pe,ee){H?(ne(r.POLYGON_OFFSET_FILL),(N!==pe||U!==ee)&&(N=pe,U=ee,a.getReversed()&&(pe=-pe),r.polygonOffset(pe,ee))):ye(r.POLYGON_OFFSET_FILL)}function We(H){H?ne(r.SCISSOR_TEST):ye(r.SCISSOR_TEST)}function qe(H){H===void 0&&(H=r.TEXTURE0+D-1),Y!==H&&(r.activeTexture(H),Y=H)}function z(H,pe,ee){ee===void 0&&(Y===null?ee=r.TEXTURE0+D-1:ee=Y);let me=K[ee];me===void 0&&(me={type:void 0,texture:void 0},K[ee]=me),(me.type!==H||me.texture!==pe)&&(Y!==ee&&(r.activeTexture(ee),Y=ee),r.bindTexture(H,pe||Q[H]),me.type=H,me.texture=pe)}function lt(){let H=K[Y];H!==void 0&&H.type!==void 0&&(r.bindTexture(H.type,null),H.type=void 0,H.texture=void 0)}function nt(){try{r.compressedTexImage2D(...arguments)}catch(H){He("WebGLState:",H)}}function P(){try{r.compressedTexImage3D(...arguments)}catch(H){He("WebGLState:",H)}}function b(){try{r.texSubImage2D(...arguments)}catch(H){He("WebGLState:",H)}}function G(){try{r.texSubImage3D(...arguments)}catch(H){He("WebGLState:",H)}}function q(){try{r.compressedTexSubImage2D(...arguments)}catch(H){He("WebGLState:",H)}}function $(){try{r.compressedTexSubImage3D(...arguments)}catch(H){He("WebGLState:",H)}}function le(){try{r.texStorage2D(...arguments)}catch(H){He("WebGLState:",H)}}function he(){try{r.texStorage3D(...arguments)}catch(H){He("WebGLState:",H)}}function j(){try{r.texImage2D(...arguments)}catch(H){He("WebGLState:",H)}}function te(){try{r.texImage3D(...arguments)}catch(H){He("WebGLState:",H)}}function de(H){return u[H]!==void 0?u[H]:r.getParameter(H)}function Ne(H,pe){u[H]!==pe&&(r.pixelStorei(H,pe),u[H]=pe)}function ge(H){ct.equals(H)===!1&&(r.scissor(H.x,H.y,H.z,H.w),ct.copy(H))}function fe(H){tt.equals(H)===!1&&(r.viewport(H.x,H.y,H.z,H.w),tt.copy(H))}function De(H,pe){let ee=h.get(pe);ee===void 0&&(ee=new WeakMap,h.set(pe,ee));let me=ee.get(H);me===void 0&&(me=r.getUniformBlockIndex(pe,H.name),ee.set(H,me))}function Be(H,pe){let me=h.get(pe).get(H);o.get(pe)!==me&&(r.uniformBlockBinding(pe,me,H.__bindingPointIndex),o.set(pe,me))}function Ze(){r.disable(r.BLEND),r.disable(r.CULL_FACE),r.disable(r.DEPTH_TEST),r.disable(r.POLYGON_OFFSET_FILL),r.disable(r.SCISSOR_TEST),r.disable(r.STENCIL_TEST),r.disable(r.SAMPLE_ALPHA_TO_COVERAGE),r.blendEquation(r.FUNC_ADD),r.blendFunc(r.ONE,r.ZERO),r.blendFuncSeparate(r.ONE,r.ZERO,r.ONE,r.ZERO),r.blendColor(0,0,0,0),r.colorMask(!0,!0,!0,!0),r.clearColor(0,0,0,0),r.depthMask(!0),r.depthFunc(r.LESS),a.setReversed(!1),r.clearDepth(1),r.stencilMask(4294967295),r.stencilFunc(r.ALWAYS,0,4294967295),r.stencilOp(r.KEEP,r.KEEP,r.KEEP),r.clearStencil(0),r.cullFace(r.BACK),r.frontFace(r.CCW),r.polygonOffset(0,0),r.activeTexture(r.TEXTURE0),r.bindFramebuffer(r.FRAMEBUFFER,null),r.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),r.bindFramebuffer(r.READ_FRAMEBUFFER,null),r.useProgram(null),r.lineWidth(1),r.scissor(0,0,r.canvas.width,r.canvas.height),r.viewport(0,0,r.canvas.width,r.canvas.height),r.pixelStorei(r.PACK_ALIGNMENT,4),r.pixelStorei(r.UNPACK_ALIGNMENT,4),r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,!1),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,r.BROWSER_DEFAULT_WEBGL),r.pixelStorei(r.PACK_ROW_LENGTH,0),r.pixelStorei(r.PACK_SKIP_PIXELS,0),r.pixelStorei(r.PACK_SKIP_ROWS,0),r.pixelStorei(r.UNPACK_ROW_LENGTH,0),r.pixelStorei(r.UNPACK_IMAGE_HEIGHT,0),r.pixelStorei(r.UNPACK_SKIP_PIXELS,0),r.pixelStorei(r.UNPACK_SKIP_ROWS,0),r.pixelStorei(r.UNPACK_SKIP_IMAGES,0),l={},u={},Y=null,K={},d={},p=new WeakMap,g=[],x=null,m=!1,f=null,M=null,T=null,y=null,E=null,w=null,S=null,_=new Ae(0,0,0),v=0,R=!1,C=null,I=null,F=null,N=null,U=null,ct.set(0,0,r.canvas.width,r.canvas.height),tt.set(0,0,r.canvas.width,r.canvas.height),s.reset(),a.reset(),c.reset()}return{buffers:{color:s,depth:a,stencil:c},enable:ne,disable:ye,bindFramebuffer:Ge,drawBuffers:Se,useProgram:Ve,setBlending:re,setMaterial:oe,setFlipSided:ce,setCullFace:ue,setLineWidth:Oe,setPolygonOffset:ze,setScissorTest:We,activeTexture:qe,bindTexture:z,unbindTexture:lt,compressedTexImage2D:nt,compressedTexImage3D:P,texImage2D:j,texImage3D:te,pixelStorei:Ne,getParameter:de,updateUBOMapping:De,uniformBlockBinding:Be,texStorage2D:le,texStorage3D:he,texSubImage2D:b,texSubImage3D:G,compressedTexSubImage2D:q,compressedTexSubImage3D:$,scissor:ge,viewport:fe,reset:Ze}}function ly(r,e,t,n,i,s,a){let c=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,o=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new ae,l=new WeakMap,u=new Set,d,p=new WeakMap,g=!1;try{g=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function x(P,b){return g?new OffscreenCanvas(P,b):Hs("canvas")}function m(P,b,G){let q=1,$=nt(P);if(($.width>G||$.height>G)&&(q=G/Math.max($.width,$.height)),q<1)if(typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&P instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&P instanceof ImageBitmap||typeof VideoFrame<"u"&&P instanceof VideoFrame){let le=Math.floor(q*$.width),he=Math.floor(q*$.height);d===void 0&&(d=x(le,he));let j=b?x(le,he):d;return j.width=le,j.height=he,j.getContext("2d").drawImage(P,0,0,le,he),Le("WebGLRenderer: Texture has been resized from ("+$.width+"x"+$.height+") to ("+le+"x"+he+")."),j}else return"data"in P&&Le("WebGLRenderer: Image in DataTexture is too big ("+$.width+"x"+$.height+")."),P;return P}function f(P){return P.generateMipmaps}function M(P){r.generateMipmap(P)}function T(P){return P.isWebGLCubeRenderTarget?r.TEXTURE_CUBE_MAP:P.isWebGL3DRenderTarget?r.TEXTURE_3D:P.isWebGLArrayRenderTarget||P.isCompressedArrayTexture?r.TEXTURE_2D_ARRAY:r.TEXTURE_2D}function y(P,b,G,q,$,le=!1){if(P!==null){if(r[P]!==void 0)return r[P];Le("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+P+"'")}let he;q&&(he=e.get("EXT_texture_norm16"),he||Le("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let j=b;if(b===r.RED&&(G===r.FLOAT&&(j=r.R32F),G===r.HALF_FLOAT&&(j=r.R16F),G===r.UNSIGNED_BYTE&&(j=r.R8),G===r.UNSIGNED_SHORT&&he&&(j=he.R16_EXT),G===r.SHORT&&he&&(j=he.R16_SNORM_EXT)),b===r.RED_INTEGER&&(G===r.UNSIGNED_BYTE&&(j=r.R8UI),G===r.UNSIGNED_SHORT&&(j=r.R16UI),G===r.UNSIGNED_INT&&(j=r.R32UI),G===r.BYTE&&(j=r.R8I),G===r.SHORT&&(j=r.R16I),G===r.INT&&(j=r.R32I)),b===r.RG&&(G===r.FLOAT&&(j=r.RG32F),G===r.HALF_FLOAT&&(j=r.RG16F),G===r.UNSIGNED_BYTE&&(j=r.RG8),G===r.UNSIGNED_SHORT&&he&&(j=he.RG16_EXT),G===r.SHORT&&he&&(j=he.RG16_SNORM_EXT)),b===r.RG_INTEGER&&(G===r.UNSIGNED_BYTE&&(j=r.RG8UI),G===r.UNSIGNED_SHORT&&(j=r.RG16UI),G===r.UNSIGNED_INT&&(j=r.RG32UI),G===r.BYTE&&(j=r.RG8I),G===r.SHORT&&(j=r.RG16I),G===r.INT&&(j=r.RG32I)),b===r.RGB_INTEGER&&(G===r.UNSIGNED_BYTE&&(j=r.RGB8UI),G===r.UNSIGNED_SHORT&&(j=r.RGB16UI),G===r.UNSIGNED_INT&&(j=r.RGB32UI),G===r.BYTE&&(j=r.RGB8I),G===r.SHORT&&(j=r.RGB16I),G===r.INT&&(j=r.RGB32I)),b===r.RGBA_INTEGER&&(G===r.UNSIGNED_BYTE&&(j=r.RGBA8UI),G===r.UNSIGNED_SHORT&&(j=r.RGBA16UI),G===r.UNSIGNED_INT&&(j=r.RGBA32UI),G===r.BYTE&&(j=r.RGBA8I),G===r.SHORT&&(j=r.RGBA16I),G===r.INT&&(j=r.RGBA32I)),b===r.RGB&&(G===r.UNSIGNED_SHORT&&he&&(j=he.RGB16_EXT),G===r.SHORT&&he&&(j=he.RGB16_SNORM_EXT),G===r.UNSIGNED_INT_5_9_9_9_REV&&(j=r.RGB9_E5),G===r.UNSIGNED_INT_10F_11F_11F_REV&&(j=r.R11F_G11F_B10F)),b===r.RGBA){let te=le?Lr:je.getTransfer($);G===r.FLOAT&&(j=r.RGBA32F),G===r.HALF_FLOAT&&(j=r.RGBA16F),G===r.UNSIGNED_BYTE&&(j=te===dt?r.SRGB8_ALPHA8:r.RGBA8),G===r.UNSIGNED_SHORT&&he&&(j=he.RGBA16_EXT),G===r.SHORT&&he&&(j=he.RGBA16_SNORM_EXT),G===r.UNSIGNED_SHORT_4_4_4_4&&(j=r.RGBA4),G===r.UNSIGNED_SHORT_5_5_5_1&&(j=r.RGB5_A1)}return(j===r.R16F||j===r.R32F||j===r.RG16F||j===r.RG32F||j===r.RGBA16F||j===r.RGBA32F)&&e.get("EXT_color_buffer_float"),j}function E(P,b){let G;return P?b===null||b===Bn||b===ar?G=r.DEPTH24_STENCIL8:b===gn?G=r.DEPTH32F_STENCIL8:b===rr&&(G=r.DEPTH24_STENCIL8,Le("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):b===null||b===Bn||b===ar?G=r.DEPTH_COMPONENT24:b===gn?G=r.DEPTH_COMPONENT32F:b===rr&&(G=r.DEPTH_COMPONENT16),G}function w(P,b){return f(P)===!0||P.isFramebufferTexture&&P.minFilter!==Nt&&P.minFilter!==Dt?Math.log2(Math.max(b.width,b.height))+1:P.mipmaps!==void 0&&P.mipmaps.length>0?P.mipmaps.length:P.isCompressedTexture&&Array.isArray(P.image)?b.mipmaps.length:1}function S(P){let b=P.target;b.removeEventListener("dispose",S),v(b),b.isVideoTexture&&l.delete(b),b.isHTMLTexture&&u.delete(b)}function _(P){let b=P.target;b.removeEventListener("dispose",_),C(b)}function v(P){let b=n.get(P);if(b.__webglInit===void 0)return;let G=P.source,q=p.get(G);if(q){let $=q[b.__cacheKey];$.usedTimes--,$.usedTimes===0&&R(P),Object.keys(q).length===0&&p.delete(G)}n.remove(P)}function R(P){let b=n.get(P);r.deleteTexture(b.__webglTexture);let G=P.source,q=p.get(G);delete q[b.__cacheKey],a.memory.textures--}function C(P){let b=n.get(P);if(P.depthTexture&&(P.depthTexture.dispose(),n.remove(P.depthTexture)),P.isWebGLCubeRenderTarget)for(let q=0;q<6;q++){if(Array.isArray(b.__webglFramebuffer[q]))for(let $=0;$<b.__webglFramebuffer[q].length;$++)r.deleteFramebuffer(b.__webglFramebuffer[q][$]);else r.deleteFramebuffer(b.__webglFramebuffer[q]);b.__webglDepthbuffer&&r.deleteRenderbuffer(b.__webglDepthbuffer[q])}else{if(Array.isArray(b.__webglFramebuffer))for(let q=0;q<b.__webglFramebuffer.length;q++)r.deleteFramebuffer(b.__webglFramebuffer[q]);else r.deleteFramebuffer(b.__webglFramebuffer);if(b.__webglDepthbuffer&&r.deleteRenderbuffer(b.__webglDepthbuffer),b.__webglMultisampledFramebuffer&&r.deleteFramebuffer(b.__webglMultisampledFramebuffer),b.__webglColorRenderbuffer)for(let q=0;q<b.__webglColorRenderbuffer.length;q++)b.__webglColorRenderbuffer[q]&&r.deleteRenderbuffer(b.__webglColorRenderbuffer[q]);b.__webglDepthRenderbuffer&&r.deleteRenderbuffer(b.__webglDepthRenderbuffer)}let G=P.textures;for(let q=0,$=G.length;q<$;q++){let le=n.get(G[q]);le.__webglTexture&&(r.deleteTexture(le.__webglTexture),a.memory.textures--),n.remove(G[q])}n.remove(P)}let I=0;function F(){I=0}function N(){return I}function U(P){I=P}function D(){let P=I;return P>=i.maxTextures&&Le("WebGLTextures: Trying to use "+(P+1)+" texture units while this GPU supports only "+i.maxTextures),I+=1,P}function O(P){let b=[];return b.push(P.wrapS),b.push(P.wrapT),b.push(P.wrapR||0),b.push(P.magFilter),b.push(P.minFilter),b.push(P.anisotropy),b.push(P.internalFormat),b.push(P.format),b.push(P.type),b.push(P.generateMipmaps),b.push(P.premultiplyAlpha),b.push(P.flipY),b.push(P.unpackAlignment),b.push(P.colorSpace),b.join()}function X(P,b){let G=n.get(P);if(P.isVideoTexture&&z(P),P.isRenderTargetTexture===!1&&P.isExternalTexture!==!0&&P.version>0&&G.__version!==P.version){let q=P.image;if(q===null)Le("WebGLRenderer: Texture marked for update but no image data found.");else if(q.complete===!1)Le("WebGLRenderer: Texture marked for update but image is incomplete");else{ye(G,P,b);return}}else P.isExternalTexture&&(G.__webglTexture=P.sourceTexture?P.sourceTexture:null);t.bindTexture(r.TEXTURE_2D,G.__webglTexture,r.TEXTURE0+b)}function k(P,b){let G=n.get(P);if(P.isRenderTargetTexture===!1&&P.version>0&&G.__version!==P.version){ye(G,P,b);return}else P.isExternalTexture&&(G.__webglTexture=P.sourceTexture?P.sourceTexture:null);t.bindTexture(r.TEXTURE_2D_ARRAY,G.__webglTexture,r.TEXTURE0+b)}function Y(P,b){let G=n.get(P);if(P.isRenderTargetTexture===!1&&P.version>0&&G.__version!==P.version){ye(G,P,b);return}t.bindTexture(r.TEXTURE_3D,G.__webglTexture,r.TEXTURE0+b)}function K(P,b){let G=n.get(P);if(P.isCubeDepthTexture!==!0&&P.version>0&&G.__version!==P.version){Ge(G,P,b);return}t.bindTexture(r.TEXTURE_CUBE_MAP,G.__webglTexture,r.TEXTURE0+b)}let _e={[Sn]:r.REPEAT,[bn]:r.CLAMP_TO_EDGE,[Os]:r.MIRRORED_REPEAT},Me={[Nt]:r.NEAREST,[Ho]:r.NEAREST_MIPMAP_NEAREST,[ds]:r.NEAREST_MIPMAP_LINEAR,[Dt]:r.LINEAR,[sr]:r.LINEAR_MIPMAP_NEAREST,[On]:r.LINEAR_MIPMAP_LINEAR},ct={[Ud]:r.NEVER,[Hd]:r.ALWAYS,[zd]:r.LESS,[Rc]:r.LEQUAL,[Fd]:r.EQUAL,[Cc]:r.GEQUAL,[Od]:r.GREATER,[Bd]:r.NOTEQUAL};function tt(P,b){if(b.type===gn&&e.has("OES_texture_float_linear")===!1&&(b.magFilter===Dt||b.magFilter===sr||b.magFilter===ds||b.magFilter===On||b.minFilter===Dt||b.minFilter===sr||b.minFilter===ds||b.minFilter===On)&&Le("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),r.texParameteri(P,r.TEXTURE_WRAP_S,_e[b.wrapS]),r.texParameteri(P,r.TEXTURE_WRAP_T,_e[b.wrapT]),(P===r.TEXTURE_3D||P===r.TEXTURE_2D_ARRAY)&&r.texParameteri(P,r.TEXTURE_WRAP_R,_e[b.wrapR]),r.texParameteri(P,r.TEXTURE_MAG_FILTER,Me[b.magFilter]),r.texParameteri(P,r.TEXTURE_MIN_FILTER,Me[b.minFilter]),b.compareFunction&&(r.texParameteri(P,r.TEXTURE_COMPARE_MODE,r.COMPARE_REF_TO_TEXTURE),r.texParameteri(P,r.TEXTURE_COMPARE_FUNC,ct[b.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(b.magFilter===Nt||b.minFilter!==ds&&b.minFilter!==On||b.type===gn&&e.has("OES_texture_float_linear")===!1)return;if(b.anisotropy>1||n.get(b).__currentAnisotropy){let G=e.get("EXT_texture_filter_anisotropic");r.texParameterf(P,G.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(b.anisotropy,i.getMaxAnisotropy())),n.get(b).__currentAnisotropy=b.anisotropy}}}function rt(P,b){let G=!1;P.__webglInit===void 0&&(P.__webglInit=!0,b.addEventListener("dispose",S));let q=b.source,$=p.get(q);$===void 0&&($={},p.set(q,$));let le=O(b);if(le!==P.__cacheKey){$[le]===void 0&&($[le]={texture:r.createTexture(),usedTimes:0},a.memory.textures++,G=!0),$[le].usedTimes++;let he=$[P.__cacheKey];he!==void 0&&($[P.__cacheKey].usedTimes--,he.usedTimes===0&&R(b)),P.__cacheKey=le,P.__webglTexture=$[le].texture}return G}function Q(P,b,G){return Math.floor(Math.floor(P/G)/b)}function ne(P,b,G,q){let le=P.updateRanges;if(le.length===0)t.texSubImage2D(r.TEXTURE_2D,0,0,0,b.width,b.height,G,q,b.data);else{le.sort((Ne,ge)=>Ne.start-ge.start);let he=0;for(let Ne=1;Ne<le.length;Ne++){let ge=le[he],fe=le[Ne],De=ge.start+ge.count,Be=Q(fe.start,b.width,4),Ze=Q(ge.start,b.width,4);fe.start<=De+1&&Be===Ze&&Q(fe.start+fe.count-1,b.width,4)===Be?ge.count=Math.max(ge.count,fe.start+fe.count-ge.start):(++he,le[he]=fe)}le.length=he+1;let j=t.getParameter(r.UNPACK_ROW_LENGTH),te=t.getParameter(r.UNPACK_SKIP_PIXELS),de=t.getParameter(r.UNPACK_SKIP_ROWS);t.pixelStorei(r.UNPACK_ROW_LENGTH,b.width);for(let Ne=0,ge=le.length;Ne<ge;Ne++){let fe=le[Ne],De=Math.floor(fe.start/4),Be=Math.ceil(fe.count/4),Ze=De%b.width,H=Math.floor(De/b.width),pe=Be,ee=1;t.pixelStorei(r.UNPACK_SKIP_PIXELS,Ze),t.pixelStorei(r.UNPACK_SKIP_ROWS,H),t.texSubImage2D(r.TEXTURE_2D,0,Ze,H,pe,ee,G,q,b.data)}P.clearUpdateRanges(),t.pixelStorei(r.UNPACK_ROW_LENGTH,j),t.pixelStorei(r.UNPACK_SKIP_PIXELS,te),t.pixelStorei(r.UNPACK_SKIP_ROWS,de)}}function ye(P,b,G){let q=r.TEXTURE_2D;(b.isDataArrayTexture||b.isCompressedArrayTexture)&&(q=r.TEXTURE_2D_ARRAY),b.isData3DTexture&&(q=r.TEXTURE_3D);let $=rt(P,b),le=b.source;t.bindTexture(q,P.__webglTexture,r.TEXTURE0+G);let he=n.get(le);if(le.version!==he.__version||$===!0){if(t.activeTexture(r.TEXTURE0+G),(typeof ImageBitmap<"u"&&b.image instanceof ImageBitmap)===!1){let ee=je.getPrimaries(je.workingColorSpace),me=b.colorSpace===yi?null:je.getPrimaries(b.colorSpace),Ee=b.colorSpace===yi||ee===me?r.NONE:r.BROWSER_DEFAULT_WEBGL;t.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,b.flipY),t.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),t.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ee)}t.pixelStorei(r.UNPACK_ALIGNMENT,b.unpackAlignment);let te=m(b.image,!1,i.maxTextureSize);te=lt(b,te);let de=s.convert(b.format,b.colorSpace),Ne=s.convert(b.type),ge=y(b.internalFormat,de,Ne,b.normalized,b.colorSpace,b.isVideoTexture);tt(q,b);let fe,De=b.mipmaps,Be=b.isVideoTexture!==!0,Ze=he.__version===void 0||$===!0,H=le.dataReady,pe=w(b,te);if(b.isDepthTexture)ge=E(b.format===Vi,b.type),Ze&&(Be?t.texStorage2D(r.TEXTURE_2D,1,ge,te.width,te.height):t.texImage2D(r.TEXTURE_2D,0,ge,te.width,te.height,0,de,Ne,null));else if(b.isDataTexture)if(De.length>0){Be&&Ze&&t.texStorage2D(r.TEXTURE_2D,pe,ge,De[0].width,De[0].height);for(let ee=0,me=De.length;ee<me;ee++)fe=De[ee],Be?H&&t.texSubImage2D(r.TEXTURE_2D,ee,0,0,fe.width,fe.height,de,Ne,fe.data):t.texImage2D(r.TEXTURE_2D,ee,ge,fe.width,fe.height,0,de,Ne,fe.data);b.generateMipmaps=!1}else Be?(Ze&&t.texStorage2D(r.TEXTURE_2D,pe,ge,te.width,te.height),H&&ne(b,te,de,Ne)):t.texImage2D(r.TEXTURE_2D,0,ge,te.width,te.height,0,de,Ne,te.data);else if(b.isCompressedTexture)if(b.isCompressedArrayTexture){Be&&Ze&&t.texStorage3D(r.TEXTURE_2D_ARRAY,pe,ge,De[0].width,De[0].height,te.depth);for(let ee=0,me=De.length;ee<me;ee++)if(fe=De[ee],b.format!==xn)if(de!==null)if(Be){if(H)if(b.layerUpdates.size>0){let Ee=lh(fe.width,fe.height,b.format,b.type);for(let se of b.layerUpdates){let Ue=fe.data.subarray(se*Ee/fe.data.BYTES_PER_ELEMENT,(se+1)*Ee/fe.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,ee,0,0,se,fe.width,fe.height,1,de,Ue)}}else t.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,ee,0,0,0,fe.width,fe.height,te.depth,de,fe.data)}else t.compressedTexImage3D(r.TEXTURE_2D_ARRAY,ee,ge,fe.width,fe.height,te.depth,0,fe.data,0,0);else Le("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Be?H&&t.texSubImage3D(r.TEXTURE_2D_ARRAY,ee,0,0,0,fe.width,fe.height,te.depth,de,Ne,fe.data):t.texImage3D(r.TEXTURE_2D_ARRAY,ee,ge,fe.width,fe.height,te.depth,0,de,Ne,fe.data);b.layerUpdates.size>0&&b.clearLayerUpdates()}else{Be&&Ze&&t.texStorage2D(r.TEXTURE_2D,pe,ge,De[0].width,De[0].height);for(let ee=0,me=De.length;ee<me;ee++)fe=De[ee],b.format!==xn?de!==null?Be?H&&t.compressedTexSubImage2D(r.TEXTURE_2D,ee,0,0,fe.width,fe.height,de,fe.data):t.compressedTexImage2D(r.TEXTURE_2D,ee,ge,fe.width,fe.height,0,fe.data):Le("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Be?H&&t.texSubImage2D(r.TEXTURE_2D,ee,0,0,fe.width,fe.height,de,Ne,fe.data):t.texImage2D(r.TEXTURE_2D,ee,ge,fe.width,fe.height,0,de,Ne,fe.data)}else if(b.isDataArrayTexture)if(Be){if(Ze&&t.texStorage3D(r.TEXTURE_2D_ARRAY,pe,ge,te.width,te.height,te.depth),H)if(b.layerUpdates.size>0){let ee=lh(te.width,te.height,b.format,b.type);for(let me of b.layerUpdates){let Ee=te.data.subarray(me*ee/te.data.BYTES_PER_ELEMENT,(me+1)*ee/te.data.BYTES_PER_ELEMENT);t.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,me,te.width,te.height,1,de,Ne,Ee)}b.clearLayerUpdates()}else t.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,0,te.width,te.height,te.depth,de,Ne,te.data)}else t.texImage3D(r.TEXTURE_2D_ARRAY,0,ge,te.width,te.height,te.depth,0,de,Ne,te.data);else if(b.isData3DTexture)Be?(Ze&&t.texStorage3D(r.TEXTURE_3D,pe,ge,te.width,te.height,te.depth),H&&t.texSubImage3D(r.TEXTURE_3D,0,0,0,0,te.width,te.height,te.depth,de,Ne,te.data)):t.texImage3D(r.TEXTURE_3D,0,ge,te.width,te.height,te.depth,0,de,Ne,te.data);else if(b.isFramebufferTexture){if(Ze)if(Be)t.texStorage2D(r.TEXTURE_2D,pe,ge,te.width,te.height);else{let ee=te.width,me=te.height;for(let Ee=0;Ee<pe;Ee++)t.texImage2D(r.TEXTURE_2D,Ee,ge,ee,me,0,de,Ne,null),ee>>=1,me>>=1}}else if(b.isHTMLTexture){if("texElementImage2D"in r){let ee=r.canvas;if(ee.hasAttribute("layoutsubtree")||ee.setAttribute("layoutsubtree","true"),te.parentNode!==ee){ee.appendChild(te),u.add(b),ee.onpaint=me=>{let Ee=me.changedElements;for(let se of u)Ee.includes(se.image)&&(se.needsUpdate=!0)},ee.requestPaint();return}if(r.texElementImage2D.length===3)r.texElementImage2D(r.TEXTURE_2D,r.RGBA8,te);else{let Ee=r.RGBA,se=r.RGBA,Ue=r.UNSIGNED_BYTE;r.texElementImage2D(r.TEXTURE_2D,0,Ee,se,Ue,te)}r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MIN_FILTER,r.LINEAR),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_S,r.CLAMP_TO_EDGE),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_T,r.CLAMP_TO_EDGE)}}else if(De.length>0){if(Be&&Ze){let ee=nt(De[0]);t.texStorage2D(r.TEXTURE_2D,pe,ge,ee.width,ee.height)}for(let ee=0,me=De.length;ee<me;ee++)fe=De[ee],Be?H&&t.texSubImage2D(r.TEXTURE_2D,ee,0,0,de,Ne,fe):t.texImage2D(r.TEXTURE_2D,ee,ge,de,Ne,fe);b.generateMipmaps=!1}else if(Be){if(Ze){let ee=nt(te);t.texStorage2D(r.TEXTURE_2D,pe,ge,ee.width,ee.height)}H&&t.texSubImage2D(r.TEXTURE_2D,0,0,0,de,Ne,te)}else t.texImage2D(r.TEXTURE_2D,0,ge,de,Ne,te);f(b)&&M(q),he.__version=le.version,b.onUpdate&&b.onUpdate(b)}P.__version=b.version}function Ge(P,b,G){if(b.image.length!==6)return;let q=rt(P,b),$=b.source;t.bindTexture(r.TEXTURE_CUBE_MAP,P.__webglTexture,r.TEXTURE0+G);let le=n.get($);if($.version!==le.__version||q===!0){t.activeTexture(r.TEXTURE0+G);let he=je.getPrimaries(je.workingColorSpace),j=b.colorSpace===yi?null:je.getPrimaries(b.colorSpace),te=b.colorSpace===yi||he===j?r.NONE:r.BROWSER_DEFAULT_WEBGL;t.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,b.flipY),t.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),t.pixelStorei(r.UNPACK_ALIGNMENT,b.unpackAlignment),t.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,te);let de=b.isCompressedTexture||b.image[0].isCompressedTexture,Ne=b.image[0]&&b.image[0].isDataTexture,ge=[];for(let se=0;se<6;se++)!de&&!Ne?ge[se]=m(b.image[se],!0,i.maxCubemapSize):ge[se]=Ne?b.image[se].image:b.image[se],ge[se]=lt(b,ge[se]);let fe=ge[0],De=s.convert(b.format,b.colorSpace),Be=s.convert(b.type),Ze=y(b.internalFormat,De,Be,b.normalized,b.colorSpace),H=b.isVideoTexture!==!0,pe=le.__version===void 0||q===!0,ee=$.dataReady,me=w(b,fe);tt(r.TEXTURE_CUBE_MAP,b);let Ee;if(de){H&&pe&&t.texStorage2D(r.TEXTURE_CUBE_MAP,me,Ze,fe.width,fe.height);for(let se=0;se<6;se++){Ee=ge[se].mipmaps;for(let Ue=0;Ue<Ee.length;Ue++){let Ie=Ee[Ue];b.format!==xn?De!==null?H?ee&&t.compressedTexSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+se,Ue,0,0,Ie.width,Ie.height,De,Ie.data):t.compressedTexImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+se,Ue,Ze,Ie.width,Ie.height,0,Ie.data):Le("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):H?ee&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+se,Ue,0,0,Ie.width,Ie.height,De,Be,Ie.data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+se,Ue,Ze,Ie.width,Ie.height,0,De,Be,Ie.data)}}}else{if(Ee=b.mipmaps,H&&pe){Ee.length>0&&me++;let se=nt(ge[0]);t.texStorage2D(r.TEXTURE_CUBE_MAP,me,Ze,se.width,se.height)}for(let se=0;se<6;se++)if(Ne){H?ee&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+se,0,0,0,ge[se].width,ge[se].height,De,Be,ge[se].data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+se,0,Ze,ge[se].width,ge[se].height,0,De,Be,ge[se].data);for(let Ue=0;Ue<Ee.length;Ue++){let St=Ee[Ue].image[se].image;H?ee&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+se,Ue+1,0,0,St.width,St.height,De,Be,St.data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+se,Ue+1,Ze,St.width,St.height,0,De,Be,St.data)}}else{H?ee&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+se,0,0,0,De,Be,ge[se]):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+se,0,Ze,De,Be,ge[se]);for(let Ue=0;Ue<Ee.length;Ue++){let Ie=Ee[Ue];H?ee&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+se,Ue+1,0,0,De,Be,Ie.image[se]):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+se,Ue+1,Ze,De,Be,Ie.image[se])}}}f(b)&&M(r.TEXTURE_CUBE_MAP),le.__version=$.version,b.onUpdate&&b.onUpdate(b)}P.__version=b.version}function Se(P,b,G,q,$,le){let he=s.convert(G.format,G.colorSpace),j=s.convert(G.type),te=y(G.internalFormat,he,j,G.normalized,G.colorSpace),de=n.get(b),Ne=n.get(G);if(Ne.__renderTarget=b,!de.__hasExternalTextures){let ge=Math.max(1,b.width>>le),fe=Math.max(1,b.height>>le);$===r.TEXTURE_3D||$===r.TEXTURE_2D_ARRAY?t.texImage3D($,le,te,ge,fe,b.depth,0,he,j,null):t.texImage2D($,le,te,ge,fe,0,he,j,null)}t.bindFramebuffer(r.FRAMEBUFFER,P),qe(b)?c.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,q,$,Ne.__webglTexture,0,We(b)):($===r.TEXTURE_2D||$>=r.TEXTURE_CUBE_MAP_POSITIVE_X&&$<=r.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&r.framebufferTexture2D(r.FRAMEBUFFER,q,$,Ne.__webglTexture,le),t.bindFramebuffer(r.FRAMEBUFFER,null)}function Ve(P,b,G){if(r.bindRenderbuffer(r.RENDERBUFFER,P),b.depthBuffer){let q=b.depthTexture,$=q&&q.isDepthTexture?q.type:null,le=E(b.stencilBuffer,$),he=b.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;qe(b)?c.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,We(b),le,b.width,b.height):G?r.renderbufferStorageMultisample(r.RENDERBUFFER,We(b),le,b.width,b.height):r.renderbufferStorage(r.RENDERBUFFER,le,b.width,b.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,he,r.RENDERBUFFER,P)}else{let q=b.textures;for(let $=0;$<q.length;$++){let le=q[$],he=s.convert(le.format,le.colorSpace),j=s.convert(le.type),te=y(le.internalFormat,he,j,le.normalized,le.colorSpace);qe(b)?c.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,We(b),te,b.width,b.height):G?r.renderbufferStorageMultisample(r.RENDERBUFFER,We(b),te,b.width,b.height):r.renderbufferStorage(r.RENDERBUFFER,te,b.width,b.height)}}r.bindRenderbuffer(r.RENDERBUFFER,null)}function ft(P,b,G){let q=b.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(r.FRAMEBUFFER,P),!(b.depthTexture&&b.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let $=n.get(b.depthTexture);if($.__renderTarget=b,(!$.__webglTexture||b.depthTexture.image.width!==b.width||b.depthTexture.image.height!==b.height)&&(b.depthTexture.image.width=b.width,b.depthTexture.image.height=b.height,b.depthTexture.needsUpdate=!0),q){if($.__webglInit===void 0&&($.__webglInit=!0,b.depthTexture.addEventListener("dispose",S)),$.__webglTexture===void 0){$.__webglTexture=r.createTexture(),t.bindTexture(r.TEXTURE_CUBE_MAP,$.__webglTexture),tt(r.TEXTURE_CUBE_MAP,b.depthTexture);let de=s.convert(b.depthTexture.format),Ne=s.convert(b.depthTexture.type),ge;b.depthTexture.format===qn?ge=r.DEPTH_COMPONENT24:b.depthTexture.format===Vi&&(ge=r.DEPTH24_STENCIL8);for(let fe=0;fe<6;fe++)r.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+fe,0,ge,b.width,b.height,0,de,Ne,null)}}else X(b.depthTexture,0);let le=$.__webglTexture,he=We(b),j=q?r.TEXTURE_CUBE_MAP_POSITIVE_X+G:r.TEXTURE_2D,te=b.depthTexture.format===Vi?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;if(b.depthTexture.format===qn)qe(b)?c.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,te,j,le,0,he):r.framebufferTexture2D(r.FRAMEBUFFER,te,j,le,0);else if(b.depthTexture.format===Vi)qe(b)?c.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,te,j,le,0,he):r.framebufferTexture2D(r.FRAMEBUFFER,te,j,le,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function ie(P){let b=n.get(P),G=P.isWebGLCubeRenderTarget===!0;if(b.__boundDepthTexture!==P.depthTexture){let q=P.depthTexture;if(b.__depthDisposeCallback&&b.__depthDisposeCallback(),q){let $=()=>{delete b.__boundDepthTexture,delete b.__depthDisposeCallback,q.removeEventListener("dispose",$)};q.addEventListener("dispose",$),b.__depthDisposeCallback=$}b.__boundDepthTexture=q}if(P.depthTexture&&!b.__autoAllocateDepthBuffer)if(G)for(let q=0;q<6;q++)ft(b.__webglFramebuffer[q],P,q);else{let q=P.texture.mipmaps;q&&q.length>0?ft(b.__webglFramebuffer[0],P,0):ft(b.__webglFramebuffer,P,0)}else if(G){b.__webglDepthbuffer=[];for(let q=0;q<6;q++)if(t.bindFramebuffer(r.FRAMEBUFFER,b.__webglFramebuffer[q]),b.__webglDepthbuffer[q]===void 0)b.__webglDepthbuffer[q]=r.createRenderbuffer(),Ve(b.__webglDepthbuffer[q],P,!1);else{let $=P.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,le=b.__webglDepthbuffer[q];r.bindRenderbuffer(r.RENDERBUFFER,le),r.framebufferRenderbuffer(r.FRAMEBUFFER,$,r.RENDERBUFFER,le)}}else{let q=P.texture.mipmaps;if(q&&q.length>0?t.bindFramebuffer(r.FRAMEBUFFER,b.__webglFramebuffer[0]):t.bindFramebuffer(r.FRAMEBUFFER,b.__webglFramebuffer),b.__webglDepthbuffer===void 0)b.__webglDepthbuffer=r.createRenderbuffer(),Ve(b.__webglDepthbuffer,P,!1);else{let $=P.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,le=b.__webglDepthbuffer;r.bindRenderbuffer(r.RENDERBUFFER,le),r.framebufferRenderbuffer(r.FRAMEBUFFER,$,r.RENDERBUFFER,le)}}t.bindFramebuffer(r.FRAMEBUFFER,null)}function re(P,b,G){let q=n.get(P);b!==void 0&&Se(q.__webglFramebuffer,P,P.texture,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,0),G!==void 0&&ie(P)}function oe(P){let b=P.texture,G=n.get(P),q=n.get(b);P.addEventListener("dispose",_);let $=P.textures,le=P.isWebGLCubeRenderTarget===!0,he=$.length>1;if(he||(q.__webglTexture===void 0&&(q.__webglTexture=r.createTexture()),q.__version=b.version,a.memory.textures++),le){G.__webglFramebuffer=[];for(let j=0;j<6;j++)if(b.mipmaps&&b.mipmaps.length>0){G.__webglFramebuffer[j]=[];for(let te=0;te<b.mipmaps.length;te++)G.__webglFramebuffer[j][te]=r.createFramebuffer()}else G.__webglFramebuffer[j]=r.createFramebuffer()}else{if(b.mipmaps&&b.mipmaps.length>0){G.__webglFramebuffer=[];for(let j=0;j<b.mipmaps.length;j++)G.__webglFramebuffer[j]=r.createFramebuffer()}else G.__webglFramebuffer=r.createFramebuffer();if(he)for(let j=0,te=$.length;j<te;j++){let de=n.get($[j]);de.__webglTexture===void 0&&(de.__webglTexture=r.createTexture(),a.memory.textures++)}if(P.samples>0&&qe(P)===!1){G.__webglMultisampledFramebuffer=r.createFramebuffer(),G.__webglColorRenderbuffer=[],t.bindFramebuffer(r.FRAMEBUFFER,G.__webglMultisampledFramebuffer);for(let j=0;j<$.length;j++){let te=$[j];G.__webglColorRenderbuffer[j]=r.createRenderbuffer(),r.bindRenderbuffer(r.RENDERBUFFER,G.__webglColorRenderbuffer[j]);let de=s.convert(te.format,te.colorSpace),Ne=s.convert(te.type),ge=y(te.internalFormat,de,Ne,te.normalized,te.colorSpace,P.isXRRenderTarget===!0),fe=We(P);r.renderbufferStorageMultisample(r.RENDERBUFFER,fe,ge,P.width,P.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+j,r.RENDERBUFFER,G.__webglColorRenderbuffer[j])}r.bindRenderbuffer(r.RENDERBUFFER,null),P.depthBuffer&&(G.__webglDepthRenderbuffer=r.createRenderbuffer(),Ve(G.__webglDepthRenderbuffer,P,!0)),t.bindFramebuffer(r.FRAMEBUFFER,null)}}if(le){t.bindTexture(r.TEXTURE_CUBE_MAP,q.__webglTexture),tt(r.TEXTURE_CUBE_MAP,b);for(let j=0;j<6;j++)if(b.mipmaps&&b.mipmaps.length>0)for(let te=0;te<b.mipmaps.length;te++)Se(G.__webglFramebuffer[j][te],P,b,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+j,te);else Se(G.__webglFramebuffer[j],P,b,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+j,0);f(b)&&M(r.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(he){for(let j=0,te=$.length;j<te;j++){let de=$[j],Ne=n.get(de),ge=r.TEXTURE_2D;(P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(ge=P.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY),t.bindTexture(ge,Ne.__webglTexture),tt(ge,de),Se(G.__webglFramebuffer,P,de,r.COLOR_ATTACHMENT0+j,ge,0),f(de)&&M(ge)}t.unbindTexture()}else{let j=r.TEXTURE_2D;if((P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(j=P.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY),t.bindTexture(j,q.__webglTexture),tt(j,b),b.mipmaps&&b.mipmaps.length>0)for(let te=0;te<b.mipmaps.length;te++)Se(G.__webglFramebuffer[te],P,b,r.COLOR_ATTACHMENT0,j,te);else Se(G.__webglFramebuffer,P,b,r.COLOR_ATTACHMENT0,j,0);f(b)&&M(j),t.unbindTexture()}P.depthBuffer&&ie(P)}function ce(P){let b=P.textures;for(let G=0,q=b.length;G<q;G++){let $=b[G];if(f($)){let le=T(P),he=n.get($).__webglTexture;t.bindTexture(le,he),M(le),t.unbindTexture()}}}let ue=[],Oe=[];function ze(P){if(P.samples>0){if(qe(P)===!1){let b=P.textures,G=P.width,q=P.height,$=r.COLOR_BUFFER_BIT,le=P.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,he=n.get(P),j=b.length>1;if(j)for(let de=0;de<b.length;de++)t.bindFramebuffer(r.FRAMEBUFFER,he.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+de,r.RENDERBUFFER,null),t.bindFramebuffer(r.FRAMEBUFFER,he.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+de,r.TEXTURE_2D,null,0);t.bindFramebuffer(r.READ_FRAMEBUFFER,he.__webglMultisampledFramebuffer);let te=P.texture.mipmaps;te&&te.length>0?t.bindFramebuffer(r.DRAW_FRAMEBUFFER,he.__webglFramebuffer[0]):t.bindFramebuffer(r.DRAW_FRAMEBUFFER,he.__webglFramebuffer);for(let de=0;de<b.length;de++){if(P.resolveDepthBuffer&&(P.depthBuffer&&($|=r.DEPTH_BUFFER_BIT),P.stencilBuffer&&P.resolveStencilBuffer&&($|=r.STENCIL_BUFFER_BIT)),j){r.framebufferRenderbuffer(r.READ_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.RENDERBUFFER,he.__webglColorRenderbuffer[de]);let Ne=n.get(b[de]).__webglTexture;r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,Ne,0)}r.blitFramebuffer(0,0,G,q,0,0,G,q,$,r.NEAREST),o===!0&&(ue.length=0,Oe.length=0,ue.push(r.COLOR_ATTACHMENT0+de),P.depthBuffer&&P.storeMultisampledDepthBuffer===!1&&(ue.push(le),Oe.push(le),r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,Oe)),r.invalidateFramebuffer(r.READ_FRAMEBUFFER,ue))}if(t.bindFramebuffer(r.READ_FRAMEBUFFER,null),t.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),j)for(let de=0;de<b.length;de++){t.bindFramebuffer(r.FRAMEBUFFER,he.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+de,r.RENDERBUFFER,he.__webglColorRenderbuffer[de]);let Ne=n.get(b[de]).__webglTexture;t.bindFramebuffer(r.FRAMEBUFFER,he.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+de,r.TEXTURE_2D,Ne,0)}t.bindFramebuffer(r.DRAW_FRAMEBUFFER,he.__webglMultisampledFramebuffer)}else if(P.depthBuffer&&P.storeMultisampledDepthBuffer===!1&&o){let b=P.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,[b])}}}function We(P){return Math.min(i.maxSamples,P.samples)}function qe(P){let b=n.get(P);return P.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&b.__useRenderToTexture!==!1}function z(P){let b=a.render.frame;l.get(P)!==b&&(l.set(P,b),P.update())}function lt(P,b){let G=P.colorSpace,q=P.format,$=P.type;return P.isCompressedTexture===!0||P.isVideoTexture===!0||G!==en&&G!==yi&&(je.getTransfer(G)===dt?(q!==xn||$!==hn)&&Le("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):He("WebGLTextures: Unsupported texture color space:",G)),b}function nt(P){return typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement?(h.width=P.naturalWidth||P.width,h.height=P.naturalHeight||P.height):typeof VideoFrame<"u"&&P instanceof VideoFrame?(h.width=P.displayWidth,h.height=P.displayHeight):(h.width=P.width,h.height=P.height),h}this.allocateTextureUnit=D,this.resetTextureUnits=F,this.getTextureUnits=N,this.setTextureUnits=U,this.setTexture2D=X,this.setTexture2DArray=k,this.setTexture3D=Y,this.setTextureCube=K,this.rebindTextures=re,this.setupRenderTarget=oe,this.updateRenderTargetMipmap=ce,this.updateMultisampleRenderTarget=ze,this.setupDepthRenderbuffer=ie,this.setupFrameBufferTexture=Se,this.useMultisampledRTT=qe,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function hy(r,e){function t(n,i=yi){let s,a=je.getTransfer(i);if(n===hn)return r.UNSIGNED_BYTE;if(n===Go)return r.UNSIGNED_SHORT_4_4_4_4;if(n===Vo)return r.UNSIGNED_SHORT_5_5_5_1;if(n===Jl)return r.UNSIGNED_INT_5_9_9_9_REV;if(n===$l)return r.UNSIGNED_INT_10F_11F_11F_REV;if(n===Zl)return r.BYTE;if(n===Kl)return r.SHORT;if(n===rr)return r.UNSIGNED_SHORT;if(n===ko)return r.INT;if(n===Bn)return r.UNSIGNED_INT;if(n===gn)return r.FLOAT;if(n===Hn)return r.HALF_FLOAT;if(n===jl)return r.ALPHA;if(n===Ql)return r.RGB;if(n===xn)return r.RGBA;if(n===qn)return r.DEPTH_COMPONENT;if(n===Vi)return r.DEPTH_STENCIL;if(n===Wo)return r.RED;if(n===Xo)return r.RED_INTEGER;if(n===Wi)return r.RG;if(n===qo)return r.RG_INTEGER;if(n===Yo)return r.RGBA_INTEGER;if(n===ca||n===la||n===ha||n===ua)if(a===dt)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(n===ca)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===la)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===ha)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===ua)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(n===ca)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===la)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===ha)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===ua)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Zo||n===Ko||n===Jo||n===$o)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(n===Zo)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Ko)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Jo)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===$o)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===jo||n===Qo||n===ec||n===tc||n===nc||n===da||n===ic)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(n===jo||n===Qo)return a===dt?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(n===ec)return a===dt?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC;if(n===tc)return s.COMPRESSED_R11_EAC;if(n===nc)return s.COMPRESSED_SIGNED_R11_EAC;if(n===da)return s.COMPRESSED_RG11_EAC;if(n===ic)return s.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===sc||n===rc||n===ac||n===oc||n===cc||n===lc||n===hc||n===uc||n===dc||n===fc||n===pc||n===mc||n===gc||n===xc)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(n===sc)return a===dt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===rc)return a===dt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===ac)return a===dt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===oc)return a===dt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===cc)return a===dt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===lc)return a===dt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===hc)return a===dt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===uc)return a===dt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===dc)return a===dt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===fc)return a===dt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===pc)return a===dt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===mc)return a===dt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===gc)return a===dt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===xc)return a===dt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===_c||n===yc||n===vc)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(n===_c)return a===dt?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===yc)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===vc)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Mc||n===bc||n===fa||n===Ec)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(n===Mc)return s.COMPRESSED_RED_RGTC1_EXT;if(n===bc)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===fa)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Ec)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===ar?r.UNSIGNED_INT_24_8:r[n]!==void 0?r[n]:null}return{convert:t}}var uy=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,dy=`
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

}`,Eh=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new Vr(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new mn({vertexShader:uy,fragmentShader:dy,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new J(new yt(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Sh=class extends Un{constructor(e,t){super();let n=this,i=null,s=1,a=null,c="local-floor",o=1,h=null,l=null,u=null,d=null,p=null,g=null,x=typeof XRWebGLBinding<"u",m=new Eh,f={},M=t.getContextAttributes(),T=null,y=null,E=[],w=[],S=new ae,_=null,v=null,R=new Ot;R.viewport=new gt;let C=new Ot;C.viewport=new gt;let I=[R,C],F=new Uo,N=null,U=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Q){let ne=E[Q];return ne===void 0&&(ne=new Ws,E[Q]=ne),ne.getTargetRaySpace()},this.getControllerGrip=function(Q){let ne=E[Q];return ne===void 0&&(ne=new Ws,E[Q]=ne),ne.getGripSpace()},this.getHand=function(Q){let ne=E[Q];return ne===void 0&&(ne=new Ws,E[Q]=ne),ne.getHandSpace()};function D(Q){let ne=w.indexOf(Q.inputSource);if(ne===-1)return;let ye=E[ne];ye!==void 0&&(ye.update(Q.inputSource,Q.frame,h||a),ye.dispatchEvent({type:Q.type,data:Q.inputSource}))}function O(){i.removeEventListener("select",D),i.removeEventListener("selectstart",D),i.removeEventListener("selectend",D),i.removeEventListener("squeeze",D),i.removeEventListener("squeezestart",D),i.removeEventListener("squeezeend",D),i.removeEventListener("end",O),i.removeEventListener("inputsourceschange",X);for(let Q=0;Q<E.length;Q++){let ne=w[Q];ne!==null&&(w[Q]=null,E[Q].disconnect(ne))}N=null,U=null,m.reset();for(let Q in f)delete f[Q];if(e.setRenderTarget(T),p=null,d=null,u=null,i=null,y=null,rt.stop(),n.isPresenting=!1,e.setPixelRatio(_),e.setSize(S.width,S.height,!1),v!==null){let Q=v.camera;Q.fov=v.fov,Q.zoom=v.zoom,Q.updateProjectionMatrix(),v=null}n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Q){s=Q,n.isPresenting===!0&&Le("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Q){c=Q,n.isPresenting===!0&&Le("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return h||a},this.setReferenceSpace=function(Q){h=Q},this.getBaseLayer=function(){return d!==null?d:p},this.getBinding=function(){return u===null&&x&&(u=new XRWebGLBinding(i,t)),u},this.getFrame=function(){return g},this.getSession=function(){return i},this.setSession=async function(Q){if(i=Q,i!==null){if(T=e.getRenderTarget(),i.addEventListener("select",D),i.addEventListener("selectstart",D),i.addEventListener("selectend",D),i.addEventListener("squeeze",D),i.addEventListener("squeezestart",D),i.addEventListener("squeezeend",D),i.addEventListener("end",O),i.addEventListener("inputsourceschange",X),M.xrCompatible!==!0&&await t.makeXRCompatible(),_=e.getPixelRatio(),e.getSize(S),x&&"createProjectionLayer"in XRWebGLBinding.prototype){let ye=null,Ge=null,Se=null;M.depth&&(Se=M.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,ye=M.stencil?Vi:qn,Ge=M.stencil?ar:Bn);let Ve={colorFormat:t.RGBA8,depthFormat:Se,scaleFactor:s};u=this.getBinding(),d=u.createProjectionLayer(Ve),i.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),y=new rn(d.textureWidth,d.textureHeight,{format:xn,type:hn,depthTexture:new Ui(d.textureWidth,d.textureHeight,Ge,void 0,void 0,void 0,void 0,void 0,void 0,ye),stencilBuffer:M.stencil,colorSpace:e.outputColorSpace,samples:M.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}else{let ye={antialias:M.antialias,alpha:!0,depth:M.depth,stencil:M.stencil,framebufferScaleFactor:s};p=new XRWebGLLayer(i,t,ye),i.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),y=new rn(p.framebufferWidth,p.framebufferHeight,{format:xn,type:hn,colorSpace:e.outputColorSpace,stencilBuffer:M.stencil,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1,storeMultisampledDepthBuffer:p.ignoreDepthValues===!1,storeMultisampledStencilBuffer:p.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(o),h=null,a=await i.requestReferenceSpace(c),rt.setContext(i),rt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function X(Q){for(let ne=0;ne<Q.removed.length;ne++){let ye=Q.removed[ne],Ge=w.indexOf(ye);Ge>=0&&(w[Ge]=null,E[Ge].disconnect(ye))}for(let ne=0;ne<Q.added.length;ne++){let ye=Q.added[ne],Ge=w.indexOf(ye);if(Ge===-1){for(let Ve=0;Ve<E.length;Ve++)if(Ve>=w.length){w.push(ye),Ge=Ve;break}else if(w[Ve]===null){w[Ve]=ye,Ge=Ve;break}if(Ge===-1)break}let Se=E[Ge];Se&&Se.connect(ye)}}let k=new L,Y=new L;function K(Q,ne,ye){k.setFromMatrixPosition(ne.matrixWorld),Y.setFromMatrixPosition(ye.matrixWorld);let Ge=k.distanceTo(Y),Se=ne.projectionMatrix.elements,Ve=ye.projectionMatrix.elements,ft=Se[14]/(Se[10]-1),ie=Se[14]/(Se[10]+1),re=(Se[9]+1)/Se[5],oe=(Se[9]-1)/Se[5],ce=(Se[8]-1)/Se[0],ue=(Ve[8]+1)/Ve[0],Oe=ft*ce,ze=ft*ue,We=Ge/(-ce+ue),qe=We*-ce;if(ne.matrixWorld.decompose(Q.position,Q.quaternion,Q.scale),Q.translateX(qe),Q.translateZ(We),Q.matrixWorld.compose(Q.position,Q.quaternion,Q.scale),Q.matrixWorldInverse.copy(Q.matrixWorld).invert(),Se[10]===-1)Q.projectionMatrix.copy(ne.projectionMatrix),Q.projectionMatrixInverse.copy(ne.projectionMatrixInverse);else{let z=ft+We,lt=ie+We,nt=Oe-qe,P=ze+(Ge-qe),b=re*ie/lt*z,G=oe*ie/lt*z;Q.projectionMatrix.makePerspective(nt,P,b,G,z,lt),Q.projectionMatrixInverse.copy(Q.projectionMatrix).invert()}}function _e(Q,ne){ne===null?Q.matrixWorld.copy(Q.matrix):Q.matrixWorld.multiplyMatrices(ne.matrixWorld,Q.matrix),Q.matrixWorldInverse.copy(Q.matrixWorld).invert()}this.updateCamera=function(Q){if(i===null)return;let ne=Q.near,ye=Q.far;m.texture!==null&&(m.depthNear>0&&(ne=m.depthNear),m.depthFar>0&&(ye=m.depthFar)),F.near=C.near=R.near=ne,F.far=C.far=R.far=ye,(N!==F.near||U!==F.far)&&(i.updateRenderState({depthNear:F.near,depthFar:F.far}),N=F.near,U=F.far),F.layers.mask=Q.layers.mask|6,R.layers.mask=F.layers.mask&-5,C.layers.mask=F.layers.mask&-3;let Ge=Q.parent,Se=F.cameras;_e(F,Ge);for(let Ve=0;Ve<Se.length;Ve++)_e(Se[Ve],Ge);Se.length===2?K(F,R,C):F.projectionMatrix.copy(R.projectionMatrix),v===null&&Q.isPerspectiveCamera&&(v={camera:Q,fov:Q.fov,zoom:Q.zoom}),Me(Q,F,Ge)};function Me(Q,ne,ye){ye===null?Q.matrix.copy(ne.matrixWorld):(Q.matrix.copy(ye.matrixWorld),Q.matrix.invert(),Q.matrix.multiply(ne.matrixWorld)),Q.matrix.decompose(Q.position,Q.quaternion,Q.scale),Q.updateMatrixWorld(!0),Q.projectionMatrix.copy(ne.projectionMatrix),Q.projectionMatrixInverse.copy(ne.projectionMatrixInverse),Q.isPerspectiveCamera&&(Q.fov=is*2*Math.atan(1/Q.projectionMatrix.elements[5]),Q.zoom=1)}this.getCamera=function(){return F},this.getFoveation=function(){if(!(d===null&&p===null))return o},this.setFoveation=function(Q){o=Q,d!==null&&(d.fixedFoveation=Q),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=Q)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(F)},this.getCameraTexture=function(Q){return f[Q]};let ct=null;function tt(Q,ne){if(l=ne.getViewerPose(h||a),g=ne,l!==null){let ye=l.views;p!==null&&(e.setRenderTargetFramebuffer(y,p.framebuffer),e.setRenderTarget(y));let Ge=!1;ye.length!==F.cameras.length&&(F.cameras.length=0,Ge=!0);for(let ie=0;ie<ye.length;ie++){let re=ye[ie],oe=null;if(p!==null)oe=p.getViewport(re);else{let ue=u.getViewSubImage(d,re);oe=ue.viewport,ie===0&&(e.setRenderTargetTextures(y,ue.colorTexture,ue.depthStencilTexture),e.setRenderTarget(y))}let ce=I[ie];ce===void 0&&(ce=new Ot,ce.layers.enable(ie),ce.viewport=new gt,I[ie]=ce),ce.matrix.fromArray(re.transform.matrix),ce.matrix.decompose(ce.position,ce.quaternion,ce.scale),ce.projectionMatrix.fromArray(re.projectionMatrix),ce.projectionMatrixInverse.copy(ce.projectionMatrix).invert(),ce.viewport.set(oe.x,oe.y,oe.width,oe.height),ie===0&&(F.matrix.copy(ce.matrix),F.matrix.decompose(F.position,F.quaternion,F.scale)),Ge===!0&&F.cameras.push(ce)}let Se=i.enabledFeatures;if(Se&&Se.includes("depth-sensing")&&i.depthUsage=="gpu-optimized"&&x){u=n.getBinding();let ie=u.getDepthInformation(ye[0]);ie&&ie.isValid&&ie.texture&&m.init(ie,i.renderState)}if(Se&&Se.includes("camera-access")&&x){e.state.unbindTexture(),u=n.getBinding();for(let ie=0;ie<ye.length;ie++){let re=ye[ie].camera;if(re){let oe=f[re];oe||(oe=new Vr,f[re]=oe);let ce=u.getCameraImage(re);oe.sourceTexture=ce}}}}for(let ye=0;ye<E.length;ye++){let Ge=w[ye],Se=E[ye];Ge!==null&&Se!==void 0&&Se.update(Ge,ne,h||a)}ct&&ct(Q,ne),ne.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:ne}),g=null}let rt=new bf;rt.setAnimationLoop(tt),this.setAnimationLoop=function(Q){ct=Q},this.dispose=function(){}}},fy=new Fe,Rf=new Xe;Rf.set(-1,0,0,0,1,0,0,0,1);function py(r,e){function t(m,f){m.matrixAutoUpdate===!0&&m.updateMatrix(),f.value.copy(m.matrix)}function n(m,f){f.color.getRGB(m.fogColor.value,ah(r)),f.isFog?(m.fogNear.value=f.near,m.fogFar.value=f.far):f.isFogExp2&&(m.fogDensity.value=f.density)}function i(m,f,M,T,y){f.isNodeMaterial?f.uniformsNeedUpdate=!1:f.isMeshBasicMaterial?s(m,f):f.isMeshLambertMaterial?(s(m,f),f.envMap&&(m.envMapIntensity.value=f.envMapIntensity)):f.isMeshToonMaterial?(s(m,f),u(m,f)):f.isMeshPhongMaterial?(s(m,f),l(m,f),f.envMap&&(m.envMapIntensity.value=f.envMapIntensity)):f.isMeshStandardMaterial?(s(m,f),d(m,f),f.isMeshPhysicalMaterial&&p(m,f,y)):f.isMeshMatcapMaterial?(s(m,f),g(m,f)):f.isMeshDepthMaterial?s(m,f):f.isMeshDistanceMaterial?(s(m,f),x(m,f)):f.isMeshNormalMaterial?s(m,f):f.isLineBasicMaterial?(a(m,f),f.isLineDashedMaterial&&c(m,f)):f.isPointsMaterial?o(m,f,M,T):f.isSpriteMaterial?h(m,f):f.isShadowMaterial?(m.color.value.copy(f.color),m.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function s(m,f){m.opacity.value=f.opacity,f.color&&m.diffuse.value.copy(f.color),f.emissive&&m.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(m.map.value=f.map,t(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.bumpMap&&(m.bumpMap.value=f.bumpMap,t(f.bumpMap,m.bumpMapTransform),m.bumpScale.value=f.bumpScale,f.side===sn&&(m.bumpScale.value*=-1)),f.normalMap&&(m.normalMap.value=f.normalMap,t(f.normalMap,m.normalMapTransform),m.normalScale.value.copy(f.normalScale),f.side===sn&&m.normalScale.value.negate()),f.displacementMap&&(m.displacementMap.value=f.displacementMap,t(f.displacementMap,m.displacementMapTransform),m.displacementScale.value=f.displacementScale,m.displacementBias.value=f.displacementBias),f.emissiveMap&&(m.emissiveMap.value=f.emissiveMap,t(f.emissiveMap,m.emissiveMapTransform)),f.specularMap&&(m.specularMap.value=f.specularMap,t(f.specularMap,m.specularMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest);let M=e.get(f),T=M.envMap,y=M.envMapRotation;T&&(m.envMap.value=T,m.envMapRotation.value.setFromMatrix4(fy.makeRotationFromEuler(y)).transpose(),T.isCubeTexture&&T.isRenderTargetTexture===!1&&m.envMapRotation.value.premultiply(Rf),m.reflectivity.value=f.reflectivity,m.ior.value=f.ior,m.refractionRatio.value=f.refractionRatio),f.lightMap&&(m.lightMap.value=f.lightMap,m.lightMapIntensity.value=f.lightMapIntensity,t(f.lightMap,m.lightMapTransform)),f.aoMap&&(m.aoMap.value=f.aoMap,m.aoMapIntensity.value=f.aoMapIntensity,t(f.aoMap,m.aoMapTransform))}function a(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,f.map&&(m.map.value=f.map,t(f.map,m.mapTransform))}function c(m,f){m.dashSize.value=f.dashSize,m.totalSize.value=f.dashSize+f.gapSize,m.scale.value=f.scale}function o(m,f,M,T){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.size.value=f.size*M,m.scale.value=T*.5,f.map&&(m.map.value=f.map,t(f.map,m.uvTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function h(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.rotation.value=f.rotation,f.map&&(m.map.value=f.map,t(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function l(m,f){m.specular.value.copy(f.specular),m.shininess.value=Math.max(f.shininess,1e-4)}function u(m,f){f.gradientMap&&(m.gradientMap.value=f.gradientMap)}function d(m,f){m.metalness.value=f.metalness,f.metalnessMap&&(m.metalnessMap.value=f.metalnessMap,t(f.metalnessMap,m.metalnessMapTransform)),m.roughness.value=f.roughness,f.roughnessMap&&(m.roughnessMap.value=f.roughnessMap,t(f.roughnessMap,m.roughnessMapTransform)),f.envMap&&(m.envMapIntensity.value=f.envMapIntensity)}function p(m,f,M){m.ior.value=f.ior,f.sheen>0&&(m.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),m.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(m.sheenColorMap.value=f.sheenColorMap,t(f.sheenColorMap,m.sheenColorMapTransform)),f.sheenRoughnessMap&&(m.sheenRoughnessMap.value=f.sheenRoughnessMap,t(f.sheenRoughnessMap,m.sheenRoughnessMapTransform))),f.clearcoat>0&&(m.clearcoat.value=f.clearcoat,m.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(m.clearcoatMap.value=f.clearcoatMap,t(f.clearcoatMap,m.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,t(f.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(m.clearcoatNormalMap.value=f.clearcoatNormalMap,t(f.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===sn&&m.clearcoatNormalScale.value.negate())),f.dispersion>0&&(m.dispersion.value=f.dispersion),f.retroreflectivity>0&&(m.retroreflectivity.value=f.retroreflectivity),f.iridescence>0&&(m.iridescence.value=f.iridescence,m.iridescenceIOR.value=f.iridescenceIOR,m.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(m.iridescenceMap.value=f.iridescenceMap,t(f.iridescenceMap,m.iridescenceMapTransform)),f.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=f.iridescenceThicknessMap,t(f.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),f.transmission>0&&(m.transmission.value=f.transmission,m.transmissionSamplerMap.value=M.texture,m.transmissionSamplerSize.value.set(M.width,M.height),f.transmissionMap&&(m.transmissionMap.value=f.transmissionMap,t(f.transmissionMap,m.transmissionMapTransform)),m.thickness.value=f.thickness,f.thicknessMap&&(m.thicknessMap.value=f.thicknessMap,t(f.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=f.attenuationDistance,m.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(m.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(m.anisotropyMap.value=f.anisotropyMap,t(f.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=f.specularIntensity,m.specularColor.value.copy(f.specularColor),f.specularColorMap&&(m.specularColorMap.value=f.specularColorMap,t(f.specularColorMap,m.specularColorMapTransform)),f.specularIntensityMap&&(m.specularIntensityMap.value=f.specularIntensityMap,t(f.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,f){f.matcap&&(m.matcap.value=f.matcap)}function x(m,f){let M=e.get(f).light;m.referencePosition.value.setFromMatrixPosition(M.matrixWorld),m.nearDistance.value=M.shadow.camera.near,m.farDistance.value=M.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function my(r,e,t,n){let i={},s={},a=[],c=r.getParameter(r.MAX_UNIFORM_BUFFER_BINDINGS);function o(y,E){let w=E.program;n.uniformBlockBinding(y,w)}function h(y,E){let w=i[y.id];w===void 0&&(m(y),w=l(y),i[y.id]=w,y.addEventListener("dispose",M));let S=E.program;n.updateUBOMapping(y,S);let _=e.render.frame;s[y.id]!==_&&(d(y),s[y.id]=_)}function l(y){let E=u();y.__bindingPointIndex=E;let w=r.createBuffer(),S=y.__size,_=y.usage;return r.bindBuffer(r.UNIFORM_BUFFER,w),r.bufferData(r.UNIFORM_BUFFER,S,_),r.bindBuffer(r.UNIFORM_BUFFER,null),r.bindBufferBase(r.UNIFORM_BUFFER,E,w),w}function u(){for(let y=0;y<c;y++)if(a.indexOf(y)===-1)return a.push(y),y;return He("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(y){let E=i[y.id],w=y.uniforms,S=y.__cache;r.bindBuffer(r.UNIFORM_BUFFER,E);for(let _=0,v=w.length;_<v;_++){let R=w[_];if(Array.isArray(R))for(let C=0,I=R.length;C<I;C++)p(R[C],_,C,S);else p(R,_,0,S)}r.bindBuffer(r.UNIFORM_BUFFER,null)}function p(y,E,w,S){if(x(y,E,w,S)===!0){let _=y.__offset,v=y.value;if(Array.isArray(v)){let R=0;for(let C=0;C<v.length;C++){let I=v[C],F=f(I);g(I,y.__data,R),typeof I!="number"&&typeof I!="boolean"&&!I.isMatrix3&&!ArrayBuffer.isView(I)&&(R+=F.storage/Float32Array.BYTES_PER_ELEMENT)}}else g(v,y.__data,0);r.bufferSubData(r.UNIFORM_BUFFER,_,y.__data)}}function g(y,E,w){typeof y=="number"||typeof y=="boolean"?E[0]=y:y.isMatrix3?(E[0]=y.elements[0],E[1]=y.elements[1],E[2]=y.elements[2],E[3]=0,E[4]=y.elements[3],E[5]=y.elements[4],E[6]=y.elements[5],E[7]=0,E[8]=y.elements[6],E[9]=y.elements[7],E[10]=y.elements[8],E[11]=0):ArrayBuffer.isView(y)?E.set(new y.constructor(y.buffer,y.byteOffset,E.length)):y.toArray(E,w)}function x(y,E,w,S){let _=y.value,v=E+"_"+w;if(S[v]===void 0)return typeof _=="number"||typeof _=="boolean"?S[v]=_:ArrayBuffer.isView(_)?S[v]=_.slice():S[v]=_.clone(),!0;{let R=S[v];if(typeof _=="number"||typeof _=="boolean"){if(R!==_)return S[v]=_,!0}else{if(ArrayBuffer.isView(_))return!0;if(R.equals(_)===!1)return R.copy(_),!0}}return!1}function m(y){let E=y.uniforms,w=0,S=16;for(let v=0,R=E.length;v<R;v++){let C=Array.isArray(E[v])?E[v]:[E[v]];for(let I=0,F=C.length;I<F;I++){let N=C[I],U=Array.isArray(N.value)?N.value:[N.value];for(let D=0,O=U.length;D<O;D++){let X=U[D],k=f(X),Y=w%S,K=Y%k.boundary,_e=Y+K;w+=K,_e!==0&&S-_e<k.storage&&(w+=S-_e),N.__data=new Float32Array(k.storage/Float32Array.BYTES_PER_ELEMENT),N.__offset=w,w+=k.storage}}}let _=w%S;return _>0&&(w+=S-_),y.__size=w,y.__cache={},this}function f(y){let E={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(E.boundary=4,E.storage=4):y.isVector2?(E.boundary=8,E.storage=8):y.isVector3||y.isColor?(E.boundary=16,E.storage=12):y.isVector4?(E.boundary=16,E.storage=16):y.isMatrix3?(E.boundary=48,E.storage=48):y.isMatrix4?(E.boundary=64,E.storage=64):y.isTexture?Le("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(y)?(E.boundary=16,E.storage=y.byteLength):Le("WebGLRenderer: Unsupported uniform value type.",y),E}function M(y){let E=y.target;E.removeEventListener("dispose",M);let w=a.indexOf(E.__bindingPointIndex);a.splice(w,1),r.deleteBuffer(i[E.id]),delete i[E.id],delete s[E.id]}function T(){for(let y in i)r.deleteBuffer(i[y]);a=[],i={},s={}}return{bind:o,update:h,dispose:T}}var gy=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),jn=null;function xy(){return jn===null&&(jn=new qs(gy,16,16,Wi,Hn),jn.name="DFG_LUT",jn.minFilter=Dt,jn.magFilter=Dt,jn.wrapS=bn,jn.wrapT=bn,jn.generateMipmaps=!1,jn.needsUpdate=!0),jn}var Nc=class{constructor(e={}){let{canvas:t=kd(),context:n=null,depth:i=!0,stencil:s=!1,alpha:a=!1,antialias:c=!1,premultipliedAlpha:o=!0,preserveDrawingBuffer:h=!1,powerPreference:l="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1,outputBufferType:p=hn}=e;this.isWebGLRenderer=!0;let g;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");g=n.getContextAttributes().alpha}else g=a;let x=p,m=new Set([Yo,qo,Xo]),f=new Set([hn,Bn,rr,ar,Go,Vo]),M=new Uint32Array(4),T=new Int32Array(4),y=new L,E=null,w=null,S=[],_=[],v=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Fn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let R=this,C=!1,I=null,F=null,N=null,U=null;this._outputColorSpace=mt;let D=0,O=0,X=null,k=-1,Y=null,K=new gt,_e=new gt,Me=null,ct=new Ae(0),tt=0,rt=t.width,Q=t.height,ne=1,ye=null,Ge=null,Se=new gt(0,0,rt,Q),Ve=new gt(0,0,rt,Q),ft=!1,ie=new Ys,re=!1,oe=!1,ce=new Fe,ue=new L,Oe=new gt,ze={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},We=!1;function qe(){return X===null?ne:1}let z=n;function lt(A,B){return t.getContext(A,B)}let nt,P,b,G,q,$,le,he,j,te,de,Ne,ge,fe,De,Be,Ze,H,pe,ee,me,Ee,se;try{let A={alpha:!0,depth:i,stencil:s,antialias:c,premultipliedAlpha:o,preserveDrawingBuffer:h,powerPreference:l,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${"186"}`),t.addEventListener("webglcontextlost",St,!1),t.addEventListener("webglcontextrestored",ht,!1),t.addEventListener("webglcontextcreationerror",Rn,!1),z===null){let B="webgl2";if(z=lt(B,A),z===null)throw lt(B)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}Ue()}catch(A){throw t.removeEventListener("webglcontextlost",St,!1),t.removeEventListener("webglcontextrestored",ht,!1),t.removeEventListener("webglcontextcreationerror",Rn,!1),He("WebGLRenderer: "+A.message),A}function Ue(){nt=new Sx(z),nt.init(),me=new hy(z,nt),P=new px(z,nt,e,me),b=new cy(z,nt),P.reversedDepthBuffer&&d&&b.buffers.depth.setReversed(!0),F=z.createFramebuffer(),N=z.createFramebuffer(),U=z.createFramebuffer(),G=new Ax(z),q=new Z_,$=new ly(z,nt,b,q,P,me,G),le=new Ex(R),he=new Cm(z),Ee=new dx(z,he),j=new Tx(z,he,G,Ee),te=new Cx(z,j,he,Ee,G),H=new Rx(z,P,$),De=new mx(q),de=new Y_(R,le,nt,P,Ee,De),Ne=new py(R,q),ge=new J_,fe=new ny(nt),Ze=new ux(R,le,b,te,g,o),Be=new oy(R,te,P),se=new my(z,G,P,b),pe=new fx(z,nt,G),ee=new wx(z,nt,G),G.programs=de.programs,R.capabilities=P,R.extensions=nt,R.properties=q,R.renderLists=ge,R.shadowMap=Be,R.state=b,R.info=G}x!==hn&&(v=new Px(x,t.width,t.height,c,i,s));let Ie=new Sh(R,z);this.xr=Ie,this.getContext=function(){return z},this.getContextAttributes=function(){return z.getContextAttributes()},this.forceContextLoss=function(){let A=nt.get("WEBGL_lose_context");A&&A.loseContext()},this.forceContextRestore=function(){let A=nt.get("WEBGL_lose_context");A&&A.restoreContext()},this.getPixelRatio=function(){return ne},this.setPixelRatio=function(A){A!==void 0&&(ne=A,this.setSize(rt,Q,!1))},this.getSize=function(A){return A.set(rt,Q)},this.setSize=function(A,B,Z=!0){if(Ie.isPresenting){Le("WebGLRenderer: Can't change size while VR device is presenting.");return}rt=A,Q=B,t.width=Math.floor(A*ne),t.height=Math.floor(B*ne),Z===!0&&(t.style.width=A+"px",t.style.height=B+"px"),v!==null&&v.setSize(t.width,t.height),this.setViewport(0,0,A,B)},this.getDrawingBufferSize=function(A){return A.set(rt*ne,Q*ne).floor()},this.setDrawingBufferSize=function(A,B,Z){rt=A,Q=B,ne=Z,t.width=Math.floor(A*Z),t.height=Math.floor(B*Z),this.setViewport(0,0,A,B)},this.setEffects=function(A){if(x===hn){He("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(A){for(let B=0;B<A.length;B++)if(A[B].isOutputPass===!0){Le("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}v.setEffects(A||[])},this.getCurrentViewport=function(A){return A.copy(K)},this.getViewport=function(A){return A.copy(Se)},this.setViewport=function(A,B,Z,V){A.isVector4?Se.set(A.x,A.y,A.z,A.w):Se.set(A,B,Z,V),b.viewport(K.copy(Se).multiplyScalar(ne).round())},this.getScissor=function(A){return A.copy(Ve)},this.setScissor=function(A,B,Z,V){A.isVector4?Ve.set(A.x,A.y,A.z,A.w):Ve.set(A,B,Z,V),b.scissor(_e.copy(Ve).multiplyScalar(ne).round())},this.getScissorTest=function(){return ft},this.setScissorTest=function(A){b.setScissorTest(ft=A)},this.setOpaqueSort=function(A){ye=A},this.setTransparentSort=function(A){Ge=A},this.getClearColor=function(A){return A.copy(Ze.getClearColor())},this.setClearColor=function(){Ze.setClearColor(...arguments)},this.getClearAlpha=function(){return Ze.getClearAlpha()},this.setClearAlpha=function(){Ze.setClearAlpha(...arguments)},this.clear=function(A=!0,B=!0,Z=!0){let V=0;if(A){let W=!1;if(X!==null){let be=X.texture.format;W=m.has(be)}if(W){let be=X.texture.type,we=f.has(be),ve=Ze.getClearColor(),Re=Ze.getClearAlpha(),Pe=ve.r,Ke=ve.g,it=ve.b;we?(M[0]=Pe,M[1]=Ke,M[2]=it,M[3]=Re,z.clearBufferuiv(z.COLOR,0,M)):(T[0]=Pe,T[1]=Ke,T[2]=it,T[3]=Re,z.clearBufferiv(z.COLOR,0,T))}else V|=z.COLOR_BUFFER_BIT}B&&(V|=z.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),Z&&(V|=z.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),V!==0&&z.clear(V)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(A){A.setRenderer(this),I=A},this.dispose=function(){t.removeEventListener("webglcontextlost",St,!1),t.removeEventListener("webglcontextrestored",ht,!1),t.removeEventListener("webglcontextcreationerror",Rn,!1),Ze.dispose(),ge.dispose(),fe.dispose(),q.dispose(),le.dispose(),te.dispose(),Ee.dispose(),se.dispose(),de.dispose(),Ie.dispose(),Ie.removeEventListener("sessionstart",ru),Ie.removeEventListener("sessionend",au),qi.stop()};function St(A){A.preventDefault(),Nr("WebGLRenderer: Context Lost."),C=!0}function ht(){Nr("WebGLRenderer: Context Restored."),C=!1;let A=G.autoReset,B=Be.enabled,Z=Be.autoUpdate,V=Be.needsUpdate,W=Be.type;Ue(),G.autoReset=A,Be.enabled=B,Be.autoUpdate=Z,Be.needsUpdate=V,Be.type=W}function Rn(A){He("WebGLRenderer: A WebGL context could not be created. Reason: ",A.statusMessage)}function Gn(A){let B=A.target;B.removeEventListener("dispose",Gn),Xf(B)}function Xf(A){qf(A),q.remove(A)}function qf(A){let B=q.get(A).programs;B!==void 0&&(B.forEach(function(Z){de.releaseProgram(Z)}),A.isShaderMaterial&&de.releaseShaderCache(A))}this.renderBufferDirect=function(A,B,Z,V,W,be){B===null&&(B=ze);let we=W.isMesh&&W.matrixWorld.determinantAffine()<0,ve=Kf(A,B,Z,V,W);b.setMaterial(V,we);let Re=Z.index,Pe=1;if(V.wireframe===!0){if(Re=j.getWireframeAttribute(Z),Re===void 0)return;Pe=2}let Ke=Z.drawRange,it=Z.attributes.position,Ce=Ke.start*Pe,ut=(Ke.start+Ke.count)*Pe;be!==null&&(Ce=Math.max(Ce,be.start*Pe),ut=Math.min(ut,(be.start+be.count)*Pe)),Re!==null?(Ce=Math.max(Ce,0),ut=Math.min(ut,Re.count)):it!=null&&(Ce=Math.max(Ce,0),ut=Math.min(ut,it.count));let zt=ut-Ce;if(zt<0||zt===1/0)return;Ee.setup(W,V,ve,Z,Re);let wt,bt=pe;if(Re!==null&&(wt=he.get(Re),bt=ee,bt.setIndex(wt)),W.isMesh)V.wireframe===!0?(b.setLineWidth(V.wireframeLinewidth*qe()),bt.setMode(z.LINES)):bt.setMode(z.TRIANGLES);else if(W.isLine){let Zt=V.linewidth;Zt===void 0&&(Zt=1),b.setLineWidth(Zt*qe()),W.isLineSegments?bt.setMode(z.LINES):W.isLineLoop?bt.setMode(z.LINE_LOOP):bt.setMode(z.LINE_STRIP)}else W.isPoints?bt.setMode(z.POINTS):W.isSprite&&bt.setMode(z.TRIANGLES);if(W.isBatchedMesh)if(nt.get("WEBGL_multi_draw"))bt.renderMultiDraw(W._multiDrawStarts,W._multiDrawCounts,W._multiDrawCount);else{let Zt=W._multiDrawStarts,Te=W._multiDrawCounts,jt=W._multiDrawCount,at=Re?he.get(Re).bytesPerElement:1,vn=q.get(V).currentProgram.getUniforms();for(let Vn=0;Vn<jt;Vn++)vn.setValue(z,"_gl_DrawID",Vn),bt.render(Zt[Vn]/at,Te[Vn])}else if(W.isInstancedMesh)bt.renderInstances(Ce,zt,W.count);else if(Z.isInstancedBufferGeometry){let Zt=Z._maxInstanceCount!==void 0?Z._maxInstanceCount:1/0,Te=Math.min(Z.instanceCount,Zt);bt.renderInstances(Ce,zt,Te)}else bt.render(Ce,zt)};function su(A,B,Z,V){I!==null&&A.isNodeMaterial&&I.setObject(V,A),re===!0&&De.setState(A,Z,!1),A.transparent===!0&&A.side===Ct&&A.forceSinglePass===!1?(A.side=sn,A.needsUpdate=!0,Sa(A,B,V),A.side=Jn,A.needsUpdate=!0,Sa(A,B,V),A.side=Ct):Sa(A,B,V)}this.compile=function(A,B,Z=null){Z===null&&(Z=A),I!==null&&I.renderStart(A,B,Z),w=fe.get(Z),w.init(B),_.push(w),Z.traverseVisible(function(W){W.isLight&&W.layers.test(B.layers)&&(w.pushLight(W),W.castShadow&&w.pushShadow(W))}),A!==Z&&A.traverseVisible(function(W){W.isLight&&W.layers.test(B.layers)&&(w.pushLight(W),W.castShadow&&w.pushShadow(W))}),w.setupLights(),I!==null&&I.updateLights(w.state.lightsArray),oe=this.localClippingEnabled,re=De.init(this.clippingPlanes,oe),re===!0&&De.setGlobalState(this.clippingPlanes,B),I!==null&&Be.render(w.state.shadowsArray,Z,B);let V=new Set;return A.traverse(function(W){if(!(W.isMesh||W.isPoints||W.isLine||W.isSprite))return;let be=W.material;if(be)if(Array.isArray(be))for(let we=0;we<be.length;we++){let ve=be[we];su(ve,Z,B,W),V.add(ve)}else su(be,Z,B,W),V.add(be)}),w=_.pop(),I!==null&&I.renderEnd(),V},this.compileAsync=function(A,B,Z=null){let V=this.compile(A,B,Z);return new Promise(W=>{function be(){if(V.forEach(function(we){let Re=q.get(we).currentProgram;(Re===void 0||Re.isReady())&&V.delete(we)}),V.size===0){W(A);return}setTimeout(be,10)}nt.get("KHR_parallel_shader_compile")!==null?be():setTimeout(be,10)})};let Xc=null;function Yf(A){Xc&&Xc(A)}function ru(){qi.stop()}function au(){qi.start()}let qi=new bf;qi.setAnimationLoop(Yf),typeof self<"u"&&qi.setContext(self),this.setAnimationLoop=function(A){Xc=A,Ie.setAnimationLoop(A),A===null?qi.stop():qi.start()},Ie.addEventListener("sessionstart",ru),Ie.addEventListener("sessionend",au),this.render=function(A,B){if(B!==void 0&&B.isCamera!==!0){He("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(C===!0)return;I!==null&&I.renderStart(A,B);let Z=Ie.enabled===!0&&Ie.isPresenting===!0,V=v!==null&&(X===null||Z)&&v.begin(R,X);if(A.matrixWorldAutoUpdate===!0&&A.updateMatrixWorld(),B.parent===null&&B.matrixWorldAutoUpdate===!0&&B.updateMatrixWorld(),Ie.enabled===!0&&Ie.isPresenting===!0&&(v===null||v.isCompositing()===!1)&&(Ie.cameraAutoUpdate===!0&&Ie.updateCamera(B),B=Ie.getCamera()),A.isScene===!0&&A.onBeforeRender(R,A,B,X),w=fe.get(A,_.length),w.init(B),w.state.textureUnits=$.getTextureUnits(),_.push(w),ce.multiplyMatrices(B.projectionMatrix,B.matrixWorldInverse),ie.setFromProjectionMatrix(ce,Dn,B.reversedDepth),oe=this.localClippingEnabled,re=De.init(this.clippingPlanes,oe),E=ge.get(A,S.length),E.init(),S.push(E),Ie.enabled===!0&&Ie.isPresenting===!0){let we=R.xr.getDepthSensingMesh();we!==null&&qc(we,B,-1/0,R.sortObjects)}qc(A,B,0,R.sortObjects),E.finish(),I!==null&&I.updateLights(w.state.lightsArray),R.sortObjects===!0&&E.sort(ye,Ge),We=Ie.enabled===!1||Ie.isPresenting===!1||Ie.hasDepthSensing()===!1,We&&Ze.addToRenderList(E,A),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),re===!0&&De.beginShadows();let W=w.state.shadowsArray;if(Be.render(W,A,B),re===!0&&De.endShadows(),(V&&v.hasRenderPass())===!1){let we=E.opaque,ve=E.transmissive;if(w.setupLights(),B.isArrayCamera){let Re=B.cameras;if(ve.length>0)for(let Pe=0,Ke=Re.length;Pe<Ke;Pe++){let it=Re[Pe];cu(we,ve,A,it)}We&&Ze.render(A);for(let Pe=0,Ke=Re.length;Pe<Ke;Pe++){let it=Re[Pe];ou(E,A,it,it.viewport)}}else ve.length>0&&cu(we,ve,A,B),We&&Ze.render(A),ou(E,A,B)}X!==null&&O===0&&($.updateMultisampleRenderTarget(X),$.updateRenderTargetMipmap(X)),V&&v.end(R),A.isScene===!0&&A.onAfterRender(R,A,B),Ee.resetDefaultState(),k=-1,Y=null,_.pop(),_.length>0?(w=_[_.length-1],$.setTextureUnits(w.state.textureUnits),re===!0&&De.setGlobalState(R.clippingPlanes,w.state.camera)):w=null,S.pop(),S.length>0?E=S[S.length-1]:E=null,I!==null&&I.renderEnd()};function qc(A,B,Z,V){if(A.visible===!1)return;if(A.layers.test(B.layers)){if(A.isGroup)Z=A.renderOrder;else if(A.isLOD)A.autoUpdate===!0&&A.update(B);else if(A.isLightProbeGrid)w.pushLightProbeGrid(A);else if(A.isLight)w.pushLight(A),A.castShadow&&w.pushShadow(A);else if(A.isSprite){if(!A.frustumCulled||A.intersectsFrustum(ie)){V&&Oe.setFromMatrixPosition(A.matrixWorld).applyMatrix4(ce);let we=te.update(A),ve=A.material;ve.visible&&E.push(A,we,ve,Z,Oe.z,null,B)}}else if((A.isMesh||A.isLine||A.isPoints)&&(!A.frustumCulled||A.intersectsFrustum(ie))){let we=te.update(A),ve=A.material;if(V&&(A.boundingSphere!==void 0?(A.boundingSphere===null&&A.computeBoundingSphere(),Oe.copy(A.boundingSphere.center)):(we.boundingSphere===null&&we.computeBoundingSphere(),Oe.copy(we.boundingSphere.center)),Oe.applyMatrix4(A.matrixWorld).applyMatrix4(ce)),Array.isArray(ve)){let Re=we.groups;for(let Pe=0,Ke=Re.length;Pe<Ke;Pe++){let it=Re[Pe],Ce=ve[it.materialIndex];Ce&&Ce.visible&&E.push(A,we,Ce,Z,Oe.z,it,B)}}else ve.visible&&E.push(A,we,ve,Z,Oe.z,null,B)}}let be=A.children;for(let we=0,ve=be.length;we<ve;we++)qc(be[we],B,Z,V)}function ou(A,B,Z,V){let{opaque:W,transmissive:be,transparent:we}=A;w.setupLightsView(Z),re===!0&&De.setGlobalState(R.clippingPlanes,Z),V&&b.viewport(K.copy(V)),W.length>0&&Ea(W,B,Z),be.length>0&&Ea(be,B,Z),we.length>0&&Ea(we,B,Z),b.buffers.depth.setTest(!0),b.buffers.depth.setMask(!0),b.buffers.color.setMask(!0),b.setPolygonOffset(!1)}function cu(A,B,Z,V){if((Z.isScene===!0?Z.overrideMaterial:null)!==null)return;if(w.state.transmissionRenderTarget[V.id]===void 0){let Ce=nt.has("EXT_color_buffer_half_float")||nt.has("EXT_color_buffer_float");w.state.transmissionRenderTarget[V.id]=new rn(1,1,{generateMipmaps:!0,type:Ce?Hn:hn,minFilter:On,samples:Math.max(4,P.samples),stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:je.workingColorSpace})}let be=w.state.transmissionRenderTarget[V.id],we=V.viewport||K;be.setSize(we.z*R.transmissionResolutionScale,we.w*R.transmissionResolutionScale);let ve=R.getRenderTarget(),Re=R.getActiveCubeFace(),Pe=R.getActiveMipmapLevel();R.setRenderTarget(be),R.getClearColor(ct),tt=R.getClearAlpha(),tt<1&&R.setClearColor(16777215,.5),R.clear(),We&&Ze.render(Z);let Ke=R.toneMapping;R.toneMapping=Fn;let it=V.viewport;if(V.viewport!==void 0&&(V.viewport=void 0),w.setupLightsView(V),re===!0&&De.setGlobalState(R.clippingPlanes,V),Ea(A,Z,V),$.updateMultisampleRenderTarget(be),$.updateRenderTargetMipmap(be),nt.has("WEBGL_multisampled_render_to_texture")===!1){let Ce=!1;for(let ut=0,zt=B.length;ut<zt;ut++){let wt=B[ut],{object:bt,geometry:Zt,material:Te,group:jt}=wt;if(Te.side===Ct&&bt.layers.test(V.layers)){let at=Te.side;Te.side=sn,Te.needsUpdate=!0,lu(bt,Z,V,Zt,Te,jt),Te.side=at,Te.needsUpdate=!0,Ce=!0}}Ce===!0&&($.updateMultisampleRenderTarget(be),$.updateRenderTargetMipmap(be))}R.setRenderTarget(ve,Re,Pe),R.setClearColor(ct,tt),it!==void 0&&(V.viewport=it),R.toneMapping=Ke}function Ea(A,B,Z){let V=B.isScene===!0?B.overrideMaterial:null;for(let W=0,be=A.length;W<be;W++){let we=A[W],{object:ve,geometry:Re,group:Pe}=we,Ke=we.material;Ke.allowOverride===!0&&V!==null&&(Ke=V),ve.layers.test(Z.layers)&&lu(ve,B,Z,Re,Ke,Pe)}}function lu(A,B,Z,V,W,be){I!==null&&W.isNodeMaterial&&I.setObject(A,W),A.onBeforeRender(R,B,Z,V,W,be),A.modelViewMatrix.multiplyMatrices(Z.matrixWorldInverse,A.matrixWorld),A.normalMatrix.getNormalMatrix(A.modelViewMatrix),W.onBeforeRender(R,B,Z,V,A,be),W.transparent===!0&&W.side===Ct&&W.forceSinglePass===!1?(W.side=sn,W.needsUpdate=!0,R.renderBufferDirect(Z,B,V,W,A,be),W.side=Jn,W.needsUpdate=!0,R.renderBufferDirect(Z,B,V,W,A,be),W.side=Ct):R.renderBufferDirect(Z,B,V,W,A,be),A.onAfterRender(R,B,Z,V,W,be)}function Sa(A,B,Z){B.isScene!==!0&&(B=ze);let V=q.get(A),W=w.state.lights,be=w.state.shadowsArray,we=W.state.version,ve=de.getParameters(A,W.state,be,B,Z,w.state.lightProbeGridArray),Re=de.getProgramCacheKey(ve),Pe=V.programs;V.environment=A.isMeshStandardMaterial||A.isMeshLambertMaterial||A.isMeshPhongMaterial?B.environment:null,V.fog=B.fog;let Ke=A.isMeshStandardMaterial||A.isMeshLambertMaterial&&!A.envMap||A.isMeshPhongMaterial&&!A.envMap;V.envMap=le.get(A.envMap||V.environment,Ke),V.envMapRotation=V.environment!==null&&A.envMap===null?B.environmentRotation:A.envMapRotation,Pe===void 0&&(A.addEventListener("dispose",Gn),Pe=new Map,V.programs=Pe);let it=Pe.get(Re);if(it!==void 0){if(V.currentProgram===it&&V.lightsStateVersion===we)return uu(A,ve),it}else ve.uniforms=de.getUniforms(A),I!==null&&A.isNodeMaterial&&I.build(A,Z,ve),A.onBeforeCompile(ve,R),it=de.acquireProgram(ve,Re),Pe.set(Re,it),V.uniforms=ve.uniforms;let Ce=V.uniforms;return(!A.isShaderMaterial&&!A.isRawShaderMaterial||A.clipping===!0)&&(Ce.clippingPlanes=De.uniform),uu(A,ve),V.needsLights=$f(A),V.lightsStateVersion=we,V.needsLights&&(Ce.ambientLightColor.value=W.state.ambient,Ce.lightProbe.value=W.state.probe,Ce.sunLights.value=W.state.sun,Ce.sunLightShadows.value=W.state.sunShadow,Ce.directionalLights.value=W.state.directional,Ce.directionalLightShadows.value=W.state.directionalShadow,Ce.spotLights.value=W.state.spot,Ce.spotLightShadows.value=W.state.spotShadow,Ce.rectAreaLights.value=W.state.rectArea,Ce.ltc_1.value=W.state.rectAreaLTC1,Ce.ltc_2.value=W.state.rectAreaLTC2,Ce.pointLights.value=W.state.point,Ce.pointLightShadows.value=W.state.pointShadow,Ce.hemisphereLights.value=W.state.hemi,Ce.sunShadowMatrix.value=W.state.sunShadowMatrix,Ce.sunShadowCascade.value=W.state.sunShadowCascade,Ce.directionalShadowMatrix.value=W.state.directionalShadowMatrix,Ce.spotLightMatrix.value=W.state.spotLightMatrix,Ce.spotLightMap.value=W.state.spotLightMap,Ce.pointShadowMatrix.value=W.state.pointShadowMatrix),V.lightProbeGrid=w.state.lightProbeGridArray.length>0,V.currentProgram=it,V.uniformsList=null,it}function hu(A){if(A.uniformsList===null){let B=A.currentProgram.getUniforms();A.uniformsList=hr.seqWithValue(B.seq,A.uniforms)}return A.uniformsList}function uu(A,B){let Z=q.get(A);Z.outputColorSpace=B.outputColorSpace,Z.batching=B.batching,Z.batchingColor=B.batchingColor,Z.instancing=B.instancing,Z.instancingColor=B.instancingColor,Z.instancingMorph=B.instancingMorph,Z.skinning=B.skinning,Z.morphTargets=B.morphTargets,Z.morphNormals=B.morphNormals,Z.morphColors=B.morphColors,Z.morphTargetsCount=B.morphTargetsCount,Z.numClippingPlanes=B.numClippingPlanes,Z.numIntersection=B.numClipIntersection,Z.vertexAlphas=B.vertexAlphas,Z.vertexTangents=B.vertexTangents,Z.toneMapping=B.toneMapping}function Zf(A,B){if(A.length===0)return null;if(A.length===1)return A[0].texture!==null?A[0]:null;y.setFromMatrixPosition(B.matrixWorld);for(let Z=0,V=A.length;Z<V;Z++){let W=A[Z];if(W.texture!==null&&W.boundingBox.containsPoint(y))return W}return null}function Kf(A,B,Z,V,W){B.isScene!==!0&&(B=ze),$.resetTextureUnits();let be=B.fog,we=V.isMeshStandardMaterial||V.isMeshLambertMaterial||V.isMeshPhongMaterial?B.environment:null,ve=X===null?R.outputColorSpace:X.isXRRenderTarget===!0?X.texture.colorSpace:je.workingColorSpace,Re=V.isMeshStandardMaterial||V.isMeshLambertMaterial&&!V.envMap||V.isMeshPhongMaterial&&!V.envMap,Pe=le.get(V.envMap||we,Re),Ke=V.vertexColors===!0&&!!Z.attributes.color&&Z.attributes.color.itemSize===4,it=!!Z.attributes.tangent&&(!!V.normalMap||V.anisotropy>0),Ce=!!Z.morphAttributes.position,ut=!!Z.morphAttributes.normal,zt=!!Z.morphAttributes.color,wt=Fn;V.toneMapped&&(X===null||X.isXRRenderTarget===!0)&&(wt=R.toneMapping);let bt=Z.morphAttributes.position||Z.morphAttributes.normal||Z.morphAttributes.color,Zt=bt!==void 0?bt.length:0,Te=q.get(V),jt=w.state.lights;if(re===!0&&(oe===!0||A!==Y)){let Tt=A===Y&&V.id===k;De.setState(V,A,Tt)}let at=!1;V.version===Te.__version?(Te.needsLights&&Te.lightsStateVersion!==jt.state.version||Te.outputColorSpace!==ve||W.isBatchedMesh&&Te.batching===!1||!W.isBatchedMesh&&Te.batching===!0||W.isBatchedMesh&&Te.batchingColor===!0&&W._colorsTexture===null||W.isBatchedMesh&&Te.batchingColor===!1&&W._colorsTexture!==null||W.isInstancedMesh&&Te.instancing===!1||!W.isInstancedMesh&&Te.instancing===!0||W.isSkinnedMesh&&Te.skinning===!1||!W.isSkinnedMesh&&Te.skinning===!0||W.isInstancedMesh&&Te.instancingColor===!0&&W.instanceColor===null||W.isInstancedMesh&&Te.instancingColor===!1&&W.instanceColor!==null||W.isInstancedMesh&&Te.instancingMorph===!0&&W.morphTexture===null||W.isInstancedMesh&&Te.instancingMorph===!1&&W.morphTexture!==null||Te.envMap!==Pe||V.fog===!0&&Te.fog!==be||Te.numClippingPlanes!==void 0&&(Te.numClippingPlanes!==De.numPlanes||Te.numIntersection!==De.numIntersection)||Te.vertexAlphas!==Ke||Te.vertexTangents!==it||Te.morphTargets!==Ce||Te.morphNormals!==ut||Te.morphColors!==zt||Te.toneMapping!==wt||Te.morphTargetsCount!==Zt||!!Te.lightProbeGrid!=w.state.lightProbeGridArray.length>0)&&(at=!0):(at=!0,Te.__version=V.version);let vn=Te.currentProgram;at===!0&&(vn=Sa(V,B,W),I&&V.isNodeMaterial&&I.onUpdateProgram(V,vn,Te));let Vn=!1,bi=!1,gs=!1,vt=vn.getUniforms(),Lt=Te.uniforms;if(b.useProgram(vn.program)&&(Vn=!0,bi=!0,gs=!0),V.id!==k&&(k=V.id,bi=!0),Te.needsLights){let Tt=Zf(w.state.lightProbeGridArray,W);Te.lightProbeGrid!==Tt&&(Te.lightProbeGrid=Tt,bi=!0)}if(Vn||Y!==A){b.buffers.depth.getReversed()&&A.reversedDepth!==!0&&(A._reversedDepth=!0,A.updateProjectionMatrix()),vt.setValue(z,"projectionMatrix",A.projectionMatrix),vt.setValue(z,"viewMatrix",A.matrixWorldInverse);let Si=vt.map.cameraPosition;Si!==void 0&&Si.setValue(z,ue.setFromMatrixPosition(A.matrixWorld)),P.logarithmicDepthBuffer&&vt.setValue(z,"logDepthBufFC",2/(Math.log(A.far+1)/Math.LN2)),(V.isMeshPhongMaterial||V.isMeshToonMaterial||V.isMeshLambertMaterial||V.isMeshBasicMaterial||V.isMeshStandardMaterial||V.isShaderMaterial)&&vt.setValue(z,"isOrthographic",A.isOrthographicCamera===!0),Y!==A&&(Y=A,bi=!0,gs=!0)}if(Te.needsLights&&(jt.state.sunShadowMap.length>0&&vt.setValue(z,"sunShadowMap",jt.state.sunShadowMap,$),jt.state.directionalShadowMap.length>0&&vt.setValue(z,"directionalShadowMap",jt.state.directionalShadowMap,$),jt.state.spotShadowMap.length>0&&vt.setValue(z,"spotShadowMap",jt.state.spotShadowMap,$),jt.state.pointShadowMap.length>0&&vt.setValue(z,"pointShadowMap",jt.state.pointShadowMap,$)),W.isSkinnedMesh){vt.setOptional(z,W,"bindMatrix"),vt.setOptional(z,W,"bindMatrixInverse");let Tt=W.skeleton;Tt&&(Tt.boneTexture===null&&Tt.computeBoneTexture(),vt.setValue(z,"boneTexture",Tt.boneTexture,$))}W.isBatchedMesh&&(vt.setOptional(z,W,"batchingTexture"),vt.setValue(z,"batchingTexture",W._matricesTexture,$),vt.setOptional(z,W,"batchingIdTexture"),vt.setValue(z,"batchingIdTexture",W._indirectTexture,$),vt.setOptional(z,W,"batchingColorTexture"),W._colorsTexture!==null&&vt.setValue(z,"batchingColorTexture",W._colorsTexture,$));let Ei=Z.morphAttributes;if((Ei.position!==void 0||Ei.normal!==void 0||Ei.color!==void 0)&&H.update(W,Z,vn),(bi||Te.receiveShadow!==W.receiveShadow)&&(Te.receiveShadow=W.receiveShadow,vt.setValue(z,"receiveShadow",W.receiveShadow)),(V.isMeshStandardMaterial||V.isMeshLambertMaterial||V.isMeshPhongMaterial)&&V.envMap===null&&B.environment!==null&&(Lt.envMapIntensity.value=B.environmentIntensity),Lt.dfgLUT!==void 0&&(Lt.dfgLUT.value=xy()),bi){if(vt.setValue(z,"toneMappingExposure",R.toneMappingExposure),Te.needsLights&&Jf(Lt,gs),be&&V.fog===!0&&Ne.refreshFogUniforms(Lt,be),Ne.refreshMaterialUniforms(Lt,V,ne,Q,w.state.transmissionRenderTarget[A.id]),Te.needsLights&&Te.lightProbeGrid){let Tt=Te.lightProbeGrid;Lt.probesSH.value=Tt.texture,Lt.probesMin.value.copy(Tt.boundingBox.min),Lt.probesMax.value.copy(Tt.boundingBox.max),Lt.probesResolution.value.copy(Tt.resolution)}hr.upload(z,hu(Te),Lt,$)}if(V.isShaderMaterial&&V.uniformsNeedUpdate===!0&&(hr.upload(z,hu(Te),Lt,$),V.uniformsNeedUpdate=!1),V.isSpriteMaterial&&vt.setValue(z,"center",W.center),vt.setValue(z,"modelViewMatrix",W.modelViewMatrix),vt.setValue(z,"normalMatrix",W.normalMatrix),vt.setValue(z,"modelMatrix",W.matrixWorld),V.uniformsGroups!==void 0){let Tt=V.uniformsGroups;for(let Si=0,xs=Tt.length;Si<xs;Si++){let fu=Tt[Si];se.update(fu,vn),se.bind(fu,vn)}}return vn}function Jf(A,B){A.ambientLightColor.needsUpdate=B,A.lightProbe.needsUpdate=B,A.sunLights.needsUpdate=B,A.sunLightShadows.needsUpdate=B,A.directionalLights.needsUpdate=B,A.directionalLightShadows.needsUpdate=B,A.pointLights.needsUpdate=B,A.pointLightShadows.needsUpdate=B,A.spotLights.needsUpdate=B,A.spotLightShadows.needsUpdate=B,A.rectAreaLights.needsUpdate=B,A.hemisphereLights.needsUpdate=B}function $f(A){return A.isMeshLambertMaterial||A.isMeshToonMaterial||A.isMeshPhongMaterial||A.isMeshStandardMaterial||A.isShadowMaterial||A.isShaderMaterial&&A.lights===!0}this.getActiveCubeFace=function(){return D},this.getActiveMipmapLevel=function(){return O},this.getRenderTarget=function(){return X},this.setRenderTargetTextures=function(A,B,Z){let V=q.get(A);V.__autoAllocateDepthBuffer=A.resolveDepthBuffer===!1,V.__autoAllocateDepthBuffer===!1&&(V.__useRenderToTexture=!1),q.get(A.texture).__webglTexture=B,q.get(A.depthTexture).__webglTexture=V.__autoAllocateDepthBuffer?void 0:Z,V.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(A,B){let Z=q.get(A);Z.__webglFramebuffer=B,Z.__useDefaultFramebuffer=B===void 0},this.setRenderTarget=function(A,B=0,Z=0){X=A,D=B,O=Z;let V=null,W=!1,be=!1;if(A){let ve=q.get(A);if(ve.__useDefaultFramebuffer!==void 0){b.bindFramebuffer(z.FRAMEBUFFER,ve.__webglFramebuffer),K.copy(A.viewport),_e.copy(A.scissor),Me=A.scissorTest,b.viewport(K),b.scissor(_e),b.setScissorTest(Me),k=-1;return}else if(ve.__webglFramebuffer===void 0)$.setupRenderTarget(A);else if(ve.__hasExternalTextures)$.rebindTextures(A,q.get(A.texture).__webglTexture,q.get(A.depthTexture).__webglTexture);else if(A.depthBuffer){let Ke=A.depthTexture;if(ve.__boundDepthTexture!==Ke){if(Ke!==null&&q.has(Ke)&&(A.width!==Ke.image.width||A.height!==Ke.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");$.setupDepthRenderbuffer(A)}}let Re=A.texture;(Re.isData3DTexture||Re.isDataArrayTexture||Re.isCompressedArrayTexture)&&(be=!0);let Pe=q.get(A).__webglFramebuffer;A.isWebGLCubeRenderTarget?(Array.isArray(Pe[B])?V=Pe[B][Z]:V=Pe[B],W=!0):A.samples>0&&$.useMultisampledRTT(A)===!1?V=q.get(A).__webglMultisampledFramebuffer:Array.isArray(Pe)?V=Pe[Z]:V=Pe,K.copy(A.viewport),_e.copy(A.scissor),Me=A.scissorTest}else K.copy(Se).multiplyScalar(ne).floor(),_e.copy(Ve).multiplyScalar(ne).floor(),Me=ft;if(Z!==0&&(V=F),b.bindFramebuffer(z.FRAMEBUFFER,V)&&b.drawBuffers(A,V),b.viewport(K),b.scissor(_e),b.setScissorTest(Me),W){let ve=q.get(A.texture);z.framebufferTexture2D(z.FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_CUBE_MAP_POSITIVE_X+B,ve.__webglTexture,Z)}else if(be){let ve=B;for(let Re=0;Re<A.textures.length;Re++){let Pe=q.get(A.textures[Re]);z.framebufferTextureLayer(z.FRAMEBUFFER,z.COLOR_ATTACHMENT0+Re,Pe.__webglTexture,Z,ve)}}else if(A!==null&&Z!==0){let ve=q.get(A.texture);z.framebufferTexture2D(z.FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_2D,ve.__webglTexture,Z)}k=-1};function du(A){let B=q.get(A);return(B.__readFormat!==A.format||B.__readType!==A.type)&&(B.__readFormat=A.format,B.__readType=A.type,B.__formatReadable=P.textureFormatReadable(A.format),B.__typeReadable=P.textureTypeReadable(A.type)),B}this.readRenderTargetPixels=function(A,B,Z,V,W,be,we,ve=0){if(!(A&&A.isWebGLRenderTarget)){He("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Re=q.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&we!==void 0&&(Re=Re[we]),Re){b.bindFramebuffer(z.FRAMEBUFFER,Re);try{let Pe=A.textures[ve],Ke=Pe.format,it=Pe.type;A.textures.length>1&&z.readBuffer(z.COLOR_ATTACHMENT0+ve);let Ce=du(Pe);if(Ce.__formatReadable===!1){He("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Ce.__typeReadable===!1){He("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}B>=0&&B<=A.width-V&&Z>=0&&Z<=A.height-W&&z.readPixels(B,Z,V,W,me.convert(Ke),me.convert(it),be)}finally{let Pe=X!==null?q.get(X).__webglFramebuffer:null;b.bindFramebuffer(z.FRAMEBUFFER,Pe)}}},this.readRenderTargetPixelsAsync=async function(A,B,Z,V,W,be,we,ve=0){if(!(A&&A.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Re=q.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&we!==void 0&&(Re=Re[we]),Re)if(B>=0&&B<=A.width-V&&Z>=0&&Z<=A.height-W){b.bindFramebuffer(z.FRAMEBUFFER,Re);let Pe=A.textures[ve],Ke=Pe.format,it=Pe.type;A.textures.length>1&&z.readBuffer(z.COLOR_ATTACHMENT0+ve);let Ce=du(Pe);if(Ce.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Ce.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let ut=z.createBuffer();z.bindBuffer(z.PIXEL_PACK_BUFFER,ut),z.bufferData(z.PIXEL_PACK_BUFFER,be.byteLength,z.STREAM_READ),z.readPixels(B,Z,V,W,me.convert(Ke),me.convert(it),0),z.bindBuffer(z.PIXEL_PACK_BUFFER,null);let zt=X!==null?q.get(X).__webglFramebuffer:null;b.bindFramebuffer(z.FRAMEBUFFER,zt);let wt=z.fenceSync(z.SYNC_GPU_COMMANDS_COMPLETE,0);return z.flush(),await Vd(z,wt,4),z.bindBuffer(z.PIXEL_PACK_BUFFER,ut),z.getBufferSubData(z.PIXEL_PACK_BUFFER,0,be),z.bindBuffer(z.PIXEL_PACK_BUFFER,null),z.deleteBuffer(ut),z.deleteSync(wt),be}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(A,B=null,Z=0){let V=Math.pow(2,-Z),W=Math.floor(A.image.width*V),be=Math.floor(A.image.height*V),we=B!==null?B.x:0,ve=B!==null?B.y:0;$.setTexture2D(A,0),z.copyTexSubImage2D(z.TEXTURE_2D,Z,0,0,we,ve,W,be),b.unbindTexture()},this.copyTextureToTexture=function(A,B,Z=null,V=null,W=0,be=0){let we,ve,Re,Pe,Ke,it,Ce,ut,zt,wt=A.isCompressedTexture?A.mipmaps[be]:A.image;if(Z!==null)we=Z.max.x-Z.min.x,ve=Z.max.y-Z.min.y,Re=Z.isBox3?Z.max.z-Z.min.z:1,Pe=Z.min.x,Ke=Z.min.y,it=Z.isBox3?Z.min.z:0;else{let Lt=Math.pow(2,-W);we=Math.floor(wt.width*Lt),ve=Math.floor(wt.height*Lt),A.isDataArrayTexture?Re=wt.depth:A.isData3DTexture?Re=Math.floor(wt.depth*Lt):Re=1,Pe=0,Ke=0,it=0}V!==null?(Ce=V.x,ut=V.y,zt=V.z):(Ce=0,ut=0,zt=0);let bt=me.convert(B.format),Zt=me.convert(B.type),Te;B.isData3DTexture?($.setTexture3D(B,0),Te=z.TEXTURE_3D):B.isDataArrayTexture||B.isCompressedArrayTexture?($.setTexture2DArray(B,0),Te=z.TEXTURE_2D_ARRAY):($.setTexture2D(B,0),Te=z.TEXTURE_2D),b.activeTexture(z.TEXTURE0),b.pixelStorei(z.UNPACK_FLIP_Y_WEBGL,B.flipY),b.pixelStorei(z.UNPACK_PREMULTIPLY_ALPHA_WEBGL,B.premultiplyAlpha),b.pixelStorei(z.UNPACK_ALIGNMENT,B.unpackAlignment);let jt=b.getParameter(z.UNPACK_ROW_LENGTH),at=b.getParameter(z.UNPACK_IMAGE_HEIGHT),vn=b.getParameter(z.UNPACK_SKIP_PIXELS),Vn=b.getParameter(z.UNPACK_SKIP_ROWS),bi=b.getParameter(z.UNPACK_SKIP_IMAGES);b.pixelStorei(z.UNPACK_ROW_LENGTH,wt.width),b.pixelStorei(z.UNPACK_IMAGE_HEIGHT,wt.height),b.pixelStorei(z.UNPACK_SKIP_PIXELS,Pe),b.pixelStorei(z.UNPACK_SKIP_ROWS,Ke),b.pixelStorei(z.UNPACK_SKIP_IMAGES,it);let gs=A.isDataArrayTexture||A.isData3DTexture,vt=B.isDataArrayTexture||B.isData3DTexture;if(A.isDepthTexture){let Lt=q.get(A),Ei=q.get(B),Tt=q.get(Lt.__renderTarget),Si=q.get(Ei.__renderTarget);b.bindFramebuffer(z.READ_FRAMEBUFFER,Tt.__webglFramebuffer),b.bindFramebuffer(z.DRAW_FRAMEBUFFER,Si.__webglFramebuffer);for(let xs=0;xs<Re;xs++)gs&&(z.framebufferTextureLayer(z.READ_FRAMEBUFFER,z.COLOR_ATTACHMENT0,q.get(A).__webglTexture,W,it+xs),z.framebufferTextureLayer(z.DRAW_FRAMEBUFFER,z.COLOR_ATTACHMENT0,q.get(B).__webglTexture,be,zt+xs)),z.blitFramebuffer(Pe,Ke,we,ve,Ce,ut,we,ve,z.DEPTH_BUFFER_BIT,z.NEAREST);b.bindFramebuffer(z.READ_FRAMEBUFFER,null),b.bindFramebuffer(z.DRAW_FRAMEBUFFER,null)}else if(W!==0||A.isRenderTargetTexture||q.has(A)){let Lt=q.get(A),Ei=q.get(B);b.bindFramebuffer(z.READ_FRAMEBUFFER,N),b.bindFramebuffer(z.DRAW_FRAMEBUFFER,U);for(let Tt=0;Tt<Re;Tt++)gs?z.framebufferTextureLayer(z.READ_FRAMEBUFFER,z.COLOR_ATTACHMENT0,Lt.__webglTexture,W,it+Tt):z.framebufferTexture2D(z.READ_FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_2D,Lt.__webglTexture,W),vt?z.framebufferTextureLayer(z.DRAW_FRAMEBUFFER,z.COLOR_ATTACHMENT0,Ei.__webglTexture,be,zt+Tt):z.framebufferTexture2D(z.DRAW_FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_2D,Ei.__webglTexture,be),W!==0?z.blitFramebuffer(Pe,Ke,we,ve,Ce,ut,we,ve,z.COLOR_BUFFER_BIT,z.NEAREST):vt?z.copyTexSubImage3D(Te,be,Ce,ut,zt+Tt,Pe,Ke,we,ve):z.copyTexSubImage2D(Te,be,Ce,ut,Pe,Ke,we,ve);b.bindFramebuffer(z.READ_FRAMEBUFFER,null),b.bindFramebuffer(z.DRAW_FRAMEBUFFER,null)}else vt?A.isDataTexture||A.isData3DTexture?z.texSubImage3D(Te,be,Ce,ut,zt,we,ve,Re,bt,Zt,wt.data):B.isCompressedArrayTexture?z.compressedTexSubImage3D(Te,be,Ce,ut,zt,we,ve,Re,bt,wt.data):z.texSubImage3D(Te,be,Ce,ut,zt,we,ve,Re,bt,Zt,wt):A.isDataTexture?z.texSubImage2D(z.TEXTURE_2D,be,Ce,ut,we,ve,bt,Zt,wt.data):A.isCompressedTexture?z.compressedTexSubImage2D(z.TEXTURE_2D,be,Ce,ut,wt.width,wt.height,bt,wt.data):z.texSubImage2D(z.TEXTURE_2D,be,Ce,ut,we,ve,bt,Zt,wt);b.pixelStorei(z.UNPACK_ROW_LENGTH,jt),b.pixelStorei(z.UNPACK_IMAGE_HEIGHT,at),b.pixelStorei(z.UNPACK_SKIP_PIXELS,vn),b.pixelStorei(z.UNPACK_SKIP_ROWS,Vn),b.pixelStorei(z.UNPACK_SKIP_IMAGES,bi),be===0&&B.generateMipmaps&&z.generateMipmap(Te),b.unbindTexture()},this.initRenderTarget=function(A){q.get(A).__webglFramebuffer===void 0&&$.setupRenderTarget(A)},this.initTexture=function(A){A.isCubeTexture?$.setTextureCube(A,0):A.isData3DTexture?$.setTexture3D(A,0):A.isDataArrayTexture||A.isCompressedArrayTexture?$.setTexture2DArray(A,0):$.setTexture2D(A,0),b.unbindTexture()},this.resetState=function(){D=0,O=0,X=null,b.reset(),Ee.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Dn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=je._getDrawingBufferColorSpace(e),t.unpackColorSpace=je._getUnpackColorSpace()}};function Th(r,e){if(e===eh)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),r;if(e===or||e===pa){let t=r.getIndex();if(t===null){let s=[],a=r.getAttribute("position");if(a!==void 0){for(let c=0;c<a.count;c++)s.push(c);r.setIndex(s),t=r.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),r}let n=t.count-2,i=[];if(e===or)for(let s=1;s<=n;s++)i.push(t.getX(0)),i.push(t.getX(s)),i.push(t.getX(s+1));else for(let s=0;s<n;s++)s%2===0?(i.push(t.getX(s)),i.push(t.getX(s+1)),i.push(t.getX(s+2))):(i.push(t.getX(s+2)),i.push(t.getX(s+1)),i.push(t.getX(s)));return i.length/3!==n&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles."),r.setIndex(i),r.clearGroups(),r}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),r}function zc(r){let e=new Map,t=new Map,n=r.clone();return Cf(r,n,function(i,s){e.set(s,i),t.set(i,s)}),n.traverse(function(i){if(!i.isSkinnedMesh)return;let s=i,a=e.get(i),c=a.skeleton.bones;s.skeleton=a.skeleton.clone(),s.bindMatrix.copy(a.bindMatrix),s.skeleton.bones=c.map(function(o){return t.get(o)}),s.bind(s.skeleton,s.bindMatrix)}),n}function Cf(r,e,t){t(r,e);for(let n=0;n<r.children.length;n++)Cf(r.children[n],e.children[n],t)}var Fc=class extends Kn{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(t){return new Lh(t)}),this.register(function(t){return new Nh(t)}),this.register(function(t){return new Gh(t)}),this.register(function(t){return new Vh(t)}),this.register(function(t){return new Wh(t)}),this.register(function(t){return new Uh(t)}),this.register(function(t){return new zh(t)}),this.register(function(t){return new Fh(t)}),this.register(function(t){return new Oh(t)}),this.register(function(t){return new Ph(t)}),this.register(function(t){return new Bh(t)}),this.register(function(t){return new Dh(t)}),this.register(function(t){return new kh(t)}),this.register(function(t){return new Hh(t)}),this.register(function(t){return new Ch(t)}),this.register(function(t){return new Oc(t,et.EXT_MESHOPT_COMPRESSION)}),this.register(function(t){return new Oc(t,et.KHR_MESHOPT_COMPRESSION)}),this.register(function(t){return new Xh(t)})}load(e,t,n,i){let s=this,a;if(this.resourcePath!=="")a=this.resourcePath;else if(this.path!==""){let h=_i.extractUrlBase(e);a=_i.resolveURL(h,this.path)}else a=_i.extractUrlBase(e);this.manager.itemStart(e);let c=function(h){i?i(h):console.error(h),s.manager.itemError(e),s.manager.itemEnd(e)},o=new Qs(this.manager);o.setPath(this.path),o.setResponseType("arraybuffer"),o.setRequestHeader(this.requestHeader),o.setWithCredentials(this.withCredentials),o.load(e,function(h){try{s.parse(h,a,function(l){t(l),s.manager.itemEnd(e)},c)}catch(l){c(l)}},n,c)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,n,i){let s,a={},c={},o=new TextDecoder;if(typeof e=="string")s=JSON.parse(e);else if(e instanceof ArrayBuffer)if(o.decode(new Uint8Array(e,0,4))===Df){try{a[et.KHR_BINARY_GLTF]=new qh(e)}catch(u){i&&i(u);return}s=JSON.parse(a[et.KHR_BINARY_GLTF].content)}else s=JSON.parse(o.decode(e));else s=e;if(s.asset===void 0||s.asset.version[0]<2){i&&i(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}let h=new Qh(s,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});h.fileLoader.setRequestHeader(this.requestHeader);for(let l=0;l<this.pluginCallbacks.length;l++){let u=this.pluginCallbacks[l](h);u.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),c[u.name]=u,a[u.name]=!0}if(s.extensionsUsed)for(let l=0;l<s.extensionsUsed.length;++l){let u=s.extensionsUsed[l],d=s.extensionsRequired||[];switch(u){case et.KHR_MATERIALS_UNLIT:a[u]=new Ih;break;case et.KHR_DRACO_MESH_COMPRESSION:a[u]=new Yh(s,this.dracoLoader);break;case et.KHR_TEXTURE_TRANSFORM:a[u]=new Zh;break;case et.KHR_MESH_QUANTIZATION:a[u]=new Kh;break;default:d.indexOf(u)>=0&&c[u]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+u+'".')}}h.setExtensions(a),h.setPlugins(c),h.parse(n,i)}parseAsync(e,t){let n=this;return new Promise(function(i,s){n.parse(e,t,i,s)})}};function vy(){let r={};return{get:function(e){return r[e]},add:function(e,t){r[e]=t},remove:function(e){delete r[e]},removeAll:function(){r={}}}}function Ut(r,e,t){let n=r.json.materials[e];return n.extensions&&n.extensions[t]?n.extensions[t]:null}var et={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",KHR_MESHOPT_COMPRESSION:"KHR_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"},Ch=class{constructor(e){this.parser=e,this.name=et.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){let e=this.parser,t=this.parser.json.nodes||[];for(let n=0,i=t.length;n<i;n++){let s=t[n];s.extensions&&s.extensions[this.name]&&s.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,s.extensions[this.name].light)}}_loadLight(e){let t=this.parser,n="light:"+e,i=t.cache.get(n);if(i)return i;let s=t.json,o=((s.extensions&&s.extensions[this.name]||{}).lights||[])[e],h,l=new Ae(16777215);o.color!==void 0&&l.setRGB(o.color[0],o.color[1],o.color[2],en);let u=o.range!==void 0?o.range:0;switch(o.type){case"directional":h=new zn(l),h.target.position.set(0,0,-1),h.add(h.target);break;case"point":h=new ta(l),h.distance=u;break;case"spot":h=new ea(l),h.distance=u,o.spot=o.spot||{},o.spot.innerConeAngle=o.spot.innerConeAngle!==void 0?o.spot.innerConeAngle:0,o.spot.outerConeAngle=o.spot.outerConeAngle!==void 0?o.spot.outerConeAngle:Math.PI/4,h.angle=o.spot.outerConeAngle,h.penumbra=1-o.spot.innerConeAngle/o.spot.outerConeAngle,h.target.position.set(0,0,-1),h.add(h.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+o.type)}return h.position.set(0,0,0),ei(h,o),o.intensity!==void 0&&(h.intensity=o.intensity),h.name=t.createUniqueName(o.name||"light_"+e),i=Promise.resolve(h),t.cache.add(n,i),i}getDependency(e,t){if(e==="light")return this._loadLight(t)}createNodeAttachment(e){let t=this,n=this.parser,s=n.json.nodes[e],c=(s.extensions&&s.extensions[this.name]||{}).light;return c===void 0?null:this._loadLight(c).then(function(o){return n._getNodeRef(t.cache,c,o)})}},Ih=class{constructor(){this.name=et.KHR_MATERIALS_UNLIT}getMaterialType(){return ot}extendParams(e,t,n){let i=[];e.color=new Ae(1,1,1),e.opacity=1;let s=t.pbrMetallicRoughness;if(s){if(Array.isArray(s.baseColorFactor)){let a=s.baseColorFactor;e.color.setRGB(a[0],a[1],a[2],en),e.opacity=a[3]}s.baseColorTexture!==void 0&&i.push(n.assignTexture(e,"map",s.baseColorTexture,mt))}return Promise.all(i)}},Ph=class{constructor(e){this.parser=e,this.name=et.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){let n=Ut(this.parser,e,this.name);return n===null||n.emissiveStrength!==void 0&&(t.emissiveIntensity=n.emissiveStrength),Promise.resolve()}},Lh=class{constructor(e){this.parser=e,this.name=et.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){return Ut(this.parser,e,this.name)!==null?cn:null}extendMaterialParams(e,t){let n=Ut(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];if(n.clearcoatFactor!==void 0&&(t.clearcoat=n.clearcoatFactor),n.clearcoatTexture!==void 0&&i.push(this.parser.assignTexture(t,"clearcoatMap",n.clearcoatTexture)),n.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=n.clearcoatRoughnessFactor),n.clearcoatRoughnessTexture!==void 0&&i.push(this.parser.assignTexture(t,"clearcoatRoughnessMap",n.clearcoatRoughnessTexture)),n.clearcoatNormalTexture!==void 0&&(i.push(this.parser.assignTexture(t,"clearcoatNormalMap",n.clearcoatNormalTexture)),n.clearcoatNormalTexture.scale!==void 0)){let s=n.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new ae(s,s)}return Promise.all(i)}},Nh=class{constructor(e){this.parser=e,this.name=et.KHR_MATERIALS_DISPERSION}getMaterialType(e){return Ut(this.parser,e,this.name)!==null?cn:null}extendMaterialParams(e,t){let n=Ut(this.parser,e,this.name);return n===null||(t.dispersion=n.dispersion!==void 0?n.dispersion:0),Promise.resolve()}},Dh=class{constructor(e){this.parser=e,this.name=et.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){return Ut(this.parser,e,this.name)!==null?cn:null}extendMaterialParams(e,t){let n=Ut(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];return n.iridescenceFactor!==void 0&&(t.iridescence=n.iridescenceFactor),n.iridescenceTexture!==void 0&&i.push(this.parser.assignTexture(t,"iridescenceMap",n.iridescenceTexture)),n.iridescenceIor!==void 0&&(t.iridescenceIOR=n.iridescenceIor),t.iridescenceThicknessRange===void 0&&(t.iridescenceThicknessRange=[100,400]),n.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessRange[0]=n.iridescenceThicknessMinimum),n.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessRange[1]=n.iridescenceThicknessMaximum),n.iridescenceThicknessTexture!==void 0&&i.push(this.parser.assignTexture(t,"iridescenceThicknessMap",n.iridescenceThicknessTexture)),Promise.all(i)}},Uh=class{constructor(e){this.parser=e,this.name=et.KHR_MATERIALS_SHEEN}getMaterialType(e){return Ut(this.parser,e,this.name)!==null?cn:null}extendMaterialParams(e,t){let n=Ut(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];if(t.sheenColor=new Ae(0,0,0),t.sheenRoughness=0,t.sheen=1,n.sheenColorFactor!==void 0){let s=n.sheenColorFactor;t.sheenColor.setRGB(s[0],s[1],s[2],en)}return n.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=n.sheenRoughnessFactor),n.sheenColorTexture!==void 0&&i.push(this.parser.assignTexture(t,"sheenColorMap",n.sheenColorTexture,mt)),n.sheenRoughnessTexture!==void 0&&i.push(this.parser.assignTexture(t,"sheenRoughnessMap",n.sheenRoughnessTexture)),Promise.all(i)}},zh=class{constructor(e){this.parser=e,this.name=et.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){return Ut(this.parser,e,this.name)!==null?cn:null}extendMaterialParams(e,t){let n=Ut(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];return n.transmissionFactor!==void 0&&(t.transmission=n.transmissionFactor),n.transmissionTexture!==void 0&&i.push(this.parser.assignTexture(t,"transmissionMap",n.transmissionTexture)),Promise.all(i)}},Fh=class{constructor(e){this.parser=e,this.name=et.KHR_MATERIALS_VOLUME}getMaterialType(e){return Ut(this.parser,e,this.name)!==null?cn:null}extendMaterialParams(e,t){let n=Ut(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];t.thickness=n.thicknessFactor!==void 0?n.thicknessFactor:0,n.thicknessTexture!==void 0&&i.push(this.parser.assignTexture(t,"thicknessMap",n.thicknessTexture)),t.attenuationDistance=n.attenuationDistance||1/0;let s=n.attenuationColor||[1,1,1];return t.attenuationColor=new Ae().setRGB(s[0],s[1],s[2],en),Promise.all(i)}},Oh=class{constructor(e){this.parser=e,this.name=et.KHR_MATERIALS_IOR}getMaterialType(e){return Ut(this.parser,e,this.name)!==null?cn:null}extendMaterialParams(e,t){let n=Ut(this.parser,e,this.name);return n===null||(t.ior=n.ior!==void 0?n.ior:1.5,t.ior===0&&(t.ior=1e3)),Promise.resolve()}},Bh=class{constructor(e){this.parser=e,this.name=et.KHR_MATERIALS_SPECULAR}getMaterialType(e){return Ut(this.parser,e,this.name)!==null?cn:null}extendMaterialParams(e,t){let n=Ut(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];t.specularIntensity=n.specularFactor!==void 0?n.specularFactor:1,n.specularTexture!==void 0&&i.push(this.parser.assignTexture(t,"specularIntensityMap",n.specularTexture));let s=n.specularColorFactor||[1,1,1];return t.specularColor=new Ae().setRGB(s[0],s[1],s[2],en),n.specularColorTexture!==void 0&&i.push(this.parser.assignTexture(t,"specularColorMap",n.specularColorTexture,mt)),Promise.all(i)}},Hh=class{constructor(e){this.parser=e,this.name=et.EXT_MATERIALS_BUMP}getMaterialType(e){return Ut(this.parser,e,this.name)!==null?cn:null}extendMaterialParams(e,t){let n=Ut(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];return t.bumpScale=n.bumpFactor!==void 0?n.bumpFactor:1,n.bumpTexture!==void 0&&i.push(this.parser.assignTexture(t,"bumpMap",n.bumpTexture)),Promise.all(i)}},kh=class{constructor(e){this.parser=e,this.name=et.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){return Ut(this.parser,e,this.name)!==null?cn:null}extendMaterialParams(e,t){let n=Ut(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];return n.anisotropyStrength!==void 0&&(t.anisotropy=n.anisotropyStrength),n.anisotropyRotation!==void 0&&(t.anisotropyRotation=n.anisotropyRotation),n.anisotropyTexture!==void 0&&i.push(this.parser.assignTexture(t,"anisotropyMap",n.anisotropyTexture)),Promise.all(i)}},Gh=class{constructor(e){this.parser=e,this.name=et.KHR_TEXTURE_BASISU}loadTexture(e){let t=this.parser,n=t.json,i=n.textures[e];if(!i.extensions||!i.extensions[this.name])return null;let s=i.extensions[this.name],a=t.options.ktx2Loader;if(!a){if(n.extensionsRequired&&n.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return t.loadTextureImage(e,s.source,a)}},Vh=class{constructor(e){this.parser=e,this.name=et.EXT_TEXTURE_WEBP}loadTexture(e){let t=this.name,n=this.parser,i=n.json,s=i.textures[e];if(!s.extensions||!s.extensions[t])return null;let a=s.extensions[t],c=i.images[a.source],o=n.textureLoader;if(c.uri){let h=n.options.manager.getHandler(c.uri);h!==null&&(o=h)}return n.loadTextureImage(e,a.source,o)}},Wh=class{constructor(e){this.parser=e,this.name=et.EXT_TEXTURE_AVIF}loadTexture(e){let t=this.name,n=this.parser,i=n.json,s=i.textures[e];if(!s.extensions||!s.extensions[t])return null;let a=s.extensions[t],c=i.images[a.source],o=n.textureLoader;if(c.uri){let h=n.options.manager.getHandler(c.uri);h!==null&&(o=h)}return n.loadTextureImage(e,a.source,o)}},Oc=class{constructor(e,t){this.name=t,this.parser=e}loadBufferView(e){let t=this.parser.json,n=t.bufferViews[e];if(n.extensions&&n.extensions[this.name]){let i=n.extensions[this.name],s=this.parser.getDependency("buffer",i.buffer),a=this.parser.options.meshoptDecoder;if(!a||!a.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return s.then(function(c){let o=i.byteOffset||0,h=i.byteLength||0,l=i.count,u=i.byteStride,d=new Uint8Array(c,o,h);return a.decodeGltfBufferAsync?a.decodeGltfBufferAsync(l,u,d,i.mode,i.filter).then(function(p){return p.buffer}):a.ready.then(function(){let p=new ArrayBuffer(l*u);return a.decodeGltfBuffer(new Uint8Array(p),l,u,d,i.mode,i.filter),p})})}else return null}},Xh=class{constructor(e){this.name=et.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){let t=this.parser.json,n=t.nodes[e];if(!n.extensions||!n.extensions[this.name]||n.mesh===void 0)return null;let i=t.meshes[n.mesh];for(let h of i.primitives)if(h.mode!==An.TRIANGLES&&h.mode!==An.TRIANGLE_STRIP&&h.mode!==An.TRIANGLE_FAN&&h.mode!==void 0)return null;let a=n.extensions[this.name].attributes,c=[],o={};for(let h in a)c.push(this.parser.getDependency("accessor",a[h]).then(l=>(o[h]=l,o[h])));return c.length<1?null:(c.push(this.parser.createNodeMesh(e)),Promise.all(c).then(h=>{let l=h.pop(),u=l.isGroup?l.children:[l],d=h[0].count,p=[];for(let g of u){let x=new Fe,m=new L,f=new Rt,M=new L(1,1,1),T=new qt(g.geometry,g.material,d);for(let E=0;E<d;E++)o.TRANSLATION&&m.fromBufferAttribute(o.TRANSLATION,E),o.ROTATION&&f.fromBufferAttribute(o.ROTATION,E),o.SCALE&&M.fromBufferAttribute(o.SCALE,E),T.setMatrixAt(E,x.compose(m,f,M));let y=null;for(let E in o)if(E==="_COLOR_0"){let w=o[E];T.instanceColor=new di(w.array,w.itemSize,w.normalized)}else if(E!=="TRANSLATION"&&E!=="ROTATION"&&E!=="SCALE"){if(y===null){let S=T.geometry;y=new xt,y.name=S.name;for(let _ in S.attributes)y.setAttribute(_,S.attributes[_]);for(let _ in S.morphAttributes)y.morphAttributes[_]=S.morphAttributes[_];S.index!==null&&y.setIndex(S.index),y.morphTargetsRelative=S.morphTargetsRelative;for(let _ of S.groups)y.addGroup(_.start,_.count,_.materialIndex);S.boundingBox!==null&&(y.boundingBox=S.boundingBox.clone()),S.boundingSphere!==null&&(y.boundingSphere=S.boundingSphere.clone()),y.drawRange.start=S.drawRange.start,y.drawRange.count=S.drawRange.count,y.userData=Object.assign({},S.userData),T.geometry=y}let w=o[E];y.setAttribute(E,new di(w.array,w.itemSize,w.normalized))}At.prototype.copy.call(T,g),this.parser.assignFinalMaterial(T),p.push(T)}return l.isGroup?(l.clear(),l.add(...p),l):p[0]}))}},Df="glTF",_a=12,If={JSON:1313821514,BIN:5130562},qh=class{constructor(e){this.name=et.KHR_BINARY_GLTF,this.content=null,this.body=null;let t=new DataView(e,0,_a),n=new TextDecoder;if(this.header={magic:n.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==Df)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");let i=this.header.length-_a,s=new DataView(e,_a),a=0;for(;a<i;){let c=s.getUint32(a,!0);a+=4;let o=s.getUint32(a,!0);if(a+=4,o===If.JSON){let h=new Uint8Array(e,_a+a,c);this.content=n.decode(h)}else if(o===If.BIN){let h=_a+a;this.body=e.slice(h,h+c)}a+=c}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}},Yh=class{constructor(e,t){if(!t)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=et.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){let n=this.json,i=this.dracoLoader,s=e.extensions[this.name].bufferView,a=e.extensions[this.name].attributes,c={},o={},h={};for(let l in a){let u=$h[l]||l.toLowerCase();c[u]=a[l]}for(let l in e.attributes){let u=$h[l]||l.toLowerCase();if(a[l]!==void 0){let d=n.accessors[e.attributes[l]],p=fr[d.componentType];h[u]=p.name,o[u]=d.normalized===!0}}return t.getDependency("bufferView",s).then(function(l){return new Promise(function(u,d){i.decodeDracoFile(l,function(p){for(let g in p.attributes){let x=p.attributes[g],m=o[g];m!==void 0&&(x.normalized=m)}u(p)},c,h,en,d)})})}},Zh=class{constructor(){this.name=et.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){if((t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0)return e;if(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),t.rotation!==void 0){let n=Math.cos(e.rotation),i=Math.sin(e.rotation);e.matrix.set(e.repeat.x*n,e.repeat.y*i,e.offset.x,-e.repeat.x*i,e.repeat.y*n,e.offset.y,0,0,1),e.matrixAutoUpdate=!1}return e.needsUpdate=!0,e}},Kh=class{constructor(){this.name=et.KHR_MESH_QUANTIZATION}},Bc=class extends Zn{constructor(e,t,n,i){super(e,t,n,i)}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,s=e*i*3+i;for(let a=0;a!==i;a++)t[a]=n[s+a];return t}interpolate_(e,t,n,i){let s=this.resultBuffer,a=this.sampleValues,c=this.valueSize,o=c*2,h=c*3,l=i-t,u=(n-t)/l,d=u*u,p=d*u,g=e*h,x=g-h,m=-2*p+3*d,f=p-d,M=1-m,T=f-d+u;for(let y=0;y!==c;y++){let E=a[x+y+c],w=a[x+y+o]*l,S=a[g+y+c],_=a[g+y]*l;s[y]=M*E+T*w+m*S+f*_}return s}},My=new Rt,Jh=class extends Bc{interpolate_(e,t,n,i){let s=super.interpolate_(e,t,n,i);return My.fromArray(s).normalize().toArray(s),s}},An={FLOAT:5126,FLOAT_MAT3:35675,FLOAT_MAT4:35676,FLOAT_VEC2:35664,FLOAT_VEC3:35665,FLOAT_VEC4:35666,LINEAR:9729,REPEAT:10497,SAMPLER_2D:35678,POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6,UNSIGNED_BYTE:5121,UNSIGNED_SHORT:5123},fr={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},Pf={9728:Nt,9729:Dt,9984:Ho,9985:sr,9986:ds,9987:On},Lf={33071:bn,33648:Os,10497:Sn},wh={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},$h={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},Xi={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},by={CUBICSPLINE:void 0,LINEAR:ns,STEP:ts},Ah={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function Ey(r){return r.DefaultMaterial===void 0&&(r.DefaultMaterial=new st({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:Jn})),r.DefaultMaterial}function ms(r,e,t){for(let n in t.extensions)r[n]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[n]=t.extensions[n])}function ei(r,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(r.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function Sy(r,e,t){let n=!1,i=!1,s=!1;for(let h=0,l=e.length;h<l;h++){let u=e[h];if(u.POSITION!==void 0&&(n=!0),u.NORMAL!==void 0&&(i=!0),u.COLOR_0!==void 0&&(s=!0),n&&i&&s)break}if(!n&&!i&&!s)return Promise.resolve(r);let a=[],c=[],o=[];for(let h=0,l=e.length;h<l;h++){let u=e[h];if(n){let d=u.POSITION!==void 0?t.getDependency("accessor",u.POSITION):r.attributes.position;a.push(d)}if(i){let d=u.NORMAL!==void 0?t.getDependency("accessor",u.NORMAL):r.attributes.normal;c.push(d)}if(s){let d=u.COLOR_0!==void 0?t.getDependency("accessor",u.COLOR_0):r.attributes.color;o.push(d)}}return Promise.all([Promise.all(a),Promise.all(c),Promise.all(o)]).then(function(h){let l=h[0],u=h[1],d=h[2];return n&&(r.morphAttributes.position=l),i&&(r.morphAttributes.normal=u),s&&(r.morphAttributes.color=d),r.morphTargetsRelative=!0,r})}function Ty(r,e){if(r.updateMorphTargets(),e.weights!==void 0)for(let t=0,n=e.weights.length;t<n;t++)r.morphTargetInfluences[t]=e.weights[t];if(e.extras&&Array.isArray(e.extras.targetNames)){let t=e.extras.targetNames;if(r.morphTargetInfluences.length===t.length){r.morphTargetDictionary={};for(let n=0,i=t.length;n<i;n++)r.morphTargetDictionary[t[n]]=n}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function wy(r){let e,t=r.extensions&&r.extensions[et.KHR_DRACO_MESH_COMPRESSION];if(t?e="draco:"+t.bufferView+":"+t.indices+":"+Rh(t.attributes):e=r.indices+":"+Rh(r.attributes)+":"+r.mode,r.targets!==void 0)for(let n=0,i=r.targets.length;n<i;n++)e+=":"+Rh(r.targets[n]);return e}function Rh(r){let e="",t=Object.keys(r).sort();for(let n=0,i=t.length;n<i;n++)e+=t[n]+":"+r[t[n]]+";";return e}function jh(r){switch(r){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function Ay(r){return r.search(/\.jpe?g($|\?)/i)>0||r.search(/^data\:image\/jpeg/)===0?"image/jpeg":r.search(/\.webp($|\?)/i)>0||r.search(/^data\:image\/webp/)===0?"image/webp":r.search(/\.ktx2($|\?)/i)>0||r.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}var Ry=new Fe,Qh=class{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new vy,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let n=!1,i=-1,s=!1,a=-1;if(typeof navigator<"u"&&typeof navigator.userAgent<"u"){let c=navigator.userAgent;n=/^((?!chrome|android).)*safari/i.test(c)===!0;let o=c.match(/Version\/(\d+)/);i=n&&o?parseInt(o[1],10):-1,s=c.indexOf("Firefox")>-1,a=s?c.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||n&&i<17||s&&a<98?this.textureLoader=new Bi(this.options.manager):this.textureLoader=new na(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new Qs(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials"&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){let n=this,i=this.json,s=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(a){return a._markDefs&&a._markDefs()}),Promise.all(this._invokeAll(function(a){return a.beforeRoot&&a.beforeRoot()})).then(function(){return Promise.all([n.getDependencies("scene"),n.getDependencies("animation"),n.getDependencies("camera")])}).then(function(a){let c={scene:a[0][i.scene||0],scenes:a[0],animations:a[1],cameras:a[2],asset:i.asset,parser:n,userData:{}};return ms(s,c,i),ei(c,i),Promise.all(n._invokeAll(function(o){return o.afterRoot&&o.afterRoot(c)})).then(function(){for(let o of c.scenes)o.updateMatrixWorld();e(c)})}).catch(t)}_markDefs(){let e=this.json.nodes||[],t=this.json.skins||[],n=this.json.meshes||[];for(let i=0,s=t.length;i<s;i++){let a=t[i].joints;for(let c=0,o=a.length;c<o;c++)e[a[c]].isBone=!0}for(let i=0,s=e.length;i<s;i++){let a=e[i];a.mesh!==void 0&&(this._addNodeRef(this.meshCache,a.mesh),a.skin!==void 0&&(n[a.mesh].isSkinnedMesh=!0)),a.camera!==void 0&&this._addNodeRef(this.cameraCache,a.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,n){if(e.refs[t]<=1)return n;let i=n.clone(),s=(a,c)=>{let o=this.associations.get(a);o!=null&&this.associations.set(c,o);for(let[h,l]of a.children.entries())s(l,c.children[h])};return s(n,i),i.name+="_instance_"+e.uses[t]++,i}_invokeOne(e){let t=Object.values(this.plugins);t.push(this);for(let n=0;n<t.length;n++){let i=e(t[n]);if(i)return i}return null}_invokeAll(e){let t=Object.values(this.plugins);t.unshift(this);let n=[];for(let i=0;i<t.length;i++){let s=e(t[i]);s&&n.push(s)}return n}getDependency(e,t){let n=e+":"+t,i=this.cache.get(n);if(!i){switch(e){case"scene":i=this.loadScene(t);break;case"node":i=this._invokeOne(function(s){return s.loadNode&&s.loadNode(t)});break;case"mesh":i=this._invokeOne(function(s){return s.loadMesh&&s.loadMesh(t)});break;case"accessor":i=this.loadAccessor(t);break;case"bufferView":i=this._invokeOne(function(s){return s.loadBufferView&&s.loadBufferView(t)});break;case"buffer":i=this.loadBuffer(t);break;case"material":i=this._invokeOne(function(s){return s.loadMaterial&&s.loadMaterial(t)});break;case"texture":i=this._invokeOne(function(s){return s.loadTexture&&s.loadTexture(t)});break;case"skin":i=this.loadSkin(t);break;case"animation":i=this._invokeOne(function(s){return s.loadAnimation&&s.loadAnimation(t)});break;case"camera":i=this.loadCamera(t);break;default:if(i=this._invokeOne(function(s){return s!=this&&s.getDependency&&s.getDependency(e,t)}),!i)throw new Error("Unknown type: "+e);break}this.cache.add(n,i)}return i}getDependencies(e){let t=this.cache.get(e);if(!t){let n=this,i=this.json[e+(e==="mesh"?"es":"s")]||[];t=Promise.all(i.map(function(s,a){return n.getDependency(e,a)})),this.cache.add(e,t)}return t}loadBuffer(e){let t=this.json.buffers[e],n=this.fileLoader;if(t.type&&t.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[et.KHR_BINARY_GLTF].body);let i=this.options;return new Promise(function(s,a){n.load(_i.resolveURL(t.uri,i.path),s,void 0,function(){a(new Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))})})}loadBufferView(e){let t=this.json.bufferViews[e];return this.getDependency("buffer",t.buffer).then(function(n){let i=t.byteLength||0,s=t.byteOffset||0;return n.slice(s,s+i)})}loadAccessor(e){let t=this,n=this.json,i=this.json.accessors[e];if(i.bufferView===void 0&&i.sparse===void 0){let a=wh[i.type],c=fr[i.componentType],o=i.normalized===!0,h=new c(i.count*a);return Promise.resolve(new Pt(h,a,o))}let s=[];return i.bufferView!==void 0?s.push(this.getDependency("bufferView",i.bufferView)):s.push(null),i.sparse!==void 0&&(s.push(this.getDependency("bufferView",i.sparse.indices.bufferView)),s.push(this.getDependency("bufferView",i.sparse.values.bufferView))),Promise.all(s).then(function(a){let c=a[0],o=wh[i.type],h=fr[i.componentType],l=h.BYTES_PER_ELEMENT,u=l*o,d=i.byteOffset||0,p=i.bufferView!==void 0?n.bufferViews[i.bufferView].byteStride:void 0,g=i.normalized===!0,x,m;if(p&&p!==u){let f=Math.floor(d/p),M="InterleavedBuffer:"+i.bufferView+":"+i.componentType+":"+f+":"+i.count,T=t.cache.get(M);T||(x=new h(c,f*p,i.count*p/l),T=new ss(x,p/l),t.cache.add(M,T)),m=new Li(T,o,d%p/l,g)}else c===null?x=new h(i.count*o):x=new h(c,d,i.count*o),m=new Pt(x,o,g);if(i.sparse!==void 0){let f=wh.SCALAR,M=fr[i.sparse.indices.componentType],T=i.sparse.indices.byteOffset||0,y=i.sparse.values.byteOffset||0,E=new M(a[1],T,i.sparse.count*f),w=new h(a[2],y,i.sparse.count*o);c!==null&&(m=new Pt(m.array.slice(),m.itemSize,m.normalized)),m.normalized=!1;for(let S=0,_=E.length;S<_;S++){let v=E[S];if(m.setX(v,w[S*o]),o>=2&&m.setY(v,w[S*o+1]),o>=3&&m.setZ(v,w[S*o+2]),o>=4&&m.setW(v,w[S*o+3]),o>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}m.normalized=g}return m})}loadTexture(e){let t=this.json,n=this.options,s=t.textures[e].source,a=t.images[s],c=this.textureLoader;if(a.uri){let o=n.manager.getHandler(a.uri);o!==null&&(c=o)}return this.loadTextureImage(e,s,c)}loadTextureImage(e,t,n){let i=this,s=this.json,a=s.textures[e],c=s.images[t],o=(c.uri||c.bufferView)+":"+a.sampler;if(this.textureCache[o])return this.textureCache[o];let h=this.loadImageSource(t,n).then(function(l){l.flipY=!1,l.name=a.name||c.name||"",l.name===""&&typeof c.uri=="string"&&c.uri.startsWith("data:image/")===!1&&(l.name=c.uri);let d=(s.samplers||{})[a.sampler]||{};return l.magFilter=Pf[d.magFilter]||Dt,l.minFilter=Pf[d.minFilter]||On,l.wrapS=Lf[d.wrapS]||Sn,l.wrapT=Lf[d.wrapT]||Sn,l.generateMipmaps=!l.isCompressedTexture&&l.minFilter!==Nt&&l.minFilter!==Dt,i.associations.set(l,{textures:e}),l}).catch(function(){return null});return this.textureCache[o]=h,h}loadImageSource(e,t){let n=this,i=this.json,s=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(u=>u.clone());let a=i.images[e],c=self.URL||self.webkitURL,o=a.uri||"",h=!1;if(a.bufferView!==void 0)o=n.getDependency("bufferView",a.bufferView).then(function(u){h=!0;let d=new Blob([u],{type:a.mimeType});return o=c.createObjectURL(d),o});else if(a.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");let l=Promise.resolve(o).then(function(u){return new Promise(function(d,p){let g=d;t.isImageBitmapLoader===!0&&(g=function(x){let m=new Ht(x);m.needsUpdate=!0,d(m)}),t.load(_i.resolveURL(u,s.path),g,void 0,p)})}).then(function(u){return h===!0&&c.revokeObjectURL(o),ei(u,a),u.userData.mimeType=a.mimeType||Ay(a.uri),u}).catch(function(u){throw console.error("THREE.GLTFLoader: Couldn't load texture",o),u});return this.sourceCache[e]=l,l}assignTexture(e,t,n,i){let s=this;return this.getDependency("texture",n.index).then(function(a){if(!a)return null;if(n.texCoord!==void 0&&n.texCoord>0&&(a=a.clone(),a.channel=n.texCoord),s.extensions[et.KHR_TEXTURE_TRANSFORM]){let c=n.extensions!==void 0?n.extensions[et.KHR_TEXTURE_TRANSFORM]:void 0;if(c){let o=s.associations.get(a);a=s.extensions[et.KHR_TEXTURE_TRANSFORM].extendTexture(a,c),s.associations.set(a,o)}}return i!==void 0&&(a.colorSpace=i),e[t]=a,a})}assignFinalMaterial(e){let t=e.geometry,n=e.material,i=t.attributes.tangent===void 0,s=t.attributes.color!==void 0,a=t.attributes.normal===void 0;if(e.isPoints){let c="PointsMaterial:"+n.uuid,o=this.cache.get(c);o||(o=new fi,nn.prototype.copy.call(o,n),o.color.copy(n.color),o.map=n.map,o.sizeAttenuation=!1,this.cache.add(c,o)),n=o}else if(e.isLine){let c="LineBasicMaterial:"+n.uuid,o=this.cache.get(c);o||(o=new Zs,nn.prototype.copy.call(o,n),o.color.copy(n.color),o.map=n.map,this.cache.add(c,o)),n=o}if(i||s||a){let c="ClonedMaterial:"+n.uuid+":";i&&(c+="derivative-tangents:"),s&&(c+="vertex-colors:"),a&&(c+="flat-shading:");let o=this.cache.get(c);o||(o=n.clone(),s&&(o.vertexColors=!0),a&&(o.flatShading=!0),i&&(o.normalScale&&(o.normalScale.y*=-1),o.clearcoatNormalScale&&(o.clearcoatNormalScale.y*=-1)),this.cache.add(c,o),this.associations.set(o,this.associations.get(n))),n=o}e.material=n}getMaterialType(){return st}loadMaterial(e){let t=this,n=this.json,i=this.extensions,s=n.materials[e],a,c={},o=s.extensions||{},h=[];if(o[et.KHR_MATERIALS_UNLIT]){let u=i[et.KHR_MATERIALS_UNLIT];a=u.getMaterialType(),h.push(u.extendParams(c,s,t))}else{let u=s.pbrMetallicRoughness||{};if(c.color=new Ae(1,1,1),c.opacity=1,Array.isArray(u.baseColorFactor)){let d=u.baseColorFactor;c.color.setRGB(d[0],d[1],d[2],en),c.opacity=d[3]}u.baseColorTexture!==void 0&&h.push(t.assignTexture(c,"map",u.baseColorTexture,mt)),c.metalness=u.metallicFactor!==void 0?u.metallicFactor:1,c.roughness=u.roughnessFactor!==void 0?u.roughnessFactor:1,u.metallicRoughnessTexture!==void 0&&(h.push(t.assignTexture(c,"metalnessMap",u.metallicRoughnessTexture)),h.push(t.assignTexture(c,"roughnessMap",u.metallicRoughnessTexture))),a=this._invokeOne(function(d){return d.getMaterialType&&d.getMaterialType(e)}),h.push(Promise.all(this._invokeAll(function(d){return d.extendMaterialParams&&d.extendMaterialParams(e,c)})))}s.doubleSided===!0&&(c.side=Ct);let l=s.alphaMode||Ah.OPAQUE;if(l===Ah.BLEND?(c.transparent=!0,c.depthWrite=!1):(c.transparent=!1,l===Ah.MASK&&(c.alphaTest=s.alphaCutoff!==void 0?s.alphaCutoff:.5)),s.normalTexture!==void 0&&a!==ot&&(h.push(t.assignTexture(c,"normalMap",s.normalTexture)),c.normalScale=new ae(1,1),s.normalTexture.scale!==void 0)){let u=s.normalTexture.scale;c.normalScale.set(u,u)}if(s.occlusionTexture!==void 0&&a!==ot&&(h.push(t.assignTexture(c,"aoMap",s.occlusionTexture)),s.occlusionTexture.strength!==void 0&&(c.aoMapIntensity=s.occlusionTexture.strength)),s.emissiveFactor!==void 0&&a!==ot){let u=s.emissiveFactor;c.emissive=new Ae().setRGB(u[0],u[1],u[2],en)}return s.emissiveTexture!==void 0&&a!==ot&&h.push(t.assignTexture(c,"emissiveMap",s.emissiveTexture,mt)),Promise.all(h).then(function(){let u=new a(c);return s.name&&(u.name=s.name),ei(u,s),t.associations.set(u,{materials:e}),s.extensions&&ms(i,u,s),u})}createUniqueName(e){let t=Mt.sanitizeNodeName(e||"");return t in this.nodeNamesUsed?t+"_"+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){let t=this,n=this.extensions,i=this.primitiveCache;function s(c){return n[et.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(c,t).then(function(o){return Nf(o,c,t)})}let a=[];for(let c=0,o=e.length;c<o;c++){let h=e[c],l=wy(h),u=i[l];if(u)a.push(u.promise);else{let d;h.extensions&&h.extensions[et.KHR_DRACO_MESH_COMPRESSION]?d=s(h):d=Nf(new xt,h,t),h.mode===An.TRIANGLE_STRIP?d=d.then(p=>Th(p,pa)):h.mode===An.TRIANGLE_FAN&&(d=d.then(p=>Th(p,or))),i[l]={primitive:h,promise:d},a.push(d)}}return Promise.all(a)}loadMesh(e){let t=this,n=this.json,i=this.extensions,s=n.meshes[e],a=s.primitives,c=[];for(let o=0,h=a.length;o<h;o++){let l=a[o].material===void 0?Ey(this.cache):this.getDependency("material",a[o].material);c.push(l)}return c.push(t.loadGeometries(a)),Promise.all(c).then(async function(o){let h=o.slice(0,o.length-1),l=o[o.length-1],u=[];for(let p=0,g=l.length;p<g;p++){let x=l[p],m=a[p],f,M=h[p];if(m.mode===An.TRIANGLES||m.mode===An.TRIANGLE_STRIP||m.mode===An.TRIANGLE_FAN||m.mode===void 0){let T=s.isSkinnedMesh===!0,y=x.hasAttribute("skinIndex")&&x.hasAttribute("skinWeight");T&&y===!1&&console.warn("THREE.GLTFLoader: Missing skinIndex or skinWeight attributes. Skinning disabled."),f=T&&y?new Or(x,M):new J(x,M),f.isSkinnedMesh===!0&&f.normalizeSkinWeights()}else if(m.mode===An.LINES)f=new Hr(x,M);else if(m.mode===An.LINE_STRIP)f=new rs(x,M);else if(m.mode===An.LINE_LOOP)f=new kr(x,M);else if(m.mode===An.POINTS)f=new Di(x,M);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+m.mode);Object.keys(f.geometry.morphAttributes).length>0&&Ty(f,s),f.name=t.createUniqueName(s.name||"mesh_"+e),ei(f,s),m.extensions&&ms(i,f,m),t.assignFinalMaterial(f),u.push(f)}for(let p=0,g=u.length;p<g;p++)t.associations.set(u[p],{meshes:e,primitives:p});if(u.length===1)return s.extensions&&ms(i,u[0],s),u[0];let d=new Je;s.extensions&&ms(i,d,s),t.associations.set(d,{meshes:e});for(let p=0,g=u.length;p<g;p++)d.add(u[p]);return d})}loadCamera(e){let t,n=this.json.cameras[e],i=n[n.type];if(!i){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return n.type==="perspective"?t=new Ot(sh.radToDeg(i.yfov),i.aspectRatio||1,i.znear||1,i.zfar||2e6):n.type==="orthographic"&&(t=new ki(-i.xmag,i.xmag,i.ymag,-i.ymag,i.znear,i.zfar)),n.name&&(t.name=this.createUniqueName(n.name)),ei(t,n),Promise.resolve(t)}loadSkin(e){let t=this.json.skins[e],n=[];for(let i=0,s=t.joints.length;i<s;i++)n.push(this._loadNodeShallow(t.joints[i]));return t.inverseBindMatrices!==void 0?n.push(this.getDependency("accessor",t.inverseBindMatrices)):n.push(null),Promise.all(n).then(function(i){let s=i.pop(),a=i,c=[],o=[];for(let h=0,l=a.length;h<l;h++){let u=a[h];if(u){c.push(u);let d=new Fe;s!==null&&d.fromArray(s.array,h*16),o.push(d)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[h])}return new Br(c,o)})}loadAnimation(e){let t=this.json,n=this,i=t.animations[e],s=i.name?i.name:"animation_"+e,a=[],c=[],o=[],h=[],l=[];for(let u=0,d=i.channels.length;u<d;u++){let p=i.channels[u],g=i.samplers[p.sampler],x=p.target,m=x.node,f=i.parameters!==void 0?i.parameters[g.input]:g.input,M=i.parameters!==void 0?i.parameters[g.output]:g.output;x.node!==void 0&&(a.push(this.getDependency("node",m)),c.push(this.getDependency("accessor",f)),o.push(this.getDependency("accessor",M)),h.push(g),l.push(x))}return Promise.all([Promise.all(a),Promise.all(c),Promise.all(o),Promise.all(h),Promise.all(l)]).then(function(u){let d=u[0],p=u[1],g=u[2],x=u[3],m=u[4],f=[];for(let T=0,y=d.length;T<y;T++){let E=d[T],w=p[T],S=g[T],_=x[T],v=m[T];if(E===void 0)continue;E.updateMatrix&&E.updateMatrix();let R=n._createAnimationTracks(E,w,S,_,v);if(R)for(let C=0;C<R.length;C++)f.push(R[C])}let M=new cs(s,void 0,f);return ei(M,i),M})}createNodeMesh(e){let t=this.json,n=this,i=t.nodes[e];return i.mesh===void 0?null:n.getDependency("mesh",i.mesh).then(function(s){let a=n._getNodeRef(n.meshCache,i.mesh,s);return i.weights!==void 0&&a.traverse(function(c){if(c.isMesh)for(let o=0,h=i.weights.length;o<h;o++)c.morphTargetInfluences[o]=i.weights[o]}),a})}loadNode(e){let t=this.json,n=this,i=t.nodes[e],s=n._loadNodeShallow(e),a=[],c=i.children||[];for(let h=0,l=c.length;h<l;h++)a.push(n.getDependency("node",c[h]));let o=i.skin===void 0?Promise.resolve(null):n.getDependency("skin",i.skin);return Promise.all([s,Promise.all(a),o]).then(function(h){let l=h[0],u=h[1],d=h[2];d!==null&&l.traverse(function(p){p.isSkinnedMesh&&p.bind(d,Ry)});for(let p=0,g=u.length;p<g;p++)l.add(u[p]);if(l.userData.pivot!==void 0&&u.length>0){let p=l.userData.pivot,g=u[0];l.pivot=new L().fromArray(p),l.position.x-=p[0],l.position.y-=p[1],l.position.z-=p[2],g.position.set(0,0,0),delete l.userData.pivot}return l})}_loadNodeShallow(e){let t=this.json,n=this.extensions,i=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];let s=t.nodes[e],a=s.name?i.createUniqueName(s.name):"",c=[],o=i._invokeOne(function(h){return h.createNodeMesh&&h.createNodeMesh(e)});return o&&c.push(o),s.camera!==void 0&&c.push(i.getDependency("camera",s.camera).then(function(h){return i._getNodeRef(i.cameraCache,s.camera,h)})),i._invokeAll(function(h){return h.createNodeAttachment&&h.createNodeAttachment(e)}).forEach(function(h){c.push(h)}),this.nodeCache[e]=Promise.all(c).then(function(h){let l;if(s.isBone===!0?l=new Xs:h.length>1?l=new Je:h.length===1?l=h[0]:l=new At,l!==h[0])for(let u=0,d=h.length;u<d;u++)l.add(h[u]);if(s.name&&(l.userData.name=s.name,l.name=a),ei(l,s),s.extensions&&ms(n,l,s),s.matrix!==void 0){let u=new Fe;u.fromArray(s.matrix),l.applyMatrix4(u)}else s.translation!==void 0&&l.position.fromArray(s.translation),s.rotation!==void 0&&l.quaternion.fromArray(s.rotation),s.scale!==void 0&&l.scale.fromArray(s.scale);if(!i.associations.has(l))i.associations.set(l,{});else if(s.mesh!==void 0&&i.meshCache.refs[s.mesh]>1){let u=i.associations.get(l);i.associations.set(l,{...u})}return i.associations.get(l).nodes=e,l}),this.nodeCache[e]}loadScene(e){let t=this.extensions,n=this.json.scenes[e],i=this,s=new Je;n.name&&(s.name=i.createUniqueName(n.name)),ei(s,n),n.extensions&&ms(t,s,n);let a=n.nodes||[],c=[];for(let o=0,h=a.length;o<h;o++)c.push(i.getDependency("node",a[o]));return Promise.all(c).then(function(o){for(let l=0,u=o.length;l<u;l++){let d=o[l];d.parent!==null?s.add(zc(d)):s.add(d)}let h=l=>{let u=new Map;for(let[d,p]of i.associations)(d instanceof nn||d instanceof Ht)&&u.set(d,p);return l.traverse(d=>{let p=i.associations.get(d);p!=null&&u.set(d,p)}),u};return i.associations=h(s),s})}_createAnimationTracks(e,t,n,i,s){let a=[],c=e.name?e.name:e.uuid,o=[];function h(p){p.morphTargetInfluences&&o.push(p.name?p.name:p.uuid)}Xi[s.path]===Xi.weights?(h(e),e.isGroup&&e.children.forEach(h)):o.push(c);let l;switch(Xi[s.path]){case Xi.weights:l=mi;break;case Xi.rotation:l=gi;break;case Xi.translation:case Xi.scale:l=Oi;break;default:switch(n.itemSize){case 1:l=mi;break;case 2:case 3:default:l=Oi;break}break}let u=i.interpolation!==void 0?by[i.interpolation]:ns,d=this._getArrayFromAccessor(n);for(let p=0,g=o.length;p<g;p++){let x=new l(o[p]+"."+Xi[s.path],t.array,d,u);i.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(x),a.push(x)}return a}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){let n=jh(t.constructor),i=new Float32Array(t.length);for(let s=0,a=t.length;s<a;s++)i[s]=t[s]*n;t=i}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(n){let i=this instanceof gi?Jh:Bc;return new i(this.times,this.values,this.getValueSize()/3,n)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}};function Cy(r,e,t){let n=e.attributes,i=new tn;if(n.POSITION!==void 0){let c=t.json.accessors[n.POSITION],o=c.min,h=c.max;if(o!==void 0&&h!==void 0){if(i.set(new L(o[0],o[1],o[2]),new L(h[0],h[1],h[2])),c.normalized){let l=jh(fr[c.componentType]);i.min.multiplyScalar(l),i.max.multiplyScalar(l)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;let s=e.targets;if(s!==void 0){let c=new L,o=new L;for(let h=0,l=s.length;h<l;h++){let u=s[h];if(u.POSITION!==void 0){let d=t.json.accessors[u.POSITION],p=d.min,g=d.max;if(p!==void 0&&g!==void 0){if(o.setX(Math.max(Math.abs(p[0]),Math.abs(g[0]))),o.setY(Math.max(Math.abs(p[1]),Math.abs(g[1]))),o.setZ(Math.max(Math.abs(p[2]),Math.abs(g[2]))),d.normalized){let x=jh(fr[d.componentType]);o.multiplyScalar(x)}c.max(o)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}i.expandByVector(c)}r.boundingBox=i;let a=new on;i.getCenter(a.center),a.radius=i.min.distanceTo(i.max)/2,r.boundingSphere=a}function Nf(r,e,t){let n=e.attributes,i=[];function s(a,c){return t.getDependency("accessor",a).then(function(o){r.setAttribute(c,o)})}for(let a in n){let c=$h[a]||a.toLowerCase();c in r.attributes||i.push(s(n[a],c))}if(e.indices!==void 0&&!r.index){let a=t.getDependency("accessor",e.indices).then(function(c){r.setIndex(c)});i.push(a)}return je.workingColorSpace!==en&&"COLOR_0"in n&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${je.workingColorSpace}" not supported.`),ei(r,e),Cy(r,e,t),Promise.all(i).then(function(){return e.targets!==void 0?Sy(r,e.targets,t):r})}var Hc=class{ctx=null;master;sfx;musicGain;noise;voices=0;music;amb;windG;last=new Map;muted=!1;unlock(){if(this.ctx){this.ctx.state==="suspended"&&this.ctx.resume();return}let e=window.AudioContext||window.webkitAudioContext;if(!e)return;let t=this.ctx=new e;this.master=t.createGain(),this.master.gain.value=.9,this.master.connect(t.destination);let n=t.createDynamicsCompressor();n.threshold.value=-14,n.ratio.value=4,n.connect(this.master),this.sfx=t.createGain(),this.sfx.gain.value=.8,this.sfx.connect(n),this.musicGain=t.createGain(),this.musicGain.gain.value=.35,this.musicGain.connect(this.master);let i=t.sampleRate*2,s=t.createBuffer(1,i,t.sampleRate),a=s.getChannelData(0);for(let c=0;c<i;c++)a[c]=Math.random()*2-1;this.noise=s}get ready(){return!!this.ctx&&!this.muted}ambience(e){if(!this.ctx||this.amb)return;let t=this.ctx,n=t.createBufferSource();n.buffer=this.noise,n.loop=!0;let i=t.createBiquadFilter();i.type="lowpass",i.frequency.value=e==="cliffs"?700:e==="graveyard"?380:220,i.Q.value=.7;let s=t.createGain();s.gain.value=e==="cliffs"?.06:.045,n.connect(i).connect(s).connect(this.sfx),n.start(),this.amb={src:n,g:s,f:i};let a=t.createBufferSource();a.buffer=this.noise,a.loop=!0;let c=t.createBiquadFilter();c.type="bandpass",c.frequency.value=900,c.Q.value=.6,this.windG=t.createGain(),this.windG.gain.value=0,a.connect(c).connect(this.windG).connect(this.sfx),a.start()}tickAmbience(e,t){!this.ctx||!this.amb||(this.amb.f.frequency.value=300+260*(.5+.5*Math.sin(e*.23)),this.windG.gain.setTargetAtTime(t*.22,this.ctx.currentTime,.15))}playMusic(e){if(this.music)return;let t=new Audio(e);t.loop=!0,t.volume=.28,this.music=t,t.play().catch(()=>{})}setMuted(e){this.muted=e,this.master&&(this.master.gain.value=e?0:.9),this.music&&(this.music.muted=e)}voiceEl;voice(e){if(this.voiceEl?.pause(),this.muted||!e)return;let t=new Audio(e);t.volume=1,this.voiceEl=t,this.music&&(this.music.volume=.1),t.onended=()=>{this.music&&(this.music.volume=.28)},t.play().catch(()=>{})}can(e,t){let n=performance.now(),i=this.last.get(e)??0;return n-i<t||this.voices>14?!1:(this.last.set(e,n),!0)}env(e,t,n,i){let s=this.ctx.currentTime;e.gain.setValueAtTime(0,s),e.gain.linearRampToValueAtTime(n,s+t),e.gain.exponentialRampToValueAtTime(1e-4,s+t+i)}tone(e,t,n,i,s=0,a=0){let c=this.ctx,o=c.createOscillator(),h=c.createGain();o.type=t,o.frequency.setValueAtTime(e,c.currentTime+a),s&&o.frequency.exponentialRampToValueAtTime(Math.max(20,e*s),c.currentTime+a+n),h.gain.setValueAtTime(0,c.currentTime+a),h.gain.linearRampToValueAtTime(i,c.currentTime+a+.008),h.gain.exponentialRampToValueAtTime(1e-4,c.currentTime+a+n),o.connect(h).connect(this.sfx),o.start(c.currentTime+a),o.stop(c.currentTime+a+n+.05),this.voices++,o.onended=()=>this.voices--}burst(e,t,n,i,s=i,a=1,c=0){let o=this.ctx,h=o.createBufferSource();h.buffer=this.noise;let l=o.createBiquadFilter();l.type=n,l.Q.value=a;let u=o.currentTime+c;l.frequency.setValueAtTime(i,u),l.frequency.exponentialRampToValueAtTime(Math.max(30,s),u+e);let d=o.createGain();d.gain.setValueAtTime(0,u),d.gain.linearRampToValueAtTime(t,u+.006),d.gain.exponentialRampToValueAtTime(1e-4,u+e),h.connect(l).connect(d).connect(this.sfx),h.start(u,Math.random()),h.stop(u+e+.05),this.voices++,h.onended=()=>this.voices--}att(e){return Math.max(0,1-e/28)**1.5}jump(){!this.ready||!this.can("jump",90)||(this.tone(260,"triangle",.16,.16,2.1),this.burst(.12,.08,"highpass",2500,4e3))}land(e){if(!this.ready||!this.can("land",80))return;let t=Math.min(1,.3+e*.7);this.burst(.18,.35*t,"lowpass",500,120),this.tone(90,"sine",.14,.25*t,.6)}step(e){if(!this.ready||!this.can("step",140))return;let t=e==="plank"||e==="floor"||e==="dark"?1400:e==="grass"||e==="mud"?700:1800;this.burst(.05,.05,"bandpass",t,t*.7,2)}hit(e){let t=this.att(e);!this.ready||t<.05||!this.can("hit",120)||(this.burst(.3,.55*t,"lowpass",900,90),this.tone(70,"sine",.3,.45*t,.5),this.tone(520,"square",.06,.05*t,.5))}thud(e,t=1){let n=this.att(e);!this.ready||n<.05||!this.can("thud"+Math.round(e),60)||(this.burst(.45*t,.6*n,"lowpass",300,40),this.tone(48,"sine",.5,.55*n,.55))}roll(e){let t=this.att(e);!this.ready||t<.05||!this.can("roll",220)||this.burst(.35,.18*t,"lowpass",220,120,3)}whoosh(e){let t=this.att(e);!this.ready||t<.08||!this.can("whoosh",260)||this.burst(.32,.2*t,"bandpass",500,1500,1.5)}fire(e){let t=this.att(e);!this.ready||t<.05||!this.can("fire",200)||(this.burst(.6,.28*t,"lowpass",1800,300,.8),this.burst(.4,.12*t,"highpass",3e3,6e3))}metal(e){let t=this.att(e);if(!(!this.ready||t<.05||!this.can("metal",150))){for(let n of[310,467,721])this.tone(n,"triangle",.5,.07*t,.98);this.burst(.12,.3*t,"bandpass",2500,1200,3)}}alarm(e){let t=this.att(e);!this.ready||t<.05||!this.can("alarm",420)||(this.tone(880,"square",.1,.06*t),this.tone(660,"square",.1,.06*t,1,.14))}chain(e){let t=this.att(e);if(!(!this.ready||t<.05||!this.can("chain",200)))for(let n=0;n<6;n++)this.burst(.04,.12*t,"bandpass",3500+Math.random()*2e3,3e3,4,n*.035)}spring(){!this.ready||!this.can("spring",150)||(this.tone(180,"sine",.35,.3,3.2),this.tone(360,"triangle",.2,.1,2.5))}portal(){if(!(!this.ready||!this.can("portal",300))){for(let e=0;e<5;e++)this.tone(400+e*180,"sine",.25,.08,1.6,e*.04);this.burst(.5,.15,"bandpass",600,3e3,2)}}crumble(e){let t=this.att(e);if(!(!this.ready||t<.05||!this.can("crumble",120)))for(let n=0;n<4;n++)this.burst(.09,.2*t,"bandpass",900+Math.random()*1500,400,2,n*.05)}splash(){!this.ready||!this.can("fall",500)||(this.burst(.9,.3,"lowpass",2e3,200),this.tone(500,"sine",.7,.12,.25))}checkpoint(){this.ready&&[659,784,988,1319].forEach((e,t)=>this.tone(e,"triangle",.35,.12,1,t*.08))}countdown(e){this.ready&&(e?[523,659,784].forEach((t,n)=>this.tone(t,"square",.45,.09,1,n*.03)):this.tone(440,"square",.18,.09))}finish(e){if(!this.ready)return;(e?[523,659,784,1047,1319]:[392,330,262]).forEach((n,i)=>this.tone(n,"triangle",.6,.13,1,i*.12)),e&&this.burst(1.6,.1,"highpass",4e3,8e3)}};var Iy=["plank","dark"];var ti=(r,e,t)=>r<e?e:r>t?t:r,_n=(r,e,t=(r.x0+r.x1)/2+r.offX)=>{let n=r.z1===r.z0?0:ti((e-r.z0)/(r.z1-r.z0),0,1);return r.y0+(r.y1-r.y0)*n+r.offY+r.tiltX*(t-(r.x0+r.x1)/2-r.offX)+r.tiltZ*(e-(r.z0+r.z1)/2)},ya=class{constructor(e,t,n,i,s){this.id=e;this.name=t;this.character=n;this.slot=i;this.bot=s}x=0;y=0;z=0;vx=0;vy=0;vz=0;inX=0;inZ=0;facing=0;stun=0;coyote=0;jumpBuffer=0;progress=0;finishTime=0;jump=!1;holdJump=!1;finished=!1;checkpoint=0;falls=0;ground=null;botCool=0;landed=0;hook=-1;wind=0},Py={cliffs:{main:"grass",alt:"stone",thin:"plank",land:"grass",crumble:"stone"},graveyard:{main:"cobble",alt:"brick",thin:"dark",land:"mud",crumble:"mud"},manor:{main:"floor",alt:"flag",thin:"floor",land:"flag",crumble:"floor"},crypt:{main:"flag",alt:"flag",thin:"floor",land:"flag",crumble:"flag"}},zf={gears:"\u0413\u0438\u0433\u0430\u043D\u0442\u0441\u043A\u0438\u0435 \u0448\u0435\u0441\u0442\u0435\u0440\u043D\u0438",gates:"\u0421\u043C\u0435\u0440\u0442\u0435\u043B\u044C\u043D\u044B\u0435 \u0432\u043E\u0440\u043E\u0442\u0430",wind:"\u0412\u0435\u0442\u0440\u044F\u043D\u043E\u0439 \u043A\u043E\u0440\u0438\u0434\u043E\u0440",chase:"\u041A\u0430\u0442\u044F\u0449\u0438\u0439\u0441\u044F \u0432\u0430\u043B\u0443\u043D",tilt:"\u041F\u0435\u0440\u0435\u0432\u043E\u0440\u0430\u0447\u0438\u0432\u0430\u044E\u0449\u0430\u044F\u0441\u044F \u043A\u043E\u043C\u043D\u0430\u0442\u0430",hooks:"\u041A\u0440\u044E\u043A\u0438",falsebridge:"\u041B\u043E\u0436\u043D\u044B\u0439 \u043C\u043E\u0441\u0442",minecarts:"\u0411\u0435\u0437\u0443\u043C\u043D\u044B\u0435 \u0432\u0430\u0433\u043E\u043D\u0435\u0442\u043A\u0438",spinner:"\u041C\u0435\u043B\u044C\u043D\u0438\u0446\u0430",gaps:"\u041F\u0440\u043E\u0432\u0430\u043B\u044B",pendulums:"\u041C\u0430\u044F\u0442\u043D\u0438\u043A\u0438",rafts:"\u041F\u043B\u043E\u0442\u044B",crumble:"\u041E\u0431\u0432\u0430\u043B \u043F\u043E\u043B\u0430",sink:"\u0422\u0440\u044F\u0441\u0438\u043D\u0430",pushers:"\u0422\u0430\u0440\u0430\u043D\u044B",pads:"\u0411\u0430\u0442\u0443\u0442\u044B",traps:"\u041B\u044E\u043A\u0438",conveyor:"\u0422\u0440\u0430\u043D\u0441\u043F\u043E\u0440\u0442\u0451\u0440",flames:"\u041E\u0433\u043D\u0435\u043D\u043D\u044B\u0439 \u043F\u043E\u043B",gauntlet:"\u041C\u044F\u0441\u043E\u0440\u0443\u0431\u043A\u0430",highlow:"\u0412\u0435\u0440\u0445-\u043D\u0438\u0437",hammers:"\u041C\u043E\u043B\u043E\u0442\u044B",beams:"\u0423\u0437\u043A\u0438\u0435 \u0431\u0430\u043B\u043A\u0438",zigzag:"\u0417\u043C\u0435\u0439\u043A\u0430",maze:"\u041B\u0430\u0431\u0438\u0440\u0438\u043D\u0442",fakewalls:"\u041B\u043E\u0436\u043D\u044B\u0435 \u0441\u0442\u0435\u043D\u044B",portals:"\u041F\u043E\u0440\u0442\u0430\u043B\u044B",ramp:"\u0421\u043A\u0430\u0442",rain:"\u0414\u043E\u0436\u0434\u044C \u0441 \u043D\u0435\u0431\u0430"},eu=["spinner","gauntlet","highlow","gaps","beams","pendulums","rafts","crumble","sink","pushers","pads","traps","conveyor","flames","hammers","zigzag","ramp","rain","maze","fakewalls","portals","gears","gates","wind","chase","tilt","hooks","falsebridge","minecarts"],kc=class{constructor(e=1,t=1,n=""){this.map=e;this.courseSeed=t;this.only=n;this.theme=e===4?"crypt":e===3?"manor":e===2?"graveyard":"cliffs",this.deathY=this.theme==="manor"||this.theme==="crypt"?-6:this.theme==="graveyard"?-2.4:-12,this.look=Py[this.theme],this.rs=t>>>0||1,this.build()}blocks=[];sweepers=[];pendulums=[];boulders=[];fallers=[];pushers=[];jets=[];gears=[];gates=[];fans=[];hooks=[];chasers=[];carts=[];tilts=[];pads=[];portals=[];mazePath=[];mazeBox=[0,0,0,0];rooms=[];sections=[];fallZones=[];checkpoints=[0];finishZ=0;time=0;rampZ0=0;rampZ1=0;rampY0=0;rampY1=0;rampHalfW=4;theme;deathY=-12;boulderTimer=1.2;seed=7;fallTimer=0;fallSeed=99;fallId=0;look;z=0;y=0;rs;rnd(){return this.rs=Math.imul(this.rs,1103515245)+12345>>>0,(this.rs>>>8&65535)/65535}build(){let e=this.look;this.add(-10,10,-6,20,0,0,e.land).land=!0,this.room(-8,20,10,10),this.z=20;let t=["gears","gates","wind","chase","tilt","hooks","falsebridge","minecarts"],n=c=>{for(let o=c.length-1;o>0;o--){let h=Math.floor(this.rnd()*(o+1));[c[o],c[h]]=[c[h],c[o]]}return c},i=n(["spinner","gaps","pendulums","rafts","crumble","pushers","pads","traps","conveyor","flames","hammers","beams","zigzag",...this.theme==="graveyard"?["sink"]:[]].filter(c=>!(this.theme==="manor"&&c==="pads"))),s=n([...t]),a;if(this.theme==="cliffs"){let c=n(["gauntlet","highlow","spinner","pads"]),o=n(["gears","minecarts","falsebridge","wind","chase"]);a=[c[0],o[0],c[1],"ramp",o[1],c[2],o[2],c[3]]}else if(this.theme==="crypt"){let c=[...s.filter(h=>h!=="minecarts").slice(0,2),i[0]],o=["maze","fakewalls","portals","maze",this.rnd()<.5?"portals":"fakewalls"];for(let h=o.length-1;h>1;h--){let l=1+Math.floor(this.rnd()*h);[o[h],o[l]]=[o[l],o[h]]}a=[],o.forEach((h,l)=>{a.push(h),c[l]&&a.push(c[l])}),a.push("rain")}else a=[i[0],s[0],i[1],s[1],"ramp",i[2],s[2],i[3]],a.push(this.theme==="manor"?"pads":"rain");for(let c=1;c<a.length;c++)if(a[c]===a[c-1]){let o=a.findIndex((h,l)=>l>c&&h!==a[c]);o>0&&([a[c],a[o]]=[a[o],a[c]])}this.only&&(a=[this.only]);for(let c of a){let o=this.z;this["s_"+c](),this.sections.push({name:c,z0:o,z1:this.z}),this.add(-6,6,this.z,this.z+6,this.y,this.y,e.land).land=!0,this.room(this.z,this.z+6,6.6,8,!1),this.checkpoints.push(this.z+2.5),this.z+=6}this.z+=1.8,this.add(-11,11,this.z,this.z+22,this.y,this.y,e.alt).land=!0,this.room(this.z,this.z+22,11.6,12),this.finishZ=this.z+12}s_spinner(){let e=Math.floor(this.rnd()*5),t=this.y,n=this.z,i=(1.1+this.rnd()*.6)*(this.rnd()<.5?-1:1);this.add(-10,10,n,n+26,t,t,this.look.alt),this.room(n,n+26,10.6,9),e===0?this.sweepers.push({x:0,y:t+.55,z:n+13,len:9.5,speed:i,angle:0}):e===1?this.sweepers.push({x:0,y:t+.55,z:n+8,len:8.5,speed:i*1.2,angle:0},{x:0,y:t+.55,z:n+19,len:8.5,speed:-i*1.35,angle:1}):e===2?this.sweepers.push({x:0,y:t+.55,z:n+13,len:9.8,speed:i*.95,angle:0,arms:2}):e===3?this.sweepers.push({x:0,y:t+.55,z:n+13,len:9.5,speed:i,angle:0,vary:"pulse"}):this.sweepers.push({x:0,y:t+.55,z:n+13,len:9.5,speed:i*1.2,angle:0,arms:2,vary:"reverse"}),this.z+=26}s_gaps(){let e=6+Math.floor(this.rnd()*2),t=this.rnd()<.5,n=this.z;for(let i=0;i<e;i++){let s=2+this.rnd()*1.2,a=t?i%2?1.3:-1.3:0;this.add(a-2.2,a+2.2,this.z,this.z+s,this.y,this.y,this.look.thin).bottom=this.y-.45,this.z+=s+(i<e-1?1.5+this.rnd()*.4:0)}this.room(n,this.z,5,8)}s_pendulums(){let e=32+this.rnd()*6,t=this.y,n=this.z,i=4,s=2.2+this.rnd()*.6;this.add(-4.5,4.5,n,n+e,t,t,this.look.main),this.room(n,n+e,5.1,9);for(let a=0;a<i;a++)this.pendulums.push({px:0,py:t+7.8,pz:n+5+a*(e-8)/(i-1),len:6.3,amp:.95,period:s,phase:a*(1.1+this.rnd()),radius:1.05,bx:0,by:0,bz:0,swing:0});this.z+=e}s_rafts(){let e=this.z;for(let t=0;t<4;t++){let n=this.add(-2.2,2.2,this.z+1.6,this.z+6,this.y,this.y,this.look.thin);n.bottom=this.y-.45,n.driftAmp=3.6+this.rnd(),n.driftPeriod=3+this.rnd(),n.driftPhase=this.rnd()*6,this.z+=6}this.z+=1.6,this.room(e,this.z,7,9)}s_crumble(){let e=5+Math.floor(this.rnd()*2),t=this.z;for(let n=0;n<e;n++)for(let i of[-1,0,1]){let s=this.add(i*3-1.3,i*3+1.3,this.z+n*3.1+.25,this.z+n*3.1+2.85,this.y,this.y,this.look.crumble);s.crumbles=!0,s.crumbleDelay=.7,s.bottom=this.y-.7}this.z+=e*3.1,this.room(t,this.z,6.6,8)}s_sink(){let e=this.z;for(let t=0;t<4;t++)for(let n of[-1,0,1]){let i=this.add(n*3-1.2,n*3+1.2,this.z+t*3+.3,this.z+t*3+2.7,this.y,this.y,"mud");i.crumbles=!0,i.sink=!0,i.crumbleDelay=.35,i.bottom=this.y-.7}this.z+=12.6,this.room(e,this.z,6.6,8)}s_pushers(){let t=this.y,n=this.z,i=4.2;this.add(-i,i,n,n+34,t,t,this.look.main),this.room(n,n+34,i+.6,8);for(let s=0;s<6;s++)this.pushers.push({side:s%2?1:-1,wallX:i+.2,z:n+4+s*5.3,d:2.4,y:t,reach:i*1.15,period:2.2+this.rnd()*.5,phase:this.rnd(),ext:0,lastExt:0});this.z+=34}s_pads(){let e=this.z;for(let t=0;t<3;t++)this.add(-3.5,3.5,this.z,this.z+5,this.y,this.y,this.look.alt),this.pads.push({x:0,z:this.z+5-1.4,y:this.y,r:1.3,fired:-9}),this.z+=5+(t===0?6+this.rnd()*1.5:3.6+this.rnd()*.6),this.y+=this.rnd()<.5?.8:0;this.add(-3.5,3.5,this.z,this.z+3,this.y,this.y,this.look.alt),this.z+=3,this.room(e,this.z,5,11)}s_traps(){let t=this.z,n=2.6+this.rnd()*.6,i=this.rnd()<.5;for(let s=0;s<6;s++)for(let a of[-1,0,1]){let c=this.add(a*2.6-1.25,a*2.6+1.25,this.z+s*2.6,this.z+s*2.6+2.5,this.y,this.y,this.look.alt);c.bottom=this.y-.35,c.trapPeriod=n,c.trapPhase=i?s*.14+a*.05:(s*3+a+7)*.37%1}this.z+=6*2.6,this.room(t,this.z,4.6,8)}s_conveyor(){let t=this.y,n=this.z,i=this.add(-4,4,n,n+30,t,t,this.look.main);i.conveyor=-(3.2+this.rnd()*1.2),this.room(n,n+30,4.6,8);for(let s=0;s<4;s++){let a=n+5+s*6.5,c=s%2?1:-1,o=this.rnd()<.35;this.add(o?-4:c>0?-.4:-4,o||c>0?4:.4,a,a+.6,t+.75,t+.75,this.look.alt).bottom=t}this.z+=30}s_ramp(){let e=30+this.rnd()*6,t=6+this.rnd()*2,n=this.theme==="manor"?4:6;this.rampZ0=this.z,this.rampZ1=this.z+e,this.rampY0=this.y,this.rampY1=this.y+t,this.rampHalfW=n-.6,this.add(-n,n,this.z,this.z+e,this.y,this.y+t,this.look.alt),this.room(this.z,this.z+e,n+.6,10+t),this.z+=e,this.y+=t}s_rain(){let e=40+this.rnd()*6;this.add(-5.5,5.5,this.z,this.z+e,this.y,this.y,this.look.alt),this.fallZones.push([-4.5,4.5,this.z+2,this.z+e-1]),this.room(this.z,this.z+e,6.1,10),this.z+=e}wallBlock(e,t,n,i,s=2.8,a=!1){let c=this.add(e,t,n,i,this.y+s,this.y+s,"flag");return c.bottom=this.y,c.wall=!0,c.ghost=a,c}s_maze(){let s=this.z+1,a=-27/2,c=.35,o=this.y,h=this.pick(["classic","traps","secret","portals"]),l=new Set,u=new Set,d=(S,_)=>S<_?S+":"+_:_+":"+S,p=(S,_)=>_*9+S,g=Math.floor(9/2),x=Math.floor(this.rnd()*9),m=[[g,0]];for(l.add(p(g,0));m.length;){let[S,_]=m[m.length-1],v=[[S+1,_],[S-1,_],[S,_+1],[S,_-1]].filter(([I,F])=>I>=0&&I<9&&F>=0&&F<8&&!l.has(p(I,F)));if(!v.length){m.pop();continue}let[R,C]=v[Math.floor(this.rnd()*v.length)%v.length];u.add(d(p(S,_),p(R,C))),l.add(p(R,C)),m.push([R,C])}for(let S=0;S<9;S++){let _=Math.floor(this.rnd()*8),v=Math.floor(this.rnd()*8);this.rnd()<.5?u.add(d(p(_,v),p(_+1,v))):v<7&&u.add(d(p(_,v),p(_,v+1)))}let f=new Map,M=[p(g,0)];for(f.set(p(g,0),-1);M.length;){let S=M.shift(),_=S%9,v=Math.floor(S/9);for(let[R,C]of[[_+1,v],[_-1,v],[_,v+1],[_,v-1]]){if(R<0||R>=9||C<0||C>=8)continue;let I=p(R,C);f.has(I)||!u.has(d(S,I))||(f.set(I,S),M.push(I))}}let T=[];for(let S=p(x,7);S!==-1;S=f.get(S))T.unshift(S);let y=new Set(T);for(let S=0;S<8;S++)for(let _=0;_<9;_++){let v=this.add(a+_*3,a+(_+1)*3,s+S*3,s+(S+1)*3,o,o,this.look.main);h==="traps"&&!y.has(p(_,S))&&this.rnd()<.45&&(v.trapPeriod=2.2+this.rnd(),v.trapPhase=this.rnd(),v.bottom=o-.35),h==="traps"&&y.has(p(_,S))&&S>0&&S<7&&this.rnd()<.22&&(v.trapPeriod=3,v.trapPhase=this.rnd(),v.bottom=o-.35)}this.add(-27/2-.5,27/2+.5,this.z,s,o,o,this.look.main),this.add(-27/2-.5,27/2+.5,s+24,s+24+1,o,o,this.look.main),this.room(this.z,s+24+1,27/2+1.1,12);let E=new Set;if(h==="secret")for(let S=0;S<5;S++){let _=Math.floor(this.rnd()*8),v=Math.floor(this.rnd()*8),R=d(p(_,v),p(_+1,v));u.has(R)||E.add(R)}for(let S=0;S<=8;S++)for(let _=0;_<9;_++)(S===0?_===g:S===8?_===x:u.has(d(p(_,S-1),p(_,S))))||this.wallBlock(a+_*3-c/2,a+(_+1)*3+c/2,s+S*3-c/2,s+S*3+c/2,3);for(let S=0;S<8;S++)for(let _=0;_<=9;_++){let v=_>0&&_<9?d(p(_-1,S),p(_,S)):"";v!==""&&u.has(v)||this.wallBlock(a+_*3-c/2,a+_*3+c/2,s+S*3-c/2,s+(S+1)*3+c/2,3,E.has(v))}if(h==="portals"){let S=[...Array(72).keys()].filter(C=>!y.has(C)&&Math.floor(C/9)>1&&Math.floor(C/9)<7);for(let C=S.length-1;C>0;C--){let I=Math.floor(this.rnd()*(C+1));[S[C],S[I]]=[S[I],S[C]]}let _=T[Math.max(0,T.length-2)],v=T[0],R=C=>[a+(C%9+.5)*3,s+(Math.floor(C/9)+.5)*3];S.slice(0,2).forEach((C,I)=>{let[F,N]=R(C),[U,D]=R(I===0?_:v);this.portals.push({x:F,y:o,z:N,r:.9,tx:U,ty:o,tz:D,kind:I===0?"far":"back",used:-9})})}let w=T.map(S=>[a+(S%9+.5)*3,s+(Math.floor(S/9)+.5)*3]);w.unshift([0,s-.6]),w.push([a+(x+.5)*3,s+24+.8]),this.mazePaths.push({box:[a,a+27,s-1,s+24+1],path:w,variant:h}),this.z=s+24+1}mazePaths=[];fakeWalls=[];s_fakewalls(){let e=4+Math.floor(this.rnd()*2),t=6.5,n=3+e*t,i=5,s=this.z,a=.5,c=2;this.add(-i,i,s,s+n,this.y,this.y,this.look.main),this.room(s,s+n,i+.6,9);let o=[-3.75,-1.25,1.25,3.75];for(let h=0;h<e;h++){let l=s+4+h*t,u=Math.floor(this.rnd()*o.length)%o.length;o.forEach((d,p)=>this.wallBlock(d-c/2-(p===0?.25:0),d+c/2+(p===3?.25:0),l,l+a,3.2,p===u)),this.fakeWalls.push({z:l,slots:o,real:u})}this.z+=n}s_portals(){let e=this.z,t=7,n=this.y,i=3+Math.floor(this.rnd()*3);this.add(-t,t,e,e+12,n,n,this.look.main),this.room(e,e+12,t+.6,9),this.wallBlock(-t,t,e+11,e+12,5);let s=e+12;this.add(-4,4,s,s+4,n,n,this.look.main);for(let o=0;o<5;o++)for(let h of[-1,0,1]){let l=this.add(h*2.6-1.25,h*2.6+1.25,s+4+o*2.6,s+4+o*2.6+2.5,n,n,this.look.alt);l.bottom=n-.35,l.trapPeriod=2.4,l.trapPhase=o*.15+h*.04}let a=s+17;this.add(-4,4,a,a+4,n,n,this.look.main),this.room(s,a+4,4.6,9);let c=["far","near",...Array(i-2).fill("back")];i>=4&&this.rnd()<.5&&(c[2]="near");for(let o=c.length-1;o>0;o--){let h=Math.floor(this.rnd()*(o+1));[c[o],c[h]]=[c[h],c[o]]}c.forEach((o,h)=>{let l=-((i-1)*2.9)/2+h*2.9,u=o==="far"?a+2:o==="near"?s+1.5:e+1.5;this.portals.push({x:l,y:n,z:e+8,r:1.05,tx:0,ty:n,tz:u,kind:o,used:-9})}),this.z=a+4}pick(e){return e[Math.floor(this.rnd()*e.length)%e.length]}s_gauntlet(){let e=this.z,t=this.y,n=40;this.add(-11,11,e,e+n,t,t,this.look.alt),this.room(e,e+n,11.6,9);let i=1+this.rnd()*.4,s=()=>.8+this.rnd()*.5;this.sweepers.push({x:-4.5,y:t+.55,z:e+9,len:5.5,speed:i*1.6*s(),angle:0,vary:"pulse"},{x:4.5,y:t+.55,z:e+9,len:5.5,speed:-i*1.6*s(),angle:1.5},{x:0,y:t+.55,z:e+20,len:9.5,speed:i*s(),angle:.7,arms:2,vary:"pulse"},{x:-4,y:t+2.1,z:e+31,len:6,speed:-i*1.3*s(),angle:2},{x:4,y:t+.55,z:e+31,len:6,speed:i*1.3*s(),angle:.3,vary:"pulse"}),this.z+=n}s_highlow(){let e=this.z,t=this.y,n=34;this.add(-9,9,e,e+n,t,t,this.look.alt),this.room(e,e+n,9.6,10);for(let i=0;i<3;i++){let s=e+6+i*11,a=(1.1+this.rnd()*.5)*(i%2?-1:1);this.sweepers.push({x:0,y:t+.55,z:s,len:8,speed:a,angle:0},{x:0,y:t+2.3,z:s,len:8,speed:a,angle:Math.PI/2})}this.z+=n}s_flames(){let n=this.z,i=this.y;this.add(-5,5,n,n+30,i,i,this.look.alt),this.room(n,n+30,5+.6,9);let s=2.4+this.rnd()*.6,a=Math.floor(this.rnd()*3);for(let c=0;c<6;c++)for(let o=0;o<4;o++){let h=-3.75+o*2.5,l=n+3+c*4.4,u=a===0?c*.17:a===1?(c+o)%2*.5:this.rnd();this.jets.push({x:h,z:l,y:i,r:1,period:s,phase:u,kind:"fire",state:0})}this.z+=30}s_hammers(){let n=this.z,i=this.y;this.add(-4.5,4.5,n,n+32,i,i,this.look.main),this.room(n,n+32,4.5+.6,10);for(let s=0;s<5;s++){let a=this.rnd()<.5?[-2.2,2.2]:[0];for(let c of a)this.jets.push({x:c,z:n+4+s*6,y:i,r:1.5,period:2+this.rnd()*.8,phase:this.rnd(),kind:"hammer",state:0})}this.z+=32}s_beams(){let e=this.z,t=this.y,n=Math.floor(this.rnd()*4),i=0,s=(a,c,o,h)=>{let l=this.add(a,c,o,h,t,t,this.look.thin);return l.bottom=t-.4,n===1&&(l.crumbles=!0,l.crumbleDelay=.7),n===2&&h-o>2&&(l.tilt={amp:.55,period:3.4+this.rnd(),seed:this.rnd()*9,axis:"x",warn:!1},this.tilts.push(l)),l};for(let a=0;a<6;a++){let c=5+this.rnd()*2,o=(this.rnd()-.5)*6;s(Math.min(i,o)-.55,Math.max(i,o)+.55,this.z,this.z+.9),s(o-.55,o+.55,this.z+.9,this.z+c),i=o,this.z+=c}if(s(Math.min(i,0)-.55,Math.max(i,0)+.55,this.z,this.z+1),this.z+=1,n===3)for(let a=0;a<3;a++){let c=e+6+a*11,o=a%2?1:-1;this.fans.push({x:o*7,z:c,y:t+1.2,dx:-o,dz:0,reach:14,half:2.6,force:3.2,period:3.6,phase:a*.33,on:0,spin:0})}this.room(e,this.z,6,9)}s_zigzag(){let e=this.z,t=this.y,n=6;this.add(-n,n,e,e+34,t,t,this.look.main),this.room(e,e+34,n+.6,9);for(let i=0;i<5;i++){let s=e+4+i*6,a=i%2?1:-1;this.wallBlock(a>0?-n:-n+2.6,a>0?n-2.6:n,s,s+.5,1.6),this.jets.push({x:a*(n-1.3),z:s+3,y:t,r:1,period:2.6,phase:i*.2,kind:"fire",state:0})}this.z+=34}s_gears(){let e=this.z,t=this.y,n=5+Math.floor(this.rnd()*3),i=this.z+1,s=0;for(let a=0;a<n;a++){let c=2.2+this.rnd()*1.3,o=a===0?0:ti(s+(this.rnd()-.5)*4,-3.5,3.5);i+=c;let h={x:o,z:i,y:t,r:c,speed:(.45+this.rnd()*.55)*(a%2?-1:1),move:this.rnd()<.35?2.4:99,stop:1.2,phase:this.rnd()*3,gaps:[],angle:0,lastAngle:0,teeth:Math.round(c*7),block:null};if(this.rnd()<.45){let u=this.rnd()*6.28;h.gaps.push([u,u+.9+this.rnd()*.5])}let l=this.add(o-c,o+c,i-c,i+c,t,t,"stone");l.gear=h,l.bottom=t-.7,h.block=l,this.gears.push(h),i+=c+1.4+this.rnd()*.5,s=o}this.z=i-.6,this.room(e,this.z,7.5,10)}s_gates(){let e=5+Math.floor(this.rnd()*4),t=5.2,n=4+e*t,i=3.4,s=this.z,a=this.y;this.add(-i,i,s,s+n,a,a,this.look.main),this.room(s,s+n,i+.6,9);let c=this.rnd()<.5,o=3.2+this.rnd()*.8;for(let h=0;h<e;h++){let l=s+4+h*t;this.wallBlock(-i-1.2,-i,l-.4,l+.4,4.2),this.wallBlock(i,i+1.2,l-.4,l+.4,4.2),this.gates.push({z:l,y:a,halfW:i,kind:this.rnd()<.5?"slide":"drop",period:c?o:2.6+this.rnd()*1.6,phase:c?h*.09:this.rnd(),open:1,lastOpen:1,warn:!1})}this.z+=n}s_wind(){let n=this.z,i=this.y;this.add(-3.6,3.6,n,n+36,i,i,this.look.main),this.room(n,n+36,3.6+4,10);let s=4+Math.floor(this.rnd()*3);for(let a=0;a<s-1;a++){let c=n+5+a*26/(s-2),o=a%2?1:-1;this.fans.push({x:o*(3.6+2.6),z:c,y:i+1.3,dx:-o,dz:0,reach:2*3.6+3,half:2.4,force:4.5+this.rnd()*2,period:3+this.rnd(),phase:this.rnd(),on:0,spin:0}),this.wallBlock(o>0?3.6-1.8:-3.6+1.4,o>0?3.6-1.4:-3.6+1.8,c-3.6,c-2.2,1.6)}this.fans.push({x:0,z:n+36+1.5,y:i+1.3,dx:0,dz:-1,reach:36,half:2.2,force:3.2,period:4.2,phase:this.rnd(),on:0,spin:0});for(let a=0;a<3;a++)this.wallBlock(-1.2+a%2*1.5,.3+a%2*1.5,n+8+a*9,n+8.6+a*9,1.3);this.z+=36}s_chase(){let e=this.z,t=this.y,n=2.1,i=[[0,e,e+14],[3.6,e+14,e+30],[-2.8,e+30,e+46],[0,e+46,e+52]],s=0;for(let[c,o,h]of i)this.add(Math.min(s,c)-n,Math.max(s,c)+n,o,Math.min(h,o+2*n),t,t,this.look.alt),this.add(c-n,c+n,o,h,t,t,this.look.alt),s=c;for(let[c,o,h]of i.slice(0,3)){let l=(o+h)/2+1,u=c>0?-1:1;this.add(u>0?c+n:c-n-2.2,u>0?c+n+2.2:c-n,l-1.3,l+1.3,t,t,this.look.main).land=!1,this.add(c-.6,c+.6,(o+h)/2-2.5,(o+h)/2-2.1,t+.5,t+.5,this.look.alt).bottom=t}let a=[[0,e+.5],[0,e+16],[3.6,e+16],[3.6,e+32],[-2.8,e+32],[-2.8,e+48],[0,e+48],[0,e+60]];this.chasers.push({path:a,y:t,r:1.85,period:9+this.rnd()*2,phase:this.rnd(),x:0,z:e,spin:0,active:!1,dist:0}),this.z=e+52,this.room(e,this.z,7.5,10)}s_tilt(){let e=this.z,t=this.y,n=22,i=6.5;this.add(-i,i,e,e+1.5,t,t,this.look.main);let s=this.add(-i,i,e+1.5,e+n-1.5,t,t,this.look.alt);s.tilt={amp:.3,period:3,seed:this.rnd()*99,axis:"xz",warn:!1},s.bottom=t-1.2,this.tilts.push(s),this.add(-i,i,e+n-1.5,e+n,t,t,this.look.main),this.room(e,e+n,i+.6,12),this.z+=n}s_hooks(){let n=this.z,i=this.y,s=5+Math.floor(this.rnd()*4);this.add(-2.8,2.8,n,n+36,i,i,this.look.main),this.room(n,n+36,2.8+5,10);let a=this.rnd()<.5;for(let c=0;c<s;c++){let o=c%2?1:-1;this.hooks.push({side:o,pillarX:o*(2.8+3),z:n+3+c*30/(s-1),y:i+.9,reach:2*2.8+3.4,period:3.4,phase:a?c*.13:c%3*.33+this.rnd()*.1,ext:0,state:0})}this.z+=36}s_falsebridge(){let t=this.z,n=this.y,i=this.z+.8;for(let s=0;s<7;s++){let a=this.rnd()<.5?2:3,c=a===2?[-1.5,1.5]:[-2.8,0,2.8],o=Math.floor(this.rnd()*a)%a;c.forEach((h,l)=>{let u=this.add(h-1.15,h+1.15,i,i+2.3,n,n,this.look.alt);u.bottom=n-.4,l!==o&&!(a===3&&this.rnd()<.2)&&(u.fake=!0,u.crumbles=!0,u.crumbleDelay=.12,u.restoreAfter=8)}),i+=2.3+1.2}this.z=i-.4,this.room(t,this.z,5,9)}s_minecarts(){let e=this.z,t=this.y,n=5,i=11,s=this.z+1.2;for(let a=0;a<n;a++){let c=(2.2+this.rnd()*1.6)*(a%2?-1:1),o=a%2?1:2;for(let h=0;h<o;h++){let l=this.add(-1.2,1.2,s,s+2.1,t,t,this.look.thin);l.bottom=t-.9,l.cart={lane:a,speed:c,len:i,base:h*i+this.rnd()*3,move:this.rnd()<.4?3:99,stop:1.1},this.carts.push(l)}s+=2.1+1.4}this.z=s-.2,this.room(e,this.z,i+2,10)}room(e,t,n,i=8,s=!0){(this.theme==="manor"||this.theme==="crypt")&&this.rooms.push({z0:e,z1:t,halfW:n,y:this.y,h:i,skylights:s&&this.theme==="manor"})}add(e,t,n,i,s,a,c){let o={x0:e,x1:t,z0:n,z1:i,y0:s,y1:a,mat:c,bottom:Iy.includes(c)?Math.min(s,a)-.42:-16,sink:!1,liftAmp:0,liftPeriod:1,liftPhase:0,lastOffY:0,conveyor:0,trapPeriod:0,trapPhase:0,warn:!1,driftAmp:0,driftPeriod:1,driftPhase:0,crumbles:!1,crumbleDelay:.75,offX:0,offY:0,lastOffX:0,crumbleAt:-1,fallV:0,gone:!1,tiltX:0,tiltZ:0,restoreAfter:3.8};return this.blocks.push(o),o}spawnY(e){let t=-99;for(let n of this.blocks)!n.crumbles&&!n.driftAmp&&!n.trapPeriod&&!n.wall&&!n.gear&&!n.cart&&!n.tilt&&e>=n.z0&&e<=n.z1&&n.bottom<n.y0-.5&&(t=Math.max(t,_n(n,e)));return t>-99?t:0}sectionAt(e){return this.sections.find(t=>e>=t.z0&&e<t.z1)}step(e){this.time+=e;let t=this.time;for(let i of this.blocks){if(i.lastOffX=i.offX,i.lastOffY=i.offY,i.liftAmp&&(i.offY=i.liftAmp*Math.sin(Math.PI*2*t/i.liftPeriod+i.liftPhase)),i.driftAmp&&(i.offX=i.driftAmp*Math.sin(Math.PI*2*t/i.driftPeriod+i.driftPhase)),i.trapPeriod){let s=(t/i.trapPeriod+i.trapPhase)%1;i.gone=s>.7,i.warn=s>.46&&s<=.7}if(i.sink&&i.crumbleAt<0&&i.offY<0&&(i.offY=Math.min(0,i.offY+e*1.2)),i.crumbles&&i.crumbleAt>=0){let s=t-i.crumbleAt;i.sink?(s>i.crumbleDelay&&(i.offY=Math.max(-2.6,i.offY-e*1.6)),s>i.crumbleDelay+3.2&&(i.crumbleAt=-1)):s>i.crumbleDelay&&(i.fallV+=26*e,i.offY-=i.fallV*e,i.offY<-6&&(i.gone=!0)),!i.sink&&s>i.crumbleDelay+i.restoreAfter&&(i.crumbleAt=-1,i.offY=0,i.fallV=0,i.gone=!1)}}for(let i of this.sweepers)if(i.angle0??=i.angle,i.lastAngle=i.angle,i.vary==="pulse"){let s=t/6+i.angle0,a=s-Math.floor(s);i.boost=a>.7?1:a>.58?.5:0,i.angle=i.angle0+i.speed*(t+1.8*Math.floor(s)+Math.max(0,a-.7)*6)}else i.vary==="reverse"?i.angle=i.angle0+i.speed*2.6*Math.sin(t*.45):i.angle=i.speed*t+i.angle0;for(let i of this.gears){i.lastAngle=i.angle;let s=i.move+i.stop,a=Math.floor((t+i.phase)/s),c=Math.min(i.move,t+i.phase-a*s);i.angle=i.speed*(a*i.move+c)}for(let i of this.carts){let s=i.cart,a=s.move+s.stop,c=Math.floor(t/a),o=c*s.move+Math.min(s.move,t-c*a),h=s.len*2,l=((s.base+s.speed*o)%h+h)%h-s.len;i.lastOffX=i.offX,i.offX=l,i.gone=Math.abs(l)>s.len-1.3}for(let i of this.gates){i.lastOpen=i.open;let s=(t/i.period+i.phase)%1,a=s<.35||s<.47?1:s<.55?1-(s-.47)/.08:s<.7?0:s<.82?(s-.7)/.12:1;i.open=a,i.warn=s>.35&&s<.47}for(let i of this.fans){let s=(t/i.period+i.phase)%1;i.on=s<.55?(s<.08?s/.08:1)*(.75+.25*Math.sin(t*2.3+i.z)):0,i.spin+=e*(2+22*i.on)}for(let i of this.hooks){let s=(t/i.period+i.phase)%1;i.state=s<.5?0:s<.68?1:s<.74?2:s<.8?3:4,i.ext=i.state===2?(s-.68)/.06:i.state===3?1:i.state===4?Math.max(0,1-(s-.8)/.2):0}for(let i of this.chasers){let s=(t/i.period+i.phase)%1,a=s*i.period;i.active=a<7.5;let c=2.5*a+.55*a*a;i.dist=c;let o=c,h=0;for(;h<i.path.length-1;h++){let[l,u]=i.path[h],[d,p]=i.path[h+1],g=Math.hypot(d-l,p-u);if(o<=g){i.x=l+(d-l)*o/g,i.z=u+(p-u)*o/g;break}o-=g}h>=i.path.length-1&&(i.active=!1),i.spin=c/i.r}for(let i of this.tilts){let s=i.tilt;if(s.axis==="x"){i.tiltX=s.amp*Math.sin(t*Math.PI*2/s.period+s.seed)*.5;continue}let a=Math.floor(t/s.period),c=t/s.period-a,o=x=>{let m=Math.sin((x+s.seed)*12.9898)*43758.5453,f=m-Math.floor(m),M=Math.sin((x+s.seed)*78.233)*12345.678,T=M-Math.floor(M);return[(f-.5)*2*s.amp,(T-.5)*2*s.amp*.7]},[h,l]=o(a),[u,d]=o(a+1),p=c<.55?0:(c-.55)/.45,g=p*p*(3-2*p);i.tiltX=h+(u-h)*g,i.tiltZ=l+(d-l)*g,s.warn=c>.3&&c<.6&&Math.hypot(u,d)>s.amp*.75}for(let i of this.pendulums)i.swing=i.amp*Math.sin(Math.PI*2*t/i.period+i.phase),i.bx=i.px+Math.sin(i.swing)*i.len,i.by=i.py-Math.cos(i.swing)*i.len,i.bz=i.pz;for(let i of this.jets){let s=(t/i.period+i.phase)%1;i.state=i.kind==="fire"?s>.62?2:s>.4?1:0:s>.8?2:s>.55?1:0}for(let i of this.pushers){i.lastExt=i.ext;let s=(t/i.period+i.phase)%1,a=s<.1?s/.1:s<.42?1:s<.72?1-(s-.42)/.3:0;i.ext=a*a*(3-2*a)}if(this.boulderTimer-=e,this.boulderTimer<=0&&this.rampZ1>this.rampZ0){let i=this.srand(),s=i<.6?1:2,a=[-1,0,1].sort(()=>this.srand()-.5).slice(0,s);for(let c of a){let o=.85+this.srand()*.2;this.boulders.push({x:c*this.rampHalfW*.62+(this.srand()-.5)*.8,y:this.rampY1+o,z:this.rampZ1-1-this.srand()*2,vz:-2-this.srand()*2,spin:0,radius:o,alive:!0})}this.boulderTimer=.79+this.srand()*.42}let n=(this.rampY1-this.rampY0)/Math.max(1,this.rampZ1-this.rampZ0);for(let i of this.boulders)i.vz-=10*e,i.z+=i.vz*e,i.spin+=i.vz*e/i.radius,i.z>this.rampZ0?i.y=this.rampY0+(i.z-this.rampZ0)*n+i.radius:i.y-=30*e,i.y<this.deathY-10&&(i.alive=!1);for(this.boulders=this.boulders.filter(i=>i.alive),this.fallTimer-=e;this.fallTimer<=0&&this.fallZones.length;){let i=()=>((this.fallSeed=this.fallSeed*1103515245+12345|0)>>>8&65535)/65535,s=this.fallZones[i()<.72?0:this.fallZones.length-1],a=s[0]+i()*(s[1]-s[0]),c=s[2]+i()*(s[3]-s[2]),o=-99;for(let l of this.blocks)!l.crumbles&&!l.driftAmp&&a>=l.x0&&a<=l.x1&&c>=l.z0&&c<=l.z1&&(o=Math.max(o,_n(l,c)));let h=.8+i()*.7;o>-50&&this.fallers.push({id:++this.fallId,x:a,z:c,g:o,spawn:t,impact:t+1.25+i()*.3,r:h,y:o+30,alive:!0,landed:!1}),this.fallTimer+=.2+i()*.16}for(let i of this.fallers){let s=(t-i.spawn)/(i.impact-i.spawn);s<1?i.y=i.g+i.r+30*(1-s*s):(i.landed=!0,i.y=i.g+i.r*.7-Math.max(0,t-i.impact-.6)*2),t>i.impact+1.4&&(i.alive=!1)}this.fallers=this.fallers.filter(i=>i.alive)}srand(){return this.seed=Math.imul(this.seed,1103515245)+12345|0,(this.seed>>>8&1023)/1023}move(e,t){if(e.hook>=0){let l=this.hooks[e.hook];e.x=l.pillarX-l.side*l.reach*l.ext,e.z=l.z,e.y=l.y-.6,e.vx=e.vy=e.vz=0,e.ground=null,(l.ext<.05||l.state<2)&&(e.hook=-1,e.vx=l.side*2,e.stun=.4);return}if(e.finished){e.vx=e.vy=e.vz=0;return}e.stun=Math.max(0,e.stun-t),e.coyote-=t,e.jumpBuffer-=t;let n=e.inX,i=e.inZ,s=Math.hypot(n,i);s>1&&(n/=s,i/=s);let a=8.2,c=e.ground?75:24;if(e.stun>0&&(c=3),e.vx=Uf(e.vx,n*a,c*t),e.vz=!e.ground&&e.vz>a?e.vz-2*t:Uf(e.vz,i*a,c*t),s>.1&&(e.facing=Math.atan2(n,i)),e.jump&&(e.jumpBuffer=.14,e.jump=!1),e.jumpBuffer>0&&e.coyote>0&&e.stun<=0&&(e.vy=9.6,e.coyote=0,e.jumpBuffer=0,e.ground=null),e.vy-=(e.vy>0&&!e.holdJump?38:26)*t,e.ground){let l=e.ground;if(l.gear){let u=l.gear,d=u.angle-u.lastAngle,p=e.x-u.x,g=e.z-u.z,x=Math.cos(d),m=Math.sin(d);e.x=u.x+p*x-g*m,e.z=u.z+p*m+g*x,e.facing+=d*0}else l.cart&&Math.abs(l.offX-l.lastOffX)>3||(e.x+=l.offX-l.lastOffX,e.y+=l.offY-l.lastOffY);e.z+=l.conveyor*t,(l.tiltX||l.tiltZ)&&(e.x-=l.tiltX*15*t,e.z-=l.tiltZ*15*t)}e.wind=0;for(let l of this.fans){if(l.on<=.02)continue;let u=l.dx?(e.x-l.x)*l.dx:(e.z-l.z)*l.dz,d=l.dx?Math.abs(e.z-l.z):Math.abs(e.x-l.x);if(u<0||u>l.reach||d>l.half||e.y>l.y+2.5)continue;let p=!1;for(let x of this.blocks)if(x.wall&&!x.ghost&&(l.dx?e.z>=x.z0&&e.z<=x.z1&&(x.x0+x.x1)/2>Math.min(l.x,e.x)&&(x.x0+x.x1)/2<Math.max(l.x,e.x):e.x>=x.x0&&e.x<=x.x1&&(x.z0+x.z1)/2>Math.min(l.z,e.z)&&(x.z0+x.z1)/2<Math.max(l.z,e.z))){p=!0;break}if(p)continue;let g=l.force*l.on*(e.ground?1:1.5)*(1-.4*u/l.reach);e.x+=l.dx*g*t,e.z+=l.dz*g*t,e.wind=Math.max(e.wind,l.on)}let o=e.y;e.x+=e.vx*t,e.y+=e.vy*t,e.z+=e.vz*t;let h=null;for(let l of this.blocks){if(l.gone||l.ghost||l.gear)continue;let u=l.x0+l.offX,d=l.x1+l.offX,p=ti(e.x,u,d),g=ti(e.z,l.z0,l.z1),x=e.x-p,m=e.z-g,f=x*x+m*m;if(f>.42*.42)continue;let M=_n(l,g,ti(e.x,u,d)),T=l.y0!==l.y1||!!(l.tiltX||l.tiltZ);if(e.x>u-.42*.5&&e.x<d+.42*.5&&e.z>l.z0-.42*.5&&e.z<l.z1+.42*.5&&e.vy<=.01&&e.y<=M+.05&&o>=M-.45-(T?.5:0)){e.y=M,e.vy=0,h=l;continue}if(e.y<M-.45&&e.y+1.55>l.bottom)if(f>1e-6){let E=Math.sqrt(f),w=.42-E;e.x+=x/E*w,e.z+=m/E*w,Math.abs(x)>Math.abs(m)?e.vx=0:e.vz=0}else{let E=e.x-u,w=d-e.x,S=e.z-l.z0,_=l.z1-e.z,v=Math.min(E,w,S,_);v===E?e.x=u-.42:v===w?e.x=d+.42:v===S?e.z=l.z0-.42:e.z=l.z1+.42}}h&&!e.ground&&o-e.y>=0&&(e.landed=this.time);for(let l of this.gears){let u=e.x-l.x,d=e.z-l.z,p=Math.hypot(u,d);if(p>l.r+.42)continue;let g=Math.atan2(d,u)-l.angle;g=(g%6.2832+6.2832)%6.2832;let x=l.gaps.some(([m,f])=>g>=m&&g<=f);if(p<=l.r&&!x&&e.vy<=.01&&e.y<=l.y+.05&&o>=l.y-.45){e.y=l.y,e.vy=0,h=l.block;continue}if(!x&&e.y<l.y-.45&&e.y+1.55>l.y-.7&&p>.01){let m=l.r+.42-p;e.x+=u/p*m,e.z+=d/p*m}}for(let l of this.gates){if(Math.abs(e.z-l.z)>.35+.42||e.y>l.y+3.6)continue;let u=l.open<l.lastOpen,d=!1;if(l.kind==="slide"){let p=l.halfW*(1-l.open);d=e.x-.42<-l.halfW+p||e.x+.42>l.halfW-p}else d=l.y+3.2*l.open<e.y+1.55;d&&(u&&l.open>.05&&(this.hit(e,(e.x>0?-1:1)*3,6,e.z<l.z?-13:13),e.stun=.8),e.z=e.z<l.z?l.z-.35-.42:l.z+.35+.42,e.vz=0)}for(let l=0;l<this.hooks.length;l++){let u=this.hooks[l];if(u.state!==2&&u.state!==3)continue;let d=u.pillarX-u.side*u.reach*u.ext;if(Math.abs(e.x-d)<.8&&Math.abs(e.z-u.z)<.9&&e.y<u.y+1&&e.y+1.55>u.y-.5&&e.stun<=.25){e.hook=l;return}}for(let l of this.chasers){if(!l.active)continue;let u=e.x-l.x,d=e.z-l.z,p=e.y+1.55/2-(l.y+l.r);if(u*u+d*d+p*p<(l.r+.42)**2){let g=Math.hypot(u,d)||1;this.hit(e,u/g*10,9,d/g*10+6),e.stun=.9}}e.ground=h,h&&(e.coyote=.1,h.crumbles&&h.crumbleAt<0&&(h.crumbleAt=this.time));for(let l of this.sweepers)for(let u=0;u<(l.arms||1);u++){let d=l.angle+u*Math.PI/(l.arms||1),p=Math.cos(d)*l.len,g=Math.sin(d)*l.len,x=ti(((e.x-l.x)*p+(e.z-l.z)*g)/(p*p+g*g),-1,1),m=e.x-(l.x+p*x),f=e.z-(l.z+g*x),M=Math.hypot(m,f);if(M<.42+.42&&e.y<l.y+.45&&e.y+1.55>l.y-.45){let T=Math.sign(x+1e-4)*(Math.sign(l.angle-(l.lastAngle??l.angle))||Math.sign(l.speed));this.hit(e,-Math.sin(d)*T*11+(M?m/M*4:0),6.5,Math.cos(d)*T*11+(M?f/M*4:0))}}for(let l of this.pendulums){let u=e.x-l.bx,d=e.y+1.55/2-l.by,p=e.z-l.bz,g=l.radius+.42+.2;if(u*u+d*d+p*p<g*g){let x=Math.sign(Math.cos(Math.PI*2*this.time/l.period+l.phase))||1;this.hit(e,x*15,7,Math.sign(p)*2)}}for(let l of this.pushers){let u=l.wallX-l.reach*l.ext,d=Math.min(l.side*l.wallX,l.side*u),p=Math.max(l.side*l.wallX,l.side*u);l.ext>.05&&e.x+.42>d&&e.x-.42<p&&Math.abs(e.z-l.z)<l.d/2+.42&&e.y<l.y+1.7&&e.y+1.55>l.y&&((l.ext>=l.lastExt||l.ext>.3)&&this.hit(e,-l.side*(l.ext>l.lastExt?15:9),6.5,(e.z-l.z)*2),e.x=l.side>0?Math.min(e.x,d-.42):Math.max(e.x,p+.42))}for(let l of this.portals)Math.hypot(e.x-l.x,e.z-l.z)<l.r&&Math.abs(e.y-l.y)<1.2&&(e.x=l.tx+(e.slot%3-1)*.8,e.y=l.ty+.1,e.z=l.tz,e.vx=e.vz=0,e.vy=0,e.ground=null,l.used=this.time,e.teleported=this.time,e.progress=Math.max(e.progress,e.z));for(let l of this.jets)if(l.state===2&&Math.hypot(e.x-l.x,e.z-l.z)<l.r+.42*.6&&e.y<l.y+(l.kind==="fire"?2.4:1.6)){let u=e.x-l.x,d=e.z-l.z,p=Math.hypot(u,d)||1;this.hit(e,u/p*8,l.kind==="fire"?11:4,d/p*8-3)}for(let l of this.pads)e.ground&&Math.hypot(e.x-l.x,e.z-l.z)<l.r&&Math.abs(e.y-l.y)<.3&&(e.vy=15,e.vz=Math.max(e.vz,10.5),e.ground=null,e.coyote=0,l.fired=this.time);for(let l of this.fallers){if(this.time>l.impact+.25)continue;let u=e.x-l.x,d=e.y+1.55/2-l.y,p=e.z-l.z,g=l.r+.42;if(u*u+d*d+p*p<g*g){let x=Math.hypot(u,p)||1;this.hit(e,u/x*9,8,p/x*9)}}for(let l of this.boulders){let u=e.x-l.x,d=e.y+1.55/2-l.y,p=e.z-l.z,g=l.radius+.42;u*u+d*d+p*p<g*g&&this.hit(e,Math.sign(u)*4,6,-12)}for(let l=this.checkpoints.length-1;l>=0;l--)if(e.z>=this.checkpoints[l]&&e.ground?.land){e.checkpoint=Math.max(e.checkpoint,l);break}e.y<this.deathY&&this.respawn(e),e.progress=Math.max(e.progress,e.z),e.z>=this.finishZ&&e.ground&&!e.finished&&(e.finished=!0,e.finishTime=this.time)}hit(e,t,n,i){e.stun>.25||(e.vx=t,e.vy=n,e.vz=i,e.stun=.55,e.ground=null,e.coyote=0)}respawn(e){e.hook=-1;let t=this.checkpoints[e.checkpoint]+.5;e.x=(e.slot%5-2)*1.4,e.y=this.spawnY(t)+1.5,e.z=t,e.vx=e.vy=e.vz=0,e.ground=null,e.falls++,e.stun=.3}think(e,t){e.botCool-=t;let n=(e.slot%5-2)*.9;e.ground?.driftAmp&&(n=(e.ground.x0+e.ground.x1)/2+e.ground.offX);for(let o of this.blocks)o.driftAmp&&o.z0>e.z&&o.z0-e.z<2.5&&(n=(o.x0+o.x1)/2+o.offX);for(let o of this.pads)o.z>e.z&&o.z-e.z<6&&(n=o.x);e.inX=ti((n-e.x)*.6,-1,1),e.inZ=1;for(let o of this.mazePaths)if(e.x>o.box[0]-1&&e.x<o.box[1]+1&&e.z>o.box[2]&&e.z<o.box[3]){let h=0,l=1e9;o.path.forEach(([m,f],M)=>{let T=Math.hypot(m-e.x,f-e.z);T<l&&(l=T,h=M)});let[u,d]=o.path[Math.min(o.path.length-1,h+(l<1.1?1:0))],p=u-e.x,g=d-e.z,x=Math.hypot(p,g)||1;e.inX=p/x,e.inZ=g/x}for(let o of this.fakeWalls)if(e.z>o.z-3.5&&e.z<o.z+.2){let h=e;h.fwZ!==o.z&&(h.fwZ=o.z,h.try=Math.floor(Math.random()*o.slots.length),h.stuck=0);let l=o.slots[h.try%o.slots.length];e.inX=ti((l-e.x)*1.2,-1,1),e.inZ=Math.abs(l-e.x)<.6?1:.25,e.z>o.z-.9&&Math.abs(e.vz)<.5&&(h.stuck+=t,h.stuck>.35&&(h.try++,h.stuck=0));break}{let o=this.portals.filter(h=>h.kind!=="far"||!0).filter(h=>Math.abs(h.z-(e.z+4))<4.5&&Math.abs(h.z-e.z)<8&&h.z>e.z);if(o.length>=3&&!this.mazePaths.some(h=>e.z>h.box[2]&&e.z<h.box[3])){let h=o[(e.slot*7+Math.floor(this.time/9))%o.length];e.inX=ti((h.x-e.x)*.8,-1,1)}}let i=!1,s=!1,a=e.z+1.3,c=e.ground?_n(e.ground,e.z):e.y;for(let o of this.blocks)o.gone||o.wall||e.x>=o.x0+o.offX&&e.x<=o.x1+o.offX&&a>=o.z0&&a<=o.z1&&(s=!0,_n(o,a)>c+.35&&(i=!0));!s&&!this.pads.some(o=>Math.abs(o.z-e.z)<2.5)&&(i=!0);for(let o of this.sweepers)for(let h=0;h<(o.arms||1);h++){let l=o.angle+h*Math.PI/(o.arms||1),u=Math.cos(l)*o.len,d=Math.sin(l)*o.len,p=ti(((e.x-o.x)*u+(e.z-o.z)*d)/(u*u+d*d),-1,1);Math.hypot(e.x-(o.x+u*p),e.z-(o.z+d*p))<1.7&&(i=!0)}for(let o of this.boulders)Math.abs(o.x-e.x)<o.radius+.6&&o.z>e.z&&o.z-e.z<3.2&&(i=!0);for(let o of this.jets)o.state>=1&&o.z>e.z&&o.z-e.z<2.2&&Math.abs(o.x-e.x)<o.r+.5&&(e.inZ=.1,e.inX=Math.sign(e.x-o.x||1));for(let o of this.fallers)!o.landed&&Math.abs(o.z-e.z-1.5)<2&&Math.abs(o.x-e.x)<o.r+.8&&(e.inX=Math.sign(e.x-o.x||1));i&&e.ground&&e.botCool<=0&&Math.random()<.55&&(e.jump=!0,e.holdJump=!0,e.botCool=.35),e.ground&&!i&&(e.holdJump=!1)}},Uf=(r,e,t)=>r<e?Math.min(e,r+t):Math.max(e,r-t);var Mi=["skeleton","dracula","pumpkin","voodoo","ghost","zombie","plague_doctor","puppeteer"],nu={skeleton:"\u0421\u043A\u0435\u043B\u0435\u0442",dracula:"\u0414\u0440\u0430\u043A\u0443\u043B\u0430",pumpkin:"\u0422\u044B\u043A\u0432\u0430",voodoo:"\u0412\u0443\u0434\u0443",ghost:"\u041F\u0440\u0438\u0437\u0440\u0430\u043A",zombie:"\u0417\u043E\u043C\u0431\u0438",plague_doctor:"\u0427\u0443\u043C\u043D\u043E\u0439 \u0434\u043E\u043A\u0442\u043E\u0440",puppeteer:"\u041A\u0443\u043A\u043E\u043B\u044C\u043D\u0438\u043A"},Dy=150,kn=3.5,vi=1/120,ba=class{constructor(e,t,n=1,i){this.host=e;this.myChar=t;this.net=i;let s=new URLSearchParams(location.search),a=s.get("t"),c=a?eu[Number(a)-1]??(eu.includes(a)?a:""):"";this.course=new kc(n,i?i.seed:Number(s.get("seed"))||Math.random()*1e9|0,c),this.night=this.course.theme==="graveyard",this.crypt=this.course.theme==="crypt",this.manor=this.course.theme==="manor"||this.crypt,this.limit=this.crypt?210:Dy;let o=matchMedia("(pointer:coarse)").matches;this.renderer=new Nc({antialias:!o||devicePixelRatio<2,powerPreference:"high-performance"}),this.pixelRatio=Math.min(devicePixelRatio,o?1.5:1.35),this.renderer.setPixelRatio(this.pixelRatio),this.renderer.outputColorSpace=mt,this.renderer.toneMapping=aa,this.renderer.toneMappingExposure=1.15,this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=Oo,e.appendChild(this.renderer.domElement),this.hud=document.getElementById("hud"),addEventListener("resize",()=>this.resize()),this.resize(),this.input()}renderer;scene=new Ur;camera=new Ot(55,1,.3,900);course;night;manor;crypt;limit;runners=[];me;clock=0;acc=0;sun;fill;mist=[];pollen;puffs=[];grassMat;looks=new Map;blockMeshes=new Map;sweeperMeshes=[];cpArches=[];lastCp=0;pend=[];rams=[];padMeshes=[];warnPlanes=new Map;belts=[];composer;lastSection="";ghosts=[];lastTp=0;snd=new Hc;sndState={count:9,falls:0,stun:0,fin:!1,step:0,gates:new Map,hooks:new Map,jets:new Map,pads:new Map,crumbs:new Set};sunGlow;moonGlow;rays=[];ray=new sa;faded=new Set;soft=[];jetFx=[];mazeBlend=0;portalFx=[];boulderPool=[];gltf=new Fc;texLoader=new Bi;cache=new Map;camTarget=new L;pixelRatio;frameAvg=16;last=0;blobs=new Map;dots=new Map;keys=new Set;stick={id:-1,ox:0,oy:0,x:0,y:0};hud;net;async load(e){let t=this.night||this.manor,n=this.manor,i=this.tex(t?"sky_night.jpg":"sky.jpg",!1);i.mapping=ir,this.scene.background=i;let s=new ur(this.renderer);this.scene.environment=s.fromEquirectangular(await Oy(i)).texture,s.dispose(),this.scene.environmentIntensity=n?.3:t?.55:.75,this.scene.backgroundIntensity=t?.85:1,n&&(this.scene.background=new Ae(this.crypt?198149:263432)),this.scene.fog=this.crypt?new Pi(new Ae(.03,.05,.045),9,58):n?new Pi(new Ae(.025,.03,.05),10,70):t?new Pi(new Ae(.13,.18,.28),18,170):new Pi(new Ae(.74,.6,.56),45,330),this.scene.add(this.crypt?new Hi(4881e3,2233868,.8):n?new Hi(4610188,2365196,.5):t?new Hi(7375048,1316882,.55):new Hi(12568831,4010788,.35)),t&&(this.renderer.toneMappingExposure=n?1.3:1.2),this.sun=this.crypt?new zn(9425080,1.3):n?new zn(11125503,4.2):t?new zn(11848959,2.4):new zn(16759160,3.4),this.sun.castShadow=!this.crypt;let a=!matchMedia("(pointer:coarse)").matches;if(this.sun.shadow.mapSize.set(a?2048:1024,a?2048:1024),Object.assign(this.sun.shadow.camera,{left:-24,right:24,top:24,bottom:-24,near:1,far:140}),this.sun.shadow.bias=-5e-4,this.sun.shadow.normalBias=.04,this.scene.add(this.sun,this.sun.target),this.fill=new zn(this.crypt?16754792:n?16757626:t?11057407:13161215,this.crypt?1.6:n?1.25:t?1.1:1.7),this.scene.add(this.fill,this.fill.target),this.atmosphere(),this.night){let f=new Xt(new Wt({map:Bt(!0),color:10469631,transparent:!0,opacity:.45,depthWrite:!1,blending:Et,fog:!1}));f.scale.set(200,200,1),this.moonGlow=f,this.scene.add(f)}if(!t){let f=new Xt(new Wt({map:Bt(!0),color:16756848,transparent:!0,opacity:.55,depthWrite:!1,blending:Et,fog:!1}));f.scale.set(260,160,1),f.userData.sun=!0,this.sunGlow=f,this.scene.add(f);for(let M=0;M<5;M++){let T=new J(new yt(14+M*4,420),new ot({map:Yy(),color:16763024,transparent:!0,opacity:.07,depthWrite:!1,blending:Et,fog:!1,side:Ct}));T.userData.k=M,this.rays.push(T),this.scene.add(T)}}let c={floor:this.mat("old_wooden_floor_02",2.5,!0),flag:this.mat("mossy_cobblestone",2.5,!1,9079434),wall:this.mat("castle_brick_07",3),beam:this.mat("medieval_wood",2,!0),cobble:this.mat("mossy_cobblestone",3,!1,this.night?15132912:16777215),brick:this.mat("mossy_brick",3,!0),dark:this.mat("dark_wooden_planks",2.2,!0),mud:this.mat("brown_mud_leaves_01",3,!1,14212296),grass:this.mat("leafy_grass",3.2,!1,12901514),rock:this.mat("rock_face_03",4,!0),plank:this.mat("brown_planks_05",2.2,!0),stone:this.mat("mossy_rock",3.2),bark:this.mat("bark_brown_02",1),ground:this.mat("forest_ground_04",6)};for(let f of this.course.blocks){let M={grass:c.grass,plank:c.plank,stone:c.stone,cobble:c.cobble,brick:c.brick,dark:c.dark,mud:c.mud,floor:c.floor,flag:c.flag}[f.mat],T=f.mat==="plank"?c.plank:f.mat==="dark"?c.dark:this.manor?f.mat==="floor"?c.beam:c.wall:this.night?c.brick:c.rock,y=M;if(f.conveyor){let S=M.clone();for(let _ of["map","normalMap","roughnessMap"])S[_]&&(S[_]=S[_].clone(),S[_].needsUpdate=!0,this.belts.push(S[_]));y=S}if(f.wall&&(y=c.wall,T=c.wall),f.ghost){let S=c.wall.clone();S.transparent=!0,S.opacity=.92,S.emissive=new Ae(2817946),S.emissiveIntensity=0,y=S,T=S,this.ghosts.push(S)}if(f.crumbles&&!f.sink&&f.fake,f.mat!=="grass"&&!f.fake&&this.course.sections.some(S=>S.name==="falsebridge"&&f.z0>=S.z0&&f.z1<=S.z1)&&!f.land){let S=y.clone();S.color=new Ae(13819074),y=S}let E=new J(Uy(f),[y,f.wall?T:this.shaded(T)]);if(E.geometry.computeBoundingSphere(),f.wall&&(E.castShadow=!0),f.tilt){let S=(f.x0+f.x1)/2,_=(f.z0+f.z1)/2;E.geometry.translate(-S,-f.y0,-_),E.userData.pivot=[S,f.y0,_]}if((f.gear||f.cart)&&(E.visible=!1,E.userData.hidden=!0),f.crumbles&&!f.sink){let S=new J(new yt(f.x1-f.x0-.1,f.z1-f.z0-.1).rotateX(-Math.PI/2),new ot({map:qy(),transparent:!0,opacity:0,depthWrite:!1,color:1182214}));S.position.set((f.x0+f.x1)/2,f.y0+.03,(f.z0+f.z1)/2),E.add(S),E.userData.crack=S}let w=this.manor?f.mat==="floor"?c.beam:c.wall:this.night?c.brick:f.mat==="grass"?null:f.mat==="plank"?c.bark:c.rock;if(w&&!f.trapPeriod&&!f.wall&&f.x1-f.x0>2&&f.y0===f.y1){let S=f.y0,_=.28,v=.2,R=(C,I,F,N)=>{let U=new J(new ke(C,v,I),w);U.position.set(F,S-v/2+.07,N),U.castShadow=!1,U.receiveShadow=!0,E.add(U)};R(_,f.z1-f.z0,f.x0+_/2-.04,(f.z0+f.z1)/2),R(_,f.z1-f.z0,f.x1-_/2+.04,(f.z0+f.z1)/2),f.land||(R(f.x1-f.x0,_,(f.x0+f.x1)/2,f.z0+_/2-.04),R(f.x1-f.x0,_,(f.x0+f.x1)/2,f.z1-_/2+.04))}if(f.trapPeriod){let S=new J(new yt(f.x1-f.x0-.1,f.z1-f.z0-.1).rotateX(-Math.PI/2),new ot({color:16722450,transparent:!0,opacity:.5,depthWrite:!1,blending:Et}));S.position.set((f.x0+f.x1)/2,f.y0+.03,(f.z0+f.z1)/2),S.visible=!1,this.scene.add(S),this.warnPlanes.set(f,S)}(f.mat==="grass"||f.mat==="mud")&&!(f.gear||f.cart||f.tilt||f.trapPeriod||f.wall||f.fake||f.driftAmp||f.x1-f.x0<6)&&this.grassOn(f),E.receiveShadow=!0,E.castShadow=f.mat==="plank"||f.crumbles,this.blockMeshes.set(f,E),this.scene.add(E)}if(!this.night){let f=new J(new yt(520,540).rotateX(-Math.PI/2),c.ground);f.receiveShadow=!1,f.position.set(0,-34,150),zy(f.geometry,6,"xz"),this.scene.add(f)}let o=new _t(.42,.42,1,14,1);o.rotateZ(Math.PI/2);for(let f of this.course.sweepers){let M=new Je;for(let E=0;E<(f.arms||1);E++){let w=new J(this.manor?new ke(1,.62,.62):o,this.manor?c.beam:this.night?c.dark:c.bark);w.scale.set(f.len*2,1,1),w.rotation.y=E*Math.PI/(f.arms||1),w.castShadow=!0,M.add(w)}this.sweeperMeshes.push(M),this.scene.add(M);let T=f.y-this.course.spawnY(f.z)+1.05,y=new J(new _t(.55,.65,T,12),this.night?c.brick:c.bark);y.position.set(f.x,f.y+.5-T/2,f.z),y.castShadow=!0,this.scene.add(y)}let h=await this.model("env/boulder_01.glb");e(.15);let l=new pn(.13,.035,6,12),u=yn("rusty_metal_02",10132122,.3);for(let f of this.course.pendulums){let M=new Je;M.position.set(f.px,f.py,f.pz);let T=Math.round(f.len/.2),y=new qt(l,u,T),E=new Fe,w=new Rt;for(let C=0;C<T;C++)w.setFromEuler(new an(0,C%2?Math.PI/2:0,Math.PI/2)),E.compose(new L(0,-C*.2-.1,0),w,new L(1,1,1)),y.setMatrixAt(C,E);y.castShadow=!0,M.add(y);let S=this.manor?Vy():this.night?By():ni(h.scene,f.radius*2.1,"max");S.position.y=-f.len,M.add(S),this.scene.add(M);let _=this.course.spawnY(f.pz),v=this.night?5.2:5.4;if(!this.manor)for(let C of[-1,1]){let I=new J(this.night?new ke(.9,f.py-_,.9):new _t(.45,.5,f.py-_,10),this.night?c.brick:c.bark);I.position.set(C*v,(_+f.py)/2,f.pz),I.castShadow=!0,this.scene.add(I)}let R=new J(o,this.manor?c.beam:this.night?c.dark:c.bark);R.scale.set(v*2+.8,.9,.9),R.position.set(0,f.py+.3,f.pz),R.castShadow=!0,this.scene.add(R),this.pend.push(M)}for(let f of this.course.pushers){let M=new Je,T=f.reach+1.4,y=new J(new ke(T,1.5,f.d-.2),this.manor?c.beam:this.night?c.dark:c.bark);y.position.x=T/2-1,y.castShadow=!0;let E=new J(new ke(.18,1.7,f.d),u);E.position.x=-1.02,M.add(y,E);for(let S=0;S<6;S++){let _=new J(new Yn(.1,.35,8).rotateZ(Math.PI/2),u);_.position.set(-1.25,-.5+S%2*.9,-f.d/2+.4+Math.floor(S/2)*(f.d-.8)/2),M.add(_)}M.position.set(f.side*(f.wallX+1),f.y+.8,f.z),M.scale.x=f.side,M.userData.p=f,this.rams.push(M),this.scene.add(M);let w=new J(new ke(1.2,2.6,f.d+.8),this.manor?c.wall:this.night?c.brick:c.rock);w.position.set(f.side*(f.wallX+.6),f.y+1.3,f.z),w.castShadow=!0,this.scene.add(w)}for(let f of this.course.portals){let M=new Je;M.position.set(f.x,f.y,f.z);let T=new J(new pn(1.25,.2,10,32),c.wall);T.position.y=1.35,T.castShadow=!0,M.add(T);let y=new J(new Tn(1.1,40),new ot({map:Xy(),color:7012296,transparent:!0,opacity:.85,depthWrite:!1,blending:Et,side:Ct}));y.position.y=1.35,M.add(y);let E=new Xt(new Wt({map:Bt(!0),color:4521904,transparent:!0,opacity:.7,depthWrite:!1,blending:Et}));E.scale.setScalar(4.2),E.position.y=1.35,M.add(E);let w=new J(new Tn(1.8,24).rotateX(-Math.PI/2),new ot({map:Bt(!0),color:2817952,transparent:!0,opacity:.4,depthWrite:!1,blending:Et}));w.position.y=.04,M.add(w),M.userData.disc=y,this.portalFx.push(M),this.scene.add(M)}this.buildMech(c);for(let f of this.course.jets){let M=new Je;if(M.position.set(f.x,f.y,f.z),f.kind==="fire"){let T=yn("metal_grate_rusty",16777215,.6).clone();T.emissive=new Ae(16726528),T.emissiveIntensity=0;let y=new J(new _t(.75,.8,.08,20),T);y.position.y=.04,M.add(y);let E=new Je;for(let w=0;w<3;w++){let S=new Xt(new Wt({map:Bt(!0),color:w?16742938:16769162,transparent:!0,depthWrite:!1,blending:Et}));S.scale.set(1.6-w*.3,2.8-w*.5,1),S.position.y=1.2+w*.5,E.add(S)}M.add(E),this.jetFx.push({j:f,o:y,f:E})}else{let T=new Je,y=new J(new _t(1.2,1.2,1.1,24),yn("rusty_metal_02",10526880,.6));y.castShadow=!0;let E=new J(new _t(.18,.18,8,10),yn("metal_plate_02",10132122,.3));E.position.y=4.5,T.add(y,E);let w=new J(new js(1.3,1.5,32).rotateX(-Math.PI/2),new ot({color:16726554,transparent:!0,opacity:0,depthWrite:!1}));w.position.y=.04,M.add(T,w),this.jetFx.push({j:f,o:w,f:T})}this.scene.add(M)}for(let f of this.course.pads){let M=new J(new _t(f.r,f.r*1.08,.22,32),yn("rusty_metal_02",16777215,.5));M.position.set(f.x,f.y+.11,f.z),this.scene.add(M);let T=new J(new Tn(f.r*.86,32).rotateX(-Math.PI/2),new st({map:Bf(),emissive:16757306,emissiveMap:Bf(),emissiveIntensity:1.1,roughness:.5}));T.position.set(f.x,f.y+.23,f.z),this.padMeshes.push(T),this.scene.add(T)}this.boulderSrc=h.scene;let d=await this.model("env/wine_barrel_01.glb");for(let f=0;f<6;f++){let M=d?ky(ni(d.scene,2.4,"max")):ni(h.scene,2.4,"max");M.visible=!1,this.boulderPool.push(M),this.scene.add(M)}let p=this.course.spawnY(this.course.finishZ);for(let f of[-1,1]){let M=new J(this.night||this.manor?new ke(1.3,7,1.3):new _t(.55,.6,7,12),this.night?c.brick:c.bark);M.position.set(f*7.5,p+3.5,this.course.finishZ),M.castShadow=!0,this.scene.add(M)}let g=new J(o,c.bark);g.scale.set(16.5,1.1,1.1),g.position.set(0,p+7.1,this.course.finishZ),this.scene.add(g);let x=new J(new yt(13,1.7),new st({map:Fy(this.manor?"\u0421\u0412\u041E\u0411\u041E\u0414\u0410":"\u0424\u0418\u041D\u0418\u0428"),side:Ct,roughness:.85}));if(x.position.set(0,p+6,this.course.finishZ),x.rotation.y=Math.PI,this.scene.add(x),this.checkpointArches(this.manor?c.beam:this.night?c.brick:c.bark),await(this.manor?this.decorateManor(c,e):this.night?this.decorateNight(c.stone,e):this.decorate(e)),this.buildGrass(),e(.8),this.net){let f=this.net;for(let M=0;M<f.roster.length;M++){let T=f.roster[M],y=T.id===f.selfId&&!f.spectator,E=new ya(T.id,y?"\u0412\u044B":T.name,Mi.includes(T.char)?T.char:Mi[M%Mi.length],M,!1);E.remote=!y,E.x=(M%4-1.5)*2.2,E.z=-1.5-Math.floor(M/4)*2.2,this.runners.push(E),await this.addLook(E),e(.8+.2*(M+1)/f.roster.length)}this.me=this.runners.find(M=>!M.remote)??this.runners[0],f.spectator&&document.body.classList.add("spectator")}else{let f=Mi.filter(T=>T!==this.myChar),M=[this.myChar,...f.sort(()=>Math.random()-.5).slice(0,5)];for(let T=0;T<M.length;T++){let y=new ya("p"+T,T===0?"\u0412\u044B":nu[M[T]],M[T],T,T>0);y.x=(T%3-1)*2.4,y.z=-1.5-Math.floor(T/3)*2.4,this.runners.push(y),await this.addLook(y),e(.8+.2*(T+1)/M.length)}this.me=this.runners[0]}let m=Number(new URLSearchParams(location.search).get("z"));if(m)for(let f of this.runners)f.z=m+f.slot*.3,f.x=(f.slot%3-1)*1.5,f.y=this.course.spawnY(m)+.5,f.progress=m,f.checkpoint=this.course.checkpoints.filter(M=>M<=m).length-1;this.camTarget.set(this.me.x,this.me.y,this.me.z)}async addLook(e){let t=await this.model(`chars/${e.character}.glb`),n=zc(t.scene);n.traverse(o=>{let h=o;if(h.isMesh){h.castShadow=!0,h.frustumCulled=!1;let l=h.material;l.side=Ct,l.envMapIntensity=1.6,l.roughness=.6,l.emissive=new Ae(1,1,1),l.emissiveMap=l.map,l.emissiveIntensity=.38,l.color.multiplyScalar(1.25)}});let i=new J(new Tn(.55,24).rotateX(-Math.PI/2),new ot({map:Bt(!0),color:0,transparent:!0,opacity:.55,depthWrite:!1}));i.renderOrder=1,this.scene.add(i),this.blobs.set(e,i),this.scene.add(n);let s=new ia(n),a={};for(let o of t.animations){let h=s.clipAction(o);a[o.name]=h,(o.name==="jump"||o.name==="stun")&&(h.setLoop(o.name==="stun"?Tc:Sc,1/0),h.clampWhenFinished=!0)}a.idle?.play();let c=document.createElement("div");c.className="tag"+(e.bot?"":" me"),c.textContent=e.name,this.hud.appendChild(c),this.looks.set(e,{root:n,mixer:s,acts:a,cur:"idle",tag:c,squash:0,prevVy:0})}async decorate(e){let t=11,n=()=>(t=t*16807%2147483647)/2147483647,i={},s=(l,u,d,p,g,x=n()*Math.PI*2)=>(i[l]??=[]).push(new Fe().compose(new L(u,d,p),new Rt().setFromAxisAngle(new L(0,1,0),x),new L(g,g,g))),a=this.course.finishZ+30;for(let l=-40;l<a+40;l+=8+n()*7)for(let u of[-1,1])s(n()<.55?"fir_tree_01_c":"pine_tree_01_c",u*(34+n()*46),-34,l+n()*5,30+n()*14);for(let l=-60;l<a+120;l+=26+n()*18)for(let u of[-1,1])s("namaqualand_cliff_01",u*(170+n()*70),-46,l,55+n()*35);for(let l=0;l<6;l++)s("namaqualand_cliff_01",(n()-.5)*260,-46,a+200+n()*80,60+n()*40);for(let l of this.course.blocks){if(l.mat==="plank"||l.crumbles||l.gear||l.cart||l.tilt||l.trapPeriod||l.wall||l.fake||l.driftAmp||l.x1-l.x0<6)continue;let u=l.z1-l.z0;for(let d=0;d<u*.8;d++){let p=n()<.5?-1:1,g=p>0?l.x1-1-n()*1.3:l.x0+1+n()*1.3,x=l.z0+n()*u,m=_n(l,x),f=n();l.mat==="grass"&&f<.5?s("grass_medium_01",g,m,x,.7+n()*.5):f<.74?s("fern_02",g,m,x,.8+n()*.6):f<.88?s("rock_moss_set_01",g,m-.1,x,.8+n()*.7):f<.95?s("shrub_01",g,m,x,1.1+n()*.8):s("tree_stump_01",g,m,x,.9+n()*.4)}l.x1-l.x0>12&&u>14&&n()<.7&&s("boulder_01",n()<.5?l.x0+1.4:l.x1-1.4,_n(l,l.z0+u/2)-.3,l.z0+u/2,2.4);for(let d=0;d<0;d++){let p=l.z0+n()*u,g=n()<.5?-1:1;s("root_cluster_01",g>0?l.x1+.1:l.x0-.1,_n(l,p)-1.6,p,2.2,g>0?Math.PI/2:-Math.PI/2)}}let c=this.course.spawnY(this.course.finishZ);s("fir_tree_01_c",-9.5,c,this.course.finishZ+7,17),s("dead_tree_trunk",9.5,c,this.course.finishZ+6,3);let o=Object.keys(i),h=0;await Promise.all(o.map(async l=>{let u=await this.model(`env/${l}.glb`),d=/tree|grass|fern|shrub|cliff/.test(l)?"height":"max",p=ni(u.scene,1,d);p.updateMatrixWorld(!0);let g=/cliff/.test(l)||/tree_01_c/.test(l);p.traverse(x=>{let m=x;if(!m.isMesh)return;let f=new qt(m.geometry,m.material,i[l].length),M=m.matrixWorld.clone();i[l].forEach((y,E)=>f.setMatrixAt(E,y.clone().multiply(M))),f.castShadow=!g,f.receiveShadow=!g,f.computeBoundingSphere(),this.scene.add(f);let T=m.material;(T.alphaTest>0||T.transparent)&&(T.transparent=!1,T.alphaTest=.45,T.side=Ct)}),e(.15+.65*++h/o.length)}))}mech={gears:[],carts:[],gates:[],fans:[],hooks:[],chasers:[],tiltLamps:[],sweepLamps:[]};buildMech(e){let t=this.course,n=yn("metal_plate_02",14211806,.35),i=yn("rusty_metal_02",9079434,.5),s=yn("rusty_metal_02",16777215,.6),a=()=>new st({color:3344901,emissive:16722448,emissiveIntensity:0});for(let o of t.gears){let h=new Je;h.position.set(o.x,o.y,o.z);let l=new as,u=o.teeth,d=o.r+.28,p=o.r-.05;for(let E=0;E<u*4;E++){let w=E/(u*4)*Math.PI*2,S=E%4===1||E%4===2?d:p,_=Math.cos(w)*S,v=Math.sin(w)*S;E===0?l.moveTo(_,v):l.lineTo(_,v)}let g=new zi;g.absarc(0,0,o.r*.3,0,Math.PI*2,!0),l.holes.push(g);for(let[E,w]of o.gaps){let S=new zi;S.moveTo(Math.cos(E)*o.r*.38,Math.sin(E)*o.r*.38),S.absarc(0,0,o.r*.93,E,w,!1),S.lineTo(Math.cos(w)*o.r*.38,Math.sin(w)*o.r*.38),S.absarc(0,0,o.r*.38,w,E,!0),l.holes.push(S)}let x=new $s(l,{depth:.55,bevelEnabled:!0,bevelSize:.05,bevelThickness:.05,bevelSegments:1,curveSegments:24});x.rotateX(Math.PI/2),x.translate(0,0,0);let m=new J(x,n);m.castShadow=m.receiveShadow=!0;let f=new Je;f.add(m);let M=new J(new _t(o.r*.32,o.r*.32,.62,24),i);M.position.y=-.27,f.add(M);for(let E=0;E<6;E++){let w=new J(new _t(.09,.09,.1,8),s),S=E/6*Math.PI*2;w.position.set(Math.cos(S)*o.r*.22,.05,Math.sin(S)*o.r*.22),f.add(w)}let T=new J(new ke(o.r*.55,.04,.18),new st({color:14197306,metalness:.3,roughness:.6}));T.position.set(o.r*.62,.03,0),f.add(T),h.add(f);let y=new J(new _t(.35,.45,14,12),i);y.position.y=-7.4,h.add(y),this.scene.add(h),this.mech.gears.push([o,f])}let c=new Map;for(let o of t.carts)c.set(o.cart.lane,o);for(let[,o]of c){let h=o.cart.len,l=(o.z0+o.z1)/2,u=o.y0;for(let p of[-.75,.75]){let g=new J(new ke(h*2+4,.12,.1),n);g.position.set(0,u-.95,l+p),this.scene.add(g)}let d=new qt(new ke(.25,.12,2.1),e.bark,Math.floor(h*2/.9));for(let p=0;p<d.count;p++)d.setMatrixAt(p,new Fe().setPosition(-h+p*.9,u-1.06,l));this.scene.add(d);for(let p of[-1,1]){let g=new Je,x=new J(new ke(2.2,4.2,3.2),e.rock??i);x.position.set(p*(h+1.6),u+.6,l),g.add(x);let m=new J(new yt(2.4,2.6),new ot({color:328707}));m.position.set(p*(h+.48),u+.1,l),m.rotation.y=-p*Math.PI/2,g.add(m);let f=new J(new ke(.4,.4,3),e.bark);f.position.set(p*(h+.45),u+1.5,l),g.add(f),this.scene.add(g)}}for(let o of t.carts){let h=new Je,l=o.x1-o.x0,u=o.z1-o.z0,d=new J(new ke(l,.9,u),s);d.position.y=-.45,d.castShadow=!0,h.add(d);let p=new J(new ke(l-.2,.06,u-.2),yn("metal_grate_rusty",16777215,.8));p.position.y=-.02,h.add(p);for(let f of[-1,1])for(let M of[-1,1]){let T=new J(new ke(f?.12:l,.16,M?.12:u),i)}let g=new ke(l+.1,.12,.12),x=new J(g,i),m=x.clone();x.position.set(0,.02,-u/2),m.position.set(0,.02,u/2),h.add(x,m);for(let f of[-.75,.75])for(let M of[-.75,.75]){let T=new J(new _t(.26,.26,.14,14).rotateX(Math.PI/2),i);T.position.set(f*l/2.2,-.9,M),h.add(T)}h.position.set(0,o.y0,(o.z0+o.z1)/2),this.scene.add(h),this.mech.carts.push([o,h])}for(let o of t.gates){let h=new J(new ke(o.halfW*2+2.4,.6,.8),i);h.position.set(0,o.y+4.2,o.z),this.scene.add(h);let l=a();for(let p of[-1,1]){let g=new J(new wn(.18,12,8),l);g.position.set(p*(o.halfW+.6),o.y+3.6,o.z-.45),this.scene.add(g)}let u,d;if(o.kind==="slide"){let p=()=>{let g=new Je,x=new J(new ke(o.halfW,3.6,.3),n);x.position.set(o.halfW/2,1.8,0),x.castShadow=!0,g.add(x);for(let f=0;f<4;f++){let M=new J(new ke(o.halfW,.12,.36),i);M.position.set(o.halfW/2,.4+f*.95,0),g.add(M)}let m=new J(new ke(.14,3.6,.4),new st({color:14201402,metalness:.4,roughness:.5}));return m.position.set(o.halfW,1.8,0),g.add(m),g};u=p(),d=p(),d.scale.x=-1,u.position.set(-o.halfW*2,o.y,o.z),d.position.set(o.halfW*2,o.y,o.z)}else{u=new Je;for(let p=0;p<9;p++){let g=new J(new ke(.14,3.4,.14),n);g.position.set(-o.halfW+.2+p*(o.halfW*2-.4)/8,1.7,0),u.add(g);let x=new J(new Yn(.12,.35,6).rotateX(Math.PI),n);x.position.set(g.position.x,-.15,0),u.add(x)}for(let p=0;p<3;p++){let g=new J(new ke(o.halfW*2,.14,.18),i);g.position.y=.5+p*1.2,u.add(g)}u.position.set(0,o.y,o.z),d=new Je}this.scene.add(u,d),this.mech.gates.push([o,u,d,h,l])}for(let o of t.fans){let h=new Je;h.position.set(o.x,o.y,o.z),h.rotation.y=Math.atan2(o.dx,o.dz);let l=new J(new pn(1.25,.16,10,32),i);h.add(l);let u=new J(new pn(.6,.04,6,24),n);u.position.z=.2,h.add(u);let d=new Je;for(let y=0;y<5;y++){let E=new J(new ke(.32,1.1,.05),n);E.position.y=.58,E.rotation.y=.5;let w=new Je;w.add(E),w.rotation.z=y/5*Math.PI*2,d.add(w)}d.add(new J(new wn(.2,12,8),i)),h.add(d);let p=new J(new ke(.4,o.y-this.course.spawnY(o.z)+4,.4),i);p.position.y=-(o.y-this.course.spawnY(o.z)+4)/2-1,h.add(p);let g=a(),x=new J(new wn(.15,10,8),g);x.position.set(0,1.5,0),h.add(x);let m=70,f=new Float32Array(m*3);for(let y=0;y<m;y++)f[y*3]=(Math.random()-.5)*2*o.half,f[y*3+1]=(Math.random()-.3)*2,f[y*3+2]=Math.random()*o.reach;let M=new xt;M.setAttribute("position",new Pt(f,3));let T=new Di(M,new fi({map:Bt(!0),size:.25,color:15262940,transparent:!0,opacity:.5,depthWrite:!1}));T.frustumCulled=!1,h.add(T),this.scene.add(h),this.mech.fans.push([o,d,g,T])}for(let o of t.hooks){let h=this.course.spawnY(o.z),l=new J(new ke(1.2,8,1.2),i);l.position.set(o.pillarX+o.side*.4,o.y-3,o.z),this.scene.add(l);let u=a(),d=new J(new wn(.2,10,8),u);d.position.set(o.pillarX-o.side*.3,o.y+1,o.z),this.scene.add(d);let p=new Je,g=new J(new _t(.09,.09,.9,8).rotateZ(Math.PI/2),n);p.add(g);let x=new J(new pn(.38,.09,8,20,Math.PI*1.3),n);x.position.x=-.5,x.rotation.z=Math.PI*.35,p.add(x);let m=new J(new Yn(.11,.3,8),n);m.position.set(-.5,.38,0),p.add(m),p.scale.x=o.side,this.scene.add(p);let f=new J(new _t(.06,.06,1,6).rotateZ(Math.PI/2),i);this.scene.add(f),this.mech.hooks.push([o,p,f,u])}for(let o of t.chasers){let h=new J(new Fi(o.r,4),e.rock??n);h.castShadow=!0;let l=new Je;l.add(h),this.scene.add(l),this.mech.chasers.push([o,l]);for(let u=1;u<o.path.length-1;u+=1){let[d,p]=o.path[u],g=new J(new _t(.35,.4,3.4,12),e.rock??n);g.position.set(d+2.6*(u%2?1:-1),o.y+1.7,p+1.5),g.castShadow=!0,g.userData.col=[o,u],this.scene.add(g),this.columns.push(g)}}for(let o of t.tilts)if(o.tilt.axis==="xz"){let h=[];for(let[l,u]of[[o.x0,o.z0],[o.x1,o.z0],[o.x0,o.z1],[o.x1,o.z1]]){let d=a();h.push(d);let p=new J(new _t(.08,.08,3,6),i);p.position.set(l*1.12,o.y0+1.5,u),this.scene.add(p);let g=new J(new wn(.22,10,8),d);g.position.set(l*1.12,o.y0+3.1,u),this.scene.add(g)}this.mech.tiltLamps.push([o,h])}for(let o of t.sweepers)if(o.vary){let h=a(),l=new J(new wn(.25,10,8),h);l.position.set(o.x,o.y+1.3,o.z),this.scene.add(l),this.mech.sweepLamps.push([o,h])}}columns=[];syncMech(e){let t=this.course,n=t.time;for(let[o,h]of this.mech.gears)h.rotation.y=-o.angle;for(let[o,h]of this.mech.carts)h.position.x=o.offX,h.visible=Math.abs(o.offX)<o.cart.len-.2;for(let[o,h,l,,u]of this.mech.gates)if(u.emissiveIntensity=o.warn?Math.sin(n*30)>0?3:.2:o.open<.5?1.2:0,o.kind==="slide"){let d=o.halfW*(1-o.open);h.position.x=-o.halfW-o.halfW+d,l.position.x=o.halfW+o.halfW-d}else h.position.y=o.y+3.2*o.open+.1;for(let[o,h,l,u]of this.mech.fans){h.rotation.z=o.spin,l.emissiveIntensity=o.on>.05?2.5:(n/o.period+o.phase)%1>.9&&Math.sin(n*25)>0?2:0,u.material.opacity=.55*o.on;let d=u.geometry.getAttribute("position");for(let p=0;p<d.count;p++){let g=d.getZ(p)+e*18*o.on;g>o.reach&&(g-=o.reach),d.setZ(p,g)}d.needsUpdate=!0}for(let[o,h,l,u]of this.mech.hooks){let d=o.pillarX-o.side*o.reach*o.ext;h.position.set(d,o.y,o.z),u.emissiveIntensity=o.state===1?Math.sin(n*28)>0?3:.2:0;let p=Math.abs(d-o.pillarX)+.01;l.scale.set(p,1,1),l.position.set((d+o.pillarX)/2,o.y,o.z),l.visible=o.ext>.02}for(let[o,h]of this.mech.chasers)h.visible=o.active,h.position.set(o.x,o.y+o.r,o.z),h.rotation.x=o.spin,h.rotation.y=0;for(let o of this.columns){let[h,l]=o.userData.col,[u,d]=h.path[l];h.active&&Math.hypot(h.x-u,h.z-d)<3&&(o.userData.fall=1),h.active||(o.userData.fall=0);let g=o.userData.fall?Math.min(1.4,(o.rotation.z?Math.abs(o.rotation.z):0)+e*2.5):Math.max(0,Math.abs(o.rotation.z)-e);o.rotation.z=g*(l%2?1:-1)}for(let[o,h]of this.mech.tiltLamps)for(let l of h)l.emissiveIntensity=o.tilt.warn?Math.sin(n*22)>0?3:.3:0;for(let[o,h]of this.mech.sweepLamps)h.emissiveIntensity=o.boost===1?3:o.boost?Math.sin(n*24)>0?2.5:.2:0;let i=this.me,s=this.sndState,a=(o,h)=>Math.hypot(o-i.x,h-i.z);i.falls>s.falls&&(s.falls=i.falls,this.snd.splash(),navigator.vibrate?.(40)),i.stun>.5&&s.stun<=.25&&(this.snd.hit(0),navigator.vibrate?.(35)),s.stun=i.stun,i.ground&&Math.hypot(i.vx,i.vz)>2&&(s.step+=e*Math.hypot(i.vx,i.vz),s.step>1.6&&(s.step=0,this.snd.step(i.ground.mat)));for(let o of t.gates)o.warn&&!s.gates.get(o)&&this.snd.alarm(a(0,o.z)),o.open<.05&&o.lastOpen>=.05&&this.snd.metal(a(0,o.z)),s.gates.set(o,o.warn);for(let o of t.hooks){let h=s.hooks.get(o)??0;o.state===1&&h!==1&&this.snd.alarm(a(o.pillarX,o.z)),o.state===2&&h!==2&&this.snd.chain(a(o.pillarX,o.z)),s.hooks.set(o,o.state)}for(let o of t.jets){let h=s.jets.get(o)??0;o.state===2&&h!==2&&(o.kind==="fire"?this.snd.fire(a(o.x,o.z)):this.snd.thud(a(o.x,o.z),.8)),s.jets.set(o,o.state)}for(let o of t.pads)o.fired!==(s.pads.get(o)??-9)&&(s.pads.set(o,o.fired),a(o.x,o.z)>1.5&&this.snd.whoosh(a(o.x,o.z)));for(let o of t.blocks)o.crumbleAt>=0&&!s.crumbs.has(o)?(s.crumbs.add(o),this.snd.crumble(a((o.x0+o.x1)/2,(o.z0+o.z1)/2))):o.crumbleAt<0&&s.crumbs.delete(o);for(let o of t.boulders)a(o.x,o.z)<14&&this.snd.roll(a(o.x,o.z));for(let o of t.chasers)o.active&&this.snd.roll(a(o.x,o.z)*.6);for(let o of t.sweepers){let h=a(o.x,o.z);if(h<o.len+2){let l=o.angle%Math.PI;Math.abs(l)<.08&&this.snd.whoosh(h*.5)}}let c=i.wind||0;for(let o of t.fans)o.on>.1&&a(o.x,o.z)<14&&(c=Math.max(c,o.on*.5));this.snd.tickAmbience(n,c)}start(){this.renderer.setAnimationLoop(e=>this.frame(e))}checkpointArches(e){let t=this.course.checkpoints.slice(1);for(let n of t){let i=6;for(let l of this.course.blocks)!l.crumbles&&!l.driftAmp&&n>=l.z0&&n<=l.z1&&(i=Math.min((l.x1-l.x0)/2-.5,7));let s=this.course.spawnY(n);for(let l of[-1,1]){let u=new J(new _t(.18,.22,4.2,10),e);u.position.set(l*i,s+2.1,n),u.castShadow=!0,this.scene.add(u);let d=new J(new wn(.28,12,8),new st({color:2236440,emissive:16752704,emissiveIntensity:1.6}));d.position.set(l*i,s+4.35,n),this.scene.add(d);let p=new Xt(new Wt({map:Bt(!0),color:16752704,transparent:!0,opacity:.8,depthWrite:!1,blending:Et}));p.scale.setScalar(2.2),p.position.copy(d.position),this.scene.add(p)}let a=0,c=new J(new yt(i*2-.6,.9),new st({map:Of(),side:Ct,roughness:.8,emissive:0,emissiveMap:Of(),emissiveIntensity:.9}));c.position.set(0,s+3.7,n),c.rotation.y=Math.PI,this.scene.add(c),this.soft.push(c);let o=new J(new _t(.04,.04,i*2,6).rotateZ(Math.PI/2),new st({color:2760728}));o.position.set(0,s+4.2,n),this.scene.add(o),this.soft.push(o);let h=new J(new yt(i*2,.7).rotateX(-Math.PI/2),new ot({color:7328767,transparent:!0,opacity:.4,depthWrite:!1,blending:Et}));h.position.set(0,s+.03,n),h.renderOrder=3,this.scene.add(h),this.cpArches.push({glow:h,flag:c,lit:!1})}}toast(e){let t=document.getElementById("toast");t&&(t.textContent=e,t.classList.remove("show"),t.offsetWidth,t.classList.add("show"))}async decorateManor(e,t){let n=this.course,i=31,s=()=>(i=i*16807%2147483647)/2147483647,a={},c=[],o=[],h=(v,R,C,I,F,N=s()*Math.PI*2)=>(a[v]??=[]).push(new Fe().compose(new L(R,C,I),new Rt().setFromAxisAngle(new L(0,1,0),N),new L(F,F,F))),l=(v,R=!0)=>(v.castShadow=R,v.receiveShadow=!0,this.scene.add(v),v),u=(v,R,C)=>{let I=new yt(v,R),F=I.getAttribute("uv");for(let N=0;N<F.count;N++)F.setXY(N,F.getX(N)*v/C,F.getY(N)*R/C);return I},d=new st({color:1513243,metalness:.85,roughness:.45}),p=-1;for(let v of n.rooms){let R=v.z1-v.z0,C=(v.z0+v.z1)/2,I=v.y-8,F=v.h+8;for(let D of[-1,1]){let O=l(new J(u(R,F,3),e.wall));O.position.set(D*v.halfW,I+F/2,C),O.rotation.y=-D*Math.PI/2;let X=l(new J(u(R,1.3,2),e.beam),!1);X.position.set(D*(v.halfW-.03),v.y+.65,C),X.rotation.y=-D*Math.PI/2,l(new J(new ke(.12,.14,R),e.beam),!1).position.set(D*(v.halfW-.06),v.y+1.32,C);let Y=l(new J(new yt(R,1.2),new ot({map:Wy(),transparent:!0,depthWrite:!1,color:0})),!1);Y.rotation.set(-Math.PI/2,0,-D*Math.PI/2+Math.PI/2),Y.position.set(D*(v.halfW-.6),v.y+.02,C);for(let K=Math.ceil((v.z0+1)/8)*8;K<v.z1;K+=8)l(new J(new ke(.5,v.h+1,.5),e.beam)).position.set(D*(v.halfW-.25),v.y+v.h/2-.5,K)}if(p>0&&p!==v.halfW)for(let D of[-1,1]){let O=Math.min(p,v.halfW),X=Math.max(p,v.halfW),k=l(new J(u(X-O,F+4,3),e.wall));k.position.set(D*(O+X)/2,I+(F+4)/2,v.z0),p<v.halfW&&(k.rotation.y=Math.PI)}p=v.halfW;let N=v.y+v.h,U=v.z0;for(;U<v.z1;){let D=v.skylights&&Math.round(U)%8<3&&U+2.4<v.z1,O=D?2.4:Math.min(v.z1-U,5.6);if(D){for(let X=-v.halfW+.5;X<v.halfW;X+=.6)l(new J(new ke(.07,.07,O),d)).position.set(X,N,U+O/2);o.push([0,N,U+O/2,v.halfW])}else{let X=l(new J(u(v.halfW*2,O,2.5),e.beam));X.rotation.x=Math.PI/2,X.position.set(0,N+.05,U+O/2),l(new J(new ke(v.halfW*2+2,.3,O),new ot({color:0}))).position.set(0,N+.4,U+O/2)}U+=O}for(let D=Math.ceil((v.z0+1)/8)*8;D<v.z1;D+=8)l(new J(new ke(v.halfW*2,.45,.45),e.beam)).position.set(0,N-.25,D);if(this.crypt){for(let D=Math.ceil(v.z0/5)*5+2;D<v.z1-1;D+=5)for(let O of[-1,1]){let X=O*(v.halfW-.05);for(let k=0;k<3;k++){let Y=new J(new yt(1.5,.78),this.niche);Y.position.set(X-O*.01,v.y+.9+k*.95,D),Y.rotation.y=-O*Math.PI/2,this.scene.add(Y);for(let K=0;K<3;K++)s()<.7&&this.skullAt.push(new L(X-O*.18,v.y+.78+k*.95,D-.45+K*.45))}if(Math.round(D/5)%2){let k=D+2.5,Y=new L(X-O*.25,v.y+2.6,k),K=new J(new _t(.05,.04,.6,6),this.gold);K.position.copy(Y).add(new L(0,-.2,0)),K.rotation.z=O*.4,this.scene.add(K);let _e=new Xt(new Wt({map:Bt(!0),color:16747050,transparent:!0,depthWrite:!1,blending:Et}));_e.scale.set(.5,.9,1),_e.position.copy(Y).add(new L(0,.25,0)),this.scene.add(_e),this.flames.push(_e);let Me=new J(new Tn(3,24).rotateX(-Math.PI/2),new ot({map:Bt(!0),color:16742944,transparent:!0,opacity:.3,depthWrite:!1,blending:Et}));Me.position.set(X-O*1.6,v.y+.03,k),this.scene.add(Me)}}for(let D=0;D<(v.z1-v.z0)/6;D++){let O=new J(new yt(1.6,1.6),this.web),X=s()<.5?-1:1;O.position.set(X*(v.halfW-.7),v.y+v.h-.7,v.z0+s()*(v.z1-v.z0)),O.rotation.set(0,X*.8,0),this.scene.add(O)}}else{for(let D=Math.ceil(v.z0/8)*8+4;D<v.z1-2;D+=8)for(let O of[-1,1]){if(s()<.25)continue;let X=Mi[Math.floor(s()*Mi.length)],k=new Je;k.position.set(O*(v.halfW-.06),v.y+3.1,D),k.rotation.y=-O*Math.PI/2;let Y=new J(new ke(1.7,2.1,.12),this.gold),K=new J(new yt(1.4,1.8),this.portrait(X));K.position.z=.075;let _e=new J(new yt(1.45,1.85),this.canvasBg);_e.position.z=.065,k.add(Y,_e,K);let Me=new J(new ke(.7,.14,.03),this.gold);Me.position.set(0,-1.2,.06),k.add(Me),this.scene.add(k)}for(let D=Math.ceil(v.z0/8)*8;D<v.z1;D+=8)for(let O of[-1,1]){let X=new J(new yt(1.6,v.h-.6,6,1),this.drape);X.position.set(O*(v.halfW-.12),v.y+(v.h-.6)/2+.3,D+O*.9),X.rotation.y=-O*Math.PI/2;let k=X.geometry.getAttribute("position");for(let Y=0;Y<k.count;Y++)k.setZ(Y,Math.sin(k.getX(Y)*6)*.08);X.geometry.computeVertexNormals(),this.scene.add(X)}}for(let D=v.z0+3;D<v.z1-1;D+=7){let O=Math.round(D/7)%2?1:-1;h("caged_hanging_light",O*(v.halfW-.45),v.y+2.4,D,.55,O>0?-Math.PI/2:Math.PI/2),c.push(new L(O*(v.halfW-.5),v.y+2.45,D))}if(v.halfW>=6)for(let D=0;D<R/3.5;D++){let O=s()<.5?-1:1,X=O*(v.halfW-1.1-s()*.8),k=v.z0+1+s()*(R-2),Y=s();n.blocks.some(K=>K.crumbles&&k>K.z0-1&&k<K.z1+1)||(Y<.3?h("wine_barrel_01",X,v.y,k,1.1):Y<.5?h("wooden_crate_01",X,v.y,k,.9+s()*.3):Y<.62?h("wooden_barrels_01",X,v.y,k,1.8):Y<.74?h("wooden_bucket_01",X,v.y,k,.45):Y<.86?h("wine_bottles_01",X,v.y,k,.5):(h("brass_candleholders",X,v.y,k,.6),c.push(new L(X,v.y+.65,k))))}}if(this.skullAt.length){let v=document.createElement("canvas");v.width=v.height=128;let R=v.getContext("2d");R.fillStyle="#c9bc9c",R.fillRect(0,0,128,128);let C=R.createRadialGradient(64,50,10,64,64,70);C.addColorStop(0,"rgba(255,250,230,.25)"),C.addColorStop(1,"rgba(60,45,30,.6)"),R.fillStyle=C,R.fillRect(0,0,128,128),R.fillStyle="#120a06";for(let k of[44,84])R.beginPath(),R.ellipse(k,60,14,17,0,0,7),R.fill();R.beginPath(),R.moveTo(64,74),R.lineTo(57,92),R.lineTo(71,92),R.fill();for(let k=0;k<6;k++)R.fillRect(42+k*8,104,5,12);let I=new Yt(v);I.colorSpace=mt;let F=new st({map:I,roughness:.8}),N=new st({color:12365452,roughness:.85}),U=new wn(.2,14,10).scale(1,.95,1.05),D=new yt(.3,.32).translate(0,-.02,.2).rotateY(0),O=new qt(U,N,this.skullAt.length),X=new qt(D,F,this.skullAt.length);this.skullAt.forEach((k,Y)=>{let K=new Fe().compose(k,new Rt().setFromEuler(new an(0,(Math.random()-.5)*.4+(k.x>0?-Math.PI*.75:Math.PI*.75))),new L(1,1,1));O.setMatrixAt(Y,K),X.setMatrixAt(Y,K)}),O.computeBoundingSphere(),X.computeBoundingSphere(),this.scene.add(O,X)}let g=n.sweepers[0];if(g)for(let v=g.z-12;v<g.z+12;v+=2.2)for(let R of[-1,1])h("wooden_bookshelf_worn",R*10,g.y-.55,v,2.6,R>0?-Math.PI/2:Math.PI/2);let x=await this.model("env/lantern_chandelier_01.glb");this.chandelier=x.scene;for(let[v,R,C]of[[-5.5,2,4.2],[5,6,3.6],[-4.5,12,3.9],[5.5,16,4.4],[0,19,5.2],[-6.5,18,3.4]]){let I=Hf();I.position.set(v,C,R),I.rotation.y=s()*6,I.userData.sway=s()*6,this.scene.add(I),this.swingers.push(I),l(new J(new _t(.04,.04,10-C-2.2,6),d),!1).position.set(v,C+2.2+(10-C-2.2)/2,R)}for(let[v,R,C]of[[-5.4,-2,0],[6,9,0]]){let I=Hf(!0);I.position.set(v,C,R),I.rotation.set(0,s()*6,.15),this.scene.add(I)}let m=n.fallZones[0];if(m)for(let v=m[2]+4;v<m[3];v+=9){let R=ni(x.scene,2.4,"max");R.position.set(0,(n.rooms.find(C=>v>=C.z0&&v<=C.z1)?.y??0)+7.4,v),this.scene.add(R),c.push(R.position.clone().add(new L(0,-.3,0)))}let f=await this.model("env/large_castle_door.glb"),M=n.spawnY(n.finishZ),T=ni(f.scene,7.5,"height");T.position.set(0,M,n.finishZ+8.6),T.rotation.y=Math.PI,this.scene.add(T);let y=new Xt(new Wt({map:Bt(!0),color:12177663,transparent:!0,opacity:.8,depthWrite:!1,blending:Et}));y.scale.set(14,10,1),y.position.set(0,M+3.6,n.finishZ+8),this.scene.add(y),t(.45);let E=Object.keys(a),w=0;await Promise.all(E.map(async v=>{let R=await this.model(`env/${v}.glb`),C=ni(R.scene,1,/shelf|candle|light|bottles|bucket|barrels/.test(v)?"height":"max");C.updateMatrixWorld(!0),/shelf|light/.test(v)||(C.children[0].position.y+=0),C.traverse(I=>{let F=I;if(!F.isMesh)return;let N=new qt(F.geometry,F.material,a[v].length),U=F.matrixWorld.clone();a[v].forEach((D,O)=>N.setMatrixAt(O,D.clone().multiply(U))),N.castShadow=!0,N.receiveShadow=!0,N.computeBoundingSphere(),this.scene.add(N)}),t(.45+.35*++w/E.length)}));let S=new Wt({map:Bt(!0),color:16751168,transparent:!0,opacity:.8,depthWrite:!1,blending:Et});for(let v of c){let R=new Xt(S);R.scale.setScalar(1.9),R.position.copy(v),this.scene.add(R),this.flames.push(R);let C=new J(new Tn(2.6,24).rotateX(-Math.PI/2),new ot({map:Bt(!0),color:16744496,transparent:!0,opacity:.22,depthWrite:!1,blending:Et}));C.position.set(v.x,n.spawnY(v.z)+.03,v.z),this.scene.add(C)}let _=Gy();for(let[v,R,C,I]of o)for(let N of[0,Math.PI/2]){let U=new J(new yt(I*1.6,14),new ot({map:_,color:10467583,transparent:!0,opacity:.07,depthWrite:!1,blending:Et,side:Ct,fog:!1}));U.position.set(v-Ma.x*14/2,R-14/2,C-Ma.z*14/2),U.rotation.set(Math.atan2(Ma.z,Ma.y),N,0),this.scene.add(U)}t(.8)}swingers=[];skullAt=[];niche=new ot({color:394243});web=(()=>{let e=document.createElement("canvas");e.width=e.height=128;let t=e.getContext("2d");t.strokeStyle="rgba(230,230,230,.55)",t.lineWidth=1;for(let i=0;i<9;i++){let s=i/9*Math.PI/2;t.beginPath(),t.moveTo(0,0),t.lineTo(Math.cos(s)*128,Math.sin(s)*128),t.stroke()}for(let i=14;i<128;i+=14)t.beginPath(),t.arc(0,0,i,0,Math.PI/2),t.stroke();let n=new Yt(e);return new ot({map:n,transparent:!0,depthWrite:!1,side:Ct})})();gold=new st({color:13211182,metalness:1,roughness:.35,envMapIntensity:1.6});drape=new st({color:5901584,roughness:.85,side:Ct});canvasBg=new st({color:2824724,roughness:.9});portraits=new Map;portrait(e){let t=this.portraits.get(e);if(!t){let n=this.texLoader.load(`../hell-cage-host/chars/${e}.png`);n.colorSpace=mt;let i=document.createElement("canvas");i.width=4,i.height=4,t=new st({map:n,color:14207152,roughness:.7,transparent:!0,alphaTest:.05});let s=new st({color:2757648});this.portraits.set(e,t)}return t}flames=[];async decorateNight(e,t){let n=23,i=()=>(n=n*16807%2147483647)/2147483647,s=this.course.finishZ+30,a=()=>new Fe,c=[],o=[],h=[],l=[],u=[],d=new Rt,p=new an,g=new L,x=new L,m=(I,F,N,U,D,O,X=0)=>I.push(a().compose(g.set(F,N,U),d.setFromEuler(p.set(X,O,X*.6)),x.set(D,D,D)));for(let I=-20;I<s;I+=1.6+i()*1.6)for(let F of[-1,1]){let N=F*(8+i()*34);i()<.3||this.course.blocks.some(U=>N>U.x0-1.5&&N<U.x1+1.5&&I>U.z0-1.5&&I<U.z1+1.5)||m(i()<.7?c:o,N,-2.6,I,.9+i()*.6,(i()-.5)*.6,(i()-.5)*.35)}for(let I of this.course.blocks){if(I.crumbles||I.driftAmp||I.liftAmp||I.gear||I.cart||I.tilt||I.trapPeriod||I.wall||I.fake||I.driftAmp||I.x1-I.x0<6)continue;let F=I.z1-I.z0,N=I.x1-I.x0,U=_n(I,I.z0);if(N>=14)for(let D=0;D<F/3;D++){let O=i()<.5?-1:1,X=O>0?I.x1-.8-i()*1.2:I.x0+.8+i()*1.2;m(i()<.75?c:o,X,U,I.z0+i()*F,.7+i()*.4,(i()-.5)*.5,(i()-.5)*.25)}if(I.mat!=="mud")for(let D of[-1,1])for(let O=I.z0+.3;O<I.z1;O+=.45)i()<.92&&m(h,D>0?I.x1-.1:I.x0+.1,U,O,1,0,(i()-.5)*.12);for(let D=I.z0+3;D<I.z1-1;D+=11)for(let O of[-1,1])l.push(new L(O>0?I.x1-.45:I.x0+.45,U,D+(O>0?5:0)))}for(let I=-30;I<s+30;I+=6+i()*6)for(let F of[-1,1])m(u,F*(16+i()*45),-2.9,I,3.5+i()*2.5,i()*6);let f=tu([new ke(.8,1,.2).translate(0,.5,0),new _t(.4,.4,.2,18,1,!1,-Math.PI/2,Math.PI).rotateX(Math.PI/2).rotateZ(0).translate(0,1,0),new ke(1,.18,.32).translate(0,.09,0)]),M=tu([new ke(.16,1.5,.16).translate(0,.75,0),new ke(.8,.16,.16).translate(0,1.1,0)]),T=(I,F,N,U=!0)=>{if(!N.length)return;let D=new qt(I,F,N.length);N.forEach((O,X)=>D.setMatrixAt(X,O)),D.castShadow=U,D.receiveShadow=!0,D.computeBoundingSphere(),this.scene.add(D)};T(f,e,c),T(M,e,o),T(new ke(.05,1.25,.05).translate(0,.62,0),new st({color:1381658,metalness:.85,roughness:.4}),h,!1),t(.4);let y=await this.model("env/pine_tree_01_c.glb"),E=ni(y.scene,1,"height");E.updateMatrixWorld(!0),E.traverse(I=>{let F=I;if(!F.isMesh)return;let N=F.material.clone();N.color=new Ae(3818576);let U=new qt(F.geometry,N,u.length),D=F.matrixWorld.clone();u.forEach((O,X)=>{let k=O.clone(),Y=new L;k.decompose(new L,new Rt,Y),U.setMatrixAt(X,k.scale(new L(2.6,2.6,2.6)).multiply(D))}),U.computeBoundingSphere(),this.scene.add(U)});let w=new st({color:1777190,roughness:1}),S=new ot({color:16752704,fog:!1});for(let I=0;I<9;I++){let F=I%2?1:-1,N=-10+I*(s/8),U=F*(100+i()*70),D=new Je;D.position.set(U,-3,N);let O=2+i()*2.5;D.scale.setScalar(O);let X=new J(new ke(4,5,7),w);X.position.y=2.5,D.add(X);let k=new J(new Yn(3.6,3,4).rotateY(Math.PI/4),w);if(k.scale.z=1.7,k.position.y=6.5,D.add(k),i()<.7){let Y=new J(new ke(1.8,8,1.8),w);Y.position.set(0,4,-4),D.add(Y);let K=new J(new Yn(1.4,4,4),w);K.position.set(0,10,-4),D.add(K);let _e=new J(new ke(.2,1.4,.2),w);_e.position.set(0,12.6,-4),D.add(_e);let Me=new J(new ke(.8,.2,.2),w);Me.position.set(0,12.8,-4),D.add(Me)}for(let Y=0;Y<3;Y++)if(i()<.7){let K=new J(new yt(.6,1.2),S);K.position.set(-F*2.02,2.6,-2+Y*2),K.rotation.y=-F*Math.PI/2,D.add(K);let _e=new Xt(new Wt({map:Bt(!0),color:16748592,transparent:!0,opacity:.35,depthWrite:!1,blending:Et,fog:!1}));_e.scale.setScalar(3),_e.position.copy(K.position),D.add(_e)}this.scene.add(D)}let _=new _t(.06,.08,2.2,8).translate(0,1.1,0),v=new ke(.32,.42,.32),R=new qt(_,new st({color:1184278,metalness:.8,roughness:.5}),l.length),C=new qt(v,new st({color:2365448,emissive:16751164,emissiveIntensity:2.2}),l.length);l.forEach((I,F)=>{R.setMatrixAt(F,a().setPosition(I)),C.setMatrixAt(F,a().setPosition(I.x,I.y+2.35,I.z));let N=new Xt(new Wt({map:Bt(!0),color:16751164,transparent:!0,opacity:.75,depthWrite:!1,blending:Et}));N.scale.setScalar(2.6),N.position.set(I.x,I.y+2.35,I.z),this.scene.add(N);let U=new J(new Tn(2.2,24).rotateX(-Math.PI/2),new ot({map:Bt(!0),color:16747056,transparent:!0,opacity:.35,depthWrite:!1,blending:Et}));U.position.set(I.x,I.y+.03,I.z),this.scene.add(U)}),R.computeBoundingSphere(),C.computeBoundingSphere(),this.scene.add(R,C),t(.8)}chandelier;rocks=[];shake=0;boulderSrc;syncRocks(e){if(!this.boulderSrc)return;let t=n=>new ot({color:16726815,transparent:!0,opacity:n,depthWrite:!1,blending:Et,side:Ct});for(;this.rocks.length<this.course.fallers.length;){let n=this.manor&&this.chandelier?ni(this.chandelier,2.2,"max"):this.night?Hy():ni(this.boulderSrc,2,"max"),i=new J(new js(.82,1,40).rotateX(-Math.PI/2),t(.8)),s=new J(new Tn(1,40).rotateX(-Math.PI/2),t(.25));i.add(s),i.renderOrder=3,this.scene.add(n,i),this.rocks.push({rock:n,ring:i,id:-1})}this.rocks.forEach((n,i)=>{let s=this.course.fallers[i];if(n.rock.visible=n.ring.visible=!!s,!s){n.id=-1;return}n.id!==s.id&&(n.id=s.id,n.rock.userData.done=!1,n.rock.rotation.set(Math.random()*6,Math.random()*6,0)),n.rock.position.set(s.x,s.y,s.z),n.rock.scale.setScalar(s.r),n.rock.rotation.x+=e*4;let a=Math.min(1,(this.course.time-s.spawn)/(s.impact-s.spawn));if(n.ring.visible=!s.landed,n.ring.position.set(s.x,s.g+.04,s.z),n.ring.scale.setScalar(s.r*(2.4-1.3*a)),n.ring.material.opacity=.35+.6*a*(.6+.4*Math.sin(this.course.time*30)),s.landed&&!n.rock.userData.done){n.rock.userData.done=!0,this.snd.thud(Math.hypot(s.x-this.me.x,s.z-this.me.z),1.2),this.night&&this.snd.fire(Math.hypot(s.x-this.me.x,s.z-this.me.z)),this.puff(s.x,s.g,s.z,2.2),this.puff(s.x,s.g,s.z,1.6);let c=Math.hypot(s.x-this.me.x,s.z-this.me.z);c<14&&(this.shake=Math.max(this.shake,.35*(1-c/14)),navigator.vibrate?.(c<5?30:0))}})}grassSpots=[];grassOn(e){let t=Math.abs(Math.floor(e.z0*131+e.x0*17))%2147483e3+7,n=()=>(t=t*16807%2147483647)/2147483647,i=(e.x1-e.x0)*(e.z1-e.z0),s=Math.floor(i*(matchMedia("(pointer:coarse)").matches?2.4:3.6)),a=new Rt,c=new an,o=new L,h=new L;for(let l=0;l<s;l++){let u=e.x0+n()*(e.x1-e.x0),d=e.z0+n()*(e.z1-e.z0),p=Math.min(u-e.x0,e.x1-u);if(p>2.5&&n()<.35)continue;p<.45&&(u+=u<(e.x0+e.x1)/2?.45-p:p-.45);let g=.5+n()*.6+(p<1.5?.3:0);c.set(0,n()*Math.PI,0),a.setFromEuler(c),this.grassSpots.push(new Fe().compose(o.set(u,_n(e,d),d),a,h.set(g,g*(.8+n()*.5),g)))}}buildGrass(){let e=document.createElement("canvas");e.width=128,e.height=128;let t=e.getContext("2d");for(let h=0;h<46;h++){let l=4+Math.random()*120,u=(Math.random()-.5)*34,d=60+Math.random()*66,p=1.4+Math.random()*2.2,g=t.createLinearGradient(0,128,0,128-d);g.addColorStop(0,"#1f3310"),g.addColorStop(.55,"#5f8a2a"),g.addColorStop(1,"#c9d27a"),t.fillStyle=g,t.beginPath(),t.moveTo(l-p,128),t.quadraticCurveTo(l+u*.4,128-d*.6,l+u,128-d),t.quadraticCurveTo(l+u*.4+1,128-d*.6,l+p,128),t.fill()}let n=new Yt(e);n.colorSpace=mt;let i=h=>new yt(.75,.55).translate(0,.275,0).rotateY(h),s=tu([i(0),i(Math.PI/3),i(-Math.PI/3)]),a=new st({map:n,alphaTest:.45,side:Ct,roughness:.9,envMapIntensity:.6});a.onBeforeCompile=h=>{h.uniforms.uTime={value:0},a.userData.shader=h,h.vertexShader=`uniform float uTime;
`+h.vertexShader.replace("#include <begin_vertex>",`#include <begin_vertex>
        vec4 wp = instanceMatrix * vec4(0.,0.,0.,1.); float sway = sin(uTime*1.7 + wp.x*.35 + wp.z*.27) * .12 + sin(uTime*3.1 + wp.z*.9) * .04;
        transformed.x += sway * uv.y * uv.y; transformed.z += sway * .6 * uv.y * uv.y;`),h.vertexShader=h.vertexShader.replace("#include <beginnormal_vertex>",`#include <beginnormal_vertex>
 objectNormal = vec3(0.,1.,0.);`)},this.grassMat=a;let c=new qt(s,a,this.grassSpots.length),o=new Ae;this.grassSpots.forEach((h,l)=>{c.setMatrixAt(l,h),this.night?o.setHSL(.15+Math.random()*.05,.25,.32+Math.random()*.12):o.setHSL(.2+Math.random()*.07,.5,.5+Math.random()*.2),c.setColorAt(l,o)}),c.receiveShadow=!0,c.computeBoundingSphere(),this.scene.add(c)}atmosphere(){let e=document.createElement("canvas");e.width=e.height=256;let t=e.getContext("2d");for(let o=0;o<70;o++){let h=Math.random()*256,l=Math.random()*256,u=20+Math.random()*60,d=t.createRadialGradient(h,l,0,h,l,u);d.addColorStop(0,"rgba(255,240,230,.22)"),d.addColorStop(1,"rgba(255,240,230,0)"),t.fillStyle=d;for(let p of[-256,0,256])for(let g of[-256,0,256])t.save(),t.translate(p,g),t.fillRect(h-u,l-u,u*2,u*2),t.restore()}let n=new Yt(e);n.wrapS=n.wrapT=Sn,n.repeat.set(5,5);for(let[o,h]of this.manor?[[-4,.35]]:this.night?[[-1.6,.35],[-.6,.22],[.6,.12]]:[[-9,.5],[-15,.65],[-22,.8],[-29,.9]]){let l=new J(new yt(700,700).rotateX(-Math.PI/2),new ot({map:n.clone(),transparent:!0,opacity:h,depthWrite:!1,color:this.manor?6123414:this.night?10470616:15915208}));l.material.map.repeat.set(4+o*-.05,4),l.position.set(0,o,150),l.renderOrder=2,this.mist.push(l),this.scene.add(l)}if(this.manor){let o=new J(new yt(60,700).rotateX(-Math.PI/2),new ot({color:65794}));o.position.set(0,-7,200),this.scene.add(o)}else if(this.night){let o=new J(new yt(400,700).rotateX(-Math.PI/2),new st({color:792340,metalness:.85,roughness:.18,envMapIntensity:1.1}));o.position.set(0,-2.5,200),this.scene.add(o)}let i=new J(new yt(26,600).rotateX(-Math.PI/2),new st({color:1911347,metalness:.9,roughness:.12,envMapIntensity:1.3}));i.position.set(-6,-33.6,150),this.night||this.scene.add(i);let s=matchMedia("(pointer:coarse)").matches?260:520,a=new Float32Array(s*3);for(let o=0;o<s;o++)a[o*3]=(Math.random()-.5)*40,a[o*3+1]=Math.random()*14,a[o*3+2]=Math.random()*50-10;let c=new xt;c.setAttribute("position",new Pt(a,3)),this.pollen=new Di(c,new fi({map:Bt(),size:this.night?.16:.13,color:this.manor?12571391:this.night?13172602:16767392,transparent:!0,opacity:.85,depthWrite:!1,blending:Et})),this.pollen.frustumCulled=!1,this.scene.add(this.pollen)}animateAtmosphere(e){let t=this.course.time;this.mist.forEach((s,a)=>{let c=s.material.map;c.offset.x=t*(.004+a*.002),c.offset.y=t*.002*(a%2?1:-1)});let n=this.grassMat?.userData?.shader;n&&(n.uniforms.uTime.value=t),this.pollen.position.set(this.camTarget.x,this.camTarget.y-2,this.camTarget.z-10);let i=this.pollen.geometry.getAttribute("position");for(let s=0;s<i.count;s++){let a=i.getY(s)+e*(.15+s%7*.03);a>14&&(a=0),i.setY(s,a),i.setX(s,i.getX(s)+Math.sin(t*.6+s)*e*.2)}i.needsUpdate=!0;for(let s of this.puffs){if(s.t<0)continue;s.t+=e;let a=s.t/.7;if(a>=1){s.t=-1,s.s.visible=!1;continue}s.s.scale.setScalar(s.s.userData.size*(.5+a*1.4)),s.s.material.opacity=.55*(1-a),s.s.position.y+=e*.5}}puff(e,t,n,i){if(!this.puffs.length){let s=Bt(!0);for(let a=0;a<24;a++){let c=new Xt(new Wt({map:s,color:14271394,transparent:!0,depthWrite:!1}));c.visible=!1,this.scene.add(c),this.puffs.push({s:c,t:-1})}}for(let s=0;s<5;s++){let a=this.puffs.find(h=>h.t<0);if(!a)return;let c=Math.random()*Math.PI*2,o=.3+Math.random()*.4;a.t=0,a.s.visible=!0,a.s.position.set(e+Math.cos(c)*o,t+.15,n+Math.sin(c)*o),a.s.userData.size=i*(.6+Math.random()*.5)}}frame(e){let t=this.last?Math.min(.1,(e-this.last)/1e3):.016666666666666666;if(this.last=e,this.frameAvg+=(t*1e3-this.frameAvg)*.05,this.frameAvg>21&&this.pixelRatio>.85&&(this.pixelRatio=Math.max(.85,this.pixelRatio-.1),this.renderer.setPixelRatio(this.pixelRatio),this.frameAvg=16),this.readInput(),this.net){let n=kn+(this.net.serverNow()-this.net.startAt)/1e3;if(this.intro(n+Gc-kn),(n<this.clock||this.clock<=0&&n<0)&&(this.clock=Math.min(n,0)),this.acc=Math.max(0,Math.min(8,n-this.clock)),this.acc>2)for(;this.acc>.2;)this.acc-=vi,this.clock+=vi,this.course.step(vi);this.netTick(t)}if(this.introT>=0&&!this.introSkipped){this.sync(t),this.renderer.render(this.scene,this.camera);return}else this.acc+=t;for(;this.acc>=vi;){this.acc-=vi,this.clock+=vi;let n=this.clock>=kn&&!this.over();this.course.step(vi);for(let i of this.runners)i.remote||(i.bot&&this.course.think(i,vi),(!n||this.clock<0)&&(i.inX=i.inZ=0,i.jump=!1),this.course.move(i,vi));for(let i=0;i<this.runners.length;i++)for(let s=i+1;s<this.runners.length;s++){let a=this.runners[i],c=this.runners[s];if(a.hook>=0||c.hook>=0)continue;let o=c.x-a.x,h=c.z-a.z,l=Math.hypot(o,h),u=.42*1.9;if(l<u&&l>1e-4&&Math.abs(a.y-c.y)<1.2){let d=(u-l)/2;a.x-=o/l*d,a.z-=h/l*d,c.x+=o/l*d,c.z+=h/l*d}}}this.sync(t),this.composer?this.composer.render():this.renderer.render(this.scene,this.camera),this.hudUpdate()}remote(e){for(let t of this.runners){let n=e[t.id];!n||!t.remote||(t.target=n)}}sendT=0;netTick(e){for(let i of this.runners){let s=i.target;if(!i.remote||!s)continue;let a=Math.min(1,e*10);Math.hypot(s[0]-i.x,s[2]-i.z)>6?(i.x=s[0],i.y=s[1],i.z=s[2]):(i.vx=(s[0]-i.x)/Math.max(e,.016)*a,i.vz=(s[2]-i.z)/Math.max(e,.016)*a,i.x+=(s[0]-i.x)*a,i.y+=(s[1]-i.y)*a,i.z+=(s[2]-i.z)*a),i.facing=s[3],i.stun=s[4]===3?.3:0,i.ground=s[4]===2?null:i.ground??this.course.blocks[0],i.vy=s[4]===2?1:0,i.checkpoint=s[5],i.progress=s[6],s[7]&&!i.finished&&(i.finished=!0,i.finishTime=s[8]),i.falls=s[9]}if(this.net.spectator){let i=this.standings()[0];i&&(this.me=i);return}if(this.sendT-=e,this.sendT>0)return;this.sendT=.2;let t=this.me,n=t.stun>0?3:t.ground?Math.hypot(t.vx,t.vz)>.8?1:0:2;this.net.send([+t.x.toFixed(2),+t.y.toFixed(2),+t.z.toFixed(2),+t.facing.toFixed(2),n,t.checkpoint,+t.progress.toFixed(1),t.finished?1:0,+t.finishTime.toFixed(2),t.falls])}introT=-1;introSkipped=!1;introLine=-1;intro(e){let t=document.getElementById("intro");if(!t)return;if(e<0||e>=Gc){this.introT=-1,t.hidden=!0,document.body.classList.remove("intro-on");return}if(this.introT=e,t.hidden=this.introSkipped,document.body.classList.toggle("intro-on",!this.introSkipped),this.introSkipped)return;let n=-1;for(let i=0;i<Vc.length;i++)e>=Vc[i][0]&&(n=i);if(n!==this.introLine){this.introLine=n;let i=document.getElementById("intro-sub");i.textContent=n>=0?Vc[n][1]:"",i.classList.remove("in"),i.offsetWidth,i.classList.add("in"),n>=0&&e-Vc[n][0]<.6&&this.snd.voice(`audio/rules_${n}.m4a`)}document.getElementById("intro-bar").style.width=`${e/Gc*100}%`}over(){return this.clock-kn>=this.limit?!0:this.runners.length>0&&this.runners.every(e=>e.finished)}timeLeft(){return Math.max(0,this.limit-Math.max(0,this.clock-kn))}standings(){return[...this.runners].sort((e,t)=>(e.finished?0:1)-(t.finished?0:1)||(e.finished?e.finishTime-t.finishTime:t.progress-e.progress))}sync(e){let t=this.course;for(let[x,m]of this.blockMeshes){let f=x.crumbleAt>=0?t.time-x.crumbleAt:-1,M=x.crumbles&&f>=0&&f<x.crumbleDelay?Math.sin(t.time*70)*.06*(f/x.crumbleDelay):0;if(m.userData.pivot){let[T,y,E]=m.userData.pivot;m.position.set(T+x.offX,y+x.offY,E),m.rotation.set(-Math.atan(x.tiltZ),0,Math.atan(x.tiltX))}else m.position.set(x.offX+M,x.offY,0);m.visible=!x.gone&&!m.userData.hidden,m.userData.crack&&(m.userData.crack.material.opacity=f>=0?Math.min(.9,f/x.crumbleDelay*1.2):0)}this.syncMech(e),t.sweepers.forEach((x,m)=>{let f=this.sweeperMeshes[m];f.position.set(x.x,x.y,x.z),f.rotation.y=-x.angle}),t.pendulums.forEach((x,m)=>{this.pend[m].rotation.z=x.swing});for(let x of this.rams){let m=x.userData.p;x.position.x=m.side*(m.wallX-m.reach*m.ext+1)}t.pads.forEach((x,m)=>{let f=Math.max(0,1-(t.time-x.fired)*4);this.padMeshes[m].position.y=x.y+.23+f*.25,this.padMeshes[m].material.emissiveIntensity=1+Math.sin(t.time*6)*.3+f*3});for(let[x,m]of this.warnPlanes)m.visible=x.warn&&!x.gone,m.material.opacity=.35+.35*Math.sin(t.time*28);for(let x of this.belts)x.offset.y=(x.offset.y+e*.9)%1;for(let{j:x,o:m,f}of this.jetFx)if(x.kind==="fire")f.visible=x.state===2,f.scale.y=.8+Math.random()*.4,m.material.emissiveIntensity=x.state===1?1+Math.sin(t.time*30):x.state===2?2:0;else{let M=x.state===2?.55:x.state===1?3.2:4.2;f.position.y+=(M-f.position.y)*Math.min(1,e*(x.state===2?30:4)),m.material.opacity=x.state===1?.5+.4*Math.sin(t.time*25):x.state===2?.8:0}for(let x of this.ghosts)x.emissiveIntensity=.025*Math.max(0,Math.sin(t.time*1.3))**8;this.portalFx.forEach((x,m)=>{x.userData.disc.rotation.z-=e*2.4;let f=t.portals[m];x.userData.disc.material.opacity=.7+.25*Math.sin(t.time*5+m)+(t.time-f.used<.4?.5:0)});let n=this.me.teleported;if(n&&n!==this.lastTp){this.lastTp=n,this.camTarget.set(this.me.x,this.me.y,this.me.z);let x=t.portals.find(m=>t.time-m.used<.1);this.snd.portal(),this.toast(x?.kind==="far"?"\u0414\u0410\u041B\u0415\u041A\u041E \u0412\u041F\u0415\u0420\u0401\u0414!":x?.kind==="back"?"\u041D\u0410\u0417\u0410\u0414!":"\u0422\u0415\u041B\u0415\u041F\u041E\u0420\u0422!"),this.puff(this.me.x,this.me.y,this.me.z,1.6)}let i=t.sectionAt(this.me.z);i&&i.name!==this.lastSection&&(this.lastSection=i.name,this.clock>kn+.5&&this.toast(zf[i.name].toUpperCase())),this.boulderPool.forEach((x,m)=>{let f=t.boulders[m];x.visible=!!f,f&&(x.position.set(f.x,f.y,f.z),x.rotation.x=f.spin,x.scale.setScalar(f.radius/1.2*x.userData.base))});for(let[x,m]of this.looks){let f=Math.hypot(x.vx,x.vz),M=x.stun>0?"stun":x.ground?f>.8?"run":"idle":"jump";M!==m.cur&&m.acts[M]&&(m.acts[M].reset().fadeIn(.06).play(),m.acts[m.cur]?.fadeOut(.06),m.cur=M),m.acts.run&&(m.acts.run.timeScale=Math.max(.6,f/5.5)),x===this.me&&x.ground&&m.prevVy<-4&&this.snd.land(Math.min(1,-m.prevVy/14)),x===this.me&&!x.ground&&m.prevVy<=.5&&x.vy>8&&(x.vy>12?this.snd.spring():this.snd.jump()),x.ground&&m.prevVy<-6&&(m.squash=Math.min(.3,-m.prevVy*.022),this.puff(x.x,x.y,x.z,Math.min(1.4,-m.prevVy/9))),!x.ground&&m.prevVy<=.5&&x.vy>8&&this.puff(x.x,x.y,x.z,.6),m.prevVy=x.vy,m.squash=Math.max(0,m.squash-e*2.2);let T=1-m.squash,y=1/Math.sqrt(T),E=x.character==="ghost"?.25+Math.sin(t.time*3+x.slot)*.08:0;m.root.position.set(x.x,x.y+E,x.z),m.root.scale.set(y,T,y);let S=x.facing-m.root.rotation.y;S=Math.atan2(Math.sin(S),Math.cos(S)),m.root.rotation.y+=S*Math.min(1,e*22),m.mixer.update(e);let _=this.blobs.get(x);if(_){let v=-99;for(let C of t.blocks)!C.gone&&x.x>=C.x0+C.offX&&x.x<=C.x1+C.offX&&x.z>=C.z0&&x.z<=C.z1&&_n(C,x.z)<=x.y+.05&&(v=Math.max(v,_n(C,x.z)));_.visible=v>-50;let R=x.y-v;_.position.set(x.x,v+.03,x.z),_.scale.setScalar(Math.max(.4,1-R*.12)),_.material.opacity=Math.max(.15,.55-R*.06)}}if(this.introT>=0&&!this.introSkipped){let x=Math.min(1,this.introT/Gc),m=-6+(this.course.finishZ+6)*(x*x*(3-2*x)),f=this.course.spawnY(Math.max(0,m));this.camera.position.set(Math.sin(this.introT*.25)*9,f+9+Math.sin(this.introT*.4)*2,m-14),this.camera.lookAt(0,f+1,m+10),this.sun.position.set(this.camera.position.x+pr.x*70,f+pr.y*70,m+pr.z*70),this.sun.target.position.set(0,f,m+8),this.animateAtmosphere(e);return}let s=this.me,a=this.camera.aspect<1,c=Math.min(1,e*5);this.camTarget.x+=(s.x*.75-this.camTarget.x)*c,this.camTarget.z+=(s.z-this.camTarget.z)*c,this.camTarget.y+=(Math.max(s.y,-4)-this.camTarget.y)*Math.min(1,e*2.5);let o=this.manor?a?9:7.4:a?11:8.6,h=this.manor?a?6:4.4:a?7.2:5.4,l=this.course.mazePaths.some(x=>s.z>x.box[2]-2&&s.z<x.box[3])||this.course.fakeWalls.some(x=>s.z>x.z-6&&s.z<x.z+3);this.mazeBlend+=((l?1:0)-this.mazeBlend)*Math.min(1,e*2.5);let u=this.mazeBlend,d=o+(4.6-o)*u,p=h+(7.4-h)*u;if(this.camera.position.set(this.camTarget.x,this.camTarget.y+p,this.camTarget.z-d),this.manor){let x=this.camera.position.z,m=this.course.rooms.find(f=>x>=f.z0&&x<=f.z1)??this.course.rooms.find(f=>this.camTarget.z>=f.z0&&this.camTarget.z<=f.z1);if(m){let f=m.halfW-1.1;this.camera.position.x=Math.max(-f,Math.min(f,this.camera.position.x)),this.camera.position.y=Math.min(this.camera.position.y,m.y+m.h-.8+4*this.mazeBlend)}}this.camera.lookAt(this.camTarget.x,this.camTarget.y+1.3,this.camTarget.z+7);{let x=new L(s.x,s.y+1.1,s.z);for(let m of this.faded)m.material.forEach(M=>{M.opacity=Math.min(1,M.opacity+e*4),M.opacity>=1&&(M.transparent=!1)});for(let m=0;m<3;m++){let f=this.camera.position.clone().sub(x),M=f.length();f.normalize(),this.ray.set(x,f),this.ray.far=M;for(let S of this.soft){let _=Math.abs(S.position.z-s.z)<1?0:1,v=this.camera.position.z<S.position.z&&s.z>S.position.z-.5?.15:1,R=S.material;R.transparent=!0,R.opacity+=(v-R.opacity)*Math.min(1,e*8)}let T=[];for(let[S,_]of this.blockMeshes)_.visible&&Math.abs((S.z0+S.z1)/2-s.z)<30&&T.push(_);let y=this.ray.intersectObjects(T,!1)[0];if(!y)break;let E=y.object;if([...this.blockMeshes].find(([,S])=>S===E)?.[0]?.wall){if(E.material.__own||(E.material=E.material.map(S=>S.clone()),E.material.__own=!0),E.material.forEach(S=>{S.transparent=!0,S.opacity=.18,S.depthWrite=!1}),this.faded.add(E),T.splice(T.indexOf(E),1),this.ray.intersectObjects(T,!1),!this.ray.intersectObjects(T,!1).length)break;continue}this.camera.position.y+=2.5,this.camera.lookAt(s.x,s.y+1.2,s.z+5)}}this.sun.target.position.set(this.camTarget.x,this.camTarget.y,this.camTarget.z+8);let g=this.manor?Ma:this.night?Ff:pr;if(this.sun.position.set(this.camTarget.x+g.x*70,this.camTarget.y+g.y*70,this.camTarget.z+8+g.z*70),this.fill.position.copy(this.camera.position),this.fill.target.position.set(this.camTarget.x,this.camTarget.y,this.camTarget.z),this.animateAtmosphere(e),this.syncRocks(e),this.moonGlow&&this.moonGlow.position.copy(this.camera.position).addScaledVector(Ff,400),this.sunGlow){let x=this.camera.position.clone().addScaledVector(pr,420);this.sunGlow.position.copy(x),this.rays.forEach((m,f)=>{m.position.copy(this.camera.position).addScaledVector(pr,300),m.lookAt(this.camera.position),m.rotateZ(-.5+f*.25+Math.sin(this.course.time*.1+f)*.03),m.translateY(-120)})}for(let x of this.swingers)x.rotation.z=Math.sin(this.course.time*.8+x.userData.sway)*.05;if(this.flames.forEach((x,m)=>x.scale.setScalar(1.8+Math.sin(this.course.time*13+m*1.7)*.12+Math.sin(this.course.time*7.3+m)*.08)),this.me.checkpoint>this.lastCp){for(let x=this.lastCp+1;x<=this.me.checkpoint;x++){let m=this.cpArches[x-1];m&&!m.lit&&(m.lit=!0,m.flag.material.emissive.set(16757304),m.glow.material.color.set(16761941),this.toast("\u0427\u0415\u041A\u041F\u041E\u0418\u041D\u0422!"),this.snd.checkpoint(),this.puff(this.me.x,this.me.y,this.me.z,1.4),navigator.vibrate?.(20))}this.lastCp=this.me.checkpoint}for(let x of this.cpArches){let m=x.glow.material;m.opacity=(x.lit?.55:.35)+Math.sin(this.course.time*3)*.12}if(this.shake>0){this.shake=Math.max(0,this.shake-e*1.2);let x=this.shake*this.shake*1.4;this.camera.position.x+=(Math.random()-.5)*x,this.camera.position.y+=(Math.random()-.5)*x}}hudUpdate(){let e=innerWidth,t=innerHeight,n=new L;for(let[d,p]of this.looks){n.set(d.x,d.y+1.55+.55,d.z).project(this.camera);let g=n.z<1&&Math.abs(n.x)<1.1&&Math.abs(n.y)<1.1;p.tag.style.display=g?"":"none",g&&(p.tag.style.transform=`translate(${(n.x*.5+.5)*e}px,${(-n.y*.5+.5)*t}px) translate(-50%,-100%)`)}let i=this.timeLeft();va("timer",`${Math.floor(i/60)}:${String(Math.floor(i%60)).padStart(2,"0")}`),document.getElementById("timer").classList.toggle("low",i<20&&this.clock>kn);let s=Math.ceil(kn-.5-this.clock);this.clock<kn+.3&&s!==this.sndState.count&&(this.sndState.count=s,s>=0&&s<=3&&this.snd.countdown(s<=0)),va("count",this.clock>=0&&this.clock<kn?s>0?String(s):"\u0412\u041F\u0415\u0420\u0401\u0414!":this.clock<0&&this.introSkipped?"\u0416\u0414\u0401\u041C \u0421\u0422\u0410\u0420\u0422\u0410\u2026":"");let a=this.standings(),c=a.indexOf(this.me)+1;if(va("place-n",String(c)),va("place-of",`/${a.length}`),document.getElementById("place").dataset.p=String(Math.min(c,4)),!this.dots.size){let d=document.getElementById("track");for(let p of this.runners){let g=document.createElement("i");g.className=p===this.me?"me":"",g.style.backgroundImage=`url(../hell-cage-host/chars/${p.character}.png)`,d.appendChild(g),this.dots.set(p,g)}}for(let[d,p]of this.dots){let g=d.finished?1:Math.min(1,Math.max(0,d.z/this.course.finishZ));p.style.left=`${g*100}%`,p.style.zIndex=d===this.me?"9":String(Math.round(g*8))}document.getElementById("fill").style.width=`${Math.min(1,Math.max(0,this.me.z/this.course.finishZ))*100}%`;let o=a.slice(0,3);o.includes(this.me)||o.push(this.me);let h=o.map(d=>`<li class="${d===this.me?"me":""}"><b>${a.indexOf(d)+1}</b><img src="../hell-cage-host/chars/${d.character}.png" alt="">${d.name}${d.finished?" \u2713":""}</li>`).join(""),l=document.getElementById("board");l.dataset.h!==h&&(l.dataset.h=h,l.innerHTML=h);let u=document.getElementById("results");(this.me.finished||this.over())&&u.hidden&&(u.hidden=!1,this.snd.finish(this.me.finished&&a.indexOf(this.me)<3),u.querySelector("ol").innerHTML=a.map(d=>`<li class="${d===this.me?"me":""}">${d.name}<span>${d.finished?(d.finishTime-kn).toFixed(1)+" \u0441":Math.round(d.progress/this.course.finishZ*100)+"%"}</span></li>`).join(""),va("verdict",this.me.finished?"\u0424\u0418\u041D\u0418\u0428!":"\u0412\u0420\u0415\u041C\u042F \u0412\u042B\u0428\u041B\u041E"))}input(){let e=()=>{this.snd.unlock(),this.snd.ambience(this.course.theme),this.snd.playMusic("audio/music.m4a")},t=document.getElementById("mute");if(t){let h=!1;try{h=localStorage.getItem("race-mute")==="1"}catch{}this.snd.setMuted(h),t.textContent=h?"\u{1F507}":"\u{1F50A}",t.addEventListener("pointerdown",l=>{l.stopPropagation(),h=!h,this.snd.setMuted(h),t.textContent=h?"\u{1F507}":"\u{1F50A}";try{localStorage.setItem("race-mute",h?"1":"0")}catch{}})}addEventListener("pointerdown",e),addEventListener("keydown",e),addEventListener("keydown",h=>{this.keys.add(h.code),h.code==="Space"&&(this.me&&(this.me.jump=!0),h.preventDefault())}),addEventListener("keyup",h=>this.keys.delete(h.code));let n=document.getElementById("stick-zone"),i=document.getElementById("knob"),s=document.getElementById("stick"),a=document.getElementById("jump");n.addEventListener("pointerdown",h=>{this.stick={id:h.pointerId,ox:h.clientX,oy:h.clientY,x:0,y:0},s.style.display="block",s.style.left=h.clientX+"px",s.style.top=h.clientY+"px",i.style.transform="",n.setPointerCapture(h.pointerId)}),n.addEventListener("pointermove",h=>{if(h.pointerId!==this.stick.id)return;let l=h.clientX-this.stick.ox,u=h.clientY-this.stick.oy,d=Math.hypot(l,u),p=56;d>p&&(l*=p/d,u*=p/d),this.stick.x=l/p,this.stick.y=u/p,i.style.transform=`translate(${l}px,${u}px)`});let c=h=>{h.pointerId===this.stick.id&&(this.stick.id=-1,this.stick.x=this.stick.y=0,s.style.display="none")};n.addEventListener("pointerup",c),n.addEventListener("pointercancel",c),a.addEventListener("pointerdown",h=>{h.preventDefault(),this.me&&(this.me.jump=!0,this.me.holdJump=!0),a.classList.add("down"),navigator.vibrate?.(8)});let o=()=>{this.me&&(this.me.holdJump=!1),a.classList.remove("down")};a.addEventListener("pointerup",o),a.addEventListener("pointercancel",o)}readInput(){if(!this.me)return;let e=this.keys,t=(e.has("KeyA")||e.has("ArrowLeft")?1:0)-(e.has("KeyD")||e.has("ArrowRight")?1:0),n=(e.has("KeyW")||e.has("ArrowUp")?1:0)-(e.has("KeyS")||e.has("ArrowDown")?1:0);this.stick.id>=0&&(t=-this.stick.x,n=-this.stick.y),this.me.inX=t,this.me.inZ=n,e.has("Space")?this.me.holdJump=!0:this.stick.id<0&&!document.getElementById("jump").classList.contains("down")&&(this.me.holdJump=!1)}resize(){let e=innerWidth,t=innerHeight;this.renderer.setSize(e,t),this.composer?.setSize(e,t),this.camera.aspect=e/t,this.camera.fov=e<t?70:58,this.camera.updateProjectionMatrix()}model(e){let t=this.cache.get(e);return t||(t=this.gltf.loadAsync(e),this.cache.set(e,t)),t}tex(e,t=!0,n=!0){let i=this.texLoader.load(e);return n&&(i.colorSpace=mt),t&&(i.wrapS=i.wrapT=Sn),i.anisotropy=4,i}shadedCache=new Map;shaded(e){let t=this.shadedCache.get(e);return t||(t=e.clone(),t.vertexColors=!0,this.shadedCache.set(e,t)),t}mat(e,t,n=!1,i=16777215){let s=this.tex(`tex/${e}/arm.jpg`,!0,!1);return new st({map:this.tex(`tex/${e}/diffuse.jpg`),normalMap:this.tex(`tex/${e}/nor_gl.jpg`,!0,!1),roughnessMap:s,roughness:1,metalness:0,vertexColors:!1,envMapIntensity:.8,color:i})}};function Uy(r){let e=[],t=[],n=r.mat==="plank"?2.2:3.2,i=4,{x0:s,x1:a,z0:c,z1:o,y0:h,y1:l,bottom:u}=r,d=Math.max(.01,Math.max(h,l)-u),p=E=>r.mat==="plank"?1:.18+.82*Math.pow(Math.max(0,Math.min(1,(E-u)/d)),2.2),g=(E,w,S,_,v,R=!0)=>{for(let C of w)E.push([C[0],C[1],C[2],S[0],S[1],S[2],v==="xz"?C[0]/_:v==="zy"?C[2]/_:C[0]/_,v==="xz"?C[2]/_:C[1]/_,R?1:p(C[1])])},x=1,m=-(l-h)/(o-c),f=Math.hypot(x,m);g(e,[[s,h,c],[s,l,o],[a,l,o],[a,h,c]],[0,x/f,m/f],n,"xz"),g(t,[[s,u,c],[s,h,c],[a,h,c],[a,u,c]],[0,0,-1],i,"xy",!1),g(t,[[a,u,o],[a,l,o],[s,l,o],[s,u,o]],[0,0,1],i,"xy",!1),g(t,[[s,u,o],[s,l,o],[s,h,c],[s,u,c]],[-1,0,0],i,"zy",!1),g(t,[[a,u,c],[a,h,c],[a,l,o],[a,u,o]],[1,0,0],i,"zy",!1),(r.mat==="plank"||r.crumbles)&&g(t,[[s,u,c],[a,u,c],[a,u,o],[s,u,o]],[0,-1,0],i,"xz",!1),r.mat==="grass"&&(g(e,[[s-.03,h-.32,c-.03],[s-.03,h,c-.03],[a+.03,h,c-.03],[a+.03,h-.32,c-.03]],[0,0,-1],n,"xy"),g(e,[[s-.03,l-.32,o+.03],[s-.03,h-.32,c-.03],[s-.03,h,c-.03],[s-.03,l,o+.03]].map((S,_)=>S)&&[[s-.03,h-.32,o+.03],[s-.03,l,o+.03],[s-.03,h,c-.03],[s-.03,h-.32,c-.03]],[-1,0,0],n,"zy"),g(e,[[a+.03,h-.32,c-.03],[a+.03,h,c-.03],[a+.03,l,o+.03],[a+.03,l-.32,o+.03]],[1,0,0],n,"zy"));let M=[...e,...t],T=new xt,y=[];for(let E=0;E<M.length/4;E++){let w=E*4;y.push(w,w+1,w+2,w,w+2,w+3)}return T.setAttribute("position",new Ye(M.flatMap(E=>E.slice(0,3)),3)),T.setAttribute("normal",new Ye(M.flatMap(E=>E.slice(3,6)),3)),T.setAttribute("uv",new Ye(M.flatMap(E=>E.slice(6,8)),2)),T.setAttribute("color",new Ye(M.flatMap(E=>[E[8],E[8],E[8]]),3)),T.setIndex(y),T.addGroup(0,e.length/4*6,0),T.addGroup(e.length/4*6,t.length/4*6,1),T}function zy(r,e,t){let n=r.getAttribute("position"),i=r.getAttribute("uv");for(let s=0;s<n.count;s++)i.setXY(s,n.getX(s)/e,n.getZ(s)/e);i.needsUpdate=!0}function ni(r,e,t){let n=new tn().setFromObject(r),i=new L;n.getSize(i);let s=e/Math.max(.001,t==="height"?i.y:Math.max(i.x,i.y,i.z)),a=r.clone(!0);a.position.set(-(n.min.x+n.max.x)/2*s,t==="height"?-n.min.y*s:-(n.min.y+n.max.y)/2*s,-(n.min.z+n.max.z)/2*s),a.scale.setScalar(s);let c=new Je;return c.add(a),c.userData.base=1,a.traverse(o=>{o.isMesh&&(o.castShadow=!0,o.receiveShadow=!0)}),c}function Fy(r="\u0424\u0418\u041D\u0418\u0428"){let e=document.createElement("canvas");e.width=1024,e.height=136;let t=e.getContext("2d");t.fillStyle="#7a0f0b",t.fillRect(0,0,1024,136);for(let i=0;i<32;i++)t.fillStyle=i%2?"#f2eadc":"#111",t.fillRect(i*32,0,32,16),t.fillStyle=i%2?"#111":"#f2eadc",t.fillRect(i*32,120,32,16);t.fillStyle="#f6e7c8",t.font="bold 76px Georgia, serif",t.textAlign="center",t.textBaseline="middle",t.fillText(r,512,70);let n=new Yt(e);return n.colorSpace=mt,n}function va(r,e){let t=document.getElementById(r);t&&t.textContent!==e&&(t.textContent=e)}var pr=new L(.31,.32,.9).normalize();function Oy(r){return new Promise(e=>{if(r.image?.complete)e(r);else{let t=r.image,n=()=>r.image?.complete?e(r):setTimeout(n,30);n()}})}function Bt(r=!1){let e=document.createElement("canvas");e.width=e.height=64;let t=e.getContext("2d"),n=t.createRadialGradient(32,32,0,32,32,32);return n.addColorStop(0,"rgba(255,255,255,1)"),n.addColorStop(r?.5:.25,`rgba(255,255,255,${r?.45:.5})`),n.addColorStop(1,"rgba(255,255,255,0)"),t.fillStyle=n,t.fillRect(0,0,64,64),new Yt(e)}function tu(r){let e=[],t=[],n=[],i=[],s=0;for(let c of r){let o=c.getAttribute("position"),h=c.getAttribute("normal"),l=c.getAttribute("uv"),u=c.getIndex();for(let d=0;d<o.count;d++)e.push(o.getX(d),o.getY(d),o.getZ(d)),t.push(h.getX(d),h.getY(d),h.getZ(d)),n.push(l.getX(d),l.getY(d));for(let d=0;d<u.count;d++)i.push(u.getX(d)+s);s+=o.count}let a=new xt;return a.setAttribute("position",new Ye(e,3)),a.setAttribute("normal",new Ye(t,3)),a.setAttribute("uv",new Ye(n,2)),a.setIndex(i),a}var Ff=new L(.81,.3,.59).normalize();function By(){let r=new as;r.moveTo(-1.6,0),r.quadraticCurveTo(0,-1.25,1.6,0),r.quadraticCurveTo(0,-.55,-1.6,0);let e=new $s(r,{depth:.06,bevelEnabled:!0,bevelThickness:.02,bevelSize:.03,bevelSegments:1,curveSegments:18});e.translate(0,.1,-.03);let t=new J(e,yn("metal_plate_02",13620184,.5)),n=new J(new ke(.5,.5,.3),new st({color:2761760,metalness:.6,roughness:.6}));n.position.y=.25;let i=new Je;return i.add(t,n),t.castShadow=!0,i.userData.base=1,i}function Hy(){let r=new Je,e=new J(new Fi(.85,1),new st({color:3149832,emissive:16738842,emissiveIntensity:2.4,roughness:.9})),t=new Xt(new Wt({map:Bt(!0),color:16742954,transparent:!0,depthWrite:!1,blending:Et}));t.scale.setScalar(3.4);let n=new Xt(new Wt({map:Bt(!0),color:16726544,transparent:!0,opacity:.6,depthWrite:!1,blending:Et}));return n.scale.set(1.8,4.5,1),n.position.y=1.9,r.add(e,t,n),r.userData.base=1,r}function Of(){let r=document.createElement("canvas");r.width=512,r.height=64;let e=r.getContext("2d");for(let n=0;n<16;n++)e.fillStyle=n%2?"#f2eadc":"#1a1410",e.fillRect(n*32,0,32,10),e.fillStyle=n%2?"#1a1410":"#f2eadc",e.fillRect(n*32,54,32,10);e.fillStyle="#2a7fb0",e.fillRect(0,10,512,44),e.fillStyle="#f6e7c8",e.font="bold 32px Georgia, serif",e.textAlign="center",e.textBaseline="middle",e.fillText("\u0427\u0415\u041A\u041F\u041E\u0418\u041D\u0422",256,33);let t=new Yt(r);return t.colorSpace=mt,t}var Ma=new L(-.18,1,.32).normalize();function ky(r){let e=new Je;return r.rotation.z=Math.PI/2,e.add(r),e.userData.base=r.userData.base,e}function Gy(){let r=document.createElement("canvas");r.width=64,r.height=256;let e=r.getContext("2d"),t=e.createLinearGradient(0,0,0,256);t.addColorStop(0,"rgba(255,255,255,.9)"),t.addColorStop(1,"rgba(255,255,255,0)"),e.fillStyle=t,e.fillRect(0,0,64,256);let n=e.createLinearGradient(0,0,64,0);return n.addColorStop(0,"rgba(0,0,0,1)"),n.addColorStop(.25,"rgba(0,0,0,0)"),n.addColorStop(.75,"rgba(0,0,0,0)"),n.addColorStop(1,"rgba(0,0,0,1)"),e.globalCompositeOperation="destination-out",e.fillStyle=n,e.fillRect(0,0,64,256),new Yt(r)}function Vy(){let r=new Je,e=yn("rusty_metal_02",10132122,.5),t=new J(new Fi(.85,2),e);t.castShadow=!0,r.add(t);let n=new Fi(1,1),i=n.getAttribute("position"),s=new Set;for(let c=0;c<i.count;c++){let o=new L(i.getX(c),i.getY(c),i.getZ(c)).normalize(),h=o.toArray().map(u=>u.toFixed(2)).join();if(s.has(h))continue;s.add(h);let l=new J(new Yn(.13,.55,8),e);l.position.copy(o.clone().multiplyScalar(1.02)),l.quaternion.setFromUnitVectors(new L(0,1,0),o),r.add(l)}let a=new J(new pn(.2,.06,6,12),e);return a.position.y=.95,r.add(a),r.userData.base=1,r}function Bf(){let r=document.createElement("canvas");r.width=r.height=128;let e=r.getContext("2d");e.fillStyle="#3a1a08",e.fillRect(0,0,128,128),e.strokeStyle="#ffcf5a",e.lineWidth=8;for(let n of[56,38])e.beginPath(),e.arc(64,64,n,0,7),e.stroke();e.fillStyle="#ffe08a",e.beginPath(),e.moveTo(64,26),e.lineTo(90,64),e.lineTo(74,64),e.lineTo(74,100),e.lineTo(54,100),e.lineTo(54,64),e.lineTo(38,64),e.closePath(),e.fill();let t=new Yt(r);return t.colorSpace=mt,t.center.set(.5,.5),t.rotation=Math.PI,t}function Hf(r=!1){let e=new Je,t=yn("rusty_metal_02",9211020,.3),n=yn("rusty_metal_02",16777215,.6),i=.85,s=1.7,a=18,c=new J(new _t(i,i*1.02,.12,28),n);c.position.y=.06,e.add(c);for(let l of[.12,.9,s]){let u=new J(new pn(i,.045,8,40).rotateX(Math.PI/2),t);u.position.y=l,e.add(u)}let o=new _t(.025,.025,s-.12,6);for(let l=0;l<a;l++){let u=l/a*Math.PI*2;if(r&&l>=2&&l<=4)continue;let d=new J(o,t);d.position.set(Math.cos(u)*i,(s+.12)/2,Math.sin(u)*i),d.castShadow=!0,e.add(d)}for(let l=0;l<a/2;l++){let u=l/(a/2)*Math.PI,d=new J(new pn(i,.025,6,24,Math.PI),t);d.position.y=s,d.rotation.y=u,e.add(d)}let h=new J(new pn(.13,.035,8,16),t);if(h.position.y=s+i+.12,e.add(h),r){let l=new Je;for(let u=0;u<3;u++){let d=new J(o,t);d.position.set(u*.26,(s+.12)/2,0),l.add(d)}l.position.set(Math.cos(2/a*Math.PI*2)*i,0,Math.sin(2/a*Math.PI*2)*i),l.rotation.y=-1.6,e.add(l)}return e.traverse(l=>{l.isMesh&&(l.castShadow=!0,l.receiveShadow=!0)}),e}function Wy(){let r=document.createElement("canvas");r.width=4,r.height=64;let e=r.getContext("2d"),t=e.createLinearGradient(0,0,0,64);return t.addColorStop(0,"rgba(0,0,0,0)"),t.addColorStop(1,"rgba(0,0,0,.75)"),e.fillStyle=t,e.fillRect(0,0,4,64),new Yt(r)}function Xy(){let r=document.createElement("canvas");r.width=r.height=256;let e=r.getContext("2d");e.translate(128,128);for(let n=0;n<900;n++){let i=n/900,s=i*Math.PI*14,a=i*120;e.fillStyle=`rgba(255,255,255,${.6*(1-i)+.1})`,e.beginPath(),e.arc(Math.cos(s)*a,Math.sin(s)*a,2+i*7,0,7),e.fill()}let t=e.createRadialGradient(0,0,0,0,0,128);return t.addColorStop(0,"rgba(255,255,255,.9)"),t.addColorStop(.3,"rgba(255,255,255,.2)"),t.addColorStop(1,"rgba(255,255,255,0)"),e.fillStyle=t,e.fillRect(-128,-128,256,256),new Yt(r)}function qy(){let r=document.createElement("canvas");r.width=r.height=256;let e=r.getContext("2d");e.strokeStyle="#000",e.lineCap="round";for(let t=0;t<7;t++){let n=128+(Math.random()-.5)*30,i=128+(Math.random()-.5)*30;e.lineWidth=4,e.beginPath(),e.moveTo(n,i);let s=Math.random()*6.28;for(let a=0;a<8;a++)n+=Math.cos(s+(Math.random()-.5)*1.2)*18,i+=Math.sin(s+(Math.random()-.5)*1.2)*18,e.lineTo(n,i),e.lineWidth=Math.max(1,4-a*.4);e.stroke()}return new Yt(r)}var kf=new Map;function yn(r,e=16777215,t=1){let n=r+e+t,i=kf.get(n);if(i)return i;let s=new Bi,a=(o,h=!1)=>{let l=s.load(`tex/${r}/${o}.jpg`);return l.wrapS=l.wrapT=Sn,l.repeat.set(t,t),l.anisotropy=4,h&&(l.colorSpace=mt),l},c=a("arm");return i=new st({map:a("diffuse",!0),normalMap:a("nor_gl"),roughnessMap:c,metalnessMap:c,metalness:1,roughness:1,color:e,envMapIntensity:1.3}),kf.set(n,i),i}function Yy(){let r=document.createElement("canvas");r.width=64,r.height=256;let e=r.getContext("2d"),t=e.createLinearGradient(0,0,0,256);t.addColorStop(0,"rgba(255,255,255,0)"),t.addColorStop(.6,"rgba(255,255,255,.8)"),t.addColorStop(1,"rgba(255,255,255,1)"),e.fillStyle=t,e.fillRect(0,0,64,256);let n=e.createLinearGradient(0,0,64,0);return n.addColorStop(0,"rgba(0,0,0,1)"),n.addColorStop(.5,"rgba(0,0,0,0)"),n.addColorStop(1,"rgba(0,0,0,1)"),e.globalCompositeOperation="destination-out",e.fillStyle=n,e.fillRect(0,0,64,256),new Yt(r)}var Gc=25,Vc=[[.6,"\u0414\u043E\u0431\u0440\u043E \u043F\u043E\u0436\u0430\u043B\u043E\u0432\u0430\u0442\u044C \u0432 \u041F\u0440\u043E\u043A\u043B\u044F\u0442\u044B\u0439 \u0437\u0430\u0431\u0435\u0433!"],[3.8,"\u0426\u0435\u043B\u044C \u043F\u0440\u043E\u0441\u0442\u0430\u044F \u2014 \u043F\u0435\u0440\u0432\u044B\u043C \u0434\u043E\u0431\u0435\u0436\u0430\u0442\u044C \u0434\u043E \u0444\u0438\u043D\u0438\u0448\u0430!"],[8.2,"\u041D\u0430 \u043F\u0443\u0442\u0438 \u0431\u0440\u0451\u0432\u043D\u0430, \u0431\u043E\u0447\u043A\u0438, \u043B\u043E\u0432\u0443\u0448\u043A\u0438 \u0438 \u043F\u0440\u043E\u043F\u0430\u0441\u0442\u0438. \u0423\u043F\u0430\u043B\u0438? \u0412\u0435\u0440\u043D\u0451\u0442\u0435\u0441\u044C \u043D\u0430 \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0439 \u0447\u0435\u043A\u043F\u043E\u0438\u043D\u0442."],[15.6,"\u0414\u0436\u043E\u0439\u0441\u0442\u0438\u043A \u0441\u043B\u0435\u0432\u0430 \u2014 \u0431\u0435\u0436\u0430\u0442\u044C. \u041A\u043D\u043E\u043F\u043A\u0430 \u0441\u043F\u0440\u0430\u0432\u0430 \u2014 \u043F\u0440\u044B\u0433\u0430\u0442\u044C."],[20.2,"\u0422\u0440\u0430\u0441\u0441\u0430 \u043A\u0430\u0436\u0434\u044B\u0439 \u0440\u0430\u0437 \u043D\u043E\u0432\u0430\u044F. \u0423\u0434\u0430\u0447\u0438 \u2014 \u0438 \u043D\u0435 \u043E\u0442\u0441\u0442\u0430\u0432\u0430\u0439\u0442\u0435!"]];var ii=new URLSearchParams(location.search),Vf=document.getElementById("pick"),Wc=document.getElementById("loading"),Wf=document.getElementById("load-fill"),iu=[1,2,3,4].includes(Number(ii.get("map")))?Number(ii.get("map")):1;function Zy(){let r=null;if(ii.get("host")){let l=/#token=([^&]+)/.exec(location.hash)?.[1];l&&(r={code:ii.get("room"),token:decodeURIComponent(l)})}else try{r=JSON.parse(sessionStorage.getItem("finalanswer-session")||"null")}catch{}if(!r?.code||!r?.token){document.querySelector("#loading h2").textContent="\u041D\u0435\u0442 \u0441\u0435\u0441\u0441\u0438\u0438 \u043A\u043E\u043C\u043D\u0430\u0442\u044B \u2014 \u0432\u0435\u0440\u043D\u0438\u0442\u0435\u0441\u044C \u0432 \u0438\u0433\u0440\u0443";return}Vf.hidden=!0,Wc.hidden=!1,document.body.classList.add("playing");let e=null,t=0,n="",i,s=!1,a=()=>Date.now()+t,c=(l,u)=>{i?.readyState===1&&i.send(JSON.stringify({type:l,requestId:"race_"+Math.random().toString(36).slice(2),payload:u}))},o=async l=>{if(typeof l.serverTime=="number"&&(t=l.serverTime-Date.now()),l.webGame!=="race"||!l.race){n&&(location.href="/");return}if(s||n===l.race.id)return;s=!0,n=l.race.id;let u=(l.players||[]).filter(x=>x.connectionStatus!=="OFFLINE"||!0).map(x=>({id:x.id,name:x.nickname||x.name,char:x.characterId})),d=u.find(x=>x.id===l.selfId);e=new ba(document.getElementById("stage"),d?.char||"pumpkin",l.race.map,{roster:u,selfId:l.selfId,seed:l.race.seed,startAt:l.race.startAt,serverNow:a,send:x=>c("RACE_STATE",{roomCode:r.code,s:x}),spectator:!!l.host}),await e.load(x=>Wf.style.width=`${Math.round(x*100)}%`),Wc.hidden=!0,e.start();let p=document.getElementById("tap");p.hidden=!1,p.onclick=()=>{p.hidden=!0,e.snd.unlock(),e.snd.ambience(e.course.theme),e.snd.playMusic("audio/music.m4a")},document.getElementById("intro-skip").onclick=()=>{e.introSkipped=!0,document.getElementById("intro").hidden=!0,e.snd.voice("")};let g=document.getElementById("again");g.textContent=l.host?"\u0412 \u041B\u041E\u0411\u0411\u0418":"\u0416\u0414\u0401\u041C \u0412\u0415\u0414\u0423\u0429\u0415\u0413\u041E",l.host||(g.onclick=()=>{})};if(ii.get("host")){let l=(d=!1)=>`/rooms/${encodeURIComponent(r.code)}/race?token=${encodeURIComponent(r.token)}${d?"&close=1":""}`,u=async()=>{try{let d=await fetch(l()),p=await d.json();d.ok&&(!n&&p.race?await o(p):n&&p.webGame!=="race"?document.querySelector("#verdict").textContent="\u0417\u0410\u0411\u0415\u0413 \u0417\u0410\u041A\u0420\u042B\u0422":(t+=(p.serverTime-Date.now()-t)*.2,e?.remote(p.runners)))}catch{}setTimeout(u,120)};u(),document.getElementById("again").onclick=()=>fetch(l(!0));return}let h=()=>{i=new WebSocket(`${location.protocol==="https:"?"wss":"ws"}://${location.host}/ws`),i.onopen=()=>c("AUTH",{roomCode:r.code,token:r.token}),i.onmessage=l=>{try{let u=JSON.parse(l.data);if(u.type==="RACE_POS"){u.payload.id===n&&(t+=(u.payload.serverTime-Date.now()-t)*.1,e?.remote(u.payload.runners));return}u.payload?.code&&u.payload?.selfId!==void 0&&o(u.payload)}catch{}},i.onclose=()=>setTimeout(h,1500)};h(),setInterval(()=>c("PING",{roomCode:r.code}),8e3)}var Gf=async r=>{Vf.hidden=!0,Wc.hidden=!1,document.body.classList.add("playing");let e=new ba(document.getElementById("stage"),r,iu);await e.load(t=>Wf.style.width=`${Math.round(t*100)}%`),Wc.hidden=!0,e.start(),document.getElementById("again").onclick=()=>location.reload()};if(ii.get("net")||ii.get("host"))Zy();else if(ii.get("char")&&Mi.includes(ii.get("char")))Gf(ii.get("char"));else for(let r of Mi){let e=document.createElement("button");e.innerHTML=`<img src="../hell-cage-host/chars/${r}.png" alt=""><span>${nu[r]}</span>`,e.onclick=()=>Gf(r),document.getElementById("roster").appendChild(e)}for(let r of document.querySelectorAll("#maps button"))r.classList.toggle("on",Number(r.dataset.map)===iu),r.onclick=()=>{iu=Number(r.dataset.map),document.querySelectorAll("#maps button").forEach(e=>e.classList.toggle("on",e===r))};
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
