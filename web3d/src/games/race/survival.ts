// CURSED RUN client: presentation of the server-authoritative survival state (formats, ghosts, Life Spark, revival,
// fronts, gates, seats, personal timers) + host auto camera and host voice events. All effects are cheap: a handful of
// meshes/sprites, material tweaks on existing character models, no physics.
import * as THREE from 'three';
import type {Runner} from './course';

export const FORMAT_NAME: Record<string, string> = {DEATH_RUN: 'СМЕРТЕЛЬНЫЙ ЗАБЕГ', DARKNESS: 'НАСТУПАЮЩАЯ ТЬМА', LAST_SURVIVORS: 'ПОСЛЕДНИЕ ВЫЖИВШИЕ', COLLAPSE: 'РАЗРУШАЮЩИЙСЯ МИР', LAST_CHANCE: 'ПОСЛЕДНИЙ ШАНС', SALVATION: 'СПАСИТЕЛЬНЫЕ ВОРОТА'};
const FORMAT_RULE: Record<string, string> = {DEATH_RUN: 'Успей до финиша — или умри', DARKNESS: 'Тьма поглощает отставших', LAST_SURVIVORS: 'На рубежах места заканчиваются', COLLAPSE: 'Трасса рушится за спиной', LAST_CHANCE: 'Своё время у каждого: чекпоинты дают секунды', SALVATION: 'В убежище мест меньше, чем живых'};
const FORMAT_VOICE: Record<string, number> = {DEATH_RUN: 1, DARKNESS: 2, LAST_SURVIVORS: 3, COLLAPSE: 4, LAST_CHANCE: 5, SALVATION: 6};
const DEATH_TEXT: Record<string, [string, string]> = {TIME: ['ВРЕМЯ ИСТЕКЛО', 'теперь ты призрак'], DARKNESS: ['ТЬМА ПОГЛОТИЛА ТЕБЯ', 'теперь ты призрак'], COLLAPSE: ['МИР РУХНУЛ ПОД ТОБОЙ', 'теперь ты призрак'],
  GATE: ['ВОРОТА ЗАКРЫЛИСЬ', 'мест больше нет'], SEATS: ['ТЫ НЕ УСПЕЛ!', 'убежище заполнено']};

export class Survival {
  run: any = null; pending: any = null; private prev = new Map<string, string>(); private seenEv = 0; private ghostLook = new Map<Runner, boolean>();
  private spark?: THREE.Group; private sparkCore!: THREE.Mesh; private sparkShards: THREE.Mesh[] = []; private sparkHalo!: THREE.Sprite; private sparkSent = 0;
  private front?: THREE.Group; private frontMats: THREE.Material[] = []; private ash!: THREE.Points; private revivals: {r: Runner; t: number; ring: THREE.Mesh}[] = [];
  private voiceQ: number[] = []; private voiceBusy = 0; private saidStart = false; private camFocus?: Runner; private camSince = 0; private manual: Runner | null = null;
  private lastBeep = 0; private shown = new Set<string>();
  constructor(private app: any) {}

  // ---------------- server state ----------------
  apply(run: any) {
    if (!run) return; const a = this.app; if (!a.me || !a.runners?.length) {this.pending = run; return;} const first = !this.run; this.run = run;
    a.limit = run.limitMs / 1000;
    if (first) this.announce();
    for (const r of a.runners as Runner[]) {const p = run.players[r.id]; if (!p) continue; const was = this.prev.get(r.id); this.prev.set(r.id, p.status);
      (r as any).ghost = !p.alive; this.setGhostLook(r, !p.alive && !this.revivals.some(v => v.r === r));
      if (was && was !== p.status) this.transition(r, was, p);}
    for (const e of run.events) if (e.seq > this.seenEv) {this.seenEv = e.seq; this.event(e);}
    document.body.classList.toggle('me-ghost', !!(a.me as any).ghost);
  }
  private announce() {
    const f = this.run.format; this.app.toast?.(FORMAT_NAME[f]);
    const b = document.getElementById('format'); if (b) {b.innerHTML = `<b>${FORMAT_NAME[f]}</b><span>${FORMAT_RULE[f]}</span>`; b.hidden = false;}
  }
  private transition(r: Runner, was: string, p: any) {
    const me = r === this.app.me, a = this.app;
    if (p.status === 'REVIVED') this.startRevival(r);
    if (p.status === 'DEAD') {a.puff(r.x, r.y, r.z, 2); if (me) this.big(...(DEATH_TEXT[p.reason] ?? ['ТЫ ПОГИБ', 'теперь ты призрак']), 'bad'); a.snd.deathSting?.(); if (p.reason === 'SEATS' || p.reason === 'GATE') a.snd.metal(0);}
    if (p.status === 'SAVED' && me) {const f = this.run.format, last = this.run.events.some((e: any) => e.type === 'LAST_SURVIVOR' && e.who === r.id);
      if (last) this.big('ПОСЛЕДНИЙ ВЫЖИВШИЙ', r.name, 'win'); else if (f === 'DARKNESS') this.big('ТЫ СБЕЖАЛ!', 'тьма осталась позади', 'win'); else if (f === 'SALVATION') this.big('ТЫ СПАСЁН!', `место ${p.place} из ${this.run.seats}`, 'win'); else this.big('ТЫ ВЫЖИЛ!', '', 'win');
      a.snd.finish(true);}
    if (p.status === 'GHOST_FINISHED' && me) this.big('ФИНИШ ДОСТИГНУТ', 'но ты всё ещё призрак…', 'ghost');
    if (p.status === 'GHOST_CAUGHT' && me) this.big('ТЬМА ДОГНАЛА ТЕБЯ', 'забег окончен', 'ghost');
  }
  private event(e: any) {
    const a = this.app, name = (id: string) => (a.runners as Runner[]).find(r => r.id === id)?.name ?? '';
    const feed = (t: string) => {const f = document.getElementById('feed'); if (!f) return; const d = document.createElement('div'); d.textContent = t; f.prepend(d); while (f.children.length > 5) f.lastChild!.remove(); setTimeout(() => d.classList.add('old'), 6000);};
    switch (e.type) {
      case 'SPARK': a.toast?.('ИСКРА ЖИЗНИ ПОЯВИЛАСЬ!'); feed('✦ Искра жизни появилась'); this.say(7); a.snd.sparkAppear?.(); break;
      case 'REVIVED': feed(e.who === a.me?.id && !a.net?.spectator ? '✦ Ты воскрес!' : `✦ ${name(e.who)} воскрес!`); this.say(8); this.focus(e.who, 3); break;
      case 'DIED': feed(`✝ ${name(e.who)} погиб`); if (!this.shown.has('died')) {this.shown.add('died'); this.say(10);} break;
      case 'SAVED': feed(`✓ ${name(e.who)} спасён${e.seat ? ` · место ${e.seat}` : ''}`); if (!this.shown.has('saved')) {this.shown.add('saved'); this.say(9);} if (this.run.format === 'SALVATION') a.snd.metal(0); break;
      case 'GATE_CLOSED': feed(`⛓ Рубеж ${e.gate} закрыт`); a.snd.metal(0); break;
      case 'LAST_SURVIVOR': feed(`★ ${name(e.who)} — последний выживший`); a.snd.finish(true); break;
      case 'END': feed('Испытание окончено'); break;
    }
  }

  // ---------------- per frame ----------------
  tick(dt: number, now: number, raceT: number) {
    if (this.pending && this.app.me) {const p = this.pending; this.pending = null; this.apply(p);}
    const a = this.app, run = this.run; if (!run) return;
    if (!this.saidStart && raceT > 0 && raceT < 3) {this.saidStart = true; this.say(0); this.say(FORMAT_VOICE[run.format]);}
    this.tickSpark(dt, now); this.tickFront(dt, raceT); this.tickRevivals(dt); this.hud(now, raceT); this.tickVoice(dt);
    if (a.net?.spectator) this.hostCamera(dt);
  }
  private frontZ(raceT: number) {const f = this.run.front; const t = raceT - f.delayMs / 1000; if (t <= 0) return f.z0; const tM = (f.vMax - f.v0) / f.a;
    return f.z0 + (t < tM ? f.v0 * t + .5 * f.a * t * t : f.v0 * tM + .5 * f.a * tM * tM + f.vMax * (t - tM));}
  private tickFront(dt: number, raceT: number) {
    const fmt = this.run.format; if (fmt !== 'DARKNESS' && fmt !== 'COLLAPSE') return; const a = this.app, z = this.frontZ(raceT);
    if (!this.front) this.buildFront(fmt);
    const y = a.course.spawnY(Math.max(0, z)); this.front!.position.set(0, y, z);
    const t = performance.now() / 1000; this.frontMats.forEach((m: any, i) => {if (m.map) m.map.offset.x = (t * (.05 + i * .03)) % 1; if (i === 2) m.opacity = .25 + .25 * Math.max(0, Math.sin(t * 7) * Math.sin(t * 2.3));});
    const p = this.ash.geometry.getAttribute('position') as THREE.BufferAttribute; for (let i = 0; i < p.count; i++) {let yy = p.getY(i) + dt * (1 + (i % 5) * .4); if (yy > 14) yy = 0; p.setY(i, yy); p.setZ(i, ((p.getZ(i) + dt * 3) % 6));} p.needsUpdate = true;
    if (fmt === 'COLLAPSE') for (const b of a.course.blocks) { // world falls apart behind the front; cracks and shaking just ahead of it
      if (b.z1 < z - 1 && !b.collapsed) {b.collapsed = true; b.crumbles = true; b.crumbleDelay = 0; b.crumbleAt = a.course.time - .01; b.restoreAfter = 1e9; a.puff((b.x0 + b.x1) / 2, b.y0, (b.z0 + b.z1) / 2, 2.5); a.snd.crumble(Math.abs(a.me.z - b.z1));}
      else if (!b.collapsed && b.z0 < z + 10 && b.crumbleAt < 0 && !b.land) {b.shakeUntil = a.course.time + .2;}}
    const gap = a.me.z - z, warn = !a.net?.spectator && !(a.me as any).ghost && gap < 14 && !a.me.finished;
    document.body.classList.toggle('front-warn', warn); const el = document.getElementById('front-gap'); if (el) {el.hidden = !warn; el.textContent = `${fmt === 'DARKNESS' ? 'ТЬМА' : 'ОБВАЛ'} В ${Math.max(0, gap).toFixed(0)} М`;}
    a.snd.rumble?.(Math.max(0, 1 - Math.max(0, gap) / 30));
  }
  private buildFront(fmt: string) {
    const a = this.app, g = new THREE.Group(), dark = fmt === 'DARKNESS';
    const c = document.createElement('canvas'); c.width = 256; c.height = 256; const x = c.getContext('2d')!;
    for (let i = 0; i < 90; i++) {const px = Math.random() * 256, py = Math.random() * 256, r = 20 + Math.random() * 70, gr = x.createRadialGradient(px, py, 0, px, py, r);
      gr.addColorStop(0, dark ? 'rgba(10,0,8,.9)' : 'rgba(90,70,55,.8)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = gr; x.fillRect(px - r, py - r, r * 2, r * 2);}
    const tex = new THREE.CanvasTexture(c); tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    for (let k = 0; k < 3; k++) {const m = new THREE.MeshBasicMaterial({map: k < 2 ? tex.clone() : null, color: k === 2 ? 0xff1a0a : dark ? 0x050206 : 0x3a2c22, transparent: true, opacity: k === 2 ? .3 : .92 - k * .25, depthWrite: false, side: THREE.DoubleSide, blending: k === 2 ? THREE.AdditiveBlending : THREE.NormalBlending, fog: false});
      if (m.map) m.map.repeat.set(2, 1); this.frontMats.push(m);
      const w = new THREE.Mesh(new THREE.PlaneGeometry(80, 40), m); w.position.set(0, 12, -k * 2.5); g.add(w);}
    const n = 160, pos = new Float32Array(n * 3); for (let i = 0; i < n; i++) {pos[i * 3] = (Math.random() - .5) * 30; pos[i * 3 + 1] = Math.random() * 14; pos[i * 3 + 2] = Math.random() * 6;}
    const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    this.ash = new THREE.Points(pg, new THREE.PointsMaterial({color: dark ? 0xff5a2a : 0xb8a080, size: .14, transparent: true, opacity: .8, depthWrite: false})); this.ash.frustumCulled = false; g.add(this.ash);
    a.scene.add(g); this.front = g;
  }

  // ---------------- Life Spark ----------------
  private buildSpark() {
    const g = new THREE.Group(); this.sparkCore = new THREE.Mesh(new THREE.IcosahedronGeometry(.22, 2), new THREE.MeshStandardMaterial({color: 0xfff4d0, emissive: 0xffd780, emissiveIntensity: 1.6, roughness: .3}));
    g.add(this.sparkCore);
    const hc = document.createElement('canvas'); hc.width = hc.height = 64; const x = hc.getContext('2d')!; x.fillStyle = '#ff3b3b'; x.beginPath(); x.moveTo(32, 52); x.bezierCurveTo(4, 32, 14, 8, 32, 22); x.bezierCurveTo(50, 8, 60, 32, 32, 52); x.fill();
    const heart = new THREE.Sprite(new THREE.SpriteMaterial({map: new THREE.CanvasTexture(hc), transparent: true, depthTest: false})); heart.scale.setScalar(.22); heart.userData.heart = true; g.add(heart);
    for (let i = 0; i < 5; i++) {const s = new THREE.Mesh(new THREE.OctahedronGeometry(.09, 0), new THREE.MeshStandardMaterial({color: 0xfff0c0, emissive: 0xffc860, emissiveIntensity: .8, transparent: true, opacity: .6}));
      s.scale.set(.6, 1.6, .6); this.sparkShards.push(s); g.add(s);}
    const c = document.createElement('canvas'); c.width = c.height = 64; const y = c.getContext('2d')!; const gr = y.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, 'rgba(255,240,200,.9)'); gr.addColorStop(.4, 'rgba(255,210,120,.3)'); gr.addColorStop(1, 'rgba(255,200,100,0)'); y.fillStyle = gr; y.fillRect(0, 0, 64, 64);
    this.sparkHalo = new THREE.Sprite(new THREE.SpriteMaterial({map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending})); this.sparkHalo.scale.setScalar(1.4); g.add(this.sparkHalo);
    this.app.scene.add(g); this.spark = g;
  }
  private tickSpark(dt: number, now: number) {
    const a = this.app, sp = this.run.spark; const show = sp.active;
    if (show && !this.spark) this.buildSpark(); if (!this.spark) {const h = document.getElementById('spark-hint'); if (h) h.hidden = true; return;}
    this.spark.visible = show; if (!show) {const h = document.getElementById('spark-hint'); if (h) h.hidden = true; return;}
    const t = performance.now() / 1000, y = a.course.spawnY(sp.z) + 1.25 + Math.sin(t * 1.6) * .15; this.spark.position.set(0, y, sp.z);
    const me = a.me, ghostMe = (me as any).ghost && !a.net?.spectator && !this.run.players[me.id]?.revived && this.run.players[me.id]?.status !== 'GHOST_CAUGHT';
    const d = Math.hypot(me.x, me.z - sp.z, me.y - (y - 1.25)), near = ghostMe && d < 9, rate = near ? 7 : 2.6;
    const pulse = 1 + .12 * Math.sin(t * rate); this.sparkCore.scale.setScalar(pulse); this.sparkCore.rotation.y += dt * .8;
    (this.sparkCore.material as THREE.MeshStandardMaterial).emissiveIntensity = (near ? 2.2 : 1.6) + (Math.sin(t * 13) > .97 ? 1.5 : 0);
    this.sparkShards.forEach((s, i) => {const ang = t * (.9 + i * .07) + i * 1.257, r = .45 + .05 * Math.sin(t * 2 + i); s.position.set(Math.cos(ang) * r, Math.sin(t * 1.3 + i) * .18, Math.sin(ang) * r); s.rotation.set(t + i, t * .7, 0);});
    this.sparkHalo.scale.setScalar(1.2 + .25 * pulse + (near ? .3 : 0));
    if (near) a.snd.sparkHum?.(1 - d / 9);
    // pickup: physically reach it as a ghost; the server decides
    if (ghostMe && d < 1.6 && now - this.sparkSent > 400) {this.sparkSent = now; a.net?.spark?.();}
    // ghost HUD direction hint (not exact through walls)
    const hint = document.getElementById('spark-hint'); if (hint) {hint.hidden = !ghostMe; if (ghostMe) hint.textContent = sp.z > me.z ? `✦ ИСКРА ВПЕРЕДИ · ${Math.round(sp.z - me.z)} м` : '✦ ИСКРА ПОЗАДИ';}
  }

  // ---------------- revival (≈1.7 s, control never taken away) ----------------
  private startRevival(r: Runner) {
    const a = this.app; const ring = new THREE.Mesh(new THREE.TorusGeometry(.6, .05, 8, 32).rotateX(Math.PI / 2), new THREE.MeshBasicMaterial({color: 0xffe2a0, transparent: true, opacity: .9, depthWrite: false, blending: THREE.AdditiveBlending}));
    a.scene.add(ring); this.revivals.push({r, t: 0, ring}); if (this.spark && this.run.spark.by === r.id) this.spark.visible = false;
    a.snd.revive?.(); if (r === a.me) navigator.vibrate?.([30, 60, 30]);
  }
  private tickRevivals(dt: number) {
    const a = this.app;
    for (const v of [...this.revivals]) {v.t += dt; const r = v.r, t = v.t;
      v.ring.position.set(r.x, r.y + .1 + Math.min(1.6, Math.max(0, t - .4) * 2), r.z); v.ring.scale.setScalar(1 + t * 1.4); (v.ring.material as THREE.MeshBasicMaterial).opacity = Math.max(0, .9 - t * .5);
      if (t < .4 && Math.random() < .5) a.puff(r.x + (Math.random() - .5), r.y + 1.5 + Math.random(), r.z + (Math.random() - .5), .4);
      const k = Math.min(1, Math.max(0, (t - .4) / .8)); this.ghostMaterial(r, 1 - k);
      if (t > 1.2 && !(v as any).flash) {(v as any).flash = true; a.puff(r.x, r.y + .8, r.z, 1.8); if (r === a.me) this.big('ВОСКРЕШЕНИЕ!', 'ТЫ СНОВА ЖИВ!', 'win');}
      if (t > 1.7) {a.scene.remove(v.ring); this.revivals.splice(this.revivals.indexOf(v), 1); this.setGhostLook(r, false, true);}}
  }
  private setGhostLook(r: Runner, ghost: boolean, force = false) {if (!force && this.ghostLook.get(r) === ghost) return; this.ghostLook.set(r, ghost); this.ghostMaterial(r, ghost ? 1 : 0);}
  private ghostMaterial(r: Runner, k: number) {
    const l = this.app.looks.get(r); if (!l) return;
    l.root.traverse((o: any) => {if (!o.isMesh) return; const m = o.material as THREE.MeshStandardMaterial; m.userData.base ??= m.color.clone();
      m.transparent = k > .01; m.opacity = 1 - .55 * k; m.depthWrite = k < .5; m.color.copy(m.userData.base).lerp(new THREE.Color(.55, .75, 1), .55 * k); m.emissiveIntensity = .15 + .35 * k;});
  }

  // ---------------- HUD ----------------
  private hud(now: number, raceT: number) {
    const a = this.app, run = this.run, me = a.me, p = run.players[me.id], spect = a.net?.spectator;
    const badge = document.getElementById('life'); if (badge && !spect && p) {const st = p.status, txt = st === 'SAVED' ? 'СПАСЁН' : p.alive ? (p.revived ? 'ВОСКРЕШЁН' : 'ЖИВ') : 'ПРИЗРАК';
      if (badge.textContent !== txt) {badge.textContent = txt; badge.className = st === 'SAVED' ? 'saved' : p.alive ? 'alive' : 'ghost';}}
    const extra = document.getElementById('run-info'); let info = '';
    if (run.format === 'SALVATION') {const left = run.seats - run.seatsUsed; info = `УБЕЖИЩЕ ${'■'.repeat(run.seatsUsed)}${'□'.repeat(Math.max(0, left))} · мест ${left}`;}
    if (run.format === 'LAST_SURVIVORS') {const g = run.closed.findIndex((c: boolean) => !c); info = g < 0 ? 'ВСЕ РУБЕЖИ ЗАКРЫТЫ' : `РУБЕЖ ${g + 1} · мест ${Math.max(0, run.quotas[g] - run.passed[g])} из ${run.quotas[g]}`;}
    if (run.format === 'LAST_CHANCE' && p && p.alive && p.status !== 'SAVED' && !spect) {const left = Math.max(0, (p.deadline - now) / 1000); info = `ТВОЁ ВРЕМЯ ${left.toFixed(1)} С`;
      document.body.classList.toggle('chance-low', left < 10); if (left < 10 && now - this.lastBeep > (left < 4 ? 350 : 900)) {this.lastBeep = now; a.snd.alarm(0);}} else document.body.classList.remove('chance-low');
    if (extra && extra.textContent !== info) {extra.textContent = info; extra.hidden = !info;}
    if (spect) {const ps = Object.values(run.players) as any[]; const c = (f: (x: any) => boolean) => ps.filter(f).length;
      const h = document.getElementById('host-stats'); if (h) {const s = `<b>${FORMAT_NAME[run.format]}</b><span>Живых ${c(x => x.alive && x.status !== 'SAVED')}</span><span>Спасено ${c(x => x.status === 'SAVED')}</span><span>Призраков ${c(x => !x.alive)}</span><span>Погибло ${c(x => x.status === 'DEAD')}</span>`; if (h.innerHTML !== s) h.innerHTML = s; h.hidden = false;}}
  }
  private big(title: string, sub: string, kind: string) {const el = document.getElementById('big'); if (!el) return; el.className = kind; el.innerHTML = `<b>${title}</b>${sub ? `<span>${sub}</span>` : ''}`; el.classList.remove('show'); void el.offsetWidth; el.classList.add('show');}

  // ---------------- host camera: auto-direct the interesting moments; 1–8 picks a player, 0 = auto ----------------
  key(k: string) {const rs = this.app.runners as Runner[]; if (k === '0') this.manual = null; const i = Number(k) - 1; if (i >= 0 && i < rs.length) this.manual = rs[i];}
  private focus(id: string, prio: number) {const r = (this.app.runners as Runner[]).find(x => x.id === id); if (r) {this.camFocus = r; this.camSince = -prio;}}
  private hostCamera(dt: number) {
    const a = this.app, run = this.run, rs = (a.runners as Runner[]).filter(r => !r.finished || r === this.camFocus); this.camSince += dt;
    if (this.manual) {a.me = this.manual; return;}
    if (this.camSince > 4 || !this.camFocus) { // min dwell 4 s: no jittery switching
      let best: Runner | undefined, score = -1, raceT = 0; void raceT; const sp = run.spark;
      for (const r of rs.length ? rs : a.runners) {const p = run.players[r.id]; if (!p) continue; let s = r.progress / Math.max(1, a.course.finishZ);
        if (sp.active && !p.alive && Math.abs(r.z - sp.z) < 12) s += 2;                                 // a ghost going for the spark
        if (run.format === 'DARKNESS' || run.format === 'COLLAPSE') s += Math.max(0, 1.5 - Math.abs(r.z - (this.front?.position.z ?? -99)) / 10); // the front is catching someone
        if (a.course.finishZ - r.z < 25) s += 1;                                                       // about to finish
        if ((rs.filter(o => o !== r && Math.abs(o.z - r.z) < 3).length)) s += .6;                       // a duel
        if (s > score) {score = s; best = r;}}
      if (best && best !== this.camFocus) {this.camFocus = best; this.camSince = 0;}}
    if (this.camFocus) a.me = this.camFocus;
  }

  // ---------------- host voice: one line at a time, never stacked ----------------
  say(i: number) {if (!this.voiceQ.includes(i)) this.voiceQ.push(i);}
  private tickVoice(dt: number) {this.voiceBusy -= dt; if (this.voiceBusy > 0 || !this.voiceQ.length) return; const i = this.voiceQ.shift()!; this.app.snd.voice(`audio/host_${i}.m4a`); this.voiceBusy = 5.2;}
}
