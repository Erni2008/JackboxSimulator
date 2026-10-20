package com.erni.finalanswer.ui.lobby.cages;

import com.badlogic.gdx.graphics.g2d.Batch;
import com.badlogic.gdx.graphics.g2d.TextureRegion;
import com.badlogic.gdx.math.MathUtils;
import com.erni.finalanswer.ui.RuntimeTextures;

/** Two overlapping regions of one unchanged PNG, pivoted at the authored knee/elbow. */
public final class ArticulatedLimb {
    private final TextureRegion upper, lower;
    private final float rootX, rootY, jointX, jointY, upperAngle, lowerAngle, scale;
    private final float upperLength, lowerLength;
    private final float upperWidth, upperHeight, lowerWidth, lowerHeight;
    private final TwoBonePose pose = new TwoBonePose();
    private float posedX, posedY, posedUpperAngle, posedLowerAngle;

    public ArticulatedLimb(TextureRegion source, int width, int height, int split,
                           float rootX, float rootY, float jointX, float jointY,
                           float endX, float endY, float scale) {
        // The overlap retains the existing joint cap, concealing the join as the bones bend.
        int overlap = 24;
        upper = RuntimeTextures.region(source.getTexture(), 0, 0, width, split + overlap);
        lower = RuntimeTextures.region(source.getTexture(), 0, split - overlap, width, height - split + overlap);
        upperWidth = lowerWidth = width; upperHeight = split + overlap; lowerHeight = height - split + overlap;
        this.rootX = rootX; this.rootY = split + overlap - rootY;
        this.jointX = jointX; this.jointY = height - jointY;
        this.scale = scale;
        upperAngle = MathUtils.atan2(-(jointY - rootY), jointX - rootX) * MathUtils.radiansToDegrees;
        lowerAngle = MathUtils.atan2(-(endY - jointY), endX - jointX) * MathUtils.radiansToDegrees;
        upperLength = (float)Math.hypot(jointX - rootX, jointY - rootY) * scale;
        lowerLength = (float)Math.hypot(endX - jointX, endY - jointY) * scale;
    }
    public void setPose(float x, float y, float targetX, float targetY, float bend) {
        pose.solve(x, y, targetX, targetY, upperLength, lowerLength, bend);
        posedX = x; posedY = y;
        posedUpperAngle = MathUtils.atan2(pose.jointY - y, pose.jointX - x) * MathUtils.radiansToDegrees - upperAngle;
        posedLowerAngle = MathUtils.atan2(pose.endY - pose.jointY, pose.endX - pose.jointX) * MathUtils.radiansToDegrees - lowerAngle;
    }
    public void drawUpper(Batch batch) { drawPart(batch, upper, posedX, posedY, rootX, rootY, posedUpperAngle); }
    public void drawLower(Batch batch) { drawPart(batch, lower, pose.jointX, pose.jointY, jointX, jointY, posedLowerAngle); }
    public void draw(Batch batch, float x, float y, float targetX, float targetY, float bend) {
        setPose(x, y, targetX, targetY, bend);
        // Lower bone first; the upper joint cap remains in front of the seam.
        drawLower(batch); drawUpper(batch);
    }
    private void drawPart(Batch batch, TextureRegion region, float x, float y, float px, float py, float angle) {
        // RuntimeTextures may downsample the texture, but these coordinates remain source-art pixels.
        float w = region == upper ? upperWidth : lowerWidth;
        float h = region == upper ? upperHeight : lowerHeight;
        batch.draw(region, x - px * scale, y - py * scale, px * scale, py * scale,
            w * scale, h * scale, 1, 1, angle);
    }
}
