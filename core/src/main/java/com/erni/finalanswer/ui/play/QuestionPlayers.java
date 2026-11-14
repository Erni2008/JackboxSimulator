package com.erni.finalanswer.ui.play;

import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.math.MathUtils;
import com.badlogic.gdx.graphics.g2d.*;
import com.badlogic.gdx.math.Matrix4;
import com.badlogic.gdx.scenes.scene2d.Actor;
import com.badlogic.gdx.scenes.scene2d.Touchable;
import com.badlogic.gdx.utils.Disposable;
import com.erni.finalanswer.ui.UiFonts;
import com.erni.finalanswer.ui.lobby.cages.*;
import com.google.gson.JsonObject;
import java.util.*;

/** Cage-free production rigs. Textures/profiles remain owned by the existing room asset owner. */
public final class QuestionPlayers extends Actor implements Disposable {
    /** Question-screen-only rate: lobby timings and held poses remain unchanged. */
    public static float answeringAnimationSpeed=1.5f;
    public static final float THINKING_SCALE=1f/1.35f, GROW_SECONDS=.30f;
    private static final class Entry {
        final QuestionPlayerStates.Player player;final CageCharacter character;final CageCharacterPresentation.Profile profile;
        final float phase,height,floor;final GlyphLayout name=new GlyphLayout();
        String nickname="";float time=8,nameScale=1,nameWidth,size=THINKING_SCALE,sizeFrom=THINKING_SCALE,sizeTarget=THINKING_SCALE,sizeAge=GROW_SECONDS,shakeTime,shakeEnvelope;boolean showingCorrect;
        Entry(QuestionPlayerStates.Player player,CageLobby source){
            this.player=player;character=source.createCharacter(player.characterId);profile=source.presentation(player.characterId);
            phase=(player.id.hashCode()&0xffff)*.001f;
            height=switch(player.characterId){case "skeleton"->120;case "ghost"->152;case "plague_doctor"->194;case "voodoo"->153;default->160;};
            floor=switch(player.characterId){case "skeleton","ghost"->69;case "puppeteer"->68;case "pumpkin"->67;default->63;};
            // Evaluate the existing entrance once offscreen; round playback starts in its existing idle.
            for(int i=1;i<=240;i++)character.update(1f/30,i/30f,phase,false);
        }
    }
    private final CageLobby source;
    private final QuestionPlayerStates states=new QuestionPlayerStates();
    private final ArrayList<Entry> entries=new ArrayList<>(8);
    private final BitmapFont font=UiFonts.question(26);
    private final Matrix4 saved=new Matrix4(),local=new Matrix4();
    private final Color color=new Color(),fontSaved=new Color();
    private final CageCharacterPresentation presentation=new CageCharacterPresentation();
    private JsonObject previous;
    private final TextureRegion uiPixel;
    private boolean reduced,choicesVisible;
    /** Driven by the real first answer reveal, not by question typing or timer initialization. */
    public void answersVisible(boolean visible){choicesVisible=visible;}
    public boolean shaking(String id){for(Entry e:entries)if(e.player.id.equals(id))return choicesVisible&&e.player.thinking&&!reduced;return false;}
    public QuestionPlayers(CageLobby source,Texture pixel){uiPixel=new TextureRegion(Objects.requireNonNull(pixel));this.source=Objects.requireNonNull(source);setTouchable(Touchable.disabled);setName("questionPlayers");}
    public QuestionPlayerStates states(){return states;}
    public float animationTime(String id){for(Entry e:entries)if(e.player.id.equals(id))return e.time;return -1;}
    public float presentationScale(String id){for(Entry e:entries)if(e.player.id.equals(id))return e.size;return -1;}
    public CageCharacter character(String id){for(Entry e:entries)if(e.player.id.equals(id))return e.character;return null;}
    public void synchronize(JsonObject snapshot,long serverNow){
        if(snapshot!=previous){previous=snapshot;states.synchronize(snapshot,serverNow);
            entries.removeIf(e->!states.players().contains(e.player));
            for(var player:states.players()){boolean exists=false;for(Entry e:entries)if(e.player==player){exists=true;break;}if(!exists)entries.add(new Entry(player,source));}
        }else states.update(serverNow);
        for(Entry e:entries){
            e.showingCorrect=e.player.correct;
            float target=e.player.submitted?1:THINKING_SCALE;
            if(target!=e.sizeTarget){e.sizeFrom=e.size;e.sizeTarget=target;e.sizeAge=0;}
        }
    }
    public void advance(float delta,boolean reduced){
        this.reduced=reduced;
        if(!Float.isFinite(delta)||delta<=0)return;
        for(Entry e:entries){
            e.sizeAge+=delta;
            float growth=reduced?1:com.badlogic.gdx.math.Interpolation.smooth.apply(Math.min(1,e.sizeAge/GROW_SECONDS));
            e.size=e.sizeFrom+(e.sizeTarget-e.sizeFrom)*growth;
            boolean nervous=choicesVisible&&e.player.thinking&&!reduced;
            if(nervous)e.shakeTime+=delta;
            e.shakeEnvelope=states.activeRound()?MathUtils.clamp(e.shakeEnvelope+(nervous?1:-1)*delta/.14f,0,1):0;
            if(e.player.playing||e.player.ghost){float step=delta*answeringAnimationSpeed;e.time+=step;e.character.update(step,e.time,e.phase,reduced);}
        }
    }
    @Override public void draw(Batch batch,float alpha){
        if(entries.isEmpty())return;
        saved.set(batch.getTransformMatrix());color.set(batch.getColor());
        float cell=Math.min(240,(getWidth()-120)/entries.size()),left=getX()+(getWidth()-cell*entries.size())/2;
        float oldScaleX=font.getData().scaleX,oldScaleY=font.getData().scaleY;fontSaved.set(font.getColor());
        try{for(int i=0;i<entries.size();i++){
            Entry e=entries.get(i);float center=left+(i+.5f)*cell;
            float scale=Math.min(135/e.height,(cell-24)/150)*e.size;
            float shakeX=!reduced?MathUtils.sin(e.shakeTime*31+e.phase)*.65f*e.shakeEnvelope:0;
            float shakeY=!reduced?MathUtils.sin(e.shakeTime*27+e.phase*1.7f)*.28f*e.shakeEnvelope:0;
            local.set(saved).translate(center+shakeX,getY()+52+shakeY,0).scale(scale,scale,1).translate(-174,-e.floor,0);
            batch.setTransformMatrix(local);
            if(e.player.ghost)batch.setColor(.63f,.78f,.88f,color.a);
            presentation.draw(batch,e.character,e.profile,alpha*(e.player.ghost?.52f:1),e.time);
            batch.setColor(color);
            batch.setTransformMatrix(saved);
            if(!e.nickname.equals(e.player.nickname)){
                e.nickname=e.player.nickname;font.getData().setScale(1);e.name.setText(font,e.nickname);
                e.nameWidth=e.name.width;
            }
            e.nameScale=Math.min(1,(cell-16)/Math.max(1,e.nameWidth));
            font.getData().setScale(e.nameScale);e.name.setText(font,e.nickname);
            float x=center-e.name.width/2,y=getY()+43;
            font.setColor(.015f,.008f,.008f,alpha*.9f);font.draw(batch,e.nickname,x+1.4f,y-1.4f);
            font.setColor(com.erni.finalanswer.ui.PlayerColors.light(e.player.characterId));font.getColor().a=alpha;font.draw(batch,e.nickname,x,y);
            font.getData().setScale(Math.min(.48f,(cell-16)/105f));
            String status=e.player.ghost?"GHOST":!e.player.online?"OFFLINE":"ALIVE";
            font.setColor(e.player.ghost?.60f:.77f,e.player.ghost?.80f:.86f,e.player.ghost?.93f:.66f,alpha);
            e.name.setText(font,status);font.draw(batch,status,center-e.name.width/2,getY()+18);
            if(e.showingCorrect){drawCorrect(batch,center+cell*.30f,getY()+142,alpha);batch.setColor(color);}
        }}finally{batch.setTransformMatrix(saved);batch.setColor(color);font.getData().setScale(oldScaleX,oldScaleY);font.setColor(fontSaved);}
    }
    private void drawCorrect(Batch batch,float x,float y,float alpha){
        float size=1,first=1,second=1;
        // Ink-dark outline plus two mint strokes, shown immediately. No added image or glow.
        for(int pass=0;pass<2;pass++){
            if(pass==0)batch.setColor(.015f,.04f,.025f,alpha);
            else batch.setColor(.65f,.96f,.70f,alpha);
            float width=(pass==0?7:4.2f)*size;
            line(batch,x-13*size,y+7*size,x+(-13+9*first)*size,y+(7-10*first)*size,width);
            if(second>0)line(batch,x-4*size,y-3*size,x+(-4+21*second)*size,y+(-3+25*second)*size,width);
        }
    }
    private void line(Batch batch,float ax,float ay,float bx,float by,float width){
        float dx=bx-ax,dy=by-ay,length=(float)Math.sqrt(dx*dx+dy*dy);if(length<=0)return;
        batch.draw(uiPixel,ax+dy/length*width/2,ay-dx/length*width/2,0,0,length,width,1,1,MathUtils.atan2(dy,dx)*MathUtils.radiansToDegrees);
    }
    @Override public void dispose(){entries.clear();font.dispose();}
}
