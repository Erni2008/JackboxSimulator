// THE HOST'S SUITCASE — mechanism VI, THE CIPHER LOCK (view, chapter VI, practice mirror of CipherLock.java).
// A cream instrument with two dark screens: the upper one shows the challenge, the lower one what is typed.
// TO_HEX: a word is shown, type its letters as hexadecimal codes. TO_TEXT: codes are shown, type the word.
import * as T from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {L} from '../i18n';
import {chapters, PW, PH, type Ink} from './notebook';
import {type Diff} from './wire-maze';

export type CipherMode = 'TO_HEX' | 'TO_TEXT';
export interface CipherLayout { mode: CipherMode; shown: string; length: number }
const SHORT = ['bat', 'owl', 'rat', 'axe', 'fog', 'ash', 'oak', 'rip', 'tomb', 'bone', 'doom', 'fear', 'soul', 'cage', 'grim', 'howl', 'moon', 'wolf', 'dark', 'fire'];
const LONG = ['ghost', 'skull', 'grave', 'curse', 'crypt', 'blood', 'witch', 'raven', 'candle', 'coffin', 'shadow', 'spider', 'pumpkin', 'demon', 'torch'];
export const hex = (w: string) => [...w].map(c => c.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0')).join(' ');
const unhex = (h: string) => h.split(' ').map(p => String.fromCharCode(parseInt(p, 16))).join('');
/** the expected answer for a layout (practice only: in a room the server judges) */
export const cipherAnswer = (l: CipherLayout) => l.mode === 'TO_HEX' ? hex(l.shown).replace(/ /g, '') : unhex(l.shown);
export const cipherAccepts = (l: CipherLayout, typed: string) => typed.replace(/\s+/g, '').toUpperCase() === cipherAnswer(l).toUpperCase(); // hex digits and letters: either case
export function makeCipher(seed: number, d: Diff): CipherLayout {
  let s = Math.abs(seed * 7349 + 13) % 2147483646 + 1; const r = () => (s = (s * 48271) % 2147483647) / 2147483647;
  const pool = [...SHORT.filter(w => d === 'EASY' ? w.length <= 4 : d === 'NORMAL' && w.length === 4), ...LONG.filter(w => d === 'NORMAL' ? w.length === 5 : d === 'HARD')];
  const word = pool[Math.floor(r() * pool.length)], mode: CipherMode = r() < .5 ? 'TO_HEX' : 'TO_TEXT';
  return {mode, shown: mode === 'TO_HEX' ? word : hex(word), length: word.length};
}
/** keys the on-screen keypad offers for a mode */
export const cipherKeys = (m: CipherMode) => m === 'TO_HEX' ? '0123456789ABCDEF'.split('') : 'abcdefghijklmnopqrstuvwxyz'.split('');
/** the most characters that can be typed (codes without spaces, or letters) */
export const cipherMax = (l: CipherLayout) => l.mode === 'TO_HEX' ? l.length * 2 : l.length;

const BW = .158, BD = .088, OZ = -.008; /* shallower than the bay and nudged back, so the bay's brass tag stays readable */
export class CipherView {
  readonly group = new T.Group(); layout: CipherLayout | null = null; input = '';
  private geos: T.BufferGeometry[] = []; private mats: T.Material[] = []; private texs: T.Texture[] = [];
  private top?: {ctx: CanvasRenderingContext2D; tex: T.CanvasTexture}; private low?: {ctx: CanvasRenderingContext2D; tex: T.CanvasTexture};
  private glassM?: T.Material; private glowM?: T.Material; /** max anisotropy for crisp text at a slant (set by the host page) */ static aniso = 8;
  private submitM: T.MeshStandardMaterial | null = null; private submitG: T.Group | null = null; private clearG: T.Group | null = null;
  private press = {submit: 0, clear: 0}; private flash = 0; private flashOk = false; private blink = 0; private done = false;

  build(l: CipherLayout) {
    this.clear(); this.layout = l; this.input = ''; this.done = false; this.group.position.z = OZ;
    const cream = this.m(new T.MeshStandardMaterial({map: this.grain(), color: '#e8dcc2', roughness: .62, metalness: .05}));
    const dark = this.m(new T.MeshStandardMaterial({color: '#23201c', roughness: .5, metalness: .3}));
    const body = new T.Mesh(this.g(new RoundedBoxGeometry(BW, .012, BD, 3, .0035)), cream); body.position.y = .006; this.group.add(body);
    // brass screws in the corners and a darker seam round the face
    const brass = this.m(new T.MeshStandardMaterial({color: '#b08a4a', metalness: 1, roughness: .32})), screw = this.g(new T.CylinderGeometry(.0026, .0026, .0012, 14)), slot = this.g(new T.BoxGeometry(.0042, .0004, .0007));
    const slotM = this.m(new T.MeshStandardMaterial({color: '#3a2a14', roughness: .8}));
    for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) { const sc = new T.Mesh(screw, brass); sc.position.set(sx * (BW / 2 - .007), .0122, sz * (BD / 2 - .007)); this.group.add(sc); const sl = new T.Mesh(slot, slotM); sl.position.set(sc.position.x, .0129, sc.position.z); sl.rotation.y = sx * sz * .7; this.group.add(sl); }
    // a recessed face plate with the engraved title and the format
    const face = this.face(l); face.rotation.x = -Math.PI / 2; face.position.y = .0122; this.group.add(face);
    const scr = (w: number, h: number, z: number, cw: number, ch: number) => { const c = document.createElement('canvas'); c.width = cw; c.height = ch; const ctx = c.getContext('2d')!, tex = this.tx(new T.CanvasTexture(c)) as T.CanvasTexture;
      const bez = new T.Mesh(this.g(new T.BoxGeometry(w + .008, .003, h + .008)), dark); bez.position.set(-.024, .0135, z); this.group.add(bez);
      const m = new T.Mesh(this.g(new T.PlaneGeometry(w, h)), this.m(new T.MeshBasicMaterial({map: tex, toneMapped: false}))); m.rotation.x = -Math.PI / 2; m.position.set(-.024, .0152, z); m.userData.cipher = 'screen'; this.group.add(m);
      // a pane of glass with a soft diagonal sheen, and the screen's glow spilling on the bezel
      const gl = new T.Mesh(this.g(new T.PlaneGeometry(w, h)), this.glassM ??= this.m(new T.MeshBasicMaterial({map: this.sheen(), transparent: true, depthWrite: false, blending: T.AdditiveBlending, toneMapped: false}))); gl.rotation.x = -Math.PI / 2; gl.position.set(-.024, .0156, z); gl.raycast = () => {}; this.group.add(gl);
      const glow = new T.Mesh(this.g(new T.PlaneGeometry(w + .014, h + .014)), this.glowM ??= this.m(new T.MeshBasicMaterial({map: this.halo(), color: '#9fd8ff', transparent: true, opacity: .22, depthWrite: false, blending: T.AdditiveBlending, toneMapped: false}))); glow.rotation.x = -Math.PI / 2; glow.position.set(-.024, .0150, z); glow.raycast = () => {}; this.group.add(glow);
      return {ctx, tex}; };
    this.top = scr(.094, .024, -.014, 940, 240); this.low = scr(.094, .02, .016, 940, 200);
    // the input slot's side bar (like a meter) and the two keys
    const key = (label: string, color: string, w: number, x: number, z: number, part: string) => { const g = new T.Group(); g.position.set(x, .012, z); this.group.add(g);
      const cap = this.m(new T.MeshStandardMaterial({map: this.keyTex(label, color), roughness: .45, metalness: .1, emissive: part === 'submit' ? '#3aff4a' : '#000', emissiveIntensity: 0}));
      const k = new T.Mesh(this.g(new RoundedBoxGeometry(w, .005, .016, 2, .0012)), [dark, dark, cap, dark, dark, dark]); k.position.y = .0025; k.userData.cipher = part; g.add(k);
      const hit = new T.Mesh(this.g(new T.BoxGeometry(w + .006, .012, .022)), this.m(new T.MeshBasicMaterial({visible: false}))); hit.position.y = .004; hit.userData.cipher = part; g.add(hit); return {g, cap}; };
    const sub = key(L('ВВОД', 'SUBMIT'), '#9ccf6a', .044, .052, -.014, 'submit'); this.submitG = sub.g; this.submitM = sub.cap;
    this.clearG = key(L('СТЕРЕТЬ', 'CLEAR'), '#c9b89a', .044, .052, .016, 'clear').g;
    this.paintTop(); this.paintLow();
  }
  /** a tap on the device: 'submit', 'clear', 'screen' or null */
  partAt(ray: T.Raycaster) { for (const h of ray.intersectObject(this.group, true)) if (h.object.userData.cipher) return h.object.userData.cipher as 'submit' | 'clear' | 'screen'; return null; }
  type(ch: string) { if (!this.layout || this.done || this.input.length >= cipherMax(this.layout)) return false; this.input += ch; this.paintLow(); return true; }
  back() { if (!this.input || this.done) return false; this.input = this.input.slice(0, -1); this.paintLow(); return true; }
  wipe() { if (this.done) return; this.input = ''; this.press.clear = 1; this.paintLow(); }
  pressSubmit() { this.press.submit = 1; }
  /** server or practice verdict: green and frozen, or red and wiped */
  result(ok: boolean) { this.flash = 1; this.flashOk = ok; if (ok) this.done = true; else this.input = ''; this.paintLow(); }
  /** the typed codes grouped in pairs, as on the upper screen */
  shownInput() { if (!this.layout) return ''; return this.layout.mode === 'TO_HEX' ? (this.input.match(/.{1,2}/g) ?? []).join(' ') : this.input; }
  update(dt: number) {
    for (const k of ['submit', 'clear'] as const) this.press[k] = Math.max(0, this.press[k] - dt * 5);
    if (this.submitG) this.submitG.position.y = .012 - this.press.submit * .0025; if (this.clearG) this.clearG.position.y = .012 - this.press.clear * .0025;
    const full = !!this.layout && this.input.length === cipherMax(this.layout);
    if (this.submitM) this.submitM.emissiveIntensity = this.done ? .9 : full ? .35 + .25 * Math.sin(performance.now() / 180) : 0;
    const b = Math.floor(performance.now() / 480) % 2; if (b !== this.blink) { this.blink = b; this.paintLow(); }
    if (this.flash > 0) { this.flash = Math.max(0, this.flash - dt * 1.4); this.paintLow(); }
  }
  private fit(x: CanvasRenderingContext2D, txt: string, max: number, w: number) { let s = max; do { x.font = `600 ${s}px "IBM Plex Mono", monospace`; s -= 4; } while (s > 30 && x.measureText(txt).width > w * .9); }
  private paintTop() { const t = this.top, l = this.layout; if (!t || !l) return; const x = t.ctx, w = 940, h = 240; this.lcdBack(x, w, h);
    x.textAlign = 'center'; x.textBaseline = 'middle'; this.fit(x, l.shown, 112, w); x.shadowColor = '#bfe8ff'; x.shadowBlur = 18; x.fillStyle = '#eaf6ff'; x.fillText(l.shown, w / 2, h / 2 + 4); x.shadowBlur = 0; this.scan(x, w, h); t.tex.needsUpdate = true; }
  private paintLow() { const t = this.low, l = this.layout; if (!t || !l) return; const x = t.ctx, w = 940, h = 200; this.lcdBack(x, w, h);
    const tint = this.flash > 0 ? (this.flashOk ? `rgba(60,255,110,${this.flash * .45})` : `rgba(255,40,30,${this.flash * .5})`) : ''; if (tint || this.done) { x.fillStyle = tint || 'rgba(60,255,110,.18)'; x.fillRect(0, 0, w, h); }
    const txt = this.shownInput(), cur = !this.done && this.blink ? '▌' : ' ';
    x.textAlign = 'center'; x.textBaseline = 'middle'; this.fit(x, (l.mode === 'TO_HEX' ? hex('W'.repeat(l.length)) : 'W'.repeat(l.length)) + '▌', 96, w); x.fillStyle = this.done ? '#b8ffc8' : '#f4efe6'; x.shadowColor = '#ffffff'; x.shadowBlur = 10;
    if (txt) x.fillText(txt + cur, w / 2, h / 2 + 4); else { x.globalAlpha = .38; x.font = '500 54px "IBM Plex Mono", monospace'; x.fillText(l.mode === 'TO_HEX' ? L('введи коды', 'type the codes') : L('введи слово', 'type the word'), w / 2, h / 2 + 2); x.globalAlpha = 1; }
    x.shadowBlur = 0; this.scan(x, w, h); t.tex.needsUpdate = true; }
  private lcdBack(x: CanvasRenderingContext2D, w: number, h: number) { const g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#16222a'); g.addColorStop(1, '#0a1014'); x.fillStyle = g; x.fillRect(0, 0, w, h);
    const v = x.createRadialGradient(w / 2, h / 2, h * .2, w / 2, h / 2, w * .6); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.55)'); x.fillStyle = v; x.fillRect(0, 0, w, h); }
  private scan(x: CanvasRenderingContext2D, w: number, h: number) { x.fillStyle = 'rgba(0,0,0,.18)'; for (let y = 0; y < h; y += 6) x.fillRect(0, y, w, 2); }
  private face(l: CipherLayout) { const c = document.createElement('canvas'); c.width = 1024; c.height = 660; const x = c.getContext('2d')!;
    x.fillStyle = 'rgba(0,0,0,0)'; x.clearRect(0, 0, 1024, 660); x.strokeStyle = 'rgba(80,60,40,.45)'; x.lineWidth = 6; x.strokeRect(14, 14, 996, 632);
    // the format sits centred above the screens, in red, the first thing to read; the letter count under them
    x.textAlign = 'center'; x.font = 'bold 48px "IBM Plex Mono", monospace'; x.fillStyle = '#8a1e10'; x.fillText(l.mode === 'TO_HEX' ? L('СЛОВО → HEX', 'WORD → HEX') : L('HEX → СЛОВО', 'HEX → WORD'), 380, 70);
    x.textAlign = 'left'; x.font = 'bold 34px Oswald, sans-serif'; x.fillStyle = '#4a3a28'; x.fillText(L('ШИФРАТОР', 'CIPHER LOCK'), 84, 628);
    x.textAlign = 'right'; x.font = '32px "IBM Plex Mono", monospace'; x.fillStyle = '#6a5a44'; x.fillText(L(`букв: ${l.length}`, `letters: ${l.length}`), 940, 628);
    const t = this.tx(new T.CanvasTexture(c));
    return new T.Mesh(this.g(new T.PlaneGeometry(BW, BD)), this.m(new T.MeshBasicMaterial({map: t, transparent: true, depthWrite: false}))); }
  private keyTex(label: string, color: string) { const c = document.createElement('canvas'); c.width = 400; c.height = 128; const x = c.getContext('2d')!; const g = x.createLinearGradient(0, 0, 0, 128); g.addColorStop(0, color); g.addColorStop(1, '#5a6a3a');
    x.fillStyle = color; x.fillRect(0, 0, 400, 128); x.fillStyle = g; x.globalAlpha = .35; x.fillRect(0, 0, 400, 128); x.globalAlpha = 1;
    x.fillStyle = '#1e2414'; x.font = 'bold 62px Oswald, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(label, 200, 68);
    return this.tx(new T.CanvasTexture(c)); }
  private grain() { const c = document.createElement('canvas'); c.width = c.height = 256; const x = c.getContext('2d')!; x.fillStyle = '#ece2cc'; x.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 2600; i++) { x.fillStyle = `rgba(${Math.random() < .5 ? '90,70,40' : '255,255,255'},${Math.random() * .06})`; x.fillRect(Math.random() * 256, Math.random() * 256, 2, 2); }
    return this.tx(new T.CanvasTexture(c)); }
  private sheen() { const c = document.createElement('canvas'); c.width = 256; c.height = 64; const x = c.getContext('2d')!, g = x.createLinearGradient(0, 0, 256, 64);
    g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(.42, 'rgba(255,255,255,0)'); g.addColorStop(.5, 'rgba(255,255,255,.10)'); g.addColorStop(.62, 'rgba(255,255,255,.03)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, 256, 64);
    return this.tx(new T.CanvasTexture(c)); }
  private halo() { const c = document.createElement('canvas'); c.width = 128; c.height = 64; const x = c.getContext('2d')!; x.filter = 'blur(10px)'; x.fillStyle = '#fff'; x.fillRect(18, 14, 92, 36); return this.tx(new T.CanvasTexture(c)); }
  private tx(t: T.Texture) { t.colorSpace = T.SRGBColorSpace; t.anisotropy = CipherView.aniso; this.texs.push(t); return t; }
  private g<G extends T.BufferGeometry>(g: G) { this.geos.push(g); return g; }
  private m<M extends T.Material>(m: M) { this.mats.push(m); return m; }
  clear() { for (const o of [...this.group.children]) this.group.remove(o); for (const g of this.geos) g.dispose(); for (const m of this.mats) m.dispose(); for (const t of this.texs) t.dispose();
    this.geos = []; this.mats = []; this.texs = []; this.glassM = this.glowM = undefined; this.layout = null; this.top = this.low = undefined; this.submitM = null; this.submitG = this.clearG = null; this.input = ''; }
}

// ---------------------------------------------------------------------------------------------- chapter VI
chapters.CIPHER.push((x: CanvasRenderingContext2D, ink: Ink) => {
  ink.title(L('VI. Шифратор', 'VI. The cipher lock'), L('два формата', 'two formats'));
  let y = ink.para(L('На верхнем экране — задание, на нижнем — то, что ты вводишь. Над экранами написан формат.', 'The upper screen shows the task, the lower one what you type. The format is printed above the screens.'), 100, 320, PW - 200, 31);
  y = ink.para(L('СЛОВО → HEX: показано слово. Найди каждую букву в таблице и введи её код, буква за буквой.', 'WORD → HEX: a word is shown. Find each letter in the table and type its code, letter by letter.'), 100, y, PW - 200, 31);
  ink.print('soul  →  73 6F 75 6C', 160, y + 50, 38, {bold: true}); y += 110;
  y = ink.para(L('HEX → СЛОВО: показаны коды по два знака. Найди каждый код в таблице и введи букву.', 'HEX → WORD: codes are shown, two signs each. Find each code in the table and type its letter.'), 100, y, PW - 200, 31);
  ink.print('63 61 67 65  →  cage', 160, y + 50, 38, {bold: true}); y += 110;
  y = ink.para(L('Пробелы вводить не нужно. Ошибся — нажми СТЕРЕТЬ. Неверный ВВОД — удар по взрывателю.', 'No spaces needed. A slip: press CLEAR. A wrong SUBMIT is a strike on the fuse.'), 100, y, PW - 200, 31);
  ink.hand(L('Сначала проверь формат над экраном!', 'Check the format above the screen first!'), 140, y + 70, 40, '#6a2a1a', -.03); void x;
});
chapters.CIPHER.push((x: CanvasRenderingContext2D, ink: Ink) => {
  ink.title(L('VI. Таблица кодов', 'VI. The code table'), 'a – z');
  const top = 330, rows = 13, colW = (PW - 200) / 2, rh = Math.min(64, (PH - top - 200) / rows);
  for (let i = 0; i < 26; i++) { const c = String.fromCharCode(97 + i), col = Math.floor(i / rows), row = i % rows, cx = 120 + col * colW, cy = top + row * rh;
    x.fillStyle = row % 2 ? 'rgba(90,60,30,.06)' : 'rgba(90,60,30,.12)'; x.fillRect(cx - 14, cy - rh * .62, colW - 30, rh * .9);
    ink.print(c, cx + 20, cy, 40); ink.print('=', cx + 110, cy, 34); ink.print(hex(c), cx + 180, cy, 40); }
  ink.hand('a–o: 61–6F   ·   p–z: 70–7A', 140, top + rows * rh + 50, 36, '#6a2a1a', -.02);
});
