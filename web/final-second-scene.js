'use strict';
/** Painted player machine: the readout follows the controller's accessible text. */
(()=>{
  const digits=document.getElementById('fsec-digits'),canvas=document.getElementById('fsec-segments');
  if(!digits||!canvas)return;
  const ctx=canvas.getContext('2d');if(!ctx)return;
  const density=Math.min(3,Math.max(1,window.devicePixelRatio||1));
  canvas.width=744*density;canvas.height=204*density;ctx.setTransform(density,0,0,density,0,0);
  const light=ctx.createLinearGradient(0,27,0,175);light.addColorStop(0,'#ff7452');light.addColorStop(.38,'#ff3920');light.addColorStop(1,'#df2515');
  const masks={'0':63,'1':6,'2':91,'3':79,'4':102,'5':109,'6':125,'7':7,'8':127,'9':111,'-':64,'–':64};
  // a,b,c,d,e,f,g: beveled seven-segment bars.
  const bars=[[[12,0],[68,0],[76,7],[68,14],[12,14],[4,7]],[[70,16],[78,8],[84,16],[84,64],[77,72],[70,64]],[[70,84],[77,76],[84,84],[84,132],[78,140],[70,132]],[[12,134],[68,134],[76,141],[68,148],[12,148],[4,141]],[[0,84],[7,76],[14,84],[14,132],[6,140],[0,132]],[[0,16],[6,8],[14,16],[14,64],[7,72],[0,64]],[[12,67],[68,67],[76,74],[68,81],[12,81],[4,74]]];
  function draw(){
    ctx.clearRect(0,0,744,204);let value=digits.textContent.replace(/[,.]/g,'');
    const count=digits.dataset.kind==='count';if(count)value='  '+value+' ';
    for(let i=0;i<4;i++){
      if(count&&i!==2)continue;
      const x=count?330:151+i*104+(i>1?22:0),mask=masks[value[i]]||0;
      for(let bit=0;bit<7;bit++){
        const on=!!(mask&(1<<bit));ctx.beginPath();bars[bit].forEach(([bx,by],j)=>j?ctx.lineTo(x+bx,27+by):ctx.moveTo(x+bx,27+by));ctx.closePath();
        ctx.fillStyle=on?light:'#200d0b';ctx.shadowColor='#ff3018';ctx.shadowBlur=on?10:0;ctx.fill();ctx.shadowBlur=0;ctx.strokeStyle=on?'#ff886547':'#471a1426';ctx.lineWidth=.7;ctx.stroke();
      }
    }
    ctx.shadowBlur=0;
    if(digits.dataset.kind!=='count'){
      ctx.fillStyle=value.trim()?'#ed3622':'#29100d';ctx.beginPath();ctx.arc(359,174,6,0,Math.PI*2);ctx.fill();
    }
    if(!count){ctx.font='27px Georgia';ctx.fillStyle='#ae291e';ctx.fillText('с',617,160);}
  }
  canvas.parentElement.classList.add('has-segments');
  new MutationObserver(draw).observe(digits,{childList:true,characterData:true,subtree:true,attributes:true,attributeFilter:['data-kind']});draw();
})();
