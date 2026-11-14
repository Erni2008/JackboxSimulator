package com.erni.finalanswer.lwjgl3;

import com.badlogic.gdx.*;
import com.badlogic.gdx.backends.lwjgl3.*;
import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import com.badlogic.gdx.utils.ScreenUtils;
import com.badlogic.gdx.utils.viewport.FitViewport;
import com.erni.finalanswer.elevator.ElevatorTransition;
import com.erni.finalanswer.elevator.ElevatorTransition.State;
import com.erni.finalanswer.elevator.ElevatorEventType;
import java.util.*;

/**
 * Runtime QA for the cinematic FLOOR 1 -> FLOOR 2 elevator, with the real processed assets.
 * Interactive (loops, SPACE restarts, S skips): ./gradlew :lwjgl3:elevatorTransitionPreview
 * Capture: -Pel.capture=/abs/dir  → screenshots of every key moment + frame-rate/timing checks, then exits.
 * Horror events: -Pel.event=EMERGENCY_STOP|…|NONE forces one; interactively 1-5 trigger an event while cruising,
 * 0 = no events, R = random again. -Pel.events=/abs/dir → event checks + per-phase captures, exits.
 */
public final class ElevatorTransitionPreview {
    public static void main(String[] args){
        var c=new Lwjgl3ApplicationConfiguration();c.setTitle("FINAL ANSWER / лифт: этаж 1 → этаж 2");
        String capture=System.getProperty("el.capture","");String eventsDir=System.getProperty("el.events","");String forced=System.getProperty("el.event","");
        c.setWindowedMode(Integer.getInteger("el.width",1600),Integer.getInteger("el.height",900));c.setForegroundFPS(60);if(!capture.isEmpty()||!eventsDir.isEmpty())c.disableAudio(true);
        new Lwjgl3Application(new ApplicationAdapter(){
            ElevatorTransition elevator;SpriteBatch batch;Texture hall;FitViewport stageView;
            final List<float[]> marks=new ArrayList<>();final List<String> names=new ArrayList<>();int next;float clock;
            void mark(String name,State s,float at){names.add(name);marks.add(new float[]{s.ordinal(),at});}
            @Override public void create(){
                batch=new SpriteBatch();hall=new Texture(Gdx.files.internal("backgrounds/play/questions_01_02/01.1.png"));stageView=new FitViewport(1600,900);
                elevator=new ElevatorTransition(ElevatorTransition.loadConfig(),null,null);
                if(!forced.isEmpty()){if(forced.equals("NONE"))elevator.events().debugForceNone();else elevator.events().debugForce(ElevatorEventType.valueOf(forced));}
                if(!eventsDir.isEmpty()){eventChecks();eventQueue.addAll(List.of(ElevatorEventType.values()));nextEventRun();return;}
                if(!capture.isEmpty()){timingChecks();}
                elevator.start(1,2);
                mark("00_gameplay_handoff_start",State.PREPARING,0.02f);mark("01_ui_fading_doors_closing",State.PREPARING,.6f);mark("02_doors_closed_before_approach",State.APPROACHING_ELEVATOR,0.01f);
                mark("03_approach_mid",State.APPROACHING_ELEVATOR,.75f);
                for(int p:new int[]{0,25,50,75,100})mark(String.format("04_exterior_open_%03d",p),State.OPENING_EXTERIOR_DOORS,p==0?0.001f:openTime(p/100f));
                for(float u:new float[]{.15f,.35f,.55f,.75f,.98f})mark(String.format("05_enter_%02d",(int)(u*100)),State.ENTERING_ELEVATOR,u*1.6f);
                mark("06_interior_closing_50",State.CLOSING_INTERIOR_DOORS,.9f);mark("07_interior_closed",State.CLOSING_INTERIOR_DOORS,2.0f);
                mark("08_button2_selected",State.SELECTING_FLOOR,.5f);mark("09_start_judder",State.STARTING_MOVEMENT,.4f);
                mark("10_moving_needle_mid",State.MOVING,1.5f);mark("11_arriving",State.ARRIVING,.6f);
                for(int p:new int[]{0,25,50,75,100})mark(String.format("12_library_reveal_%03d",p),State.OPENING_INTERIOR_DOORS,.3f+(p==0?0.001f:openTime(p/100f)));
                for(float u:new float[]{.25f,.5f,.75f})mark(String.format("13_exit_%02d",(int)(u*100)),State.EXITING_ELEVATOR,u*1.6f);
                mark("14_completed_library",State.COMPLETED,0.05f);
            }
            /** time (s) at which an eased 1.8 s door reaches a ratio */
            float openTime(float r){var m=com.erni.finalanswer.elevator.MotionProfile.forTravel(1,1.8f,0);m.setTarget(1);float t=0;while(m.position()<r-1e-4f&&t<3){m.update(1/600f);t+=1/600f;}return t;}
            void timingChecks(){
                StringBuilder out=new StringBuilder();
                for(float fps:new float[]{17,30,60,144}){
                    elevator.start(1,2);float t=0;List<State> seen=new ArrayList<>();State last=null;int jumps=0;
                    while(elevator.active()&&t<60){elevator.update(1/fps);t+=1/fps;State s=elevator.state();if(s!=last){if(last!=null&&s.ordinal()-last.ordinal()>1)jumps++;seen.add(s);last=s;}}
                    out.append(String.format(Locale.ROOT,"fps %5.0f: total %.2f s, states %d, skipped-state jumps %d, needle at end %.1f° (floor-2 angle %.1f°)%n",fps,t,seen.size(),jumps,elevator.needleAngle(),116.0));
                    elevator.cancel();
                }
                elevator.start(1,2);for(int i=0;i<5;i++)elevator.update(10f);out.append("huge deltas (5×10 s): state "+elevator.state()+" — one state per frame\n");elevator.cancel();
                elevator.start(1,2);boolean second=elevator.start(1,2);out.append("second trigger while active accepted: "+second+"\n");elevator.skip();out.append("skip → "+elevator.state()+"\n");elevator.reset();elevator.cancel();
                out.append("missing sound files: "+elevator.missingSounds()+"\n");
                Gdx.files.absolute(capture+"/timing.txt").writeString(out.toString(),false);System.out.print(out);
            }
            final Deque<ElevatorEventType> eventQueue=new ArrayDeque<>();ElevatorEventType runType;float lastGrab=-1;String lastPhase="";
            void nextEventRun(){
                if(eventQueue.isEmpty()){Gdx.app.exit();return;}
                runType=eventQueue.poll();elevator.cancel();elevator.events().debugForce(runType);elevator.start(1,2);lastGrab=-1;lastPhase="";
                while(elevator.state()!=State.MOVING)elevator.update(1/60f);          // jump to the cruise
            }
            void eventRender(){
                elevator.update(1/60f);ScreenUtils.clear(0,0,0,1);elevator.render();
                var seq=elevator.events().sequence();
                if(seq!=null){String ph=seq.phaseName();float t=seq.phaseTime();
                    if(!ph.equals(lastPhase)||t-lastGrab>=.2f){if(!ph.equals(lastPhase))lastGrab=t;else lastGrab+=.2f;lastPhase=ph;
                        grab(String.format(Locale.ROOT,"%s/%s_%s_%03d.png",eventsDir,runType,ph,(int)(t*100)));}}
                else if(!lastPhase.isEmpty()){grab(eventsDir+"/"+runType+"_zz_after.png");nextEventRun();}
            }
            /** Logic checks of the event system on the real transition (no rendering). */
            void eventChecks(){
                StringBuilder o=new StringBuilder();var em=elevator.events();
                // probability + no repeats over many plans
                em.debugClear();var cnt=new EnumMap<ElevatorEventType,Integer>(ElevatorEventType.class);int ev=0,n=20000,repeats=0;ElevatorEventType prev=null;
                for(int i=0;i<n;i++){em.planJourney(3);var t=em.plannedType();if(t!=null){ev++;cnt.merge(t,1,Integer::sum);if(t==prev)repeats++;prev=t;em.trigger(t,true);em.cancel();}}
                o.append(String.format(Locale.ROOT,"plans %d: eventful %.1f%%, consecutive repeats %d, per type %s%n",n,100f*ev/n,repeats,cnt));
                for(ElevatorEventType t:ElevatorEventType.values())for(float fps:new float[]{17,60,144}){
                    em.debugForce(t);elevator.start(1,2);float time=0,maxDoor=0,cruiseDoor=0;boolean happened=false;String last="";
                    while(elevator.active()&&time<90){elevator.update(1/fps);time+=1/fps;if(em.active()){happened=true;last=em.sequence().phaseName();}
                        if(elevator.state()==State.MOVING){maxDoor=Math.max(maxDoor,elevator.interiorOpenness());if(!em.active())cruiseDoor=Math.max(cruiseDoor,happened?0:elevator.interiorOpenness());}}
                    o.append(String.format(Locale.ROOT,"%-17s fps %3.0f: happened %s, total %.2f s, end %s, needle %.1f° (shown %.1f°), max door while cruising %.3f%n",t,fps,happened,time,elevator.state(),elevator.needleAngle(),elevator.displayedNeedleAngle(),maxDoor));
                    elevator.reset();elevator.cancel();
                }
                em.debugForce(ElevatorEventType.FALSE_ARRIVAL);elevator.start(1,2);for(int i=0;i<5;i++)elevator.update(10f);
                int frames=5;boolean fa=false;while(elevator.active()&&frames<5000){elevator.update(10f);frames++;fa|=em.active();}
                o.append("huge deltas (every frame 10 s, clamped to 0.1 s) with FALSE_ARRIVAL: event ran "+fa+", end "+elevator.state()+" after "+frames+" frames, needle "+elevator.needleAngle()+"\n");elevator.reset();elevator.cancel();
                for(ElevatorEventType t:ElevatorEventType.values()){em.debugForce(t);elevator.start(1,2);while(!em.active()&&elevator.active())elevator.update(1/60f);
                    for(int i=0;i<30;i++)elevator.update(1/60f);elevator.resize(800,450);elevator.resize(1600,900);
                    String ph=em.sequence().phaseName();elevator.cancel();
                    o.append(String.format(Locale.ROOT,"cancel during %s/%s: state %s, event active %s, door %.2f; ",t,ph,elevator.state(),em.active(),elevator.interiorOpenness()));
                    elevator.start(1,2);while(!em.active()&&elevator.active())elevator.update(1/60f);elevator.update(.2f);elevator.skip();
                    o.append("skip → "+elevator.state()+", event active "+em.active()+"\n");elevator.reset();elevator.cancel();}
                em.debugForceNone();elevator.start(1,2);while(elevator.state()!=State.MOVING)elevator.update(1/60f);
                boolean early=elevator.triggerEvent(ElevatorEventType.POWER_FAILURE),again=elevator.triggerEvent(ElevatorEventType.EMERGENCY_STOP);
                elevator.cancel();elevator.start(1,2);boolean unsafe=elevator.triggerEvent(ElevatorEventType.EMERGENCY_STOP);elevator.cancel();
                o.append("manual trigger while cruising "+early+", second while one runs "+again+", during PREPARING "+unsafe+"\n");
                em.debugClear();em.debugProbability(1f);ElevatorEventType p2=null;int rep2=0;
                for(int j=0;j<12;j++){elevator.start(1,2);float t=0;ElevatorEventType seen=null;while(elevator.active()&&t<90){elevator.update(1/60f);t+=1/60f;if(em.activeType()!=null)seen=em.activeType();}
                    if(seen==p2)rep2++;p2=seen;o.append(seen).append(j<11?", ":"\n");elevator.reset();elevator.cancel();}
                o.append("12 repeated journeys at 100%: consecutive repeats "+rep2+"\n");
                o.append("missing sound files: "+elevator.missingSounds()+"\n");
                em.debugClear();
                Gdx.files.absolute(eventsDir+"/event_checks.txt").writeString(o.toString(),false);System.out.print(o);
            }
            @Override public void resize(int w,int h){elevator.resize(w,h);stageView.update(w,h,true);}
            @Override public void render(){
                if(!eventsDir.isEmpty()){if(runType!=null)eventRender();return;}
                if(capture.isEmpty()&&elevator.state()==State.MOVING){ElevatorEventType[] all=ElevatorEventType.values();
                    for(int k=0;k<5;k++)if(Gdx.input.isKeyJustPressed(Input.Keys.NUM_1+k))elevator.triggerEvent(all[k]);}
                if(capture.isEmpty()){if(Gdx.input.isKeyJustPressed(Input.Keys.NUM_0))elevator.events().debugForceNone();if(Gdx.input.isKeyJustPressed(Input.Keys.R))elevator.events().debugClear();}
                float dt=capture.isEmpty()?Math.min(Gdx.graphics.getDeltaTime(),.1f):1/60f;
                if(capture.isEmpty()){if(Gdx.input.isKeyJustPressed(Input.Keys.SPACE)){elevator.cancel();elevator.start(1,2);}if(Gdx.input.isKeyJustPressed(Input.Keys.S))elevator.skip();}
                elevator.update(dt);
                ScreenUtils.clear(0,0,0,1);
                if(elevator.gameplayOverlayAlpha()>0||!elevator.active()&&!elevator.completed()){stageView.apply();batch.setProjectionMatrix(stageView.getCamera().combined);batch.begin();batch.draw(hall,0,0,1600,900);batch.end();}
                elevator.render();
                if(capture.isEmpty()){if(elevator.completed()){clock+=dt;if(clock>2){clock=0;elevator.cancel();elevator.start(1,2);}}return;}
                while(next<marks.size()){float[] m=marks.get(next);if(elevator.state().ordinal()>m[0]||elevator.state().ordinal()==m[0]&&elevator.stateTime()>=m[1]){grab(capture+"/"+names.get(next)+".png");next++;}else break;}
                if(next>=marks.size())Gdx.app.exit();
            }
            void grab(String file){Pixmap p=ScreenUtils.getFrameBufferPixmap(0,0,Gdx.graphics.getBackBufferWidth(),Gdx.graphics.getBackBufferHeight());
                try{var px=p.getPixels();for(int i=3;i<px.limit();i+=4)px.put(i,(byte)255);PixmapIO.writePNG(Gdx.files.absolute(file),p,-1,true);}finally{p.dispose();}}
            @Override public void dispose(){elevator.dispose();batch.dispose();hall.dispose();}
        },c);
    }
}
