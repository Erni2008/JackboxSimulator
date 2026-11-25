# THINK OR DIE — optional AI Answer Pack

The game is fully playable without it: answers the verified data cannot decide go to the players' vote.
With the pack, such answers are judged locally by Qwen3-4B-Instruct-2507 (Q4_K_M) on llama.cpp.

## Install / run (macOS, Apple Silicon)
Pack location: `/Volumes/WindowsVM/FinalAnswerAIPack` (2.5 GB model + 30 MB runtime).

1. Double-click `Start AI Judge.command` (checks the model sha256 once, then serves on 127.0.0.1:18431).
2. Start the game server with `THINK_OR_DIE_AI_URL=http://127.0.0.1:18431`.
   The server log prints `AI judge qwen3-4b-instruct-2507-q4_k_m/tod-judge-1` when it is on.

Windows + NVIDIA: download the llama.cpp `bin-win-cuda` build of the same tag and run `llama-server.exe` with the
same arguments. Only loopback URLs are accepted by the game.

## Safety
- Player answers travel as JSON data; the system prompt declares them untrusted; output is constrained by a JSON
  schema and parsed strictly (any deviation = the whole batch goes to the vote).
- The AI can only merge an answer into a verified concept; otherwise the canonical id comes from the player's own
  text, so the model cannot split identical answers to dodge duplicate detection.
- AI "wrong" verdicts cost 0 points unless `-Dthinkordie.aiPenalties=true`.
- Decided verdicts are cached in `~/.finalanswer/think_or_die_ai_cache.json` (per category version + model version),
  never mixed with verified content.

## Measured (MacBook Air M4 16 GB, `./gradlew :server:aiJudgeEval`, 2026-11-25)
41 labelled answers outside the verified data, RU + EN, incl. two prompt-injection attempts:
correct 93 %, **false accepts 0 %**, false rejects 2.4 % (Гирлянда), uncertain 5 %;
batch latency average 2.8 s, worst 7.7 s (10 answers). `validationMaxMs` is 7 s; later results go to the vote.
