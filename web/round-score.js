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
  const fmt=n=>Math.max(0,Math.round(n)).toLocaleString('en-US').replace(/,/g,'\u202f');
  function show(sum,selfId){
    const rows=sum.rows||[];const i=rows.findIndex(r=>r.playerId===selfId);if(i<0)return;const me=rows[i];
    let place=1;for(const r of rows)if(r.earned>me.earned)place++;
    const n=NAMES[sum.mode],earned=Math.max(0,me.earned|0),before=Math.max(0,me.total-earned);
    const tier=earned<=0?'zero':place===1?'gold':place===2?'silver':place===3?'bronze':'plain';
    const o=document.createElement('div');o.className='round-score tier-'+tier;o.setAttribute('role','status');
    o.innerHTML=`<div class="rs-rays"></div><div class="rs-card">
      <p class="rs-eyebrow">${faT('ИТОГИ РАУНДА','ROUND RESULTS')}</p>${n?`<p class="rs-mode">${faT(n[0],n[1])}</p>`:''}
      <div class="rs-medal"><b>${place}</b><small>${faT('МЕСТО','PLACE')}</small></div>
      ${place===1&&earned>0?`<p class="rs-winner">${faT('ПОБЕДИТЕЛЬ РАУНДА','ROUND WINNER')}</p>`:''}
      <p class="rs-amount"><span>${earned>0?'+':''}0</span><small>${faT('ОЧКОВ','POINTS')}</small></p>
      <div class="rs-total"><small>${faT('ВСЕГО','TOTAL')}</small><b>${fmt(before)}</b></div>
      <p class="rs-hint">${faT('коснитесь, чтобы закрыть','tap to close')}</p></div><div class="rs-sparks"></div>`;
    document.body.append(o);
    const span=o.querySelector('.rs-amount span'),tot=o.querySelector('.rs-total b'),amount=o.querySelector('.rs-amount'),sparks=o.querySelector('.rs-sparks');
    const t0=performance.now(),C0=650,C1=1100,R0=C0+C1+350,R1=700;let landed=false,rolled=false;
    const run=t=>{if(!o.isConnected)return;const d=t-t0;
      const k=Math.min(1,Math.max(0,(d-C0)/C1)),e=k*k*(3-2*k);span.textContent=(earned>0?'+':'')+fmt(earned*e);
      if(k>=1&&!landed){landed=true;if(earned>0){amount.classList.add('pop');burst(sparks,tier==='gold'?34:20);navigator.vibrate?.(tier==='gold'?[40,40,80]:[30]);try{tier==='gold'?FA_SFX.souls():FA_SFX.tap();}catch(e){}}}
      const r=Math.min(1,Math.max(0,(d-R0)/R1)),re=1-Math.pow(1-r,3);tot.textContent=fmt(before+earned*re);
      if(r>=1&&!rolled){rolled=true;if(earned>0)tot.parentElement.classList.add('flash');}
      if(!rolled)requestAnimationFrame(run);};requestAnimationFrame(run);
    const close=()=>{if(o.classList.contains('out'))return;o.classList.add('out');setTimeout(()=>o.remove(),400);};
    o.addEventListener('click',close);setTimeout(close,9000);
  }
  function burst(host,count){
    for(let k=0;k<count;k++){const p=document.createElement('i');const a=Math.random()*Math.PI*2,v=70+Math.random()*130;
      p.style.setProperty('--dx',(Math.cos(a)*v).toFixed(0)+'px');p.style.setProperty('--dy',(Math.sin(a)*v-40).toFixed(0)+'px');
      p.style.setProperty('--s',(.6+Math.random()*.9).toFixed(2));p.style.animationDelay=(Math.random()*.08).toFixed(2)+'s';host.append(p);}
    setTimeout(()=>host.replaceChildren(),1600);
  }
  window.FA_ROUND_SCORE={event(e){
    const p=e&&e.payload;const sum=p&&p.modeSummary;if(!sum||!sum.id||p.host||p.webGame)return;
    if(shownNow.has(sum.id)||seen().includes(sum.id))return;
    // a phone that joins later must not get an old round's results
    if(p.serverTime&&sum.at&&p.serverTime-sum.at>120000)return;
    shownNow.add(sum.id);mark(sum.id);show(sum,p.selfId);
  }};
})();
