package com.erni.finalanswer.lastcommand;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.g2d.*;
import com.badlogic.gdx.graphics.g3d.*;
import com.badlogic.gdx.graphics.g3d.attributes.BlendingAttribute;
import com.badlogic.gdx.graphics.g3d.utils.ModelBuilder;
import com.badlogic.gdx.graphics.glutils.FrameBuffer;
import com.badlogic.gdx.math.Matrix4;
import com.badlogic.gdx.utils.*;
import com.erni.finalanswer.ui.UiFonts;
import com.google.gson.JsonObject;
import net.mgsx.gltf.scene3d.attributes.*;
import net.mgsx.gltf.scene3d.scene.Scene;
import java.util.Set;

/** Cached physical dial-face readout; never participates in picking or answer validation. */
final class AdjusterAngleDisplay implements Disposable {
    private final FrameBuffer buffer=new FrameBuffer(Pixmap.Format.RGBA8888,512,192,false);
    private final SpriteBatch batch=new SpriteBatch();
    private final BitmapFont font=UiFonts.body(140);
    private final Model model;final Scene scene;private int last=-1;
    AdjusterAngleDisplay(){
        buffer.getColorBufferTexture().setFilter(Texture.TextureFilter.Linear,Texture.TextureFilter.Linear);
        var map=PBRTextureAttribute.createBaseColorTexture(buffer.getColorBufferTexture());map.offsetV=1;map.scaleV=-1;
        var material=new Material(map,new BlendingAttribute(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA),PBRFloatAttribute.createMetallic(0),PBRFloatAttribute.createRoughness(.8f));
        var builder=new ModelBuilder();builder.begin();builder.part("adjuster-angle",GL20.GL_TRIANGLES,VertexAttributes.Usage.Position|VertexAttributes.Usage.Normal|VertexAttributes.Usage.TextureCoordinates,material).rect(-.18713938f,.31199233f,.202f,-.15113938f,.31199233f,.202f,-.15113938f,.32599233f,.202f,-.18713938f,.32599233f,.202f,0,0,1);model=builder.end();scene=new Scene(new ModelInstance(model));batch.setProjectionMatrix(new Matrix4().setToOrtho2D(0,0,512,192));
    }
    void update(RotaryAdjuster adjuster,JsonObject round){
        boolean relevant=round==null||!round.has("campaign")||!round.get("campaign").getAsBoolean()||Set.of("ADJUSTER","LEVER_SEQUENCE","SHUTDOWN").contains(round.get("taskType").getAsString());
        for(var node:scene.modelInstance.nodes)for(var part:node.parts)part.enabled=relevant&&adjuster.visible();
        if(!relevant||!adjuster.visible())return;int angle=Math.round((adjuster.angle()%180+180)%180);if(angle==last)return;last=angle;
        buffer.begin();Gdx.gl.glClearColor(0,0,0,0);Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT);batch.begin();font.setColor(Color.valueOf("E5D8B5"));font.draw(batch,angle+"°",0,148,512,Align.center,false);batch.end();buffer.end();Gdx.gl.glViewport(0,0,Gdx.graphics.getBackBufferWidth(),Gdx.graphics.getBackBufferHeight());
    }
    public void dispose(){model.dispose();buffer.dispose();font.dispose();batch.dispose();}
}
