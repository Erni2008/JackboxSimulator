// Live SYSTEM BREACH test against the real room server: the production host screen in its own window, your phone
// (or browser) as a player, and bots that play through the normal protocol (they guess answers at random).
//   URL=http://localhost:18240 LAN=http://192.168.1.218:18240 BOTS=3 node tools/dev/system_breach_live.cjs
const base=process.env.URL||'http://localhost:18240',lan=process.env.LAN||'',bots=Number(process.env.BOTS||3);
const path=require('path'),{spawn}=require('child_process');
async function post(p,data){const r=await fetch(base+p,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams(data)});const j=await r.json();if(!r.ok)throw new Error(p+' '+JSON.stringify(j));return j;}
const seat=(code,token,name)=>Buffer.from(JSON.stringify({code,token,name})).toString('base64url');
function bot(code,identity,name){
  const ws=new WebSocket(base.replace('http','ws')+'/ws');let n=0,state=null,busyUntil=0;
  const send=(type,payload)=>ws.readyState===1&&ws.send(JSON.stringify({type,requestId:name+'-'+(++n),payload}));
  ws.onopen=()=>send('AUTH',{roomCode:code,token:identity.token});
  ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.payload?.systemBreach)state=m.payload.systemBreach;};
  const pick=a=>a[Math.floor(Math.random()*a.length)];
  setInterval(()=>{
    send('SYNC',{});const s=state;if(!s||Date.now()<busyUntil)return;const me=s.self||{},a=me.actions||{},base={roomCode:code,sessionId:s.sessionId};
    if(s.phase==='INITIALIZATION'&&!me.passwordSelected&&me.passwordOptions?.length){send('SYSTEM_BREACH_PASSWORD_SELECT',{...base,password:pick(me.passwordOptions)});return;}
    if(s.phase!=='ACTIVE')return;busyUntil=Date.now()+1500+Math.random()*2500;
    if(me.recovery?.challengeId&&me.recovery.data?.options){send('SYSTEM_BREACH_RECOVERY_SUBMIT',{...base,challengeId:me.recovery.challengeId,answer:pick(me.recovery.data.options)});return;}
    if(me.attack?.attackId){send('SYSTEM_BREACH_ATTACK_SUBMIT',{...base,attackId:me.attack.attackId,password:pick(me.attack.options)});return;}
    if(me.challenge?.challengeId&&me.challenge.data?.options){const o=me.challenge.data.options;send('SYSTEM_BREACH_CHALLENGE_SUBMIT',{...base,challengeId:me.challenge.challengeId,answer:Math.random()<.6?o[0]:pick(o)});return;}
    const r=Math.random(),targets=(a.targets||[]).filter(t=>t.attack?.allowed);
    if(r<.25&&targets.length){send('SYSTEM_BREACH_ATTACK_REQUEST',{...base,targetId:pick(targets).playerId});return;}
    if(r<.33&&a.firewall?.allowed){send('SYSTEM_BREACH_FIREWALL_UPGRADE',base);return;}
    if(a.challengeTypes?.QUICK_QUESTION?.allowed)send('SYSTEM_BREACH_CHALLENGE_REQUEST',{...base,type:'QUICK_QUESTION'});
  },700);
}
(async()=>{
  const room=await post('/rooms',{name:'SYSTEM BREACH',maxPlayers:'8',gameMode:'standard'}),code=room.code;
  const you=await post(`/rooms/${code}/join`,{name:'Ты'});
  const names=['Алиса','Борис','Вика','Гоша','Даша','Женя','Лёша'].slice(0,Math.max(1,Math.min(7,bots)));
  for(const name of names)bot(code,await post(`/rooms/${code}/join`,{name}),name);
  const root=path.resolve(__dirname,'../..');
  const host=spawn(path.join(root,'gradlew'),['-q',':lwjgl3:systemBreachHost',`-Proom.url=${base}`,`-Proom.code=${code}`,`-Proom.token=${room.token}`,`-Psb.players=${names.length+1}`],{cwd:root,stdio:['ignore','inherit','inherit']});
  host.on('exit',c=>{console.log('host window closed',c);process.exit(0);});process.on('SIGTERM',()=>{host.kill();process.exit(0);});
  console.log('ROOM',code);console.log('OPEN',`${base}/#seat=${seat(code,you.token,'Ты')}`);if(lan)console.log('PHONE',`${lan}/#seat=${seat(code,you.token,'Ты')}`);
  console.log('The match starts as soon as your seat is connected.');
})().catch(e=>{console.error(e.message);process.exit(1);});
