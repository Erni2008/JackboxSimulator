process.chdir(require('node:path').resolve(__dirname, '../..'));
'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),vm=require('node:vm');
const context=vm.createContext({});vm.runInContext(fs.readFileSync('web/controller-presentation.js','utf8'),context);
const view=state=>context.controllerPresentation(state);
assert.equal(view(null),null);
for(const role of ['HIDING','SHOOTING'])for(const phase of ['HIDING_SELECTION','SHOOTING','ELIMINATION','REVEALING','FINISHED']){
  const s={cursedBoxes:{role,phase,canAct:role==='SHOOTING'&&phase==='SHOOTING',hidingBoxId:14,hiddenAssignments:'MUST NEVER RENDER'}};
  const v=view(s);assert(!JSON.stringify(v).includes('MUST NEVER RENDER'));assert(!JSON.stringify(v).includes('14'));
  assert.equal(v.step,phase==='HIDING_SELECTION'?0:phase==='SHOOTING'?1:2);
}
assert.match(view({cursedBoxes:{phase:'HIDING_SELECTION',role:'HIDING',hidingConfirmed:true}}).note,/locked/);
for(const phase of ['ROLE_REVEAL','ROUND_CLUE_INPUT','PRELIMINARY_SUSPICION','FINAL_VOTING']){
  const s={impostor:{phase,role:'IMPOSTOR',secretWord:'DO_NOT_COPY',activeParticipant:true,finalPhaseStartedAt:phase==='FINAL_VOTING'?1:0}};
  assert(!JSON.stringify(view(s)).includes('DO_NOT_COPY'));
}
assert.equal(view({impostor:{phase:'READY'}}),null);
assert.equal(view({impostor:{phase:'REPLAY_PREPARATION'}}),null);
assert.equal(view({impostor:{phase:'ROUND_CLUE_INPUT',clueSubmitted:true}}).tone,'confirmed');
const question=(overrides={})=>({phase:'ANSWERING',deadline:30000,answeringStartedAt:10000,question:{answers:['ONE','TWO']},...overrides});
assert.equal(context.questionPresentation(question({currentAnswer:0}),12000).receipt,'');
assert.equal(context.questionPresentation(question({currentAnswer:0,hasSubmittedAnswer:true}),12000).receipt,'01 · ONE');
assert.equal(context.questionPresentation(question({currentAnswer:2,hasSubmittedAnswer:true}),12000).receipt,'');
assert.equal(context.questionPresentation(question({currentAnswer:0,hasSubmittedAnswer:true,phase:'RESULTS'}),12000).receipt,'');
for(const fps of [30,60,144])for(let t=10000;t<=31000;t+=1000/fps){const v=context.questionPresentation(question(),t);assert(v.fraction>=0&&v.fraction<=1);assert.equal(v.urgent,t<30000&&t>=25000);}
assert.equal(context.questionPresentation(question(),31000).remaining,0);
assert.equal(context.questionPresentation(question({phase:'QUESTION_PRESENTATION'}),12000).urgent,false);
assert.equal(context.questionPresentation(question({deadline:NaN}),12000).remaining,0);
console.log('PASS: authoritative answer receipts, invalid indices, deadline expiry and 30/60/144 FPS clock');
console.log('PASS: stage order, private selections/words excluded, confirmed states, reset and spectators');
if(!process.env.CONTROLLER_URL)process.exit(0);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||undefined});
 const output='generated/controller-polish';fs.mkdirSync(output,{recursive:true});const errors=[],reports=[];
 try{
 const page=await browser.newPage({isMobile:true,hasTouch:true});page.on('pageerror',e=>errors.push(e.message));
 await page.goto(process.env.CONTROLLER_URL);await page.evaluate(()=>document.fonts.ready);
 const cases=[
 {name:'cursed-hide',screen:'cursed',root:{cursedBoxes:{phase:'HIDING_SELECTION',role:'HIDING',canAct:true,hidingConfirmed:false,hostReady:true,shotsRemaining:0,shotLimit:0,hidingBoxId:-1}}},
 {name:'cursed-confirmed',screen:'cursed',root:{cursedBoxes:{phase:'HIDING_SELECTION',role:'HIDING',canAct:false,hidingConfirmed:true,hostReady:true,shotsRemaining:0,shotLimit:0,hidingBoxId:6}}},
 {name:'cursed-shot',screen:'cursed',root:{cursedBoxes:{phase:'SHOOTING',role:'SHOOTING',canAct:true,hostReady:true,shotsRemaining:1,shotLimit:1,selectedCrateId:4,activePlayerName:'ОченьДлинныйНикИгрока'}}},
 {name:'cursed-ghost',screen:'cursed',root:{cursedBoxes:{phase:'FINISHED',role:'HIDING',canAct:false,hostReady:true,shotsRemaining:0,shotLimit:0,survivorCount:0,hidingBoxId:5,outcomes:[{playerId:'self',survived:false,lifeState:'GHOST',canReturn:true}]}}},
 {name:'ghost-waiting',screen:'ghost',root:{phase:'QUESTION_PRESENTATION',gameId:'visual',questionNumber:3,questionCount:5,players:[{id:'self',name:'SHADOW',characterId:'ghost',isGhost:true,lifeState:'GHOST',isAlive:false,canReturn:true}],question:{id:'spectator',text:'The living players are answering this question.',answers:['One','Two','Three','Four']}}},
 {name:'impostor-role',screen:'impostor',root:{impostor:{phase:'ROLE_REVEAL',role:'ORDINARY',secretWord:'ПОДСОЛНУХ',activeParticipant:true,round:0}}},
 {name:'impostor-clue',screen:'impostor',root:{impostor:{phase:'ROUND_CLUE_INPUT',role:'IMPOSTOR',activeParticipant:true,round:1}}},
 {name:'impostor-confirmed',screen:'impostor',root:{impostor:{phase:'ROUND_CLUE_INPUT',role:'ORDINARY',clueSubmitted:true,ownClue:'ТЕПЛО',secretWord:'СОЛНЦЕ',activeParticipant:true,round:1}}},
 {name:'vote-choice',screen:'final',root:{impostor:{phase:'FINAL_VOTING',finalPhaseStartedAt:1,activeParticipant:true,participants:[{id:'self',name:'YOU'},{id:'other',name:'ОченьДлинныйНикИгрока'},{id:'third',name:'SHADOW'}]}}},
 {name:'vote-accepted',screen:'final',root:{impostor:{phase:'FINAL_VOTING',finalPhaseStartedAt:1,activeParticipant:true,finalVoteSubmitted:true,ownFinalVote:'other',participants:[{id:'self',name:'YOU'},{id:'other',name:'ОченьДлинныйНикИгрока'}]}}},
 {name:'question-open',screen:'question',root:{phase:'ANSWERING',gameId:'visual',hasSubmittedAnswer:false,questionNumber:2,questionCount:5,question:{id:'open',text:'Which answer will keep you alive?',answers:['A short first choice','Длинный вариант ответа, который должен оставаться читаемым на небольшом телефоне','A third possibility','The final answer']}}},
 {name:'lobby-guests',screen:'waiting',root:{phase:'LOBBY',name:'The midnight show',maxPlayers:8,players:[{id:'self',name:'ОченьДлинныйНикИгрока',characterId:'puppeteer',connectionStatus:'ONLINE'},{id:'friend',name:'SHADOW',connectionStatus:'ONLINE'},{id:'offline',name:'NYX',connectionStatus:'OFFLINE'}]}},
 {name:'question-accepted',screen:'question',root:{phase:'ANSWERING',gameId:'visual',hasSubmittedAnswer:true,currentAnswer:1,questionNumber:2,questionCount:5,question:{id:'two',text:'Which answer will keep you alive?',answers:['A long first choice','Подтверждённый ответ игрока','A third choice','The final possibility']}}},
 {name:'question-result',screen:'result',root:{phase:'RESULTS',questionNumber:2,questionCount:5,results:[{playerId:'self',answeredInTime:true,isCorrect:false}],question:{correctAnswerIndex:1,answers:['First choice','The correct answer']} }}
 ];
 for(const size of [{width:320,height:568},{width:390,height:844},{width:844,height:390}]){
 await page.setViewportSize(size);
 for(const sample of cases){
 await page.evaluate(({screen,root})=>{
  const now=Date.now();window.visualState={...root,players:root.players||[{id:'self',name:'ОченьДлинныйНикИгрока',nickname:'ОченьДлинныйНикИгрока',characterId:'puppeteer'}],selfId:'self',code:'ABCDEF',hostConnected:true,impostorSettings:{roundCount:3,reducedMotion:true}};
  if(root.cursedBoxes)Object.assign(visualState.cursedBoxes,{sessionId:'visual',turnId:'one',boxes:Array.from({length:16},(_,id)=>({id,state:'AVAILABLE'}))});
  if(root.impostor)Object.assign(visualState.impostor,{sessionId:'visual',deadline:now+20000,roleRevealDurationMillis:20000,finalEligibleCount:3,finalSubmittedCount:root.impostor.finalVoteSubmitted?1:0});
  document.querySelectorAll('.screen').forEach(s=>s.hidden=s.id!==screen+'-screen');document.body.dataset.view=screen;document.body.dataset.controller=screen==='cursed'?'cursed':'';document.body.dataset.reducedMotion='true';
  renderControllerPresentation(visualState);
  const options={getState:()=>visualState,isAuthenticated:()=>true,send:()=>{throw Error('Visual render sent network input');},now:()=>now,makeId:()=>'',explain:()=>''};
  if(!window.visualCursed){document.getElementById('cursed-grid').replaceChildren();window.visualCursed=createCursedBoxesController(options);window.visualImpostor=createImpostorController(options);window.visualFinal=createFinalVotingController(options);}
  if(screen==='cursed')visualCursed.render();
  else if(screen==='impostor')visualImpostor.render();
  else if(screen==='final'){
   visualFinal.render();
   const target=document.querySelector('#final-cards [data-id=other]');
   if(target&&!target.disabled){target.focus();visualFinal.render();if(document.activeElement.dataset.id!=='other')throw Error('Final card focus was lost');document.querySelector('#final-cards [data-id=other]').click();if(document.getElementById('vote-draft').hidden||document.getElementById('vote-draft-name').textContent!=='ОченьДлинныйНикИгрока')throw Error('Vote draft missing');if(!document.getElementById('vote-receipt').hidden)throw Error('Draft shown as an accepted vote');}
   if(!!visualState.impostor.finalVoteSubmitted===document.getElementById('vote-receipt').hidden)throw Error('Vote receipt was not authoritative');
  }else{
   state=visualState;authenticated=true;serverTime=now;receivedAt=performance.now();
   if(screen==='question'){state.answeringStartedAt=now-15000;state.deadline=now+4000;}
   render();
   if(screen==='question'&&document.getElementById('answer-receipt').hidden===!!visualState.hasSubmittedAnswer)throw Error('Answer receipt state incorrect');
   if(screen==='waiting'&&(document.querySelectorAll('.guest-you').length!==1||document.querySelector('[data-connection=OFFLINE] .guest-connection').textContent!=='RECONNECTING'))throw Error('Guest states missing');
  }
 },sample);
 await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(100);
 if(sample.name==='question-open')assert((await page.locator('#answers .fa-label').first().evaluate(node=>getComputedStyle(node).fontFamily)).includes('Body'),'Answer text must use the reading face');
 const geometry=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,steps:document.querySelectorAll('.director-step[aria-current=step]').length,directorVisible:!document.getElementById('controller-director').hidden,buttons:[...document.querySelectorAll('#cursed-screen:not([hidden]) .cursed-box')].map(b=>({width:b.getBoundingClientRect().width,height:b.getBoundingClientRect().height}))}));
 assert(geometry.scroll<=geometry.width,`${sample.name}: horizontal overflow at ${size.width}`);if(!['question','result','waiting','ghost'].includes(sample.screen)){assert.equal(geometry.steps,1);assert(geometry.directorVisible);}else assert(!geometry.directorVisible);
 for(const b of geometry.buttons){assert(b.width>=44&&b.height>=38,'Crate target too small');}
 const file=`${output}/${sample.name}-${size.width}.png`;await page.screenshot({path:file,fullPage:true});reports.push({name:sample.name,...size,file});
 }
 }
 await page.evaluate(()=>{renderControllerPresentation({impostor:{phase:'ROLE_REVEAL'}});show('disconnected');if(!document.getElementById('controller-director').hidden||document.body.dataset.mode)throw Error('Game header survived disconnect');show('join');if(document.body.dataset.view!=='join')throw Error('Join view was not restored');});
 assert.deepEqual(errors,[]);fs.writeFileSync(output+'/report.json',JSON.stringify({passed:true,reports,errors,physicalDevices:false},null,2));
 console.log(`PASS: ${reports.length} mobile/landscape captures, no horizontal overflow, one current step, bounded controls, no browser errors`);
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
