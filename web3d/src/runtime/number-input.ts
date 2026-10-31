/** Presentation only. Server snapshots remain the sole authority for answers and progress. */
export class NumberInputPreview {
 task='';value='';private base='';private authority='';private pending:{id:string,key:string}[]=[];
 get count(){return this.pending.length;}
 static edit(value:string,key:string){if(key==='CLEAR')return '';if(key==='DELETE')return value.slice(0,-1);return /^[0-9-]$/.test(key)&&value.length<9&&(key!=='-'||!value)?value+key:value;}
 snapshot(panel:any,reply=''){const r=panel?.testRound,t=r?.touchscreen,task=panel?.sessionId+':'+r?.attemptId+':'+r?.taskId;const text=t?.kind==='number'?String(t.input||''):'';this.authority=text;const blocked=t?.kind!=='number'||r.status!=='PLAYING'||r.paused||r.nextAt;
  if(task!==this.task||blocked){this.task=task;this.pending=[];this.base=text;}else if(!this.pending.length)this.base=text;else{const index=this.pending.findIndex(e=>e.id===reply);if(index>=0){this.pending.splice(0,index+1);this.base=text;}}this.rebuild();
 }
 queue(id:string,key:string){if(!id||this.pending.length>=64)return;this.pending.push({id,key});this.rebuild();}
 cancel(){this.pending=[];this.base=this.authority;this.rebuild();}
 private rebuild(){this.value=this.pending.reduce((text,e)=>NumberInputPreview.edit(text,e.key),this.base);}
}
