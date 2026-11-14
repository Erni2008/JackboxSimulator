# Elevator — asset hand-off

The elevator system (`core/.../elevator/`) runs today on **TEMPORARY programmatic placeholders**. They exist only to
test logic, masking and layering, and the scene labels them on screen. Drop the final PNGs at the paths below and they
replace the placeholders automatically. Then re-measure `assets/elevator/elevator_geometry.json`.

| File (under `assets/`) | Size | Notes |
|---|---|---|
| `elevator/elevator_base.png` | 1920×1080 | Full cabin interior. **Doorway fully transparent.** No lit buttons painted in. |
| `elevator/elevator_door_left.png` | exact leaf size | Transparent outside the leaf. Front-on, same perspective as the doorway. |
| `elevator/elevator_door_right.png` | same as left | Must meet the left leaf with no gap (`seamOverlap` can cover 1–3 px). |
| `elevator/elevator_frame_overlay.png` | 1920×1080 | Optional. Transparent except the jamb lip that sits over the leaf edges. |
| `elevator/elevator_buttons.png` | sheet | 3 columns (idle, pressed, active) × 5 rows (floor 1 at the top row). |
| `elevator/elevator_indicator.png` | housing size | Dial housing without the needle. |
| `elevator/elevator_needle.png` | needle size | Needle pointing **up**, pivot `pivotFromBottom` px above its bottom edge. |
| `elevator/floors/floor_N_<id>.png` | 1920×1080 recommended | Scaled to cover the doorway and cropped by the mask. |

Floors: `1 grand_hall`, `2 library`, `3 broadcast_room`, `4 laboratory`, `5 final_chamber`.

Sounds are configured in the same JSON. Missing files are skipped silently, so drop the WAVs into `assets/elevator/sfx/`.

Run the scene: `./gradlew :lwjgl3:elevatorPreview`.
Screenshot every state: add `-Pel.capture=/abs/dir`.
Logic checks: `./gradlew :core:elevatorCheck`.
