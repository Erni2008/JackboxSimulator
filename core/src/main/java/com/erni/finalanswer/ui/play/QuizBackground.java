package com.erni.finalanswer.ui.play;

import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.g2d.Batch;
import com.badlogic.gdx.graphics.glutils.ShaderProgram;
import com.badlogic.gdx.scenes.scene2d.Actor;
import com.badlogic.gdx.scenes.scene2d.Touchable;
import com.badlogic.gdx.utils.Disposable;
import com.erni.finalanswer.ui.RuntimeTextures;

/** Stable room geometry with continuous localized candle lighting and restrained camera motion. */
public final class QuizBackground extends Actor implements Disposable {
    private static final String VERTEX = """
        attribute vec4 a_position;
        attribute vec4 a_color;
        attribute vec2 a_texCoord0;
        uniform mat4 u_projTrans;
        varying vec4 v_color;
        varying vec2 v_uv;
        void main() {
            v_color = a_color;
            v_color.a *= 255.0 / 254.0;
            v_uv = a_texCoord0;
            gl_Position = u_projTrans * a_position;
        }
        """;
    private static final String FRAGMENT = """
        #ifdef GL_ES
        precision mediump float;
        #endif
        uniform sampler2D u_texture;
        uniform float u_time;
        uniform float u_motion;
        varying vec4 v_color;
        varying vec2 v_uv;
        float glow(vec2 position, vec2 size) {
            vec2 d = (v_uv - position) / size;
            return exp(-dot(d,d) * 2.0);
        }
        void main() {
            vec4 scene = texture2D(u_texture, v_uv);
            float left = sin(u_time * 1.27 + sin(u_time * .41) * .6);
            float right = sin(u_time * 1.09 + 1.8 + sin(u_time * .37) * .5);
            float chandelier = sin(u_time * .83 + .7);
            float light = glow(vec2(.354,.35),vec2(.10,.22)) * left
                        + glow(vec2(.647,.35),vec2(.10,.22)) * right
                        + glow(vec2(.50,.075),vec2(.20,.15)) * chandelier * .7
                        + glow(vec2(.21,.55),vec2(.09,.12)) * right * .4
                        + glow(vec2(.97,.56),vec2(.09,.15)) * left * .4;
            vec3 color = scene.rgb + vec3(.045,.023,.008) * light * u_motion;
            float vignette = smoothstep(.28,.73,length((v_uv-.5)*vec2(1.0,.85)));
            color *= 1.0 - .19 * vignette;
            gl_FragColor = vec4(max(color,vec3(0.0)),scene.a) * v_color;
        }
        """;
    private final Texture scene;
    private final ShaderProgram lighting;
    private final Texture pixel; // Borrowed from PlayScreen.
    private double elapsed;
    private float visibility;
    private boolean active, reducedMotion, disposed;
    private final float[] gradient = new float[20];

    public QuizBackground(Texture pixel) {
        this.pixel = pixel;
        setName("quizBackground");
        setTouchable(Touchable.disabled);
        Texture loaded = RuntimeTextures.load("backgrounds/play/questions_01_02/01.1.png");
        ShaderProgram compiled = null;
        try {
            compiled = new ShaderProgram(VERTEX, FRAGMENT);
            if (!compiled.isCompiled()) throw new IllegalStateException("Room lighting shader: " + compiled.getLog());
        } catch (RuntimeException error) {
            loaded.dispose();
            if (compiled != null) compiled.dispose();
            throw error;
        }
        scene = loaded;
        lighting = compiled;
    }
    public void reset() { elapsed = 0; visibility = 0; }
    public void showForQuestion(int number, boolean reducedMotion) {
        active = number >= 1 && number <= 2;
        this.reducedMotion = reducedMotion;
    }
    public boolean isActiveForQuestion() { return active; }
    public float visibility() { return visibility; }
    public double elapsedSeconds() { return elapsed; }
    @Override public void act(float delta) {
        super.act(delta);
        if (disposed) return;
        float step = Math.max(0, delta);
        if (active || visibility > 0) elapsed += step;
        float target = active ? 1 : 0;
        float change = step / .8f;
        visibility = visibility < target ? Math.min(target, visibility + change)
            : Math.max(target, visibility - change);
    }
    @Override public void draw(Batch batch, float parentAlpha) {
        if (disposed || visibility <= 0) return;
        float saved = batch.getPackedColor();
        float fade = visibility * visibility * visibility * (visibility * (visibility * 6 - 15) + 10);
        float alpha = parentAlpha * getColor().a * fade;
        ShaderProgram previous = batch.getShader();
        batch.setShader(lighting);
        lighting.setUniformf("u_time", (float) elapsed);
        lighting.setUniformf("u_motion", reducedMotion ? 0 : 1);
        drawFrame(batch, scene, alpha);
        batch.setShader(previous);
        // Cached shader and borrowed pixel: no per-frame GPU resources.
        batch.setColor(0, 0, 0, .31f * alpha);
        batch.draw(pixel, getX(), getY(), getWidth(), getHeight());
        shade(batch, getX(), getY() + getHeight() * .62f, getWidth(), getHeight() * .38f, 0, .57f * alpha);
        shade(batch, getX(), getY(), getWidth(), getHeight() * .22f, .68f * alpha, 0);
        batch.setPackedColor(saved);
    }
    private void drawFrame(Batch batch, Texture frame, float alpha) {
        float zoom = reducedMotion ? 1.02f : 1.02f + .004f * (float) Math.sin(elapsed * .075);
        float scale = Math.max(getWidth() / frame.getWidth(), getHeight() / frame.getHeight()) * zoom;
        float width = frame.getWidth() * scale, height = frame.getHeight() * scale;
        float panX = reducedMotion ? 0 : (float) Math.sin(elapsed * .055) * getWidth() * .0017f;
        float panY = reducedMotion ? 0 : (float) Math.sin(elapsed * .063) * getHeight() * .0011f;
        batch.setColor(1, 1, 1, alpha);
        batch.draw(frame, getX() + (getWidth() - width) / 2 + panX,
            getY() + (getHeight() - height) / 2 + panY, width, height);
    }
    private void shade(Batch batch, float x, float y, float width, float height, float bottom, float top) {
        vertex(0, x, y, bottom, 0, 1);
        vertex(5, x, y + height, top, 0, 0);
        vertex(10, x + width, y + height, top, 1, 0);
        vertex(15, x + width, y, bottom, 1, 1);
        batch.setColor(1, 1, 1, 1);
        batch.draw(pixel, gradient, 0, gradient.length);
    }
    private void vertex(int offset, float x, float y, float alpha, float u, float v) {
        gradient[offset] = x; gradient[offset + 1] = y;
        gradient[offset + 2] = com.badlogic.gdx.graphics.Color.toFloatBits(0, 0, 0, alpha);
        gradient[offset + 3] = u; gradient[offset + 4] = v;
    }
    @Override public void dispose() {
        if (disposed) return;
        disposed = true;
        scene.dispose();
        lighting.dispose();
    }
}
