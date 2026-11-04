# Release size

| | Before | After |
|---|---|---|
| `assets/` | 1.2 GB | 740 MB |
| GLB models (70) | 703 MB | 271 MB |
| PNG (496) | 464 MB | 425 MB |
| Desktop jar | 955 MB | 573 MB |

- GLB: embedded opaque PNG textures re-encoded as JPEG at the same resolution (normal 95, ORM 92, colour 90); geometry untouched — `tools/assets/compress_glb_textures.py`.
- PNG: lossless re-compression, every file verified pixel-identical — `tools/assets/optimize_png_lossless.py`.
- `candle.blend` moved to `source_assets/` (not loaded at run time).
- Originals remain in git history (commit before this change).

Further options (need code or visual sign-off): WAV → OGG (~60 MB → ~8 MB, loaders reference `.wav`), lossy PNG quantisation for large sprites, excluding browser-only `low`/`mobile` model tiers from the desktop jar.
