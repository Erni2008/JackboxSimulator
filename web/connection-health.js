'use strict';
/** One outstanding heartbeat deadline. Cleared generations cannot disconnect a newer socket. */
function createResponseWatchdog({onTimeout,timeoutMillis=8000,schedule=setTimeout,cancel=clearTimeout}) {
  let timer=null,request=null,version=0;
  function clear(){version++;if(timer!==null)cancel(timer);timer=null;request=null;}
  function arm(requestId){
    clear();request=requestId;const current=version;
    timer=schedule(()=>{if(current!==version)return;timer=null;const expired=request;request=null;version++;onTimeout(expired);},timeoutMillis);
  }
  function acknowledge(requestId){if(request!==null&&requestId===request){clear();return true;}return false;}
  return {arm,acknowledge,clear,pending:()=>request!==null};
}
