# THE IMPOSTOR: completion without an intermediate results screen

## Actual integration

The existing server state machine still calculates the immutable `ImpostorMatchResult` after the identity animation. Its internal RESULT state remains a terminal server record, **not a results-screen instruction**. RoomService now emits `IMPOSTOR_COMPLETED` once instead of `IMPOSTOR_UPDATED` for this transition. Personalized snapshots carry `impostor.completed: true`, `continuation: "UNASSIGNED"`, and the existing immutable result. Existing connections, IDs, room identity, settings, ownership and spectator membership are preserved.

The host adapter projects a completed record onto the final identity scene; it never enters the RESULT presentation. The previous identity phase's authoritative timestamp is retained as `identityRevealStartedAt`, preventing delayed nickname replay on reconnect. ImpostorScreen no longer opens the lifecycle statistics/results panel. Phones also retain the existing identity scene, clearing/hiding personal victory, winning side, statistics and waiting-for-host elements. No new screen is created and no menu/lobby/replay is automatically triggered. A reconnect sees the completed snapshot and the same final scene.

## Next-stage boundary and limitation

This repository currently has two mutually exclusive sessions: main trivia `GameSession` and `ImpostorSession`. It has no overall Final Answer stage sequencer that selects a stage after THE IMPOSTOR. Therefore this change does **not** invent the next mode. After automatic completion, the final identity scene remains visible without controls or a waiting overlay until a real continuation is integrated.

The existing server event is the continuation boundary. Server-side `RoomService.completedImpostorResult(code)` returns the immutable archived outcome, which survives closing the mini-session. Existing authenticated, host-only START_GAME can now enter the existing main game after completion; it still rejects an active mini-match. Existing host/phone QUESTION_STARTED routing then opens the normal main-game UI. This path is tested, but is not automatically invoked because no next-stage selection policy exists. Future orchestration can consume IMPOSTOR_COMPLETED and use the existing game-start mechanism. No generic completion callback framework or placeholder stage was added.

Global authenticated replay/lobby commands remain compatible; they are no longer offered by this intermediate completion scenario. Automated multi-match QA uses these commands explicitly to arrange independent cases, not as automatic product behavior. The unrelated main game's results UI is unchanged. No force-winner/skip-voting action was introduced; an ordinary host SYNC can deliver a due authoritative completion and is covered by a test.

## Files changed by this task

- `server/src/main/java/com/finalanswer/server/rooms/RoomService.java`: completion event, archive accessor, metadata, safe handoff to existing START_GAME.
- `server/src/main/java/com/finalanswer/server/game/ImpostorSession.java`: retains the identity phase start timestamp; outcome logic unchanged.
- `core/src/main/java/com/erni/finalanswer/network/ImpostorSuspicionAdapter.java`: terminal record uses existing identity presentation.
- `core/src/main/java/com/erni/finalanswer/impostor/ImpostorScreen.java`: removes automatic live results panel activation.
- `web/final-voting.js`, `web/index.html`: suppresses intermediate results for everyone, including reconnect; cache version updated.
- `tools/checks/check_impostor_lifecycle_browser.cjs`, `tools/checks/check_desktop_hosting_browser.cjs`: updated expected completion UI.

Created: `server/src/test/java/com/finalanswer/server/ImpostorCompletionTest.java`, this document.

## Validation

`./gradlew :server:test :lwjgl3:classes` passed; updated server suite has 111 tests, zero failures/errors. New cases cover both winning sides, no submitted votes, tied submitted votes, 3/4 active participants and spectators, one completion event per connection, stable room/membership, reconnect, host-triggered delivery of a due completion, rejecting early continuation and retaining the immutable result after entering the existing main game.

Real Chromium/server lifecycle QA passed six consecutive matches: three with 3 active + 3 spectators and three with 4 active + 2 spectators. All outcomes passed. Assertions verify hidden personal results, statistics, winning-side/waiting elements and vote confirmation after completion, including refresh. Existing role/clue/vote synchronization and protocol replay/lobby compatibility are exercised. Physical phones/Safari were not tested.

Launch `./gradlew :lwjgl3:run`, create a room and finish THE IMPOSTOR. After the impostor nickname reveal, no summary screen or replay/lobby buttons should appear. Phones remain connected on the identity scene. Refresh phone pages after restarting to obtain the updated final-voting.js.

Native-host validation also passed: four actual libGDX/owned-server matches (3,3,4,4 active participants plus spectators), real phone UI submissions/votes, all result categories including submitted-vote tie, refresh and temporary socket disconnect after completion, stable six participant IDs and room code. Host screenshots `lwjgl3/build/desktop-hosting-qa/match-1-completion.png` through `match-4-completion.png` show the identity scene and no results panel; match-1 screenshot manually inspected. These QA matches explicitly exercise legacy replay/lobby APIs between cases; product completion itself triggers neither. Native QA exited cleanly and its owned port was released (`report.json`: four matches, no browser errors, portReleased true).
