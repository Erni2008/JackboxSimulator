// Dedicated test scene for THE ENGINEER'S MANUAL (THE BROKEN ELEVATOR, mode 5).
import * as T from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {EngineersManual, TH} from './games/broken-elevator/manual/book';
import {ManualInteraction, type HoldState} from './games/broken-elevator/manual/interaction';
import {BookAudio} from './games/broken-elevator/manual/audio';
import {SAMPLE_MANUAL, loadManualContent} from './games/broken-elevator/manual/content';
import {buildCage, contactShadow} from './games/broken-elevator/manual/test-scene';
import {buildGlbCage} from './games/broken-elevator/manual/glb-cage';

const $ = (id: string) => document.getElementById(id) as HTMLElement;
const params = new URLSearchParams(location.search);
const mobile = matchMedia('(pointer: coarse)').matches || Math.min(screen.width, screen.height) < 600;
let quality: 'high' | 'low' = params.get('quality') === 'low' || (mobile && params.get('quality') !== 'high') ? 'low' : 'high';

const renderer = new T.WebGLRenderer({antialias: true, powerPreference: 'high-performance', preserveDrawingBuffer: params.has('capture')});
renderer.outputColorSpace = T.SRGBColorSpace; renderer.toneMapping = T.AgXToneMapping; renderer.toneMappingExposure = .95;
renderer.shadowMap.enabled = true; renderer.shadowMap.type = T.PCFShadowMap;
let dpr = Math.min(devicePixelRatio, quality === 'high' ? 2 : 1.75); renderer.setPixelRatio(dpr);
$('viewport').append(renderer.domElement);
const scene = new T.Scene(), camera = new T.PerspectiveCamera(50, 1, .03, 40);
camera.position.set(0, 1.56, .5); camera.lookAt(0, .1, -.25);

function resize() { const w = innerWidth, h = innerHeight; renderer.setSize(w, h, false); renderer.domElement.style.width = w + 'px'; renderer.domElement.style.height = h + 'px'; camera.aspect = w / h; camera.fov = camera.aspect < .9 ? 58 : 46; camera.updateProjectionMatrix(); }
addEventListener('resize', resize); resize();

const audio = new BookAudio();
let timeScale = 1; // test hook: 0 freezes animation for frame-exact captures
async function boot() {
  $('load-text').textContent = 'Lighting the cage…';
  // cage.glb is the elevator; the old procedural cage stays available with ?cage=procedural
  const procedural = params.get('cage') === 'procedural';
  const cage: any = procedural ? await buildCage(renderer, scene, quality === 'high') : await buildGlbCage(renderer, scene, quality === 'high');
  const floorY: number = cage.floorY ?? 0, eye: T.Vector3 = cage.eye ?? new T.Vector3(0, 1.56, .5);
  camera.position.copy(eye); let yaw = 0, pitch = -.5;
  $('load-text').textContent = 'Binding the manual…';
  // ?rules=<url> lets the server supply real puzzle rules (ManualContent JSON); otherwise the specimen
  const rules = params.get('rules') ? await loadManualContent(params.get('rules')!).catch(e => { console.warn(e); return SAMPLE_MANUAL; }) : SAMPLE_MANUAL;
  const book = await EngineersManual.create(renderer, rules, quality);
  book.sounds = {coverOpen: () => audio.play('coverOpen'), coverClose: () => audio.play('coverClose'), pageTurn: s => audio.play('pageTurn', s), creak: a => audio.play('creak', a)};
  scene.add(book.root);
  const shadow = contactShadow(); scene.add(shadow);
  const ui = new ManualInteraction(book, camera, renderer.domElement, audio, cage.planes);
  if (cage.shelf) { ui.place(cage.shelf.top.clone().add(new T.Vector3(0, TH / 2, 0)), new T.Quaternion().setFromEuler(new T.Euler(0, .12, 0))); const d = cage.shelf.top.clone().sub(eye); yaw = Math.atan2(-d.x, -d.z); pitch = Math.atan2(d.y, Math.hypot(d.x, d.z)); }
  else ui.place(new T.Vector3(.06, TH / 2, -.22), new T.Quaternion().setFromEuler(new T.Euler(0, .5, 0)));
  const hints: Record<HoldState, string> = {rest: mobile ? 'Drag to look around · tap the manual to pick it up' : 'Drag to look around · click the manual to pick it up', lifting: '', held: mobile ? 'Tap the cover to open' : 'Click the cover to open', reading: mobile ? 'Tap the right page to turn forward, the left page to go back · swipe · pinch to zoom' : 'Click the right page to turn forward, the left page to go back · scroll to zoom', releasing: '', falling: ''};
  const sync = (s: HoldState) => { $('hint').textContent = hints[s]; $('btn-open').hidden = s !== 'held'; $('btn-close').hidden = s !== 'reading'; $('btn-drop').hidden = !['held', 'reading'].includes(s); document.body.dataset.state = s; };
  ui.onstate = sync; sync('rest');
  $('btn-open').onclick = () => ui.open(); $('btn-close').onclick = () => ui.close(); $('btn-drop').onclick = () => ui.drop();
  $('btn-sound').onclick = () => { audio.unlock(); audio.enabled = !audio.enabled; $('btn-sound').textContent = audio.enabled ? 'Sound on' : 'Sound off'; };
  book.onspread = s => { $('page-label').textContent = `${2 * s + 1}–${2 * s + 2} / ${book.pages.length}`; }; book.onspread(0);
  // free camera (?freecam=1 or key C): orbit / zoom / pan anywhere, including below the floor to the lava
  const orbit = new OrbitControls(camera, renderer.domElement); orbit.enableDamping = true; orbit.maxDistance = 14; orbit.minDistance = .1; orbit.screenSpacePanning = true; orbit.target.set(0, .4, 0); orbit.enabled = false;
  let free = false; const setFree = (on: boolean) => { free = on; orbit.enabled = on; $('btn-cam').textContent = on ? 'Camera: free' : 'Camera: player'; if (!on) { camera.position.copy(eye); } else { camera.position.set(eye.x + .3, eye.y + .3, eye.z + 1.6); orbit.target.set(0, floorY + 1, 0); orbit.update(); } };
  $('btn-cam').onclick = () => setFree(!free); addEventListener('keydown', e => { if (e.key.toLowerCase() === 'c') setFree(!free); }); if (params.get('freecam') === '1') setFree(true);
  $('loading').hidden = true;
  // adaptive quality: drop the render resolution when frames run long
  let last = performance.now(), acc = 0, frames = 0;
  // 360° look-around from the player's spot: drag to turn the head. Disabled while the book is in hand so page taps never rotate the view.
  const drag = new Map<number, {x: number; y: number}>(); const canLook = () => !free && (ui.state === 'rest' || ui.state === 'falling');
  renderer.domElement.addEventListener('pointerdown', e => drag.set(e.pointerId, {x: e.clientX, y: e.clientY}));
  addEventListener('pointerup', e => drag.delete(e.pointerId)); addEventListener('pointercancel', e => drag.delete(e.pointerId));
  renderer.domElement.addEventListener('pointermove', e => { const p = drag.get(e.pointerId); if (!p || drag.size > 1) return; const dx = e.clientX - p.x, dy = e.clientY - p.y; p.x = e.clientX; p.y = e.clientY; if (!canLook()) return; const k = 2.6 / Math.max(innerHeight, 400); yaw += dx * k; pitch = T.MathUtils.clamp(pitch + dy * k, -1.45, 1.35); });
  const loop = (now: number) => {
    const dt = Math.min(.05, (now - last) / 1000) * timeScale; last = now; acc += dt; frames++;
    if (acc > 2) { const ms = acc / frames * 1000; if (ms > 26 && dpr > 1) { dpr = Math.max(1, dpr - .25); renderer.setPixelRatio(dpr); resize(); } acc = 0; frames = 0; }
    // gentle head motion while looking around the cage (none while reading)
    if (free) orbit.update(); else { camera.position.copy(eye); camera.quaternion.setFromEuler(new T.Euler(pitch, yaw, 0, 'YXZ')); }
    cage.update(dt); ui.update(dt);
    const surface = cage.shelf && Math.abs(book.root.position.y - TH / 2 - cage.shelf.top.y) < .2 && Math.abs(book.root.position.z - cage.shelf.top.z) < .2 ? cage.shelf.top.y : floorY; const h = Math.max(0, book.root.position.y - TH / 2 - surface); shadow.position.set(book.root.position.x, surface + .0012, book.root.position.z); shadow.rotation.z = new T.Euler().setFromQuaternion(book.root.quaternion, 'YXZ').y; (shadow.material as T.MeshBasicMaterial).opacity = .75 * Math.max(0, 1 - h / .18); shadow.visible = h < .18;
    renderer.render(scene, camera); requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
  (window as any).__manual = {book, ui, renderer, scene, camera, get state() { return ui.state; }, get info() { return renderer.info.render; }, cage, look(y: number, p: number) { yaw = y; pitch = p; }, setFree, set timeScale(v: number) { timeScale = v; }, step(sec: number) { for (let i = 0; i < Math.round(sec * 60); i++) { cage.update(1 / 60); ui.update(1 / 60); } }};
}
boot().catch(e => { $('load-text').textContent = 'Failed: ' + (e?.message || e); console.error(e); });
