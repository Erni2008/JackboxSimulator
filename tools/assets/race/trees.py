"""Blender headless: split Poly Haven trees into single-tree .glb files. Twig cards are thinned whole (random faces removed) instead of
collapsed, so foliage survives; bark/trunk/dead branches are decimated. blender -b -P trees.py"""
import bpy,bmesh,random,pathlib
ROOT=pathlib.Path(__file__).resolve().parents[3];SRC=ROOT/'source_assets/race/ph/models';OUT=ROOT/'assets/race/models'
TWIG=45000;WOOD=7000
for name in ('fir_tree_01','pine_tree_01'):
    bpy.ops.wm.read_factory_settings(use_empty=True);bpy.ops.import_scene.gltf(filepath=str(SRC/name/f'{name}.gltf'))
    trees=[o for o in bpy.context.scene.objects if o.type=='MESH' and 'LOD0' in o.name]
    print('TREES',[(o.name,len(o.data.polygons)) for o in trees],flush=True)
    for o in trees:
        tag=o.name.split('_LOD0')[0].split('_')[-1]
        bpy.ops.object.select_all(action='DESELECT');o.select_set(True);bpy.context.view_layer.objects.active=o
        bpy.ops.object.mode_set(mode='EDIT');bpy.ops.mesh.select_all(action='DESELECT');bpy.ops.mesh.separate(type='MATERIAL');bpy.ops.object.mode_set(mode='OBJECT')
        parts=[p for p in bpy.context.selected_objects]
        rnd=random.Random(3)
        for p in parts:
            mat=p.data.materials[p.data.polygons[0].material_index].name if p.data.polygons else ''
            n=len(p.data.polygons)
            if 'twig' in mat and n>TWIG:
                bm=bmesh.new();bm.from_mesh(p.data);bm.faces.ensure_lookup_table()
                # cards are islands: keep whole islands
                islands=[];seen=set()
                for f in bm.faces:
                    if f.index in seen:continue
                    stack=[f];isl=[]
                    while stack:
                        g=stack.pop()
                        if g.index in seen:continue
                        seen.add(g.index);isl.append(g)
                        for e in g.edges:
                            for h in e.link_faces:
                                if h.index not in seen:stack.append(h)
                    islands.append(isl)
                keep=TWIG/n;dead=[f for isl in islands if rnd.random()>keep for f in isl]
                deadset=set(dead);grow=min(3.2,(n/TWIG)**.5*.55)
                for isl in islands:
                    if isl[0] in deadset:continue
                    vs=list({v for f in isl for v in f.verts});c=vs[0].co.copy()*0
                    for v in vs:c+=v.co
                    c/=len(vs)
                    for v in vs:v.co=c+(v.co-c)*grow
                bmesh.ops.delete(bm,geom=dead,context='FACES');bm.to_mesh(p.data);bm.free()
            elif 'twig' not in mat and n>WOOD:
                m=p.modifiers.new('d','DECIMATE');m.ratio=WOOD/n;bpy.context.view_layer.objects.active=p;bpy.ops.object.modifier_apply(modifier='d')
            print(' part',mat,n,'->',len(p.data.polygons),flush=True)
        bpy.ops.object.select_all(action='DESELECT')
        for p in parts:p.select_set(True)
        bpy.ops.export_scene.gltf(filepath=str(OUT/f'{name}_{tag}.glb'),export_format='GLB',use_selection=True,export_image_format='JPEG',export_jpeg_quality=85)
        print('DONE',name,tag,flush=True)
