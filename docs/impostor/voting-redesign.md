# Voting ceremony redesign

The voting presentation has been rebuilt; the existing room artwork, round table,
chairs, lamp, wall decorations, clock, character rigs and original textures are preserved.

## Rendering investigation and fixes

The room is presented through a background image and animated character actors in a
libGDX Scene2D/SpriteBatch scene. Voting parchments are sprites, not 3D mesh materials.

Three concrete faults were found:

1. `FinalVotePresentation.update` reduced whole card-group alpha to **0.55 / 0.65**
   for some outcomes. This faded the paper together with its contents. Whole-card
   fading is removed, including from entrance animations. Only intentional portrait
   ghost effects can fade; parchment and ink remain opaque.
2. Both the source and prepared parchment have intact interior alpha **252–254**,
   rather than 255. `VotingResources` supplies a scoped straight-alpha paper shader
   that restores alpha above 0.94 to 1. Lower-alpha torn edges and holes are preserved.
   No original PNG has been modified or replaced.
3. `ImpostorCharacterActor` inherited the previous actor's SpriteBatch tint. A black
   room shade or brown rule could darken characters. Character drawing now establishes
   its own tint and restores the incoming packed color and transform afterward.

The paper actor saves/restores shader, RGB/alpha blending factors, blend enablement,
and batch color. It does not change depth testing or depth writing. Portrait cropping
uses balanced scissor push/pop operations. There is no premultiplied-alpha conversion;
these remain straight-alpha PNGs. The character grading renderer's existing shader
and blend restoration is retained.

A pixel regression renders the same paper over magenta and cyan backgrounds:
its interior must be identical, while the torn corner must expose different backgrounds.
A second regression verifies that a real character produces identical pixels when the
incoming batch color is black or white, and restores the incoming state.

## Composition

- **Player zone:** evenly spaced, proportionally scaled original characters; a common
  name baseline; readable Cyrillic names; restrained identity-colored rules. Old clue
  parchments and redundant elimination captions are hidden only during the ceremony.
- **Announcement:** native-resolution horror display type, aged ivory, a dark shadow,
  restrained bronze ornaments, and one explanatory sentence. English/Russian copy
  uses the existing `Localization` bundles. Ties never single out a player. No votes
  is a separate state; a condemned innocent is shown only when the server identifies
  a single accused player different from the impostor.
- **Table zone:** consistent dossiers with centered names, cropped character portraits,
  contact shadows made from the existing paper silhouette, and individual crimson ink
  marks. Two through six players use one row; seven/eight use two equal-sized rows.
  Layout uses the existing 1920×1080 FitViewport coordinate system with safe margins.
- **Controls:** local sound/subtitle controls live in an on-demand settings panel.
  They, development hints, obsolete countdowns, and the old full-screen death popup
  do not obscure the ceremony. Existing keyboard actions remain available internally.

The final presentation uses two font families already in the project: Rubik Wet Paint
for headlines and Noto Sans for names/supporting copy. Font textures are generated at
up to 2× density for Retina and scaled down, rather than enlarging small bitmap text.

## Timeline and data integrity

Animation is derived from server timestamps, not local queues or game-rule callbacks:

- Room lighting transition: 650 ms; maintained across ceremony phase changes.
- Card starts: 650 ms + 90 ms per card; placement lasts 420 ms with slight rotation
  and a small landing movement. The paper does not fade.
- Stamp lead: 1700 ms; individual vote contacts every 400 ms, at 220 ms within each
  cycle. Each contact reveals exactly one supplied imprint and invokes one sound
  callback. The final hold is 800 ms.
- Identity verdict respects the existing 3400 ms musical identity accent. Text has
  eased entrance/exit timing. Restored snapshots reveal already-existing ink without
  replaying its history; pause/resume also avoids stale impact sounds.

`RoomService` → `ImpostorSuspicionAdapter` → `FinalActSnapshot` remains the data path.
Imprints are built from the authoritative `stampTargets` list and grouped by stable
player ID. Rotations are deterministic decoration; they do not change outcomes.

**Live gameplay still uses its existing 3–4-active-player rule.** The results renderer
and presentation fixtures accept **2–8 players**. Server eligibility, role assignment,
tallying, tie decisions, and multiplayer progression were not expanded or replaced.

## Files changed for this redesign

| File | Responsibility |
|---|---|
| `core/.../impostor/FinalVotePresentation.java` | Ceremony, localized result semantics, authoritative animation |
| `core/.../impostor/VotingLayout.java` | Safe layout for 2–8 presentation participants |
| `core/.../impostor/VotingCard.java` | Opaque dossier, portrait clipping, shadows, stamp placement |
| `core/.../impostor/VotingResources.java` | Owned fonts, Retina density, scoped paper shader |
| `core/.../impostor/ImpostorCharacterActor.java` | Batch tint restoration and optional bust framing |
| `core/.../impostor/ImpostorParticipantView.java` | Ceremony player row and name treatment |
| `core/.../impostor/ImpostorScreen.java` | Scene integration, control routing, lifecycle/disposal |
| `core/.../impostor/ImpostorPresentationSettings.java` | On-demand local sound/subtitle controls |
| `core/.../impostor/FinalActSnapshot.java` | Presentation validation range, 2–8 |
| `core/.../impostor/RoleDeal.java` | Bounded eight-slot presentation compatibility |
| `shared/.../impostor/FinalRevealTiming.java` | Shared presentation timing, no vote-rule changes |
| `assets/i18n/messages.properties`, `messages_ru.properties` | Result localization |
| `lwjgl3/.../VotingRedesignCheck.java` | Real-character geometry, pixel/state, Retina and performance verification |
| `lwjgl3/.../ImpostorCheck.java` | Updated integration assertions for the new presentation |
| `lwjgl3/.../ImpostorPreviewData.java` | 2–8-player development rosters |
| `lwjgl3/.../ImpostorFinalPreview.java` | Consistent development result fixtures |
| `lwjgl3/.../ImpostorPreviewLauncher.java` | Clean preview window title |
| `lwjgl3/build.gradle` | `votingRedesignCheck` task |
| `tools/checks/check_impostor_browser.cjs` | Multiplayer timing assertion |
| `docs/impostor/README.md`, `show-polish.md`, this report | Current behavior and verification |

Here `core/...` expands to `core/src/main/java/com/erni/finalanswer`, `shared/...`
to `shared/src/main/java/com/erni/finalanswer/gameplay`, and `lwjgl3/...` to the
corresponding `src/dev/java/com/erni/finalanswer/lwjgl3` or test directory.
Earlier unrelated workspace changes were preserved.

## Verification

```sh
./gradlew :lwjgl3:votingRedesignCheck :lwjgl3:impostorCheck :core:check :server:test --offline
```

The dedicated check covers 2–8 players × five scenarios × four resolutions:
1920×1080, 1600×900, 1366×768, 1280×720. It includes long Cyrillic names,
no votes, zero-vote players, distributed votes, ties, correct/incorrect accusations,
rotated card/stamp bounds, exact imprint/sound counts, duplicate snapshots,
render-state restoration, opacity pixels, and pause/resume.

Three real multiplayer matches (caught, escaped and tied outcomes) are also exercised
by `check_impostor_browser.cjs` with `IMPOSTOR_FINAL_QA=1`.

Generated captures and machine-readable measurements are in
`lwjgl3/build/voting-redesign/`. The real-window sample uses 180 measured frames each
for four and eight characters after warm-up. On the verification machine it ran at
approximately 60 FPS in 2× Retina mode; this is a local measurement, not a guarantee
for every GPU. Managed texture counts remain stable after all eight original character
assets have warmed. Core checks also exercise the other minigames.

For manual inspection: `./gradlew :lwjgl3:impostorPreview`. F runs the sequence;
1/2/3 select development verdicts; F6 cycles presentation roster sizes; F10 opens
local sound settings. These shortcuts are not printed over the production scene.

Selected previews and a copy of the measurement report are preserved under
`generated/voting-redesign/`. For a direct result preview:

```sh
./gradlew :lwjgl3:impostorPreview -PimpostorSkipOpening=true -PimpostorVerdict=tie
```
