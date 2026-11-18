"""blender -b -P smooth.py -- in_dir out_dir [names]: smooth the noisy TripoSR surfaces (keeps rig + clips) and make the textures richer."""
import bpy,sys,os
a=sys.argv[sys.argv.index('--')+1:];SRC,OUT=a[0],a[1];names=a[2:] or [f[:-4] for f in os.listdir(SRC) if f.endswith('.glb')]
for n in names:
    bpy.ops.wm.read_factory_settings(use_empty=True);bpy.ops.import_scene.gltf(filepath=f'{SRC}/{n}.glb')
    for o in [o for o in bpy.context.scene.objects if o.type=='MESH']:
        bpy.context.view_layer.objects.active=o;o.select_set(True)
        arm=[m for m in o.modifiers if m.type=='ARMATURE']
        bpy.ops.object.mode_set(mode='EDIT');bpy.ops.mesh.select_all(action='SELECT');bpy.ops.mesh.remove_doubles(threshold=.0015);bpy.ops.mesh.normals_make_consistent(inside=False);bpy.ops.object.mode_set(mode='OBJECT')
        sm=o.modifiers.new('ls','LAPLACIANSMOOTH');sm.iterations=0;sm.lambda_factor=.5;sm.use_volume_preserve=True;sm.use_normalized=True
        bpy.ops.object.modifier_move_to_index(modifier='ls',index=0);bpy.ops.object.modifier_apply(modifier='ls')
        cs=o.modifiers.new('sm','SMOOTH');cs.iterations=0;cs.factor=.4;bpy.ops.object.modifier_move_to_index(modifier='sm',index=0);bpy.ops.object.modifier_apply(modifier='sm')
        bpy.ops.object.shade_smooth()
        for slot in o.material_slots:
            m=slot.material
            if not m or not m.use_nodes:continue
            b=m.node_tree.nodes.get('Principled BSDF')
            if b:b.inputs['Roughness'].default_value=.55
            try:m.blend_method='OPAQUE'
            except Exception:pass
            if b and b.inputs['Alpha'].is_linked:m.node_tree.links.remove(b.inputs['Alpha'].links[0])
            if b:b.inputs['Alpha'].default_value=1
    import subprocess
    for im in bpy.data.images:
        if im.size[0]==0:continue
        tmp=f'/tmp/_tex_{n}_{im.name}.png'.replace(' ','_');im.filepath_raw=tmp;im.file_format='PNG';im.save()
        subprocess.run(['python3','-c',"""
import sys;from PIL import Image,ImageFilter,ImageEnhance
p=sys.argv[1];im=Image.open(p).convert('RGB')
im=im.filter(ImageFilter.MedianFilter(3))
im=im.filter(ImageFilter.GaussianBlur(.6));im=ImageEnhance.Color(im).enhance(1.55);im=ImageEnhance.Brightness(im).enhance(1.15);im=ImageEnhance.Contrast(im).enhance(1.1)
im.save(p)""",tmp],check=True)
        im.reload();im.alpha_mode='NONE'
        if im.size[0]>512:im.scale(512,512)
    bpy.ops.export_scene.gltf(filepath=f'{OUT}/{n}.glb',export_format='GLB',export_image_format='JPEG',export_jpeg_quality=85,export_animation_mode='ACTIONS')
    print('DONE',n,flush=True)
