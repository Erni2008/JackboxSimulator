# Desktop-safe Cursed Boxes — final verification

Device: Apple M4; framebuffer: 2880x1608; 20 resets / 40 shots / 6000 measured frames.

Serialized diagnostic CPU submission + GPU completion wait: median 6.249 ms, p95 9.600 ms, maximum 14.025 ms. First-shot window maximum 4.694 ms. Vsync/presentation and loading excluded. These measurements describe this machine/run, not a universal frame-rate guarantee.

During gameplay: 0 shader compilations, 0 texture uploads, 0 static mesh uploads. Model counts [8]; managed texture counts [15]; GC 0 collections. Heap 20.53–21.79 MiB. Native shutdown verified complete managed-texture disposal.

Startup: 1.386–1.752 seconds across 26 presented loading frames in the recorded standalone/menu runs. Largest model stages ~180–213 ms; scene assembly ~143–167 ms; final GPU/audio warmup ~49–79 ms. There is no old full-size-asset baseline timing; the reliable improvement is removal of exclusive mode changes, reduced texture footprint and separated/pre-game loading stages. Loading is not claimed to hold 60 FPS.

The original embedded weapon maps imply about 480 MiB RGBA without mipmaps; the mini-game copies imply 120 MiB. Only BOLT/SHELL maps change from 4096 to 1024. Source BODY/PUMP maps and all four original source files remain unchanged. A byte comparison verified all non-image payloads and all nodes, meshes, accessors, materials and animation metadata in both runtime copies.

Passed checks:

- `:core:check` — existing core gameplay/animation/shotgun/turn/background suites.
- `:lwjgl3:assemble` — desktop application artifact.
- `:lwjgl3:cursedBoxesDisplayCheck` — monitor mode 1470x956@60 unchanged across borderless entry, both F11 toggles and restore; no exclusive monitor attachment; original window dimensions, position and decorations restored.
- `:lwjgl3:cursedBoxes -PcursedQA=true` — staged loading, 16 ray-picked slots, aligned source model bounds, direct source BOX3/GHOST3, genuine torso alpha, two distinct shots, overlap/third-shot rejection, weapon return, F3/F11/reset, GL and disposal.
- `:lwjgl3:cursedBoxesNavigationCheck` — real menu entry, cancellation after partial model loading with no resource growth, ready handoff, Escape/display/input restoration, cached reentry and room isolation.
- `:lwjgl3:cursedBoxesBackgroundCheck` — stable architecture, ping-pong illumination, cover/blend 1920x1080/2560x1440, layout 3440x1440/1024x768, exact table/support contacts, fixed camera/shelf/crate transforms, animation continuity during firing/reset.
- `:lwjgl3:cursedBoxesPerformanceCheck -PcursedCycles=20` — latest 40-shot stress run above.

Technical limits: the existing shelf is the authored shelves5.png silhouette with 3D crates, not an available shelf GLB. Room/table contact and shadows are calibrated 2.5D approximations. Borderless presentation fills the OS work area; menu/Dock policy belongs to the OS. Existing exclusive mode explicitly chosen in main game settings is preserved separately. Individual GLB decode/upload stages still occupy the render thread during loading; all finish before gameplay. Other GPUs/desktop scaling/multiple physical monitors still need hardware-specific testing.
