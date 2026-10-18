# THE IMPOSTOR — Stage 3: synchronized paper reveal

## Implementation

All active papers now start FACE_DOWN using `papper_player_back.png`. Both original paper textures remain in the existing asset registry and asset scope. They are 1120×1404 RGBA; transparency, proportions, positions and source PNGs are unchanged. No texture or font is created during a flip.

`PaperFlipState` defines FACE_DOWN, FLIPPING_TO_FRONT, FACE_UP and FLIPPING_TO_BACK. `PaperRevealController` owns one visual clock for the whole screen. It is updated exactly once per rendered frame, and every existing ImpostorParticipantView consumes the same state, progress, side and revealed-slot count. There are no per-player delays, independent timers or scheduled callbacks.

Each direction takes 0.50 seconds. Normalized time p is clamped to [0,1]; the horizontal scale is abs(cos(pi × smootherstep(p))), with an exact zero at p=0.5. It stays nonnegative, so the text and front image are never mirrored. The existing paper Group scales around its center origin, leaving its center stationary and its vertical scale/rotation unchanged. It switches sides at 0.25 seconds without crossfading. At the midpoint the surface has zero apparent width, so its absence from that exact screenshot is expected.

The two Image actors and three clue Labels are children of the same paper Group. Before midpoint on a reveal, only the back is drawn and all text is hidden. After midpoint only the front is drawn, and slots below the accepted reveal count become visible together with it. The exact edge-on frame hides text. During a return flip, front/text contract first; at midpoint the back replaces them and the ink disappears. Missing front artwork also suppresses its text. No substitute paper or character images are used.

## Public trigger API and identity binding

Render-thread calls on ImpostorScreen:

- `revealClues(Map<String,String>)`: stage one clue per active stable player ID and begin the common reveal.
- `flipPapersBack()`: begin the common return flip between rounds.
- `resetPapers()`: cancel any animation, clear all slots and restore the first-round start.
- `paperState()` and `revealedRoundCount()`: inspect the visual sequence.

These methods have no dependency on keyboard input, a server or a protocol. A future authoritative adapter can marshal a reveal event onto the existing libGDX render thread and call the same API. No network messages were added. The shared ImpostorPhase/ImpostorState remain untouched; this controller handles paper presentation only, without implementing gameplay-phase transitions or production round timers.

Each group is named and associated using `RoomSession.Player.id()`. Frame nickname text is still taken from the actual Player assigned to that group, and clue maps are keyed by the same ID. It is not bound to the row number, sample nickname or character art. The regression explicitly reorders participants and replaces their names, then checks both the new frame names and the correct ID-bound clues. This supports future assignment of different players to each cell.

## Three rounds and request policy

- First reveal: show slot one.
- Return to back, then second reveal: show slots one and two.
- Return to back, then third reveal: show all three; remain face-up.
- No fourth round is accepted. A return request after round three is ignored until reset.

The accepted round counter advances when a reveal begins; visibility still waits for the front half. Previously revealed slots are retained across return flips. New clues are staged only in the next slot. Initial participant fixture records have three empty slots; the deterministic words exist only in the dev source set and are supplied one round at a time.

Conflicting requests are ignored with a false return value: reveal while flipping or already face-up, redundant return while face-down/flipping, or reveal after round three. There is no queue, so repeated R presses cannot secretly advance a later round. Missing IDs, null values and blank clues become `—`, never invented words. Unknown player IDs are rejected before accepting a reveal; an adapter must supply only the configured active identities. A null map is invalid API input. Long words retain the previous centered Cyrillic-capable Noto Sans layout and shrink to fit the padded writing area.

Replacing the active roster through setParticipants intentionally resets the visual sequence and rebuilds only participant actors, using existing textures/fonts. Reset during either flip is immediate and deterministic. Resize preserves progress and center. Hidden cached screens retain the sequence without advancing it; application pause freezes it. Reentry resumes the retained presentation. Large positive deltas, including positive infinity, finish the current flip safely. Negative and NaN deltas are ignored.

## Development preview

```sh
./gradlew :lwjgl3:impostorPreview
```

- F3: three active sample participants, fresh sequence.
- F4: four active sample participants, fresh sequence.
- R: reveal the next clue round when papers are down.
- B: return all papers to the back after round one or two.
- N: cancel/reset to the initial face-down state; the next R reveals round one.
- ESC: return to the existing menu, including during a flip.

Full demonstration: R → wait 0.5s → B → wait 0.5s → R → wait → B → wait → R. After the third reveal use N to restart. These shortcuts and the sample words remain in `lwjgl3/src/dev/java`, outside production main outputs. The preview requires no server.

The interrogation room, ambient illumination, portrait frame layout, nickname plates, clock, fixed arrow and static timer values have not been redesigned or repositioned. Real portrait textures remain unavailable, so the existing empty decorative frames remain in use.

## Files created

- core/src/main/java/com/erni/finalanswer/impostor/PaperFlipState.java
- core/src/main/java/com/erni/finalanswer/impostor/PaperRevealController.java
- docs/IMPOSTOR_STAGE_3.md

## Files modified

- core/src/main/java/com/erni/finalanswer/impostor/ImpostorScreen.java
- core/src/main/java/com/erni/finalanswer/impostor/ImpostorParticipantView.java
- lwjgl3/src/dev/java/com/erni/finalanswer/lwjgl3/ImpostorPreviewData.java
- lwjgl3/src/dev/java/com/erni/finalanswer/lwjgl3/ImpostorPreviewLauncher.java
- lwjgl3/src/test/java/com/erni/finalanswer/lwjgl3/ImpostorCheck.java

The asset registry/loader, PNGs, shared models, Gradle configuration, server, browser controller, main menu, room creation and production PLAY flow were not modified. No dependencies or animation framework were added. All actors borrow textures/fonts from the existing owners; the controller owns no disposable resources.

## Verification

Final successful verification:

```sh
./gradlew :lwjgl3:classes :lwjgl3:devClasses :lwjgl3:testClasses :core:roundCheck :core:clockCheck :server:test :lwjgl3:impostorCheck :lwjgl3:playCheck
./gradlew :lwjgl3:impostorPreview
```

Compilation passed, existing round/clock checks passed, and all 24 server tests passed (23 RoomServiceTest, one TransportTest; zero failures/errors/skips). The existing graphical PLAY regression passed. The actual Stage 3 dev launcher opens and reports 23/23 textures loaded. Main outputs contain neither the preview fixture nor its keyboard handlers. All 23 PNGs still match their untouched root originals by SHA-256.

The extended real OpenGL check passes both participant counts, initial back/hidden ink, exact shared scale/state, first-half privacy, precise midpoint side switch, no negative scale/mirroring or in-plane rotation, stationary centers, front completion at 0.50s, exactly one/two/three accumulated clues, hidden future slots, reverse flips, no fourth round, repeated/conflicting command rejection, reset during a flip, missing clues, long words, player rename/reassignment, resize and cached reentry during a flip, ESC during a flip and final resource disposal. Timeline checks cover frame-step equivalence, invalid deltas and large stalls. Normal rendering allocates no paper textures/fonts, and managed texture counts return to the application baseline after disposal.

The degraded-resource regression simulates missing front/other assets plus a corrupt back PNG. It logs six expected failures, loads the remaining 17/23 textures, completes the reveal without crashing and keeps unavailable front ink hidden. The scope still releases every successful texture.

In addition to deterministic checkpoints, the test runs complete three-round sequences for three and four participants in the actual OpenGL render loop using normal frame deltas, including the return flips. This verifies full playback beyond compilation or still screenshots. Final aesthetic/motion approval remains with the user; no claim of perfect animation quality is based on screenshots alone.

During development, test compilation initially failed because new helpers called findActor on Actor instead of Group; the helper types were corrected. A later lifecycle check exposed GLFW synchronously reentering the test's render method during a native window resize and replaying scripted commands. The graphical harness now guards against that reentry. Final verification has no unresolved failure.

## Screenshots

Thirty development-only framebuffer captures were generated under:

`lwjgl3/build/impostor-check/screenshots/stage3/`

For both `3players` and `4players`, at 1920×1080, 1280×720 and 1024×768:

- `{count}-initial-back-{resolution}.png`
- `{count}-flip-midpoint-{resolution}.png`
- `{count}-round-1-{resolution}.png`
- `{count}-round-2-{resolution}.png`
- `{count}-round-3-{resolution}.png`

The initial state, edge-on midpoint, first and third reveals for four players were inspected, along with the three-player second reveal and the four-player third reveal at 1024×768. They show the expected accumulated text, clear clock/timer separation, readable unmirrored fronts and centered letterboxing. Exact target sizes use offscreen OpenGL framebuffers to avoid OS window-size limits; the lifecycle test also requests a native 1024×768 window resize. No screenshots enter production assets.

## Remaining limits

This is a 2D horizontal-scale projection, without real perspective, sound, network synchronization or automatic round timing. Rendering may skip intermediate poses during a frame stall, but ends on the correct face and clue count. Small papers/nameplates and exceptionally long words become less readable at low resolutions; the existing geometry is preserved as requested. Real avatars still need supplied artwork and a resolver. Roster replacement is an explicit reset, not a reconnect/state-restoration protocol. No Stage 4, suspicion/voting, role assignment, phone input, dictionary validation or other mini-game mechanics were implemented.
