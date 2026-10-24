package com.erni.finalanswer.screens;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.Input;
import com.badlogic.gdx.ScreenAdapter;
import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.g2d.BitmapFont;
import com.badlogic.gdx.scenes.scene2d.*;
import com.badlogic.gdx.scenes.scene2d.ui.*;
import com.badlogic.gdx.utils.Align;
import com.badlogic.gdx.utils.ScreenUtils;
import com.badlogic.gdx.utils.viewport.FitViewport;
import com.erni.finalanswer.FinalAnswerGame;
import com.erni.finalanswer.gameplay.questions.*;
import com.erni.finalanswer.gameplay.round.RoundController;
import com.erni.finalanswer.gameplay.round.RoundPhase;
import com.erni.finalanswer.ui.UiFonts;
import com.erni.finalanswer.ui.play.*;
import com.erni.finalanswer.ui.clock.ClockTimerActor;
import java.util.Locale;

/** Local host presentation. Room networking remains owned by FinalAnswerGame. */
public class PlayScreen extends ScreenAdapter {
    private final FinalAnswerGame game;
    private final com.erni.finalanswer.audio.QuestionAudio questionAudio;
    private final String audioSession=java.util.UUID.randomUUID().toString();
    private final Stage stage = new Stage(new FitViewport(1600, 900));
    private final RoundController round;
    private com.erni.finalanswer.network.NetworkRoundAdapter network;
    private com.erni.finalanswer.network.RealtimeClient connection;
    private QuestionPlayers players;
    private final Label roster;
    private String rosterText = "";
    private final BitmapFont smallFont = UiFonts.body(19);
    private final Texture pixel;
    private final ClockTimerActor clock;
    private final QuizBackground background;
    private final Label heading;
    private final CinematicQuestion question;
    private final Label hint;
    private final Label countdown;
    private final AnswersPresentationActor answers = new AnswersPresentationActor();
    private java.util.function.Consumer<Question> resultsHandler;
    private boolean resultsDispatched;
    private boolean disposed;
    private String lastStatus = "";
    private boolean paused, applicationPaused;

    public PlayScreen(FinalAnswerGame game) { this(game, new DemoQuestionSource()); }
    public PlayScreen(FinalAnswerGame game, com.erni.finalanswer.network.RealtimeClient connection) {
        this(game, new DemoQuestionSource());
        network = new com.erni.finalanswer.network.NetworkRoundAdapter(round, connection);
        this.connection=connection;
        if(game.getRoomCharacters()!=null){players=new QuestionPlayers(game.getRoomCharacters(),pixel);stage.addActor(players);layoutClock();}
    }

    /** Audio adapters can subscribe before show(), then finish with the generation token from QUESTION_STARTED. */
    public QuestionPlayers playerCharacters(){return players;}

    public com.erni.finalanswer.gameplay.presentation.QuestionPresentationController presentation() {
        return round.presentation();
    }

    /** Optional render-thread handoff after the result hold. Null keeps the local demo cycling. */
    public void setResultsHandler(java.util.function.Consumer<Question> handler) { resultsHandler = handler; }

    public PlayScreen(FinalAnswerGame game, QuestionSource source) {
        this.game = java.util.Objects.requireNonNull(game);
        questionAudio=game.getAudio().questions();
        round = new RoundController(source);
        Pixmap image = new Pixmap(1, 1, Pixmap.Format.RGBA8888);
        image.setColor(Color.WHITE);
        image.fill();
        pixel = new Texture(image);
        image.dispose();
        background = new QuizBackground(pixel);
        background.setBounds(0, 0, stage.getViewport().getWorldWidth(), stage.getViewport().getWorldHeight());
        stage.addActor(background);
        clock = new ClockTimerActor(round.answerDurationSeconds());
        heading = label("", smallFont, "AD7777");
        roster = label("", smallFont, "C9C2BD");
        roster.setWrap(true);
        stage.addActor(roster);
        question = new CinematicQuestion();
        round.presentation().addListener(event -> {
            if (event.type() == com.erni.finalanswer.gameplay.presentation.QuestionPresentationController.EventType.TIMER_STARTED)
                if (network == null) clock.start();
        });
        hint = label("", smallFont, "888181");
        countdown = label("", smallFont, "AD7777");
        countdown.setName("roundCountdown");
        stage.addActor(answers);
        stage.addActor(countdown);
        stage.addActor(hint);
        stage.addActor(heading);
        stage.addActor(question);
        layoutClock();
        stage.addActor(clock);
        stage.addListener(new InputListener() {
            @Override public boolean keyDown(InputEvent event, int key) {
                if (key == Input.Keys.ESCAPE) {
                    Gdx.app.postRunnable(() -> { if (game.getScreen() == PlayScreen.this) game.showMainMenu(); });
                    return true;
                }
                if (key == Input.Keys.SPACE) {
                    if (network != null || paused || applicationPaused) return true;
                    if (round.next()) beginRound();
                    return true;
                }
                if (key == Input.Keys.R) {
                    if (network != null || paused || applicationPaused) return true;
                    if (round.revealAnswer()) updatePresentation();
                    return true;
                }
                if (key == Input.Keys.P) {
                    if (network != null) return true;
                    paused = !paused;
                    updatePresentation();
                    return true;
                }
                return false;
            }
        });
    }

    private static Label label(String text, BitmapFont font, String color) {
        Label label = new Label(text, new Label.LabelStyle(font, Color.valueOf(color)));
        label.setAlignment(Align.center);
        label.setTouchable(Touchable.disabled);
        return label;
    }

    private void beginRound() {
        resultsDispatched = false;
        String key=network==null?audioSession+":"+round.presentation().generation():connection.snapshot().get("gameId").getAsString()+":"+round.question().id();
        questionAudio.question(key,round.number());
        game.getAudio().hostVoice().scopeGain(1);
        if(network==null||connection.snapshot().get("phase").getAsString().equals("QUESTION_PRESENTATION"))
            game.getAudio().hostVoice().playQuestion(round.question().id(),"question:"+key,null);
        background.showForQuestion(round.number(), game.getSettings().reducedMotion());
        clock.reset();
        clock.setReducedMotion(game.getSettings().reducedMotion());
        lastStatus = "";
        countdown.setText("");
        heading.setText(String.format(Locale.ROOT, "%s %02d", game.getTexts().get("play.question"), round.number()));
        question.prepare(round.question(), stage.getViewport().getWorldWidth(), stage.getViewport().getWorldHeight(), game.getSettings().reducedMotion());
        answers.prepare(round.question(), stage.getViewport().getWorldWidth(), stage.getViewport().getWorldHeight());
        hint.setText(game.getTexts().get("play.escape"));
        updatePresentation();
        synchronizeAudio();
    }

    private void updatePresentation() {
        double answerIntro = round.elapsedSeconds() - round.presentation().answersStartSeconds();
        clock.synchronize(round.clockAnimationElapsedSeconds(), answerIntro + 3);
        question.setTime(round.elapsedSeconds());
        float motion = com.badlogic.gdx.math.Interpolation.smoother.apply(round.presentation().moveProgress());
        float scale = 1 + (CinematicQuestion.FINAL_SCALE - 1) * motion;
        question.setScale(scale);
        float width = stage.getViewport().getWorldWidth(), height = stage.getViewport().getWorldHeight();
        question.setPosition((width - question.getWidth()) / 2,
            height * (.55f + (players==null?.19f:.15f) * motion) - question.getHeight() / 2);
        answers.synchronize(round, game.getSettings().reducedMotion());
        String status = paused || applicationPaused ? game.getTexts().get("play.paused") : round.phase() == RoundPhase.ANSWERING
            ? game.getTexts().format("play.remaining", (int) Math.ceil(round.answerSecondsRemaining()))
            : round.resultElapsedSeconds() >= 0
                ? game.getTexts().format("play.correct", Integer.toString(round.question().correctAnswerIndex() + 1))
                : "";
        if (!status.equals(lastStatus)) {
            countdown.setText(status);
            lastStatus = status;
        }
        hint.setText(network != null ? game.getTexts().get("play.escape") : game.getTexts().get(round.phase() == RoundPhase.ANSWERING
            ? "play.answering" : round.canAdvance() ? "play.next" : "play.escape"));
        if (network != null && players==null) {
            String text = network.playerStatus();
            if (!text.equals(rosterText)) { rosterText=text; roster.setText(text); }
        }
    }

    private void synchronizeAudio(){
        questionAudio.pause(paused||applicationPaused);
        var host=game.getAudio().hostVoice();
        if(paused||applicationPaused)host.pause();else host.resume();
        if(round.phase()==RoundPhase.REVEAL||connection!=null&&!connection.connected())host.stop();
        if(network==null){
            boolean answering=round.phase()==RoundPhase.ANSWERING;
            questionAudio.phase(answering,round.phase()==RoundPhase.REVEAL,Math.max(0,round.elapsedSeconds()-round.answeringStartsAt()),round.answerSecondsRemaining());
        }else{
            var snapshot=connection.snapshot();if(snapshot==null||!snapshot.has("question")){questionAudio.phase(false,false,0,0);return;}
            String phase=snapshot.get("phase").getAsString();long now=connection.serverNow();
            boolean answering=connection.connected()&&phase.equals("ANSWERING");
            boolean locked=phase.equals("REVEALING")||phase.equals("RESULTS")||phase.equals("GAME_FINISHED");
            questionAudio.phase(answering,locked,Math.max(0,(now-snapshot.get("answeringStartedAt").getAsLong())/1000.0),Math.max(0,(snapshot.get("deadline").getAsLong()-now)/1000.0));
        }
    }

    @Override public void show() {
        background.reset();
        paused = false;
        applicationPaused = false;
        if (network == null) { round.restart(); beginRound(); }
        else if (network.synchronize()) beginRound();
        Gdx.input.setInputProcessor(stage);
    }
    @Override public void render(float delta) {
        if (disposed) return;
        float step = paused || applicationPaused ? 0 : Math.max(0, delta);
        round.update(step);
        if (network != null && network.synchronize()) beginRound();
        synchronizeAudio();
        if (network == null && round.revealComplete() && !resultsDispatched) {
            resultsDispatched = true;
            if (resultsHandler != null) {
                resultsHandler.accept(round.question());
                if (disposed || game.getScreen() != this) return;
            } else if (round.next()) beginRound();
        }
        updatePresentation();
        if(players!=null){players.synchronize(connection.snapshot(),connection.serverNow());players.answersVisible(round.presentation().answerProgress(0)>0);players.advance(step,game.getSettings().reducedMotion());}
        ScreenUtils.clear(9 / 255f, 9 / 255f, 9 / 255f, 1);
        stage.getViewport().apply();
        stage.act(step);
        stage.draw();
        if (network != null && !applicationPaused) network.afterDraw();
    }
    private void layoutClock() {
        float w = stage.getViewport().getWorldWidth(), h = stage.getViewport().getWorldHeight();
        roster.setVisible(players==null);
        roster.setBounds(w * .05f, h * .88f, w * .9f, h * .09f);
        if(players!=null){players.setBounds(0,h-180,w,180);answers.setY(-26);}
        roster.setFontScale(.85f);
        heading.setBounds(w * .25f, h * (players==null?.845f:.775f), w * .5f, h * .03f);
        countdown.setBounds(w * .15f, h * .057f, w * .7f, h * .028f);
        hint.setBounds(w * .08f, h * .02f, w * .84f, h * .026f);
        float clockWidth = w * .20f;
        clock.setBounds(w * .74f, h * .12f, clockWidth, clockWidth * 1199 / 820);
    }
    @Override public void resize(int width, int height) {
        stage.getViewport().update(width, height, true);
        layoutClock();
    }
    @Override public void pause() { applicationPaused = true;questionAudio.pause(true); }
    @Override public void resume() { applicationPaused = false; }
    @Override public void hide() { questionAudio.leave();game.getAudio().hostVoice().stop();if (Gdx.input.getInputProcessor() == stage) Gdx.input.setInputProcessor(null); }
    @Override public void dispose() {
        if (disposed) return;
        disposed = true;
        hide();
        stage.dispose();
        background.dispose();
        clock.dispose();
        pixel.dispose();
        question.dispose();
        answers.dispose();
        smallFont.dispose();
        if(players!=null)players.dispose();
    }
}
