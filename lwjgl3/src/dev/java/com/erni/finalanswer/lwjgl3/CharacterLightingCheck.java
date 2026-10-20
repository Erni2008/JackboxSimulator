package com.erni.finalanswer.lwjgl3;

import com.badlogic.gdx.*;
import com.badlogic.gdx.backends.lwjgl3.*;
import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.g2d.*;
import com.badlogic.gdx.graphics.glutils.*;
import com.badlogic.gdx.math.Matrix4;
import com.badlogic.gdx.utils.*;
import com.erni.finalanswer.ui.lobby.cages.*;

/** GL regressions for straight-alpha compositing, state isolation and real character minification. */
public final class CharacterLightingCheck {
    static void check(boolean ok,String why){if(!ok)throw new AssertionError(why);}
    static void near(float actual,float expected){check(Math.abs(actual-expected)<.018f,"Expected "+expected+", got "+actual);}
    static final class ObservedBatch extends SpriteBatch {
        boolean watching;int additive;
        @Override public void setBlendFunctionSeparate(int src,int dst,int srcA,int dstA){if(watching&&dst==GL20.GL_ONE)additive++;super.setBlendFunctionSeparate(src,dst,srcA,dstA);}
    }
    public static void main(String[] args){if(StartupHelper.startNewJvmIfRequired())return;var window=new Lwjgl3ApplicationConfiguration();window.setTitle("Character lighting verification");window.setWindowedMode(640,360);window.disableAudio(true);
        new Lwjgl3Application(new ApplicationAdapter(){
            ObservedBatch batch;FrameBuffer framebuffer;ShaderProgram sentinel;Texture pixel;
            @Override public void create(){
                batch=new ObservedBatch();framebuffer=new FrameBuffer(Pixmap.Format.RGBA8888,64,64,false);sentinel=SpriteBatch.createDefaultShader();
                try{testCoverage();testState();testSampling();testPuppet();check(Gdx.gl.glGetError()==0,"No GL errors");System.out.println("PASS: alpha-weighted mipmaps, straight-alpha pixels, dirty blend/shader isolation, exception restoration, lower minification shimmer and no Puppeteer additive pass");}
                finally{Gdx.app.exit();}
            }
            void testCoverage(){
                Pixmap source=new Pixmap(2,2,Pixmap.Format.RGBA8888);source.setBlending(Pixmap.Blending.None);source.setColor(1,1,1,0);source.fill();source.drawPixel(0,0,0xff0000ff);Pixmap mip=CharacterTextures.reduce(source);
                check(mip.getPixel(0,0)==0xff000040,"Transparent RGB must not contaminate visible red edge");mip.dispose();source.dispose();
                source=new Pixmap(3,1,Pixmap.Format.RGBA8888);source.drawPixel(0,0,0xff0000ff);source.drawPixel(1,0,0x00ff00ff);source.drawPixel(2,0,0x0000ffff);mip=CharacterTextures.reduce(source);
                check(mip.getPixel(0,0)==0x555555ff,"Odd dimensions include the last texel");mip.dispose();source.dispose();
            }
            void testState(){
                Pixmap source=new Pixmap(1,1,Pixmap.Format.RGBA8888);source.setBlending(Pixmap.Blending.None);source.drawPixel(0,0,0x66993380);pixel=CharacterTextures.upload(source);source.dispose();
                var presentation=new CageCharacterPresentation();var profile=new CageCharacterPresentation.Profile();profile.pivotX=profile.pivotY=0;
                CageCharacter flat=new CageCharacter(){public void update(float t,float p,boolean r){}public void draw(Batch b,float a){check(b.getShader()!=sentinel,"Character must use the existing default shader");b.draw(pixel,0,0,64,64);}};
                framebuffer.begin();ScreenUtils.clear(.1f,.2f,.3f,.25f);batch.setProjectionMatrix(new Matrix4().setToOrtho2D(0,0,64,64));batch.begin();batch.setShader(sentinel);batch.disableBlending();batch.setBlendFunctionSeparate(GL20.GL_ONE,GL20.GL_ONE,GL20.GL_ZERO,GL20.GL_ONE);batch.setColor(Color.WHITE);
                var matrix=new Matrix4(batch.getTransformMatrix());presentation.draw(batch,flat,profile,1,0);batch.flush();
                check(batch.getShader()==sentinel&&!batch.isBlendingEnabled(),"Shader and disabled blending restored");check(batch.getBlendSrcFunc()==GL20.GL_ONE&&batch.getBlendDstFunc()==GL20.GL_ONE&&batch.getBlendSrcFuncAlpha()==GL20.GL_ZERO,"Separate blend factors restored");
                Pixmap pixels=ScreenUtils.getFrameBufferPixmap(0,0,64,64);Color out=new Color(pixels.getPixel(32,32));pixels.dispose();float alpha=128/255f;
                near(out.r,.4f*alpha+.1f*(1-alpha));near(out.g,.6f*alpha+.2f*(1-alpha));near(out.b,.2f*alpha+.3f*(1-alpha));near(out.a,alpha+.25f*(1-alpha));
                CageCharacter broken=new CageCharacter(){public void update(float t,float p,boolean r){}public void draw(Batch b,float a){b.setColor(Color.RED);b.setShader(null);b.enableBlending();b.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);throw new IllegalStateException("Expected probe");}};
                try{presentation.draw(batch,broken,profile,1,0);throw new AssertionError("Probe should throw");}catch(IllegalStateException expected){}
                check(batch.getColor().equals(Color.WHITE)&&batch.getShader()==sentinel&&!batch.isBlendingEnabled()&&java.util.Arrays.equals(matrix.val,batch.getTransformMatrix().val),"Exception restores all borrowed state");batch.end();framebuffer.end();batch.setShader(null);batch.enableBlending();batch.setBlendFunctionSeparate(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA,GL20.GL_ONE,GL20.GL_ONE_MINUS_SRC_ALPHA);
            }
            void testSampling(){
                Texture source=CharacterTextures.load("lobby/characters/puppeteer/puppet8.png");try{
                    check(source.getTextureData().isManaged(),"File textures retain reload support");source.load(source.getTextureData());
                    double legacy=variation(source,Texture.TextureFilter.Linear),filtered=variation(source,Texture.TextureFilter.MipMapLinearLinear);
                    System.out.println("INTERIOR_SAMPLE_VARIATION linear="+legacy+" coverageMips="+filtered);check(filtered<legacy*.8,"Mipmaps should reduce aliasing of the actual costume texture");
                }finally{source.dispose();}
            }
            double variation(Texture texture,Texture.TextureFilter min){
                texture.setFilter(min,Texture.TextureFilter.Linear);int[][] frames=new int[4][];
                for(int f=0;f<4;f++){framebuffer.begin();ScreenUtils.clear(0,0,0,0);batch.begin();batch.setColor(Color.WHITE);batch.draw(texture,8+f*.2f,0,48,58);batch.end();Pixmap p=ScreenUtils.getFrameBufferPixmap(0,0,64,64);frames[f]=new int[4096];for(int y=0;y<64;y++)for(int x=0;x<64;x++)frames[f][y*64+x]=p.getPixel(x,y);p.dispose();framebuffer.end();}
                double sum=0;int count=0;for(int i=0;i<4096;i++){boolean solid=true;for(var f:frames)solid&=(f[i]&255)>245;if(!solid)continue;for(int f=1;f<4;f++){for(int shift:new int[]{8,16,24})sum+=Math.abs(((frames[f][i]>>>shift)&255)-((frames[f-1][i]>>>shift)&255));count+=3;}}
                check(count>30,"Enough opaque costume samples");return sum/count;
            }
            void testPuppet(){var config=PuppeteerConfig.load();var assets=new PuppeteerAssets(config);try{
                var puppet=new PuppeteerCharacter(assets,config,42);framebuffer.begin();batch.begin();batch.watching=true;
                for(float seconds:new float[]{.5f,2,4,7}){puppet.advance(seconds,0,false);puppet.drawAt(batch,30,0,.3f,1);}batch.watching=false;batch.end();framebuffer.end();check(batch.additive==0,"Puppeteer has no additive lighting pass");
            }finally{assets.dispose();}}
            @Override public void dispose(){if(pixel!=null)pixel.dispose();sentinel.dispose();batch.dispose();framebuffer.dispose();}
        },window);
    }
}
