# THE PUPPETEER — implementation and verification

Implemented inside Final Answer's existing `CageCharacter` / `CageLobby` system. The room screen, eight stable assignments, clipping, cage/gate art, background, names and other character animators are unchanged. `puppeteer` uses the existing `characterId` field and join/reconnect flow; no new network messages or per-frame synchronization were added.

## Files

Created in `core/src/main/java/com/erni/finalanswer/ui/lobby/cages/`:

- `PuppeteerConfig.java`: validated source-pixel pivots, attachment offsets, ordering, contours and animation settings.
- `PuppeteerAssets.java`: shared lazy textures, load-time contour masks, isolated eyeballs and alpha-correct texture minification.
- `PuppeteerSkeleton.java`: per-instance parent matrices and transform offsets.
- `PuppeteerAnimator.java`: per-instance state machine, seeded weighted scheduler, independent eyes and procedural pose layers.
- `PuppeteerStrings.java`: curved cords from stationary suspension points to transformed bone attachments, with damped slack.
- `PuppeteerCharacter.java`: existing Batch rendering contract, secondary fabric response and Batch-state restoration.

Also created `assets/lobby/characters/puppeteer/puppeteer_config.json`, fourteen unchanged PNG sources, `PuppeteerCheck.java`, development-only `PuppeteerStudioLauncher.java` and `PuppeteerLobbyCheck.java`, this document and captures/alpha data in `generated/puppeteer-preview/`.

Modified `CageLobby.java` for registration, asset ownership and pointer tracking; `LobbyPanel.java` and `web/index.html` for selection; server `RoomService.java` for the existing character allowlist and `RoomServiceTest.java` for reconnect coverage; `core/build.gradle` / `lwjgl3/build.gradle` for checks and previews.

## Actual supplied art and limitations

Every available file was inspected visually and programmatically. All fourteen runtime files have genuine RGBA transparency and visible pixels. Alpha statistics are in `generated/puppeteer-preview/asset-validation.json`. Originals are not overwritten, recolored, regenerated or color-keyed.

Original imports are organized under `source_assets/lobby/`; active runtime source paths begin `assets/lobby/characters/puppeteer/`:

| Original filename | Actual content and use |
| --- | --- |
| `puppet1.png` | Head, mask, neck, **integrated hat and hair**, empty eye/mouth areas. One head sprite; no separate hat bone or texture. |
| `puppet2.png` | Amber eyeball with a much larger decorative housing/ribbons. Only an elliptical eyeball region is retained in the load-time alpha mask. |
| `puppet3.png` | Dark glass eyeball with housing/ribbons. Similarly isolated, independently animated. |
| `puppet4.png` | Combined upper/lower mechanical grin. Limited rigid hinge/translation; not a truly articulated jaw. |
| `puppet5.png` | Red nose with surrounding decorations, scaled to the actual nose attachment. |
| `puppet7.png` | Separate ribbon/hair cluster, attached behind the head with damped secondary motion. |
| `puppet8.png` | Torso with integrated shoulder sleeves, brass buttons and joints. Decorations are not duplicated. |
| `puppet10.png` | A complete arm **already including a hand**. A source-coordinate contour retains only the arm down to the wrist. It supplies the screen-left arm. |
| `pupper9.png` | The separately supplied opposite arm; its original spelling is preserved. Its integrated hand is masked out and replaced with the matching independent hand. |
| `puppet11.png`, `puppet12.png` | Two complete legs including shoes and joints; each moves as a rigid leg. |
| `puppet13.png`, `puppet14.png` | Independent rigid clawed hands replacing the hand integrated into `puppet10.png`. |
| `puppet15.png` | Suspension mechanism with many painted cords and ribbons. Only the crossbar contour is retained; long active cords are procedural. |

No separate hat is loaded. The opposite arm was supplied as **`pupper9.png`**, and the spare mechanical-component sheet as **`pupet16.png`**. The real second arm is now used; the spare sheet remains in `source_assets/lobby/puppeteer/` because the character already includes its joints. No duplicate decorations are drawn.

Sources 4, 9 and 10–15 contain painted brown background haze despite having alpha. Configured **nonrectangular source contours** remove the external haze at load time. Eyeballs use a feathered elliptical alpha mask. The original alpha is retained inside those contours; no background color threshold or rectangular transparency cut is used. These are cached in-memory transparent versions, not modified original files. Fine ribbon/cuff edges use manually calibrated contours; source exports with perfectly isolated silhouettes would improve close-up art fidelity.

A single grin image cannot provide independent upper/lower jaw articulation, a genuinely closed mouth, or physical tooth separation. `CLOSED`, `SMILE`, `OPEN`, `LAUGH`, `TWITCH` currently select restrained rigid mouth offsets/hinge motion. For a full jaw, supply registered upper-jaw, lower-jaw and dark cavity layers. The hands have no isolated fingers: reaching/threat gestures use the whole hand/wrist/arm, not fake finger stretching. New configured child nodes can be attached to either wrist for future separated fingers. Full-leg artwork is intentionally not bent at its painted knee.

## Assembly and rendering

The torso owns the head, shoulders/arms and hips/legs. Eyes, mouth, nose and extra ribbon cluster inherit the head matrix. Each independent hand inherits its arm, with their own wrist registration. Source pixels map to local coordinates through a uniform `artScale`; all PNG aspect ratios are preserved. Origins are near the neck, shoulder, wrist and hip attachments rather than image centers.

Legs and arms render behind the torso's existing sleeves/coat, hands over their arm ends, ribbons behind the head, then head, eyes, grin and nose. The suspension stays in character-root space and is not rotated with the torso. Cords use the current bone matrix to calculate each end, so raising/rotating a hand cannot detach its string. Slack decreases on upward pulls and follows with exponential damping. The cords are one cached quad mesh drawn with the existing Batch; no ShapeRenderer begin/end interrupts gameplay rendering.

The amber eye uses its original texture and existing restrained color pulse. The redundant additive iris pass was removed during the lighting correction; neither wood, cloth nor eyes receive additive lighting. Character textures now share coverage-weighted mipmaps and trilinear minification. Every lobby draw starts with the existing default Batch shader and straight-alpha blending, then restores the incoming shader, blend enable/factors, transform and color. See `CHARACTER_LIGHTING.md`.

## Animation

- `INTRO`, default 6.5 seconds, starts once per new character assignment: short whole-rig fade-in (0.08–0.9 seconds), then downturned freeze; gradual tightening/head lift; staggered eye focus/head snap; increasing amber intensity and raised hand; theatrical grin/shoulder response; eased return to IDLE.
- `IDLE`: overlapping irregular torso/head waves, asymmetric arms/wrists/shoulders, restrained rigid-leg orientation changes and damped ribbon lag. Independent eyes choose timed targets; the amber eye follows the pointer in the actual lobby, while the dark eye sometimes ignores it and otherwise follows more slowly.
- `WALK`: optional in-place preview using uneven rigid-leg strides, weight shifts and lagging arms/head. It does not move a player out of their cage.
- `LAUGH`: adjustable `laughIntensity`, mouth hinge cycles, head-back/side tilt, synchronized shoulder/body pulses and amber emphasis. No sound is played; `stateTime()` is available for future sound synchronization.
- `SCARE`: explicit API/debug trigger only; forward focus, fast head tilt, outward reaching arms, limited jaw gesture and maximum iris intensity. Never selected by the random scheduler.
- `LOOK_AT_PLAYER`, `BROKEN`, `STRING_PULL`: explicit focus, asymmetric dropped posture and upward string-pull states.

Seven weighted idle behaviors: HEAD_SNAP, DIRECT_STARE, BROKEN_PUPPET, SILENT_LAUGHTER, STRING_PULL, FINGER_THREAT (rigid wrist reach), FALSE_DEACTIVATION. Only one is active; major states suppress these behaviors, immediate repetitions are excluded, and each behavior has an eased return/cooldown. Random values are sampled only for scheduled targets/events. Each instance has independent seed, clocks, pose buffers, springs and cords.

All updates use delta time. The animator runs at 120 fixed steps/second with accumulated remainder and uses preallocated pose buffers. Ordinary state blends default to .22 seconds. API examples:

```java
puppet.animator().play(PuppeteerAnimator.State.LAUGH);
puppet.animator().laughIntensity = 0.8f;
puppet.animator().play(PuppeteerAnimator.State.SCARE); // manual only
puppet.animator().trigger(PuppeteerAnimator.Behavior.HEAD_SNAP); // accepted only in IDLE
puppet.animator().lookAt(normalizedX, normalizedY);
```

There are no existing gameplay requirements/events for these special animations; they are exposed through this API and the development studio. Selecting the character automatically plays INTRO and IDLE. Refreshing/reconnecting the same roster keeps its current instance; leaving clears it; reassignment creates a new entrance. No other character's animation is restarted.

## Configuration

Edit `assets/lobby/characters/puppeteer/puppeteer_config.json`:

- `parts`: source number, parent, X/Y, source-pixel pivot, uniform art scale, inherited uniform `scale`, alpha, visibility, rotation, mirror, order and optional polygon matte.
- `strings`: bone-local endpoints and stationary suspension anchors.
- `idleBodyDegrees`, `idleHeadDegrees`: ambient amplitudes.
- `behaviorMin`, `behaviorMax`, `behaviorWeights`: cooldown and seven behavior weights in enum order.
- `introSeconds`, `laughSeconds`, `scareSeconds`, `blendSeconds`: state/blend durations.
- `quality`: cord segment count, 3–24 (default 12).
- `lobbyX`, `lobbyFloor`, `lobbyScale`: character placement only; cage layout is unchanged.

`animator.speed` adjusts playback. Changing source contours or rendering order requires constructing/reloading assets/rig. Config is shared read-only in production; every instance's mutable pose remains independent.

## Testing

Select **The Puppeteer** in the existing web controller selector or native join character cycle.

```sh
./gradlew :core:puppeteerCheck
./gradlew :lwjgl3:puppeteerStudio
./gradlew :lwjgl3:puppeteerStudio -PpuppeteerCheck=true
./gradlew :lwjgl3:puppeteerLobbyCheck
./gradlew :lwjgl3:puppeteerPreview
```

Studio controls (development source set only, excluded from production jars): I intro, L laugh, S scare, W walk/stop, O stare, B broken, U string pull, 1–7 individual behaviors, E eye tracking, M ambient idle, +/- playback speed, Space pause, K bones, P pivots, T cord attachments. Tab selects a bone; arrows edit its live local attachment, brackets rotate it. Changes are session-local; persist calibrated values in JSON manually.

Verified:

- Java compilation; CPU checks at 30/60/144 FPS, all eight states/seven behaviors, blend continuity, pause and independent instances.
- Actual OpenGL studio with eight simultaneous characters, all states/behaviors, transformed cord endpoints, restored Batch state and no GL errors; screenshots reviewed for idle/intro/scare and assembly.
- Actual production lobby with eight Puppeteers, roster refresh, leave/rejoin, repeated joins, stable remaining player slots, three resolutions (1600×900, 960×540, 1024×768), and all existing characters together.
- Existing core checks and server test suite (118 tests, zero failures/errors), including the new selection/reconnect regression.

A sustained performance benchmark across supported hardware and a multi-device live session were not run. GPU captures and eight-instance rendering passed on this machine; this is not a hardware-wide 60 FPS guarantee. Source limitations above remain explicit.
