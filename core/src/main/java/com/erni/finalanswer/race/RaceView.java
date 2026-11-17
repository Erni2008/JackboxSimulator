package com.erni.finalanswer.race;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.g3d.*;
import com.badlogic.gdx.graphics.g3d.attributes.*;
import com.badlogic.gdx.graphics.g3d.utils.MeshPartBuilder;
import com.badlogic.gdx.graphics.g3d.utils.MeshPartBuilder.VertexInfo;
import com.badlogic.gdx.graphics.g3d.utils.ModelBuilder;
import com.badlogic.gdx.math.*;
import com.badlogic.gdx.math.collision.BoundingBox;
import com.badlogic.gdx.utils.Disposable;
import java.util.*;
import net.mgsx.gltf.loaders.glb.GLBLoader;
import net.mgsx.gltf.scene3d.attributes.*;
import net.mgsx.gltf.scene3d.lights.DirectionalShadowLight;
import net.mgsx.gltf.scene3d.scene.*;
import net.mgsx.gltf.scene3d.shaders.*;
import net.mgsx.gltf.scene3d.utils.IBLBuilder;

/**
 * 3D presentation of the race: PBR-textured terraces and planks (Poly Haven CC0), real scanned trees, rocks, ferns and
 * grass, a photographic sky, distance haze over the gorge, a following sun shadow, and the runners. Host only.
 */
public final class RaceView implements Disposable {
    public final PerspectiveCamera camera = new PerspectiveCamera(50, 1920, 1080);
    private final SceneManager scene; private final DirectionalShadowLight sun; private final Cubemap diffuse, specular; private final Texture brdf;
    private final ModelBatch skyBatch = new ModelBatch(); private final ModelInstance sky; private final List<Disposable> owned = new ArrayList<>();
    private final Map<String, SceneAsset> assets = new HashMap<>(); private final Map<String, BoundingBox> bounds = new HashMap<>();
    private final Map<RaceCourse.Block, ModelInstance> blockInst = new HashMap<>();
    private final List<ModelInstance> sweeperInst = new ArrayList<>(); private final List<Scene> pendBob = new ArrayList<>(); private final List<ModelInstance> pendChain = new ArrayList<>();
    private final List<Scene> boulderPool = new ArrayList<>(); private final Map<RaceRunner, Runner> runners = new HashMap<>();
    private final RaceCourse course; private final Vector3 camTarget = new Vector3(0, 0, 0), tmp = new Vector3();
    private final Model bark;

    private static final Color[] COLORS = {new Color(.86f, .18f, .16f, 1), new Color(.18f, .45f, .9f, 1), new Color(.95f, .72f, .12f, 1), new Color(.25f, .72f, .3f, 1), new Color(.62f, .3f, .85f, 1), new Color(.98f, .5f, .15f, 1), new Color(.2f, .78f, .8f, 1), new Color(.92f, .4f, .62f, 1)};

    private final class Runner {final ModelInstance body; float squash, lean, prevVy; Runner(ModelInstance b) {body = b;}}

    public RaceView(RaceCourse course) {
        this.course = course;
        camera.near = .2f; camera.far = 900;
        PBRShaderConfig cfg = PBRShaderProvider.createDefaultConfig(); cfg.numBones = 0; cfg.numDirectionalLights = 1; cfg.numPointLights = 0; cfg.numSpotLights = 0;
        var depth = PBRShaderProvider.createDefaultDepthConfig(); depth.numBones = 0;
        scene = new SceneManager(new PBRShaderProvider(cfg), new PBRDepthShaderProvider(depth)); scene.setCamera(camera);
        sun = new DirectionalShadowLight(4096, 4096, 64, 64, 1, 160);
        sun.set(new Color(1f, .93f, .8f, 1), new Vector3(-.45f, -.78f, .42f).nor(), 4.2f); scene.environment.add(sun);
        IBLBuilder ib = IBLBuilder.createOutdoor(sun);
        ib.nearGroundColor.set(.24f, .26f, .16f, 1); ib.farGroundColor.set(.35f, .4f, .38f, 1); ib.nearSkyColor.set(.66f, .76f, .9f, 1); ib.farSkyColor.set(.4f, .56f, .82f, 1);
        try {diffuse = ib.buildIrradianceMap(64); specular = ib.buildRadianceMap(8);} finally {ib.dispose();}
        brdf = new Texture(Gdx.files.classpath("net/mgsx/gltf/shaders/brdfLUT.png"));
        scene.setAmbientLight(.6f);
        scene.environment.set(PBRCubemapAttribute.createDiffuseEnv(diffuse)); scene.environment.set(PBRCubemapAttribute.createSpecularEnv(specular));
        scene.environment.set(new PBRTextureAttribute(PBRTextureAttribute.BRDFLUTTexture, brdf));
        scene.environment.set(new ColorAttribute(ColorAttribute.Fog, .66f, .70f, .68f, 1)); scene.environment.set(FogAttribute.createFog(30, 260, 1.15f));

        Texture skyTex = tex("race/sky.jpg");
        Model skyModel = new ModelBuilder().createSphere(1600, 1600, 1600, 64, 32, new Material(TextureAttribute.createDiffuse(skyTex), IntAttribute.createCullFace(GL20.GL_FRONT)), VertexAttributes.Usage.Position | VertexAttributes.Usage.TextureCoordinates);
        owned.add(skyModel); sky = new ModelInstance(skyModel);

        Material grassTop = mat("leafy_grass"), rockSide = mat("rock_face_03"), plank = mat("brown_planks_05"), stoneTop = mat("mossy_rock"), barkMat = mat("bark_brown_02"), ground = mat("forest_ground_04");
        for (RaceCourse.Block b : course.blocks) {
            Material top = b.mat == RaceCourse.Mat.GRASS ? grassTop : b.mat == RaceCourse.Mat.PLANK ? plank : stoneTop, side = b.mat == RaceCourse.Mat.PLANK ? plank : rockSide;
            Model m = block(b, top, side); owned.add(m); ModelInstance mi = new ModelInstance(m); blockInst.put(b, mi); scene.getRenderableProviders().add(mi);
        }
        // valley floor far below
        {ModelBuilder mb = new ModelBuilder(); mb.begin(); MeshPartBuilder p = mb.part("floor", GL20.GL_TRIANGLES, attrs(), ground);
            quad(p, -260, -34, -120, 260, -34, -120, 260, -34, 420, -260, -34, 420, 0, 1, 0, 6f); Model m = mb.end(); owned.add(m); scene.getRenderableProviders().add(new ModelInstance(m));}
        // spinning logs
        bark = new ModelBuilder().createCylinder(.84f, 1, .84f, 24, barkMat, attrs()); owned.add(bark);
        for (var s : course.sweepers) {ModelInstance log = new ModelInstance(bark); sweeperInst.add(log); scene.getRenderableProviders().add(log);
            ModelInstance post = new ModelInstance(bark); post.transform.setToTranslation(s.x, s.y - .2f, s.z).scale(1.3f, 1.6f, 1.3f); scene.getRenderableProviders().add(post);}
        // wrecking boulders on chains from a timber gallows
        for (var p : course.pendulums) {
            Scene bob = prop("boulder_01", p.px, p.py, p.pz, p.radius * 2.1f, 0); pendBob.add(bob);
            ModelInstance chain = new ModelInstance(bark); pendChain.add(chain); scene.getRenderableProviders().add(chain);
            for (int sgn = -1; sgn <= 1; sgn += 2) {ModelInstance post = new ModelInstance(bark); post.transform.setToTranslation(sgn * 6.4f, (course.blocks.get(0).yTop0 + p.py) / 2 + 1.4f, p.pz).scale(.9f, p.py - 1.2f, .9f); scene.getRenderableProviders().add(post);}
            ModelInstance beam = new ModelInstance(bark); beam.transform.setToTranslation(0, p.py, p.pz).rotate(Vector3.Z, 90).scale(.85f, 13.6f, .85f); scene.getRenderableProviders().add(beam);
        }
        // finish arch
        float fy = course.spawnY(course.finishZ);
        for (int sgn = -1; sgn <= 1; sgn += 2) {ModelInstance post = new ModelInstance(bark); post.transform.setToTranslation(sgn * 7.5f, fy + 3.5f, course.finishZ).scale(1.1f, 7, 1.1f); scene.getRenderableProviders().add(post);}
        {ModelInstance beam = new ModelInstance(bark); beam.transform.setToTranslation(0, fy + 7.2f, course.finishZ).rotate(Vector3.Z, 90).scale(1, 16.5f, 1); scene.getRenderableProviders().add(beam);
            Model banner = new ModelBuilder().createBox(13, 1.6f, .12f, new Material(PBRColorAttribute.createBaseColorFactor(new Color(.75f, .08f, .06f, 1)), PBRFloatAttribute.createRoughness(.8f), PBRFloatAttribute.createMetallic(0)), VertexAttributes.Usage.Position | VertexAttributes.Usage.Normal);
            owned.add(banner); ModelInstance bi = new ModelInstance(banner); bi.transform.setToTranslation(0, fy + 6, course.finishZ); scene.getRenderableProviders().add(bi);}
        decorate();
        for (int i = 0; i < 6; i++) {Scene b = prop("boulder_01", 0, -200, 0, 2.4f, 0); boulderPool.add(b);}
    }

    public void addRunner(RaceRunner r) {
        Color c = COLORS[r.slot % COLORS.length]; ModelBuilder mb = new ModelBuilder(); mb.begin();
        Material skin = new Material(PBRColorAttribute.createBaseColorFactor(c), PBRFloatAttribute.createRoughness(.42f), PBRFloatAttribute.createMetallic(0));
        Material white = new Material(PBRColorAttribute.createBaseColorFactor(new Color(.97f, .97f, .95f, 1)), PBRFloatAttribute.createRoughness(.25f), PBRFloatAttribute.createMetallic(0));
        Material black = new Material(PBRColorAttribute.createBaseColorFactor(new Color(.03f, .03f, .04f, 1)), PBRFloatAttribute.createRoughness(.15f), PBRFloatAttribute.createMetallic(0));
        long a = VertexAttributes.Usage.Position | VertexAttributes.Usage.Normal;
        var body = mb.part("body", GL20.GL_TRIANGLES, a, skin); body.setVertexTransform(new Matrix4().setToTranslation(0, .78f, 0)); com.badlogic.gdx.graphics.g3d.utils.shapebuilders.CapsuleShapeBuilder.build(body, .42f, 1.5f, 24);
        var visor = mb.part("visor", GL20.GL_TRIANGLES, a, white); visor.setVertexTransform(new Matrix4().setToTranslation(0, 1.1f, .26f).scale(1, .62f, .45f)); com.badlogic.gdx.graphics.g3d.utils.shapebuilders.SphereShapeBuilder.build(visor, .62f, .62f, .62f, 20, 14);
        var eyes = mb.part("eyes", GL20.GL_TRIANGLES, a, black);
        for (int s = -1; s <= 1; s += 2) {eyes.setVertexTransform(new Matrix4().setToTranslation(s * .13f, 1.13f, .4f)); com.badlogic.gdx.graphics.g3d.utils.shapebuilders.SphereShapeBuilder.build(eyes, .11f, .15f, .08f, 12, 10);}
        var feet = mb.part("feet", GL20.GL_TRIANGLES, a, skin);
        for (int s = -1; s <= 1; s += 2) {feet.setVertexTransform(new Matrix4().setToTranslation(s * .2f, .08f, .06f)); com.badlogic.gdx.graphics.g3d.utils.shapebuilders.SphereShapeBuilder.build(feet, .24f, .16f, .34f, 12, 8);}
        Model m = mb.end(); owned.add(m); ModelInstance mi = new ModelInstance(m); runners.put(r, new Runner(mi)); scene.getRenderableProviders().add(mi);
    }

    /** Camera follows the focus runner from behind and above (three-quarter view). */
    public void render(float dt, RaceRunner focus) {
        for (var e : blockInst.entrySet()) {var b = e.getKey(); float shake = b.crumbles && b.crumbleAt >= 0 && course.time - b.crumbleAt < .75f ? MathUtils.sin(course.time * 70) * .05f : 0;
            e.getValue().transform.setToTranslation(b.offX + shake, b.gone ? -500 : b.offY, 0);}
        for (int i = 0; i < course.sweepers.size(); i++) {var s = course.sweepers.get(i); sweeperInst.get(i).transform.setToTranslation(s.x, s.y, s.z).rotateRad(Vector3.Y, -s.angle).rotate(Vector3.Z, 90).scale(1, s.len * 2, 1);}
        for (int i = 0; i < course.pendulums.size(); i++) {var p = course.pendulums.get(i);
            pendBob.get(i).modelInstance.transform.setToTranslation(p.bob).rotateRad(Vector3.Z, p.swing).scl(scaleOf("boulder_01", p.radius * 2.1f)); pendBob.get(i).modelInstance.transform.translate(tmp.set(center("boulder_01")).scl(-1));
            float mx = (p.px + p.bob.x) / 2, my = (p.py + p.bob.y) / 2; pendChain.get(i).transform.setToTranslation(mx, my, p.pz).rotateRad(Vector3.Z, p.swing).scale(.14f, p.len - p.radius * .6f, .14f);}
        for (int i = 0; i < boulderPool.size(); i++) {var t = boulderPool.get(i).modelInstance.transform;
            if (i < course.boulders.size()) {var b = course.boulders.get(i); float s = scaleOf("boulder_01", b.radius * 2); t.setToTranslation(b.pos).rotateRad(Vector3.X, b.spin).scl(s).translate(tmp.set(center("boulder_01")).scl(-1));}
            else t.setToTranslation(0, -300, 0);}
        for (var e : runners.entrySet()) {RaceRunner r = e.getKey(); Runner v = e.getValue();
            if (r.ground != null && v.prevVy < -6) v.squash = Math.min(.35f, -v.prevVy * .025f); v.prevVy = r.vel.y; v.squash = Math.max(0, v.squash - dt * 2.2f);
            float hs = (float) Math.hypot(r.vel.x, r.vel.z); r.anim += dt * hs * 1.9f; v.lean += ((r.ground != null ? hs * .025f : -.08f) - v.lean) * Math.min(1, dt * 10);
            float bob = r.ground != null ? Math.abs(MathUtils.sin(r.anim)) * .09f * Math.min(1, hs / 5) : 0, st = r.stun > 0 ? MathUtils.sin(r.stun * 30) * .25f : 0;
            float sy = 1 - v.squash + (r.ground == null ? Math.min(.12f, Math.abs(r.vel.y) * .012f) : 0), sxz = 1 / (float) Math.sqrt(sy);
            v.body.transform.setToTranslation(r.pos.x, r.pos.y + bob, r.pos.z).rotateRad(Vector3.Y, r.facing).rotateRad(Vector3.X, v.lean).rotateRad(Vector3.Z, st + MathUtils.sin(r.anim) * .06f * Math.min(1, hs / 5)).scale(sxz, sy, sxz);}
        // camera: three-quarter follow, looking down the course
        float tx = focus.pos.x * .7f, ty = Math.max(focus.pos.y, -4), tz = focus.pos.z;
        float k = Math.min(1, dt * 4.5f); camTarget.x += (tx - camTarget.x) * k; camTarget.y += (ty - camTarget.y) * Math.min(1, dt * 2.5f); camTarget.z += (tz - camTarget.z) * k;
        camera.position.set(camTarget.x + 3.5f, camTarget.y + 7.6f, camTarget.z - 11f); camera.up.set(Vector3.Y); camera.lookAt(camTarget.x, camTarget.y + 1, camTarget.z + 6); camera.update();
        sun.setCenter(camTarget.x, camTarget.y, camTarget.z + 14);
        scene.update(dt); scene.renderShadows();
        Gdx.gl.glClearColor(.66f, .70f, .68f, 1); Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT | GL20.GL_DEPTH_BUFFER_BIT);
        sky.transform.setToTranslation(camera.position).rotate(Vector3.Y, 200); skyBatch.begin(camera); skyBatch.render(sky); skyBatch.end();
        Gdx.gl.glClear(GL20.GL_DEPTH_BUFFER_BIT); scene.renderColors();
    }
    public void resize(int w, int h) {camera.viewportWidth = w; camera.viewportHeight = h; camera.update(); scene.updateViewport(w, h);}
    public Vector3 project(Vector3 world) {return camera.project(world);}

    // ---- scenery ----
    private void decorate() {
        Random rnd = new Random(11);
        float len = course.finishZ + 30;
        // tall conifers rising out of the gorge on both sides
        for (float z = -40; z < len + 40; z += 7 + rnd.nextFloat() * 6) for (int s = -1; s <= 1; s += 2) {
            float x = s * (17 + rnd.nextFloat() * 50); String m = (rnd.nextFloat() < .55f ? "fir_tree_01_" : "pine_tree_01_") + "abc".charAt(rnd.nextInt(3));
            prop(m, x, -34, z + rnd.nextFloat() * 5, 26 + rnd.nextFloat() * 16, rnd.nextFloat() * 360);}
        // cliffs framing the gorge
        for (float z = -30; z < len + 30; z += 38) for (int s = -1; s <= 1; s += 2) prop("namaqualand_cliff_01", s * (88 + rnd.nextFloat() * 20), -34, z, 60 + rnd.nextFloat() * 20, rnd.nextFloat() * 360);
        // on-course dressing along the edges of every grass/stone block
        for (RaceCourse.Block b : course.blocks) {
            if (b.mat == RaceCourse.Mat.PLANK || b.crumbles) continue;
            float w = b.x1 - b.x0, d = b.z1 - b.z0;
            for (int i = 0; i < (int) (d * .9f); i++) {
                int side = rnd.nextBoolean() ? -1 : 1; float x = side > 0 ? b.x1 - rnd.nextFloat() * 1.6f : b.x0 + rnd.nextFloat() * 1.6f, z = b.z0 + rnd.nextFloat() * d;
                float r = rnd.nextFloat(); float y = b.top(z);
                if (b.mat == RaceCourse.Mat.GRASS && r < .55f) prop("grass_medium_01", x, y, z, .6f + rnd.nextFloat() * .5f, rnd.nextFloat() * 360);
                else if (r < .75f) prop("fern_02", x, y, z, .7f + rnd.nextFloat() * .6f, rnd.nextFloat() * 360);
                else if (r < .88f) prop("rock_moss_set_01", x, y - .1f, z, .7f + rnd.nextFloat() * .7f, rnd.nextFloat() * 360);
                else if (r < .95f) prop("shrub_01", x, y, z, 1 + rnd.nextFloat() * .8f, rnd.nextFloat() * 360);
                else prop("tree_stump_01", x, y, z, .8f + rnd.nextFloat() * .4f, rnd.nextFloat() * 360);
            }
            if (w > 12 && d > 14 && rnd.nextFloat() < .7f) prop("boulder_01", (rnd.nextBoolean() ? b.x0 + 1.4f : b.x1 - 1.4f), b.top(b.z0 + d * .5f) - .3f, b.z0 + d * .5f, 2.4f, rnd.nextFloat() * 360);
            // roots hanging off the cliff faces
            for (int i = 0; i < (int) (d / 6); i++) {float z = b.z0 + rnd.nextFloat() * d; int side = rnd.nextBoolean() ? -1 : 1;
                prop("root_cluster_01", side > 0 ? b.x1 + .1f : b.x0 - .1f, b.top(z) - 1.6f, z, 2.2f, side > 0 ? 90 : 270);}
        }
        // big trees standing on the start and finish plazas
        prop("fir_tree_01_a", -7.5f, 0, 4, 16, 30); prop("pine_tree_01_b", 8, 0, 12, 18, 120);
        float fy = course.spawnY(course.finishZ); prop("fir_tree_01_c", -9.5f, fy, course.finishZ + 7, 17, 0); prop("dead_tree_trunk", 9.5f, fy, course.finishZ + 6, 3, 40);
    }
    private Scene prop(String name, float x, float y, float z, float size, float yaw) {
        SceneAsset a = asset(name); Scene s = new Scene(a.scene); BoundingBox bb = bounds.get(name);
        float sc = size / Math.max(.01f, bb.getHeight()); if (name.contains("tree") || name.contains("grass") || name.contains("fern") || name.contains("shrub") || name.contains("cliff")) {} else sc = size / Math.max(bb.getWidth(), Math.max(bb.getHeight(), bb.getDepth()));
        s.modelInstance.transform.setToTranslation(x, y, z).rotate(Vector3.Y, yaw).scl(sc).translate(-bb.getCenterX(), -bb.min.y, -bb.getCenterZ());
        scene.addScene(s, false); return s;
    }
    private float scaleOf(String name, float size) {BoundingBox bb = bounds.get(name); return size / Math.max(bb.getWidth(), Math.max(bb.getHeight(), bb.getDepth()));}
    private Vector3 center(String name) {return bounds.get(name).getCenter(new Vector3());}
    private SceneAsset asset(String name) {
        return assets.computeIfAbsent(name, n -> {SceneAsset a = new GLBLoader().load(Gdx.files.internal("race/models/" + n + ".glb")); BoundingBox bb = new BoundingBox(); a.scene.model.calculateBoundingBox(bb); bounds.put(n, bb); return a;});
    }
    private Texture tex(String path) {Texture t = new Texture(Gdx.files.internal(path), true); t.setFilter(Texture.TextureFilter.MipMapLinearLinear, Texture.TextureFilter.Linear); t.setWrap(Texture.TextureWrap.Repeat, Texture.TextureWrap.Repeat); t.setAnisotropicFilter(8); owned.add(t); return t;}
    private Material mat(String name) {
        return new Material(PBRTextureAttribute.createBaseColorTexture(tex("race/textures/" + name + "/diffuse.jpg")), PBRTextureAttribute.createNormalTexture(tex("race/textures/" + name + "/nor_gl.jpg")),
            PBRTextureAttribute.createMetallicRoughnessTexture(tex("race/textures/" + name + "/arm.jpg")), PBRFloatAttribute.createMetallic(0), PBRFloatAttribute.createRoughness(1));
    }
    private static long attrs() {return VertexAttributes.Usage.Position | VertexAttributes.Usage.Normal | VertexAttributes.Usage.TextureCoordinates;}
    /** Box (or ramp) with world-scaled UVs: top material on the walking face, side material on the cliff faces. */
    private static Model block(RaceCourse.Block b, Material top, Material side) {
        ModelBuilder mb = new ModelBuilder(); mb.begin(); float x0 = b.x0, x1 = b.x1, z0 = b.z0, z1 = b.z1, y0 = b.yTop0, y1 = b.yTop1, bt = b.bottom;
        float tile = b.mat == RaceCourse.Mat.PLANK ? 2.2f : 3.2f;
        MeshPartBuilder t = mb.part("top", GL20.GL_TRIANGLES, attrs(), top);
        float ny = 1, nz = -(y1 - y0) / (z1 - z0); float l = (float) Math.sqrt(ny * ny + nz * nz);
        quad(t, x0, y0, z0, x1, y0, z0, x1, y1, z1, x0, y1, z1, 0, ny / l, nz / l, tile);
        MeshPartBuilder s = mb.part("sides", GL20.GL_TRIANGLES, attrs(), side); float st = 4f;
        quad(s, x1, bt, z0, x0, bt, z0, x0, y0, z0, x1, y0, z0, 0, 0, -1, st);
        quad(s, x0, bt, z1, x1, bt, z1, x1, y1, z1, x0, y1, z1, 0, 0, 1, st);
        quad(s, x0, bt, z0, x0, bt, z1, x0, y1, z1, x0, y0, z0, -1, 0, 0, st);
        quad(s, x1, bt, z1, x1, bt, z0, x1, y0, z0, x1, y1, z1, 1, 0, 0, st);
        if (b.mat == RaceCourse.Mat.PLANK || b.crumbles) quad(s, x0, bt, z1, x0, bt, z0, x1, bt, z0, x1, bt, z1, 0, -1, 0, st);
        return mb.end();
    }
    /** Quad with planar UVs in world metres / tile (picks the two axes the face spans). */
    private static void quad(MeshPartBuilder p, float ax, float ay, float az, float bx, float by, float bz, float cx, float cy, float cz, float dx, float dy, float dz, float nx, float ny, float nz, float tile) {
        boolean flat = Math.abs(ny) > .6f, xFace = Math.abs(nx) > .6f;
        VertexInfo[] v = new VertexInfo[4]; float[][] pts = {{ax, ay, az}, {bx, by, bz}, {cx, cy, cz}, {dx, dy, dz}};
        for (int i = 0; i < 4; i++) {float[] q = pts[i]; float u = flat ? q[0] : xFace ? q[2] : q[0], w = flat ? q[2] : -q[1];
            v[i] = new VertexInfo().setPos(q[0], q[1], q[2]).setNor(nx, ny, nz).setUV(u / tile, w / tile);}
        p.rect(v[3], v[2], v[1], v[0]);
    }
    @Override public void dispose() {scene.dispose(); sun.dispose(); diffuse.dispose(); specular.dispose(); brdf.dispose(); skyBatch.dispose(); for (var d : owned) d.dispose(); for (var a : assets.values()) a.dispose();}
}
