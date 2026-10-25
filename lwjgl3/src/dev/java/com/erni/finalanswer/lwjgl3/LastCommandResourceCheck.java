package com.erni.finalanswer.lwjgl3;
import com.badlogic.gdx.*;
import com.badlogic.gdx.backends.lwjgl3.*;
import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.profiling.*;
import com.erni.finalanswer.lastcommand.*;
import java.util.*;
/** Count actual GL object ownership across two scene lifecycles, not merely Java heap estimates. */
public final class LastCommandResourceCheck extends ApplicationAdapter {
    static final class Audit extends GL20Interceptor {
        final Set<Integer> textures=new HashSet<>(),buffers=new HashSet<>(),frames=new HashSet<>(),renders=new HashSet<>(),programs=new HashSet<>(),shaders=new HashSet<>();
        Audit(){super(new GLProfiler(Gdx.graphics),Gdx.gl20);}
        @Override public int glGenTexture(){int h=super.glGenTexture();textures.add(h);return h;}
        @Override public void glDeleteTexture(int h){textures.remove(h);super.glDeleteTexture(h);}
        @Override public int glGenBuffer(){int h=super.glGenBuffer();buffers.add(h);return h;}
        @Override public void glDeleteBuffer(int h){buffers.remove(h);super.glDeleteBuffer(h);}
        @Override public int glGenFramebuffer(){int h=super.glGenFramebuffer();frames.add(h);return h;}
        @Override public void glDeleteFramebuffer(int h){frames.remove(h);super.glDeleteFramebuffer(h);}
        @Override public int glGenRenderbuffer(){int h=super.glGenRenderbuffer();renders.add(h);return h;}
        @Override public void glDeleteRenderbuffer(int h){renders.remove(h);super.glDeleteRenderbuffer(h);}
        @Override public int glCreateProgram(){int h=super.glCreateProgram();programs.add(h);return h;}
        @Override public void glDeleteProgram(int h){programs.remove(h);super.glDeleteProgram(h);}
        @Override public int glCreateShader(int type){int h=super.glCreateShader(type);shaders.add(h);return h;}
        @Override public void glDeleteShader(int h){shaders.remove(h);super.glDeleteShader(h);}
        String remaining(){return "textures="+textures.size()+", buffers="+buffers.size()+", framebuffers="+frames.size()+", renderbuffers="+renders.size()+", programs="+programs.size()+", shaders="+shaders.size();}
        boolean empty(){return textures.isEmpty()&&buffers.isEmpty()&&frames.isEmpty()&&renders.isEmpty()&&programs.isEmpty()&&shaders.isEmpty();}
    }
    @Override public void create(){
        var original=Gdx.gl20;var audit=new Audit();Gdx.graphics.setGL20(audit);Gdx.gl=Gdx.gl20=audit;
        try{for(int cycle=0;cycle<2;cycle++){
            var machine=new TheLastCommandMachine();var camera=new PerspectiveCamera(45,800,600);new OrbitCameraController(camera,machine);var renderer=new TheLastCommandRenderer(camera,machine);
            var pixmap=new Pixmap(2,2,Pixmap.Format.RGB888);pixmap.setColor(Color.GRAY);pixmap.fill();var borrowed=new Texture(pixmap);pixmap.dispose();machine.mechanisms().hatch().setHintImage(borrowed);
            machine.update(1);renderer.render(0);machine.mechanisms().hatch().setOpen(true);machine.mechanisms().code().setCode("1234");machine.update(.5f);renderer.render(0);
            renderer.dispose();renderer.dispose();machine.dispose();machine.dispose();if(!Gdx.gl.glIsTexture(borrowed.getTextureObjectHandle()))throw new AssertionError("Borrowed hint texture was disposed by the scene");borrowed.dispose();if(!audit.empty())throw new AssertionError("GPU resource leak after cycle "+cycle+": "+audit.remaining());System.out.println("RESOURCE_CYCLE_OK "+cycle+" "+audit.remaining());
        }}finally{Gdx.graphics.setGL20(original);Gdx.gl=Gdx.gl20=original;}Gdx.app.exit();
    }
    public static void main(String[]args){var c=new Lwjgl3ApplicationConfiguration();c.setWindowedMode(800,600);c.disableAudio(true);new Lwjgl3Application(new LastCommandResourceCheck(),c);}
}
