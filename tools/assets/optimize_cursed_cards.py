"""Blender batch script: runtime copies of THE CURSED CARDS source models (sources stay untouched).
Run: /Applications/Blender.app/Contents/MacOS/Blender -b -P tools/assets/optimize_cursed_cards.py
Reads source_assets/models/cursed_cards/{shufle,chair}.glb and writes
assets/models/cursed_cards/<name>_{high,medium,low}.glb: decimated mesh (UVs kept), downsized JPEG maps.
"""
import bpy, os
ROOT=os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..'))
SRC=os.path.join(ROOT,'source_assets/models/cursed_cards')
# name: [(tier, max triangles (None = keep), max texture size)]
PROFILES={
    'shufle':[('high',24000,1024),('medium',12000,512),('low',6000,256)],
    'chair':[('high',5000,512),('medium',2500,512),('low',1200,256)],
}
for name,tiers in PROFILES.items():
    for tier,tris,tex in tiers:
        bpy.ops.wm.read_factory_settings(use_empty=True)
        bpy.ops.import_scene.gltf(filepath=os.path.join(SRC,name+'.glb'))
        for ob in [o for o in bpy.context.scene.objects if o.type=='MESH']:
            count=sum(len(p.vertices)-2 for p in ob.data.polygons)
            if tris and count>tris:
                bpy.context.view_layer.objects.active=ob
                mod=ob.modifiers.new('decimate','DECIMATE');mod.decimate_type='COLLAPSE';mod.ratio=tris/count;mod.use_collapse_triangulate=True
                bpy.ops.object.modifier_apply(modifier=mod.name)
            print(name,tier,'triangles',count,'->',sum(len(p.vertices)-2 for p in ob.data.polygons))
        for img in bpy.data.images:
            if img.size[0]>tex:img.scale(tex,tex)
        out=os.path.join(ROOT,'assets/models/cursed_cards/%s_%s.glb'%(name,tier))
        bpy.ops.export_scene.gltf(filepath=out,export_format='GLB',export_image_format='JPEG',export_jpeg_quality=82,export_apply=True,export_tangents=False)
        print('wrote',out,os.path.getsize(out))
# Glow masks are produced by tools/assets/cursed_cards_glow.py (plain Python).
