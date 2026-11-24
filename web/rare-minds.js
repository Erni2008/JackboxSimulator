'use strict';
/**
 * RARE MINDS — DEADLY ANSWERS, the player's phone. Free-text answer, one lock per question, RISK IT in the death zone,
 * ghost mode with the resurrection track. The server owns time, validity, rarity, collisions and souls: the phone
 * only sends drafts (debounced, for the host's private monitor) and its locked answer, and never sees other players'
 * answers before the reveal.
 */
function createRareMindsController({getState,isAuthenticated,send,makeId,now}){
  const T=(ru,en)=>typeof faT==='function'?faT(ru,en):en;
  const mini=()=>getState()?.rareMinds;
  const DRAFT_MS=380;
  let built=false,root,els={},session='',question=0,risk=false,pending=null,lastDraftAt=0,draftTimer=0,lastSentDraft='',raf=0,autoSent=false,error='',errorAt=0,lastPhase='',lastQuestion=0;
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const tierName=id=>{const t=(mini()?.tiers||[]).find(x=>x.id===id);return t?T(t.ru,t.en):id;};
  const tierSouls=id=>(mini()?.tiers||[]).find(x=>x.id===id)?.souls||0;

  function build(){
    if(built)return;built=true;root=document.getElementById('rm-screen');
    root.innerHTML=`
      <header class="rm-top"><p class="rm-brand">RARE MINDS</p><p class="rm-sub">DEADLY ANSWERS</p>
        <div class="rm-clock" aria-hidden="true"><svg viewBox="0 0 64 64"><circle class="rm-clock-bg" cx="32" cy="32" r="28"/><circle class="rm-clock-arc" cx="32" cy="32" r="28" pathLength="100"/></svg><b data-k="clock">18</b></div></header>
      <div class="rm-status"><span class="rm-souls" data-k="souls">0</span><span class="rm-skulls" data-k="skulls"></span><span class="rm-life" data-k="life"></span></div>
      <div class="rm-card">
        <p class="rm-qno" data-k="qno"></p>
        <p class="rm-question" data-k="question"></p>
        <p class="rm-final" data-k="final" hidden>${T('ПОСЛЕДНИЙ ОТВЕТ · НАГРАДЫ ×2','THE LAST ANSWER · REWARDS ×2')}</p>
      </div>
      <div class="rm-answer" data-k="answerBox">
        <input data-k="input" type="text" inputmode="text" autocomplete="off" autocapitalize="sentences" autocorrect="off" spellcheck="false" maxlength="40" enterkeyhint="send" aria-label="${T('Твой ответ','Your answer')}" placeholder="${T('Редкий ответ…','A rare answer…')}">
        <button type="button" class="rm-risk" data-k="risk" hidden aria-pressed="false"><b>${T('РИСКНУТЬ','RISK IT')}</b><small>${T('эпический или легендарный уникальный ответ снимет одно совпадение','a unique epic or legendary answer removes one collision')}</small></button>
        <button type="button" class="rm-send" data-k="send" data-native-button>${T('ОТВЕТИТЬ','LOCK IN')}</button>
        <p class="rm-hint" data-k="hint" aria-live="polite"></p>
      </div>
      <div class="rm-locked" data-k="locked" hidden><p class="rm-eyebrow">${T('ОТВЕТ ПРИНЯТ','ANSWER LOCKED')}</p><p class="rm-mine" data-k="mine"></p><p class="rm-wait">${T('Ждём остальных…','Waiting for the others…')}</p></div>
      <div class="rm-result" data-k="result" hidden></div>
      <div class="rm-ghost" data-k="ghost" hidden></div>
      <div class="rm-intro" data-k="intro" hidden>
        <p class="rm-eyebrow">${T('КАК ИГРАТЬ','HOW TO PLAY')}</p>
        <ol><li>${T('Пиши любой верный ответ. Чем реже ответ, тем больше душ.','Type any valid answer. The rarer it is, the more souls.')}</li>
        <li>${T('Совпал с кем то? Получаешь череп. Три черепа, и ты призрак.','Matched someone? You get a skull. Three skulls and you are a ghost.')}</li>
        <li>${T('Самый редкий уникальный ответ забирает джекпот.','The rarest unique answer takes the jackpot.')}</li>
        <li>${T('Призрак вернётся, если до конца отвечает уникально.','A ghost returns by answering uniquely to the end.')}</li></ol>
      </div>
      <p class="rm-duel" data-k="duel" hidden></p>
      <p class="rm-look" data-k="look" hidden>${T('СМОТРИ НА ЭКРАН','LOOK AT THE SCREEN')}</p>`;
    root.querySelectorAll('[data-k]').forEach(e=>els[e.dataset.k]=e);
    els.input.addEventListener('input',()=>{error='';scheduleDraft();paintHint();});
    els.input.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();submit();}});
    els.send.addEventListener('click',submit);
    els.risk.addEventListener('click',()=>{risk=!risk;els.risk.setAttribute('aria-pressed',String(risk));els.risk.classList.toggle('on',risk);navigator.vibrate?.(risk?[20,40,20]:10);scheduleDraft(true);});
  }

  function scheduleDraft(force){
    const m=mini();if(!m||m.phase!=='QUESTION_ACTIVE'||m.me?.submitted||pending)return;
    const text=els.input.value;if(!force&&text===lastSentDraft)return;
    clearTimeout(draftTimer);
    const wait=Math.max(0,DRAFT_MS-(performance.now()-lastDraftAt));
    draftTimer=setTimeout(()=>{const mm=mini();if(!mm||mm.phase!=='QUESTION_ACTIVE'||!isAuthenticated())return;
      const t=els.input.value.slice(0,mm.maxAnswer||40);lastDraftAt=performance.now();lastSentDraft=t;
      send('RM_DRAFT',{sessionId:mm.sessionId,question:mm.question,text:t,risk});},wait);
  }
  function submit(){
    const m=mini();if(!m||m.phase!=='QUESTION_ACTIVE'||m.me?.submitted||pending||!isAuthenticated())return;
    const text=els.input.value.replace(/\s+/g,' ').trim();
    if(!text){error=T('Сначала напиши ответ','Type an answer first');paintHint();els.input.focus();return;}
    clearTimeout(draftTimer);
    const requestId=makeId();pending={requestId,text,question:m.question};
    send('RM_SUBMIT',{sessionId:m.sessionId,question:m.question,text,risk:risk&&!!m.me?.canRisk},requestId);
    els.input.blur();navigator.vibrate?.(25);render();
  }
  function event(e){
    if(e.type==='RARE_MINDS_REJECTED'){
      const code=e.payload?.code||'';if(pending&&e.requestId===pending.requestId)pending=null;
      error={RM_TOO_LATE:T('Время вышло','Time is up'),RM_ANSWERS_CLOSED:T('Приём ответов закрыт','Answers are closed'),RM_ALREADY_SUBMITTED:'',RM_EMPTY_ANSWER:T('Пустой ответ','Empty answer'),RM_ANSWER_TOO_LONG:T('Слишком длинно, до 40 знаков','Too long, 40 characters max'),RM_INVALID_ANSWER:T('Недопустимые символы','Invalid characters'),RATE_LIMITED:T('Слишком часто, подожди секунду','Too fast, wait a second')}[code]??T('Не получилось отправить','Could not send');
      errorAt=performance.now();render();
    }
  }
  function reset(){session='';question=0;risk=false;pending=null;lastSentDraft='';autoSent=false;error='';clearTimeout(draftTimer);cancelAnimationFrame(raf);raf=0;if(built){els.input.value='';}}
  function suspend(){cancelAnimationFrame(raf);raf=0;clearTimeout(draftTimer);}

  function me(){const m=mini();return m?.players?.find(p=>p.id===getState()?.selfId);}
  function skulls(n,ghost){let h='';for(let i=0;i<3;i++)h+=`<i class="${i<n?'on':''}${ghost?' g':''}"></i>`;return h;}
  function paintHint(){
    const m=mini();if(!m)return;const len=[...els.input.value].length;
    els.hint.textContent=error||(m.me?.canRisk?T('Зона смерти: ещё одно совпадение, и ты призрак','Death zone: one more collision and you are a ghost'):len?`${len} / ${m.maxAnswer||40}`:'');
    els.hint.classList.toggle('err',!!error);
  }

  function render(){
    build();const m=mini();if(!m)return;
    if(m.sessionId!==session){reset();session=m.sessionId;}
    if(m.question!==question){question=m.question;risk=false;pending=null;lastSentDraft='';autoSent=false;error='';els.input.value='';els.risk.classList.remove('on');els.risk.setAttribute('aria-pressed','false');}
    if(pending&&(m.me?.submitted||m.phase!=='QUESTION_ACTIVE'))pending=null;
    const p=me()||{},ghost=p.alive===false,ph=m.phase;
    root.dataset.phase=ph;root.dataset.ghost=String(ghost);root.dataset.final=String(!!m.finalQuestion);root.dataset.zone=String(!!p.deathZone);
    els.souls.textContent=Number(p.souls||0).toLocaleString();els.souls.setAttribute('aria-label',T('Души в этой игре','Souls this game'));
    els.skulls.innerHTML=skulls(p.collisions||0,ghost);els.skulls.setAttribute('aria-label',`${p.collisions||0} / 3`);
    els.life.textContent=ghost?T('ПРИЗРАК','GHOST'):p.deathZone?T('ЗОНА СМЕРТИ','DEATH ZONE'):T('ЖИВ','ALIVE');
    els.qno.textContent=m.question?`${T('ВОПРОС','QUESTION')} ${m.question} / ${m.questions}`:'';
    els.question.textContent=m.textEn?T(m.textRu,m.textEn):T('Приготовься…','Get ready…');
    els.final.hidden=!m.finalQuestion||ph==='INITIALIZING';
    const active=ph==='QUESTION_ACTIVE',locked=active&&(m.me?.submitted||!!pending);
    els.intro.hidden=ph!=='INITIALIZING';
    els.answerBox.hidden=!active||locked;
    els.locked.hidden=!locked;
    if(locked)els.mine.textContent=m.me?.answer||pending?.text||'';
    els.risk.hidden=!(active&&m.me?.canRisk);
    els.send.disabled=!isAuthenticated()||!!pending;
    paintHint();
    renderGhost(m,p,ghost);renderResult(m,p);
    // DUELS format: your fixed opponent and the score
    const opp=p.opponent&&m.players.find(x=>x.id===p.opponent),oppName=opp&&(getState().players||[]).find(x=>x.id===opp.id)?.name;
    els.duel.hidden=!opp;if(opp)els.duel.innerHTML=`<b>${T('ДУЭЛЬ 1 НА 1','1-ON-1 DUEL')}</b> ${T('против','vs')} ${esc(oppName||'?')} · ${p.duelWins||0} : ${opp.duelWins||0}`;
    els.look.hidden=!(ph==='ANSWERS_LOCKED'||ph==='REVEALING_RESULTS'||ph==='FINAL_RESULTS'||ph==='COMPLETED');
    if(lastPhase!==ph||lastQuestion!==m.question){lastPhase=ph;lastQuestion=m.question;if(active&&!locked&&!ghost&&document.activeElement!==els.input&&matchMedia('(pointer:fine)').matches)els.input.focus();}
    if(!raf)tick();
  }
  function renderGhost(m,p,ghost){
    if(!ghost||m.phase==='FINAL_RESULTS'||m.phase==='COMPLETED'){els.ghost.hidden=true;return;}
    els.ghost.hidden=false;const total=m.questions-p.eliminatedAt,done=p.ghostUnique||0;let dots='';
    for(let i=0;i<total;i++)dots+=`<i class="${i<done?'ok':!p.resurrectionPossible&&i===done?'x':''}"></i>`;
    els.ghost.innerHTML=p.resurrectionPossible
      ?`<p class="rm-eyebrow">${T('ВОСКРЕШЕНИЕ','RESURRECTION')}</p><p>${T('Отвечай уникально на каждый оставшийся вопрос. Редкость не важна.','Answer uniquely on every remaining question. Rarity does not matter.')}</p><div class="rm-dots">${dots}</div><p class="rm-small">${T('Осталось','Remaining')}: ${p.ghostRemaining}</p>`
      :`<p class="rm-eyebrow">${T('ТЫ ПРИЗРАК','YOU ARE A GHOST')}</p><p>${m.questions===p.eliminatedAt?T('Выбыл на последнем вопросе: вернуться уже нельзя.','Out on the last question: no way back now.'):T('Воскрешение потеряно. Отвечай дальше: души копятся, а твои ответы всё ещё мешают живым.','Resurrection is lost. Keep answering: souls still count and your answers still collide with the living.')}</p><div class="rm-dots">${dots}</div>`;
  }
  function renderResult(m,p){
    const show=(m.phase==='ANSWERS_LOCKED'||m.phase==='REVEALING_RESULTS')&&m.reveal,fin=m.phase==='FINAL_RESULTS'||m.phase==='COMPLETED';
    if(!show&&!fin){els.result.hidden=true;return;}
    els.result.hidden=false;const self=getState()?.selfId;
    if(fin){const st=(m.standings||[]).find(s=>s.playerId===self);
      els.result.innerHTML=st?`<p class="rm-eyebrow">${T('ИТОГ','RESULT')}</p><p class="rm-rank">${st.winner?T('ПОБЕДА','VICTORY'):`#${st.rank}`}</p><p class="rm-big">${Number(st.souls).toLocaleString()} <small>${T('душ','souls')}</small></p>${st.winner?`<p class="rm-tag gold">+${st.winnerBonus} ${T('за победу','winner bonus')}</p>`:''}${st.alive?'':`<p class="rm-tag">${T('Призраки не могут победить','Ghosts cannot win')}</p>`}`:'';return;}
    const r=m.reveal.rows.find(x=>x.playerId===self);if(!r){els.result.hidden=true;return;}
    const tags=[];
    if(!r.text)tags.push(`<p class="rm-tag">${T('Нет ответа','No answer')}</p>`);
    else if(!r.valid)tags.push(`<p class="rm-tag red">${r.status==='UNCERTAIN'?T('Не удалось однозначно распознать','Could not be recognised with certainty'):T('Неверный ответ','Not a valid answer')}</p>`);
    if(r.collided)tags.push(`<p class="rm-tag red">${T('СОВПАДЕНИЕ','COLLISION')} ×${r.sharedWith}${r.penaltyPct?` · −${r.penaltyPct}%`:''}</p>`);
    if(r.risk==='SAVED')tags.push(`<p class="rm-tag gold">${T('РИСК ОПРАВДАН · череп снят','RISK PAID OFF · skull removed')}</p>`);
    if(r.risk==='HELD')tags.push(`<p class="rm-tag">${T('Риск: ответ недостаточно редкий','Risk: not rare enough')}</p>`);
    if(r.jackpot)tags.push(`<p class="rm-tag gold">${T('ДЖЕКПОТ','JACKPOT')} +${r.jackpotSouls}${r.jackpotStreak>1?` · ${T('серия','streak')} ×${r.jackpotStreak}`:''}</p>`);
    if(r.eliminated)tags.push(`<p class="rm-tag red">${T('ВЫБЫВАНИЕ','ELIMINATED')} · −${r.deathPenalty} ${T('душ','souls')}</p>`);
    if(r.ghostSuccess)tags.push(`<p class="rm-tag ghost">${T('Уникально! Шаг к воскрешению','Unique! One step closer to coming back')}</p>`);
    if(r.resurrectionLost)tags.push(`<p class="rm-tag red">${T('Воскрешение потеряно','Resurrection lost')}</p>`);
    if(r.duel>0)tags.push(`<p class="rm-tag gold">${T('ДУЭЛЬ ВЫИГРАНА','DUEL WON')} +${r.duelBonus}</p>`);
    if(r.duel<0)tags.push(`<p class="rm-tag red">${T('Дуэль проиграна','Duel lost')}</p>`);
    if(r.resurrected)tags.push(`<p class="rm-tag gold">${T('ВОСКРЕШЁН!','RESURRECTED!')} +100</p>`);
    els.result.innerHTML=`<p class="rm-eyebrow">${T('ТВОЙ ОТВЕТ','YOUR ANSWER')}</p><p class="rm-mine">${esc(r.valid?T(r.labelRu,r.labelEn):r.text||'—')}</p>
      ${r.valid?`<p class="rm-tier t-${esc(r.tier)}">${esc(tierName(r.tier))} · ${tierSouls(r.tier)*(m.reveal.final?2:1)}</p>`:''}
      <p class="rm-big">+${r.earned+(r.jackpotSouls||0)+(r.duelBonus||0)} <small>${T('душ','souls')}</small></p>${tags.join('')}`;
  }
  function tick(){
    const m=mini();if(!m||!root||root.hidden){raf=0;return;}
    const left=m.phaseEndsAt>0?Math.max(0,m.phaseEndsAt-now()):0,active=m.phase==='QUESTION_ACTIVE';
    const s=active?Math.ceil(left/1000):0;
    if(els.clock.textContent!==String(s))els.clock.textContent=active?String(s):'·';
    const frac=active?Math.min(1,left/(m.answerMs||18000)):0;
    root.style.setProperty('--rm-left',String(frac));root.dataset.hurry=String(active&&left<5000);
    // whatever is typed but not locked goes in just before the deadline (the server also time-locks the last draft)
    if(active&&!autoSent&&left<450&&left>0&&!m.me?.submitted&&!pending&&els.input.value.trim()){autoSent=true;submit();}
    if(error&&performance.now()-errorAt>3500&&!els.input.value){error='';paintHint();}
    raf=requestAnimationFrame(tick);
  }
  return {render,event,reset,suspend};
}
