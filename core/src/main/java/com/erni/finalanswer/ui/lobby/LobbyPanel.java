package com.erni.finalanswer.ui.lobby;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.Pixmap;
import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.g2d.BitmapFont;
import com.badlogic.gdx.scenes.scene2d.InputEvent;
import com.badlogic.gdx.scenes.scene2d.Stage;
import com.badlogic.gdx.scenes.scene2d.ui.*;
import com.badlogic.gdx.scenes.scene2d.utils.ClickListener;
import com.badlogic.gdx.scenes.scene2d.utils.TextureRegionDrawable;
import com.badlogic.gdx.utils.Align;
import com.badlogic.gdx.utils.Disposable;
import com.erni.finalanswer.FinalAnswerGame;
import com.erni.finalanswer.localization.Localization;
import com.erni.finalanswer.rooms.GameMode;
import com.erni.finalanswer.rooms.RoomSession;
import com.erni.finalanswer.ui.UiFonts;

/** Live lobby overlay on the existing main menu; no simulated players. */
public final class LobbyPanel extends Table implements Disposable {
    private final FinalAnswerGame game;
    private final Localization texts = new Localization("en");
    private final BitmapFont font = UiFonts.body(28);
    private final BitmapFont codeFont = UiFonts.code(88);
    private final Texture pixel;
    private final TextureRegionDrawable solid;
    private final Label code, name, settings, players, connection;
    private final Label title;
    private final ConnectionPanel phoneConnection;
    private final TextButton leave, cancel;
    private final TextButton impostor;
    private final Dialog joinDialog;
    private final TextField roomCode, playerName, password;
    private final Label joinError;
    private final TextButton join;
    private String selectedCharacter = "skeleton";
    private RoomSession displayed;
    private String displayedStatus;
    private int joinVersion;
    private boolean disposed;

    public LobbyPanel(FinalAnswerGame game) {this(game,game::leaveRoom);}
    /** Reuse the existing lobby in an explicitly connected minigame without replacing its socket. */
    public LobbyPanel(FinalAnswerGame game,Runnable leaveAction) {
        this.game = game;
        setName("roomLobby");
        Pixmap p = new Pixmap(1, 1, Pixmap.Format.RGBA8888);
        p.setColor(Color.WHITE);
        p.fill();
        pixel = new Texture(p);
        p.dispose();
        solid = new TextureRegionDrawable(pixel);
        setBackground(solid.tint(new Color(0.045f, 0.018f, 0.025f, 0.94f)));
        pad(28);
        title = label(texts.get("lobby.title"));
        title.setColor(Color.valueOf("D65A48"));
        add(title).left().growX().row();
        code = new Label("", new Label.LabelStyle(codeFont, Color.valueOf("F0E8DE")));
        code.setName("lobbyRoomCode");
        add(code).left().padTop(6).padBottom(8).growX().row();
        name = label("");
        name.setWrap(true);
        add(name).left().growX().row();
        settings = label("");
        settings.setFontScale(0.8f);
        settings.setWrap(true);
        add(settings).left().growX().padTop(8).row();
        phoneConnection=new ConnectionPanel(game.getHosting(),font,button("").getStyle());
        add(phoneConnection).colspan(2).growX().height(138).padTop(6).row();
        players = label("");
        players.setName("lobbyPlayers");
        players.setFontScale(0.72f);
        players.setAlignment(Align.topLeft);
        ScrollPane roster=new ScrollPane(players);roster.setScrollingDisabled(true,false);
        add(roster).left().top().grow().minHeight(24).padTop(10).row();
        connection = label("");
        connection.setFontScale(0.72f);
        connection.setWrap(true);
        add(connection).left().growX().padBottom(14).row();
        leave = button(texts.get("lobby.leave"));
        leave.setName("leaveRoom");
        leave.addListener(
                new ClickListener() {
                    @Override
                    public void clicked(InputEvent e, float x, float y) {
                        leaveAction.run();
                    }
                });
        add(leave).left().width(260).height(56);
        impostor=button("THE IMPOSTOR");impostor.setName("openImpostorLobby");
        impostor.addListener(new ClickListener(){@Override public void clicked(InputEvent e,float x,float y){if(!impostor.isDisabled())game.showImpostorLobby();}});
        add(impostor).width(300).height(56);impostor.setVisible(false);
        setVisible(false);

        joinDialog =
                new Dialog(
                        "JOIN ROOM",
                        new Window.WindowStyle(
                                font,
                                Color.valueOf("F0E8DE"),
                                solid.tint(Color.valueOf("211318")))) {
                    @Override
                    protected void result(Object value) {
                        if (Boolean.FALSE.equals(value)) joinVersion++;
                    }
                };
        joinDialog.setName("joinRoomDialog");
        joinDialog.setModal(true);
        joinDialog.setMovable(false);
        joinDialog.padTop(60);
        var content = joinDialog.getContentTable();
        content.pad(22);
        content.defaults().padBottom(12);
        roomCode = field("ROOM CODE", 6);
        roomCode.setName("joinRoomCode");
        playerName = field("Your name", 24);
        playerName.setName("joinPlayerName");
        password = field("Password (optional)", 64);
        password.setPasswordMode(true);
        password.setPasswordCharacter('*');
        content.add(roomCode).width(500).height(64).row();
        content.add(playerName).width(500).height(64).row();
        content.add(password).width(500).height(64).row();
        TextButton character = button("CHARACTER: SKELETON");
        character.setName("joinCharacter");
        character.addListener(new ClickListener() {
            @Override public void clicked(InputEvent event, float x, float y) {
                selectedCharacter = switch (selectedCharacter) {
                    case "skeleton" -> "ghost";
                    case "ghost" -> "zombie";
                    case "zombie" -> "dracula";
                    case "dracula" -> "pumpkin";
                    case "pumpkin" -> "plague_doctor";
                    case "plague_doctor" -> "voodoo";
                    case "voodoo" -> "puppeteer";
                    default -> "skeleton";
                };
                character.setText("CHARACTER: " + selectedCharacter.replace('_', ' ').toUpperCase(java.util.Locale.ROOT));
            }
        });
        content.add(character).width(500).height(56).row();
        joinError = label("");
        joinError.setColor(Color.valueOf("FF8A72"));
        joinError.setFontScale(0.8f);
        joinError.setWrap(true);
        content.add(joinError).width(500).minHeight(70).row();
        join = button("JOIN");
        join.setName("confirmJoinRoom");
        join.addListener(
                new ClickListener() {
                    @Override
                    public void clicked(InputEvent e, float x, float y) {
                        joinRoom();
                    }
                });
        content.add(join).width(240).height(64);
        cancel = button(texts.get("ui.cancel"));
        joinDialog.button(cancel, false);
        joinDialog.getButtonTable().getCell(cancel).width(240).height(56).padBottom(20);
        joinDialog.addListener(
                new com.badlogic.gdx.scenes.scene2d.InputListener() {
                    @Override
                    public boolean keyDown(InputEvent event, int keycode) {
                        if (keycode != com.badlogic.gdx.Input.Keys.ENTER) return false;
                        joinRoom();
                        return true;
                    }
                });
        joinDialog.key(com.badlogic.gdx.Input.Keys.ESCAPE, false);
    }

    private Label label(String text) {
        return new Label(text, new Label.LabelStyle(font, Color.valueOf("F0E8DE")));
    }

    private TextButton button(String text) {
        TextButton.TextButtonStyle style = new TextButton.TextButtonStyle();
        style.font = font;
        style.fontColor = Color.valueOf("F0E8DE");
        style.up = solid.tint(Color.valueOf("492029"));
        style.over = solid.tint(Color.valueOf("78312E"));
        style.down = solid.tint(Color.valueOf("A13D32"));
        style.disabled = solid.tint(Color.valueOf("302529"));
        style.disabledFontColor = Color.GRAY;
        return new TextButton(text, style);
    }

    private TextField field(String message, int max) {
        TextField.TextFieldStyle style = new TextField.TextFieldStyle();
        style.font = font;
        style.fontColor = Color.valueOf("F0E8DE");
        style.messageFontColor = Color.GRAY;
        style.background = solid.tint(Color.valueOf("100D11"));
        style.cursor = solid.tint(Color.valueOf("EE7B65"));
        style.cursor.setMinWidth(2);
        style.selection = solid.tint(Color.valueOf("78312E"));
        ((com.badlogic.gdx.scenes.scene2d.utils.BaseDrawable) style.background).setLeftWidth(14);
        ((com.badlogic.gdx.scenes.scene2d.utils.BaseDrawable) style.background).setRightWidth(14);
        TextField field = new TextField("", style);
        field.setMessageText(message);
        field.setMaxLength(max);
        return field;
    }

    public void showRoomRequired(Stage stage) {
        Dialog message =
                new Dialog(
                        texts.get("lobby.required_title"),
                        new Window.WindowStyle(
                                font,
                                Color.valueOf("F0E8DE"),
                                solid.tint(Color.valueOf("211318")))) {
                    @Override
                    protected void result(Object value) {
                        if ("join".equals(value)) {
                            Gdx.app.postRunnable(() -> openJoin(stage));
                        }
                    }
                };
        message.setName("roomRequiredDialog");
        message.setMovable(false);
        message.getContentTable().pad(24);
        message.text(label(texts.get("lobby.required")));
        message.getButtonTable().defaults().width(220).height(56).pad(8);

        message.button(button(texts.get("lobby.join_title")), "join");
        message.button(button(texts.get("ui.ok")), "close");

        message.key(com.badlogic.gdx.Input.Keys.ESCAPE, "close");
        message.key(com.badlogic.gdx.Input.Keys.ENTER, "close");
        message.show(stage);
    }

    public void setLanguage(String language) {
        texts.setLanguage(language);
        title.setText(texts.get("lobby.title"));
        leave.setText(texts.get("lobby.leave"));
        joinDialog.getTitleLabel().setText(texts.get("lobby.join_title"));
        roomCode.setMessageText(texts.get("lobby.code"));
        playerName.setMessageText(texts.get("lobby.player_name"));
        password.setMessageText(texts.get("lobby.password"));
        join.setText(texts.get("lobby.join"));
        cancel.setText(texts.get("ui.cancel"));
        displayed = null;
        displayedStatus = null;
    }

    public void openJoin(Stage stage) {
        if (game.getActiveRoom() != null || joinDialog.hasParent()) return;
        joinVersion++;
        join.setDisabled(false);
        joinError.setText("");
        roomCode.setText("");
        password.setText("");
        joinDialog.show(stage);
        stage.setKeyboardFocus(roomCode);
    }

    private void joinRoom() {
        if (join.isDisabled()) return;
        if (playerName.getText().trim().isEmpty()) {
            joinError.setText(texts.get("lobby.player_name_required"));
            return;
        }
        join.setDisabled(true);
        joinError.setText(texts.get("lobby.connecting"));
        int version = ++joinVersion;
        game.getRoomApi()
                .join(
                        roomCode.getText(),
                        playerName.getText(),
                        password.getText(),
                        selectedCharacter,
                        room -> {
                            if (disposed || version != joinVersion || !joinDialog.hasParent()) {
                                game.getRoomApi().leave(room);
                                return;
                            }
                            join.setDisabled(false);
                            joinDialog.hide();
                            game.activateRoom(room);
                        },
                        error -> {
                            if (!disposed && version == joinVersion) {
                                join.setDisabled(false);
                                joinError.setText(texts.error(error));
                            }
                        });
    }

    public void update(RoomSession room, String status) {
        setVisible(room != null);
        boolean showPhone=room!=null&&room.host();phoneConnection.setVisible(showPhone);getCell(phoneConnection).height(showPhone?138:0);
        if(room!=null)phoneConnection.room(room.code());
        boolean host=room!=null && room.host() && game.getActiveRoom()!=null;
        impostor.setVisible(host);impostor.setDisabled(!host || room.players().size()<3);
        getCell(impostor).width(host?300:0).height(host?56:0);
        if (room == null) {
            displayed = null;
            return;
        }
        if (room != displayed) {
            displayed = room;
            code.setText(room.code());
            code.setFontScale(.72f);
            name.setText(room.name());
            String modeName = room.gameMode();
            for (GameMode mode : GameMode.values())
                if (mode.getId().equals(room.gameMode())) modeName = texts.get(mode.getNameKey());
            settings.setText(
                    modeName
                            + "  |  "
                            + room.players().size()
                            + " / "
                            + room.maxPlayers()
                            + " "
                            + texts.get("lobby.players"));
            StringBuilder list = new StringBuilder();
            for (RoomSession.Player player : room.players())
                list.append(player.name())
                        .append("  ·  " + player.characterId().replace('_', ' ') + "  ·  " + player.connectionStatus())
                        .append('\n');
            players.setText(list);
        }
        if (!status.equals(displayedStatus)) {
            displayedStatus = status;
            connection.setText(status);
        }
    }

    @Override
    public void dispose() {
        disposed = true;
        joinVersion++;
        joinDialog.remove();
        font.dispose();
        codeFont.dispose();
        pixel.dispose();phoneConnection.dispose();
    }
}
