package com.erni.finalanswer.lwjgl3;

import com.badlogic.gdx.Files;
import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.Pixmap;
import com.badlogic.gdx.graphics.PixmapIO;
import com.badlogic.gdx.graphics.glutils.FrameBuffer;
import com.badlogic.gdx.graphics.glutils.HdpiMode;
import com.badlogic.gdx.scenes.scene2d.Actor;
import com.badlogic.gdx.scenes.scene2d.Group;
import com.badlogic.gdx.scenes.scene2d.Stage;
import com.badlogic.gdx.scenes.scene2d.ui.Image;
import com.badlogic.gdx.scenes.scene2d.ui.Label;

import com.badlogic.gdx.backends.lwjgl3.Lwjgl3Application;
import com.badlogic.gdx.backends.lwjgl3.Lwjgl3ApplicationConfiguration;
import com.erni.finalanswer.FinalAnswerGame;
import com.erni.finalanswer.gameplay.impostor.*;
import com.erni.finalanswer.impostor.*;
import com.erni.finalanswer.screens.MainMenu;
import java.lang.reflect.Proxy;
import java.nio.file.Path;

/** Real GL resource regression, isolated from production and room networking. */
public final class ImpostorCheck extends FinalAnswerGame {
    private static Throwable failure;
    private int step;
    private boolean rendering;
    private int baseline;
    private ImpostorScreen preview;
    private ImpostorSuspicionPreview suspicionDemo;
    private int originalBaseline;
    private int liveCount = 3, liveStep;
    private long liveStarted;
    private long finalCaptureNow;
    private int liveFinalCount=3,liveVisible;
    private long liveFinalStarted;
    private float liveStampMin=Float.POSITIVE_INFINITY,liveStampMax=Float.NEGATIVE_INFINITY;

    private static void check(boolean value, String message) {
        if (!value) throw new AssertionError(message);
    }

    public static void main(String[] args) {
        var config = new Lwjgl3ApplicationConfiguration();
        config.setWindowedMode(960, 540);
        config.disableAudio(!Boolean.getBoolean("impostor.audioQA"));
        config.setHdpiMode(HdpiMode.Pixels);
        config.setPreferencesConfig(System.getProperty("impostor.qa.dir"), Files.FileType.Absolute);
        new Lwjgl3Application(new ImpostorCheck(), config);
        if (failure != null) throw new AssertionError("Impostor check failed", failure);
    }

    @Override public void render() {
        // GLFW can synchronously request another render during the native resize below.
        if (rendering) return;
        rendering = true;
        try {
            if (step == 0) {
                super.render();
                check(getScreen() instanceof MainMenu, "Existing menu opens");
                showPlayScreen();
                check(getScreen() instanceof MainMenu, "Existing PLAY room gate remains");
                previewLanguage("ru");
                originalBaseline = Texture.getNumManagedTextures();
                baseline = Texture.getNumManagedTextures();
                checkAssetScope();
                openPreview();
                check(preview.state().phase() == ImpostorPhase.INTRO, "Initial phase");
            } else if (step == 1) {
                super.render();
                checkParticipantValidation();
                var deathFont=com.erni.finalanswer.ui.UiFonts.body(24);
                try{com.erni.finalanswer.impostor.DeathWindowCheck.verify(deathFont,preview.participants());}finally{deathFont.dispose();}
                checkEmptyPreview();
                checkComposition();
                checkBackgroundAnimation();
                checkTimelineMath();
                checkPaperSequence();
                checkSuspicionEnvelope();
                check(Gdx.input.getInputProcessor().keyDown(com.badlogic.gdx.Input.Keys.F4), "Dev F4 handled");
                check(preview.participants().size() == 4, "Four-player dev configuration");
                checkEmptyPreview();
                checkComposition();
                checkPaperSequence();
                checkSuspicionEnvelope();
                checkLongTextAndUpdates();
                checkIdentityBinding();
                checkAuthoritativePresentation();
                checkOfflineClueControls();
                checkAudioBoundaries();
                checkFinalVoting();
                checkLifecycleResults();
                checkStage8Presentation();
                checkStage9Settings();
                checkConnectionQr();
                checkFinalPreviewControls();
                checkStoryPresentation();
                checkOpeningInputRoute();
                checkSteadyPresentationCost();
                int textures = Texture.getNumManagedTextures();
                check(Gdx.input.getInputProcessor().keyDown(com.badlogic.gdx.Input.Keys.F3), "Dev F3 handled");
                check(preview.participants().size() == 3, "Three-player dev configuration");
                check(Texture.getNumManagedTextures() == textures, "Switching layouts reuses textures");
                check(preview.paperState()==PaperFlipState.FACE_DOWN && preview.revealedRoundCount()==0,"Roster change resets papers");
                Gdx.graphics.setWindowedMode(1024, 768);
                preview.resize(1024, 768);
                showMainMenu();
                check(getScreen() instanceof MainMenu, "Return to menu");
                int count = Texture.getNumManagedTextures();
                setScreen(preview);
                check(Texture.getNumManagedTextures() == count, "Reentry does not duplicate textures");
                preview.resetPapers();
                check(preview.revealClues(ImpostorPreviewData.clues(1,preview.participants())), "Flip before ESC");
                preview.render(.125f);
                check(Gdx.input.getInputProcessor().keyDown(com.badlogic.gdx.Input.Keys.ESCAPE), "ESC handled during flip");
            } else if (step == 2) {
                super.render();
                check(getScreen() instanceof MainMenu, "ESC returns to menu");
                preview.dispose();
                preview.dispose();
                check(Texture.getNumManagedTextures() == baseline, "Screen releases all textures");
                openPreview();
            } else if (step == 3) {
                super.render();
                if (!checkLiveTransitions()) return;
            } else {
                super.render();
                showMainMenu();
                preview.dispose();
                preview = null;
                check(Texture.getNumManagedTextures() == baseline, "Recreated screen releases all textures");
                check(Texture.getNumManagedTextures() == originalBaseline, "Dev avatar resources released");
                Gdx.app.log("THE IMPOSTOR", "PASS: synchronized flips, final voting and one retained stamp per vote for 3/4 players, real-time OpenGL playback, resize, navigation and disposal");
                Gdx.app.exit();
            }
            step++;
        } catch (Throwable error) {
            failure = error;
            Gdx.app.error("THE IMPOSTOR", "CHECK FAILED", error);
            Gdx.app.exit();
        } finally { rendering = false; }
    }

    private void checkStoryPresentation() throws Exception {
        preview.setParticipants(ImpostorPreviewData.participants(4));preview.resetPapers();
        preview.presentPhase(ImpostorPhase.ROLE_REVEAL,12000,0);preview.render(.1f);
        Group deal=stage(preview).getRoot().findActor("impostorRoleDeal");check(deal.isVisible(),"Role distribution has a visible public card-back animation");
        preview.render(.6f);capturePaperState("story-card-deal");preview.render(.7f);check(!deal.isVisible(),"Card dealing finishes without advancing gameplay");
        String first=preview.participants().getFirst().player().id();preview.networkReady(java.util.Set.of(first));
        preview.presentPhase(ImpostorPhase.ROUND_CLUE_INPUT,20000,1000);preview.render(0);
        Label ready=((Group)stage(preview).getRoot().findActor("participant:"+first)).findActor("clueReadiness");
        check(ready.isVisible()&&ready.getText().toString().equals("СЛОВО ПРИНЯТО"),"Host readiness shows receipt without clue contents");
        var rounds=java.util.List.of(ImpostorPreviewData.clues(1,preview.participants()),ImpostorPreviewData.clues(2,preview.participants()),ImpostorPreviewData.clues(3,preview.participants()));
        preview.restoreClues(rounds,true);preview.presentPhase(ImpostorPhase.EVIDENCE_REVIEW,30000,10000);
        preview.presentFinal(new FinalActSnapshot("story",ImpostorPhase.EVIDENCE_REVIEW,10000,30000,0,0,4,"",java.util.List.of(),java.util.Map.of(),java.util.List.of(),"",""),10000);preview.render(0);
        check(stage(preview).getRoot().findActor("impostorEvidenceBoard").isVisible(),"Discussion presents all public clue rounds");capturePaperState("story-evidence-board");
        var outcomes=java.util.List.of("IMPOSTOR_CAUGHT","IMPOSTOR_ESCAPED","NO_CONSENSUS");
        var titles=java.util.List.of("САМОЗВАНЕЦ РАСКРЫТ!","САМОЗВАНЕЦ СКРЫЛСЯ","НИЧЬЯ!");
        for(int i=0;i<outcomes.size();i++){
            preview.presentPhase(ImpostorPhase.IMPOSTOR_REVEAL,104000,100000);
            preview.presentFinal(new FinalActSnapshot("story",ImpostorPhase.IMPOSTOR_REVEAL,100000,104000,95000,4,4,"story-votes",java.util.List.of(first,first),java.util.Map.of(first,2),java.util.List.of(first,preview.participants().get(1).player().id()),first,outcomes.get(i)),105000);
            preview.render(0);Label title=stage(preview).getRoot().findActor("finalTitle");check(title.getText().toString().equals(titles.get(i)),"Distinct final outcome: "+outcomes.get(i));
            finalCaptureNow=105000;capturePaperState("final-story-"+outcomes.get(i).toLowerCase(java.util.Locale.ROOT));
            check(!stage(preview).getRoot().findActor("impostorLifecycle").isVisible(),"Outcome scene does not introduce a rematch flow");
        }
        preview.resetPapers();preview.presentPhase(ImpostorPhase.INTRO,0,0);
    }

    private void checkOpeningInputRoute() throws Exception {
        String previous=System.getProperty("impostor.opening.skip");int textures=Texture.getNumManagedTextures();
        ImpostorScreen openingScreen=null;
        try{
            System.setProperty("impostor.opening.skip","false");openingScreen=new ImpostorScreen(this,player->null);setScreen(openingScreen);
            final boolean[] triggered={false};openingScreen.addPreviewListener(new com.badlogic.gdx.scenes.scene2d.InputListener(){
                @Override public boolean keyDown(com.badlogic.gdx.scenes.scene2d.InputEvent event,int key){if(key!=com.badlogic.gdx.Input.Keys.F7)return false;triggered[0]=true;return true;}
            });
            Gdx.input.getInputProcessor().keyDown(com.badlogic.gdx.Input.Keys.F7);check(!triggered[0],"Opening does not accept gameplay preview keys");
            openingScreen.render(0);openingScreen.render(9);
            Gdx.input.getInputProcessor().keyDown(com.badlogic.gdx.Input.Keys.F7);check(triggered[0],"Preview keys remain installed after opening finishes");
        }finally{setScreen(preview);if(openingScreen!=null)openingScreen.dispose();if(previous==null)System.clearProperty("impostor.opening.skip");else System.setProperty("impostor.opening.skip",previous);}
        check(Texture.getNumManagedTextures()==textures,"Opening test releases all owned textures/fonts");
    }

    private void checkSteadyPresentationCost() throws Exception {
        for(int i=0;i<120;i++)preview.render(1/60f);
        int textures=Texture.getNumManagedTextures(),actors=stage(preview).getRoot().getChildren().size;
        double[] samples=new double[360];
        for(int i=0;i<samples.length;i++){long start=System.nanoTime();preview.render(1/60f);samples[i]=(System.nanoTime()-start)/1_000_000.0;}
        check(Texture.getNumManagedTextures()==textures,"Sustained presentation does not accumulate textures");
        check(stage(preview).getRoot().getChildren().size==actors,"Sustained presentation does not accumulate root actors");
        java.util.Arrays.sort(samples);
        var report=java.util.Map.of("samples",samples.length,"cpuMedianMs",samples[180],"cpuP95Ms",samples[342],"texturesBefore",textures,"texturesAfter",Texture.getNumManagedTextures(),"rootActors",actors,"includesWindowSwap",false);
        Gdx.files.absolute(System.getProperty("impostor.qa.artifacts")+"/performance.json").writeString(new com.google.gson.Gson().toJson(report),false);
        Gdx.app.log("THE IMPOSTOR","Steady presentation: "+report);
    }

    private void checkAssetScope() throws Exception {
        try (var scope = new AssetScope()) {
            scope.assets.load();
            check(scope.assets.failures().isEmpty(), "All supplied assets load");
            for (ImpostorAsset asset : ImpostorAsset.values())
                check(scope.assets.isAvailable(asset), "Available: " + asset.path());
            checkCharacterLane(scope.assets);
            Texture first = scope.assets.texture(ImpostorAsset.CLOCK).orElseThrow();
            int count = Texture.getNumManagedTextures();
            scope.assets.load();
            check(first == scope.assets.texture(ImpostorAsset.CLOCK).orElseThrow(), "Stable borrowed texture");
            check(Texture.getNumManagedTextures() == count, "Idempotent load");
        }
        check(Texture.getNumManagedTextures() == baseline, "Asset owner releases textures");
        Files original = Gdx.files;
        Path directory = java.nio.file.Files.createTempDirectory("impostor-assets-");
        Path corrupt = directory.resolve("corrupt.png");
        java.nio.file.Files.writeString(corrupt, "invalid PNG");
        try {
            Gdx.files = (Files) Proxy.newProxyInstance(Files.class.getClassLoader(), new Class<?>[]{Files.class},
                (proxy, method, args) -> {
                    if (method.getName().equals("internal")) {
                        String path=args[0].toString();if(path.startsWith("runtime/"))path=path.substring(8);
                        if (path.equals(ImpostorAsset.CLOCK.path())
                                || path.equals(ImpostorAsset.BACKGROUND_1.path())
                                || path.equals(ImpostorAsset.TIMER_RECTANGLE.path())
                                || path.equals(ImpostorAsset.PAPER_FRONT.path())
                                || path.equals(ImpostorAsset.AVATAR_FRAME.path()))
                            return original.absolute(directory.resolve("missing.png").toString());
                        if (path.equals(ImpostorAsset.PAPER_BACK.path()))
                            return original.absolute(corrupt.toString());
                    }
                    return method.invoke(original, args);
                });
            try (var scope = new AssetScope()) {
                scope.assets.load();
                check(scope.assets.failures().size() == 6, "Missing and corrupt assets reported independently");
                check(scope.assets.texture(ImpostorAsset.CLOCK).isEmpty(), "Missing asset retrieval is empty");
                check(scope.assets.texture(ImpostorAsset.PAPER_BACK).isEmpty(), "Corrupt asset retrieval is empty");
                check(scope.assets.isAvailable(ImpostorAsset.STAMP), "Unrelated asset still loads");
            }
            ImpostorScreen degraded = new ImpostorScreen(this);
            degraded.setParticipants(ImpostorPreviewData.participants(3));
            try {
                setScreen(degraded);
                degraded.render(0);
                Stage stage = stage(degraded);
                check(stage.getRoot().findActor("impostorBackground") == null, "Missing background safely omitted");
                check(stage.getRoot().findActor("impostorClockArrow") == null, "Hand omitted without clock");
                check(stage.getRoot().findActor("portraitFrame") == null, "Missing frame safely omitted");
                check(stage.getRoot().findActor("nickname").isVisible(), "Nickname remains independent of decorative frame assets");
                check(stage.getRoot().findActor("impostorTimerValue") != null, "Text remains usable without panel");
                check(stage.getRoot().findActor("paperFront") == null, "Missing paper omitted safely");
                check(!stage.getRoot().findActor("clue0").isVisible(), "Ink hidden without parchment");
                check(degraded.revealClues(java.util.Map.of()), "Reveal tolerates missing/corrupt papers");
                degraded.render(5);
                check(degraded.paperState()==PaperFlipState.FACE_UP, "Missing textures cannot stall animation");
                check(!stage.getRoot().findActor("clue0").isVisible(), "Missing front keeps revealed ink hidden");
                degraded.resetPapers();
                showMainMenu();
            } finally {
                if (getScreen() == degraded) showMainMenu();
                degraded.dispose();
            }
        } finally {
            Gdx.files = original;
            java.nio.file.Files.deleteIfExists(corrupt);
            java.nio.file.Files.deleteIfExists(directory);
        }
        check(Texture.getNumManagedTextures() == baseline, "Partial load releases successful textures");
    }

    private static Stage stage(ImpostorScreen screen) throws Exception {
        var field = ImpostorScreen.class.getDeclaredField("stage");
        field.setAccessible(true);
        return (Stage) field.get(screen);
    }

    private void checkComposition() throws Exception {
        Stage stage = stage(preview);
        checkParticipants();
        String[] names = {"impostorBackground", "impostorClock", "impostorClockArrow",
                "impostorTimerPanel", "impostorTimerLabel", "impostorTimerValue"};
        int lastIndex = -1;
        for (String name : names) {
            Actor actor = stage.getRoot().findActor(name);
            check(actor != null && actor.isVisible(), "Visible element: " + name);
            check(actor.getZIndex() > lastIndex, "Layer order: " + name);
            lastIndex = actor.getZIndex();
            check(actor.getX() >= 0 && actor.getY() >= 0
                && actor.getRight() <= ImpostorLayout.WIDTH && actor.getTop() <= ImpostorLayout.HEIGHT,
                "Safe bounds: " + name);
        }
        Image clock = stage.getRoot().findActor("impostorClock");
        Image arrow = stage.getRoot().findActor("impostorClockArrow");
        Image panel = stage.getRoot().findActor("impostorTimerPanel");
        check(Math.abs(clock.getWidth() / clock.getHeight() - 1223f / 1286) < .0001f, "Clock proportions");
        check(Math.abs(arrow.getWidth() / arrow.getHeight() - 1024f / 1536) < .0001f, "Arrow proportions");
        check(Math.abs(panel.getWidth() / panel.getHeight() - 1942f / 809) < .0001f, "Panel proportions");
        check(Math.abs(clock.getX() + clock.getWidth()/2 - panel.getX() - panel.getWidth()/2) < .01f,
                "Clock and panel centered together");
        float pivotX = clock.getX() + ImpostorLayout.CLOCK_PIVOT_X * clock.getWidth()/1223;
        float pivotY = clock.getY() + (1286-ImpostorLayout.CLOCK_PIVOT_Y) * clock.getHeight()/1286;
        check(Math.abs(arrow.getX()+arrow.getOriginX()-pivotX) < .01f
            && Math.abs(arrow.getY()+arrow.getOriginY()-pivotY) < .01f, "Measured hub alignment");
        check(arrow.getRotation() == 0, "Static twelve-o'clock hand");
        for (String name : new String[]{"impostorTimerLabel", "impostorTimerValue"}) {
            Label label = stage.getRoot().findActor(name);
            label.validate();
            check(label.getPrefWidth() <= label.getWidth() && label.getPrefHeight() <= label.getHeight(),
                    "Text fits: " + name + " preferred=" + label.getPrefWidth() + "x" + label.getPrefHeight()
                        + " bounds=" + label.getWidth() + "x" + label.getHeight());
            for (char c : label.getText().toString().toCharArray())
                check(label.getStyle().font.getData().hasGlyph(c), "Supported glyph: " + c);
            check(label.getX() >= panel.getX()+25 && label.getRight() <= panel.getRight()-25
                && label.getY() >= panel.getY()+25 && label.getTop() <= panel.getTop()-25,
                "Text clear of panel edges");
        }
        check(((Label)stage.getRoot().findActor("impostorTimerLabel")).getText().toString()
                .equals("ОЖИДАЕМ НАЧАЛА"), "Idle phase label");
        check(((Label)stage.getRoot().findActor("impostorTimerValue")).getText().toString()
                .equals("—"), "Idle preview does not display a fake countdown");
        // Deterministic target-size renders avoid desktop window-manager size limits.
        int[][] sizes = {{1920,1080},{1600,900},{1280,720},{1366,768},{1024,768}};
        for (int[] size : sizes) {
            FrameBuffer target = new FrameBuffer(Pixmap.Format.RGBA8888, size[0], size[1], false);
            try {
                target.begin();
                preview.resize(size[0], size[1]);
                preview.render(0);
                var viewport = stage.getViewport();
                float sx = viewport.getScreenWidth()/ImpostorLayout.WIDTH;
                float sy = viewport.getScreenHeight()/ImpostorLayout.HEIGHT;
                check(Math.abs(sx-sy) < .002f, "Uniform scale at " + size[0]);
                check(Math.abs(viewport.getScreenX()*2+viewport.getScreenWidth()-size[0]) <= 1
                    && Math.abs(viewport.getScreenY()*2+viewport.getScreenHeight()-size[1]) <= 1,
                    "Centered composition");
                Pixmap pixels = Pixmap.createFromFrameBuffer(0, 0, size[0], size[1]);
                try {
                    // Non-black table/background pixel confirms real artwork reached the framebuffer.
                    check((pixels.getPixel(size[0]/2,size[1]/2) & 0xffffff00) != 0, "Background pixels");
                    if (size[1] == 768 && size[0] == 1024)
                        check((pixels.getPixel(10,10) & 0xffffff00) == 0, "Black letterbox bars");
                    var file = Gdx.files.absolute(System.getProperty("impostor.qa.artifacts")
                        + "/impostor-" + preview.participants().size() + "players-" + size[0] + "x" + size[1] + ".png");
                    file.parent().mkdirs();
                    PixmapIO.writePNG(file, pixels, -1, true);
                } finally { pixels.dispose(); }
            } finally {
                target.end();
                target.dispose();
            }
        }
        preview.resize(Gdx.graphics.getWidth(), Gdx.graphics.getHeight());
    }

    private void openPreview() {
        preview = new ImpostorScreen(this);
        preview.setParticipants(ImpostorPreviewData.participants(3));
        setScreen(preview);
        suspicionDemo=ImpostorPreviewData.installControls(preview);
    }

    private void checkParticipantValidation() {
        var valid = ImpostorPreviewData.participants(3);
        for (int count : new int[]{0,1,2,5,6,8}) {
            try {
                preview.setParticipants(java.util.Collections.nCopies(count, valid.get(0)));
                throw new AssertionError("Invalid active count accepted: " + count);
            } catch (IllegalArgumentException expected) { /* Exactly 3 or 4 only. */ }
        }
        try {
            preview.setParticipants(java.util.List.of(valid.get(0),valid.get(0),valid.get(1)));
            throw new AssertionError("Duplicate active participant accepted");
        } catch (IllegalArgumentException expected) { }
        check(preview.participants().equals(valid), "Rejected configurations leave previous data intact");
    }

    private void checkParticipants() throws Exception {
        var stage = stage(preview);
        com.badlogic.gdx.scenes.scene2d.Group row = stage.getRoot().findActor("players");
        check(row.getChildren().size == preview.participants().size(), "Only explicit active participants in row");
        float previousRight = -1, previousY = -1;
        for (var participant : preview.participants()) {
            ImpostorParticipantView view = row.findActor("participant:"+participant.player().id());
            check(view != null, "Data-driven player identity");
            float left=view.getX(), bottom=view.getY();
            float right=left+view.getWidth()*view.getScaleX();
            float top=bottom+view.getHeight()*view.getScaleY();
            check(left>=ImpostorLayout.TOP_PLAYERS.x() && right<=1500.1f && bottom>=744 && top<=ImpostorLayout.TOP_PLAYERS.y()+ImpostorLayout.TOP_PLAYERS.height()+.1f,
                "Participant fits reserved region");
            check(left>=previousRight && (previousY<0 || Math.abs(bottom-previousY)<.01f), "Single nonoverlapping row");
            check(right<ImpostorLayout.CLOCK_REGION.x(), "Clock/timer clearance");
            previousRight=right; previousY=bottom;
            check(view.findActor("avatar") == null && view.findActor("devAvatarLabel") == null,
                "No fabricated avatar or debug labels");
            check(view.findActor("portraitFrame")==null, "Frameless character presentation");
            Label nickname=view.findActor("nickname");
            nickname.validate();
            check(nickname.getText().toString().equals(participant.player().name()), "Underlying nickname preserved");
            check(nickname.getGlyphLayout().width<=nickname.getWidth()+.1f
                && nickname.getGlyphLayout().height<=nickname.getHeight(), "Nickname fits measured plate with visual ellipsis");
            check(view.findActor("nicknameShadow") != null, "Readable nickname shadow");
            var plate=ImpostorParticipantView.NAMEPLATE;
            check(nickname.getX()==plate.x() && nickname.getY()==plate.y()
                && nickname.getWidth()==plate.width() && nickname.getHeight()==plate.height(), "Nickname inside measured nameplate");
            check(nickname.getStyle().fontColor.equals(com.erni.finalanswer.ui.PlayerColors.light(participant.player().characterId())), "Character-specific nickname color");
            com.badlogic.gdx.scenes.scene2d.Group paper=view.findActor("paper");
            Image front=paper.findActor("paperFront");
            check(front != null && Math.abs(front.getWidth()/front.getHeight()-1120f/1404)<.0001f,
                "Front parchment preserves proportions");
            for (int i=0;i<3;i++) {
                Label clue=paper.findActor("clue"+i);
                clue.validate();
                check(clue.getText().toString().equals(participant.clues().get(i)), "Dynamic clue line");
                check(clue.getGlyphLayout().width<=clue.getWidth()+.1f && clue.getPrefHeight()<=clue.getHeight(),
                    "Clue word fits its padded line");
                check(!clue.isVisible(), "INTRO clue ink is hidden regardless of data");
                check(clue.getX()>=27 && clue.getRight()<=paper.getWidth()-27
                    && clue.getY()>25 && clue.getTop()<paper.getHeight()-35, "Ink inside safe parchment area");
            }
        }
    }

    private void checkLongTextAndUpdates() throws Exception {
        var originals=preview.participants();
        var first=originals.get(0);
        var longPlayer=new com.erni.finalanswer.rooms.RoomSession.Player(first.player().id(),
            "ОченьДлинноеИмяPlayer123456789", false, first.player().characterId(), "ONLINE",false,0);
        var changed=new java.util.ArrayList<>(originals);
        changed.set(0,new ImpostorParticipant(longPlayer,
            java.util.List.of("СВЕРХПРОИЗВОДИТЕЛЬНОСТЬ","ЭЛЕКТРИФИКАЦИЯ","НЕПРЕДСКАЗУЕМОСТЬ")));
        preview.setParticipants(changed);
        preview.render(0);
        checkParticipants();
        com.badlogic.gdx.scenes.scene2d.Group row=stage(preview).getRoot().findActor("players");
        ImpostorParticipantView view=(ImpostorParticipantView)row.getChildren().first();
        Image paper=view.findActor("paperFront");
        var drawable=paper.getDrawable();
        int count=Texture.getNumManagedTextures();
        view.setClues(java.util.List.of("НОВОЕ","СЛОВО","ТЕКСТ"));
        preview.render(0);
        check(paper.getDrawable()==drawable && count==Texture.getNumManagedTextures(), "Updating ink reuses texture");
        Label clue=view.findActor("clue0");
        check(clue.getText().toString().equals("НОВОЕ") && !clue.isVisible(), "Updating hidden ink retains INTRO privacy");
        PaperRevealController visual=new PaperRevealController();
        visual.reveal(); visual.update(.5f); view.presentPaper(visual);
        check(clue.isVisible(), "Ink appears on a revealed front surface");
        visual.reset(); view.presentPaper(visual);
        check(!clue.isVisible(), "Face-down hides previously revealed ink");
        preview.setParticipants(originals);
    }

    private void checkEmptyPreview() throws Exception {
        for (var participant : preview.participants())
            check(participant.clues().stream().allMatch(String::isEmpty), "Preview contains no sample clue words");
    }

    private void checkCharacterLane(ImpostorAssets assets) {
        check(ImpostorParticipantView.AVATAR_OPENING.height()>190, "Large character display area");
        check(ImpostorParticipantView.AVATAR_OPENING.x()+ImpostorParticipantView.AVATAR_OPENING.width()<208,
                "Character lane clears clue paper");
        // Geometry-only stand-in tests future avatar fitting; it draws no placeholder artwork.
        Actor supplied=new Actor(); supplied.setSize(400,100);
        var font=com.erni.finalanswer.ui.UiFonts.body(24);
        try {
            var view=new ImpostorParticipantView(ImpostorPreviewData.participants(3).get(0),supplied,assets,font);
            com.badlogic.gdx.scenes.scene2d.Group avatar=view.findActor("avatar");
            Image frame=view.findActor("portraitFrame");
            var opening=ImpostorParticipantView.AVATAR_OPENING;
            check(frame==null, "No decorative portrait frame");
            check(avatar.getX()>=opening.x() && avatar.getY()>=opening.y()
                && avatar.getX()+avatar.getWidth()*avatar.getScaleX()<=opening.x()+opening.width()+.01f
                && avatar.getY()+avatar.getHeight()*avatar.getScaleY()<=opening.y()+opening.height()+.01f,
                "Avatar fits dedicated character lane");
            check(avatar.getScaleX()==avatar.getScaleY(), "Avatar keeps its proportions");
        } finally { font.dispose(); }
    }

    private void checkBackgroundAnimation() throws Exception {
        Stage stage=stage(preview);
        ImpostorRoomBackground room=stage.getRoot().findActor("impostorBackground");
        int count=Texture.getNumManagedTextures();
        float before=room.getColor().r;
        room.update(8,false);
        float after=room.getColor().r;
        float min=1,max=0;
        for(int i=0;i<32;i++){room.update(.5f,false);min=Math.min(min,room.getColor().r);max=Math.max(max,room.getColor().r);}
        check(max-min>.05f && min>=.939f && max<=1, "Slow illumination covers its bounded cycle");
        after=room.getColor().r;
        preview.resize(1024,768);
        room.update(0,false);
        check(room.getColor().r==after, "Resize does not restart ambience");
        showMainMenu(); setScreen(preview);
        room.update(0,false);
        check(room.getColor().r==after, "Reentry retains ambient position");
        room.update(8,false);
        check(Math.abs(room.getColor().r-before)<.0001f, "Sixteen-second loop closes");
        room.update(2,false); float two=room.getColor().r;
        room.update(14,false);
        for(int i=0;i<120;i++)room.update(1f/60,false);
        check(Math.abs(room.getColor().r-two)<.0001f, "Delta progression independent of frame rate");
        room.update(0,true);
        check(room.getColor().r==1, "Reduced motion uses steady lighting");
        check(count==Texture.getNumManagedTextures(), "No textures allocated for illumination");
    }

    private void checkTimelineMath() {
        PaperRevealController slow=new PaperRevealController(), fast=new PaperRevealController();
        slow.reveal(); fast.reveal();
        for(int i=0;i<5;i++)slow.update(.025f);
        for(int i=0;i<15;i++)fast.update(1f/120);
        check(Math.abs(slow.widthScale()-fast.widthScale())<.00001f,"Frame-rate independent width");
        double progress=slow.progress();
        slow.update(Float.NaN); slow.update(-1);
        check(slow.progress()==progress,"Invalid/negative delta ignored");
        slow.update(Float.POSITIVE_INFINITY);
        check(slow.state()==PaperFlipState.FACE_UP && slow.widthScale()==1,"Infinite stall safely completes");
    }

    private com.badlogic.gdx.scenes.scene2d.Group row() throws Exception {
        return stage(preview).getRoot().findActor("players");
    }

    private void assertPapers(boolean front, int visibleSlots) throws Exception {
        for(Actor actor:row().getChildren()) {
            ImpostorParticipantView view=(ImpostorParticipantView)actor;
            check(view.paperState()==preview.paperState(),"Shared paper state");
            com.badlogic.gdx.scenes.scene2d.Group paper=view.findActor("paper");
            Image face=paper.findActor("paperFront"), back=paper.findActor("paperBack");
            check(face.isVisible()==front && back.isVisible()!=front,"Exactly one correctly oriented texture");
            check(paper.getScaleX()>=0 && paper.getScaleX()<=1 && paper.getScaleY()==1 && paper.getRotation()==0,
                "No mirroring, vertical stretch or in-plane rotation");
            var center=paper.localToStageCoordinates(new com.badlogic.gdx.math.Vector2(paper.getOriginX(),paper.getOriginY()));
            check(Math.abs(center.x-(view.getX()+(208+ImpostorParticipantView.PAPER_WIDTH/2)*view.getScaleX()))<.01f
                && Math.abs(center.y-(view.getY()+(28+ImpostorParticipantView.PAPER_HEIGHT/2)*view.getScaleY()))<.01f,
                "Paper center remains stationary");
            for(int i=0;i<3;i++) {
                Label line=paper.findActor("clue"+i);
                check(line.getParent()==paper,"Ink shares the paper transform");
                check(line.isVisible()==(i<visibleSlots),"Only revealed slots drawn");
                if(line.isVisible()) {
                    line.validate();
                    check(line.getGlyphLayout().width<=line.getWidth()+.1f,"Revealed word fits safe width");
                    for(char c:line.getText().toString().toCharArray())
                        check(line.getStyle().font.getData().hasGlyph(c),"Cyrillic/marker glyph supported");
                }
            }
        }
        float scale=((com.badlogic.gdx.scenes.scene2d.Group)((Group)row().getChildren().first()).findActor("paper")).getScaleX();
        for(Actor actor:row().getChildren())
            check(((Group)actor).findActor("paper").getScaleX()==scale,"All papers share exact progress");
    }

    private void checkPaperSequence() throws Exception {
        preview.resetPapers();
        int textureCount=Texture.getNumManagedTextures();
        assertPapers(false,0);
        capturePaperState("initial-back");
        check(!preview.flipPapersBack(),"No redundant return flip");
        for(int round=1;round<=3;round++) {
            var clues=ImpostorPreviewData.clues(round,preview.participants());
            check(Gdx.input.getInputProcessor().keyDown(com.badlogic.gdx.Input.Keys.R),"Dev reveal command");
            check(preview.revealedRoundCount()==round && preview.paperState()==PaperFlipState.FLIPPING_TO_FRONT,
                "Exactly one accepted round");
            check(!preview.revealClues(java.util.Map.of()) && !preview.flipPapersBack(),"Conflicting requests ignored");
            assertPapers(false,0);
            preview.render(.125f); assertPapers(false,0);
            preview.resize(1024,768);
            showMainMenu(); setScreen(preview); preview.render(0);
            assertPapers(false,0);
            preview.render(.125f);
            assertPapers(true,0);
            check(((Group)row().getChildren().first()).findActor("paper").getScaleX()==0,"Exact edge-on midpoint");
            if(round==1)capturePaperState("flip-midpoint");
            preview.render(.125f); assertPapers(true,round);
            preview.render(.125f); assertPapers(true,round);
            check(preview.paperState()==PaperFlipState.FACE_UP,"Flip completes in 0.50 seconds");
            for(var participant:preview.participants()) {
                Group view=row().findActor("participant:"+participant.player().id());
                for(int slot=0;slot<round;slot++)
                    check(((Label)view.findActor("clue"+slot)).getText().toString().equals(
                        ImpostorPreviewData.clues(slot+1,preview.participants()).get(participant.player().id())),
                        "Earlier clues preserved by stable ID");
                for(int slot=round;slot<3;slot++)
                    check(((Label)view.findActor("clue"+slot)).getText().length()==0,"Future clue not staged");
            }
            capturePaperState("round-"+round);
            if(round<3) {
                check(Gdx.input.getInputProcessor().keyDown(com.badlogic.gdx.Input.Keys.B),"Dev return command");
                check(preview.paperState()==PaperFlipState.FLIPPING_TO_BACK,"Reverse flip begins");
                preview.render(.125f); assertPapers(true,round);
                preview.render(.125f); assertPapers(false,0);
                preview.render(.25f); assertPapers(false,0);
            }
        }
        check(!preview.flipPapersBack() && !preview.revealClues(java.util.Map.of()),"No fourth round or return after third");
        check(Gdx.input.getInputProcessor().keyDown(com.badlogic.gdx.Input.Keys.N),"Dev reset command");
        check(preview.revealedRoundCount()==0,"Reset returns to round-one start");
        assertPapers(false,0);
        check(preview.revealClues(java.util.Map.of()),"Missing submissions accepted");
        preview.render(5); assertPapers(true,1);
        for(Actor view:row().getChildren())check(((Label)((Group)view).findActor("clue0")).getText().toString().equals("—"),
            "Missing clue gets non-revealing dash");
        preview.resetPapers();
        check(preview.revealClues(java.util.Map.of()),"Reset permits new round");
        preview.render(.125f); preview.resetPapers();
        assertPapers(false,0);
        for(Actor view:row().getChildren())for(int i=0;i<3;i++)
            check(((Label)((Group)view).findActor("clue"+i)).getText().length()==0,"Reset clears staged history");
        check(Texture.getNumManagedTextures()==textureCount,"Flips never allocate textures");
    }

    private void checkFinalPreviewControls() throws Exception {
        var demo=new ImpostorFinalPreview(preview);
        check(Gdx.input.getInputProcessor().keyDown(com.badlogic.gdx.Input.Keys.F),"Dev F starts final act");
        preview.render(0);check(preview.state().phase()==ImpostorPhase.EVIDENCE_REVIEW,"Dev discussion phase");
        demo.update(20);preview.render(0);
        FinalVotePresentation view=stage(preview).getRoot().findActor("finalAct");
        check(view.visibleStampCount()==preview.participants().size(),"Dev result restores each sample imprint");
        Gdx.input.getInputProcessor().keyDown(com.badlogic.gdx.Input.Keys.F);
        Gdx.input.getInputProcessor().keyDown(com.badlogic.gdx.Input.Keys.D);
        check(!view.isVisible() && preview.state().phase()==ImpostorPhase.ROUND_CLUE_INPUT,"D cancels final preview without losing collection timer");
        Gdx.input.getInputProcessor().keyDown(com.badlogic.gdx.Input.Keys.F);
        Gdx.input.getInputProcessor().keyDown(com.badlogic.gdx.Input.Keys.N);
        preview.render(0);check(!view.isVisible(),"N resets final preview");
    }

    private void checkAudioBoundaries() throws Exception {
        var field=ImpostorScreen.class.getDeclaredField("audio");field.setAccessible(true);
        var audio=(com.erni.finalanswer.audio.PresentationAudio)field.get(preview);audio.mute(false);
        if(Boolean.getBoolean("impostor.audioQA"))check(audio.loadedCues()>=6,"All six shared-screen WAVs decoded by native audio backend");
        var intro=com.erni.finalanswer.audio.PresentationAudio.Cue.INTRODUCTION;
        var opened=com.erni.finalanswer.audio.PresentationAudio.Cue.VOTING_START;
        var closed=com.erni.finalanswer.audio.PresentationAudio.Cue.VOTING_CLOSED;
        preview.resetPapers();long starts=audio.playCount(intro);
        preview.presentPhase(ImpostorPhase.ROLE_REVEAL,4000,0);preview.presentPhase(ImpostorPhase.ROLE_REVEAL,4000,10);
        check(audio.playCount(intro)==starts,"Opening effect does not replay during role distribution");
        preview.presentPhase(ImpostorPhase.EVIDENCE_REVIEW,30000,1000);
        var clockSnapshot=new FinalActSnapshot("audio-clock",ImpostorPhase.EVIDENCE_REVIEW,1000,31000,0,0,preview.participants().size(),"",java.util.List.of(),java.util.Map.of(),java.util.List.of(),"","");
        preview.presentFinal(clockSnapshot,1000);preview.render(0);
        Image arrow=stage(preview).getRoot().findActor("impostorClockArrow");float first=arrow.getRotation();
        preview.presentFinal(clockSnapshot,16000);preview.render(0);check(Math.abs(arrow.getRotation()+180)<3&&Math.abs(arrow.getRotation()-first)>170,"Rendered clock hand follows authoritative midpoint");
        preview.pause();float held=arrow.getRotation();preview.render(.5f);check(arrow.getRotation()==held,"Clock hand freezes on application pause");preview.resume();preview.clearFinal();
        long votes=audio.playCount(opened),locks=audio.playCount(closed);
        preview.presentPhase(ImpostorPhase.FINAL_VOTING,50000,30000);preview.presentPhase(ImpostorPhase.FINAL_VOTING,50000,30001);
        check(audio.playCount(opened)==votes+1,"Voting starts once");
        preview.presentPhase(ImpostorPhase.VOTING_LOCKED,51000,49000);preview.presentPhase(ImpostorPhase.VOTING_LOCKED,51000,49001);
        check(audio.playCount(closed)==locks+1,"Official early vote lock sounds once");
        preview.resetPapers();
    }

    private void checkFinalVoting() throws Exception {
        var original=preview.participants();int textures=Texture.getNumManagedTextures();
        for(int count:new int[]{3,4}) {
            preview.setParticipants(ImpostorPreviewData.participants(count));
            String a=preview.participants().get(0).player().id(),b=preview.participants().get(1).player().id();
            var counts=new java.util.LinkedHashMap<String,Integer>();for(var p:preview.participants())counts.put(p.player().id(),0);counts.put(a,1);counts.put(b,count-1);
            var targets=new java.util.ArrayList<String>();targets.add(a);for(int i=1;i<count;i++)targets.add(b);
            if(count==4){targets.clear();for(int i=0;i<count;i++)targets.add(b);counts.put(a,0);counts.put(b,count);}
            var discussion=new FinalActSnapshot("final-"+count,ImpostorPhase.EVIDENCE_REVIEW,1000,31000,0,0,count,"",java.util.List.of(),java.util.Map.of(),java.util.List.of(),"","");
            preview.presentPhase(ImpostorPhase.EVIDENCE_REVIEW,31000,1000);preview.presentFinal(discussion,1000);preview.render(0);
            FinalVotePresentation view=stage(preview).getRoot().findActor("finalAct");
            int[] impactSounds={0};view.onImpact(()->impactSounds[0]++);
            check(view.isVisible() && !stage(preview).getRoot().findActor("finalCards").isVisible(),"Discussion reserves table; no premature final cards");
            finalCaptureNow=1600;capturePaperState("final-discussion");
            var voting=new FinalActSnapshot("final-"+count,ImpostorPhase.FINAL_VOTING,31000,51000,0,1,count,"",java.util.List.of(),java.util.Map.of(),java.util.List.of(),"","");
            preview.presentFinal(voting,32000);preview.render(0);view.update(32000);check(view.findActor("finalProgress")==null,"No production counter overlay");
            finalCaptureNow=32000;capturePaperState("final-voting");
            long reveal=52000;
            var snapshot=new FinalActSnapshot("final-"+count,ImpostorPhase.FINAL_VOTE_REVEAL,reveal,reveal+5000,reveal,count,count,"final-"+count+":1",targets,counts,java.util.List.of(),"","");
            preview.presentFinal(snapshot,reveal);preview.render(0);view.update(reveal+1019);
            check(view.stampCount()==count && view.visibleStampCount()==0,"One prepared imprint per vote; none before impact");
            for(int i=0;i<count;i++){
                long impact=reveal+com.erni.finalanswer.gameplay.impostor.FinalRevealTiming.LEAD+i*com.erni.finalanswer.gameplay.impostor.FinalRevealTiming.INTERVAL+com.erni.finalanswer.gameplay.impostor.FinalRevealTiming.IMPACT;
                view.update(i==0?impact+200:impact);check(view.visibleStampCount()==i+1,"Exactly one additional imprint per impact");
                for(int j=0;j<=i;j++)check(view.findActor("voteStamp:"+j).isVisible(),"Earlier stamps persist");
                preview.presentFinal(snapshot,impact);view.update(impact);check(view.visibleStampCount()==i+1,"Duplicate snapshot cannot replay or erase stamps");
                if(i==1){finalCaptureNow=impact;capturePaperState("final-mid-reveal");}
            }
            finalCaptureNow=reveal+4000;view.update(finalCaptureNow);capturePaperState("final-all-stamps");
            check(view.visibleStampCount()==count,"All votes remain visible after reveal");
            check(impactSounds[0]==count,"Each live impact triggers one cue, duplicates do not");
            // The red ink uses the supplied transparent asset, preserving its ratio and independent transforms.
            Image mark=view.findActor("voteStamp:0");check(Math.abs(mark.getWidth()/mark.getHeight()-1286f/1223)<.001f,"Imprint artwork proportions");
            for(var p:preview.participants()){
                Group card=view.findActor("finalCard:"+p.player().id());check(card!=null,"One final card per active suspect");
                check(((Label)card.findActor("finalNickname")).getText().toString().equals(p.player().name()),"Final card identity binding");
                check(card.getX()>0 && card.getX()+card.getWidth()<=VotingLayout.TABLE_RIGHT+1 && card.getY()+card.getHeight()<510,"Final cards clear clock and portrait row");
            }
            var announcement=new FinalActSnapshot("final-"+count,ImpostorPhase.SUSPECT_ANNOUNCEMENT,58000,61500,reveal,count,count,snapshot.sequenceId(),targets,counts,java.util.List.of(b),"","");
            preview.presentFinal(announcement,59000);preview.render(0);view.update(59000);check(((Label)view.findActor("finalTitle")).getText().toString().equals("ПРИГОВОР ВЫНЕСЕН!"),"Suspect announcement before identity");
            finalCaptureNow=59000;capturePaperState("final-suspect");
            var identity=new FinalActSnapshot("final-"+count,ImpostorPhase.IMPOSTOR_REVEAL,61500,65500,reveal,count,count,snapshot.sequenceId(),targets,counts,java.util.List.of(b),b,"IMPOSTOR_CAUGHT");
            preview.presentFinal(identity,62500);preview.render(0);view.update(64899);
            Label identityName=view.findActor("finalTitle");check(identityName.getText().toString().equals("ПРИГОВОР ВЫНЕСЕН!"),"Identity name waits for the 3.4-second musical accent");
            view.reducedMotion(true);view.update(64899);check(identityName.getText().toString().equals("ПРИГОВОР ВЫНЕСЕН!"),"Reduced motion preserves suspense pause");
            view.update(64900);check(identityName.getText().toString().equals("САМОЗВАНЕЦ РАСКРЫТ!")&&identityName.getColor().a==1,"Identity appears at musical accent with reduced motion");
            check(identityName.getStyle().font.getData().hasGlyph('Ж')&&identityName.getStyle().font.getData().hasGlyph('Я'),"Reveal handwriting contains Cyrillic glyphs");
            view.reducedMotion(false);view.update(65200);finalCaptureNow=65200;capturePaperState("final-identity");
            preview.presentFinal(identity,66000);preview.render(0);view.update(66000);
            Group doomed=view.findActor("finalCard:"+b);Group doomedAvatar=doomed.findActor("finalAvatar");if(doomedAvatar!=null)check(doomedAvatar.getColor().a<.4f,"Caught impostor visibly fades on the final card");
            Actor top=stage(preview).getRoot().findActor("participant:"+b);if(doomedAvatar!=null)check(!((Group)top).findActor("eliminationStatus").isVisible(),"Redundant elimination overlay stays out of the ceremony");
            view.update(69000);if(doomedAvatar!=null)check(Math.abs(doomedAvatar.getColor().a-.48f)<.01f,"Ghost remnant persists");
            var escapedIdentity=new FinalActSnapshot("final-"+count,ImpostorPhase.IMPOSTOR_REVEAL,61500,65500,reveal,count,count,snapshot.sequenceId(),targets,counts,java.util.List.of(b),b,"IMPOSTOR_ESCAPED");preview.presentFinal(escapedIdentity,69000);preview.render(0);if(doomedAvatar!=null)check(doomedAvatar.getColor().a==1,"Escaped impostor never remains eliminated");
            preview.presentFinal(identity,69000);preview.render(0);
            var result=new FinalActSnapshot("final-"+count,ImpostorPhase.RESULT,65500,0,reveal,count,count,snapshot.sequenceId(),targets,counts,java.util.List.of(b),b,"IMPOSTOR_CAUGHT");
            preview.presentFinal(result,66500);preview.render(0);view.update(66500);finalCaptureNow=66500;capturePaperState("final-result");
            check(view.visibleStampCount()==count,"Final result keeps every stamp");
            preview.resize(1024,768);showMainMenu();setScreen(preview);check(view.visibleStampCount()==count,"Reentry retains final imprints");
            preview.resetPapers();check(!view.isVisible() && view.visibleStampCount()==0,"Final reset clears only presentation");
            preview.presentFinal(snapshot,reveal+4000);view.update(reveal+4000);check(view.visibleStampCount()==count,"Reconnect late in reveal restores all impacts without replay");
            check(impactSounds[0]==count,"Reconnect never replays old impact sounds");
            view.reducedMotion(true);view.update(reveal+4000);
            check(!view.findActor("woodenVoteStamp").isVisible()&&view.visibleStampCount()==count,"Reduced motion keeps every imprint without flying stamp");view.reducedMotion(false);
            var lobby=new com.google.gson.JsonObject();lobby.addProperty("sessionId","new-ready-session");lobby.addProperty("phase","READY");lobby.addProperty("round",0);
            new com.erni.finalanswer.network.ImpostorSuspicionAdapter(null,preview).apply(lobby,0);
            check(!view.isVisible() && view.visibleStampCount()==0,"A non-final/new-room snapshot clears the previous final reveal");
        }
        preview.clearFinal();preview.presentPhase(ImpostorPhase.INTRO,0,0);preview.setParticipants(original);
        check(Texture.getNumManagedTextures()==textures,"Final act borrows textures/fonts without duplicate loads");
    }

    private void checkOfflineClueControls() throws Exception {
        var original=preview.participants();
        var demo=new ImpostorCluePreview(preview);
        for(int count:new int[]{3,4}) {
            preview.setParticipants(ImpostorPreviewData.participants(count));
            check(Gdx.input.getInputProcessor().keyDown(com.badlogic.gdx.Input.Keys.D),"Dev collection start");
            for(int i=0;i<count;i++)check(Gdx.input.getInputProcessor().keyDown(com.badlogic.gdx.Input.Keys.C),"Dev simulated accepted clue");
            preview.render(.5f);check(preview.paperState()==PaperFlipState.FACE_UP,"Dev early completion reveal");
            preview.flipPapersBack();preview.render(.5f);
            Gdx.input.getInputProcessor().keyDown(com.badlogic.gdx.Input.Keys.D);
            Gdx.input.getInputProcessor().keyDown(com.badlogic.gdx.Input.Keys.C);
            demo.update(10);preview.render(.5f);
            check(preview.revealedRoundCount()==2,"Dev timeout reveals next round");
            Group last=(Group)row().getChildren().peek();
            check(((Label)last.findActor("clue1")).getText().toString().equals("—"),"Dev missing clue marker");
            Gdx.input.getInputProcessor().keyDown(com.badlogic.gdx.Input.Keys.N);
        }
        preview.presentPhase(ImpostorPhase.INTRO,0,0);preview.setParticipants(original);
    }

    private void checkAuthoritativePresentation() throws Exception {
        var original=preview.participants();
        for(int count:new int[]{3,4}) {
            var adapter=new com.erni.finalanswer.network.ImpostorSuspicionAdapter(null,preview);
            var mini=new com.google.gson.JsonObject();
            mini.addProperty("sessionId","network-"+count);mini.addProperty("phase","ROUND_CLUE_INPUT");
            mini.addProperty("round",1);mini.addProperty("deadline",11000);mini.addProperty("revealSequence",0);
            var roster=new com.google.gson.JsonArray();
            for(var participant:ImpostorPreviewData.participants(count)) {
                var p=new com.google.gson.JsonObject();p.addProperty("id",participant.player().id());p.addProperty("name",participant.player().name());
                p.addProperty("characterId",participant.player().characterId());roster.add(p);
            }
            mini.add("participants",roster);var history=new com.google.gson.JsonArray();mini.add("revealedClues",history);
            adapter.apply(mini,1000);preview.render(0);
            check(preview.participants().size()==count,"Authoritative roster");
            check(preview.paperState()==PaperFlipState.FACE_DOWN,"Network initial back");
            check(((Label)stage(preview).getRoot().findActor("impostorTimerLabel")).getText().toString().equals("ДО КОНЦА РАУНДА"),"Authoritative timer label");
            check(((Label)stage(preview).getRoot().findActor("impostorTimerValue")).getText().toString().equals("00:10"),"Authoritative timer value");
            capturePaperState("network-initial");
            for(int round=1;round<=3;round++) {
                var words=new com.google.gson.JsonObject();
                for(var p:preview.participants())words.addProperty(p.player().id(),round==2?"—":"СВЕТ");history.add(words);
                mini.addProperty("round",round);mini.addProperty("phase","ROUND_CLUE_REVEAL");mini.addProperty("revealSequence",round);
                adapter.apply(mini,2000);preview.render(.125f);float scale=((Group)row().getChildren().first()).findActor("paper").getScaleX();
                adapter.apply(mini,2001);
                check(((Group)row().getChildren().first()).findActor("paper").getScaleX()==scale,"Duplicate sequence does not restart flip");
                preview.resize(1024,768);preview.render(.375f);
                check(preview.revealedRoundCount()==round && preview.paperState()==PaperFlipState.FACE_UP,"Authoritative synchronized reveal");
                capturePaperState("network-round-"+round);
                if(round<3){mini.addProperty("phase","ROUND_CLUE_INPUT");mini.addProperty("round",round+1);adapter.apply(mini,3000);preview.render(.5f);}
            }
            var reconnect=new com.erni.finalanswer.network.ImpostorSuspicionAdapter(null,preview);
            mini.addProperty("phase","EVIDENCE_REVIEW");reconnect.apply(mini,4000);preview.render(0);
            check(preview.revealedRoundCount()==3 && preview.paperState()==PaperFlipState.FACE_UP,"Reconnect restores history without gameplay advancement");
        }
        preview.presentPhase(ImpostorPhase.INTRO,0,0);preview.setParticipants(original);
    }

    private void checkConnectionQr() throws Exception {
        int baseline=Texture.getNumManagedTextures();var font=com.erni.finalanswer.ui.UiFonts.body(20);
        var style=new com.badlogic.gdx.scenes.scene2d.ui.TextButton.TextButtonStyle();style.font=font;style.fontColor=com.badlogic.gdx.graphics.Color.WHITE;
        var qr=new com.erni.finalanswer.ui.lobby.ConnectionPanel(com.erni.finalanswer.network.HostingAccess.external("http://192.168.1.42:18427"),font,style);
        try{
            qr.room("ABCDEF");int allocated=Texture.getNumManagedTextures();
            check(qr.connectionUrl().equals("http://192.168.1.42:18427/?room=ABCDEF"),"QR only carries public URL and room code");
            qr.room("ZABCDE");check(Texture.getNumManagedTextures()==allocated,"QR replacement disposes previous texture");
            qr.setBounds(0,0,600,150);qr.validate();qr.act(1.1f);check(Texture.getNumManagedTextures()==allocated,"Network polling does not reload an unchanged QR");
        }finally{qr.dispose();font.dispose();}
        check(Texture.getNumManagedTextures()==baseline,"Lobby QR resources disposed");
    }

    private void checkStage9Settings() throws Exception {
        int textures=Texture.getNumManagedTextures();
        var font=com.erni.finalanswer.ui.UiFonts.body(20);
        final com.erni.finalanswer.gameplay.impostor.ImpostorSettings[] saved={null};
        ImpostorSettingsPanel settings=new ImpostorSettingsPanel(font,value->saved[0]=value);stage(preview).addActor(settings);
        try{
            settings.update(com.erni.finalanswer.gameplay.impostor.ImpostorSettings.defaults(),true);
            Actor open=settings.findActor("openImpostorSettings");open.fire(new com.badlogic.gdx.scenes.scene2d.utils.ChangeListener.ChangeEvent());
            var rounds=(com.badlogic.gdx.scenes.scene2d.ui.TextField)settings.findActor("impostorSettingRounds");rounds.setText("2");
            settings.findActor("applyImpostorSettings").fire(new com.badlogic.gdx.scenes.scene2d.utils.ChangeListener.ChangeEvent());
            check(saved[0]!=null&&saved[0].roundCount()==2,"Native settings send validated configuration");
            capturePaperState("stage9-host-settings");
            saved[0]=null;rounds.setText("9");settings.findActor("applyImpostorSettings").fire(new com.badlogic.gdx.scenes.scene2d.utils.ChangeListener.ChangeEvent());check(saved[0]==null,"Native invalid settings are not sent");
            check(stage(preview).getKeyboardFocus()==rounds,"Invalid field receives keyboard focus");
            check(settings.closeIfOpen(),"Escape can dismiss settings before leaving game");
            open.fire(new com.badlogic.gdx.scenes.scene2d.utils.ChangeListener.ChangeEvent());
            settings.findActor("resetImpostorSettings").fire(new com.badlogic.gdx.scenes.scene2d.utils.ChangeListener.ChangeEvent());
            check(rounds.getText().equals("3")&&saved[0]==null,"Defaults remain a draft until applied");
            settings.update(com.erni.finalanswer.gameplay.impostor.ImpostorSettings.defaults(),false);check(!open.isVisible(),"Nonhost/active match cannot open settings");
        }finally{settings.remove();settings.dispose();font.dispose();}
        check(Texture.getNumManagedTextures()==textures,"Settings textures released");
    }

    private void checkStage8Presentation() throws Exception {
        preview.resetPapers();preview.presentPhase(ImpostorPhase.ROLE_REVEAL,5000,1000);
        preview.presentPhase(ImpostorPhase.ROUND_CLUE_INPUT,15000,5000);preview.render(.2f);
        Label intro=stage(preview).getRoot().findActor("impostorRoundIntro");
        check(intro.isVisible()&&intro.getText().toString().equals("РАУНД 1"),"Short nonblocking round introduction");
        var field=ImpostorScreen.class.getDeclaredField("transition");field.setAccessible(true);
        var transition=(com.erni.finalanswer.presentation.PhaseTransition)field.get(preview);
        float progress=transition.progress();preview.pause();preview.render(.2f);check(transition.progress()==progress,"Application pause freezes new effects");preview.resume();
        check(!transition.active(),"Resume cancels obsolete transition");
        preview.presentPhase(ImpostorPhase.FINAL_VOTING,25000,5000);preview.render(.2f);
        capturePaperState("stage8-voting-transition");
        preview.presentPhase(ImpostorPhase.ROUND_CLUE_INPUT,35000,5000);preview.render(.2f);
        capturePaperState("stage8-round-intro");
        int textures=Texture.getNumManagedTextures();for(int i=0;i<60;i++)preview.render(1/60f);
        check(textures==Texture.getNumManagedTextures(),"Atmospheric frames allocate no textures");
        check(preview.state().phase()==ImpostorPhase.ROUND_CLUE_INPUT,"Effects cannot advance server phase");
        transition.cancel();preview.resetPapers();
    }

    private void checkLifecycleResults() throws Exception {
        ImpostorLifecyclePanel panel=stage(preview).getRoot().findActor("impostorLifecycle");
        for(int count:new int[]{3,4}){
            preview.setParticipants(ImpostorPreviewData.participants(count));
            var roster=preview.participants();var ids=roster.stream().map(p->p.player().id()).toList();
            var ballots=new java.util.LinkedHashMap<String,String>();
            var statuses=new java.util.ArrayList<ImpostorMatchResult.Participant>();
            var clues=new java.util.LinkedHashMap<String,String>();
            for(int i=0;i<count;i++){
                ballots.put(ids.get(i),ids.get(i==0?1:0));clues.put(ids.get(i),"ДЛИННАЯПОДСКАЗКА");
                statuses.add(new ImpostorMatchResult.Participant(ids.get(i),i==0?"IMPOSTOR":"INNOCENT",i!=0,i==0?count-1:i==1?1:0));
            }
            var result=new ImpostorMatchResult("qa-results-"+count,1,"IMPOSTOR_CAUGHT",ids.getFirst(),ImpostorMatchResult.Side.INNOCENTS,statuses,ballots,java.util.List.of(),java.util.List.of(clues,clues,clues),java.util.List.of(ids.getFirst()),new ImpostorMatchResult.Statistics(count,3,count*3,count,0));
            panel.result(result,roster,true);panel.update(.6f,false);
            check(panel.findActor("impostorReplay").isVisible(),"Host replay visible");
            check(panel.findActor("impostorReturnLobby").isVisible(),"Host lobby visible");
            for(String id:ids)check(panel.findActor("resultParticipant:"+id)!=null,"Each active result present");
            com.badlogic.gdx.scenes.scene2d.ui.ScrollPane summary=panel.findActor("impostorRoundSummaryScroll");summary.validate();
            Label roundSummary=panel.findActor("impostorRoundSummary");String original=roundSummary.getText().toString();
            roundSummary.setText(original+"\nLONG HISTORY\n".repeat(30));summary.invalidateHierarchy();summary.validate();
            check(summary.getMaxY()>0,"Overflowing clue history remains scrollable");
            roundSummary.setText(original);summary.invalidateHierarchy();summary.validate();
            capturePaperState("stage7-results-"+count);
            int actors=panel.getChildren().size;panel.result(result,roster,true);check(panel.getChildren().size==actors,"Duplicate result does not rebuild panel");
            panel.result(result,roster,false);check(!panel.findActor("impostorReplay").isVisible(),"Nonhost replay hidden");
            panel.hidePanel();check(panel.findActor("resultParticipant:"+ids.getFirst())==null,"Reset removes old results");
            panel.waiting("qa-selection-"+count,roster.stream().map(p->p.player()).toList(),ids.subList(0,3),true,false);
            var start=(com.badlogic.gdx.scenes.scene2d.ui.TextButton)panel.findActor("impostorStart");
            check(!start.isDisabled(),"Three selected players can start");
            var choice=(com.badlogic.gdx.scenes.scene2d.ui.CheckBox)panel.findActor("impostorSelect:"+ids.getFirst());
            choice.setChecked(false);panel.status("",false);check(start.isDisabled(),"Two selected players cannot start, including after status refresh");
            choice.setChecked(true);check(!start.isDisabled(),"Valid selection reenables start");panel.status("Отправляем…",true);check(start.isDisabled(),"Pending command disables start");panel.status("",false);panel.hidePanel();
        }
    }

    private void capturePaperState(String state) throws Exception {
        for(int[] size:new int[][]{{1920,1080},{1280,720},{1024,768}}) {
            FrameBuffer target=new FrameBuffer(Pixmap.Format.RGBA8888,size[0],size[1],false);
            try {
                target.begin(); preview.resize(size[0],size[1]);
                if(state.startsWith("final-")){
                    FinalVotePresentation finalView=stage(preview).getRoot().findActor("finalAct");finalView.update(finalCaptureNow);
                    com.badlogic.gdx.utils.ScreenUtils.clear(0,0,0,1);stage(preview).getViewport().apply();stage(preview).draw();
                }else preview.render(0);
                Pixmap pixels=Pixmap.createFromFrameBuffer(0,0,size[0],size[1]);
                try {
                    var file=Gdx.files.absolute(System.getProperty("impostor.qa.artifacts")+(state.startsWith("stage9-")?"/stage9/":state.startsWith("stage8-")?"/stage8/":state.startsWith("stage7-")?"/stage7/":state.startsWith("final-")?"/stage6/":state.startsWith("network-")?"/stage5/":state.startsWith("suspicion-")?"/stage4/":"/stage3/")
                        +preview.participants().size()+"players-"+state+"-"+size[0]+"x"+size[1]+".png");
                    file.parent().mkdirs(); PixmapIO.writePNG(file,pixels,-1,true);
                } finally { pixels.dispose(); }
            } finally { target.end(); target.dispose(); }
        }
        preview.resize(Gdx.graphics.getWidth(),Gdx.graphics.getHeight());
    }

    private void checkIdentityBinding() throws Exception {
        var original=preview.participants();
        var swapped=new java.util.ArrayList<ImpostorParticipant>();
        for(int i=original.size()-1;i>=0;i--) {
            var player=original.get(i).player();
            swapped.add(new ImpostorParticipant(new com.erni.finalanswer.rooms.RoomSession.Player(
                player.id(),"Игрок "+i,false,player.characterId(),"ONLINE",false,0),java.util.List.of("","","")));
        }
        preview.setParticipants(swapped); preview.render(0); checkParticipants();
        var clues=ImpostorPreviewData.clues(1,preview.participants());
        check(preview.revealClues(clues),"Reordered roster reveal"); preview.render(.5f);
        for(var participant:swapped) {
            Group view=row().findActor("participant:"+participant.player().id());
            check(((Label)view.findActor("nickname")).getText().toString().equals(participant.player().name()),
                "Frame text follows assigned player, not cell or fixture name");
            check(((Label)view.findActor("clue0")).getText().toString().equals(clues.get(participant.player().id())),
                "Clues follow identity after reordering and rename");
        }
        preview.setParticipants(original);
    }

    /** Real frame deltas exercise the complete visible transition, beyond checkpoint screenshots. */
    private boolean checkLiveTransitions() throws Exception {
        if(liveStarted==0)liveStarted=System.nanoTime();
        check(System.nanoTime()-liveStarted<30_000_000_000L,"Live animation completes without stalling");
        if(liveStep==3)return checkLiveFinalReveal();
        if(liveStep==0) {
            check(preview.revealClues(ImpostorPreviewData.clues(preview.revealedRoundCount()+1,preview.participants())),
                "Real-time reveal starts: count="+liveCount+" step="+liveStep+" state="+preview.paperState()+" round="+preview.revealedRoundCount());
            liveStep=1;
        } else if(liveStep==1 && preview.paperState()==PaperFlipState.FACE_UP) {
            assertPapers(true,preview.revealedRoundCount());
            if(preview.revealedRoundCount()<3) {
                check(preview.flipPapersBack(),"Real-time return starts"); liveStep=2;
            } else if(liveCount==3) {
                preview.setParticipants(ImpostorPreviewData.participants(4)); liveCount=4; liveStep=0;
            } else liveStep=3;
        } else if(liveStep==2 && preview.paperState()==PaperFlipState.FACE_DOWN) {
            assertPapers(false,0); liveStep=0;
        }
        return false;
    }

    /** Full real-time OpenGL stamp motion, independent of deterministic checkpoint captures. */
    private boolean checkLiveFinalReveal() throws Exception {
        if(liveFinalStarted==0){
            preview.setParticipants(ImpostorPreviewData.participants(liveFinalCount));
            var targets=new java.util.ArrayList<String>();var counts=new java.util.LinkedHashMap<String,Integer>();
            for(var p:preview.participants())counts.put(p.player().id(),0);
            for(int i=0;i<liveFinalCount;i++){String target=preview.participants().get(i%2).player().id();targets.add(target);counts.put(target,counts.get(target)+1);}
            preview.presentFinal(new FinalActSnapshot("live-final-"+liveFinalCount,ImpostorPhase.FINAL_VOTE_REVEAL,1000000,1005000,1000000,
                liveFinalCount,liveFinalCount,"live-final-"+liveFinalCount+":1",targets,counts,java.util.List.of(),"",""),1000000);
            liveFinalStarted=System.nanoTime();liveVisible=0;liveStampMin=Float.POSITIVE_INFINITY;liveStampMax=Float.NEGATIVE_INFINITY;
        }
        FinalVotePresentation view=stage(preview).getRoot().findActor("finalAct");
        int visible=view.visibleStampCount();check(visible>=liveVisible,"Live imprints never disappear");liveVisible=visible;
        Actor wood=view.findActor("woodenVoteStamp");if(wood!=null && wood.isVisible()){liveStampMin=Math.min(liveStampMin,wood.getY());liveStampMax=Math.max(liveStampMax,wood.getY());}
        if(System.nanoTime()-liveFinalStarted<(com.erni.finalanswer.gameplay.impostor.FinalRevealTiming.duration(liveFinalCount)+200)*1_000_000)return false;
        check(visible==liveFinalCount,"Live OpenGL reveals one retained imprint per vote");
        check(liveStampMax-liveStampMin>50,"Live wooden stamp descends, impacts, rises and moves between cards");
        if(liveFinalCount==3){liveFinalCount=4;liveFinalStarted=0;return false;}
        return true;
    }

    private void checkSuspicionEnvelope() throws Exception {
        int textures=Texture.getNumManagedTextures(),round=preview.revealedRoundCount();
        PaperFlipState prior=preview.paperState();
        check(Gdx.input.getInputProcessor().keyDown(com.badlogic.gdx.Input.Keys.V),"Dev suspicion control");
        preview.render(.25f);
        SuspicionEnvelope envelope=stage(preview).getRoot().findActor("suspicionEnvelope");
        check(envelope.state()==SuspicionEnvelope.State.OPEN,"OPEN envelope while accepting suspicions");
        Label counter=envelope.findActor("suspicionProgress");
        int eligible=preview.participants().size()+2;
        check(counter.getText().toString().equals("ПОДОЗРЕНИЙ ПОЛУЧЕНО: 0/"+eligible),"Aggregate count includes spectators");
        Label timer=stage(preview).getRoot().findActor("impostorTimerValue");
        check(timer.getText().toString().equals("00:05"),"Server-based five-second timer");
        showMainMenu();setScreen(preview);preview.resize(1024,768);
        suspicionDemo.update(2.5f);preview.render(.1f);
        check(counter.getText().toString().equals("ПОДОЗРЕНИЙ ПОЛУЧЕНО: 3/"+eligible),"Dynamic submission aggregate");
        capturePaperState("suspicion-open");
        suspicionDemo.update(2.5f);preview.render(0);
        check(envelope.state()==SuspicionEnvelope.State.CLOSED,"CLOSED after authoritative finalization");
        check(timer.getText().toString().equals("00:00"),"Finalized timer is zero");
        capturePaperState("suspicion-closed");
        preview.render(.4f);
        check(envelope.state()==SuspicionEnvelope.State.SEALED,"SEALED presentation after close");
        capturePaperState("suspicion-sealed");
        for(String name:new String[]{"envelope0","envelope1","envelope2"}) {
            Actor image=envelope.findActor(name);
            check(image.getX()>=0 && image.getRight()<=600,"Envelope aspect-preserving bounds");
        }
        preview.render(1.6f);
        check(!envelope.active() && timer.getText().toString().equals("—"),"Previous timer context restored");
        check(preview.revealedRoundCount()==round && preview.paperState()==prior,"Paper context remains intact");
        suspicionDemo.start();preview.render(.25f);
        check(envelope.active(),"Repeated preview can start a fresh phase");
        check(Gdx.input.getInputProcessor().keyDown(com.badlogic.gdx.Input.Keys.N),"Reset cancels suspicion preview");
        preview.render(0);check(!envelope.active(),"Reset hides envelope");
        check(Texture.getNumManagedTextures()==textures,"Envelope transitions reuse scoped textures");
    }

    private static final class AssetScope implements AutoCloseable {
        final ImpostorAssets assets = new ImpostorAssets();
        @Override public void close() { assets.dispose(); }
    }

    @Override public void dispose() {
        if (preview != null) {
            if (getScreen() == preview) showMainMenu();
            preview.dispose();
        }
        super.dispose();
    }
}
