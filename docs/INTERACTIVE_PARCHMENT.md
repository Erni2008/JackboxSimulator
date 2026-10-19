# Interactive phone parchment

The phone clue form now uses the original `assets/impostor/phone/papper3dview.png` (1115×1411) and `assets/impostor/phone/pen.png` (1774×887). The imported pen copy is archived under `source_assets/archive/root-imports/impostor/phone/pen.png`. Source artwork is unchanged. Gradle explicitly bundles these two files at `/art/impostor/phone/`; no general filesystem route was introduced.

## Implementation

`web/parchment-writer.js` is a presentation module. A transparent, focusable native textarea sits on the paper; it retains normal selection, cursor editing, composition, autocorrect and clipboard behavior. A non-interactive ink mirror shares its font, wrapping and dimensions. It updates synchronously on input with textContent, never HTML. Native selection offsets are used for caret placement, including Unicode text. Server validation remains one word of up to 24 letters; the existing 48 UTF-16-unit input limit and NFC submission validation are unchanged. Multiline drafts can be displayed but are rejected by the existing single-word rule.

There is no character animation queue. Each input immediately replaces the ink with the complete draft, measures the latest caret and retargets the same requestAnimationFrame loop. Exponential interpolation uses the actual interval between input events (10–38 ms smoothing time constant). Obsolete positions are discarded. Paste and deletion update immediately. This is an immediate glyph-rendering approximation, not outlines that draw each glyph stroke by stroke. No glyph animation delays submission.

The pen anchor is configurable in the module: 2.37% horizontal, 95.49% vertical, matching the original nib. Its original aspect ratio is preserved. The enlarged pen uses up to 34 degrees of gesture rotation, a short 6 × 7 CSS-pixel nib movement, up to 12 pixels of lift and a subtle scale/shadow change. A single 170–250 ms gesture retargets on new input. The holder turns upward near the right margin to remain inside the viewport. ResizeObserver and font readiness realign it after resizing/loading. Reduced motion or room effects disabled snap it directly to the caret. The loop cancels when editing is disabled, the phase screen changes, the socket disconnects, or the match resets. Listeners and observer are installed once for the persistent controller DOM; dispose is also available.

The textarea is the actual touch target. Its focus opens the browser keyboard on supported devices. visualViewport resize keeps the editing area in view; the page retains normal vertical scrolling. Caveat is bundled locally for handwritten Latin, Russian and Ukrainian text at weight 550; Noto Sans remains a fallback. The font and its SIL Open Font License come from https://github.com/google/fonts/tree/main/ofl/caveat. It is served locally without runtime font requests to third parties. The private word uses the existing personalized state and a compact upper-right panel. Timer and CONFIRM use the existing server deadline, validation, acknowledgment and shared image buttons. Voting, roles, server logic, results and replay were not changed.

## Files

Created: `web/parchment-writer.js`, `scripts/check_parchment_browser.cjs`, this document.

Modified: `web/index.html`, `web/controller-theme.css`, `web/impostor.js`, `web/app.js` (presentation cleanup when leaving the clue screen), `server/build.gradle` (two-resource allowlist), `scripts/check_impostor_lifecycle_browser.cjs` (optional PARCHMENT_QA actual UI submissions). The parchment now lives in `assets/impostor/phone/` and must be included when distributing the source.

## Validation performed

- `./gradlew :server:test :lwjgl3:classes --console=plain --info`: successful; server tests up to date after the earlier successful test invocation, desktop compilation successful.
- Chromium 151 via Playwright: touch focus, slow/fast/extremely fast typing, CASTLE typed with 50 ms input intervals, pen convergence within 2 CSS pixels, deletion, selected-text replacement, complete value insertion, Russian/Ukrainian text, synthetic IME composition, multiple lines, viewport widths 320/390/844/1280, reduced motion, disposal with zero pending animation frames, original image byte equality. No browser script errors.
- Actual multiplayer regression: six consecutive matches in one room; first three with 3 active + 3 spectators, next three with 4 active + 2 spectators. Actual phone CONFIRM submissions, role privacy, server acknowledgments, all outcomes, multiple rounds, temporary socket disconnection with draft recovery, results, four replays and two lobby returns passed. Existing server timer behavior was exercised, not changed.
- Screenshots manually inspected: empty, first letter, half word, complete word, fast typing, multiline, resized layouts, reduced motion and real server-confirmed waiting state. Pure presentation screenshots use an isolated DOM harness; actual confirmed screenshots come from real multiplayer.

Artifacts: `server/build/parchment-browser/` (PNG screenshots and report.json), `server/build/impostor-browser/parchment-confirmed-match-1.png` through `-6.png`; `server/build/parchment-validation.log`.

Reproduce after starting the existing isolated fixture:

```sh
./gradlew :server:impostorBrowserFixture -PimpostorManualClock=true
# Another terminal; supply installed Playwright and browser paths if needed:
node scripts/check_parchment_browser.cjs
PARCHMENT_QA=1 IMPOSTOR_UI_QA=1 IMPOSTOR_POLISH_QA=1 node scripts/check_impostor_lifecycle_browser.cjs
```

Both scripts accept PLAYWRIGHT_MODULE and CHROME_PATH; Playwright also accepts PLAYWRIGHT_BROWSERS_PATH. Fixture control is test-only and does not enter production resources.

## Manual launch

```sh
cd /Users/erni/Documents/FinalAnswer
./gradlew :lwjgl3:run
```

Create a room and connect three independent browser identities or phones on the same Wi-Fi through the lobby QR/address. Select THE IMPOSTOR and participants, then START MATCH. During clue entry tap the paper, type, edit, paste and press CONFIRM immediately. Success must appear only after server acknowledgment. Check the next round, replay and lobby return. Refresh existing phone tabs after restarting to load the new JS/CSS. Previously built app/ZIP distributions have not been rebuilt by this task.

## Limits

Physical iPhone/Android keyboards and Safari were not tested. Chromium mobile emulation cannot prove virtual keyboard behavior on real devices. Actual clipboard OS integration/autocorrect were not separately tested; native textarea behavior is preserved. A detailed glyph stroke animation is not implemented: immediate complete text and a rapidly following nib are deliberate. The original asset is a metal nib pen, not feather artwork. No replacement artwork was invented. Missing Stage 5 outline PNG and audio assets are outside this change.

Polish follow-up: browser checks rerun successfully with Caveat, observed writing scale > 1.02, fast-input convergence, no horizontal overflow and reduced-motion cleanup. Latin and Ukrainian screenshots visually inspected. New assets: `assets/ui/fonts/Caveat-Variable.ttf`, `assets/ui/fonts/Caveat-OFL.txt`. No new physical-device or multiplayer test is claimed for this purely visual follow-up.

Second motion follow-up: substantially larger wrist/lift gestures, Russian mixed-case screenshot inspected, actual TTF cmap verified for Russian/Ukrainian including Ё/Ї/Є/Ґ. Font preloaded, font/script/theme URLs versioned, and phone autocapitalization changed from all characters to sentence case. Browser checks passed again; reduced motion and instantaneous ink remain intact.

Phone parchment limit follow-up: native maxlength and draft enforcement now cap entry at 10 characters, including pasted drafts; Unicode NFC normalization precedes code-point truncation, and IME truncation waits for composition completion. Phone submit validation and messages agree with the limit. The server protocol and its existing validation are unchanged. Updated browser checks cover 11th-character blocking and overlength Cyrillic/Latin insertion.
