// PHASE 1 check: diagnostic panel (meter states, TEST CIRCUIT, selector, terminal tags, inspect view) via real clicks/taps.
// URL=http://localhost:PORT/broken-elevator-manual/ OUT=dir PLAYWRIGHT_MODULE=... CHROME_PATH=... node tools/checks/check_broken_elevator_panel.cjs
const assert=require('node:assert/strict');const {chromium}=require(process.env.PLAYWRIGHT_MODULE);const url=process.env.URL,out=process.env.OUT;
const ok=m=>console.log('PASS '+m);
async function run(fault,mode,wires,touch){
  const b=await chromium.launch({executablePath:process.env.CHROME_PATH,args:['--use-angle=metal','--ignore-gpu-blocklist']});
  const vp=touch?{width:390,height:844}:{width:1280,height:800};const p=await b.newPage({viewport:vp,deviceScaleFactor:touch?2:1,hasTouch:touch,isMobile:touch});const errors=[];p.on('pageerror',e=>errors.push(e.message));
  await p.goto(`${url}?capture=1&lang=ru&seed=7&fault=${fault}&mode=${mode}&wires=${wires}&quality=${touch?'low':'high'}`);await p.waitForFunction(()=>window.__manual,null,{timeout:120000});await p.waitForTimeout(1200);
  const M=f=>p.evaluate(f),tag=`${fault}/${mode}/${wires}${touch?'/touch':''}`;const tap=async(x,y)=>touch?p.touchscreen.tap(x,y):p.mouse.click(x,y);
  const scr=o=>p.evaluate(o=>{const m=window.__manual,b=m.box,t=o==='button'?b.button.cap:o==='selector'?b.selector.group:b.header;const v=t.getWorldPosition(new m.camera.position.constructor()).project(m.camera);return [(v.x+1)/2*innerWidth,(1-v.y)/2*innerHeight];},o);
  // face the panel, tap it -> close-up inspection
  await M(()=>{const m=window.__manual,c=m.box.center(),e=m.cage.eye,d=c.clone().sub(e);m.look(Math.atan2(-d.x,-d.z),Math.atan2(d.y,Math.hypot(d.x,d.z)));});await p.waitForTimeout(300);
  let [x,y]=await scr('header');await tap(x,y);await p.waitForTimeout(1300);
  const insp=await M(()=>window.__manual.camera.position.distanceTo(window.__manual.box.center()));assert.ok(insp<1.5,'close-up distance '+insp);ok(`${tag}: tap on panel moves into close-up (${insp.toFixed(2)} m)`);
  const inside=await M(()=>{const m=window.__manual,c=m.cage.inner,p=m.camera.position;return p.x>c.min.x&&p.x<c.max.x&&p.z>c.min.z&&p.z<c.max.z;});assert.ok(inside);ok(`${tag}: camera stays inside the cage`);
  assert.equal(await M(()=>window.__manual.box.open),true);ok(`${tag}: door opened (latch turned)`);
  assert.equal(await M(()=>window.__manual.box.terminals.children.filter(c=>c.geometry.type==='BoxGeometry'&&c.material.length).length),wires);ok(`${tag}: ${wires} terminal tags for ${wires} wires`);
  assert.equal(await M(()=>window.__manual.box.selector.mode),mode);ok(`${tag}: selector shows ${mode.toUpperCase()}`);
  [x,y]=await scr('selector');await tap(x,y);await p.waitForTimeout(400);assert.equal(await M(()=>window.__manual.box.selector.mode),mode);ok(`${tag}: selector is read-only`);
  await p.screenshot({path:`${out}/${fault}-${mode}-${wires}${touch?'-phone':''}-idle.png`});
  const angles=[];for(let rep=0;rep<2;rep++){await p.waitForFunction(()=>!window.__manual.box.testing,null,{timeout:10000});[x,y]=await scr('button');await tap(x,y);await p.waitForTimeout(120);assert.equal(await M(()=>window.__manual.box.testing),true,'last tap '+await M(()=>String(window.__lastTap))+' at '+x.toFixed(0)+','+y.toFixed(0));
    const s=[];for(let k=0;k<9;k++){await p.waitForTimeout(170);s.push(await M(()=>-window.__manual.box.meter.needle.rotation.z));if(rep===0&&k===5)await p.screenshot({path:`${out}/${fault}-${mode}-${wires}${touch?'-phone':''}-test.png`});}
    angles.push(s);await p.waitForTimeout(800);assert.equal(await M(()=>window.__manual.box.meter.state),fault);}
  ok(`${tag}: TEST CIRCUIT responds and repeats with the same fault`);
  const A0=-Math.PI*.75,span=Math.PI*1.5,val=a=>(a-A0)/span*10;const v=angles[0].map(val),max=Math.max(...v.slice(2,8)),min=Math.min(...v.slice(2,8)),last=v[7];
  if(fault==='overload')assert.ok(Math.max(...v)>8.5&&v.slice(1,6).every(x=>x>7),`overload in red ${v.map(x=>x.toFixed(1))}`);if(fault==='short')assert.ok(max-min>2,`short oscillates ${min}-${max}`);if(fault==='power')assert.ok(last<1.2&&max<3,`power falls ${max} ${last}`);
  ok(`${tag}: needle behaviour matches ${fault} (min ${min.toFixed(1)}, max ${max.toFixed(1)}, end ${last.toFixed(1)})`);
  await p.click('#btn-back');await p.waitForTimeout(1200);const back=await M(()=>window.__manual.camera.position.distanceTo(window.__manual.cage.eye));assert.ok(back<.02);ok(`${tag}: Back returns to the cage view`);
  assert.deepEqual(errors,[]);ok(`${tag}: no page errors`);console.log(tag,'draw calls',await M(()=>window.__manual.info.calls));await b.close();
}
(async()=>{await run('overload','normal',6,false);await run('short','emergency',5,false);await run('power','normal',4,false);await run('short','normal',6,true);})().catch(e=>{console.error('FAIL',e.message);process.exit(1);});
