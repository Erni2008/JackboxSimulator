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
    private static final float RING_X = 149, RING_Y = 324;
    // Centre of the existing gate keyhole, calibrated from the source PNG.
    private static final float KEYHOLE_X = 226.4f, KEYHOLE_Y = 67.7f;
    private final CageAssets assets;
    private final CageNameplate nameplate;
    private final CageCharacterPresentation presentation=new CageCharacterPresentation();
    private final CageAnimator animation = new CageAnimator();
    private final Color saved = new Color();
    private final Vector2 endpoint = new Vector2();
    private final float phase;
    private CageCharacter character;
    private String playerId, nickname = "", characterId = "";
    private float ceilingX, ceilingY;
    private boolean reducedMotion;
    private Runnable impactCue = () -> {}, lockCue = () -> {};

    public HangingCage(CageAssets assets, BitmapFont font, int slot) {
        this.assets = assets; nameplate = new CageNameplate(font);
        phase = slot * 2.39996f;
        setSize(WIDTH, HEIGHT); setOrigin(RING_X, RING_Y);
        setTouchable(Touchable.disabled);
    }
    /** Optional audio hooks; the lobby has no supplied metallic/locking sound assets. */
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
        setRotation(reducedMotion ? 0 : animation.impactRotation());
        if (character != null) character.update(delta, animation.time(), phase, reducedMotion);
    }
    @Override public void draw(Batch batch, float parentAlpha) {
        saved.set(batch.getColor());
        // Hook is drawn in parent space and never rotates. The chain follows the actual transformed ring.
        endpoint.set(RING_X, RING_Y); localToParentCoordinates(endpoint);
        batch.setColor(1, 1, 1, parentAlpha);
        float hookWidth = 25, hookHeight = 23;
        batch.draw(assets.hook, ceilingX - hookWidth / 2, ceilingY - hookHeight, hookWidth, hookHeight);
        drawChain(batch, ceilingX, ceilingY - 20, endpoint.x, endpoint.y);
        applyTransform(batch, computeTransform());
        batch.draw(assets.cage, 0, 0, WIDTH, HEIGHT);
        // Both character and sliding bars are confined to the front opening. The opening's iron posts
        // cover the edges; the gate has its own clip so no bars float above the cage during entry.
        batch.flush();
        if (character != null && clipBegin(108, 62, 140, 163)) {
            presentation.draw(batch, character, assets.presentation.profile(characterId), parentAlpha, animation.time());
            batch.flush(); clipEnd();
        }
        if (animation.occupied() && animation.gate() > 0 && clipBegin(91, 58, 177, 179)) {
            float height = 215.68f;
            batch.draw(assets.gate, 104.5f, 42.1f + (1 - animation.gate()) * height, 146.88f, height);
            batch.flush(); clipEnd();
        }
        drawKey(batch, parentAlpha);
        batch.flush();
        if (playerId != null && clipBegin(CageNameplate.X, CageNameplate.Y, CageNameplate.WIDTH, CageNameplate.HEIGHT)) {
            nameplate.draw(batch, parentAlpha);
            batch.flush(); clipEnd();
        }
        resetTransform(batch); batch.setColor(saved);
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
