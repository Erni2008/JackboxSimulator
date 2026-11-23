'use strict';
/*
 * PHONE RESULT: while the host reveals the truth, the phone shows a sealed copper card: your character in a copper
 * medallion, the answer you locked in, and which question this was. It never says whether the answer was right
 * (that belongs to the shared screen). Presentation only: reads the controller's `state`.
 */
(function(){
  const screen=document.getElementById('result-screen');if(!screen)return;
  const T=(ru,en)=>typeof faT==='function'?faT(ru,en):en,A='/ui/join/';
  const card=document.createElement('div');card.className='pr-card';
  card.innerHTML=`<img class="cu-c tl" src="${A}corner_tl.png" alt=""><img class="cu-c tr" src="${A}corner_tr.png" alt=""><img class="cu-c bl" src="${A}corner_bl.png" alt=""><img class="cu-c br" src="${A}corner_br.png" alt=""><img class="cu-crest" src="${A}crest.png" alt="">
    <div class="pr-medal"><img alt=""></div><p class="pr-name"></p><p class="pr-label"></p><p class="pr-answer"></p><p class="pr-q"></p>`;
  screen.append(card);
  const face=card.querySelector('.pr-medal img');let last='';
  setInterval(()=>{
    if(typeof state==='undefined'||!state||document.body.dataset.view!=='result')return;
    const me=(state.players||[]).find(p=>p.id===state.selfId),r=(state.results||[]).find(x=>x.playerId===state.selfId);
    const sel=r?r.selectedAnswer:-1,ans=sel>=0&&state.question?.answers?state.question.answers[sel]:'';
    const key=[me?.characterId,me?.name,sel,ans,state.questionNumber].join('|');if(key===last)return;last=key;
    card.classList.toggle('none',!(sel>=0));
    if(me?.characterId)face.src=`/portraits/${me.characterId}.webp`;
    card.querySelector('.pr-name').textContent=me?.name||'';
    card.querySelector('.pr-label').textContent=sel>=0?T('Твой ответ','Your answer'):T('Ответа нет','No answer');
    card.querySelector('.pr-answer').textContent=sel>=0?`${String(sel+1).padStart(2,'0')} · ${ans}`:'—';
    card.querySelector('.pr-q').textContent=T(`Вопрос ${state.questionNumber} из ${state.questionCount}`,`Question ${state.questionNumber} of ${state.questionCount}`);
    card.classList.remove('in');void card.offsetWidth;card.classList.add('in');
  },250);
})();
