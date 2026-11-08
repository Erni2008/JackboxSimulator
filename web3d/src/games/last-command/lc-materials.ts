// THE LAST COMMAND — procedural PBR materials (no image files): colour, normal (from a generated height field) and
// roughness/metalness maps for painted steel, brushed steel, brass with patina, oxidised copper and bakelite.
// Textures are generated once per kind and shared; UVs are box-projected in metres by bake.ts, so every face gets
// the same texel density.
import * as T from 'three';

const rng = (seed: number) => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
type Ctx = CanvasRenderingContext2D;
const canvas = (n: number) => { const c = document.createElement('canvas'); c.width = c.height = n; return c; };

/** value noise, tileable, summed over octaves → Float32 field 0..1 */
function fbm(n: number, seed: number, base: number, oct = 5) {
  const r = rng(seed), out = new Float32Array(n * n);
  for (let o = 0; o < oct; o++) { const g = base << o, grid = new Float32Array(g * g).map(() => r()), amp = Math.pow(.5, o);
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) { const fx = x / n * g, fy = y / n * g, x0 = Math.floor(fx), y0 = Math.floor(fy), tx = fx - x0, ty = fy - y0, sx = tx * tx * (3 - 2 * tx), sy = ty * ty * (3 - 2 * ty);
      const a = grid[(y0 % g) * g + x0 % g], b = grid[(y0 % g) * g + (x0 + 1) % g], c = grid[((y0 + 1) % g) * g + x0 % g], d = grid[((y0 + 1) % g) * g + (x0 + 1) % g];
      out[y * n + x] += (a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy) * amp; } }
  let mn = 1e9, mx = -1e9; for (const v of out) { mn = Math.min(mn, v); mx = Math.max(mx, v); } for (let i = 0; i < out.length; i++) out[i] = (out[i] - mn) / (mx - mn); return out;
}
/** a height canvas → tangent-space normal map */
function normalFrom(h: Float32Array, n: number, strength: number) {
  const c = canvas(n), x = c.getContext('2d')!, img = x.createImageData(n, n), at = (i: number, j: number) => h[((j + n) % n) * n + (i + n) % n];
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) { const dx = (at(i + 1, j) - at(i - 1, j)) * strength, dy = (at(i, j + 1) - at(i, j - 1)) * strength, l = Math.hypot(dx, dy, 1), k = (j * n + i) * 4;
    img.data[k] = (-dx / l * .5 + .5) * 255; img.data[k + 1] = (dy / l * .5 + .5) * 255; img.data[k + 2] = (1 / l * .5 + .5) * 255; img.data[k + 3] = 255; }
  x.putImageData(img, 0, 0); return c;
}
const tex = (c: HTMLCanvasElement, srgb: boolean) => { const t = new T.CanvasTexture(c); t.wrapS = t.wrapT = T.RepeatWrapping; t.anisotropy = 8; if (srgb) t.colorSpace = T.SRGBColorSpace; return t; };
function fill(n: number, f: (i: number, j: number) => [number, number, number]) { const c = canvas(n), x = c.getContext('2d')!, img = x.createImageData(n, n);
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) { const [r, g, b] = f(i, j), k = (j * n + i) * 4; img.data[k] = r; img.data[k + 1] = g; img.data[k + 2] = b; img.data[k + 3] = 255; } x.putImageData(img, 0, 0); return {c, x}; }
function scratches(x: Ctx, n: number, seed: number, count: number, col: string, w = .7) { const r = rng(seed); x.strokeStyle = col; x.lineWidth = w; for (let i = 0; i < count; i++) { const sx = r() * n, sy = r() * n, a = r() * 7, l = 3 + r() * n * .08; x.beginPath(); x.moveTo(sx, sy); x.quadraticCurveTo(sx + Math.cos(a) * l * .5 + r() * 3, sy + Math.sin(a) * l * .5, sx + Math.cos(a) * l, sy + Math.sin(a) * l); x.stroke(); } }

type Set = {map: T.Texture; normalMap: T.Texture; roughnessMap: T.Texture};
const cache = new Map<string, Set>();
function painted(n: number): Set {
  const big = fbm(n, 11, 4), fine = fbm(n, 12, 32, 3), peel = fbm(n, 13, 64, 2), grime = fbm(n, 14, 3, 4);
  // colour: a slightly uneven coat, darker grime pooling in bands, a few lighter chips showing primer and steel
  const col = fill(n, (i, j) => { const k = j * n + i, v = .92 + big[k] * .07 - grime[k] * .08 * (j / n) - fine[k] * .025; return [200 * v, 206 * v, 198 * v]; });
  { const r = rng(15); for (let i = 0; i < 40; i++) { const x0 = r() * n, y0 = r() * n, s = 1 + r() * 4; col.x.fillStyle = r() < .5 ? 'rgba(120,124,118,.8)' : 'rgba(168,172,170,.9)'; col.x.beginPath(); col.x.ellipse(x0, y0, s, s * (.4 + r()), r() * 3, 0, 7); col.x.fill(); } }
  scratches(col.x, n, 16, 70, 'rgba(225,228,222,.35)');
  for (let i = 0; i < 18; i++) { const r = rng(17 + i), x0 = r() * n, g = col.x.createLinearGradient(0, 0, 0, n); g.addColorStop(0, 'rgba(40,34,26,0)'); g.addColorStop(.6, 'rgba(40,34,26,.10)'); g.addColorStop(1, 'rgba(40,34,26,0)'); col.x.fillStyle = g; col.x.fillRect(x0, r() * n * .4, 1 + r() * 3, n * (.3 + r() * .5)); } // rust-free drips
  const h = new Float32Array(n * n); for (let k = 0; k < h.length; k++) h[k] = peel[k] * .6 + fine[k] * .25 + big[k] * .15;
  const rough = fill(n, (i, j) => { const k = j * n + i, v = 160 + big[k] * 30 + grime[k] * 25 - fine[k] * 10; return [v, v, v]; }); scratches(rough.x, n, 16, 70, 'rgba(70,70,70,.9)');
  return {map: tex(col.c, true), normalMap: tex(normalFrom(h, n, .45), false), roughnessMap: tex(rough.c, false)};
}
function brushed(n: number, seed: number, tint: [number, number, number], patina: boolean): Set {
  const r = rng(seed), lines = new Float32Array(n * n); for (let j = 0; j < n; j++) { let v = r(); for (let i = 0; i < n; i++) { if (r() < .02) v = r(); lines[j * n + i] = v; } }
  const blot = fbm(n, seed + 1, 4), dent = fbm(n, seed + 2, 16, 3);
  const col = fill(n, (i, j) => { const k = j * n + i, v = .93 + lines[k] * .035 + blot[k] * .04, p = patina ? Math.max(0, blot[k] - .72) * 1.4 : 0; return [tint[0] * v * (1 - p * .55), tint[1] * v * (1 - p * .25), tint[2] * v * (1 - p * .1)]; });
  scratches(col.x, n, seed + 3, 50, 'rgba(255,250,235,.25)', .6);
  const h = new Float32Array(n * n); for (let k = 0; k < h.length; k++) h[k] = lines[k] * .15 + dent[k] * .35;
  const rough = fill(n, (i, j) => { const k = j * n + i, v = 75 + lines[k] * 18 + (patina ? Math.max(0, blot[k] - .65) * 200 : blot[k] * 20); return [v, v, v]; });
  return {map: tex(col.c, true), normalMap: tex(normalFrom(h, n, .35), false), roughnessMap: tex(rough.c, false)};
}
/** aged iron: near-black brown steel, orange rust blooms and streaks, pitting, worn bright edges */
function rusty(n: number): Set {
  const big = fbm(n, 71, 8), mid = fbm(n, 72, 24, 4), fine = fbm(n, 73, 64, 3), streak = fbm(n, 74, 10, 3);
  const col = fill(n, (i, j) => { const k = j * n + i, rust = Math.max(0, mid[k] * .7 + big[k] * .5 - .78) * 2.2 + Math.max(0, streak[k] - .78) * (j / n) * 1.0, dark = .42 + fine[k] * .22 + big[k] * .14;
    const r = Math.min(1, rust); return [ (62 * dark) * (1 - r) + 150 * r * (.7 + fine[k] * .3), (48 * dark) * (1 - r) + 72 * r * (.7 + fine[k] * .3), (40 * dark) * (1 - r) + 34 * r ]; });
  scratches(col.x, n, 75, 60, 'rgba(190,160,120,.25)', .7);
  const h = new Float32Array(n * n); for (let k = 0; k < h.length; k++) h[k] = fine[k] * .5 + mid[k] * .5;
  const rough = fill(n, (i, j) => { const k = j * n + i, v = 150 + mid[k] * 70 - fine[k] * 30; return [v, v, v]; }); scratches(rough.x, n, 75, 60, 'rgba(80,80,80,.9)', .7);
  return {map: tex(col.c, true), normalMap: tex(normalFrom(h, n, .9), false), roughnessMap: tex(rough.c, false)};
}
function bakelite(n: number): Set {
  const f = fbm(n, 31, 24, 3), b = fbm(n, 32, 4);
  const col = fill(n, (i, j) => { const k = j * n + i, v = 18 + f[k] * 10 + b[k] * 6; return [v + 4, v + 2, v]; });
  const h = new Float32Array(n * n); for (let k = 0; k < h.length; k++) h[k] = f[k];
  const rough = fill(n, (i, j) => { const v = 90 + b[j * n + i] * 60; return [v, v, v]; });
  return {map: tex(col.c, true), normalMap: tex(normalFrom(h, n, .8), false), roughnessMap: tex(rough.c, false)};
}
function get(kind: string, quality: string) {
  const n = quality === 'HIGH' ? 512 : quality === 'MEDIUM' ? 384 : 256, key = kind + n; let s = cache.get(key); if (s) return s;
  s = kind === 'rust' ? rusty(n) : kind === 'bronze' ? brushed(n, 81, [150, 104, 58], true) : kind === 'paint' ? painted(n) : kind === 'steel' ? brushed(n, 41, [190, 194, 196], false) : kind === 'brass' ? brushed(n, 51, [214, 170, 98], true) : kind === 'copper' ? brushed(n, 61, [200, 120, 78], true) : bakelite(n);
  cache.set(key, s); return s;
}

/** material factory: realistic PBR surfaces built from the generated sets */
export function lcMaterials(quality: string, custom = false) {
  const mk = (kind: string, o: T.MeshPhysicalMaterialParameters) => { const s = get(kind, quality); const m = new T.MeshPhysicalMaterial({...s, ...o}); m.normalScale.setScalar(o.normalScale ? (o.normalScale as any).x : 1); if (custom) m.userData.lcCustom = true; return m; };
  return {
    paint: mk('rust', {color: '#ffffff', metalness: .7, roughness: 1}),
    paintDark: mk('rust', {color: '#8a7f78', metalness: .75, roughness: 1}),
    bronze: mk('bronze', {color: '#ffffff', metalness: 1, roughness: 1}),
    steel: mk('steel', {color: '#ffffff', metalness: 1, roughness: 1}),
    darkSteel: mk('bronze', {color: '#6b5a48', metalness: 1, roughness: 1}),
    brass: mk('brass', {color: '#ffffff', metalness: 1, roughness: 1}),
    copper: mk('copper', {color: '#ffffff', metalness: 1, roughness: 1}),
    bakelite: mk('bakelite', {color: '#ffffff', metalness: 0, roughness: 1, clearcoat: .6, clearcoatRoughness: .2}),
  };
}

/** a stencilled / printed decal as a transparent plane (canvas text and marks, slightly worn) */
export function decal(w: number, h: number, draw: (x: Ctx, W: number, H: number) => void, custom = true, px = 512) {
  const W = px, H = Math.max(16, Math.round(px * h / w)), c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d')!; x.clearRect(0, 0, W, H); draw(x, W, H);
  // wear: knock out flecks of the print
  { const r = rng(W + H); x.globalCompositeOperation = 'destination-out'; for (let i = 0; i < W * H / 260; i++) { x.fillStyle = `rgba(0,0,0,${.3 + r() * .7})`; x.fillRect(r() * W, r() * H, 1 + r() * 2, 1 + r() * 2); } x.globalCompositeOperation = 'source-over'; }
  const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; t.anisotropy = 8;
  const m = new T.MeshStandardMaterial({map: t, transparent: true, roughness: .55, metalness: .1, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2}); if (custom) m.userData.lcCustom = true;
  const mesh = new T.Mesh(new T.PlaneGeometry(w, h), m); mesh.renderOrder = 1; mesh.raycast = () => {}; return mesh;
}
