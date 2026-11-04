// Lava lake under the elevator shaft. One plane + one particle draw, everything
// animated on the GPU: drifting cooled crust plates (Voronoi) with glowing seams,
// open molten pools (domain-warped fBm), bubbles that swell, glisten and burst
// with a ring, and embers rising on the heat. `hi=false` drops octaves and the
// Voronoi search so it stays cheap on phones.
import * as T from 'three';

const frag = (hi: boolean) => `
#define OCT ${hi ? 5 : 3}
uniform float time; varying vec3 vW;
float h1(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
vec2 h2(vec2 p){ return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453); }
float n2(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f); return mix(mix(h1(i), h1(i + vec2(1, 0)), f.x), mix(h1(i + vec2(0, 1)), h1(i + vec2(1, 1)), f.x), f.y); }
float fbm(vec2 p){ float s = 0., a = .5; for (int i = 0; i < OCT; i++) { s += a * n2(p); p = mat2(1.6, 1.2, -1.2, 1.6) * p; a *= .5; } return s; }
// F1 and F2 distances of a jittered grid (crust plates)
vec2 vor(vec2 p, float t){ vec2 i = floor(p), f = fract(p); float d1 = 8., d2 = 8.;
  for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) { vec2 g = vec2(x, y), o = h2(i + g); o = .5 + .42 * sin(t * .15 + 6.2831 * o); float d = length(g + o - f); if (d < d1) { d2 = d1; d1 = d; } else if (d < d2) d2 = d; }
  return vec2(d1, d2); }
vec3 heat(float k){ // blackbody-ish ramp: dark red -> orange -> yellow -> white-hot
  k = clamp(k, 0., 1.); return mix(mix(vec3(.25, .02, .0), vec3(1., .22, .02), smoothstep(.0, .45, k)), mix(vec3(1., .55, .08), vec3(1.6, 1.25, .7), smoothstep(.8, 1., k)), smoothstep(.4, .85, k)); }
void main(){
  vec2 p = vW.xz * .55; float t = time;
  // slow convective flow: domain-warped coordinates
  vec2 q = vec2(fbm(p + vec2(0., t * .03)), fbm(p + vec2(5.2, 1.3) - t * .025));
  vec2 w = p + 1.6 * q + vec2(t * .02, -t * .012);
  float molten = fbm(w * .7 + 3.1);                 // where the crust has broken open
  vec2 v = vor(w * 1.15, t);
  float seam = 1. - smoothstep(.0, .09 + .06 * molten, v.y - v.x);
  float crustMask = smoothstep(.56, .44, molten);   // 1 = crusted, 0 = open pool
  float crustTex = fbm(w * 6.) ;
  vec3 crust = vec3(.035, .025, .022) * (.6 + .8 * crustTex) + heat(.25) * .25 * smoothstep(.35, 0., v.x) * 0.;
  // the crust glows dimly where it is thin (near seams) and from below
  crust += heat(.3) * .35 * pow(1. - smoothstep(.0, .35, v.y - v.x), 2.);
  float poolHeat = .32 + .5 * pow(fbm(w * 2.3 - t * .08), 1.6);
  vec3 col = mix(heat(poolHeat), crust, crustMask);
  col += heat(.55 + .3 * molten) * seam * crustMask * .9;
  // bubbles: one per cell, swelling then bursting into a ring; mostly in open pools
  vec2 bc = vW.xz * 1.1; vec2 bi = floor(bc), bf = fract(bc);
  float bub = 0., ring = 0.;
  for (int y = -1; y <= ${hi ? 1 : 0}; y++) for (int x = -1; x <= ${hi ? 1 : 0}; x++) {
    vec2 g = vec2(x, y), r = h2(bi + g + 17.); float period = 2.5 + 4. * r.x, life = fract(t / period + r.y);
    vec2 c = g + .2 + .6 * r - bf; float d = length(c), R = .08 + .22 * h1(bi + g + 3.);
    float alive = step(.35, h1(bi + g + 9.)) * (1. - crustMask * .7);
    float grow = smoothstep(0., .85, life), rad = R * grow;
    bub += alive * step(life, .9) * pow(max(0., 1. - d / max(rad, 1e-3)), 1.5) * grow;
    float burst = smoothstep(.9, 1., life); ring += alive * step(.9, life) * smoothstep(.04, 0., abs(d - R * (1. + burst * 1.4))) * (1. - burst);
  }
  // a bubble skin is cooler at its top and catches a hot rim
  col = mix(col, heat(.5) * .6, clamp(bub * .55, 0., .8)) + heat(.85) * clamp(bub, 0., 1.) * (1. - bub) * .9 * (1. - crustMask * .6);
  col += heat(.8) * ring * .6 * (1. - crustMask);
  float far = smoothstep(9., 22., length(vW.xz)); col *= 1. - far * .85; // falls off into the dark of the shaft
  gl_FragColor = vec4(col * vec3(1., .62, .38) * .7, 1.);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;

export function createLava(scene: T.Scene, y: number, hi: boolean) {
  const mat = new T.ShaderMaterial({uniforms: {time: {value: 0}}, fog: false, vertexShader: 'varying vec3 vW;void main(){vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}', fragmentShader: frag(hi)});
  const lake = new T.Mesh(new T.CircleGeometry(26, 40), mat); lake.rotation.x = -Math.PI / 2; lake.position.y = y; scene.add(lake);
  // embers: rising, drifting, cooling; positions computed in the vertex shader
  const N = hi ? 260 : 90, seed = new Float32Array(N * 4); for (let i = 0; i < N * 4; i++) seed[i] = Math.random();
  const g = new T.BufferGeometry(); g.setAttribute('position', new T.BufferAttribute(new Float32Array(N * 3), 3)); g.setAttribute('seed', new T.BufferAttribute(seed, 4));
  const emat = new T.ShaderMaterial({uniforms: {time: {value: 0}, base: {value: y}, px: {value: Math.min(devicePixelRatio, 2)}}, transparent: true, depthWrite: false, blending: T.AdditiveBlending,
    vertexShader: `uniform float time, base, px; attribute vec4 seed; varying float vA;
      void main(){ float life = fract(time * (.08 + .1 * seed.z) + seed.w); vec3 p = vec3((seed.x - .5) * 9., base + life * 7., (seed.y - .5) * 9.);
        p.x += sin(time * (.6 + seed.z) + seed.w * 20.) * .35 * life; p.z += cos(time * (.5 + seed.x) + seed.y * 20.) * .35 * life;
        vA = (1. - life) * smoothstep(0., .05, life); vec4 mv = viewMatrix * vec4(p, 1.); gl_PointSize = (2. + 4. * seed.z) * px * (1.2 / -mv.z) * 6.; gl_Position = projectionMatrix * mv; }`,
    fragmentShader: `varying float vA; void main(){ float d = length(gl_PointCoord - .5); float a = smoothstep(.5, .0, d) * vA; gl_FragColor = vec4(vec3(1., .45, .12) * a * 1.4, a); }`});
  const embers = new T.Points(g, emat); embers.frustumCulled = false; scene.add(embers);
  // the lake lights the shaft and the cage underside; flicker follows the burst rhythm
  const lights: T.PointLight[] = []; for (const [x, z] of [[0, 0]]) { const l = new T.PointLight('#ff5a12', 14, 14, 1.2); l.position.set(x, y + .9, z); scene.add(l); lights.push(l); }
  let t = 0;
  return {lake, update(dt: number) { t += dt; mat.uniforms.time.value = t; emat.uniforms.time.value = t; lights.forEach((l, i) => { l.intensity = 14 + 2 * Math.sin(t * 1.3 + i * 2.1) * 1.2 + Math.sin(t * 5.7 + i) * .5 + Math.max(0, Math.sin(t * 2.9 + i * 4)) ** 12 * 3; }); }};
}
