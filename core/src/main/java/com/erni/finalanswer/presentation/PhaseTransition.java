package com.erni.finalanswer.presentation;

/** Bounded presentation-only timeline. No phase callbacks, queues or game timers. */
public final class PhaseTransition {
    public enum Style { FADE_IN, FADE_OUT, DARKNESS, ZOOM, SLIDE, PAUSE }
    public record Config(Style style,float seconds,float strength){
        public Config {if(style==null||!Float.isFinite(seconds)||seconds<=0||!Float.isFinite(strength)||strength<0||strength>1)throw new IllegalArgumentException("Invalid transition");}
    }
    private Config config=new Config(Style.DARKNESS,.5f,.18f);
    private String key="";
    private float elapsed;
    private boolean active;
    public boolean enter(String next,Config config,boolean restore){
        if(key.equals(next))return false;
        key=next;this.config=config;elapsed=0;active=!restore;return active;
    }
    public void update(float delta,boolean paused,boolean reduced){
        if(reduced){cancel();return;}
        if(!active||paused||!Float.isFinite(delta)||delta<=0)return;
        elapsed=Math.min(config.seconds(),elapsed+delta);if(elapsed>=config.seconds())active=false;
    }
    public void cancel(){active=false;elapsed=config.seconds();}
    public void reset(){cancel();key="";}
    public boolean active(){return active;}
    public float progress(){return active?elapsed/config.seconds():1;}
    public float opacity(){if(!active)return 0;float p=progress();return config.strength()*switch(config.style()){
        case FADE_IN -> 1-smooth(p);case FADE_OUT -> smooth(p);case DARKNESS -> (float)Math.sin(Math.PI*p);case PAUSE -> 1;default -> 0;};}
    public float scale(){return active&&config.style()==Style.ZOOM?1+config.strength()*.02f*(1-smooth(progress())):1;}
    public float offset(){return active&&config.style()==Style.SLIDE?config.strength()*24*(1-smooth(progress())):0;}
    private static float smooth(float p){return p*p*(3-2*p);}
}
