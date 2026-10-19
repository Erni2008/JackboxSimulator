/* Real libGDX host with its owned RoomServer. Test-classpath local-file host commands, normal phone UI. */
const fs=require('fs'),path=require('path'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const dir=path.resolve('lwjgl3/build/desktop-hosting-qa'),ready=JSON.parse(fs.readFileSync(path.join(dir,'ready.json')));
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function host(type,payload={},name=''){const id=crypto.randomUUID(),tmp=path.join(dir,'control.json.tmp');fs.writeFileSync(tmp,JSON.stringify({id,type,payload,name}));fs.renameSync(tmp,path.join(dir,'control.json'));for(let i=0;i<200;i++){try{const r=JSON.parse(fs.readFileSync(path.join(dir,'processed.json')));if(r.id===id){assert(!r.type.includes('REJECTED'),JSON.stringify(r));return r;}}catch(e){if(e.code!=='ENOENT'&&!(e instanceof SyntaxError))throw e;}await sleep(50);}throw Error('Native host command timeout: '+type);}
(async()=>{const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||undefined});const clients=[],errors=[];
try{
  for(let i=0;i<6;i++){
    const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true}),page=await context.newPage();
    await page.addInitScript(()=>{const Native=WebSocket;window.__qaPhases=[];window.WebSocket=class extends Native{constructor(...a){super(...a);window.__qaSocket=this;this.addEventListener('message',event=>{const e=JSON.parse(event.data);if(e.payload?.roomId){window.__qaState=e.payload;if(e.payload.impostor)window.__qaPhases.push(e.payload.impostor.phase);}});}};});
    page.on('pageerror',e=>errors.push(e.message));await page.goto(ready.url+'/?room='+ready.code);assert.equal(await page.locator('#room-code').inputValue(),ready.code);await page.locator('#nickname').fill('DesktopGuest'+i);
    const joined=page.waitForResponse(r=>r.url().endsWith('/join')&&r.request().method()==='POST');await page.locator('#join-button').click();const credentials=await(await joined).json();await page.locator('#waiting-screen').waitFor({state:'visible'});clients.push({page,credentials});
  }
  const state=()=>clients[0].page.evaluate(()=>window.__qaState);
  const phase=name=>clients[0].page.waitForFunction(n=>window.__qaState?.impostor?.phase===n,name,{timeout:60000});
  const action=async(type,extra={})=>{const s=await state();return host(type,{roomCode:ready.code,sessionId:s.impostor?.sessionId||s.lobbyId,...extra});};
  await host('CAPTURE',{},'connected-lobby-qr');
  const initial=await state();
  await action('UPDATE_IMPOSTOR_SETTINGS',{settings:{...initial.impostorSettings,roundCount:1,discussionSeconds:5,votingSeconds:5,clueSeconds:5}});
  const sessions=new Set();
  for(let match=0;match<4;match++){
    const count=match<2?3:4,s=await state();await action('START_IMPOSTOR',s.impostor?{}:{participantIds:clients.slice(0,count).map(c=>c.credentials.selfId)});
    await phase('ROLE_REVEAL');let start=await state();assert(!sessions.has(start.impostor.sessionId));sessions.add(start.impostor.sessionId);
    const roles=await Promise.all(clients.map(c=>c.page.evaluate(()=>window.__qaState.impostor)));const actual=roles.findIndex(r=>r.role==='IMPOSTOR');assert(actual>=0&&actual<count);
    for(let i=count;i<6;i++)assert(!roles[i].role&&!roles[i].secretWord);
    const publicState=await(await clients[0].page.request.get(ready.url+'/rooms/'+ready.code)).json();assert(!publicState.impostor.role&&!publicState.impostor.secretWord);
    await phase('ROUND_CLUE_INPUT');
    for(let i=0;i<count;i++){await clients[i].page.locator('#clue-input').fill('СВЕТ');await clients[i].page.locator('#clue-submit').click();}
    await phase('FINAL_VOTING');const target=match===1?(actual+1)%count:actual;
    for(let i=0;i<count;i++){
      const suspect=match===3?(i+1)%count:i===target?(target+1)%count:target;
      await clients[i].page.locator(`#final-cards [data-id="${clients[suspect].credentials.selfId}"]`).click();await clients[i].page.locator('#confirm-vote').click();
    }
    await phase('FINAL_VOTE_REVEAL');await sleep(1650);await host('CAPTURE',{},`match-${match+1}-stamps`);
    await phase('RESULT');await sleep(650);const result=(await state()).impostor.result;
    assert.equal(result.outcome,match===1?'IMPOSTOR_ESCAPED':match===3?'NO_CONSENSUS':'IMPOSTOR_CAUGHT');assert.equal(result.statistics.validVotes,count);assert.equal(result.statistics.completedRounds,1);
    await host('CAPTURE',{},`match-${match+1}-completion`);
    await clients[0].page.reload();await clients[0].page.locator('#final-screen').waitFor({state:'visible'});assert.deepEqual((await state()).impostor.result,result);
    await clients[0].page.evaluate(()=>window.__qaSocket.close());await clients[0].page.locator('#disconnected-screen').waitFor({state:'visible'});await clients[0].page.locator('#final-screen').waitFor({state:'visible'});assert.deepEqual((await state()).impostor.result,result);
    for(const {page} of clients){assert.equal(await page.locator('#final-title').textContent(),'THE IMPOSTOR IS…');for(const id of ['final-personal','final-waiting-host','final-results','result-player'])assert(await page.locator('#'+id).isHidden());assert.equal(await page.locator('#final-status').textContent(),'');}
    const next=match===0||match===2?'REPLAY_IMPOSTOR':'IMPOSTOR_RETURN_TO_LOBBY';await action(next);for(const c of clients)await c.page.locator('#waiting-screen').waitFor({state:'visible'});
    assert.equal((await state()).code,initial.code);assert.deepEqual((await state()).players,initial.players);
    console.log(`PASS live owned server: match ${match+1}, ${count} active + ${6-count} spectators, ${result.outcome}, ${next}`);
  }
  assert.deepEqual(errors,[]);await host('EXIT');
  for(let n=0;n<200;n++){if(fs.existsSync(path.join(dir,'cleanup.json')))break;await sleep(50);}
  const cleanup=JSON.parse(fs.readFileSync(path.join(dir,'cleanup.json')));assert(cleanup.portReleased);
  fs.writeFileSync(path.join(dir,'report.json'),JSON.stringify({matches:4,stablePlayers:6,uniqueMatches:sessions.size,portReleased:cleanup.portReleased,pageErrors:errors},null,2));
}finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
