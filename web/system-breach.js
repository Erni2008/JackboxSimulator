'use strict';
/** Terminal presentation over authoritative server contracts; no local game rules or answer keys. */
/** One outstanding mutation; retries keep the original ID/body and reconcile against private server receipts. */
function createSystemBreachRequests({getState,isAuthenticated,send,makeId,now}){
  let pending=null,status='';
  function reconcile(){
    if(!pending)return false;const s=getState()?.systemBreach;
    if(!s||s.sessionId!==pending.payload.sessionId){pending=null;status='';return true;}
    const receipt=s.self?.lastAction;
    if(receipt?.requestId===pending.id){status=receipt.status;pending=null;return true;}
    if(['RESULTS','FINISHED'].includes(s.phase)&&pending.type!=='END'){pending=null;status='MATCH_COMPLETE';return true;}
    return false;
  }
  function action(type,fields={}){
    reconcile();const root=getState(),s=root?.systemBreach;if(pending||!s||!isAuthenticated())return null;
    const payload=JSON.parse(JSON.stringify({...fields,roomCode:root.code,sessionId:s.sessionId}));
    pending={id:makeId(),type,payload,lastSent:now(),attempts:1};status='Waiting for server…';send('SYSTEM_BREACH_'+type,payload,pending.id);return pending.id;
  }
  function event(e){
    if(!pending||e.requestId!==pending.id)return false;
    if(e.type==='SYSTEM_BREACH_ACTION_REJECTED'||e.type==='ERROR'){status=e.payload?.code||'Rejected';pending=null;return true;}
    if(e.payload?.systemBreachAction){status=e.payload.systemBreachAction.status;pending=null;return true;}return false;
  }
  function tick(){
    const changed=reconcile();if(pending&&isAuthenticated()&&now()-pending.lastSent>=(pending.attempts<3?1500:5000)){
      pending.lastSent=now();pending.attempts++;send('SYSTEM_BREACH_'+pending.type,pending.payload,pending.id);
    }return changed;
  }
  return {action,event,tick,reconcile,pending:()=>!!pending,status:()=>status,reset(){pending=null;status='';}};
}
/**
 * The player's laptop. Every number and permission comes from the server; the phone only lays out choices.
 * Views: pick a password → idle menu (task / hack / firewall) → quick question → pick target → guess password →
 * reboot question when hacked. Results stay on the shared screen.
 */
function createSystemBreachController({getState,isAuthenticated,send,makeId,now}){
  const el=id=>document.getElementById(id);
  const requests=createSystemBreachRequests({getState,isAuthenticated,send,makeId,now});
  let picking=false,viewKey='',toast='',toastAt=0,lastSync=0,lastReceipt='';
  const body=()=>el('sbx-body');
  const mk=(tag,cls,text,parent)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!=null)e.textContent=text;if(tag==='button'){e.type='button';e.dataset.nativeButton='';}if(parent)parent.append(e);return e;};
  const secs=t=>Math.max(0,Math.ceil((t-now())/1000));
  const mmss=ms=>{const s=Math.max(0,Math.ceil(ms/1000));return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0');};
  const REASONS={SB_INSUFFICIENT_AP:'мало AP',SB_ATTACK_COOLDOWN:'перезарядка',SB_TARGET_PROTECTED:'цель под защитой',SB_TARGET_BUSY:'цель занята',SB_TARGET_DISCONNECTED:'не в сети',SB_MAX_FIREWALL:'максимум',SB_CHALLENGE_COOLDOWN:'подожди',SB_ROUND_ENDING:'раунд кончается',SB_RECOVERY_REQUIRED:'сначала перезагрузка',SB_TEMPORARILY_BLOCKED:'система заблокирована',SB_ATTACK_PENDING:'атака уже идёт',SB_CHALLENGE_PENDING:'задание уже есть'};
  const reason=p=>p?.allowed?'':(REASONS[p?.reason]||'недоступно');
  function act(type,fields){if(requests.action(type,fields)){navigator.vibrate?.(15);render();}}
  function say(text){toast=text;toastAt=now();const t=el('sbx-toast');t.textContent=text;t.classList.remove('on');void t.offsetWidth;t.classList.add('on');}

  function tile(parent,{icon,title,sub,cls,disabled,onClick}){
    const b=mk('button','sbx-tile '+(cls||''),null,parent);b.disabled=!!disabled;
    mk('span','sbx-tile-icon',icon,b);const t=mk('span','sbx-tile-text',null,b);mk('b',null,title,t);mk('small',null,sub,t);b.onclick=onClick;return b;
  }
  function header(parent,kicker,title,cls){const h=mk('div','sbx-head '+(cls||''),null,parent);mk('small',null,kicker,h);mk('h3',null,title,h);return h;}
  function timerBar(parent,start,end){const w=mk('div','sbx-timer',null,parent);const i=mk('i',null,null,w);i.dataset.start=start;i.dataset.end=end;return w;}
  function options(parent,list,onPick,cls){const g=mk('div','sbx-options '+(cls||''),null,parent);
    list.forEach((o,k)=>{const b=mk('button','sbx-option',null,g);mk('span','sbx-key',String.fromCharCode(65+k),b);mk('span','sbx-val',o,b);b.disabled=requests.pending();b.onclick=()=>{for(const x of g.children)x.disabled=true;b.classList.add('picked');onPick(o);};});return g;}

  function build(s,root,me,mine){
    const b=body();b.replaceChildren();const a=me.actions||{};
    if(s.role!=='PLAYER'){header(b,'НАБЛЮДЕНИЕ','Смотри на общий экран');return;}
    if(s.phase==='INITIALIZATION'){
      if(me.passwordSelected){header(b,'ПАРОЛЬ УСТАНОВЛЕН','Ждём остальных…');mk('p','sbx-note','Запомни свой пароль — его будут пытаться угадать.',b);return;}
      header(b,'ШАГ 1 · ЗАЩИТА','Выбери пароль своей системы');mk('p','sbx-note','Другие будут пытаться угадать его.',b);
      options(b,me.passwordOptions||[],w=>act('PASSWORD_SELECT',{password:w}),'sbx-pass');return;
    }
    if(s.phase!=='ACTIVE'){header(b,'ОПЕРАЦИЯ ЗАВЕРШЕНА','Смотри на общий экран');return;}
    const rec=me.recovery?.challengeId?me.recovery:null,ch=me.challenge?.challengeId?me.challenge:null,atk=me.attack?.attackId?me.attack:null;
    if(rec){
      header(b,'⚠ СИСТЕМА ВЗЛОМАНА','Перезагрузка: ответь на вопрос','alert');
      if(rec.data?.question){mk('p','sbx-q',rec.data.question,b);options(b,rec.data.options||[],o=>act('RECOVERY_SUBMIT',{challengeId:rec.challengeId,answer:o}));}
      else mk('p','sbx-note','Восстановление…',b);
      timerBar(b,rec.createdAt,rec.expiresAt);return;
    }
    if(atk){const t=s.players.find(p=>p.playerId===atk.targetId);
      header(b,'ВЗЛОМ · ОДНА ПОПЫТКА','Угадай пароль: '+(t?.nickname||'цель'),'hack');
      options(b,atk.options||[],o=>act('ATTACK_SUBMIT',{attackId:atk.attackId,password:o}),'sbx-pass');timerBar(b,now(),atk.expiresAt);return;}
    if(ch){
      header(b,'ЗАДАНИЕ · +'+(s.rewards?.[ch.type]||10)+' AP','Ответь быстро');
      if(ch.data?.question){mk('p','sbx-q',ch.data.question,b);options(b,ch.data.options||[],o=>act('CHALLENGE_SUBMIT',{challengeId:ch.challengeId,answer:o}));}
      else mk('p','sbx-note','Это задание недоступно на телефоне.',b);
      timerBar(b,ch.createdAt,ch.expiresAt);return;
    }
    if(picking){
      header(b,'ВЗЛОМ','Выбери цель');const list=mk('div','sbx-targets',null,b);
      for(const t of a.targets||[]){const p=s.players.find(x=>x.playerId===t.playerId);if(!p)continue;
        const r=mk('button','sbx-target',null,list);r.disabled=requests.pending()||!t.attack?.allowed;
        mk('b',null,p.nickname,r);mk('span','sbx-cost',t.attack?.allowed?'−'+t.attack.cost+' AP':reason(t.attack),r);
        r.onclick=()=>{picking=false;act('ATTACK_REQUEST',{targetId:t.playerId});};}
      if(!(a.targets||[]).length)mk('p','sbx-note','Нет доступных целей.',b);
      const back=mk('button','sbx-back','← назад',b);back.onclick=()=>{picking=false;render();};return;
    }
    header(b,'КОМАНДНЫЙ ЦЕНТР','Что делаем?');const g=mk('div','sbx-tiles',null,b);
    const q=a.challengeTypes?.QUICK_QUESTION||a.challenge;
    tile(g,{icon:'?',title:'Задание',sub:q?.allowed?'+'+(s.rewards?.QUICK_QUESTION||10)+' AP за ответ':reason(q),cls:'task',disabled:requests.pending()||!q?.allowed,onClick:()=>act('CHALLENGE_REQUEST',{type:'QUICK_QUESTION'})});
    const anyTarget=(a.targets||[]).some(t=>t.attack?.allowed);
    tile(g,{icon:'⌖',title:'Взломать',sub:anyTarget?'украсть AP у игрока':(mine?.attackReadyAt>now()?'перезарядка '+secs(mine.attackReadyAt)+' с':'нет целей'),cls:'hack',disabled:requests.pending()||!anyTarget,onClick:()=>{picking=true;render();}});
    tile(g,{icon:'⛨',title:'Фаервол',sub:a.firewall?.allowed?'улучшить · −'+a.firewall.cost+' AP':reason(a.firewall),cls:'fw',disabled:requests.pending()||!a.firewall?.allowed,onClick:()=>act('FIREWALL_UPGRADE')});
  }

  function stats(s,me,mine){
    el('sbx-ap').textContent=mine?mine.accessPoints:'—';el('sbx-fw').textContent='LV'+(mine?.firewallLevel||1);
    const st=el('sbx-state'),scr=el('sbx-screen');
    const state=!mine?'watch':mine.disconnected?'off':mine.recovering||mine.compromised?'hacked':me.attack?.attackId?'attack':'ok';
    st.textContent={watch:'ЗРИТЕЛЬ',off:'НЕ В СЕТИ',hacked:'ВЗЛОМАН',attack:'ВЗЛОМ…',ok:'В СЕТИ'}[state];st.dataset.state=state;scr.dataset.state=state;
  }
  function receipts(s){
    const r=s.self?.lastAction;if(!r||r.requestId===lastReceipt)return;lastReceipt=r.requestId;
    const msg={PASSWORD_SELECTED:'Пароль установлен',CHALLENGE_READY:'',ATTACK_READY:'Подключено. Угадай пароль',FIREWALL_UPGRADED:'Фаервол улучшен',SPECIAL_APPLIED:'Применено'}[r.status];
    if(r.action==='CHALLENGE_SUBMIT'||r.action==='RECOVERY_SUBMIT')say('Ответ принят');
    else if(r.action==='ATTACK_SUBMIT')say('Попытка отправлена');
    else if(msg)say(msg);
  }
  function render(){
    const root=getState(),s=root?.systemBreach;if(!s)return;requests.reconcile();
    const me=s.self||{},mine=s.players.find(p=>p.playerId===root.selfId);
    receipts(s);stats(s,me,mine);
    const a=me.actions||{};
    const key=[s.sessionId,s.phase,s.role,me.passwordSelected,(me.passwordOptions||[]).join(),me.recovery?.challengeId,me.challenge?.challengeId,me.attack?.attackId,picking,requests.pending(),
      JSON.stringify(a.challengeTypes?.QUICK_QUESTION||a.challenge||{}),JSON.stringify(a.firewall||{}),JSON.stringify((a.targets||[]).map(t=>[t.playerId,t.attack?.allowed,t.attack?.cost,t.attack?.reason])),
      s.players.map(p=>p.nickname).join()].join('|');
    if(key!==viewKey){viewKey=key;build(s,root,me,mine);}
    tick(true);
  }
  function tick(fromRender){
    const s=getState()?.systemBreach;if(!s)return;
    el('sbx-clock').textContent=s.deadline>0?mmss(s.deadline-now()):'--:--';
    for(const i of document.querySelectorAll('#sbx-body .sbx-timer i')){const st=+i.dataset.start,en=+i.dataset.end;const f=en>st?Math.max(0,Math.min(1,(en-now())/(en-st))):0;i.style.transform='scaleX('+f.toFixed(3)+')';i.parentElement.classList.toggle('low',f<.3);}
    if(fromRender===true)return;
    if(requests.tick())render();
    if(isAuthenticated()&&now()-lastSync>=1000){lastSync=now();send('SYNC',{},makeId());}
  }
  return {action:act,render,tick,reset(){requests.reset();picking=false;viewKey='';lastReceipt='';lastSync=0;},event(e){if(requests.event(e)){const code=requests.status();if(code&&code.startsWith('SB_'))say(REASONS[code]||'Не получилось');render();}}};
}
