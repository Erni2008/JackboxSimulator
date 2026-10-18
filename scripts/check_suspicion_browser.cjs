/* Real mobile Chromium against the isolated Javalin fixture. No dependency added to the game. */
const fs=require('fs'),path=require('path'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const directory=path.resolve('server/build/suspicion-browser');
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function command(command,extra={}){
  const id=crypto.randomUUID();
  const file=path.join(directory,'control.json');
  fs.writeFileSync(file+'.tmp',JSON.stringify({id,command,...extra}));fs.renameSync(file+'.tmp',file);
  if(command==='stop')return;
  for(let n=0;n<200;n++){
    try{if(JSON.parse(fs.readFileSync(path.join(directory,'processed.json'))).id===id)return;}catch{}
    await sleep(25);
  }
  throw Error('Fixture control timed out: '+command);
}
(async()=>{
  const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||undefined});
  try{
    for(const activeCount of [3,4]){
      const ready=JSON.parse(fs.readFileSync(path.join(directory,'ready.json')));
      const clients=[];
      for(let i=0;i<activeCount+2;i++){
        const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:1});
        const page=await context.newPage(),frames=[];page.on('pageerror',error=>{throw error;});
        page.on('websocket',socket=>socket.on('framereceived',event=>{try{frames.push(JSON.parse(event.payload));}catch{}}));
        await page.goto(ready.url);await page.locator('#room-code').fill(ready.code);await page.locator('#nickname').fill('Guest'+i);
        const joined=page.waitForResponse(response=>response.url().endsWith('/join')&&response.request().method()==='POST');
        await page.locator('#join-button').click();const credentials=await (await joined).json();
        await page.locator('#waiting-screen').waitFor({state:'visible'});
        clients.push({context,page,credentials,frames});
      }
      await command('start',{round:1,activeIds:clients.slice(0,activeCount).map(c=>c.credentials.selfId)});
      const voter=clients[activeCount],p=voter.page,other=clients[activeCount+1];
      await p.locator('#suspicion-screen').waitFor({state:'visible'});
      assert.equal(await p.locator('.suspect-card').count(),activeCount);
      const a=clients[0].credentials.selfId,b=clients[1].credentials.selfId;
      await p.locator(`[data-id="${a}"]`).click();
      await p.waitForFunction(id=>document.querySelector(`[data-id="${id}"]`)?.getAttribute('aria-pressed')==='true',a);
      await p.locator(`[data-id="${b}"]`).click();
      await p.waitForFunction(id=>document.querySelector(`[data-id="${id}"]`)?.getAttribute('aria-pressed')==='true',b);
      assert.equal(await p.locator('.suspect-card.selected').count(),1);
      await p.reload();await p.locator('#suspicion-screen').waitFor({state:'visible'});
      await p.waitForFunction(id=>document.querySelector(`[data-id="${id}"]`)?.getAttribute('aria-pressed')==='true',b);
      assert.equal(await clients[0].page.locator(`[data-id="${a}"]`).isDisabled(),true);
      await clients[0].page.locator(`[data-id="${b}"]`).click();
      await p.waitForFunction(total=>document.getElementById('suspicion-progress').textContent===`SUSPICIONS RECEIVED: 2/${total}`,activeCount+2);
      assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
      await p.screenshot({path:path.join(directory,`${activeCount}participants-mobile-open.png`),fullPage:true});
      assert(other.frames.filter(e=>e.payload?.impostor).every(e=>!e.payload.impostor.selectedSuspectId),'Other player saw a private target');
      assert(clients.every(c=>c.frames.every(e=>!e.payload?.impostor?.selections)),'Raw selections leaked');
      await command('expire');
      await p.waitForFunction(()=>document.getElementById('suspicion-title').textContent==='SUSPICIONS SEALED');
      assert.equal(await p.locator('.suspect-card:enabled').count(),0);
      assert.equal(await p.locator('#suspicion-timer').textContent(),'0s');
      await p.screenshot({path:path.join(directory,`${activeCount}participants-mobile-sealed.png`),fullPage:true});
      await command('start',{round:2});
      await p.waitForFunction(()=>document.getElementById('suspicion-title').textContent==='CHOOSE A SUSPECT');
      assert.equal(await p.locator('.suspect-card.selected').count(),0);
      // Test-only wire fault: a valid UI click is rejected by the real server, with the same request ID.
      await p.evaluate(()=>{
        const original=WebSocket.prototype.send;
        WebSocket.prototype.send=function(text){
          const message=JSON.parse(text);
          if(message.type==='SUBMIT_SUSPICION'){
            WebSocket.prototype.send=original;message.payload.suspectId='invalid-qa-target';
            return original.call(this,JSON.stringify(message));
          }
          return original.call(this,text);
        };
      });
      await p.locator(`[data-id="${a}"]`).click();
      await p.waitForFunction(()=>document.getElementById('suspicion-status').textContent.includes('Choose an active participant.'));
      assert.equal(await p.locator('.suspect-card.selected').count(),0,'Rejected choice was shown as confirmed');
      for(let i=0;i<clients.length;i++){
        const target=i===0?b:a;
        await clients[i].page.locator(`[data-id="${target}"]`).click();
        await clients[i].page.waitForFunction(id=>document.querySelector(`[data-id="${id}"]`)?.getAttribute('aria-pressed')==='true',target);
      }
      await p.waitForFunction(total=>document.getElementById('suspicion-progress').textContent===`SUSPICIONS RECEIVED: ${total}/${total}`,clients.length);
      assert.equal(await p.locator('#suspicion-title').textContent(),'SUSPICIONS SEALED');
      await command('new');await p.locator('#join-screen').waitFor({state:'visible'});
      for(const client of clients)await client.context.close();
      console.log(`PASS: ${activeCount} active + 2 spectators, mobile layout, accepted/replaced/private selection, rejection UX, reconnect, deadline, early completion, round reset and room closure`);
    }
  }finally{await command('stop');await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
