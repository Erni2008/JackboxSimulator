package com.erni.finalanswer.cursedcards;

import com.badlogic.gdx.*;
import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.g2d.*;
import com.badlogic.gdx.graphics.g3d.*;
import com.badlogic.gdx.graphics.g3d.attributes.BlendingAttribute;
import com.badlogic.gdx.graphics.g3d.attributes.DepthTestAttribute;
import com.badlogic.gdx.graphics.g3d.shaders.DepthShader;
import com.badlogic.gdx.graphics.g3d.utils.ModelBuilder;
import com.badlogic.gdx.graphics.glutils.FrameBuffer;
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
 * THE CURSED CARDS shared-screen scene, a 2D/3D hybrid: the painted hall and table (backdrop) with the 3D dealer and
 * cards registered to its perspective by a fixed camera ({@link TableConfig}). Rules live in {@link CursedCardsGame};
 * this class only presents its events in order and turns a chosen slot into a {@link CursedCardsGame.Draw}.
 * Every hand stays face down on the PC screen.
 * <p>Layers: backdrop → character sprites (anchors, none yet) → 3D machine/cards with contact shadows and hand glows →
 * embers and dust → DEATH dim → HUD.
 */
public class CursedCardsTable extends ApplicationAdapter implements CursedCardsListener {
    public static final int MAX_CARDS=25;
    public static final String BACKGROUND="cursed_cards/background.png";
    private static final float DEAL_INTERVAL=.5f;

    // scene
    protected PerspectiveCamera camera;
    protected SceneManager scene;
    protected DealerMachine machine;
    protected CardFaces faces;
    protected TableConfig tableConfig;
    protected CameraDirector director;
    /** Render budget; set before {@link #create()} (defaults by platform / -Dcursedcards.quality). */
    protected CursedCardsQuality quality=CursedCardsQuality.detect();
    /** Development only: load a different machine GLB (performance comparisons). */
    protected String modelOverride;
    /** Letterbox rectangle (logical pixels) holding the backdrop's aspect, so painting and 3D stay registered. */
    protected final Rectangle view=new Rectangle();
    private Model cardModel,quadModel;private Texture blob,background;private Cubemap diffuse,specular;private Texture brdf;
    private FrameBuffer lowRes;private int lowW,lowH;
    /** Contact shadows on the painted felt (one per card, one under the machine) and the two hand glows (turn cues). */
    private final ModelInstance[] cardShadows=new ModelInstance[MAX_CARDS];private ModelInstance machineShadow,activeGlow,targetGlow;
    private DirectionalLightEx key;private final PointLightEx warm=new PointLightEx();
    protected SpriteBatch batch;
    protected CursedHud hud;protected final CursedHud.Frame hudFrame=new CursedHud.Frame();
    protected TableFx fx;
    /** Seated character sprites: none in the project are suitable yet, so the layer draws nothing; anchors are ready. */
    protected CharacterActions actions=NO_ACTIONS;
    private static final CharacterActions NO_ACTIONS=new CharacterActions(){public void idle(int s){}public void lookAtCards(int s){}public void drawCard(int s){}public void receiveCard(int s){}public void discardPair(int s){}public void nervous(int s){}public void survive(int s){}public void eliminate(int s){}};
    protected String[] names=CursedHud.DEFAULT_NAMES;

    // cards and layout
    protected final Array<Card3D> cards=new Array<>();
    protected final CardAnimator animator=new CardAnimator();
    private final CardAnimator.DealPath path=new CardAnimator.DealPath();
    /** Visual hands; slot order mirrors the rules' hand order once all queued steps have played. */
    protected final Array<Array<Card3D>> hands=new Array<>();
    protected final Array<Card3D> discardPile=new Array<>(),tray=new Array<>();
    protected Array<SeatLayout.Seat> seatList=new Array<>();
    private final Vector3 deckOrigin=new Vector3();
    private float deckScale=1,deckTilt,deckYaw,thickness,cardWidth,cardHeight;
    private final int[] finalDealt=new int[CursedDeck.MAX_PLAYERS];
    /** Machine presence target: 1 while it loads and deals, 0 once every card is out (it evaporates). */
    private float machineTarget=1;
    private final Array<Card3D> burning=new Array<>();

    // match
    protected final CursedDeck deckRules=new CursedDeck();
    protected CursedCardsGame game;
    protected int players=4;
    protected int drawer=-1,source=-1,loser=-1,selectedSlot=-1,hoverSlot=-1;
    protected final boolean[] safe=new boolean[CursedDeck.MAX_PLAYERS];
    /** Development status line (dev overlay); production text goes through the HUD. */
    protected String status="";
    protected final RandomXS128 random=new RandomXS128();
    // turn cues and the DEATH reveal
    private float activeAmount,targetAmount,dim,dimTarget,deathLight;private int glowDrawer=-1,glowSource=-1;private boolean verdict;private Card3D deathCard;

    // presentation sequencer: a step returns its duration, or a negative value to retry next frame.
    private interface Step{float run();}
    private final ArrayDeque<Step> steps=new ArrayDeque<>();
    private float clock,stepUntil;
    /** >1 plays the presentation faster (automated checks). */
    protected float timeScale=1;
    private boolean cameraMoving;
    protected final Vector3 tmp=new Vector3(),tmp2=new Vector3();
    private final Matrix4 inv=new Matrix4();

    @Override public void create(){
        DealerConfig config=DealerConfig.load();
        tableConfig=TableConfig.load();
        camera=new PerspectiveCamera(tableConfig.camera.fov,Gdx.graphics.getWidth(),Gdx.graphics.getHeight());camera.near=.2f;camera.far=140;director=new CameraDirector(tableConfig.camera);
        PBRShaderConfig shader=PBRShaderProvider.createDefaultConfig();shader.numBones=0;shader.numDirectionalLights=quality==CursedCardsQuality.LOW?1:2;shader.numPointLights=quality.pointLights;shader.numSpotLights=0;
        DepthShader.Config depth=PBRShaderProvider.createDefaultDepthConfig();depth.numBones=0;
        scene=new SceneManager(new PBRShaderProvider(shader),new PBRDepthShaderProvider(depth));scene.setCamera(camera);
        buildLights();
        machine=new DealerMachine(config,0,quality,modelOverride!=null?modelOverride:quality.model);machine.place(tableConfig.table.x+tableConfig.machine.x,tableConfig.table.z+tableConfig.machine.z,tableConfig.machineYaw);
        faces=new CardFaces(quality.faceHeight);for(String m:faces.missing)Gdx.app.error("CursedCards","PLACEHOLDER texture in use, provide assets/"+m);
        var c=config.card;cardModel=CardGeometry.build(c.width,c.height,c.thickness,c.cornerRadius,c.cornerSegments);
        // Matte card stock: low specular so the burgundy backs keep their depth instead of mirroring the cool room light.
        cardModel.getMaterial(CardGeometry.FRONT).set(PBRFloatAttribute.createRoughness(.9f),PBRFloatAttribute.createMetallic(0),PBRFloatAttribute.createSpecularFactor(.2f));
        cardModel.getMaterial(CardGeometry.BACK).set(PBRFloatAttribute.createRoughness(.88f),PBRFloatAttribute.createMetallic(0),PBRFloatAttribute.createSpecularFactor(.2f),PBRColorAttribute.createBaseColorFactor(new Color(1.25f,1.18f,1.12f,1)));
        buildQuads();
        for(int i=0;i<MAX_CARDS;i++){var card=new Card3D(i,cardModel,faces,CardValue.DEATH);card.visible=false;cards.add(card);}
        for(int i=0;i<CursedDeck.MAX_PLAYERS;i++)hands.add(new Array<>());
        computePaths(config);layoutSeats();
        var providers=scene.getRenderableProviders();
        providers.add((out,pool)->{if(machine.visible())machine.scene.getRenderables(out,pool);});providers.add(this::feltRenderables);providers.add(this::cardRenderables);
        batch=new SpriteBatch();hud=new CursedHud();fx=new TableFx();
        director.main();director.snap();
        Gdx.input.setInputProcessor(input());
        warmUp();
        // HIGH/MEDIUM render every display frame for perfectly even motion; LOW renders on demand to save battery.
        Gdx.graphics.setContinuousRendering(quality!=CursedCardsQuality.LOW);Gdx.graphics.requestRendering();
        Gdx.app.log("CursedCards","quality "+quality);
    }
    /** Compile every shader variant at load (cards face up/down, glowing) so the first deal does not hitch. */
    private void warmUp(){
        resize(Gdx.graphics.getWidth(),Gdx.graphics.getHeight());
        for(int i=0;i<cards.size;i++){Card3D c=cards.get(i);deckPose(i,c.pose);if(i%2==0)c.pose.roll=0;if(i%3==0)c.glow(1,.2f,.1f,.5f);c.visible=true;c.sync();}
        activeAmount=targetAmount=1;scene.update(0);renderScene();Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT|GL20.GL_DEPTH_BUFFER_BIT);activeAmount=targetAmount=0;
        for(Card3D c:cards){c.visible=false;c.glow(0,0,0,0);}
    }
    /** True while anything on screen changes; otherwise no frames are drawn until the next input. */
    protected boolean needsFrames(){return presenting()||machine.active()||machine.presence()!=machineTarget||cameraMoving||burning.notEmpty()||fx.active()||hud.animating()
        ||Math.abs(dim-dimTarget)>.001f||verdict||quality.pulse;}

    // ---------------- match flow ----------------
    public boolean presenting(){return !steps.isEmpty()||clock<stepUntil||animator.busy(cards);}
    /** A draw is accepted once every queued rules event has played (a selection lift may still be moving). */
    public boolean awaitingDraw(){return game!=null&&game.phase()==CursedCardsGame.Phase.PLAYING&&steps.isEmpty()&&clock>=stepUntil&&drawer>=0;}
    public int players(){return players;}
    public void setPlayers(int n){if(game!=null&&game.phase()!=CursedCardsGame.Phase.FINISHED&&presenting())return;players=MathUtils.clamp(n,CursedDeck.MIN_PLAYERS,CursedDeck.MAX_PLAYERS);if(game==null||game.phase()==CursedCardsGame.Phase.FINISHED)layoutSeats();}
    /** Nicknames by seat (stable player order); the HUD shows them on the nameplates. */
    public void setNames(String[] names){this.names=names;}

    /** Collect every card, summon the dealer, load the new shuffled deck and deal it through the slot. */
    public void startMatch(){
        if(presenting())return;
        game=CursedCardsGame.create(players,deckRules,random);game.addListener(this);
        layoutSeats();resetCues();
        List<CursedCard> deck=game.deck();
        java.util.Arrays.fill(finalDealt,0);for(int i=0;i<deck.size();i++)finalDealt[i%players]++;
        float collect=collectAll();machineTarget=1;hud.phase("THE DEALER AWAKENS");
        steps.add(()->machine.presence()>=1?0:-1);
        // Values are assigned only after every face is down again.
        enqueue(()->{for(Card3D c:cards){c.visible=false;}tray.clear();
            for(int i=0;i<deck.size();i++){Card3D c=cards.get(deck.get(i).id());c.setValue(faces,CardValue.of(deck.get(i).value()));tray.add(c);}
            for(int i=0;i<tray.size;i++){Card3D c=tray.get(i);animator.stop(c);deckPose(i,c.pose);c.visible=true;c.sync();}
            status="DEALING "+deck.size()+" CARDS TO "+players+" PLAYERS";hud.phase("THE DEAL");machine.activate();return .7f;},collect);
        dealInterval=deck.size()>15?.34f:deck.size()>9?.4f:DEAL_INTERVAL;
        game.start();
    }
    private void resetCues(){drawer=source=loser=selectedSlot=hoverSlot=-1;glowDrawer=glowSource=-1;java.util.Arrays.fill(safe,false);verdict=false;dimTarget=0;deathLight=0;deathCard=null;}
    /** Take the hidden card at {@code slot} of the current source's hand. Values are never consulted here. */
    public boolean drawSlot(int slot){
        if(!awaitingDraw())return false;
        boolean ok=game.draw(new CursedCardsGame.Draw(drawer,source,slot));selectedSlot=hoverSlot=-1;return ok;
    }
    public boolean drawSelected(){return selectedSlot>=0&&drawSlot(selectedSlot);}
    public boolean drawRandom(){if(!awaitingDraw())return false;var d=game.randomDraw();selectedSlot=hoverSlot=-1;return game.draw(d);}
    public void select(int slot){if(!awaitingDraw()||slot<0||slot>=hands.get(source).size)return;selectedSlot=slot==selectedSlot?-1:slot;relayout(source,.18f);}
    private void hover(int slot){if(slot==hoverSlot||!awaitingDraw())return;hoverSlot=slot;relayout(source,.14f);}
    public void resetMatch(){
        steps.clear();stepUntil=clock;game=null;resetCues();
        for(var h:hands)h.clear();discardPile.clear();tray.clear();burning.clear();fx.clear();
        for(Card3D c:cards){animator.stop(c);c.visible=false;c.opacity(1);c.glow(0,0,0,0);c.vanish=0;}
        machine.reset();machineTarget=1;machine.presence(1);hud.phase("");status="";
    }

    private void enqueue(Step s){enqueue(s,0);}
    private void enqueue(Step s,float wait){if(wait>0){float[] until={-1};steps.add(()->{if(until[0]<0)until[0]=clock+wait;return clock>=until[0]?0:-1;});}steps.add(s);}
    private void waitForAnimations(){steps.add(()->animator.busy(cards)||burning.notEmpty()?-1:0);}

    // ---------------- rules events → presentation ----------------
    private boolean dealing;private float dealInterval=DEAL_INTERVAL;
    /** Face up, upright for a viewer at {@code eye}: card bottom (+Z) toward the viewer, tilted {@code tilt} degrees toward them. */
    private static void facing(CardPose p,Vector3 eye,float tilt){p.yaw=MathUtils.atan2Deg360(eye.x-p.position.x,eye.z-p.position.z);p.roll=0;p.pitch=tilt;p.scale=1;}
    /** Seats behind the machine get an arc that clears its top. */
    private float clearance(Vector3 dest){var b=machine.worldBounds();return dest.z<b.max.z&&Math.abs(dest.x-(b.min.x+b.max.x)*.5f)<b.getWidth()*.5f+1.2f?b.max.y+.9f:0;}
    @Override public void dealt(CursedCard card,int player){
        dealing=true;
        enqueue(()->{Card3D c=cards.get(card.id());int index=tray.indexOf(c,true);tray.removeIndex(index);
            for(int i=0;i<tray.size;i++){CardPose p=deckPose(i,new CardPose());tray.get(i).queue.add(CardMotion.to(p,.25f,CardMotion.Ease.SMOOTH).delay(.34f));}
            Array<Card3D> hand=hands.get(player);hand.add(c);
            CardPose dest=handPose(player,hand.size-1,finalDealt[player],new CardPose());
            animator.deal(c,path,dest,0,clearance(dest.position),machine::dispense,()->actions.receiveCard(player));return dealInterval;});
    }
    /** Pairs: lift face up, drift together, glow crimson and burn away in embers. */
    @Override public void pairRemoved(int player,CursedCard a,CursedCard b){
        endDealing();waitForAnimations();
        enqueue(()->{Card3D ca=cards.get(a.id()),cb=cards.get(b.id());var hand=hands.get(player);hand.removeValue(ca,true);hand.removeValue(cb,true);
            SeatLayout.Seat seat=seatList.get(player);float yaw=seat.handYaw;Vector3 mid=new Vector3(seat.hand).mulAdd(seat.normal,-1.3f).add(0,1.1f,0);
            for(int i=0;i<2;i++){Card3D c=i==0?ca:cb;float side=(i==0?-.9f:.9f);
                CardPose up=new CardPose();up.position.set(mid).add(MathUtils.cosDeg(yaw)*side,0,-MathUtils.sinDeg(yaw)*side);facing(up,camera.position,58);up.yaw+=i==0?-8:8;
                c.queue.add(CardMotion.to(up,.55f,CardMotion.Ease.SMOOTH).arc(.25f));
                CardPose meet=new CardPose().set(up);meet.position.set(mid).add(MathUtils.cosDeg(yaw)*side*.18f,.15f,-MathUtils.sinDeg(yaw)*side*.18f);meet.yaw+=i==0?5:-5;
                c.queue.add(CardMotion.to(meet,.45f,CardMotion.Ease.SMOOTH).delay(.45f).onEnd(()->burning.add(c)));
                discardPile.add(c);}
            actions.discardPair(player);relayout(player,.3f);hud.toast("A PAIR OF "+CardValue.of(a.value()).label+" BURNS");status="PAIR OF "+CardValue.of(a.value()).label+" — "+names[player];return .9f;});
    }
    @Override public void turnChanged(int drawer,int source){
        endDealing();waitForAnimations();
        enqueue(()->{this.drawer=drawer;this.source=source;selectedSlot=hoverSlot=-1;glowDrawer=drawer;glowSource=source;
            hud.phase(names[drawer]+" TAKES FROM "+names[source]);status="P"+(drawer+1)+" DRAWS FROM P"+(source+1);
            actions.lookAtCards(drawer);actions.nervous(source);return 0;});
    }
    /** A drawn card lifts out of the fan, travels on a soft arc and settles into the drawer's fan, still face down. */
    @Override public void transferred(CursedCard card,int from,int to){
        enqueue(()->{Card3D c=cards.get(card.id());hands.get(from).removeValue(c,true);Array<Card3D> hand=hands.get(to);hand.add(c);
            hoverSlot=selectedSlot=-1;relayout(from,.25f);
            CardPose lift=new CardPose().set(c.pose);lift.position.y+=.7f;lift.position.mulAdd(seatList.get(from).normal,-.4f);lift.pitch=-8;
            c.queue.add(CardMotion.to(lift,.22f,CardMotion.Ease.DECELERATE));
            CardPose dest=handPose(to,hand.size-1,hand.size,new CardPose());c.queue.add(CardMotion.to(dest,.85f,CardMotion.Ease.SMOOTH).arc(.6f).lift(-12).wobble(7));
            for(int k=0;k<hand.size-1;k++)animator.move(hand.get(k),handPose(to,k,hand.size,new CardPose()),.45f,.35f);
            actions.drawCard(to);actions.receiveCard(to);
            status="P"+(to+1)+" TOOK A CARD FROM P"+(from+1);drawer=source=-1;return 1.1f;});
    }
    @Override public void playerSafe(int player){enqueue(()->{safe[player]=true;hud.toast(names[player]+" IS SAFE");actions.survive(player);return 0;});}
    /** DEATH: a held breath, the room darkens, the card rises into a red glow, turns, and the verdict appears. */
    @Override public void finished(int loser,List<Integer> survivors){
        endDealing();waitForAnimations();
        enqueue(()->{this.loser=loser;drawer=source=-1;glowDrawer=glowSource=-1;deathCard=hands.get(loser).first();hud.phase("");dimTarget=1;status="DEATH";return 1.0f;});
        enqueue(()->{SeatLayout.Seat seat=seatList.get(loser);
            CardPose shown=new CardPose().set(deathCard.pose);shown.position.set(seat.hand).mulAdd(seat.normal,-1.6f).add(0,2.4f,0);facing(shown,camera.position,64);shown.scale=1.55f;
            deathCard.queue.add(CardMotion.to(shown,1.6f,CardMotion.Ease.SMOOTH).arc(.3f).wobble(10));deathLight=.01f;actions.nervous(loser);return 1.7f;});
        enqueue(()->{fx.burst(deathCard.pose.position,70,.9f,.25f);actions.eliminate(loser);for(int p:survivors)actions.survive(p);verdict=true;return 1.2f;});
    }
    private void endDealing(){if(dealing){dealing=false;waitForAnimations();enqueue(()->{machine.shutdown();return .6f;});enqueue(()->{machineTarget=0;hud.phase("THE DEALER DISSOLVES");return 1.3f;});}}

    // ---------------- layout ----------------
    private void computePaths(DealerConfig config){
        var c=config.card;Vector3 exit=machine.worldDirection(config.exitDirection,new Vector3()),slot=machine.worldPoint(config.spawn,new Vector3());
        float exitYaw=MathUtils.atan2Deg360(exit.x,exit.z);
        deckScale=c.deckScale;float inner=c.height*deckScale;
        path.inside.set(tmp.set(slot).mulAdd(exit,-(inner*.5f+.03f)),exitYaw,0,180);path.inside.scale=deckScale;
        path.outside.set(tmp.set(slot).mulAdd(exit,inner*.5f+.05f),exitYaw,0,180);path.outside.scale=deckScale;
        deckOrigin.set(machine.worldPoint(config.deck,new Vector3()));deckTilt=config.deckTilt;deckYaw=config.deckYaw;thickness=c.thickness;cardWidth=c.width;cardHeight=c.height;
        path.feed.set(deckPose(0,new CardPose()));path.feed.position.add(0,MathUtils.sinDeg(deckTilt)*config.feedTravel,-MathUtils.cosDeg(deckTilt)*config.feedTravel);
        CardMotion.halfWidth=c.width*.5f;CardMotion.halfHeight=c.height*.5f;CardAnimator.platformHeight=machine.worldBounds().getHeight()*.4f;
    }
    private void layoutSeats(){seatList=SeatLayout.layout(tableConfig,players);}
    /** Card {@code index} of the loaded deck lying on the top platform, index 0 at the bottom (fed first), backs up. */
    protected CardPose deckPose(int index,CardPose out){
        Vector3 normal=tmp2.set(0,MathUtils.cosDeg(deckTilt),MathUtils.sinDeg(deckTilt));
        float th=thickness*deckScale;out.position.set(deckOrigin).mulAdd(normal,th*.5f+index*th*CardAnimator.THICKNESS_GAP);out.yaw=deckYaw;out.scale=deckScale;
        // Front-to-back tilt is a pitch for a lengthwise deck and a roll for a crosswise one (the card's long axis then runs along X).
        boolean across=Math.abs(deckYaw%180)>45;out.pitch=across?0:deckTilt;out.roll=across?180+deckTilt:180;return out;
    }
    /**
     * Slot {@code k} of {@code n} in a player's fan: cards rotate about a pivot toward the player, so the fan opens like a
     * hand of cards; spacing adapts to the hand size and the seat's width; stacked upward so nothing z-fights.
     */
    protected CardPose handPose(int player,int k,int n,CardPose out){
        SeatLayout.Seat seat=seatList.get(player);float yaw=seat.handYaw,u=k-(n-1)*.5f;
        float spread=Math.max(0,seat.handWidth-cardWidth),gap=n>1?Math.min(cardWidth*.62f,spread/(n-1)):0,radius=4.2f,angle=MathUtils.radDeg*(gap/radius);
        float a=-u*angle;
        // pivot lies toward the player; card centres sit on an arc around it
        float px=seat.hand.x+seat.normal.x*radius,pz=seat.hand.z+seat.normal.z*radius,ca=MathUtils.cosDeg(a),sa=MathUtils.sinDeg(a);
        float ox=-seat.normal.x*radius,oz=-seat.normal.z*radius;
        out.position.set(px+ox*ca-oz*sa,thickness*.5f+k*thickness*CardAnimator.THICKNESS_GAP,pz+ox*sa+oz*ca);
        out.yaw=yaw-a;out.pitch=0;out.roll=180;out.scale=1;
        if(player==source&&k==selectedSlot){out.position.y+=.22f;out.position.mulAdd(seat.normal,-.55f);out.pitch=-7;}
        else if(player==source&&k==hoverSlot){out.position.y+=.08f;out.position.mulAdd(seat.normal,-.22f);}
        return out;
    }
    private void relayout(int player,float duration){var h=hands.get(player);for(int k=0;k<h.size;k++)animator.move(h.get(k),handPose(player,k,h.size,new CardPose()),duration,0);}
    /** Return every visible card to the tray, face down; returns seconds until done. */
    private float collectAll(){
        float end=0;int n=0;Array<Card3D> all=new Array<>();for(var h:hands){all.addAll(h);h.clear();}discardPile.clear();all.addAll(tray);tray.clear();
        for(Card3D c:all){if(!c.visible)continue;c.glow(0,0,0,0);CardPose target=deckPose(n,new CardPose());
            if(!c.pose.faceDown())end=Math.max(end,animator.flip(c,n*.03f));
            end=Math.max(end,animator.returnTo(c,target,n*.06f+(c.pose.faceDown()?0:.75f)));n++;}
        return end;
    }

    // ---------------- frame ----------------
    @Override public void render(){
        float dt=frameDelta()*timeScale;update(dt);
        Gdx.gl.glClearColor(0,0,0,1);Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT|GL20.GL_DEPTH_BUFFER_BIT);
        batch.getProjectionMatrix().setToOrtho2D(0,0,Gdx.graphics.getWidth(),Gdx.graphics.getHeight());
        batch.begin();batch.disableBlending();batch.draw(background,view.x,view.y,view.width,view.height);batch.enableBlending();drawCharacters(batch);batch.end();
        Gdx.gl.glClear(GL20.GL_DEPTH_BUFFER_BIT);
        scene.update(dt);renderScene();
        Gdx.gl.glViewport(0,0,Gdx.graphics.getBackBufferWidth(),Gdx.graphics.getBackBufferHeight());
        batch.begin();fx.draw(batch,camera,view,1-dim*.8f);fillHud();hud.draw(batch,hudFrame,dt);drawOverlay(batch);batch.end();
        if(needsFrames())Gdx.graphics.requestRendering();
    }
    private float smoothDt=1/60f;
    /**
     * Even frame pacing: the raw delta jitters and, after an idle (render-on-demand) gap, would jump an animation forward
     * on its first frame. Gaps restart at one display frame; otherwise the delta is smoothed and clamped.
     */
    private float frameDelta(){
        float raw=Gdx.graphics.getDeltaTime(),frame=1f/Math.max(30,Gdx.graphics.getDisplayMode().refreshRate);
        if(raw>.1f){smoothDt=frame;return frame;}
        smoothDt+=(MathUtils.clamp(raw,frame*.5f,1/30f)-smoothDt)*.2f;return smoothDt;
    }
    /** Layer 2: seated character sprites behind the table edge. No suitable art exists yet; anchors are {@link SeatLayout.Seat#characterAnchor}. */
    protected void drawCharacters(SpriteBatch batch){}
    /** Development overlay hook (drawn above the HUD); empty in production. */
    protected void drawOverlay(SpriteBatch batch){}
    protected void update(float dt){
        clock+=dt;
        while(clock>=stepUntil&&!steps.isEmpty()){float d=steps.peek().run();if(d<0)break;steps.poll();stepUntil=clock+d;}
        animator.update(cards,dt);machine.update(dt);fx.update(dt);hud.update(dt);
        machine.slotLight.position.set(path.outside.position).add(0,.06f,-.25f);
        // burning pairs: crimson glow rises, embers, then gone
        for(int i=burning.size-1;i>=0;i--){Card3D c=burning.get(i);c.vanish+=dt/.55f;c.pose.position.y+=dt*.35f;c.sync();
            c.glow(1,.18f,.08f,Math.min(1.6f,c.vanish*3));
            if(c.vanish>.25f&&c.vanish-dt/.55f<=.25f)fx.burst(c.pose.position,14,.45f,.1f);
            if(c.vanish>=1){c.visible=false;c.opacity(1);c.glow(0,0,0,0);c.vanish=0;burning.removeIndex(i);}else c.opacity(1-c.vanish*c.vanish);}
        cameraMoving=director.update(dt,camera);
        float pr=machine.presence();if(pr!=machineTarget)machine.presence(machineTarget>pr?Math.min(machineTarget,pr+dt/.7f):Math.max(machineTarget,pr-dt/1.2f));
        activeAmount=approach(activeAmount,awaitingDraw()&&glowDrawer>=0?1:0,dt*2.5f);targetAmount=approach(targetAmount,awaitingDraw()&&glowSource>=0?1:0,dt*2.5f);
        dim=approach(dim,dimTarget,dt*(dimTarget>dim?.9f:2));
        // DEATH light: a red glow that swells under the rising card (replaces the vanished machine's slot light).
        if(deathCard!=null&&deathLight>0){deathLight=Math.min(1,deathLight+dt*.8f);float flick=.85f+.15f*MathUtils.sin(clock*17)*MathUtils.sin(clock*7.3f);
            machine.slotLight.position.set(deathCard.pose.position).add(0,-.6f,.9f);machine.slotLight.color.set(1,.12f,.06f,1);machine.slotLight.intensity=deathLight*1.6f*flick;
            deathCard.glow(1,.15f,.08f,deathLight*.35f*flick);}
        else machine.slotLight.color.set(1,.16f,.08f,1);
    }
    private static float approach(float v,float t,float step){return v<t?Math.min(t,v+step):Math.max(t,v-step);}
    private void fillHud(){
        var f=hudFrame;f.view=view;f.players=seatList.size;f.names=names;f.drawer=awaitingDraw()?drawer:-1;f.source=awaitingDraw()?source:-1;f.loser=verdict||dim>.5f?loser:-1;f.verdict=verdict;f.dim=dim;
        for(int i=0;i<seatList.size;i++){tmp.set(seatList.get(i).plate);camera.project(tmp,view.x,view.y,view.width,view.height);f.plates[i].set(tmp.x,tmp.y);f.safe[i]=safe[i];}
        if(deathCard!=null){tmp.set(deathCard.pose.position);camera.project(tmp,view.x,view.y,view.width,view.height);f.spotlight.set(tmp.x,tmp.y);}
    }
    /** Felt-level quads: machine and card contact shadows, turn glows. */
    private void feltRenderables(Array<Renderable> out,Pool<Renderable> pool){
        if(machine.visible()){opacity(machineShadow,machine.presence()*.9f);machineShadow.getRenderables(out,pool);}
        if(activeAmount>0&&glowDrawer>=0){placeGlow(activeGlow,glowDrawer,activeAmount*(.4f+.1f*MathUtils.sin(clock*2.6f)));activeGlow.getRenderables(out,pool);}
        if(targetAmount>0&&glowSource>=0){placeGlow(targetGlow,glowSource,targetAmount*.22f);targetGlow.getRenderables(out,pool);}
    }
    private void placeGlow(ModelInstance g,int seat,float a){var st=seatList.get(seat);int n=Math.max(1,hands.get(seat).size);float w=Math.min(st.handWidth,cardWidth+(n-1)*cardWidth*.62f)+1.4f;
        g.transform.setToTranslation(st.hand.x,.002f,st.hand.z).rotate(Vector3.Y,st.handYaw).scale(w*1.15f,1,cardHeight*1.9f);opacity(g,a);}
    private static void opacity(ModelInstance m,float a){((BlendingAttribute)m.materials.first().get(BlendingAttribute.Type)).opacity=a;}
    private void cardRenderables(Array<Renderable> out,Pool<Renderable> pool){
        for(int i=0;i<cards.size;i++){Card3D c=cards.get(i);if(!c.visible)continue;var p=c.pose.position;if(!camera.frustum.sphereInFrustum(p.x,p.y,p.z,1.2f))continue;c.instance.getRenderables(out,pool);
            // Soft shadow on the felt, fading and spreading as the card rises; none on the machine platform.
            if(p.y<1.6f&&c.pose.scale>.9f){float lift=MathUtils.clamp(p.y/1.6f,0,1),k=1+lift*.7f;var sh=cardShadows[i];
                sh.transform.setToTranslation(p.x+.06f+lift*.35f,.003f,p.z+.08f+lift*.3f).rotate(Vector3.Y,c.pose.yaw).scale(cardWidth*1.22f*k,1,cardHeight*1.16f*k);
                opacity(sh,(1-lift)*.95f*(1-c.vanish));sh.getRenderables(out,pool);}}
    }
    /** 3D layer in the letterbox; MEDIUM/LOW render it at reduced resolution and upscale it. */
    private void renderScene(){
        PBRCommon.enableSeamlessCubemaps();
        if(lowRes!=null){lowRes.begin();Gdx.gl.glClearColor(0,0,0,0);Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT|GL20.GL_DEPTH_BUFFER_BIT);}else viewport3d();
        scene.renderColors();
        if(lowRes==null)return;
        lowRes.end();
        batch.getProjectionMatrix().setToOrtho2D(0,0,Gdx.graphics.getWidth(),Gdx.graphics.getHeight());batch.begin();batch.setBlendFunction(GL20.GL_ONE,GL20.GL_ONE_MINUS_SRC_ALPHA);
        batch.draw(lowRes.getColorBufferTexture(),view.x,view.y,view.width,view.height,0,0,lowW,lowH,false,true);batch.end();batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);
    }
    /** GL viewport = letterbox, in back-buffer pixels. */
    private void viewport3d(){float k=Gdx.graphics.getBackBufferWidth()/(float)Gdx.graphics.getWidth();Gdx.gl.glViewport(Math.round(view.x*k),Math.round(view.y*k),Math.round(view.width*k),Math.round(view.height*k));}
    private void resizeLowRes(int w,int h){if(lowRes!=null){lowRes.dispose();lowRes=null;}if(quality.renderScale>=1||w<=0||h<=0)return;
        lowW=Math.max(1,Math.round(w*quality.renderScale));lowH=Math.max(1,Math.round(h*quality.renderScale));lowRes=new FrameBuffer(Pixmap.Format.RGBA8888,lowW,lowH,true);
        lowRes.getColorBufferTexture().setFilter(Texture.TextureFilter.Linear,Texture.TextureFilter.Linear);}

    /** Slot of the current source's hand under the cursor (the only cards a drawer may pick). */
    protected int pickSourceSlot(int sx,int sy){
        if(source<0)return -1;Ray ray=camera.getPickRay(sx,sy,view.x,view.y,view.width,view.height);int best=-1;float bestT=Float.MAX_VALUE;var h=hands.get(source);
        for(int k=h.size-1;k>=0;k--){inv.set(h.get(k).instance.transform).inv();Vector3 o=tmp.set(ray.origin).mul(inv),d=tmp2.set(ray.direction).rot(inv);
            if(Math.abs(d.y)<1e-6f)continue;float t=-o.y/d.y;if(t<0||t>=bestT)continue;float x=o.x+d.x*t,z=o.z+d.z*t;
            if(Math.abs(x)<=cardWidth*.5f&&Math.abs(z)<=CardMotion.halfHeight){bestT=t;best=k;}}
        return best;
    }
    protected InputAdapter input(){return new InputAdapter(){
        @Override public boolean touchDown(int x,int y,int pointer,int button){
            if(button==Input.Buttons.LEFT&&awaitingDraw()){int slot=pickSourceSlot(x,y);if(slot>=0){if(slot==selectedSlot)drawSelected();else select(slot);return true;}}
            return false;}
        @Override public boolean mouseMoved(int x,int y){if(awaitingDraw())hover(pickSourceSlot(x,y));return false;}
    };}
    @Override public void resize(int width,int height){
        float aspect=tableConfig.camera.aspect>0?tableConfig.camera.aspect:width/(float)height,w=width,h=width/aspect;if(h>height){h=height;w=height*aspect;}
        view.set((width-w)*.5f,(height-h)*.5f,w,h);camera.viewportWidth=w;camera.viewportHeight=h;camera.update();scene.updateViewport(w,h);
        float k=Gdx.graphics.getBackBufferWidth()/(float)width;resizeLowRes(Math.round(w*k),Math.round(h*k));}

    // ---------------- scene construction ----------------
    /** Lights matched to the painting: warm candle key from the left, cool moonlight rim from the windows, warm fill above. */
    private void buildLights(){
        key=new DirectionalLightEx();key.set(new Color(1,.80f,.60f,1),new Vector3(.45f,-1,-.35f).nor(),2.6f);scene.environment.add(key);
        if(quality!=CursedCardsQuality.LOW){var moon=new DirectionalLightEx();moon.set(new Color(.55f,.66f,1,1),new Vector3(-.15f,-.45f,1).nor(),1.3f);scene.environment.add(moon);}
        if(quality.pointLights>1){warm.set(new Color(1,.68f,.42f,1),new Vector3(0,6,3.5f),70f,40f);scene.environment.add(warm);}
        var builder=IBLBuilder.createIndoor(key);builder.nearGroundColor.set(.22f,.06f,.05f,1);builder.farGroundColor.set(.06f,.02f,.02f,1);builder.nearSkyColor.set(.38f,.26f,.22f,1);builder.farSkyColor.set(.12f,.12f,.2f,1);
        try{diffuse=builder.buildIrradianceMap(quality.irradiance);specular=builder.buildRadianceMap(quality==CursedCardsQuality.LOW?5:7);}finally{builder.dispose();}
        brdf=new Texture(Gdx.files.classpath("net/mgsx/gltf/shaders/brdfLUT.png"));
        scene.setAmbientLight(.22f);
        scene.environment.set(PBRCubemapAttribute.createDiffuseEnv(diffuse));scene.environment.set(PBRCubemapAttribute.createSpecularEnv(specular));
        scene.environment.set(new PBRTextureAttribute(PBRTextureAttribute.BRDFLUTTexture,brdf));
        background=loadBackground();
    }
    /** One shared soft quad: card/machine contact shadows (darkening) and the gold/crimson hand glows (additive). */
    private void buildQuads(){
        int n=128;Pixmap p=new Pixmap(n,n,Pixmap.Format.RGBA8888);
        for(int y=0;y<n;y++)for(int x=0;x<n;x++){float dx=(x+.5f)/n*2-1,dy=(y+.5f)/n*2-1,r=(float)Math.sqrt(dx*dx+dy*dy),a=MathUtils.clamp(1-r,0,1);p.drawPixel(x,y,Color.rgba8888(1,1,1,a*a*(3-2*a)));}
        blob=new Texture(p);blob.setFilter(Texture.TextureFilter.Linear,Texture.TextureFilter.Linear);p.dispose();
        var mb=new ModelBuilder();mb.begin();
        mb.part("quad",GL20.GL_TRIANGLES,VertexAttributes.Usage.Position|VertexAttributes.Usage.Normal|VertexAttributes.Usage.TextureCoordinates,new Material()).rect(-.5f,0,.5f, .5f,0,.5f, .5f,0,-.5f, -.5f,0,-.5f, 0,1,0);
        quadModel=mb.end();
        for(int i=0;i<cardShadows.length;i++)cardShadows[i]=shadowQuad();
        machineShadow=shadowQuad();
        activeGlow=glowQuad(new Color(1,.74f,.36f,1));targetGlow=glowQuad(new Color(.9f,.16f,.1f,1));
        placeMachineShadow();
    }
    private ModelInstance shadowQuad(){var m=new ModelInstance(quadModel);m.materials.first().set(PBRColorAttribute.createBaseColorFactor(new Color(.02f,0,0,1)),PBRTextureAttribute.createBaseColorTexture(blob),
        new BlendingAttribute(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA,1),new DepthTestAttribute(GL20.GL_LEQUAL,false));return m;}
    private ModelInstance glowQuad(Color c){var m=new ModelInstance(quadModel);m.materials.first().set(PBRColorAttribute.createBaseColorFactor(Color.BLACK),PBRTextureAttribute.createEmissiveTexture(blob),
        com.badlogic.gdx.graphics.g3d.attributes.ColorAttribute.createEmissive(c),new BlendingAttribute(GL20.GL_SRC_ALPHA,GL20.GL_ONE,1),new DepthTestAttribute(GL20.GL_LEQUAL,false));return m;}
    /** Place the dealer's contact shadow once its bounds are known. */
    private void placeMachineShadow(){var b=machine.worldBounds();machineShadow.transform.setToTranslation((b.min.x+b.max.x)*.5f,.004f,(b.min.z+b.max.z)*.5f+.2f).scale(b.getWidth()*1.4f,1,b.getDepth()*1.5f);}
    /** The painted hall and table backdrop; downsampled on weak devices. Falls back to a dark fill. */
    private Texture loadBackground(){
        var f=Gdx.files.internal(BACKGROUND);
        if(!f.exists()){Gdx.app.error("CursedCards","missing assets/"+BACKGROUND);Pixmap p=new Pixmap(4,4,Pixmap.Format.RGBA8888);p.setColor(.03f,.02f,.025f,1);p.fill();var t=new Texture(p);p.dispose();return t;}
        Pixmap p=new Pixmap(f);int max=quality==CursedCardsQuality.LOW?1024:quality==CursedCardsQuality.MEDIUM?1440:4096;
        if(p.getWidth()>max){int w=max,h=Math.round(p.getHeight()*(max/(float)p.getWidth()));Pixmap s=new Pixmap(w,h,Pixmap.Format.RGB888);s.setFilter(Pixmap.Filter.BiLinear);s.drawPixmap(p,0,0,p.getWidth(),p.getHeight(),0,0,w,h);p.dispose();p=s;}
        var t=new Texture(p);t.setFilter(Texture.TextureFilter.Linear,Texture.TextureFilter.Linear);p.dispose();return t;
    }
    @Override public void dispose(){
        scene.dispose();machine.dispose();faces.dispose();cardModel.dispose();quadModel.dispose();blob.dispose();if(lowRes!=null)lowRes.dispose();
        diffuse.dispose();specular.dispose();brdf.dispose();background.dispose();batch.dispose();hud.dispose();fx.dispose();
    }
}
