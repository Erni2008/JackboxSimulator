process.chdir(require('node:path').resolve(__dirname,'../..'));
/* Run alongside :lwjgl3:desktopHostingQA. Eight real controller browsers; no production test endpoint. */
const fs=require('fs'),path=require('path'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const directory=path.resolve('lwjgl3/build/desktop-hosting-qa'),sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function host(type,payload={}){
  const id=crypto.randomUUID(),temporary=path.join(directory,'control.json.tmp');
  fs.writeFileSync(temporary,JSON.stringify({id,type,payload}));fs.renameSync(temporary,path.join(directory,'control.json'));
  for(let i=0;i<200;i++){try{const data=JSON.parse(fs.readFileSync(path.join(directory,'processed.json')));if(data.id===id)return data;}catch{}await sleep(50);}throw Error('Host command timed out: '+type);
}
(async()=>{
  let ready;for(let i=0;i<600;i++){try{ready=JSON.parse(fs.readFileSync(path.join(directory,'ready.json')));break;}catch{await sleep(100);}}
  assert(ready,'Desktop host not ready');
  const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||undefined}),clients=[],errors=[];
  const state=page=>page.evaluate(()=>window.__introState);
  try{
    for(let i=0;i<8;i++){
      const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true}),page=await context.newPage();page.on('pageerror',error=>errors.push(error.message));
      await page.addInitScript(()=>{const Native=WebSocket;window.__introEvents=[];window.WebSocket=class extends Native{constructor(...args){super(...args);window.__introSocket=this;this.addEventListener('message',event=>{const data=JSON.parse(event.data);window.__introEvents.push(data);if(data.payload?.roomId)window.__introState=data.payload;});}};});
      await page.goto(ready.url+'/?room='+ready.code);await page.locator('#nickname').fill('IntroGuest'+i);
      const response=page.waitForResponse(value=>value.url().endsWith('/join')&&value.request().method()==='POST');await page.locator('#join-button').click();const joined=await response;assert(joined.ok());const credentials=await joined.json();
      await page.locator('#waiting-screen').waitFor({state:'visible'});clients.push({page,context,credentials});
    }
    await clients[0].page.waitForFunction(()=>window.__introState?.canStart);
    const original=(await state(clients[0].page)).players.map(player=>[player.id,player.characterId]);
    assert.notEqual((await host('START_GAME',{introId:'final_answer_intro_v1'})).type,'ERROR');
    for(const {page} of clients){
      await page.waitForFunction(()=>window.__introState?.intro?.introId==='final_answer_intro_v1');
      const snapshot=await state(page);assert.equal(snapshot.phase,'STARTING');assert.equal(snapshot.deadline,0);assert.equal(snapshot.question,undefined);
      assert.equal(await page.locator('#waiting-title').textContent(),'THE SHOW IS ABOUT TO BEGIN');assert.equal(await page.locator('#question-screen').isVisible(),false);
      assert.equal(await page.evaluate(()=>performance.getEntriesByType('resource').some(entry=>entry.name.includes('/audio/host/'))),false);
    }
    const snapshot=await state(clients[0].page),payload={gameId:snapshot.gameId,introId:snapshot.intro.introId};
    await clients[0].page.evaluate(payload=>window.__introSocket.send(JSON.stringify({type:'SKIP_INTRO',requestId:'forged-intro-skip',payload})),payload);
    await clients[0].page.waitForFunction(()=>window.__introEvents.some(event=>event.requestId==='forged-intro-skip'&&event.payload.code==='HOST_ONLY'));
    await clients[1].page.reload();await clients[1].page.waitForFunction(()=>window.__introState?.phase==='STARTING');
    assert.equal((await state(clients[1].page)).selfId,clients[1].credentials.selfId);
    await clients[0].page.screenshot({path:path.join(directory,'intro-phone-waiting.png')});
    assert.notEqual((await host('SKIP_INTRO',payload)).type,'ERROR');
    for(const {page} of clients){
      await page.waitForFunction(()=>window.__introState?.phase==='QUESTION_PRESENTATION');await page.locator('#question-screen').waitFor({state:'visible'});
      assert.equal((await state(page)).deadline,0);assert.deepEqual((await state(page)).players.map(player=>[player.id,player.characterId]),original);
      assert.equal(await page.locator('#answers button').first().isDisabled(),true);
    }
    assert.notEqual((await host('SKIP_INTRO',payload)).type,'ERROR');
    assert.equal(await clients[0].page.evaluate(()=>window.__introEvents.filter(event=>event.type==='QUESTION_STARTED').length),1);
    assert.deepEqual(errors,[]);await host('EXIT');
    console.log('PASS: eight real mobile browsers wait silently, no early question/timer, host-only skip, reconnect identity, stable assignments and one synchronized first question');
  }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
