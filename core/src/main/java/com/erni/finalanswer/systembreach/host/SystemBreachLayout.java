package com.erni.finalanswer.systembreach.host;

import com.badlogic.gdx.math.Rectangle;

/** Every position of the SYSTEM BREACH host screen in one place (1920×1080 world units, y up). */
public final class SystemBreachLayout {
    private SystemBreachLayout(){}
    public static final float W=1920,H=1080;

    public static final Rectangle TIMER=new Rectangle(80,826,380,200);
    public static final Rectangle TITLE=new Rectangle(640,852,640,124);
    public static final float CREST_Y=1018,EMBLEM_Y=826;
    public static final Rectangle LOG=new Rectangle(1420,826,420,200);
    public static final Rectangle BOARD=new Rectangle(330,20,1260,164);

    /** Podium column: panel bottom, panel height, plinth below it. */
    public static final float SLOT_PITCH=226,PANEL_W=186,PANEL_Y=290,PANEL_H=214,PLINTH_H=44;
    /** The character stands with its feet hidden behind the panel's top edge. */
    public static final float CHARACTER_W=172,CHARACTER_H=262,CHARACTER_SINK=60;

    /** Centre of slot {@code i} of {@code n}: always centred, same pitch and scale for 2–8 players. */
    public static float slotX(int i,int n){return W/2+(i-(n-1)/2f)*SLOT_PITCH;}
    public static float panelTop(){return PANEL_Y+PANEL_H;}
}
