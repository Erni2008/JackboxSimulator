'use strict';
/** Phone-side hacker layer: CRT scanlines with a rolling band, a live terminal ticker, corner HUD readouts and
 *  glitch bursts on every verdict. Transform/opacity animations only, a handful of nodes: cheap on low-end phones. */
(function(){
  const CMDS=['ssh root@node-07','handshake … OK','inject 0x7F3A','nmap -sS 10.0.6.0/24','bypass firewall','decrypt vault.key','trace --reverse','spawn trojan.exe','checksum OK','token 9F-A2-C4','overflow @0x00FF','wipe --tracks','ROOT ACCESS','ping 12ms','tunnel open'];
  let term,hud,glitch,line=0,timer=0;
  function mount(){
    const scr=document.getElementById('sbx-screen');if(!scr||scr.querySelector('.sbh-crt'))return !!scr;
    const crt=document.createElement('div');crt.className='sbh-crt';crt.setAttribute('aria-hidden','true');crt.innerHTML='<i></i>';scr.append(crt);
    term=document.createElement('div');term.className='sbh-term';term.setAttribute('aria-hidden','true');scr.append(term);
    hud=document.createElement('div');hud.className='sbh-hud';hud.setAttribute('aria-hidden','true');hud.innerHTML='<b></b><b></b>';scr.append(hud);
    glitch=document.createElement('div');glitch.className='sbh-glitch';glitch.setAttribute('aria-hidden','true');scr.append(glitch);
    return true;
  }
  function hex(n){let s='';for(let i=0;i<n;i++)s+='0123456789ABCDEF'[Math.random()*16|0];return s;}
  function tick(){
    if(document.hidden||!mount())return;const scr=document.getElementById('sbx-screen');if(scr.offsetParent===null&&!scr.offsetWidth)return;
    const p=document.createElement('p');p.textContent='> '+CMDS[line++%CMDS.length];term.append(p);while(term.children.length>3)term.firstChild.remove();
    const b=hud.children;b[0].textContent='0x'+hex(4)+' · '+(20+Math.random()*80|0)+'ms';b[1].textContent='PKT '+hex(6);
  }
  function burst(kind){
    if(!mount())return;const bad=kind==='flash-bad',key=kind==='flash-key';
    glitch.className='sbh-glitch on '+(bad?'bad':key?'key':'ok');glitch.replaceChildren();
    for(let i=0;i<7;i++){const s=document.createElement('i');s.style.top=(Math.random()*92)+'%';s.style.height=(2+Math.random()*9)+'%';
      s.style.setProperty('--dx',((Math.random()-.5)*28).toFixed(1)+'%');s.style.animationDelay=(Math.random()*.12).toFixed(2)+'s';glitch.append(s);}
    clearTimeout(burst.t);burst.t=setTimeout(()=>{glitch.className='sbh-glitch';glitch.replaceChildren();},650);
  }
  window.SBFX={burst};
  const start=()=>{mount();if(!timer)timer=setInterval(tick,900);};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
