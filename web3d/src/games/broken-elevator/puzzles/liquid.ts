// THE UNSTABLE FORMULA — liquid shaders (single pass each, no render targets: cheap on mobile).
//  flowMaterial   liquid travelling inside a glass tube: a moving slug with a bright leading meniscus, internal streaks
//                 and a soft tail, driven along the tube's UV.u (head / tail in 0..1).
//  liquidMaterial the mixing-chamber body: two reagent colours with a domain-warped, swirling interface. mix=0 keeps the
//                 newcomer as tendrils and a wavy layer; mix→1 twists the colours together into the blended tone while
//                 fine streaks persist; bubbles rise procedurally; an "unstable" term boils it toward a sick yellow-green.
import * as T from 'three';

const NOISE = /* glsl */`
float h3(vec3 p){ p = fract(p * .3183099 + .1); p *= 17.; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float n3(vec3 x){ vec3 i = floor(x), f = fract(x); f = f * f * (3. - 2. * f);
  return mix(mix(mix(h3(i), h3(i + vec3(1,0,0)), f.x), mix(h3(i + vec3(0,1,0)), h3(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(h3(i + vec3(0,0,1)), h3(i + vec3(1,0,1)), f.x), mix(h3(i + vec3(0,1,1)), h3(i + vec3(1,1,1)), f.x), f.y), f.z); }
float fbm(vec3 p){ float s = 0., a = .5; for (int i = 0; i < 4; i++) { s += a * n3(p); p = p * 2.03 + 1.7; a *= .5; } return s; }`;

export function flowMaterial(color: T.Color) {
  return new T.ShaderMaterial({transparent: true, depthWrite: false,
    uniforms: {uColor: {value: color.clone()}, uGlint: {value: color.clone().offsetHSL(0, 0, .25)}, uHead: {value: 0}, uTail: {value: 0}, uTime: {value: 0}},
    vertexShader: 'varying vec2 vUv; varying vec3 vN; varying vec3 vV; void main(){ vUv = uv; vec4 mv = modelViewMatrix * vec4(position, 1.); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }',
    fragmentShader: NOISE + /* glsl */`
      uniform vec3 uColor, uGlint; uniform float uHead, uTail, uTime; varying vec2 vUv; varying vec3 vN; varying vec3 vV;
      void main(){
        float u = vUv.x; if (u > uHead || u < uTail || uHead <= 0.) discard;
        float edge = smoothstep(uHead - .06, uHead, u);                       // the leading meniscus
        float streak = n3(vec3(u * 38. - uTime * 9., vUv.y * 6.283, uTime));   // flow streaks moving along the tube
        float rim = pow(1. - abs(dot(vN, vV)), 2.);
        vec3 c = mix(uColor, uGlint, .25 * streak + .55 * edge) + rim * uGlint * .35;
        float a = .9 * smoothstep(uTail, uTail + .05, u) + edge * .1;
        gl_FragColor = vec4(c, a);
        #include <colorspace_fragment>
      }`});
}

export interface LiquidUniforms { uColA: {value: T.Color}; uColB: {value: T.Color}; uGlintA: {value: T.Color}; uGlintB: {value: T.Color}; uFracB: {value: number}; uMix: {value: number}; uSwirl: {value: number}; uTime: {value: number}; uBubbles: {value: number}; uUnstable: {value: number}; uFill: {value: number} }
export function liquidMaterial(hi: boolean) {
  const uniforms: LiquidUniforms = {uColA: {value: new T.Color('#5e1a8c')}, uColB: {value: new T.Color('#0f8a3c')}, uGlintA: {value: new T.Color('#ff5ae0')}, uGlintB: {value: new T.Color('#7dff9a')},
    uFracB: {value: 0}, uMix: {value: 1}, uSwirl: {value: 0}, uTime: {value: 0}, uBubbles: {value: .2}, uUnstable: {value: 0}, uFill: {value: 1}};
  const mat = new T.ShaderMaterial({transparent: true, depthWrite: false, side: T.DoubleSide, uniforms: uniforms as any,
    vertexShader: 'varying vec3 vP; varying vec3 vN; varying vec3 vV; void main(){ vP = position; vec4 mv = modelViewMatrix * vec4(position, 1.); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }',
    fragmentShader: NOISE + /* glsl */`
      #define OCT ${hi ? 1 : 0}
      uniform vec3 uColA, uColB, uGlintA, uGlintB; uniform float uFracB, uMix, uSwirl, uTime, uBubbles, uUnstable, uFill;
      varying vec3 vP; varying vec3 vN; varying vec3 vV;
      void main(){
        float y = vP.y + .5;                                    // 0 bottom .. 1 surface (unit cylinder, scaled by fill)
        float th = atan(vP.z, vP.x), r = length(vP.xz) * 2.;
        // swirl: the stirrer twists the field more near the centre and the surface
        float tw = uSwirl * (1.2 - .5 * r) * (.6 + .4 * y);
        vec3 q = vec3(cos(th + tw) * r, y * 2.2, sin(th + tw) * r);
        vec3 w = q + .55 * vec3(fbm(q * 1.7 + uTime * .12), fbm(q * 1.7 + 3.1 - uTime * .1), fbm(q * 1.7 + 6.3 + uTime * .08)); // domain warp
        float n = fbm(w * 2.3 + vec3(0., -uTime * .25, 0.));
        // phase A/B: the newcomer sits as a wavy upper layer and drops tendrils; phase C/D: twisted together toward fracB
        float layer = smoothstep(1. - uFracB - .14, 1. - uFracB + .14, y + (n - .5) * .55 - .25 * (1. - y) * (n - .45));
        float tendril = smoothstep(.62, .78, n) * (1. - uMix) * step(.0001, uFracB);
        float sep = clamp(layer + tendril, 0., 1.);
        float blended = clamp(uFracB + (n - .5) * .9 * (1. - uMix * .55), 0., 1.);
        float m = mix(sep, blended, smoothstep(0., 1., uMix));
        vec3 col = mix(uColA, uColB, m) * (1. - .55 * 4. * m * (1. - m) * step(.0001, uFracB)); // pigment-like: blends deepen instead of greying
        float streakLine = 1. - smoothstep(0., .12, abs(m - .5)) ;      // luminous streaks along the colour interface
        col += mix(uGlintA, uGlintB, m) * streakLine * .5 * (1. - uMix * .35) * step(.0001, uFracB);
        col *= .75 + .5 * n;                                            // depth / internal variation
        // bubbles rising in thin columns
        vec2 bc = vec2(th * 4.775, y * 7. - uTime * (1.2 + uUnstable * 2.5));
        vec2 bi = floor(bc), bf = fract(bc) - .5; float bh = h3(vec3(bi, 7.));
        float bub = step(1. - uBubbles * (.55 + uUnstable * .45), bh) * smoothstep(.22 + bh * .1, .1, length(bf * vec2(1., 1.6)));
        col += vec3(1.) * bub * .55;
        // chemical rejection: boiling toward a sick yellow-green, flickering
        float boil = uUnstable * (.6 + .4 * n3(vec3(th * 3., y * 9. - uTime * 6., uTime * 3.)));
        col = mix(col, vec3(.55, .62, .08) * (.7 + .6 * n), boil * .75);
        float rim = pow(1. - abs(dot(vN, vV)), 2.5);
        col += rim * mix(uGlintA, uGlintB, m) * .35;
        float top = smoothstep(.985, 1., y); col += top * .12;                 // meniscus sheen
        gl_FragColor = vec4(col, (.8 + rim * .18) * step(.001, uFill));
        #include <colorspace_fragment>
      }`});
  return {mat, uniforms};
}
