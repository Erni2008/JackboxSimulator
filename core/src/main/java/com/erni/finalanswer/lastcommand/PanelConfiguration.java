package com.erni.finalanswer.lastcommand;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.math.*;
import com.badlogic.gdx.utils.Json;

/** Coordinates are source-body units; pivot is after the GLB's authored node rotation. */
public final class PanelConfiguration {
    public static class Mount extends TheLastCommandMachine.Placement {
        public Vector3 pivot = new Vector3();
        Matrix4 rest() {
            if(pivot==null||!Float.isFinite(pivot.x)||!Float.isFinite(pivot.y)||!Float.isFinite(pivot.z))throw new IllegalArgumentException("Invalid source pivot");
            return matrix().translate(-pivot.x,-pivot.y,-pivot.z);
        }
    }
    public static class ButtonMount extends Mount {
        public PanelElementId id;
        public String color="RED";
        public float travel=.10f;
        public float pickMinY=.44f;
    }
    public static class AdjusterMount extends Mount {
        public Vector3 axis=new Vector3(0,1,0);
        public float[] angles={0,45,90,135};
        public float turnSeconds=.18f;
        public float pickMinY=.46f;
    }
    public static class LightMount extends Mount {
        public Vector3 lensAxis=new Vector3(.819152f,.573576f,0);
        public float lensStart=.27f;
    }
    public ButtonMount[] buttons;
    public AdjusterMount adjuster;
    public LightMount light;
    static PanelConfiguration load(){
        return new Json().fromJson(PanelConfiguration.class,Gdx.files.internal(TheLastCommandMachine.ROOT+"panel.json"));
    }
}
