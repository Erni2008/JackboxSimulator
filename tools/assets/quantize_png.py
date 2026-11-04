#!/usr/bin/env python3
"""Lossy-but-guarded PNG palette compression (libimagequant, the pngquant engine).
A file is replaced only if it shrinks by >= 30 % AND stays visually faithful:
premultiplied-RGBA PSNR >= 40 dB and 99.9th-percentile channel error <= 24/255.
Usage: python3 tools/assets/quantize_png.py [--dry-run] [--min-kb 300] PATH..."""
import argparse, io, os
import numpy as np, imagequant
from PIL import Image

def metrics(a, b):
    a = np.asarray(a.convert('RGBA'), np.float32); b = np.asarray(b.convert('RGBA'), np.float32)
    pa = np.concatenate([a[..., :3] * a[..., 3:] / 255, a[..., 3:]], -1); pb = np.concatenate([b[..., :3] * b[..., 3:] / 255, b[..., 3:]], -1)
    d = np.abs(pa - pb); mse = (d ** 2).mean(); psnr = 99 if mse == 0 else 10 * np.log10(255 ** 2 / mse)
    return psnr, np.percentile(d, 99.9)

ap = argparse.ArgumentParser(); ap.add_argument('--dry-run', action='store_true'); ap.add_argument('--min-kb', type=int, default=300); ap.add_argument('paths', nargs='+'); a = ap.parse_args()
before = after = 0; kept = done = 0
for root in a.paths:
    for r, _, fs in os.walk(root):
        for f in sorted(fs):
            if not f.lower().endswith('.png'): continue
            p = os.path.join(r, f); size = os.path.getsize(p)
            if size < a.min_kb * 1024: continue
            before += size
            try:
                im = Image.open(p); im.load(); src = im.convert('RGBA')
                q = imagequant.quantize_pil_image(src, dithering_level=1.0, max_colors=256, min_quality=80, max_quality=98)
                o = io.BytesIO(); q.save(o, 'PNG', optimize=True); new = o.getvalue()
                psnr, p999 = metrics(src, Image.open(io.BytesIO(new)))
                ok = len(new) <= size * .7 and psnr >= 40 and p999 <= 24
                if ok and not a.dry_run: open(p, 'wb').write(new)
                after += len(new) if ok else size; done += ok; kept += not ok
                print(f"{'Q' if ok else '-'} {size/1e6:5.2f}->{len(new)/1e6:5.2f} psnr {psnr:5.1f} p99.9 {p999:5.1f}  {p}")
            except Exception as e: after += size; kept += 1; print('skip', p, e)
print(f'TOTAL {before/1e6:.1f} -> {after/1e6:.1f} MB; quantized {done}, kept {kept}')
