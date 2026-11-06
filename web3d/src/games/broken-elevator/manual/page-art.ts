import {L, LANG} from '../i18n';
// Programmatic page rendering: paper, letterpress text, engraved diagrams and
// handwritten notes are all drawn here. Nothing is baked into image files.
import type {ManualPage, ManualContent, Diagram, Annotation, SymbolGlyph} from './content';
import {drawRulePage, drawGuidePage, drawPressurePage, drawLockPage} from './rule-pages';
import {drawJournalPage} from './journal-pages';

export const PAGE_W = 1024, PAGE_H = 1408;
const INK = '#24180f', INK_SOFT = 'rgba(36,24,15,.78)', RED = '#8a1f14', PENCIL = 'rgba(70,66,62,.82)';
const BODY = "'IM Fell English', Georgia, serif", ITAL = "'IM Fell English', Georgia, serif", SC = "'IM Fell English SC', Georgia, serif", PICA = "'IM Fell DW Pica', Georgia, serif", HAND = "'Caveat', 'Bradley Hand', cursive";

export function rng(seed: number) { let s = seed >>> 0 || 1; return () => { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return (s >>> 0) / 4294967296; }; }

/** Aged paper: base tone, fibres, foxing, water stain, edge and gutter darkening. side=-1 left page (gutter on right), 1 right page. */
export function paper(ctx: CanvasRenderingContext2D, seed: number, side: number, ivory = false) {
  const r = rng(seed * 7919 + 13), w = PAGE_W, h = PAGE_H;
  // ivory: the typeset rule pages use a lighter, cleaner stock so dense text keeps its contrast
  ctx.fillStyle = ivory ? '#e9dcbc' : '#d9c597'; ctx.fillRect(0, 0, w, h);
  let g = ctx.createRadialGradient(w * .5, h * .45, 80, w * .5, h * .5, w * .95);
  g.addColorStop(0, 'rgba(240,226,190,.55)'); g.addColorStop(1, 'rgba(120,86,40,.35)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  // fibres
  for (let i = 0; i < 2600; i++) {
    const x = r() * w, y = r() * h, l = 3 + r() * 14, a = r() * Math.PI;
    ctx.strokeStyle = `rgba(${r() < .5 ? '90,64,30' : '255,245,220'},${.04 + r() * .06})`; ctx.lineWidth = .6 + r();
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); ctx.stroke();
  }
  // mottling
  for (let i = 0; i < 70; i++) {
    const x = r() * w, y = r() * h, rad = 30 + r() * 160;
    g = ctx.createRadialGradient(x, y, 0, x, y, rad); g.addColorStop(0, `rgba(140,100,45,${.03 + r() * .05})`); g.addColorStop(1, 'rgba(140,100,45,0)');
    ctx.fillStyle = g; ctx.fillRect(x - rad, y - rad, rad * 2, rad * 2);
  }
  // foxing spots
  for (let i = 0; i < 26 + r() * 30; i++) {
    const x = r() * w, y = r() * h, rad = 1.5 + r() * r() * 9;
    ctx.fillStyle = `rgba(${120 + r() * 30},${70 + r() * 20},30,${.18 + r() * .3})`; ctx.beginPath(); ctx.ellipse(x, y, rad, rad * (.7 + r() * .5), r() * 3, 0, 7); ctx.fill();
    ctx.fillStyle = 'rgba(130,85,35,.06)'; ctx.beginPath(); ctx.arc(x, y, rad * 3.5, 0, 7); ctx.fill();
  }
  // tide-line water stain on some pages
  if (r() < .55) {
    const x = (r() < .5 ? .15 : .8) * w, y = (.2 + r() * .7) * h, rad = 120 + r() * 220;
    ctx.save(); ctx.globalCompositeOperation = 'multiply';
    g = ctx.createRadialGradient(x, y, rad * .82, x, y, rad); g.addColorStop(0, 'rgba(200,170,120,.0)'); g.addColorStop(.8, 'rgba(160,115,60,.22)'); g.addColorStop(1, 'rgba(160,115,60,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, rad, 0, 7); ctx.fill();
    ctx.fillStyle = 'rgba(205,180,130,.18)'; ctx.beginPath(); ctx.arc(x, y, rad * .82, 0, 7); ctx.fill(); ctx.restore();
  }
  // grease thumb mark near the outer lower corner (where pages are turned)
  if (r() < .7) {
    const x = side > 0 ? w - 90 - r() * 60 : 90 + r() * 60, y = h - 110 - r() * 90;
    g = ctx.createRadialGradient(x, y, 4, x, y, 70); g.addColorStop(0, 'rgba(80,55,25,.16)'); g.addColorStop(1, 'rgba(80,55,25,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(x, y, 70, 52, .5, 0, 7); ctx.fill();
  }
  // oxidised edges
  const edge = (x0: number, y0: number, x1: number, y1: number, a: number) => { const e = ctx.createLinearGradient(x0, y0, x1, y1); e.addColorStop(0, `rgba(105,68,28,${a})`); e.addColorStop(1, 'rgba(105,68,28,0)'); ctx.fillStyle = e; ctx.fillRect(0, 0, w, h); };
  edge(0, 0, 0, 60, .45); edge(0, h, 0, h - 60, .45); edge(side > 0 ? w : 0, 0, side > 0 ? w - 60 : 60, 0, .5);
  // gutter shading where the sheet curves into the binding
  edge(side > 0 ? 0 : w, 0, side > 0 ? 130 : w - 130, 0, .42);
  // ragged deckle: irregular darker specks on the outer edge
  ctx.fillStyle = 'rgba(80,50,20,.35)';
  for (let y = 0; y < h; y += 3) { const d = r() * r() * 7; ctx.fillRect(side > 0 ? w - d : 0, y, d, 3); }
}

function letterpress(ctx: CanvasRenderingContext2D, draw: () => void, r: () => number) {
  // uneven inking: a slightly offset faint impression under the main one
  ctx.save(); ctx.globalAlpha = .22; ctx.translate(.8, .6); draw(); ctx.restore();
  ctx.save(); ctx.globalAlpha = .88 + r() * .1; draw(); ctx.restore();
}

function wrap(ctx: CanvasRenderingContext2D, text: string, width: number) {
  const words = text.split(/\s+/), lines: string[] = []; let line = '';
  for (const w of words) { const t = line ? line + ' ' + w : w; if (ctx.measureText(t).width > width && line) { lines.push(line); line = w; } else line = t; }
  if (line) lines.push(line); return lines;
}

function justified(ctx: CanvasRenderingContext2D, line: string, x: number, y: number, width: number, last: boolean) {
  const words = line.split(' ');
  if (last || words.length < 2) { ctx.fillText(line, x, y); return; }
  const total = words.reduce((s, w) => s + ctx.measureText(w).width, 0), gap = (width - total) / (words.length - 1);
  let cx = x; for (const w of words) { ctx.fillText(w, cx, y); cx += ctx.measureText(w).width + gap; }
}

function rule(ctx: CanvasRenderingContext2D, x0: number, x1: number, y: number, double = false) {
  ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke();
  if (double) { ctx.lineWidth = .9; ctx.beginPath(); ctx.moveTo(x0, y + 6); ctx.lineTo(x1, y + 6); ctx.stroke(); }
}

function ornament(ctx: CanvasRenderingContext2D, cx: number, y: number, s = 1) {
  ctx.save(); ctx.translate(cx, y); ctx.scale(s, s); ctx.strokeStyle = INK; ctx.fillStyle = INK; ctx.lineWidth = 2;
  for (const d of [-1, 1]) { ctx.beginPath(); ctx.moveTo(d * 14, 0); ctx.bezierCurveTo(d * 60, -18, d * 90, 16, d * 150, 0); ctx.stroke(); ctx.beginPath(); ctx.arc(d * 156, 0, 3, 0, 7); ctx.fill(); }
  ctx.beginPath(); ctx.moveTo(0, -9); ctx.lineTo(9, 0); ctx.lineTo(0, 9); ctx.lineTo(-9, 0); ctx.closePath(); ctx.fill(); ctx.restore();
}

const M = {l: 104, r: 104, t: 120, b: 128};

export function drawPage(ctx: CanvasRenderingContext2D, page: ManualPage, index: number, content: ManualContent) {
  const side = index % 2 ? 1 : -1, r = rng(index * 31 + 5);
  if (page.layout !== 'rules' && page.layout !== 'guide') paper(ctx, index + 1, side);
  const inner = side > 0 ? M.l + 24 : M.l, x0 = inner, x1 = PAGE_W - (side > 0 ? M.r : M.r + 24), width = x1 - x0;
  ctx.textBaseline = 'alphabetic'; ctx.fillStyle = INK;
  if (page.layout === 'rules') return drawRulePage(ctx, page as any, index);
  if (page.layout === 'guide') return drawGuidePage(ctx, index);
  if (page.layout === 'journal') return drawJournalPage(ctx, (page as any).page, index);
  if (page.layout === 'pressure') return drawPressurePage(ctx, (page as any).half, index);
  if ((page.layout as string) === 'lockpick') return drawLockPage(ctx, (page as any).half, index);
  if (page.layout === 'title') return titlePage(ctx, content, r);
  if (page.layout === 'endpaper') { ctx.font = `italic 30px ${ITAL}`; ctx.textAlign = 'center'; ctx.fillStyle = INK_SOFT; ctx.fillText('Notes', PAGE_W / 2, 220); for (let y = 300; y < PAGE_H - 160; y += 64) { ctx.strokeStyle = 'rgba(60,40,20,.25)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke(); } return; }
  // running head
  ctx.font = `24px ${SC}`; ctx.fillStyle = INK_SOFT; ctx.textAlign = side > 0 ? 'right' : 'left';
  letterpress(ctx, () => ctx.fillText(side > 0 ? L('Руководство инженера', 'The Engineer’s Manual') : (page.kicker || L('Содержание', 'Contents')), side > 0 ? x1 : x0, 78), r);
  ctx.textAlign = side > 0 ? 'left' : 'right';
  letterpress(ctx, () => ctx.fillText(String(index + 1), side > 0 ? x0 : x1, 78), r);
  ctx.strokeStyle = INK_SOFT; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(x0, 92); ctx.lineTo(x1, 92); ctx.stroke();
  let y = M.t + 40;
  if (page.layout === 'contents') {
    ctx.textAlign = 'center'; ctx.font = `64px ${SC}`; letterpress(ctx, () => ctx.fillText('Contents', PAGE_W / 2 + (side > 0 ? 12 : -12), y + 30), r); y += 76; ornament(ctx, PAGE_W / 2, y); y += 80;
    ctx.font = `36px ${BODY}`; ctx.textAlign = 'left';
    content.sections.forEach((s, i) => {
      const [num, title] = [s.numeral, s.title]; ctx.textAlign = 'right'; letterpress(ctx, () => ctx.fillText(num + '.', x0 + 70, y), r);
      ctx.textAlign = 'left'; letterpress(ctx, () => ctx.fillText(title, x0 + 92, y), r);
      const pg = String(3 + i * 2), tw = ctx.measureText(title).width; ctx.textAlign = 'right'; letterpress(ctx, () => ctx.fillText(pg, x1, y), r);
      ctx.fillStyle = INK_SOFT; for (let dx = x0 + 104 + tw; dx < x1 - ctx.measureText(pg).width - 14; dx += 14) ctx.fillRect(dx, y - 4, 2.4, 2.4); ctx.fillStyle = INK;
      y += 80;
    });
    y += 20; ornament(ctx, PAGE_W / 2, y, .8); y += 70; ctx.font = `italic 26px ${ITAL}`; ctx.textAlign = 'center'; ctx.fillStyle = INK_SOFT;
    for (const l of wrap(ctx, 'Every operator of the car is required to carry this manual and to read the relevant section in full before touching any mechanism.', width - 60)) { letterpress(ctx, () => ctx.fillText(l, PAGE_W / 2, y), r); y += 38; }
    if (content.specimen) { ctx.font = `22px ${SC}`; ctx.fillText(content.edition, PAGE_W / 2, PAGE_H - 96); }
    return notes(ctx, page.notes, side);
  }
  if (page.heading) {
    ctx.font = `50px ${PICA}`; ctx.textAlign = 'left'; const lines = wrap(ctx, page.heading, width);
    for (const l of lines) { letterpress(ctx, () => ctx.fillText(l, x0, y), r); y += 58; }
    rule(ctx, x0, x1, y - 30, true); y += 26;
  }
  if (page.paragraphs) {
    ctx.font = `31px ${BODY}`;
    page.paragraphs.forEach((p, pi) => {
      const lines = wrap(ctx, p, width - (pi === 0 ? 0 : 0));
      lines.forEach((l, li) => {
        if (pi === 0 && li === 0) { // drop cap
          ctx.font = `118px ${PICA}`; const cap = l[0]; letterpress(ctx, () => ctx.fillText(cap, x0 - 4, y + 66), r); const cw = ctx.measureText(cap).width + 10; ctx.font = `31px ${BODY}`;
          const sub = wrap(ctx, p.slice(1), width - cw); sub.slice(0, 2).forEach((sl, si) => { ctx.save(); letterpress(ctx, () => justified(ctx, sl, x0 + cw, y + si * 42, width - cw, false), r); ctx.restore(); });
          const rest = wrap(ctx, sub.slice(2).join(' '), width); y += 84; rest.forEach((rl, ri) => { letterpress(ctx, () => justified(ctx, rl, x0, y, width, ri === rest.length - 1), r); y += 42; });
          lines.length = 0; return;
        }
        letterpress(ctx, () => justified(ctx, li === 0 ? l : l, x0 + (li === 0 ? 34 : 0), y, width - (li === 0 ? 34 : 0), li === lines.length - 1), r); y += 42;
      });
      if (pi === 0 && lines.length === 0) {} y += 16;
    });
  }
  if (page.steps) {
    y += 8; ctx.font = `28px ${SC}`; letterpress(ctx, () => ctx.fillText('Procedure', x0, y), r); y += 46; ctx.font = `30px ${BODY}`;
    page.steps.forEach((s, i) => { const lines = wrap(ctx, s, width - 64); ctx.font = `30px ${PICA}`; letterpress(ctx, () => ctx.fillText(`${i + 1}.`, x0 + 6, y), r); ctx.font = `30px ${BODY}`; lines.forEach(l => { letterpress(ctx, () => ctx.fillText(l, x0 + 56, y), r); y += 40; }); y += 6; });
  }
  if (page.diagram) { const top = y + 10, bottom = PAGE_H - M.b - (page.caption ? 70 : 20); diagram(ctx, page.diagram, x0, top, width, bottom - top, r); y = bottom; }
  if (page.caption) { ctx.font = `italic 27px ${ITAL}`; ctx.textAlign = 'center'; ctx.fillStyle = INK_SOFT; for (const l of wrap(ctx, page.caption, width - 40)) { letterpress(ctx, () => ctx.fillText(l, (x0 + x1) / 2, y + 30), r); y += 36; } ctx.fillStyle = INK; }
  notes(ctx, page.notes, side);
}

function titlePage(ctx: CanvasRenderingContext2D, content: ManualContent, r: () => number) {
  const cx = PAGE_W / 2 - 12; ctx.textAlign = 'center'; ctx.fillStyle = INK;
  ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.strokeRect(96, 110, PAGE_W - 220, PAGE_H - 230); ctx.lineWidth = 1; ctx.strokeRect(108, 122, PAGE_W - 244, PAGE_H - 254);
  ctx.font = `30px ${SC}`; letterpress(ctx, () => ctx.fillText(L('Компания лифтов и подъёмников Хартвелла', 'The Hartwell Lift & Hoist Company'), cx, 230), r);
  ornament(ctx, cx, 290);
  if (LANG === 'ru') { ctx.font = `88px ${PICA}`; letterpress(ctx, () => ctx.fillText('РУКОВОДСТВО', cx, 500), r); letterpress(ctx, () => ctx.fillText('ИНЖЕНЕРА', cx, 610), r); ctx.font = `italic 32px ${ITAL}`; letterpress(ctx, () => ctx.fillText('по безопасной эксплуатации и ремонту', cx, 700), r); letterpress(ctx, () => ctx.fillText('пассажирской кабины', cx, 742), r); }
  else { ctx.font = `44px ${PICA}`; letterpress(ctx, () => ctx.fillText('THE', cx, 420), r);
  ctx.font = `96px ${PICA}`; letterpress(ctx, () => ctx.fillText('ENGINEER’S', cx, 530), r); letterpress(ctx, () => ctx.fillText('MANUAL', cx, 640), r);
  ctx.font = `italic 32px ${ITAL}`; letterpress(ctx, () => ctx.fillText('for the Safe Operation & Repair', cx, 720), r); letterpress(ctx, () => ctx.fillText('of the Passenger Car', cx, 762), r); }
  ctx.fillStyle = '#6a1013'; ctx.font = "italic 500 30px 'Lora', Georgia, serif"; letterpress(ctx, () => ctx.fillText(L('издание для кабины № 7', 'Engineer’s manual \u00b7 edition for car No 7'), cx, 818), r); ctx.fillStyle = INK;
  // engraved emblem: cog with lift car
  ctx.save(); ctx.translate(cx, 950); ctx.lineWidth = 2.2;
  for (let i = 0; i < 24; i++) { const a = i / 24 * Math.PI * 2; ctx.save(); ctx.rotate(a); ctx.fillRect(-7, -118, 14, 20); ctx.restore(); }
  ctx.beginPath(); ctx.arc(0, 0, 100, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.arc(0, 0, 86, 0, 7); ctx.stroke();
  for (let i = -70; i < 70; i += 7) { ctx.lineWidth = .8; ctx.beginPath(); ctx.moveTo(i, -Math.sqrt(86 * 86 - i * i)); ctx.lineTo(i, Math.sqrt(86 * 86 - i * i)); ctx.globalAlpha = .35; ctx.stroke(); ctx.globalAlpha = 1; }
  ctx.fillStyle = '#d9c597'; ctx.fillRect(-36, -54, 72, 108); ctx.lineWidth = 3; ctx.strokeRect(-36, -54, 72, 108); for (let x = -28; x <= 28; x += 14) { ctx.beginPath(); ctx.moveTo(x, -46); ctx.lineTo(x, 46); ctx.stroke(); }
  ctx.beginPath(); ctx.moveTo(0, -54); ctx.lineTo(0, -86); ctx.stroke(); ctx.restore();
  ctx.fillStyle = INK; ctx.font = `28px ${SC}`; letterpress(ctx, () => ctx.fillText(L('Седьмое издание · исправленное', 'Seventh Edition · Revised'), cx, 1160), r);
  ctx.font = `italic 26px ${ITAL}`; letterpress(ctx, () => ctx.fillText(L('Лондон · MDCCCLXXXIX', 'London · MDCCCLXXXIX'), cx, 1200), r);
  notes(ctx, [{text: L('собственность кабины № 7', 'property of car no. 7'), x: .66, y: .085, angle: -3, ink: 'pencil'}], -1);
}

function notes(ctx: CanvasRenderingContext2D, list: Annotation[] | undefined, side: number) {
  for (const n of list || []) {
    ctx.save(); ctx.translate(n.x * PAGE_W, n.y * PAGE_H); ctx.rotate((n.angle || 0) * Math.PI / 180);
    ctx.font = `${Math.round(44 * (n.size || 1))}px ${HAND}`; ctx.textAlign = 'center';
    ctx.fillStyle = n.ink === 'red' ? RED : n.ink === 'pencil' ? PENCIL : INK; ctx.globalAlpha = n.ink === 'pencil' ? .85 : .9;
    ctx.fillText(n.text, 0, 0);
    if (n.ink === 'red') { ctx.strokeStyle = RED; ctx.lineWidth = 2.4; const w = ctx.measureText(n.text).width; ctx.beginPath(); ctx.moveTo(-w / 2, 10); ctx.quadraticCurveTo(0, 16, w / 2, 7); ctx.stroke(); }
    ctx.restore();
  }
}

// --------------------------------------------------------------- diagrams
function wobbleLine(ctx: CanvasRenderingContext2D, ax: number, ay: number, bx: number, by: number, r: () => number) {
  const n = Math.max(2, Math.round(Math.hypot(bx - ax, by - ay) / 24)); ctx.beginPath(); ctx.moveTo(ax, ay);
  for (let i = 1; i <= n; i++) { const t = i / n; ctx.lineTo(ax + (bx - ax) * t + (i < n ? (r() - .5) * 1.2 : 0), ay + (by - ay) * t + (i < n ? (r() - .5) * 1.2 : 0)); }
  ctx.stroke();
}

function hatch(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, step = 7, alpha = .4) {
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip(); ctx.strokeStyle = INK; ctx.globalAlpha = alpha; ctx.lineWidth = 1;
  for (let d = -h; d < w; d += step) { ctx.beginPath(); ctx.moveTo(x + d, y + h); ctx.lineTo(x + d + h, y); ctx.stroke(); } ctx.restore();
}

function diagram(ctx: CanvasRenderingContext2D, d: Diagram, x: number, y: number, w: number, h: number, r: () => number) {
  ctx.save(); ctx.strokeStyle = INK; ctx.fillStyle = INK; ctx.lineWidth = 2.4; ctx.lineCap = 'round'; ctx.textAlign = 'center';
  const cx = x + w / 2;
  if (d.type === 'wiring') {
    const n = d.terminals.length, top = y + 60, bot = y + h - 60, box = {x: x + 30, y: top - 40, w: w - 60, h: bot - top + 80};
    ctx.lineWidth = 4; ctx.strokeRect(box.x, box.y, box.w, box.h); ctx.lineWidth = 1.4; ctx.strokeRect(box.x + 10, box.y + 10, box.w - 20, box.h - 20);
    for (const [bx, by] of [[box.x + 26, box.y + 26], [box.x + box.w - 26, box.y + 26], [box.x + 26, box.y + box.h - 26], [box.x + box.w - 26, box.y + box.h - 26]]) { ctx.beginPath(); ctx.arc(bx, by, 9, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.moveTo(bx - 6, by); ctx.lineTo(bx + 6, by); ctx.stroke(); }
    const ly = (i: number) => top + 30 + i * (bot - top - 60) / (n - 1), lx = box.x + 120, rx = box.x + box.w - 120;
    d.wires.forEach((wire, i) => {
      const a = ly(wire.from), b = ly(wire.to); ctx.lineWidth = wire.pattern === 'double' ? 2 : 4.5;
      ctx.setLineDash(wire.pattern === 'dashed' ? [22, 12] : wire.pattern === 'dotted' ? [3, 11] : []);
      const path = () => { ctx.beginPath(); ctx.moveTo(lx, a); ctx.bezierCurveTo(lx + 160, a, rx - 160, b, rx, b); ctx.stroke(); };
      if (wire.pattern === 'double') { ctx.save(); ctx.translate(0, -4); path(); ctx.restore(); ctx.save(); ctx.translate(0, 4); path(); ctx.restore(); } else path();
      ctx.setLineDash([]); ctx.font = `italic 24px ${ITAL}`; ctx.fillText(wire.label, (lx + rx) / 2 + (i % 2 ? 60 : -60), (a + b) / 2 - 12);
    });
    d.terminals.forEach((t, i) => { for (const [px, align] of [[lx, 'right'], [rx, 'left']] as const) { ctx.fillStyle = '#d9c597'; ctx.beginPath(); ctx.arc(px, ly(i), 14, 0, 7); ctx.fill(); ctx.fillStyle = INK; ctx.lineWidth = 3; ctx.stroke(); ctx.beginPath(); ctx.arc(px, ly(i), 4, 0, 7); ctx.fill(); ctx.font = `34px ${PICA}`; ctx.textAlign = align; ctx.fillText(t, px + (align === 'right' ? -30 : 30), ly(i) + 11); ctx.textAlign = 'center'; } });
    ctx.font = `22px ${SC}`; ctx.fillText('Travelling cable ↓', cx, box.y - 14);
  } else if (d.type === 'cutting') {
    const rowH = Math.min(118, (h - 70) / d.rows.length); let ry = y + 50; ctx.lineWidth = 3; ctx.strokeRect(x, y, w, rowH * d.rows.length + 50); ctx.font = `26px ${SC}`;
    ctx.textAlign = 'left'; ctx.fillText('If — condition', x + 20, y + 34); ctx.textAlign = 'right'; ctx.fillText('then', x + w - 20, y + 34); hatch(ctx, x, y, w, 50, 9, .12);
    d.rows.forEach((row, i) => {
      ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(x, ry); ctx.lineTo(x + w, ry); ctx.stroke(); ctx.textAlign = 'left'; ctx.font = `30px ${PICA}`; ctx.fillText(`${i + 1}.`, x + 16, ry + 44);
      ctx.font = `28px ${BODY}`; const lines = wrap(ctx, row.condition, w * .58); lines.forEach((l, li) => ctx.fillText(l, x + 60, ry + 44 + li * 34));
      ctx.textAlign = 'right'; ctx.font = `italic 29px ${ITAL}`; wrap(ctx, row.action, w * .3).forEach((l, li) => ctx.fillText(l, x + w - 18, ry + 44 + li * 34)); ry += rowH;
    });
    // engraved shears
    ctx.save(); ctx.translate(x + w - 86, y + h - 70); ctx.rotate(-.5); ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(-46, -14, 22, 13, .2, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.ellipse(-46, 16, 22, 13, -.2, 0, 7); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-26, -8); ctx.lineTo(60, 6); ctx.lineTo(-26, 10); ctx.moveTo(-26, 12); ctx.lineTo(60, -4); ctx.stroke(); ctx.restore();
  } else if (d.type === 'gauge') {
    const R = Math.min(w, h) * .42, gy = y + h * .5, a0 = Math.PI * .75, a1 = Math.PI * 2.25, ang = (v: number) => a0 + (v - d.min) / (d.max - d.min) * (a1 - a0);
    ctx.lineWidth = 9; ctx.beginPath(); ctx.arc(cx, gy, R + 18, 0, 7); ctx.stroke(); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, gy, R + 6, 0, 7); ctx.stroke();
    ctx.save(); ctx.beginPath(); ctx.arc(cx, gy, R - 6, ang(d.safeFrom), ang(d.safeTo)); ctx.arc(cx, gy, R - 50, ang(d.safeTo), ang(d.safeFrom), true); ctx.closePath(); ctx.clip(); hatch(ctx, cx - R, gy - R, R * 2, R * 2, 6, .55); ctx.restore();
    for (let v = d.min; v <= d.max; v += 5) { const a = ang(v), big = v % 20 === 0; ctx.lineWidth = big ? 4 : 1.6; ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * (R - (big ? 34 : 18)), gy + Math.sin(a) * (R - (big ? 34 : 18))); ctx.lineTo(cx + Math.cos(a) * R, gy + Math.sin(a) * R); ctx.stroke();
      if (big) { ctx.font = `32px ${PICA}`; ctx.fillText(String(v), cx + Math.cos(a) * (R - 70), gy + Math.sin(a) * (R - 70) + 11); } }
    ctx.font = `italic 26px ${ITAL}`; ctx.fillText(d.unit, cx, gy + R * .45); ctx.font = `24px ${SC}`; ctx.fillText('Buffer pressure', cx, gy - R * .35);
    const a = ang(d.needle); ctx.lineWidth = 5; wobbleLine(ctx, cx - Math.cos(a) * 30, gy - Math.sin(a) * 30, cx + Math.cos(a) * (R - 22), gy + Math.sin(a) * (R - 22), r); ctx.beginPath(); ctx.arc(cx, gy, 16, 0, 7); ctx.fill();
  } else if (d.type === 'power') {
    const n = d.cells, cw = (w - 80) / n, top = y + 110, ch = Math.min(260, h * .45);
    ctx.font = `26px ${SC}`; ctx.fillText(d.label, cx, y + 40); ctx.lineWidth = 3; wobbleLine(ctx, x + 40, y + 70, x + w - 40, y + 70, r);
    for (let i = 0; i < n; i++) {
      const bx = x + 40 + i * cw + 10, bw = cw - 20; ctx.lineWidth = 3; ctx.strokeRect(bx, top, bw, ch); hatch(ctx, bx, top + ch * .55, bw, ch * .45, 6, .35);
      ctx.fillRect(bx + bw * .2, top - 16, bw * .2, 16); ctx.fillRect(bx + bw * .6, top - 16, bw * .2, 16);
      ctx.lineWidth = 2; wobbleLine(ctx, bx + bw * .3, top - 16, bx + bw * .3, y + 70, r);
      ctx.font = `34px ${PICA}`; ctx.fillText(String(i + 1), bx + bw / 2, top + ch * .38); ctx.font = `italic 22px ${ITAL}`; ctx.fillText(i % 2 ? '−' : '+', bx + bw / 2, top + ch + 36);
    }
    // isolating switch
    const sy = top + ch + 120; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(cx - 80, sy, 10, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.arc(cx + 80, sy, 10, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.moveTo(cx - 72, sy - 6); ctx.lineTo(cx + 70, sy - 60); ctx.stroke();
    ctx.font = `italic 26px ${ITAL}`; ctx.fillText('Isolating switch (shown open)', cx, sy + 60);
  } else if (d.type === 'gears') {
    const gear = (gx: number, gy: number, teeth: number, rad: number, rot: number) => {
      ctx.beginPath(); for (let i = 0; i < teeth * 4; i++) { const a = rot + i / (teeth * 4) * Math.PI * 2, rr = (i % 4 < 2) ? rad : rad * .86; ctx.lineTo(gx + Math.cos(a) * rr, gy + Math.sin(a) * rr); } ctx.closePath(); ctx.lineWidth = 3; ctx.stroke();
      ctx.save(); ctx.clip(); hatch(ctx, gx - rad, gy - rad, rad * 2, rad * 2, 8, .18); ctx.restore();
      ctx.beginPath(); ctx.arc(gx, gy, rad * .62, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.arc(gx, gy, rad * .16, 0, 7); ctx.fill();
      for (let i = 0; i < 5; i++) { const a = rot + i / 5 * Math.PI * 2; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(gx + Math.cos(a) * rad * .16, gy + Math.sin(a) * rad * .16); ctx.lineTo(gx + Math.cos(a) * rad * .62, gy + Math.sin(a) * rad * .62); ctx.stroke(); }
    };
    const [a, b, c] = d.teeth, ra = Math.min(w * .3, h * .28), rb = ra * b / a, rc = ra * c / a;
    gear(x + ra + 20, y + ra + 40, a, ra, 0); gear(x + ra * 2 + rb + 14, y + ra + 40, b, rb, .2); gear(x + ra * 2 + rb + 6, y + ra * 2 + rc + 60, c, rc, .1);
    ctx.font = `italic 26px ${ITAL}`; ctx.fillText(`A — ${a} teeth`, x + ra + 20, y + ra * 2 + 90); ctx.fillText(`B — ${b}`, x + ra * 2 + rb + 14, y + 26); ctx.fillText(`C — ${c}`, x + ra * 2 + rb + 6, y + ra * 3 + rc * 2 + 110 > y + h ? y + h - 10 : y + ra * 2 + rc * 2 + 100);
    ctx.save(); ctx.strokeStyle = RED; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x + ra * 2 + rb + 14 + rb * .9, y + ra + 40, 18, 0, 7); ctx.stroke(); ctx.restore();
  } else if (d.type === 'symbols') {
    const cols = 2, rows = Math.ceil(d.symbols.length / cols), cellW = w / cols, cellH = Math.min(240, h / rows);
    d.symbols.forEach((s, i) => { const gx = x + (i % cols) * cellW + cellW / 2, gy = y + Math.floor(i / cols) * cellH + 80; glyph(ctx, s.glyph, gx, gy, 58); ctx.font = `27px ${BODY}`; ctx.fillStyle = INK; ctx.fillText(s.meaning, gx, gy + 104); ctx.font = `22px ${SC}`; ctx.fillText(`No. ${i + 1}`, gx, gy + 132); });
    // a mark scratched through by hand
    ctx.strokeStyle = RED; ctx.lineWidth = 4; const gx = x + cellW * 1.5, gy = y + cellH * 2 + 80; wobbleLine(ctx, gx - 70, gy - 60, gx + 70, gy + 60, r); wobbleLine(ctx, gx + 70, gy - 60, gx - 70, gy + 60, r);
  } else if (d.type === 'checklist') {
    let cy = y + 40; ctx.textAlign = 'left';
    d.items.forEach((item, i) => { ctx.lineWidth = 2.5; ctx.strokeRect(x + 10, cy - 30, 36, 36); ctx.font = `30px ${PICA}`; ctx.fillText(`${i + 1}.`, x + 64, cy); ctx.font = `30px ${BODY}`; const lines = wrap(ctx, item, w - 130); lines.forEach((l, li) => ctx.fillText(l, x + 112, cy + li * 38));
      if (i < 3) { ctx.save(); ctx.strokeStyle = PENCIL; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x + 14, cy - 14); ctx.lineTo(x + 26, cy); ctx.lineTo(x + 52, cy - 42); ctx.stroke(); ctx.restore(); }
      cy += 38 * lines.length + 34; });
  }
  ctx.restore();
}

function glyph(ctx: CanvasRenderingContext2D, g: SymbolGlyph, x: number, y: number, s: number) {
  ctx.save(); ctx.translate(x, y); ctx.strokeStyle = INK; ctx.fillStyle = INK; ctx.lineWidth = 4; ctx.lineJoin = 'round';
  // triangular warning plate behind each glyph
  ctx.beginPath(); ctx.moveTo(0, -s); ctx.lineTo(s * 1.1, s * .8); ctx.lineTo(-s * 1.1, s * .8); ctx.closePath(); ctx.stroke(); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(0, -s + 14); ctx.lineTo(s * 1.1 - 16, s * .8 - 7); ctx.lineTo(-s * 1.1 + 16, s * .8 - 7); ctx.closePath(); ctx.stroke(); ctx.lineWidth = 3.5;
  const k = s / 58; ctx.scale(k, k); ctx.translate(0, 12);
  if (g === 'bolt') { ctx.beginPath(); ctx.moveTo(6, -36); ctx.lineTo(-14, 4); ctx.lineTo(2, 4); ctx.lineTo(-6, 30); ctx.lineTo(16, -8); ctx.lineTo(0, -8); ctx.closePath(); ctx.fill(); }
  else if (g === 'skull') { ctx.beginPath(); ctx.arc(0, -8, 20, Math.PI * .85, Math.PI * 2.15); ctx.lineTo(10, 18); ctx.lineTo(-10, 18); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#d9c597'; ctx.beginPath(); ctx.arc(-8, -6, 6, 0, 7); ctx.arc(8, -6, 6, 0, 7); ctx.fill(); ctx.fillStyle = INK; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-24, 22); ctx.lineTo(24, 34); ctx.moveTo(24, 22); ctx.lineTo(-24, 34); ctx.stroke(); }
  else if (g === 'flame') { ctx.beginPath(); ctx.moveTo(0, 30); ctx.bezierCurveTo(-26, 26, -22, -6, -4, -34); ctx.bezierCurveTo(-2, -14, 14, -14, 10, -30); ctx.bezierCurveTo(30, -6, 24, 26, 0, 30); ctx.fill(); }
  else if (g === 'gear') { ctx.beginPath(); for (let i = 0; i < 32; i++) { const a = i / 32 * Math.PI * 2, rr = i % 4 < 2 ? 28 : 21; ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } ctx.closePath(); ctx.fill(); ctx.fillStyle = '#d9c597'; ctx.beginPath(); ctx.arc(0, 0, 9, 0, 7); ctx.fill(); }
  else if (g === 'drop') { ctx.beginPath(); ctx.moveTo(0, -32); ctx.bezierCurveTo(10, -10, 22, 2, 22, 12); ctx.arc(0, 12, 22, 0, Math.PI); ctx.bezierCurveTo(-22, 2, -10, -10, 0, -32); ctx.fill(); }
  else if (g === 'eye') { ctx.beginPath(); ctx.moveTo(-30, 0); ctx.quadraticCurveTo(0, -26, 30, 0); ctx.quadraticCurveTo(0, 26, -30, 0); ctx.stroke(); ctx.beginPath(); ctx.arc(0, 0, 9, 0, 7); ctx.fill(); }
  else if (g === 'hand') { ctx.beginPath(); ctx.roundRect(-14, -4, 30, 32, 8); ctx.fill(); for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.roundRect(-14 + i * 8, -30 + Math.abs(i - 1.5) * 4, 7, 30, 3.5); ctx.fill(); } ctx.beginPath(); ctx.roundRect(14, -2, 16, 7, 3.5); ctx.fill(); }
  else if (g === 'triangle') { ctx.font = "bold 54px 'IM Fell DW Pica', serif"; ctx.textAlign = 'center'; ctx.fillText('!', 0, 18); }
  ctx.restore();
}

/** Renders a page, with a faint mirrored show-through of its reverse side as real thin paper has. */
export function renderPage(target: HTMLCanvasElement, pages: ManualPage[], index: number, content: ManualContent, scratch: HTMLCanvasElement) {
  // logical page space stays 1024×1408; the canvas may be larger (high-DPI texture) and is scaled to fit
  const ctx = target.getContext('2d')!, k = target.width / PAGE_W; ctx.setTransform(k, 0, 0, k, 0, 0); ctx.imageSmoothingQuality = 'high';
  drawPage(ctx, pages[index], index, content);
  const reverse = index % 2 ? index + 1 : index - 1;
  if (reverse >= 0 && reverse < pages.length && pages[reverse].layout !== 'endpaper') {
    const s = scratch.getContext('2d')!; s.setTransform(1, 0, 0, 1, 0, 0); s.clearRect(0, 0, PAGE_W, PAGE_H); s.save(); s.globalCompositeOperation = 'source-over';
    // ink only: draw reverse page then knock out the paper by luminance threshold is too slow; instead draw it multiplied at low alpha
    drawPage(s, pages[reverse], reverse, content); s.restore();
    ctx.save(); ctx.globalAlpha = .045; ctx.globalCompositeOperation = 'multiply'; ctx.translate(PAGE_W, 0); ctx.scale(-1, 1); ctx.drawImage(scratch, 0, 0); ctx.restore();
  }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

/** Page-edge texture for the sides of the text block: hundreds of fine sheet lines. */
export function edgeTexture(): HTMLCanvasElement {
  const c = document.createElement('canvas'); c.width = 512; c.height = 256; const ctx = c.getContext('2d')!, r = rng(99);
  ctx.fillStyle = '#cdb88a'; ctx.fillRect(0, 0, 512, 256);
  for (let y = 0; y < 256; y += 1) { const v = r(); ctx.fillStyle = v < .35 ? `rgba(90,60,25,${.25 + r() * .35})` : `rgba(250,238,205,${r() * .25})`; ctx.fillRect(0, y, 512, 1); }
  for (let i = 0; i < 400; i++) { ctx.fillStyle = `rgba(90,60,25,${r() * .25})`; ctx.fillRect(r() * 512, r() * 256, 2 + r() * 30, 1); }
  // dirty band where thumbs grip and a darker, dusty top edge
  const g = ctx.createLinearGradient(0, 0, 512, 0); g.addColorStop(0, 'rgba(70,45,20,.35)'); g.addColorStop(.2, 'rgba(70,45,20,0)'); g.addColorStop(.85, 'rgba(70,45,20,0)'); g.addColorStop(1, 'rgba(70,45,20,.3)'); ctx.fillStyle = g; ctx.fillRect(0, 0, 512, 256);
  return c;
}
