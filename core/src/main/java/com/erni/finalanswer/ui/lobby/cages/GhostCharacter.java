package com.erni.finalanswer.ui.lobby.cages;

import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.GL20;
import com.badlogic.gdx.graphics.g2d.Batch;
import com.badlogic.gdx.graphics.g2d.TextureRegion;
import com.badlogic.gdx.math.MathUtils;
import com.badlogic.gdx.math.Matrix4;

/** Four original images, one parent transform, shoulder pivots and a pinned cloth strip mesh. */
public final class GhostCharacter implements CageCharacter {
    // Lobby-only presentation scale; the complete rig grows uniformly around its existing anchor.
    private static final float LOBBY_SCALE = 1.06f;
    private final GhostAssets assets;
    private final GhostAnimator animator = new GhostAnimator();
    private final Matrix4 saved = new Matrix4(), root = new Matrix4();
    private final Color color = new Color();
    private final float[] cloth = new float[8 * 20];
    private float lastTime = -1, phase;
    private boolean flipped, reduced;
    public GhostCharacter(GhostAssets assets) { this.assets = assets; }
    public GhostAnimator animator() { return animator; }
    public void setState(GhostAnimator.State state) { animator.setState(state); }
    public void flipped(boolean value) { flipped = value; }
    public void advance(float delta, float phase, boolean reducedMotion) {
        this.phase=phase; reduced=reducedMotion; animator.update(delta,phase,reducedMotion);
    }
    @Override public void update(float time, float phase, boolean reducedMotion) {
        float delta=lastTime<0 ? Math.min(time,1f/30) : Math.max(0,time-lastTime);
        lastTime=time; advance(delta,phase,reducedMotion);
    }
    @Override public void draw(Batch batch,float alpha) {
        // Deeper shoulder overlap leaves room for the full claw sweep at the larger lobby scale.
        drawRig(batch,174,151,LOBBY_SCALE,flipped,alpha,7);
    }
    public void drawAt(Batch batch,float x,float y,float size,boolean flip,float alpha) {
        drawRig(batch,x,y,size,flip,alpha,0);
    }
    private void drawRig(Batch batch,float x,float y,float size,boolean flip,float alpha,float shoulderInset) {
        if(animator.finished()) return;
        GhostAnimator.Pose p=animator.pose;
        saved.set(batch.getTransformMatrix()); color.set(batch.getColor());
        root.set(saved).translate(x+p.x*size,y+p.y*size,0).scale((flip?-size:size)*p.scaleX,size*p.scaleY,1).rotate(0,0,1,p.rotation);
        batch.setTransformMatrix(root);
        float opacity=alpha*color.a*animator.spawnAlpha();
        batch.setColor(color.r,color.g,color.b,opacity*p.tailAlpha); drawTail(batch);
        batch.setColor(color.r,color.g,color.b,opacity*p.bodyAlpha);
        part(batch,assets.leftArm,-30+shoulderInset-p.detach,3,950,300,.045f,p.leftArm);
        part(batch,assets.rightArm,30-shoulderInset+p.detach,0,400,300,.045f,p.rightArm);
        part(batch,assets.body,0,0,690,700,.095f,0);
        int src=batch.getBlendSrcFunc(),dst=batch.getBlendDstFunc(),srcA=batch.getBlendSrcFuncAlpha(),dstA=batch.getBlendDstFuncAlpha();
        batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);
        batch.setColor(1,1,1,opacity*p.eyesAlpha*.27f*p.eyeLight);
        eye(batch,assets.leftEye,559,277); eye(batch,assets.rightEye,719,259);
        batch.setBlendFunctionSeparate(src,dst,srcA,dstA);
        particles(batch,opacity);
        batch.setTransformMatrix(saved); batch.setColor(color);
    }
    private static void part(Batch b,GhostAssets.Part p,float x,float y,float pivotX,float pivotY,float scale,float angle) {
        float ox=(pivotX-p.x())*scale,oy=(p.y()+p.height()-pivotY)*scale;
        b.draw(p.region(),x-ox,y-oy,ox,oy,p.width()*scale,p.height()*scale,1,1,angle);
    }
    private static void eye(Batch b,TextureRegion eye,float sourceX,float sourceY) {
        b.draw(eye,(sourceX-690)*.095f,(700-sourceY-eye.getRegionHeight())*.095f,eye.getRegionWidth()*.095f,eye.getRegionHeight()*.095f);
    }
    private void drawTail(Batch batch) {
        GhostAssets.Part p=assets.tail; TextureRegion r=p.region();
        // Keep the original attachment orientation fixed; motion grows toward the hem.
        float baseAngle=-12;
        float packed=batch.getColor().toFloatBits(); int index=0;
        for(int row=0;row<8;row++) {
            for(int corner=0;corner<4;corner++) {
                boolean right=corner>=2; float v=(row+(corner==0||corner==3?1:0))/8f;
                float weight=Math.max(0,(v-.22f)/.78f); weight*=weight;
                float sx=(p.x()+(right?p.width():0)-400)*.048f;
                float sy=(80-p.y()-v*p.height())*.048f;
                float wave=MathUtils.sin(animator.motionTime()*1.7f+phase+v*4)*1.5f*weight*(reduced?.35f:1);
                sx+=wave;
                float angle=baseAngle+animator.pose.tail*weight;
                float cos=MathUtils.cosDeg(angle),sin=MathUtils.sinDeg(angle);
                cloth[index++]=-25+sx*cos-sy*sin; cloth[index++]=-26+sx*sin+sy*cos;
                cloth[index++]=packed; cloth[index++]=right?r.getU2():r.getU();
                cloth[index++]=r.getV()+(r.getV2()-r.getV())*v;
            }
        }
        batch.draw(r.getTexture(),cloth,0,cloth.length);
    }
    private void particles(Batch batch,float opacity) {
        if(animator.state()!=GhostAnimator.State.DEATH) return;
        float t=animator.stateTime();
        int src=batch.getBlendSrcFunc(),dst=batch.getBlendDstFunc(),srcA=batch.getBlendSrcFuncAlpha(),dstA=batch.getBlendDstFuncAlpha();
        for(int pass=0;pass<2;pass++) {
            if(pass==1) batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);
            for(int i=0;i<20;i++) {
                boolean light=i%3==0;
                if(light!=(pass==1)) continue;
                float age=t-.65f-i*.025f;
                if(age<=0) continue;
                float progress=Math.min(1,age/1.55f),seed=i*2.399963f;
                float a=opacity*(1-progress)*GhostAnimator.smooth(Math.min(1,age/.25f));
                batch.setColor(.8f,.88f,1,a*(light?.55f:.7f));
                float px=MathUtils.sin(seed)*27+MathUtils.sin(seed+age)*age*9;
                float py=-30+(i%7)*10+age*(9+i%5);
                TextureRegion region=light?assets.mote:assets.scrap;
                float w=light?3f:5f,h=w*region.getRegionHeight()/region.getRegionWidth();
                batch.draw(region,px,py,w/2,h/2,w,h,1,1,seed*50+age*12);
            }
        }
        batch.setBlendFunctionSeparate(src,dst,srcA,dstA);
    }
}
