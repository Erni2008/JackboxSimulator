const assert=require('node:assert/strict'),fs=require('node:fs');const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
(async()=>{const b=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||undefined});try{
 const p=await b.newPage({viewport:{width:1440,height:1000}});p.setDefaultTimeout(30000);const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.addInitScript(()=>localStorage.setItem('finalanswer.lastcommand.preferences.v1',JSON.stringify({quality:'MEDIUM',sound:false})));
 await p.goto((process.env.LC_URL||'http://localhost:8080')+'/last-command-3d/?autostart=1&showcase=1');
 await p.waitForFunction(()=>window.__lc3d?.view?.machine?.loaded&&!window.__lc3d.state.lastCommand.testRound.paused&&document.querySelector('#showcase-task'),null,{timeout:120000});
 const act=async(element,action,value='')=>{await p.evaluate(([e,a,v])=>window.__lc3d.action(e,a,v),[element,action,value]);await p.waitForTimeout(120);};
 for(const family of ['LEVER','ADJUSTER']){
  await p.locator('#showcase-task').selectOption(family);await p.waitForFunction(f=>{const r=window.__lc3d.state.lastCommand.testRound;return r.taskType===f&&Date.now()+window.__lc3d.view.machine.timeOffset>=r.readyAt;},family);
  await p.waitForFunction(()=>!window.__lc3d.view.machine.moving());
  const element=family==='LEVER'?'LEVER_MODULE':'ADJUSTER';const instruction=await p.evaluate(()=>window.__lc3d.state.lastCommand.testRound.instruction);
  // Use the actual client interaction path, then inspect authoritative score/task.
  const id=await p.evaluate(()=>window.__lc3d.state.lastCommand.testRound.taskId);
  for(let i=0;i<4;i++){await p.evaluate(element=>window.__lc3d.view.machine.interact({id:element,value:'+1'}),element);await p.waitForTimeout(150);assert.equal(await p.evaluate(()=>window.__lc3d.state.lastCommand.testRound.step),0);assert.equal(await p.evaluate(()=>window.__lc3d.state.lastCommand.testRound.taskId),id);}
  const target=family==='ADJUSTER'?instruction.match(/\b(0|45|90|135)\s*°/)[1]:instruction.includes('ВНИЗ')?'DOWN':instruction.includes('ЦЕНТР')?'MIDDLE':'UP';
  const wrong=family==='ADJUSTER'?String((Number(target)+45)%180):target==='UP'?'DOWN':'UP';await act(element,'SET',wrong);await act('BIG_BUTTON','PRESS');await p.waitForFunction(()=>window.__lc3d.state.lastCommand.testRound.mistakes===1);assert.equal(await p.evaluate(()=>window.__lc3d.state.lastCommand.testRound.step),0);
  await p.locator('#showcase-variant').click();await p.waitForFunction(id=>{const r=window.__lc3d.state.lastCommand.testRound;return r.taskId!==id&&!r.nextAt&&Date.now()+window.__lc3d.view.machine.timeOffset>=r.readyAt;},id);
  const text=await p.evaluate(()=>window.__lc3d.state.lastCommand.testRound.instruction);const answer=family==='ADJUSTER'?text.match(/\b(0|45|90|135)\s*°/)[1]:text.includes('ВНИЗ')?'DOWN':text.includes('ЦЕНТР')?'MIDDLE':'UP';await act(element,'SET',answer);assert.equal(await p.evaluate(()=>window.__lc3d.state.lastCommand.testRound.step),0);await act('BIG_BUTTON','PRESS');await p.waitForFunction(()=>window.__lc3d.state.lastCommand.testRound.step===1);
 }
 await p.locator('#showcase-task').selectOption('LEVER');await p.waitForFunction(()=>window.__lc3d.state.lastCommand.testRound.taskType==='LEVER');await p.evaluate(()=>window.__lc3d.view.resetCamera());await p.waitForFunction(()=>!window.__lc3d.view.machine.moving());
 fs.mkdirSync('generated/last-command-industrial',{recursive:true});await p.screenshot({path:'generated/last-command-industrial/overview.png'});await p.evaluate(()=>window.__lc3d.view.focus('SCREEN'));await p.waitForFunction(()=>!window.__lc3d.view.fly);await p.screenshot({path:'generated/last-command-industrial/confirmation.png'});assert.deepEqual(errors,[]);console.log('CONFIRMATION_OK: actual lever/dial interactions never score; wrong confirmation rejected; correct setting plus confirmation scores');
 }finally{await b.close();}})().catch(e=>{console.error(e);process.exit(1)});
