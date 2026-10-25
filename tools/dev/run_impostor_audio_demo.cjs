'use strict';
/* Real-time, real server + visible phones + native host. No production game rules are replaced. */
process.chdir(require('node:path').resolve(__dirname,'../..'));
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const dir=path.resolve('server/build/impostor-browser'),sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function command(command,extra={}){
 const id=crypto.randomUUID(),file=path.join(dir,'control.json');fs.writeFileSync(file+'.tmp',JSON.stringify({id,command,...extra}));fs.renameSync(file+'.tmp',file);
 for(let i=0;i<200;i++){try{if(JSON.parse(fs.readFileSync(path.join(dir,'processed.json'))).id===id)return;}catch{}await sleep(25);}throw Error('Fixture did not accept '+command);
}
(async()=>{
 let ready;for(let i=0;i<300;i++){try{const candidate=JSON.parse(fs.readFileSync(path.join(dir,'ready.json')));if((await fetch(candidate.url+'/rooms/'+candidate.code)).ok){ready=candidate;break;}}catch{}await sleep(100);}assert(ready,'Live fixture did not become ready');
 const browser=await chromium.launch({headless:false,executablePath:process.env.CHROME_PATH||undefined,args:['--window-size=460,930','--window-position=1000,30']});
 const context=await browser.newContext({viewport:{width:390,height:780},hasTouch:true,isMobile:true}),players=[],errors=[];
 try{
  for(const [name,characterId] of [['SHADOW','ghost'],['NYX','dracula'],['KRONOS','plague_doctor'],['VESPER','puppeteer'],['OBSERVER','skeleton']]){
   const page=await context.newPage();page.setDefaultTimeout(60000);page.on('pageerror',error=>errors.push(error.message));await page.goto(ready.url+'/?room='+ready.code);
   await page.locator('#nickname').fill(name);await page.locator('#character').selectOption(characterId);
   const joined=page.waitForResponse(response=>response.url().endsWith('/join')&&response.request().method()==='POST');await page.locator('#join-button').click();const identity=await(await joined).json();
   await page.locator('#waiting-screen').waitFor({state:'visible'});players.push({page,id:identity.selfId,name});
  }
  const marker=path.join(dir,'native-ready.json');
  for(let attempt=0;attempt<1200&&!fs.existsSync(marker);attempt++)await sleep(100);
  assert(fs.existsSync(marker),'Native host did not finish its opening');
  fs.mkdirSync('generated/impostor-full-run',{recursive:true});
  await command('start-game' ,{activeIds:players.slice(0,4).map(player=>player.id)});
  for(const player of players)await player.page.waitForFunction(()=>state?.impostor?.phase==='ROLE_REVEAL');
  const role=await Promise.all(players.map(player=>player.page.evaluate(()=>state.impostor.role))),impostor=role.indexOf('IMPOSTOR');assert(impostor>=0);
  await players[impostor].page.bringToFront();await players[impostor].page.waitForFunction(()=>impostorPhoneAudio.playCount('role')===1);
  console.log('DEMO RUNNING: four active players + one observer, real-time clocks, native shared screen and private phone audio.');
  const clues=[['ТЕПЛО','СВЕТ','НЕБО','ДОРОГА'],['СОЛНЦЕ','ЛАМПА','ВЕТЕР','ДВИЖЕНИЕ'],['ЛЕТО','ЛУНА','ПОЛЁТ','СКОРОСТЬ']];
  for(let round=1;round<=3;round++){
   for(const player of players.slice(0,4))await player.page.waitForFunction(round=>state?.impostor?.phase==='ROUND_CLUE_INPUT'&&state.impostor.round===round&&!document.getElementById('clue-input').disabled,round);
   for(let i=0;i<4;i++){if(i===3)await players[i].page.waitForFunction(()=>state.impostor.deadline-now()<=4500);const page=players[i].page;await page.bringToFront();await page.locator('#clue-input').pressSequentially(clues[round-1][i],{delay:70});await sleep(260);await page.locator('#clue-submit').click();await page.waitForFunction(()=>state?.impostor?.clueSubmitted||state?.impostor?.phase!=='ROUND_CLUE_INPUT');await sleep(350);}
   await players[4].page.waitForFunction(()=>state?.impostor?.phase==='PRELIMINARY_SUSPICION');
   await players[4].page.locator(`[data-id="${players[0].id}"]`).click();
   for(const player of players.slice(0,4))assert(await player.page.evaluate(()=>impostorPhoneAudio.playCount('writing'))>=round,'Writing cue missing in a repeated clue round');
   console.log('Round '+round+': clues and paper flips complete; live suspicion countdown.');
  }
  await players[0].page.waitForFunction(()=>state?.impostor?.phase==='EVIDENCE_REVIEW');console.log('Discussion: real countdown and moving clock hand.');
  await players[0].page.waitForFunction(()=>state?.impostor?.phase==='FINAL_VOTING');
  await sleep(4500);
  for(let i=0;i<4;i++){
   const page=players[i].page,target=players[i===impostor?(impostor+1)%4:impostor].id;
   await page.bringToFront();await page.locator(`#final-cards [data-id="${target}"]`).click();await page.locator('#confirm-vote').click();await page.waitForFunction(()=>impostorPhoneAudio.playCount('vote')===1);await sleep(1250);
  }
  console.log('Votes accepted: four personal confirmations; the host stamps each vote at contact.');
  await players[0].page.waitForFunction(()=>state?.impostor?.phase==='RESULT');
  await sleep(10500);
  for(let i=0;i<players.length;i++)assert.equal(await players[i].page.evaluate(()=>impostorPhoneAudio.playCount('role')),i===impostor?1:0);
  for(let i=0;i<players.length;i++)await players[i].page.screenshot({path:`generated/impostor-full-run/player-${i+1}-final.png`,fullPage:true});
  const hostReport=JSON.parse(fs.readFileSync('generated/impostor-full-run/host-report.json'));
  for(const id of ['impostor_intro','impostor_round_1','impostor_round_2','impostor_round_3','impostor_discussion','impostor_final_voting','impostor_vote_intro_1','impostor_vote_intro_2','impostor_vote_reveal_intro','impostor_outcome_caught'])assert.equal(hostReport.voicePlayCounts[id],1,id+' must play exactly once');
  assert.equal(hostReport.voicePlayCounts.impostor_vote_first||0,0);assert.equal(hostReport.voicePlayCounts.impostor_vote_second||0,0);
  assert.equal(hostReport.voicePlayCounts.impostor_suspicion,3);assert.equal(hostReport.voicePlayCounts.impostor_round_deadline,3);
  assert.deepEqual(errors,[]);
  fs.writeFileSync(path.join(dir,'audio-demo-report.json'),JSON.stringify({passed:true,players:4,observers:1,privateRoleOnOnePhone:true,acceptedVoteSounds:4,realTime:true,browserErrors:errors},null,2));
  console.log('DEMO COMPLETE: all sounds exercised. Windows remain open; close the browser or create demo-close.json to finish.');
  while(browser.isConnected()&&!fs.existsSync(path.join(dir,'demo-close.json')))await sleep(1000);
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
