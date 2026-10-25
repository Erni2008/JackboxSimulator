/* Real native host + authenticated WebSocket + two independent phone browsers. */
process.chdir(require('node:path').resolve(__dirname,'../..'));
const fs=require('fs'),path=require('path'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const dir=path.resolve('lwjgl3/build/last-command-phone-check'),sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function host(command){const id=crypto.randomUUID(),f=path.join(dir,'control.json');fs.writeFileSync(f+'.tmp',JSON.stringify({id,command}));fs.renameSync(f+'.tmp',f);if(command==='EXIT')return;for(let i=0;i<300;i++){try{let r=JSON.parse(fs.readFileSync(path.join(dir,'processed.json')));if(r.id===id)return r;}catch{}await sleep(50);}throw Error('Native timeout '+command);}
async function native(expected){for(let i=0;i<100;i++){const r=await host('INSPECT');if(expected(r))return r;await sleep(100);}throw Error('Native state mismatch');}
(async()=>{
 let ready;for(let i=0;i<600;i++){try{const r=JSON.parse(fs.readFileSync(path.join(dir,'ready.json')));if((await fetch(r.url+'/health')).ok){ready=r;break;}}catch{}await sleep(100);}assert(ready,'Host unavailable');
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||undefined});const clients=[],errors=[],requests=[];
 try{
  for(const [name,character] of [['Command Red','ghost'],['Command Green','voodoo']]){
   const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});const p=await context.newPage();p.on('pageerror',e=>errors.push(e.message));p.on('request',r=>requests.push(r.url()));
   await p.addInitScript(()=>{const Native=WebSocket;window.WebSocket=class extends Native{constructor(...args){super(...args);window.__qaSocket=this;this.addEventListener('message',e=>{const event=JSON.parse(e.data);if(event.payload?.roomId)window.__qaState=event.payload;});}};});
   await p.goto(ready.url+'/?room='+ready.code);await p.locator('#nickname').fill(name);await p.locator('#character').selectOption(character);await p.locator('#join-button').click();await p.locator('#waiting-screen').waitFor({state:'visible'});clients.push({context,p});
  }
  await host('START');const [a,b]=clients.map(c=>c.p);for(const {p} of clients)await p.locator('#lastcommand-screen').waitFor({state:'visible',timeout:60000});
  const initial=await native(r=>r.screen==='TheLastCommandScreen');assert.equal(initial.continuous,false);
  await a.locator('[data-lc-set=LEVER_MODULE][data-value=DOWN]').click();await b.waitForFunction(()=>window.__qaState.lastCommand.lever==='DOWN');await native(r=>r.nativeLever==='DOWN');
  await b.locator('[data-lc-set=ADJUSTER][data-value="90"]').click();await a.waitForFunction(()=>window.__qaState.lastCommand.adjuster===90);
  await a.locator('[data-lc-set=LIGHT_MODULE][data-value=GREEN]').click();await native(r=>r.nativeLight==='GREEN');
  await b.locator('#lc-hatch').click();await native(r=>r.nativeHatch===true);
  // Concurrent atomic arrow updates from different clients.
  await Promise.all([a.locator('[data-lc-step="0:+1"]').click(),b.locator('[data-lc-step="0:+1"]').click()]);await native(r=>r.nativeCode==='2000');await a.locator('[data-lc-step="1:-1"]').click();await b.waitForFunction(()=>window.__qaState.lastCommand.code==='2900');await native(r=>r.nativeCode==='2900');
  // Actual pointer capture, held state, release and disconnect recovery.
  const button=a.locator('[data-lc-hold=SMALL_BUTTON_1]');await button.scrollIntoViewIfNeeded();let box=await button.boundingBox();await a.mouse.move(box.x+box.width/2,box.y+box.height/2);await a.mouse.down();await native(r=>r.nativeSmallHeld===true);await sleep(250);await a.mouse.up();await native(r=>r.nativeSmallHeld===false);
  await a.evaluate(()=>window.__qaSocket.close());await a.locator('#lastcommand-screen').waitFor({state:'visible',timeout:20000});await a.waitForFunction(()=>window.__qaState.lastCommand.code==='2900');
  await sleep(1000);const before=await host('INSPECT');await sleep(1200);const after=await host('INSPECT');assert(after.renderedFrames-before.renderedFrames<8,'Idle scene must not continuously redraw');
  await host('QUALITY');await native(r=>r.quality===(initial.quality==='HIGH'?'MEDIUM':'HIGH')&&r.nativeCode==='2900'&&r.nativeLever==='DOWN'&&r.nativeHatch===true&&r.nativeLight==='GREEN');
  await a.screenshot({path:path.join(dir,'phone.png'),fullPage:true});assert(!requests.some(u=>/\.(glb|gltf|ktx2?)(?:\?|$)/i.test(u)),'No phone GLB loads');assert.equal((await fetch(ready.url+'/models/last_command/box_final.glb')).status,404);
  await host('RESET');await a.waitForFunction(()=>window.__qaState.lastCommand.code==='0000');await native(r=>r.nativeCode==='0000'&&r.nativeLever==='UP'&&r.nativeLight==='OFF'&&!r.nativeHatch);
  await host('END');for(const {p} of clients)await p.locator('#waiting-screen').waitFor({state:'visible'});assert.equal((await host('INSPECT')).continuous,true);
  await host('LOCAL');const localBefore=await native(r=>r.nativeCode==='6248');await host('QUALITY');const localAfter=await native(r=>r.quality!==localBefore.quality&&r.nativeCode==='6248'&&r.nativeLever==='MIDDLE'&&r.nativeHatch&&r.nativeLight==='BLUE');assert.equal(localAfter.nativeGreenColor,'0000ffff');assert.equal(localAfter.nativeRedLocked,true);assert.equal(localAfter.actionHistory,localBefore.actionHistory);
  assert.deepEqual(errors,[]);fs.writeFileSync(path.join(dir,'browser-result.json'),JSON.stringify({passed:true,phoneCount:2,idleFrames:after.renderedFrames-before.renderedFrames,idleSeconds:1.2,glbRequests:0,errors},null,2));console.log('LAST_COMMAND_BROWSER_NATIVE_OK idleFrames='+String(after.renderedFrames-before.renderedFrames));
 }finally{await host('EXIT');await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
