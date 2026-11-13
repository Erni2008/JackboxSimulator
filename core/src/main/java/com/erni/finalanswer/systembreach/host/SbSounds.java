package com.erni.finalanswer.systembreach.host;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.audio.Sound;
import com.badlogic.gdx.utils.Disposable;
import com.erni.finalanswer.audio.AudioMix;
import java.util.HashMap;
import java.util.Map;

/**
 * SYSTEM BREACH host sound effects (procedural WAVs from tools/audio/generate_system_breach_sfx.py), played through
 * the game's SFX volume. Each cue has a minimum gap so a burst of events never stacks into noise; a missing file is
 * simply silent.
 */
final class SbSounds implements Disposable {
    private static final String[] NAMES={"solve","key","hack_start","hack_success","hack_fail","sabotage","clean","firewall","multiplier","tick","whoosh","drumroll","reveal","fanfare","thunder","ghost","complete"};
    private final Map<String,Sound> sounds=new HashMap<>();private final Map<String,Long> last=new HashMap<>();
    SbSounds(){for(String n:NAMES)try{var f=Gdx.files.internal("system_breach/sfx/"+n+".wav");if(f.exists())sounds.put(n,Gdx.audio.newSound(f));}catch(RuntimeException ignored){}}
    void play(String name){play(name,1);}
    void play(String name,float volume){
        Sound s=sounds.get(name);if(s==null)return;long now=System.currentTimeMillis(),gap=name.equals("solve")||name.equals("tick")?180:350;
        if(now-last.getOrDefault(name,0L)<gap)return;last.put(name,now);
        s.play(Math.min(1,volume*AudioMix.GLOBAL.gain(AudioMix.Category.SFX)));
    }
    /** Event type from the server log → cue. */
    static String cue(String type){
        return switch(type){
            case "CHALLENGE_SOLVED"->"solve";case "KEY_EARNED","KEY_BOUGHT"->"key";case "ATTACK_STARTED"->"hack_start";case "ATTACK_SUCCEEDED"->"hack_success";
            case "ATTACK_FAILED","ATTACK_EXPIRED"->"hack_fail";case "SABOTAGE_STARTED","TROJAN","DATA_LEAK","SYSTEM_OVERLOAD","FIREWALL_BREAKER"->"sabotage";
            case "SABOTAGE_CLEARED","RECOVERY_SUCCEEDED","EMERGENCY_RESTORED"->"clean";case "SABOTAGE_BLOCKED","FIREWALL_UPGRADED"->"firewall";
            case "MULTIPLIER_UPGRADED"->"multiplier";case "RESULTS"->"complete";default->null;
        };
    }
    @Override public void dispose(){for(Sound s:sounds.values())s.dispose();sounds.clear();}
}
