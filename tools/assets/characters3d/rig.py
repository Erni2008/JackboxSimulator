"""blender -b -P rig.py -- [names]: TripoSR OBJ -> phone-light rigged .glb (≈5k tris, 512px texture) with idle/run/jump/stun clips."""
import bpy,sys,math,os,mathutils
ROOT=os.path.abspath(os.path.join(os.path.dirname(__file__),'../../..'));SRC=f'{ROOT}/source_assets/characters3d/triposr';OUT=os.environ.get('OUT',f'{ROOT}/web/race/chars')
names=sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else []
names=names or ['skeleton','dracula','pumpkin','voodoo','ghost','zombie','plague_doctor','puppeteer']
os.makedirs(OUT,exist_ok=True);H=1.55;TRIS=6000;TEX=512
for n in names:
    bpy.ops.wm.read_factory_settings(use_empty=True)
    P=os.environ.get('PREP',f'{ROOT}/source_assets/characters3d/prep')
    bpy.ops.wm.obj_import(filepath=f'{P}/{n}_lo_uv.obj',forward_axis='Y',up_axis='Z');o=bpy.context.selected_objects[0];bpy.context.view_layer.objects.active=o
    o.rotation_euler=(0,0,0);o.name=n
    img=bpy.data.images.load(f'{P}/{n}_lo.png');img.scale(int(os.environ.get('TEXSZ','1024')),int(os.environ.get('TEXSZ','1024')));ml=bpy.data.materials.new(n);ml.use_nodes=True;tn=ml.node_tree.nodes.new('ShaderNodeTexImage');tn.image=img
    bl=ml.node_tree.nodes['Principled BSDF'];ml.node_tree.links.new(tn.outputs[0],bl.inputs['Base Color']);bl.inputs['Roughness'].default_value=float(os.environ.get('ROUGH','.75'))
    ml.use_backface_culling=False;o.data.materials.clear();o.data.materials.append(ml)
    bpy.ops.object.mode_set(mode='EDIT');bpy.ops.mesh.select_all(action='SELECT');bpy.ops.mesh.normals_make_consistent(inside=False);bpy.ops.object.mode_set(mode='OBJECT')
    bpy.ops.object.shade_smooth()
    # armature
    ghost=n=='ghost'
    bpy.ops.object.armature_add(location=(0,0,0));arm=bpy.context.object;arm.name='rig';bpy.ops.object.mode_set(mode='EDIT');eb=arm.data.edit_bones;eb.remove(eb[0])
    def bone(name,h,t,parent=None):
        e=eb.new(name);e.head=h;e.tail=t
        if parent:e.parent=eb[parent]
        return e
    bone('hips',(0,0,.30*H),(0,0,.42*H));bone('spine',(0,0,.42*H),(0,0,.56*H),'hips');bone('head',(0,0,.56*H),(0,0,.95*H),'spine')
    for sd,x in (('L',1),('R',-1)):
        bone('arm.'+sd,(x*.13*H,0,.52*H),(x*.30*H,0,.36*H),'spine')
        if not ghost:bone('leg.'+sd,(x*.07*H,0,.30*H),(x*.07*H,0,.02*H),'hips')
    bpy.ops.object.mode_set(mode='OBJECT')
    o.select_set(True);arm.select_set(True);bpy.context.view_layer.objects.active=arm
    bpy.ops.object.parent_set(type='ARMATURE_NAME')
    # weights: inverse distance to each bone segment, top-2 blend (robust on noisy AI meshes)
    segs=[(bn.name,bn.head_local.copy(),bn.tail_local.copy()) for bn in arm.data.bones]
    groups={nm:(o.vertex_groups.get(nm) or o.vertex_groups.new(name=nm)) for nm,_,_ in segs}
    for v in o.data.vertices:
        p=v.co;ds=[]
        for nm,h,t in segs:
            ab=t-h;u=max(0,min(1,(p-h).dot(ab)/max(1e-9,ab.dot(ab))));d=(p-(h+ab*u)).length
            if nm.startswith('head') and p.z>h.z:d*=.35   # everything above the neck is head
            if nm.startswith('leg') and p.z>.33*H:d*=3
            if nm.startswith('arm') and abs(p.x)<.1*H:d*=2.5
            ds.append((d,nm))
        ds.sort();w=[1/max(1e-4,d)**4 for d,_ in ds[:2]];tot=sum(w)
        for (d,nm),wi in zip(ds[:2],w):groups[nm].add([v.index],wi/tot,'REPLACE')
    # clips
    pb=arm.pose.bones
    for p in pb:p.rotation_mode='XYZ'
    def clip(name,frames,keys):
        act=bpy.data.actions.new(name);arm.animation_data_create();arm.animation_data.action=act
        for f,pose in keys:
            for p in pb:p.rotation_euler=(0,0,0);p.location=(0,0,0)
            for bn,(rx,ry,rz) in pose.items():
                if bn=='loc':pb['hips'].location=(0,rz,0);continue  # bone-local Y = world up for vertical hips
                if bn in pb:pb[bn].rotation_euler=(math.radians(rx),math.radians(ry),math.radians(rz))
            for p in pb:p.keyframe_insert('rotation_euler',frame=f);p.keyframe_insert('location',frame=f)
        tr=arm.animation_data.nla_tracks.new();tr.name=name;tr.strips.new(name,1,act);arm.animation_data.action=None
    sw=38 if not ghost else 0
    clip('run',17,[(1,{'leg.L':(sw,0,0),'leg.R':(-sw,0,0),'arm.L':(0,-45,0),'arm.R':(0,45,0),'spine':(-8,0,4),'loc':(0,0,0)}),
                   (5,{'leg.L':(0,0,0),'leg.R':(0,0,0),'arm.L':(0,-10,0),'arm.R':(0,10,0),'spine':(-8,0,0),'loc':(0,0,.05)}),
                   (9,{'leg.L':(-sw,0,0),'leg.R':(sw,0,0),'arm.L':(0,45,0),'arm.R':(0,-45,0),'spine':(-8,0,-4),'loc':(0,0,0)}),
                   (13,{'leg.L':(0,0,0),'leg.R':(0,0,0),'arm.L':(0,10,0),'arm.R':(0,-10,0),'spine':(-8,0,0),'loc':(0,0,.05)}),
                   (17,{'leg.L':(sw,0,0),'leg.R':(-sw,0,0),'arm.L':(0,-45,0),'arm.R':(0,45,0),'spine':(-8,0,4),'loc':(0,0,0)})])
    clip('idle',49,[(1,{'spine':(0,0,0),'head':(0,0,0),'arm.L':(0,0,6),'arm.R':(0,0,-6)}),(25,{'spine':(3,0,0),'head':(-4,0,3),'arm.L':(0,0,12),'arm.R':(0,0,-12),'loc':(0,0,.015)}),(49,{'spine':(0,0,0),'head':(0,0,0),'arm.L':(0,0,6),'arm.R':(0,0,-6)})])
    clip('jump',13,[(1,{'leg.L':(-30,0,0),'leg.R':(20,0,0),'arm.L':(0,0,70),'arm.R':(0,0,-70),'spine':(-6,0,0)}),(13,{'leg.L':(-40,0,0),'leg.R':(30,0,0),'arm.L':(0,0,95),'arm.R':(0,0,-95),'spine':(-10,0,0)})])
    clip('stun',13,[(1,{'spine':(14,0,10),'head':(10,0,-14),'arm.L':(0,0,110),'arm.R':(0,0,-60),'leg.L':(-20,0,0)}),(7,{'spine':(14,0,-10),'head':(10,0,14),'arm.L':(0,0,60),'arm.R':(0,0,-110),'leg.R':(-20,0,0)}),(13,{'spine':(14,0,10),'head':(10,0,-14),'arm.L':(0,0,110),'arm.R':(0,0,-60),'leg.L':(-20,0,0)})])
    bpy.context.scene.render.fps=24
    for x in [x for x in bpy.context.scene.objects if x.type=='MESH' and x!=o]:bpy.data.objects.remove(x,do_unlink=True)
    bpy.ops.export_scene.gltf(filepath=f'{OUT}/{n}.glb',export_format='GLB',export_image_format='JPEG',export_jpeg_quality=82,export_animation_mode='NLA_TRACKS',export_draco_mesh_compression_enable=False)
    print('DONE',n,len(o.data.polygons),flush=True)
