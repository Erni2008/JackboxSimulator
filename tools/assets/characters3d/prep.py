"""blender -b -P prep.py -- [names]: TripoSR OBJ -> oriented/cleaned high OBJ + remeshed low OBJ (no UVs) in source_assets/characters3d/prep."""
import bpy,sys,math,os,mathutils
ROOT=os.path.abspath(os.path.join(os.path.dirname(__file__),'../../..'));SRC=f'{ROOT}/source_assets/characters3d/triposr';OUT=os.environ.get('PREP',f'{ROOT}/source_assets/characters3d/prep')
names=sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else []
names=names or ['skeleton','dracula','pumpkin','voodoo','ghost','zombie','plague_doctor','puppeteer']
os.makedirs(OUT,exist_ok=True);H=1.55;TRIS=int(os.environ.get('TRIS','9000'))
for n in names:
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.wm.obj_import(filepath=f'{SRC}/{n}.obj');o=bpy.context.selected_objects[0];bpy.context.view_layer.objects.active=o
    o.rotation_euler=(math.radians(90),0,math.radians(-90));bpy.ops.object.transform_apply(rotation=True)
    bpy.ops.object.mode_set(mode='EDIT');bpy.ops.mesh.select_all(action='DESELECT');bpy.ops.mesh.separate(type='LOOSE');bpy.ops.object.mode_set(mode='OBJECT')
    parts=sorted([x for x in bpy.context.scene.objects if x.type=='MESH'],key=lambda x:-len(x.data.vertices));big=len(parts[0].data.vertices)
    for x in parts[1:]:
        if len(x.data.vertices)<big*.02:bpy.data.objects.remove(x,do_unlink=True)
    keep=[x for x in bpy.context.scene.objects if x.type=='MESH'];bpy.ops.object.select_all(action='DESELECT')
    for x in keep:x.select_set(True)
    bpy.context.view_layer.objects.active=keep[0];bpy.ops.object.join();o=bpy.context.object
    bb=[o.matrix_world@mathutils.Vector(c) for c in o.bound_box];zmin=min(v.z for v in bb);zmax=max(v.z for v in bb);s=H/(zmax-zmin)
    o.scale=(s,s,s);bpy.ops.object.transform_apply(scale=True);SC=s
    bb=[mathutils.Vector(c) for c in o.bound_box];cx=sum(v.x for v in bb)/8;cy=sum(v.y for v in bb)/8;zmin=min(v.z for v in bb)
    o.location=(-cx,-cy,-zmin);bpy.ops.object.transform_apply(location=True);LOC=(-cx,-cy,-zmin)
    bpy.ops.wm.obj_export(filepath=f'{OUT}/{n}_hi.obj',export_selected_objects=True,export_materials=False,forward_axis='Y',up_axis='Z')
    raw=f'{SRC}/{n}_raw.ply'
    if os.path.exists(raw) and float(os.environ.get('REMESH','0'))>0:  # closed source for the shell, same transform as the textured mesh
        mw=o.matrix_world.copy();bpy.ops.wm.ply_import(filepath=raw,forward_axis='Y',up_axis='Z');lo=bpy.context.selected_objects[0]
        bpy.context.view_layer.objects.active=lo;lo.rotation_euler=(math.radians(90),0,math.radians(-90));bpy.ops.object.transform_apply(rotation=True)
        lo.scale=(SC,SC,SC);bpy.ops.object.transform_apply(scale=True);lo.location=LOC;bpy.ops.object.transform_apply(location=True)
        bpy.ops.object.select_all(action='DESELECT');lo.select_set(True);bpy.context.view_layer.objects.active=lo
        bpy.ops.object.mode_set(mode='EDIT');bpy.ops.mesh.select_all(action='SELECT');bpy.ops.mesh.separate(type='LOOSE');bpy.ops.object.mode_set(mode='OBJECT')
        pcs=sorted([x for x in bpy.context.selected_objects],key=lambda x:-len(x.data.vertices));bg=len(pcs[0].data.vertices)
        drop=[x for x in pcs[1:] if len(x.data.vertices)<bg*.02];pcs=[x for x in pcs if x not in drop]
        for x in drop:bpy.data.objects.remove(x,do_unlink=True)
        bpy.ops.object.select_all(action='DESELECT')
        for x in pcs:x.select_set(True)
        bpy.context.view_layer.objects.active=pcs[0];bpy.ops.object.join();lo=bpy.context.object
        b1=[lo.matrix_world@mathutils.Vector(c) for c in lo.bound_box];b2=[o.matrix_world@mathutils.Vector(c) for c in o.bound_box]
        print('BB',[round(min(v[i] for v in b1)-min(v[i] for v in b2),3) for i in range(3)],flush=True)
    else:
        bpy.ops.object.duplicate();lo=bpy.context.object
    bpy.ops.object.mode_set(mode='EDIT');bpy.ops.mesh.select_all(action='SELECT');bpy.ops.mesh.remove_doubles(threshold=1e-5);bpy.ops.mesh.normals_make_consistent(inside=False);bpy.ops.object.mode_set(mode='OBJECT')
    if float(os.environ.get('REMESH','0'))>0:  # closed shell: no holes possible
        r=lo.modifiers.new('r','REMESH');r.mode='VOXEL';r.voxel_size=float(os.environ['REMESH']);bpy.ops.object.modifier_apply(modifier='r')
        it=int(os.environ.get('SMOOTH','2'))
        if it:sm=lo.modifiers.new('s','SMOOTH');sm.iterations=it;sm.factor=.5;bpy.ops.object.modifier_apply(modifier='s')
    print('PRE',len(lo.data.polygons),flush=True)
    while len(lo.data.polygons)>TRIS*1.1:  # gentle steps: one huge collapse shreds the surface
        d=lo.modifiers.new('d','DECIMATE');d.ratio=max(.4,TRIS/len(lo.data.polygons));d.use_collapse_triangulate=True;bpy.ops.object.modifier_apply(modifier='d')
    bpy.ops.object.select_all(action='DESELECT');lo.select_set(True)
    bpy.ops.wm.obj_export(filepath=f'{OUT}/{n}_lo.obj',export_selected_objects=True,export_materials=False,export_uv=False,forward_axis='Y',up_axis='Z')
    print('DONE',n,len(lo.data.polygons),flush=True)
