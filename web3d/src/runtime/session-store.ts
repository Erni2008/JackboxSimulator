/** Storage is optional: restrictive browser settings must not prevent a live session. */
const key='lc3d-session';
export function storeSession(credentials:any){try{sessionStorage.setItem(key,JSON.stringify(credentials));}catch{}}
export function clearSession(){try{sessionStorage.removeItem(key);}catch{}}
export function readSession(){
  try{const value=JSON.parse(sessionStorage.getItem(key)||'null');
    if(value&&typeof value==='object'&&typeof value.code==='string'&&/^[A-Z0-9]{6}$/.test(value.code)&&typeof value.token==='string'&&value.token.length>0&&value.token.length<=256)return value;
  }catch{}
  clearSession();return null;
}
