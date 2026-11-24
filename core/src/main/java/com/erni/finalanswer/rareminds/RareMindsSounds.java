package com.erni.finalanswer.rareminds;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.audio.Sound;
import com.badlogic.gdx.utils.Disposable;
import java.util.*;

/** Short cues for the RARE MINDS host screen, reusing the project's existing sound effects (missing files are skipped). */
final class RareMindsSounds implements Disposable {
    enum Cue {
        QUESTION("sounds/impostor/vote_started.wav",.55f),FINAL("sounds/cursed_boxes/appearance.wav",.7f),TICK("sounds/results/count_tick.wav",.45f),
        SUBMIT("sounds/impostor/vote_sent.wav",.35f),LOCK("sounds/questions/door_lock(done).wav",.6f),REVEAL("sounds/results/row_whoosh.wav",.4f),
        COLLISION("sounds/impostor/wooden_stumb_hit.wav",.75f),DEATH_ZONE("sounds/cursed_boxes/heart_beating_done.wav",.6f),
        GHOST_OK("sounds/results/total_flash.wav",.5f),GHOST_LOST("sounds/cursed_boxes/box_destroy_done.wav",.55f),
        RESURRECT("sounds/cursed_boxes/horror_appearance.wav",.7f),JACKPOT("sounds/results/points_land.wav",.75f),WINNER("sounds/results/winner_impact.wav",.85f);
        final String path;final float volume;Cue(String p,float v){path=p;volume=v;}
    }
    private final Map<Cue,Sound> sounds=new EnumMap<>(Cue.class);private final Map<String,Sound> deaths=new HashMap<>();
    private final Map<Cue,Float> cooldown=new EnumMap<>(Cue.class);

    RareMindsSounds(){for(Cue c:Cue.values())try{var f=Gdx.files.internal(c.path);if(f.exists())sounds.put(c,Gdx.audio.newSound(f));}catch(RuntimeException e){Gdx.app.log("RareMinds","no sound "+c.path);}}
    void play(Cue c){Sound s=sounds.get(c);if(s==null||cooldown.getOrDefault(c,0f)>0)return;cooldown.put(c,.08f);try{s.play(c.volume);}catch(RuntimeException ignored){}}
    /** The character's own "cursed" death sound on elimination. */
    void death(String character){
        Sound s=deaths.computeIfAbsent(character,ch->{var f=Gdx.files.internal("sounds/deaths/"+ch+"_cursed.wav");try{return f.exists()?Gdx.audio.newSound(f):null;}catch(RuntimeException e){return null;}});
        if(s!=null)try{s.play(.7f);}catch(RuntimeException ignored){}
    }
    void update(float dt){for(var e:cooldown.entrySet())e.setValue(Math.max(0,e.getValue()-dt));}
    @Override public void dispose(){for(Sound s:sounds.values())s.dispose();for(Sound s:deaths.values())if(s!=null)s.dispose();}
}
