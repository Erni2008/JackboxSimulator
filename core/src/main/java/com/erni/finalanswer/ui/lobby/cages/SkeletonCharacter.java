package com.erni.finalanswer.ui.lobby.cages;

import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.g2d.Batch;
import com.badlogic.gdx.graphics.g2d.TextureRegion;
import com.badlogic.gdx.math.Affine2;
import com.badlogic.gdx.math.Matrix4;

/** Fixed proportions, connected elbow/knee joints, planted feet and a separate spine/head hierarchy. */
public final class SkeletonCharacter implements CageCharacter {
    private static final float SIZE = 1.05f, FLOOR_Y = 64;
    private final CageAssets assets;
    private final TextureRegion chest, pelvis;
    private final CharacterAnimator pose = new CharacterAnimator();
    private final ArticulatedLimb leftLeg, rightLeg, leftArm, rightArm;
    private final Matrix4 previous = new Matrix4(), root = new Matrix4(), torso = new Matrix4();
    private final Affine2 affine = new Affine2();
    private final Color saved = new Color();

    public SkeletonCharacter(CageAssets assets) {
        this.assets = assets;
        chest = com.erni.finalanswer.ui.RuntimeTextures.region(assets.body.getTexture(), 0, 0, 1279, 1025);
        pelvis = com.erni.finalanswer.ui.RuntimeTextures.region(assets.body.getTexture(), 0, 995, 1279, 235);
        // Screen-left/right are deliberately mapped by anatomy; toes point away from the body.
        leftLeg = new ArticulatedLimb(assets.rightLeg, 1024, 1536, 690, 670, 185, 540, 690, 555, 1185, .0435f);
        rightLeg = new ArticulatedLimb(assets.leftLeg, 1024, 1536, 690, 355, 185, 640, 690, 610, 1185, .041f);
        leftArm = new ArticulatedLimb(assets.leftArm, 1277, 1232, 600, 885, 190, 680, 600, 380, 860, .0425f);
        rightArm = new ArticulatedLimb(assets.rightArm, 1277, 1232, 600, 455, 190, 660, 600, 950, 860, .0425f);
    }
    @Override public void update(float time, float phase, boolean reducedMotion) { pose.update(time, phase, reducedMotion); }
    @Override public void draw(Batch batch, float alpha) {
        saved.set(batch.getColor()); previous.set(batch.getTransformMatrix());
        float hipY = 118 + pose.bodyY;
        float size = SIZE * pose.scale;
        affine.setToTrnRotScl(174, FLOOR_Y + (hipY - FLOOR_Y) * SIZE, 0, size, size);
        root.set(affine).mulLeft(previous); batch.setTransformMatrix(root);
        batch.setColor(saved.r, saved.g, saved.b, alpha * pose.alpha);
        float feet = 15 + 16 * pose.seated;
        leftLeg.draw(batch, -9, 0, -feet, 77 - hipY, -1);
        rightLeg.draw(batch, 9, 0, feet, 77 - hipY, 1);
        // The pelvis stays with the leg roots; only the ribcage/spine slumps and breathes.
        batch.draw(pelvis, -31.75f, -7.32f, 63.5f, 11.6545f);
        affine.setToTrnRotScl(0, 3.6f + pose.chestSink, pose.bodyAngle, 1, 1);
        torso.set(affine).mulLeft(root); batch.setTransformMatrix(torso);
        float wristX = 32 - 15 * pose.handsRest, wristY = -1.6f + 23 * pose.handsRest + pose.handLift;
        leftArm.setPose(-28, 33.4f - 2 * pose.slump, -wristX, wristY, -1);
        rightArm.setPose(28, 33.4f - 2 * pose.slump, wristX, wristY, 1);
        // Shoulder caps are behind the ribs; forearms/hands are in front so they can rest on the lap.
        leftArm.drawUpper(batch); rightArm.drawUpper(batch);
        batch.draw(chest, -31.75f, -.75f, 63.5f, 50.8333f);
        leftArm.drawLower(batch); rightArm.drawLower(batch);
        part(batch, assets.head, pose.headX, 44.4f + pose.headY, 44, 56, .48f, .08f, pose.headAngle);
        batch.setTransformMatrix(previous); batch.setColor(saved);
    }
    private static void part(Batch batch, TextureRegion region, float x, float y, float w, float h,
                             float px, float py, float angle) {
        batch.draw(region, x - w * px, y - h * py, w * px, h * py, w, h, 1, 1, angle);
    }
}
