package com.erni.finalanswer.ui.lobby.cages;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.g2d.Batch;
import com.badlogic.gdx.graphics.glutils.FrameBuffer;
import com.badlogic.gdx.graphics.glutils.ShaderProgram;
import com.badlogic.gdx.math.Matrix4;
import com.badlogic.gdx.math.Vector3;
import com.badlogic.gdx.utils.BufferUtils;

/**
 * Whole-figure lighting for every cut-out character (lobby cages, questions, THE IMPOSTOR, CURSED modes...).
 *
 * <p>A rig is drawn as many separate parts, so per-sprite shading cannot see the silhouette. The figure is therefore
 * rendered once into an offscreen buffer (only its on-screen bounds are cleared and composited) and lit as one body:
 * <ul>
 *   <li>soft contact / drop shadow behind the figure, so it sits in its space instead of floating on it;</li>
 *   <li>volume from the silhouette: edges roll off, the core stays full;</li>
 *   <li>a cool key rim from above (moonlit windows) and a warm candle bounce from below (normals from the alpha gradient);</li>
 *   <li>local clarity (gentle unsharp mask) so painted detail reads crisply at lobby size.</li>
 * </ul>
 * The art, rigs and animation are untouched. Nested offscreen rendering (e.g. snapshots) draws the plain figure.
 */
final class CharacterLighting {
    private CharacterLighting() {}
    private static FrameBuffer fbo; private static ShaderProgram shader; private static boolean broken;
    private static final Matrix4 combined = new Matrix4(), screen = new Matrix4(), savedProj = new Matrix4(), savedTrans = new Matrix4();
    private static final Vector3 v = new Vector3(); private static final java.nio.IntBuffer bound = BufferUtils.newIntBuffer(16);
    /** set by the caller for a prisoner inside a cage: moonlight bar shadows + interior shade (0 = open air) */
    static float insideCage;
    /** off with -Dfinalanswer.characterLighting=false */
    static final boolean ENABLED = !"false".equals(System.getProperty("finalanswer.characterLighting"));

    /** draws {@code draw} lit; false when it could not (caller then draws plainly) */
    static boolean draw(Batch batch, Matrix4 framed, float pivotX, float pivotY, Runnable draw) {
        if (!ENABLED || broken) return false;
        bound.clear(); Gdx.gl.glGetIntegerv(GL20.GL_FRAMEBUFFER_BINDING, bound); if (bound.get(0) != defaultFramebuffer()) return false; // nested offscreen pass
        int W = Gdx.graphics.getBackBufferWidth(), H = Gdx.graphics.getBackBufferHeight(); if (W <= 0 || H <= 0) return false;
        if (!ready(W, H)) return false;
        // on-screen bounds of the figure's local box (generous: capes, raised arms, smoke, strings)
        combined.set(batch.getProjectionMatrix()).mul(framed);
        float minX = Float.MAX_VALUE, minY = Float.MAX_VALUE, maxX = -Float.MAX_VALUE, maxY = -Float.MAX_VALUE;
        for (int i = 0; i < 4; i++) { v.set(pivotX + (i % 2 == 0 ? -230 : 230), pivotY + (i < 2 ? -140 : 520), 0).prj(combined);
            float sx = (v.x * .5f + .5f) * W, sy = (v.y * .5f + .5f) * H; minX = Math.min(minX, sx); maxX = Math.max(maxX, sx); minY = Math.min(minY, sy); maxY = Math.max(maxY, sy); }
        int pad = 24, x0 = Math.max(0, (int) minX - pad), y0 = Math.max(0, (int) minY - pad), x1 = Math.min(W, (int) maxX + pad), y1 = Math.min(H, (int) maxY + pad);
        // the caller's clip (e.g. the cage interior) bounds what can be seen: light only that, plus a margin for the shadow
        var clip = com.badlogic.gdx.scenes.scene2d.utils.ScissorStack.peekScissors();
        if (clip != null) { float kx = (float) W / Gdx.graphics.getWidth(), ky = (float) H / Gdx.graphics.getHeight(); int m = 16; // the stack holds logical (window) pixels; the buffer is in back-buffer pixels (2x on Retina)
            x0 = Math.max(x0, (int) (clip.x * kx) - m); y0 = Math.max(y0, (int) (clip.y * ky) - m); x1 = Math.min(x1, (int) ((clip.x + clip.width) * kx) + m); y1 = Math.min(y1, (int) ((clip.y + clip.height) * ky) + m); }
        if (x1 - x0 < 4 || y1 - y0 < 4) return true; // off screen: nothing to draw
        float pxScale = Math.max(.6f, Math.min(3f, (y1 - y0) / 520f)); // effect radii follow the figure's on-screen size

        batch.flush();
        fbo.begin(); Gdx.gl.glEnable(GL20.GL_SCISSOR_TEST); Gdx.gl.glScissor(x0, y0, x1 - x0, y1 - y0);
        Gdx.gl.glClearColor(0, 0, 0, 0); Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT);
        try { draw.run(); batch.flush(); } finally { Gdx.gl.glDisable(GL20.GL_SCISSOR_TEST); fbo.end(); }

        // composite the lit figure back (premultiplied)
        ShaderProgram previous = batch.getShader(); savedProj.set(batch.getProjectionMatrix()); savedTrans.set(batch.getTransformMatrix());
        int src = batch.getBlendSrcFunc(), dst = batch.getBlendDstFunc(), srcA = batch.getBlendSrcFuncAlpha(), dstA = batch.getBlendDstFuncAlpha(); Color c = batch.getColor().cpy();
        try {
            batch.setShader(shader); batch.setBlendFunctionSeparate(GL20.GL_ONE, GL20.GL_ONE_MINUS_SRC_ALPHA, GL20.GL_ONE, GL20.GL_ONE_MINUS_SRC_ALPHA);
            batch.setProjectionMatrix(screen.setToOrtho2D(0, 0, W, H)); batch.setTransformMatrix(screen.idt()); batch.setColor(1, 1, 1, 1);
            shader.setUniformf("u_px", 1f / W, 1f / H); shader.setUniformf("u_r", pxScale);
            float localPx = (x1 - x0 - 2 * pad) / 460f; shader.setUniformf("u_inside", insideCage); shader.setUniformf("u_bar", Math.max(6f, 28.9f * localPx * 1.15f), x0);
            Texture t = fbo.getColorBufferTexture();
            batch.draw(t, x0, y0, x1 - x0, y1 - y0, (float) x0 / W, (float) y0 / H, (float) x1 / W, (float) y1 / H);
            batch.flush();
        } finally { batch.setShader(previous); batch.setProjectionMatrix(savedProj); batch.setTransformMatrix(savedTrans); batch.setBlendFunctionSeparate(src, dst, srcA, dstA); batch.setColor(c); }
        return true;
    }

    private static int defaultFramebuffer() { return 0; }

    private static boolean ready(int W, int H) {
        try {
            if (shader == null) { ShaderProgram.pedantic = false; shader = new ShaderProgram(VERT, FRAG); if (!shader.isCompiled()) { Gdx.app.error("CharacterLighting", shader.getLog()); shader.dispose(); shader = null; broken = true; return false; } }
            if (fbo == null || fbo.getWidth() != W || fbo.getHeight() != H) { if (fbo != null) fbo.dispose(); fbo = new FrameBuffer(Pixmap.Format.RGBA8888, W, H, false);
                fbo.getColorBufferTexture().setFilter(Texture.TextureFilter.Linear, Texture.TextureFilter.Linear); }
            return true;
        } catch (RuntimeException e) { Gdx.app.error("CharacterLighting", "disabled", e); broken = true; return false; }
    }

    static void dispose() { if (fbo != null) fbo.dispose(); if (shader != null) shader.dispose(); fbo = null; shader = null; }

    private static final String VERT = """
        attribute vec4 a_position; attribute vec4 a_color; attribute vec2 a_texCoord0; uniform mat4 u_projTrans;
        varying vec4 v_color; varying vec2 v_uv;
        void main(){ v_color = a_color; v_uv = a_texCoord0; gl_Position = u_projTrans * a_position; }
        """;
    private static final String FRAG = """
        #ifdef GL_ES
        precision mediump float;
        #endif
        varying vec4 v_color; varying vec2 v_uv; uniform sampler2D u_texture; uniform vec2 u_px; uniform float u_r; uniform float u_inside; uniform vec2 u_bar;
        float A(vec2 o){ return texture2D(u_texture, v_uv + o * u_px * u_r).a; }
        vec4 T(vec2 o){ return texture2D(u_texture, v_uv + o * u_px * u_r); }
        void main(){
            vec4 c = texture2D(u_texture, v_uv);                     // premultiplied figure
            // drop shadow: blurred silhouette offset down-right
            float sh = 0.;
            sh = A(vec2(-4., 7.)) + A(vec2(-10., 7.)) + A(vec2(-7., 11.)) + A(vec2(-7., 3.));   // 4-tap soft drop shadow
            sh = clamp(sh * .25, 0., 1.) * .5;
            if (c.a < .003) { gl_FragColor = vec4(0., 0., 0., sh) * v_color.a; return; }
            vec3 rgb = c.rgb / c.a;
            // silhouette normal (two radii) and how deep inside the figure this pixel is
            float ax = A(vec2(4.,0.)), bx = A(vec2(-4.,0.)), ay = A(vec2(0.,4.)), by = A(vec2(0.,-4.));
            vec2 g = 1.7 * vec2(ax - bx, ay - by);
            float edge = clamp(length(g) * .6, 0., 1.); vec2 n = length(g) > .001 ? -normalize(g) : vec2(0.);
            float inner = (A(vec2(8.,8.)) + A(vec2(-8.,-8.)) + A(vec2(8.,-8.)) + A(vec2(-8.,8.)) + ax + bx + ay + by) * .125;
            // clarity: gentle unsharp mask against the 4-neighbour average
            vec4 nb = (T(vec2(1.4,0.)) + T(vec2(-1.4,0.)) + T(vec2(0.,1.4)) + T(vec2(0.,-1.4))) * .25;
            vec3 blur = nb.a > .001 ? nb.rgb / nb.a : rgb; rgb = clamp(rgb + (rgb - blur) * .65, 0., 1.);
            // volume: the outline rolls off into shadow, the core keeps full value
            rgb *= .7 + .3 * smoothstep(.35, 1., inner);
            // lights: rim from the silhouette normal
            float key = max(0., dot(n, normalize(vec2(-.35, .94)))), bounce = max(0., dot(n, normalize(vec2(.5, -.87))));
            rgb += vec3(.78, .88, 1.) * edge * key * .5 + vec3(1., .62, .32) * edge * bounce * .22;   // cool moonlight from above, warm candle bounce from below
            // gentle filmic contrast
            rgb = mix(rgb, rgb * rgb * (3. - 2. * rgb), .28);
            // inside a cage: cooler, dimmer interior and slanted moonlight shadows of the front bars across the body
            if (u_inside > 0.) { vec2 sp = v_uv / u_px; float ph = fract((sp.x + sp.y * .32 - u_bar.y) / u_bar.x);
                float bar = smoothstep(.0, .12, ph) * (1. - smoothstep(.2, .34, ph));
                rgb *= mix(vec3(1.), vec3(.82, .86, .95), u_inside); rgb *= 1. - bar * .42 * u_inside; }
            vec4 lit = vec4(rgb * c.a, c.a);
            gl_FragColor = (lit + vec4(0., 0., 0., sh) * (1. - c.a)) * v_color.a;
        }
        """;
}
