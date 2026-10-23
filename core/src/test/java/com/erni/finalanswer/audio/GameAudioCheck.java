package com.erni.finalanswer.audio;

import com.badlogic.gdx.audio.*;
import java.lang.reflect.*;
import java.util.*;
import static com.erni.finalanswer.audio.GameAudio.Cue.*;

/** Audio-device-independent resource, mix, motion, cooldown and lifecycle regression. */
public final class GameAudioCheck {
    private static void check(boolean value,String message){if(!value)throw new AssertionError(message);}
    private static final class Fake implements InvocationHandler {
        final java.util.List<Float> pans=new java.util.ArrayList<>();
        int plays,stops,disposals;long next=1;float volume,pan;boolean playing,loop;
        public Object invoke(Object proxy,Method method,Object[] args){
            switch(method.getName()){
                case "play" -> {plays++;playing=true;if(args!=null&&args.length>0)volume=(float)args[0];if(args!=null&&args.length>2){pan=(float)args[2];pans.add(pan);}if(method.getReturnType()==long.class)return next++;}
                case "stop","pause" -> {stops++;playing=false;}
                case "dispose" -> disposals++;
                case "isPlaying" -> {return playing;}
                case "setLooping" -> loop=(boolean)args[0];
                case "setVolume" -> volume=(float)args[args.length-1];
            }
            if(method.getReturnType()==boolean.class)return false;if(method.getReturnType()==float.class)return 0f;if(method.getReturnType()==long.class)return 0L;if(method.getReturnType()==int.class)return 0;return null;
        }
        <T>T proxy(Class<T> type){return type.cast(Proxy.newProxyInstance(type.getClassLoader(),new Class<?>[]{type},this));}
    }
    public static void main(String[] args){
        var files=new HashMap<String,Fake>();var track=new Fake();var warnings=new ArrayList<String>();var mix=new AudioMix();
        var audio=new GameAudio(new PresentationAudio.Backend(){public Sound sound(String path){var f=new Fake();files.put(path,f);return f.proxy(Sound.class);}public Music music(String path){check(path.equals(GameAudio.AMBIENCE),"Real ambience path");return track.proxy(Music.class);}},mix,warnings::add);
        check(audio.loaded()==7&&track.loop,"Six cached effects and one looped Music");
        audio.hover();audio.hover();check(audio.playCount(HOVER)==1,"Hover entry cooldown");audio.update(.09f);audio.hover();check(audio.playCount(HOVER)==2,"Next hover after cooldown");
        audio.press();audio.press();check(audio.playCount(PRESS)==1&&files.get(PRESS.path).volume==.55f,"Immediate press, duplicate mouse/touch rejection");
        audio.update(.03f);audio.uiGain(0);audio.press();check(audio.playCount(PRESS)==1,"Existing screen-local mute also governs shared UI");audio.uiGain(1);
        for(int i=0;i<8;i++){audio.gate(i,(i-3.5f)/6);audio.gate(i,0);}check(audio.playCount(GATE)==8,"Eight independent gates; duplicate impact suppressed");
        audio.update(2);
        for(int i=0;i<8;i++)audio.lock(i,0);check(audio.playCount(GATE_LOCK)==1,"Overlapping key locks do not stack or restart the full recording");
        int lockStops=files.get(GATE_LOCK.path).stops;audio.update(2);check(files.get(GATE_LOCK.path).stops==lockStops,"Metal key resonance is not cut at the short gate duration");
        audio.update(6.1f);audio.lock(0,0);check(audio.playCount(GATE_LOCK)==2,"Next closure can play the key again");
        for(int i=0;i<8;i++)audio.cageMotion(i,true,0,.016f,0);
        for(int i=0;i<8;i++)audio.cageMotion(i,true,.3f,.016f,(i-3.5f)/6);
        check(audio.playCount(CHAIN_1)==4&&audio.playCount(CHAIN_2)==4&&audio.activeChains()<=2,"Eight independent movements, alternating chain variations, bounded voices");
        check(files.get(CHAIN_2.path).pans.getFirst()<0&&files.get(CHAIN_2.path).pans.getLast()>0,"Left/right chain stereo panning");
        long chains=audio.playCount(CHAIN_1)+audio.playCount(CHAIN_2);
        for(int i=0;i<8;i++)audio.cageMotion(i,true,-.3f,.016f,0);
        check(audio.playCount(CHAIN_1)+audio.playCount(CHAIN_2)==chains,"Per-cage motion cooldown");
        audio.room(true);audio.update(1);check(track.playing&&Math.abs(track.volume-.2f)<.001f,"Quiet room ambience");
        int starts=track.plays;for(int i=0;i<20;i++)audio.update(.016f);check(track.plays==starts,"No render-time Music restarts");
        mix.important(.4f);audio.update(.1f);check(track.volume<.15f,"Smooth important-event ducking");audio.update(2);check(Math.abs(track.volume-.2f)<.01f,"Ambience recovers");
        mix.master=.5f;audio.update(.5f);check(Math.abs(track.volume-.1f)<.01f,"Shared master gain");
        audio.pause(true);audio.update(.1f);check(!track.playing&&audio.activeChains()==0,"Pause stops effects and cannot resume Music");audio.pause(false);audio.update(.2f);check(track.playing,"Resume existing track");
        audio.room(false);audio.update(1);check(!track.playing,"Fade out when leaving room");audio.leaveCages();audio.close();audio.close();
        for(Fake f:files.values())check(f.disposals==1,"Effects disposed once");check(track.disposals==1&&warnings.isEmpty(),"Music disposed once without device errors");
        var absent=new GameAudio(new PresentationAudio.Backend(){public Sound sound(String path){return null;}public Music music(String path){return null;}},new AudioMix(),warnings::add);
        check(absent.loaded()==0&&warnings.size()==7,"Missing assets are optional and actionable");absent.hover();absent.room(true);absent.update(1);absent.close();
        System.out.println("PASS: cached UI/cage/Music resources, eight independent cages, chain variation/voice cap/panning, cooldowns, shared master, ducking, pause/resume/exit and disposal");
    }
}
