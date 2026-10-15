package com.erni.finalanswer.ui.effects;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.GL20;
import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import com.badlogic.gdx.graphics.glutils.ShaderProgram;
import com.badlogic.gdx.math.Interpolation;
import com.badlogic.gdx.utils.Disposable;
import com.badlogic.gdx.utils.viewport.ScreenViewport;

/** Three original lighting variants, blended slowly without fading through black. */
public final class CyclingRoomBackground implements Disposable {
    // Two seconds to rest, 3.5 seconds to change the light. One loop = 16.5 seconds.
    private static final float HOLD_SECONDS = 2f;
    private static final float TRANSITION_SECONDS = 3.5f;
    private static final float STEP_SECONDS = HOLD_SECONDS + TRANSITION_SECONDS;

    private static final String VERTEX_SHADER = """
        attribute vec4 a_position;
        attribute vec4 a_color;
        attribute vec2 a_texCoord0;
        uniform mat4 u_projTrans;
        varying vec2 v_uv;
        void main() {
            v_uv = a_texCoord0;
            gl_Position = u_projTrans * a_position;
        }
        """;

    private static final String FRAGMENT_SHADER = """
        #ifdef GL_ES
        precision mediump float;
        #endif
        varying vec2 v_uv;
        uniform sampler2D u_texture;
        uniform sampler2D u_nextTexture;
        uniform float u_mix;
        void main() {
            vec3 current = texture2D(u_texture, v_uv).rgb;
            vec3 next = texture2D(u_nextTexture, v_uv).rgb;
            // Blend in linear light: the middle of a transition does not turn muddy.
            vec3 linearColor = mix(pow(current, vec3(2.2)),
                                   pow(next, vec3(2.2)), u_mix);
            vec3 color = pow(linearColor, vec3(1.0 / 2.2));
            vec2 edge = (v_uv - 0.5) * 2.0;
            float vignette = 1.0 - 0.09 * smoothstep(0.35, 1.5, length(edge));
            gl_FragColor = vec4(color * vignette, 1.0);
        }
        """;

    private final Texture[] backgrounds = new Texture[3];
    private final ScreenViewport viewport = new ScreenViewport();
    private SpriteBatch batch;
    private ShaderProgram shader;
    private double elapsed;
    private boolean disposed;

    public CyclingRoomBackground() {
        String[] names = {"bright.png", "medium.png", "dim.png"};
        try {
            for (int i = 0; i < names.length; i++) {
                backgrounds[i] = new Texture(Gdx.files.internal(
                    "backgrounds/create_room/" + names[i]));
                backgrounds[i].setFilter(Texture.TextureFilter.Linear,
                    Texture.TextureFilter.Linear);
            }
            shader = new ShaderProgram(VERTEX_SHADER, FRAGMENT_SHADER);
            if (!shader.isCompiled()) {
                throw new IllegalStateException("Room background shader: " + shader.getLog());
            }
            batch = new SpriteBatch(1000, shader);
            resize(Gdx.graphics.getWidth(), Gdx.graphics.getHeight());
        } catch (RuntimeException error) {
            dispose();
            throw error;
        }
    }

    public void render(float delta) {
        if (disposed) return;
        // Keep the timer bounded and avoid jumping after a suspended window resumes.
        elapsed = (elapsed + Math.max(0, Math.min(delta, 0.1f)))
            % (STEP_SECONDS * backgrounds.length);
        int current = (int) (elapsed / STEP_SECONDS);
        int next = (current + 1) % backgrounds.length;
        float phase = (float) (elapsed - current * STEP_SECONDS);
        float progress = Math.max(0, (phase - HOLD_SECONDS) / TRANSITION_SECONDS);
        float blend = Interpolation.smoother.apply(progress);

        viewport.apply();
        batch.setProjectionMatrix(viewport.getCamera().combined);
        float width = viewport.getWorldWidth();
        float height = viewport.getWorldHeight();
        Texture image = backgrounds[current];
        // Cover the whole window without stretching or black bars.
        float scale = Math.max(width / image.getWidth(), height / image.getHeight());
        float drawWidth = image.getWidth() * scale;
        float drawHeight = image.getHeight() * scale;

        backgrounds[next].bind(1);
        Gdx.gl.glActiveTexture(GL20.GL_TEXTURE0);
        batch.begin();
        try {
            shader.setUniformi("u_nextTexture", 1);
            shader.setUniformf("u_mix", blend);
            batch.draw(image, (width - drawWidth) / 2, (height - drawHeight) / 2,
                drawWidth, drawHeight);
        } finally {
            batch.end();
            Gdx.gl.glActiveTexture(GL20.GL_TEXTURE0);
        }
    }

    public void resize(int width, int height) {
        viewport.update(Math.max(1, width), Math.max(1, height), true);
    }

    @Override
    public void dispose() {
        if (disposed) return;
        disposed = true;
        if (batch != null) batch.dispose();
        if (shader != null) shader.dispose();
        for (Texture image : backgrounds) {
            if (image != null) image.dispose();
        }
    }
}
