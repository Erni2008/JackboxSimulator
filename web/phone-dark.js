'use strict';
/*
 * PHONE WATCH: the moment the answer clock runs out the phone hands the show back to the shared screen, party-game
 * style: your character in full on a copper pedestal (bobbing, jumps when tapped), a big WATCH THE SCREEN with a
 * bouncing screen icon, the answer you locked in, copper rays turning behind. Nothing says right or wrong: the
 * reveal belongs to the shared screen. Presentation only: reads the controller's `state`.
 */
(function(){
  const T=(ru,en)=>typeof faT==='function'?faT(ru,en):en;
  const NAMES={skeleton:['Скелет','Skeleton'],dracula:['Дракула','Dracula'],pumpkin:['Тыква','Pumpkin'],voodoo:['Вуду','Voodoo'],ghost:['Призрак','Ghost'],zombie:['Зомби','Zombie'],plague_doctor:['Чумной доктор','Plague Doctor'],puppeteer:['Кукольник','Puppeteer']};
  const d=document.createElement('div');d.id='pd';d.className='pd';d.setAttribute('aria-live','polite');d.hidden=true;
  d.innerHTML=`<i class="pd-rays"></i><i class="pd-vig"></i>
    <div class="pd-head"><span class="pd-tv"><i></i></span><b class="pd-title"></b><span class="pd-arrow"></span></div>
    <div class="pd-hero" role="button" tabindex="0"><i class="pd-spot"></i><img class="pd-body" alt="" draggable="false"><i class="pd-ped"></i></div>
    <div class="pd-plate"><small></small><b></b></div>
    <div class="pd-ans"><small></small><b></b></div>
    <p class="pd-wait"><span></span><i></i><i></i><i></i></p>`;
  document.body.append(d);
  const hero=d.querySelector('.pd-hero'),img=d.querySelector('.pd-body');
  const poke=()=>{hero.classList.remove('jump');void hero.offsetWidth;hero.classList.add('jump');try{navigator.vibrate?.(15);}catch{}try{FA_SFX.tap();}catch{}};
  hero.addEventListener('click',poke);hero.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' ')poke();});
  let on=false,key='';
  setInterval(()=>{
    if(typeof state==='undefined'||!state)return;
    const view=document.body.dataset.view,dark=(view==='question'||view==='result'||view==='ghost')&&!!state.question&&(state.phase==='REVEALING'||state.phase==='RESULTS');
    const k=state.gameId+':'+state.questionNumber;
    if(dark&&(!on||k!==key)){on=true;key=k;
      const me=(state.players||[]).find(p=>p.id===state.selfId),ch=me?.characterId||'skeleton';
      const r=(state.results||[]).find(x=>x.playerId===state.selfId),mine=state.submittedAnswer??state.selectedAnswer,sel=r?r.selectedAnswer:(typeof mine==='number'?mine:-1);
      img.src=`/portraits/full/${ch}.png`;d.classList.toggle('ghost',me&&me.isAlive===false);
      d.querySelector('.pd-title').textContent=T('Смотри на экран!','Watch the screen!');
      d.querySelector('.pd-plate small').textContent=NAMES[ch]?T(NAMES[ch][0],NAMES[ch][1]):'';d.querySelector('.pd-plate b').textContent=me?.name||'';
      d.querySelector('.pd-ans small').textContent=sel>=0?T('Твой ответ','Your answer'):T('Ответа нет','No answer');
      // before the results arrive, the phone's own receipt ("ANSWER LOCKED · 01 · Earth") already knows the answer
      const rc=document.getElementById('answer-receipt'),rv=document.getElementById('answer-receipt-value')?.textContent?.trim()||'',known=sel<0&&rc&&!rc.hidden&&rv;
      if(known)d.querySelector('.pd-ans small').textContent=T('Твой ответ','Your answer');
      d.querySelector('.pd-ans b').textContent=sel>=0&&state.question?.answers?`${String(sel+1).padStart(2,'0')} · ${state.question.answers[sel]}`:known?rv:'—';d.classList.toggle('none',!(sel>=0||known));
      d.querySelector('.pd-wait span').textContent=T('Ведущий раскрывает ответ','The host reveals the answer');
      d.hidden=false;d.classList.remove('run','leave');void d.offsetWidth;d.classList.add('run');document.body.classList.add('pd-on');try{navigator.vibrate?.([25,50,25]);}catch{}}
    else if(dark&&on){/* keep the answer chip current once the results arrive */const r=(state.results||[]).find(x=>x.playerId===state.selfId);if(r&&r.selectedAnswer>=0&&d.classList.contains('none')){d.classList.remove('none');d.querySelector('.pd-ans small').textContent=T('Твой ответ','Your answer');d.querySelector('.pd-ans b').textContent=`${String(r.selectedAnswer+1).padStart(2,'0')} · ${state.question.answers[r.selectedAnswer]}`;}}
    else if(!dark&&on){on=false;d.classList.add('leave');setTimeout(()=>{if(!on){d.hidden=true;d.classList.remove('run','leave');document.body.classList.remove('pd-on');}},450);}
  },150);
})();
