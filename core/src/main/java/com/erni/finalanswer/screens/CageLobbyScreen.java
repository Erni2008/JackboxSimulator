package com.erni.finalanswer.screens;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.Input;
import com.badlogic.gdx.ScreenAdapter;
import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.Pixmap;
import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.g2d.BitmapFont;
import com.badlogic.gdx.scenes.scene2d.Stage;
import com.badlogic.gdx.scenes.scene2d.InputEvent;
import com.badlogic.gdx.scenes.scene2d.ui.Image;
import com.badlogic.gdx.scenes.scene2d.ui.Label;
import com.badlogic.gdx.scenes.scene2d.ui.TextButton;
import com.badlogic.gdx.scenes.scene2d.utils.ClickListener;
import com.badlogic.gdx.scenes.scene2d.utils.TextureRegionDrawable;
import com.badlogic.gdx.utils.Align;
import com.badlogic.gdx.utils.ScreenUtils;
import com.badlogic.gdx.utils.viewport.FitViewport;
import com.erni.finalanswer.FinalAnswerGame;
import com.erni.finalanswer.rooms.RoomSession;
import com.erni.finalanswer.ui.RuntimeTextures;
import com.erni.finalanswer.ui.UiFonts;
import com.erni.finalanswer.ui.lobby.ConnectionPanel;
import com.erni.finalanswer.ui.lobby.cages.CageLobby;

/** Room-only view. Existing menu, room creation, minigame and question screens retain their owners. */
public final class CageLobbyScreen extends ScreenAdapter {
    private final FinalAnswerGame game;
    private final FitViewport viewport = new FitViewport(1920, 1080);
    private final Stage stage = new Stage(viewport);
    private final Texture background = RuntimeTextures.load("lobby/background_cages.png");
    private final BitmapFont font = UiFonts.body(26), codeFont = UiFonts.code(66);
    private final Texture pixel;
    private final CageLobby cages = new CageLobby();
    private final ConnectionPanel phone;
    private final Label code, roomName, status;
    private final TextButton play, impostor;
    private RoomSession displayed;
    private boolean disposed;

    public CageLobbyScreen(FinalAnswerGame game) {
        this.game = game;
        Image scene = new Image(background); scene.setBounds(0, 0, 1920, 1080); stage.addActor(scene);
        stage.addActor(cages);
        // The background's original logo and parchment remain visible, with the code inside its ink field.
        code = new Label("", new Label.LabelStyle(codeFont, Color.valueOf("392014")));
        code.setAlignment(Align.center); code.setBounds(128, 503, 216, 94); stage.addActor(code);
        roomName = new Label("", new Label.LabelStyle(font, Color.valueOf("E9D8BE")));
        roomName.setWrap(true); roomName.setAlignment(Align.center); roomName.setBounds(60, 260, 390, 92); stage.addActor(roomName);
        Pixmap p = new Pixmap(1, 1, Pixmap.Format.RGBA8888); p.setColor(Color.WHITE); p.fill();
        pixel = new Texture(p); p.dispose();
        var solid = new TextureRegionDrawable(pixel);
        var style = new TextButton.TextButtonStyle(); style.font = font; style.fontColor = Color.valueOf("EBDCC6");
        style.up = solid.tint(new Color(.08f, .055f, .05f, .88f));
        style.over = solid.tint(Color.valueOf("604131")); style.down = solid.tint(Color.valueOf("38241D"));
        style.disabledFontColor = Color.GRAY;
        phone = new ConnectionPanel(game.getHosting(), font, style); phone.setBounds(650, 145, 1100, 130); stage.addActor(phone);
        status = new Label("", new Label.LabelStyle(font, Color.valueOf("CFB998")));
        status.setFontScale(.75f); status.setWrap(true); status.setBounds(650, 280, 1100, 32); stage.addActor(status);
        play = button("PLAY", 650, style, game::showPlayScreen);
        impostor = button("THE IMPOSTOR", 930, style, game::showImpostorLobby);
        button("MENU", 1210, style, game::showMainMenu);
        button("LEAVE ROOM", 1490, style, () -> { game.leaveRoom(); game.showMainMenu(); });
    }
    private TextButton button(String text, float x, TextButton.TextButtonStyle style, Runnable action) {
        TextButton button = new TextButton(text, style); button.setBounds(x, 73, 250, 60);
        button.setName("cageLobby" + text.replace(" ", ""));
        button.addListener(new ClickListener() { @Override public void clicked(InputEvent event, float px, float py) {
            if (!button.isDisabled()) action.run();
        }}); stage.addActor(button); return button;
    }
    public CageLobby cages() { return cages; }
    /** Public for development fixtures; production always passes the existing live RoomSession. */
    public void synchronize(RoomSession room, String connectionStatus) {
        cages.synchronize(room);
        if (displayed != room) {
            displayed = room;
            code.setText(room == null ? "" : room.code());
            roomName.setText(room == null ? "" : room.name() + "\n" + room.players().size() + " / " + room.maxPlayers());
            if (room != null) phone.room(room.code());
        }
        phone.setVisible(room != null && room.host());
        boolean host = room != null && room.host();
        play.setDisabled(!host); impostor.setDisabled(!host || room.players().size() < 3);
        status.setText(connectionStatus);
        cages.reducedMotion(game.getSettings().reducedMotion());
    }
    @Override public void show() { Gdx.input.setInputProcessor(stage); }
    @Override public void hide() { if (Gdx.input.getInputProcessor() == stage) Gdx.input.setInputProcessor(null); }
    @Override public void render(float delta) {
        if (Gdx.input.isKeyJustPressed(Input.Keys.ESCAPE)) { game.showMainMenu(); return; }
        synchronize(game.getActiveRoom(), game.getLobbyStatus());
        draw(delta);
    }
    /** Also used by the isolated developer preview (which owns its synthetic roster). */
    public void draw(float delta) {
        ScreenUtils.clear(.025f, .02f, .025f, 1); viewport.apply(); stage.act(delta); stage.draw();
    }
    @Override public void resize(int width, int height) { viewport.update(width, height, true); }
    @Override public void dispose() {
        if (disposed) return; disposed = true; hide();
        stage.dispose(); cages.dispose(); phone.dispose(); font.dispose(); codeFont.dispose(); pixel.dispose(); background.dispose();
    }
}
