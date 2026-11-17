"""blender -b -P web_props.py: Poly Haven glTF props (+ the cage) -> phone-light glb in web/race/env (512px textures, tri budget)."""
import bpy,os
ROOT=os.path.abspath(os.path.join(os.path.dirname(__file__),'../../..'));SRC=f'{ROOT}/source_assets/race/ph/models';OUT=f'{ROOT}/web/race/env'
B={'wine_barrel_01':1500,'wooden_barrels_01':2500,'wooden_crate_01':600,'wooden_candlestick':600,'brass_candleholders':1500,'lantern_chandelier_01':3000,'large_castle_door':3000,'wooden_bookshelf_worn':2500,'wine_bottles_01':1500,'wooden_bucket_01':800,'caged_hanging_light':1500}
items=[(n,f'{SRC}/{n}/{n}.gltf',b) for n,b in B.items()]+[('cage',f'{ROOT}/cage.glb',4500)]
for name,path,budget in items:
    bpy.ops.wm.read_factory_settings(use_empty=True);bpy.ops.import_scene.gltf(filepath=path)
    meshes=[o for o in bpy.context.scene.objects if o.type=='MESH'];total=sum(len(o.data.polygons) for o in meshes)
    if total>budget:
        for o in meshes:
            bpy.context.view_layer.objects.active=o;d=o.modifiers.new('d','DECIMATE');d.ratio=budget/total;bpy.ops.object.modifier_apply(modifier='d')
    for im in bpy.data.images:
        if im.size[0]>512:im.scale(512,512)
    bpy.ops.export_scene.gltf(filepath=f'{OUT}/{name}.glb',export_format='GLB',export_image_format='JPEG',export_jpeg_quality=80)
    print('DONE',name,total,'->',sum(len(o.data.polygons) for o in meshes),flush=True)
