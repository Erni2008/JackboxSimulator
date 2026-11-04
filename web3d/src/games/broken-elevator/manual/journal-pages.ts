// THE ALCHEMIST'S JOURNAL — three visual-first spreads (six pages). Every table is drawn from formula-sim's data, the
// same tables the Java rules use, so the book cannot drift from the server logic.
// 1 IDENTIFICATION  (families | class I/II -> base)   2 COMPATIBILITY (bases | reaction A/B/C -> additive, ✕)
// 3 PROCEDURE        (polarity, concentration | unstable -> cooling lock, inject, 45 s)
import {paper, rng} from './page-art';
import {F} from './rule-pages';
import {REAGENTS, FAMILIES, SYMBOL, BASE, ADDITIVE, DOSES, COLOR, GLINT, RU, incompatible, type Reagent} from '../puzzles/formula-sim';

type X = CanvasRenderingContext2D;
const W = 1024, H = 1408, MX = 88, INK = '#2a1309', INK2 = 'rgba(42,19,9,.72)', OX = '#7a1518', HAND = "'Caveat', cursive";
const FAM_RU: Record<string, string> = {LUNAR: 'ЛУННОЕ', SOLAR: 'СОЛНЕЧНОЕ', CRYSTAL: 'КРИСТАЛЛ', ORGANIC: 'ОРГАНИКА'};

function rr(x: X, px: number, py: number, w: number, h: number, r: number) { x.beginPath(); x.moveTo(px + r, py); x.arcTo(px + w, py, px + w, py + h, r); x.arcTo(px + w, py + h, px, py + h, r); x.arcTo(px, py + h, px, py, r); x.arcTo(px, py, px + w, py, r); x.closePath(); }
/** older, yellower laboratory paper with ink blots */
function journalPaper(x: X, index: number, side: number) {
  paper(x, index * 7 + 101, side, false); const r = rng(index * 13 + 5);
  x.fillStyle = 'rgba(176,128,40,.13)'; x.fillRect(0, 0, W, H);
  for (let i = 0; i < 3; i++) { const cx = 120 + r() * (W - 240), cy = 160 + r() * (H - 320), s = 6 + r() * 16; x.fillStyle = `rgba(30,14,6,${.18 + r() * .2})`; x.beginPath(); x.arc(cx, cy, s, 0, 7); x.fill(); for (let k = 0; k < 7; k++) { x.beginPath(); x.arc(cx + (r() - .5) * s * 5, cy + (r() - .5) * s * 5, 1 + r() * s * .35, 0, 7); x.fill(); } }
  x.strokeStyle = 'rgba(120,70,30,.22)'; x.lineWidth = 3; x.beginPath(); x.arc(W * (side > 0 ? .78 : .24), H * .82, 70, .3, 5.6); x.stroke(); // flask ring stain
}
function header(x: X, kicker: string, title: string, page: number, side: number) {
  x.textBaseline = 'alphabetic'; x.fillStyle = INK2; x.font = F.tech(21, 500); x.textAlign = 'left'; x.fillText(kicker, MX, 84);
  x.fillStyle = INK; x.font = F.display(700, 70); x.fillText(title, MX - 2, 152);
  x.strokeStyle = OX; x.lineWidth = 3; x.beginPath(); x.moveTo(MX, 176); x.lineTo(W - MX, 176); x.stroke(); x.lineWidth = 1.2; x.beginPath(); x.moveTo(MX, 184); x.lineTo(W - MX, 184); x.stroke();
  x.font = F.tech(22, 700); x.fillStyle = INK2; x.textAlign = side > 0 ? 'right' : 'left'; x.fillText(String(page), side > 0 ? W - MX : MX, H - 56);
}
/** a hand-drawn stoppered flask filled with the reagent, with a glint and a paper label */
export function flask(x: X, cx: number, cy: number, s: number, r: Reagent, label = true) {
  x.save(); x.translate(cx, cy); const neck = s * .22, body = s * .5;
  x.beginPath(); x.moveTo(-neck / 2, -s * .55); x.lineTo(-neck / 2, -s * .2); x.bezierCurveTo(-body, -s * .05, -body, s * .45, 0, s * .45); x.bezierCurveTo(body, s * .45, body, -s * .05, neck / 2, -s * .2); x.lineTo(neck / 2, -s * .55); x.closePath();
  x.save(); x.clip(); const g = x.createLinearGradient(0, -s * .1, 0, s * .45); g.addColorStop(0, GLINT[r]); g.addColorStop(.25, COLOR[r]); g.addColorStop(1, '#120606'); x.fillStyle = 'rgba(255,250,235,.35)'; x.fillRect(-body, -s * .6, body * 2, s * 1.1); x.fillStyle = g; x.fillRect(-body, -s * .05, body * 2, s * .55); x.restore();
  x.strokeStyle = INK; x.lineWidth = Math.max(2.5, s * .035); x.stroke();
  x.fillStyle = 'rgba(255,255,255,.55)'; x.beginPath(); x.ellipse(-body * .45, s * .12, s * .05, s * .14, -.3, 0, 7); x.fill();
  x.fillStyle = '#6b4520'; x.fillRect(-neck * .65, -s * .66, neck * 1.3, s * .12); x.strokeRect(-neck * .65, -s * .66, neck * 1.3, s * .12);
  if (label) { x.fillStyle = '#efe0bd'; rr(x, -s * .34, s * .14, s * .68, s * .17, 4); x.fill(); x.strokeStyle = INK2; x.lineWidth = 1.5; x.stroke(); x.fillStyle = INK; x.font = `700 ${Math.round(s * .1)}px 'Oswald', sans-serif`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(r, 0, s * .228); }
  x.restore();
}
function glyph(x: X, cx: number, cy: number, rad: number, fam: string) {
  x.fillStyle = '#f3e4c0'; x.beginPath(); x.arc(cx, cy, rad, 0, 7); x.fill(); x.strokeStyle = INK; x.lineWidth = 4; x.stroke(); x.lineWidth = 1.5; x.beginPath(); x.arc(cx, cy, rad - 9, 0, 7); x.stroke();
  x.fillStyle = OX; x.font = `${Math.round(rad * 1.15)}px 'Apple Symbols', 'Segoe UI Symbol', 'Noto Sans Symbols 2', serif`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(SYMBOL[fam as keyof typeof SYMBOL], cx, cy + rad * .06);
}
function arrow(x: X, x0: number, y0: number, x1: number, y1: number, w = 6, col = INK) { const a = Math.atan2(y1 - y0, x1 - x0); x.strokeStyle = col; x.lineWidth = w; x.lineCap = 'round'; x.beginPath(); x.moveTo(x0, y0); x.lineTo(x1, y1); x.moveTo(x1 - Math.cos(a - .5) * 22, y1 - Math.sin(a - .5) * 22); x.lineTo(x1, y1); x.lineTo(x1 - Math.cos(a + .5) * 22, y1 - Math.sin(a + .5) * 22); x.stroke(); }
function chip(x: X, px: number, py: number, w: number, h: number, fill: string) { x.fillStyle = fill; rr(x, px, py, w, h, 14); x.fill(); x.strokeStyle = 'rgba(42,19,9,.35)'; x.lineWidth = 2; rr(x, px, py, w, h, 14); x.stroke(); }

export function drawJournalPage(x: X, page: number, index: number) {
  const side = page % 2 ? 1 : -1; journalPaper(x, page, side); x.textBaseline = 'alphabetic';
  if (page === 0) { // SPREAD 1 left: families
    header(x, 'I · IDENTIFICATION', 'Семейства', index + 1, side);
    x.fillStyle = OX; x.font = F.tech(30, 700); x.textAlign = 'left'; x.fillText('СИМВОЛ НА АНАЛИЗАТОРЕ → СЕМЕЙСТВО', MX, 250);
    FAMILIES.forEach((f, i) => { const cy = 380 + i * 250; glyph(x, MX + 110, cy, 92, f); x.fillStyle = INK; x.font = F.display(700, 64); x.textAlign = 'left'; x.fillText(f, MX + 250, cy + 6); x.fillStyle = INK2; x.font = F.tech(30, 600); x.fillText(FAM_RU[f], MX + 252, cy + 50); });
  } else if (page === 1) { // SPREAD 1 right: class -> base
    header(x, 'FAMILY + CLASS → BASE', 'Основа', index + 1, side);
    const c0 = MX + 230, c1 = MX + 560; x.fillStyle = INK; x.font = F.display(700, 54); x.textAlign = 'center'; x.fillText('CLASS I', c0 + 60, 260); x.fillText('CLASS II', c1 + 60, 260);
    FAMILIES.forEach((f, i) => { const cy = 400 + i * 245; glyph(x, MX + 70, cy, 62, f);
      BASE[f].forEach((r, k) => { const cx = (k ? c1 : c0) + 60; flask(x, cx - 80, cy - 10, 150, r, false); x.fillStyle = INK; x.font = F.tech(32, 700); x.textAlign = 'left'; x.fillText(r, cx - 10, cy - 4); x.fillStyle = INK2; x.font = F.tech(22, 500); x.fillText(RU[r], cx - 10, cy + 28); });
      x.strokeStyle = 'rgba(42,19,9,.18)'; x.lineWidth = 2; x.beginPath(); x.moveTo(MX, cy + 118); x.lineTo(W - MX, cy + 118); x.stroke(); });
  } else if (page === 2) { // SPREAD 2 left: the five bases
    header(x, 'II · COMPATIBILITY', 'Пять основ', index + 1, side);
    x.fillStyle = OX; x.font = F.tech(30, 700); x.textAlign = 'left'; x.fillText('НАЙДИТЕ ОСНОВУ → СМОТРИТЕ СПРАВА', MX, 250);
    REAGENTS.forEach((r, i) => { const col = i % 2, row = Math.floor(i / 2), cx = i === 4 ? W / 2 : MX + 200 + col * 430, cy = 440 + row * 330; flask(x, cx, cy, 210, r); x.fillStyle = INK2; x.font = F.tech(28, 600); x.textAlign = 'center'; x.fillText(RU[r], cx, cy + 128); });
  } else if (page === 3) { // SPREAD 2 right: base + reaction -> additive, ✕ incompatible
    header(x, 'BASE + REACTION → ADDITIVE', 'Добавка', index + 1, side);
    const cols = [MX + 230, MX + 400, MX + 570, MX + 740]; x.fillStyle = INK; x.font = F.display(700, 58); x.textAlign = 'center'; ['A', 'B', 'C'].forEach((c, i) => x.fillText(c, cols[i], 262)); x.fillStyle = OX; x.fillText('✕', cols[3], 262);
    REAGENTS.forEach((b, i) => { const cy = 380 + i * 196; flask(x, MX + 62, cy, 120, b, false); x.fillStyle = INK; x.font = F.tech(24, 700); x.textAlign = 'center'; x.fillText(b, MX + 62, cy + 86);
      ADDITIVE[b].forEach((a, k) => { flask(x, cols[k], cy - 6, 104, a, false); x.fillStyle = INK2; x.font = F.tech(20, 700); x.fillText(a, cols[k], cy + 70); });
      const bad = incompatible(b); flask(x, cols[3], cy - 6, 104, bad, false); x.strokeStyle = OX; x.lineWidth = 9; x.beginPath(); x.moveTo(cols[3] - 44, cy - 50); x.lineTo(cols[3] + 44, cy + 38); x.moveTo(cols[3] + 44, cy - 50); x.lineTo(cols[3] - 44, cy + 38); x.stroke();
      x.strokeStyle = 'rgba(42,19,9,.18)'; x.lineWidth = 2; x.beginPath(); x.moveTo(MX, cy + 98); x.lineTo(W - MX, cy + 98); x.stroke(); });
    x.fillStyle = OX; x.font = F.tech(26, 700); x.textAlign = 'center'; x.fillText('✕ НИКОГДА НЕ СМЕШИВАТЬ С ЭТОЙ ОСНОВОЙ', W / 2, H - 112);
  } else if (page === 4) { // SPREAD 3 left: polarity + concentration
    header(x, 'III · PROCEDURE', 'Порядок и дозы', index + 1, side);
    const pol = (y: number, sign: string, name: string, firstBase: boolean) => { chip(x, MX, y, W - 2 * MX, 190, firstBase ? '#f1dcae' : '#d9e3ee');
      x.fillStyle = OX; x.font = F.display(700, 92); x.textAlign = 'center'; x.fillText(sign, MX + 70, y + 125); x.fillStyle = INK; x.font = F.tech(34, 700); x.textAlign = 'left'; x.fillText(name, MX + 140, y + 62);
      const a = firstBase ? 'ОСНОВА' : 'ДОБАВКА', b2 = firstBase ? 'ДОБАВКА' : 'ОСНОВА'; x.font = F.tech(30, 700); x.fillText(`1 · ${a}`, MX + 140, y + 116); x.fillStyle = INK2; x.fillText(`2 · ${b2}`, MX + 140, y + 160);
      flask(x, W - MX - 250, y + 105, 120, firstBase ? 'VIOLET' : 'VERDANT', false); arrow(x, W - MX - 190, y + 105, W - MX - 130, y + 105); flask(x, W - MX - 70, y + 105, 120, firstBase ? 'VERDANT' : 'VIOLET', false); };
    pol(230, '+', 'POSITIVE → BASE FIRST', true); pol(440, '−', 'NEGATIVE → ADDITIVE FIRST', false);
    x.fillStyle = INK; x.font = F.display(700, 50); x.textAlign = 'left'; x.fillText('CONCENTRATION', MX, 740);
    (Object.keys(DOSES) as (keyof typeof DOSES)[]).forEach((c, i) => { const y = 780 + i * 170; chip(x, MX, y, W - 2 * MX, 150, i === 1 ? '#efe2c4' : '#f6ead0'); x.fillStyle = INK; x.font = F.tech(38, 700); x.fillText(c, MX + 28, y + 90);
      const [nb, na] = DOSES[c]; x.font = F.tech(28, 700); x.fillText('ОСНОВА', MX + 250, y + 62); x.fillText('ДОБАВКА', MX + 520, y + 62);
      for (let k = 0; k < nb; k++) { x.fillStyle = OX; x.beginPath(); x.arc(MX + 275 + k * 46, y + 104, 17, 0, 7); x.fill(); }
      for (let k = 0; k < na; k++) { x.fillStyle = '#1d5a8a'; x.beginPath(); x.arc(MX + 545 + k * 46, y + 104, 17, 0, 7); x.fill(); }
      x.fillStyle = INK; x.font = F.mono(40, 700); x.textAlign = 'right'; x.fillText(`×${nb} / ×${na}`, W - MX - 24, y + 96); x.textAlign = 'left'; });
  } else { // SPREAD 3 right: unstable, inject, 45 s, workflow
    header(x, 'SAFETY · INJECTION', 'Защита и впрыск', index + 1, side);
    chip(x, MX, 230, W - 2 * MX, 250, '#f3d0c4'); x.fillStyle = OX; x.font = F.tech(36, 700); x.textAlign = 'left'; x.fillText('UNSTABLE → COOLING LOCK FIRST', MX + 30, 290);
    x.fillStyle = INK; x.font = F.tech(28, 600); x.fillText('ВКЛЮЧИТЕ ЗАМОК ОХЛАЖДЕНИЯ', MX + 30, 336); x.fillText('ДО ПЕРВОЙ ДОЗЫ НЕСТАБИЛЬНОГО', MX + 30, 374);
    // lever + snowflake
    const lx = W - MX - 150, ly = 380; x.strokeStyle = INK; x.lineWidth = 12; x.lineCap = 'round'; x.beginPath(); x.moveTo(lx, ly); x.lineTo(lx + 50, ly - 90); x.stroke(); x.fillStyle = '#8a652a'; x.beginPath(); x.arc(lx, ly, 20, 0, 7); x.fill();
    x.strokeStyle = '#1d6aa0'; x.lineWidth = 6; for (let k = 0; k < 3; k++) { const a = k * Math.PI / 3; x.beginPath(); x.moveTo(lx + 100 - Math.cos(a) * 40, ly - 60 - Math.sin(a) * 40); x.lineTo(lx + 100 + Math.cos(a) * 40, ly - 60 + Math.sin(a) * 40); x.stroke(); }
    x.fillStyle = OX; x.font = `700 32px ${HAND}`; x.fillText('без замка — смесь вскипит и сольётся!', MX + 30, 448);
    chip(x, MX, 520, W - 2 * MX, 170, '#dfe9d2'); x.fillStyle = '#7a1a10'; x.beginPath(); x.arc(MX + 95, 605, 52, 0, 7); x.fill(); x.strokeStyle = '#3a2410'; x.lineWidth = 8; x.stroke();
    x.fillStyle = INK; x.font = F.tech(36, 700); x.fillText('INJECT → CONFIRM FORMULA', MX + 180, 590); x.font = F.tech(26, 600); x.fillStyle = INK2; x.fillText('НЕВЕРНО → СЛИВ, ПОВТОРИТЕ', MX + 180, 632);
    // 45 s ribbon
    x.font = F.tech(46, 700); const label = '45 СЕКУНД', rw = x.measureText(label).width + 70; x.fillStyle = OX; x.beginPath(); x.moveTo(MX, 730); x.lineTo(MX + rw, 730); x.lineTo(MX + rw - 20, 765); x.lineTo(MX + rw, 800); x.lineTo(MX, 800); x.closePath(); x.fill(); x.fillStyle = '#f6ead0'; x.fillText(label, MX + 22, 783);
    const steps = ['СИМВОЛ + CLASS → ОСНОВА', 'REACTION → ДОБАВКА', 'POLARITY → ПОРЯДОК', 'CONCENTRATION → ДОЗЫ', 'ЗАМОК (если UNSTABLE) → ДОЗЫ → INJECT'];
    steps.forEach((t, i) => { const y = 850 + i * 92; chip(x, MX, y, W - 2 * MX, 76, i % 2 ? '#f6ead0' : '#efdfba'); x.fillStyle = OX; x.font = F.mono(40, 700); x.fillText(String(i + 1), MX + 22, y + 53); x.fillStyle = INK; x.font = F.tech(30, 700); x.fillText(t, MX + 80, y + 50); });
  }
}
