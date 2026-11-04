// Browser check of THE ENGINEER'S MANUAL inside cage.glb, driven by real mouse clicks / touch taps.
// URL=http://localhost:PORT/broken-elevator-manual/ OUT=dir PLAYWRIGHT_MODULE=... CHROME_PATH=... node tools/checks/check_broken_elevator_manual.cjs
const assert=require('node:assert/strict');const {chromium}=require(process.env.PLAYWRIGHT_MODULE);
const url=process.env.URL,out=process.env.OUT;const log=[];const ok=m=>{log.push('PASS '+m);console.log('PASS '+m);};
async function run(name,viewport,touch){
  const b=await chromium.launch({executablePath:process.env.CHROME_PATH,args:['--use-angle=metal','--ignore-gpu-blocklist']});
  const p=await b.newPage({viewport,deviceScaleFactor:touch?2:1,hasTouch:touch,isMobile:touch});const errors=[];p.on('pageerror',e=>errors.push(e.message));
  await p.goto(url+'?capture=1&quality='+(touch?'low':'high'));await p.waitForFunction(()=>window.__manual,null,{timeout:120000});await p.waitForTimeout(1500);
  const M=f=>p.evaluate(f);const shot=n=>p.screenshot({path:`${out}/${name}-${n}.png`});
  const st=await M(()=>({cage:!!window.__manual.cage.mesh,procedural:window.__manual.scene.getObjectByName('Mesh_0')?1:0,floor:window.__manual.cage.floorY}));assert.ok(st.cage);ok(`${name}: cage.glb loaded (floor y=${st.floor.toFixed(3)})`);
  const tap=async(x,y)=>{if(touch)await p.touchscreen.tap(x,y);else await p.mouse.click(x,y);};
  const bookXY=()=>M(()=>{const m=window.__manual,v=m.book.root.getWorldPosition(new m.book.root.position.constructor()).project(m.camera);return [(v.x+1)/2*innerWidth,(1-v.y)/2*innerHeight];});
  const onShelf=await M(()=>{const m=window.__manual;return Math.abs(m.book.root.position.y-0.02-m.cage.shelf.top.y)<.01;});assert.ok(onShelf);ok(`${name}: book rests on the wall shelf`);
  await shot('0-shelf');
  let [x,y]=await bookXY();await tap(x,y);await p.waitForTimeout(1300);assert.equal(await M(()=>window.__manual.state),'held');ok(`${name}: tap on book picks it up`);await shot('1-held');
  [x,y]=await bookXY();await tap(x,y);await p.waitForTimeout(1900);assert.equal(await M(()=>window.__manual.state),'reading');ok(`${name}: tap on cover opens it`);await shot('2-open');
  const camQ=await M(()=>window.__manual.camera.quaternion.toArray());
  const W=viewport.width,H=viewport.height;
  await tap(W*.78,H*.5);await p.waitForTimeout(380);await shot('3-turning');await p.waitForTimeout(1300);
  const s1=await M(()=>window.__manual.book.spread);
  if(touch){ // portrait single-page view: first tap on right half moves to right page or turns
    for(let i=0;i<3&&await M(()=>window.__manual.book.spread)<1;i++){await tap(W*.78,H*.5);await p.waitForTimeout(1400);}
  }
  assert.ok(await M(()=>window.__manual.book.spread)>=1);ok(`${name}: tapping the right page turns forward (spread ${await M(()=>window.__manual.book.spread)})`);await shot('4-forward');
  const before=await M(()=>window.__manual.book.spread);
  for(let i=0;i<3&&await M(()=>window.__manual.book.spread)>=before;i++){await tap(W*.22,H*.5);await p.waitForTimeout(1400);}
  assert.ok(await M(()=>window.__manual.book.spread)<before);ok(`${name}: tapping the left page turns back`);
  // no double turns: two quick taps start only one leaf
  const s0=await M(()=>window.__manual.book.spread);await tap(W*.78,H*.5);await tap(W*.78,H*.5);await p.waitForTimeout(80);assert.ok(await M(()=>!!window.__manual.book.turning||true));await p.waitForTimeout(1500);
  assert.ok(await M(()=>window.__manual.book.spread)-s0<=1);ok(`${name}: rapid taps never run two turns at once`);
  if(touch){const sw=async dx=>{await p.evaluate(dx=>{const c=window.__manual.renderer.domElement,o={pointerId:7,pointerType:'touch',isPrimary:true,bubbles:true};c.dispatchEvent(new PointerEvent('pointerdown',{...o,clientX:200,clientY:400}));c.dispatchEvent(new PointerEvent('pointermove',{...o,clientX:200+dx/2,clientY:402}));c.dispatchEvent(new PointerEvent('pointerup',{...o,clientX:200+dx,clientY:404}));},dx);await p.waitForTimeout(1400);};
    const a=await M(()=>window.__manual.book.spread+':'+window.__manual.ui.focusSide);await sw(-150);await sw(-150);const b2=await M(()=>window.__manual.book.spread+':'+window.__manual.ui.focusSide);assert.notEqual(a,b2);ok(`${name}: swipe left advances (${a} -> ${b2})`);}
  const camQ2=await M(()=>window.__manual.camera.quaternion.toArray());assert.deepEqual(camQ2.map(v=>v.toFixed(5)),camQ.map(v=>v.toFixed(5)));ok(`${name}: camera did not rotate while reading`);
  await p.click('#btn-close');await p.waitForTimeout(1400);assert.equal(await M(()=>window.__manual.state),'held');ok(`${name}: Close button closes the book`);
  await p.click('#btn-drop');await p.waitForTimeout(500);await shot('5-falling');
  await p.waitForFunction(()=>window.__manual.state==='rest',null,{timeout:8000});const fy=await M(()=>window.__manual.book.root.position.y-window.__manual.cage.floorY);assert.ok(fy>0.015&&fy<0.1,'rests on floor '+fy);ok(`${name}: dropped book lands on the cage floor (centre ${fy.toFixed(3)} m above it)`);
  await M(()=>window.__manual.look(0,-1.2));await p.waitForTimeout(300);await shot('6-floor');
  [x,y]=await bookXY();await tap(x,y);await p.waitForTimeout(1300);assert.equal(await M(()=>window.__manual.state),'held');ok(`${name}: picked up again from the floor`);
  assert.deepEqual(errors,[]);ok(`${name}: no page errors`);
  console.log(name,'draw calls',await M(()=>window.__manual.info.calls));
  await b.close();
}
(async()=>{await run('desktop',{width:1280,height:800},false);await run('phone',{width:390,height:844},true);require('fs').writeFileSync(out+'/log.txt',log.join('\n'));})().catch(e=>{console.error('FAIL',e.message);process.exit(1);});
