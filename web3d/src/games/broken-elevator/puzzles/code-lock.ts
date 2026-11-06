// АДСКАЯ КЛЕТКА — THE CAGE LOCK (4th machine).
// An old three-drum combination padlock hangs on the cage door (the barred front, over the lava). Each drum carries eight
// occult signs. The code is hidden in the cage itself: signs scratched into the iron, chalked on a wall, burnt in soot,
// drawn in the dust of the floor and inked on a paper tag tied to the bars. Every real clue carries its drum number
// (I / II / III — on HARD as tally scratches); false clues are crossed out. Set the drums, throw the lever.
// EASY: 3 clues, 3 tries. NORMAL: + 2 crossed-out decoys, 3 tries. HARD: + 3 decoys, tally numerals, 2 tries.
import * as T from 'three';
import {metal, ironPlate, enableShadows} from './surface';
import {hiCanvas, ctx2d, textTex} from './sharp';
import {L} from '../i18n';

export const GLYPHS = ['moon', 'eye', 'key', 'flame', 'cross', 'star', 'hourglass', 'snake'] as const;
export type Glyph = typeof GLYPHS[number];
export const GLYPH_NAME: Record<Glyph, [string, string]> = {moon: ['Луна', 'Moon'], eye: ['Глаз', 'Eye'], key: ['Ключ', 'Key'], flame: ['Пламя', 'Flame'], cross: ['Крест', 'Cross'],
  star: ['Звезда', 'Star'], hourglass: ['Часы', 'Hourglass'], snake: ['Змея', 'Snake']};
export type LockDiff = 'EASY' | 'NORMAL' | 'HARD';
type Style = 'scratch' | 'chalk' | 'soot' | 'dust' | 'tag';
export interface Clue { pos: number; glyph: number; fake: boolean; slot: number }
export interface LockTask { code: number[]; clues: Clue[]; tries: number; tally: boolean }

const rng = (seed: number) => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const SLOTS = 6;
export function makeLockTask(seed: number, d: LockDiff): LockTask {
  const r = rng(seed * 7919 + 17), pick = <X>(a: X[]) => a.splice(Math.floor(r() * a.length), 1)[0];
  const signs = GLYPHS.map((_, i) => i), code = [pick(signs), pick(signs), pick(signs)];
  const slots = Array.from({length: SLOTS}, (_, i) => i), clues: Clue[] = code.map((g, pos) => ({pos, glyph: g, fake: false, slot: pick(slots)}));
  const decoys = d === 'EASY' ? 0 : d === 'NORMAL' ? 2 : 3;
  for (let k = 0; k < decoys; k++) { const pos = Math.floor(r() * 3); let g = Math.floor(r() * 8); if (g === code[pos]) g = (g + 1 + Math.floor(r() * 7)) % 8; clues.push({pos, glyph: g, fake: true, slot: pick(slots)}); }
  return {code, clues, tries: d === 'HARD' ? 2 : 3, tally: d === 'HARD'};
}

// ------------------------------------------------------------------ the signs, drawn as paths (any stroke style)
export function glyphPath(x: CanvasRenderingContext2D, g: Glyph, cx: number, cy: number, s: number) {
  x.beginPath();
  switch (g) {
    case 'moon': x.arc(cx, cy, s, Math.PI * .28, Math.PI * 1.72, false); x.arc(cx + s * .42, cy, s * .78, Math.PI * 1.62, Math.PI * .38, true); x.closePath(); break;
    case 'eye': x.moveTo(cx - s, cy); x.quadraticCurveTo(cx, cy - s * 1.05, cx + s, cy); x.quadraticCurveTo(cx, cy + s * 1.05, cx - s, cy); x.closePath(); x.moveTo(cx + s * .3, cy); x.arc(cx, cy, s * .3, 0, Math.PI * 2); break;
    case 'key': x.moveTo(cx - s * .3, cy); x.arc(cx - s * .62, cy, s * .32, 0, Math.PI * 2); x.moveTo(cx - s * .3, cy); x.lineTo(cx + s, cy); x.moveTo(cx + s * .75, cy); x.lineTo(cx + s * .75, cy + s * .38); x.moveTo(cx + s * .45, cy); x.lineTo(cx + s * .45, cy + s * .28); break;
    case 'flame': x.moveTo(cx, cy - s); x.bezierCurveTo(cx + s * .95, cy - s * .15, cx + s * .7, cy + s, cx, cy + s); x.bezierCurveTo(cx - s * .7, cy + s, cx - s * .95, cy - s * .15, cx, cy - s); x.closePath();
      x.moveTo(cx, cy - s * .15); x.bezierCurveTo(cx + s * .4, cy + s * .3, cx + s * .3, cy + s * .75, cx, cy + s * .75); x.bezierCurveTo(cx - s * .3, cy + s * .75, cx - s * .4, cy + s * .3, cx, cy - s * .15); break;
    case 'cross': x.moveTo(cx, cy - s); x.lineTo(cx, cy + s); x.moveTo(cx - s * .6, cy + s * .3); x.lineTo(cx + s * .6, cy + s * .3); break; // inverted cross
    case 'star': for (let i = 0; i <= 5; i++) { const a = -Math.PI / 2 + i * Math.PI * 4 / 5; i ? x.lineTo(cx + Math.cos(a) * s, cy + Math.sin(a) * s) : x.moveTo(cx + Math.cos(a) * s, cy + Math.sin(a) * s); } break;
    case 'hourglass': x.moveTo(cx - s * .62, cy - s); x.lineTo(cx + s * .62, cy - s); x.lineTo(cx - s * .62, cy + s); x.lineTo(cx + s * .62, cy + s); x.closePath(); break;
    case 'snake': x.moveTo(cx + s * .5, cy - s * .8); x.bezierCurveTo(cx - s * .9, cy - s * .9, cx - s * .9, cy - s * .05, cx, cy); x.bezierCurveTo(cx + s * .9, cy + s * .05, cx + s * .9, cy + s * .95, cx - s * .55, cy + s * .85);
      x.moveTo(cx + s * .5 + s * .17, cy - s * .8); x.arc(cx + s * .5, cy - s * .8, s * .17, 0, Math.PI * 2); break;
  }
}
const ROMAN = ['I', 'II', 'III'];

// ------------------------------------------------------------------ clue decals
/** one clue in a carrier's hand: scratched iron, chalk, soot, a finger in the dust, ink on a tag */
function clueCanvas(style: Style, c: Clue, tally: boolean, seed: number) {
  const W = 256, H = 256, cv = hiCanvas(W, H), x = ctx2d(cv), r = rng(seed);
  const ink = {scratch: 'rgba(232,214,190,', chalk: 'rgba(236,232,222,', soot: "rgba(222,176,96,", dust: 'rgba(150,128,104,', tag: 'rgba(40,20,14,'}[style];
  if (style === 'tag') { // aged paper tag with a reinforced eyelet
    x.fillStyle = '#c9b38a'; x.beginPath(); x.moveTo(40, 30); x.lineTo(216, 30); x.lineTo(216, 236); x.lineTo(40, 236); x.lineTo(40, 70); x.closePath(); x.fill();
    const g = x.createRadialGradient(128, 130, 20, 128, 130, 160); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(90,50,20,.45)'); x.fillStyle = g; x.fill();
    for (let i = 0; i < 300; i++) { x.fillStyle = `rgba(80,50,20,${r() * .12})`; x.fillRect(40 + r() * 176, 30 + r() * 206, 2 + r() * 4, 1 + r() * 3); }
    x.strokeStyle = '#7a6040'; x.lineWidth = 3; x.beginPath(); x.arc(128, 54, 11, 0, 7); x.stroke(); x.fillStyle = '#1a120c'; x.beginPath(); x.arc(128, 54, 6, 0, 7); x.fill();
  }
  if (style === 'dust') { const g = x.createRadialGradient(128, 128, 10, 128, 128, 128); g.addColorStop(0, 'rgba(70,58,48,.55)'); g.addColorStop(1, 'rgba(70,58,48,0)'); x.fillStyle = g; x.fillRect(0, 0, W, H); }
  if (style === "soot") { x.save(); x.strokeStyle = "rgba(222,176,96,.35)"; x.lineWidth = 3; for (let i = 0; i < 7; i++) { const dx = 60 + r() * 136, dy = 120 + r() * 60; x.beginPath(); x.moveTo(dx, dy); x.lineTo(dx + (r() - .5) * 2, dy + 30 + r() * 70); x.stroke(); } x.restore(); } /* old ochre paint: drips under the sign */
  // a style-specific stroke: scratches are several thin, jittered passes; chalk is broken and powdery
  const stroke = (path: () => void, w: number) => {
    const passes = style === 'scratch' ? 4 : style === 'chalk' ? 3 : style === 'dust' ? 2 : 1;
    for (let p = 0; p < passes; p++) { x.save(); x.translate((r() - .5) * (style === 'tag' ? 0 : 3), (r() - .5) * (style === 'tag' ? 0 : 3));
      x.lineWidth = style === 'scratch' ? w * .32 : style === 'dust' ? w * 1.25 : style === 'chalk' ? w * .7 : w; x.lineCap = x.lineJoin = 'round';
      x.strokeStyle = ink + (style === 'scratch' ? .5 : style === 'chalk' ? .45 : style === 'soot' ? .85 : style === 'dust' ? .7 : .9) + ')';
      if (style === 'chalk') x.setLineDash([10 + r() * 14, 2 + r() * 4]); path(); x.stroke(); x.restore(); }
  };
  const top = style === 'tag' ? 96 : 70, glyphY = style === 'tag' ? 172 : 160;
  // drum number
  if (tally) stroke(() => { x.beginPath(); for (let k = 0; k <= c.pos; k++) { const xx = 128 + (k - c.pos / 2) * 20; x.moveTo(xx, top - 26); x.lineTo(xx + 3, top + 22); } }, 9);
  else { x.save(); x.font = `700 ${style === 'tag' ? 50 : 58}px Georgia, 'Times New Roman', serif`; x.textAlign = 'center'; x.textBaseline = 'middle';
    for (let p = 0; p < (style === 'scratch' ? 3 : 1); p++) { x.lineWidth = style === 'scratch' ? 2.2 : style === 'dust' ? 9 : 4; x.strokeStyle = ink + (style === 'soot' ? .85 : style === 'tag' ? .95 : .6) + ')';
      if (style === 'tag' || style === 'soot') { x.fillStyle = ink + '.9)'; x.fillText(ROMAN[c.pos], 128, top); } else x.strokeText(ROMAN[c.pos], 128 + (r() - .5) * 2, top + (r() - .5) * 2); } x.restore(); }
  // the sign
  stroke(() => glyphPath(x, GLYPHS[c.glyph], 128, glyphY, 54), 11);
  // a false clue is struck out
  if (c.fake) stroke(() => { x.beginPath(); x.moveTo(50, top - 40); x.lineTo(206, glyphY + 62); x.moveTo(206, top - 40); x.lineTo(50, glyphY + 62); }, 12);
  return textTex(cv);
}

// ------------------------------------------------------------------ the padlock
const DRUM_R = .03, DRUM_W = .046, PITCH = .074, STEP = Math.PI * 2 / 8;
function drumTexture() {
  const W = 1024, H = 128, cv = hiCanvas(W, H), x = ctx2d(cv);
  const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#3a2a14'); g.addColorStop(.5, '#b08a4a'); g.addColorStop(1, '#3a2a14'); x.fillStyle = '#9a7840'; x.fillRect(0, 0, W, H);
  for (let i = 0; i < 8; i++) { const cx = i * 128 + 64; x.fillStyle = '#c9a868'; x.fillRect(i * 128 + 6, 10, 116, 108); x.fillStyle = 'rgba(60,40,10,.35)'; x.fillRect(i * 128, 0, 3, H);
    // engraved sign: dark fill with a bright lower lip (cut into the brass)
    x.save(); x.translate(cx, 64); x.rotate(Math.PI / 2); x.lineCap = x.lineJoin = 'round';
    glyphPath(x, GLYPHS[i], 0, 1.5, 36); x.lineWidth = 9; x.strokeStyle = 'rgba(255,236,190,.55)'; x.stroke();
    glyphPath(x, GLYPHS[i], 0, 0, 36); x.lineWidth = 8; x.strokeStyle = '#1c1208'; x.stroke(); x.restore(); }
  const t = textTex(cv); t.wrapS = T.RepeatWrapping; return t;
}
function plateTexture(tries: number) {
  const W = 512, H = 360, cv = hiCanvas(W, H), x = ctx2d(cv), r = rng(42);
  // aged cast brass: warm gradient, tarnish blotches, fine brushed grain, darker worn edges
  const base = x.createLinearGradient(0, 0, W, H); base.addColorStop(0, '#6e5228'); base.addColorStop(.45, '#9c7a3e'); base.addColorStop(1, '#5a421f'); x.fillStyle = base; x.fillRect(0, 0, W, H);
  for (let i = 0; i < 90; i++) { const gx = r() * W, gy = r() * H, gr = 10 + r() * 50, g = x.createRadialGradient(gx, gy, 0, gx, gy, gr); g.addColorStop(0, `rgba(${r() < .5 ? '40,60,30' : '30,20,10'},${.08 + r() * .12})`); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.fillRect(gx - gr, gy - gr, gr * 2, gr * 2); }
  x.globalAlpha = .07; for (let i = 0; i < 500; i++) { x.fillStyle = r() < .5 ? '#fff4d0' : '#1a1006'; x.fillRect(0, r() * H, W, .6); } x.globalAlpha = 1;
  const vig = x.createRadialGradient(W / 2, H / 2, 120, W / 2, H / 2, 330); vig.addColorStop(0, 'rgba(0,0,0,0)'); vig.addColorStop(1, 'rgba(10,6,2,.55)'); x.fillStyle = vig; x.fillRect(0, 0, W, H);
  // engraving: a dark cut with a bright lower lip reads as carved metal
  const cut = (draw: () => void, w: number) => { x.save(); x.translate(0, 1.2); x.strokeStyle = 'rgba(255,230,170,.45)'; x.fillStyle = 'rgba(255,230,170,.45)'; x.lineWidth = w; draw(); x.restore(); x.save(); x.strokeStyle = '#24170a'; x.fillStyle = '#24170a'; x.lineWidth = w; draw(); x.restore(); };
  cut(() => { x.strokeRect(16, 16, W - 32, H - 32); }, 4); cut(() => { x.strokeRect(26, 26, W - 52, H - 52); }, 1.4);
  // corner filigree
  for (const [cx, cy, sx, sy] of [[26, 26, 1, 1], [W - 26, 26, -1, 1], [26, H - 26, 1, -1], [W - 26, H - 26, -1, -1]]) cut(() => { x.beginPath(); x.moveTo(cx, cy + sy * 40); x.bezierCurveTo(cx + sx * 6, cy + sy * 14, cx + sx * 14, cy + sy * 6, cx + sx * 40, cy);
    x.moveTo(cx + sx * 10, cy + sy * 26); x.arc(cx + sx * 16, cy + sy * 16, 8, 0, Math.PI * 2); x.stroke(); }, 1.8);
  // title on a ribbon cartouche
  cut(() => { x.beginPath(); x.moveTo(120, 34); x.lineTo(392, 34); x.lineTo(408, 52); x.lineTo(392, 70); x.lineTo(120, 70); x.lineTo(104, 52); x.closePath(); x.stroke(); }, 2);
  x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = `700 27px Georgia, 'Times New Roman', serif`; cut(() => x.fillText(L('ЗАМОК КЛЕТКИ', 'CAGE LOCK'), W / 2, 53), 1);
  x.font = `700 22px Georgia, serif`; for (let i = 0; i < 3; i++) cut(() => x.fillText(ROMAN[i], W / 2 + (i - 1) * 135 - 50, 92), 1);
  // drum windows: recessed dark wells with a chamfer
  for (let i = 0; i < 3; i++) { const wx = W / 2 + (i - 1) * 135, wy = 187; x.fillStyle = 'rgba(8,5,2,.85)'; x.fillRect(wx - 52, wy - 40, 104, 80); cut(() => x.strokeRect(wx - 56, wy - 44, 112, 88), 2.2); }
  // keyhole escutcheon (decorative: the lock has no key, only the code)
  cut(() => { x.beginPath(); x.arc(W / 2 + 150, H - 34, 6, 0, Math.PI * 2); x.moveTo(W / 2 + 147, H - 30); x.lineTo(W / 2 + 145, H - 18); x.lineTo(W / 2 + 155, H - 18); x.lineTo(W / 2 + 153, H - 30); x.fill(); }, 1);
  x.font = `600 14px Georgia, serif`; x.textAlign = 'right'; cut(() => x.fillText(L('ПОПЫТКИ', 'TRIES'), 292, 327), 1); void tries;
  return textTex(cv);
}

interface Hit { id: string }
export class CodeLock {
  group = new T.Group(); clues = new T.Group(); enabled = false; task: LockTask | null = null;
  sounds: {click?: () => void; turn?: () => void; lever?: () => void; unlock?: () => void; jam?: () => void} = {};
  onResult: (ok: boolean, why: 'WRONG' | 'OK') => void = () => {}; onWrong: (left: number) => void = () => {};
  dials = [0, 0, 0]; private shown = [0, 0, 0]; private drums: T.Mesh[] = []; private shackle = new T.Group(); private body = new T.Group(); private lever = new T.Group();
  private lamps: T.Mesh[] = []; private controls: {id: string; root: T.Object3D}[] = []; private open = 0; private jam = 0; private pull = 0; private tries = 3; private done = false;
  private plateMat: T.MeshStandardMaterial; private press = new Map<string, number>();
  constructor(hi: boolean) {
    const brass = metal('#8a6a36', {rough: .38, metalness: .9, repeat: 2}), dark = metal('#2b2420', {rough: .6, metalness: .8}), steel = metal('#8d8a85', {rough: .3, metalness: 1});
    this.group.add(this.body);
    // body: heavy case with a brass face
    const caseM = new T.Mesh(new T.BoxGeometry(.3, .22, .05, 1, 1, 1), ironPlate(.6, '#5a4c40')); caseM.position.z = -.012; this.body.add(caseM);
    this.plateMat = new T.MeshStandardMaterial({map: plateTexture(3), roughness: .42, metalness: .78, envMapIntensity: 1.1});
    const face = new T.Mesh(new T.PlaneGeometry(.28, .2), this.plateMat); face.position.z = .0135; this.body.add(face);
    for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) { const b = new T.Mesh(new T.SphereGeometry(.0065, 12, 8), brass); b.position.set(sx * .128, sy * .088, .016); b.scale.z = .5; this.body.add(b); }
    // drums in a recessed window, with shrouds so one sign reads at a time
    const drumGeo = new T.CylinderGeometry(DRUM_R, DRUM_R, DRUM_W, 48, 1, false); drumGeo.rotateZ(Math.PI / 2);
    const tex = drumTexture(), drumMat = new T.MeshStandardMaterial({map: tex, metalness: .75, roughness: .35, envMapIntensity: 1});
    const rimGeo = new T.CylinderGeometry(DRUM_R + .002, DRUM_R + .002, .004, 48); rimGeo.rotateZ(Math.PI / 2);
    for (let i = 0; i < 3; i++) { const x0 = (i - 1) * PITCH;
      const d = new T.Mesh(drumGeo, drumMat); d.position.set(x0, -.004, .006); this.body.add(d); this.drums.push(d);
      for (const s of [-1, 1]) { const rim = new T.Mesh(rimGeo, steel); rim.position.set(x0 + s * (DRUM_W / 2 + .002), -.004, .006); this.body.add(rim); }
      for (const s of [-1, 1]) { const sh = new T.Mesh(new T.BoxGeometry(DRUM_W + .014, .016, .02), dark); sh.position.set(x0, -.004 + s * .0215, .026); this.body.add(sh); }
      // arrow buttons: up above, down below
      for (const [dir, y] of [[1, .05], [-1, -.058]] as const) { const btn = new T.Group(); btn.position.set(x0, y, .02); this.body.add(btn);
        const cap = new T.Mesh(new T.ConeGeometry(.012, .016, 3), brass); cap.rotation.z = dir > 0 ? 0 : Math.PI; cap.rotation.y = Math.PI / 6 * 0; btn.add(cap);
        const base = new T.Mesh(new T.CylinderGeometry(.015, .016, .006, 20), dark); base.rotation.x = Math.PI / 2; base.position.z = -.006; btn.add(base);
        const hit = new T.Mesh(new T.CircleGeometry(.024, 12), new T.MeshBasicMaterial({visible: false})); hit.position.z = .004; btn.add(hit);
        const id = `${dir > 0 ? 'up' : 'down'}${i}`; hit.userData.id = id; this.controls.push({id, root: btn}); } }
    // the shackle: a thick steel U whose legs drop into the case
    const u = new T.Mesh(new T.TorusGeometry(.085, .011, 14, 40, Math.PI), steel); this.shackle.add(u);
    for (const s of [-1, 1]) { const leg = new T.Mesh(new T.CylinderGeometry(.011, .011, .07, 16), steel); leg.position.set(s * .085, -.035, 0); this.shackle.add(leg); }
    this.shackle.position.set(0, .11, -.012); this.body.add(this.shackle);
    // the release lever on the right flank
    this.lever.position.set(.168, -.02, .0); this.body.add(this.lever);
    const hub = new T.Mesh(new T.CylinderGeometry(.016, .016, .02, 20), dark); hub.rotation.z = Math.PI / 2; this.lever.add(hub);
    const arm = new T.Mesh(new T.CylinderGeometry(.006, .007, .085, 12), steel); arm.position.y = -.04; this.lever.add(arm);
    const knob = new T.Mesh(new T.SphereGeometry(.016, 20, 14), metal('#5e0b07', {rough: .45, metalness: .3})); knob.position.y = -.085; this.lever.add(knob);
    const lhit = new T.Mesh(new T.BoxGeometry(.05, .13, .05), new T.MeshBasicMaterial({visible: false})); lhit.position.y = -.05; lhit.userData.id = 'pull'; this.lever.add(lhit); this.controls.push({id: 'pull', root: knob});
    // attempt lamps
    for (let k = 0; k < 3; k++) { const lm = new T.Mesh(new T.SphereGeometry(.0075, 16, 10), new T.MeshStandardMaterial({color: '#2a1608', emissive: '#ff9a30', emissiveIntensity: 2, roughness: .3}));
      lm.position.set(.03 + k * .024, -.081, .016); this.body.add(lm); this.lamps.push(lm); }
    // straps that wrap the cage bar it hangs from
    for (const s of [-1, 1]) { const strap = new T.Mesh(new T.TorusGeometry(.022, .004, 8, 20), dark); strap.rotation.y = Math.PI / 2; strap.position.set(s * .085, .19, -.03); this.group.add(strap); }
    enableShadows(this.group); void hi;
  }

  /** world placement: the lock on the cage door, the clue carriers around the cage */
  place(ci: T.Box3 | undefined, floorY: number) {
    const minX = ci?.min.x ?? -1, maxX = ci?.max.x ?? 1.2, minZ = ci?.min.z ?? -.86, maxZ = ci?.max.z ?? 1.18;
    this.group.position.set(.12, floorY + 1.24, maxZ - .05); this.group.rotation.y = Math.PI;
    this.slotPose = [
      {style: 'scratch', p: new T.Vector3(.85, floorY + 1.78, minZ + .012), r: new T.Euler(0, 0, 0), s: .2},              // back wall, right of the shelf
      {style: 'chalk', p: new T.Vector3(minX + .012, floorY + 2.02, -.55), r: new T.Euler(0, Math.PI / 2, 0), s: .24},      // left wall, behind the laboratory
      {style: 'soot', p: new T.Vector3(maxX - .012, floorY + 1.95, .86), r: new T.Euler(0, -Math.PI / 2, 0), s: .22},       // right wall, by the door
      {style: 'dust', p: new T.Vector3(-.5, floorY + .006, .78), r: new T.Euler(-Math.PI / 2, 0, .4), s: .34},              // floor, front-left corner
      {style: 'tag', p: new T.Vector3(-.42, floorY + 1.5, maxZ - .045), r: new T.Euler(0, Math.PI, .12), s: .13},           // paper tag on the door bars
      {style: 'scratch', p: new T.Vector3(-.12, floorY + 2.28, minZ + .012), r: new T.Euler(0, 0, -.08), s: .18}];         // back wall, high above the fuse box
  }
  private slotPose: {style: Style; p: T.Vector3; r: T.Euler; s: number}[] = [];

  setTask(t: LockTask, seed: number) {
    this.task = t; this.tries = t.tries; this.done = false; this.open = 0; this.jam = 0; this.pull = 0;
    const r = rng(seed + 3); for (let i = 0; i < 3; i++) { let v = Math.floor(r() * 8); if (v === t.code[i]) v = (v + 3) % 8; this.dials[i] = v; this.shown[i] = v; }
    this.plateMat.map?.dispose(); this.plateMat.map = plateTexture(t.tries); this.plateMat.needsUpdate = true;
    for (const o of [...this.clues.children]) { this.clues.remove(o); (o as T.Mesh).geometry?.dispose(); ((o as T.Mesh).material as T.MeshBasicMaterial)?.map?.dispose(); }
    for (const c of t.clues) { const sp = this.slotPose[c.slot]; if (!sp) continue;
      const mat = new T.MeshStandardMaterial({map: clueCanvas(sp.style, c, t.tally, seed * 31 + c.slot), transparent: true, depthWrite: false, roughness: .9, metalness: 0, polygonOffset: true, polygonOffsetFactor: -2,
        side: sp.style === 'tag' ? T.DoubleSide : T.FrontSide});
      const m = new T.Mesh(new T.PlaneGeometry(sp.s, sp.s), mat); m.position.copy(sp.p); m.rotation.copy(sp.r); m.renderOrder = 2; this.clues.add(m);
      if (sp.style === 'tag') { const str = new T.Mesh(new T.CylinderGeometry(.0012, .0012, .09, 4), new T.MeshStandardMaterial({color: '#5a4a32', roughness: 1})); str.position.copy(sp.p).add(new T.Vector3(0, sp.s * .3 + .045, 0)); this.clues.add(str); } }
    this.paintLamps();
  }
  reset() { if (this.task) this.setTask(this.task, 1); }
  private paintLamps() { this.lamps.forEach((l, k) => { const m = l.material as T.MeshStandardMaterial, on = k < this.tries && k < (this.task?.tries ?? 3), exists = k < (this.task?.tries ?? 3);
    l.visible = exists; m.emissive.set(this.done && this.open > 0 ? '#40ff70' : '#ff9a30'); m.emissiveIntensity = on ? 2.2 : 0; }); }

  center() { return new T.Vector3(0, -.005, 0).applyMatrix4(this.group.matrixWorld); }
  hits(ray: T.Raycaster) { return ray.intersectObject(this.group, true)[0] || null; }
  controlScreen(id: string, camera: T.Camera) { const c = this.controls.find(k => k.id === id)!; const v = new T.Vector3().setFromMatrixPosition(c.root.matrixWorld).project(camera); return {x: (v.x + 1) / 2 * innerWidth, y: (1 - v.y) / 2 * innerHeight}; }
  /** a tap on the lock; returns the control id or null */
  tap(ray: T.Raycaster): string | null {
    const h = ray.intersectObject(this.group, true).find(k => k.object.userData.id); const id = h?.object.userData.id as string | undefined; if (!id) return h ? 'body' : null;
    if (!this.enabled || this.done || !this.task) { this.sounds.jam?.(); return id; }
    if (id === 'pull') { this.tryOpen(); return id; }
    const i = +id.slice(-1), dir = id.startsWith('up') ? 1 : -1; this.dials[i] = (this.dials[i] + dir + 8) % 8; this.press.set(id, 1); this.sounds.click?.(); this.sounds.turn?.(); return id;
  }
  private tryOpen() {
    const t = this.task!; this.pull = 1; this.sounds.lever?.();
    if (this.dials.every((d, i) => d === t.code[i])) { this.done = true; this.open = .001; setTimeout(() => this.sounds.unlock?.(), 180); this.paintLamps(); this.onResult(true, 'OK'); return; }
    this.tries--; this.jam = 1; setTimeout(() => this.sounds.jam?.(), 150); this.paintLamps();
    if (this.tries <= 0) { this.done = true; this.onResult(false, 'WRONG'); } else this.onWrong(this.tries);
  }
  /** time ran out: the lock stays shut */
  expire() { this.done = true; this.enabled = false; }
  get triesLeft() { return this.tries; }

  update(dt: number) {
    for (let i = 0; i < 3; i++) { // drums turn the short way to their detent with a little overshoot
      let d = this.dials[i] - this.shown[i]; if (d > 4) d -= 8; if (d < -4) d += 8; this.shown[i] += d * (1 - Math.exp(-dt * 16)); this.shown[i] = (this.shown[i] + 8) % 8;
      this.drums[i].rotation.x = (this.shown[i] - 3.5) * STEP + Math.PI; }
    for (const [id, k] of this.press) { const c = this.controls.find(x => x.id === id)!; const v = Math.max(0, k - dt * 6); c.root.scale.setScalar(1 - .18 * Math.sin(v * Math.PI)); if (v <= 0) this.press.delete(id); else this.press.set(id, v); }
    this.pull = Math.max(0, this.pull - dt * 2.2); this.lever.rotation.x = -Math.sin(this.pull * Math.PI) * .9;
    if (this.open > 0) { this.open = Math.min(1, this.open + dt * 1.6); const e = 1 - Math.pow(1 - this.open, 3); this.shackle.position.y = .11 + .045 * e; this.shackle.rotation.y = e * 1.2; this.body.rotation.z = Math.sin(this.open * 9) * .05 * (1 - this.open); }
    if (this.jam > 0) { this.jam = Math.max(0, this.jam - dt * 2); this.body.position.x = Math.sin(this.jam * 60) * .004 * this.jam; this.shackle.position.y = .11 + Math.abs(Math.sin(this.jam * 40)) * .006 * this.jam; }
  }
}
