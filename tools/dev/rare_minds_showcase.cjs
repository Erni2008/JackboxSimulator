'use strict';
/*
 * RARE MINDS showcase: three full rounds on the real room server with socket bots that TYPE their answers at about
 * 35 WPM (one character every ~343 ms, with the odd typo fixed by backspace), then lock in. Every event the host's
 * client receives is recorded with its arrival time to OUT/host-stream.jsonl, which the desktop replay
 * (:lwjgl3:rareMindsReplay) plays back in real time or renders to video.
 *   OUT=dir URL=http://localhost:18330 ROUNDS=3 node tools/dev/rare_minds_showcase.cjs
 */
const fs=require('node:fs'),path=require('node:path');
const base=process.env.URL||'http://localhost:18330',out=process.env.OUT||'/tmp/rare-minds-showcase',rounds=Number(process.env.ROUNDS||3);
fs.mkdirSync(out,{recursive:true});const stream=fs.createWriteStream(path.join(out,'host-stream.jsonl'));
const bank=JSON.parse(fs.readFileSync(path.join(__dirname,'../../server/src/main/resources/rare_minds/questions.json'),'utf8'));
const ranked=qid=>bank.questions.find(x=>x.id===qid).answers.slice().sort((a,b)=>b[1]-a[1]).map(a=>a[2].split('|')[0]);
const post=async(p,d)=>{const r=await fetch(base+p,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams(d)});if(!r.ok)throw Error(p+' '+await r.text());return r.json();};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const CHAR_MS=60000/(35*5); // 35 words per minute, 5 characters per word
function sock(code,token,on){const ws=new WebSocket(base.replace(/^http/,'ws')+'/ws');ws.onopen=()=>ws.send(JSON.stringify({type:'AUTH',requestId:'auth',payload:{roomCode:code,token}}));ws.onmessage=e=>on(JSON.parse(e.data));ws.cmd=(type,payload)=>ws.send(JSON.stringify({type,requestId:Math.random().toString(16).slice(2),payload:{roomCode:code,...payload}}));return ws;}

/** type `text` into a draft at ~35 WPM; occasionally hit a wrong key and correct it */
async function type(bot,s,text){
  let cur='';
  for(const ch of text){
    if(Math.random()<.06&&cur.length>1){const wrong=String.fromCharCode(97+Math.floor(Math.random()*26));cur+=wrong;bot.ws.cmd('RM_DRAFT',{sessionId:s.sessionId,question:s.question,text:cur,risk:false});await sleep(CHAR_MS*(1.4+Math.random()));cur=cur.slice(0,-1);bot.ws.cmd('RM_DRAFT',{sessionId:s.sessionId,question:s.question,text:cur,risk:false});await sleep(CHAR_MS);}
    cur+=ch;bot.ws.cmd('RM_DRAFT',{sessionId:s.sessionId,question:s.question,text:cur,risk:false});
    await sleep(CHAR_MS*(.75+Math.random()*.5));
  }
  return cur;
}

(async()=>{
  const host=await post('/rooms',{name:'RARE MINDS SHOWCASE',maxPlayers:'8'}),code=host.code;
  const names=['Alex','Max','Kate','Luna','Nick','Mira'],bots=[];
  for(const n of names){const id=await post(`/rooms/${code}/join`,{name:n});bots.push({name:n,id});}
  let state=null;const t0=Date.now();
  const hostWs=sock(code,host.token,e=>{if(e.payload?.roomId){state=e.payload;stream.write(JSON.stringify({at:Date.now()-t0,type:e.type,state:e.payload})+'\n');}});
  for(const b of bots)b.ws=sock(code,b.id.token,()=>{});
  while(!state||state.players.filter(p=>p.connectionStatus==='ONLINE').length<names.length)await sleep(150);
  hostWs.cmd('START_RARE_MINDS',{sessionId:state.lobbyId,...(process.env.FORMAT?{format:process.env.FORMAT}:{}),...(process.env.RACE?{race:process.env.RACE==='1'}:{})});
  // per round, answer popularity ranks for each bot (equal numbers collide)
  const plan=[[0,0,6,14,3,22],[1,9,1,17,24,5],[2,12,20,2,8,27]];
  const misspell=t=>{if(t.length<=5)return t;const k=t.length>6?2:1;return t.slice(0,k)+t[k+1]+t[k]+t.slice(k+2);}; // a swapped pair of letters: the game corrects it
  let q=0;
  while(true){
    const s=state.rareMinds;if(!s){await sleep(100);continue;}
    if(s.phase==='QUESTION_ACTIVE'&&s.question!==q){
      q=s.question;if(q>rounds){await sleep(300);break;}
      const answers=ranked(s.questionId),p=plan[(q-1)%plan.length];console.log('round',q,s.textEn);
      bots.forEach((b,i)=>{(async()=>{await sleep(900+Math.random()*4500);const text=(b.name==='Kate'||b.name==='Nick')?misspell(answers[p[i]]):answers[p[i]];await type(b,s,text);await sleep(300+Math.random()*1500);
        b.ws.cmd('RM_SUBMIT',{sessionId:s.sessionId,question:q,text,risk:false});})();});
    }
    if(s.phase==='QUESTION_ACTIVE'&&s.question>rounds)break;
    await sleep(60);
  }
  stream.end();console.log('recorded',fs.readFileSync(path.join(out,'host-stream.jsonl'),'utf8').split('\n').length-1,'events in',((Date.now()-t0)/1000).toFixed(1),'s');process.exit(0);
})().catch(e=>{console.error(e);process.exit(1);});
