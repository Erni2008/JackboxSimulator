#!/usr/bin/env python3
"""Preview/remove reproducible project outputs, preserving tracked files and all assets.
Close running project applications before --apply. Git history is never touched.
"""
from pathlib import Path
import argparse
import json
import shutil
import subprocess

ROOT = Path(__file__).resolve().parents[2]
BUILD_ROOTS = ['build', 'core/build', 'shared/build', 'server/build', 'inspector/build', 'lwjgl3/build', '.gradle']
CAPTURE_TYPES = {'.png', '.jpg', '.jpeg', '.webp', '.gif', '.mp4', '.mov', '.webm', '.zip', '.log'}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--apply', action='store_true', help='Remove the listed reproducible outputs (default: preview only).')
    parser.add_argument('--report', type=Path, help='Optional JSON audit report, preferably outside the project.')
    args = parser.parse_args()
    tracked = set(subprocess.check_output(['git', 'ls-files', '-z'], cwd=ROOT).decode().split('\0'))
    targets = []
    for relative in BUILD_ROOTS:
        path = ROOT / relative
        if path.is_symlink(): raise SystemExit(f'Refusing linked output root: {relative}')
        if path.is_dir():
            if any(p == relative or p.startswith(relative + '/') for p in tracked):
                raise SystemExit(f'Refusing output directory with tracked files: {relative}')
            targets.append(path)
    generated = ROOT / 'generated'
    if generated.is_symlink(): raise SystemExit('Refusing linked generated directory')
    for path in generated.rglob('*'):
        if path.is_symlink() or any(parent.is_symlink() for parent in path.parents if parent != ROOT): continue
        relative = path.relative_to(ROOT).as_posix()
        if path.is_file() and path.suffix.lower() in CAPTURE_TYPES and relative not in tracked:
            targets.append(path)
    for directory in (ROOT / 'tools').rglob('__pycache__'):
        if not directory.is_symlink() and not any(p.startswith(directory.relative_to(ROOT).as_posix() + '/') for p in tracked):
            targets.append(directory)
    records = []
    for path in targets:
        if not path.resolve().is_relative_to(ROOT): raise SystemExit(f'Outside project: {path}')
        files = [path] if path.is_file() else [p for p in path.rglob('*') if p.is_file() and not p.is_symlink()]
        size = sum(p.stat().st_size for p in files)
        records.append({'path': path.relative_to(ROOT).as_posix(), 'bytes': size, 'files': len(files)})
        if args.apply:
            if path.is_dir(): shutil.rmtree(path)
            else: path.unlink()
    report = {'applied': args.apply, 'bytes': sum(r['bytes'] for r in records), 'files': sum(r['files'] for r in records), 'targets': records}
    if args.report: args.report.write_text(json.dumps(report, indent=2) + '\n')
    print(('Removed' if args.apply else 'Would remove') + f" {report['files']} files, {report['bytes']/1024**3:.2f} GiB of reproducible outputs.")
    print('Preserved: tracked reports, source code, assets/, source_assets/, original models, Git history and shared Gradle dependency cache.')


if __name__ == '__main__':
    main()
