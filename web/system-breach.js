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
 * The player's laptop. The core loop is a stream of quick questions; every 3 right answers forge an ACCESS KEY,
 * and a key opens the breach menu: hack a player, raise the firewall or plant a trojan — or bank it and keep going.
 * Every number, permission and verdict comes from the server; the phone only stages it.
 */
function createSystemBreachController({getState,isAuthenticated,send,makeId,now}){
  const el=id=>document.getElementById(id);
  {const scr=el('breach-screen');if(scr&&scr.parentElement!==document.body)document.body.append(scr);}
  const requests=createSystemBreachRequests({getState,isAuthenticated,send,makeId,now});
  let viewKey='',lastSync=0,lastReceipt='',verdict=null,mode='',banked=0,seenKeys=-1,celebrateUntil=0,lastAsk=0;
  const body=()=>el('sbx-body');
  const face=id=>{const p=getState()?.players?.find(x=>x.id===id);return p?.characterId?'sb/portraits/'+p.characterId+'.png':'';};
  // digital rain behind the terminal: tiny canvas at half resolution, ~20 fps, paused when hidden
  {const c=el('sbx-rain'),g=c.getContext('2d'),glyphs='0123456789ABCDEF<>/#$%*+=';let cols=[],last=0;
    const fit=()=>{const r=c.getBoundingClientRect();c.width=Math.max(1,r.width/2|0);c.height=Math.max(1,r.height/2|0);cols=Array.from({length:Math.ceil(c.width/9)},()=>Math.random()*c.height/10);};
    addEventListener('resize',fit);
    const draw=t=>{requestAnimationFrame(draw);if(document.hidden||el('breach-screen').hidden||t-last<80)return;last=t;if(!cols.length||c.width<2)fit();
      g.fillStyle='rgba(2,9,5,.22)';g.fillRect(0,0,c.width,c.height);g.font='9px monospace';
      const hot=el('sbx-screen').dataset.state==='hacked';
      cols.forEach((y,i)=>{g.fillStyle=hot?'rgba(255,74,58,.55)':'rgba(61,255,143,.45)';g.fillText(glyphs[Math.random()*glyphs.length|0],i*9,y*10);cols[i]=y*10>c.height&&Math.random()>.97?0:y+1;});};
    requestAnimationFrame(draw);}
  let bootFor='';
  function boot(){const scr=el('sbx-screen'),o=document.createElement('div');o.className='sbx-boot';scr.append(o);
    const lines=['> BIOS v6.66 … OK','> mounting /dev/breach … OK','> loading exploit kit … OK','> handshake with FINAL ANSWER grid … OK','> ACCESS GRANTED'];
    lines.forEach((t,i)=>setTimeout(()=>{const p=document.createElement('p');p.textContent=t;if(i===lines.length-1)p.className='ok';o.append(p);},180+i*330));
    setTimeout(()=>o.classList.add('out'),2300);setTimeout(()=>o.remove(),2900);}
  const mk=(tag,cls,text,parent)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!=null)e.textContent=text;if(tag==='button'){e.type='button';e.dataset.nativeButton='';}if(parent)parent.append(e);return e;};
  const STEPS=[1,1.3,1.5,1.8,2,2.5],fx=v=>{const t=Math.round(v*10);return t%10?(t/10).toFixed(1):String(t/10);};
  const secs=t=>Math.max(0,Math.ceil((t-now())/1000));
  const mmss=ms=>{const s=Math.max(0,Math.ceil(ms/1000));return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0');};
  const REASONS={SB_INSUFFICIENT_AP:'мало AP',SB_ATTACK_COOLDOWN:'перезарядка',SB_TARGET_PROTECTED:'под защитой',SB_TARGET_BUSY:'уже атакуют',SB_TARGET_DISCONNECTED:'не в сети',SB_MAX_FIREWALL:'максимум',SB_CHALLENGE_COOLDOWN:'подожди',SB_ROUND_ENDING:'раунд кончается',SB_RECOVERY_REQUIRED:'сначала перезагрузка',SB_TEMPORARILY_BLOCKED:'система заблокирована',SB_ATTACK_PENDING:'атака уже идёт',SB_CHALLENGE_PENDING:'задание уже есть',SB_NEED_KEY:'нужен ключ',SB_MAX_MULTIPLIER:'максимум'};
  const reason=p=>p?.allowed?'':(REASONS[p?.reason]||'недоступно');
  function act(type,fields){const id=requests.action(type,fields);if(id){navigator.vibrate?.(12);render();}return id;}
  function say(text){const t=el('sbx-toast');t.textContent=text;t.classList.remove('on');void t.offsetWidth;t.classList.add('on');}
  function answer(kind,type,fields,button){const st=getState()?.systemBreach,ap=st?.players.find(p=>p.playerId===getState().selfId)?.accessPoints??0,cid=st?.self?.challenge?.challengeId;const id=act(type,fields);if(id)verdict={id,kind,button,ok:null,until:now()+1700,sent:now(),ap,cid};}
  function showVerdict(ok,text){
    const v=verdict;v.ok=ok;v.until=now()+1500;v.button?.classList.add(ok?'right':'wrong');navigator.vibrate?.(ok?[30,40,30]:[90]);
    const st=mk('div','sbx-verdict '+(ok?'ok':'bad'),null,body());mk('b','mi',ok?'\ue5ca':'\ue5cd',st);mk('span',null,text,st);flash(ok?'flash-ok':'flash-bad');
  }
  /** Right answer: the chosen key lights up and "+N AP" floats up from it and dissolves — no modal. */
  function scorePop(ok,amt){
    const v=verdict;v.ok=ok;v.until=now()+1500;const btn=v.button;btn?.classList.add(ok?'right':'wrong');navigator.vibrate?.(ok?[25,35,25]:[80]);
    const host=body(),r=btn?btn.getBoundingClientRect():host.getBoundingClientRect(),hr=host.getBoundingClientRect();
    const f=mk('div','sbx-pop '+(ok?'ok':'bad'),ok?'+'+amt+' AP':'МИМО',host);f.style.left=(r.left-hr.left+r.width/2)+'px';f.style.top=(r.top-hr.top)+'px';
    if(ok){for(let i=0;i<10;i++){const d=mk('i','sbx-spark',null,host);d.style.left=(r.left-hr.left+r.width/2)+'px';d.style.top=(r.top-hr.top+r.height/2)+'px';const a=Math.PI*2*i/10;d.style.setProperty('--dx',(Math.cos(a)*(40+Math.random()*30)).toFixed(0)+'px');d.style.setProperty('--dy',(Math.sin(a)*(30+Math.random()*24)-20).toFixed(0)+'px');}}
    flash(ok?'flash-ok':'flash-bad');
  }
  function flash(cls){const s=el('sbx-screen');s.classList.remove('flash-ok','flash-bad','flash-key');void s.offsetWidth;s.classList.add(cls);}

  function typeq(parent,text){const q=mk('p','sbx-q',null,parent);const t=mk('span',null,'',q);mk('i','sbx-caret',null,q);let i=0;const step=()=>{if(!q.isConnected)return;t.textContent=text.slice(0,++i);if(i<text.length)setTimeout(step,22);else q.classList.add('done');};step();return q;}
  function header(parent,kicker,title,cls){const h=mk('div','sbx-head '+(cls||''),null,parent);mk('small',null,kicker,h);mk('h3',null,title,h);return h;}
  function timerBar(parent,start,end){const w=mk('div','sbx-timer',null,parent);const i=mk('i',null,null,w);i.dataset.start=start;i.dataset.end=end;return w;}
  function options(parent,list,onPick,cls){const g=mk('div','sbx-options '+(cls||''),null,parent);
    list.forEach((o,k)=>{const b=mk('button','sbx-option',null,g);b.style.animationDelay=(k*60)+'ms';mk('span','sbx-key',String.fromCharCode(65+k),b);mk('span','sbx-val',o,b);b.disabled=requests.pending();
      b.onclick=()=>{for(const x of g.children)x.disabled=true;b.classList.add('picked');onPick(o,b);};});return g;}
  function card(parent,{icon,title,sub,cls,disabled,onClick,delay}){
    const b=mk('button','sbx-card '+(cls||''),null,parent);b.disabled=!!disabled;b.style.animationDelay=(delay||0)+'ms';
    mk('span','sbx-card-icon mi',icon,b);const t=mk('span','sbx-card-text',null,b);mk('b',null,title,t);mk('small',null,sub,t);b.onclick=onClick;return b;}
  function targets(parent,s,me,kind){
    const a=me.actions||{},list=mk('div','sbx-targets',null,parent);let any=false;
    for(const t of a.targets||[]){const p=s.players.find(x=>x.playerId===t.playerId);if(!p)continue;
      const perm=kind==='TROJAN'?t.specials?.TROJAN:t.attack;any=true;
      const r=mk('button','sbx-target',null,list);r.disabled=requests.pending()||!perm?.allowed;
      const fi=face(t.playerId);if(fi){const ph=mk('span','sbx-tface',null,r);const im=mk('img',null,null,ph);im.src=fi;im.alt='';}
      const n=mk('span','sbx-tname',null,r);mk('b',null,p.nickname,n);mk('small',null,p.accessPoints+' AP · FW'+(p.firewallLevel||1),n);
      mk('span','sbx-cost',perm?.allowed?'−'+perm.cost+' AP':reason(perm),r);
      r.onclick=()=>{mode='';kind==='TROJAN'?act('SPECIAL_ATTACK',{targetId:t.playerId,type:'TROJAN'}):act('ATTACK_REQUEST',{targetId:t.playerId});};}
    if(!any)mk('p','sbx-note','Нет доступных целей.',parent);
    const back=mk('button','sbx-back','← назад',parent);back.onclick=()=>{mode='';viewKey='';render();};
  }

  function build(s,me,mine){
    const b=body();b.replaceChildren();b.classList.remove('enter');void b.offsetWidth;b.classList.add('enter');const a=me.actions||{};
    if(s.role!=='PLAYER'){header(b,'НАБЛЮДЕНИЕ','Смотри на общий экран');return;}
    if(s.phase==='INITIALIZATION'){
      if(me.passwordSelected){header(b,'ПАРОЛЬ УСТАНОВЛЕН','Ждём остальных…');mk('div','sbx-loader',null,b);mk('p','sbx-note','Запомни пароль — его попытаются угадать.',b);return;}
      header(b,'ШАГ 1 · ЗАЩИТА','Выбери пароль своей системы');mk('p','sbx-note','Другие будут пытаться его угадать.',b);
      options(b,me.passwordOptions||[],(w,btn)=>{act('PASSWORD_SELECT',{password:w});btn.classList.add('right');},'sbx-pass');return;
    }
    if(s.phase!=='ACTIVE'){header(b,'ОПЕРАЦИЯ ЗАВЕРШЕНА','Смотри на общий экран');return;}
    const rec=me.recovery?.challengeId?me.recovery:null,ch=me.challenge?.challengeId?me.challenge:null,atk=me.attack?.attackId?me.attack:null;
    if(rec){header(b,'⚠ ТЕБЯ ВЗЛОМАЛИ','Перезагрузка: ответь верно','alert');
      if(rec.data?.question){typeq(b,rec.data.question);options(b,rec.data.options||[],(o,btn)=>answer('reboot','RECOVERY_SUBMIT',{challengeId:rec.challengeId,answer:o},btn));}
      timerBar(b,rec.createdAt,rec.expiresAt);return;}
    if(atk){const t=s.players.find(p=>p.playerId===atk.targetId);
      header(b,'ВЗЛОМ · ОДНА ПОПЫТКА','Угадай пароль: '+(t?.nickname||'цель'),'hack');
      options(b,atk.options||[],(o,btn)=>answer('hack','ATTACK_SUBMIT',{attackId:atk.attackId,password:o},btn),'sbx-pass');timerBar(b,now(),atk.expiresAt);return;}
    if(mode==='hack'||mode==='trojan'){header(b,mode==='hack'?'ВЗЛОМ · КЛЮЧ':'ТРОЯН · КЛЮЧ',mode==='hack'?'Чей компьютер ломаем?':'Кого заблокировать?','hack');targets(b,s,me,mode==='hack'?'ATTACK':'TROJAN');return;}
    if(ch){header(b,'ВОПРОС · +'+(s.rewards?.[ch.type]||10)+' AP','Ответь быстро');
      if(ch.data?.question){typeq(b,ch.data.question);options(b,ch.data.options||[],(o,btn)=>answer('quiz','CHALLENGE_SUBMIT',{challengeId:ch.challengeId,answer:o},btn));}
      timerBar(b,ch.createdAt,ch.expiresAt);return;}
    const keys=me.keys||0;
    if(keys>banked){
      header(b,'ДОСТУП ОТКРЫТ · КЛЮЧЕЙ: '+keys,'Используй ключ','key');const g=mk('div','sbx-cards',null,b);
      const anyHack=(a.targets||[]).some(t=>t.attack?.allowed),anyTrojan=(a.targets||[]).some(t=>t.specials?.TROJAN?.allowed);
      card(g,{icon:'\ue1b3',title:'Взлом',sub:anyHack?'угадай пароль — укради AP':(mine?.attackReadyAt>now()?'перезарядка '+secs(mine.attackReadyAt)+' с':'нет целей'),cls:'hack',disabled:requests.pending()||!anyHack,onClick:()=>{mode='hack';viewKey='';render();},delay:0});
      card(g,{icon:'\ue32a',title:'Фаервол',sub:a.firewall?.allowed?'LV'+(mine?.firewallLevel||1)+' → LV'+((mine?.firewallLevel||1)+1)+' · −'+a.firewall.cost+' AP':reason(a.firewall),cls:'fw',disabled:requests.pending()||!a.firewall?.allowed,onClick:()=>act('FIREWALL_UPGRADE'),delay:70});
      const mu=a.multiplier,curM=s.multipliers?.[getState()?.selfId]||1;
      card(g,{icon:'\ue3d2',title:'Множитель',sub:mu?.allowed?'очки ×'+fx(curM)+' → ×'+fx(STEPS[Math.min(STEPS.length-1,STEPS.indexOf(curM)+1)]||curM)+' · −'+mu.cost+' AP':(mu?.reason==='SB_MAX_MULTIPLIER'?'максимум ×2.5':reason(mu)),cls:'mult',disabled:requests.pending()||!mu?.allowed,onClick:()=>act('MULTIPLIER_UPGRADE'),delay:105});
      card(g,{icon:'\ue868',title:'Троян',sub:anyTrojan?'заблокируй соперника':'недоступно',cls:'trojan',disabled:requests.pending()||!anyTrojan,onClick:()=>{mode='trojan';viewKey='';render();},delay:140});
      card(g,{icon:'\ue01f',title:'Копить ключ',sub:'продолжить вопросы',cls:'save',disabled:requests.pending(),onClick:()=>{banked=keys;viewKey='';render();},delay:210});
      return;
    }
    header(b,'ПОДКЛЮЧЕНИЕ','Следующий вопрос…');mk('div','sbx-loader',null,b);
  }

  function stats(s,me,mine){
    const selfId=getState()?.selfId,img=el('sbx-avatar'),src=face(selfId);if(src&&img.getAttribute('src')!==src)img.src=src;el('sbx-name').textContent=mine?.nickname||'';
    {const ap=el('sbx-ap'),v=String(mine?mine.accessPoints:'—');if(ap.textContent!==v){if(ap.textContent!==''&&ap.textContent!=='0'||v!=='0'){ap.classList.remove('bump');void ap.offsetWidth;ap.classList.add('bump');}ap.textContent=v;}}el('sbx-fw').textContent='LV'+(mine?.firewallLevel||1);
    {const m=s.multipliers?.[getState()?.selfId]||1,me2=el('sbx-mult');const v='×'+fx(m);
     {const rr=el('sbx-round'),rm=s.roundMultiplier||1,rv='РАУНД ×'+fx(rm);rr.hidden=rm<=1;if(rr.textContent!==rv){if(rr.textContent){rr.classList.remove('bump');void rr.offsetWidth;rr.classList.add('bump');}rr.textContent=rv;}}if(me2.textContent!==v){me2.textContent=v;me2.classList.remove('bump');void me2.offsetWidth;me2.classList.add('bump');}me2.parentElement.dataset.on=String(m>1);
     const pl=el('sbx-place'),pv=mine?mine.rank+'/'+s.players.length:'—';if(pl.textContent!==pv){if(pl.textContent!=='—'){pl.classList.remove('bump');void pl.offsetWidth;pl.classList.add('bump');}pl.textContent=pv;}pl.parentElement.dataset.rank=String(mine?.rank||0);}
    const st=el('sbx-state'),scr=el('sbx-screen');
    const state=!mine?'watch':mine.disconnected?'off':mine.recovering||mine.compromised?'hacked':me.attack?.attackId?'attack':'ok';
    st.textContent={watch:'ЗРИТЕЛЬ',off:'НЕ В СЕТИ',hacked:'ВЗЛОМАН',attack:'ВЗЛОМ…',ok:'В СЕТИ'}[state];st.dataset.state=state;scr.dataset.state=state;
    const meter=el('sbx-meter');meter.hidden=!me.keyGating||s.phase!=='ACTIVE';
    if(!meter.hidden){const every=me.keyEvery||3,prog=me.keyProgress||0;
      if(meter.childElementCount!==every+3){meter.replaceChildren();mk('small',null,'КЛЮЧ',meter);for(let i=0;i<every;i++)mk('i',null,null,meter);mk('span','sbx-keyicon mi','\ue0da',meter);mk('b','sbx-keys',null,meter);}
      [...meter.querySelectorAll('i')].forEach((x,i)=>x.classList.toggle('on',i<prog));meter.querySelector('.sbx-keys').textContent=String(me.keys||0);}
  }
  function receipts(s){
    const r=s.self?.lastAction;if(!r||r.requestId===lastReceipt)return;lastReceipt=r.requestId;
    if(verdict&&verdict.ok==null&&r.requestId===verdict.id){const st=r.status,amt=r.details?.reward||r.details?.amount||0;
      if(verdict.kind==='quiz'){if(verdict.ok==null)scorePop(st==='SUCCESS',amt);}
      else if(verdict.kind==='hack')showVerdict(st==='SUCCESS',st==='SUCCESS'?'ВЗЛОМ УДАЛСЯ'+(amt?'  +'+amt+' AP':''):'ПАРОЛЬ НЕВЕРНЫЙ');
      else showVerdict(st==='SUCCESS',st==='SUCCESS'?'СИСТЕМА ВОССТАНОВЛЕНА':st==='EMERGENCY_RESTORED'?'АВАРИЙНЫЙ ОТКАТ':'НЕВЕРНО — ЕЩЁ ВОПРОС');return;}
    const msg={MULTIPLIER_UPGRADED:'Множитель очков повышен',FIREWALL_UPGRADED:'Фаервол улучшен',SPECIAL_APPLIED:'Троян внедрён'}[r.status];if(msg){say(msg);flash('flash-ok');}
  }
  function celebrate(keys){
    celebrateUntil=now()+1700;const b=body();b.replaceChildren();
    const c=mk('div','sbx-unlock',null,b);mk('div','sbx-unlock-key mi','\ue0da',c);mk('b',null,'КЛЮЧ ДОСТУПА ПОЛУЧЕН',c);mk('small',null,'3 верных ответа · ключей: '+keys,c);
    flash('flash-key');navigator.vibrate?.([20,30,20,30,60]);viewKey='';
  }
  function render(){
    const root=getState(),s=root?.systemBreach;if(!s)return;requests.reconcile();
    const me=s.self||{},mine=s.players.find(p=>p.playerId===root.selfId),a=me.actions||{};
    if(bootFor!==s.sessionId){bootFor=s.sessionId;boot();}
    receipts(s);stats(s,me,mine);
    const keys=me.keys||0;if(keys<banked)banked=keys;
    // quiz verdict from the balance itself, in case the receipt is late: AP rose → right; the question left without a rise → wrong
    if(verdict&&verdict.ok==null&&verdict.kind==='quiz'&&mine){const d=mine.accessPoints-verdict.ap;if(d>0)scorePop(true,d);else if(me.challenge?.challengeId!==verdict.cid&&now()-verdict.sent>700)scorePop(false,0);}
    const holding=verdict&&(verdict.ok==null?now()-verdict.sent<4000:now()<verdict.until);
    if(!holding&&verdict)verdict=null;
    if(holding)return tick(true);
    if(seenKeys>=0&&keys>seenKeys&&s.phase==='ACTIVE'){seenKeys=keys;celebrate(keys);return tick(true);}seenKeys=keys;
    if(now()<celebrateUntil)return tick(true);
    // the stream of questions never stops on its own
    if(s.phase==='ACTIVE'&&s.role==='PLAYER'&&!mode&&keys<=banked&&!requests.pending()&&!me.challenge?.challengeId&&!me.recovery?.challengeId&&!me.attack?.attackId&&a.challengeTypes?.QUICK_QUESTION?.allowed&&now()-lastAsk>600){lastAsk=now();act('CHALLENGE_REQUEST',{type:'QUICK_QUESTION'});}
    const key=[s.sessionId,s.phase,s.role,me.passwordSelected,(me.passwordOptions||[]).join(),me.recovery?.challengeId,me.challenge?.challengeId,me.attack?.attackId,mode,keys>banked,keys,
      JSON.stringify(a.firewall||{}),JSON.stringify(a.multiplier||{}),JSON.stringify((a.targets||[]).map(t=>[t.playerId,t.attack?.allowed,t.attack?.cost,t.attack?.reason,t.specials?.TROJAN?.allowed])),
      mode?s.players.map(p=>p.nickname+p.accessPoints+(p.firewallLevel||1)).join():s.players.map(p=>p.nickname).join()].join('|');
    if(key!==viewKey){viewKey=key;build(s,me,mine);}
    tick(true);
  }
  // the per-question timer and the clock glide at display rate instead of stepping with the 4 Hz tick
  {const loop=()=>{requestAnimationFrame(loop);if(document.hidden||el('breach-screen').hidden)return;
     for(const i of document.querySelectorAll('#sbx-body .sbx-timer i')){const st=+i.dataset.start,en=+i.dataset.end;const f=en>st?Math.max(0,Math.min(1,(en-now())/(en-st))):0;i.style.transform='scaleX('+f.toFixed(4)+')';i.parentElement.classList.toggle('low',f<.3);}};requestAnimationFrame(loop);}
  function tick(fromRender){
    const s=getState()?.systemBreach;if(!s)return;
    el('sbx-clock').textContent=s.deadline>0?mmss(s.deadline-now()):'--:--';
    for(const i of document.querySelectorAll('#sbx-body .sbx-timer i')){const st=+i.dataset.start,en=+i.dataset.end;const f=en>st?Math.max(0,Math.min(1,(en-now())/(en-st))):0;i.style.transform='scaleX('+f.toFixed(3)+')';i.parentElement.classList.toggle('low',f<.3);}
    if(fromRender===true)return;
    if(requests.tick())render();else if(verdict||celebrateUntil||!getState()?.systemBreach?.self?.challenge?.challengeId)render();
    if(isAuthenticated()&&now()-lastSync>=1000){lastSync=now();send('SYNC',{},makeId());}
  }
  // Dev only: '?autoplay=1' taps the visible buttons like a player, to watch the phone screen play itself.
  if(/autoplay=1/.test(location.search)){
    setInterval(()=>{const b=[...document.querySelectorAll('#sbx-body button:not(:disabled)')];if(!b.length)return;
      const opts=b.filter(x=>x.classList.contains('sbx-option')),rest=b.filter(x=>!x.classList.contains('sbx-back'));
      const pick=a=>a[Math.floor(Math.random()*a.length)];const q=/^(\d+) ([+−×]) (\d+)/.exec(document.querySelector('#sbx-body .sbx-q')?.textContent||''),want=q?String(q[2]==='+'?+q[1]+ +q[3]:q[2]==='−'?q[1]-q[3]:q[1]*q[3]):'';const hit=opts.find(o=>o.querySelector('.sbx-val')?.textContent===want);(hit?hit:opts.length?pick(opts):rest.length?pick(rest):pick(b)).click();},1800);}
  return {action:act,render,tick,reset(){requests.reset();verdict=null;mode='';banked=0;seenKeys=-1;celebrateUntil=0;viewKey='';lastReceipt='';lastSync=0;},event(e){if(requests.event(e)){const code=requests.status();if(code&&code.startsWith('SB_'))say(REASONS[code]||'Не получилось');render();}}};
}
