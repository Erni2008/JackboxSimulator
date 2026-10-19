const fs=require('fs'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
(async()=>{const browser=await chromium.launch();try{const ready=JSON.parse(fs.readFileSync('server/build/impostor-browser/ready.json'));const page=await browser.newPage({viewport:{width:390,height:844}});await page.goto(ready.url);
for(const name of ['Александр','Shadow']){
 await page.evaluate(name=>{document.querySelectorAll('.screen').forEach(s=>s.hidden=true);document.getElementById('final-screen').hidden=false;window.revealNow=1000;window.revealState={selfId:'p',players:[{id:'p',name}],impostor:{sessionId:'reveal-test',phase:'IMPOSTOR_REVEAL',finalPhaseStartedAt:1000,participants:[{id:'p',name}],revealedImpostorId:'p'}};window.revealQA=createFinalVotingController({getState:()=>revealState,isAuthenticated:()=>true,send:()=>{},now:()=>revealNow,makeId:()=>''});revealQA.render();},name);
 assert(await page.locator('#final-announcement').isHidden());await page.evaluate(()=>{revealNow=2999;revealQA.tick();});assert(await page.locator('#final-announcement').isHidden());
 await page.evaluate(()=>{revealNow=3000;revealQA.tick();});assert(await page.locator('#final-announcement').isVisible());assert.equal(await page.locator('#final-announcement').textContent(),'IMPOSTOR: '+name);
 await page.evaluate(()=>document.fonts.ready);assert((await page.locator('#final-announcement').evaluate(e=>getComputedStyle(e).fontFamily)).includes('ParchmentHand'));
 await page.screenshot({path:`server/build/parchment-browser/identity-${name==='Shadow'?'english':'russian'}.png`,fullPage:true});
 await page.evaluate(()=>{revealNow=4500;revealQA.reset();revealQA.render();});assert(await page.locator('#final-announcement').isVisible(),'Reconnect must not restart delay');
}
console.log('PASS identity delay at 1999/2000ms, Russian/English font and reconnect');}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
