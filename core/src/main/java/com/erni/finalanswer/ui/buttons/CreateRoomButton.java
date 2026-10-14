package com.erni.finalanswer.ui.buttons;

import com.badlogic.gdx.Gdx;

/** CREATE ROOM: отдельный класс, картинки и действие нажатия. */
public class CreateRoomButton extends AnimatedImageButton {
    public CreateRoomButton() {
        // Текст и значки находятся в PNG и анимируются вместе с рамкой.
        super("ui/buttons/create_room/", "create_room_up.png",
            "create_room_hover.png", "create_room_pressed.png");
    }

    @Override
    protected void onActivate() {
        // Здесь подключим создание комнаты, когда будет готов экран лобби.
        Gdx.app.log("Final Answer", "CREATE ROOM clicked!");
    }
}
