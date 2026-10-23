#!/usr/bin/env python3
"""Verify the real desktop archive contains every staged resource and each prepared replacement."""
from pathlib import Path
import argparse
import hashlib
import re
import zipfile

ROOT = next(p for p in Path(__file__).resolve().parents if (p / 'settings.gradle').is_file())


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('archive', nargs='?', type=Path)
    args = parser.parse_args()
    archive = args.archive or max((ROOT / 'lwjgl3/build/libs').glob('FinalAnswer-*.jar'), key=lambda p: p.stat().st_mtime)
    staged = ROOT / 'lwjgl3/build/runtime-assets'
    with zipfile.ZipFile(archive) as jar:
        names = set(jar.namelist())
        assert len(names) == len(jar.namelist()), 'Duplicate archive entries'
        paths = {str(p.relative_to(staged)) for p in staged.rglob('*') if p.is_file() and p.name != 'assets.txt'}
        manifest = jar.read('assets.txt').decode().splitlines()
        assert manifest == sorted(paths), 'Distribution manifest differs from staged resources'
        for name in paths:
            expected = hashlib.sha256((staged / name).read_bytes()).digest()
            assert hashlib.sha256(jar.read(name)).digest() == expected, f'Missing/changed resource: {name}'
        for line in jar.read('runtime/sizes.properties').decode('ISO-8859-1').splitlines():
            if not line or line.startswith('#'):
                continue
            name = line.split('=', 1)[0]
            name = re.sub(r'\\u([0-9a-fA-F]{4})', lambda m: chr(int(m[1], 16)), name)
            name = re.sub(r'\\([ :=#!\\])', r'\1', name)
            assert name not in names and 'runtime/' + name in names, f'Redundant/missing texture: {name}'
        assert not any(name.endswith(('.blend', '.blend1')) for name in names), 'Editor model files in distribution'
        for name in ('shotgun_bolt.glb', 'shotgun_shell.glb'):
            assert jar.read('models/shotgun/' + name) == (ROOT / 'assets/cursed_boxes/shotgun' / name).read_bytes()
        print(f'PASS: {len(paths)} exact runtime resources, sorted manifest, no redundant UI originals/editor models, validated weapon replacements; {archive.stat().st_size / 1048576:.2f} MiB archive')


if __name__ == '__main__':
    main()
