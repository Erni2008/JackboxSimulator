'use strict';
const $=id=>document.getElementById(id),audio=$('audio');
let catalog,recordings={clips:{}},selected=null,filter='all',queue=[],request=0,peaks=[],raf=0,signature='',version='current';
const waveCache=new Map();
const fmt=t=>{t=Math.max(0,Math.floor(Number(t)||0));return String(Math.floor(t/60)).padStart(2,'0')+':'+String(t%60).padStart(2,'0');};
const ready=line=>!!recordings.clips[line.id];
const clipData=()=>version==='previous'&&recordings.clips[selected?.id]?.previous?recordings.clips[selected.id].previous:recordings.clips[selected?.id];
function status(text){$('message').textContent=text;}
function update(){
  const duration=Number.isFinite(audio.duration)?audio.duration:clipData()?.duration||0;
  $('elapsed').textContent=fmt(audio.currentTime);$('total').textContent=fmt(duration);
  $('seek').value=duration?Math.round(audio.currentTime/duration*1000):0;
  $('toggle').textContent=audio.paused?'▶ Слушать':'Ⅱ Пауза';
  document.body.dataset.playing=String(!audio.paused);
  $('deck-status').textContent=!selected?'ВЫБЕРИТЕ ЗАПИСЬ':audio.error?'ОШИБКА ЗАГРУЗКИ':audio.ended?'ЗАПИСЬ ЗАВЕРШЕНА':audio.paused?'ГОТОВО К ПРОСЛУШИВАНИЮ':'ВОСПРОИЗВЕДЕНИЕ';
  $('play-all').textContent=queue.length?'Остановить очередь':'Слушать все →';
  drawWave();
}
function drawWave(){
  const canvas=$('wave'),ctx=canvas.getContext('2d'),w=canvas.width,h=canvas.height;ctx.clearRect(0,0,w,h);
  const fraction=audio.duration?audio.currentTime/audio.duration:0,bars=peaks.length||90;
  for(let i=0;i<bars;i++){const value=peaks[i]||.008,height=Math.max(2,value*h*.85);ctx.fillStyle=i/bars<fraction?'#d6e9b8':'#547a52';ctx.fillRect(i*w/bars+2,(h-height)/2,Math.max(2,w/bars-4),height);}
}
function animate(){update();if(!audio.paused)raf=requestAnimationFrame(animate);}
async function waveform(url,token){
  try{if(waveCache.has(url)){peaks=waveCache.get(url);drawWave();return;}
    const response=await fetch(url);if(!response.ok)return;const data=await response.arrayBuffer(),AudioCtx=window.AudioContext||window.webkitAudioContext;if(!AudioCtx)return;
    const context=new AudioCtx();let buffer;try{buffer=await context.decodeAudioData(data);}finally{await context.close();}
    const samples=buffer.getChannelData(0),values=[];for(let i=0;i<90;i++){let maximum=0;const begin=Math.floor(i*samples.length/90),end=Math.floor((i+1)*samples.length/90);for(let j=begin;j<end;j++)maximum=Math.max(maximum,Math.abs(samples[j]));values.push(maximum);}
    const max=Math.max(...values,.01),normalized=values.map(v=>v/max);waveCache.set(url,normalized);if(token===request){peaks=normalized;drawWave();}
  }catch{/* Playback remains available if waveform decoding is unsupported. */}
}
async function playSelected(restart=false){
  if(!selected)return;const token=request;
  if(restart)audio.currentTime=0;
  try{await audio.play();if(token===request)status('');}catch(error){if(token===request&&error.name!=='AbortError')status('Браузер не начал воспроизведение. Нажмите «Слушать» ещё раз.');}
}
function select(line,autoplay=true,fromQueue=false,chosenVersion='current'){
  if(!ready(line)){status('Эта запись ещё готовится. Страница обновит список автоматически.');return;}
  if(!fromQueue)queue=[];audio.pause();request++;selected=line;version=chosenVersion;peaks=[];
  const current=recordings.clips[line.id],clip=clipData(),url=clip.file+'?v='+clip.sha256;
  $('version-picker').hidden=!current.previous;$('version').value=version;
  audio.src=url;audio.loop=$('loop').checked&&!queue.length;
  $('clip-code').textContent=line.id;$('selection-label').textContent=line.group+' / '+line.id+(current.reviewStatus==='approved_by_user'?' / Одобрено':version==='previous'?' / Предыдущая':current.revision===2?' / Новая версия':'');$('selection-title').textContent=line.title;$('script').textContent=line.text;
  $('download').href=url;$('download').download=line.id+(version==='previous'?'_previous':'')+'.wav';$('download').hidden=false;
  for(const id of ['toggle','restart','stop','seek'])$(id).disabled=false;
  status('');renderList();update();waveform(url,request);if(autoplay)playSelected();
}
function stop(){queue=[];audio.pause();audio.currentTime=0;update();}
function renderList(){
  const focused=document.activeElement?.dataset.clip,box=$('clips');box.replaceChildren();
  for(const line of catalog.lines.filter(line=>filter==='all'||line.id.startsWith(filter))){
    const row=document.createElement('article');row.className='clip'+(selected?.id===line.id?' selected':'')+(ready(line)?'':' pending');
    const button=document.createElement('button');button.type='button';button.dataset.clip=line.id;button.textContent='▶';button.setAttribute('aria-label','Слушать '+line.id+' — '+line.title);button.disabled=!ready(line);button.onclick=()=>select(line);
    const info=document.createElement('div'),code=document.createElement('div'),title=document.createElement('div');code.className='clip-id';code.textContent=line.id+(recordings.clips[line.id]?.reviewStatus==='approved_by_user'?' · Одобрено':recordings.clips[line.id]?.revision===2?' · Новая':'');title.className='clip-title';title.textContent=line.title;info.append(code,title);
    const time=document.createElement('span');time.className='clip-duration';time.textContent=ready(line)?fmt(recordings.clips[line.id].duration):'Готовится';row.append(button,info,time);box.append(row);
  }
  if(focused)box.querySelector('[data-clip="'+focused+'"]')?.focus({preventScroll:true});
}
async function refresh(){
  try{const response=await fetch('recordings.json',{cache:'no-store'});if(response.ok){const next=await response.json(),key=JSON.stringify(next);if(key!==signature){recordings=next;signature=key;renderList();}}
    const count=catalog.lines.filter(ready).length;$('ready-count').textContent=count+' / '+catalog.lines.length;$('archive').hidden=count!==catalog.lines.length||!!recordings.revisionInProgress;$('play-all').disabled=!count;
    if(!selected&&count)select(catalog.lines.find(ready),false);
    return count===catalog.lines.length&&!recordings.revisionInProgress;
  }catch{status('Не удалось обновить список. Готовые записи можно продолжать слушать.');return false;}
}
$('version').onchange=()=>{if(selected)select(selected,true,false,$('version').value);};
$('quick-stop').onclick=stop;
$('toggle').onclick=()=>audio.paused?playSelected():audio.pause();$('restart').onclick=()=>playSelected(true);$('stop').onclick=stop;
$('seek').oninput=()=>{if(audio.duration)audio.currentTime=audio.duration*$('seek').value/1000;update();};
$('volume').oninput=()=>{audio.volume=Number($('volume').value);try{localStorage.setItem('sb-voice-volume',audio.volume);}catch{}};
$('loop').onchange=()=>{queue=[];audio.loop=$('loop').checked;update();};
$('play-all').onclick=()=>{if(queue.length){stop();return;}queue=catalog.lines.filter(ready).slice();$('loop').checked=false;audio.loop=false;select(queue.shift(),true,true);};
for(const button of document.querySelectorAll('[data-filter]'))button.onclick=()=>{filter=button.dataset.filter;for(const item of document.querySelectorAll('[data-filter]'))item.setAttribute('aria-pressed',String(item===button));renderList();};
for(const event of ['loadedmetadata','durationchange','timeupdate','pause','seeked'])audio.addEventListener(event,update);
audio.addEventListener('play',()=>{cancelAnimationFrame(raf);animate();});
audio.addEventListener('ended',()=>{if(queue.length)select(queue.shift(),true,true);else update();});
audio.addEventListener('error',()=>{queue=[];status('Запись не загрузилась. Выберите её ещё раз или обновите страницу.');update();});
try{const saved=localStorage.getItem('sb-voice-volume');if(saved!==null&&Number.isFinite(Number(saved)))$('volume').value=String(Math.max(0,Math.min(1,Number(saved))));}catch{}audio.volume=Number($('volume').value);
(async()=>{try{const response=await fetch('catalog.json');if(!response.ok)throw Error();catalog=await response.json();renderList();if(!await refresh()){const timer=setInterval(async()=>{if(await refresh())clearInterval(timer);},4000);}}catch{status('Не удалось открыть каталог. Откройте страницу через локальный HTTP-сервер.');}update();})();
