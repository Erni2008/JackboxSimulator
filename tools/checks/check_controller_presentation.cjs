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
assert.equal(view({impostor:{phase:'FINAL_VOTING',finalPhaseStartedAt:0}}).step,2,'Final guide follows the authoritative phase, including a zero timestamp');
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
assert.equal(context.questionInteraction(question(),12000).kind,'ready');
assert.equal(context.questionInteraction(question(),12000,0).kind,'sending');
assert.equal(context.questionInteraction(question(),31000,0).kind,'sending','Pending does not fabricate rejection at deadline');
assert.equal(context.questionInteraction(question(),31000).kind,'closed');
assert.equal(context.questionInteraction(question({phase:'QUESTION_PRESENTATION'}),12000).kind,'waiting');
assert.equal(context.questionInteraction(question({hasSubmittedAnswer:true,currentAnswer:0}),31000).kind,'accepted','Accepted answer remains accepted after deadline');
assert.equal(context.questionInteraction(question({hasSubmittedAnswer:true,currentAnswer:9}),12000).kind,'ready','Invalid index never produces acceptance');
const rankings={phase:'GAME_FINISHED',players:[{id:'b',name:'B',score:100,isGhost:true},{id:'a',name:'A',score:100},{id:'c',name:'C',score:50},{id:'host',host:true,score:999}]};
assert.equal(context.finalStandings({...rankings,phase:'ANSWERING'}).length,0,'No early score ranking');
assert.equal(JSON.stringify(context.finalStandings(rankings).map(p=>[p.id,p.rank])),JSON.stringify([['a',1],['b',1],['c',3]]),'Stable tied ranks include ghosts and exclude host');
assert.equal(rankings.players[0].id,'b','Ranking does not mutate snapshot');
for(const phase of ['VOTING_LOCKED','FINAL_VOTE_REVEAL','SUSPECT_ANNOUNCEMENT','IMPOSTOR_REVEAL','RESULT'])assert(context.impostorPhoneBlackout({impostor:{phase}}));
assert(!context.impostorPhoneBlackout({impostor:{phase:'ROLE_REVEAL'}}));assert(!context.impostorPhoneBlackout({impostor:{phase:'FINAL_VOTING',finalVoteSubmitted:false}}));assert(context.impostorPhoneBlackout({impostor:{phase:'FINAL_VOTING',finalVoteSubmitted:true}}));
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
 {name:'join-welcome',screen:'join',root:{}},
 {name:'cursed-hide',screen:'cursed',root:{cursedBoxes:{phase:'HIDING_SELECTION',role:'HIDING',canAct:true,hidingConfirmed:false,hostReady:true,shotsRemaining:0,shotLimit:0,hidingBoxId:-1}}},
 {name:'cursed-confirmed',screen:'cursed',root:{cursedBoxes:{phase:'HIDING_SELECTION',role:'HIDING',canAct:false,hidingConfirmed:true,hostReady:true,shotsRemaining:0,shotLimit:0,hidingBoxId:6}}},
 {name:'cursed-shot',screen:'cursed',root:{cursedBoxes:{phase:'SHOOTING',role:'SHOOTING',canAct:true,hostReady:true,shotsRemaining:1,shotLimit:1,selectedCrateId:4,activePlayerName:'ОченьДлинныйНикИгрока'}}},
 {name:'cursed-secret-target',screen:'cursed',root:{players:[{id:'self',name:'SHADOW',characterId:'ghost',isGhost:true,lifeState:'GHOST'}],cursedBoxes:{phase:'TARGET_SELECTION',role:'SHOOTING',groupedTargets:true,targetConfirmed:false,confirmedTargetCount:1,targetPlayerCount:3,canAct:true,hostReady:true,shotsRemaining:1,shotLimit:1,selectedCrateId:5}}},
 {name:'cursed-target-locked',screen:'cursed',root:{cursedBoxes:{phase:'TARGET_SELECTION',role:'SHOOTING',groupedTargets:true,targetConfirmed:true,confirmedTargetCount:2,targetPlayerCount:3,canAct:false,hostReady:true,shotsRemaining:0,shotLimit:1,selectedCrateId:5}}},
 {name:'cursed-spectator',screen:'cursed',root:{cursedBoxes:{phase:'SHOOTING',role:'SPECTATOR',canAct:false,hostReady:true,shotsRemaining:0,shotLimit:1,selectedCrateId:-1,activePlayerName:'NYX'}}},
 {name:'cursed-ghost',screen:'cursed',root:{cursedBoxes:{phase:'FINISHED',role:'HIDING',canAct:false,hostReady:true,shotsRemaining:0,shotLimit:0,survivorCount:0,hidingBoxId:5,outcomes:[{playerId:'self',survived:false,lifeState:'GHOST',canReturn:true}]}}},
 {name:'ghost-waiting',screen:'question',root:{phase:'QUESTION_PRESENTATION',gameId:'visual',questionNumber:3,questionCount:5,players:[{id:'self',name:'SHADOW',characterId:'ghost',isGhost:true,lifeState:'GHOST',isAlive:false,canReturn:true},...Array.from({length:7},(_,i)=>({id:'friend'+i,name:i===0?'ОченьДлинныйНикИгрока':'PLAYER '+i,lifeState:i<2?'GHOST':'ALIVE',connectionStatus:'ONLINE'}))],question:{id:'spectator',text:'Living players and ghosts answer this question together.',answers:['One','Two','Three','Four']}}},
 {name:'ghost-answering',screen:'question',root:{phase:'ANSWERING',gameId:'visual',questionNumber:3,questionCount:5,players:[{id:'self',name:'SHADOW',characterId:'ghost',lifeState:'GHOST',isGhost:true}],question:{id:'ghost-answer',text:'Ghosts are still playing.',answers:['One','Two','Three','Four']}}},
 {name:'impostor-role',screen:'impostor',root:{impostor:{phase:'ROLE_REVEAL',role:'ORDINARY',secretWord:'ПОДСОЛНУХ',activeParticipant:true,round:0}}},
 {name:'impostor-clue',screen:'impostor',root:{impostor:{phase:'ROUND_CLUE_INPUT',role:'IMPOSTOR',activeParticipant:true,round:1}}},
 {name:'impostor-confirmed',screen:'impostor',root:{impostor:{phase:'ROUND_CLUE_INPUT',role:'ORDINARY',clueSubmitted:true,submittedCount:2,eligibleCount:3,ownClue:'ТЕПЛО',secretWord:'СОЛНЦЕ',activeParticipant:true,round:1}}},
 {name:'vote-choice',screen:'final',root:{impostor:{phase:'FINAL_VOTING',finalPhaseStartedAt:1,activeParticipant:true,participants:[{id:'self',name:'YOU'},{id:'other',name:'ОченьДлинныйНикИгрока'},{id:'third',name:'SHADOW'}]}}},
 {name:'vote-accepted',screen:'blackout',root:{impostor:{phase:'FINAL_VOTING',finalPhaseStartedAt:1,activeParticipant:true,finalVoteSubmitted:true,ownFinalVote:'other',participants:[{id:'self',name:'YOU'},{id:'other',name:'ОченьДлинныйНикИгрока'}]}}},
 ...['VOTING_LOCKED','FINAL_VOTE_REVEAL','SUSPECT_ANNOUNCEMENT','IMPOSTOR_REVEAL','RESULT'].map(phase=>({name:'blackout-'+phase.toLowerCase(),screen:'blackout',root:{impostor:{phase,finalPhaseStartedAt:1,participants:[{id:'self',name:'YOU'},{id:'other',name:'SECRET NICK'}],revealedImpostorId:'other',ownFinalVote:'other'}}})),
 {name:'question-sending',screen:'question',root:{phase:'ANSWERING',gameId:'visual',pendingPreview:true,questionNumber:2,questionCount:5,question:{id:'sending',text:'Which answer will keep you alive?',answers:['First choice','Your pending choice','Third choice','Fourth choice']}}},
 {name:'question-expired',screen:'question',root:{phase:'ANSWERING',gameId:'visual',expiredPreview:true,questionNumber:2,questionCount:5,question:{id:'expired',text:'The host is preparing the reveal.',answers:['First choice','Second choice','Third choice','Fourth choice']}}},
 {name:'question-open',screen:'question',root:{phase:'ANSWERING',gameId:'visual',hasSubmittedAnswer:false,questionNumber:2,questionCount:5,question:{id:'open',text:'Which answer will keep you alive?',answers:['A short first choice','Длинный вариант ответа, который должен оставаться читаемым на небольшом телефоне','A third possibility','The final answer']}}},
 {name:'show-finished',screen:'finished',root:{phase:'GAME_FINISHED',finishReason:'COMPLETED',players:Array.from({length:8},(_,i)=>({id:i===0?'self':'p'+i,name:i===0?'ОченьДлинныйНикИгрока':'PLAYER '+i,score:i<2?500:500-i*50,lifeState:i%2?'GHOST':'ALIVE'}))}},
 {name:'show-interrupted',screen:'finished',root:{phase:'GAME_FINISHED',finishReason:'HOST_UNRESPONSIVE',players:[{id:'self',name:'SHADOW',score:100,lifeState:'GHOST'}]}},
 {name:'lobby-guests',screen:'waiting',root:{phase:'LOBBY',name:'The midnight show',maxPlayers:8,players:[{id:'self',name:'ОченьДлинныйНикИгрока',characterId:'puppeteer',connectionStatus:'ONLINE'},{id:'friend',name:'SHADOW',connectionStatus:'ONLINE'},{id:'offline',name:'NYX',connectionStatus:'OFFLINE'}]}},
 {name:'question-accepted',screen:'question',root:{phase:'ANSWERING',gameId:'visual',hasSubmittedAnswer:true,currentAnswer:1,questionNumber:2,questionCount:5,question:{id:'two',text:'Which answer will keep you alive?',answers:['A long first choice','Подтверждённый ответ игрока','A third choice','The final possibility']}}},
 {name:'ghost-result',screen:'result',root:{phase:'RESULTS',questionNumber:3,questionCount:5,players:[{id:'self',name:'SHADOW',lifeState:'GHOST'}],results:[{playerId:'self',answeredInTime:true,isCorrect:true}],question:{correctAnswerIndex:1,answers:['First choice','The correct answer']}}},
 {name:'question-timeout',screen:'result',root:{phase:'RESULTS',questionNumber:2,questionCount:5,results:[{playerId:'self',answeredInTime:false,isCorrect:false}],question:{correctAnswerIndex:1,answers:['First choice','Длинный правильный ответ, который должен оставаться полностью читаемым на маленьком экране']}}},
 {name:'question-result',screen:'result',root:{phase:'RESULTS',questionNumber:2,questionCount:5,results:[{playerId:'self',answeredInTime:true,isCorrect:false}],question:{correctAnswerIndex:1,answers:['First choice','The correct answer']} }}
 ];
 for(const size of [{width:320,height:568},{width:390,height:844},{width:844,height:390}]){
 await page.setViewportSize(size);
 for(const sample of cases){
 await page.evaluate(({screen,root})=>{
  const now=Date.now();window.visualState={...root,players:root.players||[{id:'self',name:'ОченьДлинныйНикИгрока',nickname:'ОченьДлинныйНикИгрока',characterId:'puppeteer'}],selfId:'self',code:'ABCDEF',hostConnected:true,impostorSettings:{roundCount:3,reducedMotion:true}};
  if(root.cursedBoxes)Object.assign(visualState.cursedBoxes,{sessionId:'visual',turnId:'one',boxes:Array.from({length:16},(_,id)=>({id,state:'AVAILABLE'}))});
  if(root.cursedBoxes?.role==='SHOOTING')visualState.cursedBoxes.boxes[1].state='DESTROYED';
  if(root.impostor)Object.assign(visualState.impostor,{sessionId:'visual',deadline:now+20000,roleRevealDurationMillis:20000,finalEligibleCount:3,finalSubmittedCount:root.impostor.finalVoteSubmitted?1:0});
  document.querySelectorAll('.screen').forEach(s=>s.hidden=s.id!==screen+'-screen');document.body.dataset.view=screen;document.body.dataset.controller=screen==='cursed'?'cursed':'';document.body.dataset.reducedMotion='true';
  renderControllerPresentation(visualState);
  const options={getState:()=>visualState,isAuthenticated:()=>true,send:()=>{throw Error('Visual render sent network input');},now:()=>now,makeId:()=>'',explain:()=>''};
  if(!window.visualCursed){document.getElementById('cursed-grid').replaceChildren();window.visualCursed=createCursedBoxesController(options);window.visualImpostor=createImpostorController(options);window.visualFinal=createFinalVotingController(options);}
  if(screen==='join')show('join');
  else if(screen==='cursed')visualCursed.render();
  else if(screen==='impostor')visualImpostor.render();
  else if(screen==='final'){
   visualFinal.render();
   const target=document.querySelector('#final-cards [data-id=other]');
   if(target&&!target.disabled){target.focus();visualFinal.render();if(document.activeElement.dataset.id!=='other')throw Error('Final card focus was lost');document.querySelector('#final-cards [data-id=other]').click();if(document.getElementById('vote-draft').hidden||document.getElementById('vote-draft-name').textContent!=='ОченьДлинныйНикИгрока')throw Error('Vote draft missing');if(!document.getElementById('vote-receipt').hidden)throw Error('Draft shown as an accepted vote');}
   if(!!visualState.impostor.finalVoteSubmitted===document.getElementById('vote-receipt').hidden)throw Error('Vote receipt was not authoritative');
  }else{
   state=visualState;authenticated=true;serverTime=now;receivedAt=performance.now();
   if(screen==='question'){state.answeringStartedAt=now-15000;state.deadline=root.expiredPreview?now-100:now+4000;}
   render();
   if(root.pendingPreview){pending=1;render();}
   if(screen==='question'){const row=document.querySelector('#question-life-roster li');render();if(row!==document.querySelector('#question-life-roster li'))throw Error('Unchanged roster rebuilt on state refresh');}
   if(screen==='question'&&document.getElementById('answer-receipt').hidden===!!visualState.hasSubmittedAnswer)throw Error('Answer receipt state incorrect');
   if(screen==='waiting'&&(document.querySelectorAll('.guest-you').length!==1||document.querySelector('[data-connection=OFFLINE] .guest-connection').textContent!=='RECONNECTING'))throw Error('Guest states missing');
  }
 },sample);
 await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(100);
 if(sample.screen==='question'||sample.screen==='ghost'){const roster=page.locator('#'+sample.screen+'-life-roster');assert(await roster.isVisible());assert.equal(await roster.locator('li').count(),sample.root.players?.filter(p=>!p.host).length||1);}
 if(sample.name==='ghost-waiting'){assert(await page.locator('#question-screen').isVisible());assert(await page.locator('#ghost-screen').isHidden());assert.equal(await page.locator('#answers button').count(),4);assert.equal(await page.locator('#question-life-roster [data-life=ghost]').count(),3);assert(await page.locator('#answers button').first().isDisabled(),'Presentation lock applies to ghosts too');}
 if(sample.screen==='question'||sample.screen==='result'){const card=page.locator('#'+sample.screen+'-life-status');assert(await card.isVisible());const ghost=sample.root.players?.find(p=>p.id==='self')?.lifeState==='GHOST';assert.equal(await card.getAttribute('data-life'),ghost?'ghost':'alive');}
 if(sample.screen==='result'){const outcome=sample.root.results[0];assert.equal(await page.locator('#result-screen').getAttribute('data-outcome'),!outcome.answeredInTime?'timeout':outcome.isCorrect?'correct':'incorrect');assert(await page.locator('.verdict-detail').textContent());assert.equal(await page.locator('.verdict-seal path:visible').count(),1);assert.equal(await page.locator('.verdict-seal').evaluate(el=>getComputedStyle(el).animationName),'none','Reduced motion disables verdict entrance');}
 if(sample.name==='ghost-answering')assert(await page.locator('#answers button').first().isEnabled(),'Ghost can answer during the real answer phase');
 if(sample.screen==='blackout'){assert(await page.locator('#blackout-screen').isVisible());assert.equal((await page.locator('body').innerText()).trim(),'');assert.equal(await page.locator('button:visible').count(),0);assert.equal(await page.locator('body').evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(0, 0, 0)');}
 if(sample.name==='cursed-secret-target'){assert(await page.locator('#cursed-fire').isEnabled());assert.equal(await page.locator('#cursed-fire').textContent(),'CONFIRM TARGET');assert.equal(await page.locator('#cursed-current-player').textContent(),'1 / 3 TARGETS CONFIRMED');assert.equal(await page.locator('#cursed-grid .selected').count(),1);}
 if(sample.name==='cursed-target-locked'){assert(await page.locator('#cursed-fire').isDisabled());assert.equal(await page.locator('#cursed-fire').textContent(),'TARGET LOCKED');}
 if(sample.name==='cursed-spectator'){assert.equal(await page.locator('#cursed-shot-counter').textContent(),'SPECTATING');assert(await page.locator('#cursed-fire').isHidden());assert(await page.locator('#cursed-selected').isHidden());assert(!(await page.locator('#director-note').textContent()).includes('unlock'));assert(await page.locator('#cursed-fire').isDisabled());assert.equal(await page.locator('#cursed-grid button:enabled').count(),0);}
 if(sample.name==='impostor-confirmed'){assert.equal(await page.locator('#clue-confirmed-value').textContent(),'ТЕПЛО');assert.equal(await page.locator('#clue-room-progress').textContent(),'2 / 3 CLUES RECEIVED');}
 if(sample.name==='impostor-clue')assert.equal(await page.locator('#clue-confirmed-value').textContent(),'','No draft appears as confirmed');
 if(sample.name==='cursed-shot'){
   const box=id=>page.locator(`#cursed-grid [data-box="${id}"]`);await box(0).focus();await page.keyboard.press('ArrowRight');assert(await box(2).evaluate(el=>el===document.activeElement),'Skip destroyed box');
   await box(3).focus();await page.keyboard.press('ArrowRight');assert(await box(3).evaluate(el=>el===document.activeElement),'No horizontal row wrap');
   await page.keyboard.press('ArrowDown');assert(await box(7).evaluate(el=>el===document.activeElement));await page.keyboard.press('Home');assert(await box(4).evaluate(el=>el===document.activeElement));await page.keyboard.press('End');assert(await box(7).evaluate(el=>el===document.activeElement));
 }
 if(sample.name==='cursed-ghost'){assert.equal(await page.locator('#cursed-result-title').textContent(),'YOU ARE A GHOST');assert(await page.locator('#cursed-fire').isDisabled());}
 if(sample.screen==='join'){assert.equal(await page.locator('.join-steps li').count(),3);assert(await page.locator('#join-form').isVisible());}
 if(sample.screen==='finished'){assert.equal(await page.locator('#final-standings li').count(),sample.root.players.length);assert.equal(await page.locator('#final-standings .is-self').count(),1);assert.equal(await page.locator('#final-standings .standing-rank').first().textContent(),'01');}
 if(sample.name==='lobby-guests'){assert.equal(await page.locator('#room-connected').textContent(),'2 / 3 CONNECTED');assert.equal(await page.locator('#room-capacity').getAttribute('value'),'3');}
 if(sample.name==='question-sending'){assert.equal(await page.locator('#question-screen').getAttribute('data-interaction'),'sending');assert.equal(await page.locator('#answers').getAttribute('aria-busy'),'true');assert(await page.locator('#answer-receipt').isHidden());assert.equal(await page.locator('#answers button:enabled').count(),0);}
 if(sample.name==='question-expired'){assert.equal(await page.locator('#question-screen').getAttribute('data-interaction'),'closed');assert.equal(await page.locator('#answers button:enabled').count(),0);}
 if(sample.name==='question-open')assert((await page.locator('#answers .fa-label').first().evaluate(node=>getComputedStyle(node).fontFamily)).includes('Body'),'Answer text must use the reading face');
 if(sample.name==='question-open'){await page.locator('#answers button').first().focus();await page.evaluate(()=>render());assert(await page.locator('#answers button').first().evaluate(el=>el===document.activeElement),'Network refresh preserves keyboard focus');}
 const geometry=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,steps:document.querySelectorAll('.director-step[aria-current=step]').length,directorVisible:!document.getElementById('controller-director').hidden,buttons:[...document.querySelectorAll('#cursed-screen:not([hidden]) .cursed-box')].map(b=>({width:b.getBoundingClientRect().width,height:b.getBoundingClientRect().height}))}));
 assert(geometry.scroll<=geometry.width,`${sample.name}: horizontal overflow at ${size.width}`);if(!['question','result','waiting','ghost','finished','join','blackout'].includes(sample.screen)){assert.equal(geometry.steps,1);assert(geometry.directorVisible);}else assert(!geometry.directorVisible);
 for(const b of geometry.buttons){assert(b.width>=44&&b.height>=38,'Crate target too small');}
 const file=`${output}/${sample.name}-${size.width}.png`;await page.screenshot({path:file,fullPage:true});reports.push({name:sample.name,...size,file});
 }
 }
 await page.evaluate(()=>{renderControllerPresentation({impostor:{phase:'ROLE_REVEAL'}});show('disconnected');if(!document.getElementById('controller-director').hidden||document.body.dataset.mode)throw Error('Game header survived disconnect');show('join');if(document.body.dataset.view!=='join')throw Error('Join view was not restored');});
 assert.deepEqual(errors,[]);fs.writeFileSync(output+'/report.json',JSON.stringify({passed:true,reports,errors,physicalDevices:false},null,2));
 console.log(`PASS: ${reports.length} mobile/landscape captures, no horizontal overflow, one current step, bounded controls, no browser errors`);
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
