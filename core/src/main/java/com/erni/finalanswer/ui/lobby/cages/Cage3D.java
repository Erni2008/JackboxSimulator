package com.erni.finalanswer.ui.lobby.cages;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.g3d.*;
import com.badlogic.gdx.graphics.g3d.attributes.*;
import com.badlogic.gdx.graphics.g3d.environment.DirectionalLight;
import com.badlogic.gdx.graphics.g3d.utils.MeshPartBuilder;
import com.badlogic.gdx.graphics.g3d.utils.ModelBuilder;
import com.badlogic.gdx.math.*;
import com.badlogic.gdx.utils.Disposable;

/**
 * The waiting-room cage, built entirely in code (no artwork): a round wrought-iron birdcage.
 * <ul>
 *   <li>heavy floor with a bevelled rim, a riveted band and a warm glow underneath;</li>
 *   <li>20 forged bars, lower / middle / top hoops, four flat straps with brass rivets;</li>
 *   <li>a two-tier dome with a collar and a shackle ring the chain hooks into;</li>
 *   <li>a front door of bars that drops into place when a player is locked in;</li>
 *   <li>3D chain links (alternating 90°) from a forged ceiling bracket.</li>
 * </ul>
 * Geometry is split into BACK (behind the prisoner) and FRONT (in front of the prisoner), so the 2D character is
 * drawn between the two passes and really stands inside. Units are stage pixels; +z points at the viewer.
 */
public final class Cage3D implements Disposable {
    public static final float R = 92, FLOOR = 0, TOP = 214, CX = 178, BASE_Y = 50; // cage centre in HangingCage local space
    public static final float RING_Y = BASE_Y + TOP + 64;                         // shackle ring (chain endpoint)
    public static final float DOOR_HALF = .62f;                                     // half-angle of the front door (radians)
    private static final int BARS = 20;
    /** the waiting room renders code-built cages (prisoners get in-cage lighting) */
    public static final boolean ACTIVE = true;

    private final Model back, front, door, link, bracket, halfBar; private final Texture rust, iron, hazard;
    public final Environment environment = new Environment();
    /** own per-pixel shader (see VS/FS below): forged-metal bump, moon/candle/under light, hemisphere ambient, AO by height, rim */
    private final ModelBatch batch = new ModelBatch(new com.badlogic.gdx.graphics.g3d.utils.DefaultShaderProvider(new com.badlogic.gdx.graphics.g3d.shaders.DefaultShader.Config(VS, FS)));
    private final ModelInstance backI, frontI, doorI, linkI, bracketI, halfA;
    private static final float HALF_BAR = (TOP - 14) / 2f;
    private final OrthographicCamera camera = new OrthographicCamera();

    public Cage3D() {
        rust = texture(rustPixmap(256, 7, .62f), true); iron = texture(rustPixmap(256, 11, .45f), true); hazard = texture(hazardPixmap(), true);
        Material metal = new Material(IntAttribute.createCullFace(GL20.GL_NONE), TextureAttribute.createDiffuse(rust), ColorAttribute.createSpecular(.45f, .4f, .36f, 1), FloatAttribute.createShininess(28));
        Material dark = new Material(IntAttribute.createCullFace(GL20.GL_NONE), TextureAttribute.createDiffuse(iron), ColorAttribute.createSpecular(.3f, .28f, .26f, 1), FloatAttribute.createShininess(18));
        Material brass = new Material(IntAttribute.createCullFace(GL20.GL_NONE), ColorAttribute.createDiffuse(.72f, .55f, .28f, 1), ColorAttribute.createSpecular(.95f, .82f, .55f, 1), FloatAttribute.createShininess(48));
        Material band = new Material(IntAttribute.createCullFace(GL20.GL_NONE), TextureAttribute.createDiffuse(hazard), ColorAttribute.createSpecular(.2f, .2f, .2f, 1), FloatAttribute.createShininess(10));
        Material glow = new Material(IntAttribute.createCullFace(GL20.GL_NONE), ColorAttribute.createDiffuse(1f, .55f, .2f, 1), ColorAttribute.createEmissive(1f, .48f, .14f, 1));
        Material chain = new Material(IntAttribute.createCullFace(GL20.GL_NONE), ColorAttribute.createDiffuse(.62f, .58f, .54f, 1), ColorAttribute.createSpecular(.85f, .82f, .78f, 1), FloatAttribute.createShininess(40));
        long attrs = VertexAttributes.Usage.Position | VertexAttributes.Usage.Normal | VertexAttributes.Usage.TextureCoordinates;
        ModelBuilder mb = new ModelBuilder();

        // ---------------- BACK: everything behind the prisoner (z < 0 halves) + the floor he stands on
        mb.begin();
        MeshPartBuilder b = mb.part("floor", GL20.GL_TRIANGLES, attrs, dark);
        lathe(b, new float[][]{{0, -16}, {R + 10, -16}, {R + 14, -8}, {R + 12, 4}, {R + 4, 8}, {0, 8}}, 40);
        b = mb.part("glow", GL20.GL_TRIANGLES, attrs, glow);
        for (int i = 0; i < 8; i++) { float a = i / 8f * MathUtils.PI2; box(b, qx(a) * (R - 6), -19, qz(a) * (R - 6), 14, 4, 6, -a); }
        b = mb.part("bandBack", GL20.GL_TRIANGLES, attrs, dark); bandArc(b, R + 4, 8, 20, MathUtils.PI, MathUtils.PI2, 20);
        b = mb.part("trimBack", GL20.GL_TRIANGLES, attrs, brass); arc(b, R + 4.5f, 8, MathUtils.PI, MathUtils.PI2, 1.6f, 24); arc(b, R + 4.5f, 20, MathUtils.PI, MathUtils.PI2, 1.6f, 24);
        b = mb.part("ornamentBack", GL20.GL_TRIANGLES, attrs, metal); ornaments(b, true);
        b = mb.part("barsBack", GL20.GL_TRIANGLES, attrs, metal); bars(b, true); hoops(b, true);
        b = mb.part("strapsBack", GL20.GL_TRIANGLES, attrs, dark); straps(b, true);
        b = mb.part("rivetsBack", GL20.GL_TRIANGLES, attrs, brass); rivets(b, true);
        back = mb.end();

        // ---------------- FRONT: front halves, the dome and the shackle (above / in front of the prisoner)
        mb.begin();
        b = mb.part("bandFront", GL20.GL_TRIANGLES, attrs, dark); bandArc(b, R + 4, 8, 20, 0, MathUtils.PI, 20);
        b = mb.part("trimFront", GL20.GL_TRIANGLES, attrs, brass); arc(b, R + 4.5f, 8, 0, MathUtils.PI, 1.6f, 24); arc(b, R + 4.5f, 20, 0, MathUtils.PI, 1.6f, 24);
        b = mb.part("ornamentFront", GL20.GL_TRIANGLES, attrs, metal); ornaments(b, false);
        b = mb.part("ribs", GL20.GL_TRIANGLES, attrs, metal); ribs(b);
        b = mb.part("crown", GL20.GL_TRIANGLES, attrs, brass); arc(b, 17, TOP + 50, 0, MathUtils.PI2, 2.2f, 24); arc(b, R + 9.5f, TOP + 4, 0, MathUtils.PI2, 2, 48);
        b = mb.part("barsFront", GL20.GL_TRIANGLES, attrs, metal); bars(b, false); hoops(b, false);
        b = mb.part("strapsFront", GL20.GL_TRIANGLES, attrs, dark); straps(b, false);
        b = mb.part("rivetsFront", GL20.GL_TRIANGLES, attrs, brass); rivets(b, false);
        b = mb.part("dome", GL20.GL_TRIANGLES, attrs, dark);
        lathe(b, new float[][]{{R + 10, TOP - 2}, {R + 12, TOP + 5}, {R * .62f, TOP + 26}, {R * .2f, TOP + 48}, {0, TOP + 52}}, 64);
        finials(b);
        b = mb.part("collar", GL20.GL_TRIANGLES, attrs, metal);
        lathe(b, new float[][]{{16, TOP + 48}, {18, TOP + 54}, {11, TOP + 58}, {9, TOP + 62}, {0, TOP + 62}}, 20);
        b = mb.part("shackle", GL20.GL_TRIANGLES, attrs, brass);
        torus(b, 0, TOP + 72, 0, 10, 3.2f, 0, 20, 10); // vertical ring facing the viewer
        front = mb.end();

        // ---------------- DOOR: the front bars between ±DOOR_HALF and two cross bars
        mb.begin();
        b = mb.part("door", GL20.GL_TRIANGLES, attrs, metal);
        for (int i = 0; i < 5; i++) { if (i == 1 || i == 3) continue; /* the two pry-able bars are separate (halfBar) */ float a = MathUtils.PI / 2 + (i - 2) / 2f * DOOR_HALF * .9f; cyl(b, qx(a) * (R + 3), 10, qz(a) * (R + 3), 3.4f, TOP - 14); }
        arc(b, R + 3, 46, MathUtils.PI / 2 - DOOR_HALF, MathUtils.PI / 2 + DOOR_HALF, 3.2f, 14); arc(b, R + 3, TOP - 30, MathUtils.PI / 2 - DOOR_HALF, MathUtils.PI / 2 + DOOR_HALF, 3.2f, 14);
        scroll(b, MathUtils.PI / 2, R + 3, TOP - 30, 20, 1.6f, false); scroll(b, MathUtils.PI / 2, R + 3, TOP - 30, 20, 1.6f, true);
        b = mb.part("lock", GL20.GL_TRIANGLES, attrs, brass); box(b, 0, 30, R + 6, 14, 18, 6, 0); sphere(b, 0, 30, R + 9.5f, 3);
        door = mb.end();

        // ---------------- one chain link (oval torus), and the ceiling bracket
        mb.begin(); b = mb.part("link", GL20.GL_TRIANGLES, attrs, chain); ovalLink(b, 7.5f, 12.5f, 2.6f); link = mb.end();
        mb.begin(); b = mb.part("bracket", GL20.GL_TRIANGLES, attrs, dark); box(b, 0, 6, 0, 46, 10, 24, 0); box(b, 0, -6, 0, 12, 18, 12, 0);
        b = mb.part("bolts", GL20.GL_TRIANGLES, attrs, brass); for (int s = -1; s <= 1; s += 2) sphere(b, s * 16, 6, 13, 3.6f); torus(b, 0, -20, 0, 8, 2.6f, MathUtils.PI / 2, 16, 8); bracket = mb.end();

        mb.begin(); b = mb.part("halfBar", GL20.GL_TRIANGLES, attrs, metal); cyl(b, 0, 0, 0, 3.4f, HALF_BAR); halfBar = mb.end(); halfA = new ModelInstance(halfBar);
        backI = new ModelInstance(back); frontI = new ModelInstance(front); doorI = new ModelInstance(door); linkI = new ModelInstance(link); bracketI = new ModelInstance(bracket);
        // lighting: cool moonlight from above-front-left, warm candle/lava fill from below, low ambient
        environment.set(new ColorAttribute(ColorAttribute.AmbientLight, .2f, .19f, .22f, 1));
        environment.add(new DirectionalLight().set(.78f, .84f, 1f, -.35f, -.75f, -.55f));
        environment.add(new DirectionalLight().set(.55f, .32f, .18f, .25f, .8f, -.3f));
    }

    // ---------------------------------------------------------------- drawing
    private final Matrix4 tmp = new Matrix4();
    /** match the stage camera, with depth room for the cage */
    public void begin(Camera stageCamera) {
        Gdx.gl.glClear(GL20.GL_DEPTH_BUFFER_BIT);
        camera.viewportWidth = stageCamera.viewportWidth; camera.viewportHeight = stageCamera.viewportHeight; camera.zoom = stageCamera instanceof OrthographicCamera o ? o.zoom : 1;
        camera.position.set(stageCamera.position.x, stageCamera.position.y, 600); camera.near = 1; camera.far = 1200; camera.update();
        batch.begin(camera);
    }
    public void end() { batch.end(); }
    /** draw everything queued so far (before changing scissor state) */
    public void flush() { batch.flush(); }
    /** the cage parts, placed by {@code world} (HangingCage local → stage) with the cage's own yaw/tilt */
    public void cage(Matrix4 world, float yaw, float tilt, boolean frontPass) {
        tmp.set(world).translate(CX, BASE_Y, 0).rotate(Vector3.X, tilt).rotate(Vector3.Y, yaw);
        ModelInstance m = frontPass ? frontI : backI; m.transform.set(tmp); batch.render(m);
    }
    /** the door: {@code jx/jy} rattle offsets, {@code pry} bends the two inner bars apart (radians) */
    public void door(Matrix4 world, float yaw, float tilt, float drop, float jx, float jy, float pry) {
        tmp.set(world).translate(CX + jx, BASE_Y + drop + jy, 0).rotate(Vector3.X, tilt).rotate(Vector3.Y, yaw); doorI.transform.set(tmp); batch.render(doorI);
        for (int side = -1; side <= 1; side += 2) { float a = MathUtils.PI / 2 + side * .5f * DOOR_HALF * .9f, x = qx(a) * (R + 3), z = qz(a) * (R + 3), deg = pry * MathUtils.radiansToDegrees * (x < 0 ? 1 : -1);
            batch.render(halfAt(halfA, x, 10, z, deg)); batch.render(halfAt(halfA, x, 10 + 2 * HALF_BAR, z, 180 - deg)); }
    }
    private ModelInstance halfAt(ModelInstance m, float x, float y, float z, float rotZ) { m.transform.set(tmp).translate(x, y, z).rotate(Vector3.Z, rotZ); return m; }
    /** chain of 3D links from (x1,y1) down to (x2,y2) in stage space */
    public void chain(float x1, float y1, float x2, float y2) {
        float dx = x2 - x1, dy = y2 - y1, len = (float) Math.sqrt(dx * dx + dy * dy); if (len < 2) return;
        float ang = MathUtils.atan2(dy, dx) * MathUtils.radiansToDegrees + 90, step = 19; int n = (int) (len / step) + 1;
        for (int i = 0; i < n; i++) { float t = Math.min(1, (i * step + step / 2) / len);
            linkI.transform.idt().translate(x1 + dx * t, y1 + dy * t, 0).rotate(Vector3.Z, ang).rotate(Vector3.Y, i % 2 == 0 ? 0 : 90).rotate(Vector3.Y, 18); batch.render(linkI); }
    }
    public void bracket(float x, float y) { bracketI.transform.idt().translate(x, y, 0).rotate(Vector3.X, 8); batch.render(bracketI); }

    // ---------------------------------------------------------------- geometry helpers
    /** the cage's footprint is a superellipse (|x|^8 + |z|^8 = 1): a square gothic cage with softly forged corners */
    private static final float SQ = 8f;
    private static float sp(float v) { return Math.signum(v) * (float) Math.pow(Math.abs(v), 2 / SQ); }
    static float qx(float a) { return sp(MathUtils.cos(a)); }
    static float qz(float a) { return sp(MathUtils.sin(a)); }
    private static float nqx(float a) { float x = qx(a), z = qz(a), gx = Math.signum(x) * (float) Math.pow(Math.abs(x), SQ - 1), gz = Math.signum(z) * (float) Math.pow(Math.abs(z), SQ - 1); return gx / (float) Math.sqrt(gx * gx + gz * gz + 1e-9f); }
    private static float nqz(float a) { float x = qx(a), z = qz(a), gx = Math.signum(x) * (float) Math.pow(Math.abs(x), SQ - 1), gz = Math.signum(z) * (float) Math.pow(Math.abs(z), SQ - 1); return gz / (float) Math.sqrt(gx * gx + gz * gz + 1e-9f); }
    private final MeshPartBuilder.VertexInfo v1 = new MeshPartBuilder.VertexInfo();
    private short vtx(MeshPartBuilder b, float x, float y, float z, float nx, float ny, float nz, float u, float v) { return b.vertex(v1.set(null, null, null, null).setPos(x, y, z).setNor(nx, ny, nz).setUV(u, v)); }
    /** surface of revolution through (radius, height) points */
    private void lathe(MeshPartBuilder b, float[][] pr, int seg) {
        for (int k = 0; k < pr.length - 1; k++) { float r0 = pr[k][0], y0 = pr[k][1], r1 = pr[k + 1][0], y1 = pr[k + 1][1], ny = r0 - r1, nr = y1 - y0, l = (float) Math.sqrt(ny * ny + nr * nr); ny /= l; nr /= l;
            for (int i = 0; i < seg; i++) { float a0 = i / (float) seg * MathUtils.PI2, a1 = (i + 1) / (float) seg * MathUtils.PI2, c0 = qx(a0), s0 = qz(a0), c1 = qx(a1), s1 = qz(a1), n0 = nqx(a0), m0 = nqz(a0), n1 = nqx(a1), m1 = nqz(a1);
                short p00 = vtx(b, c0 * r0, y0, s0 * r0, n0 * nr, ny, m0 * nr, i / (float) seg * 4, k * .5f), p10 = vtx(b, c1 * r0, y0, s1 * r0, n1 * nr, ny, m1 * nr, (i + 1) / (float) seg * 4, k * .5f);
                short p11 = vtx(b, c1 * r1, y1, s1 * r1, n1 * nr, ny, m1 * nr, (i + 1) / (float) seg * 4, k * .5f + .5f), p01 = vtx(b, c0 * r1, y1, s0 * r1, n0 * nr, ny, m0 * nr, i / (float) seg * 4, k * .5f + .5f);
                b.rect(p00, p01, p11, p10); } }
    }
    private final Matrix4 xf = new Matrix4();
    private void cyl(MeshPartBuilder b, float x, float y, float z, float r, float h) { b.setVertexTransform(xf.idt().translate(x, y + h / 2, z)); b.cylinder(r * 2, h, r * 2, 10); b.setVertexTransform(null); }
    private void box(MeshPartBuilder b, float x, float y, float z, float w, float h, float d, float rotY) { b.setVertexTransform(xf.idt().translate(x, y, z).rotateRad(Vector3.Y, rotY)); b.box(w, h, d); b.setVertexTransform(null); }
    private void sphere(MeshPartBuilder b, float x, float y, float z, float r) { b.setVertexTransform(xf.idt().translate(x, y, z)); b.sphere(r * 2, r * 2, r * 2, 10, 8); b.setVertexTransform(null); }
    /** tube along a horizontal circle arc at height y */
    private void arc(MeshPartBuilder b, float radius, float y, float a0, float a1, float tube, int seg) {
        int sides = 8; for (int i = 0; i < seg; i++) for (int j = 0; j < sides; j++) {
            int[][] ij = {{i, j}, {i + 1, j}, {i + 1, j + 1}, {i, j + 1}};
            short[] id = new short[4]; for (int k = 0; k < 4; k++) { float a = a0 + (a1 - a0) * ij[k][0] / seg, t = ij[k][1] / (float) sides * MathUtils.PI2, ca = qx(a), sa = qz(a), na = nqx(a), ma = nqz(a), ct = MathUtils.cos(t), st = MathUtils.sin(t);
                id[k] = vtx(b, ca * radius + na * tube * ct, y + tube * st, sa * radius + ma * tube * ct, na * ct, st, ma * ct, ij[k][0] / (float) seg, ij[k][1] / (float) sides); }
            b.rect(id[0], id[3], id[2], id[1]); }
    }
    private void torus(MeshPartBuilder b, float x, float y, float z, float radius, float tube, float rotY, int seg, int sides) {
        for (int i = 0; i < seg; i++) for (int j = 0; j < sides; j++) { int[][] ij = {{i, j}, {i + 1, j}, {i + 1, j + 1}, {i, j + 1}}; short[] id = new short[4];
            for (int k = 0; k < 4; k++) { float a = ij[k][0] / (float) seg * MathUtils.PI2, t = ij[k][1] / (float) sides * MathUtils.PI2, ca = MathUtils.cos(a), sa = MathUtils.sin(a), ct = MathUtils.cos(t), st = MathUtils.sin(t);
                // ring in the XY plane (facing +z), then turned by rotY
                float px = ca * (radius + tube * ct), py = sa * (radius + tube * ct), pz = tube * st, nx = ca * ct, ny = sa * ct, nz = st, cr = MathUtils.cos(rotY), sr = MathUtils.sin(rotY);
                id[k] = vtx(b, x + px * cr + pz * sr, y + py, z - px * sr + pz * cr, nx * cr + nz * sr, ny, -nx * sr + nz * cr, 0, 0); }
            b.rect(id[0], id[1], id[2], id[3]); }
    }
    /** stadium-shaped chain link in the XY plane */
    private void ovalLink(MeshPartBuilder b, float rx, float ry, float tube) {
        int seg = 28, sides = 8; for (int i = 0; i < seg; i++) for (int j = 0; j < sides; j++) { int[][] ij = {{i, j}, {i + 1, j}, {i + 1, j + 1}, {i, j + 1}}; short[] id = new short[4];
            for (int k = 0; k < 4; k++) { float a = ij[k][0] / (float) seg * MathUtils.PI2, t = ij[k][1] / (float) sides * MathUtils.PI2, ca = MathUtils.cos(a), sa = MathUtils.sin(a);
                float cx = ca * rx, cy = sa * ry, nx0 = ca / rx, ny0 = sa / ry, nl = (float) Math.sqrt(nx0 * nx0 + ny0 * ny0); nx0 /= nl; ny0 /= nl; float ct = MathUtils.cos(t), st = MathUtils.sin(t);
                id[k] = vtx(b, cx + nx0 * tube * ct, cy + ny0 * tube * ct, tube * st, nx0 * ct, ny0 * ct, st, 0, 0); }
            b.rect(id[0], id[1], id[2], id[3]); }
    }
    /** a smooth tube through a polyline (forged scrollwork) */
    private void tube(MeshPartBuilder b, Vector3[] pts, float r) {
        int sides = 7; Vector3 t = new Vector3(), n = new Vector3(), bn = new Vector3(), up = new Vector3(0, 1, 0); short[] prev = null;
        for (int i = 0; i < pts.length; i++) { t.set(pts[Math.min(pts.length - 1, i + 1)]).sub(pts[Math.max(0, i - 1)]).nor();
            n.set(Math.abs(t.y) > .9f ? Vector3.X : up).crs(t).nor(); bn.set(t).crs(n).nor(); short[] ring = new short[sides + 1];
            for (int j = 0; j <= sides; j++) { float a = j / (float) sides * MathUtils.PI2, c = MathUtils.cos(a), sn = MathUtils.sin(a);
                float nx = n.x * c + bn.x * sn, ny = n.y * c + bn.y * sn, nz = n.z * c + bn.z * sn; ring[j] = vtx(b, pts[i].x + nx * r, pts[i].y + ny * r, pts[i].z + nz * r, nx, ny, nz, j / (float) sides, i / (float) pts.length); }
            if (prev != null) for (int j = 0; j < sides; j++) b.rect(prev[j], prev[j + 1], ring[j + 1], ring[j]); prev = ring; }
    }
    /** a C-scroll on the cage surface at angle a, centred at height y: spirals inward (mirror flips it) */
    private void scroll(MeshPartBuilder b, float a, float radius, float y, float size, float r, boolean mirror) {
        int n = 34; Vector3[] p = new Vector3[n]; float dir = mirror ? -1 : 1;
        for (int i = 0; i < n; i++) { float t = i / (n - 1f), ang = t * MathUtils.PI2 * 1.35f, rr = size * (1 - t * .78f), u = dir * (size * .55f + MathUtils.cos(ang) * rr * .55f), v = MathUtils.sin(ang) * rr * .55f;
            float aa = a + u / radius; p[i] = new Vector3(qx(aa) * radius + nqx(aa) * 1.5f, y + v, qz(aa) * radius + nqz(aa) * 1.5f); }
        tube(b, p, r);
    }
    /** scrollwork band under the top hoop: a pair of C-scrolls in every other gap between the bars */
    private void ornaments(MeshPartBuilder b, boolean backHalf) {
        for (int i = 0; i < BARS; i += 2) { float a = (i + 1f) / BARS * MathUtils.PI2; if (!side(a, backHalf)) continue; if (!backHalf && Math.abs(a - MathUtils.PI / 2) < DOOR_HALF) continue;
            float g = MathUtils.PI2 / BARS * R * .5f; scroll(b, a, R, TOP - 22, g * .9f, 1.5f, false); scroll(b, a, R, TOP - 22, g * .9f, 1.5f, true); }
    }
    /** eight curved ribs over the dome down to the collar */
    private void ribs(MeshPartBuilder b) {
        float[][] pr = {{R + 12, TOP + 6}, {R * .62f, TOP + 27}, {R * .2f, TOP + 49}};
        for (int i = 0; i < 4; i++) { float a = i / 4f * MathUtils.PI2 + MathUtils.PI / 4; Vector3[] p = new Vector3[pr.length]; /* hip ridges of the roof */
            for (int k = 0; k < pr.length; k++) p[k] = new Vector3(qx(a) * (pr[k][0] + 2), pr[k][1] + 1.5f, qz(a) * (pr[k][0] + 2)); tube(b, p, 2.6f); }
    }
    /** spiked finials on the four corner posts */
    private void finials(MeshPartBuilder b) {
        for (int i = 0; i < 4; i++) { float a = i / 4f * MathUtils.PI2 + MathUtils.PI / 4, x = qx(a) * (R + 4), z = qz(a) * (R + 4);
            b.setVertexTransform(xf.idt().translate(x, TOP + 8, z)); b.sphere(14, 14, 14, 10, 8);
            b.setVertexTransform(xf.idt().translate(x, TOP + 24, z)); b.cone(9, 26, 9, 10); b.setVertexTransform(null); }
    }
    private boolean side(float a, boolean backHalf) { return backHalf ? MathUtils.sin(a) < 0 : MathUtils.sin(a) >= 0; }
    private void bars(MeshPartBuilder b, boolean backHalf) {
        for (int i = 0; i < BARS; i++) { float a = (i + .5f) / BARS * MathUtils.PI2; if (!side(a, backHalf)) continue; if (!backHalf && Math.abs(a - MathUtils.PI / 2) < DOOR_HALF) continue; // the door has its own bars
            cyl(b, qx(a) * R, 8, qz(a) * R, 3 + (i % 3) * .25f, TOP - 4); }
    }
    private void hoops(MeshPartBuilder b, boolean backHalf) {
        float a0 = backHalf ? MathUtils.PI : 0, a1 = backHalf ? MathUtils.PI2 : MathUtils.PI;
        arc(b, R + 1, 14, a0, a1, 4.2f, 24); arc(b, R + 1, TOP * .55f, a0, a1, 3.2f, 24); arc(b, R + 3, TOP, a0, a1, 5.2f, 24);
    }
    private void straps(MeshPartBuilder b, boolean backHalf) {
        for (int i = 0; i < 4; i++) { float a = i / 4f * MathUtils.PI2 + MathUtils.PI / 4; if (!side(a, backHalf)) continue;
            b.setVertexTransform(xf.idt().translate(qx(a) * (R + 4), 4 + (TOP + 4) / 2, qz(a) * (R + 4)).rotateRad(Vector3.Y, -a)); b.box(13, TOP + 4, 13); /* square corner post */ b.setVertexTransform(null); }
    }
    private void rivets(MeshPartBuilder b, boolean backHalf) {
        for (int i = 0; i < 4; i++) { float a = i / 4f * MathUtils.PI2 + MathUtils.PI / 4; if (!side(a, backHalf)) continue;
            for (int k = 0; k < 7; k++) sphere(b, qx(a) * (R + 4) + nqx(a) * 7, 22 + k * 30, qz(a) * (R + 4) + nqz(a) * 7, 2.4f); }
        for (int i = 0; i < 16; i++) { float a = (i + .5f) / 16 * MathUtils.PI2; if (!side(a, backHalf)) continue; sphere(b, qx(a) * (R + 13), -4, qz(a) * (R + 13), 2.2f); }
    }
    private void bandArc(MeshPartBuilder b, float radius, float y0, float y1, float a0, float a1, int seg) {
        for (int i = 0; i < seg; i++) { float u0 = (float) i / seg, u1 = (float) (i + 1) / seg, aa = a0 + (a1 - a0) * u0, ab = a0 + (a1 - a0) * u1;
            short p0 = vtx(b, qx(aa) * radius, y0, qz(aa) * radius, nqx(aa), 0, nqz(aa), u0 * 6, 1), p1 = vtx(b, qx(ab) * radius, y0, qz(ab) * radius, nqx(ab), 0, nqz(ab), u1 * 6, 1);
            short p2 = vtx(b, qx(ab) * radius, y1, qz(ab) * radius, nqx(ab), 0, nqz(ab), u1 * 6, 0), p3 = vtx(b, qx(aa) * radius, y1, qz(aa) * radius, nqx(aa), 0, nqz(aa), u0 * 6, 0);
            b.rect(p0, p3, p2, p1); }
    }

    // ---------------------------------------------------------------- shading
    private static final String VS = """
        attribute vec3 a_position;
        attribute vec3 a_normal;
        attribute vec2 a_texCoord0;
        uniform mat4 u_projViewTrans;
        uniform mat4 u_worldTrans;
        uniform mat3 u_normalMatrix;
        uniform vec4 u_diffuseUVTransform;
        varying vec3 v_n;
        varying vec2 v_uv;
        varying vec3 v_w;
        varying float v_h;
        void main(){
            vec4 w = u_worldTrans * vec4(a_position, 1.0);
            v_w = w.xyz; v_n = normalize(u_normalMatrix * a_normal); v_h = a_position.y;
            v_uv = u_diffuseUVTransform.xy + a_texCoord0 * u_diffuseUVTransform.zw;
            gl_Position = u_projViewTrans * w;
        }
        """;
    private static final String FS = """
        #ifdef GL_ES
        precision highp float;
        #endif
        uniform vec4 u_diffuseColor;
        uniform sampler2D u_diffuseTexture;
        uniform vec4 u_specularColor;
        uniform float u_shininess;
        uniform vec4 u_emissiveColor;
        varying vec3 v_n;
        varying vec2 v_uv;
        varying vec3 v_w;
        varying float v_h;
        vec3 light(vec3 N, vec3 V, vec3 L, vec3 C, vec3 base, vec3 sc, float sh){
            float d = max(dot(N, L), 0.0); vec3 H = normalize(L + V);
            float s = pow(max(dot(N, H), 0.0), sh) * (sh + 8.0) / 40.0;
            return C * (base * d + sc * s * d);
        }
        void main(){
            vec3 base = vec3(1.0);
            float lum = 0.5;
            #ifdef diffuseColorFlag
            base *= u_diffuseColor.rgb;
            #endif
            #ifdef diffuseTextureFlag
            vec3 tex = texture2D(u_diffuseTexture, v_uv).rgb; base *= tex; lum = dot(tex, vec3(0.333));
            #endif
            vec3 N = normalize(v_n);
            if (!gl_FrontFacing) N = -N;
            #ifdef diffuseTextureFlag
            // hammered / pitted surface: bump from the texture's brightness
            vec3 dpx = dFdx(v_w), dpy = dFdy(v_w); float hx = dFdx(lum), hy = dFdy(lum);
            vec3 r1 = cross(dpy, N), r2 = cross(N, dpx); float det = dot(dpx, r1);
            N = normalize(abs(det) * N - sign(det) * (hx * r1 + hy * r2) * 2.2);
            #endif
            vec3 V = vec3(0.0, 0.0, 1.0);
            vec3 sc = vec3(0.2);
            #ifdef specularColorFlag
            sc = u_specularColor.rgb;
            #endif
            float sh = 16.0;
            #ifdef shininessFlag
            sh = u_shininess;
            #endif
            vec3 col = vec3(0.0);
            col += light(N, V, normalize(vec3(-0.35, 0.75, 0.55)), vec3(0.62, 0.72, 1.0) * 1.15, base, sc, sh);  // moonlight through the windows
            col += light(N, V, normalize(vec3(-0.9, 0.05, 0.4)), vec3(1.0, 0.6, 0.3) * 0.38, base, sc, sh);      // the wall candle (left)
            col += light(N, V, normalize(vec3(0.25, -0.85, 0.4)), vec3(0.6, 0.66, 0.85) * 0.28, base, sc, sh);   // bounce off the wet floor
            vec3 amb = mix(vec3(0.06, 0.05, 0.05), vec3(0.11, 0.13, 0.19), N.y * 0.5 + 0.5);
            float ao = mix(0.5, 1.0, smoothstep(-16.0, 50.0, v_h));
            col += base * amb * ao;
            float rim = pow(1.0 - max(dot(N, V), 0.0), 3.0);
            col += vec3(0.42, 0.52, 0.8) * rim * 0.28 * ao;
            #ifdef emissiveColorFlag
            col += u_emissiveColor.rgb;
            #endif
            col = col / (1.0 + col * 0.3);
            gl_FragColor = vec4(col, 1.0);
        }
        """;

    // ---------------------------------------------------------------- procedural textures
    private static Texture texture(Pixmap p, boolean repeat) { Texture t = new Texture(p, true); p.dispose(); t.setFilter(Texture.TextureFilter.MipMapLinearLinear, Texture.TextureFilter.Linear); if (repeat) t.setWrap(Texture.TextureWrap.Repeat, Texture.TextureWrap.Repeat); return t; }
    /** wrought iron with rust blooms: dark base, warm oxide patches, pitting and bright worn spots */
    private static Pixmap rustPixmap(int n, long seed, float rustAmount) {
        Pixmap p = new Pixmap(n, n, Pixmap.Format.RGBA8888); var r = new java.util.Random(seed); float[] f = new float[n * n];
        for (int o = 0; o < 4; o++) { int cell = n >> (o + 2); float amp = 1f / (1 << o); float[] g = new float[(n / cell + 2) * (n / cell + 2)]; for (int i = 0; i < g.length; i++) g[i] = r.nextFloat(); int gw = n / cell + 2;
            for (int y = 0; y < n; y++) for (int x = 0; x < n; x++) { float fx = (float) x / cell, fy = (float) y / cell; int ix = (int) fx, iy = (int) fy; float tx = fx - ix, ty = fy - iy; tx = tx * tx * (3 - 2 * tx); ty = ty * ty * (3 - 2 * ty);
                float a = g[iy * gw + ix], bb = g[iy * gw + ix + 1], c = g[(iy + 1) * gw + ix], d = g[(iy + 1) * gw + ix + 1]; f[y * n + x] += amp * ((a * (1 - tx) + bb * tx) * (1 - ty) + (c * (1 - tx) + d * tx) * ty); } }
        for (int y = 0; y < n; y++) for (int x = 0; x < n; x++) { float v = f[y * n + x] / 1.875f, rust = MathUtils.clamp((v - (1 - rustAmount)) * 3, 0, 1), pit = r.nextFloat() < .02f ? .55f : 1;
            float cr = MathUtils.lerp(.2f, .5f, rust) * pit + v * .08f, cg = MathUtils.lerp(.18f, .24f, rust) * pit + v * .05f, cb = MathUtils.lerp(.18f, .11f, rust) * pit + v * .04f;
            p.drawPixel(x, y, Color.rgba8888(cr, cg, cb, 1)); }
        return p;
    }
    private static Pixmap hazardPixmap() { int w = 256, h = 32; Pixmap p = new Pixmap(w, h, Pixmap.Format.RGBA8888); var r = new java.util.Random(5);
        for (int y = 0; y < h; y++) for (int x = 0; x < w; x++) { boolean dark = ((x + y) / 16) % 2 == 0; float n = r.nextFloat() * .08f; p.drawPixel(x, y, dark ? Color.rgba8888(.09f + n, .07f + n, .05f, 1) : Color.rgba8888(.78f - n, .58f - n, .1f, 1)); }
        return p; }
    @Override public void dispose() { halfBar.dispose(); back.dispose(); front.dispose(); door.dispose(); link.dispose(); bracket.dispose(); rust.dispose(); iron.dispose(); hazard.dispose(); batch.dispose(); }
}
