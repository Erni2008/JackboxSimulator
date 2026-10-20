package com.erni.finalanswer.ui.lobby.cages;

import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.GL20;
import com.badlogic.gdx.graphics.g2d.Batch;
import com.badlogic.gdx.graphics.g2d.TextureRegion;
import com.badlogic.gdx.math.MathUtils;
import com.badlogic.gdx.math.Matrix4;

/** Nine-part rig in the existing cage Batch: fixed feet, neck-parented hat, hand-parented lantern. */
public final class PlagueDoctorCharacter implements CageCharacter {
    private static final float LOBBY_SCALE=1.32f;
    /** Base material exposure; readability is calibrated separately for mask, cloth and hat. Lantern intensity is independent. */
    public static float plagueDoctorBrightness=.65f;
    /** Material groups retain their source shadows; only the mask gets the larger readability lift. */
    public static float plagueDoctorClothReadability=1.08f,plagueDoctorMaskReadability=1.20f,plagueDoctorMetalReadability=1.10f;
    /** Independent lantern exposure; never applied to the character sprites. */
    public static float plagueDoctorLanternBrightness=3.6f;
    public static final float HEAD_SCALE=.052f,BODY_SCALE=.046f,HAT_SCALE=.047f,ROBE_SCALE=.053f;
    private static final float FREE_SCALE=.038f;
    private static final float UPPER_LENGTH=(float)Math.hypot(420,280)*FREE_SCALE;
    private static final float LOWER_LENGTH=(float)Math.hypot(440,100)*FREE_SCALE;
    private static final float UPPER_REST=MathUtils.atan2(-280,420)*MathUtils.radiansToDegrees;
    private static final float LOWER_REST=MathUtils.atan2(100,440)*MathUtils.radiansToDegrees;
    private final PlagueDoctorAssets assets;
    private final PlagueDoctorAnimator animator;
    private final PlagueDoctorAnimator.Pose neutral=new PlagueDoctorAnimator.Pose();
    private final ArticulatedLimb leftLeg,rightLeg;
    private final TwoBonePose freePose=new TwoBonePose();
    private final Matrix4 saved=new Matrix4(),root=new Matrix4(),inverseRoot=new Matrix4(),torso=new Matrix4();
    private final Matrix4 head=new Matrix4(),rightArm=new Matrix4(),lantern=new Matrix4(),robe=new Matrix4(),relative=new Matrix4();
    private final Color color=new Color();
    private final float[] cloth=new float[8*4*20];
    private float lastTime=-1,lightX,lightY,opacity;
    public PlagueDoctorCharacter(PlagueDoctorAssets assets) {this(assets,new PlagueDoctorAnimator());}
    public PlagueDoctorCharacter(PlagueDoctorAssets assets,long seed) {this(assets,new PlagueDoctorAnimator(seed));}
    private PlagueDoctorCharacter(PlagueDoctorAssets assets,PlagueDoctorAnimator animator) {
        this.assets=assets;this.animator=animator;
        leftLeg=new ArticulatedLimb(assets.leftLeg.region(),1042,1510,710,620,120,550,700,560,1430,.03f);
        rightLeg=new ArticulatedLimb(assets.rightLeg.region(),1050,1498,710,500,115,580,690,560,1420,.03f);
        PlagueDoctorRig.locateHand(neutral);
    }
    public PlagueDoctorAnimator animator() {return animator;}
    public void advance(float delta,float phase,boolean reducedMotion) {animator.update(delta,phase,reducedMotion);}
    @Override public void update(float delta,float time,float phase,boolean reducedMotion) {lastTime=time;advance(delta,phase,reducedMotion);}
    @Override public void update(float time,float phase,boolean reducedMotion) {
        float delta=lastTime<0?Math.min(time,1f/30):Math.max(0,time-lastTime);lastTime=time;advance(delta,phase,reducedMotion);
    }
    @Override public void draw(Batch batch,float alpha) {drawAt(batch,170,62,LOBBY_SCALE,alpha);}
    public void drawAt(Batch batch,float x,float floor,float size,float alpha) {drawPose(batch,x,floor,size,alpha,animator.pose,false);}
    public void drawNeutralAt(Batch batch,float x,float floor,float size,float alpha) {drawPose(batch,x,floor,size,alpha,neutral,true);}
    private void drawPose(Batch batch,float x,float floor,float size,float alpha,PlagueDoctorAnimator.Pose p,boolean still) {
        saved.set(batch.getTransformMatrix());color.set(batch.getColor());
        var materialShader=batch.getShader();
        int src=batch.getBlendSrcFunc(),dst=batch.getBlendDstFunc(),srcA=batch.getBlendSrcFuncAlpha(),dstA=batch.getBlendDstFuncAlpha();
        root.set(saved).translate(x,floor,0).scale(size,size,1);inverseRoot.set(root).inv();
        opacity=color.a*alpha;
        float hip=PlagueDoctorRig.HIP_HEIGHT+p.hipY;
        torso.set(root).translate(p.hipX,hip,0).rotate(0,0,1,p.bodyAngle).scale(p.bodyScale,p.bodyScale,1);
        rightArm.set(torso).translate(PlagueDoctorRig.RIGHT_SHOULDER_X,PlagueDoctorRig.RIGHT_SHOULDER_Y,0).rotate(0,0,1,p.rightArm);
        lantern.set(rightArm).translate(PlagueDoctorRig.GRIP_X,PlagueDoctorRig.GRIP_Y,0)
            .rotate(0,0,1,p.lanternAngle-p.bodyAngle-p.rightArm);
        // Derive illumination from the exact rendering transform, including parent rotation and scale.
        relative.set(inverseRoot).mul(lantern);
        float fx=(PlagueDoctorRig.FLAME_X-PlagueDoctorRig.RING_X)*PlagueDoctorRig.LANTERN_SCALE;
        float fy=(PlagueDoctorRig.RING_Y-PlagueDoctorRig.FLAME_Y)*PlagueDoctorRig.LANTERN_SCALE;
        float[] matrix=relative.val;
        lightX=matrix[Matrix4.M00]*fx+matrix[Matrix4.M01]*fy+matrix[Matrix4.M03];
        lightY=matrix[Matrix4.M10]*fx+matrix[Matrix4.M11]*fy+matrix[Matrix4.M13];
        batch.setTransformMatrix(root);
        batch.setShader(null); // Lantern emission retains its original rendering.
        batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);
        batch.setColor(1,.37f,.08f,opacity*MathUtils.clamp(p.light*.18f*plagueDoctorLanternBrightness,0,1));
        batch.draw(assets.radial,lightX-29,lightY-29,58,58);
        batch.setBlendFunctionSeparate(src,dst,srcA,dstA);
        batch.setShader(materialShader);
        characterTint(batch,plagueDoctorClothReadability,opacity*p.alpha);
        leftLeg.draw(batch,p.hipX-8,hip,-14,3,-1);rightLeg.draw(batch,p.hipX+8,hip,14,3,1);
        robe.set(torso).translate(0,8,0);batch.setTransformMatrix(robe);drawRobe(batch,p,still);
        batch.setTransformMatrix(rightArm);
        part(batch,assets.rightArm,0,0,PlagueDoctorRig.RIGHT_PIVOT_X,PlagueDoctorRig.RIGHT_PIVOT_Y,PlagueDoctorRig.ARM_SCALE,0);
        batch.setTransformMatrix(torso);
        float shoulderY=25+6*p.hatAdjust;
        freePose.solve(-16,shoulderY,p.freeX,p.freeY,UPPER_LENGTH,LOWER_LENGTH,-1);
        float upperAngle=MathUtils.atan2(freePose.jointY-shoulderY,freePose.jointX+16)*MathUtils.radiansToDegrees
            -UPPER_REST;
        float lowerAngle=MathUtils.atan2(freePose.endY-freePose.jointY,freePose.endX-freePose.jointX)*MathUtils.radiansToDegrees
            -LOWER_REST;
        part(batch,assets.freeLower,freePose.jointX,freePose.jointY,720,540,FREE_SCALE,lowerAngle);
        part(batch,assets.freeUpper,-16,shoulderY,300,260,FREE_SCALE,upperAngle);
        part(batch,assets.body,0,0,600,780,BODY_SCALE,0);
        head.set(torso).translate(PlagueDoctorRig.NECK_X+p.headX,PlagueDoctorRig.NECK_Y,0).rotate(0,0,1,p.headAngle);
        batch.setTransformMatrix(head);
        characterTint(batch,plagueDoctorMaskReadability,opacity*p.alpha);
        part(batch,assets.head,0,0,790,1000,HEAD_SCALE,0);
        // The foreground mantle covers the scarf root, giving the mask a seated neck joint.
        batch.setTransformMatrix(torso);
        characterTint(batch,plagueDoctorClothReadability,opacity*p.alpha);
        part(batch,assets.collar,0,0,600,780,BODY_SCALE,0);
        // Wrist/hand stay on the same forearm bone. Only the hand passes in front of the portrait.
        part(batch,assets.freeHand,freePose.jointX,freePose.jointY,720,540,FREE_SCALE,lowerAngle);
        batch.setTransformMatrix(head);
        characterTint(batch,plagueDoctorMetalReadability,opacity*p.alpha);
        part(batch,assets.hat,0,40,780,850,HAT_SCALE,p.hatAngle);
        batch.setShader(null);
        batch.setTransformMatrix(lantern);batch.setColor(color.r,color.g,color.b,opacity*p.alpha);
        part(batch,assets.lantern,0,0,PlagueDoctorRig.RING_X,PlagueDoctorRig.RING_Y,PlagueDoctorRig.LANTERN_SCALE,0);
        batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);
        batch.setColor(1,1,1,opacity*p.alpha*MathUtils.clamp(p.fire*.38f*plagueDoctorLanternBrightness,0,1));
        float scale=PlagueDoctorRig.LANTERN_SCALE;
        batch.draw(assets.fire,-PlagueDoctorRig.RING_X*scale,(PlagueDoctorRig.RING_Y-assets.lantern.height())*scale,
            assets.lantern.width()*scale,assets.lantern.height()*scale);
        // A second warm emission pass adds radiance after the original pass reaches alpha one.
        batch.setColor(1,.77f,.34f,opacity*p.alpha*MathUtils.clamp(p.fire*.20f*plagueDoctorLanternBrightness,0,1));
        batch.draw(assets.fire,-PlagueDoctorRig.RING_X*scale,(PlagueDoctorRig.RING_Y-assets.lantern.height())*scale,
            assets.lantern.width()*scale,assets.lantern.height()*scale);
        batch.setColor(1,.48f,.07f,opacity*MathUtils.clamp(p.fire*.12f*plagueDoctorLanternBrightness,0,1));
        float flameX=(PlagueDoctorRig.FLAME_X-PlagueDoctorRig.RING_X)*scale;
        float flameY=(PlagueDoctorRig.RING_Y-PlagueDoctorRig.FLAME_Y)*scale;
        batch.draw(assets.radial,flameX-3.5f,flameY-5,7,10);
        if(!still) for(int i=0;i<3;i++) {
            float age=(animator.elapsed()*.4f+i*.37f)%1,fade=MathUtils.sin(age*MathUtils.PI);
            batch.setColor(1,.53f,.13f,opacity*p.alpha*fade*MathUtils.clamp(p.fire*.42f*plagueDoctorLanternBrightness,0,1));
            batch.draw(assets.radial,flameX+MathUtils.sin(i*2.4f+age)*1.5f,flameY+age*5,.55f,.85f);
        }
        batch.setBlendFunctionSeparate(src,dst,srcA,dstA);
        batch.setTransformMatrix(saved);batch.setColor(color);batch.setShader(materialShader);
    }
    private void characterTint(Batch batch,float material,float alpha) {
        float value=MathUtils.clamp(plagueDoctorBrightness*material,0,1);
        batch.setColor(color.r*value,color.g*value,color.b*value,alpha);
    }
    private void part(Batch batch,PlagueDoctorAssets.Part p,float x,float y,float px,float py,float scale,float angle) {
        float ox=(px-p.x())*scale,oy=(p.y()+p.height()-py)*scale;
        batch.draw(p.region(),x-ox,y-oy,ox,oy,p.width()*scale,p.height()*scale,1,1,angle);
    }
    private void drawRobe(Batch batch,PlagueDoctorAnimator.Pose p,boolean still) {
        TextureRegion region=assets.robe.region();int index=0;float t=still?0:animator.motionTime(),strength=still?0:animator.motionStrength();
        float packed=batch.getColor().toFloatBits();
        for(int row=0;row<8;row++) for(int col=0;col<4;col++) for(int corner=0;corner<4;corner++) {
            float u=(col+(corner>=2?1:0))/4f,v=(row+(corner==0||corner==3?1:0))/8f;
            float weight=Math.max(0,(v-.22f)/.78f);weight*=weight;
            float x=(u*1697-770)*ROBE_SCALE,y=(80-v*927)*ROBE_SCALE;
            float a=p.robeAngle*weight,c=MathUtils.cosDeg(a),s=MathUtils.sinDeg(a);
            cloth[index++]=x*c-y*s+MathUtils.sin(t*.83f+v*3+u)*.55f*weight*strength;
            cloth[index++]=x*s+y*c;cloth[index++]=packed;
            cloth[index++]=region.getU()+(region.getU2()-region.getU())*u;
            cloth[index++]=region.getV()+(region.getV2()-region.getV())*v;
        }
        batch.draw(region.getTexture(),cloth,0,cloth.length);
    }
}
