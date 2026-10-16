package com.erni.finalanswer.ui.buttons;


import com.erni.finalanswer.FinalAnswerGame;
import com.erni.finalanswer.screens.RoomSettingsScreen;
import com.badlogic.gdx.Gdx;

/** CREATE ROOM: отдельный класс, картинки и действие нажатия. */
public class CreateRoomButton extends AnimatedImageButton {
    private final FinalAnswerGame game;

    public CreateRoomButton(FinalAnswerGame game) {
        // Текст и значки находятся в PNG и анимируются вместе с рамкой.
        super("ui/buttons/create_room/", "create_room_up.png",
            "create_room_hover.png", "create_room_pressed.png");
        this.game = game;
    }

    @Override
    protected void onActivate() {
        // Открываем экран настроек комнаты.
        Gdx.app.log("Final Answer", "CREATE ROOM clicked!");
        com.badlogic.gdx.Screen previous = game.getScreen();
        Gdx.app.postRunnable(() -> {
            if (game.getScreen() != previous) return;
            game.setScreen(new RoomSettingsScreen(game));
            previous.dispose();
        });
    }


}
