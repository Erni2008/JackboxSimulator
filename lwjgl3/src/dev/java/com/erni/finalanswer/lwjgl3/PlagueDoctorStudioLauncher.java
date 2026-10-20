package com.erni.finalanswer.lwjgl3;

import com.badlogic.gdx.*;
import com.badlogic.gdx.backends.lwjgl3.*;
import com.badlogic.gdx.graphics.PixmapIO;
import com.badlogic.gdx.graphics.g2d.*;
import com.badlogic.gdx.utils.ScreenUtils;
import com.badlogic.gdx.utils.viewport.FitViewport;
import com.erni.finalanswer.ui.UiFonts;
import com.erni.finalanswer.ui.lobby.cages.*;

/** Original PNG assembly and eight appearance beats, without gate occlusion. */
public final class PlagueDoctorStudioLauncher {
    public static void main(String[] args) {
        if(StartupHelper.startNewJvmIfRequired()) return;
        var config=new Lwjgl3ApplicationConfiguration();
        config.setTitle("PlagueDoctor studio — N neutral / R reappear / ESC close");
        config.setWindowedMode(1440,900); config.disableAudio(true); config.setForegroundFPS(60);
        new Lwjgl3Application(new ApplicationAdapter() {
            AttachmentBatch batch; BitmapFont font; PlagueDoctorAssets assets; PlagueDoctorCharacter[] plagueDoctors;
            final FitViewport viewport=new FitViewport(1440,900);
            final boolean check=Boolean.getBoolean("plagueDoctor.studio.check");
            float elapsed; int shot; boolean neutral=true;
            final float[] captures={.016f,.28f,.75f,1.25f,1.75f,2.25f,2.85f,3.3f,4.05f,8,15};
            @Override public void create() { batch=new AttachmentBatch(); font=UiFonts.body(22); assets=new PlagueDoctorAssets(); reset(); }
            void reset() { plagueDoctors=new PlagueDoctorCharacter[8]; for(int i=0;i<8;i++) plagueDoctors[i]=new PlagueDoctorCharacter(assets); elapsed=0; }
            @Override public void render() {
                float dt=check?1f/60:Math.min(.1f,Gdx.graphics.getDeltaTime());
                if(Gdx.input.isKeyJustPressed(Input.Keys.R)) { reset(); neutral=false; }
                if(Gdx.input.isKeyJustPressed(Input.Keys.N)) neutral=!neutral;
                if(Gdx.input.isKeyJustPressed(Input.Keys.ESCAPE)) Gdx.app.exit();
                elapsed+=dt;
                ScreenUtils.clear(.065f,.075f,.09f,1); viewport.apply();
                batch.setProjectionMatrix(viewport.getCamera().combined); batch.begin();
                for(int i=0;i<8;i++) {
                    if(!neutral || check&&shot>0) plagueDoctors[i].advance(dt,i*2.39996f,false);
                    float x=i==0?345:850+(i%3)*190, y=i==0?125:100+(i/3)*235, scale=i==0?4.2f:1.2f;
                    batch.inspect=check&&(!neutral||shot>0);
                    if(batch.inspect) batch.expect(assets,plagueDoctors[i].animator().pose,x,y,scale);
                    float oldColor=batch.getPackedColor();int src=batch.getBlendSrcFunc(),dst=batch.getBlendDstFunc();
                    int srcA=batch.getBlendSrcFuncAlpha(),dstA=batch.getBlendDstFuncAlpha();
                    if(neutral && (!check||shot==0)) plagueDoctors[i].drawNeutralAt(batch,x,y,scale,1);
                    else plagueDoctors[i].drawAt(batch,x,y,scale,1);
                    if(check&&(oldColor!=batch.getPackedColor()||src!=batch.getBlendSrcFunc()||dst!=batch.getBlendDstFunc()
                        ||srcA!=batch.getBlendSrcFuncAlpha()||dstA!=batch.getBlendDstFuncAlpha()))
                        throw new AssertionError("Character leaked Batch state");
                    batch.inspect=false;
                }
                font.draw(batch,"PLAGUE DOCTOR / "+(neutral&&(!check||shot==0)?"NEUTRAL":plagueDoctors[0].animator().state())+"     N neutral   R reappear",40,855);
                font.draw(batch,"Nine approved PNGs / hand-mounted lantern / fixed-step pendulum / warm light",40,52);
                batch.end();
                if(check&&shot<captures.length&&elapsed>=captures[shot]) {
                    var pixels=ScreenUtils.getFrameBufferPixmap(0,0,Gdx.graphics.getBackBufferWidth(),Gdx.graphics.getBackBufferHeight());
                    PixmapIO.writePNG(Gdx.files.absolute(System.getProperty("plagueDoctor.output")+"/studio-"+shot+".png"),pixels,-1,true);
                    pixels.dispose();shot++;
                    if(shot==captures.length) {
                        if(batch.rings<100||batch.lights<100) throw new AssertionError("Attachment checks did not execute");
                        System.out.println("PASS: actual lantern ring and moving glow anchors, Batch state restoration, neutral rig and eight-phase appearance");
                        Gdx.app.exit();
                    }
                }
            }
            @Override public void resize(int w,int h) { viewport.update(w,h,true); }
            @Override public void dispose() { batch.dispose();font.dispose();assets.dispose(); }
        },config);
    }
    private static final class AttachmentBatch extends SpriteBatch {
        boolean inspect; int rings,lights;
        com.badlogic.gdx.graphics.Texture lanternTexture,radialTexture;
        final com.badlogic.gdx.math.Vector3 point=new com.badlogic.gdx.math.Vector3();
        float handX,handY,lightX,lightY;
        void expect(PlagueDoctorAssets assets,PlagueDoctorAnimator.Pose p,float x,float y,float size) {
            lanternTexture=assets.lantern.region().getTexture();radialTexture=assets.radial.getTexture();
            handX=x+p.handX*size;handY=y+p.handY*size;
            double angle=Math.toRadians(p.lanternAngle);
            float fx=(PlagueDoctorRig.FLAME_X-PlagueDoctorRig.RING_X)*PlagueDoctorRig.LANTERN_SCALE*p.bodyScale;
            float fy=(PlagueDoctorRig.RING_Y-PlagueDoctorRig.FLAME_Y)*PlagueDoctorRig.LANTERN_SCALE*p.bodyScale;
            lightX=handX+(float)(fx*Math.cos(angle)-fy*Math.sin(angle))*size;
            lightY=handY+(float)(fx*Math.sin(angle)+fy*Math.cos(angle))*size;
        }
        @Override public void draw(TextureRegion r,float x,float y,float ox,float oy,float w,float h,float sx,float sy,float rotation) {
            if(inspect&&r.getTexture()==lanternTexture) {
                point.set(x+ox,y+oy,0).mul(getTransformMatrix());
                if(Math.abs(point.x-handX)>.03f||Math.abs(point.y-handY)>.03f)
                    throw new AssertionError("Lantern ring detached from the actual hand transform: "+(point.x-handX)+", "+(point.y-handY));
                rings++;
            }
            super.draw(r,x,y,ox,oy,w,h,sx,sy,rotation);
        }
        @Override public void draw(TextureRegion r,float x,float y,float w,float h) {
            if(inspect&&r.getTexture()==radialTexture&&w==58) {
                point.set(x+w/2,y+h/2,0).mul(getTransformMatrix());
                if(Math.abs(point.x-lightX)>.03f||Math.abs(point.y-lightY)>.03f)
                    throw new AssertionError("Glow detached from lantern flame: "+(point.x-lightX)+", "+(point.y-lightY));
                lights++;
            }
            super.draw(r,x,y,w,h);
        }
    }

}
