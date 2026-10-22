# CURSED BOXES — multiplayer phone controllers

The existing browser controller, room server, authenticated sessions and native
CURSED BOXES renderer now work together. There is no separate website or socket
service. The original shotgun, direct BOX1 → BOX3 destruction, particles, camera,
background and persistent character animation remain in use. Scoring is unchanged.

## Play with two or more phones

From the repository root:

```sh
./gradlew :lwjgl3:run
```

1. Create a room using the existing desktop room flow.
2. Connect 2–8 players through the room's existing QR/link. For a local room, put
   the computer and phones on the same LAN and use the displayed LAN address;
   `localhost` on a phone addresses that phone, not the computer.
3. Each player enters their existing nickname and chooses an available avatar.
4. Once everybody is connected, click **CURSED BOXES** at the lower left of the
   desktop lobby. The normal START GAME and THE IMPOSTOR buttons are preserved.
5. The scene preloads, then every phone automatically opens its controller. The
   first player in the existing lobby roster selects a box, waits for selection
   confirmation and presses **FIRE!**. Selection alone never shoots.
6. The same player gets a second shot at another intact box. After the real shot
   animation completes, the next player gets their two shots. Waiting players
   see the current nickname and a disabled grid.
7. All destroyed compartments and revealed characters remain visible. After the
   last turn the scene stays open for inspection. Desktop **ESC** returns everyone
   to the existing lobby; it does not close the room.

Desktop **F3**, **Q** and **F11** retain performance, effect-quality and fullscreen
controls. Desktop mouse/SPACE/R cannot bypass phone turns in a multiplayer scene.
The existing borderless presentation preserves the monitor's display mode.

The separate developer test is unchanged and never consumes multiplayer ammo:

```sh
./gradlew :lwjgl3:cursedBoxesCharacters
./gradlew :lwjgl3:cursedBoxesCharacters -PcursedCharactersAuto=true
```

Its nine-shot budget, eight simulated identities, empty ninth target, T/R controls
and persistent final scene remain independent. See `CURSED_BOXES_CHARACTERS.md`.

## Phone interface and box mapping

The controller displays FINAL ANSWER, CURSED BOXES, the authenticated player's
nickname/avatar identity, server-owned shot counter, sixteen wooden buttons,
selection, large FIRE button, waiting/confirmation/error status and shot result.
The wooden previews are crops of real renders of the existing intact and empty
destroyed crate models; no replacement artwork was generated. Intact tiles contain
no character-specific image or clue. Selected, locked and destroyed tiles have
distinct states. FIRE locks synchronously before sending its request.

Layout supports portrait, landscape, safe areas, keyboard focus and reduced motion.
The existing controller's connection banner, leave-room control, typography and
room/session mechanism are reused. No new browser audio is required; the native
shotgun plays its existing sound.

`CrateSlot` already uses row-major IDs. The phone uses the same IDs:

| Shelf row, from top | Phone labels | Wire/native IDs |
|---|---|---|
| 1 | BOX 01–04 | 0–3 |
| 2 | BOX 05–08 | 4–7 |
| 3 | BOX 09–12 | 8–11 |
| 4 | BOX 13–16 | 12–15 |

The native formula is `x = (id % 4 - 1.5) * 2.08 + origin.x`,
`y = (1.5 - id / 4) * 1.52 + origin.y`. The integration test checks the actual
sixteen native slot positions as well as the browser grid order.

## Authority, turns and synchronization

The existing CURSED BOXES scene was a local demo, without a network turn manager.
The added room session uses the existing lobby's ordered roster: each participant
gets two consecutive shots, then the next participant acts. It does not reorder
players, change their identities or replace the shared room architecture.

`RoomService` retains its existing synchronized mutation boundary. The new
`CursedBoxesSession` owns assignments, active player, selected box, remaining ammo,
personal hit sets, global destroyed set and accepted request IDs. It places each
real participant's existing avatar and nickname into a distinct shuffled box;
unoccupied boxes remain empty. All eight registered avatars are supported.

Every selection/fire command validates the authenticated member, room, minigame
session, exact payload fields, integer box range, phase, turn and intact state.
FIRE additionally checks server-owned ammo, expected shot ordinal, confirmed
selection and previous hits. One accepted request reserves exactly one cartridge
and one animation job. A repeated request ID with identical parameters returns
the same acceptance; changed parameters or another request during that job are
rejected. Rejections consume no cartridge. No second pending shot can race the
first. A third shot cannot pass server validation.

The native adapter uses the existing `RealtimeClient` and the real scene's
pickup/aim/fire/impact/recovery callbacks. It loads no resources and creates no
model instances during a shot. The server publishes destruction/results only after
the authenticated desktop acknowledges the actual impact; it advances only after
the shot has completed. Minimum stage intervals are 30 ms to impact and 1,100 ms
to completion. ACKs are idempotent and retried if necessary.

Every connected controller receives its own versioned authoritative room snapshot
through the existing broadcast path. The sixteen public boxes expose only IDs and
availability until impact. Character identity/nickname or `empty` is added only
for a destroyed box. The private assignment map is sent exclusively to the
authenticated desktop host. Public room views and ordinary phones never receive
it. The static phone-art allowlist exposes only the two empty-crate thumbnails,
not the character sprite directory.

Character rendering remains `HIDDEN → REACTING → REVEALED`, with no despawn or
fade-out. The normal source PNG alpha holes, including Voodoo's head opening, are
preserved. Previously revealed characters keep rendering during later turns.

## Reconnection and failures

The existing token/session restoration and heartbeat are reused. Reloading the
same phone session restores identity, ammo, selection if valid, phase and shared
destruction; it creates no new player. Lost request confirmation triggers SYNC,
never an automatic second FIRE. The browser also recovers from rejected actions
and clears in-flight UI locks on reconnection/phase changes.

Host disconnect pauses new actions. Accepted shots are durable within the current
room: a reloaded native scene restores destroyed boxes and revealed characters,
then resumes the pending job without spending another cartridge. If its impact
was already acknowledged, it finishes that job without replaying another impact.
Fifteen seconds without progress explicitly pauses the scene; the ready handshake
resumes it. No watchdog refunds ammo, hides characters or silently resets boxes.

Disconnected players retain their turn and ammo while reconnecting. An explicit
leave forfeits their remaining turns, skipped between animations. Existing room
retention still applies, including the host-disconnect expiry. State is in memory;
this does not add persistence across a server-process restart.

## Wire additions

The existing protocol version/envelope, AUTH, SYNC, request IDs, room revisions,
rate limits, origin checks and transport are unchanged. All commands below include
`roomCode` and `sessionId` in the existing `payload`.

| Command | Extra fields | Sender |
|---|---|---|
| START_CURSED_BOXES | none; sessionId is current lobbyId | host |
| CURSED_SELECT | turnId, boxId | active phone |
| CURSED_FIRE | turnId, boxId, shotNumber | active phone |
| CURSED_SCENE_READY | none | host after preload/warmup |
| CURSED_SHOT_STARTED | shotId | host animation callback |
| CURSED_SHOT_IMPACT | shotId | host animation callback |
| CURSED_SHOT_COMPLETE | shotId | host animation callback |
| CURSED_RETURN_TO_LOBBY | none | host |

After start, `sessionId` is the minigame ID. No client-supplied player ID, shot
budget, character assignment or scoring field is accepted. Phone errors use
`CURSED_ACTION_REJECTED` with the original request ID. Successful FIRE returns
`CURSED_SHOT_ACCEPTED`; selection/state/result/turn changes use personalized room
snapshots. Results are synchronized to impact, not predicted by the phone.

## Build and verification

```sh
./gradlew :server:test :core:check :lwjgl3:compileDevJava :lwjgl3:assemble :server:installDist
```

The full server suite passed: **128 tests, zero failures/errors**, including five
new Cursed tests covering secrecy, stage authorization, duplicates, two-shot
limits, rejected inputs, reconnect, paused jobs and all eight participants taking
exactly sixteen distinct shots. All existing core checks passed, including the
eight PNG decode/alpha/enclosed-hole/fit checks and developer-nine-shot rules.

A native integration fixture starts a real `RoomServer`, the existing
`FinalAnswerGame`, and a real OpenGL CURSED BOXES scene. Two independent mobile
browser sessions join through the normal room page. It is development-only:

```sh
# Terminal 1 — native scene/server, exits when the browser check completes:
./gradlew :lwjgl3:cursedBoxesPhoneCheck
# Terminal 2 — use an installed Playwright with Chromium:
node tools/checks/check_cursed_boxes_browser.cjs
# Optional environment variables: PLAYWRIGHT_MODULE and CHROME_PATH.
```

This check passed with the real desktop lobby button, both authenticated phones,
actual aim/shot/destruction/debris/reaction callbacks, results, phone reload and
offline-during-shot recovery, host scene reload, shared destruction, persistent
Ghost and Voodoo after 6.5 seconds, and two shots per participant. It explicitly
tests rapid taps, duplicated requests, invalid and third shots, hidden-content
redaction, unchanged scores, resource disposal, and returning from CURSED BOXES
to the existing lobby and ordinary question UI.

Seven browser viewports passed: 320×568, 360×640, 390×844, 412×915, 568×320,
844×390 and 1280×800. All sixteen buttons remain ordered/readable, FIRE stays
accessible, no horizontal scrolling occurs, and the small portrait result fits
without extra scrolling. Screenshots of the phone UI, native final scene and
desktop lobby were rendered and visually inspected.

The independent native nine-shot character QA also passed after integration:
all eight characters remain revealed, nine boxes destroyed, seven intact, no
tenth shot, and reset restores the scene. Developer controls are absent from the
phone controller.

The new native integration audit observed **zero gameplay shader compilations,
texture uploads or static mesh uploads**. Existing pooling, preloading, warmup and
back-face/mipmap optimizations remain. The UI uses shared preloaded thumbnails,
sixteen persistent DOM buttons and CSS transitions, with no animation library.
The multiplayer run is not a hardware-wide FPS benchmark; no new FPS guarantee is
made. Physical iPhone/Android devices, Safari, and external Wi-Fi/firewall setups
were not tested; mobile browser checks used Chromium touch/viewport emulation.

Fixture reports/screenshots stay in ignored `lwjgl3/build/cursed-phone-check`.
Some local inspection reports deliberately include host-private assignments;
they are test artifacts, never public web assets. Shareable screenshot copies are
in `generated/cursed-boxes/multiplayer`.

## File manifest for this integration

Created:

- `shared/src/main/java/com/finalanswer/protocol/CursedBoxesProtocol.java`
- `server/src/main/java/com/finalanswer/server/game/CursedBoxesSession.java`
- `server/src/test/java/com/finalanswer/server/CursedBoxesTest.java`
- `core/src/main/java/com/erni/finalanswer/cursedboxes/CursedBoxesMultiplayerController.java`
- `lwjgl3/src/dev/java/com/erni/finalanswer/lwjgl3/CursedBoxesPhoneCheck.java`
- `web/cursed-boxes.js`, `web/cursed-boxes.css`
- `assets/cursed_boxes/phone/crate-intact.png`, `crate-destroyed.png`
- `tools/checks/check_cursed_boxes_browser.cjs`, `tools/assets/export_cursed_phone_art.py`
- `docs/cursed-boxes/multiplayer.md`

Modified:

- `server/src/main/java/com/finalanswer/server/rooms/RoomService.java`
- `server/src/main/java/com/finalanswer/server/RoomServer.java`, `server/build.gradle`
- `core/src/main/java/com/erni/finalanswer/FinalAnswerGame.java`
- `core/src/main/java/com/erni/finalanswer/screens/CageLobbyScreen.java`
- Existing `cursedboxes/CursedBoxesScreen.java`, `CursedBoxesRenderer.java`,
  `CursedBoxesTurn.java`, `CursedCharacterController.java` in the core package
- `lwjgl3/build.gradle`
- `web/app.js`, `web/index.html`, `web/final-answer-button.js`

Character PNGs, source models, backgrounds, multiplayer identities, questions,
scoring and the independent developer-test implementation were not replaced.
