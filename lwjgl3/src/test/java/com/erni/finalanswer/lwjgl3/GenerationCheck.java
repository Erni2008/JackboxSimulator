package com.erni.finalanswer.lwjgl3;

import com.badlogic.gdx.*;
import com.badlogic.gdx.backends.lwjgl3.*;
import com.badlogic.gdx.scenes.scene2d.ui.*;
import com.erni.finalanswer.FinalAnswerGame;
import com.erni.finalanswer.screens.GenerationCodeScreen;
import com.erni.finalanswer.rooms.RoomCodeGenerator;

/** Checks the actual screen state and callbacks with a real GL context. */
public final class GenerationCheck extends FinalAnswerGame {
    private boolean checked;
    public static void main(String[] args) {
        var config=new Lwjgl3ApplicationConfiguration();config.setWindowedMode(1280,720);config.disableAudio(true);
        config.setPreferencesConfig(System.getProperty("generation.qa.dir"),Files.FileType.Absolute);
        new Lwjgl3Application(new GenerationCheck(),config);
    }
    static Object field(Object target,String name)throws Exception {var f=target.getClass().getDeclaredField(name);f.setAccessible(true);return f.get(target);}
    static void call(Object target,String name)throws Exception {var m=target.getClass().getDeclaredMethod(name);m.setAccessible(true);m.invoke(target);}
    static void check(boolean value,String message){if(!value)throw new AssertionError(message);}
    @Override public void render(){
        super.render();if(checked)return;checked=true;
        try {
            showGenerationCode();var screen=(GenerationCodeScreen)getScreen();
            var generate=(Button)field(screen,"generateButton");var ok=(Button)field(screen,"confirmButton");var reroll=(Button)field(screen,"rerollButton");
            check(generate.isVisible()&&!ok.isVisible()&&!reroll.isVisible(),"Initial controls");
            call(screen,"generateCode");String original=(String)field(screen,"generatedCode");
            check(RoomCodeGenerator.isValid(original),"Six valid characters");
            check(!generate.isVisible()&&ok.isVisible()&&reroll.isVisible(),"GENERATE becomes OK");
            call(screen,"rerollCode");String next=(String)field(screen,"generatedCode");
            check(!original.equals(next)&&RoomCodeGenerator.isValid(next),"Reroll changes code");
            var labels=(Label[])field(screen,"codeLabels");check(labels.length==6,"Six cells");
            for(int i=0;i<6;i++)check(labels[i].getText().toString().equals(next.substring(i,i+1)),"Displayed code matches");
            call(screen,"confirmCode");check((boolean)field(screen,"leaving"),"Preview OK navigates back");
            screen.prepareForCreation();
            check(generate.isVisible()&&!generate.isDisabled()&&!ok.isVisible()&&!reroll.isVisible()&&!reroll.isDisabled(),"Reopen resets controls");
            call(screen,"generateCode");check(ok.isVisible(),"Generate works again");
            System.out.println("PASS: six cells, GENERATE -> OK, REROLL, preview confirmation and reopen reset");
            Gdx.app.exit();
        }catch(Throwable error){error.printStackTrace();System.exit(1);}
    }
}
