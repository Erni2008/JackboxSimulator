package com.erni.finalanswer.impostor;

import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.g2d.BitmapFont;
import com.badlogic.gdx.scenes.scene2d.*;
import com.badlogic.gdx.scenes.scene2d.ui.*;
import com.badlogic.gdx.scenes.scene2d.utils.TextureRegionDrawable;
import com.badlogic.gdx.utils.Align;
import com.erni.finalanswer.gameplay.impostor.*;
import com.erni.finalanswer.localization.Localization;
import com.erni.finalanswer.rooms.RoomSession;
import java.util.*;
import java.util.function.Function;

/** A server-timed, three-zone ceremony. Owns render resources; never computes a vote or changes a phase. */
public final class FinalVotePresentation extends Group implements AutoCloseable {
    private static final Color IVORY=Color.valueOf("E8D8B5");
    private final ImpostorAssets assets;
    private final Localization texts;
    private final Function<RoomSession.Player,Actor> avatars;
    private final VotingResources resources=new VotingResources();
    private final Group cards=new Group(),heading=new Group();
    private final Label title,titleShadow;
    private final Image stamp,shade;
    private final IdentityReveal identity;
    private final Map<String,RoomSession.Player> rosterById=new LinkedHashMap<>();
    private final Map<String,VotingCard> cardsById=new LinkedHashMap<>();
    private final java.util.List<Image> marks=new ArrayList<>();
    private final java.util.List<String> targets=new ArrayList<>();
    private final com.badlogic.gdx.math.Vector2 impactPoint=new com.badlogic.gdx.math.Vector2(),previousPoint=new com.badlogic.gdx.math.Vector2();
    private FinalActSnapshot snapshot;
    private String sequence="",shownLanguage="",shownTitleKey="",selectedId="";
    private boolean copyDirty=true,lastIdentified;
    private int revealed;
    private long previousUpdate=-1,ceremonyStarted,headlineStarted,verdictStarted;
    private boolean paused,reducedMotion;
    private Runnable impact=()->{};
    public FinalVotePresentation(ImpostorAssets assets,Localization texts,Function<RoomSession.Player,Actor> avatars){
        this.assets=assets;this.texts=texts;this.avatars=avatars;
        setName("finalAct");setSize(1920,1080);setTouchable(Touchable.disabled);setVisible(false);
        shade=new Image(new TextureRegionDrawable(resources.pixel));shade.setName("votingRoomShade");shade.setBounds(0,0,1920,1080);shade.setColor(0,0,0,0);shade.setTouchable(Touchable.disabled);shade.setVisible(false);
        addActor(heading);
        titleShadow=label("finalTitleShadow",resources.heading,new Color(0,0,0,.8f),152,601,1620,112);
        title=label("finalTitle",resources.heading,IVORY,150,605,1620,112);
        cards.setName("finalCards");addActor(cards);
        identity=new IdentityReveal(assets,resources);addActor(identity);
        stamp=assets.texture(ImpostorAsset.STAMP).map(Image::new).orElse(null);
        if(stamp!=null){stamp.setName("woodenVoteStamp");stamp.setVisible(false);addActor(stamp);}
    }
    public com.badlogic.gdx.graphics.Texture decorationPixel(){return resources.pixel;}
    public Actor environmentShade(){return shade;}
    public float nameFontScale(){return resources.fontScale;}
    public BitmapFont nameFont(){return resources.name;}
    /** Kept for existing preview callers: voting now deliberately uses just its two owned type families. */
    public void revealFont(BitmapFont ignored){}
    public void paused(boolean value){if(paused&&!value)previousUpdate=-1;paused=value;}
    public void reducedMotion(boolean value){reducedMotion=value;}
    public void onImpact(Runnable callback){impact=Objects.requireNonNull(callback);}
    private Label label(String name,BitmapFont font,Color color,float x,float y,float width,float height){
        Label label=new Label("",new Label.LabelStyle(font,color));label.setFontScale(resources.fontScale);label.setName(name);label.setAlignment(Align.center);label.setBounds(x,y,width,height);heading.addActor(label);return label;
    }
    public void hidePresentation(){identity.reset();shownTitleKey="";selectedId="";headlineStarted=0;verdictStarted=0;snapshot=null;sequence="";copyDirty=true;revealed=0;previousUpdate=-1;marks.clear();targets.clear();for(var card:cardsById.values())card.clearStamps();setVisible(false);shade.setVisible(false);if(stamp!=null)stamp.setVisible(false);}
    public void clear(){hidePresentation();cards.clearChildren();cardsById.clear();rosterById.clear();}
    public void setRoster(java.util.List<ImpostorParticipant> roster){
        if(roster.isEmpty()){clear();return;}
        if(roster.size()<2||roster.size()>8)throw new IllegalArgumentException("Voting presentation supports 2–8 players");
        var ids=new HashSet<String>();for(var player:roster)if(!ids.add(player.player().id()))throw new IllegalArgumentException("Duplicate voting identity");
        clear();boolean dense=roster.size()>=7;
        title.setY(dense?625:605);titleShadow.setY(title.getY()-4);
        int index=0;
        for(var player:roster){var person=player.player();rosterById.put(person.id(),person);VotingCard card=new VotingCard(person,avatars.apply(person),assets,resources,VotingLayout.card(roster.size(),index++));cardsById.put(person.id(),card);cards.addActor(card);}
    }
    public int visibleStampCount(){int count=0;for(Image image:marks)if(image!=null&&image.isVisible())count++;return count;}
    public int stampCount(){return targets.size();}
    public void accept(FinalActSnapshot next){
        if(snapshot!=null&&!snapshot.sessionId().equals(next.sessionId()))hidePresentation();
        if(VotingLayout.ceremony(next.phase())&&(snapshot==null||!VotingLayout.ceremony(snapshot.phase())||!snapshot.sessionId().equals(next.sessionId())))ceremonyStarted=next.phaseStartedAt();
        snapshot=next;setVisible(true);copyDirty=true;
        if(!next.sequenceId().isEmpty()&&!next.sequenceId().equals(sequence)){
            sequence=next.sequenceId();previousUpdate=-1;revealed=0;marks.clear();targets.clear();for(var card:cardsById.values())card.clearStamps();
            var totals=new HashMap<String,Integer>();for(String id:next.stampTargets()){if(!cardsById.containsKey(id))throw new IllegalArgumentException("Unknown vote target: "+id);totals.merge(id,1,Integer::sum);}
            var slots=new HashMap<String,Integer>();
            for(String id:next.stampTargets()){int slot=slots.merge(id,1,Integer::sum)-1;Image mark=cardsById.get(id).addStamp(slot,totals.get(id),marks.size());marks.add(mark);targets.add(id);}
        }
        cards.setVisible(switch(next.phase()){case FINAL_VOTE_REVEAL,SUSPECT_ANNOUNCEMENT,IMPOSTOR_REVEAL,RESULT->true;default->false;});
        shade.setVisible(VotingLayout.ceremony(next.phase()));
    }
    private void copy(long serverNow){
        boolean identified=snapshot.phase()==ImpostorPhase.RESULT||snapshot.phase()==ImpostorPhase.IMPOSTOR_REVEAL&&(snapshot.outcome().equals("NO_CONSENSUS")||serverNow-snapshot.phaseStartedAt()>=FinalRevealTiming.IDENTITY_NAME_MILLIS);
        if(!copyDirty&&lastIdentified==identified&&shownLanguage.equals(texts.getLanguage()))return;copyDirty=false;lastIdentified=identified;shownLanguage=texts.getLanguage();
        String titleKey="";
        if(identified){
            titleKey=switch(snapshot.outcome()){
                case "NO_CONSENSUS" -> snapshot.submitted()==0?"no_votes":"tie";
                case "IMPOSTOR_CAUGHT" -> "caught";
                case "IMPOSTOR_ESCAPED" -> snapshot.leaders().size()==1&&!snapshot.leaders().getFirst().equals(snapshot.impostorId())?"innocent":"escaped";
                default -> "complete";
            };
        }else if(snapshot.phase()==ImpostorPhase.SUSPECT_ANNOUNCEMENT || snapshot.phase()==ImpostorPhase.IMPOSTOR_REVEAL){
            titleKey=snapshot.leaders().size()==1?"accused":snapshot.submitted()==0?"no_votes":"tie";
        }
        String value=titleKey.isEmpty()?"":texts.get("impostor.vote."+titleKey);
        if(!shownTitleKey.equals(titleKey)){
            shownTitleKey=titleKey;headlineStarted=snapshot.phaseStartedAt();
            if(identified&&snapshot.phase()==ImpostorPhase.IMPOSTOR_REVEAL&&!snapshot.outcome().equals("NO_CONSENSUS"))headlineStarted+=FinalRevealTiming.IDENTITY_NAME_MILLIS;
            headlineStarted=Math.max(headlineStarted,snapshot.revealStartedAt()+FinalRevealTiming.duration(targets.size()));
        }
        title.setText(value);titleShadow.setText(value);
        // Measure at native font density; only shrink unusually long localized headings.
        title.setFontScale(resources.fontScale);title.invalidate();
        float fit=Math.min(1,title.getWidth()/Math.max(1,title.getPrefWidth()));
        title.setFontScale(resources.fontScale*fit);titleShadow.setFontScale(resources.fontScale*fit);
        // Ties never select a random/actual impostor as the visual winner of the vote.
        String selected="";if(identified&&!snapshot.outcome().equals("NO_CONSENSUS"))selected=snapshot.outcome().equals("IMPOSTOR_CAUGHT")?snapshot.impostorId():snapshot.leaders().size()==1?snapshot.leaders().getFirst():"";
        else if((snapshot.phase()==ImpostorPhase.SUSPECT_ANNOUNCEMENT||snapshot.phase()==ImpostorPhase.IMPOSTOR_REVEAL)&&snapshot.leaders().size()==1)selected=snapshot.leaders().getFirst();
        if(!selectedId.equals(selected)){selectedId=selected;verdictStarted=snapshot.phaseStartedAt();}
    }
    public void update(long serverNow){
        if(snapshot==null||paused)return;copy(serverNow);
        long elapsed=Math.max(0,serverNow-snapshot.revealStartedAt());
        boolean ceremony=VotingLayout.ceremony(snapshot.phase());
        shade.getColor().a=ceremony?.18f*(reducedMotion?1:smooth(VotingCard.clamp((serverNow-ceremonyStarted)/650f))):0;
        float intro=reducedMotion?1:smooth(VotingCard.clamp((serverNow-headlineStarted)/550f));
        if(!reducedMotion&&snapshot.phase()==ImpostorPhase.IMPOSTOR_REVEAL&&!snapshot.outcome().equals("NO_CONSENSUS")){long until=snapshot.phaseStartedAt()+FinalRevealTiming.IDENTITY_NAME_MILLIS-serverNow;if(until>0&&until<180)intro*=VotingCard.clamp(until/180f);}
        long countFinished=snapshot.revealStartedAt()+FinalRevealTiming.duration(targets.size());
        boolean verdictPhase=snapshot.phase()==ImpostorPhase.SUSPECT_ANNOUNCEMENT||snapshot.phase()==ImpostorPhase.IMPOSTOR_REVEAL||snapshot.phase()==ImpostorPhase.RESULT;
        heading.setVisible(verdictPhase&&serverNow>=countFinished&&!title.getText().isEmpty());
        heading.getColor().a=intro;
        heading.setOrigin(960,title.getY()+56);heading.setScale(reducedMotion?1:.985f+.015f*intro);
        boolean identityPhase=snapshot.phase()==ImpostorPhase.IMPOSTOR_REVEAL||snapshot.phase()==ImpostorPhase.RESULT;
        var revealedPlayer=rosterById.get(snapshot.impostorId());
        boolean revealIdentity=identityPhase&&!snapshot.outcome().equals("NO_CONSENSUS")&&revealedPlayer!=null;
        long identityAt=snapshot.phaseStartedAt()+FinalRevealTiming.IDENTITY_NAME_MILLIS;
        if(revealIdentity){
            // The RESULT fixtures carry their own phase start; live restores retain the identity start.
            if(snapshot.phase()==ImpostorPhase.RESULT)identityAt=snapshot.phaseStartedAt()-4000+FinalRevealTiming.IDENTITY_NAME_MILLIS;
            if(serverNow>=identityAt){identity.identity(revealedPlayer,avatars,texts);identity.present(reducedMotion?1:VotingCard.clamp((serverNow-identityAt)/600f),cardsById.size()>=7,reducedMotion);}
            else identity.setVisible(false);
            heading.setVisible(false);
        }else identity.setVisible(false);
        int index=0;for(var card:cardsById.values()){
            if(cards.isVisible())card.place(elapsed,index++,reducedMotion);
            float emphasis=reducedMotion?1:smooth(VotingCard.clamp((serverNow-verdictStarted)/450f));
            card.emphasize(card.playerId.equals(selectedId),!selectedId.isEmpty(),emphasis);
            float ink=revealIdentity&&card.playerId.equals(snapshot.impostorId())?smooth(VotingCard.clamp((serverNow-identityAt-600)/650f)):0;
            float revealContrast=revealIdentity?smooth(VotingCard.clamp((serverNow-identityAt-600)/450f)):0;
            card.revealContrast(card.playerId.equals(snapshot.impostorId()),revealContrast);
            card.identityInk(ink);

            float eliminated=card.playerId.equals(snapshot.impostorId())?ImpostorElimination.age(snapshot,serverNow):-1;
            card.elimination.apply(eliminated,reducedMotion,0);
        }
        int count=0;
        for(int i=0;i<marks.size();i++){
            long contact=snapshot.revealStartedAt()+FinalRevealTiming.LEAD+i*FinalRevealTiming.INTERVAL+FinalRevealTiming.IMPACT,markAge=serverNow-contact;
            if(markAge>=0)count=i+1;
            if(i>=revealed&&markAge>=0&&previousUpdate>=0&&contact>previousUpdate&&serverNow>=previousUpdate)impact.run();
            Image image=marks.get(i);if(image!=null){image.setVisible(i<revealed||markAge>=0);image.setScale(!reducedMotion&&markAge>=0&&markAge<140?1+.06f*(1-markAge/140f):1);}
            if(!reducedMotion&&markAge>=0&&markAge<160){VotingCard target=cardsById.get(targets.get(i));target.moveBy(0,-1.3f*(float)Math.sin(Math.PI*markAge/160));}
        }
        revealed=Math.max(revealed,count);previousUpdate=serverNow;
        if(stamp==null)return;
        long relative=elapsed-FinalRevealTiming.LEAD;int current=(int)(relative/FinalRevealTiming.INTERVAL);
        boolean moving=!reducedMotion&&snapshot.phase()==ImpostorPhase.FINAL_VOTE_REVEAL&&relative>=0&&current<targets.size();stamp.setVisible(moving);
        if(!moving)return;
        Image mark=marks.get(current);VotingCard target=cardsById.get(targets.get(current));
        point(target,mark,impactPoint);float tx=impactPoint.x,ty=impactPoint.y,p=(relative%FinalRevealTiming.INTERVAL)/(float)FinalRevealTiming.INTERVAL;
        if(current>0&&p<.35f){point(cardsById.get(targets.get(current-1)),marks.get(current-1),previousPoint);float blend=smooth(p/.35f);tx=previousPoint.x+(tx-previousPoint.x)*blend;ty=previousPoint.y+(ty-previousPoint.y)*blend;}
        float width=mark==null?90:Math.max(60,Math.min(130,mark.getWidth()*1.65f));stamp.setSize(width,width*stamp.getDrawable().getMinHeight()/stamp.getDrawable().getMinWidth());
        float lift=p<.35f?92:p<.55f?92*(1-(float)Math.pow((p-.35f)/.20f,2)):92*VotingCard.clamp((p-.55f)/.45f);
        stamp.getColor().a=Math.min(VotingCard.clamp(relative/90f),VotingCard.clamp((targets.size()*FinalRevealTiming.INTERVAL-relative)/90f));
        stamp.setPosition(tx-stamp.getWidth()/2,ty-stamp.getHeight()*.11f+lift);stamp.setScale(p>=.55f&&p<.64f?.96f:1);
    }
    private void point(VotingCard target,Image mark,com.badlogic.gdx.math.Vector2 point){point.set(mark==null?target.getWidth()/2:mark.getX()+mark.getWidth()/2,mark==null?target.getHeight()*.25f:mark.getY()+mark.getHeight()/2);target.localToAscendantCoordinates(this,point);}
    private static float smooth(float p){return p*p*(3-2*p);}
    @Override public void close(){resources.close();}
}
