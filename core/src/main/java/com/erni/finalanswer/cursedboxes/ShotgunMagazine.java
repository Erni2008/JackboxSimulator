package com.erni.finalanswer.cursedboxes;

import com.erni.finalanswer.shotgun.ShotgunAnimator;

/** Local ammunition presentation; server turn budgets remain authoritative. Counts include the chamber. */
public final class ShotgunMagazine {
    public static final int CAPACITY=5;
    private final ShotgunAnimator animator;
    private int rounds,loadingTarget;
    private boolean initial=true;
    public ShotgunMagazine(ShotgunAnimator animator){this.animator=animator;}
    public int rounds(){return rounds;}
    public int loadingTarget(){return loadingTarget;}
    public boolean loading(){return loadingTarget>0;}
    public void reset(){animator.resetShotgun();rounds=loadingTarget=0;initial=true;animator.chamber(ShotgunAnimator.Chamber.EMPTY);}
    public void restore(int fired,int remaining){
        if(fired<0||remaining<0)throw new IllegalArgumentException("Negative shot budget");
        reset();if(fired==0)return;
        initial=false;rounds=fired%CAPACITY==0?0:Math.min(CAPACITY-fired%CAPACITY,remaining);
        if(rounds>0)animator.chamber(ShotgunAnimator.Chamber.LIVE);
    }
    public boolean canFire(){return !initial&&!loading()&&rounds>0;}
    public void fired(){if(!canFire())throw new IllegalStateException("Magazine is not ready");rounds--;}
    public void update(int remaining){update(remaining,true);}
    /** Starting a batch requires a held weapon; completing an active batch is never suspended. */
    public void update(int remaining,boolean held){
        if(remaining<0)throw new IllegalArgumentException("Negative remaining shots");
        if(loading()){
            if(!animator.isAnimating()&&animator.chamber()==ShotgunAnimator.Chamber.LIVE){rounds=loadingTarget;loadingTarget=0;initial=false;}
            return;
        }
        if(!held)return;
        if(animator.isAnimating()||animator.chamber()==ShotgunAnimator.Chamber.SPENT)return;
        if(rounds>0){if(animator.chamber()==ShotgunAnimator.Chamber.EMPTY)animator.chamber(ShotgunAnimator.Chamber.LIVE);return;}
        int count=initial?CAPACITY:Math.min(CAPACITY,remaining);
        if(count>0&&animator.playReloadAnimation(count))loadingTarget=count;
    }
}
