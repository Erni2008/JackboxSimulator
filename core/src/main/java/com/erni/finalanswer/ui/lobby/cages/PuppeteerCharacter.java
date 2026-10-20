package com.erni.finalanswer.ui.lobby.cages;

import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.GL20;
import com.badlogic.gdx.graphics.g2d.Batch;
import com.badlogic.gdx.graphics.g2d.TextureRegion;
import com.badlogic.gdx.math.Matrix4;

/** A regular CageCharacter; shared immutable art, independent rig, scheduler, eyes and cord state. */
public final class PuppeteerCharacter implements CageCharacter {
    private final PuppeteerAssets assets;private final PuppeteerConfig config;
    private final PuppeteerAnimator animator;private final PuppeteerSkeleton skeleton;private final PuppeteerStrings strings;
    private final Matrix4 saved=new Matrix4(),root=new Matrix4(),draw=new Matrix4();private final Color savedColor=new Color();
    private float lastTime=-1,hair,hairVelocity,lastHead;
    public PuppeteerCharacter(PuppeteerAssets assets,PuppeteerConfig config){this(assets,config,new java.util.Random().nextLong());}
    public PuppeteerCharacter(PuppeteerAssets assets,PuppeteerConfig config,long seed){this.assets=assets;this.config=config;animator=new PuppeteerAnimator(config,seed);skeleton=new PuppeteerSkeleton(config);strings=new PuppeteerStrings(config,skeleton);skeleton.update(animator.pose);strings.update(0,0);lastHead=animator.pose[PuppeteerAnimator.HEAD];}
    public PuppeteerAnimator animator(){return animator;}public PuppeteerSkeleton skeleton(){return skeleton;}public PuppeteerStrings strings(){return strings;}public PuppeteerConfig configuration(){return config;}
    public void advance(float delta,float phase,boolean reduced){
        if(!Float.isFinite(delta)||delta<0)return;float left=delta;
        do{float step=Math.min(left,1f/120);animator.update(step,phase,reduced);
            // Damped secondary response; the fabric anchor itself never moves away from the head.
            float goal=animator.pose[PuppeteerAnimator.HAIR],head=animator.pose[PuppeteerAnimator.HEAD];
            if(step>0){hairVelocity+=(goal-hair)*65*step-hairVelocity*15*step;hairVelocity-=(head-lastHead)*.18f;hair+=hairVelocity*step;lastHead=head;}
            skeleton.update(animator.pose);skeleton.bone("hair").world.rotate(0,0,1,hair-goal);strings.update(step,animator.motionTime());left-=step;
        }while(left>.000001f);
    }
    @Override public void update(float delta,float time,float phase,boolean reduced){lastTime=time;advance(delta,phase,reduced);}
    @Override public void update(float time,float phase,boolean reduced){float delta=lastTime<0?Math.min(time,1f/30):Math.max(0,time-lastTime);update(delta,time,phase,reduced);}
    @Override public void draw(Batch batch,float alpha){drawAt(batch,config.lobbyX,config.lobbyFloor,config.lobbyScale,alpha);}
    public void drawAt(Batch batch,float x,float y,float size,float alpha){
        saved.set(batch.getTransformMatrix());savedColor.set(batch.getColor());root.set(saved).translate(x,y,0).scale(size,size,1);
        int src=batch.getBlendSrcFunc(),dst=batch.getBlendDstFunc(),srcA=batch.getBlendSrcFuncAlpha(),dstA=batch.getBlendDstFuncAlpha();
        try {
            batch.setTransformMatrix(root);batch.setColor(savedColor.r,savedColor.g,savedColor.b,savedColor.a*alpha);strings.draw(batch,assets,animator.motionTime());
            for(var b:skeleton.order){if(!b.visible)continue;draw.set(root).mul(b.world);batch.setTransformMatrix(draw);float brightness=b.config.name.equals("leftEye")?.45f+.55f*animator.pose[PuppeteerAnimator.GLOW]:1;batch.setColor(savedColor.r*brightness,savedColor.g*brightness,savedColor.b*brightness,savedColor.a*alpha*b.alpha);sprite(batch,b,assets.region(b.config.name));
                if(b.config.name.equals("leftEye")){batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);batch.setColor(1,.55f,.15f,savedColor.a*alpha*b.alpha*animator.pose[PuppeteerAnimator.GLOW]*.65f);sprite(batch,b,assets.amberGlow);batch.setBlendFunctionSeparate(src,dst,srcA,dstA);}
            }
        }finally{batch.setBlendFunctionSeparate(src,dst,srcA,dstA);batch.setTransformMatrix(saved);batch.setColor(savedColor);}
    }
    private static void sprite(Batch batch,PuppeteerSkeleton.Bone b,TextureRegion r){float s=b.config.artScale;batch.draw(r,-b.config.pivotX*s,(b.config.pivotY-r.getRegionHeight())*s,r.getRegionWidth()*s,r.getRegionHeight()*s);}
}
