package com.erni.finalanswer.lwjgl3;

import com.badlogic.gdx.*;
import com.badlogic.gdx.backends.lwjgl3.*;
import com.badlogic.gdx.graphics.Pixmap;
import com.badlogic.gdx.graphics.PixmapIO;
import com.badlogic.gdx.math.Vector2;
import com.badlogic.gdx.scenes.scene2d.*;
import com.badlogic.gdx.scenes.scene2d.ui.*;
import com.erni.finalanswer.FinalAnswerGame;
import com.erni.finalanswer.screens.*;

public class SettingsCheck extends FinalAnswerGame {
    int frame, step;
    long wait;
    boolean reload;

    public static void main(String[] args) {
        var c = new Lwjgl3ApplicationConfiguration();
        c.setWindowedMode(1280, 720);
        c.disableAudio(true);
        c.setForegroundFPS(60);
        c.setPreferencesConfig(System.getProperty("settings.qa.dir"), Files.FileType.Absolute);
        new Lwjgl3Application(new SettingsCheck(), c);
    }

    @Override
    public void create() {
        super.create();
        reload = Boolean.getBoolean("settings.qa.reload");
        if (reload) {
            checkSaved();
            showSettings();
            step = 99;
        }
    }

    Stage stage() {
        try {
            var f =
                    getScreen()
                            .getClass()
                            .getDeclaredField(
                                    getScreen() instanceof MainMenu ? "menuStage" : "stage");
            f.setAccessible(true);
            return (Stage) f.get(getScreen());
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    Actor actor(String name) {
        Actor a = stage().getRoot().findActor(name);
        if (a == null) throw new AssertionError("Missing " + name);
        return a;
    }

    void click(Actor a) {
        var s = stage();
        var p = a.localToStageCoordinates(new Vector2(a.getWidth() / 2, a.getHeight() / 2));
        s.stageToScreenCoordinates(p);
        s.touchDown((int) p.x, (int) p.y, 0, 0);
        s.touchUp((int) p.x, (int) p.y, 0, 0);
    }

    void select(String name, int index) {
        ((SelectBox<?>) actor(name)).setSelectedIndex(index);
    }

    void capture(String name) {
        if (!Boolean.getBoolean("settings.qa.capture")) return;
        Pixmap p =
                com.badlogic.gdx.utils.ScreenUtils.getFrameBufferPixmap(
                        0,
                        0,
                        Gdx.graphics.getBackBufferWidth(),
                        Gdx.graphics.getBackBufferHeight());
        PixmapIO.writePNG(Gdx.files.absolute("/tmp/settings-" + name + ".png"), p, -1, true);
        p.dispose();
    }

    void checkSaved() {
        var mix=com.erni.finalanswer.audio.AudioMix.GLOBAL;
        if(Math.abs(mix.master-.8f)>.001f||Math.abs(mix.music-.4f)>.001f||Math.abs(mix.sfx-.6f)>.001f)throw new AssertionError("Audio settings not persisted");
        if (!getSettings().language().equals("ru")
                || getSettings().fpsLimit() != 120
                || getSettings().vsync()
                || !getSettings().reducedMotion()
                || getSettings().width() != 1280)
            throw new AssertionError("Settings not persisted: " + getSettings());
    }

    @Override
    public void render() {
        if (isChangingDisplay()) {
            super.render();
            return;
        }
        super.render();
        frame++;
        if (step == 99 && frame == 30) {
            checkSaved();
            if (!((Label) actor("settings.title")).getText().toString().equals("НАСТРОЙКИ"))
                throw new AssertionError("Locale not restored");
            System.out.println(
                    "PASS: preferences restored in a fresh JVM; Russian interface and display"
                        + " options and independent Master/Music/SFX retained");
            Gdx.app.exit();
            return;
        }
        if (frame > 2400) throw new AssertionError("Settings timeout step " + step);
        switch (step) {
            case 0 -> {
                if (frame < 50) break;
                for (var a : stage().getActors())
                    if (a instanceof com.erni.finalanswer.ui.buttons.menu.SettingsButton) {
                        click(a);
                        break;
                    }
                step = 1;
            }
            case 1 -> {
                if (!(getScreen() instanceof SettingsScreen)) break;
                capture("en");
                select("settingsLanguage", 1);
                select("settingsMasterVolume", 5);
                step = 2;
            }
            case 2 -> {
                if (frame % 20 != 0) break;
                capture("ru");
                if (!getTexts().getLanguage().equals("ru")
                        || !getSettings().language().equals("en"))
                    throw new AssertionError("Preview saved too soon");
                click(actor("settingsBack"));
                step = 3;
            }
            case 3 -> {
                if (!(getScreen() instanceof MainMenu)) break;
                if (!getTexts().getLanguage().equals("en"))
                    throw new AssertionError("Cancel did not restore language");
                if(com.erni.finalanswer.audio.AudioMix.GLOBAL.master!=1)throw new AssertionError("Cancelled audio changes were applied");
                showSettings();
                select("settingsLanguage", 1);
                select("settingsFps", 2);
                select("settingsMasterVolume",16);select("settingsMusicVolume",8);select("settingsSfxVolume",12);
                ((CheckBox) actor("settingsVsync")).setChecked(false);
                ((CheckBox) actor("settingsReducedMotion")).setChecked(true);
                click(actor("settingsApply"));
                step = 4;
            }
            case 4 -> {
                if (frame % 20 != 0) break;
                checkSaved();
                capture("saved");
                showRoomSettings();
                if (!((TextField) actor("roomName"))
                        .getMessageText()
                        .equals("Введи название комнаты"))
                    throw new AssertionError("Room placeholder not localized");
                Label mode = (Label) actor("gameModeName");
                if (!mode.getText().toString().equals("СТАНДАРТНЫЙ"))
                    throw new AssertionError("Mode not localized");
                showSettings();
                select("settingsResolution", 1);
                click(actor("settingsApply"));
                wait = System.nanoTime();
                step = 5;
            }
            case 5 -> {
                if ((System.nanoTime() - wait) / 1e9 < 0.4) break;
                if (stage().getRoot().findActor("confirmDisplaySettings") == null)
                    throw new AssertionError("Missing confirmation");
                capture("confirm");
                stage().keyDown(Input.Keys.ESCAPE);
                if (getSettings().width() != 1280)
                    throw new AssertionError("Unconfirmed settings were saved");
                wait = System.nanoTime();
                step = 6;
            }
            case 6 -> {
                if ((System.nanoTime() - wait) / 1e9 < 0.7) break;
                if (Gdx.graphics.getWidth() != 1280)
                    throw new AssertionError(
                            "Display cancel not reverted, width=" + Gdx.graphics.getWidth());
                select("settingsResolution", 2);
                click(actor("settingsApply"));
                wait = System.nanoTime();
                step = 7;
            }
            case 7 -> {
                if ((System.nanoTime() - wait) / 1e9 < 16) break;
                if (stage().getRoot().findActor("confirmDisplaySettings") != null
                        || Gdx.graphics.getWidth() != 1280)
                    throw new AssertionError("Automatic rollback failed");
                checkSaved();
                System.out.println(
                        "PASS: SETTINGS click, live RU preview, cancel, apply, localized"
                            + " modes/placeholders, display confirm/cancel and 15-second rollback");
                Gdx.app.exit();
                step = 8;
            }
        }
    }
}
