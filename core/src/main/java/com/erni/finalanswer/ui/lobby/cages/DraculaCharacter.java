package com.erni.finalanswer.ui.lobby.cages;

import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.g2d.Batch;
import com.badlogic.gdx.graphics.g2d.TextureRegion;
import com.badlogic.gdx.math.MathUtils;
import com.badlogic.gdx.math.Matrix4;

/** Existing cage Batch hierarchy, grounded skeleton IK, and ghost-style low-resolution cloth. */
public final class DraculaCharacter implements CageCharacter {
    // Lobby-only presentation scale; the complete rig grows uniformly around its existing anchor.
    private static final float LOBBY_SCALE = 1.14f;
    public static final float CAPE_SCALE=.072f, CAPE_WAVE=1.05f;
    private static final int CAPE_ROWS=10,CAPE_COLUMNS=6,SMOKE_COUNT=9;
    private final DraculaAssets assets;
    private final DraculaAnimator animator=new DraculaAnimator();
    private final DraculaAnimator.Pose neutral=new DraculaAnimator.Pose();
    private final ArticulatedLimb leftLeg,rightLeg;
    private final Matrix4 saved=new Matrix4(),root=new Matrix4(),torso=new Matrix4(),capeRoot=new Matrix4();
    private final Color color=new Color();
    private final float[] cloth=new float[CAPE_ROWS*CAPE_COLUMNS*20];
    private float lastTime=-1;
    public DraculaCharacter(DraculaAssets assets) {
        this.assets=assets;
        leftLeg=new ArticulatedLimb(assets.leftLeg,1024,1536,735,735,120,620,700,590,1420,.0245f);
        rightLeg=new ArticulatedLimb(assets.rightLeg,1024,1536,735,630,130,530,730,560,1420,.0245f);
    }
    public DraculaAnimator animator() { return animator; }
    public void advance(float delta,float phase,boolean reducedMotion) { animator.update(delta,phase,reducedMotion); }
    @Override public void update(float delta,float time,float phase,boolean reducedMotion) {
        lastTime=time;advance(delta,phase,reducedMotion);
    }
    @Override public void update(float time,float phase,boolean reducedMotion) {
        float delta=lastTime<0?Math.min(time,1f/30):Math.max(0,time-lastTime);
        lastTime=time;advance(delta,phase,reducedMotion);
    }
    @Override public void draw(Batch batch,float alpha) { drawAt(batch,174,68,LOBBY_SCALE,alpha); }
    public void drawAt(Batch batch,float x,float floor,float size,float alpha) {
        drawPose(batch,x,floor,size,alpha,animator.pose,false);
    }
    public void drawNeutralAt(Batch batch,float x,float floor,float size,float alpha) {
        drawPose(batch,x,floor,size,alpha,neutral,true);
    }
    private void drawPose(Batch batch,float x,float floor,float size,float alpha,DraculaAnimator.Pose p,boolean still) {
        saved.set(batch.getTransformMatrix());color.set(batch.getColor());
        root.set(saved).translate(x,floor,0).scale(size,size,1);
        batch.setTransformMatrix(root);
        float opacity=color.a*alpha;
        if(!still) smoke(batch,opacity);
        float hipY=33+p.hipY;
        torso.set(root).translate(p.hipX,hipY,0).rotate(0,0,1,p.bodyAngle).scale(p.bodyScale,p.bodyScale,1);
        capeRoot.set(torso).translate(0,34,0);
        batch.setTransformMatrix(capeRoot);batch.setColor(color.r,color.g,color.b,opacity*p.alpha);
        drawCape(batch,p,still);
        batch.setTransformMatrix(root);
        leftLeg.draw(batch,p.hipX-7,hipY,-12,3,-1);
        rightLeg.draw(batch,p.hipX+7,hipY,13,3,1);
        batch.setTransformMatrix(torso);
        // Shoulder roots sit underneath the waistcoat; body collar is the single visible collar.
        part(batch,assets.leftArm,-16,25,220,0,1015,440,.033f,p.leftArm);
        part(batch,assets.rightArm,16,25,890,0,1050,440,.033f,p.rightArm);
        part(batch,assets.body,0,0,660,1050,1261,1247,.047f,0);
        // Forearms share the exact shoulder transform, but appear in front of the waistcoat.
        part(batch,assets.leftForearm,-16,25,220,-440,1015,749,.033f,p.leftArm);
        part(batch,assets.rightForearm,16,25,890,-440,1050,698,.033f,p.rightArm);
        part(batch,assets.head,p.headX,40,760,1045,1354,1161,.057f,p.headAngle);
        batch.setTransformMatrix(saved);batch.setColor(color);
    }
    private void drawCape(Batch batch,DraculaAnimator.Pose p,boolean still) {
        TextureRegion region=assets.cape;
        Color tint=batch.getColor();
        float time=still?0:animator.motionTime();
        float feather=1-DraculaAnimator.ease(p.capeReveal,.8f,1);
        float strength=still?0:animator.motionStrength();int index=0;
        for(int row=0;row<CAPE_ROWS;row++) for(int col=0;col<CAPE_COLUMNS;col++) for(int corner=0;corner<4;corner++) {
            boolean right=corner>=2;
            float center=.5f+.07f*(1-p.capeReveal)/.75f;
            float u=center+((col+(right?1:0))/(float)CAPE_COLUMNS-.5f)*p.capeReveal;
            u=MathUtils.clamp(u,0,1);
            float v=(row+(corner==0||corner==3?1:0))/(float)CAPE_ROWS;
            float weight=Math.max(0,(v-.2f)/.8f);weight*=weight;
            float sx=(1322*u-760)*CAPE_SCALE,sy=-890*v*CAPE_SCALE;
            float wave=(MathUtils.sin(time*.8f+v*2.4f)*CAPE_WAVE
                +MathUtils.sin(time*1.3f+u*3+1.5f)*.4f)*weight*strength;
            float flutter=MathUtils.sin(time*2.3f+v*4+u*2)*p.capeFlutter*.65f*weight;
            float angle=p.capeAngle*weight,cos=MathUtils.cosDeg(angle),sin=MathUtils.sinDeg(angle);
            cloth[index++]=sx*cos-sy*sin+wave+flutter;
            cloth[index++]=sx*sin+sy*cos+MathUtils.sin(time*.63f+u*3)*.3f*weight*strength;
            float edge=(col+(right?1:0))/(float)CAPE_COLUMNS;
            float edgeAlpha=1-feather*(1-Math.min(1,Math.min(edge,1-edge)*CAPE_COLUMNS));
            cloth[index++]=Color.toFloatBits(tint.r,tint.g,tint.b,tint.a*edgeAlpha);
            cloth[index++]=region.getU()+(region.getU2()-region.getU())*u;
            cloth[index++]=region.getV()+(region.getV2()-region.getV())*v;
        }
        batch.draw(region.getTexture(),cloth,0,cloth.length);
    }
    private void smoke(Batch batch,float opacity) {
        float time=animator.elapsed();if(time>1.9f) return;
        for(int i=0;i<SMOKE_COUNT;i++) {
            float age=time-i*.065f;
            if(age<=0||age>=1.25f) continue;
            float life=age/1.25f,seed=i*2.39996f;
            float fade=DraculaAnimator.ease(life,0,.2f)*(1-DraculaAnimator.ease(life,.45f,1));
            float x=MathUtils.sin(seed)*22+MathUtils.sin(seed+age)*2;
            float y=7+(i%3)*9+age*13;
            float diameter=15+age*10+(i%2)*3;
            batch.setColor(i%2==0?.23f:.15f,.055f,.085f,opacity*fade*.28f);
            batch.draw(assets.smoke,x-diameter/2,y-diameter/2,diameter,diameter);
        }
    }
    private static void part(Batch batch,TextureRegion region,float x,float y,float px,float py,
                             float width,float height,float scale,float angle) {
        float ox=px*scale,oy=(height-py)*scale;
        batch.draw(region,x-ox,y-oy,ox,oy,width*scale,height*scale,1,1,angle);
    }
}
