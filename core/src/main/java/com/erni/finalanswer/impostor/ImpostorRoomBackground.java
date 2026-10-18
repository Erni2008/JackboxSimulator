package com.erni.finalanswer.impostor;

import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.scenes.scene2d.ui.Image;
import com.badlogic.gdx.utils.Scaling;

/** Gentle illumination only: the supplied room variants differ in geometry, so do not crossfade. */
public final class ImpostorRoomBackground extends Image {
    private static final double CYCLE_SECONDS = 16;
    private double elapsed;

    public ImpostorRoomBackground(Texture texture) {
        super(texture);
        setName("impostorBackground");
        setScaling(Scaling.fill);
        setBounds(0, 0, ImpostorLayout.WIDTH, ImpostorLayout.HEIGHT);
    }

    /** Render-thread update, independent of resize and player layout. No textures are owned here. */
    public void update(float delta, boolean reducedMotion) {
        if (reducedMotion) {
            setColor(1, 1, 1, 1);
            return;
        }
        if (Float.isFinite(delta)) elapsed = (elapsed + Math.max(0, delta)) % CYCLE_SECONDS;
        float light = (float)(.97 + .03 * Math.cos(elapsed * (2*Math.PI/CYCLE_SECONDS)));
        setColor(light, light, light, 1);
    }
}
