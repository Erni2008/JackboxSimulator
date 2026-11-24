#!/usr/bin/env python3
"""RARE MINDS host UI art: metallic gold title, beveled gilt frames (nine-patch), timer bezel, gems.

Everything is drawn here from scratch (no external art): gradients, bevels from a height map, specular bands and
soft shadows. Output: assets/rare_minds/ui/*.png. Run from the project root:  python3 tools/assets/rare_minds/make_ui.py
"""
import os, numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from scipy import ndimage

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../..'))
OUT = os.path.join(ROOT, 'assets/rare_minds/ui'); os.makedirs(OUT, exist_ok=True)
DISPLAY = os.path.join(ROOT, 'assets/ui/fonts/RussoOne-Regular.ttf')

def lerp(a, b, t): return a + (b - a) * t
def ramp(stops, t):
    """piecewise colour ramp; stops = [(pos, (r,g,b)), ...], t array 0..1 → HxWx3"""
    t = np.clip(t, 0, 1); out = np.zeros(t.shape + (3,))
    for (p0, c0), (p1, c1) in zip(stops, stops[1:]):
        m = (t >= p0) & (t <= p1); u = ((t - p0) / max(p1 - p0, 1e-6))[m][:, None]
        out[m] = np.array(c0) * (1 - u) + np.array(c1) * u
    return out
GOLD = [(0, (255, 246, 214)), (.28, (243, 206, 128)), (.5, (176, 116, 44)), (.56, (120, 70, 24)), (.62, (214, 160, 78)), (.85, (250, 214, 140)), (1, (150, 96, 38))]
RIM = [(0, (255, 240, 200)), (.35, (222, 172, 92)), (.7, (120, 74, 28)), (1, (60, 34, 14))]

def bevel(mask, width, light=(-.6, -.8, .55)):
    """Lambert shading of a bevel built from the distance to the mask edge."""
    d = ndimage.distance_transform_edt(mask)
    h = np.clip(d / width, 0, 1); h = np.sin(h * np.pi / 2)
    h = ndimage.gaussian_filter(h, 0.8)
    gy, gx = np.gradient(h)
    n = np.dstack([-gx * width, -gy * width, np.ones_like(h)]); n /= np.linalg.norm(n, axis=2, keepdims=True)
    l = np.array(light); l = l / np.linalg.norm(l)
    return np.clip((n * l).sum(2), 0, 1), h

def rgba(rgb, a): return Image.fromarray(np.dstack([np.clip(rgb, 0, 255), np.clip(a, 0, 255)]).astype(np.uint8), 'RGBA')

# ---------------------------------------------------------------------------- title
def title(text, size, name, glow=(200, 30, 18)):
    f = ImageFont.truetype(DISPLAY, size)
    bb = f.getbbox(text); w, h = bb[2] - bb[0] + size, bb[3] - bb[1] + size
    m = Image.new('L', (w, h)); ImageDraw.Draw(m).text((size // 2 - bb[0], size // 2 - bb[1]), text, font=f, fill=255)
    mask = np.array(m) > 127
    shade, hgt = bevel(mask, size * .06)
    ys = np.linspace(0, 1, h)[:, None] * np.ones((1, w))
    col = ramp(GOLD, ys * .92 + (1 - hgt) * .08)
    col = col * (.55 + .75 * shade[..., None])
    spec = np.clip((shade - .78) * 4, 0, 1)[..., None] * 255; col = col * (1 - spec / 400) + spec * .9
    a = mask.astype(float) * 255
    # dark outline + drop shadow + warm glow behind
    outline = ndimage.binary_dilation(mask, iterations=max(2, size // 40))
    shadow = ndimage.gaussian_filter(np.roll(np.roll(outline.astype(float), size // 30, 0), size // 60, 1), size / 40)
    halo = ndimage.gaussian_filter(outline.astype(float), size / 7)
    base = np.zeros((h, w, 3)); base_a = np.zeros((h, w))
    base[:] = glow; base_a = np.clip(halo * 120, 0, 120)
    sh = np.clip(shadow * 255, 0, 230); base = base * (1 - sh[..., None] / 255) ; base_a = np.maximum(base_a, sh)
    ol = outline & ~mask; base[ol] = (34, 14, 8); base_a[ol] = 255
    out = base * (1 - mask[..., None]) + col * mask[..., None]; oa = np.maximum(base_a, a)
    rgba(out, oa).save(os.path.join(OUT, name)); print(name, w, h)

# ---------------------------------------------------------------------------- frames (nine-patch sources)
def frame(name, w, h, r, rim, inset_tint=(16, 7, 8), accent=None, gem=True):
    """Gilt frame: chamfered outer rim (beveled metal), dark glass interior with a top sheen, inner shadow."""
    S = 2; W, H, R, RIMW = w * S, h * S, r * S, rim * S
    def chamfer(x0, y0, x1, y1, c):
        return [(x0 + c, y0), (x1 - c, y0), (x1, y0 + c), (x1, y1 - c), (x1 - c, y1), (x0 + c, y1), (x0, y1 - c), (x0, y0 + c)]
    outer = Image.new('L', (W, H)); ImageDraw.Draw(outer).polygon(chamfer(0, 0, W - 1, H - 1, R), fill=255)
    inner = Image.new('L', (W, H)); ImageDraw.Draw(inner).polygon(chamfer(RIMW, RIMW, W - 1 - RIMW, H - 1 - RIMW, max(2, R - RIMW // 2)), fill=255)
    om, im = np.array(outer) > 127, np.array(inner) > 127
    ring = om & ~im
    shade, hgt = bevel(ring, RIMW * .5)
    ys = np.linspace(0, 1, H)[:, None] * np.ones((1, W)); xs = np.ones((H, 1)) * np.linspace(0, 1, W)[None, :]
    metal = np.clip(ramp(GOLD, np.clip(.05 + (1 - shade) * .55 + ys * .25, 0, 1)) * (.7 + .5 * shade[..., None]), 0, 255) if accent is None else np.array(accent)[None, None, :] * (.35 + .9 * shade[..., None])
    metal = metal * (.8 + .25 * np.sin(xs * 40 + ys * 9)[..., None] * 0)  # (reserved: brushed texture)
    # fine engraved line inside the rim
    d_in = ndimage.distance_transform_edt(im)
    groove = (d_in > 5 * S) & (d_in < 6.2 * S)
    # glass interior: vertical gradient + top sheen + inner shadow + subtle red ember at the bottom
    glass = np.zeros((H, W, 3)); glass[:] = inset_tint
    glass = glass * (1.25 - .55 * ys[..., None])
    sheen = np.clip(1 - ys / .22, 0, 1) ** 2 * 26; glass += sheen[..., None]
    ember = np.exp(-((ys - 1.05) ** 2) / .03) * np.exp(-((xs - .5) ** 2) / .2); glass += ember[..., None] * np.array([60, 8, 4])
    ishadow = np.clip(1 - d_in / (14 * S), 0, 1) ** 2; glass *= (1 - .65 * ishadow[..., None])
    glass[groove] = glass[groove] * .4 + np.array([200, 150, 80]) * .6 * .55
    rgb = np.where(ring[..., None], metal, glass); a = np.where(om, np.where(ring, 255, 236), 0).astype(float)
    # drop shadow outside the frame
    img = rgba(rgb, a)
    if gem:
        g = Image.new('RGBA', (W, H)); dr = ImageDraw.Draw(g); cx = W // 2; s = RIMW * 1.6
        for cy in (RIMW // 2, H - RIMW // 2):
            dr.polygon([(cx, cy - s), (cx + s * .8, cy), (cx, cy + s), (cx - s * .8, cy)], fill=(70, 34, 14, 255))
            dr.polygon([(cx, cy - s * .72), (cx + s * .56, cy), (cx, cy + s * .72), (cx - s * .56, cy)], fill=(190, 28, 22, 255))
            dr.polygon([(cx, cy - s * .72), (cx + s * .56, cy), (cx, cy)], fill=(255, 120, 90, 255))
        img = Image.alpha_composite(img, g)
    img = img.resize((w, h), Image.LANCZOS); img.save(os.path.join(OUT, name)); print(name, w, h)

def bezel(name, size=420):
    S = 2; N = size * S; c = N / 2
    yy, xx = np.mgrid[0:N, 0:N]; d = np.hypot(xx - c, yy - c) / c; ang = np.arctan2(yy - c, xx - c)
    ring = (d > .80) & (d < .98)
    shade, _ = bevel(ring, N * .05)
    metal = ramp(RIM, 1 - shade * .95)
    rgb = np.zeros((N, N, 3)); a = np.zeros((N, N))
    rgb[ring] = metal[ring]; a[ring] = 255
    face = d <= .80; rgb[face] = (10, 4, 5); a[face] = 245
    vign = np.clip((d - .45) / .35, 0, 1); rgb[face] = rgb[face] * (1 - .6 * vign[face, None]) + (np.array([40, 6, 5]) * (1 - vign[face, None]))
    # 60 engraved ticks on the bezel
    t = (np.mod(ang / (2 * np.pi) * 60 + .5, 1) < .12) & (d > .84) & (d < .93)
    rgb[t] = rgb[t] * .35;
    img = rgba(rgb, a).resize((size, size), Image.LANCZOS); img.save(os.path.join(OUT, name)); print(name)

def gem_tex(name, size=64):
    """faceted diamond gem, white (tinted at draw time)"""
    S = 4; N = size * S; img = Image.new('RGBA', (N, N)); dr = ImageDraw.Draw(img); c = N / 2; r = N * .46
    P = lambda *pts: [(c + x * r, c + y * r) for x, y in pts]
    dr.polygon(P((0, -1), (.8, 0), (0, 1), (-.8, 0)), fill=(150, 150, 150, 255))
    dr.polygon(P((0, -1), (.8, 0), (0, 0)), fill=(255, 255, 255, 255))
    dr.polygon(P((0, -1), (-.8, 0), (0, 0)), fill=(215, 215, 215, 255))
    dr.polygon(P((0, 1), (-.8, 0), (0, 0)), fill=(120, 120, 120, 255))
    dr.polygon(P((0, -.55), (.35, 0), (0, .2), (-.35, 0)), fill=(255, 255, 255, 120))
    img.resize((size, size), Image.LANCZOS).save(os.path.join(OUT, name))

def grain(name, size=256):
    rng = np.random.default_rng(7); n = rng.normal(128, 40, (size, size)); n = ndimage.gaussian_filter(n, .6)
    rgba(np.dstack([n, n, n]), np.full((size, size), 255)).save(os.path.join(OUT, name))

if __name__ == '__main__':
    title('RARE MINDS', 220, 'title.png')
    frame('panel.png', 192, 192, 22, 12, gem=False)
    frame('panel_red.png', 192, 192, 22, 12, inset_tint=(26, 6, 6), accent=(230, 60, 44), gem=False)
    frame('panel_ghost.png', 192, 192, 22, 12, inset_tint=(8, 14, 22), accent=(140, 200, 255), gem=False)
    frame('card.png', 160, 200, 18, 9, gem=False)
    frame('card_red.png', 160, 200, 18, 9, inset_tint=(30, 6, 6), accent=(235, 60, 44), gem=False)
    frame('card_ghost.png', 160, 200, 18, 9, inset_tint=(8, 16, 26), accent=(140, 200, 255), gem=False)
    frame('tab.png', 160, 64, 24, 6, gem=False)
    bezel('bezel.png')
    gem_tex('gem.png')
    grain('grain.png')
