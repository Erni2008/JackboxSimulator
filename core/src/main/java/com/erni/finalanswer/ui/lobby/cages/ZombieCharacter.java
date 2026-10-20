package com.erni.finalanswer.ui.lobby.cages;

import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.g2d.Batch;
import com.badlogic.gdx.graphics.g2d.TextureRegion;
import com.badlogic.gdx.math.Matrix4;

/** Same Batch hierarchy and grounded two-bone legs as the skeleton; no private rendering engine. */
public final class ZombieCharacter implements CageCharacter {
    // Lobby-only presentation scale; the complete rig grows uniformly around its existing anchor.
    private static final float LOBBY_SCALE = 1.07f;
    private final ZombieAssets assets;
    private final ZombieAnimator animator = new ZombieAnimator();
    private final ArticulatedLimb leftLeg, rightLeg;
    private final Matrix4 saved = new Matrix4(), root = new Matrix4(), torso = new Matrix4();
    private final Color color = new Color();
    private float lastTime = -1;
    public ZombieCharacter(ZombieAssets assets) {
        this.assets=assets;
        leftLeg=new ArticulatedLimb(assets.leftLeg,930,1691,740,460,125,545,700,530,1580,.036f);
        rightLeg=new ArticulatedLimb(assets.rightLeg,1024,1536,645,560,80,660,630,420,1460,.039f);
    }
    public ZombieAnimator animator() { return animator; }
    public void advance(float delta,float phase,boolean reducedMotion) { animator.update(delta,phase,reducedMotion); }
    @Override public void update(float time,float phase,boolean reducedMotion) {
        float delta=lastTime<0?Math.min(time,1f/30):Math.max(0,time-lastTime);
        lastTime=time; advance(delta,phase,reducedMotion);
    }
    @Override public void update(float delta,float time,float phase,boolean reducedMotion) {
        lastTime=time; advance(delta,phase,reducedMotion);
    }
    @Override public void draw(Batch batch,float alpha) { drawAt(batch,174,68,LOBBY_SCALE,alpha); }
    public void drawAt(Batch batch,float x,float floor,float size,float alpha) {
        drawPose(batch,x,floor,size,alpha,animator.pose);
    }
    /** Static rig inspection before applying any animation. */
    public void drawNeutralAt(Batch batch,float x,float floor,float size,float alpha) {
        drawPose(batch,x,floor,size,alpha,neutral);
    }
    private final ZombieAnimator.Pose neutral = new ZombieAnimator.Pose();
    private void drawPose(Batch batch,float x,float floor,float size,float alpha,ZombieAnimator.Pose p) {
        saved.set(batch.getTransformMatrix()); color.set(batch.getColor());
        root.set(saved).translate(x,floor,0).scale(size,size,1);
        batch.setTransformMatrix(root); batch.setColor(color.r,color.g,color.b,color.a*alpha);
        float hipY=55+p.hipY, hipX=p.hipX;
        // Feet are fixed in root space. Hip motion bends the knees rather than sliding the feet.
        leftLeg.draw(batch,hipX-8,hipY+p.leftBalance,-12,4,-1);
        rightLeg.draw(batch,hipX+8,hipY+p.rightBalance,13,4,1);
        torso.set(root).translate(hipX,hipY,0).rotate(0,0,1,p.bodyAngle).scale(p.bodyScale,p.bodyScale,1);
        batch.setTransformMatrix(torso);
        // Shoulder caps and hip roots overlap behind the torso; head covers the open neck.
        part(batch,assets.leftArm,-16,32+p.leftLift,615,105,930,1691,.033f,p.leftArm);
        part(batch,assets.rightArm,16,33+p.rightLift,405,110,930,1691,.033f,p.rightArm);
        part(batch,assets.body,0,0,520,1190,1024,1536,.043f,0);
        part(batch,assets.head,1,40,650,1110,1286,1223,.043f,p.headAngle);
        batch.setTransformMatrix(saved); batch.setColor(color);
    }
    private static void part(Batch batch,TextureRegion region,float x,float y,float px,float py,
                             float width,float height,float scale,float angle) {
        float ox=px*scale,oy=(height-py)*scale;
        batch.draw(region,x-ox,y-oy,ox,oy,width*scale,height*scale,1,1,angle);
    }
}
