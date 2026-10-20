package com.erni.finalanswer.ui.lobby.cages;

/** Allocation-free two-joint inverse kinematics. Bone lengths never change during a pose. */
public final class TwoBonePose {
    public float jointX, jointY, endX, endY;
    public void solve(float rootX, float rootY, float targetX, float targetY,
                      float upperLength, float lowerLength, float bend) {
        float dx = targetX - rootX, dy = targetY - rootY;
        float distance = (float)Math.sqrt(dx * dx + dy * dy);
        if (distance < .0001f) { dx = 0; dy = -1; distance = 1; }
        float ux = dx / distance, uy = dy / distance;
        float reach = Math.max(Math.abs(upperLength - lowerLength) + .001f,
            Math.min(upperLength + lowerLength - .001f, distance));
        float along = (upperLength * upperLength - lowerLength * lowerLength + reach * reach) / (2 * reach);
        float height = (float)Math.sqrt(Math.max(0, upperLength * upperLength - along * along));
        jointX = rootX + ux * along - uy * height * bend;
        jointY = rootY + uy * along + ux * height * bend;
        endX = rootX + ux * reach; endY = rootY + uy * reach;
    }
}
