package com.erni.finalanswer.ui.buttons.generation;

import com.erni.finalanswer.ui.RuntimeTextures;
import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.scenes.scene2d.InputEvent;
import com.badlogic.gdx.scenes.scene2d.ui.Button;
import com.badlogic.gdx.scenes.scene2d.utils.ClickListener;
import com.badlogic.gdx.scenes.scene2d.utils.TextureRegionDrawable;
import com.badlogic.gdx.utils.Disposable;

/** Painted BACK button with immediate hover and pressed states. */
public final class BackButton extends Button implements Disposable {
    private final Texture[] textures = new Texture[2];
    private Runnable onBack = () -> {};
    private boolean disposed;

    public BackButton() {
        super(new ButtonStyle());
        setName("backToMainMenu");
        String[] states = {"back.png", "back_hover.png"};
        // Each original has different transparent margins. Align the visible artwork.
        int[][] crops = {{69, 67, 1999, 589}, {58, 60, 2020, 601}};
        TextureRegionDrawable[] frames = new TextureRegionDrawable[2];
        try {
            for (int i = 0; i < states.length; i++) {
                textures[i] = RuntimeTextures.load("ui/buttons/back/" + states[i]);
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
        style.down = frames[0];
        style.checked = frames[0];
        style.checkedOver = frames[1];
        setStyle(style);
        addListener(new ClickListener() {
            @Override
            public void clicked(InputEvent event, float x, float y) {
                if (isDisabled()) return;
                setChecked(false);
                onBack.run();
            }
        });
    }

    public void setOnBack(Runnable action) {
        onBack = java.util.Objects.requireNonNull(action, "action");
    }

    @Override
    public void dispose() {
        if (disposed) return;
        disposed = true;
        for (Texture texture : textures) if (texture != null) texture.dispose();
    }
}
