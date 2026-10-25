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
    private LastCommandProfiler profiler;private int measuredFrames;
    private Label diagnosticLabel;private LastCommandNetworkBridge network;private final long seed;
    public TheLastCommandScreen(FinalAnswerGame game){this(game,Long.getLong("lc.seed",20261025L));}
    public TheLastCommandScreen(FinalAnswerGame game,long seed) {
        this.game=game;this.seed=seed;machine=new TheLastCommandMachine(seed);orbit=new OrbitCameraController(camera,machine);renderer=new TheLastCommandRenderer(camera,machine);
        Pixmap p=new Pixmap(1,1,Pixmap.Format.RGBA8888);p.setColor(Color.WHITE);p.fill();pixel=new Texture(p);p.dispose();
        var style=new TextButton.TextButtonStyle();style.font=font;style.fontColor=Color.valueOf("C5BAAB");
        var solid=new TextureRegionDrawable(pixel);style.up=solid.tint(Color.valueOf("242628"));style.over=solid.tint(Color.valueOf("404345"));style.down=solid.tint(Color.valueOf("151719"));
        Table table=new Table();table.setFillParent(true);table.top().left().pad(20);ui.addActor(table);
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
                &&(event.kind()==PanelAction.Kind.ADJUSTER_CHANGED||event.kind()==PanelAction.Kind.PRESSED||event.kind()==PanelAction.Kind.LEVER_CHANGED||event.kind()==PanelAction.Kind.HATCH_CHANGED||event.kind()==PanelAction.Kind.CODE_UPDATED))game.getAudio().press();
        });
        reset.addListener(new ChangeListener(){public void changed(ChangeEvent e,Actor actor){orbit.reset();}});
        back.addListener(new ChangeListener(){public void changed(ChangeEvent e,Actor actor){exit();}});
        input=new InputMultiplexer(ui,new InputAdapter(){@Override public boolean keyDown(int key){if(key==Input.Keys.F8){toggleDiagnostics();return true;}if(key==Input.Keys.ESCAPE){exit();return true;}return false;}},orbit);
    }
    public void connectNetwork(com.erni.finalanswer.network.RealtimeClient client,com.google.gson.JsonObject state){network=new LastCommandNetworkBridge(client,machine,state);}
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
    private void toggleDiagnostics(){diagnostics=!diagnostics;if(diagnostics){profiler=new LastCommandProfiler();measuredFrames=0;profiler.reset();}else{profiler.dispose();profiler=null;diagnosticLabel.setText("F8: diagnostics");}Gdx.graphics.requestRendering();}
    @Override public void show(){previousContinuous=Gdx.graphics.isContinuousRendering();Gdx.graphics.setContinuousRendering(false);game.setSceneFps(GraphicsProfile.current().fps);Gdx.input.setInputProcessor(input);Gdx.graphics.requestRendering();}
    @Override public void render(float delta){
        delta=Math.min(.05f,delta);if(profiler!=null)profiler.begin();
        machine.update(delta);if(profiler!=null)profiler.updated();
        Gdx.gl.glViewport(0,0,Gdx.graphics.getBackBufferWidth(),Gdx.graphics.getBackBufferHeight());
        Gdx.gl.glClearColor(.018f,.021f,.024f,1);Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT|GL20.GL_DEPTH_BUFFER_BIT);
        renderer.render(delta);Gdx.gl.glDisable(GL20.GL_DEPTH_TEST);ui.getViewport().apply();ui.act(delta);ui.draw();
        if(profiler!=null){profiler.submitted();if(++measuredFrames>=240){var report=profiler.report(machine,measuredFrames);Gdx.app.log("TLC PERFORMANCE",report.toString());diagnosticLabel.setText(String.format(java.util.Locale.ROOT,"%.1f FPS | %.2f ms | %.0f draws | %.0f tris | %.0f binds | %d models | ~%.1f MiB maps",report.get("averageFps"),report.get("averageFrameMs"),report.get("drawCalls"),report.get("renderedTrianglesAllPasses"),report.get("textureBindings"),machine.loadedAssetCount(),((Number)report.get("textureMemoryEstimateBytes")).doubleValue()/1048576));profiler.reset();measuredFrames=0;}}
        if(machine.animating()||diagnostics)Gdx.graphics.requestRendering();
    }
    @Override public void resize(int width,int height){if(width<=0||height<=0)return;camera.viewportWidth=width;camera.viewportHeight=height;camera.update();ui.getViewport().update(width,height,true);}
    @Override public void pause(){orbit.cancel();}
    @Override public void hide(){Gdx.graphics.setContinuousRendering(previousContinuous);game.setSceneFps(null);orbit.cancel();if(Gdx.input.getInputProcessor()==input)Gdx.input.setInputProcessor(null);dispose();}
    @Override public void dispose(){if(disposed)return;disposed=true;orbit.cancel();if(profiler!=null)profiler.dispose();if(network!=null)network.close();renderer.dispose();machine.dispose();ui.dispose();font.dispose();pixel.dispose();}
}
