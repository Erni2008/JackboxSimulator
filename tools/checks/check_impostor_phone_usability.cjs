'use strict';
process.chdir(require('node:path').resolve(__dirname,'../..'));
const fs=require('node:fs'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
(async()=>{
 const ready=JSON.parse(fs.readFileSync('server/build/impostor-browser/ready.json'));
 const browser=await chromium.launch();
 try{
  const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(ready.url);
  await page.evaluate(()=>{
   document.querySelectorAll('.screen').forEach(e=>e.hidden=true);document.getElementById('impostor-screen').hidden=false;
   window.phoneTime=100000;window.phoneMessages=[];
   window.phoneState={selfId:'a',code:'ABCDEF',impostorSettings:{roundCount:3,reducedMotion:true},impostor:{sessionId:'phone-qa',round:1,phase:'ROUND_CLUE_INPUT',deadline:190000,activeParticipant:true,role:'ORDINARY',secretWord:'ЯБЛОКО',participants:[{id:'a',name:'Алиса'},{id:'b',name:'Борис'},{id:'c',name:'ОченьДлинноеИмяИгрока'}]}};
   const options={getState:()=>phoneState,isAuthenticated:()=>true,send:(type,payload,id)=>phoneMessages.push({type,payload,id}),now:()=>phoneTime,makeId:()=>crypto.randomUUID(),explain:()=>''};
   window.phoneClue=createImpostorController(options);window.phoneVote=createFinalVotingController(options);window.phoneSuspicion=createSuspicionController(options);
   renderControllerPresentation(phoneState);phoneClue.render();
  });
  assert.equal(await page.locator('#impostor-countdown').textContent(),'ОСТАЛОСЬ: 01:30');
  assert(await page.locator('#clue-submit').isDisabled());
  assert.notEqual(await page.evaluate(()=>document.activeElement.id),'clue-input','Mobile keyboard stays closed until the player taps');
  await page.locator('#clue-input').fill('два слова');await page.locator('#clue-submit').click();
  assert.equal(await page.locator('#clue-input').getAttribute('aria-invalid'),'true');
  assert.equal(await page.evaluate(()=>phoneMessages.filter(m=>m.type==='SUBMIT_CLUE').length),0,'Local invalid input must not consume a server attempt');
  await page.locator('#clue-input').fill('  АБВГДЕЖЗИК  ');
  assert.equal(await page.locator('#clue-input').inputValue(),'АБВГДЕЖЗИК','Outer spaces must not truncate a ten-letter clue');
  await page.locator('#clue-input').fill('  ЛЕТО  ');
  assert.equal(await page.locator('#clue-input').getAttribute('aria-invalid'),null);
  await page.screenshot({path:'server/build/impostor-browser/phone-clue-usability-390.png',fullPage:true});
  await page.locator('#clue-submit').click();
  assert.equal(await page.evaluate(()=>phoneMessages.find(m=>m.type==='SUBMIT_CLUE').payload.clue),'ЛЕТО');
  assert.equal(await page.locator('#clue-submit svg').count(),3,'Sending label preserves the original button artwork');
  assert(await page.locator('#clue-submit').isDisabled());
  await page.evaluate(()=>{phoneState.impostor.phase='PRELIMINARY_SUSPICION';phoneState.impostor.eligible=true;phoneState.impostor.submittedCount=0;phoneState.impostor.eligibleCount=3;phoneClue.render();document.getElementById('impostor-screen').hidden=true;document.getElementById('suspicion-screen').hidden=false;phoneSuspicion.render();});
  const target=page.locator('#suspect-cards [data-id=b]');await target.focus();await page.evaluate(()=>phoneSuspicion.render());
  assert.equal(await page.evaluate(()=>document.activeElement.dataset.id),'b','Snapshot refresh preserves suspicion keyboard focus');
  await page.evaluate(()=>{phoneState.impostor.phase='FINAL_VOTING';phoneState.impostor.deadline=220000;phoneState.impostor.finalSubmittedCount=0;phoneState.impostor.finalEligibleCount=3;document.getElementById('suspicion-screen').hidden=true;document.getElementById('final-screen').hidden=false;renderControllerPresentation(phoneState);phoneVote.render();});
  assert.equal(await page.locator('#final-timer').textContent(),'ОСТАЛОСЬ: 02:00');
  await page.locator('#final-cards [data-id=b]').click();assert.equal(await page.locator('#vote-draft-name').textContent(),'Борис');
  assert.equal(await page.evaluate(()=>phoneMessages.filter(m=>m.type==='SUBMIT_FINAL_VOTE').length),0,'Selection alone never casts a final vote');
  for(const width of [320,390,844]){
   await page.setViewportSize({width,height:width===844?390:844});
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'No horizontal overflow at '+width);
   await page.screenshot({path:`server/build/impostor-browser/phone-usability-${width}.png`,fullPage:true});
  }
  await page.locator('#confirm-vote').click();assert.equal(await page.evaluate(()=>phoneMessages.filter(m=>m.type==='SUBMIT_FINAL_VOTE').length),1);
  assert.equal(await page.locator('#confirm-vote svg').count(),3);
  await page.evaluate(()=>{phoneState.impostor.finalVoteSubmitted=true;phoneState.impostor.ownFinalVote='b';phoneVote.render();});
  assert.equal(await page.locator('#final-screen').getAttribute('aria-busy'),'false');
  assert.equal(await page.locator('#vote-receipt-value').textContent(),'');assert(await page.locator('#vote-draft').isHidden(),'Accepted votes clear the private selection before blackout');
  assert.deepEqual(errors,[]);console.log('PASS: mobile timers, input validation, trimmed clues, artwork, explicit vote confirmation, focus retention, blackout cleanup and 320/390/844 layouts');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
