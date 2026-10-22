# CURSED BOXES — shooting gallery integration

The October 22 gallery images in the project root, `background1.png`, `background2.png`, `background3.png` (1672×941), are now the active environment. Runtime copies in `assets/cursed_boxes/backgrounds/` are byte-for-byte identical. `background4.png` is no longer referenced or loaded. The original models, box3 destruction, ghost3 transparency, weapon mechanics and local two-shot rules remain in use.

## Desktop-safe presentation and startup

CURSED BOXES now opens as a **borderless window filling the current monitor work area**, using logical desktop coordinates from GLFW. It does not attach the window to a monitor or request an exclusive display mode. This preserves desktop resolution, refresh rate and Retina/scaling for other applications. F11 toggles the borderless/windowed presentation; ESC restores the previous window dimensions, position, decoration/resizability and maximization. The OS retains control of its menu/Dock areas. An exclusive mode explicitly selected previously in the main game's settings remains governed by those existing settings.

`DesktopBorderless` is a desktop-only adapter installed by the main launcher and Cursed Boxes diagnostics. Core code uses `DisplayManager.Presentation`, preserving the existing settings and multiplayer boundaries. Screens reject recursive native resize/refresh renders while showing/hiding/disposing; this also prevents callbacks from advancing shot/QA timelines during display restoration.

`CursedBoxesLoadingScreen` presents a styled progress frame before loading models. One registry stage runs per loading frame; scene assembly and shader/audio warmup are separate stages. All resources still finish loading **before gameplay input**. Cancellation disposes partially loaded assets and restores the previous window. Successful completion transfers the asset registry/display session once to the cached game screen. Subsequent menu reentry reuses that screen.

The original BOLT and SHELL each contained three 4096×4096 maps, despite their small screen size. Mini-game-only runtime copies cap those maps at 1024 while preserving all non-image buffer payloads and all nodes, meshes, accessors, materials and animation metadata. BODY/PUMP retain the original 2048 maps. Calculated RGBA footprint of the four parts' embedded maps falls from roughly **480 MiB to 120 MiB before mipmaps**; this is a size estimate, not measured total GPU memory. `scripts/import_cursed_boxes_weapon_maps.py` reproduces these copies. Shared/source models remain untouched.

Measured staged ready times on this Mac were 1.39–1.75 seconds across 26 loading frames. Individual GLB stages remain synchronous because the installed GLBAssetLoader's asynchronous method does no work; BODY/PUMP stages measured approximately 180–213 ms. This removes the previous contiguous bulk-loading block and dramatically reduces texture pressure, but does not promise a 16.7-ms loading frame. GPU shader/audio warmup remains before input so the first shot stays warm.

## Stationary architecture and animated light

The three images contain small architectural differences. Long full-image crossfades produce double wall planks and a swimming counter. The background shader therefore retains frame 1's architectural detail, while crossfading the low-frequency illumination extracted from all three source images. This deliberately animates light/haze, rather than moving the room.

`scripts/import_cursed_boxes_backgrounds.py` reproducibly copies the originals and derives 209×118 RGB lighting maps (Gaussian radius 7 at that resolution). These are lighting data derived from the supplied images, not generated replacement backgrounds. The shader divides the blended light by the reference light, clamps the ratio to 0.78–1.22 and applies a configurable strength of 0.65 to the original detail. There are no double architectural edges. Warm lantern pools and restrained haze/dust complement the lighting sequence.

`assets/cursed_boxes/background.json`: 1.5-second hold, 0.5-second quintic-eased transition, brightness 0.92. Ping-pong sequence **1 → 2 → 3 → 2 → 1**, eight seconds per loop without duplicate endpoint holds. The clock is independent of weapon/turn/reset. All source textures, lightmaps and the shader are prepared before input; no loading or texture creation occurs at a transition.

Cover scaling preserves the aspect ratio and fills the display. Vertical cropping is anchored to the bottom to preserve the counter on ultrawide screens. The shelf is fitted into the remaining vertical space on wide displays. The background writes no depth. The existing SpriteBatch renders it with four texture samples per pixel, one quad per background pass, without any gameplay FBO.

## Shelf and crates

`assets/cursed_boxes/gallery.json` contains source-image pixel anchors, measured from the top left. The back-wall seam is around y=535. Following the requested larger/closer composition, the shelf feet are anchored farther onto the photographed floor at `shelfFloorY=675`; nominal shelf image height is 594 (**35% larger again than the 440-pixel revision**, including crates and ghost). The lower floor anchor leaves headroom for the complete enlarged cabinet and title. Perspective projection places the feet exactly at this floor anchor. Five shared-texture horizontal floor decals replace the previous vertical shadow strip: one broad ambient shadow, two soft support shadows, and two dense contact cores. Their positions use the actual authored support tips (left source y=1007, right y=1011), not the padded PNG edge. Contact cores start directly at each foot, removing the previous bright gap caused by the shadow being offset toward the camera. The existing 4×4 grid, crate bounds and ghost move as one group; model normalization and intact/destroyed mappings are unchanged. The shelf stands slightly forward of the rear wall, with its upper edge still below the ceiling. All 16 compartments remain visible.

There is **no shelf GLB/GLTF in the supplied project**. The existing shelf uses the authored `shelves5.png`, clipped to its exterior silhouette by `CursedBoxesShelf`, with depth-tested 3D crates. This implementation preserves that working representation. It is not a newly created 3D shelving model. The old brown rectangle remains removed without editing the original art.

Camera, shelf and crate instance transforms remain fixed while aiming/firing, as requested earlier. Selection outlines remain disabled. Weapon recoil, muzzle light and debris animate independently. Reset restores intact crates without resetting background time.

## Counter and shotgun

The source image counter top is calibrated using pixel (1060,827), virtual world z=6.0, source front edge y=884. The original modular shotgun is laid on its side with horizontal barrel direction (yaw 145°), stock nearer the camera. Its actual body/pump/bolt bounds are evaluated once at loading; the lowest point is placed exactly on the virtual table plane on resize. Weapon scale is 3.5 (25% larger than the first gallery pass); the contact shadow scales with it.

A soft, depth-tested quad from the existing VFX opacity kernel provides a contact shadow. It fades during pickup and reappears during the final part of the return. The original background's bottom strip is redrawn through a scissor rectangle after 3D/effects, providing counter-front occlusion without a second table model or a new mask image. The same lighting shader and animation time keep this strip seamless with the room.

Nonblocking weapon parent-transform states:

- **RESTING:** starts on the table, no crate preselected. Click a crate to lift.
- **PICKUP:** 0.65 seconds, quintic translation/rotation with a restrained lift arc.
- **AIMING:** 0.30 seconds; the bore line includes the source muzzle-height offset and aims at the actual compartment.
- **READY:** Space fires (Space during pickup can queue one shot until aligned). Existing recoil, muzzle flash, audio, pump and spent-shell mechanics run unchanged.
- After the first recovery, the gun remains raised. Select a different intact crate for the second shot.
- **RETURNING:** after the second 1.1-second shot sequence, 0.80-second eased return to the exact table pose. Further selection/fire is blocked by the existing two-shot turn rules.

R restores the table pose, ammo and all boxes. ESC/F11 preserve navigation and use the desktop-safe borderless presentation described above. Pickup/aim/return durations, placement, scale, and dust count are configurable in `gallery.json`.

## Character framing refinement

`gallery.json` now exposes `ghostHeight=1.18` world units, up from 1.08 (about 9% larger), applied to all three source PNG states with their original aspect ratios. The quad remains behind the same crate front and keeps genuine torso alpha. A small downward center offset (0.012 units), quieter 0.006-unit hover, 0.6-degree roll and 0.8% breathing keep the enlarged silhouette composed inside the compartment. Loading validates the complete animated envelope against the 1.24-unit compartment clearance; there are no new textures, runtime allocations, models or render passes. Destruction, immediate damaged-ghost reveal, gun/table placement and the enlarged shelf are preserved.

## Atmosphere and resources

28 slow, faint dust motes (14 with Q low effects), gently drifting floor haze, four warm lantern pools with independent interpolated-noise flicker bounded to about ±11%, warm ambient light, the existing muzzle point light and a restrained screen-space flash. No rigid-body physics, real-time shadow map, new shot-time mesh, model instance or particle system. Existing pooled four large fragments/seven small splinters/two dust bursts remain unchanged.

The shared opaque PBR pass still submits crates, weapon and 3D debris together. Ghost/debris retain depth-tested transparency. Foreground counter masking precedes UI. Background shader, source textures, three small lighting textures and contact quad are screen-owned; borrowed resources are disposed only by their owner.

## Files for this integration

Runtime Java modified: `CursedBoxesAssets`, `CursedBoxesBackground`, `CursedBoxesRoomLayout`, `CursedBoxesRenderer`, `CursedBoxesScreen`, `CursedBoxesShelf`, `ShotgunController`, `GhostController`, `DisplayManager`, `FinalAnswerGame`, desktop `Lwjgl3Launcher`.

Runtime Java added: `CursedBoxesGalleryConfig`, `CursedBoxesAtmosphere`, `CursedBoxesLoadingScreen`, desktop `display/DesktopBorderless`.

Tests updated: core `CursedBoxesBackgroundCheck`; native `CursedBoxesLauncher`, `CursedBoxesBackgroundCheck`, `CursedBoxesPerformanceCheck`, `CursedBoxesNavigationCheck`; new `CursedBoxesDisplayCheck` verifies every monitor’s mode/refresh and absence of exclusive attachment through entry/F11/restore. Configuration: `assets/cursed_boxes/background.json`, new `gallery.json`. Importers: `scripts/import_cursed_boxes_backgrounds.py`, `scripts/import_cursed_boxes_weapon_maps.py`. Source models, crate controller/state mapping, shared shotgun mechanics, other mini-games and multiplayer remain intact.

Latest build/test results: `generated/cursed-boxes/desktop-safe-performance-summary.md`; raw current profile: `generated/cursed-boxes/desktop-safe-profile.json`.

## Launch and verification

```sh
./gradlew :lwjgl3:cursedBoxes
# Or F6 from the FINAL ANSWER main menu.
```

Controls: click select/lift, Space fire, R reset, F11 borderless/windowed, F3 stats, Q effect quality, ESC previous menu.

```sh
./gradlew :core:check
./gradlew :lwjgl3:cursedBoxes -PcursedQA=true
./gradlew :lwjgl3:cursedBoxesBackgroundCheck
./gradlew :lwjgl3:cursedBoxesNavigationCheck
./gradlew :lwjgl3:cursedBoxesDisplayCheck
./gradlew :lwjgl3:cursedBoxesPerformanceCheck -PcursedCycles=20 -PcursedProfile=generated/cursed-boxes/gallery-profile.json
```

The native checks exercise real OpenGL. Gallery tests cover all ping-pong transitions, continued animation through both shots/reset, pixel blending/cover at 1920×1080 and 2560×1440, compartment composition at those resolutions plus 3440×1440/1024×768, exact tabletop contact, disappearing lifted shadow, rest/pickup/return, stronger fragment throw, source ghost alpha, two-shot exclusion, static world matrices, fullscreen and resource disposal. FBO/readbacks and glFinish measurements occur only in diagnostic tools/loading, never normal gameplay.

Current screenshots: `generated/cursed-boxes/00-counter-rest.png`, `generated/cursed-boxes/backgrounds/counter-rest.png`, `counter-pickup.png`, `gallery-aim.png`, `counter-return.png`. Measurements: `generated/cursed-boxes/gallery-performance-summary.md` (20 enlarged-scene resets / 40 shots, plus a final two-reset/four-shot regression after support-contact refinement). Hardware-specific timings are not a guarantee of 60 FPS on every laptop.

## Remaining limits

The room/counter are a 2D photograph and the current shelf is a depth-writing image silhouette, so placement/shadow/occlusion are calibrated 2.5D approximations. There is no room mesh with physically measured wall/table surfaces, nor a shelf GLB. Light-only blending intentionally keeps architectural/water-surface details from frame 1 stationary. Different GPUs require profiling; the supplied splinter geometry remains relatively dense, although only four fragments can be active per impact.
