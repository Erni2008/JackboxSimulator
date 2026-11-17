package com.erni.finalanswer.race;

import com.badlogic.gdx.math.Vector3;

/** One racer: input (stick + jump), physics state and race stats. */
public final class RaceRunner {
    public static final float R = .42f, H = 1.55f;
    public final String id, name, character; public final int slot; public final boolean bot;
    public final Vector3 pos = new Vector3(), vel = new Vector3();
    public float inX, inZ, facing, stun, coyote, jumpBuffer, progress, finishTime, anim;
    public boolean jump, holdJump, finished; public int checkpoint, falls, hits, jumps;
    public RaceCourse.Block ground;
    // bot brain
    float botJumpCool, botLane;
    public RaceRunner(String id, String name, String character, int slot, boolean bot) {this.id = id; this.name = name; this.character = character; this.slot = slot; this.bot = bot; botLane = ((slot % 5) - 2) * .9f;}
}
