#!/usr/bin/env python3
"""Compile when source/assets changed, otherwise launch the native viewer directly."""
from pathlib import Path
import os
import shutil
import subprocess
import sys

root = Path(__file__).resolve().parents[2]
args_file = root / 'lwjgl3/build/dev-launch/impostor-preview.args'
inputs = ['build.gradle', 'settings.gradle', 'gradle.properties', 'lwjgl3/build.gradle',
          'core/build.gradle', 'shared/build.gradle', 'server/build.gradle',
          'core/src', 'shared/src', 'lwjgl3/src', 'server/src', 'assets', 'tools/assets']


def stale():
    if not args_file.exists():
        return True
    prepared = args_file.stat().st_mtime_ns
    for relative in inputs:
        path = root / relative
        files = path.rglob('*') if path.is_dir() else [path]
        for item in files:
            if item.is_file() and item.stat().st_mtime_ns > prepared:
                return True
    return False


if stale():
    subprocess.run([str(root / 'gradlew'), ':lwjgl3:prepareImpostorPreviewLaunch', '--offline'],
                   cwd=root, check=True)
java = shutil.which('java')
if not java:
    raise SystemExit('Java is required to run Final Answer.')
os.chdir(root / 'assets')
os.execv(java, [java, *sys.argv[1:], '@' + str(args_file)])
