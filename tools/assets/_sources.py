"""Canonical paths for offline asset tools. Never imported by the game or server."""
from pathlib import Path
import json

PROJECT_ROOT = next(p for p in Path(__file__).resolve().parents if (p / 'settings.gradle').is_file())
_CATALOG = json.loads((PROJECT_ROOT / 'source_assets/catalog.json').read_text())
_IMPORTS = {entry['originalRootPath']: PROJECT_ROOT / 'source_assets' / entry['path'] for entry in _CATALOG['imports']}

def source_path(original_filename):
    """Keep supplied filenames stable while locating their organized original copies."""
    if original_filename not in _IMPORTS:
        raise FileNotFoundError(f'No original registered for {original_filename!r}; see source_assets/catalog.json')
    path = _IMPORTS[original_filename]
    if not path.is_file():
        raise FileNotFoundError(f'Missing original asset: {path}')
    return path
