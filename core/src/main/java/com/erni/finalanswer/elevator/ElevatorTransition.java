package com.erni.finalanswer.elevator;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.GL20;
import com.badlogic.gdx.graphics.OrthographicCamera;
import com.badlogic.gdx.graphics.Pixmap;
import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import com.badlogic.gdx.math.MathUtils;
import com.badlogic.gdx.math.Rectangle;
import com.badlogic.gdx.scenes.scene2d.utils.ScissorStack;
import com.badlogic.gdx.utils.Disposable;
import com.badlogic.gdx.utils.viewport.FitViewport;
import com.erni.finalanswer.elevator.ElevatorCinematicCamera.Layer;
import com.erni.finalanswer.elevator.ElevatorTransitionConfig.Door;
import com.erni.finalanswer.elevator.ElevatorTransitionConfig.SourceRect;
import com.erni.finalanswer.ui.play.QuizBackground;
import java.util.ArrayList;
import java.util.List;
import java.util.function.IntFunction;

/**
 * The cinematic elevator ride between two floors, drawn over the host's question screen:
 * <pre>
 * PREPARING → APPROACHING_ELEVATOR → OPENING_EXTERIOR_DOORS → ENTERING_ELEVATOR → CLOSING_INTERIOR_DOORS →
 * SELECTING_FLOOR → STARTING_MOVEMENT → MOVING → ARRIVING → OPENING_INTERIOR_DOORS → EXITING_ELEVATOR → COMPLETED
 * </pre>
 * Every state has a configured duration, a deterministic update and a completion condition; at most one state change
 * happens per frame and large deltas are clamped, so a stall never skips the sequence. Rendering is strictly layered:
 * departure floor → its outer door leaves (clipped to that doorway) → the cabin (whose doorway is transparent) with
 * the destination floor or the dark landing behind its clipped inner leaves → buttons, needle, lamps → grading.
 * The ride ends on the destination floor drawn exactly like the gameplay background, so the hand-off is invisible.
 */
public final class ElevatorTransition implements Disposable {
    public enum State {IDLE,PREPARING,APPROACHING_ELEVATOR,OPENING_EXTERIOR_DOORS,ENTERING_ELEVATOR,CLOSING_INTERIOR_DOORS,SELECTING_FLOOR,
        STARTING_MOVEMENT,MOVING,ARRIVING,OPENING_INTERIOR_DOORS,EXITING_ELEVATOR,COMPLETED}

    public static final float WORLD_W=1920,WORLD_H=1080;
    /** Point of the entering push (0..1) where the painted cabin is swapped for the real interior, at the bottom of the dip. */
    private static final float SWAP=.40f,CREEP=0f;
    /** Gameplay background framing (QuizBackground) — the first and last frames use it so the hand-offs are exact. */
    private static final float Z=QuizBackground.ZOOM;
    private final ElevatorTransitionConfig cfg;
    private final OrthographicCamera camera=new OrthographicCamera();private final FitViewport viewport=new FitViewport(WORLD_W,WORLD_H,camera);
    private final SpriteBatch batch;private final boolean ownsBatch;
    private final ElevatorCinematicCamera cine=new ElevatorCinematicCamera();
    private final ElevatorTransitionAudio audio;
    private final List<Texture> owned=new ArrayList<>();
    private final Texture cabin,cabinLeft,cabinRight,needle,pixel,glow,vignette;
    private final Texture[] buttons=new Texture[5];
    private final java.util.Map<Integer,Texture> floorTextures=new java.util.HashMap<>(),outerLeft=new java.util.HashMap<>(),outerRight=new java.util.HashMap<>(),reveals=new java.util.HashMap<>();
    private final ElevatorDoorAnimator outer,inner;
    private final Layer hallL=new Layer(),cabinL=new Layer(),destL=new Layer(),behindL=new Layer();
    private final Rectangle area=new Rectangle();
    private final Rectangle[] scissors={new Rectangle(),new Rectangle(),new Rectangle(),new Rectangle()};private final boolean[] pushed=new boolean[4];private int depth,blocked=-1;

    private State state=State.IDLE;private float stateTime,totalTime;
    private int from,to;private float carFloor;
    private boolean pressed;
    private Place hp,ip,dp;                                  // image fits, computed once per ride (no per-frame allocation)

    /**
     * @param sharedFloor floor backgrounds already loaded by the gameplay screen (may return null; then this class
     *                    loads the configured file itself). Shared textures are never disposed here.
     * @param batch       a batch to reuse, or null to create one
     */
    public ElevatorTransition(ElevatorTransitionConfig cfg,IntFunction<Texture> sharedFloor,SpriteBatch batch){
        this.cfg=cfg;ownsBatch=batch==null;this.batch=ownsBatch?new SpriteBatch():batch;
        cabin=load(cfg.interiorImage);cabinLeft=load(cfg.interiorLeft.image());cabinRight=load(cfg.interiorRight.image());needle=load(cfg.needleImage);
        for(var b:cfg.buttons)buttons[b.floor()-1]=load(b.image());
        for(var f:cfg.floors){
            Texture t=sharedFloor==null?null:sharedFloor.apply(f.number());floorTextures.put(f.number(),t!=null?t:load(f.background()));
            if(f.exterior()!=null){outerLeft.put(f.number(),load(f.exterior().left().image()));outerRight.put(f.number(),load(f.exterior().right().image()));
                if(f.exterior().reveal()!=null)reveals.put(f.number(),load(f.exterior().reveal().image()));}
        }
        pixel=own(solid());glow=own(glowTexture());vignette=own(vignetteTexture());
        outer=new ElevatorDoorAnimator(cfg.t("exteriorOpen"),1);inner=new ElevatorDoorAnimator(cfg.t("interiorClose"),1);
        audio=new ElevatorTransitionAudio(cfg);
        camera.position.set(WORLD_W/2,WORLD_H/2,0);
    }
    public static ElevatorTransitionConfig loadConfig(){return ElevatorTransitionConfig.parse(Gdx.files.internal("elevator/elevator_transition.json").readString("UTF-8"));}

    // ================= control =================
    public boolean supports(int fromFloor,int toFloor){return cfg.supports(fromFloor,toFloor);}
    /** Starts a ride; ignored while one is already running (no simultaneous or repeated triggers). */
    public boolean start(int fromFloor,int toFloor){
        if(active()||!supports(fromFloor,toFloor))return false;
        from=fromFloor;to=toFloor;carFloor=from;pressed=false;totalTime=0;cine.reset();
        var ex=cfg.floor(from).exterior();outer.snap(ex.startsOpen()?1:0);inner.snap(1);
        var hf=cfg.floor(from);var df=cfg.floor(to);hp=place(hf.w(),hf.h());ip=place(cfg.interiorW,cfg.interiorH);dp=place(df.w(),df.h());
        go(State.PREPARING);
        if(ex.startsOpen()){outer.setDuration(Math.max(.6f,cfg.t("prepare")-.25f));}
        return true;
    }
    public boolean active(){return state!=State.IDLE&&state!=State.COMPLETED;}
    public boolean completed(){return state==State.COMPLETED;}
    public State state(){return state;}
    public float stateTime(){return stateTime;}
    public int destination(){return to;}
    /** Jumps to the end state (skip) — the game resumes in the same valid state as after a full ride. */
    public void skip(){if(active()){audio.stopLoop();cine.reset();carFloor=to;go(State.COMPLETED);}}
    /** Abort and return to idle (e.g. the screen is leaving). */
    public void cancel(){audio.stopLoop();cine.reset();state=State.IDLE;}
    /** Back to idle after the caller has handed over to gameplay. */
    public void reset(){if(state==State.COMPLETED)state=State.IDLE;}
    /** How much of the gameplay screen should still show underneath (the question UI fading away at the start). */
    public float gameplayOverlayAlpha(){return state==State.PREPARING?1-ElevatorCinematicCamera.smoother(stateTime/.6f):0;}
    public java.util.Set<String> missingSounds(){return audio.missing;}
    public java.util.Set<String> playedSounds(){return audio.played;}
    public float needleAngle(){return cfg.needleAngle(carFloor);}
    public float carFloor(){return carFloor;}
    public float exteriorOpenness(){return outer.openness();}
    public float interiorOpenness(){return inner.openness();}
    public void resize(int w,int h){viewport.update(w,h,true);}

    private void go(State s){state=s;stateTime=0;enter(s);}
    private float dur(State s){return switch(s){
        case PREPARING->cfg.t("prepare");case APPROACHING_ELEVATOR->cfg.t("approach");case OPENING_EXTERIOR_DOORS->cfg.t("exteriorOpen")+cfg.t("exteriorSettle");
        case ENTERING_ELEVATOR->cfg.t("enter");case CLOSING_INTERIOR_DOORS->cfg.t("interiorClose")+cfg.t("interiorSettle");case SELECTING_FLOOR->cfg.t("selectFloor");
        case STARTING_MOVEMENT->cfg.t("startMovement");case MOVING->cfg.t("moving");case ARRIVING->cfg.t("arriving");
        case OPENING_INTERIOR_DOORS->cfg.t("doorDelay")+cfg.t("interiorOpen");case EXITING_ELEVATOR->cfg.t("exit");default->Float.MAX_VALUE;};}
    private void enter(State s){
        switch(s){
            case PREPARING->{}
            case OPENING_EXTERIOR_DOORS->{outer.setDuration(cfg.t("exteriorOpen"));outer.open();audio.play("exterior_doors_open");}
            case ENTERING_ELEVATOR->{inner.snap(1);audio.play("enter");}
            case CLOSING_INTERIOR_DOORS->{inner.setDuration(cfg.t("interiorClose"));inner.close();audio.play("interior_doors_close");}
            case SELECTING_FLOOR->{audio.play("button");}
            case STARTING_MOVEMENT->{audio.play("motor_start");audio.play("vibration");}
            case MOVING->audio.play("movement_loop");
            case ARRIVING->audio.play("slowing");
            case OPENING_INTERIOR_DOORS->{audio.stopLoop();cine.bump(cfg.cam("arrivalBump"));audio.play("stop");audio.play("bell");}
            case EXITING_ELEVATOR->audio.play("exit");
            case COMPLETED->audio.stopLoop();
            default->{}
        }
    }
    /** A state is done when its time is up AND its physical condition holds (doors really at rest). */
    private boolean done(State s){
        if(stateTime<dur(s))return false;
        return switch(s){case OPENING_EXTERIOR_DOORS->outer.fullyOpen();case CLOSING_INTERIOR_DOORS->inner.fullyClosed();case OPENING_INTERIOR_DOORS->inner.fullyOpen();default->true;};
    }
    private State next(State s){return s==State.EXITING_ELEVATOR?State.COMPLETED:State.values()[s.ordinal()+1];}

    // ================= simulation =================
    public void update(float delta){
        if(state==State.IDLE)return;
        float dt=Float.isFinite(delta)?MathUtils.clamp(delta,0,.1f):0;
        stateTime+=dt;totalTime+=dt;
        outer.update(dt);inner.update(dt);cine.update(dt);
        float u=MathUtils.clamp(stateTime/Math.min(dur(state),1e6f),0,1);
        switch(state){
            case PREPARING->{if(cfg.floor(from).exterior().startsOpen()&&stateTime>=.2f&&outer.openness()>=1&&!outer.moving()){outer.close();audio.play("exterior_doors_close");}}
            case CLOSING_INTERIOR_DOORS->{if(inner.justSettled()&&inner.fullyClosed())cine.bump(2.4f);}
            case SELECTING_FLOOR->pressed=true;
            case STARTING_MOVEMENT->{cine.judder(cfg.cam("vibrationStart")*MathUtils.sin(u*MathUtils.PI));cine.hum(cfg.cam("vibrationMoving")*u);}
            case MOVING->{cine.judder(0);cine.hum(cfg.cam("vibrationMoving"));}
            case ARRIVING->{cine.hum(cfg.cam("vibrationMoving")*(1-u));cine.judder(cfg.cam("vibrationStart")*.5f*MathUtils.sin(u*MathUtils.PI));}
            case OPENING_INTERIOR_DOORS->{cine.hum(0);cine.judder(0);if(stateTime>=cfg.t("doorDelay")&&!inner.moving()&&inner.openness()<1){inner.setDuration(cfg.t("interiorOpen"));inner.open();audio.play("interior_doors_open");}}
            default->{}
        }
        // car position: one eased travel across start → moving → arriving, so the needle accelerates and settles
        float ride=cfg.t("startMovement")+cfg.t("moving")+cfg.t("arriving"),rt=switch(state){
            case STARTING_MOVEMENT->stateTime;case MOVING->cfg.t("startMovement")+stateTime;case ARRIVING->cfg.t("startMovement")+cfg.t("moving")+stateTime;default->-1;};
        if(rt>=0)carFloor=from+(to-from)*ElevatorCinematicCamera.smoother(rt/ride);
        else if(state.ordinal()>State.ARRIVING.ordinal())carFloor=to;
        if(done(state))go(next(state));     // at most one state change per frame
    }

    // ================= rendering =================
    /** Draws the current frame. The caller has already drawn the gameplay screen when {@link #gameplayOverlayAlpha()} > 0. */
    public void render(){
        if(state==State.IDLE)return;
        viewport.apply();camera.update();batch.setProjectionMatrix(camera.combined);
        Gdx.gl.glEnable(GL20.GL_BLEND);
        batch.begin();batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);
        float sx=cine.shakeX(),sy=cine.shakeY(),cx=WORLD_W/2,cy=WORLD_H/2;
        float a=state==State.PREPARING?ElevatorCinematicCamera.smoother(stateTime/.6f):1;        // over the fading question UI
        var hall=cfg.floor(from);
        SourceRect hd=hall.exterior().doorway();float hdx=hp.x(hd.x()),hdy=hp.y(hd.y(),hd.h()),hdw=hd.w()*hp.k,hdh=hd.h()*hp.k,hcx=hdx+hdw/2,hcy=hdy+hdh/2;
        SourceRect cd=cfg.interiorDoorway;float cdx=ip.x(cd.x()),cdy=ip.y(cd.y(),cd.h()),cdw=cd.w()*ip.k,cdh=cd.h()*ip.k,ccx=cdx+cdw/2,ccy=cdy+cdh/2;
        float az=cfg.cam("approachZoom"),over=cfg.cam("overscan"),s0x=cx+(hcx-cx)*Z,s0y=cy+(hcy-cy)*Z;   // s0: where the gameplay zoom puts the doorway
        switch(state){
            case PREPARING->{hallL.set(Z,hcx,hcy,s0x+sx,s0y+sy);drawHall(hall,hp,hd,hallL,a,0);grade(a);}
            case APPROACHING_ELEVATOR->{float e=ElevatorCinematicCamera.smoother(stateTime/dur(state));
                hallL.set(Z,hcx,hcy,s0x+sx,s0y+sy);drawHall(hall,hp,hd,hallL,1,.22f*e);grade(1);}
            case OPENING_EXTERIOR_DOORS->{float cu=MathUtils.clamp(stateTime/dur(state),0,1),creep=1+CREEP*cu*cu*cu;   // eases in: the camera starts drifting toward the opening doors
                hallL.set(Z,hcx,hcy,s0x+sx,s0y+sy);drawHall(hall,hp,hd,hallL,1,.22f);grade(1);}
            case ENTERING_ELEVATOR->{float u=MathUtils.clamp(stateTime/dur(state),0,1),h0=az*(1+CREEP),is0=hdh*h0*over/ip.h,hEnd=h0/is0;   // the push ends exactly when the cabin fills the frame
                float k=az*CREEP*3/dur(State.OPENING_EXTERIOR_DOORS)*dur(state)/(h0*(float)Math.log(hEnd/h0));      // match the creep's exit speed
                float e=k*u+(3-2*k)*u*u+(k-2)*u*u*u,hs=ElevatorCinematicCamera.zoom(h0,hEnd,e);
                float is=is0*hs/h0;   // cabin rigidly attached to the doorway: no parallax drift, it never recedes
                float hallA=1-ElevatorCinematicCamera.smoother((u-.62f)/.23f);boolean swapped=u>=SWAP;          // the painted cabin is replaced inside a brief dip to dark
                float px=MathUtils.lerp(s0x,cx,e),py=MathUtils.lerp(s0y,cy,e);cabinL.set(is,cx,cy,px+sx,py+sy);hallL.set(hs,hcx,hcy,px+sx,py+sy);
                if(hallA<1)drawCabin(ip,cd,cabinL,1,false);                                            // the cabin behind the fading hall
                if(hallA>0){drawHall(hall,hp,hd,hallL,hallA,.22f);
                    if(u>.08f&&u<.75f){float mb=MathUtils.sin((u-.08f)/.67f*MathUtils.PI)*.16f;        // a breath of motion blur on the push
                        hallL.set(hs*1.018f,hcx,hcy,px+sx,py+sy);drawHall(hall,hp,hd,hallL,hallA*mb,0);hallL.set(hs,hcx,hcy,px+sx,py+sy);}
                    // inside the hall's doorway, the cabin takes over from the painted one
                    if(swapped){clip(hallL,hdx,hdy,hdw,hdh);drawCabin(ip,cd,cabinL,1,false);unclip();}}
                grade(1-ElevatorCinematicCamera.smoother((u-SWAP+.06f)/.12f));                    // the room grading lifts inside the dip
                float flare=(float)Math.exp(-Math.pow((u-SWAP)/.085f,2));                            // stepping into the warm cabin light
                batch.setColor(.03f,.015f,0,.18f*MathUtils.sin(u*MathUtils.PI));batch.draw(pixel,-50,-50,WORLD_W+100,WORLD_H+100);
                batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);batch.setColor(1,.70f,.38f,.92f*flare);batch.draw(pixel,-50,-50,WORLD_W+100,WORLD_H+100);
                batch.setColor(1,.85f,.6f,.5f*flare);batch.draw(glow,cx-900,cy-700,1800,1400);batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);}
            case CLOSING_INTERIOR_DOORS,SELECTING_FLOOR,STARTING_MOVEMENT,MOVING,ARRIVING->{cabinL.set(1,cx,cy,cx+sx,cy+sy);drawCabin(ip,cd,cabinL,1,false);}
            case OPENING_INTERIOR_DOORS->{cabinL.set(1,cx,cy,cx+sx,cy+sy);float ls=dp.h>0?cdh*over/dp.h:1;destL.set(ls,cx,cy,ccx+sx,ccy+sy);
                drawCabinWithDestination(ip,cd,dp,cabinL,destL,1);}
            case EXITING_ELEVATOR->{float u=MathUtils.clamp(stateTime/dur(state),0,1),e=ElevatorCinematicCamera.smoother(u);
                // walking out: the room is rigidly attached to the doorway (one camera, no parallax drift), so nothing
                // shrinks away or pops in — the push simply ends when the room fills the frame at the gameplay zoom
                float l0=cdh*over/dp.h,csEnd=Z/l0,cs=ElevatorCinematicCamera.zoom(1,csEnd,e),ls=l0*cs;
                float fx=MathUtils.lerp(ccx,cx,e),fy=MathUtils.lerp(ccy,cy,e);
                cabinL.set(cs,ccx,ccy,fx+sx,fy+sy);destL.set(ls,cx,cy,fx+sx,fy+sy);drawFull(floorTextures.get(to),dp,destL,1);
                drawCabinWithDestination(ip,cd,dp,cabinL,destL,1-ElevatorCinematicCamera.smoother((u-.75f)/.25f));
                grade(e);}
            case COMPLETED->{destL.set(Z,cx,cy,cx,cy);drawFull(floorTextures.get(to),dp,destL,1);grade(1);}
            default->{}
        }
        batch.setColor(1,1,1,1);batch.end();
    }

    /** The gameplay room grading (QuizBackground: dim, top and bottom shades, vignette), weighted 0..1. */
    private void grade(float w){
        if(w<=0)return;batch.setColor(0,0,0,QuizBackground.DIM*w);batch.draw(pixel,-50,-50,WORLD_W+100,WORLD_H+100);
        shade(0,WORLD_H*(1-QuizBackground.TOP_SHADE_HEIGHT),WORLD_W,WORLD_H*QuizBackground.TOP_SHADE_HEIGHT,0,QuizBackground.TOP_SHADE*w);
        shade(0,0,WORLD_W,WORLD_H*QuizBackground.BOTTOM_SHADE_HEIGHT,QuizBackground.BOTTOM_SHADE*w,0);
        batch.setColor(1,1,1,w);batch.draw(vignette,0,0,WORLD_W,WORLD_H);batch.setColor(1,1,1,1);
    }
    private final float[] quad=new float[20];
    private void shade(float x,float y,float w,float h,float bottom,float top){
        v(0,x,y,bottom,0,1);v(5,x,y+h,top,0,0);v(10,x+w,y+h,top,1,0);v(15,x+w,y,bottom,1,1);batch.setColor(1,1,1,1);batch.draw(pixel,quad,0,20);
    }
    private void v(int o,float x,float y,float a,float u,float vv){quad[o]=x;quad[o+1]=y;quad[o+2]=Color.toFloatBits(0,0,0,a);quad[o+3]=u;quad[o+4]=vv;}

    /** Fit of a source image covering the world, keeping its aspect ratio. */
    private record Place(float k,float ox,float oy,float w,float h,float srcH){
        float x(float srcX){return ox+srcX*k;}
        float y(float srcTop,float srcHeight){return oy+(srcH-srcTop-srcHeight)*k;}
    }
    private static Place place(float w,float h){float k=Math.max(WORLD_W/w,WORLD_H/h);return new Place(k,(WORLD_W-w*k)/2,(WORLD_H-h*k)/2,w*k,h*k,h);}

    private void drawFull(Texture t,Place p,Layer l,float alpha){batch.setColor(1,1,1,alpha);rect(t,p.ox,p.oy,p.w,p.h,l);}
    private void rect(Texture t,float x,float y,float w,float h,Layer l){if(blocked>=0)return;batch.draw(t,l.x(x),l.y(y),w*l.s,h*l.s);}

    /** Departure floor with its outer leaves clipped to the doorway, a warm spill as they part, and darkening. */
    private void drawHall(ElevatorTransitionConfig.ElevatorFloorConfig f,Place p,SourceRect d,Layer l,float alpha,float dim){
        drawFull(floorTextures.get(f.number()),p,l,alpha);
        float dx=p.x(d.x()),dy=p.y(d.y(),d.h()),dw=d.w()*p.k,dh=d.h()*p.k,o=outer.openness();
        clip(l,dx,dy,dw,dh);
        var rv=f.exterior().reveal();if(o>0&&rv!=null){batch.setColor(1,1,1,alpha);rect(reveals.get(f.number()),p.x(rv.x()),p.y(rv.y(),rv.h()),rv.w()*p.k,rv.h()*p.k,l);}   // the open painting behind the leaves
        if(o>0){batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);batch.setColor(1,.72f,.42f,.28f*o*alpha);rect(glow,dx-dw*.3f,dy-dh*.1f,dw*1.6f,dh*1.2f,l);batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);}
        if(o<1)drawLeaves(f.exterior().left(),f.exterior().right(),outerLeft.get(f.number()),outerRight.get(f.number()),outer,p,l,alpha,dx,dy,dw,dh);
        unclip();
        if(o>0){batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);float g=o*o*(3-2*o)*alpha;       // the cabin's light spills out across the carpet
            batch.setColor(1,.68f,.36f,.22f*g);rect(glow,dx-dw*.9f,dy-dh*.75f,dw*2.8f,dh*1.1f,l);
            batch.setColor(1,.78f,.5f,.12f*g);rect(glow,dx-dw*.15f,dy-dh*.05f,dw*1.3f,dh*1.15f,l);
            batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);}
        if(dim>0){batch.setColor(0,0,0,dim*alpha);batch.draw(pixel,-50,-50,WORLD_W+100,WORLD_H+100);batch.setColor(1,1,1,alpha*dim/.22f);batch.draw(vignette,-40,-30,WORLD_W+80,WORLD_H+60);batch.draw(vignette,-40,-30,WORLD_W+80,WORLD_H+60);}
    }
    private void drawLeaves(Door L,Door R,Texture tl,Texture tr,ElevatorDoorAnimator anim,Place p,Layer l,float alpha,float dx,float dy,float dw,float dh){
        float o=anim.openness(),so=anim.settleOffset();
        float lx=MathUtils.lerp(L.closedX(),L.openX(),o)-so,rx=MathUtils.lerp(R.closedX(),R.openX(),o)+so;
        batch.setColor(1,1,1,alpha);rect(tl,p.x(lx),p.y(L.y(),L.h()),L.w()*p.k,L.h()*p.k,l);rect(tr,p.x(rx),p.y(R.y(),R.h()),R.w()*p.k,R.h()*p.k,l);
        if(o>.001f&&o<.999f){float gap=(rx-(lx+L.w()))*p.k,k=MathUtils.clamp(gap/(40*p.k),0,1),e=6*p.k;   // contact shadows on the moving edges
            batch.setColor(0,0,0,.45f*k*alpha);rect(pixel,p.x(lx+L.w()),dy,e,dh,l);rect(pixel,p.x(rx)-e,dy,e,dh,l);}
        batch.setColor(0,0,0,.28f*alpha);rect(pixel,dx,dy,5*p.k,dh,l);rect(pixel,dx+dw-5*p.k,dy,5*p.k,dh,l);         // jamb shade
    }
    /** The cabin; behind its doorway the dark landing of the departure floor (or nothing when {@code destination} draws). */
    private void drawCabin(Place p,SourceRect d,Layer l,float alpha,boolean destinationBehind){
        float dx=p.x(d.x()),dy=p.y(d.y(),d.h()),dw=d.w()*p.k,dh=d.h()*p.k;
        if(!destinationBehind&&inner.openness()>0){clip(l,dx,dy,dw,dh);                              // the floor being left, seen through the open doors
            float bs=dh*cfg.cam("overscan")/hp.h;behindL.set(l.s*bs,WORLD_W/2,WORLD_H/2,l.x(dx+dw/2),l.y(dy+dh/2));
            batch.setColor(.62f,.56f,.52f,alpha);rect(floorTextures.get(from),hp.ox,hp.oy,hp.w,hp.h,behindL);
            batch.setColor(0,0,0,.25f*alpha);rect(pixel,dx,dy,dw,dh,l);
            unclip();}
        cabinFront(p,d,l,alpha);
    }
    private void drawCabinWithDestination(Place ip,SourceRect d,Place dp,Layer cabinLayer,Layer destLayer,float cabinAlpha){
        float dx=ip.x(d.x()),dy=ip.y(d.y(),d.h()),dw=d.w()*ip.k,dh=d.h()*ip.k;
        if(cabinAlpha<1)drawFull(floorTextures.get(to),dp,destLayer,1);
        else{clip(cabinLayer,dx,dy,dw,dh);drawFull(floorTextures.get(to),dp,destLayer,1);unclip();}
        if(cabinAlpha>0)cabinFront(ip,d,cabinLayer,cabinAlpha);
    }
    /** Inner leaves (clipped), cabin painting, buttons, needle and lamps. */
    private void cabinFront(Place p,SourceRect d,Layer l,float alpha){
        float dx=p.x(d.x()),dy=p.y(d.y(),d.h()),dw=d.w()*p.k,dh=d.h()*p.k;
        if(inner.openness()<1){clip(l,dx,dy,dw,dh);drawLeaves(cfg.interiorLeft,cfg.interiorRight,cabinLeft,cabinRight,inner,p,l,alpha,dx,dy,dw,dh);unclip();}
        batch.setColor(1,1,1,alpha);rect(cabin,p.ox,p.oy,p.w,p.h,l);
        float light=lightLevel();
        // floor buttons: the destination lights from the selection until the car has arrived
        for(var b:cfg.buttons){float bx=p.x(b.cx()),by=p.y(b.cy(),0),s=b.size()*p.k;boolean target=b.floor()==to&&pressed;
            float lit=target?buttonLight():0;
            if(target&&state==State.SELECTING_FLOOR&&stateTime<.16f){batch.setColor(0,0,0,.45f*alpha);rect(pixel,bx-s*.36f,by-s*.36f,s*.72f,s*.72f,l);}   // the press
            if(lit>0){batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);
                batch.setColor(1,.30f,.16f,.85f*lit*alpha);rect(buttons[b.floor()-1],bx-s/2,by-s/2,s,s,l);
                batch.setColor(1,.22f,.10f,.55f*lit*alpha);rect(glow,bx-s*1.5f,by-s*1.5f,s*3,s*3,l);
                batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);}}
        // floor needle about its painted pivot
        float px=p.x(cfg.needlePivotX),py=p.y(cfg.needlePivotY,0),nw=cfg.needleW*p.k,nh=cfg.needleH*p.k,ox=cfg.needleSpritePivotX*p.k,oy=cfg.needleSpritePivotY*p.k;
        float tremble=state==State.MOVING||state==State.STARTING_MOVEMENT?MathUtils.sin(totalTime*37)*.35f:0;
        float wx=l.x(px),wy=l.y(py);batch.setColor(1,1,1,alpha);
        batch.draw(needle,wx-ox*l.s,wy-oy*l.s,ox*l.s,oy*l.s,nw*l.s,nh*l.s,1,1,needleAngle()-90+tremble,0,0,needle.getWidth(),needle.getHeight(),false,false);
        // lamps breathe with the light level
        batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);
        for(var lamp:cfg.lamps){float lx=p.x(lamp.x()),ly=p.y(lamp.y(),0),r=lamp.radius()*p.k;batch.setColor(1,.70f,.40f,.16f*light*alpha);rect(glow,lx-r,ly-r,r*2,r*2,l);}
        for(int i=0;i<46;i++){float ph=(totalTime*.025f+h(i*7+3))%1f,mx=p.x(300+h(i)*940)+MathUtils.sin(totalTime*.35f+i)*14,my=p.y(70+ph*700,0);   // dust drifting in the lamp light
            float tw=.5f+.5f*MathUtils.sin(totalTime*1.3f+i*2.1f),sz=(1.5f+h(i*3)*2.5f)*p.k;batch.setColor(1,.85f,.6f,.20f*tw*light*alpha*MathUtils.sin(ph*MathUtils.PI));rect(glow,mx-sz,my-sz,sz*2,sz*2,l);}
        if(state==State.MOVING||state==State.STARTING_MOVEMENT||state==State.ARRIVING){                  // light of floors sliding past the door seam
            float ride=cfg.t("startMovement")+cfg.t("moving")+cfg.t("arriving"),rt=(state==State.STARTING_MOVEMENT?0:state==State.MOVING?cfg.t("startMovement"):cfg.t("startMovement")+cfg.t("moving"))+stateTime;
            float pass=(rt/ride*1.6f)%1f,band=dy+dh*(1.25f-1.5f*pass),seam=p.x(cfg.interiorLeft.closedX()+cfg.interiorLeft.w());
            clip(l,dx,dy,dw,dh);batch.setColor(1,.78f,.48f,.55f*alpha*MathUtils.sin(pass*MathUtils.PI));rect(glow,seam-10*p.k,band-70*p.k,20*p.k,140*p.k,l);
            batch.setColor(1,.7f,.4f,.10f*alpha*MathUtils.sin(pass*MathUtils.PI));rect(glow,dx-dw*.2f,band-40*p.k,dw*1.4f,80*p.k,l);unclip();}
        if(inner.openness()>0&&state.ordinal()>=State.OPENING_INTERIOR_DOORS.ordinal()){float o=inner.openness(),g=o*o*(3-2*o);   // cool library light reaching into the cabin
            batch.setColor(.55f,.75f,1,.14f*g*alpha);rect(glow,dx-dw*.8f,dy-dh*.55f,dw*2.6f,dh*1.0f,l);}
        batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);
        if(light<1){batch.setColor(0,0,0,(1-light)*.6f*alpha);batch.draw(pixel,-50,-50,WORLD_W+100,WORLD_H+100);}
    }
    private float buttonLight(){
        return switch(state){case SELECTING_FLOOR->ElevatorCinematicCamera.smoother(stateTime/.35f);case STARTING_MOVEMENT,MOVING->.9f+.1f*MathUtils.sin(totalTime*4);
            case ARRIVING->1-ElevatorCinematicCamera.smoother(stateTime/dur(state));default->0;};
    }
    /** Cabin light: steady; a gentle dip while the motor engages; soft irregular fluctuations on the way up. */
    private float lightLevel(){
        return switch(state){
            case STARTING_MOVEMENT->1-.12f*MathUtils.sin(MathUtils.clamp(stateTime/dur(state),0,1)*MathUtils.PI);
            case MOVING->{float n=noise(totalTime*3.1f);yield 1-(n>.78f?(n-.78f)/.22f*.16f:0)-.03f*(1+MathUtils.sin(totalTime*1.3f))/2;}
            case ARRIVING->1-.06f*MathUtils.sin(MathUtils.clamp(stateTime/dur(state),0,1)*MathUtils.PI);
            default->1;};
    }

    /** ScissorStack keeps references to the pushed rectangles, so every nesting level needs its own instance. */
    private void clip(Layer l,float x,float y,float w,float h){
        batch.flush();Rectangle r=scissors[depth];area.set(l.x(x),l.y(y),w*l.s,h*l.s);viewport.calculateScissors(batch.getTransformMatrix(),area,r);
        pushed[depth]=ScissorStack.pushScissors(r);depth++;
        if(!pushed[depth-1]&&blocked<0)blocked=depth-1;          // empty intersection: draw nothing until this level is closed
    }
    private void unclip(){batch.flush();depth--;if(pushed[depth])ScissorStack.popScissors();if(blocked==depth)blocked=-1;}

    private static float noise(float x){int i=(int)Math.floor(x);float f=x-i,u=f*f*(3-2*f);return MathUtils.lerp(h(i),h(i+1),u);}
    private static float h(int i){float v=MathUtils.sin(i*127.1f+311.7f)*43758.5453f;return v-(float)Math.floor(v);}

    private Texture load(String path){Texture t=new Texture(Gdx.files.internal(path),true);t.setFilter(Texture.TextureFilter.MipMapLinearLinear,Texture.TextureFilter.Linear);return own(t);}
    private Texture own(Texture t){owned.add(t);return t;}
    private static Texture solid(){Pixmap p=new Pixmap(1,1,Pixmap.Format.RGBA8888);p.setColor(Color.WHITE);p.fill();Texture t=new Texture(p);p.dispose();return t;}
    private static Texture glowTexture(){int n=128;Pixmap p=new Pixmap(n,n,Pixmap.Format.RGBA8888);p.setBlending(Pixmap.Blending.None);
        for(int y=0;y<n;y++)for(int x=0;x<n;x++){float dx=(x+.5f)/n*2-1,dy=(y+.5f)/n*2-1,d=(float)Math.sqrt(dx*dx+dy*dy),a=Math.max(0,1-d);a=a*a*(3-2*a);p.drawPixel(x,y,Color.rgba8888(1,1,1,a));}
        Texture t=new Texture(p);p.dispose();t.setFilter(Texture.TextureFilter.Linear,Texture.TextureFilter.Linear);return t;}
    /** Same falloff as the gameplay background's vignette (QuizBackground): colour *= 1 - .19·smoothstep(.28,.73,|(uv-.5)·(1,.85)|). */
    private static Texture vignetteTexture(){int w=320,h=180;Pixmap p=new Pixmap(w,h,Pixmap.Format.RGBA8888);p.setBlending(Pixmap.Blending.None);
        for(int y=0;y<h;y++)for(int x=0;x<w;x++){float u=(x+.5f)/w-.5f,v=((y+.5f)/h-.5f)*.85f,d=(float)Math.sqrt(u*u+v*v),t=MathUtils.clamp((d-.28f)/(.73f-.28f),0,1);p.drawPixel(x,y,Color.rgba8888(0,0,0,.19f*t*t*(3-2*t)));}
        Texture t=new Texture(p);p.dispose();t.setFilter(Texture.TextureFilter.Linear,Texture.TextureFilter.Linear);return t;}

    @Override public void dispose(){audio.dispose();for(Texture t:owned)t.dispose();owned.clear();if(ownsBatch)batch.dispose();}
}
