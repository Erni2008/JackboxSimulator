package com.erni.finalanswer.race;

import com.badlogic.gdx.math.MathUtils;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

/** Race rules: 3-2-1 countdown, two-minute limit, placings by finish time then distance. Fixed 120 Hz physics. */
public final class RaceGame {
    public static final float LIMIT = 120, COUNTDOWN = 3.5f, STEP = 1 / 120f;
    public final RaceCourse course = new RaceCourse(); public final List<RaceRunner> runners = new ArrayList<>();
    public float clock; private float acc;
    public RaceRunner add(String id, String name, String character, boolean bot) {
        RaceRunner r = new RaceRunner(id, name, character, runners.size(), bot); r.pos.set(((r.slot % 4) - 1.5f) * 2.2f, 0, -2 - (r.slot / 4) * 2.2f); runners.add(r); return r;}
    public boolean running() {return clock >= COUNTDOWN && !over();}
    public float timeLeft() {return Math.max(0, LIMIT - Math.max(0, clock - COUNTDOWN));}
    public boolean over() {if (clock - COUNTDOWN >= LIMIT) return true; for (RaceRunner r : runners) if (!r.finished) return false; return !runners.isEmpty();}
    public void update(float dt) {
        acc += Math.min(dt, .1f);
        while (acc >= STEP) {acc -= STEP; clock += STEP;
            course.step(STEP);
            for (RaceRunner r : runners) {if (r.bot) think(r); if (!running()) {r.inX = r.inZ = 0; r.jump = false;} course.move(r, STEP);}}
    }
    /** Placings: finishers by time, then everyone else by distance travelled. */
    public List<RaceRunner> standings() {
        List<RaceRunner> l = new ArrayList<>(runners);
        l.sort(Comparator.<RaceRunner>comparingInt(r -> r.finished ? 0 : 1).thenComparingDouble(r -> r.finished ? r.finishTime : -r.progress)); return l;}

    /** Simple bot: run the centreline (or ride the raft), jump at steps, gaps, logs and boulders, with human-ish delay. */
    private void think(RaceRunner r) {
        RaceCourse c = course; r.botJumpCool -= STEP; float tx = r.botLane;
        if (r.ground != null && r.ground.driftAmp > 0) tx = r.ground.cx();
        for (RaceCourse.Block b : c.blocks) if (b.driftAmp > 0 && b.z0 > r.pos.z && b.z0 - r.pos.z < 2.5f) tx = b.cx();
        r.inX = MathUtils.clamp((tx - r.pos.x) * .6f, -1, 1); r.inZ = 1;
        boolean want = false;
        float ahead = r.pos.z + 1.3f, here = r.ground != null ? r.ground.top(r.pos.z) : r.pos.y; boolean support = false;
        for (RaceCourse.Block b : c.blocks) {if (b.gone) continue; float x0 = b.x0 + b.offX, x1 = b.x1 + b.offX;
            if (r.pos.x >= x0 && r.pos.x <= x1 && ahead >= b.z0 && ahead <= b.z1) {support = true; if (b.top(ahead) > here + .35f) want = true;}}
        if (!support) want = true;
        for (var s : c.sweepers) {float ex = MathUtils.cos(s.angle) * s.len, ez = MathUtils.sin(s.angle) * s.len; float t = MathUtils.clamp(((r.pos.x - s.x) * ex + (r.pos.z - s.z) * ez) / (ex * ex + ez * ez), -1, 1);
            float dx = r.pos.x - (s.x + ex * t), dz = r.pos.z - (s.z + ez * t); if (dx * dx + dz * dz < 1.7f * 1.7f) want = true;}
        for (var b : c.boulders) if (Math.abs(b.pos.x - r.pos.x) < b.radius + .6f && b.pos.z - r.pos.z < 3.2f && b.pos.z > r.pos.z) want = true;
        if (want && r.ground != null && r.botJumpCool <= 0 && MathUtils.random() < .55f) {r.jump = true; r.holdJump = true; r.botJumpCool = .35f;}
        if (r.ground != null && !want) r.holdJump = false;
    }
}
