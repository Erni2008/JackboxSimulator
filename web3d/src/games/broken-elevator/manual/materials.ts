// PBR material authoring. Photographic CC0 leather / rusted steel scans (Poly Haven)
// are the base; wear, cracks, oil, gilt tooling and patina are composited on top
// at load time so every map stays physically consistent (albedo/normal/ORM).
import * as T from 'three';
import {rng} from './page-art';
import {loadBaked, register} from './baked';

export const TEX = 'textures/';

async function image(url: string) { const r = await fetch(url); if (!r.ok) throw new Error(`Missing texture ${url}`); return createImageBitmap(await r.blob()); }
function canvas(w: number, h: number) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
function pixels(src: ImageBitmap, w: number, h: number, tiles: number) {
  const c = canvas(w, h), x = c.getContext('2d', {willReadFrequently: true})!; const tw = w / tiles, th = tw * src.height / src.width;
  for (let ty = 0; ty < h; ty += th) for (let tx = 0; tx < w; tx += tw) x.drawImage(src, tx, ty, tw, th);
  return x.getImageData(0, 0, w, h);
}
function blur(ctx: CanvasRenderingContext2D, px: number) { const c = ctx.canvas, t = canvas(c.width, c.height), tx = t.getContext('2d')!; tx.filter = `blur(${px}px)`; tx.drawImage(c, 0, 0); ctx.clearRect(0, 0, c.width, c.height); ctx.drawImage(t, 0, 0); }

export interface LeatherSources { albedo: ImageBitmap; normal: ImageBitmap; rough: ImageBitmap }
export async function loadLeather(): Promise<LeatherSources> {
  const [albedo, normal, rough] = await Promise.all(['brown_leather_albedo_1k.jpg', 'brown_leather_nor_gl_1k.jpg', 'brown_leather_rough_1k.jpg'].map(f => image(TEX + f)));
  return {albedo, normal, rough};
}

export interface LeatherOptions {
  w: number; h: number; seed: number; tiles: number;
  /** draws gilt (white = gilt) and blind tooling (grey = debossed, no gilt) into a height canvas */
  tooling?: (ctx: CanvasRenderingContext2D, w: number, h: number) => void;
  /** extra stitching/edge wear along u=0/u=1 (spine joints) */
  stitches?: boolean; edgeWear?: number;
}

/** Builds albedo, normal and ORM (R=AO, G=roughness, B=metalness) textures for a leather surface. */
/** baked JPEGs when available, otherwise the procedural composite below */
export async function leatherMapsCached(src: () => Promise<LeatherSources>, o: LeatherOptions, aniso: number, key: string) {
  const b = await loadBaked([`${key}-map`, `${key}-normal`, `${key}-orm`], {srgb: [true, false, false], flipY: true, aniso});
  if (b) return {map: b[0], normalMap: b[1], orm: b[2]};
  const m = leatherMaps(await src(), o, aniso); register(`${key}-map`, m.map); register(`${key}-normal`, m.normalMap); register(`${key}-orm`, m.orm); return m;
}
export function leatherMaps(src: LeatherSources, o: LeatherOptions, maxAniso: number) {
  const {w, h} = o, r = rng(o.seed);
  const A = pixels(src.albedo, w, h, o.tiles), N = pixels(src.normal, w, h, o.tiles), R = pixels(src.rough, w, h, o.tiles);
  // --- masks drawn with canvas paths -----------------------------------------------------------
  const tool = canvas(w, h), tc = tool.getContext('2d', {willReadFrequently: true})!; tc.fillStyle = '#000'; tc.fillRect(0, 0, w, h);
  o.tooling?.(tc, w, h); const toolSharp = tc.getImageData(0, 0, w, h); blur(tc, 1.6); const toolH = tc.getImageData(0, 0, w, h);
  const wear = canvas(w, h), wc = wear.getContext('2d', {willReadFrequently: true})!; wc.fillStyle = '#000'; wc.fillRect(0, 0, w, h);
  // cracks: branching random walks, then blurred for the groove profile
  wc.strokeStyle = '#fff'; wc.lineCap = 'round';
  const crack = (x: number, y: number, a: number, len: number, width: number, depth: number) => { wc.lineWidth = width; wc.beginPath(); wc.moveTo(x, y); for (let i = 0; i < len; i++) { a += (r() - .5) * .7; x += Math.cos(a) * 5; y += Math.sin(a) * 5; wc.lineTo(x, y); if (depth < 2 && r() < .04) { wc.stroke(); crack(x, y, a + (r() < .5 ? 1 : -1) * (.6 + r()), len * .4, width * .6, depth + 1); wc.beginPath(); wc.moveTo(x, y); } } wc.stroke(); };
  for (let i = 0; i < 26; i++) crack(r() * w, r() * h, r() * 7, 12 + r() * 40, 1.2 + r() * 1.6, 0);
  // fine crazing concentrated near edges and the spine joint (where leather flexes)
  for (let i = 0; i < 140; i++) { const e = r() < .5, x = e ? (r() < .5 ? r() * w * .12 : w - r() * w * .12) : r() * w, y = e ? r() * h : (r() < .5 ? r() * h * .1 : h - r() * h * .1); crack(x, y, r() * 7, 3 + r() * 8, .8, 2); }
  const crackSharp = wc.getImageData(0, 0, w, h); blur(wc, 1.2); const crackH = wc.getImageData(0, 0, w, h);
  // oil and grime: soft blots + finger smears
  const oil = canvas(w, h), oc = oil.getContext('2d', {willReadFrequently: true})!; oc.fillStyle = '#000'; oc.fillRect(0, 0, w, h);
  for (let i = 0; i < 9; i++) { const x = r() * w, y = r() * h, rad = 20 + r() * 110, g = oc.createRadialGradient(x, y, 0, x, y, rad); g.addColorStop(0, `rgba(255,255,255,${.25 + r() * .5})`); g.addColorStop(.7, `rgba(255,255,255,${.1 + r() * .2})`); g.addColorStop(1, 'rgba(255,255,255,0)'); oc.fillStyle = g; oc.beginPath(); oc.ellipse(x, y, rad, rad * (.5 + r() * .5), r() * 3, 0, 7); oc.fill(); }
  // scratches (light, polished grooves)
  const scr = canvas(w, h), sc = scr.getContext('2d', {willReadFrequently: true})!; sc.fillStyle = '#000'; sc.fillRect(0, 0, w, h); sc.strokeStyle = '#fff';
  for (let i = 0; i < 70; i++) { const x = r() * w, y = r() * h, a = r() * 7, l = 20 + r() * 180; sc.globalAlpha = .25 + r() * .6; sc.lineWidth = .6 + r() * 1.4; sc.beginPath(); sc.moveTo(x, y); sc.quadraticCurveTo(x + Math.cos(a + .2) * l * .5, y + Math.sin(a + .2) * l * .5, x + Math.cos(a) * l, y + Math.sin(a) * l); sc.stroke(); }
  const scratch = sc.getImageData(0, 0, w, h), oilD = oc.getImageData(0, 0, w, h);
  // low-frequency mottling so the cover never looks uniformly tinted
  const mott = canvas(w >> 3, h >> 3), mc = mott.getContext('2d', {willReadFrequently: true})!; const md = mc.createImageData(mott.width, mott.height); for (let i = 0; i < md.data.length; i += 4) { const v = 110 + r() * 50; md.data[i] = md.data[i + 1] = md.data[i + 2] = v; md.data[i + 3] = 255; } mc.putImageData(md, 0, 0); const big = canvas(w, h), bc = big.getContext('2d', {willReadFrequently: true})!; bc.filter = 'blur(18px)'; bc.drawImage(mott, 0, 0, w, h); const mottle = bc.getImageData(0, 0, w, h);

  const outA = new ImageData(w, h), outN = new ImageData(w, h), outO = new ImageData(w, h), ew = o.edgeWear ?? 1;
  const at = (d: ImageData, x: number, y: number) => d.data[((Math.min(h - 1, Math.max(0, y)) * w) + Math.min(w - 1, Math.max(0, x))) * 4] / 255;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = (y * w + x) * 4;
    // distance to edge in pixels -> rubbed edge mask (corners rub hardest)
    const dx = Math.min(x, w - 1 - x), dy = Math.min(y, h - 1 - y), de = Math.min(dx, dy), corner = Math.max(0, 1 - Math.hypot(Math.max(0, 90 - dx), Math.max(0, 90 - dy)) / -90 * -1);
    const edge = Math.max(0, 1 - de / (26 + 18 * at(mottle, x, y))) * ew, cornerWear = Math.min(1, Math.max(0, (180 - Math.hypot(dx, dy)) / 180)) * ew * (dx < 120 && dy < 120 ? 1 : 0);
    const rub = Math.min(1, edge * .85 + cornerWear * .6) * (.6 + .4 * Math.sin(x * .05 + y * .031) ** 2);
    const g = at(toolSharp, x, y), crk = at(crackSharp, x, y), o2 = oilD.data[i] / 255, s = scratch.data[i] / 255, m = at(mottle, x, y) / .53;
    const gilt = g > .7 ? 1 : 0, blind = g > .2 && g <= .7 ? 1 : 0;
    // gold leaf flaked by wear: keep it only where a hashed noise survives
    const flake = gilt && ((Math.sin(x * 12.9898 + y * 78.233) * 43758.5453) % 1 + 1) % 1 > .22 + rub * .6 ? 1 : 0;
    let cr = A.data[i], cg = A.data[i + 1], cb = A.data[i + 2];
    // darken the scan to an aged, oiled brown and add mottling
    const lum = (cr * .3 + cg * .59 + cb * .11) / 255; cr = (36 + lum * 58) * m; cg = (21 + lum * 34) * m; cb = (13 + lum * 18) * m;
    if (blind) { cr *= .62; cg *= .6; cb *= .58; }
    // rubbed edges: top grain worn off, lighter suede-tan with less saturation
    cr += (104 - cr) * rub * .5; cg += (74 - cg) * rub * .45; cb += (50 - cb) * rub * .4;
    cr += 70 * s * (1 - rub); cg += 52 * s * (1 - rub); cb += 36 * s * (1 - rub);
    cr *= 1 - o2 * .38; cg *= 1 - o2 * .42; cb *= 1 - o2 * .45;
    cr *= 1 - crk * .65; cg *= 1 - crk * .68; cb *= 1 - crk * .7;
    if (flake) { cr = 168 * (.8 + .2 * lum); cg = 128 * (.8 + .2 * lum); cb = 62 * (.8 + .2 * lum); }
    outA.data[i] = cr; outA.data[i + 1] = cg; outA.data[i + 2] = cb; outA.data[i + 3] = 255;
    // normal: scanned grain + height gradients of tooling (debossed) and cracks (grooves)
    const hx = (at(toolH, x + 1, y) - at(toolH, x - 1, y)) * 2.2 + (at(crackH, x + 1, y) - at(crackH, x - 1, y)) * 1.8;
    const hy = (at(toolH, x, y + 1) - at(toolH, x, y - 1)) * 2.2 + (at(crackH, x, y + 1) - at(crackH, x, y - 1)) * 1.8;
    const grain = 1 - rub * .55 - flake * .8; let nx = (N.data[i] / 255 * 2 - 1) * grain + hx, ny = (N.data[i + 1] / 255 * 2 - 1) * grain - hy, nz = N.data[i + 2] / 255 * 2 - 1;
    const len = Math.hypot(nx, ny, nz) || 1; outN.data[i] = (nx / len * .5 + .5) * 255; outN.data[i + 1] = (ny / len * .5 + .5) * 255; outN.data[i + 2] = (nz / len * .5 + .5) * 255; outN.data[i + 3] = 255;
    // ORM
    const baseR = .5 + R.data[i] / 255 * .32;
    let rough = baseR - o2 * .3 - rub * .16 - s * .1 + crk * .2; if (flake) rough = .38 + rub * .2;
    outO.data[i] = 255 * (1 - crk * .55 - blind * .2); outO.data[i + 1] = 255 * Math.min(1, Math.max(.18, rough)); outO.data[i + 2] = flake ? 230 : 0; outO.data[i + 3] = 255;
  }
  const tex = (d: ImageData, srgb: boolean) => { const c = canvas(w, h); c.getContext('2d')!.putImageData(d, 0, 0); const t = new T.CanvasTexture(c); t.colorSpace = srgb ? T.SRGBColorSpace : T.NoColorSpace; t.anisotropy = maxAniso; t.generateMipmaps = true; t.minFilter = T.LinearMipmapLinearFilter; t.needsUpdate = true; return t; };
  return {map: tex(outA, true), normalMap: tex(outN, false), orm: tex(outO, false)};
}

export function leatherMaterial(maps: ReturnType<typeof leatherMaps>) {
  return new T.MeshPhysicalMaterial({map: maps.map, normalMap: maps.normalMap, normalScale: new T.Vector2(1.15, 1.15), roughnessMap: maps.orm, metalnessMap: maps.orm, aoMap: maps.orm, aoMapIntensity: .9, roughness: 1, metalness: 1,
    sheen: .35, sheenRoughness: .55, sheenColor: new T.Color('#6b4a32'), clearcoat: .12, clearcoatRoughness: .55, envMapIntensity: .8});
}

/** Aged brass: warm metal with darkened recesses, green-brown verdigris and polished high points. */
export function brassMaterial(maxAniso: number) {
  const s = 512, c = canvas(s, s), x = c.getContext('2d', {willReadFrequently: true})!, r = rng(4242);
  const col = x.createImageData(s, s), orm = x.createImageData(s, s);
  const noise = canvas(s, s), nx = noise.getContext('2d', {willReadFrequently: true})!; for (let i = 0; i < 220; i++) { const px = r() * s, py = r() * s, rad = 6 + r() * 60, g = nx.createRadialGradient(px, py, 0, px, py, rad); g.addColorStop(0, `rgba(255,255,255,${r() * .7})`); g.addColorStop(1, 'rgba(255,255,255,0)'); nx.fillStyle = g; nx.fillRect(px - rad, py - rad, rad * 2, rad * 2); }
  const n = nx.getImageData(0, 0, s, s);
  for (let i = 0; i < s * s * 4; i += 4) {
    const p = n.data[i + 3] / 255 * (n.data[i] / 255), fine = r();
    const patina = Math.max(0, p - .35) * 1.6, tarnish = Math.min(1, p * 1.2);
    let cr = 198 - tarnish * 70, cg = 154 - tarnish * 58, cb = 86 - tarnish * 36;
    cr += (78 - cr) * patina; cg += (104 - cg) * patina; cb += (78 - cb) * patina; cr += fine * 10; cg += fine * 8;
    col.data[i] = cr; col.data[i + 1] = cg; col.data[i + 2] = cb; col.data[i + 3] = 255;
    orm.data[i] = 255 * (1 - patina * .35); orm.data[i + 1] = 255 * Math.min(1, .26 + tarnish * .3 + patina * .4 + fine * .08); orm.data[i + 2] = 255 * (1 - patina * .85); orm.data[i + 3] = 255;
  }
  const t = (d: ImageData, srgb: boolean) => { const cc = canvas(s, s); cc.getContext('2d')!.putImageData(d, 0, 0); const tex = new T.CanvasTexture(cc); tex.colorSpace = srgb ? T.SRGBColorSpace : T.NoColorSpace; tex.wrapS = tex.wrapT = T.RepeatWrapping; tex.repeat.set(24, 24); tex.anisotropy = maxAniso; return tex; };
  const ormT = t(orm, false);
  return new T.MeshPhysicalMaterial({map: t(col, true), roughnessMap: ormT, metalnessMap: ormT, aoMap: ormT, roughness: 1, metalness: 1, envMapIntensity: 1.1, clearcoat: 0});
}

/** Marbled endpaper (Victorian pastedown) for the inside of the boards. */
export function endpaperTexture(seed: number) {
  const w = 512, h = 704, c = canvas(w, h), x = c.getContext('2d')!, r = rng(seed);
  x.fillStyle = '#5b2a20'; x.fillRect(0, 0, w, h);
  const colors = ['#1f3346', '#8a6a3b', '#2b1a14', '#6f2f22', '#c9b68a'];
  for (let i = 0; i < 900; i++) { const px = r() * w, py = r() * h, rad = 4 + r() * 26; x.fillStyle = colors[Math.floor(r() * colors.length)]; x.globalAlpha = .55; x.beginPath(); x.ellipse(px, py, rad, rad * (.5 + r()), r() * 3, 0, 7); x.fill(); }
  // comb-drag the stones into the classic nonpareil swirl
  const img = x.getImageData(0, 0, w, h), out = x.createImageData(w, h);
  for (let y = 0; y < h; y++) for (let px = 0; px < w; px++) { const sx = Math.round(px + Math.sin(y * .045) * 18 + Math.sin(y * .011 + px * .02) * 10), sy = Math.round(y + Math.sin(px * .06) * 8); const si = (Math.min(h - 1, Math.max(0, sy)) * w + ((sx % w) + w) % w) * 4, di = (y * w + px) * 4; out.data[di] = img.data[si] * .82; out.data[di + 1] = img.data[si + 1] * .8; out.data[di + 2] = img.data[si + 2] * .78; out.data[di + 3] = 255; }
  x.putImageData(out, 0, 0); const g = x.createLinearGradient(0, 0, w, 0); g.addColorStop(0, 'rgba(40,20,10,.45)'); g.addColorStop(.15, 'rgba(40,20,10,0)'); x.globalAlpha = 1; x.fillStyle = g; x.fillRect(0, 0, w, h);
  const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; return t;
}

/** Front-cover tooling: double fillet frame, corner fleurons, gilt title. Coordinates are canvas px. */
export function frontTooling(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const m = w * .07; ctx.strokeStyle = '#888'; ctx.lineWidth = 7; ctx.strokeRect(m, m, w - m * 2, h - m * 2); ctx.lineWidth = 3; ctx.strokeRect(m + 18, m + 18, w - m * 2 - 36, h - m * 2 - 36);
  ctx.strokeStyle = '#fff'; ctx.lineWidth = 3.5; ctx.strokeRect(m + 34, m + 34, w - m * 2 - 68, h - m * 2 - 68);
  ctx.fillStyle = '#fff'; ctx.textAlign = 'center';
  ctx.font = `${w * .052}px 'IM Fell English SC', serif`; ctx.fillText('THE', w / 2, h * .27);
  ctx.font = `${w * .105}px 'IM Fell DW Pica', serif`; ctx.fillText('ENGINEER’S', w / 2, h * .36); ctx.fillText('MANUAL', w / 2, h * .45);
  ctx.lineWidth = 3; ctx.strokeStyle = '#fff'; ctx.beginPath(); ctx.moveTo(w * .3, h * .5); ctx.lineTo(w * .7, h * .5); ctx.stroke();
  ctx.font = `${w * .036}px 'IM Fell English', serif`; ctx.fillText('Hartwell Lift & Hoist Co.', w / 2, h * .545);
  // blind-tooled cog medallion
  ctx.save(); ctx.translate(w / 2, h * .7); ctx.strokeStyle = '#888'; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(0, 0, w * .11, 0, 7); ctx.stroke(); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, 0, w * .085, 0, 7); ctx.stroke();
  ctx.fillStyle = '#888'; for (let i = 0; i < 20; i++) { ctx.save(); ctx.rotate(i / 20 * Math.PI * 2); ctx.fillRect(-6, -w * .135, 12, w * .024); ctx.restore(); }
  ctx.fillStyle = '#fff'; ctx.font = `${w * .06}px 'IM Fell DW Pica', serif`; ctx.fillText('VII', 0, w * .02); ctx.restore();
  for (const [cx, cy] of [[m + 70, m + 70], [w - m - 70, m + 70], [m + 70, h - m - 70], [w - m - 70, h - m - 70]]) { ctx.save(); ctx.translate(cx, cy); ctx.fillStyle = '#888'; for (let i = 0; i < 4; i++) { ctx.rotate(Math.PI / 2); ctx.beginPath(); ctx.ellipse(0, -14, 6, 14, 0, 0, 7); ctx.fill(); } ctx.restore(); }
}

export function backTooling(ctx: CanvasRenderingContext2D, w: number, h: number) { const m = w * .07; ctx.strokeStyle = '#888'; ctx.lineWidth = 6; ctx.strokeRect(m, m, w - m * 2, h - m * 2); ctx.lineWidth = 2.5; ctx.strokeRect(m + 18, m + 18, w - m * 2 - 36, h - m * 2 - 36); }

/** Spine: u runs across the rounded back (0 = back-board joint, 1 = front-board joint), v along the height. */
export function spineTooling(bands: number[]) {
  return (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.fillStyle = '#fff'; ctx.strokeStyle = '#fff';
    for (const b of bands) { const y = b * h; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(w * .12, y - 22); ctx.lineTo(w * .88, y - 22); ctx.moveTo(w * .12, y + 22); ctx.lineTo(w * .88, y + 22); ctx.stroke(); }
    ctx.save(); ctx.translate(w / 2, h * .36); ctx.rotate(Math.PI / 2); ctx.font = `${w * .2}px 'IM Fell DW Pica', serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('ENGINEER’S MANUAL', 0, 0); ctx.restore();
    ctx.save(); ctx.translate(w / 2, h * .72); ctx.font = `${w * .2}px 'IM Fell DW Pica', serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('VII', 0, 0); ctx.restore();
    // stitched joints: blind-tooled holes along both hinges
    ctx.fillStyle = '#888'; for (let y = 16; y < h; y += 26) { for (const u of [.05, .95]) { ctx.beginPath(); ctx.ellipse(u * w, y, 3.2, 8, 0, 0, 7); ctx.fill(); } }
  };
}
