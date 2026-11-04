#!/usr/bin/env python3
"""Release compression for GLB models: re-encodes embedded opaque PNG textures as JPEG.

* Geometry, materials, node graph and texture resolution are untouched.
* Only PNGs without real transparency are converted; anything with alpha < 255 stays PNG.
* Quality per role: normal maps 95, metallic-roughness / occlusion 92, base colour 90.
* A file is rewritten only if it ends up smaller; originals stay in git history.

Usage: python3 tools/assets/compress_glb_textures.py [--dry-run] [--max-size N] PATH...
"""
import argparse, io, json, os, struct, sys
from PIL import Image

QUALITY = {'normal': 95, 'orm': 92, 'color': 90}

def roles(j):
    r = {}
    for m in j.get('materials', []):
        pbr = m.get('pbrMetallicRoughness', {})
        def mark(t, role):
            if t is None: return
            src = j['textures'][t['index']].get('source')
            if src is not None and r.get(src) != 'normal': r[src] = role
        mark(m.get('normalTexture'), 'normal'); mark(pbr.get('metallicRoughnessTexture'), 'orm'); mark(m.get('occlusionTexture'), 'orm')
        mark(pbr.get('baseColorTexture'), 'color'); mark(m.get('emissiveTexture'), 'color')
    return r

def compress(path, dry, max_size):
    d = open(path, 'rb').read()
    magic, ver, _ = struct.unpack('<III', d[:12])
    if magic != 0x46546C67: return 0, 0
    jl = struct.unpack('<I', d[12:16])[0]; j = json.loads(d[20:20 + jl]); off = 20 + jl
    bl = struct.unpack('<I', d[off:off + 4])[0]; b = d[off + 8:off + 8 + bl]
    images = {im['bufferView']: i for i, im in enumerate(j.get('images', [])) if 'bufferView' in im}
    if not images: return len(d), len(d)
    role = roles(j); out = bytearray(); changed = False
    for vi, bv in enumerate(j['bufferViews']):
        data = b[bv.get('byteOffset', 0):bv.get('byteOffset', 0) + bv['byteLength']]
        if vi in images:
            ii = images[vi]; im = Image.open(io.BytesIO(data)); im.load()
            alpha = im.mode in ('RGBA', 'LA', 'PA') and im.getchannel('A').getextrema()[0] < 255
            if im.format == 'PNG' and not alpha and 'transparency' not in im.info:
                rgb = im.convert('RGB')
                if max_size and max(rgb.size) > max_size: rgb = rgb.resize((rgb.width * max_size // max(rgb.size), rgb.height * max_size // max(rgb.size)), Image.LANCZOS)
                q = QUALITY[role.get(ii, 'color')]; o = io.BytesIO(); rgb.save(o, 'JPEG', quality=q, optimize=True, subsampling=0 if role.get(ii) == 'normal' else 2)
                if o.tell() < len(data): data = o.getvalue(); j['images'][ii]['mimeType'] = 'image/jpeg'; changed = True
        while len(out) % 4: out.append(0)
        bv['byteOffset'] = len(out); bv['byteLength'] = len(data); bv.pop('byteStride', None) if vi in images else None; out += data
    if not changed: return len(d), len(d)
    while len(out) % 4: out.append(0)
    j['buffers'][0]['byteLength'] = len(out)
    js = json.dumps(j, separators=(',', ':')).encode()
    while len(js) % 4: js += b' '
    res = struct.pack('<III', 0x46546C67, 2, 12 + 8 + len(js) + 8 + len(out)) + struct.pack('<II', len(js), 0x4E4F534A) + js + struct.pack('<II', len(out), 0x004E4942) + bytes(out)
    if len(res) < len(d) and not dry: open(path, 'wb').write(res)
    return len(d), min(len(d), len(res))

if __name__ == '__main__':
    ap = argparse.ArgumentParser(); ap.add_argument('--dry-run', action='store_true'); ap.add_argument('--max-size', type=int, default=0); ap.add_argument('paths', nargs='+'); a = ap.parse_args()
    files = [os.path.join(r, f) for p in a.paths for r, _, fs in (os.walk(p) if os.path.isdir(p) else [(os.path.dirname(p), None, [os.path.basename(p)])]) for f in fs if f.lower().endswith('.glb')]
    before = after = 0
    for f in sorted(files):
        x, y = compress(f, a.dry_run, a.max_size); before += x; after += y
        print(f'{x / 1e6:7.1f} -> {y / 1e6:6.1f} MB  {f}')
    print(f'TOTAL {before / 1e6:.1f} -> {after / 1e6:.1f} MB ({(1 - after / max(before, 1)) * 100:.0f}% smaller)')
