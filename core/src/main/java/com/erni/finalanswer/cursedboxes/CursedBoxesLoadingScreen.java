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
    private SpriteBatch batch;
    private BitmapFont title,font;
    private Texture white;
    private final OrthographicCamera camera=new OrthographicCamera();
    private final GlyphLayout text=new GlyphLayout();
    private CursedBoxesScreen prepared;
    private int frames,phase;
    private boolean transferred,disposed,presenting,activeScreen,rendering;
    private float age;
    private final long started=System.nanoTime();
    public CursedBoxesLoadingScreen(Consumer<CursedBoxesScreen> ready,Runnable back){this.ready=ready;this.back=back;}
    @Override public void show(){
        batch=new SpriteBatch();title=UiFonts.horror(46);font=UiFonts.body(18);
        Pixmap p=new Pixmap(1,1,Pixmap.Format.RGBA8888);p.setColor(Color.WHITE);p.fill();white=new Texture(p);p.dispose();
        presenting=true;try{if(!Boolean.getBoolean("cursed.windowed"))display.enter();}finally{presenting=false;}
        activeScreen=true;Gdx.input.setInputProcessor(this);
    }
    private void draw(float delta){
        if(disposed)return;age+=MathUtils.clamp(delta,0,.1f);
        com.badlogic.gdx.graphics.glutils.HdpiUtils.glViewport(0,0,Gdx.graphics.getWidth(),Gdx.graphics.getHeight());
        Gdx.gl.glClearColor(.018f,.009f,.014f,1);Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT|GL20.GL_DEPTH_BUFFER_BIT);
        Gdx.gl.glDisable(GL20.GL_DEPTH_TEST);Gdx.gl.glDepthMask(true);camera.setToOrtho(false,Gdx.graphics.getWidth(),Gdx.graphics.getHeight());batch.setProjectionMatrix(camera.combined);
        float w=Gdx.graphics.getWidth(),h=Gdx.graphics.getHeight(),bar=Math.min(440,w*.65f),progress=assets.progress()*.88f+phase*.035f;
        String label=!assets.ready()?assets.stage():phase==0?"Composing the gallery":phase==1?"Preparing lighting":"Ready";
        batch.begin();title.setColor(.76f,.58f,.33f,1);text.setText(title,"CURSED BOXES");title.draw(batch,text,(w-text.width)*.5f,h*.57f);
        font.setColor(.65f,.57f,.45f,1);text.setText(font,label);font.draw(batch,text,(w-text.width)*.5f,h*.45f);
        batch.setColor(.13f,.08f,.045f,1);batch.draw(white,(w-bar)*.5f,h*.39f,bar,2);batch.setColor(.66f,.43f,.2f,.82f+.1f*MathUtils.sin(age*2));batch.draw(white,(w-bar)*.5f,h*.39f,bar*Math.min(1,progress),2);
        font.setColor(.44f,.36f,.28f,1);text.setText(font,"ESC  RETURN");font.draw(batch,text,(w-text.width)*.5f,h*.3f);batch.setColor(Color.WHITE);batch.end();
    }
    @Override public void render(float delta){
        if(disposed||!activeScreen||rendering)return;rendering=true;try{draw(delta);
        // The first loading frame reaches the compositor before any model/texture work begins.
        if(presenting||frames++==0)return;
        if(!assets.ready()){assets.loadNext();return;}
        if(phase==0){long start=System.nanoTime();prepared=new CursedBoxesScreen(back,assets,display);Gdx.app.log("Cursed loading","Scene assembly: "+Math.round((System.nanoTime()-start)/1e6)+" ms");phase++;draw(0);return;}
        if(phase==1){long start=System.nanoTime();prepared.prepare();Gdx.app.log("Cursed loading","GPU/audio warmup: "+Math.round((System.nanoTime()-start)/1e6)+" ms");phase++;draw(0);return;}
        transferred=true;Gdx.app.log("Cursed loading","Ready after "+Math.round((System.nanoTime()-started)/1e6)+" ms across "+frames+" presented frames");ready.accept(prepared);disposeUi();
        }finally{rendering=false;}
    }
    @Override public boolean keyDown(int key){if(key==Input.Keys.ESCAPE){back.run();return true;}if(key==Input.Keys.F11){display.toggle();return true;}return false;}
    private void disposeUi(){if(disposed)return;disposed=true;if(batch!=null)batch.dispose();if(title!=null)title.dispose();if(font!=null)font.dispose();if(white!=null)white.dispose();}
    @Override public void hide(){activeScreen=false;if(Gdx.input.getInputProcessor()==this)Gdx.input.setInputProcessor(null);if(!transferred)dispose();}
    @Override public void dispose(){if(!transferred&&!disposed){if(prepared!=null)prepared.dispose();else{assets.dispose();display.restore();}}disposeUi();}
    @Override public void resize(int width,int height){}
    @Override public void pause(){}
    @Override public void resume(){}
}
