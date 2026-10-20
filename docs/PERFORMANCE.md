# Character preparation and frame-work optimization

The desktop launcher already uses VSync and a 60 FPS foreground cap. The existing candle sequence is loaded once from display-sized runtime images; it is not decoded every frame. Its frame count and the character animation timelines are retained.

## Changes

- **CharacterTextures.reduce** now processes RGBA byte buffers directly. The previous inner loop crossed JNI for every source and destination pixel. Alpha-weighted mipmap arithmetic is unchanged, including odd dimensions.
- **CharacterTextureMasks** computes polygon intersections once per image row rather than testing every pixel against every contour edge. Alpha validation stops once both transparent and visible pixels are found. All supplied contours were checked against the previous Intersector classification, pixel by pixel.
- **PuppeteerCharacter** retains the animator/spring substeps but builds the final bone matrices and string endpoints once per displayed frame.
- **VoodooCharacter** builds world matrices once per displayed frame for ordinary states. Death still samples attachment transforms at 120 Hz so extracted needles/buttons/arms remain correct. A finished terminal state can catch up its event clock in one step; it does not replay many seconds of inert substeps.
- Voodoo's body mesh reuses local vertices while heart deformation, source geometry and color are unchanged. Heart pulses and emission-region changes invalidate the cache normally.
- Shared texture ownership/disposal is preserved. No new per-frame texture creation, dependency, networking protocol, frame skipping or reduced animation frame set was introduced.

## Measured results

Representative local runs, with the same assets and desktop context:

| Preparation | Before | After |
| --- | ---: | ---: |
| Puppeteer shared assets | 1373 ms | 528–573 ms |
| Voodoo shared assets | 705 ms | 535–560 ms |

Eight-instance animation-update microbenchmarks are already very small (roughly .01 ms per displayed frame); their small timing differences vary with JIT and OS scheduling and are not claimed as a large FPS gain. The primary measured improvement is initial asset preparation. First-load PNG decoding and GPU upload remain synchronous; this does not promise that every possible loading hitch has disappeared.

The mixed lobby passed at three resolutions with all eight characters, and both character studios passed their complete state sequences. Other gameplay screens and network behavior were not changed by these optimizations. This is a targeted measured pass, not a full hardware-wide performance certification.

## Regression checks

```sh
./gradlew :core:check
./gradlew :lwjgl3:characterPerformanceCheck
./gradlew :lwjgl3:characterLightingCheck :lwjgl3:lobbyCharacterPolishCheck
./gradlew :lwjgl3:voodooStudio -PvoodooStudioCheck=true
./gradlew :lwjgl3:puppeteerStudio -PpuppeteerCheck=true
```

The performance probe checks pixel-identical mip reduction on odd/even RGBA inputs, every original contour, repeated eight-instance updates, and equivalence of a long death-state catch-up versus 120 Hz stepping (including detached-part matrices and network event age). Lighting, source-over compositing, appearance fade and existing animation checks also pass.

## Readability

Doctor base exposure is .65 instead of .60, with the same mask/cloth/hat material ratios. Lantern brightness remains 3.6. Puppeteer midtones receive a restrained hue-preserving lift, capped below clipping; black, alpha, original PNGs and eye animation remain intact. Cage/background/UI colors and character geometry are unchanged.
