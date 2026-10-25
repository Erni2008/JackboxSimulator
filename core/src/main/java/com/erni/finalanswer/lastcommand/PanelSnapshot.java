package com.erni.finalanswer.lastcommand;
import com.badlogic.gdx.graphics.*;
import java.util.*;
/** Small logical snapshot for quality changes; never retains GLB/model resources. */
final class PanelSnapshot {
    private final Map<PanelElementId,Color> colors=new EnumMap<>(PanelElementId.class);
    private final Set<PanelElementId> locked=EnumSet.noneOf(PanelElementId.class),hidden=EnumSet.noneOf(PanelElementId.class),held=EnumSet.noneOf(PanelElementId.class);
    private final float[] angles;private final float dial,brightness,period,duty;
    private final boolean blinking,hatchOpen;
    private final int lever;
    private final String code,hint;
    private final LightModule.State light;private final Texture hintImage;private final FrontPanel.ActionLog log;
    PanelSnapshot(TheLastCommandMachine machine){
        var panel=machine.panel();log=panel.saveLog();for(var control:panel.controls()){
            if(control.locked())locked.add(control.id());if(!control.visible())hidden.add(control.id());
            if(control instanceof SmallButton button){colors.put(button.id(),button.color());if(button.held())held.add(button.id());}
        }
        if(machine.centralLocked())locked.add(PanelElementId.BIG_BUTTON);
        angles=panel.adjuster().allowedAngles();dial=panel.adjuster().targetAngle();light=panel.light().color();brightness=panel.light().brightness();blinking=panel.light().blinking();period=panel.light().blinkPeriod();duty=panel.light().blinkDuty();
        var modules=machine.mechanisms();lever=modules==null?0:modules.lever().position();hatchOpen=modules!=null&&modules.hatch().open();code=modules==null?"0000":modules.code().code();hint=modules==null?"?":modules.hatch().hintText();hintImage=modules==null?null:modules.hatch().hintImage();
    }
    void restore(TheLastCommandMachine machine){
        var panel=machine.panel();for(var e:colors.entrySet())panel.setButtonColor(e.getKey(),e.getValue());
        panel.adjuster().setAllowedAngles(angles);panel.adjuster().setAngle(dial);panel.light().setColor(light);panel.light().setBrightness(brightness);panel.light().setBlinking(blinking,period,duty);
        var modules=machine.mechanisms();if(modules!=null){modules.lever().setPosition(lever);modules.hatch().setOpen(hatchOpen);modules.code().setCode(code);if(hint!=null)modules.hatch().setHint(hint);else if(hintImage!=null)modules.hatch().setHintImage(hintImage);}
        for(var id:held)panel.press(id);for(var id:locked)panel.setLocked(id,true);for(var id:hidden)panel.control(id).setVisible(false);panel.restoreLog(log);
    }
}
