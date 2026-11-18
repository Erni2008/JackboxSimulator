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
  camera(t: number) {
    if (!this.path) this.build();
    const a = this.app, c: Course = a.course, cam: THREE.PerspectiveCamera = a.camera;
    const demo = t >= script.beats[script.beats.length - 1].at + this.duration - INTRO;
    const u = Math.min(.999, Math.max(0, t / this.duration));
    const pos = this.path!.getPointAt(u);
    const ahead = this.path!.getPointAt(Math.min(1, u + .045));
    const direction = ahead.clone().sub(pos).normalize();
    const target = pos.clone().addScaledVector(direction, 14); target.y -= 2.4;
    cam.position.copy(pos); cam.lookAt(target); cam.fov = a.camera.aspect < 1 ? 65 : 55; cam.updateProjectionMatrix();
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
