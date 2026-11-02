"""Blender batch script: lightweight runtime copies of shufle.glb (source stays untouched).
Run: /Applications/Blender.app/Contents/MacOS/Blender -b -P tools/assets/optimize_cursed_cards.py
Writes assets/models/cursed_cards/shufle_{high,medium,low}.glb: decimated mesh (UVs kept), downsized textures.
"""
import bpy, os
ROOT=os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..'))
SRC=os.path.join(ROOT,'source_assets/models/cursed_cards/shufle.glb')
PROFILES=[('high',120000,2048),('medium',45000,1024),('low',16000,512)]
for name,tris,tex in PROFILES:
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=SRC)
    for ob in [o for o in bpy.context.scene.objects if o.type=='MESH']:
        bpy.context.view_layer.objects.active=ob
        count=sum(len(p.vertices)-2 for p in ob.data.polygons)
        mod=ob.modifiers.new('decimate','DECIMATE');mod.decimate_type='COLLAPSE';mod.ratio=min(1.0,tris/count);mod.use_collapse_triangulate=True
        bpy.ops.object.modifier_apply(modifier=mod.name)
        print(name,'triangles',count,'->',sum(len(p.vertices)-2 for p in ob.data.polygons))
    for img in bpy.data.images:
        if img.size[0]>tex:img.scale(tex,tex)
    out=os.path.join(ROOT,'assets/models/cursed_cards/shufle_%s.glb'%name)
    bpy.ops.export_scene.gltf(filepath=out,export_format='GLB',export_image_format='JPEG',export_jpeg_quality=88,export_apply=True,export_tangents=False)
    print('wrote',out,os.path.getsize(out))
# Glow masks are produced by tools/assets/cursed_cards_glow.py (plain Python, run after this script).
