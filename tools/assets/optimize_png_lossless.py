#!/usr/bin/env python3
"""Lossless PNG re-compression for release. A file is replaced only when the new
encoding is smaller AND decodes to exactly the same pixels (mode, size, data)."""
import io, os, sys
from PIL import Image
before = after = 0; changed = 0
for root in sys.argv[1:] or ['assets']:
    for r, _, fs in os.walk(root):
        for f in fs:
            if not f.lower().endswith('.png'): continue
            p = os.path.join(r, f); data = open(p, 'rb').read(); before += len(data)
            try:
                im = Image.open(io.BytesIO(data)); im.load(); o = io.BytesIO(); im.save(o, 'PNG', optimize=True); new = o.getvalue()
                if len(new) < len(data):
                    chk = Image.open(io.BytesIO(new)); chk.load()
                    if chk.mode == im.mode and chk.size == im.size and chk.tobytes() == im.tobytes(): open(p, 'wb').write(new); data = new; changed += 1
            except Exception as e: print('skip', p, e)
            after += len(data)
print(f'PNG {before / 1e6:.1f} -> {after / 1e6:.1f} MB, {changed} files rewritten (pixel-identical)')
