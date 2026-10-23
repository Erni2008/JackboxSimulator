process.chdir(require('node:path').resolve(__dirname, '../..'));
const fs=require('node:fs'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
(async()=>{const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||undefined});try{
 const ready=JSON.parse(fs.readFileSync('server/build/impostor-browser/ready.json'));const page=await browser.newPage({viewport:{width:390,height:844}});await page.goto(ready.url);
 for(const name of ['Александр','Shadow']){
  await page.evaluate(name=>{
   state={code:'QA',selfId:'p',players:[{id:'p',name}],impostor:{sessionId:'reveal-test',phase:'IMPOSTOR_REVEAL',finalPhaseStartedAt:1000,participants:[{id:'p',name}],revealedImpostorId:'p'}};authenticated=true;render();
  },name);
  for(const phase of ['IMPOSTOR_REVEAL','RESULT']){
   await page.evaluate(phase=>{state.impostor.phase=phase;render();},phase);
   assert(await page.locator('#blackout-screen').isVisible());assert.equal((await page.locator('body').innerText()).trim(),'');
   assert.equal(await page.locator('#final-announcement').textContent(),'');assert.equal(await page.locator('button:visible').count(),0);
  }
  await page.screenshot({path:`server/build/parchment-browser/identity-${name==='Shadow'?'english':'russian'}.png`,fullPage:true});
  await page.evaluate(()=>{finalVoting.reset();render();});assert(await page.locator('#blackout-screen').isVisible(),'Restoration must stay dark');
  await page.evaluate(()=>show('disconnected'));assert(await page.locator('#disconnected-screen').isVisible(),'Recovery UI must leave blackout safely');
 }
 console.log('PASS: English/Russian identities never render on phones; final reveal, completion, restoration and safe disconnect');
}finally{await browser.close();}})().catch(error=>{console.error(error);process.exitCode=1;});
