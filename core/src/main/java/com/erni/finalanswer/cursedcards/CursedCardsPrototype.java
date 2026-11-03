package com.erni.finalanswer.cursedcards;

import com.badlogic.gdx.*;
import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.g2d.*;
import com.badlogic.gdx.graphics.g2d.freetype.FreeTypeFontGenerator;
import com.badlogic.gdx.math.MathUtils;
import com.erni.finalanswer.gameplay.cursedcards.*;

/**
 * Local test harness for THE CURSED CARDS without phones. The production scene ({@link CursedCardsTable}) stays clean;
 * F1 (or `) toggles a separate development panel: player count, start, draw, random, auto play, reset and a debug view
 * of every hidden value. Keys work with the panel hidden: 4–6 players · ENTER start · SPACE draw selected · A random ·
 * P auto play · R reset · I hidden values · ESC skip the DEATH cinematic · T toggle the turn timer.
 */
public class CursedCardsPrototype extends CursedCardsTable {
    private static final String[][] BUTTONS={{"cursed_minus","-"},{"cursed_plus","+"},{"cursed_start","START"},{"cursed_draw","DRAW"},{"cursed_random","RANDOM"},{"cursed_auto","AUTO PLAY"},{"cursed_reset","RESET"},{"cursed_debug","VALUES"}};
    private final CursedButton[] buttons=new CursedButton[BUTTONS.length];
    protected boolean devPanel,debug,autoPlay;private float autoDelay,panelFade;private int mouseX,mouseY;private boolean mouseDown;
    private BitmapFont devFont,devSmall;private final GlyphLayout layout=new GlyphLayout();private Texture pixel;

    @Override public void create(){
        super.create();
        for(int i=0;i<buttons.length;i++)buttons[i]=new CursedButton(BUTTONS[i][0],BUTTONS[i][1]);
        var gen=new FreeTypeFontGenerator(Gdx.files.internal("ui/fonts/BebasNeue-Regular.ttf"));var p=new FreeTypeFontGenerator.FreeTypeFontParameter();p.spaceX=1;p.characters+="—·←→";
        p.size=26;devFont=gen.generateFont(p);gen.dispose();
        gen=new FreeTypeFontGenerator(Gdx.files.internal("ui/fonts/Rajdhani-SemiBold.ttf"));p.size=17;p.spaceX=0;devSmall=gen.generateFont(p);gen.dispose();
        Pixmap px=new Pixmap(1,1,Pixmap.Format.RGBA8888);px.setColor(Color.WHITE);px.fill();pixel=new Texture(px);px.dispose();
    }
    @Override protected boolean needsFrames(){return super.needsFrames()||autoPlay||panelFade>0&&panelFade<1;}
    @Override protected void update(float dt){
        super.update(dt);panelFade=MathUtils.clamp(panelFade+(devPanel?dt:-dt)*5,0,1);
        if(autoPlay&&awaitingDraw()){autoDelay-=dt;if(autoDelay<=0){drawRandom();autoDelay=.45f;}}
        if(game!=null&&game.phase()==CursedCardsGame.Phase.FINISHED)autoPlay=false;
    }
    private void press(int b){switch(b){
        case 0->setPlayers(players-1);case 1->setPlayers(players+1);case 2->startMatch();case 3->drawSelected();case 4->drawRandom();
        case 5->autoPlay=!autoPlay;case 6->{autoPlay=false;resetMatch();}case 7->debug=!debug;default->{}}}
    private boolean enabled(int i){return switch(i){case 0,1,2->!presenting();case 3->awaitingDraw()&&selectedSlot>=0;case 4->awaitingDraw();case 5->game!=null&&game.phase()==CursedCardsGame.Phase.PLAYING;default->true;};}

    @Override protected void drawOverlay(SpriteBatch batch){
        float k=view.height/1080f;
        // Idle invitation (production-styled, only when nothing is in play).
        if(game==null&&!presenting()){String t="PRESS ENTER TO SUMMON THE DEALER";devFont.getData().setScale(k*1.1f);layout.setText(devFont,t);float a=.55f+.25f*MathUtils.sin(System.nanoTime()*1e-9f*2);
            devFont.setColor(.93f,.76f,.45f,a);devFont.draw(batch,t,view.x+(view.width-layout.width)*.5f,view.y+view.height*.44f);
            String s=players+" PLAYERS  ·  F1 DEVELOPER PANEL";devSmall.getData().setScale(k);layout.setText(devSmall,s);devSmall.setColor(.8f,.72f,.6f,.6f);devSmall.draw(batch,s,view.x+(view.width-layout.width)*.5f,view.y+view.height*.44f-40*k);}
        if(debug)drawValues(batch,k);
        if(panelFade<=0)return;
        // Developer panel: a dark strip at the bottom, separate from the production HUD.
        float h=64*k,y=view.y;batch.setColor(0,0,0,.72f*panelFade);batch.draw(pixel,view.x,y,view.width,h);batch.setColor(.93f,.76f,.45f,.35f*panelFade);batch.draw(pixel,view.x,y+h,view.width,Math.max(1,k));batch.setColor(Color.WHITE);
        float bw=150*k,gap=6*k,x0=view.x+(view.width-(buttons.length*bw+(buttons.length-1)*gap))*.5f;devFont.getData().setScale(k);
        for(int i=0;i<buttons.length;i++){var b=buttons[i];b.bounds.set(x0+i*(bw+gap),y+8*k,bw,h-16*k);b.enabled=enabled(i)&&panelFade>.5f;b.on=(i==5&&autoPlay)||(i==7&&debug);
            b.update(Gdx.graphics.getDeltaTime(),b.bounds.contains(mouseX,Gdx.graphics.getHeight()-mouseY),mouseDown);b.draw(batch,devFont);}
        devSmall.getData().setScale(k);devSmall.setColor(.75f,.68f,.58f,.85f*panelFade);
        String line="DEV · "+players+" PLAYERS · DECK "+deckRules.size(players)+(status.isEmpty()?"":" · "+status)+" · QUALITY "+quality;devSmall.draw(batch,line,view.x+16*k,y+h+24*k);
    }
    /** Test-only: every hidden value over its card plus the authoritative hands. Never part of production. */
    private void drawValues(SpriteBatch batch,float k){
        devSmall.getData().setScale(k);
        for(Card3D c:cards){if(!c.visible)continue;tmp.set(c.pose.position);tmp.y+=.05f;camera.project(tmp,view.x,view.y,view.width,view.height);if(tmp.z>=1)continue;
            String v=c.value.label;layout.setText(devSmall,v);devSmall.setColor(c.value==CardValue.DEATH?new Color(1,.35f,.3f,1):new Color(.6f,1,.75f,1));devSmall.draw(batch,v,tmp.x-layout.width*.5f,tmp.y+layout.height*.5f);}
        if(game==null)return;float y=view.y+view.height-80*k;
        for(int p=0;p<game.players();p++){StringBuilder s=new StringBuilder(names[p]).append(game.safe(p)?" (safe)":"").append(": ");for(CursedCard c:game.hand(p))s.append(c.death()?"DEATH":c.value()).append(' ');
            devSmall.setColor(.6f,1,.75f,.9f);devSmall.draw(batch,s.toString(),view.x+16*k,y);y-=20*k;}
    }
    @Override protected InputAdapter input(){
        InputAdapter table=super.input();
        return new InputAdapter(){
            @Override public boolean keyDown(int k){
                if(k>=Input.Keys.NUM_4&&k<=Input.Keys.NUM_6){setPlayers(k-Input.Keys.NUM_0);return true;}
                switch(k){case Input.Keys.F1,Input.Keys.GRAVE->devPanel=!devPanel;case Input.Keys.ENTER->startMatch();case Input.Keys.SPACE->drawSelected();case Input.Keys.A->drawRandom();case Input.Keys.P->autoPlay=!autoPlay;
                    case Input.Keys.R->{autoPlay=false;resetMatch();}case Input.Keys.I->debug=!debug;case Input.Keys.ESCAPE->skipCinematic();case Input.Keys.T->tableConfig.turn.seconds=tableConfig.turn.seconds>0?0:10;default->{return false;}}Gdx.graphics.requestRendering();return true;}
            @Override public boolean touchDown(int x,int y,int p,int b){mouseDown=true;mouseX=x;mouseY=y;if(panelFade>.5f)for(int i=0;i<buttons.length;i++)if(buttons[i].contains(x,Gdx.graphics.getHeight()-y)){press(i);return true;}return table.touchDown(x,y,p,b);}
            @Override public boolean touchUp(int x,int y,int p,int b){mouseDown=false;return false;}
            @Override public boolean mouseMoved(int x,int y){mouseX=x;mouseY=y;if(panelFade>0)Gdx.graphics.requestRendering();return table.mouseMoved(x,y);}
        };
    }
    @Override public void dispose(){super.dispose();for(var b:buttons)b.dispose();devFont.dispose();devSmall.dispose();pixel.dispose();}
}
