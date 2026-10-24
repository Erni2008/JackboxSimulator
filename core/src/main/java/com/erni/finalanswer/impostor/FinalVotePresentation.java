package com.erni.finalanswer.impostor;

import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.g2d.BitmapFont;
import com.badlogic.gdx.scenes.scene2d.*;
import com.badlogic.gdx.scenes.scene2d.ui.Image;
import com.badlogic.gdx.scenes.scene2d.ui.Label;
import com.badlogic.gdx.utils.Align;
import com.erni.finalanswer.gameplay.impostor.*;
import com.erni.finalanswer.rooms.RoomSession;
import java.util.*;
import java.util.function.Function;

/** One public timeline, positioned on the existing table. All textures/fonts are borrowed. */
public final class FinalVotePresentation extends Group {
    private final ImpostorAssets assets;
    private final BitmapFont font;
    private BitmapFont revealFont;
    public void revealFont(BitmapFont value){revealFont=Objects.requireNonNull(value);}
    private final Function<RoomSession.Player,Actor> avatars;
    private final Label title,detail,progress;
    private final Group cards=new Group();
    private final Map<String,Group> cardsById=new LinkedHashMap<>();
    private final Map<String,String> names=new LinkedHashMap<>();
    private final List<Image> marks=new ArrayList<>();
    private final List<String> targets=new ArrayList<>();
    private final com.badlogic.gdx.graphics.g2d.GlyphLayout measurement=new com.badlogic.gdx.graphics.g2d.GlyphLayout();
    private final Image stamp;
    private boolean paused;
    public void paused(boolean value){paused=value;}
    private boolean eliminationCaption;
    private static final Color ELIMINATION_COLOR=Color.valueOf("D89A9F"),PROGRESS_COLOR=Color.valueOf("DBCDC1");
    private final Map<String,ImpostorElimination> eliminations=new LinkedHashMap<>();
    private FinalActSnapshot snapshot;
    private String sequence="";
    private int revealed;
    private Runnable impact=()->{};
    private long previousUpdate=-1;
    private boolean reducedMotion;
    public void onImpact(Runnable callback){impact=Objects.requireNonNull(callback);}
    public void reducedMotion(boolean value){reducedMotion=value;}
    public FinalVotePresentation(ImpostorAssets assets,BitmapFont font,Function<RoomSession.Player,Actor> avatars){
        this.assets=assets;this.font=font;this.avatars=avatars;
        setName("finalAct");setSize(1920,1080);setTouchable(Touchable.disabled);setVisible(false);
        title=label("finalTitle",Color.valueOf("E7D5B5"),1.55f,320,602,1180,82);
        detail=label("finalDetail",Color.valueOf("DDB17F"),1.15f,320,545,1180,54);
        progress=label("finalProgress",Color.valueOf("DBCDC1"),1,320,505,1180,40);
        cards.setName("finalCards");cards.setOrigin(960,250);addActor(cards);
        stamp=assets.texture(ImpostorAsset.STAMP).map(t->{Image image=new Image(t);image.setSize(140,140f*t.getHeight()/t.getWidth());return image;}).orElse(null);
        if(stamp!=null){stamp.setName("woodenVoteStamp");stamp.setOrigin(70,20);addActor(stamp);stamp.setVisible(false);}
    }
    private Label label(String name,Color color,float scale,float x,float y,float width,float height){
        Label result=new Label("",new Label.LabelStyle(font,color));result.setName(name);result.setAlignment(Align.center);
        result.setFontScale(scale);result.setBounds(x,y,width,height);result.setWrap(true);addActor(result);return result;
    }
    public void hidePresentation(){snapshot=null;sequence="";revealed=0;previousUpdate=-1;for(Image image:marks)if(image!=null)image.remove();marks.clear();targets.clear();setVisible(false);if(stamp!=null)stamp.setVisible(false);}
    public void clear(){snapshot=null;sequence="";revealed=0;previousUpdate=-1;marks.clear();targets.clear();cards.clearChildren();cardsById.clear();names.clear();eliminations.clear();setVisible(false);if(stamp!=null)stamp.setVisible(false);}
    public void setRoster(List<ImpostorParticipant> roster){
        clear();int count=roster.size();float width=250,height=assets.texture(ImpostorAsset.SUSPECT_PAPER).map(t->width*t.getHeight()/t.getWidth()).orElse(width*1353/1162);
        for(int i=0;i<count;i++){
            var player=roster.get(i).player();names.put(player.id(),player.name());
            Group card=new Group();card.setName("finalCard:"+player.id());card.setSize(width,height);card.setOrigin(width/2,height/2);
            float step=count==3?420:300;float x=960-(count-1)*step/2-width/2+i*step;
            float distance=Math.abs(i-(count-1)/2f);card.setPosition(x,100+distance*60);card.setRotation((i-(count-1)/2f)*-3);
            assets.texture(ImpostorAsset.SUSPECT_PAPER).ifPresent(t->{Image parchment=new Image(t);parchment.setName("finalParchment");parchment.setSize(width,height);card.addActor(parchment);});
            Actor avatar=avatars.apply(player);
            if(avatar!=null && avatar.getWidth()>0 && avatar.getHeight()>0){
                float scale=Math.min(88/avatar.getWidth(),50/avatar.getHeight());
                Group portrait=new Group();portrait.setName("finalAvatar");portrait.setBounds(125-avatar.getWidth()*scale/2,174,avatar.getWidth(),avatar.getHeight());portrait.setScale(scale);
                avatar.setPosition(0,0);portrait.addActor(avatar);card.addActor(portrait);eliminations.put(player.id(),new ImpostorElimination(portrait));
            }
            Label nickname=new Label(player.name(),new Label.LabelStyle(font,Color.valueOf("352116")));
            nickname.setName("finalNickname");nickname.setBounds(35,230,180,34);nickname.setAlignment(Align.center);nickname.setFontScale(.9f);nickname.setEllipsis("...");card.addActor(nickname);
            cards.addActor(card);cardsById.put(player.id(),card);
        }
    }
    public int visibleStampCount(){int count=0;for(Image image:marks)if(image!=null && image.isVisible())count++;return count;}
    public int stampCount(){return targets.size();}
    public void accept(FinalActSnapshot next){
        eliminationCaption=false;progress.setColor(PROGRESS_COLOR);
        boolean phaseChanged=snapshot==null || snapshot.phase()!=next.phase();
        snapshot=next;setVisible(true);
        if(!next.sequenceId().isEmpty() && !next.sequenceId().equals(sequence)){
            sequence=next.sequenceId();previousUpdate=-1;for(Image image:marks)if(image!=null)image.remove();marks.clear();targets.clear();revealed=0;
            Map<String,Integer> slots=new HashMap<>();
            for(int i=0;i<next.stampTargets().size();i++){
                String target=next.stampTargets().get(i);Group card=cardsById.get(target);if(card==null)throw new IllegalArgumentException("Unknown final suspect");
                int slot=slots.merge(target,1,Integer::sum)-1;
                Image image=assets.texture(ImpostorAsset.STAMP_MARK).map(Image::new).orElse(null);
                if(image!=null){float size=66+(i%3)*2;image.setName("voteStamp:"+i);image.setBounds(48+(slot%2)*91,40+(slot/2)*66,size,size*image.getPrefHeight()/image.getPrefWidth());
                    image.setOrigin(size/2,size/2);image.setRotation((i%3-1)*7);image.setColor(.58f,.16f,.18f,.90f+(i%2)*.07f);image.setVisible(false);card.addActor(image);}
                targets.add(target);marks.add(image);
            }
        }
        if(phaseChanged){
            title.setText(switch(next.phase()){
                case EVIDENCE_REVIEW -> "FINAL DISCUSSION";case FINAL_VOTING -> "FINAL VOTING";
                case VOTING_LOCKED -> "VOTING LOCKED";case FINAL_VOTE_REVEAL -> "THE INK WILL TELL";
                case SUSPECT_ANNOUNCEMENT -> next.leaders().size()==1?"THE MOST SUSPECTED PLAYER IS...":"NO CONSENSUS";
                case IMPOSTOR_REVEAL -> "THE IMPOSTOR IS...";case RESULT -> next.outcome().replace('_',' ');
                default -> "";
            });
            detail.setText(switch(next.phase()){
                case EVIDENCE_REVIEW -> "Every round. Every clue. One impostor.";
                case FINAL_VOTING -> "One final choice. Keep it private.";
                case VOTING_LOCKED -> "Every accepted vote is sealed.";
                case FINAL_VOTE_REVEAL -> "One vote. One mark.";
                case SUSPECT_ANNOUNCEMENT -> joinNames(next.leaders());
                case IMPOSTOR_REVEAL,RESULT -> names.getOrDefault(next.impostorId(),"");
                default -> "";
            });
            BitmapFont chosen=next.phase()==ImpostorPhase.IMPOSTOR_REVEAL&&revealFont!=null?revealFont:font;
            detail.setStyle(new Label.LabelStyle(chosen,Color.valueOf("DDB17F")));
            measurement.setText(chosen,detail.getText());detail.setFontScale(Math.min(1.15f,detail.getWidth()/Math.max(1,measurement.width)));
            for(var entry:cardsById.entrySet()){
                Image parchment=entry.getValue().findActor("finalParchment");
                if(parchment!=null){boolean highlight=next.phase()==ImpostorPhase.SUSPECT_ANNOUNCEMENT?next.leaders().contains(entry.getKey()):
                    (next.phase()==ImpostorPhase.IMPOSTOR_REVEAL || next.phase()==ImpostorPhase.RESULT)&&entry.getKey().equals(next.impostorId());
                    parchment.setColor(highlight?Color.valueOf("FFD5B0"):Color.WHITE);
                    Label nickname=entry.getValue().findActor("finalNickname");nickname.setColor(highlight?Color.valueOf("841F2C"):Color.valueOf("352116"));nickname.setFontScale(highlight?1:.9f);}
            }
        }
        progress.setText(next.phase()==ImpostorPhase.FINAL_VOTING || next.phase()==ImpostorPhase.VOTING_LOCKED?
            "VOTES SUBMITTED: "+next.submitted()+" / "+next.eligible():next.phase()==ImpostorPhase.RESULT?resultSummary(next.counts()):"");
        progress.setFontScale(next.phase()==ImpostorPhase.RESULT?.8f:1);
        cards.setVisible(next.phase()==ImpostorPhase.FINAL_VOTE_REVEAL || next.phase()==ImpostorPhase.SUSPECT_ANNOUNCEMENT || next.phase()==ImpostorPhase.IMPOSTOR_REVEAL || next.phase()==ImpostorPhase.RESULT);
    }
    private String joinNames(List<String> ids){var text=new StringBuilder();for(String id:ids){if(!text.isEmpty())text.append("  ·  ");text.append(abbreviate(names.getOrDefault(id,""),14));}return text.toString();}
    private String resultSummary(Map<String,Integer> counts){var text=new StringBuilder();for(var e:names.entrySet()){if(!text.isEmpty())text.append("   ·   ");text.append(abbreviate(e.getValue(),12)).append(": ").append(counts.getOrDefault(e.getKey(),0));}return text.toString();}
    private static String abbreviate(String value,int max){return value.codePointCount(0,value.length())<=max?value:value.substring(0,value.offsetByCodePoints(0,max-3))+"...";}
    /** Absolute server time makes reconnects and low frame rates resume, rather than replay, impacts. */
    public void update(long serverNow){
        if(snapshot==null||paused)return;
        float eliminatedAge=ImpostorElimination.age(snapshot,serverNow);
        for(var entry:eliminations.entrySet())entry.getValue().apply(entry.getKey().equals(snapshot.impostorId())?eliminatedAge:-1,reducedMotion,0);
        if(eliminatedAge>=.6f&&!eliminationCaption){eliminationCaption=true;progress.setText("EXPOSED / ELIMINATED");progress.setColor(ELIMINATION_COLOR);}
        float entry=Math.max(0,Math.min(1,(serverNow-snapshot.phaseStartedAt())/350f));entry=entry*entry*(3-2*entry);
        if(reducedMotion)entry=1;
        title.getColor().a=entry;detail.getColor().a=entry;
        boolean delayedName=snapshot.phase()==ImpostorPhase.SUSPECT_ANNOUNCEMENT || snapshot.phase()==ImpostorPhase.IMPOSTOR_REVEAL;
        if(snapshot.phase()==ImpostorPhase.IMPOSTOR_REVEAL){
            long age=serverNow-snapshot.phaseStartedAt()-FinalRevealTiming.IDENTITY_NAME_MILLIS;
            detail.setVisible(age>=0);
            detail.getColor().a=age<0?0:reducedMotion?1:Math.min(1,age/(float)FinalRevealTiming.IDENTITY_NAME_FADE_MILLIS);
            for(var entryCard:cardsById.entrySet()){
                boolean highlight=age>=0&&entryCard.getKey().equals(snapshot.impostorId());
                Image paper=entryCard.getValue().findActor("finalParchment");if(paper!=null)paper.setColor(highlight?Color.valueOf("FFD5B0"):Color.WHITE);
                Label nickname=entryCard.getValue().findActor("finalNickname");nickname.setColor(highlight?Color.valueOf("841F2C"):Color.valueOf("352116"));nickname.setFontScale(highlight?1:.9f);
            }
        }else{detail.setVisible(true);if(delayedName&&!reducedMotion)detail.getColor().a=Math.max(0,Math.min(1,(serverNow-snapshot.phaseStartedAt()-600)/350f));}
        if(!cards.isVisible()){if(stamp!=null)stamp.setVisible(false);return;}
        long elapsed=Math.max(0,serverNow-snapshot.revealStartedAt());
        float cardsEntry=Math.min(1,elapsed/650f);cardsEntry=cardsEntry*cardsEntry*(3-2*cardsEntry);
        cards.setColor(1,1,1,cardsEntry);cards.setScale(reducedMotion?1:.97f+.03f*cardsEntry);
        detail.setOrigin(detail.getWidth()/2,detail.getHeight()/2);
        detail.setScale(!reducedMotion && snapshot.phase()==ImpostorPhase.IMPOSTOR_REVEAL?.94f+.06f*entry:1);
        int count=0;
        for(Group card:cardsById.values())card.setScale(1);
        for(int i=0;i<marks.size();i++){
            long age=elapsed-(FinalRevealTiming.LEAD+i*FinalRevealTiming.INTERVAL+FinalRevealTiming.IMPACT);
            if(age>=0)count=i+1;
            if(i>=revealed && age>=0 && previousUpdate>=0 && snapshot.revealStartedAt()+FinalRevealTiming.LEAD+i*FinalRevealTiming.INTERVAL+FinalRevealTiming.IMPACT>previousUpdate && serverNow>=previousUpdate)impact.run();
            if(!reducedMotion&&age>=0&&age<180)cardsById.get(targets.get(i)).setScale(1-.008f*(float)Math.sin(Math.PI*age/180));
            Image image=marks.get(i);if(image==null)continue;
            boolean visible=i<revealed || age>=0;image.setVisible(visible);
            float pulse=!reducedMotion&&visible&&age>=0&&age<160?1+.12f*(1-age/160f):1;image.setScale(pulse);
        }
        revealed=Math.max(revealed,count);previousUpdate=serverNow;
        if(stamp==null)return;
        long relative=elapsed-FinalRevealTiming.LEAD;int index=(int)(relative/FinalRevealTiming.INTERVAL);
        boolean moving=!reducedMotion && snapshot.phase()==ImpostorPhase.FINAL_VOTE_REVEAL && relative>=0 && index<targets.size();stamp.setVisible(moving);
        if(!moving)return;
        Image mark=marks.get(index);Group target=cardsById.get(targets.get(index));
        // Transform the impact point through each card's slight natural rotation.
        var point=impactPoint;point.set(mark==null?125:mark.getX()+mark.getWidth()/2,mark==null?85:mark.getY()+mark.getHeight()/2);target.localToAscendantCoordinates(this,point);
        float tx=point.x,ty=point.y;float p=(relative%FinalRevealTiming.INTERVAL)/(float)FinalRevealTiming.INTERVAL;
        if(index>0 && p<.35f){Image previous=marks.get(index-1);Group previousCard=cardsById.get(targets.get(index-1));
            point.set(previous==null?125:previous.getX()+previous.getWidth()/2,previous==null?85:previous.getY()+previous.getHeight()/2);previousCard.localToAscendantCoordinates(this,point);
            float t=p/.35f;t=t*t*(3-2*t);tx=point.x+(tx-point.x)*t;ty=point.y+(ty-point.y)*t;
        }
        float lift=p<.35f?105:p<.55f?105*(1-(float)Math.pow((p-.35f)/.20f,2)):105*Math.min(1,(p-.55f)/.45f);
        stamp.setPosition(tx-stamp.getWidth()/2,ty-22+lift);stamp.setScale(p>=.55f&&p<.64f?.94f:1);
    }
    private final com.badlogic.gdx.math.Vector2 impactPoint=new com.badlogic.gdx.math.Vector2();
}
