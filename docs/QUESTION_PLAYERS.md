# Question-round character presentation

## Current behavior

The network PlayScreen shows 2–8 existing modular characters without cages in a centered top row. Nicknames use the existing heavy font, width fitting and a dark shadow. The top strip reserves 180 logical units in the existing 1600×900 FitViewport; question and answer placement leave space below it.

1. Reading the question: character rigs hold their existing idle pose at `THINKING_SCALE = 1/1.35`. There is no shivering during typing, voice/reading hold or question movement.
2. The first answer option begins appearing: PlayScreen supplies the actual `round.presentation().answerProgress(0)>0` signal. Only then do connected unanswered characters start subtle independent shivering. It fades in over 0.14 seconds; amplitude is ±0.65/±0.28 logical pixels. This uses an independent local shake clock, so it does not prematurely start the authored rig animation.
3. The server accepts a player's answer: their shiver fades out, their size eases to 1.0 over `GROW_SECONDS = 0.30` (exactly 35% larger), and their existing character idle animation starts. Other players keep thinking/shivering. Rigs are not reset or recreated. `answeringAnimationSpeed = 1.5` is question-only; lobby timing stays unchanged.
4. Deadline/reveal/results: all rig playback and shivering stop. Answered players remain large; unanswered players stay small. The existing public server results show complete mint checkmarks immediately for correct, on-time answers. No correctness information is disclosed during collection.
5. Next question: the same instances shrink, hold their current pose while the question is read, and wait for the next real option-reveal signal. Submission/correctness flags clear.

Reduced motion disables shivering and makes the size transition immediate. Scaling is uniform around the existing floor anchor; no texture stretching, neighboring-slot movement or cage changes are introduced.

## Architecture and synchronization

`CageLobby.createCharacter` reuses existing factories and shared asset ownership. Each round player has an independent rig but shares already-loaded textures/configuration and the existing presentation profile. Entrances are evaluated once offscreen to reach the existing idle pose. No image is generated or replaced, no textures load per frame or between questions, and the strip never disposes shared art/shaders. It owns only its nickname font and instance references.

`QuestionPlayerStates` reads stable player IDs, `participantIds` and existing server-accepted `hasSubmittedAnswer`. It ignores stale revisions and latches accepted flags within a question. Playback is now enabled for submitted players, replacing the earlier freeze-on-submit design at the user's request. Unsubmitted players have a separate `thinking` flag. Local deadline enforcement is latched so server-clock corrections cannot restart an ended round. Disconnected players remain visible and stationary; reconnect restores the appropriate state while the round remains active.

`QuestionPlayers.advance` advances only submitted active rigs; draw reuses `CageCharacterPresentation`, preserving Doctor/Puppeteer tone correction, coverage-aware texture filtering, straight alpha and separate doctor lantern emission. The existing white UI pixel draws the checkmark with no new asset, texture or shader. Its appearance does not restart rig animation. Actual answers remain private until the existing result reveal.

## Verification

```sh
./gradlew :core:check :server:test :lwjgl3:questionPlayersRenderCheck :lwjgl3:lobbyStartCheck
./gradlew :lwjgl3:lobbyStartCheck -PquestionPreview=true
```

- Pure checks: 2/4/6/8 stable participants, per-player accepted playback/thinking flags, stale snapshots, monotonic acceptance, deadline/clock correction, next-question reset and reconnect.
- GL checks: no movement before option reveal; shivering begins only when enabled; accepted rig grows 35% and visibly runs its idle while others remain smaller; no per-question instance replacement; pixel-identical holds after timeout; immediate result checkmark; Batch state restoration and no GL errors. Captures: ignored `generated/question-players/`.
- Native integration: real server, desktop and eight authenticated phone WebSockets. Verifies shiver timing against the production answer-progress signal, submits all eight players one by one through the normal protocol, verifies their clocks run while other rig clocks remain held, verifies timeout/results hold, and enters question two with the same rigs waiting for choices. Captures: ignored `generated/lobby-start/`.
- Interactive preview stays open; 1–8 submit a correct test answer for the corresponding player during ANSWERING. Automatic sequential answers are enabled by default; A toggles auto mode, and 1–8 submit manual answers. The next automatic player is scheduled after the previous server acceptance/growth/playback has been checked. It uses the real server submission path. These controls are development-only.

The existing 123 server tests validate submission/privacy behavior. No physical-phone, adverse WAN, long-duration memory-profile or cross-device performance benchmark is claimed.

Main production files: `QuestionPlayers.java`, `QuestionPlayerStates.java`, `PlayScreen.java`, `CageLobby.java`, `FinalAnswerGame.java`, server `RoomService.java`. Test/dev files and Gradle tasks are excluded from production player controls.

## Interactive preview hitch correction

The earlier sequential-answer preview synchronously read back and PNG-encoded the full window after each answer. This was a developer capture operation, not character scaling or texture loading. `LobbyStartCheck.shot` now immediately returns in interactive mode, including automatic answers and round transitions. Automated noninteractive visual verification still produces captures and explicitly reports their cost; its screenshot timings are not treated as gameplay performance.

Reproduction/measurement: `./gradlew :lwjgl3:lobbyStartCheck -PquestionPreview=true -PquestionPerformanceCheck=true`. This runs eight sequential real submissions, records actual native frame intervals during ANSWERING and exits with median/p95/max plus a zero-capture assertion. Normal `-PquestionPreview=true` stays open. Measurements apply only to this desktop/test workload.

Measured after disabling interactive captures: 1,270 answering frames across eight sequential submissions; median 8.75 ms, p95 11.92 ms, maximum 18.84 ms, zero captures. This does not include scene-loading frames and is not a cross-hardware benchmark.

## Russian text and color polish

The built-in question catalog/answer labels are now Russian, retaining stable IDs and correct answer indices. Cyrillic question/answer fallback uses the bundled Noto Sans SemiCondensed SemiBold face with kerning, automatic fitting and the existing shadow. `PlayerColors` supplies eight stable light nickname colors, paired with deeper inks for cage parchment. Gameplay character exposure remains unchanged; only the cage variant uses the softer lighting settings described in CHARACTER_LIGHTING.md. Launch cage motion now continues through the blackout/title handoff without a frozen interval or repeated phase reset.
