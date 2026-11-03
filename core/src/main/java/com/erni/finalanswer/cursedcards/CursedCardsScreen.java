package com.erni.finalanswer.cursedcards;

import com.badlogic.gdx.*;
import com.erni.finalanswer.network.RealtimeClient;
import com.google.gson.JsonObject;

/**
 * THE CURSED CARDS on the host's shared screen inside FINAL ANSWER: the production table (no developer panel) driven by
 * the room server. ESC or ENTER after the verdict returns the room to the lobby.
 */
public final class CursedCardsScreen extends ScreenAdapter {
    private final CursedCardsTable table=new CursedCardsTable();private CursedCardsNetworkBridge bridge;private boolean created;
    private final RealtimeClient client;private final JsonObject first;
    public CursedCardsScreen(RealtimeClient client,JsonObject snapshot){this.client=client;first=snapshot;}
    public String session(){return bridge==null?"":bridge.session();}
    @Override public void show(){
        if(!created){created=true;table.create();table.resize(Gdx.graphics.getWidth(),Gdx.graphics.getHeight());bridge=new CursedCardsNetworkBridge(client,table,first);}
        InputProcessor scene=Gdx.input.getInputProcessor();
        Gdx.input.setInputProcessor(new InputMultiplexer(new InputAdapter(){@Override public boolean keyDown(int k){
            if((k==Input.Keys.ESCAPE||k==Input.Keys.ENTER)&&table.loserSeat()>=0&&!table.presenting()){bridge.end();return true;}
            if(k==Input.Keys.ESCAPE){table.skipCinematic();return true;}return false;}},scene));
    }
    @Override public void render(float delta){table.render();}
    @Override public void resize(int w,int h){if(created)table.resize(w,h);}
    @Override public void hide(){Gdx.graphics.setContinuousRendering(true);}
    @Override public void dispose(){if(bridge!=null)bridge.close();if(created)table.dispose();}
}
