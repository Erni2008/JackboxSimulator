// REFERENCE PANEL — read the manual while you work. The current book's real pages are shown flat in a docked
// panel instead of the hand-held 3D book: on a wide screen it stands at the right and the scene slides left so the
// task stays whole and usable; on a phone it is a bottom sheet (drag its handle to resize) and the scene lifts up.
// Pages turn with the arrows, a swipe, the chapter tabs or the keyboard (← →, R to open or close).
import {L} from '../i18n';

export interface RefBook { page(i: number): HTMLCanvasElement; readonly count: number }
export interface RefSource { key: string; title: string; book: RefBook; tabs?: {label: string; title: string; page: number}[]; start?: number }
export type RefDock = 'side' | 'sheet' | null;

const store = {get(k: string) { try { return localStorage.getItem(k); } catch { return null; } }, set(k: string, v: string) { try { localStorage.setItem(k, v); } catch { /* private mode */ } }};

export class ReferencePanel {
  open = false; dock: RefDock = null; page = 0; /** 1 = fit the width, 2 = a closer look (double tap) */ zoom = 1; private src: RefSource | null = null; private last = new Map<string, number>();
  private el: HTMLElement; private cv: HTMLCanvasElement; private view: HTMLElement; private titleEl: HTMLElement; private countEl: HTMLElement; private tabsEl: HTMLElement; private btn: HTMLButtonElement;
  private sheetH = Math.min(.8, Math.max(.3, Number(store.get('fa-ref-sheet')) || .4));
  /** called when the panel opens, closes or changes size: the scene re-centres itself in the free area */
  onLayout: (dock: RefDock, w: number, h: number) => void = () => {};
  /** called right before opening (to lower a hand-held book) */
  onOpen: () => void = () => {};
  sounds: {turn?: () => void} = {};

  constructor(private source: () => RefSource | null) {
    this.btn = document.createElement('button'); this.btn.id = 'ref-btn'; this.btn.type = 'button'; this.btn.hidden = true;
    this.btn.innerHTML = '<span class="ref-ico" aria-hidden="true"></span><b></b>'; this.btn.onclick = () => this.toggle(); document.body.append(this.btn);
    const el = this.el = document.createElement('aside'); el.id = 'ref'; el.hidden = true; el.setAttribute('aria-label', L('Справочник', 'Manual'));
    el.innerHTML = `<div class="ref-grip" aria-hidden="true"><i></i></div>
      <header class="ref-head"><span class="ref-title"></span><span class="ref-count"></span><button type="button" class="ref-close" aria-label="${L('Закрыть', 'Close')}">✕</button></header>
      <nav class="ref-tabs"></nav>
      <div class="ref-view"><canvas></canvas></div>
      <footer class="ref-foot"><button type="button" class="ref-prev">‹ ${L('Назад', 'Back')}</button><button type="button" class="ref-next">${L('Далее', 'Next')} ›</button></footer>`;
    document.body.append(el);
    this.cv = el.querySelector('canvas')!; this.view = el.querySelector('.ref-view')!; this.titleEl = el.querySelector('.ref-title')!; this.countEl = el.querySelector('.ref-count')!; this.tabsEl = el.querySelector('.ref-tabs')!;
    (el.querySelector('.ref-close') as HTMLElement).onclick = () => this.close();
    (el.querySelector('.ref-prev') as HTMLElement).onclick = () => this.turn(-1); (el.querySelector('.ref-next') as HTMLElement).onclick = () => this.turn(1);
    // swipe the page sideways to turn it (vertical drags still scroll the page)
    let sx = 0, sy = 0, st = 0; this.view.addEventListener('pointerdown', e => { sx = e.clientX; sy = e.clientY; st = performance.now(); });
    this.view.addEventListener('pointerup', e => { const dx = e.clientX - sx, dy = e.clientY - sy; if (this.zoom === 1 && Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.6 && performance.now() - st < 700) this.turn(dx < 0 ? 1 : -1); /* zoomed in, a sideways drag pans instead */ });
    // double tap / double click: a closer look at small print (tables), centred on the tap; again to fit the width
    let lastTap = 0; this.view.addEventListener('pointerup', e => { const t = performance.now(); if (t - lastTap < 320) { const r = this.view.getBoundingClientRect(), fx = (e.clientX - r.left + this.view.scrollLeft) / this.view.scrollWidth, fy = (e.clientY - r.top + this.view.scrollTop) / this.view.scrollHeight;
      this.zoom = this.zoom > 1 ? 1 : 2; this.view.classList.toggle('zoomed', this.zoom > 1); this.draw(); this.view.scrollLeft = fx * this.view.scrollWidth - r.width / 2; this.view.scrollTop = fy * this.view.scrollHeight - r.height / 2; lastTap = 0; } else lastTap = t; });
    this.view.addEventListener('dblclick', e => e.preventDefault());
    // drag the sheet's handle to resize it
    const grip = el.querySelector('.ref-grip') as HTMLElement; let drag = false;
    grip.addEventListener('pointerdown', e => { drag = true; grip.setPointerCapture(e.pointerId); });
    grip.addEventListener('pointermove', e => { if (!drag) return; this.sheetH = Math.min(.8, Math.max(.28, 1 - e.clientY / innerHeight)); this.layout(); });
    grip.addEventListener('pointerup', () => { if (!drag) return; drag = false; store.set('fa-ref-sheet', this.sheetH.toFixed(2)); });
    addEventListener('keydown', e => { const tag = (e.target as HTMLElement)?.tagName; if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === 'r' || e.key === 'R' || e.key === 'к' || e.key === 'К') { if (!this.btn.hidden) this.toggle(); }
      else if (this.open && e.key === 'ArrowRight') this.turn(1); else if (this.open && e.key === 'ArrowLeft') this.turn(-1); else if (this.open && e.key === 'Escape') this.close(); });
    addEventListener('resize', () => { if (this.open) { this.layout(); this.draw(); } });
  }
  /** show the open button only when a book is at hand */
  setAvailable(on: boolean) { if (this.btn.hidden === !on) return; this.btn.hidden = !on; this.btn.querySelector('b')!.textContent = L('Справочник', 'Manual'); if (!on && this.open) this.close(); }
  toggle() { if (this.open) this.close(); else this.show(); }
  show(page?: number) { const s = this.source(); if (!s) return; this.onOpen(); this.src = s; this.open = true; this.el.hidden = false; document.body.classList.add('ref-on'); this.btn.classList.add('on');
    this.page = Math.max(0, Math.min(s.book.count - 1, page ?? this.last.get(s.key) ?? s.start ?? 0)); this.titleEl.textContent = s.title; this.buildTabs(); this.layout(); this.draw(); this.el.classList.remove('in'); void this.el.offsetWidth; this.el.classList.add('in'); }
  close() { if (!this.open) return; this.open = false; this.el.hidden = true; document.body.classList.remove('ref-on', 'ref-side', 'ref-sheet'); this.btn.classList.remove('on'); this.dock = null; this.onLayout(null, 0, 0); }
  /** jump to a page (e.g. the chapter of the bay just focused) when the panel is open */
  go(page: number) { if (!this.src) return; const p = Math.max(0, Math.min(this.src.book.count - 1, page)); if (p === this.page) return; this.page = p; this.last.set(this.src.key, p); this.zoom = 1; this.view.classList.remove('zoomed'); this.view.scrollTop = 0; this.view.scrollLeft = 0; this.draw(); }
  /** the source changed (another task): re-read it if open */
  refresh() { if (!this.open) return; const s = this.source(); if (!s) { this.close(); return; } if (s.key !== this.src?.key) { this.src = s; this.page = this.last.get(s.key) ?? s.start ?? 0; this.titleEl.textContent = s.title; this.buildTabs(); } this.draw(); }
  turn(d: number) { if (!this.src) return; const p = this.page + d; if (p < 0 || p >= this.src.book.count) return; this.go(p); this.sounds.turn?.(); this.el.classList.remove('flip-l', 'flip-r'); void this.el.offsetWidth; this.el.classList.add(d > 0 ? 'flip-r' : 'flip-l'); }
  private buildTabs() { this.tabsEl.replaceChildren(); const tabs = this.src?.tabs ?? []; this.tabsEl.hidden = !tabs.length;
    for (const t of tabs) { const b = document.createElement('button'); b.type = 'button'; b.textContent = t.label; b.title = t.title; b.dataset.page = String(t.page); b.onclick = () => { this.go(t.page); this.sounds.turn?.(); }; this.tabsEl.append(b); } }
  private layout() { const wide = innerWidth >= 760 && innerWidth / innerHeight >= 1.05; this.dock = wide ? 'side' : 'sheet';
    document.body.classList.toggle('ref-side', wide); document.body.classList.toggle('ref-sheet', !wide);
    const w = wide ? Math.round(Math.min(560, Math.max(340, innerWidth * .36))) : innerWidth, h = wide ? innerHeight : Math.round(innerHeight * this.sheetH);
    this.el.style.setProperty('--ref-w', w + 'px'); this.el.style.setProperty('--ref-h', h + 'px');
    document.body.style.setProperty('--ref-w', wide ? w + 'px' : '0px'); document.body.style.setProperty('--ref-h', wide ? '0px' : h + 'px');
    this.onLayout(this.dock, wide ? w : 0, wide ? 0 : h); }
  private draw() { const s = this.src; if (!s) return; const src = s.book.page(this.page), r = devicePixelRatio || 1;
    const w = Math.round(Math.max(200, this.view.clientWidth - 2) * this.zoom), h = Math.round(w * src.height / src.width);
    this.cv.width = Math.round(w * r); this.cv.height = Math.round(h * r); this.cv.style.width = w + 'px'; this.cv.style.height = h + 'px';
    const x = this.cv.getContext('2d')!; x.imageSmoothingQuality = 'high'; x.drawImage(src, 0, 0, this.cv.width, this.cv.height);
    this.countEl.textContent = `${this.page + 1} / ${s.book.count}`; this.last.set(s.key, this.page);
    (this.el.querySelector('.ref-prev') as HTMLButtonElement).disabled = this.page <= 0; (this.el.querySelector('.ref-next') as HTMLButtonElement).disabled = this.page >= s.book.count - 1;
    let active: HTMLElement | null = null; for (const b of this.tabsEl.children as any as HTMLElement[]) { if (+b.dataset.page! <= this.page) active = b; b.classList.remove('on'); } active?.classList.add('on'); }
}
