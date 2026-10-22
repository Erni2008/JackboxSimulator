/* Two independent phones -> real existing server -> native libGDX shotgun, never a browser mock. */
const fs=require('fs'),path=require('path'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const dir=path.resolve('lwjgl3/build/cursed-phone-check'),sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function host(command){
  const id=crypto.randomUUID(),file=path.join(dir,'control.json');fs.writeFileSync(file+'.tmp',JSON.stringify({id,command}));fs.renameSync(file+'.tmp',file);
  if(command==='EXIT')return;
  for(let n=0;n<300;n++){try{const report=JSON.parse(fs.readFileSync(path.join(dir,'processed.json')));if(report.id===id)return report;}catch(e){if(e.code!=='ENOENT'&&!(e instanceof SyntaxError))throw e;}await sleep(50);}throw Error('Native host control timeout: '+command);
}
const state=p=>p.evaluate(()=>window.__qaState);
async function wire(p,type,payload,requestId=crypto.randomUUID()){await p.evaluate(message=>window.__qaSocket.send(JSON.stringify(message)),{type,payload,requestId});return requestId;}
async function selected(p,box){await p.locator(`.cursed-box[data-box="${box}"]`).click();await p.waitForFunction(id=>window.__qaState?.cursedBoxes?.selectedCrateId===id&&!document.getElementById('cursed-fire').disabled,box);}
async function revealed(p,box){await p.waitForFunction(id=>window.__qaState?.cursedBoxes?.boxes[id].state==='DESTROYED',box);assert(await p.locator(`.cursed-box[data-box="${box}"]`).isDisabled());}
async function resolved(p){await p.waitForFunction(()=>!window.__qaState?.cursedBoxes?.pendingShot);}
(async()=>{
  let ready;for(let n=0;n<600;n++){try{const candidate=JSON.parse(fs.readFileSync(path.join(dir,'ready.json')));if((await fetch(candidate.url+'/rooms/'+candidate.code)).ok){ready=candidate;break;}}catch{}await sleep(100);}assert(ready,'Native fixture did not start');
  const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||undefined}),clients=[],errors=[];
  try{
    for(const [name,characterId] of [['Phone Ghost','ghost'],['Voodoo Guest','voodoo']]){
      const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:1});const p=await context.newPage();p.on('pageerror',e=>errors.push(e.message));
      await p.addInitScript(()=>{const Native=WebSocket;window.__qaEvents=[];window.__qaSent=[];window.WebSocket=class extends Native{
        constructor(...args){super(...args);window.__qaSocket=this;this.addEventListener('message',event=>{const message=JSON.parse(event.data);window.__qaEvents.push(message);if(message.payload?.roomId)window.__qaState=message.payload;});}
        send(text){window.__qaSent.push(JSON.parse(text));return super.send(text);}
      };});
      await p.goto(ready.url+'/?room='+ready.code);await p.locator('#nickname').fill(name);await p.locator('#character').selectOption(characterId);
      const joined=p.waitForResponse(r=>r.url().endsWith('/join')&&r.request().method()==='POST');await p.locator('#join-button').click();const response=await joined;assert(response.ok(),await response.text());const credentials=await response.json();
      await p.locator('#waiting-screen').waitFor({state:'visible'});clients.push({p,context,credentials});
    }
    const a=clients[0].p,b=clients[1].p;
    await host('START');await a.locator('#cursed-screen').waitFor({state:'visible'});await b.locator('#cursed-screen').waitFor({state:'visible'});
    await a.waitForFunction(()=>window.__qaState?.cursedBoxes?.canAct===true);
    const snapshot=await state(a),session=snapshot.cursedBoxes.sessionId;
    assert.equal(await a.locator('.cursed-box').count(),16);assert.equal(await b.locator('.cursed-box').count(),16);
    assert.equal(await a.locator('#cursed-player-name').textContent(),'Phone Ghost');assert.equal(await b.locator('#cursed-player-name').textContent(),'Voodoo Guest');
    assert(await a.locator('#cursed-fire').isDisabled());assert(await b.locator('#cursed-fire').isDisabled());assert.equal(await b.locator('.cursed-box:enabled').count(),0);
    assert.equal(snapshot.cursedBoxes.shotsRemaining,2);assert.equal(await a.locator('#cursed-shot-counter').textContent(),'SHOT 1 / 2');
    let report=await host('INSPECT');assert(report.nativeReady);assert.equal(report.turnLimit,2);assert.equal(report.developerTest,false);assert.equal(report.models,11);
    const contents=report.state.cursedBoxes.hostContents,ghost=contents.find(c=>c.characterId==='ghost').boxId,voodoo=contents.find(c=>c.characterId==='voodoo').boxId;
    const empty=Array.from({length:16},(_,i)=>i).filter(i=>!contents.some(c=>c.boxId===i));
    for(const viewport of [{width:390,height:844},{width:320,height:568},{width:360,height:640},{width:412,height:915},{width:568,height:320},{width:844,height:390},{width:1280,height:800}]){
      await a.setViewportSize(viewport);await a.evaluate(()=>scrollTo(0,0));
      assert(await a.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Horizontal scrolling at '+JSON.stringify(viewport));
      const bounds=await a.locator('.cursed-box').evaluateAll(nodes=>nodes.map(n=>{const r=n.getBoundingClientRect();return {id:Number(n.dataset.box),x:r.x,y:r.y,w:r.width,h:r.height};}));
      assert.equal(new Set(bounds.slice(0,4).map(b=>Math.round(b.x))).size,4);
      for(let i=0;i<16;i++){assert.equal(bounds[i].id,i);if(i%4)assert(bounds[i].x>bounds[i-1].x);if(i>=4)assert(bounds[i].y>bounds[i-4].y);assert(bounds[i].w>=40&&bounds[i].h>=38,'Touch target too small');}
      const fire=await a.locator('#cursed-fire').boundingBox();assert(fire.y>=0&&fire.y+fire.height<=viewport.height,'FIRE falls outside viewport '+JSON.stringify({viewport,fire}));
      await a.screenshot({path:path.join(dir,`phone-${viewport.width}x${viewport.height}.png`),fullPage:true,animations:'disabled'});
    }
    await a.setViewportSize({width:390,height:844});
    // Forged remote player/phase actions still use the real authenticated session.
    const denied=await wire(b,'CURSED_SELECT',{roomCode:ready.code,sessionId:session,turnId:1,boxId:ghost});
    await b.waitForFunction(id=>window.__qaEvents.some(e=>e.requestId===id&&e.payload?.code==='NOT_YOUR_TURN'),denied);
    await selected(a,(ghost+1)%16);await selected(a,ghost);
    await a.screenshot({path:path.join(dir,'phone-selected.png'),fullPage:true,animations:'disabled'});await b.screenshot({path:path.join(dir,'phone-waiting.png'),fullPage:true,animations:'disabled'});
    assert.equal(await a.locator('.cursed-box.selected').count(),1);assert.equal((await state(a)).cursedBoxes.shotsRemaining,2);
    assert.equal(await a.evaluate(()=>window.__qaSent.filter(m=>m.type==='CURSED_FIRE').length),0,'Selection fired the weapon');
    report=await host('INSPECT');assert.equal(report.selected,ghost,'Phone selected the wrong native compartment');
    await a.reload();await a.locator('#cursed-screen').waitFor({state:'visible'});await a.waitForFunction(()=>!document.getElementById('cursed-fire').disabled);
    assert.equal((await state(a)).selfId,clients[0].credentials.selfId);assert.equal((await state(a)).cursedBoxes.selectedCrateId,ghost);
    // A real rejected action consumes zero cartridges and recovers the UI.
    await a.evaluate(()=>{const original=WebSocket.prototype.send;WebSocket.prototype.send=function(text){const message=JSON.parse(text);if(message.type==='CURSED_FIRE'){WebSocket.prototype.send=original;message.payload.boxId=99;return original.call(this,JSON.stringify(message));}return original.call(this,text);};});
    await a.locator('#cursed-fire').click();await a.waitForFunction(()=>document.getElementById('cursed-status').textContent.includes('sixteen boxes'));
    assert.equal((await state(a)).cursedBoxes.shotsRemaining,2);assert(await a.locator('#cursed-fire').isEnabled());
    const before=await a.evaluate(()=>window.__qaSent.filter(m=>m.type==='CURSED_FIRE').length);
    await a.evaluate(()=>{const button=document.getElementById('cursed-fire');for(let i=0;i<12;i++){button.click();button.dispatchEvent(new MouseEvent('click',{bubbles:true}));}});
    await a.waitForFunction(()=>window.__qaState.cursedBoxes.pendingShot?.playerId===window.__qaState.selfId);
    assert.equal(await a.evaluate(()=>window.__qaSent.filter(m=>m.type==='CURSED_FIRE').length),before+1,'Rapid taps created duplicate UI requests');
    const accepted=await a.evaluate(()=>window.__qaSent.filter(m=>m.type==='CURSED_FIRE').at(-1));
    await wire(a,'CURSED_FIRE',accepted.payload,accepted.requestId);const duplicate=await wire(a,'CURSED_FIRE',accepted.payload);
    await a.waitForFunction(id=>window.__qaEvents.some(e=>e.requestId===id&&e.payload?.code==='SHOT_IN_PROGRESS'),duplicate);
    assert.equal((await state(a)).cursedBoxes.shotsRemaining,1);
    await clients[0].context.setOffline(true);await revealed(b,ghost);await sleep(1200);await clients[0].context.setOffline(false);await a.reload();await a.locator('#cursed-screen').waitFor({state:'visible'});await resolved(a);
    assert.equal((await state(a)).selfId,clients[0].credentials.selfId);assert.equal((await state(a)).players.length,2);assert.equal((await state(a)).cursedBoxes.shotsRemaining,1);
    assert.equal(await a.locator('#cursed-shot-counter').textContent(),'SHOT 2 / 2');assert.equal(await a.locator('#cursed-result-title').textContent(),'CHARACTER FOUND!');assert((await a.locator('#cursed-result-detail').textContent()).includes('Phone Ghost'));
    await a.setViewportSize({width:320,height:568});await a.evaluate(()=>scrollTo(0,0));assert(await a.evaluate(()=>document.documentElement.scrollHeight<=innerHeight+2),'Small portrait result causes unnecessary scrolling');await a.screenshot({path:path.join(dir,'phone-320-result.png'),fullPage:true,animations:'disabled'});await a.setViewportSize({width:390,height:844});
    await selected(a,empty[0]);await a.locator('#cursed-fire').click();await revealed(b,empty[0]);await resolved(a);
    await b.waitForFunction(()=>window.__qaState.cursedBoxes.canAct);assert.equal((await state(a)).cursedBoxes.shotsRemaining,0);assert.equal(await a.locator('#cursed-shot-counter').textContent(),'NO SHOTS REMAINING');assert(await a.locator('#cursed-fire').isDisabled());
    assert.equal(await a.locator('#cursed-result-title').textContent(),'EMPTY BOX');assert.equal((await state(b)).cursedBoxes.shotsRemaining,2);
    await host('RECONNECT_HOST');await b.waitForFunction(()=>!window.__qaState.cursedBoxes.hostReady);await b.waitForFunction(()=>window.__qaState.cursedBoxes.canAct,{},{timeout:30000});
    report=await host('INSPECT');assert.equal(report.slots[ghost].state,'DESTROYED');assert.equal(report.slots[ghost].pose,'REVEALED');assert.equal(report.slots[ghost].nickname,'Phone Ghost');assert.equal((await state(b)).cursedBoxes.shotsRemaining,2);
    await selected(b,voodoo);await b.locator('#cursed-fire').click();await revealed(a,voodoo);await resolved(b);assert.equal(await b.locator('#cursed-result-title').textContent(),'CHARACTER FOUND!');assert((await b.locator('#cursed-result-detail').textContent()).includes('Voodoo Guest'));
    await selected(b,empty[1]);await b.locator('#cursed-fire').click();await revealed(a,empty[1]);await b.waitForFunction(()=>window.__qaState.cursedBoxes.phase==='FINISHED');
    await sleep(6500);report=await host('INSPECT');assert.equal(report.gun,'RESTING');assert.equal(report.turnLimit,2);assert.equal(report.slots.filter(b=>b.state==='DESTROYED').length,4);assert.equal(report.slots.filter(b=>b.state==='INTACT').length,12);
    for(const id of [ghost,voodoo]){assert.equal(report.slots[id].pose,'REVEALED');assert(report.reactionMask&(1<<id),'Real native reaction was not observed');}
    for(const id of [ghost,voodoo,...empty.slice(0,2)])assert(report.impactMask&(1<<id),'Real native debris/impact missing for box '+id);
    assert.equal((await state(b)).cursedBoxes.shotsRemaining,0);assert.equal((await state(a)).cursedBoxes.destroyedCrateIds,(await state(b)).cursedBoxes.destroyedCrateIds);
    const third=await wire(b,'CURSED_FIRE',{...accepted.payload,boxId:empty[2],turnId:2,shotNumber:2});await b.waitForFunction(id=>window.__qaEvents.some(e=>e.requestId===id&&e.payload?.code==='CURSED_FINISHED'),third);assert.equal((await state(b)).cursedBoxes.shotsRemaining,0);
    for(const client of clients){
      assert(await client.p.evaluate(()=>window.__qaEvents.filter(e=>e.payload?.cursedBoxes).every(e=>!('hostContents' in e.payload.cursedBoxes)&&e.payload.cursedBoxes.boxes.every(b=>b.state==='DESTROYED'||!('characterId' in b||'nickname' in b||'empty' in b)))),'Private content leaked');
      assert((await state(client.p)).players.every(p=>p.score===0),'Cursed Boxes changed scoring');
    }
    for(const asset of ['crate-intact.png','crate-destroyed.png'])assert.equal((await a.request.get(ready.url+'/art/cursed_boxes/phone/'+asset)).status(),200);
    assert.equal((await a.request.get(ready.url+'/art/cursed_boxes/characters/voddoo_shoot.png')).status(),404);
    await a.screenshot({path:path.join(dir,'phone-finished.png'),fullPage:true,animations:'disabled'});await host('CAPTURE');
    await host('END');await Promise.all(clients.map(c=>c.p.locator('#waiting-screen').waitFor({state:'visible'})));
    await host('CAPTURE_LOBBY');
    // Second real round deliberately misses both players. Only server-owned survivors may open.
    await host('START');await a.waitForFunction(()=>window.__qaState?.cursedBoxes?.canAct===true);
    report=await host('INSPECT');const survivors=report.state.cursedBoxes.hostContents;
    const misses=Array.from({length:16},(_,i)=>i).filter(i=>!survivors.some(p=>p.boxId===i));
    for(let i=0;i<4;i++){const phone=i<2?a:b;await phone.waitForFunction(()=>window.__qaState.cursedBoxes.canAct);await selected(phone,misses[i]);await phone.locator('#cursed-fire').click();await revealed(a,misses[i]);await resolved(phone);}
    await a.waitForFunction(()=>window.__qaState.cursedBoxes.phase==='REVEALING');
    let reveal=await state(a);assert.equal(reveal.cursedBoxes.survivorCount,2);assert.equal(reveal.cursedBoxes.survivors.length,0);
    assert.equal(await a.locator('.cursed-box:enabled').count(),0);assert(await b.locator('#cursed-fire').isDisabled());
    await a.waitForFunction(()=>window.__qaState.cursedBoxes.survivors.length>=1);
    await host('RECONNECT_HOST');
    await a.waitForFunction(()=>window.__qaState.cursedBoxes.phase==='FINISHED');await sleep(800);
    report=await host('INSPECT');assert.equal(report.survivorState,'COMPLETED');assert.equal(report.slots.filter(b=>b.survivorOpening).length,2);
    for(const person of survivors){assert(report.survivorMask&(1<<person.boxId));assert.equal(report.slots[person.boxId].state,'INTACT');assert.equal(report.slots[person.boxId].panelOpacity,0);}
    assert.equal(report.slots.filter(b=>b.state==='DESTROYED').length,4);
    assert.equal((await state(a)).cursedBoxes.survivors.length,2);assert.equal((await state(b)).cursedBoxes.survivors.length,2);
    assert.equal(await a.locator('#cursed-result-title').textContent(),'YOU SURVIVED');assert.equal(await b.locator('#cursed-result-title').textContent(),'YOU SURVIVED');
    assert((await state(a)).players.every(p=>p.score===0),'Reveal changed scoring');
    await host('CAPTURE');await host('END');await Promise.all(clients.map(c=>c.p.locator('#waiting-screen').waitFor({state:'visible'})));
    await host('START_QUESTIONS');await a.locator('#question-screen').waitFor({state:'visible',timeout:30000});await b.locator('#question-screen').waitFor({state:'visible',timeout:30000});
    assert.equal((await state(a)).cursedBoxes,undefined);assert.equal((await state(a)).gameId,(await state(b)).gameId);assert.equal(await a.locator('#answers button').count(),4);
    assert.deepEqual(errors,[]);await host('EXIT');
    for(let n=0;n<200&&!fs.existsSync(path.join(dir,'cleanup.json'));n++)await sleep(50);
    assert(JSON.parse(fs.readFileSync(path.join(dir,'cleanup.json'))).portReleased);
    console.log('PASS: two authenticated mobile browsers -> real native shots, 16 row-major boxes, seven viewports, selection/confirmation, rejected/duplicate/third shots, shared destruction, redaction, phone + host reconnect, persistent Ghost/Voodoo, 2-shot isolation, unchanged scores, server-timed two-survivor reveal with host reconnect and synchronized phone results, and return to existing question UI');
  }finally{try{await host('EXIT');}catch{}await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
