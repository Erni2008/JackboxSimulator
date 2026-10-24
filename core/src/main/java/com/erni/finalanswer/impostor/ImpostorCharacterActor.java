package com.erni.finalanswer.impostor;

import com.badlogic.gdx.graphics.g2d.Batch;
import com.badlogic.gdx.math.Matrix4;
import com.badlogic.gdx.scenes.scene2d.Actor;
import com.badlogic.gdx.scenes.scene2d.Touchable;
import com.erni.finalanswer.rooms.RoomSession;
import com.erni.finalanswer.ui.lobby.cages.*;

/** Independent animated portrait, borrowing the room's shared textures and material profile. */
public final class ImpostorCharacterActor extends Actor {
    private final CageCharacter character;
    private final CageCharacterPresentation.Profile profile;
    private final CageCharacterPresentation presentation = new CageCharacterPresentation();
    private final Matrix4 saved = new Matrix4(), local = new Matrix4();
    private final float phase, floor, height;
    private float time = 8;
    private boolean portraitFraming;
    public void portraitFraming(boolean value){portraitFraming=value;}

    public ImpostorCharacterActor(CageLobby source, RoomSession.Player player) {
        character = source.createCharacter(player.characterId());
        profile = source.presentation(player.characterId());
        phase = (player.id().hashCode() & 0xffff) * .001f;
        height = switch (player.characterId()) {
            case "skeleton" -> 120; case "ghost" -> 152;
            case "plague_doctor" -> 194; case "voodoo" -> 153; default -> 160;
        };
        floor = switch (player.characterId()) {
            case "skeleton", "ghost" -> 69; case "puppeteer" -> 68;
            case "pumpkin" -> 67; default -> 63;
        };
        setSize(180, 280);
        setTouchable(Touchable.disabled);
        // Enter the established idle without replaying cage entrances on every portrait rebuild.
        for (int i = 1; i <= 240; i++) character.update(1f / 30, i / 30f, phase, false);
    }

    @Override public void act(float delta) {
        super.act(delta);
        if (!Float.isFinite(delta) || delta <= 0) return;
        time += delta;
        character.update(delta, time, phase, false);
    }

    @Override public void draw(Batch batch, float parentAlpha) {
        saved.set(batch.getTransformMatrix());
        float previousColor=batch.getPackedColor();batch.setColor(getColor().r,getColor().g,getColor().b,1);
        // Reserve headroom for limbs/accessories and the existing procedural idle.
        float scale = portraitFraming?getWidth()/160:Math.min(getWidth() / 135, getHeight() / (height * 1.10f));
        local.set(saved).translate(getX() + getWidth() / 2, portraitFraming?getY()+getHeight()*.92f-height*scale:getY()+5, 0)
                .scale(scale, scale, 1).translate(-174, -floor, 0);
        try {
            batch.setTransformMatrix(local);
            presentation.draw(batch, character, profile, parentAlpha * getColor().a, time);
        } finally {
            batch.setTransformMatrix(saved);batch.setPackedColor(previousColor);
        }
    }
}
