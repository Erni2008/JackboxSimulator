'use strict';
/**
 * RARE MINDS private host monitor. Opened by the host from the desktop game (key M): the room code and host token
 * arrive in the URL fragment (never sent to the server, removed from the address bar at once) and the page polls the
 * host-only endpoint with the token in a header. Shows what every player is typing, what they locked, whether it is
 * valid, its rarity, and provisional collisions. Players' phones never receive this data.
 */
(function(){
  const lang=new URLSearchParams(location.search).get('lang')==='ru'?'ru':'en';
  const T=(ru,en)=>lang==='ru'?ru:en;document.documentElement.lang=lang;
  const $=id=>document.getElementById(id);
  let cred=null;
  try{const h=new URLSearchParams(location.hash.slice(1));if(h.get('room')&&h.get('token')){cred={room:h.get('room'),token:h.get('token')};sessionStorage.setItem('rm-monitor',JSON.stringify(cred));}
    else cred=JSON.parse(sessionStorage.getItem('rm-monitor')||'null');}catch{}
  history.replaceState(null,'',location.pathname+location.search);
  $('mon-private').textContent=T('ПРИВАТНЫЙ ЭКРАН ВЕДУЩЕГО · НЕ ПОКАЗЫВАТЬ ИГРОКАМ','PRIVATE HOST VIEW · DO NOT SHOW TO PLAYERS');
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const TIER={COMMON:T('ОБЫЧНЫЙ','COMMON'),UNCOMMON:T('НЕОБЫЧНЫЙ','UNCOMMON'),RARE:T('РЕДКИЙ','RARE'),EPIC:T('ЭПИЧЕСКИЙ','EPIC'),LEGENDARY:T('ЛЕГЕНДАРНЫЙ','LEGENDARY'),MYTHIC:T('МИФИЧЕСКИЙ','MYTHIC')};
  const CHECK={VALID:['ok',T('ВЕРНО','VALID')],VALID_TYPO:['ok',T('ВЕРНО · опечатка','VALID · typo')],INVALID:['bad',T('НЕ ПРИНЯТ','NOT ACCEPTED')],UNCERTAIN:['warn',T('НЕОДНОЗНАЧНО','AMBIGUOUS')],EMPTY:['',''] };
  let data=null,offset=0,failures=0;

  async function poll(){
    if(!cred){$('mon-status').textContent=T('Нет доступа: откройте монитор из игры ведущего (клавиша M).','No access: open the monitor from the host game (key M).');return;}
    try{
      const t0=performance.now();
      const r=await fetch(`/rooms/${encodeURIComponent(cred.room)}/rare-minds/monitor`,{headers:{'X-Host-Token':cred.token},cache:'no-store'});
      const j=await r.json();
      if(!r.ok){$('mon-status').textContent=j.code==='HOST_ONLY'||j.code==='INVALID_TOKEN'?T('Доступ только для ведущего.','Host only.'):T('Комната недоступна: ','Room unavailable: ')+(j.code||r.status);failures++;}
      else{data=j;failures=0;offset=j.serverTime-(Date.now()-(performance.now()-t0)/2);render();}
    }catch(e){failures++;$('mon-status').textContent=T('Нет связи с сервером…','No connection to the server…');}
    setTimeout(poll,failures?1500:350);
  }
  const name=id=>(data.roster||[]).find(p=>p.id===id)?.name||'?';
  const online=id=>(data.roster||[]).find(p=>p.id===id)?.online;

  function render(){
    if(!data.active){$('mon-status').textContent=T('Rare Minds сейчас не идёт.','Rare Minds is not running.');$('mon-grid').replaceChildren();$('mon-reveal').hidden=true;$('mon-qno').textContent='';$('mon-question').textContent='';return;}
    const ph=data.phase;
    $('mon-qno').textContent=data.question?`${T('ВОПРОС','QUESTION')} ${data.question} / ${data.questions}${data.finalQuestion?T(' · ПОСЛЕДНИЙ',' · FINAL'):''}`:T('ПРАВИЛА','RULES');
    $('mon-question').textContent=lang==='ru'?data.textRu||'':data.textEn||'';
    $('mon-status').textContent={INITIALIZING:T('Правила на экране','Rules on screen'),QUESTION_ACTIVE:T('Игроки печатают — видно только вам','Players are typing — visible to you only'),ANSWERS_LOCKED:T('Ответы закрыты','Answers locked'),REVEALING_RESULTS:T('Раскрытие','Reveal'),FINAL_RESULTS:T('Итоги','Results'),COMPLETED:T('Игра окончена','Match over')}[ph]||ph;
    document.body.dataset.final=String(!!data.finalQuestion);
    const live=new Map((data.live||[]).map(l=>[l.id,l]));
    $('mon-grid').innerHTML=data.players.map(p=>{
      const l=live.get(p.id)||{},col=(l.possibleCollision||[]).length>0;let [cls,label]=CHECK[l.check||'EMPTY']||['',''];if(!l.locked&&l.check==='INVALID'){cls='';label=T('ПЕЧАТАЕТ…','TYPING…');}
      const skulls=[0,1,2].map(i=>`<i class="${i<p.collisions?'on':''}"></i>`).join('');
      return `<article class="mon-card${col?' col':''}${p.alive?'':' ghost'}${p.deathZone?' zone':''}${l.locked?' locked':''}">
        <header><b>${esc(name(p.id))}</b>${online(p.id)?'':`<span class="off">${T('НЕ В СЕТИ','OFFLINE')}</span>`}<span class="life">${p.alive?(p.deathZone?T('ЗОНА СМЕРТИ','DEATH ZONE'):T('ЖИВ','ALIVE')):T('ПРИЗРАК','GHOST')}</span></header>
        <p class="typed">${ph==='QUESTION_ACTIVE'?(l.text?esc(l.text)+(l.locked?'':'<span class="caret"></span>'):`<span class="none">${T('…пока пусто','…nothing yet')}</span>`):''}</p>
        <p class="meta">${l.locked?`<span class="lock">${T('ЗАФИКСИРОВАН','LOCKED')}</span>`:''}${label?`<span class="chk ${cls}">${label}</span>`:''}${l.tier?`<span class="tier t-${l.tier}">${TIER[l.tier]}</span>`:''}${l.riskIt?`<span class="risk">${T('РИСК','RISK IT')}</span>`:''}</p>
        ${l.answerId?`<p class="canon">→ ${esc(lang==='ru'?l.labelRu:l.labelEn)}</p>`:''}
        ${col?`<p class="warn">${T('ВОЗМОЖНОЕ СОВПАДЕНИЕ','POSSIBLE COLLISION')}: ${l.possibleCollision.map(id=>esc(name(id))).join(', ')}</p>`:''}
        <footer><span class="skulls">${skulls}</span><span class="souls">${Number(p.souls).toLocaleString()} ${T('душ','souls')}</span>${!p.alive&&p.resurrectionPossible?`<span class="ghostp">${T('воскрешение','resurrection')} ${p.ghostUnique}/${data.questions-p.eliminatedAt}</span>`:''}</footer>
      </article>`;}).join('');
    const rv=data.reveal;
    if(rv&&ph!=='QUESTION_ACTIVE'&&ph!=='INITIALIZING'){
      $('mon-reveal').hidden=false;
      $('mon-reveal').innerHTML=`<h2>${T('Последний вопрос','Last question')} · ${rv.question}</h2><table><tbody>${rv.rows.map(r=>`<tr class="${r.collided?'col':''}"><td>${esc(name(r.playerId))}</td><td>${esc(r.text||'—')}</td><td>${r.valid?esc(lang==='ru'?r.labelRu:r.labelEn):T('неверно','invalid')}</td><td>${r.tier?TIER[r.tier]:''}</td><td>+${r.earned+r.jackpotSouls}</td><td>${[r.collided?T('совпадение','collision'):'',r.jackpot?T('джекпот','jackpot'):'',r.eliminated?T('выбыл','out'):'',r.resurrected?T('воскрес','back'):''].filter(Boolean).join(' · ')}</td></tr>`).join('')}</tbody></table>`;
    }else $('mon-reveal').hidden=true;
  }
  function clock(){
    if(data?.active&&data.phaseEndsAt>0){const left=Math.max(0,data.phaseEndsAt-(Date.now()+offset));$('mon-clock').textContent=data.phase==='QUESTION_ACTIVE'?Math.ceil(left/1000):'—';$('mon-clock').classList.toggle('hurry',data.phase==='QUESTION_ACTIVE'&&left<5000);}
    requestAnimationFrame(clock);
  }
  poll();clock();
})();
