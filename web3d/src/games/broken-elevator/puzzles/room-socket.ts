// One authenticated room connection per elevator page, shared by every server-authoritative repair puzzle.
// (A second socket with the same seat would replace the first one on the server.)
type Listener = (ev: any) => void;

export class RoomSocket {
  private static instance: RoomSocket | null | undefined;
  /** the page's room seat connection, or null when this device has no room session (practice mode) */
  static shared(): RoomSocket | null {
    if (RoomSocket.instance !== undefined) return RoomSocket.instance;
    let creds: {code: string; token: string} | null = null;
    try { const c = JSON.parse(sessionStorage.getItem('finalanswer-session') || 'null'); if (c?.code && c?.token) creds = {code: c.code, token: c.token}; } catch {}
    return RoomSocket.instance = creds ? new RoomSocket(creds) : null;
  }
  authed = false; offset = 0; onStatus: (t: string) => void = () => {};
  private ws: WebSocket | null = null; private retry = 0; private ping: any = 0; private listeners: Listener[] = []; private authListeners: (() => void)[] = [];
  private constructor(private creds: {code: string; token: string}) { this.connect(); }
  listen(fn: Listener) { this.listeners.push(fn); }
  /** called on every (re)authentication — puzzles resume their state here */
  onAuth(fn: () => void) { this.authListeners.push(fn); if (this.authed) fn(); }
  serverNow() { return Date.now() + this.offset; }
  send(type: string, payload: any) { if (this.ws?.readyState === WebSocket.OPEN) this.ws.send(JSON.stringify({type, requestId: Math.random().toString(36).slice(2), payload})); }
  private connect() {
    const ws = new WebSocket(`${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/ws`); this.ws = ws; this.authed = false;
    ws.onopen = () => { this.send('AUTH', {roomCode: this.creds.code, token: this.creds.token}); clearInterval(this.ping); this.ping = setInterval(() => this.send('PING', {}), 5000); };
    ws.onmessage = e => { let ev: any; try { ev = JSON.parse(e.data); } catch { return; } const p = ev.payload || {}; if (typeof p.serverTime === 'number') this.offset = p.serverTime - Date.now();
      if (!this.authed && (ev.type === 'AUTHENTICATED' || ev.type === 'STATE' || p.roomCode)) { this.authed = true; this.retry = 0; this.onStatus(''); for (const f of this.authListeners) f(); }
      for (const f of this.listeners) f(ev); };
    ws.onclose = e => { clearInterval(this.ping); if (this.ws !== ws) return; this.authed = false; if (e.code === 4001 || e.code === 4002) { this.onStatus('Сеанс комнаты завершён'); return; }
      this.onStatus('Связь с сервером… восстанавливаем'); setTimeout(() => this.connect(), Math.min(5000, 400 * 2 ** this.retry++)); };
  }
}
