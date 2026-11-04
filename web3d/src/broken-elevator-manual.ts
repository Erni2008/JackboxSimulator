// Dedicated test scene for THE ENGINEER'S MANUAL (THE BROKEN ELEVATOR, mode 5).
import * as T from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {EngineersManual, TH} from './games/broken-elevator/manual/book';
import {ManualInteraction, type HoldState} from './games/broken-elevator/manual/interaction';
import {BookAudio} from './games/broken-elevator/manual/audio';
import {SAMPLE_MANUAL, loadManualContent, diagnosticsManual} from './games/broken-elevator/manual/content';
import {buildCage, contactShadow} from './games/broken-elevator/manual/test-scene';
import {FuseBox} from './games/broken-elevator/puzzles/fusebox';
import {makeRules, makeTask, manualRows} from './games/broken-elevator/puzzles/wire-puzzle';
import {buildGlbCage} from './games/broken-elevator/manual/glb-cage';
import {PressureMachine} from './games/broken-elevator/puzzles/pressure';
import {PressureLink} from './games/broken-elevator/puzzles/pressure-link';
import {LIMIT_MS as PRESSURE_LIMIT_MS} from './games/broken-elevator/puzzles/pressure-sim';

const $ = (id: string) => document.getElementById(id) as HTMLElement;
const params = new URLSearchParams(location.search);
const mobile = matchMedia('(pointer: coarse)').matches || Math.min(screen.width, screen.height) < 600;
let quality: 'high' | 'low' = params.get('quality') === 'low' || (mobile && params.get('quality') !== 'high') ? 'low' : 'high';

const renderer = new T.WebGLRenderer({antialias: !mobile, powerPreference: 'high-performance', preserveDrawingBuffer: params.has('capture')});
renderer.outputColorSpace = T.SRGBColorSpace; renderer.toneMapping = T.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.0;
renderer.shadowMap.enabled = true; renderer.shadowMap.type = T.PCFShadowMap; renderer.shadowMap.autoUpdate = false; let frameNo = 0;
// iPhones (Apple GPU) hold 2x; Android mid-range (e.g. Poco X3 Pro, Adreno 640) starts lower and may drop further
const ios = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const DPR_FLOOR = mobile ? (ios ? 1.5 : 1) : 1; let dpr = Math.min(devicePixelRatio, mobile ? (ios ? 2 : 1.6) : quality === 'high' ? 1.5 : 1.25); let shadowEvery = mobile ? 3 : 1; renderer.setPixelRatio(dpr);
$('viewport').append(renderer.domElement);
const scene = new T.Scene(), camera = new T.PerspectiveCamera(50, 1, .03, 40);
camera.position.set(0, 1.56, .5); camera.lookAt(0, .1, -.25);

function resize() { const w = innerWidth, h = innerHeight; renderer.setSize(w, h, false); renderer.domElement.style.width = w + 'px'; renderer.domElement.style.height = h + 'px'; camera.aspect = w / h; camera.fov = camera.aspect < .9 ? 58 : 46; camera.updateProjectionMatrix(); }
addEventListener('resize', resize); resize();

const audio = new BookAudio();
let timeScale = 1; // test hook: 0 freezes animation for frame-exact captures
async function boot() {
  $('load-text').textContent = 'Спуск…';
  // cage.glb is the elevator; the old procedural cage stays available with ?cage=procedural
  const procedural = params.get('cage') === 'procedural';
  $('load-text').textContent = 'Binding the manual…';
  // ?rules=<url> lets the server supply real puzzle rules (ManualContent JSON); otherwise the specimen
  const rules = params.get('rules') ? await loadManualContent(params.get('rules')!).catch(e => { console.warn(e); return SAMPLE_MANUAL; }) : SAMPLE_MANUAL;
  // wire puzzle: the manual prints the cutting RULES for this session; the box shows serial + wires
  const seed = +(params.get('seed') || Date.now() % 100000), wireRules = makeRules(seed);
  // INDUSTRIAL EMERGENCY DIAGNOSTICS: the 24-rule handbook (?rules=<url> still overrides for server-supplied content)
  const content = params.get('rules') ? rules : diagnosticsManual();
  // cage and book load in parallel (network + GPU upload overlap)
  performance.mark('cage0'); performance.mark('book0');
  const cageP: Promise<any> = procedural ? buildCage(renderer, scene, quality === 'high') : buildGlbCage(renderer, scene, quality === 'high');
  const [cage, book] = await Promise.all([cageP.then(c => { performance.measure('cage', 'cage0'); return c; }), EngineersManual.create(renderer, content, quality).then(b => { performance.measure('book', 'book0'); return b; })]);
  const floorY: number = cage.floorY ?? 0, eye: T.Vector3 = cage.eye ?? new T.Vector3(0, 1.56, .5);
  camera.position.copy(eye); let yaw = 0, pitch = -.5, yawT = 0, pitchT = -.5; const hoverRay = new T.Raycaster();
  book.sounds = {coverOpen: () => audio.play('coverOpen'), coverClose: () => audio.play('coverClose'), pageTurn: s => audio.play('pageTurn', s), creak: a => audio.play('creak', a)};
  scene.add(book.root);
  const shadow = contactShadow(); scene.add(shadow);
  const ui = new ManualInteraction(book, camera, renderer.domElement, audio, cage.planes);
  if (cage.shelf) { ui.place(cage.shelf.top.clone().add(new T.Vector3(0, TH / 2, 0)), new T.Quaternion().setFromEuler(new T.Euler(0, .04, 0))); const d = cage.shelf.top.clone().sub(eye); yaw = yawT = Math.atan2(-d.x, -d.z); pitch = pitchT = Math.atan2(d.y, Math.hypot(d.x, d.z)); }
  else ui.place(new T.Vector3(.06, TH / 2, -.22), new T.Quaternion().setFromEuler(new T.Euler(0, .5, 0)));
  const hints: Record<HoldState, string> = {rest: mobile ? 'Ведите пальцем, чтобы осмотреться · нажмите на книгу, щиток или вентили' : 'Тяните мышью, чтобы осмотреться · кликните по книге, щитку или вентилям', lifting: '', held: mobile ? 'Нажмите на обложку, чтобы открыть' : 'Кликните по обложке, чтобы открыть', reading: mobile ? 'Правая страница — вперёд, левая — назад · свайп · щипок для зума' : 'Правая страница — вперёд, левая — назад · колесо для зума', releasing: '', falling: ''};
  const sync = (s: HoldState) => { $('hint').textContent = ui.lowered ? (mobile ? 'Книга опущена · нажмите на неё, чтобы поднять' : 'Книга опущена · кликните по ней, чтобы поднять') : hints[s]; $('btn-lower').hidden = !['held', 'reading'].includes(s); $('btn-lower').textContent = ui.lowered ? 'Поднять' : 'Опустить'; $('btn-open').hidden = s !== 'held'; $('btn-close').hidden = s !== 'reading'; $('btn-drop').hidden = !['held', 'reading'].includes(s); document.body.dataset.state = s; };
  ui.onstate = sync; sync('rest'); ui.onlower = () => sync(ui.state); $('btn-lower').onclick = () => ui.setLowered(!ui.lowered);
  // junction box on the back wall, left of the shelf
  const box = new FuseBox(quality === 'high'); const ci = cage.inner as T.Box3 | undefined;
  if (ci) box.group.position.set(ci.min.x * .45, floorY + 1.3, ci.min.z + .008); else box.group.position.set(-.45, 1.3, -.79);
  scene.add(box.group);
  box.sounds = {door: o => audio.play(o ? 'doorOpen' : 'doorClose'), snip: () => audio.play('snip'), spark: () => audio.play('spark'), good: () => audio.play('good'), bad: () => audio.play('bad')};
  // PRESSURE CONTROL: steam manifold on the right-hand wall, facing into the car
  const press = new PressureMachine(quality === 'high');
  if (ci) press.group.position.set(ci.max.x - .006, floorY + 1.28, .12); else press.group.position.set(1.2, 1.3, .1);
  press.group.rotation.y = -Math.PI / 2; scene.add(press.group); press.group.updateMatrixWorld(true);
  press.sounds = {click: () => audio.play('valveClick'), turn: () => audio.play('valveTurn'), knock: k => audio.play('pipeKnock', k), alarm: () => audio.play('alarm'), tick: k => audio.play('holdTick', k), steam: (h, r) => audio.steam(h, r)};
  const link = new PressureLink(); press.onValve = (v, p) => link.setValve(v, p);
  link.onStatus = t => { if (t) $('hint').textContent = t; };
  let valvePointer: number | null = null;
  let focusTo: [number, number] | null = null, inspecting = false, inspectK = 0, inspectTarget: 'box' | 'pressure' = 'box';
  const TOTAL = 12, LIMIT = 60; let taskNo = 1, deadline = 0, taskSeed = seed, pending: any = 0;
  // task kinds alternate: odd = wire cutting, even = pressure control (?task=pressure starts with pressure)
  const firstPressure = params.get('task') === 'pressure'; const kindOf = (n: number) => ((n % 2 === 0) !== firstPressure) ? 'pressure' : 'wire';
  let kind: 'wire' | 'pressure' = kindOf(1);
  const hud = () => { $('task').textContent = `ЗАДАНИЕ ${taskNo} / ${TOTAL} · ${kind === 'pressure' ? 'ДАВЛЕНИЕ' : 'ПРОВОДА'}`; };
  // result card: low on screen (≈85 % of the viewport), fades in, a small mechanical jolt, holds, fades out (~2 s)
  let verdictTimer: any = 0;
  const verdict = (ok: boolean, sub: string, title?: string) => { const v = $('verdict'); v.querySelector('b')!.textContent = title ?? (ok ? 'Цепь стабилизирована' : 'Критическая ошибка'); v.querySelector('span')!.textContent = sub; v.dataset.tone = ok ? 'good' : 'bad';
    v.classList.remove('show'); void v.offsetWidth; v.classList.add('show'); clearTimeout(verdictTimer); verdictTimer = setTimeout(() => v.classList.remove('show'), 2300); if (!ok) { document.body.classList.remove('jolt'); void document.body.offsetWidth; document.body.classList.add('jolt'); } };
  const newTask = (advance: boolean) => { if (advance) taskNo = Math.min(TOTAL, taskNo + 1); taskSeed++; kind = kindOf(taskNo);
    const t = makeTask(wireRules, taskSeed, wireCount || 4 + Math.floor(Math.random() * 3), fixed); box.setTask(t); box.configure(t.fault, t.mode); deadline = 0;
    if (kind === 'pressure') { box.locked = true; press.enabled = true; link.start(); pressureDone = false; if (ui.state === 'rest' || ui.state === 'falling') { const d = press.center().sub(eye); focusTo = [Math.atan2(-d.x, -d.z), Math.atan2(d.y, Math.hypot(d.x, d.z))]; } }
    else { press.enabled = false; link.stop(); }
    hud(); };
  // PRESSURE CONTROL outcome: decided by the server in a room (locally in practice); the client only reacts
  let pressureDone = false;
  link.onOutcome = o => { if (kind !== 'pressure' || pressureDone) return; pressureDone = true; press.enabled = false; const ok = o === 'STABILIZED';
    audio.play(ok ? 'good' : 'bad'); verdict(ok, ok ? 'РЕМОНТ УСПЕШЕН · СПУСК ОСТАНОВЛЕН' : 'ВРЕМЯ ВЫШЛО', ok ? 'Давление стабилизировано' : 'Отказ давления'); if (!ok) setTimeout(() => cage.drop?.(.8), 350);
    clearTimeout(pending); pending = setTimeout(() => { if (inspecting && inspectTarget === 'pressure') setInspect(false); setTimeout(() => newTask(ok), 400); }, 2600); };
  const finish = (ok: boolean, why: string) => { box.locked = true; box.setLamp(ok ? 'good' : 'bad'); audio.play(ok ? 'good' : 'bad'); verdict(ok, ok ? 'РЕМОНТ УСПЕШЕН' : why); hud(); deadline = 0; clearTimeout(pending); pending = setTimeout(() => { if (box.open) box.toggleDoor(); setTimeout(() => newTask(ok), 500); }, 2400); };
  box.onCut = i => { const ok = i === box.task!.answer; finish(ok, 'НЕВЕРНЫЙ ПРОВОД'); if (!ok) setTimeout(() => cage.drop?.(.8), 350); };
  // the car lurches down toward the lava: screech + rattle while falling, a slam and a hard shake on the catch
  // wrong answer: the brake lets go. Mains power cuts, the red emergency beacon spins up, the head floats in free fall
  // and the view tips toward the shaft; on the catch: a hard slam, the body compresses, power sputters back.
  let shake = 0, falling = false, fallT = -1, landT = -1, headY = 0, headV = 0; const fov0 = camera.fov;
  cage.onFallStart = () => { audio.play('screech'); shake = Math.max(shake, .5); falling = true; fallT = 0; landT = -1; if (inspecting) setInspect(false); focusTo = [yawT, -.42];
    const tag = $('fall'); tag.classList.remove('show'); void tag.offsetWidth; tag.classList.add('show'); document.body.classList.add('falling'); };
  cage.onFallImpact = (k: number) => { audio.play('slam', k); shake = .9 * k + .6; falling = false; landT = 0; headV = -1.6 * k; setTimeout(() => { $('fall').classList.remove('show'); document.body.classList.remove('falling'); }, 2400); };
  // PHASE 1 dev configuration: ?fault=overload|short|power&mode=normal|emergency&wires=4..6 (no production generation yet)
  // dev overrides: ?fault=overload|short|power&mode=normal|emergency&wires=4..6 (otherwise each task varies)
  const fixed: any = {}; if (['overload', 'short', 'power'].includes(params.get('fault') || '')) fixed.fault = params.get('fault'); if (['normal', 'emergency'].includes(params.get('mode') || '')) fixed.mode = params.get('mode');
  const wireCount = params.get('wires') ? Math.max(4, Math.min(6, +params.get('wires')!)) : 0;
  box.onTest = f => { audio.play('button'); setTimeout(() => audio.hum(f, 2), 60); if (f === 'short') for (let k = 0; k < 6; k++) setTimeout(() => audio.play('spark'), 150 + k * 280 + Math.random() * 120); };
  newTask(false);
  // taps that miss the book go to the box; opening the door turns the head toward it
  const tapStart = new Map<number, {x: number; y: number; t: number}>(), ray = new T.Raycaster();
  renderer.domElement.addEventListener('pointerdown', e => tapStart.set(e.pointerId, {x: e.clientX, y: e.clientY, t: performance.now()}));
  renderer.domElement.addEventListener('pointerup', e => { const s = tapStart.get(e.pointerId); tapStart.delete(e.pointerId); if (!s || Math.hypot(e.clientX - s.x, e.clientY - s.y) > 12 || performance.now() - s.t > 450) return;
    ray.setFromCamera(new T.Vector2(e.clientX / innerWidth * 2 - 1, -e.clientY / innerHeight * 2 + 1), camera);
    if (valvePointer === e.pointerId) return;
    const b = ray.intersectObject(book.root, true)[0], hit = ray.intersectObject(box.group, true)[0], ph = press.hits(ray); if (b && (!hit || b.distance < hit.distance) && (!ph || b.distance < ph.distance)) return;
    if (ph && (!hit || ph.distance < hit.distance)) { if (!inspecting && (ui.state === 'rest' || ui.state === 'falling' || ui.lowered)) setInspect(true, 'pressure'); return; }
    if ((ui.state === 'reading' || ui.state === 'held') && !ui.lowered) { if (!hit) return; }
    const r = box.tap(ray); (window as any).__lastTap = r; if (r && (r !== 'door' || box.open) && !inspecting && (ui.state === 'rest' || ui.state === 'falling' || ui.lowered)) { setInspect(true); if (r !== 'test') return; } if (r === 'door' && box.open) { if (!deadline && !box.locked) deadline = performance.now() + LIMIT * 1000; if (ui.state === 'rest' || ui.state === 'falling') { const d = box.center().sub(eye); focusTo = [Math.atan2(-d.x, -d.z), Math.atan2(d.y, Math.hypot(d.x, d.z))]; } } });
  const setInspect = (on: boolean, target: 'box' | 'pressure' = 'box') => { if (on) inspectTarget = target; inspecting = on; $('btn-back').hidden = !on; $('hint').style.opacity = on ? '0' : ''; $('task').style.opacity = on && innerWidth > 700 ? '0' : ''; if (on) { focusTo = null; if (target === 'box' && !box.open) box.toggleDoor(); } };
  $('btn-back').onclick = () => setInspect(false); addEventListener('keydown', e => { if (e.key === 'Escape' && inspecting) setInspect(false); });
  $('btn-open').onclick = () => ui.open(); $('btn-close').onclick = () => ui.close(); $('btn-drop').onclick = () => ui.drop();
  $('btn-sound').onclick = () => { audio.unlock(); audio.enabled = !audio.enabled; $('btn-sound').textContent = audio.enabled ? 'Звук: вкл.' : 'Звук: выкл.'; };
  book.onspread = s => { $('page-label').textContent = `${2 * s + 1}–${2 * s + 2} / ${book.pages.length}`; }; book.onspread(0);
  // free camera (?freecam=1 or key C): orbit / zoom / pan anywhere, including below the floor to the lava
  const orbit = new OrbitControls(camera, renderer.domElement); orbit.enableDamping = true; orbit.maxDistance = 14; orbit.minDistance = .1; orbit.screenSpacePanning = true; orbit.target.set(0, .4, 0); orbit.enabled = false;
  let free = false; const setFree = (on: boolean) => { free = on; orbit.enabled = on; $('btn-cam').textContent = on ? 'Камера: свободная' : 'Камера: игрок'; if (!on) { camera.position.copy(eye); } else { camera.position.set(eye.x + .3, eye.y + .3, eye.z + 1.6); orbit.target.set(0, floorY + 1, 0); orbit.update(); } };
  $('btn-cam').onclick = () => setFree(!free); addEventListener('keydown', e => { if (e.key.toLowerCase() === 'c') setFree(!free); }); if (params.get('freecam') === '1') setFree(true);
  // unlock audio on every kind of gesture WebKit counts (pointerdown alone is not enough in iOS Home Screen apps)
  for (const ev of ['pointerup', 'touchend', 'click', 'keydown']) addEventListener(ev, () => audio.unlock(), {passive: true});
  document.addEventListener('visibilitychange', () => { if (!document.hidden && audio.ctx && audio.ctx.state !== 'running') audio.ctx.resume().catch(() => {}); });
  // warm-up behind the loading screen: compile every shader, upload every texture and render a few frames,
  // so the first seconds of play do not hitch on first-use GPU work
  $('load-text').textContent = 'Подготовка…';
  try { await (renderer as any).compileAsync?.(scene, camera); } catch {}
  scene.traverse((o: any) => { const ms = o.material ? (Array.isArray(o.material) ? o.material : [o.material]) : []; for (const m of ms) for (const k of ['map', 'normalMap', 'roughnessMap', 'metalnessMap', 'emissiveMap', 'bumpMap', 'aoMap', 'alphaMap']) if (m[k]) renderer.initTexture(m[k]); });
  { const q0 = camera.quaternion.clone(); for (let i = 0; i < 8; i++) { camera.quaternion.setFromEuler(new T.Euler(0, i * Math.PI / 4, 0)); renderer.shadowMap.needsUpdate = true; renderer.render(scene, camera); await new Promise(r => requestAnimationFrame(r)); } camera.quaternion.copy(q0); }
  // came from a room on this phone: one tap back to the room controller (same seat, the session is kept)
  { let inRoom = false; try { inRoom = !!sessionStorage.getItem('finalanswer-session'); } catch {} const b = $('btn-room'); b.hidden = !inRoom; b.onclick = () => { location.href = '/'; }; }
  $('loading').hidden = true;
  // fullscreen on the first touch where the browser allows it (Android, iPad, desktop). iPhone Safari has no page fullscreen:
  // there the page runs fullscreen when opened from the Home Screen (manifest + apple-mobile-web-app-capable).
  { const el = document.documentElement as any, req = el.requestFullscreen || el.webkitRequestFullscreen; const standalone = matchMedia('(display-mode: fullscreen), (display-mode: standalone)').matches || (navigator as any).standalone;
    if (req && !standalone && params.get('capture') === null) addEventListener('pointerup', function go() { removeEventListener('pointerup', go); try { const r = req.call(el, {navigationUI: 'hide'}); r?.catch?.(() => {}); } catch {} });
    if (mobile && !req && !standalone && /iPhone|iPod/.test(navigator.userAgent)) { const h = document.createElement('div'); h.id = 'fs-tip'; h.textContent = 'Полный экран: «Поделиться» → «На экран Домой», затем открыть с иконки'; h.onclick = () => h.remove(); document.body.append(h); setTimeout(() => h.remove(), 9000); } }
  // adaptive quality: drop the render resolution when frames run long
  let last = performance.now(), acc = 0, frames = 0;
  // 360° look-around from the player's spot: drag to turn the head. Disabled while the book is in hand so page taps never rotate the view.
  const drag = new Map<number, {x: number; y: number}>(); const canLook = () => !free && !inspecting && valvePointer === null && (ui.state === 'rest' || ui.state === 'falling' || ui.lowered);
  renderer.domElement.addEventListener('pointerdown', e => { if (valvePointer !== null || free || !press.enabled || ((ui.state === 'reading' || ui.state === 'held') && !ui.lowered)) return;
    ray.setFromCamera(new T.Vector2(e.clientX / innerWidth * 2 - 1, -e.clientY / innerHeight * 2 + 1), camera); const i = press.pick(ray);
    if (i >= 0 && press.beginDrag(i, e.clientX, e.clientY, camera)) { valvePointer = e.pointerId; try { renderer.domElement.setPointerCapture(e.pointerId); } catch {} if (!inspecting) setInspect(true, 'pressure'); } });
  addEventListener('pointermove', e => { if (e.pointerId === valvePointer) press.moveDrag(e.clientX, e.clientY); });
  const endValve = (e: PointerEvent) => { if (e.pointerId !== valvePointer) return; press.endDrag(); setTimeout(() => { valvePointer = null; }, 0); };
  addEventListener('pointerup', endValve); addEventListener('pointercancel', endValve);
  renderer.domElement.addEventListener('pointerdown', e => drag.set(e.pointerId, {x: e.clientX, y: e.clientY}));
  addEventListener('pointerup', e => drag.delete(e.pointerId)); addEventListener('pointercancel', e => drag.delete(e.pointerId));
  renderer.domElement.addEventListener('pointermove', e => { const p = drag.get(e.pointerId); if (!p || drag.size > 1) return; const dx = e.clientX - p.x, dy = e.clientY - p.y; p.x = e.clientX; p.y = e.clientY; if (!canLook()) return; const k = 2.6 / Math.max(innerHeight, 400); yawT += dx * k; pitchT = T.MathUtils.clamp(pitchT + dy * k, -1.45, 1.35); focusTo = null; });
  renderer.domElement.addEventListener('pointermove', e => { if (e.pointerType !== 'mouse' || drag.size) return; hoverRay.setFromCamera(new T.Vector2(e.clientX / innerWidth * 2 - 1, -e.clientY / innerHeight * 2 + 1), camera); box.hover(hoverRay); });
  const loop = (now: number) => {
    const dt = Math.min(.05, (now - last) / 1000) * timeScale; last = now; acc += dt; frames++;
    if (acc > 1) { const ms = acc / frames * 1000; if (ms > 19) { if (dpr > DPR_FLOOR) { dpr = Math.max(DPR_FLOOR, dpr - .2); renderer.setPixelRatio(dpr); resize(); } else if (shadowEvery < 15) shadowEvery = shadowEvery * 2 + 1; } acc = 0; frames = 0; }
    // gentle head motion while looking around the cage (none while reading)
    // exponential smoothing of the look (frame-rate independent): no stepping between irregular mouse events
    { const a = 1 - Math.exp(-dt * 22); yaw += (yawT - yaw) * a; pitch += (pitchT - pitch) * a; }
    inspectK += ((inspecting ? 1 : 0) - inspectK) * (1 - Math.exp(-dt * 6));
    if (free) orbit.update(); else if (inspectK > .001) {
      // close-up: stand ~55 cm in front of the panel (still inside the cage), framing meter + wires
      const P = inspectTarget === 'pressure', tg = P ? press.group : box.group, c = P ? press.center() : box.center(), n = new T.Vector3(0, 0, 1).applyQuaternion(tg.getWorldQuaternion(new T.Quaternion())), at = c.clone().add(new T.Vector3(0, P ? 0 : .05, 0)), from = c.clone().addScaledVector(n, P ? (camera.aspect < .9 ? 1.25 : .82) : camera.aspect < .9 ? 1.3 : 1.12).add(new T.Vector3(0, P ? .06 : .09, 0));
      const look = new T.Quaternion().setFromRotationMatrix(new T.Matrix4().lookAt(from, at, new T.Vector3(0, 1, 0))), base = new T.Quaternion().setFromEuler(new T.Euler(pitch, yaw, 0, 'YXZ'));
      camera.position.copy(eye).lerp(from, inspectK); camera.quaternion.copy(base).slerp(look, inspectK);
      if (!inspecting && inspectK < .002) inspectK = 0;
    } else { camera.position.copy(eye); camera.quaternion.setFromEuler(new T.Euler(pitch, yaw, 0, 'YXZ')); }
    cage.update(dt); ui.update(dt); box.update(dt); press.update(dt, link.view());
    if (focusTo) { let dy = focusTo[0] - yawT; dy = Math.atan2(Math.sin(dy), Math.cos(dy)); yawT += dy * Math.min(1, dt * 5); pitchT += (focusTo[1] - pitchT) * Math.min(1, dt * 5); if (Math.abs(dy) < .002 && Math.abs(focusTo[1] - pitchT) < .002) focusTo = null; }
    if (kind === 'pressure') { const v = link.view(), lim = PRESSURE_LIMIT_MS / 1000, left = v ? (v.outcome === 'RUNNING' ? Math.max(0, (v.deadline - performance.now()) / 1000) : 0) : lim;
      $('clock-num').textContent = String(Math.ceil(left)); ($('clock-ring') as any).style.strokeDashoffset = String(176 * (1 - left / lim)); $('clock').dataset.urgent = String(!!v && v.outcome === 'RUNNING' && left < 10); }
    else { const left = deadline ? Math.max(0, (deadline - performance.now()) / 1000) : LIMIT; $('clock-num').textContent = String(Math.ceil(left)); ($('clock-ring') as any).style.strokeDashoffset = String(176 * (1 - left / LIMIT)); $('clock').dataset.urgent = String(!!deadline && left < 10); if (deadline && left <= 0 && !box.locked) { finish(false, 'ВРЕМЯ ВЫШЛО'); setTimeout(() => cage.drop?.(.8), 350); } }
    const surface = cage.shelf && Math.abs(book.root.position.y - TH / 2 - cage.shelf.top.y) < .2 && Math.abs(book.root.position.z - cage.shelf.top.z) < .2 ? cage.shelf.top.y : floorY; const h = Math.max(0, book.root.position.y - TH / 2 - surface); shadow.position.set(book.root.position.x, surface + .0012, book.root.position.z); shadow.rotation.z = new T.Euler().setFromQuaternion(book.root.quaternion, 'YXZ').y; (shadow.material as T.MeshBasicMaterial).opacity = .75 * Math.max(0, 1 - h / .18); shadow.visible = h < .18;
    { // fall choreography (runs on top of the normal camera pose)
      if (fallT >= 0) fallT += dt; if (landT >= 0) landT += dt;
      const target = falling ? fov0 + 9 : fov0; if (Math.abs(camera.fov - target) > .05) { camera.fov += (target - camera.fov) * (1 - Math.exp(-dt * (falling ? 7 : 2.5))); camera.updateProjectionMatrix(); }
      if (falling) { shake = Math.max(shake, .35); cage.power = Math.random() < .25 ? .35 : .08; cage.alarmLevel = Math.min(1, fallT * 6); headV += (1.2 - headV) * Math.min(1, dt * 6); }
      else if (landT >= 0) { cage.power = landT < .25 ? .05 : landT < 1.4 ? (Math.random() < .5 ? .25 : .9) * Math.min(1, landT) : Math.min(1, cage.power + dt); cage.alarmLevel = Math.max(0, 1 - Math.max(0, landT - 1.2) / 1.6); if (landT > 3) { landT = -1; fallT = -1; cage.power = 1; cage.alarmLevel = 0; } }
      // head: floats up a little in free fall, compresses on the catch, springs back
      headV += (-headY * 90 - headV * 12) * dt; headY += headV * dt; if (Math.abs(headY) > 1e-4 || falling || landT >= 0) camera.position.y += headY * .05; }
    if (shake > .002) { const a = shake * shake; camera.position.add(new T.Vector3((Math.random() - .5) * .05 * a, (Math.random() - .5) * .07 * a, (Math.random() - .5) * .03 * a)); camera.rotateZ((Math.random() - .5) * .03 * a); shake *= Math.exp(-dt * 4); }
    // shadows refresh every other frame: invisible at 60 fps, halves the shadow-pass cost
    if (frameNo++ % (shadowEvery + 1) === 0) renderer.shadowMap.needsUpdate = true;
    renderer.render(scene, camera); requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
  (window as any).__manual = {book, ui, renderer, scene, camera, get state() { return ui.state; }, get info() { return renderer.info.render; }, box, press, link, get kind() { return kind; }, setInspect, cage, get shake() { return shake; }, look(y: number, p: number) { yaw = yawT = y; pitch = pitchT = p; }, setFree, set timeScale(v: number) { timeScale = v; }, step(sec: number) { for (let i = 0; i < Math.round(sec * 60); i++) { cage.update(1 / 60); ui.update(1 / 60); } }};
}
boot().catch(e => { $('load-text').textContent = 'Failed: ' + (e?.message || e); console.error(e); });
