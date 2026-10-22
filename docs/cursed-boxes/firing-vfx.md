> Оригиналы, ранее находившиеся в корне, теперь размещены в `source_assets/cursed_boxes/`, `source_assets/shotgun/` и `source_assets/audio/`. Актуальные пути и исходные имена: [каталог](../../source_assets/catalog.json). Рабочие пути внутри `assets/` сохранены.

# CURSED BOXES firing effects

The common `CursedBoxesScreen.trigger()` starts audio/weapon firing, pooled VFX and camera shake on the same frame. The original 30 ms impact timeline still destroys the selected box and invokes its existing character reaction. Multiplayer, manual input and the nine-shot developer mode share this path.

## Resources and placement

- `assets/cursed_boxes/effects/muzzle_flash.png` is an unmodified copy of root `вспышка.png`.
- `assets/cursed_boxes/effects/gun_smoke.png` is an unmodified copy of root `вспышка2.png`.
- Both sources are 1536 × 1024 RGBA, alpha range 0–254, with real transparent outer backgrounds. No chroma key, checkerboard removal or character image modifications were applied. The supplied smoke includes authored glowing embers.
- `ModularShotgun.muzzle()` transforms the existing configurable local `[0.65, 0.206, 0]` point through the animated weapon pose. The flash follows this point throughout recoil. Its source left-edge emission point is offset to meet the barrel; its screen rotation follows the projected bore direction.
- Four smoke decals capture the muzzle at firing, then expand and drift independently into world space. Five sparks reuse the already loaded soft effect texture.

## Timing and rendering

Flash lasts 80 ms. Smoke lifetimes range from 1.2 to 1.65 seconds. Sparks last 190 ms. Existing recoil is retimed to a 90 ms kick and 350 ms eased recovery, with increased rearward travel and upward pitch. It remains part of the existing model pose hierarchy, separate from the weapon's base transform.

Camera shake lasts 160 ms and temporarily translates only the rendering camera. The exact unshaken position is restored in a finally block after every render; orientation is unchanged. Selection and weapon aiming run before the offset.

The existing pooled warm point light follows the animated muzzle and uses the 80 ms flash envelope. Existing shelf pulse and subtle background tint are preserved. The photographic background cannot receive real geometry lighting; the existing tint is its approximation.

Transparent decals use alpha blending, depth testing and disabled depth writes. CameraGroupStrategy orders the small VFX batch. The scene's legacy procedural flash is disabled, while weapon preview defaults retain it.

Resources are loaded during scene assembly and submitted during loading warmup. No textures, meshes, materials, particle objects or vectors are allocated per shot. The pool owns ten decals and one batch. State advances INACTIVE → FLASHING → SMOKING → FINISHED; each shot restarts it. Reset/hide clears effects, light and camera shake. Textures and batch are disposed at unload.

## Verification

Run:

```
./gradlew :core:check :server:test :lwjgl3:devClasses
./gradlew :lwjgl3:cursedBoxesCharacters -PcursedCharacterQA=true :lwjgl3:cursedBoxes -PcursedQA=true
```

The native character test verifies exactly nine shots, eight persistent revealed characters, one empty compartment, seven intact boxes, resource stability, zero gameplay shader/texture/static-buffer uploads, reset and disposal. The normal native check also fires at all sixteen targets, preserving two-shot rules through a reset between target cases. It captures flash and smoke under `generated/cursed-boxes/`.

A live phone/browser round is a separate integration check and is not implied by the server tests. CPU submission measurements are diagnostic and do not establish performance on every GPU or against a baseline.

## Changed files

New: `CursedShotgunVfx.java`, the two packaged effect PNGs, and this document.

Updated: `CursedBoxesScreen.java` (shared trigger/lifecycle), `CursedBoxesRenderer.java` (VFX pass/light reset), `ShotgunController.java` (timing/strength), `CinematicCameraController.java` (temporary visual shake), `ShotgunAnimator.java` (recoil envelope), `ShotgunRenderer.java` (optional legacy effects), and `CursedBoxesLauncher.java` (captures/all-target native regression). Native QA also refreshes the existing generated screenshots and character performance JSON.
