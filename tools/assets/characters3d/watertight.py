"""blender -b -P watertight.py -- in_dir out_dir [names]: rebuild each character as one closed (hole-free) smooth shell:
voxel remesh -> smooth -> decimate, colours sampled from the original texture into vertex colours (boosted), skin weights
transferred from the original; armature and clips kept."""
import bpy,sys,os,bmesh,colorsys
from mathutils.bvhtree import BVHTree
from mathutils.geometry import barycentric_transform
a=sys.argv[sys.argv.index('--')+1:];SRC,OUT=a[0],a[1];names=a[2:] or [f[:-4] for f in os.listdir(SRC) if f.endswith('.glb')]
for n in names:
    bpy.ops.wm.read_factory_settings(use_empty=True);bpy.ops.import_scene.gltf(filepath=f'{SRC}/{n}.glb')
    rig=[o for o in bpy.context.scene.objects if o.type=='ARMATURE'][0]
    src=max([o for o in bpy.context.scene.objects if o.type=='MESH'],key=lambda o:len(o.data.vertices))
    for o in [o for o in bpy.context.scene.objects if o.type=='MESH' and o!=src]:bpy.data.objects.remove(o,do_unlink=True)
    img=None
    for s in src.material_slots:
        for nd in s.material.node_tree.nodes:
            if nd.type=='TEX_IMAGE' and nd.image:img=nd.image
    W,H=img.size;px=list(img.pixels)
    # closed shell
    bpy.ops.object.select_all(action='DESELECT');src.select_set(True);bpy.context.view_layer.objects.active=src;bpy.ops.object.duplicate();new=bpy.context.object
    new.modifiers.clear();new.vertex_groups.clear()
    r=new.modifiers.new('r','REMESH');r.mode='VOXEL';r.voxel_size=.012;r.use_smooth_shade=True;bpy.ops.object.modifier_apply(modifier='r')
    sm=new.modifiers.new('s','SMOOTH');sm.iterations=4;sm.factor=.5;bpy.ops.object.modifier_apply(modifier='s')
    d=new.modifiers.new('d','DECIMATE');d.ratio=min(1,16000/len(new.data.polygons));bpy.ops.object.modifier_apply(modifier='d')
    bpy.ops.object.shade_smooth()
    # colours: closest point on the original -> its UV -> texture pixel
    dg=bpy.context.evaluated_depsgraph_get();bm=bmesh.new();bm.from_mesh(src.data);bm.faces.ensure_lookup_table();uvl=bm.loops.layers.uv.active;tree=BVHTree.FromBMesh(bm)
    col=new.data.color_attributes.new('Col','BYTE_COLOR','POINT')
    for v in new.data.vertices:
        loc,_,fi,_=tree.find_nearest(v.co)
        if fi is None:col.data[v.index].color=(.5,.5,.5,1);continue
        f=bm.faces[fi];l=f.loops;uv=barycentric_transform(loc,l[0].vert.co,l[1].vert.co,l[2].vert.co,l[0][uvl].uv.to_3d(),l[1][uvl].uv.to_3d(),l[2][uvl].uv.to_3d())
        x=min(W-1,max(0,int(uv.x*W)));y=min(H-1,max(0,int(uv.y*H)));i=(y*W+x)*4;c=px[i:i+3]
        h,s,val=colorsys.rgb_to_hsv(*c);s=min(1,s*1.5);val=min(1,val*1.2+.03);rr,gg,bb=colorsys.hsv_to_rgb(h,s,val)
        col.data[v.index].color=(rr,gg,bb,1)
    bm.free()
    # weights from the original
    dt=new.modifiers.new('w','DATA_TRANSFER');dt.object=src;dt.use_vert_data=True;dt.data_types_verts={'VGROUP_WEIGHTS'};dt.vert_mapping='POLYINTERP_NEAREST'
    bpy.context.view_layer.objects.active=new;bpy.ops.object.datalayout_transfer(modifier='w');bpy.ops.object.modifier_apply(modifier='w')
    bpy.ops.object.select_all(action='DESELECT');new.select_set(True);bpy.context.view_layer.objects.active=new
    bpy.ops.object.vertex_group_limit_total(group_select_mode='ALL',limit=4);bpy.ops.object.vertex_group_normalize_all(group_select_mode='ALL',lock_active=False)
    # keep the original object (transform, parent, armature modifier); just swap in the new mesh data
    old=src.data;src.data=new.data;bpy.data.objects.remove(new,do_unlink=True);bpy.data.meshes.remove(old);new=src
    m=bpy.data.materials.new(n);m.use_nodes=True;b=m.node_tree.nodes['Principled BSDF'];vc=m.node_tree.nodes.new('ShaderNodeVertexColor');vc.layer_name='Col'
    m.node_tree.links.new(vc.outputs['Color'],b.inputs['Base Color']);b.inputs['Roughness'].default_value=.6;new.data.materials.clear();new.data.materials.append(m)
    bpy.ops.export_scene.gltf(filepath=f'{OUT}/{n}.glb',export_format='GLB',export_animation_mode='ACTIONS')
    print('DONE',n,len(new.data.polygons),flush=True)
