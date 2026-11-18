import {LifeSpark} from './life-spark';
import * as THREE from 'three';
import script from './intro-script.json';
import type {Course} from './course';
import {FORMAT_NAME} from './survival';

export const INTRO = script.duration;
const ease = (x: number) => {x = THREE.MathUtils.clamp(x, 0, 1); return x * x * (3 - 2 * x);};

/** Presentation only: flies through this seed's actual course. The teaching spark never enters game state. */
export class RaceIntro {
  private line = -1;
  private format = '';
  private spoken = -1;
  private spark?: LifeSpark;
  private path?: THREE.CatmullRomCurve3;
  private active = false;
  private demo = false;
  private artifactScene?: THREE.Scene;
  private artifactCamera?: THREE.PerspectiveCamera;
  private presentation?: {exposure:number; visibility:Map<THREE.Object3D,boolean>};
  private setPresentation(on:boolean){
    const a=this.app;
    if(on && !this.presentation){
      const visibility=new Map<THREE.Object3D,boolean>();
      for(const object of [a.sunGlow,...a.rays,a.pollen,...a.soft])if(object){visibility.set(object,object.visible);object.visible=false;}
      this.presentation={exposure:a.renderer.toneMappingExposure,visibility};a.renderer.toneMappingExposure*=.93;a.snd.setCinematic(true);
    }else if(!on && this.presentation){a.renderer.toneMappingExposure=this.presentation.exposure;for(const [o,v] of this.presentation.visibility)o.visible=v;this.presentation=undefined;a.snd.setCinematic(false);}
  }
  private announcedSpark = false;

  constructor(private app: any) {}
  private get selectedFormat() {return this.app.surv?.run?.format ?? new URLSearchParams(location.search).get('format') ?? 'DEATH_RUN';}
  get duration() {return (script.formats as Record<string, {filmDuration:number}>)[this.selectedFormat]?.filmDuration ?? INTRO;}

  private build() {
    const c: Course = this.app.course;
    // Dense, gently varying flight rail. Arc-length traversal keeps the speed constant across shots.
    const points: THREE.Vector3[] = [];
    const n = Math.max(12, Math.ceil(c.finishZ / 8));
    for (let i = 0; i <= n; i++) {
      const z = -8 + (c.finishZ + 8) * i / n;
      let floor = -Infinity;
      for (let k = -6; k <= 6; k += 2) floor = Math.max(floor, c.spawnY(Math.max(0, z + k)));
      const x = Math.sin(i / n * Math.PI * 1.3) * (this.app.manor ? .35 : 1.8);
      points.push(new THREE.Vector3(x, floor + (this.app.manor ? 5.8 : 8), z));
    }
    for (let pass = 0; pass < 3; pass++) for (let i = 1; i < points.length - 1; i++) points[i].y = (points[i-1].y + 2*points[i].y + points[i+1].y)/4;
    this.path = new THREE.CatmullRomCurve3(points, false, 'centripetal');
    this.spark = new LifeSpark();this.artifactScene=new THREE.Scene();this.artifactScene.environment=this.app.scene.environment;this.artifactScene.add(this.spark);
    this.artifactScene.add(new THREE.HemisphereLight(0xc5d1d4,0x151514,2));
    const key=new THREE.DirectionalLight(0xe1d8c5,4);key.position.set(-2,3,4);this.artifactScene.add(key);
    const rim=new THREE.DirectionalLight(0x708594,2);rim.position.set(3,1,-2);this.artifactScene.add(rim);
    this.artifactCamera=new THREE.PerspectiveCamera(38,1,.1,10);this.artifactCamera.position.set(.08,.03,2.3);this.artifactCamera.lookAt(0,0,0);
  }
  update(t: number, skipped: boolean) {
    const el = document.getElementById('intro'); if (!el) return false;
    const show = t >= 0 && t < this.duration && !skipped;
    el.hidden = !show; document.body.classList.toggle('intro-on', show);
    if (!show) {
      if (this.active) {this.app.snd.voice(''); this.app.camera.fov = 55; this.app.camera.updateProjectionMatrix();}
      this.setPresentation(false); this.active = false; this.demo=false; if (this.spark) this.spark.visible = false;
      return false;
    }
    this.active = true; this.setPresentation(true);
    const format = this.selectedFormat;
    const delta = this.duration - INTRO;
    const beats = script.beats.map((b,k)=>k===script.beats.length-1 ? {...b,at:b.at+delta} : b);
    let i = -1; beats.forEach((b, k) => {if (t >= b.at) i = k;});
    const beat = beats[i];
    const formatScript = (script.formats as Record<string, {text: string; clip: string}>)[format] ?? script.formats.DEATH_RUN;
    if (i !== this.line || format !== this.format) {
      this.line = i; this.format = format; this.spoken = -1;
      const set = (id: string, text: string) => {const e = document.getElementById(id); if (e) e.textContent = text;};
      set('intro-map', script.maps[this.app.course.map - 1]);
      set('intro-chapter', `${String(Math.max(1, i + 1)).padStart(2, '0')} / ${String(script.beats.length).padStart(2, '0')}`);
      set('intro-title', beat?.clip === 'format' ? FORMAT_NAME[format] ?? FORMAT_NAME.DEATH_RUN : beat?.title ?? 'ПРОКЛЯТЫЙ ЗАБЕГ');
      set('intro-sub', beat?.clip === 'format' ? formatScript.text : beat?.text ?? '');
      el.classList.remove('beat-in'); void el.offsetWidth; el.classList.add('beat-in');
    }
    // A tap can unlock audio after a beat has started. Seek to the matching offset, never start a late full sentence.
    if (beat && this.spoken !== i && this.app.snd.ready) {
      this.spoken = i;
      this.app.snd.voice(`audio/${beat.clip === 'format' ? formatScript.clip : beat.clip}.m4a`, Math.max(0, t - beat.at));
    }
    const progress = document.getElementById('intro-bar')!; progress.style.width = `${t / this.duration * 100}%`;
    const demo = t >= script.beats[script.beats.length - 1].at + this.duration - INTRO;
    this.demo=demo;
    document.getElementById('intro-example')!.hidden = !demo;
    const fade = t < .9 ? 1 - ease(t / .9) : t > this.duration - .3 ? ease((t - this.duration + .3) / .3) : 0;
    el.style.setProperty('--curtain', String(fade));
    if (demo && !this.announcedSpark) {this.announcedSpark = true; this.app.snd.sparkAppear();}
    return true;
  }
  // ---------------- cinematic camera: one shot per voiced beat, cuts through a dip to black ----------------
  private showcase?: {z: number; y: number; name: string}[];
  private cutAt = -1;
  /** Beat start times as the voice plays them (the last beat shifts with the format film length). */
  private beatTimes() {const d = this.duration - INTRO; return script.beats.map((b, k) => k === script.beats.length - 1 ? b.at + d : b.at);}
  private overlay() {
    let o = document.getElementById('intro-cine');
    if (!o) {o = document.createElement('div'); o.id = 'intro-cine'; o.innerHTML = '<i class="bar t"></i><i class="bar b"></i><i class="cut"></i><i class="vig"></i>'; document.getElementById('intro')?.prepend(o);
      const st = document.createElement('style'); st.textContent = `
#intro-cine{position:absolute;inset:0;pointer-events:none;z-index:0}
#intro-cine .bar{position:absolute;left:0;right:0;height:calc(var(--lb,0)*9vh);background:#000;transition:none}
#intro-cine .bar.t{top:0}#intro-cine .bar.b{bottom:0}
#intro-cine .cut{position:absolute;inset:0;background:#000;opacity:var(--cut,0)}
#intro-cine .vig{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 50%,#0000 55%,#0008 100%)}
@media (orientation:portrait){#intro-cine .bar{height:calc(var(--lb,0)*6vh)}}`; document.head.appendChild(st);}
    return o as HTMLElement;
  }
  /** Gameplay camera pose (same framing as RaceApp.sync) so the last shot lands exactly where play begins. */
  private playPose() {const a = this.app, me = a.me, portrait = a.camera.aspect < 1, back = a.manor ? (portrait ? 9 : 7.4) : portrait ? 11 : 8.6, up = a.manor ? (portrait ? 6 : 4.4) : portrait ? 7.2 : 5.4;
    const ty = Math.max(me.y, -4), tx = me.x * .75; return {pos: new THREE.Vector3(tx, ty + up, me.z - back), look: new THREE.Vector3(tx, ty + 1.3, me.z + 7)};}
  camera(t: number) {
    if (!this.path) this.build();
    const a = this.app, c: Course = a.course, cam: THREE.PerspectiveCamera = a.camera, portrait = cam.aspect < 1;
    const B = this.beatTimes(), D = this.duration, demo = t >= B[B.length - 1];
    if (!this.showcase) {const seen = new Set<string>(); this.showcase = [];
      for (const s of c.sections) if (!seen.has(s.name) && this.showcase.length < 3) {seen.add(s.name); const z = (s.z0 + s.z1) / 2; this.showcase.push({z, y: c.spawnY(z), name: s.name});}}
    let shot = 0; for (let k = 1; k < B.length; k++) if (t >= B[k]) shot = k;
    const t0 = shot === 0 ? 0 : B[shot], t1 = shot + 1 < B.length ? B[shot + 1] : D, u = THREE.MathUtils.clamp((t - t0) / Math.max(.01, t1 - t0), 0, 1), e = ease(u);
    const pos = new THREE.Vector3(), look = new THREE.Vector3(); let fov = portrait ? 62 : 50, cutKey = shot * 10;
    const start = new THREE.Vector3(0, c.spawnY(4), 4);
    if (shot === 0) { // establishing crane: wide, high, swinging down onto the start line
      const ang = -1.05 + e * 1.15, rad = 26 - e * 12, h = 15 - e * 8;
      pos.set(start.x + Math.sin(ang) * rad, start.y + h, start.z - Math.cos(ang) * rad); look.copy(start).add(new THREE.Vector3(0, 1.5, 7)); fov += 6 - e * 6;
    } else if (shot === 1) { // the road to salvation: a fast dolly over the whole course to the finish arch
      const k = .02 + .96 * (u < .5 ? 2 * u * u : 1 - (-2 * u + 2) ** 2 / 2), p = this.path!.getPointAt(k), q = this.path!.getPointAt(Math.min(1, k + .05));
      pos.copy(p); look.copy(p).addScaledVector(q.sub(p).normalize(), 16); look.y -= 3; fov += 4;
    } else if (shot === 2) { // controls: low orbit around the runners on the start line
      const me = a.me, ang = Math.PI * .78 + e * .9, rad = 5.2 - e * 1.2; pos.set(me.x + Math.sin(ang) * rad, me.y + 1.5 + e * .6, me.z + Math.cos(ang) * rad); look.set(me.x, me.y + 1.05, me.z + .6); fov -= 8;
    } else if (shot === 3 && this.showcase.length) { // the rule of the run: push-ins on the course's hazards, a hard cut between each
      const n = this.showcase.length, idx = Math.min(n - 1, Math.floor(u * n)), v = u * n - idx, h = this.showcase[idx], side = idx % 2 ? -1 : 1, ev = ease(v);
      pos.set(side * (9 - ev * 3), h.y + 7 - ev * 2, h.z - 12 + ev * 4); look.set(0, h.y + .5, h.z + 1); fov -= 4; cutKey += idx;
    } else { // life spark: high crane down the course, landing exactly in the gameplay framing
      const p = this.playPose(), hi = new THREE.Vector3(p.pos.x + 6, p.pos.y + 16, p.pos.z - 14), k = ease(THREE.MathUtils.clamp((t - t0) / Math.max(.01, t1 - t0 - .2), 0, 1));
      pos.copy(hi).lerp(p.pos, k); look.copy(p.look).add(new THREE.Vector3(0, (1 - k) * -2, (1 - k) * 10)); fov = THREE.MathUtils.lerp(fov + 6, portrait ? 65 : 55, k);
    }
    // manor/crypt rooms: keep the lens inside the walls and under the ceiling
    if (a.manor) {const rm = c.rooms.find(r => pos.z >= r.z0 && pos.z <= r.z1) ?? c.rooms.find(r => look.z >= r.z0 && look.z <= r.z1); if (rm) {const lim = rm.halfW - 1.1; pos.x = THREE.MathUtils.clamp(pos.x, -lim, lim); pos.y = Math.min(pos.y, rm.y + rm.h - .8);}}
    // gentle handheld drift (not on the final landing, so the hand-off to play is seamless)
    const hand = shot === B.length - 1 ? 1 - ease((t - t0) / Math.max(.01, t1 - t0)) : 1;
    pos.x += Math.sin(t * 1.3) * .06 * hand; pos.y += Math.sin(t * 1.7 + 1) * .05 * hand; look.x += Math.sin(t * .9 + 2) * .08 * hand;
    cam.position.copy(pos); cam.lookAt(look); cam.fov = fov; cam.updateProjectionMatrix();
    // cut: dip through black at every new shot; letterbox slides in at the start and out before play
    if (cutKey !== this.cutAt) {this.cutAt = cutKey; (this as any).cutT = t;}
    const ov = this.overlay(), since = t - ((this as any).cutT ?? -9), sub = shot === 3 && this.showcase.length ? (t1 - t0) / this.showcase.length : t1 - t0, toNext = sub - ((t - t0) % sub || 0),
      pre = shot < B.length - 1 || (shot === 3) ? Math.max(0, 1 - toNext / .22) : 0, cut = Math.max(pre, shot === 0 && cutKey === 0 ? 0 : Math.max(0, 1 - since / .35));
    ov.style.setProperty('--cut', cut.toFixed(3)); ov.style.setProperty('--lb', (Math.min(ease(t / 1.2), 1 - ease((t - (D - 1.4)) / 1.2))).toFixed(3));
    this.spark!.visible = demo;
    this.spark!.position.set(0,0,0);this.spark!.scale.setScalar(1);this.spark!.animate(t);
    a.camTarget.set(a.me.x * .75, Math.max(a.me.y, -4), a.me.z);
  }
  renderArtifact(){
    if(!this.active||!this.demo||!this.artifactScene||!this.artifactCamera)return;
    const r:THREE.WebGLRenderer=this.app.renderer,size=r.getSize(new THREE.Vector2()),portrait=size.x<size.y;
    const box=portrait ? {x:.2,y:.22,w:.6,h:.34} : {x:.73,y:.2,w:.22,h:.46};
    const x=Math.round(size.x*box.x),top=Math.round(size.y*box.y),w=Math.round(size.x*box.w),h=Math.round(size.y*box.h);
    const label=document.getElementById('intro-example')!;
    Object.assign(label.style,{left:`${x}px`,top:`${top}px`,width:`${w}px`,height:`${h}px`,transform:'none'});
    const viewport=r.getViewport(new THREE.Vector4()),scissor=r.getScissor(new THREE.Vector4()),test=r.getScissorTest(),clear=r.getClearColor(new THREE.Color()),alpha=r.getClearAlpha(),auto=r.autoClear;
    r.autoClear=false;r.setScissorTest(true);r.setViewport(x,size.y-top-h,w,h);r.setScissor(x,size.y-top-h,w,h);r.setClearColor(0x121719,1);r.clear(true,true,false);
    this.artifactCamera.aspect=w/h;this.artifactCamera.updateProjectionMatrix();r.render(this.artifactScene,this.artifactCamera);
    r.setViewport(viewport);r.setScissor(scissor);r.setScissorTest(test);r.setClearColor(clear,alpha);r.autoClear=auto;
  }

}
