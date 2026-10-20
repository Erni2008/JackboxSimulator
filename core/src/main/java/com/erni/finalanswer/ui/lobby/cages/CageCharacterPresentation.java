package com.erni.finalanswer.ui.lobby.cages;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.g2d.Batch;
import com.badlogic.gdx.math.Matrix4;
import com.badlogic.gdx.math.Vector2;
import com.badlogic.gdx.utils.Array;
import com.badlogic.gdx.utils.Json;

/** Lobby-only framing and material tint. Animation rigs and shared artwork remain unchanged. */
public final class CageCharacterPresentation {
    public static final String PATH="lobby/character_presentation.json";
    public static final class Profile {
        public String id="";public float scale=1,pivotX=174,pivotY=68,x,y,brightness=1,growAt,growDuration;
        public void inverse(Vector2 point){point.set(pivotX+(point.x-pivotX-x)/scale,pivotY+(point.y-pivotY-y)/scale);}
    }
    public static final class Settings {
        public Array<Profile> profiles=new Array<>(Profile.class);
        private final Profile fallback=new Profile();
        public Profile profile(String id){for(int i=0;i<profiles.size;i++)if(profiles.get(i).id.equals(id))return profiles.get(i);return fallback;}
        public static Settings parse(String text){Settings settings=new Json().fromJson(Settings.class,text);var ids=new java.util.HashSet<String>();
            for(Profile p:settings.profiles){if(p.id.isBlank()||!ids.add(p.id))throw new IllegalArgumentException("Duplicate/empty character profile");
                for(float f:new float[]{p.scale,p.pivotX,p.pivotY,p.x,p.y,p.brightness,p.growAt,p.growDuration})if(!Float.isFinite(f))throw new IllegalArgumentException("Nonfinite character presentation");
                if(p.growAt<0||p.growDuration<0||p.scale<=0||p.brightness<=0||p.brightness>1)throw new IllegalArgumentException("Invalid character scale/brightness");}
            return settings;}
        public static Settings load(){return parse(Gdx.files.internal(PATH).readString("UTF-8"));}
    }
    private final Matrix4 saved=new Matrix4(),framed=new Matrix4();private final Color color=new Color();
    public void draw(Batch batch,CageCharacter character,Profile p,float alpha,float time){
        saved.set(batch.getTransformMatrix());color.set(batch.getColor());
        float amount=p.growDuration>0?CageAnimator.smooth(CageAnimator.progress(time,p.growAt,p.growDuration)):1;
        float scale=1+(p.scale-1)*amount;
        framed.set(saved).translate(p.pivotX+p.x*amount,p.pivotY+p.y*amount,0).scale(scale,scale,1).translate(-p.pivotX,-p.pivotY,0);
        try{batch.setTransformMatrix(framed);batch.setColor(color.r*p.brightness,color.g*p.brightness,color.b*p.brightness,color.a);character.draw(batch,alpha);}
        finally{batch.setTransformMatrix(saved);batch.setColor(color);}
    }
}
