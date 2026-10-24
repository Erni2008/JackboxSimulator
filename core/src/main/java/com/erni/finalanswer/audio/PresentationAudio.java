package com.erni.finalanswer.audio;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.audio.*;
import java.util.*;

/** Optional asset-backed audio; missing cues are silent. Each screen owns one scope. */
public final class PresentationAudio implements AutoCloseable {
    public enum Cue { HOVER, CLICK, ROOM_CREATED, PLAYER_JOINED, ROUND_INTRO, TIMER_WARNING, CLUE_SUBMITTED, CLUE_REVEAL, VOTING_START, VOTE_CONFIRMED, STAMP_IMPACT, SUSPECT, IMPOSTOR, VICTORY, DEFEAT, LOBBY, INTRODUCTION, ROLE_CARDS, PAGE_TURN, VOTING_CLOSED }
    public interface Backend { Sound sound(String path); Music music(String path); }
    public static final Backend GDX=new Backend(){
        public Sound sound(String path){return Gdx.files.internal(path).exists()?Gdx.audio.newSound(Gdx.files.internal(path)):null;}
        public Music music(String path){return Gdx.files.internal(path).exists()?Gdx.audio.newMusic(Gdx.files.internal(path)):null;}
    };
    private final EnumMap<Cue,Sound> sounds=new EnumMap<>(Cue.class);
    private final Map<String,Music> tracks=new HashMap<>();
    private final EnumMap<Cue,Sound> prepared=new EnumMap<>(Cue.class);
    private Music current,previous,clock,writing;
    private boolean writingPlaying,writingWanted,writingFailed;
    private long writingStarts;
    public long writingPlayCount(){return writingStarts;}
    private float writingFade;
    public float writingVolume=.60f;
    private String timerKey="";
    private boolean timerWanted,clockPlaying;
    private float timerOffset;
    private final float clockPeriod;
    private final long[] played=new long[Cue.values().length];
    public float tickVolume=.40f;
    public static String preparedPath(Cue cue){return switch(cue){
        case INTRODUCTION->"mini_game_introduction.wav";
        case ROLE_CARDS->"card_deal.wav";
        case PAGE_TURN->"page_turn.wav";
        case VOTING_START->"vote_started.wav";
        case VOTING_CLOSED->"runtime/voting_closed.wav";
        case STAMP_IMPACT->"runtime/wooden_stumb_hit.wav";
        case IMPOSTOR->"impostor_role_reveal.wav";
        default->null;
    };}
    private float fade=1,volume=.65f;
    private boolean muted,ambienceMuted,paused,closed;
    public PresentationAudio(Backend backend){
        clockPeriod=backend==GDX?QuestionAudio.clockPeriod():20;
        for(Cue cue:Cue.values())try{Sound sound=backend.sound("audio/impostor/"+cue.name().toLowerCase(Locale.ROOT)+".ogg");if(sound!=null)sounds.put(cue,sound);}catch(RuntimeException ignored){}
        for(Cue cue:Cue.values()){
            String file=preparedPath(cue);if(file==null)continue;
            try{Sound sound=backend.sound("sounds/impostor/"+file);if(sound!=null)prepared.put(cue,sound);else warn("Missing optional Impostor audio: "+file);}catch(RuntimeException e){warn("Cannot preload "+file+": "+e.getMessage());}
        }
        try{clock=backend.music(QuestionAudio.CLOCK);if(clock!=null){clock.setLooping(true);clock.setVolume(0);}else warn("Missing Impostor timer audio: "+QuestionAudio.CLOCK);}catch(RuntimeException e){warn("Cannot preload timer: "+e.getMessage());}
        try{writing=backend.music("sounds/impostor/runtime/writing_words_on_paper_theimpostor.wav");if(writing!=null){writing.setLooping(true);writing.setVolume(0);}}catch(RuntimeException e){warn("Cannot preload writing audio: "+e.getMessage());}
        for(String name:List.of("room","suspense"))try{Music music=backend.music("audio/impostor/"+name+".ogg");if(music!=null){music.setLooping(true);tracks.put(name,music);}}catch(RuntimeException ignored){}
    }
    private static void warn(String message){if(Gdx.app!=null)Gdx.app.error("Impostor audio",message);}
    private boolean effect(Sound sound){if(sound!=null)try{return sound.play(volume*AudioMix.GLOBAL.gain(AudioMix.Category.SFX))>=0;}catch(RuntimeException e){warn("Cannot play effect: "+e.getMessage());}return false;}
    public void stop(Cue cue){Sound legacy=sounds.get(cue),extra=prepared.get(cue);if(legacy!=null)legacy.stop();if(extra!=null)extra.stop();}
    public void play(Cue cue){if(!closed&&!muted&&!paused){boolean legacy=effect(sounds.get(cue)),additional=effect(prepared.get(cue));if((cue==Cue.ROLE_CARDS||cue==Cue.ROUND_INTRO)&&prepared.get(cue)==null&&!legacy)additional=effect(prepared.get(Cue.PAGE_TURN));if(legacy||additional)played[cue.ordinal()]++;}}
    /** Driven by the actual displayed authoritative deadline; no extra gameplay timer. */
    public long playCount(Cue cue){return played[cue.ordinal()];}
    public void timer(String key,boolean active){timer(key,active,0);}
    public void timer(String key,boolean active,float elapsed){
        if(closed)return;
        if(!timerKey.equals(key)){stopClock();timerKey=key;}
        timerOffset=Float.isFinite(elapsed)?Math.max(0,elapsed)%clockPeriod:0;timerWanted=active;syncClock();
    }
    private void stopClock(){if(clockPlaying&&clock!=null)try{clock.stop();}catch(RuntimeException e){warn("Cannot stop timer: "+e.getMessage());}clockPlaying=false;}
    private void syncClock(){
        if(clock==null)return;
        if(!timerWanted||paused||muted){stopClock();return;}
        try{clock.setVolume(volume*tickVolume*AudioMix.GLOBAL.gain(AudioMix.Category.SFX));if(!clockPlaying){clock.play();clock.setPosition(timerOffset);clockPlaying=true;}}catch(RuntimeException e){warn("Cannot play timer: "+e.getMessage());stopClock();}
    }
    public void writing(boolean active){writingWanted=active;}
    public boolean writingPlaying(){return writingPlaying;}
    private void stopWriting(){if(writingPlaying&&writing!=null)try{writing.stop();}catch(RuntimeException e){warn("Cannot stop writing: "+e.getMessage());}writingPlaying=false;writingFade=0;}
    public void ambience(String name){if(closed)return;Music next=tracks.get(name);if(next==current)return;
        if(previous!=null)previous.stop();previous=current;current=next;fade=0;
        if(current!=null){current.setVolume(0);if(!paused&&!muted&&!ambienceMuted)current.play();}}
    public void update(float delta){if(closed||paused)return;syncClock();if(Float.isFinite(delta)&&delta>0){fade=Math.min(1,fade+delta/1.2f);writingFade+=Math.max(-delta/.10f,Math.min(delta/.025f,(writingWanted&&!muted?1:0)-writingFade));}
        if(writing!=null&&!writingFailed)try{
            float gain=writingFade*writingVolume*volume*AudioMix.GLOBAL.gain(AudioMix.Category.SFX);writing.setVolume(gain);
            if(gain>0&&!writingPlaying){writing.play();writing.setPosition(.1f);writingPlaying=true;writingStarts++;}else if(gain<=0&&writingPlaying)stopWriting();
        }catch(RuntimeException e){writingFailed=true;warn("Writing playback failed: "+e.getMessage());stopWriting();}
        float level=muted||ambienceMuted?0:volume*.22f*AudioMix.GLOBAL.gain(AudioMix.Category.MUSIC);
        if(current!=null)current.setVolume(level*fade);
        if(previous!=null){previous.setVolume(level*(1-fade));if(fade==1){previous.stop();previous=null;}}}
    public void volume(float value){if(Float.isFinite(value))volume=Math.max(0,Math.min(1,value));}
    public float volume(){return volume;}
    public boolean muted(){return muted;}
    public boolean ambienceMuted(){return ambienceMuted;}
    public void mute(boolean value){muted=value;if(value){stopWriting();for(Sound sound:sounds.values())sound.stop();for(Sound sound:prepared.values())sound.stop();}syncClock();syncMusic();}
    public void muteAmbience(boolean value){ambienceMuted=value;syncMusic();}
    public void pause(boolean value){paused=value;if(value){writingWanted=false;stopWriting();for(Sound sound:sounds.values())sound.stop();for(Sound sound:prepared.values())sound.stop();}syncClock();syncMusic();}
    private void syncMusic(){for(Music music:tracks.values())if(paused||muted||ambienceMuted)music.pause();else if(music==current||music==previous){music.setVolume(0);music.play();}update(0);}
    public int loadedCues(){return sounds.size()+prepared.size();}
    @Override public void close(){if(closed)return;closed=true;for(Sound sound:sounds.values()){sound.stop();sound.dispose();}for(Sound sound:prepared.values()){sound.stop();sound.dispose();}stopWriting();if(writing!=null){writing.dispose();writing=null;}stopClock();if(clock!=null){clock.dispose();clock=null;}for(Music music:tracks.values()){music.stop();music.dispose();}sounds.clear();prepared.clear();tracks.clear();current=previous=null;}
}
