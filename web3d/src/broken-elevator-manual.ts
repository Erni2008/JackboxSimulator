// Dedicated test scene for THE ENGINEER'S MANUAL (THE BROKEN ELEVATOR, mode 5).
import * as T from 'three';
import {L, LANG, translateDom, followRoomLanguage} from './games/broken-elevator/i18n';
import {RoomSocket} from './games/broken-elevator/puzzles/room-socket';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/addons/postprocessing/UnrealBloomPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
import {EngineersManual, TH} from './games/broken-elevator/manual/book';
import {ManualInteraction, type HoldState} from './games/broken-elevator/manual/interaction';
import {BookAudio} from './games/broken-elevator/manual/audio';
import {SAMPLE_MANUAL, loadManualContent, diagnosticsManual, alchemistJournal} from './games/broken-elevator/manual/content';
import {Laboratory} from './games/broken-elevator/puzzles/laboratory';
import {FormulaLink} from './games/broken-elevator/puzzles/formula-link';
import {limitMs, setDiff, diffName, onDiff} from './games/broken-elevator/difficulty';
import {Voice, haptic} from './games/broken-elevator/feedback';
import {briefing, report, type TaskRecord} from './games/broken-elevator/coach';
import {buildCage, contactShadow} from './games/broken-elevator/manual/test-scene';
import {FuseBox} from './games/broken-elevator/puzzles/fusebox';
import {makeRules, makeTask, manualRows} from './games/broken-elevator/puzzles/wire-puzzle';
import {buildGlbCage} from './games/broken-elevator/manual/glb-cage';
import {PressureMachine} from './games/broken-elevator/puzzles/pressure';
import {PressureLink} from './games/broken-elevator/puzzles/pressure-link';
import {CodeLock, makeLockTask} from "./games/broken-elevator/puzzles/code-lock";
import {LockNotes} from "./games/broken-elevator/puzzles/lock-notes";
import {DIFF} from "./games/broken-elevator/difficulty";

const $ = (id: string) => document.getElementById(id) as HTMLElement;
const params = new URLSearchParams(location.search);
const mobile = matchMedia('(pointer: coarse)').matches || Math.min(screen.width, screen.height) < 600;
let quality: 'high' | 'low' = params.get('quality') === 'low' || (mobile && params.get('quality') !== 'high') ? 'low' : 'high';

const renderer = new T.WebGLRenderer({antialias: !mobile, powerPreference: 'high-performance', preserveDrawingBuffer: params.has('capture')});
renderer.outputColorSpace = T.SRGBColorSpace; renderer.toneMapping = T.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.0;
renderer.shadowMap.enabled = true; renderer.shadowMap.type = T.PCFShadowMap; renderer.shadowMap.autoUpdate = false; let frameNo = 0;
// iPhones (Apple GPU) hold 2x; Android mid-range (e.g. Poco X3 Pro, Adreno 640) starts lower and may drop further
const ios = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const DPR_FLOOR = mobile ? (ios ? 1.5 : 1) : 1; let dpr = Math.min(devicePixelRatio, mobile ? (ios ? 2 : 1.6) : quality === "high" ? 1.25 : 1); let shadowEvery = mobile ? 3 : 1; renderer.setPixelRatio(dpr);
$('viewport').append(renderer.domElement);
const scene = new T.Scene(), camera = new T.PerspectiveCamera(50, 1, .03, 40);
camera.position.set(0, 1.56, .5); camera.lookAt(0, .1, -.25);
// film-style glow on lamps, gauge faces, sparks and lava: desktop / high quality only (phones keep the direct path for frame rate)
const bloomOn = params.get('bloom') === '1'; // off by default: too costly and washes out the labels
const composer = bloomOn ? new EffectComposer(renderer) : null; const bloom = new UnrealBloomPass(new T.Vector2(256, 256), .42, .5, .9);
if (composer) { composer.addPass(new RenderPass(scene, camera)); composer.addPass(bloom); composer.addPass(new OutputPass()); }

function resize() { const w = innerWidth, h = innerHeight; renderer.setSize(w, h, false); renderer.domElement.style.width = w + 'px'; renderer.domElement.style.height = h + 'px'; composer?.setSize(w, h); composer?.setPixelRatio(renderer.getPixelRatio()); camera.aspect = w / h; camera.fov = camera.aspect < .9 ? 58 : 46; camera.updateProjectionMatrix(); }
addEventListener('resize', resize); resize();

const audio = new BookAudio(), voice = new Voice();
let timeScale = 1; // test hook: 0 freezes animation for frame-exact captures
async function boot() {
  translateDom(); $('load-text').textContent = L('Спуск…', 'Descending…');
  RoomSocket.shared()?.listen(ev => { followRoomLanguage(ev.payload?.language); setDiff(ev.payload?.elevatorDifficulty); });
  // cage.glb is the elevator; the old procedural cage stays available with ?cage=procedural
  const procedural = params.get('cage') === 'procedural';
  $('load-text').textContent = L('Переплетаем руководство…', 'Binding the manual…');
  // ?rules=<url> lets the server supply real puzzle rules (ManualContent JSON); otherwise the specimen
  const rules = params.get('rules') ? await loadManualContent(params.get('rules')!).catch(e => { console.warn(e); return SAMPLE_MANUAL; }) : SAMPLE_MANUAL;
  // wire puzzle: the manual prints the cutting RULES for this session; the box shows serial + wires
  const seed = +(params.get('seed') || Date.now() % 100000), wireRules = makeRules(seed);
  // INDUSTRIAL EMERGENCY DIAGNOSTICS: the 24-rule handbook (?rules=<url> still overrides for server-supplied content)
  const content = params.get('rules') ? rules : diagnosticsManual();
  // cage and book load in parallel (network + GPU upload overlap)
  performance.mark('cage0'); performance.mark('book0');
  const cageP: Promise<any> = procedural ? buildCage(renderer, scene, quality === 'high') : buildGlbCage(renderer, scene, quality === 'high');
  const [cage, book, journal] = await Promise.all([cageP.then(c => { performance.measure('cage', 'cage0'); return c; }), EngineersManual.create(renderer, content, quality).then(b => { performance.measure('book', 'book0'); return b; }),
    EngineersManual.create(renderer, alchemistJournal(), quality, 'journal')]);
  const floorY: number = cage.floorY ?? 0, eye: T.Vector3 = cage.eye ?? new T.Vector3(0, 1.56, .5);
  camera.position.copy(eye); let yaw = 0, pitch = -.5, yawT = 0, pitchT = -.5; const hoverRay = new T.Raycaster();
  book.sounds = journal.sounds = {coverOpen: () => audio.play('coverOpen'), coverClose: () => audio.play('coverClose'), pageTurn: s => audio.play('pageTurn', s), creak: a => audio.play('creak', a)};
  scene.add(book.root, journal.root);
  const shadow = contactShadow(); scene.add(shadow);
  const ui = new ManualInteraction(book, camera, renderer.domElement, audio, cage.planes);
  // THE ALCHEMIST'S JOURNAL: a second, independent book (only one of the two can be in hand at a time)
  const jui = new ManualInteraction(journal, camera, renderer.domElement, audio, cage.planes);
  const cur = () => ManualInteraction.holder ?? ui;
  if (cage.shelf) { ui.place(cage.shelf.top.clone().add(new T.Vector3(0, TH / 2, 0)), new T.Quaternion().setFromEuler(new T.Euler(0, .04, 0))); const d = cage.shelf.top.clone().sub(eye); yaw = yawT = Math.atan2(-d.x, -d.z); pitch = pitchT = Math.atan2(d.y, Math.hypot(d.x, d.z)); }
  else ui.place(new T.Vector3(.06, TH / 2, -.22), new T.Quaternion().setFromEuler(new T.Euler(0, .5, 0)));
  const hints: Record<HoldState, string> = {rest: mobile ? L('Ведите пальцем, чтобы осмотреться · нажмите на книгу, щиток, вентили или лабораторию', 'Drag to look around · tap a book, the fuse box, the valves or the laboratory') : L('Тяните мышью, чтобы осмотреться · кликните по книгам, щитку, вентилям или лаборатории', 'Drag to look around · click a book, the fuse box, the valves or the laboratory'), lifting: '', held: mobile ? L('Нажмите на обложку, чтобы открыть', 'Tap the cover to open') : L('Кликните по обложке, чтобы открыть', 'Click the cover to open'), reading: mobile ? L('Правая страница — вперёд, левая — назад · свайп · щипок для зума', 'Right page forward, left page back · swipe · pinch to zoom') : L('Правая страница — вперёд, левая — назад · колесо для зума', 'Right page forward, left page back · wheel to zoom'), releasing: '', falling: ''};
  const sync = (s: HoldState) => { if (ManualInteraction.holder && cur().state !== s) s = cur().state; $('hint').textContent = cur().lowered ? (mobile ? L('Книга опущена · нажмите на неё, чтобы поднять', 'Book lowered · tap it to raise') : L('Книга опущена · кликните по ней, чтобы поднять', 'Book lowered · click it to raise')) : hints[s]; $('btn-lower').hidden = !['held', 'reading'].includes(s); $('btn-lower').textContent = cur().lowered ? L('Поднять', 'Raise') : L('Опустить', 'Lower'); $('btn-open').hidden = s !== 'held'; $('btn-close').hidden = s !== 'reading'; $('btn-drop').hidden = !['held', 'reading'].includes(s); document.body.dataset.state = s; };
  ui.onstate = jui.onstate = sync; sync('rest'); ui.onlower = jui.onlower = () => sync(cur().state); $('btn-lower').onclick = () => cur().setLowered(!cur().lowered);
  // junction box on the back wall, left of the shelf
  const box = new FuseBox(quality === 'high'); const ci = cage.inner as T.Box3 | undefined;
  if (ci) box.group.position.set(ci.min.x * .45, floorY + 1.3, ci.min.z + .008); else box.group.position.set(-.45, 1.3, -.79);
  scene.add(box.group);
  box.sounds = {door: o => audio.play(o ? 'doorOpen' : 'doorClose'), snip: () => audio.play('snip'), spark: () => audio.play('spark'), good: () => audio.play('good'), bad: () => audio.play('bad')};
  // PRESSURE CONTROL: steam manifold on the right-hand wall, facing into the car
  const press = new PressureMachine(quality === 'high');
  if (ci) press.group.position.set(ci.max.x - .006, floorY + 1.28, .12); else press.group.position.set(1.2, 1.3, .1);
  press.group.rotation.y = -Math.PI / 2; scene.add(press.group); press.group.updateMatrixWorld(true);
  press.sounds = {click: () => audio.play('valveClick'), turn: () => audio.play('valveTurn'), grind: () => audio.play('grind'), lever: () => audio.play('lever'), press: () => { audio.play('button'); audio.play('relay'); }, pull: () => audio.play('lever'),
    knock: k => audio.play('pipeKnock', k), alarm: () => audio.play('alarm'), whistle: () => audio.play('whistle'), surge: () => audio.play('surge'), vent: k => audio.play('vent', k), burst: () => audio.play('burst'), explosion: () => audio.play('explosion'), tick: k => audio.play('holdTick', k), steam: (h, r) => audio.steam(h, r)};
  const link = new PressureLink(); press.onAction = a => link.act(a);
  press.canAct = () => link.view()?.outcome === 'RUNNING';
  link.onRejected = code => { if (code === 'EMERGENCY_USED') { $('hint').textContent = L('Аварийный сброс уже использован', 'Emergency release already used'); $('hint').style.opacity = '1'; } };
  link.onStatus = t => { if (t) $('hint').textContent = t; };
  // THE UNSTABLE FORMULA: laboratory on the left-hand wall; the journal rests on its ledge
  const lab = new Laboratory(quality === 'high');
  if (ci) lab.group.position.set(ci.min.x + .006, floorY + 1.3, .36); else lab.group.position.set(-.96, 1.3, .36);
  lab.group.rotation.y = Math.PI / 2; scene.add(lab.group); lab.group.updateMatrixWorld(true);
  // performance: clear-coat and sheen add two extra lighting lobes on every metal pixel; at cage scale they are invisible
  scene.traverse((o: any) => { const ms = Array.isArray(o.material) ? o.material : o.material ? [o.material] : []; for (const m of ms) if (m.isMeshPhysicalMaterial && (m.clearcoat > 0 || m.sheen > 0)) { m.clearcoat = 0; m.sheen = 0; m.needsUpdate = true; } });
  // THE CAGE LOCK: a combination padlock on the barred door over the lava; its clues are hidden around the cage
  const lock = new CodeLock(quality === "high"); lock.place(ci, floorY); scene.add(lock.group, lock.clues); lock.group.updateMatrixWorld(true);
  // THE LOCKSMITH'S NOTES: how to work the pick, on sheets nailed to the wall by the door (the order stays in the handbook)
  const notes = new LockNotes(quality === "high"); notes.place(ci, floorY); scene.add(notes.group); notes.group.updateMatrixWorld(true);
  lock.sounds = {click: () => audio.play("valveClick"), turn: () => audio.play("button"), lever: () => { audio.play("button"); audio.play("relay"); }, unlock: () => { audio.play("locked"); audio.play("doorOpen"); }, jam: () => audio.play("grind")};
  jui.place(lab.ledgeTop.clone().add(new T.Vector3(0, TH / 2, 0)).applyMatrix4(lab.group.matrixWorld), new T.Quaternion().setFromEuler(new T.Euler(0, Math.PI / 2 + .06, 0)));
  lab.sounds = {click: () => audio.play('valveClick'), turn: () => audio.play('valveTurn'), grind: () => audio.play('grind'), lever: () => audio.play('lever'), press: () => audio.play('button'), pull: () => audio.play('lever'),
    pour: () => audio.play('pour'), splash: () => audio.play('splash'), stir: on => { if (on) audio.play('stir'); }, inject: () => { audio.play('button'); audio.play('relay'); }, pump: () => audio.play('pump'), accepted: () => audio.play('labOk'), unstable: () => audio.play('boil'), steam: () => audio.play('vent', .8), drain: () => audio.play('gurgle'), bubble: () => audio.play('splash')};
  const flink = new FormulaLink(); lab.onAction = (a, r) => flink.act(a, r);
  lab.canAct = () => { const v = flink.view(); return !!v && v.outcome === 'RUNNING' && !v.draining; };
  lab.onEvent = e => { if (e.type === 'REJECTED') { haptic('bad'); voice.say('fail', 2); } if (e.type === 'REJECTED') verdict(false, e.reason === 'UNSTABLE_UNPROTECTED' ? L('НЕСТАБИЛЬНО · ЗАМОК ОХЛАЖДЕНИЯ НЕ ВКЛЮЧЁН', 'UNSTABLE · COOLING LOCK WAS OFF') : L('ФОРМУЛА ОТВЕРГНУТА · СЛИВ, ПОПРОБУЙТЕ СНОВА', 'ФОРМУЛА ОТВЕРГНУТА · DRAINED, TRY AGAIN'), e.reason === 'UNSTABLE_UNPROTECTED' ? L('Нестабильная реакция', 'Unstable reaction') : L('Формула отвергнута', 'Formula rejected')); };
  let valvePointer: number | null = null;
  let focusTo: [number, number] | null = null, inspecting = false, inspectK = 0, inspectTarget: "box" | "pressure" | "lab" | "lock" | "notes" = "box";
  let TOTAL = 4; const LIMITW = () => roundLimitS || limitMs(kind === "lock" ? "lock" : "wire") / 1000; let taskNo = 1, deadline = 0, taskSeed = seed, pending: any = 0;
  // task kinds cycle: wire cutting -> broken valves -> unstable formula (?task=pressure|formula picks the first)
  type Kind = "wire" | "pressure" | "formula" | "lock"; const ORDER: Kind[] = ["wire", "pressure", "formula", "lock"]; const start0 = Math.max(0, ORDER.indexOf((params.get('task') || 'wire') as Kind));
  const kindOf = (n: number): Kind => serverKind ?? ORDER[(start0 + n - 1) % ORDER.length];
  // АДСКАЯ КЛЕТКА room mode: the server runs the shift (3 rounds, shared timer); the phone only plays the round it is given
  let IN_ROOM = false; /* true once the server runs a shift for this room */ let serverKind: Kind | null = null, curRound = -1, roundLimitS = 0, roundDeadlineAt = 0, shiftV: any = null;
  let kind: Kind = kindOf(1);
  const hud = () => { $('task').textContent = `${L('ЗАДАНИЕ', 'TASK')} ${taskNo} / ${TOTAL} · ${kind === 'pressure' ? L('КЛАПАНЫ', 'VALVES') : kind === "formula" ? L("ФОРМУЛА", "FORMULA") : kind === "lock" ? L("ЗАМОК", "LOCK") : L("ПРОВОДА", "WIRES")} · ${diffName().toUpperCase()}`; };
  // result card: low on screen (≈85 % of the viewport), fades in, a small mechanical jolt, holds, fades out (~2 s)
  let verdictTimer: any = 0;
  const verdict = (ok: boolean, sub: string, title?: string) => { const v = $('verdict'); v.querySelector('b')!.textContent = title ?? (ok ? L('Цепь стабилизирована', 'Circuit stabilised') : L('Критическая ошибка', 'Critical error')); v.querySelector('span')!.textContent = sub; v.dataset.tone = ok ? 'good' : 'bad';
    v.classList.remove('show'); void v.offsetWidth; v.classList.add('show'); clearTimeout(verdictTimer); verdictTimer = setTimeout(() => v.classList.remove('show'), 2300); if (!ok) { document.body.classList.remove('jolt'); void document.body.offsetWidth; document.body.classList.add('jolt'); } };
  const newTask = (advance: boolean) => { if (advance) taskNo = Math.min(TOTAL, taskNo + 1); taskSeed++; kind = kindOf(taskNo);
    const t = makeTask(wireRules, taskSeed, wireCount || 4 + Math.floor(Math.random() * 3), fixed); box.setTask(t); box.configure(t.fault, t.mode); deadline = 0;
    const k0 = kind, myGen = ++taskGen; box.locked = true; press.enabled = false; lab.enabled = false; lock.enabled = false; link.stop(); flink.stop(); hud();
    if (IN_ROOM && serverKind === null) return; // wait for the server's first round
    briefOpen = true; (params.get('tutorial') === '1' ? briefing(k0, Math.round(limitMs(k0) / 1000)) : Promise.resolve()).then(() => { briefOpen = false; if (myGen !== taskGen) return; startedAt = performance.now(); mistakes = 0; RoomSocket.shared()?.send('CAGE_REPORT', {kind: k0, task: taskNo}); /* host screen: which machine */
    // the host's voice: welcome once, then a short spoken instruction at the start of every task (no text card)
    if (!introSaid) { introSaid = true; tellPending = 'intro:' + k0; } else tellPending = k0;
    if (k0 === 'wire') { box.locked = false; if (IN_ROOM && roundDeadlineAt) deadline = roundDeadlineAt; }
    if (kind === 'pressure') { box.locked = true; press.enabled = true; press.reset(); link.start(); pressureDone = false; if (cur().state === 'rest' || cur().state === 'falling') { const d = press.center().sub(eye); focusTo = [Math.atan2(-d.x, -d.z), Math.atan2(d.y, Math.hypot(d.x, d.z))]; } }
    else { press.enabled = false; link.stop(); }
    if (kind === 'formula') { box.locked = true; lab.enabled = true; lab.reset(); flink.start(); formulaDone = false; if (cur().state === 'rest' || cur().state === 'falling') { const d = lab.center().sub(eye); focusTo = [Math.atan2(-d.x, -d.z), Math.atan2(d.y, Math.hypot(d.x, d.z))]; } }
    else { lab.enabled = false; flink.stop(); }
    if (kind === "lock") { box.locked = true; lockDone = false; lock.setTask(makeLockTask(taskSeed, DIFF(), params.get("method")), taskSeed); lock.enabled = true; deadline = IN_ROOM && roundDeadlineAt ? roundDeadlineAt : performance.now() + limitMs("lock");
      $("hint").textContent = L("Взломайте замок на двери отмычкой. Как это сделать — на листках на стене у двери.", "Pick the door lock. How to do it is on the sheets on the wall by the door."); $("hint").style.opacity = "1";
      if (cur().state === "rest" || cur().state === "falling") { const d = lock.center().sub(eye); focusTo = [Math.atan2(-d.x, -d.z), Math.atan2(d.y, Math.hypot(d.x, d.z))]; } }
    else lock.enabled = false;
    hud(); }); };
  // run log for the end-of-shift report
  let tellPending: string | null = null; let taskGen = 0, briefOpen = false, introSaid = false, startedAt = performance.now(), mistakes = 0, warned10 = false, surgeSaid = false; const rows: TaskRecord[] = [];
  const record = (ok: boolean, why: string, extra = 0) => { const k = kind, sec = k === 'wire' ? (deadline ? limitMs('wire') / 1000 - Math.max(0, (deadline - performance.now()) / 1000) : 0) : (performance.now() - startedAt) / 1000;
    rows.push({n: taskNo, kind: k, ok, seconds: Math.max(0, sec), mistakes: mistakes + extra + (ok ? 0 : 1), why}); warned10 = false; surgeSaid = false;
    haptic(ok ? 'good' : why === 'CRITICAL' ? 'blast' : 'bad'); voice.say(ok ? 'success' : why === 'CRITICAL' ? 'explosion' : why === 'TIMEOUT' ? 'timeout' : 'fail', 4, 0); };
  const next = (ok: boolean) => { if (IN_ROOM) { pending = 0; shiftOverlay(); return; } /* the server decides what comes next */ if (ok && taskNo >= TOTAL) { const fails = rows.filter(r => !r.ok).length; setTimeout(() => voice.say(fails ? 'results' : 'perfect', 5, 0), 300);
      report(rows).then(a => { if (a === 'room') { location.href = '/'; return; } rows.length = 0; taskNo = 1; newTask(false); }); return; } newTask(ok); };
  onDiff(() => hud());
  // ---- the shift as the server runs it
  const sock = RoomSocket.shared();
  const shiftOverlay = () => { const v = shiftV, el = $('shift'); if (!v || !IN_ROOM) { el.hidden = true; return; } const me = v.me || {}, now = sock!.serverNow(), left = v.phaseEnd > 0 ? Math.max(0, Math.ceil((v.phaseEnd - now) / 1000)) : 0;
    const h = Math.max(0, Math.round(me.height ?? 100)); $('hgt').textContent = me.dead ? '☠' : `${h} ${L('м', 'm')}`; $('hgt').dataset.low = String(h < 25);
    let title = '', sub = '';
    if (me.dead) { title = L('Вы сгорели', 'You burned'); sub = L('Смотрите на экран ведущего', 'Watch the host screen'); }
    else if (v.phase === 'INTRO') { title = L('Смена начинается', 'The shift begins'); sub = `${left} ${L('с', 's')} · ${L('до лавы', 'to the lava')} ${h} ${L('м', 'm')}`; }
    else if (v.phase === 'BREAK') { title = `${L('Раунд', 'Round')} ${v.round + 2} ${L('из', 'of')} ${v.rounds}`; sub = `${L('через', 'in')} ${left} ${L('с', 's')} · ${L('до лавы', 'to the lava')} ${h} ${L('м', 'm')}`; }
    else if (v.phase === 'END') { title = L('Вы выжили!', 'You survived!'); sub = `${L('до лавы осталось', 'left above the lava')} ${h} ${L('м', 'm')} · ✓${me.repairs ?? 0} ✗${me.fails ?? 0}`; }
    else if (v.phase === 'ROUND' && me.outcome === 'OK') { title = L('Клетка остановлена', 'Cage holding'); sub = L('Ждём остальных…', 'Waiting for the others…'); }
    else if (v.phase === 'ROUND' && me.outcome === 'FAIL') { title = me.fails >= 2 ? L('Тормоз сорван!', 'The brake is gone!') : L('Клетка падает', 'The cage is falling'); sub = L('Ждём конца раунда…', 'Waiting for the round to end…'); }
    el.hidden = !title || !!pending && v.phase === 'ROUND' && !me.dead; $('shift-t').textContent = title; $('shift-s').textContent = sub; el.dataset.tone = me.dead ? 'dead' : v.phase === 'END' ? 'good' : me.outcome === 'FAIL' ? 'bad' : ''; };
  sock?.listen(ev => { const v = ev.payload?.cage; if (!v) return; shiftV = v;
    if (!IN_ROOM) { IN_ROOM = true; $('hgt').hidden = false; setInterval(shiftOverlay, 500); if (v.phase !== 'ROUND') { serverKind = null; newTask(false); } }
    if (v.phase === 'ROUND' && v.round !== curRound && !v.me?.dead) { curRound = v.round; serverKind = v.kind; TOTAL = v.rounds; taskNo = v.round + 1; roundLimitS = v.roundLimit / 1000;
      roundDeadlineAt = performance.now() + (v.phaseStart + v.roundLimit - sock!.serverNow()); clearTimeout(pending); pending = 0; if (inspecting) setInspect(false); newTask(false); }
    if (v.me?.dead) { box.locked = true; press.enabled = false; lab.enabled = false; lock.enabled = false; }
    shiftOverlay(); });

  // THE CAGE LOCK outcome (reported like the wire panel: the phone decides, the server moves the cage)
  let lockDone = false;
  const lockFinish = (ok: boolean, why: "OK" | "WRONG" | "TIMEOUT") => { if (kind !== "lock" || lockDone) return; lockDone = true; lock.enabled = false; deadline = 0;
    RoomSocket.shared()?.send("CAGE_REPORT", {kind: "lock", task: taskNo, result: ok ? "OK" : "FAIL"}); record(ok, why); audio.play(ok ? "good" : "bad");
    // a score worth chasing: stars for a clean, fast pick and a personal best per difficulty
    let score = ""; if (ok) { const row = rows.at(-1)!, lim = limitMs("lock") / 1000, sec = row.seconds, clean = row.mistakes === 0;
      const stars = clean && sec < lim * .45 ? 3 : row.mistakes <= 1 ? 2 : 1, key = "finalanswer-lock-best-" + DIFF(); let best = 0; try { best = +(localStorage.getItem(key) || 0); } catch {}
      const rec = !best || sec < best; if (rec) try { localStorage.setItem(key, sec.toFixed(1)); } catch {}
      score = `${"★".repeat(stars)}${"☆".repeat(3 - stars)} · ${sec.toFixed(1)} ${L("с", "s")}` + (rec ? L(" · НОВЫЙ РЕКОРД!", " · NEW RECORD!") : L(` · рекорд ${best.toFixed(1)} с`, ` · best ${best.toFixed(1)} s`)); }
    verdict(ok, ok ? score : why === "TIMEOUT" ? L("ЗАМОК НЕ ОТКРЫТ · ВРЕМЯ ВЫШЛО", "TIME RAN OUT") : L("ЗАМОК ЗАКЛИНИЛО · ПОПЫТКИ КОНЧИЛИСЬ", "LOCK JAMMED · NO TRIES LEFT"), ok ? L("Замок открыт", "Lock open") : L("Замок не поддался", "The lock held"));
    if (!ok) setTimeout(() => cage.drop?.(.8), 350); clearTimeout(pending); pending = setTimeout(() => { if (inspecting && inspectTarget === "lock") setInspect(false); setTimeout(() => next(ok), 400); }, ok ? 3000 : 2600); };
  lock.onResult = ok => lockFinish(ok, ok ? "OK" : "WRONG");
  lock.onWrong = (left, why) => { haptic("bad"); mistakes++; verdict(false, left === 1 ? L("ОСТАЛАСЬ ПОСЛЕДНЯЯ ПОПЫТКА", "ONE TRY LEFT") : L(`ОСТАЛОСЬ ПОПЫТОК: ${left}`, `TRIES LEFT: ${left}`), why === "TRAP" ? L("Ловушка! Штифты упали", "Trap! The pins dropped") : why === "STUCK" ? L("Штифт заело — штифты упали", "A pin was stuck: they dropped") : L("Не тот штифт — штифты упали", "Wrong pin: the pins dropped")); };
  lock.onNote = w => { if (w === "SET") { haptic("good"); shake = Math.max(shake, .16); } if (w === "STUCK") haptic("bad"); if (w === "EASED") haptic("tap"); if (w === "OPEN") { shake = Math.max(shake, .4); setTimeout(() => { if (inspecting && inspectTarget === "lock") setInspect(false); }, 700); /* pull back: watch the shackle spring open */ }
    if (w === "OVERSET") { haptic("bad"); shake = Math.max(shake, .3); verdict(false, L("Коснитесь колеса — штифты упадут, попытка цела", "Tap the wheel: the pins drop, no try lost"), L("Перебор! Штифт заклинило", "Overset! A pin jammed")); } };
  let formulaDone = false;
  flink.onOutcome = (o, reason) => { if (kind !== 'formula' || formulaDone) return; formulaDone = true; lab.enabled = false; const ok = o === 'STABILIZED'; record(ok, reason, flink.view()?.rejections ?? 0);
    if (!ok) audio.play('bad');
    verdict(ok, ok ? L('ОХЛАЖДЕНИЕ ВОССТАНОВЛЕНО · СПУСК ОСТАНОВЛЕН', 'DESCENT HALTED') : L('ОХЛАЖДЕНИЕ НЕ ВОССТАНОВЛЕНО · ВРЕМЯ ВЫШЛО', 'TIME RAN OUT'), ok ? L('Система охлаждения восстановлена', 'Cooling system restored') : L('Отказ системы охлаждения', 'Cooling system failed')); if (!ok) setTimeout(() => cage.drop?.(.8), 350);
    clearTimeout(pending); pending = setTimeout(() => { if (inspecting && inspectTarget === 'lab') setInspect(false); setTimeout(() => next(ok), 400); }, ok ? 3300 : 2600); };
  // PRESSURE CONTROL outcome: decided by the server in a room (locally in practice); the client only reacts
  let pressureDone = false;
  // one penalty / reward per machine: pressureDone guards against repeated server pushes
  link.onOutcome = (o, reason) => { if (kind !== 'pressure' || pressureDone) return; pressureDone = true; press.enabled = false; const ok = o === 'STABILIZED'; record(ok, reason);
    const blast = !ok && reason === 'CRITICAL';
    audio.play(ok ? 'good' : 'bad'); if (!ok && !blast) audio.play('burst');
    if (blast) { shake = 1.7; const f = $('blast'); f.classList.remove('on'); void f.offsetWidth; f.classList.add('on'); document.body.classList.remove('jolt'); void document.body.offsetWidth; document.body.classList.add('jolt'); }
    verdict(ok, ok ? L('ДАВЛЕНИЕ СТАБИЛИЗИРОВАНО · СПУСК ОСТАНОВЛЕН', 'DESCENT HALTED') : (reason === 'CRITICAL' ? '120 PSI' : L('СИСТЕМА ДАВЛЕНИЯ ОТКАЗАЛА · ВРЕМЯ ВЫШЛО', 'TIME RAN OUT')), ok ? L('Давление стабилизировано', 'Pressure stabilised') : blast ? L('Взрыв системы давления', 'Pressure system exploded') : L('Отказ системы давления', 'Pressure system failed')); if (!ok) setTimeout(() => cage.drop?.(.8), blast ? 650 : 350);
    clearTimeout(pending); pending = setTimeout(() => { if (inspecting && inspectTarget === 'pressure') setInspect(false); setTimeout(() => next(ok), 400); }, 2600); };
  const finish = (ok: boolean, why: string) => { RoomSocket.shared()?.send('CAGE_REPORT', {kind: 'wire', task: taskNo, result: ok ? 'OK' : 'FAIL'}); record(ok, why === L('ВРЕМЯ ВЫШЛО', 'TIME RAN OUT') ? 'TIMEOUT' : 'WRONG'); box.locked = true; box.setLamp(ok ? 'good' : 'bad'); audio.play(ok ? 'good' : 'bad'); verdict(ok, ok ? L('РЕМОНТ УСПЕШЕН', 'REPAIR SUCCESSFUL') : why); hud(); deadline = 0; clearTimeout(pending); pending = setTimeout(() => { if (box.open) box.toggleDoor(); setTimeout(() => next(ok), 500); }, 2400); };
  box.onCut = i => { const ok = i === box.task!.answer; finish(ok, L('НЕВЕРНЫЙ ПРОВОД', 'WRONG WIRE')); if (!ok) setTimeout(() => cage.drop?.(.8), 350); };
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
    { const nh = notes.hits(ray); if (nh && !(inspecting && inspectTarget === "lock")) { const bh = ray.intersectObject(book.root, true)[0]; if (!bh || nh.distance < bh.distance) { if (inspecting && inspectTarget === "notes") return;
      if (!inspecting && (cur().state === "rest" || cur().state === "falling" || cur().lowered)) { setInspect(true, "notes"); return; } } } }
    { const kh = lock.hits(ray); if (kh) { const bh = ray.intersectObject(book.root, true)[0]; if (!bh || kh.distance < bh.distance) { if (inspecting && inspectTarget === "lock") return; /* the pick is worked by drags (device) */
      if (!inspecting && (cur().state === "rest" || cur().state === "falling" || cur().lowered)) { setInspect(true, "lock"); return; } } } }
    const jb = ray.intersectObject(journal.root, true)[0], lh = lab.hits(ray); if (jb && (!lh || jb.distance <= lh.distance + .05)) return; // the journal handles its own taps
    if (lh && !inspecting && (cur().state === 'rest' || cur().state === 'falling' || cur().lowered)) { const bh0 = ray.intersectObject(book.root, true)[0]; if (!bh0 || lh.distance < bh0.distance) { setInspect(true, 'lab'); return; } }
    const b = ray.intersectObject(book.root, true)[0], hit = ray.intersectObject(box.group, true)[0], ph = press.hits(ray); if (b && (!hit || b.distance < hit.distance) && (!ph || b.distance < ph.distance)) return;
    if (ph && (!hit || ph.distance < hit.distance)) { if (!inspecting && (cur().state === 'rest' || cur().state === 'falling' || cur().lowered)) setInspect(true, 'pressure'); return; }
    if ((cur().state === 'reading' || cur().state === 'held') && !cur().lowered) { if (!hit) return; }
    const r = box.tap(ray); (window as any).__lastTap = r; if (r && (r !== 'door' || box.open) && !inspecting && (cur().state === 'rest' || cur().state === 'falling' || cur().lowered)) { setInspect(true); if (r !== 'test') return; } if (r === 'door' && box.open) { if (!deadline && !box.locked && !IN_ROOM) deadline = performance.now() + LIMITW() * 1000; if (cur().state === 'rest' || cur().state === 'falling') { const d = box.center().sub(eye); focusTo = [Math.atan2(-d.x, -d.z), Math.atan2(d.y, Math.hypot(d.x, d.z))]; } } });
  const setInspect = (on: boolean, target: "box" | "pressure" | "lab" | "lock" | "notes" = "box") => { if (on) inspectTarget = target; inspecting = on; $('btn-back').hidden = !on; $('hint').style.opacity = on ? '0' : ''; $('task').style.opacity = on && innerWidth > 700 ? '0' : ''; if (on) { focusTo = null; if (target === 'box' && !box.open) box.toggleDoor(); } };
  $('btn-back').onclick = () => setInspect(false); addEventListener('keydown', e => { if (e.key === 'Escape' && inspecting) setInspect(false); });
  $('btn-open').onclick = () => cur().open(); $('btn-close').onclick = () => cur().close(); $('btn-drop').onclick = () => cur().drop();
  $('btn-sound').onclick = () => { audio.unlock(); audio.enabled = !audio.enabled; $('btn-sound').textContent = audio.enabled ? L('Звук: вкл.', 'Sound: on') : L('Звук: выкл.', 'Sound: off'); };
  book.onspread = s => { $('page-label').textContent = `${2 * s + 1}–${2 * s + 2} / ${book.pages.length}`; }; book.onspread(0);
  journal.onspread = s => { $('page-label').textContent = `${2 * s + 1}–${2 * s + 2} / ${journal.pages.length}`; };
  jui.onstate = s => { sync(s); if (s === 'reading') journal.onspread(journal.spread); else if (s === 'rest') book.onspread(book.spread); };
  // free camera (?freecam=1 or key C): orbit / zoom / pan anywhere, including below the floor to the lava
  const orbit = new OrbitControls(camera, renderer.domElement); orbit.enableDamping = true; orbit.maxDistance = 14; orbit.minDistance = .1; orbit.screenSpacePanning = true; orbit.target.set(0, .4, 0); orbit.enabled = false;
  let free = false; const setFree = (on: boolean) => { free = on; orbit.enabled = on; $('btn-cam').textContent = on ? L('Камера: свободная', 'Camera: free') : L('Камера: игрок', 'Camera: player'); if (!on) { camera.position.copy(eye); } else { camera.position.set(eye.x + .3, eye.y + .3, eye.z + 1.6); orbit.target.set(0, floorY + 1, 0); orbit.update(); } };
  $('btn-cam').onclick = () => setFree(!free); addEventListener('keydown', e => { if (e.key.toLowerCase() === 'c') setFree(!free); }); if (params.get('freecam') === '1') setFree(true);
  // unlock audio on every kind of gesture WebKit counts (pointerdown alone is not enough in iOS Home Screen apps)
  for (const ev of ['pointerup', 'touchend', 'click', 'keydown']) addEventListener(ev, () => { audio.unlock(); voice.attach(audio.ctx); }, {passive: true});
  document.addEventListener('visibilitychange', () => { if (!document.hidden && audio.ctx && audio.ctx.state !== 'running') audio.ctx.resume().catch(() => {}); });
  // warm-up behind the loading screen: compile every shader, upload every texture and render a few frames,
  // so the first seconds of play do not hitch on first-use GPU work
  $('load-text').textContent = L('Подготовка…', 'Preparing…');
  // phones: bolts, screws, rivets and tags (< 2.5 cm) stop casting shadows — invisible at that size, but each one is a shadow-pass draw
  if (mobile) { const sp = new T.Sphere(), sc = new T.Vector3(); scene.updateMatrixWorld(true); scene.traverse((o: any) => { if (!o.isMesh || !o.castShadow || !o.geometry) return; if (!o.geometry.boundingSphere) o.geometry.computeBoundingSphere(); o.getWorldScale(sc); if (o.geometry.boundingSphere.radius * Math.max(sc.x, sc.y, sc.z) < .025) o.castShadow = false; }); void sp; }
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
    if (mobile && !req && !standalone && /iPhone|iPod/.test(navigator.userAgent)) { const h = document.createElement('div'); h.id = 'fs-tip'; h.textContent = L('Полный экран: «Поделиться» → «На экран Домой», затем открыть с иконки', 'Full screen: Share → Add to Home Screen, then open from the icon'); h.onclick = () => h.remove(); document.body.append(h); setTimeout(() => h.remove(), 9000); } }
  // adaptive quality: drop the render resolution when frames run long
  let last = performance.now(), acc = 0, frames = 0, frozenLeft = 45, lastTick = -1;
  // 360° look-around from the player's spot: drag to turn the head. Disabled while the book is in hand so page taps never rotate the view.
  const drag = new Map<number, {x: number; y: number}>(); const canLook = () => !free && !inspecting && valvePointer === null && (cur().state === 'rest' || cur().state === 'falling' || cur().lowered);
  // machine controls grab the pointer before look-around and tap logic; a short, still press counts as a tap
  let valveStart = {x: 0, y: 0, t: 0};
  // the device whose controls the pointer grabs: the machine in close-up (pressure apparatus or laboratory)
  let device: {enabled: boolean; hits(r: T.Raycaster): any; pointerDown(r: T.Raycaster, x: number, y: number, c: T.Camera): boolean; pointerMove(x: number, y: number): void; pointerUp(tap: boolean): void} = press;
  renderer.domElement.addEventListener('pointerdown', e => { if (valvePointer !== null || free || ((cur().state === 'reading' || cur().state === 'held') && !cur().lowered)) return;
    ray.setFromCamera(new T.Vector2(e.clientX / innerWidth * 2 - 1, -e.clientY / innerHeight * 2 + 1), camera);
    if (!inspecting || (inspectTarget !== 'pressure' && inspectTarget !== 'lab' && inspectTarget !== 'lock')) { if (press.hits(ray) || lab.hits(ray)) return; } // first tap only opens the close-up
    if (!inspecting && inspectTarget !== 'lock' && lock.hits(ray)) return;
    device = inspectTarget === 'lab' ? lab : inspectTarget === 'lock' && inspecting ? lock : press; if (!device.enabled) return;
    if (device.pointerDown(ray, e.clientX, e.clientY, camera)) { haptic('tap'); valvePointer = e.pointerId; valveStart = {x: e.clientX, y: e.clientY, t: performance.now()}; try { renderer.domElement.setPointerCapture(e.pointerId); } catch {} } });
  addEventListener('pointermove', e => { if (e.pointerId === valvePointer) device.pointerMove(e.clientX, e.clientY); });
  const endValve = (e: PointerEvent) => { if (e.pointerId !== valvePointer) return; device.pointerUp(e.type === 'pointerup' && Math.hypot(e.clientX - valveStart.x, e.clientY - valveStart.y) < 10); /* a still press counts as a tap, however long it is held */ setTimeout(() => { valvePointer = null; }, 0); };
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
    // the cage lock comes to the player and grows (the camera stays put)
    const lockDist = camera.aspect < .9 ? .62 : mobile ? .52 : .5, lockScale = lockDist / (camera.aspect < .9 ? .66 : mobile ? .5 : .44), lockLift = mobile && camera.aspect >= .9 ? .03 : 0;
    lock.present(inspectTarget === "lock" ? inspectK : 0, eye, lockDist, lockScale, lockLift);
    if (free) orbit.update(); else if (inspectK > .001) {
      // close-up: stand ~55 cm in front of the panel (still inside the cage), framing meter + wires
      const P = inspectTarget === "pressure", L = inspectTarget === "lab", K = inspectTarget === "lock", N = inspectTarget === "notes", tg = N ? notes.group : K ? lock.group : P ? press.group : L ? lab.group : box.group, c = N ? notes.center() : K ? lock.center() : P ? press.center() : L ? lab.center() : box.center(), n = new T.Vector3(0, 0, 1).applyQuaternion(tg.getWorldQuaternion(new T.Quaternion())), at = c.clone().add(new T.Vector3(0, N ? (mobile ? -.02 : 0) : K ? (mobile ? -.045 : -.015) * CodeLock.SCALE : P || L ? 0 : .05, 0)), from = c.clone().addScaledVector(n, N ? (camera.aspect < .9 ? 1.45 : mobile ? .62 : .72) : K ? (camera.aspect < .9 ? .66 : mobile ? .5 : .44) * CodeLock.SCALE : L ? (camera.aspect < .9 ? 1.95 : 1.12) : P ? (camera.aspect < .9 ? 1.75 : 1.05) : camera.aspect < .9 ? 1.3 : 1.12).add(new T.Vector3(0, N ? 0 : K ? .09 * CodeLock.SCALE : P ? .06 : L ? .04 : .09, 0));
      const look = new T.Quaternion().setFromRotationMatrix(new T.Matrix4().lookAt(from, at, new T.Vector3(0, 1, 0))), base = new T.Quaternion().setFromEuler(new T.Euler(pitch, yaw, 0, 'YXZ'));
      if (K) { from.copy(eye); at.copy(lock.presentedCenter(eye, lockDist, lockLift)).add(new T.Vector3(0, mobile ? -.04 : -.012, 0)); look.setFromRotationMatrix(new T.Matrix4().lookAt(from, at, new T.Vector3(0, 1, 0))); }
      camera.position.copy(eye).lerp(from, inspectK); camera.quaternion.copy(base).slerp(look, inspectK);
      if (!inspecting && inspectK < .002) inspectK = 0;
    } else { camera.position.copy(eye); camera.quaternion.setFromEuler(new T.Euler(pitch, yaw, 0, 'YXZ')); }
    if (kind === 'formula' && (flink.view()?.doses.length ?? 0) > 0 && Math.random() < dt * 1.6) audio.play('blub', .6);
    if (tellPending && frameNo % 30 === 0) { const intro = tellPending.startsWith('intro:'), want = intro ? tellPending.slice(6) : tellPending; if (want !== kind) tellPending = null; else if (intro ? voice.say('intro', 3, 0) : voice.say(('tutorial_' + kind) as any, 3, 0)) tellPending = intro ? kind : null; }
    cage.update(dt); ui.update(dt); jui.update(dt); if (kind === "wire" || inspectTarget === "box") box.update(dt); if (kind === "pressure" || inspectTarget === "pressure") press.update(dt, link.view()); if (kind === "formula" || inspectTarget === "lab") lab.update(dt, flink.view()); if (kind === "lock" || inspectTarget === "lock") lock.update(dt); /* only the machine in play animates */
    if (focusTo) { let dy = focusTo[0] - yawT; dy = Math.atan2(Math.sin(dy), Math.cos(dy)); yawT += dy * Math.min(1, dt * 5); pitchT += (focusTo[1] - pitchT) * Math.min(1, dt * 5); if (Math.abs(dy) < .002 && Math.abs(focusTo[1] - pitchT) < .002) focusTo = null; }
    { const sw = kind === 'pressure' && !!link.view()?.surgeWarning; document.body.classList.toggle('surge', sw); if (sw && !surgeSaid) { surgeSaid = true; voice.say('surge', 3, 0); haptic('tap'); } }
    { const n = +$('clock-num').textContent!, run = $('clock').dataset.urgent === 'true'; document.body.classList.toggle('urgent', run); if (run && !warned10) { warned10 = true; voice.say('ten_seconds', 2, 0); }
      if (run && n !== lastTick) { lastTick = n; audio.play('clockTick'); } }
    if (kind === 'formula') { const v = flink.view(), lim = limitMs('formula') / 1000, left = v ? (v.outcome === 'RUNNING' ? (frozenLeft = Math.max(0, (v.deadline - performance.now()) / 1000)) : v.outcome === 'STABILIZED' ? frozenLeft : 0) : lim;
      $('clock-num').textContent = String(Math.ceil(left)); ($('clock-ring') as any).style.strokeDashoffset = String(176 * (1 - left / lim)); $('clock').dataset.urgent = String(!!v && v.outcome === 'RUNNING' && left < 10); }
    else if (kind === 'pressure') { const v = link.view(), lim = limitMs('pressure') / 1000, left = v ? (v.outcome === 'RUNNING' ? (frozenLeft = Math.max(0, (v.deadline - performance.now()) / 1000)) : v.outcome === 'STABILIZED' ? frozenLeft : 0) : lim;
      $('clock-num').textContent = String(Math.ceil(left)); ($('clock-ring') as any).style.strokeDashoffset = String(176 * (1 - left / lim)); $('clock').dataset.urgent = String(!!v && v.outcome === 'RUNNING' && left < 10); }
    else { const left = deadline ? Math.max(0, (deadline - performance.now()) / 1000) : LIMITW(); $('clock-num').textContent = String(Math.ceil(left)); ($('clock-ring') as any).style.strokeDashoffset = String(176 * (1 - left / LIMITW())); $('clock').dataset.urgent = String(!!deadline && left < 10); if (kind === "lock" && deadline && left <= 0 && !lockDone) { lock.expire(); lockFinish(false, "TIMEOUT"); } else if (kind !== "lock" && deadline && left <= 0 && !box.locked) { finish(false, L('ВРЕМЯ ВЫШЛО', 'TIME RAN OUT')); setTimeout(() => cage.drop?.(.8), 350); } }
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
    bloom.strength = .42 + (falling ? .25 : 0) + (shake > .8 ? .4 : 0); if (composer) composer.render(); else renderer.render(scene, camera); requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
  (window as any).__manual = {book, ui, renderer, scene, camera, get state() { return ui.state; }, get info() { return renderer.info.render; }, box, press, link, lab, flink, journal, jui, get kind() { return kind; }, lock, notes, rows, endRun() { taskNo = TOTAL; next(true); }, setInspect, cage, get shake() { return shake; }, look(y: number, p: number) { yaw = yawT = y; pitch = pitchT = p; }, setFree, set timeScale(v: number) { timeScale = v; }, step(sec: number) { for (let i = 0; i < Math.round(sec * 60); i++) { cage.update(1 / 60); ui.update(1 / 60); jui.update(1 / 60); } }};
}
boot().catch(e => { $('load-text').textContent = 'Failed: ' + (e?.message || e); console.error(e); });
