package com.erni.finalanswer.lastcommand;

import com.badlogic.gdx.*;
import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.g2d.BitmapFont;
import com.badlogic.gdx.scenes.scene2d.*;
import com.badlogic.gdx.scenes.scene2d.ui.*;
import com.badlogic.gdx.scenes.scene2d.utils.*;
import com.badlogic.gdx.utils.viewport.ScreenViewport;
import com.erni.finalanswer.FinalAnswerGame;
import com.erni.finalanswer.ui.UiFonts;

/** Local, self-contained preview. No gameplay tasks or server protocol changes. */
public final class TheLastCommandScreen extends ScreenAdapter {
    private final FinalAnswerGame game;
    private final TheLastCommandMachine machine = new TheLastCommandMachine();
    private final PerspectiveCamera camera = new PerspectiveCamera(45,Gdx.graphics.getWidth(),Gdx.graphics.getHeight());
    private final OrbitCameraController orbit = new OrbitCameraController(camera,machine);
    private final TheLastCommandRenderer renderer = new TheLastCommandRenderer(camera,machine);
    private final Stage ui = new Stage(new ScreenViewport());
    private final BitmapFont font = UiFonts.body(18);
    private final Texture pixel;
    private final InputMultiplexer input;
    private boolean disposed;
    public TheLastCommandScreen(FinalAnswerGame game) {
        this.game=game;
        Pixmap p=new Pixmap(1,1,Pixmap.Format.RGBA8888);p.setColor(Color.WHITE);p.fill();pixel=new Texture(p);p.dispose();
        var style=new TextButton.TextButtonStyle();style.font=font;style.fontColor=Color.valueOf("C5BAAB");
        var solid=new TextureRegionDrawable(pixel);style.up=solid.tint(Color.valueOf("242628"));style.over=solid.tint(Color.valueOf("404345"));style.down=solid.tint(Color.valueOf("151719"));
        Table table=new Table();table.setFillParent(true);table.top().left().pad(20);ui.addActor(table);
        table.add(new Label("THE LAST COMMAND (3D PREVIEW)",new Label.LabelStyle(font,Color.valueOf("C5BAAB")))).left().expandX();
        TextButton reset=new TextButton("RESET CAMERA",style);table.add(reset).padLeft(16);
        TextButton back=new TextButton("BACK",style);table.add(back).padLeft(16);table.row();
        String message=machine.complete()?"LMB: orbit / hold red cap | RMB: pan | wheel: zoom | Esc: back"
            :"Place the three original GLBs in assets/models/last_command/\n"+machine.status+"Assembly calibration requires the original models.";
        Label info=new Label(message,new Label.LabelStyle(font,Color.valueOf("9D9690")));info.setWrap(true);
        table.add(info).colspan(3).fillX().left().padTop(15);
        reset.addListener(new ChangeListener(){public void changed(ChangeEvent e,Actor actor){orbit.reset();}});
        back.addListener(new ChangeListener(){public void changed(ChangeEvent e,Actor actor){exit();}});
        input=new InputMultiplexer(ui,new InputAdapter(){@Override public boolean keyDown(int key){if(key==Input.Keys.ESCAPE){exit();return true;}return false;}},orbit);
    }
    private void exit(){Gdx.app.postRunnable(()->{if(game.getScreen()==this)game.showMainMenu();});}
    @Override public void show(){Gdx.input.setInputProcessor(input);}
    @Override public void render(float delta){
        machine.update(delta);
        Gdx.gl.glViewport(0,0,Gdx.graphics.getBackBufferWidth(),Gdx.graphics.getBackBufferHeight());
        Gdx.gl.glClearColor(.018f,.021f,.024f,1);Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT|GL20.GL_DEPTH_BUFFER_BIT);
        renderer.render(delta);Gdx.gl.glDisable(GL20.GL_DEPTH_TEST);ui.getViewport().apply();ui.act(delta);ui.draw();
    }
    @Override public void resize(int width,int height){if(width<=0||height<=0)return;camera.viewportWidth=width;camera.viewportHeight=height;camera.update();ui.getViewport().update(width,height,true);}
    @Override public void pause(){orbit.cancel();}
    @Override public void hide(){orbit.cancel();if(Gdx.input.getInputProcessor()==input)Gdx.input.setInputProcessor(null);dispose();}
    @Override public void dispose(){if(disposed)return;disposed=true;orbit.cancel();renderer.dispose();machine.dispose();ui.dispose();font.dispose();pixel.dispose();}
}
