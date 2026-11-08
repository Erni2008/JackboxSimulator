package com.erni.finalanswer.impostor;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.g2d.Batch;
import com.badlogic.gdx.graphics.glutils.ShaderProgram;
import com.badlogic.gdx.scenes.scene2d.ui.Image;
import com.badlogic.gdx.utils.Disposable;
import com.badlogic.gdx.utils.Scaling;

/**
 * The room, alive: one fragment shader over the supplied painting. Lamp flicker with rare brown-outs and a slow
 * sway, a volumetric cone of light with drifting haze and lit dust motes, floor fog, a heartbeat glow at the red
 * door, a rare shadow passing the lamp, breathing vignette and film grain. Reduced motion freezes all of it at a
 * calm frame. If the shader fails to compile the painting is drawn plainly (never a black screen).
 */
public final class ImpostorRoomBackground extends Image implements Disposable {
    private double elapsed;
    private boolean reduced;
    private ShaderProgram shader;
    /** 0..1 extra darkness pushed by the screen (e.g. tension during voting) */
    private float tension;

    public ImpostorRoomBackground(Texture texture) {
        super(texture);
        setName("impostorBackground");
        setScaling(Scaling.fill);
        setBounds(0, 0, ImpostorLayout.WIDTH, ImpostorLayout.HEIGHT);
        texture.setFilter(Texture.TextureFilter.Linear, Texture.TextureFilter.Linear);
        try {
            ShaderProgram.pedantic = false;
            ShaderProgram program = new ShaderProgram(VERTEX, FRAGMENT);
            if (program.isCompiled()) shader = program;
            else { if (Gdx.app != null) Gdx.app.error("THE IMPOSTOR", "Room shader: " + program.getLog()); program.dispose(); }
        } catch (RuntimeException e) { shader = null; }
    }

    public void tension(float value) { tension = Math.max(0, Math.min(1, value)); }

    /** Render-thread update, independent of resize and player layout. */
    public void update(float delta, boolean reducedMotion) {
        reduced = reducedMotion;
        if (reducedMotion) { setColor(1, 1, 1, 1); return; }
        if (Float.isFinite(delta)) elapsed = (elapsed + Math.max(0, delta)) % 3608;
        float light = (float) (.97 + .03 * Math.cos(elapsed * (2 * Math.PI / 16)));
        setColor(light, light, light, 1);
    }

    @Override public void draw(Batch batch, float parentAlpha) {
        if (shader == null) { super.draw(batch, parentAlpha); return; }
        ShaderProgram previous = batch.getShader();
        batch.setShader(shader);
        shader.setUniformf("u_time", reduced ? 7.5f : (float) elapsed);
        shader.setUniformf("u_motion", reduced ? 0f : 1f);
        shader.setUniformf("u_tension", tension);
        super.draw(batch, parentAlpha);
        batch.flush();
        batch.setShader(previous);
    }

    @Override public void dispose() { if (shader != null) shader.dispose(); shader = null; }

    private static final String VERTEX = """
        attribute vec4 a_position; attribute vec4 a_color; attribute vec2 a_texCoord0;
        uniform mat4 u_projTrans; varying vec4 v_color; varying vec2 v_uv;
        void main(){ v_color = a_color; v_uv = a_texCoord0; gl_Position = u_projTrans * a_position; }
        """;

    private static final String FRAGMENT = """
        #ifdef GL_ES
        precision mediump float;
        #endif
        varying vec4 v_color; varying vec2 v_uv;
        uniform sampler2D u_texture; uniform float u_time; uniform float u_motion; uniform float u_tension;

        float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
        float noise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
          return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y); }
        float fbm(vec2 p){ float v = 0.0, a = 0.5; for (int i = 0; i < 4; i++) { v += a * noise(p); p = p * 2.03 + 17.1; a *= 0.5; } return v; }

        void main(){
          vec2 uv = v_uv; float t = u_time;
          vec3 base = texture2D(u_texture, uv).rgb;

          // --- the lamp: steady hum, nervous flicker, a rare brown-out, a slow sway ---
          float hum = 0.94 + 0.04 * sin(t * 2.1) + 0.02 * sin(t * 5.3 + 1.0);
          float jitter = noise(vec2(t * 9.0, 3.7)); jitter = smoothstep(0.82, 1.0, jitter);
          float cycle = mod(t, 23.0); float brown = 1.0 - 0.55 * smoothstep(0.0, 0.05, cycle - 17.0) * (1.0 - smoothstep(0.05, 0.6, cycle - 17.0))
                                                    - 0.35 * smoothstep(0.0, 0.04, cycle - 17.9) * (1.0 - smoothstep(0.04, 0.25, cycle - 17.9));
          float lamp = mix(1.0, hum * (1.0 - 0.25 * jitter) * brown, u_motion);
          // something crosses the light every ~41 s
          float pass = mod(t, 41.0) - 33.0; float shadow = u_motion * 0.45 * exp(-pass * pass * 1.8);
          lamp *= 1.0 - shadow;

          float sway = u_motion * 0.012 * sin(t * 0.55);
          vec2 bulb = vec2(0.512 + sway * 0.4, 0.045);
          vec2 d = uv - bulb; d.x *= 1.777;
          // cone of light: widens downward, tilts with the sway
          float down = max(0.0, uv.y - bulb.y);
          float cx = (uv.x - bulb.x - sway * down * 1.6) * 1.777;
          float width = 0.05 + down * 0.42;
          float cone = smoothstep(width, width * 0.25, abs(cx)) * smoothstep(0.0, 0.08, down) * (1.0 - smoothstep(0.55, 0.95, uv.y));
          float haze = fbm(vec2(uv.x * 5.0 - t * 0.05, uv.y * 3.0 + t * 0.08)) ;
          vec3 warm = vec3(1.0, 0.72, 0.42);
          vec3 col = base;
          // relight: the whole painting follows the lamp, the pool under it most
          float pool = exp(-dot(d, d) * 3.2);
          float tablePool = exp(-pow(length((uv - vec2(0.5 + sway * 1.2, 0.74)) * vec2(1.0, 2.6)), 2.0) * 5.0);
          float light = 0.78 + 0.22 * lamp + (lamp - 1.0) * 0.55 * (pool + tablePool);
          col *= light;
          col += warm * cone * (0.05 + 0.07 * haze) * lamp;
          col += warm * pool * 0.10 * lamp;
          col += warm * tablePool * 0.05 * (lamp - 0.85);

          // dust motes, lit only inside the cone
          vec2 g = uv * vec2(70.0, 40.0); g.y -= t * 0.35 * u_motion; g.x += sin(t * 0.3 + uv.y * 6.0) * 0.6 * u_motion;
          vec2 cell = floor(g); vec2 fp = fract(g) - 0.5; float h = hash(cell);
          vec2 o = vec2(hash(cell + 3.1), hash(cell + 7.7)) - 0.5;
          float mote = step(0.86, h) * smoothstep(0.09, 0.0, length(fp - o * 0.6));
          mote *= 0.6 + 0.4 * sin(t * (1.0 + h * 3.0) + h * 40.0);
          col += vec3(1.0, 0.85, 0.6) * mote * cone * 0.9 * lamp;

          // floor fog drifting left to right
          float fogMask = smoothstep(0.62, 1.0, uv.y);
          float fog = fbm(vec2(uv.x * 3.0 - t * 0.04, uv.y * 6.0 + t * 0.015)) * fbm(vec2(uv.x * 1.5 + t * 0.025, uv.y * 2.0));
          col = mix(col, vec3(0.22, 0.17, 0.16) * (0.6 + 0.4 * lamp), fogMask * fog * 0.55);

          // the red door breathes like a heartbeat
          float beat = mod(t, 1.6); float heart = exp(-pow((beat - 0.10) * 14.0, 2.0)) + 0.6 * exp(-pow((beat - 0.38) * 14.0, 2.0));
          heart = mix(0.5, heart, u_motion);
          float door = smoothstep(0.24, 0.02, uv.x) * smoothstep(0.08, 0.25, uv.y) * smoothstep(0.92, 0.6, uv.y);
          float redness = smoothstep(0.08, 0.3, base.r - max(base.g, base.b));
          col += vec3(0.75, 0.05, 0.06) * door * (0.05 + 0.10 * heart) + vec3(0.6, 0.0, 0.02) * redness * door * 0.35 * heart;

          // tension: the room closes in
          col *= 1.0 - 0.25 * u_tension * (1.0 - pool);

          // breathing vignette and grain
          vec2 v = uv - 0.5; v.x *= 1.25; float vig = smoothstep(0.85, 0.25, length(v) * (1.0 + 0.04 * sin(t * 0.4) * u_motion));
          col *= mix(0.55, 1.0, vig);
          float grain = (hash(uv * 900.0 + fract(t * 23.0) * 37.0) - 0.5) * 0.045 * u_motion;
          col += grain;
          gl_FragColor = vec4(col, 1.0) * v_color;
        }
        """;
}
