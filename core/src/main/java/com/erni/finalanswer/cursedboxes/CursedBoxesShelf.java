package com.erni.finalanswer.cursedboxes;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.g2d.*;
import com.badlogic.gdx.graphics.glutils.ShaderProgram;
import com.badlogic.gdx.math.*;
import com.badlogic.gdx.utils.Disposable;

/** Draw only the authored cabinet silhouette; the source PNG and its wood/metal pixels stay intact. */
public final class CursedBoxesShelf implements Disposable {
    public static final float WIDTH=10.8f,HEIGHT=7.2f;
    // Actual support tips in the authored contour, rather than the padded PNG bounds.
    public static final float LEFT_FOOT_X=(132.5f/1536f-.5f)*WIDTH,RIGHT_FOOT_X=(1404f/1536f-.5f)*WIDTH;
    public static final float LEFT_FOOT_Y=(.5f-1007f/1024f)*HEIGHT,RIGHT_FOOT_Y=(.5f-1011f/1024f)*HEIGHT;
    // Exterior contour in original 1536x1024 source pixels. No triangles cover the brown backdrop.
    private static final float[] OUTLINE={
        102,13,172,13,181,43,1357,43,1359,20,1380,14,1432,15,1436,39,
        1449,39,1449,108,1435,111,1434,249,1449,249,1449,325,1434,328,
        1434,474,1449,474,1449,549,1434,553,1434,698,1449,698,1449,774,
        1434,778,1434,898,1447,898,1447,964,1433,966,1433,978,1452,981,
        1452,1011,1356,1011,1356,979,179,979,179,1007,86,1007,86,979,
        99,976,99,965,89,964,89,900,99,899,99,777,89,776,89,699,99,698,
        99,551,89,550,89,475,99,473,99,327,90,326,90,250,99,248,
        99,110,90,108,90,40,101,39
    };
    private final PolygonSpriteBatch batch;
    private final PolygonRegion silhouette;
    private final Matrix4 transform=new Matrix4();
    public CursedBoxesShelf(Texture source,ShaderProgram sharedShader){
        batch=new PolygonSpriteBatch(256,256,sharedShader);
        float[] vertices=OUTLINE.clone();for(int i=1;i<vertices.length;i+=2)vertices[i]=1024-vertices[i];
        short[] triangles=new EarClippingTriangulator().computeTriangles(vertices).toArray();
        silhouette=new PolygonRegion(new TextureRegion(source),vertices,triangles);
    }
    public void position(Vector3 origin){transform.idt().translate(origin.x,origin.y,origin.z-.55f);}
    public void draw(PerspectiveCamera camera,float time,float flash){
        batch.setProjectionMatrix(camera.combined);batch.setTransformMatrix(transform);
        Gdx.gl.glEnable(GL20.GL_DEPTH_TEST);batch.begin();
        Gdx.gl.glDepthMask(true);
        batch.setColor(.65f+MathUtils.sin(time*.47f)*.012f+flash*.25f,.59f+flash*.19f,.54f+flash*.1f,1);
        batch.draw(silhouette,-WIDTH/2,-HEIGHT/2,WIDTH,HEIGHT);batch.end();
    }
    @Override public void dispose(){batch.dispose();}
}
