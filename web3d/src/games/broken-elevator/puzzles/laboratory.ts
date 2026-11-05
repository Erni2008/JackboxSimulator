// THE BROKEN ELEVATOR — THE UNSTABLE FORMULA apparatus (wall-mounted on the cage's left-hand wall).
// Local frame: +z into the cage, origin on the wall. Layout:
//   top      status window; five glass reservoirs (CRIMSON AZURE VERDANT AMBER VIOLET) with labels and coloured
//            dispensing plungers; glass transfer tubes curving down into the chamber lid
//   centre   the mixing chamber: glass vessel, liquid (procedural mixing shader), incoming stream, motor-driven stirrer,
//            locking clamps, drain valve below
//   sides    sample analyzer (left); COOLING LOCK lever and the guarded INJECT button (right)
//   bottom   piston pump + output tube to the cooling line, waste drain, and a brass ledge holding THE ALCHEMIST'S JOURNAL
// The apparatus renders the server's view and reports actions; it never decides anything.
import * as T from 'three';
import {L as tr} from '../i18n';
import {materials, plate, lamp, canvasTex, QUARTER, TECH} from './pressure-parts';
import {Control, Lever, PushButton, type Feedback} from './pressure-controls';
import {flowMaterial, liquidMaterial, glassMaterial, bubbleField, type LiquidUniforms} from './liquid';
import {REAGENTS, COLOR, GLINT, SYMBOL, NAME, type Reagent} from './formula-sim';
import type {LabView} from './formula-link';
import {contactShadow, enableShadows} from './surface';

export interface LabSounds extends Feedback { pour(): void; splash(): void; stir(on: boolean): void; inject(): void; pump(): void; accepted(): void; unstable(): void; steam(): void; drain(): void; bubble(): void }
const CH_R = .085, CH_H = .22, CH_Y = -.17, CH_Z = .12, DOSE_H = 1 / 6; // chamber holds 6 doses

export class Laboratory {
  group = new T.Group(); enabled = false;
  onAction: (a: 'DISPENSE' | 'LOCK_ON' | 'LOCK_OFF' | 'INJECT', r?: Reagent) => void = () => {};
  sounds: LabSounds | null = null;
  /** every new server event after the first snapshot (page-level feedback) */
  onEvent: (e: NonNullable<LabView['event']>) => void = () => {};
  /** where the journal rests (local), consumed by the page */
  ledgeTop = new T.Vector3(-.28, -.418, .12);
  private controls: Control[] = []; private plungers: PushButton[] = []; private lockLever: Lever; private inject: PushButton;
  private tubes: {flow: T.ShaderMaterial; wheel: T.Mesh}[] = []; private stream: T.ShaderMaterial; private drainFlow: T.ShaderMaterial; private outFlow: T.ShaderMaterial;
  private liquid: T.Mesh; private lu: LiquidUniforms; private chamber = new T.Group(); private stirrer = new T.Group(); private clamps: T.Group[] = []; private piston!: T.Mesh;
  private statusCanvas = document.createElement('canvas'); private statusTex: T.CanvasTexture; private statusShown = '';
  private anCanvas = document.createElement('canvas'); private anTex: T.CanvasTexture; private anShown = '';
  private lockLamp: T.MeshStandardMaterial; private okLamp: T.MeshStandardMaterial; private badLamp: T.MeshStandardMaterial; private redLight: T.PointLight;
  private active: Control | null = null; private t = 0; private lastEvent = -1;
  private pour: {i: number; t: number} | null = null; private fill = 0; private mixT = 9; private mixKey = ''; private stirSpeed = 0; private rejectT = 9; private rejectFrom = 0; private successT = 9; private shake = 0; private stirring = false;
  private inlets: T.Vector2[] = []; private bubbles!: ReturnType<typeof bubbleField>; private glow!: T.PointLight; private plume = 0; private successFrom = 0; private ripple = 9; private lastPour = 0;
  private steam: T.Points; private sp: Float32Array; private life: Float32Array; private cursor = 0;

  constructor(hi: boolean) {
    const m = materials(); const glass = glassMaterial('#e6f0f6', 1), tubeGlass = glassMaterial('#e6f0f6', .8);
    // ---- backplate
    const W = .96, H = .8; const back = new T.Mesh(new T.BoxGeometry(W, H, .022), m.iron); back.position.z = .011; this.group.add(back);
    for (const [w, h, x, y] of [[W, .02, 0, H / 2 - .01], [W, .02, 0, -H / 2 + .01], [.02, H, -W / 2 + .01, 0], [.02, H, W / 2 - .01, 0]] as const) { const f = new T.Mesh(new T.BoxGeometry(w, h, .01), m.brassDark); f.position.set(x, y, .026); this.group.add(f); }
    const boltGeo = new T.CylinderGeometry(.008, .009, .008, 6); boltGeo.rotateX(QUARTER); const bolts: [number, number][] = []; for (let i = 0; i <= 12; i++) bolts.push([-W / 2 + .02 + i * (W - .04) / 12, H / 2 - .01], [-W / 2 + .02 + i * (W - .04) / 12, -H / 2 + .01]);
    const bi = new T.InstancedMesh(boltGeo, m.bolt, bolts.length); const m4 = new T.Matrix4(); bolts.forEach(([x, y], i) => { m4.makeTranslation(x, y, .033); bi.setMatrixAt(i, m4); }); this.group.add(bi);
    const title = plate(tr('ФОРМУЛА ОХЛАЖДЕНИЯ', 'COOLING FORMULA'), tr('ЛАБОРАТОРИЯ ХАРТВЕЛЛА · № 7', 'HARTWELL LABORATORY · No 7'), .3, .045, 'brass'); title.position.set(-.3, .36, .03); this.group.add(title);
    // ---- status window
    this.statusCanvas.width = 1024; this.statusCanvas.height = 140; this.statusTex = new T.CanvasTexture(this.statusCanvas); this.statusTex.colorSpace = T.SRGBColorSpace; this.drawStatus(tr('ГОТОВ', 'READY'), '#ffb347');
    const sw = new T.Mesh(new T.PlaneGeometry(.38, .052), new T.MeshStandardMaterial({map: this.statusTex, emissiveMap: this.statusTex, emissive: '#ffffff', emissiveIntensity: .9})); sw.position.set(.2, .36, .03); this.group.add(sw);
    const sf = new T.Mesh(new T.BoxGeometry(.395, .066, .008), m.brass); sf.position.set(.2, .36, .024); this.group.add(sf);

    // ---- reservoirs, labels, plungers, transfer tubes
    const xs = [-.34, -.17, 0, .17, .34], v3 = (x: number, y: number, z: number) => new T.Vector3(x, y, z);
    REAGENTS.forEach((r, i) => {
      const x = xs[i], g = new T.Group(); g.position.set(x, .2, .07); this.group.add(g);
      const body = new T.Mesh(new T.CylinderGeometry(.045, .045, .15, 32, 1, true), glass); body.renderOrder = 3; g.add(body);
      const {mat, uniforms} = liquidMaterial(hi); uniforms.uColA.value.set(COLOR[r]); uniforms.uGlintA.value.set(GLINT[r]); uniforms.uFracB.value = 0; uniforms.uBubbles.value = .08;
      const liq = new T.Mesh(new T.CylinderGeometry(.5, .5, 1, 28, 1, false), mat); liq.scale.set(.084, .11, .084); liq.position.y = -.015; liq.renderOrder = 1; g.add(liq); liq.userData.u = uniforms; uniforms.uAspect.value = .11 / .084;
      for (const y of [-.078, .078]) { const ring = new T.Mesh(new T.CylinderGeometry(.051, .051, .014, 32), m.brass); ring.position.y = y; g.add(ring); }
      const cap = new T.Mesh(new T.SphereGeometry(.03, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), m.brassDark); cap.position.y = .085; g.add(cap);
      const strap = new T.Mesh(new T.TorusGeometry(.049, .004, 6, 32), m.bolt); strap.rotation.x = QUARTER; g.add(strap);
      const bracket = new T.Mesh(new T.BoxGeometry(.012, .1, .06), m.brassDark); bracket.position.set(0, 0, -.045); g.add(bracket);
      // paper label on the glass, with the reagent's colour band
      const lab = plate(NAME[r], '', .082, .026, 'brass'); lab.position.set(0, -.01, .049); g.add(lab); const band = new T.Mesh(new T.BoxGeometry(.082, .006, .003), m.paint(COLOR[r])); band.position.set(0, .007, .051); g.add(band);
      const pl = new PushButton('dose-' + r, m, () => this.emit('DISPENSE', r), COLOR[r], .75); pl.root.position.set(x + .072, .17, .024); this.group.add(pl.root); this.plungers.push(pl);
      // transfer tube: glass sleeve + flowing liquid slug, from the reservoir foot to an inlet on the chamber lid
      const curve = new T.CatmullRomCurve3([v3(x, .12, .07), v3(x, .065, .085), v3(x * .7, .02, .11), v3(x * .25, -.02, CH_Z), v3(x * .12, -.045, CH_Z)], false, 'catmullrom', .3);
      const sleeve = new T.Mesh(new T.TubeGeometry(curve, hi ? 48 : 28, .008, 10, false), tubeGlass); sleeve.renderOrder = 3; this.group.add(sleeve);
      const flow = flowMaterial(new T.Color(COLOR[r])); const slug = new T.Mesh(new T.TubeGeometry(curve, hi ? 48 : 28, .0055, 8, false), flow); this.group.add(slug);
      const wheel = new T.Mesh(new T.TorusGeometry(.012, .003, 6, 16), m.brass); wheel.position.set(x, .095, .1); this.group.add(wheel);
      this.tubes.push({flow, wheel}); this.inlets.push(new T.Vector2(x * .12 / (CH_R * 2 * .96), 0));
    });

    // ---- mixing chamber
    this.chamber.position.set(0, CH_Y, CH_Z); this.group.add(this.chamber);
    const vessel = new T.Mesh(new T.CylinderGeometry(CH_R, CH_R, CH_H, 48, 1, true), glass); vessel.renderOrder = 3; this.chamber.add(vessel);
    const inner = new T.Mesh(new T.CylinderGeometry(CH_R * .97, CH_R * .97, CH_H * .99, 48, 1, true), glassMaterial('#ffffff', .35)); inner.renderOrder = 2; this.chamber.add(inner); // inner wall: double reflections like thick glass
    const {mat, uniforms} = liquidMaterial(hi); this.lu = uniforms; this.liquid = new T.Mesh(new T.CylinderGeometry(.5, .5, 1, hi ? 64 : 40, 1, false), mat); (this.liquid.geometry as T.BufferGeometry).computeVertexNormals(); this.liquid.renderOrder = 1; this.chamber.add(this.liquid); this.liquid.visible = false;
    for (const [y, r2, h] of [[CH_H / 2 + .008, CH_R + .012, .018], [-CH_H / 2 - .01, CH_R + .014, .022]] as const) { const ring = new T.Mesh(new T.CylinderGeometry(r2, r2, h, 48), m.brass); ring.position.y = y; this.chamber.add(ring); }
    for (let k = 0; k < 4; k++) { const rod = new T.Mesh(new T.CylinderGeometry(.004, .004, CH_H + .02, 8), m.brassDark); const a = k * QUARTER + .4; rod.position.set(Math.cos(a) * (CH_R + .012), 0, Math.sin(a) * (CH_R + .012)); this.chamber.add(rod); }
    this.bubbles = bubbleField(hi ? 70 : 40, CH_R * .9, CH_H * .96); this.bubbles.pts.renderOrder = 2; this.chamber.add(this.bubbles.pts);
    this.glow = new T.PointLight('#ffffff', 0, .35, 2); this.glow.position.set(0, -CH_H * .25, .06); this.chamber.add(this.glow);
    // stirrer: motor housing on the lid, shaft, paddle
    const motor = new T.Mesh(new T.CylinderGeometry(.026, .03, .05, 20), m.brassDark); motor.position.y = CH_H / 2 + .04; this.chamber.add(motor);
    const vent = new T.Mesh(new T.TorusGeometry(.03, .004, 6, 20), m.brass); vent.rotation.x = QUARTER; vent.position.y = CH_H / 2 + .05; this.chamber.add(vent);
    this.stirrer.position.y = CH_H / 2; this.chamber.add(this.stirrer);
    const shaft = new T.Mesh(new T.CylinderGeometry(.004, .004, CH_H * .85, 8), m.bolt); shaft.position.y = -CH_H * .42; this.stirrer.add(shaft);
    for (let k = 0; k < 2; k++) { const blade = new T.Mesh(new T.BoxGeometry(.07, .022, .003), m.brass); blade.position.y = -CH_H * .8; blade.rotation.y = k * QUARTER; this.stirrer.add(blade); }
    // the incoming stream, from the lid inlet to the surface
    this.stream = flowMaterial(new T.Color('#ffffff')); const sc = new T.LineCurve3(v3(0, CH_H / 2 + .005, 0), v3(0, -CH_H / 2, 0)); const st = new T.Mesh(new T.TubeGeometry(sc as any, 12, .0045, 8, false), this.stream); this.chamber.add(st);
    // clamps that lock the chamber for injection
    for (const s of [-1, 1]) { const c = new T.Group(); c.position.set(s * (CH_R + .03), 0, 0); this.chamber.add(c); const arm = new T.Mesh(new T.BoxGeometry(.02, .05, .03), m.brassDark); arm.position.x = s * .012; c.add(arm); const jaw = new T.Mesh(new T.BoxGeometry(.008, .07, .035), m.brass); jaw.position.x = -s * .004; c.add(jaw); c.userData.s = s; this.clamps.push(c); }
    // drain valve and pipe
    const dv = new T.Mesh(new T.CylinderGeometry(.016, .016, .03, 16), m.brassDark); dv.position.set(0, CH_Y - CH_H / 2 - .035, CH_Z); this.group.add(dv);
    const dcurve = new T.CatmullRomCurve3([v3(0, CH_Y - CH_H / 2 - .02, CH_Z), v3(0, -.34, CH_Z), v3(.02, -.38, .08), v3(.05, -.4, .05)]);
    this.group.add(new T.Mesh(new T.TubeGeometry(dcurve, 20, .009, 10, false), tubeGlass)); this.drainFlow = flowMaterial(new T.Color('#6a7a20')); this.group.add(new T.Mesh(new T.TubeGeometry(dcurve, 20, .006, 8, false), this.drainFlow));
    const dp = plate(tr('СЛИВ', 'WASTE'), '', .06, .02, 'brass'); dp.position.set(-.05, -.37, .03); this.group.add(dp);
    // output line: chamber → pump → cooling system
    const ocurve = new T.CatmullRomCurve3([v3(CH_R * .9, CH_Y - .07, CH_Z), v3(.15, -.27, .1), v3(.26, -.28, .08), v3(.4, -.28, .06), v3(.44, -.2, .05), v3(.44, .05, .05)]);
    this.group.add(new T.Mesh(new T.TubeGeometry(ocurve, 40, .009, 10, false), tubeGlass)); this.outFlow = flowMaterial(new T.Color('#2fd0ff')); this.group.add(new T.Mesh(new T.TubeGeometry(ocurve, 40, .006, 8, false), this.outFlow));
    const pump = new T.Mesh(new T.CylinderGeometry(.024, .024, .07, 20), m.brassDark); pump.position.set(.26, -.33, .06); this.group.add(pump);
    this.piston = new T.Mesh(new T.CylinderGeometry(.008, .008, .07, 10), m.bolt); this.piston.position.set(.26, -.28, .06); this.group.add(this.piston);
    const cp = plate(tr('В ОХЛАЖДЕНИЕ', 'TO COOLING'), '', .09, .02, 'brass'); cp.position.set(.4, -.33, .03); this.group.add(cp);

    // ---- analyzer (left)
    this.anCanvas.width = 560; this.anCanvas.height = 480; this.anTex = new T.CanvasTexture(this.anCanvas); this.anTex.colorSpace = T.SRGBColorSpace; this.anTex.anisotropy = 16;
    const an = new T.Mesh(new T.PlaneGeometry(.24, .206), new T.MeshStandardMaterial({map: this.anTex, emissiveMap: this.anTex, emissive: '#ffffff', emissiveIntensity: .9})); an.position.set(-.3, -.15, .03); this.group.add(an);
    const af = new T.Mesh(new T.BoxGeometry(.256, .222, .01), m.brass); af.position.set(-.3, -.15, .024); this.group.add(af);
    const ap = plate(tr('АНАЛИЗАТОР ОБРАЗЦА', 'SAMPLE ANALYZER'), '', .16, .022, 'brass'); ap.position.set(-.3, -.03, .03); this.group.add(ap);

    // ---- cooling lock + INJECT (right)
    this.lockLever = new Lever('lock', '#1d4f7a', m, [-.6, .6], p => this.emit(p ? 'LOCK_ON' : 'LOCK_OFF'), .07); this.lockLever.root.position.set(.25, -.1, .05); this.group.add(this.lockLever.root);
    const lp = plate(tr('ЗАМОК ОХЛАЖДЕНИЯ', 'COOLING LOCK'), tr('ВЫКЛ · ВКЛ', 'OFF · ON'), .14, .036, 'brass'); lp.position.set(.25, -.19, .03); this.group.add(lp);
    const ll = lamp(.012, '#4dc4ff', m); ll.group.position.set(.32, -.03, .03); this.group.add(ll.group); this.lockLamp = ll.mat;
    const guard = new T.Mesh(new T.TorusGeometry(.05, .008, 10, 32), m.brass); guard.position.set(.38, -.25, .05); this.group.add(guard);
    this.inject = new PushButton('inject', m, () => this.emit('INJECT'), '#8a1408', 1.6); this.inject.root.position.set(.38, -.25, .024); this.group.add(this.inject.root);
    const ip = plate(tr('ВПРЫСК', 'INJECT'), '', .08, .024, 'warning'); ip.position.set(.38, -.175, .03); this.group.add(ip);
    const ok = lamp(.012, '#3dff6a', m); ok.group.position.set(.36, .3, .03); this.group.add(ok.group); this.okLamp = ok.mat;
    const bad = lamp(.012, '#ff2a10', m); bad.group.position.set(.42, .3, .03); this.group.add(bad.group); this.badLamp = bad.mat;
    this.redLight = new T.PointLight('#ff3010', 0, 1.2, 2); this.redLight.position.set(0, CH_Y, .3); this.group.add(this.redLight);

    // ---- journal ledge
    const ledge = new T.Mesh(new T.BoxGeometry(.34, .014, .24), m.iron); ledge.position.set(-.28, -.425, .12); this.group.add(ledge);
    const lip = new T.Mesh(new T.BoxGeometry(.34, .02, .008), m.brass); lip.position.set(-.28, -.415, .236); this.group.add(lip);
    for (const s of [-1, 1]) { const br = new T.Mesh(new T.BoxGeometry(.012, .09, .2), m.brassDark); br.position.set(-.28 + s * .14, -.47, .11); this.group.add(br); }

    this.controls = [...this.plungers, this.lockLever, this.inject];
    // ---- small steam pool for the rejection burst
    const N = hi ? 80 : 40; this.sp = new Float32Array(N * 3); this.life = new Float32Array(N * 4); for (let i = 0; i < N; i++) this.life[i * 4] = 1;
    const geo = new T.BufferGeometry(); geo.setAttribute('position', new T.BufferAttribute(this.sp, 3)); geo.setAttribute('age', new T.BufferAttribute(new Float32Array(N), 1));
    this.steam = new T.Points(geo, new T.ShaderMaterial({transparent: true, depthWrite: false, uniforms: {px: {value: Math.min(devicePixelRatio, 2)}},
      vertexShader: 'attribute float age; uniform float px; varying float vA; void main(){ vec4 mv = modelViewMatrix * vec4(position,1.); vA = age; gl_PointSize = px * (.03 + .1 * age) * 520. / -mv.z; gl_Position = projectionMatrix * mv; }',
      fragmentShader: 'varying float vA; void main(){ vec2 d = gl_PointCoord - .5; float r = length(d); if (vA <= 0. || r > .5) discard; gl_FragColor = vec4(vec3(.85, .86, .8), smoothstep(.5, .0, r) * (1. - vA) * min(1., vA * 6.) * .32); }'}));
    this.steam.frustumCulled = false; this.group.add(this.steam);
    for (const x of xs) this.group.add(contactShadow(x, .2, .13, .24));
    for (const [x, y, w, h] of [[0, CH_Y, .26, .34], [-.3, -.15, .3, .26], [.25, -.1, .14, .14], [.38, -.25, .14, .14], [.26, -.31, .08, .14], [-.28, -.42, .38, .06], [.44, -.1, .05, .4]] as const) this.group.add(contactShadow(x, y, w, h));
    enableShadows(this.group);
    this.drawAnalyzer(null);
  }

  private emit(a: 'DISPENSE' | 'LOCK_ON' | 'LOCK_OFF' | 'INJECT', r?: Reagent) { if (this.enabled) this.onAction(a, r); }
  private drawStatus(text: string, color: string) {
    if (text + color === this.statusShown) return; this.statusShown = text + color; const x = this.statusCanvas.getContext('2d')!;
    x.fillStyle = '#0a0705'; x.fillRect(0, 0, 1024, 140); x.strokeStyle = 'rgba(255,170,60,.12)'; for (let y = 0; y < 140; y += 6) { x.beginPath(); x.moveTo(0, y); x.lineTo(1024, y); x.stroke(); }
    let fs = 74; do { x.font = `700 ${fs}px 'IBM Plex Mono', Menlo, monospace`; fs -= 3; } while (x.measureText(text).width > 960 && fs > 30); x.textAlign = 'center'; x.textBaseline = 'middle'; x.shadowColor = color; x.shadowBlur = 24; x.fillStyle = color; x.fillText(text, 512, 74); this.statusTex.needsUpdate = true;
  }
  private drawAnalyzer(v: LabView | null) {
    const key = v ? [v.sampleId, v.family, v.cls, v.reaction, v.polarity, v.concentration, v.unstable].join('|') : '-'; if (key === this.anShown) return; this.anShown = key;
    const x = this.anCanvas.getContext('2d')!; const g = x.createLinearGradient(0, 0, 0, 480); g.addColorStop(0, '#0d1410'); g.addColorStop(1, '#060a08'); x.fillStyle = g; x.fillRect(0, 0, 560, 480);
    x.strokeStyle = 'rgba(120,255,170,.08)'; for (let y = 0; y < 480; y += 5) { x.beginPath(); x.moveTo(0, y); x.lineTo(560, y); x.stroke(); }
    const C = '#8dffb4'; x.shadowColor = C; x.shadowBlur = 10; x.textBaseline = 'middle';
    if (!v) { x.fillStyle = 'rgba(141,255,180,.5)'; x.font = `700 40px 'IBM Plex Mono', monospace`; x.textAlign = 'center'; x.fillText(tr('НЕТ ОБРАЗЦА', 'NO SAMPLE'), 280, 240); this.anTex.needsUpdate = true; return; }
    const row = (label: string, value: string, y: number, big = false, col = C) => { x.textAlign = 'left'; x.fillStyle = 'rgba(141,255,180,.6)'; x.font = `600 28px ${TECH}`; x.fillText(label, 26, y); x.textAlign = 'right'; x.fillStyle = col; x.font = `700 ${big ? 54 : 40}px 'IBM Plex Mono', 'Apple Symbols', monospace`; x.fillText(value, 534, y); };
    row(tr('ОБРАЗЕЦ', 'SAMPLE'), v.sampleId, 46); x.strokeStyle = 'rgba(141,255,180,.35)'; x.beginPath(); x.moveTo(26, 78); x.lineTo(534, 78); x.stroke();
    x.textAlign = 'left'; x.fillStyle = 'rgba(141,255,180,.6)'; x.font = `600 28px ${TECH}`; x.fillText(tr('СЕМЕЙСТВО', 'FAMILY'), 26, 124); x.textAlign = 'right'; x.fillStyle = C; x.font = `84px 'Apple Symbols', 'Segoe UI Symbol', 'Noto Sans Symbols 2', serif`; x.fillText(SYMBOL[v.family], 534, 128);
    row(tr('КЛАСС', 'CLASS'), v.cls === 1 ? 'I' : 'II', 190, true); row(tr('РЕАКЦИЯ', 'REACTION'), v.reaction, 246, true); row(tr('ПОЛЯРНОСТЬ', 'POLARITY'), v.polarity === 'POSITIVE' ? tr('+ ПОЛОЖИТ.', '+ POSITIVE') : tr('− ОТРИЦАТ.', '− NEGATIVE'), 302); row(tr('КОНЦЕНТР.', 'CONCENTR.'), v.concentration === 'LOW' ? tr('НИЗКАЯ', 'LOW') : v.concentration === 'MEDIUM' ? tr('СРЕДНЯЯ', 'MEDIUM') : tr('ВЫСОКАЯ', 'HIGH'), 356);
    if (v.unstable) { x.fillStyle = 'rgba(255,60,40,.18)'; x.fillRect(14, 388, 532, 76); row(tr('НЕСТАБИЛЕН', 'UNSTABLE'), NAME[v.unstable as Reagent], 426, false, '#ff7a5a'); } else row(tr('НЕСТАБИЛЕН', 'UNSTABLE'), '—', 426);
    this.anTex.needsUpdate = true;
  }

  center() { return new T.Vector3(0, -.02, .1).applyMatrix4(this.group.matrixWorld); }
  hits(ray: T.Raycaster) { return ray.intersectObject(this.group, true).find(h => h.object.type !== 'Points') || null; }
  get dragging() { return !!this.active; }
  /** live gate checked at the moment of input (not one frame late) */
  canAct: () => boolean = () => true;
  pointerDown(ray: T.Raycaster, x: number, y: number, camera: T.Camera) { const live = this.enabled && this.canAct(); for (const c of this.controls) c.enabled = live; if (!this.enabled) return false; let best: Control | null = null, d = Infinity; for (const c of this.controls) { const h = ray.intersectObject(c.hit, false)[0]; if (h && h.distance < d) { d = h.distance; best = c; } } if (!best) return false; this.active = best; best.down(x, y, camera); return true; }
  pointerMove(x: number, y: number) { this.active?.move(x, y); }
  pointerUp(tap: boolean) { const c = this.active; this.active = null; if (c) c.enabled = this.enabled && this.canAct(); c?.up(tap); }
  controlScreen(id: string, camera: T.Camera) { const c = this.controls.find(k => k.id === id)!; const v = new T.Vector3().setFromMatrixPosition(c.root.matrixWorld).project(camera); return {x: (v.x + 1) / 2 * innerWidth, y: (1 - v.y) / 2 * innerHeight}; }
  reset() { this.lastEvent = -1; this.pour = null; this.fill = 0; this.mixKey = ''; this.rejectT = 9; this.successT = 9; this.clamps.forEach(c => c.position.x = c.userData.s * (CH_R + .03)); }

  update(dt: number, v: LabView | null) {
    this.t += dt; const fx = this.sounds;
    for (const c of this.controls) { if (fx) c.setFeedback(fx); c.enabled = this.enabled && !!v && v.outcome === 'RUNNING' && !v.draining; c.update(dt); }
    this.drawAnalyzer(v);
    // idle reservoir motion
    this.group.traverse(o => { const u = o.userData.u as LiquidUniforms | undefined; if (u) { u.uTime.value = this.t; u.uSwirl.value = Math.sin(this.t * .7) * .3; } });
    if (v) {
      this.lockLever.set(v.lock ? 1 : 0); this.lockLamp.emissiveIntensity = v.lock ? 2.4 : 0;
      const e = v.event; if (e && e.seq !== this.lastEvent) { const first = this.lastEvent < 0; this.lastEvent = e.seq; if (!first) { this.onEvent(e);
        if (e.type === 'DOSE' || (e.type === 'REJECTED' && e.reason === 'UNSTABLE_UNPROTECTED')) { const i = REAGENTS.indexOf(e.reagent as Reagent); if (i >= 0) { this.pour = {i, t: 0}; fx?.pour(); } }
        if (e.type === 'REJECTED') { this.rejectT = e.reason === 'UNSTABLE_UNPROTECTED' ? -.55 : 0; this.rejectFrom = this.fill; }
        if (e.type === 'ACCEPTED') { this.successT = 0; fx?.inject(); } } }
    }
    // ---- pour animation: valve wheel, slug along the tube, stream into the chamber
    this.tubes.forEach((tb, i) => { const p = this.pour && this.pour.i === i ? this.pour.t : -1; const u = tb.flow.uniforms; u.uTime.value = this.t; u.uHead.value = p < 0 ? 0 : Math.min(1, p / .32); u.uTail.value = p < 0 ? 0 : Math.max(0, Math.min(1, (p - .3) / .32)); tb.wheel.rotation.z = p >= 0 && p < .6 ? tb.wheel.rotation.z + dt * 14 : tb.wheel.rotation.z; });
    const su = this.stream.uniforms; su.uTime.value = this.t;
    if (this.pour) { const p = this.pour.t; su.uColor.value.set(COLOR[REAGENTS[this.pour.i]]); su.uGlint.value.set(GLINT[REAGENTS[this.pour.i]]); su.uHead.value = Math.max(0, Math.min(1, (p - .28) / .14)) * (1 - this.fill * .9); su.uTail.value = Math.max(0, Math.min(1, (p - .55) / .12));
      if (p >= .32 && p - dt < .32) { fx?.splash(); this.ripple = 0; } if (p >= .3) this.plume = Math.min(1, this.plume + dt * 1.6); this.lastPour = this.pour.i; this.pour.t += dt; if (this.pour.t > .75) this.pour = null; } else { su.uHead.value = 0; this.plume = Math.max(0, this.plume - dt * .45); }
    this.ripple += dt; this.lu.uRipple.value = this.ripple; this.lu.uPlume.value = this.plume * (1 - this.lu.uMix.value * .8); this.lu.uPlumeX.value.copy(this.inlets[this.lastPour] || new T.Vector2());
    // ---- chamber contents (authoritative doses), level lags the stream
    const doses = v ? v.doses : []; const pendingPour = this.pour && this.pour.t < .4 ? 1 : 0;
    let target = Math.max(0, doses.length - pendingPour) * DOSE_H;
    if (this.rejectT < 2) { target = this.rejectT < .5 ? Math.max(target, this.rejectFrom) : this.rejectFrom * Math.max(0, 1 - (this.rejectT - .5) / 1.2); }
    if (this.successT < 3) { if (this.successT < .9) this.successFrom = this.fill; target = this.successFrom * Math.max(0, 1 - (this.successT - .9) / 1.3); } // pumped out over 1.3 s
    this.fill += (target - this.fill) * Math.min(1, dt * 7); if (Math.abs(target - this.fill) < .002) this.fill = target;
    const colorDoses = doses.length ? doses : (this.fill > .01 && this.mixKey ? this.mixKey.split(',') as Reagent[] : []);
    if (colorDoses.length) { const a = colorDoses[0], others = colorDoses.filter(d => d !== a); this.lu.uColA.value.set(COLOR[a]); this.lu.uGlintA.value.set(GLINT[a]);
      if (others.length) { const c = new T.Color(0, 0, 0), gl = new T.Color(0, 0, 0); for (const o of others) { c.add(new T.Color(COLOR[o])); gl.add(new T.Color(GLINT[o])); } this.lu.uColB.value.copy(c.multiplyScalar(1 / others.length)); this.lu.uGlintB.value.copy(gl.multiplyScalar(1 / others.length)); }
      this.lu.uFracB.value += ((others.length / colorDoses.length) - this.lu.uFracB.value) * Math.min(1, dt * 3);
      const key = colorDoses.join(','); if (key !== this.mixKey && doses.length) { if (others.length) this.mixT = 0; this.mixKey = key; } }
    this.mixT += dt; this.lu.uMix.value = Math.max(0, Math.min(1, (this.mixT - .6) / 3.4)) ** 1.2; this.lu.uTime.value = this.t;
    // ---- stirrer: spins while the chamber is mixing, stops when clamped for injection
    const wantStir = this.successT > .25 && this.lu.uFracB.value > .02 && this.mixT > .5 && this.mixT < 4.6 && this.fill > .05;
    this.stirSpeed += ((wantStir ? 1 : 0) - this.stirSpeed) * Math.min(1, dt * 2.5); this.stirrer.rotation.y += this.stirSpeed * dt * 16; this.lu.uSwirl.value += this.stirSpeed * dt * 2.6; this.lu.uStir.value = this.stirSpeed;
    if (wantStir !== this.stirring) { this.stirring = wantStir; fx?.stir(wantStir); }
    this.lu.uBubbles.value = .12 + (this.pour ? .35 : 0) + this.stirSpeed * .25;
    this.liquid.visible = this.fill > .004; this.liquid.scale.set(CH_R * 2 * .96, Math.max(.001, this.fill * CH_H * .96), CH_R * 2 * .96); this.liquid.position.y = -CH_H / 2 * .96 + this.fill * CH_H * .96 / 2; this.lu.uAspect.value = this.liquid.scale.y / this.liquid.scale.x;
    // bubble sprites and the mixture's own glow through the glass
    const mixCol = this.lu.uColA.value.clone().lerp(this.lu.uColB.value, this.lu.uFracB.value), glint = this.lu.uGlintA.value.clone().lerp(this.lu.uGlintB.value, this.lu.uFracB.value);
    this.bubbles.u.uTime.value = this.t; this.bubbles.u.uLevel.value = this.fill; this.bubbles.u.uRate.value = Math.min(1, .15 + (this.pour ? .45 : 0) + this.stirSpeed * .35 + this.lu.uUnstable.value * .8); this.bubbles.u.uTint.value.copy(glint).lerp(new T.Color('#ffffff'), .5);
    this.glow.color.copy(glint); this.glow.intensity = this.fill * (.012 + this.lu.uUnstable.value * .02) * (this.liquid.visible ? 1 : 0); // a faint coloured spill, not a lamp void mixCol;
    // ---- rejection: boil, vibrate, red flash, steam, drain
    this.rejectT += dt; const rj = this.rejectT >= 0 && this.rejectT < 2;
    this.lu.uUnstable.value += ((rj && this.rejectT < 1.3 ? 1 : 0) - this.lu.uUnstable.value) * Math.min(1, dt * 6);
    if (rj && this.rejectT - dt < 0) { fx?.unstable(); this.shake = 1; } if (rj && this.rejectT >= .35 && this.rejectT - dt < .35) { fx?.steam(); for (let k = 0; k < 30; k++) this.spawn(new T.Vector3(0, CH_Y + CH_H / 2 + .05, CH_Z), .45); } if (rj && this.rejectT >= .5 && this.rejectT - dt < .5) fx?.drain();
    const du = this.drainFlow.uniforms; du.uTime.value = this.t; du.uHead.value = rj && this.rejectT > .5 ? Math.min(1, (this.rejectT - .5) / .3) : 0; du.uTail.value = rj ? Math.max(0, (this.rejectT - 1.6) / .3) : 0;
    this.badLamp.emissiveIntensity = rj ? (Math.sin(this.t * 22) > 0 ? 3.5 : .3) : v?.outcome === 'FAILED' ? 2.5 : 0; this.redLight.intensity = rj ? this.badLamp.emissiveIntensity * .5 : 0;
    this.shake = Math.max(0, this.shake - dt * .9); this.chamber.position.x = (Math.random() - .5) * .006 * this.shake; this.chamber.position.y = CH_Y + (Math.random() - .5) * .004 * this.shake;
    // ---- success: clamps lock, pump strokes, mixture travels to the cooling line
    this.successT += dt; const ok = v?.outcome === 'STABILIZED';
    this.clamps.forEach(c => { const s = c.userData.s, k = ok ? Math.min(1, this.successT / .4) : 0; c.position.x = s * (CH_R + .03 - .018 * k); });
    if (ok && this.successT >= .5 && this.successT - dt < .5) fx?.pump();
    this.piston.position.y = -.28 + (ok && this.successT > .5 && this.successT < 2.2 ? Math.sin((this.successT - .5) * 18) * .018 : 0);
    const ou = this.outFlow.uniforms; ou.uTime.value = this.t; ou.uColor.value.copy(this.lu.uColA.value).lerp(this.lu.uColB.value, this.lu.uFracB.value); ou.uHead.value = ok ? Math.max(0, Math.min(1, (this.successT - .8) / .8)) : 0; ou.uTail.value = ok ? Math.max(0, Math.min(1, (this.successT - 1.9) / .8)) : 0;
    if (ok && this.successT >= 2.2 && this.successT - dt < 2.2) fx?.accepted();
    this.okLamp.emissiveIntensity = ok && this.successT > 2 ? 3 : 0;
    // ---- status window
    const status: [string, string] = !v ? [tr('ОЖИДАНИЕ', 'STANDBY'), '#776655'] : ok ? (this.successT < 2 ? [tr('ФОРМУЛА ПРИНЯТА', 'FORMULA ACCEPTED'), '#8dffb4'] : [tr('ОХЛАЖДЕНИЕ ВОССТАНОВЛЕНО', 'COOLING SYSTEM RESTORED'), '#8dffb4']) : v.outcome === 'FAILED' ? [tr('ОТКАЗ ОХЛАЖДЕНИЯ', 'COOLING SYSTEM FAILED'), '#ff5a3a']
      : rj ? (v.event?.reason === 'UNSTABLE_UNPROTECTED' ? [tr('НЕСТАБИЛЬНО', 'UNSTABLE'), '#ff5a3a'] : [tr('ФОРМУЛА ОТВЕРГНУТА', 'FORMULA REJECTED'), '#ff5a3a']) : this.pour || (this.stirSpeed > .2 && this.fill > .05) ? [tr('СМЕШИВАНИЕ', 'MIXING'), '#ffd27a'] : [tr('ГОТОВ', 'READY'), '#ffb347'];
    this.drawStatus(status[0], status[1]);
    this.emitSteam(dt);
  }

  private spawn(at: T.Vector3, speed: number) { const N = this.sp.length / 3, i = this.cursor; this.cursor = (i + 1) % N; this.sp.set([at.x, at.y, at.z], i * 3); this.life.set([0, (Math.random() - .5) * .3, speed * (.6 + Math.random() * .6), .05 + Math.random() * .2], i * 4); }
  private emitSteam(dt: number) {
    const N = this.sp.length / 3, L = this.life, age = this.steam.geometry.attributes.age as T.BufferAttribute;
    for (let i = 0; i < N; i++) { let l = L[i * 4]; if (l >= 1) { age.setX(i, 0); continue; } l = Math.min(1, l + dt / 1.4); L[i * 4] = l; const d = Math.exp(-dt * 1.5); L[i * 4 + 1] *= d; L[i * 4 + 3] *= d; L[i * 4 + 2] = L[i * 4 + 2] * d + .06 * dt;
      this.sp[i * 3] += L[i * 4 + 1] * dt; this.sp[i * 3 + 1] += L[i * 4 + 2] * dt; this.sp[i * 3 + 2] += L[i * 4 + 3] * dt; age.setX(i, l >= 1 ? 0 : Math.max(.001, l)); }
    (this.steam.geometry.attributes.position as T.BufferAttribute).needsUpdate = true; age.needsUpdate = true;
  }
}
void canvasTex;
