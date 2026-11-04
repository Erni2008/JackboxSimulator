// THE BROKEN VALVES — shared materials, engraved plates and small helpers for the pressure apparatus.
import * as T from 'three';

export const SERIF = "'IM Fell English SC', Georgia, serif", TECH = "'Oswald', 'Arial Narrow', sans-serif";
export const QUARTER = Math.PI / 2;
export const rng = (s: number) => () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
export const canvasTex = (w: number, h: number, draw: (x: CanvasRenderingContext2D) => void, srgb = true) => { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d')!); const t = new T.CanvasTexture(c); t.colorSpace = srgb ? T.SRGBColorSpace : T.NoColorSpace; t.anisotropy = 16; return t; };

/** one set of materials per machine (shared by every part) */
export function materials() {
  const r = rng(41);
  const iron = new T.MeshStandardMaterial({roughness: .82, metalness: .45, map: canvasTex(512, 512, x => {
    x.fillStyle = '#2b2622'; x.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 2600; i++) { x.fillStyle = `rgba(${r() < .45 ? '120,62,30' : r() < .5 ? '12,10,9' : '80,72,64'},${r() * .22})`; x.beginPath(); x.arc(r() * 512, r() * 512, 1 + r() * (r() < .05 ? 26 : 5), 0, 7); x.fill(); }
    for (let i = 0; i < 14; i++) { const g = x.createLinearGradient(0, 0, 0, 120); g.addColorStop(0, 'rgba(110,52,20,.35)'); g.addColorStop(1, 'rgba(110,52,20,0)'); x.fillStyle = g; x.fillRect(r() * 512, r() * 400, 3 + r() * 8, 60 + r() * 120); }
    for (let i = 0; i < 6; i++) { x.fillStyle = `rgba(8,6,4,${.25 + r() * .25})`; x.beginPath(); x.ellipse(r() * 512, 300 + r() * 200, 20 + r() * 50, 8 + r() * 20, r(), 0, 7); x.fill(); }
  })});
  iron.emissiveMap = iron.map; iron.emissive.set('#ffffff'); iron.emissiveIntensity = .12;
  return {
    iron,
    brass: new T.MeshStandardMaterial({color: '#8d6b36', metalness: .9, roughness: .42}),
    brassDark: new T.MeshStandardMaterial({color: '#5c4422', metalness: .85, roughness: .55}),
    copper: new T.MeshStandardMaterial({color: '#9a5634', metalness: .85, roughness: .48}),
    bolt: new T.MeshStandardMaterial({color: '#2a2622', metalness: .8, roughness: .6}),
    paint: (c: string) => new T.MeshStandardMaterial({color: c, metalness: .35, roughness: .55}),
  };
}
export type Mats = ReturnType<typeof materials>;

/** engraved plate (brass or dark enamel), readable at a glance */
export function plate(text: string, sub: string, w: number, h: number, style: 'brass' | 'enamel' | 'warning') {
  const W = 512, H = Math.max(64, Math.round(512 * h / w)); const t = canvasTex(W, H, x => {
    const g = x.createLinearGradient(0, 0, W, H);
    if (style === 'brass') { g.addColorStop(0, '#9a7640'); g.addColorStop(.5, '#c9a463'); g.addColorStop(1, '#7a5a2c'); } else if (style === 'enamel') { g.addColorStop(0, '#2a0f0a'); g.addColorStop(1, '#170806'); } else { g.addColorStop(0, '#d9a514'); g.addColorStop(1, '#b8870e'); }
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    if (style === 'warning') { x.fillStyle = '#16100a'; for (let i = -H; i < W; i += 46) { x.beginPath(); x.moveTo(i, H); x.lineTo(i + 22, H); x.lineTo(i + 22 + H * .32, H * .68); x.lineTo(i + H * .32, H * .68); x.fill(); x.beginPath(); x.moveTo(i, 0); x.lineTo(i + 22, 0); x.lineTo(i + 22 + H * .32, H * .32); x.lineTo(i + H * .32, H * .32); x.fill(); } }
    x.strokeStyle = style === 'enamel' ? '#c8a060' : 'rgba(40,24,8,.75)'; x.lineWidth = Math.max(4, H * .06); x.strokeRect(H * .08, H * .08, W - H * .16, H - H * .16);
    x.textAlign = 'center'; x.textBaseline = 'middle'; const fs = Math.min(H * (sub ? .4 : .55), W * 1.6 / Math.max(6, text.length));
    if (style === 'warning') { x.fillStyle = 'rgba(217,165,20,.95)'; x.fillRect(W * .04, H * .34, W * .92, H * .32); }
    x.font = `700 ${style === 'warning' ? fs * .62 : fs}px ${SERIF}`; x.fillStyle = style === 'enamel' ? '#ffe9c4' : '#1c1107'; x.fillText(text, W / 2, style === 'warning' ? H * .51 : sub ? H * .4 : H * .53);
    if (sub && style !== 'warning') { x.font = `600 ${H * .2}px ${TECH}`; x.fillStyle = style === 'brass' ? '#2e1d0a' : '#ff8a5c'; x.fillText(sub, W / 2, H * .74); }
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
