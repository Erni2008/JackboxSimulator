package com.erni.finalanswer.lobby;

import com.erni.finalanswer.ui.lobby.cages.*;
import java.util.List;

/** Follows the project's executable-check convention; no graphics context required. */
public final class CageCheck {
    private static void check(boolean value, String message) { if (!value) throw new AssertionError(message); }
    private static void near(float a, float b) { check(Math.abs(a - b) < .0001f, "Expected " + a + ", got " + b); }
    public static void main(String[] args) {
        near(0,LobbyStartAnimation.darkness(0));near(1,LobbyStartAnimation.darkness(LobbyStartAnimation.FADE_END));
        for(int slot=0;slot<8;slot++){
            float phase=slot*2.39996f;
            float handoffMotion=0;for(int frame=150;frame<240;frame++)handoffMotion+=Math.abs(LobbyStartAnimation.rotation(frame/60f,phase)-LobbyStartAnimation.rotation((frame-1)/60f,phase));
            check(handoffMotion>10,"No stopped interval during blackout/title handoff");
            float motion=0;for(int frame=1;frame<149;frame++)motion+=Math.abs(LobbyStartAnimation.rotation(frame/60f,phase)-LobbyStartAnimation.rotation((frame-1)/60f,phase));
            check(motion>15,"Each cage keeps moving until the blackout finishes");
            near(0,LobbyStartAnimation.rotation(0,phase));
        }
        var slots = new CageAssignments(); slots.synchronize(List.of("a", "b", "c"));
        slots.synchronize(List.of("c", "a")); check(slots.slotOf("a") == 0 && slots.slotOf("c") == 2, "Leaving must not reshuffle");
        slots.synchronize(List.of("c", "d", "a")); check(slots.slotOf("d") == 1, "Reuse the vacant cage");
        for (int i = 0; i < 1000; i++) { slots.synchronize(List.of()); slots.synchronize(List.of("a", "b", "c", "d", "e", "f", "g", "h")); }
        check(slots.slotOf("h") == 7, "Exactly eight stable assignments");
        var a = new CageAnimator(); var b = new CageAnimator(); a.start(); b.start();
        near(0, a.impactRotation()); a.update(1.8f); near(0, a.impactRotation()); for (int i = 0; i < 108; i++) b.update(1f / 60); near(a.gate(), b.gate());
        check(a.gate() > 0 && a.gate() < 1, "Gate enters vertically before impact");
        a.update(.31f); check(a.impact(), "Impact once when crossing the bottom"); check(Math.abs(a.impactRotation()) > 0, "Gate impact briefly shakes the cage"); a.update(.01f); check(!a.impact(), "No repeated impact");
        a.update(4); near(0, a.impactRotation()); check(a.locked(), "Lock cue fires when crossing its boundary"); near(1, a.gate()); a.reset(); near(0, a.gate()); check(!a.occupied(), "Leave during animation resets gate");
        a.start(); a.update(Float.NaN); near(0, a.time());
        var pose = new CharacterAnimator(); pose.update(.25f, 0, false); check(pose.state == CharacterAnimator.State.SPAWNING, "Spawn");
        pose.update(.8f, 0, false); check(pose.state == CharacterAnimator.State.IDLE, "Still entrance");
        for (float time : new float[]{.55f, .85f, 1.2f, 1.49f}) {
            pose.update(time, 2.4f, false);
            near(0, pose.headAngle); near(0, pose.headX); near(0, pose.headY); near(0, pose.chestSink);
        }
        pose.update(CageAnimator.IMPACT_AT + .2f, 0, false); check(pose.state == CharacterAnimator.State.SCARED, "Impact recoil");
        pose.update(CageAnimator.SAD_AT + .4f, 0, false); check(pose.state == CharacterAnimator.State.SAD, "Continuous seated transition");
        pose.update(6, 0, true); check(pose.state == CharacterAnimator.State.LOCKED_IDLE, "Seated idle");
        near(-45, pose.bodyY); near(1, pose.seated);
        pose.update(CageAnimator.SAD_AT + .08f, 0, true);
        check(pose.seated > 0 && pose.handsRest == 0 && pose.slump == 0, "Pelvis leads the acting beat");
        pose.update(CageAnimator.SAD_AT + .2f, 0, true);
        check(pose.handsRest > 0 && pose.slump == 0, "Hands settle before the spine and head");
        pose.update(CageAnimator.SAD_AT + .4f, 0, true);
        check(pose.slump > 0 && pose.chestSink < 0, "Ribcage settles separately from pelvis");
        near(1, CageAnimator.LOOK); near(CageAnimator.CLOSE_AT, CageAnimator.SAD_AT);
        var joints = new TwoBonePose();
        for (int frame = 0; frame <= 120; frame++) {
            float sit = frame / 120f, hip = 118 - 45 * sit, foot = -15 - 16 * sit;
            joints.solve(-9, hip, foot, 77, 23, 23, -1);
            near(23, (float)Math.hypot(joints.jointX + 9, joints.jointY - hip));
            near(23, (float)Math.hypot(joints.endX - joints.jointX, joints.endY - joints.jointY));
            near(foot, joints.endX); near(77, joints.endY);
        }
        pose.update(CageAnimator.SAD_AT - .001f, 0, true); near(0, pose.seated);
        float standingSize = pose.scale;
        pose.update(CageAnimator.LOCKED_AT + .1f, 0, true); near(standingSize, pose.scale);
        check(pose.headAngle < -15, "Sad pose visibly lowers the head");
        for (int i = 0; i < 8; i++) {
            float ring = CageLayoutManager.ringX(i), half = 151 * CageLayoutManager.SCALE;
            check(ring - half > 500 && ring + half < 1920, "Cages fully inside safe scene bounds");
            for (int j = 0; j < i; j++) {
                float dx = ring - CageLayoutManager.ringX(j);
                float dy = Math.abs(CageLayoutManager.ringY(i) - CageLayoutManager.ringY(j));
                check(dx > 300 * CageLayoutManager.SCALE || dy > 333 * CageLayoutManager.SCALE, "No cage overlap");
                check(dx > 151 * CageLayoutManager.SCALE, "Ceiling chains clear the upper tier");
            }
            check(CageLayoutManager.ringY(i) > 324 * CageLayoutManager.SCALE + 305, "Controls remain uncovered");
        }
        System.out.println("PASS: eight stable slots, repeated joins/leaves, independent timelines, gate impact, character states and safe layout");
    }
}
