package com.erni.finalanswer.shotgun;

/** Graphics-free controller/config checks; GL hierarchy coverage is in the dev launcher. */
public final class ShotgunCheck {
    private static void check(boolean condition,String message){if(!condition)throw new AssertionError(message);}
    private static void near(float a,float b){check(Math.abs(a-b)<.0001f,"Expected "+a+", got "+b);}
    public static void main(String[] args){
        ShotgunConfig config=ShotgunConfig.parse("{}");
        for(int fps:new int[]{30,60,144}){
            ShotgunAnimator animator=new ShotgunAnimator(config);
            check(animator.playPumpAnimation(),"Pump starts");check(!animator.playReloadAnimation()&&!animator.openBolt(),"Conflicting commands rejected");
            for(int i=0;i<fps/2;i++)animator.update(1f/fps);
            float pose=animator.pump();animator.update(Float.NaN);animator.update(-1);animator.update(Float.POSITIVE_INFINITY);near(pose,animator.pump());
            animator.update(1);near(0,animator.pump());near(0,animator.bolt());check(!animator.isAnimating(),"Pump exact rest");
            animator.openBolt();animator.update(1);near(1,animator.bolt());check(!animator.isAnimating(),"Bolt held open");
            animator.closeBolt();animator.update(.1f);check(animator.bolt()>0&&animator.bolt()<1,"Continuous closing");
            animator.resetShotgun();near(0,animator.bolt());check(animator.shellState()==ShotgunAnimator.ShellState.HIDDEN,"Reset interrupts");
            animator.playReloadAnimation();animator.update(config.reloadDuration*.4f);
            check(animator.shellState()==ShotgunAnimator.ShellState.MOVING&&animator.shellProgress()>0&&animator.shellProgress()<1,"Loading trajectory");near(1,animator.bolt());
            animator.update(5);check(animator.shellState()==ShotgunAnimator.ShellState.LOADED&&!animator.isAnimating(),"Large delta completes reload and hides loaded shell");near(0,animator.pump());near(0,animator.bolt());
            animator.showShell();near(0,animator.shellProgress());check(animator.shellState()==ShotgunAnimator.ShellState.VISIBLE,"Show again at starting position");
            animator.hideShell();check(animator.shellState()==ShotgunAnimator.ShellState.HIDDEN,"Hide");
        }
        ShotgunAnimator cycle=new ShotgunAnimator(config);cycle.playPumpAnimation();
        check(cycle.cyclePhase()==ShotgunAnimator.CyclePhase.PUMP_BACKWARD,"Explicit rearward phase");
        cycle.update(config.pumpDuration*.5f);near(1,cycle.pump());near(1,cycle.bolt());
        check(cycle.cyclePhase()==ShotgunAnimator.CyclePhase.REAR_POSITION,"Rear hold");
        cycle.update(config.pumpDuration*.25f);near(cycle.pump(),cycle.bolt());
        check(cycle.cyclePhase()==ShotgunAnimator.CyclePhase.PUMP_FORWARD,"Explicit return phase");
        cycle.update(config.pumpDuration);near(0,cycle.pump());near(0,cycle.bolt());
        check(cycle.cyclePhase()==ShotgunAnimator.CyclePhase.IDLE,"Exact idle return");
        for(int repeat=0;repeat<100;repeat++){cycle.playPumpAnimation();cycle.update(config.pumpDuration+1);near(0,cycle.pump());near(0,cycle.bolt());}
        ShotgunAnimator a=new ShotgunAnimator(config),b=new ShotgunAnimator(config);a.playPumpAnimation();b.playPumpAnimation();
        for(int i=0;i<12;i++)a.update(1f/30);for(int i=0;i<24;i++)b.update(1f/60);near(a.pump(),b.pump());near(a.bolt(),b.bolt());
        a.resetShotgun();check(b.isAnimating(),"Instances independent");
        for(int fps:new int[]{30,60,144}){
            ShotgunConfig live=new ShotgunConfig();live.startLoaded=true;
            ShotgunAnimator gun=new ShotgunAnimator(live);
            java.util.List<ShotgunAnimator.Event> events=new java.util.ArrayList<>();gun.listener((event,sequence)->{events.add(event);if(event==ShotgunAnimator.Event.RELOADED)check(!gun.isAnimating()&&gun.chamber()==ShotgunAnimator.Chamber.LIVE,"Reload event observes ready state");});
            check(gun.fire(),"Live round fires");check(gun.chamber()==ShotgunAnimator.Chamber.SPENT&&gun.flash()>0,"Spent chamber and short muzzle flash");
            check(!gun.fire()&&!gun.playReloadAnimation(),"Cannot duplicate a shot or load over a spent round");
            gun.update(.02f);check(gun.recoil()>0,"Recoil kick");gun.update(live.fireDuration);
            near(0,gun.recoil());near(0,gun.flash());check(!gun.fire(),"Spent chamber cannot fire again");
            check(gun.playPumpAnimation(),"Manual cycle after shot");
            for(int step=0;step<fps/2;step++)gun.update(1f/fps);
            check(gun.chamber()==ShotgunAnimator.Chamber.EMPTY&&gun.ejectionSerial()==1&&gun.ejecting(),"One spent case ejected when the port opens");
            near(.5f-live.pumpDuration*live.ejectionAt,gun.ejectionAge());
            gun.update(2);check(!gun.ejecting(),"Ejection lifetime expires, even after cycle finishes");
            check(gun.playReloadAnimation(),"Empty chamber reloads");gun.update(live.reloadDuration+1);
            check(gun.chamber()==ShotgunAnimator.Chamber.LIVE&&gun.shellState()==ShotgunAnimator.ShellState.LOADED,"Reload chambers one live round");
            check(gun.fire()&&gun.shotSerial()==2,"Second shot after reload");gun.resetShotgun();
            near(0,gun.flash());check(!gun.ejecting()&&!gun.isAnimating(),"Reset interrupts all effects");
            check(java.util.Collections.frequency(events,ShotgunAnimator.Event.FIRED)==2&&java.util.Collections.frequency(events,ShotgunAnimator.Event.EJECTED)==1,"One-shot integration events");
        }
        for(String invalid:new String[]{"{pumpDirection:[0,0,0]}","{boltDuration:0}","{body:{scale:[1,-1,1]}}","{shellStart:[1,2]}","{easing:invalid}","{shellScale:0}","{shellScale:-1}","{fireDuration:0.01}","{ejectionGravity:0}","{preparation:{maxPortAreaFraction:0.9}}"}){
            try{ShotgunConfig.parse(invalid);throw new AssertionError("Invalid config accepted: "+invalid);}catch(IllegalArgumentException expected){}
        }
        System.out.println("PASS: pump/bolt/reload timing, exact endpoints, conflict rejection, invalid delta, interruption, hidden loaded shell, independent instances, LIVE/SPENT/EMPTY firing, one-shot ejection, reload, callbacks and config validation");
    }
}
