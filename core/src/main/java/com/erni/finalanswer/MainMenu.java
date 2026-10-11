package com.erni.finalanswer;

import com.badlogic.gdx.ScreenAdapter;
import com.badlogic.gdx.utils.ScreenUtils;
import com.badlogic.gdx.graphics.g2d.BitmapFont;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;



public class MainMenu extends ScreenAdapter {


    private final FinalAnswerGame game; //class MainMenu
    private final SpriteBatch batch;
    private final BitmapFont font;

    public MainMenu(FinalAnswerGame receivedGame) { //constructor
        this.game = receivedGame;
        batch = new SpriteBatch();
        font = new BitmapFont();
    }

    @Override
    public void render(float delta) {
        ScreenUtils.clear(0.1f, 0.05f, 0.15f, 1f);
        batch.begin();
        font.getData().setScale(3f);
        font.draw(batch, "FINAL ANSWER", 100, 400);
        batch.end();
    }
    @Override 
    public void dispose() {
        batch.dispose();
        font.dispose();

    }
}