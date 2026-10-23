package com.erni.finalanswer.cursedboxes;

import com.badlogic.gdx.*;
import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.g2d.*;
import com.badlogic.gdx.math.MathUtils;
import com.erni.finalanswer.ui.UiFonts;
import com.erni.finalanswer.utils.DisplayManager;
import java.util.function.Consumer;

/** Presents progress between bounded GL-thread uploads. Assets and the display session transfer exactly once. */
public final class CursedBoxesLoadingScreen extends InputAdapter implements Screen {
    private final CursedBoxesAssets assets=new CursedBoxesAssets(true);
    private final DisplayManager.TemporaryFullscreen display=new DisplayManager.TemporaryFullscreen();
    private final Consumer<CursedBoxesScreen> ready;
    private final Runnable back;
    private final boolean characterTest;
    private SpriteBatch batch;
    private BitmapFont title,font;
    private Texture white;
    private com.erni.finalanswer.ui.effects.CinematicFrame frame;
    private final StringBuilder caption=new StringBuilder(80);
    private RuntimeException failure;
    private boolean diagnostics;
    private int viewportWidth=-1,viewportHeight=-1;
    public boolean failed(){return failure!=null;}
    private final OrthographicCamera camera=new OrthographicCamera();
    private final GlyphLayout text=new GlyphLayout();
    private CursedBoxesScreen prepared;
    private int frames,phase;
    private boolean transferred,disposed,presenting,activeScreen,rendering;
    private float age;
    private final long started=System.nanoTime();
    public CursedBoxesLoadingScreen(Consumer<CursedBoxesScreen> ready,Runnable back){this(ready,back,false);}
    public CursedBoxesLoadingScreen(Consumer<CursedBoxesScreen> ready,Runnable back,boolean characterTest){this.ready=ready;this.back=back;this.characterTest=characterTest;}
    @Override public void show(){
        if(disposed)return;
        if(batch==null){batch=new SpriteBatch();title=UiFonts.horror(46);font=UiFonts.body(18);
        frame=new com.erni.finalanswer.ui.effects.CinematicFrame();
        Pixmap p=new Pixmap(1,1,Pixmap.Format.RGBA8888);p.setColor(Color.WHITE);p.fill();white=new Texture(p);p.dispose();}
        presenting=true;try{if(!Boolean.getBoolean("cursed.windowed"))display.enter();}finally{presenting=false;}
        activeScreen=true;Gdx.input.setInputProcessor(this);
    }
    private void draw(float delta){
        if(disposed)return;age+=Float.isFinite(delta)?MathUtils.clamp(delta,0,.1f):0;
        int width=Gdx.graphics.getWidth(),height=Gdx.graphics.getHeight();if(width<=0||height<=0)return;
        com.badlogic.gdx.graphics.glutils.HdpiUtils.glViewport(0,0,width,height);
        Gdx.gl.glClearColor(.018f,.009f,.014f,1);Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT|GL20.GL_DEPTH_BUFFER_BIT);
        Gdx.gl.glDisable(GL20.GL_DEPTH_TEST);Gdx.gl.glDepthMask(true);
        if(viewportWidth!=width||viewportHeight!=height){viewportWidth=width;viewportHeight=height;camera.setToOrtho(false,width,height);batch.setProjectionMatrix(camera.combined);}
        float w=width,h=height,bar=Math.min(480,w*.72f),progress=Math.min(1,assets.progress()*.9f+phase*.05f);
        boolean reduced=Gdx.app.getApplicationListener() instanceof com.erni.finalanswer.FinalAnswerGame game&&game.getSettings().reducedMotion();
        float opacity=reduced?1:MathUtils.clamp(age/.3f,0,1);
        String label=failure!=null?"THE GALLERY COULD NOT BE OPENED":!assets.ready()?(progress<.3f?"OPENING THE GALLERY":progress<.65f?"SETTING THE SCENE":"PREPARING THE SHOW"):phase<2?"FINAL PREPARATIONS":"THE GALLERY IS READY";
        batch.begin();frame.draw(batch,w,h,1);
        font.getData().setScale(.7f);font.setColor(.63f,.49f,.32f,opacity);text.setText(font,"F I N A L   A N S W E R");font.draw(batch,text,(w-text.width)*.5f,h*.68f);
        title.getData().setScale(Math.min(1,w/700));title.setColor(.84f,.68f,.43f,opacity);text.setText(title,"CURSED BOXES");title.draw(batch,text,(w-text.width)*.5f,h*.6f);
        font.getData().setScale(Math.min(.85f,w/600));font.setColor(failure==null?.67f:.85f,.53f,.42f,opacity);text.setText(font,label);font.draw(batch,text,(w-text.width)*.5f,h*.47f);
        // Sixteen restrained segments echo the gallery; progress includes scene assembly and GPU warmup.
        float gap=5,segment=(bar-gap*15)/16;
        for(int i=0;i<16;i++){
            float coverage=MathUtils.clamp(progress*16-i,0,1);
            batch.setColor(.15f+coverage*.55f,.09f+coverage*.39f,.065f+coverage*.19f,opacity);
            batch.draw(white,(w-bar)*.5f+i*(segment+gap),h*.4f,segment,3);
        }
        font.getData().setScale(.7f);font.setColor(.62f,.51f,.38f,opacity);caption.setLength(0);
        if(failure==null)caption.append(Math.round(progress*100)).append("%  /  KEEP YOUR PHONE CLOSE");else caption.append("RETURN TO THE MENU AND TRY AGAIN");
        text.setText(font,caption);font.draw(batch,text,(w-text.width)*.5f,h*.35f);
        font.setColor(.44f,.36f,.28f,opacity);text.setText(font,"ESC  RETURN");font.draw(batch,text,(w-text.width)*.5f,h*.23f);
        if(diagnostics){font.getData().setScale(.65f);text.setText(font,failure==null?assets.stage():failure.getClass().getSimpleName());font.draw(batch,text,24,35);}
        batch.setColor(Color.WHITE);batch.end();
    }
    @Override public void render(float delta){
        if(disposed||!activeScreen||rendering)return;rendering=true;try{draw(delta);
        // The first loading frame reaches the compositor before any model/texture work begins.
        if(failure!=null||presenting||frames++==0)return;
        if(!assets.ready()){assets.loadNext();return;}
        if(phase==0){long start=System.nanoTime();prepared=new CursedBoxesScreen(back,assets,display,characterTest);Gdx.app.log("Cursed loading","Scene assembly: "+Math.round((System.nanoTime()-start)/1e6)+" ms");phase++;draw(0);return;}
        if(phase==1){long start=System.nanoTime();prepared.prepare();Gdx.app.log("Cursed loading","GPU/audio warmup: "+Math.round((System.nanoTime()-start)/1e6)+" ms");phase++;draw(0);return;}
        transferred=true;Gdx.app.log("Cursed loading","Ready after "+Math.round((System.nanoTime()-started)/1e6)+" ms across "+frames+" presented frames");ready.accept(prepared);disposeUi();
        }catch(RuntimeException error){
            if(transferred)throw error;
            failure=error;Gdx.app.error("Cursed loading","Cannot prepare gallery at "+assets.stage()+" (scene phase "+phase+"). Return to menu to retry.",error);
        }finally{rendering=false;}
    }
    @Override public boolean keyDown(int key){if(key==Input.Keys.F3){diagnostics=!diagnostics;return true;}if(key==Input.Keys.ESCAPE){back.run();return true;}if(key==Input.Keys.F11){display.toggle();return true;}return false;}
    private void disposeUi(){if(disposed)return;disposed=true;if(batch!=null)batch.dispose();if(title!=null)title.dispose();if(font!=null)font.dispose();if(white!=null)white.dispose();if(frame!=null)frame.dispose();}
    @Override public void hide(){activeScreen=false;if(Gdx.input.getInputProcessor()==this)Gdx.input.setInputProcessor(null);if(!transferred)dispose();}
    @Override public void dispose(){if(!transferred&&!disposed){if(prepared!=null)prepared.dispose();else{assets.dispose();display.restore();}}disposeUi();}
    @Override public void resize(int width,int height){}
    @Override public void pause(){}
    @Override public void resume(){}
}
