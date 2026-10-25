package com.erni.finalanswer.lastcommand;
import com.badlogic.gdx.math.*;
import net.mgsx.gltf.scene3d.scene.Scene;
import java.util.*;
import java.util.function.BiConsumer;
/** Eight independent source-space arrow regions on one source mesh; digits share one 512x256 canvas. */
public final class CodePanel extends PanelControl {
    private final int[] digits=new int[4],old=new int[4];
    private final int[] directions={1,1,1,1};
    private final float[] progress={1,1,1,1};
    private final PanelCanvas canvas=new PanelCanvas(4,new float[]{-.335f,-.112f,.112f,.335f},.255f,.269f,.126f,.208f);
    private final BiConsumer<String,PanelAction.Cause> changed;
    private boolean dirty=true;private int lastChangedIndex,lastDirection;
    public int lastChangedIndex(){return lastChangedIndex;}
    public int lastDirection(){return lastDirection;}
    CodePanel(Scene scene,PickGeometry geometry,PanelConfiguration.Mount mount,BiConsumer<String,PanelAction.Cause> changed){super(PanelElementId.CODE_PANEL,scene,geometry,mount);this.changed=changed;canvas.instance.transform.set(rest);}
    public String code(){return ""+digits[0]+digits[1]+digits[2]+digits[3];}
    public boolean matches(String expected){return code().equals(expected);}
    public int digit(int index){return digits[Objects.checkIndex(index,4)];}
    public void setCode(String code){if(code==null||!code.matches("[0-9]{4}"))throw new IllegalArgumentException("Expected four digits");for(int i=0;i<4;i++)setDigit(i,code.charAt(i)-'0',PanelAction.Cause.PROGRAM);}
    public void setDigit(int index,int value){setDigit(index,value,PanelAction.Cause.PROGRAM);}
    private void setDigit(int index,int value,PanelAction.Cause cause){Objects.checkIndex(index,4);if(value<0||value>9)throw new IllegalArgumentException("Digit must be 0–9");if(digits[index]==value)return;old[index]=digits[index];directions[index]=value==Math.floorMod(old[index]-1,10)?-1:1;digits[index]=value;progress[index]=0;dirty=true;changed.accept(code(),cause);}
    public boolean change(int index,int direction,PanelAction.Cause cause){if(locked()||!visible())return false;lastChangedIndex=index;lastDirection=direction;setDigit(index,Math.floorMod(digits[index]+direction,10),cause);return true;}
    @Override public boolean animating(){if(dirty)return true;for(float p:progress)if(p<1)return true;return false;}
    @Override public void update(float delta){if(!animating())return;for(int i=0;i<4;i++)progress[i]=Math.min(1,progress[i]+Math.max(0,delta)/.16f);canvas.digits(old,digits,progress,directions);dirty=false;}
    @Override public void reset(){Arrays.fill(digits,0);Arrays.fill(old,0);Arrays.fill(progress,1);dirty=true;setLocked(false);}
    public ModelCanvasView display(){return new ModelCanvasView(canvas.instance,this);}
    @Override PanelElementId hitId(Vector3 point){
        if(point.z<.17f)return null;
        int i=Math.round((point.x+.335f)/.2233f);if(i<0||i>3||Math.abs(point.x-(-.335f+i*.2233f))>.072f)return null;
        if(Math.abs(point.y-.447f)<.045f)return PanelElementId.values()[PanelElementId.CODE_UP_1.ordinal()+i];
        if(Math.abs(point.y-.066f)<.045f)return PanelElementId.values()[PanelElementId.CODE_DOWN_1.ordinal()+i];return null;
    }
    @Override boolean activeSurface(Vector3 p){return hitId(p)!=null;}
    @Override public void dispose(){canvas.dispose();}
}
