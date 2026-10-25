package com.erni.finalanswer.lastcommand;

import com.badlogic.gdx.graphics.Color;
import java.util.*;
import java.util.function.Consumer;
import net.mgsx.gltf.scene3d.scene.Scene;

/** Render-thread API for future tasks. No task selection, scoring or puzzle rules live here. */
public final class FrontPanel {
    private final TheLastCommandMachine machine;
    private final EnumMap<PanelElementId,SmallButton> buttons=new EnumMap<>(PanelElementId.class);
    private final List<PanelControl> controls;
    private final ArrayDeque<PanelAction> history=new ArrayDeque<>();
    private final List<Consumer<PanelAction>> listeners=new java.util.concurrent.CopyOnWriteArrayList<>();
    private final EnumMap<PanelElementId,PanelAction.Cause> pressCauses=new EnumMap<>(PanelElementId.class);
    private long sequence;
    private double time;
    private int historyLimit=1024;
    private Consumer<PanelElementId> onSmallButtonPressed=id->{};
    private final RotaryAdjuster adjuster;
    private final LightModule light;
    FrontPanel(TheLastCommandMachine machine,PanelConfiguration config){
        this.machine=machine;
        if(config.buttons==null||config.buttons.length!=4)throw new IllegalArgumentException("Exactly four small buttons are required");
        for(var mount:config.buttons){
            if(mount.id==null||!mount.id.name().startsWith("SMALL_BUTTON_")||buttons.containsKey(mount.id))throw new IllegalArgumentException("Invalid/duplicate small-button ID");
            buttons.put(mount.id,new SmallButton(machine.newInstance(2),machine.sourceGeometry(2),mount));
        }
        adjuster=new RotaryAdjuster(machine.newInstance(3),machine.sourceGeometry(3),config.adjuster,
            (angle,cause)->emit(PanelElementId.ADJUSTER,PanelAction.Kind.ADJUSTER_CHANGED,Float.toString(angle),cause));
        light=new LightModule(machine.newInstance(4),machine.sourceGeometry(4),config.light);
        List<PanelControl> all=new ArrayList<>(buttons.values());all.add(adjuster);all.add(light);controls=List.copyOf(all);
    }
    public List<PanelControl> controls(){return controls;}
    public SmallButton button(PanelElementId id){SmallButton b=buttons.get(id);if(b==null)throw new IllegalArgumentException("Not a small button: "+id);return b;}
    public RotaryAdjuster adjuster(){return adjuster;}
    public LightModule light(){return light;}
    public PanelControl control(PanelElementId id){for(PanelControl c:controls)if(c.id()==id)return c;throw new IllegalArgumentException("Not a panel control: "+id);}
    public void onSmallButtonPressed(Consumer<PanelElementId> listener){onSmallButtonPressed=Objects.requireNonNull(listener);}
    public void addListener(Consumer<PanelAction> listener){listeners.add(Objects.requireNonNull(listener));}
    public void removeListener(Consumer<PanelAction> listener){listeners.remove(listener);}
    public List<PanelAction> history(){return List.copyOf(history);}
    public List<PanelAction> playerActions(){return history.stream().filter(a->a.cause()==PanelAction.Cause.PLAYER).toList();}
    public void setHistoryLimit(int limit){if(limit<1)throw new IllegalArgumentException("History limit must be positive");historyLimit=limit;while(history.size()>limit)history.removeFirst();}
    private void emit(PanelElementId id,PanelAction.Kind kind,String value,PanelAction.Cause cause){
        PanelAction event=new PanelAction(++sequence,time,id,kind,value,cause);
        if(history.size()==historyLimit)history.removeFirst();history.addLast(event);for(var listener:listeners)listener.accept(event);
    }
    public boolean press(PanelElementId id){return press(id,PanelAction.Cause.PROGRAM);}
    private boolean press(PanelElementId id,PanelAction.Cause cause){
        SmallButton button=button(id);if(!button.press())return false;
        pressCauses.put(id,cause);emit(id,PanelAction.Kind.PRESSED,button.color().toString(),cause);onSmallButtonPressed.accept(id);return true;
    }
    public boolean release(PanelElementId id){
        SmallButton button=button(id);if(!button.release())return false;
        emit(id,PanelAction.Kind.RELEASED,"",pressCauses.getOrDefault(id,PanelAction.Cause.PROGRAM));pressCauses.remove(id);return true;
    }
    public void setButtonColor(PanelElementId id,Color color){button(id).setColor(color);emit(id,PanelAction.Kind.COLOR_CHANGED,color.toString(),PanelAction.Cause.PROGRAM);}
    public void setLocked(PanelElementId id,boolean locked){
        PanelControl control=control(id);if(control.locked()==locked)return;
        if(control instanceof SmallButton button&&button.held())release(id);
        control.setLocked(locked);emit(id,PanelAction.Kind.LOCK_CHANGED,Boolean.toString(locked),PanelAction.Cause.PROGRAM);
    }
    public boolean setAdjusterAngle(float degrees){return adjuster.setAngle(degrees);}
    public void setLightColor(LightModule.State color){setLightColor(color,PanelAction.Cause.PROGRAM);}
    private void setLightColor(LightModule.State color,PanelAction.Cause cause){
        if(light.color()==color)return;light.setColor(color);emit(PanelElementId.LIGHT_MODULE,PanelAction.Kind.LIGHT_CHANGED,color.name(),cause);
    }
    boolean pointerDown(PanelElementId id){
        PanelControl control=control(id);if(control.locked())return false;
        if(control instanceof SmallButton)return press(id,PanelAction.Cause.PLAYER);
        if(id==PanelElementId.ADJUSTER)return adjuster.step(PanelAction.Cause.PLAYER);
        LightModule.State[] states=LightModule.State.values();setLightColor(states[(light.color().ordinal()+1)%states.length],PanelAction.Cause.PLAYER);return true;
    }
    void pointerUp(PanelElementId id){if(buttons.containsKey(id))release(id);}
    void bigButton(boolean down){emit(PanelElementId.BIG_BUTTON,down?PanelAction.Kind.PRESSED:PanelAction.Kind.RELEASED,"RED",PanelAction.Cause.PLAYER);}
    public void update(float delta){
        if(!Float.isFinite(delta)||delta<0)return;time+=delta;for(PanelControl control:controls)control.update(delta);
    }
    public void reset(){machine.resetCentralButton();for(PanelControl control:controls)control.reset();pressCauses.clear();history.clear();sequence=0;time=0;}
    void clear(){listeners.clear();history.clear();pressCauses.clear();}
}
