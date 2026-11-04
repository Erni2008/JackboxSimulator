// THE UNSTABLE FORMULA — liquid and glass shaders (single pass each, no render targets: cheap on mobile).
//  flowMaterial   a liquid slug travelling inside a glass tube: bright leading meniscus, internal streaks, soft tail.
//  liquidMaterial the mixing-chamber body (unit cylinder, scaled by the fill level):
//                 · absorption: thicker liquid (the core) is deeper and darker, the rim transmits light (Beer–Lambert-ish)
//                 · plume: an incoming reagent sinks from the inlet as a billowing, widening column
//                 · layer + tendrils: undisturbed, the newcomer settles as a wavy layer and drips tendrils
//                 · vortex: the stirrer winds both colours into logarithmic spiral arms that tighten and blend,
//                   while the free surface dips into a vortex; fine streaks survive the blend
//                 · surface: meniscus sheen, specular glint, expanding ripple rings where the stream lands
//                 · rejection: boils toward a sick yellow-green with a flickering, churning surface
//  glassMaterial  fresnel-only glass: clear at the centre, bright edges and a vertical specular streak.
import * as T from 'three';

const NOISE = /* glsl */`
float h3(vec3 p){ p = fract(p * .3183099 + .1); p *= 17.; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float n3(vec3 x){ vec3 i = floor(x), f = fract(x); f = f * f * (3. - 2. * f);
  return mix(mix(mix(h3(i), h3(i + vec3(1,0,0)), f.x), mix(h3(i + vec3(0,1,0)), h3(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(h3(i + vec3(0,0,1)), h3(i + vec3(1,0,1)), f.x), mix(h3(i + vec3(0,1,1)), h3(i + vec3(1,1,1)), f.x), f.y), f.z); }
float fbm(vec3 p){ float s = 0., a = .5; for (int i = 0; i < OCT; i++) { s += a * n3(p); p = p * 2.03 + 1.7; a *= .5; } return s; }`;

export function flowMaterial(color: T.Color) {
  return new T.ShaderMaterial({transparent: true, depthWrite: false,
    uniforms: {uColor: {value: color.clone()}, uGlint: {value: color.clone().offsetHSL(0, 0, .25)}, uHead: {value: 0}, uTail: {value: 0}, uTime: {value: 0}},
    vertexShader: 'varying vec2 vUv; varying vec3 vN; varying vec3 vV; void main(){ vUv = uv; vec4 mv = modelViewMatrix * vec4(position, 1.); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }',
    fragmentShader: '#define OCT 3\n' + NOISE + /* glsl */`
      uniform vec3 uColor, uGlint; uniform float uHead, uTail, uTime; varying vec2 vUv; varying vec3 vN; varying vec3 vV;
      void main(){
        float u = vUv.x; if (u > uHead || u < uTail || uHead <= 0.) discard;
        float edge = smoothstep(uHead - .07, uHead, u);
        float streak = n3(vec3(u * 42. - uTime * 11., vUv.y * 6.283, uTime * 1.3));
        float core = abs(dot(vN, vV)), rim = pow(1. - core, 2.);
        vec3 c = uColor * (.55 + .45 * core) + uGlint * (.22 * streak + .5 * edge) + rim * uGlint * .4;
        c += pow(max(0., dot(reflect(-vV, vN), normalize(vec3(-.4, .8, .45)))), 30.) * .6;
        gl_FragColor = vec4(c, .92 * smoothstep(uTail, uTail + .06, u) + edge * .08);
        #include <colorspace_fragment>
      }`});
}

export function glassMaterial(tint = '#e6f0f6', strength = 1) {
  return new T.ShaderMaterial({transparent: true, depthWrite: false, side: T.DoubleSide,
    uniforms: {uTint: {value: new T.Color(tint)}, uK: {value: strength}},
    vertexShader: 'varying vec3 vN; varying vec3 vV; varying vec3 vL; void main(){ vL = position; vec4 mv = modelViewMatrix * vec4(position, 1.); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }',
    fragmentShader: /* glsl */`
      uniform vec3 uTint; uniform float uK; varying vec3 vN; varying vec3 vV; varying vec3 vL;
      void main(){
        vec3 n = gl_FrontFacing ? vN : -vN; float f = pow(1. - abs(dot(n, vV)), 3.);
        float spec = pow(max(0., dot(reflect(-vV, n), normalize(vec3(-.45, .75, .5)))), 60.) * 1.6 + pow(max(0., dot(reflect(-vV, n), normalize(vec3(.6, .2, .8)))), 22.) * .35;
        float streak = smoothstep(.06, 0., abs(atan(vL.z, vL.x) - 2.2)) * .25; // a long vertical window reflection
        float a = clamp((.012 + f * .3 + spec * .8 + streak * .6) * uK, 0., .85);
        gl_FragColor = vec4(uTint * (.55 + f * .45) * .8 + spec, a);
        #include <colorspace_fragment>
      }`});
}

export interface LiquidUniforms { uColA: {value: T.Color}; uColB: {value: T.Color}; uGlintA: {value: T.Color}; uGlintB: {value: T.Color}; uFracB: {value: number}; uMix: {value: number}; uSwirl: {value: number}; uStir: {value: number}; uTime: {value: number}; uBubbles: {value: number}; uUnstable: {value: number}; uFill: {value: number}; uPlume: {value: number}; uPlumeX: {value: T.Vector2}; uRipple: {value: number}; uAspect: {value: number} }
export function liquidMaterial(hi: boolean) {
  const uniforms: LiquidUniforms = {uColA: {value: new T.Color('#5e1a8c')}, uColB: {value: new T.Color('#0f8a3c')}, uGlintA: {value: new T.Color('#ff5ae0')}, uGlintB: {value: new T.Color('#7dff9a')},
    uFracB: {value: 0}, uMix: {value: 1}, uSwirl: {value: 0}, uStir: {value: 0}, uTime: {value: 0}, uBubbles: {value: .2}, uUnstable: {value: 0}, uFill: {value: 1}, uPlume: {value: 0}, uPlumeX: {value: new T.Vector2(0, 0)}, uRipple: {value: 9}, uAspect: {value: 1}};
  const mat = new T.ShaderMaterial({transparent: true, depthWrite: false, uniforms: uniforms as any,
    vertexShader: /* glsl */`
      uniform float uStir, uSwirl, uTime, uUnstable, uRipple, uAspect; uniform vec2 uPlumeX;
      varying vec3 vP; varying vec3 vN; varying vec3 vV; varying float vTop;
      void main(){
        vec3 p = position; vTop = step(.499, p.y) * step(.5, normal.y);
        if (vTop > .5) { // free surface: vortex dip from the stirrer, ripples where the stream lands, boiling churn
          float r = length(p.xz) * 2.;
          p.y -= uStir * .14 * (1. - r * r) / max(uAspect, .2);
          float d = length(p.xz - uPlumeX); p.y += exp(-uRipple * 2.2) * .03 * sin(d * 60. - uRipple * 20.) * smoothstep(.0, .3, uRipple) / max(uAspect, .2);
          p.y += uUnstable * .025 * sin(p.x * 40. + uTime * 13.) * sin(p.z * 37. - uTime * 11.) / max(uAspect, .2);
        }
        vP = p; vec4 mv = modelViewMatrix * vec4(p, 1.); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }`,
    fragmentShader: `#define OCT ${hi ? 4 : 3}\n` + NOISE + /* glsl */`
      uniform vec3 uColA, uColB, uGlintA, uGlintB; uniform float uFracB, uMix, uSwirl, uStir, uTime, uBubbles, uUnstable, uFill, uPlume, uRipple; uniform vec2 uPlumeX;
      varying vec3 vP; varying vec3 vN; varying vec3 vV; varying float vTop;
      void main(){
        float y = clamp(vP.y + .5, 0., 1.), r = clamp(length(vP.xz) * 2., 0., 1.), th = atan(vP.z, vP.x);
        float hasB = step(.0001, uFracB);
        // ---- flow field: rotate with the stirrer (faster near the shaft), warp with noise
        float tw = uSwirl * (1.35 - .75 * r);
        vec2 rot = vec2(cos(th + tw), sin(th + tw)) * r;
        vec3 q = vec3(rot.x, y * 1.8 - uTime * .04, rot.y);
        vec3 w = q + .6 * vec3(fbm(q * 1.6 + uTime * .1), fbm(q * 1.6 + 3.1 - uTime * .09), fbm(q * 1.6 + 6.3 + uTime * .07));
        float n = fbm(w * 2.4), nf = fbm(w * 7. + 2.);
        // ---- A/B: plume from the inlet (sinks and widens), settling layer, dripping tendrils
        vec2 rel = vP.xz - uPlumeX; float depth = 1. - y;
        float reach = uPlume * 1.15, width = .06 + depth * .32 + (n - .5) * .12;
        float plume = smoothstep(width, width * .35, length(rel + vec2(n - .5, nf - .5) * .07 * depth)) * smoothstep(reach, reach - .25, depth) * step(.001, uPlume);
        float layer = smoothstep(1. - uFracB - .12, 1. - uFracB + .12, y + (n - .5) * .5 - .2 * (1. - y) * (n - .45));
        float tendril = smoothstep(.6, .8, n + .15 * (1. - y)) * (1. - uMix) * hasB;
        float sep = clamp(max(layer, plume) + tendril, 0., 1.);
        // ---- C: the stirrer winds the colours into spiral arms which tighten and dissolve
        float arms = .5 + .5 * sin(th * 2. + log(r + .08) * 7. - uSwirl * 2.4 + (n - .5) * 5.);
        float spiral = mix(sep, mix(arms, uFracB, .35), smoothstep(.0, .45, uMix) * (1. - smoothstep(.55, 1., uMix)) * step(.05, uStir + uMix * .2));
        // ---- D: blended, but fine streaks persist
        // settled: a fine, dark marble where both reagents stay readable (averaging complementary colours only greys them)
        float ridge = 1. - abs(2. * fbm(w * 3.2 + 4.) - 1.), fil = smoothstep(.93, .99, ridge) * smoothstep(.48, .68, n); // sparse thin filaments in a few currents
        float blended = clamp(uFracB * .28 + (n - .5) * .1 + fil * .72, 0., 1.); // deep first-reagent body tinted by the additive, additive threads
        float m = mix(spiral, blended, smoothstep(.45, 1., uMix));
        m = mix(0., m, hasB);
        // pigment-like blending: mid tones deepen rather than grey out
        vec3 col = mix(uColA, uColB, m) * (1. - .55 * 4. * m * (1. - m) * hasB) * mix(1., .82, smoothstep(.5, 1., uMix) * hasB); // blends deepen
        // luminous streaks of the newcomer along the interface: broad while separating, hair-thin once blended
        float lw = mix(.09, .035, smoothstep(.3, 1., uMix));
        float line = (1. - smoothstep(0., lw, abs(m - mix(.5, uFracB + .18, smoothstep(.4, 1., uMix))))) * hasB;
        col += uGlintB * line * mix(.55, .4, uMix) * (.6 + .4 * nf);
        // ---- absorption: the core is deeper, the rim glows with transmitted light
        float thick = sqrt(max(0., 1. - r * r));
        col *= mix(.95, .36, thick) * (.75 + .5 * n);                    // deep core
        col += mix(uGlintA, uGlintB, m) * pow(1. - thick, 3.) * .3;        // light transmitted at the rim
        float lum = dot(col, vec3(.299, .587, .114)); col = max(vec3(0.), mix(vec3(lum), col, 1.12)); // rich dyes
        col += uGlintB * fil * .5 * smoothstep(.45, 1., uMix) * hasB;                    // luminous filaments of the additive
        // ---- bubbles (procedural columns; real sprites add more on top)
        vec2 bc = vec2(th * 5.1, y * 8. - uTime * (1.1 + uUnstable * 3.));
        vec2 bi = floor(bc), bf = fract(bc) - .5; float bh = h3(vec3(bi, 7.));
        col += step(1. - uBubbles * (.35 + uUnstable * .65), bh) * smoothstep(.16, .06, length(bf * vec2(1., 1.5))) * .3;
        // ---- rejection: boil toward a sick yellow-green
        float boil = uUnstable * (.55 + .45 * n3(vec3(th * 3., y * 9. - uTime * 7., uTime * 3.)));
        col = mix(col, vec3(.6, .66, .1) * (.6 + .7 * n), boil * .78);
        // ---- lighting: fresnel, specular, the free surface
        vec3 nn = normalize(vN); float f = pow(1. - abs(dot(nn, vV)), 2.5);
        float spec = pow(max(0., dot(reflect(-vV, nn), normalize(vec3(-.45, .75, .5)))), 48.);
        col += f * mix(uGlintA, uGlintB, m) * .18 + spec * .45;
        if (vTop > .5) { float rip = exp(-uRipple * 2.) * smoothstep(.04, 0., abs(fract(length(vP.xz - uPlumeX) * 9. - uRipple * 3.) - .5) - .45);
          col = col * 1.12 + .025 + rip * .3 + uStir * .06 * (1. - r) + spec * .4; }
        gl_FragColor = vec4(col, (.72 + .22 * thick + f * .06 + vTop * .1 + .12 * smoothstep(.5, 1., uMix) * hasB) * step(.001, uFill)); // translucent: the shaft and far wall show through
        #include <colorspace_fragment>
      }`});
  return {mat, uniforms};
}

/** rising bubble sprites for a vessel (local to its group) */
export function bubbleField(count: number, radius: number, height: number) {
  const pos = new Float32Array(count * 3), seed = new Float32Array(count); for (let i = 0; i < count; i++) seed[i] = Math.random();
  const g = new T.BufferGeometry(); g.setAttribute('position', new T.BufferAttribute(pos, 3)); g.setAttribute('seed', new T.BufferAttribute(seed, 1));
  const mat = new T.ShaderMaterial({transparent: true, depthWrite: false, blending: T.AdditiveBlending,
    uniforms: {uTime: {value: 0}, uRate: {value: 0}, uLevel: {value: 0}, uR: {value: radius}, uH: {value: height}, uPx: {value: Math.min(devicePixelRatio, 2)}, uTint: {value: new T.Color('#ffffff')}},
    vertexShader: /* glsl */`
      attribute float seed; uniform float uTime, uRate, uLevel, uR, uH, uPx; varying float vA;
      void main(){
        float life = fract(seed * 7.13 + uTime * (.35 + seed * .5));
        float a = seed * 40. + uTime * (1. + seed); float rr = uR * (.15 + .75 * fract(seed * 13.7));
        vec3 p = vec3(cos(a) * rr * .2 + cos(seed * 91.) * rr, -uH / 2. + life * uLevel * uH, sin(seed * 91.) * rr + sin(a) * rr * .2);
        vA = step(seed, uRate) * smoothstep(0., .1, life) * (1. - smoothstep(.85, 1., life)) * step(.02, uLevel);
        vec4 mv = modelViewMatrix * vec4(p, 1.); gl_PointSize = uPx * (.0012 + seed * .0026) * 1500. / -mv.z; gl_Position = projectionMatrix * mv; }`, // ~1–4 mm bubbles
    fragmentShader: /* glsl */`
      uniform vec3 uTint; varying float vA;
      void main(){ vec2 d = gl_PointCoord - .5; float r = length(d); if (vA <= 0. || r > .5) discard;
        float ring = smoothstep(.5, .38, r) * (.35 + .65 * smoothstep(.25, .45, r)); float hl = smoothstep(.16, .0, length(d - vec2(-.15, -.15)));
        gl_FragColor = vec4(uTint * (ring * .55 + hl), (ring * .5 + hl) * vA); }`});
  const pts = new T.Points(g, mat); pts.frustumCulled = false; return {pts, u: mat.uniforms};
}
