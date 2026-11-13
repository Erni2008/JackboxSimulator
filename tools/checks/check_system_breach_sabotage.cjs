'use strict';
// SABOTAGE phone effects in a real headless Chrome (CDP, no extra packages):
//   node tools/checks/check_system_breach_sabotage.cjs        (CHROME=/path/to/chrome to override)
// Checks that moved/ghost/locked buttons never submit the wrong answer, every virus can be removed by its own puzzle,
// and cleanup leaves the original question untouched.
const {spawn}=require('node:child_process'),fs=require('node:fs'),os=require('node:os'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../..');
const chrome=process.env.CHROME||[path.join(os.homedir(),'Library/Caches/ms-playwright/chromium-1234/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'),'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome','/usr/bin/google-chrome','/usr/bin/chromium'].find(p=>fs.existsSync(p));
assert(chrome,'Chrome not found; set CHROME');
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'sb-sab-'));const page=path.join(dir,'harness.html');
fs.writeFileSync(page,`<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=390">
<link rel="stylesheet" href="file://${root}/web/system-breach.css"><style>body{margin:0;background:#000}#sbx-screen{width:390px;height:700px}</style>
<div class="sbx"><div class="sbx-screen" id="sbx-screen"><main id="sbx-body" class="sbx-body"></main></div></div>
<script src="file://${root}/web/system-breach-sabotage.js"></script>`);
const port=9400+Math.floor(Math.random()*400);
const proc=spawn(chrome,['--headless=new','--remote-debugging-port='+port,'--user-data-dir='+path.join(dir,'profile'),'--allow-file-access-from-files','--window-size=390,760','about:blank'],{stdio:'ignore'});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));

// runs inside the page
async function suite(){
  const sleep=ms=>new Promise(r=>setTimeout(r,ms)),log=[];const ok=(c,m)=>{if(!c)throw new Error(m);log.push('ok '+m);};
  const screen=document.getElementById('sbx-screen'),body=document.getElementById('sbx-body');
  let submitted=[],sent=[];
  const sab=createSystemBreachSabotage({screen:()=>screen,submit:(id,answer)=>{sent.push({id,answer});return 'req'+sent.length;},reduced:false});
  function question(){body.replaceChildren();const q=document.createElement('p');q.className='sbx-q';q.textContent='3 + 11';body.append(q);
    const g=document.createElement('div');g.className='sbx-options';body.append(g);
    for(const o of ['12','14','15','41']){const b=document.createElement('button');b.type='button';b.className='sbx-option';b.innerHTML='<span class="sbx-key">A</span><span class="sbx-val"></span>';b.querySelector('.sbx-val').textContent=o;
      b.onclick=()=>{if(sab.blocks())return;submitted.push(o);};g.append(b);}return g;}
  const views={
    SHUFFLE_ATTACK:{sequence:['◆','▲','●','■','✚'],symbols:['■','◆','✚','▲','●']},
    NUMBER_HUNT:{count:7},
    POPUP_STORM:{windows:[0,1,2,3,4].map(i=>({id:'w'+i,title:'SYSTEM ERROR '+i,fakeClose:i<2}))},
    GHOST_BUTTONS:{viruses:['v0','v1','v2'],ghosts:4},
    SCREEN_GLITCH:{target:['3','1','4'],start:[1,2,2],max:5},
    LOCKED_ANSWERS:{numbers:[8,2,5,1]},
    MAGNETIC_BUTTONS:{indicators:['m0','m1','m2']}};
  const expected={SHUFFLE_ATTACK:['◆','▲','●','■','✚'],NUMBER_HUNT:['1','2','3','4','5','6','7'],SCREEN_GLITCH:['3','1','4'],LOCKED_ANSWERS:['1','2','5','8']};
  const sets={POPUP_STORM:['w0','w1','w2','w3','w4'],GHOST_BUTTONS:['v0','v1','v2'],MAGNETIC_BUTTONS:['m0','m1','m2']};
  let n=0;
  for(const [type,data] of Object.entries(views)){
    submitted=[];sent=[];const id='inf-'+(++n);let grid=question();
    sab.sync({infectionId:id,type,questionsLeft:3,data:{...data,seed:11}});sab.decorate(grid);
    ok(screen.classList.contains('sab-infected'),type+' marks the screen');
    if(type==='SHUFFLE_ATTACK'){const first=[...grid.children].map(b=>b.textContent).join();await sleep(2300);ok([...grid.children].map(b=>b.textContent).join()!==first,'shuffle moves the buttons');
      for(const b of [...grid.children]){b.click();ok(submitted.at(-1)===b.querySelector('.sbx-val').textContent,'a shuffled button submits its own answer '+submitted.at(-1));}
      ok(new Set(submitted).size===4,'all four answers stay reachable');submitted=[];}
    if(type==='GHOST_BUTTONS'){const ghosts=[...grid.querySelectorAll('.sbx-ghost')];ok(ghosts.length===4&&grid.querySelectorAll('.sbx-option').length===8,'four ghosts join four real keys');
      ghosts.forEach(g=>g.click());ok(submitted.length===0,'ghost buttons never submit');grid.querySelector('.sbx-option:not(.sbx-ghost)').click();ok(submitted.length===1,'real buttons still submit');submitted=[];}
    if(type==='LOCKED_ANSWERS'){ok(sab.blocks(),'locked answers block');for(const b of grid.querySelectorAll('.sbx-option')){ok(b.disabled,'locked key disabled');b.click();}ok(submitted.length===0,'locked keys never submit');ok(sab.active().panelOpen,'lock removal opens itself');
      const wrong=[...screen.querySelectorAll('.sbx-sab-key')].find(b=>b.textContent==='8');wrong.click();ok((sab.active().progress.i||0)===0,'wrong lock input resets');}
    if(type==='MAGNETIC_BUTTONS'){await sleep(700);const r=[...grid.children].map(b=>b.getBoundingClientRect()),gr=grid.getBoundingClientRect();
      for(let i=0;i<r.length;i++){const b=grid.children[i],[tx,ty]=(b.style.translate||'0px 0px').split(' ').map(parseFloat),s=parseFloat(b.style.scale);ok(Math.abs(tx)<=b.offsetWidth*(1-s)/2+.5&&Math.abs(ty||0)<=b.offsetHeight*(1-s)/2+.5,'magnetic key stays inside its own cell');for(let j=i+1;j<r.length;j++)ok(r[i].right<=r[j].left||r[j].right<=r[i].left||r[i].bottom<=r[j].top||r[j].bottom<=r[i].top,'magnetic keys never overlap');}
      const moved=[...grid.children].some(b=>b.style.translate&&b.style.translate!=='0px 0px'&&b.style.translate!=='0px');ok(moved,'magnetic keys drift');grid.children[0].click();ok(submitted.length===1,'a drifting key still answers');submitted=[];}
    if(type==='NUMBER_HUNT'){await sleep(50);const nums=[...screen.querySelectorAll('.sbx-sab-num')];ok(nums.length===7,'seven numbers');
      nums.find(b=>b.textContent==='1').click();nums.find(b=>b.textContent==='2').click();nums.find(b=>b.textContent==='5').click();
      ok(sab.active().progress.found===1,'a wrong number steps back by one');ok(!nums.find(b=>b.textContent==='2').classList.contains('gone'),'the stepped-back number reappears');}
    if(type==='SCREEN_GLITCH')ok(screen.classList.contains('sab-glitch'),'glitch layer on');
    // a question change mid-removal keeps the virus and its progress
    grid=question();sab.decorate(grid);ok(sab.active().id===id,type+' survives a question change');
    for(let i=0;i<120&&!sent.length;i++){sab.autoStep();await sleep(type==='POPUP_STORM'?140:40);}
    ok(sent.length===1,type+' removal submitted');ok(submitted.length===0,type+' removal taps never answered the question');
    const want=expected[type],got=sent[0].answer;ok(want?JSON.stringify(got)===JSON.stringify(want):JSON.stringify([...got].sort())===JSON.stringify(sets[type]),type+' removal answer '+JSON.stringify(got));
    sab.sync({infectionId:id,type,questionsLeft:3,data:{...data,seed:11}});ok(sent.length===1,type+' no duplicate removal');
    sab.sync(null);
    ok(!screen.classList.contains('sab-infected')&&!screen.classList.contains('sab-glitch'),type+' screen classes cleared');
    ok(!body.querySelector('.sbx-ghost,.sbx-sab-bug,.sbx-sab-lock,.sbx-sab-warn,.sbx-sab-banner'),type+' question restored');
    ok([...grid.querySelectorAll('.sbx-option')].every(b=>!b.disabled&&!b.style.scale&&!b.style.translate),type+' keys restored');
    ok(!screen.querySelector('.sbx-sab-panel,.sbx-sab-overlay'),type+' panel and overlay removed');
    ok(!sab.blocks(),type+' unblocked');
    await sleep(1300);
  }
  // an expired infection cleans up the same way, and dispose() stops everything
  sab.sync({infectionId:'x',type:'MAGNETIC_BUTTONS',questionsLeft:1,data:{indicators:['m0'],seed:3}});sab.decorate(question());sab.dispose();
  ok(!screen.querySelector('.sbx-sab-dot')&&!sab.active(),'dispose clears');
  return log;
}
(async()=>{
  let tabs;for(let i=0;i<60;i++){try{tabs=await (await fetch(`http://127.0.0.1:${port}/json`)).json();break;}catch{await sleep(200);}}
  const t=tabs.find(x=>x.type==='page');const ws=new WebSocket(t.webSocketDebuggerUrl);let id=0;const wait={};const errors=[];
  ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails.exception?.description||m.params.exceptionDetails.text);if(wait[m.id]){wait[m.id](m);delete wait[m.id];}};
  const call=(method,params={})=>new Promise(r=>{const i=++id;wait[i]=r;ws.send(JSON.stringify({id:i,method,params}));});
  await new Promise(r=>ws.onopen=r);await call('Runtime.enable');await call('Page.enable');await call('Page.navigate',{url:'file://'+page});await sleep(800);
  const r=await call('Runtime.evaluate',{expression:'('+suite.toString()+')()',awaitPromise:true,returnByValue:true});
  proc.kill();
  if(r.result?.exceptionDetails){console.error('FAIL',r.result.exceptionDetails.exception?.description);process.exit(1);}
  assert.deepEqual(errors,[],'page errors');const lines=r.result.result.value;console.log(lines.length+' checks passed');process.exit(0);
})().catch(e=>{proc.kill();console.error(e);process.exit(1);});
