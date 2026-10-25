package com.erni.finalanswer.lwjgl3;

import com.erni.finalanswer.impostor.*;

/** Aggregate-only development simulation; never a server session or real submitted selections. */
public final class ImpostorSuspicionPreview {
    private final ImpostorScreen screen;
    private boolean running;
    private double elapsed;
    private int lastCount=-1;
    private int generation;
    public ImpostorSuspicionPreview(ImpostorScreen screen){this.screen=screen;}
    public void start(){if(running)return;running=true;generation++;elapsed=0;lastCount=-1;screen.presentPhase(com.erni.finalanswer.gameplay.impostor.ImpostorPhase.PRELIMINARY_SUSPICION,5000,0);update(0);}
    public void cancel(){running=false;screen.clearSuspicion();}
    public void update(float delta){
        if(!running)return;
        if(Float.isFinite(delta))elapsed+=Math.max(0,delta);
        int eligible=screen.participants().size()+2; // Two dev-only spectators, one abstains.
        int count=Math.min(eligible-1,(int)(elapsed/.8));
        boolean finalized=elapsed>=5;
        if(count!=lastCount || finalized){
            screen.presentSuspicion(new SuspicionSnapshot("dev-suspicion-"+generation,Math.max(1,screen.revealedRoundCount()),
                count,eligible,5000,finalized),(long)(elapsed*1000));
            lastCount=count;
        }
        if(finalized)running=false;
    }
}
