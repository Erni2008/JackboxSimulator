package com.erni.finalanswer.cursedcards;

import com.badlogic.gdx.*;
import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.g2d.*;
import com.badlogic.gdx.graphics.g2d.freetype.FreeTypeFontGenerator;
import com.badlogic.gdx.graphics.g3d.*;
import com.badlogic.gdx.graphics.g3d.shaders.DepthShader;
import com.badlogic.gdx.graphics.g3d.utils.ModelBuilder;
import com.badlogic.gdx.graphics.g3d.utils.shapebuilders.BoxShapeBuilder;
import com.badlogic.gdx.graphics.glutils.ShapeRenderer;
import com.badlogic.gdx.math.*;
import com.badlogic.gdx.math.collision.Ray;
import com.badlogic.gdx.utils.*;
import com.erni.finalanswer.gameplay.cursedcards.*;
import net.mgsx.gltf.scene3d.attributes.*;
import net.mgsx.gltf.scene3d.lights.*;
import net.mgsx.gltf.scene3d.scene.SceneManager;
import net.mgsx.gltf.scene3d.shaders.*;
import net.mgsx.gltf.scene3d.utils.IBLBuilder;
import java.util.ArrayDeque;
import java.util.List;

/**
 * THE CURSED CARDS shared-screen table: shufle.glb deals, pairs are revealed and discarded, hidden cards move
 * between hands. Rules live in {@link CursedCardsGame}; this class only presents its events, in order, and turns
 * a chosen slot into a {@link CursedCardsGame.Draw}. Every hand stays face down on the PC screen.
 */
public class CursedCardsTable extends ApplicationAdapter implements CursedCardsListener {
    public static final int MAX_CARDS=25;
    private static final float DEAL_INTERVAL=.5f;

    // scene
    protected PerspectiveCamera camera;
    protected SceneManager scene;
    protected DealerMachine machine;
    protected CardFaces faces;
    private Model cardModel,tableModel;
    private final Array<ModelInstance> props=new Array<>();
    private final ModelInstance[] seatMats=new ModelInstance[CursedDeck.MAX_PLAYERS];
    private Cubemap diffuse,specular;private Texture brdf,background,wood;
    private DirectionalLightEx key;
    /** Render budget; set before {@link #create()} (defaults by platform / -Dcursedcards.quality). */
    protected CursedCardsQuality quality=CursedCardsQuality.detect();
    /** Development only: load a different machine GLB (performance comparisons). */
    protected String modelOverride;
    private final GlyphLayout layout=new GlyphLayout();
    private final PointLightEx candle=new PointLightEx();
    protected SpriteBatch batch;protected ShapeRenderer shapes;protected BitmapFont font,small,banner;

    // cards and layout
    protected final Array<Card3D> cards=new Array<>();
    protected final CardAnimator animator=new CardAnimator();
    private final CardAnimator.DealPath path=new CardAnimator.DealPath();
    protected final CardPose[] seats=new CardPose[CursedDeck.MAX_PLAYERS];
    private final float[] seatWidth=new float[CursedDeck.MAX_PLAYERS];
    /** Visual hands; slot order mirrors the rules' hand order once all queued steps have played. */
    protected final Array<Array<Card3D>> hands=new Array<>();
    protected final Array<Card3D> discardPile=new Array<>(),tray=new Array<>();
    private final CardPose discardSpot=new CardPose();
    private final Vector3 deckOrigin=new Vector3(),slotOrigin=new Vector3();
    private float deckTilt,deckYaw,thickness,cardWidth,matTop=.004f;
    private final int[] finalDealt=new int[CursedDeck.MAX_PLAYERS];

    // match
    protected final CursedDeck deckRules=new CursedDeck();
    protected CursedCardsGame game;
    protected int players=4;
    protected int drawer=-1,source=-1,loser=-1,selectedSlot=-1;
    protected final boolean[] safe=new boolean[CursedDeck.MAX_PLAYERS];
    protected String status="PRESS START";
    protected final RandomXS128 random=new RandomXS128();

    // presentation sequencer: a step returns its duration, or a negative value to retry next frame.
    private interface Step{float run();}
    private final ArrayDeque<Step> steps=new ArrayDeque<>();
    private float clock,stepUntil;
    /** >1 plays the presentation faster (automated checks). */
    protected float timeScale=1;

    // camera
    protected final Vector3 target=new Vector3();protected float yaw,pitch,distance;private boolean dragging;private int dragX,dragY;
    protected final Vector3 tmp=new Vector3(),tmp2=new Vector3();

    @Override public void create(){
        DealerConfig config=DealerConfig.load();
        camera=new PerspectiveCamera(40,Gdx.graphics.getWidth(),Gdx.graphics.getHeight());camera.near=.05f;camera.far=40;
        PBRShaderConfig shader=PBRShaderProvider.createDefaultConfig();shader.numBones=0;shader.numDirectionalLights=quality==CursedCardsQuality.LOW?1:2;shader.numPointLights=quality.pointLights;shader.numSpotLights=0;
        DepthShader.Config depth=PBRShaderProvider.createDefaultDepthConfig();depth.numBones=0;
        scene=new SceneManager(new PBRShaderProvider(shader),new PBRDepthShaderProvider(depth));scene.setCamera(camera);
        buildLights();
        machine=new DealerMachine(config,0,quality,modelOverride!=null?modelOverride:quality.model);
        faces=new CardFaces(quality.faceHeight);for(String m:faces.missing)Gdx.app.error("CursedCards","PLACEHOLDER texture in use, provide assets/"+m);
        var c=config.card;cardModel=CardGeometry.build(c.width,c.height,c.thickness,c.cornerRadius,c.cornerSegments);
        cardModel.getMaterial(CardGeometry.FRONT).set(PBRFloatAttribute.createRoughness(.82f),PBRFloatAttribute.createMetallic(0));
        cardModel.getMaterial(CardGeometry.BACK).set(PBRFloatAttribute.createRoughness(.62f),PBRFloatAttribute.createMetallic(0));
        buildTable();
        for(int i=0;i<MAX_CARDS;i++){var card=new Card3D(i,cardModel,faces,CardValue.DEATH);card.visible=false;cards.add(card);}
        for(int i=0;i<CursedDeck.MAX_PLAYERS;i++){hands.add(new Array<>());seats[i]=new CardPose();}
        computePaths(config);layoutSeats();
        scene.getRenderableProviders().add(machine.scene);scene.getRenderableProviders().add(this::propRenderables);
        scene.getRenderableProviders().add(this::cardRenderables);
        batch=new SpriteBatch();shapes=new ShapeRenderer();
        var gen=new FreeTypeFontGenerator(Gdx.files.internal("ui/fonts/Rajdhani-SemiBold.ttf"));
        var p=new FreeTypeFontGenerator.FreeTypeFontParameter();p.characters+="—·←→";p.size=22;font=gen.generateFont(p);p.size=17;small=gen.generateFont(p);p.size=44;banner=gen.generateFont(p);gen.dispose();
        resetCamera();
        Gdx.input.setInputProcessor(input());
        warmUp();
        // Render on demand: a still table costs no GPU time; input events and animations request frames.
        Gdx.graphics.setContinuousRendering(false);Gdx.graphics.requestRendering();
        Gdx.app.log("CursedCards","quality "+quality);
    }
    /** Compile every shader variant at load (cards face up/down, shadows) so the first deal does not hitch. */
    private void warmUp(){
        for(int i=0;i<cards.size;i++){Card3D c=cards.get(i);deckPose(i,c.pose);if(i%2==0)c.pose.roll=0;c.visible=true;c.sync();}
        scene.update(0);scene.render();Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT|GL20.GL_DEPTH_BUFFER_BIT);
        for(Card3D c:cards)c.visible=false;
    }
    /** True while anything on screen changes; otherwise no frames are drawn until the next input. */
    protected boolean needsFrames(){return presenting()||machine.active()||dragging||(quality.pulse&&awaitingDraw());}

    // ---------------- match flow ----------------
    public boolean presenting(){return !steps.isEmpty()||clock<stepUntil||animator.busy(cards);}
    /** A draw is accepted once every queued rules event has played (a selection lift may still be moving). */
    public boolean awaitingDraw(){return game!=null&&game.phase()==CursedCardsGame.Phase.PLAYING&&steps.isEmpty()&&clock>=stepUntil&&drawer>=0;}
    public int players(){return players;}
    public void setPlayers(int n){if(game!=null&&game.phase()!=CursedCardsGame.Phase.FINISHED&&presenting())return;players=MathUtils.clamp(n,CursedDeck.MIN_PLAYERS,CursedDeck.MAX_PLAYERS);if(game==null||game.phase()==CursedCardsGame.Phase.FINISHED){layoutSeats();resetCamera();}}

    /** Collect every card, load the new shuffled deck into the machine and deal it through the slot. */
    public void startMatch(){
        if(presenting())return;
        game=CursedCardsGame.create(players,deckRules,random);game.addListener(this);
        layoutSeats();resetCamera();
        drawer=source=loser=selectedSlot=-1;java.util.Arrays.fill(safe,false);java.util.Arrays.fill(finalDealt,0);
        List<CursedCard> deck=game.deck();
        for(int i=0;i<deck.size();i++)finalDealt[i%players]++;
        float collect=collectAll();
        // Values are assigned only after every face is down again.
        enqueue(()->{for(Card3D c:cards){c.visible=false;}tray.clear();
            for(int i=0;i<deck.size();i++){Card3D c=cards.get(deck.get(i).id());c.setValue(faces,CardValue.of(deck.get(i).value()));tray.add(c);}
            for(int i=0;i<tray.size;i++){Card3D c=tray.get(i);animator.stop(c);deckPose(i,c.pose);c.visible=true;c.sync();}
            status="DEALING "+deck.size()+" CARDS TO "+players+" PLAYERS";machine.activate();return .6f;},collect);
        game.start();
    }
    /** Take the hidden card at {@code slot} of the current source's hand. Values are never consulted here. */
    public boolean drawSlot(int slot){
        if(!awaitingDraw())return false;
        boolean ok=game.draw(new CursedCardsGame.Draw(drawer,source,slot));selectedSlot=-1;return ok;
    }
    public boolean drawSelected(){return selectedSlot>=0&&drawSlot(selectedSlot);}
    public boolean drawRandom(){if(!awaitingDraw())return false;var d=game.randomDraw();selectedSlot=-1;return game.draw(d);}
    public void select(int slot){if(!awaitingDraw()||slot<0||slot>=hands.get(source).size)return;selectedSlot=slot==selectedSlot?-1:slot;relayout(source,.15f);}
    public void resetMatch(){
        steps.clear();stepUntil=clock;game=null;drawer=source=loser=selectedSlot=-1;java.util.Arrays.fill(safe,false);
        for(var h:hands)h.clear();discardPile.clear();tray.clear();
        for(Card3D c:cards){animator.stop(c);c.visible=false;}
        machine.reset();status="PRESS START";
    }

    private void enqueue(Step s){enqueue(s,0);}
    private void enqueue(Step s,float wait){if(wait>0){float[] until={-1};steps.add(()->{if(until[0]<0)until[0]=clock+wait;return clock>=until[0]?0:-1;});}steps.add(s);}
    private void waitForAnimations(){steps.add(()->animator.busy(cards)?-1:0);}

    // ---------------- rules events → presentation ----------------
    private boolean dealing;
    @Override public void dealt(CursedCard card,int player){
        dealing=true;
        enqueue(()->{Card3D c=cards.get(card.id());int index=tray.indexOf(c,true);tray.removeIndex(index);
            for(int i=0;i<tray.size;i++){CardPose p=deckPose(i,new CardPose());tray.get(i).queue.add(CardMotion.to(p,.25f,CardMotion.Ease.SMOOTH).delay(.34f));}
            Array<Card3D> hand=hands.get(player);hand.add(c);
            animator.deal(c,path,handPose(player,hand.size-1,finalDealt[player],false,new CardPose()),0,machine::dispense,null);return DEAL_INTERVAL;});
    }
    @Override public void pairRemoved(int player,CursedCard a,CursedCard b){
        endDealing();waitForAnimations();
        enqueue(()->{Card3D ca=cards.get(a.id()),cb=cards.get(b.id());var hand=hands.get(player);hand.removeValue(ca,true);hand.removeValue(cb,true);
            CardPose seat=seats[player];
            for(int i=0;i<2;i++){Card3D c=i==0?ca:cb;float side=(i==0?-.34f:.34f);
                CardPose up=new CardPose().set(seat);up.position.add(MathUtils.cosDeg(seat.yaw)*side,.32f,-MathUtils.sinDeg(seat.yaw)*side).mulAdd(tmp.set(-MathUtils.sinDeg(seat.yaw),0,-MathUtils.cosDeg(seat.yaw)),.25f);up.roll=0;up.pitch=-28;
                c.queue.add(CardMotion.to(up,.6f,CardMotion.Ease.SMOOTH).arc(.08f));
                CardPose pile=discardPose(discardPile.size,new CardPose());discardPile.add(c);
                c.queue.add(CardMotion.to(pile,.75f,CardMotion.Ease.SMOOTH).arc(.25f).delay(.75f));}
            relayout(player,.3f);status="PAIR OF "+CardValue.of(a.value()).label+" — PLAYER "+(player+1);return .9f;});
    }
    @Override public void turnChanged(int drawer,int source){
        endDealing();waitForAnimations();
        enqueue(()->{this.drawer=drawer;this.source=source;selectedSlot=-1;status="PLAYER "+(drawer+1)+" DRAWS A HIDDEN CARD FROM PLAYER "+(source+1);return 0;});
    }
    @Override public void transferred(CursedCard card,int from,int to){
        enqueue(()->{Card3D c=cards.get(card.id());hands.get(from).removeValue(c,true);Array<Card3D> hand=hands.get(to);hand.add(c);
            relayout(from,.2f);
            CardPose dest=handPose(to,hand.size-1,hand.size,false,new CardPose());c.queue.add(CardMotion.to(dest,.95f,CardMotion.Ease.SMOOTH).arc(.35f).lift(-10).wobble(6));
            for(int k=0;k<hand.size-1;k++)animator.move(hand.get(k),handPose(to,k,hand.size,false,new CardPose()),.4f,.2f);
            status="PLAYER "+(to+1)+" TOOK A CARD FROM PLAYER "+(from+1);drawer=source=-1;return 1.0f;});
    }
    @Override public void playerSafe(int player){enqueue(()->{safe[player]=true;return 0;});}
    @Override public void finished(int loser,List<Integer> survivors){
        endDealing();waitForAnimations();
        enqueue(()->{this.loser=loser;drawer=source=-1;Card3D death=hands.get(loser).first();
            CardPose shown=new CardPose().set(death.pose);shown.position.y+=.32f;shown.position.mulAdd(tmp.set(-MathUtils.sinDeg(seats[loser].yaw),0,-MathUtils.cosDeg(seats[loser].yaw)),.3f);shown.roll=0;shown.pitch=-35;
            death.queue.add(CardMotion.to(shown,1.1f,CardMotion.Ease.SMOOTH).arc(.1f));
            StringBuilder s=new StringBuilder();for(int p:survivors)s.append(s.length()>0?", ":"").append(p+1);
            status="PLAYER "+(loser+1)+" HOLDS DEATH · SURVIVORS: "+s;machine.activate();return 1.6f;});
        enqueue(()->{machine.shutdown();return 0;});
    }
    private void endDealing(){if(dealing){dealing=false;waitForAnimations();enqueue(()->{machine.shutdown();return 0;});}}

    // ---------------- layout ----------------
    private void computePaths(DealerConfig config){
        var c=config.card;Vector3 exit=machine.worldDirection(config.exitDirection,new Vector3()),slot=machine.worldPoint(config.spawn,new Vector3());
        float exitYaw=MathUtils.atan2Deg360(exit.x,exit.z);
        path.inside.set(tmp.set(slot).mulAdd(exit,-(c.height*.5f+.03f)),exitYaw,0,180);
        path.outside.set(tmp.set(slot).mulAdd(exit,c.height*.5f+.05f),exitYaw,0,180);
        slotOrigin.set(slot.x,0,slot.z-.25f);
        deckOrigin.set(machine.worldPoint(config.deck,new Vector3()));deckTilt=config.deckTilt;deckYaw=config.deckYaw;thickness=c.thickness;cardWidth=c.width;
        path.feed.set(deckPose(0,new CardPose()));path.feed.position.add(0,MathUtils.sinDeg(deckTilt)*config.feedTravel,-MathUtils.cosDeg(deckTilt)*config.feedTravel);
        CardMotion.halfWidth=c.width*.5f;CardMotion.halfHeight=c.height*.5f;CardAnimator.platformHeight=machine.worldBounds().getHeight()*.4f;
        var b=machine.worldBounds();discardSpot.set(new Vector3(b.min.x-.75f,matTop,b.min.z+.55f),-18,0,0);
    }
    /** Seats on an arc in front of the machine. Player 1 is rightmost; numbering runs clockwise seen from above. */
    private void layoutSeats(){
        float span=players<=3?84:Math.min(164,30f*(players-1)),radius=1.75f+Math.max(0,players-3)*.26f,step=players>1?span/(players-1):0;
        for(int i=0;i<CursedDeck.MAX_PLAYERS;i++){seatMats[i].transform.idt().translate(0,-10,0);}
        for(int i=0;i<players;i++){float a=span*.5f-i*step;
            seats[i].set(tmp.set(slotOrigin).add(MathUtils.sinDeg(a)*radius,matTop,MathUtils.cosDeg(a)*radius),a,0,180);
            seatWidth[i]=Math.min(1.15f,players>1?2*radius*MathUtils.sinDeg(step*.5f)*.92f:1.15f);
            seatMats[i].transform.setToTranslation(seats[i].position.x,0,seats[i].position.z).rotate(Vector3.Y,a).scale(seatWidth[i],1,players>5?.96f:1.02f);}
    }
    /** Card {@code index} of the loaded deck lying on the top platform, index 0 at the bottom (fed first), backs up. */
    protected CardPose deckPose(int index,CardPose out){
        Vector3 normal=tmp2.set(0,MathUtils.cosDeg(deckTilt),MathUtils.sinDeg(deckTilt));
        out.position.set(deckOrigin).mulAdd(normal,thickness*.5f+index*thickness*CardAnimator.THICKNESS_GAP);out.yaw=deckYaw;
        // Front-to-back tilt is a pitch for a lengthwise deck and a roll for a crosswise one (the card's long axis then runs along X).
        boolean across=Math.abs(deckYaw%180)>45;out.pitch=across?0:deckTilt;out.roll=across?180+deckTilt:180;return out;
    }
    /** Slot {@code k} of {@code n} in a player's fan, face down; {@code raised} lifts the selected card toward the drawer. */
    protected CardPose handPose(int player,int k,int n,boolean raised,CardPose out){
        CardPose seat=seats[player];float spread=Math.max(0,seatWidth[player]-cardWidth-.04f),gap=n>1?Math.min(.17f,spread/(n-1)):0,u=k-(n-1)*.5f,side=u*gap;
        out.set(seat);out.yaw-=u*3.5f;
        out.position.add(MathUtils.cosDeg(seat.yaw)*side,thickness*.5f+k*thickness*CardAnimator.THICKNESS_GAP,-MathUtils.sinDeg(seat.yaw)*side);
        if(raised){out.position.y+=.05f;out.position.mulAdd(tmp2.set(-MathUtils.sinDeg(seat.yaw),0,-MathUtils.cosDeg(seat.yaw)),.12f);out.pitch=-6;}
        return out;
    }
    private CardPose discardPose(int index,CardPose out){out.set(discardSpot);out.yaw+=((index*37)%23)-11;out.position.y+=thickness*.5f+index*thickness*CardAnimator.THICKNESS_GAP;out.position.x+=((index*13)%7-3)*.012f;return out;}
    private void relayout(int player,float duration){var h=hands.get(player);for(int k=0;k<h.size;k++)animator.move(h.get(k),handPose(player,k,h.size,player==source&&k==selectedSlot,new CardPose()),duration,0);}
    /** Return every visible card to the tray, face down; returns seconds until done. */
    private float collectAll(){
        float end=0;int n=0;Array<Card3D> all=new Array<>();for(var h:hands){all.addAll(h);h.clear();}all.addAll(discardPile);discardPile.clear();all.addAll(tray);tray.clear();
        for(Card3D c:all){if(!c.visible)continue;CardPose target=deckPose(n,new CardPose());
            if(!c.pose.faceDown())end=Math.max(end,animator.flip(c,n*.03f));
            end=Math.max(end,animator.returnTo(c,target,n*.06f+(c.pose.faceDown()?0:.75f)));n++;}
        return end;
    }

    // ---------------- frame ----------------
    @Override public void render(){
        float dt=Math.min(Gdx.graphics.getDeltaTime(),1/20f)*timeScale;update(dt);
        Gdx.gl.glClearColor(0,0,0,1);Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT|GL20.GL_DEPTH_BUFFER_BIT);
        batch.getProjectionMatrix().setToOrtho2D(0,0,Gdx.graphics.getWidth(),Gdx.graphics.getHeight());batch.begin();batch.disableBlending();batch.draw(background,0,0,Gdx.graphics.getWidth(),Gdx.graphics.getHeight());batch.enableBlending();batch.end();
        Gdx.gl.glClear(GL20.GL_DEPTH_BUFFER_BIT);
        scene.update(dt);scene.render();
        drawTurnMarks();
        drawHud();
        if(needsFrames())Gdx.graphics.requestRendering();
    }
    protected void update(float dt){
        clock+=dt;
        while(clock>=stepUntil&&!steps.isEmpty()){float d=steps.peek().run();if(d<0)break;steps.poll();stepUntil=clock+d;}
        animator.update(cards,dt);machine.update(dt);
        machine.slotLight.position.set(path.outside.position).add(0,.06f,-.25f);
        camera.position.set(target).add(distance*MathUtils.cosDeg(pitch)*MathUtils.sinDeg(yaw),distance*MathUtils.sinDeg(pitch),distance*MathUtils.cosDeg(pitch)*MathUtils.cosDeg(yaw));
        camera.up.set(Vector3.Y);camera.lookAt(target);camera.update();
    }
    /** Table plus only the seats in use. */
    private void propRenderables(Array<Renderable> out,Pool<Renderable> pool){props.first().getRenderables(out,pool);for(int i=0;i<players;i++)seatMats[i].getRenderables(out,pool);}
    private void cardRenderables(Array<Renderable> out,Pool<Renderable> pool){for(Card3D c:cards)if(c.visible)c.instance.getRenderables(out,pool);}
    public void resetCamera(){target.set(0,.3f,1.3f+Math.max(0,players-3)*.12f);yaw=0;pitch=40;distance=5.6f+Math.max(0,players-3)*.45f;}

    /** Card under the cursor among the current source's hand (the only cards a drawer may pick). */
    protected int pickSourceSlot(int sx,int sy){
        if(source<0)return -1;Ray ray=camera.getPickRay(sx,sy);int best=-1;float bestT=Float.MAX_VALUE;Matrix4 inv=new Matrix4();var h=hands.get(source);
        for(int k=0;k<h.size;k++){inv.set(h.get(k).instance.transform).inv();Vector3 o=tmp.set(ray.origin).mul(inv),d=tmp2.set(ray.direction).rot(inv);
            if(Math.abs(d.y)<1e-6f)continue;float t=-o.y/d.y;if(t<0||t>=bestT)continue;float x=o.x+d.x*t,z=o.z+d.z*t;
            if(Math.abs(x)<=cardWidth*.5f&&Math.abs(z)<=CardMotion.halfHeight){bestT=t;best=k;}}
        return best;
    }
    /** Production cue: outline the hand being drawn from. */
    private void drawTurnMarks(){
        if(!awaitingDraw()||source<0)return;
        Gdx.gl.glEnable(GL20.GL_DEPTH_TEST);shapes.setProjectionMatrix(camera.combined);shapes.begin(ShapeRenderer.ShapeType.Line);
        float glow=quality.pulse?.6f+.4f*MathUtils.sin(clock*4):1;shapes.setColor(.95f,.25f*glow,.15f*glow,1);
        Matrix4 m=new Matrix4();seats[source].apply(m);float hx=seatWidth[source]*.5f+.02f,hz=.53f;
        for(float e=0;e<.012f;e+=.004f){Vector3 a=new Vector3(-hx-e,.006f,-hz-e).mul(m),b=new Vector3(hx+e,.006f,-hz-e).mul(m),c=new Vector3(hx+e,.006f,hz+e).mul(m),d=new Vector3(-hx-e,.006f,hz+e).mul(m);shapes.line(a,b);shapes.line(b,c);shapes.line(c,d);shapes.line(d,a);}
        shapes.end();
    }
    /** Production HUD: title, turn line, seat names with SAFE/DEATH marks, result banner. */
    protected void drawHud(){
        int w=Gdx.graphics.getWidth(),h=Gdx.graphics.getHeight();Gdx.gl.glEnable(GL20.GL_BLEND);batch.begin();
        font.setColor(.95f,.82f,.6f,1);font.draw(batch,"THE CURSED CARDS",24,h-22);
        small.setColor(.92f,.5f,.4f,1);small.draw(batch,status,24,h-52);
        for(int i=0;i<players;i++){tmp.set(seats[i].position).add(MathUtils.sinDeg(seats[i].yaw)*.62f,0,MathUtils.cosDeg(seats[i].yaw)*.62f);camera.project(tmp);if(tmp.z>=1)continue;
            String label="PLAYER "+(i+1)+(i==loser?" — DEATH":safe[i]?" — SAFE":i==drawer?" — DRAWS":i==source?" — GIVES":"");
            var l=layout;l.setText(small,label);
            if(i==loser)small.setColor(1,.25f,.2f,1);else if(i==drawer)small.setColor(1,.85f,.45f,1);else if(i==source)small.setColor(1,.45f,.35f,1);else if(safe[i])small.setColor(.6f,.85f,.6f,1);else small.setColor(.8f,.68f,.52f,.85f);
            small.draw(batch,label,tmp.x-l.width*.5f,Math.max(tmp.y,96));}
        if(loser>=0&&!presenting()){String t="PLAYER "+(loser+1)+" IS CURSED";layout.setText(banner,t);banner.setColor(1,.22f,.16f,1);banner.draw(batch,t,(w-layout.width)*.5f,h*.82f);
            String s="ALL OTHER PLAYERS SURVIVE";layout.setText(font,s);font.setColor(.95f,.82f,.6f,1);font.draw(batch,s,(w-layout.width)*.5f,h*.82f-56);}
        batch.end();
    }
    protected InputAdapter input(){return new InputAdapter(){
        @Override public boolean touchDown(int x,int y,int pointer,int button){
            if(button==Input.Buttons.LEFT&&awaitingDraw()){int slot=pickSourceSlot(x,y);if(slot>=0){if(slot==selectedSlot)drawSelected();else select(slot);return true;}}
            dragging=true;dragX=x;dragY=y;return true;}
        @Override public boolean touchDragged(int x,int y,int pointer){if(!dragging)return false;yaw-=(x-dragX)*.25f;pitch=MathUtils.clamp(pitch+(y-dragY)*.2f,8,80);dragX=x;dragY=y;return true;}
        @Override public boolean touchUp(int x,int y,int pointer,int button){dragging=false;return true;}
        @Override public boolean scrolled(float ax,float ay){distance=MathUtils.clamp(distance*(1+ay*.08f),1.6f,12);return true;}
    };}
    @Override public void resize(int width,int height){camera.viewportWidth=width;camera.viewportHeight=height;camera.update();scene.updateViewport(width,height);}

    // ---------------- scene construction ----------------
    private void buildLights(){
        if(quality.shadowMap>0){var shadow=new DirectionalShadowLight(quality.shadowMap,quality.shadowMap,8f,8f,.1f,18);shadow.setCenter(0,.4f,1.2f);key=shadow;}else key=new DirectionalLightEx();
        key.set(new Color(1,.84f,.66f,1),new Vector3(-.42f,-1,-.5f).nor(),2.6f);scene.environment.add(key);
        if(quality!=CursedCardsQuality.LOW){var rim=new DirectionalLightEx();rim.set(new Color(.55f,.62f,.85f,1),new Vector3(.5f,-.35f,.9f).nor(),.45f);scene.environment.add(rim);}
        if(quality.pointLights>1){candle.set(new Color(1,.62f,.32f,1),new Vector3(-1.9f,1.1f,1.4f),2.4f,6f);scene.environment.add(candle);}
        scene.environment.set(new PBRFloatAttribute(PBRFloatAttribute.ShadowBias,1/1024f));
        var builder=IBLBuilder.createIndoor(key);builder.nearGroundColor.set(.10f,.05f,.035f,1);builder.farGroundColor.set(.03f,.02f,.02f,1);builder.nearSkyColor.set(.22f,.14f,.10f,1);builder.farSkyColor.set(.05f,.04f,.05f,1);
        try{diffuse=builder.buildIrradianceMap(quality.irradiance);specular=builder.buildRadianceMap(quality==CursedCardsQuality.LOW?5:7);}finally{builder.dispose();}
        brdf=new Texture(Gdx.files.classpath("net/mgsx/gltf/shaders/brdfLUT.png"));
        scene.setAmbientLight(.12f);
        scene.environment.set(PBRCubemapAttribute.createDiffuseEnv(diffuse));scene.environment.set(PBRCubemapAttribute.createSpecularEnv(specular));
        scene.environment.set(new PBRTextureAttribute(PBRTextureAttribute.BRDFLUTTexture,brdf));
        background=radialBackground();
    }
    private void buildTable(){
        wood=woodTexture();var mb=new ModelBuilder();mb.begin();long attrs=VertexAttributes.Usage.Position|VertexAttributes.Usage.Normal|VertexAttributes.Usage.TextureCoordinates;
        var top=new Material("table",PBRTextureAttribute.createBaseColorTexture(wood),PBRFloatAttribute.createRoughness(.48f),PBRFloatAttribute.createMetallic(0));
        mb.node().id="table";BoxShapeBuilder.build(mb.part("table",GL20.GL_TRIANGLES,attrs,top),0,-.07f,1.2f,7.4f,.14f,5.2f);
        var brass=new Material("brass",PBRColorAttribute.createBaseColorFactor(new Color(.62f,.42f,.20f,1)),PBRFloatAttribute.createMetallic(1),PBRFloatAttribute.createRoughness(.38f));
        var felt=new Material("felt",PBRColorAttribute.createBaseColorFactor(new Color(.20f,.035f,.045f,1)),PBRFloatAttribute.createRoughness(.95f),PBRFloatAttribute.createMetallic(0));
        // Unit mat (1 x 1), scaled per seat.
        mb.node().id="seat";BoxShapeBuilder.build(mb.part("rim",GL20.GL_TRIANGLES,attrs,brass),0,.0012f,0,1.04f,.0024f,1.04f);BoxShapeBuilder.build(mb.part("felt",GL20.GL_TRIANGLES,attrs,felt),0,.002f,0,1,.004f,1);
        tableModel=mb.end();
        props.add(new ModelInstance(tableModel,"table"));
        for(int i=0;i<seatMats.length;i++){seatMats[i]=new ModelInstance(tableModel,"seat");props.add(seatMats[i]);}
    }
    private static Texture radialBackground(){
        int s=256;Pixmap p=new Pixmap(s,s,Pixmap.Format.RGBA8888);
        for(int y=0;y<s;y++)for(int x=0;x<s;x++){float dx=(x-s*.5f)/(s*.5f),dy=(y-s*.38f)/(s*.6f),r=Math.min(1,(float)Math.sqrt(dx*dx+dy*dy)),k=1-r*r*(3-2*r);
            p.drawPixel(x,y,Color.rgba8888(.018f+.13f*k,.014f+.045f*k,.016f+.035f*k,1));}
        var t=new Texture(p);t.setFilter(Texture.TextureFilter.Linear,Texture.TextureFilter.Linear);p.dispose();return t;
    }
    private static Texture woodTexture(){
        int w=1024,h=512;Pixmap p=new Pixmap(w,h,Pixmap.Format.RGBA8888);
        for(int y=0;y<h;y++){float plank=(y/128)*37.1f;for(int x=0;x<w;x++){
            float warp=MathUtils.sin(x*.004f+plank)*6+MathUtils.sin(x*.017f+y*.03f)*1.6f,grain=.5f+.5f*MathUtils.sin((y+warp)*.55f+plank),fine=.5f+.5f*MathUtils.sin((y+warp*1.7f)*2.3f);
            float seam=y%128<2?.45f:1,k=(.72f+.2f*grain+.08f*fine)*seam;
            p.drawPixel(x,y,Color.rgba8888(.21f*k,.11f*k,.062f*k,1));}}
        var t=new Texture(p,true);t.setFilter(Texture.TextureFilter.MipMapLinearLinear,Texture.TextureFilter.Linear);t.setAnisotropicFilter(8);p.dispose();return t;
    }
    @Override public void dispose(){
        scene.dispose();machine.dispose();faces.dispose();cardModel.dispose();tableModel.dispose();diffuse.dispose();specular.dispose();brdf.dispose();background.dispose();wood.dispose();
        batch.dispose();shapes.dispose();font.dispose();small.dispose();banner.dispose();
    }
}
