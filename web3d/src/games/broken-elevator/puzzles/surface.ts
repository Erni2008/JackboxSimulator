// Shared surface realism for the repair machines (wire panel, broken valves, unstable formula).
// Procedural PBR detail, generated once per page and shared by every material:
//   · height -> normal map: fine scratches, hammer dimples, pitting, a few deep gouges
//   · roughness map: polished touch spots vs. dull grime, finger smudges, edge wear
//   · patina albedo: tarnish blotches and verdigris in a few crevices (multiplied over the metal colour)
// plus the cage's real rusty-metal PBR set for backplates, contact-shadow decals, and a shadow pass helper.
import * as T from 'three';
import {TEX} from '../manual/materials';

const rng = (s: number) => () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
let cache: {normal: T.Texture; rough: T.Texture; patina: T.Texture; rust: {map: T.Texture; normalMap: T.Texture; roughnessMap: T.Texture}; ao: T.Texture} | null = null;

function canvas(n: number) { const c = document.createElement('canvas'); c.width = c.height = n; return c; }
function tex(c: HTMLCanvasElement, srgb: boolean, repeat = 1) { const t = new T.CanvasTexture(c); t.colorSpace = srgb ? T.SRGBColorSpace : T.NoColorSpace; t.wrapS = t.wrapT = T.RepeatWrapping; t.repeat.set(repeat, repeat); t.anisotropy = 8; return t; }

function build() {
  const N = 512, r = rng(97);
  // ---- height field
  const h = canvas(N), hx = h.getContext('2d', {willReadFrequently: true})!; hx.fillStyle = '#808080'; hx.fillRect(0, 0, N, N);
  for (let i = 0; i < 260; i++) { const x = r() * N, y = r() * N, rad = 3 + r() * 9; const g = hx.createRadialGradient(x, y, 0, x, y, rad); g.addColorStop(0, `rgba(0,0,0,${.12 + r() * .12})`); g.addColorStop(1, 'rgba(0,0,0,0)'); hx.fillStyle = g; hx.fillRect(x - rad, y - rad, rad * 2, rad * 2); } // hammer dimples
  for (let i = 0; i < 900; i++) { hx.fillStyle = `rgba(0,0,0,${r() * .5})`; hx.fillRect(r() * N, r() * N, 1 + r() * 1.5, 1 + r() * 1.5); } // pits
  hx.lineCap = 'round'; for (let i = 0; i < 160; i++) { const x = r() * N, y = r() * N, a = r() * 7, l = 10 + r() * 90; hx.strokeStyle = `rgba(${r() < .5 ? '0,0,0' : '255,255,255'},${.15 + r() * .3})`; hx.lineWidth = .6 + r() * .9; hx.beginPath(); hx.moveTo(x, y); hx.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); hx.stroke(); } // scratches
  for (let i = 0; i < 5; i++) { const x = r() * N, y = r() * N, a = r() * 7; hx.strokeStyle = 'rgba(0,0,0,.55)'; hx.lineWidth = 2.5; hx.beginPath(); hx.moveTo(x, y); hx.quadraticCurveTo(x + 30, y + 10, x + Math.cos(a) * 120, y + Math.sin(a) * 120); hx.stroke(); } // gouges
  const hd = hx.getImageData(0, 0, N, N).data, nc = canvas(N), nx = nc.getContext('2d')!, nd = nx.createImageData(N, N), H = (x: number, y: number) => hd[(((y + N) % N) * N + ((x + N) % N)) * 4] / 255;
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { const dx = (H(x - 1, y) - H(x + 1, y)) * 3.2, dy = (H(x, y - 1) - H(x, y + 1)) * 3.2, l = Math.hypot(dx, dy, 1), i = (y * N + x) * 4;
    nd.data[i] = (dx / l * .5 + .5) * 255; nd.data[i + 1] = (dy / l * .5 + .5) * 255; nd.data[i + 2] = (1 / l * .5 + .5) * 255; nd.data[i + 3] = 255; }
  nx.putImageData(nd, 0, 0);
  // ---- roughness: grime blotches, polished touch spots, smudges
  const rc = canvas(N), rx = rc.getContext('2d')!; rx.fillStyle = '#8a8a8a'; rx.fillRect(0, 0, N, N);
  for (let i = 0; i < 40; i++) { const x = r() * N, y = r() * N, rad = 20 + r() * 90, g = rx.createRadialGradient(x, y, 0, x, y, rad); const v = r() < .55 ? 200 : 70; g.addColorStop(0, `rgba(${v},${v},${v},${.25 + r() * .3})`); g.addColorStop(1, `rgba(${v},${v},${v},0)`); rx.fillStyle = g; rx.fillRect(x - rad, y - rad, rad * 2, rad * 2); }
  for (let i = 0; i < 14; i++) { const x = r() * N, y = r() * N; rx.fillStyle = 'rgba(50,50,50,.35)'; rx.beginPath(); rx.ellipse(x, y, 6 + r() * 6, 9 + r() * 8, r() * 3, 0, 7); rx.fill(); } // finger smudges (oily = glossier)
  for (let i = 0; i < 2000; i++) { const v = 100 + r() * 120; rx.fillStyle = `rgba(${v},${v},${v},.25)`; rx.fillRect(r() * N, r() * N, 1, 1); }
  // ---- patina (multiplied over the metal colour): tarnish clouds + a few verdigris specks
  const pc = canvas(N), px = pc.getContext('2d')!; px.fillStyle = '#ffffff'; px.fillRect(0, 0, N, N);
  for (let i = 0; i < 26; i++) { const x = r() * N, y = r() * N, rad = 30 + r() * 120, g = px.createRadialGradient(x, y, 0, x, y, rad); g.addColorStop(0, `rgba(70,55,40,${.1 + r() * .14})`); g.addColorStop(1, 'rgba(70,55,40,0)'); px.fillStyle = g; px.fillRect(x - rad, y - rad, rad * 2, rad * 2); }
  for (let i = 0; i < 18; i++) { const x = r() * N, y = r() * N, rad = 4 + r() * 16, g = px.createRadialGradient(x, y, 0, x, y, rad); g.addColorStop(0, 'rgba(70,140,110,.3)'); g.addColorStop(1, 'rgba(70,140,110,0)'); px.fillStyle = g; px.fillRect(x - rad, y - rad, rad * 2, rad * 2); }
  // ---- contact shadow decal
  const ac = canvas(128), ax = ac.getContext('2d')!, ag = ax.createRadialGradient(64, 64, 6, 64, 64, 64); ag.addColorStop(0, 'rgba(0,0,0,.72)'); ag.addColorStop(.55, 'rgba(0,0,0,.35)'); ag.addColorStop(1, 'rgba(0,0,0,0)'); ax.fillStyle = ag; ax.fillRect(0, 0, 128, 128);
  // ---- the cage's real rusty metal set
  const L = new T.TextureLoader(), load = (f: string, srgb: boolean) => { const t = L.load(TEX + f); t.colorSpace = srgb ? T.SRGBColorSpace : T.NoColorSpace; t.wrapS = t.wrapT = T.RepeatWrapping; t.anisotropy = 8; return t; };
  cache = {normal: tex(nc, false), rough: tex(rc, false), patina: tex(pc, true), ao: new T.CanvasTexture(ac),
    rust: {map: load('rusty_metal_05_diff_1k.jpg', true), normalMap: load('rusty_metal_05_nor_gl_1k.jpg', false), roughnessMap: load('rusty_metal_05_rough_1k.jpg', false)}};
  return cache;
}
const maps = () => cache || build();

/** worn machined metal (brass, copper, dark steel) with scratches, dimples, smudges and patina */
export function metal(color: string, o: {rough?: number; metalness?: number; repeat?: number; normal?: number; patina?: boolean; clearcoat?: number} = {}) {
  const m = maps(), rep = o.repeat ?? 2, clone = (t: T.Texture) => { const c = t.clone(); c.needsUpdate = true; c.repeat.set(rep, rep); return c; };
  return new T.MeshPhysicalMaterial({color, metalness: o.metalness ?? .95, roughness: o.rough ?? .5, roughnessMap: clone(m.rough), normalMap: clone(m.normal), normalScale: new T.Vector2(o.normal ?? .35, o.normal ?? .35),
    map: o.patina === false ? null : clone(m.patina), clearcoat: o.clearcoat ?? .08, clearcoatRoughness: .5, envMapIntensity: 1.05});
}
/** painted metal (wheel rims, levers): chipped satin enamel over steel */
export function enamel(color: string) { const m = metal(color, {metalness: .2, rough: .5, normal: .18, repeat: 3, patina: false}); m.clearcoat = .35; m.clearcoatRoughness = .35; return m; }
/** heavy riveted iron backplate using the cage's rusty-metal PBR set */
export function ironPlate(repeat = 1.4, tint = '#6a625a') {
  const r = maps().rust, c = (t: T.Texture) => { const x = t.clone(); x.needsUpdate = true; x.repeat.set(repeat, repeat); return x; };
  return new T.MeshStandardMaterial({color: tint, map: c(r.map), normalMap: c(r.normalMap), roughnessMap: c(r.roughnessMap), metalness: .55, roughness: .95, normalScale: new T.Vector2(.9, .9), envMapIntensity: .55});
}
/** soft contact shadow behind a part, laid on the backplate (local x/y, size w×h) */
export function contactShadow(x: number, y: number, w: number, h: number, z = .0235, strength = .8) {
  const m = new T.Mesh(new T.PlaneGeometry(w, h), new T.MeshBasicMaterial({map: maps().ao, transparent: true, opacity: strength, depthWrite: false, toneMapped: false})); m.position.set(x, y, z); m.renderOrder = 0; return m;
}
/** every opaque mesh of a machine casts and receives shadows (glass, liquid, particles excluded) */
export function enableShadows(root: T.Object3D) {
  root.traverse(o => { const m = o as T.Mesh; if (!m.isMesh) return; const mats = Array.isArray(m.material) ? m.material : [m.material];
    const opaque = mats.every(x => !x.transparent && !(x as any).isShaderMaterial && (x as any).visible !== false); m.castShadow = opaque; m.receiveShadow = opaque; });
}
