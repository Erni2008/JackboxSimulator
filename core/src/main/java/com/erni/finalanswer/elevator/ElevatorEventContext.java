package com.erni.finalanswer.elevator;

import java.util.ArrayList;
import java.util.List;

/**
 * What the running event asks of the elevator this frame. Reset to "normal" before every update, so nothing an event
 * does can outlive it. The elevator owns the real travel and floor state; an event only scales the travel speed and
 * adds visual offsets on top of it.
 */
public final class ElevatorEventContext {
    public enum DoorCommand {NONE,OPEN_PARTIAL,PAUSE,CLOSE}
    /** Travel speed multiplier 0..1 (0 = car halted, logical travel clock suspended). */
    public float speed=1;
    /** Cabin light multiplier 0..1 and full darkness 0..1 (darkness keeps a faint outline). */
    public float light=1,dark=0;
    /** Purely visual needle offset in floors — the logical floor is never touched. */
    public float needleOffset=0;
    /** Extra start/stop judder (world px) and a one-shot bump strength (0 = none). */
    public float judder=0,bump=0;
    /** Motor / ambience gain 0..1. */
    public float motorGain=1;
    public DoorCommand door=DoorCommand.NONE;public float doorTarget,doorSeconds;
    public final List<String> sounds=new ArrayList<>();
    public String voiceLine;

    void reset(){speed=1;light=1;dark=0;needleOffset=0;judder=0;bump=0;motorGain=1;door=DoorCommand.NONE;doorTarget=0;doorSeconds=0;sounds.clear();voiceLine=null;}
}
