// АДСКАЯ КЛЕТКА — THE HOST'S SUITCASE: the defusal notebook.
// A small worn notebook lies somewhere in the cage. Tap it and it is yours for the rest of the event: it opens in a
// reader over the scene (pages drawn on canvas: yellowed paper, ink, pencil notes, diagrams), with chapter tabs I–V,
// page turns by buttons / swipes / arrow keys, and pinch / wheel / double-tap zoom with panning.
// Closing the reader never touches the bomb: the case, its lid and the puzzle stay exactly as they were.
// Chapters are a registry (`chapters`): the mechanisms add their own rule pages; this file draws the frame.
import * as T from 'three';
import {L} from '../i18n';
import {MECHANISMS, MECH_NAME, ROMAN, type Mechanism} from './suitcase';

export const PW = 1000, PH = 1400; // page canvas
export type PageDraw = (x: CanvasRenderingContext2D, ink: Ink) => void;
export interface Ink { hand: (t: string, x: number, y: number, size?: number, color?: string, rot?: number) => void; print: (t: string, x: number, y: number, size?: number, opts?: {bold?: boolean; align?: CanvasTextAlign; color?: string; font?: string}) => void;
  para: (t: string, x: number, y: number, w: number, size?: number, lh?: number, font?: string) => number; title: (t: string, sub?: string) => void; rule: (y: number) => void; r: () => number }
/** chapter pages per mechanism (stage 4 fills the rules; the chapter opener is always first) */
export const chapters: Record<Mechanism, PageDraw[]> = {WIRE_MAZE: [], HIDDEN_CONNECTIONS: [], XRAY: [], LASER: [], THERMAL: []};
export const CHAPTER_BLURB: Record<Mechanism, () => string> = {
  WIRE_MAZE: () => L('Круглая панель, по которой переплетены цветные провода. Каждый идёт от своей клеммы к своей. Одна цепь — пусковая. Найди её по правилам главы, проследи глазами и перекуси только её.', 'A round panel with tangled coloured wires, each from its own terminal to its own. One circuit fires the charge. Find it by this chapter, trace it by eye and cut only that one.'),
  HIDDEN_CONNECTIONS: () => L('Ряд латунных контактов, соединения спрятаны под панелью. Приложи два щупа тестера к двум контактам — экран покажет, что между ними. Соединения не меняются. Вычисли пусковую пару и разомкни её.', 'A row of brass contacts; the links are hidden under the panel. Put the two tester probes on two contacts and the screen tells you what lies between them. The links never change. Deduce the firing pair and break it.'),
  XRAY: () => L('Запаянные контейнеры. Снаружи одинаковые — внутри разные. Веди рентгеновским окном над ними и сравнивай увиденное со схемами главы. Опасный контейнер изолируй его собственным рычажком.', 'Sealed canisters, alike outside, different inside. Sweep the X-ray window over them and compare what you see with the chapter diagrams. Isolate the dangerous one with its own lever.'),
  LASER: () => L('Оптический отсек: излучатель, поворотные зеркала, датчики и заслонки. Глава скажет, какой датчик — гасящий. Поворачивай зеркала, пока луч не ляжет точно на него, и подтверди.', 'An optical bay: emitter, turning mirrors, sensors and baffles. The chapter tells you which sensor is the quench. Turn the mirrors until the beam lands on it, then confirm.'),
  THERMAL: () => L('Шесть запаянных капсул. Тепловизор показывает температуру и рисунок нагрева каждой. Самая горячая — не обязательно опасная. Сверь все признаки с таблицей и изолируй одну.', 'Six sealed capsules. The thermal scope shows each one\'s temperature and heat pattern. The hottest is not necessarily the dangerous one. Match every sign against the table and isolate one.')};

const rnd = (s: number) => () => (s = (s * 16807) % 2147483647) / 2147483647;
function inkFor(x: CanvasRenderingContext2D, seed: number): Ink {
  const r = rnd(seed);
  const ink: Ink = {r,
    hand: (t, px, py, size = 40, color = '#2a3a6a', rot = 0) => { x.save(); x.translate(px, py); x.rotate(rot); x.font = `${size}px Caveat, cursive`; x.fillStyle = color; x.textAlign = 'left'; x.textBaseline = 'alphabetic'; x.fillText(t, 0, 0); x.restore(); },
    print: (t, px, py, size = 34, o = {}) => { x.font = `${o.bold ? '700 ' : ''}${size}px ${o.font ?? '"Libre Caslon Text", Georgia, serif'}`; x.fillStyle = o.color ?? '#241a10'; x.textAlign = o.align ?? 'left'; x.textBaseline = 'alphabetic'; x.fillText(t, px, py); },
    para: (t, px, py, w, size = 31, lh = 1.38, font = '"Libre Caslon Text", Georgia, serif') => { x.font = `${size}px ${font}`; x.fillStyle = '#241a10'; x.textAlign = 'left'; let line = '', y = py;
      for (const word of t.split(' ')) { const test = line ? line + ' ' + word : word; if (x.measureText(test).width > w && line) { x.fillText(line, px, y); line = word; y += size * lh; } else line = test; } if (line) x.fillText(line, px, y); return y + size * lh; },
    title: (t, sub) => { ink.print(t, PW / 2, 150, 58, {bold: true, align: 'center', font: '"IM Fell English SC", Georgia, serif'}); if (sub) ink.print(sub, PW / 2, 205, 30, {align: 'center', font: '"IM Fell English", serif'}); ink.rule(235); },
    rule: y => { x.strokeStyle = 'rgba(40,26,14,.7)'; x.lineWidth = 2.5; x.beginPath(); x.moveTo(90, y); x.lineTo(PW - 90, y); x.stroke(); x.lineWidth = 1; x.beginPath(); x.moveTo(90, y + 7); x.lineTo(PW - 90, y + 7); x.stroke(); }};
  return ink;
}
/** yellowed, foxed paper with a faint ruled grid and a torn binding edge */
function paper(x: CanvasRenderingContext2D, seed: number) {
  const r = rnd(seed); const g = x.createRadialGradient(PW / 2, PH / 2, PH * .2, PW / 2, PH / 2, PH * .75); g.addColorStop(0, '#e8dcbc'); g.addColorStop(1, '#cdb88a'); x.fillStyle = g; x.fillRect(0, 0, PW, PH);
  for (let i = 0; i < 46; i++) { const px = r() * PW, py = r() * PH, rad = 6 + r() * 40, f = x.createRadialGradient(px, py, 0, px, py, rad); f.addColorStop(0, `rgba(140,90,40,${.05 + r() * .12})`); f.addColorStop(1, 'rgba(140,90,40,0)'); x.fillStyle = f; x.fillRect(px - rad, py - rad, rad * 2, rad * 2); }
  x.strokeStyle = 'rgba(70,100,140,.12)'; x.lineWidth = 1; for (let y = 300; y < PH - 60; y += 44) { x.beginPath(); x.moveTo(60, y); x.lineTo(PW - 50, y); x.stroke(); }
  x.strokeStyle = 'rgba(150,40,30,.25)'; x.beginPath(); x.moveTo(78, 0); x.lineTo(78, PH); x.stroke();
  x.fillStyle = 'rgba(60,40,20,.25)'; for (let y = 40; y < PH; y += 88) { x.beginPath(); x.arc(30, y, 9, 0, 7); x.fill(); }
}

export class Notebook {
  readonly root = new T.Group(); taken = false; open = false; page = 0;
  onEvent: (e: 'TAKE' | 'TURN' | 'OPEN' | 'CLOSE') => void = () => {};
  private pages: {chapter: number; draw: PageDraw}[] = []; private cache = new Map<number, HTMLCanvasElement>();
  private el!: HTMLDivElement; private cv!: HTMLCanvasElement; private stage!: HTMLDivElement; private tabs!: HTMLDivElement; private label!: HTMLSpanElement;
  private z = 1; private px = 0; private py = 0; private ptrs = new Map<number, {x: number; y: number}>(); private pinch0 = 0; private z0 = 1; private swipe: {x: number; y: number; t: number} | null = null; private lastTap = 0;
  private floorPos = new T.Vector3(); private glow!: T.MeshStandardMaterial; private time = 0;

  constructor() {
    // ---- the object: a black oilcloth field notebook (unlike the brown manual and the burgundy journal): red elastic, brass corners, a stencilled label
    const weave = (() => { const c = document.createElement('canvas'); c.width = c.height = 256; const x = c.getContext('2d')!; x.fillStyle = '#1b1a19'; x.fillRect(0, 0, 256, 256);
      for (let i = 0; i < 256; i += 3) { x.fillStyle = `rgba(255,255,255,${.035 + Math.random() * .03})`; x.fillRect(i, 0, 1, 256); x.fillStyle = `rgba(0,0,0,${.2 + Math.random() * .1})`; x.fillRect(0, i, 256, 1); }
      for (let i = 0; i < 40; i++) { x.strokeStyle = `rgba(180,170,150,${.05 + Math.random() * .08})`; x.lineWidth = .5 + Math.random(); x.beginPath(); const px = Math.random() * 256, py = Math.random() * 256; x.moveTo(px, py); x.lineTo(px + (Math.random() - .5) * 60, py + (Math.random() - .5) * 20); x.stroke(); }
      const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; t.wrapS = t.wrapT = T.RepeatWrapping; t.repeat.set(2, 2); return t; })();
    const cover = new T.MeshStandardMaterial({map: weave, color: '#ffffff', roughness: .42, metalness: .05}), paperM = new T.MeshStandardMaterial({color: '#e2d7bc', roughness: .95}), band = new T.MeshStandardMaterial({color: '#9a1a12', roughness: .55}), brassC = new T.MeshStandardMaterial({color: '#b08a48', metalness: 1, roughness: .3});
    const b = (w: number, h: number, d: number, m: T.Material, x: number, y: number, z: number) => { const k = new T.Mesh(new T.BoxGeometry(w, h, d), m); k.position.set(x, y, z); k.castShadow = k.receiveShadow = true; this.root.add(k); return k; };
    b(.112, .003, .152, cover, 0, .0015, 0); b(.104, .012, .146, paperM, .002, .009, 0); b(.112, .003, .152, cover, 0, .0165, 0); b(.004, .018, .152, cover, -.056, .009, 0); b(.006, .0185, .152, band, .038, .009, 0);
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) if (sx > 0) { b(.014, .0035, .004, brassC, sx * .05, .0168, sz * .074); b(.004, .0035, .014, brassC, sx * .0545, .0168, sz * .07); }
    const label = new T.Mesh(new T.PlaneGeometry(.064, .036), new T.MeshStandardMaterial({map: (() => { const c = document.createElement('canvas'); c.width = 320; c.height = 180; const x = c.getContext('2d')!;
      x.fillStyle = '#e4d9bc'; x.fillRect(0, 0, 320, 180); x.strokeStyle = '#2a2622'; x.lineWidth = 5; x.strokeRect(10, 10, 300, 160); x.font = 'bold 40px Oswald, sans-serif'; x.fillStyle = '#1a1816'; x.textAlign = 'center'; x.fillText(L('ОБЕЗВРЕЖИВАНИЕ', 'DEFUSAL'), 160, 70);
      x.font = '22px "IBM Plex Mono", monospace'; x.fillText(L('ПОЛЕВОЙ БЛОКНОТ · № 0451', 'FIELD NOTEBOOK · No 0451'), 160, 108); x.save(); x.translate(236, 138); x.rotate(-.18); x.strokeStyle = 'rgba(170,25,15,.85)'; x.lineWidth = 4; x.strokeRect(-62, -20, 124, 40); x.fillStyle = 'rgba(170,25,15,.85)'; x.font = 'bold 28px Oswald, sans-serif'; x.fillText(L('ОПАСНО', 'DANGER'), 0, 10); x.restore();
      const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; return t; })(), roughness: .9}));
    label.rotation.x = -Math.PI / 2; label.position.set(-.008, .0182, -.03); this.root.add(label);
    const pencil = new T.Mesh(new T.CylinderGeometry(.0035, .0035, .13, 6), new T.MeshStandardMaterial({color: '#7a5a20', roughness: .6})); pencil.rotation.z = Math.PI / 2; pencil.rotation.y = .3; pencil.position.set(.01, .0045, .085); this.root.add(pencil);
    this.glow = paperM; paperM.emissive = new T.Color('#ffb070'); paperM.emissiveIntensity = 0;
    // ---- pages
    this.pages.push({chapter: -1, draw: this.drawContents}, {chapter: -1, draw: this.drawProcedure});
    MECHANISMS.forEach((m, i) => { this.pages.push({chapter: i, draw: (x, ink) => this.drawOpener(x, ink, m, i)}); for (const d of chapters[m]) this.pages.push({chapter: i, draw: d}); });
    this.buildDom();
  }
  /** on the floor by the door, half under the bench rail: the opposite corner from the case */
  place(ci: T.Box3 | undefined, floorY: number) { const x = ci ? ci.min.x + .2 : -.8, z = ci ? ci.max.z - .22 : .9; this.root.position.set(x, floorY + .002, z); this.root.rotation.set(0, .6, 0); this.floorPos.copy(this.root.position); }
  hits(ray: T.Raycaster) { return this.root.visible ? ray.intersectObject(this.root, true)[0] ?? null : null; }
  reset() { this.taken = false; this.root.visible = true; this.page = 0; this.close(); }
  take() { if (this.taken) return; this.taken = true; this.root.visible = false; this.onEvent('TAKE'); this.show(); }
  update(dt: number, gazed: boolean) { this.time += dt; const g = this.root.visible && !this.taken ? (gazed ? .35 : .05 + .04 * Math.sin(this.time * 2.4 + 1)) : 0; this.glow.emissiveIntensity += (g - this.glow.emissiveIntensity) * (1 - Math.exp(-dt * 6)); }
  /** pages a mechanism contributes after construction (stage 4) */
  rebuildPages() { const keep = this.pages.slice(0, 2); this.pages = keep; MECHANISMS.forEach((m, i) => { this.pages.push({chapter: i, draw: (x, ink) => this.drawOpener(x, ink, m, i)}); for (const d of chapters[m]) this.pages.push({chapter: i, draw: d}); }); this.cache.clear(); }
  chapterOf(page: number) { return this.pages[page]?.chapter ?? -1; }
  chapterPage(m: Mechanism) { return this.pages.findIndex(p => p.chapter === MECHANISMS.indexOf(m)); }

  show(page?: number) { if (page !== undefined) this.page = page; this.open = true; this.el.hidden = false; requestAnimationFrame(() => this.el.classList.add('show')); this.render(); this.onEvent('OPEN'); }
  close() { if (!this.el) return; const was = this.open; this.open = false; this.el.classList.remove('show'); setTimeout(() => { if (!this.open) this.el.hidden = true; }, 260); if (was) this.onEvent('CLOSE'); }
  turn(d: number) { const n = Math.max(0, Math.min(this.pages.length - 1, this.page + d)); if (n === this.page) return; this.page = n; this.z = 1; this.px = this.py = 0; const pg = this.el.querySelector('.nb-page')!; pg.classList.remove('flip-l', 'flip-r'); void (pg as HTMLElement).offsetWidth; pg.classList.add(d > 0 ? 'flip-l' : 'flip-r'); this.render(); this.onEvent('TURN'); }
  go(page: number) { if (page === this.page) return; this.turn(page - this.page); }

  private pageCanvas(i: number) { let c = this.cache.get(i); if (c) return c; c = document.createElement('canvas'); c.width = PW; c.height = PH; const x = c.getContext('2d')!; paper(x, 100 + i); this.pages[i].draw(x, inkFor(x, 500 + i));
    x.font = '26px "IM Fell English", serif'; x.fillStyle = 'rgba(36,26,16,.7)'; x.textAlign = 'center'; x.fillText(`— ${i + 1} —`, PW / 2, PH - 50); this.cache.set(i, c); return c; }
  private render() { const src = this.pageCanvas(this.page), x = this.cv.getContext('2d')!; x.clearRect(0, 0, PW, PH); x.drawImage(src, 0, 0); this.applyView();
    const ch = this.pages[this.page].chapter; this.tabs.querySelectorAll('button').forEach((b, i) => b.classList.toggle('on', i === ch + 1)); this.label.textContent = `${this.page + 1} / ${this.pages.length}`; }
  private applyView() { const r = this.cv.parentElement!.getBoundingClientRect(), mw = Math.max(0, (this.z - 1) * r.width / 2), mh = Math.max(0, (this.z - 1) * r.height / 2); this.px = Math.max(-mw, Math.min(mw, this.px)); this.py = Math.max(-mh, Math.min(mh, this.py)); this.cv.style.transform = `translate(${this.px}px, ${this.py}px) scale(${this.z})`; }
  private zoomAt(k: number, cx: number, cy: number) { const r = this.cv.parentElement!.getBoundingClientRect(), z1 = Math.max(1, Math.min(3.2, this.z * k)), f = z1 / this.z, ox = cx - (r.left + r.width / 2), oy = cy - (r.top + r.height / 2); this.px = ox - (ox - this.px) * f; this.py = oy - (oy - this.py) * f; this.z = z1; this.applyView(); }

  private buildDom() {
    const el = this.el = document.createElement('div'); el.id = 'notebook'; el.hidden = true;
    el.innerHTML = `<div class="nb-tabs"></div><div class="nb-stage"><div class="nb-book"><div class="nb-rings"></div><div class="nb-page"><canvas width="${PW}" height="${PH}"></canvas><div class="nb-gutter"></div></div></div></div><div class="nb-bar"><button class="nb-prev" aria-label="prev">‹</button><span class="nb-label"></span><button class="nb-next" aria-label="next">›</button><button class="nb-close"></button></div>`;
    document.body.append(el); this.cv = el.querySelector('canvas')!; this.stage = el.querySelector('.nb-stage')!; this.tabs = el.querySelector('.nb-tabs')!; this.label = el.querySelector('.nb-label')!;
    (el.querySelector('.nb-close') as HTMLButtonElement).textContent = L('К бомбе', 'To the bomb');
    const tab = (t: string, page: () => number, title: string) => { const b = document.createElement('button'); b.textContent = t; b.title = title; b.onclick = () => this.go(page()); this.tabs.append(b); };
    tab('§', () => 0, L('Содержание', 'Contents')); MECHANISMS.forEach((m, i) => tab(ROMAN[i], () => this.chapterPage(m), MECH_NAME[m]()));
    (el.querySelector('.nb-prev') as HTMLButtonElement).onclick = () => this.turn(-1); (el.querySelector('.nb-next') as HTMLButtonElement).onclick = () => this.turn(1); (el.querySelector('.nb-close') as HTMLButtonElement).onclick = () => this.close();
    addEventListener('keydown', e => { if (!this.open) return; if (e.key === 'ArrowRight') this.turn(1); else if (e.key === 'ArrowLeft') this.turn(-1); else if (e.key === 'Escape') { e.stopImmediatePropagation(); this.close(); } }, true);
    const st = this.stage; st.addEventListener('wheel', e => { e.preventDefault(); this.zoomAt(Math.exp(-e.deltaY * .0016), e.clientX, e.clientY); }, {passive: false});
    st.addEventListener('pointerdown', e => { st.setPointerCapture(e.pointerId); this.ptrs.set(e.pointerId, {x: e.clientX, y: e.clientY}); if (this.ptrs.size === 1) this.swipe = {x: e.clientX, y: e.clientY, t: performance.now()}; else { this.swipe = null; const [a, b] = [...this.ptrs.values()]; this.pinch0 = Math.hypot(a.x - b.x, a.y - b.y); this.z0 = this.z; } });
    st.addEventListener('pointermove', e => { const p = this.ptrs.get(e.pointerId); if (!p) return; const dx = e.clientX - p.x, dy = e.clientY - p.y; p.x = e.clientX; p.y = e.clientY;
      if (this.ptrs.size >= 2) { const [a, b] = [...this.ptrs.values()], d = Math.hypot(a.x - b.x, a.y - b.y); if (this.pinch0 > 0) this.zoomAt(this.z0 * d / this.pinch0 / this.z, (a.x + b.x) / 2, (a.y + b.y) / 2); this.px += dx / 2; this.py += dy / 2; this.applyView(); }
      else if (this.z > 1.01) { this.px += dx; this.py += dy; this.applyView(); } });
    const up = (e: PointerEvent) => { if (!this.ptrs.delete(e.pointerId)) return; if (this.ptrs.size < 2) this.pinch0 = 0; const s = this.swipe; this.swipe = null; if (!s || this.ptrs.size) return;
      const dx = e.clientX - s.x, dy = e.clientY - s.y, dt = performance.now() - s.t;
      if (this.z <= 1.01 && Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5 && dt < 600) { this.turn(dx < 0 ? 1 : -1); return; }
      if (Math.hypot(dx, dy) < 10 && dt < 300) { const now = performance.now(); if (now - this.lastTap < 320) { if (this.z > 1.01) { this.z = 1; this.px = this.py = 0; this.applyView(); } else this.zoomAt(2.2, e.clientX, e.clientY); this.lastTap = 0; } else this.lastTap = now; } };
    st.addEventListener('pointerup', up); st.addEventListener('pointercancel', up);
  }

  // ---- built-in pages
  private drawContents = (x: CanvasRenderingContext2D, ink: Ink) => {
    ink.title(L('Блокнот обезвреживания', 'Defusal notebook'), L('Чемодан мастерской «Финал», № 0451', 'Case from the "Final" workshop, No. 0451'));
    let y = 330; ink.print(L('Содержание', 'Contents'), 120, y, 40, {bold: true}); y += 70;
    ink.print(L('Порядок действий', 'Procedure'), 140, y, 34); ink.print('2', PW - 130, y, 34, {align: 'right'}); y += 62;
    MECHANISMS.forEach((m, i) => { ink.print(`${ROMAN[i]}.  ${MECH_NAME[m]()}`, 140, y, 34); ink.print(String(this.chapterPage(m) + 1), PW - 130, y, 34, {align: 'right'}); x.setLineDash([3, 9]); x.strokeStyle = 'rgba(36,26,16,.5)'; x.beginPath(); x.moveTo(560, y - 8); x.lineTo(PW - 170, y - 8); x.stroke(); x.setLineDash([]); y += 62; });
    ink.hand(L('Читай целиком. Не угадывай.', 'Read it all. Do not guess.'), 150, y + 90, 52, '#2a3a6a', -.04);
    ink.hand(L('— тот, кто собирал', '— the one who built it'), 420, y + 160, 40, '#2a3a6a', -.04);
  };
  private drawProcedure = (x: CanvasRenderingContext2D, ink: Ink) => {
    ink.title(L('Порядок действий', 'Procedure'));
    const steps = [L('Найди чемодан. Подними его и осмотри со всех сторон.', 'Find the case. Pick it up and look at it from every side.'),
      L('Отстегни обе защёлки спереди. Затем подними крышку.', 'Release both front latches. Then lift the lid.'),
      L('Внутри пять отсеков (I–V). Заряжены ТРИ — у них горят КРАСНЫЕ лампы. Остальные два мертвы — их не трогай.', 'Inside are five bays (I–V). THREE are armed — their lamps burn RED. The other two are dead — leave them.'),
      L('Обезвредь все три, в любом порядке. Нажми на отсек — он приблизится. Для каждого открой главу с его номером.', 'Neutralise all three, in any order. Tap a bay to bring it close. For each, open the chapter with its number.'),
      L('Каждое неверное действие — удар по взрывателю. Лёгкий режим прощает три, средний — два, сложный — один.', 'Every wrong move is a strike on the fuse. Easy forgives three, normal two, hard one.'),
      L('Таймер — на внутренней стороне крышки. Когда он покраснеет, времени почти нет.', 'The timer is inside the lid. When it turns red, time is nearly up.')];
    let y = 320; steps.forEach((s, i) => { ink.print(`${i + 1}.`, 110, y, 36, {bold: true}); y = ink.para(s, 165, y, PW - 270, 31) + 22; });
    // little diagram: the tray from above, bays numbered
    const ox = 210, oy = y + 20, w = 580, h = 330; x.strokeStyle = '#2a1c10'; x.lineWidth = 3; x.strokeRect(ox, oy, w, h);
    const bay = (bx: number, by: number, bw: number, bh: number, n: string, red: boolean) => { x.strokeRect(ox + bx * w, oy + by * h, bw * w, bh * h); ink.print(n, ox + (bx + .05) * w, oy + (by + bh - .06) * h, 34, {bold: true}); x.beginPath(); x.arc(ox + (bx + bw - .05) * w, oy + (by + bh - .1) * h, 9, 0, 7); x.fillStyle = red ? '#a8261a' : 'rgba(0,0,0,0)'; x.fill(); x.stroke(); };
    bay(.04, .06, .3, .44, 'I', true); bay(.37, .06, .26, .44, 'II', true); bay(.66, .06, .3, .44, 'III', false); bay(.04, .56, .5, .38, 'IV', true); bay(.6, .56, .36, .38, 'V', false);
    ink.hand(L('(пример) горит = заряжен', '(example) lit = armed'), ox + w * .4, oy - 18, 38, '#a8261a', -.03);
  };
  private drawOpener(x: CanvasRenderingContext2D, ink: Ink, m: Mechanism, i: number) {
    ink.print(L('Глава', 'Chapter') + ' ' + ROMAN[i], PW / 2, 190, 40, {align: 'center', font: '"IM Fell English SC", serif'}); ink.print(MECH_NAME[m](), PW / 2, 270, 64, {align: 'center', bold: true, font: '"IM Fell English SC", serif'}); ink.rule(310);
    let y = ink.para(CHAPTER_BLURB[m](), 110, 400, PW - 220, 33);
    ink.hand(L('Сначала убедись, что лампа этого отсека горит.', 'First make sure this bay\'s lamp is lit.'), 120, y + 70, 40, '#6a2a1a', -.03); void x;
  }
}
