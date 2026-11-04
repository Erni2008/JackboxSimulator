// Pre-baked texture cache. The leather and cage maps are composited procedurally
// (deterministic seeds). Doing that per pixel at start-up costs ~1 s on a laptop and
// several seconds on a phone, so the results are baked once into JPEGs
// (tools/assets/bake_broken_elevator_textures.cjs) and simply downloaded at run time.
// ?bake=1 forces the procedural path and exposes the canvases for the bake script.
import * as T from 'three';
import {TEX} from './materials';

export const BAKE = new URLSearchParams(location.search).has('bake');
export const bakedOut: Record<string, HTMLCanvasElement> = {};
(window as any).__bakedOut = bakedOut;

export async function loadBaked(keys: string[], opts: {srgb: boolean[]; flipY: boolean; aniso: number}) {
  if (BAKE) return null;
  const L = new T.TextureLoader();
  try {
    return await Promise.all(keys.map((k, i) => L.loadAsync(`${TEX}baked/${k}.jpg`).then(t => { t.colorSpace = opts.srgb[i] ? T.SRGBColorSpace : T.NoColorSpace; t.flipY = opts.flipY; t.anisotropy = opts.aniso; t.needsUpdate = true; return t; })));
  } catch { return null; }
}
export function register(key: string, tex: T.Texture) { if (BAKE) bakedOut[key] = tex.image as HTMLCanvasElement; }
