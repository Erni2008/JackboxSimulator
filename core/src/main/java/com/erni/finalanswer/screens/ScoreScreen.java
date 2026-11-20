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
 * After every mode: the points each player earned in it and their running total. Rows arrive bottom-up so the
 * mode's winner lands last, "+points" counts up, then the totals settle; leaves on its own or on a key / click.
 * Black background for now; a scene goes behind it later.
 */
public final class ScoreScreen extends ScreenAdapter {
    private static final float W=1920,H=1080,GAP=12,STAGGER=.25f,ROW_IN=.55f,COUNT=1.2f,HOLD=7f;
    private record Row(String name,String character,int earned,int total,int rank){}

    private final Runnable done;
    private final String mode;
    private final List<Row> rows=new ArrayList<>();
    private final Map<String,Texture> portraits=new HashMap<>();
    private final FitViewport view=new FitViewport(W,H);
    private final SpriteBatch batch=new SpriteBatch();private final ShapeRenderer shapes=new ShapeRenderer();
    private final BitmapFont title=UiFonts.question(74),sub=UiFonts.nameplate(34),name=UiFonts.nameplate(40),number=UiFonts.question(54),small=UiFonts.nameplate(24);
    private final GlyphLayout glyphs=new GlyphLayout();
    private final float rowH;
    private float time;private boolean left;

    public ScoreScreen(JsonObject summary,Runnable done){
        this.done=done;
        mode=summary.has("mode")?summary.get("mode").getAsString():"";
        int rank=0,prev=Integer.MIN_VALUE,i=0;
        if(summary.has("rows"))for(var e:summary.getAsJsonArray("rows")){var p=e.getAsJsonObject();i++;
            int earned=p.has("earned")?p.get("earned").getAsInt():0;if(earned!=prev){rank=i;prev=earned;}
            rows.add(new Row(p.has("name")?p.get("name").getAsString():"?",p.has("characterId")?p.get("characterId").getAsString():"",
                earned,p.has("total")?p.get("total").getAsInt():0,rank));}
        rowH=rows.size()>6?78:92;
        for(Row r:rows){var f=Gdx.files.internal("forgotten_room/portraits/"+r.character+".png");
            if(!r.character.isEmpty()&&!portraits.containsKey(r.character)&&f.exists()){var t=new Texture(f,true);t.setFilter(Texture.TextureFilter.MipMapLinearLinear,Texture.TextureFilter.Linear);portraits.put(r.character,t);}}
    }

    /** Mode name for the title, English and Russian. */
    static String modeName(String mode){
        return switch(mode){
            case "race"->Localization.tr("ПРОКЛЯТЫЙ ЗАБЕГ","CURSED RUN");
            case "cage"->Localization.tr("АДСКАЯ КЛЕТКА","HELL CAGE");
            case "boxes"->Localization.tr("ПРОКЛЯТЫЕ КОРОБКИ","CURSED BOXES");
            case "cards"->Localization.tr("ПРОКЛЯТЫЕ КАРТЫ","CURSED CARDS");
            case "final-second"->Localization.tr("ПОСЛЕДНЯЯ СЕКУНДА","FINAL SECOND");
            case "impostor"->Localization.tr("САМОЗВАНЕЦ","THE IMPOSTOR");
            case "questions"->Localization.tr("ВОПРОСЫ","QUESTIONS");
            case "breach"->"SYSTEM BREACH";
            case "forgotten"->Localization.tr("ЗАБЫТАЯ КОМНАТА","THE FORGOTTEN ROOM");
            default->"";
        };
    }

    private float settled(){return 1.1f+STAGGER*Math.max(0,rows.size()-1)+ROW_IN+COUNT+.6f;}
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
        float n=rows.size(),tableH=n*rowH+Math.max(0,n-1)*GAP,top=H/2+tableH/2-60;
        float tx=W/2-600,tw=1200;

        Gdx.gl.glEnable(GL20.GL_BLEND);Gdx.gl.glBlendFunc(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);
        shapes.setProjectionMatrix(view.getCamera().combined);shapes.begin(ShapeRenderer.ShapeType.Filled);
        for(int i=0;i<rows.size();i++){Row r=rows.get(i);float a=appear(i)*out;if(a<=0)continue;
            float y=top-i*(rowH+GAP)-rowH,x=tx+(1-ease(a))*180;
            boolean lead=r.rank==1&&r.earned>0,zero=r.earned<=0;
            shapes.setColor(lead?new Color(1f,.76f,.3f,a):zero?new Color(.45f,.12f,.12f,a):new Color(.62f,.56f,.5f,.8f*a));
            shapes.rect(x,y,8,rowH);
            if(lead){shapes.setColor(1f,.7f,.25f,.07f*a*(0.8f+.2f*MathUtils.sin(time*3)));shapes.rect(x+8,y,tw-8,rowH);}
            shapes.setColor(1,1,1,.08f*a);shapes.rect(x,y-GAP/2-1,tw,1);}
        float line=MathUtils.clamp((time-.15f)/.6f,0,1);
        shapes.setColor(.9f,.68f,.3f,.7f*out);float lw=560*ease(line);shapes.rect(W/2-lw/2,top+64,lw,3);
        shapes.end();

        batch.setProjectionMatrix(view.getCamera().combined);batch.begin();
        float ta=MathUtils.clamp(time/.5f,0,1)*out;
        title.setColor(.96f,.78f,.42f,ta);
        title.draw(batch,Localization.tr("ИТОГИ РАУНДА","ROUND RESULTS"),0,top+200,W,Align.center,false);
        String mn=modeName(mode);
        if(!mn.isEmpty()){sub.setColor(.78f,.7f,.62f,ta*.9f);sub.draw(batch,mn,0,top+118,W,Align.center,false);}
        for(int i=0;i<rows.size();i++){Row r=rows.get(i);float a=appear(i)*out;if(a<=0)continue;
            float y=top-i*(rowH+GAP)-rowH,x=tx+(1-ease(a))*180,mid=y+rowH/2;
            boolean lead=r.rank==1&&r.earned>0,zero=r.earned<=0;
            number.setColor(lead?1f:.8f,lead?.8f:.76f,lead?.36f:.7f,a*(zero?.55f:1));
            number.draw(batch,String.valueOf(r.rank),x+30,mid+number.getCapHeight()/2,60,Align.center,false);
            Texture t=portraits.get(r.character);
            if(t!=null){batch.setColor(1,1,1,a*(zero?.55f:1));batch.draw(t,x+110,y+7,rowH-14,rowH-14);batch.setColor(Color.WHITE);}
            name.setColor(zero?.6f:.95f,zero?.58f:.93f,zero?.58f:.9f,a);
            glyphs.setText(name,r.name,0,r.name.length(),name.getColor(),480,Align.left,false,"…");
            name.draw(batch,glyphs,x+130+rowH,mid+name.getCapHeight()/2);
            float c=MathUtils.clamp((time-start(i)-ROW_IN*.6f)/COUNT,0,1);
            int shown=Math.round(r.earned*ease(c));
            number.setColor(zero?.55f:lead?1f:.95f,zero?.3f:lead?.82f:.86f,zero?.3f:lead?.4f:.6f,a);
            number.draw(batch,(shown>0?"+":"")+shown,x+tw-470,mid+number.getCapHeight()/2,220,Align.right,false);
            // total fades in after the count-up
            float ct=MathUtils.clamp((time-start(i)-ROW_IN*.6f-COUNT)/.5f,0,1)*a;
            small.setColor(.7f,.62f,.55f,.85f*ct);
            small.draw(batch,Localization.tr("всего","total"),x+tw-220,mid+small.getCapHeight()/2+16,200,Align.left,false);
            name.setColor(.92f,.88f,.84f,ct);
            name.draw(batch,String.valueOf(r.total),x+tw-220,mid+name.getCapHeight()/2-14,200,Align.left,false);}
        if(rows.isEmpty()){small.setColor(.7f,.7f,.7f,ta);small.draw(batch,Localization.tr("Нет игроков","No players"),0,H/2,W,Align.center,false);}
        if(time>settled()){small.setColor(.6f,.6f,.6f,.5f*MathUtils.clamp((time-settled())/.6f,0,1)*out);
            small.draw(batch,Localization.tr("нажмите любую клавишу","press any key"),0,70,W,Align.center,false);}
        batch.end();
    }
    /** Bottom row first, the winner last. */
    private float start(int i){return 1.1f+STAGGER*(rows.size()-1-i);}
    private float appear(int i){return MathUtils.clamp((time-start(i))/ROW_IN,0,1);}
    private static float ease(float t){float u=1-t;return 1-u*u*u;}

    @Override public void hide(){Gdx.input.setInputProcessor(null);}
    @Override public void dispose(){batch.dispose();shapes.dispose();title.dispose();sub.dispose();name.dispose();number.dispose();small.dispose();for(var t:portraits.values())t.dispose();}
}
