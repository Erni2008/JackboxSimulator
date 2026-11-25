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
263 labelled answers outside the verified data (`server/src/test/resources/think_or_die/ai_eval.tsv`), RU + EN,
many deliberately unusual (spider, mould, socks, cat in a bathroom), plus gibberish and prompt injections.

| prompt / mode | correct | false accepts | false rejects |
|---|---|---|---|
| tod-judge-2, 12 answers per request | 89 % | 0 % | 6.5 % |
| tod-judge-3 (FITS / NONSENSE / UNSURE), 12 per request | 90 % | 0 % | 9.5 % |
| tod-judge-3, **one answer per request** (shipped) | **96 %** | 0.8 % | **3.0 %** |

A 4B model judging a list mixes up its verdicts, so every answer is its own request and the server runs
4 parallel slots (`-np 4 -c 8192`). About 1.5 s per answer; a burst of 12 takes about 11 s. Judging starts while
players are still typing; anything unfinished after `validationMaxMs` goes to the vote, never to "wrong".
Compare modes with `./gradlew :server:aiJudgeEval -Pai.batch=1`.

## Load (MacBook Air M4 16 GB, `./gradlew :server:aiJudgeLoad`, 2026-11-25)
tod-judge-5: one answer per request, reply `{"v":"FITS"}` (12 tokens max), category context first so the prompt
cache reuses it. Accuracy on the 263 labelled answers: **97 % correct, false rejects 0.8 %, false accepts 1.9 %**.

Throughput of the local 4B model on this laptop: about **4 unknown answers per second** (was 2 with the list
reply). Every room shares one admission queue (`thinkordie.ai.slots`, default 4 in flight); an answer that waits
longer than `thinkordie.ai.queueMs` (6 s) is not sent to the model, so a burst can never stall later rounds:
the round always moves on within `validationMaxMs`. Only answers missing from the lists ever reach the AI, and every
AI verdict is cached for all future games, so the same answer is never judged twice.

For many simultaneous rooms the model needs a GPU server at release (cloud is deferred): llama.cpp or vLLM on a
single modern GPU serves this model at well over 50 answers per second with the same code (`THINK_OR_DIE_AI_URL`,
`THINK_OR_DIE_AI_SLOTS`).

## Whole system accuracy (lists + rules + AI, `aiJudgeEval -Pai.engine=true`, 2026-11-25)
| set | decided without AI | correct | false accepts | false rejects |
|---|---|---|---|---|
| ai_eval.tsv (263, lists were grown with it in view) | 200 | 99.2 % | 2 | 0 |
| **ai_holdout.tsv (131, never used for tuning)** | 46 | **96.2 %** | 2 | 3 |

Every error is made by the AI, never by the lists. The remaining AI errors are gaps in what a 4B model knows
(Odin and Gleam as languages, Darkseid as a Batman villain); a two-judge consensus (`thinkordie.ai.consensus=true`)
did not change the held-out score, so it is off. The way to 99 %+ is coverage: grow the verified lists so that
almost every real answer is decided without the AI, and use a larger model offline to propose list entries.
