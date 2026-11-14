"""Builds the processed elevator assets for the FLOOR 1 -> FLOOR 2 transition from the user's source folder.

    python3 tools/assets/elevator/build_floor1_2.py

Sources (never modified): elevator_animation1floor/ and elevator_animation1floor/elevator_assets_PRO/.
Output: assets/elevator/... and assets/backgrounds/play/questions_03_04/library.png.

What it does, and why:
* Interior: the PRO set is a pixel-verified reconstruction of elevator_interior.png (1536x865): base with a true
  transparent doorway + two opaque door leaves. Used as-is, except the floor dial's painted needle is removed
  (horizontal interpolation across the 1-px needle and its shadow) so the animated needle is the only one visible.
* Buttons: each round button is cut from the original interior with a feathered circular mask, for an additive
  illumination overlay that sits exactly on the painted button.
* Needle: a small brass needle sprite, coloured from the painted needle, pivot at its bottom.
* Grand Hall: the gameplay background 01.1.png shows the elevator CLOSED and image.png is the very same painting with
  the elevator OPEN (outside the doorway they differ only by compression noise). The supplied elevator_door_left/right
  sprites are pixel-identical crops of 01.1.png but cover only ~87 of the ~110 px of each leaf, so the leaves are
  extracted directly from 01.1.png at full size, and the cabin revealed behind them is the same rectangle of image.png.
  Closed, the leaves reproduce the gameplay background exactly; open, they reveal the user's painted cabin, aligned.
* Library: library_full.png (closed doors, matches the room) becomes the floor-2 gameplay background.
"""
import json, os, shutil
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../..'))
SRC = os.path.join(ROOT, 'elevator_animation1floor')
PRO = os.path.join(SRC, 'elevator_assets_PRO')
OUT = os.path.join(ROOT, 'assets/elevator')

# --- measured geometry (image top-left, source pixels) ---
INTERIOR_DOORWAY = (558, 224, 427, 463)            # PRO elevator_geometry.json, verified against the base alpha
NEEDLE_PIVOT = (1293, 161)                          # hub centre of the floor dial in elevator_original.png
NEEDLE_PATCH = (1291, 121, 1297, 143)               # x0,y0,x1,y1 inclusive: painted needle + its shadow
BUTTONS = {5: (1297, 240), 4: (1297, 297), 3: (1297, 353), 2: (1297, 408), 1: (1297, 465)}
BUTTON_R = 21
HALL_DOORS = (723, 334, 220, 294)                   # Grand Hall leaves in 01.1.png (1672x941): x 723..942, seam column 833, y 334..627
HALL_SEAM = 833


def ensure(p):
    os.makedirs(os.path.dirname(p), exist_ok=True)
    return p


def remove_needle(img):
    a = np.asarray(img).astype(np.float32).copy()
    x0, y0, x1, y1 = NEEDLE_PATCH
    left, right = x0 - 1, x1 + 1
    for y in range(y0, y1 + 1):
        for x in range(x0, x1 + 1):
            t = (x - left) / (right - left)
            a[y, x, :3] = a[y, left, :3] * (1 - t) + a[y, right, :3] * t
    # a very light blur only inside the patch hides the interpolation seams
    patch = Image.fromarray(a.astype(np.uint8)).crop((x0 - 2, y0 - 2, x1 + 3, y1 + 3)).filter(ImageFilter.GaussianBlur(.6))
    out = Image.fromarray(a.astype(np.uint8))
    m = Image.new('L', patch.size, 0)
    ImageDraw.Draw(m).rectangle((2, 2, patch.width - 3, patch.height - 3), fill=255)
    out.paste(patch, (x0 - 2, y0 - 2), m)
    return out


def button_crop(orig, cx, cy, r):
    s = r * 2 + 8
    crop = orig.crop((cx - s // 2, cy - s // 2, cx - s // 2 + s, cy - s // 2 + s)).convert('RGBA')
    mask = Image.new('L', (s * 4, s * 4), 0)
    ImageDraw.Draw(mask).ellipse((4 * (s / 2 - r), 4 * (s / 2 - r), 4 * (s / 2 + r), 4 * (s / 2 + r)), fill=255)
    mask = mask.resize((s, s), Image.LANCZOS).filter(ImageFilter.GaussianBlur(1.2))
    crop.putalpha(mask)
    return crop


def needle_sprite(orig):
    # colour taken from the brightest painted needle pixels
    a = np.asarray(orig.convert('RGB')).astype(int)
    col = a[124:156, NEEDLE_PIVOT[0]]
    bright = col[col.sum(1).argsort()[-6:]].mean(0)
    w, h, scale = 9, 44, 4                          # drawn at 4x, downsampled for clean anti-aliasing
    im = Image.new('RGBA', (w * scale, h * scale), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    cx = w * scale / 2
    shadow = (20, 10, 4, 170)
    d.polygon([(cx + 3, 4), (cx + 9, h * scale - 18), (cx - 3, h * scale - 18)], fill=shadow)
    body = (236, 178, 92, 255)                      # warm brass, like the dial numerals (the painted needle reads near-white)
    d.polygon([(cx, 0), (cx + 6, h * scale - 20), (cx - 6, h * scale - 20)], fill=body)
    d.line([(cx, 6), (cx, h * scale - 24)], fill=(255, 240, 200, 200), width=2)
    hub = (h * scale - 16)
    d.ellipse((cx - 14, hub - 14, cx + 14, hub + 14), fill=(110, 62, 24, 255))
    d.ellipse((cx - 9, hub - 9, cx + 9, hub + 9), fill=body)
    return im.resize((w, h), Image.LANCZOS), (w / 2, h - 4)  # pivot inside the sprite (x from left, y from bottom)


def main():
    report = {}
    orig = Image.open(os.path.join(PRO, 'elevator_original.png')).convert('RGBA')
    base = Image.open(os.path.join(PRO, 'elevator_base.png')).convert('RGBA')
    # validate the PRO claim: base == original outside the doorway
    ab, ao = np.asarray(base).astype(int), np.asarray(orig).astype(int)
    outside = ab[..., 3] == 255
    report['pro_base_vs_original_max_diff_outside_doorway'] = int(np.abs(ab[outside, :3] - ao[outside, :3]).max())
    hole = np.argwhere(ab[..., 3] < 10)
    report['pro_doorway_alpha_bbox'] = [int(hole[:, 1].min()), int(hole[:, 0].min()), int(hole[:, 1].max() - hole[:, 1].min() + 1), int(hole[:, 0].max() - hole[:, 0].min() + 1)]

    cabin = remove_needle(base)
    cabin.save(ensure(os.path.join(OUT, 'interior/cabin_base.png')))
    for side in ('left', 'right'):
        shutil.copyfile(os.path.join(PRO, f'door_{side}.png'), ensure(os.path.join(OUT, f'interior/door_{side}.png')))
    for n, (cx, cy) in BUTTONS.items():
        button_crop(orig, cx, cy, BUTTON_R).save(ensure(os.path.join(OUT, f'interior/button_{n}.png')))
    needle, pivot = needle_sprite(orig)
    needle.save(ensure(os.path.join(OUT, 'interior/needle.png')))

    # Grand Hall: leaves cut from the closed painting, cabin view cut from the open one (same rectangle)
    closed = Image.open(os.path.join(ROOT, 'assets/backgrounds/play/questions_01_02/01.1.png')).convert('RGBA')
    opened = Image.open(os.path.join(SRC, 'image.png')).convert('RGBA')
    x, y, w, h = HALL_DOORS
    closed.crop((x, y, HALL_SEAM + 1, y + h)).save(ensure(os.path.join(OUT, 'floors/grand_hall/door_left.png')))      # includes the seam line
    closed.crop((HALL_SEAM, y, x + w, y + h)).save(ensure(os.path.join(OUT, 'floors/grand_hall/door_right.png')))
    opened.crop((x, y, x + w, y + h)).save(ensure(os.path.join(OUT, 'floors/grand_hall/cabin_view.png')))
    a_, b_ = np.asarray(closed.convert('RGB')).astype(int), np.asarray(opened.convert('RGB')).astype(int)
    m = np.ones(a_.shape[:2], bool); m[y:y + h, x:x + w] = False
    report['grand_hall_closed_vs_open_mean_diff_outside_doors'] = round(float(np.abs(a_ - b_)[m].mean()), 2)
    report['grand_hall_closed_vs_open_mean_diff_inside_doors'] = round(float(np.abs(a_ - b_)[~m].mean()), 2)

    lib = os.path.join(ROOT, 'assets/backgrounds/play/questions_03_04/library.png')
    Image.open(os.path.join(SRC, 'library_full.png')).convert('RGB').save(ensure(lib), optimize=True)

    report['needle_pivot_px'] = list(NEEDLE_PIVOT)
    report['needle_sprite_pivot'] = list(pivot)
    print(json.dumps(report, indent=1))


if __name__ == '__main__':
    main()
