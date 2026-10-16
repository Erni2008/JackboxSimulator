package com.erni.finalanswer.ui.windows;

import com.badlogic.gdx.Input;
import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.Pixmap;
import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.g2d.Batch;
import com.badlogic.gdx.graphics.g2d.BitmapFont;
import com.badlogic.gdx.graphics.g2d.TextureRegion;
import com.badlogic.gdx.scenes.scene2d.Stage;
import com.badlogic.gdx.scenes.scene2d.ui.Dialog;
import com.badlogic.gdx.scenes.scene2d.ui.Label;
import com.badlogic.gdx.scenes.scene2d.ui.TextButton;
import com.badlogic.gdx.scenes.scene2d.ui.Window;
import com.badlogic.gdx.scenes.scene2d.utils.BaseDrawable;
import com.badlogic.gdx.scenes.scene2d.utils.TextureRegionDrawable;
import com.badlogic.gdx.utils.Align;
import com.badlogic.gdx.utils.Disposable;

/** Modal information only; closing it never changes the selected game mode. */
public final class ModeInfoDialog extends Dialog implements Disposable {
    private final Texture pixel;
    private final Label description;
    private final TextButton close;
    private boolean disposed;

    public ModeInfoDialog(BitmapFont titleFont, BitmapFont bodyFont) {
        this(createPixel(), titleFont, bodyFont);
    }

    private ModeInfoDialog(Texture pixel, BitmapFont titleFont, BitmapFont bodyFont) {
        super("", new Window.WindowStyle(titleFont,
            new Color(0.98f, 0.9f, 0.82f, 1), new PanelDrawable(pixel)));
        this.pixel = pixel;
        setName("modeInfoDialog");
        setModal(true);
        setMovable(false);
        setResizable(false);
        setKeepWithinStage(true);
        TextureRegionDrawable solid = new TextureRegionDrawable(new TextureRegion(pixel));
        getStyle().stageBackground = solid.tint(new Color(0.008f, 0.003f, 0.008f, 0.72f));
        getTitleLabel().setAlignment(Align.center);
        getTitleTable().padLeft(28).padRight(28);

        description = new Label("", new Label.LabelStyle(bodyFont,
            new Color(0.88f, 0.84f, 0.81f, 1)));
        description.setName("modeInfoDescription");
        description.setWrap(true);
        description.setAlignment(Align.topLeft);
        getContentTable().pad(36, 30, 14, 30);
        getContentTable().add(description).width(740).minHeight(210);

        TextButton.TextButtonStyle style = new TextButton.TextButtonStyle();
        style.font = bodyFont;
        style.fontColor = new Color(0.96f, 0.88f, 0.83f, 1);
        style.up = solid.tint(new Color(0.23f, 0.045f, 0.045f, 1));
        style.over = solid.tint(new Color(0.36f, 0.065f, 0.06f, 1));
        style.down = solid.tint(new Color(0.16f, 0.025f, 0.025f, 1));
        close = new TextButton("", style);
        close.setName("closeModeInfo");
        getButtonTable().pad(10, 24, 24, 24);
        button(close);
        getButtonTable().getCell(close).width(190).height(50);
        key(Input.Keys.ESCAPE, true);
        key(Input.Keys.ENTER, true);
    }

    public void open(Stage stage, String name, String text, String closeText) {
        if (disposed || hasParent()) return;
        getTitleLabel().setText(name);
        description.setText(text);
        close.setText(closeText);
        show(stage);
    }

    private static Texture createPixel() {
        Pixmap image = new Pixmap(1, 1, Pixmap.Format.RGBA8888);
        image.setColor(Color.WHITE);
        image.fill();
        Texture result = new Texture(image);
        image.dispose();
        return result;
    }

    private static final class PanelDrawable extends BaseDrawable {
        private final Texture pixel;

        PanelDrawable(Texture pixel) {
            this.pixel = pixel;
            setTopHeight(60);
            setBottomHeight(14);
            setLeftWidth(10);
            setRightWidth(10);
        }

        @Override
        public void draw(Batch batch, float x, float y, float width, float height) {
            float packed = batch.getPackedColor();
            float alpha = batch.getColor().a;
            batch.setColor(0.37f, 0.075f, 0.07f, alpha);
            batch.draw(pixel, x, y, width, height);
            batch.setColor(0.045f, 0.025f, 0.035f, alpha);
            batch.draw(pixel, x + 2, y + 2, width - 4, height - 4);
            batch.setColor(0.14f, 0.04f, 0.045f, alpha);
            batch.draw(pixel, x + 2, y + height - 60, width - 4, 58);
            batch.setPackedColor(packed);
        }
    }

    @Override
    public void dispose() {
        if (disposed) return;
        disposed = true;
        remove();
        pixel.dispose();
        // Fonts belong to OptionsMainWindow.
    }
}
