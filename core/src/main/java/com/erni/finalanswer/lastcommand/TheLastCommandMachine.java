package com.erni.finalanswer.lastcommand;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.g3d.*;
import com.badlogic.gdx.math.*;
import com.badlogic.gdx.math.collision.*;
import com.badlogic.gdx.utils.*;
import net.mgsx.gltf.loaders.glb.GLBLoader;
import net.mgsx.gltf.scene3d.scene.*;

/** Three independent scenes. Source materials, node transforms and GLBs remain intact. */
public final class TheLastCommandMachine implements Disposable {
    public static final String ROOT = "models/last_command/";
    public static final String[] FILES = {"box_final.glb", "hole_final.glb", "button.glb"};
    public static class Placement {
        public Vector3 position = new Vector3();
        public Vector3 rotation = new Vector3();
        public Vector3 scale = new Vector3(1, 1, 1);
        Matrix4 matrix() {
            if (!finite(position) || !finite(rotation) || !finite(scale)
                || Math.abs(scale.x*scale.y*scale.z) < 1e-12f)
                throw new IllegalArgumentException("Placement needs finite coordinates and nonzero scale");
            return new Matrix4().set(position,
            new Quaternion().setEulerAngles(rotation.y, rotation.x, rotation.z), scale); }
    }
    private static boolean finite(Vector3 v) { return v != null && Float.isFinite(v.x) && Float.isFinite(v.y) && Float.isFinite(v.z); }
    public static class Config {
        public Placement body = new Placement(), base = new Placement(), cap = new Placement();
        public Vector3 pressAxis = new Vector3(0, 0, -1);
        public float travel = .025f;
        public float capPickMinY = .48f;
    }
    public final Scene[] scenes = new Scene[3];
    public final MechanicalButton button = new MechanicalButton();
    public final BoundingBox bounds = new BoundingBox();
    public final StringBuilder status = new StringBuilder();
    private final SceneAsset[] assets = new SceneAsset[3];
    private final Array<TrianglePickMesh>[] triangles;
    private float capPickMinY;
    private final BoundingBox[] localBounds = new BoundingBox[3];
    private final Matrix4 capRest = new Matrix4();
    private boolean disposed;
    @SuppressWarnings("unchecked") public TheLastCommandMachine() {
        triangles = new Array[3];
        try {
            Config c = Gdx.files.internal(ROOT + "assembly.json").exists()
                ? new Json().fromJson(Config.class, Gdx.files.internal(ROOT + "assembly.json")) : new Config();
            Placement[] placements = {c.body, c.base, c.cap};
            if (!finite(c.pressAxis) || c.pressAxis.isZero() || !Float.isFinite(c.travel) || c.travel < 0)
                throw new IllegalArgumentException("Invalid pressAxis or travel");
            for (Placement placement : placements) placement.matrix();
            button.localAxis.set(c.pressAxis).nor(); button.travel = c.travel; capPickMinY = c.capPickMinY;
            for (int i = 0; i < 3; i++) {
                var file = Gdx.files.internal(ROOT + FILES[i]);
                if (!file.exists()) { status.append("Missing: ").append(ROOT).append(FILES[i]).append('\n'); continue; }
                try {
                    assets[i] = new GLBLoader().load(file);
                    scenes[i] = new Scene(assets[i].scene);
                    triangles[i] = geometry(scenes[i].modelInstance);
                    scenes[i].modelInstance.transform.set(placements[i].matrix());
                    localBounds[i] = scenes[i].modelInstance.calculateBoundingBox(new BoundingBox());
                    bounds.ext(new BoundingBox(localBounds[i]).mul(scenes[i].modelInstance.transform));
                    Gdx.app.log("THE LAST COMMAND", "Loaded " + file.path() + " bounds=" + localBounds[i]);
                } catch (RuntimeException error) {
                    scenes[i] = null; triangles[i] = null;
                    if (assets[i] != null) { assets[i].dispose(); assets[i] = null; }
                    status.append("Load failed: ").append(FILES[i]).append(" / ").append(error.getMessage()).append('\n');
                }
            }
            capRest.set(c.cap.matrix());
        } catch (RuntimeException error) { status.append("Invalid assembly.json: ").append(error.getMessage()); }
        if (!bounds.isValid()) bounds.set(new Vector3(-1,-1,-1), new Vector3(1,1,1));
    }
    public boolean complete() { return scenes[0] != null && scenes[1] != null && scenes[2] != null; }
    public void update(float delta) {
        button.update(delta);
        if (scenes[2] != null) button.apply(capRest, scenes[2].modelInstance.transform);
    }
    /** Closest visible triangle wins, including occlusion by body and metal base. */
    public boolean hitCap(Ray worldRay) {
        if (!complete()) return false;
        float nearest = Float.POSITIVE_INFINITY; int selected = -1;
        Vector3 hit = new Vector3();
        for (int i=0;i<3;i++) {
            Matrix4 transform = scenes[i].modelInstance.transform;
            Ray ray = new Ray(worldRay.origin, worldRay.direction).mul(new Matrix4(transform).inv());
            if (!Intersector.intersectRayBoundsFast(ray, localBounds[i])) continue;
            Vector3 modelHit = new Vector3();
            float localNearest = Float.POSITIVE_INFINITY;
            boolean found = false;
            for (TrianglePickMesh mesh : triangles[i]) {
                if (mesh.hit(ray, hit)) {
                    float distance = hit.dst2(ray.origin);
                    if (distance < localNearest) { localNearest = distance; modelHit.set(hit); found = true; }
                }
            }
            if (found) {
                // The cap source also contains its metal stem. Only the red dome is an input target.
                boolean redSurface = i != 2 || modelHit.y >= capPickMinY;
                float distance = modelHit.mul(transform).dst2(worldRay.origin);
                if (distance < nearest) { nearest = distance; selected = redSurface ? i : -1; }
            }
        }
        return selected == 2;
    }
    private static Array<TrianglePickMesh> geometry(ModelInstance instance) {
        Array<TrianglePickMesh> result = new Array<>(); Array<Renderable> parts = new Array<>();
        instance.getRenderables(parts, new Pool<Renderable>() { protected Renderable newObject(){return new Renderable();} });
        for (Renderable renderable : parts)
            if (renderable.meshPart.primitiveType == GL20.GL_TRIANGLES) result.add(new TrianglePickMesh(renderable));
        return result;
    }
    @Override public void dispose() {
        if(disposed)return;disposed=true;
        for(SceneAsset asset:assets)if(asset!=null)asset.dispose();
        for(Array<TrianglePickMesh> geometry:triangles)if(geometry!=null)geometry.clear();
    }
}
