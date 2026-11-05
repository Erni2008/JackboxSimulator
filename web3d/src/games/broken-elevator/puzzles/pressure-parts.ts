import {hiCanvas, ctx2d, textTex, SS} from './sharp';
// THE BROKEN VALVES — shared materials, engraved plates and small helpers for the pressure apparatus.
import * as T from 'three';
import {metal, enamel, ironPlate} from './surface';

export const SERIF = "'IM Fell English SC', Georgia, serif", TECH = "'Oswald', 'Arial Narrow', sans-serif";
export const QUARTER = Math.PI / 2;
export const rng = (s: number) => () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
export const canvasTex = (w: number, h: number, draw: (x: CanvasRenderingContext2D) => void, srgb = true) => { const c = hiCanvas(w, h); draw(ctx2d(c)); return textTex(c, srgb); };

/** one set of materials per machine (shared by every part) */
export function materials() {
  // realistic worn metals (procedural scratches / dimples / patina) over the cage's real rusty-iron PBR set
  return {
    iron: ironPlate(1.3),
    brass: metal('#b08a4a', {rough: .42}),
    brassDark: metal('#6e5130', {rough: .55, repeat: 3}),
    copper: metal('#b0623a', {rough: .4, repeat: 3}),
    bolt: metal('#3a3632', {rough: .6, metalness: .85, patina: false, repeat: 4}),
    paint: (c: string) => enamel(c),
  };
}
export type Mats = ReturnType<typeof materials>;

/** engraved plate (brass or dark enamel), readable at a glance */
export function plate(text: string, sub: string, w: number, h: number, style: 'brass' | 'enamel' | 'warning') {
  const W = 640, H = Math.max(80, Math.round(640 * h / w)); const t = canvasTex(W, H, x => {
    const g = x.createLinearGradient(0, 0, W, H);
    if (style === 'brass') { g.addColorStop(0, '#9a7640'); g.addColorStop(.5, '#c9a463'); g.addColorStop(1, '#7a5a2c'); } else if (style === 'enamel') { g.addColorStop(0, '#2a0f0a'); g.addColorStop(1, '#170806'); } else { g.addColorStop(0, '#d9a514'); g.addColorStop(1, '#b8870e'); }
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    if (style === 'warning') { x.fillStyle = '#16100a'; for (let i = -H; i < W; i += 46) { x.beginPath(); x.moveTo(i, H); x.lineTo(i + 22, H); x.lineTo(i + 22 + H * .32, H * .68); x.lineTo(i + H * .32, H * .68); x.fill(); x.beginPath(); x.moveTo(i, 0); x.lineTo(i + 22, 0); x.lineTo(i + 22 + H * .32, H * .32); x.lineTo(i + H * .32, H * .32); x.fill(); } }
    x.strokeStyle = style === 'enamel' ? '#c8a060' : 'rgba(40,24,8,.75)'; x.lineWidth = Math.max(4, H * .06); x.strokeRect(H * .08, H * .08, W - H * .16, H - H * .16);
    x.textAlign = 'center'; x.textBaseline = 'middle'; const fs = Math.min(H * (sub ? .42 : .58), W * 1.6 / Math.max(6, text.length));
    if (style === 'warning') { x.fillStyle = 'rgba(217,165,20,.95)'; x.fillRect(W * .04, H * .34, W * .92, H * .32); }
    let f1 = style === 'warning' ? fs * .62 : fs; x.font = `700 ${f1}px ${SERIF}`; while (x.measureText(text).width > W * (style === 'warning' ? .86 : .88) && f1 > 8) { f1 *= .93; x.font = `700 ${f1}px ${SERIF}`; } /* fit any language */ x.fillStyle = style === 'enamel' ? '#ffe9c4' : '#1c1107'; x.fillText(text, W / 2, style === 'warning' ? H * .51 : sub ? H * .38 : H * .53);
    if (sub && style !== 'warning') { let f2 = H * .27; x.font = `600 ${f2}px ${TECH}`; while (x.measureText(sub).width > W * .88 && f2 > 6) { f2 *= .93; x.font = `600 ${f2}px ${TECH}`; } x.fillStyle = style === 'brass' ? '#2e1d0a' : '#ff8a5c'; x.fillText(sub, W / 2, H * .75); }
  });
  const face = new T.MeshStandardMaterial({map: t, emissiveMap: t, emissive: '#ffffff', emissiveIntensity: .3, metalness: .5, roughness: .45}), edge = new T.MeshStandardMaterial({color: '#6e5129', metalness: .8, roughness: .5});
  return new T.Mesh(new T.BoxGeometry(w, h, .004), [edge, edge, edge, edge, face, edge]);
}

/** a small glass lamp with its own emissive material */
export function lamp(r: number, color: string, mats: Mats) {
  const g = new T.Group(); const m = new T.MeshStandardMaterial({color: '#1a1410', emissive: color, emissiveIntensity: 0, roughness: .25});
  const bulb = new T.Mesh(new T.SphereGeometry(r, 16, 10), m); g.add(bulb);
  const ring = new T.Mesh(new T.TorusGeometry(r * 1.2, r * .22, 8, 24), mats.brass); ring.position.z = -r * .2; g.add(ring);
  return {group: g, mat: m};
}
