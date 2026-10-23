package com.erni.finalanswer.cursedboxes;

import com.badlogic.gdx.graphics.Camera;
import com.badlogic.gdx.graphics.g2d.TextureRegion;
import com.badlogic.gdx.graphics.g3d.decals.*;
import com.badlogic.gdx.math.MathUtils;
import java.util.Arrays;

/** Shared 2.5D animation. Every slot/identity decal is prepared once; switching only changes an index. */
public final class CursedCharacterController {
    public enum State { HIDDEN, REACTING, REVEALED }
    public static final float REACTION_DURATION=.3f;
    private static final CursedCharacterType[] TYPES=CursedCharacterType.values();
    private final Decal[][] frames=new Decal[16][TYPES.length];
    private final CursedCharacterFit[] fits=new CursedCharacterFit[TYPES.length];
    private final float[] hitAge=new float[16];
    private final State[] states=new State[16];
    public CursedCharacterController(CursedBoxesAssets assets,float height){
        for(CursedCharacterType type:TYPES){
            var texture=assets.characters[type.ordinal()];
            var fit=CursedCharacterFit.calculate(type,texture.getWidth(),texture.getHeight(),height);fits[type.ordinal()]=fit;
            TextureRegion region=new TextureRegion(texture);
            for(int slot=0;slot<16;slot++)frames[slot][type.ordinal()]=Decal.newDecal(fit.width(),fit.height(),region,true);
        }
        reset();
    }
    public void damage(int slot){hitAge[slot]=0;states[slot]=State.REACTING;}
    public void reveal(int slot){if(states[slot]==State.HIDDEN){hitAge[slot]=REACTION_DURATION;states[slot]=State.REVEALED;}}
    public State state(int slot){return states[slot];}
    public boolean wounded(int slot){return states[slot]!=State.HIDDEN;}
    public void reset(){Arrays.fill(hitAge,-1);Arrays.fill(states,State.HIDDEN);}
    public void update(float dt){for(int i=0;i<16;i++)if(states[i]==State.REACTING){
        hitAge[i]=Math.min(REACTION_DURATION,hitAge[i]+dt);
        if(hitAge[i]>=REACTION_DURATION)states[i]=State.REVEALED;
    }}
    public void render(DecalBatch batch,Camera camera,CrateSlot[] slots,float time){render(batch,camera,slots,time,null);}
    public void render(DecalBatch batch,Camera camera,CrateSlot[] slots,float time,com.finalanswer.protocol.CursedEliminationTimeline elimination){
        // A closed opaque front completely hides HIDDEN occupants; skip their draw calls as well.
        for(CrateSlot slot:slots)if(!slot.survivorOpening&&slot.character!=null&&(states[slot.id]!=State.HIDDEN||slot.previewHidden)){
            int type=slot.character.ordinal(),id=slot.id;
            Decal frame=frames[id][type];CursedCharacterFit fit=fits[type];
            float phase=id*.618f+type*.91f,t=time+phase,age=hitAge[id];
            float reaction=age<0?0:MathUtils.clamp(1-age/.3f,0,1);
            boolean victim=elimination!=null&&elimination.eligible(id);
            float fall=victim?elimination.fall():0,spirit=victim?elimination.spirit():0,slump=fall*(1-spirit);
            // Translation stays behind the front geometry. Recoil moves away from the camera.
            frame.setPosition(slot.position.x+MathUtils.sin(age*61+phase)*reaction*.005f,
                slot.position.y+fit.centerY()+MathUtils.sin(t*1.7f)*CursedCharacterFit.HOVER-.16f*slump+.12f*spirit+MathUtils.sin(t*1.1f)*.025f*spirit,
                slot.position.z+.09f-reaction*.08f);
            frame.lookAt(camera.position,camera.up);
            frame.rotateZ(MathUtils.sin(t*1.1f)*.6f+MathUtils.sin(age*35)*reaction*1.2f+(id%2==0?1:-1)*13*slump);
            float breathing=1+MathUtils.sin(t*1.8f)*CursedCharacterFit.BREATH-reaction*.04f;
            frame.setScale(breathing*(1-.08f*slump),breathing*(1-.18f*slump));
            frame.setColor(.92f-.29f*spirit,.88f-.12f*spirit,.8f,1-.68f*fall+.3f*spirit);batch.add(frame);
        }
    }
}
