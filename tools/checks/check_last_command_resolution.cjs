/* Real browser: pixel budgets, container-only resize and cleanup. */
const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||undefined});
 try{
  const page=await browser.newPage({viewport:{width:2560,height:1440},deviceScaleFactor:2});
  page.setDefaultTimeout(20000);const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto((process.env.LC_URL||'http://localhost:8080')+'/last-command-3d/?autostart=1&scenario=inspection');
  await page.waitForFunction(()=>window.__lc3d?.view?.machine?.loaded&&!document.querySelector('#quality').disabled,null,{timeout:120000});
  const budgets=await page.evaluate(()=>{const v=window.__lc3d.view;return ['LOW','MEDIUM','HIGH'].map(q=>{v.setQuality(q);return {q,pixels:v.renderer.domElement.width*v.renderer.domElement.height};});});
  for(const [i,b]of budgets.entries())assert.ok(b.pixels<=[1500000,2500000,4000000][i],JSON.stringify(b));
  await page.evaluate(()=>{const v=window.__lc3d.view;v.setQuality('LOW');v.host.style.width='640px';v.host.style.height='480px';});
  await page.waitForFunction(()=>window.__lc3d.view.bufferWidth===640&&window.__lc3d.view.bufferHeight===480);
  assert.equal(await page.evaluate(()=>window.__lc3d.view.camera.aspect),640/480);
  await page.evaluate(()=>{const v=window.__lc3d.view;v.host.style.width='';v.host.style.height='';v.focus('BIG_BUTTON');});
  await page.waitForTimeout(1200);
  assert.equal(await page.evaluate(()=>window.__lc3d.view.bufferWidth),2242);
  await page.setViewportSize({width:390,height:844});
  await page.waitForFunction(()=>window.__lc3d.view.bufferWidth===390);
  assert.ok(await page.evaluate(()=>{const v=window.__lc3d.view;return v.renderer.domElement.width*v.renderer.domElement.height<=1500000;}));
  await page.screenshot({path:'/tmp/lc-design-mobile.png'});
  await page.evaluate(()=>window.__lc3d.view.dispose());
  await page.setViewportSize({width:500,height:900});await page.waitForTimeout(200);
  assert.deepEqual(errors,[]);console.log('RESOLUTION_OK',JSON.stringify(budgets));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
