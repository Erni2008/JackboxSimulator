package com.erni.finalanswer.lwjgl3;

import com.badlogic.gdx.*;
import com.badlogic.gdx.backends.lwjgl3.*;
import com.badlogic.gdx.graphics.Texture;
import com.erni.finalanswer.FinalAnswerGame;
import com.erni.finalanswer.cursedboxes.*;

/** Real menu entry, cancel with partial assets, display restoration and cached reentry. */
public final class CursedBoxesNavigationCheck {
    private static Throwable failure;
    public static void main(String[] args){
        com.erni.finalanswer.lwjgl3.display.DesktopBorderless.install();
        var config=new Lwjgl3ApplicationConfiguration();config.setTitle("Cursed Boxes navigation check");config.setWindowedMode(1280,800);config.setForegroundFPS(60);
        config.setPreferencesConfig(System.getProperty("java.io.tmpdir")+"/finalanswer-cursed-navigation",com.badlogic.gdx.Files.FileType.Absolute);
        new Lwjgl3Application(new FinalAnswerGame(){
            float age;int step,waitFrames,baselineTextures;Screen menu,demo;boolean rendering,initialFullscreen,finished;int initialWidth,initialHeight;
            @Override public void create(){try{super.create();menu=getScreen();initialFullscreen=Gdx.graphics.isFullscreen();initialWidth=Gdx.graphics.getWidth();initialHeight=Gdx.graphics.getHeight();}catch(Throwable e){failure=e;Gdx.app.exit();}}
            void verifyMenu(){if(Gdx.graphics.isFullscreen()!=initialFullscreen||(!initialFullscreen&&(Gdx.graphics.getWidth()!=initialWidth||Gdx.graphics.getHeight()!=initialHeight)))throw new AssertionError("Previous display not restored");if(getScreen()!=menu||Gdx.input.getInputProcessor()==demo||getActiveRoom()!=null)throw new AssertionError("Menu/input/room restore");}
            @Override public void render(){if(failure!=null||rendering)return;rendering=true;try{
                super.render();age+=Gdx.graphics.getDeltaTime();
                switch(step){
                    case 0:if(age>.3f){baselineTextures=Texture.getNumManagedTextures();showCursedBoxes();if(!(getScreen() instanceof CursedBoxesLoadingScreen)||Gdx.input.getInputProcessor()!=getScreen())throw new AssertionError("Loading entry/input");step=1;}break;
                    case 1:if(++waitFrames==5){
                        if(!(getScreen() instanceof CursedBoxesLoadingScreen loading))throw new AssertionError("No partial loading stage");
                        loading.keyDown(Input.Keys.ESCAPE);verifyMenu();if(Texture.getNumManagedTextures()!=baselineTextures)throw new AssertionError("Partial loading resources leaked");
                        showCursedBoxes();step=2;
                    }break;
                    case 2:if(getScreen() instanceof CursedBoxesScreen){demo=getScreen();if(Gdx.input.getInputProcessor()!=demo||!((CursedBoxesScreen)demo).presentationFullscreen())throw new AssertionError("Entry/input");age=0;step=3;}break;
                    case 3:if(age>.3f){((CursedBoxesScreen)demo).keyDown(Input.Keys.ESCAPE);verifyMenu();age=0;step=4;}break;
                    case 4:if(age>.3f){showCursedBoxes();if(getScreen()!=demo)throw new AssertionError("Cached screen lost");age=0;step=5;}break;
                    case 5:if(age>.3f){((CursedBoxesScreen)demo).keyDown(Input.Keys.R);((CursedBoxesScreen)demo).keyDown(Input.Keys.ESCAPE);verifyMenu();finished=true;Gdx.app.log("Cursed Boxes","PASS: staged menu entry, partial-load cancellation/resource release, Escape, input ownership, display restoration, cached reentry and room isolation");Gdx.app.exit();}break;
                }
            }catch(Throwable e){failure=e;Gdx.app.exit();}finally{rendering=false;}}
            @Override public void dispose(){super.dispose();if(!finished&&failure==null)failure=new AssertionError("Navigation test interrupted");}
        },config);
        if(failure!=null)throw new AssertionError("Navigation QA",failure);
    }
}
