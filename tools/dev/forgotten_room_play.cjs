// Play THE FORGOTTEN ROOM against the real room server: the production host screen opens in its own window
// (it starts the rounds and shows the room), your browser is a player, and a bot plays alongside you.
//   URL=http://localhost:18240 DIFFICULTY=MEDIUM node tools/dev/forgotten_room_play.cjs
// Prints (and opens on macOS) a seat link that logs your browser straight into the room. NO_HOST=1 skips the window.
const base=process.env.URL||'http://localhost:18240',difficulty=process.env.DIFFICULTY||'MEDIUM',lan=process.env.LAN||'';
const path=require('path'),{spawn}=require('child_process');
const form=o=>new URLSearchParams(o).toString();
async function post(p,data){const r=await fetch(base+p,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:form(data)});const j=await r.json();if(!r.ok)throw new Error(p+' '+JSON.stringify(j));return j;}
function socket(code,token,name){return new Promise((res,rej)=>{const ws=new WebSocket(base.replace('http','ws')+'/ws');const c={ws,name,state:null,id:0};
  ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.payload&&m.payload.players)c.state=m.payload;if(m.type==='ERROR')console.log(name,'error',m.payload.code);if(m.type==='AUTHENTICATED')res(c);};
  ws.onopen=()=>ws.send(JSON.stringify({type:'AUTH',requestId:'auth-'+name,payload:{roomCode:code,token}}));ws.onerror=rej;});}
const send=(c,type,payload)=>c.ws.send(JSON.stringify({type,requestId:c.name+'-'+(++c.id),payload}));
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const seat=(code,token,name)=>Buffer.from(JSON.stringify({code,token,name})).toString('base64url');
(async()=>{
  const room=await post('/rooms',{name:'Забытая комната',maxPlayers:'8',gameMode:'standard'});const code=room.code;
  const you=await post(`/rooms/${code}/join`,{name:'Ты'}),bot=await post(`/rooms/${code}/join`,{name:'Борис'});
  const b=await socket(code,bot.token,'bot');
  if(!process.env.NO_HOST){const root=path.resolve(__dirname,'../..');
    const host=spawn(path.join(root,'gradlew'),['-q',':lwjgl3:forgottenRoomHost',`-Proom.url=${base}`,`-Proom.code=${code}`,`-Proom.token=${room.token}`,`-Proom.difficulty=${difficulty}`],{cwd:root,stdio:'ignore'});
    process.on('exit',()=>host.kill());}
  const link=`${base}/#seat=${seat(code,you.token,'Ты')}`;
  console.log('ROOM',code);console.log('OPEN',link);if(lan)console.log('PHONE',`${lan}/#seat=${seat(code,you.token,'Ты')}`);
  if(process.platform==='darwin')spawn('open',[link]);
  const youId=you.selfId;let answered='',reported='';
  for(;;){
    const f=b.state?.forgottenRoom;
    if(f&&f.phase==='ANSWER_PHASE'&&answered!==f.sessionId){answered=f.sessionId;const sid=f.sessionId;
      setTimeout(()=>{const pl=[...f.places].sort(()=>Math.random()-.5).slice(0,f.guessLimit);
        send(b,'ROOM_SUBMIT',{roomCode:code,sessionId:sid,answers:pl.map(p=>({slot:p.id}))});console.log('bot marked',pl.length);},4000+Math.random()*6000);}
    if(f&&f.phase==='RESULTS'&&reported!==f.sessionId){reported=f.sessionId;
      console.log('results',JSON.stringify(f.results.map(x=>[x.rank,x.playerId===youId?'Ты':'Борис',x.points])));
      for(const c of f.changes)console.log('  ',c.caption,'— нашли:',c.foundBy.map(id=>id===youId?'Ты':'Борис').join(', ')||'никто');}
    await sleep(250);
  }
})().catch(e=>{console.error(e);process.exit(1);});
