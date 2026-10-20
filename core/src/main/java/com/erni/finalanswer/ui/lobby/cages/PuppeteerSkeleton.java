package com.erni.finalanswer.ui.lobby.cages;

import com.badlogic.gdx.math.Matrix4;
import java.util.Arrays;
import java.util.Comparator;
import java.util.HashMap;
import static com.erni.finalanswer.ui.lobby.cages.PuppeteerAnimator.*;

/** Minimal per-character rig following the existing cage Batch/local-matrix rendering convention. */
public final class PuppeteerSkeleton {
    public static final class Bone {
        public final PuppeteerConfig.Part config;
        public final Matrix4 world=new Matrix4();
        public Bone parent;
        public float x,y,rotation,scaleX=1,scaleY=1,alpha=1;public boolean visible=true;
        private boolean ready;
        Bone(PuppeteerConfig.Part c){config=c;}
    }
    public final Bone[] bones,order;
    private final HashMap<String,Bone> named=new HashMap<>();
    private final Matrix4 actor=new Matrix4();
    public PuppeteerSkeleton(PuppeteerConfig config){bones=new Bone[config.parts.size];for(int i=0;i<bones.length;i++){bones[i]=new Bone(config.parts.get(i));named.put(bones[i].config.name,bones[i]);}
        for(Bone b:bones)if(!b.config.parent.isEmpty())b.parent=bone(b.config.parent);
        order=bones.clone();Arrays.sort(order,Comparator.comparingInt(b->b.config.order));}
    public Bone bone(String name){var b=named.get(name);if(b==null)throw new IllegalArgumentException("Unknown Puppeteer bone: "+name);return b;}
    public void update(float[] p){
        actor.idt().translate(p[ROOT_X],p[ROOT_Y],0);
        for(Bone b:bones){b.x=b.config.x;b.y=b.config.y;b.rotation=b.config.rotation;b.scaleX=(b.config.mirror?-1:1)*b.config.scale;b.scaleY=b.config.scale;b.alpha=b.config.alpha;b.visible=b.config.visible;b.ready=false;}
        bone("body").rotation+=p[BODY];bone("body").y+=p[BODY_Y];bone("head").rotation+=p[HEAD];bone("head").y+=p[HEAD_Y];
        bone("leftArm").rotation+=p[ARM_L];bone("rightArm").rotation+=p[ARM_R];bone("leftArm").y+=p[SHOULDER_L];bone("rightArm").y+=p[SHOULDER_R];
        bone("leftHand").rotation+=p[WRIST_L];bone("rightHand").rotation+=p[WRIST_R];bone("leftLeg").rotation+=p[LEG_L];bone("rightLeg").rotation+=p[LEG_R];
        bone("leftEye").x+=p[EYE_LX];bone("leftEye").y+=p[EYE_LY];bone("rightEye").x+=p[EYE_RX];bone("rightEye").y+=p[EYE_RY];bone("rightEye").rotation+=p[EYE_ROT];
        // One combined mouth plate: a restrained hinge/translation, never a fake articulated jaw.
        bone("mouth").rotation+=p[MOUTH_ROT]+p[JAW]*2;bone("mouth").y-=p[JAW]*.65f;
        bone("hair").rotation+=p[HAIR];
        for(Bone b:bones)world(b);
    }
    private void world(Bone b){if(b.ready)return;if(b.parent!=null){world(b.parent);b.world.set(b.parent.world);b.alpha*=b.parent.alpha;b.visible&=b.parent.visible;}else if(b.config.name.equals("suspension"))b.world.idt();else b.world.set(actor);
        b.world.translate(b.x,b.y,0).rotate(0,0,1,b.rotation).scale(b.scaleX,b.scaleY,1);b.ready=true;}
}
