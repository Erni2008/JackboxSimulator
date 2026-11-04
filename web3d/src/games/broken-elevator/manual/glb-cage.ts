// THE BROKEN ELEVATOR cage from the supplied cage.glb (geometry untouched).
// The asset ships with roughness ≈ 0.19 everywhere and KHR_materials_specular ×2,
// which is what made it look wet/chromed. Here the material response is rebuilt
// from its own base colour: rust becomes rough and dielectric, bare iron stays
// metallic but matte, with two scales of procedural variation in the asset's UVs.
import * as T from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {HDRLoader} from 'three/addons/loaders/HDRLoader.js';
import {TEX} from './materials';
import {rng} from './page-art';
import type {Plane} from './physics';
import {createLava} from './lava';

/** Interior height the model is scaled to (asset units are arbitrary: ~0.8 tall). */
export const CAGE_HEIGHT = 3.6;

export interface CageInfo {
  root: T.Object3D; mesh: T.Mesh; planes: Plane[]; floorY: number; ceilingY: number;
  inner: T.Box3; /** where the player's eyes are */ eye: T.Vector3; lamp: T.SpotLight;
  shelf: {group: T.Object3D; top: T.Vector3; facing: number}; update(dt: number): void;
}

function matteMaps(base: HTMLImageElement | ImageBitmap, orig: HTMLImageElement | ImageBitmap | null, size: number) {
  const c = document.createElement('canvas'); c.width = c.height = size; const x = c.getContext('2d', {willReadFrequently: true})!;
  x.drawImage(base as any, 0, 0, size, size); const B = x.getImageData(0, 0, size, size);
  let O: ImageData | null = null; if (orig) { x.drawImage(orig as any, 0, 0, size, size); O = x.getImageData(0, 0, size, size); }
  // two octaves of smooth value noise (in UV space) so neighbouring panels never share one roughness
  const noise = (cells: number, seed: number) => { const n = document.createElement('canvas'); n.width = n.height = cells; const nx = n.getContext('2d')!, d = nx.createImageData(cells, cells), r = rng(seed); for (let i = 0; i < d.data.length; i += 4) { d.data[i] = d.data[i + 1] = d.data[i + 2] = r() * 255; d.data[i + 3] = 255; } nx.putImageData(d, 0, 0); const big = document.createElement('canvas'); big.width = big.height = size; const bx = big.getContext('2d', {willReadFrequently: true})!; bx.imageSmoothingQuality = 'high'; bx.drawImage(n, 0, 0, size, size); return bx.getImageData(0, 0, size, size).data; };
  const n1 = noise(24, 7), n2 = noise(160, 19), out = x.createImageData(size, size), col = x.createImageData(size, size);
  for (let i = 0; i < B.data.length; i += 4) {
    const r = B.data[i] / 255, g = B.data[i + 1] / 255, b = B.data[i + 2] / 255, mx = Math.max(r, g, b), mn = Math.min(r, g, b), sat = mx > 0 ? (mx - mn) / mx : 0, lum = r * .3 + g * .59 + b * .11;
    const rust = Math.min(1, Math.max(0, (r - g * 1.08) * 4.5) * Math.min(1, sat * 2.2)); // orange-brown corrosion
    const soot = Math.max(0, .16 - lum) / .16; // black grime in recesses
    const v1 = n1[i] / 255, v2 = n2[i] / 255;
    let rough = .58 + v1 * .14 + (v2 - .5) * .1;                // weathered iron
    rough = rough + (.9 - rough) * rust + soot * .08;             // rust is far rougher
    if (O) rough = Math.max(rough, O.data[i + 1] / 255);          // never smoother than the asset said
    let metal = .78 - rust * .62 - soot * .25 + (v1 - .5) * .1;   // rust and soot are not metal
    // rare oily patches: smoother, darker, still not mirror-like
    const oil = Math.max(0, v1 - .78) * 4 * (1 - rust); rough -= oil * .18;
    out.data[i] = 255; out.data[i + 1] = Math.min(1, Math.max(.42, rough)) * 255; out.data[i + 2] = Math.min(1, Math.max(.05, metal)) * 255; out.data[i + 3] = 255;
    // keep the authored albedo; only a touch of soot and oil darkening
    // near-black texels in the asset read as holes: lift them to weathered iron (still dark, never void)
    const lift = Math.max(0, .2 - lum) / .2, ir = 74 + v2 * 30, ig = 62 + v2 * 22, ib = 54 + v2 * 16;
    const k = 1 - oil * .2 - (1 - v2) * .05; col.data[i] = (B.data[i] + (ir - B.data[i]) * lift * .75) * k; col.data[i + 1] = (B.data[i + 1] + (ig - B.data[i + 1]) * lift * .75) * k; col.data[i + 2] = (B.data[i + 2] + (ib - B.data[i + 2]) * lift * .75) * k; col.data[i + 3] = 255;
  }
  const tex = (d: ImageData, srgb: boolean) => { const cc = document.createElement('canvas'); cc.width = cc.height = size; cc.getContext('2d')!.putImageData(d, 0, 0); const t = new T.CanvasTexture(cc); t.flipY = false; t.colorSpace = srgb ? T.SRGBColorSpace : T.NoColorSpace; t.anisotropy = 8; return t; };
  return {orm: tex(out, false), map: tex(col, true)};
}

export async function buildGlbCage(renderer: T.WebGLRenderer, scene: T.Scene, hi: boolean, url = 'models/cage.glb'): Promise<CageInfo> {
  const [gltf, hdr] = await Promise.all([new GLTFLoader().loadAsync(url), new HDRLoader().loadAsync(TEX + 'boiler_room_1k.hdr')]);
  const pmrem = new T.PMREMGenerator(renderer); hdr.mapping = T.EquirectangularReflectionMapping; scene.environment = pmrem.fromEquirectangular(hdr).texture; hdr.dispose(); pmrem.dispose();
  scene.environmentIntensity = .5; scene.background = new T.Color('#030201'); scene.fog = new T.FogExp2('#0b0503', .045);
  const root = gltf.scene; let mesh!: T.Mesh; root.traverse(o => { if ((o as T.Mesh).isMesh) mesh = o as T.Mesh; });
  // scale from the measured bounds, then stand it on y = 0 centred on the origin
  let box = new T.Box3().setFromObject(root); const size = box.getSize(new T.Vector3()); const s = CAGE_HEIGHT / size.y; root.scale.setScalar(s); root.updateMatrixWorld(true);
  box = new T.Box3().setFromObject(root); const c = box.getCenter(new T.Vector3()); root.position.set(-c.x, -box.min.y, -c.z); root.updateMatrixWorld(true); box.setFromObject(root);
  // materials
  const m = mesh.material as T.MeshPhysicalMaterial, img = m.map!.image, ormImg = m.roughnessMap?.image || null, sz = hi ? 2048 : 1024;
  const maps = matteMaps(img, ormImg, sz);
  const mat = new T.MeshPhysicalMaterial({map: maps.map, normalMap: m.normalMap, normalScale: new T.Vector2(1.6, 1.6), roughnessMap: maps.orm, metalnessMap: maps.orm, roughness: 1, metalness: 1,
    specularIntensity: .5, specularColor: new T.Color(1, 1, 1), envMapIntensity: .6, side: T.DoubleSide});
  await triplanarDetail(mat);
  m.map?.dispose(); m.roughnessMap?.dispose(); m.dispose(); mesh.material = mat; mesh.castShadow = mesh.receiveShadow = true;
  scene.add(root);
  // probe the real interior: floor and ceiling under/over the centre, walls along ±x / ±z
  const ray = new T.Raycaster(), hit = (o: T.Vector3, d: T.Vector3) => { ray.set(o, d); ray.far = 20; return ray.intersectObject(mesh, false)[0] || null; };
  const mid = new T.Vector3(0, CAGE_HEIGHT * .5, 0);
  const floorY = hit(mid, new T.Vector3(0, -1, 0))?.point.y ?? 0, ceilingY = hit(mid, new T.Vector3(0, 1, 0))?.point.y ?? CAGE_HEIGHT;
  const wall = (d: T.Vector3) => { const probes = [.35, .55, .8].map(h => hit(new T.Vector3(0, floorY + h * (ceilingY - floorY), 0), d)?.distance ?? 1.2); return Math.min(...probes); };
  const px = wall(new T.Vector3(1, 0, 0)), nx = wall(new T.Vector3(-1, 0, 0)), pz = wall(new T.Vector3(0, 0, 1)), nz = wall(new T.Vector3(0, 0, -1));
  const inner = new T.Box3(new T.Vector3(-nx, floorY, -nz), new T.Vector3(px, ceilingY, pz));
  const eye = new T.Vector3(0, Math.min(floorY + 1.55, ceilingY - .25), (pz - nz) * .5 + pz * .1);
  // lighting: one dim caged bulb under the roof, lava glow from below and through the bars
  const lamp = new T.SpotLight('#ffb870', 34, 9, 1.2, .75, 1.3); lamp.position.set(0, ceilingY - .12, 0); lamp.target.position.set(0, floorY, 0); lamp.castShadow = true;
  lamp.shadow.mapSize.set(hi ? 2048 : 1024, hi ? 2048 : 1024); lamp.shadow.bias = -.0002; lamp.shadow.normalBias = .02; lamp.shadow.camera.near = .1; lamp.shadow.camera.far = 8;
  scene.add(lamp, lamp.target);
  const bulb = new T.PointLight('#ff9a4a', 2.2, 4, 1.6); bulb.position.copy(lamp.position); scene.add(bulb);
  const glow = new T.Mesh(new T.SphereGeometry(.03, 16, 10), new T.MeshBasicMaterial({color: '#ffcf96'})); glow.position.copy(lamp.position).y -= .02; scene.add(glow);
  const lava = createLava(scene, floorY - 3.2, hi);
  // soft bounce fill so corners and the far walls never fall to pure black (no shadows: cheap on phones)
  for (const [x, yy, z, c, k] of [[-.6, .55, .6, '#ffc79a', 1.0], [.6, .55, -.6, '#ffc79a', 1.0], [0, .2, 0, '#ff7a3a', .8]] as const) { const f = new T.PointLight(c, k, 4.5, 1.5); f.position.set(x * (px + nx) / 2, floorY + yy * (ceilingY - floorY), z * (pz + nz) / 2); scene.add(f); }
  scene.add(new T.HemisphereLight('#8a7058', '#5a2008', .8));
  // wall shelf: weathered iron plank on two aged-brass brackets, on the back wall (−z), off-centre so it clears the doors
  const shelf = buildShelf(); const shelfY = floorY + 1.02, shelfX = Math.min(px, nx) * .35; shelf.position.set(shelfX, shelfY, -nz + .005); scene.add(shelf);
  const shelfTop = new T.Vector3(shelfX, shelfY + .007, -nz + .005 + .165);
  const planes: Plane[] = [
    {n: new T.Vector3(0, 1, 0), d: floorY, restitution: .16, friction: .6, material: 'metal'},
    {n: new T.Vector3(1, 0, 0), d: -nx + .03, restitution: .2, friction: .4, material: 'metal'}, {n: new T.Vector3(-1, 0, 0), d: -px + .03, restitution: .2, friction: .4, material: 'metal'},
    {n: new T.Vector3(0, 0, 1), d: -nz + .03, restitution: .2, friction: .4, material: 'metal'}, {n: new T.Vector3(0, 0, -1), d: -pz + .03, restitution: .2, friction: .4, material: 'metal'},
  ];
  let t = 0;
  return {root, mesh, planes, floorY, ceilingY, inner, eye, lamp, shelf: {group: shelf, top: shelfTop, facing: 0}, update(dt) {
    t += dt; lava.update(dt);
    const f = Math.random() < .003 ? .3 : 1; lamp.intensity = 34 * (.97 + Math.sin(t * 47) * .015) * f; bulb.intensity = 2.2 * f;
  }};
}

/** Victorian wall shelf: riveted iron plank with a raised lip, cast scroll brackets in tarnished brass. */
function buildShelf() {
  const g = new T.Group();
  const iron = new T.MeshPhysicalMaterial({color: '#2a2420', roughness: .78, metalness: .7, envMapIntensity: .5});
  const brass = new T.MeshPhysicalMaterial({color: '#6e5530', roughness: .55, metalness: .85, envMapIntensity: .6});
  const plank = new T.Mesh(new T.BoxGeometry(.42, .012, .33), iron); plank.position.set(0, 0, .165); g.add(plank);
  const lip = new T.Mesh(new T.BoxGeometry(.42, .03, .008), iron); lip.position.set(0, .015, .326); g.add(lip);
  const back = new T.Mesh(new T.BoxGeometry(.44, .07, .01), iron); back.position.set(0, -.02, .005); g.add(back);
  const scroll = new T.Shape(); scroll.moveTo(0, 0); scroll.lineTo(.26, 0); scroll.quadraticCurveTo(.06, -.03, 0, -.22); scroll.lineTo(0, 0);
  const hole = new T.Path(); hole.absarc(.045, -.045, .025, 0, Math.PI * 2, true); scroll.holes.push(hole);
  const bracketGeo = new T.ExtrudeGeometry(scroll, {depth: .008, bevelEnabled: true, bevelSize: .002, bevelThickness: .002, bevelSegments: 2});
  for (const x of [-.16, .16]) { const b = new T.Mesh(bracketGeo, brass); b.rotation.y = -Math.PI / 2; b.position.set(x - .004, -.006, .01); g.add(b); }
  const rivet = new T.SphereGeometry(.005, 10, 6); for (const x of [-.19, -.07, .07, .19]) { const r = new T.Mesh(rivet, brass); r.position.set(x, -.02, .011); r.scale.z = .5; g.add(r); }
  g.traverse(o => { (o as T.Mesh).castShadow = (o as T.Mesh).receiveShadow = true; });
  return g;
}

/** World-space (triplanar) corrosion detail from the photographic rusty-steel scan. The asset's
 *  interior UVs are smeared, so detail is projected in world space instead: pitting in the roughness, a light grime overlay in the albedo. No UV stretching, no seams. */
async function triplanarDetail(mat: T.MeshPhysicalMaterial) {
  const L = new T.TextureLoader(), load = (f: string, srgb: boolean) => L.loadAsync(TEX + f).then(t => { t.wrapS = t.wrapT = T.RepeatWrapping; t.colorSpace = srgb ? T.SRGBColorSpace : T.NoColorSpace; t.anisotropy = 4; return t; });
  const [diff, rough] = await Promise.all([load('rusty_metal_05_diff_1k.jpg', true), load('rusty_metal_05_rough_1k.jpg', false)]);
  mat.onBeforeCompile = sh => {
    sh.uniforms.detailDiff = {value: diff}; sh.uniforms.detailRough = {value: rough};
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vWPos; varying vec3 vWNrm;')
      .replace('#include <worldpos_vertex>', '#include <worldpos_vertex>\nvWPos = (modelMatrix * vec4(transformed, 1.0)).xyz; vWNrm = normalize(mat3(modelMatrix) * objectNormal);');
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', `#include <common>
uniform sampler2D detailDiff; uniform sampler2D detailRough; varying vec3 vWPos; varying vec3 vWNrm;
vec3 triW(){ vec3 w = pow(abs(normalize(vWNrm)), vec3(4.)); return w / (w.x + w.y + w.z); }
vec4 tri(sampler2D t, float k){ vec3 w = triW(); vec3 p = vWPos * k; return texture2D(t, p.zy) * w.x + texture2D(t, p.xz) * w.y + texture2D(t, p.xy) * w.z; }`)
      .replace('#include <map_fragment>', `#include <map_fragment>
{ vec3 d = tri(detailDiff, 1.7).rgb; float g = dot(d, vec3(.3,.59,.11)); diffuseColor.rgb *= mix(vec3(1.), d / max(g, .05) * (.55 + g), .38); }`)
      .replace('#include <roughnessmap_fragment>', `#include <roughnessmap_fragment>
{ float dr = tri(detailRough, 1.7).g; roughnessFactor = clamp(max(roughnessFactor, .45) + (dr - .5) * .35, .4, 1.); }`)
      ;
  };
  mat.customProgramCacheKey = () => 'cage-triplanar';
}
