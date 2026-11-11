'use strict';
/**
 * THE FINAL SECOND phone controller. The server owns every phase; the phone shows the target, a 3·2·1 countdown,
 * the timer for its first three seconds, then only a dark display and a huge red STOP button. The press is
 * timed on pointerdown against the shared start instant (server clock) and sent once; the server bounds it.
 * Results stay on the shared screen.
 */
function createFinalSecondController({getState,isAuthenticated,send,makeId,now}){
  const el=id=>document.getElementById(id);
  const mini=()=>getState()?.finalSecond;
  let session='',sent=null,raf=0;
  const fmt=ms=>{const cs=Math.max(0,Math.min(9999,Math.round(ms/10)));return String(Math.floor(cs/100)).padStart(2,'0')+','+String(cs%100).padStart(2,'0');};
  function reset(){session='';sent=null;cancelAnimationFrame(raf);raf=0;}
  function suspend(){cancelAnimationFrame(raf);raf=0;}
  function render(){
    const m=mini();if(!m)return;if(m.sessionId!==session){reset();session=m.sessionId;}
    const scr=el('fsec-screen'),me=(m.seats||[]).includes(getState().selfId);
    el('fsec-target').textContent=fmt(m.targetMs).replace(/^0/,'');scr.dataset.blind=String(!!m.blind);
    el('fsec-task').textContent=m.blind?'ЗАДАНИЕ 2 · ВСЛЕПУЮ':'';
    let mode='wait';
    if(!me)mode='watch';
    else if(m.phase==='COUNTDOWN')mode='count';
    else if(m.phase==='RUNNING')mode=(m.myStopped||sent)?'locked':'run';
    else if(m.phase==='REVEAL'||m.phase==='RESULTS')mode='done';
    scr.dataset.mode=mode;
    const btn=el('fsec-stop');btn.disabled=mode!=='run'||!isAuthenticated();
    el('fsec-note').textContent={wait:'ПРИГОТОВЬСЯ',watch:'ТЫ НАБЛЮДАЕШЬ',count:'',run:'',locked:'ВРЕМЯ ЗАФИКСИРОВАНО',done:'СМОТРИ НА ОБЩИЙ ЭКРАН'}[mode];
    if(!raf)tick();
  }
  function tick(){
    const m=mini();if(!m){raf=0;return;}
    const d=el('fsec-digits');
    if(m.phase==='COUNTDOWN'){const n=Math.max(1,3-Math.floor((now()-m.phaseStartedAt)/1000));d.textContent=String(n);d.dataset.kind='count';}
    else if(m.phase==='RUNNING'&&m.runStart){const e=now()-m.runStart;d.dataset.kind='time';d.textContent=e<m.visibleMs?fmt(e):'––,––';}
    else{d.dataset.kind='time';d.textContent='––,––';}
    raf=requestAnimationFrame(tick);
  }
  function stop(e){
    e?.preventDefault?.();const m=mini();if(!m||m.phase!=='RUNNING'||sent||m.myStopped||!isAuthenticated())return;
    const elapsed=Math.round(now()-m.runStart);                 // measured at the touch, before any network
    sent=makeId();send('FS_STOP',{roomCode:getState().code,sessionId:m.sessionId,elapsedMs:elapsed},sent);
    try{navigator.vibrate?.([40,30,60]);}catch{}
    const b=el('fsec-stop');b.classList.remove('hit');void b.offsetWidth;b.classList.add('hit');render();
  }
  el('fsec-stop').addEventListener('pointerdown',stop);
  el('fsec-stop').addEventListener('click',e=>e.preventDefault());
  function event(ev){if(sent&&ev.requestId===sent&&ev.type==='ERROR'){const code=ev.payload?.code;if(code!=='FS_ALREADY_STOPPED')sent=null;render();}}
  return {render,reset,suspend,event};
}
