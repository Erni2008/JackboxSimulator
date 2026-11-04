// Typeset pages for INDUSTRIAL EMERGENCY DIAGNOSTICS: a Victorian engineering-handbook
// layout with a modern information hierarchy (rule number → condition → CUT instruction).
// Logical page space is 1024×1408; renderPage scales the context for high-DPI textures.
import {RULES, TERMINALS, type RuleSection} from '../puzzles/rules24';
import {paper, rng} from './page-art';

export const INK = '#150c06', INK2 = 'rgba(28,17,9,.84)', BURGUNDY = '#5c0c0e', BRASS = '#8a652a', BRASS_D = '#5c431c';
export const F = {
  display: (w: number, px: number) => `${w} ${px}px 'Cinzel', 'IM Fell English SC', Georgia, serif`,
  body: (px: number, w = 400, it = false) => `${it ? 'italic ' : ''}${w} ${px}px 'Libre Caslon Text', Georgia, serif`,
  tech: (px: number, w = 700) => `${w} ${px}px 'Barlow Condensed', 'Arial Narrow', sans-serif`,
  mono: (px: number, w = 700) => `${w} ${px}px 'IBM Plex Mono', Menlo, monospace`,
};
const W = 1024, H = 1408, MX = 92;

export interface RulePage { layout: 'rules'; section: number; half: 0 | 1 }
export interface GuidePage { layout: 'guide' }

function spaced(x: CanvasRenderingContext2D, t: string, cx: number, y: number, sp: number) {
  const ws = [...t].map(c => x.measureText(c).width), tot = ws.reduce((a, b) => a + b, 0) + sp * (t.length - 1); let px = cx - tot / 2;
  x.textAlign = 'left'; [...t].forEach((c, i) => { x.fillText(c, px, y); px += ws[i] + sp; }); return tot;
}
function brassRule(x: CanvasRenderingContext2D, x0: number, x1: number, y: number, double = false) {
  x.strokeStyle = BRASS; x.lineWidth = 2; x.beginPath(); x.moveTo(x0, y); x.lineTo(x1, y); x.stroke();
  if (double) { x.lineWidth = .9; x.strokeStyle = BRASS_D; x.beginPath(); x.moveTo(x0, y + 6); x.lineTo(x1, y + 6); x.stroke(); }
}
function diamond(x: CanvasRenderingContext2D, cx: number, cy: number, r: number, c = BRASS) { x.fillStyle = c; x.beginPath(); x.moveTo(cx, cy - r); x.lineTo(cx + r, cy); x.lineTo(cx, cy + r); x.lineTo(cx - r, cy); x.closePath(); x.fill(); }
function cog(x: CanvasRenderingContext2D, cx: number, cy: number, r: number, teeth = 12) {
  x.save(); x.translate(cx, cy); x.strokeStyle = INK2; x.lineWidth = 1.6; x.beginPath();
  for (let i = 0; i < teeth * 4; i++) { const a = i / (teeth * 4) * Math.PI * 2, rr = i % 4 < 2 ? r : r * .82; x.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); }
  x.closePath(); x.stroke(); x.beginPath(); x.arc(0, 0, r * .42, 0, 7); x.stroke(); x.beginPath(); x.arc(0, 0, r * .14, 0, 7); x.fillStyle = INK2; x.fill(); x.restore();
}
/** running head with page number on the outer corner */
function head(x: CanvasRenderingContext2D, text: string, page: number, side: number) {
  x.fillStyle = INK2; x.font = F.display(600, 21); x.textBaseline = 'alphabetic'; const w = spaced(x, text, W / 2, 74, 4);
  brassRule(x, MX, W / 2 - w / 2 - 22, 67); brassRule(x, W / 2 + w / 2 + 22, W - MX, 67); diamond(x, W / 2 - w / 2 - 12, 67, 4); diamond(x, W / 2 + w / 2 + 12, 67, 4);
  x.font = F.display(600, 22); x.fillStyle = INK; x.textAlign = side > 0 ? 'right' : 'left'; x.fillText(String(page), side > 0 ? W - MX : MX, 120);
}
function foot(x: CanvasRenderingContext2D, label: string) {
  brassRule(x, MX, W - MX, H - 98); x.font = F.body(17, 400, true); x.fillStyle = INK2; x.textAlign = 'center'; x.fillText(label, W / 2, H - 66);
}

/** small engraving of the terminal block for a given wire count */
function terminalStrip(x: CanvasRenderingContext2D, n: number, cx: number, cy: number, w: number) {
  const gap = w / n; x.strokeStyle = INK; x.lineWidth = 1.8; x.strokeRect(cx - w / 2 - 8, cy - 26, w + 16, 52);
  for (let k = 0; k < 20; k++) { x.globalAlpha = .18; x.beginPath(); x.moveTo(cx - w / 2 - 8 + k * (w + 16) / 20, cy + 26); x.lineTo(cx - w / 2 - 8 + k * (w + 16) / 20 + 10, cy + 16); x.stroke(); } x.globalAlpha = 1;
  for (let i = 0; i < n; i++) { const px = cx - w / 2 + gap * (i + .5); x.beginPath(); x.arc(px, cy - 4, 9, 0, 7); x.stroke(); x.beginPath(); x.moveTo(px - 5, cy - 4); x.lineTo(px + 5, cy - 4); x.stroke(); x.beginPath(); x.moveTo(px, cy + 5); x.lineTo(px, cy + 46); x.stroke();
    x.font = F.mono(17, 700); x.fillStyle = INK; x.textAlign = 'center'; x.fillText(TERMINALS[i], px, cy - 32); }
}

/** fault icon drawn as a small engraved mark (shape, not colour, carries the meaning) */
function faultIcon(x: CanvasRenderingContext2D, word: string, cx: number, cy: number) {
  x.save(); x.translate(cx, cy); x.strokeStyle = BURGUNDY; x.fillStyle = BURGUNDY; x.lineWidth = 2.4; x.lineJoin = 'round';
  if (word === 'OVERLOAD') { x.beginPath(); x.arc(0, 4, 13, Math.PI * 1.1, Math.PI * 1.9); x.stroke(); x.beginPath(); x.moveTo(0, 4); x.lineTo(9, -7); x.stroke(); }
  else if (word === 'SHORT CIRCUIT') { x.beginPath(); x.moveTo(-12, 0); x.lineTo(-5, -8); x.lineTo(1, 7); x.lineTo(7, -6); x.lineTo(13, 0); x.stroke(); }
  else { x.beginPath(); x.moveTo(0, -10); x.lineTo(0, 7); x.stroke(); x.beginPath(); x.moveTo(-7, 1); x.lineTo(0, 9); x.lineTo(7, 1); x.stroke(); }
  x.restore();
}
const FAULTS = ['OVERLOAD', 'SHORT CIRCUIT', 'POWER FAILURE'];

function ruleBlock(x: CanvasRenderingContext2D, n: number, when: string[], cut: number, y: number, h: number) {
  const left = MX + 6, colX = left + 128, right = W - MX - 6;
  // rule number column
  x.textAlign = 'center'; x.fillStyle = BRASS_D; x.font = F.display(600, 15); spaced(x, 'RULE', left + 50, y + 36, 3);
  x.fillStyle = INK; x.font = F.display(800, 64); x.textAlign = 'center'; x.fillText(String(n).padStart(2, '0'), left + 50, y + 100);
  x.strokeStyle = BRASS; x.lineWidth = 1.4; x.beginPath(); x.moveTo(left + 112, y + 18); x.lineTo(left + 112, y + h - 22); x.stroke();
  // condition
  const otherwise = when[0] === 'NO OTHER RULE APPLIES';
  x.textAlign = 'left'; x.fillStyle = INK2; x.font = F.body(21, 400, true); x.fillText(otherwise ? 'Otherwise' : 'If', colX, y + 38);
  let cy = y + 82, cx = colX; x.font = F.tech(38, 700);
  when.forEach((w, i) => {
    const isFault = FAULTS.includes(w), label = otherwise ? 'NO OTHER RULE APPLIES' : w, tw = x.measureText(label).width + (isFault ? 34 : 0);
    if (cx + tw > right - 10 && cx > colX) { cx = colX; cy += 46; }
    if (isFault) { faultIcon(x, w, cx + 13, cy - 13); cx += 34; }
    x.fillStyle = otherwise ? INK2 : INK; x.fillText(label, cx, cy); cx += x.measureText(label).width;
    if (i < when.length - 1) { x.fillStyle = BRASS_D; x.font = F.tech(34, 500); x.fillText('  +  ', cx, cy); cx += x.measureText('  +  ').width; x.font = F.tech(38, 700); }
  });
  // CUT instruction — burgundy, with an engraved terminal badge
  const ky = cy + 62; x.fillStyle = BURGUNDY; x.font = F.tech(34, 700); x.fillText('→  CUT TERMINAL', colX, ky);
  const bx = colX + x.measureText('→  CUT TERMINAL').width + 18, label = TERMINALS[cut];
  x.font = F.mono(38, 700); const bw = x.measureText(label).width + 30;
  x.strokeStyle = BURGUNDY; x.lineWidth = 3; roundRect(x, bx, ky - 38, bw, 50, 7); x.stroke(); x.lineWidth = 1; roundRect(x, bx + 5, ky - 33, bw - 10, 40, 4); x.stroke();
  x.fillText(label, bx + 15, ky);
  // divider
  x.strokeStyle = 'rgba(155,118,56,.55)'; x.lineWidth = 1.2; x.beginPath(); x.moveTo(left, y + h); x.lineTo(right, y + h); x.stroke();
}
function roundRect(x: CanvasRenderingContext2D, px: number, py: number, w: number, h: number, r: number) { x.beginPath(); x.moveTo(px + r, py); x.arcTo(px + w, py, px + w, py + h, r); x.arcTo(px + w, py + h, px, py + h, r); x.arcTo(px, py + h, px, py, r); x.arcTo(px, py, px + w, py, r); x.closePath(); }

function instructionBox(x: CanvasRenderingContext2D, y: number) {
  const x0 = MX, x1 = W - MX, h = 132; x.fillStyle = 'rgba(107,23,24,.06)'; x.fillRect(x0, y, x1 - x0, h);
  x.strokeStyle = BURGUNDY; x.lineWidth = 2.4; x.strokeRect(x0, y, x1 - x0, h); x.lineWidth = .9; x.strokeRect(x0 + 6, y + 6, x1 - x0 - 12, h - 12);
  for (const [cx, cy] of [[x0, y], [x1, y], [x0, y + h], [x1, y + h]]) diamond(x, cx, cy, 7, BURGUNDY);
  x.fillStyle = BURGUNDY; x.font = F.tech(33, 700); x.textAlign = 'center'; x.fillText('FIRST MATCHING RULE WINS.', W / 2, y + 46);
  x.fillStyle = INK; x.font = F.tech(26, 500); x.fillText('CHECK RULES FROM TOP TO BOTTOM  ·  WIRE POSITIONS ARE COUNTED LEFT TO RIGHT', W / 2, y + 92);
}

export function drawRulePage(x: CanvasRenderingContext2D, p: RulePage, index: number) {
  const sec: RuleSection = RULES[p.section], side = p.half ? 1 : -1;
  paper(x, index + 41, side, true);
  if (p.half === 0) {
    head(x, "THE ENGINEER’S MANUAL", index + 1, side);
    x.fillStyle = BURGUNDY; x.font = F.display(600, 30); x.textAlign = 'left'; spacedLeft(x, `SECTION ${sec.numeral}`, MX, 186, 5);
    x.fillStyle = INK; x.font = F.display(800, 70); x.fillText(sec.title, MX - 4, 262);
    terminalStrip(x, sec.wires, W - MX - 150, 222, sec.wires * 46);
    brassRule(x, MX, W - MX, 296, true);
    instructionBox(x, 326);
    const top = 492, bh = (H - 140 - top) / 4; sec.rules.slice(0, 4).forEach((r, i) => ruleBlock(x, i + 1, r.when, r.cut, top + i * bh, bh));
    foot(x, `Section ${sec.numeral} · ${sec.wires} conductors · Rules 01–04`);
  } else {
    head(x, 'EMERGENCY DISCONNECTION PROTOCOL', index + 1, side);
    x.fillStyle = INK2; x.font = F.display(600, 24); x.textAlign = 'left'; spacedLeft(x, `SECTION ${sec.numeral} — ${sec.title}  ·  RULES 05–08`, MX, 178, 3);
    brassRule(x, MX, W - MX, 204, true);
    const top = 226, bh = (H - 330 - top) / 4; sec.rules.slice(4, 8).forEach((r, i) => ruleBlock(x, i + 5, r.when, r.cut, top + i * bh, bh));
    // closing reminder with a small engraved cog
    const y = H - 300; cog(x, MX + 38, y + 56, 30); x.textAlign = 'left'; x.fillStyle = INK; x.font = F.body(22, 400, true);
    x.fillText('One cut only. A severed conductor cannot be rejoined', MX + 92, y + 46); x.fillText('within the car. When in doubt, test the circuit again.', MX + 92, y + 78);
    foot(x, `Section ${sec.numeral} · ${sec.wires} conductors · Rules 05–08`);
  }
}
function spacedLeft(x: CanvasRenderingContext2D, t: string, px: number, y: number, sp: number) { for (const c of t) { x.fillText(c, px, y); px += x.measureText(c).width + sp; } }

/** small meter engraving with the needle where each fault leaves it */
function meterSketch(x: CanvasRenderingContext2D, cx: number, cy: number, r: number, fault: number) {
  x.save(); x.strokeStyle = INK; x.lineWidth = 2; x.beginPath(); x.arc(cx, cy, r, 0, 7); x.stroke(); x.lineWidth = .8; x.beginPath(); x.arc(cx, cy, r - 5, 0, 7); x.stroke();
  const ang = (v: number) => Math.PI * .75 + v / 10 * Math.PI * 1.5;
  x.lineWidth = 6; x.strokeStyle = 'rgba(107,23,24,.55)'; x.beginPath(); x.arc(cx, cy, r - 14, ang(8), ang(10)); x.stroke();
  x.lineWidth = 1.2; x.strokeStyle = INK; for (let v = 0; v <= 10; v++) { const a = ang(v); x.beginPath(); x.moveTo(cx + Math.cos(a) * (r - 18), cy + Math.sin(a) * (r - 18)); x.lineTo(cx + Math.cos(a) * (r - 8), cy + Math.sin(a) * (r - 8)); x.stroke(); }
  const needle = (v: number, a = 1) => { x.globalAlpha = a; x.lineWidth = 2.6; x.strokeStyle = BURGUNDY; const t = ang(v); x.beginPath(); x.moveTo(cx, cy); x.lineTo(cx + Math.cos(t) * (r - 16), cy + Math.sin(t) * (r - 16)); x.stroke(); x.globalAlpha = 1; };
  if (fault === 0) needle(9.2); else if (fault === 1) { needle(2.5, .3); needle(6.5, .45); needle(4.2, .6); needle(7.6, .9); } else needle(.2);
  x.fillStyle = INK; x.beginPath(); x.arc(cx, cy, 4, 0, 7); x.fill(); x.restore();
}

export function drawGuidePage(x: CanvasRenderingContext2D, index: number) {
  paper(x, index + 31, 1, true); head(x, 'INDUSTRIAL EMERGENCY DIAGNOSTICS', index + 1, 1);
  x.fillStyle = INK; x.font = F.display(800, 50); x.textAlign = 'center'; x.fillText('Procedure', W / 2, 190); brassRule(x, MX, W - MX, 222, true);
  const steps: [string, string][] = [
    ['OPEN THE JUNCTION BOX', 'Turn the brass latch a quarter turn and swing the door wide.'],
    ['COUNT THE CONDUCTORS', 'Four, five or six wires. The count names the section to use.'],
    ['PRESS “TEST CIRCUIT”', 'Watch the meter needle for two seconds and identify the fault.'],
    ['READ MODE AND SERIAL NO.', 'Note the selector position and the plate above the terminals.'],
    ['APPLY THE SECTION RULES', 'Top to bottom. The first rule that matches decides the cut.'],
  ];
  let y = 278; steps.forEach(([a, b], i) => {
    x.fillStyle = BURGUNDY; x.font = F.display(800, 40); x.textAlign = 'left'; x.fillText(String(i + 1), MX + 4, y + 30);
    x.fillStyle = INK; x.font = F.tech(32, 700); x.fillText(a, MX + 60, y + 24); x.fillStyle = INK2; x.font = F.body(21); x.fillText(b, MX + 60, y + 58); y += 96;
  });
  brassRule(x, MX, W - MX, y + 4); x.fillStyle = INK; x.font = F.display(600, 26); x.textAlign = 'center'; spaced(x, 'READING THE METER', W / 2, y + 52, 3);
  const names = ['OVERLOAD', 'SHORT CIRCUIT', 'POWER FAILURE'], notes = ['Needle pinned in the red', 'Needle jumps erratically', 'Needle sinks to zero'];
  names.forEach((n, i) => { const cx = MX + 140 + i * ((W - 2 * MX - 280) / 2), cy = y + 170; meterSketch(x, cx, cy, 78, i); faultIcon(x, n, cx - x.measureText(n).width / 2 - 26, cy + 128);
    x.fillStyle = INK; x.font = F.tech(28, 700); x.textAlign = 'center'; x.fillText(n, cx + 10, cy + 128); x.fillStyle = INK2; x.font = F.body(18, 400, true); x.fillText(notes[i], cx, cy + 160); });
  foot(x, 'Hartwell Lift & Hoist Co. · Form VII · Rules apply to every car of this pattern');
  void rng;
}
