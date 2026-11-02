import com.badlogic.gdx.ApplicationAdapter;
import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.backends.lwjgl3.Lwjgl3Application;
import com.badlogic.gdx.backends.lwjgl3.Lwjgl3ApplicationConfiguration;
import com.badlogic.gdx.graphics.GL20;
import com.badlogic.gdx.graphics.Pixmap;
import com.badlogic.gdx.graphics.PixmapIO;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import com.badlogic.gdx.graphics.glutils.FrameBuffer;
import com.badlogic.gdx.utils.ScreenUtils;
import com.erni.finalanswer.ui.lobby.cages.CageCharacterPresentation;
import com.erni.finalanswer.ui.lobby.cages.CageLobby;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Locale;

/**
 * Offline tool for the Unity migration. Renders the ORIGINAL Java cage-character rigs (unchanged code from
 * core/ui/lobby/cages) into flipbook sprite sheets, so the Unity lobby shows exactly the same acting without
 * re-implementing eight bone rigs by hand. It reads assets/, writes only into the output directory.
 *
 *   tools/unity/bake_cage_characters.sh   (builds the classpath and runs this with assets/ as working dir)
 */
public final class CageCharacterBaker extends ApplicationAdapter {
    // Front opening of cage_open.png in cage-local design units (HangingCage clipBegin(108, 62, 140, 163)).
    static final float CLIP_X = 108, CLIP_Y = 62, CLIP_W = 140, CLIP_H = 163;
    static final float SCALE = 1.5f;
    static final int FPS = 20;
    // CageAnimator: LOCKED_AT = 2.45 s. Intro covers the full entrance; idle is played ping-pong in Unity.
    static final float INTRO_SECONDS = 2.6f, IDLE_SECONDS = 6f;
    static final String[] IDS = {"skeleton", "ghost", "zombie", "dracula", "pumpkin", "plague_doctor", "voodoo", "puppeteer"};

    private final Path output;

    private CageCharacterBaker(Path output) { this.output = output; }

    public static void main(String[] args) {
        if (args.length != 1) throw new IllegalArgumentException("Usage: CageCharacterBaker <output directory>");
        var config = new Lwjgl3ApplicationConfiguration();
        config.setTitle("Cage character baker");
        config.setWindowedMode(320, 320);
        config.setInitialVisible(false);
        config.disableAudio(true);
        new Lwjgl3Application(new CageCharacterBaker(Path.of(args[0]).toAbsolutePath()), config);
    }

    @Override public void create() {
        try {
            Files.createDirectories(output);
            var lobby = new CageLobby();
            var batch = new SpriteBatch();
            int width = Math.round(CLIP_W * SCALE), height = Math.round(CLIP_H * SCALE);
            int intro = Math.round(INTRO_SECONDS * FPS), total = intro + Math.round(IDLE_SECONDS * FPS);
            int columns = (int) Math.ceil(Math.sqrt(total * (double) height / width));
            int rows = (int) Math.ceil(total / (double) columns);
            var fbo = new FrameBuffer(Pixmap.Format.RGBA8888, width, height, false);
            batch.getProjectionMatrix().setToOrtho2D(CLIP_X, CLIP_Y, CLIP_W, CLIP_H);
            for (String id : IDS) {
                var character = lobby.createCharacter(id);
                CageCharacterPresentation.Profile profile = lobby.presentation(id);
                var presentation = new CageCharacterPresentation();
                var sheet = new Pixmap(columns * width, rows * height, Pixmap.Format.RGBA8888);
                sheet.setBlending(Pixmap.Blending.None);
                float delta = 1f / FPS;
                for (int frame = 0; frame < total; frame++) {
                    float time = frame * delta;
                    character.update(frame == 0 ? 0 : delta, time, 0, false);
                    fbo.begin();
                    Gdx.gl.glClearColor(0, 0, 0, 0);
                    Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT);
                    // Alpha accumulates correctly on a transparent target; RGB is un-premultiplied below.
                    batch.setBlendFunctionSeparate(GL20.GL_SRC_ALPHA, GL20.GL_ONE_MINUS_SRC_ALPHA, GL20.GL_ONE, GL20.GL_ONE_MINUS_SRC_ALPHA);
                    batch.begin();
                    presentation.drawInCage(batch, character, profile, 1, time);
                    batch.end();
                    Pixmap pixels = Pixmap.createFromFrameBuffer(0, 0, width, height);
                    fbo.end();
                    blit(pixels, sheet, (frame % columns) * width, (frame / columns) * height);
                    pixels.dispose();
                }
                PixmapIO.writePNG(Gdx.files.absolute(output.resolve(id + ".png").toString()), sheet, -1, true);
                sheet.dispose();
                String meta = String.format(Locale.ROOT,
                    "{\n  \"id\": \"%s\",\n  \"frameWidth\": %d,\n  \"frameHeight\": %d,\n  \"columns\": %d,\n  \"rows\": %d,\n"
                        + "  \"fps\": %d,\n  \"introFrames\": %d,\n  \"totalFrames\": %d,\n"
                        + "  \"clip\": [%.1f, %.1f, %.1f, %.1f],\n  \"source\": \"core/ui/lobby/cages (Java rig, phase 0)\"\n}\n",
                    id, width, height, columns, rows, FPS, intro, total, CLIP_X, CLIP_Y, CLIP_W, CLIP_H);
                Files.writeString(output.resolve(id + ".json"), meta, StandardCharsets.UTF_8);
                System.out.println("baked " + id + " · " + total + " frames");
            }
            fbo.dispose();
            batch.dispose();
            lobby.dispose();
        } catch (Exception error) {
            error.printStackTrace();
            System.exit(1);
        }
        Gdx.app.exit();
    }

    /** Pixmap.createFromFrameBuffer already returns top-down rows; convert premultiplied RGB back to straight alpha. */
    private static void blit(Pixmap frame, Pixmap sheet, int left, int top) {
        int w = frame.getWidth(), h = frame.getHeight();
        ByteBuffer src = frame.getPixels();
        for (int y = 0; y < h; y++) {
            for (int x = 0; x < w; x++) {
                int i = (y * w + x) * 4;
                int r = src.get(i) & 255, g = src.get(i + 1) & 255, b = src.get(i + 2) & 255, a = src.get(i + 3) & 255;
                if (a > 0 && a < 255) {
                    r = Math.min(255, r * 255 / a);
                    g = Math.min(255, g * 255 / a);
                    b = Math.min(255, b * 255 / a);
                }
                sheet.drawPixel(left + x, top + y, (r << 24) | (g << 16) | (b << 8) | a);
            }
        }
    }
}
