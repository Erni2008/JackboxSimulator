package com.erni.finalanswer.lwjgl3;

import com.badlogic.gdx.*;
import com.badlogic.gdx.backends.lwjgl3.*;
import com.erni.finalanswer.lwjgl3.display.DesktopBorderless;
import com.erni.finalanswer.utils.DisplayManager;
import org.lwjgl.glfw.GLFW;
import java.util.*;

/** Native monitor-mode regression: no exclusive monitor attachment, no desktop resolution/refresh changes. */
public final class CursedBoxesDisplayCheck {
    private static Throwable failure;
    public static void main(String[] args){
        DesktopBorderless.install();var cfg=new Lwjgl3ApplicationConfiguration();cfg.setWindowedMode(1100,700);cfg.setTitle("CURSED BOXES display safety check");cfg.useVsync(true);cfg.setForegroundFPS(60);
        new Lwjgl3Application(new ApplicationAdapter(){
            final Map<Long,String> modes=new LinkedHashMap<>();DisplayManager.TemporaryFullscreen presentation;
            int frame,w,h,x,y;boolean finished,changing;
            Lwjgl3Window window(){return ((Lwjgl3Graphics)Gdx.graphics).getWindow();}
            String mode(long monitor){var m=GLFW.glfwGetVideoMode(monitor);return m.width()+"x"+m.height()+"@"+m.refreshRate()+"/"+m.redBits()+m.greenBits()+m.blueBits();}
            void verify(){
                if(GLFW.glfwGetWindowMonitor(window().getWindowHandle())!=0)throw new AssertionError("Exclusive monitor attachment");
                modes.forEach((monitor,expected)->{if(!expected.equals(mode(monitor)))throw new AssertionError("Desktop mode changed: "+expected+" -> "+mode(monitor));});
            }
            @Override public void create(){try{
                var monitors=GLFW.glfwGetMonitors();for(int i=0;i<monitors.limit();i++)modes.put(monitors.get(i),mode(monitors.get(i)));
                w=Gdx.graphics.getWidth();h=Gdx.graphics.getHeight();x=window().getPositionX();y=window().getPositionY();presentation=new DisplayManager.TemporaryFullscreen();
                Gdx.app.log("Display safety","Baseline "+modes+"; window "+w+"x"+h);
            }catch(Throwable e){failure=e;Gdx.app.exit();}}
            @Override public void render(){if(failure!=null||changing)return;try{
                verify();frame++;
                changing=true;
                if(frame==2)presentation.enter();
                if(frame==12){if(!presentation.fullscreen())throw new AssertionError("Borderless not active");presentation.toggle();}
                if(frame==24){if(presentation.fullscreen()||Gdx.graphics.getWidth()!=w||Gdx.graphics.getHeight()!=h)throw new AssertionError("F11 did not restore window");presentation.toggle();}
                if(frame==36)presentation.restore();
                if(frame==48){verify();if(Gdx.graphics.getWidth()!=w||Gdx.graphics.getHeight()!=h||window().getPositionX()!=x||window().getPositionY()!=y||GLFW.glfwGetWindowAttrib(window().getWindowHandle(),GLFW.GLFW_DECORATED)!=GLFW.GLFW_TRUE)throw new AssertionError("Window dimensions/position/decorations lost");finished=true;Gdx.app.log("Display safety","PASS: borderless, F11 twice, restore; every monitor's mode/refresh unchanged; zero exclusive attachment");Gdx.app.exit();}
            }catch(Throwable e){failure=e;Gdx.app.exit();}finally{changing=false;}}
            @Override public void dispose(){if(presentation!=null)presentation.restore();if(!finished&&failure==null)failure=new AssertionError("Display test interrupted");}
        },cfg);
        if(failure!=null)throw new AssertionError("Display regression",failure);
    }
}
