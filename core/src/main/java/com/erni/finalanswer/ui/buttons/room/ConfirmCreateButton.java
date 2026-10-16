package com.erni.finalanswer.ui.buttons.room;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.g2d.TextureRegion;
import com.badlogic.gdx.scenes.scene2d.InputEvent;
import com.badlogic.gdx.scenes.scene2d.ui.Button;
import com.badlogic.gdx.scenes.scene2d.utils.ClickListener;
import com.badlogic.gdx.scenes.scene2d.utils.TextureRegionDrawable;
import com.badlogic.gdx.utils.Disposable;

/** Static CREATE confirmation inside the room form. */
public final class ConfirmCreateButton extends Button implements Disposable {
    private final Texture[] textures = new Texture[3];
    private boolean disposed;

    public ConfirmCreateButton(Runnable onCreate) {
        super(new ButtonStyle());
        setName("confirmCreateRoom");
        String[] states = {"up", "hover", "pressed"};
        TextureRegionDrawable[] frames = new TextureRegionDrawable[3];
        try {
            for (int i = 0; i < states.length; i++) {
                Texture texture = new Texture(Gdx.files.internal(
                    "ui/buttons/confirm_create_room/create_buttongen_" + states[i] + ".png"));
                textures[i] = texture;
                texture.setFilter(Texture.TextureFilter.Linear, Texture.TextureFilter.Linear);
                frames[i] = new TextureRegionDrawable(new TextureRegion(texture, 50, 80, 1820, 680));
                frames[i].setMinWidth(0);
                frames[i].setMinHeight(0);
            }
        } catch (RuntimeException error) {
            dispose();
            throw error;
        }
        // Three immediate artwork states, with no movement, pulse or animated fade.
        ButtonStyle style = new ButtonStyle();
        style.up = frames[0];
        style.over = frames[1];
        style.down = frames[2];
        style.checked = frames[0];
        style.checkedOver = frames[1];
        style.focused = frames[0];
        setStyle(style);
        addListener(new ClickListener() {
            @Override
            public void clicked(InputEvent event, float x, float y) {
                if (isDisabled()) return;
                setChecked(false);
                onCreate.run();
            }
        });
    }

    public float getImageAspectRatio() {
        return 680f / 1820f;
    }

    @Override
    public void dispose() {
        if (disposed) return;
        disposed = true;
        for (Texture texture : textures) {
            if (texture != null) texture.dispose();
        }
    }
}
