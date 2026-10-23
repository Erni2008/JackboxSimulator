/* Render the production clock with a controlled browser scheduler, including hidden/reduced-motion paths. */
const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict'),path=require('node:path');
let pending=new Map(),id=0,now=0,paints=0,observerDisconnected=false;
const events={},document={hidden:false,body:{dataset:{}},addEventListener:(key,fn)=>events[key]=fn,removeEventListener:key=>delete events[key]};
const context={clearRect(){paints++;},setTransform(){},drawImage(){},save(){},restore(){},beginPath(){},moveTo(){},arc(){},closePath(){},fill(){},translate(){},rotate(){}};
const canvas={width:1223,height:1286,dataset:{},getContext:()=>context,getBoundingClientRect:()=>({width:230}),setAttribute(){}};
const sandbox={document,devicePixelRatio:3,Image:class{complete=true;naturalWidth=10;},ResizeObserver:class{observe(){}disconnect(){observerDisconnected=true;}},matchMedia:()=>({matches:false}),requestAnimationFrame:fn=>{pending.set(++id,fn);return id;},cancelAnimationFrame:key=>pending.delete(key)};
vm.createContext(sandbox);vm.runInContext(fs.readFileSync(path.resolve(__dirname,'../../web/countdown-clock.js'),'utf8')+';globalThis.Clock=CountdownClock',sandbox);
const clock=new sandbox.Clock(canvas,()=>now);
function frame(timestamp){now=timestamp;const work=[...pending.values()];pending.clear();for(const fn of work)fn(timestamp);assert(pending.size<=1,'Only one RAF may be active');}
clock.set(5000,5,true);assert(canvas.width<=512&&canvas.height<=539,'Retina backing store is bounded');
for(let t=0;t<=1000;t+=1000/144)frame(t);
assert(paints<=32,'144 Hz devices must not rasterize at display rate');assert(paints>=20,'Normal motion remains smooth');
const before=paints;document.hidden=true;events.visibilitychange();for(let t=1100;t<=2000;t+=10)frame(t);assert.equal(paints,before,'Background tab must stop rasterizing');assert.equal(pending.size,0);
document.hidden=false;document.body.dataset.reducedMotion='true';events.visibilitychange();const quiet=paints;
for(let t=2100;t<4900;t+=1000/144)frame(t);assert(paints-quiet<=4,'Reduced motion draws at most once per second');
frame(5100);assert.equal(canvas.dataset.angle,'0','Deadline is absolute, not frame-count based');assert.equal(pending.size,0,'No RAF after deadline');
clock.set(9000,4,true);assert.equal(pending.size,1);clock.set(9000,4,false);assert.equal(pending.size,0,'Phase end cancels pending work');
clock.dispose();clock.set(12000,3,true);assert.equal(pending.size,0);assert(observerDisconnected);assert(!events.visibilitychange);
console.log('PASS: production phone clock has one RAF, <=30 raster updates/s at 144 Hz, bounded retina surface, hidden-tab stop, reduced-motion cadence, deadline/reset/dispose');
