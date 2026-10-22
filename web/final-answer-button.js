'use strict';
/** Native button semantics with the exact texture regions used by PlayerCountSelector. */
window.FinalAnswerButton=(()=>{
  const root='/art/ui/buttons/player_count/';
  const states=[['up','button_up.png',1774,887,[293,198,1191,483]],['hover','button_hover.png',1536,1024,[161,273,1208,452]],['pressed','button_pressed.png',1536,1024,[167,263,1198,456]]];
  const svgNS='http://www.w3.org/2000/svg';
  function enhance(button,options={}){
    if(button.dataset.faReady||button.hasAttribute("data-native-button"))return button;button.dataset.faReady='true';button.classList.add('fa-button');
    const original=Array.from(button.childNodes);const label=options.label??button.textContent.trim();button.replaceChildren();
    const suspect=button.classList.contains('suspect-card');
    for(const [state,file,w,h,crop] of states){
      const svg=document.createElementNS(svgNS,'svg');svg.classList.add('fa-art',`fa-${state}`);svg.setAttribute('aria-hidden','true');svg.setAttribute('viewBox',suspect?'0 0 1162 1353':crop.join(' '));svg.setAttribute('preserveAspectRatio','xMidYMid meet');
      const image=document.createElementNS(svgNS,'image');image.setAttribute('width',suspect?'1162':w);image.setAttribute('height',suspect?'1353':h);
      image.setAttribute('href',options[`${state}Image`]||(suspect?'/art/impostor/papers/suspect_papper.png':root+file));
      image.addEventListener('error',()=>button.classList.add('fa-missing'));svg.append(image);button.append(svg);
    }
    if(options.icon){const icon=document.createElement('img');icon.className='fa-icon';icon.src=options.icon;icon.alt='';button.append(icon);}
    const text=document.createElement('span');text.className='fa-label';if(options.label!==undefined||original.length===0)text.textContent=label;else text.append(...original);button.append(text);
    if(suspect){const indicator=document.createElement('span');indicator.className='fa-selection';indicator.textContent='SELECTED';indicator.setAttribute('aria-hidden','true');button.append(indicator);}
    const release=()=>button.classList.remove('is-pressed');
    button.addEventListener('pointerdown',e=>{if(button.disabled)return;button.classList.add('is-pressed');try{button.setPointerCapture(e.pointerId);}catch{}});
    for(const event of ['pointerup','pointercancel','lostpointercapture','blur'])button.addEventListener(event,release);
    button.addEventListener('keydown',e=>{if(!button.disabled&&(e.key===' '||e.key==='Enter'))button.classList.add('is-pressed');});button.addEventListener('keyup',release);
    if(options.onClick)button.addEventListener('click',options.onClick);
    return button;
  }
  function scan(node){if(node.nodeType!==1)return;if(node.matches('button'))enhance(node);for(const button of node.querySelectorAll('button'))enhance(button);}
  const observer=new MutationObserver(records=>{for(const record of records){if(record.type==='attributes'&&record.target.disabled)record.target.classList.remove('is-pressed');for(const node of record.addedNodes)scan(node);}});
  observer.observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['disabled']});scan(document.documentElement);
  return {enhance,create(options){const button=document.createElement('button');button.type='button';return enhance(button,options);}};
})();
