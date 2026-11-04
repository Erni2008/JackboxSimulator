// Stand-in cage for THE BROKEN ELEVATOR until the real elevator scene exists:
// riveted steel floor, bar walls open to the shaft, a caged incandescent lamp
// and the lava glow far below. Only here to light and test the manual.
import * as T from 'three';
import {HDRLoader} from 'three/addons/loaders/HDRLoader.js';
import {TEX} from './materials';
import type {Plane} from './physics';

export const CAGE = 1.6; // interior width/depth in metres

export async function buildCage(renderer: T.WebGLRenderer, scene: T.Scene, hi: boolean) {
  const aniso = renderer.capabilities.getMaxAnisotropy(), loader = new T.TextureLoader();
  const load = (f: string, srgb: boolean, rep: number) => new Promise<T.Texture>((ok, bad) => loader.load(TEX + f, t => { t.colorSpace = srgb ? T.SRGBColorSpace : T.NoColorSpace; t.wrapS = t.wrapT = T.RepeatWrapping; t.repeat.set(rep, rep); t.anisotropy = aniso; ok(t); }, undefined, bad));
  const [diff, nor, rough, hdr] = await Promise.all([load('rusty_metal_05_diff_1k.jpg', true, 2), load('rusty_metal_05_nor_gl_1k.jpg', false, 2), load('rusty_metal_05_rough_1k.jpg', false, 2), new HDRLoader().loadAsync(TEX + 'boiler_room_1k.hdr')]);
  const pmrem = new T.PMREMGenerator(renderer); hdr.mapping = T.EquirectangularReflectionMapping; const env = pmrem.fromEquirectangular(hdr).texture; hdr.dispose(); pmrem.dispose();
  scene.environment = env; scene.environmentIntensity = .32; scene.background = new T.Color('#050403'); scene.fog = new T.FogExp2('#0a0603', .16);
  const steel = new T.MeshStandardMaterial({map: diff, normalMap: nor, roughnessMap: rough, metalness: .65, roughness: 1, color: '#9a8f86', envMapIntensity: .9});
  const floor = new T.Mesh(new T.PlaneGeometry(CAGE, CAGE), steel); floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);
  // floor rivet rows and seams
  const rivetGeo = new T.SphereGeometry(.007, 10, 5, 0, Math.PI * 2, 0, Math.PI / 2), rivetMat = new T.MeshStandardMaterial({color: '#4a4038', metalness: .8, roughness: .55});
  const rivets: T.Vector3[] = []; for (const a of [-CAGE / 2 + .04, 0, CAGE / 2 - .04]) for (let b = -CAGE / 2 + .06; b < CAGE / 2; b += .09) { rivets.push(new T.Vector3(a, 0, b), new T.Vector3(b, 0, a)); }
  const ri = new T.InstancedMesh(rivetGeo, rivetMat, rivets.length); rivets.forEach((p, i) => ri.setMatrixAt(i, new T.Matrix4().makeTranslation(p.x, 0, p.z))); ri.receiveShadow = true; scene.add(ri);
  const seam = new T.MeshStandardMaterial({color: '#120d0a', roughness: .9}); for (const r of [0, Math.PI / 2]) { const s = new T.Mesh(new T.PlaneGeometry(.006, CAGE), seam); s.rotation.set(-Math.PI / 2, 0, r); s.position.y = .0006; scene.add(s); }
  // back wall: riveted plate. Side/front walls: vertical bars open to the shaft
  const wallMat = steel.clone(); wallMat.color = new T.Color('#5a4c42'); wallMat.map = diff.clone(); wallMat.map.repeat.set(2, 3); wallMat.map.needsUpdate = true;
  const back = new T.Mesh(new T.PlaneGeometry(CAGE, 2.4), wallMat); back.position.set(0, 1.2, -CAGE / 2); back.receiveShadow = true; scene.add(back);
  const barGeo = new T.CylinderGeometry(.011, .011, 2.4, 10), barMat = new T.MeshStandardMaterial({color: '#2b2420', metalness: .85, roughness: .45, envMapIntensity: 1.2});
  const bars: T.Matrix4[] = []; for (let i = 0; i <= 16; i++) { const t = -CAGE / 2 + i * CAGE / 16; bars.push(new T.Matrix4().makeTranslation(-CAGE / 2, 1.2, t), new T.Matrix4().makeTranslation(CAGE / 2, 1.2, t)); }
  const barMesh = new T.InstancedMesh(barGeo, barMat, bars.length); bars.forEach((m, i) => barMesh.setMatrixAt(i, m)); barMesh.castShadow = true; scene.add(barMesh);
  const rail = new T.Mesh(new T.BoxGeometry(CAGE, .05, .03), barMat); for (const [x, y, z, ry] of [[-CAGE / 2, .08, 0, Math.PI / 2], [CAGE / 2, .08, 0, Math.PI / 2], [-CAGE / 2, 1.05, 0, Math.PI / 2], [CAGE / 2, 1.05, 0, Math.PI / 2]]) { const r = rail.clone(); r.position.set(x, y, z); r.rotation.y = ry; r.castShadow = true; scene.add(r); }
  // the shaft: lava far below lights everything from underneath with an unsteady orange
  const lavaMat = new T.ShaderMaterial({uniforms: {time: {value: 0}}, fog: false, vertexShader: 'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader: 'uniform float time;varying vec2 vUv;float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5);}float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}void main(){vec2 p=vUv*9.;float v=n(p+time*.05)*.6+n(p*2.3-time*.08)*.3+n(p*5.-time*.1)*.1;v=pow(v,2.2);vec3 c=mix(vec3(.08,.01,.0),vec3(1.,.32,.04),v)+vec3(1.,.7,.3)*pow(v,6.)*1.5;gl_FragColor=vec4(c*.75,1.);}'});
  const lava = new T.Mesh(new T.PlaneGeometry(14, 14), lavaMat); lava.rotation.x = -Math.PI / 2; lava.position.y = -6; scene.add(lava);
  const lavaLights: T.PointLight[] = []; for (const [x, z] of [[-1.4, .2], [1.4, -.3]]) { const l = new T.PointLight('#ff5a14', 3.2, 6, 1.6); l.position.set(x, -.4, z); scene.add(l); lavaLights.push(l); }
  // caged lamp
  const lamp = new T.SpotLight('#ffbf73', 9, 4.5, .62, .55, 1.7); lamp.position.set(.18, 2.3, .1); lamp.target.position.set(0, 0, -.1); lamp.castShadow = true;
  lamp.shadow.mapSize.set(hi ? 2048 : 1024, hi ? 2048 : 1024); lamp.shadow.bias = -.00012; lamp.shadow.normalBias = .0012; lamp.shadow.radius = 3; lamp.shadow.camera.near = .4; lamp.shadow.camera.far = 3.2; lamp.shadow.focus = .9;
  scene.add(lamp, lamp.target);
  const bulb = new T.Mesh(new T.SphereGeometry(.035, 16, 12), new T.MeshBasicMaterial({color: '#ffd9a0'})); bulb.position.copy(lamp.position); scene.add(bulb);
  const cage = new T.Mesh(new T.CylinderGeometry(.06, .07, .11, 10, 1, true), new T.MeshStandardMaterial({color: '#1b1612', metalness: .8, roughness: .5, wireframe: true})); cage.position.copy(lamp.position); scene.add(cage);
  const fill = new T.HemisphereLight('#6d5a48', '#2a0d04', .25); scene.add(fill);
  const planes: Plane[] = [
    {n: new T.Vector3(0, 1, 0), d: 0, restitution: .18, friction: .55, material: 'metal'},
    {n: new T.Vector3(1, 0, 0), d: -CAGE / 2 + .012, restitution: .25, friction: .4, material: 'metal'}, {n: new T.Vector3(-1, 0, 0), d: -CAGE / 2 + .012, restitution: .25, friction: .4, material: 'metal'},
    {n: new T.Vector3(0, 0, 1), d: -CAGE / 2, restitution: .25, friction: .4, material: 'metal'}, {n: new T.Vector3(0, 0, -1), d: -CAGE / 2, restitution: .25, friction: .4, material: 'metal'},
  ];
  let t = 0;
  return {planes, lamp, update(dt: number) { t += dt; lavaMat.uniforms.time.value = t; lavaLights.forEach((l, i) => { l.intensity = 3 + Math.sin(t * 1.3 + i * 2) * .6 + Math.sin(t * 4.7 + i) * .25; }); const flick = Math.random() < .004 ? .35 : 1; lamp.intensity = 9 * (.96 + Math.sin(t * 50) * .01) * flick; }};
}

/** Soft contact shadow under the book (ambient occlusion where it touches the floor). */
export function contactShadow() {
  const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d')!, g = x.createRadialGradient(64, 64, 8, 64, 64, 64); g.addColorStop(0, 'rgba(0,0,0,.85)'); g.addColorStop(.55, 'rgba(0,0,0,.4)'); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.fillRect(0, 0, 128, 128);
  const m = new T.Mesh(new T.PlaneGeometry(.3, .37), new T.MeshBasicMaterial({map: new T.CanvasTexture(c), transparent: true, depthWrite: false, opacity: .7})); m.rotation.x = -Math.PI / 2; m.position.y = .0012; m.renderOrder = 1; return m;
}
