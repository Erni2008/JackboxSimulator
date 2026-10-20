package com.erni.finalanswer.ui.lobby.cages;

import java.util.Random;

/** Independent, delta-time state machine. Randomness is sampled at gesture/state boundaries only. */
public final class VoodooAnimationController {
    public enum State { IDLE, SELECTED, VICTORY, DEFEAT, DEATH, ELIMINATION }
    public static final class Pose {
        public float rootX,rootY,rootAngle,rootScale=1,alpha=1,bodyY,bodyAngle,bodySX=1,bodySY=1;
        public float headAngle,headY,leftArm,rightArm,leftLeg,rightLeg,heartScale=1,heartGlow,redGlow;
        public final float[] needles=new float[4],threads=new float[4];
        void copy(Pose p) {blend(p,p,1);}
        void blend(Pose a,Pose b,float t) {
            rootX=mix(a.rootX,b.rootX,t);rootY=mix(a.rootY,b.rootY,t);rootAngle=mix(a.rootAngle,b.rootAngle,t);
            rootScale=mix(a.rootScale,b.rootScale,t);alpha=mix(a.alpha,b.alpha,t);bodyY=mix(a.bodyY,b.bodyY,t);bodyAngle=mix(a.bodyAngle,b.bodyAngle,t);
            bodySX=mix(a.bodySX,b.bodySX,t);bodySY=mix(a.bodySY,b.bodySY,t);headAngle=mix(a.headAngle,b.headAngle,t);headY=mix(a.headY,b.headY,t);
            leftArm=mix(a.leftArm,b.leftArm,t);rightArm=mix(a.rightArm,b.rightArm,t);leftLeg=mix(a.leftLeg,b.leftLeg,t);rightLeg=mix(a.rightLeg,b.rightLeg,t);
            heartScale=mix(a.heartScale,b.heartScale,t);heartGlow=mix(a.heartGlow,b.heartGlow,t);redGlow=mix(a.redGlow,b.redGlow,t);
            for(int i=0;i<4;i++){needles[i]=mix(a.needles[i],b.needles[i],t);threads[i]=mix(a.threads[i],b.threads[i],t);}
        }
    }
    private final VoodooConfig config;
    private final Random random;
    public final Pose pose=new Pose();
    private final Pose anchor=new Pose(),target=new Pose(),freeze=new Pose();
    private final int[] needleRank={0,1,2,3};
    private State state=State.SELECTED;
    private double elapsed,stateTime,eventElapsed,motionTime,nextGesture,gestureAt=-100;
    private float phase,strength=1,gestureDuration=1.8f,direction=1;
    private int gesture=-1,previousGesture=-1,gestureCount,needleMask=1;
    private long stateSeed;
    public VoodooAnimationController(VoodooConfig config,long seed) {
        this.config=config;random=new Random(seed);stateSeed=seed;idle(target,0);pose.copy(target);anchor.copy(pose);schedule();
    }
    public State state(){return state;}
    public float stateTime(){return (float)stateTime;}
    public float animationTime(){return state==State.IDLE?(float)stateTime:(float)(stateTime*nominalDuration(state)/config.duration(state));}
    private static float nominalDuration(State state){return switch(state){case IDLE -> 1;case SELECTED -> 2.5f;case VICTORY -> 2.8f;case DEFEAT -> 3.2f;case DEATH -> 5;case ELIMINATION -> 3.5f;};}
    public float eventElapsed(){return (float)eventElapsed;}
    public float motionTime(){return (float)motionTime;}
    public int gestureCount(){return gestureCount;}
    public long stateSeed(){return stateSeed;}
    public boolean terminal(){return state==State.DEATH||state==State.ELIMINATION;}
    public boolean finished(){return state!=State.IDLE&&stateTime>=config.duration(state);}
    public float needleReleaseAt(int index){return .8f+needleRank[index]*.2f;}
    public boolean play(State next,long seed) {
        if(next==null) throw new IllegalArgumentException("Voodoo state required");
        if(terminal()&&next!=State.IDLE&&next!=State.SELECTED)return false;
        anchor.copy(pose);state=next;stateTime=eventElapsed=0;stateSeed=seed;random.setSeed(seed);
        for(int i=0;i<4;i++)needleRank[i]=i;
        for(int i=3;i>0;i--){int j=random.nextInt(i+1),v=needleRank[i];needleRank[i]=needleRank[j];needleRank[j]=v;}
        gestureAt=-100;gesture=-1;schedule();return true;
    }
    private void schedule(){nextGesture=elapsed+config.idle.gestureMin+random.nextDouble()*(config.idle.gestureMax-config.idle.gestureMin);}
    public void update(float delta,float phase,boolean reducedMotion) {
        if(!Float.isFinite(delta)||delta<0)return;
        this.phase=phase;strength=reducedMotion?.35f:1;double before=stateTime;elapsed+=delta;stateTime+=delta;eventElapsed+=delta;
        if(!terminal()){
            double blocked=0;
            if(state==State.SELECTED)blocked=overlap(before,stateTime,0,.3*config.timings.selected/2.5);
            if(state==State.DEFEAT)blocked=overlap(before,stateTime,1.5*config.timings.defeat/3.2,2.5*config.timings.defeat/3.2);
            motionTime+=delta-blocked;
        }
        if(state==State.IDLE) {
            while(nextGesture<=elapsed){
                gestureAt=nextGesture;int next=random.nextInt(previousGesture<0?5:4);if(previousGesture>=0&&next>=previousGesture)next++;gesture=next;previousGesture=next;needleMask=random.nextInt(15)+1;
                direction=random.nextBoolean()?1:-1;gestureDuration=gesture==3?1.6f:1.8f;gestureCount++;
                idle(freeze,(float)(motionTime-(elapsed-gestureAt)));nextGesture+=config.idle.gestureMin+random.nextDouble()*(config.idle.gestureMax-config.idle.gestureMin);
            }
        }
        evaluate();
        if(!terminal()&&state!=State.IDLE&&stateTime>=config.duration(state)) {
            float over=(float)(stateTime-config.duration(state));anchor.copy(pose);state=State.IDLE;stateTime=over;schedule();
        }
    }
    private void idle(Pose p,float t) {
        VoodooConfig.Idle c=config.idle;float breath=(1-cos(t*6.283185f/c.breathSeconds+phase))*.5f;
        p.rootX=p.rootY=p.rootAngle=p.bodyY=p.headY=0;p.rootScale=p.alpha=1;
        p.bodySX=1+c.breathX*breath*strength;p.bodySY=1+c.breathY*breath*strength;
        p.bodyAngle=sin(t*6.283185f/c.bodySeconds+phase)*c.bodyDegrees*strength;
        p.headAngle=sin(t*6.283185f/c.headSeconds+phase-.65f)*c.headDegrees*strength;
        p.leftArm=sin(t*1.07f+phase)*c.leftArmDegrees*strength;
        p.rightArm=sin(t*.91f+phase+1.7f)*c.rightArmDegrees*strength;p.leftLeg=p.rightLeg=0;
        p.heartScale=1;p.heartGlow=p.redGlow=0;
        for(int i=0;i<4;i++){p.needles[i]=0;p.threads[i]=sin(t*(.85f+i*.13f)+phase+i*1.4f)*c.threadDegrees*strength;}
    }
    private void evaluate() {
        float t=animationTime();
        if(terminal()) {
            pose.copy(anchor);
            if(state==State.DEATH) {
                float curse=envelope(t,0,.65f,1.2f)*strength;
                pose.bodyAngle+=sin(t*73)*2*curse;pose.headAngle+=sin(t*89)*4*curse;
                pose.heartScale=anchor.heartScale+.12f*pulse(t,8)*curse;
                float collapse=ease(t,2.5f,5);
                pose.bodyY-=31*collapse;pose.bodyAngle-=65*collapse;pose.headAngle+=95*ease(t,2.6f,4.8f);
                pose.headY-=3*collapse;pose.heartScale=mix(pose.heartScale,1,ease(t,3.5f,4));pose.redGlow*=1-ease(t,1.5f,2);
                for(int i=0;i<4;i++)pose.threads[i]=mix(anchor.threads[i],-6+i*3,ease(t,3.8f,5));
            } else {
                float lift=ease(t,.5f,1.2f),jerk=envelope(t-1.2f,.1f,.8f,1.6f)*strength;
                pose.rootY+=17*lift;pose.headAngle+=14*ease(t,1.2f,1.4f)*strength;
                pose.leftArm+=sin(t*31)*9*jerk;pose.rightArm+=sin(t*37+1)*10*jerk;
                pose.leftLeg+=sin(t*29)*7*jerk;pose.rightLeg+=sin(t*33+1)*7*jerk;
                pose.rootX+=sin(t*81)*1.1f*jerk;pose.redGlow=anchor.redGlow*(1-ease(t,0,.2f))+envelope(t-1.8f,.15f,.65f,1.3f);
                pose.heartGlow=anchor.heartGlow*(1-ease(t,0,.2f))+envelope(t-1.8f,.15f,.65f,1.3f);
                pose.rootScale*=1-.35f*ease(t,2.3f,2.9f);pose.rootScale*=1-ease(t,2.9f,3.5f);
                pose.alpha*=1-ease(t,3.15f,3.5f);
            }
            return;
        }
        idle(target,(float)motionTime);
        if(state==State.IDLE) {
            float age=(float)(elapsed-gestureAt),g=envelope(age,.16f,gestureDuration*.55f,gestureDuration)*strength;
            if(gesture==0)target.headAngle+=8*direction*g;
            if(gesture==1)target.leftArm-=12*g;
            if(gesture==2)for(int i=0;i<4;i++)if((needleMask&(1<<i))!=0)target.needles[i]=sin(age*(66+i*7)+i)*1.8f*envelope(age,.04f,.15f,.32f)*strength;
            if(gesture==4)target.headAngle+=10*direction*envelope(age,.55f,1.2f,2.1f)*strength;
            if(gesture==3&&age>=0&&age<gestureDuration){pose.copy(freeze);return;}
            if(gesture==3&&age>=gestureDuration)target.blend(freeze,target,ease(age,gestureDuration,gestureDuration+.25f));
        }
        pose.blend(anchor,target,ease((float)stateTime,0,config.timings.blend));
        if(state==State.SELECTED) {
            pose.blend(anchor,target,ease(t,1.8f,2.5f));
            float head=envelope(t-.3f,.16f,1.45f,2.2f)*strength;pose.headAngle-=8*head;pose.headY+=1.3f*head;
            pose.redGlow+=envelope(t-.6f,.25f,1.15f,1.85f);
            for(int i=0;i<4;i++)pose.needles[i]+=sin(t*80+i*.5f)*1.8f*envelope(t-1,.04f,.22f,.4f)*strength;
            if(t>=1.4f&&t<1.8f)pose.heartScale+=.15f*pulse((t-1.4f)/.4f*3,1);
        } else if(state==State.VICTORY) {
            float g=envelope(t,.25f,1.8f,2.8f)*strength;
            pose.leftArm-=50*g;pose.rightArm+=50*g;pose.headAngle-=6*g;pose.bodyAngle*=1-g;
            float hop=hop(t,.65f,.45f)+hop(t,1.35f,.45f);pose.rootY+=3.2f*hop*strength;
            pose.redGlow+=.7f*g;pose.heartScale+=.1f*pulse(t,4)*g;
            for(int i=0;i<4;i++)pose.needles[i]+=sin(t*65+i)*g*1.1f;
        } else if(state==State.DEFEAT) {
            float g=envelope(t,.6f,2.5f,3.2f)*strength;
            pose.headAngle+=12*g;pose.headY-=1.5f*g;pose.bodyAngle+=3*g;pose.leftArm+=8*g;pose.rightArm-=8*g;
            pose.heartScale+=.07f*pulse(t,1)*envelope(t,0,1.5f,2);

        }
    }
    private static double overlap(double a,double b,double start,double end){return Math.max(0,Math.min(b,end)-Math.max(a,start));}
    private static float hop(float t,float start,float duration){float p=(t-start)/duration;return p>0&&p<1?sin(p*3.1415927f):0;}
    private static float pulse(float time,float hz){float s=sin(time*3.1415927f*hz);return s*s;}
    public static float ease(float t,float a,float b){float p=Math.max(0,Math.min(1,(t-a)/(b-a)));return p*p*p*(p*(p*6-15)+10);}
    private static float envelope(float t,float attack,float hold,float end){return ease(t,0,Math.max(.00001f,attack))*(1-ease(t,hold,end));}
    private static float sin(float t){return (float)Math.sin(t);}private static float cos(float t){return (float)Math.cos(t);}
    private static float mix(float a,float b,float t){return a+(b-a)*t;}
}
