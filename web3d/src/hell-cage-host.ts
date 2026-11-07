// АДСКАЯ КЛЕТКА / THE HELL CAGE — the host's big screen (PC browser, captured by the stream).
// One cage per player hangs on chains over a lava pit. Every cage sinks slowly; a failed repair drops it hard.
// Data: read-only HTTP feed /rooms/{code}/cage?token=<host token> (never touches the host's own socket).
// Without ?room the page runs a demo shift with sample players (for previews and rehearsals).
import * as T from 'three';
import {RGBELoader} from 'three/addons/loaders/RGBELoader.js';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/addons/postprocessing/UnrealBloomPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
import {ShaderPass} from 'three/addons/postprocessing/ShaderPass.js';

const $ = (id: string) => document.getElementById(id) as HTMLElement;
const params = new URLSearchParams(location.search), hash = new URLSearchParams(location.hash.slice(1));
const ROOM = params.get('room'), TOKEN = hash.get('token') || params.get('token'), DEMO = !ROOM || params.get('demo') === '1';
let LANG: 'ru' | 'en' = params.get('lang') === 'en' ? 'en' : 'ru'; const L = (ru: string, en: string) => LANG === 'ru' ? ru : en;
const TEX = '../broken-elevator-manual/textures/';
const CHARS = ['skeleton', 'pumpkin', 'plague_doctor', 'dracula', 'ghost', 'voodoo', 'zombie', 'puppeteer'];

// ------------------------------------------------------------------ rules of the descent (host-side presentation)
// the server's CageShift decides every height (100 m start, 15 m per broken round, 1st fail −25 m, 2nd → 2 m, 3rd = death)
let START_M = 100;

// ------------------------------------------------------------------ renderer / scene
const renderer = new T.WebGLRenderer({antialias: false, powerPreference: 'high-performance'});
let DPR = Math.min(devicePixelRatio, 1.25); renderer.setPixelRatio(DPR); renderer.shadowMap.enabled = true; renderer.shadowMap.type = T.PCFShadowMap; renderer.shadowMap.autoUpdate = false; renderer.outputColorSpace = T.SRGBColorSpace; renderer.toneMapping = T.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
$('view').append(renderer.domElement);
const scene = new T.Scene(); scene.background = new T.Color('#0a0507'); scene.fog = new T.FogExp2('#1a0806', .01);
const camera = new T.PerspectiveCamera(36, 16 / 9, .1, 200);
// multisampled post chain: thin bars and chain links stay crisp and stable (the default chain has no MSAA)
const composer = new EffectComposer(renderer, new T.WebGLRenderTarget(1, 1, {type: T.HalfFloatType, samples: 2})) ; composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new T.Vector2(512, 512), .55, .5, .8); composer.addPass(bloom); composer.addPass(new OutputPass());
// film finish: heat shimmer rising off the lava (strongest at the bottom of the frame), slight lens fringing, grain, vignette
const finish = new ShaderPass({uniforms: {tDiffuse: {value: null}, t: {value: 0}, shake: {value: 0}},
  vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }`,
  fragmentShader: `uniform sampler2D tDiffuse; uniform float t, shake; varying vec2 vUv;
    float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233))) * 43758.5453); }
    void main(){ vec2 uv = vUv; float heat = pow(max(0., .3 - uv.y) / .3, 2.) * .0018;   // shimmer only over the lava, never over the cages
      uv.x += sin(uv.y*90. + t*3.1) * heat + sin(uv.y*37. - t*2.3) * heat*.6; uv.y += cos(uv.x*70. + t*2.7) * heat*.5;
      vec2 d = uv - .5; float ca = shake * .003;   // no fringing at rest: the cages stay sharp
      vec3 c = vec3(texture2D(tDiffuse, uv + d*ca).r, texture2D(tDiffuse, uv).g, texture2D(tDiffuse, uv - d*ca).b);
      c *= 1. - smoothstep(.45, 1.05, length(d * vec2(1.25, 1.))) * .55;
      c += (h(uv*vec2(1920.,1080.) + fract(t)*91.) - .5) * .012;
      gl_FragColor = vec4(c, 1.); }`});
composer.addPass(finish);
new RGBELoader().load(TEX + 'boiler_room_1k.hdr', t => { t.mapping = T.EquirectangularReflectionMapping; const pm = new T.PMREMGenerator(renderer); scene.environment = pm.fromEquirectangular(t).texture; scene.environmentIntensity = .35; t.dispose(); });

const loader = new T.TextureLoader(), tex = (f: string, srgb: boolean, rep = 1) => { const t = loader.load(f); t.colorSpace = srgb ? T.SRGBColorSpace : T.NoColorSpace; t.wrapS = t.wrapT = T.RepeatWrapping; t.repeat.set(rep, rep); t.anisotropy = 16; return t; };
const canvasTex = (w: number, h: number, draw: (x: CanvasRenderingContext2D) => void) => { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d')!); const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; t.anisotropy = 16; return t; };
const rusty = (rep: number, tint: string, metal = .85, rough = .55) => new T.MeshStandardMaterial({color: tint, map: tex(TEX + 'rusty_metal_05_diff_1k.jpg', true, rep), normalMap: tex(TEX + 'rusty_metal_05_nor_gl_1k.jpg', false, rep), roughnessMap: tex(TEX + 'rusty_metal_05_rough_1k.jpg', false, rep), metalness: metal, roughness: rough, envMapIntensity: 1});
const flameTex = canvasTex(64, 128, x => { const g = x.createRadialGradient(32, 92, 2, 32, 80, 60); g.addColorStop(0, 'rgba(255,255,230,1)'); g.addColorStop(.25, 'rgba(255,200,90,.85)'); g.addColorStop(.6, 'rgba(255,90,20,.35)'); g.addColorStop(1, 'rgba(255,40,0,0)');
  x.fillStyle = g; x.beginPath(); x.moveTo(32, 2); x.bezierCurveTo(58, 50, 60, 100, 32, 126); x.bezierCurveTo(4, 100, 6, 50, 32, 2); x.fill(); });
const glowTex = canvasTex(128, 128, x => { const g = x.createRadialGradient(64, 64, 0, 64, 64, 64); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(.25, 'rgba(255,255,255,.55)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, 128, 128); });

// ---- lights: cold moonlight from the window, hot lava from below, two wall lanterns
scene.add(new T.HemisphereLight('#4a5a80', '#5a1a08', .6));
const moon = new T.SpotLight('#9fb6ff', 120, 60, .35, .8, 1.2); moon.position.set(0, 22, -14); moon.target.position.set(0, -2, 2); moon.castShadow = true; moon.shadow.mapSize.set(1024, 1024); moon.shadow.bias = -.0004; moon.shadow.radius = 4; scene.add(moon, moon.target);
const lavaLight = new T.PointLight('#ff5a14', 200, 26, 1.6); lavaLight.position.set(0, -5.5, 2); scene.add(lavaLight);
const lavaLight2 = new T.PointLight('#ff7a20', 120, 18, 1.6); lavaLight2.position.set(-8, -5, 4); /* folded into the main lava light */
const lavaLight3 = new T.PointLight('#ff7a20', 120, 18, 1.6); lavaLight3.position.set(8, -5, 4); 
const lanterns: {light: T.PointLight; flame: T.Sprite}[] = [];

// ---- back wall: rusted iron panels, pillars, the arched moon window and its light shaft
const wall = new T.Mesh(new T.PlaneGeometry(80, 40), rusty(6, '#4a3a36', .6, .8)); wall.position.set(0, 4, -10); wall.receiveShadow = true; scene.add(wall);
// the lava's glow climbing the foot of the wall hides the seam where the pit meets it
const footTex = canvasTex(8, 256, x => { const g = x.createLinearGradient(0, 0, 0, 256); g.addColorStop(0, 'rgba(255,90,20,0)'); g.addColorStop(.7, 'rgba(255,90,20,.55)'); g.addColorStop(1, 'rgba(255,150,60,.9)'); x.fillStyle = g; x.fillRect(0, 0, 8, 256); });
const foot = new T.Mesh(new T.PlaneGeometry(80, 5), new T.MeshBasicMaterial({map: footTex, transparent: true, blending: T.AdditiveBlending, depthWrite: false, fog: false})); foot.position.set(0, -4.2 + 2.3, -9.7); scene.add(foot);
const pillarMat = rusty(2, '#3a2e2a', .7, .7);
for (const x of [-16, -9.5, 9.5, 16]) { const p = new T.Mesh(new T.BoxGeometry(1.2, 30, 1.2), pillarMat); p.position.set(x, 4, -9); scene.add(p); }
const windowTex = canvasTex(512, 640, x => {
  const W = 512, H = 640, arch = (inset: number) => { x.beginPath(); x.moveTo(inset, H); x.lineTo(inset, W / 2); x.arc(W / 2, W / 2, W / 2 - inset, Math.PI, 0); x.lineTo(W - inset, H); x.closePath(); };
  const g = x.createRadialGradient(W / 2, 250, 10, W / 2, 300, 420); g.addColorStop(0, '#dfe9ff'); g.addColorStop(.18, '#8ea4d8'); g.addColorStop(.55, '#2a3558'); g.addColorStop(1, '#0c1122'); arch(20); x.fillStyle = g; x.fill();
  x.fillStyle = 'rgba(240,246,255,.95)'; x.beginPath(); x.arc(W / 2 + 20, 230, 70, 0, 7); x.fill(); // the moon
  x.strokeStyle = '#0b0a0c'; x.lineWidth = 14; for (let i = 1; i < 6; i++) { x.beginPath(); x.moveTo(i * W / 6, 40); x.lineTo(i * W / 6, H); x.stroke(); } for (let j = 1; j < 7; j++) { x.beginPath(); x.moveTo(0, j * H / 7); x.lineTo(W, j * H / 7); x.stroke(); }
  x.lineWidth = 34; arch(20); x.stroke();
});
const win = new T.Mesh(new T.PlaneGeometry(6, 7.5), new T.MeshBasicMaterial({map: windowTex, toneMapped: false, fog: false})); win.position.set(0, 7.2, -9.8); scene.add(win);
const shaftTex = canvasTex(64, 256, x => { const g = x.createLinearGradient(0, 0, 0, 256); g.addColorStop(0, 'rgba(170,190,255,.55)'); g.addColorStop(1, 'rgba(170,190,255,0)'); x.fillStyle = g; x.fillRect(0, 0, 64, 256); const h = x.createLinearGradient(0, 0, 64, 0); h.addColorStop(0, 'rgba(0,0,0,1)'); h.addColorStop(.5, 'rgba(0,0,0,0)'); h.addColorStop(1, 'rgba(0,0,0,1)'); x.globalCompositeOperation = 'destination-out'; x.fillStyle = h; x.fillRect(0, 0, 64, 256); });
for (const [dx, rot, w] of [[0, 0, 5], [-1.2, .14, 3], [1.4, -.12, 3]] as const) { const s = new T.Mesh(new T.PlaneGeometry(w, 22), new T.MeshBasicMaterial({map: shaftTex, transparent: true, opacity: .16, blending: T.AdditiveBlending, depthWrite: false, fog: false})); s.position.set(dx, 1, -6); s.rotation.z = rot; s.rotation.x = -.25; scene.add(s); }
for (const x of [-12.8, 12.8]) { // wall lanterns
  const body = new T.Mesh(new T.CylinderGeometry(.22, .28, .7, 8), rusty(1, '#2a2220')); body.position.set(x, 2.6, -8.3); scene.add(body);
  const flame = new T.Sprite(new T.SpriteMaterial({map: glowTex, color: '#ffb050', blending: T.AdditiveBlending, depthWrite: false, toneMapped: false})); flame.scale.setScalar(1.6); flame.position.set(x, 2.6, -8); scene.add(flame);
  const light = new T.PointLight('#ff9a40', 30, 12, 1.8); light.position.set(x, 2.6, -7.6); /* flame sprite only: a point light per lantern costs every lit pixel */ lanterns.push({light, flame});
}

// ---- the lava pit: animated crust with glowing cracks
const LAVA_Y = -4.2;
const lavaMat = new T.ShaderMaterial({uniforms: {t: {value: 0}, heat: {value: 1}}, fog: false,
  vertexShader: `varying vec2 vUv; varying vec3 vW; void main(){ vUv = uv; vec4 w = modelMatrix * vec4(position,1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
  fragmentShader: `uniform float t, heat; varying vec2 vUv; varying vec3 vW;
    float h(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
    float n(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f); return mix(mix(h(i),h(i+vec2(1,0)),f.x), mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x), f.y); }
    float fbm(vec2 p){ float v = 0., a = .5; for(int i=0;i<3;i++){ v += a*n(p); p = p*2.03 + vec2(1.7,9.2); a *= .5; } return v; }
    vec2 cell(vec2 p){ vec2 i = floor(p), f = fract(p); float d1 = 8., d2 = 8.; for(int y=-1;y<=1;y++) for(int x=-1;x<=1;x++){ vec2 g = vec2(x,y); vec2 o = vec2(h(i+g), h(i+g+17.)); o = .5 + .5*sin(t*.35 + 6.28*o); float d = length(g + o - f); if(d < d1){ d2 = d1; d1 = d; } else if(d < d2) d2 = d; } return vec2(d1, d2); }
    void main(){ vec2 p = vW.xz * .55; p += vec2(fbm(p*.6 + t*.05), fbm(p*.6 - t*.04)) * 1.4;
      vec2 c = cell(p); float crack = 1. - smoothstep(.0, .07, c.y - c.x); float flow = fbm(p*2. + vec2(t*.15, -t*.1));
      float hot = clamp(crack*.95 + pow(flow, 4.)*.6, 0., 1.) * heat;
      vec3 crust = mix(vec3(.05,.02,.015), vec3(.22,.06,.02), flow);
      vec3 glow = mix(vec3(1.,.2,.02), vec3(1.,.55,.12), crack*crack);
      vec3 col = mix(crust, glow * 1.25, hot * .85);
      float dist = length(vW.xz - vec2(0., 2.)); col *= 1. - smoothstep(14., 34., dist) * .7;
      gl_FragColor = vec4(col, 1.);
    }`});
const lava = new T.Mesh(new T.PlaneGeometry(90, 50, 1, 1), lavaMat); lava.rotation.x = -Math.PI / 2; lava.position.set(0, LAVA_Y, 4); scene.add(lava);

// ---- embers rising from the lava, and slow red smoke
const EMBERS = 650, emberGeo = new T.BufferGeometry(), ep = new Float32Array(EMBERS * 3), ev = new Float32Array(EMBERS * 3), el = new Float32Array(EMBERS);
const resetEmber = (i: number, fresh = false) => { ep[i * 3] = (Math.random() - .5) * 34; ep[i * 3 + 1] = fresh ? LAVA_Y + Math.random() * 14 : LAVA_Y; ep[i * 3 + 2] = (Math.random() - .4) * 12; ev[i * 3] = (Math.random() - .5) * .4; ev[i * 3 + 1] = .6 + Math.random() * 1.6; ev[i * 3 + 2] = (Math.random() - .5) * .3; el[i] = Math.random(); };
for (let i = 0; i < EMBERS; i++) resetEmber(i, true);
emberGeo.setAttribute('position', new T.BufferAttribute(ep, 3)); emberGeo.setAttribute('life', new T.BufferAttribute(el, 1));
const embers = new T.Points(emberGeo, new T.ShaderMaterial({transparent: true, depthWrite: false, blending: T.AdditiveBlending, uniforms: {map: {value: glowTex}},
  vertexShader: `attribute float life; varying float vL; void main(){ vL = life; vec4 mv = modelViewMatrix * vec4(position,1.); gl_PointSize = (2.5 + 5.*(1.-life)) * 30. / -mv.z; gl_Position = projectionMatrix * mv; }`,
  fragmentShader: `uniform sampler2D map; varying float vL; void main(){ vec4 c = texture2D(map, gl_PointCoord); vec3 col = mix(vec3(1.,.62,.18), vec3(.9,.16,.02), vL); gl_FragColor = vec4(col*1.15, c.a * (1.-vL) * .9); }`}));
scene.add(embers);
const smokeTex = canvasTex(256, 256, x => { for (let i = 0; i < 26; i++) { const px = 60 + Math.random() * 136, py = 60 + Math.random() * 136, r = 30 + Math.random() * 70, g = x.createRadialGradient(px, py, 0, px, py, r); g.addColorStop(0, 'rgba(255,255,255,.18)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, 256, 256); } });
const mistTex = canvasTex(512, 128, x => { for (let i = 0; i < 70; i++) { const px = Math.random() * 512, py = 30 + Math.random() * 70, r = 20 + Math.random() * 60, g = x.createRadialGradient(px, py, 0, px, py, r); g.addColorStop(0, 'rgba(255,255,255,.22)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, 512, 128); }
  const f = x.createLinearGradient(0, 0, 0, 128); f.addColorStop(0, 'rgba(0,0,0,1)'); f.addColorStop(.45, 'rgba(0,0,0,0)'); f.addColorStop(.6, 'rgba(0,0,0,0)'); f.addColorStop(1, 'rgba(0,0,0,1)'); x.globalCompositeOperation = 'destination-out'; x.fillStyle = f; x.fillRect(0, 0, 512, 128); });
mistTex.wrapS = T.RepeatWrapping; const mists: T.Mesh[] = [];
for (let i = 0; i < 4; i++) { const t2 = mistTex.clone(); t2.needsUpdate = true; t2.wrapS = T.RepeatWrapping; t2.repeat.set(2, 1); const m = new T.Mesh(new T.PlaneGeometry(60, 3.2), new T.MeshBasicMaterial({map: t2, color: i % 2 ? '#ff6a20' : '#ff9a40', transparent: true, opacity: .32 - i * .05, blending: T.AdditiveBlending, depthWrite: false, fog: false}));
  m.position.set(0, LAVA_Y + .9 + i * .55, 5 - i * 3.5); m.userData.v = (i % 2 ? -1 : 1) * (.006 + i * .003); scene.add(m); mists.push(m); }
const smoke: T.Sprite[] = [];
for (let i = 0; i < 22; i++) { const s = new T.Sprite(new T.SpriteMaterial({map: smokeTex, color: i % 3 ? '#7a2a14' : '#3a2420', transparent: true, opacity: .5, depthWrite: false})); s.position.set((Math.random() - .5) * 36, LAVA_Y + .6 + Math.random() * 2.5, -2 + Math.random() * 9); s.scale.setScalar(5 + Math.random() * 6); s.userData.v = (Math.random() - .5) * .25; scene.add(s); smoke.push(s); }

// ------------------------------------------------------------------ the cage
// forged chain steel: brighter and glossier than the cage so it reads against the dark hall
const chainMat = new T.MeshStandardMaterial({color: '#b8a898', metalness: .95, roughness: .32, envMapIntensity: 2.2, map: tex(TEX + 'rusty_metal_05_diff_1k.jpg', true, .5), emissive: '#3a1608', emissiveIntensity: .35});
const metal = rusty(1.5, '#8a7a70', .9, .5), metalDark = rusty(1.5, '#4a4038', .9, .6), brass = new T.MeshStandardMaterial({color: '#b08a4a', metalness: .95, roughness: .35});
const grateTex = canvasTex(256, 256, x => { x.fillStyle = '#000'; x.fillRect(0, 0, 256, 256); x.strokeStyle = '#fff'; x.lineWidth = 7; for (let i = -256; i < 512; i += 26) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i + 256, 256); x.stroke(); x.beginPath(); x.moveTo(i + 256, 0); x.lineTo(i, 256); x.stroke(); } });
const hazard = canvasTex(1024, 64, x => { x.fillStyle = '#d9a514'; x.fillRect(0, 0, 1024, 64); x.fillStyle = '#16100a'; for (let i = -64; i < 1024; i += 64) { x.beginPath(); x.moveTo(i, 64); x.lineTo(i + 32, 64); x.lineTo(i + 96, 0); x.lineTo(i + 64, 0); x.fill(); } x.fillStyle = 'rgba(40,20,5,.35)'; for (let k = 0; k < 900; k++) x.fillRect(Math.random() * 1024, Math.random() * 64, 2 + Math.random() * 6, 1 + Math.random() * 2); });
hazard.wrapS = T.RepeatWrapping; hazard.repeat.set(3, 1);
const R = .82, CAGE_H = 2.1;
const ANCHOR_Y = 15, LINK = .2, MAX_LINKS = 130; // the chains hang from the ceiling, far above the frame
const barGeo = new T.CylinderGeometry(.02, .024, CAGE_H - .2, 8), linkGeo = new T.TorusGeometry(.075, .028, 10, 18); linkGeo.scale(1, 1.7, 1);

interface Cage { id: string; root: T.Group; hang: T.Group; chain: T.InstancedMesh; wx: number; wy: number; body: T.Group; lamp: T.MeshStandardMaterial; lampGlow: T.Sprite; under: T.Sprite; portrait: T.Mesh; label: HTMLElement; bars: T.MeshStandardMaterial; flames: T.Sprite[];
  y: number; vy: number; targetY: number; x: number; tx: number; sway: number; swayV: number; flash: number; dead: boolean; penalties: number; repairs: number; okFlash: number; seen: boolean; bombSeen: string; blown: boolean; spin: number; tilt: number; cutY: number; splashed: boolean; burnT: number; survived: boolean; hop: number; squash: number; ph: number }
const cages = new Map<string, Cage>();
// The prisoner: a cut-out figure made to read as a lit 3D body.
//  · cropped to its own silhouette and stood on the cage floor at full height (feet at the pivot)
//  · pseudo-normals from the alpha gradient: warm lava rim from below, cold moon rim from above, soft occlusion inward
//  · burns away from the feet up: noisy threshold, white-hot rim, charred band
function burnMaterial(map: T.Texture) { return new T.ShaderMaterial({transparent: true, depthWrite: true, uniforms: {map: {value: map}, uvr: {value: new T.Vector4(0, 0, 1, 1)}, texel: {value: new T.Vector2(1 / 512, 1 / 512)},
    burn: {value: 0}, heat: {value: 0}, t: {value: 0}, fear: {value: 0}, flash: {value: 0}},
  vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }`,
  fragmentShader: `uniform sampler2D map; uniform vec4 uvr; uniform vec2 texel; uniform float burn, heat, t, fear, flash; varying vec2 vUv;
    float h(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
    float n(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f); return mix(mix(h(i),h(i+vec2(1,0)),f.x), mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x), f.y); }
    float A(vec2 u){ return texture2D(map, u).a; }
    void main(){ vec2 tu = uvr.xy + vUv * uvr.zw; vec4 c = texture2D(map, tu); if (c.a < .05) discard;
      // silhouette normal: blur-ish alpha gradient at two radii
      vec2 d1 = texel * 4., d2 = texel * 11.;
      vec2 g = vec2(A(tu + vec2(d1.x,0.)) - A(tu - vec2(d1.x,0.)), A(tu + vec2(0.,d1.y)) - A(tu - vec2(0.,d1.y)))
             + .6 * vec2(A(tu + vec2(d2.x,0.)) - A(tu - vec2(d2.x,0.)), A(tu + vec2(0.,d2.y)) - A(tu - vec2(0.,d2.y)));
      float edge = clamp(length(g) * .7, 0., 1.) * .8; vec2 nrm = length(g) > .001 ? -normalize(g) : vec2(0.);
      float inner = (A(tu + vec2(d2.x*2.,0.)) + A(tu - vec2(d2.x*2.,0.)) + A(tu + vec2(0.,d2.y*2.)) + A(tu - vec2(0.,d2.y*2.))) * .25;   // 1 deep inside, lower near the outline
      vec3 col = c.rgb * (.55 + .3*vUv.y);                                                          // key: dimmer toward the top, away from the lava
      col *= .78 + .22 * inner;                                                                     // soft volume: edges roll off
      col += c.rgb * vec3(1.,.45,.15) * pow(1.-vUv.y, 2.) * .6;                                    // lava bounce from below
      col += vec3(1.,.42,.12) * edge * max(0., dot(nrm, vec2(0.,-1.)) * .8 + .35) * (.55 + .45*(1.-vUv.y)) * .55;   // warm rim (sides and underside)
      col += vec3(.55,.65,1.) * edge * max(0., dot(nrm, vec2(0.,1.))) * .28 * vUv.y;              // cold moon rim on top
      col *= 1. - heat*.3; col += vec3(1.,.35,.08) * heat * .25; col = mix(col, col * vec3(1.35,.55,.45), flash * .45);   // red alarm strobe tints, never floods
      // burning
      float nz = n(vUv*9. + vec2(0., t*.6))*.6 + n(vUv*23.)*.4, e = vUv.y*.75 + nz*.35, th = burn * 1.25 - .05; if (e < th) discard;
      float rim = 1. - smoothstep(0., .06, e - th), ch = 1. - smoothstep(0., .2, e - th);
      col = mix(col, vec3(.08,.04,.03), ch * step(.001, burn)); col += vec3(1.,.55,.15) * rim * 3.2 * step(.001, burn);
      gl_FragColor = vec4(col, c.a); }`}); }
interface Figure { tex: T.Texture; ready: boolean; uvr: T.Vector4; aspect: number; texel: T.Vector2; waiters: (() => void)[] }
const figures = new Map<string, Figure>();
/** loads a character, finds its silhouette bounds (so it can stand full-height on the floor) */
const figure = (id: string): Figure => { const k = CHARS.includes(id) ? id : CHARS[Math.abs([...id].reduce((a, c) => a * 31 + c.charCodeAt(0), 7)) % CHARS.length];
  let f = figures.get(k); if (f) return f;
  const tex = new T.Texture(); tex.colorSpace = T.SRGBColorSpace; tex.anisotropy = 16; f = {tex, ready: false, uvr: new T.Vector4(0, 0, 1, 1), aspect: 1, texel: new T.Vector2(1 / 512, 1 / 512), waiters: []}; figures.set(k, f);
  const img = new Image(); img.onload = () => { const w = img.naturalWidth, h = img.naturalHeight, cv = document.createElement('canvas'); cv.width = w; cv.height = h; const x = cv.getContext('2d', {willReadFrequently: true})!; x.drawImage(img, 0, 0);
    const a = x.getImageData(0, 0, w, h).data; let x0 = w, y0 = h, x1 = 0, y1 = 0; for (let y = 0; y < h; y += 2) for (let xx = 0; xx < w; xx += 2) if (a[(y * w + xx) * 4 + 3] > 24) { if (xx < x0) x0 = xx; if (xx > x1) x1 = xx; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    const pad = 6; x0 = Math.max(0, x0 - pad); y0 = Math.max(0, y0 - pad); x1 = Math.min(w, x1 + pad); y1 = Math.min(h, y1 + pad);
    tex.image = img; tex.needsUpdate = true; f!.uvr.set(x0 / w, 1 - y1 / h, (x1 - x0) / w, (y1 - y0) / h); f!.aspect = (x1 - x0) / (y1 - y0); f!.texel.set(1 / w, 1 / h); f!.ready = true; for (const cb of f!.waiters) cb(); f!.waiters = []; };
  img.src = `chars/${k}.png`; return f; };

function buildCage(id: string, name: string, character: string): Cage {
  // pendulum: root = the ceiling anchor; hang = the cage below it on a chain of variable length; body = the cage itself
  const root = new T.Group(), hang = new T.Group(), body = new T.Group(); root.add(hang); hang.add(body);
  const add = (g: T.BufferGeometry, m: T.Material, y: number, rx = 0) => { const o = new T.Mesh(g, m); o.position.y = y; o.rotation.x = rx; body.add(o); return o; };
  // floor: heavy plate, rim, hazard band and the hot underglow
  add(new T.CylinderGeometry(R + .08, R + .02, .16, 28), metalDark, 0);
  add(new T.TorusGeometry(R + .06, .045, 8, 32), metal, .08, Math.PI / 2);
  const band = add(new T.CylinderGeometry(R + .03, R + .03, .26, 32, 1, true), new T.MeshStandardMaterial({map: hazard, metalness: .4, roughness: .6, side: T.DoubleSide}), .28);
  band.renderOrder = 1;
  add(new T.TorusGeometry(R + .04, .035, 8, 32), metal, .42, Math.PI / 2);
  for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2, b = new T.Mesh(new T.BoxGeometry(.14, .05, .06), new T.MeshStandardMaterial({color: '#ffa040', emissive: '#ff7a10', emissiveIntensity: 3})); b.position.set(Math.cos(a) * (R - .1), -.09, Math.sin(a) * (R - .1)); b.rotation.y = -a; body.add(b); }
  const under = new T.Sprite(new T.SpriteMaterial({map: glowTex, color: '#ff6a18', blending: T.AdditiveBlending, depthWrite: false, transparent: true, opacity: .6})); under.scale.set(2.6, 1.2, 1); under.position.y = -.25; body.add(under);
  // bars, mid ring, top ring
  const barMat = metal.clone(); barMat.emissive = new T.Color('#ff4a10'); barMat.emissiveIntensity = 0;
  const bars = new T.InstancedMesh(barGeo, barMat, 18), m4 = new T.Matrix4();
  for (let i = 0; i < 18; i++) { const a = i / 18 * Math.PI * 2; m4.makeTranslation(Math.cos(a) * R, CAGE_H / 2 + .05, Math.sin(a) * R); bars.setMatrixAt(i, m4); } body.add(bars);
  add(new T.TorusGeometry(R, .03, 8, 32), metal, 1.2, Math.PI / 2);
  for (let i = 0; i < 4; i++) { const a = i / 4 * Math.PI * 2 + Math.PI / 4, st = new T.Mesh(new T.BoxGeometry(.075, CAGE_H - .1, .02), metalDark); st.position.set(Math.cos(a) * (R + .015), CAGE_H / 2 + .05, Math.sin(a) * (R + .015)); st.rotation.y = -a + Math.PI / 2; body.add(st);
    for (let k = 0; k < 7; k++) { const rv = new T.Mesh(new T.SphereGeometry(.014, 8, 6), brass); rv.position.set(Math.cos(a) * (R + .03), .2 + k * .3, Math.sin(a) * (R + .03)); body.add(rv); } }
  const grate = new T.Mesh(new T.CircleGeometry(R - .02, 32), new T.MeshStandardMaterial({map: grateTex, alphaMap: grateTex, transparent: true, alphaTest: .4, metalness: .8, roughness: .6, color: '#5a4a40'})); grate.rotation.x = -Math.PI / 2; grate.position.y = .085; body.add(grate);
  add(new T.TorusGeometry(R + .02, .05, 8, 32), metal, CAGE_H, Math.PI / 2);
  // dome, collar, hook
  add(new T.CylinderGeometry(R * .55, R + .06, .42, 28), metalDark, CAGE_H + .2);
  add(new T.CylinderGeometry(R * .3, R * .5, .3, 20), metal, CAGE_H + .55);
  add(new T.CylinderGeometry(.12, .2, .32, 12), metalDark, CAGE_H + .85);
  for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2, rv = new T.Mesh(new T.SphereGeometry(.03, 8, 6), brass); rv.position.set(Math.cos(a) * (R + .03), CAGE_H + .04, Math.sin(a) * (R + .03)); body.add(rv); }
  // status lamp on the dome front
  const lamp = new T.MeshStandardMaterial({color: '#103010', emissive: '#30ff60', emissiveIntensity: 2.4});
  const lampBox = new T.Mesh(new T.BoxGeometry(.42, .13, .06), lamp); lampBox.position.set(0, CAGE_H + .24, R * .78); lampBox.rotation.x = -.35; body.add(lampBox);
  const frame = new T.Mesh(new T.BoxGeometry(.52, .2, .04), metalDark); frame.position.set(0, CAGE_H + .24, R * .76); frame.rotation.x = -.35; body.add(frame);
  const lampGlow = new T.Sprite(new T.SpriteMaterial({map: glowTex, color: '#40ff70', blending: T.AdditiveBlending, depthWrite: false, transparent: true, opacity: .8})); lampGlow.scale.set(1.1, .5, 1); lampGlow.position.set(0, CAGE_H + .26, R * .85); body.add(lampGlow);
  // the prisoner
  // the prisoner stands on the grate: pivot at the feet, full cage height, a soft shadow under the feet
  const fg = figure(character), pg = new T.PlaneGeometry(1, 1); pg.translate(0, .5, 0); const pmat = burnMaterial(fg.tex), pm = new T.Mesh(pg, pmat);
  const fit = () => { pmat.uniforms.uvr.value.copy(fg.uvr); pmat.uniforms.texel.value.copy(fg.texel); const H = 1.82, W = Math.min(1.45, H * fg.aspect); pm.scale.set(W, W / fg.aspect, 1); pm.userData.base = pm.scale.clone(); };
  if (fg.ready) fit(); else { pm.visible = false; fg.waiters.push(() => { fit(); pm.visible = true; }); }
  pm.position.set(0, .09, .05); body.add(pm);
  const foot = new T.Mesh(new T.CircleGeometry(.42, 24), new T.MeshBasicMaterial({map: glowTex, color: '#000000', transparent: true, opacity: .55, depthWrite: false})); foot.rotation.x = -Math.PI / 2; foot.scale.set(1, .55, 1); foot.position.set(0, .095, .05); body.add(foot);
  // shackle on the dome: a forged ring the last chain link passes through
  const shackle = new T.Mesh(new T.TorusGeometry(.1, .026, 10, 20), metal); shackle.position.y = CAGE_H + 1.1; body.add(shackle);
  const pin = new T.Mesh(new T.CylinderGeometry(.03, .03, .26, 10), brass); pin.rotation.z = Math.PI / 2; pin.position.y = CAGE_H + 1.02; body.add(pin);
  // chain from the shackle up to the anchor: links are laid out every frame for the current length
  const chain = new T.InstancedMesh(linkGeo, chainMat, MAX_LINKS); chain.count = 0; chain.castShadow = true; chain.frustumCulled = false; root.add(chain);
  root.traverse((o: any) => { if (o.isMesh && !(o.material as any).transparent) { o.castShadow = true; o.receiveShadow = true; } });
  scene.add(root);
  const label = document.createElement('div'); label.className = 'tag'; label.innerHTML = `<b></b><span class="m"></span><span class="s"></span><span class="bb"><i class="bt"></i><i class="bh"></i><i class="bm"></i></span>`; $('tags').append(label); label.querySelector('b')!.textContent = name;
  const flames: T.Sprite[] = []; for (let i = 0; i < 9; i++) { const f = new T.Sprite(new T.SpriteMaterial({map: flameTex, color: i % 3 ? '#ff7a20' : '#ffd070', blending: T.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0}));
    f.position.set((Math.random() - .5) * 1.1, .3, (Math.random() - .5) * .8); f.userData.ph = Math.random() * 6; body.add(f); flames.push(f); }
  return {id, root, hang, chain, wx: 0, wy: 0, body, lamp, lampGlow, under, portrait: pm, label, bars: barMat, flames, y: worldY(START_M) + 6, vy: 0, targetY: 1.2, x: 0, tx: 0, sway: (Math.random() - .5) * .04, swayV: 0, flash: 0, dead: false, penalties: 0, repairs: 0, okFlash: 0, seen: false, bombSeen: '', blown: false, spin: 0, tilt: 0, cutY: 0, splashed: false, burnT: -1, survived: false, hop: 0, squash: 0, ph: Math.random() * 6};
}

// world height for a height in metres: the visible shaft spans the top 500 m down to the lava
const Y_TOP = 1.5, Y_BOTTOM = LAVA_Y + .35;
const worldY = (m: number) => Y_BOTTOM + (Y_TOP - Y_BOTTOM) * Math.pow(m / START_M, .9);

// ------------------------------------------------------------------ sound (synthesised; starts after the first click)
let actx: AudioContext | null = null, master: GainNode;
function audioOn() { if (actx) return; actx = new AudioContext(); master = actx.createGain(); master.gain.value = .8; master.connect(actx.destination);
  const n = actx.createBuffer(1, actx.sampleRate * 3, actx.sampleRate), d = n.getChannelData(0); let b = 0; for (let i = 0; i < d.length; i++) { b = .98 * b + .02 * (Math.random() * 2 - 1); d[i] = b * 6; }
  const s = actx.createBufferSource(); s.buffer = n; s.loop = true; const f = actx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 160; const g = actx.createGain(); g.gain.value = .5; s.connect(f).connect(g).connect(master); s.start(); // lava rumble
  $('sound').classList.add('on'); }
function noise(dur: number, freq: number, q: number, gain: number, at = 0) { if (!actx) return; const t = actx.currentTime + at, s = actx.createBufferSource(), len = Math.ceil(actx.sampleRate * dur), buf = actx.createBuffer(1, len, actx.sampleRate), d = buf.getChannelData(0); for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  s.buffer = buf; const f = actx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = freq; f.Q.value = q; const g = actx.createGain(); g.gain.setValueAtTime(gain, t); g.gain.exponentialRampToValueAtTime(.001, t + dur); s.connect(f).connect(g).connect(master); s.start(t); }
function tone(f0: number, f1: number, dur: number, gain: number, type: OscillatorType = 'sawtooth', at = 0) { if (!actx) return; const t = actx.currentTime + at, o = actx.createOscillator(), g = actx.createGain(); o.type = type; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + dur); g.gain.setValueAtTime(gain, t); g.gain.exponentialRampToValueAtTime(.001, t + dur); o.connect(g).connect(master); o.start(t); o.stop(t + dur); }
const sfx = {drop() { tone(900, 120, .7, .12); noise(.8, 2400, 3, .5); noise(.35, 700, 1, .7, .55); tone(70, 35, .6, .5, 'sine', .55); for (let i = 0; i < 8; i++) noise(.06, 3000 + Math.random() * 2000, 4, .25, .1 + i * .07); },
  ok() { tone(523, 523, .5, .08, 'triangle'); tone(784, 784, .6, .07, 'triangle', .12); },
  blast() { noise(1.6, 1800, 6, 1); noise(2.4, 260, .4, 1, .05); tone(90, 25, 1.8, .8, 'sine'); for (let i = 0; i < 10; i++) noise(.08, 2500 + Math.random() * 3000, 4, .3, .15 + i * .09); },
  snap() { tone(1400, 300, .25, .35, 'square'); noise(.3, 4000, 6, .6); },
  splash() { noise(1.8, 500, .6, 1); noise(.5, 1500, 3, .7, .05); tone(80, 30, 1.5, .7, 'sine'); for (let i = 0; i < 12; i++) noise(.1, 800 + Math.random() * 1500, 2, .35, .2 + i * .12); },
  burn() { noise(2.5, 300, .5, .9); tone(120, 30, 2.5, .4, 'sine'); }};
$('sound').onclick = () => { audioOn(); actx?.resume(); };

// ------------------------------------------------------------------ data
interface CageCell { height: number; fails: number; repairs: number; outcome: string; dead: boolean; blown?: boolean }
interface P { id: string; name: string; characterId: string; online: boolean; kind: string; psi?: number; bomb?: string; bombEnd?: number; bombTries?: number; bombState?: string; cage?: CageCell }
interface Shift { phase: string; round: number; rounds: number; kind: string; kinds: string[]; phaseStart: number; phaseEnd: number; roundLimit: number; startM: number; difficulty: string }
let players: P[] = [], shift: Shift | null = null, diff = 'NORMAL', active = true, clockOffset = 0;
const serverNow = () => Date.now() + clockOffset;
const KIND = (): Record<string, [string, string]> => ({wire: ['⚡', L('Щиток', 'Wires')], pressure: ['◉', L('Клапаны', 'Valves')], formula: ['⚗', L('Лаборатория', 'Lab')], lock: ['🔒', L('Замок', 'Lock')], bomb: ['💣', L('Бомба', 'Bomb')]});

async function poll() {
  try { const r = await fetch(`/rooms/${encodeURIComponent(ROOM!)}/cage?token=${encodeURIComponent(TOKEN || '')}`, {cache: 'no-store'}); if (!r.ok) throw new Error(String(r.status)); const v = await r.json();
    clockOffset = v.now - Date.now(); players = v.players; shift = v.shift ?? null; diff = v.difficulty; active = v.active; if (shift) START_M = shift.startM;
    if ((v.language === 'en' || v.language === 'ru') && !params.get('lang') && v.language !== LANG) { LANG = v.language; texts(); } $('status').textContent = ''; }
  catch { $('status').textContent = L('Нет связи с комнатой…', 'Room connection lost…'); }
  setTimeout(poll, 250);
}
// demo shift: the same rules as the server's CageShift, played by six sample prisoners
let demoTimer: any = 0;
function demo() { clearInterval(demoTimer); /* a fresh shift: the previous one's ticker must stop */
  for (const c of cages.values()) { scene.remove(c.root); c.label.remove(); } cages.clear(); // a fresh shift: new cages
  const names = ['Skelly', 'Тыква', 'Доктор', 'Граф', 'Призрак', 'Вуду'], LIMIT = 24_000, INTRO = 4000, BREAK = 4000;
  players = names.map((n, i) => ({id: 'p' + i, name: n, characterId: CHARS[i], online: true, kind: '', cage: {height: 100, fails: 0, repairs: 0, outcome: 'RUNNING', dead: false}}));
  const kinds = ['wire', 'pressure', 'formula', 'lock'].sort(() => Math.random() - .5).slice(0, 2); kinds.splice(1 + Math.floor(Math.random() * 2), 0, 'bomb'); let t0 = Date.now(); const plan = new Map<string, {at: number; ok: boolean}>();
  shift = {phase: 'INTRO', round: -1, rounds: 3, kind: '', kinds, phaseStart: t0, phaseEnd: t0 + INTRO, roundLimit: LIMIT, startM: 100, difficulty: 'NORMAL'};
  const fail = (c: CageCell) => { c.outcome = 'FAIL'; c.fails++; if (shift?.kind === 'bomb') { c.blown = true; c.height = 0; c.dead = true; return; } c.height = c.fails === 1 ? c.height - 25 : c.fails === 2 ? Math.min(c.height - 25, 2) : 0; if (c.height <= 0) { c.height = 0; c.dead = true; } };
  let last = Date.now();
  demoTimer = setInterval(() => { const now = Date.now(), dt = now - last; last = now; const sh = shift!;
    if (sh.phase === 'ROUND') { for (const p of players) { const c = p.cage!; if (c.dead) continue; const pl = plan.get(p.id); if (!pl) continue;
        if (c.outcome !== 'OK' && now < sh.phaseStart + LIMIT) { c.height -= 15 / LIMIT * dt; if (c.height <= 0) { c.height = 0; c.dead = true; } }
        if (c.outcome === 'RUNNING' && now >= pl.at) { if (pl.ok) { c.outcome = 'OK'; c.repairs++; } else fail(c); if (sh.kind === 'bomb') p.bombState = pl.ok ? 'DEFUSED' : 'DETONATED'; }
        if (sh.kind === 'bomb' && c.outcome === 'RUNNING') { p.bombState = 'RUNNING'; p.bombEnd = sh.phaseStart + LIMIT; p.bomb = `${Math.min(2, Math.floor((now - sh.phaseStart) / 8000))}/3`; p.bombTries = Math.max(0, 2 - Math.floor((now - sh.phaseStart) / 9000)); } }
      if (now >= sh.phaseEnd || players.every(p => p.cage!.dead || p.cage!.outcome !== 'RUNNING')) { for (const p of players) { const c = p.cage!; if (!c.dead && c.outcome === 'RUNNING') fail(c); if (!c.dead && c.outcome === 'FAIL') { c.height -= 15 / LIMIT * Math.max(0, sh.phaseStart + LIMIT - now); if (c.height <= 0) { c.height = 0; c.dead = true; } } }
        Object.assign(sh, {phase: sh.round + 1 >= 3 ? 'END' : 'BREAK', phaseStart: now, phaseEnd: sh.round + 1 >= 3 ? -1 : now + BREAK}); } }
    else if (sh.phase !== 'END' && now >= sh.phaseEnd) { sh.round++; Object.assign(sh, {phase: 'ROUND', kind: kinds[sh.round], phaseStart: now, phaseEnd: now + LIMIT + 1500});
      for (const p of players) { p.kind = sh.kind; p.cage!.outcome = 'RUNNING'; p.bombState = undefined; p.bomb = undefined; plan.set(p.id, {at: now + 5000 + Math.random() * 20000, ok: Math.random() < .78}); } }
    else if (sh.phase === 'END' && now - sh.phaseStart > 15000) demo(); }, 50);
}

// ------------------------------------------------------------------ layout + animation
let shake = 0;
const fmt = (ms: number) => { const t = Math.max(0, Math.ceil(ms / 1000)); return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`; };
function sync() {
  const ids = new Set(players.map(p => p.id));
  for (const [id, c] of cages) if (!ids.has(id)) { scene.remove(c.root); c.label.remove(); cages.delete(id); }
  const n = players.length, gap = n <= 4 ? 3.4 : n <= 6 ? 2.75 : 2.3, sh = shift;
  players.forEach((p, i) => { let c = cages.get(p.id); if (!c) { c = buildCage(p.id, p.name, p.characterId); c.x = c.tx = (i - (n - 1) / 2) * gap; cages.set(p.id, c); }
    const cell = p.cage ?? {height: START_M, fails: 0, repairs: 0, outcome: 'RUNNING', dead: false};
    c.tx = (i - (n - 1) / 2) * gap; const m = cell.height; c.targetY = worldY(m);
    if (c.seen && cell.fails > c.penalties) { c.squash = -.6; /* thrown up as the floor drops away */ c.vy = -9 - cell.fails * 3; c.flash = 1.6; c.swayV += (Math.random() - .5) * .6; shake = Math.max(shake, .45 + cell.fails * .15); sfx.drop(); spark(c); }
    // the bomb: defused → a green-gold burst of light; blown → a fireball, the cage drops (the fail above) and the blast rocks every other cage
    if (c.seen && p.bombState && p.bombState !== c.bombSeen && p.bombState !== 'RUNNING') {
      if (p.bombState === 'DEFUSED') { c.okFlash = 1.6; c.hop = 1.2; spark(c, CAGE_H * .5, '#7dffb0', 90, 1.3); spark(c, CAGE_H * .5, '#ffd76a', 60, 1.1); sfx.ok(); setTimeout(() => sfx.ok(), 180); }
      else { c.flash = 2.4; shake = Math.max(shake, 1.2); spark(c, CAGE_H * .5, '#ff7a1a', 140, 2.2); spark(c, CAGE_H * .5, '#ffe2a0', 80, 1.6); sfx.blast();
        for (const o of cages.values()) if (o !== c && !o.dead) { const d = Math.max(1, Math.abs(o.x - c.x)); o.swayV += (o.x > c.x ? 1 : -1) * 1.4 / d + (Math.random() - .5) * .3; o.flash = Math.max(o.flash, .5 / d); } } }
    if (p.bombState) c.bombSeen = p.bombState; else c.bombSeen = '';
    if (c.seen && cell.repairs > c.repairs) { c.okFlash = 1; c.hop = 1; sfx.ok(); }
    // a blown bomb: the blast throws the cage up, the chain snaps (its stub keeps hanging), the cage tumbles into the lava
    if (cell.blown && !c.blown) { c.blown = true; c.cutY = c.hang.position.y; c.spin = (Math.random() < .5 ? -1 : 1) * (1.1 + Math.random() * .6);
      if (c.seen) { c.vy = 4.5; c.squash = -.5; c.flash = 2.6; sfx.snap(); } else { c.y = LAVA_Y - .95; c.splashed = true; c.tilt = c.spin * .3; } }
    if (!c.dead && cell.dead) { c.dead = true; }
    c.penalties = cell.fails; c.repairs = cell.repairs; c.seen = true; c.survived = !!sh && sh.phase === 'END' && !cell.dead; if (c.survived) c.targetY += .6;
    const [ic, kn] = KIND()[sh?.kind || p.kind] ?? ['…', L('Ожидание', 'Waiting')];
    const state = c.dead ? (c.blown ? L('💥 ВЗОРВАЛСЯ', '💥 BLOWN UP') : L('СГОРЕЛ', 'BURNED')) : c.survived ? L('ВЫЖИЛ', 'SURVIVED') : cell.outcome === 'OK' && sh?.phase === 'ROUND' ? (sh.kind === 'bomb' ? L('✓ обезвредил', '✓ defused') : L('✓ починил', '✓ repaired')) : cell.outcome === 'FAIL' && sh?.phase === 'ROUND' ? (sh.kind === 'bomb' ? L('💥 взорвался', '💥 blown up') : L('✗ сорвался', '✗ dropped')) : `${ic} ${kn}`;
    { // the bomb panel under the cage: fuse timer, tries left as hearts, mechanisms defused
      const live = !!p.bomb && sh?.kind === 'bomb' && cell.outcome === 'RUNNING' && p.bombState === 'RUNNING' && !c.dead, bb = c.label.querySelector('.bb') as HTMLElement; c.label.classList.toggle('bomb', live);
      if (live) { const left = (p.bombEnd ?? 0) - serverNow(), tries = p.bombTries ?? 0, [dn, all] = (p.bomb ?? '0/3').split('/').map(Number);
        (bb.querySelector('.bt') as HTMLElement).textContent = '⏱ ' + fmt(left); bb.classList.toggle('hot', left < 30_000);
        (bb.querySelector('.bh') as HTMLElement).textContent = '♥'.repeat(tries) + '♡'.repeat(Math.max(0, (({EASY: 3, NORMAL: 2, HARD: 1} as any)[diff] ?? 2) - tries));
        (bb.querySelector('.bm') as HTMLElement).textContent = '●'.repeat(dn) + '○'.repeat(Math.max(0, all - dn)); bb.title = L('обезврежено механизмов', 'mechanisms defused'); } }
    c.label.querySelector('.m')!.textContent = c.dead ? '☠' : `${m.toFixed(m < 10 ? 1 : 0)} ${L('м', 'm')}`;
    c.label.querySelector('.s')!.textContent = `${state}${p.psi != null && sh?.kind === 'pressure' && cell.outcome === 'RUNNING' ? ' · ' + p.psi + ' PSI' : ''}  ${'✗'.repeat(cell.fails)}${'·'.repeat(Math.max(0, 3 - cell.fails))}`;
    c.label.classList.toggle('dead', c.dead); c.label.classList.toggle('ok', cell.outcome === 'OK' && sh?.phase === 'ROUND' || c.survived); c.label.classList.toggle('bad', !c.dead && cell.fails >= 2);
    c.label.classList.toggle('off', !p.online && !DEMO); });
  // HUD: the cage closest to the lava, the phase clock, the round banner
  const alive = players.filter(p => !p.cage?.dead), low = alive.length ? Math.min(...alive.map(p => p.cage?.height ?? START_M)) : 0;
  $('depth').textContent = `${low.toFixed(low < 10 ? 1 : 0)} ${L('м', 'm')}`; $('depth-cap').textContent = L('БЛИЖЕ ВСЕХ К ЛАВЕ', 'CLOSEST TO THE LAVA');
  const now = serverNow(), left = sh && sh.phaseEnd > 0 ? sh.phaseEnd - now - (sh.phase === 'ROUND' ? 1500 : 0) : 0, span = sh?.phase === 'ROUND' ? sh.roundLimit : sh?.phase === 'INTRO' ? 9000 : 6000;
  $('clock').textContent = sh && sh.phase !== 'END' ? fmt(left) : '—'; ($('ring') as any).style.strokeDashoffset = String(176 * (1 - Math.max(0, Math.min(1, left / span))));
  $('clock-cap').textContent = sh?.phase === 'ROUND' ? L('ДО КОНЦА РАУНДА', 'ROUND ENDS IN') : sh?.phase === 'BREAK' ? L('СЛЕДУЮЩИЙ РАУНД', 'NEXT ROUND') : sh?.phase === 'INTRO' ? L('СТАРТ ЧЕРЕЗ', 'STARTS IN') : L('СМЕНА ОКОНЧЕНА', 'SHIFT OVER');
  document.body.classList.toggle('urgent', sh?.phase === 'ROUND' && left < 10_000 && left > 0);
  const kindName = (k: string) => KIND()[k]?.[1] ?? '';
  $('diff').textContent = !sh ? '' : sh.phase === 'ROUND' ? `${L('РАУНД', 'ROUND')} ${sh.round + 1} / ${sh.rounds} · ${kindName(sh.kind).toUpperCase()}` : sh.phase === 'BREAK' ? `${L('ДАЛЕЕ', 'NEXT')}: ${kindName(sh.kinds[sh.round + 1]).toUpperCase()}`
    : sh.phase === 'INTRO' ? `${diffLabel()} · ${L('3 РАУНДА', '3 ROUNDS')}` : `${L('ВЫЖИЛИ', 'SURVIVORS')}: ${alive.length} / ${players.length}`;
  $('idle').hidden = active || DEMO || players.length > 0;
}
const diffLabel = () => diff === 'EASY' ? L('ЛЁГКИЙ', 'EASY') : diff === 'HARD' ? L('СЛОЖНЫЙ', 'HARD') : L('СРЕДНИЙ', 'NORMAL');
// sparks when a brake lets go
const sparks: {p: T.Points; v: Float32Array; t: number}[] = [];
const tmpV = new T.Vector3(), linkM = new T.Matrix4(), linkQ = new T.Quaternion(), linkS = new T.Vector3(1, 1, 1), linkP = new T.Vector3(), Y_AXIS = new T.Vector3(0, 1, 0);
/** lay the links from the shackle up to the anchor; the lowest link threads the shackle, each next one is turned 90° */
function layChain(c: Cage) { const bottom = c.hang.position.y + CAGE_H + 1.2, n = Math.min(MAX_LINKS, Math.ceil(-bottom / LINK) + 1);
  for (let i = 0; i < n; i++) { linkQ.setFromAxisAngle(Y_AXIS, i % 2 ? Math.PI / 2 : 0); linkP.set(0, bottom + i * LINK, 0); linkM.compose(linkP, linkQ, linkS); c.chain.setMatrixAt(i, linkM); }
  c.chain.count = n; c.chain.instanceMatrix.needsUpdate = true; }
function spark(c: Cage, low = 0, color = '#ffc060', n = 60, power = 1) { const pos = new Float32Array(n * 3), v = new Float32Array(n * 3); for (let i = 0; i < n; i++) { pos[i * 3] = c.wx + (Math.random() - .5) * .3; pos[i * 3 + 1] = low ? c.wy + low : c.wy + CAGE_H + 1; pos[i * 3 + 2] = (Math.random() - .5) * .3; v[i * 3] = (Math.random() - .5) * 5 * power; v[i * 3 + 1] = Math.random() * 4 * power; v[i * 3 + 2] = (Math.random() - .5) * 4 * power; }
  const g = new T.BufferGeometry(); g.setAttribute('position', new T.BufferAttribute(pos, 3)); const p = new T.Points(g, new T.PointsMaterial({map: glowTex, color, size: .14, transparent: true, blending: T.AdditiveBlending, depthWrite: false})); scene.add(p); sparks.push({p, v, t: 0}); }

function resize() { const w = innerWidth, h = innerHeight; renderer.setPixelRatio(DPR); composer.setPixelRatio(DPR); renderer.setSize(w, h); composer.setSize(w, h); bloom.setSize(w * DPR / 2, h * DPR / 2); camera.aspect = w / h; camera.updateProjectionMatrix(); }
addEventListener('resize', resize); resize();
const proj = new T.Vector3(); let last = performance.now(), time = 0, syncT = 0;
function loop(now: number) {
  const dt = Math.min(.05, (now - last) / 1000); last = now; time += dt; syncT -= dt; if (syncT <= 0) { syncT = .1; sync(); }
  // camera: wide on all cages, slow breathing drift
  const n = Math.max(1, cages.size), span = Math.max(9, n * (n <= 4 ? 3.4 : n <= 6 ? 2.75 : 2.3) + 2.5), dist = span / 2 / Math.tan(T.MathUtils.degToRad(camera.fov / 2)) / camera.aspect + 2;
  camera.position.set(Math.sin(time * .11) * .5, .2 + Math.sin(time * .07) * .15, Math.max(12, dist)); camera.lookAt(0, .5, 0);
  if (shake > .002) { camera.position.x += (Math.random() - .5) * shake * .25; camera.position.y += (Math.random() - .5) * shake * .25; shake *= Math.exp(-dt * 3.5); }
  for (const c of cages.values()) {
    c.x += (c.tx - c.x) * (1 - Math.exp(-dt * 3));
    // vertical: falls hard toward a lower target (gravity, then a bouncing catch), eases gently otherwise
    if (c.dead) c.targetY = LAVA_Y - .95;;
    // death: the cage settles into the lava, ~1.5 s later the prisoner catches fire and burns away, the bars glow red-hot
    if (c.dead && c.y < LAVA_Y + .2 && c.burnT < 0) { c.burnT = 0; }
    if (c.burnT >= 0) { const prev = c.burnT; c.burnT += dt; const b = Math.max(0, Math.min(1, (c.burnT - 1.4) / 2.4)), mat = c.portrait.material as T.ShaderMaterial;
      if (prev < 1.4 && c.burnT >= 1.4) { sfx.burn(); shake = Math.max(shake, .35); for (let k = 0; k < 3; k++) spark(c, .6); }
      mat.uniforms.heat.value = Math.min(1, c.burnT / 1.4); mat.uniforms.burn.value = b; mat.uniforms.t.value = time;
      c.bars.emissiveIntensity = Math.min(2.2, c.burnT * .9) * (.85 + Math.sin(time * 9 + c.x) * .15);
      const fl = c.burnT < 1.2 ? 0 : c.burnT < 2 ? (c.burnT - 1.2) / .8 : c.burnT < 4.6 ? 1 : Math.max(0, 1 - (c.burnT - 4.6) / 2.5);
      for (const f of c.flames) { const ph = f.userData.ph; (f.material as T.SpriteMaterial).opacity = fl * (.65 + Math.sin(time * 11 + ph) * .25); f.scale.set(.5 + fl * .35, (.9 + Math.sin(time * 8 + ph) * .25) * (.5 + fl), 1); f.position.y = .25 + fl * .4 + Math.sin(time * 6 + ph) * .05; } }
    if (c.blown) { // free fall, no catch: straight through the lava surface, then a slow sink
      if (c.y > LAVA_Y - .95) { c.vy -= 20 * dt; c.y += c.vy * dt; c.tilt += c.spin * dt * (c.splashed ? .15 : 1); } else { c.y = LAVA_Y - .95; c.vy = 0; }
      c.tilt = Math.max(-.55, Math.min(.55, c.tilt));
      if (!c.splashed && c.y < LAVA_Y + .3) { c.splashed = true; c.vy *= .25; c.spin *= .3; shake = Math.max(shake, .9); sfx.splash(); spark(c, LAVA_Y + .25 - c.wy, '#ff6a10', 170, 2.6); spark(c, LAVA_Y + .25 - c.wy, '#ffd27a', 90, 1.8); spark(c, LAVA_Y + .25 - c.wy, '#5a1a08', 60, 1.2); } }
    else if (c.y > c.targetY + .02) { if (c.vy < -.5) c.vy -= 22 * dt; else c.vy += ((c.targetY - c.y) * 2 - c.vy * 2) * dt; } else c.vy += ((c.targetY - c.y) * 60 - c.vy * 7) * dt;
    if (!c.blown) c.y += c.vy * dt; if (!c.blown && c.y < c.targetY && c.vy < -1) { c.squash = Math.min(1, -c.vy / 10); c.vy = -c.vy * .28; c.swayV += (Math.random() - .5) * .35; shake = Math.max(shake, .3); }
    c.swayV += (-c.sway * 3 - c.swayV * .6) * dt + Math.sin(time * .9 + c.x) * .002; c.sway += c.swayV * dt;
    // the cage swings as a pendulum from its ceiling anchor; chain and cage move as one rigid piece
    c.root.position.set(c.x, ANCHOR_Y, 0); c.root.rotation.z = c.sway * .1; c.hang.position.y = c.y - ANCHOR_Y; c.body.rotation.y = Math.sin(time * .3 + c.x) * .08; c.hang.rotation.z = c.tilt;
    if (c.blown) { const y = c.hang.position.y; c.hang.position.y = c.cutY; layChain(c); c.hang.position.y = y; } else layChain(c);
    { const wp = c.body.getWorldPosition(tmpV); c.wx = wp.x; c.wy = wp.y; }
    { // the prisoner: breathes, shifts weight, trembles near the lava, is thrown and squashed by a drop, hops on a repair, writhes while burning
      const fig = c.portrait, base = fig.userData.base as T.Vector3 | undefined, mat = fig.material as T.ShaderMaterial;
      if (base) { const near = (c.y - Y_BOTTOM) / (Y_TOP - Y_BOTTOM), fear = c.dead ? 0 : Math.min(1, (c.penalties >= 2 ? .8 : c.penalties * .25) + Math.max(0, .3 - near) * 2.5);
        const heatK = mat.uniforms.heat.value as number, breath = Math.sin(time * (2 + fear * 3) + c.ph);
        c.squash += (0 - c.squash) * (1 - Math.exp(-dt * 7)); c.hop = Math.max(0, c.hop - dt * 1.6);
        const hopY = c.hop > 0 ? Math.sin((1 - c.hop) * Math.PI) * .28 : 0, sq = c.squash;
        fig.scale.set(base.x * (1 + .1 * sq - .006 * breath), base.y * (1 - .14 * sq + .012 * breath + (c.hop > .85 ? -.06 : 0)), 1);
        fig.position.y = .09 + hopY + (sq < 0 ? -sq * .35 : 0);
        const tremble = fear * (Math.sin(time * 37 + c.ph) * .012 + Math.sin(time * 23) * .008), writhe = heatK > 0 ? Math.sin(time * 13 + c.ph) * .09 * heatK : 0;
        fig.rotation.z = Math.sin(time * .8 + c.ph) * .03 + tremble + writhe - c.sway * .06; fig.rotation.y = -c.body.rotation.y * .8;
        fig.position.x = Math.sin(time * .5 + c.ph) * .03 + tremble * 2;
        mat.uniforms.fear.value = fear; mat.uniforms.flash.value = c.flash > 0 ? ((time * 8 | 0) % 2) : 0; } }
    // lamp: green when steady, amber when deep, red strobe after a drop, green pulse on a repair
    const m = (c.y - Y_BOTTOM) / (Y_TOP - Y_BOTTOM); c.flash = Math.max(0, c.flash - dt * .5); c.okFlash = Math.max(0, c.okFlash - dt * 1.2);
    const col = c.dead ? '#000000' : c.flash > 0 ? ((time * 8 | 0) % 2 ? '#ff1a10' : '#400000') : c.penalties >= 2 ? ((time * 3 | 0) % 2 ? '#ff2a10' : '#801000') : m < .25 ? '#ffa020' : '#30ff60';
    c.lamp.emissive.set(col); c.lamp.emissiveIntensity = 2.4 + c.okFlash * 4; (c.lampGlow.material as T.SpriteMaterial).color.set(col);
    (c.under.material as T.SpriteMaterial).opacity = .35 + (1 - m) * .6 + Math.sin(time * 6 + c.x) * .05;
    // the name plate follows the cage on screen
    proj.set(c.wx, c.wy - .25, R).project(camera); c.label.style.transform = `translate(-50%,0) translate(${(proj.x * .5 + .5) * innerWidth}px,${Math.min(innerHeight - (c.label.dataset.h ? +c.label.dataset.h : +(c.label.dataset.h = String(c.label.offsetHeight))) - 14, (-proj.y * .5 + .5) * innerHeight)}px)`;
  }
  // embers, smoke, lava, lanterns, sparks
  for (let i = 0; i < EMBERS; i++) { el[i] += dt * (.12 + (i % 7) * .02); ep[i * 3] += (ev[i * 3] + Math.sin(time + i) * .3) * dt; ep[i * 3 + 1] += ev[i * 3 + 1] * dt; ep[i * 3 + 2] += ev[i * 3 + 2] * dt; if (el[i] >= 1) resetEmber(i); }
  emberGeo.attributes.position.needsUpdate = true; (emberGeo.attributes.life as T.BufferAttribute).needsUpdate = true;
  for (const s of smoke) { s.position.x += s.userData.v * dt; if (Math.abs(s.position.x) > 20) s.userData.v *= -1; s.material.rotation += dt * .03; }
  lavaMat.uniforms.t.value = time; lavaLight.intensity = 300 + Math.sin(time * 1.7) * 30 + Math.sin(time * 4.3) * 15;
  for (const [k, l] of lanterns.entries()) { const f = .85 + Math.sin(time * 13 + k) * .08 + Math.random() * .07; l.light.intensity = 30 * f; l.flame.scale.setScalar(1.5 * f); }
  for (let k = sparks.length - 1; k >= 0; k--) { const s = sparks[k], a = s.p.geometry.attributes.position as T.BufferAttribute; s.t += dt; for (let i = 0; i < a.count; i++) { s.v[i * 3 + 1] -= 9 * dt; a.array[i * 3] += s.v[i * 3] * dt; a.array[i * 3 + 1] += s.v[i * 3 + 1] * dt; a.array[i * 3 + 2] += s.v[i * 3 + 2] * dt; } a.needsUpdate = true;
    (s.p.material as T.PointsMaterial).opacity = Math.max(0, 1 - s.t / 1.2); if (s.t > 1.2) { scene.remove(s.p); s.p.geometry.dispose(); sparks.splice(k, 1); } }
  bloom.strength = .55 + shake * .5; finish.uniforms.t.value = time; finish.uniforms.shake.value = shake; for (const m of mists) (m.material as T.MeshBasicMaterial).map!.offset.x += m.userData.v * dt;
  if ((frameNo++ & 1) === 0) renderer.shadowMap.needsUpdate = true;
  perf(dt); composer.render(); requestAnimationFrame(loop);
}
// adaptive resolution: drop the render scale while frames run long, recover when there is headroom
let frameNo = 0, slow = 0, fast = 0;
function perf(dt: number) { if (dt > 1 / 40) { slow++; fast = 0; } else if (dt < 1 / 58) { fast++; slow = 0; }
  if (slow > 30 && DPR > .7) { DPR = Math.max(.7, DPR - .15); slow = 0; resize(); } else if (fast > 240 && DPR < Math.min(devicePixelRatio, 1.25)) { DPR = Math.min(Math.min(devicePixelRatio, 1.25), DPR + .1); fast = 0; resize(); } }
function texts() { document.title = L('Адская клетка · ведущий', 'The Hell Cage · host'); document.documentElement.lang = LANG;
  $('title').textContent = L('АДСКАЯ КЛЕТКА', 'THE HELL CAGE'); $('depth-cap').textContent = L('ГЛУБЖЕ ВСЕХ', 'DEEPEST'); $('clock-cap').textContent = L('СМЕНА', 'SHIFT'); $('idle').textContent = L('Ждём игроков…', 'Waiting for players…'); }
texts();
if (DEMO) demo(); else poll();
requestAnimationFrame(loop);
(window as any).__host = {get cages() { return cages; }, get players() { return players; }, scene, renderer};
