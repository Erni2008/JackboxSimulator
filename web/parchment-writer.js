/* Presentation only. Native textarea owns the draft, selection and IME. No character queue. */
'use strict';
function createParchmentWriter(input, surface) {
  const pen=surface.querySelector('.writing-pen'), ink=surface.querySelector('.parchment-ink');
  const probe=document.createElement('span');probe.className='writing-caret-probe';
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let active=false,frame=0,lastInput=0,interval=80,x=0,y=0,tx=0,ty=0,lastFrame=0,until=0,roomReduced=false;
  // Original 1774 x 887 pen: visible nib tip ~42,847. CSS transform origin uses same anchor.
  pen.style.transformOrigin='2.37% 95.49%';
  function locate(){
    ink.textContent=input.value.slice(0,input.selectionEnd??input.value.length);
    ink.append(probe);probe.textContent='\u200b';
    const a=probe.getBoundingClientRect(),b=surface.getBoundingClientRect();
    tx=a.left-b.left;ty=a.top-b.top+a.height*.76;
    ink.textContent=input.value;
    surface.classList.toggle('has-writing',!!input.value);
  }
  function paint(angle=0,lift=0,strokeX=0,strokeY=0,depth=1){const w=pen.offsetWidth;const edge=Math.max(0,Math.min(1,(x/Math.max(1,surface.clientWidth)-.43)/.35));pen.style.left=`${x+strokeX-w*.0237}px`;pen.style.top=`${y+strokeY-lift-w*(887/1774)*.9549}px`;pen.style.rotate=`${angle-edge*65}deg`;pen.style.scale=String(depth);pen.style.filter=`drop-shadow(${2+lift*.5}px ${5+lift}px ${3+lift*.55}px #27140966)`;}
  function animate(t){frame=0;if(!active)return;const dt=Math.min(40,t-(lastFrame||t));lastFrame=t;
    const tau=Math.min(38,Math.max(10,interval*.18)),blend=1-Math.exp(-dt/tau);
    x+=(tx-x)*blend;y+=(ty-y)*blend;
    const writing=t<until;
    // A single retargeted gesture: larger wrist sweeps plus a small nib stroke and lift.
    // New input replaces this gesture immediately; no per-letter queue or delayed ink.
    const elapsed=Math.max(0,t-lastInput),duration=Math.min(250,Math.max(170,interval*1.15));
    const envelope=writing?Math.min(1,elapsed/18)*Math.max(0,1-elapsed/duration):0;
    const wave=Math.sin(elapsed*.065),lift=Math.max(0,Math.sin(elapsed*.034))*12*envelope;
    paint(wave*34*envelope,lift,Math.sin(elapsed*.095)*6*envelope,Math.cos(elapsed*.08)*7*envelope,1+envelope*.18);
    if(writing||Math.hypot(tx-x,ty-y)>.15)frame=requestAnimationFrame(animate);else{x=tx;y=ty;paint();lastFrame=0;}
  }
  function update(immediate=false){locate();if(!active||immediate||reduced.matches||roomReduced){cancelAnimationFrame(frame);frame=0;lastFrame=0;x=tx;y=ty;paint();return;}until=performance.now()+Math.min(250,Math.max(170,interval*1.15));if(!frame)frame=requestAnimationFrame(animate);}
  function onInput(event){
    if(!event?.isComposing){const limited=Array.from(input.value.normalize('NFC')).slice(0,10).join('');if(input.value!==limited){const cursor=input.selectionEnd;input.value=limited;input.setSelectionRange(Math.min(cursor,limited.length),Math.min(cursor,limited.length));}}
    const t=performance.now();interval=Math.min(220,Math.max(16,t-lastInput));lastInput=t;update();}
  function selection(){if(document.activeElement===input)update();}
  const composed=()=>input.dispatchEvent(new Event('input',{bubbles:true}));
  input.addEventListener('compositionend',composed);
  input.addEventListener('input',onInput);input.addEventListener('select',selection);input.addEventListener('keyup',selection);input.addEventListener('click',selection);
  input.addEventListener('focus',selection);
  const resize=new ResizeObserver(()=>update(true));resize.observe(surface);
  const viewport=()=>{if(active&&document.activeElement===input)input.scrollIntoView({block:'nearest',behavior:'instant'});update(true);};
  window.visualViewport?.addEventListener('resize',viewport);
  const motion=()=>update(true);reduced.addEventListener('change',motion);
  document.fonts.load('550 36px ParchmentHand','Замок Привіт').then(()=>update(true));
  document.fonts.ready.then(()=>update(true));
  return {sync(enabled,reduce=false){const changed=roomReduced!==reduce;roomReduced=reduce;if(!enabled){active=false;cancelAnimationFrame(frame);frame=0;lastFrame=0;}else if(!active){active=true;update(true);}else if(changed)update(true);},
    refresh(){update(true);},dispose(){active=false;cancelAnimationFrame(frame);resize.disconnect();window.visualViewport?.removeEventListener('resize',viewport);reduced.removeEventListener('change',motion);input.removeEventListener('compositionend',composed);input.removeEventListener('input',onInput);for(const event of ['select','keyup','click','focus'])input.removeEventListener(event,selection);}};
}
