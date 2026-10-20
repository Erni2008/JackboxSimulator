package com.erni.finalanswer.lwjgl3;

import com.badlogic.gdx.*;
import com.badlogic.gdx.backends.lwjgl3.*;
import com.badlogic.gdx.graphics.PixmapIO;
import com.badlogic.gdx.utils.*;
import com.erni.finalanswer.FinalAnswerGame;
import com.erni.finalanswer.network.*;
import com.erni.finalanswer.screens.*;
import com.erni.finalanswer.ui.play.QuestionPlayers;
import com.erni.finalanswer.ui.lobby.cages.LobbyStartAnimation;
import com.finalanswer.server.*;
import com.finalanswer.server.rooms.RoomService;
import com.google.gson.*;
import java.util.*;

/** Development-only production server, native screen and eight authenticated phone clients. */
public final class LobbyStartCheck {
    static void check(boolean okay,String why){if(!okay)throw new AssertionError(why);}
    public static void main(String[] args){
        if(StartupHelper.startNewJvmIfRequired())return;
        var rooms=new RoomService();
        var server=new RoomServer(new ServerConfig("127.0.0.1",0,"",Set.of(),"",10),rooms).start();
        String base="http://127.0.0.1:"+server.port();
        JsonObject host=JsonParser.parseString(rooms.create(Map.of("name","THE WAITING ROOM","maxPlayers","8"))).getAsJsonObject();
        String code=host.get("code").getAsString();
        var guests=new ArrayList<JsonObject>();String[] characters={"ghost","dracula","plague_doctor","puppeteer","skeleton","zombie","pumpkin","voodoo"};
        for(String character:characters)guests.add(JsonParser.parseString(rooms.join(code,Map.of("name",character.replace('_',' '),"characterId",character))).getAsJsonObject());
        var window=new Lwjgl3ApplicationConfiguration();window.setWindowedMode(1600,900);window.setTitle("Final Answer / sequential answers — A: auto, 1–8: answer");window.disableAudio(true);window.setForegroundFPS(60);
        try{new Lwjgl3Application(new FinalAnswerGame(HostingAccess.external(base)){
            final boolean interactive=Boolean.getBoolean("lobbyStart.interactive");
            final boolean performanceCheck=Boolean.getBoolean("lobbyStart.performanceCheck");
            final long[] answerFrameIntervals=new long[4096];
            long previousFrame;int measuredFrames,captures;
            final com.erni.finalanswer.gameplay.questions.DemoQuestionSource questions=new com.erni.finalanswer.gameplay.questions.DemoQuestionSource();
            final ArrayList<RealtimeClient> phones=new ArrayList<>();
            final Set<Integer> phoneStarts=new HashSet<>(),phoneQuestions=new HashSet<>(),phoneAnswers=new HashSet<>();
            final float[] previousRotation=new float[8],heldRotation=new float[8],clockAtAcceptance=new float[8],endedTimes=new float[8];
            final Object[] rigs=new Object[8];
            double elapsed;boolean requested,transitionShot,titleShot,questionShot,sawSwing,blackHeld,timeoutVerified,resultsShot,autoAnswers=true;
            long startAt,endAt,nextSendAt,acceptedAt;int stableSlot=-1,scheduledQuestion=-1,nextAnswer,pending=-1,verifiedAnswers;Object stableCharacter;CageLobbyScreen lobby;
            String playerId(int i){return guests.get(i).get("selfId").getAsString();}
            @Override public void create(){super.create();activateRoom(RoomApiClient.parse(new JsonReader().parse(host.toString()),host.get("token").getAsString()));
                lobby=(CageLobbyScreen)getScreen();
                for(int i=0;i<8;i++){final int player=i;var guest=guests.get(i);
                    phones.add(new RealtimeClient(base,code,guest.get("token").getAsString(),event->{
                        var payload=event.getAsJsonObject("payload");if(!payload.has("phase"))return;
                        String phase=payload.get("phase").getAsString();
                        if(phase.equals("STARTING")){phoneStarts.add(player);check(payload.get("transitionEndsAt").getAsLong()-payload.get("transitionStartedAt").getAsLong()==4000,"Phone start duration");}
                        if(payload.has("question")){phoneQuestions.add(player);if(payload.get("questionNumber").getAsInt()==1)check(payload.getAsJsonObject("question").get("id").getAsString().equals("solar-largest"),"Same first question");}
                        if(phase.equals("ANSWERING"))phoneAnswers.add(player);
                    },ignored->{}));
                }
            }
            void shot(String name){
                // Readback + PNG encoding stalls the render thread. Interactive previews never capture.
                if(interactive)return;
                long captureStart=System.nanoTime();captures++;
                var pixels=ScreenUtils.getFrameBufferPixmap(0,0,Gdx.graphics.getBackBufferWidth(),Gdx.graphics.getBackBufferHeight());try{PixmapIO.writePNG(Gdx.files.absolute(System.getProperty("lobbyStart.output")+"/"+name+".png"),pixels,-1,true);}finally{pixels.dispose();}System.out.println("CAPTURE "+name+" ms="+(System.nanoTime()-captureStart)/1e6);}
            void submit(int player,JsonObject state){
                phones.get(player).send("SUBMIT_ANSWER",Map.of("gameId",state.get("gameId").getAsString(),"questionId",state.getAsJsonObject("question").get("id").getAsString(),"answerIndex",questions.get(state.get("questionNumber").getAsInt()-1).correctAnswerIndex()));
            }
            void sequence(JsonObject state,QuestionPlayers strip,long now){
                int number=state.get("questionNumber").getAsInt();
                if(number!=scheduledQuestion){scheduledQuestion=number;timeoutVerified=resultsShot=false;nextAnswer=verifiedAnswers=0;pending=-1;acceptedAt=0;nextSendAt=state.get("answeringStartedAt").getAsLong()+1000;for(int i=0;i<8;i++)rigs[i]=strip.character(playerId(i));shot("4-answering-q"+number);}
                if(pending>=0){
                    boolean accepted=strip.states().players().get(pending).submitted;
                    if(accepted&&acceptedAt==0){acceptedAt=now;for(int i=0;i<8;i++)clockAtAcceptance[i]=strip.animationTime(playerId(i));}
                    if(acceptedAt>0&&now-acceptedAt>=450){
                        check(strip.presentationScale(playerId(pending))==1,"Answered player grew to full size");
                        check(strip.animationTime(playerId(pending))>clockAtAcceptance[pending],"Answered player's own animation started");
                        check(!strip.shaking(playerId(pending)),"Answered player stopped shivering");
                        for(int i=pending+1;i<8;i++)if(!strip.states().players().get(i).submitted){
                            check(strip.animationTime(playerId(i))==clockAtAcceptance[i],"Unanswered rigs remain held");
                            check(strip.presentationScale(playerId(i))==QuestionPlayers.THINKING_SCALE&&strip.shaking(playerId(i)),"Other players stay small and nervous");
                        }
                        check(strip.character(playerId(pending))==rigs[pending],"No rig replacement after submission");
                        System.out.println("SEQUENTIAL ANSWER "+(pending+1)+"/8: accepted, +35% size, own animation playing");
                        shot("q"+number+"-answer-"+(pending+1));verifiedAnswers++;pending=-1;acceptedAt=0;nextSendAt=now+950;
                    }
                }
                if(autoAnswers&&pending<0&&now>=nextSendAt){
                    while(nextAnswer<8&&strip.states().players().get(nextAnswer).submitted)nextAnswer++;
                    if(nextAnswer<8){pending=nextAnswer++;submit(pending,state);}
                }
            }
            @Override public void render(){long frameTime=System.nanoTime(),interval=previousFrame==0?0:frameTime-previousFrame;previousFrame=frameTime;
                super.render();elapsed+=Gdx.graphics.getDeltaTime();
                if(!interactive&&elapsed>80)throw new AssertionError("Lobby flow timed out");
                var connection=getRealtime();var state=connection.snapshot();if(state==null)return;long now=connection.serverNow();String phase=state.get("phase").getAsString();
                if(!requested&&elapsed>8&&phones.stream().allMatch(RealtimeClient::connected)&&state.get("canStart").getAsBoolean()){
                    for(int slot=0;slot<8;slot++)if(lobby.cages().cage(slot).playerId()!=null){stableSlot=slot;stableCharacter=lobby.cages().cage(slot).character();break;}
                    shot("0-waiting");requested=true;
                    int x=Math.round(775*Gdx.graphics.getWidth()/1920f),y=Gdx.graphics.getHeight()-Math.round(103*Gdx.graphics.getHeight()/1080f);
                    Gdx.input.getInputProcessor().touchDown(x,y,0,Input.Buttons.LEFT);Gdx.input.getInputProcessor().touchUp(x,y,0,Input.Buttons.LEFT);
                }
                if(phase.equals("STARTING")){
                    startAt=state.get("transitionStartedAt").getAsLong();endAt=state.get("transitionEndsAt").getAsLong();
                    float age=(now-startAt)/1000f;check(getScreen()==lobby,"Host stays in lobby throughout STARTING");check(lobby.cages().cage(stableSlot).character()==stableCharacter,"Start preserves rigs");
                    if(age>.1f&&age<LobbyStartAnimation.FADE_END)for(int i=0;i<8;i++){float angle=lobby.cages().cage(i).getRotation();if(Math.abs(angle-previousRotation[i])>.001f)sawSwing=true;previousRotation[i]=angle;}
                    if(age>=LobbyStartAnimation.FADE_END+.03f){
                        check(lobby.blackoutOpacity()==1,"Stop only after screen is fully black");
                        if(!blackHeld){check(sawSwing,"Visible cage swing during launch");for(int i=0;i<8;i++)heldRotation[i]=lobby.cages().cage(i).getRotation();blackHeld=true;}
                        else for(int i=0;i<8;i++){check(Float.isFinite(lobby.cages().cage(i).getRotation()),"Continuous swing remains valid during blackout/title");heldRotation[i]=lobby.cages().cage(i).getRotation();}
                    }
                    if(age>.9&&!transitionShot){shot("1-darkening");transitionShot=true;}
                    if(age>3&&!titleShot){shot("2-round-title");titleShot=true;}
                }
                if(!(getScreen() instanceof PlayScreen play)||!state.has("question"))return;
                var strip=play.playerCharacters();check(strip!=null&&strip.states().players().size()==8,"Eight question rigs");
                if(!questionShot){check(startAt>0&&endAt==state.get("questionStartTime").getAsLong(),"Shared transition deadline");shot("3-first-question");questionShot=true;}
                if(phase.equals("QUESTION_PRESENTATION")){boolean choices=play.presentation().answerProgress(0)>0;for(var p:strip.states().players())check(strip.shaking(p.id)==choices,"Shiver follows actual choices reveal");}
                if(interactive&&Gdx.input.isKeyJustPressed(Input.Keys.A)){autoAnswers=!autoAnswers;System.out.println("AUTO ANSWERS="+autoAnswers);}
                if(phase.equals("ANSWERING")){
                    if(performanceCheck&&interval>0&&now-state.get("answeringStartedAt").getAsLong()>500&&measuredFrames<answerFrameIntervals.length)answerFrameIntervals[measuredFrames++]=interval;
                    if(interactive)for(int i=0;i<8;i++)if(Gdx.input.isKeyJustPressed(Input.Keys.NUM_1+i)&&!strip.states().players().get(i).submitted)submit(i,state);
                    sequence(state,strip,now);
                    if(performanceCheck&&verifiedAnswers==8){
                        check(interactive&&captures==0,"Interactive answer preview must never capture or encode images");
                        Arrays.sort(answerFrameIntervals,0,measuredFrames);
                        check(measuredFrames>0,"Measured actual answering frames");
                        System.out.println("PREVIEW_FRAME_MS frames="+measuredFrames+" median="+answerFrameIntervals[measuredFrames/2]/1e6+" p95="+answerFrameIntervals[Math.min(measuredFrames-1,(int)(measuredFrames*.95))]/1e6+" max="+answerFrameIntervals[measuredFrames-1]/1e6+" captures="+captures);
                        System.out.println("PASS: eight sequential live answers, no screenshot readback/PNG encoding in interactive rendering");Gdx.app.exit();
                    }
                }
                if(phase.equals("REVEALING")&&!timeoutVerified){
                    if(!interactive)check(verifiedAnswers==8,"All eight players answered and animated one by one");
                    for(int i=0;i<8;i++){check(!strip.states().players().get(i).playing,"Deadline stops every rig");endedTimes[i]=strip.animationTime(playerId(i));}timeoutVerified=true;shot("6-timeout-frozen");
                }
                if(phase.equals("RESULTS")&&timeoutVerified){
                    for(int i=0;i<8;i++)check(strip.animationTime(playerId(i))==endedTimes[i],"Results hold rig clocks");
                    if(!interactive)check(strip.states().players().stream().filter(p->p.correct).count()==8,"Eight correct markers");
                    if(!resultsShot&&now-state.get("phaseStartedAt").getAsLong()>650){shot("8-correct-checkmarks");resultsShot=true;}
                }
                if(state.get("questionNumber").getAsInt()==2&&!interactive){
                    check(timeoutVerified&&blackHeld&&sawSwing,"Full launch and deadline verified");
                    check(phoneStarts.size()==8&&phoneQuestions.size()==8&&phoneAnswers.size()==8,"All phones synchronized");
                    for(int i=0;i<8;i++){check(strip.character(playerId(i))==rigs[i],"Next question reuses rigs");check(!strip.states().players().get(i).playing&&!strip.states().players().get(i).submitted,"Next question waits for choices and answers");}
                    check(Gdx.gl.glGetError()==0,"No GL errors");shot("7-next-question");
                    System.out.println("PASS: continuous cage swing through blackout/title, eight sequential real server answers, individual 35% growth and idle playback, result markers, deadline hold and next-question reuse");Gdx.app.exit();
                }
            }
            @Override public void dispose(){for(var phone:phones)phone.close();super.dispose();}
        },window);}finally{server.close();}
    }
}
