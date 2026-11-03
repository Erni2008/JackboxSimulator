package com.erni.finalanswer.lwjgl3;

import com.badlogic.gdx.*;
import com.badlogic.gdx.backends.lwjgl3.*;
import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.math.MathUtils;
import com.erni.finalanswer.cursedcards.*;
import com.erni.finalanswer.gameplay.cursedcards.*;
import java.util.*;

/**
 * Plays complete local matches (4, 5 and 6 players) through the 3D table and checks, at every turn, that the visual
 * hands mirror the authoritative rules, stay face down, and that the end state shows DEATH with the loser.
 * Screenshots go to -Dout=dir.
 */
public final class CursedCardsPrototypeCheck extends CursedCardsPrototype {
    private final String out=System.getProperty("out","/tmp");private final int[] counts={4,5,6};
    private int match,turns,textures=-1;private float t;private boolean started,manualDone,midShot,dealShot;private String pending;private final List<String> log=new ArrayList<>();private boolean failed;
    private int resultsFired;private float matchSeconds;private boolean timerArmed;private final List<String> phases=new ArrayList<>();private boolean disposalRun;private final java.util.Set<String> cineShots=new java.util.HashSet<>();
    @Override public void create(){super.create();timeScale=3;resultListener=(l,alive)->{resultsFired++;check(game!=null&&l==game.loser()&&alive.length==players-1,"results hand-off matches the rules' loser");};Gdx.graphics.setContinuousRendering(true);layoutChecks();
        for(int n:new int[]{3,7,8}){boolean refused;try{SeatLayout.layout(tableConfig,n);refused=false;}catch(IllegalArgumentException e){refused=true;}check(refused,n+" players refused by the table");}}
    /** Static scene geometry for every player count: chairs/characters/hands placed without intersections. */
    private void layoutChecks(){
        var t=tableConfig.table;float chairWidth=.54f*tableConfig.chair.scale;var mb=machine.worldBounds();
        for(int n=CursedDeck.MIN_PLAYERS;n<=CursedDeck.MAX_PLAYERS;n++){var seats=SeatLayout.layout(tableConfig,n);boolean ok=seats.size==n,outside=true,apart=true,inside=true,clearMachine=true;
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
    /** Characters: one per seat with real art, stable identities, no two sprites overlapping by more than a sliver. */
    private void castCheck(){
        boolean art=true,apart=true;var a=new com.badlogic.gdx.math.Rectangle();var b=new com.badlogic.gdx.math.Rectangle();
        for(int i=0;i<players;i++){art&=cast.hasArt(i);cast.bounds(i,a);
            for(int j=i+1;j<players;j++){cast.bounds(j,b);float ox=Math.max(0,Math.min(a.x+a.width,b.x+b.width)-Math.max(a.x,b.x)),oy=Math.max(0,Math.min(a.y+a.height,b.y+b.height)-Math.max(a.y,b.y));
                apart&=ox*oy<.25f*Math.min(a.area(),b.area());}}
        check(art&&apart,players+" players: characters seated with art="+art+" overlapLimited="+apart);
    }
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
        super.update(dt);t+=dt;if(started)matchSeconds+=dt;
        if(resetNext&&t>-.8f){resetNext=false;resetMatch();}
        if(match>=counts.length)return;
        if(!started){if(!seated&&t>.5f){if(textures<0)textures=Texture.getNumManagedTextures();setPlayers(counts[match]);seated=true;t=0;if(match==0)resizeCheck();}
            else if(seated&&t>2.75f&&t<2.8f&&match==counts.length-1)backdrop.strike();
            else if(seated&&t>2.86f&&!flashShot&&match==counts.length-1){flashShot=true;shot("m"+counts[match]+"-0-lightning");}
            else if(seated&&t>3.6f&&!mainShot){mainShot=true;shot("m"+counts[match]+"-0-main");castCheck();}
            else if(mainShot&&t>3.9f){startMatch();started=true;seated=mainShot=false;t=0;}return;}
        if(!dealShot&&t>3.5f*1){dealShot=true;shot("m"+players+"-1-dealing");}
        if(cine.active()){String ph=cine.phase().name();if(phases.isEmpty()||!phases.get(phases.size()-1).equals(ph))phases.add(ph);
            if(match==2&&!disposalRun&&cine.phase()==com.erni.finalanswer.cursedcards.DeathCinematic.Phase.LAST_CARD&&!cine.skipped())skipCinematic();
            if(match==0||match==4){var P=com.erni.finalanswer.cursedcards.DeathCinematic.Phase.class;String key=cine.phase()+(cine.progress()>.55f?"b":"a");
                if(!disposalRun&&cine.progress()>.55f&&!cineShots.contains(key)){cineShots.add(key);shot("m"+players+"-4-"+cine.phase().name().toLowerCase());}}
            if(disposalRun&&cine.phase()==com.erni.finalanswer.cursedcards.DeathCinematic.Phase.LAST_CARD&&!finishSoon){log.add("PASS exit requested during the DEATH cinematic (dispose mid-animation)");finishSoon=true;}}
        if(awaitingDraw()){
            turns++;mirror();
            if(!manualDone){manualDone=true;int before=hands.get(source).size;select(before-1);check(selectedSlot==before-1,"card selection");check(drawSelected(),"manual draw of the selected hidden card");return;}
            if(!midShot&&turns==3){midShot=true;select(0);shot("m"+players+"-2-turn");return;}
            debug=false;if(match==1){if(!timerArmed){timerArmed=true;tableConfig.turn.seconds=1.2f;}}else drawRandom();check(turns<2000,"terminates");
        }
        if(game!=null&&game.phase()==CursedCardsGame.Phase.FINISHED&&!presenting()&&finishedAt<0)finishedAt=t;
        if(finishedAt>=0&&t-finishedAt>1.8f){finishedAt=-1;
            check(loser==game.loser(),"loser shown = rules loser");
            boolean skippedRun=match==2;
            check(resultsFired==1,"results fired exactly once"+(skippedRun?" (skipped)":""));
            if(skippedRun)check(cine.skipped()&&phases.contains("RESULTS")&&!phases.contains("ELIMINATION"),"skip jumps to results: "+phases);
            else check(phases.equals(List.of("SILENCE","LAST_CARD","REVEAL","ELIMINATION","RESULTS")),"cinematic phase order "+phases);
            if(match==1){check(turnTimeouts>0,"turn timer takes a card when the drawer does not act ("+turnTimeouts+" timeouts)");tableConfig.turn.seconds=10;timerArmed=false;}
            log.add(String.format(java.util.Locale.ROOT,"match %d players: %.0f s of presentation with instant decisions, %d turns",players,matchSeconds,turns));matchSeconds=0;turnTimeouts=0;
            resultsFired=0;phases.clear();cineShots.clear();
            check(hands.get(loser).size==1&&hands.get(loser).first().value==CardValue.DEATH&&!hands.get(loser).first().pose.faceDown(),"DEATH revealed in loser's place");
            int others=0;for(int p=0;p<players;p++)if(p!=loser)others+=hands.get(p).size;check(others==0,"survivors hold no cards");
            check(discardPile.size==game.deck().size()-1,"all pairs on the discard pile ("+discardPile.size+")");
            boolean gone=true;for(Card3D c:discardPile)gone&=!c.visible;check(gone,"discarded pairs vanished after their animation");
            shot("m"+players+"-3-result");log.add("match "+players+" players: "+turns+" turns, loser P"+(loser+1));
            match++;started=manualDone=midShot=dealShot=false;turns=0;t=-1;resetNext=true;
            if(match==counts.length){check(Texture.getNumManagedTextures()==textures,"no texture growth across matches ("+textures+" -> "+Texture.getNumManagedTextures()+")");disposalRun=true;match=counts.length-1;}
        }
    }
    private boolean finishSoon,resetNext,seated,mainShot;private float finishedAt=-1;private boolean flashShot;
    /** Visual hands equal rules hands slot-for-slot, all face down, nothing visible that is not in a hand or the pile. */
    private void mirror(){
        boolean same=true,down=true;
        for(int p=0;p<players;p++){var rules=game.hand(p);var vis=hands.get(p);if(rules.size()!=vis.size){same=false;continue;}
            for(int k=0;k<vis.size;k++){same&=vis.get(k).id==rules.get(k).id();down&=vis.get(k).pose.faceDown()&&Math.abs(vis.get(k).pose.scale-1)<1e-3f;}}
        check(dealerDismissed(),"dealer leaves the table when play begins");
        int visible=0;for(Card3D c:cards)if(c.visible)visible++;
        int held=0;for(int p=0;p<players;p++)held+=game.handSize(p);
        if(!same||!down||visible!=held)check(false,"turn "+turns+": mirror="+same+" faceDown="+down+" visible="+visible);
        check(game.current()==drawer&&game.source()==source,"turn shown = rules turn");
    }
    @Override public void render(){
        super.render();
        if(pending!=null){Pixmap p=Pixmap.createFromFrameBuffer(0,0,Gdx.graphics.getBackBufferWidth(),Gdx.graphics.getBackBufferHeight());{var file=Gdx.files.absolute(out+"/"+pending+".png");var px=p;SHOTS.execute(()->{PixmapIO.writePNG(file,px,-1,true);px.dispose();});}pending=null;}
        else if(finishSoon){Map<String,Integer> agg=new LinkedHashMap<>();for(String l:log)agg.merge(l,1,Integer::sum);agg.forEach((k,v)->System.out.println(k+(v>1?"  ×"+v:"")));System.out.println(failed?"RESULT FAIL":"RESULT PASS");Gdx.app.exit();finishSoon=false;}
    }
    private void shot(String n){pending=n;}
    private void check(boolean ok,String what){log.add((ok?"PASS ":"FAIL ")+what);failed|=!ok;}
    /** PNG encoding off the render thread, so screenshots never freeze the picture. */
    private static final java.util.concurrent.ExecutorService SHOTS=java.util.concurrent.Executors.newSingleThreadExecutor(r->{var t=new Thread(r,"shots");t.setDaemon(true);return t;});
    static{Runtime.getRuntime().addShutdownHook(new Thread(()->{SHOTS.shutdown();try{SHOTS.awaitTermination(20,java.util.concurrent.TimeUnit.SECONDS);}catch(InterruptedException e){}}));}
    public static void main(String[] a){var c=new Lwjgl3ApplicationConfiguration();c.setWindowedMode(1600,900);c.setBackBufferConfig(8,8,8,8,24,0,4);c.useVsync(true);new Lwjgl3Application(new CursedCardsPrototypeCheck(),c);}
}
