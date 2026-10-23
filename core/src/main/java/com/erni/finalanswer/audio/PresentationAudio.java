package com.erni.finalanswer.audio;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.audio.*;
import java.util.*;

/** Optional asset-backed audio; missing cues are silent. Each screen owns one scope. */
public final class PresentationAudio implements AutoCloseable {
    public enum Cue { HOVER, CLICK, ROOM_CREATED, PLAYER_JOINED, ROUND_INTRO, TIMER_WARNING, CLUE_SUBMITTED, CLUE_REVEAL, VOTING_START, VOTE_CONFIRMED, STAMP_IMPACT, SUSPECT, IMPOSTOR, VICTORY, DEFEAT, LOBBY }
    public interface Backend { Sound sound(String path); Music music(String path); }
    public static final Backend GDX=new Backend(){
        public Sound sound(String path){return Gdx.files.internal(path).exists()?Gdx.audio.newSound(Gdx.files.internal(path)):null;}
        public Music music(String path){return Gdx.files.internal(path).exists()?Gdx.audio.newMusic(Gdx.files.internal(path)):null;}
    };
    private final EnumMap<Cue,Sound> sounds=new EnumMap<>(Cue.class);
    private final Map<String,Music> tracks=new HashMap<>();
    private Music current,previous;
    private float fade=1,volume=.65f;
    private boolean muted,ambienceMuted,paused,closed;
    public PresentationAudio(Backend backend){
        for(Cue cue:Cue.values())try{Sound sound=backend.sound("audio/impostor/"+cue.name().toLowerCase(Locale.ROOT)+".ogg");if(sound!=null)sounds.put(cue,sound);}catch(RuntimeException ignored){}
        for(String name:List.of("room","suspense"))try{Music music=backend.music("audio/impostor/"+name+".ogg");if(music!=null){music.setLooping(true);tracks.put(name,music);}}catch(RuntimeException ignored){}
    }
    public void play(Cue cue){if(!closed&&!muted&&!paused){Sound sound=sounds.get(cue);if(sound!=null)sound.play(volume*AudioMix.GLOBAL.gain(AudioMix.Category.SFX));}}
    public void ambience(String name){if(closed)return;Music next=tracks.get(name);if(next==current)return;
        if(previous!=null)previous.stop();previous=current;current=next;fade=0;
        if(current!=null){current.setVolume(0);if(!paused&&!muted&&!ambienceMuted)current.play();}}
    public void update(float delta){if(closed||paused)return;if(Float.isFinite(delta)&&delta>0)fade=Math.min(1,fade+delta/1.2f);
        float level=muted||ambienceMuted?0:volume*.22f*AudioMix.GLOBAL.gain(AudioMix.Category.MUSIC);
        if(current!=null)current.setVolume(level*fade);
        if(previous!=null){previous.setVolume(level*(1-fade));if(fade==1){previous.stop();previous=null;}}}
    public void volume(float value){if(Float.isFinite(value))volume=Math.max(0,Math.min(1,value));}
    public float volume(){return volume;}
    public boolean muted(){return muted;}
    public boolean ambienceMuted(){return ambienceMuted;}
    public void mute(boolean value){muted=value;if(value)for(Sound sound:sounds.values())sound.stop();syncMusic();}
    public void muteAmbience(boolean value){ambienceMuted=value;syncMusic();}
    public void pause(boolean value){paused=value;if(value)for(Sound sound:sounds.values())sound.stop();syncMusic();}
    private void syncMusic(){for(Music music:tracks.values())if(paused||muted||ambienceMuted)music.pause();else if(music==current||music==previous){music.setVolume(0);music.play();}update(0);}
    public int loadedCues(){return sounds.size();}
    @Override public void close(){if(closed)return;closed=true;for(Sound sound:sounds.values()){sound.stop();sound.dispose();}for(Music music:tracks.values()){music.stop();music.dispose();}sounds.clear();tracks.clear();current=previous=null;}
}
