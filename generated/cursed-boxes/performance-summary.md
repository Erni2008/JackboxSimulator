# Cursed Boxes native profiling

Device: Apple M4; GL: 2.1 Metal - 90.5; framebuffer: 2880x1608.

CPU submission + GPU completion wait, serialized with diagnostic glFinish. Vsync/presentation excluded. Baseline: 3 resets; final: 20 resets / 40 shots. Final uses the original BOX3 and immediate GHOST3.

| Metric | Before | Final |
| --- | ---: | ---: |
| Measured frames | 630 | 4200 |
| First-shot window max (ms) | 14.971 | 5.055 |
| Full run median (ms) | 4.029 | 6.495 |
| Full run p95 (ms) | 9.324 | 9.211 |
| Full run max (ms) | 14.971 | 12.694 |
| Shader stage compilations in gameplay | 2 | 0 |
| Max draw calls | 44 | 39 |

Final counters: 0 texture uploads, 0 static mesh uploads, 0 GC collections / 0 ms GC. Loaded model counts: [8]; managed texture counts: [9].
Peak active debris: 4; sprite particles: 10. Heap range: 222.97–222.97 MiB. Median allocation measured inside render: 104 bytes/frame.

The baseline did not reproduce a severe freeze on this machine. It did show lazy shader compilation and first-use work during firing. Driver caches may already have been populated. Full-run before/after medians are not controlled throughput comparisons: runs have different lengths and continuously unthrottled GPU work changes clock/thermal/background conditions. Zero new shader/texture/static-mesh work and bounded resource counts are the reliable warmup/leak checks. All managed textures were released at shutdown. No universal 60 FPS guarantee is claimed.

| Final cycle | Median ms | Maximum ms |
| --- | ---: | ---: |
| 1 | 3.187 | 5.055 |
| 2 | 3.118 | 4.635 |
| 6 | 5.640 | 9.958 |
| 11 | 7.413 | 12.452 |
| 20 | 7.281 | 12.646 |
