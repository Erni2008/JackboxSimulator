package com.erni.finalanswer.impostor;

/** Logical names preserve the actual supplied PNG filenames. */
public enum ImpostorAsset {
    BACKGROUND_1("impostor/backgrounds/background1.png"),
    BACKGROUND_2("impostor/backgrounds/background2.png"),
    BACKGROUND_3("impostor/backgrounds/background3.png"),
    CLOCK("impostor/clock/clockmini.png"),
    CLOCK_ARROW("impostor/clock/arrow_clock1.png"),
    TIMER_RECTANGLE("impostor/clock/timer_rectangle.png"),
    AVATAR_FRAME("impostor/portraits/impostor_avatar_frame.png"),
    PAPER_FRONT("impostor/papers/papper_player_front.png"),
    PAPER_BACK("impostor/papers/papper_player_back.png"),
    SUSPECT_PAPER("impostor/papers/suspect_papper.png"),
    STAMP("impostor/voting/stamp.png"),
    STAMP_MARK("impostor/voting/suspect_print.png"),
    ENVELOPE_CLOSED("impostor/envelopes/envelop1.png"),
    ENVELOPE_SEALED("impostor/envelopes/envelop2.png"),
    ENVELOPE_OPEN("impostor/envelopes/envelop3.png"),
    PHONE_1("impostor/phone/phone1.png"),
    PHONE_2("impostor/phone/phone2.png"),
    PHONE_3_RD("impostor/phone/phone3-rd.png"),
    PHONE_3("impostor/phone/phone3.png"),
    PHONE_4("impostor/phone/phone4.png"),
    PEN("impostor/phone/pen.png"),
    MESSAGE("impostor/phone/message.png"),
    SCREEN_MESSENGER("impostor/phone/screenmessanger.png");

    private final String path;

    ImpostorAsset(String path) { this.path = path; }
    public String path() { return path; }
}
