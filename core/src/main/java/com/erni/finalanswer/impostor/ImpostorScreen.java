package com.erni.finalanswer.impostor;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.Input;
import com.badlogic.gdx.ScreenAdapter;
import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.g2d.BitmapFont;
import com.badlogic.gdx.scenes.scene2d.*;
import com.badlogic.gdx.scenes.scene2d.ui.Image;
import com.badlogic.gdx.scenes.scene2d.ui.Label;
import com.badlogic.gdx.utils.Align;
import com.badlogic.gdx.utils.ScreenUtils;
import com.badlogic.gdx.utils.viewport.FitViewport;
import com.erni.finalanswer.FinalAnswerGame;
import com.erni.finalanswer.gameplay.impostor.ImpostorState;
import com.erni.finalanswer.ui.UiFonts;
import java.util.Objects;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.function.Function;
import com.erni.finalanswer.rooms.RoomSession;

/** Impostor presentation with independent participants and ambient room illumination. Caller owns the screen; actors borrow its textures/fonts. */
public final class ImpostorScreen extends ScreenAdapter {
    /** Existing local sound controls also govern shared UI feedback on this screen. */
    public float uiAudioGain(){return audio.muted()?0:audio.volume();}

    private static final String[] TIMER_ACTORS={"impostorTimerPanel","impostorTimerLabel","impostorTimerValue"};
    private final com.erni.finalanswer.presentation.PhaseTransition transition=new com.erni.finalanswer.presentation.PhaseTransition();
    private final com.erni.finalanswer.audio.PresentationAudio audio=new com.erni.finalanswer.audio.PresentationAudio(com.erni.finalanswer.audio.PresentationAudio.GDX);
    private ImpostorAtmosphere dust,veil;
    private ImpostorSettingsPanel roomSettings;
    private com.erni.finalanswer.gameplay.impostor.ImpostorSettings authoritativeSettings=com.erni.finalanswer.gameplay.impostor.ImpostorSettings.defaults();
    private boolean settingsSoundMuted,previousLocalMute;
    private Label introduction;
    private ImpostorOpening opening;
    private boolean openingAmbienceMuted;
    private RoleSubtitles roleInstruction;
    private float roleInstructionAge=-1;
    private boolean roleNarrationRequested,roleNarrationFinished;
    private String pendingRoleNarration;
    private final com.badlogic.gdx.Preferences localPreferences=Gdx.app.getPreferences("impostor-presentation");
    private boolean subtitlesEnabled=true,largeSubtitles,joiningActiveGame;
    private final Map<Label,java.util.function.Supplier<String>> audioControlLabels=new java.util.LinkedHashMap<>();
    private String presentationKey="";
    private final String narrationSession=java.util.UUID.randomUUID().toString();
    private boolean restorePresentation=true,introductionPlayed,voteOpen;
    private float heldEliminationAge=-1;
    private long writingUntil;
    public void networkWriting(long until){writingUntil=until;}
    private Image clockHand;
    private String tickKey="";
    private com.erni.finalanswer.gameplay.impostor.ImpostorPhase tickPhase;
    private long tickDeadline;
    private long warnedDeadline;
    private boolean phaseRestored;
    private String resultCue="",waitingPresentation="";
    private final FinalAnswerGame game;
    private ImpostorState state = ImpostorState.initial();
    private final ImpostorAssets assets = new ImpostorAssets();
    private final Stage stage = new Stage(new FitViewport(ImpostorLayout.WIDTH, ImpostorLayout.HEIGHT));
    private final BitmapFont labelFont = UiFonts.body(16);
    private final BitmapFont revealNameFont = UiFonts.handwriting(52);
    private final BitmapFont timerFont = UiFonts.horror(52);
    private final BitmapFont participantFont = UiFonts.body(24);
    private final BitmapFont nicknameFont = UiFonts.nameplate(28);
    private final Function<RoomSession.Player, Actor> avatarFactory;
    private List<ImpostorParticipant> participants = List.of();
    private Group playerLayer;
    private FinalVotePresentation finalPresentation;
    private ImpostorDeathWindow deathWindow;
    private ImpostorLifecyclePanel lifecycle;
    private com.erni.finalanswer.ui.lobby.LobbyPanel roomLobby;
    private com.erni.finalanswer.network.RealtimeClient liveConnection;
    private final java.util.function.Consumer<com.google.gson.JsonObject> liveListener=this::onLiveEvent;
    private com.google.gson.JsonObject liveState;
    private String pendingAction="",lifecycleError="";
    private long actionStarted;
    private boolean roomClosed;
    private long resultEntered;
    private FinalActSnapshot finalSnapshot;
    private long finalServerTime,finalReceivedNano;
    private SuspicionEnvelope suspicionEnvelope;
    private SuspicionSnapshot suspicion;
    private long suspicionServerTime, suspicionReceivedNano;
    private long displayedSuspicionSeconds = -1;
    private long roundDeadline, roundServerTime, roundReceivedNano;
    private boolean liveRound;
    private com.erni.finalanswer.network.ImpostorSuspicionAdapter suspicionAdapter;
    private final PaperRevealController paperReveal = new PaperRevealController();
    private final List<ImpostorParticipantView> participantViews = new ArrayList<>();
    private ImpostorRoomBackground background;
    private boolean paused;
    private boolean built, disposed;

    public ImpostorScreen(FinalAnswerGame game) {
        this(game, player -> {
            var characters = game.getRoomCharacters();
            return characters == null ? null : new ImpostorCharacterActor(characters, player);
        });
    }

    /** Avatar actors borrow resources owned by the caller and must have positive natural dimensions. */
    public ImpostorScreen(FinalAnswerGame game, Function<RoomSession.Player, Actor> avatarFactory) {
        this.game = Objects.requireNonNull(game);
        audio.volume(localPreferences.getFloat("volume",.65f));audio.mute(localPreferences.getBoolean("muted",false));
        audio.muteAmbience(localPreferences.getBoolean("ambienceMuted",false));
        subtitlesEnabled=localPreferences.getBoolean("subtitles",true);largeSubtitles=localPreferences.getBoolean("largeSubtitles",false);
        this.avatarFactory = Objects.requireNonNull(avatarFactory);
        stage.addCaptureListener(new InputListener() {
            @Override public boolean keyDown(InputEvent event, int key) {
                if(stage.getKeyboardFocus() instanceof com.badlogic.gdx.scenes.scene2d.ui.TextField&&key!=Input.Keys.ESCAPE)return false;
                if(key==Input.Keys.M){toggleLocalSound();return true;}
                if(key==Input.Keys.MINUS){audio.volume(audio.volume()-.1f);saveLocalPresentation();return true;}
                if(key==Input.Keys.EQUALS||key==Input.Keys.PLUS){audio.volume(audio.volume()+.1f);saveLocalPresentation();return true;}
                if(key==Input.Keys.F8){subtitlesEnabled=!subtitlesEnabled;saveLocalPresentation();return true;}
                if(key==Input.Keys.F9){largeSubtitles=!largeSubtitles;saveLocalPresentation();return true;}
                if (key != Input.Keys.ESCAPE) return false;
                if(roomSettings!=null&&roomSettings.closeIfOpen())return true;
                Gdx.app.postRunnable(() -> {
                    if (!disposed && game.getScreen() == ImpostorScreen.this) game.showMainMenu();
                });
                return true;
            }
        });
    }

    /** Optional live snapshots on an explicitly opened screen; no room selection/navigation is invented. */
    public void connectSuspicion(com.erni.finalanswer.network.RealtimeClient connection) {
        if(liveConnection!=null)liveConnection.removeEventListener(liveListener);
        liveConnection=connection;joiningActiveGame=connection.snapshot()!=null&&connection.snapshot().has("impostor");connection.addEventListener(liveListener);
        if(roomLobby==null){roomLobby=new com.erni.finalanswer.ui.lobby.LobbyPanel(game,()->sendLifecycle("LEAVE_ROOM"));roomLobby.setBounds(120,220,780,730);stage.addActor(roomLobby);}
        if(roomSettings==null){roomSettings=new ImpostorSettingsPanel(labelFont,this::sendSettings);stage.addActor(roomSettings);}
        suspicionAdapter=new com.erni.finalanswer.network.ImpostorSuspicionAdapter(connection,this);
    }
    private void onLiveEvent(com.google.gson.JsonObject event){
        String type=event.get("type").getAsString();
        if(type.equals("IMPOSTOR_STARTED")||type.equals("IMPOSTOR_REPLAY_READY"))joiningActiveGame=false;
        if(type.equals("AUTHENTICATED")){joiningActiveGame=liveConnection!=null&&liveConnection.snapshot()!=null&&liveConnection.snapshot().has("impostor");restorePresentation=true;presentationKey="";transition.cancel();}
        if(type.equals("PLAYER_JOINED"))audio.play(com.erni.finalanswer.audio.PresentationAudio.Cue.PLAYER_JOINED);
        if(type.equals("IMPOSTOR_LOBBY_RETURNED"))audio.play(com.erni.finalanswer.audio.PresentationAudio.Cue.LOBBY);
        if(type.equals("ROOM_CLOSED")){roomClosed=true;if(roomSettings!=null)roomSettings.update(authoritativeSettings,false);clearSuspicion();clearFinal();lifecycle.hidePanel();roomLobby.update(null,"");
            lifecycle.setVisible(true);lifecycle.status("Комната недоступна: "+event.getAsJsonObject("payload").get("reason").getAsString(),true);return;}
        if(!pendingAction.isEmpty() && event.get("requestId").getAsString().equals(pendingAction)){
            pendingAction="";lifecycleError=type.equals("IMPOSTOR_ACTION_REJECTED")||type.equals("ERROR")?event.getAsJsonObject("payload").get("code").getAsString():"";
            if(roomSettings!=null)roomSettings.status(lifecycleError.isEmpty()?"Настройки синхронизированы.":lifecycleError);
        }
        if(roomSettings!=null&&!lifecycleError.isEmpty())roomSettings.status(lifecycleError);
    }
    private void sendSettings(com.erni.finalanswer.gameplay.impostor.ImpostorSettings settings){
        if(liveConnection==null||!liveConnection.connected()||liveState==null||!liveState.get("host").getAsBoolean()||!pendingAction.isEmpty())return;
        pendingAction=liveConnection.send("UPDATE_IMPOSTOR_SETTINGS",Map.of("roomCode",liveState.get("code").getAsString(),"sessionId",liveState.get("lobbyId").getAsString(),"settings",settings));actionStarted=System.nanoTime();lifecycleError="";roomSettings.status("Отправляем…");
    }
    private boolean reducedMotion(){return game.getSettings().reducedMotion()||authoritativeSettings.reducedMotion()||!authoritativeSettings.visualEffectsEnabled();}
    private void sendLifecycle(String type){
        if(liveConnection==null || !liveConnection.connected() || liveState==null || !liveState.get("host").getAsBoolean() || !pendingAction.isEmpty())return;
        var payload=new java.util.LinkedHashMap<String,Object>();payload.put("roomCode",liveState.get("code").getAsString());
        var mini=liveState.has("impostor")?liveState.getAsJsonObject("impostor"):null;
        payload.put("sessionId",mini==null?liveState.get("lobbyId").getAsString():mini.get("sessionId").getAsString());
        if(type.equals("START_IMPOSTOR") && mini==null)payload.put("participantIds",lifecycle.selected());
        pendingAction=liveConnection.send(type,payload);actionStarted=System.nanoTime();lifecycleError="";lifecycle.status("Отправляем…",true);
    }
    private void updateLifecycle(float delta){
        if(liveConnection==null || roomClosed)return;
        var snapshot=liveConnection.snapshot();
        if(snapshot!=null && snapshot!=liveState){
            liveState=snapshot;
            if(snapshot.has("impostorSettings"))authoritativeSettings=com.finalanswer.protocol.Protocol.JSON.fromJson(snapshot.get("impostorSettings"),com.erni.finalanswer.gameplay.impostor.ImpostorSettings.class);
            if(!authoritativeSettings.soundEnabled()){if(!settingsSoundMuted){settingsSoundMuted=true;previousLocalMute=audio.muted();audio.mute(true);}}else if(settingsSoundMuted){settingsSoundMuted=false;audio.mute(previousLocalMute);}
            var mini=snapshot.has("impostor")?snapshot.getAsJsonObject("impostor"):null;
            roomSettings.update(authoritativeSettings,snapshot.get("host").getAsBoolean()&&mini==null);
            boolean ready=mini!=null && mini.get("phase").getAsString().equals("REPLAY_PREPARATION");
            if(mini==null || ready){
                String waitingId=ready?mini.get("sessionId").getAsString():snapshot.get("lobbyId").getAsString();
                if(!waitingPresentation.equals(waitingId)){
                    transition.enter("waiting:"+waitingId,new com.erni.finalanswer.presentation.PhaseTransition.Config(com.erni.finalanswer.presentation.PhaseTransition.Style.DARKNESS,.4f,.12f),restorePresentation||presentationKey.isEmpty());waitingPresentation=waitingId;
                }
                presentationKey="";audio.ambience("room");clearFinal();clearSuspicion();resetPapers();playerLayer.setVisible(false);finalPresentation.setVisible(false);
                var room=com.erni.finalanswer.network.RoomApiClient.parse(new com.badlogic.gdx.utils.JsonReader().parse(snapshot.toString()),"");
                roomLobby.update(room,snapshot.get("hostConnected").getAsBoolean()?"WAITING FOR HOST...":"HOST DISCONNECTED — waiting for reconnect");
                var ids=new ArrayList<String>();
                if(ready)for(var p:mini.getAsJsonArray("participants"))ids.add(p.getAsJsonObject().get("id").getAsString());
                else if(snapshot.has("impostorLobby"))for(var id:snapshot.getAsJsonObject("impostorLobby").getAsJsonArray("participantIds"))ids.add(id.getAsString());
                lifecycle.waiting(ready?mini.get("sessionId").getAsString():snapshot.get("lobbyId").getAsString(),room.players(),ids,room.host(),ready);
            }else{
                waitingPresentation="";roomLobby.update(null,"");playerLayer.setVisible(true);
                // The match result remains on the server; completion has no intermediate UI.
                lifecycle.hidePanel();
            }
        }
        if(!pendingAction.isEmpty() && System.nanoTime()-actionStarted>3_000_000_000L){pendingAction="";lifecycleError="Проверяем состояние комнаты…";liveConnection.send("SYNC",Map.of());}
        if(lifecycle.isVisible()){
            if(!lifecycleError.isEmpty())lifecycle.status(lifecycleError,false);
            else if(!pendingAction.isEmpty())lifecycle.status("Отправляем…",true);
            else lifecycle.status(liveConnection.connected()?"":"Связь потеряна. Переподключаемся…",!liveConnection.connected());
            lifecycle.update(delta,reducedMotion());
        }
    }
    public void presentSuspicion(SuspicionSnapshot snapshot,long serverNow) {
        if(disposed || !built)return;
        suspicion=snapshot;suspicionServerTime=serverNow;suspicionReceivedNano=System.nanoTime();
        suspicionEnvelope.accept(snapshot);displayedSuspicionSeconds=-1;
    }
    public void clearSuspicion() {
        suspicion=null;if(suspicionEnvelope!=null)suspicionEnvelope.clear();displayedSuspicionSeconds=-1;
    }
    private void updateSuspicion(float delta) {
        if(suspicionAdapter!=null)suspicionAdapter.update();
        if(suspicionEnvelope==null)return;
        suspicionEnvelope.update(delta);
        Label label=stage.getRoot().findActor("impostorTimerLabel");
        Label value=stage.getRoot().findActor("impostorTimerValue");
        if(suspicion!=null && suspicionEnvelope.active()) {
            long now=suspicionServerTime+(System.nanoTime()-suspicionReceivedNano)/1_000_000;
            long seconds=suspicion.finalized()?0:Math.max(0,(suspicion.deadline()-now+999)/1000);
            if(seconds!=displayedSuspicionSeconds) {
                displayedSuspicionSeconds=seconds;
                label.setText("ДО КОНЦА ПОДОЗРЕНИЙ");
                value.setText(seconds<10?"00:0"+seconds:"00:"+seconds);
            }
        } else if(finalSnapshot!=null) {
            long now=finalServerTime+(System.nanoTime()-finalReceivedNano)/1_000_000;
            finalPresentation.update(now);
            boolean timed=finalSnapshot.phase()==com.erni.finalanswer.gameplay.impostor.ImpostorPhase.EVIDENCE_REVIEW || finalSnapshot.phase()==com.erni.finalanswer.gameplay.impostor.ImpostorPhase.FINAL_VOTING;
            long seconds=timed?Math.max(0,(finalSnapshot.deadline()-now+999)/1000):0;
            if(seconds!=displayedSuspicionSeconds){displayedSuspicionSeconds=seconds;
                label.setText(finalSnapshot.phase()==com.erni.finalanswer.gameplay.impostor.ImpostorPhase.EVIDENCE_REVIEW?"ДО КОНЦА ОБСУЖДЕНИЯ":"ДО КОНЦА ГОЛОСОВАНИЯ");
                value.setText(timed?String.format(java.util.Locale.ROOT,"%02d:%02d",seconds/60,seconds%60):"00:00");}
        } else if(liveRound) {
            long now=roundServerTime+(System.nanoTime()-roundReceivedNano)/1_000_000;
            long seconds=Math.max(0,(roundDeadline-now+999)/1000);
            if(seconds!=displayedSuspicionSeconds){displayedSuspicionSeconds=seconds;label.setText("ДО КОНЦА РАУНДА");
                value.setText(seconds<10?"00:0"+seconds:"00:"+seconds);}
        } else if(state.phase()==com.erni.finalanswer.gameplay.impostor.ImpostorPhase.ROLE_REVEAL&&roundDeadline>0){
            long now=roundServerTime+(System.nanoTime()-roundReceivedNano)/1_000_000;
            long seconds=Math.max(0,(roundDeadline-now+999)/1000);
            label.setText("ПРОЧИТАЙТЕ СВОЮ РОЛЬ");value.setText(String.format(java.util.Locale.ROOT,"%02d:%02d",seconds/60,seconds%60));
        } else if(displayedSuspicionSeconds!=-2) {
            displayedSuspicionSeconds=-2;label.setText("ОЖИДАЕМ НАЧАЛА");value.setText("—");
        }
    }

    /** Applies a trusted phase/deadline; display extrapolation never drives gameplay. */
    public void presentPhase(com.erni.finalanswer.gameplay.impostor.ImpostorPhase phase,long deadline,long serverNow) {
        String key=phase.name()+":"+paperReveal.round()+":"+deadline;
        if(!presentationKey.equals(key)){
            boolean restore=restorePresentation || presentationKey.isEmpty();phaseRestored=restore;
            if(joiningActiveGame&&opening!=null&&opening.active()){
                opening.cancel();audio.stop(com.erni.finalanswer.audio.PresentationAudio.Cue.INTRODUCTION);
                audio.muteAmbience(openingAmbienceMuted);Gdx.input.setInputProcessor(stage);
            }restorePresentation=false;presentationKey=key;
            var style=phase==com.erni.finalanswer.gameplay.impostor.ImpostorPhase.RESULT?com.erni.finalanswer.presentation.PhaseTransition.Style.ZOOM:com.erni.finalanswer.presentation.PhaseTransition.Style.DARKNESS;
            transition.enter(key,new com.erni.finalanswer.presentation.PhaseTransition.Config(style,.65f,.16f),restore);
            if(introduction!=null)introduction.setText(phase==com.erni.finalanswer.gameplay.impostor.ImpostorPhase.ROUND_CLUE_INPUT?"РАУНД "+(paperReveal.round()+1):"");
            if(!introductionPlayed&&!joiningActiveGame&&(phase==com.erni.finalanswer.gameplay.impostor.ImpostorPhase.INTRO||phase==com.erni.finalanswer.gameplay.impostor.ImpostorPhase.ROLE_REVEAL)){
                introductionPlayed=true;
                game.getAudio().hostVoice().scopeGain(uiAudioGain());
                String narrationId=liveState!=null&&liveState.has("impostor")?liveState.getAsJsonObject("impostor").get("sessionId").getAsString():narrationSession+":"+key;
                pendingRoleNarration="impostor-intro:"+narrationId;roleInstructionAge=-1;
            }
            if(voteOpen&&phase!=com.erni.finalanswer.gameplay.impostor.ImpostorPhase.FINAL_VOTING&&!restore)audio.play(com.erni.finalanswer.audio.PresentationAudio.Cue.VOTING_CLOSED);
            voteOpen=phase==com.erni.finalanswer.gameplay.impostor.ImpostorPhase.FINAL_VOTING;
            var cue=switch(phase){
                case ROUND_CLUE_INPUT -> com.erni.finalanswer.audio.PresentationAudio.Cue.ROUND_INTRO;
                case ROUND_CLUE_REVEAL -> com.erni.finalanswer.audio.PresentationAudio.Cue.CLUE_REVEAL;
                case FINAL_VOTING -> com.erni.finalanswer.audio.PresentationAudio.Cue.VOTING_START;
                case SUSPECT_ANNOUNCEMENT -> com.erni.finalanswer.audio.PresentationAudio.Cue.SUSPECT;
                case IMPOSTOR_REVEAL -> com.erni.finalanswer.audio.PresentationAudio.Cue.IMPOSTOR;
                default -> null;
            };
            if(!restore && cue!=null)audio.play(cue);
            audio.ambience(phase==com.erni.finalanswer.gameplay.impostor.ImpostorPhase.EVIDENCE_REVIEW || phase==com.erni.finalanswer.gameplay.impostor.ImpostorPhase.FINAL_VOTING?"suspense":"room");
        }
        state=new ImpostorState(phase);
        liveRound=phase==com.erni.finalanswer.gameplay.impostor.ImpostorPhase.ROUND_CLUE_INPUT;
        roundDeadline=deadline;roundServerTime=serverNow;roundReceivedNano=System.nanoTime();displayedSuspicionSeconds=-1;
    }
    public void restoreClues(List<Map<String,String>> history,boolean faceUp) {
        if(history.size()>3)throw new IllegalArgumentException("At most three rounds");
        for(var view:participantViews)view.setClues(List.of("","",""));
        for(int round=0;round<history.size();round++)for(int i=0;i<participantViews.size();i++)
            participantViews.get(i).setClue(round,history.get(round).get(participants.get(i).player().id()));
        paperReveal.restore(history.size(),faceUp);presentPapers();
    }

    public void presentFinal(FinalActSnapshot snapshot,long serverNow) {
        if(disposed || !built)return;
        finalSnapshot=snapshot;finalServerTime=serverNow;finalReceivedNano=System.nanoTime();
        finalPresentation.accept(snapshot);displayedSuspicionSeconds=-1;
    }
    public void clearFinal(){finalSnapshot=null;if(finalPresentation!=null)finalPresentation.hidePresentation();if(deathWindow!=null)deathWindow.reset();}

    public ImpostorState state() { return state; }
    public List<ImpostorParticipant> participants() { return participants; }

    /** Explicit active presentation only. Never selects participants from connected room members. */
    public void setParticipants(List<ImpostorParticipant> active) {
        if (disposed) throw new IllegalStateException("Impostor screen already disposed");
        List<ImpostorParticipant> copy = List.copyOf(active);
        if (copy.size() != 3 && copy.size() != 4)
            throw new IllegalArgumentException("THE IMPOSTOR requires exactly 3 or 4 active participants");
        var ids = new HashSet<String>();
        for (ImpostorParticipant participant : copy)
            if (!ids.add(participant.player().id())) throw new IllegalArgumentException("Duplicate active player ID");
        paperReveal.reset();transition.reset();presentationKey="";warnedDeadline=0;introductionPlayed=voteOpen=false;if(clockHand!=null)clockHand.setRotation(0);
        clearSuspicion();clearFinal();
        participants = copy;
        if (built){rebuildParticipants();finalPresentation.revealFont(revealNameFont);finalPresentation.setRoster(participants);}
    }

    private void rebuildParticipants() {
        playerLayer.clearChildren();
        participantViews.clear();
        if(deathWindow!=null)deathWindow.roster(participants,avatarFactory);
        if (participants.isEmpty()) return; // Unconfigured screen retains the Stage 2A scene.
        var region = ImpostorLayout.TOP_PLAYERS;
        int count = participants.size();
        float scale = Math.min(1, (region.width()-(count-1)*20) / (count*ImpostorParticipantView.WIDTH));
        float width = ImpostorParticipantView.WIDTH*scale;
        float height = ImpostorParticipantView.HEIGHT*scale;
        float gap = Math.min(64, (region.width()-count*width)/(count-1));
        float start = region.x()+(region.width()-count*width-(count-1)*gap)/2;
        for (int i=0; i<count; i++) {
            var participant = participants.get(i);
            Actor avatar = avatarFactory.apply(participant.player());
            if (avatar != null && (avatar.getWidth() <= 0 || avatar.getHeight() <= 0))
                throw new IllegalArgumentException("Avatar must have positive natural dimensions");

            var view = new ImpostorParticipantView(participant, avatar, assets, participantFont, nicknameFont);
            view.setPosition(start+i*(width+gap), region.y()+(region.height()-height)/2);
            view.setScale(scale);
            playerLayer.addActor(view);
            participantViews.add(view);
            view.presentPaper(paperReveal);
        }
    }

    public PaperFlipState paperState() { return paperReveal.state(); }
    public int revealedRoundCount() { return paperReveal.round(); }

    /** Render-thread event API for preview or a future server adapter. Keys are stable player IDs. */
    public boolean revealClues(Map<String, String> cluesByPlayerId) {
        if (disposed || !built || !paperReveal.canReveal() || participantViews.isEmpty()) return false;
        Objects.requireNonNull(cluesByPlayerId, "cluesByPlayerId");
        for (String id : cluesByPlayerId.keySet()) {
            boolean known = false;
            for (var participant : participants) if (participant.player().id().equals(id)) { known = true; break; }
            if (!known) throw new IllegalArgumentException("Clue supplied for non-participant ID: " + id);
        }
        int slot = paperReveal.round();
        for (int i=0; i<participantViews.size(); i++)
            participantViews.get(i).setClue(slot, cluesByPlayerId.get(participants.get(i).player().id()));
        paperReveal.reveal();
        audio.play(com.erni.finalanswer.audio.PresentationAudio.Cue.PAGE_TURN);
        presentPapers();
        return true;
    }

    public boolean flipPapersBack() {
        if (disposed || !built || !paperReveal.flipBack()) return false;
        audio.play(com.erni.finalanswer.audio.PresentationAudio.Cue.PAGE_TURN);
        presentPapers();
        return true;
    }

    /** Cancels any in-flight flip, clears all three slots and restores the first-round start. */
    public void resetPapers() {
        if (disposed) return;
        paperReveal.reset();transition.reset();presentationKey="";warnedDeadline=0;introductionPlayed=voteOpen=false;if(clockHand!=null)clockHand.setRotation(0);
        clearSuspicion();clearFinal();
        for (var view : participantViews) view.setClues(List.of("", "", ""));
        presentPapers();
    }

    private void presentPapers() {
        for (int i=0; i<participantViews.size(); i++) participantViews.get(i).presentPaper(paperReveal);
    }

    @Override public void show() {
        if (disposed) throw new IllegalStateException("Impostor screen already disposed");
        audio.pause(false);assets.load();
        if (!built) {
            buildScene();
            built = true;
        }
        if(opening==null){
            opening=new ImpostorOpening();opening.resize(Gdx.graphics.getWidth(),Gdx.graphics.getHeight());
            openingAmbienceMuted=audio.ambienceMuted();audio.muteAmbience(true);
            if(Boolean.getBoolean("impostor.opening.skip")){opening.cancel();audio.muteAmbience(openingAmbienceMuted);}
            opening.input().addListener(new InputListener(){
                @Override public boolean keyDown(InputEvent event,int key){
                    if((key==Input.Keys.ENTER||key==Input.Keys.SPACE)&&opening.canSkip()){
                        opening.cancel();audio.stop(com.erni.finalanswer.audio.PresentationAudio.Cue.INTRODUCTION);
                        audio.muteAmbience(openingAmbienceMuted);Gdx.input.setInputProcessor(stage);return true;
                    }
                    if(key!=Input.Keys.ESCAPE)return false;
                    Gdx.app.postRunnable(game::showMainMenu);return true;
                }
            });
        }
        Gdx.input.setInputProcessor(opening.active()?opening.input():stage);
    }

    private void buildScene() {
        // Background fills the composition uniformly. The source differs from 16:9 by <0.1%.
        assets.texture(ImpostorAsset.BACKGROUND_1).ifPresent(texture -> {
            background = new ImpostorRoomBackground(texture);
            stage.addActor(background);
        });
        // Reserved ordered insertion points; no placeholder gameplay elements are drawn.
        for (String layer : new String[]{"environment", "players", "gameplay"}) {
            Group group = new Group();
            group.setName(layer);
            group.setTransform(false);
            stage.addActor(group);
            if (layer.equals("players")) playerLayer = group;
        }
        dust=new ImpostorAtmosphere(transition,false);stage.addActor(dust);dust.setZIndex(1);
        rebuildParticipants();
        suspicionEnvelope=new SuspicionEnvelope(assets,labelFont);
        stage.addActor(suspicionEnvelope);
        finalPresentation=new FinalVotePresentation(assets,participantFont,avatarFactory);
        finalPresentation.revealFont(revealNameFont);finalPresentation.setRoster(participants);finalPresentation.onImpact(()->audio.play(com.erni.finalanswer.audio.PresentationAudio.Cue.STAMP_IMPACT));stage.addActor(finalPresentation);
        deathWindow=new ImpostorDeathWindow(nicknameFont);deathWindow.roster(participants,avatarFactory);stage.addActor(deathWindow);
        lifecycle=new ImpostorLifecyclePanel(assets,participantFont,avatarFactory,this::sendLifecycle);stage.addActor(lifecycle);
        addImage(ImpostorAsset.CLOCK, "impostorClock", ImpostorLayout.CLOCK);
        // The hand is only meaningful when the clock body exists.
        if (assets.isAvailable(ImpostorAsset.CLOCK)) {
            assets.texture(ImpostorAsset.CLOCK_ARROW).ifPresent(texture -> {
                float scale = ImpostorLayout.ARROW_SCALE;
                float originX = ImpostorLayout.ARROW_PIVOT_X * scale;
                float originY = (com.erni.finalanswer.ui.RuntimeTextures.originalHeight(texture) - ImpostorLayout.ARROW_PIVOT_Y) * scale;
                float clockScale = ImpostorLayout.CLOCK.width() / 1223;
                float pivotX = ImpostorLayout.CLOCK.x() + ImpostorLayout.CLOCK_PIVOT_X * clockScale;
                float pivotY = ImpostorLayout.CLOCK.y() + (1286 - ImpostorLayout.CLOCK_PIVOT_Y) * clockScale;
                Image arrow = new Image(texture);clockHand=arrow;
                arrow.setName("impostorClockArrow");
                arrow.setBounds(pivotX - originX, pivotY - originY,
                        com.erni.finalanswer.ui.RuntimeTextures.originalWidth(texture) * scale, com.erni.finalanswer.ui.RuntimeTextures.originalHeight(texture) * scale);
                arrow.setOrigin(originX, originY);
                // Rotation is updated from the authoritative countdown, around this measured hub.
                arrow.setRotation(0);
                stage.addActor(arrow);
            });
        }
        addImage(ImpostorAsset.TIMER_RECTANGLE, "impostorTimerPanel", ImpostorLayout.TIMER_PANEL);
        addText("impostorTimerLabel", "ОЖИДАЕМ НАЧАЛА", labelFont,
                Color.valueOf("D5CEC4"), ImpostorLayout.TIMER_LABEL);
        addText("impostorTimerValue", "—", timerFont,
                Color.valueOf("B43742"), ImpostorLayout.TIMER_VALUE);
        veil=new ImpostorAtmosphere(transition,true);stage.addActor(veil);
        introduction=new Label("",new Label.LabelStyle(participantFont,Color.valueOf("E7D5B5")));introduction.setName("impostorRoundIntro");introduction.setBounds(700,680,520,60);introduction.setFontScale(1.45f);introduction.setAlignment(Align.center);introduction.setTouchable(Touchable.disabled);stage.addActor(introduction);
        roleInstruction=new RoleSubtitles();stage.addActor(roleInstruction);
        addAudioControl("impostorSoundToggle",1510,85,()->audio.muted()?"ЗВУК: ВЫКЛ. · M":"ЗВУК: ВКЛ. · M",this::toggleLocalSound);
        addAudioControl("impostorAmbienceToggle",1510,48,()->audio.ambienceMuted()?"АТМОСФЕРА: ВЫКЛ.":"АТМОСФЕРА: ВКЛ.",()->{audio.muteAmbience(!audio.ambienceMuted());saveLocalPresentation();});
        addAudioControl("impostorVolumeDown",1510,12,()->"− ГРОМКОСТЬ "+Math.round(audio.volume()*100)+"%",()->{audio.volume(audio.volume()-.1f);saveLocalPresentation();});
        addAudioControl("impostorVolumeUp",1720,12,()->"ГРОМКОСТЬ +",()->{audio.volume(audio.volume()+.1f);saveLocalPresentation();});
        addAudioControl("impostorSubtitlesToggle",1510,320,()->subtitlesEnabled?"СУБТИТРЫ: ВКЛ. · F8":"СУБТИТРЫ: ВЫКЛ. · F8",()->{subtitlesEnabled=!subtitlesEnabled;saveLocalPresentation();});
        addAudioControl("impostorSubtitleSize",1510,280,()->largeSubtitles?"ТЕКСТ: КРУПНЫЙ · F9":"ТЕКСТ: ОБЫЧНЫЙ · F9",()->{largeSubtitles=!largeSubtitles;saveLocalPresentation();});
        stage.addListener(new com.badlogic.gdx.scenes.scene2d.utils.ClickListener(){
            @Override public void clicked(InputEvent e,float x,float y){audio.play(com.erni.finalanswer.audio.PresentationAudio.Cue.CLICK);}
            @Override public void enter(InputEvent e,float x,float y,int pointer,Actor from){if(pointer==-1&&e.getTarget() instanceof com.badlogic.gdx.scenes.scene2d.ui.Button)audio.play(com.erni.finalanswer.audio.PresentationAudio.Cue.HOVER);}
        });
    }

    private void toggleLocalSound(){if(!authoritativeSettings.soundEnabled())return;audio.mute(!audio.muted());saveLocalPresentation();}
    private void saveLocalPresentation(){
        localPreferences.putFloat("volume",audio.volume()).putBoolean("muted",settingsSoundMuted?previousLocalMute:audio.muted())
            .putBoolean("ambienceMuted",audio.ambienceMuted()).putBoolean("subtitles",subtitlesEnabled).putBoolean("largeSubtitles",largeSubtitles).flush();
        for(var entry:audioControlLabels.entrySet())entry.getKey().setText(entry.getValue().get());
    }
    private void addAudioControl(String name,float x,float y,java.util.function.Supplier<String> title,Runnable action){
        Label label=new Label(title.get(),new Label.LabelStyle(labelFont,Color.valueOf("D5CEC4")));label.setName(name);label.setBounds(x,y,x>1700?180:350,34);audioControlLabels.put(label,title);
        label.addListener(new com.badlogic.gdx.scenes.scene2d.utils.ClickListener(){@Override public void clicked(InputEvent event,float px,float py){action.run();label.setText(title.get());}
            @Override public void enter(InputEvent e,float x,float y,int pointer,Actor from){if(pointer==-1)label.setColor(Color.valueOf("F3D3AA"));}
            @Override public void exit(InputEvent e,float x,float y,int pointer,Actor to){if(pointer==-1)label.setColor(Color.WHITE);}
        });stage.addActor(label);
    }

    private void addImage(ImpostorAsset asset, String name, ImpostorLayout.Bounds bounds) {
        assets.texture(asset).ifPresent(texture -> {
            Image image = new Image(texture);
            image.setName(name);
            image.setBounds(bounds.x(), bounds.y(), bounds.width(), bounds.height());
            stage.addActor(image);
        });
    }

    private void addText(String name, String text, BitmapFont font, Color color, ImpostorLayout.Bounds bounds) {
        Label label = new Label(text, new Label.LabelStyle(font, color));
        label.setName(name);
        label.setAlignment(Align.center);
        label.setBounds(bounds.x(), bounds.y(), bounds.width(), bounds.height());
        stage.addActor(label);
    }

    @Override public void render(float delta) {
        if (disposed) return;
        // Clear the whole framebuffer so letterbox bars never retain pixels from other screens.
        ScreenUtils.clear(0, 0, 0, 1);
        if(opening!=null&&opening.active()){
            opening.render(delta,paused,reducedMotion(),()->audio.play(com.erni.finalanswer.audio.PresentationAudio.Cue.INTRODUCTION));
            audio.update(paused?0:delta);
            if(!opening.active()){audio.muteAmbience(openingAmbienceMuted);Gdx.input.setInputProcessor(stage);}
            return;
        }
        boolean rolePhase=state.phase()==com.erni.finalanswer.gameplay.impostor.ImpostorPhase.ROLE_REVEAL
            ||state.phase()==com.erni.finalanswer.gameplay.impostor.ImpostorPhase.INTRO;
        if(rolePhase&&pendingRoleNarration!=null&&roleInstructionAge<0){
            roleInstructionAge=0;roleNarrationRequested=false;roleNarrationFinished=false;
            audio.play(com.erni.finalanswer.audio.PresentationAudio.Cue.ROLE_CARDS);
        }
        if(rolePhase&&roleInstructionAge>=0&&!roleNarrationFinished){
            if(!paused)roleInstructionAge+=Math.max(0,Math.min(delta,.1f));
            if(roleInstructionAge>=.9f&&!roleNarrationRequested&&pendingRoleNarration!=null){
                roleNarrationRequested=true;
                game.getAudio().hostVoice().scopeGain(uiAudioGain());
                game.getAudio().hostVoice().playLine("impostor_intro",pendingRoleNarration,result->{
                    if(result==com.erni.finalanswer.audio.HostVoiceManager.Result.COMPLETED
                        ||result==com.erni.finalanswer.audio.HostVoiceManager.Result.CANCELLED)roleNarrationFinished=true;
                });pendingRoleNarration=null;
            }
            var voice=game.getAudio().hostVoice();
            float position=voice.playing()?voice.position():Math.max(0,roleInstructionAge-.9f);
            roleInstruction.present(position,roleInstructionAge<.9f,paused?0:delta,reducedMotion());
            if(roleInstructionAge>11.5f){roleNarrationFinished=true;roleInstruction.dismiss();}
        }else roleInstruction.dismiss();
        if(!subtitlesEnabled)roleInstruction.dismiss();
        roleInstruction.large(largeSubtitles);
        for(var entry:audioControlLabels.entrySet())entry.getKey().setText(entry.getValue().get());
        if (background != null) background.update(paused ? 0 : delta, reducedMotion());
        finalPresentation.paused(paused);
        paperReveal.update(paused ? 0 : delta);
        presentPapers();
        updateSuspicion(paused?0:delta);
        updateLifecycle(paused?0:delta);
        boolean reduced=reducedMotion();
        game.getAudio().hostVoice().scopeGain(uiAudioGain());
        transition.update(delta,paused,reduced);audio.writing(liveConnection!=null&&liveConnection.connected()&&liveConnection.serverNow()<writingUntil&&state.phase()==com.erni.finalanswer.gameplay.impostor.ImpostorPhase.ROUND_CLUE_INPUT);audio.update(paused?0:delta);finalPresentation.reducedMotion(reduced);
        dust.update(paused?0:delta,reduced);veil.update(paused?0:delta,reduced);
        long verdictNow=finalServerTime+(System.nanoTime()-finalReceivedNano)/1_000_000;
        if(!paused||finalSnapshot==null)heldEliminationAge=ImpostorElimination.age(finalSnapshot,verdictNow);
        float eliminatedAge=heldEliminationAge;
        deathWindow.present(finalSnapshot==null?"":finalSnapshot.impostorId(),eliminatedAge,reduced);
        for(var participant:participantViews)participant.updatePortrait(paused?0:delta,reduced,finalSnapshot!=null&&participant.playerId().equals(finalSnapshot.impostorId())?eliminatedAge:-1);
        if(reduced&&paperReveal.flipping()){paperReveal.update(Float.POSITIVE_INFINITY);presentPapers();}
        introduction.setVisible(transition.active()&&!introduction.getText().isEmpty());
        introduction.getColor().a=(float)Math.sin(Math.PI*transition.progress());
        introduction.setOrigin(260,27);introduction.setScale(1+.015f*(1-transition.progress()));
        float warning=1;
        long clockNow=roundServerTime+(System.nanoTime()-roundReceivedNano)/1_000_000;
        long clockDeadline=liveRound?roundDeadline:finalSnapshot==null?0:finalSnapshot.deadline();
        if(finalSnapshot!=null)clockNow=finalServerTime+(System.nanoTime()-finalReceivedNano)/1_000_000;
        long remaining=clockDeadline-clockNow;
        boolean timed=finalSnapshot!=null&&(finalSnapshot.phase()==com.erni.finalanswer.gameplay.impostor.ImpostorPhase.EVIDENCE_REVIEW||finalSnapshot.phase()==com.erni.finalanswer.gameplay.impostor.ImpostorPhase.FINAL_VOTING);
        if(timed&&(tickPhase!=finalSnapshot.phase()||tickDeadline!=clockDeadline)){tickPhase=finalSnapshot.phase();tickDeadline=clockDeadline;tickKey=tickPhase.name()+":"+tickDeadline;}
        audio.timer(timed?tickKey:"",timed&&!paused&&remaining>0&&!lifecycle.isVisible(),timed?Math.max(0,clockNow-finalSnapshot.phaseStartedAt())/1000f:0);
        if(remaining>0&&remaining<=5000){
            if(!reduced)warning=1+.035f*(float)Math.sin(remaining/1000.0*Math.PI*2);
            if(warnedDeadline!=clockDeadline){warnedDeadline=clockDeadline;if(!phaseRestored)audio.play(com.erni.finalanswer.audio.PresentationAudio.Cue.TIMER_WARNING);}
        }
        if(clockHand!=null&&!paused){
            long handNow=clockNow,handDeadline=clockDeadline,handStart=0;
            boolean running=false;
            if(timed){handStart=finalSnapshot.phaseStartedAt();running=true;}
            else if(liveRound){handStart=roundDeadline-authoritativeSettings.clueSeconds()*1000L;running=true;}
            else if(suspicion!=null&&suspicionEnvelope.active()&&!suspicion.finalized()){
                handNow=suspicionServerTime+(System.nanoTime()-suspicionReceivedNano)/1_000_000;handDeadline=suspicion.deadline();handStart=handDeadline-5000;running=true;
            }
            if(running){if(reduced)handNow=handStart+Math.max(0,(handNow-handStart)/1000)*1000;clockHand.setRotation(ImpostorLayout.clockRotation(handNow,handStart,handDeadline));}
        }
        Actor timerValue=stage.getRoot().findActor("impostorTimerValue");if(timerValue!=null){timerValue.setOrigin(timerValue.getWidth()/2,timerValue.getHeight()/2);timerValue.setScale(warning);}
        for(String name:TIMER_ACTORS){
            Actor actor=stage.getRoot().findActor(name);if(actor!=null)actor.setVisible(!lifecycle.isVisible());
        }
        stage.getViewport().apply();
        var camera=stage.getCamera();
        boolean cinematic=lifecycle.isVisible() && finalSnapshot!=null && finalSnapshot.phase()==com.erni.finalanswer.gameplay.impostor.ImpostorPhase.RESULT && !reducedMotion();
        float drift=cinematic?(float)Math.sin((System.nanoTime()-resultEntered)/1_000_000_000.0*.22)*1.3f:0;
        float zoom=((com.badlogic.gdx.graphics.OrthographicCamera)camera).zoom;
        ((com.badlogic.gdx.graphics.OrthographicCamera)camera).zoom=zoom/transition.scale();
        camera.position.x+=drift+transition.offset();camera.update();stage.act(paused?0:Math.min(delta,.1f));stage.draw();camera.position.x-=drift+transition.offset();((com.badlogic.gdx.graphics.OrthographicCamera)camera).zoom=zoom;camera.update();
    }

    @Override public void resize(int width, int height) { stage.getViewport().update(width, height, true);if(opening!=null)opening.resize(width,height); }
    @Override public void pause() { paused = true;audio.pause(true);game.getAudio().hostVoice().pause(); }
    @Override public void resume() {
        paused=false;transition.cancel();restorePresentation=true;presentationKey="";audio.timer("",false);audio.pause(false);game.getAudio().hostVoice().resume();
        if(built&&!disposed){
            long base=finalSnapshot!=null?finalServerTime:roundServerTime;
            long received=finalSnapshot!=null?finalReceivedNano:roundReceivedNano;
            presentPhase(state.phase(),finalSnapshot!=null?finalSnapshot.deadline():roundDeadline,base+(System.nanoTime()-received)/1_000_000);
        }
    }
    @Override public void hide() {
        if(opening!=null&&opening.active()){opening.cancel();audio.muteAmbience(openingAmbienceMuted);}
        if(deathWindow!=null)deathWindow.reset();
        pendingRoleNarration=null;roleInstructionAge=-1;roleNarrationFinished=true;
        if(roleInstruction!=null)roleInstruction.dismiss();
        game.getAudio().hostVoice().stop();
        game.getAudio().hostVoice().scopeGain(1);
        transition.cancel();restorePresentation=true;audio.timer("",false);audio.pause(true);
        if (Gdx.input.getInputProcessor() == stage || opening!=null&&Gdx.input.getInputProcessor()==opening.input()) Gdx.input.setInputProcessor(null);
    }
    @Override public void dispose() {
        if (disposed) return;
        disposed = true;
        hide();
        if(liveConnection!=null)liveConnection.removeEventListener(liveListener);
        if(roomLobby!=null)roomLobby.dispose();lifecycle.dispose();
        if(deathWindow!=null)deathWindow.dispose();stage.dispose();
        if(opening!=null)opening.close();
        if(roleInstruction!=null)roleInstruction.close();
        labelFont.dispose();
        timerFont.dispose();audio.close();if(roomSettings!=null)roomSettings.dispose();if(dust!=null)dust.dispose();if(veil!=null)veil.dispose();
        participantFont.dispose();nicknameFont.dispose();revealNameFont.dispose();
        assets.dispose();
    }
}
