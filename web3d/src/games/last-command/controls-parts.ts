// THE LAST COMMAND — every control part built in code (replaces hole_final / button / adjuster / light / level_handler /
// lever / secret_hole / door / code_display / animal_panel .glb). Each part is built in the same local frame as the
// model it replaces (y up from 0, the mount turns +y out of the cabinet), so every mount, pivot, press axis, pick
// threshold and canvas placement in machine.ts / panel.json / mechanisms.json still lands where it did:
//   button: y 0..0.75, picks above y .44 (the enamel dome) · enamel is red so the tint shader recolours it
//   adjuster: y 0..0.95, pivot (-.019,.46,.002), picks above .46 · light: lens toward (.819,0,-.574) beyond .28
//   code_display: digits window at (0,.255,.27) .893×.208, step keys on the plane z .275 at x -.335+i·.2233, y .447 / .066
//   secret_hole: opening x -.36….24, y .16….48, back wall z -.091, face ≈ .05 · door: hinge at (-.466,.23,.026)
import * as T from 'three';
import {RoundedBoxGeometry} from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import {bakeByMaterial} from './bake';

type M = T.Material;
const S = (q: string) => q === 'HIGH' ? 40 : q === 'MEDIUM' ? 28 : 20;

function kit(quality: string) {
  const seg = S(quality), g = new T.Group();
  const mat = {
    steel: new T.MeshStandardMaterial({color: '#9aa09c', metalness: 1, roughness: .3}),
    dark: new T.MeshStandardMaterial({color: '#2b302e', metalness: .8, roughness: .45}),
    brass: new T.MeshStandardMaterial({color: '#b08a4c', metalness: 1, roughness: .3}),
    bakelite: new T.MeshStandardMaterial({color: '#141210', metalness: .1, roughness: .38}),
    enamel: new T.MeshStandardMaterial({color: '#b81616', metalness: .05, roughness: .28}),
    paint: new T.MeshStandardMaterial({color: '#3a4844', metalness: .55, roughness: .52}),
    black: new T.MeshStandardMaterial({color: '#0a0b0b', metalness: .2, roughness: .8}),
    glass: new T.MeshStandardMaterial({color: '#d8dcd6', metalness: 0, roughness: .12, emissive: '#000000'}),
    redKnob: new T.MeshStandardMaterial({color: '#8e1410', metalness: .1, roughness: .25}),
    hazard: new T.MeshStandardMaterial({color: '#c9a227', metalness: .2, roughness: .6}),
  };
  const add = (geo: T.BufferGeometry, m: M, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0) => { const o = new T.Mesh(geo, m); o.position.set(x, y, z); o.rotation.set(rx, ry, rz); g.add(o); return o; };
  const cyl = (r: number, h: number, m: M, x: number, y: number, z: number, r2 = r, axis: 'y' | 'x' | 'z' = 'y', s = seg) => add(new T.CylinderGeometry(r, r2, h, s), m, x, y, z, axis === 'z' ? Math.PI / 2 : 0, 0, axis === 'x' ? Math.PI / 2 : 0);
  const rbox = (w: number, h: number, d: number, r: number, m: M, x: number, y: number, z: number) => add(new RoundedBoxGeometry(w, h, d, 2, r), m, x, y, z);
  const box = (w: number, h: number, d: number, m: M, x: number, y: number, z: number) => add(new T.BoxGeometry(w, h, d), m, x, y, z);
  const ring = (r: number, tube: number, m: M, x: number, y: number, z: number, rx = Math.PI / 2) => add(new T.TorusGeometry(r, tube, 10, seg), m, x, y, z, rx);
  const bolts = (n: number, r: number, y: number, m: M, size: number) => { for (let k = 0; k < n; k++) { const a = k / n * Math.PI * 2; cyl(size, size * .9, m, Math.cos(a) * r, y, Math.sin(a) * r, size, 'y', 6); } };
  return {g, mat, add, cyl, rbox, box, ring, bolts, seg};
}

/** big button bezel: a heavy flanged ring, a guard torus and six bolts around a dark well */
function bigBase(q: string) { const k = kit(q), m = k.mat;
  k.cyl(.55, .09, m.dark, 0, .045, 0, .55); k.cyl(.5, .06, m.steel, 0, .12, 0, .53); k.bolts(6, .46, .165, m.brass, .045);
  k.ring(.42, .07, m.steel, 0, .24, 0); k.cyl(.36, .2, m.black, 0, .2, 0, .38); k.cyl(.4, .04, m.brass, 0, .345, 0, .4); return k.g; }

/** push button: a steel skirt and an enamel dome (tinted per button by the machine) */
function button(q: string) { const k = kit(q), m = k.mat;
  k.cyl(.56, .12, m.dark, 0, .06, 0, .56); k.cyl(.52, .05, m.steel, 0, .145, 0, .54);
  k.cyl(.46, .3, m.enamel, 0, .32, 0, .48); k.add(new T.SphereGeometry(.46, k.seg, 12, 0, Math.PI * 2, 0, Math.PI / 2), m.enamel, 0, .47, 0).scale.y = .6;
  k.ring(.47, .018, m.steel, 0, .3, 0); return k.g; }

/** rotary adjuster: flange, knurled bakelite knob, brass cap with a bright pointer */
function adjuster(q: string) { const k = kit(q), m = k.mat, cx = -.019, cz = .002;
  k.cyl(.44, .1, m.steel, cx, .05, cz, .44); for (let i = 0; i < 4; i++) { const a = i / 4 * Math.PI * 2 + Math.PI / 4; k.box(.04, .02, .12, m.dark, cx + Math.cos(a) * .4, .1, cz + Math.sin(a) * .4).rotation.y = -a; }
  k.cyl(.33, .52, m.bakelite, cx, .36, cz, .36); for (let i = 0; i < 24; i++) { const a = i / 24 * Math.PI * 2; k.box(.03, .5, .03, m.bakelite, cx + Math.cos(a) * .35, .36, cz + Math.sin(a) * .35).rotation.y = -a; }
  k.cyl(.3, .1, m.brass, cx, .67, cz, .32); k.box(.07, .14, .3, m.steel, cx, .76, cz + .12); k.add(new T.ConeGeometry(.06, .16, 10), m.steel, cx, .76, cz + .3, Math.PI / 2);
  return k.g; }

/** indicator lamp: a ribbed housing with a glass lens facing along (.819, 0, -.574) — the tint shader lights it */
function light(q: string) { const k = kit(q), m = k.mat, d = new T.Vector3(.819, 0, -.574);
  k.rbox(.5, .62, .4, .05, m.dark, -.15, .31, .02);
  const holder = new T.Group(); holder.position.copy(d.clone().multiplyScalar(.2)).setY(.33); holder.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), d); k.g.add(holder);
  const add = (o: T.Mesh, y: number) => { o.position.y = y; holder.add(o); return o; };
  add(new T.Mesh(new T.CylinderGeometry(.22, .25, .14, k.seg), m.steel), 0); add(new T.Mesh(new T.TorusGeometry(.2, .03, 8, k.seg), m.brass), .08).rotation.x = Math.PI / 2;
  add(new T.Mesh(new T.SphereGeometry(.18, k.seg, 12, 0, Math.PI * 2, 0, Math.PI / 2), m.glass), .08).scale.y = .9;
  for (let i = 0; i < 4; i++) { const cage = new T.Mesh(new T.TorusGeometry(.19, .012, 6, k.seg, Math.PI), m.steel); cage.position.y = .09; cage.rotation.set(0, i * Math.PI / 4, 0); holder.add(cage); }
  return k.g; }

/** lever base: a mounting plate and a slotted quadrant gate with a pivot boss */
function leverBase(q: string) { const k = kit(q), m = k.mat;
  k.rbox(.9, .07, .72, .03, m.dark, 0, .035, 0); k.box(.6, .3, .07, m.steel, 0, .22, -.2); k.box(.6, .3, .07, m.steel, 0, .22, .2);
  k.box(.6, .04, .47, m.steel, 0, .37, 0); k.box(.5, .045, .1, m.black, 0, .39, 0);
  for (const [x, c] of [[-.22, m.hazard], [0, m.brass], [.22, m.hazard]] as [number, M][]) k.box(.08, .01, .06, c, x, .395, .17);
  for (const [x, z] of [[-.38, -.28], [.38, -.28], [-.38, .28], [.38, .28]]) k.cyl(.04, .03, m.brass, x, .085, z, .04, 'y', 8);
  return k.g; }

/** lever handle: a hub at the pivot, a steel rod and a red knob */
function leverHandle(q: string) { const k = kit(q), m = k.mat;
  k.cyl(.11, .26, m.steel, 0, .09, .045, .11, 'x'); k.cyl(.05, .9, m.steel, 0, .55, .045, .045); k.cyl(.07, .08, m.brass, 0, .15, .045);
  k.add(new T.SphereGeometry(.14, k.seg, 14), m.redKnob, 0, 1.0, .045); return k.g; }

/** hatch frame: a riveted collar around the recess, its back wall and side walls (the liner and the note come later) */
function hatchFrame(q: string) { const k = kit(q), m = k.mat, X0 = -.36, X1 = .24, Y0 = .16, Y1 = .48;
  k.box(X0 + .65, .61, .2, m.paint, (-.65 + X0) / 2, .305, .01); k.box(.4 - X1, .61, .2, m.paint, (X1 + .4) / 2, .305, .01);
  k.box(X1 - X0, Y0, .2, m.paint, (X0 + X1) / 2, Y0 / 2, .01); k.box(X1 - X0, .61 - Y1, .2, m.paint, (X0 + X1) / 2, (Y1 + .61) / 2, .01);
  k.box(X1 - X0, Y1 - Y0, .01, m.black, (X0 + X1) / 2, (Y0 + Y1) / 2, -.095);
  for (const [w, h, x, y] of [[X1 - X0 + .04, .02, (X0 + X1) / 2, Y1 + .01], [X1 - X0 + .04, .02, (X0 + X1) / 2, Y0 - .01], [.02, Y1 - Y0, X0 - .01, (Y0 + Y1) / 2], [.02, Y1 - Y0, X1 + .01, (Y0 + Y1) / 2]] as number[][]) k.box(w, h, .02, m.brass, x, y, .115);
  for (let u = -.6; u < .38; u += .12) { k.cyl(.012, .02, m.steel, u, .58, .115, .012, 'z', 6); k.cyl(.012, .02, m.steel, u, .03, .115, .012, 'z', 6); }
  return k.g; }

/** hatch door: a steel plate with a pull handle, two hinge knuckles on the left and a stencilled band */
function door(q: string) { const k = kit(q), m = k.mat;
  k.rbox(1.12, .46, .07, .02, m.paint, .043, .23, .01);
  k.box(1.0, .05, .075, m.hazard, .043, .38, .01);
  for (let i = 0; i < 6; i++) k.box(.05, .052, .078, m.black, -.38 + i * .17, .38, .01).rotation.z = .5;
  for (const y of [.09, .37]) k.cyl(.03, .1, m.steel, -.466, y, .026);
  k.cyl(.018, .2, m.steel, .48, .2, .07, .018); for (const y of [.11, .29]) k.box(.03, .03, .05, m.steel, .48, y, .05);
  return k.g; }

/** code panel: a housing with a dark digit window and eight step keys (▲ above, ▼ below each digit) */
function codeDisplay(q: string) { const k = kit(q), m = k.mat;
  k.rbox(1.07, .525, .52, .04, m.dark, 0, .2625, 0); k.box(.95, .25, .02, m.black, 0, .255, .25); /* behind the digit canvas at z .27 */
  k.box(1.0, .022, .03, m.brass, 0, .39, .265); k.box(1.0, .022, .03, m.brass, 0, .12, .265);
  for (let i = 0; i < 4; i++) { const x = -.335 + i * .2233;
    for (const [y, up] of [[.447, true], [.066, false]] as [number, boolean][]) { k.rbox(.17, .1, .03, .012, m.steel, x, y, .262);
      const tri = new T.Shape(); tri.moveTo(-.04, up ? -.025 : .025); tri.lineTo(.04, up ? -.025 : .025); tri.lineTo(0, up ? .03 : -.03); tri.closePath();
      k.add(new T.ShapeGeometry(tri), m.black, x, y, .2785); } }
  return k.g; }

/** card tray: a shallow riveted frame (the machine normalises its size) */
function cardTray(q: string) { const k = kit(q), m = k.mat;
  k.rbox(1.14, .48, .1, .02, m.dark, -.006, .24, 0); k.box(1.06, .4, .02, m.black, -.006, .24, .045);
  for (const [w, h, x, y] of [[1.12, .03, -.006, .465], [1.12, .03, -.006, .015], [.03, .48, -.566, .24], [.03, .48, .554, .24]] as number[][]) k.box(w, h, .03, m.brass, x, y, .05);
  return k.g; }

export function buildControlPart(name: string, quality: string): T.Group {
  const make: Record<string, (q: string) => T.Group> = {hole_final: bigBase, button, adjuster, light, level_handler: leverBase, lever: leverHandle, secret_hole: hatchFrame, door, code_display: codeDisplay, animal_panel: cardTray};
  const g = make[name](quality); g.name = 'lc-part-' + name;
  const baked = bakeByMaterial(g); baked.name = g.name; return baked;
}
