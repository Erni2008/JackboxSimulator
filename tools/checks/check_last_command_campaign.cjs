const assert=require('node:assert/strict'),fs=require('node:fs');const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
(async()=>{const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||undefined});const errors=[],contexts=[];const base=process.env.LC_URL||'http://localhost:18095';const report={types:[],correct:0,wrong:0,memoryRecalls:0,modelLoads:0};
async function client(name,room){const c=await browser.newContext({viewport:{width:1440,height:1000}});contexts.push(c);const p=await c.newPage();p.setDefaultTimeout(120000);p.on('pageerror',e=>errors.push(e.message));p.on('request',r=>{if(!room&&r.url().endsWith('.glb'))report.modelLoads++;});await p.goto(base+'/last-command-3d/');await p.locator('#name').fill(name);if(room){await p.locator('#room').fill(room);await p.locator('#join-dev').click();}else {await p.locator('#scenario').selectOption('classic');await p.locator('#quick').click();}await p.waitForFunction(()=>window.__lc3d?.view?.machine?.loaded&&!document.querySelector('#quality').disabled);return p;}
async function get(p){return p.evaluate(()=>window.__lc3d.state.lastCommand);}
async function act(p,id,kind,value=''){const seq=(await get(p)).sequence;await p.evaluate(([id,k,v])=>window.__lc3d.action(id,k,v),[id,kind,value]);await p.waitForTimeout(100);}
async function press(p,id){await act(p,id,'PRESS');await act(p,id,'RELEASE');}
const stored={};let forcedWrong=false;
try{const host=await client('Operator');const room=await host.evaluate(()=>window.__lc3d.state.code);const guest=await client('Observer',room);assert.equal((await get(host)).testRound.status,'READY');assert.equal(await host.evaluate(()=>[...window.__lc3d.view.machine.deployment.mounts.values()].filter(m=>m.group.visible).length),0);await host.locator('#scene-start').click();const initialLoads=report.modelLoads;
fs.mkdirSync('generated/last-command-campaign',{recursive:true});
for(let n=0;n<65;n++){
 await host.waitForFunction(()=>{const r=window.__lc3d.state.lastCommand.testRound;return r.status==='WON'||r.status==='PLAYING'&&!r.nextAt&&Date.now()+window.__lc3d.view.machine.timeOffset>=r.readyAt+100;});
 let panel=await get(host),r=panel.testRound;if(r.status==='WON')break;const id=r.taskId,type=r.taskType;report.types.push(type);
 await guest.waitForFunction(id=>window.__lc3d.state.lastCommand.testRound.taskId===id,id);
 const states=await host.evaluate(()=>[...window.__lc3d.view.machine.deployment.mounts.entries()].map(([id,m])=>[id,m.state,m.group.visible]));for(const [key,st,visible] of states){if(visible)assert.ok(r.requiredMechanisms.includes(key)||key==='CARD_TRAY','unexpected mechanism '+key);}
 if(!fs.existsSync('generated/last-command-campaign/'+type+'.png')){await host.evaluate(()=>window.__lc3d.view.focus('SCREEN'));await host.waitForTimeout(600);await host.screenshot({path:'generated/last-command-campaign/'+type+'.png'});}
 const instruction=r.instruction;const recall=instruction.includes('EARLIER');if(recall)report.memoryRecalls++;
 if(type==='REMEMBER'){
  const match=instruction.match(/REMEMBER THIS (NUMBER|ANIMAL|SYMBOL|COLOR): (.+)/);if(match)stored[match[1]]=match[2];else stored.LIGHTS=r.signals;
  await host.waitForFunction(id=>window.__lc3d.state.lastCommand.testRound.taskId!==id,id);continue;
 }
 if(!forcedWrong&&type==='ENTER_CODE'){
  const target=instruction.split(': ').pop();const wrong=target==='0000'?'1111':'0000';for(let i=0;i<4;i++)for(let j=0;j<Number(wrong[i]);j++)await act(host,'CODE_PANEL','STEP',`${i}:+1`);
  const score=r.step;await press(host,'BIG_BUTTON');await host.waitForFunction(()=>window.__lc3d.state.lastCommand.testRound.feedback==='WRONG COMMAND');assert.equal((await get(host)).testRound.step,score);report.wrong++;forcedWrong=true;
 }else{
  if(type==='ENTER_CODE'){const code=recall?stored.NUMBER:instruction.split(': ').pop();assert.match(code,/^\d{4}$/);for(let i=0;i<4;i++){const current=Number((await get(host)).code[i]),steps=(Number(code[i])-current+10)%10;for(let j=0;j<steps;j++)await act(host,'CODE_PANEL','STEP',`${i}:+1`);}await press(host,'BIG_BUTTON');}
  else if(['ANIMAL','SYMBOL','COLOR'].includes(type)){const value=recall?stored[type]:instruction.split(': ').pop();const mechanism=type==='ANIMAL'?'ANIMAL_PANEL':type==='SYMBOL'?'SYMBOL_PANEL':'LIGHT_MODULE';if(type!=='COLOR'){
    await host.evaluate(id=>window.__lc3d.view.focus(id),mechanism);await host.waitForTimeout(650);
    const point=await host.evaluate(([type,value])=>{const v=window.__lc3d.view,s=type==='ANIMAL'?v.machine.animalCanvas:v.machine.symbolCanvas,index=(type==='ANIMAL'?['CAT','OWL','WOLF','DEER']:['SUN','MOON','STAR','KEY']).indexOf(value);const point=v.camera.position.clone().set((index+.5)*.28/4-.14,0,0);s.mesh.localToWorld(point);point.project(v.camera);const rect=v.renderer.domElement.getBoundingClientRect(),x=rect.x+(point.x+1)*rect.width/2,y=rect.y+(1-point.y)*rect.height/2;return{x,y,hit:v.hit(x,y)};},[type,value]);
    assert.equal(point.hit?.id,mechanism);assert.equal(point.hit?.value,value);await host.mouse.click(point.x,point.y);await host.waitForTimeout(150);report.realCardClicks=true;
    await host.screenshot({path:'generated/last-command-campaign/'+type+'-rear.png'});
   }else await act(host,mechanism,'SET',value);await press(host,'BIG_BUTTON');}
  else if(type==='LEVER'){await act(host,'LEVER_MODULE','SET',instruction.match(/LEVER (UP|DOWN|MIDDLE)/)[1]);await press(host,'BIG_BUTTON');}
  else if(type==='ADJUSTER'){await act(host,'ADJUSTER','SET',instruction.match(/ADJUSTER: (\d+)/)[1]);await press(host,'BIG_BUTTON');}
  else if(type==='HATCH'){if(panel.hatch)await act(host,'HIDDEN_HATCH','SET','CLOSED');await act(host,'HIDDEN_HATCH','SET','OPEN');}
  else if(type==='BUTTON'){const color=instruction.match(/THE (\w+) BUTTON/)[1];await press(host,'SMALL_BUTTON_'+(['RED','GREEN','BLUE','YELLOW'].indexOf(color)+1));}
  else if(type==='LIGHT_SEQUENCE'){await host.waitForFunction(()=>Date.now()+window.__lc3d.view.machine.timeOffset>=window.__lc3d.state.lastCommand.testRound.inputAt);for(const signal of r.signals)await press(host,signal);}
  await host.waitForFunction(()=>{const r=window.__lc3d.state.lastCommand.testRound;return r.feedback==='COMMAND ACCEPTED'||r.status==='WON';});report.correct++;
 }
 if((await get(host)).testRound.status!=='WON')await host.waitForFunction(id=>window.__lc3d.state.lastCommand.testRound.taskId!==id,id);
}
await host.waitForFunction(()=>window.__lc3d.state.lastCommand.testRound.status==='WON');await guest.waitForFunction(()=>document.querySelector('#result').open);assert.equal((await get(host)).testRound.step,20);assert.equal(report.correct,20);assert.equal(report.modelLoads,initialLoads);report.noReloadDuringTasks=true;report.twoClientSynchronization=true;
await host.screenshot({path:'generated/last-command-campaign/result.png'});await host.locator('#again').click();await host.waitForFunction(()=>window.__lc3d.state.lastCommand.testRound.status==='PLAYING'&&window.__lc3d.state.lastCommand.testRound.step===0);report.restart=true;
report.metrics=await host.evaluate(()=>window.__lc3d.view.metrics);report.errors=errors;assert.deepEqual(errors,[]);report.types=[...new Set(report.types)];fs.writeFileSync('generated/last-command-campaign/report.json',JSON.stringify(report,null,2));console.log('CAMPAIGN_OK',JSON.stringify(report));
}finally{for(const c of contexts)await c.close();await browser.close();}})().catch(e=>{console.error(e);process.exit(1)});
