# The Last Command — input response and circuit presentation

Numeric keys now respond on pointer-down, without waiting for pointer release or the server round trip. Hardware digits/numpad, minus, Backspace/Delete and Enter work while an active numeric puzzle owns input. Browser camera shortcuts 1/2 remain available outside numeric tasks. The native CRT uses the same editing behavior.

A bounded presentation projection holds unacknowledged key edits. Existing request IDs reconcile them with authoritative STATE replies; broadcasts arriving before those replies cannot double-append characters or rewind a pending delete. Task replacement, pause, verdict, rejection, disconnect and disposal discard stale projection. The authoritative input, answer validation, scores and next-task decisions are never modified locally. No networking protocol or rate-limit change was introduced.

The browser's idle renderer is explicitly invalidated when displayed input changes. This also addresses the earlier case where touchscreen input did not change the panel render key and an otherwise idle scene could wait for another activity. Numeric display changes do not request a new shadow pass. Pressed keys have a short visual response, and a footer lists hardware controls.

Mechanical caps begin their local travel immediately, while retaining the existing click/hold-versus-orbit decision. Their projection survives unrelated authoritative snapshots and is released when dragging, losing capture, blurring or cancelling the gesture. No gameplay press or click audio is emitted merely by this visual anticipation.

Circuit screens now show a source and destination, distinguish energized reachable contacts, bridge connected neighboring tiles and animate directional pulses along an actually connected public path. Reachability is a cached visual graph traversal, not a puzzle solver or success decision. The screen explicitly asks for confirmation; completion sound and score still wait for the server. Existing 3x3 topology, rotations and circuit rules are preserved. Both browser/phone canvas and native CRT presentation were updated. The native render target animates at its existing 20 Hz circuit cadence; no new mesh or audio assets are loaded.

## Validation

- `npm --prefix web3d run build`: pass.
- `./gradlew :core:check :server:test --offline`: pass, including the new `lastCommandNumberInputCheck`; 217 server tests pass.
- `./gradlew :lwjgl3:lastCommandExpansionCheck --offline`: real native projected pointer input, hardware/numpad input before network ACK, authoritative text, rule-card screen and powered circuit rendering pass without GL errors. The connected circuit does not score before confirmation. Audio is deliberately disabled in this graphics fixture; its host-playback warning does not represent an audible device test.
- `tools/checks/check_last_command_input_response.cjs`: real HTTP/WebSocket gameplay with 250 ms artificial incoming-message delay. Final recorded run: 7.1 ms local input projection, 8.6 ms to the following rendered-frame submission. A single digit appears before release and before delayed authority; no duplicate on release. Rapid edits, minus/delete, ACK rebasing, three numeric task families, Enter authority, stale revisions and task cancellation pass. Circuit preview remains unscored until confirmation. Mechanical anticipation survives a snapshot, and an orbit drag submits no answer.
- `tools/checks/check_last_command_rotary_input.cjs`: stale-snapshot rotary burst, both wrap directions, capture-loss release, complete lamp cycle and protected memory signal pass. The test now derives the lamp's actual generated initial state instead of assuming OFF.

The latency values are one controlled local run, not a universal device/network guarantee. No FPS increase was measured or claimed.

Artifacts: `generated/last-command-response/report.json`, `generated/last-command-response/circuit.png`, `generated/last-command-expansion/native.png.circuit.png`.

## Changed files

Browser: `web3d/src/runtime/number-input.ts`, `runtime/network.ts`, `runtime/view.ts`, `src/main.ts`, `src/games/last-command/machine.ts`, `experience.ts`, `web/command-touch.js`.

Native: `core/src/main/java/com/erni/finalanswer/lastcommand/NumberInputPreview.java`, `LastCommandNetworkBridge.java`, `CommandTouchDisplay.java`, `TheLastCommandScreen.java`.

Checks/build: `core/build.gradle`, `core/src/test/java/com/erni/finalanswer/lastcommand/NumberInputPreviewCheck.java`, `lwjgl3/src/dev/java/com/erni/finalanswer/lwjgl3/LastCommandExpansionCheck.java`, the two browser checks above, this document. Server `CommandRace.java` has only a clearer circuit instruction in this update; scoring/generation rules are unchanged by this stage. Earlier unrelated modifications in the working tree remain intact.
