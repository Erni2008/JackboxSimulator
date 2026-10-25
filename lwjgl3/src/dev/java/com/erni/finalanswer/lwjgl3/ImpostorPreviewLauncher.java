package com.erni.finalanswer.lwjgl3;

import com.badlogic.gdx.backends.lwjgl3.Lwjgl3Application;
import com.badlogic.gdx.backends.lwjgl3.Lwjgl3ApplicationConfiguration;
import com.erni.finalanswer.FinalAnswerGame;
import com.erni.finalanswer.impostor.ImpostorScreen;

/** Development source set only: excluded from production jars and distributions. */
public final class ImpostorPreviewLauncher {
    public static void main(String[] args) {
        if (StartupHelper.startNewJvmIfRequired()) return;
        System.setProperty("impostor.opening.skip",System.getProperty("impostor.opening.skip","true"));
        var config = new Lwjgl3ApplicationConfiguration();
        config.setTitle("Final Answer — The Impostor");
        config.setWindowedMode(1280, 720);
        config.disableAudio(false);config.useVsync(true);config.setForegroundFPS(60);config.setIdleFPS(15);
        config.setPreferencesConfig(System.getProperty("impostor.preview.preferences",System.getProperty("java.io.tmpdir")+"/finalanswer-impostor-preview"),com.badlogic.gdx.Files.FileType.Absolute);
        new Lwjgl3Application(new FinalAnswerGame() {
            private ImpostorScreen preview;
            private com.erni.finalanswer.ui.lobby.cages.CageLobby characters;
            @Override public com.erni.finalanswer.ui.lobby.cages.CageLobby getRoomCharacters(){return characters;}
            private ImpostorSuspicionPreview suspicion;
            private ImpostorCluePreview clues;
            private ImpostorFinalPreview finalAct;
            private com.erni.finalanswer.network.RealtimeClient live;
            private PreviewLoading loading;
            private int startupStep=-2,samples;
            private long startupAt,readyAt,previousFrameAt,phaseObservedAt;
            private boolean hostReadyWritten,completeReportWritten;
            private String capturedPhase="";
            private final java.util.Set<String> captured=new java.util.HashSet<>();
            private final java.util.concurrent.ExecutorService captureWriter=java.util.concurrent.Executors.newSingleThreadExecutor(task->{var thread=new Thread(task,"impostor-capture-writer");thread.setDaemon(true);return thread;});
            private final double[] frameTimes=new double[180];
            @Override protected boolean preloadMenuScreens(){return false;}
            @Override public void create() {
                String marker=System.getProperty("impostor.preview.readyFile","");
                if(!marker.isBlank())com.badlogic.gdx.Gdx.files.absolute(marker).delete();
                startupAt=System.nanoTime();super.create();previewLanguage("ru");
                loading=new PreviewLoading();setScreen(loading);
            }
            private void prepareStep(){
                if(startupStep++<0)return; // Present the lightweight loading screen before any heavy resource.
                long before=System.nanoTime();int step=startupStep-1;
                if(step==0)characters=new com.erni.finalanswer.ui.lobby.cages.CageLobby();
                else if(step<=4)characters.createCharacter(ImpostorPreviewData.participants(4).get(step-1).player().characterId());
                else if(step==5){preview=new ImpostorScreen(this);preview.setParticipants(ImpostorPreviewData.participants(4));}
                else{
                    setScreen(preview);installPreview();preview.render(0);readyAt=System.nanoTime();
                    com.badlogic.gdx.Gdx.app.log("Impostor startup","Ready in "+(readyAt-startupAt)/1_000_000+" ms, with visible staged loading; unused menus deferred");
                    loading.dispose();loading=null;return;
                }
                loading.progress((step+1)/7f);
                com.badlogic.gdx.Gdx.app.log("Impostor startup","Preparation stage "+(step+1)+": "+(System.nanoTime()-before)/1_000_000+" ms");
            }
            private void installPreview(){
                String configFile=System.getProperty("impostor.connection","");
                if(configFile.isBlank()){preview.presentPhase(com.erni.finalanswer.gameplay.impostor.ImpostorPhase.INTRO,0,0);suspicion=ImpostorPreviewData.installControls(preview);clues=new ImpostorCluePreview(preview);finalAct=new ImpostorFinalPreview(preview);String verdict=System.getProperty("impostor.preview.verdict","");if(!verdict.isBlank())finalAct.previewOutcome(verdict);}
                else {
                    try {
                        var config=com.google.gson.JsonParser.parseString(java.nio.file.Files.readString(java.nio.file.Path.of(configFile))).getAsJsonObject();
                        live=new com.erni.finalanswer.network.RealtimeClient(config.get("url").getAsString(),config.get("code").getAsString(),
                            config.get("token").getAsString(),event->{},status->com.badlogic.gdx.Gdx.app.log("Impostor",status));
                        preview.connectSuspicion(live);
                    }catch(java.io.IOException error){throw new IllegalStateException("Cannot read local Impostor host credentials",error);}
                }
            }
            @Override public void render() {
                if(loading!=null){super.render();prepareStep();return;}
                float previewDelta=samples==0?0:Math.min(.05f,com.badlogic.gdx.Gdx.graphics.getDeltaTime());
                if(getScreen()==preview && suspicion!=null)suspicion.update(previewDelta);
                if(getScreen()==preview && clues!=null)clues.update(previewDelta);
                if(getScreen()==preview && finalAct!=null)finalAct.update(previewDelta);
                super.render();
                observeLiveDemo();
                long frameAt=System.nanoTime();
                if(previousFrameAt==0){previousFrameAt=frameAt;return;}
                if(readyAt>0&&samples<frameTimes.length){
                    frameTimes[samples++]=(frameAt-previousFrameAt)/1_000_000.0;
                    previousFrameAt=frameAt;
                    if(samples==frameTimes.length){
                        double[] sorted=frameTimes.clone();java.util.Arrays.sort(sorted);
                        double mean=java.util.Arrays.stream(frameTimes).average().orElse(0);
                        var report=new java.util.LinkedHashMap<String,Object>();
                        report.put("readyMillis",(readyAt-startupAt)/1_000_000);report.put("samples",samples);report.put("frameP95Millis",sorted[171]);report.put("meanFrameMillis",mean);
                        report.put("framesOver50Millis",java.util.Arrays.stream(frameTimes).filter(t->t>50).count());
                        com.badlogic.gdx.Gdx.files.local("../generated/impostor-preview-startup.json").writeString(new com.google.gson.GsonBuilder().setPrettyPrinting().create().toJson(report),false,"UTF-8");
                        com.badlogic.gdx.Gdx.app.log("Impostor startup",report.toString());
                        if(Boolean.getBoolean("impostor.preview.startupCheck"))com.badlogic.gdx.Gdx.app.exit();
                    }
                }
            }
            private void observeLiveDemo(){
                if(preview==null||live==null)return;
                String marker=System.getProperty("impostor.preview.readyFile","");
                if(!hostReadyWritten&&!marker.isBlank()&&live.connected()&&!preview.openingActive()){
                    com.badlogic.gdx.Gdx.files.absolute(marker).writeString("{\"ready\":true}",false);hostReadyWritten=true;
                }
                String directory=System.getProperty("impostor.preview.captureDir","");if(directory.isBlank())return;
                String phase=preview.state().phase().name()+"-"+preview.revealedRoundCount();
                long now=System.nanoTime();if(!phase.equals(capturedPhase)){capturedPhase=phase;phaseObservedAt=now;}
                float age=(now-phaseObservedAt)/1_000_000_000f;
                String label=phase;
                if(preview.state().phase()==com.erni.finalanswer.gameplay.impostor.ImpostorPhase.IMPOSTOR_REVEAL){if(age<4.7f)return;label+=age<7?"-name":"-ghost";}
                else if(age<.9f)return;
                if(captured.add(label)){
                    var pixels=com.badlogic.gdx.utils.ScreenUtils.getFrameBufferPixmap(0,0,com.badlogic.gdx.Gdx.graphics.getBackBufferWidth(),com.badlogic.gdx.Gdx.graphics.getBackBufferHeight());
                    var output=com.badlogic.gdx.Gdx.files.absolute(directory+"/host-"+label+".png");
                    captureWriter.submit(()->{try{com.badlogic.gdx.graphics.PixmapIO.writePNG(output,pixels,-1,true);}finally{pixels.dispose();}});
                }
                var state=live.snapshot();
                if(!completeReportWritten&&age>14&&state!=null&&state.has("impostor")&&state.getAsJsonObject("impostor").get("phase").getAsString().equals("RESULT")){
                    var report=java.util.Map.of("completed",true,"voicePlayCounts",getAudio().hostVoice().playCounts(),"phase","RESULT","realTime",true);
                    com.badlogic.gdx.Gdx.files.absolute(directory+"/host-report.json").writeString(new com.google.gson.GsonBuilder().setPrettyPrinting().create().toJson(report),false,"UTF-8");completeReportWritten=true;
                }
            }
            @Override public void dispose() {
                captureWriter.shutdown();
                // Hide the active screen before releasing any owned resources.
                if(getScreen()!=null)getScreen().hide();setScreen(null);
                if(loading!=null)loading.dispose();
                if(live!=null)live.close();
                if (preview != null) preview.dispose();
                super.dispose();
                if(characters!=null)characters.dispose();
            }
        }, config);
    }
    private static final class PreviewLoading extends com.badlogic.gdx.ScreenAdapter {
        private final com.badlogic.gdx.scenes.scene2d.Stage stage=new com.badlogic.gdx.scenes.scene2d.Stage(new com.badlogic.gdx.utils.viewport.FitViewport(1280,720));
        private final com.badlogic.gdx.graphics.g2d.BitmapFont font=com.erni.finalanswer.ui.UiFonts.body(24);
        private final com.badlogic.gdx.scenes.scene2d.ui.Label status;
        PreviewLoading(){
            var title=new com.badlogic.gdx.scenes.scene2d.ui.Label("THE IMPOSTOR",new com.badlogic.gdx.scenes.scene2d.ui.Label.LabelStyle(font,com.badlogic.gdx.graphics.Color.valueOf("D5BD91")));
            title.setAlignment(com.badlogic.gdx.utils.Align.center);title.setBounds(240,360,800,50);stage.addActor(title);
            status=new com.badlogic.gdx.scenes.scene2d.ui.Label("Подготавливаем сцену…",new com.badlogic.gdx.scenes.scene2d.ui.Label.LabelStyle(font,com.badlogic.gdx.graphics.Color.valueOf("A99A88")));
            status.setFontScale(.7f);status.setAlignment(com.badlogic.gdx.utils.Align.center);status.setBounds(240,305,800,40);stage.addActor(status);
        }
        void progress(float value){status.setText("Подготавливаем сцену… "+Math.round(value*100)+"%");}
        @Override public void render(float delta){com.badlogic.gdx.utils.ScreenUtils.clear(.018f,.012f,.016f,1);stage.getViewport().apply();stage.draw();}
        @Override public void resize(int w,int h){stage.getViewport().update(w,h,true);}
        @Override public void dispose(){stage.dispose();font.dispose();}
    }

}
