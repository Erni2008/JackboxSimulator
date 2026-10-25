package com.erni.finalanswer.lastcommand;
import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.math.*;
import net.mgsx.gltf.scene3d.scene.Scene;
import java.util.function.BiConsumer;
public final class HiddenHatch extends PivotMechanism {
    private final PanelCanvas clue=new PanelCanvas(1,new float[]{-.10f},.29f,.08f,.52f,.28f,true);
    private final String placementId;
    private String hintText="?";private Texture hintImage;
    public Texture hintImage(){return hintImage;}
    public String hintText(){return hintText;}
    HiddenHatch(Scene scene,PickGeometry geometry,PanelConfiguration.Mount door,PanelConfiguration.Mount frame,MechanismConfiguration config,String placementId,BiConsumer<Integer,PanelAction.Cause> changed){
        super(PanelElementId.HIDDEN_HATCH,scene,geometry,door,Vector3.Y,config.hatchSeconds,new float[]{0,config.hatchAngle},changed);
        this.placementId=placementId;clue.instance.transform.set(frame.rest());setHint("?");
    }
    public String placementId(){return placementId;}
    public boolean open(){return position()==1;}
    public boolean setOpen(boolean value){return setPosition(value?1:0);}
    public void setHint(String text){if(text==null||text.length()>16)throw new IllegalArgumentException("Hint must contain at most 16 characters");hintText=text;hintImage=null;clue.hint(text,null);com.badlogic.gdx.Gdx.graphics.requestRendering();}
    /** Texture is borrowed and never disposed here. Content is copied into the small hint target. */
    public void setHintImage(Texture texture){if(texture==null)throw new IllegalArgumentException("Missing hint image");hintText=null;hintImage=texture;clue.hint(null,texture);com.badlogic.gdx.Gdx.graphics.requestRendering();}
    public ModelCanvasView clue(){return new ModelCanvasView(clue.instance,this);}
    @Override public void dispose(){clue.dispose();}
}
