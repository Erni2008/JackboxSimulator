package com.erni.finalanswer.lwjgl3;

import com.badlogic.gdx.ApplicationAdapter;
import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.backends.lwjgl3.*;
import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.glutils.FrameBuffer;
import com.badlogic.gdx.math.Matrix4;
import com.badlogic.gdx.utils.ScreenUtils;
import com.erni.finalanswer.ui.lobby.cages.Cage3D;

/**
 * Dev tool: renders the lobby's own 3D birdcage (Cage3D, exactly as on the host start screen) into transparent sprite
 * sheets for the phone lobby: a BACK layer (behind the character) and a FRONT layer (bars, dome, closed door) at
 * {@code FRAMES} yaw angles, plus one tile of 3D chain links. Output: -Dcage.out=/abs/dir (back.png, front.png, chain.png).
 */
public final class CageSpriteLauncher {
    static final int FRAMES=12,FW=360,FH=432;static final float YAW=13,TILT=-6;
    public static void main(String[] a){
        var c=new Lwjgl3ApplicationConfiguration();c.setTitle("cage sprites");c.setWindowedMode(FW,FH);c.setBackBufferConfig(8,8,8,8,24,0,4);
        new Lwjgl3Application(new ApplicationAdapter(){
            @Override public void create(){
                String out=System.getProperty("cage.out");Cage3D cage=new Cage3D();
                // cage local space: x 178±122, y 20..360 → a 300 x 360 window, scaled into each frame
                var cam=new OrthographicCamera(300,360);cam.position.set(Cage3D.CX,190,0);cam.update();
                FrameBuffer fb=new FrameBuffer(Pixmap.Format.RGBA8888,FW,FH,true);
                for(int layer=0;layer<2;layer++){Pixmap sheet=new Pixmap(FW*FRAMES,FH,Pixmap.Format.RGBA8888);sheet.setBlending(Pixmap.Blending.None);
                    for(int f=0;f<FRAMES;f++){float yaw=-YAW+2*YAW*f/(FRAMES-1);
                        fb.begin();Gdx.gl.glViewport(0,0,FW,FH);ScreenUtils.clear(0,0,0,0,true);
                        cage.begin(cam);Matrix4 world=new Matrix4();
                        if(layer==0)cage.cage(world,yaw,TILT,false);else{cage.cage(world,yaw,TILT,true);cage.door(world,yaw,TILT,0,0,0,0);}
                        cage.end();
                        Pixmap px=Pixmap.createFromFrameBuffer(0,0,FW,FH);fb.end();
                        for(int y=0;y<FH;y++)for(int x=0;x<FW;x++)sheet.drawPixel(f*FW+x,y,px.getPixel(x,FH-1-y));px.dispose();}
                    PixmapIO.writePNG(Gdx.files.absolute(out+(layer==0?"/back.png":"/front.png")),sheet);sheet.dispose();}
                // a vertical tile of chain links (the same 3D links the lobby hangs its cages on)
                var cc=new OrthographicCamera(40,190);cc.position.set(0,95,0);cc.update();FrameBuffer cf=new FrameBuffer(Pixmap.Format.RGBA8888,80,380,true);
                cf.begin();Gdx.gl.glViewport(0,0,80,380);ScreenUtils.clear(0,0,0,0,true);cage.begin(cc);cage.chain(0,190+19*2,0,-19*2);cage.end();
                Pixmap cp=Pixmap.createFromFrameBuffer(0,0,80,380);cf.end();Pixmap flip=new Pixmap(80,380,Pixmap.Format.RGBA8888);flip.setBlending(Pixmap.Blending.None);
                for(int y=0;y<380;y++)for(int x=0;x<80;x++)flip.drawPixel(x,y,cp.getPixel(x,379-y));PixmapIO.writePNG(Gdx.files.absolute(out+"/chain.png"),flip);
                cp.dispose();flip.dispose();fb.dispose();cf.dispose();cage.dispose();Gdx.app.exit();
            }
        },c);
    }
}
