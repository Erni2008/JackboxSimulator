package com.finalanswer.server.game.systembreach;

/** Domain failures are translated by the existing RoomService transport adapter. */
public final class BreachFailure extends RuntimeException {
    public BreachFailure(String code){super("SB_"+code);}
    static BreachFailure invalid(){return new BreachFailure("INVALID_ACTION");}
}
