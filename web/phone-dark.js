'use strict';
/*
 * PHONE DARK: the moment the answer clock runs out the phone goes dark. A lone candle burns, a draught snuffs it,
 * smoke curls up from the glowing wick and the screen only whispers to watch the main screen. The phone shows
 * nothing about right or wrong: the reveal belongs to the shared screen. Presentation only: reads `state`.
 */
(function(){
  const T=(ru,en)=>typeof faT==='function'?faT(ru,en):en;
  const d=document.createElement('div');d.id='pd';d.className='pd';d.setAttribute('aria-live','polite');d.hidden=true;
  d.innerHTML=`<i class="pd-glow"></i><div class="pd-candle"><i class="pd-flame"></i><i class="pd-wick"></i><i class="pd-body"></i>
    <i class="pd-smoke s1"></i><i class="pd-smoke s2"></i><i class="pd-smoke s3"></i><i class="pd-smoke s4"></i></div>
    <p class="pd-title"></p><p class="pd-sub"></p>`;
  document.body.append(d);let on=false,key='';
  setInterval(()=>{
    if(typeof state==='undefined'||!state)return;
    const view=document.body.dataset.view,dark=(view==='question'||view==='result'||view==='ghost')&&!!state.question&&(state.phase==='REVEALING'||state.phase==='RESULTS');
    const k=state.gameId+':'+state.questionNumber;
    if(dark&&(!on||k!==key)){on=true;key=k;d.querySelector('.pd-title').textContent=T('Свет погас','Lights out');d.querySelector('.pd-sub').textContent=T('Смотри на главный экран','Watch the main screen');
      d.hidden=false;d.classList.remove('run');void d.offsetWidth;d.classList.add('run');document.body.classList.add('pd-on');try{navigator.vibrate?.([30,60,20]);}catch{}}
    else if(!dark&&on){on=false;d.classList.add('leave');setTimeout(()=>{if(!on){d.hidden=true;d.classList.remove('run','leave');document.body.classList.remove('pd-on');}},500);}
  },150);
})();
