package com.erni.finalanswer.lwjgl3;

import com.badlogic.gdx.*;
import com.badlogic.gdx.backends.lwjgl3.*;
import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.math.MathUtils;
import com.erni.finalanswer.cursedcards.*;
import com.erni.finalanswer.gameplay.cursedcards.*;
import java.util.*;

/**
 * Plays complete local matches (2, 5 and 8 players) through the 3D table and checks, at every turn, that the visual
 * hands mirror the authoritative rules, stay face down, and that the end state shows DEATH with the loser.
 * Screenshots go to -Dout=dir.
 */
public final class CursedCardsPrototypeCheck extends CursedCardsPrototype {
    private final String out=System.getProperty("out","/tmp");private final int[] counts={2,3,4,6,8};
    private int match,turns,textures=-1;private float t;private boolean started,manualDone,midShot,dealShot;private String pending;private final List<String> log=new ArrayList<>();private boolean failed;
    @Override public void create(){super.create();timeScale=3;Gdx.graphics.setContinuousRendering(true);layoutChecks();}
    /** Static scene geometry for every player count: chairs/characters/hands placed without intersections. */
    private void layoutChecks(){
        var t=tableConfig.table;float chairWidth=.54f*tableConfig.chair.scale;var mb=machine.worldBounds();
        for(int n=2;n<=8;n++){var seats=SeatLayout.layout(tableConfig,n);boolean ok=seats.size==n,outside=true,apart=true,inside=true,clearMachine=true;
            for(int i=0;i<seats.size;i++){var st=seats.get(i);
                float seatDepth=tableConfig.chair.halfDepth*tableConfig.chair.scale;
                // chair front edge stays outside the rim
                com.badlogic.gdx.math.Vector3 front=new com.badlogic.gdx.math.Vector3(st.chair).mulAdd(st.normal,-(seatDepth+tableConfig.chair.seatCenterZ*tableConfig.chair.scale));
                outside&=t.ellipse()?(front.x*front.x)/(t.rimA()*t.rimA())+(front.z*front.z)/(t.rimB()*t.rimB())>=.99f:(Math.abs(front.z)>t.rimB()-.01f&&st.side!=SeatLayout.Side.LEFT&&st.side!=SeatLayout.Side.RIGHT||Math.abs(front.x)>t.rimA()-.01f);
                for(int j=i+1;j<seats.size;j++)apart&=seats.get(j).chair.dst(st.chair)>=chairWidth;
                float tx=MathUtils.cosDeg(st.handYaw),tz=-MathUtils.sinDeg(st.handYaw);
                for(float u:new float[]{-.5f,.5f}){float x=st.hand.x+tx*u*st.handWidth,z=st.hand.z+tz*u*st.handWidth;
                    inside&=t.onFelt(x,z,.3f);
                    clearMachine&=!(x>mb.min.x-.5f&&x<mb.max.x+.5f&&z>mb.min.z-.5f&&z<mb.max.z+.5f);}}
            check(ok&&outside&&apart&&inside&&clearMachine,n+" players: seats="+seats.size+" chairsOutsideRim="+outside+" chairsApart="+apart+" handsOnFelt="+inside+" handsClearOfMachine="+clearMachine);}
        check(mb.min.y>=-.01f&&t.onFelt(mb.min.x,mb.min.z,0)&&t.onFelt(mb.max.x,mb.max.z,0)&&t.onFelt(mb.min.x,mb.max.z,0)&&t.onFelt(mb.max.x,mb.min.z,0),"machine stands on the felt inside the playing area");
    }
    /** Window resizing keeps every hand on the same spot of the painting (letterboxed 16:9). */
    private void resizeCheck(){
        float[] ref=null;boolean ok=true;
        for(int[] size:new int[][]{{1600,900},{1280,720},{1400,1000},{1600,900}}){resize(size[0],size[1]);camera.update();
            float[] now=new float[seatList.size*2];for(int i=0;i<seatList.size;i++){tmp.set(seatList.get(i).hand);camera.project(tmp,view.x,view.y,view.width,view.height);now[i*2]=(tmp.x-view.x)/view.width;now[i*2+1]=(tmp.y-view.y)/view.height;}
            if(ref==null)ref=now;else for(int i=0;i<now.length;i++)ok&=Math.abs(now[i]-ref[i])<1e-3f;
            ok&=Math.abs(view.width/view.height-tableConfig.camera.aspect)<1e-3f;}
        resize(Gdx.graphics.getWidth(),Gdx.graphics.getHeight());
        check(ok,"resizing keeps hands registered to the backdrop (16:9 letterbox)");
    }
    @Override protected void update(float dt){
        super.update(dt);t+=dt;
        if(resetNext&&t>-.8f){resetNext=false;resetMatch();}
        if(match>=counts.length)return;
        if(!started){if(!seated&&t>.5f){if(textures<0)textures=Texture.getNumManagedTextures();setPlayers(counts[match]);seated=true;t=0;if(match==0)resizeCheck();}
            else if(seated&&t>3f&&!mainShot){mainShot=true;shot("m"+counts[match]+"-0-main");}
            else if(mainShot&&t>3.3f){startMatch();started=true;seated=mainShot=false;t=0;}return;}
        if(!dealShot&&t>3.5f*1){dealShot=true;shot("m"+players+"-1-dealing");}
        if(awaitingDraw()){
            turns++;mirror();
            if(!manualDone){manualDone=true;int before=hands.get(source).size;select(before-1);check(selectedSlot==before-1,"card selection");check(drawSelected(),"manual draw of the selected hidden card");return;}
            if(!midShot&&turns==3){midShot=true;select(0);shot("m"+players+"-2-turn");return;}
            debug=false;drawRandom();check(turns<2000,"terminates");
        }
        if(game!=null&&game.phase()==CursedCardsGame.Phase.FINISHED&&!presenting()&&finishedAt<0)finishedAt=t;
        if(finishedAt>=0&&t-finishedAt>1.8f){finishedAt=-1;
            check(loser==game.loser(),"loser shown = rules loser");
            check(hands.get(loser).size==1&&hands.get(loser).first().value==CardValue.DEATH&&!hands.get(loser).first().pose.faceDown(),"DEATH revealed in loser's place");
            int others=0;for(int p=0;p<players;p++)if(p!=loser)others+=hands.get(p).size;check(others==0,"survivors hold no cards");
            check(discardPile.size==game.deck().size()-1,"all pairs on the discard pile ("+discardPile.size+")");
            boolean gone=true;for(Card3D c:discardPile)gone&=!c.visible;check(gone,"discarded pairs vanished after their animation");
            shot("m"+players+"-3-result");log.add("match "+players+" players: "+turns+" turns, loser P"+(loser+1));
            match++;started=manualDone=midShot=dealShot=false;turns=0;t=-1;resetNext=true;
            if(match==counts.length){check(Texture.getNumManagedTextures()==textures,"no texture growth across matches ("+textures+" -> "+Texture.getNumManagedTextures()+")");finishSoon=true;}
        }
    }
    private boolean finishSoon,resetNext,seated,mainShot;private float finishedAt=-1;
    /** Visual hands equal rules hands slot-for-slot, all face down, nothing visible that is not in a hand or the pile. */
    private void mirror(){
        boolean same=true,down=true;
        for(int p=0;p<players;p++){var rules=game.hand(p);var vis=hands.get(p);if(rules.size()!=vis.size){same=false;continue;}
            for(int k=0;k<vis.size;k++){same&=vis.get(k).id==rules.get(k).id();down&=vis.get(k).pose.faceDown()&&Math.abs(vis.get(k).pose.scale-1)<1e-3f;}}
        check(!machine.visible(),"dealer has evaporated during play");
        int visible=0;for(Card3D c:cards)if(c.visible)visible++;
        int held=0;for(int p=0;p<players;p++)held+=game.handSize(p);
        if(!same||!down||visible!=held)check(false,"turn "+turns+": mirror="+same+" faceDown="+down+" visible="+visible);
        check(game.current()==drawer&&game.source()==source,"turn shown = rules turn");
    }
    @Override public void render(){
        super.render();
        if(pending!=null){Pixmap p=Pixmap.createFromFrameBuffer(0,0,Gdx.graphics.getBackBufferWidth(),Gdx.graphics.getBackBufferHeight());PixmapIO.writePNG(Gdx.files.absolute(out+"/"+pending+".png"),p,-1,true);p.dispose();pending=null;}
        else if(finishSoon){Map<String,Integer> agg=new LinkedHashMap<>();for(String l:log)agg.merge(l,1,Integer::sum);agg.forEach((k,v)->System.out.println(k+(v>1?"  ×"+v:"")));System.out.println(failed?"RESULT FAIL":"RESULT PASS");Gdx.app.exit();finishSoon=false;}
    }
    private void shot(String n){pending=n;}
    private void check(boolean ok,String what){log.add((ok?"PASS ":"FAIL ")+what);failed|=!ok;}
    public static void main(String[] a){var c=new Lwjgl3ApplicationConfiguration();c.setWindowedMode(1600,900);c.setBackBufferConfig(8,8,8,8,24,0,4);c.useVsync(true);new Lwjgl3Application(new CursedCardsPrototypeCheck(),c);}
}
