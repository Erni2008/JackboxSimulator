// THE ENGINEER'S MANUAL — articulated book.
//
// Book space: x across the width (spine joint at x=0), y through the thickness
// (back board outer face at y=0), z along the height (head of the pages at -z).
// Independently driven parts: back board, spine (re-swept every frame while it
// flexes), front board (hinged at the spine), left & right text blocks (curved
// into the gutter), one deformable turning leaf, brass furniture on each board.
import * as T from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {PAGE_W as PW0, PAGE_H as PH0, renderPage, edgeTexture} from './page-art';
import {paginate, type ManualContent, type ManualPage} from './content';
import {loadLeather, leatherMapsCached, leatherMaterial, brassMaterial, endpaperTexture, frontTooling, backTooling, spineTooling} from './materials';

export const W = .18, H = .25, TH = .04, C = .0036; // board width, height, total thickness, board thickness
const PW = W - .0058, PH = H - .0075, P = TH - 2 * C; // page block width/height and total paper thickness
/** page textures are rendered above the 1024-px logical size for crisp type: 1.5× on desktop, 1.25× on phones */
let PAGE_W = PW0, PAGE_H = PH0;
const BANDS = [.1, .22, .56, .66, .88];
const ease = (t: number) => t < .5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
const smooth = (a: number, b: number, x: number) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

export interface BookSounds { coverOpen(): void; coverClose(): void; pageTurn(speed: number): void; creak(amount: number): void }

/** A text block with a grid on its reading face so it can sag into the gutter. Reading face is +y. */
class Block {
  mesh: T.Mesh; geo = new T.BufferGeometry(); segX = 22; segZ = 2; thick = 0; dip = 0; width = PW;
  constructor(pageMat: T.Material, edgeMat: T.Material, public flipU: boolean) { this.mesh = new T.Mesh(this.geo, [pageMat, edgeMat]); this.mesh.castShadow = this.mesh.receiveShadow = true; }
  /** surface height above the block base at u (0 = gutter edge, 1 = fore-edge) */
  surface(u: number) { return this.thick - this.dip * (1 - u) ** 2.4; }
  build(thick: number, dip: number, width = PW) {
    if (Math.abs(thick - this.thick) < 1e-6 && Math.abs(dip - this.dip) < 1e-6 && Math.abs(width - this.width) < 1e-6 && this.geo.attributes.position) return;
    this.width = width; this.thick = Math.max(.0006, thick); this.dip = Math.min(dip, this.thick * .8);
    const pos: number[] = [], uv: number[] = [], idx: number[] = [], groups: [number, number, number][] = [];
    const quadGrid = (nx: number, nz: number, f: (i: number, j: number) => [number, number, number, number, number], mat: number) => {
      const start = idx.length, base = pos.length / 3;
      for (let j = 0; j <= nz; j++) for (let i = 0; i <= nx; i++) { const [x, y, z, u, v] = f(i, j); pos.push(x, y, z); uv.push(u, v); }
      for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) { const a = base + j * (nx + 1) + i, b = a + 1, c = a + nx + 1, d = c + 1; idx.push(a, c, b, b, c, d); }
      groups.push([start, idx.length - start, mat]);
    };
    const BW = this.width, X = (u: number) => u * BW, Z = (v: number) => -PH / 2 + v * PH, s = this.surface.bind(this);
    const nx = this.segX, edgeV = (y: number) => y / P;
    // reading face (+y). canvas v=1 is the page head (-z) because CanvasTexture flips Y.
    quadGrid(nx, this.segZ, (i, j) => { const u = i / nx, v = j / this.segZ; return [X(u), s(u), Z(v), this.flipU ? 1 - u : u, 1 - v]; }, 0);
    // fore-edge (x = PW), facing +x
    quadGrid(1, 1, (i, j) => [BW, i ? 0 : s(1), Z(1 - j), j, edgeV(i ? 0 : s(1))], 1);
    // head (-z) and tail (+z) edges, following the sagging top
    quadGrid(nx, 1, (i, j) => { const u = i / nx; return [X(u), j ? 0 : s(u), -PH / 2, u, edgeV(j ? 0 : s(u))]; }, 1);
    quadGrid(nx, 1, (i, j) => { const u = 1 - i / nx; return [X(u), j ? 0 : s(u), PH / 2, u, edgeV(j ? 0 : s(u))]; }, 1);
    // gutter edge (x = 0)
    quadGrid(1, 1, (i, j) => [0, i ? s(0) : 0, Z(1 - j), j, edgeV(i ? s(0) : 0)], 1);
    this.geo.dispose(); this.geo = new T.BufferGeometry(); this.geo.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); this.geo.setAttribute('uv', new T.Float32BufferAttribute(uv, 2)); this.geo.setIndex(idx);
    for (const [s0, n, m] of groups) this.geo.addGroup(s0, n, m); this.geo.computeVertexNormals(); this.mesh.geometry = this.geo;
  }
}

export class EngineersManual {
  /** physics/interaction pivot: the centre of the closed book */
  root = new T.Group(); inner = new T.Group();
  backBoard = new T.Group(); frontBoard = new T.Group(); spine!: T.Mesh; left!: Block; right!: Block; leaf!: T.Mesh; brass: T.Mesh[] = [];
  /** 0 closed .. 1 fully open (front board rotated through 180°) */
  openness = 0; private openFrom = 0; private openTo = 0; private openT = 1; private openDur = 1;
  pages: ManualPage[] = []; content!: ManualContent; spread = 0; turning: {dir: number; t: number; dur: number; from: number} | null = null; settle = 0; settleAmp = 0;
  private texL!: T.CanvasTexture; private texR!: T.CanvasTexture; private texFront!: T.CanvasTexture; private texBack!: T.CanvasTexture;
  private cache = new Map<number, HTMLCanvasElement>(); private scratch = document.createElement('canvas');
  private leafGeo!: T.BufferGeometry; private leafSegX = 40; private leafSegZ = 10; flutter = 0;
  sounds: BookSounds | null = null; pickables: T.Object3D[] = []; quality: 'high' | 'low' = 'high'; private creakAcc = 0;
  /** fired whenever a spread becomes fully visible (for puzzle telemetry / hints) */
  onspread = (spread: number) => {};

  static async create(renderer: T.WebGLRenderer, content: ManualContent, quality: 'high' | 'low') {
    const b = new EngineersManual(); b.quality = quality; await document.fonts.load("30px 'IM Fell English'").catch(() => {}); await Promise.all(["30px 'IM Fell English SC'", "30px 'IM Fell DW Pica'", "30px 'Caveat'", "italic 30px 'IM Fell English'", "400 30px 'Libre Caslon Text'", "italic 400 30px 'Libre Caslon Text'", "700 30px 'Libre Caslon Text'", "500 30px 'Barlow Condensed'", "700 30px 'Barlow Condensed'", "700 30px 'IBM Plex Mono'", "600 30px 'IBM Plex Mono'", "600 30px 'Cinzel'", "800 30px 'Cinzel'"].map(f => document.fonts.load(f).catch(() => {})));
    await b.build(renderer, content); return b;
  }

  private async build(renderer: T.WebGLRenderer, content: ManualContent) {
    const aniso = renderer.capabilities.getMaxAnisotropy(), hi = this.quality === 'high'; const k = Math.min(hi ? 1.5 : 1.25, renderer.capabilities.maxTextureSize / PH0); PAGE_W = Math.round(PW0 * k); PAGE_H = Math.round(PH0 * k); let lp: Promise<any> | null = null; const leather = () => lp ||= loadLeather();
    const cw = hi ? 1024 : 640, ch = Math.round(cw * H / W);
    const [fm, bm, sm] = await Promise.all([leatherMapsCached(leather, {w: cw, h: ch, seed: 11, tiles: 2, tooling: frontTooling}, aniso, 'leather-front'), leatherMapsCached(leather, {w: cw, h: ch, seed: 29, tiles: 2, tooling: backTooling}, aniso, 'leather-back'), leatherMapsCached(leather, {w: hi ? 256 : 160, h: hi ? 1408 : 880, seed: 47, tiles: .5, tooling: spineTooling(BANDS), edgeWear: .5}, aniso, 'leather-spine')]);
    const front = leatherMaterial(fm), back = leatherMaterial(bm);
    const spineMat = leatherMaterial(sm); spineMat.side = T.DoubleSide;
    const brass = brassMaterial(aniso);
    this.scratch.width = PAGE_W; this.scratch.height = PAGE_H;
    const pageTex = () => { const c = document.createElement('canvas'); c.width = PAGE_W; c.height = PAGE_H; const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; t.anisotropy = aniso; t.minFilter = T.LinearMipmapLinearFilter; return t; };
    this.texL = pageTex(); this.texR = pageTex(); this.texFront = pageTex(); this.texBack = pageTex();
    // back face of the leaf sees mirrored UVs; flip the texture instead of duplicating geometry
    this.texBack.wrapS = T.RepeatWrapping; this.texBack.repeat.x = -1; this.texBack.offset.x = 1;
    // paper albedo slightly below white so the lamp never blows the ink out
    const paperMat = (map: T.Texture, side: T.Side) => new T.MeshStandardMaterial({map, side, color: new T.Color('#cfc6b4'), roughness: .95, metalness: 0, envMapIntensity: .15});
    const edgeT = new T.CanvasTexture(edgeTexture()); edgeT.colorSpace = T.SRGBColorSpace; edgeT.anisotropy = aniso;
    const edgeMat = new T.MeshStandardMaterial({map: edgeT, roughness: .92, metalness: 0, envMapIntensity: .4, side: T.DoubleSide});
    this.left = new Block(paperMat(this.texL, T.FrontSide), edgeMat, true); this.right = new Block(paperMat(this.texR, T.FrontSide), edgeMat, false);

    // boards: canonical frame x∈[0,W], y∈[-C,0] (outer face y=0), z∈[-H/2,H/2]
    const boardGeo = new RoundedBoxGeometry(W, C, H, 3, .0011); boardGeo.translate(W / 2, -C / 2, 0);
    { const p = boardGeo.attributes.position, uv = boardGeo.attributes.uv as T.BufferAttribute; for (let i = 0; i < p.count; i++) uv.setXY(i, p.getX(i) / W, 1 - (p.getZ(i) + H / 2) / H); uv.needsUpdate = true; boardGeo.setAttribute('uv1', uv.clone()); }
    const endMat = (seed: number) => new T.MeshStandardMaterial({map: endpaperTexture(seed), roughness: .8, metalness: 0});
    const board = (group: T.Group, mat: T.Material, seed: number) => {
      const m = new T.Mesh(boardGeo, mat); m.castShadow = m.receiveShadow = true; group.add(m);
      const ep = new T.Mesh(new T.PlaneGeometry(W - .012, H - .012), endMat(seed)); ep.rotation.x = Math.PI / 2; ep.position.set(W / 2 + .002, -C - .00015, 0); ep.receiveShadow = true; group.add(ep);
      const furniture = new T.Mesh(cornerFurniture(), brass); furniture.castShadow = furniture.receiveShadow = true; group.add(furniture); this.brass.push(furniture);
      this.pickables.push(m, furniture);
    };
    board(this.frontBoard, front, 3); board(this.backBoard, back, 8);
    this.backBoard.rotation.x = Math.PI; // outer face down, head stays at -z after the flip of z below
    this.backBoard.scale.z = -1; // undo z flip so the back cover's head matches the front's
    this.frontBoard.add(this.left.mesh);
    this.backBoard.add(this.right.mesh);
    this.right.mesh.scale.y = -1; this.right.mesh.position.set(.002, -C, 0); // backBoard frame is flipped: -y local == +y book
    this.left.mesh.scale.y = -1; this.left.mesh.position.set(.002, -C, 0);
    // spine
    this.spine = new T.Mesh(new T.BufferGeometry(), spineMat); this.spine.castShadow = this.spine.receiveShadow = true; this.initSpine(); this.pickables.push(this.spine);
    // turning leaf: one subdivided sheet, two materials (recto / verso) on the same vertices
    this.leafGeo = new T.PlaneGeometry(PW, PH, this.leafSegX, this.leafSegZ);
    this.leafGeo.clearGroups(); const n = this.leafGeo.index!.count; this.leafGeo.addGroup(0, n, 0); this.leafGeo.addGroup(0, n, 1);
    { const uv = this.leafGeo.attributes.uv as T.BufferAttribute; for (let i = 0; i < uv.count; i++) { const iu = i % (this.leafSegX + 1), jz = Math.floor(i / (this.leafSegX + 1)); uv.setXY(i, iu / this.leafSegX, 1 - jz / this.leafSegZ); } }
    this.leaf = new T.Mesh(this.leafGeo, [paperMat(this.texFront, T.FrontSide), paperMat(this.texBack, T.BackSide)]); this.leaf.castShadow = this.leaf.receiveShadow = true; this.leaf.visible = false; this.leaf.frustumCulled = false;
    this.inner.add(this.backBoard, this.frontBoard, this.spine, this.leaf); this.root.add(this.inner);
    this.root.traverse(o => { (o as any).userData.book = this; });
    this.setContent(content); this.pose();
  }

  /** Replace manual content (e.g. rules from the puzzle generator). Keeps the current spread if it still exists. */
  setContent(content: ManualContent) {
    this.content = content; this.pages = paginate(content); this.cache.clear(); this.spread = Math.min(this.spread, this.spreads - 1);
    this.show(this.texL, 2 * this.spread); this.show(this.texR, 2 * this.spread + 1); this.split = this.splitFor(this.spread); this.splitTarget = this.split;
  }
  get spreads() { return this.pages.length / 2; }
  private page(i: number) { let c = this.cache.get(i); if (!c) { c = document.createElement('canvas'); c.width = PAGE_W; c.height = PAGE_H; renderPage(c, this.pages, i, this.content, this.scratch); this.cache.set(i, c); if (this.cache.size > 8) { const far = [...this.cache.keys()].sort((a, b) => Math.abs(b - 2 * this.spread) - Math.abs(a - 2 * this.spread))[0]; this.cache.delete(far); } } return c; }
  private show(tex: T.CanvasTexture, i: number) { if (i < 0 || i >= this.pages.length) return; tex.image = this.page(i); tex.needsUpdate = true; }
  /** prefetch neighbouring pages during idle time so turning never hitches */
  private prefetch() { const go = () => { for (const i of [2 * this.spread + 2, 2 * this.spread + 3, 2 * this.spread - 1, 2 * this.spread - 2]) if (i >= 0 && i < this.pages.length && !this.cache.has(i)) { this.page(i); requestIdleCallbackSafe(go); return; } }; requestIdleCallbackSafe(go); }

  // ---------------------------------------------------------------- opening
  open(dur = 1.15) { if (this.openTo === 1) return; this.animateOpen(1, dur); this.sounds?.coverOpen(); this.flutter = 0; this.prefetch(); }
  close(dur = 1.0) { if (this.openTo === 0) return; if (this.turning) { this.finishTurn(); } this.animateOpen(0, dur); this.sounds?.coverClose(); }
  get isOpen() { return this.openTo === 1 && this.openT >= 1; }
  get isClosed() { return this.openTo === 0 && this.openT >= 1; }
  get busy() { return this.openT < 1 || !!this.turning; }
  private animateOpen(to: number, dur: number) { this.openFrom = this.openness; this.openTo = to; this.openT = 0; this.openDur = dur * Math.max(.35, Math.abs(to - this.openness)); }

  // ---------------------------------------------------------------- turning
  private split = .1; private splitTarget = .1;
  private splitFor(spread: number) { return .1 + .8 * (this.spreads > 1 ? spread / (this.spreads - 1) : .5); }
  canTurn(dir: number) { const s = this.spread + dir; return this.isOpen && !this.turning && s >= 0 && s < this.spreads; }
  turn(dir: number, speed = 1) {
    if (!this.canTurn(dir)) return false;
    const s = this.spread; this.turning = {dir, t: 0, dur: (dir > 0 ? .95 : .95) / speed, from: s};
    if (dir > 0) { this.show(this.texFront, 2 * s + 1); this.show(this.texBack, 2 * s + 2); this.show(this.texR, 2 * s + 3); }
    else { this.show(this.texFront, 2 * s - 1); this.show(this.texBack, 2 * s); this.show(this.texL, 2 * s - 2); }
    this.leaf.visible = true; this.sounds?.pageTurn(speed); return true;
  }
  private finishTurn() {
    const tr = this.turning!; this.spread = tr.from + tr.dir; this.turning = null; this.leaf.visible = false;
    this.show(this.texL, 2 * this.spread); this.show(this.texR, 2 * this.spread + 1); this.splitTarget = this.splitFor(this.spread);
    this.settle = 0; this.settleAmp = tr.dir; this.onspread(this.spread); this.prefetch();
  }

  update(dt: number) {
    if (this.openT < 1) {
      this.openT = Math.min(1, this.openT + dt / this.openDur); const prev = this.openness; this.openness = this.openFrom + (this.openTo - this.openFrom) * ease(this.openT);
      this.creakAcc += Math.abs(this.openness - prev); if (this.creakAcc > .22) { this.creakAcc = 0; this.sounds?.creak(Math.abs(this.openness - prev) / Math.max(dt, 1e-3)); }
    }
    if (this.turning) { this.turning.t += dt / this.turning.dur; if (this.turning.t >= 1) this.finishTurn(); }
    this.settle += dt; this.flutter = Math.max(0, this.flutter - dt * .9);
    this.split += (this.splitTarget - this.split) * Math.min(1, dt * 6);
    this.pose();
  }

  /** Lays out every part for the current openness, split and leaf progress. */
  pose() {
    const o = this.openness, th = o * Math.PI, half = th / 2;
    const L = P * this.split, R = P - L, dip = smooth(.25, 1, o) * .0075;
    // spine joint positions: A on the back board, S where the front board hinges
    const A = new T.Vector2(0, 0), d = new T.Vector2(-Math.sin(half), Math.cos(half)), S = A.clone().addScaledVector(d, TH);
    this.backBoard.position.set(0, 0, 0);
    this.frontBoard.position.set(S.x, S.y, 0); this.frontBoard.rotation.set(0, 0, th);
    // blocks slide toward the gutter as the spine flattens, and sag into it
    const slide = o * TH / 2;
    this.right.build(R, dip, PW + slide); this.right.mesh.position.x = .0012 - slide * 1.04;
    this.left.build(L, dip, PW + slide); this.left.mesh.position.x = .0012 - slide * 1.04;
    this.sweepSpine(A, S, o);
    // keep the book centred on whatever is its visual middle (closed: board centre, open: gutter)
    this.inner.position.set(-(W / 2) * (1 - o) + (TH / 2) * o, -(TH / 2) * (1 - o) - C * o, 0);
    // the loose leaf only exists while a page is actually turning in a fully open book
    if (this.turning && o > .98) this.poseLeaf(R, L, dip, slide); else this.leaf.visible = false;
  }

  /** Bends the turning leaf: each row along the height is integrated from the gutter outward. */
  private poseLeaf(R: number, L: number, dip: number, slide: number) {
    const tr = this.turning; let p = tr ? (tr.dir > 0 ? tr.t : 1 - tr.t) : 0; const dirSign = tr ? tr.dir : 1;
    if (!tr && this.flutter <= 0) return; this.leaf.visible = true;
    if (!tr) { this.show(this.texFront, 2 * this.spread + 1); this.show(this.texBack, 2 * this.spread + 2); }
    const pos = this.leafGeo.attributes.position as T.BufferAttribute, nx = this.leafSegX, nz = this.leafSegZ, LW = PW + slide, ds = LW / nx;
    // gutter position in book space
    const gxR = -slide * 1.04 + .0012, gxL = -TH * this.openness + slide * 1.04 - .0012, surfR = (u: number) => C + R - dip * (1 - u) ** 2.4, surfL = (u: number) => C + L - dip * (1 - u) ** 2.4;
    const slopeR = (u: number) => Math.atan2(surfR(Math.min(1, u + .01)) - surfR(u), LW * .01), slopeL = (u: number) => Math.atan2(surfL(Math.min(1, u + .01)) - surfL(u), LW * .01);
    const eased = p < .5 ? 2 * p * p : 1 - (-2 * p + 2) ** 2 / 2;
    const settle = Math.exp(-this.settle * 5) * Math.sin(this.settle * 17) * .06 * this.settleAmp;
    const flutter = this.flutter * Math.sin(this.flutter * 22) * .05;
    for (let j = 0; j <= nz; j++) {
      const zf = j / nz, z = -PH / 2 + zf * PH;
      // the corner nearest the reader (tail, +z) is lifted first, so the sheet turns diagonally
      const lead = .22 * (zf - .5) * (dirSign > 0 ? 1 : 1);
      const root = smooth(0, 1, eased * 1.35 + lead * Math.sin(Math.PI * eased));
      let x = gxR + (gxL - gxR) * root, y = surfR(0) + (surfL(0) - surfR(0)) * root + .0003;
      for (let i = 0; i <= nx; i++) {
        const sf = i / nx, rest0 = slopeR(sf), rest1 = Math.PI - slopeL(sf);
        // root leads, tip lags: progress along the sheet
        const local = smooth(0, 1, (eased * 1.35 + lead * Math.sin(Math.PI * eased)) - sf * .35);
        let a = rest0 + (rest1 - rest0) * local;
        // stiffness: belly of the sheet bows upward mid-turn
        a += Math.sin(Math.PI * local) * .35 * sf * (1 - sf * .4);
        if (!tr) a += (flutter + settle) * sf * sf; else a += settle * sf * sf * 0;
        const idx = j * (nx + 1) + i; pos.setXYZ(idx, x, y, z);
        x += Math.cos(a) * ds; y += Math.sin(a) * ds; if (y < C + .0002) y = C + .0002;
      }
    }
    pos.needsUpdate = true; this.leafGeo.computeVertexNormals(); this.leafGeo.computeBoundingSphere();
    if (!tr && this.flutter <= 0) this.leaf.visible = false;
  }

  // ---------------------------------------------------------------- spine
  private spineN = 14; private spineM = 64;
  private initSpine() {
    const n = this.spineN, m = this.spineM, count = (n + 1) * (m + 1) * 2 + (n + 1) * 2 * 2, pos = new Float32Array(count * 3), uv = new Float32Array(count * 2), idx: number[] = [];
    const g = new T.BufferGeometry(); g.setAttribute('position', new T.BufferAttribute(pos, 3)); g.setAttribute('uv', new T.BufferAttribute(uv, 2));
    const outer = 0, inner = (n + 1) * (m + 1);
    for (let j = 0; j <= m; j++) for (let i = 0; i <= n; i++) { const k = j * (n + 1) + i; uv[(outer + k) * 2] = i / n; uv[(outer + k) * 2 + 1] = 1 - j / m; uv[(inner + k) * 2] = i / n; uv[(inner + k) * 2 + 1] = 1 - j / m; }
    for (let j = 0; j < m; j++) for (let i = 0; i < n; i++) { const a = j * (n + 1) + i, b = a + 1, c = a + n + 1, d = c + 1; idx.push(outer + a, outer + b, outer + c, outer + b, outer + d, outer + c); idx.push(inner + a, inner + c, inner + b, inner + b, inner + c, inner + d); }
    // head & tail caps join outer and inner surfaces
    const cap = inner * 2; for (let e = 0; e < 2; e++) { const base = cap + e * (n + 1) * 2; for (let i = 0; i <= n; i++) { uv[(base + i) * 2] = i / n; uv[(base + i) * 2 + 1] = e; uv[(base + n + 1 + i) * 2] = i / n; uv[(base + n + 1 + i) * 2 + 1] = e; } for (let i = 0; i < n; i++) { const a = base + i, b = a + 1, c = base + n + 1 + i, d = c + 1; if (e) idx.push(a, b, c, b, d, c); else idx.push(a, c, b, b, c, d); } }
    g.setIndex(idx); this.spine.geometry = g;
  }
  private sweepSpine(A: T.Vector2, S: T.Vector2, o: number) {
    const n = this.spineN, m = this.spineM, g = this.spine.geometry, pos = g.attributes.position as T.BufferAttribute, inner = (n + 1) * (m + 1), cap = inner * 2;
    const ab = S.clone().sub(A), dir = ab.clone().normalize(), out = new T.Vector2(-dir.y, dir.x); // points away from the text block
    const bulge = .0055 * (1 - .65 * o), band = (z: number) => BANDS.reduce((s, b) => s + Math.exp(-((((z + H / 2) / H - b) / .012) ** 2)), 0) * .0013;
    const point = (i: number, zf: number, inset: number) => {
      const t = i / n, z = -H / 2 + zf * H, prof = Math.sin(Math.PI * t), off = (bulge + band(z) * Math.sqrt(prof)) * prof - inset;
      const head = Math.min(1, Math.min(zf, 1 - zf) * H / .004); // head/tail caps roll slightly inward
      return [A.x + ab.x * t + out.x * off * (.7 + .3 * head), A.y + ab.y * t + out.y * off * (.7 + .3 * head), z];
    };
    for (let j = 0; j <= m; j++) for (let i = 0; i <= n; i++) {
      const k = j * (n + 1) + i, zf = j / m, a = point(i, zf, 0), b = point(i, zf, C * .9);
      pos.setXYZ(k, a[0], a[1], a[2]); pos.setXYZ(inner + k, b[0], b[1], b[2]);
    }
    for (let e = 0; e < 2; e++) { const base = cap + e * (n + 1) * 2, zf = e; for (let i = 0; i <= n; i++) { const a = point(i, zf, 0), b = point(i, zf, C * .9); pos.setXYZ(base + i, a[0], a[1], a[2]); pos.setXYZ(base + n + 1 + i, b[0], b[1], b[2]); } }
    pos.needsUpdate = true; g.computeVertexNormals(); g.computeBoundingSphere();
  }

  /** Is the raycast hit on the right/left page, and where (page fractions)? Used for corner clicks. */
  pageHit(hit: T.Intersection) {
    if (!this.isOpen) return null; const local = this.inner.worldToLocal(hit.point.clone());
    const gutter = -TH / 2 + .0012 + 0; const side = local.x > gutter ? 1 : -1, u = Math.abs(local.x - gutter) / (PW + TH / 2), v = (local.z + PH / 2) / PH;
    if (u > 1.05 || v < -.05 || v > 1.05) return null; return {side, u, v};
  }

  dispose() { this.root.traverse((o: any) => { o.geometry?.dispose(); for (const m of [].concat(o.material || [])) { for (const k in m) (m as any)[k]?.isTexture && (m as any)[k].dispose(); (m as any).dispose(); } }); }
}

/** Brass corner protectors (outer + inner plates and edge wrap) and rivets for one board, canonical frame. */
function cornerFurniture() {
  const parts: T.BufferGeometry[] = [], leg = .03, t = .0008;
  const shape = new T.Shape(); shape.moveTo(0, 0); shape.lineTo(leg, 0); shape.quadraticCurveTo(leg * .42, leg * .42, 0, leg); shape.lineTo(0, 0);
  // decorative pierced lobe
  const hole = new T.Path(); hole.absarc(leg * .26, leg * .26, leg * .07, 0, Math.PI * 2, true); shape.holes.push(hole);
  const plate = new T.ExtrudeGeometry(shape, {depth: t, bevelEnabled: true, bevelThickness: .00035, bevelSize: .0004, bevelSegments: 2, curveSegments: 10});
  for (const cz of [-1, 1]) {
    for (const face of [0, 1]) { // 0 outer (y=0 side), 1 inner (y=-C side)
      const g = plate.clone();
      // shape lies in XY; map shape x -> -book x from fore-edge, shape y -> toward centre in z
      const m = new T.Matrix4().makeBasis(new T.Vector3(-1, 0, 0), new T.Vector3(0, 0, -cz), new T.Vector3(0, face ? -1 : 1, 0));
      m.setPosition(W + .0004, face ? -C - .0002 : .0002, cz * (H / 2 + .0004)); g.applyMatrix4(m);
      if ((m.determinant()) < 0) flipWinding(g); parts.push(g.index ? g.toNonIndexed() : g);
    }
    // wraps over the fore-edge and the head/tail edge
    const a = new RoundedBoxGeometry(.0012, C + .0026, leg * .9, 2, .0004); a.translate(W + .0006, -C / 2, cz * (H / 2 - leg * .45)); parts.push(a.index ? a.toNonIndexed() : a);
    const b = new RoundedBoxGeometry(leg * .9, C + .0026, .0012, 2, .0004); b.translate(W - leg * .45, -C / 2, cz * (H / 2 + .0006)); parts.push(b.index ? b.toNonIndexed() : b);
    // rivets through both plates
    for (const [dx, dz] of [[leg * .62, leg * .16], [leg * .16, leg * .62]]) for (const face of [0, 1]) {
      const r = new T.SphereGeometry(.0013, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2); r.scale(1, .55, 1); if (face) r.rotateX(Math.PI);
      r.translate(W - dx, face ? -C - .0012 : .0012, cz * (H / 2 - dz)); parts.push(r.index ? r.toNonIndexed() : r);
    }
  }
  for (const p of parts) { for (const k of Object.keys(p.attributes)) if (!['position', 'normal', 'uv'].includes(k)) p.deleteAttribute(k); if (!p.attributes.uv) p.setAttribute('uv', new T.Float32BufferAttribute(new Float32Array(p.attributes.position.count * 2), 2)); }
  const merged = mergeGeometries(parts)!; merged.setAttribute('uv1', merged.attributes.uv); return merged;
}
function flipWinding(g: T.BufferGeometry) { const i = g.index; if (i) { for (let k = 0; k < i.count; k += 3) { const a = i.getX(k + 1); i.setX(k + 1, i.getX(k + 2)); i.setX(k + 2, a); } } else { const p = g.attributes.position as T.BufferAttribute; for (const name of Object.keys(g.attributes)) { const at = g.attributes[name] as T.BufferAttribute, s = at.itemSize; for (let k = 0; k < at.count; k += 3) for (let c = 0; c < s; c++) { const t = at.getComponent(k + 1, c); at.setComponent(k + 1, c, at.getComponent(k + 2, c)); at.setComponent(k + 2, c, t); } } void p; } }
function requestIdleCallbackSafe(fn: () => void) { const w = window as any; if (w.requestIdleCallback) w.requestIdleCallback(fn, {timeout: 400}); else setTimeout(fn, 60); }
