# Three animated table candles

Runtime source: all 96 original PNGs from the user's `candles` folder, copied
without modification to `frames/0001.png` through `frames/0096.png`.

`TableCandle.java` displays these frames in numerical order at 24 FPS, looping
after 4 seconds. Every frame contains all three candles. Textures are prepared
at 384 × 384 during loading (54 MiB instead of 216 MiB of GPU memory); original
files are retained at their full resolution. Frames are uploaded once, never
loaded from disk during animation.

Warm tabletop lighting, individual flame halos and contact shadows are rendered
in background coordinates to stay aligned when resizing the game window.
The table is part of a flat background; these are composited light effects.

The blend file, standalone candle images, and `scripts/render_candle.py` belong
to the earlier single-candle preparation and are not used by the runtime animation.

Placement and timing: `core/src/main/java/com/erni/finalanswer/ui/effects/TableCandle.java`.
Preview: `generated/candle/menu-preview.png`.
