# THE FINAL SECOND — art

- `machine_plate.png` — derived from the user's approved reference (`source_assets/final_second/reference.png`): plaque text, timer digits and the button cap removed (OpenCV inpainting + manual cleanup) so they can be drawn live.
- `button_cap.png` — the red button cap cut from the same reference (alpha mask), animated in code.
- `layout.json` — pixel rectangles of the cap, the display glass and the plaque in the reference image.
No third-party assets. Seven-segment digits, glows and lamp flicker are generated in code (SevenSegment.java, FinalSecondScene.java).
