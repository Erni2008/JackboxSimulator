package com.erni.finalanswer.lastcommand;
import com.badlogic.gdx.math.*;
import java.util.*;
/** One assembly and seed owner; components never create their own random generator. */
public final class AdditionalMechanisms {
    public enum LeverState {UP,MIDDLE,DOWN}
    private final PivotMechanism lever;
    private final HiddenHatch hatch;
    private final CodePanel code;
    private final List<PanelControl> controls;
    AdditionalMechanisms(TheLastCommandMachine machine,java.util.random.RandomGenerator generator){
        var config=MechanismConfiguration.load();var panel=machine.panel();
        var screenArea=new com.badlogic.gdx.math.collision.BoundingBox(config.questionScreenMin,config.questionScreenMax);
        if(new com.badlogic.gdx.math.collision.BoundingBox(machine.sourceGeometry(9).bounds).mul(config.code.rest()).intersects(screenArea))throw new IllegalArgumentException("CODE_PANEL must not occupy the question screen");
        var base=new StaticMechanism(PanelElementId.LEVER_BASE,machine.newInstance(5),machine.sourceGeometry(5),config.leverBase);
        lever=new PivotMechanism(PanelElementId.LEVER_MODULE,machine.newInstance(6),machine.sourceGeometry(6),config.leverHandle,config.leverAxis,config.leverSeconds,config.leverAngles,
            (value,cause)->panel.emit(PanelElementId.LEVER_MODULE,PanelAction.Kind.LEVER_CHANGED,LeverState.values()[value].name(),cause));
        // Same java.util.Random(seed) convention as existing seeded layouts; passed to placement selection.
        List<com.badlogic.gdx.math.collision.BoundingBox> occupied=new ArrayList<>();
        for(var control:panel.controls())occupied.add(control.interactionBounds(new com.badlogic.gdx.math.collision.BoundingBox()));
        for(int i=1;i<3;i++)occupied.add(new com.badlogic.gdx.math.collision.BoundingBox(machine.sourceGeometry(i).bounds).mul(machine.scenes[i].modelInstance.transform));
        occupied.add(base.interactionBounds(new com.badlogic.gdx.math.collision.BoundingBox()));occupied.add(lever.interactionBounds(new com.badlogic.gdx.math.collision.BoundingBox()));
        occupied.add(new com.badlogic.gdx.math.collision.BoundingBox(machine.sourceGeometry(9).bounds).mul(config.code.rest()));
        var placement=config.select(generator,occupied);
        var frame=new StaticMechanism(PanelElementId.HATCH_FRAME,machine.newInstance(7),machine.sourceGeometry(7),placement);
        var door=new PanelConfiguration.Mount();
        Matrix4 world=new Matrix4(placement.rest()).translate(config.doorOffset).scale(config.doorScale.x,config.doorScale.y,config.doorScale.z);
        Vector3 hinge=new Vector3(config.doorPivot).mul(world);world.getScale(door.scale);
        // Matrix Euler extraction is assigned explicitly (libGDX uses yaw/pitch/roll).
        Quaternion q=world.getRotation(new Quaternion(),true);door.rotation.set(q.getPitch(),q.getYaw(),q.getRoll());door.position.set(hinge);door.pivot.set(config.doorPivot);
        hatch=new HiddenHatch(machine.newInstance(8),machine.sourceGeometry(8),door,placement,config,placement.id,
            (value,cause)->panel.emit(PanelElementId.HIDDEN_HATCH,PanelAction.Kind.HATCH_CHANGED,value==1?"OPEN":"CLOSED",cause));
        code=new CodePanel(machine.newInstance(9),machine.sourceGeometry(9),config.code,
            (value,cause)->panel.emit(PanelElementId.CODE_PANEL,PanelAction.Kind.CODE_UPDATED,value,cause));
        controls=List.of(base,lever,frame,hatch,code);
    }
    public PivotMechanism lever(){return lever;}
    public LeverState leverState(){return LeverState.values()[lever.position()];}
    public void setLeverState(LeverState state){lever.setPosition(state.ordinal());}
    public HiddenHatch hatch(){return hatch;}
    public CodePanel code(){return code;}
    public void setVisible(PanelElementId id,boolean visible){for(var control:controls)if(control.id()==id||id==PanelElementId.HIDDEN_HATCH&&control.id()==PanelElementId.HATCH_FRAME||id==PanelElementId.LEVER_MODULE&&control.id()==PanelElementId.LEVER_BASE)control.setVisible(visible);}
    public List<PanelControl> controls(){return controls;}
    public List<ModelCanvasView> displays(){return List.of(hatch.clue(),code.display());}
    boolean handles(PanelElementId id){return id==PanelElementId.LEVER_MODULE||id==PanelElementId.HIDDEN_HATCH||id==PanelElementId.CODE_PANEL||id.name().startsWith("CODE_UP_")||id.name().startsWith("CODE_DOWN_");}
    boolean interact(PanelElementId id,PanelAction.Cause cause){
        if(id==PanelElementId.LEVER_MODULE)return lever.step(cause);
        if(id==PanelElementId.HIDDEN_HATCH)return hatch.step(cause);
        if(id.name().startsWith("CODE_UP_"))return code.change(id.ordinal()-PanelElementId.CODE_UP_1.ordinal(),1,cause);
        if(id.name().startsWith("CODE_DOWN_"))return code.change(id.ordinal()-PanelElementId.CODE_DOWN_1.ordinal(),-1,cause);return false;
    }
}
