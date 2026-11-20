'use strict';
/**
 * ROUND RESULTS on the player's phone: after every mode the server publishes modeSummary (points each player earned
 * in it, running totals). This shows the player's own line: place, "+points" counting up, total. Once per summary.
 */
(function(){
  const NAMES={race:['ПРОКЛЯТЫЙ ЗАБЕГ','CURSED RUN'],cage:['АДСКАЯ КЛЕТКА','HELL CAGE'],boxes:['ПРОКЛЯТЫЕ КОРОБКИ','CURSED BOXES'],
    cards:['ПРОКЛЯТЫЕ КАРТЫ','CURSED CARDS'],'final-second':['ПОСЛЕДНЯЯ СЕКУНДА','FINAL SECOND'],impostor:['САМОЗВАНЕЦ','THE IMPOSTOR'],
    questions:['ВОПРОСЫ','QUESTIONS'],breach:['SYSTEM BREACH','SYSTEM BREACH'],forgotten:['ЗАБЫТАЯ КОМНАТА','THE FORGOTTEN ROOM']};
  const KEY='fa.roundScore.seen';
  const seen=()=>{try{return JSON.parse(sessionStorage.getItem(KEY)||'[]');}catch{return [];}};
  const mark=id=>{try{sessionStorage.setItem(KEY,JSON.stringify(seen().concat(id).slice(-20)));}catch{}};
  const shownNow=new Set();
  function show(sum,selfId){
    const rows=sum.rows||[];const i=rows.findIndex(r=>r.playerId===selfId);if(i<0)return;const me=rows[i];
    let place=1;for(const r of rows)if(r.earned>me.earned)place++;
    const n=NAMES[sum.mode];const o=document.createElement('div');o.className='round-score';o.setAttribute('role','status');
    const lead=place===1&&me.earned>0;if(lead)o.classList.add('lead');if(me.earned<=0)o.classList.add('zero');
    o.innerHTML=`<div class="rs-card"><p class="rs-eyebrow">${faT('ИТОГИ РАУНДА','ROUND RESULTS')}</p>${n?`<p class="rs-mode">${faT(n[0],n[1])}</p>`:''}
      <p class="rs-place">${faT('МЕСТО','PLACE')} <b>${place}</b><small> / ${rows.length}</small></p>
      <p class="rs-amount"><span>${me.earned>0?'+':''}0</span><small>${faT('ОЧКОВ','POINTS')}</small></p>
      <p class="rs-total">${faT('ВСЕГО','TOTAL')} <b>${Number(me.total).toLocaleString('en-US')}</b></p>
      <p class="rs-hint">${faT('коснитесь, чтобы закрыть','tap to close')}</p></div>`;
    document.body.append(o);
    const span=o.querySelector('.rs-amount span'),t0=performance.now(),target=me.earned;
    const run=t=>{const k=Math.min(1,Math.max(0,(t-t0-450)/900)),v=Math.round(target*(1-Math.pow(1-k,3)));span.textContent=(target>0?'+':'')+v;if(k<1&&o.isConnected)requestAnimationFrame(run);};requestAnimationFrame(run);
    if(lead){navigator.vibrate?.([30,50,30,50,60]);try{FA_SFX.souls();}catch(e){}}else navigator.vibrate?.(25);
    const close=()=>{if(o.classList.contains('out'))return;o.classList.add('out');setTimeout(()=>o.remove(),400);};
    o.addEventListener('click',close);setTimeout(close,7000);
  }
  window.FA_ROUND_SCORE={event(e){
    const p=e&&e.payload;const sum=p&&p.modeSummary;if(!sum||!sum.id||p.host||p.webGame)return;
    if(shownNow.has(sum.id)||seen().includes(sum.id))return;
    // a phone that joins later must not get an old round's results
    if(p.serverTime&&sum.at&&p.serverTime-sum.at>120000)return;
    shownNow.add(sum.id);mark(sum.id);show(sum,p.selfId);
  }};
})();
