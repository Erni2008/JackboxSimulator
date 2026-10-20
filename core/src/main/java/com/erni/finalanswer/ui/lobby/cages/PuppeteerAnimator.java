package com.erni.finalanswer.ui.lobby.cages;

import com.badlogic.gdx.math.MathUtils;
import java.util.Arrays;
import java.util.Random;

/** Occupant-local, fixed-step procedural layers. Rendering never mutates animation state. */
public final class PuppeteerAnimator {
    public enum State {IDLE,INTRO,WALK,LAUGH,SCARE,LOOK_AT_PLAYER,BROKEN,STRING_PULL}
    public enum Behavior {HEAD_SNAP,DIRECT_STARE,BROKEN_PUPPET,SILENT_LAUGHTER,STRING_PULL,FINGER_THREAT,FALSE_DEACTIVATION}
    public enum Mouth {CLOSED,SMILE,OPEN,LAUGH,TWITCH}
    public static final int ROOT_Y=0,BODY=1,HEAD=2,HEAD_Y=3,ARM_L=4,ARM_R=5,WRIST_L=6,WRIST_R=7,LEG_L=8,LEG_R=9,SHOULDER_L=10,SHOULDER_R=11,BODY_Y=12,EYE_LX=13,EYE_LY=14,EYE_RX=15,EYE_RY=16,EYE_ROT=17,JAW=18,MOUTH_ROT=19,GLOW=20,HAIR=21,ROOT_X=22,ALPHA=23,COUNT=24;
    public final float[] pose=new float[COUNT];
    private final float[] target=new float[COUNT],from=new float[COUNT];
    private final PuppeteerConfig config;private final Random random;
    private State state=State.INTRO;private Behavior behavior,lastBehavior;
    private double remainder;private float time,stateTime,blendAge,behaviorTime,nextBehavior,nextEyes;
    private float eyeLX,eyeLY,eyeRX,eyeRY,aimLX,aimLY,aimRX,aimRY,lookX,lookY,phase;
    private boolean externalLook,reduced;
    public boolean eyeTracking=true,idleMovement=true;
    public float speed=1,laughIntensity=1;
    private Mouth mouth=Mouth.SMILE;
    public PuppeteerAnimator(PuppeteerConfig config,long seed){this.config=config;random=new Random(seed);nextBehavior=config.introSeconds+interval();calculate();System.arraycopy(target,0,pose,0,COUNT);System.arraycopy(pose,0,from,0,COUNT);blendAge=config.blendSeconds;}
    public State state(){return state;}public float stateTime(){return stateTime;}public float motionTime(){return time;}public Behavior behavior(){return behavior;}
    public void play(State next){if(next==state)return;System.arraycopy(pose,0,from,0,COUNT);blendAge=0;stateTime=0;state=next;behavior=null;nextBehavior=time+duration()+interval();}
    /** Occupant-local reveal; roster refreshes retain this timer and never replay the fade. */
    public float appearanceAlpha(){return pose[ALPHA];}
    public void mouth(Mouth value){mouth=value;}
    /** Normalized target in character space; caller can project the pointer into this space. */
    public void lookAt(float x,float y){if(!Float.isFinite(x)||!Float.isFinite(y))return;externalLook=true;lookX=MathUtils.clamp(x,-1,1);lookY=MathUtils.clamp(y,-1,1);}
    public void clearLookTarget(){externalLook=false;}
    public boolean trigger(Behavior next){if(state!=State.IDLE)return false;behavior=next;lastBehavior=next;behaviorTime=0;nextBehavior=time+3.6f+interval();return true;}
    private float interval(){return config.behaviorMin+random.nextFloat()*(config.behaviorMax-config.behaviorMin);}
    private float duration(){return switch(state){case IDLE,WALK -> 0;case INTRO -> config.introSeconds;case LAUGH -> config.laughSeconds;case SCARE -> config.scareSeconds;case LOOK_AT_PLAYER -> 2;case BROKEN -> 3;case STRING_PULL -> 1.8f;};}
    public void update(float delta,float phase,boolean reducedMotion){
        if(!Float.isFinite(delta)||delta<0||!Float.isFinite(speed)||speed<0)return;
        this.phase=phase;reduced=reducedMotion;remainder+=(double)delta*Math.min(speed,4);
        while(remainder+1e-8>=1.0/120){step(1f/120);remainder-=1.0/120;}
    }
    private void step(float dt){
        time+=dt;stateTime+=dt;blendAge+=dt;
        if(state!=State.IDLE&&state!=State.WALK&&stateTime>=duration())play(State.IDLE);
        if(behavior!=null){behaviorTime+=dt;if(behaviorTime>=3.6f)behavior=null;}
        if(state==State.IDLE&&idleMovement&&!reduced&&behavior==null&&time>=nextBehavior){
            float total=0;for(int i=0;i<7;i++)if(BEHAVIORS[i]!=lastBehavior)total+=config.behaviorWeights[i];
            float pick=random.nextFloat()*total;int chosen=0;
            for(int i=0;i<7;i++)if(BEHAVIORS[i]!=lastBehavior){pick-=config.behaviorWeights[i];chosen=i;if(pick<=0)break;}
            if(total>0)trigger(BEHAVIORS[chosen]);else nextBehavior=time+interval();
        }
        if(time>=nextEyes){aimLX=random.nextFloat()*2-1;aimLY=random.nextFloat()*1.4f-.7f;aimRX=random.nextFloat()*1.6f-.8f;aimRY=random.nextFloat()*1.2f-.6f;nextEyes=time+1.1f+random.nextFloat()*2;}
        float lx=externalLook?lookX:aimLX,ly=externalLook?lookY:aimLY;
        eyeLX=MathUtils.lerp(eyeLX,lx,1-(float)Math.exp(-dt*9));eyeLY=MathUtils.lerp(eyeLY,ly,1-(float)Math.exp(-dt*9));
        boolean rightFollows=externalLook&&MathUtils.sin(time*.21f+phase)>.25f;
        eyeRX=MathUtils.lerp(eyeRX,rightFollows?lookX*.6f:aimRX,1-(float)Math.exp(-dt*2.5f));eyeRY=MathUtils.lerp(eyeRY,rightFollows?lookY*.6f:aimRY,1-(float)Math.exp(-dt*2.5f));
        calculate();float blend=ease(blendAge,0,config.blendSeconds);
        for(int i=0;i<COUNT;i++)pose[i]=MathUtils.lerp(from[i],target[i],blend);
    }
    private static final Behavior[] BEHAVIORS=Behavior.values();
    private static final int[] INTRO_LIMBS={ARM_L,ARM_R,WRIST_L,WRIST_R,LEG_L,LEG_R,HAIR};
    private void calculate(){
        Arrays.fill(target,0);target[ALPHA]=1;float t=time+phase,amount=reduced?.18f:1;
        if(idleMovement){
            target[BODY]=(MathUtils.sin(t*.73f)*.75f+MathUtils.sin(t*1.17f+1.8f)*.25f)*config.idleBodyDegrees*amount;
            target[HEAD]=(MathUtils.sin(t*.49f-.8f)*.75f+MathUtils.sin(t*.91f)*.25f)*config.idleHeadDegrees*amount;
            target[ARM_L]=(MathUtils.sin(t*.87f)*3+MathUtils.sin(t*.37f+2)*1.5f)*amount;
            target[ARM_R]=(MathUtils.sin(t*.69f+1.7f)*3.5f+MathUtils.sin(t*.43f)*1)*amount;
            target[WRIST_L]=MathUtils.sin(t*.63f-.6f)*3*amount;target[WRIST_R]=MathUtils.sin(t*.79f+2)*3.5f*amount;
            target[SHOULDER_L]=MathUtils.sin(t*.8f)*.3f*amount;target[SHOULDER_R]=MathUtils.sin(t*.61f+2)*.4f*amount;
            target[LEG_L]=MathUtils.sin(t*.41f)*.6f*amount;target[LEG_R]=MathUtils.sin(t*.33f+1)*.7f*amount;
            target[HAIR]=(MathUtils.sin(t*.95f-.7f)*2+MathUtils.sin(t*1.57f)*.6f)*amount;
        }
        if(eyeTracking){target[EYE_LX]=eyeLX*.48f;target[EYE_LY]=eyeLY*.35f;target[EYE_RX]=eyeRX*.32f;target[EYE_RY]=eyeRY*.28f;target[EYE_ROT]=MathUtils.sin(t*.3f)*1.2f;}
        target[GLOW]=.6f+MathUtils.sin(t*1.7f)*.06f+MathUtils.sin(t*3.1f+1)*.025f;
        target[JAW]=switch(mouth){case CLOSED -> -.4f;case SMILE -> 0;case OPEN -> .9f;case LAUGH -> .4f+.5f*MathUtils.sin(t*14);case TWITCH -> MathUtils.sin(t*21)*.2f;};
        float s=stateTime;
        switch(state){
            case INTRO -> {
                float intro=s/config.introSeconds*6.5f;target[ALPHA]=ease(intro,.08f,.9f);
                float lift=ease(intro,1,2),snap=pulse(intro,2,2.12f,2.38f,2.8f),settle=ease(intro,4.8f,6.5f);
                target[BODY]*=lift;target[HEAD]=MathUtils.lerp(-15,5,lift)+snap*13;target[HEAD]*=1-settle;target[ROOT_Y]=-2*(1-lift);
                target[GLOW]=MathUtils.lerp(.08f,.95f,ease(intro,2.3f,3.5f));target[GLOW]=MathUtils.lerp(target[GLOW],.6f,settle);
                target[ARM_L]-=22*pulse(intro,3,4.2f,4.7f,6.5f);target[WRIST_L]-=12*pulse(intro,3.4f,4.4f,4.8f,6.5f);
                target[HEAD]+=13*pulse(intro,4,4.3f,4.8f,6.5f);
                target[JAW]=.7f*pulse(intro,3.5f,4.2f,4.8f,6.5f);
                target[SHOULDER_R]+=MathUtils.sin(intro*36)*.35f*pulse(intro,4,4.2f,4.5f,5);
                for(int i=EYE_LX;i<=EYE_ROT;i++)target[i]*=ease(intro,1,1.4f);
                target[EYE_RX]*=1-ease(intro,1.9f,2.1f);target[EYE_LX]*=1-ease(intro,2.15f,2.4f);
                float still=1-ease(intro,.95f,1.25f);for(int i:INTRO_LIMBS)target[i]*=1-still;
            }
            case WALK -> {
                float cycle=(s*.72f)%1,step=cycle<.5f?cycle*2:(cycle-.5f)*2;boolean left=cycle<.5f;
                float stride=(float)Math.sin(ease(step,.12f,.8f)*Math.PI),settle=(float)Math.sin(step*Math.PI);
                target[LEG_L]+=left?stride*10:-stride*3;target[LEG_R]+=left?-stride*3:stride*8;
                target[ROOT_Y]+=settle*.9f;target[BODY]+=left?settle*2:-settle*2;target[HEAD]-=MathUtils.sin(s*4.52f-.7f)*3;
                target[ARM_L]+=MathUtils.sin(s*4.52f-.8f)*4;target[ARM_R]-=MathUtils.sin(s*4.52f-.4f)*4;
            }
            case LAUGH -> laugh(s/config.laughSeconds*3.2f,laughIntensity);
            case SCARE -> {
                float scare=s/config.scareSeconds*1.7f;float e=pulse(scare,.16f,.33f,.8f,1.7f);stare(e);target[HEAD]+=23*e;target[ARM_L]-=32*e;target[ARM_R]+=32*e;target[WRIST_L]-=18*e;target[WRIST_R]+=18*e;target[JAW]+=1.1f*e;target[GLOW]=MathUtils.lerp(target[GLOW],1,e);
            }
            case LOOK_AT_PLAYER -> stare(pulse(s,0,.18f,1.5f,2));
            case BROKEN -> broken(pulse(s,0,.35f,1.3f,3));
            case STRING_PULL -> pull(s);
            default -> {}
        }
        if(behavior!=null&&state==State.IDLE){float e=pulse(behaviorTime,0,.3f,2.2f,3.6f);
            switch(behavior){
                case HEAD_SNAP -> target[HEAD]=MathUtils.lerp(target[HEAD],22,pulse(behaviorTime,.1f,.18f,.48f,1.6f));
                case DIRECT_STARE -> stare(e);
                case BROKEN_PUPPET -> broken(e);
                case SILENT_LAUGHTER -> laugh(behaviorTime/3.6f*3.2f,.65f);
                case STRING_PULL -> pull(behaviorTime);
                case FINGER_THREAT -> {target[ARM_R]+=20*e;target[WRIST_R]+=18*e;target[HEAD]-=5*e;}
                case FALSE_DEACTIVATION -> {
                    target[BODY]=MathUtils.lerp(target[BODY],-3,e);target[HEAD]=MathUtils.lerp(target[HEAD],-17,e);
                    float rise=pulse(behaviorTime,2.25f,2.34f,2.65f,3.6f);target[HEAD]+=30*rise;stare(rise);target[GLOW]=MathUtils.lerp(target[GLOW],1,rise);
                    target[ARM_L]*=1-e;target[ARM_R]*=1-e;
                }
            }
        }
        target[GLOW]=MathUtils.clamp(target[GLOW],0,1);
        if(reduced){for(int i=0;i<COUNT;i++)if(i!=ALPHA&&i!=GLOW&&i!=EYE_LX&&i!=EYE_LY&&i!=EYE_RX&&i!=EYE_RY)target[i]*=.35f;}
    }
    private void stare(float e){target[BODY]*=1-e;target[HEAD]*=1-e;for(int i=EYE_LX;i<=EYE_ROT;i++)target[i]*=1-e;}
    private void broken(float e){target[SHOULDER_L]-=3*e;target[HEAD]-=19*e;target[ARM_L]-=13*e;target[BODY]+=4*e;}
    private void pull(float s){float pull=pulse(s,.12f,.22f,.3f,1.55f);target[ROOT_Y]+=4*pull;target[ARM_L]-=8*pulse(s,.19f,.34f,.42f,1.7f);target[ARM_R]+=7*pulse(s,.21f,.36f,.46f,1.8f);target[LEG_L]+=3*pull;target[LEG_R]-=3*pull;}
    private void laugh(float s,float intensity){float e=pulse(s,.2f,.5f,2.3f,3.2f)*MathUtils.clamp(intensity,0,1.5f);
        target[HEAD]+=9*e+10*pulse(s,2.1f,2.25f,2.45f,3.2f);target[JAW]+=(.55f+.45f*MathUtils.sin(s*17))*e;
        target[BODY]+=MathUtils.sin(s*29)*.7f*e;target[SHOULDER_L]+=MathUtils.sin(s*29)*.55f*e;target[SHOULDER_R]-=MathUtils.sin(s*29+.4f)*.5f*e;target[GLOW]+=.22f*e;
    }
    public static float ease(float t,float a,float b){float v=MathUtils.clamp((t-a)/(b-a),0,1);return v*v*(3-2*v);}
    public static float pulse(float t,float a,float b,float c,float d){return ease(t,a,b)*(1-ease(t,c,d));}
}
