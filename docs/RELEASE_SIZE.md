# Release size

| | Before | After |
|---|---|---|
| `assets/` | 1.2 GB | 529 MB |
| GLB models (70) | 703 MB | 271 MB |
| PNG (496) | 464 MB | ~190 MB |
| Desktop jar | 955 MB | 447 MB |

- GLB: embedded opaque PNG textures re-encoded as JPEG at the same resolution (normal 95, ORM 92, colour 90); geometry untouched — `tools/assets/compress_glb_textures.py`.
- PNG: lossless re-compression, every file verified pixel-identical — `tools/assets/optimize_png_lossless.py`.
- `candle.blend` moved to `source_assets/` (not loaded at run time).
- Originals remain in git history (commit before this change).

- PNG > 300 KB: palette quantisation with libimagequant, applied only when ≥30 % smaller and premultiplied-RGBA PSNR ≥ 40 dB with 99.9th-percentile error ≤ 24/255 (233 files; 21 kept) — `tools/assets/quantize_png.py`.
- Question music: WAV → OGG q6 (16.5 MB → 1.2 MB); `QuestionAudio` and desktop staging point to `.ogg`. Clock/lock stay WAV (their duration is read from the WAV header).
- `low`/`mobile` THE LAST COMMAND tiers stay: desktop selects `low`, and the embedded server serves `mobile` to phones.

Further options (need code or visual sign-off): WAV → OGG (~60 MB → ~8 MB, loaders reference `.wav`), lossy PNG quantisation for large sprites, excluding browser-only `low`/`mobile` model tiers from the desktop jar.
