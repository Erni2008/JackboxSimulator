"""blender -b -P web_env.py: desktop race models -> phone-light glb (512px textures, low tris) in web/race/env."""
import bpy,os,random
ROOT=os.path.abspath(os.path.join(os.path.dirname(__file__),'../../..'));SRC=f'{ROOT}/assets/race/models';OUT=f'{ROOT}/web/race/env'
os.makedirs(OUT,exist_ok=True)
BUDGET={'boulder_01':1200,'rock_moss_set_01':900,'tree_stump_01':900,'dead_tree_trunk':1200,'root_cluster_01':1200,'namaqualand_cliff_01':2500,'fern_02':900,'grass_medium_01':500,'shrub_01':1500,'moss_01':200}
TREES=['fir_tree_01_c','pine_tree_01_c']
for name in list(BUDGET)+TREES:
    bpy.ops.wm.read_factory_settings(use_empty=True);bpy.ops.import_scene.gltf(filepath=f'{SRC}/{name}.glb')
    for o in [o for o in bpy.context.scene.objects if o.type=='MESH']:
        bpy.context.view_layer.objects.active=o;n=len(o.data.polygons)
        mats=[m.name for m in o.data.materials if m]
        if name in TREES and any('twig' in m for m in mats):
            import bmesh;bm=bmesh.new();bm.from_mesh(o.data);rnd=random.Random(1)
            # drop 70% of the cards
            bm.faces.ensure_lookup_table();seen=set();dead=[]
            for f in bm.faces:
                if f.index in seen:continue
                st=[f];isl=[]
                while st:
                    g=st.pop()
                    if g.index in seen:continue
                    seen.add(g.index);isl.append(g);st+= [h for e in g.edges for h in e.link_faces if h.index not in seen]
                if rnd.random()<.7:dead+=isl
                else:
                    vs=list({v for q in isl for v in q.verts});c=sum((v.co for v in vs[1:]),vs[0].co.copy())/len(vs)
                    for v in vs:v.co=c+(v.co-c)*1.5
            bmesh.ops.delete(bm,geom=dead,context='FACES');bm.to_mesh(o.data);bm.free()
        else:
            tgt=BUDGET.get(name,1500) if name not in TREES else 1500
            if n>tgt:d=o.modifiers.new('d','DECIMATE');d.ratio=tgt/n;bpy.ops.object.modifier_apply(modifier='d')
    for im in bpy.data.images:
        if im.size[0]>512:im.scale(512,512)
    bpy.ops.export_scene.gltf(filepath=f'{OUT}/{name}.glb',export_format='GLB',export_image_format='JPEG',export_jpeg_quality=80)
    print('DONE',name,flush=True)
