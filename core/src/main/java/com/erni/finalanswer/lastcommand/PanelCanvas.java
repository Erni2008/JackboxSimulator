package com.erni.finalanswer.lastcommand;
import com.badlogic.gdx.*;
import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.g2d.*;
import com.badlogic.gdx.graphics.glutils.FrameBuffer;
import com.badlogic.gdx.graphics.g3d.*;
import com.badlogic.gdx.graphics.g3d.utils.*;
import com.badlogic.gdx.math.*;
import com.badlogic.gdx.utils.Disposable;
import net.mgsx.gltf.scene3d.attributes.*;
import com.erni.finalanswer.ui.UiFonts;
/** One small render target, reused until its content changes; no per-character models. */
final class PanelCanvas implements Disposable {
    private static final String[] DIGITS={"0","1","2","3","4","5","6","7","8","9"};
    final FrameBuffer buffer;
    final Model model;
    final ModelInstance instance;
    private final SpriteBatch batch=new SpriteBatch();
    private final BitmapFont font;
    private final GlyphLayout layout=new GlyphLayout();
    private final Matrix4 projection=new Matrix4();
    PanelCanvas(int cells,float[] centers,float y,float z,float width,float height){
        this(cells,centers,y,z,width,height,false);
    }
    PanelCanvas(int cells,float[] centers,float y,float z,float width,float height,boolean horizontal){
        font=cells==4?digitFont():UiFonts.body(48);
        buffer=new FrameBuffer(Pixmap.Format.RGBA8888,horizontal?256:128*cells,horizontal?128:256,false);
        buffer.getColorBufferTexture().setFilter(Texture.TextureFilter.Linear,Texture.TextureFilter.Linear);
        ModelBuilder builder=new ModelBuilder();builder.begin();
        for(int i=0;i<cells;i++){
            int cellWidth=buffer.getWidth()/cells;
            TextureRegion region=new TextureRegion(buffer.getColorBufferTexture(),cellWidth*i,0,cellWidth,buffer.getHeight());region.flip(false,true);
            Material material=new Material(PBRTextureAttribute.createBaseColorTexture(region),PBRTextureAttribute.createEmissiveTexture(region),PBRColorAttribute.createEmissive(new Color(.9f,.17f,.09f,1)),PBRFloatAttribute.createMetallic(0),PBRFloatAttribute.createRoughness(1));
            var part=builder.part("display-"+i,GL20.GL_TRIANGLES,VertexAttributes.Usage.Position|VertexAttributes.Usage.Normal|VertexAttributes.Usage.TextureCoordinates,material);
            float x=centers[i],w=width*.5f,h=height*.5f;
            part.rect(x-w,y-h,z,x+w,y-h,z,x+w,y+h,z,x-w,y+h,z,0,0,1);
        }
        model=builder.end();instance=new ModelInstance(model);
    }
    private static BitmapFont digitFont(){
        var generator=new com.badlogic.gdx.graphics.g2d.freetype.FreeTypeFontGenerator(Gdx.files.internal("ui/fonts/NotoSans-Regular.ttf"));
        try{var p=new com.badlogic.gdx.graphics.g2d.freetype.FreeTypeFontGenerator.FreeTypeFontParameter();p.size=96;p.characters="0123456789";p.minFilter=Texture.TextureFilter.Linear;p.magFilter=Texture.TextureFilter.Linear;return generator.generateFont(p);}finally{generator.dispose();}
    }
    void digits(int[] old,int[] digits,float[] progress,int[] directions){
        begin();
        for(int i=0;i<digits.length;i++){
            Gdx.gl.glEnable(GL20.GL_SCISSOR_TEST);Gdx.gl.glScissor(i*128,0,128,256);
            batch.begin();font.setColor(.9f,.19f,.1f,1);
            float offset=progress[i]>=1?0:Interpolation.smooth.apply(progress[i])*256*directions[i];
            if(progress[i]<1)text(DIGITS[old[i]],i*128,offset);
            text(DIGITS[digits[i]],i*128,offset-(progress[i]<1?256*directions[i]:0));batch.end();
        }
        Gdx.gl.glDisable(GL20.GL_SCISSOR_TEST);buffer.end();
    }
    void hint(String text,Texture image){
        begin();batch.begin();
        if(image!=null)batch.draw(image,0,0,buffer.getWidth(),buffer.getHeight());
        else {font.setColor(.72f,.57f,.31f,1);layout.setText(font,text);font.getData().setScale(Math.min(.65f,(buffer.getWidth()-24)/Math.max(1,layout.width)));layout.setText(font,text);font.draw(batch,text,(buffer.getWidth()-layout.width)*.5f,buffer.getHeight()*.5f+layout.height*.5f);font.getData().setScale(1);}
        batch.end();buffer.end();
    }
    private void begin(){buffer.begin();Gdx.gl.glDisable(GL20.GL_SCISSOR_TEST);Gdx.gl.glClearColor(.012f,.007f,.006f,1);Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT);batch.setProjectionMatrix(projection.setToOrtho2D(0,0,buffer.getWidth(),buffer.getHeight()));}
    private void text(String text,int x,float offset){layout.setText(font,text);font.draw(batch,text,x+(128-layout.width)*.5f,128+layout.height*.5f+offset);}
    public void dispose(){model.dispose();buffer.dispose();batch.dispose();font.dispose();}
}
