// Play THE FINAL SECOND against the real room server: the production host screen opens in its own window
// (it starts the rounds and shows the room), your browser is a player, and a bot plays alongside you.
//   URL=http://localhost:18240 FS_TASK=CHAIN node tools/dev/final_second_play.cjs
// Prints (and opens on macOS) a seat link that logs your browser straight into the room. NO_HOST=1 skips the window.
const base=process.env.URL||'http://localhost:18240',difficulty=process.env.DIFFICULTY||'MEDIUM',lan=process.env.LAN||'';
const path=require('path'),{spawn}=require('child_process');
const form=o=>new URLSearchParams(o).toString();
async function post(p,data){const r=await fetch(base+p,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:form(data)});const j=await r.json();if(!r.ok)throw new Error(p+' '+JSON.stringify(j));return j;}
function socket(code,token,name){return new Promise((res,rej)=>{const ws=new WebSocket(base.replace('http','ws')+'/ws');const c={ws,name,state:null,id:0,offset:0};
  ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.payload&&m.payload.players){c.state=m.payload;c.offset=m.payload.serverTime-Date.now();}if(m.type==='ERROR')console.log(name,'error',m.payload.code);if(m.type==='AUTHENTICATED')res(c);};
  ws.onopen=()=>ws.send(JSON.stringify({type:'AUTH',requestId:'auth-'+name,payload:{roomCode:code,token}}));ws.onerror=rej;});}
const send=(c,type,payload)=>c.ws.send(JSON.stringify({type,requestId:c.name+'-'+(++c.id),payload}));
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const seat=(code,token,name)=>Buffer.from(JSON.stringify({code,token,name})).toString('base64url');
(async()=>{
  const room=await post('/rooms',{name:'Последняя секунда',maxPlayers:'8',gameMode:'standard'});const code=room.code;
  const you=await post(`/rooms/${code}/join`,{name:'Ты'}),bot=await post(`/rooms/${code}/join`,{name:'Борис'});
  const b=await socket(code,bot.token,'bot');
  if(!process.env.NO_HOST){const root=path.resolve(__dirname,'../..');
    const host=spawn(path.join(root,'gradlew'),['-q',':lwjgl3:finalSecondHost',`-Proom.url=${base}`,`-Proom.code=${code}`,`-Proom.token=${room.token}`,`-Proom.difficulty=${difficulty}`,`-Pfs.task=${process.env.FS_TASK||''}`],{cwd:root,stdio:['ignore',require('fs').openSync(process.env.HOST_LOG||'/dev/null','a'),require('fs').openSync(process.env.HOST_LOG||'/dev/null','a')]});
    host.on('exit',code=>console.log('host window closed',code));
    process.on('exit',()=>host.kill());}
  const link=`${base}/#seat=${seat(code,you.token,'Ты')}`;
  console.log('ROOM',code);console.log('HOST_TOKEN',room.token);console.log('OPEN',link);if(lan)console.log('PHONE',`${lan}/#seat=${seat(code,you.token,'Ты')}`);
  if(process.platform==='darwin')spawn('open',[link]);
  const youId=you.selfId;let pressed='',scheduled='',reported='';
  const serverNow=()=>Math.round(Date.now()+b.offset);
  for(;;){
    const f=b.state?.finalSecond;
    if(f&&f.phase==='RUNNING'){
      const chain=f.task==='CHAIN',mine=!chain||f.activePlayer===bot.selfId,key=f.sessionId+':'+(chain?f.turnId:'normal');
      const running=chain?f.turnRunning:f.myStarted;
      if(mine&&!running&&!f.myStopped&&pressed!==key){pressed=key;send(b,'FS_START',{roomCode:code,sessionId:f.sessionId,clientAt:serverNow(),...(chain?{turnId:f.turnId}:{})});}
      if(mine&&running&&!f.myStopped&&scheduled!==key){
        scheduled=key;const wait=chain?250+Math.random()*450:f.task==='SPEED_SHIFT'?Math.max(0,f.myDeadlineAt-serverNow()-100-Math.random()*600):Math.max(0,(6200+Math.random()*1800)-(serverNow()-f.myStartedAt)),sid=f.sessionId,turn=f.turnId;
        setTimeout(()=>{const latest=b.state?.finalSecond;if(!latest||latest.sessionId!==sid||latest.phase!=='RUNNING'||chain&&latest.turnId!==turn)return;
          send(b,'FS_STOP',{roomCode:code,sessionId:sid,clientAt:serverNow(),...(chain?{turnId:turn}:{elapsedMs:serverNow()-latest.myStartedAt})});
        },wait);
      }
    }
    if(f&&f.phase==='RESULTS'&&reported!==f.sessionId){reported=f.sessionId;
      console.log('results',JSON.stringify(f.results.map(x=>[x.rank,x.playerId===youId?'Ты':'Борис',x.stoppedMs,x.errorMs,x.eliminated])));}
    await sleep(100);
  }
})().catch(e=>{console.error(e);process.exit(1);});
