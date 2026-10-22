package com.erni.finalanswer.lwjgl3;

import com.badlogic.gdx.*;
import com.badlogic.gdx.backends.lwjgl3.*;
import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import com.badlogic.gdx.graphics.glutils.FrameBuffer;
import com.badlogic.gdx.utils.*;
import com.erni.finalanswer.cursedboxes.*;
import java.nio.ByteBuffer;

/** Test-only FBO readback verifies cover/blending; normal gameplay adds no FBOs/readbacks. */
public final class CursedBoxesBackgroundCheck {
    private static Throwable failure;
    public static void main(String[] args){
        com.erni.finalanswer.lwjgl3.display.DesktopBorderless.install();
        var cfg=new Lwjgl3ApplicationConfiguration();cfg.setTitle("Cursed Boxes gallery check");cfg.setWindowedMode(1280,800);cfg.useVsync(true);cfg.setForegroundFPS(60);
        new Lwjgl3Application(new ApplicationAdapter(){
            CursedBoxesScreen demo;CursedBoxesBackground background;
            float[] fixedCamera,fixedShelf;final float[][][] fixedCrates=new float[16][3][];int frames,seen,fades,loops,previous;boolean first,second,finished;
            final ByteBuffer pixel=BufferUtils.newByteBuffer(4);
            Object field(Object target,String name)throws ReflectiveOperationException{var f=target.getClass().getDeclaredField(name);f.setAccessible(true);return f.get(target);}
            @Override public void create(){try{
                demo=new CursedBoxesScreen(()->Gdx.app.exit());demo.show();
                Object renderer=field(demo,"renderer");background=(CursedBoxesBackground)field(renderer,"background");
                verifyCoverAndBlend((CursedBoxesAssets)field(demo,"assets"));verifyResolutionComposition();
                fixedCamera=((CinematicCameraController)field(demo,"camera")).camera.combined.val.clone();
                fixedShelf=((com.badlogic.gdx.math.Matrix4)field(field(renderer,"shelf"),"transform")).val.clone();
                for(int id=0;id<16;id++)for(int state=0;state<3;state++)fixedCrates[id][state]=demo.slots[id].models[state].transform.val.clone();
                if(!demo.presentationFullscreen())throw new AssertionError("Fullscreen");
            }catch(Throwable e){failure=e;Gdx.app.exit();}}
            int color(){return readColor(2,2);}
            int readColor(int x,int y){pixel.clear();Gdx.gl.glReadPixels(x,y,1,1,GL20.GL_RGBA,GL20.GL_UNSIGNED_BYTE,pixel);return (pixel.get(0)&255)<<16|(pixel.get(1)&255)<<8|(pixel.get(2)&255);}
            int draw(FrameBuffer fbo,SpriteBatch batch,CursedBoxesAssets assets,int width,int height,float time){
                fbo.begin();Gdx.gl.glDisable(GL20.GL_DEPTH_TEST);Gdx.gl.glClearColor(1,0,1,1);Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT);
                var camera=new OrthographicCamera();camera.setToOrtho(false,width,height);batch.setProjectionMatrix(camera.combined);
                var bg=new CursedBoxesBackground(assets.backgrounds,assets.lighting,new CursedBoxesBackground.Settings());bg.update(time);bg.draw(batch,width,height);bg.dispose();int color=color();
                for(int x:new int[]{1,width-2})for(int y:new int[]{1,height-2}){pixel.clear();Gdx.gl.glReadPixels(x,y,1,1,GL20.GL_RGBA,GL20.GL_UNSIGNED_BYTE,pixel);if((pixel.get(0)&255)==255&&(pixel.get(1)&255)==0&&(pixel.get(2)&255)==255)throw new AssertionError("Uncovered background corner");}
                fbo.end();return color;
            }
            void verifyCoverAndBlend(CursedBoxesAssets assets){
                SpriteBatch batch=new SpriteBatch();
                try{for(int[] size:new int[][]{{1920,1080},{2560,1440}}){
                    FrameBuffer fbo=new FrameBuffer(Pixmap.Format.RGBA8888,size[0],size[1],false);
                    try{
                        int a=draw(fbo,batch,assets,size[0],size[1],0),b=draw(fbo,batch,assets,size[0],size[1],2f),mix=draw(fbo,batch,assets,size[0],size[1],1.75f);
                        for(int shift:new int[]{0,8,16})if(Math.abs(((a>>shift&255)+(b>>shift&255))*.5f-(mix>>shift&255))>2)throw new AssertionError("Incorrect alpha crossfade");
                    }finally{fbo.dispose();}
                }}finally{batch.dispose();}
            }
            void verifyResolutionComposition(){
                var config=CursedBoxesGalleryConfig.load();var layout=new CursedBoxesRoomLayout(config);var camera=new CinematicCameraController();
                var point=new com.badlogic.gdx.math.Vector3();
                for(int[] size:new int[][]{{1920,1080},{2560,1440},{3440,1440},{1024,768}}){
                    camera.resize(size[0],size[1]);camera.update(0,0,null);layout.update(camera.camera,size[0],size[1]);
                    for(int id=0;id<16;id++)for(int dx:new int[]{-1,1})for(int dy:new int[]{-1,1}){
                        point.set(layout.origin.x+(id%4-1.5f)*2.08f+dx*.94f,layout.origin.y+(1.5f-id/4)*1.52f+dy*.62f,layout.origin.z+.42f);camera.camera.project(point,0,0,size[0],size[1]);
                        if(point.x<0||point.x>size[0]||point.y<0||point.y>size[1])throw new AssertionError("Compartment clipped at "+size[0]+"x"+size[1]);
                    }
                    if(layout.counterFrontScreenY(size[0],size[1])<=0)throw new AssertionError("Counter cropped at "+size[0]+"x"+size[1]);
                }
            }
            void verifyStaticRoom()throws ReflectiveOperationException{
                var camera=((CinematicCameraController)field(demo,"camera")).camera;
                if(!java.util.Arrays.equals(fixedCamera,camera.combined.val))throw new AssertionError("Room camera moved while aiming/firing");
                var shelf=(com.badlogic.gdx.math.Matrix4)field(field(field(demo,"renderer"),"shelf"),"transform");
                if(!java.util.Arrays.equals(fixedShelf,shelf.val))throw new AssertionError("Cabinet moved");
                for(int id=0;id<16;id++)for(int state=0;state<3;state++)if(!java.util.Arrays.equals(fixedCrates[id][state],demo.slots[id].models[state].transform.val))throw new AssertionError("Crate transform animated: "+id);
            }
            void verifySupportContact()throws ReflectiveOperationException{
                var layout=(CursedBoxesRoomLayout)field(demo,"roomLayout");
                var contacts=(com.badlogic.gdx.graphics.g3d.decals.Decal[])field(field(demo,"renderer"),"shelfContacts");
                for(int i=3;i<=4;i++){
                    var expected=new com.badlogic.gdx.math.Vector3(layout.origin.x+(i==3?CursedBoxesShelf.LEFT_FOOT_X:CursedBoxesShelf.RIGHT_FOOT_X),layout.origin.y+(i==3?CursedBoxesShelf.LEFT_FOOT_Y:CursedBoxesShelf.RIGHT_FOOT_Y),layout.origin.z-.55f);
                    if(contacts[i].getPosition().dst(expected)>.01f)throw new AssertionError("Shadow detached from support "+i);
                    if(contacts[i].getColor().a<.9f)throw new AssertionError("Missing dense contact shadow");
                }
            }
            void verifyCounterContact()throws ReflectiveOperationException{
                var gun=(ShotgunController)field(demo,"shotgun");var layout=(CursedBoxesRoomLayout)field(demo,"roomLayout");
                if(!gun.resting()||gun.contactOpacity()<.99f)throw new AssertionError("Initial table state/shadow");
                var box=new com.badlogic.gdx.math.collision.BoundingBox();float min=Float.MAX_VALUE;
                for(int i=0;i<3;i++){gun.gun.model(i).calculateBoundingBox(box);box.mul(gun.gun.model(i).transform);min=Math.min(min,box.min.y);}
                if(Math.abs(min-layout.tableAnchor.y)>.002f)throw new AssertionError("Gun floats/intersects tabletop: "+min+" vs "+layout.tableAnchor.y);
            }
            void verifyFragmentThrow()throws ReflectiveOperationException{
                var debris=field(demo,"debris");Object[] fragments=(Object[])field(debris,"fragments");int active=0;
                for(Object fragment:fragments)if((float)field(fragment,"age")<.95f){
                    active++;var p=(com.badlogic.gdx.math.Vector3)field(fragment,"p");var velocity=(com.badlogic.gdx.math.Vector3)field(fragment,"v");
                    if(velocity.z<6.79f||p.z-demo.slots[5].position.z<4.5f)throw new AssertionError("Insufficient fragment throw");
                }
                if(active!=4)throw new AssertionError("Fragment budget changed: "+active);
            }
            void verifySilhouetteAndPlacement()throws ReflectiveOperationException{
                var layout=(CursedBoxesRoomLayout)field(demo,"roomLayout");
                var camera=((CinematicCameraController)field(demo,"camera")).camera;
                float width=Gdx.graphics.getWidth(),height=Gdx.graphics.getHeight();
                float scale=CursedBoxesBackground.coverScale(width,height,1672,941);
                var point=new com.badlogic.gdx.math.Vector3(layout.origin.x,layout.origin.y+CursedBoxesShelf.RIGHT_FOOT_Y,layout.origin.z-.55f);camera.project(point);
                float floor=(941-CursedBoxesGalleryConfig.load().shelfFloorY)*scale;
                if(Math.abs(point.y-floor)>3||layout.origin.z>=0)throw new AssertionError("Cabinet is not grounded at the rear wall");
                int[][] locations={{768,20},{20,512},{1515,512},{1530,1000}};
                int[] actual=new int[4],px=new int[4],py=new int[4];
                int bw=Gdx.graphics.getBackBufferWidth(),bh=Gdx.graphics.getBackBufferHeight();
                for(int i=0;i<4;i++){
                    point.set((locations[i][0]/1536f-.5f)*10.8f+layout.origin.x,(.5f-locations[i][1]/1024f)*7.2f+layout.origin.y,layout.origin.z-.55f);camera.project(point);
                    px[i]=Math.round(point.x*bw/width);py[i]=Math.round(point.y*bh/height);actual[i]=readColor(px[i],py[i]);
                }
                FrameBuffer fbo=new FrameBuffer(Pixmap.Format.RGBA8888,bw,bh,false);SpriteBatch batch=new SpriteBatch();
                try{
                    fbo.begin();var ortho=new OrthographicCamera();ortho.setToOrtho(false,width,height);batch.setProjectionMatrix(ortho.combined);background.draw(batch,width,height);
                    for(int i=0;i<4;i++){
                        int expected=readColor(px[i],py[i]);
                        for(int shift:new int[]{0,8,16})if(Math.abs((actual[i]>>shift&255)-(expected>>shift&255))>6)throw new AssertionError("Brown shelf backdrop remains at exterior point "+i);
                    }
                    fbo.end();
                }finally{batch.dispose();fbo.dispose();}
            }
            void capture(int frame){capture("gallery-"+(frame+1));}
            void capture(String name){Pixmap p=ScreenUtils.getFrameBufferPixmap(0,0,Gdx.graphics.getBackBufferWidth(),Gdx.graphics.getBackBufferHeight());try{PixmapIO.writePNG(Gdx.files.absolute(System.getProperty("cursed.backgroundOutput")+"/"+name+".png"),p,-1,true);}finally{p.dispose();}}
            @Override public void render(){if(failure!=null||finished)return;try{
                double before=background.timeline.elapsed();demo.render(1f/60);verifyStaticRoom();int current=background.timeline.current();float alpha=background.timeline.alpha();frames++;
                if((seen&1<<current)==0&&frames>18){seen|=1<<current;capture(current);}
                if(alpha>0&&alpha<1)fades|=1<<current;
                if(previous==1&&current==0)loops++;previous=current;
                if(frames==30){verifySilhouetteAndPlacement();verifyCounterContact();verifySupportContact();capture("counter-rest");}
                if(frames==60){demo.select(5);if(!demo.fire())throw new AssertionError("First shot");first=true;}
                if(frames==80)capture("counter-pickup");
                if(frames==130){if(((ShotgunController)field(demo,"shotgun")).contactOpacity()!=0)throw new AssertionError("Shadow remained under lifted gun");capture("gallery-aim");}
                if(frames==160){verifyFragmentThrow();capture("impact-fragment-throw");}
                if(frames==240){demo.select(0);if(!demo.fire())throw new AssertionError("Second shot");second=true;}
                if(frames==390){if(demo.weaponState()!=ShotgunController.State.RESTING)throw new AssertionError("Weapon did not return to table");capture("counter-return");if(!demo.turn.ended()||!demo.ghostWounded())throw new AssertionError("Gameplay changed");}
                if(frames==400){double time=background.timeline.elapsed();demo.reset();if(background.timeline.elapsed()!=time)throw new AssertionError("Reset interrupted the background");}
                if(before==background.timeline.elapsed())throw new AssertionError("Background clock froze");
                if(Gdx.gl.glGetError()!=GL20.GL_NO_ERROR)throw new AssertionError("OpenGL error");
                if(frames>=510){if(seen!=7||fades!=7||loops<1||!first||!second)throw new AssertionError("Incomplete 1/2/3/2/1 loop");finished=true;Gdx.app.log("Theater","PASS: source gallery 1/2/3, ping-pong lighting transitions with locked geometry, clean shelf silhouette/rear-wall floor placement, 1920x1080/2560x1440 cover + pixel blend, fixed cabinet/camera/crate transforms, stronger four-fragment throw, fullscreen, firing/turn/reset continuity and GL");Gdx.app.exit();}
            }catch(Throwable e){failure=e;Gdx.app.exit();}}
            @Override public void resize(int w,int h){if(demo!=null)demo.resize(w,h);}
            @Override public void dispose(){if(!finished&&failure==null)failure=new AssertionError("Gallery check interrupted");if(demo!=null){demo.dispose();if(Texture.getNumManagedTextures()!=0)failure=new AssertionError("Texture leak");}}
        },cfg);
        if(failure!=null)throw new AssertionError("Gallery background QA",failure);
    }
}
