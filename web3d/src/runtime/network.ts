/** Existing Final Answer JSON envelope and /ws. No second multiplayer transport. */
export class RoomConnection {
  state:any; socket:WebSocket; ready=false; stopped=false; retry:any; timer:any; serial=0;
  onstate=(s:any)=>{}; onerror=(s:string)=>{}; onstatus=(s:string)=>{};
  constructor(public credentials:any){this.state=credentials;}
  connect(){
    const ws=this.socket=new WebSocket(`${location.protocol==='https:'?'wss':'ws'}://${location.host}/ws`);
    this.onstatus('Подключение…');
    ws.onopen=()=>this.send('AUTH',{roomCode:this.credentials.code,token:this.credentials.token});
    ws.onmessage=e=>{if(this.stopped)return;try{const m=JSON.parse(e.data);if(m.type==='ERROR'||m.type.endsWith('_REJECTED')){this.onerror(m.payload.code);if(['ROOM_NOT_FOUND','SESSION_ENDED'].includes(m.payload.code)){this.stopped=true;clearInterval(this.timer);ws.close();this.onstatus('Сессия завершена — нажмите «Сменить комнату»');}return;}if(m.payload?.code&&m.payload?.selfId){this.ready=true;this.state=m.payload;this.onstatus('Онлайн');this.onstate(this.state);}}catch(err){this.onerror(String(err));}};
    ws.onerror=()=>this.onstatus('Ошибка сети');
    ws.onclose=e=>{this.ready=false;clearInterval(this.timer);if(this.stopped)return;this.onstatus('Нет связи — действия заблокированы');clearInterval(this.timer);if(!this.stopped&&e.code!==4001)this.retry=setTimeout(()=>this.connect(),1500);else if(e.code===4001)this.onerror('Эта сессия открыта в другой вкладке. Выйдите и подключитесь как другой игрок.');};
    clearInterval(this.timer);this.timer=setInterval(()=>{if(this.ready)this.send('PING',{roomCode:this.state.code});},10000);
  }
  send(type:string,payload:any){if(this.socket?.readyState!==WebSocket.OPEN)return false;this.socket.send(JSON.stringify({type,requestId:`browser_${Date.now()}_${++this.serial}`,payload}));return true;}
  action(element:string,action:string,value=''){if(!this.ready||!this.state.lastCommand)return false;return this.send('LAST_COMMAND_ACTION',{roomCode:this.state.code,sessionId:this.state.lastCommand.sessionId,element,action,value});}
  dispose(){this.stopped=true;clearTimeout(this.retry);clearInterval(this.timer);this.socket?.close();}
}
export async function formPost(url:string,data:any){const response=await fetch(url,{method:'POST',body:new URLSearchParams(data)});const result=await response.json();if(!response.ok)throw new Error(result.error||response.statusText);return result;}
