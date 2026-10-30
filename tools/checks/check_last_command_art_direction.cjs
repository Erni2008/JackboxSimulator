/* Real server: standby -> live task, presentation geometry cleanup and visual captures. */
const assert=require('node:assert/strict'),fs=require('node:fs');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
(async()=>{const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||undefined});try{
 const p=await browser.newPage({viewport:{width:1440,height:1000}});p.setDefaultTimeout(30000);const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.addInitScript(()=>localStorage.setItem('finalanswer.lastcommand.preferences.v1',JSON.stringify({quality:'LOW',sound:false})));
 await p.goto((process.env.LC_URL||'http://localhost:8080')+'/last-command-3d/?autostart=1');
 await p.waitForFunction(()=>window.__lc3d?.view?.machine?.loaded&&!document.querySelector('#quality').disabled,null,{timeout:120000});
 await p.waitForFunction(()=>window.__lc3d.view.machine.questionCanvas.key==='standby');
 const out='generated/last-command-art-direction';fs.mkdirSync(out,{recursive:true});
 await p.screenshot({path:out+'/overview.png'});
 await p.locator('#scene-start').click();await p.waitForFunction(()=>window.__lc3d.state.lastCommand.testRound.status==='PLAYING'&&window.__lc3d.view.machine.questionCanvas.key!=='standby');
 await p.waitForFunction(()=>!window.__lc3d.view.fly);await p.screenshot({path:out+'/task.png'});
 await p.setViewportSize({width:390,height:844});await p.waitForFunction(()=>window.__lc3d.view.bufferWidth===390);await p.screenshot({path:out+'/mobile.png'});
 await p.evaluate(()=>window.__lc3d.view.dispose());
 assert.equal(await p.evaluate(()=>window.__lc3d.view.scene.children.filter(o=>o.isMesh).length),0,'presentation meshes remain after dispose');assert.deepEqual(errors,[]);
 console.log('ART_DIRECTION_OK: standby, start, live task, mobile, stage cleanup, no page errors');
 }finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1)});
