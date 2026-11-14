package com.erni.finalanswer.elevator;

/** Atmospheric sabotages that may happen while the car travels. None of them touches scores, players or progression. */
public enum ElevatorEventType {
    EMERGENCY_STOP,
    SOMEONE_WATCHING,
    POWER_FAILURE,
    HOST_INTERRUPTION,
    FALSE_ARRIVAL;

    /** Events that halt the car (the logical travel clock is suspended while they run). */
    public boolean stopsCar(){return this==EMERGENCY_STOP||this==FALSE_ARRIVAL;}
}
