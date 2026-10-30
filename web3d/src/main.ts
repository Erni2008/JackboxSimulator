import {helpFor,scenarioName,durationText,finishReason} from './games/last-command/experience';
import {readSession,storeSession,clearSession} from './runtime/session-store';
import {readPreferences,savePreferences} from './runtime/preferences';
import {translateGameText as translate} from './games/last-command/labels';
import {RoomConnection,formPost} from './runtime/network';
import {GameView} from './runtime/view';
import {MechanicalAudio} from './runtime/audio';
import {Machine} from './games/last-command/machine';
const preferences=readPreferences();const audio=new MechanicalAudio();audio.enabled=preferences.sound;let lastTask='',lastAttempt='',lastSequence=-1,lastRound=-1,lastStep=0,lastMistakes=0;document.addEventListener('pointerdown',()=>{if(audio.enabled)audio.unlock();},{passive:true});
const $=(id:string)=>document.getElementById(id) as any;
let moduleFocusTimer:any;let pausedAudio=false;let connection:RoomConnection,view:GameView,state:any,loading=false,shownResult='',qualityBusy=false,joinBusy=false,lastRenderKey='';const params=new URLSearchParams(location.search);$('room').value=params.get('room')||'';$('seed').value=params.get('seed')||'20261025';if(['memory','inspection','classic'].includes(params.get('scenario')||''))$('scenario').value=params.get('scenario');
let phoneOrigin=location.origin;fetch('/last-command-dev/info').then(r=>r.json()).then(info=>{if(location.hostname==='localhost'||location.hostname==='127.0.0.1'){if(info.addresses?.length)phoneOrigin=`http://${info.addresses[0]}:${location.port||80}`;}if(state)receive(state);}).catch(()=>{});
$('sound').textContent=audio.enabled?'Звук: включён':'Звук: выключен';
const error=(e:any)=>{if(view?.machine?.loaded&&state?.lastCommand){view.machine.apply(state.lastCommand);view.touchState();}$('error').textContent=e?.message||String(e);console.error(e);};
window.addEventListener('error',e=>error(e.message));window.addEventListener('unhandledrejection',e=>error(e.reason));
async function enter(credential:any){lastAttempt='';lastRound=-1;lastSequence=-1;state=credential;storeSession(credential);$('join').hidden=true;$('game').hidden=false;connection=new RoomConnection(credential);connection.onstate=receive;connection.onerror=async message=>{if(params.get("autostart")==="1"&&["ROOM_NOT_FOUND","SESSION_ENDED"].includes(message)){const expired=connection;expired.dispose();clearSession();if(view)await view.dispose();view=undefined;state=undefined;loading=false;await join("quick");}else error(message);};connection.onstatus=s=>{if($('connection').textContent!==s)$('connection').textContent=s;const online=connected();$('connection').dataset.online=String(online);if(online&&$('error').textContent.startsWith('Нет соединения.'))$('error').textContent='';$('network-notice').hidden=online||!state?.lastCommand;$('network-notice').textContent=view?'Соединение потеряно. Переподключаемся…':'Подключение к комнате…';if(!online&&view?.machine?.loaded){lastRenderKey='';view.cancelGesture();for(const [id,c] of (view.machine as Machine).controls)if(c.press)(view.machine as Machine).previewButton(id,false);view.touchState();}updateAvailability();};connection.connect();}
async function join(kind:string){if(joinBusy)return;joinBusy=true;updateAvailability();try{$('error').textContent='';const name=$('name').value,room=$('room').value.trim().toUpperCase();let r;
 if(kind==='quick'||kind==='dev')r=await formPost('/last-command-dev/join',{roomCode:kind==='quick'?'':room,name,seed:$('seed').value,scenario:$('scenario').value});
 else if(kind==='create')r=await formPost('/rooms',{name:'THE LAST COMMAND browser test',maxPlayers:'8'});
 else r=await formPost(`/rooms/${encodeURIComponent(room)}/join`,{name});await enter(r);
 }catch(e){error(e);}finally{joinBusy=false;updateAvailability();}}
$('quick').onclick=()=>join('quick');$('join-dev').onclick=()=>join('dev');$('create-room').onclick=()=>join('create');$('join-room').onclick=()=>join('room');
$('exit').onclick=()=>{connection?.dispose();clearSession();location.href=location.pathname;};
function action(id:string,kind:string,value=''){clearTimeout(moduleFocusTimer);if(!connected()){$('error').textContent='Нет соединения. Дождитесь переподключения.';return;}if(['PRESS','RELEASE'].includes(kind)&&view?.machine?.loaded){(view.machine as Machine).previewButton(id,kind==='PRESS');view.touchState();}if(!connection?.action(id,kind,value))error('Нет соединения. Действие не отправлено.');}
function restart(){if(state?.lastCommand?.testRound?.campaign||$('next-scenario').value==='campaign'){view?.cancelGesture();action('CODE_PANEL','START_GAME');$('result').close();shownResult='';return;}if(!state?.lastCommand)return;view?.cancelGesture();action('CODE_PANEL','TEST_ROUND',$('next-scenario').value);$('result').close();shownResult='';}
$('retry-same').onclick=()=>{if(!state?.lastCommand)return;view?.cancelGesture();action('CODE_PANEL',state?.lastCommand?.testRound?.campaign?'START_GAME':'RETRY_ROUND');$('result').close();shownResult='';};
const sceneStart=document.createElement('button');sceneStart.id='scene-start';sceneStart.textContent='СТАРТ';sceneStart.hidden=true;$('viewport').append(sceneStart);sceneStart.onclick=restart;
$('restart').onclick=restart;$('again').onclick=restart;$('close-result').onclick=()=>$('result').close();
$('start-room').onclick=()=>{if(state?.host)connection.send('START_LAST_COMMAND',{roomCode:state.code,sessionId:state.lobbyId,seed:$('seed').value});};
$('camera').onclick=()=>view?.resetCamera();$('front').onclick=()=>view?.focus('BIG_BUTTON');$('focus').onclick=()=>view?.focus(state?.lastCommand?.testRound?.focusId||'BIG_BUTTON');$('replay').onclick=()=>action('LIGHT_MODULE','REPLAY');$('sound').onclick=()=>{audio.setEnabled(!audio.enabled);$('sound').textContent=audio.enabled?'Звук: включён':'Звук: выключен';preferences.sound=audio.enabled;savePreferences(preferences);};$('rear').onclick=()=>{if(view){view.focus('ANIMAL_PANEL');}};
function syncScene(){const panel=state?.lastCommand;if(view?.machine?.loaded&&panel){view.machine.apply(panel);view.machine.timeOffset=state.serverTime+(panel.clockRttMs||0)/2-Date.now();lastRenderKey=panelRenderKey(panel);view.touchState();}}
async function quality(value:string,persist=true){
 if(!view||qualityBusy||!state?.lastCommand)return false;
 qualityBusy=true;$('error').textContent='';$('loading').hidden=false;$('retry-scene').hidden=true;updateAvailability();
 let success=false,applied=value;
 try{
   view.cancelGesture();if(view.machine)await view.machine.dispose();
   const attempt=async(profile:string)=>{view.setQuality(profile);await view.load(state.lastCommand.placementId||'right');syncScene();};
   try{await attempt(value);}catch(first){
     if(value==='LOW')throw first;
     $('error').textContent=`Не удалось загрузить ${value}. Восстанавливаю LOW…`;
     applied='LOW';await attempt('LOW');
     $('error').textContent=`Профиль ${value} недоступен. Восстановлен LOW; игра продолжается.`;
   }
   success=true;$('quality').value=applied;
   if(persist||applied!==value){preferences.quality=applied as any;savePreferences(preferences);}
 }catch(e){$('error').textContent='Сцена не загрузилась. Проверьте сеть и нажмите «Повторить загрузку». '+(e?.message||e);$('load-progress').textContent='ОШИБКА ЗАГРУЗКИ РЕСУРСОВ';$('retry-scene').hidden=false;}
 finally{qualityBusy=false;$('loading').hidden=success;view.touchState();updateAvailability();}
 return success;
}
$('quality').onchange=()=>quality($('quality').value);
$('retry-scene').onclick=async()=>{if(await quality('LOW')){loading=false;await receive(state);}};
$('auto').onclick=async()=>{if(qualityBusy||loading||!view?.machine?.loaded)return;if(view.machine.quality!=='LOW'&&!await quality('LOW',false))return;qualityBusy=true;updateAvailability();try{const result=await view.autoQuality();if(result){$('quality').value=result.quality;preferences.quality='AUTO';savePreferences(preferences);}}catch(e){error(e);}finally{qualityBusy=false;updateAvailability();}};
async function receive(s:any){if(state?.revision>s.revision)return;state=s;$('room-label').textContent=`Комната ${s.code} · ${s.host?'ведущий':'игрок'}`;$('players').textContent=(s.players||[]).map((p:any)=>`${p.nickname||p.name} ${p.connectionStatus==='ONLINE'?'●':'○'}`).join(' · ');const link=`${phoneOrigin}${location.pathname}?room=${encodeURIComponent(s.code)}`;$('phone-link').href=link;$('phone-link').textContent=link;
 $('start-room').hidden=!!s.lastCommand||!s.host;$('start-room').disabled=!s.canStart;$('restart').disabled=!(s.host||s.lastCommand?.development);$('again').disabled=$('restart').disabled;$('retry-same').disabled=$('restart').disabled;
 const p=s.lastCommand;if(p?.testRound?.campaign)p.testRound.localScore=p.testRound.scores?.[s.selfId]||0;if(!p){$('instruction').textContent=s.host?'Подключите двух игроков и запустите игру.':'Ожидаем запуска ведущим.';$('load-progress').textContent='ОЖИДАНИЕ ИГРОКОВ';return;}
 if(!view&&!loading){loading=true;try{view=new GameView($('viewport'),action,(scene,quality,send)=>new Machine(scene,quality,send,params.get('baseline')==='1'));view.onhover=s=>{$('hover').textContent=describeHover(s);updateGuide(s?s.split(': ').pop():'');};view.onloading=n=>$('load-progress').textContent=`ЗАГРУЖЕНО УЗЛОВ: ${n} / 11`;view.onmetrics=m=>{$('metrics').textContent=`${m.fps.toFixed(1)} FPS · ${m.frameMs.toFixed(1)} ms · p95 ${m.p95.toFixed(1)} ms\nDraw calls ${m.drawCalls} · triangles ${m.triangles}\nModels ${m.models} · geometries ${m.geometries} · textures ${m.textures}\nLoad ${(m.loadMs/1000).toFixed(2)} s\nJS heap ${m.jsHeap?(m.jsHeap/1048576).toFixed(1)+' MiB':'недоступен'} · GPU time/VRAM недоступны`;if(m.p95>55&&performance.now()-view.qualityChangedAt>5000&&view.quality!=='LOW'&&!qualityBusy&&!loading){$('quality').value='LOW';quality('LOW');}};const preferred=preferences.quality==='AUTO'?(matchMedia('(pointer: coarse)').matches?'MEDIUM':'HIGH'):preferences.quality;const loaded=await quality(preferred==='AUTO'?'LOW':preferred,false);if(loaded&&preferred==='AUTO'){await view.autoQuality();$('quality').value=view.quality;}(window as any).__lc3d={get state(){return state;},get view(){return view;},action,connection,restart};}catch(e){error(e);}finally{loading=false;updateAvailability();}if(state!==s){receive(state);return;}}
 if(view?.machine?.loaded&&!qualityBusy){view.machine.timeOffset=s.serverTime+(p.clockRttMs||0)/2-Date.now();view.machine.apply(p);const key=panelRenderKey(p);if(key!==lastRenderKey){lastRenderKey=key;view.touchState();}}
 updateAvailability();const round=p.testRound;if(round?.expanded&&round.awaitingReady&&!document.hidden&&view?.machine?.loaded&&!qualityBusy)connection.action("TOUCH_PANEL","CLIENT_READY","");if(round?.expanded&&!round.paused&&pausedAudio&&!document.hidden){audio.task(round,view?.machine?.timeOffset||0);pausedAudio=false;}const attempt=round?.attemptId||String(round?.round??''),newAttempt=!!round&&attempt!==lastAttempt;updateGuide();if(newAttempt&&['READY','PLAYING'].includes(round.status)&&$('result').open)$('result').close();$('instruction').textContent=round?.instruction?translate(round.instruction):'Свободная проверка механизмов. Ведущий может начать тестовый раунд.';$('feedback').textContent=round?.feedback||'';$('progress').textContent=round?`${round.step}/${round.steps} · ошибок ${round.mistakes}/3`:'';
 const layoutChanged=document.body.classList.contains('campaign')!==!!round?.campaign;document.body.classList.toggle('campaign',!!round?.campaign);if(layoutChanged)view?.resize();sceneStart.hidden=!round?.campaign||round.status!=='READY';sceneStart.disabled=!connected()||loading||qualityBusy;if(round?.campaign){$('restart').textContent=round.status==='READY'?'START':'Начать заново';$('task-label').textContent='THE LAST COMMAND';$('progress').textContent=`${String(round.step).padStart(2,'0')} / 20`;if(round.status==='PLAYING'&&!round.paused&&`${p.sessionId}:${round.taskId}`!==lastTask){clearTimeout(moduleFocusTimer);view?.focus('SCREEN');if(round.expanded&&['ANIMAL_PANEL','SYMBOL_PANEL','HIDDEN_HATCH','LEVER_MODULE'].includes(round.focusId)){const task=round.taskId;moduleFocusTimer=setTimeout(()=>{const active=state?.lastCommand?.testRound;if(active?.taskId===task&&!active.nextAt&&!active.paused)view?.focus(active.focusId);},Math.max(2200,(round.touchscreen?.revealUntil||0)-Date.now()-(view?.machine?.timeOffset||0)+100));}audio.question();audio.task(round,view?.machine?.timeOffset||0);if(newAttempt)window.scrollTo({top:0,behavior:'instant'});lastTask=`${p.sessionId}:${round.taskId}`;}}if(round){if(newAttempt)$('next-scenario').value=round.scenario;$('mission-meter').max=round.steps;$('mission-meter').value=round.step;$('task-label').textContent=round.scenario==='inspection'?'ТЕСТ / АВАРИЙНЫЙ ПРОТОКОЛ':round.scenario==='memory'?'ТЕСТ / ПАМЯТЬ СИГНАЛОВ':'ТЕСТ / ДИАГНОСТИКА МЕХАНИЗМОВ';$('feedback').dataset.tone=round.mistakes>lastMistakes||round.status==='LOST'?'error':'normal';if(!newAttempt){if(round.mistakes>lastMistakes)audio.feedback(false);else if(round.step>lastStep)audio.feedback(true);}lastAttempt=attempt;lastRound=round.round;lastStep=round.step;lastMistakes=round.mistakes;drawObjectives(round.objectives||[]);$('replay').hidden=round.scenario!=='memory';}
 audio.signal(round?.touchscreen?.strength);
 if(lastSequence>=0&&p.sequence>lastSequence&&p.lastAction?.action!=='RELEASE')audio.click();lastSequence=p.sequence;
 if(round&&['WON','LOST'].includes(round.status)&&shownResult!==`${p.sessionId}-${attempt}`){shownResult=`${p.sessionId}-${attempt}`;$('result-title').textContent=round.status==='WON'?(round.campaign?'20 / 20 — ПРОТОКОЛ ВОССТАНОВЛЕН':'Тест пройден'):'Тест не пройден';$('result-text').textContent=round.campaign?`Победитель: ${round.winner===s.selfId?'вы':s.players?.find((player:any)=>player.id===round.winner)?.nickname||'ведущий'}. 20 верных команд.`:finishReason(round.finishReason);$('result-variant').textContent=`${scenarioName(round.scenario)} · вариант ${round.round+1} · seed ${p.seed}`;$('result-time').textContent=durationText(round.elapsedMs);$('result-time').dataset.ms=String(round.elapsedMs??'');$('result-mistakes').textContent=round.campaign?String(round.mistakes):`${round.mistakes} / 3`;$('result-replays').textContent=round.scenario==='memory'?`${round.replays||0} / 2`:'—';if(round.expanded){audio.task(undefined,0);audio.shutdown();const resultKey=shownResult;setTimeout(()=>{if(shownResult===resultKey&&!$('result').open)$('result').showModal();},Math.max(0,700-(Date.now()+(view?.machine?.timeOffset||0)-round.finishedAt)));}else if(!$('result').open)$('result').showModal();}
}
function button(text:string,id:string,kind:string,value=''){const b=document.createElement('button');b.textContent=text;b.dataset.element=id;b.dataset.value=value;b.onclick=()=>{action(id,kind,value);if(kind==='PRESS')setTimeout(()=>action(id,'RELEASE'),100);};$('controls').append(b);}
button('Большая кнопка','BIG_BUTTON','PRESS');for(let i=1;i<=4;i++)button(`Кнопка ${i}`,'SMALL_BUTTON_'+i,'PRESS');for(const v of ['UP','MIDDLE','DOWN'])button(v,'LEVER_MODULE','SET',v);for(const v of ['0','45','90','135'])button(v+'°','ADJUSTER','SET',v);for(const v of ['OFF','RED','GREEN','YELLOW','BLUE'])button(v,'LIGHT_MODULE','SET',v);button('Открыть люк','HIDDEN_HATCH','SET','OPEN');button('Закрыть люк','HIDDEN_HATCH','SET','CLOSED');for(let i=0;i<4;i++){button(`Цифра ${i+1} +`,'CODE_PANEL','STEP',`${i}:+1`);button(`Цифра ${i+1} −`,'CODE_PANEL','STEP',`${i}:-1`);}for(const v of ['CAT','OWL','WOLF','DEER'])button(v,'ANIMAL_PANEL','SELECT',v);for(const v of ['SUN','MOON','STAR','KEY'])button(v,'SYMBOL_PANEL','SELECT',v);
setInterval(()=>{const r=state?.lastCommand?.testRound;if(r){$('replay').disabled=!connected()||qualityBusy||loading||r.status!=='PLAYING'||Date.now()+(view?.machine?.timeOffset||0)<r.inputAt||(r.replays||0)>=2;$('replay').textContent=`Повторить сигналы · ${2-(r.replays||0)} осталось`;}if(r)$('clock').textContent=r.status==='PLAYING'&&r.deadline?`Осталось ${Math.max(0,Math.ceil((r.deadline-Date.now()-(view?.machine?.timeOffset||0))/1000))} с`:'';if(r?.scenario==='memory'&&r.status==='PLAYING'&&Date.now()+(view?.machine?.timeOffset||0)>=r.inputAt)$('instruction').textContent='Повторите последовательность цветными кнопками';},500);
window.addEventListener('pagehide',()=>{clearTimeout(moduleFocusTimer);audio.dispose();view?.cancelGesture();connection?.dispose();view?.dispose();});
try{const saved=readSession();if(saved)enter(saved);else if(params.get('autostart')==='1')join('quick');}catch{clearSession();}

function describeHover(text:string){const id=text.split(': ').pop()||'';const names:Record<string,string>={BIG_BUTTON:'Большая кнопка',LEVER_MODULE:'Рычаг · три положения',ADJUSTER:'Регулятор · четыре положения',LIGHT_MODULE:'Световой индикатор',HIDDEN_HATCH:'Секретный люк',CODE_PANEL:'Стрелки механического кода',ANIMAL_PANEL:'Панель животных',SYMBOL_PANEL:'Панель символов',SIGNAL_PANEL:'Световая память'};return names[id]||(id.startsWith('SMALL_BUTTON_')?'Цветная кнопка '+id.slice(-1):'');}
let objectivesKey='';function drawObjectives(items:any[]){const key=JSON.stringify(items);if(key===objectivesKey)return;objectivesKey=key;const root=$('objectives');root.replaceChildren();for(const item of items){const row=document.createElement('button');row.type='button';row.className='objective';const target=objectiveFocus[item.label];row.disabled=!target;row.dataset.focus=target||'';row.setAttribute('aria-label',`${item.label}: ${translate(item.value)}. Показать механизм.`);row.onclick=()=>{if(view?.machine?.loaded&&!qualityBusy)view.focus(target);};row.dataset.complete=String(item.complete);const mark=document.createElement('span');mark.textContent=item.complete?'✓':'○';const text=document.createElement('span');text.textContent=`${item.label}: ${translate(item.value)}`;row.append(mark,text);root.append(row);}}

const objectiveFocus:Record<string,string>={'Рычаг':'LEVER_MODULE','Регулятор':'ADJUSTER','Секретный люк':'HIDDEN_HATCH','Код':'CODE_PANEL','Животное':'ANIMAL_PANEL','Символ':'SYMBOL_PANEL','Индикатор':'LIGHT_MODULE'};
function connected(){return !!connection?.ready&&connection.socket?.readyState===WebSocket.OPEN;}
function updateAvailability(){
 const online=connected(),panel=state?.lastCommand,busy=loading||qualityBusy;
 for(const id of ['quick','join-dev','create-room','join-room'])$(id).disabled=joinBusy;
 $('quality').disabled=busy||!view?.machine?.loaded;$('auto').disabled=busy||!view?.machine?.loaded;
 $('restart').disabled=!online||!panel||!(state.host||panel.development)||busy;$('again').disabled=$('restart').disabled;$('retry-same').disabled=$('restart').disabled;
 $('start-room').disabled=!online||!state?.canStart;if(!online||busy)$('replay').disabled=true;
 for(const button of $('controls').querySelectorAll('button')){
   const id=button.dataset.element;button.disabled=!online||!panel||busy||panel.locked?.includes(id)||panel.testRound?.campaign&& (panel.testRound.paused||!panel.testRound.requiredMechanisms?.includes(id)||Date.now()+(view?.machine?.timeOffset||0)<panel.testRound.readyAt);
   const prop=({LEVER_MODULE:'lever',ADJUSTER:'adjuster',LIGHT_MODULE:'light',ANIMAL_PANEL:'animal',SYMBOL_PANEL:'symbol'} as any)[id];
   const pressed=panel&&(panel.held?.includes(id)||(prop&&String(panel[prop])===button.dataset.value)||(id==='HIDDEN_HATCH'&&(panel.hatch?'OPEN':'CLOSED')===button.dataset.value));
   button.setAttribute('aria-pressed',String(!!pressed));
 }
}
$('copy-link').onclick=async()=>{
 const link=$('phone-link').href;let copied=false;
 try{if(navigator.clipboard){await navigator.clipboard.writeText(link);copied=true;}}catch{}
 if(!copied){const input=document.createElement('textarea');input.className='clipboard-buffer';input.value=link;document.body.append(input);input.select();try{copied=document.execCommand('copy');}catch{}input.remove();}
 $('copy-status').textContent=copied?'Ссылка скопирована':'Скопируйте ссылку выше вручную';
};

function panelRenderKey(p:any){const r=p.testRound;return JSON.stringify([p.sessionId,p.held,p.locked,p.code,p.adjuster,p.light,p.hatch,p.lever,p.animal,p.symbol,p.hint,r?.taskId,r?.nextAt,r?.readyAt,r?.step,r?.feedback,r?.round,r?.attemptId,r?.status,r?.instruction,r?.signalStartedAt,r?.inputAt]);}

let lastResumeSync=-1000;
function syncAfterResume(){const now=performance.now();if(document.hidden||!connected()||now-lastResumeSync<1000)return;lastResumeSync=now;connection.send('SYNC',{roomCode:state.code});}
window.addEventListener('focus',syncAfterResume);document.addEventListener('visibilitychange',syncAfterResume);

function updateGuide(hoverId=''){const help=helpFor(state?.lastCommand?.testRound,hoverId);if($('guide-name').textContent!==help.title)$('guide-name').textContent=help.title;if($('guide-text').textContent!==help.text)$('guide-text').textContent=help.text;}
window.addEventListener('keydown',event=>{
 if(event.repeat||event.ctrlKey||event.metaKey||event.altKey||event.target instanceof Element&&event.target.closest('input,select,textarea,[contenteditable="true"]')||document.querySelector('dialog[open]')||!view?.machine?.loaded||qualityBusy||loading)return;
 if(event.shiftKey&&event.key!=='?')return;
 const actions:Record<string,()=>void>={KeyF:()=>$('focus').click(),KeyR:()=>$('camera').click(),Digit1:()=>$('front').click(),Digit2:()=>$('rear').click(),KeyM:()=>$('sound').click()};
 if(event.key==='?'){$('mechanism-guide').open=!$('mechanism-guide').open;event.preventDefault();}
 else if(actions[event.code]){actions[event.code]();event.preventDefault();}
});

document.addEventListener('visibilitychange',()=>{if(state?.lastCommand?.testRound?.expanded){if(document.hidden){audio.task(undefined,0);pausedAudio=true;}connection?.action('TOUCH_PANEL','VISIBILITY',document.hidden?'HIDDEN':'VISIBLE');}});

$('viewport').addEventListener('pointerdown',()=>clearTimeout(moduleFocusTimer),{passive:true});
