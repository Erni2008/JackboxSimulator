'use strict';
/**
 * SOULS on the player's phone: a small balance chip and the reward moment after a correct quiz answer.
 * The server owns every balance (players[].souls); this only notices that ours went up and celebrates it.
 * The icon is one file — swap SOULS_ICON for a PNG when the final art exists.
 */
const SOULS_ICON='/souls/soul.svg';
function createSoulsHud({send}={}){
  const fmt=n=>Math.max(0,Math.round(n)).toLocaleString('en-US');
  let known=null,shown=0,room='',anim=0;
  const chip=document.createElement('div');chip.className='souls-chip';chip.hidden=true;chip.innerHTML=`<img alt="" src="${SOULS_ICON}"><b>0</b><small>SOULS</small>`;document.body.append(chip);
  const value=chip.querySelector('b');
  // a ghost can buy their way back to the living (server applies it at the next safe moment)
  const revive=document.createElement('button');revive.type='button';revive.dataset.nativeButton='';revive.className='souls-revive';revive.hidden=true;
  revive.innerHTML=`<img alt="" src="${SOULS_ICON}"><span><b>RETURN TO LIFE</b><small>5,000 SOULS</small></span>`;document.body.append(revive);let lastState=null,sentAt=0;
  revive.onclick=()=>{if(!lastState||Date.now()-sentAt<3000)return;sentAt=Date.now();try{FA_SFX.tap();}catch(e){}send?.('SOULS_REVIVE',{roomCode:lastState.code});revive.disabled=true;setTimeout(()=>revive.disabled=false,3000);};
  function countTo(target){cancelAnimationFrame(anim);const from=shown,start=performance.now(),dur=900;
    const step=t=>{const k=Math.min(1,(t-start)/dur),e=1-Math.pow(1-k,3);shown=from+(target-from)*e;value.textContent=fmt(shown);if(k<1)anim=requestAnimationFrame(step);};anim=requestAnimationFrame(step);}
  function celebrate(amount){
    const o=document.createElement('div');o.className='souls-reward';o.setAttribute('role','status');
    o.innerHTML=`<div class="souls-orb"><img alt="" src="${SOULS_ICON}"></div><p class="souls-title">CORRECT ANSWER!</p><p class="souls-amount">+<span>0</span> SOULS</p>`;
    for(let i=0;i<10;i++){const w=document.createElement('i');w.style.setProperty('--x',(Math.random()*160-80).toFixed(0)+'px');w.style.animationDelay=(.15+Math.random()*.5).toFixed(2)+'s';o.querySelector('.souls-orb').append(w);}
    document.body.append(o);const span=o.querySelector('.souls-amount span'),t0=performance.now();
    const run=t=>{const k=Math.min(1,Math.max(0,(t-t0-350)/700));span.textContent=fmt(amount*(1-Math.pow(1-k,3)));if(k<1&&o.isConnected)requestAnimationFrame(run);};requestAnimationFrame(run);
    navigator.vibrate?.([20,40,20]);try{FA_SFX.souls();}catch(e){}chip.classList.remove('gain');void chip.offsetWidth;chip.classList.add('gain');
    setTimeout(()=>o.classList.add('out'),2300);setTimeout(()=>o.remove(),2800);
  }
  return {
    /** Called on every state render. Mini-game screens hide the chip; balances persist across them. */
    sync(state){
      if(!state){chip.hidden=true;revive.hidden=true;return;}lastState=state;
      if(state.code!==room){room=state.code;known=null;}
      const self=state.players?.find(p=>p.id===state.selfId),bal=typeof self?.souls==='number'?self.souls:null;
      const miniGame=!!(state.systemBreach||state.lastCommand||state.cursedBoxes||state.finalSecond||state.forgottenRoom||state.cursedCards||state.impostor&&state.impostor.phase!=='READY');
      chip.hidden=bal==null||miniGame||state.phase==='LOBBY'||state.phase==='STARTING';
      {const ghost=self&&(self.isGhost||self.isAlive===false),pend=!!self?.revivalPending;revive.hidden=!ghost||miniGame||(!pend&&(bal??0)<5000);
       revive.classList.toggle('pending',pend);revive.querySelector('b').textContent=pend?'RETURNING…':'RETURN TO LIFE';revive.querySelector('small').textContent=pend?'next question':'5,000 SOULS';revive.disabled=pend||revive.disabled;}
      if(bal==null)return;
      if(known==null){known=bal;shown=bal;value.textContent=fmt(bal);return;}        // first sight / reconnect: no fake reward
      if(bal>known){const gain=bal-known;known=bal;if(!miniGame)celebrate(gain);countTo(bal);}
      else if(bal!==known){known=bal;countTo(bal);}
    }
  };
}
