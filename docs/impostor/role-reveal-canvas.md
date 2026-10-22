# Private role parchment and countdown

The existing browser `#impostor-screen` and `createImpostorController` remain responsible for personalized role/word state. No new screen or role logic was introduced. The host never receives the secret word through this change.

Original new source: `assets/impostor/phone/word_reminise.png` (1672×941, transparent RGBA). It is packaged explicitly at `/art/impostor/phone/word_reminise.png`. `source_assets/archive/root-imports/impostor/backgrounds/background_codeword.png` was inspected but is not substituted for the transparent element. The parchment keeps its aspect ratio. Existing text nodes render role at the top and the secret word inside the middle red stripe; a resize/font-aware fit function constrains long words to the stripe. The impostor sees NO SECRET WORD and the existing role instructions. Spectators receive neutral existing information, without a secret word. Other phase styling remains unchanged.

Existing `assets/impostor/clock/clockmini.png` and `arrow_clock1.png` are explicitly served as classpath artwork. No source images were edited or generated. The browser `CountdownClock` uses a canvas overlay with calibrated original coordinates, mirroring the existing native clock convention: remainingSeconds × 6 degrees clockwise from XII; decreasing remaining time moves counterclockwise. The dark red sector extends from XII to the hand; at zero it disappears. The original hand PNG rotates around its hub. It uses requestAnimationFrame and the existing `now()` server-time estimate (serverTime + monotonic performance.now elapsed), never wall-clock time or accumulated frame deltas. It does not send network commands or choose the next phase.

The server adds public `roleRevealDurationMillis` metadata during ROLE_REVEAL, taken from the existing `ImpostorSession.ROLE_MILLIS`. The existing deadline, phase machine and **4-second role reveal** are preserved. The example 20 seconds is not applied as a rule change. The browser supports 10/20/30/60 seconds too. For 60 seconds the initial sector is a full circle. Expiration stops at XII while waiting for the authoritative next snapshot. Reconnection uses the current deadline. Rendering cancels on screen/phase changes, disconnect, reset and document hiding; visibility restoration resumes at current time. Reduced motion does not alter the linear, information-bearing clock.

Files added: `web/countdown-clock.js`, `tools/checks/check_role_reveal_browser.cjs`, this document.
Files modified: `web/index.html`, `web/impostor.js`, `web/controller-theme.css`, `server/build.gradle`, `server/src/main/java/com/finalanswer/server/rooms/RoomService.java`, `server/src/test/java/com/finalanswer/server/ImpostorSettingsTest.java`, `tools/checks/check_impostor_lifecycle_browser.cjs`.

Validation:
- `./gradlew :server:test :lwjgl3:classes` successful before the added timer boundary test; server tests rerun with that test.
- Browser presentation checks: 10/20/30/60-second starts, linear nonincreasing angles sampled at 30/60/144 FPS, exact zero, no client-controlled phase transition, Russian long-word fit at 320/844/1280 widths, impostor message, original resource bytes, phase/suspend/reset cleanup, zero browser errors.
- Screenshots manually inspected at `server/build/role-reveal-browser/`, including innocent-20s.png, impostor.png, long-word-320.png.
- Physical phones and Safari were not tested; mobile Chromium emulation is used.

Launch `./gradlew :lwjgl3:run`, create a new room, connect phones through the lobby QR/address and start THE IMPOSTOR. Refresh phone pages after restarting the server. During the existing four-second role phase, check the new parchment, word placement and smooth red clock, followed by server transition to clue input. Existing packaged app/ZIP distributions were not rebuilt.

Browser reproduction: start `./gradlew :server:impostorBrowserFixture -PimpostorManualClock=true`, then run `node tools/checks/check_role_reveal_browser.cjs` with PLAYWRIGHT_MODULE / PLAYWRIGHT_BROWSERS_PATH or CHROME_PATH configured for your local browser installation.

Final results: 105 server tests, zero failures/errors. Six real server/browser matches passed: 3 active + 3 spectators for three matches, then 4 active + 2 spectators for three matches; all outcomes, actual clue CONFIRM submissions, draft reconnection, four replays and two lobby returns. Production role-duration metadata checked in personalized snapshots. Presentation reconnection restored 10 seconds remaining (60 degrees) from a 20-second deadline, and explicit clock disable/dispose left no scheduled frame.
