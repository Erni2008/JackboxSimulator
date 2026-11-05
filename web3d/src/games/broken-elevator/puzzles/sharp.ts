// Crisp engraved text: every label / screen canvas is drawn at a multiple of its logical size (the draw code keeps
// using logical coordinates through a pre-scaled context), then sampled with full anisotropic filtering.
// 2x on desktop and iPhone; 1.5x on Android phones (keeps GPU memory sane on mid-range devices such as the Poco X3 Pro).
import * as T from 'three';
const android = /Android/i.test(navigator.userAgent);
export const SS = android ? 1.5 : 2;
/** canvas of logical size w×h, physically SS times larger */
export function hiCanvas(w: number, h: number) { const c = document.createElement('canvas'); c.width = Math.round(w * SS); c.height = Math.round(h * SS); return c; }
/** 2D context of a hiCanvas with the logical-unit transform applied (call at the start of every redraw) */
export function ctx2d(c: HTMLCanvasElement) { const x = c.getContext('2d')!; x.setTransform(SS, 0, 0, SS, 0, 0); x.imageSmoothingQuality = 'high'; return x; }
/** texture settings for text: sRGB, max anisotropy, trilinear mipmaps */
export function textTex(c: HTMLCanvasElement, srgb = true) { const t = new T.CanvasTexture(c); t.colorSpace = srgb ? T.SRGBColorSpace : T.NoColorSpace; t.anisotropy = 16; t.minFilter = T.LinearMipmapLinearFilter; t.magFilter = T.LinearFilter; return t; }
