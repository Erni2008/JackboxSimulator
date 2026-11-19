package com.erni.finalanswer.screens;

import com.erni.finalanswer.localization.Localization;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.InputAdapter;
import com.badlogic.gdx.ScreenAdapter;
import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.GL20;
import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.g2d.BitmapFont;
import com.badlogic.gdx.graphics.g2d.GlyphLayout;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import com.badlogic.gdx.graphics.glutils.ShapeRenderer;
import com.badlogic.gdx.math.MathUtils;
import com.badlogic.gdx.utils.Align;
import com.badlogic.gdx.utils.viewport.FitViewport;
import com.erni.finalanswer.ui.UiFonts;
import com.google.gson.JsonObject;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Between mini-games: every player's soul balance, richest at the top, broke players at the bottom. Rows arrive from
 * the bottom of the table up so the leader lands last, balances count up, and the screen leaves on its own (or on a
 * key / click once the table has settled). Black background for now; a scene goes behind it later.
 */
public final class BalanceScreen extends ScreenAdapter {
    private static final float W=1920,H=1080,ROW=96,GAP=14,STAGGER=.22f,ROW_IN=.55f,COUNT=1.1f,HOLD=6f;
    private record Row(String name,String character,long souls,int rank){}

    private final Runnable done;private final boolean ru;
    private final List<Row> rows=new ArrayList<>();
    private final Map<String,Texture> portraits=new HashMap<>();
    private final FitViewport view=new FitViewport(W,H);
    private final SpriteBatch batch=new SpriteBatch();private final ShapeRenderer shapes=new ShapeRenderer();
    private final BitmapFont title=UiFonts.question(78),name=UiFonts.nameplate(42),number=UiFonts.question(56),small=UiFonts.nameplate(24);
    private final GlyphLayout glyphs=new GlyphLayout();
    private float time;private boolean left;

    public BalanceScreen(JsonObject snapshot,boolean ru,Runnable done){
        this.done=done;this.ru=ru;
        List<Row> raw=new ArrayList<>();
        if(snapshot!=null&&snapshot.has("players"))for(var e:snapshot.getAsJsonArray("players")){var p=e.getAsJsonObject();
            String n=p.has("name")?p.get("name").getAsString():"?";String c=p.has("characterId")?p.get("characterId").getAsString():"";
            raw.add(new Row(n,c,p.has("souls")?Math.max(0,p.get("souls").getAsLong()):0,0));}
        raw.sort((a,b)->a.souls!=b.souls?Long.compare(b.souls,a.souls):a.name.compareToIgnoreCase(b.name));
        int rank=0;long prev=-1;
        for(Row r:raw){if(r.souls!=prev){rank++;prev=r.souls;}rows.add(new Row(r.name,r.character,r.souls,rank));}
        for(Row r:rows){var f=Gdx.files.internal("forgotten_room/portraits/"+r.character+".png");
            if(!r.character.isEmpty()&&!portraits.containsKey(r.character)&&f.exists()){var t=new Texture(f,true);t.setFilter(Texture.TextureFilter.MipMapLinearLinear,Texture.TextureFilter.Linear);portraits.put(r.character,t);}}
    }

    private float settled(){return .9f+STAGGER*Math.max(0,rows.size()-1)+ROW_IN+COUNT;}
    private void leave(){if(left)return;left=true;Gdx.app.postRunnable(done);}

    @Override public void show(){
        Gdx.input.setInputProcessor(new InputAdapter(){
            @Override public boolean keyDown(int k){if(time>settled())leave();return true;}
            @Override public boolean touchDown(int x,int y,int p,int b){if(time>settled())leave();return true;}
        });
    }
    @Override public void resize(int w,int h){view.update(w,h,true);}

    @Override public void render(float dt){
        time+=Math.min(dt,.1f);
        if(time>settled()+HOLD)leave();
        Gdx.gl.glClearColor(0,0,0,1);Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT);
        view.apply();
        float out=left?0:1;
        float n=rows.size(),tableH=n*ROW+(n-1)*GAP,top=H/2+tableH/2-40;
        float tx=W/2-560,tw=1120;

        Gdx.gl.glEnable(GL20.GL_BLEND);Gdx.gl.glBlendFunc(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);
        shapes.setProjectionMatrix(view.getCamera().combined);shapes.begin(ShapeRenderer.ShapeType.Filled);
        for(int i=0;i<rows.size();i++){Row r=rows.get(i);float a=appear(i)*out;if(a<=0)continue;
            float y=top-i*(ROW+GAP)-ROW,x=tx+(1-ease(a))*180;
            boolean lead=r.rank==1&&r.souls>0,broke=r.souls==0;
            Color bar=lead?new Color(1f,.76f,.3f,a):broke?new Color(.45f,.12f,.12f,a):new Color(.62f,.56f,.5f,.8f*a);
            shapes.setColor(bar);shapes.rect(x,y,8,ROW);
            shapes.setColor(1,1,1,.08f*a);shapes.rect(x,y-GAP/2-1,tw,1);}
        float line=MathUtils.clamp((time-.15f)/.6f,0,1);
        shapes.setColor(.9f,.68f,.3f,.7f*out);float lw=520*ease(line);shapes.rect(W/2-lw/2,top+70,lw,3);
        shapes.end();

        batch.setProjectionMatrix(view.getCamera().combined);batch.begin();
        float ta=MathUtils.clamp(time/.5f,0,1)*out;
        title.setColor(.96f,.78f,.42f,ta);
        title.draw(batch,ru?Localization.tr("БАЛАНС ДУШ", "SOUL BALANCE"):"SOUL BALANCE",0,top+190,W,Align.center,false);
        for(int i=0;i<rows.size();i++){Row r=rows.get(i);float a=appear(i)*out;if(a<=0)continue;
            float y=top-i*(ROW+GAP)-ROW,x=tx+(1-ease(a))*180,mid=y+ROW/2;
            boolean lead=r.rank==1&&r.souls>0,broke=r.souls==0;
            number.setColor(lead?1f:.8f,lead?.8f:.76f,lead?.36f:.7f,a*(broke?.55f:1));
            number.draw(batch,String.valueOf(r.rank),x+30,mid+number.getCapHeight()/2,60,Align.center,false);
            Texture t=portraits.get(r.character);
            if(t!=null){batch.setColor(1,1,1,a*(broke?.55f:1));batch.draw(t,x+110,y+8,ROW-16,ROW-16);batch.setColor(Color.WHITE);}
            name.setColor(broke?.6f:.95f,broke?.58f:.93f,broke?.58f:.9f,a);
            glyphs.setText(name,r.name,0,r.name.length(),name.getColor(),560,Align.left,false,"…");
            name.draw(batch,glyphs,x+220,mid+name.getCapHeight()/2);
            float c=MathUtils.clamp((time-start(i)-ROW_IN*.6f)/COUNT,0,1);long shown=Math.round(r.souls*ease(c));
            String value=shown+"";
            number.setColor(broke?.55f:lead?1f:.92f,broke?.22f:lead?.82f:.88f,broke?.22f:lead?.4f:.84f,a);
            number.draw(batch,value,x+tw-300,mid+number.getCapHeight()/2,190,Align.right,false);
            small.setColor(.7f,.62f,.55f,.85f*a);
            small.draw(batch,ru?Localization.tr("душ", "souls"):"souls",x+tw-96,mid+small.getCapHeight()/2,80,Align.left,false);}
        if(rows.isEmpty()){small.setColor(.7f,.7f,.7f,ta);small.draw(batch,ru?Localization.tr("Нет игроков", "No players"):"No players",0,H/2,W,Align.center,false);}
        if(time>settled()){small.setColor(.6f,.6f,.6f,.5f*MathUtils.clamp((time-settled())/.6f,0,1)*out);
            small.draw(batch,ru?Localization.tr("нажмите любую клавишу", "press any key"):"press any key",0,70,W,Align.center,false);}
        batch.end();
    }
    /** Bottom row first, the leader last. */
    private float start(int i){return .9f+STAGGER*(rows.size()-1-i);}
    private float appear(int i){return MathUtils.clamp((time-start(i))/ROW_IN,0,1);}
    private static float ease(float t){float u=1-t;return 1-u*u*u;}

    @Override public void hide(){Gdx.input.setInputProcessor(null);}
    @Override public void dispose(){batch.dispose();shapes.dispose();title.dispose();name.dispose();number.dispose();small.dispose();for(var t:portraits.values())t.dispose();}
}
