package com.erni.finalanswer.ui.buttons.generation;

import com.erni.finalanswer.ui.RuntimeTextures;
import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.scenes.scene2d.InputEvent;
import com.badlogic.gdx.scenes.scene2d.ui.Button;
import com.badlogic.gdx.scenes.scene2d.utils.ClickListener;
import com.badlogic.gdx.scenes.scene2d.utils.TextureRegionDrawable;
import com.badlogic.gdx.utils.Disposable;

/** Static artwork states; the screen supplies asynchronous room creation. */
public final class GenerateCodeButton extends Button implements Disposable {
    private final Texture[] textures = new Texture[3];
    private Runnable onGenerate = () -> {};
    private boolean disposed;

    public GenerateCodeButton() {
        super(new ButtonStyle());
        setName("generateCode");
        String[] states = {"up", "hover", "pressed"};
        // Each original has different transparent margins. Align the visible artwork.
        int[][] crops = {{34, 68, 2094, 586}, {77, 73, 2021, 576}, {65, 81, 2027, 564}};
        TextureRegionDrawable[] frames = new TextureRegionDrawable[3];
        try {
            for (int i = 0; i < states.length; i++) {
                textures[i] = RuntimeTextures.load("ui/buttons/generate_code/generate_" + states[i] + ".png");
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
                onGenerate.run();
            }
        });
    }

    public void setOnGenerate(Runnable action) {
        onGenerate = java.util.Objects.requireNonNull(action, "action");
    }

    @Override
    public void dispose() {
        if (disposed) return;
        disposed = true;
        for (Texture texture : textures) if (texture != null) texture.dispose();
    }
}
