package com.erni.finalanswer.lwjgl3;

import com.badlogic.gdx.*;
import com.badlogic.gdx.backends.lwjgl3.*;
import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.g2d.*;
import com.badlogic.gdx.graphics.glutils.*;
import com.badlogic.gdx.math.*;
import com.badlogic.gdx.scenes.scene2d.*;
import com.badlogic.gdx.scenes.scene2d.ui.*;
import com.erni.finalanswer.FinalAnswerGame;
import com.erni.finalanswer.gameplay.impostor.*;
import com.erni.finalanswer.impostor.*;
import com.erni.finalanswer.ui.lobby.cages.CageLobby;
import java.util.*;

/** Real sprites, real GL and pixel assertions. Extended rosters exercise presentation, not server eligibility. */
public final class VotingRedesignCheck extends FinalAnswerGame {
    private static Throwable failure;
    private CageLobby characters;
    private ImpostorScreen scene;
    private boolean ran;
    private String directory;
    private Map<String,Object> report;
    private final java.util.List<Map<String,Object>> realtime=new ArrayList<>();
    private int performanceCount,warmFrames,sampleFrames;
    private long wallStart;
    private final double[] frameCpu=new double[180];
    @Override public CageLobby getRoomCharacters(){return characters;}
    public static void main(String[] args){
        var config=new Lwjgl3ApplicationConfiguration();config.setTitle("Voting presentation verification");config.setWindowedMode(1280,720);config.disableAudio(true);config.setHdpiMode(HdpiMode.Logical);
        config.setPreferencesConfig(System.getProperty("voting.qa.dir")+"/prefs",Files.FileType.Absolute);
        new Lwjgl3Application(new VotingRedesignCheck(),config);if(failure!=null)throw new AssertionError("Voting presentation verification failed",failure);
    }
    @Override public void create(){super.create();previewLanguage("ru");directory=System.getProperty("voting.qa.dir");characters=new CageLobby();scene=new ImpostorScreen(this);scene.setParticipants(ImpostorPreviewData.participants(4));setScreen(scene);}
    private static void check(boolean value,String message){if(!value)throw new AssertionError(message);}
    private Stage stage(){try{var field=ImpostorScreen.class.getDeclaredField("stage");field.setAccessible(true);return (Stage)field.get(scene);}catch(ReflectiveOperationException error){throw new RuntimeException(error);}}
    @Override public void render(){
        if(ran){realtimeFrame();return;}ran=true;
        try{
            var view=(FinalVotePresentation)stage().getRoot().findActor("finalAct");
            scene.setParticipants(ImpostorPreviewData.participants(8));scene.presentPhase(ImpostorPhase.IMPOSTOR_REVEAL,104000,100000);
            scene.presentFinal(new FinalActSnapshot("warm",ImpostorPhase.IMPOSTOR_REVEAL,100000,104000,90000,0,8,"warm",java.util.List.of(),Map.of(),java.util.List.of(),"preview-0","NO_CONSENSUS"),105000);scene.render(0);
            int baseline=Texture.getNumManagedTextures();
            for(int count=2;count<=8;count++){
                var roster=ImpostorPreviewData.participants(count);scene.setParticipants(roster);var ids=roster.stream().map(p->p.player().id()).toList();
                for(String outcome:java.util.List.of("caught","innocent","tie","abstain","distributed")){
                    var targets=new ArrayList<String>();
                    if(outcome.equals("caught")||outcome.equals("innocent")){for(int i=0;i<count-1;i++)targets.add(ids.get(1));}
                    else if(outcome.equals("tie")){targets.add(ids.get(0));targets.add(ids.get(1));}
                    else if(outcome.equals("distributed"))targets.addAll(ids);
                    var counts=new LinkedHashMap<String,Integer>();for(String id:ids)counts.put(id,Collections.frequency(targets,id));
                    int maximum=counts.values().stream().mapToInt(Integer::intValue).max().orElse(0);var leaders=maximum==0?java.util.List.<String>of():ids.stream().filter(id->counts.get(id)==maximum).toList();
                    String result=outcome.equals("caught")?"IMPOSTOR_CAUGHT":outcome.equals("innocent")?"IMPOSTOR_ESCAPED":"NO_CONSENSUS",impostor=outcome.equals("caught")?ids.get(1):ids.get(0);
                    scene.presentPhase(ImpostorPhase.IMPOSTOR_REVEAL,104000,100000);
                    scene.presentFinal(new FinalActSnapshot("visual-"+count,ImpostorPhase.IMPOSTOR_REVEAL,100000,104000,90000,targets.size(),count,"visual-"+count+outcome,targets,counts,leaders,impostor,result),105000);scene.render(0);
                    check(view.stampCount()==targets.size()&&view.visibleStampCount()==targets.size(),"One visible stamp per actual vote: "+count+outcome);
                    for(var player:roster){Group card=view.findActor("finalCard:"+player.player().id());check(card.getColor().a==1,"Opaque card group in "+outcome);Image paper=card.findActor("finalParchment");check(paper.getColor().a==1,"Opaque paper actor");check(!((Group)stage().getRoot().findActor("participant:"+player.player().id())).findActor("paper").isVisible(),"No stray clue parchment in upper row");}
                    if(result.equals("NO_CONSENSUS")){String supporting=((Label)view.findActor("finalTitle")).getText().toString();for(var player:roster)check(!supporting.contains(player.player().name()),"Tie must not single out a player");}
                    geometry(view,roster);
                    for(int[] size:new int[][]{{1920,1080},{1600,900},{1366,768},{1280,720}}){boolean save=count==4||size[0]==1280&&outcome.equals("caught");capture(size[0],size[1],count+"players-"+outcome,save);}
                }
                check(Texture.getNumManagedTextures()==baseline,"Rosters and outcomes cannot accumulate textures");Gdx.app.log("Voting QA","PASS 2–8 layout case: "+count+" players");
            }
            // Same verdict survives phase boundaries; appearance changes only with its meaning.
            scene.setParticipants(ImpostorPreviewData.participants(4));
            var stableTargets=java.util.List.of("preview-1","preview-1");var stableCounts=Map.of("preview-1",2);
            view.accept(new FinalActSnapshot("continuity",ImpostorPhase.SUSPECT_ANNOUNCEMENT,100000,101000,90000,2,4,"stable",stableTargets,stableCounts,java.util.List.of("preview-1"),"",""));view.update(100600);
            Actor headline=view.findActor("finalTitle").getParent();check(headline.getColor().a==1,"Settled announcement is fully visible");
            Image otherShade=((Group)view.findActor("finalCard:preview-0")).findActor("verdictCardShade");
            check(Math.abs(otherShade.getColor().a-.17f)<.001f,"Verdict shade restores immediately from server time");
            view.accept(new FinalActSnapshot("continuity",ImpostorPhase.IMPOSTOR_REVEAL,101000,105000,90000,2,4,"stable",stableTargets,stableCounts,java.util.List.of("preview-1"),"preview-1","IMPOSTOR_CAUGHT"));view.update(101001);
            check(headline.getColor().a==1,"Unchanged verdict never flashes at identity phase start");
            view.update(104950);check(headline.getColor().a==1,"Identity title finishes its own entrance");
            view.accept(new FinalActSnapshot("continuity",ImpostorPhase.RESULT,105000,0,90000,2,4,"stable",stableTargets,stableCounts,java.util.List.of("preview-1"),"preview-1","IMPOSTOR_CAUGHT"));view.update(105001);
            check(headline.getColor().a==1,"Result retains the revealed title without restarting animation");
            view.accept(new FinalActSnapshot("new-session",ImpostorPhase.FINAL_VOTE_REVEAL,110000,115000,110000,1,4,"stable",java.util.List.of("preview-0"),Map.of("preview-0",1),java.util.List.of(),"",""));view.update(110001);
            check(view.stampCount()==1&&view.visibleStampCount()==0,"Reused sequence ID in a new session cannot retain old ink");
            check(otherShade.getColor().a==0,"New ceremony clears the previous verdict shade");
            var longRoster=new ArrayList<ImpostorParticipant>(ImpostorPreviewData.participants(4));var old=longRoster.get(0).player();String longName="ЖёлтыйОченьДлинныйНик";
            longRoster.set(0,new ImpostorParticipant(new com.erni.finalanswer.rooms.RoomSession.Player(old.id(),longName,false,old.characterId(),"ONLINE",false,0),java.util.List.of("","","")));
            scene.setParticipants(longRoster);scene.presentPhase(ImpostorPhase.IMPOSTOR_REVEAL,104000,100000);scene.presentFinal(new FinalActSnapshot("long",ImpostorPhase.IMPOSTOR_REVEAL,100000,104000,90000,1,4,"long",java.util.List.of("preview-1"),Map.of("preview-1",1),java.util.List.of("preview-1"),"preview-1","IMPOSTOR_CAUGHT"),105000);scene.render(0);
            Label upper=((Group)stage().getRoot().findActor("participant:preview-0")).findActor("nickname");upper.validate();check(upper.getPrefHeight()<=upper.getHeight()+1,"Long Cyrillic name fits its upper presentation box");
            capture(1366,768,"long-cyrillic",true);
            opacityAndState(view);
            characterColorIsolation(view);
            scene.setParticipants(ImpostorPreviewData.participants(4));var roster=scene.participants();var ids=roster.stream().map(p->p.player().id()).toList();
            scene.presentPhase(ImpostorPhase.FINAL_VOTE_REVEAL,14100,10000);
            long reveal=10000;scene.presentFinal(new FinalActSnapshot("sequence",ImpostorPhase.FINAL_VOTE_REVEAL,reveal,reveal+FinalRevealTiming.duration(4),reveal,4,4,"sequence",java.util.List.of(ids.get(0),ids.get(1),ids.get(1),ids.get(1)),Map.of(ids.get(0),1,ids.get(1),3),java.util.List.of(),"",""),10000);
            final int[] sounds={0};view.onImpact(()->sounds[0]++);view.update(reveal);
            for(int i=0;i<4;i++){long at=reveal+FinalRevealTiming.LEAD+i*FinalRevealTiming.INTERVAL+FinalRevealTiming.IMPACT;view.update(at-1);check(view.visibleStampCount()==i,"No early imprint");view.update(at);view.update(at);check(view.visibleStampCount()==i+1,"One imprint at each contact");}
            check(sounds[0]==4,"Exactly four synchronized impact callbacks");
            check(!view.findActor("finalTitle").isVisible() || !view.findActor("finalTitle").getParent().isVisible(),"No headline during counting");
            check(view.findActor("finalDetail")==null&&view.findActor("finalKicker")==null&&view.findActor("finalProgress")==null,"Only one central announcement");
            var snapshot=new FinalActSnapshot("sequence",ImpostorPhase.FINAL_VOTE_REVEAL,reveal,reveal+FinalRevealTiming.duration(4),reveal,4,4,"sequence",java.util.List.of(ids.get(0),ids.get(1),ids.get(1),ids.get(1)),Map.of(ids.get(0),1,ids.get(1),3),java.util.List.of(),"","");view.accept(snapshot);view.update(reveal+5000);check(sounds[0]==4,"Resync does not replay impacts");
            sounds[0]=0;view.accept(new FinalActSnapshot("pause",ImpostorPhase.FINAL_VOTE_REVEAL,reveal,reveal+FinalRevealTiming.duration(4),reveal,4,4,"pause",java.util.List.of(ids.get(0),ids.get(1),ids.get(1),ids.get(1)),Map.of(ids.get(0),1,ids.get(1),3),java.util.List.of(),"",""));
            view.update(reveal);view.update(reveal+FinalRevealTiming.LEAD+FinalRevealTiming.IMPACT);view.paused(true);view.update(reveal+5000);view.paused(false);view.update(reveal+5000);
            check(sounds[0]==1&&view.visibleStampCount()==4,"Resume restores missing ink without replaying stale impact sounds");
            view.onImpact(()->{});
            var animation=new FinalActSnapshot("animation",ImpostorPhase.FINAL_VOTE_REVEAL,reveal,reveal+FinalRevealTiming.duration(4),reveal,4,4,"animation",java.util.List.of(ids.get(0),ids.get(1),ids.get(1),ids.get(1)),Map.of(ids.get(0),1,ids.get(1),3),java.util.List.of(),"","");
            scene.presentFinal(animation,reveal+1050);capture(1280,720,"animation-placement",true);
            scene.presentFinal(animation,reveal+FinalRevealTiming.LEAD+FinalRevealTiming.IMPACT+95);capture(1280,720,"animation-stamp",true);
            for(int i=0;i<90;i++)scene.render(1/60f);
            double[] samples=new double[360];for(int i=0;i<samples.length;i++){long start=System.nanoTime();scene.render(1/60f);samples[i]=(System.nanoTime()-start)/1_000_000.0;}Arrays.sort(samples);
            report=new LinkedHashMap<>(Map.of("passed",true,"counts",java.util.List.of(2,3,4,5,6,7,8),"scenarios",5,"resolutions",4,"opacityPixelRegression",true,"batchStateRestored",true,"texturesBefore",baseline,"texturesAfter",Texture.getNumManagedTextures(),"cpuP95MsWithoutSwap",samples[342],"retinaScale",Gdx.graphics.getBackBufferWidth()/(float)Gdx.graphics.getWidth()));
            beginPerformance(4);
        }catch(Throwable error){failure=error;Gdx.app.error("Voting QA","FAILED",error);Gdx.app.exit();}
    }
    private void beginPerformance(int count){
        performanceCount=count;warmFrames=sampleFrames=0;scene.setParticipants(ImpostorPreviewData.participants(count));
        var ids=scene.participants().stream().map(p->p.player().id()).toList();var targets=new ArrayList<String>();for(int i=0;i<count-1;i++)targets.add(ids.get(1));
        scene.presentPhase(ImpostorPhase.IMPOSTOR_REVEAL,104000,100000);scene.presentFinal(new FinalActSnapshot("realtime",ImpostorPhase.IMPOSTOR_REVEAL,100000,104000,90000,targets.size(),count,"realtime-"+count,targets,Map.of(ids.get(1),targets.size()),java.util.List.of(ids.get(1)),ids.get(1),"IMPOSTOR_CAUGHT"),105000);
    }
    private void realtimeFrame(){
        if(failure!=null)return;
        try{
            long start=System.nanoTime();scene.render(Gdx.graphics.getDeltaTime());double cpu=(System.nanoTime()-start)/1_000_000.0;
            if(warmFrames++<30){wallStart=System.nanoTime();return;}
            frameCpu[sampleFrames++]=cpu;
            if(sampleFrames==frameCpu.length){
                double fps=sampleFrames*1_000_000_000.0/(System.nanoTime()-wallStart);Arrays.sort(frameCpu);
                realtime.add(Map.of("players",performanceCount,"measuredWindowFps",fps,"cpuP95Ms",frameCpu[171],"frames",sampleFrames));
                if(performanceCount==4){beginPerformance(8);return;}
                report.put("realtime",realtime);report.put("characterBatchColorIsolation",true);
                Gdx.files.absolute(directory+"/report.json").writeString(new com.google.gson.GsonBuilder().setPrettyPrinting().create().toJson(report),false);Gdx.app.log("Voting QA",report.toString());Gdx.app.exit();
            }
        }catch(Throwable error){failure=error;Gdx.app.error("Voting QA","Realtime verification failed",error);Gdx.app.exit();}
    }
    private void geometry(FinalVotePresentation view,java.util.List<ImpostorParticipant> roster){
        var boxes=new ArrayList<Rectangle>();
        for(var player:roster){Group card=view.findActor("finalCard:"+player.player().id());Rectangle aabb=new Rectangle();boolean first=true;
            for(Vector2 point:new Vector2[]{new Vector2(0,0),new Vector2(card.getWidth(),0),new Vector2(0,card.getHeight()),new Vector2(card.getWidth(),card.getHeight())}){card.localToParentCoordinates(point);if(first){aabb.set(point.x,point.y,0,0);first=false;}else aabb.merge(point);}
            for(Rectangle previous:boxes)check(!previous.overlaps(aabb),"Cards never overlap");boxes.add(aabb);check(aabb.x>=190&&aabb.x+aabb.width<=1730&&aabb.y>=(roster.size()>=7?40:70)&&aabb.y+aabb.height<(roster.size()>=7?582:510),"Safe table bounds");
            Group portrait=card.findActor("finalAvatar");for(Actor actor:card.getChildren())if(actor.getName()!=null&&actor.getName().startsWith("voteStamp:")){
                for(Vector2 point:new Vector2[]{new Vector2(0,0),new Vector2(actor.getWidth(),0),new Vector2(0,actor.getHeight()),new Vector2(actor.getWidth(),actor.getHeight())}){actor.localToParentCoordinates(point);check(point.x>card.getWidth()*.08f&&point.x<card.getWidth()*.92f&&point.y>card.getHeight()*.07f&&point.y<portrait.getY(),"Imprint stays inside paper and below portrait");}
            }
        }
        check(!stage().getRoot().findActor("impostorPresentationSettings").isVisible(),"Settings panel is closed during ceremony");
        check(!stage().getRoot().findActor("impostorTimerValue").isVisible(),"No stale countdown overlay");
    }
    private void capture(int width,int height,String name,boolean save){
        FrameBuffer buffer=new FrameBuffer(Pixmap.Format.RGBA8888,width,height,false);HdpiUtils.setMode(HdpiMode.Pixels);
        try{buffer.begin();scene.resize(width,height);scene.render(0);if(save){Pixmap pixels=Pixmap.createFromFrameBuffer(0,0,width,height);try{var file=Gdx.files.absolute(directory+"/"+name+"-"+width+".png");file.parent().mkdirs();PixmapIO.writePNG(file,pixels,-1,true);}finally{pixels.dispose();}}}
        finally{buffer.end();buffer.dispose();HdpiUtils.setMode(HdpiMode.Logical);scene.resize(Gdx.graphics.getWidth(),Gdx.graphics.getHeight());}
    }
    private void opacityAndState(FinalVotePresentation view){
        Group card=view.findActor("finalCard:preview-0");Image sheet=card.findActor("finalParchment");FrameBuffer buffer=new FrameBuffer(Pixmap.Format.RGBA8888,256,300,false);SpriteBatch batch=new SpriteBatch();ShaderProgram prior=SpriteBatch.createDefaultShader();int[][] pixels=new int[2][2];
        try{for(int pass=0;pass<2;pass++){buffer.begin();Gdx.gl.glViewport(0,0,256,300);com.badlogic.gdx.utils.ScreenUtils.clear(pass==0?1:0,pass==0?0:1,1,1);batch.setProjectionMatrix(new Matrix4().setToOrtho2D(0,0,card.getWidth(),card.getHeight()));batch.setShader(prior);batch.disableBlending();batch.setColor(.37f,.61f,.91f,1);batch.begin();float color=batch.getPackedColor();int src=batch.getBlendSrcFunc(),dst=batch.getBlendDstFunc();boolean depth=Gdx.gl.glIsEnabled(GL20.GL_DEPTH_TEST);sheet.draw(batch,1);check(batch.getShader()==prior&&!batch.isBlendingEnabled()&&batch.getBlendSrcFunc()==src&&batch.getBlendDstFunc()==dst&&Float.floatToIntBits(batch.getPackedColor())==Float.floatToIntBits(color),"Paper restores batch shader, blend and color");check(depth==Gdx.gl.glIsEnabled(GL20.GL_DEPTH_TEST),"Paper does not change depth state");batch.end();Pixmap image=Pixmap.createFromFrameBuffer(0,0,256,300);try{pixels[pass][0]=image.getPixel(128,150);pixels[pass][1]=image.getPixel(0,0);}finally{image.dispose();}buffer.end();}
            check(pixels[0][0]==pixels[1][0],"Opaque parchment interior cannot reveal different backgrounds");check(pixels[0][1]!=pixels[1][1],"Intentional transparent torn corners remain transparent");
        }finally{batch.dispose();prior.dispose();buffer.dispose();scene.resize(Gdx.graphics.getWidth(),Gdx.graphics.getHeight());}
    }
    private void characterColorIsolation(FinalVotePresentation view){
        Group portrait=((Group)view.findActor("finalCard:preview-0")).findActor("finalAvatar");Actor actor=portrait.getChildren().first();
        FrameBuffer buffer=new FrameBuffer(Pixmap.Format.RGBA8888,180,180,false);SpriteBatch batch=new SpriteBatch();long[] hashes=new long[2];int visible=0;
        try{for(int pass=0;pass<2;pass++){
            buffer.begin();Gdx.gl.glViewport(0,0,180,180);com.badlogic.gdx.utils.ScreenUtils.clear(0,0,0,0);batch.setProjectionMatrix(new Matrix4().setToOrtho2D(0,0,actor.getWidth(),actor.getHeight()));batch.begin();batch.setColor(pass==0?Color.BLACK:Color.WHITE);float saved=batch.getPackedColor();actor.draw(batch,1);check(Float.floatToIntBits(saved)==Float.floatToIntBits(batch.getPackedColor()),"Character restores incoming batch color");batch.end();
            Pixmap image=Pixmap.createFromFrameBuffer(0,0,180,180);try{java.util.zip.CRC32 crc=new java.util.zip.CRC32();for(int y=0;y<180;y++)for(int x=0;x<180;x++){int pixel=image.getPixel(x,y);crc.update(pixel>>>24);crc.update(pixel>>>16);crc.update(pixel>>>8);crc.update(pixel);if(pass==0&&(pixel&255)>20)visible++;}hashes[pass]=crc.getValue();}finally{image.dispose();}buffer.end();
        }
        check(visible>100,"A real character was drawn");check(hashes[0]==hashes[1],"Character rendering is independent of preceding black UI tint");
        }finally{batch.dispose();buffer.dispose();scene.resize(Gdx.graphics.getWidth(),Gdx.graphics.getHeight());}
    }
    @Override public void dispose(){if(scene!=null){showMainMenu();scene.dispose();}super.dispose();if(characters!=null)characters.dispose();}
}
