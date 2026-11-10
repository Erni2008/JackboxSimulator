// Play THE FORGOTTEN ROOM in a browser as a player, against the real room server.
// A protocol host starts rounds and a protocol bot plays alongside you; rounds repeat after the results.
//   URL=http://localhost:18240 DIFFICULTY=MEDIUM node tools/dev/forgotten_room_play.cjs
// Prints (and opens on macOS) a seat link that logs your browser straight into the room.
const base=process.env.URL||'http://localhost:18240',difficulty=process.env.DIFFICULTY||'MEDIUM',lan=process.env.LAN||'';
const form=o=>new URLSearchParams(o).toString();
async function post(path,data){const r=await fetch(base+path,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:form(data)});const j=await r.json();if(!r.ok)throw new Error(path+' '+JSON.stringify(j));return j;}
function socket(code,token,name){return new Promise((res,rej)=>{const ws=new WebSocket(base.replace('http','ws')+'/ws');const c={ws,name,state:null,id:0};
  ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.payload&&m.payload.players)c.state=m.payload;if(m.type==='ERROR')console.log(name,'error',m.payload.code);if(m.type==='AUTHENTICATED')res(c);};
  ws.onopen=()=>ws.send(JSON.stringify({type:'AUTH',requestId:'auth-'+name,payload:{roomCode:code,token}}));ws.onerror=rej;});}
const send=(c,type,payload)=>c.ws.send(JSON.stringify({type,requestId:c.name+'-'+(++c.id),payload}));
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const seat=(code,token,name)=>Buffer.from(JSON.stringify({code,token,name})).toString('base64url');
(async()=>{
  const room=await post('/rooms',{name:'Забытая комната',maxPlayers:'8',gameMode:'standard'});const code=room.code;
  const host=await socket(code,room.token,'host');
  const you=await post(`/rooms/${code}/join`,{name:'Ты'}),bot=await post(`/rooms/${code}/join`,{name:'Борис'});
  const b=await socket(code,bot.token,'bot');
  const link=`${base}/#seat=${seat(code,you.token,'Ты')}`;
  console.log('ROOM',code);console.log('OPEN',link);if(lan)console.log('PHONE',`${lan}/#seat=${seat(code,you.token,'Ты')}`);
  if(process.platform==='darwin')require('child_process').spawn('open',[link]);
  const youId=you.selfId;let answered='';
  for(;;){
    // wait for your browser to connect, then start a round
    while(!(host.state?.players||[]).some(p=>p.id===youId&&p.connectionStatus==='ONLINE'))await sleep(300);
    await sleep(1500);
    if(!host.state.forgottenRoom){send(host,'START_FORGOTTEN_ROOM',{roomCode:code,sessionId:host.state.lobbyId,difficulty});console.log('round started',difficulty);}
    while(!host.state.forgottenRoom)await sleep(200);
    const f=()=>host.state.forgottenRoom;
    while(f()&&f().phase!=='RESULTS'){
      const bs=b.state?.forgottenRoom;
      if(bs&&bs.phase==='ANSWER_PHASE'&&answered!==bs.sessionId){answered=bs.sessionId;await sleep(4000+Math.random()*6000);
        const pl=[...bs.places].sort(()=>Math.random()-.5).slice(0,Math.max(1,bs.guessLimit-1));
        const types=['DISAPPEARED','MOVED','APPEARED','ROTATED'];
        send(b,'ROOM_SUBMIT',{roomCode:code,sessionId:bs.sessionId,answers:pl.map(p=>({slot:p.id,type:types[Math.floor(Math.random()*types.length)]}))});console.log('bot answered');}
      await sleep(250);}
    const r=f();if(r){console.log('results',JSON.stringify(r.results.map(x=>[x.rank,x.playerId===youId?'Ты':'Борис',x.points])));
      for(const c of r.changes)console.log('  ',c.caption,'— нашли:',c.foundBy.map(id=>id===youId?'Ты':'Борис').join(', ')||'никто');}
    await sleep(9000);send(host,'END_FORGOTTEN_ROOM',{roomCode:code,sessionId:r.sessionId});await sleep(2500);
  }
})().catch(e=>{console.error(e);process.exit(1);});
