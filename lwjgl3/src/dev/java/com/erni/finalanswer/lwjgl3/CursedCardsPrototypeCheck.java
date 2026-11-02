package com.erni.finalanswer.lwjgl3;

import com.badlogic.gdx.*;
import com.badlogic.gdx.backends.lwjgl3.*;
import com.badlogic.gdx.graphics.*;
import com.erni.finalanswer.cursedcards.*;
import com.erni.finalanswer.gameplay.cursedcards.*;
import java.util.*;

/**
 * Plays complete local matches (2, 5 and 8 players) through the 3D table and checks, at every turn, that the visual
 * hands mirror the authoritative rules, stay face down, and that the end state shows DEATH with the loser.
 * Screenshots go to -Dout=dir.
 */
public final class CursedCardsPrototypeCheck extends CursedCardsPrototype {
    private final String out=System.getProperty("out","/tmp");private final int[] counts={2,5,8};
    private int match,turns,textures=-1;private float t;private boolean started,manualDone,midShot,dealShot;private String pending;private final List<String> log=new ArrayList<>();private boolean failed;
    @Override public void create(){super.create();timeScale=3;Gdx.graphics.setContinuousRendering(true);}
    @Override protected void update(float dt){
        super.update(dt);t+=dt;
        if(resetNext&&t>-.8f){resetNext=false;resetMatch();}
        if(match>=counts.length)return;
        if(!started){if(t>.5f){if(textures<0)textures=Texture.getNumManagedTextures();setPlayers(counts[match]);startMatch();started=true;t=0;}return;}
        if(!dealShot&&t>3.5f*1){dealShot=true;shot("m"+players+"-1-dealing");}
        if(awaitingDraw()){
            turns++;mirror();
            if(!manualDone){manualDone=true;int before=hands.get(source).size;select(before-1);check(selectedSlot==before-1,"card selection");check(drawSelected(),"manual draw of the selected hidden card");return;}
            if(!midShot&&turns==3){midShot=true;debug=true;shot("m"+players+"-2-turn");return;}
            debug=false;drawRandom();check(turns<2000,"terminates");
        }
        if(game!=null&&game.phase()==CursedCardsGame.Phase.FINISHED&&!presenting()){
            check(loser==game.loser(),"loser shown = rules loser");
            check(hands.get(loser).size==1&&hands.get(loser).first().value==CardValue.DEATH&&!hands.get(loser).first().pose.faceDown(),"DEATH revealed in loser's place");
            int others=0;for(int p=0;p<players;p++)if(p!=loser)others+=hands.get(p).size;check(others==0,"survivors hold no cards");
            check(discardPile.size==game.deck().size()-1,"all pairs on the discard pile ("+discardPile.size+")");
            boolean faceUp=true;for(Card3D c:discardPile)faceUp&=!c.pose.faceDown()&&c.pose.position.y<.2f;check(faceUp,"discarded pairs face up on the table");
            shot("m"+players+"-3-result");log.add("match "+players+" players: "+turns+" turns, loser P"+(loser+1));
            match++;started=manualDone=midShot=dealShot=false;turns=0;t=-1;resetNext=true;
            if(match==counts.length){check(Texture.getNumManagedTextures()==textures,"no texture growth across matches ("+textures+" -> "+Texture.getNumManagedTextures()+")");finishSoon=true;}
        }
    }
    private boolean finishSoon,resetNext;
    /** Visual hands equal rules hands slot-for-slot, all face down, nothing visible that is not in a hand or the pile. */
    private void mirror(){
        boolean same=true,down=true;
        for(int p=0;p<players;p++){var rules=game.hand(p);var vis=hands.get(p);if(rules.size()!=vis.size){same=false;continue;}
            for(int k=0;k<vis.size;k++){same&=vis.get(k).id==rules.get(k).id();down&=vis.get(k).pose.faceDown();}}
        int visible=0;for(Card3D c:cards)if(c.visible)visible++;
        if(!same||!down||visible!=game.deck().size())check(false,"turn "+turns+": mirror="+same+" faceDown="+down+" visible="+visible);
        check(game.current()==drawer&&game.source()==source,"turn shown = rules turn");
    }
    @Override public void render(){
        super.render();
        if(pending!=null){Pixmap p=Pixmap.createFromFrameBuffer(0,0,Gdx.graphics.getBackBufferWidth(),Gdx.graphics.getBackBufferHeight());PixmapIO.writePNG(Gdx.files.absolute(out+"/"+pending+".png"),p,-1,true);p.dispose();pending=null;}
        else if(finishSoon){Map<String,Integer> agg=new LinkedHashMap<>();for(String l:log)agg.merge(l,1,Integer::sum);agg.forEach((k,v)->System.out.println(k+(v>1?"  ×"+v:"")));System.out.println(failed?"RESULT FAIL":"RESULT PASS");Gdx.app.exit();finishSoon=false;}
    }
    private void shot(String n){pending=n;}
    private void check(boolean ok,String what){log.add((ok?"PASS ":"FAIL ")+what);failed|=!ok;}
    public static void main(String[] a){var c=new Lwjgl3ApplicationConfiguration();c.setWindowedMode(1440,900);c.setBackBufferConfig(8,8,8,8,24,0,4);c.useVsync(true);new Lwjgl3Application(new CursedCardsPrototypeCheck(),c);}
}
