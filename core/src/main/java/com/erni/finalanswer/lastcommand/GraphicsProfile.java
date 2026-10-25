package com.erni.finalanswer.lastcommand;
import com.badlogic.gdx.Gdx;
/** Scene-specific quality, using the existing desktop FPS setting as the upper bound. */
public enum GraphicsProfile {
    LOW(30,0,1), MEDIUM(60,1024,2), HIGH(60,2048,3);
    public final int fps,shadowSize,lights;
    GraphicsProfile(int fps,int shadowSize,int lights){this.fps=fps;this.shadowSize=shadowSize;this.lights=lights;}
    public static GraphicsProfile current(){
        try{return valueOf(System.getProperty("lc.quality",Gdx.app.getPreferences("FinalAnswer.lastCommand").getString("quality","MEDIUM")));}
        catch(IllegalArgumentException e){return MEDIUM;}
    }
    public void save(){Gdx.app.getPreferences("FinalAnswer.lastCommand").putString("quality",name()).flush();}
}
