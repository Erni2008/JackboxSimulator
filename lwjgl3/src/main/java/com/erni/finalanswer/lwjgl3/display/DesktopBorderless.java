package com.erni.finalanswer.lwjgl3.display;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.Graphics;
import com.badlogic.gdx.backends.lwjgl3.Lwjgl3Graphics;
import com.badlogic.gdx.backends.lwjgl3.Lwjgl3Window;
import com.erni.finalanswer.utils.DisplayManager;
import org.lwjgl.glfw.GLFW;
import org.lwjgl.system.MemoryStack;

/** Borderless work-area window in logical desktop coordinates, including Retina/scaled/multi-monitor desktops. */
public final class DesktopBorderless implements DisplayManager.Presentation {
    private boolean entered,borderless,decorated,resizable,maximized,previousExclusive,changing;
    private int x,y,width,height;
    private Graphics.DisplayMode previousMode;
    public static void install(){DisplayManager.installPresentation(DesktopBorderless::new);}
    private Lwjgl3Window window(){return ((Lwjgl3Graphics)Gdx.graphics).getWindow();}
    @Override public void enter(){
        if(entered)return;
        long handle=window().getWindowHandle();
        x=window().getPositionX();y=window().getPositionY();width=Gdx.graphics.getWidth();height=Gdx.graphics.getHeight();
        decorated=GLFW.glfwGetWindowAttrib(handle,GLFW.GLFW_DECORATED)==GLFW.GLFW_TRUE;
        resizable=GLFW.glfwGetWindowAttrib(handle,GLFW.GLFW_RESIZABLE)==GLFW.GLFW_TRUE;
        maximized=GLFW.glfwGetWindowAttrib(handle,GLFW.GLFW_MAXIMIZED)==GLFW.GLFW_TRUE;
        previousExclusive=Gdx.graphics.isFullscreen();previousMode=Gdx.graphics.getDisplayMode();entered=true;
        // Preserve an explicit exclusive mode already selected in the main game's settings.
        if(!previousExclusive)expand();
    }
    private void expand(){
        if(changing)return;changing=true;borderless=true;
        try{
            long monitor=((Lwjgl3Graphics.Lwjgl3Monitor)Gdx.graphics.getMonitor()).getMonitorHandle();
            try(MemoryStack stack=MemoryStack.stackPush()){
                var px=stack.mallocInt(1);var py=stack.mallocInt(1);var pw=stack.mallocInt(1);var ph=stack.mallocInt(1);
                GLFW.glfwGetMonitorWorkarea(monitor,px,py,pw,ph);
                window().restoreWindow();Gdx.graphics.setUndecorated(true);Gdx.graphics.setResizable(false);
                Gdx.graphics.setWindowedMode(pw.get(0),ph.get(0));window().setPosition(px.get(0),py.get(0));
            }
        }finally{changing=false;}
    }
    private void collapse(){
        if(changing)return;changing=true;borderless=false;
        try{
            window().restoreWindow();Gdx.graphics.setUndecorated(!decorated);Gdx.graphics.setResizable(resizable);
            Gdx.graphics.setWindowedMode(width,height);window().setPosition(x,y);
            if(maximized)window().maximizeWindow();
        }finally{changing=false;}
    }
    @Override public void toggle(){
        if(changing)return;if(!entered){enter();return;}
        if(borderless||Gdx.graphics.isFullscreen())collapse();else expand();
    }
    @Override public void restore(){
        if(!entered||changing)return;
        if(previousExclusive){
            if(!Gdx.graphics.isFullscreen())Gdx.graphics.setFullscreenMode(previousMode);
        }else if(borderless||Gdx.graphics.getWidth()!=width||Gdx.graphics.getHeight()!=height||window().getPositionX()!=x||window().getPositionY()!=y)collapse();
        entered=false;
    }
    @Override public boolean fullscreen(){return borderless||Gdx.graphics.isFullscreen();}
}
