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
    private final Texture background = RuntimeTextures.load("lobby/background_dungeon.png");
    private final BitmapFont font = UiFonts.body(26), codeFont = UiFonts.code(66), titleFont=UiFonts.question(48), titleBig=UiFonts.horror(104), buttonFont=UiFonts.nameplate(30);
    private final com.erni.finalanswer.ui.lobby.LobbyStyle lobbyStyle = new com.erni.finalanswer.ui.lobby.LobbyStyle(buttonFont);
    private final Texture pixel;
    private final CageLobby cages = new CageLobby();
    private final com.erni.finalanswer.ui.lobby.LobbyAtmosphere atmosphere = new com.erni.finalanswer.ui.lobby.LobbyAtmosphere();
    private final ConnectionPanel phone;
    private final Label code, roomName, playerCount, connectedCount, status;
    /** THE LAST COMMAND is hidden from the mode selector until it is reworked (its code and logic stay). */
    public static final boolean LAST_COMMAND_ENABLED = false;
    /** THE FORGOTTEN ROOM is parked (2026-11-11) until its objects can look right; all its code stays. */
    public static final boolean FORGOTTEN_ROOM_ENABLED = false;
    private final TextButton play, impostor, cursed, cards, lastCommand, modePrev, modeNext, modeStart;
    private final Label modeName, modeHint;
    private final BitmapFont modeFont=UiFonts.body(30);
    /** Lobby mode selector: one entry per room mode, cycled with the arrows and started with one button. */
    private record Mode(String title,String hint,TextButton source,Runnable action){}
    private final java.util.List<Mode> modes=new java.util.ArrayList<>();
    private int modeIndex;
    private RoomSession displayed;
    private boolean disposed,starting,pendingStart,preloadQueued;
    private float pendingSeconds;
    private long transitionStarted,serverAnchor,nanoAnchor;
    private final Image blackout;
    private final Label roundTitle;
    private final com.erni.finalanswer.intro.BasementIntro intro;
    private final com.badlogic.gdx.scenes.scene2d.Group posterShade=new com.badlogic.gdx.scenes.scene2d.Group();
    private final com.badlogic.gdx.utils.Array<com.badlogic.gdx.scenes.scene2d.Actor> cinematicHidden=new com.badlogic.gdx.utils.Array<>();
    private boolean introReview;
    private boolean introAborted;
    public void abortIntro(){resetTransition();introAborted=true;}
    /** Explicit local QA only; never set from room/controller messages. */
    public void reviewIntroNarration(boolean value){introReview=value;}
    public boolean introActive(){return intro.isVisible();}
    public boolean introAmbience(){return !introActive()||intro.ambience();}
    public float introAmbienceGain(){return introActive()?intro.ambienceGain():1;}
    public void startRequested(){pendingStart=true;pendingSeconds=0;lockButtons(true);}
    public void startRejected(){if(!starting)pendingStart=false;}
    private void resetTransition(){intro.end();posterShade.setVisible(false);for(var actor:cinematicHidden)actor.setVisible(true);pendingStart=starting=preloadQueued=false;blackout.setColor(0,0,0,0);roundTitle.setVisible(false);}
    private void lockButtons(boolean locked){lockButtons(stage.getRoot(),locked);}
    private void lockButtons(com.badlogic.gdx.scenes.scene2d.Group group,boolean locked){
        for(var actor:group.getChildren()){
            if(actor instanceof TextButton button&&!"skipIntro".equals(button.getName()))button.setDisabled(locked);
            if(actor instanceof com.badlogic.gdx.scenes.scene2d.Group child)lockButtons(child,locked);
        }
    }
    public void transition(com.google.gson.JsonObject state,long serverNow){
        if(state.has("intro")){
            if(!introActive())preloadQueued=false;
            var data=state.getAsJsonObject("intro");starting=true;pendingStart=false;lockButtons(true);
            intro.begin(state.get("gameId").getAsString(),data.get("elapsedMillis").getAsFloat()/1000f,introReview,event->{
                var connection=game.getRealtime();if(connection!=null&&connection.connected())connection.send(event,java.util.Map.of("gameId",state.get("gameId").getAsString(),"introId",data.get("introId").getAsString()));
            });
            intro.pause(data.get("paused").getAsBoolean());cinematicUi();return;
        }
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
        stage.addActor(atmosphere.layer(com.erni.finalanswer.ui.lobby.LobbyAtmosphere.Layer.BACK));
        stage.addActor(cages);
        stage.addActor(atmosphere.layer(com.erni.finalanswer.ui.lobby.LobbyAtmosphere.Layer.FRONT));
        // Left column on the dungeon background: the title, the room-code plaque, the QR plaque (the wall candle stays visible)
        Label title = new Label("FINAL ANSWER", new Label.LabelStyle(titleBig, Color.valueOf("C42318"))); title.setAlignment(Align.left); title.setBounds(44, 958, 760, 104);
        Label titleShadow = new Label("FINAL ANSWER", new Label.LabelStyle(titleBig, new Color(0, 0, 0, .85f))); titleShadow.setAlignment(Align.left); titleShadow.setBounds(49, 952, 760, 104);
        stage.addActor(titleShadow); stage.addActor(title);
        roomName = new Label("", new Label.LabelStyle(font, Color.valueOf("D9C4A0")));
        roomName.setAlignment(Align.left); roomName.setFontScale(.9f); roomName.setBounds(52, 918, 600, 40); stage.addActor(roomName);
        Image codePlaque = new Image(com.erni.finalanswer.ui.lobby.LobbyPlaque.drawable()); codePlaque.setBounds(36, 448, 452, 228); stage.addActor(codePlaque);
        Label codeCaption = new Label(game.getTexts().get("lobby.code"), new Label.LabelStyle(font, Color.valueOf("C9A46A"))); codeCaption.setFontScale(.78f); codeCaption.setAlignment(Align.center); codeCaption.setBounds(36, 616, 452, 36); stage.addActor(codeCaption);
        code = new Label("", new Label.LabelStyle(codeFont, Color.valueOf("F6E2B8")));
        code.setAlignment(Align.center); code.setFontScale(1.25f); code.setBounds(36, 522, 452, 100); stage.addActor(code);
        playerCount=new Label("",new Label.LabelStyle(font,Color.valueOf("E9D8BE")));
        playerCount.setFontScale(.82f);playerCount.setAlignment(Align.center);playerCount.setBounds(52,474,210,40);stage.addActor(playerCount);
        connectedCount=new Label("",new Label.LabelStyle(font,Color.valueOf("9FD39A")));
        connectedCount.setFontScale(.7f);connectedCount.setAlignment(Align.center);connectedCount.setBounds(262,474,210,40);stage.addActor(connectedCount);
        Image qrPlaque = new Image(com.erni.finalanswer.ui.lobby.LobbyPlaque.drawable()); qrPlaque.setBounds(36, 24, 452, 404); stage.addActor(qrPlaque);
        Pixmap p = new Pixmap(1, 1, Pixmap.Format.RGBA8888); p.setColor(Color.WHITE); p.fill();
        pixel = new Texture(p); p.dispose();
        var solid = new TextureRegionDrawable(pixel);
        var style = lobbyStyle.normal; // forged-iron buttons (LobbyStyle)
        phone = new ConnectionPanel(game.getHosting(), font, style); phone.setBounds(58, 40, 408, 372); phone.caption(game.getTexts().get("lobby.scan_qr")); stage.addActor(phone);
        status = new Label("", new Label.LabelStyle(font, Color.valueOf("CFB998")));
        status.setFontScale(.75f); status.setWrap(true); status.setBounds(650, 140, 1100, 32); stage.addActor(status);
        play = button("PLAY", 650, style, game::showPlayScreen);
        play.setText(game.getTexts().get("lobby.start_game"));
        impostor = button("THE IMPOSTOR", 930, style, game::showImpostorLobby);
        cursed=button("CURSED BOXES",60,style,game::startCursedBoxesMultiplayer);cursed.setWidth(390);
        lastCommand=button("THE LAST COMMAND (3D PREVIEW)",60,style,game::startLastCommand);
        lastCommand.setBounds(60,145,520,54);lastCommand.getLabel().setFontScale(.68f);
        cards=button("THE CURSED CARDS",60,style,game::startCursedCards);cards.setBounds(60,210,520,54);cards.getLabel().setFontScale(.68f);
        // Individual mode buttons stay as the enable/disable source of truth; the selector drives them.
        for(var b:new TextButton[]{play,impostor,cursed,lastCommand,cards})b.setVisible(false);
        modes.add(new Mode("ВОПРОСЫ (ОСНОВНАЯ ИГРА)","от 1 игрока",play,game::showPlayScreen));
        modes.add(new Mode("THE IMPOSTOR","от 3 игроков",impostor,game::showImpostorLobby));
        modes.add(new Mode("CURSED BOXES","от 2 игроков",cursed,game::startCursedBoxesMultiplayer));
        // THE LAST COMMAND is parked (2026-11-08): it will come back with a new interpretation; its code stays.
        if(LAST_COMMAND_ENABLED)modes.add(new Mode("THE LAST COMMAND","от 1 игрока",lastCommand,game::startLastCommand));
        modes.add(new Mode("THE CURSED CARDS","4–6 игроков",cards,game::startCursedCards));
        modes.add(new Mode("SYSTEM BREACH","2–8 игроков · Phase 1 · только очки",null,game::startSystemBreach));
        modes.add(new Mode("THE FINAL SECOND","2–8 игроков · останови таймер на 7,00 с вслепую",null,game::startFinalSecond));
        if(FORGOTTEN_ROOM_ENABLED)for(String[] d:new String[][]{{"EASY","ЛЁГКИЙ","8–10 предметов · 2 изменения"},{"MEDIUM","СРЕДНИЙ","12–15 предметов · 3 изменения"},{"HARD","СЛОЖНЫЙ","16–18 предметов · 4–5 изменений"}})
            modes.add(new Mode("THE FORGOTTEN ROOM · "+d[1],"2–8 игроков · "+d[2]+" · только очки",null,()->game.startForgottenRoom(d[0])));
        for(String[] d:new String[][]{{"EASY","ЛЁГКИЙ","90 / 60 / 60 с · одна поломка · без помех"},{"NORMAL","СРЕДНИЙ","60 / 45 / 45 с · стандартные правила"},{"HARD","СЛОЖНЫЙ","45 / 35 / 35 с · двойные поломки · всегда скачок"}})
            modes.add(new Mode("АДСКАЯ КЛЕТКА · "+d[1],d[2]+" · телефоны переключатся в клетку",null,()->{var rt=game.getRealtime();if(rt!=null&&rt.connected())rt.send("OPEN_WEB_GAME",java.util.Map.of("game","broken-elevator","difficulty",d[0]));var room=game.getActiveRoom();String base=game.getHosting().apiUrl().replaceAll("/+$","");Gdx.net.openURI(room!=null?base+"/hell-cage-host/?room="+room.code()+"#token="+room.token():base+"/broken-elevator-manual/?diff="+d[0].toLowerCase());}));
        Image modePlaque = new Image(com.erni.finalanswer.ui.lobby.LobbyPlaque.drawable()); modePlaque.setBounds(630, 166, 1140, 104); stage.addActor(modePlaque);
        modeName=new Label("",new Label.LabelStyle(modeFont,Color.valueOf("F2E2C4")));modeName.setAlignment(Align.center);modeName.setBounds(650,210,1100,46);stage.addActor(modeName);
        modeHint=new Label("",new Label.LabelStyle(font,Color.valueOf("B79E7C")));modeHint.setFontScale(.62f);modeHint.setAlignment(Align.center);modeHint.setBounds(650,180,1100,28);stage.addActor(modeHint);
        modePrev=button("<",650,style,()->cycleMode(-1));modePrev.setBounds(650,205,90,56);
        modeNext=button(">",1660,style,()->cycleMode(1));modeNext.setBounds(1660,205,90,56);
        modeStart=button("START MODE",650,style,()->{var m=modes.get(modeIndex);Gdx.app.log("Lobby","start mode="+m.title()+" sourceDisabled="+(m.source()!=null&&m.source().isDisabled()));if(m.source()==null||!m.source().isDisabled())m.action().run();});
        modeStart.setText(game.getTexts().get("lobby.start_mode"));modeStart.setWidth(530);modeStart.setStyle(lobbyStyle.primary);
        button(game.getTexts().get("lobby.menu"), 1210, style, game::showMainMenu).setName("cageLobbyMENU");
        button(game.getTexts().get("lobby.leave"), 1490, style, () -> { game.leaveRoom(); game.showMainMenu(); }).setName("cageLobbyLEAVEROOM");
        blackout=new Image(solid);blackout.setBounds(0,0,1920,1080);blackout.setColor(0,0,0,0);blackout.setTouchable(com.badlogic.gdx.scenes.scene2d.Touchable.disabled);stage.addActor(blackout);
        roundTitle=new Label("",new Label.LabelStyle(titleFont,Color.valueOf("DCC9AE")));
        roundTitle.setFontScale(1);roundTitle.setAlignment(Align.center);roundTitle.setBounds(220,440,1480,160);roundTitle.setVisible(false);stage.addActor(roundTitle);
        // Hide the poster baked into the background with a restrained side shadow; artwork is untouched.
        Image shade=new Image(pixel);shade.setBounds(0,0,470,1080);shade.setColor(0,0,0,1);posterShade.addActor(shade);
        posterShade.addActor(new com.badlogic.gdx.scenes.scene2d.Actor(){
            private final float[] vertices=new float[20];
            @Override public void draw(com.badlogic.gdx.graphics.g2d.Batch batch,float alpha){
                float opaque=Color.toFloatBits(0,0,0,alpha),clear=Color.toFloatBits(0,0,0,0);
                float[] v=vertices;v[0]=470;v[1]=0;v[2]=opaque;v[3]=v[4]=0;v[5]=470;v[6]=1080;v[7]=opaque;v[8]=v[9]=0;v[10]=580;v[11]=1080;v[12]=clear;v[13]=v[14]=0;v[15]=580;v[16]=0;v[17]=clear;v[18]=v[19]=0;batch.draw(pixel,v,0,20);
            }
        });posterShade.setTouchable(com.badlogic.gdx.scenes.scene2d.Touchable.disabled);stage.addActor(posterShade);posterShade.setZIndex(1);posterShade.setVisible(false);
        for(var actor:stage.getActors())if(actor!=cages&&actor!=posterShade&&actor!=scene)cinematicHidden.add(actor);
        intro=new com.erni.finalanswer.intro.BasementIntro(game,pixel,font,style);stage.addActor(intro);
    }
    private void cycleMode(int step){modeIndex=Math.floorMod(modeIndex+step,modes.size());refreshMode();}
    private void refreshMode(){var m=modes.get(modeIndex);modeName.setText((modeIndex+1)+" / "+modes.size()+"   "+m.title());modeHint.setText(m.hint());
        modeStart.setDisabled(starting||pendingStart||m.source()!=null&&m.source().isDisabled());}
    private void cinematicUi(){if(!introActive())return;for(var actor:cinematicHidden)actor.setVisible(false);posterShade.setVisible(true);intro.toFront();}
    /** Explicit development preview; production always enters through an authorized server snapshot. */
    public void previewIntro(RoomSession room,Runnable complete){synchronize(room,"");starting=true;intro.begin("preview-"+java.util.UUID.randomUUID(),0,true,event->{if(event.equals("INTRO_READY")||event.equals("SKIP_INTRO"))Gdx.app.postRunnable(complete);});cinematicUi();}
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
        if(room!=null && displayed!=null && !room.code().equals(displayed.code())){resetTransition();introAborted=false;}
        if(room==null){resetTransition();introAborted=false;for(int i=0;i<8;i++)cages.cage(i).departure(0);}
        if (displayed != room) {
            displayed = room;
            code.setText(room == null ? "" : room.code());
            roomName.setText(room == null ? "" : room.name());
            int online=room==null?0:(int)room.players().stream().filter(p->"ONLINE".equals(p.connectionStatus())).count();
            playerCount.setText(room==null?"":game.getTexts().format("lobby.player_count",room.players().size(),room.maxPlayers()));
            connectedCount.setText(room==null?"":game.getTexts().format("lobby.connected_count",online,room.players().size()));
            if (room != null) phone.room(room.code());
        }
        phone.setVisible(room != null && room.host()&&!introActive());
        boolean host = room != null && room.host();
        boolean ready=host && room.players().size()>=1 && room.players().stream().allMatch(p->"ONLINE".equals(p.connectionStatus()));
        lockButtons(starting||pendingStart);
        cursed.setDisabled(starting||pendingStart||!ready||room.players().size()<2);
        lastCommand.setDisabled(starting||pendingStart||!host);
        // THE CURSED CARDS needs 4–6 players; with more it is not offered (nobody is dropped to fit).
        cards.setDisabled(starting||pendingStart||!host||!com.erni.finalanswer.gameplay.cursedcards.CursedDeck.eligible(room.players().size()));
        play.setDisabled(starting||pendingStart||!ready||introAborted); impostor.setDisabled(starting||pendingStart||!host || room.players().size() < 3);
        String notice=connectionStatus;
        if(host&&!starting&&!pendingStart&&!ready){
            notice+=" · "+game.getTexts().error(room.players().isEmpty()?"NOT_ENOUGH_PLAYERS":"PLAYER_OFFLINE");
        }
        if(host&&ready&&!starting&&!pendingStart)notice+=" · "+game.getTexts().get("lobby.ready_to_start");
        refreshMode();
        status.setText(introAborted?"INTRO INTERRUPTED — RETURN TO MENU":notice);
        cages.reducedMotion(game.getSettings().reducedMotion()); atmosphere.reducedMotion(game.getSettings().reducedMotion());
    }
    @Override public void show() { Gdx.input.setInputProcessor(stage); }
    @Override public void hide() { if(introActive())resetTransition();cages.stopAudio(); if (Gdx.input.getInputProcessor() == stage) Gdx.input.setInputProcessor(null); }
    @Override public void render(float delta) {
        if (!starting && !pendingStart && Gdx.input.isKeyJustPressed(Input.Keys.ESCAPE)) { game.showMainMenu(); return; }
        synchronize(game.getActiveRoom(), game.getLobbyStatus());
        draw(delta);
    }
    /** Also used by the isolated developer preview (which owns its synthetic roster). */
    public void draw(float delta) {
        if(introActive()){
            for(int i=0;i<8;i++){cages.cage(i).departure(0);cages.cage(i).cinematic(true);}
            intro.frame(delta);ScreenUtils.clear(0,0,0,1);viewport.apply();stage.act(intro.stepDelta());stage.draw();
            if(!preloadQueued&&game.getActiveRoom()!=null){preloadQueued=true;Gdx.app.postRunnable(()->{if(!disposed&&introActive()&&game.getScreen()==this)game.prepareNetworkPlay();});}
            return;
        }
        for(int i=0;i<8;i++)cages.cage(i).cinematic(false);
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
    @Override public void pause(){if(introActive()){intro.pause(true);introSignal("INTRO_PAUSE");}}
    @Override public void resume(){if(introActive()){introSignal("INTRO_RESUME");intro.pause(false);}}
    private void introSignal(String event){var client=game.getRealtime();if(client==null||!client.connected())return;var state=client.snapshot();if(state!=null&&state.has("intro"))client.send(event,java.util.Map.of("gameId",state.get("gameId").getAsString(),"introId",state.getAsJsonObject("intro").get("introId").getAsString()));}
    @Override public void dispose() {
        if (disposed) return; disposed = true; hide();
        stage.dispose(); cages.dispose(); atmosphere.dispose(); phone.dispose(); font.dispose(); codeFont.dispose(); titleFont.dispose(); modeFont.dispose(); titleBig.dispose(); lobbyStyle.dispose(); buttonFont.dispose(); pixel.dispose(); background.dispose();
    }
}
