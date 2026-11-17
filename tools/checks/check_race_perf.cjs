// Phone-like perf probe: 844x390 @2x, touch, CPU throttled 4x; reports fps per map. URL=... PLAYWRIGHT_MODULE=... CHROME_PATH=...
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
(async()=>{const b=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||undefined,args:['--use-angle=metal','--ignore-gpu-blocklist']});
  for(const map of [1,2,3,4]){const c=await b.newContext({viewport:{width:844,height:390},deviceScaleFactor:2,hasTouch:true,isMobile:true});const p=await c.newPage();
    const s=await c.newCDPSession(p);await s.send('Emulation.setCPUThrottlingRate',{rate:4});
    await p.goto(process.env.URL+`?char=pumpkin&map=${map}&seed=7`);await p.waitForSelector('#loading[hidden]',{state:'attached',timeout:180000});await p.waitForTimeout(4000);
    const fps=await p.evaluate(()=>new Promise(r=>{let n=0;const s=performance.now();const f=()=>{n++;performance.now()-s<3000?requestAnimationFrame(f):r(Math.round(n/3))};requestAnimationFrame(f);}));
    const info=await p.evaluate(()=>{const a=window.__race;const i=a.renderer.info;return {calls:i.render.calls,tris:i.render.triangles,pr:a.renderer.getPixelRatio()};});
    console.log('map',map,'fps',fps,JSON.stringify(info));await c.close();}
  await b.close();})();
