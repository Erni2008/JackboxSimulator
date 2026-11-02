/** Shared race presentation over the 3D machine. Reads only public scores and feedback; never task data or answers. Scoring stays on Java. */
const STEPS=20,FINAL_STRETCH=15,FEEDBACK_WINDOW_MS=900;
/** Public racer record: lobby members plus the racing host. */
export const racer=(s:any,id:string)=>s?.players?.find((x:any)=>x.id===id)||(s?.lastCommandHost?.id===id?s.lastCommandHost:undefined);
export class RaceHud {
 private board=document.createElement('ol');private fx=document.createElement('div');private finale=document.createElement('div');private finaleName=document.createElement('strong');private finaleSub=document.createElement('span');
 private rows=new Map<string,{row:HTMLElement,name:HTMLElement,fill:HTMLElement,score:HTMLElement}>();private scores=new Map<string,number>();private feedbackKey='';private finaleKey='';private timers:any[]=[];
 constructor(private root:HTMLElement){
  this.board.id='race-board';this.board.setAttribute('aria-label','Гонка команд');this.board.hidden=true;
  this.fx.id='machine-fx';this.fx.setAttribute('aria-hidden','true');
  this.finale.id='finale';this.finale.hidden=true;this.finale.setAttribute('role','status');this.finale.setAttribute('aria-live','assertive');
  const kicker=document.createElement('span');kicker.className='finale-kicker';kicker.textContent='ПРОТОКОЛ ЗАВЕРШЁН';this.finaleSub.className='finale-sub';this.finale.append(kicker,this.finaleName,this.finaleSub);
  root.append(this.fx,this.board,this.finale);
 }
 /** serverNow: client clock corrected by the machine's server offset. */
 update(s:any,serverNow:number){
  const p=s?.lastCommand,r=p?.testRound,campaign=!!r?.campaign&&!!r?.expanded;const scores:Record<string,number>=campaign&&r.scores?r.scores:{};const ids=Object.keys(scores);
  const self=p?.mirroring||s?.selfId,top=Math.max(0,...ids.map(id=>scores[id])),leaders=ids.filter(id=>scores[id]===top);
  const playing=campaign&&r.status==='PLAYING',stretch=playing&&top>=FINAL_STRETCH;
  document.body.classList.toggle('final-stretch',stretch);document.body.classList.toggle('self-critical',stretch&&(scores[self]||0)>=FINAL_STRETCH);
  this.board.hidden=!campaign||ids.length<2||r.waitingForTerminals;
  for(const [id,entry] of this.rows)if(!(id in scores)){entry.row.remove();this.rows.delete(id);this.scores.delete(id);}
  if(!this.board.hidden){const order=[...ids].sort((a,b)=>scores[b]-scores[a]);
   ids.forEach(id=>{let entry=this.rows.get(id);if(!entry){entry=this.row();this.rows.set(id,entry);this.board.append(entry.row);}
    const score=scores[id],player=racer(s,id),name=id===self?'ВЫ':player?.nickname||player?.name||'ИГРОК';
    if(entry.name.textContent!==name)entry.name.textContent=name;entry.score.textContent=String(score).padStart(2,'0');entry.fill.style.width=`${score/STEPS*100}%`;entry.row.style.order=String(order.indexOf(id));
    entry.row.classList.toggle('self',id===self);entry.row.classList.toggle('leader',top>0&&leaders.length===1&&leaders[0]===id);entry.row.classList.toggle('critical',score>=FINAL_STRETCH);entry.row.classList.toggle('offline',player?.connectionStatus&&player.connectionStatus!=='ONLINE');
    entry.row.setAttribute('aria-label',`${name}: ${score} из ${STEPS}`);
    const previous=this.scores.get(id);if(previous!==undefined&&score>previous)this.restart(entry.row,'bump');this.scores.set(id,score);});
  }
  // Local acknowledgement of the authoritative verdict; ignores stale verdicts replayed after reload/reconnect.
  const verdict=r?.feedback==='COMMAND ACCEPTED'?'accept':r?.feedback==='WRONG COMMAND'?'reject':'';const key=`${p?.sessionId}:${r?.taskId}:${r?.nextAt}:${verdict}`;
  if(campaign&&verdict&&r.nextAt&&key!==this.feedbackKey){this.feedbackKey=key;if(serverNow-(r.nextAt-700)<FEEDBACK_WINDOW_MS){const score=scores[self]??r.localScore??r.step;this.restart(this.fx,verdict==='accept'?(score>0&&score%5===0?'fx-milestone':'fx-accept'):'fx-reject');if(verdict==='reject')this.restart(this.root,'jolt');}}
  const won=campaign&&r.status==='WON',finale=`${p?.sessionId}:${r?.attemptId}`;
  if(won&&finale!==this.finaleKey){this.finaleKey=finale;const player=racer(s,r.winner);this.finaleName.textContent=r.winner===self?'ВЫ ПОБЕДИЛИ':(player?.nickname||player?.name||'ПОБЕДИТЕЛЬ').toUpperCase();this.finaleSub.textContent=`${STEPS} / ${STEPS} ВЕРНЫХ КОМАНД`;this.finale.hidden=false;this.restart(this.finale,'play');document.body.classList.add('machine-freeze');this.later(()=>document.body.classList.remove('machine-freeze'),900);}
  else if(!won&&!this.finale.hidden){this.finale.hidden=true;this.finaleKey='';document.body.classList.remove('machine-freeze');}
 }
 dispose(){for(const t of this.timers)clearTimeout(t);this.timers=[];this.board.remove();this.fx.remove();this.finale.remove();document.body.classList.remove('final-stretch','self-critical','machine-freeze');}
 private row(){const row=document.createElement('li'),name=document.createElement('span'),track=document.createElement('span'),fill=document.createElement('span'),score=document.createElement('b');name.className='race-name';track.className='race-track';fill.className='race-fill';score.className='race-score';track.append(fill);row.append(name,track,score);return {row,name,fill,score};}
 private restart(element:HTMLElement,name:string){element.classList.remove('fx-accept','fx-milestone','fx-reject');element.classList.remove(name);void element.offsetWidth;element.classList.add(name);if(name==='bump'||name==='jolt')this.later(()=>element.classList.remove(name),700);}
 private later(fn:()=>void,ms:number){const t=setTimeout(()=>{this.timers=this.timers.filter(x=>x!==t);fn();},ms);this.timers.push(t);}
}
