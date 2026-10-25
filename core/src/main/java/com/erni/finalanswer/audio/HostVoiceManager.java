package com.erni.finalanswer.audio;

import com.badlogic.gdx.assets.AssetManager;
import com.badlogic.gdx.audio.Music;
import com.google.gson.*;
import java.util.*;
import java.util.function.Consumer;

/** Offline narration owned by GameAudio. Call on the render thread; decoding uses AssetManager's worker. */
public final class HostVoiceManager implements AutoCloseable {
    public enum Result { COMPLETED, MISSING, CANCELLED, FAILED }
    public interface Loader extends AutoCloseable {
        void load(String path);
        boolean update();
        Music music(String path);
        default Manifest manifest(){return null;}
        void unload(String path);
        @Override void close();
    }
    public static final class Manifest {
        public int version;
        public String language,voiceId;
        public Map<String,Entry> questions=Map.of(),events=Map.of(),intro=Map.of();
    }
    public static final class Entry {public String file,status,hash;public float duration;}
    private record Request(String id,String path,float offset,Consumer<Result> completion) {}
    private record Pending(String section,String id,float offset,Consumer<Result> completion) {}
    private final Loader loader;
    private Manifest manifest;
    private final String root;
    private final AudioMix mix;
    private final Consumer<String> warning;
    private final Set<String> seen=new LinkedHashSet<>(),warned=new HashSet<>();
    private Request queued,current,startedCurrent;
    private final LinkedHashMap<String,Integer> playCounts=new LinkedHashMap<>();
    public Map<String,Integer> playCounts(){return Map.copyOf(playCounts);}
    private Pending pending;
    private String loading;
    private Music music;
    private boolean paused,closed,manifestPending;
    private float volume=.8f,scopeGain=1;
    private float seekOffset;
    private final Set<String> retained=new LinkedHashSet<>();
    private Collection<String> introBank=List.of();
    private boolean bankQueued,releaseBank,allowIntroReview;
    private float gain(){return volume*scopeGain*mix.gain(AudioMix.Category.SFX);}

    public HostVoiceManager(String language,AudioMix mix,Consumer<String> warning){
        this(emptyManifest(language),new GdxLoader(language),mix,warning);manifestPending=true;
    }
    public HostVoiceManager(Manifest manifest,Loader loader,AudioMix mix,Consumer<String> warning){
        this.manifest=Objects.requireNonNull(manifest);this.loader=Objects.requireNonNull(loader);
        this.mix=Objects.requireNonNull(mix);this.warning=Objects.requireNonNull(warning);
        if(manifest.version!=1||manifest.language==null||!manifest.language.matches("[a-z]{2}"))
            throw new IllegalArgumentException("Unsupported host manifest version/language");
        root="audio/host/"+manifest.language+"/";
    }
    private static Manifest emptyManifest(String language){
        if(!language.matches("[a-z]{2}"))throw new IllegalArgumentException("Invalid narration language");
        Manifest empty=new Manifest();empty.version=1;empty.language=language;empty.voiceId="unavailable";return empty;
    }
    public void playQuestion(String id){playQuestion(id,null,null);}
    public void playLine(String id){playLine(id,null,null);}
    public void playQuestion(String id,String eventId,Consumer<Result> completion){request("questions",id,eventId,completion);}
    public void playLine(String id,String eventId,Consumer<Result> completion){request("events",id,eventId,completion);}
    public void playIntro(String id,String eventId,Consumer<Result> completion){request("intro",id,eventId,completion);}
    public void playIntro(String id,String eventId,float offset,Consumer<Result> completion){request("intro",id,eventId,offset,completion);}
    public boolean manifestReady(){return !manifestPending;}
    public Entry eventEntry(String id){return manifest.events==null?null:manifest.events.get(id);}
    public Entry introEntry(String id){return manifest.intro==null?null:manifest.intro.get(id);}
    public void prepareIntro(Collection<String> ids,boolean review){introBank=List.copyOf(ids);allowIntroReview=review;bankQueued=false;releaseBank=false;}
    public boolean introPrepared(){return !manifestPending&&bankQueued&&loaderReady;}
    private boolean loaderReady;
    public void releaseIntro(){stop();introBank=List.of();releaseBank=true;}
    private void request(String section,String id,String eventId,Consumer<Result> completion){
        request(section,id,eventId,0,completion);
    }
    private void request(String section,String id,String eventId,float offset,Consumer<Result> completion){
        if(closed){complete(completion,Result.CANCELLED);return;}
        if(eventId!=null&&!eventId.isBlank()){
            if(!seen.add(eventId))return;
            if(seen.size()>128)seen.remove(seen.iterator().next());
        }
        stop();
        if(manifestPending){pending=new Pending(section,id,offset,completion);return;}
        resolve(section,id,offset,completion);
    }
    private void resolve(String section,String id,float offset,Consumer<Result> completion){
        Map<String,Entry> entries=switch(section){case "questions"->manifest.questions;case "intro"->manifest.intro;default->manifest.events;};
        Entry entry=entries==null?null:entries.get(id);
        if(entry==null||!("ready".equals(entry.status)||section.equals("intro")&&allowIntroReview&&"review".equals(entry.status))||!safePath(entry.file)){
            warn("Missing approved host narration: "+id);complete(completion,Result.MISSING);return;
        }
        queued=new Request(id,root+entry.file,Float.isFinite(offset)?Math.max(0,offset):0,completion);
    }
    private static boolean safePath(String file){
        return file!=null&&file.matches("(?:questions|events|intro)/[A-Za-z0-9_-]+\\.ogg");
    }
    private void warn(String message){if(warned.add(message))warning.accept(message);}
    private void complete(Consumer<Result> callback,Result result){
        if(callback!=null)try{callback.accept(result);}catch(RuntimeException error){warn("Host completion callback failed: "+error.getMessage());}
    }
    public void update(){
        if(closed)return;
        try{
            boolean ready=loader.update();
            loaderReady=ready;
            if(manifestPending&&ready){
                Manifest loaded=loader.manifest();manifestPending=false;
                if(loaded!=null&&loaded.version==1&&manifest.language.equals(loaded.language))manifest=loaded;
                else warn("Unsupported or missing host narration manifest");
                Pending waiting=pending;pending=null;
                if(waiting!=null)resolve(waiting.section(),waiting.id(),waiting.offset(),waiting.completion());
            }
            if(!manifestPending&&!bankQueued&&!introBank.isEmpty()){
                bankQueued=true;loaderReady=false;ready=false;
                for(String id:introBank){Entry entry=introEntry(id);if(entry!=null&&safePath(entry.file)&&("ready".equals(entry.status)||allowIntroReview&&"review".equals(entry.status))&&retained.add(root+entry.file))loader.load(root+entry.file);}
            }
            if(loading!=null&&ready){
                String path=loading;loading=null;
                if(current==null){loader.unload(path);}
                else{music=loader.music(path);if(music==null)throw new IllegalStateException("No music for "+path);
                    music.setLooping(false);music.setVolume(gain());
                    Request playing=current;
                    music.setOnCompletionListener(ignored->{if(current==playing)finish(Result.COMPLETED);});
                    seekOffset=current.offset();if(!paused)startMusic();}
            }
            if(current==null&&loading==null&&queued!=null){
                current=queued;queued=null;loading=current.path();loader.load(loading);
            }
            if(music!=null){music.setVolume(gain());if(!paused&&gain()>0)mix.important(.2f);}
            if(releaseBank&&ready&&loading==null){for(String path:retained)loader.unload(path);retained.clear();releaseBank=false;allowIntroReview=false;bankQueued=false;}
        }catch(RuntimeException error){
            warn("Host narration playback failed: "+error.getMessage());
            if(manifestPending){manifestPending=false;Pending waiting=pending;pending=null;if(waiting!=null)complete(waiting.completion(),Result.MISSING);}
            loading=null;finish(Result.FAILED);
        }
    }
    private void finish(Result result){
        seekOffset=0;
        Request done=current;current=null;startedCurrent=null;
        if(music!=null){try{music.setOnCompletionListener(null);music.stop();}catch(RuntimeException error){warn("Cannot stop host narration: "+error.getMessage());}finally{music=null;}}
        if(done!=null&&loading==null)try{loader.unload(done.path());}catch(RuntimeException error){warn("Cannot unload host narration: "+error.getMessage());}
        if(done!=null)complete(done.completion(),result);
    }
    public void stop(){
        Pending unresolved=pending;pending=null;
        Request pending=queued;queued=null;finish(Result.CANCELLED);
        if(unresolved!=null)complete(unresolved.completion(),Result.CANCELLED);
        if(pending!=null)complete(pending.completion(),Result.CANCELLED);
    }
    public void pause(){if(paused)return;paused=true;if(music!=null)try{music.pause();}catch(RuntimeException error){warn("Cannot pause host narration: "+error.getMessage());finish(Result.FAILED);}}
    private void applySeek(){if(seekOffset>0){music.setPosition(seekOffset);seekOffset=0;}}
    private void startMusic(){music.play();applySeek();if(!music.isPlaying())throw new IllegalStateException("Host audio device did not start playback");
        if(startedCurrent!=current&&current!=null){startedCurrent=current;playCounts.merge(current.id(),1,Integer::sum);if(playCounts.size()>128)playCounts.remove(playCounts.keySet().iterator().next());}
    }
    public void resume(){if(!paused)return;paused=false;if(music!=null)try{startMusic();}catch(RuntimeException error){warn("Cannot resume host narration: "+error.getMessage());finish(Result.FAILED);}}
    public void setVolume(float value){volume=AudioMix.unit(value);}
    public void scopeGain(float value){scopeGain=AudioMix.unit(value);}
    public float position(){return music==null?0:Math.max(0,music.getPosition());}
    public boolean busy(){return music!=null||current!=null||queued!=null||pending!=null||loading!=null;}
    public boolean playing(){return music!=null&&!paused;}
    @Override public void close(){if(closed)return;closed=true;stop();loader.close();}

    private static final class GdxLoader implements Loader {
        private final AssetManager assets=new AssetManager();
        private final String manifestPath;
        private RuntimeException failure;
        GdxLoader(String language){
            manifestPath="audio/host/"+language+"/manifest.json";
            assets.setErrorListener((asset,error)->failure=new IllegalStateException("Cannot load "+asset.fileName,error));
            assets.setLoader(Manifest.class,new ManifestLoader());assets.load(manifestPath,Manifest.class);
        }
        public Manifest manifest(){return assets.isLoaded(manifestPath,Manifest.class)?assets.get(manifestPath,Manifest.class):null;}
        public void load(String path){assets.load(path,Music.class);}
        public boolean update(){boolean ready=assets.update();if(failure!=null){RuntimeException error=failure;failure=null;throw error;}return ready;}
        public Music music(String path){return assets.get(path,Music.class);}
        public void unload(String path){if(assets.contains(path))assets.unload(path);}
        public void close(){assets.dispose();}
    }
    private static final class ManifestLoader extends com.badlogic.gdx.assets.loaders.AsynchronousAssetLoader<Manifest,com.badlogic.gdx.assets.AssetLoaderParameters<Manifest>> {
        private Manifest decoded;
        ManifestLoader(){super(new com.badlogic.gdx.assets.loaders.resolvers.InternalFileHandleResolver());}
        @Override public void loadAsync(AssetManager manager,String path,com.badlogic.gdx.files.FileHandle file,com.badlogic.gdx.assets.AssetLoaderParameters<Manifest> parameters){
            decoded=new Gson().fromJson(file.readString("UTF-8"),Manifest.class);
        }
        @Override public Manifest loadSync(AssetManager manager,String path,com.badlogic.gdx.files.FileHandle file,com.badlogic.gdx.assets.AssetLoaderParameters<Manifest> parameters){Manifest result=decoded;decoded=null;return result;}
        @Override public com.badlogic.gdx.utils.Array<com.badlogic.gdx.assets.AssetDescriptor> getDependencies(String path,com.badlogic.gdx.files.FileHandle file,com.badlogic.gdx.assets.AssetLoaderParameters<Manifest> parameters){return null;}
    }
}
