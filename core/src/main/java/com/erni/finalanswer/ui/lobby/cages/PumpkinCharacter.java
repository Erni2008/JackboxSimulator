package com.erni.finalanswer.ui.lobby.cages;

import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.GL20;
import com.badlogic.gdx.graphics.g2d.Batch;
import com.badlogic.gdx.graphics.g2d.TextureRegion;
import com.badlogic.gdx.math.MathUtils;
import com.badlogic.gdx.math.Matrix4;

/** Existing cage character contract, grounded IK and parent-local costume/head hierarchy. */
public final class PumpkinCharacter implements CageCharacter {
    public static final float HEAD_SCALE=.05f, BODY_SCALE=.052f, STEM_SCALE=.05f;
    private final PumpkinAssets assets;
    private final PumpkinAnimator animator;
    private final PumpkinAnimator.Pose neutral=new PumpkinAnimator.Pose();
    private final GroundedLeg leftLeg,rightLeg;
    private final Matrix4 saved=new Matrix4(),root=new Matrix4(),torso=new Matrix4(),headRoot=new Matrix4();
    private final Color color=new Color();
    private float lastTime=-1;
    public PumpkinCharacter(PumpkinAssets assets) {this(assets,new PumpkinAnimator());}
    public PumpkinCharacter(PumpkinAssets assets,long seed) {this(assets,new PumpkinAnimator(seed));}
    private PumpkinCharacter(PumpkinAssets assets,PumpkinAnimator animator) {
        this.assets=assets;this.animator=animator;
        leftLeg=new GroundedLeg(assets.leftLeg.region(),1328,1184,660,920,850,80,700,660,550,950,.033f);
        rightLeg=new GroundedLeg(assets.rightLeg.region(),1350,1165,630,915,600,80,850,630,960,945,.033f);
    }
    public PumpkinAnimator animator() {return animator;}
    public void advance(float delta,float phase,boolean reducedMotion) {animator.update(delta,phase,reducedMotion);}
    @Override public void update(float delta,float time,float phase,boolean reducedMotion) {lastTime=time;advance(delta,phase,reducedMotion);}
    @Override public void update(float time,float phase,boolean reducedMotion) {
        float delta=lastTime<0?Math.min(time,1f/30):Math.max(0,time-lastTime);lastTime=time;advance(delta,phase,reducedMotion);
    }
    @Override public void draw(Batch batch,float alpha) {drawAt(batch,174,68,1,alpha);}
    public void drawAt(Batch batch,float x,float floor,float size,float alpha) {drawPose(batch,x,floor,size,alpha,animator.pose,false);}
    public void drawNeutralAt(Batch batch,float x,float floor,float size,float alpha) {drawPose(batch,x,floor,size,alpha,neutral,true);}
    private void drawPose(Batch batch,float x,float floor,float size,float alpha,PumpkinAnimator.Pose p,boolean still) {
        saved.set(batch.getTransformMatrix());color.set(batch.getColor());
        root.set(saved).translate(x,floor,0).scale(size,size,1);batch.setTransformMatrix(root);
        float opacity=alpha*color.a;
        if(!still) particles(batch,opacity);
        batch.setColor(color.r,color.g,color.b,opacity*p.alpha);
        float hip=36+p.hipY;
        leftLeg.draw(batch,p.hipX-8,hip,-15,8,1);rightLeg.draw(batch,p.hipX+8,hip,15,8,-1);
        torso.set(root).translate(p.hipX,hip,0).rotate(0,0,1,p.bodyAngle).scale(p.bodyScale,p.bodyScale,1);
        batch.setTransformMatrix(torso);
        part(batch,assets.leftArm,-20,34,1100,150,.03f,p.leftArm);
        part(batch,assets.rightArm,20,34,220,150,.03f,p.rightArm);
        part(batch,assets.body,0,0,630,1100,BODY_SCALE,0);
        headRoot.set(torso).translate(0,40,0).rotate(0,0,1,p.headAngle).scale(p.headScale,p.headScale,1);
        batch.setTransformMatrix(headRoot);
        part(batch,assets.head,0,0,720,1010,HEAD_SCALE,0);
        part(batch,assets.stem,-1,45.5f,465,295,STEM_SCALE,p.stemAngle);
        batch.setTransformMatrix(headRoot);
        int src=batch.getBlendSrcFunc(),dst=batch.getBlendDstFunc(),srcA=batch.getBlendSrcFuncAlpha(),dstA=batch.getBlendDstFuncAlpha();
        batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);
        batch.setColor(1,.92f,.7f,opacity*p.alpha*MathUtils.clamp(p.eyes*.94f,0,1));
        batch.draw(assets.eyes,-720*HEAD_SCALE,(1010-1103)*HEAD_SCALE,1426*HEAD_SCALE,1103*HEAD_SCALE);
        batch.setColor(1,.85f,.56f,opacity*p.alpha*MathUtils.clamp(p.mouth*.94f,0,1));
        batch.draw(assets.mouth,-720*HEAD_SCALE,(1010-1103)*HEAD_SCALE,1426*HEAD_SCALE,1103*HEAD_SCALE);
        batch.setBlendFunctionSeparate(src,dst,srcA,dstA);
        batch.setTransformMatrix(saved);batch.setColor(color);
    }
    private static void part(Batch batch,PumpkinAssets.Part p,float x,float y,float px,float py,float scale,float angle) {
        float ox=(px-p.x())*scale,oy=(p.y()+p.height()-py)*scale;
        batch.draw(p.region(),x-ox,y-oy,ox,oy,p.width()*scale,p.height()*scale,1,1,angle);
    }
    /** Existing two-bone solver plus a stationary foot region: breathing never tips the soles. */
    private static final class GroundedLeg {
        private final TextureRegion upper,shin,foot;
        private final float width,upperHeight,shinHeight,footHeight,scale,rx,ry,kx,ky,ax,ay,upperAngle,shinAngle,l1,l2;
        private final int kneeCut,ankleCut;
        private final TwoBonePose pose=new TwoBonePose();
        GroundedLeg(TextureRegion source,int width,int height,int kneeCut,int ankleCut,float rx,float ry,float kx,float ky,float ax,float ay,float scale) {
            this.width=width;this.kneeCut=kneeCut;this.ankleCut=ankleCut;this.scale=scale;
            this.rx=rx;this.ry=ry;this.kx=kx;this.ky=ky;this.ax=ax;this.ay=ay;
            upperHeight=kneeCut+24;shinHeight=ankleCut-kneeCut+48;footHeight=height-ankleCut+24;
            upper=new TextureRegion(source.getTexture(),0,0,width,(int)upperHeight);
            shin=new TextureRegion(source.getTexture(),0,kneeCut-24,width,(int)shinHeight);
            foot=new TextureRegion(source.getTexture(),0,ankleCut-24,width,(int)footHeight);
            upperAngle=MathUtils.atan2(-(ky-ry),kx-rx)*MathUtils.radiansToDegrees;
            shinAngle=MathUtils.atan2(-(ay-ky),ax-kx)*MathUtils.radiansToDegrees;
            l1=(float)Math.hypot(kx-rx,ky-ry)*scale;l2=(float)Math.hypot(ax-kx,ay-ky)*scale;
        }
        void draw(Batch b,float x,float y,float targetX,float targetY,float bend) {
            pose.solve(x,y,targetX,targetY,l1,l2,bend);
            segment(b,foot,pose.endX,pose.endY,ax,footHeight-(ay-ankleCut+24),footHeight,0);
            segment(b,shin,pose.jointX,pose.jointY,kx,shinHeight-(ky-kneeCut+24),shinHeight,
                MathUtils.atan2(pose.endY-pose.jointY,pose.endX-pose.jointX)*MathUtils.radiansToDegrees-shinAngle);
            segment(b,upper,x,y,rx,upperHeight-ry,upperHeight,
                MathUtils.atan2(pose.jointY-y,pose.jointX-x)*MathUtils.radiansToDegrees-upperAngle);
        }
        private void segment(Batch b,TextureRegion region,float x,float y,float ox,float oy,float height,float angle) {
            ox*=scale;oy*=scale;b.draw(region,x-ox,y-oy,ox,oy,width*scale,height*scale,1,1,angle);
        }
    }
    private void particles(Batch batch,float opacity) {
        float time=animator.elapsed();if(time>2.8f) return;
        for(int i=0;i<6;i++) {
            float age=time-i*.065f;if(age<0||age>1.5f) continue;
            float fade=PumpkinAnimator.ease(age,0,.2f)*(1-PumpkinAnimator.ease(age,.7f,1.5f));
            float diameter=15+age*9;
            batch.setColor(.09f,.065f,.045f,opacity*fade*.42f);
            batch.draw(assets.smoke,MathUtils.sin(i*2.4f)*20-diameter/2,12+(i%3)*10+age*15-diameter/2,diameter,diameter);
        }
        int src=batch.getBlendSrcFunc(),dst=batch.getBlendDstFunc(),srcA=batch.getBlendSrcFuncAlpha(),dstA=batch.getBlendDstFuncAlpha();
        batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);
        for(int i=0;i<24;i++) {
            boolean burst=i>=14;float age=time-(burst?1.52f+(i-14)*.012f:i*.027f);
            float life=burst?.7f:1.25f;if(age<0||age>life) continue;
            float fade=PumpkinAnimator.ease(age,0,.07f)*(1-PumpkinAnimator.ease(age,life*.45f,life));
            float seed=i*2.39996f,px=MathUtils.sin(seed)*(burst?20:27),py=burst?107:12+(i%6)*13;
            px+=MathUtils.sin(seed+.4f)*age*(burst?16:3);py+=age*(burst?18:17);
            float diameter=burst?2.4f:1.8f;
            batch.setColor(1,.37f+(i%3)*.1f,.055f,opacity*fade*.85f);
            batch.draw(assets.smoke,px-diameter/2,py-diameter/2,diameter,diameter);
        }
        batch.setBlendFunctionSeparate(src,dst,srcA,dstA);
    }
}
