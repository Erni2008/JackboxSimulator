"""Lossless GLB runtime copies: 16-bit mesh partitions, byte-identical embedded maps.
Original root GLBs remain untouched. No simplification, compression extensions or texture resizing.
Run: python3 tools/assets/prepare_last_command.py
"""
from pathlib import Path
import copy, hashlib, json, struct
import numpy as np
ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'assets/models/last_command'
TYPES = {5120: '<i1', 5121: '<u1', 5122: '<i2', 5123: '<u2', 5125: '<u4', 5126: '<f4'}
COUNTS = {'SCALAR': 1, 'VEC2': 2, 'VEC3': 3, 'VEC4': 4}

def prepare(name):
    raw = (ROOT / name).read_bytes()
    length, = struct.unpack_from('<I', raw, 12)
    source = json.loads(raw[20:20+length])
    data = raw[28+length:]
    assert not any(source.get(k) for k in ('skins', 'animations'))
    assert len(source['buffers']) == 1
    doc = copy.deepcopy(source)
    doc['bufferViews'] = []; doc['accessors'] = []
    binary = bytearray()
    def view(payload, target=None):
        binary.extend(b'\0' * (-len(binary) % 4))
        result = {'buffer': 0, 'byteOffset': len(binary), 'byteLength': len(payload)}
        if target is not None: result['target'] = target
        index = len(doc['bufferViews']); doc['bufferViews'].append(result); binary.extend(payload)
        return index
    def read(index):
        accessor = source['accessors'][index]; v = source['bufferViews'][accessor['bufferView']]
        dtype = np.dtype(TYPES[accessor['componentType']]); width = COUNTS[accessor['type']]
        return np.ndarray((accessor['count'], width), dtype=dtype, buffer=data,
            offset=v.get('byteOffset', 0)+accessor.get('byteOffset', 0),
            strides=(v.get('byteStride', dtype.itemsize*width), dtype.itemsize)).copy()
    def write(array, old=None):
        attribute = copy.deepcopy(old) if old else {'componentType': 5123, 'type': 'SCALAR'}
        attribute.pop('byteOffset', None); attribute.pop('sparse', None)
        attribute['count'] = len(array)
        attribute['bufferView'] = view(array.tobytes(), 34962 if old else 34963)
        if old and ('min' in old or 'max' in old):
            attribute['min'] = array.min(axis=0).tolist(); attribute['max'] = array.max(axis=0).tolist()
        index = len(doc['accessors']); doc['accessors'].append(attribute)
        return index
    triangle_count = 0; primitive_count = 0
    for mesh_index, mesh in enumerate(source['meshes']):
        output = []
        for primitive in mesh['primitives']:
            assert primitive.get('mode', 4) == 4 and not primitive.get('targets')
            attributes = {k: read(v) for k, v in primitive['attributes'].items()}
            indices = read(primitive['indices']).reshape(-1, 3)
            triangle_count += len(indices)
            remap = {}; used = []; local = []
            # Verify ordered triangle attributes exactly, rather than relying on bounding boxes.
            expected = {k: hashlib.sha256(v[indices.reshape(-1)].tobytes()).hexdigest() for k, v in attributes.items()}
            actual = {k: hashlib.sha256() for k in attributes}
            def flush():
                if not local: return
                p = copy.deepcopy(primitive); selected = np.array(used, dtype=np.int64)
                local_array = np.array(local, dtype='<u2')
                p['attributes'] = {}
                for semantic, values in attributes.items():
                    packed = values[selected]
                    actual[semantic].update(packed[local_array].tobytes())
                    p['attributes'][semantic] = write(packed, source['accessors'][primitive['attributes'][semantic]])
                p['indices'] = write(local_array.reshape(-1, 1))
                output.append(p)
            for triangle in indices:
                keys = [int(x) for x in triangle]
                if len(remap) + sum(key not in remap for key in set(keys)) > 65535:
                    flush(); remap = {}; used = []; local = []
                for old in keys:
                    if old not in remap: remap[old] = len(used); used.append(old)
                    local.append(remap[old])
            flush()
            assert all(actual[k].hexdigest() == expected[k] for k in actual), 'Geometry changed'
        doc['meshes'][mesh_index]['primitives'] = output
        primitive_count += len(output)
    maps = []
    for index, image in enumerate(source.get('images', [])):
        v = source['bufferViews'][image['bufferView']]
        payload = data[v.get('byteOffset', 0):v.get('byteOffset', 0)+v['byteLength']]
        doc['images'][index]['bufferView'] = view(payload)
        maps.append(hashlib.sha256(payload).hexdigest())
    binary.extend(b'\0' * (-len(binary) % 4))
    doc['buffers'] = [{'byteLength': len(binary)}]
    encoded = json.dumps(doc, separators=(',', ':')).encode(); encoded += b' ' * (-len(encoded) % 4)
    result = struct.pack('<III', 0x46546c67, 2, 28+len(encoded)+len(binary)) + struct.pack('<II', len(encoded), 0x4e4f534a) + encoded + struct.pack('<II', len(binary), 0x004e4942) + binary
    (OUT / name).write_bytes(result)
    print(name, len(raw), '->', len(result), 'bytes;', triangle_count, 'triangles;', primitive_count, '16-bit primitives; all attributes and maps unchanged')
    return {'source': name, 'sourceSha256': hashlib.sha256(raw).hexdigest(), 'runtimeSha256': hashlib.sha256(result).hexdigest(), 'sourceBytes': len(raw), 'runtimeBytes': len(result), 'triangles': triangle_count, 'primitives': primitive_count, 'imageSha256': maps}

if __name__ == '__main__':
    OUT.mkdir(parents=True, exist_ok=True)
    manifest = [prepare(name) for name in ('box_final.glb', 'hole_final.glb', 'button.glb')]
    (OUT / 'preparation.json').write_text(json.dumps(manifest, indent=2)+'\n')
