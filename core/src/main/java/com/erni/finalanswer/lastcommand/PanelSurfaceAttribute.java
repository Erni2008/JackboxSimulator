package com.erni.finalanswer.lastcommand;

import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.g3d.Attribute;
import com.badlogic.gdx.math.Vector3;
import com.badlogic.gdx.math.Matrix3;

/** Per-instance enamel tint or glass emission mask. Textures and metal stay shared. */
public final class PanelSurfaceAttribute extends Attribute {
    public static final long TYPE=register("lastCommandPanelSurface");
    public final int kind; // 1: enamel hue, 2: glass lens, 3: rotating patina frame
    public final Color color=new Color(Color.WHITE);
    public final Vector3 maskAxis=new Vector3(0,0,-1);
    public final Matrix3 patternFrame=new Matrix3();
    public float maskStart=.44f, emission;
    public PanelSurfaceAttribute(int kind){super(TYPE);this.kind=kind;}
    @Override public Attribute copy(){
        PanelSurfaceAttribute copy=new PanelSurfaceAttribute(kind);copy.color.set(color);copy.maskAxis.set(maskAxis);copy.maskStart=maskStart;copy.emission=emission;copy.patternFrame.set(patternFrame);return copy;
    }
    @Override public int compareTo(Attribute other){return type==other.type?Integer.compare(kind,((PanelSurfaceAttribute)other).kind):Long.compare(type,other.type);}
}
