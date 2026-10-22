package com.erni.finalanswer.shotgun;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.audio.Sound;
import com.badlogic.gdx.files.FileHandle;
import com.badlogic.gdx.math.MathUtils;
import com.badlogic.gdx.utils.Disposable;
import java.nio.*;

/** Optional event/phase audio adapter. Does not consume the mode's animator listener. */
public final class ShotgunAudio implements Disposable {
    private final ShotgunConfig config;
    private final Sound[] sounds=new Sound[4];
    private final float[] duration=new float[4];
    private ShotgunAnimator.State state=ShotgunAnimator.State.IDLE;
    private ShotgunAnimator.CyclePhase phase=ShotgunAnimator.CyclePhase.IDLE;
    private long shots;
    private int reloadSegment;
    private boolean muted,disposed;
    private final boolean nativeAudio;
    public ShotgunAudio(ShotgunConfig config){
        this.config=config;nativeAudio=!Gdx.audio.getClass().getSimpleName().startsWith("Mock");
        String[] paths={config.fireSound,config.pumpBackSound,config.pumpForwardSound,config.loadSound};
        for(int i=0;i<paths.length;i++){
            if(paths[i]==null||paths[i].isBlank())continue;
            FileHandle file=Gdx.files.internal(paths[i]);
            try{duration[i]=wavDuration(file);sounds[i]=Gdx.audio.newSound(file);}
            catch(RuntimeException error){Gdx.app.log("Shotgun audio","Unavailable "+paths[i]+": "+error.getMessage());}
        }
    }
    /** Prime native source/buffer attachment during a host loading phase, without audible playback. */
    public void warmup(){for(Sound sound:sounds)if(sound!=null){long id=sound.play(0f);if(id>=0)sound.stop(id);}}
    public boolean available(){if(!nativeAudio)return false;for(Sound sound:sounds)if(sound==null)return false;return true;}
    public boolean muted(){return muted;}
    public void muted(boolean muted){this.muted=muted;if(muted)stop();}
    public void stop(){for(Sound sound:sounds)if(sound!=null)sound.stop();}
    private void play(int index,float seconds){
        if(muted||config.audioVolume<=0||sounds[index]==null)return;
        float pitch=seconds<=0?1:MathUtils.clamp(duration[index]/seconds,.5f,2);
        sounds[index].play(config.audioVolume,pitch,0);
    }
    public void update(ShotgunAnimator animator){
        var next=animator.state();var cycle=animator.cyclePhase();
        if(animator.shotSerial()!=shots){shots=animator.shotSerial();if(next==ShotgunAnimator.State.FIRING)play(0,0);}
        if(next==ShotgunAnimator.State.PUMP){
            if(cycle==ShotgunAnimator.CyclePhase.PUMP_BACKWARD&&(state!=next||phase!=cycle))play(1,config.pumpDuration*.45f);
            if(cycle==ShotgunAnimator.CyclePhase.PUMP_FORWARD&&(state!=next||phase!=cycle))play(2,config.pumpDuration*.45f);
        }else if(next==ShotgunAnimator.State.OPENING&&state!=next)play(1,config.boltDuration);
        else if(next==ShotgunAnimator.State.CLOSING&&state!=next)play(2,config.boltDuration);
        else if(next==ShotgunAnimator.State.RELOAD){
            if(state!=next)reloadSegment=-1;
            int segment=animator.progress()<.25f?0:animator.progress()<.6f?1:2;
            if(segment!=reloadSegment){reloadSegment=segment;play(segment==0?1:segment==1?3:2,config.reloadDuration*(segment==0?.25f:segment==1?.35f:.4f));}
        }
        state=next;phase=cycle;
    }
    private static float wavDuration(FileHandle file){
        byte[] bytes=file.readBytes();ByteBuffer buffer=ByteBuffer.wrap(bytes).order(ByteOrder.LITTLE_ENDIAN);
        if(bytes.length<44||buffer.getInt(0)!=0x46464952||buffer.getInt(8)!=0x45564157)throw new IllegalArgumentException("Expected PCM WAV");
        int rate=0,data=0;
        for(int i=12;i+8<=bytes.length;){int id=buffer.getInt(i),size=buffer.getInt(i+4);if(size<0||size>bytes.length-i-8)throw new IllegalArgumentException("Malformed WAV chunk");
            if(id==0x20746d66&&size>=16)rate=buffer.getInt(i+16);if(id==0x61746164)data=size;i+=8+size+(size&1);}
        if(rate<=0||data<=0)throw new IllegalArgumentException("Missing WAV data");return data/(float)rate;
    }
    @Override public void dispose(){if(disposed)return;disposed=true;for(Sound sound:sounds)if(sound!=null){sound.stop();sound.dispose();}}
}
