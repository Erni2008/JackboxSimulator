package com.erni.finalanswer.ui.lobby.cages;

import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.g2d.Batch;
import com.badlogic.gdx.graphics.g2d.BitmapFont;
import com.badlogic.gdx.math.MathUtils;
import com.badlogic.gdx.math.Vector2;
import com.badlogic.gdx.scenes.scene2d.Group;
import com.badlogic.gdx.scenes.scene2d.Touchable;

/** A complete suspended assembly. Chain endpoints are computed from the transformed upper ring. */
public final class HangingCage extends Group {
    public static final float WIDTH = 300, HEIGHT = 333;
    // pivot = the shackle on top of the code-built cage (Cage3D)
    private static final float RING_X = Cage3D.CX, RING_Y = Cage3D.BASE_Y + Cage3D.TOP + 70;
    // Centre of the existing gate keyhole, calibrated from the source PNG.
    private static final float KEYHOLE_X = Cage3D.CX + 10, KEYHOLE_Y = Cage3D.BASE_Y + 30;
    private static final float TILT = -6;
    private final CageAssets assets;
    private final CageNameplate nameplate;
    private final CageCharacterPresentation presentation=new CageCharacterPresentation();
    private final CageAnimator animation = new CageAnimator();
    private final Color saved = new Color();
    private final Vector2 endpoint = new Vector2(), ceiling = new Vector2(); private final com.badlogic.gdx.math.Matrix4 charWorld = new com.badlogic.gdx.math.Matrix4();
    private final float phase; private float idle;
    // escape attempts: 0 none, 1 rattle the door, 2 pry the bars apart, 3 throw the cage about on its chain, 4 force the head between the bars
    private int struggle; private float struggleT, nextStruggle = 6, strength; private final java.util.Random rng;
    private float doorJx, doorJy, pry, charJx, charJy, charSx = 1, charSy = 1, swing, gripL, gripR, lastPull;
    private java.util.function.Consumer<Float> struggleCue = s -> {};
    public void setStruggleCue(java.util.function.Consumer<Float> cue) { struggleCue = java.util.Objects.requireNonNull(cue); }
    private CageCharacter character;
    private String playerId, nickname = "", characterId = "";
    private float ceilingX, ceilingY;
    private boolean reducedMotion;
    private float departureRotation;
    private boolean cinematic;
    public void cinematic(boolean active){cinematic=active;}
    /** Match-start-only motion; idle and impact animation are unchanged. */
    public void departure(float seconds){departureRotation=reducedMotion?0:LobbyStartAnimation.rotation(seconds,phase);}
    private Runnable impactCue = () -> {}, lockCue = () -> {};

    public HangingCage(CageAssets assets, BitmapFont font, int slot) {
        this.assets = assets; nameplate = new CageNameplate(font);
        phase = slot * 2.39996f; rng = new java.util.Random(slot * 7919L + 13); nextStruggle = 5 + rng.nextFloat() * 8;
        setSize(WIDTH, HEIGHT); setOrigin(RING_X, RING_Y);
        setTouchable(Touchable.disabled);
    }
    /** Optional audio hooks; closing impact and locking retain distinct event markers. */
    public void setSoundCues(Runnable impact, Runnable lock) {
        impactCue = java.util.Objects.requireNonNull(impact); lockCue = java.util.Objects.requireNonNull(lock);
    }
    public CageCharacter character() { return character; }
    public String playerId() { return playerId; }
    public CageAnimator animation() { return animation; }
    public void assign(String id, String name, String selected, CageCharacter next) {
        if (id.equals(playerId)) {
            if (next != null) { character = next; characterId = selected; }
            rename(name); return;
        }
        playerId = id; characterId = selected; character = next; rename(name); animation.start();
    }
    public String characterId() { return characterId; }
    private void rename(String value) {
        if (nickname.equals(value)) return;
        nickname = value;
        nameplate.setText(nickname);
    }
    public void clear() { playerId = null; nickname = characterId = ""; character = null; animation.reset(); }
    public void reducedMotion(boolean value) { reducedMotion = value; }
    public void place(float left, float bottom, float scale, float top) {
        setPosition(left, bottom); setScale(scale);
        ceilingX = left + RING_X; // Group scaling is around the ring, so its parent position is unchanged.
        ceilingY = top;
    }
    @Override public void act(float delta) {
        super.act(delta);
        animation.update(delta);
        if (animation.impact()) impactCue.run();
        if (animation.locked()) lockCue.run();
        // idle: each cage drifts on its chain in its own slow rhythm (two incommensurate swings, under a degree)
        updateStruggle(delta);
        idle+=delta; float drift=swing+(animation.occupied()||playerId==null?(float)(Math.sin(idle*.62f+phase)*.55+Math.sin(idle*1.13f+phase*1.7f)*.25):0);
        setRotation(reducedMotion||cinematic ? 0 : animation.impactRotation()+departureRotation+drift);
        if (character != null) character.update(delta, animation.time(), phase, reducedMotion);
    }
    @Override public void draw(Batch batch, float parentAlpha) {
        saved.set(batch.getColor());
        endpoint.set(RING_X, RING_Y); localToStageCoordinates(endpoint); // the 3D pass draws in stage space
        ceiling.set(ceilingX, ceilingY); if (getParent() != null) getParent().localToStageCoordinates(ceiling);
        var c3 = assets.cage3d; var camera = getStage().getCamera(); var world = computeTransform();
        float yaw = reducedMotion ? 0 : (float) Math.sin(idle * .32f + phase) * 13 + animation.impactRotation() * 6;
        // pass 1 (3D): ceiling bracket, chain, the cage half behind the prisoner
        batch.end(); c3.begin(camera); c3.bracket(ceiling.x, ceiling.y - 8); c3.chain(ceiling.x, ceiling.y - 26, endpoint.x, endpoint.y + 4); c3.cage(world, yaw, TILT, false); c3.end(); batch.begin();
        charWorld.set(world).translate(Cage3D.CX + charJx, Cage3D.BASE_Y + 8 + charJy, 0).scale(charSx, charSy, 1).translate(-Cage3D.CX, -(Cage3D.BASE_Y + 8), 0);
        applyTransform(batch, charWorld);
        // pass 2 (2D): a soft contact shadow on the cage floor, then the prisoner standing inside
        if (character != null) { batch.setColor(0, 0, 0, .55f * parentAlpha); batch.draw(assets.softDot, Cage3D.CX - 62, Cage3D.BASE_Y + 1, 124, 16); batch.setColor(1, 1, 1, parentAlpha); }
        if (character != null && clipBegin(Cage3D.CX - Cage3D.R + 6, Cage3D.BASE_Y + 6, Cage3D.R * 2 - 12, Cage3D.TOP - 8)) {
            presentation.drawInCage(batch, character, assets.presentation.profile(characterId), parentAlpha, animation.time());
            batch.flush(); clipEnd();
        }
        resetTransform(batch);
        // pass 3 (3D): front bars, dome, shackle, and the door dropping into place
        batch.end(); c3.begin(camera); c3.cage(world, yaw, TILT, true);
        c3.flush(); // the dome and front bars must not be clipped by the door's scissor
        if (animation.occupied() && animation.gate() > 0) { applyTransform(batch, world);
            boolean clipped = clipBegin(Cage3D.CX - Cage3D.R - 14, Cage3D.BASE_Y, Cage3D.R * 2 + 28, Cage3D.TOP + 4);
            c3.door(world, yaw, TILT, (1 - animation.gate()) * Cage3D.TOP, doorJx, doorJy, pry); c3.end(); if (clipped) clipEnd(); resetTransform(batch); }
        else c3.end();
        batch.begin(); applyTransform(batch, world);
        drawKey(batch, parentAlpha);
        if (playerId != null && !cinematic) {
            batch.setColor(1, 1, 1, parentAlpha); batch.draw(assets.plate, CageNameplate.X - 12, CageNameplate.Y - 7, CageNameplate.WIDTH + 24, CageNameplate.HEIGHT + 14);
            batch.flush(); if (clipBegin(CageNameplate.X, CageNameplate.Y, CageNameplate.WIDTH, CageNameplate.HEIGHT)) { nameplate.draw(batch, parentAlpha); batch.flush(); clipEnd(); }
        }
        resetTransform(batch); batch.setColor(saved);
    }
    private static final float[] STRUGGLE_LEN = {0, 1.7f, 2.4f, 1.6f, 2.8f};
    private void updateStruggle(float delta) {
        boolean locked = animation.occupied() && animation.time() > CageAnimator.LOCKED_AT + 1 && character != null && !cinematic && !reducedMotion;
        if (!locked) { struggle = 0; doorJx = doorJy = pry = charJx = charJy = swing = gripL = gripR = 0; charSx = charSy = 1; if (character != null) character.grip(0, 0); return; }
        float test = Float.parseFloat(System.getProperty("cage.grip", "-1")); if (test >= 0) { struggle = 0; character.grip(test, test); doorJx = doorJy = pry = charJx = charJy = swing = 0; charSx = charSy = 1; return; } // dev: hold a fixed arm angle
        int forced = Integer.getInteger("cage.struggle", 0); if (forced > 0 && struggle == 0) { struggle = forced; struggleT = 0; strength = 1; }
        if (struggle == 0) { nextStruggle -= delta; if (nextStruggle <= 0) { struggle = 1 + rng.nextInt(4); struggleT = 0; strength = .7f + rng.nextFloat() * .5f; } }
        doorJx = doorJy = pry = charJx = charJy = swing = 0; charSx = charSy = 1;
        // arms ease back to the character's own pose between attempts
        float relax = 1 - (float) Math.exp(-delta * 5); gripL += (0 - gripL) * relax; gripR += (0 - gripR) * relax;
        if (struggle == 0) { character.grip(gripL, gripR); return; }
        struggleT += delta; float len = STRUGGLE_LEN[struggle], t = struggleT / len;
        if (t >= 1) { struggle = 0; nextStruggle = 6 + rng.nextFloat() * 10; character.grip(gripL, gripR); return; }
        float gl = 0, gr = 0;
        float in = Math.min(1, struggleT / .45f), out = Math.min(1, (len - struggleT) / .5f), env = in * in * (3 - 2 * in) * out * out * (3 - 2 * out) * strength, k = struggleT; // reach up, then let go
        switch (struggle) {
            case 1 -> { // grabs the door and yanks it: the gate rattles in its frame, the prisoner lunges with each pull
                float cyc = (float) Math.sin(k * 7.5f), pull = Math.max(0, cyc), slam = (float) Math.pow(Math.max(0, -cyc), 3);
                doorJx = (float) Math.sin(k * 47) * 1.2f * slam * env; doorJy = (1.6f * pull - 1.2f * slam) * env; charJx = (float) Math.sin(k * 3.7f) * 1.2f * env;
                charSx = charSy = 1 - .035f * pull * env + .05f * slam * env; charJy = 2.5f * slam * env; swing = (-.25f * pull + .45f * slam) * env;
                gl = 118 - 12 * pull + 6 * slam; gr = 116 - 12 * pull + 6 * slam;   // fists on the bars above the head: haul back, slam forward
                if (slam > .6f && lastPull <= .6f) struggleCue.accept(.55f + .45f * env); lastPull = slam; }
            case 2 -> { // pries two bars apart: they bow out slowly, hold, spring back; the body strains wide
                float bend = (float) Math.sin(Math.min(1, t * 1.6f) * Math.PI * .5) * (t > .7f ? (1 - (t - .7f) / .3f) : 1);
                pry = .13f * bend * strength; charSx = 1 + .07f * bend * env; charSy = 1 - .025f * bend * env; charJx = (float) Math.sin(k * 31) * .9f * bend * env; doorJx = (float) Math.sin(k * 39) * .5f * bend;
                gl = gr = 98 + 26 * bend;   // hands high on two bars, forcing them apart
                if (bend > .95f && lastPull < .95f) struggleCue.accept(.7f); lastPull = bend; }
            case 3 -> { // throws itself against the bars: the cage swings hard on its chain
                swing = (float) Math.sin(k * 6.5f) * 2.6f * env; charJx = (float) Math.sin(k * 6.5f - .6f) * 6 * env; charSx = 1 + .03f * Math.abs((float) Math.sin(k * 13)) * env;
                float sw = (float) Math.sin(k * 6.5f); gl = 112 + 12 * sw; gr = 112 - 12 * sw;   // hanging on the bars overhead, throwing the weight side to side
                if (Math.abs(sw) > .95f && Math.abs(lastPull) <= .95f) struggleCue.accept(.8f * env + .2f); lastPull = sw; }
            case 4 -> { // presses the face into the gap: hands widen two bars, the body pushes forward and up, then shoves in jerks
                float push = (float) Math.sin(Math.min(1, t * 1.4f) * Math.PI * .5) * (t > .78f ? (1 - (t - .78f) / .22f) : 1), jerk = (float) Math.pow(Math.max(0, Math.sin(k * 9)), 4);
                pry = .07f * push * strength; charSx = charSy = 1 + (.1f + .03f * jerk) * push; charJy = (10 + 3 * jerk) * push; charJx = (float) Math.sin(k * 23) * .8f * push;
                gl = gr = 102 + 14 * push; doorJx = (float) Math.sin(k * 41) * .6f * jerk * push;
                if (jerk > .8f && lastPull <= .8f) struggleCue.accept(.45f + .3f * push); lastPull = jerk; }
        }
        float follow = 1 - (float) Math.exp(-delta * 9); gripL += (gl * env / Math.max(.001f, strength) - gripL) * follow; gripR += (gr * env / Math.max(.001f, strength) - gripR) * follow; character.grip(gripL, gripR);
    }
    private void drawKey(Batch batch, float alpha) {
        float p = (animation.time() - CageAnimator.KEY_AT) / CageAnimator.KEY;
        if (!animation.occupied() || p <= 0 || p >= 1) return;
        float insertion = CageAnimator.smooth(CageAnimator.progress(p, 0, .27f));
        float removal = CageAnimator.smooth(CageAnimator.progress(p, .79f, .21f));
        float turn = CageAnimator.smooth(CageAnimator.progress(p, .3f, .22f));
        float back = CageAnimator.smooth(CageAnimator.progress(p, .64f, .14f));
        float scale = 1.1f - .18f * insertion + .18f * removal;
        float x = KEYHOLE_X + 45 * (1 - insertion + removal), y = KEYHOLE_Y;
        batch.setColor(1, 1, 1, alpha * Math.min(1, Math.min(p * 12, (1 - p) * 12)));
        // The end of the shaft is the pivot; the keyhole does not orbit with the bow.
        batch.draw(assets.key, x - 30, y - 15, 30, 15, 60, 120, scale, scale, 90 * (turn - back));
        batch.setColor(1, 1, 1, alpha);
    }
    private void drawChain(Batch batch, float x1, float y1, float x2, float y2) {
        float dx = x2 - x1, dy = y2 - y1;
        float length = (float)Math.sqrt(dx * dx + dy * dy);
        if (length < 1) return;
        float angle = MathUtils.atan2(dy, dx) * MathUtils.radiansToDegrees - 90;
        // Repeat the existing chain strip at its native aspect. Only the last strip is shortened.
        float strip = 66, width = strip * assets.chain.getRegionWidth() / assets.chain.getRegionHeight();
        for (float offset = 0; offset < length; offset += strip) {
            float segment = Math.min(strip, length - offset);
            float x = x1 + dx * offset / length, y = y1 + dy * offset / length;
            batch.draw(assets.chain.getTexture(), x - width / 2, y, width / 2, 0, width, segment,
                1, 1, angle, assets.chain.getRegionX(), assets.chain.getRegionY(),
                assets.chain.getRegionWidth(), Math.max(1, Math.round(assets.chain.getRegionHeight() * segment / strip)), false, false);
        }
    }
}
