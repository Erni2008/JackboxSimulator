# Identity reveal presentation

The shared-screen identity nickname and card highlight wait until authoritative identity phase start + 3400 ms. This marker follows the measured strong 3.4–3.7 second accent of `impostor_role_reveal.wav`. Normal motion uses a 120 ms fade; reduced motion preserves the delay and shows the name immediately at the marker. Late snapshots/reconnection resume the same phase age. The existing four-second authoritative phase and scoring are unchanged; the completed scene retains its original identity phase start.

Phones intentionally show a completely black game viewport after accepting their own final vote and during locked votes, vote counting, suspect announcement, identity reveal and completion. No nickname, chosen-vote receipt, result, room footer or game navigation is visible. Reload remains black. Initial secret-role cards and voting inputs for players who have not submitted are unchanged; the next lobby/game restores normal routing. Authoritative snapshot delivery is unchanged; this is a presentation rule.

The host retains the existing Caveat font and Cyrillic/Latin glyphs, original character artwork and card animations. No new textures or rendering pipeline.

Checks: `:lwjgl3:impostorCheck -PimpostorAudioQA=true` verifies 3399/3400 ms boundaries, reduced motion and retained reveals. `tools/checks/check_identity_reveal_browser.cjs` verifies black phone screens for English/Russian names and safe restoration/disconnect. The controller viewport suite covers accepted votes, all final phases and 320/390/844 widths; native game and browser lifecycle checks cover replay and multiplayer synchronization. Physical phone hardware testing remains manual.

See [audio integration](audio-integration.md) for actual asset paths, audio routing and the real-time demo.
