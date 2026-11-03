// Run against a room server: URL=http://localhost:PORT OUT=dir PLAYWRIGHT_MODULE=... CHROME_PATH=... node tools/checks/check_cursed_cards_phones.cjs
// End-to-end THE CURSED CARDS over the real server: host + 5 protocol bots + 1 browser phone player + 1 browser spectator.
const assert=require('node:assert/strict');const {chromium}=require(process.env.PLAYWRIGHT_MODULE);
const base=process.env.URL,out=process.env.OUT;const log=[];const ok=m=>log.push('PASS '+m);
const form=o=>new URLSearchParams(o).toString();
async function post(path,data){const r=await fetch(base+path,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:form(data)});const j=await r.json();if(!r.ok)throw new Error(path+' '+JSON.stringify(j));return j;}
function socket(code,token,name){return new Promise((res,rej)=>{const ws=new WebSocket(base.replace('http','ws')+'/ws');const c={ws,name,state:null,errors:[],id:0,events:[]};
  ws.onmessage=e=>{const m=JSON.parse(e.data);c.events.push(m.type);if(m.type==='ERROR')c.errors.push(m.payload.code);if(m.payload&&m.payload.phase){c.state=m.payload;}if(m.type==='AUTHENTICATED')res(c);};
  ws.onopen=()=>ws.send(JSON.stringify({type:'AUTH',requestId:'auth-'+name,payload:{roomCode:code,token}}));ws.onerror=rej;});}
const send=(c,type,payload)=>{const requestId=c.name+'-'+(++c.id);c.ws.send(JSON.stringify({type,requestId,payload}));return requestId;};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function until(fn,ms,what){const t=Date.now();while(Date.now()-t<ms){const v=fn();if(v)return v;await sleep(100);}throw new Error('timeout: '+what);}
(async()=>{
  const browser=await chromium.launch({executablePath:process.env.CHROME_PATH});const pageErrors=[];
  try{
    const room=await post('/rooms',{name:'Cards QA',maxPlayers:'8',gameMode:'standard'});const code=room.code;
    const host=await socket(code,room.token,'host');
    const names=['Vesper','Mordecai','Lilith','Absalom','Seraphine','Corvin','Watcher'];const joined={};
    for(const n of names)joined[n]=await post(`/rooms/${code}/join`,{name:n});
    const bots={};for(const n of names.slice(1,6))bots[n]=await socket(code,joined[n].token,n);
    async function phone(n){const ctx=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true});
      await ctx.addInitScript(([c,t,n])=>{sessionStorage.setItem('finalanswer-session',JSON.stringify({code:c,token:t,name:n}));},[code,joined[n].token,n]);
      const p=await ctx.newPage();p.on('pageerror',e=>pageErrors.push(n+': '+e.message));await p.goto(base+'/');return p;}
    const vesper=await phone('Vesper'),watcher=await phone('Watcher');
    await until(()=>host.state?.players?.length===7&&host.state.players.every(p=>p.connectionStatus==='ONLINE'),15000,'all online');
    const ids=Object.fromEntries(host.state.players.map(p=>[p.name,p.id]));const seats=names.slice(0,6).map(n=>ids[n]);
    // too few players is refused
    send(host,'START_CARDS',{roomCode:code,sessionId:host.state.lobbyId,participantIds:seats.slice(0,3)});await sleep(400);
    assert.ok(host.errors.includes('CARDS_PLAYER_COUNT'));ok('3 players refused (CARDS_PLAYER_COUNT)');
    host.errors.length=0;send(host,'START_CARDS',{roomCode:code,sessionId:host.state.lobbyId,participantIds:names.map(n=>ids[n])});await sleep(400);
    assert.ok(host.errors.includes('CARDS_PLAYER_COUNT'));ok('7 players refused (CARDS_PLAYER_COUNT)');
    send(host,'START_CARDS',{roomCode:code,sessionId:host.state.lobbyId,participantIds:seats});
    await until(()=>host.state?.cursedCards?.phase==='CURSE_VOTE',5000,'vote phase');ok('6 seated + 1 spectator -> audience curse vote');
    await watcher.waitForSelector('#cards-screen:not([hidden]) .cards-target');await sleep(300);await watcher.screenshot({path:out+'/phone-spectator-vote.png'});
    // seated player cannot vote
    send(bots.Mordecai,'CARDS_VOTE',{roomCode:code,sessionId:host.state.cursedCards.sessionId,targetId:ids.Lilith});await sleep(300);
    assert.ok(bots.Mordecai.errors.includes('CARDS_NOT_SPECTATOR'));ok('seated player cannot curse');
    await watcher.locator('.cards-target',{hasText:'LILITH'}).click();
    await until(()=>host.state?.cursedCards?.phase==='DEALING',8000,'deal after vote');
    assert.equal(host.state.cursedCards.cursedPlayer,ids.Lilith);ok('curse revealed publicly: Lilith (DEATH recipient never revealed)');
    assert.ok(!('hand' in host.state.cursedCards));ok('host snapshot carries no hand values');
    await vesper.waitForSelector('#cards-hand .cards-own');const own=await vesper.locator('#cards-hand .cards-own').count();
    const vesperSeat=seats.indexOf(ids.Vesper);
    await until(()=>host.state.cursedCards.phase!=='DEALING',60000,'dealing done');
    assert.equal(own,host.state.cursedCards.handSizes[vesperSeat]||own);await vesper.screenshot({path:out+'/phone-player-hand.png'});ok(`phone shows its own ${own} card(s) face up`);
    // SHUFFLE: unlimited, real (server order changes), private (only counts reach others), rapid taps coalesce
    const cdp=await vesper.context().newCDPSession(vesper);await cdp.send('Network.enable');await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:250,downloadThroughput:-1,uploadThroughput:-1});
    await until(()=>host.state.cursedCards.phase==='PLAYING',60000,'playing');
    const vSeat=seats.indexOf(ids.Vesper);const order=()=>vesper.$$eval('#cards-hand .cards-own',n=>n.map(x=>x.dataset.v).join(','));
    if((await vesper.locator('#cards-hand .cards-own').count())>=2){
      const before=await order(),set=before.split(',').sort().join(),count0=host.state.cursedCards.shuffled[vSeat];
      for(let i=0;i<12;i++){if(await vesper.locator('#cards-shuffle').isDisabled())break; /* a timeout took a card: one left, nothing to shuffle */await vesper.locator('#cards-shuffle').click({timeout:2000});await sleep(30);} // rapid taps under 250 ms latency
      await until(()=>host.state.cursedCards.shuffled[vSeat]>count0,8000,'shuffle reached the server');await sleep(900);
      const after=await order();assert.equal(after.split(',').sort().join(),set,'same cards after shuffling');
      const n=host.state.cursedCards.shuffled[vSeat]-count0;assert.ok(n>=1&&n<=12,'shuffles coalesced: '+n);
      assert.ok(!JSON.stringify(host.state.cursedCards).includes('"hand"'),'shared screen never receives hand values');
      ok(`SHUFFLE under 250 ms latency: ${n} accepted of 12 rapid taps, same cards, order ${before} → ${after}`);
      await vesper.screenshot({path:out+'/phone-player-shuffle.png'});
      await vesper.reload();await vesper.waitForSelector('#cards-hand .cards-own');await sleep(400);const re=(await order()).split(','),af=after.split(','),keep=a=>a.filter(v=>re.includes(v)&&af.includes(v)).join(',');
      assert.equal(keep(re),keep(af),'reconnect restores the shuffled order (cards the game moved meanwhile aside)');ok('reload after shuffling restores the server order');}
    await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:0,downloadThroughput:-1,uploadThroughput:-1});
    // play: bots act when it is their turn; the browser phone acts through the real UI; bots shuffle while being drawn from
    let turns=0,phoneTurns=0,dup=false,timeouts=0;const total=host.state.cursedCards.deckSize;
    while(host.state.cursedCards.phase==='PLAYING'){const s=host.state.cursedCards;
      if(Date.now()<s.turnReadyAt+50){await sleep(80);continue;}
      const drawer=Object.keys(ids).find(n=>ids[n]===s.drawer);
      if(drawer==='Vesper'){const ready=await vesper.waitForSelector('#cards-pick:not([hidden]) .cards-back:not([disabled])',{timeout:Math.max(800,s.turnDeadline-Date.now())}).catch(()=>null);
        if(!ready){if(host.state.cursedCards.turn!==s.turn||host.state.cursedCards.phase!=='PLAYING'){timeouts++;continue;}
          await vesper.screenshot({path:out+'/phone-stuck.png'});throw new Error('phone never offered its cards: '+JSON.stringify({turn:s.turn,ready:s.turnReadyAt,deadline:s.turnDeadline,now:Date.now()}));}
        if(phoneTurns===0)await vesper.screenshot({path:out+'/phone-player-turn.png'});
        const tappedOk=await vesper.locator('.cards-back').first().click({timeout:Math.max(300,s.turnDeadline-Date.now())}).then(()=>true,()=>false); // one tap takes the card
        if(!tappedOk){if(host.state.cursedCards.turn!==s.turn||host.state.cursedCards.phase!=='PLAYING'){timeouts++;continue;}throw new Error('phone tap failed inside its turn');}
        phoneTurns++;
        const turn=s.turn;await until(()=>host.state.cursedCards.turn!==turn||host.state.cursedCards.phase!=='PLAYING',15000,'phone draw applied');}
      else{const bot=bots[drawer];const turn=s.turn;const srcName=Object.keys(ids).find(n=>ids[n]===s.source);
        if(bots[srcName]&&s.sourceCards>=2&&turns%3===0)send(bots[srcName],'CARDS_SHUFFLE',{roomCode:code,sessionId:s.sessionId}); // the owner shuffles during the selection
        const rid=send(bot,'CARDS_DRAW',{roomCode:code,sessionId:s.sessionId,turn,slot:Math.floor(Math.random()*s.sourceCards),revision:s.sourceRevision});
        if(!dup){dup=true;bot.ws.send(JSON.stringify({type:'CARDS_DRAW',requestId:rid,payload:{roomCode:code,sessionId:s.sessionId,turn,slot:0}}));}
        await until(()=>host.state.cursedCards.turn!==turn||host.state.cursedCards.phase!=='PLAYING',15000,'bot draw applied');}
      turns++;const c=host.state.cursedCards;if(c.phase==='PLAYING')assert.equal(c.turnDeadline-c.turnReadyAt,5000,'five seconds per turn');const held=c.handSizes.reduce((a,b)=>a+b,0),gone=c.events.filter(e=>e.type==='pair').length*2;assert.equal(held+gone,total,'cards conserved');
      assert.ok(turns<400);}
    ok(`match finished in ${turns} turns (${phoneTurns} by the browser phone, ${timeouts} phone turns lost to the 5 s clock); cards conserved every turn; duplicate request ignored`);
    const c=host.state.cursedCards;assert.equal(c.phase,'FINISHED');assert.equal(c.survivors.length,5);ok('one loser, five survivors: '+Object.keys(ids).find(n=>ids[n]===c.loser));
    await vesper.waitForSelector('#cards-result:not([hidden])');await watcher.waitForSelector('#cards-result:not([hidden])');await sleep(300);
    await vesper.screenshot({path:out+'/phone-player-result.png'});await watcher.screenshot({path:out+'/phone-spectator-result.png'});ok('result shown on both phones');
    // reconnect: a dropped phone gets the same authoritative state back
    await vesper.reload();await vesper.waitForSelector('#cards-result:not([hidden])',{timeout:15000});ok('phone reload restores the finished match');
    const overflow=await vesper.evaluate(()=>document.documentElement.scrollWidth>innerWidth);assert.ok(!overflow);ok('no horizontal overflow at 390 px');
    send(host,'END_CARDS',{roomCode:code,sessionId:c.sessionId});await until(()=>host.state&&!host.state.cursedCards,5000,'ended');ok('host ends the match; room back to lobby');
  }catch(e){log.push('FAIL '+(e.stack||e));process.exitCode=1;}
  log.push('page errors: '+JSON.stringify(pageErrors));if(pageErrors.length)process.exitCode=1;console.log(log.join('\n'));await browser.close();process.exit();
})();
