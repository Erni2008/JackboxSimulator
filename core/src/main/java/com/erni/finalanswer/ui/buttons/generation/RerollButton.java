package com.erni.finalanswer.ui.buttons.generation;

import com.erni.finalanswer.ui.RuntimeTextures;
import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.scenes.scene2d.InputEvent;
import com.badlogic.gdx.scenes.scene2d.ui.Button;
import com.badlogic.gdx.scenes.scene2d.utils.ClickListener;
import com.badlogic.gdx.scenes.scene2d.utils.TextureRegionDrawable;
import com.badlogic.gdx.utils.Disposable;

/** Artwork states only. Supply the code-generation action later. */
public final class RerollButton extends Button implements Disposable {
    private final Texture[] textures = new Texture[3];
    private Runnable onReroll = () -> {};
    private boolean disposed;

    public RerollButton() {
        super(new ButtonStyle());
        setName("rerollCode");
        String[] states = {"up", "hover", "pressed"};
        // Each original has different transparent margins. Align the visible artwork.
        int[][] crops = {{143, 155, 994, 927}, {84, 135, 1088, 974}, {87, 143, 1079, 970}};
        TextureRegionDrawable[] frames = new TextureRegionDrawable[3];
        try {
            for (int i = 0; i < states.length; i++) {
                textures[i] = RuntimeTextures.load("ui/buttons/reroll/reroll_" + states[i] + ".png");
                textures[i].setFilter(Texture.TextureFilter.Linear, Texture.TextureFilter.Linear);
                int[] crop = crops[i];
                frames[i] = new TextureRegionDrawable(RuntimeTextures.region(textures[i],
                    crop[0], crop[1], crop[2], crop[3]));
                frames[i].setMinWidth(0);
                frames[i].setMinHeight(0);
            }
        } catch (RuntimeException error) {
            dispose();
            throw error;
        }
        ButtonStyle style = new ButtonStyle();
        style.up = frames[0];
        style.over = frames[1];
        style.down = frames[2];
        style.checked = frames[0];
        style.checkedOver = frames[1];
        setStyle(style);
        addListener(new ClickListener() {
            @Override
            public void clicked(InputEvent event, float x, float y) {
                if (isDisabled()) return;
                setChecked(false);
                onReroll.run();
            }
        });
    }

    public void setOnReroll(Runnable action) {
        onReroll = java.util.Objects.requireNonNull(action, "action");
    }

    @Override
    public void dispose() {
        if (disposed) return;
        disposed = true;
        for (Texture texture : textures) if (texture != null) texture.dispose();
    }
}
