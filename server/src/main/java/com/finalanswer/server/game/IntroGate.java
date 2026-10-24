package com.finalanswer.server.game;

import com.erni.finalanswer.gameplay.intro.IntroDefinition;
import java.util.Map;

/** Authoritative STARTING barrier. Audio never resolves a question or starts its timer. */
public final class IntroGate {
    public final long started;
    private long pausedAt,totalPaused;
    private boolean paused,completed,timingWarning;
    public IntroGate(long now){started=now;}
    public long elapsed(long now){return Math.max(0,(paused?pausedAt:now)-started-totalPaused);}
    public boolean paused(){return paused;}
    public void pause(long now){if(!completed&&!paused){paused=true;pausedAt=now;}}
    public void resume(long now){if(paused){totalPaused+=Math.max(0,now-pausedAt);paused=false;}}
    public boolean ready(long now){return !paused&&elapsed(now)>=Math.round(IntroDefinition.RUSSIAN.targetDurationSeconds()*1000);}
    public boolean expired(long now){return !paused&&elapsed(now)>Math.round(IntroDefinition.RUSSIAN.maximumDurationSeconds()*1000)+1000;}
    public boolean reportDeadline(long now){if(!timingWarning&&expired(now)){timingWarning=true;return true;}return false;}
    public void complete(){completed=true;}
    public boolean completed(){return completed;}
    public Map<String,Object> snapshot(long now){return Map.of("introId",IntroDefinition.RUSSIAN.introId(),"startedAt",started,
        "elapsedMillis",elapsed(now),"paused",paused,"targetMillis",Math.round(IntroDefinition.RUSSIAN.targetDurationSeconds()*1000),
        "maximumMillis",Math.round(IntroDefinition.RUSSIAN.maximumDurationSeconds()*1000),"timingConflict",timingWarning);}
}
