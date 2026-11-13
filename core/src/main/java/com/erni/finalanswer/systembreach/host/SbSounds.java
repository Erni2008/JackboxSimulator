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
    private static final String[] NAMES={"solve","key","hack_start","hack_success","hack_fail","sabotage","clean","firewall","multiplier","tick","tock","whoosh","drumroll","reveal","fanfare","thunder","ghost","complete","sentence","charge","strike","shatter","soul","coin_ok","coin_bad"};
    private final Map<String,java.util.List<Sound>> sounds=new HashMap<>();private final java.util.Random random=new java.util.Random();private final Map<String,Long> last=new HashMap<>();
    /** Loads name.wav plus its variants name_2.wav, name_3.wav when present. */
    SbSounds(){for(String n:NAMES)for(String v:new String[]{"","_2","_3"})try{var f=Gdx.files.internal("system_breach/sfx/"+n+v+".wav");if(f.exists())sounds.computeIfAbsent(n,k->new java.util.ArrayList<>()).add(Gdx.audio.newSound(f));}catch(RuntimeException ignored){}}
    void play(String name){play(name,1);}
    void play(String name,float volume){
        var list=sounds.get(name);if(list==null||list.isEmpty())return;long now=System.currentTimeMillis(),gap=name.startsWith("coin")?110:name.equals("solve")?1500:name.startsWith("t")&&name.length()==4?150:400;
        if(now-last.getOrDefault(name,0L)<gap)return;last.put(name,now);
        // a different take and a hair of pitch each time, so repeats never sound mechanical
        boolean tonal=!name.equals("thunder")&&!name.equals("drumroll");float pitch=tonal&&list.size()>1?1:.97f+random.nextFloat()*.06f;
        list.get(random.nextInt(list.size())).play(Math.min(1,volume*AudioMix.GLOBAL.gain(AudioMix.Category.SFX)),pitch,0);
    }
    /** Event type from the server log → cue. */
    static String cue(String type){
        return switch(type){
            case "CHALLENGE_SOLVED"->"coin_ok";case "CHALLENGE_FAILED"->"coin_bad";   // dozens per match: the floating "+N AP" says it visually
            case "KEY_EARNED","KEY_BOUGHT"->"key";case "ATTACK_STARTED"->"hack_start";case "ATTACK_SUCCEEDED"->"hack_success";
            case "ATTACK_FAILED","ATTACK_EXPIRED"->"hack_fail";case "SABOTAGE_STARTED","TROJAN","DATA_LEAK","SYSTEM_OVERLOAD","FIREWALL_BREAKER"->"sabotage";
            case "SABOTAGE_CLEARED","RECOVERY_SUCCEEDED","EMERGENCY_RESTORED"->"clean";case "SABOTAGE_BLOCKED","FIREWALL_UPGRADED"->"firewall";
            case "MULTIPLIER_UPGRADED"->"multiplier";case "RESULTS"->"complete";default->null;
        };
    }
    @Override public void dispose(){for(var l:sounds.values())for(Sound s:l)s.dispose();sounds.clear();}
}
