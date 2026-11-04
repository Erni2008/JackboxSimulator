// Dedicated test scene for THE ENGINEER'S MANUAL (THE BROKEN ELEVATOR, mode 5).
import * as T from 'three';
import {EngineersManual, TH} from './games/broken-elevator/manual/book';
import {ManualInteraction, type HoldState} from './games/broken-elevator/manual/interaction';
import {BookAudio} from './games/broken-elevator/manual/audio';
import {SAMPLE_MANUAL} from './games/broken-elevator/manual/content';
import {buildCage, contactShadow} from './games/broken-elevator/manual/test-scene';

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
const baseQ = camera.quaternion.clone();

function resize() { const w = innerWidth, h = innerHeight; renderer.setSize(w, h, false); renderer.domElement.style.width = w + 'px'; renderer.domElement.style.height = h + 'px'; camera.aspect = w / h; camera.fov = camera.aspect < .9 ? 58 : 46; camera.updateProjectionMatrix(); }
addEventListener('resize', resize); resize();

const audio = new BookAudio();
let timeScale = 1; // test hook: 0 freezes animation for frame-exact captures
async function boot() {
  $('load-text').textContent = 'Lighting the cage…';
  const cage = await buildCage(renderer, scene, quality === 'high');
  $('load-text').textContent = 'Binding the manual…';
  const book = await EngineersManual.create(renderer, SAMPLE_MANUAL, quality);
  book.sounds = {coverOpen: () => audio.play('coverOpen'), coverClose: () => audio.play('coverClose'), pageTurn: s => audio.play('pageTurn', s), creak: a => audio.play('creak', a)};
  scene.add(book.root);
  const shadow = contactShadow(); scene.add(shadow);
  const ui = new ManualInteraction(book, camera, renderer.domElement, audio, cage.planes);
  ui.place(new T.Vector3(.06, TH / 2, -.22), new T.Quaternion().setFromEuler(new T.Euler(0, .5, 0)));
  const hints: Record<HoldState, string> = {rest: mobile ? 'Tap the manual to pick it up' : 'Click the manual to pick it up', lifting: '', held: mobile ? 'Tap the cover to open' : 'Click the cover to open', reading: mobile ? 'Swipe to turn · pinch to zoom · double-tap to inspect' : 'Click a page corner or use ← → · scroll to zoom · double-click to inspect', releasing: '', falling: ''};
  const sync = (s: HoldState) => { $('hint').textContent = hints[s]; $('btn-open').hidden = s !== 'held'; $('btn-close').hidden = s !== 'reading'; $('btn-drop').hidden = !['held', 'reading'].includes(s); $('btn-prev').hidden = $('btn-next').hidden = s !== 'reading'; document.body.dataset.state = s; };
  ui.onstate = sync; sync('rest');
  $('btn-open').onclick = () => ui.open(); $('btn-close').onclick = () => ui.close(); $('btn-drop').onclick = () => ui.drop(); $('btn-prev').onclick = () => ui.turn(-1); $('btn-next').onclick = () => ui.turn(1);
  $('btn-sound').onclick = () => { audio.unlock(); audio.enabled = !audio.enabled; $('btn-sound').textContent = audio.enabled ? 'Sound on' : 'Sound off'; };
  book.onspread = s => { $('page-label').textContent = `${2 * s + 1}–${2 * s + 2} / ${book.pages.length}`; }; book.onspread(0);
  $('loading').hidden = true;
  // adaptive quality: drop the render resolution when frames run long
  let last = performance.now(), acc = 0, frames = 0, look = new T.Vector2();
  renderer.domElement.addEventListener('pointermove', e => { if (e.pointerType === 'mouse') look.set(e.clientX / innerWidth - .5, e.clientY / innerHeight - .5); });
  const loop = (now: number) => {
    const dt = Math.min(.05, (now - last) / 1000) * timeScale; last = now; acc += dt; frames++;
    if (acc > 2) { const ms = acc / frames * 1000; if (ms > 26 && dpr > 1) { dpr = Math.max(1, dpr - .25); renderer.setPixelRatio(dpr); resize(); } acc = 0; frames = 0; }
    // gentle head motion while looking around the cage (none while reading)
    const still = ui.state === 'reading' || ui.state === 'held' ? 0 : 1; camera.quaternion.copy(baseQ).multiply(new T.Quaternion().setFromEuler(new T.Euler(-look.y * .12 * still, -look.x * .2 * still, 0)));
    cage.update(dt); ui.update(dt);
    const h = Math.max(0, book.root.position.y - TH / 2); shadow.position.set(book.root.position.x, .0012, book.root.position.z); shadow.rotation.z = new T.Euler().setFromQuaternion(book.root.quaternion, 'YXZ').y; (shadow.material as T.MeshBasicMaterial).opacity = .75 * Math.max(0, 1 - h / .18); shadow.visible = h < .18;
    renderer.render(scene, camera); requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
  (window as any).__manual = {book, ui, renderer, scene, camera, get state() { return ui.state; }, get info() { return renderer.info.render; }, set timeScale(v: number) { timeScale = v; }, step(sec: number) { for (let i = 0; i < Math.round(sec * 60); i++) { cage.update(1 / 60); ui.update(1 / 60); } }};
}
boot().catch(e => { $('load-text').textContent = 'Failed: ' + (e?.message || e); console.error(e); });
