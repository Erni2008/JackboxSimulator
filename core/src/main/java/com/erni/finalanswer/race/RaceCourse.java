package com.erni.finalanswer.race;

import com.badlogic.gdx.math.MathUtils;
import com.badlogic.gdx.math.Vector3;
import java.util.ArrayList;
import java.util.List;

/**
 * Obstacle-race course and its physics. Runs along +Z on a cliff ridge above a misty valley: terraces, a spinning log,
 * a gap bridge, wrecking boulders, drifting rafts, crumbling tiles, a boulder ramp and the finish. Pure logic (no GL),
 * so the same code can later run on the server.
 */
public final class RaceCourse {
    public enum Mat {GRASS, PLANK, STONE}

    /** Walkable solid. Top rises linearly from yTop0 (at z0) to yTop1 (at z1) for ramps. Optional sideways drift or crumbling. */
    public static final class Block {
        public final float x0, x1, z0, z1, yTop0, yTop1; public float bottom; public final Mat mat;
        public float driftAmp, driftPeriod, driftPhase; public boolean crumbles;
        public float offX, offY, lastOffX; public float crumbleAt = -1, fallV; public boolean gone;
        Block(float x0, float x1, float z0, float z1, float bottom, float y0, float y1, Mat m) {this.x0 = x0; this.x1 = x1; this.z0 = z0; this.z1 = z1; this.bottom = bottom; yTop0 = y0; yTop1 = y1; mat = m;}
        public float top(float z) {float t = z1 == z0 ? 0 : MathUtils.clamp((z - z0) / (z1 - z0), 0, 1); return yTop0 + (yTop1 - yTop0) * t + offY;}
        public float cx() {return (x0 + x1) / 2 + offX;}
        public boolean ramp() {return yTop0 != yTop1;}
    }
    /** Log rotating about a vertical axis at (x, y, z). */
    public static final class Sweeper {public final float x, y, z, len, speed; public float angle; Sweeper(float x, float y, float z, float len, float speed) {this.x = x; this.y = y; this.z = z; this.len = len; this.speed = speed;}}
    /** Boulder hanging from a pivot, swinging across X. */
    public static final class Pendulum {public final float px, py, pz, len, amp, period, phase, radius = 1.15f; public final Vector3 bob = new Vector3(); public float swing;
        Pendulum(float px, float py, float pz, float len, float amp, float period, float phase) {this.px = px; this.py = py; this.pz = pz; this.len = len; this.amp = amp; this.period = period; this.phase = phase;}}
    /** Boulder rolling down the ramp towards the runners. */
    public static final class Boulder {public final Vector3 pos = new Vector3(); public float vz, spin, radius; public boolean alive = true;}

    public final List<Block> blocks = new ArrayList<>();
    public final List<Sweeper> sweepers = new ArrayList<>();
    public final List<Pendulum> pendulums = new ArrayList<>();
    public final List<Boulder> boulders = new ArrayList<>();
    public final float[] checkpoints; public final float finishZ;
    public final float rampZ0, rampZ1, rampY0, rampY1; private float boulderTimer = 1.5f; private int boulderSeed = 7;
    public float time;
    public static final float DEATH_Y = -12, BOTTOM = -16;

    public RaceCourse() {
        float z = 0;
        // 1. start meadow
        add(-9, 9, -6, 18, 0, 0, Mat.GRASS); z = 18;
        // 2. terraces climbing up (each step jumpable), alternate sides open
        add(-8, 8, z, z + 9, .9f, .9f, Mat.GRASS); add(-8, 8, z + 9, z + 18, 1.8f, 1.8f, Mat.GRASS); add(-8, 8, z + 18, z + 27, 2.7f, 2.7f, Mat.GRASS); z += 27;
        float y = 2.7f;
        // 3. spinning log arena
        add(-10, 10, z, z + 22, y, y, Mat.STONE); sweepers.add(new Sweeper(0, y + .55f, z + 11, 9.5f, 1.25f)); z += 22;
        // 4. gap bridge: planks with gaps over the abyss
        float[] seg = {3.2f, 2.6f, 2.6f, 2.2f, 2.6f, 2f, 3f};
        for (int i = 0; i < seg.length; i++) {add(-2.2f, 2.2f, z, z + seg[i], y, y, Mat.PLANK); z += seg[i] + (i < seg.length - 1 ? 1.7f : 0);}
        // 5. wrecking boulders over a long stone causeway
        add(-6, 6, z, z + 30, y, y, Mat.STONE);
        for (int i = 0; i < 3; i++) pendulums.add(new Pendulum(0, y + 8.4f, z + 6 + i * 9, 7.3f, .85f, 2.6f, i * 1.9f));
        z += 30;
        // 6. drifting rafts across the gorge
        for (int i = 0; i < 4; i++) {Block b = add(-2.3f, 2.3f, z + 1.6f, z + 6.2f, y, y, Mat.PLANK); b.driftAmp = 4.2f; b.driftPeriod = 3.4f + i * .35f; b.driftPhase = i * 1.7f; z += 6.2f;}
        z += 1.6f; add(-7, 7, z, z + 8, y, y, Mat.GRASS); z += 8;
        // 7. crumbling tiles (3 lanes x 5 rows)
        for (int r = 0; r < 5; r++) for (int c = -1; c <= 1; c++) {Block b = add(c * 3.2f - 1.4f, c * 3.2f + 1.4f, z + r * 3.2f + .2f, z + r * 3.2f + 3f, y, y, Mat.STONE); b.crumbles = true; b.bottom = y - .9f;}
        z += 16; add(-8, 8, z, z + 7, y, y, Mat.GRASS); z += 7;
        // 8. ramp with rolling boulders
        rampZ0 = z; rampZ1 = z + 34; rampY0 = y; rampY1 = y + 7.5f;
        add(-7, 7, rampZ0, rampZ1, rampY0, rampY1, Mat.GRASS); z = rampZ1; y = rampY1;
        // 9. second terraces down and finish plaza
        add(-8, 8, z, z + 9, y, y, Mat.GRASS); add(-8, 8, z + 9, z + 16, y - .9f, y - .9f, Mat.GRASS); z += 16; y -= .9f;
        add(-11, 11, z, z + 22, y, y, Mat.STONE); finishZ = z + 12;
        checkpoints = new float[]{0, 46, 101, 145, 176, rampZ1 + 1};
    }
    private Block add(float x0, float x1, float z0, float z1, float y0, float y1, Mat m) {Block b = new Block(x0, x1, z0, z1, m == Mat.PLANK ? Math.min(y0, y1) - .42f : BOTTOM, y0, y1, m); blocks.add(b); return b;}

    public float spawnY(float z) {float best = 0; for (Block b : blocks) if (!b.crumbles && b.driftAmp == 0 && z >= b.z0 && z <= b.z1) best = Math.max(best, b.top(z)); return best;}

    /** Advances moving parts. Runners are stepped separately with {@link #move}. */
    public void step(float dt) {
        time += dt;
        for (Block b : blocks) {
            b.lastOffX = b.offX;
            if (b.driftAmp > 0) b.offX = b.driftAmp * MathUtils.sin(MathUtils.PI2 * time / b.driftPeriod + b.driftPhase);
            if (b.crumbles && b.crumbleAt >= 0) {
                float t = time - b.crumbleAt;
                if (t > .75f) {b.fallV += 26 * dt; b.offY -= b.fallV * dt; if (b.offY < -6) b.gone = true;}
                if (t > 4.5f) {b.crumbleAt = -1; b.offY = 0; b.fallV = 0; b.gone = false;}
            }
        }
        for (Sweeper s : sweepers) s.angle += s.speed * dt;
        for (Pendulum p : pendulums) {p.swing = p.amp * MathUtils.sin(MathUtils.PI2 * time / p.period + p.phase); p.bob.set(p.px + MathUtils.sin(p.swing) * p.len, p.py - MathUtils.cos(p.swing) * p.len, p.pz);}
        boulderTimer -= dt;
        if (boulderTimer <= 0) {boulderSeed = boulderSeed * 1103515245 + 12345; float r = ((boulderSeed >>> 8) & 1023) / 1023f;
            Boulder bo = new Boulder(); bo.radius = 1.1f + .4f * r; bo.pos.set(-4.6f + 9.2f * r, rampY1 + bo.radius, rampZ1 - 1); boulders.add(bo); boulderTimer = 1.7f + .8f * r;}
        float slope = (rampY1 - rampY0) / (rampZ1 - rampZ0);
        for (Boulder bo : boulders) {
            bo.vz -= 9 * dt; bo.pos.z += bo.vz * dt; bo.spin += bo.vz * dt / bo.radius;
            if (bo.pos.z > rampZ0) bo.pos.y = rampY0 + (bo.pos.z - rampZ0) * slope + bo.radius; else {bo.pos.y -= 30 * dt * dt * 60;}
            if (bo.pos.y < DEATH_Y - 10) bo.alive = false;
        }
        boulders.removeIf(b -> !b.alive);
    }

    /** One runner physics step. */
    public void move(RaceRunner r, float dt) {
        if (r.finished) {r.vel.setZero(); return;}
        r.stun = Math.max(0, r.stun - dt); r.coyote -= dt; r.jumpBuffer -= dt;
        float ix = r.inX, iz = r.inZ, il = (float) Math.sqrt(ix * ix + iz * iz); if (il > 1) {ix /= il; iz /= il;}
        float speed = 8.2f, acc = r.ground != null ? 46 : 16; if (r.stun > 0) acc = 3;
        r.vel.x = approach(r.vel.x, ix * speed, acc * dt); r.vel.z = approach(r.vel.z, iz * speed, acc * dt);
        if (il > .1f) r.facing = MathUtils.atan2(ix, iz);
        if (r.jump) {r.jumpBuffer = .14f; r.jump = false;}
        if (r.jumpBuffer > 0 && r.coyote > 0 && r.stun <= 0) {r.vel.y = 9.6f; r.coyote = 0; r.jumpBuffer = 0; r.ground = null; r.jumps++;}
        r.vel.y -= (r.vel.y > 0 && !r.holdJump ? 38 : 26) * dt;
        if (r.ground != null) r.pos.x += r.ground.offX - r.ground.lastOffX; // ride drifting rafts
        float prevY = r.pos.y;
        r.pos.mulAdd(r.vel, dt);
        Block landed = null;
        for (Block b : blocks) {
            if (b.gone) continue;
            float x0 = b.x0 + b.offX, x1 = b.x1 + b.offX;
            float cx = MathUtils.clamp(r.pos.x, x0, x1), cz = MathUtils.clamp(r.pos.z, b.z0, b.z1);
            float dx = r.pos.x - cx, dz = r.pos.z - cz, d2 = dx * dx + dz * dz;
            if (d2 > RaceRunner.R * RaceRunner.R) continue;
            float top = b.top(cz);
            boolean over = r.pos.x > x0 - RaceRunner.R * .5f && r.pos.x < x1 + RaceRunner.R * .5f && r.pos.z > b.z0 - RaceRunner.R * .5f && r.pos.z < b.z1 + RaceRunner.R * .5f;
            if (over && r.vel.y <= .01f && r.pos.y <= top + .05f && prevY >= top - .45f - (b.ramp() ? .5f : 0)) {r.pos.y = top; r.vel.y = 0; landed = b; continue;}
            if (r.pos.y < top - .45f && r.pos.y + RaceRunner.H > b.bottom) {
                if (d2 > 1e-6f) {float d = (float) Math.sqrt(d2); float push = RaceRunner.R - d; r.pos.x += dx / d * push; r.pos.z += dz / d * push;
                    if (Math.abs(dx) > Math.abs(dz)) r.vel.x = 0; else r.vel.z = 0;}
                else { // centre inside: leave through nearest face
                    float l = r.pos.x - x0, rr = x1 - r.pos.x, f = r.pos.z - b.z0, k = b.z1 - r.pos.z, m = Math.min(Math.min(l, rr), Math.min(f, k));
                    if (m == l) r.pos.x = x0 - RaceRunner.R; else if (m == rr) r.pos.x = x1 + RaceRunner.R; else if (m == f) r.pos.z = b.z0 - RaceRunner.R; else r.pos.z = b.z1 + RaceRunner.R;}
            }
        }
        r.ground = landed; if (landed != null) {r.coyote = .1f; if (landed.crumbles && landed.crumbleAt < 0) landed.crumbleAt = time;}
        // hazards
        for (Sweeper s : sweepers) {
            float ex = MathUtils.cos(s.angle) * s.len, ez = MathUtils.sin(s.angle) * s.len;
            float t = MathUtils.clamp(((r.pos.x - s.x) * ex + (r.pos.z - s.z) * ez) / (ex * ex + ez * ez), -1, 1);
            float px = s.x + ex * t, pz = s.z + ez * t, dx = r.pos.x - px, dz = r.pos.z - pz, d = (float) Math.sqrt(dx * dx + dz * dz);
            if (d < RaceRunner.R + .42f && r.pos.y < s.y + .45f && r.pos.y + RaceRunner.H > s.y - .45f) {
                float tx = -MathUtils.sin(s.angle) * Math.signum(t + 1e-4f), tz = MathUtils.cos(s.angle) * Math.signum(t + 1e-4f);
                hit(r, tx * 11 + (d > 0 ? dx / d * 4 : 0), 6.5f, tz * 11 + (d > 0 ? dz / d * 4 : 0));}
        }
        for (Pendulum p : pendulums) {float cy = r.pos.y + RaceRunner.H * .5f, dx = r.pos.x - p.bob.x, dy = cy - p.bob.y, dz = r.pos.z - p.bob.z;
            if (dx * dx + dy * dy + dz * dz < (p.radius + RaceRunner.R + .2f) * (p.radius + RaceRunner.R + .2f)) {float dir = Math.signum(MathUtils.cos(MathUtils.PI2 * p.swing) * MathUtils.cos(MathUtils.PI2 * time / p.period + p.phase)); if (dir == 0) dir = Math.signum(dx);
                hit(r, (dir == 0 ? 1 : dir) * 15, 7, dz * .6f);}}
        for (Boulder bo : boulders) {float cy = r.pos.y + RaceRunner.H * .5f, dx = r.pos.x - bo.pos.x, dy = cy - bo.pos.y, dz = r.pos.z - bo.pos.z, rr = bo.radius + RaceRunner.R;
            if (dx * dx + dy * dy + dz * dz < rr * rr) hit(r, Math.signum(dx) * 4, 6, -12);}
        // progress, falls, finish
        for (int i = checkpoints.length - 1; i >= 0; i--) if (r.pos.z >= checkpoints[i] && r.ground != null && !r.ground.crumbles && r.ground.driftAmp == 0) {r.checkpoint = Math.max(r.checkpoint, i); break;}
        if (r.pos.y < DEATH_Y) respawn(r);
        r.progress = Math.max(r.progress, r.pos.z);
        if (r.pos.z >= finishZ && r.ground != null && !r.finished) {r.finished = true; r.finishTime = time;}
    }
    private void hit(RaceRunner r, float vx, float vy, float vz) {if (r.stun > .25f) return; r.vel.set(vx, vy, vz); r.stun = .55f; r.ground = null; r.coyote = 0; r.hits++;}
    public void respawn(RaceRunner r) {float z = checkpoints[r.checkpoint] + 2; r.pos.set(((r.slot % 5) - 2) * 1.4f, spawnY(z) + 1.5f, z); r.vel.setZero(); r.ground = null; r.falls++; r.stun = .3f;}
    private static float approach(float v, float t, float d) {return v < t ? Math.min(t, v + d) : Math.max(t, v - d);}
}
