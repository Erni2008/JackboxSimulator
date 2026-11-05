import {L, LANG} from '../i18n';
// WIRE MODULE pages — visual-first rule cards. Every rule row is
//   [ NUMBER ]  [ condition icon ] + [ condition icon ]  →  ✂ [ TERMINAL ]
// built from one reusable icon set driven by the structured rules in rules24.ts,
// so the page can never drift from the evaluator. Short labels sit under icons
// only where an icon alone would be ambiguous. Logical page space: 1024×1408.
import {RULES, TERMINALS, type Cond, type RuleSection} from '../puzzles/rules24';
import {WIRE_COLORS, type WireColor} from '../puzzles/wire-puzzle';
import {paper} from './page-art';

export const INK = '#140b05', INK2 = 'rgba(20,11,5,.7)', BURGUNDY = '#6a1013', RULE_LINE = 'rgba(20,11,5,.22)', BRASS = '#8a652a';
// Cyrillic-capable faces (OFL): Cormorant SC display, Oswald labels, Lora text, IBM Plex Mono ids
export const F = {
  display: (w: number, px: number) => `700 ${px}px 'Cormorant SC', 'Cinzel', Georgia, serif`,
  body: (px: number, w = 500, it = false) => `${it ? 'italic ' : ''}500 ${px}px 'Lora', Georgia, serif`,
  tech: (px: number, w = 700) => `${w >= 600 ? 700 : 500} ${px}px 'Oswald', 'Arial Narrow', sans-serif`,
  mono: (px: number, w = 700) => `${w} ${px}px 'IBM Plex Mono', Menlo, monospace`,
};
const W = 1024, H = 1408, MX = 84;
// wire colours on paper: same hues as the panel, tuned to read on ivory under warm light
const INKED: Record<WireColor, string> = {red: '#c8231a', yellow: '#f0b20f', blue: '#1d55c4', green: '#2c8f33', purple: '#7a2fae', white: '#f7f3ea'};
// Russian labels (nominative / genitive) — the manual is printed in Russian; panel engravings stay as on the hardware
const RU: Record<WireColor, [string, string]> = (LANG === 'ru'
  ? {red: ['КРАСНЫЙ', 'КРАСНОГО'], yellow: ['ЖЁЛТЫЙ', 'ЖЁЛТОГО'], blue: ['СИНИЙ', 'СИНЕГО'], green: ['ЗЕЛЁНЫЙ', 'ЗЕЛЁНОГО'], purple: ['ФИОЛЕТ.', 'ФИОЛЕТ.'], white: ['БЕЛЫЙ', 'БЕЛОГО']}
  : {red: ['RED', 'RED'], yellow: ['YELLOW', 'YELLOW'], blue: ['BLUE', 'BLUE'], green: ['GREEN', 'GREEN'], purple: ['PURPLE', 'PURPLE'], white: ['WHITE', 'WHITE']});
// category tints make the condition type readable at a glance
const TINT: Record<string, string> = {fault: '#f7d6c4', mode: '#d3e0f0', serial: '#f1e0b0', wire: '#d6ecd0', else: '#e9e2d4'};
const tintOf = (c: Cond) => c.k === 'fault' ? TINT.fault : c.k === 'mode' ? TINT.mode : c.k === 'odd' || c.k === 'even' || c.k === 'vowel' ? TINT.serial : c.k === 'else' ? TINT.else : TINT.wire;
void WIRE_COLORS;

export interface RulePage { layout: 'rules'; section: number; half: 0 | 1 }
type X = CanvasRenderingContext2D;

// ------------------------------------------------------------------ primitives
function rr(x: X, px: number, py: number, w: number, h: number, r: number) { x.beginPath(); x.moveTo(px + r, py); x.arcTo(px + w, py, px + w, py + h, r); x.arcTo(px + w, py + h, px, py + h, r); x.arcTo(px, py + h, px, py, r); x.arcTo(px, py, px + w, py, r); x.closePath(); }
function label(x: X, t: string, cx: number, y: number, px = 22, col = INK) { x.font = F.tech(px, 700); x.fillStyle = col; x.textAlign = 'center'; x.textBaseline = 'alphabetic'; x.fillText(t, cx, y); }
/** one insulated wire segment drawn vertically, with brass ferrules — white gets an ink outline */
function wire(x: X, cx: number, y0: number, y1: number, color: WireColor, w = 15) {
  x.lineCap = 'round'; x.strokeStyle = INK; x.lineWidth = w + 4; x.beginPath(); x.moveTo(cx, y0); x.lineTo(cx, y1); x.stroke();
  x.strokeStyle = INKED[color]; x.lineWidth = w; x.beginPath(); x.moveTo(cx, y0); x.lineTo(cx, y1); x.stroke();
  x.strokeStyle = 'rgba(255,255,255,.28)'; x.lineWidth = w * .25; x.beginPath(); x.moveTo(cx - w * .2, y0 + 3); x.lineTo(cx - w * .2, y1 - 3); x.stroke();
  x.fillStyle = BRASS; for (const y of [y0 - 6, y1 + 6]) { x.fillRect(cx - w * .7, y - 6, w * 1.4, 12); x.strokeStyle = INK; x.lineWidth = 1.5; x.strokeRect(cx - w * .7, y - 6, w * 1.4, 12); }
}
/** a terminal strip: n slots, optional highlighted slot (colour or ink) — the shared "position" language */
function strip(x: X, cx: number, cy: number, n: number, hl: number, color: WireColor | null, slotW = 26, h = 74) {
  const w = n * slotW; x.strokeStyle = INK; x.lineWidth = 2.5; rr(x, cx - w / 2 - 8, cy - h / 2 - 12, w + 16, h + 24, 6); x.stroke();
  for (let i = 0; i < n; i++) { const px = cx - w / 2 + slotW * (i + .5);
    if (i === hl) { if (color) wire(x, px, cy - h / 2 + 6, cy + h / 2 - 6, color, 13); else { x.fillStyle = INK; x.fillRect(px - 6, cy - h / 2 + 6, 12, h - 12); } }
    else { x.strokeStyle = 'rgba(20,11,5,.3)'; x.setLineDash([5, 5]); x.lineWidth = 3; x.beginPath(); x.moveTo(px, cy - h / 2 + 8); x.lineTo(px, cy + h / 2 - 8); x.stroke(); x.setLineDash([]); } }
}

// ------------------------------------------------------------------ icons (each fits a 150×150 cell centred at cx,cy)
const S = 150;
function iconFault(x: X, v: 'overload' | 'short' | 'power', cx: number, cy: number) {
  x.save(); x.translate(cx, cy - 12);
  if (v === 'overload') { // analog meter, needle in the red zone
    const r = 52, a = (t: number) => Math.PI * (.75 + t * 1.5);
    x.fillStyle = '#efe6cf'; x.beginPath(); x.arc(0, 0, r, 0, 7); x.fill(); x.strokeStyle = INK; x.lineWidth = 5; x.stroke();
    x.strokeStyle = '#b3221a'; x.lineWidth = 12; x.beginPath(); x.arc(0, 0, r - 13, a(.72), a(1)); x.stroke();
    x.strokeStyle = INK; x.lineWidth = 2; for (let i = 0; i <= 10; i++) { const t = a(i / 10); x.beginPath(); x.moveTo(Math.cos(t) * (r - 6), Math.sin(t) * (r - 6)); x.lineTo(Math.cos(t) * (r - 15), Math.sin(t) * (r - 15)); x.stroke(); }
    const n = a(.9); x.lineWidth = 5; x.lineCap = 'round'; x.beginPath(); x.moveTo(0, 0); x.lineTo(Math.cos(n) * (r - 10), Math.sin(n) * (r - 10)); x.stroke(); x.fillStyle = INK; x.beginPath(); x.arc(0, 0, 6, 0, 7); x.fill();
  } else if (v === 'short') { // spark between two conductor ends
    x.strokeStyle = INK; x.lineWidth = 10; x.lineCap = 'round'; x.beginPath(); x.moveTo(-60, 30); x.lineTo(-24, 30); x.moveTo(24, 30); x.lineTo(60, 30); x.stroke();
    x.fillStyle = '#e0a21b'; x.strokeStyle = INK; x.lineWidth = 3.5; x.lineJoin = 'round'; x.beginPath(); x.moveTo(8, -52); x.lineTo(-26, 2); x.lineTo(-2, 2); x.lineTo(-12, 46); x.lineTo(26, -10); x.lineTo(2, -10); x.lineTo(14, -52); x.closePath(); x.fill(); x.stroke();
    for (const [dx, dy] of [[-40, -20], [38, -26], [-34, 12], [42, 8]]) { x.lineWidth = 3; x.beginPath(); x.moveTo(dx * .7, dy * .7); x.lineTo(dx, dy); x.stroke(); }
  } else { // dimmed lamp: dark bulb, no rays, a downward arrow
    x.fillStyle = '#8f8778'; x.strokeStyle = INK; x.lineWidth = 4.5; x.beginPath(); x.arc(0, -10, 36, Math.PI * .8, Math.PI * 2.2); x.lineTo(14, 32); x.lineTo(-14, 32); x.closePath(); x.fill(); x.stroke();
    x.fillStyle = INK; x.fillRect(-15, 34, 30, 14); x.strokeStyle = '#efe6cf'; x.lineWidth = 2; x.beginPath(); x.moveTo(-15, 41); x.lineTo(15, 41); x.stroke();
    x.strokeStyle = 'rgba(20,11,5,.55)'; x.lineWidth = 3; x.beginPath(); x.moveTo(-10, -4); x.lineTo(-4, -18); x.lineTo(4, -4); x.lineTo(10, -18); x.stroke();
    x.strokeStyle = '#b3221a'; x.lineWidth = 6; x.lineCap = 'round'; x.beginPath(); x.moveTo(52, -34); x.lineTo(52, 10); x.moveTo(40, -2); x.lineTo(52, 12); x.lineTo(64, -2); x.stroke();
  }
  x.restore(); label(x, v === 'overload' ? L('ПЕРЕГРУЗКА', 'OVERLOAD') : v === 'short' ? L('ЗАМЫКАНИЕ', 'SHORT CIRCUIT') : L('НЕТ ПИТАНИЯ', 'NO POWER'), cx, cy + S / 2 - 4, 24, BURGUNDY);
}
function iconMode(x: X, v: 'normal' | 'emergency', cx: number, cy: number) {
  x.save(); x.translate(cx, cy - 14); const r = 46;
  x.fillStyle = '#e3d6b4'; x.beginPath(); x.arc(0, 0, r, 0, 7); x.fill(); x.strokeStyle = INK; x.lineWidth = 4; x.stroke();
  x.font = F.tech(28, 700); x.textAlign = 'center'; x.textBaseline = 'middle';
  for (const [t, a] of [['N', -Math.PI * .75], ['E', -Math.PI * .25]] as const) { const on = (t === 'N') === (v === 'normal'); x.fillStyle = on ? INK : 'rgba(20,11,5,.3)'; x.fillText(t, Math.cos(a) * (r + 18), Math.sin(a) * (r + 18)); }
  const a = v === 'normal' ? -Math.PI * .75 : -Math.PI * .25; x.rotate(a + Math.PI / 2);
  x.fillStyle = INK; rr(x, -9, -r + 6, 18, r * 2 - 12, 8); x.fill(); x.fillStyle = '#b3221a'; x.beginPath(); x.moveTo(0, -r + 2); x.lineTo(-9, -r + 18); x.lineTo(9, -r + 18); x.closePath(); x.fill();
  x.restore(); label(x, v === 'normal' ? L('РЕЖИМ НОРМА', 'MODE N') : L('РЕЖИМ АВАРИЯ', 'MODE E'), cx, cy + S / 2 - 4, 25);
}
function plate(x: X, cx: number, cy: number, chars: string, hl: number[], w = 128) {
  const h = 54; x.fillStyle = '#1c1612'; rr(x, cx - w / 2, cy - h / 2, w, h, 6); x.fill(); x.strokeStyle = BRASS; x.lineWidth = 4; rr(x, cx - w / 2, cy - h / 2, w, h, 6); x.stroke();
  x.font = F.mono(30, 700); x.textAlign = 'center'; x.textBaseline = 'middle'; const step = (w - 22) / chars.length;
  [...chars].forEach((c, i) => { const px = cx - w / 2 + 11 + step * (i + .5); if (hl.includes(i)) { x.fillStyle = '#b3221a'; rr(x, px - step / 2 + 2, cy - 19, step - 4, 38, 4); x.fill(); x.fillStyle = '#f5ecd6'; } else x.fillStyle = 'rgba(240,229,201,.5)'; x.fillText(c, px, cy + 1); });
}
function iconSerial(x: X, k: 'odd' | 'even' | 'vowel', cx: number, cy: number) {
  if (k === 'vowel') { plate(x, cx, cy - 26, 'A E U', [0, 2, 4]); label(x, L('ГЛАСНАЯ', 'VOWEL'), cx, cy + 32, 24); label(x, L('В НОМЕРЕ', 'IN SERIAL'), cx, cy + 58, 24); return; }
  plate(x, cx, cy - 26, '••••' + (k === 'odd' ? '7' : '4'), [4]);
  label(x, L('ПОСЛ. ЦИФРА', 'LAST DIGIT'), cx, cy + 32, 22); label(x, k === 'odd' ? L('НЕЧЁТНАЯ', 'ODD') : L('ЧЁТНАЯ', 'EVEN'), cx, cy + 60, 26, BURGUNDY);
}
const ORD = LANG === 'ru' ? ['1-Й', '2-Й', '3-Й', '4-Й', '5-Й', '6-Й'] : ['1ST', '2ND', '3RD', '4TH', '5TH', '6TH'];
function iconPos(x: X, c: Extract<Cond, {k: 'pos'}>, n: number, cx: number, cy: number) {
  const i = c.at === 'last' ? n - 1 : c.at; strip(x, cx, cy - 16, n, i, c.color, n > 5 ? 22 : 25);
  label(x, `${c.at === 'last' ? L('ПОСЛ.', 'LAST') : ORD[c.at]} = ${RU[c.color][0]}`, cx, cy + S / 2 - 4, 22);
}
function iconNone(x: X, color: WireColor, cx: number, cy: number) {
  wire(x, cx, cy - 58, cy + 22, color, 20);
  x.strokeStyle = '#b3221a'; x.lineWidth = 7; x.beginPath(); x.arc(cx, cy - 18, 46, 0, 7); x.stroke(); x.beginPath(); x.moveTo(cx - 32, cy + 14); x.lineTo(cx + 32, cy - 50); x.stroke();
  label(x, L(`НЕТ ${RU[color][1]}`, `NO ${RU[color][1]}`), cx, cy + S / 2 - 4, 23);
}
function iconHas(x: X, color: WireColor, cx: number, cy: number) {
  wire(x, cx, cy - 58, cy + 22, color, 20);
  x.strokeStyle = '#2f6b33'; x.lineWidth = 6; x.beginPath(); x.arc(cx + 34, cy - 50, 16, 0, 7); x.stroke(); x.beginPath(); x.moveTo(cx + 26, cy - 50); x.lineTo(cx + 32, cy - 43); x.lineTo(cx + 43, cy - 58); x.stroke();
  label(x, L(`ЕСТЬ ${RU[color][0]}`, `HAS ${RU[color][0]}`), cx, cy + S / 2 - 4, 23);
}
function iconLeftOf(x: X, a: WireColor, b: WireColor, cx: number, cy: number) {
  wire(x, cx - 40, cy - 58, cy + 18, a, 18); wire(x, cx + 40, cy - 58, cy + 18, b, 18);
  x.fillStyle = INK; x.font = F.tech(34, 700); x.textAlign = 'center'; x.fillText('…', cx, cy - 10);
  label(x, L(`${RU[a][0]} ЛЕВЕЕ ${RU[b][1]}`, `${RU[a][0]} LEFT OF ${RU[b][1]}`), cx, cy + S / 2 - 4, 19);
}
function iconElse(x: X, cx: number, cy: number) {
  x.strokeStyle = INK; x.lineWidth = 3; x.setLineDash([8, 6]); rr(x, cx - 66, cy - 58, 132, 92, 10); x.stroke(); x.setLineDash([]);
  x.fillStyle = INK; x.font = F.tech(46, 700); x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(L('ИНАЧЕ', 'ELSE'), cx, cy - 12); x.textBaseline = 'alphabetic';
  label(x, L('НИЧЕГО ВЫШЕ', 'NONE ABOVE'), cx, cy + S / 2 - 4, 22, INK2);
}
export function drawCond(x: X, c: Cond, n: number, cx: number, cy: number) {
  switch (c.k) {
    case 'fault': return iconFault(x, c.v, cx, cy); case 'mode': return iconMode(x, c.v, cx, cy);
    case 'pos': return iconPos(x, c, n, cx, cy); case 'none': return iconNone(x, c.color, cx, cy); case 'has': return iconHas(x, c.color, cx, cy);
    case 'leftOf': return iconLeftOf(x, c.a, c.b, cx, cy); case 'odd': case 'even': case 'vowel': return iconSerial(x, c.k, cx, cy); case 'else': return iconElse(x, cx, cy);
  }
}

/** wire cutters (shared action symbol) */
function cutter(x: X, cx: number, cy: number, s = 1) {
  x.save(); x.translate(cx, cy); x.scale(s, s); x.rotate(-.5);
  x.fillStyle = '#7d1a16'; x.strokeStyle = INK; x.lineWidth = 3;
  for (const d of [-1, 1]) { x.beginPath(); x.moveTo(0, 0); x.quadraticCurveTo(-18, d * 10, -46, d * 16); x.lineTo(-48, d * 6); x.quadraticCurveTo(-20, d * 2, 0, 0); x.closePath(); x.fill(); x.stroke(); }
  x.fillStyle = '#6f6a62'; for (const d of [-1, 1]) { x.beginPath(); x.moveTo(0, 0); x.lineTo(30, d * 8); x.lineTo(32, d * 1); x.closePath(); x.fill(); x.stroke(); }
  x.fillStyle = INK; x.beginPath(); x.arc(0, 0, 5, 0, 7); x.fill(); x.restore();
}
/** CUT target: cutters + engraved terminal tag + mini strip showing which position it is */
function target(x: X, t: number, n: number, cx: number, cy: number) {
  cutter(x, cx - 70, cy - 38, 1.15);
  x.fillStyle = '#1c1612'; rr(x, cx - 30, cy - 70, 104, 64, 8); x.fill(); x.strokeStyle = BURGUNDY; x.lineWidth = 5; rr(x, cx - 30, cy - 70, 104, 64, 8); x.stroke();
  x.fillStyle = '#f5ecd6'; x.font = F.mono(44, 700); x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(TERMINALS[t], cx + 22, cy - 37); x.textBaseline = 'alphabetic';
  const sw = 16, w = n * sw; for (let i = 0; i < n; i++) { const px = cx - w / 2 + sw * (i + .5) + 2; x.fillStyle = i === t ? BURGUNDY : 'rgba(20,11,5,.25)'; x.fillRect(px - 4, cy + 4, 8, i === t ? 34 : 24); }
  label(x, `${ORD[t]} ${L('ПРОВОД', 'WIRE')}`, cx + 2, cy + 64, 22, BURGUNDY);
}

// ------------------------------------------------------------------ page
const plural = (n: number) => L(n === 4 ? 'ПРОВОДА' : 'ПРОВОДОВ', 'WIRES');
function header(x: X, sec: RuleSection, side: number, page: number, cont: boolean) {
  x.textBaseline = 'alphabetic';
  x.fillStyle = INK2; x.font = F.tech(20, 500); x.textAlign = 'left'; x.fillText(L('МОДУЛЬ ПРОВОДОВ \u00b7 РАЗДЕЛ ', 'WIRE MODULE \u00b7 SECTION ') + sec.numeral, MX, cont ? 70 : 82);
  x.fillStyle = INK; x.font = F.display(700, cont ? 52 : 78); x.fillText(L('Модуль проводов', 'Wire Module'), MX - 2, cont ? 118 : 150);
  // burgundy ribbon carrying the wire count
  const ry = cont ? 136 : 172, rh = cont ? 44 : 56, label = `${sec.wires} ${plural(sec.wires)}`; x.font = F.tech(cont ? 30 : 38, 700); const rw = x.measureText(label).width + 56;
  x.fillStyle = BURGUNDY; x.beginPath(); x.moveTo(MX, ry); x.lineTo(MX + rw, ry); x.lineTo(MX + rw - 16, ry + rh / 2); x.lineTo(MX + rw, ry + rh); x.lineTo(MX, ry + rh); x.closePath(); x.fill();
  x.fillStyle = '#f6ead0'; x.fillText(label, MX + 18, ry + rh * .74);
  const n = sec.wires, w = n * 30, cx = W - MX - w / 2 - 10, top = cont ? 70 : 92, h = cont ? 100 : 128;
  x.fillStyle = 'rgba(40,28,18,.08)'; rr(x, cx - w / 2 - 22, top - 34, w + 44, h + 50, 10); x.fill();
  x.strokeStyle = INK; x.lineWidth = 4; x.beginPath(); x.moveTo(cx - w / 2 - 12, top); x.lineTo(cx + w / 2 + 12, top); x.moveTo(cx - w / 2 - 12, top + h); x.lineTo(cx + w / 2 + 12, top + h); x.stroke();
  const cols: WireColor[] = ['red', 'yellow', 'blue', 'green', 'purple', 'white'];
  for (let i = 0; i < n; i++) { const px = cx - w / 2 + 30 * (i + .5); wire(x, px, top + 12, top + h - 12, cols[i], 12); x.fillStyle = INK; x.font = F.mono(17, 700); x.textAlign = 'center'; x.fillText(TERMINALS[i], px, top - 10); }
  x.font = F.tech(22, 700); x.fillStyle = INK2; x.textAlign = side > 0 ? 'right' : 'left'; x.fillText(String(page), side > 0 ? W - MX : MX, H - 58);
  const y = cont ? 206 : 262; x.strokeStyle = INK; x.lineWidth = 3; x.beginPath(); x.moveTo(MX, y); x.lineTo(W - MX, y); x.stroke();
  if (!cont) {
    x.fillStyle = BURGUNDY; x.font = F.tech(29, 700); x.textAlign = 'left'; x.fillText(L('ПЕРВОЕ СОВПАДЕНИЕ — ВЕРНОЕ', 'FIRST MATCH WINS'), MX + 54, y + 52);
    x.strokeStyle = BURGUNDY; x.lineWidth = 6; x.lineCap = 'round'; x.beginPath(); x.moveTo(MX + 20, y + 20); x.lineTo(MX + 20, y + 58); x.moveTo(MX + 8, y + 46); x.lineTo(MX + 20, y + 60); x.lineTo(MX + 32, y + 46); x.stroke();
    x.fillStyle = INK2; x.font = F.tech(20, 500); x.textAlign = 'right'; x.fillText(L('СЧЁТ СЛЕВА \u2192 НАПРАВО', 'COUNT LEFT \u2192 RIGHT'), W - MX, y + 50);
  }
  return cont ? y + 14 : y + 84;
}

function ruleRow(x: X, num: number, cond: Cond[], cut: number, n: number, y: number, h: number) {
  const cy = y + h / 2 + 8;
  x.fillStyle = INK; x.beginPath(); x.arc(MX + 50, y + h / 2, 46, 0, 7); x.fill(); x.strokeStyle = BRASS; x.lineWidth = 4; x.beginPath(); x.arc(MX + 50, y + h / 2, 40, 0, 7); x.stroke();
  x.fillStyle = '#f3e6c8'; x.font = F.mono(46, 700); x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(String(num).padStart(2, '0'), MX + 50, y + h / 2 + 2); x.textBaseline = 'alphabetic';
  // condition cells (1 or 2), "+" between them
  const c0 = MX + 130, cell = 168;
  cond.forEach((c, i) => {
    const cx = c0 + cell / 2 + i * (cell + 44);
    x.fillStyle = tintOf(c); rr(x, cx - cell / 2, y + 14, cell, h - 28, 12); x.fill(); x.strokeStyle = 'rgba(20,11,5,.35)'; x.lineWidth = 2; rr(x, cx - cell / 2, y + 14, cell, h - 28, 12); x.stroke();
    drawCond(x, c, n, cx, cy);
    if (i < cond.length - 1) { x.fillStyle = INK; x.font = F.tech(54, 700); x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('+', cx + cell / 2 + 22, y + h / 2); x.textBaseline = 'alphabetic'; }
  });
  // arrow and target
  const ax = c0 + 2 * cell + 44 + 18; x.strokeStyle = INK; x.lineWidth = 6; x.lineCap = 'round'; x.beginPath(); x.moveTo(ax, y + h / 2); x.lineTo(ax + 44, y + h / 2); x.moveTo(ax + 30, y + h / 2 - 14); x.lineTo(ax + 46, y + h / 2); x.lineTo(ax + 30, y + h / 2 + 14); x.stroke();
  target(x, cut, n, W - MX - 92, cy);
  x.strokeStyle = RULE_LINE; x.lineWidth = 2; x.beginPath(); x.moveTo(MX, y + h); x.lineTo(W - MX, y + h); x.stroke();
}

export function drawRulePage(x: X, p: RulePage, index: number) {
  const sec = RULES[p.section], side = p.half ? 1 : -1; paper(x, index + 41, side, true);
  const top = header(x, sec, side, index + 1, p.half === 1), bottom = H - 96, h = (bottom - top) / 4;
  sec.rules.slice(p.half * 4, p.half * 4 + 4).forEach((r, i) => ruleRow(x, p.half * 4 + i + 1, r.cond, r.cut, sec.wires, top + i * h, h));
}

/** Introduction to the game: a short in-world briefing with an engraving of the cage over the lava. */
export function drawGuidePage(x: X, index: number) {
  paper(x, index + 31, 1, true); x.textBaseline = 'alphabetic';
  x.fillStyle = INK2; x.font = F.tech(22, 500); x.textAlign = 'center'; x.fillText(L('FINAL ANSWER \u00b7 СЛОМАННЫЙ ЛИФТ', 'FINAL ANSWER \u00b7 THE BROKEN ELEVATOR'), W / 2, 92);
  x.fillStyle = INK; x.font = F.display(700, 84); x.fillText(L('Сломанный лифт', 'The Broken Elevator'), W / 2, 176);
  x.strokeStyle = BRASS; x.lineWidth = 2; x.beginPath(); x.moveTo(W / 2 - 220, 204); x.lineTo(W / 2 + 220, 204); x.stroke();
  // illustration: chains, the cage, a gauge-like halo, the lava lake glowing below
  const cx = W / 2, top = 236, ih = 520;
  const sky = x.createLinearGradient(0, top, 0, top + ih); sky.addColorStop(0, '#2a1d16'); sky.addColorStop(.62, '#4a2014'); sky.addColorStop(1, '#c2451a');
  x.fillStyle = sky; rr(x, MX, top, W - 2 * MX, ih, 14); x.fill(); x.save(); rr(x, MX, top, W - 2 * MX, ih, 14); x.clip();
  for (let i = 0; i < 9; i++) { const ly = top + ih - 90 + i * 12; const g = x.createLinearGradient(0, ly, 0, ly + 14); g.addColorStop(0, i % 2 ? '#ff8a2a' : '#ffb23e'); g.addColorStop(1, '#8a1d0c'); x.fillStyle = g; x.beginPath(); x.moveTo(MX, ly); for (let px = MX; px <= W - MX; px += 18) x.lineTo(px, ly + Math.sin(px * .045 + i) * 6); x.lineTo(W - MX, ly + 20); x.lineTo(MX, ly + 20); x.fill(); }
  for (let i = 0; i < 26; i++) { x.fillStyle = `rgba(255,${150 + (i * 37) % 80},60,${.4 + (i % 5) * .1})`; x.beginPath(); x.arc(MX + 40 + (i * 131) % (W - 2 * MX - 80), top + ih - 120 - (i * 53) % 220, 2 + i % 3, 0, 7); x.fill(); }
  x.strokeStyle = '#1b120d'; x.lineWidth = 5; for (const dx of [-60, 60]) { x.beginPath(); x.moveTo(cx + dx, top); x.lineTo(cx + dx * .55, top + 110); x.stroke(); }
  const bw = 200, bh = 250, by = top + 110; x.fillStyle = '#1b120d'; x.fillRect(cx - bw / 2 - 12, by - 22, bw + 24, 26); x.beginPath(); x.moveTo(cx - bw / 2 - 20, by - 22); x.lineTo(cx, by - 70); x.lineTo(cx + bw / 2 + 20, by - 22); x.fill();
  x.fillStyle = 'rgba(255,190,110,.18)'; x.fillRect(cx - bw / 2, by, bw, bh); x.strokeStyle = '#1b120d'; x.lineWidth = 9; x.strokeRect(cx - bw / 2, by, bw, bh);
  x.lineWidth = 5; for (let i = 1; i < 7; i++) { const px = cx - bw / 2 + i * bw / 7; x.beginPath(); x.moveTo(px, by); x.lineTo(px, by + bh); x.stroke(); } x.beginPath(); x.moveTo(cx - bw / 2, by + bh * .5); x.lineTo(cx + bw / 2, by + bh * .5); x.stroke();
  x.fillStyle = '#ffd27a'; x.beginPath(); x.arc(cx, by + 30, 9, 0, 7); x.fill(); const glow = x.createRadialGradient(cx, by + 30, 4, cx, by + 30, 90); glow.addColorStop(0, 'rgba(255,210,122,.5)'); glow.addColorStop(1, 'rgba(255,210,122,0)'); x.fillStyle = glow; x.fillRect(cx - 100, by - 70, 200, 200);
  x.restore(); x.strokeStyle = INK; x.lineWidth = 3; rr(x, MX, top, W - 2 * MX, ih, 14); x.stroke();
  // briefing
  x.fillStyle = INK; x.font = F.body(28); x.textAlign = 'center';
  const lines = LANG === 'ru' ? ['Кабина застряла над шахтой, полной лавы.', 'Цепи держат её из последних сил.', 'Починить лифт можно только по этой книге.'] : ['The car hangs above a shaft full of lava.', 'The chains are holding by a thread.', 'Only this book can get the lift moving.'];
  lines.forEach((l, i) => x.fillText(l, W / 2, top + ih + 62 + i * 40));
  // three quick steps with tinted chips
  const steps: [string, string][] = [[L('Откройте щиток', 'Open the fuse box'), TINT.wire], [L('Нажмите ТЕСТ ЦЕПИ', 'Press TEST CIRCUIT'), TINT.fault], [L('Найдите правило — режьте', 'Find the rule, then cut'), TINT.serial]];
  const sy = top + ih + 210, sw = (W - 2 * MX - 40) / 3;
  steps.forEach(([t, c], i) => { const sx = MX + i * (sw + 20); x.fillStyle = c; rr(x, sx, sy, sw, 96, 12); x.fill(); x.strokeStyle = 'rgba(20,11,5,.35)'; x.lineWidth = 2; rr(x, sx, sy, sw, 96, 12); x.stroke();
    x.fillStyle = BURGUNDY; x.font = F.mono(34, 700); x.textAlign = 'left'; x.fillText(String(i + 1), sx + 16, sy + 58); x.fillStyle = INK; x.font = F.tech(23, 700); const words = t.split(' '); let l1 = '', l2 = ''; for (const w of words) { if (x.measureText(l1 + ' ' + w).width < sw - 70 && !l2) l1 = (l1 ? l1 + ' ' : '') + w; else l2 = (l2 ? l2 + ' ' : '') + w; } x.fillText(l1, sx + 52, sy + (l2 ? 44 : 58)); if (l2) x.fillText(l2, sx + 52, sy + 74); });
  x.fillStyle = BURGUNDY; x.font = F.tech(30, 700); x.textAlign = 'center'; x.fillText(L('У ВАС 60 СЕКУНД. ОШИБКА — И КАБИНА СОРВЁТСЯ.', 'YOU HAVE 60 SECONDS. ONE MISTAKE AND THE CAR DROPS.'), W / 2, sy + 160);
  x.font = F.tech(22, 700); x.fillStyle = INK2; x.textAlign = 'right'; x.fillText(String(index + 1), W - MX, H - 58);
}


// ------------------------------------------------------------------ PRESSURE CONTROL spread (visual-first)
const VALVE_INK: Record<'red' | 'blue' | 'yellow', string> = {red: '#b8231a', blue: '#1d4fb0', yellow: '#d9a514'};
function handwheel(x: X, cx: number, cy: number, r: number, col: string, lever = false) {
  x.save(); x.translate(cx, cy); x.lineCap = 'round';
  if (lever) { x.fillStyle = '#8a652a'; x.beginPath(); x.arc(0, 0, r * .3, 0, 7); x.fill(); x.strokeStyle = col; x.lineWidth = r * .32; x.beginPath(); x.moveTo(0, 0); x.lineTo(0, -r * 1.05); x.stroke(); x.fillStyle = col; x.beginPath(); x.arc(0, -r * 1.05, r * .26, 0, 7); x.fill(); }
  else { x.strokeStyle = col; x.lineWidth = r * .22; x.beginPath(); x.arc(0, 0, r, 0, 7); x.stroke(); x.lineWidth = r * .12; for (let k = 0; k < 4; k++) { const a = k * Math.PI / 2 + Math.PI / 4; x.beginPath(); x.moveTo(0, 0); x.lineTo(Math.cos(a) * r, Math.sin(a) * r); x.stroke(); } x.fillStyle = '#8a652a'; x.beginPath(); x.arc(0, 0, r * .26, 0, 7); x.fill(); }
  x.fillStyle = '#f6ead0'; x.fillRect(-r * .07, -r * (lever ? 1.2 : 1.12), r * .14, r * .26); x.restore();
}
function miniGauge(x: X, cx: number, cy: number, r: number, v: number, zone: [number, number] | null, arrow: 1 | -1 | 0) {
  const ang = (p: number) => -Math.PI / 2 - Math.PI * .75 + p / 120 * Math.PI * 1.5;
  x.fillStyle = '#efe2c2'; x.beginPath(); x.arc(cx, cy, r, 0, 7); x.fill(); x.strokeStyle = '#8a652a'; x.lineWidth = r * .12; x.stroke();
  if (zone) { x.strokeStyle = '#1f9a3a'; x.lineWidth = r * .2; x.beginPath(); x.arc(cx, cy, r * .74, ang(zone[0]), ang(zone[1])); x.stroke(); }
  x.strokeStyle = '#b0180a'; x.lineWidth = r * .14; x.beginPath(); x.arc(cx, cy, r * .74, ang(110), ang(120)); x.stroke();
  x.strokeStyle = INK; x.lineWidth = Math.max(2, r * .045); for (let p = 0; p <= 120; p += 20) { const a = ang(p); x.beginPath(); x.moveTo(cx + Math.cos(a) * r * .88, cy + Math.sin(a) * r * .88); x.lineTo(cx + Math.cos(a) * r * .66, cy + Math.sin(a) * r * .66); x.stroke(); }
  const a = ang(v); x.strokeStyle = '#140b05'; x.lineWidth = Math.max(3, r * .07); x.lineCap = 'round'; x.beginPath(); x.moveTo(cx, cy); x.lineTo(cx + Math.cos(a) * r * .78, cy + Math.sin(a) * r * .78); x.stroke(); x.fillStyle = '#8a652a'; x.beginPath(); x.arc(cx, cy, r * .1, 0, 7); x.fill();
  if (arrow) { const ax = cx + r * 1.32; x.strokeStyle = arrow > 0 ? '#b8231a' : '#1d4fb0'; x.lineWidth = r * .16; x.beginPath(); x.moveTo(ax, cy + arrow * r * .6); x.lineTo(ax, cy - arrow * r * .6); x.moveTo(ax - r * .3, cy - arrow * r * .25); x.lineTo(ax, cy - arrow * r * .62); x.lineTo(ax + r * .3, cy - arrow * r * .25); x.stroke(); }
}
function pressureHeader(x: X, side: number, page: number, title: string) {
  x.textBaseline = 'alphabetic'; x.fillStyle = INK2; x.font = F.tech(20, 500); x.textAlign = 'left'; x.fillText(L('СЛОМАННЫЕ КЛАПАНЫ \u00b7 РАЗДЕЛ IV', 'THE BROKEN VALVES \u00b7 SECTION IV'), MX, 82);
  x.fillStyle = INK; x.font = F.display(700, 74); x.fillText(title, MX - 2, 150);
  x.font = F.tech(36, 700); const label = L('45 СЕКУНД', '45 SECONDS'), rw = x.measureText(label).width + 56, ry = 172, rh = 54;
  x.fillStyle = '#1d6a33'; x.beginPath(); x.moveTo(MX, ry); x.lineTo(MX + rw, ry); x.lineTo(MX + rw - 16, ry + rh / 2); x.lineTo(MX + rw, ry + rh); x.lineTo(MX, ry + rh); x.closePath(); x.fill(); x.fillStyle = '#f6ead0'; x.fillText(label, MX + 18, ry + rh * .74);
  x.font = F.tech(22, 700); x.fillStyle = INK2; x.textAlign = side > 0 ? 'right' : 'left'; x.fillText(String(page), side > 0 ? W - MX : MX, H - 58);
  x.strokeStyle = INK; x.lineWidth = 3; x.beginPath(); x.moveTo(MX, 262); x.lineTo(W - MX, 262); x.stroke();
}
/** THE BROKEN VALVES spread. Left: the four fault codes and their fix; right: what every control does + the goal. */
export function drawPressurePage(x: X, half: 0 | 1, index: number) {
  const side = half ? 1 : -1; paper(x, index + 61, side, true);
  if (!half) {
    pressureHeader(x, side, index + 1, L('Неисправности', 'Faults'));
    x.fillStyle = BURGUNDY; x.font = F.tech(30, 700); x.textAlign = 'left'; x.fillText(L('ТЕСТ · ДВА КОДА? ЧИНИТЕ ОБА', 'TEST · TWO CODES? FIX BOTH'), MX, 316);
    const rows: [string, string, string, (cx: number, cy: number) => void][] = [
      ['R-02', L('КРАСНЫЙ ЗАКЛИНИЛ', 'RED JAMMED'), L('ОБХОД → ВСПОМ.', 'BYPASS → AUX'), (cx, cy) => { handwheel(x, cx, cy, 52, VALVE_INK.red); jamBar(cx, cy); }],
      ['B-04', L('СИНИЙ ЗАКЛИНИЛ', 'BLUE JAMMED'), L('ОБХОД → ВСПОМ.', 'BYPASS → AUX'), (cx, cy) => { handwheel(x, cx, cy, 52, VALVE_INK.blue); jamBar(cx, cy); }],
      ['F-01', L('ПОТОК НАОБОРОТ', 'REVERSED FLOW'), L('КРАСНЫЙ ▼  СИНИЙ ▲  или ОБХОД', 'RED ▼  BLUE ▲  or BYPASS'), (cx, cy) => { x.strokeStyle = INK; x.lineWidth = 7; x.lineCap = 'round'; for (const s of [-1, 1]) { x.beginPath(); x.arc(cx, cy, 44, s > 0 ? .3 : Math.PI + .3, s > 0 ? Math.PI - .3 : -.3); x.stroke(); const a = s > 0 ? Math.PI - .3 : -.3; x.beginPath(); x.moveTo(cx + Math.cos(a) * 44, cy + Math.sin(a) * 44); x.lineTo(cx + Math.cos(a) * 44 + 14 * s, cy + Math.sin(a) * 44 - 12 * s); x.stroke(); } }],
      ['L-03', L('УТЕЧКА −1 PSI/С', 'LEAK −1 PSI/S'), L('ЗАЖИМ НА МУФТУ', 'CLAMP THE COUPLING'), (cx, cy) => { x.fillStyle = '#9a5634'; x.fillRect(cx - 60, cy - 12, 120, 24); x.strokeStyle = INK; x.lineWidth = 5; x.beginPath(); x.moveTo(cx - 6, cy - 12); x.lineTo(cx + 4, cy); x.lineTo(cx - 4, cy + 12); x.stroke(); x.fillStyle = 'rgba(120,120,120,.55)'; for (let k = 0; k < 4; k++) { x.beginPath(); x.arc(cx + 6 + k * 8, cy - 26 - k * 12, 9 + k * 3, 0, 7); x.fill(); } }],
    ];
    function jamBar(cx: number, cy: number) { x.strokeStyle = '#b0180a'; x.lineWidth = 12; x.lineCap = 'round'; x.beginPath(); x.moveTo(cx - 58, cy + 58); x.lineTo(cx + 58, cy - 58); x.stroke(); }
    const top = 350, h = 245;
    rows.forEach(([code, what, fix, icon], i) => { const y = top + i * h, cy = y + h / 2 - 6;
      x.fillStyle = i % 2 ? 'rgba(40,28,18,.05)' : 'rgba(40,28,18,0)'; rr(x, MX - 10, y + 6, W - 2 * MX + 20, h - 12, 16); x.fill();
      x.fillStyle = '#1b1410'; rr(x, MX, cy - 44, 200, 88, 10); x.fill(); x.fillStyle = '#ffb347'; x.font = F.mono(58, 700); x.textAlign = 'center'; x.fillText(code, MX + 100, cy + 20);
      icon(MX + 320, cy);
      x.fillStyle = INK; x.font = F.tech(36, 700); x.textAlign = 'left'; x.fillText(what, MX + 410, cy - 8);
      x.fillStyle = '#1d6a33'; x.font = F.tech(26, 700); x.fillText(fix, MX + 410, cy + 34); });
  } else {
    pressureHeader(x, side, index + 1, L('Управление', 'Controls'));
    const ops: [string, string, (cx: number, cy: number) => void][] = [
      ['+10 PSI', L('КРАСНЫЙ — ЧЕТВЕРТЬ ОБОРОТА', 'RED — QUARTER TURN'), (cx, cy) => handwheel(x, cx, cy, 40, VALVE_INK.red)],
      ['−10 PSI', L('СИНИЙ — ЧЕТВЕРТЬ ОБОРОТА', 'BLUE — QUARTER TURN'), (cx, cy) => handwheel(x, cx, cy, 40, VALVE_INK.blue)],
      ['±2 PSI', L('ЖЁЛТЫЙ ВКЛ — ТОЧНО', 'YELLOW ON — FINE STEPS'), (cx, cy) => handwheel(x, cx, cy, 40, '#d9a514', true)],
      [L('ВСПОМ.', 'AUX'), L('ОБХОД — ОБХОДНАЯ ЛИНИЯ', 'BYPASS — AUXILIARY LINE'), (cx, cy) => { x.strokeStyle = INK; x.lineWidth = 9; x.lineCap = 'round'; x.beginPath(); x.moveTo(cx, cy + 30); x.lineTo(cx + 26, cy - 30); x.stroke(); x.fillStyle = '#8a652a'; x.beginPath(); x.arc(cx, cy + 30, 12, 0, 7); x.fill(); }],
      [L('ЗАЖИМ', 'CLAMP'), L('НАЖМИТЕ НА МУФТУ — УТЕЧКА', 'TAP THE COUPLING — LEAK'), (cx, cy) => { x.fillStyle = '#9a5634'; x.fillRect(cx - 44, cy - 10, 88, 20); x.fillStyle = '#8a652a'; x.fillRect(cx - 14, cy - 18, 28, 36); x.fillStyle = INK; x.fillRect(cx - 4, cy - 26, 8, 52); }],
      ['−20 PSI', L('АВАРИЙНЫЙ СБРОС · 1 РАЗ', 'EMERGENCY RELEASE · ONCE'), (cx, cy) => { x.fillStyle = '#d9a514'; x.fillRect(cx - 44, cy - 22, 88, 44); x.fillStyle = '#16100a'; for (let k = -44; k < 44; k += 16) { x.beginPath(); x.moveTo(cx + k, cy + 22); x.lineTo(cx + k + 8, cy + 22); x.lineTo(cx + k + 30, cy - 22); x.lineTo(cx + k + 22, cy - 22); x.fill(); } x.fillStyle = '#a3150c'; x.fillRect(cx - 34, cy + 26, 68, 14); }],
    ];
    ops.forEach(([v, t, icon], i) => { const y = 284 + i * 100; icon(MX + 56, y + 50); x.fillStyle = INK; x.font = F.mono(40, 700); x.textAlign = 'left'; x.fillText(v, MX + 130, y + 64); x.font = F.tech(26, 700); x.fillStyle = INK2; x.fillText(t, MX + 330, y + 62); });
    miniGauge(x, W / 2 - 150, 1080, 150, 62, [60, 65], 0);
    const steps: [string, string][] = [['1', L('В ЗЕЛЁНУЮ ЗОНУ', 'INTO THE GREEN')], ['2', L('ДЕРЖИТЕ 1 СЕКУНДУ', 'HOLD 1 SECOND')], ['3', L('ТОЛЧКИ ±1–2 PSI', 'KICKS ±1–2 PSI')]];
    steps.forEach(([n, t], i) => { const y = 930 + i * 100; x.fillStyle = i === 1 ? '#d6ecd0' : '#f1e0b0'; rr(x, W / 2 + 30, y, W / 2 - MX - 30, 84, 12); x.fill();
      x.fillStyle = BURGUNDY; x.font = F.mono(40, 700); x.textAlign = 'left'; x.fillText(n, W / 2 + 50, y + 56); x.fillStyle = INK; x.font = F.tech(28, 700); x.fillText(t, W / 2 + 92, y + 54); });
    x.fillStyle = '#b0180a'; x.font = F.tech(24, 700); x.textAlign = 'center'; x.fillText(L('120 PSI — ВЗРЫВ', '120 PSI — EXPLOSION'), W / 2 - 150, 1268);
  }
}
