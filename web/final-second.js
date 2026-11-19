'use strict';
/** Two-tap controls. Server owns start instants, pauses, turn tokens and elimination. */
function createFinalSecondController({getState,isAuthenticated,send,makeId,now}){
  const el=id=>document.getElementById(id),mini=()=>getState()?.finalSecond;
  let session='',pending=null,raf=0,lastPress=-Infinity,shiftNotified=false;
  const fmt=ms=>{const cs=Math.max(0,Math.min(9999,Math.round(ms/10)));return String(Math.floor(cs/100)).padStart(2,'0')+','+String(cs%100).padStart(2,'0');};
  const chain=m=>m?.task==='CHAIN';
  const shifting=m=>m?.task==='SPEED_SHIFT';
  const elapsed=(m,t)=>{const real=Math.max(0,t-m.myStartedAt);return shifting(m)?Math.min(m.targetMs,Math.min(real,m.speedShiftAtMs)+Math.max(0,real-m.speedShiftAtMs)*m.speedMultiplier):real;};
  function reset(){session='';pending=null;cancelAnimationFrame(raf);raf=0;lastPress=-Infinity;shiftNotified=false;const cue=el('fsec-speed-cue');if(cue)cue.hidden=true;}
  function suspend(){cancelAnimationFrame(raf);raf=0;}
  function settle(m){
    if(!pending)return;
    const changedTurn=chain(m)&&pending.payload.turnId!==m.turnId;
    const started=chain(m)?m.turnRunning:m.myStarted;
    if(m.phase!=='RUNNING'||changedTurn||pending.type==='FS_START'&&started||pending.type==='FS_STOP'&&!chain(m)&&m.myStopped)pending=null;
  }
  function render(){
    const m=mini();if(!m)return;if(m.sessionId!==session){reset();session=m.sessionId;}settle(m);
    const scr=el('fsec-screen'),self=getState().selfId,me=(m.seats||[]).includes(self),c=chain(m);
    el('fsec-target').textContent=fmt(m.targetMs).replace(/^0/,'');scr.dataset.blind=String(!!m.blind);scr.dataset.task=m.task||'NORMAL';
    el('fsec-task').textContent=shifting(m)?'SPEED SHIFT':c?faT('ЗАДАНИЕ 3 · ОПАСНАЯ ЦЕПОЧКА', 'TASK 3 · DANGEROUS CHAIN'):m.blind?faT('ЗАДАНИЕ 2 · ВСЛЕПУЮ', 'TASK 2 · BLIND'):faT('ЗАДАНИЕ 1 · ТОЧНОЕ ВРЕМЯ', 'TASK 1 · EXACT TIME');
    const targetLabel=el('fsec-target-label');if(targetLabel)targetLabel.textContent=shifting(m)?faT('ПРЕДЕЛ', 'LIMIT'):c?faT('ОБЩИЙ ПРЕДЕЛ', 'SHARED LIMIT'):faT('ОСТАНОВИ НА', 'STOP AT');
    let mode='wait';
    if(!me)mode='watch';
    else if(m.phase==='COUNTDOWN')mode='count';
    else if(m.phase==='RUNNING'){
      if(c&&m.activePlayer!==self)mode='queue';
      else if(!c&&(m.myStopped||m.myStartExpired||m.myTimedOut))mode='locked';
      else mode=(c?m.turnRunning:m.myStarted)?'run':'ready';
    }else if(m.phase==='REVEAL'||m.phase==='RESULTS')mode='done';
    scr.dataset.mode=mode;scr.dataset.phase=m.phase;
    const btn=el('fsec-stop');btn.disabled=!['ready','run'].includes(mode)||!!pending||!isAuthenticated();
    btn.dataset.label=mode==='ready'?faT('СТАРТ', 'START'):mode==='run'?faT('СТОП', 'STOP'):faT('ЖДИ', 'WAIT');btn.setAttribute('aria-label',mode==='ready'?faT('Запустить таймер', 'Start timer'):mode==='run'?faT('Остановить таймер', 'Stop timer'):faT('Ожидание хода', 'Waiting for a turn'));
    const active=(getState().players||[]).find(p=>p.id===m.activePlayer)?.name||faT('другого игрока', 'of another player');
    let note={wait:faT('ПРИГОТОВЬСЯ', 'GET READY'),watch:faT('ТЫ НАБЛЮДАЕШЬ', 'YOU\'RE WATCHING'),count:'',ready:c?faT('ТВОЙ ХОД · ПРОДОЛЖИ ОБЩИЙ ТАЙМЕР', 'YOUR TURN · CONTINUE THE SHARED TIMER'):faT('ПЕРВОЕ НАЖАТИЕ — СТАРТ', 'FIRST PRESS — START'),run:c?faT('ВТОРОЕ НАЖАТИЕ — СТОП И ПЕРЕДАЧА ХОДА', 'SECOND PRESS — STOP AND PASS THE TURN'):faT('ВТОРОЕ НАЖАТИЕ — СТОП', 'SECOND PRESS — STOP'),queue:faT('СЕЙЧАС ХОД: ', 'NOW PLAYING: ')+active,locked:faT('ВРЕМЯ ЗАФИКСИРОВАНО', 'TIME LOCKED IN'),done:faT('СМОТРИ НА ОБЩИЙ ЭКРАН', 'LOOK AT THE SHARED SCREEN')}[mode];
    if(shifting(m))note={wait:faT('Скорость изменится один раз', 'The speed will change once'),watch:faT('Наблюдение', 'Watching'),count:faT('Приготовься', 'Get ready'),ready:faT('Нажми, чтобы начать', 'Tap to start'),run:faT('Останови до предела', 'Stop before the limit'),locked:m.myTimedOut?faT('Предел достигнут', 'Limit reached'):faT('Время зафиксировано', 'Time locked in'),done:faT('Результаты на общем экране', 'Results on the shared screen')}[mode]||note;
    if(mode==='locked'&&!m.myStopped)note=m.myStartExpired?faT('ТЫ НЕ ЗАПУСТИЛ ТАЙМЕР', 'YOU DIDN\'T START THE TIMER'):faT('ВРЕМЯ ДЛЯ ОСТАНОВКИ ИСТЕКЛО', 'TIME TO STOP RAN OUT');
    if(pending)note=shifting(m)?(pending.type==='FS_START'?faT('Запуск…', 'Starting…'):faT('Фиксируем…', 'Locking in…')):faT('СИНХРОНИЗАЦИЯ…', 'SYNCING…');el('fsec-note').textContent=note;
    if(!raf)tick();
  }
  function tick(){
    const m=mini();if(!m){raf=0;return;}
    const cue=el('fsec-speed-cue');
    if(cue){
      const active=shifting(m)&&m.phase==='RUNNING'&&m.myStarted&&!m.myStopped&&pending?.type!=='FS_STOP'&&now()<m.myDeadlineAt;
      const switchedAt=m.myStartedAt+m.speedShiftAtMs;
      if(active&&now()>=switchedAt&&!shiftNotified){
        shiftNotified=true;
        cue.textContent=faT('Скорость ×', 'Speed ×')+String(m.speedMultiplier).replace('.',',');
        cue.dataset.direction=m.speedMultiplier<1?'slower':'faster';
        cue.hidden=now()>=switchedAt+1800;
      }
      if(!active||now()>=switchedAt+1800)cue.hidden=true;
    }
    const d=el('fsec-digits');
    const display=(value,kind)=>{if(d.textContent!==value)d.textContent=value;if(d.dataset.kind!==kind)d.dataset.kind=kind;};
    if(m.phase==='COUNTDOWN'){display(String(Math.max(1,3-Math.floor((now()-m.phaseStartedAt)/1000))),'count');}
    else if(m.phase==='RUNNING'&&!chain(m)&&m.myStarted&&(!m.myStopped||shifting(m))){const e=shifting(m)&&m.myStopped?m.myStoppedMs:elapsed(m,shifting(m)&&pending?.type==='FS_STOP'?pending.payload.clientAt:now());display(shifting(m)||e<m.visibleMs?fmt(e):'––,––','time');
      if(shifting(m)&&!m.myStopped&&now()>=m.myDeadlineAt){el('fsec-stop').disabled=true;el('fsec-note').textContent=faT('Предел достигнут', 'Limit reached');}
    }
    else{display(m.phase==='RUNNING'&&!chain(m)&&!m.blind&&!m.myStarted?'00,00':'––,––','time');}
    if(pending&&isAuthenticated()&&now()-pending.lastSent>=1500&&pending.attempts<3){pending.lastSent=now();pending.attempts++;send(pending.type,pending.payload,pending.id);}
    raf=requestAnimationFrame(tick);
  }
  function press(e){
    e?.preventDefault?.();const m=mini(),t=now();if(!m||shifting(m)&&m.myStarted&&t>=m.myDeadlineAt||m.phase!=='RUNNING'||pending||!isAuthenticated()||t-lastPress<100)return;
    const c=chain(m);if(!(m.seats||[]).includes(getState().selfId)||c&&m.activePlayer!==getState().selfId||!c&&m.myStopped)return;
    const running=c?m.turnRunning:m.myStarted,type=running?'FS_STOP':'FS_START';
    const payload={roomCode:getState().code,sessionId:m.sessionId,clientAt:Math.round(t)};
    if(c)payload.turnId=m.turnId;
    if(running&&!c)payload.elapsedMs=Math.max(0,Math.round(t-m.myStartedAt));
    pending={id:makeId(),type,payload,lastSent:t,attempts:1};lastPress=t;
    if(shifting(m)&&running)el('fsec-digits').textContent=fmt(elapsed(m,t));
    send(type,payload,pending.id);
    try{navigator.vibrate?.(running?[40,30,60]:25);}catch{}
    const b=el('fsec-stop');b.classList.remove('hit');void b.offsetWidth;b.classList.add('hit');setTimeout(()=>b.classList.remove('hit'),600);render();
  }
  el('fsec-stop').addEventListener('keydown',e=>{if(!e.repeat&&(e.key===' '||e.key==='Enter'))press(e);});
  el('fsec-stop').addEventListener('pointerdown',press);el('fsec-stop').addEventListener('click',e=>e.preventDefault());
  function event(ev){if(pending&&ev.requestId===pending.id&&ev.type==='ERROR'){pending=null;render();}}
  return {render,reset,suspend,event};
}
