package com.erni.finalanswer.screens;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.Input;
import com.badlogic.gdx.ScreenAdapter;
import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.Pixmap;
import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.g2d.BitmapFont;
import com.badlogic.gdx.scenes.scene2d.*;
import com.badlogic.gdx.scenes.scene2d.ui.*;
import com.badlogic.gdx.scenes.scene2d.utils.*;
import com.badlogic.gdx.utils.Align;
import com.badlogic.gdx.utils.ScreenUtils;
import com.badlogic.gdx.utils.TimeUtils;
import com.badlogic.gdx.utils.viewport.FitViewport;
import com.erni.finalanswer.FinalAnswerGame;
import com.erni.finalanswer.settings.GameSettings;
import com.erni.finalanswer.ui.UiFonts;

import java.util.*;

/** Cached settings view. Preview language, apply preferences, confirm display changes. */
public final class SettingsScreen extends ScreenAdapter {
    private static final int[] FPS = {30, 60, 120, 144, 240, 0};
    private static final int[][] SIZES = {{1280, 720}, {1600, 900}, {1920, 1080}};
    private final FinalAnswerGame game;
    private final Stage stage = new Stage(new FitViewport(1920, 1080));
    private final Skin skin = new Skin();
    private final Map<String, Label> captions = new LinkedHashMap<>();
    private final java.util.List<Actor> focusOrder = new ArrayList<>();
    private final SelectBox<String> language, resolution, fps;
    private final CheckBox fullscreen, vsync, motion;
    private final TextButton apply, back, defaults;
    private final Label status;
    private final ScrollPane scroll;
    private Dialog confirmation;
    private Label countdown;
    private long confirmationDeadline;
    private GameSettings pending;
    private boolean updating, disposed;
    private boolean applying;
    private String statusKey = "settings.pending";

    public SettingsScreen(FinalAnswerGame game) {
        this.game = game;
        buildSkin();
        Table root = new Table();
        root.setFillParent(true);
        stage.addActor(root);
        Table panel = new Table();
        panel.setName("settingsPanel");
        panel.setBackground(skin.newDrawable("white", Color.valueOf("160F14")));
        panel.pad(32, 42, 28, 42);
        root.add(panel).width(1380).height(1000);
        Label title = caption("settings.title");
        title.setStyle(new Label.LabelStyle(skin.getFont("heading"), Color.valueOf("F0E8DE")));
        panel.add(title).left().growX().row();
        panel.add(caption("settings.subtitle")).left().growX().padTop(4).padBottom(20).row();
        Image line = new Image(skin.newDrawable("white", Color.valueOf("9D3939")));
        panel.add(line).height(2).growX().padBottom(14).row();
        Table content = new Table();
        content.top();
        content.defaults().padTop(5).padBottom(5);
        scroll = new ScrollPane(content, skin);
        scroll.setName("settingsScroll");
        scroll.setScrollingDisabled(true, false);
        scroll.setFadeScrollBars(false);
        scroll.setFlickScroll(false);
        panel.add(scroll).grow().row();
        language = select("settingsLanguage", "English", "Русский");
        resolution = select("settingsResolution", "1280 × 720", "1600 × 900", "1920 × 1080");
        fps =
                select(
                        "settingsFps",
                        "30 FPS",
                        "60 FPS",
                        "120 FPS",
                        "144 FPS",
                        "240 FPS",
                        "Unlimited");
        fullscreen = check("settingsFullscreen");
        vsync = check("settingsVsync");
        motion = check("settingsReducedMotion");
        section(content, "settings.language_section");
        row(content, "settings.language", "settings.language_hint", language);
        section(content, "settings.display_section");
        row(content, "settings.fullscreen", null, fullscreen);
        row(content, "settings.resolution", "settings.native_resolution", resolution);
        row(content, "settings.vsync", "settings.vsync_hint", vsync);
        row(content, "settings.fps", null, fps);
        section(content, "settings.comfort_section");
        row(content, "settings.reduced_motion", "settings.motion_hint", motion);
        Table footer = new Table();
        footer.defaults().height(64).padTop(18);
        back = button("settingsBack");
        defaults = button("settingsDefaults");
        apply = button("settingsApply");
        footer.add(back).width(260);
        footer.add(defaults).width(360).padLeft(18);
        footer.add().growX();
        footer.add(apply).width(290);
        panel.add(footer).growX().row();
        status = new Label("", skin);
        status.setName("settingsStatus");
        status.setFontScale(0.78f);
        status.setWrap(true);
        panel.add(status).left().growX().height(50).padTop(6);
        focusOrder.addAll(
                java.util.List.of(
                        language,
                        fullscreen,
                        resolution,
                        vsync,
                        fps,
                        motion,
                        back,
                        defaults,
                        apply));
        language.addListener(
                new ChangeListener() {
                    @Override
                    public void changed(ChangeEvent e, Actor a) {
                        if (updating) return;
                        game.previewLanguage(language.getSelectedIndex() == 1 ? "ru" : "en");
                        changedSetting();
                    }
                });
        for (Actor control : java.util.List.of(fullscreen, resolution, vsync, fps, motion))
            control.addListener(
                    new ChangeListener() {
                        @Override
                        public void changed(ChangeEvent e, Actor a) {
                            if (!updating) changedSetting();
                        }
                    });
        apply.addListener(
                new ChangeListener() {
                    @Override
                    public void changed(ChangeEvent e, Actor a) {
                        if (!apply.isDisabled()) applySettings();
                    }
                });
        back.addListener(
                new ChangeListener() {
                    @Override
                    public void changed(ChangeEvent e, Actor a) {
                        cancel();
                    }
                });
        defaults.addListener(
                new ChangeListener() {
                    @Override
                    public void changed(ChangeEvent e, Actor a) {
                        loadValues(GameSettings.defaults());
                        game.previewLanguage("en");
                        changedSetting();
                    }
                });
        stage.addListener(
                new InputListener() {
                    @Override
                    public boolean keyDown(InputEvent event, int key) {
                        if (confirmation != null) return false;
                        if (key == Input.Keys.ESCAPE) {
                            cancel();
                            return true;
                        }
                        if (key == Input.Keys.TAB) {
                            int index = focusOrder.indexOf(stage.getKeyboardFocus());
                            int direction = UIUtils.shift() ? -1 : 1;
                            do {
                                index = Math.floorMod(index + direction, focusOrder.size());
                            } while (focusOrder.get(index) == resolution && resolution.isDisabled()
                                    || focusOrder.get(index) == apply && apply.isDisabled());
                            stage.setKeyboardFocus(focusOrder.get(index));
                            return true;
                        }
                        if ((key == Input.Keys.ENTER || key == Input.Keys.SPACE)
                                && stage.getKeyboardFocus() instanceof Button button) {
                            if (!button.isDisabled()) button.toggle();
                            return true;
                        }
                        return false;
                    }
                });
        refreshLanguage();
    }

    private void buildSkin() {
        BitmapFont body = UiFonts.body(28), heading = UiFonts.body(48);
        skin.add("body", body);
        skin.add("heading", heading);
        Pixmap image = new Pixmap(1, 1, Pixmap.Format.RGBA8888);
        image.setColor(Color.WHITE);
        image.fill();
        Texture pixel = new Texture(image);
        image.dispose();
        skin.add("pixel", pixel);
        skin.add("white", new TextureRegionDrawable(pixel), Drawable.class);
        skin.add("default", new Label.LabelStyle(body, Color.valueOf("D8CEC8")));
        TextButton.TextButtonStyle buttons = new TextButton.TextButtonStyle();
        buttons.font = body;
        buttons.fontColor = Color.valueOf("F0E8DE");
        buttons.up = surface("46212B");
        buttons.over = surface("75353A");
        buttons.down = surface("A64940");
        buttons.focused = surface("75353A");
        buttons.disabled = surface("292127");
        buttons.disabledFontColor = Color.valueOf("756B70");
        skin.add("default", buttons);
        CheckBox.CheckBoxStyle checks = new CheckBox.CheckBoxStyle();
        checks.font = body;
        checks.fontColor = Color.valueOf("F0E8DE");
        checks.checkboxOff = square("514149");
        checks.checkboxOn = square("D4614C");
        checks.checkboxOver = square("90615B");
        checks.checkboxOnOver = square("F09172");
        skin.add("default", checks);
        ScrollPane.ScrollPaneStyle scrolling = new ScrollPane.ScrollPaneStyle();
        scrolling.background = surface("160F14");
        scrolling.vScroll = surface("241B22");
        scrolling.vScrollKnob = surface("794039");
        scrolling.vScroll.setMinWidth(7);
        scrolling.vScrollKnob.setMinWidth(7);
        skin.add("default", scrolling);
        com.badlogic.gdx.scenes.scene2d.ui.List.ListStyle list =
                new com.badlogic.gdx.scenes.scene2d.ui.List.ListStyle(
                        body, Color.valueOf("FFFFFF"), Color.valueOf("E4D7CE"), surface("793B39"));
        list.background = surface("24171F");
        SelectBox.SelectBoxStyle select =
                new SelectBox.SelectBoxStyle(
                        body, Color.valueOf("F0E8DE"), padded("35242E"), scrolling, list);
        select.backgroundOver = padded("54343C");
        select.backgroundOpen = padded("753B3D");
        select.backgroundDisabled = padded("211B20");
        select.disabledFontColor = Color.valueOf("756B70");
        skin.add("default", select);
        Window.WindowStyle windows =
                new Window.WindowStyle(body, Color.valueOf("F0E8DE"), surface("271820"));
        windows.stageBackground = skin.newDrawable("white", new Color(0, 0, 0, 0.65f));
        skin.add("default", windows);
    }

    private Drawable surface(String color) {
        return skin.newDrawable("white", Color.valueOf(color));
    }

    private Drawable padded(String color) {
        BaseDrawable drawable = (BaseDrawable) surface(color);
        drawable.setLeftWidth(18);
        drawable.setRightWidth(22);
        drawable.setTopHeight(10);
        drawable.setBottomHeight(10);
        return drawable;
    }

    private Drawable square(String color) {
        BaseDrawable drawable = (BaseDrawable) surface(color);
        drawable.setMinWidth(28);
        drawable.setMinHeight(28);
        return drawable;
    }

    private Label caption(String key) {
        Label label = new Label("", skin);
        label.setName(key);
        label.setWrap(true);
        captions.put(key, label);
        return label;
    }

    private SelectBox<String> select(String name, String... items) {
        SelectBox<String> box = new SelectBox<>(skin);
        box.setName(name);
        box.setItems(items);
        return box;
    }

    private CheckBox check(String name) {
        CheckBox box = new CheckBox("", skin);
        box.setName(name);
        box.getImageCell().padRight(16);
        box.left();
        return box;
    }

    private TextButton button(String name) {
        TextButton button = new TextButton("", skin);
        button.setName(name);
        return button;
    }

    private void section(Table content, String key) {
        Label label = caption(key);
        label.setColor(Color.valueOf("D16A58"));
        label.setFontScale(0.78f);
        content.add(label).colspan(2).left().growX().padTop(14).padBottom(4).row();
    }

    private void row(Table content, String key, String hint, Actor control) {
        Table labels = new Table();
        labels.add(caption(key)).growX().left().row();
        if (hint != null) {
            Label note = caption(hint);
            note.setFontScale(0.76f);
            note.setColor(Color.valueOf("AFA0A6"));
            labels.add(note).growX().left().padTop(4);
        }
        content.add(labels).width(720).left().padRight(45);
        content.add(control).width(390).height(60).left().row();
    }

    public void refreshLanguage() {
        updating = true;
        captions.forEach((key, label) -> label.setText(game.getTexts().get(key)));
        int old = fps.getSelectedIndex();
        fps.setItems(
                "30 FPS",
                "60 FPS",
                "120 FPS",
                "144 FPS",
                "240 FPS",
                game.getTexts().get("settings.unlimited"));
        fps.setSelectedIndex(Math.max(0, old));
        apply.setText(game.getTexts().get("settings.apply"));
        back.setText(game.getTexts().get("settings.cancel"));
        defaults.setText(game.getTexts().get("settings.reset"));
        refreshChecks();
        status.setText(game.getTexts().get(statusKey));
        updating = false;
    }

    private void refreshChecks() {
        for (CheckBox check : java.util.List.of(fullscreen, vsync, motion))
            check.setText(game.getTexts().get(check.isChecked() ? "settings.on" : "settings.off"));
        resolution.setDisabled(fullscreen.isChecked());
    }

    private void changedSetting() {
        refreshChecks();
        statusKey = "settings.pending";
        status.setText(game.getTexts().get(statusKey));
        apply.setDisabled(draft().equals(game.getSettings()));
    }

    private GameSettings draft() {
        int[] size = SIZES[resolution.getSelectedIndex()];
        return new GameSettings(
                language.getSelectedIndex() == 1 ? "ru" : "en",
                fullscreen.isChecked(),
                size[0],
                size[1],
                vsync.isChecked(),
                FPS[fps.getSelectedIndex()],
                motion.isChecked());
    }

    private void loadValues(GameSettings settings) {
        updating = true;
        language.setSelectedIndex(settings.language().equals("ru") ? 1 : 0);
        fullscreen.setChecked(settings.fullscreen());
        vsync.setChecked(settings.vsync());
        motion.setChecked(settings.reducedMotion());
        for (int i = 0; i < SIZES.length; i++)
            if (SIZES[i][0] == settings.width() && SIZES[i][1] == settings.height())
                resolution.setSelectedIndex(i);
        for (int i = 0; i < FPS.length; i++)
            if (FPS[i] == settings.fpsLimit()) fps.setSelectedIndex(i);
        updating = false;
        changedSetting();
    }

    public void beginEdit() {
        loadValues(game.getSettings());
        refreshLanguage();
        scroll.setScrollY(0);
    }

    private void applySettings() {
        if (applying || confirmation != null) return;
        applying = true;
        pending = draft();
        apply.setDisabled(true);
        Gdx.app.postRunnable(
                () -> {
                    if (disposed) return;
                    try {
                        performApply();
                    } finally {
                        applying = false;
                    }
                });
    }

    private void performApply() {
        GameSettings previous = game.getSettings();
        boolean displayChange =
                pending.fullscreen() != previous.fullscreen()
                        || pending.width() != previous.width()
                        || pending.height() != previous.height();
        if (!displayChange) {
            commit();
            return;
        }
        try {
            game.previewDisplay(pending);
        } catch (RuntimeException error) {
            restoreDisplay();
            statusKey = "settings.failed";
            refreshLanguage();
            return;
        }
        countdown = new Label("", skin);
        countdown.setAlignment(Align.center);
        confirmation =
                new Dialog(game.getTexts().get("settings.keep_title"), skin) {
                    @Override
                    protected void result(Object keep) {
                        if (confirmation != this) return;
                        confirmation = null;
                        if (Boolean.TRUE.equals(keep)) commit();
                        else restoreDisplay();
                    }
                };
        confirmation.setName("confirmDisplaySettings");
        confirmation.setMovable(false);
        confirmation.padTop(60);
        confirmation.getContentTable().pad(32);
        confirmation.text(countdown);
        confirmation.getButtonTable().defaults().width(270).height(64).pad(12);
        confirmation.button(game.getTexts().get("settings.keep"), true);
        confirmation.button(game.getTexts().get("settings.revert"), false);
        confirmation.key(Input.Keys.ESCAPE, false);
        confirmation.key(Input.Keys.ENTER, true);
        confirmationDeadline = TimeUtils.nanoTime() + 15_000_000_000L;
        updateCountdown();
        confirmation.show(stage);
    }

    private void commit() {
        try {
            game.commitSettings(pending);
            statusKey = "settings.saved";
            loadValues(game.getSettings());
            statusKey = "settings.saved";
            refreshLanguage();
        } catch (RuntimeException error) {
            restoreDisplay();
            statusKey = "settings.failed";
            refreshLanguage();
        }
        pending = null;
    }

    private void restoreDisplay() {
        game.previewDisplay(game.getSettings());
        game.previewLanguage(game.getSettings().language());
        pending = null;
        loadValues(game.getSettings());
        statusKey = "settings.reverted";
        refreshLanguage();
    }

    private void updateCountdown() {
        int seconds =
                Math.max(0, (int) Math.ceil((confirmationDeadline - TimeUtils.nanoTime()) / 1e9));
        countdown.setText(game.getTexts().format("settings.keep_countdown", seconds));
        if (seconds == 0) {
            Dialog dialog = confirmation;
            confirmation = null;
            dialog.hide();
            restoreDisplay();
        }
    }

    private void cancel() {
        if (confirmation != null || applying) return;
        game.previewLanguage(game.getSettings().language());
        Gdx.app.postRunnable(game::showMainMenu);
    }

    @Override
    public void show() {
        Gdx.input.setInputProcessor(stage);
        stage.setScrollFocus(scroll);
        stage.setKeyboardFocus(language);
    }

    @Override
    public void render(float delta) {
        if (confirmation != null) updateCountdown();
        ScreenUtils.clear(0.025f, 0.018f, 0.025f, 1);
        stage.getViewport().apply();
        stage.act(Math.min(Math.max(delta, 0), 0.1f));
        stage.draw();
    }

    @Override
    public void resize(int width, int height) {
        stage.getViewport().update(width, height, true);
    }

    @Override
    public void hide() {
        if (Gdx.input.getInputProcessor() == stage) Gdx.input.setInputProcessor(null);
    }

    @Override
    public void dispose() {
        if (disposed) return;
        disposed = true;
        hide();
        stage.dispose();
        skin.dispose();
    }
}
