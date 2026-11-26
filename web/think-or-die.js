'use strict';
/**
 * THINK OR DIE — the player's phone. One category, as many answers as you can before the server deadline: type,
 * Enter, type again (the field clears and keeps focus). Your own answers show pending / accepted / rejected /
 * repeat; nobody else's answers ever reach this phone before the reveal. The server owns time, validation,
 * originality, points, votes and resurrection.
 */
function createThinkOrDieController({getState,isAuthenticated,send,makeId,now}){
  const T=(ru,en)=>typeof faT==='function'?faT(ru,en):en;
  const mini=()=>getState()?.thinkOrDie;
  let seenRows=new Set(),built=false,root,els={},session='',round=0,raf=0,error='',errorAt=0,outbox=[],held=null,lastPhase='',lastKey='',lastSendAt=0;
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  // built on every use: the room language can change after this controller is created
  const STATES=()=>({
    PENDING:[T('проверка','checking'),'p'],ACCEPTED:[T('принято','accepted'),'ok'],REJECTED:[T('неверно','wrong'),'bad'],DUPLICATE:[T('повтор','repeat'),'dup'],
    UNIQUE:[T('уникально','unique'),'gold'],SHARED:[T('у двоих','shared by 2'),'ok'],MANY:[T('у многих','common'),'many'],INVALID:[T('неверно','wrong'),'bad'],
    UNCERTAIN:[T('не проверено','unchecked'),'p'],SENDING:[T('отправка','sending'),'p'],
    SENT:[T('отправлено','sent'),'sent'],WRONG_LIVE:[T('неверно · не засчитано','wrong · not counted'),'bad'],REPEAT_LIVE:[T('уже было · не засчитано','already given · not counted'),'dup'],REPEAT:[T('уже было','already sent'),'dup'],CROWD:[T('у всех · 0','everyone · 0'),'bad']});

  function build(){
    if(built)return;built=true;root=document.getElementById('tod-screen');
    root.innerHTML=`
      <header class="tod-top"><p class="tod-brand"><img src="/ui/tod/logo.webp" alt="THINK OR DIE"></p><p class="tod-round" data-k="round"></p>
        <div class="tod-clock" aria-hidden="true"><b data-k="clock">30</b></div></header>
      <div class="tod-bar" aria-hidden="true"><i></i></div>
      <p class="tod-ghost" data-k="ghost" hidden></p>
      <div class="tod-card"><p class="tod-eyebrow" data-k="eyebrow"></p><p class="tod-cat" data-k="cat"></p></div>
      <div class="tod-intro" data-k="intro" hidden>
        <p class="tod-eyebrow">${T('КАК ИГРАТЬ','HOW TO PLAY')}</p>
        <ol><li data-k="rule1">${T('Одна категория на всех. За 30 секунд напиши как можно больше верных ответов.','One category for everyone. Write as many correct answers as you can in 30 seconds.')}</li>
        <li>${T('Количество решает. Ответ, которого нет ни у кого, стоит больше.','Quantity wins. An answer nobody else gave is worth more.')}</li>
        <li>${T('Неверный ответ и свой повтор просто не дают очков.','A wrong answer or a repeat simply scores nothing.')}</li>
        <li>${T('Призрак оживает: пять верных ответов за раунд, и все только твои.','A ghost comes back: five correct answers in one round, all of them yours alone.')}</li></ol>
        <p class="tod-pts" data-k="pts"></p>
      </div>
      <section class="tod-surv" data-k="surv" hidden>
        <div class="tod-turn" data-k="turn"></div>
        <div class="tod-fuse" aria-hidden="true"><i></i><b></b></div>
        <div class="tod-verdict" data-k="verdict" aria-live="polite"></div>
        <ul class="tod-lives" data-k="lives"></ul>
      </section>
      <form class="tod-form" data-k="form" autocomplete="off" hidden>
        <input data-k="input" type="text" inputmode="text" autocomplete="off" autocapitalize="sentences" autocorrect="off" spellcheck="false" maxlength="40" enterkeyhint="send" aria-label="${T('Ответ','Answer')}" placeholder="${T('Пиши и жми Enter…','Type and press Enter…')}">
        <button type="submit" class="tod-send" data-k="send" data-native-button aria-label="${T('Отправить','Send')}">${T('ОТПРАВИТЬ','SEND')}</button>
        <p class="tod-hint" data-k="hint" aria-live="polite"></p>
      </form>
      <div class="tod-count" data-k="count" hidden></div>
      <div class="tod-vote" data-k="vote" hidden></div>
      <div class="tod-result" data-k="result" hidden></div>
      <ul class="tod-list" data-k="list" aria-label="${T('Твои ответы','Your answers')}"></ul>
      <p class="tod-look" data-k="look" hidden>${T('СМОТРИ НА ЭКРАН','LOOK AT THE SCREEN')}</p>`;
    root.querySelectorAll('[data-k]').forEach(e=>els[e.dataset.k]=e);
    els.form.addEventListener('submit',e=>{e.preventDefault();submit();});
    // tapping SEND must not take the focus away from the field (the keyboard stays open on iOS and Android)
    els.send.addEventListener('pointerdown',e=>{if(document.activeElement===els.input)e.preventDefault();});
    els.input.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.isComposing){e.preventDefault();submit();}});
    els.input.addEventListener('input',()=>{if(error){error='';paintHint();}});
    els.vote.addEventListener('click',e=>{const b=e.target.closest('button[data-d]');if(!b)return;const m=mini();if(!m||!isAuthenticated())return;
      send('TOD_VOTE',{sessionId:m.sessionId,disputeId:b.dataset.d,accept:b.dataset.v==='1'});navigator.vibrate?.(15);
      b.closest('li')?.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b));});
    // keep the field visible above the on-screen keyboard
    const fit=()=>{const vv=window.visualViewport;if(!vv)return;root.style.setProperty('--tod-vh',vv.height+'px');root.style.setProperty('--tod-vt',vv.offsetTop+'px');
      if(document.activeElement===els.input)els.form.scrollIntoView({block:'nearest'});};
    window.visualViewport?.addEventListener('resize',fit);window.visualViewport?.addEventListener('scroll',fit);fit();
  }

  function submit(){
    const m=mini();if(!m||!isAuthenticated())return;
    const surv=m.mode==='survival';
    if(surv?!(m.phase==='TURN'&&m.survival?.turnPlayer===getState()?.selfId):m.phase!=='ANSWERING')return;
    const text=els.input.value.replace(/\s+/g,' ').trim();
    if(!text){els.input.focus();return;}
    if(performance.now()-lastSendAt<260)return; // the server's anti-spam floor
    lastSendAt=performance.now();
    if(surv){const requestId=makeId();lastSendAt=performance.now();send('TOD_SUBMIT',{sessionId:m.sessionId,round:m.round,text},requestId);els.input.value='';navigator.vibrate?.(12);return;}
    if(held&&held.text===text)return; // still checking this exact answer
    const requestId=makeId(),have=(m.me?.history||[]).filter(h=>h.text===text).length;held={text,n:(m.me?.history||[]).length,round:m.round};
    outbox.push({requestId,text,have,round:m.round});
    send('TOD_SUBMIT',{sessionId:m.sessionId,round:m.round,text},requestId);
    els.input.focus();render();
  }
  function event(e){
    if(e.type!=='THINK_OR_DIE_REJECTED')return;
    const code=e.payload?.code||'';outbox=outbox.filter(o=>o.requestId!==e.requestId);held=null;
    error={TOD_TOO_LATE:T('Время вышло','Time is up'),TOD_NOT_YOUR_TURN:T('Сейчас не твой ход','It is not your turn'),TOD_ANSWERS_CLOSED:T('Приём ответов закрыт','Answers are closed'),TOD_EMPTY_ANSWER:'',TOD_ANSWER_TOO_LONG:T('До 40 знаков','40 characters max'),
      TOD_TOO_FAST:T('Чуть медленнее','A little slower'),TOD_TOO_MANY_ANSWERS:T('Лимит ответов в раунде','Answer limit for this round'),RATE_LIMITED:T('Чуть медленнее','A little slower'),TOD_OWN_ANSWER:T('За свой ответ голосовать нельзя','You cannot vote on your own answer')}[code]??T('Не отправлено','Not sent');
    errorAt=performance.now();render();
  }
  function reset(){session='';round=0;outbox=[];held=null;error='';lastPhase='';lastKey='';cancelAnimationFrame(raf);raf=0;if(built)els.input.value='';}
  function suspend(){cancelAnimationFrame(raf);raf=0;}
  function paintHint(){els.hint.textContent=error;els.hint.classList.toggle('err',!!error);}
  const me=()=>{const m=mini();return m?.players?.find(p=>p.id===getState()?.selfId)||{};};

  function render(){
    build();const m=mini();if(!m)return;
    if(m.sessionId!==session){reset();session=m.sessionId;}
    if(m.mode==='survival'){renderSurvival(m);return;}
    if(m.round!==round){round=m.round;outbox=[];held=null;error='';els.input.value='';}
    const hist=m.me?.history||[];
    outbox=outbox.filter(o=>o.round===m.round&&hist.filter(h=>h.text===o.text).length<=o.have);
    const p=me(),ph=m.phase,ghost=!!p.ghost;
    const match=!!m.integrated;
    root.dataset.phase=ph;root.dataset.ghost=String(ghost);root.dataset.mode=match?'match':'show';root.dataset.survival='';if(els.surv)els.surv.hidden=true;
    els.round.textContent=match?T('ИСПЫТАНИЕ','CHALLENGE'):m.round?`${T('РАУНД','ROUND')} ${m.round} / ${m.rounds}`:'';
    els.eyebrow.textContent=ph==='INTRO'?T('ПРИГОТОВЬСЯ','GET READY'):ph==='CATEGORY_REVEAL'?T('КАТЕГОРИЯ','THE CATEGORY'):T('НАЗОВИ','NAME IT');
    els.cat.textContent=m.textEn?T(m.textRu,m.textEn):T('Думай быстро. Или умри.','Think fast. Or die.');
    els.intro.hidden=ph!=='INTRO';
    if(ph==='INTRO'&&match){const pt=m.points||{},sec=Math.round((m.answerMs||25000)/1000);
      els.rule1.textContent=T(`Одна категория на всех. За ${sec} секунд напиши как можно больше верных ответов.`,`One category for everyone. Write as many correct answers as you can in ${sec} seconds.`);
      els.pts.innerHTML=`${T('Души','Souls')}: <b class="g">+${pt.unique}</b> ${T('только у тебя','only you')} · <b>+${pt.two}</b> ${T('у двоих','two players')} · <b>+${pt.three}</b> ${T('у троих','three')} · <b class="r">${pt.crowd}</b> ${T('у четырёх и больше','four or more')}`;}
    else if(ph==='INTRO'){const pt=m.points||{};els.pts.innerHTML=`<b class="g">${pt.unique}</b> ${T('только у тебя','only you')} · <b>${pt.two}</b> ${T('у двоих','two players')} · <b>${pt.many}</b> ${T('у трёх и больше','three or more')} · <b class="r">${pt.invalid}</b> ${T('неверно','wrong')}`;}
    const answering=ph==='ANSWERING';
    els.form.hidden=!answering;
    els.send.disabled=!isAuthenticated();
    els.ghost.hidden=!(ghost&&!['FINAL_RESULTS','COMPLETED'].includes(ph));
    if(ghost)els.ghost.textContent=T(`ТЫ ПРИЗРАК · ${m.resurrectMin} верных уникальных ответов за раунд вернут тебя к жизни`,`YOU ARE A GHOST · ${m.resurrectMin} correct unique answers in one round bring you back`);
    // own answers, newest first
    // the verdict for the answer still in the field: wrong stays there with a warning, counted clears it
    if(held){const v=hist.length>held.n?hist[hist.length-1]:null; // the server keeps the cleaned text; the newest entry is this answer
      if(v&&v.state!=='PENDING'&&v.state!=='SENDING'){const same=els.input.value.replace(/\s+/g,' ').trim()===held.text;
        if(v.state==='WRONG_LIVE'){navigator.vibrate?.([40,50,40]);error=T('Неверный ответ. Исправь и отправь снова','Wrong answer. Fix it and send again');errorAt=performance.now();}
        else if(v.state==='REPEAT_LIVE'){navigator.vibrate?.([40,50,40]);error=T('Этот ответ уже был','You already gave this answer');errorAt=performance.now();if(same)els.input.select();}
        else{error='';if(same)els.input.value='';navigator.vibrate?.(12);}
        held=null;}}
    if(held&&ph==='ANSWERING'&&!error){error=T('Проверяем…','Checking…');errorAt=performance.now();}
    const rows=[...hist].reverse().filter(r=>!['WRONG_LIVE','REPEAT_LIVE','PENDING','SENDING'].includes(r.state));
    const key=JSON.stringify(rows)+ph;
    if(key!==lastKey){lastKey=key;
      const STATE=STATES();let refused='',back='';
      els.list.innerHTML=rows.map(r=>{const st=STATE[r.state]||STATE.PENDING;const rk=(r.id||'o:'+r.text)+':'+r.state;const fresh=!seenRows.has(rk);seenRows.add(rk);
        const bad=r.state==='WRONG_LIVE'||r.state==='REPEAT_LIVE';if(fresh&&bad){refused=r.state;if(r.state==='WRONG_LIVE')back=r.text;}
        if(bad)return ''; // refused answers never join the list: a wrong one goes back into the field to fix
        return `<li class="s-${st[1]}${fresh?' fresh':''}"><span>${esc(r.label||r.text)}</span><em>${esc(st[0])}${r.points!=null?` · ${r.points>0?'+':''}${r.points}`:''}</em></li>`;}).join('');
      // a refused answer: short buzz and a hint, the field stays ready for the next one
      if(false){
      }}
    els.list.hidden=!rows.length||ph==='INTRO'||ph==='CATEGORY_REVEAL'||ph==='FINAL_RESULTS'||ph==='COMPLETED';
    els.count.hidden=!(answering||ph==='ANSWER_VALIDATION');
    if(!els.count.hidden)els.count.innerHTML=ph==='ANSWER_VALIDATION'?`<b>${T('ПРОВЕРЯЕМ ОТВЕТЫ…','CHECKING ANSWERS…')}</b>`:`<b>${(m.me?.count??hist.length)+outbox.length}</b> ${T('ответов отправлено','answers sent')}`;
    renderVote(m);renderResult(m,p);
    els.look.hidden=!['ANSWER_REVEAL','ROUND_RESULTS','FINAL_RESULTS','COMPLETED','CATEGORY_REVEAL'].includes(ph);
    paintHint();
    if(lastPhase!==ph){lastPhase=ph;if(answering){navigator.vibrate?.([30,60,30]);setTimeout(()=>els.input.focus(),40);}}
    if(!raf)tick();
  }
  /** Survival: one player answers at a time. Only that phone gets the field; everyone sees whose turn it is, the last
   *  verdict, their own lives and the answers already used in this category. */
  let survTurnKey='';
  function renderSurvival(m){
    const sv=m.survival||{},ph=m.phase,self=getState()?.selfId,mine=sv.turnPlayer===self&&ph==='TURN';
    const roster=getState()?.players||[],nameOf=id=>(roster.find(p=>p.id===id)||{}).name||'?';
    const p=me(),lives=p.lives??0,max=sv.lives||3,out=lives<=0;
    root.dataset.phase=ph;root.dataset.ghost=String(out);root.dataset.mode='match';root.dataset.survival='1';
    els.round.textContent=T('ВЫЖИВАНИЕ','SURVIVAL');
    els.eyebrow.textContent=mine?T('ТВОЙ ХОД!','YOUR TURN!'):ph==='INTRO'?T('ПРИГОТОВЬСЯ','GET READY'):T('КАТЕГОРИЯ','THE CATEGORY');
    els.cat.textContent=m.textEn?T(m.textRu,m.textEn):T('Отвечай по очереди. Не умри.','Answer in turn. Do not die.');
    els.intro.hidden=ph!=='INTRO';
    if(ph==='INTRO'){const li=els.intro.querySelectorAll('li');const rules=[
        T('Отвечайте по очереди: назови новый верный ответ, пока горит фитиль.','Take turns: name a new correct answer before the fuse burns out.'),
        T('Нельзя повторять ни свои, ни чужие ответы.','No repeats: not yours and not anybody else\'s.'),
        T(`Ошибка, повтор или конец времени отнимают жизнь. У каждого ${max} жизни.`,`A wrong answer, a repeat or running out of time costs a life. Everyone has ${max}.`),
        T('Время хода сокращается. Последний выживший забирает души.','Turns get shorter. The last survivor takes the souls.')];
      li.forEach((x,i)=>{x.textContent=rules[i]||'';});els.pts.innerHTML='';}
    // the survival panel: who is answering, the fuse, the last verdict, everybody's lives
    els.surv.hidden=!['TURN','TURN_CHECK','TURN_RESULT','CATEGORY_REVEAL'].includes(ph);
    const charOf=id=>(roster.find(p=>p.id===id)||{}).characterId||'';
    if(!els.surv.hidden){
      const tp=sv.turnPlayer||'',me2=tp===self;
      els.turn.innerHTML=ph==='CATEGORY_REVEAL'?`<p class="tod-turn-k">${T('НОВАЯ КАТЕГОРИЯ','A NEW CATEGORY')}</p>`
        :tp?`<img src="/portraits/${esc(charOf(tp))}.webp" alt=""><div><p class="tod-turn-k">${ph!=='TURN'?T('ОТВЕТИЛ','ANSWERED'):me2?T('ТВОЙ ХОД','YOUR TURN'):T('ОТВЕЧАЕТ','NOW ANSWERING')}</p><p class="tod-turn-n">${ph==='TURN'&&me2?T('Отвечай!','Answer now!'):me2?T('Ты','You'):esc(nameOf(tp))}</p></div>`:'';
      els.turn.classList.toggle('mine',me2&&ph==='TURN');
      els.surv.querySelector('.tod-fuse').hidden=ph!=='TURN';
      let v='';const last=sv.last||{};
      if(ph==='TURN_CHECK')v=`<p class="chk">${T('Проверяем ответ…','Checking the answer…')}</p>`;
      else if(ph==='TURN_RESULT'){const ok=last.outcome==='CORRECT',what=esc(last.label||last.text||'');
        const why=last.outcome==='CORRECT'?T('принято','accepted'):last.outcome==='TIMEOUT'?T('время вышло · минус жизнь','time is up · one life lost'):last.outcome==='REPEAT'?T('уже было · минус жизнь','already said · one life lost'):T('неверно · минус жизнь','wrong · one life lost');
        v=`<p class="${ok?'ok':'bad'}"><b>${last.outcome==='TIMEOUT'?esc(nameOf(last.player)):what}</b><small>${why}</small></p>`+(last.eliminated?`<p class="out">${esc(nameOf(last.player))} ${T('выбывает','is out')}</p>`:'');}
      els.verdict.innerHTML=v;
      const lk=JSON.stringify((m.players||[]).map(p=>[p.id,p.lives]))+tp+ph;
      if(els.lives.dataset.k!==lk){els.lives.dataset.k=lk;
        els.lives.innerHTML=(m.players||[]).map(p=>{const l=p.lives??0,out=l<=0;let h='';for(let i=0;i<max;i++)h+=`<i class="${i<l?'on':''}"></i>`;
          return `<li class="${out?'out':''}${p.id===tp&&ph==='TURN'?' turn':''}${p.id===self?' me':''}"><img src="/portraits/${esc(charOf(p.id))}.webp" alt=""><span>${p.id===self?T('ТЫ','YOU'):esc(nameOf(p.id))}</span><em>${h}</em></li>`;}).join('');}
    }
    els.form.hidden=!mine;els.send.disabled=!isAuthenticated();
    els.ghost.hidden=!out||['FINAL_RESULTS','COMPLETED'].includes(ph);
    if(out)els.ghost.textContent=T('ТЫ ВЫБЫЛ · смотри, кто выживет','YOU ARE OUT · watch who survives');
    els.vote.hidden=true;
    // whose turn / the last verdict
    let info='';const last=sv.last||{};
    if(ph==='TURN'&&!mine)info=`<b>${esc(nameOf(sv.turnPlayer))}</b> ${T('отвечает…','is answering…')}`;
    else if(ph==='TURN_CHECK')info=`<b>${T('ПРОВЕРЯЕМ…','CHECKING…')}</b>`;
    else if(ph==='TURN_RESULT'){const who=esc(nameOf(last.player)),what=esc(last.label||last.text||'');
      info=last.outcome==='CORRECT'?`<b class="ok">${what}</b> ✓`:last.outcome==='TIMEOUT'?`${who}: <b class="bad">${T('время вышло','time is up')}</b>`:`${who}: <b class="bad">${what}</b> · ${last.outcome==='REPEAT'?T('уже было','already said'):T('неверно','wrong')}`;
      if(last.eliminated)info+=`<br><b class="bad">${who} ${T('выбывает','is out')}</b>`;
      if(last.player===self&&last.outcome!=='CORRECT')navigator.vibrate?.([60,40,60]);}
    else if(ph==='CATEGORY_REVEAL')info=T('Новая категория','A new category');
    els.count.hidden=true;void info;
    // answers already used in this category
    const used=[...(sv.used||[])].reverse();const key=JSON.stringify(used)+ph;
    if(key!==lastKey){lastKey=key;els.list.innerHTML=used.map(u=>`<li class="s-ok"><span>${esc(u.label)}</span><em>${esc(nameOf(u.player))}</em></li>`).join('');}
    els.list.hidden=!used.length||ph==='INTRO'||ph==='FINAL_RESULTS'||ph==='COMPLETED';els.list.dataset.title=T('УЖЕ НАЗВАНО','ALREADY SAID');
    // final standings
    const fin=ph==='FINAL_RESULTS'||ph==='COMPLETED';
    if(fin){const st=(m.standings||[]).find(s=>s.playerId===self);els.result.hidden=!st;
      if(st)els.result.innerHTML=`<p class="tod-eyebrow">${T('ИТОГ','FINAL')}</p><p class="tod-rank">#${st.rank}</p><p class="tod-stats">${st.correct} ${T('верных ответов','correct answers')}</p>${st.souls?`<p class="tod-souls">+${Number(st.souls).toLocaleString()} ${T('душ','souls')}</p>`:''}${st.rank===1?`<p class="tod-tag gold">${T('ТЫ ВЫЖИЛ!','YOU SURVIVED!')}</p>`:''}`;}
    else els.result.hidden=true;
    els.look.hidden=!(fin||ph==='INTRO'||ph==='CATEGORY_REVEAL');
    paintHint();
    const tk=ph+':'+sv.turnPlayer+':'+m.phaseStartedAt;
    if(tk!==survTurnKey){survTurnKey=tk;if(mine){navigator.vibrate?.([30,60,30]);els.input.value='';setTimeout(()=>els.input.focus(),40);}}
    if(!raf)tick();
  }
  function renderVote(m){
    if(m.phase!=='DISPUTE'){els.vote.hidden=true;return;}
    els.vote.hidden=false;
    els.vote.innerHTML=`<p class="tod-eyebrow">${T('СПОРНЫЕ ОТВЕТЫ','DISPUTED ANSWERS')}</p><p class="tod-small">${T('Подходит ли ответ к категории? Автор скрыт.','Does it fit the category? The author is hidden.')}</p><ul>`+
      (m.disputes||[]).map(d=>d.mine?`<li class="mine"><span>«${esc(d.text)}»</span><em>${T('твой ответ · решают другие','your answer · the others decide')}</em></li>`
        :`<li><span>«${esc(d.text)}»</span><div><button type="button" data-d="${esc(d.id)}" data-v="1" class="yes${d.myVote===true?' on':''}">${T('ПРИНЯТЬ','ACCEPT')}</button><button type="button" data-d="${esc(d.id)}" data-v="0" class="no${d.myVote===false?' on':''}">${T('ОТКЛОНИТЬ','REJECT')}</button></div></li>`).join('')+`</ul>`;
  }
  function renderResult(m,p){
    const ph=m.phase,fin=ph==='FINAL_RESULTS'||ph==='COMPLETED';
    if(!(ph==='ANSWER_REVEAL'||ph==='ROUND_RESULTS'||fin)){els.result.hidden=true;return;}
    els.result.hidden=false;
    if(fin&&m.integrated)return renderResult({...m,phase:'ROUND_RESULTS'},p);
    if(fin){const st=(m.standings||[]).find(s=>s.playerId===getState()?.selfId);if(!st){els.result.hidden=true;return;}
      els.result.innerHTML=`<p class="tod-eyebrow">${T('ИТОГ','FINAL')}</p><p class="tod-rank">#${st.rank}</p><p class="tod-big">${Number(st.points).toLocaleString()} <small>${T('очков','points')}</small></p>
        <p class="tod-stats">${st.correct} ${T('верных','correct')} · ${st.unique} ${T('уникальных','unique')} · ${st.incorrect} ${T('неверных','wrong')}</p>
        ${st.souls?`<p class="tod-souls">+${Number(st.souls).toLocaleString()} ${T('душ','souls')}</p>`:''}${st.resurrected?`<p class="tod-tag">${T('ВОСКРЕС В ЭТОЙ ИГРЕ','CAME BACK TO LIFE')}</p>`:''}`;return;}
    const rp=p.roundPoints||0;
    els.result.innerHTML=`<p class="tod-eyebrow">${T('ТВОЙ РАУНД','YOUR ROUND')}</p><p class="tod-big ${rp<0?'neg':''}">${rp>0?'+':''}${rp}${m.integrated?` <small>${T('душ','souls')}</small>`:''}</p>
      <p class="tod-stats">${p.roundCorrect||0} ${T('верных','correct')} · ${p.roundUnique||0} ${T('уникальных','unique')} · ${p.roundIncorrect||0} ${T('неверных','wrong')}</p>
      ${p.roundResurrected?`<p class="tod-tag gold">${T('ТЫ СНОВА ЖИВ!','YOU ARE ALIVE AGAIN!')}</p>`:''}`;
  }
  function tick(){
    const m=mini();if(!m||!root||root.hidden){raf=0;return;}
    const timed=['ANSWERING','CATEGORY_REVEAL','DISPUTE','TURN'].includes(m.phase);
    const left=m.phaseEndsAt>0?Math.max(0,m.phaseEndsAt-now()):0,s=timed?Math.ceil(left/1000):0;
    if(els.clock.textContent!==String(timed?s:'·'))els.clock.textContent=timed?String(s):'·';
    const total=m.phase==='ANSWERING'?m.answerMs:m.phase==='TURN'?(m.survival?.turnMs||10000):Math.max(1,m.phaseEndsAt-m.phaseStartedAt);
    root.style.setProperty('--tod-left',String(timed?Math.min(1,left/total):0));
    root.dataset.hurry=String(m.phase==='ANSWERING'&&left<5000||m.phase==='TURN'&&left<3000);
    if(error&&performance.now()-errorAt>2600){error='';paintHint();}
    raf=requestAnimationFrame(tick);
  }
  return {render,event,reset,suspend};
}
