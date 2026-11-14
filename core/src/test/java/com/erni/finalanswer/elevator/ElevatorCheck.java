package com.erni.finalanswer.elevator;

import java.nio.file.*;
import java.util.*;
import static com.erni.finalanswer.elevator.ElevatorController.State.*;

/** Headless regression for the elevator logic: run with ./gradlew :core:elevatorCheck */
public final class ElevatorCheck {
    private static int n;
    private static void check(boolean v,String m){if(!v)throw new AssertionError(m);n++;}
    public static void main(String[] a)throws Exception{
        var g=ElevatorGeometry.parse(Files.readString(Path.of("../assets/elevator/elevator_geometry.json")));
        check(g.floors.size()==5&&g.buttons.size()==5,"five floors and buttons");
        check(g.leftDoor.closedX()+g.leftDoor.w()>=g.rightDoor.closedX(),"closed leaves meet without a gap");
        check(g.leftDoor.openX()+g.leftDoor.w()<=g.doorway.x()&&g.rightDoor.openX()>=g.doorway.x()+g.doorway.w(),"open leaves fully clear the doorway");

        // door: 0 -> 1 in 1.8 s, eased (slow at the ends, fastest mid-way), at several frame rates
        for(float fps:new float[]{30,60,144,17}){
            var m=MotionProfile.forTravel(1,1.8f,0);m.setTarget(1);float t=0,maxV=0,vEarly=0,lastP=0;boolean mono=true;
            while(!m.settled()&&t<5){m.update(1/fps);t+=1/fps;maxV=Math.max(maxV,m.velocity());if(t<=.15f)vEarly=m.velocity();if(m.position()<lastP-1e-6)mono=false;lastP=m.position();}
            check(Math.abs(t-1.8f)<=1.6f/fps+.02f,"door opens in 1.8 s at "+fps+" fps, took "+t);
            check(mono,"door opening is monotonic at "+fps+" fps");
            check(vEarly<maxV*.5f,"door starts gently (ease-in) at "+fps+" fps");
        }
        // reversal mid-travel: velocity changes continuously (bounded by accel*dt), position never jumps
        {var m=MotionProfile.forTravel(1,1.8f,0);m.setTarget(1);float dt=1/60f,prevP=0,prevV=0,maxJump=0,maxDv=0;
            for(int i=0;i<300;i++){if(i==50)m.setTarget(0);m.update(dt);maxJump=Math.max(maxJump,Math.abs(m.position()-prevP));maxDv=Math.max(maxDv,Math.abs(m.velocity()-prevV));prevP=m.position();prevV=m.velocity();}
            check(maxDv<=1.0f/.6f*dt*1.01f+1e-4f,"reversal has no velocity step ("+maxDv+")");check(maxJump<1.0f/1.2f*dt*1.05f,"reversal has no position jump");check(m.settled()&&m.position()==0,"reversed door closes fully");}
        // stop at any percentage
        for(float p:new float[]{.25f,.5f,.75f,.33f}){var m=MotionProfile.forTravel(1,1.8f,0);m.setTarget(p);for(int i=0;i<400;i++)m.update(1/60f);check(Math.abs(m.position()-p)<1e-4f&&m.settled(),"door holds at "+p);}

        // full ride 1 -> 3 with cues in order
        List<String> cues=new ArrayList<>();var c=new ElevatorController(g,1,true).onCue(cues::add);
        c.requestFloor(3);check(c.button(3)==ElevatorController.ButtonState.PRESSED,"button shows pressed");
        boolean sawActive=false,sawMoving=false,sawArriving=false;float t=0;
        while(t<30&&!(c.state()==IDLE_OPEN&&c.currentFloor()==3)){c.update(1/60f);t+=1/60f;if(c.button(3)==ElevatorController.ButtonState.ACTIVE)sawActive=true;if(c.state()==MOVING)sawMoving=true;if(c.state()==ARRIVING)sawArriving=true;
            check(!(c.isRiding()&&c.doorOpen()>0),"never rides with open doors");}
        check(c.state()==IDLE_OPEN&&c.currentFloor()==3&&c.doorOpen()==1,"arrives at 3 with doors open");
        check(sawActive&&sawMoving&&sawArriving,"button active, moving and braking phases happen");
        check(c.button(3)==ElevatorController.ButtonState.IDLE,"button returns to idle after arrival");
        check(order(cues,"button","door_close_start","door_close_end","motor_start","motor_loop","brake","motor_loop_stop","bell","door_open_start","door_open_end"),"cue order "+cues);

        // emergency stop and resume
        c.requestFloor(5);for(int i=0;i<60*4;i++)c.update(1/60f);check(c.state()==MOVING||c.state()==ARRIVING,"riding to 5");
        c.emergencyStop();check(c.state()==EMERGENCY,"emergency state");c.requestFloor(1);
        for(int i=0;i<60*3;i++)c.update(1/60f);float held=c.carPosition();for(int i=0;i<60;i++)c.update(1/60f);
        check(c.carVelocity()==0&&c.carPosition()==held,"car is stopped during emergency");check(c.doorOpen()==0,"doors stay shut in an emergency");
        check(c.requestedFloor()==5,"buttons ignored during emergency");
        c.resume();for(int i=0;i<60*20;i++)c.update(1/60f);check(c.state()==IDLE_OPEN&&c.currentFloor()==5,"resumes and arrives at 5");
        // same floor reopens; hold freezes doors mid-way
        c.closeDoors();for(int i=0;i<60*3;i++)c.update(1/60f);check(c.doorOpen()==0,"doors close");c.requestFloor(5);for(int i=0;i<60*3;i++)c.update(1/60f);check(c.doorOpen()==1,"same-floor button reopens");
        c.closeDoors();for(int i=0;i<50;i++)c.update(1/60f);c.holdDoors();float d0=c.doorOpen();for(int i=0;i<120;i++)c.update(1/60f);float d1=c.doorOpen();for(int i=0;i<120;i++)c.update(1/60f);
        check(d1>0&&d1<1&&Math.abs(d1-d0)<.3f&&c.doorOpen()==d1,"hold brakes smoothly and keeps the doors mid-way");
        // needle mapping
        check(g.needleAngle(1)==g.needleAngleFloor1&&g.needleAngle(5)==g.needleAngleFloor5,"needle endpoints");
        System.out.println("ElevatorCheck: "+n+" checks passed");
    }
    private static boolean order(List<String> l,String... want){int i=0;for(String s:l)if(i<want.length&&s.equals(want[i]))i++;return i==want.length;}
}
