package com.erni.finalanswer.ui.play;

import com.badlogic.gdx.graphics.g2d.BitmapFont;
import com.badlogic.gdx.scenes.scene2d.Group;
import com.badlogic.gdx.scenes.scene2d.Touchable;
import com.badlogic.gdx.utils.Disposable;
import com.erni.finalanswer.gameplay.questions.Question;
import com.erni.finalanswer.gameplay.round.RoundController;
import com.erni.finalanswer.ui.UiFonts;

/** Owns answer fonts and composition; timing comes from the existing paused round timeline. */
public final class AnswersPresentationActor extends Group implements Disposable {
    // Logical 1600x900 viewport: equivalent to 134px / 58px at 1920x1080.
    public static final int NUMBER_FONT_SIZE = 112, TEXT_FONT_SIZE = 48;
    // Centers, not left edges. Right side stays clear for the clock, top for the question.
    private static final float[][] PLACEMENT = {
        {.53f, .60f, 2}, {.35f, .455f, -2}, {.54f, .31f, 1}, {.40f, .165f, -1}
    };
    private final BitmapFont numbers = UiFonts.horror(NUMBER_FONT_SIZE);
    private final BitmapFont text = UiFonts.horror(TEXT_FONT_SIZE);
    private final BitmapFont fallback = UiFonts.body(TEXT_FONT_SIZE);
    private final AnswerView[] answers = new AnswerView[4];
    private boolean disposed;

    public AnswersPresentationActor() {
        setTouchable(Touchable.disabled);
        setTransform(false);
        for (int i = 0; i < answers.length; i++) {
            answers[i] = new AnswerView(i, numbers, text, fallback);
            addActor(answers[i]);
        }
    }
    public void prepare(Question question, float width, float height) {
        setSize(width, height);
        for (int i = 0; i < answers.length; i++)
            answers[i].prepare(question.answers().get(i), PLACEMENT[i][0], PLACEMENT[i][1], PLACEMENT[i][2], width, height);
    }
    public void synchronize(RoundController round, boolean reducedMotion) {
        for (int i = 0; i < answers.length; i++)
            answers[i].present((float) round.answerProgress(i), i == round.question().correctAnswerIndex(),
                round.resultElapsedSeconds(), reducedMotion);
    }
    @Override public void dispose() {
        if (disposed) return;
        disposed = true;
        clearChildren();
        numbers.dispose(); text.dispose(); fallback.dispose();
    }
}
