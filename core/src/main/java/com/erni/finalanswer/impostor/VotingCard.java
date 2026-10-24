package com.erni.finalanswer.impostor;

import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.g2d.*;
import com.badlogic.gdx.scenes.scene2d.*;
import com.badlogic.gdx.scenes.scene2d.ui.*;
import com.badlogic.gdx.scenes.scene2d.utils.TextureRegionDrawable;
import com.badlogic.gdx.utils.Align;
import com.erni.finalanswer.rooms.RoomSession;
import java.util.ArrayList;

/** One physical dossier. Parent/card/paper alpha always stays one; only portrait effects may fade. */
final class VotingCard extends Group {
    private static final Color RULE=Color.valueOf("63402B"),SELECTED_RULE=Color.valueOf("8A3430"),INK=Color.valueOf("3C2721"),SELECTED_INK=Color.valueOf("69242B");
    final String playerId;
    final VotingLayout.Placement rest;
    final Group portrait;
    final ImpostorElimination elimination;
    private final Image shadow,contact,line;
    private final Label name,noVotes;
    private final VotingResources resources;
    private final ImpostorAssets assets;
    private int votes;
    private final java.util.List<Image> imprints=new ArrayList<>();
    VotingCard(RoomSession.Player player,Actor avatar,ImpostorAssets assets,VotingResources resources,VotingLayout.Placement placement,String zeroText){
        this.playerId=player.id();this.assets=assets;this.resources=resources;rest=placement;
        setName("finalCard:"+player.id());setBounds(rest.x(),rest.y(),rest.width(),rest.height());setOrigin(getWidth()/2,getHeight()/2);setRotation(rest.rotation());
        Texture paper=assets.texture(ImpostorAsset.SUSPECT_PAPER).orElse(null);
        shadow=paper==null?null:new Image(paper);contact=paper==null?null:new Image(paper);
        if(shadow!=null){shadow.setBounds(-3,-11,getWidth()+6,getHeight());shadow.setColor(0,0,0,.17f);addActor(shadow);contact.setBounds(1,-5,getWidth(),getHeight());contact.setColor(0,0,0,.28f);addActor(contact);}
        if(paper!=null){Image sheet=new OpaquePaper(paper,resources);sheet.setName("finalParchment");sheet.setSize(getWidth(),getHeight());addActor(sheet);}
        name=new Label(player.name(),new Label.LabelStyle(resources.name,Color.valueOf("3C2721")));
        name.setName("finalNickname");name.setAlignment(Align.center);name.setEllipsis("...");
        name.setBounds(getWidth()*.14f,getHeight()*.79f,getWidth()*.72f,getHeight()*.13f);name.setFontScale(resources.fontScale*Math.min(1,getWidth()/265));addActor(name);
        line=new Image(new TextureRegionDrawable(resources.pixel));line.setBounds(getWidth()*.23f,getHeight()*.765f,getWidth()*.54f,1.1f);line.setColor(.39f,.25f,.17f,.55f);addActor(line);
        portrait=new PortraitClip();portrait.setName("finalAvatar");portrait.setBounds(getWidth()*.18f,getHeight()*.43f,getWidth()*.64f,getHeight()*.31f);
        if(avatar!=null&&avatar.getWidth()>0&&avatar.getHeight()>0){
            if(avatar instanceof ImpostorCharacterActor character){character.portraitFraming(true);avatar.setBounds(0,0,portrait.getWidth(),portrait.getHeight());portrait.addActor(avatar);}
            else{Group fit=new Group();float scale=Math.min(portrait.getWidth()/avatar.getWidth(),portrait.getHeight()/avatar.getHeight());fit.setPosition((portrait.getWidth()-avatar.getWidth()*scale)/2,(portrait.getHeight()-avatar.getHeight()*scale)/2);fit.setScale(scale);avatar.setPosition(0,0);fit.addActor(avatar);portrait.addActor(fit);}
        }
        addActor(portrait);elimination=new ImpostorElimination(portrait);
        Image portraitEdge=new Image(new TextureRegionDrawable(resources.pixel));portraitEdge.setBounds(portrait.getX(),portrait.getY()-1,portrait.getWidth(),1);portraitEdge.setColor(.35f,.25f,.18f,.32f);addActor(portraitEdge);
        noVotes=new Label(zeroText,new Label.LabelStyle(resources.caption,Color.valueOf("775D46")));noVotes.setAlignment(Align.center);noVotes.setBounds(getWidth()*.12f,getHeight()*.18f,getWidth()*.76f,getHeight()*.13f);noVotes.setFontScale(resources.fontScale*Math.min(1,getWidth()/250));noVotes.setVisible(false);addActor(noVotes);
    }
    void caption(String value){noVotes.setText(value);}
    void zeroVotes(boolean visible){noVotes.setVisible(visible&&votes==0);}
    void clearStamps(){votes=0;for(Image mark:imprints)mark.remove();imprints.clear();}
    Image addStamp(int slot,int total,int globalIndex){
        votes=total;Texture ink=assets.texture(ImpostorAsset.STAMP_MARK).orElse(null);if(ink==null)return null;
        int columns=total<=2?total:total<=4?2:total<=6?3:4,rows=(total+columns-1)/columns,row=slot/columns,col=slot%columns;
        float gap=getWidth()*.027f,size=Math.min(getWidth()*.23f,Math.min((getWidth()*.70f-gap*(columns-1))/columns,(getHeight()*.29f-gap*(rows-1))/rows));
        int rowCount=Math.min(columns,total-row*columns);
        float x=(getWidth()-rowCount*size-(rowCount-1)*gap)/2+col*(size+gap),y=getHeight()*.115f+(rows-1-row)*(size+gap);
        Image mark=new Image(ink);mark.setName("voteStamp:"+globalIndex);mark.setBounds(x,y,size,size*ink.getHeight()/ink.getWidth());mark.setOrigin(size/2,mark.getHeight()/2);mark.setRotation((globalIndex%5-2)*2.1f);mark.setColor(.72f,.50f,.50f,1);mark.setVisible(false);addActor(mark);imprints.add(mark);return mark;
    }
    void emphasize(boolean selected){line.setColor(selected?SELECTED_RULE:RULE);name.setColor(selected?SELECTED_INK:INK);}
    void place(long elapsed,int index,boolean reduced){
        float p=reduced?1:clamp((elapsed-650-index*90)/420f);setVisible(reduced||elapsed>=650+index*90);
        float ease=1-(float)Math.pow(1-p,3),landing=p<.78f?0:(float)Math.sin((p-.78f)/.22f*Math.PI)*1.4f;
        setPosition(rest.x(),rest.y()+(1-ease)*45-landing);setRotation(rest.rotation()+(1-ease)*(index%2==0?-3:3));setScale(1);setColor(Color.WHITE);
        if(shadow!=null){shadow.getColor().a=.17f*(.5f+.5f*ease);contact.getColor().a=.28f*ease;}
    }
    static float clamp(float value){return Math.max(0,Math.min(1,value));}
    private static final class PortraitClip extends Group {
        @Override public void draw(Batch batch,float parentAlpha){batch.flush();if(clipBegin(getX(),getY(),getWidth(),getHeight()))try{super.draw(batch,parentAlpha);}finally{batch.flush();clipEnd();}}
    }
    /** Straight-alpha PNG rendering with local alpha repair and complete batch state restoration. */
    private static final class OpaquePaper extends Image {
        private final VotingResources resources;
        OpaquePaper(Texture texture,VotingResources resources){super(texture);this.resources=resources;}
        @Override public void draw(Batch batch,float parentAlpha){
            var shader=batch.getShader();boolean blend=batch.isBlendingEnabled();int src=batch.getBlendSrcFunc(),dst=batch.getBlendDstFunc(),srcA=batch.getBlendSrcFuncAlpha(),dstA=batch.getBlendDstFuncAlpha();float packed=batch.getPackedColor();
            try{batch.setShader(resources.opaquePaper);batch.enableBlending();batch.setBlendFunctionSeparate(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA,GL20.GL_ONE,GL20.GL_ONE_MINUS_SRC_ALPHA);super.draw(batch,parentAlpha);}
            finally{batch.setShader(shader);batch.setBlendFunctionSeparate(src,dst,srcA,dstA);if(blend)batch.enableBlending();else batch.disableBlending();batch.setPackedColor(packed);}
        }
    }
}
