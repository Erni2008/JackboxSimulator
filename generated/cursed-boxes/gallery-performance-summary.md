# Gallery profiling and verification — October 22

Device-specific serialized CPU submission + GPU completion measurements; diagnostic glFinish excludes presentation/vsync. Normal gameplay uses no such fence. Different scene compositions and run lengths make these regression observations, not a controlled speedup claim.

| Scene | Frames | Median ms | p95 ms | Max ms | Shader compiles | Texture uploads | Static mesh uploads |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Before gallery (previous theater composition) | 4200 | 5.656 | 10.433 | 13.961 | 0 | 0 | 0 |
| Enlarged gallery, 20 resets / 40 shots | 6000 | 6.357 | 10.382 | 25.500 | 0 | 0 | 0 |
| Final support-contact refinement, 2 resets / 4 shots | 600 | 2.980 | 6.724 | 11.317 | 0 | 0 | 0 |

Enlarged scene: Apple M4, framebuffer 2880x1608; first-shot window maximum 9.862 ms. Median CPU submission 0.964 ms; median GPU completion wait 5.457 ms. The remaining cost is primarily GPU work, including the original dense splinter meshes, rather than runtime loading/compilation.
Models: [8]; managed textures: [15]; heap 224.02–225.02 MiB; GC 0 collections. Median render allocation 112 bytes/frame. Draw calls 28–43. All managed textures were released at shutdown.

Occasional measured frames exceeded 16.7 ms (maximum shown above). No universal 60 FPS guarantee is claimed. No first-shot cold asset/shader/static-mesh work occurred. Q retains the lower-effect setting.

Passed: core check suite; native fullscreen/F11/16-slot picking/model bounds/BOX3/GHOST3/two-shot/reset/F3 gameplay QA; gallery ping-pong/cover/blend at 1920x1080 and 2560x1440; composition also at 3440x1440 and 1024x768; exact support-to-shadow contact; fixed camera/shelf/crate matrices; tabletop contact/lifted shadow disappearance/return; real menu ESC/reentry/display restoration; 20-cycle stress plus final two-cycle contact-refinement regression.

Runtime GL FBO/readback and performance fences exist only in diagnostic executables or loading. No new models, textures, shader compilation or static mesh uploads occurred during the measured shots.
