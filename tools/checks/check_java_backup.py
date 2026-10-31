#!/usr/bin/env python3
"""Verify the immutable Java/libGDX backup payload without Git or dependencies."""
import hashlib
import json
from pathlib import Path

root = Path(__file__).resolve().parents[2]
manifest = json.loads((root / 'docs/backup/java-libgdx-final-files.json').read_text())
errors = []
for item in manifest['files']:
    path = root / item['path']
    if not path.is_file():
        errors.append(f"Missing: {item['path']}")
        continue
    digest = hashlib.sha256()
    if item.get('normalizeLineEndings') == 'lf':
        data = path.read_bytes().replace(b'\r\n', b'\n')
        digest.update(data)
        size = len(data)
    else:
        with path.open('rb') as stream:
            for block in iter(lambda: stream.read(1024 * 1024), b''):
                digest.update(block)
        size = path.stat().st_size
    if size != item['bytes'] or digest.hexdigest() != item['sha256']:
        errors.append(f"Changed: {item['path']}")
if errors:
    raise SystemExit('\n'.join(errors))
print(f"BACKUP_OK: {len(manifest['files'])} files match SHA-256; "
      f"{manifest['totalBytes']} bytes verified")
