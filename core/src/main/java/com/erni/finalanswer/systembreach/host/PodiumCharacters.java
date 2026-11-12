package com.erni.finalanswer.systembreach.host;

import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import com.badlogic.gdx.math.MathUtils;
import com.erni.finalanswer.impostor.ImpostorCharacterActor;
import com.erni.finalanswer.rooms.RoomSession;
import com.erni.finalanswer.systembreach.host.SystemBreachHostViewModel.*;
import com.erni.finalanswer.ui.lobby.cages.CageLobby;
import java.util.HashMap;
import java.util.Map;
import static com.erni.finalanswer.systembreach.host.SystemBreachLayout.*;

/**
 * The players' own room characters (the animated cage characters chosen in the lobby) standing behind their podiums,
 * with reaction motion layered on top of their idle: a shake when hacked, a hop on a successful hack, a lift on
 * recovery, a dimmed tint when compromised or disconnected and a victory bounce for the winner.
 */
final class PodiumCharacters {
    private final CageLobby source;private final SystemBreachHostAssets assets;
    private final Map<String,ImpostorCharacterActor> actors=new HashMap<>();
    PodiumCharacters(CageLobby source,SystemBreachHostAssets assets){this.source=source;this.assets=assets;}

    private ImpostorCharacterActor actor(Slot s){
        if(source==null||s.characterId.isEmpty())return null;
        return actors.computeIfAbsent(s.id+"/"+s.characterId,k->new ImpostorCharacterActor(source,new RoomSession.Player(s.id,s.name,false,s.characterId,"CONNECTED",false,0)));
    }

    void draw(SpriteBatch b,Slot s,float x,float time,float dt,boolean winner){
        float dx=0,dy=0,r=1,g=1,bl=1,a=1;float t=s.reactionAge;
        switch(s.reaction){
            case HIT->{if(t<.7f){float k=1-t/.7f;dx=MathUtils.sin(t*22)*7*k*k;r=1;g=bl=1-.55f*k;}}
            case TRIUMPH->{if(t<.9f)dy=Math.abs(MathUtils.sin(t*MathUtils.PI*2.2f))*22*(1-t/.9f);}
            case RECOVERED,UPGRADE->{if(t<.8f)dy=MathUtils.sin(t/.8f*MathUtils.PI)*12;}
            default->{}
        }
        switch(s.status){
            case BEING_HACKED->{dx+=MathUtils.sin(time*5.5f)*3;g*=.85f;bl*=.85f;}
            case COMPROMISED->{r*=.75f;g*=.45f;bl*=.45f;}
            case RECOVERY->{bl*=.8f;}
            case DISCONNECTED->{r=g=bl=.42f;a=.6f;}
            default->{}
        }
        if(winner)dy+=Math.abs(MathUtils.sin(time*3.4f))*14;
        float bottom=panelTop()-CHARACTER_SINK+dy;
        var actor=actor(s);
        if(actor!=null){
            actor.setBounds(x-CHARACTER_W/2+dx,bottom,CHARACTER_W,CHARACTER_H);actor.setColor(r,g,bl,a);actor.act(dt);actor.draw(b,1);
            return;
        }
        Texture portrait=assets.portrait(s.characterId);if(portrait==null)return;   // isolated fallback, see ASSETS.md
        float h=CHARACTER_H*.82f,w=h*portrait.getWidth()/portrait.getHeight();
        b.setColor(r,g,bl,a);b.draw(portrait,x-w/2+dx,bottom+CHARACTER_SINK*.6f,w,h);b.setColor(1,1,1,1);
    }
}
