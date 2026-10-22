process.chdir(require('node:path').resolve(__dirname, '../..'));
/* Native DesktopHostingQA + isolated mobile browsers; normal HTTP and WebSocket paths. */
const fs=require('fs'),path=require('path'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const dir=path.resolve('lwjgl3/build/desktop-hosting-qa'),sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function host(type,payload={}){const id=crypto.randomUUID(),temporary=path.join(dir,'control.json.tmp');fs.writeFileSync(temporary,JSON.stringify({id,type,payload}));fs.renameSync(temporary,path.join(dir,'control.json'));for(let i=0;i<200;i++){try{const r=JSON.parse(fs.readFileSync(path.join(dir,'processed.json')));if(r.id===id)return r;}catch(e){if(e.code!=='ENOENT'&&!(e instanceof SyntaxError))throw e;}await sleep(50);}throw Error('Host timeout: '+type);}
(async()=>{
  let ready;for(let i=0;i<600;i++){try{ready=JSON.parse(fs.readFileSync(path.join(dir,'ready.json')));break;}catch{await sleep(100);}}assert(ready,'Host not ready');
  const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||undefined}),clients=[],errors=[];
  const characters=['ghost','dracula','plague_doctor','puppeteer','skeleton','zombie','pumpkin','voodoo'];
  const state=page=>page.evaluate(()=>window.__qaState);
  try{
    for(let i=0;i<8;i++){
      const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true}),page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
      await page.addInitScript(()=>{const Native=WebSocket;window.__qaEvents=[];window.WebSocket=class extends Native{constructor(...args){super(...args);window.__qaSocket=this;this.addEventListener('message',event=>{const e=JSON.parse(event.data);window.__qaEvents.push(e);if(e.payload?.roomId)window.__qaState=e.payload;});}};});
      await page.goto(ready.url+'/?room='+ready.code);await page.locator('#nickname').fill('LobbyGuest'+i);await page.locator('#character').selectOption(characters[i]);
      const joined=page.waitForResponse(r=>r.url().endsWith('/join')&&r.request().method()==='POST');await page.locator('#join-button').click();const response=await joined;assert(response.ok(),await response.text());const credentials=await response.json();await page.locator('#waiting-screen').waitFor({state:'visible'});clients.push({page,context,credentials});
    }
    for(let i=0;i<8;i++){await clients[i].page.waitForFunction(()=>window.__qaState?.players.length===8);assert.equal((await state(clients[i].page)).selfId,clients[i].credentials.selfId);assert.equal(await clients[i].page.locator('#character-name').textContent(),characters[i].replace('_',' ').toUpperCase());}
    assert.equal(new Set((await state(clients[0].page)).players.map(p=>p.characterId)).size,8);
    await clients[0].page.evaluate(()=>window.__qaSocket.send(JSON.stringify({type:'START_GAME',requestId:'forged-host',payload:{}})));await clients[0].page.waitForFunction(()=>window.__qaEvents.some(e=>e.requestId==='forged-host'&&e.payload.code==='HOST_ONLY'));
    await clients[0].page.evaluate(()=>window.__qaSocket.close());await clients[0].context.setOffline(true);await clients[1].page.waitForFunction(id=>window.__qaState.players.find(p=>p.id===id)?.connectionStatus==='OFFLINE',clients[0].credentials.selfId);assert.equal((await host('START_GAME')).code,'PLAYER_OFFLINE');
    await clients[0].context.setOffline(false);await clients[0].page.reload();await clients[0].page.locator('#waiting-screen').waitFor({state:'visible'});assert.equal((await state(clients[0].page)).selfId,clients[0].credentials.selfId);await clients[1].page.waitForFunction(()=>window.__qaState.canStart);
    assert.notEqual((await host('START_GAME')).type,'ERROR');await Promise.all(clients.map(c=>c.page.waitForFunction(()=>window.__qaState?.phase==='STARTING')));
    const starting=await state(clients[0].page);assert.equal(starting.transitionEndsAt-starting.transitionStartedAt,4000);await clients[0].page.screenshot({path:path.join(dir,'lobby-start-phone.png')});
    const late=await clients[0].page.request.post(ready.url+'/rooms/'+ready.code+'/join',{form:{name:'LateGuest',characterId:'ghost'}});assert.equal(late.status(),409);assert.equal((await late.json()).error,'GAME_ALREADY_STARTED');
    await clients[2].page.reload();await clients[2].page.locator('#waiting-screen').waitFor({state:'visible'});assert.equal((await state(clients[2].page)).transitionStartedAt,starting.transitionStartedAt);
    for(const c of clients){await c.page.waitForFunction(()=>window.__qaState?.phase==='QUESTION_PRESENTATION');await c.page.locator('#question-screen').waitFor({state:'visible'});assert(await c.page.locator('#answers button').first().isDisabled());assert.equal((await state(c.page)).questionStartTime,starting.transitionEndsAt);}
    await clients[0].page.screenshot({path:path.join(dir,'lobby-first-question-phone.png')});
    for(const c of clients){await c.page.waitForFunction(()=>window.__qaState?.phase==='ANSWERING',null,{timeout:30000});assert(await c.page.locator('#answers button').first().isEnabled());}
    const deadlines=await Promise.all(clients.map(c=>state(c.page).then(s=>s.deadline)));assert.equal(new Set(deadlines).size,1);
    await clients[0].page.locator('#answers button').first().click();await clients[0].page.waitForFunction(()=>window.__qaState.hasSubmittedAnswer===true);assert.equal((await state(clients[1].page)).hasSubmittedAnswer,false);assert.deepEqual(errors,[]);
    await host('EXIT');for(let i=0;i<200&&!fs.existsSync(path.join(dir,'cleanup.json'));i++)await sleep(50);assert(JSON.parse(fs.readFileSync(path.join(dir,'cleanup.json'))).portReleased);
    console.log('PASS: eight mobile browsers, unique characters, offline rejection/reconnect, host-only start, common start deadline, late-join lock, first-question UI, simultaneous answer unlock and isolated submission');
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
