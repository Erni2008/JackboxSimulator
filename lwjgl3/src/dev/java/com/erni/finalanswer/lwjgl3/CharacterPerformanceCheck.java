package com.erni.finalanswer.lwjgl3;

import com.badlogic.gdx.*;
import com.badlogic.gdx.backends.lwjgl3.*;
import com.badlogic.gdx.graphics.Pixmap;
import com.badlogic.gdx.math.Intersector;
import com.erni.finalanswer.ui.lobby.cages.*;

/** Repeatable CPU/load probe, separate from screenshot encoding and desktop frame limiting. */
public final class CharacterPerformanceCheck {
    public static void main(String[] args){if(StartupHelper.startNewJvmIfRequired())return;var window=new Lwjgl3ApplicationConfiguration();window.setWindowedMode(640,360);window.disableAudio(true);window.setTitle("Character performance probe");
        new Lwjgl3Application(new ApplicationAdapter(){
            void verifyPixels(){
                var random=new java.util.Random(42);
                for(int[] size:new int[][]{{2,2},{3,5},{16,19},{1,17}}){
                    Pixmap source=new Pixmap(size[0],size[1],Pixmap.Format.RGBA8888);source.setBlending(Pixmap.Blending.None);
                    for(int y=0;y<size[1];y++)for(int x=0;x<size[0];x++)source.drawPixel(x,y,random.nextInt());
                    Pixmap reduced=CharacterTextures.reduce(source);
                    for(int y=0;y<reduced.getHeight();y++)for(int x=0;x<reduced.getWidth();x++){
                        int alpha=0,r=0,g=0,b=0,count=0;
                        for(int sy=y*size[1]/reduced.getHeight();sy<(y+1)*size[1]/reduced.getHeight();sy++)for(int sx=x*size[0]/reduced.getWidth();sx<(x+1)*size[0]/reduced.getWidth();sx++){
                            int pixel=source.getPixel(sx,sy),a=pixel&255;alpha+=a;r+=(pixel>>>24)*a;g+=((pixel>>>16)&255)*a;b+=((pixel>>>8)&255)*a;count++;
                        }
                        int expected=alpha==0?0:(((r+alpha/2)/alpha)<<24)|(((g+alpha/2)/alpha)<<16)|(((b+alpha/2)/alpha)<<8)|((alpha+count/2)/count);
                        if(reduced.getPixel(x,y)!=expected)throw new AssertionError("Mipmap pixels changed");
                    }reduced.dispose();source.dispose();
                }System.out.println("PASS: optimized mipmaps are pixel-identical for odd/even RGBA sizes");
            }
            void verifyContours(PuppeteerConfig config){
                for(var part:config.parts){if(part.matte.length==0)continue;
                    String file=part.asset==9?"pupper9.png":"puppet"+part.asset+".png";
                    Pixmap source=new Pixmap(Gdx.files.internal("lobby/characters/puppeteer/"+file));
                    try{CharacterTextureMasks.polygon(source,part.matte);
                        for(int y=0;y<source.getHeight();y++)for(int x=0;x<source.getWidth();x++)if(!Intersector.isPointInPolygon(part.matte,0,part.matte.length,x+.5f,y+.5f)&&(source.getPixel(x,y)&255)!=0)throw new AssertionError("Contour escaped: "+part.name);
                        // Check inclusion independent of the original texture's alpha.
                        Pixmap mask=new Pixmap(source.getWidth(),source.getHeight(),Pixmap.Format.RGBA8888);mask.setColor(1,1,1,1);mask.fill();CharacterTextureMasks.polygon(mask,part.matte);
                        try{for(int y=0;y<mask.getHeight();y++)for(int x=0;x<mask.getWidth();x++)if(((mask.getPixel(x,y)&255)>0)!=Intersector.isPointInPolygon(part.matte,0,part.matte.length,x+.5f,y+.5f))throw new AssertionError("Contour mismatch: "+part.name+" "+x+","+y);}finally{mask.dispose();}
                    }finally{source.dispose();}
                }System.out.println("PASS: every supplied contour matches the previous per-pixel polygon test");
            }
            void verifyTerminalCatchUp(VoodooAssets assets,VoodooConfig config){
                var fast=new VoodooCharacter(assets,config,42);var stepped=new VoodooCharacter(assets,config,42);
                fast.advance(3,0,false);stepped.advance(3,0,false);
                fast.play(VoodooAnimationController.State.DEATH,42);stepped.play(VoodooAnimationController.State.DEATH,42);
                fast.advance(12,0,false);for(int i=0;i<1440;i++)stepped.advance(1f/120,0,false);
                for(int i=0;i<fast.parts().length;i++)for(int j=0;j<16;j++)if(Math.abs(fast.parts()[i].world.val[j]-stepped.parts()[i].world.val[j])>.002f)throw new AssertionError("Terminal catch-up changed detached part "+i);
                if(Math.abs(fast.controller().eventElapsed()-stepped.controller().eventElapsed())>.002f)throw new AssertionError("Network event age changed");
                System.out.println("PASS: long terminal catch-up preserves detached parts and event timing");
            }
            @Override public void create(){
                PuppeteerAssets puppetAssets=null;VoodooAssets dollAssets=null;
                try{
                    verifyPixels();var puppetConfig=PuppeteerConfig.load();verifyContours(puppetConfig);long start=System.nanoTime();puppetAssets=new PuppeteerAssets(puppetConfig);System.out.println("PUPPET_ASSET_LOAD_MS="+(System.nanoTime()-start)/1e6);
                    var dollConfig=VoodooConfig.load();start=System.nanoTime();dollAssets=new VoodooAssets(dollConfig);System.out.println("VOODOO_ASSET_LOAD_MS="+(System.nanoTime()-start)/1e6);
                    var puppets=new PuppeteerCharacter[8];var dolls=new VoodooCharacter[8];for(int i=0;i<8;i++){puppets[i]=new PuppeteerCharacter(puppetAssets,puppetConfig,i+42);dolls[i]=new VoodooCharacter(dollAssets,dollConfig,i+42);}
                    for(int frame=0;frame<900;frame++)for(int i=0;i<8;i++){puppets[i].advance(1f/60,i*.67f,false);dolls[i].advance(1f/60,i*.67f,false);}
                    for(int pass=0;pass<3;pass++){
                        start=System.nanoTime();for(int frame=0;frame<1200;frame++)for(int i=0;i<8;i++)puppets[i].advance(1f/60,i*.67f,false);System.out.println("EIGHT_PUPPET_UPDATE_MS="+(System.nanoTime()-start)/1e6/1200);
                        start=System.nanoTime();for(int frame=0;frame<1200;frame++)for(int i=0;i<8;i++)dolls[i].advance(1f/60,i*.67f,false);System.out.println("EIGHT_VOODOO_UPDATE_MS="+(System.nanoTime()-start)/1e6/1200);
                    }
                    verifyTerminalCatchUp(dollAssets,dollConfig);
                    if(Gdx.gl.glGetError()!=0)throw new AssertionError("Performance probe GL error");System.out.println("PASS: repeated eight-instance update/load probe");
                }finally{if(puppetAssets!=null)puppetAssets.dispose();if(dollAssets!=null)dollAssets.dispose();Gdx.app.exit();}
            }
        },window);
    }
}
