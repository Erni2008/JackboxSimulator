package com.erni.finalanswer.utils;

import com.badlogic.gdx.Gdx;
import com.erni.finalanswer.settings.GameSettings;

/** All native display changes pass through this owner, including the F11 shortcut. */
public class DisplayManager {
    private GameSettings applied;
    private boolean changing;

    public boolean isChanging() {
        return changing;
    }

    public void apply(GameSettings settings) {
        if (changing) throw new IllegalStateException("Display change already in progress");
        changing = true;
        try {
            boolean success = true;
            if (settings.fullscreen()) {
                if (!Gdx.graphics.isFullscreen())
                    success = Gdx.graphics.setFullscreenMode(Gdx.graphics.getDisplayMode());
            } else if (Gdx.graphics.isFullscreen()
                    || applied == null
                    || applied.width() != settings.width()
                    || applied.height() != settings.height()) {
                if (Gdx.graphics.isFullscreen()
                        || Gdx.graphics.getWidth() != settings.width()
                        || Gdx.graphics.getHeight() != settings.height())
                    success = Gdx.graphics.setWindowedMode(settings.width(), settings.height());
            }
            if (!success) throw new IllegalStateException("Display mode unavailable");
            Gdx.graphics.setVSync(settings.vsync());
            Gdx.graphics.setForegroundFPS(settings.fpsLimit());
            applied = settings;
        } finally {
            changing = false;
        }
    }

    public boolean isFullscreen() {
        return Gdx.graphics.isFullscreen();
    }
    /** Platform adapter: presentation must not enter an exclusive monitor mode. */
    public interface Presentation {
        void enter();
        void toggle();
        void restore();
        boolean fullscreen();
    }
    private static java.util.function.Supplier<Presentation> presentationFactory=()->new Presentation(){
        public void enter(){} public void toggle(){} public void restore(){}
        public boolean fullscreen(){return Gdx.graphics.isFullscreen();}
    };
    public static void installPresentation(java.util.function.Supplier<Presentation> factory){presentationFactory=java.util.Objects.requireNonNull(factory);}
    /** Screen-scoped, non-persistent borderless presentation. The desktop owns native window coordinates. */
    public static final class TemporaryFullscreen implements Presentation {
        private final Presentation desktop=presentationFactory.get();
        public void enter(){desktop.enter();}
        public void toggle(){desktop.toggle();}
        public void restore(){desktop.restore();}
        public boolean fullscreen(){return desktop.fullscreen();}
    }
}
