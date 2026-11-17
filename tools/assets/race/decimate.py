"""Blender headless: Poly Haven glTF -> light .glb for the race mode. blender -b -P decimate.py"""
import bpy,pathlib,sys
ROOT=pathlib.Path(__file__).resolve().parents[3];SRC=ROOT/'source_assets/race/ph/models';OUT=ROOT/'assets/race/models'
BUDGET={'fir_tree_01':30000,'pine_tree_01':30000,'grass_medium_01':4000,'fern_02':4000,'shrub_01':8000,'moss_01':3000}
OUT.mkdir(parents=True,exist_ok=True)
only=sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else []
for d in sorted(SRC.iterdir()):
    if only and d.name not in only:continue
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=str(d/f'{d.name}.gltf'))
    meshes=[o for o in bpy.context.scene.objects if o.type=='MESH']
    tris=sum(sum(len(p.vertices)-2 for p in o.data.polygons) for o in meshes)
    target=BUDGET.get(d.name,10000);ratio=min(1,target/max(1,tris))
    if ratio<1:
        for o in meshes:
            m=o.modifiers.new('dec','DECIMATE');m.ratio=ratio
            bpy.context.view_layer.objects.active=o;bpy.ops.object.modifier_apply(modifier='dec')
    after=sum(sum(len(p.vertices)-2 for p in o.data.polygons) for o in meshes)
    bpy.ops.export_scene.gltf(filepath=str(OUT/f'{d.name}.glb'),export_format='GLB',export_image_format='JPEG',export_jpeg_quality=85)
    print(f'DONE {d.name} {tris} -> {after}',flush=True)
