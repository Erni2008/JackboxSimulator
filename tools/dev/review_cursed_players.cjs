'use strict';
process.chdir(require('node:path').resolve(__dirname, '../..'));

/** Local developer viewer only. Four original phone controllers, isolated tab identities, real room protocol.
 * The loopback proxy allows its own review frames; production CSP/routes/assets stay unchanged. */
const fs=require('fs'),path=require('path'),http=require('http');
const directory=path.resolve('lwjgl3/build/cursed-full-round');
const pause=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
  const file=path.join(directory,'player-review.json');
  for(let n=0;!fs.existsSync(file)&&n<1800;n++)await pause(100);
  if(!fs.existsSync(file))throw Error('Player review preparation did not finish');
  const review=JSON.parse(fs.readFileSync(file)),target=new URL(review.url);
  const labels=['ИГРОК · GHOST','ИГРОК · PUPPETEER','ИГРОК · DRACULA','ИГРОК · VOODOO'];
  function upstreamHeaders(req){return {...req.headers,host:target.host,'accept-encoding':'identity',...(req.headers.origin?{origin:target.origin}:{})};}
  const server=http.createServer(async(req,res)=>{
    const url=new URL(req.url,'http://localhost');
    if(url.pathname==='/review/state'){
      const request=http.get(new URL('/rooms/'+review.code,target),response=>{res.writeHead(response.statusCode,{'content-type':'application/json','cache-control':'no-store'});response.pipe(res);});
      request.on('error',()=>{res.writeHead(503);res.end('{}');});return;
    }
    if(url.pathname==='/review/start'){
      if(req.method!=='POST'||(req.headers.origin&&new URL(req.headers.origin).host!==req.headers.host)){res.writeHead(403);return res.end();}
      const id=require('crypto').randomUUID(),file=path.join(directory,'control.json');
      fs.writeFileSync(file+'.review-tmp',JSON.stringify({id,command:'START_QUESTIONS'}));fs.renameSync(file+'.review-tmp',file);
      res.writeHead(202,{'content-type':'application/json'});return res.end(JSON.stringify({started:true}));
    }
    if(url.pathname==='/review-actions.js'){
      res.writeHead(200,{'content-type':'text/javascript; charset=utf-8','cache-control':'no-store'});
      return res.end(`const start=document.getElementById('start-question'),phase=document.getElementById('review-phase'),focus=document.getElementById('player-focus');let starting=false;focus.addEventListener('change',()=>{const single=focus.value!=='all';document.querySelector('.players').classList.toggle('focused',single);document.querySelectorAll('.phone').forEach((phone,i)=>phone.hidden=single&&String(i)!==focus.value);});
      async function refresh(){try{const r=await fetch('/review/state');if(!r.ok)throw Error('Game server unavailable');const s=await r.json();const connected=s.players.filter(p=>p.connectionStatus==='ONLINE').length;phase.textContent='ПОДКЛЮЧЕНО '+connected+'/4 · '+(s.cursedBoxes?.phase||s.phase);start.disabled=starting||s.phase!=='LOBBY'||connected!==4;start.hidden=s.phase!=='LOBBY';}catch(e){phase.textContent=e.message;start.disabled=true;}}
      start.addEventListener('click',async()=>{starting=true;start.disabled=true;try{const r=await fetch('/review/start',{method:'POST'});if(!r.ok)throw Error('Cannot start question');start.textContent='ЗАПУСК ВОПРОСА…';}catch(e){starting=false;phase.textContent=e.message;}await refresh();});refresh();setInterval(refresh,1000);`);
    }
    if(url.pathname==='/'){
      res.writeHead(200,{'content-type':'text/html; charset=utf-8','cache-control':'no-store'});
      return res.end(`<!doctype html><html lang="ru"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>FINAL ANSWER — Пульты игроков</title><style>
      *{box-sizing:border-box}body{margin:0;background:#100b0e;color:#e5d2b6;font:14px system-ui,sans-serif}header{padding:18px 24px;border-bottom:1px solid #664332}h1{font-size:24px;margin:0 0 7px;letter-spacing:.03em}p{margin:5px 0;color:#c0a998;line-height:1.5}button#start-question{padding:12px 24px;margin:10px 14px 4px 0;background:#772738;color:#ffe6c6;border:1px solid #be8a61;border-radius:4px;font:700 16px system-ui;cursor:pointer}button#start-question:disabled{opacity:.45;cursor:wait}#review-phase{font-size:12px;color:#c0a998}.players{display:grid;grid-template-columns:repeat(4,minmax(280px,1fr));gap:14px;padding:18px;align-items:start;max-width:1720px;margin:auto}.players.focused{grid-template-columns:minmax(280px,430px);justify-content:center}.phone[hidden]{display:none}select#player-focus{padding:10px;margin-left:14px;color:#efdbc1;background:#25151c;border:1px solid #81543d;border-radius:4px;font-size:14px}.phone{overflow:hidden;border:1px solid #81543d;border-radius:22px;background:#080608;box-shadow:0 12px 30px #0006}.role{padding:12px;text-align:center;font-weight:700;font-size:12px;letter-spacing:.05em;color:#e2b785;border-bottom:1px solid #684436}.phone:nth-child(-n+2) .role{color:#dd8f94}iframe{display:block;width:100%;height:clamp(560px,calc(100vh - 210px),760px);border:0;background:#090609}@media(max-width:1190px){.players{grid-template-columns:repeat(2,minmax(280px,390px));justify-content:center}}@media(max-width:620px){.players{grid-template-columns:minmax(280px,390px)}}
      </style><header><h1>CURSED BOXES — со стороны игроков</h1><p>Четыре настоящих пульта · комната ${review.code} · 3D-сцена открыта отдельно</p><p>Нажмите «Начать вопрос». Смотрите представление вопроса в игре, затем отвечайте на пультах ниже. После результатов неверно ответившие выбирают убежища, верно ответившие стреляют по очереди. Всё вручную.</p><p>Для сценария с двумя скрывающимися: Ghost и Puppeteer выбирают ответ №1, Dracula и Voodoo — ответ №2. Затем Ghost прячется в BOX 06, Puppeteer — в BOX 11.</p><button id="start-question" disabled>НАЧАТЬ ВОПРОС</button><span id="review-phase">Подключение пультов…</span><select id="player-focus" aria-label="Какой экран игрока показать"><option value="all">ВСЕ 4 ПУЛЬТА</option><option value="0">КРУПНО: GHOST</option><option value="1">КРУПНО: PUPPETEER</option><option value="2">КРУПНО: DRACULA</option><option value="3">КРУПНО: VOODOO</option></select></header><main class="players">${labels.map((label,i)=>`<section class="phone"><div class="role">${i+1}. ${label}</div><iframe name="player${i}" src="/phone?player=${i}" title="${label}"></iframe></section>`).join('')}</main><script src="/review-actions.js"></script></html>`);
    }
    if(url.pathname==='/cursed-boxes.js'||url.pathname==='/cursed-boxes.css'){
      res.writeHead(200,{'content-type':url.pathname.endsWith('.js')?'text/javascript; charset=utf-8':'text/css; charset=utf-8','cache-control':'no-store'});
      return res.end(fs.readFileSync(path.join('web',url.pathname.slice(1))));
    }
    if(url.pathname==='/review-bootstrap.js'){
      const i=Number(url.searchParams.get('player'));if(!Number.isInteger(i)||!review.players[i]){res.writeHead(404);return res.end();}
      res.writeHead(200,{'content-type':'text/javascript','cache-control':'no-store'});
      return res.end(`sessionStorage.setItem('finalanswer-review-'+window.name,${JSON.stringify(JSON.stringify(review.players[i]))});`);
    }
    const resource=url.pathname==='/phone'?'/':req.url;
    const request=http.request(new URL(resource,target),{method:req.method,headers:upstreamHeaders(req)},response=>{
      const headers={...response.headers};delete headers['content-security-policy'];delete headers['x-frame-options'];delete headers['content-length'];headers['cache-control']='no-store';
      const transform=url.pathname==='/phone'||url.pathname==='/app.js';
      if(!transform){res.writeHead(response.statusCode,headers);return response.pipe(res);}
      const chunks=[];response.on('data',b=>chunks.push(b));response.on('end',()=>{
        let body=Buffer.concat(chunks).toString('utf8');
        if(url.pathname==='/phone')body=body.replace('</head>',`<script src="/review-bootstrap.js?player=${Number(url.searchParams.get('player'))}"></script></head>`);
        else body=body.replaceAll("'finalanswer-session'","('finalanswer-review-'+window.name)");
        res.writeHead(response.statusCode,headers);res.end(body);
      });
    });request.on('error',e=>{res.writeHead(502);res.end('Local game server unavailable: '+e.message);});req.pipe(request);
  });
  server.on('upgrade',(req,socket,head)=>{
    const request=http.request(new URL(req.url,target),{headers:upstreamHeaders(req)});
    request.on('upgrade',(response,peer,peerHead)=>{
      socket.write('HTTP/1.1 101 Switching Protocols\r\n'+Object.entries(response.headers).map(([k,v])=>`${k}: ${v}`).join('\r\n')+'\r\n\r\n');
      if(head.length)peer.write(head);if(peerHead.length)socket.write(peerHead);socket.pipe(peer).pipe(socket);
      socket.on('error',()=>peer.destroy());peer.on('error',()=>socket.destroy());socket.on('close',()=>peer.destroy());
    });request.on('response',response=>{socket.end(`HTTP/1.1 ${response.statusCode} Rejected\r\n\r\n`);});request.on('error',()=>socket.destroy());request.end();
  });
  server.listen(Number(process.env.REVIEW_PORT)||0,'127.0.0.1',()=>{
    const url=`http://127.0.0.1:${server.address().port}`;fs.writeFileSync(path.join(directory,'review-url.json'),JSON.stringify({url,code:review.code}));console.log('Player review: '+url);
  });
})().catch(e=>{console.error(e);process.exitCode=1;});
