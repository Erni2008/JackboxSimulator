# Identity reveal pause

The public host and phone identity announcements wait until authoritative phase start + 2000 ms before showing the impostor nickname. Host card highlighting waits too. This is a presentation delay; server phases/deadlines/security are unchanged. Reduced motion preserves the pause and shows the name without a fade. Late snapshots/reconnection resume at the current point, without restarting a local timer.

Host uses a dedicated owned Caveat bitmap font with Latin and Cyrillic glyphs, generated through existing libGDX FreeType. It is disposed with ImpostorScreen. Phones use the same bundled Caveat source, with the existing responsive parchment presentation. Browser script/theme URLs versioned for cache refresh.

Changed: `core/.../ui/UiFonts.java`, `core/.../impostor/ImpostorScreen.java`, `core/.../impostor/FinalVotePresentation.java`, `web/final-voting.js`, `web/controller-theme.css`, `web/index.html`, `lwjgl3/src/test/.../ImpostorCheck.java`.

New browser check: `scripts/check_identity_reveal_browser.cjs`, using the existing isolated browser fixture. It verifies hidden at 1999 ms, visible at 2000 ms, late reconnection, Cyrillic and Latin nicknames and font selection. Screenshots: `server/build/parchment-browser/identity-russian.png`, `identity-english.png`. These are presentation-harness screenshots; physical phones were not tested.

Native check includes two-second boundaries, reduced motion and actual Cyrillic bitmap glyph availability. Launch normally with `./gradlew :lwjgl3:run`; create a room and finish a match. During THE IMPOSTOR IS… the nickname and card emphasis must wait two seconds. Refresh phone pages to load updated resources.

Validation: server tests and graphical impostorCheck passed; updated graphical boundary/reduced-motion/Cyrillic checks passed on a second run.
