#!/usr/bin/env python3
"""Verify repository layout, relocated original bytes, offline source resolution and document links."""
from pathlib import Path
import ast
import hashlib
import importlib.util
import json
import re
from urllib.parse import unquote

ROOT = next(p for p in Path(__file__).resolve().parents if (p / 'settings.gradle').is_file())


def main():
    errors = []
    loose = [p.name for p in ROOT.iterdir() if p.is_file() and p.suffix.lower() in {'.png', '.jpg', '.wav', '.mp3', '.glb', '.blend'}]
    if loose: errors.append('Original media in repository root: ' + ', '.join(loose))
    catalog = json.loads((ROOT / 'source_assets/catalog.json').read_text())
    names = set()
    for entry in catalog['imports']:
        name = entry['originalRootPath']
        if name in names: errors.append('Duplicate source key: ' + name)
        names.add(name)
        path = ROOT / 'source_assets' / entry['path']
        if not path.is_file(): errors.append('Missing original: ' + str(path.relative_to(ROOT)))
        elif hashlib.sha256(path.read_bytes()).hexdigest() != entry['sha256']: errors.append('Original bytes changed: ' + str(path.relative_to(ROOT)))
    spec = importlib.util.spec_from_file_location('project_sources', ROOT / 'tools/assets/_sources.py')
    sources = importlib.util.module_from_spec(spec); spec.loader.exec_module(sources)
    for name in names:
        try: sources.source_path(name)
        except FileNotFoundError as error: errors.append(str(error))
    for path in (ROOT / 'tools').rglob('*.py'):
        try: ast.parse(path.read_text(), filename=str(path))
        except SyntaxError as error: errors.append(str(error))
        if path.resolve() != Path(__file__).resolve() and 'pathlib.next(' in path.read_text(): errors.append('Invalid root discovery: ' + str(path))
    documents = list((ROOT / 'docs').rglob('*.md')) + [ROOT / 'README.md', ROOT / 'PROJECT_MAP.md', ROOT / 'tools/README.md', ROOT / 'source_assets/README.md', ROOT / 'source_assets/archive/README.md', ROOT / 'assets/README.md', ROOT / 'server/README.md']
    checked = 0
    pattern = re.compile(r'!?\[[^\]]*\]\((<[^>]+>|[^\s)]+)\)')
    for path in documents:
        for match in pattern.finditer(path.read_text()):
            raw = match[1].strip('<>')
            if raw.startswith(('#', '/')) or re.match(r'[a-zA-Z][a-zA-Z0-9+.-]*:', raw): continue
            target = (path.parent / unquote(raw.split('#', 1)[0])).resolve()
            if any(part in {'generated', 'build'} for part in target.parts): continue
            checked += 1
            if not target.exists(): errors.append(f'Broken link in {path.relative_to(ROOT)}: {raw}')
    if errors: raise SystemExit('\n'.join(errors))
    print(f'PASS: clean root, {len(names)} intact original assets, offline source catalogue, Python syntax and {checked} local document links.')

if __name__ == '__main__':
    main()
