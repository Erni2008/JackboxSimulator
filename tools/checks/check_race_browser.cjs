// URL=http://localhost:PORT/race/ OUT=dir PLAYWRIGHT_MODULE=... node tools/checks/check_race_browser.cjs — phone viewport, plays a few seconds, screenshots + FPS.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
(async()=>{const b=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||undefined,args:['--use-angle=metal','--enable-gpu','--ignore-gpu-blocklist']});
  const p=await b.newPage({viewport:{width:Number(process.env.W||844),height:Number(process.env.H||390)},deviceScaleFactor:2,hasTouch:true});
  const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text());});
  await p.goto(process.env.URL+'?char='+(process.env.CHAR||'pumpkin')+(process.env.Z?'&z='+process.env.Z:'')+(process.env.MAP?'&map='+process.env.MAP:''));await p.waitForSelector('#loading[hidden]',{timeout:120000,state:'attached'});
  for(const t of (process.env.AT||'2,8').split(',').map(Number)){await p.keyboard.down('KeyW');await p.waitForTimeout(t*1000);await p.keyboard.up('KeyW');
    const fps=await p.evaluate(()=>new Promise(r=>{let n=0;const s=performance.now();const f=()=>{n++;performance.now()-s<1000?requestAnimationFrame(f):r(n)};requestAnimationFrame(f);}));
    await p.screenshot({path:`${process.env.OUT}/race_${t}.png`});console.log('shot',t,'fps',fps);}
  console.log('errors',JSON.stringify(errs.slice(0,5)));await b.close();})();
