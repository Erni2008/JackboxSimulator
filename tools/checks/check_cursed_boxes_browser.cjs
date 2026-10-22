process.chdir(require('node:path').resolve(__dirname, '../..'));
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
    async function begin(box){
      await host('START');await a.locator('#cursed-screen').waitFor({state:'visible'});await b.locator('#cursed-screen').waitFor({state:'visible'});
      await a.waitForFunction(()=>window.__qaState?.cursedBoxes?.canHide);
      assert.equal((await state(a)).cursedBoxes.role,'HIDING');assert.equal((await state(b)).cursedBoxes.role,'SHOOTING');
      assert.equal(await a.locator('.cursed-box:enabled').count(),16);assert.equal(await b.locator('.cursed-box:enabled').count(),0);
      assert.equal((await host('INSPECT')).state.cursedBoxes.hostContents.length,0);
      await a.locator(`.cursed-box[data-box="${box}"]`).click();assert(await a.locator('#cursed-fire').isEnabled());
      assert.equal((await state(a)).cursedBoxes.hidingConfirmed,false);
      assert.equal((await host('INSPECT')).state.cursedBoxes.hostContents.length,0,'Draft choice escaped confirmation');
      await a.locator('#cursed-fire').click();await b.waitForFunction(()=>window.__qaState?.cursedBoxes?.canAct);await a.waitForFunction(()=>window.__qaState?.cursedBoxes?.hidingConfirmed);
      assert.equal((await state(a)).cursedBoxes.hidingBoxId,box);assert.equal((await state(b)).cursedBoxes.hidingBoxId,undefined);
      assert.equal((await state(b)).cursedBoxes.hostContents,undefined);
      assert((await state(b)).cursedBoxes.boxes.every(b=>b.characterId===undefined&&b.empty===undefined));
      const report=await host('INSPECT');assert.equal(report.state.cursedBoxes.hostContents[0].boxId,box);
      assert.equal(report.slots[box].characterId,'ghost');assert.equal(report.slots[box].pose,'HIDDEN');
      assert.equal(report.turnLimit,2);assert.equal(report.developerTest,false);assert.equal(report.models,11);
      return (await state(b)).cursedBoxes.sessionId;
    }
    await begin(15);
    for(const viewport of [{width:390,height:844},{width:320,height:568},{width:568,height:320},{width:844,height:390}]){
      await a.setViewportSize(viewport);assert(await a.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
      await a.screenshot({path:path.join(dir,`hiding-${viewport.width}x${viewport.height}.png`),fullPage:true});
    }
    await a.setViewportSize({width:390,height:844});await a.reload();await a.locator('#cursed-screen').waitFor({state:'visible'});
    assert.equal((await state(a)).cursedBoxes.hidingBoxId,15);assert(await a.locator('#cursed-fire').isDisabled());
    await host('RECONNECT_HOST');await b.waitForFunction(()=>window.__qaState.cursedBoxes.hostReady&&window.__qaState.cursedBoxes.canAct);
    assert.equal((await host('INSPECT')).slots[15].characterId,'ghost');
    async function shoot(box){
      await selected(b,box);await b.locator('#cursed-fire').click();await revealed(a,box);await resolved(b);
    }
    await shoot(0);assert.equal((await state(b)).cursedBoxes.phase,'SELECTING');assert.equal((await state(b)).cursedBoxes.survivors,undefined);
    await shoot(1);await a.waitForFunction(()=>window.__qaState.cursedBoxes.phase==='FINISHED');
    let report=await host('INSPECT');
    for(let n=0;n<80&&report.survivorState!=='COMPLETED';n++){await sleep(100);report=await host('INSPECT');}
    assert.equal(report.survivorMask,1<<15);assert.equal(report.slots[15].panelOpacity,0);assert.equal(report.slots[15].state,'INTACT');
    assert.equal(report.soundShots,2);assert.equal(report.soundWood,2);assert.equal(report.soundInsertion,0);assert.equal(report.soundHeartbeat,false);
    assert.equal(report.state.cursedBoxes.destroyedCrateIds,3);assert.equal((await state(a)).cursedBoxes.outcomes[0].survived,true);
    await a.screenshot({path:path.join(dir,'hider-survived.png'),fullPage:true});
    const capture=path.join(dir,'native-final.png'),beforeCapture=fs.existsSync(capture)?fs.statSync(capture).mtimeMs:0;
    await host('CAPTURE');let completeCapture=false;
    for(let n=0;n<100;n++){
      await sleep(50);if(!fs.existsSync(capture))continue;const pixels=fs.readFileSync(capture);
      if(fs.statSync(capture).mtimeMs>beforeCapture&&pixels.length>12&&pixels.subarray(-8,-4).toString()==='IEND'){
        fs.writeFileSync(path.join(dir,'native-hider-survived.png'),pixels);completeCapture=true;break;
      }
    }
    assert(completeCapture,'Native capture did not finish');
    await host('END');await a.locator('#waiting-screen').waitFor({state:'visible'});
    await begin(9);await shoot(9);await shoot(0);await a.waitForFunction(()=>window.__qaState.cursedBoxes.phase==='FINISHED');
    report=await host('INSPECT');assert.equal(report.state.cursedBoxes.survivorCount,0);assert.equal(report.state.cursedBoxes.survivors.length,0);
    assert.equal(report.state.cursedBoxes.outcomes[0].survived,false);assert.equal(report.slots[9].state,'DESTROYED');assert.notEqual(report.slots[9].pose,'HIDDEN');
    assert.equal(report.slots[15].characterId,undefined,'Previous round character survived reset');
    assert.equal(report.soundShots,2);assert.equal(report.soundWood,2);assert.equal(report.soundHeartbeat,false);assert(report.renderChecks>60);
    await a.screenshot({path:path.join(dir,'hider-eliminated.png'),fullPage:true});assert.deepEqual(errors,[]);
    fs.writeFileSync(path.join(dir,'hiding-report.json'),JSON.stringify({passed:true,rounds:2,boxCount:16,shotsPerShooter:2,renderChecks:report.renderChecks,errors},null,2));
    await host('EXIT');console.log('PASS: real phones + native renderer, secret hiding, reconnect, two shots, survival and elimination.');
  }finally{await host('EXIT');for(const client of clients)await client.context.close();await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
