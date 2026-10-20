package com.erni.finalanswer.ui.lobby.cages;

import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.GL20;
import com.badlogic.gdx.graphics.g2d.Batch;
import com.badlogic.gdx.graphics.g2d.TextureRegion;
import com.badlogic.gdx.math.MathUtils;
import com.badlogic.gdx.math.Matrix4;
import java.util.*;

/** Configured local rig using the existing cage Batch. Detached parts use analytic, seeded 2D motion. */
public final class VoodooCharacter implements CageCharacter {
    public static final class Part {
        public final VoodooConfig.Part config;public final TextureRegion region;
        public final Matrix4 world=new Matrix4();
        public float positionX,positionY,rotation,scaleX,scaleY,alpha,pivotX,pivotY;
        public boolean visibility;
        private Part parent;private boolean ready,free;
        private float birth,x0,y0,angle0,sx0,sy0,vx,vy,spin,restAngle,freeAlpha=1;
        Part(VoodooConfig.Part config,TextureRegion region){this.config=config;this.region=region;reset();}
        void reset(){positionX=config.x;positionY=config.y;rotation=config.rotation;scaleX=config.scaleX;scaleY=config.scaleY;alpha=config.alpha;pivotX=config.pivotX;pivotY=config.pivotY;visibility=config.visible;ready=false;}
    }
    private static final class Particle {
        float x,y,vx,vy,angle,spin,scale,opacity,lifetime,birth;TextureRegion region;
    }
    private final VoodooAssets assets;private final VoodooConfig config;
    private final VoodooAnimationController controller;
    private final TextureRegion embeddedHeartLight;
    private final Part[] parts,order;private final Part[] needles=new Part[4],threads=new Part[4];private final Map<String,Part> named=new HashMap<>();
    private final Particle[] pool=new Particle[24];
    private final Matrix4 saved=new Matrix4(),root=new Matrix4(),poseRoot=new Matrix4(),drawMatrix=new Matrix4();
    private final Color color=new Color();private final float[] bodyVertices=new float[10*12*20];
    private TextureRegion cachedBodyRegion;
    private float cachedHeartScale=Float.NaN,cachedPivotX,cachedPivotY,cachedArtScale,cachedHeartX,cachedHeartY,cachedHeartRadius,cachedPackedColor;
    private float lastTime=-1,phase;private boolean particlesStarted,reduced;private VoodooAnimationController.State previous;
    private final LinkedHashMap<String,Boolean> networkSequences=new LinkedHashMap<>();private long networkEpoch;private float networkAge;
    public VoodooCharacter(VoodooAssets assets,VoodooConfig config){this(assets,config,new Random().nextLong());}
    public VoodooCharacter(VoodooAssets assets,VoodooConfig config,long seed) {
        this.assets=assets;this.config=config;controller=new VoodooAnimationController(config,seed);
        parts=new Part[config.parts.size];
        for(int i=0;i<parts.length;i++){var p=config.parts.get(i);TextureRegion source=assets.sprites[p.asset-1];
            if(p.region!=null){int[] r=p.region;if(r[0]+r[2]>source.getRegionWidth()||r[1]+r[3]>source.getRegionHeight())throw new IllegalArgumentException("Voodoo part crop outside source: "+p.name);source=new TextureRegion(source,r[0],r[1],r[2],r[3]);}
            parts[i]=new Part(p,source);named.put(p.name,parts[i]);
        }
        int[] bodyCrop=config.part("body").region;
        embeddedHeartLight=bodyCrop==null?assets.heartLight:new TextureRegion(assets.heartLight,bodyCrop[0],bodyCrop[1],bodyCrop[2],bodyCrop[3]);
        for(Part p:parts)if(!p.config.parent.isEmpty())p.parent=named.get(p.config.parent);
        for(int i=0;i<4;i++){needles[i]=named.get("needle"+i);threads[i]=named.get("thread"+i);}
        order=parts.clone();Arrays.sort(order,Comparator.comparingInt(p->p.config.order));
        for(int i=0;i<pool.length;i++)pool[i]=new Particle();previous=controller.state();applyPose();
    }
    public VoodooAnimationController controller(){return controller;}
    public VoodooConfig configuration(){return config;}
    public Part[] parts(){return parts;}
    public boolean play(VoodooAnimationController.State state,long seed){
        if(!controller.play(state,seed))return false;networkEpoch=0;resetEffects();return true;
    }
    public void playNetwork(VoodooAnimationController.State state,String sequence,long seed,float age) {
        if(networkSequences.containsKey(sequence))return;
        if(networkSequences.size()>=64)networkSequences.remove(networkSequences.keySet().iterator().next());
        networkSequences.put(sequence,Boolean.TRUE);
        if(!play(state,seed))return;
        networkAge=Math.max(0,Math.min(age,30));networkEpoch=System.nanoTime();
        advance(networkAge,phase,reduced);
    }
    private void resetEffects(){for(Part p:parts){p.free=false;p.freeAlpha=1;}particlesStarted=false;previous=controller.state();applyPose();}
    @Override public void update(float delta,float time,float phase,boolean reducedMotion){lastTime=time;
        if(networkEpoch!=0)delta=Math.max(0,networkAge+(System.nanoTime()-networkEpoch)/1_000_000_000f-controller.eventElapsed());
        advance(delta,phase,reducedMotion);
    }
    @Override public void update(float time,float phase,boolean reducedMotion){float delta=lastTime<0?Math.min(time,1f/30):Math.max(0,time-lastTime);update(delta,time,phase,reducedMotion);}
    public void advance(float delta,float phase,boolean reducedMotion) {
        if(!Float.isFinite(delta)||delta<0)return;this.phase=phase;reduced=reducedMotion;
        // Bounded substeps keep detach attachment sampling stable when a frame straddles an event.
        float remaining=delta;
        do {float step=controller.terminal()&&controller.finished()?remaining:Math.min(remaining,1f/120);controller.update(step,phase,reducedMotion);
            if(previous!=controller.state()){if(previous==VoodooAnimationController.State.DEATH||previous==VoodooAnimationController.State.ELIMINATION)resetEffects();previous=controller.state();}
            if(controller.state()==VoodooAnimationController.State.DEATH){applyPose();detach();}
            else if(remaining-step<=.000001f)applyPose();
            remaining-=step;
        } while(remaining>.000001f);
    }
    private void applyPose() {
        for(Part p:parts)p.reset();var a=controller.pose;
        poseRoot.idt().translate(a.rootX,a.rootY,0).rotate(0,0,1,a.rootAngle).scale(a.rootScale,a.rootScale,1);
        Part body=named.get("body");body.positionY+=a.bodyY;body.rotation+=a.bodyAngle;body.scaleX*=a.bodySX;body.scaleY*=a.bodySY;
        Part head=named.get("head");head.rotation+=a.headAngle;head.positionY+=a.headY;
        named.get("leftArm").rotation+=a.leftArm;named.get("rightArm").rotation+=a.rightArm;
        named.get("leftLeg").rotation+=a.leftLeg;named.get("rightLeg").rotation+=a.rightLeg;
        named.get("heart").scaleX*=a.heartScale;named.get("heart").scaleY*=a.heartScale;
        for(int i=0;i<4;i++){needles[i].rotation+=a.needles[i];Part thread=threads[i];if(thread!=null)thread.rotation+=a.threads[i];}
        if(controller.state()==VoodooAnimationController.State.DEATH) {
            float t=controller.animationTime();
            Part red=named.get("redButton"),black=named.get("blackButton");
            float redTear=VoodooAnimationController.ease(t,1.8f,1.94f)*(1-VoodooAnimationController.ease(t,1.94f,1.96f));
            float blackTear=VoodooAnimationController.ease(t,2,2.14f)*(1-VoodooAnimationController.ease(t,2.14f,2.16f));
            red.positionX+=MathUtils.sin(t*93)*.35f*redTear;red.rotation+=MathUtils.sin(t*81)*2.5f*redTear;
            black.positionX+=MathUtils.sin(t*88)*.25f*blackTear;black.rotation+=MathUtils.sin(t*77)*2*blackTear;
        }
        for(Part p:parts)world(p);
    }
    private void world(Part p) {
        if(p.ready)return;
        if(p.free) {
            float age=Math.max(0,Math.min(5,controller.animationTime())-p.birth),travel=age;
            boolean arm=p.config.name.endsWith("Arm"),button=p.config.name.endsWith("Button");
            float px,py,angle;
            if(arm||button) {
                float floor=arm?8:3+p.region.getRegionHeight()*p.config.artScale*p.sy0*.35f;
                float land=(p.vy+(float)Math.sqrt(p.vy*p.vy+2*65*Math.max(0,p.y0-floor)))/65;
                travel=Math.min(age,land);float after=Math.max(0,age-land);
                px=p.x0+p.vx*travel;py=p.y0+p.vy*travel-32.5f*travel*travel;
                if(arm)angle=p.angle0+(p.restAngle-p.angle0)*VoodooAnimationController.ease(age,.12f,Math.max(.3f,land));
                else angle=p.angle0+p.spin*travel;
                if(after>0) {
                    float friction=(1-(float)Math.exp(-after*8))/8;
                    px+=p.vx*.35f*friction;py=floor;
                    if(button) {
                        float rebound=Math.min(9,(65*land-p.vy)*.18f),bounceDuration=2*rebound/65;
                        if(after<bounceDuration)py+=rebound*after-32.5f*after*after;
                        angle+=p.spin*.3f*friction;
                    }
                }
                p.freeAlpha=1;
            } else {
                px=p.x0+p.vx*travel;py=p.y0+p.vy*travel-32.5f*travel*travel;angle=p.angle0+p.spin*travel;
                p.freeAlpha=1-VoodooAnimationController.ease(age,.75f,1.65f);
            }
            p.world.idt().translate(px,py,0).rotate(0,0,1,angle).scale(p.sx0,p.sy0,1);p.ready=true;return;
        }
        if(p.parent!=null){world(p.parent);p.world.set(p.parent.world);p.alpha*=p.parent.alpha;p.visibility&=p.parent.visibility;}else p.world.set(poseRoot);
        p.world.translate(p.positionX,p.positionY,0).rotate(0,0,1,p.rotation).scale(p.scaleX,p.scaleY,1);p.ready=true;
    }
    private void detach() {
        if(controller.state()!=VoodooAnimationController.State.DEATH)return;
        float t=controller.animationTime();
        for(int i=0;i<4;i++)release(needles[i],controller.needleReleaseAt(i),i);
        release(named.get("redButton"),1.95f,4);release(named.get("blackButton"),2.15f,5);
        release(named.get("leftArm"),2.8f,6);release(named.get("rightArm"),3.05f,7);
        if(t>=2.5f&&!particlesStarted){particlesStarted=true;spawnParticles();}
    }
    private void release(Part p,float at,int index) {
        if(p.free||controller.animationTime()<at)return;
        float[] m=p.world.val;p.x0=m[Matrix4.M03];p.y0=m[Matrix4.M13];p.angle0=MathUtils.atan2(m[Matrix4.M10],m[Matrix4.M00])*MathUtils.radiansToDegrees;
        p.sx0=(float)Math.hypot(m[Matrix4.M00],m[Matrix4.M10]);p.sy0=(float)Math.hypot(m[Matrix4.M01],m[Matrix4.M11]);
        float seed=noise(index,controller.stateSeed());
        if(index<4) {
            float dx=m[Matrix4.M00]*825+m[Matrix4.M01]*890,dy=m[Matrix4.M10]*825+m[Matrix4.M11]*890;
            float length=(float)Math.hypot(dx,dy),speed=30+seed*16;
            p.vx=dx/length*speed;p.vy=dy/length*speed+8;p.spin=(index%2==0?-1:1)*(100+seed*100);
        } else if(index<6) {
            p.vx=(index==4?-1:1)*(8+seed*6);p.vy=3+seed*3;p.spin=(index==4?-1:1)*(100+seed*100);
        } else {
            p.vx=(index==6?-1:1)*(3+seed*3);p.vy=-2-seed*2;p.spin=0;
            p.restAngle=p.config.rotation+(index==6?-50:50);
        }
        p.birth=controller.animationTime();p.free=true;
    }
    private void spawnParticles() {
        float[] m=named.get("body").world.val;
        for(int i=0;i<pool.length;i++){Particle p=pool[i];float seed=noise(i+40,controller.stateSeed()),direction=i*2.399963f;
            p.x=m[Matrix4.M03]+MathUtils.sin(direction)*8;p.y=m[Matrix4.M13]+8+seed*10;
            p.vx=MathUtils.cos(direction)*(9+seed*16);p.vy=10+seed*19;p.angle=seed*360;p.spin=(seed-.5f)*230;
            p.birth=2.55f+i*.022f;p.lifetime=1.35f+seed*.6f;p.scale=.008f+seed*.005f;p.opacity=.85f;
            p.region=i%4==0?assets.threads[i%assets.threads.length]:assets.stuffing[i%assets.stuffing.length];
        }
    }
    private static float noise(int index,long seed){long n=(seed+index*0x9e3779b97f4a7c15L);n=(n^(n>>>30))*0xbf58476d1ce4e5b9L;n=(n^(n>>>27))*0x94d049bb133111ebL;return ((n^(n>>>31))&0xffffff)/(float)0x1000000;}
    @Override public void draw(Batch batch,float alpha){drawAt(batch,config.lobbyX,config.lobbyFloor,config.lobbyScale,alpha);}
    public void drawAt(Batch batch,float x,float floor,float size,float alpha) {
        saved.set(batch.getTransformMatrix());color.set(batch.getColor());root.set(saved).translate(x,floor,0).scale(size,size,1);
        int src=batch.getBlendSrcFunc(),dst=batch.getBlendDstFunc(),srcA=batch.getBlendSrcFuncAlpha(),dstA=batch.getBlendDstFuncAlpha();
        try {
            for(Part p:order) {
                if(!p.visibility||p.alpha<=0||config.embeddedHeart&&p.config.name.equals("heart"))continue;
                drawMatrix.set(root).mul(p.world);batch.setTransformMatrix(drawMatrix);
                float opacity=color.a*alpha*controller.pose.alpha*p.alpha*p.freeAlpha;
                batch.setColor(color.r,color.g,color.b,opacity);
                if(p.config.name.equals("body")&&config.embeddedHeart)drawBody(batch,p,p.region);else sprite(batch,p);
                if((p.config.name.equals("redButton")&&!p.free&&controller.pose.redGlow>0)||(p.config.name.equals("heart")&&!config.embeddedHeart&&controller.pose.heartGlow>0)) {
                    batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);batch.setColor(1,.04f,.02f,opacity*(p.config.name.equals("heart")?controller.pose.heartGlow:controller.pose.redGlow)*.55f);sprite(batch,p);batch.setBlendFunctionSeparate(src,dst,srcA,dstA);
                }
                if(p.config.name.equals("body")&&config.embeddedHeart&&controller.pose.heartGlow>0) {
                    batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);batch.setColor(1,.03f,.01f,opacity*controller.pose.heartGlow*.5f);drawBody(batch,p,embeddedHeartLight);batch.setBlendFunctionSeparate(src,dst,srcA,dstA);
                }
            }
            batch.setTransformMatrix(root);particles(batch,color.a*alpha);
        } finally {batch.setBlendFunctionSeparate(src,dst,srcA,dstA);batch.setTransformMatrix(saved);batch.setColor(color);}
    }
    private static void sprite(Batch batch,Part p) {
        int ox=p.config.region==null?0:p.config.region[0],oy=p.config.region==null?0:p.config.region[1];float scale=p.config.artScale;
        batch.draw(p.region,-(p.pivotX-ox)*scale,(p.pivotY-oy-p.region.getRegionHeight())*scale,p.region.getRegionWidth()*scale,p.region.getRegionHeight()*scale);
    }
    private void drawBody(Batch batch,Part p,TextureRegion region) {
        int index=0;float packed=batch.getColor().toFloatBits(),scale=p.config.artScale;
        var h=config.embeddedHeartGeometry;
        boolean rebuild=cachedBodyRegion!=region||cachedHeartScale!=controller.pose.heartScale||cachedPivotX!=p.pivotX||cachedPivotY!=p.pivotY||cachedArtScale!=scale||cachedHeartX!=h.sourceX||cachedHeartY!=h.sourceY||cachedHeartRadius!=h.radius;
        if(rebuild) {
        for(int row=0;row<12;row++)for(int col=0;col<10;col++)for(int corner=0;corner<4;corner++) {
            float u=(col+(corner>=2?1:0))/10f,v=(row+(corner==0||corner==3?1:0))/12f;
            float sx=u*region.getRegionWidth()+(p.config.region==null?0:p.config.region[0]),sy=v*region.getRegionHeight()+(p.config.region==null?0:p.config.region[1]);float dx=sx-h.sourceX,dy=sy-h.sourceY;
            float weight=Math.max(0,1-(dx*dx+dy*dy)/(h.radius*h.radius));weight=weight*weight*(controller.pose.heartScale-1);
            bodyVertices[index++]=(sx-p.pivotX+dx*weight)*scale;bodyVertices[index++]=(p.pivotY-sy-dy*weight)*scale;
            bodyVertices[index++]=packed;bodyVertices[index++]=region.getU()+(region.getU2()-region.getU())*u;bodyVertices[index++]=region.getV()+(region.getV2()-region.getV())*v;
        }
        } else if(cachedPackedColor!=packed)for(int i=2;i<bodyVertices.length;i+=5)bodyVertices[i]=packed;
        cachedBodyRegion=region;cachedHeartScale=controller.pose.heartScale;cachedPivotX=p.pivotX;cachedPivotY=p.pivotY;cachedArtScale=scale;cachedHeartX=h.sourceX;cachedHeartY=h.sourceY;cachedHeartRadius=h.radius;cachedPackedColor=packed;
        batch.draw(region.getTexture(),bodyVertices,0,bodyVertices.length);
    }
    private void particles(Batch batch,float opacity) {
        float t=controller.animationTime();
        if(controller.state()==VoodooAnimationController.State.DEATH&&particlesStarted)for(Particle p:pool) {
            float age=t-p.birth;if(age<0||age>=p.lifetime)continue;
            float fade=1-VoodooAnimationController.ease(age,p.lifetime*.55f,p.lifetime);
            float width=p.region.getRegionWidth()*p.scale,height=p.region.getRegionHeight()*p.scale;
            batch.setColor(color.r,color.g,color.b,opacity*p.opacity*fade);
            batch.draw(p.region,p.x+p.vx*age-width/2,p.y+p.vy*age-32.5f*age*age-height/2,width/2,height/2,width,height,1,1,p.angle+p.spin*age);
        }
        if(controller.state()==VoodooAnimationController.State.ELIMINATION&&t>1.8f&&t<3.5f)for(int i=0;i<14;i++) {
            float age=t-1.8f-i*.035f;if(age<0)continue;
            float fade=VoodooAnimationController.ease(age,0,.2f)*(1-VoodooAnimationController.ease(t,2.8f,3.5f));
            float diameter=11+age*13;batch.setColor(.07f,.035f,.045f,opacity*fade*.5f);
            batch.draw(assets.smoke,MathUtils.sin(i*2.4f)*26-diameter/2,35+(i%5)*17+age*13-diameter/2,diameter,diameter);
        }
    }
}
