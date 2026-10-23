process.chdir(require('node:path').resolve(__dirname, '../..'));
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const context=vm.createContext({setTimeout,clearTimeout});vm.runInContext(fs.readFileSync('web/connection-health.js','utf8'),context);
const jobs=[],expired=[],cancelled=[];
const watch=context.createResponseWatchdog({onTimeout:id=>expired.push(id),schedule:(run,delay)=>{jobs.push({run,delay});return jobs.length-1;},cancel:id=>cancelled.push(id)});
watch.arm('first');assert(watch.pending());assert.equal(jobs[0].delay,8000);
assert.equal(watch.acknowledge('unrelated'),false);assert(watch.pending());
assert.equal(watch.acknowledge('first'),true);assert(!watch.pending());jobs[0].run();assert.deepEqual(expired,[]);
watch.arm('old');watch.arm('new');jobs[1].run();assert.deepEqual(expired,[]);jobs[2].run();assert.deepEqual(expired,['new']);assert(!watch.pending());
watch.arm('paused');watch.clear();jobs[3].run();assert.deepEqual(expired,['new']);
watch.arm('disconnected');watch.clear();watch.arm('restored');jobs[4].run();assert(watch.pending());watch.acknowledge('restored');jobs[5].run();assert(!watch.pending());
assert(cancelled.includes(0),'Timer ID zero must be cancellable');
console.log('PASS: missing reply, matching ACK, unrelated replies, stale deadlines, pause/clear, new socket generation and timer ID zero');
if(!process.env.CONTROLLER_URL)process.exit(0);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||undefined});
 try{
  const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(process.env.CONTROLLER_URL);
  await page.evaluate(()=>{
   document.getElementById('cursed-grid').replaceChildren();
   const s={selfId:'self',players:[{id:'self',nickname:'HIDER',characterId:'ghost'}],cursedBoxes:{sessionId:'first',turnId:1,role:'HIDING',phase:'HIDING_SELECTION',hostReady:true,canHide:true,hidingBoxId:-1,boxes:Array.from({length:16},(_,id)=>({id,state:'AVAILABLE'}))}};
   const sent=[];window.draftQA={s,sent};window.draftController=createCursedBoxesController({getState:()=>s,isAuthenticated:()=>true,send:(...args)=>sent.push(args),makeId:()=>'',explain:()=>''});draftController.render();
   document.querySelector('.cursed-box[data-box="7"]').click();
   if(sent.length)throw Error('Private draft sent before confirmation');
   draftController.suspend();draftController.render();
   if(!document.querySelector('.cursed-box[data-box="7"]').classList.contains('selected'))throw Error('Draft lost on suspend');
   s.cursedBoxes.hidingConfirmed=true;s.cursedBoxes.canHide=false;s.cursedBoxes.hidingBoxId=3;draftController.render();
   if(!document.querySelector('.cursed-box[data-box="3"]').classList.contains('selected')||document.querySelector('.cursed-box[data-box="7"]').classList.contains('selected'))throw Error('Server confirmation did not override draft');
   s.cursedBoxes={...s.cursedBoxes,sessionId:'second',hidingConfirmed:false,canHide:true,hidingBoxId:-1};draftController.render();
   if(document.querySelector('.cursed-box.selected'))throw Error('Draft crossed sessions');
   document.querySelector('.cursed-box[data-box="9"]').click();draftController.reset();draftController.render();if(document.querySelector('.cursed-box.selected'))throw Error('Reset retained private draft');
  });
  assert.deepEqual(errors,[]);
  console.log('PASS: private hiding draft survives interruption, sends no network command, yields to server state and clears on reset/new session');
  const ready=JSON.parse(fs.readFileSync('server/build/impostor-browser/ready.json','utf8'));
  assert.equal(process.env.CONTROLLER_URL,ready.url,'Use the isolated Impostor fixture for the real reconnect test');
  const live=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});live.on('pageerror',e=>errors.push(e.message));
  live.setDefaultTimeout(20000);await live.goto(ready.url);
  await live.locator('#room-code').fill(ready.code);await live.locator('#nickname').fill('Recovery QA');await live.locator('#join-button').click();await live.locator('#waiting-screen').waitFor({state:'visible'});
  const self=await live.evaluate(()=>state.selfId);
  await live.evaluate(()=>{
   const original=WebSocket.prototype.send,types=[];
   WebSocket.prototype.send=function(data){types.push(JSON.parse(data).type);return original.call(this,data);};
   try{
    Object.defineProperty(document,'hidden',{value:true,configurable:true});document.dispatchEvent(new Event('visibilitychange'));
    ping();if(heartbeatWatch.pending()||!types.includes('PING'))throw Error('Background keepalive or watchdog suspension failed');
    delete document.hidden;document.dispatchEvent(new Event('visibilitychange'));
    if(!heartbeatWatch.pending()||!types.includes('SYNC'))throw Error('Visible tab did not resynchronize');
   }finally{delete document.hidden;WebSocket.prototype.send=original;}
  });

  await live.evaluate(()=>{
   window.realSocketSend=WebSocket.prototype.send;
   WebSocket.prototype.send=function(data){if(JSON.parse(data).type==='PING')return;return realSocketSend.call(this,data);};
   ping();
  });
  await live.waitForFunction(()=>document.body.dataset.view==='disconnected');
  fs.mkdirSync('generated/controller-polish',{recursive:true});await live.screenshot({path:'generated/controller-polish/reconnecting-390.png',fullPage:true});
  await live.evaluate(()=>{WebSocket.prototype.send=realSocketSend;});
  await live.locator('#waiting-screen').waitFor({state:'visible'});assert.equal(await live.evaluate(()=>state.selfId),self,'Reconnect changed the player identity');
  const leaving=live.waitForResponse(r=>r.url().endsWith('/leave')&&r.request().method()==='POST');
  await live.locator('#leave').click();await leaving;await live.locator('#join-screen').waitFor({state:'visible'});
  assert.equal(await live.evaluate(()=>sessionStorage.getItem('finalanswer-session')),null);assert.equal(await live.evaluate(()=>heartbeatWatch.pending()),false);
  assert.deepEqual(errors,[]);
  console.log('PASS: real authenticated socket missing PING reply reconnects to the same seat; explicit leave clears session and deadline');

 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
