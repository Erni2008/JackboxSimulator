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
    private final BitmapFont font = UiFonts.body(26), codeFont = UiFonts.code(66), titleFont=UiFonts.question(48);
    private final Texture pixel;
    private final CageLobby cages = new CageLobby();
    private final ConnectionPanel phone;
    private final Label code, roomName, playerCount, connectedCount, status;
    private final TextButton play, impostor, cursed;
    private RoomSession displayed;
    private boolean disposed,starting,pendingStart,preloadQueued;
    private float pendingSeconds;
    private long transitionStarted,serverAnchor,nanoAnchor;
    private final Image blackout;
    private final Label roundTitle;
    public void startRequested(){pendingStart=true;pendingSeconds=0;lockButtons(true);}
    public void startRejected(){if(!starting)pendingStart=false;}
    private void resetTransition(){pendingStart=starting=preloadQueued=false;blackout.setColor(0,0,0,0);roundTitle.setVisible(false);}
    private void lockButtons(boolean locked){lockButtons(stage.getRoot(),locked);}
    private void lockButtons(com.badlogic.gdx.scenes.scene2d.Group group,boolean locked){
        for(var actor:group.getChildren()){
            if(actor instanceof TextButton button)button.setDisabled(locked);
            if(actor instanceof com.badlogic.gdx.scenes.scene2d.Group child)lockButtons(child,locked);
        }
    }
    public void transition(com.google.gson.JsonObject state,long serverNow){
        if(!state.has("transitionStartedAt"))return;
        long start=state.get("transitionStartedAt").getAsLong();
        if(starting&&transitionStarted==start)return; // Network refreshes never rewind the swing clock.
        preloadQueued=false;
        starting=true;pendingStart=false;transitionStarted=state.get("transitionStartedAt").getAsLong();
        serverAnchor=serverNow;nanoAnchor=System.nanoTime();lockButtons(true);
        roundTitle.setText(state.has("roundTitle")?state.get("roundTitle").getAsString():"ROUND 1");
    }

    public CageLobbyScreen(FinalAnswerGame game) {
        this.game = game;cages.audio(game.getAudio());
        Image scene = new Image(background); scene.setBounds(0, 0, 1920, 1080); stage.addActor(scene);
        stage.addActor(cages);
        // The background's original logo and parchment remain visible, with the code inside its ink field.
        code = new Label("", new Label.LabelStyle(codeFont, Color.valueOf("392014")));
        code.setAlignment(Align.center); code.setBounds(128, 503, 216, 94); stage.addActor(code);
        roomName = new Label("", new Label.LabelStyle(font, Color.valueOf("E9D8BE")));
        roomName.setWrap(true); roomName.setAlignment(Align.center); roomName.setBounds(60, 310, 390, 50); stage.addActor(roomName);
        playerCount=new Label("",new Label.LabelStyle(font,Color.valueOf("E9D8BE")));
        playerCount.setFontScale(1.25f);playerCount.setAlignment(Align.center);playerCount.setBounds(60,255,390,50);stage.addActor(playerCount);
        connectedCount=new Label("",new Label.LabelStyle(font,Color.valueOf("CFB998")));
        connectedCount.setFontScale(.72f);connectedCount.setAlignment(Align.center);connectedCount.setBounds(60,215,390,35);stage.addActor(connectedCount);
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
        play.setText(game.getTexts().get("lobby.start_game"));
        impostor = button("THE IMPOSTOR", 930, style, game::showImpostorLobby);
        cursed=button("CURSED BOXES",60,style,game::startCursedBoxesMultiplayer);cursed.setWidth(390);
        button("MENU", 1210, style, game::showMainMenu);
        button("LEAVE ROOM", 1490, style, () -> { game.leaveRoom(); game.showMainMenu(); });
        blackout=new Image(solid);blackout.setBounds(0,0,1920,1080);blackout.setColor(0,0,0,0);blackout.setTouchable(com.badlogic.gdx.scenes.scene2d.Touchable.disabled);stage.addActor(blackout);
        roundTitle=new Label("",new Label.LabelStyle(titleFont,Color.valueOf("DCC9AE")));
        roundTitle.setFontScale(1);roundTitle.setAlignment(Align.center);roundTitle.setBounds(220,440,1480,160);roundTitle.setVisible(false);stage.addActor(roundTitle);
    }
    private TextButton button(String text, float x, TextButton.TextButtonStyle style, Runnable action) {
        TextButton button = new TextButton(text, style); button.setBounds(x, 73, 250, 60);
        button.setName("cageLobby" + text.replace(" ", ""));
        button.addListener(new ClickListener() { @Override public void clicked(InputEvent event, float px, float py) {
            if (!button.isDisabled()) action.run();
        }}); stage.addActor(button); return button;
    }
    public CageLobby cages() { return cages; }
    public float blackoutOpacity(){return blackout.getColor().a;}
    /** Public for development fixtures; production always passes the existing live RoomSession. */
    public void synchronize(RoomSession room, String connectionStatus) {
        cages.synchronize(room);
        if(room!=null && displayed!=null && !room.code().equals(displayed.code()))resetTransition();
        if(room==null){resetTransition();for(int i=0;i<8;i++)cages.cage(i).departure(0);}
        if (displayed != room) {
            displayed = room;
            code.setText(room == null ? "" : room.code());
            roomName.setText(room == null ? "" : room.name());
            int online=room==null?0:(int)room.players().stream().filter(p->"ONLINE".equals(p.connectionStatus())).count();
            playerCount.setText(room==null?"":game.getTexts().format("lobby.player_count",room.players().size(),room.maxPlayers()));
            connectedCount.setText(room==null?"":game.getTexts().format("lobby.connected_count",online,room.players().size()));
            if (room != null) phone.room(room.code());
        }
        phone.setVisible(room != null && room.host());
        boolean host = room != null && room.host();
        boolean ready=host && room.players().size()>=2 && room.players().stream().allMatch(p->"ONLINE".equals(p.connectionStatus()));
        lockButtons(starting||pendingStart);
        cursed.setDisabled(starting||pendingStart||!ready);
        play.setDisabled(starting||pendingStart||!ready); impostor.setDisabled(starting||pendingStart||!host || room.players().size() < 3);
        String notice=connectionStatus;
        if(host&&!starting&&!pendingStart&&!ready){
            notice+=" · "+game.getTexts().error(room.players().size()<2?"NOT_ENOUGH_PLAYERS":"PLAYER_OFFLINE");
        }
        if(host&&ready&&!starting&&!pendingStart)notice+=" · "+game.getTexts().get("lobby.ready_to_start");
        status.setText(notice);
        cages.reducedMotion(game.getSettings().reducedMotion());
    }
    @Override public void show() { Gdx.input.setInputProcessor(stage); }
    @Override public void hide() { cages.stopAudio(); if (Gdx.input.getInputProcessor() == stage) Gdx.input.setInputProcessor(null); }
    @Override public void render(float delta) {
        if (!starting && !pendingStart && Gdx.input.isKeyJustPressed(Input.Keys.ESCAPE)) { game.showMainMenu(); return; }
        synchronize(game.getActiveRoom(), game.getLobbyStatus());
        draw(delta);
    }
    /** Also used by the isolated developer preview (which owns its synthetic roster). */
    public void draw(float delta) {
        if(pendingStart && (pendingSeconds+=delta)>10)startRejected();
        float age=starting?Math.max(0,(serverAnchor+(System.nanoTime()-nanoAnchor)/1_000_000-transitionStarted)/1000f):0;
        for(int i=0;i<8;i++)cages.cage(i).departure(age);
        float fade=starting?com.erni.finalanswer.ui.lobby.cages.LobbyStartAnimation.darkness(age):0;
        blackout.setColor(0,0,0,fade);roundTitle.setVisible(starting&&age>2.25f);
        roundTitle.getColor().a=Math.min(1,Math.max(0,(age-2.25f)/.6f));
        ScreenUtils.clear(.025f, .02f, .025f, 1); viewport.apply(); stage.act(delta); stage.draw();
        if(starting&&fade>=1&&!preloadQueued){
            preloadQueued=true;
            // The backend presents this black frame before this runnable allocates fonts/textures.
            Gdx.app.postRunnable(()->{if(!disposed&&starting&&game.getScreen()==this)game.prepareNetworkPlay();});
        }
    }
    @Override public void resize(int width, int height) { viewport.update(width, height, true); }
    @Override public void dispose() {
        if (disposed) return; disposed = true; hide();
        stage.dispose(); cages.dispose(); phone.dispose(); font.dispose(); codeFont.dispose(); titleFont.dispose(); pixel.dispose(); background.dispose();
    }
}
