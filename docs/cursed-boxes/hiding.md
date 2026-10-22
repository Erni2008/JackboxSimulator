# Cursed Boxes: hiding and survival

The shelf contains 16 boxes (row-major IDs 0–15). The phone shows a 4×4 grid.

## Authoritative flow

After a trivia result hold, `NEXT_READY` uses the server's answer records: incorrect/missing answers receive HIDING, correct answers receive SHOOTING. This currently groups all eligible incorrect respondents into one round. A round requires both roles. If everyone is correct or nobody can shoot, the existing question flow continues; choosing a shooter in an all-incorrect round remains a game-design decision.

Standalone lobby launch is a practice setup: the first joined player hides and remaining players shoot. It does not claim to derive roles from a trivia result.

`HIDING_SELECTION` precedes shooting. Draft phone choices are local. `CURSED_HIDE {roomCode, sessionId, boxId}` confirms a hiding place on the server. Confirmations are final; repeating the same confirmation is harmless. A conflicting change, occupied hiding place, invalid index, wrong role, stale session, or firing before the lock is rejected. Multiple hiders must use different boxes to preserve the existing one-character-per-compartment renderer.

No hiding location is randomly generated. The round waits for every remaining hider to confirm, including disconnected players who can reconnect. Explicit room leavers forfeit; their unconfirmed choices do not block the round. No new timeout/forfeit rule is inferred for a disconnected player.

Each correct respondent has exactly one shot in a trivia round. Standalone practice retains two shots. The existing host-only started/impact/complete acknowledgements and durable request IDs remain unchanged. Only the occupant of the impacted box is eliminated; destroying an empty box does not eliminate anybody. The final survivor mask contains only confirmed hiding assignments whose owners were not eliminated. The existing sequential panel fade and character animation use that mask and preserve previous destruction/reveals.

The trivia timer is suspended while the mini-game is active. Returning after its completion applies elimination to the room roster, excludes eliminated players from subsequent answer requirements, and advances the existing question lifecycle. Early return cannot bypass a trivia mini-game. Standalone practice can still return to the lobby.

## Privacy and rendering

Phones receive their own `role`, `canHide`, `hidingConfirmed`, and `hidingBoxId`. Another player's hiding box is absent from their snapshots. Neither anonymous room views nor phones receive `hostContents`. Intact public boxes have no occupant/empty fields. Survivor contents retain the existing progressively disclosed reveal timing.

Only the authenticated desktop host receives `hostContents`; its controller applies newly confirmed assignments before damage or survivor presentation, including after reconnect. Assignments do not depend on camera position or animation timing. No models, textures, weapon animations, damage effects, or sound assets were changed by this update.

## Validation

Run:

```sh
./gradlew :server:check :core:check :shared:check :lwjgl3:assemble --offline
```

Native/browser integration (two terminals):

```sh
./gradlew :lwjgl3:cursedBoxesPhoneCheck --offline
PLAYWRIGHT_MODULE=/path/to/playwright CHROME_PATH=/path/to/chrome node tools/checks/check_cursed_boxes_browser.cjs
```

The browser script exercises real phone UI/WebSockets and the real libGDX screen. It checks the secret confirmation, reconnect, 16 compartments, correct hidden character placement, two empty shots followed by survivor reveal, a second round with an occupied hit and no survivor, preserved visible hit character, reset isolation, sound counts, and no per-frame GPU loading. Artifacts are under `lwjgl3/build/cursed-phone-check/`; `hiding-report.json` records the result and `native-hider-survived.png` captures the completed survivor reveal.

`CursedBoxesTest` covers role/phase validation, privacy, immutable confirmation, duplicate fire requests, reconnect, all sixteen hiding positions, multiple hiders, survival and elimination, plus trivia role assignment and return. `TransportTest` also drives the complete trivia→hiding→shooting→survivor→next-question flow through real HTTP/WebSocket connections.

## Files changed

- `server/.../game/CursedBoxesSession.java`: roles, confirmed hiding map, lock, privacy, survivor eligibility.
- `server/.../rooms/RoomService.java`: trivia handoff, authenticated hide command, paused trivia, completion/resume.
- `server/.../game/GameSession.java`: exclude eliminated participants from subsequent questions.
- `core/.../cursedboxes/CursedBoxesMultiplayerController.java`: live confirmed assignments and hiding gate.
- `shared/.../protocol/CursedBoxesCinematicConfig.java`: sixteen-box configuration.
- `web/cursed-boxes.js`: separate secret hiding confirmation and shooting controls.
- `server/.../CursedBoxesTest.java`, `server/.../TransportTest.java`: authoritative logic and real transport coverage.
- `tools/checks/check_cursed_boxes_browser.cjs`: updated real browser/native two-round validation.
- `docs/cursed-boxes/hiding.md`: protocol, lifecycle, limitations and reproducible checks.

No production classes or assets were added.

## Full four-player audiovisual test

```sh
./gradlew :lwjgl3:cursedBoxesFullRoundCheck --offline
PLAYWRIGHT_MODULE=/path/to/playwright CHROME_PATH=/path/to/chrome node tools/checks/check_cursed_full_round.cjs
```

This launches the real question presentation, submits two incorrect and two correct answers from four independent phone controllers, confirms hiding boxes 5 and 10, fires one shot per correct player (occupied box 5, empty box 0), and verifies Ghost eliminated / Puppeteer survived. The original shell insertion animation now runs in trivia rounds instead of silently refilling the chamber; shot completion waits for the existing mechanism to settle. The ejected original shell remains visible long enough to reach the configured scene floor, settles using its transformed bounds, and sounds once on contact. All eight WAV cues are asserted. Practice and the nine-shot developer test retain their existing cycling behavior.

The native window stays open with the surviving animated Puppeteer. Close it to finish the test process. Use `KEEP_OPEN=0` for an unattended run. Reports and screenshots are in `lwjgl3/build/cursed-full-round/`.

Latest executed full-round result: PASS, 701 audited native frames, 10 muzzle-flash frames, 217 shell-insertion animation frames. Audio counts: SHOT=2, MECHANISM=4, SHELL_DROP=2, WOOD_BREAK=2, HEARTBEAT=1, REVEAL_START=1, REVEAL_COMPLETE=1, INSERT_ROUND=2. Both shots observed flash and reload. Server suite: 131 tests, zero failures. Gradle server/core/shared checks and desktop assemble completed successfully.

## Live player-side review

Set `REVIEW_PLAYERS=1` when running `tools/checks/check_cursed_full_round.cjs`. After the real question and authoritative role assignment, automation stops before hiding choices and disconnects its phone clients. Test identities are stored only in the ignored build directory with owner-only permissions. Then run `node tools/dev/review_cursed_players.cjs` and open the URL printed in its output.

The developer viewer displays four original phone controllers side by side, each authenticated with its own session. Hiders choose/confirm manually; shooters remain locked until all hiders confirm, then get one shot each. The existing native window displays the corresponding real animations and sounds. The loopback-only proxy enables framing only in the developer viewer; production CSP and server routing remain unchanged. It serves the current Cursed Boxes controller/CSS from the workspace for design review. It does not select hiding places, decide outcomes, or fake game phases.

Player-side review verified all four authenticated controllers, 16 boxes each, hider input enabled / shooter input locked, no JavaScript errors and no action-label or horizontal overflow. Hiding confirmation uses a responsive label size, explicitly reports the locked hiding place, and avoids telling hiders to wait for a shooting turn.

For a complete **manual review beginning before the trivia question**, use `REVIEW_FROM_QUESTION=1` instead. The setup joins four players and stops in the lobby without starting the question or answering. The viewer's “НАЧАТЬ ВОПРОС” button sends the existing test host's `START_QUESTIONS` control only on click. Wait for the normal question presentation, answer manually on all four phones within the existing timer, then proceed through results, authoritative role assignment, hiding confirmations and shots. The viewer supports all four phones or a larger individual phone view. Verified: four connected controllers in LOBBY, start button enabled, no auto answers, focus switching and no page errors.
