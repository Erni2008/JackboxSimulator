// THE LAST COMMAND — the control unit's cabinet, built in code (replaces the scanned computer.glb).
// Every surface the controls mount on keeps the old position (measured from the old model):
//   front facade z .143 (buttons z≈.179, big button base .14, code panel .175, nameplate .1495),
//   screen window centred (-.003,.495) .278×.165 recessed to z .114, tube lamps at x -.264 / .253 y .493,
//   sides x -.276 / .289 (lever on the left at y .32, the hatch on the right at y .235 z -.05),
//   back z -.25 (card tray and panels at z ≈ -.27, back hatch y .38), top ≈ .75 with stacks to .83.
// About 12k triangles, one small generated texture: light on phones.
import * as T from 'three';
import {RoundedBoxGeometry} from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import type {PowerLighting} from './power-lighting';
import {bakeByMaterial} from './bake';
import {lcMaterials, decal} from './lc-materials';

const rng = (seed: number) => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };

/** painted steel: a soft mottled coat, fine scratches and grime, tileable */
function paintTexture() {
  const W = 256, cv = document.createElement('canvas'); cv.width = cv.height = W; const x = cv.getContext('2d')!, r = rng(7);
  x.fillStyle = '#9aa39c'; x.fillRect(0, 0, W, W);
  for (let i = 0; i < 260; i++) { const gx = r() * W, gy = r() * W, gr = 6 + r() * 30, g = x.createRadialGradient(gx, gy, 0, gx, gy, gr), v = 120 + Math.floor(r() * 70);
    g.addColorStop(0, `rgba(${v},${v + 6},${v},${.12 + r() * .12})`); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.fillRect(gx - gr, gy - gr, gr * 2, gr * 2); }
  x.strokeStyle = 'rgba(230,235,228,.22)'; x.lineWidth = .6; for (let i = 0; i < 60; i++) { const sx = r() * W, sy = r() * W, a = r() * 7, l = 4 + r() * 22; x.beginPath(); x.moveTo(sx, sy); x.lineTo(sx + Math.cos(a) * l, sy + Math.sin(a) * l); x.stroke(); }
  for (let i = 0; i < 900; i++) { const v = 60 + Math.floor(r() * 80); x.fillStyle = `rgba(${v},${v},${v},${.12 + r() * .2})`; x.fillRect(r() * W, r() * W, 1, 1); }
  const t = new T.CanvasTexture(cv); t.wrapS = t.wrapT = T.RepeatWrapping; t.colorSpace = T.SRGBColorSpace; t.anisotropy = 4; return t;
}

export function buildComputer(power: PowerLighting, quality: string) {
  const hi = quality === 'HIGH', seg = hi ? 24 : quality === 'MEDIUM' ? 18 : 12;
  const root = new T.Group(); root.name = 'lc-cabinet';
  const tex = null;
  const mark = <M extends T.Material>(m: M) => { m.userData.lcCustom = true; return m; };
  const L = lcMaterials(quality, true), paint = L.paint, paintDark = L.paintDark, brass = L.brass, copper = L.copper, steel = L.steel, trim = L.darkSteel; void tex;
  const black = mark(new T.MeshStandardMaterial({color: '#0b0d0d', metalness: .3, roughness: .7}));
  const rubber = mark(new T.MeshStandardMaterial({color: '#141615', metalness: 0, roughness: .9}));
  // the two tube lamps glow with the machine's power (same uniforms the old body used)
  const tube = mark(new T.MeshStandardMaterial({color: '#2a1608', emissive: '#ffffff', emissiveIntensity: 1, roughness: .12, metalness: 0, transparent: true, opacity: .92}));
  tube.onBeforeCompile = s => { s.uniforms.lcPowerColor = power.lampColor; s.uniforms.lcPowerStrength = power.lampPower;
    s.fragmentShader = 'uniform vec3 lcPowerColor;uniform float lcPowerStrength;\n' + s.fragmentShader.replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\ntotalEmissiveRadiance = lcPowerColor * vec3(1.0, 0.42, 0.16) * lcPowerStrength * 0.42;'); };
  tube.customProgramCacheKey = () => 'lc-cabinet-tube-v2';

  const add = (g: T.BufferGeometry, m: T.Material, x: number, y: number, z: number, rx = 0, ry = 0, rz = 0) => { const o = new T.Mesh(g, m); o.position.set(x, y, z); o.rotation.set(rx, ry, rz); root.add(o); return o; };
  const rbox = (w: number, h: number, d: number, r: number, m: T.Material, x: number, y: number, z: number) => add(new RoundedBoxGeometry(w, h, d, 3, r), m, x, y, z);
  const box = (w: number, h: number, d: number, m: T.Material, x: number, y: number, z: number) => add(new T.BoxGeometry(w, h, d), m, x, y, z);
  const cyl = (r: number, h: number, m: T.Material, x: number, y: number, z: number, axis: 'x' | 'y' | 'z' = 'y', r2 = r) => add(new T.CylinderGeometry(r, r2, h, seg), m, x, y, z, axis === 'z' ? Math.PI / 2 : 0, 0, axis === 'x' ? Math.PI / 2 : 0);

  // plinth with a brass top band and a dark vent strip in front
  rbox(.64, .075, .5, .012, paintDark, .0065, .0375, -.035);
  box(.628, .007, .488, trim, .0065, .078, -.035);
  for (let i = 0; i < 9; i++) box(.05, .012, .004, black, -.24 + i * .06 + .0065, .036, .216);

  // the cabinet core
  const X0 = -.276, X1 = .289, Y0 = .081, Y1 = .715, Z0 = -.25, ZF = .10, cx = (X0 + X1) / 2;
  rbox(X1 - X0, Y1 - Y0, ZF - Z0, .03, paint, cx, (Y0 + Y1) / 2, (Z0 + ZF) / 2);

  // the facade around the screen window, its face at z .143
  const WX0 = -.142, WX1 = .136, WY0 = .4125, WY1 = .5775, FZ = .1215, FD = .043, FX0 = -.272, FX1 = .285, FY0 = .09, FY1 = .705;
  rbox(FX1 - FX0, WY0 - FY0, FD, .014, paint, (FX0 + FX1) / 2, (FY0 + WY0) / 2, FZ);
  rbox(FX1 - FX0, FY1 - WY1, FD, .014, paint, (FX0 + FX1) / 2, (WY1 + FY1) / 2, FZ);
  rbox(WX0 - FX0, WY1 - WY0 + .02, FD, .006, paint, (FX0 + WX0) / 2, (WY0 + WY1) / 2, FZ);
  rbox(FX1 - WX1, WY1 - WY0 + .02, FD, .006, paint, (WX1 + FX1) / 2, (WY0 + WY1) / 2, FZ);
  // the screen tunnel (dark walls between the glass at .114 and the face) and a heavy bezel
  const tw = WX1 - WX0, th = WY1 - WY0, tcx = (WX0 + WX1) / 2, tcy = (WY0 + WY1) / 2;
  box(tw, .002, .03, black, tcx, WY1, .129); box(tw, .002, .03, black, tcx, WY0, .129); box(.002, th, .03, black, WX0, tcy, .129); box(.002, th, .03, black, WX1, tcy, .129);
  const bz = .149, bw = .018;
  rbox(tw + bw * 2, bw, .012, .004, steel, tcx, WY1 + bw / 2, bz); rbox(tw + bw * 2, bw, .012, .004, steel, tcx, WY0 - bw / 2, bz);
  rbox(bw, th, .012, .004, steel, WX0 - bw / 2, tcy, bz); rbox(bw, th, .012, .004, steel, WX1 + bw / 2, tcy, bz);
  for (const [x, y] of [[WX0 - bw / 2, WY0 - bw / 2], [WX1 + bw / 2, WY0 - bw / 2], [WX0 - bw / 2, WY1 + bw / 2], [WX1 + bw / 2, WY1 + bw / 2]]) cyl(.0045, .006, brass, x, y, bz + .007, 'z');

  // the two tube lamps beside the screen: glass, brass caps, a three-rod cage
  for (const lx of [-.264, .253]) {
    const ly = .493, lz = .158; cyl(.0125, .092, tube, lx, ly, lz);
    for (const s of [-1, 1]) { cyl(.017, .012, brass, lx, ly + s * .052, lz); cyl(.012, .006, black, lx, ly + s * .061, lz); }
    for (let k = 0; k < 3; k++) { const a = k / 3 * Math.PI * 2 + .5; cyl(.0012, .1, steel, lx + Math.cos(a) * .016, ly, lz + Math.sin(a) * .016); }
    box(.03, .13, .006, paintDark, lx, ly, .145);
  }

  // a brass frame around the control deck under the screen (open in the middle: the big button sits in the facade)
  for (const [w, h, x, y] of [[.5, .006, -.003, .372], [.5, .006, -.003, .138], [.006, .23, -.255, .255], [.006, .23, .249, .255]] as [number, number, number, number][]) box(w, h, .01, trim, x, y, .149);

  // top: a rounded cap with a brass rim, two exhaust stacks and a pressure gauge
  rbox(.6, .036, .39, .012, paintDark, cx, Y1 + .016, -.075);
  box(.59, .006, .38, trim, cx, Y1 - .002, -.075);
  for (const sx of [-.17, .18]) { cyl(.024, .075, copper, sx, .77, -.15); cyl(.03, .012, brass, sx, .81, -.15); cyl(.028, .006, black, sx, .818, -.15); cyl(.03, .01, brass, sx, .738, -.15); }
  { const g = new T.Group(); g.position.set(.0, .772, -.02); g.rotation.x = -.35; root.add(g);
    const face = new T.Mesh(new T.CylinderGeometry(.034, .034, .012, seg * 2), brass); face.rotation.x = Math.PI / 2; g.add(face);
    const dial = new T.Mesh(new T.CircleGeometry(.029, seg * 2), mark(new T.MeshStandardMaterial({color: '#e8dfc6', roughness: .6}))); dial.position.z = .0062; g.add(dial);
    for (let k = 0; k <= 10; k++) { const a = -2.3 + k * .46, tick = new T.Mesh(new T.BoxGeometry(.0012, k % 5 ? .004 : .007, .001), black); tick.position.set(Math.sin(a) * .024, Math.cos(a) * .024, .0066); tick.rotation.z = -a; g.add(tick); }
    const needle = new T.Mesh(new T.BoxGeometry(.0016, .022, .001), mark(new T.MeshStandardMaterial({color: '#a3241c', roughness: .4}))); needle.geometry.translate(0, .011, 0); needle.position.z = .0072; needle.rotation.z = -.6; g.add(needle); root.userData.needle = needle;
    const stem = new T.Mesh(new T.CylinderGeometry(.006, .006, .03, 12), brass); stem.position.set(0, -.03, -.004); g.add(stem); }

  // louvred vents on the sides (clear of the lever on the left and the hatch on the right)
  const vent = (side: number, y0: number, y1: number, z0: number, z1: number) => {
    const x = side < 0 ? X0 - .004 : X1 + .004, w = z1 - z0, h = y1 - y0, zc = (z0 + z1) / 2, yc = (y0 + y1) / 2;
    box(.006, h + .02, w + .02, trim, x, yc, zc); box(.004, h, w, black, x + side * .001, yc, zc);
    const n = Math.max(3, Math.round(h / .022)); for (let k = 0; k < n; k++) add(new T.BoxGeometry(.012, .004, w - .006), paintDark, x + side * .004, y0 + (k + .5) * h / n, zc, 0, 0, side * .6);
  };
  vent(-1, .45, .64, -.2, .04);

  // the back: two copper risers and a manifold, clear of the card tray, panels and hatch in the middle
  for (const sx of [-.235, .245]) { cyl(.013, .63, copper, sx, .4, Z0 - .016); for (const y of [.15, .4, .65]) cyl(.018, .012, brass, sx, y, Z0 - .016); }
  cyl(.013, .48, copper, .005, .715, Z0 - .016, 'x'); for (const sx of [-.235, .245]) add(new T.SphereGeometry(.017, seg, 8), brass, sx, .715, Z0 - .016);
  // the back: a service panel in a brass frame with rivets (the card tray, panels and back hatch mount in front of it)
  rbox(.42, .58, .008, .006, paint, .005, .4, Z0 - .004);
  for (const [w, h, x, y] of [[.43, .007, .005, .692], [.43, .007, .005, .108], [.007, .58, -.21, .4], [.007, .58, .22, .4]] as [number, number, number, number][]) box(w, h, .008, trim, x, y, Z0 - .008);
  { const pts: [number, number, number][] = []; for (let u = -.19; u <= .2; u += .039) pts.push([u, .68, Z0 - .009], [u, .12, Z0 - .009]); for (let v = .16; v <= .64; v += .048) pts.push([-.198, v, Z0 - .009], [.208, v, Z0 - .009]);
    const rv = new T.InstancedMesh(new T.SphereGeometry(.0034, 8, 5, 0, Math.PI * 2, 0, Math.PI / 2), steel, pts.length), mtx = new T.Matrix4(), q = new T.Quaternion().setFromEuler(new T.Euler(-Math.PI / 2, 0, 0));
    pts.forEach((p, i) => { mtx.compose(new T.Vector3(...p), q, new T.Vector3(1, 1, .6)); rv.setMatrixAt(i, mtx); }); root.add(rv); }
  // a cable bundle down the right back corner
  for (let k = 0; k < 3; k++) cyl(.006, .5, k === 1 ? mark(new T.MeshStandardMaterial({color: '#7a1e17', roughness: .6})) : rubber, X1 - .02 + k * .011, .36, Z0 + .01 - k * .002);

  // front corner trims and a row of rivets along every facade edge (one instanced mesh)
  for (const sx of [FX0 - .002, FX1 + .002]) rbox(.012, FY1 - FY0, .05, .004, trim, sx, (FY0 + FY1) / 2, FZ);
  { const pts: [number, number, number][] = [];
    for (let u = FX0 + .02; u < FX1 - .01; u += .045) { pts.push([u, FY1 - .012, .1445], [u, FY0 + .012, .1445]); }
    for (let v = FY0 + .04; v < FY1 - .03; v += .05) { if (v > WY0 - .02 && v < WY1 + .02) continue; pts.push([FX0 + .012, v, .1445], [FX1 - .012, v, .1445]); }
    for (let u = X0 + .03; u < X1 - .02; u += .05) pts.push([u, Y1 - .01, ZF + .001]);
    const rv = new T.InstancedMesh(new T.SphereGeometry(.0038, 8, 5, 0, Math.PI * 2, 0, Math.PI / 2), steel, pts.length), mtx = new T.Matrix4(), q = new T.Quaternion().setFromEuler(new T.Euler(Math.PI / 2, 0, 0));
    pts.forEach((p, i) => { mtx.compose(new T.Vector3(...p), q, new T.Vector3(1, 1, .6)); rv.setMatrixAt(i, mtx); }); root.add(rv); }

  // amber light strips fed by the machine's power: along the plinth and under the facade
  const led = mark(new T.MeshStandardMaterial({color: '#1a0e04', emissive: '#ffffff', roughness: .3}));
  led.onBeforeCompile = sh => { sh.uniforms.lcPowerColor = power.lampColor; sh.uniforms.lcPowerStrength = power.lampPower; sh.fragmentShader = 'uniform vec3 lcPowerColor;uniform float lcPowerStrength;\n' + sh.fragmentShader.replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\ntotalEmissiveRadiance = lcPowerColor * lcPowerStrength * 0.7;'); };
  led.customProgramCacheKey = () => 'lc-cabinet-led-v1';
  box(.6, .0035, .003, led, .0065, .0705, .2155); box(FX1 - FX0 - .04, .003, .003, led, (FX0 + FX1) / 2, FY0 + .004, .1445);
  for (const sx of [X0 - .0015, X1 + .0015]) box(.003, .0035, .44, led, sx, .0705, -.035);
  // a faint green spill of the screen on the inside of its tunnel
  { const spill = mark(new T.MeshBasicMaterial({color: '#2f6e52', transparent: true, opacity: .35, blending: T.AdditiveBlending, depthWrite: false, toneMapped: false}));
    for (const [w, h, x, y] of [[tw, .0015, tcx, WY1 - .001], [tw, .0015, tcx, WY0 + .001], [.0015, th, WX0 + .001, tcy], [.0015, th, WX1 - .001, tcy]] as number[][]) { const m = box(w, h, .026, spill, x, y, .129); m.userData.keep = true; m.raycast = () => {}; } }
  // milled grooves framing the nameplate zone and the lower facade panels
  { const groove = mark(new T.MeshStandardMaterial({color: '#050606', roughness: .9}));
    const frame = (x0: number, x1: number, y0: number, y1: number) => { box(x1 - x0, .0018, .002, groove, (x0 + x1) / 2, y0, .1441); box(x1 - x0, .0018, .002, groove, (x0 + x1) / 2, y1, .1441); box(.0018, y1 - y0, .002, groove, x0, (y0 + y1) / 2, .1441); box(.0018, y1 - y0, .002, groove, x1, (y0 + y1) / 2, .1441); };
    frame(-.25, .244, .598, .692); frame(FX0 + .016, FX1 - .016, FY0 + .016, .392); }
  // ------------------------------------------------------------------ steampunk dressing (kept clear of every working zone)
  const bronze = L.bronze, lights: {color: number; x: number; y: number; z: number; i: number; d: number}[] = [];
  const glow = (hex: string, k: number) => { const m = mark(new T.MeshStandardMaterial({color: '#120402', emissive: '#ffffff', roughness: .2, metalness: 0})); const c = new T.Color(hex);
    m.onBeforeCompile = sh => { sh.uniforms.lcPowerStrength = power.lampPower; sh.uniforms.lcGlow = {value: c}; sh.fragmentShader = 'uniform float lcPowerStrength;uniform vec3 lcGlow;\n' + sh.fragmentShader.replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>\ntotalEmissiveRadiance = lcGlow * lcPowerStrength * ${k.toFixed(2)};`); };
    m.customProgramCacheKey = () => 'lc-glow-' + hex + k; return m; };
  const red = glow('#ff1a04', .45), amber = glow('#ff6a08', .42), filament = glow('#ffb04a', .9);
  /** a pipe along a polyline with rounded elbows and a flange at every joint */
  const pipe = (pts: number[][], r: number, m: T.Material, flanges = true) => { const v = pts.map(p => new T.Vector3(p[0], p[1], p[2])), path = new T.CurvePath<T.Vector3>();
    for (let i = 0; i < v.length - 1; i++) { const a0 = v[i], a1 = v[i + 1]; if (i < v.length - 2) { const b = v[i + 2], e = Math.min(r * 3, a0.distanceTo(a1) / 2, a1.distanceTo(b) / 2), p1 = a1.clone().addScaledVector(a0.clone().sub(a1).normalize(), e), p2 = a1.clone().addScaledVector(b.clone().sub(a1).normalize(), e);
        path.add(new T.LineCurve3(i ? (path.curves[path.curves.length - 1] as any).v2 ?? a0 : a0, p1)); path.add(new T.QuadraticBezierCurve3(p1, a1, p2)); v[i + 1] = p2; } else path.add(new T.LineCurve3(i ? (path.curves[path.curves.length - 1] as any).v2 ?? a0 : a0, a1)); }
    add(new T.TubeGeometry(path, Math.max(16, pts.length * 14), r, hi ? 14 : 10, false), m, 0, 0, 0);
    if (flanges) for (const p of [pts[0], pts[pts.length - 1]]) { const f = add(new T.CylinderGeometry(r * 1.6, r * 1.6, r * 1.1, 12), bronze, p[0], p[1], p[2]); f.lookAt(new T.Vector3(...p).add(new T.Vector3(0, 1, 0))); } };
  /** a glowing radio valve in a cage: glass bulb with a bright filament, bronze base and cap */
  const valve = (x: number, y: number, z: number, h: number, r: number, glass: T.Material, light = false) => {
    cyl(r * 1.35, h * .14, bronze, x, y + h * .07, z); cyl(r * 1.1, h * .06, black, x, y + h * .17, z);
    add(new T.CylinderGeometry(r, r, h * .62, seg), glass, x, y + h * .51, z); add(new T.SphereGeometry(r, seg, 8, 0, Math.PI * 2, 0, Math.PI / 2), glass, x, y + h * .82, z);
    cyl(r * .16, h * .5, filament, x, y + h * .5, z); cyl(r * 1.3, h * .05, bronze, x, y + h * .9, z); cyl(r * .3, h * .08, bronze, x, y + h * .96, z);
    for (let k = 0; k < 4; k++) { const a = k / 4 * Math.PI * 2 + .4; cyl(r * .07, h * .78, bronze, x + Math.cos(a) * r * 1.25, y + h * .52, z + Math.sin(a) * r * 1.25); }
    for (const yy of [.35, .68]) add(new T.TorusGeometry(r * 1.25, r * .06, 6, seg), bronze, x, y + h * yy, z, Math.PI / 2);
    if (light) lights.push({color: glass === red ? 0xff4a1a : 0xff8a2a, x, y: y + h * .5, z, i: .5, d: .5}); };
  /** a spur gear on an axle */
  const gear = (x: number, y: number, z: number, r: number, teeth: number, axis: 'x' | 'z', m: T.Material) => { const sh = new T.Shape(), n = teeth * 4, ri = r * .84;
    for (let k = 0; k <= n; k++) { const a = k / n * Math.PI * 2, q = k % 4, rr = q === 1 || q === 2 ? r : ri; k ? sh.lineTo(Math.cos(a) * rr, Math.sin(a) * rr) : sh.moveTo(Math.cos(a) * rr, Math.sin(a) * rr); }
    for (let w = 0; w < 5; w++) { const a0 = w / 5 * Math.PI * 2, hole = new T.Path(); hole.absarc(Math.cos(a0) * r * .52, Math.sin(a0) * r * .52, r * .17, 0, Math.PI * 2, true); sh.holes.push(hole); }
    const g = add(new T.ExtrudeGeometry(sh, {depth: r * .16, bevelEnabled: true, bevelSize: r * .03, bevelThickness: r * .03, bevelSegments: 1, curveSegments: 4}), m, x, y, z, 0, axis === 'x' ? Math.PI / 2 : 0, 0);
    cyl(r * .2, r * .4, steel, x, y, z, axis === 'x' ? 'x' : 'z'); return g; };
  /** a valve hand-wheel: rim, five spokes, hub */
  const handwheel = (x: number, y: number, z: number, r: number) => { add(new T.TorusGeometry(r, r * .1, 10, seg * 2), bronze, x, y, z, 0, Math.PI / 2);
    for (let k = 0; k < 5; k++) { const a = k / 5 * Math.PI * 2, sp = add(new T.CylinderGeometry(r * .05, r * .05, r, 8), bronze, x, y + Math.sin(a) * r / 2, z + Math.cos(a) * r / 2); sp.rotation.x = -a; }
    cyl(r * .22, r * .3, steel, x, y, z, 'x'); cyl(r * .12, r * .9, steel, x - r * .4, y, z, 'x'); };
  /** a pressure gauge facing `dir` */
  const gauge = (x: number, y: number, z: number, r: number, ry: number, rx = 0) => { const g = new T.Group(); g.position.set(x, y, z); g.rotation.set(rx, ry, 0); root.add(g);
    const body = new T.Mesh(new T.CylinderGeometry(r, r, r * .45, seg * 2), bronze); body.rotation.x = Math.PI / 2; g.add(body);
    const face = new T.Mesh(new T.CircleGeometry(r * .84, seg * 2), mark(new T.MeshStandardMaterial({color: '#d8ccb0', roughness: .6}))); face.position.z = r * .23; g.add(face);
    for (let k = 0; k <= 8; k++) { const a = -2.2 + k * .55, t = new T.Mesh(new T.BoxGeometry(r * .04, r * (k % 4 ? .12 : .2), r * .02), black); t.position.set(Math.sin(a) * r * .68, Math.cos(a) * r * .68, r * .24); t.rotation.z = -a; g.add(t); }
    const nd = new T.Mesh(new T.BoxGeometry(r * .05, r * .62, r * .02), mark(new T.MeshStandardMaterial({color: '#a3241c'}))); nd.geometry.translate(0, r * .3, 0); nd.position.z = r * .26; nd.rotation.z = -.4 - Math.random() * .8; g.add(nd);
    const ring = new T.Mesh(new T.TorusGeometry(r * .9, r * .09, 8, seg * 2), bronze); ring.position.z = r * .23; g.add(ring); };

  // a heavy riveted frame cage at the corners (posts and brackets), the silhouette of the concept
  for (const [px, pz] of [[X0 - .016, Z0 + .02], [X1 + .016, Z0 + .02], [X0 - .016, ZF - .02], [X1 + .016, ZF - .02]]) { box(.024, Y1 - .07, .024, paintDark, px, (Y1 + .07) / 2, pz); for (const y of [.12, .4, .68]) box(.034, .03, .034, bronze, px, y, pz); }
  // top: two red valve towers at the front corners, an amber pair at the back, a pipe loop joining the stacks
  valve(-.24, .748, .04, .13, .016, red, !hi ? false : true); valve(.255, .748, .04, .13, .016, red, true);
  valve(-.06, .748, -.19, .1, .013, amber); valve(.09, .748, -.19, .1, .013, amber);
  pipe([[-.17, .805, -.15], [-.17, .86, -.15], [.18, .86, -.15], [.18, .805, -.15]], .011, copper);
  pipe([[-.28, .74, -.08], [-.31, .74, -.08], [-.31, .58, -.08]], .009, copper, false);
  // an articulated lamp on top that throws a warm pool onto the machine
  { const bx = -.19, bz = -.05; cyl(.03, .02, bronze, bx, .743, bz); cyl(.008, .14, L.darkSteel, bx, .82, bz); add(new T.SphereGeometry(.012, 12, 8), bronze, bx, .89, bz);
    add(new T.CylinderGeometry(.007, .007, .16, 10), L.darkSteel, bx + .05, .93, bz + .03, 0, 0, -1.0); add(new T.SphereGeometry(.011, 12, 8), bronze, bx + .118, .968, bz + .07);
    const shade = add(new T.ConeGeometry(.04, .05, seg, 1, true), bronze, bx + .14, .94, bz + .1, 2.3, 0, -.5); (shade.material as any).side = T.DoubleSide;
    add(new T.SphereGeometry(.016, 12, 8), filament, bx + .148, .93, bz + .11); lights.push({color: 0xffc27a, x: bx + .15, y: .93, z: bz + .12, i: 1.2, d: .9}); }
  // left side: a tall amber valve at the front corner, gauge pair low, pipes up the back edge
  valve(-.302, .44, .06, .17, .018, amber, true); gauge(X0 - .012, .14, -.08, .028, -Math.PI / 2); gauge(X0 - .012, .14, -.02, .02, -Math.PI / 2);
  pipe([[X0 - .02, .09, -.21], [X0 - .02, .7, -.21], [-.2, .74, -.21]], .012, copper); pipe([[X0 - .03, .1, -.15], [X0 - .03, .42, -.15], [X0 - .03, .42, -.18]], .008, copper, false);
  // right side: the vent gives way to a hand-wheel, a gear train and a gauge (the hatch zone y .22–.35 stays clear)
  handwheel(X1 + .03, .52, -.06, .065); gear(X1 + .012, .64, -.17, .045, 16, 'x', bronze); gear(X1 + .016, .6, -.1, .028, 10, 'x', bronze);
  valve(.316, .44, .06, .17, .018, red, false); gauge(X1 + .012, .13, -.05, .03, Math.PI / 2);
  pipe([[X1 + .02, .09, -.22], [X1 + .02, .7, -.22], [.2, .74, -.22]], .012, copper);
  // back: horizontal manifolds with valves at the sides (the card tray, panels and back hatch zones in the middle stay clear)
  for (const y of [.2, .58]) { pipe([[-.27, y, Z0 - .02], [-.17, y, Z0 - .02]], .01, copper); pipe([[.18, y, Z0 - .02], [.28, y, Z0 - .02]], .01, copper); }
  for (const sx of [-.2, .21]) { handwheel(sx, .66, Z0 - .04, .03); }
  valve(-.25, .748, -.2, .1, .014, red); valve(.26, .748, -.2, .1, .014, red);
  // front: pipes up both facade edges, arching over the screen with flanges, and a short manifold above the deck
  pipe([[FX0 - .012, .1, .135], [FX0 - .012, .72, .135], [-.12, .72, .135]], .01, copper); pipe([[FX1 + .012, .1, .135], [FX1 + .012, .72, .135], [.12, .72, .135]], .01, copper);
  pipe([[-.12, .72, .135], [.12, .72, .135]], .01, copper, false); for (const x of [-.12, 0, .12]) cyl(.016, .012, bronze, x, .72, .135, 'x');
  for (const x of [FX0 - .012, FX1 + .012]) for (const y of [.2, .4, .6]) cyl(.016, .012, bronze, x, y, .135);
  root.userData.lights = lights;
  // panel seams on the sides
  for (const sx of [X0 - .0006, X1 + .0006]) { box(.0016, .003, ZF - Z0 - .03, mark(new T.MeshStandardMaterial({color: '#0c0e0d', roughness: .9})), sx, .42, (Z0 + ZF) / 2); }
  // two flexible cables dropping from the cap down the right back corner
  for (const [k, m] of [[0, rubber], [1, mark(new T.MeshStandardMaterial({color: '#6e1b15', roughness: .55}))]] as [number, T.Material][]) {
    const c = new T.CatmullRomCurve3([new T.Vector3(X1 - .05 - k * .02, Y1 + .03, Z0 + .04), new T.Vector3(X1 + .015, Y1 - .02, Z0 + .01 - k * .01), new T.Vector3(X1 + .02 + k * .006, .5, Z0 - .005), new T.Vector3(X1 + .012, .25, Z0 + .005), new T.Vector3(X1 - .01, .09, Z0 + .02)]);
    add(new T.TubeGeometry(c, hi ? 64 : 32, .0065 - k * .0015, 8, false), m, 0, 0, 0); }
  // printed and stencilled markings (kept as separate transparent planes)
  const put = (d: T.Mesh, x: number, y: number, z: number, ry = 0) => { d.position.set(x, y, z); d.rotation.y = ry; d.userData.keep = true; root.add(d); };
  put(decal(.085, .07, (x, W, H) => { x.fillStyle = '#e1b52a'; x.fillRect(0, 0, W, H); x.fillStyle = '#121212'; x.lineWidth = W * .03; x.strokeRect(W * .03, H * .04, W * .94, H * .92);
    x.beginPath(); x.moveTo(W * .5, H * .1); x.lineTo(W * .32, H * .5); x.lineTo(W * .48, H * .5); x.lineTo(W * .4, H * .72); x.lineTo(W * .66, H * .38); x.lineTo(W * .5, H * .38); x.lineTo(W * .6, H * .1); x.closePath(); x.fill();
    x.font = `900 ${H * .14}px Arial, sans-serif`; x.textAlign = 'center'; x.fillText('ОПАСНО · 380 V', W / 2, H * .9); }), X0 - .0012, .27, .09, -Math.PI / 2);
  [['1', -.212, .249], ['2', -.212, .185], ['3', .206, .249], ['4', .206, .185]].forEach(([t, x, y]) => put(decal(.018, .018, (c, W, H) => { c.fillStyle = '#d9d6c8'; c.font = `700 ${H * .8}px 'Courier New', monospace`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(t as string, W / 2, H * .55); c.strokeStyle = '#d9d6c8'; c.lineWidth = W * .05; c.beginPath(); c.arc(W / 2, H / 2, W * .44, 0, 7); c.stroke(); }, true, 128), x as number, y as number, .1446));
  put(decal(.3, .03, (x, W, H) => { x.fillStyle = '#d4cdb4'; x.font = `700 ${H * .62}px 'Courier New', monospace`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('СЕРВИСНАЯ ПАНЕЛЬ · ТОЛЬКО ПЕРСОНАЛ', W / 2, H / 2); }), .005, .655, Z0 - .0105, Math.PI);
  const baked = bakeByMaterial(root, 5); baked.name = root.name; return baked;
}
