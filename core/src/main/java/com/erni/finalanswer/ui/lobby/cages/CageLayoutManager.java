package com.erni.finalanswer.ui.lobby.cages;

/** Resolution-independent design coordinates, rendered through the lobby's 1920x1080 FitViewport.
 * Staggered tiers leave clear ceiling-to-ring corridors between the upper cages. */
public final class CageLayoutManager {
    public static final int SLOTS = 8;
    public static final float WORLD_WIDTH = 1920, WORLD_HEIGHT = 1080;
    public static final float SCALE = .93f, FIRST_RING = 642, SPACING = 161, CEILING = 1035;
    private static final float[] RING_HEIGHTS = {620, 955, 627, 960, 618, 950, 625, 958};
    private CageLayoutManager() {}
    public static float ringX(int slot) { return FIRST_RING + SPACING * slot; }
    public static float ringY(int slot) { return RING_HEIGHTS[slot]; }
    public static void layout(HangingCage[] cages) {
        if (cages.length != SLOTS) throw new IllegalArgumentException("Exactly eight cage slots are required");
        for (int i = 0; i < cages.length; i++)
            cages[i].place(ringX(i) - 149, ringY(i) - 324, SCALE, CEILING);
    }
}
