package com.erni.finalanswer.lwjgl3;

import com.badlogic.gdx.*;
import com.badlogic.gdx.backends.lwjgl3.*;
import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.g2d.*;
import com.badlogic.gdx.graphics.glutils.ShapeRenderer;
import com.badlogic.gdx.math.Matrix4;
import com.badlogic.gdx.utils.*;
import com.badlogic.gdx.utils.viewport.FitViewport;
import com.erni.finalanswer.ui.UiFonts;
import com.erni.finalanswer.ui.lobby.cages.*;

/** Development source set only. Same production rig, art, Batch and animator, no alternative renderer. */
public final class PuppeteerStudioLauncher {
    public static void main(String[] args){
        if(StartupHelper.startNewJvmIfRequired())return;
        var window=new Lwjgl3ApplicationConfiguration();window.setTitle("THE PUPPETEER / animation studio");window.setWindowedMode(1440,960);window.disableAudio(true);window.setForegroundFPS(60);
        new Lwjgl3Application(new ApplicationAdapter(){
            final FitViewport viewport=new FitViewport(1440,960);final Matrix4 transform=new Matrix4();
            final boolean check=Boolean.getBoolean("puppeteer.check");final float[] captures={.5f,2.5f,4.5f,7,9,11.7f,14,17,20,23,26,29,32,35,38,41};
            SpriteBatch batch;BitmapFont font;ShapeRenderer lines;PuppeteerConfig config;PuppeteerAssets assets;PuppeteerCharacter[] dolls;
            float elapsed;int shot,selected;boolean pause,bones,pivots,cords;int auto;
            @Override public void create(){batch=new SpriteBatch();font=UiFonts.body(19);lines=new ShapeRenderer();config=PuppeteerConfig.load();assets=new PuppeteerAssets(config);dolls=new PuppeteerCharacter[8];for(int i=0;i<8;i++)dolls[i]=new PuppeteerCharacter(assets,config,123+i);}
            boolean key(int key){return Gdx.input.isKeyJustPressed(key);}
            void play(PuppeteerAnimator.State s){for(var d:dolls)d.animator().play(s);}
            @Override public void render(){float dt=check?1f/60:Math.min(.1f,Gdx.graphics.getDeltaTime()),before=elapsed;elapsed+=dt;
                if(!check){if(key(Input.Keys.ESCAPE))Gdx.app.exit();if(key(Input.Keys.SPACE))pause=!pause;
                    if(key(Input.Keys.I)){play(PuppeteerAnimator.State.IDLE);play(PuppeteerAnimator.State.INTRO);}if(key(Input.Keys.L))play(PuppeteerAnimator.State.LAUGH);
                    if(key(Input.Keys.S))play(PuppeteerAnimator.State.SCARE);if(key(Input.Keys.W))play(dolls[0].animator().state()==PuppeteerAnimator.State.WALK?PuppeteerAnimator.State.IDLE:PuppeteerAnimator.State.WALK);
                    if(key(Input.Keys.O))play(PuppeteerAnimator.State.LOOK_AT_PLAYER);if(key(Input.Keys.B))play(PuppeteerAnimator.State.BROKEN);if(key(Input.Keys.U))play(PuppeteerAnimator.State.STRING_PULL);
                    if(key(Input.Keys.P))pivots=!pivots;if(key(Input.Keys.K))bones=!bones;if(key(Input.Keys.T))cords=!cords;
                    if(key(Input.Keys.TAB))selected=(selected+1)%dolls[0].skeleton().bones.length;
                    var part=config.parts.get(selected);float step=Gdx.input.isKeyPressed(Input.Keys.SHIFT_LEFT)?1:.2f;
                    if(key(Input.Keys.LEFT))part.x-=step;if(key(Input.Keys.RIGHT))part.x+=step;if(key(Input.Keys.UP))part.y+=step;if(key(Input.Keys.DOWN))part.y-=step;
                    if(key(Input.Keys.LEFT_BRACKET))part.rotation--;if(key(Input.Keys.RIGHT_BRACKET))part.rotation++;
                    for(var d:dolls){var a=d.animator();if(key(Input.Keys.E))a.eyeTracking=!a.eyeTracking;if(key(Input.Keys.M))a.idleMovement=!a.idleMovement;
                        if(key(Input.Keys.EQUALS))a.speed=Math.min(4,a.speed+.25f);if(key(Input.Keys.MINUS))a.speed=Math.max(.25f,a.speed-.25f);
                        for(int i=0;i<7;i++)if(key(Input.Keys.NUM_1+i)){a.play(PuppeteerAnimator.State.IDLE);a.trigger(PuppeteerAnimator.Behavior.values()[i]);}
                    }
                    var pointer=new com.badlogic.gdx.math.Vector2(Gdx.input.getX(),Gdx.input.getY());viewport.unproject(pointer);dolls[0].animator().lookAt((pointer.x-380)/300,(pointer.y-530)/300);
                }
                if(check){
                    if(before<7.5f&&elapsed>=7.5f)play(PuppeteerAnimator.State.WALK);
                    if(before<10.5f&&elapsed>=10.5f)play(PuppeteerAnimator.State.LAUGH);
                    if(before<13&&elapsed>=13)play(PuppeteerAnimator.State.SCARE);
                    if(before<16&&elapsed>=16)play(PuppeteerAnimator.State.LOOK_AT_PLAYER);
                    if(before<19&&elapsed>=19)play(PuppeteerAnimator.State.BROKEN);
                    if(before<22&&elapsed>=22)play(PuppeteerAnimator.State.STRING_PULL);
                    if(elapsed>=25+auto*2.5f&&auto<7){play(PuppeteerAnimator.State.IDLE);for(var d:dolls)d.animator().trigger(PuppeteerAnimator.Behavior.values()[auto]);auto++;}
                }
                ScreenUtils.clear(.055f,.06f,.07f,1);viewport.apply();batch.setProjectionMatrix(viewport.getCamera().combined);batch.begin();
                for(int i=0;i<8;i++){dolls[i].advance(pause?0:dt,i*.67f,false);dolls[i].drawAt(batch,i==0?380:870+(i%3)*170,i==0?95:75+(i/3)*240,i==0?4.3f:1.2f,1);}
                font.draw(batch,"PUPPETEER / "+dolls[0].animator().state()+" / "+dolls[0].animator().behavior(),30,930);
                font.draw(batch,"I intro | L laugh | S scare | W walk | O stare | B broken | U string pull | 1–7 behaviors",30,900);
                font.draw(batch,"Space pause | E eyes | M idle | +/- speed | K bones | P pivots | T cords | Tab bone | arrows / [ ] edit",30,873);
                font.draw(batch,"Part: "+config.parts.get(selected).name+"   Speed: "+dolls[0].animator().speed,30,40);batch.end();
                if(bones||pivots||cords){lines.setProjectionMatrix(viewport.getCamera().combined);transform.idt().translate(380,95,0).scale(4.3f,4.3f,1);lines.setTransformMatrix(transform);lines.begin(ShapeRenderer.ShapeType.Line);
                    for(var b:dolls[0].skeleton().bones){float x=b.world.val[Matrix4.M03],y=b.world.val[Matrix4.M13];lines.setColor(Color.GREEN);if(pivots){lines.line(x-1,y,x+1,y);lines.line(x,y-1,x,y+1);}if(bones&&b.parent!=null)lines.line(x,y,b.parent.world.val[Matrix4.M03],b.parent.world.val[Matrix4.M13]);}
                    if(cords)for(int i=0;i<config.strings.size;i++){var c=config.strings.get(i);lines.setColor(Color.ORANGE);lines.circle(c.anchorX,c.anchorY,1,8);lines.circle(dolls[0].strings().endX(i),dolls[0].strings().endY(i),1,8);}lines.end();}
                if(check&&shot<captures.length&&elapsed>=captures[shot]){
                    verify();Pixmap pixels=ScreenUtils.getFrameBufferPixmap(0,0,Gdx.graphics.getBackBufferWidth(),Gdx.graphics.getBackBufferHeight());try{PixmapIO.writePNG(Gdx.files.absolute(System.getProperty("puppeteer.output")+"/studio-"+shot+".png"),pixels,-1,true);}finally{pixels.dispose();}shot++;
                    if(shot==captures.length){System.out.println("PASS: Puppeteer eight instances, states, seven behaviors, transformed cords and GL rendering");Gdx.app.exit();}
                }
            }
            void verify(){if(Gdx.gl.glGetError()!=0)throw new AssertionError("Puppeteer GL error");
                for(var d:dolls)for(int i=0;i<config.strings.size;i++){var c=config.strings.get(i);var m=d.skeleton().bone(c.part).world.val;float x=m[Matrix4.M03]+m[Matrix4.M00]*c.x+m[Matrix4.M01]*c.y,y=m[Matrix4.M13]+m[Matrix4.M10]*c.x+m[Matrix4.M11]*c.y;
                    if(Math.abs(x-d.strings().endX(i))>.001f||Math.abs(y-d.strings().endY(i))>.001f)throw new AssertionError("Detached cord endpoint");}
                batch.begin();batch.setColor(.7f,.6f,.5f,.8f);var color=new Color(batch.getColor());var matrix=new Matrix4(batch.getTransformMatrix());int blend=batch.getBlendDstFunc();dolls[0].drawAt(batch,-1000,-1000,1,1);
                if(!color.equals(batch.getColor())||!java.util.Arrays.equals(matrix.val,batch.getTransformMatrix().val)||blend!=batch.getBlendDstFunc())throw new AssertionError("Batch state leaked");batch.setColor(Color.WHITE);batch.end();
            }
            @Override public void resize(int w,int h){viewport.update(w,h,true);}
            @Override public void dispose(){batch.dispose();font.dispose();lines.dispose();assets.dispose();}
        },window);
    }
}
