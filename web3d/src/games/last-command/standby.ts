/** Static CRT title card; gameplay tasks continue to use their own renderer. */
export function drawStandby(ctx:CanvasRenderingContext2D,w:number,h:number){
 ctx.save();ctx.textAlign='center';ctx.textBaseline='middle';
 const bg=ctx.createRadialGradient(w*.5,h*.45,0,w*.5,h*.45,w*.7);bg.addColorStop(0,'#102b24');bg.addColorStop(1,'#020b09');ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);
 ctx.strokeStyle='#426f5b';ctx.lineWidth=2;ctx.strokeRect(w*.035,h*.045,w*.93,h*.91);
 ctx.fillStyle='#8cae9d';ctx.font=`500 ${w*.021}px Arial, sans-serif`;ctx.fillText('F I N A L   A N S W E R   /   0 3',w*.5,h*.14);
 ctx.fillStyle='#c9e7d5';ctx.font=`600 ${w*.091}px Arial, sans-serif`;ctx.fillText('THE LAST',w*.5,h*.36);ctx.fillText('COMMAND',w*.5,h*.55);
 ctx.fillStyle='#89b59b';ctx.font=`500 ${w*.023}px Arial, sans-serif`;ctx.fillText('20 КОМАНД · ОДИН ПОБЕДИТЕЛЬ',w*.5,h*.72);
 for(let i=0;i<20;i++){ctx.fillStyle=i===0?'#b5cbb7':'#294a3b';ctx.fillRect(w*(.23+i*.0275),h*.82,w*.014,h*.012);}
 ctx.fillStyle='#607f6d';ctx.font=`500 ${w*.016}px Arial, sans-serif`;ctx.fillText('ТЕРМИНАЛ ГОТОВ К ЗАПУСКУ',w*.5,h*.91);
 ctx.fillStyle='#00000016';for(let y=0;y<h;y+=4)ctx.fillRect(0,y,w,1);ctx.restore();
}
