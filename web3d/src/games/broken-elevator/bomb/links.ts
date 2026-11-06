// THE HOST'S SUITCASE — mechanism II, HIDDEN CONNECTIONS (view, tester, practice mirror).
// Two rows of brass contacts (letters over numbers). The player moves a red and a black probe onto contacts; the
// tester reads what lies between them. In a room the server computes every reading (shared/.../HiddenLinks.java) and
// the hidden graph never reaches the phone; the practice mirror below follows the same rules. Fictional device.
import * as T from 'three';
import {L} from '../i18n';
import {chapters, PW, type Ink} from './notebook';
import type {Diff} from './wire-maze';

export const LETTERS = 'ABCDEF'.split('');
type Part = 'JUMPER' | 'RESISTOR' | 'DIODE';
export interface LinksModel { n: number; read(red: number, black: number): string; isFiring(a: number, b: number): boolean }
const rng = (s: number) => () => (s = (s * 48271 + 7) % 2147483647) / 2147483647;
/** practice only: the same rules as HiddenLinks.java */
export function makeLinks(seed: number, d: Diff): LinksModel {
  const r = rng(Math.abs(seed * 104729 + 3) % 2147483646 + 1), n = d === 'EASY' ? 4 : d === 'NORMAL' ? 5 : 6, diodes = d === 'EASY' ? 1 : d === 'NORMAL' ? 2 : 3;
  let partner: number[] = [], part: Part[] = [], tenths: number[] = [], toNum: boolean[] = [];
  for (;;) { partner = Array.from({length: n}, (_, i) => i).sort(() => r() - .5); const idx = Array.from({length: n}, (_, i) => i).sort(() => r() - .5); part = []; tenths = []; toNum = [];
    idx.forEach((i, k) => { if (k < diodes) { part[i] = 'DIODE'; toNum[i] = r() < .5; tenths[i] = 0; } else if (r() < 1 / 3) { part[i] = 'JUMPER'; tenths[i] = 0; toNum[i] = false; } else { part[i] = 'RESISTOR'; tenths[i] = 10 + Math.floor(r() * 82); toNum[i] = false; } });
    const back = idx.slice(0, diodes).filter(i => !toNum[i]).length; if (d === 'NORMAL' && back !== 1) continue; if (d === 'HARD' && back !== 2) continue; break; }
  let sol = -1; for (let i = 0; i < n; i++) { if (part[i] !== 'DIODE') continue; if (d === 'EASY') { sol = i; break; } if (toNum[i]) continue; if (d === 'NORMAL') { sol = i; break; } if (sol < 0 || partner[i] > partner[sol]) sol = i; }
  return {n, read(red, black) { if (red === black || red < 0 || black < 0) return '—'; const rl = red < n; if (rl === (black < n)) return 'OL'; const letter = rl ? red : black, num = (rl ? black : red) - n; if (partner[letter] !== num) return 'OL';
      return part[letter] === 'JUMPER' ? '0.00' : part[letter] === 'RESISTOR' ? `${Math.floor(tenths[letter] / 10)}.${tenths[letter] % 10}k` : toNum[letter] === rl ? '0.62▶' : 'OL'; },
    isFiring(a, b) { const l = Math.min(a, b), num = Math.max(a, b) - n; return l >= 0 && l < n && num >= 0 && num < n && l === sol && partner[l] === num; }};
}

/** contact ids: letters 0..n-1 (top row), numbers n..2n-1 (bottom row) */
export class LinksView {
  readonly group = new T.Group(); n = 0; red = -1; black = -1; neutral = false;
  private contacts: T.Mesh[] = []; private probes: {g: T.Group; at: number; y: number}[] = []; private geos: T.BufferGeometry[] = []; private mats: T.Material[] = []; private tex: T.CanvasTexture | null = null; private flash = 0;
  build(n: number) {
    this.clear(); this.n = n; this.red = this.black = -1; this.neutral = false;
    const W = .108, D = .112, plate = document.createElement('canvas'); plate.width = 768; plate.height = 800; const x = plate.getContext('2d')!;
    x.fillStyle = '#26231f'; x.fillRect(0, 0, 768, 800); x.strokeStyle = 'rgba(200,170,110,.35)'; x.lineWidth = 3; x.strokeRect(20, 20, 728, 760);
    x.fillStyle = '#e8d4a6'; x.textAlign = 'center'; x.textBaseline = 'middle';
    for (let i = 0; i < n; i++) { const px = (i + .5) / n * 768; x.font = 'bold 64px "Libre Caslon Text", Georgia, serif'; x.fillText(LETTERS[i], px, 120); x.font = 'bold 60px "IBM Plex Mono", monospace'; x.fillText(String(i + 1), px, 690); }
    // engraved "sealed" plate between the rows: the links run under it
    x.fillStyle = '#1c1a17'; x.fillRect(60, 300, 648, 200); x.strokeStyle = '#7a6438'; x.strokeRect(60, 300, 648, 200); x.font = 'bold 34px Oswald, sans-serif'; x.fillStyle = '#9a8458'; x.fillText(L('ПЛОМБА · НЕ ВСКРЫВАТЬ', 'SEALED · DO NOT OPEN'), 384, 400);
    for (let k = 0; k < 8; k++) { x.beginPath(); x.arc(80 + k * 87, 320, 6, 0, 7); x.arc(80 + k * 87, 480, 6, 0, 7); x.fillStyle = '#5a4a32'; x.fill(); }
    this.tex = new T.CanvasTexture(plate); this.tex.colorSpace = T.SRGBColorSpace; this.tex.anisotropy = 8;
    const face = new T.Mesh(this.g(new T.PlaneGeometry(W, D)), this.m(new T.MeshStandardMaterial({map: this.tex, metalness: .5, roughness: .55}))); face.rotation.x = -Math.PI / 2; face.position.y = .0034; this.group.add(face);
    const brass = this.m(new T.MeshStandardMaterial({color: '#c09450', metalness: 1, roughness: .3})), dome = this.g(new T.SphereGeometry(.0052, 18, 10, 0, Math.PI * 2, 0, Math.PI / 2)), ring = this.g(new T.TorusGeometry(.0058, .0011, 6, 20)), dark = this.m(new T.MeshStandardMaterial({color: '#141210', metalness: .6, roughness: .5}));
    for (let id = 0; id < 2 * n; id++) { const top = id < n, i = top ? id : id - n, px = -W / 2 + (i + .5) / n * W, pz = top ? -D / 2 + .028 : D / 2 - .028;
      const c = new T.Mesh(dome, brass.clone()); this.mats.push(c.material as T.Material); c.position.set(px, .0034, pz); c.userData.contact = id; this.group.add(c); this.contacts.push(c);
      const rr = new T.Mesh(ring, dark); rr.rotation.x = Math.PI / 2; rr.position.set(px, .0036, pz); this.group.add(rr); }
    // the two probes: lacquered handle, steel needle, a cable trailing off the bay
    for (const col of ['#b01e14', '#151515']) { const g = new T.Group(); const hm = this.m(new T.MeshStandardMaterial({color: col, roughness: .35, metalness: .1})), sm = this.m(new T.MeshStandardMaterial({color: '#c8c8c8', metalness: 1, roughness: .2}));
      const needle = new T.Mesh(this.g(new T.ConeGeometry(.0011, .012, 8)), sm); needle.rotation.x = Math.PI; needle.position.y = .006; g.add(needle);
      const handle = new T.Mesh(this.g(new T.CylinderGeometry(.0028, .0032, .03, 12)), hm); handle.position.y = .027; g.add(handle);
      const guard = new T.Mesh(this.g(new T.CylinderGeometry(.0045, .0045, .002, 14)), hm); guard.position.y = .013; g.add(guard);
      g.rotation.z = col === '#151515' ? -.35 : .35; g.visible = false; this.group.add(g); this.probes.push({g, at: -1, y: 0}); }
  }
  private g<G extends T.BufferGeometry>(g: G) { this.geos.push(g); return g; }
  private m<M extends T.Material>(m: M) { this.mats.push(m); return m; }
  contactAt(ray: T.Raycaster): number { const h = ray.intersectObjects(this.contacts, false)[0]; if (h) return h.object.userData.contact;
    // forgiving touch: the nearest contact within 9 mm of the hit on the plate
    const p = ray.intersectObject(this.group, true)[0]; if (!p) return -1; const lp = this.group.worldToLocal(p.point.clone()); let best = -1, bd = .009 ** 2; for (const c of this.contacts) { const d = (c.position.x - lp.x) ** 2 + (c.position.z - lp.z) ** 2; if (d < bd) { bd = d; best = c.userData.contact; } } return best; }
  place(probe: 0 | 1, id: number) { if (probe === 0) this.red = id; else this.black = id; const pr = this.probes[probe]; pr.at = id; pr.y = .02; pr.g.visible = id >= 0; }
  warn() { this.flash = 1; }
  update(dt: number) {
    for (const p of this.probes) { if (p.at < 0) continue; const c = this.contacts[p.at]; p.y = Math.max(0, p.y - dt * .12); p.g.position.set(c.position.x, c.position.y + .004 + p.y, c.position.z); }
    this.flash = Math.max(0, this.flash - dt * 1.6);
    this.contacts.forEach(c => { const m = c.material as T.MeshStandardMaterial, id = c.userData.contact, sel = id === this.red || id === this.black; m.emissive.set(this.flash > 0 ? '#ff1a00' : '#ffb060'); m.emissiveIntensity = this.flash > 0 ? this.flash * (Math.sin(this.flash * 40) > 0 ? .9 : .2) : sel ? .35 : 0; });
  }
  clear() { for (const o of [...this.group.children]) this.group.remove(o); for (const g of this.geos) g.dispose(); for (const m of this.mats) m.dispose(); this.tex?.dispose(); this.geos = []; this.mats = []; this.contacts = []; this.probes = []; }
}

// ---------------------------------------------------------------------------------------------- chapter II
chapters.HIDDEN_CONNECTIONS.push((x: CanvasRenderingContext2D, ink: Ink) => {
  ink.title(L('II. Как читать тестер', 'II. Reading the tester'), L('скрытые соединения', 'hidden connections'));
  let y = ink.para(L('Под пломбой каждая буква соединена ровно с одним номером. Поставь красный щуп на один контакт, чёрный — на другой. Экран покажет, что между ними:', 'Under the seal every letter is linked to exactly one number. Put the red probe on one contact and the black on another. The screen shows what lies between them:'), 100, 320, PW - 200, 31) + 16;
  const rows: [string, string][] = [['0.00', L('перемычка (прямой провод)', 'jumper (a plain wire)')], ['4.7k', L('сопротивление — число любое', 'resistor — any value')], ['0.62▶', L('ДИОД, ток идёт от красного щупа к чёрному', 'DIODE, conducting from the red probe to the black')], ['OL', L('нет связи — или диод «против шерсти»', 'no link — or a diode the wrong way round')]];
  for (const [r, t] of rows) { x.fillStyle = '#1d2a1a'; x.fillRect(110, y - 40, 190, 58); ink.print(r, 205, y + 2, 36, {align: 'center', color: '#9be08a', font: '"IBM Plex Mono", monospace', bold: true}); y = ink.para(t, 330, y, PW - 440, 30) + 26; }
  y = ink.para(L('Диод узнаётся так: в одну сторону 0.62▶, а если поменять щупы местами — OL. Связи не меняются, сколько ни меряй.', 'A diode gives itself away: 0.62▶ one way, OL when you swap the probes. The links never change, measure as often as you like.'), 100, y + 10, PW - 200, 31) + 10;
  ink.hand(L('Сначала найди пару каждой буквы.', 'First find each letter\'s partner.'), 120, y + 60, 42, '#2a3a6a', -.03);
});
chapters.HIDDEN_CONNECTIONS.push((x: CanvasRenderingContext2D, ink: Ink) => {
  ink.title(L('II. Пусковое соединение', 'II. The firing link'));
  const rows = [[L('ЛЁГКИЙ', 'EASY'), L('Диод на панели один. Он и есть пусковой.', 'There is one diode. That is the firing link.')],
    [L('СРЕДНИЙ', 'NORMAL'), L('Диодов два. Пусковой — тот, что проводит от НОМЕРА к БУКВЕ (красный щуп на номере, чёрный на букве → 0.62▶).', 'Two diodes. The firing one conducts from the NUMBER to the LETTER (red on the number, black on the letter → 0.62▶).')],
    [L('СЛОЖНЫЙ', 'HARD'), L('Диодов три. Из тех, что проводят от номера к букве, пусковой — с БОЛЬШИМ номером.', 'Three diodes. Of those conducting number→letter, the firing one has the LARGER number.')]];
  let y = 320; for (const [h, t] of rows) { ink.print(h, 100, y, 32, {bold: true, color: '#7a1408'}); y = ink.para(t, 100, y + 46, PW - 200, 31) + 26; }
  y = ink.para(L('Разомкнуть: поставь оба щупа на пусковую пару (порядок не важен) и нажми «Разомкнуть». Чужая пара — удар по взрывателю.', 'To break it: put both probes on the firing pair (either order) and press "Break". Any other pair is a strike on the fuse.'), 100, y + 10, PW - 200, 31);
  ink.hand(L('Красный — откуда, чёрный — куда.', 'Red is from, black is to.'), 140, y + 80, 44, '#6a2a1a', -.03); void x;
});
