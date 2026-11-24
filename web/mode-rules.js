'use strict';
/**
 * HOW TO PLAY on the player's phone: a short rules card when a mode starts, with what it pays. Shown the first
 * two times a device meets each mode, closes on a tap or after a few seconds, never blocks the game underneath.
 */
(function(){
  const R={
    questions:{t:['ВОПРОСЫ','QUESTIONS'],r:[['Выберите ответ, пока горят часы','Pick an answer before the clock runs out'],['Верный ответ: +100 очков и души','Correct answer: +100 points and souls'],['Ошиблись? Вас ждут испытания на выживание','Wrong? Survival trials await you']]},
    boxes:{t:['ПРОКЛЯТЫЕ КОРОБКИ','CURSED BOXES'],r:[['Ошибившиеся прячутся в коробки','Those who were wrong hide in the boxes'],['Остальные выбирают, в какую стрелять','Everyone else picks a box to shoot'],['Выжил в коробке: 200 очков','Survive in a box: 200 points']]},
    cards:{t:['ПРОКЛЯТЫЕ КАРТЫ','CURSED CARDS'],r:[['В свой ход тяните карту','Draw a card on your turn'],['Одна из карт проклята: не вытяните её','One card is cursed: do not draw it'],['Уцелели: 150 очков','Stay safe: 150 points']]},
    'final-second':{t:['ПОСЛЕДНЯЯ СЕКУНДА','FINAL SECOND'],r:[['Запустите отсчёт и остановите его точно в цель','Start the clock and stop it right on the target'],['Чем ближе к цели, тем выше место','The closer you stop, the higher you place'],['1 место: 300 · 2: 200 · 3: 150','1st: 300 · 2nd: 200 · 3rd: 150']]},
    impostor:{t:['САМОЗВАНЕЦ','THE IMPOSTOR'],r:[['Все знают слово, кроме самозванца','Everyone knows the word except the impostor'],['Дайте подсказку, не выдав слово','Give a clue without giving the word away'],['Голосуйте. Победившая сторона: 250 очков','Vote. The winning side gets 250 points']]},
    breach:{t:['SYSTEM BREACH','SYSTEM BREACH'],r:[['Взламывайте систему на своём телефоне','Hack the system on your phone'],['Каждый решённый узел даёт очки доступа','Every solved node earns access points'],['Очки доступа идут в общий счёт','Access points go to your total']]},
    forgotten:{t:['ЗАБЫТАЯ КОМНАТА','THE FORGOTTEN ROOM'],r:[['Запомните комнату','Memorise the room'],['Найдите, что изменилось','Find what has changed'],['Точность и скорость дают очки','Accuracy and speed earn points']]},
    'rare-minds':{t:['RARE MINDS','RARE MINDS'],r:[['Пишите верный, но редкий ответ','Type a valid but rare answer'],['Совпали с кем то? Череп. Три черепа, и вы призрак','Matched someone? A skull. Three skulls and you are a ghost'],['Самый редкий ответ забирает джекпот душ','The rarest answer takes the soul jackpot']]},
    cage:{t:['АДСКАЯ КЛЕТКА','HELL CAGE'],r:[['Чините свою клетку заданиями на телефоне','Repair your cage with the tasks on your phone'],['Ошибки опускают клетку ниже','Mistakes lower your cage'],['Удержались: 200 очков · сорвались: 0','Hold on: 200 points · fall: 0']]}
  };
  const START={GAME_STARTED:'questions',CURSED_BOXES_STARTED:'boxes',CARDS_STARTED:'cards',FINAL_SECOND_STARTED:'final-second',IMPOSTOR_STARTED:'impostor',SYSTEM_BREACH_START:'breach',FORGOTTEN_ROOM_STARTED:'forgotten',RARE_MINDS_STARTED:'rare-minds'};
  const KEY='fa.modeRules.seen',TIMES=2;
  const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}');}catch{return {};}};
  const bump=m=>{try{const s=read();s[m]=(s[m]||0)+1;localStorage.setItem(KEY,JSON.stringify(s));}catch{}};
  let open=null;
  function show(mode){
    const d=R[mode];if(!d)return;if(open)open.remove();
    const o=document.createElement('div');o.className='mode-rules';o.setAttribute('role','dialog');o.setAttribute('aria-label',faT(d.t[0],d.t[1]));
    o.innerHTML=`<div class="mr-card"><img class="cu-c tl" src="/ui/join/corner_tl.png" alt=""><img class="cu-c tr" src="/ui/join/corner_tr.png" alt=""><img class="cu-c bl" src="/ui/join/corner_bl.png" alt=""><img class="cu-c br" src="/ui/join/corner_br.png" alt=""><img class="cu-crest" src="/ui/join/crest.png" alt=""><p class="mr-eyebrow">${faT('КАК ИГРАТЬ','HOW TO PLAY')}</p><p class="mr-title">${faT(d.t[0],d.t[1])}</p><ol>${d.r.map(x=>`<li>${faT(x[0],x[1])}</li>`).join('')}</ol><button type="button" data-native-button>${faT('ПОНЯТНО','GOT IT')}</button><i class="mr-timer"></i></div>`;
    document.body.append(o);open=o;
    const close=()=>{if(o.classList.contains('out'))return;o.classList.add('out');setTimeout(()=>{o.remove();if(open===o)open=null;},300);};
    o.querySelector('button').onclick=close;o.addEventListener('click',e=>{if(e.target===o)close();});setTimeout(close,8000);
  }
  window.FA_MODE_RULES={event(e){
    const p=e&&e.payload||{};if(p.host)return;
    let mode=START[e.type];if(!mode&&e.type==='WEB_GAME_OPENED'&&p.webGame==='broken-elevator')mode='cage';
    if(!mode||(read()[mode]||0)>=TIMES)return;bump(mode);show(mode);
  },show};
})();
