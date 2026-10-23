process.chdir(require('node:path').resolve(__dirname, '../..'));
/* Two independent phones -> real existing server -> native libGDX shotgun, never a browser mock. */
const fs=require('fs'),path=require('path'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const dir=path.resolve('lwjgl3/build/cursed-full-round'),sleep=ms=>new Promise(r=>setTimeout(r,ms));
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
    const roster=[['Hiding Ghost','ghost'],['Hiding Puppeteer','puppeteer'],['Shooter Dracula','dracula'],['Shooter Voodoo','voodoo']];
    if(process.env.REVIEW_FROM_QUESTION==='1')for(const player of roster)player[0]=player[1].charAt(0).toUpperCase()+player[1].slice(1);
    for(const [name,characterId] of roster){
      const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:1});const p=await context.newPage();p.setDefaultTimeout(180000);p.on('pageerror',e=>errors.push(e.message));
      await p.addInitScript(()=>{const Native=WebSocket;window.__qaEvents=[];window.__qaSent=[];window.WebSocket=class extends Native{
        constructor(...args){super(...args);window.__qaSocket=this;this.addEventListener('message',event=>{const message=JSON.parse(event.data);window.__qaEvents.push(message);if(message.payload?.roomId)window.__qaState=message.payload;});}
        send(text){window.__qaSent.push(JSON.parse(text));return super.send(text);}
      };});
      await p.goto(ready.url+'/?room='+ready.code);await p.locator('#nickname').fill(name);await p.locator('#character').selectOption(characterId);
      const joined=p.waitForResponse(r=>r.url().endsWith('/join')&&r.request().method()==='POST');await p.locator('#join-button').click();const response=await joined;assert(response.ok(),await response.text());const credentials=await response.json();
      await p.locator('#waiting-screen').waitFor({state:'visible'});clients.push({p,context,credentials});
    }

    const [ghost,puppet,shooter1,shooter2]=clients.map(c=>c.p);
    async function prepareManualReview(mode){
      const review={url:ready.url,code:ready.code,mode,players:clients.map((c,i)=>({code:ready.code,token:c.credentials.token,name:roster[i][0]}))};
      for(const c of clients)await c.context.close();
      fs.writeFileSync(path.join(dir,'player-review.json'),JSON.stringify(review),{mode:0o600});
      console.log('READY: manual player review from '+mode+'. No automated answers, selections or shots.');
    }
    if(process.env.REVIEW_FROM_QUESTION==='1'){await prepareManualReview('question');return;}
    const lobbyAudio=await host('UI_AUDIO_CHECK');assert.equal(lobbyAudio.applicationAudioLoaded,6);
    await host('AMBIENCE_SEEK_END');await sleep(1100);const loop=await host('INSPECT');assert(loop.ambiencePlaying&&loop.ambiencePosition<3,'Real Music loops across MP3 boundary');
    await host('START_QUESTIONS');
    for(const c of clients)await c.p.waitForFunction(()=>window.__qaState?.phase==='ANSWERING');
    assert.equal((await state(ghost)).questionNumber,1);
    const questionAudio=await host('INSPECT');assert.equal(questionAudio.questionAudioLoaded,4);assert.equal(questionAudio.questionTicking,true,'Ticking starts with actual server countdown');assert.equal(questionAudio.questionLockCount,0,'No lock before answer deadline');
    // The existing first trivia question has correct answer 1. Submit through the real phone buttons.
    for(let i=0;i<4;i++)await clients[i].p.locator(`#answers button[data-index="${i<2?0:1}"]`).click();
    await ghost.waitForFunction(()=>window.__qaState?.cursedBoxes?.canHide);
    await puppet.waitForFunction(()=>window.__qaState?.cursedBoxes?.canHide);
    for(const p of [ghost,puppet])assert.equal((await state(p)).cursedBoxes.role,'HIDING');
    for(const p of [shooter1,shooter2]){const s=(await state(p)).cursedBoxes;assert.equal(s.role,'SHOOTING');assert.equal(s.shotLimit,1);assert.equal(s.shotsRemaining,1);assert.equal(s.canAct,false);}
    if(process.env.REVIEW_PLAYERS==='1'){
      await prepareManualReview('hiding');
      return;
    }
    async function hide(p,box){
      await p.locator(`.cursed-box[data-box="${box}"]`).click();
      if(process.env.CURSED_RECONNECT_QA==='1'&&p===ghost){
        const identity=(await state(p)).selfId;
        await p.evaluate(()=>window.__qaSocket.close());await p.locator('#disconnected-screen').waitFor({state:'visible'});
        await p.locator('#retry').click();await p.locator('#cursed-screen').waitFor({state:'visible'});
        assert.equal((await state(p)).selfId,identity,'Recovery changed the hiding player');
        assert.equal((await state(p)).cursedBoxes.hidingConfirmed,false,'Recovery confirmed an unsent hiding choice');
        assert.equal(await p.locator(`.cursed-box[data-box="${box}"]`).getAttribute('aria-pressed'),'true','Manual reconnect lost private hiding draft');
      }
      await p.locator('#cursed-fire').click();await p.waitForFunction(()=>window.__qaState.cursedBoxes.hidingConfirmed);
    }
    await hide(ghost,5);
    assert.equal((await state(shooter1)).cursedBoxes.canAct,false,'Shot unlocked before all hiders confirmed');
    await hide(puppet,10);await shooter1.waitForFunction(()=>window.__qaState.cursedBoxes.canAct);
    for(const p of [shooter1,shooter2]){const s=(await state(p)).cursedBoxes;assert.equal(s.hidingBoxId,undefined);assert.equal(s.hostContents,undefined);assert(s.boxes.every(b=>b.characterId===undefined));}
    let report=await host('INSPECT');assert.equal(report.questionTicking,false,'No timer audio after questions');assert.equal(report.questionLockCount,1,'Exactly one authoritative answer-lock cue');assert.equal(report.state.cursedBoxes.hostContents.length,2);assert.equal(report.turnLimit,1);
    const stages=[],duplicateTargets=process.env.CURSED_DUPLICATE_TARGET_QA==='1',expectedShots=duplicateTargets?1:2;
    await selected(shooter1,5);await shooter1.locator('#cursed-fire').click();
    await shooter1.waitForFunction(()=>window.__qaState.cursedBoxes.targetConfirmed);
    assert.equal((await state(shooter2)).cursedBoxes.selectedCrateId,-1);
    assert.equal((await state(shooter2)).cursedBoxes.boxes[5].state,'AVAILABLE','Other selection must not mark the box');
    assert.equal((await host('INSPECT')).state.cursedBoxes.pendingShot,undefined,'No firing before all targets lock');
    await selected(shooter2,duplicateTargets?5:0);await shooter2.locator('#cursed-fire').click();
    let current=null;
    for(let n=0;n<900;n++){
      const r=await host('INSPECT'),job=r.state.cursedBoxes.pendingShot;
      if(job&&job.id!==current?.id){if(current)stages.push(current);current={id:job.id,box:job.boxId,flash:false,reload:false};}
      if(current){current.flash||=r.flash>0;current.reload||=r.mechanism==='PUMP';}
      if(['ELIMINATION','REVEALING','FINISHED'].includes(r.state.cursedBoxes.phase)){if(current)stages.push(current);break;}
      await sleep(30);
    }
    assert.equal(stages.length,expectedShots);for(const stage of stages){assert(stage.reload,'Pump/ejection cycle did not run');}
    assert.equal((await state(shooter1)).cursedBoxes.shotsRemaining,0);assert.equal((await state(shooter2)).cursedBoxes.shotsRemaining,0);
    const death=await host('INSPECT');assert.equal(death.ghostMask,1<<5,'Only the authoritative eliminated player transforms');
    assert.equal(death.state.cursedBoxes.phase,'ELIMINATION','All shots finish before collective death');
    assert.equal(death.survivorState,'WAITING','Living survivor reveal must wait for the death stage');
    await puppet.waitForFunction(()=>window.__qaState.cursedBoxes.phase==='FINISHED');
    for(let n=0;n<100;n++){report=await host('INSPECT');if(report.survivorState==='COMPLETED'&&!report.soundHeartbeat)break;await sleep(100);}
    const s=report.state.cursedBoxes;
    assert.equal(s.survivorCount,1);assert.equal(report.survivorMask,1<<10);assert.equal(report.slots[10].panelOpacity,0);
    assert.equal(s.outcomes.find(p=>p.playerId===clients[0].credentials.selfId).survived,false);
    assert.equal(s.outcomes.find(p=>p.playerId===clients[1].credentials.selfId).survived,true);
    assert.equal(s.destroyedCrateIds,(1<<5)|(duplicateTargets?0:1));assert.equal(report.slots[5].state,'DESTROYED');assert.notEqual(report.slots[5].pose,'HIDDEN');
    assert.equal(report.slots[10].characterId,'puppeteer');assert.equal(report.slots[10].state,'INTACT');
    for(const cue of ['SHOT','WOOD_BREAK','SHELL_DROP'])assert.equal(report.soundCues[cue],expectedShots,`Wrong audio count: ${cue}`);
    assert.equal(report.soundCues.INSERT_ROUND,5,'Exactly five initial shells; no per-player insertion');assert.equal(report.loadedRounds,5-expectedShots,'Two shots consume two of five loaded shells');
    assert(report.applicationAudioCues.GATE>=4);assert(report.applicationAudioCues.CHAIN_1>0&&report.applicationAudioCues.CHAIN_2>0);assert.equal(report.applicationAudioCues.HOVER,1);assert.equal(report.applicationAudioCues.PRESS,1);assert(report.ambiencePlaying);
    assert.equal(report.soundCues.WOOD_EXTRA,expectedShots,'Existing and additional wood layers each fire twice');
    assert.equal(['APPEARANCE_1','APPEARANCE_2','APPEARANCE_3','APPEARANCE_4'].reduce((n,c)=>n+report.soundCues[c],0),1,'One appearance variation per survivor');
    assert.equal(report.soundCues.APPEARANCE_2,1,'Survivor must use appearance2');assert.equal(report.soundCues.REVEAL_COMPLETE,0,'Legacy final reveal must not mask appearance2');
    assert.equal(report.soundCues.HORROR_1,0);assert.equal(report.soundCues.HORROR_2,1,'One collective ghost transformation accent');
    assert.equal(report.eliminationState,'COMPLETED');assert.equal(report.ghostMask,1<<5);assert.equal(s.ghosts.length,1);assert.equal(s.ghosts[0].lifeState,'GHOST');assert.equal(s.ghosts[0].canReturn,true);
    for(const cue of ['MECHANISM','HEARTBEAT','REVEAL_START'])assert(report.soundCues[cue]>0,`Missing sound: ${cue}`);
    assert.equal(report.soundHeartbeat,false);assert(report.flashFrames>0);assert(report.reloadFrames>0);assert.deepEqual(errors,[]);
    await host('CAPTURE');await sleep(500);
    for(let i=0;i<4;i++)await clients[i].p.screenshot({path:path.join(dir,`phone-${i+1}-result.png`),fullPage:true});
    fs.writeFileSync(path.join(dir,'full-round-report.json'),JSON.stringify({passed:true,scenario:duplicateTargets?'real trivia: two private matching targets, one physical shot; ghost eliminated, puppeteer survives':'real trivia: two private distinct targets, two shots; ghost eliminated, puppeteer survives',stages,soundCues:report.soundCues,renderChecks:report.renderChecks,flashFrames:report.flashFrames,reloadFrames:report.reloadFrames,applicationAudioCues:report.applicationAudioCues,ambiencePlaying:report.ambiencePlaying,finalState:s},null,2));
    if(process.env.CURSED_GHOST_HANDOFF_QA==='1'){
      await host('END');await ghost.locator('#question-screen').waitFor({state:'visible'});await ghost.locator('#question-screen').evaluate(async el=>{await Promise.all(el.getAnimations().map(a=>a.finished));});
      const after=await state(ghost);assert.equal(after.players.find(p=>p.id===after.selfId)?.lifeState,'GHOST');
      await ghost.screenshot({path:path.join(dir,'phone-ghost-waiting.png'),fullPage:true});
    }
    console.log('PASS: full trivia round; collective ghost transformation;  shot/cycle/shell audio preserved; layered wood, fixed appearance2, gates/chains/UI, real MP3 loop; '+(process.env.KEEP_OPEN!=='0'?'native viewer remains open.':'closing native viewer.'));
    if(process.env.KEEP_OPEN!=='0'){
      while(!fs.existsSync(path.join(dir,'cleanup.json')))await sleep(1000);
    }else await host('EXIT');
  }finally{for(const c of clients)await c.context.close();await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
