package com.erni.finalanswer.impostor;

/** Immutable design-space regions. Coordinates use libGDX's bottom-left origin. */
public final class ImpostorLayout {
    /** One clockwise revolution per authoritative countdown; never advances gameplay. */
    public static float clockRotation(long now,long started,long deadline){
        if(deadline<=started)return 0;
        return -360f*(float)Math.max(0,Math.min(1,(double)(now-started)/(deadline-started)));
    }
    public static final float WIDTH = 1920;
    public static final float HEIGHT = 1080;
    public record Bounds(float x, float y, float width, float height) {
        public float centerX() { return x + width / 2; }
        public float centerY() { return y + height / 2; }
    }

    public static final Bounds TOP_PLAYERS = new Bounds(70, 744, 1430, 320);
    public static final Bounds CENTRAL_CONTENT = new Bounds(360, 470, 1140, 290);
    public static final Bounds TABLE = new Bounds(300, 100, 1300, 340);
    public static final Bounds CLOCK_REGION = new Bounds(1540, 620, 360, 420);
    public static final Bounds CLOCK = new Bounds(1608, 782, 224, 224f * 1286 / 1223);
    public static final Bounds TIMER_PANEL = new Bounds(1550, 628, 340, 340f * 809 / 1942);
    public static final Bounds TIMER_LABEL = new Bounds(1580, 720, 280, 24);
    public static final Bounds TIMER_VALUE = new Bounds(1580, 654, 280, 64);

    // Measured in the unmodified source PNGs, from their top-left corners.
    public static final float CLOCK_PIVOT_X = 614, CLOCK_PIVOT_Y = 680;
    public static final float ARROW_PIVOT_X = 512, ARROW_PIVOT_Y = 1317;
    // Tip at source y=23: the 1294px hand fits the ~440px clock face radius.
    public static final float ARROW_SCALE = (224f / 1223) * 440 / 1294;

    private ImpostorLayout() {}
}
