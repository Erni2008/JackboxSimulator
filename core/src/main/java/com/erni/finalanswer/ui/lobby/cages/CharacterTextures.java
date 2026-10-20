package com.erni.finalanswer.ui.lobby.cages;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.files.FileHandle;
import com.badlogic.gdx.graphics.*;

/** Straight-alpha character art with coverage-weighted mip levels. Source PNGs and level zero stay unchanged. */
public final class CharacterTextures {
    private CharacterTextures() {}
    public static Texture load(String path){return finish(new Texture(new MipData(Gdx.files.internal(path),null)));}
    /** Caller retains ownership of the input pixmap, just as with new Texture(pixmap). */
    public static Texture upload(Pixmap pixels){return finish(new Texture(new MipData(null,pixels)));}
    private static Texture finish(Texture texture){texture.setFilter(Texture.TextureFilter.MipMapLinearLinear,Texture.TextureFilter.Linear);texture.setWrap(Texture.TextureWrap.ClampToEdge,Texture.TextureWrap.ClampToEdge);return texture;}
    /** Desktop sampler bias: retain finer detail while keeping alpha-correct trilinear mipmaps. */
    public static void detailBias(Texture texture,float bias){
        if(Gdx.graphics.getGLVersion().getType()!=com.badlogic.gdx.graphics.glutils.GLVersion.Type.OpenGL)return;
        java.nio.IntBuffer previous=com.badlogic.gdx.utils.BufferUtils.newIntBuffer(1);
        Gdx.gl.glGetIntegerv(GL20.GL_TEXTURE_BINDING_2D,previous);texture.bind();
        // GL_TEXTURE_LOD_BIAS, desktop OpenGL 1.4+. No texture pixels or mip levels are altered.
        Gdx.gl.glTexParameterf(GL20.GL_TEXTURE_2D,0x8501,Math.max(-.75f,Math.min(0,bias)));
        Gdx.gl.glBindTexture(GL20.GL_TEXTURE_2D,previous.get(0));
    }
    /** Average coverage, then unpremultiply the weighted RGB. Transparent fringe RGB cannot brighten/darken edges. */
    public static Pixmap reduce(Pixmap source){
        if(source.getFormat()!=Pixmap.Format.RGBA8888){
            Pixmap rgba=new Pixmap(source.getWidth(),source.getHeight(),Pixmap.Format.RGBA8888);rgba.setBlending(Pixmap.Blending.None);rgba.drawPixmap(source,0,0);
            try{return reduce(rgba);}finally{rgba.dispose();}
        }
        int sw=source.getWidth(),sh=source.getHeight(),w=Math.max(1,sw/2),h=Math.max(1,sh/2);
        Pixmap result=new Pixmap(w,h,Pixmap.Format.RGBA8888);
        var input=source.getPixels().duplicate().order(java.nio.ByteOrder.BIG_ENDIAN);
        var output=result.getPixels().duplicate().order(java.nio.ByteOrder.BIG_ENDIAN);
        for(int y=0;y<h;y++)for(int x=0;x<w;x++){
            int x0=x*sw/w,x1=(x+1)*sw/w,y0=y*sh/h,y1=(y+1)*sh/h;
            int alpha=0,r=0,g=0,b=0,count=(x1-x0)*(y1-y0);
            for(int sy=y0;sy<y1;sy++)for(int sx=x0;sx<x1;sx++){
                int pixel=input.getInt((sy*sw+sx)*4),a=pixel&255;alpha+=a;r+=(pixel>>>24)*a;g+=((pixel>>>16)&255)*a;b+=((pixel>>>8)&255)*a;
            }
            int rgba=alpha==0?0:(((r+alpha/2)/alpha)<<24)|(((g+alpha/2)/alpha)<<16)|(((b+alpha/2)/alpha)<<8)|((alpha+count/2)/count);
            output.putInt((y*w+x)*4,rgba);
        }return result;
    }
    /** Small hue-preserving lift in material midtones; black, alpha and clipped highlights stay intact. */
    public static void liftMidtones(Pixmap pixels,float amount){
        var data=pixels.getPixels().duplicate().order(java.nio.ByteOrder.BIG_ENDIAN);
        for(int i=0,n=pixels.getWidth()*pixels.getHeight()*4;i<n;i+=4){
            int rgba=data.getInt(i);if((rgba&255)==0)continue;
            int r=rgba>>>24,g=(rgba>>>16)&255,b=(rgba>>>8)&255,max=Math.max(r,Math.max(g,b));if(max==0)continue;
            float luma=(r*.2126f+g*.7152f+b*.0722f)/255f;
            float gain=Math.min(255f/max,1+amount*4*luma*(1-luma));
            data.putInt(i,(Math.round(r*gain)<<24)|(Math.round(g*gain)<<16)|(Math.round(b*gain)<<8)|(rgba&255));
        }
    }
    private static final class MipData implements TextureData {
        private final FileHandle file;private Pixmap pixels;private int width,height;private boolean prepared;
        MipData(FileHandle file,Pixmap pixels){this.file=file;this.pixels=pixels;}
        @Override public TextureDataType getType(){return TextureDataType.Custom;}
        @Override public boolean isPrepared(){return prepared;}
        @Override public void prepare(){if(prepared)throw new IllegalStateException("Character texture already prepared");if(pixels==null){if(file==null)throw new IllegalStateException("Unmanaged character texture cannot reload");pixels=new Pixmap(file);}width=pixels.getWidth();height=pixels.getHeight();prepared=true;}
        @Override public void consumeCustomData(int target){
            if(!prepared)throw new IllegalStateException("Character texture not prepared");Pixmap current=pixels;boolean owned=false;
            try {
                if(current.getFormat()!=Pixmap.Format.RGBA8888){Pixmap rgba=new Pixmap(width,height,Pixmap.Format.RGBA8888);rgba.setBlending(Pixmap.Blending.None);rgba.drawPixmap(current,0,0);current=rgba;owned=true;}
                Gdx.gl.glPixelStorei(GL20.GL_UNPACK_ALIGNMENT,1);int level=0;
                while(true){Gdx.gl.glTexImage2D(target,level,GL20.GL_RGBA,current.getWidth(),current.getHeight(),0,GL20.GL_RGBA,GL20.GL_UNSIGNED_BYTE,current.getPixels());
                    if(current.getWidth()==1&&current.getHeight()==1)break;
                    Pixmap next=reduce(current);if(owned)current.dispose();current=next;owned=true;level++;
                }
            }finally{if(owned)current.dispose();if(file!=null)pixels.dispose();pixels=null;prepared=false;}
        }
        @Override public Pixmap consumePixmap(){throw new UnsupportedOperationException("Character mip upload is custom");}
        @Override public boolean disposePixmap(){return false;}
        @Override public int getWidth(){return width;}@Override public int getHeight(){return height;}
        @Override public Pixmap.Format getFormat(){return Pixmap.Format.RGBA8888;}
        @Override public boolean useMipMaps(){return true;}
        @Override public boolean isManaged(){return file!=null;}
    }
}
