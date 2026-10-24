# Missing cinematic audio — no placeholder recordings

The intro already uses `../cages/runtime/chain_cage.wav`,
`../questions/clock_ticks.wav` and the existing quiet basement ambience through GameAudio.
These source recordings are preserved.

Required but not found in the workspace:

| Intended file here | Purpose |
| --- | --- |
| `distant_metal_impact.wav` | Quiet distant metal impact during opening darkness |
| `distant_footsteps.wav` | Distant footsteps during awakening |
| `metal_tool.wav` | Small metallic tool movement before the hunter speech |
| `mechanical_click.wav` | Old mechanical click before the offer |
| `show_sting.ogg` | Final musical cue; accent timing needs measurement against the supplied recording |
| `host_quiet_laugh.wav` | Approved quiet vocal laugh in the same host voice |
| `host_short_laugh.wav` | Approved short vocal laugh |
| `host_sinister_laugh.wav` | Approved sinister vocal laugh |

No fake, empty, downloaded or unrelated substitute audio was created. The five
ordinary SFX/music cues have optional asynchronous loading hooks in the intro.
Vocal laughter remains a missing insertion: recordings must be approved and
measured before connecting them to narration completion. Bracketed stage directions
are never passed to the TTS model. Their short silent pauses are preserved.
