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
    public static final String BACKGROUND="cursed_cards/background.jpg";
    private static final float DEAL_INTERVAL=.5f;
    /** Fan pitch as a fraction of card width: cards overlap by about a fifth, so each stays readable without sprawling. */
    private static final float FAN_SPACING=.8f;

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
    private DirectionalLightEx key,moon;private final PointLightEx warm=new PointLightEx();
    protected SpriteBatch batch;
    protected CursedHud hud;protected final CursedHud.Frame hudFrame=new CursedHud.Frame();
    protected TableFx fx;protected BackdropFx backdrop;
    /** Seated FINAL ANSWER characters (layer 2) and the painted table's silhouette mask that sits them behind it. */
    protected TableCast cast;private Texture tableFront;
    protected DeathCinematic cine;protected TableAudio audio;private float sceneFade=1,throb,nextThrob=9;private ModelInstance redThrob;
    /** Letterbox before cinematic zoom/shake. */
    private final Rectangle baseView=new Rectangle();
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
    private final Vector3 deckOrigin=new Vector3(),slotPoint=new Vector3();
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
        tableConfig=TableConfig.load();tableConfig.cardHalfHeight=config.card.height*.5f;
        camera=new PerspectiveCamera(tableConfig.camera.fov,Gdx.graphics.getWidth(),Gdx.graphics.getHeight());camera.near=.2f;camera.far=140;director=new CameraDirector(tableConfig.camera);
        PBRShaderConfig shader=PBRShaderProvider.createDefaultConfig();shader.numBones=0;shader.numDirectionalLights=quality==CursedCardsQuality.LOW?1:2;shader.numPointLights=quality.pointLights;shader.numSpotLights=0;
        DepthShader.Config depth=PBRShaderProvider.createDefaultDepthConfig();depth.numBones=0;
        scene=new SceneManager(new PBRShaderProvider(shader){@Override protected com.badlogic.gdx.graphics.g3d.Shader createShader(Renderable r){if(PROFILE&&warmed){StringBuilder b=new StringBuilder();for(var at:r.material)b.append(com.badlogic.gdx.graphics.g3d.Attribute.getAttributeAlias(at.type)).append(' ');StringBuilder e=new StringBuilder();for(var at:r.environment)e.append(com.badlogic.gdx.graphics.g3d.Attribute.getAttributeAlias(at.type)).append(' ');System.out.println((warmed?"RUNTIME ":"WARM ")+r.material.id+" mask="+Long.toHexString(r.material.getMask())+" env="+Long.toHexString(r.environment.getMask())+" ["+b+"] env["+e+"]");}return super.createShader(r);}},new PBRDepthShaderProvider(depth));scene.setCamera(camera);
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
        batch=new SpriteBatch();hud=new CursedHud();fx=new TableFx();backdrop=new BackdropFx(tableConfig.backdrop.moonU,tableConfig.backdrop.moonV);
        director.main();director.snap();
        Gdx.input.setInputProcessor(input());
        warmUp();
        cast=new TableCast(tableConfig.character.height,fx.dot());actions=cast;cast.seat(players);tableFront=tableSilhouette();
        audio=new TableAudio(tableConfig.audio);
        cine=new DeathCinematic(tableConfig.death);var cineSound=cine.sounds;cine.sounds=new DeathCinematic.SoundHook(){public void play(String e,float v){cineSound.play(e,v);}public void musicDuck(float v){audio.duck(v);}};cine.onResults=(l,alive)->{hud.toast("");if(resultListener!=null)resultListener.results(l,alive);};
        warmUp2d();warmed=true;
        // Every display frame is rendered: the backdrop is alive and motion stays perfectly even (the scene costs ~2–4 ms).
        Gdx.graphics.setContinuousRendering(true);
        Gdx.app.log("CursedCards","quality "+quality);
    }
    /** Compile every shader variant at load (cards face up/down, glowing) so the first deal does not hitch. */
    /**
     * Compile every shader/material variant the match will use, so no frame stalls on a first appearance: cards on the
     * felt (with contact shadows), face up and down, glowing, fading, burning (glow + fade), the hand glows, the dealer
     * while dissolving, the red throb; then the 2D layers once (backdrop shader, characters, HUD fonts, particles).
     */
    private void warmUp(){
        // place the fixed camera first: frustum culling would otherwise skip some warm-up cards
        resize(Gdx.graphics.getWidth(),Gdx.graphics.getHeight());director.update(0,camera);
        for(int i=0;i<cards.size;i++){Card3D c=cards.get(i);
            if(i<seatList.size*2)handPose(i%seatList.size,i/seatList.size,2,c.pose);else deckPose(i,c.pose);
            c.setValue(faces,CardValue.values()[i%CardValue.values().length]);if(i%2==0||i<CardValue.values().length)c.pose.roll=0;int k=i%5;if(k==1)c.glow(1,.2f,.1f,.5f);if(k==2)c.opacity(.5f);if(k==3){c.glow(1,.2f,.1f,.5f);c.opacity(.6f);}c.visible=true;c.sync();}
        glowDrawer=0;glowSource=Math.min(1,seatList.size-1);activeAmount=targetAmount=1;throb=1;
        for(float presence:new float[]{1,.5f}){machine.presence(presence);scene.update(0);renderScene();}
        Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT|GL20.GL_DEPTH_BUFFER_BIT);
        machine.presence(1);activeAmount=targetAmount=0;throb=0;glowDrawer=glowSource=-1;
        for(Card3D c:cards){c.visible=false;c.glow(0,0,0,0);c.opacity(1);c.setValue(faces,CardValue.DEATH);}
    }
    /** 2D warm-up once everything exists: backdrop (both passes), characters, particles and every HUD font. */
    private void warmUp2d(){
        tmp.set(0,0,0);fx.burst(tmp,4,.1f,.5f);fx.smoke(tmp,2);fx.puff(tmp);fx.update(.01f);
        hud.phase("WARM");hud.toast("WARM");var f=hudFrame;fillHud();f.verdict=true;f.loser=0;f.drawer=0;f.timer=.5f;f.flash=.1f;f.dim=.1f;
        batch.getProjectionMatrix().setToOrtho2D(0,0,Gdx.graphics.getWidth(),Gdx.graphics.getHeight());
        batch.begin();backdrop.draw(batch,background,view.x,view.y,view.width,view.height);if(cast!=null){cast.layout(seatList,camera,view,0,0);cast.draw(batch);}
        if(tableFront!=null)backdrop.draw(batch,background,tableFront,view.x,view.y,view.width,view.height);fx.draw(batch,camera,view,1);hud.draw(batch,f,0);batch.end();
        Gdx.gl.glFinish();Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT|GL20.GL_DEPTH_BUFFER_BIT);
        fx.clear();hud.phase("");hud.toast("");f.verdict=false;f.loser=-1;
    }
    /** True while anything on screen changes; otherwise no frames are drawn until the next input. */
    protected boolean needsFrames(){return presenting()||machine.active()||machine.presence()!=machineTarget||cameraMoving||burning.notEmpty()||fx.active()||hud.animating()
        ||Math.abs(dim-dimTarget)>.001f||verdict||quality.pulse||cine!=null&&cine.active();}

    // ---------------- match flow ----------------
    public boolean presenting(){return !steps.isEmpty()||clock<stepUntil||animator.busy(cards)||cine!=null&&cine.running();}
    /** A draw is accepted once every queued rules event has played (a selection lift may still be moving). */
    public boolean awaitingDraw(){return network?steps.isEmpty()&&clock>=stepUntil&&drawer>=0&&loser<0:game!=null&&game.phase()==CursedCardsGame.Phase.PLAYING&&steps.isEmpty()&&clock>=stepUntil&&drawer>=0;}

    // ---------------- networked presentation (server-authoritative; this screen only shows) ----------------
    /** True when a server session drives the table: no local rules, no local draws, the server's clock times turns. */
    protected boolean network;
    private int netDeck;private long netTurnStart,netTurnDeadline,netOffset;
    /** Prepare a server match: seat count, nicknames and deck size; values stay unknown until cards are revealed publicly. */
    public void startNetworkMatch(int seats,String[] names,int deckSize){
        network=true;game=null;players=seats;setNames(names);netDeck=deckSize;
        layoutSeats();resetCues();for(var h:hands)h.clear();discardPile.clear();tray.clear();burning.clear();
        java.util.Arrays.fill(finalDealt,0);
        float collect=collectAll();machineTarget=1;hud.phase("THE DEALER AWAKENS");
        steps.add(()->machine.presence()>=1?0:-1);
        enqueue(()->{for(Card3D c:cards)c.visible=false;tray.clear();
            for(int i=0;i<deckSize;i++){Card3D c=cards.get(dealOrder[i]);c.setValue(faces,CardValue.ONE);tray.add(c);}
            for(int i=0;i<tray.size;i++){Card3D c=tray.get(i);animator.stop(c);deckPose(i,c.pose);c.visible=true;c.sync();}
            hud.phase("THE DEAL");dealShowing=true;machine.activate();machine.sound("shuffle",.5f);return .45f;},collect);
        dealInterval=deckSize>15?.34f:deckSize>9?.4f:DEAL_INTERVAL;
    }
    private final int[] dealOrder=new int[MAX_CARDS];
    /** Deal order (card ids in the order the server dealt them) and final hand sizes; call before the first dealt event. */
    public void networkDealOrder(int[] cardIds,int[] seatOf){for(int i=0;i<cardIds.length;i++){dealOrder[i]=cardIds[i];finalDealt[seatOf[i]]++;}}
    /** The publicly revealed value of a card (a discarded pair or the final DEATH). */
    public void networkReveal(int cardId,int value){cards.get(cardId).setValue(faces,CardValue.of(value));}
    /** Server turn clock for the HUD bar (server-time millis plus this machine's offset). */
    public void networkTurnClock(long readyAt,long deadline,long serverNowMinusLocal){netTurnStart=readyAt;netTurnDeadline=deadline;netOffset=serverNowMinusLocal;}
    /** Audience curse: shown during the vote and on the cursed character during the deal; never who holds DEATH. */
    public void networkCurseVote(boolean open,long endsAt){if(open)hud.phase("THE AUDIENCE CHOOSES A CURSE");}
    public void networkCursed(int seat){if(seat<0)return;hud.toast("THE AUDIENCE CURSES "+names[seat%names.length]);if(cast!=null)cast.curse(seat);}
    public int players(){return players;}
    /** Read-only views for checks and adapters. */
    public int loserSeat(){return loser;}
    public int handSize(int seat){return hands.get(seat).size;}
    public Card3D handCard(int seat,int k){return hands.get(seat).get(k);}
    public void setPlayers(int n){if(game!=null&&game.phase()!=CursedCardsGame.Phase.FINISHED&&presenting())return;players=MathUtils.clamp(n,CursedDeck.MIN_PLAYERS,CursedDeck.MAX_PLAYERS);if(game==null||game.phase()==CursedCardsGame.Phase.FINISHED)layoutSeats();}
    /** Nicknames by seat (stable player order); the HUD shows them on the nameplates. */
    public void setNames(String[] names){this.names=names;}

    /** Collect every card, summon the dealer, load the new shuffled deck and deal it through the slot. */
    public void startMatch(){
        if(presenting())return;network=false;
        // THE CURSED CARDS is 4–8 active players only (spectators never get a seat or cards).
        if(players<CursedDeck.MIN_PLAYERS||players>CursedDeck.MAX_PLAYERS){hud.toast("4–8 PLAYERS REQUIRED");return;}
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
            status="DEALING "+deck.size()+" CARDS TO "+players+" PLAYERS";hud.phase("THE DEAL");dealShowing=true;machine.activate();machine.sound("shuffle",.5f);return .45f;},collect);
        dealInterval=deck.size()>15?.34f:deck.size()>9?.4f:DEAL_INTERVAL;
        game.start();
    }
    private void resetCues(){dealShowing=false;if(cast!=null)cast.seat(players);if(cine!=null)cine.cancel();zoom=zoomTarget=1;shake=redFlash=0;revealed=eliminationShown=false;drawer=source=loser=selectedSlot=hoverSlot=-1;glowDrawer=glowSource=-1;java.util.Arrays.fill(safe,false);verdict=false;dimTarget=0;deathLight=0;deathCard=null;}
    /** Take the hidden card at {@code slot} of the current source's hand. Values are never consulted here. */
    public boolean drawSlot(int slot){
        if(network||!awaitingDraw())return false;
        boolean ok=game.draw(new CursedCardsGame.Draw(drawer,source,slot));selectedSlot=hoverSlot=-1;return ok;
    }
    public boolean drawSelected(){return selectedSlot>=0&&drawSlot(selectedSlot);}
    public boolean drawRandom(){if(network||!awaitingDraw())return false;var d=game.randomDraw();selectedSlot=hoverSlot=-1;return game.draw(d);}
    public void select(int slot){if(!awaitingDraw()||slot<0||slot>=hands.get(source).size)return;selectedSlot=slot==selectedSlot?-1:slot;relayout(source,.18f);audio.play("select",.4f);}
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
            animator.deal(c,path,dest,0,clearance(dest.position),machine::dispense,()->{actions.receiveCard(player);machine.sound("land",.35f);fx.puff(dest.position);});return dealInterval;});
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
        enqueue(()->{this.drawer=drawer;this.source=source;selectedSlot=hoverSlot=-1;glowDrawer=drawer;glowSource=source;turnClock=0;turnAge=0;actions.becomeActive(drawer);audio.play("turn",.4f);
            hud.phase(names[drawer]+" TAKES FROM "+names[source]);status="P"+(drawer+1)+" DRAWS FROM P"+(source+1);
            actions.lookAtCards(drawer);actions.nervous(source);return 0;});
    }
    /** A drawn card lifts out of the fan, travels on a soft arc and settles into the drawer's fan, still face down. */
    @Override public void transferred(CursedCard card,int from,int to){
        enqueue(()->{Card3D c=cards.get(card.id());hands.get(from).removeValue(c,true);Array<Card3D> hand=hands.get(to);hand.add(c);
            hoverSlot=selectedSlot=-1;relayout(from,.25f);
            CardPose lift=new CardPose().set(c.pose);lift.position.y+=.7f;lift.position.mulAdd(seatList.get(from).normal,-.4f);lift.pitch=-8;
            c.queue.add(CardMotion.to(lift,.22f,CardMotion.Ease.DECELERATE).onStart(()->audio.play("pickup",.5f)));
            CardPose dest=handPose(to,hand.size-1,hand.size,new CardPose());c.queue.add(CardMotion.to(dest,.72f,CardMotion.Ease.SMOOTH).arc(.6f).lift(-12).wobble(7).flex(6).onStart(()->audio.play("exchange",.5f)).onEnd(()->{audio.play("place",.45f);fx.puff(dest.position);}));
            for(int k=0;k<hand.size-1;k++)animator.move(hand.get(k),handPose(to,k,hand.size,new CardPose()),.45f,.35f);
            actions.drawCard(to);actions.receiveCard(to);actions.loseCard(from);
            status="P"+(to+1)+" TOOK A CARD FROM P"+(from+1);drawer=source=-1;return .85f;});
    }
    @Override public void playerSafe(int player){enqueue(()->{safe[player]=true;hud.toast(names[player]+" IS SAFE");actions.survive(player);return 0;});}
    /** DEATH: the rules have decided; the cinematic only presents it (see {@link #driveCinematic}). */
    @Override public void finished(int loser,List<Integer> survivors){
        endDealing();waitForAnimations();
        enqueue(()->{this.loser=loser;drawer=source=-1;glowDrawer=glowSource=-1;deathCard=hands.get(loser).first();deathStart.set(deathCard.pose);hud.phase("");status="DEATH";
            int[] alive=new int[survivors.size()];for(int i=0;i<alive.length;i++)alive[i]=survivors.get(i);cine.start(loser,alive);return 0;});
    }
    /** Optional hand-off to the mini-game result system (fired once per match, also when skipped). */
    public DeathCinematic.ResultListener resultListener;
    /** Skip the DEATH cinematic (when the host allows it): audio stops, visuals snap to the final state, results fire once. */
    public void skipCinematic(){
        if(cine==null||!cine.running())return;cine.skip();
        CardPose shown=deathFinalPose(new CardPose());deathCard.queue.clear();deathCard.pose.set(shown);deathCard.sync();
        if(!eliminationShown){eliminationShown=true;actions.eliminate(loser);if(cast!=null)cast.doom(loser);for(int p=0;p<players;p++)if(p!=loser)actions.survive(p);}
        dimTarget=0;dim=Math.min(dim,.3f);zoom=1;shake=0;redFlash=0;deathLight=1;verdict=true;
    }
    private final Vector3 focus=new Vector3();private float bars;
    /** True while the deal is on screen (the rules' dealing flag ends as soon as events are queued). */
    private boolean dealShowing;
    private final CardPose deathStart=new CardPose();private float zoom=1,zoomTarget=1,shake,redFlash;private boolean revealed,eliminationShown;
    private final Vector3 deathCentre=new Vector3(0,2.9f,1.8f);
    /** Final reveal pose: face up at the centre, upright toward the camera, enlarged. */
    private CardPose deathFinalPose(CardPose out){out.position.set(deathCentre);facing(out,camera.position,58);out.scale=1.75f;return out;}
    /** Five phases, screen-space only (static backdrop): dim + focus vignette, slow rise and turn, flip with red flash, shake and slight zoom, the loser's reaction, then the results. */
    private void driveCinematic(float dt){
        var ph=cine.phase();float p=cine.progress();
        if(cine.entered(DeathCinematic.Phase.SILENCE)){dimTarget=.45f;revealed=eliminationShown=false;cine.sound("suspense",.7f);if(cine.sounds!=null)cine.sounds.musicDuck(.3f);
            for(Card3D c:cards)if(c!=deathCard)animator.stop(c);}
        if(cine.entered(DeathCinematic.Phase.LAST_CARD)){cine.sound("cardMove",.6f);deathLight=.01f;dimTarget=.75f;}
        if(ph==DeathCinematic.Phase.LAST_CARD){float e=p*p*(3-2*p);CardPose fin=deathFinalPose(tmpPose);
            deathCard.pose.position.set(deathStart.position).lerp(deathCentre,e);deathCard.pose.position.y+=MathUtils.sin(e*MathUtils.PI)*.8f;
            deathCard.pose.yaw=MathUtils.lerp(deathStart.yaw,fin.yaw-300,e)+300*e*e;deathCard.pose.pitch=fin.pitch*e;deathCard.pose.roll=180;deathCard.pose.scale=MathUtils.lerp(1,fin.scale,e);deathCard.sync();}
        if(cine.entered(DeathCinematic.Phase.REVEAL))cine.sound("cardFlip",.75f);
        if(ph==DeathCinematic.Phase.REVEAL){float f=Math.min(1,p/.45f),e=f*f*(3-2*f);CardPose fin=deathFinalPose(tmpPose);
            deathCard.pose.set(fin);deathCard.pose.roll=180*(1-e);deathCard.pose.position.y+=MathUtils.sin(e*MathUtils.PI)*.35f;deathCard.sync();
            if(f>=1&&!revealed){revealed=true;redFlash=1;shake=1;slowMo=.25f;zoomTarget=1.06f;fx.burst(deathCentre,90,1.1f,.2f);cine.sound("deathReveal",.85f);}}
        if(cine.entered(DeathCinematic.Phase.ELIMINATION)&&!eliminationShown){eliminationShown=true;actions.eliminate(loser);if(cast!=null)cast.doom(loser);cine.sound("reaction",.6f);
            tmp.set(seatList.get(loser).characterAnchor).add(0,1.4f,0);fx.burst(tmp,40,1.2f,.05f);fx.smoke(tmp,8);}
        if(ph==DeathCinematic.Phase.ELIMINATION&&p>.45f)for(int q=0;q<players;q++)if(q!=loser&&cast!=null&&cast.state(q)!=TableCast.State.IDLE)actions.survive(q);
        if(cine.entered(DeathCinematic.Phase.RESULTS)){dimTarget=0;zoomTarget=1;verdict=true;cine.sound("results",.5f);if(cine.sounds!=null)cine.sounds.musicDuck(1);}
        redFlash=Math.max(0,redFlash-dt*3.6f);shake=Math.max(0,shake-dt*2.2f);
    }
    private final CardPose tmpPose=new CardPose();private float throbAge=99;
    /** Seconds the current drawer has been deciding; timeout takes a random hidden card for them. */
    protected float turnClock,turnAge=99;protected int turnTimeouts;
    private void endDealing(){if(dealing){dealing=false;waitForAnimations();enqueue(()->{machine.shutdown();dealShowing=false;return .6f;});enqueue(()->{machineTarget=0;hud.phase("THE DEALER DISSOLVES");return 1.3f;});}}
    /** True once the dealer has been dismissed for play (it may still be fading out). */
    public boolean dealerDismissed(){return machineTarget==0;}

    // ---------------- layout ----------------
    private void computePaths(DealerConfig config){
        var c=config.card;Vector3 exit=machine.worldDirection(config.exitDirection,new Vector3()),slot=machine.worldPoint(config.spawn,new Vector3());
        float exitYaw=MathUtils.atan2Deg360(exit.x,exit.z);
        deckScale=c.deckScale;float inner=c.height*deckScale;
        path.inside.set(tmp.set(slot).mulAdd(exit,-(inner*.5f+.03f)),exitYaw,0,180);path.inside.scale=deckScale;
        path.outside.set(tmp.set(slot).mulAdd(exit,inner*.5f+.05f),exitYaw,0,180);path.outside.scale=deckScale;
        deckOrigin.set(machine.worldPoint(config.deck,new Vector3()));deckTilt=config.deckTilt;deckYaw=config.deckYaw;thickness=c.thickness;cardWidth=c.width;cardHeight=c.height;
        path.feed.set(deckPose(0,new CardPose()));path.feed.position.add(0,MathUtils.sinDeg(deckTilt)*config.feedTravel,-MathUtils.cosDeg(deckTilt)*config.feedTravel);
        CardMotion.halfWidth=c.width*.5f;CardMotion.halfHeight=c.height*.5f;CardAnimator.platformHeight=machine.worldBounds().getHeight()*.4f;CardAnimator.timing=config.timing;
        slotPoint.set(slot).add(0,.15f,.25f);
    }
    private void layoutSeats(){seatList=SeatLayout.layout(tableConfig,players);if(cast!=null)cast.seat(players);}
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
        float spread=Math.max(0,seat.handWidth-cardWidth),gap=n>1?Math.min(cardWidth*FAN_SPACING,spread/(n-1)):0,radius=5.5f,angle=MathUtils.radDeg*(gap/radius);
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
        long p0=System.nanoTime();float raw=frameDelta();slowMo=approach(slowMo,1,raw*1.4f);float dt=raw*timeScale*slowMo;realClock+=raw;update(dt);long p1=System.nanoTime();
        Gdx.gl.glClearColor(0,0,0,1);Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT|GL20.GL_DEPTH_BUFFER_BIT);
        batch.getProjectionMatrix().setToOrtho2D(0,0,Gdx.graphics.getWidth(),Gdx.graphics.getHeight());
        batch.begin();backdrop.draw(batch,background,view.x,view.y,view.width,view.height);drawCharacters(batch);
        if(tableFront!=null)backdrop.draw(batch,background,tableFront,view.x,view.y,view.width,view.height);batch.end();
        Gdx.gl.glClear(GL20.GL_DEPTH_BUFFER_BIT);
        long p2=System.nanoTime();scene.update(dt);renderScene();if(PROFILE)Gdx.gl.glFinish();long p3=System.nanoTime();
        Gdx.gl.glViewport(0,0,Gdx.graphics.getBackBufferWidth(),Gdx.graphics.getBackBufferHeight());
        batch.begin();fx.draw(batch,camera,view,1-dim*.8f);fillHud();hud.draw(batch,hudFrame,dt);drawOverlay(batch);batch.end();
        if(PROFILE){Gdx.gl.glFinish();long p4=System.nanoTime();float tot=(p4-p0)/1e6f;if(tot>12)System.out.printf(java.util.Locale.ROOT,"PROFILE %.1f ms: update %.1f, backdrop %.1f, 3d %.1f, hud %.1f%n",tot,(p1-p0)/1e6f,(p2-p1)/1e6f,(p3-p2)/1e6f,(p4-p3)/1e6f);}
        if(needsFrames())Gdx.graphics.requestRendering();
    }
    private boolean warmed;
    private static final boolean PROFILE=Boolean.getBoolean("cursedcards.profile");
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
    protected void drawCharacters(SpriteBatch batch){if(cast!=null)cast.draw(batch);}
    /** Development overlay hook (drawn above the HUD); empty in production. */
    protected void drawOverlay(SpriteBatch batch){}
    protected void update(float dt){
        clock+=dt;
        while(clock>=stepUntil&&!steps.isEmpty()){float d=steps.peek().run();if(d<0)break;steps.poll();stepUntil=clock+d;}
        animator.update(cards,dt);machine.update(dt);fx.update(dt);hud.update(dt);backdrop.update(dt);
        if(cast!=null)cast.layout(seatList,camera,view,awaitingDraw()?drawer:-1,dt);
        // lightning also lights the 3D objects on the table, so they stay part of the painted room
        float f=backdrop.flash();key.intensity=2.6f+f*2.2f;key.updateColor();if(moon!=null){moon.intensity=1.3f+f*3f;moon.updateColor();}
        machine.slotLight.position.set(path.outside.position).add(0,.06f,-.25f);
        // burning pairs: crimson glow rises, embers, then gone
        boolean burnSounded=false;
        for(int i=burning.size-1;i>=0;i--){Card3D c=burning.get(i);c.vanish+=dt/.55f;c.pose.position.y+=dt*.35f;c.sync();
            c.glow(1,.18f,.08f,Math.min(1.6f,c.vanish*3));
            if(c.vanish>.25f&&c.vanish-dt/.55f<=.25f){fx.burst(c.pose.position,14,.45f,.1f);if(!burnSounded){burnSounded=true;audio.play("pairBurn",.5f);slowMo=Math.min(slowMo,.55f);}}
            if(c.vanish>=1){c.visible=false;c.opacity(1);c.glow(0,0,0,0);c.vanish=0;burning.removeIndex(i);}else c.opacity(1-c.vanish*c.vanish);}
        cameraMoving=director.update(dt,camera);
        float pr=machine.presence();if(pr!=machineTarget)machine.presence(machineTarget>pr?Math.min(machineTarget,pr+dt/CardAnimator.timing.summon):Math.max(machineTarget,pr-dt/CardAnimator.timing.dissolve));
        activeAmount=approach(activeAmount,awaitingDraw()&&glowDrawer>=0?1:0,dt*2.5f);targetAmount=approach(targetAmount,awaitingDraw()&&glowSource>=0?1:0,dt*2.5f);
        if(cine!=null&&cine.active()){cine.update(dt);driveCinematic(dt);}
        turnAge+=dt;float limit=tableConfig.turn.seconds;
        if(!network&&awaitingDraw()&&limit>0){turnClock+=dt;if(turnClock>=limit){turnClock=0;turnTimeouts++;hud.toast("TIME — FATE CHOOSES");drawRandom();}}
        if(audio!=null)audio.update(dt);sceneFade=Math.max(0,sceneFade-dt*1.1f);
        // the dealer's red heart: an occasional faint glow on the felt where it stands (or stood)
        nextThrob-=dt;if(nextThrob<=0&&(cine==null||!cine.active())){throbAge=0;nextThrob=11+MathUtils.random(9f);}throbAge+=dt;throb=throbAge<2.4f?MathUtils.sin(throbAge/2.4f*MathUtils.PI):0;
        // Cinematic framing: no push-in during turns and exchanges; only a slight breath while dealing.
        if(deathCard==null){if(dealShowing){focus.set(machine.worldBounds().getCenter(tmp2));zoomTarget=1.015f;}else{zoomTarget=1;}}
        bars=approach(bars,dealShowing||deathCard!=null&&cine!=null&&cine.running()?1:0,dt*(bars<.5f?1.6f:1.1f));
        zoom+=(zoomTarget-zoom)*Math.min(1,dt*(deathCard!=null?3:.9f));applyView();
        dim=approach(dim,dimTarget,dt*(dimTarget>dim?1.4f:1.6f));
        // DEATH light: a red glow that swells under the rising card (replaces the vanished machine's slot light).
        if(deathCard!=null&&deathLight>0){deathLight=Math.min(1,deathLight+dt*.8f);float flick=.85f+.15f*MathUtils.sin(clock*17)*MathUtils.sin(clock*7.3f);
            machine.slotLight.position.set(deathCard.pose.position).add(0,-.6f,.9f);machine.slotLight.color.set(1,.12f,.06f,1);machine.slotLight.intensity=deathLight*1.1f*flick;
            deathCard.glow(1,.15f,.08f,deathLight*.14f*flick);}
        else machine.slotLight.color.set(1,.16f,.08f,1);
    }
    /** Cinematic screen-space framing: a slight zoom toward the DEATH card and a brief shake, applied to the whole letterbox. */
    /** Time dilation for dramatic beats (1 = normal); recovers on real time. */
    private float slowMo=1,realClock;
    private void applyView(){
        view.set(baseView);
        // a barely perceptible hand-held drift keeps the frame alive (fraction of a pixel to ~2 px at 1080p)
        float drift=baseView.height*.0016f;float hx=(MathUtils.sin(realClock*.37f)+MathUtils.sin(realClock*.83f+1.3f)*.5f)*drift,hy=(MathUtils.sin(realClock*.29f+.7f)+MathUtils.sin(realClock*.71f)*.5f)*drift;
        float z=zoom*1.012f;
        float fx0=baseView.x+baseView.width*.5f,fy0=baseView.y+baseView.height*.5f;
        if(deathCard!=null)tmp.set(deathCentre);else tmp.set(focus);
        camera.project(tmp,baseView.x,baseView.y,baseView.width,baseView.height);fx0=MathUtils.lerp(fx0,tmp.x,deathCard!=null?1:.6f);fy0=MathUtils.lerp(fy0,tmp.y,deathCard!=null?1:.6f);
        view.set(fx0-(fx0-baseView.x)*z+hx,fy0-(fy0-baseView.y)*z+hy,baseView.width*z,baseView.height*z);
        float s=shake*shake*baseView.height*.008f;view.x+=MathUtils.sin(clock*61)*s;view.y+=MathUtils.sin(clock*47+1)*s;
    }
    private static float approach(float v,float t,float step){return v<t?Math.min(t,v+step):Math.max(t,v-step);}
    private void fillHud(){
        var f=hudFrame;f.view=view;f.players=seatList.size;f.names=names;f.drawer=awaitingDraw()?drawer:-1;f.source=awaitingDraw()?source:-1;f.loser=verdict||eliminationShown?loser:-1;f.flash=redFlash;f.verdict=verdict;f.dim=dim;
        f.fade=sceneFade*sceneFade;f.bars=bars;float limit=tableConfig.turn.seconds;f.timer=network?(awaitingDraw()&&netTurnDeadline>netTurnStart?MathUtils.clamp((netTurnDeadline-(System.currentTimeMillis()+netOffset))/(float)(netTurnDeadline-netTurnStart),0,1):-1):awaitingDraw()&&limit>0?1-turnClock/limit:-1;f.turnAge=turnAge;
        for(int i=0;i<seatList.size;i++){tmp.set(seatList.get(i).plate);camera.project(tmp,view.x,view.y,view.width,view.height);f.plates[i].set(tmp.x,tmp.y);f.safe[i]=safe[i];
            // farther seats (higher on screen) read slightly smaller, within a narrow range
            f.plateScale[i]=MathUtils.clamp(1.12f-(tmp.y-view.y)/view.height*.55f,.82f,1.05f);}
        if(deathCard!=null){tmp.set(deathCard.pose.position);camera.project(tmp,view.x,view.y,view.width,view.height);f.spotlight.set(tmp.x,tmp.y);}
    }
    /** Felt-level quads: machine and card contact shadows, turn glows. */
    private void feltRenderables(Array<Renderable> out,Pool<Renderable> pool){
        if(machine.visible()){opacity(machineShadow,machine.presence()*.9f);machineShadow.getRenderables(out,pool);}
        if(activeAmount>0&&glowDrawer>=0){placeGlow(activeGlow,glowDrawer,activeAmount*(.4f+.1f*MathUtils.sin(clock*2.6f)));activeGlow.getRenderables(out,pool);}
        if(targetAmount>0&&glowSource>=0){placeGlow(targetGlow,glowSource,targetAmount*.22f);targetGlow.getRenderables(out,pool);}
        if(throb>0){var b=machine.worldBounds();redThrob.transform.setToTranslation((b.min.x+b.max.x)*.5f,.002f,(b.min.z+b.max.z)*.5f).scale(5.5f,1,3.2f);opacity(redThrob,throb*.28f);redThrob.getRenderables(out,pool);}
    }
    private void placeGlow(ModelInstance g,int seat,float a){var st=seatList.get(seat);int n=Math.max(1,hands.get(seat).size);float w=Math.min(st.handWidth,cardWidth+(n-1)*cardWidth*FAN_SPACING)+1.4f;
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
        baseView.set((width-w)*.5f,(height-h)*.5f,w,h);view.set(baseView);camera.viewportWidth=w;camera.viewportHeight=h;camera.update();scene.updateViewport(w,h);
        float k=Gdx.graphics.getBackBufferWidth()/(float)width;resizeLowRes(Math.round(w*k),Math.round(h*k));}

    // ---------------- scene construction ----------------
    /** Lights matched to the painting: warm candle key from the left, cool moonlight rim from the windows, warm fill above. */
    private void buildLights(){
        key=new DirectionalLightEx();key.set(new Color(1,.80f,.60f,1),new Vector3(.45f,-1,-.35f).nor(),2.6f);scene.environment.add(key);
        if(quality!=CursedCardsQuality.LOW){moon=new DirectionalLightEx();moon.set(new Color(.55f,.66f,1,1),new Vector3(-.15f,-.45f,1).nor(),1.3f);scene.environment.add(moon);}
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
        activeGlow=glowQuad(new Color(1,.74f,.36f,1));targetGlow=glowQuad(new Color(.9f,.16f,.1f,1));redThrob=glowQuad(new Color(1,.1f,.05f,1));
        placeMachineShadow();
    }
    private ModelInstance shadowQuad(){var m=new ModelInstance(quadModel);m.materials.first().set(PBRColorAttribute.createBaseColorFactor(new Color(.02f,0,0,1)),PBRTextureAttribute.createBaseColorTexture(blob),
        new BlendingAttribute(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA,1),new DepthTestAttribute(GL20.GL_LEQUAL,false));return m;}
    private ModelInstance glowQuad(Color c){var m=new ModelInstance(quadModel);m.materials.first().set(PBRColorAttribute.createBaseColorFactor(Color.BLACK),PBRTextureAttribute.createEmissiveTexture(blob),
        com.badlogic.gdx.graphics.g3d.attributes.ColorAttribute.createEmissive(c),new BlendingAttribute(GL20.GL_SRC_ALPHA,GL20.GL_ONE,1),new DepthTestAttribute(GL20.GL_LEQUAL,false));return m;}
    /**
     * Alpha mask (backdrop UV space) of the painted table's silhouette: convex hull of the projected rim ellipse and its
     * pedestal at floor level, supersampled for a soft edge. Characters drawn before this layer appear seated behind it.
     */
    private Texture tableSilhouette(){
        var t=tableConfig.table;int seg=72;float[] pts=new float[seg*4];
        for(int i=0;i<seg;i++){float a=i*MathUtils.PI2/seg,c=MathUtils.cos(a),sn=MathUtils.sin(a);
            uv(tmp.set(t.x+t.rimA()*c,.35f,t.z+t.rimB()*sn),pts,i*2);uv(tmp.set(t.x+t.rimA()*.82f*c,-tableConfig.floorBelowFelt,t.z+t.rimB()*.82f*sn),pts,seg*2+i*2);}
        float[] hull=hull(pts);int w=836,h=470;Pixmap p=new Pixmap(w,h,Pixmap.Format.RGBA8888);p.setBlending(Pixmap.Blending.None);
        for(int y=0;y<h;y++)for(int x=0;x<w;x++){int in=0;for(int sy=0;sy<2;sy++)for(int sx=0;sx<2;sx++)if(inside(hull,(x+.25f+.5f*sx)/w,(y+.25f+.5f*sy)/h))in++;
            float a=in/4f;p.drawPixel(x,y,Color.rgba8888(a,a,a,1));}
        var tex=new Texture(p);tex.setFilter(Texture.TextureFilter.Linear,Texture.TextureFilter.Linear);p.dispose();return tex;
    }
    private void uv(Vector3 world,float[] out,int i){camera.project(world,view.x,view.y,view.width,view.height);out[i]=(world.x-view.x)/view.width;out[i+1]=1-(world.y-view.y)/view.height;}
    /** Monotone-chain convex hull of (x,y) pairs, counter-clockwise. */
    private static float[] hull(float[] p){int n=p.length/2;Integer[] idx=new Integer[n];for(int i=0;i<n;i++)idx[i]=i;
        java.util.Arrays.sort(idx,(a,b)->p[a*2]!=p[b*2]?Float.compare(p[a*2],p[b*2]):Float.compare(p[a*2+1],p[b*2+1]));
        int[] h=new int[2*n];int k=0;
        for(int i=0;i<n;i++){while(k>=2&&cross(p,h[k-2],h[k-1],idx[i])<=0)k--;h[k++]=idx[i];}
        for(int i=n-2,lo=k+1;i>=0;i--){while(k>=lo&&cross(p,h[k-2],h[k-1],idx[i])<=0)k--;h[k++]=idx[i];}
        float[] out=new float[(k-1)*2];for(int i=0;i<k-1;i++){out[i*2]=p[h[i]*2];out[i*2+1]=p[h[i]*2+1];}return out;}
    private static float cross(float[] p,int o,int a,int b){return (p[a*2]-p[o*2])*(p[b*2+1]-p[o*2+1])-(p[a*2+1]-p[o*2+1])*(p[b*2]-p[o*2]);}
    /** Inside a convex polygon of either winding (UV space has y pointing down). */
    private static boolean inside(float[] hull,float x,float y){int n=hull.length/2,pos=0,neg=0;for(int i=0;i<n;i++){int j=(i+1)%n;
        float c=(hull[j*2]-hull[i*2])*(y-hull[i*2+1])-(hull[j*2+1]-hull[i*2+1])*(x-hull[i*2]);if(c>0)pos++;else if(c<0)neg++;if(pos>0&&neg>0)return false;}return true;}
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
        diffuse.dispose();specular.dispose();brdf.dispose();background.dispose();batch.dispose();hud.dispose();fx.dispose();backdrop.dispose();if(cine!=null)cine.dispose();if(audio!=null)audio.dispose();if(cast!=null)cast.dispose();if(tableFront!=null)tableFront.dispose();
    }
}
