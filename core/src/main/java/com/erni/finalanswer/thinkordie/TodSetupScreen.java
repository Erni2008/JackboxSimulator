package com.erni.finalanswer.thinkordie;

import com.badlogic.gdx.*;
import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.g2d.*;
import com.badlogic.gdx.graphics.g2d.freetype.FreeTypeFontGenerator;
import com.badlogic.gdx.math.*;
import com.badlogic.gdx.scenes.scene2d.Actor;
import com.badlogic.gdx.scenes.scene2d.Stage;
import com.badlogic.gdx.utils.ScreenUtils;
import com.badlogic.gdx.utils.viewport.FitViewport;
import com.erni.finalanswer.ui.play.NeonFrame;
import com.erni.finalanswer.ui.play.QuizBackground;
import com.google.gson.*;
import java.util.*;
import java.util.function.Supplier;

/**
 * THINK OR DIE setup on the host screen: the three formats as large framed cards (survival, 1 on 1, 2 on 2), the match
 * settings (lives, turn time, faster turns), the players in the room, and START. Mouse and keyboard (arrows, Enter, Esc).
 * The floor-one hall stays animated behind. Nothing is sent until START.
 */
public final class TodSetupScreen extends ScreenAdapter {
    public record Choice(String format,int lives,int turnSeconds,boolean speedUp){}
    public interface Listener{void start(Choice c);void back();}
    private static final float W=1600,H=900;
    private static final Color IVORY=new Color(.94f,.91f,.85f,1),DIM=new Color(.70f,.64f,.58f,1),GOLD=new Color(1f,.80f,.40f,1),RED=new Color(1f,.26f,.24f,1),
        BRONZE=new Color(.72f,.50f,.28f,1),PLAQUE=new Color(.055f,.03f,.03f,.94f),SIDE_A=new Color(1f,.42f,.34f,1),SIDE_B=new Color(.48f,.70f,1f,1);
    private final Supplier<JsonObject> room;private final Listener listener;private final boolean ru;
    private Stage stage;private ThinkOrDieArt art;private Texture pixel;private QuizBackground background;private BitmapFont serif;private final NeonFrame neon=new NeonFrame();
    private final GlyphLayout gl=new GlyphLayout();private float clock;private boolean created;
    private int format=0,lives=3,turn=7;private boolean speed=true;private int focus=1; // 1 lives, 2 turn, 3 speed, 4 start (the mode is drawn at random)
    // the mode roulette after START: the highlight runs over the cards, slows down and stops on the drawn mode
    private boolean spinning;private int target;private float spinT,nextHop,hopGap;private final java.util.Random rnd=new java.util.Random();
    private static final float SPIN_S=2.6f,HOLD_S=1.1f;
    private final Rectangle[] cards={new Rectangle(),new Rectangle(),new Rectangle()};private final Rectangle livesMinus=new Rectangle(),livesPlus=new Rectangle(),turnMinus=new Rectangle(),turnPlus=new Rectangle(),speedBox=new Rectangle(),startBtn=new Rectangle(),backBtn=new Rectangle();
    private final float[] pick={1,0,0};private float hoverX=-1,hoverY=-1;private final Vector3 v3=new Vector3();
    private static final String[] FORMATS={"FFA","DUEL","TEAMS"};

    public TodSetupScreen(Supplier<JsonObject> room,boolean ru,Listener listener){this.room=room;this.ru=ru;this.listener=listener;}
    private String tr(String r,String e){return ru?r:e;}
    private int players(){JsonObject s=room.get();int n=0;if(s!=null&&s.has("players"))for(JsonElement e:s.getAsJsonArray("players")){JsonObject p=e.getAsJsonObject();if(!(p.has("host")&&p.get("host").getAsBoolean()))n++;}return n;}
    private boolean allowed(int f){int n=players();return f==2?n>=4:n>=2;}
    private int defaultLives(int f){return f==0?3:2;}

    @Override public void show(){
        if(!created){created=true;stage=new Stage(new FitViewport(W,H));art=new ThinkOrDieArt();
            Pixmap p=new Pixmap(1,1,Pixmap.Format.RGBA8888);p.setColor(Color.WHITE);p.fill();pixel=new Texture(p);p.dispose();
            background=new QuizBackground(pixel);background.setBounds(0,0,W,H);background.showImmediately(1,false);stage.addActor(background);stage.addActor(new View());
            var g=new FreeTypeFontGenerator(Gdx.files.internal("ui/fonts/CormorantSC-Bold.ttf"));
            try{var q=new FreeTypeFontGenerator.FreeTypeFontParameter();q.size=64;q.kerning=true;StringBuilder c=new StringBuilder(FreeTypeFontGenerator.DEFAULT_CHARS);for(char ch='Ѐ';ch<='ӿ';ch++)c.append(ch);
                q.characters=c.append("–—«»…’").toString();q.minFilter=Texture.TextureFilter.Linear;q.magFilter=Texture.TextureFilter.Linear;serif=g.generateFont(q);}finally{g.dispose();}}
        Gdx.input.setInputProcessor(new InputAdapter(){
            @Override public boolean mouseMoved(int x,int y){v3.set(x,y,0);stage.getViewport().unproject(v3);hoverX=v3.x;hoverY=v3.y;return false;}
            @Override public boolean touchDown(int x,int y,int ptr,int btn){v3.set(x,y,0);stage.getViewport().unproject(v3);click(v3.x,v3.y);return true;}
            @Override public boolean keyDown(int k){
                switch(k){
                    case Input.Keys.ESCAPE,Input.Keys.BACK->{if(!spinning)listener.back();}
                    case Input.Keys.UP->focus=Math.max(1,focus-1);
                    case Input.Keys.DOWN->focus=Math.min(4,focus+1);
                    case Input.Keys.LEFT->step(-1);
                    case Input.Keys.RIGHT->step(1);
                    case Input.Keys.ENTER,Input.Keys.SPACE->{if(focus==3)speed=!speed;else start();}
                    default->{return false;}
                }
                art.play("sounds/impostor/vote_sent.wav",.25f);return true;}});
    }
    private void step(int d){
        switch(focus){
            case 1->lives=MathUtils.clamp(lives+d,1,5);
            case 2->turn=MathUtils.clamp(turn+d,4,20);
            case 3->speed=!speed;
            default->{}
        }
    }
    private void setFormat(int f){if(f==format)return;format=f;lives=defaultLives(f);}
    private void click(float x,float y){
        if(spinning)return;
        if(livesMinus.contains(x,y)){lives=Math.max(1,lives-1);focus=1;}
        else if(livesPlus.contains(x,y)){lives=Math.min(5,lives+1);focus=1;}
        else if(turnMinus.contains(x,y)){turn=Math.max(4,turn-1);focus=2;}
        else if(turnPlus.contains(x,y)){turn=Math.min(20,turn+1);focus=2;}
        else if(speedBox.contains(x,y)){speed=!speed;focus=3;}
        else if(startBtn.contains(x,y)){start();return;}
        else if(backBtn.contains(x,y)){listener.back();return;}
        else return;
        art.play("sounds/impostor/vote_sent.wav",.25f);
    }
    /** Weighted draw: 2 on 2 and 1 on 1 most of the time, everyone for themselves rarely (10%) (2 on 2 needs four players). */
    private int draw(){int n=players();double r=rnd.nextDouble();if(n<4)return r<.10?0:1;return r<.10?0:r<.55?1:2;}
    private void start(){if(spinning||players()<2)return;spinning=true;target=draw();spinT=0;nextHop=0;hopGap=.06f;art.play("sounds/cursed_boxes/appearance.wav",.6f);}
    private void spin(float dt){
        spinT+=dt;
        if(spinT<SPIN_S){if(spinT>=nextHop){int f=format;do f=(f+1)%3;while(!allowed(f));
                // land exactly on the target: the last hops are forced towards it
                if(spinT+hopGap*1.6f>=SPIN_S)f=target;format=f;art.play("sounds/impostor/vote_sent.wav",.22f);hopGap*=1.16f;nextHop=spinT+hopGap;}}
        else if(format!=target){format=target;}
        else if(spinT>=SPIN_S&&spinT-dt<SPIN_S)art.play("sounds/cursed_boxes/appearance.wav",.7f);
        if(spinT>=SPIN_S+HOLD_S){spinning=false;int lv=target==0?lives:Math.max(1,lives-1);listener.start(new Choice(FORMATS[target],lv,turn,speed));}
    }
    @Override public void resize(int w,int h){if(stage!=null)stage.getViewport().update(w,h,true);}
    @Override public void render(float dt){ScreenUtils.clear(0,0,0,1);clock+=dt;if(spinning)spin(dt);for(int i=0;i<3;i++)pick[i]+=((spinning&&i==format?1:0)-pick[i])*Math.min(1,dt*(spinning&&spinT<SPIN_S?22:10));stage.act(dt);stage.draw();}
    @Override public void hide(){Gdx.input.setInputProcessor(null);}
    @Override public void dispose(){if(!created)return;stage.dispose();art.dispose();pixel.dispose();serif.dispose();background.dispose();neon.dispose();}

    // ---------------------------------------------------------------- drawing
    private final class View extends Actor{
        @Override public void draw(Batch batch,float pa){
            if(!(batch instanceof SpriteBatch sb))return;art.batch=sb;
            try{
                art.rect(0,0,W,H,new Color(.02f,.01f,.01f,1),.55f);art.glow(W/2,-40,W*1.2f,260,RED,.20f);
                if(art.logo!=null){float lw=380,lh=lw*art.logo.getHeight()/art.logo.getWidth();sb.setColor(Color.WHITE);sb.draw(art.logo,W/2-lw/2,808-lh/2,lw,lh);}
                label(spinning&&spinT>=SPIN_S?tr("РЕЖИМ ВЫБРАН","THE MODE IS SET"):tr("РЕЖИМ ВЫПАДЕТ СЛУЧАЙНО","THE MODE IS DRAWN AT RANDOM"),W/2,716,.52f,spinning&&spinT>=SPIN_S?GOLD:DIM);
                drawCards();drawSettings();drawRoster();drawButtons();
            }finally{sb.setColor(Color.WHITE);sb.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);}
        }
    }
    private void label(String s,float cx,float y,float sc,Color c){
        StringBuilder b=new StringBuilder();for(int i=0;i<s.length();i++){if(i>0)b.append(' ');b.append(s.charAt(i));}
        art.text(art.inter,b.toString(),cx,y,sc,c,1,0);float w=art.width(art.inter,b.toString(),sc);art.rect(cx-w/2-80,y-7,56,1.2f,c,.6f);art.rect(cx+w/2+24,y-7,56,1.2f,c,.6f);
    }
    private void serifText(String s,float cx,float y,float sc,Color c,float a){
        if(a<=0||sc<=.01f)return;serif.getData().setScale(sc);gl.setText(serif,s);float x=cx-gl.width/2;
        serif.setColor(0,0,0,.85f*a);serif.draw(art.batch,s,x+2,y-2);serif.setColor(c.r,c.g,c.b,a);serif.draw(art.batch,s,x,y);serif.getData().setScale(1);
    }
    /** The three format cards: a scene of characters, the title, a two-line description; the chosen one lifts and glows. */
    private void drawCards(){
        String[] titles={tr("ВЫЖИВАНИЕ","SURVIVAL"),tr("1 НА 1","1 ON 1"),tr("2 НА 2","2 ON 2")};
        String[][] desc={{tr("Все против всех","Everyone against everyone"),tr("последний живой побеждает","the last one standing wins")},
            {tr("Дуэли на вылет","Knockout duels"),tr("случайные пары, сетка турнира","random pairs, a tournament bracket")},
            {tr("Команды по двое","Teams of two"),tr("отвечаете по очереди, сетка","take turns, knockout bracket")}};
        String[] need={tr("от 2 игроков","2+ players"),tr("от 2 игроков","2+ players"),tr("от 4 игроков","4+ players")};
        float cw=316,ch=380,gap=26,x0=60,y0=250;
        for(int i=0;i<3;i++){float k=pick[i],x=x0+i*(cw+gap),y=y0+k*14;cards[i].set(x,y0,cw,ch);boolean ok=allowed(i),hover=cards[i].contains(hoverX,hoverY);
            if(k>.05f)art.glow(x+cw/2,y+ch/2,cw*1.5f,ch*1.3f,GOLD,.22f*k);
            art.panel(x,y,cw,ch,k>.5f?GOLD:hover?new Color(.9f,.7f,.45f,1):BRONZE,ok?1:.5f);
            scene(i,x+cw/2,y+165,ok?1:.4f);
            serifText(titles[i],x+cw/2,y+138,.66f,k>.5f?GOLD:IVORY,ok?1:.5f);
            art.text(art.inter,desc[i][0],x+cw/2,y+86,.58f,IVORY,ok?1:.5f,cw-40);
            art.text(art.inter,desc[i][1],x+cw/2,y+62,.50f,DIM,ok?1:.5f,cw-40);
            art.text(art.inter,ok?need[i]:tr("мало игроков","not enough players"),x+cw/2,y+34,.42f,ok?DIM:RED,1,0);
            if(spinning&&i==format){float p=.5f+.5f*MathUtils.sin(clock*5);art.rect(x+40,y-10,cw-80,2,GOLD,.4f+.5f*p);}}
    }
    /** A small scene on each card: one crowd, two facing characters, two pairs facing each other. */
    private void scene(int i,float cx,float baseY,float a){
        JsonObject s=room.get();List<String> ch=new ArrayList<>();if(s!=null&&s.has("players"))for(JsonElement e:s.getAsJsonArray("players")){JsonObject p=e.getAsJsonObject();if(p.has("characterId")&&!(p.has("host")&&p.get("host").getAsBoolean()))ch.add(p.get("characterId").getAsString());}
        String[] fallback={"skeleton","dracula","pumpkin","ghost","zombie","voodoo"};for(String f:fallback)if(ch.size()<6&&!ch.contains(f))ch.add(f);
        float[][] spots=i==0?new float[][]{{-95,0,.78f},{-48,10,.86f},{0,18,1},{48,10,.86f},{95,0,.78f}}:i==1?new float[][]{{-62,10,1},{62,10,1}}:new float[][]{{-112,4,.80f},{-66,12,.86f},{66,12,.86f},{112,4,.80f}};
        float vsY=i==2?baseY+150:baseY+110;
        for(int k=0;k<spots.length;k++){Texture b=art.body(ch.get(k%ch.size()));if(b==null)continue;float h=170*spots[k][2],w=h*b.getWidth()/b.getHeight();
            boolean flip=i>0&&spots[k][0]>0;art.batch.setColor(1,1,1,a);art.batch.draw(b,flip?cx+spots[k][0]+w/2:cx+spots[k][0]-w/2,baseY+spots[k][1],flip?-w:w,h);
            if(i>0){Color c=spots[k][0]<0?SIDE_A:SIDE_B;art.glow(cx+spots[k][0],baseY+spots[k][1]+4,w*.9f,24,c,.4f*a);}}
        art.batch.setColor(Color.WHITE);
        if(i>0){art.glow(cx,vsY-14,150,110,RED,.35f*a);serifText("VS",cx,vsY,.56f,new Color(1f,.84f,.58f,1),a);}
    }
    /** Settings panel on the right: lives, turn time, faster turns. */
    private void drawSettings(){
        float x=1080,w=460,y=250,h=380;art.panel(x,y,w,h,BRONZE,1);
        label(tr("НАСТРОЙКИ","SETTINGS"),x+w/2,y+h-30,.46f,GOLD);
        stepper(1,x,y+h-120,w,tr("ЖИЗНИ","LIVES"),hearts(lives),livesMinus,livesPlus);
        stepper(2,x,y+h-220,w,tr("ВРЕМЯ ХОДА","TURN TIME"),turn+tr(" с"," s"),turnMinus,turnPlus);
        // faster turns toggle
        float ry=y+h-310;speedBox.set(x+24,ry-26,w-48,56);boolean f=focus==3;
        art.text(art.inter,tr("ХОД УСКОРЯЕТСЯ","TURNS GET FASTER"),x+28+130,ry+8,.50f,f?GOLD:DIM,1,0);
        float tx=x+w-96,ty=ry-14;art.panel(tx,ty,70,32,speed?GOLD:BRONZE,1);
        float knob=speed?tx+70-28:tx+4;art.batch.setColor(speed?GOLD:DIM);art.batch.draw(art.soft,knob,ty+4,24,24);art.batch.setColor(Color.WHITE);
        art.text(art.inter,speed?tr("ДА","ON"):tr("НЕТ","OFF"),x+w/2,ry-40,.40f,DIM,1,0);
        if(f)art.rect(x+40,ry-30,w-80,1.5f,GOLD,.7f);
    }
    private String hearts(int n){StringBuilder b=new StringBuilder();for(int i=0;i<n;i++)b.append("♥");return n+"";}
    private void stepper(int id,float x,float y,float w,String title,String value,Rectangle minus,Rectangle plus){
        boolean f=focus==id;art.text(art.inter,title,x+w/2,y+46,.50f,f?GOLD:DIM,1,0);
        minus.set(x+30,y-28,56,56);plus.set(x+w-86,y-28,56,56);
        for(Rectangle r:new Rectangle[]{minus,plus}){boolean hv=r.contains(hoverX,hoverY);art.panel(r.x,r.y,r.width,r.height,hv||f?GOLD:BRONZE,1);}
        serifText("–",minus.x+28,y+18,.6f,IVORY,1);serifText("+",plus.x+28,y+18,.6f,IVORY,1);
        if(id==1){float hs=26,step=32,sx=x+w/2-(lives-1)*step/2;for(int i=0;i<lives;i++){art.batch.setColor(1f,.25f,.22f,1);heart(sx+i*step,y,hs);}art.batch.setColor(Color.WHITE);}
        else serifText(value,x+w/2,y+22,.70f,IVORY,1);
        if(f)art.rect(x+100,y-36,w-200,1.5f,GOLD,.7f);
    }
    private void heart(float cx,float cy,float s){
        art.batch.draw(art.soft,cx-s*.55f,cy-s*.05f,s*.62f,s*.62f);art.batch.draw(art.soft,cx-s*.07f,cy-s*.05f,s*.62f,s*.62f);
        Color c=art.batch.getColor();art.line(cx-s*.42f,cy+s*.12f,cx,cy-s*.42f,s*.42f,c,1,false);art.line(cx+s*.42f,cy+s*.12f,cx,cy-s*.42f,s*.42f,c,1,false);
    }
    /** Players in the room as a strip of portraits along the bottom. */
    private void drawRoster(){
        JsonObject s=room.get();List<JsonObject> ps=new ArrayList<>();if(s!=null&&s.has("players"))for(JsonElement e:s.getAsJsonArray("players")){JsonObject p=e.getAsJsonObject();if(!(p.has("host")&&p.get("host").getAsBoolean()))ps.add(p);}
        label(tr("ИГРОКИ","PLAYERS")+" · "+ps.size(),W/2,206,.42f,DIM);
        float step=110,x0=W/2-(ps.size()-1)*step/2;
        for(int i=0;i<ps.size();i++){JsonObject p=ps.get(i);float cx=x0+i*step;Texture f=art.face(p.has("characterId")?p.get("characterId").getAsString():"");
            art.batch.setColor(BRONZE);art.batch.draw(art.soft,cx-36,138,72,72);art.batch.setColor(Color.WHITE);if(f!=null)art.batch.draw(f,cx-28,146,56,56);
            art.text(art.inter,p.has("name")?p.get("name").getAsString():"?",cx,128,.42f,IVORY,1,step-8);}
    }
    private void drawButtons(){
        boolean ok=allowed(format),f=focus==4;startBtn.set(W/2-210,30,420,72);backBtn.set(60,40,170,52);
        float p=.5f+.5f*MathUtils.sin(clock*4);
        if(ok)art.glow(W/2,66,560,140,GOLD,(f?.32f:.18f)+.08f*p);
        art.panel(startBtn.x,startBtn.y,startBtn.width,startBtn.height,ok?GOLD:BRONZE,ok?1:.5f);
        serifText(spinning?tr("ВЫБИРАЕМ…","DRAWING…"):tr("НАЧАТЬ","START"),W/2,82,.72f,ok?new Color(1f,.9f,.72f,1):DIM,1);
        art.panel(backBtn.x,backBtn.y,backBtn.width,backBtn.height,backBtn.contains(hoverX,hoverY)?GOLD:BRONZE,1);
        art.text(art.inter,tr("НАЗАД","BACK"),backBtn.x+backBtn.width/2,backBtn.y+33,.52f,IVORY,1,0);
        art.text(art.inter,tr("Стрелки · Enter · Esc","Arrows · Enter · Esc"),W-150,62,.40f,DIM,1,0);
    }
}
