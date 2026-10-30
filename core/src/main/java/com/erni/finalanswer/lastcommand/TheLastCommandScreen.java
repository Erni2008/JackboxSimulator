package com.erni.finalanswer.lastcommand;

import com.badlogic.gdx.*;
import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.g2d.BitmapFont;
import com.badlogic.gdx.scenes.scene2d.*;
import com.badlogic.gdx.scenes.scene2d.ui.*;
import com.badlogic.gdx.scenes.scene2d.utils.*;
import com.badlogic.gdx.utils.viewport.ScreenViewport;
import com.erni.finalanswer.FinalAnswerGame;
import com.erni.finalanswer.ui.UiFonts;

/** Local, self-contained preview. No gameplay tasks or server protocol changes. */
public final class TheLastCommandScreen extends ScreenAdapter {
    private final FinalAnswerGame game;
    private final TheLastCommandMachine machine;
    private final PerspectiveCamera camera = new PerspectiveCamera(45,Gdx.graphics.getWidth(),Gdx.graphics.getHeight());
    private final OrbitCameraController orbit;
    private final TheLastCommandRenderer renderer;
    private final Stage ui = new Stage(new ScreenViewport());
    private final BitmapFont font = UiFonts.body(18);
    private final Texture pixel;
    private final InputMultiplexer input;
    private boolean disposed,previousContinuous,diagnostics;
    private int commandStage,signalCount;private long signalLoop=-1,radioLoop=-1;private Table previewTools;private CommandMachineEffects effects;private boolean shutdownPlayed;private String commandFeedback="";private String focusedTask="";private CommandTouchDisplay commandDisplay;private LastCommandProfiler profiler;private int measuredFrames;
    private Label diagnosticLabel;private LastCommandNetworkBridge network;private final long seed;
    public TheLastCommandScreen(FinalAnswerGame game){this(game,Long.getLong("lc.seed",20261025L));}
    public TheLastCommandScreen(FinalAnswerGame game,long seed) {
        this.game=game;this.seed=seed;machine=new TheLastCommandMachine(seed);orbit=new OrbitCameraController(camera,machine);renderer=new TheLastCommandRenderer(camera,machine);
        Pixmap p=new Pixmap(1,1,Pixmap.Format.RGBA8888);p.setColor(Color.WHITE);p.fill();pixel=new Texture(p);p.dispose();
        var style=new TextButton.TextButtonStyle();style.font=font;style.fontColor=Color.valueOf("C5BAAB");
        var solid=new TextureRegionDrawable(pixel);style.up=solid.tint(Color.valueOf("242628"));style.over=solid.tint(Color.valueOf("404345"));style.down=solid.tint(Color.valueOf("151719"));
        Table table=new Table();previewTools=table;table.setFillParent(true);table.top().left().pad(20);ui.addActor(table);
        table.add(new Label("THE LAST COMMAND (3D PREVIEW)",new Label.LabelStyle(font,Color.valueOf("C5BAAB")))).left().expandX();
        TextButton reset=new TextButton("RESET CAMERA",style);table.add(reset).padLeft(16);
        TextButton panelReset=new TextButton("RESET PANEL",style);table.add(panelReset).padLeft(16);
        TextButton quality=new TextButton(GraphicsProfile.current().name(),style);table.add(quality).padLeft(16);
        quality.addListener(new ChangeListener(){public void changed(ChangeEvent e,Actor actor){changeQuality(GraphicsProfile.values()[(GraphicsProfile.current().ordinal()+1)%3]);}});
        TextButton back=new TextButton("BACK",style);table.add(back).padLeft(16);table.row();
        String message=machine.complete()&&machine.panelReady()&&machine.mechanisms()!=null?"LMB: mechanisms / orbit | RMB: pan | wheel: zoom | Esc: back"
            :"Front panel assets/configuration: \n"+machine.status;
        Label info=new Label(message,new Label.LabelStyle(font,Color.valueOf("9D9690")));info.setWrap(true);
        table.add(info).colspan(5).fillX().left().padTop(15);table.row();
        diagnosticLabel=new Label("F8: diagnostics | FPS caps: LOW 30 / MEDIUM 60 / HIGH 60",new Label.LabelStyle(font,Color.valueOf("9D9690")));table.add(diagnosticLabel).colspan(5).left().padTop(8);
        panelReset.addListener(new ChangeListener(){public void changed(ChangeEvent e,Actor actor){orbit.cancel();if(network!=null)network.reset();else if(machine.panel()!=null)machine.panel().reset();}});
        if(machine.panel()!=null)machine.panel().addListener(event->{
            if(event.cause()==PanelAction.Cause.PLAYER&&game.getAudio()!=null
                &&(event.kind()==PanelAction.Kind.LIGHT_CHANGED||event.kind()==PanelAction.Kind.ADJUSTER_CHANGED||event.kind()==PanelAction.Kind.PRESSED||event.kind()==PanelAction.Kind.LEVER_CHANGED||event.kind()==PanelAction.Kind.HATCH_CHANGED||event.kind()==PanelAction.Kind.CODE_UPDATED))game.getAudio().command(switch(event.kind()){case LIGHT_CHANGED->com.erni.finalanswer.audio.GameAudio.CommandCue.ELECTRICAL;case LEVER_CHANGED->com.erni.finalanswer.audio.GameAudio.CommandCue.LEVER;case HATCH_CHANGED->com.erni.finalanswer.audio.GameAudio.CommandCue.METAL;case ADJUSTER_CHANGED->com.erni.finalanswer.audio.GameAudio.CommandCue.VALVE;default->com.erni.finalanswer.audio.GameAudio.CommandCue.BUTTON;});
        });
        reset.addListener(new ChangeListener(){public void changed(ChangeEvent e,Actor actor){orbit.reset();}});
        back.addListener(new ChangeListener(){public void changed(ChangeEvent e,Actor actor){exit();}});
        input=new InputMultiplexer(ui,new InputAdapter(){@Override public boolean keyDown(int key){if(key==Input.Keys.F8){toggleDiagnostics();return true;}if(key==Input.Keys.ESCAPE){exit();return true;}return false;}},orbit);
    }
    public void connectNetwork(com.erni.finalanswer.network.RealtimeClient client,com.google.gson.JsonObject state){network=new LastCommandNetworkBridge(client,machine,state);if(state.getAsJsonObject("lastCommand").has("testRound")&&state.getAsJsonObject("lastCommand").getAsJsonObject("testRound").has("expanded")){previewTools.setVisible(false);effects=new CommandMachineEffects(camera,()->network.commandRound()==null||network.commandRound().get("status").getAsString().equals("WON")?0:network.commandRound().get("step").getAsInt());ui.addActor(effects);}commandDisplay=new CommandTouchDisplay(camera,(action,value)->{if(game.getAudio()!=null)game.getAudio().command(action.equals("ROTATE")?com.erni.finalanswer.audio.GameAudio.CommandCue.ELECTRICAL:action.equals("ADJUST")?com.erni.finalanswer.audio.GameAudio.CommandCue.TUNING:com.erni.finalanswer.audio.GameAudio.CommandCue.BUTTON);network.touch(action,value);});renderer.addCommandDisplay(commandDisplay.scene);input.addProcessor(1,commandDisplay);}
    public void changeQuality(GraphicsProfile value){value.save();Gdx.app.postRunnable(()->{if(game.getScreen()!=this)return;if(network!=null)game.reloadLastCommand();else reloadLocalQuality();});}
    private void reloadLocalQuality(){
        orbit.cancel();var state=new PanelSnapshot(machine);var cameraState=orbit.snapshot();
        game.setScreen(null);var next=new TheLastCommandScreen(game,seed);state.restore(next.machine);next.orbit.restore(cameraState);game.setScreen(next);
    }
    public OrbitCameraController.State cameraState(){return orbit.snapshot();}
    public void restoreCamera(OrbitCameraController.State state){orbit.restore(state);}
    public boolean networked(){return network!=null;}
    public AdditionalMechanisms mechanisms(){return machine.mechanisms();}
    public FrontPanel panel(){return machine.panel();}
    private void exit(){Gdx.app.postRunnable(()->{if(game.getScreen()==this){if(network!=null)network.end();else game.showMainMenu();}});}
    private void toggleDiagnostics(){diagnostics=!diagnostics;if(commandDisplay!=null)previewTools.setVisible(diagnostics);if(diagnostics){profiler=new LastCommandProfiler();measuredFrames=0;profiler.reset();}else{profiler.dispose();profiler=null;diagnosticLabel.setText("F8: diagnostics");}Gdx.graphics.requestRendering();}
    @Override public void show(){previousContinuous=Gdx.graphics.isContinuousRendering();Gdx.graphics.setContinuousRendering(false);game.setSceneFps(GraphicsProfile.current().fps);Gdx.input.setInputProcessor(input);Gdx.graphics.requestRendering();}
    @Override public void render(float delta){
        delta=Math.min(.05f,delta);if(profiler!=null)profiler.begin();
        if(network!=null&&network.commandRound()!=null&&network.commandRound().has("taskId")){var round=network.commandRound();String task=round.get("taskId").getAsString();if(!task.equals(focusedTask)&&(!round.has("paused")||!round.get("paused").getAsBoolean())){focusedTask=task;signalCount=0;if(game.getAudio()!=null){game.getAudio().commandStopLoop(com.erni.finalanswer.audio.GameAudio.CommandCue.SIGNAL,signalLoop);game.getAudio().commandStopLoop(com.erni.finalanswer.audio.GameAudio.CommandCue.RADIO_STATIC,radioLoop);signalLoop=radioLoop=-1;if(round.has("taskType")&&round.get("taskType").getAsString().equals("RADIO"))radioLoop=game.getAudio().commandStartLoop(com.erni.finalanswer.audio.GameAudio.CommandCue.RADIO_STATIC);if(round.has("taskType")&&round.get("taskType").getAsString().equals("SILENCE"))signalLoop=game.getAudio().commandStartLoop(com.erni.finalanswer.audio.GameAudio.CommandCue.SIGNAL);if(round.has("category")&&round.get("category").getAsString().equals("MEMORY"))game.getAudio().command(com.erni.finalanswer.audio.GameAudio.CommandCue.MEMORY);game.getAudio().command(com.erni.finalanswer.audio.GameAudio.CommandCue.TRANSITION);if(round.has("taskType")&&round.get("taskType").getAsString().equals("FALSE_COMMAND")){String spoken=round.getAsJsonObject("touchscreen").get("spoken").getAsString().replace("PRESS ","");game.getAudio().command(com.erni.finalanswer.audio.GameAudio.CommandCue.valueOf("VOICE_"+spoken));}}orbit.focus(round.has("focusId")?round.get("focusId").getAsString():"SCREEN");}if(round.has("status")&&round.get("status").getAsString().equals("WON")){if(!shutdownPlayed&&game.getAudio()!=null){game.getAudio().commandStopLoop(com.erni.finalanswer.audio.GameAudio.CommandCue.SIGNAL,signalLoop);game.getAudio().commandStopLoop(com.erni.finalanswer.audio.GameAudio.CommandCue.RADIO_STATIC,radioLoop);game.getAudio().command(com.erni.finalanswer.audio.GameAudio.CommandCue.SHUTDOWN);}shutdownPlayed=true;}else shutdownPlayed=false;if(game.getAudio()!=null&&round.has("touchscreen")){var touch=round.getAsJsonObject("touchscreen");long now=network.estimatedServerTime();if(touch.has("signalEndsAt")&&now>=touch.get("signalEndsAt").getAsLong())game.getAudio().commandStopLoop(com.erni.finalanswer.audio.GameAudio.CommandCue.SIGNAL,signalLoop);if(touch.has("strength"))game.getAudio().commandLoopLevel(com.erni.finalanswer.audio.GameAudio.CommandCue.RADIO_STATIC,radioLoop,.03f+(1-touch.get("strength").getAsFloat())*.18f);if(round.get("taskType").getAsString().equals("DELAYED_EXECUTION")){int signal=(int)Math.max(0,(now-round.get("readyAt").getAsLong())/1000);if(signal>signalCount&&signal<=3)game.getAudio().command(com.erni.finalanswer.audio.GameAudio.CommandCue.SIGNAL);signalCount=signal;}int stage=round.get("step").getAsInt()/5;if(stage>commandStage){game.getAudio().command(com.erni.finalanswer.audio.GameAudio.CommandCue.STEAM);if(stage>=2)game.getAudio().command(com.erni.finalanswer.audio.GameAudio.CommandCue.WARNING);}commandStage=stage;}String feedback=round.has("feedback")?round.get("feedback").getAsString():"";if(!feedback.isEmpty()&&!feedback.equals(commandFeedback)&&game.getAudio()!=null)game.getAudio().command(feedback.equals("COMMAND ACCEPTED")?com.erni.finalanswer.audio.GameAudio.CommandCue.CORRECT:com.erni.finalanswer.audio.GameAudio.CommandCue.INCORRECT);commandFeedback=feedback;}orbit.updateFocus(delta);
        machine.update(delta);if(profiler!=null)profiler.updated();
        Gdx.gl.glViewport(0,0,Gdx.graphics.getBackBufferWidth(),Gdx.graphics.getBackBufferHeight());
        Gdx.gl.glClearColor(.018f,.021f,.024f,1);Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT|GL20.GL_DEPTH_BUFFER_BIT);
        if(commandDisplay!=null&&network.commandRound()!=null){commandDisplay.state(network.commandRound(),network.serverTime());commandDisplay.draw();network.ready();}
        renderer.render(delta);Gdx.gl.glDisable(GL20.GL_DEPTH_TEST);ui.getViewport().apply();ui.act(delta);ui.draw();
        if(profiler!=null){profiler.submitted();if(++measuredFrames>=240){var report=profiler.report(machine,measuredFrames);Gdx.app.log("TLC PERFORMANCE",report.toString());diagnosticLabel.setText(String.format(java.util.Locale.ROOT,"%.1f FPS | %.2f ms | %.0f draws | %.0f tris | %.0f binds | %d models | ~%.1f MiB maps",report.get("averageFps"),report.get("averageFrameMs"),report.get("drawCalls"),report.get("renderedTrianglesAllPasses"),report.get("textureBindings"),machine.loadedAssetCount(),((Number)report.get("textureMemoryEstimateBytes")).doubleValue()/1048576));profiler.reset();measuredFrames=0;}}
        if(commandDisplay!=null||machine.animating()||diagnostics)Gdx.graphics.requestRendering();
    }
    @Override public void resize(int width,int height){if(width<=0||height<=0)return;camera.viewportWidth=width;camera.viewportHeight=height;camera.update();ui.getViewport().update(width,height,true);}
    @Override public void pause(){orbit.cancel();if(network!=null)network.visibility(false);}
    @Override public void resume(){focusedTask="";if(network!=null)network.visibility(true);}
    @Override public void hide(){Gdx.graphics.setContinuousRendering(previousContinuous);game.setSceneFps(null);orbit.cancel();if(Gdx.input.getInputProcessor()==input)Gdx.input.setInputProcessor(null);dispose();}
    @Override public void dispose(){if(disposed)return;disposed=true;orbit.cancel();if(profiler!=null)profiler.dispose();if(network!=null)network.close();if(network!=null&&game.getAudio()!=null){game.getAudio().commandStopLoop(com.erni.finalanswer.audio.GameAudio.CommandCue.SIGNAL,signalLoop);game.getAudio().commandStopLoop(com.erni.finalanswer.audio.GameAudio.CommandCue.RADIO_STATIC,radioLoop);}renderer.dispose();if(effects!=null)effects.dispose();if(commandDisplay!=null)commandDisplay.dispose();machine.dispose();ui.dispose();font.dispose();pixel.dispose();}
}
