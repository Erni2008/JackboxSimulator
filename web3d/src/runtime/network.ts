/** Existing Final Answer JSON envelope and /ws. No second multiplayer transport. */
export class RoomConnection {
  state:any; socket:WebSocket; ready=false; stopped=false; retry:any; timer:any; serial=0;lastPing=0;pendingReleases=new Map<string,any>();
  onstate=(s:any)=>{}; onerror=(s:string)=>{}; onstatus=(s:string)=>{};
  constructor(public credentials:any){this.state=credentials;}
  connect(){
    const ws=this.socket=new WebSocket(`${location.protocol==='https:'?'wss':'ws'}://${location.host}/ws`);
    this.onstatus('Подключение…');this.lastPing=performance.now();
    ws.onopen=()=>this.send('AUTH',{roomCode:this.credentials.code,token:this.credentials.token});
    ws.onmessage=e=>{if(this.stopped)return;try{const m=JSON.parse(e.data);for(const [id,pending] of this.pendingReleases)if(pending.requestId===m.requestId&&m.payload?.code!=='RATE_LIMITED')this.pendingReleases.delete(id);if(m.type==='ERROR'||m.type.endsWith('_REJECTED')){this.onerror(m.payload.code);if(['ROOM_NOT_FOUND','SESSION_ENDED'].includes(m.payload.code)){this.stopped=true;clearInterval(this.timer);ws.close();this.onstatus('Сессия завершена — нажмите «Сменить комнату»');}return;}if(m.payload?.code&&m.payload?.selfId){if(this.state?.lastCommand?.sessionId!==m.payload.lastCommand?.sessionId)this.pendingReleases.clear();this.ready=true;this.state=m.payload;if(m.payload.lastCommand?.testRound?.expanded){if(m.payload.lastCommand.testRound.paused&&!m.payload.lastCommand.testRound.awaitingReady&&!m.payload.lastCommand.testRound.waitingForTerminals&&!document.hidden)this.action("TOUCH_PANEL","VISIBILITY","VISIBLE");else if(!m.payload.lastCommand.testRound.paused&&document.hidden)this.action("TOUCH_PANEL","VISIBILITY","HIDDEN");}const clock=m.payload.lastCommand?.clockChallenge;if(clock&&clock!==this.clockChallenge){this.clockChallenge=clock;this.action("TOUCH_PANEL","CLOCK_SYNC",clock);}this.onstatus('Онлайн');this.onstate(this.state);}}catch(err){this.onerror(String(err));}};
    ws.onerror=()=>this.onstatus('Ошибка сети');
    ws.onclose=e=>{this.ready=false;clearInterval(this.timer);if(this.stopped)return;this.onstatus('Нет связи — действия заблокированы');clearInterval(this.timer);if(!this.stopped&&e.code!==4001)this.retry=setTimeout(()=>this.connect(),1500);else if(e.code===4001)this.onerror('Эта сессия открыта в другой вкладке. Выйдите и подключитесь как другой игрок.');};
    clearInterval(this.timer);this.timer=setInterval(()=>{if(!this.ready)return;const now=performance.now();if(now-this.lastPing>=10000){this.lastPing=now;this.send('PING',{roomCode:this.state.code});}for(const pending of this.pendingReleases.values())if(now-pending.sentAt>=750){pending.requestId=this.emit('LAST_COMMAND_ACTION',pending.payload);pending.sentAt=now;}},1000);
  }
  emit(type:string,payload:any){if(this.socket?.readyState!==WebSocket.OPEN)return '';const requestId=`browser_${Date.now()}_${++this.serial}`;this.socket.send(JSON.stringify({type,requestId,payload}));return requestId;}
  send(type:string,payload:any){return !!this.emit(type,payload);}
  private clockChallenge="";
  action(element:string,action:string,value=''){if(!this.ready||!this.state.lastCommand)return false;if(action==='PRESS')this.pendingReleases.delete(element);const payload={roomCode:this.state.code,sessionId:this.state.lastCommand.sessionId,...(this.state.lastCommand.testRound?.expanded?{taskId:this.state.lastCommand.testRound.taskId}:{}),element,action,value},requestId=this.emit('LAST_COMMAND_ACTION',payload);if(action==='RELEASE'&&requestId)this.pendingReleases.set(element,{payload,requestId,sentAt:performance.now()});return !!requestId;}
  dispose(){this.stopped=true;this.pendingReleases.clear();clearTimeout(this.retry);clearInterval(this.timer);this.socket?.close();}
}
export async function formPost(url:string,data:any){const response=await fetch(url,{method:'POST',body:new URLSearchParams(data)});const result=await response.json();if(!response.ok)throw new Error(result.error||response.statusText);return result;}
