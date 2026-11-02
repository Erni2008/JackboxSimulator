package com.erni.finalanswer.cursedcards;

import com.badlogic.gdx.*;
import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.g2d.GlyphLayout;
import com.badlogic.gdx.graphics.glutils.ShapeRenderer;
import com.badlogic.gdx.math.*;
import com.erni.finalanswer.gameplay.cursedcards.*;

/**
 * Local test harness for THE CURSED CARDS without phones. Development controls (players, start, draw, auto play,
 * reset, debug overlay with every hidden value) sit on top of the production {@link CursedCardsTable} and are
 * never part of it. Keys: 2–8 players · ENTER start · SPACE draw selected · A random draw · P auto play ·
 * R reset · I debug · C camera.
 */
public class CursedCardsPrototype extends CursedCardsTable {
    private static final String[] BUTTONS={"-","+","START","DRAW","RANDOM","AUTO PLAY","RESET","DEBUG","CAMERA"};
    private final Rectangle[] buttons=new Rectangle[BUTTONS.length];private int hover=-1;
    protected boolean debug,autoPlay;private float autoDelay;

    @Override public void create(){super.create();for(int i=0;i<buttons.length;i++)buttons[i]=new Rectangle();}
    @Override protected void update(float dt){
        super.update(dt);
        if(autoPlay&&awaitingDraw()){autoDelay-=dt;if(autoDelay<=0){drawRandom();autoDelay=.35f;}}
        if(game!=null&&game.phase()==CursedCardsGame.Phase.FINISHED)autoPlay=false;
    }
    @Override protected boolean needsFrames(){return super.needsFrames()||autoPlay;}
    private void press(int b){switch(b){
        case 0->setPlayers(players-1);case 1->setPlayers(players+1);case 2->startMatch();case 3->drawSelected();case 4->drawRandom();
        case 5->autoPlay=!autoPlay;case 6->{autoPlay=false;resetMatch();}case 7->debug=!debug;case 8->resetCamera();default->{}}}

    @Override protected void drawHud(){
        super.drawHud();
        int w=Gdx.graphics.getWidth();float bw=104,bh=38,gap=8,x0=(w-(BUTTONS.length*bw+(BUTTONS.length-1)*gap))*.5f;
        for(int i=0;i<buttons.length;i++)buttons[i].set(x0+i*(bw+gap),18,bw,bh);
        Gdx.gl.glEnable(GL20.GL_BLEND);shapes.setProjectionMatrix(batch.getProjectionMatrix());shapes.begin(ShapeRenderer.ShapeType.Filled);
        for(int i=0;i<buttons.length;i++){var r=buttons[i];boolean off=!enabled(i),on=(i==5&&autoPlay)||(i==7&&debug);
            shapes.setColor(.62f,.42f,.20f,off?.3f:1);shapes.rect(r.x-1.5f,r.y-1.5f,r.width+3,r.height+3);
            shapes.setColor(on?.32f:hover==i&&!off?.22f:.10f,on?.07f:hover==i&&!off?.06f:.035f,on?.06f:.04f,.95f);shapes.rect(r.x,r.y,r.width,r.height);}
        shapes.end();
        batch.begin();
        for(int i=0;i<buttons.length;i++){var r=buttons[i];font.setColor(enabled(i)?new Color(.95f,.82f,.6f,1):new Color(.5f,.42f,.34f,1));
            var l=new GlyphLayout(font,BUTTONS[i]);font.draw(batch,BUTTONS[i],r.x+(r.width-l.width)*.5f,r.y+(r.height+l.height)*.5f);}
        small.setColor(.6f,.55f,.5f,1);small.draw(batch,"DEV · PLAYERS "+players+" · DECK "+deckRules.size(players)+" · click a card of the glowing hand, click again or DRAW to take it · keys 2–8 ENTER SPACE A P R I C",24,Gdx.graphics.getHeight()-78);
        if(debug)drawDebug();
        batch.end();
    }
    private boolean enabled(int i){return switch(i){case 0,1,2->!presenting();case 3->awaitingDraw()&&selectedSlot>=0;case 4->awaitingDraw();case 5->game!=null&&game.phase()==CursedCardsGame.Phase.PLAYING;default->true;};}
    /** Test-only: every hidden value over its card plus the authoritative state. Never shown in production. */
    private void drawDebug(){
        for(Card3D c:cards){if(!c.visible)continue;tmp.set(c.pose.position);tmp.y+=.02f;camera.project(tmp);if(tmp.z>=1)continue;
            String v=c.value.label;var l=new GlyphLayout(small,v);small.setColor(c.value==CardValue.DEATH?new Color(1,.3f,.25f,1):new Color(.55f,1,.7f,1));small.draw(batch,v,tmp.x-l.width*.5f,tmp.y+l.height*.5f);}
        if(game==null)return;float y=Gdx.graphics.getHeight()-110;
        small.setColor(.55f,1,.7f,1);small.draw(batch,"DEBUG · phase "+game.phase()+" · drawer "+(game.current()+1)+" ← source "+(game.source()+1)+" · discarded "+game.discard().size()+"/"+game.deck().size(),24,y);
        for(int p=0;p<game.players();p++){y-=20;StringBuilder s=new StringBuilder("P"+(p+1)+(game.safe(p)?" safe":"")+": ");for(CursedCard c:game.hand(p))s.append(c.death()?"DEATH":c.value()).append(' ');small.draw(batch,s.toString(),24,y);}
    }
    @Override protected InputAdapter input(){
        InputAdapter table=super.input();
        return new InputAdapter(){
            @Override public boolean keyDown(int k){
                if(k>=Input.Keys.NUM_2&&k<=Input.Keys.NUM_8){setPlayers(k-Input.Keys.NUM_0);return true;}
                switch(k){case Input.Keys.ENTER->startMatch();case Input.Keys.SPACE->drawSelected();case Input.Keys.A->drawRandom();case Input.Keys.P->autoPlay=!autoPlay;
                    case Input.Keys.R->{autoPlay=false;resetMatch();}case Input.Keys.I->debug=!debug;case Input.Keys.C->resetCamera();default->{return false;}}return true;}
            @Override public boolean touchDown(int x,int y,int p,int b){int i=button(x,y);if(i>=0){if(enabled(i))press(i);return true;}return table.touchDown(x,y,p,b);}
            @Override public boolean touchDragged(int x,int y,int p){return table.touchDragged(x,y,p);}
            @Override public boolean touchUp(int x,int y,int p,int b){return table.touchUp(x,y,p,b);}
            @Override public boolean mouseMoved(int x,int y){hover=button(x,y);return false;}
            @Override public boolean scrolled(float ax,float ay){return table.scrolled(ax,ay);}
        };
    }
    private int button(int x,int y){int sy=Gdx.graphics.getHeight()-y;for(int i=0;i<buttons.length;i++)if(buttons[i]!=null&&buttons[i].contains(x,sy))return i;return -1;}
}
