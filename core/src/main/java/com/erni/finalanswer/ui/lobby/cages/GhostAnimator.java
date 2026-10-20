package com.erni.finalanswer.ui.lobby.cages;

/** Pure delta-time procedural animation. All positions are design units for a ~143-unit ghost. */
public final class GhostAnimator {
    public enum State { IDLE, SCARED, HIT, DEATH }
    public static final float FLOAT_AMPLITUDE = 2.15f, FLOAT_SPEED = 1.05f;
    public static final float SCARED_SECONDS = .95f, HIT_SECONDS = .65f, DEATH_SECONDS = 2.7f;
    public static final class Pose {
        public float x, y, rotation, scaleX = 1, scaleY = 1, leftArm, rightArm, tail, detach;
        public float bodyAlpha = 1, tailAlpha = 1, eyesAlpha = 1, eyeLight = 1;
        void set(Pose p) {
            x=p.x;y=p.y;rotation=p.rotation;scaleX=p.scaleX;scaleY=p.scaleY;
            leftArm=p.leftArm;rightArm=p.rightArm;tail=p.tail;detach=p.detach;
            bodyAlpha=p.bodyAlpha;tailAlpha=p.tailAlpha;eyesAlpha=p.eyesAlpha;eyeLight=p.eyeLight;
        }
        void blend(Pose from, float a) {
            x=mix(from.x,x,a);y=mix(from.y,y,a);rotation=mix(from.rotation,rotation,a);
            scaleX=mix(from.scaleX,scaleX,a);scaleY=mix(from.scaleY,scaleY,a);
            leftArm=mix(from.leftArm,leftArm,a);rightArm=mix(from.rightArm,rightArm,a);tail=mix(from.tail,tail,a);
            detach=mix(from.detach,detach,a);bodyAlpha=mix(from.bodyAlpha,bodyAlpha,a);
            tailAlpha=mix(from.tailAlpha,tailAlpha,a);eyesAlpha=mix(from.eyesAlpha,eyesAlpha,a);eyeLight=mix(from.eyeLight,eyeLight,a);
        }
    }
    public final Pose pose = new Pose();
    private final Pose from = new Pose(), deathAnchor = new Pose();
    private State state = State.IDLE;
    private float time, age, stateTime, transition = 1, phase;
    private boolean reducedMotion;
    public State state() { return state; }
    public float stateTime() { return stateTime; }
    public float motionTime() { return time; }
    public float spawnAlpha() { return smooth(progress(age,0,.5f)); }
    public boolean finished() { return state == State.DEATH && stateTime >= DEATH_SECONDS; }
    public void setState(State next) {
        if (next == null) throw new IllegalArgumentException("Ghost state is required");
        if (next == state) return;
        from.set(pose); deathAnchor.set(pose); state = next; stateTime = transition = 0;
    }
    public void update(float delta, float phase, boolean reducedMotion) {
        if (!Float.isFinite(delta) || delta < 0) return;
        this.phase = phase; this.reducedMotion = reducedMotion;
        float previousStateTime = stateTime;
        age += delta; stateTime += delta; transition += delta;
        float rate = 1 + .025f * sin(phase * 1.37f);
        time += rate * (state == State.DEATH ? Math.max(0,stateTime-.24f)-Math.max(0,previousStateTime-.24f) : delta);
        if (state == State.DEATH) death();
        else {
            idle();
            if (state == State.SCARED) {
                float p = envelope(stateTime,.12f,.22f,SCARED_SECONDS);
                pose.y += 4*p; pose.scaleX -= .045f*p; pose.scaleY -= .025f*p;
                pose.leftArm -= 13*p; pose.rightArm += 16*p; pose.eyeLight += .85f*p;
            } else if (state == State.HIT) {
                float p = envelope(stateTime,.07f,.12f,HIT_SECONDS);
                pose.x -= 3.5f*p; pose.rotation -= 5*p; pose.eyeLight += 1.2f*p;
            }
            pose.blend(from,smooth(progress(transition,0,.16f)));
            if (state == State.SCARED && stateTime >= SCARED_SECONDS || state == State.HIT && stateTime >= HIT_SECONDS)
                setState(State.IDLE);
        }
    }
    private void idle() {
        float strength = reducedMotion ? .35f : 1;
        pose.x = sin(time*.59f+phase)*.65f*strength;
        pose.y = (sin(time*FLOAT_SPEED+phase)*FLOAT_AMPLITUDE + sin(time*.41f+phase*.7f)*.2f)*strength;
        pose.rotation = (sin(time*.73f+phase)*1.1f + sin(time*.31f+.8f+phase)*.2f)*strength;
        float breath = sin(time*.94f+phase);
        pose.scaleX = 1 + .003f*breath*strength; pose.scaleY = 1 - .002f*breath*strength;
        pose.leftArm = sin(time*1.13f+phase)*4.5f*strength;
        pose.rightArm = sin(time*1.01f+phase+1.45f)*5.3f*strength;
        pose.tail = (sin(time*1.47f+phase-.7f)*2.1f + sin(time*.63f+1.1f+phase)*.5f)*strength;
        pose.detach=0;pose.bodyAlpha=pose.tailAlpha=pose.eyesAlpha=1;
        // A broad, infrequent crest adds life without a flash or random frame noise.
        float crest = Math.max(0, sin(time*.23f+phase+1.8f));
        crest *= crest; crest *= crest; crest *= crest;
        pose.eyeLight=1 + strength*(.1f*sin(time*.82f+phase) + .18f*crest);
    }
    private void death() {
        pose.set(deathAnchor);
        float separate = smooth(progress(stateTime,.28f,1.05f));
        pose.detach = separate*15;
        pose.leftArm -= separate*22; pose.rightArm += separate*25;
        pose.bodyAlpha = deathAnchor.bodyAlpha*(1-smooth(progress(stateTime,.45f,1.65f)));
        pose.tailAlpha = deathAnchor.tailAlpha*(1-smooth(progress(stateTime,.85f,1.5f)));
        pose.eyesAlpha = deathAnchor.eyesAlpha*(1-smooth(progress(stateTime,1.7f,.95f)));
        pose.eyeLight = mix(deathAnchor.eyeLight,2.5f,smooth(progress(stateTime,0,.2f)));
        if (finished()) pose.bodyAlpha=pose.tailAlpha=pose.eyesAlpha=0;
    }
    public static float progress(float time,float start,float length) { return Math.max(0,Math.min(1,(time-start)/length)); }
    public static float smooth(float p) { return p*p*p*(p*(p*6-15)+10); }
    private static float envelope(float t,float attack,float hold,float duration) {
        return smooth(progress(t,0,attack))*(1-smooth(progress(t,hold,duration-hold)));
    }
    private static float sin(float value) { return (float)Math.sin(value); }
    private static float mix(float a,float b,float p) { return a+(b-a)*p; }
}
